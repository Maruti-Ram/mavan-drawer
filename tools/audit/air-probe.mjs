#!/usr/bin/env node
// air-probe.mjs — reprints every measured figure in docs/audit/findings-air.md
// (audit card 1.7: axes F8 "air that reads even" and F9 "contact grammar").
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing (stdout only).
//
// USAGE
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P
//   node tools/audit/air-probe.mjs $P [section …]
// No section = all, in document order. An unknown section exits 2; a pin directory
// without src/icons/{24,20,16} prints usage and exits 2. The drawings are read from the
// pin; the instruments (tools/geometry.mjs, tools/masters.mjs, tools/lint.mjs,
// tools/audit/raster.mjs, tools/audit/angles.mjs) are imported from this repo, whose
// copies of geometry/masters/lint equal the pin's (`git diff 5933041 HEAD -- …` is empty).
// This document cites no reference set, so there is no --refs flag.
//
// SECTIONS — each prints `## §<n> <title>` and then the figures as the document states them.
// Seconds: one process per section on this machine (Apple silicon, Node 24.20); most of a
// section's time is a shared layer it builds (sweep ~6 s, air spans ~10 s, gap census ~40 s,
// lint over the pin ~20 s, contact census ~6 s), so a run of several sections pays each once.
//   head    header lines 3-4: 2,910 drawings, lint baseline at the pin               ~19 s
//   scope   "Scope stated plainly" (lines 18-21): the 2x / 3x renders                <1 s
//   s0      §0  Finding A1 — raster.mjs `classify` on a filled shape                 <1 s
//   s1      §1  the unit is one device pixel                                         ~6 s
//   s2      §2  the mechanisms, separated and measured                               ~17 s
//   s3a     §3a the seven situations                                                 ~6 s
//   s3b     §3b the channel's angle                                                  <1 s
//   s3c     §3c alignment is free                                                    <1 s
//   s3d     §3d C7 against section 6 — the phase of every axial span                 ~11 s
//   s4a     §4a census of every air span                                             ~10 s
//   s4b     §4b what the floor actually delivers (airMin)                            ~11 s
//   s4c     §4c the 42 spans that leave no light pixel                               ~11 s
//   s4d     §4d the effective floor 1.485                                            ~10 s
//   s4e     §4e the full gap census and its proof against lint (lint twice)          ~150-200 s
//   s4f     §4f the candidate-floor table                                            ~43 s
//   s4g     §4g how much the floor is shaping the set                                ~46 s
//   s4h     §4h four things lint cannot see                                          ~48 s
//   s4i     §4i lint reports overlapping ink as a negative gap                       ~94 s
//   s5      §5  does one constant do the job (the three repo statements)             ~15 s
//   s6a     §6a the three exceptions, measured                                       ~18 s
//   s6b     §6b the shape that would need no exceptions (derived values)             <1 s
//   s6c     §6c what it would cost                                                   ~14 s
//   p2      Part two intro, lines 508-546: the contact census                        ~7 s
//   s7      §7  lint's coverage of contact                                           ~44 s
//   s8      §8  the implicit rule                                                    ~7 s
//   s9      §9  does a junction show? (138 render probes)                            ~10 s
//   s10     §10 the exceptions have no rule                                          ~6 s
//   s11     §11 where ink touching is doing real work                                ~6 s
//   s12     §12 where the grammar is not the same across the set                     ~7 s
//   judged  "Judged list" — the figures it states that no section above prints       ~90 s
//   eye     "What only Maruti's eye can settle" — the measured ladder it quotes      ~16 s
// A full run (every section, each layer built once) took 106-152 s here and 238 s wall (146 s CPU) for a
// reviewer on a loaded machine: the time follows the load, the figures do not.
//
// WHERE THE LOGIC CAME FROM (the 2026-10-04 scratch scripts, folded in and rewritten)
//   airprobe.mjs → sweep()       diagprobe.mjs → diagSweep()   aligncheck.mjs → s3c, s5
//   realphase.mjs → airSpans()   airread.mjs → airRead()       cost.mjs → s6c
//   classify-bug.mjs → s0        retina.mjs → scope            dump.mjs → s4c's pixel reads
//   blindspots.mjs → lintPairDrops()   gap-census.mjs → gapCensus(), gapProof()
//   contact-census.mjs → contactCensus(), junctionProbe()   inline `node -e` analyses → the sections
// Two ports of lint's gap loops live here on purpose, because the document reports both and
// their agreement: airSpans() (the span geometry, for phase and pixels) and gapCensus() (lint's
// own readings, kept). Neither copies lint: gapCensus() re-implements its four loops, and the
// one figure only lint's private state can give — its `measured[]` array — is read from an
// IN-MEMORY copy of tools/lint.mjs (two import specifiers made absolute, the return line
// extended), imported from a data: URL. Nothing is written to disk.
//
// KNOWN INSTRUMENT DEFECTS, AND HOW EACH IS WORKED AROUND
//   raster.mjs `classify` (plan, "Known instrument defects"; this document's Finding A1): every
//     coverage figure in Part one samples `reg.covered` directly and never goes through
//     `classify` / `boxCoverage` / `rasterise`. §0 calls the defective functions on purpose, to
//     print the defect. §9's render probe used `rasterise`, as the original contact census did;
//     s9 prints how many of its probes sit in a file with an area path and how far each of those
//     moves its endpoint (zero), so the defect cannot reach a difference there.
//   geometry.mjs `bbox()` arc sampling: used only inside lint's own glyph rule (`isShell`), the
//     way lint uses it, so the readings stay lint's. No box is quoted from it.
//   build.mjs 2 dp box rounding, pixelgrid.mjs, figma.mjs, congruence.mjs: not used.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { samplePath, bbox, isDot, selfGap, materialGap, facingGap, subpathsOf, parsePath } from '../geometry.mjs';
import { STROKES, FILLED_WEIGHT, MIN_GAP, GLYPH_GAP, strokeOf, weightOf, isFilled, gridOf, gridName } from '../masters.mjs';
import { lintSource, checkFamilies, checkPairs, checkAnchors, parseGapNote, parseGlyphNote } from '../lint.mjs';
import { region, rasterise, boxCoverage, inkArea, iconFromText, flatten } from './raster.mjs';
import { iconFromSource } from './angles.mjs';

// ── small helpers ──────────────────────────────────────────────────────────
const MASTER_LIST = [24, 20, 16];
export const r2 = (n) => Math.round(n * 100) / 100;
export const r3 = (n) => Math.round(n * 1000) / 1000;
const r4 = (n) => (Number.isFinite(n) ? Math.round(n * 10000) / 10000 : n);
const int = (n) => Number(n).toLocaleString('en-US');
const d1 = (n) => (n == null ? '—' : Number.isInteger(n) ? n.toFixed(1) : String(n));   // the document writes 1.0, 2.0
// the document's kind names where its tables use them (§4a's narrowest twelve)
const DOC_KIND = { 'facing-line': 'shape-to-line', 'facing-cut': 'cut', 'facing-notch': 'notch', 'facing-separation': 'band', 'facing-self': 'counter' };
export const pct = (a, b, d = 1) => (b ? `${((100 * a) / b).toFixed(d)}%` : '—');
const uniq = (arr, f) => new Set(arr.map(f)).size;
const conceptOf = (name) => name.replace(/-filled$/, '');
const median = (vals) => { const v = [...vals].sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const say = (s = '') => console.log(s);
const head = (t) => say(`\n## ${t}`);
const table = (header, rows) => {
  say(`| ${header.join(' | ')} |`);
  say(`|${header.map(() => '---').join('|')}|`);
  for (const r of rows) say(`| ${r.join(' | ')} |`);
};
const memo = (fn) => { let v; let done = false; return () => (done ? v : (done = true, v = fn())); };

// ── the pin ────────────────────────────────────────────────────────────────
/** Every drawing in the pin, 24 then 20 then 16, files in name order (lint's own order). */
export function loadPin(pin) {
  const out = [];
  for (const m of MASTER_LIST) {
    const dir = join(pin, 'src/icons', String(m));
    for (const file of readdirSync(dir).filter((x) => x.endsWith('.svg')).sort())
      out.push({ master: m, file, name: file.slice(0, -4), src: readFileSync(join(dir, file), 'utf8') });
  }
  return out;
}

// lint.mjs:40 and lint.mjs:203-283, the per-file setup every port below shares.
const AREA = /<path fill="currentColor" fill-rule="evenodd" stroke="none" d="([^"]+)"\/>/g;
/** A drawing's area paths, stroked paths and stroke weight, exactly as lintSource reads them. */
export function partsOf(file, src, m) {
  const areas = file.endsWith('-filled.svg') ? [...src.matchAll(AREA)].map((x) => x[1]) : [];
  const root = src.match(/<svg\b([^>]*)>/);
  if (!root) return { areas, ds: [], stroke: weightOf(file.replace('.svg', ''), m), noRoot: true };
  const body = src.slice(root.index + root[0].length).replace(/<\/svg>\s*$/, '');
  const stripped = body.replace(/<!--[\s\S]*?-->/g, '').replace(AREA, '');
  const ds = [...stripped.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((x) => x[1]);
  // a shape-filled file keeps the OUTLINE weight for its lines; a line-heavy -filled file draws at FILLED_WEIGHT
  const stroke = areas.length ? strokeOf(m) : weightOf(file.replace('.svg', ''), m);
  return { areas, ds, stroke };
}

// lint.mjs:10 polyGap and lint.mjs:50-58 crosses, re-stated (not exported by lint).
export function polyGap(a, b) {
  let min = Infinity;
  for (const [px, py] of a) for (let k = 0; k < b.length; k++) {
    const [x1, y1] = b[k], [x2, y2] = b[k + 1] ?? b[k];
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    const t = L && L < 0.3 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
    min = Math.min(min, Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)));
  }
  return min;
}
/** As polyGap, but also returns the two centreline points it was taken between. A NaN sample
 *  is passed over (realphase.mjs's behaviour), where polyGap's Math.min would return NaN. */
export function polyGapAt(a, b) {
  let min = Infinity, at = null;
  for (const [px, py] of a) for (let k = 0; k < b.length; k++) {
    const [x1, y1] = b[k], [x2, y2] = b[k + 1] ?? b[k];
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    const t = L && L < 0.3 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
    const d = Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    if (d < min) { min = d; at = [[px, py], [x1 + t * dx, y1 + t * dy]]; }
  }
  return { min, at };
}
const side = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
export const crosses = (a, b) => {
  for (let i = 1; i < a.length; i++) for (let j = 1; j < b.length; j++) {
    const [p, q, r, s] = [a[i - 1], a[i], b[j - 1], b[j]];
    if (side(p, q, r) * side(p, q, s) < 0 && side(r, s, p) * side(r, s, q) < 0) return true;
  }
  return false;
};

// ════════════════════════════════════════════════════════════════════════════
// PART ONE INSTRUMENTS
// ════════════════════════════════════════════════════════════════════════════

/** Coverage of the box [x0,x1]x[y0,y1] by sampling reg.covered on a rate x rate grid inside it
 *  (sample at x0 + (a + 0.5)/rate · width). Never touches raster.mjs's `classify` (defect A1). */
export function sampleBox(reg, x0, y0, x1, y1, rate) {
  let hit = 0;
  for (let a = 0; a < rate; a++) for (let b = 0; b < rate; b++)
    if (reg.covered(x0 + ((a + 0.5) / rate) * (x1 - x0), y0 + ((b + 0.5) / rate) * (y1 - y0))) hit++;
  return hit / (rate * rate);
}

// ── the synthetic sweep (airprobe.mjs) ──────────────────────────────────────
// A gap reads as background when one whole device-pixel row across it stays untouched.
//   lightest = min over pixel rows in the air band of (max coverage across the window):
//              0 → a fully clear row exists; 1 → welded shut.
//   weld     = every row in the band has min coverage >= 0.995.
export const SWEEP_RATE = 32;                       // airprobe.mjs RATE
export function readAir(paths, canvas, px, band, win, rate = SWEEP_RATE) {
  const reg = region(paths, { label: 'airprobe' });
  const unit = canvas / px;
  const rowStat = (j) => {
    const y0 = j * unit, y1 = (j + 1) * unit;
    let mx = 0, mn = 1;
    for (let i = Math.floor(win[0] / unit); i < Math.ceil(win[1] / unit); i++) {
      const c = sampleBox(reg, i * unit, y0, (i + 1) * unit, y1, rate);
      mx = Math.max(mx, c); mn = Math.min(mn, c);
    }
    return { row: j, max: mx, min: mn };
  };
  const j0 = Math.max(0, Math.floor((band[0] - 1.5) / unit)), j1 = Math.min(px - 1, Math.ceil((band[1] + 1.5) / unit));
  const rows = [];
  for (let j = j0; j <= j1; j++) rows.push(rowStat(j));
  const inBand = rows.filter((r) => (r.row + 1) * unit > band[0] + 1e-9 && r.row * unit < band[1] - 1e-9);
  const lightest = inBand.length ? Math.min(...inBand.map((r) => r.max)) : null;
  return {
    rows: inBand.length,
    lightest: lightest == null ? null : r3(lightest),
    clearRow: lightest === 0,
    weld: inBand.length > 0 && inBand.every((r) => r.min >= 0.995),
  };
}

const L_RUN = 12, X0 = 2;                           // airprobe.mjs: a long run, window left edge
/** The nine constructions. Each returns {paths, band, win, flank} for edge gap g at master m,
 *  with the air band starting at `top` (how phase is swept). flank = ink depth either side. */
export const SITUATIONS = {
  'parallel-run': (m, g, top) => {                  // two outline strokes side by side (menu lines)
    const s = STROKES[m], a = top - s / 2, b = top + g + s / 2;
    return { paths: [{ d: `M${X0} ${a}h${L_RUN}`, kind: 'stroke', weight: s }, { d: `M${X0} ${b}h${L_RUN}`, kind: 'stroke', weight: s }],
      band: [top, top + g], win: [X0 + 1, X0 + L_RUN - 1], flank: [s, s] };
  },
  'facing-short': (m, g, top) => {                  // a 2-unit stroke facing a long wall
    const s = STROKES[m], a = top - s / 2, b = top + g + s / 2;
    return { paths: [{ d: `M${X0 + 5} ${a}h2`, kind: 'stroke', weight: s }, { d: `M${X0} ${b}h${L_RUN}`, kind: 'stroke', weight: s }],
      band: [top, top + g], win: [X0 + 5, X0 + 7], flank: [s, s] };
  },
  'facing-caps': (m, g, top) => {                   // two round caps tip to tip
    const s = STROKES[m], a = top - s / 2, b = top + g + s / 2, cx = X0 + L_RUN / 2;
    return { paths: [{ d: `M${cx} ${a - 4}V${a}`, kind: 'stroke', weight: s }, { d: `M${cx} ${b}V${b + 4}`, kind: 'stroke', weight: s }],
      band: [top, top + g], win: [cx - s / 2, cx + s / 2], flank: [s, s] };
  },
  knockout: (m, g, top) => {                        // a white slot cut out of a solid (evenodd)
    const h = g / 2, x1 = X0 + 1.5, x2 = X0 + L_RUN - 1.5;
    const outer = `M${X0} ${top - 5}H${X0 + L_RUN}V${top + g + 5}H${X0}Z`;
    const cut = `M${x1} ${top}H${x2}a${h} ${h} 0 0 1 0 ${g}H${x1}a${h} ${h} 0 0 1 0 -${g}Z`;
    return { paths: [{ d: `${outer}${cut}`, kind: 'area' }], band: [top, top + g], win: [x1 + 1, x2 - 1], flank: [5, 5] };
  },
  'closed-counter': (m, g, top) => {                // the counter inside one closed stroked slot
    const s = STROKES[m], cy0 = top - s / 2, cy1 = top + g + s / 2, rr = (cy1 - cy0) / 2;
    const slot = `M${X0 + 2} ${cy0}H${X0 + L_RUN - 2}a${rr} ${rr} 0 0 1 0 ${cy1 - cy0}H${X0 + 2}a${rr} ${rr} 0 0 1 0 ${cy0 - cy1}Z`;
    return { paths: [{ d: slot, kind: 'stroke', weight: s }], band: [top, top + g], win: [X0 + 3, X0 + L_RUN - 3], flank: [s, s] };
  },
  'glyph-mouth': (m, g, top) => {                   // a C of radius 4 whose two ends face across g
    const s = STROKES[m], R = 4, cx = X0 + L_RUN / 2, cy = top + g / 2, half = (g + s) / 2;
    const ax = cx + Math.sqrt(Math.max(R * R - half * half, 0.01));
    const c = `M${r3(ax)} ${r3(cy - half)}A${R} ${R} 0 1 0 ${r3(ax)} ${r3(cy + half)}`;
    return { paths: [{ d: c, kind: 'stroke', weight: s }], band: [top, top + g], win: [ax - s, ax + s], flank: [s, s] };
  },
  'solid-band': (m, g, top) => ({                   // ink | white | ink, two solids
    paths: [{ d: `M${X0} ${top - 5}H${X0 + L_RUN}V${top}H${X0}Z`, kind: 'area' },
      { d: `M${X0} ${top + g}H${X0 + L_RUN}V${top + g + 5}H${X0}Z`, kind: 'area' }],
    band: [top, top + g], win: [X0 + 1, X0 + L_RUN - 1], flank: [5, 5],
  }),
  'shape-to-line': (m, g, top) => {                 // a solid facing a stroked line
    const s = STROKES[m];
    return { paths: [{ d: `M${X0} ${top - 5}H${X0 + L_RUN}V${top}H${X0}Z`, kind: 'area' }, { d: `M${X0} ${top + g + s / 2}h${L_RUN}`, kind: 'stroke', weight: s }],
      band: [top, top + g], win: [X0 + 1, X0 + L_RUN - 1], flank: [5, s] };
  },
  'parallel-run-filled': (m, g, top) => {           // two FILLED_WEIGHT strokes side by side
    const s = FILLED_WEIGHT[m], a = top - s / 2, b = top + g + s / 2;
    return { paths: [{ d: `M${X0} ${a}h${L_RUN}`, kind: 'stroke', weight: s }, { d: `M${X0} ${b}h${L_RUN}`, kind: 'stroke', weight: s }],
      band: [top, top + g], win: [X0 + 1, X0 + L_RUN - 1], flank: [s, s] };
  },
};
export const SWEEP_GAPS = Array.from({ length: 18 }, (_, k) => r3(0.125 * (k + 1)));   // 0.125 → 2.25 in eighths
export const PHASES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];

/** Every situation x master x gap x phase, rendered at px = master (1 unit = 1 device pixel). */
export function sweep({ situations = SITUATIONS, masters = MASTER_LIST, gaps = SWEEP_GAPS, phases = PHASES } = {}) {
  const rows = [];
  for (const [name, make] of Object.entries(situations)) for (const m of masters) for (const g of gaps) for (const ph of phases) {
    const top = Math.round(m * 0.45) + ph;
    const { paths, band, win, flank } = make(m, g, top);
    rows.push({ situation: name, master: m, gap: g, phase: ph, flank, ...readAir(paths, m, m, band, win) });
  }
  return rows;
}
/** The smallest gap from which `f` holds at it and at every larger gap (airprobe.mjs `stable`). */
const stableFrom = (gaps, f) => gaps.find((g) => gaps.filter((h) => h >= g).every(f)) ?? null;
export function floorsOf(rows, situation, master) {
  const mine = rows.filter((r) => r.situation === situation && r.master === master);
  const gaps = [...new Set(mine.map((r) => r.gap))].sort((a, b) => a - b);
  const at = (g) => mine.filter((r) => r.gap === g);
  return {
    every: stableFrom(gaps, (g) => at(g).every((r) => r.clearRow)),
    best: stableFrom(gaps, (g) => at(g).some((r) => r.clearRow)),
    worst: (g) => Math.max(...at(g).map((r) => r.lightest)),
    clear: (g) => at(g).filter((r) => r.clearRow).length,
    flank: mine[0]?.flank,
  };
}

// ── the channel-angle sweep (diagprobe.mjs) ─────────────────────────────────
export const DIAG_RATE = 24;
function diagStrips(m, g, deg, off) {
  const s = STROKES[m], t = (deg * Math.PI) / 180, nx = -Math.sin(t), ny = Math.cos(t);
  const d = (g + s) / 2, cx = m / 2 + off, cy = m / 2 + off, Lh = m;
  const line = (sgn) => {
    const px = cx + sgn * d * nx, py = cy + sgn * d * ny;
    return `M${r3(px - Math.cos(t) * Lh)} ${r3(py - Math.sin(t) * Lh)}L${r3(px + Math.cos(t) * Lh)} ${r3(py + Math.sin(t) * Lh)}`;
  };
  return [{ d: line(-1), kind: 'stroke', weight: s }, { d: line(1), kind: 'stroke', weight: s }];
}
/** Is one device pixel of pure background INSIDE the channel (its whole box between the walls)? */
export function anyClearPixel(m, g, deg, off, rate = DIAG_RATE) {
  const reg = region(diagStrips(m, g, deg, off), { label: 'diag' });
  const t = (deg * Math.PI) / 180, nx = -Math.sin(t), ny = Math.cos(t);
  const cx = m / 2 + off, cy = m / 2 + off, h = g / 2;
  const inChannel = (i, j) => [[i, j], [i + 1, j], [i, j + 1], [i + 1, j + 1]]
    .every(([x, y]) => Math.abs((x - cx) * nx + (y - cy) * ny) <= h + 1e-9);
  for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) {
    if (!inChannel(i, j)) continue;
    let hit = 0;
    for (let a = 0; a < rate && hit === 0; a++) for (let b = 0; b < rate && hit === 0; b++)
      if (reg.covered(i + (a + 0.5) / rate, j + (b + 0.5) / rate)) hit++;
    if (hit === 0) return true;
  }
  return false;
}
export const DIAG_GAPS = Array.from({ length: 27 }, (_, k) => r3(0.875 + 0.0625 * k));   // 0.875 → 2.5 in sixteenths
export const DIAG_ANGLES = [0, 15, 22.5, 30, 45, 60, 67.5, 75, 90];
export function diagSweep({ angles = DIAG_ANGLES, master = 16, gaps = DIAG_GAPS, offsets = PHASES } = {}) {
  const out = [];
  for (const deg of angles) {
    const t = (deg * Math.PI) / 180;
    let best = null, every = null;
    for (const g of gaps) {
      const res = offsets.map((o) => anyClearPixel(master, g, deg, o));
      if (best === null && res.some(Boolean)) best = g;
      if (every === null && res.every(Boolean)
        && gaps.filter((h) => h >= g).every((h) => offsets.every((o) => anyClearPixel(master, h, deg, o)))) { every = g; break; }
    }
    out.push({ deg, best, every, theory: r3(Math.abs(Math.cos(t)) + Math.abs(Math.sin(t))) });
  }
  return out;
}

/** retina.mjs: a parallel run at the 16 master shown at px device pixels — how many of the
 *  eight phases leave one fully clear pixel row in the air. */
export function phasesClearAt(g, px, { canvas = 16, stroke = STROKES[16], rate = SWEEP_RATE, phases = PHASES } = {}) {
  let n = 0;
  for (const phase of phases) {
    const unit = canvas / px, top = 7 + phase;
    const reg = region([{ d: `M3 ${top - stroke / 2}h10`, kind: 'stroke', weight: stroke },
      { d: `M3 ${top + g + stroke / 2}h10`, kind: 'stroke', weight: stroke }], { label: 'retina' });
    let clear = 0;
    for (let j = 0; j < px; j++) {
      const y0 = j * unit, y1 = (j + 1) * unit;
      if (y1 <= top || y0 >= top + g) continue;
      let any = false;
      for (let i = 4; i < 12 && !any; i++)
        for (let a = 0; a < rate && !any; a++) for (let b = 0; b < rate && !any; b++)
          if (reg.covered(i + (a + 0.5) / rate, y0 + ((b + 0.5) / rate) * unit)) any = true;
      if (!any) clear++;
    }
    if (clear > 0) n++;
  }
  return n;
}

/** Arithmetic: does a band [lo, lo + w] contain one whole pixel (realphase.mjs `verdict`)? */
export const holdsWholePixel = (lo, w, eps = 1e-6) => Math.floor(lo + w + eps) - Math.ceil(lo - eps) >= 1;

// ── every air span in the shipped set (realphase.mjs) ───────────────────────
/** The verdict on one air span whose ends p, q sit on the two ink edges. */
export function verdict(p, q) {
  const dx = Math.abs(q[0] - p[0]), dy = Math.abs(q[1] - p[1]);
  const width = Math.hypot(dx, dy);
  let axis = 'diagonal';
  if (dx < 0.02 && dy >= 0.02) axis = 'vertical';        // a pixel ROW must fit
  else if (dy < 0.02 && dx >= 0.02) axis = 'horizontal'; // a pixel COLUMN must fit
  if (axis === 'diagonal') return { axis, width: r3(width), phase: null, wholePixel: null, p, q };
  const lo = axis === 'vertical' ? Math.min(p[1], q[1]) : Math.min(p[0], q[0]);
  return { axis, width: r3(width), phase: r3(lo - Math.floor(lo)), wholePixel: holdsWholePixel(lo, width), p, q };
}
export const isAxial = (r) => r.axis === 'horizontal' || r.axis === 'vertical';

/** One drawing's air spans: lint §5 pairs, §5b selfGap, §5f facingGap (both kinds), each
 *  pulled back to the two ink edges. §5c measures material, not air, and is left out. */
export function airSpansOf({ master: m, file, src }) {
  const name = file.replace(/\.svg$/, '');
  const { areas, ds, stroke } = partsOf(file, src, m);
  // realphase.mjs read `glyph: dot` and `glyph: numeral` alike; no numeral file has a dot path,
  // so the pair rule below is lint's on the pin either way
  const glyphKind = src.match(/<!--\s*glyph:\s*(dot|numeral)\s*-->/)?.[1] ?? null;
  const gapNote = src.match(/<!--\s*gap:\s*([\d.]+)\s*-->/);
  const base = { file: name, concept: conceptOf(name), master: m, style: isFilled(name) ? 'filled' : 'outline',
    shapeFilled: areas.length > 0, isGlyph: glyphKind != null, glyphKind, gapNote: gapNote ? Number(gapNote[1]) : null };
  const rows = [];
  const sampled = ds.map((d) => samplePath(d));
  const spans = ds.map((d) => bbox([d]));
  const whole = ds.length ? bbox(ds) : null;
  const isShell = (b) => whole && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(b[k] - whole[k]) < 0.01);
  for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
    if (crosses(sampled[i], sampled[j])) continue;
    const A = polyGapAt(sampled[i], sampled[j]), B = polyGapAt(sampled[j], sampled[i]);
    const best = A.min <= B.min ? A : B;
    if (best.min <= 0.1) continue;
    const [c0, c1] = best.at, L = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
    if (!L) continue;
    const ux = (c1[0] - c0[0]) / L, uy = (c1[1] - c0[1]) / L, h = stroke / 2;
    const glyphPair = base.isGlyph && isDot(ds[i]) !== isDot(ds[j]) && !isShell(spans[i]) && !isShell(spans[j]);
    rows.push({ ...base, kind: 'pair', glyphPair, paths: [i + 1, j + 1], ...verdict([c0[0] + ux * h, c0[1] + uy * h], [c1[0] - ux * h, c1[1] - uy * h]) });
  }
  for (let i = 0; i < ds.length; i++) {
    if (isDot(ds[i])) continue;
    const s = selfGap(ds[i], stroke);
    if (!s) continue;
    // selfGap hands back only the midpoint (geometry.mjs:313): recover the span as the sample pair
    // whose midpoint is that point and whose separation is reading + stroke
    const pts = samplePath(ds[i]), want = s.gap + stroke;
    let pair = null, err = Infinity;
    for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
      const e = Math.hypot((pts[a][0] + pts[b][0]) / 2 - s.at[0], (pts[a][1] + pts[b][1]) / 2 - s.at[1])
        + Math.abs(Math.hypot(pts[b][0] - pts[a][0], pts[b][1] - pts[a][1]) - want);
      if (e < err) { err = e; pair = [pts[a], pts[b]]; }
    }
    if (!pair || err > 0.3) { rows.push({ ...base, kind: 'self', axis: 'unresolved', width: s.gap, phase: null, wholePixel: null }); continue; }
    const [c0, c1] = pair, LL = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]), hh = stroke / 2;
    const ux = (c1[0] - c0[0]) / LL, uy = (c1[1] - c0[1]) / LL;
    rows.push({ ...base, kind: 'self', path: i + 1, ...verdict([c0[0] + ux * hh, c0[1] + uy * hh], [c1[0] - ux * hh, c1[1] - uy * hh]) });
  }
  if (ds.length || areas.length) {
    const air = facingGap(ds, stroke, areas);
    for (const a of air.self) rows.push({ ...base, kind: 'facing-self', path: a.path + 1, ...verdict(a.span[0], a.span[1]) });
    for (const a of air.area) rows.push({ ...base, kind: `facing-${a.kind}`, ...verdict(a.span[0], a.span[1]) });
  }
  return rows;
}
export const airSpans = (set) => set.flatMap(airSpansOf);

/** airread.mjs: the lowest coverage of any device pixel the span's OPEN segment passes
 *  through, at px = master (1 unit = 1 pixel), sampled at `rate` through reg.covered. */
export const AIR_RATE = 16;
export function airMinOf(reg, s, rate = AIR_RATE) {
  const [x0, y0] = s.p, [x1, y1] = s.q;
  const seen = new Set();
  const n = Math.max(8, Math.ceil(s.width * 32));
  for (let t = 1; t < n; t++) seen.add(`${Math.floor(x0 + ((x1 - x0) * t) / n)},${Math.floor(y0 + ((y1 - y0) * t) / n)}`);
  let min = 1, at = null;
  for (const key of seen) {
    const [i, j] = key.split(',').map(Number);
    if (i < 0 || j < 0 || i >= s.master || j >= s.master) continue;
    const c = sampleBox(reg, i, j, i + 1, j + 1, rate);
    if (c < min) { min = c; at = [i, j]; }
  }
  return { airMin: r3(min), airAt: at, pixels: seen.size };
}
// keyed on the drawing record (loadPin makes new ones per pin), so two pins never share a region
const regionCache = new WeakMap();
/** The rasteriser's region for one drawing (area + stroked paths at the file's own weights). */
export function regionOfDrawing(d) {
  if (!regionCache.has(d)) {
    const k = `${d.master}/${d.name}`;
    regionCache.set(d, region(iconFromText(d.src, k).paths, { label: k }));
  }
  return regionCache.get(d);
}
export function airRead(spans, set) {
  const byKey = new Map(set.map((d) => [`${d.master}/${d.name}`, d]));
  return spans.filter((s) => s.width != null && s.width < 2.0 && s.p && s.q)
    .map((s) => ({ ...s, ...airMinOf(regionOfDrawing(byKey.get(`${s.master}/${s.file}`)), s) }));
}

// ════════════════════════════════════════════════════════════════════════════
// THE GAP CENSUS — lint's four loops, readings kept (gap-census.mjs)
// ════════════════════════════════════════════════════════════════════════════
const AIR_TEXT = { cut: 'across one cut-out', notch: 'in a notch of the outer edge', separation: 'between two filled edges', line: 'between a shape and a line' };
/** One drawing through lint's §5, §5b, §5c and §5f, every reading kept. `trap` is the negative
 *  control only: the WRONG stroke (filled weight on a shape-filled file). */
export function censusFile(canvas, file, src, { trap = false } = {}) {
  const name = file.replace(/\.svg$/, ''), concept = conceptOf(name);
  const style = file.endsWith('-filled.svg') ? 'filled' : 'outline';
  const { areas, ds, stroke: lintStroke, noRoot } = partsOf(file, src, canvas);
  const STROKE = areas.length && trap ? weightOf(name, canvas) : lintStroke;
  let gap = parseGapNote(src);
  const gapNote = gap ? (gap.bad ? `gap:BAD(${gap.raw})` : `gap:${gap.n}`) : null;
  if (gap?.bad || (gap && gap.n >= MIN_GAP)) gap = null;
  const GAP = gap ? gap.n : MIN_GAP;
  let glyph = parseGlyphNote(src);
  const glyphNote = glyph ? (glyph.bad ? `glyph:BAD(${glyph.raw})` : `glyph:${glyph.kind}`) : null;
  if (glyph?.bad) glyph = null;
  const isGlyph = glyph?.kind === 'dot', isNumeral = glyph?.kind === 'numeral';
  const noteOnFile = [gapNote, glyphNote].filter(Boolean).join(' ');
  const rows = [], warnings = [], measured = [];
  const info = { file: name, concept, master: canvas, style, nPaths: ds.length, nAreas: areas.length, materialNull: false };
  if (noRoot) return { rows, warnings, measured, info };
  const base = { file: name, concept, master: canvas, style, shapeFilled: areas.length > 0, noteOnFile };
  const src5 = (inGlyph) => (inGlyph ? 'GLYPH_GAP' : gap ? 'note' : 'MIN_GAP');
  const add = (o) => rows.push({ ...base, sub: null, ...o });

  // §5 — separate stroked paths
  const sampled = ds.map(samplePath);
  const spans = ds.map((d) => bbox([d]));
  const whole = ds.length ? bbox(ds) : null;
  const isShell = (b) => whole && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(b[k] - whole[k]) < 0.01);
  for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
    const glyphPair = isGlyph && isDot(ds[i]) !== isDot(ds[j]) && !isShell(spans[i]) && !isShell(spans[j]);
    const floor = glyphPair ? GLYPH_GAP : GAP, need = floor + STROKE;
    const min = Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i]));
    const isCross = crosses(sampled[i], sampled[j]);
    const common = { pathA: i + 1, pathB: j + 1, centreline: r4(min), glyphPair };
    if (isCross) { add({ kind: 'pair-crossing', value: r4(min - STROKE), floorApplied: null, lintWouldWarn: false, ...common }); continue; }
    if (min <= 0.1) { add({ kind: 'pair-touching', value: r4(min - STROKE), floorApplied: null, lintWouldWarn: false, ...common }); continue; }
    if (!glyphPair) measured.push(r2(min - STROKE));
    const warn = min < need - 0.01;
    if (warn) warnings.push(`paths ${i + 1}/${j + 1} are ${r2(min)} apart — ${glyphPair ? 'C19 glyph gap' : gap ? `agreed gap ${gap.n}` : '§6'} needs ${need} (edge gap ${r2(min - STROKE)} < ${floor})`);
    if (!Number.isFinite(min)) {
      // a zero-length arc gives samplePath NaN samples; Math.min returns NaN and lint never judges the pair
      const ok = (a) => a.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
      const cA = ok(sampled[i]), cB = ok(sampled[j]);
      const clean = Math.min(polyGap(cA, cB), polyGap(cB, cA));
      add({ kind: 'pair', value: null, floorApplied: floor, lintWouldWarn: false, ...common, centreline: null, unmeasurable: 'NaN',
        centrelineIfNaNDropped: r4(clean), skippedAsTouchingIfNaNDropped: !crosses(cA, cB) && clean <= 0.1 });
      continue;
    }
    add({ kind: 'pair', value: r4(min - STROKE), floorApplied: floor, floorSource: src5(glyphPair), lintWouldWarn: warn, ...common });
  }
  // §5b — a path against itself
  const read5b = [];
  for (let i = 0; i < ds.length; i++) {
    if (isDot(ds[i])) continue;
    const self = selfGap(ds[i], STROKE);
    read5b[i] = self;
    if (!self) continue;
    const inGlyph = (isGlyph && !isShell(spans[i])) || isNumeral, floor = inGlyph ? GLYPH_GAP : GAP;
    if (!inGlyph) measured.push(self.gap);
    const warn = self.gap < floor - 0.01;
    if (warn) warnings.push(`path ${i + 1} comes within ${self.gap} of itself at ${self.at.join(',')} — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor} (it turns ${self.span}°)`);
    add({ kind: 'self', value: self.gap, floorApplied: floor, floorSource: src5(inGlyph), lintWouldWarn: warn, path: i + 1 });
  }
  // §5c — material a knockout leaves; run on every file with areas, recording whether lint does
  if (areas.length) {
    const lintRan = ds.length === 0, left = materialGap(areas), floor = isGlyph ? GLYPH_GAP : MIN_GAP;
    if (left) {
      const would = left.gap < floor - 0.01, warn = lintRan && would;
      if (warn) warnings.push(`the knockout leaves ${left.gap} of material between two parts of itself at ${left.at.join(',')} — ${isGlyph ? 'C19 glyph gap' : '§6'} needs ${floor}: a knockout may not be cut wider than the counter it sits in`);
      add({ kind: 'material', value: left.gap, floorApplied: floor, lintWouldWarn: warn, lintRan, wouldWarnIfRun: would });
    } else info.materialNull = true;
  }
  // §5f — walls facing each other across air
  {
    const air = facingGap(ds, STROKE, areas);
    const shut = (sub) => { const p = samplePath(sub); return p.length > 2 && Math.hypot(p.at(-1)[0] - p[0][0], p.at(-1)[1] - p[0][1]) < 0.01; };
    for (const { path, gap: g, at } of air.self) {
      const d = ds[path], subs = subpathsOf(d);
      const inGlyph = (isGlyph && !isShell(spans[path])) || isNumeral, floor = inGlyph ? GLYPH_GAP : GAP;
      let suppressedBy = null;
      if (isDot(d) || (subs.length === 1 && !shut(subs[0]))) suppressedBy = 'dot-or-open-single-subpath';   // "5b reads it"
      else if (read5b[path] && read5b[path].gap <= g + 0.02) suppressedBy = 'read5b';                        // "5b read this neck"
      const would = g < floor - 0.01, warn = !suppressedBy && would;
      if (!suppressedBy && !inGlyph) measured.push(g);
      if (warn) warnings.push(`path ${path + 1} faces itself across ${g} of air at ${at.join(',')} — ${inGlyph ? 'C19 glyph gap' : gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
      add({ kind: 'facing', sub: 'self', value: g, floorApplied: floor, floorSource: src5(inGlyph), lintWouldWarn: warn, path: path + 1,
        suppressedBy, wouldWarnUnfiltered: would, read5b: read5b[path] ? read5b[path].gap : null });
    }
    for (const { kind, gap: g, at } of air.area) {
      measured.push(g);
      const warn = g < GAP - 0.01;
      if (warn) warnings.push(`${g} of air ${AIR_TEXT[kind]} at ${at.join(',')} — ${gap ? `agreed gap ${gap.n}` : '§6'} needs ${GAP}`);
      add({ kind: 'facing', sub: kind, value: g, floorApplied: GAP, floorSource: gap ? 'note' : 'MIN_GAP', lintWouldWarn: warn, suppressedBy: null, wouldWarnUnfiltered: warn });
    }
  }
  return { rows, warnings, measured, info };
}
export function gapCensus(set) {
  const rows = [], files = [];
  for (const d of set) {
    const c = censusFile(d.master, d.file, d.src);
    rows.push(...c.rows);
    files.push({ ...c.info, warnings: c.warnings });
  }
  return { rows, files };
}
// the warnings §5, §5b, §5c and §5f write
const GAP_FAMILY = [/^paths \d+\/\d+ are /, /^path \d+ comes within /, /^the knockout leaves /, /^path \d+ faces itself across /,
  /^[-\d.]+ of air (across one cut-out|in a notch of the outer edge|between two filled edges|between a shape and a line) at /];
export const isGapFamily = (w) => GAP_FAMILY.some((re) => re.test(w));
export const kindOf = (r) => r.kind + (r.sub ? `:${r.sub}` : '');
export const isReading = (r) => r.kind !== 'pair-crossing' && r.kind !== 'pair-touching' && r.value !== null;
const v2 = (r) => r2(r.value);                     // the tools' own 2 dp
const dkey = (r) => `${r.master}/${r.file}`;
export const belowLint = (v, F) => v < F - 0.01 - 1e-9;

/** lint's own run over the pin, in process: lintSource per file, then the three directory checks. */
export function lintRun(set) {
  const results = new Map(set.map((d) => [`${d.master}/${d.file}`, lintSource(d.master, d.file, d.src)]));
  const gapOnly = new Map([...results].map(([k, r]) => [k, r.warnings.filter(isGapFamily)]));   // before the checks add theirs
  checkFamilies(results); checkPairs(results); checkAnchors(results);
  let failed = 0, warned = 0, lines = 0;
  for (const r of results.values()) { if (r.errors.length) failed++; else if (r.warnings.length) warned++; lines += r.warnings.length; }
  return { results, gapOnly, drawings: results.size, failed, warned, clean: results.size - failed - warned, lines };
}

/** tools/lint.mjs, modified only to also return its private `measured[]`, imported from memory. */
export async function lintWithMeasured() {
  let t = readFileSync(new URL('../lint.mjs', import.meta.url), 'utf8');
  const once = (from, to) => {
    const n = t.split(from).length - 1;
    if (n !== 1) throw new Error(`lint copy: expected one "${from}", found ${n}`);
    t = t.replace(from, () => to);
  };
  once("from './geometry.mjs'", `from '${new URL('../geometry.mjs', import.meta.url).href}'`);
  once("from './masters.mjs'", `from '${new URL('../masters.mjs', import.meta.url).href}'`);
  once('return { file, errors, warnings, notes, size, inner, isMark, ink, grows, gap, anchor, base, paths };',
    'return { file, errors, warnings, notes, size, inner, isMark, ink, grows, gap, anchor, base, paths, measured };');
  // lint runs its CLI when argv[1] is its own path; blank argv[1] while the copy loads
  const saved = process.argv[1];
  process.argv[1] = '';
  try { return await import(`data:text/javascript;base64,${Buffer.from(t).toString('base64')}`); }
  finally { process.argv[1] = saved; }
}
const arrEq = (a, b) => a.length === b.length && a.every((x, i) => Object.is(x, b[i]));
/** The proof that gapCensus() is lint: warnings, values and a negative control, per drawing. */
export async function gapProof(set, census, lint) {
  const clone = await lintWithMeasured();
  let warnEq = 0, measEq = 0, tried = 0, caught = 0, lineEq = 0, lineN = 0;
  const byFile = new Map(census.files.map((f) => [`${f.master}/${f.file}.svg`, f]));
  for (const d of set) {
    const key = `${d.master}/${d.file}`;
    const mine = censusFile(d.master, d.file, d.src);
    if (arrEq(mine.warnings, lint.gapOnly.get(key))) warnEq++;
    const cl = clone.lintSource(d.master, d.file, d.src);
    if (arrEq(mine.measured, cl.measured)) measEq++;
    if (mine.info.nAreas > 0 && mine.info.nPaths > 0) {
      const trap = censusFile(d.master, d.file, d.src, { trap: true });
      tried++;
      if (!arrEq(trap.measured, cl.measured) || !arrEq(trap.warnings, lint.gapOnly.get(key))) caught++;
    }
    const full = lint.results.get(key).warnings;
    if (full.length || byFile.get(key).warnings.length) { lineN++; if (arrEq(full, byFile.get(key).warnings)) lineEq++; }
  }
  return { warnEq, measEq, tried, caught, lineEq, lineN, files: set.length };
}

/** blindspots.mjs: what lint's §5 pair loop drops at :394 (crossing) and :401 (min <= 0.1). */
export function lintPairDrops(set) {
  const out = { pairs: 0, crossing: 0, touching: 0, measured: 0, files: new Set(), crossFiles: new Set(), touchFiles: new Set() };
  for (const d of set) {
    const { ds } = partsOf(d.file, d.src, d.master);
    const sampled = ds.map(samplePath);
    for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
      out.pairs++;
      if (crosses(sampled[i], sampled[j])) { out.crossing++; out.crossFiles.add(`${d.master}/${d.name}`); continue; }
      if (Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i])) <= 0.1) { out.touching++; out.touchFiles.add(`${d.master}/${d.name}`); continue; }
      out.measured++;
    }
  }
  return out;
}

// ════════════════════════════════════════════════════════════════════════════
// PART TWO — THE CONTACT CENSUS (contact-census.mjs)
// ════════════════════════════════════════════════════════════════════════════
// Tolerances, as the original card chose them (parameters, not figures):
const FLAT_TOL = 1e-4;   // max chordal deviation flattening an arc (raster.mjs default); one-sided, <= 2e-4 on a distance
const TOUCH = 1e-3;      // slack on "the painted regions touch", absorbing FLAT_TOL
export const ON_TOL = 0.01;   // |overshoot| <= this reads as "lands ON the centreline"
const END_TOL = 0.01;    // how close to a path's own end a point counts as "its end"
const COINC = 0.03;      // centrelines this close are coincident (an overlap run)
const COINC_TIGHT = 0.002;    // the second, 15x tighter reading that separates a shared run from a tangency
export const OVERLAP_L = 0.25; // a coincident run this long (one grid step at 24) is an `overlap`
export const GRAZE_D = 0.1;    // regions overlapping by less than this depth touch only at their edges
const SAMPLE_DX = 0.05;  // step when measuring a coincident run's length

function ptSegDist2(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy;
  let t = L2 ? ((px - ax) * vx + (py - ay) * vy) / L2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = px - (ax + t * vx), dy = py - (ay + t * vy);
  return { d2: dx * dx + dy * dy, t };
}
/** Proper intersection of two segments, with both parameters; null when parallel or disjoint. */
export function segInt(ax, ay, bx, by, cx, cy, dx, dy) {
  const r1 = bx - ax, r2v = by - ay, s1 = dx - cx, s2 = dy - cy;
  const den = r1 * s2 - r2v * s1;
  if (Math.abs(den) < 1e-12) return null;
  const t = ((cx - ax) * s2 - (cy - ay) * s1) / den;
  const u = ((cx - ax) * r2v - (cy - ay) * r1) / den;
  if (t < -1e-9 || t > 1 + 1e-9 || u < -1e-9 || u > 1 + 1e-9) return null;
  return { t, u, x: ax + t * r1, y: ay + t * r2v };
}
function segSegDist2(ax, ay, bx, by, cx, cy, dx, dy) {
  if (segInt(ax, ay, bx, by, cx, cy, dx, dy)) return 0;
  return Math.min(ptSegDist2(ax, ay, cx, cy, dx, dy).d2, ptSegDist2(bx, by, cx, cy, dx, dy).d2,
    ptSegDist2(cx, cy, ax, ay, bx, by).d2, ptSegDist2(dx, dy, ax, ay, bx, by).d2);
}
const acute = (ux, uy, vx, vy) => (Math.acos(Math.min(1, Math.max(-1, Math.abs(ux * vx + uy * vy)))) * 180) / Math.PI;

function gridIndex(segs, cell = 1) {
  const map = new Map();
  segs.forEach(([ax, ay, bx, by], k) => {
    for (let j = Math.floor(Math.min(ay, by) / cell); j <= Math.floor(Math.max(ay, by) / cell); j++)
      for (let i = Math.floor(Math.min(ax, bx) / cell); i <= Math.floor(Math.max(ax, bx) / cell); i++) {
        const key = `${i},${j}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(k);
      }
  });
  return { map, cell };
}
function near(el, x, y, R) {
  const { map, cell } = el.grid, out = new Set();
  for (let j = Math.floor((y - R) / cell); j <= Math.floor((y + R) / cell); j++)
    for (let i = Math.floor((x - R) / cell); i <= Math.floor((x + R) / cell); i++)
      for (const k of map.get(`${i},${j}`) ?? []) out.add(k);
  return out;
}
function nearestOn(el, x, y, R = Infinity) {
  let best = { d: Infinity, s: null, x: null, y: null };
  for (const k of Number.isFinite(R) ? near(el, x, y, R) : el.segs.keys()) {
    const [ax, ay, bx, by, s0] = el.segs[k];
    const { d2, t } = ptSegDist2(x, y, ax, ay, bx, by);
    const d = Math.sqrt(d2);
    if (d < best.d) best = { d, s: s0 + t * Math.hypot(bx - ax, by - ay), x: ax + t * (bx - ax), y: ay + t * (by - ay) };
  }
  return best;
}
const insideArea = (el, x, y) => {
  let odd = false;
  for (const k of el.ybuckets.get(Math.floor(y)) ?? []) {
    const [ax, ay, bx, by] = el.edges[k];
    if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) odd = !odd;
  }
  return odd;
};
function tangentAt(el, s) {
  for (const [ax, ay, bx, by, s0] of el.segs) {
    const L = Math.hypot(bx - ax, by - ay);
    if (s >= s0 - 1e-9 && s <= s0 + L + 1e-9) return [(bx - ax) / L, (by - ay) / L];
  }
  const [ax, ay, bx, by] = el.segs.at(-1), L = Math.hypot(bx - ax, by - ay);
  return [(bx - ax) / L, (by - ay) / L];
}
function pointAt(el, s) {
  for (const [ax, ay, bx, by, s0] of el.segs) {
    const L = Math.hypot(bx - ax, by - ay);
    if (s <= s0 + L + 1e-12) { const t = L ? Math.min(1, Math.max(0, (s - s0) / L)) : 0; return [ax + t * (bx - ax), ay + t * (by - ay)]; }
  }
  const [, , bx, by] = el.segs.at(-1);
  return [bx, by];
}

/** One drawing's ink elements: every SUBPATH of a stroked path, and every area path whole
 *  (an evenodd shape with its holes is one bit of ink). */
export function elementsOf(icon) {
  const els = [];
  for (const p of icon.paths) {
    const subs = flatten(p.d, { tol: FLAT_TOL, label: icon.file });
    if (p.style === 'area') {
      const rings = subs.map((s) => s.pts), segs = [], edges = [];
      for (const pts of rings) for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
        if (x1 === x2 && y1 === y2) continue;
        segs.push([x1, y1, x2, y2, 0]);
        if (y1 !== y2) edges.push([x1, y1, x2, y2]);
      }
      els.push({ id: `a${p.index}`, path: p.index, kind: 'area', h: 0, segs, edges, rings, closed: true, len: 0, ends: [] });
      continue;
    }
    const h = icon.stroke / 2;
    subs.forEach((s, si) => {
      const pts = s.pts.slice();
      if (s.closed && (pts[0][0] !== pts.at(-1)[0] || pts[0][1] !== pts.at(-1)[1])) pts.push(pts[0].slice());
      const segs = [], cum = [0];
      for (let i = 0; i + 1 < pts.length; i++) {
        segs.push([pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], cum[i]]);
        cum.push(cum[i] + Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]));
      }
      const len = cum.at(-1) ?? 0;
      // outward direction at an open end, baselined over >= 0.02 units of path
      const outward = (atStart) => {
        const n = pts.length;
        const i = atStart ? 0 : n - 1;
        let j = i, acc = 0;
        while (acc < 0.02) {
          const k = atStart ? j + 1 : j - 1;
          if (k < 0 || k > n - 1) break;
          acc += Math.hypot(pts[k][0] - pts[j][0], pts[k][1] - pts[j][1]); j = k;
        }
        const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], m = Math.hypot(dx, dy);
        return m < 1e-12 ? [0, 0] : [dx / m, dy / m];
      };
      const ends = s.closed ? [] : [{ p: pts[0], u: outward(true), s: 0 }, { p: pts.at(-1), u: outward(false), s: len }];
      els.push({ id: `p${p.index}s${si}`, path: p.index, kind: 'stroke', h, segs, edges: null, pts, closed: s.closed, len, ends });
    });
  }
  for (const e of els) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [ax, ay, bx, by] of e.segs) { x0 = Math.min(x0, ax, bx); x1 = Math.max(x1, ax, bx); y0 = Math.min(y0, ay, by); y1 = Math.max(y1, ay, by); }
    e.box = { x0, y0, x1, y1 };
    e.grid = gridIndex(e.segs);
    if (e.kind === 'area') {
      e.ybuckets = new Map();
      e.edges.forEach((ed, k) => {
        for (let j = Math.floor(Math.min(ed[1], ed[3])); j <= Math.floor(Math.max(ed[1], ed[3])); j++) {
          if (!e.ybuckets.has(j)) e.ybuckets.set(j, []);
          e.ybuckets.get(j).push(k);
        }
      });
    }
  }
  return els;
}

/** The raw measures for one pair of elements, or null when their inks do not touch. */
export function measurePair(A, B) {
  const reach = A.h + B.h, R = reach + 1;          // regions touch iff centreline dmin <= reach
  if (A.box.x1 + R < B.box.x0 || B.box.x1 + R < A.box.x0 || A.box.y1 + R < B.box.y0 || B.box.y1 + R < A.box.y0) return null;
  let dmin = Infinity, at = null;
  for (const sa of A.segs) {
    const [ax, ay, bx, by] = sa;
    for (const k of near(B, (ax + bx) / 2, (ay + by) / 2, R + Math.hypot(bx - ax, by - ay) / 2)) {
      const sb = B.segs[k], d2 = segSegDist2(ax, ay, bx, by, sb[0], sb[1], sb[2], sb[3]);
      if (d2 < dmin) { dmin = d2; at = [sa, sb]; }
      if (dmin === 0) break;
    }
  }
  dmin = Math.sqrt(dmin);
  if (!Number.isFinite(dmin)) return null;
  let insideCount = 0;
  if (B.kind === 'area') for (const p of (A.pts ?? A.rings.flat())) if (insideArea(B, p[0], p[1])) insideCount++;
  if (!insideCount && A.kind === 'area') for (const p of (B.pts ?? B.rings.flat())) if (insideArea(A, p[0], p[1])) insideCount++;
  if (!(dmin <= reach + TOUCH || insideCount > 0)) return null;
  const crossings = [];
  for (const sa of A.segs) {
    const [ax, ay, bx, by, s0a] = sa, La = Math.hypot(bx - ax, by - ay);
    for (const k of near(B, (ax + bx) / 2, (ay + by) / 2, La / 2 + 0.01)) {
      const sb = B.segs[k], hit = segInt(ax, ay, bx, by, sb[0], sb[1], sb[2], sb[3]);
      if (!hit) continue;
      const Lb = Math.hypot(sb[2] - sb[0], sb[3] - sb[1]);
      crossings.push({ x: hit.x, y: hit.y, sA: s0a + hit.t * La, sB: sb[4] + hit.u * Lb,
        angle: acute((bx - ax) / La, (by - ay) / La, (sb[2] - sb[0]) / Lb, (sb[3] - sb[1]) / Lb) });
    }
  }
  const merged = [];
  for (const c of crossings) if (!merged.some((m) => Math.hypot(m.x - c.x, m.y - c.y) < 0.02)) merged.push(c);
  const runOf = (X, Y, tol) => {
    if (X.kind === 'area' || Y.kind === 'area') return 0;
    let run = 0;
    for (let s = 0; s <= X.len; s += SAMPLE_DX) {
      const p = pointAt(X, s);
      if (nearestOn(Y, p[0], p[1], tol + SAMPLE_DX).d <= tol) run += SAMPLE_DX;
    }
    return run;
  };
  return { reach, dmin, at, crossings: merged, insideCount,
    coincident: Math.max(runOf(A, B, COINC), runOf(B, A, COINC)),
    coincTight: Math.max(runOf(A, B, COINC_TIGHT), runOf(B, A, COINC_TIGHT)) };
}

export const subOf = (over) => (Math.abs(over) <= ON_TOL ? 'on' : over > 0 ? 'through' : 'short');
/** Every junction between two touching elements, one record per junction.
 *  A crossing is a T when one path's round cap is BURIED in it: its nearer endpoint sits
 *  strictly inside `reach` of the crossing (no free parameter). Two metrics, never mixed:
 *  'centreline' (stroke vs stroke) and 'area-depth' (stroke end vs a filled area). */
export function junctionsOf(A, B, m, canvas) {
  const STUB_MAX = canvas / 8;
  const out = [];
  const push = (j) => { if (!out.some((k) => Math.hypot(k.x - j.x, k.y - j.y) < 0.05 && k.cls === j.cls)) out.push(j); };
  const base = { dmin: r3(m.dmin), reach: m.reach, inside: m.insideCount };
  const areaPair = A.kind === 'area' && B.kind === 'area';
  const mixed = !areaPair && (A.kind === 'area' || B.kind === 'area');
  if (A.kind === 'stroke' && B.kind === 'stroke') {
    if (m.coincident >= OVERLAP_L)
      push({ cls: 'overlap', metric: 'centreline', ...base, overshoot: null, angle: null, x: r3(m.at[0][0]), y: r3(m.at[0][1]), run: r2(m.coincident), runTight: r2(m.coincTight) });
    for (const c of m.crossings) {
      const fin = (v) => (Number.isFinite(v) ? r2(v) : null);
      const sides = (el, s0) => (el.closed ? { near: Infinity, far: Infinity, ends: false } : {
        near: Math.min(s0, el.len - s0), far: Math.max(s0, el.len - s0),
        // terminates here when its nearer end is strictly inside reach — unless BOTH ends are
        // (a short bar lying across), except that an end within ON_TOL of the junction always ends there
        ends: Math.min(s0, el.len - s0) < m.reach - 1e-6
          && (Math.max(s0, el.len - s0) >= m.reach - 1e-6 || Math.min(s0, el.len - s0) <= ON_TOL) });
      const sa = sides(A, c.sA), sb = sides(B, c.sB);
      const geom = { angle: r2(c.angle), x: r3(c.x), y: r3(c.y), nearA: fin(sa.near), farA: fin(sa.far), nearB: fin(sb.near), farB: fin(sb.far) };
      if (!sa.ends && !sb.ends) {
        const minSide = Math.min(sa.near, sb.near);
        push({ cls: 'cross', metric: 'centreline', ...base, overshoot: null, ...geom, minSide: fin(minSide),
          ambiguous: Number.isFinite(minSide) && minSide < STUB_MAX });
      } else if (sa.ends && sb.ends && sa.near <= ON_TOL && sb.near <= ON_TOL) {
        push({ cls: 'corner', metric: 'centreline', ...base, overshoot: r3(Math.max(sa.near, sb.near)), ...geom, via: 'crossing' });
      } else {
        const who = sa.ends && sb.ends ? (sa.near <= sb.near ? 'A' : 'B') : sa.ends ? 'A' : 'B';
        const over = who === 'A' ? sa.near : sb.near;
        push({ cls: `T-${subOf(over)}`, metric: 'centreline', ...base, overshoot: r3(over), overPerp: r3(over * Math.sin((c.angle * Math.PI) / 180)),
          tangential: c.angle < 15, ...geom, who, via: 'crossing' });
      }
    }
    for (const [X, Y, who] of [[A, B, 'A'], [B, A, 'B']]) for (const e of X.ends) {
      const n = nearestOn(Y, e.p[0], e.p[1], m.reach + 1);
      if (n.d > m.reach + TOUCH) continue;
      if (out.some((k) => Math.hypot(k.x - e.p[0], k.y - e.p[1]) < 0.05)) continue;
      if (!Y.closed && (n.s <= END_TOL || n.s >= Y.len - END_TOL)) {
        const depth = m.reach - n.d;                  // two ENDS: a corner if the caps substantially overlap
        push({ cls: depth <= GRAZE_D ? 'graze' : 'corner', metric: 'centreline', ...base, overshoot: r3(-n.d), angle: null, depth: r3(depth),
          secondary: m.crossings.length > 0, x: r3((e.p[0] + n.x) / 2), y: r3((e.p[1] + n.y) / 2), via: 'end-to-end' });
        continue;
      }
      let t = null;                                   // along this end's own outward ray to the other centreline
      for (const k of near(Y, e.p[0] + (e.u[0] * STUB_MAX) / 2, e.p[1] + (e.u[1] * STUB_MAX) / 2, STUB_MAX)) {
        const sb = Y.segs[k];
        const hit = segInt(e.p[0], e.p[1], e.p[0] + e.u[0] * STUB_MAX, e.p[1] + e.u[1] * STUB_MAX, sb[0], sb[1], sb[2], sb[3]);
        if (hit && (t === null || hit.t * STUB_MAX < t)) t = hit.t * STUB_MAX;
      }
      const tang = tangentAt(Y, n.s), ang = r2(acute(e.u[0], e.u[1], tang[0], tang[1]));
      if (t === null) {
        push({ cls: 'graze', metric: 'centreline', ...base, overshoot: r3(-n.d), angle: ang, x: r3(e.p[0]), y: r3(e.p[1]), who, via: 'end-beside', depth: r3(m.reach - n.d) });
        continue;
      }
      push({ cls: `T-${subOf(-t)}`, metric: 'centreline', ...base, overshoot: r3(-t), overPerp: r3(-t * Math.sin((ang * Math.PI) / 180)),
        tangential: ang < 15, angle: ang, x: r3(e.p[0]), y: r3(e.p[1]), who, via: 'ray' });
    }
  }
  if (mixed) {
    const S = A.kind === 'stroke' ? A : B, F = A.kind === 'stroke' ? B : A, who = A.kind === 'stroke' ? 'A' : 'B';
    for (const e of S.ends) {
      const n = nearestOn(F, e.p[0], e.p[1], 3), ins = insideArea(F, e.p[0], e.p[1]);
      if (!ins && n.d > S.h + TOUCH) continue;
      const depth = ins ? n.d : -n.d;
      push({ cls: `T-${subOf(depth)}`, metric: 'area-depth', ...base, overshoot: r3(depth), angle: null, x: r3(e.p[0]), y: r3(e.p[1]), who, via: 'area-depth' });
    }
    let insideRun = 0;
    for (let s = 0; s <= S.len; s += SAMPLE_DX) { const p = pointAt(S, s); if (insideArea(F, p[0], p[1])) insideRun += SAMPLE_DX; }
    if (m.crossings.length >= 2 && insideRun >= OVERLAP_L && !out.length)
      push({ cls: 'cross', metric: 'area-depth', ...base, overshoot: null, angle: null, x: r3(m.at[0][0]), y: r3(m.at[0][1]), run: r2(insideRun) });
    else if (insideRun >= OVERLAP_L && !out.length)
      push({ cls: 'overlap', metric: 'area-depth', ...base, overshoot: null, angle: null, x: r3(m.at[0][0]), y: r3(m.at[0][1]), run: r2(insideRun) });
    if (!out.length)
      push({ cls: 'graze', metric: 'area-depth', ...base, overshoot: null, angle: null, x: r3(m.at[0][0]), y: r3(m.at[0][1]), depth: r3(S.h - m.dmin), run: r2(insideRun) });
  }
  if (areaPair) push({ cls: m.insideCount > 0 ? 'overlap' : 'graze', metric: 'area-depth', ...base, overshoot: null, angle: null, x: r3(m.at[0][0]), y: r3(m.at[0][1]) });
  if (!out.length) {
    const depth = m.reach - m.dmin;
    push({ cls: depth <= GRAZE_D ? 'graze' : 'other', metric: 'centreline', ...base, overshoot: null, angle: null, x: r3(m.at[0][0]), y: r3(m.at[0][1]), depth: r3(depth) });
  }
  return out;
}

/** The census over a set: every junction in every drawing, plus a per-drawing summary. */
export function contactCensus(set) {
  const rows = [], perFile = [], failures = [];
  for (const d of set) {
    let icon, els;
    try { icon = iconFromSource(d.src, { file: d.file, master: d.master }); els = elementsOf(icon); }
    catch (e) { failures.push({ file: `${d.master}/${d.file}`, error: String(e.message) }); continue; }
    const concept = conceptOf(icon.name), style = icon.filled ? 'filled' : 'outline';
    const found = [];
    for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
      const m = measurePair(els[i], els[j]);
      if (!m) continue;
      for (const jn of junctionsOf(els[i], els[j], m, icon.master))
        found.push({ name: icon.name, concept, master: icon.master, style, weight: icon.stroke, a: els[i].id, b: els[j].id, kinds: `${els[i].kind}/${els[j].kind}`, ...jn });
    }
    rows.push(...found);
    const prim = found.filter((c) => !c.secondary);
    perFile.push({ name: icon.name, concept, master: icon.master, style, elements: els.length, areas: els.filter((e) => e.kind === 'area').length,
      weight: icon.stroke, contacts: prim.length, grammar: prim.map((c) => c.cls).sort().join('+') || '-' });
  }
  return { rows, perFile, failures, primary: rows.filter((c) => !c.secondary), secondary: rows.filter((c) => c.secondary) };
}

// ── §9: does a junction RENDER differently from one that lands exactly on the line? ──
function polyD(el, move = null) {
  const out = [];
  for (const ring of el.kind === 'area' ? el.rings : [el.pts]) {
    const pts = ring.map((q) => q.slice());
    if (move && el.kind === 'stroke') pts[move.i] = [pts[move.i][0] + move.dx, pts[move.i][1] + move.dy];
    out.push(`M${pts.map((q) => `${q[0]} ${q[1]}`).join('L')}${el.kind === 'area' || el.closed ? 'Z' : ''}`);
  }
  return out.join('');
}
/** The drawing as shipped against a twin whose terminating endpoint moves by -overshoot along its
 *  own outward direction, both from the same flattened polylines, rendered by raster.mjs's
 *  `rasterise` at px = master (as the original census did). maxD = the largest change in any
 *  one pixel's coverage, 1 = a whole pixel of ink. */
export function junctionProbe(rec, src, rate = 32) {
  const icon = iconFromSource(src, { file: `${rec.name}.svg`, master: rec.master });
  const els = elementsOf(icon);
  const X = els.find((e) => e.id === (rec.who === 'A' ? rec.a : rec.b));
  if (!X || X.kind !== 'stroke' || !X.ends.length) return { skip: 'terminating element has no open end' };
  const nearest = X.ends.map((e, k) => ({ e, k, d: Math.hypot(e.p[0] - rec.x, e.p[1] - rec.y) })).sort((a, b) => a.d - b.d)[0];
  const move = { i: nearest.k === 0 ? 0 : X.pts.length - 1, dx: -rec.overshoot * nearest.e.u[0], dy: -rec.overshoot * nearest.e.u[1] };
  const build = (mv) => ({ ...region(els.map((e) => ({ d: polyD(e, e === X ? mv : null), kind: e.kind, weight: e.kind === 'stroke' ? icon.stroke : undefined })), { label: rec.name }), canvas: icon.master });
  const A = rasterise(build(null), { px: rec.master, rate }), B = rasterise(build(move), { px: rec.master, rate });
  let maxD = 0, sumD = 0;
  for (let k = 0; k < A.cov.length; k++) { const d = Math.abs(A.cov[k] - B.cov[k]); sumD += d; if (d > maxD) maxD = d; }
  return { maxD, sumD, moved: Math.hypot(move.dx, move.dy), areas: els.filter((e) => e.kind === 'area').length };
}
/** The 138 probes: every T with |overshoot| > 0.01, plus about 40 exact-zero T-on controls
 *  spread evenly through the census (contact-census.mjs RASTER=all), in census order. */
export function probeSet(primary) {
  const Ts = primary.filter((c) => c.metric === 'centreline');
  const pick = Ts.filter((x) => x.cls.startsWith('T-') && Math.abs(x.overshoot) > ON_TOL && x.who).map((c) => ({ ...c, tag: c.cls }));
  const ctl = Ts.filter((x) => x.cls === 'T-on' && x.overshoot === 0 && x.who);
  for (let i = 0; i < ctl.length; i += Math.max(1, Math.floor(ctl.length / 40))) pick.push({ ...ctl[i], tag: 'control' });
  return pick;
}

// ════════════════════════════════════════════════════════════════════════════
// THE SECTIONS
// ════════════════════════════════════════════════════════════════════════════
export function makeSections(pin) {
  const set = memo(() => loadPin(pin));
  const byName = memo(() => new Map(set().map((d) => [`${d.master}/${d.name}`, d])));
  const drawing = (m, n) => {
    const d = byName().get(`${m}/${n}`);
    if (!d) throw new Error(`${m}/${n}.svg is not in this pin — the section reprints a figure about that drawing`);
    return d;
  };
  const SW = memo(() => sweep());
  const DIAG = memo(() => diagSweep());
  const SPANS = memo(() => airSpans(set()));
  const READ = memo(() => airRead(SPANS(), set()));
  const CENSUS = memo(() => gapCensus(set()));
  const LINT = memo(() => lintRun(set()));
  const CONTACT = memo(() => contactCensus(set()));
  const at15 = (r) => Math.abs(r.width - 1.5) < 0.02;          // "at the floor", realphase.mjs / airread.mjs
  const reads = memo(() => CENSUS().rows.filter(isReading));
  const T_CL = memo(() => CONTACT().primary.filter((c) => c.cls.startsWith('T-') && c.metric === 'centreline'));
  const PROBES = memo(() => probeSet(CONTACT().primary).map((rec) => ({ rec, r: junctionProbe(rec, drawing(rec.master, rec.name).src) })));

  const S = {};

  S.head = () => {
    head('head  Pinned tree — the drawings and the lint baseline (lines 3-4)');
    const s = set(), concepts = uniq(s, (d) => conceptOf(d.name));
    say(`- ${int(concepts)} concepts x 3 masters x 2 styles = ${int(s.length)} drawings`);
    const L = LINT();
    say(`- lint baseline at the pin: ${int(L.drawings)} · ${int(L.clean)} clean · ${L.warned} warned · ${L.failed} failed`);
  };

  S.scope = () => {
    head('scope  Scope stated plainly — 2x and 3x renders (lines 18-21; retina.mjs)');
    say('A parallel run at the 16 master (stroke 1.25), air g, shown at px device pixels; phases of 8 that leave a fully clear pixel row:');
    const G = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    table(['px', 'scale', ...G.map((g) => `g ${g}`)], [16, 24, 32, 48].map((px) => [px, `${px / 16}x`, ...G.map((g) => `${phasesClearAt(g, px)}/8`)]));
    say(`- at 2x a 1.0 gap is clear at ${phasesClearAt(1, 32)}/8 phases; at 3x a 0.75 gap is clear at ${phasesClearAt(0.75, 48)}/8`);
  };

  S.s0 = () => {
    head('§0 One instrument is wrong — Finding A1, raster.mjs `classify` on a filled shape (classify-bug.mjs)');
    const d = 'M2 2.5H14V7.5H2Z', b = bbox([d]);
    const reg = { ...region([{ d, kind: 'area' }], { label: 'A1' }), canvas: 16 };
    const truth = (x0, y0, x1, y1) => (Math.max(0, Math.min(x1, b.x1) - Math.max(x0, b.x0)) * Math.max(0, Math.min(y1, b.y1) - Math.max(y0, b.y0))) / ((x1 - x0) * (y1 - y0));
    say(`filled rectangle \`${d}\``);
    table(['probe', 'true', '`classify`', '`boxCoverage`', '`reg.covered` sampled'], [[3, 4, 7.2, 8], [3, 4, 7, 8]].map(([x0, x1, y0, y1]) => [
      `box [${x0},${x1}]x[${y0},${y1}]`, r3(truth(x0, y0, x1, y1)), `\`${reg.classify(x0, y0, x1, y1)}\``, boxCoverage(reg, x0, y0, x1, y1, 32), (() => { const v = sampleBox(reg, x0, y0, x1, y1, 64); return (v * 2) % 1 === 0 ? String(v) : v.toFixed(4); })()]));
    const { cov } = rasterise(reg, { px: 16, rate: 32 });
    const row7 = [...cov.slice(7 * 16 + 3, 7 * 16 + 14)].map((c) => c.toFixed(2));
    say(`- \`rasterise\` row 7, cols 3-13 (true ${r3(truth(3, 7, 4, 8)).toFixed(2)} each): ${row7.join(' ')}`);
    say(`- \`inkArea\` at rates 8 · 16 · 32 · 64 · 128 (true ${(b.x1 - b.x0) * (b.y1 - b.y0)} = ${b.x1 - b.x0} x ${b.y1 - b.y0}): ${[8, 16, 32, 64, 128].map((rate) => inkArea(reg, { rate }).area).join(' · ')}`);
    say(`- by cancellation: the unit cell straddling the top edge [3,4]x[2,3] (true ${truth(3, 2, 4, 3)}) is called \`${reg.classify(3, 2, 4, 3)}\`; the one straddling the bottom edge [3,4]x[7,8] (true ${truth(3, 7, 4, 8)}) is called \`${reg.classify(3, 7, 4, 8)}\``);
  };

  S.s1 = () => {
    head('§1 The unit is one device pixel, and the master is irrelevant (airprobe.mjs)');
    const rows = SW();
    let n = 0, same = 0;
    for (const sit of Object.keys(SITUATIONS)) {
      const f = MASTER_LIST.map((m) => floorsOf(rows, sit, m));
      for (const x of f) { n++; if (x.every === f[2].every && x.best === f[2].best) same++; }
    }
    say(`- floors (best phase, every phase) per situation x master: ${n} rows; identical to the 16 master's: ${same} of ${n}`);
    say(`- ${MIN_GAP} on the 24 master shown at 16px: ${MIN_GAP} / 24 x 16 = ${r3((MIN_GAP / 24) * 16)} device pixel`);
    say(`- MIN_GAP ${MIN_GAP} at a 16px render, masters 24 · 20 · 16: ${MASTER_LIST.map((m) => r3((MIN_GAP / m) * 16)).join(' · ')} device pixels; at each master's own size: ${MASTER_LIST.map((m) => r3((MIN_GAP / m) * m)).join(' · ')}`);
  };

  S.s2 = () => {
    head('§2 The mechanisms, separated and measured (airprobe.mjs)');
    const rows = SW();
    const f16 = floorsOf(rows, 'parallel-run', 16);
    const ladderSame = MASTER_LIST.every((m) => SWEEP_GAPS.every((g) => floorsOf(rows, 'parallel-run', m).worst(g) === f16.worst(g)));
    say(`- rendered rows: ${int(rows.length)}; rows where the air welds (every row's lightest pixel >= 0.995): ${rows.filter((r) => r.weld).length}`);
    say(`- M1, worst-phase lightest pixel in the air (parallel run): ${[0.125, 0.375, 0.875].map((g) => `${f16.worst(g)} at a ${g} gap`).join(', ')}; the same at 24, 20 and 16: ${ladderSame ? 'yes' : 'no'}`);
    // the ladder, grouped where the value repeats
    const groups = [];
    for (const g of SWEEP_GAPS) { const v = f16.worst(g); if (groups.length && groups.at(-1).v === v) groups.at(-1).to = g; else groups.push({ v, from: g, to: g }); }
    say(`- M2 ladder, worst-phase lightest by gap: ${groups.map((x) => `${x.v} at g = ${x.from === x.to ? x.from : `${x.from}-${x.to}`}`).join(' · ')}`);
    const law = (off) => SWEEP_GAPS.filter((g) => g >= 1 && g <= 1.875).every((g) => f16.clear(g) === Math.round((g - off) * 8));
    say(`- M2, phases of 8 that give a fully clear row: ${[1, 1.25, 1.5, 1.75, 1.875].map((g) => `${f16.clear(g)}/8 at ${g}`).join(', ')}; the share equals g - 1 for every eighth from 1.0 to 1.875: ${law(1) ? 'yes' : 'no'}; equals g - 0.875: ${law(0.875) ? 'yes' : 'no'}`);
    const sig = (sit) => rows.filter((r) => r.situation === sit && r.master === 16).map((r) => `${r.gap}|${r.phase}|${r.lightest}|${r.clearRow}`).join(';');
    const same = ['knockout', 'solid-band', 'shape-to-line'].every((s) => sig(s) === sig('parallel-run'));
    say(`- M3: knockout (flank 5), band between two solids, shape-to-line and two 1.25 strokes side by side give the identical table row for row at 16: ${same ? 'yes' : 'no'}`);
    const W = READ().filter((r) => r.airMin >= 0.995);
    say(`- M4: air spans with no pixel lighter than solid ink: ${W.length}; of them at or above 1.5: ${W.filter((r) => r.width >= 1.49).length} (§4c)`);
  };

  S.s3a = () => {
    head('§3a The seven situations — measured at the 16 master (airprobe.mjs, rate 32)');
    const rows = SW(), axialEvery = DIAG().find((x) => x.deg === 0).every;
    const LABEL = {
      'parallel-run': 'parallel run, two outline strokes', 'facing-short': 'two facing edges, 2-unit overlap', 'facing-caps': 'two round caps tip to tip',
      knockout: 'knockout from a filled shape', 'closed-counter': 'counter inside a closed stroked path', 'glyph-mouth': 'counter inside a glyph (a hook\'s mouth)',
      'solid-band': 'band between two filled parts', 'shape-to-line': 'shape-to-line air', 'parallel-run-filled': 'parallel run, filled line weight 2',
    };
    table(['Situation · flank', 'Worst-phase lightest at g = 1.5', 'Phases clear at 1.5', 'at 1.0', 'Floor, best phase', 'Floor, every phase'],
      Object.keys(SITUATIONS).map((sit, k) => {
        const f = floorsOf(rows, sit, 16);
        return [`${LABEL[sit]} · flank ${f.flank.join(' / ')}`, f.worst(1.5), `${f.clear(1.5)}/8`, `${f.clear(1)}/8`, d1(f.best), k === 0 ? `${f.every} (eighth grid) / ${d1(axialEvery)}` : f.every];
      }));
    const differ = (m, ref) => Object.keys(SITUATIONS).filter((sit) => { const a = floorsOf(rows, sit, m), b = floorsOf(rows, sit, ref); return !([1, 1.5].every((g) => a.worst(g) === b.worst(g) && a.clear(g) === b.clear(g)) && a.best === b.best && a.every === b.every); });
    const NS = Object.keys(SITUATIONS).length;
    say(`- the table at 24 against the table at 20: ${NS - differ(24, 20).length} of ${NS} rows identical`);
    for (const m of [24, 20]) {
      const diff = differ(m, 16);
      say(`- the table at ${m} against the 16 table above: ${NS - diff.length} of ${NS} rows identical${diff.length ? `; differing: ${diff.map((sit) => { const a = floorsOf(rows, sit, m); return `${sit} (worst at 1.5 ${a.worst(1.5)}, at 1.0 ${a.worst(1)}, floors ${a.best} / ${a.every})`; }).join('; ')}` : ''}`);
    }
    const fr = floorsOf(rows, 'parallel-run', 16), fc = floorsOf(rows, 'facing-caps', 16), fg = floorsOf(rows, 'glyph-mouth', 16);
    say(`- curvature: the darkest pixel at g = 1.5 is ${fc.worst(1.5)}-${fg.worst(1.5)} (caps, mouth) against a straight run's ${fr.worst(1.5)}; at g = 1.0, ${fc.worst(1)}-${fg.worst(1)} against ${fr.worst(1)}`);
    say(`- cap-to-cap darkness as a share of a parallel run of the same width: ${r2(fc.worst(1) / fr.worst(1))} at g = 1.0, ${r2(fc.worst(1.5) / fr.worst(1.5))} at g = 1.5`);
  };

  S.s3b = () => {
    head('§3b The channel\'s angle (diagprobe.mjs, the 16 master, gap in sixteenths, phase in eighths)');
    const D = DIAG(), byDeg = (d) => D.find((x) => x.deg === d);
    const rows = [[0, 90], [15, 75], [22.5, 67.5], [30, 60], [45]].map((pair) => {
      const a = byDeg(pair[0]), b = pair[1] != null ? byDeg(pair[1]) : null;
      const agree = !b || (a.best === b.best && a.every === b.every);
      return [`${pair.join(' / ')}${agree ? '' : ' (the two angles differ)'}`, d1(a.best), d1(a.every), a.theory.toFixed(3)];
    });
    table(['Channel angle off the axis', 'First clear pixel, best phase', 'First clear pixel, every phase', 'Theory |cos t| + |sin t|'], rows);
    const step = Math.max(...D.map((x) => Math.abs(x.best - x.theory)));
    say(`- largest gap between the best-phase measurement and theory: ${r3(step)} (sweep step 0.0625)`);
    const firstOn = (grid) => Math.ceil(Math.SQRT2 / grid - 1e-9) * grid;
    say(`- sqrt(2) = ${Math.SQRT2.toFixed(4)}; the smallest value on the quarter grid that clears it: ${firstOn(0.25)}; on the eighth grid: ${firstOn(0.125)}; 1.375 clears it: ${1.375 >= Math.SQRT2 ? 'yes' : 'no'}`);
  };

  S.s3c = () => {
    head('§3c Alignment is free at every master (arithmetic, then aligncheck.mjs)');
    table(['Master', 'Stroke', 'Half', 'Centreline fractions that put an edge on a whole pixel', 'On the mandated grid?'], MASTER_LIST.map((m) => {
      const h = STROKES[m] / 2, fr = [...new Set([r3(h - Math.floor(h)), r3(Math.ceil(h) - h)])].sort((a, b) => a - b);
      const on = fr.every((f) => Number.isInteger(r3(f / gridOf(m))));
      return [m, STROKES[m], h, fr.map((f) => String(f).replace(/^0/, '')).join(' · '), `${on ? 'yes' : 'no'} — ${gridName(m)} grid`];
    }));
    say('Two 1.25 strokes at 16, air exactly 1.0 (rows sampled through reg.covered, rate 32, columns 4-11):');
    table(['Construction', 'Air band', 'Pixel rows 6 / 7 / 8'], [[6.375, 8.625], [6.625, 8.875], [6.5, 8.75]].map(([a, b]) => {
      const reg = region([{ d: `M3 ${a}h10`, kind: 'stroke', weight: 1.25 }, { d: `M3 ${b}h10`, kind: 'stroke', weight: 1.25 }], { label: 'align' });
      const row = (j) => r3(Math.max(...[4, 5, 6, 7, 8, 9, 10, 11].map((i) => sampleBox(reg, i, j, i + 1, j + 1, SWEEP_RATE))));
      return [`centrelines ${a} / ${b}`, `${d1(r3(a + 0.625))} .. ${d1(r3(b - 0.625))}`, [6, 7, 8].map((j) => d1(row(j))).join(' / ')];
    }));
  };

  S.s3d = () => {
    head('§3d Where C7 and section 6 pull against each other — phase of every axial air span (realphase.mjs)');
    const COLS = [0, 0.125, 0.25, 0.5, 0.625, 0.75];
    const rows = MASTER_LIST.map((m) => {
      const rs = SPANS().filter((r) => r.master === m && isAxial(r));
      const cells = COLS.map((p) => { const n = rs.filter((r) => r.phase === p).length; return n ? `${n} (${pct(n, rs.length)})` : '—'; });
      return [m, ...cells, rs.filter((r) => !COLS.includes(r.phase)).length];
    });
    table(['Master', ...COLS.map(String), 'other'], rows);
    for (const m of MASTER_LIST) {
      const rs = SPANS().filter((r) => r.master === m && isAxial(r)), h = {};
      for (const r of rs) h[r.phase] = (h[r.phase] ?? 0) + 1;
      const top = Object.entries(h).sort((a, b) => b[1] - a[1]);
      say(`- ${m}: largest bucket phase ${top[0][0]} (${top[0][1]}); every phase with 8 or more spans: ${top.filter(([, v]) => v >= 8).map(([k, v]) => `${k}:${v}`).join(' ')}`);
    }
    say(`- a 1.5 band holds a whole pixel at phase ${PHASES.filter((p) => holdsWholePixel(p, 1.5)).join(', ')} and not at ${PHASES.filter((p) => !holdsWholePixel(p, 1.5)).join(', ')}`);
  };

  S.s4a = () => {
    head('§4a Census — every air span in 2,910 drawings (realphase.mjs)');
    const sp = SPANS(), by = (m) => sp.filter((r) => r.master === m);
    const row = (label, f) => [label, ...MASTER_LIST.map((m) => f(by(m))), f(sp)];
    const ax = (rs) => rs.filter(isAxial).length, dg = (rs) => rs.filter((r) => r.axis === 'diagonal').length;
    const fl = (rs) => rs.filter((r) => r.width >= 1.5 - 1e-9 && r.width < 1.51).length;
    table(['', '24', '20', '16', 'total'], [
      row('air spans measured', (rs) => int(rs.length)),
      [...row('axial (a pixel row can cross)', (rs) => int(ax(rs))).slice(0, 4), `${int(ax(sp))} (${pct(ax(sp), sp.length)})`],
      [...row('diagonal (no pixel row crosses)', (rs) => int(dg(rs))).slice(0, 4), `${int(dg(sp))} (${pct(dg(sp), sp.length)})`],
      [...row('spans drawn exactly at the floor, [1.5, 1.51)', (rs) => int(fl(rs))).slice(0, 4), `${int(fl(sp))} (${pct(fl(sp), sp.length)})`],
      ['spans already >= 1.875 (the all-phase axial floor; axial spans)', ...MASTER_LIST.map((m) => { const a = by(m).filter(isAxial); return pct(a.filter((r) => r.width >= 1.875 - 0.001).length, a.length); }), '—'],
    ]);
    say(`- span kinds (all masters): ${[...new Set(sp.map((r) => r.kind))].sort().map((k) => `${k} ${sp.filter((r) => r.kind === k).length}`).join(' · ')}; unresolved self spans: ${sp.filter((r) => r.axis === 'unresolved').length}`);
    const B = [[0, 0.5, '<0.5'], [0.5, 0.75, '0.5-0.75'], [0.75, 1, '0.75-1'], [1, 1.25, '1-1.25'], [1.25, 1.5, '1.25-1.5'], [1.5, 1.51, '[1.5,1.51)'], [1.51, 1.75, '1.51-1.75'], [1.75, 2, '1.75-2'], [2, 3, '2-3'], [3, Infinity, '>=3']];
    say('Width distribution, all spans:');
    table(['master', ...B.map((b) => b[2])], MASTER_LIST.map((m) => [m, ...B.map(([a, b]) => int(by(m).filter((r) => r.width >= a - 1e-9 && r.width < b - 1e-9).length))]));
    say('Narrowest twelve spans in the whole set (stable sort by width):');
    const twelve = [...sp].filter((r) => r.width != null).sort((a, b) => a.width - b.width).slice(0, 12);
    const warnsOn = (r) => lintSource(r.master, `${r.file}.svg`, drawing(r.master, r.file).src).warnings.some(isGapFamily);
    const grp = [];
    for (const r of twelve) {
      const g = grp.at(-1);
      if (g && g.width === r.width && g.master === r.master && g.kind === r.kind && g.axis === r.axis) g.files.push(r.file); else grp.push({ ...r, files: [r.file] });
    }
    table(['width', 'master', 'kind', 'axis', 'file', 'note'], grp.map((g) => [`${g.width}${g.files.length > 1 ? ` x${g.files.length}` : ''}`, g.master, DOC_KIND[g.kind] ?? g.kind, g.axis,
      g.files.map((f) => `\`${f}\``).join(', '), g.gapNote != null ? `\`gap: ${g.gapNote}\`` : `none — lint ${g.files.every((f) => warnsOn({ ...g, file: f })) ? 'warns' : 'does not warn'}`]));
  };

  S.s4b = () => {
    head('§4b What the floor actually delivers — airMin, every span under 2.0 units (airread.mjs, rate 16, px = master)');
    const R = READ();
    say(`- spans under 2.0 units: ${int(R.length)}`);
    say(`- agreement with the arithmetic verdict, axial spans: ${MASTER_LIST.map((m) => { const rs = R.filter((r) => r.master === m && isAxial(r)); return pct(rs.filter((r) => (r.airMin === 0) === !!r.wholePixel).length, rs.length); }).join(' / ')} at 24 / 20 / 16`);
    const dis = R.filter((r) => isAxial(r) && (r.airMin === 0) !== !!r.wholePixel);
    say(`- the ${dis.length} disagreements: arithmetic says a whole pixel fits but the render finds none clear ${dis.filter((r) => r.wholePixel).length}; the other way round ${dis.filter((r) => !r.wholePixel).length} (${dis.filter((r) => !r.wholePixel).map((r) => `${r.file} ${r.master} ${r.kind} w ${r.width} phase ${r.phase} airMin ${r.airMin}`).join('; ')})`);
    table(['master', 'spans at 1.5 (+/-0.02)', 'produce a clear pixel', 'paid 0.5 units for a grey seam'], MASTER_LIST.map((m) => {
      const rs = R.filter((r) => r.master === m && at15(r)), c = rs.filter((r) => r.airMin === 0).length;
      return [m, rs.length, `${c} (${pct(c, rs.length)})`, rs.length - c];
    }));
    say(`- axial only, by the arithmetic verdict: ${MASTER_LIST.map((m) => { const rs = SPANS().filter((r) => r.master === m && at15(r) && isAxial(r)); return pct(rs.filter((r) => r.wholePixel).length, rs.length); }).join(' / ')}`);
    const KIND = { 'facing-separation': 'band between two filled parts (`facing-separation`)', pair: 'two separate stroked paths (`pair`)', 'facing-line': 'shape-to-line (`facing-line`)',
      'facing-notch': 'notch in the outer edge (`facing-notch`)', 'facing-cut': 'knockout / cut (`facing-cut`)', 'facing-self': 'counter inside a closed path (`facing-self`)', self: 'an open path\'s own counter (`self`)' };
    const kinds = Object.keys(KIND).map((k) => {
      const rs = R.filter((r) => r.master === 16 && r.kind === k && at15(r));
      return { k, n: rs.length, rate: rs.filter((r) => r.airMin === 0).length / rs.length, med: median(rs.map((r) => r.airMin)) };
    }).sort((a, b) => b.rate - a.rate);
    say('By kind, at 16, at the floor:');
    table(['kind', 'n', 'airMin = 0', 'median airMin'], kinds.map((x) => [KIND[x.k], x.n, `${(100 * x.rate).toFixed(1)}%`, x.med]));
    const lo = kinds.at(-1), hi = kinds[0];
    say(`- spread ${Math.round(100 * lo.rate)}% to ${Math.round(100 * hi.rate)}%; the best kind delivers ${r2(hi.rate / lo.rate)} times the worst`);
    // channel angle off the nearest axis (the span is perpendicular to its channel)
    const chan = (r) => { const a = (Math.atan2(Math.abs(r.q[1] - r.p[1]), Math.abs(r.q[0] - r.p[0])) * 180) / Math.PI; return Math.round((a > 45 ? 90 - a : a) * 10) / 10; };
    const need = (deg) => { const t = (deg * Math.PI) / 180; return Math.abs(Math.cos(t)) + Math.abs(Math.sin(t)); };
    const BIN = [0, 2, 10, 20, 30, 40, 45.1];
    say('By channel angle, all spans under 2.0:');
    table(['channel angle off the axis', 'n', 'median width', 'width that angle needs (best phase)', 'airMin = 0'], BIN.slice(0, -1).map((b, i) => {
      const rs = R.filter((r) => chan(r) >= b && chan(r) < BIN[i + 1]);
      return [`${b}-${BIN[i + 1] === 45.1 ? 45 : BIN[i + 1]} deg`, i === 0 ? `${int(rs.length)} (${pct(rs.length, R.length)})` : rs.length, median(rs.map((r) => r.width)), r3(need((b + BIN[i + 1]) / 2)), pct(rs.filter((r) => r.airMin === 0).length, rs.length)];
    }));
    say(`- spans at the floor in a channel whose best-phase floor exceeds 1.5: ${MASTER_LIST.map((m) => { const rs = R.filter((r) => r.master === m && at15(r)); return `${rs.filter((r) => need(chan(r)) > 1.5).length} of ${rs.length}`; }).join(' / ')}`);
  };

  S.s4c = () => {
    head('§4c The spans that leave no light pixel at all (airMin >= 0.995)');
    const R = READ(), W = R.filter((r) => r.airMin >= 0.995), ok = W.filter((r) => r.width >= 1.49);
    say(`- spans with airMin >= 0.995: ${W.length}; at or above 1.5 (width >= 1.49): ${ok.length}; below: ${W.length - ok.length}`);
    say(`- concepts among those at or above 1.5 (${uniq(ok, (r) => r.concept)}): ${[...new Set(ok.map((r) => r.concept))].sort().map((c) => `\`${c}\``).join(', ')}`);
    const nw = R.filter((r) => r.airMin >= 0.7 && r.airMin < 0.995);
    say(`- near-welds, airMin 0.70-0.995: ${nw.length} spans, ${uniq(nw, (r) => `${r.master}/${r.file}`)} drawings; concepts: ${[...new Set(nw.map((r) => r.concept))].sort().join(', ')}`);
    // book-2: the span's own reading, and the ribbon channel's lightest pixel
    say('book-2, the ribbon (file: "1.5 clear inside"):');
    for (const m of MASTER_LIST) {
      const rs = R.filter((r) => r.file === 'book-2' && r.master === m && (r.kind === 'self' || r.kind === 'facing-self'));
      const d = drawing(m, 'book-2'), reg = regionOfDrawing(d), h = STROKES[m] / 2;
      // the ribbon: M xL top V … L apex L xR … V top — its air runs between the two legs' inner
      // edges, from the cover's top edge down to the inside of the 45-degree fork
      const rib = parsePath(partsOf(d.file, d.src, m).ds[2]);
      const xL = rib[0].args[0] + h, top = rib[0].args[1] + h, xR = rib[3].args[0] - h, apex = rib[2].args[1] - h * Math.SQRT2;
      const cols = [], rows = [];
      for (let i = Math.floor(xL); i < Math.ceil(xR); i++) if (i + 0.5 > xL && i + 0.5 < xR) cols.push(i);
      for (let j = Math.ceil(top); j + 1 <= apex; j++) rows.push(j);
      const lightest = Math.min(...cols.flatMap((i) => rows.map((j) => sampleBox(reg, i, j, i + 1, j + 1, AIR_RATE))));
      say(`  - ${m}: ${rs.map((r) => `${r.kind} w ${r.width} phase ${r.phase} airMin ${r.airMin}`).join('; ')} · ribbon channel x ${r3(xL)}..${r3(xR)}, pixel columns ${cols.join(',')}, rows ${rows[0]}-${rows.at(-1)}: lightest pixel ${r3(lightest)}`);
    }
    say('desktop-6, the stand legs (file: "1.5 · 1.5 · 1.5 of air between them"):');
    for (const m of MASTER_LIST) {
      const d = drawing(m, 'desktop-6'), reg = regionOfDrawing(d), h = STROKES[m] / 2, { ds } = partsOf(d.file, d.src, m);
      const L1 = parsePath(ds[1]), L2 = parsePath(ds[2]), foot = parsePath(ds[3]);
      const xL = L1[0].args[0] + h, xR = L2[0].args[0] - h, y0 = L1[0].args[1] + h, y1 = foot[0].args[1] - h;
      const cols = [], rows = [];
      for (let i = Math.floor(xL); i < Math.ceil(xR); i++) if (i + 0.5 > xL && i + 0.5 < xR) cols.push(i);
      for (let j = Math.ceil(y0); j + 1 <= y1; j++) rows.push(j);
      const cov = cols.flatMap((i) => rows.map((j) => sampleBox(reg, i, j, i + 1, j + 1, AIR_RATE)));
      const sp = R.filter((r) => r.file === 'desktop-6' && r.master === m && r.kind === 'pair' && at15(r));
      const lr = lintSource(m, d.file, d.src), lint = `${lr.warnings.length} warnings, ${lr.errors.length} errors`;
      say(`  - ${m}: channel x ${r3(xL)}..${r3(xR)} between y ${r3(y0)} and ${r3(y1)}: pixel columns ${cols.join(',')} x rows ${rows.join(',')}, coverage ${r3(Math.min(...cov))}-${r3(Math.max(...cov))}, background pixels ${cov.filter((c) => c === 0).length}; closest-approach span ${sp.map((r) => `at y ${r3(r.p[1])}, ${r.axis}, phase ${r.phase}, airMin ${r.airMin}`).join('; ')}; lintSource: ${lint}`);
    }
    say('bug / bug-2, vertical spans of exactly 1.5 with airMin = 1:');
    for (const m of [20, 16]) {
      const rs = R.filter((r) => r.master === m && /^bug(-2)?(-filled)?$/.test(r.file) && r.axis === 'vertical' && r.width === 1.5 && r.airMin === 1);
      say(`  - ${m}: ${['bug', 'bug-2', 'bug-filled', 'bug-2-filled'].map((f) => `${f} ${rs.filter((r) => r.file === f).length}`).join(' · ')}`);
    }
  };

  S.s4d = () => {
    head('§4d The effective floor is 1.485');
    const passes = (x) => r2(x) >= MIN_GAP - 0.01;               // lint: reading (2 dp) < floor - 0.01 warns
    let lowest = null;
    for (let k = 1500; k >= 1400; k--) if (passes(k / 1000)) lowest = k / 1000; else break;
    say(`- the smallest 3-dp reading lint passes against ${MIN_GAP}: ${lowest} (it reads as ${r2(lowest).toFixed(2)})`);
    // realphase spans read at 3 dp, held to the floor their file declares (gap note, else glyph 1 on a glyph's own counters, else 1.5)
    const floorOf = (r) => (r.gapNote != null ? r.gapNote : r.isGlyph && (r.kind === 'self' || r.kind === 'facing-self' || r.glyphPair) ? 1 : 1.5);
    const win = SPANS().filter((r) => r.width != null && floorOf(r) === 1.5 && r.width >= lowest && r.width < 1.49);
    const byDrawing = new Map();
    for (const r of win) { const k = `${r.master}/${r.file}`; if (!byDrawing.has(k)) byDrawing.set(k, []); byDrawing.get(k).push(`${r.kind} ${r.width}`); }
    say(`- spans in [${lowest}, 1.49): ${win.length}, in ${byDrawing.size} drawings:`);
    for (const [k, v] of [...byDrawing].sort()) say(`  - ${k}: ${v.join(', ')}`);
  };

  // ── §4e-4i: the gap census ──
  S.s4e = async () => {
    head('§4e The full gap census — lint\'s own readings, kept (gap-census.mjs)');
    const C = CENSUS(), L = LINT();
    const proof = await gapProof(set(), C, L);
    const warnRows = C.rows.filter((r) => r.lintWouldWarn);
    say(`- lint at the pin: ${L.warned} warned drawings carrying ${L.lines} warning lines; every line gap-family: ${[...L.results.values()].every((r) => r.warnings.every(isGapFamily)) ? 'yes' : 'no'}`);
    say(`- the port's warnings: ${warnRows.length} rows in ${uniq(warnRows, dkey)} drawings; same text drawing by drawing as lint's full run on ${proof.lineEq}/${proof.lineN}`);
    say(`- port's gap-family warnings equal lintSource's on ${proof.warnEq}/${proof.files}; port's values equal lint's private measured[] (in-memory copy) on ${proof.measEq}/${proof.files}`);
    say(`- negative control (the filled weight on a shape-filled file that also has strokes): caught on ${proof.caught} of ${proof.tried}`);
    const kinds = (rs, k) => rs.filter(k).length;
    const sp = SPANS();
    const pairs = [['pair', (r) => r.kind === 'pair' && r.value !== null, (r) => r.kind === 'pair'], ['self', (r) => r.kind === 'self', (r) => r.kind === 'self'],
      ['facing-self', (r) => r.sub === 'self', (r) => r.kind === 'facing-self'], ['cut', (r) => r.sub === 'cut', (r) => r.kind === 'facing-cut'],
      ['notch', (r) => r.sub === 'notch', (r) => r.kind === 'facing-notch'], ['separation', (r) => r.sub === 'separation', (r) => r.kind === 'facing-separation'],
      ['line', (r) => r.sub === 'line', (r) => r.kind === 'facing-line']];
    say(`- per-kind row counts, census port · span port: ${pairs.map(([k, a, b]) => `${k} ${int(kinds(C.rows.filter((r) => r.kind !== 'pair' || r.value !== null), a))} · ${int(kinds(sp, b))}`).join(' | ')}`);
    say(`- ${int(C.rows.length)} rows; ${int(C.rows.filter(isReading).length)} of them readings`);
    const COLS = [[24, 'outline'], [24, 'filled'], [20, 'outline'], [20, 'filled'], [16, 'outline'], [16, 'filled']];
    const KR = [['pair (section 5)', (r) => r.kind === 'pair' && r.value !== null], ['self (5b)', (r) => r.kind === 'self'], ['material (5c)', (r) => r.kind === 'material'],
      ['facing:self (5f)', (r) => r.kind === 'facing' && r.sub === 'self'], ['facing:cut', (r) => r.sub === 'cut'], ['facing:notch', (r) => r.sub === 'notch'],
      ['facing:separation', (r) => r.sub === 'separation'], ['facing:line', (r) => r.sub === 'line'],
      ['pair-crossing — lint skips (`:394`)', (r) => r.kind === 'pair-crossing'], ['pair-touching <= 0.1 — lint skips (`:401`)', (r) => r.kind === 'pair-touching'],
      ['pair, NaN — lint never judges', (r) => r.kind === 'pair' && r.value === null]];
    table(['kind', '24 out', '24 fil', '20 out', '20 fil', '16 out', '16 fil', 'total'], KR.map(([l, f]) => {
      const c = COLS.map(([m, s]) => C.rows.filter((r) => r.master === m && r.style === s && f(r)).length);
      return [l, ...c.map(int), int(c.reduce((a, b) => a + b, 0))];
    }));
  };

  S.s4f = () => {
    head('§4f The candidate-floor table (reading < F - 0.01, every kind against the one F, notes ignored)');
    const R = reads(), FS = [0.875, 1.0, 1.125, 1.25, 1.375, 1.5];
    const triple = (rs) => `${rs.length}/${uniq(rs, dkey)}/${uniq(rs, (r) => r.concept)}`;
    const K = [['pair', (r) => r.kind === 'pair'], ['self', (r) => r.kind === 'self'], ['material', (r) => r.kind === 'material'], ['facing', (r) => r.kind === 'facing'], ['**ALL**', () => true]];
    table(['kind', ...FS.map((F) => `< ${F}`), '**today** (1.5 + exceptions)'], K.map(([k, f]) => [k, ...FS.map((F) => triple(R.filter((r) => f(r) && belowLint(v2(r), F)))), triple(R.filter((r) => f(r) && r.lintWouldWarn))]));
    say(`- readings sitting AT each candidate floor (within the 0.005 rounding): ${FS.map((F) => `${F} → ${triple(R.filter((r) => Math.abs(v2(r) - F) <= 0.005 + 1e-9))}`).join(' · ')}`);
  };

  S.s4g = () => {
    head('§4g How much the floor is shaping the set');
    const C = CENSUS(), R = reads(), files = C.files;
    const at = R.filter((r) => Math.abs(v2(r) - 1.5) <= 0.01 + 1e-9), exact = R.filter((r) => Math.abs(r.value - 1.5) <= 0.001);
    const tight = new Map(files.map((f) => [`${f.master}/${f.file}`, null]));
    for (const r of R) { const k = dkey(r), v = v2(r); if (tight.get(k) === null || v < tight.get(k)) tight.set(k, v); }
    const withR = [...tight.values()].filter((v) => v !== null), on = withR.filter((v) => Math.abs(v - 1.5) <= 0.01 + 1e-9).length;
    const none = files.length - withR.length, ge175 = [...tight.values()].filter((v) => v === null || v >= 1.75 - 1e-9).length;
    const concepts = uniq(files, (f) => f.concept);
    table(['', 'count', 'share'], [
      ['readings within 0.01 of 1.5', `${int(at.length)} of ${int(R.length)}`, pct(at.length, R.length, 0)],
      ['… of them truly exact (within 0.001)', int(exact.length), '—'],
      ['distinct drawings carrying one', `${int(uniq(at, dkey))} of ${int(files.length)}`, pct(uniq(at, dkey), files.length, 0)],
      ['distinct concepts', `${uniq(at, (r) => r.concept)} of ${concepts}`, pct(uniq(at, (r) => r.concept), concepts, 0)],
      ['drawings whose tightest reading is 1.5', int(on), `${pct(on, files.length, 0)} of all · ${pct(on, withR.length, 0)} of the ${int(withR.length)} that have any reading`],
      ['drawings with no gap reading at all', int(none), pct(none, files.length, 0)],
      ['drawings with nothing closer than 1.75', int(ge175), pct(ge175, files.length, 0)],
    ]);
    const K = ['pair', 'self', 'material', 'facing'];
    say(`- share of each kind's readings sitting at 1.5: ${K.map((k) => `${k} ${pct(at.filter((r) => r.kind === k).length, R.filter((r) => r.kind === k).length, 0)}`).join(' · ')}`);
    say(`- facing at 1.5 by sub-kind: ${['separation', 'cut', 'self', 'line', 'notch'].map((s) => `${s} ${at.filter((r) => r.kind === 'facing' && r.sub === s).length}`).join(', ')}`);
    const noneConcepts = new Set([...tight].filter(([, v]) => v === null).map(([k]) => conceptOf(k.split('/')[1])));
    say(`- the named examples with no reading in any of their six files: ${['arrow-down', 'chevron-down', 'check', 'ban', 'book-open'].map((c) => `${c} ${[24, 20, 16].every((m) => [c, `${c}-filled`].every((n) => tight.get(`${m}/${n}`) === null)) ? 'yes' : 'no'}`).join(' · ')} (concepts with at least one reading-free file: ${noneConcepts.size})`);
  };

  S.s4h = () => {
    head('§4h Four things lint cannot see (found by porting it)');
    const C = CENSUS(), rows = C.rows;
    const nan = rows.filter((r) => r.unmeasurable);
    say(`1. NaN pair rows: ${nan.length} — ${nan.map((r) => `${r.master}/${r.file} paths ${r.pathA}/${r.pathB} (NaN samples dropped: centreline ${r.centrelineIfNaNDropped}, skipped as touching: ${r.skippedAsTouchingIfNaNDropped ? 'yes' : 'no'})`).join('; ')}`);
    const poisoned = [];
    for (const d of set()) {
      const { areas, ds } = partsOf(d.file, d.src, d.master);
      for (const [kind, list] of [['stroked', ds], ['area', areas]]) list.forEach((p) => { if (samplePath(p).some(([x, y]) => !Number.isFinite(x) || !Number.isFinite(y))) poisoned.push(`${d.master}/${d.name} (${kind})`); });
    }
    say(`   paths whose samples include NaN (a zero-length arc): ${poisoned.length} — ${poisoned.join(', ')}`);
    const fs = rows.filter((r) => r.kind === 'facing' && r.sub === 'self');
    const first = fs.filter((r) => r.suppressedBy === 'dot-or-open-single-subpath'), second = fs.filter((r) => r.suppressedBy === 'read5b');
    const nobody = first.filter((r) => r.read5b === null);
    say(`2. facing:self readings judged by nothing (dropped by "5b reads it" and selfGap null): ${nobody.length}, smallest ${Math.min(...nobody.map(v2)).toFixed(2)} — ${nobody.map((r) => `${r.master}/${r.file} ${v2(r).toFixed(2)}`).join('; ')}`);
    const withStrokes = C.files.filter((f) => f.nAreas > 0 && f.nPaths > 0), notRun = rows.filter((r) => r.kind === 'material' && !r.lintRan);
    say(`3. shape-filled drawings that also carry strokes (5c never runs): ${withStrokes.length}; material readings there: ${notRun.length} (${notRun.map((r) => r.value).join(', ')})`);
    say(`4. facing:self rows ${fs.length}: dropped by the first filter ${first.length}, by the second ("5b read this neck") ${second.length}`);
    const lows = reads().filter((r) => v2(r) < 1.5 - 0.005 - 1e-9);
    const hidden = lows.filter((r) => !r.lintWouldWarn && (r.wouldWarnUnfiltered || r.wouldWarnIfRun));
    const noted = lows.filter((r) => !r.lintWouldWarn && !hidden.includes(r) && r.floorApplied < 1.5 && r.noteOnFile);
    const tol = lows.filter((r) => !r.lintWouldWarn && !hidden.includes(r) && !noted.includes(r));
    say(`- readings below 1.5: ${lows.length} — lint warnings ${lows.filter((r) => r.lintWouldWarn).length}, declared notes holding their lowered floor ${noted.length}, inside lint's 0.01 tolerance ${tol.length}, hidden by a lint filter ${hidden.length}`);
  };

  S.s4i = () => {
    head('§4i Lint reports overlapping ink as a negative gap');
    const neg = reads().filter((r) => r.kind === 'pair' && v2(r) < 0);
    say(`- negative pair readings: ${neg.length}, in ${uniq(neg, (r) => r.concept)} concepts: ${[...new Set(neg.map((r) => r.concept))].sort().join(', ')}`);
    say(`- by master: ${MASTER_LIST.map((m) => { const rs = neg.filter((r) => r.master === m); return `${m}: ${[...new Set(rs.map((r) => v2(r).toFixed(2)))].join(',')} (centreline ${[...new Set(rs.map((r) => r2(r.centreline).toFixed(2)))].join(',')})`; }).join(' · ')}`);
    const L = LINT();
    const lines = [...L.results].flatMap(([k, r]) => r.warnings.filter((w) => /^paths \d+\/\d+ are /.test(w) && /edge gap -/.test(w)).map((w) => ({ k, w })));
    say(`- lint warning lines that print a negative edge gap: ${lines.length} of ${L.lines}; at 24/sort-alpha-ascending: "${lines.find((x) => x.k === '24/sort-alpha-ascending.svg')?.w}"`);
  };

  S.s5 = () => {
    head('§5 Does one constant do the job? — the three statements, measured');
    const clear = (w) => PHASES.filter((p) => holdsWholePixel(p, w)).length;
    say(`- a 0.88 band holds a whole pixel at ${clear(0.88)} of 8 phases; a 1.5 band at ${clear(1.5)} of 8 (fails at ${8 - clear(1.5)})`);
    const top16 = (() => { const h = {}; for (const r of SPANS().filter((x) => x.master === 16 && isAxial(x))) h[r.phase] = (h[r.phase] ?? 0) + 1; return Number(Object.entries(h).sort((a, b) => b[1] - a[1])[0][0]); })();
    say(`- the most common axial phase at the 16 master is ${top16}; a 1.5 band there holds a pixel: ${holdsWholePixel(top16, 1.5) ? 'yes' : 'no'}`);
    const g = READ().filter((s) => s.glyphPair);
    const ok = g.filter((s) => s.airMin === 0), bad = g.filter((s) => s.airMin > 0);
    say(`- C19 glyph dot-gaps (glyph pairs) in the shipped set: ${g.length}; produce a clear pixel: ${ok.length}; the others read ${Math.min(...bad.map((s) => s.airMin))}-${Math.max(...bad.map((s) => s.airMin))}`);
    const ph = (rs) => rs.map((s) => (s.phase == null ? 'diag' : s.phase));
    say(`- phases of the clear ones: ${ph(ok).join(', ')}; of the grey ones: ${ph(bad).join(', ')}`);
  };

  S.s6a = () => {
    head('§6a The exceptions, measured');
    const glyph = set().filter((d) => /<!--\s*glyph:/.test(d.src)), gap = set().filter((d) => /<!--\s*gap:/.test(d.src));
    const kindOfNote = (d) => d.src.match(/<!--\s*glyph:\s*(\w+)/)?.[1];
    say(`- C19 glyph notes: ${glyph.length} files (${['dot', 'numeral'].map((k) => `${glyph.filter((d) => kindOfNote(d) === k).length} \`glyph: ${k}\``).join(', ')})`);
    const vals = gap.map((d) => Number(d.src.match(/<!--\s*gap:\s*([\d.]+)/)[1])).sort((a, b) => a - b);
    const counts = [...new Set(vals)].map((v) => `${v}${vals.filter((x) => x === v).length > 1 ? ` (x${vals.filter((x) => x === v).length})` : ''}`);
    say(`- per-file \`gap: N\`: ${gap.length} files, ${uniq(gap, (d) => conceptOf(d.name))} concepts — ${[...new Set(gap.map((d) => conceptOf(d.name)))].sort().map((c) => `\`${c}\``).join(', ')}; values ${counts.join(' · ')}`);
    // every span under 2.0 in a file with a note (aligncheck.mjs part 3), one line per distinct span
    const seen = new Set();
    for (const s of READ().filter((x) => x.gapNote != null).sort((a, b) => a.file.localeCompare(b.file) || b.master - a.master)) {
      const k = `${s.master}/${s.file}/${s.kind}/${s.width}`;
      if (seen.has(k)) continue;
      seen.add(k);
      say(`  - ${s.file} ${s.master}, note ${s.gapNote}: ${s.kind} w ${s.width} ${s.axis} airMin ${s.airMin}`);
    }
  };

  S.s6b = () => {
    head('§6b The shape that would need no exceptions — derived values, measured in §3');
    const D = DIAG(), d0 = D.find((x) => x.deg === 0), d45 = D.find((x) => x.deg === 45);
    say(`- axial air, wall on a whole pixel: ${(() => { const reg = region([{ d: 'M3 6.375h10', kind: 'stroke', weight: 1.25 }, { d: 'M3 8.625h10', kind: 'stroke', weight: 1.25 }], { label: 'b' }); return Math.max(...[4, 5, 6, 7, 8, 9, 10, 11].map((i) => sampleBox(reg, i, 7, i + 1, 8, SWEEP_RATE))) === 0 ? 'a 1.0 band reads a clear row' : 'a 1.0 band does not read clear'; })()}`);
    say(`- axial air, wall anywhere: first clear at every phase ${d0.every}`);
    say(`- channel at 45 degrees: |cos| + |sin| = ${d45.theory}; measured ${d45.every} at every phase`);
    say(`- one constant for every angle given an aligned wall: the smallest grid-legal value >= sqrt(2) = ${Math.ceil(Math.SQRT2 / 0.125) * 0.125}`);
  };

  S.s6c = () => {
    head('§6c What it would cost (cost.mjs, every span under 2.0 units)');
    const R = READ(), fail = R.filter((r) => r.airMin > 0);
    const ax = fail.filter(isAxial).map((r) => ({ ...r, slide: r3(r.phase), widen: r3(Math.max(0, 2 - r.phase - r.width)) }));
    const drawings = new Set(fail.map((r) => `${r.master}/${r.file}`)), concepts = new Set(fail.map((r) => r.concept));
    const nudge = new Set(ax.filter((r) => Math.min(r.slide, r.widen) <= 0.251).map((r) => `${r.master}/${r.file}`));
    const more = new Set([...ax.filter((r) => Math.min(r.slide, r.widen) > 0.251), ...fail.filter((r) => !isAxial(r))].map((r) => `${r.master}/${r.file}`));
    table(['', 'count'], [
      ['spans failing "holds a whole clear pixel"', `${int(fail.length)} of ${int(R.length)} (${pct(fail.length, R.length)})`],
      ['drawings affected', `${drawings.size} of ${int(set().length)} (${pct(drawings.size, set().length)})`],
      ['concepts affected', `${concepts.size} of ${uniq(set(), (d) => conceptOf(d.name))} (${pct(concepts.size, uniq(set(), (d) => conceptOf(d.name)))})`],
      ['of those, fixable by a grid-legal nudge of <= 0.25', `${nudge.size} drawings`],
      ['needing more than that, or in a diagonal channel', `${more.size} drawings`],
      ['largest nudge needed, per master', MASTER_LIST.map((m) => `${Math.max(...ax.filter((r) => r.master === m).map((r) => r.slide)).toFixed(3)} (${m})`).join(' · ')],
      ['alternative: widen the air; spans needing <= 0.25 more', MASTER_LIST.map((m) => { const rs = ax.filter((r) => r.master === m); return `${m}: ${rs.filter((r) => r.widen < 0.251).length}/${rs.length}`; }).join(' · ')],
    ]);
  };

  // ── Part two ──
  S.p2 = () => {
    head('Part two — contact grammar: the census (contact-census.mjs; lines 508-546)');
    const C = CONTACT(), P = C.primary, files = C.perFile;
    say(`- drawings parsed: ${int(files.length)}; parse failures: ${C.failures.length}; files carrying a per-path stroke-width: ${set().filter((d) => /<path[^>]*stroke-width/.test(d.src)).length}`);
    // the census's `ambiguous` flag is set on every crossing whose shorter leg is under canvas/8 (contact-census.mjs
    // code); its comment, and the document, describe the band between reach and canvas/8 — print both counts
    const amb = P.filter((c) => c.cls === 'cross' && c.ambiguous);
    const inBand = amb.filter((c) => c.minSide >= c.reach), under = amb.filter((c) => c.minSide < c.reach);
    say(`- crossings flagged ambiguous (shorter leg under canvas/8): ${amb.length}; of them, shorter leg between reach and canvas/8: ${inBand.length}; shorter leg under reach: ${under.length} (${[...new Set(under.map((c) => `${c.name} ${c.master}`))].sort().join(', ')})`);
    const knob = P.filter((c) => c.name === 'sliders-4' && c.master === 24 && c.cls === 'cross');
    say(`- the rejected cuts, on sliders-4 at 24 (canvas/8 = 3): ${knob.map((c) => `${c.a} near/far ${c.nearA}/${c.farA} · ${c.b} near/far ${c.nearB}/${c.farB}`).join('; ')}`);
    const withC = files.filter((f) => f.contacts > 0).length;
    say(`- primary junctions ${int(P.length)} (plus ${C.secondary.length} secondary), in ${int(withC)} of ${int(files.length)} drawings (${pct(withC, files.length)}); ${int(files.length - withC)} have no contact`);
    const byConcept = new Map();
    for (const f of files) byConcept.set(f.concept, (byConcept.get(f.concept) ?? 0) + f.contacts);
    say(`- concepts contact-free in all six files: ${[...byConcept.values()].filter((v) => v === 0).length} of ${byConcept.size}`);
    const busiest = [...files].sort((a, b) => b.contacts - a.contacts)[0];
    say(`- busiest drawing: \`${busiest.concept}\` — ${MASTER_LIST.map((m) => `${files.find((f) => f.name === busiest.name && f.master === m).contacts} at ${m}`).join(', ')}`);
    const ROWS = [['T-on', 'centreline', (c) => c.cls === 'T-on' && c.metric === 'centreline'], ['T-short', 'centreline', (c) => c.cls === 'T-short' && c.metric === 'centreline'],
      ['T-through', 'centreline', (c) => c.cls === 'T-through' && c.metric === 'centreline'], ['T-through', 'area-depth', (c) => c.cls === 'T-through' && c.metric === 'area-depth'],
      ['T-on + T-short', 'area-depth', (c) => (c.cls === 'T-on' || c.cls === 'T-short') && c.metric === 'area-depth'],
      ['cross', 'centreline', (c) => c.cls === 'cross' && c.metric === 'centreline'], ['cross', 'area-depth', (c) => c.cls === 'cross' && c.metric === 'area-depth'],
      ['corner', 'centreline', (c) => c.cls === 'corner'], ['graze', 'centreline', (c) => c.cls === 'graze' && c.metric === 'centreline'],
      ['overlap', 'centreline + area', (c) => c.cls === 'overlap'], ['other', 'centreline', (c) => c.cls === 'other']];
    table(['class', 'metric', '24', '20', '16', 'total'], ROWS.map(([cl, met, f]) => { const n = MASTER_LIST.map((m) => P.filter((c) => c.master === m && f(c)).length); return [cl, met, ...n, int(n[0] + n[1] + n[2])]; }));
    say(`- rows above sum to ${int(ROWS.reduce((a, [, , f]) => a + P.filter(f).length, 0))} of ${int(P.length)} primary junctions (a graze measured area-depth is in no row: ${P.filter((c) => c.cls === 'graze' && c.metric === 'area-depth').length})`);
    say(`- by element kind: ${['stroke/stroke', 'area/stroke', 'area/area'].map((k) => `${k} ${int(P.filter((c) => c.kinds === k || c.kinds === k.split('/').reverse().join('/')).length)}`).join(' · ')}`);
  };

  S.s7 = () => {
    head('§7 Lint\'s coverage of this territory');
    const P = CONTACT().primary, pairs = new Map();
    for (const c of P) {
      const pa = String(c.a).replace(/^[ap]/, '').split('s')[0], pb = String(c.b).replace(/^[ap]/, '').split('s')[0];
      const k = `${c.master}|${c.name}|${pa}|${pb}`, crossed = /cross/.test(c.cls) || c.via === 'crossing';
      const cur = pairs.get(k);
      if (!cur) pairs.set(k, { c, samePath: pa === pb, dmin: c.dmin, crossed, n: 1, classes: [c.cls] });
      else { cur.dmin = Math.min(cur.dmin, c.dmin); cur.crossed ||= crossed; cur.n++; cur.classes.push(c.cls); }
    }
    const rows = [...pairs.values()];
    const bucket = (r) => (r.samePath ? 'A' : r.crossed ? 'B' : r.dmin <= 0.1 ? 'C' : 'D');
    const LABEL = { A: 'A — two subpaths of **one** `d`: never enters lint section 5 at all', B: 'B — skipped at `tools/lint.mjs:394`, "paths that cross … join by design"', C: 'C — skipped at `tools/lint.mjs:401`, `min <= 0.1`', D: '**D — lint measures it**' };
    table(['Which branch sees the junction', 'path pairs', 'junctions'], [...'ABCD'.split('').map((b) => { const g = rows.filter((r) => bucket(r) === b); return [LABEL[b], int(g.length), int(g.reduce((a, r) => a + r.n, 0))]; }),
      ['total', int(rows.length), int(P.length)]]);
    const D = rows.filter((r) => bucket(r) === 'D'), dj = D.reduce((a, r) => a + r.n, 0);
    say(`- junctions examined by nothing: ${int(P.length - dj)} of ${int(P.length)} (${pct(P.length - dj, P.length)}); lint's coverage ${pct(dj, P.length)}`);
    say(`- bucket D concepts: ${[...new Set(D.map((r) => r.c.concept))].sort().join(', ')}; edge gap ${MASTER_LIST.map((m) => [...new Set(D.filter((r) => r.c.master === m).map((r) => r3(r.dmin - r.c.reach)))].join(',')).join(' · ')} from centreline distances ${MASTER_LIST.map((m) => [...new Set(D.filter((r) => r.c.master === m).map((r) => r.dmin))].join(',')).join(' · ')}`);
    const B = lintPairDrops(set());
    const dropped = new Set([...B.crossFiles, ...B.touchFiles]);
    say(`- lint's pair loop over ${int(B.pairs)} stroked-path pairs (blindspots.mjs): ${B.crossing} dropped as crossing, ${int(B.touching)} as touching — ${int(B.crossing + B.touching)} (${pct(B.crossing + B.touching, B.pairs)}), across ${int(dropped.size)} of ${int(set().length)} drawings and ${uniq([...dropped], (k) => conceptOf(k.split('/')[1]))} of ${uniq(set(), (d) => conceptOf(d.name))} concepts`);
    const L = LINT(), all = [...L.results].flatMap(([k, r]) => r.warnings.map((w) => ({ k, w })));
    const s5 = all.filter((x) => /^paths \d+\/\d+ are /.test(x.w)), s5f = all.filter((x) => /faces itself across|^[-\d.]+ of air /.test(x.w));
    say(`- lint at the pin: ${L.warned} warned drawings, ${L.lines} warning lines (${s5f.length} from section 5f, ${s5.length} from section 5)`);
    say(`- the section-5 lines: ${s5.filter((x) => /sort-alpha/.test(x.k)).length} on sort-alpha-*, ${s5.filter((x) => !/sort-alpha/.test(x.k)).map((x) => `${x.k.replace('.svg', '')} "${x.w}"`).join('; ')}`);
    // for wave 5's reconcile list (C22 and docs/09:31 call these a false positive; this card, near-misses): the measurements only
    const tp = READ().filter((r) => r.file === 'trash' && r.kind === 'pair' && r.paths?.join('/') === '2/3');
    say(`- trash, tab (path 2) to can (path 3), the pair lint warns on at 20 and 16: ${tp.sort((a, b) => b.master - a.master).map((r) => `${r.master}: edge gap ${r.width}, ${r.axis}, airMin ${r.airMin}`).join(' · ')}`);
    let leaks = 0, dup = [], checked = 0;
    for (const d of set().filter((x) => x.file.endsWith('-filled.svg'))) {
      const { areas, ds } = partsOf(d.file, d.src, d.master);
      if (!areas.length) continue;
      checked++;
      const all2 = [...d.src.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<path[^>]*\bd="([^"]+)"/g)].length;
      if (ds.length !== all2 - areas.length) leaks++;
      else if (ds.some((x) => areas.includes(x))) dup.push(`${d.master}/${d.name}`);
    }
    say(`- shape-filled files checked for area paths leaking into lint's stroked list: ${int(checked)}; leaks ${leaks}; files whose stroked d is byte-identical to one of their area paths: ${dup.length} (${[...new Set(dup.map((k) => k.split('/')[1]))].sort().join(', ')})`);
  };

  S.s8 = () => {
    head('§8 The implicit rule');
    const T = T_CL(), P = CONTACT().primary;
    say(`- stroke-to-stroke T-junctions: ${int(T.length)}`);
    const sub = (s) => MASTER_LIST.map((m) => T.filter((c) => c.master === m && c.cls === `T-${s}`).length);
    table(['', '24', '20', '16', 'total', 'share'], [['lands on the other centreline (abs overshoot <= 0.01)', 'on'], ['stops short', 'short'], ['runs through', 'through']].map(([l, s]) => {
      const n = sub(s), t = n[0] + n[1] + n[2]; return [l, ...n, int(t), pct(t, T.length)];
    }));
    say(`- the "on" share per master: ${MASTER_LIST.map((m) => pct(T.filter((c) => c.master === m && c.cls === 'T-on').length, T.filter((c) => c.master === m).length)).join(' · ')}`);
    const band = (c) => { const a = Math.abs(c.overshoot); return a === 0 ? 1 : a <= 0.01 ? 2 : a < 0.25 ? 3 : 4; };
    table(['band', '24', '20', '16', 'total', 'ceiling'], [[1, '1 — exactly 0.000'], [2, '2 — <= 0.01, non-zero'], [3, '3 — 0.01-0.25'], [4, '4 — >= 0.25, structural']].map(([b, l]) => {
      const g = T.filter((c) => band(c) === b), n = MASTER_LIST.map((m) => g.filter((c) => c.master === m).length);
      return [l, ...n, int(g.length), g.length ? Math.max(...g.map((c) => Math.abs(c.overshoot))) : 0];
    }));
    const tiny = T.filter((c) => band(c) === 2);
    const onArc = (c) => { const icon = iconFromSource(drawing(c.master, c.name).src, { file: `${c.name}.svg`, master: c.master }); const ix = (id) => Number(String(id).replace(/^[ap]/, '').split('s')[0]); return /A/i.test(icon.paths[ix(c.a)]?.d ?? '') || /A/i.test(icon.paths[ix(c.b)]?.d ?? ''); };
    const straight = tiny.filter((c) => !onArc(c));
    const grid = tiny.filter((c) => { const g = gridOf(c.master); return Math.abs(c.overshoot / g - Math.round(c.overshoot / g)) < 1e-6; });
    say(`- band 2: ${tiny.length - straight.length} of ${tiny.length} involve a path containing an arc; straight-only ${straight.length} (${straight.map((c) => `${c.name} ${c.master} at ${c.angle} deg`).join(', ')}); multiples of the drawing grid ${grid.length}`);
    // arrow-down at 24: the chevron's bend arc against the shaft's typed end
    const ad = partsOf('arrow-down.svg', drawing(24, 'arrow-down').src, 24).ds;
    const cmds = parsePath(ad[0]), arcAt = cmds.findIndex((c) => c.cmd === 'A'), arc = cmds[arcAt].args, from = cmds[arcAt - 1].args;
    const chord = Math.hypot(arc[5] - from[0], arc[6] - from[1]), rr = arc[0];
    const lowest = from[1] - Math.sqrt(rr * rr - (chord / 2) ** 2) + rr, shaftEnd = parsePath(ad[1])[0].args[1];
    say(`- arrow-down at 24: bend \`A${rr} ${rr}\` across a ${r2(chord)} chord at y ${from[1]} → lowest point ${lowest.toFixed(5)}; the shaft ends at ${shaftEnd}; the shaft stands ${(shaftEnd - lowest).toFixed(5)} past the chevron's centreline`);
    const short = T.filter((c) => c.cls === 'T-short'), thru = T.filter((c) => c.cls === 'T-through');
    say(`- largest shortfall per master: ${MASTER_LIST.map((m) => `${Math.max(...short.filter((c) => c.master === m).map((c) => -c.overshoot))} at ${m}`).join(', ')}; T-short beyond h (half the file's stroke): ${short.filter((c) => -c.overshoot > c.reach / 2 + 1e-9).length} of ${short.length}; T-through beyond h: ${thru.filter((c) => c.overshoot > c.reach / 2 + 1e-9).length} of ${thru.length} (${thru.filter((c) => c.overshoot > c.reach / 2 + 1e-9).map((c) => `${c.name} ${c.master} ${c.overshoot}${c.tangential ? ' tangential' : ''}`).join(', ')})`);
    const Ta = P.filter((c) => c.cls.startsWith('T-') && c.metric === 'area-depth');
    const h = (m) => STROKES[m] / 2, atH = Ta.filter((c) => Math.abs(c.overshoot - h(c.master)) < 0.01);
    const match = atH.filter((c) => P.some((x) => x.concept === c.concept && x.master === c.master && x.style === 'outline' && Math.hypot(x.x - c.x, x.y - c.y) < 0.01 && x.cls === 'T-on'));
    say(`- a line meeting a filled shape: depth h = ${MASTER_LIST.map(h).join(' · ')}; at depth h (within 0.01): ${atH.length} of ${Ta.length}; at the identical coordinate as a T-on in the outline twin: ${match.length} (${pct(match.length, atH.length)}); the rest: ${[...new Set(atH.filter((c) => !match.includes(c)).map((c) => c.concept))].sort().join(', ')}`);
    const bo = P.filter((c) => c.name === 'briefcase' && c.master === 24 && c.cls === 'T-on'), bf = Ta.filter((c) => c.name === 'briefcase-filled' && c.master === 24);
    say(`- briefcase at 24: outline handle T-on at ${bo.map((c) => `(${c.x}, ${c.y})`).join(', ')}; filled: handle end y ${[...new Set(bf.map((c) => c.y))].join(',')}, depth ${[...new Set(bf.map((c) => c.overshoot))].join(',')} → area top edge y ${[...new Set(bf.map((c) => r3(c.y - c.overshoot)))].map((v) => v.toFixed(2)).join(',')}`);
  };

  S.s9 = () => {
    head('§9 Does a junction show? — every T off the line, plus controls (contact-census.mjs RASTER=all, rate 32, px = master)');
    const PR = PROBES().filter((x) => !x.r.skip);
    say(`- probes: ${PR.length} (${['T-short', 'T-through', 'control'].map((t) => `${t} ${PR.filter((x) => x.rec.tag === t).length}`).join(', ')}); skipped ${PROBES().length - PR.length}`);
    const B = [['**0 — nothing changes**', (v) => v === 0], ['0-0.02', (v) => v > 0 && v <= 0.02], ['0.02-0.05', (v) => v > 0.02 && v <= 0.05], ['0.05-0.10', (v) => v > 0.05 && v <= 0.10], ['0.10-0.25', (v) => v > 0.10 && v <= 0.25], ['> 0.25', (v) => v > 0.25]];
    table(['maxDelta (1.0 = a whole pixel of ink)', 'T-short', 'T-through', 'control'], B.map(([l, f]) => [l, ...['T-short', 'T-through', 'control'].map((t) => PR.filter((x) => x.rec.tag === t && f(x.r.maxD)).length)]));
    say(`- change nothing at all: ${PR.filter((x) => x.r.maxD === 0).length} of ${PR.length}; above 0.05: ${PR.filter((x) => x.r.maxD > 0.05).length}`);
    for (const x of PR.filter((y) => y.r.maxD > 0.05).sort((a, b) => b.r.maxD - a.r.maxD))
      say(`  - ${x.r.maxD.toFixed(3)}  ${x.rec.name} ${x.rec.master}  ${x.rec.cls} ${x.rec.overshoot} at ${x.rec.angle} deg${x.rec.tangential ? `, tangential, perpendicular ${x.rec.overPerp}` : ''}`);
    const plug = PR.filter((x) => x.rec.name === 'plug-6' && x.rec.cls === 'T-through');
    say(`- plug-6 largest maxDelta per master: ${MASTER_LIST.map((m) => `${Math.max(...plug.filter((x) => x.rec.master === m).map((x) => x.r.maxD)).toFixed(3)} at ${m}`).join(', ')}`);
    const short = PR.filter((x) => x.rec.tag === 'T-short');
    say(`- T-short: shortfall within h on ${short.filter((x) => -x.rec.overshoot <= x.rec.reach / 2 + 1e-9).length} of ${short.length}; maxDelta 0.000 on ${short.filter((x) => x.r.maxD === 0).length}`);
    const g = PR.find((x) => x.rec.name === 'gauge' && x.rec.master === 24 && x.rec.cls === 'T-through');
    const p6 = PR.find((x) => x.rec.name === 'plug-6' && x.rec.master === 24 && x.rec.overshoot === Math.max(...plug.filter((y) => y.rec.master === 24).map((y) => y.rec.overshoot)));
    say(`- gauge at 24, needle ${g.rec.overshoot} past the dot's centre: maxDelta ${g.r.maxD.toFixed(3)}; plug-6 at 24, prong ${p6.rec.overshoot} past the body: maxDelta ${p6.r.maxD.toFixed(3)}`);
    const c0 = PR.find((x) => x.r.maxD > 0.01);
    say(`- convergence on the first probe above 0.01 (${c0.rec.name} at ${c0.rec.master}): ${[16, 32, 64].map((rate) => `${junctionProbe(c0.rec, drawing(c0.rec.master, c0.rec.name).src, rate).maxD.toFixed(4)} (rate ${rate})`).join(' → ')}`);
    const inArea = PR.filter((x) => x.r.areas > 0);
    say(`- defect A1 exposure: probes in a drawing with an area path ${inArea.length}; the largest endpoint move among them ${inArea.length ? Math.max(...inArea.map((x) => x.r.moved)) : 0} (zero means the shipped and moved renders are the same region, so no classify error can reach the difference)`);
  };

  S.s10 = () => {
    head('§10 The exceptions have no rule');
    const T = T_CL(), real = T.filter((c) => Math.abs(c.overshoot) > 0.01);
    say(`- junctions in bands 3 and 4: ${real.length}`);
    const byC = new Map();
    for (const c of real) { if (!byC.has(c.concept)) byC.set(c.concept, []); byC.get(c.concept).push(c); }
    const reads = [];
    for (const [k, v] of [...byC].sort()) for (const st of ['outline', 'filled']) {
      const g = v.filter((c) => c.style === st);
      if (!g.length) continue;
      const at = (m) => { const o = [...new Set(g.filter((c) => c.master === m).map((c) => c.overshoot))].sort((a, b) => a - b); return o.length ? o.join(',') : '-'; };
      const a24 = at(24), a20 = at(20), a16 = at(16);
      if ([a24, a20, a16].filter((x) => x !== '-').length < 2) continue;
      const n = (x) => (x === '-' ? null : Number(x.split(',')[0]));
      let as = 'neither';
      if (a24 === a20 && a20 === a16) as = 'constant';
      else if (n(a24) !== null && n(a16) !== null && Math.abs(n(a16) / n(a24) - STROKES[16] / STROKES[24]) < 0.03) as = 'x stroke';
      else if (n(a24) !== null && n(a16) !== null && Math.abs(n(a16) / n(a24) - 16 / 24) < 0.03) as = 'x canvas';
      reads.push({ k, st, a24, a20, a16, as });
    }
    table(['concept', 'style', '24', '20', '16', 'reads as'], reads.map((x) => [x.k, x.st, x.a24, x.a20, x.a16, x.as]));
    say(`- present at more than one master: ${reads.length} — x canvas ${reads.filter((x) => x.as === 'x canvas').length}, x stroke ${reads.filter((x) => x.as === 'x stroke').length} (${reads.filter((x) => x.as === 'x stroke').map((x) => `${x.k} ${x.st}`).join(', ')}), neither ${reads.filter((x) => x.as === 'neither').length}, constant ${reads.filter((x) => x.as === 'constant').length}`);
    const fam = (c) => (/^sort-alpha-/.test(c) ? 'sort-alpha-*' : /^lock-[56]$/.test(c) ? 'lock-5/lock-6' : /^at-sign(-2)?$/.test(c) ? 'at-sign/at-sign-2' : /^store(-2)?$/.test(c) ? 'store/store-2' : c);
    const b4 = T.filter((c) => Math.abs(c.overshoot) >= 0.25), fams4 = new Map(), fams34 = new Set(real.map((c) => fam(c.concept)));
    for (const c of b4) fams4.set(fam(c.concept), (fams4.get(fam(c.concept)) ?? 0) + 1);
    say(`- band 4: ${b4.length} junctions in ${fams4.size} families — ${[...fams4].sort((a, b) => b[1] - a[1]).map(([k, v]) => `\`${k}\` ${v}`).join(', ')}; bands 3 and 4 together: ${fams34.size} families (${[...fams34].sort().join(', ')})`);
    const lf = b4.find((c) => c.concept === 'language');
    if (lf) say(`- language ${lf.style} at ${lf.master}: ${lf.overshoot} at ${lf.angle} deg`);
    const ats = b4.filter((c) => /^at-sign/.test(c.concept));
    say(`- at-sign / at-sign-2 in band 4: ${ats.length}, angles ${Math.min(...ats.map((c) => c.angle))}-${Math.max(...ats.map((c) => c.angle))} deg, perpendicular ${[...new Set(ats.map((c) => c.overPerp))].join(',')}`);
    for (const [name, style] of [['lock-5', 'outline'], ['gauge', 'outline']]) {
      const v = MASTER_LIST.map((m) => Math.max(...T.filter((c) => c.concept === name && c.style === style && c.master === m && c.cls === 'T-through').map((c) => c.overshoot)));
      say(`- ${name} ${style}, T-through overshoot ${v.join(' · ')} = ${v.map((x, i) => r2(x / STROKES[MASTER_LIST[i]]).toFixed(2)).join(' · ')} of its own stroke`);
    }
  };

  S.s11 = () => {
    head('§11 Where ink touching is doing real work');
    const P = CONTACT().primary, sec = CONTACT().secondary;
    const tr = P.filter((c) => c.name === 'trash' && c.master === 24 && c.cls === 'T-on' && (c.a === 'p0s0' || c.b === 'p0s0'));
    say(`- trash at 24: T-on junctions on the lid line (path 1, p0s0) ${tr.length} — ${tr.map((c) => `${c.a === 'p0s0' ? c.b : c.a} at (${c.x}, ${c.y})`).join(', ')}; overshoots ${[...new Set(tr.map((c) => c.overshoot.toFixed(3)))].join(',')}`);
    const ts = sec.filter((c) => c.name === 'trash');
    say(`- trash lid tip to can start (secondary records): ${MASTER_LIST.map((m) => { const c = ts.find((x) => x.master === m); return c ? `${m}: ${r3(-c.overshoot)} apart, reach ${c.reach}, cap overlap ${c.depth}` : `${m}: none`; }).join(' · ')}`);
    const gz = P.filter((c) => c.cls === 'graze'), exact = gz.filter((c) => Math.abs(c.reach - c.dmin) < 1e-9);
    say(`- grazes where the inks abut at exactly edge gap 0.000: ${exact.length} — ${exact.map((c) => `${c.name} ${c.master} ${c.a}/${c.b} (dmin ${c.dmin}, reach ${c.reach})`).join('; ')}`);
    const gm = new Map();
    for (const c of gz) { const k = `${c.name} ${c.master}`; gm.set(k, (gm.get(k) ?? 0) + 1); }
    say(`- grazes: ${gz.length} — ${[...gm].sort().map(([k, v]) => `${k}${v > 1 ? ` x${v}` : ''}`).join(', ')}`);
    const ov = P.filter((c) => c.cls === 'overlap' && c.metric === 'centreline'), real = ov.filter((c) => c.runTight >= OVERLAP_L), tang = ov.filter((c) => c.runTight < OVERLAP_L);
    const cnt = (rs) => { const m = new Map(); for (const c of rs) m.set(c.concept, (m.get(c.concept) ?? 0) + 1); return [...m].sort().map(([k, v]) => `${k} x${v}`).join(', '); };
    say(`- true shared runs (still >= ${OVERLAP_L} at tolerance ${COINC_TIGHT}): ${real.length} — ${cnt(real)}`);
    say(`- overlaps that are tangencies (>= ${OVERLAP_L} at ${COINC}, < ${OVERLAP_L} at ${COINC_TIGHT}): ${tang.length}, loose run ${Math.min(...tang.map((c) => c.run))}-${Math.max(...tang.map((c) => c.run))} — ${[...new Set(tang.map((c) => c.concept))].sort().join(', ')}`);
    const Rb = 9, rs = 3, s = rs * Math.acos(((Rb - COINC) ** 2 - (Rb - rs) ** 2 - rs * rs) / (2 * (Rb - rs) * rs));
    say(`- two internally tangent arcs of r${Rb} and r${rs} stay within ${COINC} of each other for ${r2(s)} units of the smaller arc either side of the tangent point`);
    const aa = P.filter((c) => c.kinds === 'area/area');
    say(`- area-to-area contacts: ${aa.length} (${[...new Set(aa.map((c) => c.cls))].join(', ')}) — ${[...new Set(aa.map((c) => c.concept))].sort().join(', ')}`);
    const other = P.filter((c) => c.cls === 'other');
    say(`- other: ${other.length} — ${[...new Set(other.map((c) => c.name))].sort().join(', ')}; same d: ${other.every((c) => c.a.split('s')[0] === c.b.split('s')[0]) ? 'yes' : 'no'}; dmin ${Math.min(...other.map((c) => c.dmin))}-${Math.max(...other.map((c) => c.dmin))}`);
  };

  S.s12 = () => {
    head('§12 Where the grammar is not the same across the set');
    const F = CONTACT().perFile;
    const g3 = new Map();
    for (const f of F) { const k = `${f.concept}|${f.style}`; if (!g3.has(k)) g3.set(k, {}); g3.get(k)[f.master] = f; }
    const bad = [...g3].map(([k, v]) => ({ k, gs: MASTER_LIST.map((m) => v[m]?.grammar ?? 'MISSING') })).filter((b) => new Set(b.gs).size > 1);
    const strip = (g) => g.split('+').filter((x) => x !== 'graze').sort().join('+') || '-';
    const structural = bad.filter((b) => new Set(b.gs.map(strip)).size > 1);
    say(`- across masters: ${g3.size} concept x style groups; ${bad.length} differ across 24 / 20 / 16 — ${structural.length} structurally, ${bad.length - structural.length} by a graze only`);
    const brief = (g) => { const parts = g.split('+'); const m = new Map(); for (const p of parts) m.set(p, (m.get(p) ?? 0) + 1); return g === '-' ? 'none' : [...m].map(([k, v]) => `${k}${v > 1 ? ` x${v}` : ''}`).join(' + '); };
    for (const b of structural.sort((a, c) => a.k.localeCompare(c.k))) say(`  - ${b.k}: ${b.gs.map(strip).map(brief).join(' | ')}`);
    say(`  - graze-only: ${bad.filter((b) => !structural.includes(b)).map((b) => b.k).sort().join(', ')}`);
    const g4 = new Map();
    for (const f of F) { const k = `${f.concept}|${f.master}`; if (!g4.has(k)) g4.set(k, {}); g4.get(k)[f.style] = f; }
    const pairs = [...g4].map(([k, v]) => ({ k, o: v.outline, f: v.filled }));
    const diff = pairs.filter((p) => (p.o?.grammar ?? 'MISSING') !== (p.f?.grammar ?? 'MISSING'));
    const shape = diff.filter((p) => p.f?.areas > 0), line = pairs.filter((p) => p.f && p.f.areas === 0), lineDiff = diff.filter((p) => !(p.f?.areas > 0));
    say(`- outline against filled: ${int(pairs.length)} concept x master pairs; ${diff.length} differ, ${shape.length} of them shape-filled; line-heavy pairs ${line.length}, agreeing ${line.length - lineDiff.length} (${pct(line.length - lineDiff.length, line.length)}); disagreeing ${lineDiff.length} in ${uniq(lineDiff, (p) => p.k.split('|')[0])} concepts: ${lineDiff.map((p) => p.k.replace('|', ' ')).sort().join(', ')}`);
    let onlyF = 0, onlyO = 0;
    const gain = new Set();
    for (const p of line) { const d = p.f.contacts - p.o.contacts; if (d > 0) { onlyF += d; gain.add(p.k.split('|')[0]); } else onlyO -= d; }
    say(`- junctions only in the filled file: ${onlyF}, in ${gain.size} concepts (${[...gain].sort().join(', ')}); only in the outline: ${onlyO}; reach grows with FILLED_WEIGHT: ${MASTER_LIST.map((m) => `${STROKES[m]} → ${FILLED_WEIGHT[m]} at ${m}`).join(', ')}`);
  };

  S.judged = () => {
    head('Judged list — figures stated there and in no section above');
    const lows = reads().filter((r) => v2(r) < 1.5 - 0.005 - 1e-9);
    const tol = lows.filter((r) => !r.lintWouldWarn && !(r.wouldWarnUnfiltered || r.wouldWarnIfRun) && !(r.floorApplied < 1.5 && r.noteOnFile));
    say(`- #10: readings inside the undeclared 0.015 window (read 1.49, held to 1.5, no note): ${tol.length} readings in ${uniq(tol, dkey)} drawings and ${uniq(tol, (r) => r.concept)} concepts`);
    const T = T_CL(), sa = T.filter((c) => /^sort-alpha/.test(c.concept) && c.cls === 'T-short');
    say(`- #21: sort-alpha-* crossbar shortfall per master ${MASTER_LIST.map((m) => [...new Set(sa.filter((c) => c.master === m).map((c) => -c.overshoot))].join(',')).join(' / ')}`);
    const pr = PROBES().filter((x) => /^sort-alpha/.test(x.rec.concept));
    say(`  render probe on the crossbar junctions: ${pr.length} probes, largest maxDelta per master ${MASTER_LIST.map((m) => Math.max(...pr.filter((x) => x.rec.master === m).map((x) => x.r.maxD)).toFixed(3)).join(' / ')}`);
    const neg = reads().filter((r) => r.kind === 'pair' && v2(r) < 0);
    say(`  ink overlap per master ${MASTER_LIST.map((m) => [...new Set(neg.filter((r) => r.master === m).map((r) => (-v2(r)).toFixed(2)))].join(',')).join(' / ')}`);
    const bar = parsePath(partsOf('sort-alpha-ascending.svg', drawing(24, 'sort-alpha-ascending').src, 24).ds[1]);
    const bx0 = bar[0].args[0], by = bar[0].args[1], bx1 = bar[1].args[0];
    const s24 = sa.filter((c) => c.name === 'sort-alpha-ascending' && c.master === 24);
    say(`  sort-alpha-ascending at 24: crossbar x ${bx0}-${bx1} at y ${by}; the legs cross that line at x ${s24.map((c) => r3(c.x < (bx0 + bx1) / 2 ? c.x + c.overshoot : c.x - c.overshoot)).sort((a, b) => a - b).join(' and ')}`);
    const cuts = READ().filter((r) => /^sort-alpha/.test(r.concept) && r.style === 'filled' && r.kind === 'facing-cut');
    say(`  filled cuts: narrowest at 16 ${Math.min(...cuts.filter((r) => r.master === 16).map((r) => r.width))}; airMin per master ${MASTER_LIST.map((m) => { const v = cuts.filter((r) => r.master === m).map((r) => r.airMin); return `${m}: ${Math.min(...v)}-${Math.max(...v)}`; }).join(' · ')}`);
    const dark = READ().filter((r) => /^sort-alpha/.test(r.concept) && r.airMin >= 0.7);
    say(`  sort-alpha spans reading 0.70 or darker: ${dark.length}, airMin ${Math.min(...dark.map((r) => r.airMin))}-${Math.max(...dark.map((r) => r.airMin))} (${[...new Set(dark.map((r) => `${r.master} ${r.style} ${r.kind}`))].join(', ')})`);
    const plug = T.filter((c) => c.concept === 'plug-6' && c.cls === 'T-through');
    say(`- #22: plug-6 prong overshoot per master ${MASTER_LIST.map((m) => plug.filter((c) => c.master === m).map((c) => c.overshoot).sort((a, b) => b - a).join(',')).join(' / ')}`);
    const clip = T.filter((c) => c.concept === 'clipboard-2');
    say(`- #23: clipboard-2 per master ${MASTER_LIST.map((m) => `${m}: ${[...new Set(clip.filter((c) => c.master === m).map((c) => `${c.cls} ${c.overshoot}`))].join(',')}`).join(' · ')}`);
  };

  S.eye = () => {
    head('What only Maruti\'s eye can settle — the measured ladder it quotes (airprobe.mjs)');
    const f = floorsOf(SW(), 'parallel-run', 16), c = floorsOf(SW(), 'facing-caps', 16);
    say(`- worst-phase lightest pixel, parallel run: ${[1, 1.25, 1.5, 1.75, 1.875].map((g) => `${g} → ${f.worst(g) === 0 ? 'clear' : f.worst(g)}`).join(', ')}`);
    say(`- the same ladder for two round caps tip to tip: ${SWEEP_GAPS.filter((g) => g >= 0.875 && g <= 2).map((g) => `${g} → ${c.worst(g)}`).join(', ')}`);
    // "matched on darkest pixel": the narrowest cap-to-cap gap whose darkest pixel is no darker than the run's at the 1.5 floor
    const target = f.worst(1.5), cap = SWEEP_GAPS.find((g) => c.worst(g) <= target);
    say(`- matched on darkest pixel to the parallel run at the 1.5 floor (${target}): a cap-to-cap gap of ${cap} (${c.worst(cap)}) — ${r3(1.5 - cap)} narrower`);
  };

  return S;
}

export const SECTION_ORDER = ['head', 'scope', 's0', 's1', 's2', 's3a', 's3b', 's3c', 's3d', 's4a', 's4b', 's4c', 's4d', 's4e', 's4f', 's4g', 's4h', 's4i',
  's5', 's6a', 's6b', 's6c', 'p2', 's7', 's8', 's9', 's10', 's11', 's12', 'judged', 'eye'];

const USAGE = `usage: node tools/audit/air-probe.mjs <pin-dir> [section …]
  <pin-dir> holds src/icons/{24,20,16} (git archive 5933041)
  sections: ${SECTION_ORDER.join(' ')}`;

export async function main(argv = process.argv.slice(2)) {
  const pos = argv.filter((a) => !a.startsWith('--'));
  const pin = pos[0] ? resolve(pos[0]) : null;
  const ok = pin && existsSync(pin) && statSync(pin).isDirectory() && MASTER_LIST.every((m) => existsSync(join(pin, 'src/icons', String(m))));
  if (!ok) { console.error(USAGE); return 2; }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !SECTION_ORDER.includes(s));
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${USAGE}`); return 2; }
  const S = makeSections(pin);
  say(`# air-probe — docs/audit/findings-air.md, reprinted from ${pin}`);
  for (const s of wanted.length ? SECTION_ORDER.filter((x) => wanted.includes(x)) : SECTION_ORDER) await S[s]();
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = await main();
