#!/usr/bin/env node
// SEVERITY PROBE — every measured figure in docs/audit/severity-proposal.md (card 3.5, written with
// card 1.15), printed again from the pinned tree. AUDIT ONLY — imported by nothing; it reads the pin and,
// read-only, this repo's git history and .git/hooks, and writes nothing. Its measurements are the shared
// core's (`register-probe.mjs`) and enforcement-probe.mjs's synthetic lint probes.
//
// Usage:
//   node tools/audit/severity-probe.mjs $P [section …] [--repo DIR] [--refs DIR]
//
// Sections, in the document's order:
//   s1    §1    how many of the standing warnings the sort family brought
//   s2    §2    the clean drawings a baseline would cost nothing to
//   s4.2  §4.2  the four rules to promote: how many drawings each fires on today
//   s4.3  §4.3  the gap-check holes' reach, the bend check's blind half, the keyline opt-outs
//   s4.4  §4.4  the centring tolerance's reach, the off-grid split by command, the worst files, the edge gaps
//   s4.5  §4.5  the comment hatch, the optical census, the `optical: 3 0` probe
//   s5    §5    the structural holes: the hatch, the vacuous passes, the byte count, the area form, `gap:`
//   s6    §6    tests and hooks: geometry.test.mjs, the audit tests at their first commit, the ink-box guard
//   s6b   §6b   the numeral what-if
//   s7    §7    the recommendation's two counts (12 of 72 lines, 1,888 drawings)
//
// Instruments: register-probe.mjs (the pin's own lint in memory, notes.mjs) and enforcement-probe.mjs's
// synthetic probes. The symlinked run is spawned read-only through a directory prefix already a symlink here
// (macOS /tmp → /private/tmp); the six piped runs are timing-dependent and not reprinted.
// Known defects worked around: none reach this document's figures.
//
// Run time, each section alone, wall clock (node 24.20, 2026-10-08, other agents loading the machine):
// s1 20.2 s · s2 20.0 s · s4.2 24.1 s · s4.3 0.4 s · s4.4 23.0 s · s4.5 22.0 s · s5 21.7 s · s6 0.1 s ·
// s6b 23.1 s. The slow ones pay the in-memory lint run (≈ 19 s) once per process; all together 20.5 s.

import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import {
  cli, n, pct, summaryLine, lintModule, runLint, noteCensus, offGridFacts, commentFacts, warningFacts, numeralWhatIf,
  edgeGaps, opticalRows, filledKinds, identity, pairCensus, MASTER_LIST,
} from './register-probe.mjs';
import { opticalProbe, gapProbe, injectProbe, svg24, symlinkedRun } from './enforcement-probe.mjs';
import { inkboxGuard } from './stale-probe.mjs';

const uniq = (xs) => [...new Set(xs)];

/** A line `off` units right of centre with `optical: <off> 0`: does lint still see it? */
export function shiftProbe(L, off) {
  const src = svg24(`  <!-- keyline: mark -->\n  <!-- optical: ${off} 0 -->\n  <path d="M12 12H${12 + 2 * off}"/>`);
  const r = L.lintSource(24, 'probe.svg', src);
  return { warnings: r.warnings, headline: r.notes[r.notes.length - 1] };
}

/** Direct coverage in a test file: lines matching each of the inventory's grep terms (case-insensitive). */
export const COVERAGE_TERMS = {
  checkFamilies: /checkFamilies/i,
  'banned element / attribute': /normalise to|uses g\b|BANNED/i,
  'decimal-count error': /exceeds .* decimal|decimal places/i,
  'undocumented off-grid': /undocumented|documented exception/i,
  'missing <path> / <svg>': /no <path>|no <svg>/i,
  optical: /optical/i,
};
export const coverage = (text) => Object.fromEntries(Object.entries(COVERAGE_TERMS).map(([k, re]) => [k, text.split('\n').filter((l) => re.test(l)).length]));

// ── the print lines, as pure functions of measured facts (each tested) ────

/** §4.3: the drawings §5c never reads, the shape-filled drawings, the keyline opt-outs. */
export const holesLines = (fk, exempt, concepts) => [
  `shape-filled drawings that also carry strokes (§5c never runs): ${MASTER_LIST.reduce((s, m) => s + fk[m].mixed, 0)}`,
  `shape-filled drawings (the bend check never reads their corners): ${n(MASTER_LIST.reduce((s, m) => s + fk[m].shapeFilled, 0))}`,
  `concepts opting out of the keyline match by note: ${exempt} of ${concepts}`,
];

/** §4.4 item 4: off-grid coordinates split by command (offGridFacts), out of `drawings`. */
export const offGridLine = (og, drawings) => `4 off-grid coordinates ${n(og.values)}: ${n(og.arc)} arc parameters or arc endpoints, ${n(og.straight)} on a plain M/L/H/V; ${n(og.straightDrawings)} of ${n(drawings)} drawings (${pct(og.straightDrawings, drawings)}) put a straight-segment coordinate off the grid; arc-derived only ${og.arcOnly}; worst files (all masters) ${og.worst.slice(0, 3).map(([f, k]) => `${f.replace('.svg', '')} ${k}`).join(', ')}`;

/** §6b: sort warning lines the numeral note clears (warningFacts, numeralWhatIf). */
export function numeralLine(wf, wi) {
  const cleared = (wi.before.outline - wi.after.outline) + (wi.before.filled - wi.after.filled);
  return `with \`glyph: numeral\` injected on the sort-numeric files: ${cleared} of ${wf.sortLines} sort warning lines clear (outline ${wi.before.outline} → ${wi.after.outline}, filled ${wi.before.filled} → ${wi.after.filled}); ${wf.sortLines} → ${wf.sortLines - cleared}`;
}

/** §7: the recommendation's two counts. */
export function recommendLine(og, wf, wi) {
  const cleared = (wi.before.outline - wi.after.outline) + (wi.before.filled - wi.after.filled);
  return `4b ${cleared} of ${wf.sortLines} warning lines go with \`glyph: numeral\`; 5 drawings behind the off-grid hatch with a straight-segment coordinate off the grid: ${n(og.straightDrawings)}`;
}

export const SECTIONS = {
  s1: { title: '§1 The problem in one paragraph', run: async (ctx) => {
    const wf = await warningFacts(ctx);
    return [`warned drawings ${wf.drawings}; from the sort family ${wf.sortDrawings}`];
  } },

  s2: { title: '§2 The one change worth making before any rule is re-graded', run: async (ctx) => [`clean drawings: ${n((await ctx.lint()).summary.clean)}`] },

  's4.2': { title: '§4.2 Promote to error — the measure is exact and the rule is settled', run: async (ctx) => {
    const { results } = await ctx.lint();
    const w = [...results.values()].flatMap((r) => r.warnings);
    const count = (re) => w.filter((x) => re.test(x)).length;
    const pc = pairCensus(await ctx.readings());
    return [
      `pairs ${n(pc.pairs)}, missing twins ${pc.missing}`,
      `warnings today — ink box differs: ${count(/ink box differs/)} · missing twin: ${count(/twin/)} · C8 size step: ${count(/C8 wants/)} · C18 container kept: ${count(/container is .* C8 keeps/)} · inner mark direction: ${count(/inner mark is/)} · size variant with no default: ${count(/has no default/)}`,
    ];
  } },

  's4.3': { title: '§4.3 Keep as warning — the measure has a hole, or the eye decides', run: async (ctx) => {
    const fk = filledKinds(ctx.set), c = noteCensus(ctx.notes.files);
    const exempt = c.keyline.concepts + c.box.concepts + c.anchor.concepts;
    return holesLines(fk, exempt, ctx.set.concepts.length);
  } },

  's4.4': { title: '§4.4 Rules that need a decision before they can have a severity', run: async (ctx) => {
    const c = noteCensus(ctx.notes.files), og = offGridFacts(ctx.notes.files);
    const wf = await warningFacts(ctx), id = identity(ctx);
    return [
      `1 concepts that are not a declared mark: ${ctx.set.concepts.length - c.keyline.concepts}`,
      offGridLine(og, ctx.notes.files.length),
      `5 the sort family's edge gaps: ${edgeGaps(wf.lines.filter((l) => /^sort-/.test(l.concept))).join(', ')}`,
      `6 concepts in identical-outline groups: ${id.textAll.reduce((s, g) => s + g.length, 0)}`,
    ];
  } },

  's4.5': { title: '§4.5 Demote to note, or drop', run: async (ctx) => {
    const cf = commentFacts(ctx.notes.files), og = offGridFacts(ctx.notes.files);
    const rows = await opticalRows(ctx);
    const L = await lintModule(ctx.pin);
    const bare = opticalProbe(L, null), p = shiftProbe(L, 3);
    return [
      `files carrying a comment: ${n(cf.withComment)} of ${n(cf.files)}; lint "undocumented" warnings ${og.undocumented}; drawings with a straight-segment coordinate off the grid ${n(og.straightDrawings)}`,
      `\`optical:\` ${uniq(rows.map((r) => r.concept)).length} concepts, ${rows.length} files, ${uniq(rows.map((r) => `${r.dx} ${r.dy}`)).length} distinct dx/dy pairs`,
      `probe, a line 3 units right of centre with \`optical: 3 0\`: ${p.warnings.length} warnings ("${p.headline}"); without a note a 5-unit offset warns: ${bare.warnings.length}`,
    ];
  } },

  s5: { title: '§5 The structural holes, with a proposal each', run: async (ctx) => {
    const run = await ctx.lint();
    const cf = commentFacts(ctx.notes.files), og = offGridFacts(ctx.notes.files);
    const rows = await opticalRows(ctx);
    const empty = runLint(run.L, []), no16 = runLint(run.L, run.jobs.filter((j) => j.m !== 16), run.perFile);
    const one = runLint(run.L, run.jobs.filter((j) => j.m === 24 && j.file === 'minus.svg'), run.perFile);
    const minus = ctx.set.byKey.get('24/minus');
    const area = injectProbe(run.L, 24, 'minus.svg', minus.src, '  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M-50 -50H99.123456V99Z"/>');
    const g = gapProbe(run.L, '<!-- gap: 0.5 -->');
    const sortGap = run.results.get('16/sort.svg').notes.filter((x) => /agreed gap/.test(x));
    return [
      `off-grid hatch: ${n(cf.withComment)} of ${n(cf.files)} files contain a comment; warning branch fires ${og.undocumented} times; ${n(og.drawings)} drawings / ${n(og.values)} off-grid coordinates pass as "documented exception"`,
      `\`optical:\` ${uniq(rows.map((r) => r.concept)).length} concepts · ${rows.length} files · ${uniq(rows.map((r) => `${r.dx} ${r.dy}`)).length} distinct pairs; probe \`optical: 3 0\` on a 3-unit offset: ${shiftProbe(run.L, 3).warnings.length} warnings`,
      `no src/icons: ${summaryLine(empty.summary)}, exit ${empty.exit} · without 16: ${summaryLine(no16.summary)}, exit ${no16.exit} · only 24/minus.svg: ${summaryLine(one.summary)}, exit ${one.exit}`,
      (() => { const s = symlinkedRun(ctx.pin); return s ? `lint run through a symlinked path: ${s.bytes} bytes printed, exit ${s.exit}` : 'no symlinked directory prefix reaches the pin on this machine'; })(),
      `[not reprinted: the 2-of-6 truncated pipes (timing)] a full run's stdout is ${n(run.bytes)} bytes`,
      `outline files carrying an area-form path: ${ctx.notes.files.filter((r) => r.body.areaFormInOutline > 0).length}; probe \`M-50 -50H99.123456V99Z\` in an outline file: verdict unchanged ${area.same}`,
      `probe \`gap: 0.5\` over edges 1.0 apart: ${g.warnings.length} warnings, ${g.errors.length} errors; shipped \`sort\` at 16: "${sortGap.join('')}"`,
    ];
  } },

  s6: { title: '§6 What should also be in `npm run check` and is not', run: async (ctx) => {
    const test = ctx.text('tools/geometry.test.mjs');
    const cov = coverage(test);
    const first = '6293f80';   // the commit that added the wave-0 instruments (git log -- tools/audit)
    const tracked = ctx.git(['ls-tree', '--name-only', `${first}:tools/audit`]).split('\n').filter((f) => f.endsWith('.test.mjs')).sort();
    const names = tracked.map((f) => f.replace(/\.test\.mjs$/, ''));
    const counts = ctx.gitBlobs(tracked.map((f) => `${first}:tools/audit/${f}`)).map((t) => (t?.match(/^test\(/gm) ?? []).length);
    const g = inkboxGuard(ctx.manifest.masters[16].icons, JSON.parse(ctx.text('plans/stroke-16.inkbox.json')));
    const pkg = JSON.parse(ctx.text('package.json'));
    const hooks = existsSync(join(ctx.repo, '.git/hooks')) ? readdirSync(join(ctx.repo, '.git/hooks')) : [];
    return [
      `geometry.test.mjs: ${(test.match(/^test\(/gm) ?? []).length} tests; lines matching each direct-coverage term: ${Object.entries(cov).map(([k, v]) => `${k} ${v}`).join(' · ')}`,
      `tools/audit tests at ${first}: ${counts.reduce((a, b) => a + b, 0)} (${names.map((x, i) => `${x} ${counts[i]}`).join(', ')})`,
      `inkbox-guard read-only: ${g.total} drawings at 16 · ${g.identical} identical · ${g.thinned.length} line stacks thinned · ${g.drift.length} drifted; new since ${g.added.length}; drawings at 16 ${Object.keys(ctx.manifest.masters[16].icons).length}`,
      `package.json scripts: check = "${pkg.scripts.check}"; test script ${'test' in pkg.scripts}; repo .git/hooks: ${hooks.filter((f) => !f.endsWith('.sample')).length} non-sample of ${hooks.length}; .husky ${ctx.has('.husky')}, .github ${ctx.has('.github')}`,
    ];
  } },

  s7: { title: '§7 The recommendation, in order', run: async (ctx) => {
    const og = offGridFacts(ctx.notes.files), wf = await warningFacts(ctx), wi = await numeralWhatIf(ctx);
    return [recommendLine(og, wf, wi)];
  } },

  s6b: { title: '§6b One straight fix the audit found on the way', run: async (ctx) => {
    const wf = await warningFacts(ctx), wi = await numeralWhatIf(ctx);
    return [numeralLine(wf, wi)];
  } },
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await cli(process.argv.slice(2), SECTIONS, 'severity-probe.mjs');
}
