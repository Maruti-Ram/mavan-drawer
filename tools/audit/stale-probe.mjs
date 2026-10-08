#!/usr/bin/env node
// STALE PROBE — every measured "correct value" in docs/audit/stale-statements.md (card 1.16), printed
// again from the pinned tree. AUDIT ONLY — imported by nothing; it reads the pin, this repo's git history
// (read-only: log, rev-list, cat-file, show) and research/references, and writes nothing. The shared
// measurements live in `register-probe.mjs`; this file holds the document's sections and the
// measurements only it needs (the sheet, the ink-box guard, the old 16 drawings' ink, the references).
//
// Usage:
//   node tools/audit/stale-probe.mjs $P [section …] [--repo DIR] [--refs DIR]
// --refs  research/references (gitignored; present on this machine), read by s2b1 (SF Symbols,
//         Nucleo, Fluent counts) and s2b5 (the volume-levels captures, fluent/folder.json). Default:
//         this repo's research/references. A section whose reference file is missing says so.
//
// Sections, in the document's order:
//   head  header   the pin
//   s1    §1       MISLEADING: help's ink fall at 16, the gate, optical on the pin family, the anchored
//                  members and the docs that never name two of them, the identical outlines
//   s2    §2       STALE: the sheet, `grows:` / `gap:` / `anchor:` / `box:` counts, the pairs, the shape-filled
//                  drawings that carry strokes, the ink-box guard, the metrics bugs
//   s2b1  §2b.1    README: masters, categories, stroke shares, arc radii, the plus-large span, bearings,
//                  the references (SF Symbols, Nucleo, Fluent)
//   s2b2  §2b.2    the lab's retired `filled: 'outline'` lines, the narrowest cut in every shape-filled file
//   s2b3  §2b.3    plans/facing-gap.md: tests, filled whites under 1.49, the redrawn readings, the commits
//   s2b4  §2b.4    plans/stroke-16.md: the old and new 16 drawings' ink, lint, the guard, 032b1c4
//   s2b4a §2b.4a   the audit plan's own figures at the pin
//   s2b5  §2b.5    sort-family, the sheet's header, docs/06, docs/08, the references
//   s3    §3       DEAD: templates/, the legacy folder, the six lab pages
//   s3b   §3b      docs/09's verdicts re-measured (angles, cuts, radii, stacks, growth, gaps, chevrons,
//                  cut weights, 16 corners, keylines, identity, decimals) and the filled angles
//   s4    §4       the sort family's measurements, lint's §5x labels, the two file comments
//   s5    §5       checked and still true
//   s6    §6       the rulings table's counts
//
// Instruments: register-probe.mjs (the pin's own lint in memory, notes.mjs, radii.mjs, angles.mjs,
// congruence.mjs, raster.mjs); tools/geometry.mjs (`facingGap`, `bbox`, `isDot`, `parsePath`,
// `samplePath`); tools/audit/refs/pairgeom.mjs (`analyticBox`, for the Fluent workaround below).
//
// Known defects worked around:
//  · raster.mjs `classify` (horizontal area edges): §3b.2's clear-pixel counts are printed with the
//    shortcut switched off (register-probe `sampleEverything`) beside the counts raster.mjs gives as shipped.
//  · figma.mjs `measure.ink` is wrong on rotated or flipped nodes: §2b.1's Fluent pair count is printed
//    the original way (measure.ink, as the sweep ran it) AND from the path (`pairgeom.analyticBox`).
//  · facingGap discards readings at or above its 1.75 cap (enforcement-gap.md §5 row 16): §2b.2's
//    "narrowest cut under 3" is printed with the default cap, as the sweep ran it, and with the cap at 3.
//
// Run time, each section alone, wall clock (node 24.20, 2026-10-08, other agents loading the machine):
// head 19.0 s · s1 19.4 s · s2 19.8 s · s2b1 0.3 s · s2b2 6.9 s · s2b3 23.5 s · s2b4 23.9 s · s2b4a 26.1 s ·
// s2b5 23.8 s · s3 0.1 s · s3b 22.9 s · s4 21.3 s · s5 25.1 s · s6 20.2 s. The slow ones pay the in-memory
// lint run (≈ 19 s) once per process; all sections together 28.2 s.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  cli, n, pct, fmt, fix, dec, r3, summaryLine, MASTER_LIST, PIN_COMMIT, noteCensus, pairCensus, weightSplit, filledKinds,
  warningFacts, numeralWhatIf, identity, radiusCensusAt, radiusVocabulary, radiiAt, strictContainers,
  looseContainers, anglesAt, isDefault, ungranted, grantAngles, stacksAt, stackKind, cutReadings, SWAP,
  opticalRows, smallestGap, bodyOf, cornerPairs16, pureLinesAt,
} from './register-probe.mjs';
import { zeroArcFiles, sectionCites } from './enforcement-probe.mjs';
import { radiiOf } from './radii.mjs';
import { iconFromSource, piecesOf } from './angles.mjs';
import { bbox, isDot, parsePath, samplePath, facingGap } from '../geometry.mjs';
import { STROKES, FILLED_WEIGHT, strokeOf, MASTERS } from '../masters.mjs';
import { analyticBox } from './refs/pairgeom.mjs';

const uniq = (xs) => [...new Set(xs)];
/** A share as the README row writes it: two places when exact there (6.25), else one (7.8). */
export const share = (x) => (Number.isInteger(Math.round(x * 1e6) / 1e4) ? String(Number(x.toFixed(2))) : x.toFixed(1));
const tick = (xs) => xs.map((x) => `\`${x}\``).join(', ');

// ── the sheet ──────────────────────────────────────────────────────────────

/** research/queue.md's rows (the sweep's v1_counts.mjs regex). */
export const ROW = /^- \[([ x~])\] (\d+)\. `([^`]+)`(?: · ([^·—]+?))?(?: · variant of `([^`]+)`)?(?: — (.+))?\s*$/;
export function sheetRows(text) {
  return text.split('\n').map((l) => l.match(ROW)).filter(Boolean)
    .map((m) => ({ st: m[1], n: Number(m[2]), name: m[3], cat: m[4]?.trim() ?? null, base: m[5] ?? null }));
}
/** Product categories on the sheet; the regex also catches "variant of …" as a category, which is not one. */
export const categoriesOf = (rows) => uniq(rows.map((r) => r.cat).filter((c) => c && !/^variant of/.test(c))).sort();

// ── tools/inkbox-guard.mjs, read-only (it rebuilds when run; this reads the pin's built manifest) ─

export function inkboxGuard(icons, snap, { EXACT = 0.011, BEND = 0.1 } = {}) {
  const hasBend = (i) => i.paths.some((d) => !isDot(d) && parsePath(d).some(({ cmd }) => cmd.toUpperCase() === 'A'));
  const drift = [], allowed = [], thinned = [], gone = [], added = Object.keys(icons).filter((k) => !(k in snap));
  for (const [k, was] of Object.entries(snap)) {
    const i = icons[k];
    if (!i) { gone.push(k); continue; }
    const d = { x: i.ink.x - was.x, y: i.ink.y - was.y, w: i.ink.w - was.w, h: i.ink.h - was.h };
    const off = Object.entries(d).filter(([, v]) => Math.abs(v) > EXACT);
    if (!off.length) continue;
    const spans = i.paths.map((p) => bbox([p])), top = Math.min(...spans.map((b) => b.y0)), bot = Math.max(...spans.map((b) => b.y1));
    const flat = i.paths.every((p, q) => (spans[q].y0 > top + EXACT && spans[q].y1 < bot - EXACT) || /^M[\d. ]+[hH][\d. -]+$/.test(p.trim()));
    if (flat && Math.abs(d.x) <= EXACT && Math.abs(d.w) <= EXACT && Math.abs(d.y - 0.125) <= EXACT && Math.abs(d.h + 0.25) <= EXACT) { thinned.push(k); continue; }
    const axes = new Set(off.map(([q]) => (q === 'x' || q === 'w' ? 'x' : 'y')));
    (i.mark && hasBend(i) && axes.size === 1 && off.every(([, v]) => Math.abs(v) <= BEND) ? allowed : drift).push(k);
  }
  const total = Object.keys(snap).length;
  return { total, identical: total - drift.length - allowed.length - thinned.length - gone.length, thinned, allowed, drift, gone, added };
}

/** 2.19's print line from inkboxGuard. */
export const guardLine = (g, at16) => `2.19 inkbox-guard read-only: ${g.total} drawings at 16 · ${g.identical} identical · ${g.thinned.length} line stacks thinned · ${g.drift.length} drifted; new since ${g.added.length}; drawings at 16 ${at16}`;

// ── an independent rasteriser (the plans sweep's disc stamping, kept as it ran) ──────────────

/** Ink of a stroked drawing at `canvas` px × scale: discs of the root stroke stamped along the
 *  sampled centreline on an SS×SS subgrid per pixel. `total` is px of ink at 1×; `solid` counts
 *  device pixels at least 99.5% covered. */
export function stampInk(svg, canvas, scale = 1, SS = 16) {
  const sw = Number(svg.match(/<svg[^>]*stroke-width="([\d.]+)"/)[1]);
  const ds = [...svg.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  const N = canvas * scale * SS, g = new Uint8Array(N * N), u = N / canvas, r = (sw / 2) * u;
  const stamp = (x, y) => {
    const cx = x * u, cy = y * u;
    const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(N - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(N - 1, Math.ceil(cy + r));
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) { const dx = i + 0.5 - cx, dy = j + 0.5 - cy; if (dx * dx + dy * dy <= r * r) g[j * N + i] = 1; }
  };
  for (const d of ds) for (const sub of d.split(/(?=[Mm])/).filter((s) => s.trim())) {
    const pts = samplePath(sub);
    for (let k = 0; k < pts.length; k++) {
      stamp(pts[k][0], pts[k][1]);
      if (k) { const [ax, ay] = pts[k - 1], [bx, by] = pts[k]; const q = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.02); for (let t = 1; t < q; t++) stamp(ax + ((bx - ax) * t) / q, ay + ((by - ay) * t) / q); }
    }
  }
  const P = canvas * scale; let total = 0, solid = 0;
  for (let py = 0; py < P; py++) for (let px = 0; px < P; px++) {
    let c = 0; for (let j = 0; j < SS; j++) for (let i = 0; i < SS; i++) c += g[(py * SS + j) * N + px * SS + i];
    const cov = c / (SS * SS); total += cov; if (cov >= 0.995) solid++;
  }
  return { total: Number((total / (scale * scale)).toFixed(2)), solid };
}

// ── facingGap census of shape-filled drawings (the plans sweep's census-filled.mjs) ──────────

export function filledAir(ctx, cap = 1.75) {
  return ctx.once(`air${cap}`, () => ctx.set.files.filter((f) => f.filled).map((f) => {
    const { ds, areas } = bodyOf(f.src, true);
    if (!areas.length) return null;
    const air = facingGap(ds, strokeOf(f.m), areas, { cap });
    const kinds = {};
    for (const a of air.area) kinds[a.kind] = Math.min(kinds[a.kind] ?? Infinity, a.gap);
    return { m: f.m, name: f.name, concept: f.concept, kinds, lines: ds.length, self: air.self.map((s) => s.gap) };
  }).filter(Boolean));
}

/** Cut and dot widths "read from the path data": a hole's round ends are semicircular arcs (chord
 *  = 2r), so its cut is 2r; a hole drawn with arcs only (no straight run) is a dot of diameter 2r. */
export function holeWidths(d) {
  const subs = d.split(/(?=M)/).slice(1);   // the first subpath is the shell
  return subs.map((sub) => {
    const cmds = parsePath(sub);
    let cur = null, start = null; const semis = [];
    for (const { cmd, args } of cmds) {
      const C = cmd.toUpperCase();
      if (C === 'M') { cur = [args[0], args[1]]; start = cur; continue; }
      if (C === 'L') { cur = [args[0], args[1]]; continue; }
      if (C === 'A') {
        const to = [args[5], args[6]], chord = Math.hypot(to[0] - cur[0], to[1] - cur[1]);
        if (Math.abs(chord - 2 * args[0]) < 0.02) semis.push(2 * args[0]);
        cur = to; continue;
      }
      if (C === 'Z') cur = start;
    }
    const straight = cmds.some((c) => /[LHV]/i.test(c.cmd));
    const radii = uniq(cmds.filter((c) => /A/i.test(c.cmd)).map((c) => c.args[0]));
    return !straight && radii.length === 1 && semis.length ? { kind: 'dot', width: semis[0] } : { kind: 'cut', widths: uniq(semis) };
  });
}

/** The radius of a drawing's lowest convex ~90° corners (the can's bottom, for trash). */
export function bottomCornerRadius(rec) {
  const cs = rec.corners.filter((c) => c.kind === 'arc' && c.convex && Math.abs(Math.abs(c.turn) - 90) < 6 && c.style === 'stroke');
  const y = Math.max(...cs.map((c) => c.at[1]));
  return uniq(cs.filter((c) => Math.abs(c.at[1] - y) < 1e-6).map((c) => r3(c.radius)));
}


// ── the references (gitignored; read-only) ─────────────────────────────────

function refJson(ctx, rel) { const p = join(ctx.refs, rel); return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null; }

/** Fluent regular/filled pairs whose ink boxes agree, by Figma's measure.ink (as the sweep ran it)
 *  and by the path (pairgeom.analyticBox — the workaround for the measure.ink defect). */
export function fluentPairs(dir) {
  if (!existsSync(dir)) return null;
  let pairs = 0, sameInk = 0, samePath = 0; const differ = {}, differPath = {};
  for (const f of readdirSync(dir).filter((x) => /--\d+-\d+\.json$/.test(x)).sort()) {
    const j = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const by = {};
    for (const rec of j.records) (by[rec.master] ??= {})[rec.style] = rec;
    for (const o of Object.values(by)) {
      if (!o.outline || !o.filled) continue;
      pairs++;
      const a = o.outline.measure?.ink, b = o.filled.measure?.ink;
      if (a && b && ['x', 'y', 'w', 'h'].every((k) => Math.abs(a[k].abs - b[k].abs) < 0.02)) sameInk++; else differ[j.name] = 1;
      try {
        const pa = analyticBox(o.outline), pb = analyticBox(o.filled);
        if (['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(pa[k] - pb[k]) < 0.02)) samePath++; else differPath[j.name] = 1;
      } catch { differPath[j.name] = 1; }
    }
  }
  return { pairs, sameInk, samePath, differConcepts: Object.keys(differ).length, differPathConcepts: Object.keys(differPath).length };
}

// ── sections ───────────────────────────────────────────────────────────────

const lintedHeads = async (ctx) => (await ctx.readings()).filter((x) => x.m === 24 && !x.filled);

export const SECTIONS = {
  head: { title: '§head The pin', run: async (ctx) => [`${n(ctx.set.concepts.length)} concepts · ${n(ctx.set.files.length)} drawings · lint ${summaryLine((await ctx.lint()).summary)}`] },

  s1: { title: '§1 MISLEADING — a reader would draw or decide wrongly', run: async (ctx) => {
    const out = [];
    const old = ctx.gitBlobs(['032b1c4^:src/icons/16/help.svg'])[0];
    if (old) {
      const a = stampInk(old, 16), b = stampInk(ctx.set.byKey.get('16/help').src, 16);
      out.push(`1.1 help's ink at 16, 032b1c4^ (1.5) → the pin (1.25): ${fix(a.total, 1)} → ${fix(b.total, 1)} px, a fall of ${pct(a.total - b.total, a.total)}`);
    }
    const run = await ctx.lint();
    out.push(`1.2 lint: ${run.summary.warned} warnings, ${run.summary.failed} failures, exit ${run.exit}`);
    const c = noteCensus(ctx.notes.files);
    out.push(`1.4 concepts carrying \`optical:\`: ${c.optical.concepts}; of them in the map-pin family: ${c.optical.list.filter((x) => /^map-pin/.test(x)).length}`);
    const anchored = ctx.notes.files.filter((r) => r.notes.anchor);
    out.push(`1.6 concepts carrying \`anchor: volume\`: ${uniq(anchored.filter((r) => r.notes.anchor.value === 'volume').map((r) => r.concept)).length} (${tick(uniq(anchored.map((r) => r.concept)).sort())}), ${anchored.length} files`);
    const docs = ['docs/07-character.md', 'docs/01-foundations.md', 'CLAUDE.md', '.claude/skills/icon/SKILL.md'];
    out.push(`1.6 lines naming volume-minus or volume-plus: ${docs.map((d) => `${d} ${ctx.text(d).split('\n').filter((l) => /volume-minus|volume-plus/.test(l)).length}`).join(' · ')}`);
    const id = identity(ctx);
    out.push(`1.7 identical outlines at all three masters: ${id.textAll.length} groups, ${id.textAll.reduce((s, g) => s + g.length, 0)} concepts (canonical: ${id.canonAll.length}); identical filled too: ${id.filledAll.map((g) => g.join('/')).join(', ')}; at 16 only: ${id.only16.map((g) => g.join('/')).join(', ')}`);
    out.push('1.9 [not reprinted: the Polaris figure was read from Figma; corrected since — see the plan]');
    return out;
  } },

  s2: { title: '§2 STALE — counts and pointers that have moved', run: async (ctx) => {
    const out = [];
    const rows = sheetRows(ctx.text('research/queue.md'));
    const st = (s) => rows.filter((r) => r.st === s);
    const done = new Set(st('x').map((r) => r.name)), files = new Set(ctx.set.concepts);
    out.push(`2.1 research/queue.md at the pin: ${rows.length} rows — ${st('x').length} done, ${st(' ').length} todo, ${st('~').length} in review; done rows without files ${[...done].filter((x) => !files.has(x)).length}, files without a done row ${[...files].filter((x) => !done.has(x)).length}`);
    const c = noteCensus(ctx.notes.files);
    const { results } = await ctx.lint();
    const notesAll = [...results.values()].flatMap((r) => r.notes), warnAll = [...results.values()].flatMap((r) => r.warnings);
    out.push(`2.2 \`grows:\` ${c.grows.concepts} concepts / ${c.grows.files} files (${c.grows.list.join(', ')}); lint "agreed growth" ${notesAll.filter((x) => /^agreed growth/.test(x)).length}, "ink box differs" ${warnAll.filter((x) => /ink box differs/.test(x)).length}, missing twins ${warnAll.filter((x) => /twin/.test(x)).length}`);
    const gaps = ctx.notes.files.filter((r) => r.notes.gap);
    out.push(`2.3 \`gap:\` ${gaps.length} files / ${uniq(gaps.map((r) => r.concept)).length} concepts: ${gaps.map((r) => `${r.name} ${r.master} = ${r.notes.gap.value}`).join(' · ')}`);
    const line79 = ctx.text('docs/07-character.md').split('\n')[78];
    out.push(`2.4 gap-note concepts docs/07:79 does not name: ${uniq(gaps.map((r) => r.concept)).filter((x) => !line79.includes(`\`${x}`)).join(', ')}`);
    out.push(`2.5 \`anchor:\` ${c.anchor.concepts} concepts / ${c.anchor.files} files`);
    const boxes = ctx.notes.files.filter((r) => r.notes.box);
    const tuples = uniq(ctx.set.concepts.map((x) => MASTER_LIST.map((m) => ctx.notes.files.find((r) => r.master === m && r.name === x)?.notes.box?.value ?? '-').join('/')).filter((t) => t !== '-/-/-'));
    out.push(`2.6 \`box:\` ${c.box.concepts} concepts / ${c.box.files} files; distinct size strings over the files ${uniq(boxes.map((r) => r.notes.box.value)).length}, distinct 24·20·16 triples over the concepts ${tuples.length}; at 24 only: ${uniq(boxes.filter((r) => !boxes.some((q) => q.concept === r.concept && q.master !== 24)).map((r) => r.concept)).join(', ')}`);
    out.push(`2.7 concepts approved at all three masters: ${ctx.set.concepts.filter((x) => MASTER_LIST.every((m) => ctx.set.byKey.has(`${m}/${x}`))).length}`);
    const pc = pairCensus(await ctx.readings());
    out.push(`2.8 ${n(pc.pairs)} pairs; ${pc.differing} files / ${pc.concepts.length} concepts differ, all declared ${pc.allNoted}`);
    out.push(`2.10 ${st('x').length} of ${rows.length} · ${n(ctx.set.files.length)} drawings · ${(await ctx.lint()).summary.warned} warned · ${(await ctx.lint()).summary.failed} failed`);
    const fk = filledKinds(ctx.set);
    const mixed = MASTER_LIST.reduce((s, m) => s + fk[m].mixed, 0), shape = MASTER_LIST.reduce((s, m) => s + fk[m].shapeFilled, 0);
    out.push(`2.13 shape-filled drawings that also carry strokes: ${mixed} of ${n(shape)}; lint.mjs's §5c guard: line ${ctx.text('tools/lint.mjs').split('\n').findIndex((l) => /areas\.length && ds\.length === 0/.test(l)) + 1}`);
    const g = inkboxGuard(ctx.manifest.masters[16].icons, JSON.parse(ctx.text('plans/stroke-16.inkbox.json')));
    out.push(guardLine(g, Object.keys(ctx.manifest.masters[16].icons).length));
    const mt = ctx.metrics;
    const self = MASTER_LIST.flatMap((m) => Object.entries(mt[m]).filter(([, e]) => e.container != null && e.ratio && e.ratio.w >= 0.99 && e.ratio.h >= 0.99).map(([k]) => k));
    out.push(`2.20 entries whose container is the mark: ${self.length}, ${uniq(self).length} names; \`x\` at 16 container ${mt[16].x.container}`);
    const za = zeroArcFiles(ctx);
    const shortestArc = (src) => { let best = Infinity; for (const d of [...src.matchAll(/\bd="([^"]+)"/g)].map((x) => x[1])) for (const pc of piecesOf(d).pieces) if (pc.type === 'arc' && !(pc.arc && pc.arc.sweepDeg > 300)) best = Math.min(best, Math.hypot(pc.to[0] - pc.from[0], pc.to[1] - pc.from[1])); return best; };
    const pb16 = [`chord ${fmt(shortestArc(ctx.set.byKey.get('16/paintbrush-4').src), 4)} at 16, ${fmt(shortestArc(ctx.set.byKey.get('24/paintbrush-4').src), 4)} at 24`];
    out.push(`2.21 paintbrush-4 publishes null at: ${MASTER_LIST.filter((m) => mt[m]['paintbrush-4'].optical.left.optical == null).join(', ')}; files with a near-zero arc: ${za.length}, ${uniq(za.map((f) => f.concept)).length} concepts (${uniq(za.map((f) => `${f.name}@${f.m}`)).join(' ')}); the shortest arc in paintbrush-4: ${pb16[0]}`);
    return out;
  } },

  s2b1: { title: '§2b.1 README.md has one commit and has never been updated', run: async (ctx) => {
    const out = [];
    const commits = ctx.git(['log', '--format=%h %cs', PIN_COMMIT, '--', 'README.md']).trim().split('\n').filter(Boolean);
    out.push(`commits touching README.md up to the pin: ${commits.length} (${commits.join('; ')})`);
    out.push(`:24 files per master: ${MASTER_LIST.map((m) => ctx.set.files.filter((f) => f.m === m).length).join(' · ')}`);
    const rows = sheetRows(ctx.text('research/queue.md'));
    out.push(`:26 categories on the sheet: ${categoriesOf(rows).length}; concepts ${ctx.set.concepts.length}; rows ${rows.length}`);
    out.push(`:34 stroke as a share of the canvas: ${MASTER_LIST.map((m) => `${share((100 * STROKES[m]) / m)}%`).join(' · ')}`);
    const h = {};
    for (const f of ctx.set.files.filter((x) => x.m === 24 && !x.filled)) for (const m of f.src.replace(/<!--[\s\S]*?-->/g, '').matchAll(/A\s*([\d.]+)[ ,]+([\d.]+)[ ,]+0[ ,]+[01][ ,]+[01]/g)) h[m[1]] = (h[m[1]] ?? 0) + 1;
    out.push(`:36 typed arc radii at 24 (outline): 2.5 ×${h['2.5']}, 1.5 ×${h['1.5']}, 0.75 ×${h['0.75']}`);
    const span = (m) => { const d = ctx.set.byKey.get(`${m}/plus-large`).src.match(/d="M([\d.]+) [\d.]+h([\d.]+)/); return `${d[1]}→${Number(d[1]) + Number(d[2])}`; };
    out.push(`:42-43 plus-large's line at 24 ${span(24)}, at 16 ${span(16)}`);
    const mt = ctx.metrics;
    out.push(`:52-53 filled entries per master publishing recession 0: ${MASTER_LIST.map((m) => Object.entries(mt[m]).filter(([k, e]) => /-filled$/.test(k) && ['left', 'top', 'right', 'bottom'].every((s) => e.optical[s].recession === 0)).length).join(' · ')} of ${ctx.set.concepts.length}`);
    const ic = ctx.manifest.icons, b = (k) => ic[k].bearing;
    out.push(`:61-62 bearings at 24: plus ${b('plus').left}, plus-large ${b('plus-large').left}; chevron-down left/right ${b('chevron-down').left}/${b('chevron-down').right}, top/bottom ${b('chevron-down').top}/${b('chevron-down').bottom}`);
    const sf = refJson(ctx, 'sfsymbols/names.json');
    if (sf) { const names = Object.keys(sf.names), set = new Set(names); out.push(`:130-135 SF Symbols names.json: ${n(names.length)} names, ${n(names.filter((x) => x.endsWith('.fill') && set.has(x.slice(0, -5))).length)} (name, name.fill) pairs`); }
    else out.push(':130-135 SF Symbols: research/references/sfsymbols/names.json not found');
    const nc = refJson(ctx, 'nucleo/census.json');
    out.push(nc ? `:135 Nucleo census: ${n(nc.totals.n)} icons, ${uniq(nc.klassByGrid.map((x) => x.grid)).length} grids, stroke_max set on ${n(nc.totals.strokeMaxSet)} (${pct(nc.totals.strokeMaxSet, nc.totals.n)})` : ':135 Nucleo: research/references/nucleo/census.json not found');
    const fl = fluentPairs(join(ctx.refs, 'fluent/figma'));
    if (!fl) out.push(':132 Fluent: research/references/fluent/figma not found');
    else out.push(`:132 Fluent regular/filled pairs: ${n(fl.pairs)}; same ink box by measure.ink ${n(fl.sameInk)} (${pct(fl.sameInk, fl.pairs)}), ${fl.pairs - fl.sameInk} differ in ${fl.differConcepts} concepts; by the path (workaround) ${n(fl.samePath)} (${pct(fl.samePath, fl.pairs)}), ${fl.pairs - fl.samePath} differ in ${fl.differPathConcepts} concepts`);
    return out;
  } },

  s2b2: { title: '§2b.2 The lab still offers a retired draft format in visible UI', run: async (ctx) => {
    const out = [];
    const retired = /'outline'\s*\(the same|\|\s*'outline'|(?:filled|\bf)\s*[!=]==\s*'outline'/;
    const lab = readdirSync(join(ctx.pin, 'lab')).filter((f) => f.endsWith('.html')).sort();
    out.push(`lines treating 'outline' as a filled form: ${lab.map((f) => [f, ctx.text(`lab/${f}`).split('\n').map((l, i) => (retired.test(l) ? i + 1 : 0)).filter(Boolean)]).filter(([, ls]) => ls.length).map(([f, ls]) => `lab/${f}:${ls.join(', ')}`).join(' · ')}`);
    for (const cap of [1.75, 3]) {
      const air = filledAir(ctx, cap);
      out.push(`shape-filled files (cap ${cap}${cap === 1.75 ? ', as the sweep ran it' : ''}): ${n(air.length)}; ${MASTER_LIST.map((m) => { const cut = air.filter((x) => x.m === m && x.kinds.cut !== undefined); return `${m}: ${cut.filter((x) => x.kinds.cut < 3).length}/${cut.length} narrowest cut under 3${m === 16 ? `, ${cut.filter((x) => Math.abs(x.kinds.cut - 1.5) < 0.02).length} at 1.5` : ''}`; }).join(' · ')}`);
    }
    out.push(`container radius 2.5 at 24 in strokes of ${STROKES[24]}: ${fix(2.5 / STROKES[24], 2)}`);
    return out;
  } },

  s2b3: { title: '§2b.3 plans/facing-gap.md — a closed plan reading as current', run: async (ctx) => {
    const out = [];
    out.push(`lint: ${summaryLine((await ctx.lint()).summary)}`);
    const tests = (text) => [...text.matchAll(/^test\('([^']*)'/gm)].map((m) => m[1]);
    const now = tests(ctx.text('tools/geometry.test.mjs'));
    const at = (c) => tests(ctx.gitBlobs([`${c}:tools/geometry.test.mjs`])[0] ?? '');
    const f5 = (ts) => [ts.filter((t) => /facingGap/.test(t)).length, ts.filter((t) => /lint §5f/.test(t)).length];
    out.push(`§5f tests in geometry.test.mjs at the pin: ${f5(now)[0] + f5(now)[1]} (${f5(now)[0]} facingGap + ${f5(now)[1]} lint §5f); at e027857 ${f5(at('e027857')).reduce((a, b) => a + b, 0)}; 1828450 added ${f5(at('1828450')).reduce((a, b) => a + b, 0) - f5(at('1828450^')).reduce((a, b) => a + b, 0)}; tests in the file ${now.length}`);
    const geo = ctx.text('tools/geometry.mjs');
    out.push(`geometry.mjs: ${geo.match(/const ARRIVE = [\d.]+/)?.[0]}; ${geo.match(/const BULGE = \w+/)?.[0]} (${geo.match(/const FACING = [\d.]+/)?.[0]})`);
    const air = filledAir(ctx);
    const under = air.filter((x) => Object.values(x.kinds).some((v) => v < 1.49));
    out.push(`filled whites under 1.49 (facingGap over every shape-filled file): ${uniq(under.map((x) => x.concept.replace(/-(ascending|descending)(-\d)?$/, '-*'))).map((fam) => `${fam} ${uniq(under.filter((x) => x.concept.replace(/-(ascending|descending)(-\d)?$/, '-*') === fam).map((x) => `${fmt(Math.min(...Object.values(x.kinds)))}@${x.m}`)).join(' ')}`).join(' · ')}`);
    const read = (name) => MASTER_LIST.map((m) => { const x = air.find((a) => a.m === m && a.name === name); return x ? Object.entries(x.kinds).map(([k, v]) => `${k} ${fmt(v)}`).join(', ') : '-'; }).join(' | ');
    for (const name of ['book-3-filled', 'compass-3-filled', 'puzzle-4-filled', 'external-link-filled']) out.push(`  ${name} 24 | 20 | 16: ${read(name)}`);
    // the collar is read on the OUTLINE drawing, as the sweep read it (its own path facing itself)
    const collar = (name) => MASTER_LIST.map((m) => { const { ds } = bodyOf(ctx.set.byKey.get(`${m}/${name}`).src, false); return facingGap(ds, strokeOf(m), []).self.map((x) => fmt(x.gap)).join(', ') || '-'; }).join(' | ');
    for (const name of ['paintbrush', 'paintbrush-8']) out.push(`  ${name} (outline) collar 24 | 20 | 16: ${collar(name)}`);
    const fk = filledKinds(ctx.set);
    out.push(`shape-filled per master ${fk[24].shapeFilled} (${n(MASTER_LIST.reduce((s, m) => s + fk[m].shapeFilled, 0))} in all); with lines too ${fk[24].mixed} (${MASTER_LIST.reduce((s, m) => s + fk[m].mixed, 0)})`);
    const hashes = ['e027857', '2146fcf', 'ba32df6', '4b7afc5', '09fdf64', '20f3534', '93126ef', '390f3ce', 'db46c18', '80ea947'];   // the plan's ten, cited
    out.push(`the plan's commit hashes that resolve: ${hashes.filter((h) => ctx.git(['cat-file', '-e', `${h}^{commit}`], { allowFail: true }) !== null).length} of ${hashes.length}; 93126ef^..390f3ce is ${ctx.git(['rev-list', '--count', '93126ef^..390f3ce']).trim()} commits`);
    return out;
  } },

  s2b4: { title: '§2b.4 plans/stroke-16.md — and the px-of-ink problem, in one file', run: async (ctx) => {
    const out = [];
    for (const [name, what] of [['help', 'ink at 1x'], ['trash', 'retina 2x solid'], ['chevron-down', 'retina 2x solid']]) {
      const old = ctx.gitBlobs([`032b1c4^:src/icons/16/${name}.svg`])[0], now = ctx.set.byKey.get(`16/${name}`).src;
      const a = what === 'ink at 1x' ? fix(stampInk(old, 16).total, 1) : stampInk(old, 16, 2).solid;
      const b = what === 'ink at 1x' ? fix(stampInk(now, 16).total, 1) : stampInk(now, 16, 2).solid;
      out.push(`${name} at 16, ${what}, 032b1c4^ → the pin: ${a} → ${b}`);
    }
    const run = await ctx.lint(), wf = await warningFacts(ctx);
    out.push(`lint: ${summaryLine(run.summary)}; file-text-2 warnings ${MASTER_LIST.map((m) => run.results.get(`${m}/file-text-2.svg`).warnings.length).join('/')}; trash warns at ${wf.trash.map((x) => x.m).join(', ')}`);
    out.push(`"in transition" in CLAUDE.md and docs/07: ${['CLAUDE.md', 'docs/07-character.md'].map((f) => (ctx.text(f).match(/in transition/g) ?? []).length).join(' + ')}`);
    out.push(`tests in geometry.test.mjs: ${(ctx.text('tools/geometry.test.mjs').match(/^test\(/gm) ?? []).length}`);
    out.push(`032b1c4: ${ctx.git(['log', '-1', '--format=%cs %s', '032b1c4']).trim()}`);
    const g = inkboxGuard(ctx.manifest.masters[16].icons, JSON.parse(ctx.text('plans/stroke-16.inkbox.json')));
    const at16 = Object.keys(ctx.manifest.masters[16].icons).length;
    out.push(`inkbox-guard: ${g.total} · ${g.identical} identical · ${g.thinned.length} thinned · ${g.drift.length} drifted — covers ${g.total} of ${at16} drawings at 16 (${pct(g.total, at16)})`);
    return out;
  } },

  s2b4a: { title: '§2b.4a The audit\'s own plan states two different pins', run: async (ctx) => {
    const c = noteCensus(ctx.notes.files), rd = await ctx.readings();
    const exempt = c.keyline.concepts + c.box.concepts + c.anchor.concepts;
    const skip = rd.filter((x) => ['mark', 'box', 'anchored'].includes(x.kind)).length;
    const mt = ctx.metrics, zero = MASTER_LIST.reduce((s, m) => s + Object.values(mt[m]).filter((e) => ['left', 'top', 'right', 'bottom'].every((q) => e.optical[q].recession === 0)).length, 0);
    return [
      `lint: ${summaryLine((await ctx.lint()).summary)}`,
      `concepts exempt from the keyline match: ${exempt} of ${ctx.set.concepts.length} (${pct(exempt, ctx.set.concepts.length)}); \`optical:\` ${c.optical.concepts} of ${ctx.set.concepts.length}`,
      `files skipping the keyline match: ${n(skip)} of ${n(rd.length)}; held to it ${n(rd.length - skip)}`,
      `${ctx.set.concepts.length} concepts, ${n(ctx.set.files.length)} files; recession 0 on ${n(zero)} of ${n(rd.length)} entries`,
    ];
  } },

  s2b5: { title: '§2b.5 plans/sort-family.md, research/queue.md, docs/06, and the reference snapshots', run: async (ctx) => {
    const out = [];
    const fb = familyBoxes(await lintedHeads(ctx));
    out.push(`sort-family :9 name-families at 24 with two or more members (no -small/-large): ${fb.multi}; keeping one ink box ${fb.uniform.length}; varying ${fb.multi - fb.uniform.length}`);
    const sortC = ctx.set.concepts.filter((x) => /^sort/.test(x)), chars = sortC.filter((x) => /^sort-(alpha|numeric)-/.test(x));
    out.push(`:19-23 shipped character icons: ${chars.length} (sort-alpha ${chars.filter((x) => /alpha/.test(x)).length}, sort-numeric ${chars.filter((x) => /numeric/.test(x)).length})`);
    const heads = await ctx.readings();
    const triple = (x) => MASTER_LIST.map((m) => { const h = heads.find((r) => r.m === m && r.name === x); return `${h.w}×${h.h}`; }).join(' · ');
    const familyBox = '18×15 · 16×13.5 · 14×12';   // the plan's family box, cited (sort-family.md:46)
    out.push(`:46 sort concepts ${sortC.length}; holding ${familyBox}: ${sortC.filter((x) => triple(x) === familyBox).length}; outside: ${sortC.filter((x) => triple(x) !== familyBox).map((x) => `${x} ${triple(x).split(' · ')[0]}`).join(', ')}`);
    out.push(`:54-59 lab/drafts/batch at the pin: ${readdirSync(join(ctx.pin, 'lab/drafts/batch')).join(', ')}`);
    const cmds = uniq([...ctx.text('tools/queue.mjs').matchAll(/^\/\/\s+node tools\/queue\.mjs (\w+)/gm)].map((m) => m[1]));
    out.push(`research/queue.md:8 — queue.mjs commands: ${cmds.join(', ')}`);
    const nuc = JSON.parse(ctx.text('research/sources/nucleo.json')), bySet = {};
    for (const e of nuc) bySet[e.set] = (bySet[e.set] ?? 0) + 1;
    out.push(`docs/06:16 nucleo.json: ${Object.entries(bySet).map(([k, v]) => `set ${k} = ${v}`).join(', ')}; docs/06:113's formula ${bySet[10]} names × 2 grids × 2 styles = ${bySet[10] * 2 * 2}`);
    const rows = sheetRows(ctx.text('research/queue.md'));
    out.push(`CLAUDE.md:125 sheet rows ${rows.length}, distinct numbers ${uniq(rows.map((r) => r.n)).length}, shipped ${ctx.set.concepts.length}`);
    out.push(`docs/08:423-424 FILLED_WEIGHT − STROKES: ${MASTER_LIST.map((m) => `${m} +${fmt(FILLED_WEIGHT[m] - STROKES[m])}`).join(' · ')}`);
    const vl = join(ctx.refs, 'volume-levels');
    if (!existsSync(join(vl, 'central'))) out.push('volume-levels/central not found');
    else {
      const png = readdirSync(join(vl, 'central')).filter((f) => f.endsWith('.png')).sort();
      // file times in IST (UTC+05:30), the zone the document's times are written in
      const t = (p) => new Date(statSync(p).mtime.getTime() + 330 * 60000).toISOString().slice(0, 16).replace('T', ' ');
      out.push(`volume-levels/central PNG captures: ${png.length} (${uniq(png.map((f) => t(join(vl, 'central', f)))).join(', ')} IST); web/notes.md ${existsSync(join(vl, 'web/notes.md')) ? t(join(vl, 'web/notes.md')) : '-'} IST; measurement files beside them: ${readdirSync(join(vl, 'central')).filter((f) => !f.endsWith('.png')).length}`);
    }
    const folder = refJson(ctx, 'fluent/folder.json');
    if (!folder) out.push('fluent/folder.json not found');
    else out.push(`fluent/folder.json (regular): strokes ${Object.entries(folder.regular).filter(([, v]) => v.stroke != null).map(([k, v]) => `${k}:${v.stroke}`).join(', ')}; ink ${['16', '20', '24'].map((k) => folder.regular[k].ink.join('×')).join(' · ')}`);
    return out;
  } },

  s3: { title: '§3 DEAD — describes a system that no longer exists', run: async (ctx) => [
    `templates/ at the pin: ${ctx.has('templates') ? `exists (${readdirSync(join(ctx.pin, 'templates')).join(', ')})` : 'absent'}; src/_legacy-stroke-2/: ${ctx.has('src/_legacy-stroke-2') ? `exists (${readdirSync(join(ctx.pin, 'src/_legacy-stroke-2')).length} files)` : 'absent'}`,
    `docs/09:53's dead lab pages present: ${['language', 'keylines', 'alignment', 'optical', 'stroke-vs-fill', 'slot-test'].filter((p) => ctx.has(`lab/${p}.html`)).length} of 6`,
  ] },

  s3b: { title: '§3b docs/09\'s own verdicts, re-measured at 485', run: async (ctx) => {
    const out = [];
    const a24 = anglesAt(ctx, 24), a16 = anglesAt(ctx, 16);
    const defaults = a24.offConcepts.filter(isDefault);
    const none = ungranted(ctx.text('docs/07-character.md'), defaults);
    out.push(`3b.1 ${n(a24.segments)} segments; ${a24.offConcepts.length} concepts (${a24.off.length} segments); ${a16.offConcepts.length} at 16; ${defaults.length} defaults; with no grant on docs/07:77-78: ${none.length} (${none.join(', ')})`);
    const ta = grantAngles(ctx, 'trash', 'vertical'), ca = grantAngles(ctx, 'code', 'horizontal');
    out.push(`3b.1 trash taper ${ta.map((x) => fix(Math.max(...x.outline), 2)).join(' / ')}°; code slash ${ca.map((x) => fix(Math.max(...x.outline), 2)).join(' / ')}°`);
    const cuts = cutReadings(ctx);
    out.push(`3b.2 cut widths 24 / 20 / 16: ${SWAP.map((x) => `${x} ${MASTER_LIST.map((m) => fix(cuts[`${x}@${m}`].width, 2)).join(' / ')}`).join(' · ')}`);
    for (const label of ['fixed', 'asShipped']) out.push(`3b.2 clear pixels (${label === 'fixed' ? 'defect bypassed' : 'raster.mjs as shipped'}) coverage 0 / ≤0.05 / ≤0.15: ${MASTER_LIST.map((m) => `${m}: ${SWAP.map((x) => `${x.replace('-circle', '')} ${cuts[`${x}@${m}`][label].join('/')}`).join(', ')}`).join(' | ')}`);
    const bottom = (x) => MASTER_LIST.map((m) => bottomCornerRadius(radiiOf(iconFromSource(ctx.set.byKey.get(`${m}/${x}`).src, { file: `${x}.svg`, master: m }))).join('/'));
    const trash = bottom('trash'), trash5 = bottom('trash-5');
    const sc = strictContainers(radiiAt(ctx, 24)), lc = looseContainers(radiiAt(ctx, 24));
    const voc = radiusVocabulary(radiusCensusAt(ctx, 24).all.filter((c) => c.style === 'stroke'));
    out.push(`3b.3 trash ${trash.join(' / ')}, trash-5 ${trash5.join(' / ')} (as written: ${trash.map((x) => x.split('/').map(Number).map(dec).join('/')).join(' / ')}); strict ${Object.entries(sc.byR).map(([k, v]) => `${v.length} at ${k}`).join(', ')}, ${sc.mixed.length} mixed (${sc.mixed.map((r) => `${r.name} [${r.radii.join(', ')}]`).join('; ')}); looser ${lc[2.5].names.size} at 2.5 against ${lc[1.5].names.size} at 1.5; off-quarter (${Object.keys(voc.off).length}) ${Object.entries(voc.off).map(([k, v]) => `${k} ${uniq(v).join('/')}`).join(', ')}`);
    const st = MASTER_LIST.map((m) => stacksAt(ctx, m).filter((s) => s.max >= 4));
    const kinds = {}; st[0].forEach((s) => (kinds[stackKind(s)] ??= []).push(s.name));
    const pure = stacksAt(ctx, 24).filter((x) => x.walls === 0 && x.subpaths === x.max), top = Math.max(...pure.map((x) => x.max));
    out.push(`3b.4 largest stack of separate open strokes (one subpath each, any shape) at 24: ${top} (${pure.filter((x) => x.max === top).map((x) => x.name).join(', ')})`);
    const pl = pureLinesAt(ctx, 24), plTop = Math.max(...pl.map((x) => x.max));
    out.push(`3b.4 largest pure line run (whole subpaths that are one straight segment) at 24: ${plTop}, in ${pl.filter((x) => x.max === plTop).length} concepts (incl. menu ${pl.find((x) => x.name === 'menu')?.max}, list-bullet ${pl.find((x) => x.name === 'list-bullet')?.max})`);
    out.push(`3b.4 stacks of 4+: ${st.map((x, i) => `${x.length} at ${MASTER_LIST[i]}`).join(', ')}; at 24 ${st[0].filter((s) => s.max === 4).length} at four and ${st[0].filter((s) => s.max === 5).length} at five (${st[0].filter((s) => s.max === 5).map((s) => s.name).join(', ')}); walls+marks ${kinds['walls+marks'].length}; neither ${(kinds.open ?? []).length + (kinds.closed ?? []).length} (open ${(kinds.open ?? []).join(', ')}; closed ${(kinds.closed ?? []).join(', ')})`);
    const pc = pairCensus(await ctx.readings());
    const minus = pc.rows.filter((r) => r.c === 'minus').map((r) => `${r.m}: total ${dec(r.d.t + r.d.b)}, note ${r.grows ? `${r.grows.l} ${r.grows.r} ${r.grows.t} ${r.grows.b}` : '-'}`);
    out.push(`3b.5 minus-filled height growth ${minus.join(' · ')}`);
    const ft = smallestGap(ctx.set.byKey.get('16/file-text-2').src, 16, 'file-text-2'), ftf = smallestGap(ctx.set.byKey.get('16/file-text-2-filled').src, 16, 'file-text-2-filled');
    const run = await ctx.lint();
    out.push(`3b.6 file-text-2 at 16 smallest edge gap ${fmt(ft.min, 3)}; filled twin's air ${fmt(ftf.min, 3)}; lint warnings ${run.results.get('16/file-text-2.svg').warnings.length + run.results.get('16/file-text-2-filled.svg').warnings.length}`);
    const tw = (m, f) => run.results.get(`${m}/${f}.svg`).warnings;
    out.push(`3b.7 trash: ${MASTER_LIST.map((m) => `${m} ${tw(m, 'trash').length ? `"${tw(m, 'trash').join('; ')}"` : 'clean'}`).join(' · ')}; trash-5 and the filled twins: ${['trash-5', 'trash-filled', 'trash-5-filled'].reduce((s, f) => s + MASTER_LIST.reduce((t, m) => t + tw(m, f).length, 0), 0)} warnings`);
    out.push(`3b.8 ${pc.concepts.length} concepts / ${pc.differing} pairs differ, all declared ${pc.allNoted}, stale ${pc.stale}, largest note error ${fmt(pc.worstNote, 3)}`);
    const rows = await opticalRows(ctx), chev = rows.filter((r) => !r.filled && /^chevron-(down|up|left|right)/.test(r.concept));
    const mag = (r) => Math.abs(r.dx) + Math.abs(r.dy), dir = (r) => r.concept.match(/^chevron-(down|up|left|right)/)[1];
    const style = (r) => (/-3(-|$)/.test(r.concept) ? 'steep' : /-2(-|$)/.test(r.concept) ? 'flat' : 'classic');
    const plain = (r) => !/-(small|large)$/.test(r.concept);
    const v = (s, d) => uniq(chev.filter((r) => r.m === 24 && plain(r) && style(r) === s && dir(r) === d).map(mag)).join('/');
    out.push(`3b.9 chevron shift at 24 (default size): classic ${['down', 'up', 'left', 'right'].map((d) => `${d} ${v('classic', d)}`).join(', ')}; flat ${['down', 'up', 'left', 'right'].map((d) => `${d} ${v('flat', d)}`).join(', ')}; steep ${['down', 'up', 'left', 'right'].map((d) => `${d} ${v('steep', d)}`).join(', ')}; chevron concepts ${uniq(chev.map((r) => r.concept)).length}, distinct magnitudes ${uniq(chev.map(mag)).length}`);
    const holes = ['minus-circle', 'plus-circle', 'x-circle', 'check-circle', 'info', 'help', 'alert-circle'].map((x) => {
      const d = ctx.set.byKey.get(`24/${x}-filled`).src.match(/stroke="none" d="([^"]+)"/)[1];
      return `${x} ${holeWidths(d).map((h) => (h.kind === 'dot' ? `dot ⌀${h.width}` : `cut ${h.widths.join('/')}`)).join(', ')}`;
    });
    out.push(`3b.10 at 24, from the holes' round ends: ${holes.join(' · ')}`);
    out.push(...cornerPairs16(ctx));
    out.push(...keylineFacts(ctx, await ctx.readings()));
    const id = identity(ctx);
    out.push(`3b.13 ${id.textAll.length} groups / ${id.textAll.reduce((s, g) => s + g.length, 0)} concepts`);
    out.push(decimalFacts(ctx));
    const fa = (rows2, key) => rows2.map((x) => fix(Math.max(...x[key]), 2)).join(' / ');
    out.push(`also new: trash filled ${fa(ta, 'filled')}° against outline ${fa(ta, 'outline')}°; code filled ${fa(ca, 'filled')}° against outline ${fa(ca, 'outline')}°`);
    return out;
  } },

  s4: { title: '§4 Statements that are true but recorded in the wrong place', run: async (ctx) => {
    const out = [];
    const heads = await lintedHeads(ctx), size = (x) => heads.find((r) => r.name === x);
    const run4 = (names, k) => names.map((x) => fmt(size(x)[k])).join(' · ');
    out.push(`4.1 at 24: menu heights ${run4(['menu', 'menu-2', 'menu-3', 'menu-4'], 'h')}; chevron-up heights ${run4(['chevron-up', 'chevron-up-2', 'chevron-up-3'], 'h')}; list heights ${run4(['list-bullet', 'list-bullet-2', 'list-bullet-3', 'list-ordered'], 'h')}; arrow-up widths ${run4(['arrow-up', 'arrow-up-2', 'arrow-up-3', 'arrow-up-4'], 'w')}; sort ${size('sort').w}×${size('sort').h}, sort-2 ${size('sort-2').w}×${size('sort-2').h}, sort-3 ${size('sort-3').w}×${size('sort-3').h}`);
    const fb = familyBoxes(heads);
    const show = (stem) => { const u = fb.uniform.find((f) => f.stem === stem); return u ? `${stem} ×${u.members} ${u.box}` : `${stem} varies`; };
    out.push(`4.1 name-families ${fb.multi}: ${fb.uniform.length} keep one box (${['lock', 'cart', 'check-circle', 'help', 'layout-footer', 'layout-header', 'layout-sidebar', 'layout-sidebar-right'].map(show).join(', ')}), ${fb.multi - fb.uniform.length} vary`);
    const rd = await ctx.readings();
    const chars = ctx.set.concepts.filter((x) => x === 'sort' || /^sort-(alpha|numeric)-/.test(x));
    const tri = (x) => MASTER_LIST.map((m) => { const h = rd.find((r) => r.m === m && r.name === x); return `${h.w}×${h.h}`; }).join(' · ');
    out.push(`4.1 sort + sort-alpha/-numeric concepts ${chars.length}, boxes ${uniq(chars.map(tri)).join(' | ')}`);
    const wf = await warningFacts(ctx), wi = await numeralWhatIf(ctx);
    out.push(`4.1 warned: sort ${wf.sortDrawings} drawings in ${wf.sortConcepts.length} concepts, + trash ${wf.trash.length} = ${wf.drawings}; with the numeral note ${wf.sortLines} → ${wf.sortLines - (wi.before.outline - wi.after.outline) - (wi.before.filled - wi.after.filled)} lines`);
    const lint = ctx.text('tools/lint.mjs').split('\n');
    out.push(`4.3 lint.mjs lines naming §5…§5f: ${lint.map((l, i) => (/§5/.test(l) ? i + 1 : 0)).filter(Boolean).join(', ')}; its section headers 5b–5f at ${lint.map((l, i) => (/^\s*\/\/ --- 5[b-f]\./.test(l) ? i + 1 : 0)).filter(Boolean).join(', ')}`);
    out.push(`4.3 warning lines citing §6: ${wf.citeS6} of ${wf.lines.length}`);
    const files = ['CLAUDE.md', 'docs/08-refinement.md', '.claude/skills/icon/SKILL.md', 'plans/facing-gap.md', 'docs/01-foundations.md', 'docs/07-character.md'];
    out.push(`4.3 prose lines citing §5b–§5f: ${files.map((f) => `${f}:${sectionCites(ctx.text(f)).join(', ')}`).join(' · ')}`);
    const has = (f, s) => ctx.set.byKey.get(`24/${f}`).src.includes(s);
    out.push(`4.4 building-4's comment has "F's outline, filled another way": ${has('building-4', "F's outline, filled another way")}; compass-3's has "round 1's B filled turned white-on-dark": ${has('compass-3', "round 1's B filled turned white-on-dark")}`);
    return out;
  } },

  s5: { title: '§5 Checked and still true', run: async (ctx) => {
    const w = weightSplit(ctx.set), c = noteCensus(ctx.notes.files);
    const exempt = c.keyline.concepts + c.box.concepts + c.anchor.concepts;
    const pc = pairCensus(await ctx.readings());
    const pkg = JSON.parse(ctx.text('package.json'));
    const hooks = existsSync(join(ctx.repo, '.git/hooks')) ? readdirSync(join(ctx.repo, '.git/hooks')).filter((f) => !f.endsWith('.sample')).length : '-';
    const tags = ctx.git(['tag', '-l']).trim();
    return [
      `${pkg.version}, private ${pkg.private}; git tags ${tags ? tags.split('\n').length : 0}`,
      `${w.heavy.length} concepts line-heavy, ${w.light.length} light, mixed ${w.mixed.length}`,
      `${c.keyline.concepts} + ${c.box.concepts} \`box:\` + ${c.anchor.concepts} \`anchor:\` = ${exempt} of ${ctx.set.concepts.length} concepts (${pct(exempt, ctx.set.concepts.length)}); held to a keyline ${ctx.set.concepts.length - exempt}; overlaps ${c.co.markBox.length + c.co.markAnchor.length + c.co.boxAnchor.length}`,
      `${n(pc.pairs)} pairs, ${pc.missing} missing twins`,
      `src/_legacy-stroke-2/ exists: ${ctx.has('src/_legacy-stroke-2')}`,
      `package.json check = "${pkg.scripts.check}"; a test script: ${'test' in pkg.scripts}; non-sample git hooks in the repo ${hooks}; .husky ${ctx.has('.husky')}, .github ${ctx.has('.github')}`,
      `lint.mjs code lines (not comments) mentioning "parallel": ${ctx.text('tools/lint.mjs').split('\n').filter((l) => /parallel/i.test(l) && !/^\s*\/\//.test(l)).length}`,
    ];
  } },

  s6: { title: '§6 How to rule on this list', run: async (ctx) => {
    const id = identity(ctx), wf = await warningFacts(ctx), lc = looseContainers(radiiAt(ctx, 24));
    const L = (await ctx.lint()).L;
    const stillWarned = (await ctx.readings()).filter((x) => /^sort-(alpha|numeric)-/.test(x.concept) && x.r.warnings.length)
      .filter((x) => L.lintSource(x.m, x.file, /^sort-numeric-/.test(x.concept) ? x.src.replace(/(<svg[^>]*>\n)/, '$1  <!-- glyph: numeral -->\n') : x.src).warnings.length).length;
    const rd = await ctx.readings();
    const lp = uniq(rd.filter((x) => x.m === 24 && !x.filled && ['landscape', 'portrait'].includes(x.kind)).map((x) => x.concept)).length;
    const help = ctx.set.concepts.filter((x) => /^help(-\d)?$/.test(x));
    return [
      `1.7 ${id.textAll.reduce((s, g) => s + g.length, 0)} concepts, plus ${id.only16.reduce((s, g) => s + g.length, 0) / 2} more pairs at 16 only`,
      `1.6 ${noteCensus(ctx.notes.files).anchor.list.filter((x) => /volume-(minus|plus)/.test(x)).length} concepts`,
      `4.1 ${wf.sortConcepts.length} concepts, ${wf.sortDrawings} warned drawings (${stillWarned} after the \`glyph: numeral\` fix)`,
      `3b.3 ${lc[1.5].names.size} at 1.5 against ${lc[2.5].names.size} at 2.5 = ${lc[1.5].names.size + lc[2.5].names.size}`,
      `3b.12 ${lp} concepts held to landscape or portrait; ${noteCensus(ctx.notes.files).box.concepts} opted out by \`box:\``,
      `G6 help concepts without -circle: ${help.length} (${help.reduce((s, x) => s + ctx.set.files.filter((f) => f.concept === x).length, 0)} files); help-circle present: ${ctx.set.byKey.has('24/help-circle')}`,
    ];
  } },
};

/** sort-family.md:9's test (the plans sweep): at 24, outline, no -small/-large, stem = name minus a
 *  trailing number; a family keeps one ink box when every member's lint headline size agrees. */
export function familyBoxes(heads) {
  const fam = {};
  for (const h of heads) {
    if (/-(small|large)$/.test(h.name)) continue;
    (fam[h.name.replace(/-\d+$/, '')] ??= []).push(`${h.w}×${h.h}`);
  }
  const multi = Object.entries(fam).filter(([, v]) => v.length >= 2);
  return { multi: multi.length, uniform: multi.filter(([, v]) => new Set(v).size === 1).map(([stem, v]) => ({ stem, members: v.length, box: v[0] })) };
}

export function keylineFacts(ctx, rd) {
  const ratio = (m, k) => { const [w, h] = MASTERS[m].keylines[k]; const x = r3(w / h); return Math.round(x * 1000) % 10 === 0 ? x.toFixed(2) : x.toFixed(3); };
  const at24 = rd.filter((x) => x.m === 24 && !x.filled);
  const t = {};
  for (const x of at24) t[x.kind] = (t[x.kind] ?? 0) + 1;
  return [
    `3b.12 keyline width ÷ height, 24 / 20 / 16: landscape ${MASTER_LIST.map((m) => ratio(m, 'landscape')).join(' → ')}, portrait ${MASTER_LIST.map((m) => ratio(m, 'portrait')).join(' → ')}`,
    `3b.12 lint's readings at 24 (outline): circle ${t.circle} · square ${t.square} · portrait ${t.portrait} · landscape ${t.landscape} · declared mark ${t.mark} · agreed box ${t.box} · anchored ${t.anchored}; held to landscape or portrait ${(t.landscape ?? 0) + (t.portrait ?? 0)}`,
  ];
}

export function decimalFacts(ctx) {
  const dp = (x) => { const s = String(x); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  const three = MASTER_LIST.map((m) => ctx.set.files.filter((f) => f.m === m && [...f.src.matchAll(/\bd="([^"]+)"/g)].some((d) => (d[1].match(/-?\d*\.?\d+/g) ?? []).some((x) => dp(Number(x)) >= 3))).length);
  const a88 = MASTER_LIST.map((m) => ctx.set.files.filter((f) => f.m === m && /A0\.88 0\.88/.test(f.src)));
  const pc16 = ctx.set.byKey.get('16/plus-circle-filled')?.src ?? '';
  return `3b.14 files with a 3+ dp number: ${MASTER_LIST.map((m, i) => `${three[i]} at ${m}`).join(', ')}; \`A0.88 0.88\`: ${MASTER_LIST.map((m, i) => `${a88[i].length} at ${m}${a88[i].length ? ` (filled ${a88[i].filter((f) => f.filled).length})` : ''}`).join(', ')}; plus-circle-filled at 16 holds 7.13 ${/\b7\.13\b/.test(pc16)} and 8.88 ${/\b8\.88\b/.test(pc16)}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await cli(process.argv.slice(2), SECTIONS, 'stale-probe.mjs');
}
