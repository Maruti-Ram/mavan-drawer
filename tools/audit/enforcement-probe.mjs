#!/usr/bin/env node
// ENFORCEMENT PROBE — every measured figure in docs/audit/enforcement-gap.md (card 1.15), printed again
// from the pinned tree. AUDIT ONLY — imported by nothing; it reads the pin (and, read-only, this repo's
// git history) and writes nothing. Its measurements live in `register-probe.mjs` (the shared core of
// the four register probes); this file holds the document's sections and the lint probes only it needs.
//
// Usage:
//   node tools/audit/enforcement-probe.mjs $P [section …] [--repo DIR] [--refs DIR]
//
// Sections, in the document's order:
//   s1    §1      the gate: lint's summary and exit, the error sites, how many warnings the sort family brought
//   s2.1  §2.1    comments on every file, off-grid drawings and values, the keyword proxy
//   s2.2  §2.2    `optical:` probes on synthetic drawings, the centring bands, the optical census
//   s2.3  §2.3    lint run in memory over an empty tree, a tree without 16, a tree holding one file
//   s2.5  §2.5    the byte length of lint's output, the area-form probe, the deny-list and root probes
//   s2.4  §2.4    the sort family's warnings, its missing notes, the numeral what-if, the edge gaps
//   s3    §3      lint's error sites, counted from the pin's tools/lint.mjs
//   s4    §4      the mixed filled drawings §5c skips, the help-4-filled probe, `tags:`, the composition table
//   s5    §5      keyline coverage, centring, shape-filled count, the anchors' path identity, `gap:` held to nothing
//   s6    §6      lint's §5x citations in the docs, the metrics rows
//
// Instruments: as register-probe.mjs (notes.mjs, the pin's own lint.mjs in memory, git for the
// composition table). Synthetic probes are hand-written SVG texts handed to the pin's `lintSource`;
// nothing is written. The symlinked-path probe spawns the pin's lint read-only through a directory
// prefix that is already a symlink on this machine (macOS /tmp → /private/tmp); the six piped runs are
// timing-dependent and not reprinted.
//
// Known defects worked around: none reach this document's figures (no raster, no published box edge).
//
// Run time, each section alone, wall clock (node 24.20, 2026-10-08, other agents loading the machine):
// s1 26.8 s · s2.1 0.6 s · s2.2 46.2 s (a load spike) · s2.3 19.3 s · s2.5 19.2 s · s2.4 19.0 s · s3 0.1 s ·
// s4 0.6 s · s5 19.2 s · s6 18.7 s. The slow ones pay the in-memory lint run (≈ 19 s) once per process;
// all sections together 27–50 s across three runs.

import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import { realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { piecesOf, iconFromSource } from './angles.mjs';
import {
  cli, n, pct, summaryLine, lintModule, runLint, centringBands, noteCensus, offGridFacts, commentFacts,
  warningFacts, numeralWhatIf, edgeGaps, opticalRows, filledKinds, compositionAt, MASTER_LIST,
} from './register-probe.mjs';

const uniq = (xs) => [...new Set(xs)];

// ── synthetic drawings (hand-written, so a probe's answer can be read off the text) ───────────

export const ROOT24 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
export const svg24 = (body) => `${ROOT24}\n${body}\n</svg>\n`;

/** A line 5 units left of centre, with or without an `optical:` note that cancels it. */
export function opticalProbe(L, note) {
  const src = svg24(`  <!-- keyline: mark -->${note ? `\n  ${note}` : ''}\n  <path d="M3.75 12H10.25"/>`);
  const r = L.lintSource(24, 'probe.svg', src);
  return { warnings: r.warnings, errors: r.errors, headline: r.notes[r.notes.length - 1] };
}

/** Two strokes whose edges stand 1.0 apart, with or without a `gap: 0.5` note. */
export function gapProbe(L, note) {
  const src = svg24(`  <!-- keyline: mark -->${note ? `\n  ${note}` : ''}\n  <path d="M6 11H18"/>\n  <path d="M6 13.5H18"/>`);
  const r = L.lintSource(24, 'probe.svg', src);
  return { warnings: r.warnings, errors: r.errors, notes: r.notes };
}

/** A shipped file with something injected after its root: does lint's verdict change? */
export function injectProbe(L, m, file, src, inject) {
  const before = L.lintSource(m, file, src), after = L.lintSource(m, file, src.replace(/(<svg[^>]*>\n)/, `$1${inject}\n`));
  const same = JSON.stringify([before.errors, before.warnings]) === JSON.stringify([after.errors, after.warnings]);
  return { same, before, after };
}

/** A file with no <svg> root and a bad note: which errors survive? `withRoot` is the same text with a
 *  root, to show the note error the rootless run discards. */
export function rootlessProbe(L) {
  const body = '<!-- gap: wide -->\n<path d="M4 12h16"/>\n';
  return { rootless: L.lintSource(24, 'probe.svg', body).errors, withRoot: L.lintSource(24, 'probe.svg', svg24(body)).errors };
}

/** lint.mjs:620 runs only when argv[1] equals its own path. Spawn the pin's lint through a path that
 *  reaches it via a symlinked directory already on disk (macOS: /tmp → /private/tmp), without writing
 *  anything: what does it print, and what does it exit with? null when no such prefix exists here. */
export function symlinkedRun(pin) {
  for (const link of ['/tmp', '/var', '/etc']) {
    let real; try { real = realpathSync(link); } catch { continue; }
    if (real === link || !pin.startsWith(`${real}/`)) continue;
    const via = link + pin.slice(real.length);
    const r = spawnSync(process.execPath, [join(via, 'tools/lint.mjs')], { cwd: pin, encoding: 'utf8', maxBuffer: 1 << 26 });
    return { via, bytes: Buffer.byteLength(r.stdout ?? ''), exit: r.status };
  }
  return null;
}

/** Lines of the pin's lint.mjs that push or return an error (lint.mjs's exit decides on errors only). */
export function errorSites(text) {
  return text.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => !/^\s*\/\//.test(l)
    && (/errors\.push\((?!\.\.\.)/.test(l) || /errors: \[(?!\])/.test(l))).map(([i]) => i);
}

/** Lines citing lint's internal sub-checks §5b…§5f in a text. */
export const sectionCites = (text) => text.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /§5[b-f]/.test(l)).map(([i]) => i);

/** §1: lint's summary and exit, the error sites, the sort family's share of the warned drawings. */
export const headlineLines = (run, sites, wf) => [
  `lint at the pin: ${summaryLine(run.summary)}, exit ${run.exit}`,
  `error sites in the pin's lint.mjs: ${sites} (see §3)`,
  `warned drawings from the sort family: ${wf.sortDrawings} of ${wf.drawings}`,
];

export const SECTIONS = {
  s1: { title: '§1 The headline', run: async (ctx) => {
    const run = await ctx.lint(), wf = await warningFacts(ctx);
    return headlineLines(run, errorSites(ctx.text('tools/lint.mjs')).length, wf);
  } },

  's2.1': { title: '§2.1 The off-grid check is dead across the whole set', run: async (ctx) => {
    const cf = commentFacts(ctx.notes.files), og = offGridFacts(ctx.notes.files);
    const trash = ctx.notes.files.find((r) => r.master === 24 && r.name === 'trash');
    return [
      `files containing an HTML comment: ${n(cf.withComment)} of ${n(cf.files)}; with \`tags:\` ${n(cf.withTags)}; with a free-text comment ${n(cf.withFree)}`,
      `lint "undocumented" off-grid warnings in the whole run: ${og.undocumented}`,
      `${n(og.drawings)} of ${n(cf.files)} drawings (${pct(og.drawings, cf.files)}) hold an off-grid coordinate, ${n(og.values)} occurrences — ${MASTER_LIST.map((m) => `${n(og.byM[m].drawings)} drawings / ${n(og.byM[m].values)} values at ${m}`).join(', ')}`,
      `\`trash\` at 24: ${trash.offGrid.distinct.length} distinct off-quarter values; free-text comments ${trash.text.length}`,
      `comments ${n(cf.comments)} — ${n(cf.notes)} declared notes and ${n(cf.free)} free-text lines, median ${cf.median} characters`,
      `keyword proxy: ${n(og.withWord)} of the ${n(og.drawings)} off-grid drawings say something about why and ${n(og.drawings - og.withWord)} say nothing`,
    ];
  } },

  's2.2': { title: '§2.2 `optical:` moves the centring target by any amount, unchecked', run: async (ctx) => {
    const L = await lintModule(ctx.pin);
    const bare = opticalProbe(L, null), shifted = opticalProbe(L, '<!-- optical: -5 0 -->');
    const nan = opticalProbe(L, '<!-- optical: - . -->'), typo = opticalProbe(L, '<!-- opticl: -5 0 -->');
    const word = L.lintSource(24, 'probe.svg', svg24('  <!-- keyline: marks -->\n  <path d="M3.75 12H20.25"/>'));
    const rd = await ctx.readings(), cb = centringBands(rd);
    const rows = await opticalRows(ctx);
    return [
      `probe, a line 5 units off centre: no note → ${bare.warnings.length} warning (${bare.warnings.join('; ')}); \`optical: -5 0\` → ${shifted.warnings.length} warnings, ${shifted.errors.length} errors`,
      `probe, \`optical: - .\` → headline "${nan.headline}", ${nan.warnings.length} warnings, ${nan.errors.length} errors`,
      `probe, misspelt \`opticl: -5 0\` → ${typo.errors.length} errors, ${typo.warnings.length} warning (the note does nothing); \`keyline: marks\` → ${word.errors.length} errors`,
      `centring after the declared shift, ${n(cb.total)} non-anchored drawings: >0.01 ${cb.over001} · >0.10 ${cb.over010} · >0.25 ${cb.over025} · exactly 0.50 ${cb.at050} (${uniq(cb.worst.map((x) => `${x.concept}@${x.m}${x.filled ? 'f' : ''}`)).join(' ')}) · over 0.50 ${cb.over050}`,
      `\`optical:\` ${uniq(rows.map((r) => r.concept)).length} concepts / ${rows.length} files, ${uniq(rows.map((r) => `${r.dx} ${r.dy}`)).length} distinct dx/dy pairs`,
    ];
  } },

  's2.3': { title: '§2.3 Lint cannot see a missing master, a missing style or an extra file', run: async (ctx) => {
    const run = await ctx.lint();
    const empty = runLint(run.L, []);
    const no16 = runLint(run.L, run.jobs.filter((j) => j.m !== 16), run.perFile);
    const one = runLint(run.L, run.jobs.filter((j) => j.m === 24 && j.file === 'minus.svg'), run.perFile);
    const oneWarn = [...one.results.values()].flatMap((r) => r.warnings);
    return [
      `no src/icons at all: ${summaryLine(empty.summary)}, exit ${empty.exit}`,
      `src/icons/16 removed: ${summaryLine(no16.summary)}, exit ${no16.exit}`,
      `only src/icons/24/minus.svg: ${summaryLine(one.summary)}, exit ${one.exit} — ${oneWarn.join('; ')}`,
    ];
  } },

  's2.5': { title: '§2.5 Three ways the run can report a false green', run: async (ctx) => {
    const run = await ctx.lint(), L = run.L;
    const minus = ctx.set.byKey.get('24/minus');
    const area = injectProbe(L, 24, 'minus.svg', minus.src, '  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M-50 -50H99.123456V99Z"/>');
    const outlineArea = ctx.notes.files.filter((r) => r.body.areaFormInOutline > 0).length;
    const letters = {};
    for (const f of ctx.set.files) for (const m of f.src.replace(/<!--[\s\S]*?-->/g, '').matchAll(/\bd="([^"]+)"/g)) for (const c of m[1].matchAll(/[A-Za-z]/g)) letters[c[0]] = 1;
    const elements = uniq(ctx.set.files.flatMap((f) => [...f.src.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<([a-zA-Z]+)/g)].map((m) => m[1])));
    const deny = {
      'fill= on a plain path': injectProbe(L, 24, 'minus.svg', minus.src.replace('<path d=', '<path fill="red" d='), ''),
      '<title>': injectProbe(L, 24, 'minus.svg', minus.src, '  <title>x</title>'),
      '<mask>': injectProbe(L, 24, 'minus.svg', minus.src, '  <mask></mask>'),
      '<text>': injectProbe(L, 24, 'minus.svg', minus.src, '  <text>x</text>'),
      'vector-effect': injectProbe(L, 24, 'minus.svg', minus.src.replace('<path d=', '<path vector-effect="non-scaling-stroke" d='), ''),
    };
    return [
      `a full run's stdout: ${n(run.bytes)} bytes (with lint's colour codes)`,
      (() => { const s = symlinkedRun(ctx.pin); return s ? `lint run through a symlinked path (${s.via.split('/').slice(0, 2).join('/')}/… → ${realpathSync(s.via.split('/').slice(0, 2).join('/'))}/…): ${s.bytes} bytes printed, exit ${s.exit}` : 'no symlinked directory prefix reaches the pin on this machine'; })(),
      `probe, an outline file carrying \`M-50 -50H99.123456V99Z\` in the area form: verdict unchanged ${area.same} (errors ${area.after.errors.length}, warnings ${area.after.warnings.length})`,
      `shipped outline files carrying an area-form path: ${outlineArea}; elements in the bodies: ${elements.sort().join(', ')}; path commands: ${Object.keys(letters).sort().join(' ')}`,
      `deny-list probes, errors after injection: ${Object.entries(deny).map(([k, v]) => `${k} ${v.after.errors.length}`).join(' · ')}`,
      (() => { const r = rootlessProbe(L); return `a file with no <svg> root and a bad \`gap:\` note: errors ${JSON.stringify(r.rootless)}; with a root the same text errors ${r.withRoot.length} times (${r.withRoot.filter((x) => /gap note/.test(x)).length} on the note)`; })(),
    ];
  } },

  's2.4': { title: '§2.4 The largest body of approved deviation in the set was never taught to lint', run: async (ctx) => {
    const wf = await warningFacts(ctx);
    const sortRd = (await ctx.readings()).filter((x) => x.r.warnings.length && /^sort-/.test(x.concept));
    const by = (re) => sortRd.filter((x) => re.test(x.concept));
    const masters = (rs) => uniq(rs.map((x) => x.m)).join(', ');
    const at24 = wf.lines.filter((l) => l.m === 24 && /^sort-alpha-/.test(l.concept));
    const sortFiles = ctx.notes.files.filter((r) => /^sort-(alpha|numeric)-/.test(r.concept));
    const wi = await numeralWhatIf(ctx);
    return [
      `warned drawings ${wf.drawings}; sort-alpha/-numeric ${wf.sortDrawings} in ${wf.sortConcepts.length} concepts (sort-alpha at ${masters(by(/^sort-alpha/))}; sort-numeric at ${masters(by(/^sort-numeric/))})`,
      `sort-alpha warning lines at 24, verbatim: ${uniq(at24.map((l) => l.w)).map((w) => `"${w}"`).join(' · ')}`,
      `sort files carrying a \`gap:\` or \`glyph:\` note: ${sortFiles.filter((r) => r.notes.gap || r.notes.glyph).length} of ${sortFiles.length}`,
      `with \`glyph: numeral\` injected: sort-numeric outline warning lines ${wi.before.outline} → ${wi.after.outline}; filled ${wi.before.filled} → ${wi.after.filled}; sort lines ${wf.sortLines} → ${wf.sortLines - (wi.before.outline - wi.after.outline) - (wi.before.filled - wi.after.filled)}`,
      `the sort warnings' edge gaps: ${edgeGaps(wf.lines.filter((l) => /^sort-/.test(l.concept))).join(', ')}`,
      `trash's two: ${wf.trash.map((x) => `edge gap ${x.r.warnings[0].match(/edge gap (-?[\d.]+)/)?.[1]} at ${x.m}`).join(', ')}`,
    ];
  } },

  s3: { title: '§3 What the gate actually holds — the full error list', run: async (ctx) => {
    const sites = errorSites(ctx.text('tools/lint.mjs'));
    return [`error sites in the pin's tools/lint.mjs: ${sites.length} — lines ${sites.join(', ')}`];
  } },

  s4: { title: '§4 Stated and not enforced', run: async (ctx) => {
    const fk = filledKinds(ctx.set);
    const L = await lintModule(ctx.pin);
    const help = ctx.set.byKey.get('16/help-4-filled');
    const p = injectProbe(L, 16, 'help-4-filled.svg', help.src, '  <path d="M2 2h1"/>');
    const ko = (r) => r.notes.filter((x) => /knockout leaves/.test(x)).join('; ') || '(none)';
    const noTags = ctx.notes.files.filter((r) => !r.notes.tags);
    const out = [
      `F3b shape-filled concepts per master: ${fk[24].shapeFilled} = ${fk[24].areasOnly} area-only + ${fk[24].mixed} mixed; mixed drawings in all ${MASTER_LIST.reduce((s, m) => s + fk[m].mixed, 0)}`,
      `F3b probe, help-4-filled at 16: "${ko(p.before)}" → with one stroke path added: "${ko(p.after)}"`,
      `G7 files carrying no \`tags:\` note: ${noTags.length} (${uniq(noTags.map((r) => r.concept)).length} concepts)`,
      '| | concepts | `keyline: mark` | agreed `box:` | held to a silhouette keyline |',
    ];
    for (const day of ['2026-09-17', '2026-09-19', '2026-09-20', '2026-10-04']) {
      const c = compositionAt(ctx, day);
      out.push(`| ${day} | ${c.concepts} | ${c.mark} (${pct(c.mark, c.concepts, 0)}) | ${c.box} | ${c.held} |`);
    }
    return out;
  } },

  s5: { title: '§5 Enforced, but never decided — numbers that live only in code', run: async (ctx) => {
    const rd = await ctx.readings(), c = noteCensus(ctx.notes.files);
    const fits = rd.filter((x) => !['mark', 'box', 'anchored', 'none'].includes(x.kind)).length;
    const cb = centringBands(rd), fk = filledKinds(ctx.set);
    const anchored = uniq(rd.filter((x) => x.kind === 'anchored').map((x) => x.concept));
    const L = await lintModule(ctx.pin);
    const g = gapProbe(L, '<!-- gap: 0.5 -->'), g0 = gapProbe(L, null);
    const sortGap = rd.find((x) => x.m === 16 && x.name === 'sort').r.notes.filter((x) => /agreed gap/.test(x));
    return [
      `1 keyline match runs on ${n(fits)} of ${n(rd.length)} drawings (${pct(fits, rd.length, 0)}) — ${c.keyline.files} declare \`keyline: mark\`, ${c.box.files} a \`box:\`, ${c.anchor.files} an \`anchor:\`; "no keyline match": ${rd.filter((x) => x.kind === 'none').length}`,
      `2 centring: >0.01 ${cb.over001} · >0.10 ${cb.over010} · >0.25 ${cb.over025} · at 0.50 ${cb.at050}`,
      `10 shape-filled drawings: ${n(MASTER_LIST.reduce((s, m) => s + fk[m].shapeFilled, 0))} of ${n(rd.length)}`,
      `13 concepts whose path identity checkAnchors counts: ${anchored.length}`,
      `15 probe, edges 1.0 apart: no note → ${g0.warnings.length} warning; \`gap: 0.5\` → ${g.warnings.length} warnings, ${g.errors.length} errors, "${g.notes.filter((x) => /agreed gap/.test(x)).join('')}"`,
      `15 shipped: \`sort\` at 16 — "${sortGap.join('')}"`,
    ];
  } },

  s6: { title: '§6 Where lint and the docs disagree — and which is right', run: async (ctx) => {
    const files = ['CLAUDE.md', 'docs/01-foundations.md', 'docs/07-character.md', 'docs/08-refinement.md', '.claude/skills/icon/SKILL.md', 'plans/facing-gap.md', 'plans/stroke-16.md'];
    const wf = await warningFacts(ctx);
    const mt = ctx.metrics;
    const entries = MASTER_LIST.flatMap((m) => Object.entries(mt[m]).map(([name, e]) => ({ m, name, e })));
    const zeroRec = entries.filter(({ e }) => ['left', 'top', 'right', 'bottom'].every((s) => e.optical?.[s]?.recession === 0));
    const nullTwin = entries.filter(({ m, name, e }) => /-filled$/.test(name) && e.container == null && mt[m][name.replace(/-filled$/, '')]?.container != null);
    const nulls = entries.filter(({ e }) => ['left', 'top', 'right', 'bottom'].some((s) => e.optical?.[s]?.geometric == null && e.optical?.[s]?.optical == null));
    const self = entries.filter(({ e }) => e.container != null && e.ratio && e.ratio.w >= 0.99 && e.ratio.h >= 0.99);
    const zeroArc = zeroArcFiles(ctx);
    return [
      `10 lines citing §5b–§5f: ${files.map((f) => `${f}:${sectionCites(ctx.text(f)).join(', ')}`).join(' · ')}`,
      `10 warning lines citing §6: ${wf.citeS6} of ${wf.lines.length}`,
      `13 entries with recession 0 on all four sides: ${n(zeroRec.length)} of ${n(entries.length)}; filled entries publishing \`container: null\` whose outline twin has a number: ${nullTwin.length}; plus-circle optical.left ${mt[24]['plus-circle'].optical.left.optical.toFixed(2)} against plus-circle-filled ${mt[24]['plus-circle-filled'].optical.left.optical.toFixed(2)}`,
      `14 entries with geometric and optical null: ${uniq(nulls.map((x) => `${x.name}@${x.m}`)).join(', ')}; files with a zero-length arc: ${zeroArc.length} in ${uniq(zeroArc.map((f) => f.concept)).length} concepts`,
      `15 entries whose container is the mark (ratio ≥ 0.99 both axes): ${self.length}, ${uniq(self.map((x) => x.name.replace(/-filled$/, ''))).length} concepts (${uniq(self.map((x) => x.name)).sort().join(', ')})`,
    ];
  } },
};

/** agent D's zeroarc.mjs: an arc whose ends are under 0.002 apart and that is not a full circle. */
export function zeroArcFiles(ctx, tol = 0.002) {
  return ctx.once('zeroarc', () => ctx.set.files.filter((f) => {
    const icon = iconFromSource(f.src, { file: f.file, master: f.m });
    return icon.paths.some((p) => piecesOf(p.d).pieces.some((pc) => pc.type === 'arc'
      && Math.hypot(pc.to[0] - pc.from[0], pc.to[1] - pc.from[1]) < tol && !(pc.arc && pc.arc.sweepDeg > 300)));
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await cli(process.argv.slice(2), SECTIONS, 'enforcement-probe.mjs');
}
