// Tests for tools/audit/register-probe.mjs — the shared core of the four register probes (card
// "reprint"). Synthetic fixtures only: hand-written path strings and SVG texts, and a tiny fake pin in a
// temp directory (its tools/ are copies of this repo's lint.mjs, geometry.mjs and masters.mjs, so the
// in-memory lint run is the real lint). Nothing under research/ or any real pin is read.
// Run: node --test tools/audit/register-probe.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { extractFile } from './notes.mjs';
import { radiiOf } from './radii.mjs';
import { iconFromSource } from './angles.mjs';
import { regionOf, iconFromText } from './raster.mjs';
import {
  parseHeadline, centringBands, runLint, noteCensus, compositionOf, quarterOf, radiusVocabulary, strictContainers,
  looseContainers, conceptsAtRadius, isDefault, ungranted, parallelStack, stackKind, sampleEverything, clearRun, clearPixels,
  identicalGroups, pathsText, canonicalKey, scalingTest, offGridFacts, commentFacts, pairCensus, weightSplit, filledKinds,
  edgeGaps, smallestGap, cornerPairs16, loadSet, Ctx,
} from './register-probe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const PROBE = join(HERE, 'register-probe.mjs');

// ── fixtures ───────────────────────────────────────────────────────────────

const svg = (m, w, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
const AREA = (d) => `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;
const W = { 24: 1.5, 20: 1.5, 16: 1.25 }, FW = { 24: 2.5, 20: 2, 16: 2 };

/** A rounded square, centreline (a,a)-(b,b), radius r. */
const roundRect = (a, b, r) => `M${a + r} ${a}H${b - r}A${r} ${r} 0 0 1 ${b} ${a + r}V${b - r}A${r} ${r} 0 0 1 ${b - r} ${b}H${a + r}A${r} ${r} 0 0 1 ${a} ${b - r}V${a + r}A${r} ${r} 0 0 1 ${a + r} ${a}Z`;

/** Two concepts at three masters: `minus` (a line-heavy mark) and `box` (a container whose filled
 *  contour at 16 sits 0.125 wide of the outline's outer corner, and exact at 24 and 20). */
function fakeFiles() {
  const f = {};
  const span = { 24: [5.25, 18.75], 20: [4.25, 15.75], 16: [2.625, 13.375] };
  for (const m of [24, 20, 16]) {
    const [x0, x1] = span[m], mid = m / 2;
    f[`${m}/minus.svg`] = svg(m, W[m], `  <!-- keyline: mark -->\n  <!-- tags: subtract -->\n  <path d="M${x0} ${mid}H${x1}"/>`);
    const pull = (FW[m] - W[m]) / 2;
    f[`${m}/minus-filled.svg`] = svg(m, FW[m], `  <!-- grows: 0 0 ${pull} ${pull} -->\n  <!-- keyline: mark -->\n  <!-- tags: subtract -->\n  <path d="M${x0 + pull} ${mid}H${x1 - pull}"/>`);
  }
  const box = { 24: [3, 21, 2.5, 0.75, 3.25], 20: [3, 17, 2, 0.75, 2.75], 16: [3, 13, 1.5, 0.625, 2.25] };
  for (const [m, [a, b, r, h, rf]] of Object.entries(box)) {
    f[`${m}/box.svg`] = svg(Number(m), W[m], `  <!-- tags: square -->\n  <path d="${roundRect(a, b, r)}"/>`);
    f[`${m}/box-filled.svg`] = svg(Number(m), W[m], `  <!-- tags: square -->\n${AREA(roundRect(a - h, b + h, rf))}`);
  }
  return f;
}

function fakePin(files = fakeFiles()) {
  const dir = mkdtempSync(join(tmpdir(), 'register-probe-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, 'src/icons', rel)), { recursive: true });
    writeFileSync(join(dir, 'src/icons', rel), text);
  }
  mkdirSync(join(dir, 'tools'));
  for (const t of ['lint.mjs', 'geometry.mjs', 'masters.mjs']) copyFileSync(join(REPO, 'tools', t), join(dir, 'tools', t));
  return dir;
}

// ── lint's headline and the centring bands ─────────────────────────────────

test('parseHeadline reads each kind of headline lint prints, and the centre', () => {
  assert.deepEqual(parseHeadline('20×18  fits landscape keyline  centre 12,12.25'), { w: 20, h: 18, kind: 'landscape', cx: 12, cy: 12.25, what: 'fits landscape keyline' });
  assert.equal(parseHeadline('15×1.5  declared mark  centre 12,12').kind, 'mark');
  assert.equal(parseHeadline('14×20  agreed box  centre 12,12').kind, 'box');
  assert.equal(parseHeadline('9×12  anchored to volume  centre 10,12').kind, 'anchored');
  assert.equal(parseHeadline('9×12  no keyline match  centre 12,12').kind, 'none');
  assert.equal(parseHeadline('optical shift 0, 0.5'), null);
});

test('centringBands takes the larger axis, excludes anchored members, and bands at 0.01 / 0.10 / 0.25 / 0.50', () => {
  const row = (cx, cy, kind = 'circle') => ({ cx, cy, mid: 12, kind });
  const b = centringBands([row(12, 12), row(12.02, 12), row(12, 11.8), row(12.3, 12), row(12.5, 11.9), row(14, 14, 'anchored')]);
  assert.equal(b.total, 5);
  assert.deepEqual([b.over001, b.over010, b.over025, b.at050, b.over050], [4, 3, 2, 1, 0]);
});

test('runLint mirrors run(): marks, summary, exit code and byte count, without touching the per-file results', () => {
  const L = {
    lintSource: () => { throw new Error('not called when perFile is given'); },
    checkFamilies: (r) => r, checkAnchors: (r) => r,
    checkPairs: (r) => { for (const v of r.values()) v.warnings.push('added by a directory check'); return r; },
  };
  const per = new Map([['24/a.svg', { errors: [], warnings: [], notes: ['1×1  declared mark  centre 12,12'] }],
    ['24/b.svg', { errors: ['bad'], warnings: [], notes: [] }]]);
  const run = runLint(L, [{ m: 24, file: 'a.svg' }, { m: 24, file: 'b.svg' }], per);
  assert.deepEqual(run.summary, { drawings: 2, clean: 0, warned: 1, failed: 1 });
  assert.equal(run.exit, 1);
  assert.equal(per.get('24/a.svg').warnings.length, 0, 'the cached result is cloned, not mutated');
  assert.equal(run.bytes, run.lines.reduce((s, l) => s + Buffer.byteLength(l) + 1, 0));
  assert.match(run.lines.at(-1), /^\n2 drawings · .*0 clean.* · .*1 warned.* · .*1 failed/);
  const empty = runLint(L, []);
  assert.deepEqual([empty.summary.drawings, empty.exit], [0, 0]);
});

// ── notes ──────────────────────────────────────────────────────────────────

test('noteCensus counts files and concepts per note, the dot/numeral split, co-occurrence and the concepts with none', () => {
  const rec = (m, file, notes) => extractFile(svg(m, 1.5, `${notes.map((x) => `  <!-- ${x} -->`).join('\n')}\n  <path d="M6 12H18"/>`), m, file);
  const records = [
    rec(24, 'a.svg', ['tags: x', 'keyline: mark', 'optical: 0 0.5']),
    rec(24, 'a-filled.svg', ['tags: x', 'keyline: mark', 'optical: 0 0.5', 'grows: 0 0 0.5 0.5']),
    rec(24, 'b.svg', ['tags: y', 'box: 14x20', 'optical: 0.1 0', 'glyph: dot', 'gap: 1']),
    rec(24, 'c.svg', ['glyph: numeral']),
    rec(24, 'd.svg', ['tags: z']),
    rec(24, 'e.svg', ['keyline: wide']),
  ];
  const c = noteCensus(records);
  assert.deepEqual([c.tags.files, c.tags.concepts, c.keyline.files, c.keyline.concepts], [4, 3, 2, 1], 'a keyline word other than mark is no mark');
  assert.deepEqual([c.glyphDot.files, c.glyphDot.concepts, c.glyphNumeral.files, c.glyphNumeral.conceptList], [1, 1, 1, ['c']]);
  assert.deepEqual([c.anyNonTag.concepts, c.anyNonTag.none, c.anyNonTag.of], [3, 2, 5], 'a glyph note alone counts; `keyline: wide` does not');
  assert.deepEqual([c.co.markOptical, c.co.markGrows, c.co.boxOpticalDot, c.co.boxGap, c.co.markBox], [['a'], ['a'], ['b'], ['b'], []]);
});

test('compositionOf: concepts, marks, boxes, and the rest held to a keyline', () => {
  assert.deepEqual(compositionOf(['<!-- keyline: mark -->', '<!-- box: 2x2 -->', 'plain', 'plain']), { concepts: 4, mark: 1, box: 1, held: 2 });
});

test('offGridFacts and commentFacts read notes.mjs records: by command, arc-only drawings, the worst file, the keyword proxy', () => {
  const a = extractFile(svg(24, 1.5, '  <!-- tangent points sit off grid -->\n  <path d="M3.1 12H20.9"/>'), 24, 'a.svg');
  const b = extractFile(svg(24, 1.5, '  <!-- tags: q -->\n  <!-- a ring -->\n  <path d="M4 12A8.1 8.1 0 0 1 20 12"/>'), 24, 'b.svg');
  const c = extractFile(svg(24, 1.5, '  <!-- clean -->\n  <path d="M4 12H20"/>'), 24, 'c.svg');
  const og = offGridFacts([a, b, c]);
  assert.deepEqual([og.drawings, og.values, og.straight, og.arc, og.straightDrawings, og.arcOnly], [2, 4, 2, 2, 1, 1]);
  assert.deepEqual(og.worst[0], ['a.svg', 2]);
  assert.equal(og.withWord, 1, 'only a.svg says why');
  const cf = commentFacts([a, b, c]);
  assert.deepEqual([cf.withComment, cf.withFree, cf.withTags, cf.comments, cf.notes, cf.free], [3, 3, 1, 4, 1, 3]);
});

// ── radii ──────────────────────────────────────────────────────────────────

test('quarterOf buckets within 0.02 of a quarter and radiusVocabulary keeps the rest as off-quarter values', () => {
  assert.equal(quarterOf(2.511), 2.5);
  assert.equal(quarterOf(0.762), 0.75);
  assert.equal(quarterOf(0.772), null);
  const v = radiusVocabulary([{ kind: 'sharp' }, { kind: 'arc', radius: 1.499, name: 'a' }, { kind: 'arc', radius: 0.805, name: 'b' }]);
  assert.deepEqual([v.on[0], v.on[1.5], v.off['0.805']], [1, 1, ['b']]);
});

test('strictContainers finds a rounded square and its radius; looseContainers and conceptsAtRadius agree', () => {
  const rec = (name, d) => radiiOf(iconFromSource(svg(24, 1.5, `  <path d="${d}"/>`), { file: `${name}.svg`, master: 24 }));
  const recs = [rec('sq', roundRect(3, 21, 2.5)), rec('soft', roundRect(4, 20, 1.5)), rec('line', 'M4 12H20'), rec('can', 'M4 4H20L18.5 20H5.5Z')];
  const s = strictContainers(recs);
  assert.deepEqual(Object.fromEntries(Object.entries(s.byR).map(([k, v]) => [k, v])), { 1.5: ['soft'], 2.5: ['sq'] });
  assert.equal(s.mixed.length, 0);
  const l = looseContainers(recs);
  assert.equal(l[2.5].names.size, 1);
  assert.ok(l[0]?.names.has('can'), 'a tapered can\'s corners (about 95°) sit inside the 6° window');
  assert.deepEqual(conceptsAtRadius(recs.flatMap((r) => r.corners.map((c) => ({ ...c, name: r.name }))), 1.5), { soft: 4 });
});

// ── angles and names ───────────────────────────────────────────────────────

test('isDefault and ungranted: no number, no size word; granted by docs/07:77-78 or by docs/09\'s two exceptions', () => {
  assert.deepEqual(['trash', 'trash-5', 'check-small', 'chevron-down-2-large', 'cursor-click'].map(isDefault), [true, false, false, false, true]);
  const docs07 = Array.from({ length: 76 }, () => 'x').join('\n') + '\n- **Angle exceptions.** `gear` and `mail` granted\n  more\n`heart` is on line 79';
  assert.deepEqual(ungranted(docs07, ['gear', 'trash', 'code', 'heart', 'mail', 'italic']), ['heart', 'italic']);
});

// ── parallel stacks ────────────────────────────────────────────────────────

test('parallelStack counts a cross-section of parallel strokes and stackKind tells walls from open lines', () => {
  const icon = (body) => iconFromSource(svg(24, 1.5, body), { file: 'x.svg', master: 24 });
  const menu = parallelStack(icon('  <path d="M4 5H20"/>\n  <path d="M4 9H20"/>\n  <path d="M4 13H20"/>\n  <path d="M4 17H20"/>'));
  assert.deepEqual([menu.max, menu.walls, menu.subpaths, stackKind(menu)], [4, 0, 4, 'open']);
  const card = parallelStack(icon('  <path d="M3 4H21V20H3Z"/>\n  <path d="M6 9H18"/>\n  <path d="M6 14H18"/>'));
  assert.deepEqual([card.max, card.walls, stackKind(card)], [4, 2, 'walls+marks']);
  const twice = parallelStack(icon('  <path d="M4 5H20"/>\n  <path d="M4 5H20"/>\n  <path d="M4 9H20"/>\n  <path d="M4 13H20"/>'));
  assert.equal(twice.max, 3, 'two strokes on one offset are one line of the stack');
  const short = parallelStack(icon('  <path d="M4 5H5"/>\n  <path d="M4 9H5"/>'), { minLength: 2 });
  assert.equal(short.max, 0, 'segments under minLength are not counted');
});

// ── punched cuts: clear runs and clear pixels, with the raster defect bypassed ──────────

test('clearRun measures the white across a cut; clearPixels with sampleEverything fixes raster.mjs\'s horizontal-edge shortcut', () => {
  // a 4×4 solid with a white band y 1.25..2.75: the four centre pixels are each a quarter ink
  const reg = regionOf(iconFromText('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" fill="none" stroke="currentColor" stroke-width="1">\n'
    + AREA('M0 0H4V4H0ZM0.5 1.25H3.5V2.75H0.5Z') + '\n</svg>'));
  assert.ok(Math.abs(clearRun(reg, [2, 2], [0, 1]) - 1.5) <= 0.004);
  assert.ok(Math.abs(clearRun(reg, [2, 1.5], [0, 1]) - 1.5) <= 0.004, 'both ways from an off-centre point');
  const fixed = clearPixels(sampleEverything(reg), 4, 2, [0, 0.25]);
  assert.deepEqual(fixed, [0, 4], 'the truth: no centre pixel is clear; each is exactly a quarter ink');
  const shipped = clearPixels(reg, 4, 2, [0, 0.25]);
  assert.equal(shipped[0], 4, 'raster.mjs as shipped calls all four clear — the defect the bypass exists for');
});

// ── identity, optical scaling, the pair ────────────────────────────────────

test('identicalGroups, pathsText and canonicalKey: same text everywhere vs the same shape drawn another way', () => {
  const t = { a: '<path d="M4 4H20"/>', b: '<path  d="M4 4H20"/>', c: '<path d="M20 4H4"/>' };
  assert.deepEqual(identicalGroups(['a', 'b', 'c'], (m, x) => pathsText(t[x]), [24]), [['a', 'b']]);
  assert.deepEqual(identicalGroups(['a', 'b', 'c'], (m, x) => canonicalKey(t[x]), [24]), [['a', 'b', 'c']]);
});

test('scalingTest predicts each master from the 24 shift by ink extent, axis by axis', () => {
  const rows = [
    { concept: 'c', filled: false, m: 24, dx: 0, dy: 0.5, w: 10, h: 8 },
    { concept: 'c', filled: false, m: 20, dx: 0, dy: 0.4, w: 8, h: 6.4 },
    { concept: 'c', filled: false, m: 16, dx: 0, dy: 0.5, w: 6, h: 5 },
  ];
  const t = scalingTest(rows);
  assert.equal(t.length, 2);
  assert.ok(t.find((x) => x.m === 20).err < 1e-12);
  assert.ok(Math.abs(t.find((x) => x.m === 16).err - 0.1875) < 1e-12);
});

test('pairCensus: growth per side against the note, stale notes and missing twins', () => {
  const rd = (name, m, ink, grows = null) => ({ name, m, filled: /-filled$/.test(name), r: { ink, grows } });
  const box = { x0: 1, y0: 1, x1: 11, y1: 11 };
  const readings = [
    rd('a', 24, box), rd('a-filled', 24, { ...box, y0: 0.5, y1: 11.5 }, { l: 0, r: 0, t: 0.5, b: 0.5 }),
    rd('b', 24, box), rd('b-filled', 24, box, { l: 0, r: 0, t: 0.25, b: 0.25 }),
    rd('c', 24, box), rd('c-filled', 24, { ...box, x1: 11.2 }),
    rd('d', 24, box),
  ];
  const pc = pairCensus(readings);
  assert.deepEqual([pc.pairs, pc.missing, pc.differing, pc.concepts, pc.allNoted, pc.stale], [4, 1, 2, ['a', 'c'], false, 1]);
});

test('edgeGaps lifts the negative and positive edge gaps lint prints', () => {
  assert.deepEqual(edgeGaps([{ w: 'paths 1/2 are 0.46 apart — §6 needs 3 (edge gap -1.04 < 1.5)' }, { w: 'x (edge gap 0.99 < 1.5)' }, { w: 'none' }]), [-1.04, 0.99]);
});

test('smallestGap reads the edge gap between two strokes as lint does', () => {
  const g = smallestGap(svg(24, 1.5, '  <path d="M6 11H18"/>\n  <path d="M6 13.5H18"/>'), 24, 'two-lines');
  assert.ok(Math.abs(g.min - 1) < 0.01);
});

// ── on a fake pin: the set, line-heavy vs light, the 16 filled corners, the CLI ─────────

test('on a fake pin: weightSplit, filledKinds and cornerPairs16 (the 16 filled corner 0.125 wide)', () => {
  const dir = fakePin();
  try {
    const set = loadSet(dir);
    assert.deepEqual(set.concepts, ['box', 'minus']);
    const w = weightSplit(set);
    assert.deepEqual([w.heavy, w.light, w.mixed.length, w.atOutlineWeight[16]], [['minus'], ['box'], 0, 3]);
    assert.deepEqual(filledKinds(set)[16], { areasOnly: 1, mixed: 0, strokesOnly: 1, shapeFilled: 1 });
    const lines = cornerPairs16({ set });
    assert.match(lines[0], /^3b\.11 at 16: 4 matched corner pairs; 0 match exactly; \+0\.125 on 4 pairs in 1 concepts \(box\)/);
    assert.match(lines[1], /^3b\.11 at 20: 4 matched corner pairs; 4 match exactly; \+0\.125 on 0 pairs/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the CLI on a fake pin: a section prints its heading and the pin\'s own lint; unknown section and bad pin exit 2', async () => {
  const dir = fakePin();
  try {
    const r = spawnSync(process.execPath, [PROBE, dir, 'census', 'A'], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /^## §census /m);
    assert.match(r.stdout, /^## §A /m);
    assert.match(r.stdout, /pin: 2 concepts · 12 drawings/);
    assert.match(r.stdout, /lint at the pin: 12 drawings · \d+ clean/);
    assert.match(r.stdout, /A9 6 pairs, 0 missing twins/);
    const bad = spawnSync(process.execPath, [PROBE, dir, 'nope'], { encoding: 'utf8' });
    assert.equal(bad.status, 2);
    assert.match(bad.stderr, /unknown section: nope/);
    const none = spawnSync(process.execPath, [PROBE, join(dir, 'missing')], { encoding: 'utf8' });
    assert.equal(none.status, 2);
    assert.match(none.stderr, /usage/);
    const ctx = new Ctx(dir);
    assert.equal((await ctx.lint()).summary.drawings, 12);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ── the reviewer's survivors: functions that print figures, and fixtures a realistic bug would trip ──────

import {
  summaryLine, warningFacts, numeralWhatIf, identity, opticalRows, compositionAt, cutReadings, CUT_PROBES, containerRadiusOf,
  growthGroup, grantAngles, dec, pureLineStack,
} from './register-probe.mjs';
import { execFileSync } from 'node:child_process';

/** A fake pin from a { 'm/name.svg': text } map, with this repo's lint tools; removed by the caller. */
function pinOf(files) { return fakePin(files); }
const line24 = (body) => svg(24, 1.5, `  <!-- keyline: mark -->\n${body}`);

test('summaryLine prints drawings · clean · warned · failed in that order', () => {
  assert.equal(summaryLine({ drawings: 2910, clean: 2848, warned: 62, failed: 0 }), '2,910 drawings · 2,848 clean · 62 warned · 0 failed');
});

test('dec writes a radius with at least one decimal', () => {
  assert.deepEqual([1, 2, 1.25, 0.75, 1.5].map(dec), ['1.0', '2.0', '1.25', '0.75', '1.5']);
});

test('warningFacts and numeralWhatIf on a fake pin: §6 citations, the sort family, trash, and the numeral note that clears a mouth', async () => {
  const two = '  <path d="M6 11H18"/>\n  <path d="M6 13.5H18"/>';                       // edges 1.0 apart: a §5 pair warning
  const mouth = '  <path d="M8.75 6V12.75A1.25 1.25 0 0 0 11.25 12.75V6"/>';                        // a U whose mouth is 1.0 of air
  const dir = pinOf({ '24/sort-alpha-a.svg': line24(two), '24/trash.svg': line24(two), '20/sort-numeric-a.svg': svg(20, 1.5, `  <!-- keyline: mark -->\n${mouth}`) });
  try {
    const ctx = new Ctx(dir);
    const wf = await warningFacts(ctx);
    assert.deepEqual([wf.drawings, wf.lines.length, wf.sortDrawings, wf.sortConcepts, wf.sortLines, wf.trash.length], [3, 6, 2, ['sort-alpha-a', 'sort-numeric-a'], 4, 1]);
    assert.equal(wf.citeS6, 3, 'the three gap warnings cite §6; the three missing-twin warnings do not');
    assert.deepEqual(edgeGaps(wf.lines), [1]);
    const wi = await numeralWhatIf(ctx);
    assert.deepEqual([wi.before.outline, wi.after.outline], [1, 0], 'the numeral note floors the mouth at 1');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('identity separates outlines identical at every master from those identical at 16 only', () => {
  const f = {};
  for (const [m, w] of [[24, 1.5], [20, 1.5], [16, 1.25]]) {
    f[`${m}/x.svg`] = svg(m, w, '  <path d="M2 4H8"/>'); f[`${m}/y.svg`] = svg(m, w, '  <path d="M2 4H8"/>');
    f[`${m}/p.svg`] = svg(m, w, `  <path d="M2 ${m === 16 ? 6 : m}H8"/>`); f[`${m}/q.svg`] = svg(m, w, `  <path d="M2 ${m === 16 ? 6 : m + 1}H8"/>`);
    for (const c of ['x', 'y', 'p', 'q']) f[`${m}/${c}-filled.svg`] = svg(m, w, `  <path d="M2 ${c.charCodeAt(0) % 9 + 2}H8"/>`);
  }
  const dir = pinOf(f);
  try {
    const id = identity(new Ctx(dir));
    assert.deepEqual(id.textAll, [['x', 'y']]);
    assert.deepEqual(id.only16, [['p', 'q']]);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('opticalRows reads dx then dy, with lint\'s ink box', async () => {
  const dir = pinOf({ '24/c.svg': line24('  <!-- optical: 0.1 0.5 -->\n  <path d="M6 12H18"/>') });
  try {
    const [r] = await opticalRows(new Ctx(dir));
    assert.deepEqual([r.dx, r.dy, r.w, r.h], [0.1, 0.5, 13.5, 1.5]);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('compositionAt takes the last commit of the day, up to 23:59:59', () => {
  const repo = mkdtempSync(join(tmpdir(), 'register-probe-git-'));
  const git = (args, date) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd: repo, env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } });
  try {
    git(['init', '-q']);
    mkdirSync(join(repo, 'src/icons/24'), { recursive: true });
    const add = (name, text, date) => { writeFileSync(join(repo, 'src/icons/24', name), text); git(['add', '.']); git(['commit', '-q', '-m', name], date); };
    add('a.svg', '<!-- keyline: mark -->', '2026-09-17T10:00:00');
    add('b.svg', '<!-- box: 2x2 -->', '2026-09-17T12:00:00');
    add('c.svg', 'plain', '2026-09-17T23:30:00');
    add('d.svg', 'plain', '2026-09-18T09:00:00');
    const ctx = new Ctx(repo, { repo });
    const c = compositionAt(ctx, '2026-09-17', 'HEAD');
    assert.deepEqual([c.concepts, c.mark, c.box, c.held], [3, 1, 1, 1]);
    assert.equal(compositionAt(ctx, '2026-09-16', 'HEAD').commit, null);
  } finally { rmSync(repo, { recursive: true, force: true }); }
});

test('CUT_PROBES: the probe points and disc radii the original took from the paths', () => {
  assert.deepEqual(CUT_PROBES.disc, { 24: 10, 20: 8, 16: 7 });
  assert.deepEqual(CUT_PROBES['x-circle'](16).p, [10, 10]);
  assert.deepEqual(CUT_PROBES['plus-circle'](20).p, [10, 8]);
  assert.deepEqual(CUT_PROBES['minus-circle'](24), { p: [12, 12], dir: [0, 1] });
  assert.deepEqual(CUT_PROBES['check-circle'](16).p, [9.07, 7.9]);
});

test('cutReadings: the clear-pixel count goes through the raster bypass at its call site', () => {
  const f = {};
  for (const m of [24, 20, 16]) {
    const k = m / 16, c = m / 2, r = CUT_PROBES.disc[m], hw = 0.875 * k, e = 3.25 * k;
    const cross = `M${c - hw} ${c - e}H${c + hw}V${c - hw}H${c + e}V${c + hw}H${c + hw}V${c + e}H${c - hw}V${c + hw}H${c - e}V${c - hw}H${c - hw}Z`;
    for (const x of ['check-circle', 'x-circle', 'plus-circle', 'minus-circle'])
      f[`${m}/${x}-filled.svg`] = svg(m, W[m], `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M${c - r} ${c}A${r} ${r} 0 1 0 ${c + r} ${c}A${r} ${r} 0 1 0 ${c - r} ${c}Z${cross}"/>`);
  }
  const dir = pinOf(f);
  try {
    const cuts = cutReadings(new Ctx(dir));
    const p16 = cuts['plus-circle@16'];
    assert.ok(Math.abs(p16.width - 1.75) <= 0.004, `width ${p16.width}`);
    assert.equal(p16.fixed[0], 0, 'every pixel straddles a cut edge at 7.125 or 8.875');
    assert.equal(p16.asShipped[0], 8, 'raster.mjs as shipped calls the eight arm pixels clear');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('containerRadiusOf takes the commonest convex right-angle container radius; growthGroup sorts the growth census', () => {
  const corner = (radius, extra = {}) => ({ role: 'container', convex: true, kind: 'arc', turn: 90, style: 'stroke', radius, ...extra });
  assert.equal(containerRadiusOf({ corners: [corner(2.5), corner(2.5), corner(2.5), corner(1.5), corner(9, { role: 'detail' })] }), 2.5);
  assert.deepEqual(['menu-3', 'more-vertical', 'minus-large', 'grid-3'].map(growthGroup), ['menu', 'more', 'minus', 'other']);
});

test('grantAngles reads the off-grid segment from horizontal or from vertical, outline and filled', () => {
  const f = {};
  for (const [m, w] of [[24, 1.5], [20, 1.5], [16, 1.25]]) {
    f[`${m}/slash.svg`] = svg(m, w, '  <path d="M6 14L10 2"/>');
    f[`${m}/slash-filled.svg`] = svg(m, w + 1, '  <path d="M6 14L9 2"/>');
  }
  const dir = pinOf(f);
  try {
    const h = grantAngles(new Ctx(dir), 'slash', 'horizontal'), v = grantAngles(new Ctx(dir), 'slash', 'vertical');
    assert.ok(Math.abs(h[0].outline[0] - 71.565) < 0.01, `${h[0].outline[0]}`);
    assert.ok(Math.abs(v[0].outline[0] - 18.435) < 0.01);
    assert.ok(Math.abs(h[0].filled[0] - 75.964) < 0.01);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('realistic fixtures: compositionOf with more marks than boxes; noteCensus box+anchor; isDefault on a mid-number name', () => {
  assert.deepEqual(compositionOf(['<!-- keyline: mark -->', '<!-- keyline: mark -->', '<!-- box: 2x2 -->', 'plain']), { concepts: 4, mark: 2, box: 1, held: 1 });
  const rec = (file, notes) => extractFile(svg(24, 1.5, `${notes.map((x) => `  <!-- ${x} -->`).join('\n')}\n  <path d="M6 12H18"/>`), 24, file);
  const c = noteCensus([rec('b.svg', ['box: 2x2', 'gap: 1']), rec('v.svg', ['anchor: volume'])]);
  assert.deepEqual([c.co.boxAnchor, c.co.markAnchor, c.co.boxGap], [[], [], ['b']]);
  assert.equal(isDefault('users-2-behind'), false);
});

test('centringBands: a reading exactly 0.01 off is not over 0.01; the worst list holds the 0.50s only', () => {
  const b = centringBands([{ cx: 0.01, cy: 0, mid: 0, kind: 'circle', name: 'a' }, { cx: 0.3, cy: 0, mid: 0, kind: 'circle', name: 'b' }, { cx: 0.5, cy: 0, mid: 0, kind: 'circle', name: 'c' }]);
  assert.equal(b.over001, 2);
  assert.deepEqual(b.worst.map((x) => x.name), ['c']);
});

test('offGridFacts and commentFacts on a realistic mix: straight against arc, an undocumented file, the median', () => {
  const a = extractFile(svg(24, 1.5, '  <!-- tangent -->\n  <path d="M3.1 12.1H20.9"/>'), 24, 'a.svg');
  const b = extractFile(svg(24, 1.5, '  <!-- ring -->\n  <path d="M4 12A8.1 8.1 0 0 1 20 12"/>'), 24, 'b.svg');
  const u = extractFile(svg(24, 1.5, '  <path d="M4.1 12H20"/>'), 24, 'u.svg');
  const og = offGridFacts([a, b, u]);
  assert.deepEqual([og.straight, og.arc, og.undocumented], [4, 2, 1]);
  const cf = commentFacts([a, b, u]);
  assert.equal(cf.median, 'tangent'.length);
});

test('pairCensus on a realistic mix: two declared growths, one stale note, a note off by 0.25, a growth of exactly 0.01', () => {
  const rd = (name, ink, grows = null) => ({ name, m: 24, filled: /-filled$/.test(name), r: { ink, grows } });
  const box = { x0: 1, y0: 1, x1: 11, y1: 11 };
  const pc = pairCensus([
    rd('a', box), rd('a-filled', { ...box, y0: 0.5, y1: 11.5 }, { l: 0, r: 0, t: 0.5, b: 0.5 }),
    rd('b', box), rd('b-filled', { ...box, y0: 0.5, y1: 11.5 }, { l: 0, r: 0, t: 0.25, b: 0.25 }),
    rd('c', box), rd('c-filled', box, { l: 0, r: 0, t: 0.25, b: 0.25 }),
    rd('d', { x0: 0, y0: 0, x1: 0, y1: 1 }), rd('d-filled', { x0: 0, y0: 0, x1: 0.01, y1: 1 }),
  ]);
  assert.deepEqual([pc.differing, pc.stale, pc.disagree, pc.worstNote], [2, 1, 1, 0.25]);
});

test('ungranted reads docs/07 lines 77 and 78 exactly', () => {
  const docs07 = [...Array.from({ length: 75 }, () => 'x'), '`star` on line 76', 'line 77', '- `gear` on line 78'].join('\n');
  assert.deepEqual(ungranted(docs07, ['star', 'gear']), ['star']);
});

test('containers at the edges of their windows: 55% of the ink box, an 8° corner, a 1.6 radius', () => {
  const rec = (name, d) => radiiOf(iconFromSource(svg(24, 1.5, d.map((x) => `  <path d="${x}"/>`).join('\n')), { file: `${name}.svg`, master: 24 }));
  const narrow = rec('narrow', [roundRect(4, 12, 1.5), 'M12 8H17']);
  assert.equal(strictContainers([narrow]).rows.length, 0, 'a container covering about 55% of the ink is not strict');
  const wide = rec('wide', ['M4 4H20L17.75 20H6.25Z']);
  assert.ok(!looseContainers([wide])[0]?.names.has('wide'), '8° off square is outside the 6° window');
  const r16 = rec('r16', [roundRect(4, 20, 1.6)]);
  assert.deepEqual(conceptsAtRadius(r16.corners.map((c) => ({ ...c, name: 'r16' })), 1.5), {});
});

test('parallelStack details: offsets under 0.5 merge, a three-segment cluster is taken whole, short segments drop by default', () => {
  const icon = (body) => iconFromSource(svg(24, 1.5, body), { file: 'x.svg', master: 24 });
  assert.equal(parallelStack(icon('  <path d="M4 5H20"/>\n  <path d="M4 5.3H20"/>\n  <path d="M4 9H20"/>\n  <path d="M4 13H20"/>')).max, 3);
  assert.equal(parallelStack(icon('  <path d="M4 5H20"/>\n  <path d="M4 5H20"/>\n  <path d="M4 9H20"/>')).max, 3);
  assert.equal(parallelStack(icon('  <path d="M4 5H5"/>\n  <path d="M4 7H5"/>\n  <path d="M4 9H5"/>\n  <path d="M4 11H5"/>')).max, 0);
  assert.deepEqual([stackKind({ walls: 4, max: 4 }), stackKind({ walls: 1, max: 4 })], ['closed', 'other']);
  const chart = icon('  <path d="M4 4V20H20"/>\n  <path d="M9 16V10"/>\n  <path d="M13 16V6"/>\n  <path d="M17 16V12"/>');
  assert.deepEqual([parallelStack(chart).max, pureLineStack(chart).max], [4, 3], 'the axis L is an open stroke but not a pure line');
});

test('canonicalKey ignores the order of paths; smallestGap reads the air inside a closed ring', () => {
  assert.equal(canonicalKey('<path d="M4 4H20"/><path d="M4 9H20"/>'), canonicalKey('<path d="M4 9H20"/><path d="M4 4H20"/>'));
  const g = smallestGap(svg(24, 1.5, '  <path d="M4 10H20V12.5H4Z"/>'), 24, 'ring');
  assert.ok(Math.abs(g.min - 1) < 0.01, `${g.min}`);
});

test('filledKinds counts a shape-filled drawing that keeps a stroke as shape-filled', () => {
  const dir = pinOf({ '16/a-filled.svg': svg(16, 1.25, `${AREA('M2 2H8V8H2Z')}\n  <path d="M10 4H14"/>`), '16/a.svg': svg(16, 1.25, '  <path d="M2 2H8"/>') });
  try { assert.deepEqual(filledKinds(loadSet(dir))[16], { areasOnly: 0, mixed: 1, strokesOnly: 0, shapeFilled: 1 }); }
  finally { rmSync(dir, { recursive: true, force: true }); }
});

import { f1Line } from './register-probe.mjs';

test('f1Line prints lines, drawings, §6 citations, the sort family and trash from the right fields', () => {
  const wf = { lines: Array(74), drawings: 62, citeS6: 73, sortDrawings: 60, sortConcepts: Array(12), trash: [{ m: 20 }, { m: 16 }] };
  assert.equal(f1Line(wf), 'F1 warning lines 74 in 62 drawings; citing §6: 73; sort family 60 drawings in 12 concepts; trash @20 @16');
});
