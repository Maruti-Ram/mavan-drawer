#!/usr/bin/env node
// tools/audit/nucleo-probe.mjs — every measured figure in docs/audit/references-nucleo.md
// (wave 2, card 2.3: Nucleo, grid discipline across sibling families), printed again.
// AUDIT ONLY — imported by nothing; reads the pin and Nucleo's local library, writes nothing
// (stdout only; `--cache <dir>` writes only into a directory the user names).
//
// Usage:
//   node tools/audit/nucleo-probe.mjs <pin-dir> [section …] [--cache <dir>] [--refs <dir>]
//   <pin-dir> = `git archive 5933041 | tar -x -C <dir>` (our side reads <pin-dir>/src/icons/{24,20,16}).
//   No section = all. An unknown section, or a pin without src/icons, exits 2.
//   Nucleo is read from its desktop library through tools/audit/refs/nucleo.mjs (NUCLEO_DIR =
//   $HOME/Library/Application Support/Nucleo/icons: data.sqlite3 + sets/<set>/<id>.svg) — the same
//   reader the card used. `--refs` (default: the repo's research/references) is where the card's
//   reference records live; this probe reads nothing from it (the card's 57.5% row is recomputed
//   with nucleo.mjs coreVsUi() instead of read from core-vs-ui-all.json), so the flag only exists
//   for the shared CLI shape.
//
// Sections (the document § each one backs):
//   short    the short answer, items 1–8
//   sample   "Sample, and why this one" (both tables) + Instruments (caps/mitres, keyline n) + Declared limits
//   s1       §1 stroke, keyline and margin (table, live area, what the eye sees, the stroke, the grid)
//   s2       §2 corner radius (table, square-warning check, three more readings)
//   s3       §3 air (floor table, same-concept table, glyph dot-to-stem spot check)
//   s4.1     §4.1 ratios to the grid
//   s4.2     §4.2 the ink itself — held, nudged, gone
//   s4.3     §4.3 the repo's "redrawn" verdict
//   s4.4     §4.4 part by part
//   s4.5     §4.5 what the redraws look like (caps/joins, solid parts, mean parts)
//   s4.6     §4.6 detail by grid
//   s5       §5 held / scaled / let go (the two lists)
//   s6       §6 findings K1–K5 and Kind 1
//   s7       §7 eye questions (the figures they quote)
//   s8       §8 independent re-derivations (stroke-width regex; quarter-turn corner radius, a JS port of
//            the card's svgpathtools reading)
//
// The card's own scripts (research/references/nucleo/card-2.3/, gitignored) are folded in here:
//   census row       nuc_census.mjs / our_census.mjs   → summarise()
//   distinct drawings nuc_tabA.py (drop repeats by family · grid · klass · name · signature)
//   §1               nuc_final_tables.py, ours_tables.py, inline whole-pixel and live-area reads
//   §2 / §3 / §4.6   nuc_tabD.py, nuc_final_tables2.py, nuc_tabE2.py, inline same-concept ratios
//   §4.2             nuc_ink.mjs (solid parts included — the final, post-review run) + chain_tab.py, ink_an.py
//   §4.3             nuc_verdicts.mjs (every third concept for Core) + nucleo.mjs coreVsUi() for Core 24 → UI 18
//   §4.4             nuc_pairs.mjs + nuc_pairs_an.py + the inline kind/category read
//   §3 spot check    nuc_dotgap.mjs, ours_dotgap.mjs
//   §8               the inline regex read; nuc_radius_indep.py (ported)
//
// Instruments: tools/audit/refs/nucleo.mjs (openDb, selectRows, extractRecord, readSvg, measure,
// normalisePath, sampleSegs, chamfer, fitSimilarity, compareRecords, coreVsUi), tools/audit/radii.mjs
// (cornersOf), tools/geometry.mjs (parsePath, for the §8 port).
//
// geometry.mjs samplePath / bbox read C/S/Q by their control points (closing check, 2026-10-09): not on this path —
// the probe imports only geometry.mjs parsePath (a tokenizer); every curve is evaluated as a curve (refs/nucleo.mjs
// sampleSegs and bboxOf, angles.mjs pointOn under radii.mjs cornersOf). Proved by the "curves are read as curves" test.
// Known instrument defects (plans/set-and-rules-audit.md): none of the listed ones is on this path —
// no raster.mjs, pixelgrid.mjs, figma.mjs, congruence.mjs or build.mjs boxes are used. The ink box is
// nucleo.mjs's analytic path box grown by half the stroke (a lower bound for square caps and mitres,
// as the document's own Instruments row says); geometry.mjs bbox() is not used.
//
// Statistics are numpy's / pandas': percentiles interpolate linearly (np.percentile), `round(2)` is
// round-half-even (np.round), a mode is pandas' smallest most-frequent value.
//
// Run time on this Mac (node 24, measured 2026-10-08 while other agents loaded the machine): census ~1 min,
// ink chains ~10 min, verdicts ~17 min, part-by-part ~33 min — a full run from nothing ~1 h. Sections that need
// only the census (s1 s2 s3 s4.1 s4.5 s4.6 s8) take ~1 min. `--cache <dir>` keeps the collections as JSON in a
// directory you name (never a default path); a cached full run takes ~2 s. Each cache file is stamped with a
// digest of the pin's outline drawings and of the Nucleo library (database size and modification time); a cache
// made from another pin or library, or by another version of the probe, is refused (exit 2).

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as N from './refs/nucleo.mjs';
import { cornersOf } from './radii.mjs';
import { parsePath } from '../geometry.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const { normalisePath, sampleSegs, readSvg, measure, chamfer, fitSimilarity } = N;

// ═══════════════════════════════════════════════════════════════════════════
// numpy / pandas semantics
// ═══════════════════════════════════════════════════════════════════════════

/** np.percentile, linear interpolation; NaN dropped (np.nanpercentile). */
export function percentile(arr, p) {
  const a = arr.filter((v) => v === v && v != null).sort((x, y) => x - y);
  if (!a.length) return NaN;
  const i = ((a.length - 1) * p) / 100, lo = Math.floor(i), hi = Math.ceil(i);
  return a[lo] + (a[hi] - a[lo]) * (i - lo);
}
export const median = (a) => percentile(a, 50);
export const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
export const share = (a, f) => (a.length ? a.filter(f).length / a.length : NaN);
/** round half to even, like numpy's rint. */
export function rint(x) {
  const f = Math.floor(x), d = x - f;
  if (d > 0.5) return f + 1;
  if (d < 0.5) return f;
  return f % 2 === 0 ? f : f + 1;
}
/** np.round(x, dp) = rint(x · 10^dp) / 10^dp. */
export const npRound = (x, dp = 0) => { const k = 10 ** dp; return rint(x * k) / k; };
/** Python's f'{x:.{dp}f}' (correctly rounded; an exact binary tie goes to even). */
export function fx(x, dp = 0) {
  if (x == null || !Number.isFinite(x)) return String(x);
  const exact = Math.abs(x).toFixed(Math.min(100, dp + 40));       // the binary value's exact decimal expansion
  const tail = exact.slice(exact.indexOf('.') + 1 + dp);
  if (!/^50*$/.test(tail)) return x.toFixed(dp);                    // not an exact tie: toFixed is correctly rounded
  const k = 10 ** dp, y = Math.abs(x) * k, lo = Math.floor(y), even = lo % 2 === 0 ? lo : lo + 1;
  return (Math.sign(x) * even / k).toFixed(dp);                    // an exact tie goes to even, as python's format does
}
/** thousands separator, as the document writes counts (3,185). */
export const nf = (n) => Number(n).toLocaleString('en-US');
/** pandas Series.mode().iloc[0]: the smallest of the most frequent values. */
export function modeOf(vals) {
  const c = new Map();
  for (const v of vals) if (v === v && v != null) c.set(v, (c.get(v) || 0) + 1);
  let best = null;
  for (const [k, n] of c) if (!best || n > best[1] || (n === best[1] && k < best[0])) best = [k, n];
  return best ? best[0] : null;
}
/** value_counts(): [[value, count]] by count, descending; ties by value ascending (deterministic). */
export function valueCounts(vals) {
  const c = new Map();
  for (const v of vals) c.set(v, (c.get(v) || 0) + 1);
  return [...c].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
}
/** How many of the commonest values it takes to cover `cover` of the whole (nuc_final_tables2: (cum < cover).sum() + 1). */
export function radiiToCover(vals, cover = 0.9) {
  const vc = valueCounts(vals), tot = vals.length;
  let cum = 0, k = 0;
  for (const [, n] of vc) { cum += n; if (cum / tot < cover) k++; }
  return k + 1;
}
const pct = (x, dp = 0) => `${fx(100 * x, dp)}%`;

// ═══════════════════════════════════════════════════════════════════════════
// one drawing → one census row  (nuc_census.mjs / our_census.mjs)
// ═══════════════════════════════════════════════════════════════════════════

function polyBox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { x0, y0, x1, y1 };
}
function ptSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  let t = L ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function polyDist(A, B) {
  let best = Infinity;
  for (const [px, py] of A) {
    for (let i = 1; i < B.length; i++) {
      const d = ptSeg(px, py, B[i - 1][0], B[i - 1][1], B[i][0], B[i][1]);
      if (d < best) { best = d; if (best < 1e-9) return 0; }
    }
    if (B.length === 1) best = Math.min(best, Math.hypot(px - B[0][0], py - B[0][1]));
  }
  return best;
}

/**
 * The card's sampling steps and the container corner's leg floor, as fractions of the canvas side (side ÷ N):
 * air pairs 48, ink 240, parts 200, the glyph dot test 400; a container corner's straight legs at least side ÷ 24.
 */
export const STEP = { air: 48, ink: 240, parts: 200, dot: 400 };
/** The grids each family is compared at, and our three masters (largest first; OUR_UP smallest first). */
export const CORE_GRIDS = [24, 32, 48], UI_GRIDS = [12, 18], OUR_MASTERS = [24, 20, 16], OUR_UP = [16, 20, 24];
export const MIN_LEG = 24;

/**
 * Air between distinct stroked sub-paths (nuc_census gapsOf): every pair of sub-paths of stroked
 * parts, centreline distance d, mean stroke w; pairs that touch or cross (d ≤ 0.3 w) are joins and
 * dropped. → [{d, w, same}] (same = the two sub-paths belong to one element).
 */
export function gapsOf(rec, side) {
  const step = side / STEP.air;
  const polys = [];
  rec.paths.forEach((p, pi) => {
    if (!(p.paint === 'stroke' || p.paint === 'both') || !p.stroke) return;
    for (const sub of sampleSegs(normalisePath(p.d), step)) {
      if (sub.pts.length < 1) continue;
      polys.push({ pts: sub.pts, w: p.stroke.weight, box: polyBox(sub.pts), part: pi });
    }
  });
  const gaps = [];
  for (let i = 0; i < polys.length; i++) for (let j = i + 1; j < polys.length; j++) {
    const a = polys[i], b = polys[j];
    const reach = (a.w + b.w) / 2 + side;
    if (a.box.x0 - reach > b.box.x1 || b.box.x0 - reach > a.box.x1 || a.box.y0 - reach > b.box.y1 || b.box.y0 - reach > a.box.y1) continue;
    const d = Math.min(polyDist(a.pts, b.pts), polyDist(b.pts, a.pts));
    const w = (a.w + b.w) / 2;
    if (d <= 0.3 * w) continue;
    gaps.push({ d, w, same: a.part === b.part });
  }
  return gaps;
}

/** Corner role, the way radii.mjs roleOf does it, against the drawing's ink box (nuc_census roleOf). */
export function roleOf(c, ink, minLeg) {
  const s = c.subInfo, b = s.bbox;
  const big = (b.x1 - b.x0) >= 0.6 * (ink.x1 - ink.x0) && (b.y1 - b.y0) >= 0.6 * (ink.y1 - ink.y0);
  const encloses = s.closed || s.fill >= 0.7;
  const legsLong = Math.min(...c.legs) >= minLeg;
  if (c.tangentError > 5) return 'ambiguous';
  if (big && encloses && c.convex && legsLong) return 'container';
  if (!encloses && !s.closed && s.corners <= 3) return 'bend';
  if ((!big && encloses) || (big && encloses && !c.convex)) return 'detail';
  return 'ambiguous';
}
const r3 = (v) => Math.round(v * 1000) / 1000;

/**
 * The per-drawing summary the card's census wrote, one object per drawing: stroke basis and own
 * stroke, modal cap/join, paint counts, parts, sub-paths, segment counts, ink box, margins, the
 * largest full circle's radius (keyline probe), corners [radius, role, kind, |turn|, convex, closed]
 * and air pairs [d, w, same].
 */
export function summarise(rec, { gaps = true } = {}) {
  const [W, H] = rec.canvas, side = Math.min(W, H);
  const stroke = rec.strokeBasis?.value ?? null;
  const paint = { stroke: 0, fill: 0, both: 0, none: 0 };
  let subs = 0, L = 0, C = 0, Q = 0, A = 0, Z = 0;
  for (const p of rec.paths) {
    paint[p.paint] = (paint[p.paint] || 0) + 1;
    for (const s of normalisePath(p.d)) {
      if (s[0] === 'M') subs++; else if (s[0] === 'L') L++; else if (s[0] === 'C') C++; else if (s[0] === 'Q') Q++; else if (s[0] === 'A') A++; else if (s[0] === 'Z') Z++;
    }
  }
  const ink = rec.measure.ink;
  const box = ink ? { x0: ink.x.abs, y0: ink.y.abs, x1: ink.x.abs + ink.w.abs, y1: ink.y.abs + ink.h.abs } : null;
  const m = rec.measure.margins;
  let circleR = 0;
  for (const e of rec.measure.radii) {
    if ((e.kind === 'circle' && e.r.abs > circleR) || (e.kind === 'arc' && e.turnDeg >= 179 && e.n >= 2 && e.circular && e.r.abs > circleR)) circleR = e.r.abs;
  }
  const stroked = rec.paths.filter((p) => p.stroke);
  const corners = [];
  if (stroked.length && box) {
    const minLeg = side / MIN_LEG;
    for (const p of stroked) {
      let cs = [];
      try { cs = cornersOf(p.d); } catch { /* an unreadable path has no corners */ }
      for (const c of cs) corners.push([r3(c.radius), roleOf(c, box, minLeg), c.kind, Math.round(Math.abs(c.turn)), c.convex ? 1 : 0, c.subInfo.closed ? 1 : 0]);
    }
  }
  const g = gaps && stroked.length ? gapsOf(rec, side).map((x) => [r3(x.d), r3(x.w), x.same ? 1 : 0]) : null;
  return {
    W, H, stroke, own: rec.strokeWidth ?? stroke ?? 0, cap: rec.strokeCap ?? null, join: rec.strokeJoin ?? null,
    paint, parts: rec.paths.length, subs, seg: { L, C, Q, A, Z }, box,
    margins: m ? { l: m.left.abs, t: m.top.abs, r: m.right.abs, b: m.bottom.abs } : null,
    circleR: circleR || null, corners, gaps: g,
  };
}

/** A census row's identity for "the same drawing filed twice" (nuc_tabA: box, segments, parts, sub-paths). */
export const signature = (row) => JSON.stringify([row.box, row.seg && { A: row.seg.A, C: row.seg.C, L: row.seg.L, Q: row.seg.Q, Z: row.seg.Z }, row.parts, row.subs]);

/** Drop repeats: keep the first row per (family, grid, klass, name, signature). */
export function distinctRows(rows) {
  const seen = new Set(), out = [];
  for (const r of rows) {
    const k = `${r.fam}|${r.grid}|${r.klass}|${r.name}|${signature(r)}`;
    if (seen.has(k)) continue;
    seen.add(k); out.push(r);
  }
  return out;
}
/** Repeated keys: how many (family, grid, klass, name) keys hold more than one row, and how many of those are one drawing. */
export function repeatCensus(rows) {
  const by = new Map();
  for (const r of rows) {
    const k = `${r.fam}|${r.grid}|${r.klass}|${r.name}`;
    if (!by.has(k)) by.set(k, { n: 0, sigs: new Set() });
    const o = by.get(k); o.n++; o.sigs.add(signature(r));
  }
  let multi = 0, same = 0;
  for (const o of by.values()) if (o.n > 1) { multi++; if (o.sigs.size === 1) same++; }
  return { keys: by.size, multi, same };
}

// ═══════════════════════════════════════════════════════════════════════════
// one concept at two grids — the ink itself  (nuc_ink.mjs, with solid parts: the final run)
// ═══════════════════════════════════════════════════════════════════════════

function nnIndex(pts, cell) {
  const g = new Map();
  for (const p of pts) { const k = `${Math.floor(p[0] / cell)},${Math.floor(p[1] / cell)}`; (g.get(k) || g.set(k, []).get(k)).push(p); }
  return (x, y) => {
    let best = Infinity; const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
    for (let ring = 0; ring < 60; ring++) {
      for (let i = cx - ring; i <= cx + ring; i++) for (let j = cy - ring; j <= cy + ring; j++) {
        if (Math.max(Math.abs(i - cx), Math.abs(j - cy)) !== ring) continue;
        for (const q of g.get(`${i},${j}`) || []) { const d = Math.hypot(q[0] - x, q[1] - y); if (d < best) best = d; }
      }
      if (best <= ring * cell) break;
    }
    return best;
  };
}
/** Ink sample in unit canvas: the centreline of every stroked part and the outline of every solid part. */
export function inkOf(rec) {
  const side = Math.min(...rec.canvas), step = side / STEP.ink;
  const pts = []; let len = 0;
  for (const p of rec.paths) {
    if (!p.stroke && p.paint !== 'fill') continue;
    for (const sub of sampleSegs(normalisePath(p.d), step)) for (let k = 0; k < sub.pts.length; k++) {
      pts.push([sub.pts[k][0] / side, sub.pts[k][1] / side]);
      if (k) len += Math.hypot(sub.pts[k][0] - sub.pts[k - 1][0], sub.pts[k][1] - sub.pts[k - 1][1]) / side;
    }
  }
  return { pts, len, side, stroke: (rec.strokeBasis?.value ?? 0) / side };
}
/** Lengths of contiguous flagged stretches, in sampling order. */
export function runs(flags, pts) {
  const out = []; let cur = 0;
  for (let i = 0; i < flags.length; i++) {
    if (flags[i]) { if (i > 0 && flags[i - 1]) cur += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); else cur = 0; }
    else if (cur > 0 || (i > 0 && flags[i - 1])) { out.push(cur); cur = 0; }
  }
  if (flags.length && flags[flags.length - 1]) out.push(cur);
  return out;
}
/**
 * Ink bands between drawing A and drawing B: each sampled point is held (≤0.25 stroke from the
 * other drawing's ink), nudged (≤1) or gone (>1); one stroke = the SMALLER grid's (the larger
 * share of the canvas). Also the stretches that are gone (in strokes) and the best uniform fit of
 * what is held (B onto A).
 */
export function inkCompare(ra, rb) {
  const a = inkOf(ra), b = inkOf(rb);
  if (!a.pts.length || !b.pts.length || !a.stroke || !b.stroke) return null;
  const S = Math.max(a.stroke, b.stroke);
  const nnB = nnIndex(b.pts, 0.02), nnA = nnIndex(a.pts, 0.02);
  const dA = a.pts.map((p) => nnB(p[0], p[1])), dB = b.pts.map((p) => nnA(p[0], p[1]));
  const band = (d) => {
    const n = d.length; let h = 0, m = 0, g = 0;
    for (const x of d) { if (x <= 0.25 * S) h++; else if (x <= 1.0 * S) m++; else g++; }
    return { held: h / n, nudged: m / n, gone: g / n };
  };
  const goneRunsA = runs(dA.map((x) => x > S), a.pts).filter((x) => x > 0).map((x) => +(x / S).toFixed(1));
  const goneRunsB = runs(dB.map((x) => x > S), b.pts).filter((x) => x > 0).map((x) => +(x / S).toFixed(1));
  const mA = a.pts.filter((_, i) => dA[i] <= S), mB = b.pts.filter((_, i) => dB[i] <= S);
  let fit = null;
  if (mA.length > 20 && mB.length > 20) { const f = fitSimilarity(mA, mB); if (f) fit = { s: +f.s.toFixed(4) }; }
  return { A: band(dA), B: band(dB), goneRunsA, goneRunsB, fit };
}

// ═══════════════════════════════════════════════════════════════════════════
// part by part  (nuc_pairs.mjs)
// ═══════════════════════════════════════════════════════════════════════════

export function partsOf(rec) {
  const side = Math.min(...rec.canvas);
  const stroke = rec.strokeBasis?.value;
  const parts = [];
  rec.paths.forEach((p, i) => {
    if (p.opacity === 0) return;
    const pts = []; let len = 0, closed = false;
    for (const s of sampleSegs(normalisePath(p.d), side / STEP.parts)) {
      for (let k = 0; k < s.pts.length; k++) {
        pts.push([s.pts[k][0] / side, s.pts[k][1] / side]);
        if (k) len += Math.hypot(s.pts[k][0] - s.pts[k - 1][0], s.pts[k][1] - s.pts[k - 1][1]) / side;
      }
      closed = closed || s.closed;
    }
    if (!pts.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, cx = 0, cy = 0;
    for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); cx += x; cy += y; }
    parts.push({ i, prim: p.prim, pts, len, closed, box: { x0, y0, x1, y1 }, c: [cx / pts.length, cy / pts.length] });
  });
  return { side, stroke: stroke ? stroke / side : null, parts };
}
/** Stage A: same place (identity in unit canvas, mean ≤0.75 and max ≤1.5 strokes); stage B: same shape after a uniform fit. */
export function matchParts(PA, PB, S) {
  const pairs = [], usedA = new Set(), usedB = new Set();
  const cand = [];
  PA.parts.forEach((a, i) => PB.parts.forEach((b, j) => { const c = chamfer(a.pts, b.pts, 0.02); cand.push({ i, j, mean: c.mean, max: c.max }); }));
  cand.sort((x, y) => x.mean - y.mean);
  for (const c of cand) {
    if (usedA.has(c.i) || usedB.has(c.j)) continue;
    if (c.mean > 0.75 * S || c.max > 1.5 * S) continue;
    usedA.add(c.i); usedB.add(c.j);
    pairs.push({ stage: 'place', i: c.i, j: c.j, mean: c.mean, max: c.max });
  }
  const cand2 = [];
  PA.parts.forEach((a, i) => {
    if (usedA.has(i)) return;
    PB.parts.forEach((b, j) => {
      if (usedB.has(j) || a.closed !== b.closed || a.pts.length < 2 || b.pts.length < 2) return;
      const f = fitSimilarity(a.pts, b.pts);
      if (f && f.s > 0.3 && f.s < 3.3) cand2.push({ i, j, mean: f.c.mean, max: f.c.max });
    });
  });
  cand2.sort((x, y) => x.max - y.max);
  for (const c of cand2) {
    if (usedA.has(c.i) || usedB.has(c.j)) continue;
    if (c.max > 0.5 * S || c.mean > 0.25 * S) continue;
    usedA.add(c.i); usedB.add(c.j);
    pairs.push({ stage: 'shape', i: c.i, j: c.j, mean: c.mean, max: c.max });
  }
  return { pairs, dropped: PA.parts.map((_, i) => i).filter((i) => !usedA.has(i)), added: PB.parts.map((_, j) => j).filter((j) => !usedB.has(j)) };
}
export function partsCompare(ra, rb) {
  const PA = partsOf(ra), PB = partsOf(rb);
  if (!PA.stroke || !PB.stroke) return null;
  const S = (PA.stroke + PB.stroke) / 2;
  const m = matchParts(PA, PB, S);
  const matched = m.pairs.map((p) => {
    const a = PA.parts[p.i], b = PB.parts[p.j];
    const da = Math.hypot(a.box.x1 - a.box.x0, a.box.y1 - a.box.y0), db = Math.hypot(b.box.x1 - b.box.x0, b.box.y1 - b.box.y0);
    return { stage: p.stage, maxS: +(p.max / S).toFixed(3), dC: +(Math.hypot(a.c[0] - b.c[0], a.c[1] - b.c[1]) / S).toFixed(3), size: da > 1e-9 ? +(db / da).toFixed(3) : null };
  });
  const kind = (q) => ({ len: +(q.len / S).toFixed(2), closed: q.closed ? 1 : 0 });
  return { nA: PA.parts.length, nB: PB.parts.length, dropped: m.dropped.map((i) => kind(PA.parts[i])), added: m.added.map((j) => kind(PB.parts[j])), matched };
}
/** The category of a whole pair (nuc_pairs_an / the inline read). */
export function pairCategory(p) {
  if (p.dropped.length || p.added.length) return 'dropped/added';
  const mx = Math.max(0, ...p.matched.map((m) => m.maxS));
  if (p.matched.some((m) => m.stage === 'shape')) return 'moved/resized';
  if (mx <= 0.1) return 'pure';
  if (mx <= 1.0) return 'nudged';
  return 'reshaped';
}
/** What an unmatched part is: an open line (≥2 strokes long), a dot (<2 strokes) or a closed shape. */
export const partKind = (d) => (!d.closed && d.len >= 2 ? 'open line' : d.len < 2 ? 'dot' : 'closed shape');

// ═══════════════════════════════════════════════════════════════════════════
// the glyph dot-to-stem air (nuc_dotgap.mjs, ours_dotgap.mjs)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dot-to-stem air: a dot is a part whose longest side plus its stroke is at most 1.7 strokes; the
 * air is the centre-to-other-part distance minus the dot's outer radius and the other part's half
 * stroke; the smallest over every dot and non-dot part. `filledBody`: a filled, unstroked dot
 * measures its radius as half its extent (the Nucleo script); our files have no such dot.
 * Returns null when there is no dot, or the result is under 0.2 or over 6 (not a stem neighbour).
 */
export function dotGap(rec, stroke, { nucleo = true } = {}) {
  const side = Math.min(...rec.canvas);
  const parts = rec.paths.map((p) => {
    const pts = sampleSegs(normalisePath(p.d), side / STEP.dot).flatMap((s) => s.pts);
    if (!pts.length) return null;
    const b = polyBox(pts);
    const diag = Math.max(b.x1 - b.x0, b.y1 - b.y0), w = p.stroke?.weight ?? 0;
    const filled = p.paint === 'fill' || p.paint === 'both';
    const outer = nucleo && filled && !p.stroke ? diag / 2 : diag / 2 + w / 2;
    return { pts, diag, w, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, outer, stroked: !!p.stroke };
  }).filter(Boolean);
  const dots = parts.filter((p) => p.diag + (p.stroked ? p.w : 0) <= 1.7 * stroke);
  const gaps = [];
  for (const d of dots) for (const o of parts) {
    if (o === d || dots.includes(o)) continue;
    let best = 1e9;
    for (let k = 1; k < o.pts.length; k++) best = Math.min(best, ptSeg(d.cx, d.cy, o.pts[k - 1][0], o.pts[k - 1][1], o.pts[k][0], o.pts[k][1]));
    if (nucleo && o.pts.length === 1) best = Math.hypot(d.cx - o.pts[0][0], d.cy - o.pts[0][1]);
    const g = best - d.outer - (o.stroked ? o.w / 2 : 0);
    if (nucleo || (g > 0.2 && g < 6)) gaps.push(g);
  }
  if (!gaps.length) return null;
  const g = Math.min(...gaps);
  if (g < 0.2 || g > 6) return null;
  return +g.toFixed(3);
}

// ═══════════════════════════════════════════════════════════════════════════
// §8: the quarter-turn corner reading (nuc_radius_indep.py, svgpathtools ported)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * svgpathtools' segment list for one `d`: Lines (L/H/V and a Z that closes a gap), CubicBeziers
 * (C/S), QuadraticBeziers (Q/T), Arcs — all sub-paths run together, as `list(parse_path(d))` does.
 */
export function svgptSegments(d) {
  const segs = [];
  let cx = 0, cy = 0, sx = 0, sy = 0, lastC = null, lastQ = null;
  for (const { cmd, args } of parsePath(d)) {
    const up = cmd.toUpperCase(), rel = cmd !== up;
    const n = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }[up];
    if (up === 'Z') {
      if (Math.hypot(cx - sx, cy - sy) > 0) segs.push({ t: 'L', p0: [cx, cy], p1: [sx, sy] });
      cx = sx; cy = sy; lastC = lastQ = null; continue;
    }
    for (let k = 0, first = true; k + n <= args.length; k += n, first = false) {
      const a = args.slice(k, k + n);
      const X = (v) => (rel ? cx + v : v), Y = (v) => (rel ? cy + v : v);
      if (up === 'M') {
        const x = X(a[0]), y = Y(a[1]);
        if (first) { cx = sx = x; cy = sy = y; } else { segs.push({ t: 'L', p0: [cx, cy], p1: [x, y] }); cx = x; cy = y; }
        lastC = lastQ = null;
      } else if (up === 'L' || up === 'H' || up === 'V') {
        const x = up === 'V' ? cx : X(a[0]), y = up === 'H' ? cy : up === 'V' ? Y(a[0]) : Y(a[1]);
        segs.push({ t: 'L', p0: [cx, cy], p1: [x, y] }); cx = x; cy = y; lastC = lastQ = null;
      } else if (up === 'C' || up === 'S') {
        let c1;
        if (up === 'C') c1 = [X(a[0]), Y(a[1])];
        else c1 = lastC ? [2 * cx - lastC[0], 2 * cy - lastC[1]] : [cx, cy];
        const o = up === 'C' ? 2 : 0;
        const c2 = [X(a[o]), Y(a[o + 1])], p = [X(a[o + 2]), Y(a[o + 3])];
        segs.push({ t: 'C', p0: [cx, cy], c1, c2, p1: p }); lastC = c2; lastQ = null; cx = p[0]; cy = p[1];
      } else if (up === 'Q' || up === 'T') {
        let c;
        if (up === 'Q') c = [X(a[0]), Y(a[1])];
        else c = lastQ ? [2 * cx - lastQ[0], 2 * cy - lastQ[1]] : [cx, cy];
        const p = up === 'Q' ? [X(a[2]), Y(a[3])] : [X(a[0]), Y(a[1])];
        segs.push({ t: 'Q', p0: [cx, cy], c, p1: p }); lastQ = c; lastC = null; cx = p[0]; cy = p[1];
      } else if (up === 'A') {
        const p = [X(a[5]), Y(a[6])];
        segs.push({ t: 'A', p0: [cx, cy], rx: a[0], ry: a[1], phi: a[2], fa: a[3], fs: a[4], p1: p }); cx = p[0]; cy = p[1]; lastC = lastQ = null;
      }
    }
  }
  return segs;
}
const unitV = (v) => { const L = Math.hypot(v[0], v[1]); return L > 0 ? [v[0] / L, v[1] / L] : null; };
/** Unit tangents at t = 0 and t = 1 of a curve segment (svgpathtools unit_tangent; a vanishing control arm falls back to the next point). */
export function endTangents(s) {
  if (s.t === 'C') {
    const t0 = unitV([s.c1[0] - s.p0[0], s.c1[1] - s.p0[1]]) ?? unitV([s.c2[0] - s.p0[0], s.c2[1] - s.p0[1]]) ?? unitV([s.p1[0] - s.p0[0], s.p1[1] - s.p0[1]]);
    const t1 = unitV([s.p1[0] - s.c2[0], s.p1[1] - s.c2[1]]) ?? unitV([s.p1[0] - s.c1[0], s.p1[1] - s.c1[1]]) ?? unitV([s.p1[0] - s.p0[0], s.p1[1] - s.p0[1]]);
    return t0 && t1 ? [t0, t1] : null;
  }
  if (s.t === 'A') {
    const c = N.arcCenter(s.p0[0], s.p0[1], s.rx, s.ry, s.phi, s.fa, s.fs, s.p1[0], s.p1[1]);
    if (!c || !Number.isFinite(c.t1) || !Number.isFinite(c.dt)) return null;
    const rx = c.rx ?? s.rx, ry = c.ry ?? s.ry, sgn = c.dt >= 0 ? 1 : -1;
    const tan = (t) => { const v = [-rx * Math.sin(t) * sgn, ry * Math.cos(t) * sgn]; return unitV([c.cs * v[0] - c.sn * v[1], c.sn * v[0] + c.cs * v[1]]); };
    const t0 = tan(c.t1), t1 = tan(c.t1 + c.dt);
    return t0 && t1 ? [t0, t1] : null;
  }
  return null;
}
/** Quarter-turn curves between two straight lines, radius from the chord (chord ÷ √2), rounded to the quarter. */
export function quarterTurnRadii(d) {
  const segs = svgptSegments(d), out = [];
  for (let i = 1; i < segs.length - 1; i++) {
    const a = segs[i - 1], b = segs[i], c = segs[i + 1];
    if (a.t !== 'L' || c.t !== 'L' || (b.t !== 'C' && b.t !== 'A')) continue;
    const tt = endTangents(b);
    if (!tt) continue;
    const [t0, t1] = tt;
    const ang = Math.abs((Math.atan2(t0[0] * t1[1] - t0[1] * t1[0], t0[0] * t1[0] + t0[1] * t1[1]) * 180) / Math.PI);
    if (Math.abs(ang - 90) < 3) out.push(rint(Math.hypot(b.p1[0] - b.p0[0], b.p1[1] - b.p0[1]) / Math.SQRT2 * 4) / 4);
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════
// data — Nucleo's library and our pin
// ═══════════════════════════════════════════════════════════════════════════

const FAMILIES = ['Nucleo Core', 'Nucleo Micro Bold', 'Nucleo Pixel', 'Nucleo Sharp', 'Nucleo UI'];     // the census files' order (sorted names)
const famShort = (f) => f.replace('Nucleo ', '');

/** Our outline drawings as the card's census read them (first stroked path's weight = the stroke). */
export function ourRecord(text) {
  const sv = readSvg(text);
  const st = sv.paths.find((p) => p.stroke)?.stroke.weight ?? null;
  const rec = { canvas: sv.canvas, paths: sv.paths, strokeBasis: { value: st }, strokeWidth: st, meta: {} };
  rec.measure = measure(rec);
  return rec;
}
export function ourNames(pin, master = 24) {
  return fs.readdirSync(path.join(pin, 'src/icons', String(master))).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.slice(0, -4)).sort();
}
const ourText = (pin, m, name) => fs.readFileSync(path.join(pin, 'src/icons', String(m), `${name}.svg`), 'utf8');

/** Every drawing of the five families, summarised (the census). */
async function nucleoCensus(ctx) {
  const rows = [];
  for (const family of FAMILIES) {
    for (const row of N.selectRows(ctx.db, { families: [family] })) {
      let rec;
      try { rec = N.extractRecord(row, ctx); } catch { continue; }
      rows.push({ fam: famShort(rec.family), setId: row.set_id, set: row.set_title, grid: row.grid, klass: row.klass, name: row.name, effects: rec.meta?.effects ? 1 : 0, ...summarise(rec) });
    }
  }
  return rows;
}
function ourCensus(pin) {
  const rows = [];
  for (const m of OUR_MASTERS) for (const name of ourNames(pin, m)) {
    const text = ourText(pin, m, name);
    rows.push({ fam: 'Ours', grid: m, klass: 'outline', name, glyph: /<!--\s*glyph:/.test(text) ? 1 : 0, ...summarise(ourRecord(text)) });
  }
  return rows;
}
/** First outline row per name for one family and grid (nuc_ink / nuc_verdicts / nuc_pairs pick()). */
function pick(ctx, fam, grid, klass = 'outline') {
  const m = new Map();
  for (const r of N.selectRows(ctx.db, { families: [fam], grids: [grid], klasses: [klass] })) if (!m.has(r.name)) m.set(r.name, r);
  return m;
}
const CHAINS = [            // [label, A family, A grid, B family, B grid]; A is the first argument the card passed
  ['core24_core32', 'Nucleo Core', 24, 'Nucleo Core', 32],
  ['core32_core48', 'Nucleo Core', 32, 'Nucleo Core', 48],
  ['core24_core48', 'Nucleo Core', 24, 'Nucleo Core', 48],
  ['ui18_ui12', 'Nucleo UI', 18, 'Nucleo UI', 12],
  ['core24_ui18', 'Nucleo Core', 24, 'Nucleo UI', 18],
];
const OUR_CHAINS = [['ours24_20', 24, 20], ['ours20_16', 20, 16], ['ours24_16', 24, 16]];

async function inkChains(ctx, pin) {
  const out = {};
  for (const [label, fa, ga, fb, gb] of CHAINS) {
    const A = pick(ctx, fa, ga), B = pick(ctx, fb, gb), res = [];
    for (const name of [...A.keys()].filter((x) => B.has(x)).sort()) {
      const c = inkCompare(N.extractRecord(A.get(name), ctx), N.extractRecord(B.get(name), ctx));
      if (c) res.push({ name, ...c });
    }
    out[label] = res;
  }
  for (const [label, ga, gb] of OUR_CHAINS) {
    out[label] = [];
    for (const name of ourNames(pin, ga)) {
      const c = inkCompare(ourRecord(ourText(pin, ga, name)), ourRecord(ourText(pin, gb, name)));
      if (c) out[label].push({ name, ...c });
    }
  }
  return out;
}
async function verdictChains(ctx) {
  const run = (fa, ga, fb, gb, every) => {
    const A = pick(ctx, fa, ga), B = pick(ctx, fb, gb);
    const names = [...A.keys()].filter((x) => B.has(x)).sort().filter((_, i) => i % every === 0);
    const res = [];
    for (const name of names) {
      try {
        const c = N.compareRecords(N.extractRecord(A.get(name), ctx), N.extractRecord(B.get(name), ctx));
        res.push({ name, verdict: c.verdict, fit: c.bestFit.maxInStrokes });
      } catch { /* the card's run logged and skipped a failing pair */ }
    }
    return res;
  };
  const cross = (await N.coreVsUi({ essentialOnly: false })).map((x) => ({ name: x.name, verdict: x.verdict, fit: x.bestFit.maxInStrokes }));
  return { core24_ui18: cross, core24_core32: run('Nucleo Core', 24, 'Nucleo Core', 32, 3), core32_core48: run('Nucleo Core', 32, 'Nucleo Core', 48, 3), ui18_ui12: run('Nucleo UI', 18, 'Nucleo UI', 12, 1) };
}
async function partChains(ctx) {
  const out = {};
  for (const [label, fa, ga, fb, gb] of [['core24_ui18', 'Nucleo Core', 24, 'Nucleo UI', 18], ['ui18_ui12', 'Nucleo UI', 18, 'Nucleo UI', 12]]) {
    const A = pick(ctx, fa, ga), B = pick(ctx, fb, gb), res = [];
    for (const name of [...A.keys()].filter((x) => B.has(x)).sort()) {
      try { const c = partsCompare(N.extractRecord(A.get(name), ctx), N.extractRecord(B.get(name), ctx)); if (c) res.push({ name, ...c }); } catch { /* skipped, as the card's run did */ }
    }
    out[label] = res;
  }
  return out;
}
/** The glyph spot check: every exclamation / question / info outline drawing in the library, and our `glyph: dot` files. */
async function dotGaps(ctx, pin) {
  const rows = ctx.db.prepare(`SELECT i.id,i.set_id,i.klass,i.grid,i.name,i.tags,i.nucleo_tags,i.stroke_max,i.corner_custom,i.width,i.height,i.size,s.title AS set_title,s.group_id,g.title AS group_title,s.local AS set_local
    FROM icons i LEFT JOIN sets s ON s.id=i.set_id LEFT JOIN groups g ON g.id=s.group_id
    WHERE i.klass IN ('outline') AND (i.name LIKE '%circle-info%' OR i.name LIKE '%circle-help%' OR i.name LIKE '%square-warning%' OR i.name LIKE '%triangle-warning%' OR i.name='info' OR i.name='help' OR i.name LIKE 'circle-warning%' OR i.name LIKE 'octagon-warning%')`).all();
  const uniq = new Map();
  for (const row of rows) {
    let rec; try { rec = N.extractRecord(row, ctx); } catch { continue; }
    const stroke = rec.strokeBasis?.value; if (!stroke) continue;
    const g = dotGap(rec, stroke, { nucleo: true });
    if (g == null) continue;
    const key = `${row.name}|${row.grid}|${row.group_title || row.set_title}`;
    uniq.set(`${key}|${g}`, { name: row.name, fam: famShort(rec.family), grid: row.grid, stroke, gap: g });
  }
  const ours = [];
  for (const m of OUR_MASTERS) for (const name of ourNames(pin, m)) {
    const text = ourText(pin, m, name);
    if (!/glyph:\s*dot/.test(text)) continue;
    const rec = ourRecord(text);
    const g = dotGap(rec, rec.strokeBasis.value, { nucleo: false });
    if (g != null) ours.push({ name, fam: 'Ours', grid: m, stroke: rec.strokeBasis.value, gap: g });
  }
  return [...uniq.values(), ...ours];
}

// ═══════════════════════════════════════════════════════════════════════════
// collection — lazy, memoised; `--cache <dir>` keeps each collection as JSON
// ═══════════════════════════════════════════════════════════════════════════

export const CACHE_FORMAT = 'nucleo-probe/2';
/** A digest of what the probe reads from the pin: every src/icons/{24,20,16} outline file's name and content. */
export function pinDigest(pin) {
  const h = createHash('sha256');
  for (const m of OUR_MASTERS) for (const n of ourNames(pin, m)) h.update(`${m}/${n}\0`).update(fs.readFileSync(path.join(pin, 'src/icons', String(m), `${n}.svg`))).update('\0');
  return h.digest('hex');
}
/** A digest of the Nucleo library as read: the database file's size and modification time. */
export function libraryDigest() {
  const f = path.join(N.NUCLEO_DIR, 'data.sqlite3');
  if (!fs.existsSync(f)) return 'no-library';
  const st = fs.statSync(f);
  return `${st.size}|${Math.floor(st.mtimeMs)}`;
}
export class CacheMismatch extends Error {}
export function makeData(pin, { cacheDir = null } = {}) {
  const memo = {};
  let ctx = null;
  const db = async () => (ctx ??= { db: await N.openDb(), cache: new Map() });
  const stamp = cacheDir ? { format: CACHE_FORMAT, pin: pinDigest(pin), library: libraryDigest() } : null;
  const cached = async (key, build) => {
    if (memo[key]) return memo[key];
    const f = cacheDir ? path.join(cacheDir, `nucleo-probe-${key}.json`) : null;
    if (f && fs.existsSync(f)) {
      const c = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (c?.format !== stamp.format || c.pin !== stamp.pin || c.library !== stamp.library)
        throw new CacheMismatch(`cache ${f} was not made from this pin and Nucleo library (or by this version of the probe); name an empty --cache directory`);
      return (memo[key] = c.data);
    }
    const v = await build();
    if (f) { fs.mkdirSync(cacheDir, { recursive: true }); fs.writeFileSync(f, JSON.stringify({ ...stamp, data: v })); }
    return (memo[key] = v);
  };
  const d = {
    db,
    census: () => cached('census', async () => nucleoCensus(await db())),
    ours: () => cached('ours', async () => ourCensus(pin)),
    ink: () => cached('ink', async () => inkChains(await db(), pin)),
    verdicts: () => cached('verdicts', async () => verdictChains(await db())),
    parts: () => cached('parts', async () => partChains(await db())),
    dots: () => cached('dots', async () => dotGaps(await db(), pin)),
    dd: async () => (memo.dd ??= distinctRows(await d.census())),
  };
  return d;
}

// ═══════════════════════════════════════════════════════════════════════════
// readings shared by several sections
// ═══════════════════════════════════════════════════════════════════════════

const ext = (r) => Math.max(r.box.x1 - r.box.x0, r.box.y1 - r.box.y0);
const mmin = (r) => Math.min(r.margins.l, r.margins.t, r.margins.r, r.margins.b);
const sideOf = (r) => Math.min(r.W, r.H);
/** Every edge of the ink box on a whole pixel (within 0.02), as the card's inline read. */
export const land = (b) => [b.x0, b.y0, b.x1, b.y1].every((v) => Math.abs(v - rint(v)) < 0.02);
/** The tightest clear air of one drawing (≥0.5 px) and its stroke (the first pair's w), as nuc_final_tables2 floor_of. */
export function floorOf(gaps) {
  if (!gaps || !gaps.length) return null;
  const c = gaps.map((g) => g[0] - g[1]).filter((e) => e >= 0.5);
  return c.length ? { fl: Math.min(...c), w: gaps[0][1] } : null;
}
const floorPx = (r) => floorOf(r.gaps)?.fl ?? NaN;
/** Median centreline radius of a drawing's rounded container corners (the same-concept ratios). */
const cradOf = (r) => { const cs = r.corners.filter((c) => c[1] === 'container' && c[2] !== 'sharp').map((c) => c[0]); return cs.length ? median(cs) : NaN; };
const firstPerName = (rows) => { const m = new Map(); for (const r of rows) if (!m.has(r.name)) m.set(r.name, r); return m; };
/**
 * Every range or span the sections print reads its values here, one per named cell. With NUCLEO_PROBE_TRACE set, the cells,
 * their values as printed and the cells a wrong selection would add (with theirs) go to stderr; the tests check that each
 * range has two distinct named ends and that every cell left out falls outside it.
 */
const TRACE = !!process.env.NUCLEO_PROBE_TRACE;
export function cellsOf(site, cells, f, dp = 0, left = []) {
  const v = cells.map(f);
  if (TRACE) console.error(`TRACE ${JSON.stringify({ site, cells, printed: v.map((x) => fx(x, dp)), left: left.map((c) => [c, fx(f(c), dp)]) })}`);
  return v;
}
/** "lo – hi%" over values already in the unit (each rounded as printed); one value when they agree. */
const rng = (vals, dp = 0, unit = '%') => { const a = vals.map((v) => Number(fx(v, dp))); const lo = Math.min(...a), hi = Math.max(...a); return lo === hi ? `${fx(lo, dp)}${unit}` : `${fx(lo, dp)} – ${fx(hi, dp)}${unit}`; };

/** The cells the sections quote by name: Core's three grids, UI's two, our three masters, the six one-radius cells. */
export const CORE_KEYS = ['Core 24', 'Core 32', 'Core 48'], UI_KEYS = ['UI 18', 'UI 12'], OUR_KEYS = ['Ours 24', 'Ours 20', 'Ours 16'];
export const SIX_KEYS = [...CORE_KEYS, ...UI_KEYS, 'Micro Bold 20'];
const S1_ROWS = [['Core', 24, ['outline']], ['Core', 32, ['outline']], ['Core', 48, ['outline']], ['UI', 18, ['outline']], ['UI', 12, ['outline']], ['Micro Bold', 20, ['glyph']], ['Sharp', 24, ['outline']], ['Pixel', 24, ['outline']]];
/** The eight Nucleo cells, as the tables name them. */
export const NUC_KEYS = S1_ROWS.map(([f, g]) => `${f} ${g}`);
const OUR_CHAIN_KEYS = OUR_CHAINS.map(([k]) => k);

/** §1's row for one family and grid (nuc_final_tables.py). */
export function strokeRow(x, side) {
  const own = x.filter((r) => r.own > 0).map((r) => r.own);
  const sm = modeOf(own), sh = share(own, (v) => npRound(v, 3) === sm);
  const circ = x.filter((r) => r.circleR != null).map((r) => 2 * r.circleR + (r.stroke ?? 0)).filter((v) => v >= 0.6 * side);
  const circR = circ.map((v) => npRound(v, 2));
  const kl = circ.length ? modeOf(circR) : NaN, kn = circR.filter((v) => v === kl).length;
  const mm = x.map((r) => npRound(mmin(r), 2)), mmode = modeOf(mm);
  const e = x.map(ext);
  return {
    n: x.length, stroke: sm, strokeShare: sh, strokePctCanvas: (100 * sm) / side, kl, kn,
    strokePctKeyline: (100 * sm) / kl, keylinePctCanvas: (100 * kl) / side,
    ink50: percentile(e, 50), ink50Pct: (100 * percentile(e, 50)) / side,
    marginMode: mmode, marginShare: share(mm, (v) => v === mmode), touch: share(x, (r) => mmin(r) <= 0.5), whole: share(x, (r) => land(r.box)),
  };
}
async function s1Rows(d) {
  const dd = await d.dd(), O = await d.ours(), out = [];
  for (const [f, g, k] of S1_ROWS) out.push({ label: `${f} ${g}`, f, g, ...strokeRow(dd.filter((r) => r.fam === f && r.grid === g && k.includes(r.klass) && r.box), g) });
  for (const g of OUR_MASTERS) out.push({ label: `Ours ${g}`, f: 'Ours', g, ...strokeRow(O.filter((r) => r.grid === g && r.box), g) });
  return out;
}

/** Corner rows for §2 (nuc_tabD.py + nuc_final_tables2.py T3). */
/** The stroke a §2 corner is divided by: the drawing's own stroke-width when it has one above zero, else its basis. */
export const cornerStroke = (r) => (r.own > 0 ? r.own : r.stroke);
async function cornerTable(d) {
  const dd = await d.dd(), O = await d.ours();
  const all = [];
  for (const r of dd) {
    if (!(r.klass === 'outline' || r.fam === 'Micro Bold') || !r.corners.length) continue;
    const stroke = cornerStroke(r);
    for (const c of r.corners) all.push({ fam: r.fam, grid: r.grid, name: r.name, radius: c[0], role: c[1], kind: c[2], stroke, side: sideOf(r) });
  }
  for (const r of O) for (const c of r.corners) all.push({ fam: 'Ours', grid: r.grid, name: r.name, radius: c[0], role: c[1], kind: c[2], stroke: r.own, side: sideOf(r) });
  const order = [['Core', 24], ['Core', 32], ['Core', 48], ['UI', 18], ['UI', 12], ['Micro Bold', 20], ['Sharp', 24], ['Pixel', 24], ['Ours', 24], ['Ours', 20], ['Ours', 16]];
  return order.map(([f, g]) => ({ f, g, ...cornerRow(all.filter((c) => c.fam === f && c.grid === g)) }));
}
/** One §2 row from that cell's corners [{radius, role, kind, stroke, side}] (nuc_final_tables2.py T3). */
export function cornerRow(x) {
  const c = x.filter((q) => q.role === 'container' && q.kind !== 'sharp'), cs = x.filter((q) => q.role === 'container'), b = x.filter((q) => q.role === 'bend');
  const row = { n: c.length, sharpContainer: share(cs, (q) => q.kind === 'sharp'), nContainer: cs.length, sharpBend: share(b, (q) => q.kind === 'sharp'), nBend: b.length };
  if (c.length) {
    const vals = c.map((q) => npRound(q.radius, 2)), vc = valueCounts(vals);
    Object.assign(row, { modal: vc[0][0], shareModal: vc[0][1] / vals.length, cover: radiiToCover(vals), perStroke: vc[0][0] / median(c.map((q) => q.stroke)), perCanvas: vc[0][0] / c[0].side });
  }
  return row;
}

/** One §3 air row from census rows: the floor percentiles in px and strokes, and the share below one stroke. */
export function airRow(label, x, side) {
  const L = x.map((r) => floorOf(r.gaps)).filter(Boolean);
  const fl = L.map((t) => t.fl), fs_ = L.map((t) => t.fl / t.w);
  return { label, side, n: L.length, fl, fs: fs_, p5: percentile(fl, 5), p10: percentile(fl, 10), p25: percentile(fl, 25), p50: percentile(fl, 50), s10: percentile(fs_, 10), s50: percentile(fs_, 50), below: share(fs_, (v) => v < 0.995), x };
}
/** Pixel's band: floors that round (2 dp) to 0.82 or 0.83. */
export function pixelBand(fl) {
  return fl.filter((v) => { const q = npRound(v, 2); return q === 0.82 || q === 0.83; }).length;
}
/** The dot-to-stem cell: n, the upper median (the scripts' gs[⌊n/2⌋]) and that median in strokes. */
export function dotCell(L) {
  if (!L.length) return null;
  const gs = L.map((x) => x.gap).sort((a, b) => a - b), med = gs[Math.floor(gs.length / 2)];
  return { n: L.length, med, st: med / L[0].stroke };
}
/** Run-length shares per run list (ink_an.py): % under three strokes and % of ten strokes or more. */
export function runShares(lists) {
  const shortS = [], longS = [];
  for (const L of lists) { if (!L.length) continue; shortS.push(100 * share(L, (v) => v < 3)); longS.push(100 * share(L, (v) => v >= 10)); }
  return { shortS, longS };
}
/** Kind 1: our drawings whose floor ÷ stroke is under one stroke (the §3 table's < 0.995). */
export function belowOneStroke(rows) {
  return rows.map((r) => ({ r, f: floorOf(r.gaps) })).filter((o) => o.f && o.f.fl / o.f.w < 0.995);
}

/** §3's air rows (nuc_final_tables2.py T4). */
async function airRows(d) {
  const dd = await d.dd(), O = await d.ours();
  const spec = [['Core', 24, ['outline']], ['Core', 32, ['outline']], ['Core', 48, ['outline']], ['UI', 18, ['outline', 'outline-duo']], ['UI', 12, ['outline']], ['Micro Bold', 20, ['glyph']], ['Sharp', 24, ['outline']], ['Pixel', 24, ['outline']]];
  const row = airRow;
  const out = spec.map(([f, g, k]) => row(`${f} ${g}`, dd.filter((r) => r.fam === f && r.grid === g && k.includes(r.klass) && r.gaps), g));
  for (const g of OUR_MASTERS) out.push(row(`Ours ${g}`, O.filter((r) => r.grid === g && r.gaps), g));
  return out;
}

/** One concept at two grids: air floor, container radius, ink long side (the inline pairstat read). */
export function pairStat(small, big, gs, gb) {
  const out = {};
  const names = [...small.keys()].filter((n) => big.has(n));
  const j = names.map((n) => [small.get(n), big.get(n)]);
  const g = j.map(([a, b]) => [floorPx(a), floorPx(b)]).filter(([a, b]) => a === a && b === b);
  out.air = { n: g.length, ratio: median(g.map(([a, b]) => b / a)), equal: share(g, ([a, b]) => Math.abs(b - a) <= 0.1), bigger: share(g, ([a, b]) => b > a + 0.1), smaller: share(g, ([a, b]) => b < a - 0.1) };
  const c = j.map(([a, b]) => [cradOf(a), cradOf(b)]).filter(([a, b]) => a === a && b === b);
  out.radius = { n: c.length, ratio: median(c.map(([a, b]) => b / a)), equal: share(c, ([a, b]) => Math.abs(b - a) <= 0.1) };
  out.ink = { n: j.length, ratio: median(j.map(([a, b]) => ext(b) / ext(a))) };
  out.stroke = { small: j[0]?.[0].own, big: j[0]?.[1].own };
  out.share = { small: median(j.map(([a]) => ext(a) / gs)), big: median(j.map(([, b]) => ext(b) / gb)) };
  out.grid = gb / gs;
  return out;
}
async function sameConcept(d) {
  const dd = await d.dd(), O = await d.ours();
  const sel = (f, g) => firstPerName(dd.filter((r) => r.klass === 'outline' && r.fam === f && r.grid === g));
  const ours = (g) => firstPerName(O.filter((r) => r.grid === g));
  return {
    'Core 24 → 32': pairStat(sel('Core', 24), sel('Core', 32), 24, 32),
    'Core 32 → 48': pairStat(sel('Core', 32), sel('Core', 48), 32, 48),
    'Core 24 → 48': pairStat(sel('Core', 24), sel('Core', 48), 24, 48),
    'UI 12 → 18': pairStat(sel('UI', 12), sel('UI', 18), 12, 18),
    'Ours 20 → 24': pairStat(ours(20), ours(24), 20, 24),
    'Ours 16 → 20': pairStat(ours(16), ours(20), 16, 20),
    'Ours 16 → 24': pairStat(ours(16), ours(24), 16, 24),
  };
}

/** §4.2: one chain's row (chain_tab.py). `aIsSmaller`: the card ran the chain smaller grid first. */
export function chainRow(P, aIsSmaller) {
  const big = P.map((p) => (aIsSmaller ? p.B : p.A)), small = P.map((p) => (aIsSmaller ? p.A : p.B));
  const bg = big.map((b) => b.gone), sg = small.map((s) => s.gone), mx = bg.map((v, i) => Math.max(v, sg[i]));
  const fits = P.filter((p) => p.fit).map((p) => (aIsSmaller ? p.fit.s : 1 / p.fit.s));
  const runsBig = P.flatMap((p) => (aIsSmaller ? p.goneRunsB : p.goneRunsA)), runsSmall = P.flatMap((p) => (aIsSmaller ? p.goneRunsA : p.goneRunsB));
  return {
    n: P.length, held: mean(big.map((b) => b.held)), nudged: mean(big.map((b) => b.nudged)), bigGone: mean(bg), smallGone: mean(sg),
    unchanged: share(mx, (v) => v <= 0.02), minor: share(mx, (v) => v > 0.02 && v <= 0.10), changed: share(mx, (v) => v > 0.10), over5: share(mx, (v) => v > 0.05),
    bigDetail: share(bg, (v) => v > 0.05), smallDetail: share(sg, (v) => v > 0.05), fit: median(fits), runs: [runsBig, runsSmall],
  };
}
const CHAIN_ROWS = [      // document order: [label, data key, aIsSmaller]
  ['Core 32 → 24', 'core24_core32', true], ['Core 48 → 32', 'core32_core48', true], ['Core 48 → 24', 'core24_core48', true],
  ['UI 18 → 12', 'ui18_ui12', false], ['*Core 24 → UI 18 (style changes too)*', 'core24_ui18', false],
  ['**Ours 24 → 20**', 'ours24_20', false], ['**Ours 20 → 16**', 'ours20_16', false], ['**Ours 24 → 16**', 'ours24_16', false],
];
/** The size-only chains (one family, two grids): the first four rows. */
export const SIZE_CHAINS = CHAIN_ROWS.slice(0, 4).map(([, k]) => k);
async function chainRows(d) {
  const ink = await d.ink();
  return Object.fromEntries(CHAIN_ROWS.map(([label, key, sm]) => [key, { label, ...chainRow(ink[key], sm) }]));
}

/** §4.3: one chain's verdict shares. */
export function verdictRow(L) {
  const n = L.length, c = (v) => L.filter((x) => x.verdict === v).length / n;
  const fit = L.map((x) => x.fit).filter((v) => v != null);
  return { n, redrawn: c('redrawn'), retuned: c('re-tuned'), scaled: c('scaled copy') + c('same shape, own weight'), worst: median(fit), p90: percentile(fit, 90) };
}

/** §4.4: one chain's part summary (nuc_pairs_an.py + the inline kind / category read). */
export function partRow(P) {
  const n = P.length, cat = {};
  for (const p of P) { const k = pairCategory(p); cat[k] = (cat[k] || 0) + 1; }
  const parts = P.flatMap((p) => p.matched);
  const kinds = (L) => { const c = { 'open line': 0, 'closed shape': 0, dot: 0 }; for (const x of L) c[partKind(x)]++; return c; };
  const dr = P.flatMap((p) => p.dropped), ad = P.flatMap((p) => p.added);
  return {
    n, cat: Object.fromEntries(['nudged', 'reshaped', 'moved/resized', 'pure', 'dropped/added'].map((k) => [k, (cat[k] || 0) / n])),
    matched: parts.length, place: share(parts, (m) => m.stage === 'place'),
    dC: [percentile(parts.map((m) => m.dC), 50), percentile(parts.map((m) => m.dC), 90)],
    dev: [percentile(parts.map((m) => m.maxS), 50), percentile(parts.map((m) => m.maxS), 90)],
    size: [10, 50, 90].map((q) => percentile(parts.map((m) => m.size).filter((v) => v), q)),
    dropped: dr.length, added: ad.length, kd: kinds(dr), ka: kinds(ad),
  };
}

/** Detail per grid for one family (nuc_final_tables2.py T5): first variant per name and grid, concepts at every grid. */
/** The ratio of two shares as the document divides them: each share first printed at one decimal of a percent. */
export const shareRatio = (a, b) => Number(fx(100 * a, 1)) / Number(fx(100 * b, 1));
/** A concept's part count at our three masters, largest first ("19/16/13"); a master it lacks prints empty. */
export const partsAt = (O, n) => OUR_MASTERS.map((g) => O.find((r) => r.grid === g && r.name === n)?.parts).join('/');
export function detailTable(rows, grids) {
  const by = new Map();
  for (const r of rows) { if (!by.has(r.name)) by.set(r.name, {}); const o = by.get(r.name); if (!(r.grid in o)) o[r.grid] = r; }
  const full = [...by.values()].filter((o) => grids.every((g) => o[g]));
  const nsegs = (r) => r.seg.L + r.seg.C + r.seg.Q + r.seg.A;
  const meanOf = (g, f) => mean(full.map((o) => f(o[g])));
  const step = (a, b) => { const dl = full.map((o) => o[b].parts - o[a].parts); return { same: share(dl, (v) => v === 0), more: share(dl, (v) => v > 0), fewer: share(dl, (v) => v < 0) }; };
  return { n: full.length, parts: Object.fromEntries(grids.map((g) => [g, meanOf(g, (r) => r.parts)])), segs: Object.fromEntries(grids.map((g) => [g, meanOf(g, nsegs)])), step };
}

// ═══════════════════════════════════════════════════════════════════════════
// sections — each prints its figures in the document's order and format
// ═══════════════════════════════════════════════════════════════════════════

const out = (s = '') => console.log(s);
const head = (t) => out(`\n## ${t}`);
/** A length as the tables write it: two decimals at most, no trailing zeros (22 · 2.5 · 18.5 · 1.25). */
export const lengthFmt = (v) => String(npRound(v, 2));
const sm = lengthFmt;
const pc0 = (x) => `${fx(100 * x, 0)}%`, pc1 = (x) => `${fx(100 * x, 1)}%`;
/** The touch column: whole percents, one decimal under 1%, "0%" for none (as the document writes 0.3%, 41%, 0%). */
export const touchFmt = (x) => (x === 0 ? '0%' : 100 * x < 1 ? pc1(x) : pc0(x));
/** An ink share at one decimal, a full 100.0 written 100. */
export const inkPct = (v) => (fx(v, 1) === '100.0' ? '100' : fx(v, 1));

async function secSample(d) {
  head('Sample, and why this one');
  const { db } = await d.db();
  const total = db.prepare('SELECT COUNT(*) n FROM icons').get().n;
  const census = await d.census();
  const byFam = {};
  for (const r of census) byFam[r.fam] = (byFam[r.fam] || 0) + 1;
  const inFam = census.length;
  out(`Source: Nucleo's local library, data.sqlite3 + ${nf(total)} .svg (icon rows in the database)`);
  out(`Families: ${nf(inFam)} drawings in the five families (Core ${nf(byFam.Core)} · UI ${nf(byFam.UI)} · Sharp ${nf(byFam.Sharp)} · Pixel ${nf(byFam.Pixel)} · Micro Bold ${nf(byFam['Micro Bold'])}); the other ${nf(total - inFam)} are free sets outside them`);
  const rep = repeatCensus(census), dd = await d.dd();
  out(`Distinct: ${nf(dd.length)} once repeats are set aside (${nf(rep.multi)} family × grid × style × name keys occur more than once; ${pc1(rep.same / rep.multi)} of those are the same drawing)`);
  const ctx = await d.db();
  const names = (f, g) => new Set(pick(ctx, f, g).keys());
  const c24 = names('Nucleo Core', 24), c32 = names('Nucleo Core', 32), c48 = names('Nucleo Core', 48), u12 = names('Nucleo UI', 12), u18 = names('Nucleo UI', 18);
  const all3 = [...c24].filter((n) => c32.has(n) && c48.has(n)).length, ui2 = [...u18].filter((n) => u12.has(n)).length, cross = [...c24].filter((n) => u18.has(n)).length;
  out(`Concepts: Core ${nf(all3)} at all three grids · UI ${nf(ui2)} at both · ${nf(cross)} shared by Core 24 and UI 18`);
  const O = await d.ours();
  const oc = new Set(O.map((r) => r.name)).size;
  out(`Our side: ${oc} concepts × ${new Set(O.map((r) => r.grid)).size} masters = ${nf(O.length)} drawings`);
  out('');
  out('Why Nucleo is a control group:');
  const sm_ = db.prepare('SELECT COUNT(*) n FROM icons WHERE stroke_max IS NOT NULL').get().n;
  const bySet = db.prepare(`SELECT s.title t, COUNT(*) n FROM icons i JOIN sets s ON s.id=i.set_id WHERE i.stroke_max IS NOT NULL GROUP BY s.title ORDER BY s.title`).all();
  out(`- stroke_max is set on ${nf(sm_)} icons (${pc1(sm_ / total)}), in ${bySet.length} sets (${bySet.map((x) => `${x.t.replace('Nucleo ', '')} ${x.n}`).join('; ')})`);
  const grids = [...new Set(census.map((r) => `${r.fam}|${r.grid}`))];
  const famGrids = ['Core', 'UI', 'Sharp', 'Pixel', 'Micro Bold'].map((f) => `${f} ${grids.filter((k) => k.startsWith(`${f}|`)).map((k) => Number(k.split('|')[1])).sort((a, b) => a - b).join('/')}`).join(', ');
  out(`- the families and their grids: ${famGrids}`);
  out(`- ${grids.length} grids in ${new Set(census.map((r) => r.fam)).size} families; steps ×${fx(32 / 24, 2)} · ×${fx(48 / 32, 1)} · ×${fx(48 / 24, 1)} (Core), ×${fx(18 / 12, 1)} (UI) against our ×${fx(24 / 20, 1)} · ×${fx(20 / 16, 2)} · ×${fx(24 / 16, 1)}`);
  out('');
  out('Instruments:');
  const core24 = dd.filter((r) => r.fam === 'Core' && r.grid === 24 && r.klass === 'outline' && r.own > 0);
  out(`- square caps and mitres Core 24 uses in ${pc1(share(core24, (r) => r.cap === 'square'))} and ${pc1(share(core24, (r) => r.join === 'miter'))} of drawings`);
  const rows = await s1Rows(d);
  out(`- the keyline probe has few circles at Core 48 (n = ${rows.find((r) => r.label === 'Core 48').kn}) and Sharp (${rows.find((r) => r.label === 'Sharp 24').kn})`);
  out('');
  out('Declared limits:');
  const ch = await chainRows(d), parts = await d.parts();
  const pr = { core24_ui18: partRow(parts.core24_ui18), ui18_ui12: partRow(parts.ui18_ui12) };
  out(`- across families the part view and the ink view agree (${pc1(pr.core24_ui18.cat['dropped/added'])} and ${pc1(1 - ch.core24_ui18.unchanged)} of pairs differ), within UI 18 → 12 the part view reports ${pc1(pr.ui18_ui12.cat['dropped/added'])} against ${pc1(1 - ch.ui18_ui12.unchanged)}`);
  out(`- the first drawing per name stands for its repeats (${pc1(rep.same / rep.multi)} identical)`);
  const cc = db.prepare('SELECT COUNT(*) n FROM icons WHERE corner_custom = 1').get().n;
  out(`- corner_custom (${nf(cc)} icons) is not measured`);
}

async function secS1(d) {
  head('§1 Stroke, keyline and margin');
  const rows = await s1Rows(d);
  out('| Family · grid | Drawings | Stroke px (at modal) | % of canvas | Circle keyline ⌀ (n) | Stroke ÷ keyline | Typical ink long side | Modal min margin | Touch the edge (≤0.5) | Outer edge on whole px |');
  for (const r of rows) {
    const ours = r.f === 'Ours';
    out(`| ${ours ? `**${r.label}**` : r.label} | ${nf(r.n)} | ${ours ? sm(r.stroke) : fx(r.stroke, 1)} (${pc0(r.strokeShare)}) | ${ours ? fx(r.strokePctCanvas, 2) : fx(r.strokePctCanvas, 2).replace(/(\.\d)0$/, '$1')}% | ${r.kl === r.kl ? `${sm(r.kl)}${ours ? '' : ` (${r.kn})`}` : '—'} | ${r.kl === r.kl ? `${fx(r.strokePctKeyline, 1)}%` : '—'} | ${sm(npRound(r.ink50, 1))} · ${inkPct(r.ink50Pct)}% | ${sm(r.marginMode)} (${pc0(r.marginShare)}) | ${touchFmt(r.touch)} | ${pc0(r.whole)} |`);
  }
  const O = rows.filter((r) => r.f === 'Ours');
  out(`(Our keylines, read by the same probe: ${O.map((r) => sm(r.kl)).join(' · ')}; ring outer edge = 2r + stroke = ${O.map((r) => `${sm(r.kl - r.stroke)} + ${sm(r.stroke)}`).join(', ')}.)`);
  out('');
  const live = (r) => r.g - 2 * r.marginMode;
  const R = Object.fromEntries(rows.map((r) => [r.label, r]));
  const L = (k) => `${live(R[k])}`, Lp = (k) => fx((100 * live(R[k])) / R[k].g, 0);
  out(`Live area (canvas − 2 × modal margin): ${L('Core 24')} · ${L('Core 32')} · ${L('Core 48')} px in Core (${Lp('Core 24')} · ${Lp('Core 32')} · ${Lp('Core 48')}%), ${L('UI 18')} and ${L('UI 12')} in UI (${Lp('UI 18')} · ${Lp('UI 12')}%), ${L('Micro Bold 20')} in Micro Bold (${Lp('Micro Bold 20')}%), ${L('Sharp 24')} in Sharp and ${L('Pixel 24')} in Pixel (${Lp('Sharp 24')}%)`);
  const eqKey = SIX_KEYS.every((k) => live(R[k]) === R[k].kl);
  out(`  in Core, UI and Micro Bold the live area equals the keyline probe: ${eqKey ? 'yes' : 'no'}`);
  out(`  Ours: ${L('Ours 24')} · ${L('Ours 20')} · ${L('Ours 16')} (${Lp('Ours 24')} · ${Lp('Ours 20')} · ${Lp('Ours 16')}%), set by a margin of ${O.map((r) => sm(r.marginMode)).join(' · ')}`);
  out('');
  const inkp = (k) => fx(R[k].ink50Pct, 0);
  out(`What the eye sees: ${rng(cellsOf('§1 Core ink share', CORE_KEYS, (k) => R[k].ink50Pct, 0, UI_KEYS))} of the box in Core at every grid, ${inkp('UI 18')}% then ${inkp('UI 12')}% in UI; at UI 12 ${touchFmt(R['UI 12'].touch)} touch the edge.`);
  const ring = cellsOf('§1 our ring share', OUR_KEYS, (k) => R[k].keylinePctCanvas, 1);
  out(`  Ours stands in at ${rng(cellsOf('§1 our ink share', OUR_KEYS, (k) => R[k].ink50Pct))} for a typical drawing and ${fx(Math.min(...ring), 0)} – ${fx(Math.max(...ring), 1)}% for the ring (${O.map((r) => fx(r.keylinePctCanvas, 1)).join(' · ')}%)`);
  out(`  ${touchFmt(R['UI 12'].touch)} of UI 12 and ${touchFmt(R['Core 24'].touch)} of Core 24 touch the canvas edge; Core 48 ${touchFmt(R['Core 48'].touch)}, Micro Bold ${touchFmt(R['Micro Bold 20'].touch)}, which still fill ${inkp('Core 48')}% and ${inkp('Micro Bold 20')}% of the box`);
  out('');
  const nucleoStrokes = [...new Set(rows.filter((r) => r.f !== 'Ours').map((r) => r.stroke))].sort((a, b) => b - a);
  // the spread in points is taken between the two printed (1 dp) shares, as the document subtracts them
  const span = (ks, left = []) => { const v = cellsOf(`§1 stroke ÷ keyline, ${ks[0].split(' ')[0]}`, ks, (k) => Number(fx(R[k].strokePctKeyline, 1)), 1, left); return `${fx(Math.min(...v), 1)} – ${fx(Math.max(...v), 1)}% (${fx(Math.max(...v) - Math.min(...v), 1)} points)`; };
  out(`The stroke: ${nucleoStrokes.length} values (${nucleoStrokes.map((v) => fx(v, 1)).join(' and ')}) cover all ${rows.filter((r) => r.f !== 'Ours').length} grids. Stroke ÷ keyline across grids: Core ${span(CORE_KEYS, UI_KEYS)}, UI ${span(UI_KEYS, CORE_KEYS)}, ours ${span(OUR_KEYS)}`);
  out('');
  const dd = await d.dd();
  const sw = (g) => dd.find((r) => r.fam === 'UI' && r.grid === g && r.klass === 'outline' && r.name === 'square-warning');
  const w18 = sw(18), w12 = sw(12);
  out(`On the grid: outer edge on whole pixels in ${rng(cellsOf('§1 Core whole px', CORE_KEYS, (k) => 100 * R[k].whole, 0, UI_KEYS))} of Core drawings and ${rng(cellsOf('§1 our whole px', OUR_KEYS, (k) => 100 * R[k].whole))} of ours; UI ${rng(cellsOf('§1 UI whole px', UI_KEYS, (k) => 100 * R[k].whole, 0, CORE_KEYS))}`);
  out(`  square-warning's outer edge: UI 18 ${fx(w18.box.x0, 1)} and ${fx(w18.box.x1, 1)}, UI 12 ${fx(w12.box.x0, 1)} and ${fx(w12.box.x1, 1)}`);
}

async function secS2(d) {
  head('§2 Corner radius — does it track the stroke?');
  const T = await cornerTable(d);
  out('| Family · grid | Corners | Modal radius | Share on it | Radii to cover 90% | ÷ stroke | ÷ canvas | Sharp share of container corners | Open-line bends that are sharp |');
  for (const r of T) {
    const ours = r.f === 'Ours', lab = ours ? `**Ours ${r.g}**` : `${r.f} ${r.g}`;
    if (!r.n) { out(`| ${lab} | 0 | — | — | — | — | — | ${pc0(r.sharpContainer)} | ${pc0(r.sharpBend)} |`); continue; }
    out(`| ${lab} | ${nf(r.n)} | ${fx(r.modal, 1)} | ${pc1(r.shareModal)} | ${r.cover} | ${fx(r.perStroke, 2)} | ${pc1(r.perCanvas)} | ${pc1(r.sharpContainer)} | ${pc0(r.sharpBend)} |`);
  }
  out('(Our share on the modal value in this table is this probe\'s own two-decimal count; the document\'s three table cells for it cite card 1.2, findings-corners.md §1.1 — a wave-5 reconcile item.)');
  const dd = await d.dd();
  const swc = (f, g) => {
    const r = dd.find((x) => x.fam === f && x.grid === g && x.klass === 'outline' && x.name === 'square-warning');
    const cs = r ? r.corners.filter((c) => c[1] === 'container' && c[2] !== 'sharp').map((c) => c[0]) : [];
    return cs.length ? sm(modeOf(cs)) : '—';
  };
  out(`square-warning, container corner radius: Core 24 ${swc('Core', 24)}, Core 32 ${swc('Core', 32)}, Core 48 ${swc('Core', 48)}, UI 18 ${swc('UI', 18)}, UI 12 ${swc('UI', 12)}`);
  const by = Object.fromEntries(T.map((r) => [`${r.f} ${r.g}`, r]));
  const sixCells = SIX_KEYS;
  const eq = sixCells.filter((k) => Math.abs(by[k].perStroke - 1) < 1e-9);
  out(`Radius equals stroke in ${eq.length} cell of ${sixCells.length} (${eq.join(', ')}); the others: ${sixCells.filter((k) => !eq.includes(k)).map((k) => `${k} ${fx(by[k].perStroke, 2)}×`).join(', ')}`);
  out(`  Core 24 → 32 → 48: ${CORE_KEYS.map((k) => fx(by[k].modal, 0)).join(' → ')} (steps ×${fx(by['Core 32'].modal / by['Core 24'].modal, 1)}, ×${fx(by['Core 48'].modal / by['Core 32'].modal, 2)}); UI ${fx(by['UI 18'].modal, 0)} at 18 and ${fx(by['UI 12'].modal, 0)} at 12`);
  out(`  share of canvas: Core ${pc1(by['Core 24'].perCanvas)} → ${pc1(by['Core 48'].perCanvas)}, UI ${pc1(by['UI 18'].perCanvas)} → ${pc1(by['UI 12'].perCanvas)}; ours ${OUR_KEYS.map((k) => `${fx(by[k].perStroke, 2)}×`).join(' · ')}, ${OUR_KEYS.map((k) => fx(100 * by[k].perCanvas, 1)).join(' · ')}% of the canvas`);
  out('');
  const named = ['Core 24', 'Core 32', 'UI 18'];                // the three cells the sentence names
  const nc = cellsOf('§2 radii to 90% (named)', named, (k) => by[k].cover);
  out(`Each grid has one radius: ${pc0(by[named[0]].shareModal)} of ${named[0]}'s and ${pc0(by[named[1]].shareModal)} of ${named[1]}'s rounded container corners, ${pc0(by[named[2]].shareModal)} of ${named[2]}'s, on the modal value; ${Math.min(...nc)} or ${Math.max(...nc)} radii reach 90%. Ours (this probe): ${rng(cellsOf('§2 our modal share', OUR_KEYS, (k) => 100 * by[k].shareModal))} on the modal value, ${[...new Set(OUR_KEYS.map((k) => by[k].cover))].join('/')} radii to 90%`);
  out(`  one radius per master used by ${rng(cellsOf('§2 six modal share', sixCells, (k) => 100 * by[k].shareModal, 0, ['Sharp 24', 'Pixel 24']))} of rounded container corners (the six cells)`);
  out(`Core is mixed-corner: ${rng(cellsOf('§2 Core square containers', CORE_KEYS, (k) => 100 * by[k].sharpContainer, 0, UI_KEYS))} of container corners square, ${rng(cellsOf('§2 Core mitred bends', CORE_KEYS, (k) => 100 * by[k].sharpBend, 0, UI_KEYS))} of open-line bends mitred; UI ${rng(cellsOf('§2 UI square containers', UI_KEYS, (k) => 100 * by[k].sharpContainer, 0, CORE_KEYS))}, ours ${rng(cellsOf('§2 our square containers', OUR_KEYS, (k) => 100 * by[k].sharpContainer))}; Sharp ${pc1(by['Sharp 24'].sharpContainer)}, Pixel ${pc0(by['Pixel 24'].sharpContainer)}`);
  out(`Bends: UI's centreline radius reads 0 in ${rng(cellsOf('§2 UI bends at 0', UI_KEYS, (k) => 100 * by[k].sharpBend, 0, CORE_KEYS))}; ours draws an arc in ${rng(cellsOf('§2 our arcs', OUR_KEYS, (k) => 100 * (1 - by[k].sharpBend)))}`);
}

async function secS3(d) {
  head('§3 Air — the practical floor');
  const A = await airRows(d);
  out('| Family · grid | Drawings | px at p5 · p10 · p25 · p50 | Strokes at p10 · p50 | Canvas share at p10 · p50 | Below one stroke |');
  for (const r of A) {
    const lab = r.label.startsWith('Ours') ? `**${r.label}**` : r.label;
    out(`| ${lab} | ${nf(r.n)} | ${fx(r.p5, 2)} · ${fx(r.p10, 2)} · ${fx(r.p25, 2)} · ${fx(r.p50, 2)} | ${fx(r.s10, 2)} · ${fx(r.s50, 2)} | ${fx((100 * r.p10) / r.side, 1)}% · ${fx((100 * r.p50) / r.side, 1)}% | ${pc0(r.below)} |`);
  }
  const by = Object.fromEntries(A.map((r) => [r.label, r]));
  const core = CORE_KEYS;
  out(`Core's floor: ${core.map((k) => fx(by[k].p10, 1)).join(' → ')} px; ${core.map((k) => fx(by[k].s10, 1)).join(' → ')} strokes; ${rng(cellsOf('§3 Core floor share', core, (k) => (100 * by[k].p10) / by[k].side, 1, UI_KEYS), 1)} of the canvas. UI: ${fx(by['UI 18'].p10, 1)} → ${fx(by['UI 12'].p10, 1)} px, ${fx((100 * by['UI 18'].p10) / 18, 1)} → ${fx((100 * by['UI 12'].p10) / 12, 1)}%`);
  const ours = OUR_KEYS;
  out(`Ours: ${ours.map((k) => `${fx(by[k].p5, 2)}/${fx(by[k].p10, 2)}/${fx(by[k].p25, 2)}`).join(' · ')} at p5/p10/p25; ${ours.map((k) => fx((100 * by[k].p10) / by[k].side, 1)).join(' → ')}% of the canvas; ${ours.map((k) => fx(by[k].s10, 1)).join(' → ')} strokes; ${rng(cellsOf('§3 ours below one stroke', ours, (k) => 100 * by[k].below))} below one stroke against ${rng(cellsOf('§3 Nucleo below one stroke', NUC_KEYS.filter((k) => k !== 'Pixel 24'), (k) => 100 * by[k].below, 0, ['Pixel 24', ...OUR_KEYS]))} of the Nucleo families' (Pixel ${pc0(by['Pixel 24'].below)})`);
  out('');
  out('The same concept at two grids:');
  out('| Same concept | Grid × | Air floor × | Pairs where the air is bigger · equal · smaller at the bigger grid |');
  const S = await sameConcept(d);
  for (const [k, v] of Object.entries(S)) {
    const lab = k.startsWith('Ours') ? `**${k}**` : k;
    out(`| ${lab} | ${fx(v.grid, 2)} | ${fx(v.air.ratio, 2)} | ${pc0(v.air.bigger)} · ${pc0(v.air.equal)} · ${pc0(v.air.smaller)} (n = ${nf(v.air.n)}) |`);
  }
  out('');
  out('Glyph dot-to-stem air (exclamation, question and info icons):');
  const dots = await d.dots();
  const cells = [['Core', 24], ['Core', 32], ['UI', 18], ['UI', 12], ['Sharp', 24], ['Pixel', 24], ['Ours', 24], ['Ours', 20], ['Ours', 16]];
  const cell = (f, g) => dotCell(dots.filter((x) => x.fam === f && x.grid === g));
  const C = cells.map(([f, g]) => ({ f, g, ...cell(f, g) }));
  const nu = C.filter((c) => c.f !== 'Ours'), ou = C.filter((c) => c.f === 'Ours');      // the document puts our three masters in one cell
  out(`| | ${nu.map((c) => `${c.f} ${c.g}`).join(' | ')} | **Ours ${ou.map((c) => c.g).join(' · ')}** |`);
  out(`| dot-to-stem air, median px | ${nu.map((c) => fx(c.med, 2)).join(' | ')} | **${ou.map((c) => fx(c.med, 2)).join(' · ')}** |`);
  out(`| in strokes | ${nu.map((c) => fx(c.st, 2)).join(' | ')} | **${ou.map((c) => fx(c.st, 2)).join(' · ')}** |`);
  out(`| drawings in the cell | ${nu.map((c) => c.n).join(' | ')} | ${ou.map((c) => c.n).join(' · ')} |`);
  const nuc = C.filter((c) => c.f !== 'Ours' && c.f !== 'Pixel'), oc = C.filter((c) => c.f === 'Ours');
  const Cb = Object.fromEntries(C.map((c) => [`${c.f} ${c.g}`, c])), lab = (L) => L.map((c) => `${c.f} ${c.g}`);
  const nb = cellsOf('§3 professionals\' dot band', lab(nuc), (k) => Cb[k].st, 1, ['Pixel 24', ...lab(oc)]), ob = cellsOf('§3 our dot band', lab(oc), (k) => Cb[k].st, 1);
  const cn = cellsOf('§3 drawings per dot cell', lab(C), (k) => Cb[k].n);
  out(`  the professionals' band: ${fx(Math.min(...nb), 1)} – ${fx(Math.max(...nb), 1)} stroke; ours ${fx(Math.min(...ob), 1)} – ${fx(Math.max(...ob), 1)}; cells ${Math.min(...cn)} – ${Math.max(...cn)} drawings`);
  const px = by['Pixel 24'];
  const at = pixelBand(px.fl);
  out(`Pixel: ${nf(at)} of its ${nf(px.n)} drawings sit at 0.82 – 0.83 on the air measure (2 dp); 2√2 − 2 = ${fx(2 * Math.SQRT2 - 2, 2)}`);
}

async function s1Strokes(d) { const rows = await s1Rows(d); return Object.fromEntries(rows.map((r) => [r.label, r])); }

async function secS41(d) {
  head('§4.1 Ratios to the grid');
  const S = await sameConcept(d), R = await s1Strokes(d);
  const strokeRatio = { 'Core 24 → 32': R['Core 32'].stroke / R['Core 24'].stroke, 'Core 32 → 48': R['Core 48'].stroke / R['Core 32'].stroke, 'Core 24 → 48': R['Core 48'].stroke / R['Core 24'].stroke, 'UI 12 → 18': R['UI 18'].stroke / R['UI 12'].stroke };
  out('| Same concept | Grid ratio | Stroke | Ink long side | Air floor | Container radius |');
  for (const [k, v] of Object.entries(S)) {
    const ours = k.startsWith('Ours');
    const st = ours ? v.stroke.big / v.stroke.small : strokeRatio[k];
    const rad = `${fx(v.radius.ratio, 2)} (n = ${nf(v.radius.n)}${k === 'UI 12 → 18' ? `; equal in ${pc0(v.radius.equal)}` : ''})`;
    out(`| ${ours ? `**${k}**` : k} | ${fx(v.grid, 2)} | ${fx(st, 2)} | ${fx(v.ink.ratio, 2)} | ${fx(v.air.ratio, 2)} | ${rad} |`);
  }
  out('(Stroke column: Nucleo = ratio of the two grids\' modal strokes (§1); ours = the two masters\' strokes.)');
  out(`UI's ink share: 12-grid ${pc0(S['UI 12 → 18'].share.small)} against 18-grid ${pc0(S['UI 12 → 18'].share.big)}`);
}

async function secS42(d) {
  head('§4.2 The ink itself — held, nudged, gone');
  const C = await chainRows(d);
  out('| Chain | Pairs | Ink held | Nudged | Unchanged (≤2% of ink unmatched) | Minor (2 – 10%) | Changed (>10%) | Bigger grid has >5% ink the smaller lacks | Smaller has >5% the bigger lacks | Held ink, smaller ÷ larger (canvas share) |');
  for (const [, key] of CHAIN_ROWS) {
    const r = C[key];
    out(`| ${r.label} | ${nf(r.n)} | ${pc0(r.held)} | ${pc0(r.nudged)} | ${pc0(r.unchanged)} | ${pc0(r.minor)} | ${pc0(r.changed)} | ${pc0(r.bigDetail)} | ${pc0(r.smallDetail)} | ×${fx(r.fit, 3)} |`);
  }
  const size = SIZE_CHAINS.map((k) => C[k]);
  out(`What stays: ${rng(cellsOf('§4.2 within one stroke', SIZE_CHAINS, (k) => 100 * (1 - C[k].bigGone), 0, ['core24_ui18', ...OUR_CHAIN_KEYS]))} of the larger grid's ink is within one stroke of the smaller grid's; ${rng(cellsOf('§4.2 within a quarter-stroke', SIZE_CHAINS, (k) => 100 * C[k].held, 0, ['core24_ui18', ...OUR_CHAIN_KEYS]))} within a quarter-stroke (the four size-only chains)`);
  out(`What goes: in Core the bigger grid carries ≥5% extra ink in ${pc0(C.core24_core32.bigDetail)} (24 → 32), ${pc0(C.core32_core48.bigDetail)} (32 → 48) and ${pc0(C.core24_core48.bigDetail)} (24 → 48) of concepts, against ${rng(cellsOf('§4.2 smaller grid has more', SIZE_CHAINS.slice(0, 3), (k) => 100 * C[k].smallDetail, 0, ['ui18_ui12']))} the other way. UI 18 → 12 sheds in ${pc0(C.ui18_ui12.bigDetail)} and adds in ${pc0(C.ui18_ui12.smallDetail)}.`);
  // one run list per chain and side (the bigger grid's runs, then the smaller's), each list's shares as runShares reads them
  const lists = Object.fromEntries(SIZE_CHAINS.flatMap((k) => ['bigger', 'smaller'].map((side, i) => [`${k} ${side}`, C[k].runs[i]])).filter(([, L]) => L.length));
  const rs = Object.fromEntries(Object.entries(lists).map(([k, L]) => [k, runShares([L])]));
  const shortS = cellsOf('§4.2 runs under three strokes', Object.keys(rs), (k) => rs[k].shortS[0]), longS = cellsOf('§4.2 runs of ten strokes', Object.keys(rs), (k) => rs[k].longS[0]);
  out(`  unmatched stretches: ${rng(shortS)} of the dropped or added runs are under three strokes long, ${rng(longS)} ten strokes or more`);
  out(`Ours 24 → 16 against UI 18 → 12: ${pc0(C.ours24_16.unchanged)} unchanged against ${pc0(C.ui18_ui12.unchanged)}; ${pc0(C.ours24_16.changed)} changed against ${pc0(C.ui18_ui12.changed)}. Ours 24 → 20 and 20 → 16: ${pc0(C.ours24_20.unchanged)} and ${pc0(C.ours20_16.unchanged)} unchanged; held ink ×${fx(C.ours24_20.fit, 3)} at 20, ×${fx(C.ours20_16.fit, 3)} at 16`);
}

async function secS43(d) {
  head('§4.3 The repo\'s "redrawn" verdict');
  const V = await d.verdicts(), R = await s1Strokes(d);
  const rows = [['Core 24 → UI 18 (size **and** style)', 'core24_ui18'], ['Core 24 → Core 32 (every third concept)', 'core24_core32'], ['Core 32 → Core 48 (every third concept)', 'core32_core48'], ['UI 18 → UI 12 (all)', 'ui18_ui12']];
  out('| Chain | Pairs | Redrawn | Re-tuned | Scaled / same shape own weight | Worst gap, median |');
  const T = {};
  for (const [lab, k] of rows) {
    const r = (T[k] = verdictRow(V[k]));
    out(`| ${lab} | ${nf(r.n)} | ${pc1(r.redrawn)} | ${pc1(r.retuned)} | ${pc1(r.scaled)} | ${fx(r.worst, 2)}${k === 'core24_ui18' ? ' strokes' : ''} |`);
  }
  out(`The stroke's share of the canvas: ${pc1(R['Core 24'].strokePctCanvas / 100)} of Core 24, ${pc1(R['Core 32'].strokePctCanvas / 100)} of Core 32, ${pc1(R['Core 48'].strokePctCanvas / 100)} of Core 48; ${pc1(R['UI 12'].strokePctCanvas / 100)} of UI 12`);
  out(`  "redrawn": ${pc1(T.ui18_ui12.redrawn)} (UI 18 → 12, line ${fx(R['UI 18'].strokePctCanvas, 1)} – ${fx(R['UI 12'].strokePctCanvas, 1)}% of the canvas), ${pc1(T.core24_core32.redrawn)} (Core ×1.33), ${pc1(T.core32_core48.redrawn)} (Core ×1.5); cross-family ${pc1(T.core24_ui18.redrawn)} — ${fx(100 * (T.core24_ui18.redrawn - T.core24_core32.redrawn), 1)} points above the same ×1.33 step inside Core`);
}

async function secS44(d) {
  head('§4.4 Part by part');
  const P = await d.parts(), C = await chainRows(d);
  const a = partRow(P.core24_ui18), b = partRow(P.ui18_ui12);
  const line = (lab, f) => out(`| ${lab} | ${f(a)} | ${f(b)} |`);
  out('| | Core 24 → UI 18 | UI 18 → UI 12 |');
  line('every part has a counterpart, none off by more than a stroke', (r) => pc1(r.cat.nudged));
  line('… and a part is reshaped in place by more than a stroke', (r) => pc1(r.cat.reshaped));
  line('… and a part moved or was resized (needed the shape fit)', (r) => pc1(r.cat['moved/resized']));
  line('every part pure scaling (≤0.1 stroke)', (r) => (r.cat.pure ? pc1(r.cat.pure) : '0%'));
  line('**some part has no counterpart (dropped or added)**', (r) => `**${pc1(r.cat['dropped/added'])}**`);
  line('matched parts', (r) => nf(r.matched));
  line('of them matched in place (not after a move)', (r) => pc1(r.place));
  line("a part's centre moves — median · p90, strokes", (r) => `${fx(r.dC[0], 2)} · ${fx(r.dC[1], 2)}`);
  line("a part's own worst deviation — median · p90, strokes", (r) => `${fx(r.dev[0], 2)} · ${fx(r.dev[1], 2)}`);
  line('part size as a share of canvas, other ÷ this — p10 · median · p90', (r) => r.size.map((v) => fx(v, 2)).join(' · '));
  line('parts with no counterpart in the other drawing', (r) => `${nf(r.dropped)} in A · ${nf(r.added)} in B`);
  const k = (c, n) => `${fx((100 * c['open line']) / n, 0)} · ${fx((100 * c['closed shape']) / n, 0)} · ${fx((100 * c.dot) / n, 0)}%`;
  line('… of which open lines · closed shapes · dots', (r) => `A ${k(r.kd, r.dropped)} · B ${k(r.ka, r.added)}`);
  const sh = (c, n, key) => (100 * c[key]) / n;
  const all = { 'Core 24 → UI 18 dropped': [a.kd, a.dropped], 'Core 24 → UI 18 added': [a.ka, a.added], 'UI 18 → 12 dropped': [b.kd, b.dropped], 'UI 18 → 12 added': [b.ka, b.added] };
  const kinds = (key) => rng(cellsOf(`§4.4 vanishing ${key}s`, Object.keys(all), (k) => sh(...all[k], key)));
  out(`The parts that vanish or appear: open lines ${kinds('open line')}, closed shapes ${kinds('closed shape')}, dots ${kinds('dot')}; the parts that stay move by a median ${fx(a.dC[0], 2)} · ${fx(b.dC[0], 2)} of a stroke`);
  const ci = C.core24_ui18, ui = C.ui18_ui12;
  out(`Ink view at the same strictness (>2% of ink unmatched): ${pc1(1 - ci.unchanged)} of Core ↔ UI pairs and ${pc1(1 - ui.unchanged)} of UI 18 → 12; part view ${pc1(a.cat['dropped/added'])} and ${pc1(b.cat['dropped/added'])}. Looser: ${pc1(ci.over5)} and ${pc1(ui.over5)} over 5%, ${pc1(ci.changed)} and ${pc1(ui.changed)} over 10%`);
}

async function secS45(d) {
  head('§4.5 What the redraws look like');
  const dd = await d.dd();
  const cj = (f, g, key, v) => { const x = dd.filter((r) => r.fam === f && r.grid === g && r.klass === 'outline' && r.own > 0); return pc1(share(x, (r) => r[key] === v)); };
  out(`caps: Core 24 square ${cj('Core', 24, 'cap', 'square')} / mixed ${cj('Core', 24, 'cap', 'mixed')}, UI 18 round ${cj('UI', 18, 'cap', 'round')}; joins: Core 24 mitre ${cj('Core', 24, 'join', 'miter')}, UI 18 round ${cj('UI', 18, 'join', 'round')}`);
  const nfill = (r) => (r.paint.fill || 0) + (r.paint.both || 0);
  const solid = (f, big, small) => {
    const A = firstPerName(dd.filter((r) => r.klass === 'outline' && r.fam === f && r.grid === big)), B = firstPerName(dd.filter((r) => r.klass === 'outline' && r.fam === f && r.grid === small));
    const dl = [...A.keys()].filter((n) => B.has(n)).map((n) => nfill(B.get(n)) - nfill(A.get(n)));
    return { more: share(dl, (v) => v > 0), fewer: share(dl, (v) => v < 0) };
  };
  const u = solid('UI', 18, 12), c = solid('Core', 48, 24);
  out(`solid (filled) parts at the smaller grid: rise in ${pc0(u.more)} of UI concepts and fall in ${pc0(u.fewer)}; Core 48 → 24 rise in ${pc0(c.more)}, fall in ${pc0(c.fewer)}`);
  const D = detailTable(dd.filter((r) => r.fam === 'Core' && r.klass === 'outline'), CORE_GRIDS);
  out(`mean parts per concept: ${CORE_GRIDS.map((g) => fx(D.parts[g], 2)).join(' → ')} (24 → 32 → 48)`);
  out('(The named examples and the 28 overlay sheets are a look, not a census.)');
}

async function secS46(d) {
  head('§4.6 Detail by grid, for the same concept');
  const dd = await d.dd(), O = await d.ours();
  const core = detailTable(dd.filter((r) => r.fam === 'Core' && r.klass === 'outline'), CORE_GRIDS);
  const ui = detailTable(dd.filter((r) => r.fam === 'UI' && r.klass === 'outline'), UI_GRIDS);
  const ours = detailTable(O, OUR_UP);
  out('| | Mean parts | Concepts with the same parts | Bigger grid has more | Bigger grid has fewer | Mean segments |');
  const row = (lab, T, a, b) => { const s = T.step(a, b); out(`| ${lab} | ${fx(T.parts[a], 2)} → ${fx(T.parts[b], 2)} | ${pc1(s.same)} | ${pc1(s.more)} | ${s.fewer ? pc1(s.fewer) : '0'} | ${fx(T.segs[a], 1)} → ${fx(T.segs[b], 1)} |`); return s; };
  row('Core 24 → 32', core, 24, 32); const c48 = row('Core 32 → 48', core, 32, 48); row('Core 24 → 48', core, 24, 48);
  const u = row('UI 12 → 18', ui, 12, 18);
  row('**Ours 16 → 20**', ours, 16, 20); row('**Ours 20 → 24**', ours, 20, 24); const o = row('**Ours 16 → 24**', ours, 16, 24);
  out(`(concepts at every grid: Core ${nf(core.n)}, UI ${nf(ui.n)}, ours ${ours.n})`);
  out(`At the same ×1.5 step their rate is ${fx(shareRatio(u.more, o.more), 1)} times ours (UI 12 → 18: ${pc1(u.more)}, against our 16 → 24: ${pc1(o.more)}); at Core 32 → 48 it is ${fx(shareRatio(c48.more, o.more), 1)} times`);
}

async function secS5(d) {
  head('§5 What is held and what is let go — the list');
  const S = await sameConcept(d), C = await chainRows(d), dd = await d.dd(), O = await d.ours(), R = await s1Strokes(d);
  const nuc = Object.keys(S).filter((k) => !k.startsWith('Ours')), our = Object.keys(S).filter((k) => k.startsWith('Ours'));   // the §3 same-concept rows
  const r2 = (v) => fx(npRound(v, 2), 2);
  const span2 = (site, ks, f, left = []) => { const v = cellsOf(site, ks, f, 2, left); return `×${r2(Math.min(...v))} – ${r2(Math.max(...v))}`; };
  const core = detailTable(dd.filter((r) => r.fam === 'Core' && r.klass === 'outline'), CORE_GRIDS), ui = detailTable(dd.filter((r) => r.fam === 'UI' && r.klass === 'outline'), UI_GRIDS);
  const stepOf = { 'Core 24 → 32': core.step(24, 32), 'Core 32 → 48': core.step(32, 48), 'Core 24 → 48': core.step(24, 48), 'UI 12 → 18': ui.step(12, 18) };
  const ours = detailTable(O, OUR_UP);
  const ourStepOf = { 'Ours 20 → 24': ours.step(20, 24), 'Ours 16 → 20': ours.step(16, 20), 'Ours 16 → 24': ours.step(16, 24) }, allSteps = { ...stepOf, ...ourStepOf };
  out(`Nucleo — held: the stroke (${[...new Set(['Core 24', 'UI 18'].map((k) => fx(R[k].stroke, 1)))].join(' or ')}); scaled: the ink (${span2('§5 Nucleo ink ×', nuc, (k) => S[k].ink.ratio, our)}), the air floor (${span2('§5 Nucleo air ×', nuc, (k) => S[k].air.ratio, our)}), Core's container radius (${span2('§5 Core radius ×', nuc.slice(0, 3), (k) => S[k].radius.ratio, ['UI 12 → 18', ...our])})`);
  out(`  let go: the number of parts (${rng(cellsOf('§5 parts differ', Object.keys(stepOf), (k) => 100 * (1 - allSteps[k].same), 0, Object.keys(ourStepOf)))} of concepts differ; ${rng(cellsOf('§5 parts gained', Object.keys(stepOf), (k) => 100 * allSteps[k].more))} gain parts on the bigger grid); exact position: ${rng(cellsOf('§5 nudged', SIZE_CHAINS, (k) => 100 * C[k].nudged, 0, ['core24_ui18', ...OUR_CHAIN_KEYS]))} of the ink nudged by 0.25 – 1 stroke`);
  out(`  margin: ${['Core 24', 'Core 32'].map((k) => sm(R[k].marginMode)).join(' and ')} px at Core 24 and 32; ${sm(R['UI 12'].marginMode)} at UI 12, ${sm(R['Core 48'].marginMode)} at Core 48`);
  out(`Ours — held: the air (${span2('§5 our air ×', our, (k) => S[k].air.ratio, nuc)}); the stroke at 24/20 (${fx(R['Ours 24'].stroke, 1)}), then ×${fx(R['Ours 20'].stroke / R['Ours 16'].stroke, 1)} at 16; scaled: the ink (${span2('§5 our ink ×', our, (k) => S[k].ink.ratio, nuc)}), the container radius (${span2('§5 our radius ×', our, (k) => S[k].radius.ratio, nuc)}); let go: ${rng(cellsOf('§5 our parts differ', Object.keys(ourStepOf), (k) => 100 * (1 - allSteps[k].same), 0, Object.keys(stepOf)))} of concepts' parts; the share of canvas (ink ${OUR_KEYS.map((k) => fx(R[k].ink50Pct, 0)).join(' → ')}%); the margin (${OUR_KEYS.map((k) => sm(R[k].marginMode)).join(' · ')})`);
}

/** K2: does every (set, grid) carry one stroke_max value? rows = [{t: set, g: grid, v: value}]. */
export function oneValuePerSetGrid(rows) {
  const perSetGrid = new Map(); for (const x of rows) { const k = `${x.t}|${x.g}`; perSetGrid.set(k, (perSetGrid.get(k) || new Set()).add(x.v)); }
  return [...perSetGrid.values()].every((s) => s.size === 1);
}
async function secS6(d) {
  head('§6 Findings');
  const dots = await d.dots();
  const med = (f, g) => dotCell(dots.filter((x) => x.fam === f && x.grid === g)).med;
  out(`K1. dot-to-stem air: ${fx(med('Core', 24), 2)} px (Core 24), ${fx(med('Core', 32), 2)} (Core 32), ${fx(med('UI', 18), 2)} (UI 18), ${fx(med('UI', 12), 2)} (UI 12), ${fx(med('Sharp', 24), 2)} (Sharp 24); Pixel ${fx(med('Pixel', 24), 2)}`);
  const { db } = await d.db();
  const total = db.prepare('SELECT COUNT(*) n FROM icons').get().n;
  const L = db.prepare(`SELECT s.title t, i.grid g, i.stroke_max v, COUNT(*) n FROM icons i JOIN sets s ON s.id=i.set_id WHERE i.stroke_max IS NOT NULL GROUP BY s.title, i.grid, i.stroke_max ORDER BY s.title, i.grid`).all();
  const n = L.reduce((s, x) => s + x.n, 0), sets = [...new Set(L.map((x) => x.t))];
  const oneValue = oneValuePerSetGrid(L);
  out(`K2. stroke_max is set on ${nf(n)} of ${nf(total)} icons (${pc1(n / total)}), in ${sets.length} sets — ${sets.map((t) => `${t.replace('Nucleo ', '')} ${L.filter((x) => x.t === t).reduce((s, x) => s + x.n, 0)}`).join(', ')} — one value per set and grid: ${oneValue ? 'yes' : 'no'} (${L.map((x) => `${x.t.replace('Nucleo ', '')} ${x.g}: ${x.v}`).join('; ')})`);
  const A = Object.fromEntries((await airRows(d)).map((r) => [r.label, r])), S = await sameConcept(d);
  const k3 = cellsOf('§6 K3 Nucleo air × (×1.33 – 1.5 steps)', ['Core 24 → 32', 'Core 32 → 48', 'UI 12 → 18'], (k) => S[k].air.ratio, 2, ['Core 24 → 48']);
  out(`K3. our floor is ${fx((100 * A['Ours 24'].p10) / 24, 1)}% of the 24 canvas and ${fx((100 * A['Ours 16'].p10) / 16, 1)}% of the 16; ×${fx(S['Ours 20 → 24'].air.ratio, 2)} against ×${fx(Math.min(...k3), 2)} – ${fx(Math.max(...k3), 2)} for the same step`);
  const R = await s1Strokes(d), C = await chainRows(d);
  out(`K4. typical drawing ${OUR_KEYS.map((k) => fx(R[k].ink50Pct, 1)).join(' · ')}% of the canvas (ring ${OUR_KEYS.map((k) => fx(R[k].keylinePctCanvas, 1)).join(' · ')}%); held ink ×${fx(C.ours24_20.fit, 3)} at 20 and ×${fx(C.ours20_16.fit, 3)} at 16; Core ${CORE_KEYS.map((k) => fx(R[k].ink50Pct, 1)).join(' · ')}%`);
  const dd = await d.dd(), O = await d.ours();
  const core = detailTable(dd.filter((r) => r.fam === 'Core' && r.klass === 'outline'), CORE_GRIDS), ui = detailTable(dd.filter((r) => r.fam === 'UI' && r.klass === 'outline'), UI_GRIDS), ours = detailTable(O, OUR_UP);
  const k5 = { 'Ours 20 → 24': ours.step(20, 24), 'Ours 16 → 20': ours.step(16, 20), 'Ours 16 → 24': ours.step(16, 24), 'Core 24 → 32': core.step(24, 32), 'Core 32 → 48': core.step(32, 48), 'Core 24 → 48': core.step(24, 48), 'UI 12 → 18': ui.step(12, 18) };
  const k5o = Object.keys(k5).filter((k) => k.startsWith('Ours')), k5n = Object.keys(k5).filter((k) => !k.startsWith('Ours'));
  out(`K5. our detail budget differs in ${rng(cellsOf('§6 K5 ours', k5o, (k) => 100 * (1 - k5[k].same), 0, k5n))} of concepts, theirs in ${rng(cellsOf('§6 K5 theirs', k5n, (k) => 100 * (1 - k5[k].same), 0, k5o))}`);
  out('Kind 1 — our drawings under one stroke of air (the §3 table\'s floor ÷ stroke < 0.995):');
  for (const g of OUR_MASTERS) {
    const x = belowOneStroke(O.filter((r) => r.grid === g && r.gaps));
    const glyph = x.filter((o) => o.r.glyph), names = (L) => L.map((o) => `${o.r.name} ${fx(o.f.fl, 2)}`).join(', ');
    out(`  ${g}: ${x.length} of ${A[`Ours ${g}`].n} (${pc0(x.length / A[`Ours ${g}`].n)}); glyph-noted concepts ${glyph.length}; the others: ${names(x.filter((o) => !o.r.glyph)) || 'none'}`);
  }
}

async function secS7(d) {
  head('§7 What only Maruti\'s eye can settle — the figures it quotes');
  const R = await s1Strokes(d), A = Object.fromEntries((await airRows(d)).map((r) => [r.label, r]));
  const dd = await d.dd(), O = await d.ours();
  const ui = detailTable(dd.filter((r) => r.fam === 'UI' && r.klass === 'outline'), UI_GRIDS), ours = detailTable(O, OUR_UP);
  out(`1. the 16 holds ${fx(A['Ours 16'].p10, 1)} px of air; UI's floor (${fx(A['UI 18'].p10, 1)} px) in its place would be ×${fx(A['UI 18'].p10 / A['Ours 16'].p10, 2)}`);
  out(`2. UI 12 fills ${pc0(R['UI 12'].ink50Pct / 100)}; Core holds ${rng(cellsOf('§7 Core ink share', CORE_KEYS, (k) => R[k].ink50Pct, 0, UI_KEYS))}; ours falls to ${pc0(R['Ours 20'].ink50Pct / 100)} at 20`);
  out(`3. ${pc1(1 - ours.step(16, 24).same)} of our concepts differ in parts between 24 and 16; UI 18 → 12 differs in ${pc1(1 - ui.step(12, 18).same)}`);
  const parts = (n) => partsAt(O, n);
  out(`   (the four concepts the document names, parts at 24/20/16: ${['gear-3', 'building', 'sliders-2', 'trash'].map((n) => `${n} ${parts(n)}`).join(', ')} — a pick, not a census)`);
}

async function secS8(d) {
  head('§8 Independently re-derived');
  const { db } = await d.db();
  const q = `SELECT i.id, i.set_id, i.grid, COALESCE(g.title, CASE WHEN s.title LIKE 'Nucleo % Essential' THEN REPLACE(s.title, ' Essential', '') END) fam
    FROM icons i JOIN sets s ON s.id = i.set_id LEFT JOIN groups g ON g.id = s.group_id WHERE i.klass = 'outline' AND i.grid IN (12, 18, 24, 32, 48)`;
  const sw = new Map(), rad = new Map();
  for (const r of db.prepare(q).all()) {
    if (!r.fam || !/^Nucleo (Core|UI)$/.test(r.fam)) continue;
    const f = N.svgFile({ set_id: r.set_id, id: r.id });
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, 'utf8'), key = `${famShort(r.fam)} ${r.grid}`;
    if (!sw.has(key)) sw.set(key, new Map());
    for (const m of t.matchAll(/stroke-width="([\d.]+)"/g)) sw.get(key).set(m[1], (sw.get(key).get(m[1]) || 0) + 1);
    if (r.id % 3 === 0) {
      if (!rad.has(key)) rad.set(key, []);
      for (const m of t.matchAll(/<path[^>]*\sd="([^"]+)"/g)) { try { rad.get(key).push(...quarterTurnRadii(m[1])); } catch { /* unparsable d: skipped, as the card's try/except did */ } }
    }
  }
  const top = (k, v) => { const c = sw.get(k), tot = [...c.values()].reduce((s, x) => s + x, 0), x = (c.get(v) || 0) / tot; return x === 1 ? '100%' : pc1(x); };
  out(`stroke-width="2" in ${top('Core 24', '2')} / ${top('Core 32', '2')} / ${top('Core 48', '2')} of the attributes in Core 24 / 32 / 48; "1.5" in ${top('UI 12', '1.5')} / ${top('UI 18', '1.5')} of UI 12 / 18's`);
  const cell = (k) => { const L = rad.get(k) || [], vc = valueCounts(L); return L.length ? `${k} **${fx(vc[0][0], 1)}** (${pc0(vc[0][1] / L.length)} of ${nf(L.length)})` : `${k} — (no quarter-turn corner)`; };
  out(`modal quarter-turn corner radius, every third drawing (svgpathtools reading, ported): ${[...CORE_KEYS, ...UI_KEYS].map(cell).join(', ')}`);
  out('[not reprinted by a committed tool: the ink bands re-implemented with svgpathtools + a KD-tree on 24 pairs chosen by python\'s seeded random.shuffle — the card\'s own research/references/nucleo/card-2.3/ink_indep.py (gitignored) prints them with python3 + svgpathtools + scipy in < 1 s]');
}

/** "rises" / "falls" / "holds" from the first value to the last. */
export const trend = (v) => (v[v.length - 1] > v[0] ? 'rises' : v[v.length - 1] < v[0] ? 'falls' : 'holds');
async function secShort(d) {
  head('The short answer');
  const R = await s1Strokes(d), S = await sameConcept(d), T = Object.fromEntries((await cornerTable(d)).map((r) => [`${r.f} ${r.g}`, r]));
  const A = Object.fromEntries((await airRows(d)).map((r) => [r.label, r])), C = await chainRows(d), V = await d.verdicts();
  const dd = await d.dd(), O = await d.ours();
  const core = CORE_KEYS, ui = UI_KEYS, ours = OUR_KEYS;
  out(`1. Core's line is ${fx(R['Core 24'].stroke, 1)} px at 24, 32 and 48 (${pc0(Math.min(...cellsOf('short 1 Core stroke share', core, (k) => R[k].strokeShare, 2, ui)))} of ${nf(core.reduce((s, k) => s + R[k].n, 0))} drawings); UI's is ${fx(R['UI 18'].stroke, 1)} px at 12 and 18 (${rng(cellsOf('short 1 UI stroke share', ui, (k) => 100 * R[k].strokeShare, 0, core))} of ${nf(ui.reduce((s, k) => s + R[k].n, 0))})`);
  out(`   ink ×${fx(S['Core 24 → 32'].ink.ratio, 2)} for ×${fx(32 / 24, 2)}; ×${fx(S['Core 32 → 48'].ink.ratio, 2)} for ×${fx(1.5, 1)}; air ×${fx(S['Core 24 → 32'].air.ratio, 2)} for ×1.33, ×${fx(S['Core 32 → 48'].air.ratio, 2)} for ×1.5, ×${fx(S['UI 12 → 18'].air.ratio, 2)} for UI's ×1.5`);
  out(`   radius Core ${core.map((k) => fx(T[k].modal, 0)).join(' → ')} px, UI ${ui.slice().reverse().map((k) => fx(T[k].modal, 0)).join(' → ')}; stroke share ${trend(core.map((k) => R[k].strokePctCanvas))} ${core.map((k) => fx(R[k].strokePctCanvas, 1)).join(' → ')}% in Core (24 → 32 → 48) and ${trend(ui.map((k) => R[k].strokePctCanvas))} ${ui.map((k) => fx(R[k].strokePctCanvas, 1)).join(' → ')}% in UI (18 → 12)`);
  const ourSteps = Object.keys(S).filter((k) => k.startsWith('Ours'));   // the §3 same-concept rows for our masters
  const oa = cellsOf('short 2 our air ×', ourSteps, (k) => S[k].air.ratio, 2, Object.keys(S).filter((k) => !ourSteps.includes(k)));
  out(`2. ours: tightest air ×${fx(Math.min(...oa), 2)} – ${fx(Math.max(...oa), 2)} (${fx(A['Ours 24'].p10, 1)} px at all three), stroke ×${fx(R['Ours 24'].stroke / R['Ours 20'].stroke, 1)} then ×${fx(R['Ours 20'].stroke / R['Ours 16'].stroke, 1)}, margin ${ours.map((k) => sm(R[k].marginMode)).join(' · ')}`);
  const six = SIX_KEYS;
  out(`3. radius ÷ stroke: ${six.map((k) => `${k} ${fx(T[k].perStroke, 2)}×`).join(', ')}; one radius on ${rng(cellsOf('short 3 six modal share', six, (k) => 100 * T[k].shareModal, 0, ['Sharp 24', 'Pixel 24']))} of each grid's rounded container corners; ours ${ours.map((k) => sm(T[k].modal)).join(' · ')} — ${ours.map((k) => `${fx(T[k].perStroke, 2)}×`).join(', ')} (the share on it in the document cites card 1.2)`);
  out(`4. p10 air: ${core.map((k) => fx(A[k].p10, 1)).join(' · ')} px in Core (${core.map((k) => fx((100 * A[k].p10) / A[k].side, 1)).join(' · ')}% of the canvas, ${core.map((k) => fx(A[k].s10, 2)).join(' · ')} of the stroke), ${ui.map((k) => fx(A[k].p10, 1)).join(' · ')} px in UI; ours ${fx(A['Ours 24'].p10, 1)} px (${ours.map((k) => fx((100 * A[k].p10) / A[k].side, 1)).join(' · ')}%, ${ours.map((k) => fx(A[k].s10, 1)).join(' · ')} strokes)`);
  const coreD = detailTable(dd.filter((r) => r.fam === 'Core' && r.klass === 'outline'), CORE_GRIDS), uiD = detailTable(dd.filter((r) => r.fam === 'UI' && r.klass === 'outline'), UI_GRIDS), ourD = detailTable(O, OUR_UP);
  const gain = { 'UI 12 → 18': uiD.step(12, 18), 'Core 24 → 32': coreD.step(24, 32), 'Core 32 → 48': coreD.step(32, 48), 'Core 24 → 48': coreD.step(24, 48) };
  const og = { 'Ours 20 → 24': ourD.step(20, 24), 'Ours 16 → 20': ourD.step(16, 20), 'Ours 16 → 24': ourD.step(16, 24) }, gl = (f) => (k) => f(gain[k] ?? og[k]);
  out(`5. the bigger grid carries more parts in ${rng(cellsOf('short 5 more parts', Object.keys(gain), gl((s) => 100 * s.more)))} of concepts (UI 12 → 18: ${pc0(gain['UI 12 → 18'].more)}; Core 24 → 48: ${pc0(gain['Core 24 → 48'].more)}) and fewer in ${rng(cellsOf('short 5 fewer parts', Object.keys(gain), gl((s) => 100 * s.fewer), 0, Object.keys(og)))}; ours 24 → 16: ${pc1(ourD.step(16, 24).more)} shed, ${pc0(ourD.step(16, 24).fewer)} gain; >5% extra ink ${pc0(C.core24_core32.bigDetail)} (24 → 32) and ${pc0(C.core32_core48.bigDetail)} (32 → 48)`);
  const v = Object.fromEntries(Object.entries(V).map(([k, L]) => [k, verdictRow(L)]));
  out(`6. "redrawn": ${pc1(v.core24_core32.redrawn)} Core 24 → 32, ${pc1(v.core32_core48.redrawn)} Core 32 → 48, ${pc1(v.ui18_ui12.redrawn)} UI 18 → 12, ${pc1(v.core24_ui18.redrawn)} Core 24 → UI 18 (+${fx(100 * (v.core24_ui18.redrawn - v.core24_core32.redrawn), 0)} points); stroke ${pc1(R['Core 24'].strokePctCanvas / 100)} of Core 24, ${pc1(R['Core 48'].strokePctCanvas / 100)} of Core 48, ${pc1(R['UI 12'].strokePctCanvas / 100)} of UI 12`);
  const size = SIZE_CHAINS;
  out(`   ${rng(cellsOf('short 6 unchanged', size, (k) => 100 * C[k].unchanged, 0, ['core24_ui18', ...OUR_CHAIN_KEYS]))} of size-only pairs unchanged within 2% of ink; nudged ${rng(cellsOf('short 6 nudged', size, (k) => 100 * C[k].nudged, 0, ['core24_ui18', ...OUR_CHAIN_KEYS]))} of the ink`);
  out(`7. ours 24 → 16 unchanged ${pc0(C.ours24_16.unchanged)} against UI 18 → 12 ${pc0(C.ui18_ui12.unchanged)}; changed >10% ${pc0(C.ours24_16.changed)} against ${pc0(C.ui18_ui12.changed)}; ours 24 → 20 and 20 → 16 ${pc0(C.ours24_20.unchanged)} and ${pc0(C.ours20_16.unchanged)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════

export const SECTIONS = {
  short: secShort, sample: secSample, s1: secS1, s2: secS2, s3: secS3, 's4.1': secS41, 's4.2': secS42, 's4.3': secS43,
  's4.4': secS44, 's4.5': secS45, 's4.6': secS46, s5: secS5, s6: secS6, s7: secS7, s8: secS8,
};
const USAGE = `usage: node tools/audit/nucleo-probe.mjs <pin-dir> [section …] [--cache <dir>] [--refs <dir>]
  sections: ${Object.keys(SECTIONS).join(' ')}`;

export async function main(argv) {
  const valued = new Set(['--cache', '--refs']);
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) { if (valued.has(argv[i])) opt[argv[i].slice(2)] = argv[++i]; else if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = true; else pos.push(argv[i]); }
  const pin = pos[0] ? path.resolve(pos[0]) : null;
  if (!pin || !fs.existsSync(path.join(pin, 'src/icons/24'))) { console.error(USAGE); return 2; }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !SECTIONS[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${USAGE}`); return 2; }
  const d = makeData(pin, { cacheDir: opt.cache ? path.resolve(opt.cache) : null });
  console.log(`# nucleo-probe — docs/audit/references-nucleo.md (card 2.3) · pin ${pin}`);
  try {
    for (const s of wanted.length ? wanted : Object.keys(SECTIONS)) await SECTIONS[s](d);
  } catch (e) {
    if (e instanceof CacheMismatch) { console.error(e.message); return 2; }
    throw e;
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(e.stack || e); process.exit(1); });
}
