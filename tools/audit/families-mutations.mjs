#!/usr/bin/env node
// FAMILIES, MUTATIONS — would the suite notice if a measurement broke? AUDIT ONLY, writes nothing in this repository.
//
// `tools/audit/families.test.mjs` is only worth what it catches. This breaks `tools/audit/families.mjs` on purpose, one
// change at a time, in a temporary copy of `tools/`, and runs the suite against each break:
//
//   node tools/audit/families-mutations.mjs              # every break (about 3 seconds each)
//   node tools/audit/families-mutations.mjs step spec    # only the breaks whose label contains one of these words
//   node tools/audit/families-mutations.mjs --list       # the labels, without running anything
//
// A break the suite does not fail on is a gap in the tests — unless it is marked `equivalent`, which means the change
// cannot alter any result and no test could tell (the reason is printed). The command exits 1 when a break survives that
// is not equivalent, when a pattern is no longer found in the tool (the list needs updating), or when the unbroken copy
// does not pass. docs/audit/findings-families.md §0 quotes the totals this prints.
//
// The copy's test file is pointed at THIS repository so that the tests which archive the pin (`git archive 5933041`)
// still run; the copy is deleted afterwards.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');

/** One change each. `old` is a piece of the tool's source, `new` what replaces it; `equivalent` says why none of them matters. */
export const MUTATIONS = [
  { label: "stepRow: small step sign flipped",
    old: "row.stepSmall = L.default - L.small;",
    new: "row.stepSmall = L.small - L.default;" },
  { label: "stepRow: large step uses the small",
    old: "row.stepLarge = L.large - L.default;",
    new: "row.stepLarge = L.default - L.small;" },
  { label: "stepRow: devSmall forced to 0",
    old: "row.devSmall = row.stepSmall - want;",
    new: "row.devSmall = 0;" },
  { label: "stepRow: stepSmall set to want",
    old: "row.stepSmall = L.default - L.small; row.devSmall = row.stepSmall - want;",
    new: "row.stepSmall = want; row.devSmall = row.stepSmall - want;" },
  { label: "stepRow: devLarge forced to 0",
    old: "row.devLarge = row.stepLarge - want;",
    new: "row.devLarge = 0;" },
  { label: "stepRow ignores the spec",
    old: "const want = spec.SIZE_STEP[master], row",
    new: "const want = SIZE_STEP_DEFAULT[master], row" },
  { label: "sizeReport: steps not counted",
    old: "markCells: marks.reduce((n, f) => n + f.cells.length, 0), steps: devs.length,",
    new: "markCells: marks.reduce((n, f) => n + f.cells.length, 0), steps: 0," },
  { label: "sizeReport passes no spec to stepRow",
    old: "cells.push({ style, ...stepRow(m, L, specOf(set)) });",
    new: "cells.push({ style, ...stepRow(m, L) });" },
  { label: "longSide becomes the width",
    old: "export const longSide = (b) => Math.max(b.w ?? b.x1 - b.x0, b.h ?? b.y1 - b.y0);",
    new: "export const longSide = (b) => (b.w ?? b.x1 - b.x0);" },
  { label: "sizeFamilies: base off by one",
    old: "const base = name.slice(0, -(p.size.length + 1));",
    new: "const base = name.slice(0, -(p.size.length));" },
  { label: "loadSpec always the default",
    old: "return { SIZE_STEP: m.SIZE_STEP, MASTERS: m.MASTERS, source: `${file}` };",
    new: "return { ...DEFAULT_SPEC };" },
  { label: "specEqual always true",
    old: "export const specEqual = (a, b) => JSON.stringify([a.SIZE_STEP, a.MASTERS]) === JSON.stringify([b.SIZE_STEP, b.MASTERS]);",
    new: "export const specEqual = () => true;" },
  { label: "containerSame compares nothing",
    old: "containerSame: Math.abs(boxLong(d.container) - boxLong(s.container)) < 1e-9 && d.container.x0 === s.container.x0 && d.container.y0 === s.container.y0\n            && (d.containerD == null || d.containerD === s.containerD),",
    new: "containerSame: true," },
  { label: "partsOf filled takes the smallest as the disc",
    old: ".sort((p, q) => boxArea(q.b) - boxArea(p.b));",
    new: ".sort((p, q) => boxArea(p.b) - boxArea(q.b));" },
  { label: "lint reading drops the difference",
    old: "maxDiff = Math.max(maxDiff, Math.abs((r.size ?? 0) - exact.get(k)));",
    new: "maxDiff = 0;" },
  { label: "lint warnings filter drops C8",
    old: "if (r.warnings.some((w) => /C8|variant has no default/.test(w))) warned.push",
    new: "if (false) warned.push" },
  { label: "runs: gap loop stops one number early",
    old: "for (let k = 1; k <= max; k++) if (!numbers.includes(k)) gaps.push(k);",
    new: "for (let k = 1; k < max; k++) if (!numbers.includes(k)) gaps.push(k);",
    equivalent: "the last number of a run is always present, so stopping the loop one short changes nothing" },
  { label: "runs: gaps start at 2",
    old: "for (let k = 1; k <= max; k++) if (!numbers.includes(k)) gaps.push(k);",
    new: "for (let k = 2; k <= max; k++) if (!numbers.includes(k)) gaps.push(k);" },
  { label: "runs include the sized members",
    old: "    if (p.size) continue;\n    if (!by.has(p.stem))",
    new: "    if (!by.has(p.stem))" },
  { label: "fold: users removed",
    old: "  if (/^users(-\\d+)?(-(behind|wide|level))?$/.test(name.replace(/-(small|large)$/, ''))) return 'users';\n",
    new: "" },
  { label: "fold: volume removed",
    old: "  if (/^volume-/.test(stem)) return 'volume';\n",
    new: "" },
  { label: "fold: face removed",
    old: "  if (/^face-/.test(stem)) return 'face';\n",
    new: "" },
  { label: "identity: whole ignores the filled",
    old: "const key = kind === 'outline' ? o : `${o}||${f}`;",
    new: "const key = o;" },
  { label: "identity: twins from the first master only",
    old: "const s = MASTER_LIST.map((m) => sig(m, n, false) ?? '').join('|');",
    new: "const s = MASTER_LIST.slice(0, 1).map((m) => sig(m, n, false) ?? '').join('|');" },
  { label: "tags: antonym check disabled",
    old: "if (toks.includes(own) && tags.includes(other) && !tags.includes(own)) faults.push",
    new: "if (false) faults.push" },
  { label: "tags: own words ignore the default",
    old: "const mine = uniq(v.t.filter((t) => !def.has(t)));",
    new: "const mine = uniq(v.t);" },
  { label: "tags: same-tag pairs only adjacent",
    old: "for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) if (key(ts[i].t) === key(ts[j].t))",
    new: "for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < Math.min(ts.length, i + 2); j++) if (key(ts[i].t) === key(ts[j].t))" },
  { label: "tags: kind 1 leaves out the no-own-word shapes",
    old: "against: uniq([...identicalConcepts, ...noOwn, ...faults.map((f) => f.name)]),",
    new: "against: uniq([...identicalConcepts, ...faults.map((f) => f.name)])," },
  { label: "tags: kind 1 absorbs the users group",
    old: "against: uniq([...identicalConcepts, ...noOwn, ...faults.map((f) => f.name)]),",
    new: "against: uniq([...identicalConcepts, ...noOwn, ...faults.map((f) => f.name), ...lacking])," },
  { label: "travel: tick compared by key, not shape",
    old: "circles.filter((c) => canon(tick(c)).shape === s)",
    new: "circles.filter((c) => canon(tick(c)).key === canon(tick(cb)).key)" },
  { label: "ruleText: the approval-order pattern broken",
    old: "'approval order': /approval order/i,",
    new: "'approval order': /approval orderX/i," },
  { label: "ruleText: the composite pattern broken",
    old: "'numbered after the shape': /numbered after the shape/i,",
    new: "'numbered after the shape': /numbered after the shapeX/i," },
  { label: "layout: mirrorY is the identity",
    old: "mirrorY: (m, [x, y]) => [x, m - y],           // top to bottom",
    new: "mirrorY: (m, [x, y]) => [x, y]," },
  { label: "layout: turn distance one way only",
    old: "return Math.max(side(A, B, TURNS[turn]), side(B, A, TURNS[inverse]));",
    new: "return side(A, B, TURNS[turn]);" },
  { label: "layout: inverse of a quarter turn is itself",
    old: "quarterCW: 'quarterCCW', quarterCCW: 'quarterCW' }[turn];",
    new: "quarterCW: 'quarterCW', quarterCCW: 'quarterCW' }[turn];" },
  { label: "layout: samples matched to a whole unit",
    old: "const key = ([x, y]) => `${Math.round(x * 1e5)},${Math.round(y * 1e5)}`;",
    new: "const key = ([x, y]) => `${Math.round(x * 1)},${Math.round(y * 1)}`;" },
  { label: "layout: filled style skipped",
    old: "for (const n of ['', '-2', '-3', '-4']) for (const style of STYLES) for (const m of MASTER_LIST) {",
    new: "for (const n of ['', '-2', '-3', '-4']) for (const style of ['outline']) for (const m of MASTER_LIST) {" },
  { label: "sheet: a queued base counted as shipped",
    old: "const shipped = withBase.filter((r) => have.has(r.variantOf)), queuedBase = withBase.filter((r) => !have.has(r.variantOf));",
    new: "const shipped = withBase, queuedBase = [];" },
  { label: "sheet: the near-style list emptied",
    old: "export const NEAR_STYLE_WORDS = ['open', 'closed', 'wide', 'narrow', 'tall', 'short'];",
    new: "export const NEAR_STYLE_WORDS = [];" },
  { label: "sheet: the named style list emptied",
    old: "export const STYLE_WORDS = ['dotted', 'dashed', 'horizontal', 'vertical', 'stacked'];",
    new: "export const STYLE_WORDS = [];" },
  { label: "figures: defaults regex dropped",
    old: "words: (html.match(/const WORDS = \\(q\\.get\\('words'\\) \\?\\? '([^']+)'\\)/)?.[1] ?? '').split(',').filter(Boolean),",
    new: "words: []," },
  { label: "figures: the page drops the figure number",
    old: "col === 'group' ? `${group}${n}` : `${group}${n}-${col}`; };",
    new: "col === 'group' ? `${group}${n}` : `${group}-${col}`; };" },
  { label: "levels: inside check dropped",
    old: "const inside = b.x0 >= fb.x0 - 0.01 && b.x1 <= fb.x1 + 0.01 && b.y0 >= fb.y0 - 0.01 && b.y1 <= fb.y1 + 0.01;",
    new: "const inside = true;" },
  { label: "levels: outside-in always true",
    old: "outsideIn: dropped.every((d) => kept.every((k) => d.x0 >= k.x1 - 1e-9))",
    new: "outsideIn: true" },
  { label: "levels: amount scan ignores the stems",
    old: "}).filter((r) => r.words.length || r.stems.length);",
    new: "}).filter((r) => r.words.length);" },
  { label: "grid: expected is 3 per concept",
    old: "expected: names.length * 6",
    new: "expected: names.length * 3" },
  { label: "boxes: one box = at any master",
    old: "const kind = outline.every((x) => x === 1) ? 'one' : outline.some((x) => x === 1) ? 'some' : 'none';",
    new: "const kind = outline.some((x) => x === 1) ? 'one' : 'none';" },
  { label: "boxes: keyline tolerance 0.6",
    old: "Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5)?.[0] ?? null;",
    new: "Math.abs(w - kw) <= 0.6 && Math.abs(h - kh) <= 0.6)?.[0] ?? null;" },
  { label: "boxes: keyline tolerance 0.51",
    old: "Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5)?.[0] ?? null;",
    new: "Math.abs(w - kw) <= 0.51 && Math.abs(h - kh) <= 0.51)?.[0] ?? null;" },
  { label: "boxes: keyline tolerance 0.45",
    old: "Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5)?.[0] ?? null;",
    new: "Math.abs(w - kw) <= 0.45 && Math.abs(h - kh) <= 0.45)?.[0] ?? null;" },
  { label: "boxes: keyline ignores the spec",
    old: "const keylines = Object.entries(spec.MASTERS[master].keylines)",
    new: "const keylines = Object.entries(DEFAULT_SPEC.MASTERS[master].keylines)" },
  { label: "boxes: tolerance 0 (B = A)",
    old: "export const BOX_TOLERANCE = 1;",
    new: "export const BOX_TOLERANCE = 0;" },
  { label: "boxes: tolerance 2",
    old: "export const BOX_TOLERANCE = 1;",
    new: "export const BOX_TOLERANCE = 2;" },
  { label: "boxes: spread uses min-max sign-free (width only)",
    old: "export const spreadOf = (boxes) => [boxes.map((b) => hundredths(b.w)), boxes.map((b) => hundredths(b.h))].map((v) => Math.max(...v) - Math.min(...v));",
    new: "export const spreadOf = (boxes) => [boxes.map((b) => hundredths(b.w)), boxes.map((b) => hundredths(b.w))].map((v) => Math.max(...v) - Math.min(...v));" },
  { label: "boxes: withinTolerance checks one side",
    old: "export const withinTolerance = (boxes, tolerance = BOX_TOLERANCE) => spreadOf(boxes).every((d) => d <= tolerance);",
    new: "export const withinTolerance = (boxes, tolerance = BOX_TOLERANCE) => spreadOf(boxes)[0] <= tolerance;" },
];

const TEST_REPO_LINE = "const REPO = resolve(HERE, '../..');";
const failsOf = (stdout) => Number(stdout.match(/ℹ fail (\d+)/)?.[1] ?? NaN);

function main(argv) {
  const only = argv.filter((a) => !a.startsWith('--'));
  if (argv.includes('--list')) { for (const m of MUTATIONS) console.log(m.label); return 0; }
  const tool = readFileSync(join(REPO, 'tools/audit/families.mjs'), 'utf8');
  const tmp = mkdtempSync(join(tmpdir(), 'families-mutations-'));
  try {
    cpSync(join(REPO, 'tools'), join(tmp, 'tools'), { recursive: true });
    const testPath = join(tmp, 'tools/audit/families.test.mjs'), toolPath = join(tmp, 'tools/audit/families.mjs');
    const test = readFileSync(testPath, 'utf8');
    if (!test.includes(TEST_REPO_LINE)) { console.error(`cannot point the copy's tests at this repository: "${TEST_REPO_LINE}" is not in families.test.mjs`); return 1; }
    writeFileSync(testPath, test.replace(TEST_REPO_LINE, `const REPO = ${JSON.stringify(REPO)};`));
    const run = () => spawnSync('node', ['--test', 'tools/audit/families.test.mjs'], { cwd: tmp, encoding: 'utf8' });
    const base = run();
    const baseFails = failsOf(base.stdout), baseTests = Number(base.stdout.match(/ℹ tests (\d+)/)?.[1] ?? NaN);
    console.log(`unbroken copy: ${baseTests} tests, ${baseFails} fail${baseFails === 0 ? '' : ' — nothing to measure until the suite passes'}`);
    if (baseFails !== 0) return 1;
    let caught = 0, ran = 0;
    const survived = [], missing = [];
    for (const m of MUTATIONS) {
      if (only.length && !only.some((w) => m.label.includes(w))) continue;
      if (!tool.includes(m.old)) { console.log(`${m.label.padEnd(64)} PATTERN NOT FOUND`); missing.push(m.label); continue; }
      writeFileSync(toolPath, tool.replace(m.old, m.new));
      const r = run(), fails = failsOf(r.stdout);
      ran++;
      const isCaught = fails !== 0;       // a crash that stops the suite counts as caught: NaN !== 0
      if (isCaught) caught++; else survived.push(m);
      console.log(`${m.label.padEnd(64)} ${isCaught ? 'caught' : m.equivalent ? 'survived (equivalent)' : 'SURVIVED'}${Number.isFinite(fails) ? ` (${fails} fail)` : ''}`);
    }
    const bad = survived.filter((m) => !m.equivalent);
    console.log(`\n${ran} deliberate breaks of tools/audit/families.mjs: ${caught} fail the suite; ${survived.length} survive${survived.length ? ` — ${survived.map((m) => `${m.label}${m.equivalent ? ` [equivalent: ${m.equivalent}]` : ' [NOT equivalent: a gap in the tests]'}`).join('; ')}` : ''}${missing.length ? `; ${missing.length} pattern(s) no longer found: ${missing.join('; ')}` : ''}`);
    return bad.length || missing.length ? 1 : 0;
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}
process.exitCode = main(process.argv.slice(2));
