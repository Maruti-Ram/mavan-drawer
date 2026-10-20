#!/usr/bin/env node
// Every measured figure in docs/audit/findings-grid.md (card 1.6, axis F7 "crisp at 16"),
// printed again from the pin. AUDIT ONLY — imported by nothing; reads the pin, writes nothing.
//
// Usage:
//   P=<scratch>/pin; git archive 5933041 | tar -x -C $P            (no build needed)
//   node tools/audit/grid-probe.mjs $P [section …]
// No section = all. Each section prints `## §<n> <title>` and then the figures in the
// document's order, rounding and units; where the document has a table, the probe prints the
// same table (same header, same row order, same cell format) so the two can be laid side by side.
//
// Sections and the document § each one backs:
//   s0     §0  the short version (and the header's drawing count): headline counts, bands, midline,
//              masters, 2×, filled, outer edges
//   s1     §1  the definitions table's measured values (0.625 midline peak; the analytic profile
//              checked against the rasteriser on 48 lines — also the method paragraph's figure)
//   s1.1   §1.1 the raster.mjs bug repro, independence of the landing score, the half-tone bypass,
//              the diagonalShare and arcExtremes defects (with an independent re-implementation)
//   s2     §2  the profile key (exact geometry + instrument score), the 45° probe, shipped diagonals
//   s3.1   §3.1 J / D / A / N per style and master; the unfiltered top of the ranking
//   s3.2   §3.2 census table, bands table, the 0.5 tie, the filled bands
//   s3.3   §3.3 every outline ≥ 0.65 with its twin, the 0.750 group, plug-3, soft-run causes
//   s3.4   §3.4 where centrelines sit
//   s3.5   §3.5 outer edges on pixel lines; half-pixel outer edges
//   s3.6   §3.6 filled weight-2 runs; every filled drawing ≥ 0.65 with its twin
//   s4.1   §4.1 the instrument at 24 and 20
//   s4.2   §4.2 fully inked pixel by master
//   s4.3   §4.3 on a 2× screen
//   s5     §5  what the instrument cannot see
//   s6     §6  the judged list's figures (G-1 … G-9)
//   s7     §7  noticed in passing (zero-length arcs, arc-extreme noise)
//   appA1  Appendix A1 every outline at 16
//   appA2  Appendix A2 every filled drawing at 16
//   appB   Appendix B 24 and 20, every drawing
// Appendix C (method) states no measured figure. Two §-figures belong to card 1.5 and are
// printed by tools/audit/mass-probe.mjs, not here: the area-bug scope ("270 of 1,026 … up to
// 10 px²", §1.1) and the identical-drawing sets ("14 sets", §7).
//
// Instruments: tools/audit/pixelgrid.mjs (blurScore, edgeLanding, probe, rowProfile),
// tools/audit/raster.mjs (readIcon, regionOf, flatten, rasterise, inkArea, areaRegion),
// tools/geometry.mjs (parsePath). The repo's copies are used: the pin has no tools/audit/.
// geometry.mjs has gained code since the pin, but parsePath, the only part of it this probe reaches,
// is unchanged (checked 2026-10-20 against the pin's own copies: identical output on all 2,910 pin drawings, values deep-equal).
//
// Known instrument defects (plans/set-and-rules-audit.md) and how this probe treats them:
//   · raster.mjs `classify` drops an area path's horizontal edges, so `rasterise` (and
//     blurScore().halfToneShare) is wrong on shape-filled files. Every half-tone figure printed
//     here is taken with `bypassRasterise` (covered() at every sample, no classify — card 1.5/1.6's
//     own bypass, bf.mjs). The instrument's value is used only in s1.1, to count what changed.
//     The §2 profiles and the 45° probe rasterise stroke-only probes, which the defect cannot touch.
//   · pixelgrid `blurScore` is a constant 0.500 on straight runs at stroke 1.5 — not worked around:
//     it IS a finding of this document (§4.1); s4.1 prints it.
//   · pixelgrid `diagonalShare` restarts a fragment after every arc — reported as the instrument
//     gives it (the document's choice); s1.1 models the defect and counts what it moves.
//   · pixelgrid `arcExtremes` keeps or drops an arc's end extreme on float noise — the scores are
//     the instrument's; s1.1 and s7 count the difference against an independent re-implementation
//     (the card's reviewer's, pg_lib.mjs, restated here as `independentEdges`).
//
// Stored-value rounding. The card stored each drawing's figures rounded (scores, shares 4 dp;
// lengths 3 dp; centreline 4 dp) and built every table from the stored values. The probe keeps
// that pipeline (`measureDrawing`), because the tables' last digits, the 0.5 band tie and the
// appendix's double rounding depend on it.
//
// It reads no reference data, so it takes no --refs; it needs no build of the pin either.
// Flags: --timing prints each section's run time.
//
// Run time on this machine (2026-10-08, single thread, other agents running): the per-drawing
// census (blurScore at rate 32 on all 2,910 files, needed by every section) 47–90 s; s1.1 89–113 s
// (the half-tone bypass and the independent landing score on all 2,910 files); appA1 / appA2 / s5
// alone add ~25 s for the 16-master bypass (shared when run together); every other section < 1 s.
// A full run took 2 min 16 s – 3 min 42 s, under the five minutes that would call for a cache.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parsePath } from '../geometry.mjs';
import { readIcon, regionOf, flatten, rasterise, inkArea, areaRegion } from './raster.mjs';
import { blurScore, edgeLanding, probe, rowProfile } from './pixelgrid.mjs';

// ── parameters the card chose (recovered from its scripts; never tuned) ────────
export const RATE = 32;            // grid_shard.mjs / gen_grid_tables.mjs: every raster at rate 32
export const MIN_RUN = 0.5;        // a straight run shorter than this is not a run (pixelgrid's own default)
export const JUDGE_DIAG = 0.5;     // judgeable: runCount > 0 and diagonalShare < 0.5
export const BANDS = [['A', 0, 0.30], ['B', 0.30, 0.50], ['C', 0.50, 0.70], ['D', 0.70, 9]];
export const TOP = 0.65;           // §3.3 / §3.6 list every drawing scoring at least this
export const SOLID = 0.999;        // a pixel this covered counts as fully inked
export const PARTIAL = 0.995;      // half-tone: a pixel above 0 and below this is part-covered (pixelgrid)
export const ON_LINE = 0.011;      // an outer edge within this of a whole number is on a pixel line
export const HALF_OFF = 0.49;      // an outer edge at least this far off is on a half pixel
export const CHANGED = 5e-4;       // a stored 4-dp value that moved by more than this changed
export const MASTERS = [24, 20, 16];
export const STYLES = ['outline', 'filled'];

// ── small helpers ─────────────────────────────────────────────────────────────
export const round = (n, k = 4) => (n == null ? n : Math.round(n * 10 ** k) / 10 ** k);
/** Quantile, linear interpolation between order statistics (the card's `q`). */
export const q = (a, p) => { const s = [...a].sort((x, y) => x - y); const i = p * (s.length - 1); const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const f3 = (v) => (v == null ? '—' : v.toFixed(3));
const f2 = (v) => (v == null ? '—' : v.toFixed(2));
const pc = (a, b, d = 1) => `${(100 * a / b).toFixed(d)}%`;
const md = (head, body, aligns) => [
  `| ${head.join(' | ')} |`,
  `|${aligns.map((a) => (a === 'l' ? '---' : '---:')).join('|')}|`,
  ...body.map((r) => `| ${r.join(' | ')} |`),
  '',                                                       // a blank line ends the table, as in the document
].join('\n');
const tick = (n) => '`' + n + '`';
/** edgeLanding reads only `icon` from a {icon, region} pair; this placeholder skips building a region it never uses. */
const NO_REGION = Object.freeze({});
const off = (e) => Math.abs(e - Math.round(e));

// ── the per-drawing record (grid_shard.mjs, folded in) ──────────────────────────

/**
 * Every straight segment of one `d`, with `Z` closing to the subpath start and extra `M`
 * pairs as line-tos. Arcs are skipped (they are not runs). This is the card's own walker,
 * NOT pixelgrid's private flattenRuns (whose `Z` after an arc is the defect s1.1 counts).
 */
export function straightRuns(d) {
  const out = []; let cx = 0, cy = 0, sx = 0, sy = 0;
  const seg = (ax, ay, bx, by) => out.push({ ax, ay, bx, by, len: Math.hypot(bx - ax, by - ay) });
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    if (up === 'Z') { seg(cx, cy, sx, sy); cx = sx; cy = sy; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; if (k === 0) { sx = x; sy = y; } else seg(cx, cy, x, y); cx = x; cy = y; }
      else if (up === 'L') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; seg(cx, cy, x, y); cx = x; cy = y; }
      else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; seg(cx, cy, x, cy); cx = x; }
      else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; seg(cx, cy, cx, y); cy = y; }
      else { const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]]; cx = ex; cy = ey; }
    }
  }
  return out;
}

/**
 * The analytic pixel profile across a straight run whose ink spans [e1, e2] in device px:
 * the darkest single pixel and whether any pixel is fully inked. `tol` guards the integer
 * edges against float noise (the card's tables used 1e-9; its per-drawing record used 0).
 */
export function pixelProfile(e1, e2, tol = 0) {
  let peak = 0, core = false;
  for (let k = Math.floor(e1 + tol); k < Math.ceil(e2 - tol); k++) {
    const c = Math.max(0, Math.min(k + 1, e2) - Math.max(k, e1));
    if (c > peak) peak = c;
    if (c >= SOLID) core = true;
  }
  return { peak, core };
}

/** Outline-file note → the kind of drawing (kinds.mjs). */
export const kindOfText = (src) => (/<!--\s*keyline:\s*mark\s*-->/.test(src) ? 'mark' : /<!--\s*box:/.test(src) ? 'box' : /<!--\s*anchor:/.test(src) ? 'anchor' : 'silhouette');

/** J judgeable · N no axis-aligned edge · D diagonal-heavy · A arcs only (on the stored values). */
export const judge = (r) => r.runCount > 0 && (r.diagonalShare ?? 0) < JUDGE_DIAG;
export const kindOf = (r) => (judge(r) ? 'J' : r.blur == null ? 'N' : (r.diagonalShare != null && r.diagonalShare >= JUDGE_DIAG) ? 'D' : 'A');

/** One drawing, as the card stored it. `file` is a path; the master is the file's own canvas. */
export function measureDrawing(file, { rate = RATE } = {}) {
  const icon = readIcon(file);
  const px = icon.canvas;                                   // own size: one device px per master unit
  const reg = regionOf(icon);
  const b = blurScore({ icon, region: reg }, px, { rate });
  let total = 0, axial = 0, diag = 0, runLen = 0, wPeak = 0, coreLen = 0;
  const runs = [];
  for (const p of icon.paths) {
    if (p.kind !== 'stroke') continue;
    const h = p.weight / 2;
    for (const sp of flatten(p.d)) {
      const pts = sp.pts; let l = 0;
      for (let i = 0; i + 1 < pts.length; i++) l += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      if (sp.closed) l += Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]);
      total += l;
    }
    for (const r of straightRuns(p.d)) {
      if (r.len < MIN_RUN) continue;
      const horiz = r.ay === r.by, vert = r.ax === r.bx;
      if (horiz || vert) {
        axial += r.len;
        const c = horiz ? r.ay : r.ax;
        const pr = pixelProfile(c - h, c + h);
        runs.push([horiz ? 1 : 0, round(c, 4), round(r.len, 3), p.weight]);
        runLen += r.len; wPeak += r.len * pr.peak; if (pr.core) coreLen += r.len;
      } else diag += r.len;
    }
  }
  const bb = reg.bbox;
  return {
    master: icon.master, name: icon.name, concept: icon.name.replace(/-filled$/, ''), style: icon.filled ? 'filled' : 'outline',
    canvas: icon.canvas, hasArea: icon.paths.some((p) => p.kind === 'area'),
    blur: round(b.blur, 4), straightOnly: round(b.straightOnly, 4), blurExact: b.blur, straightExact: b.straightOnly,
    edgeCount: b.edgeCount, runCount: b.runCount, diagonalShare: round(b.diagonalShare, 4),
    halfToneInstrument: round(b.halfToneShare, 4),
    worst: b.worst.slice(0, 3).map((e) => ({ kind: e.kind, axis: e.axis, coord: round(e.coord, 4), off: round(e.off, 4), lenDev: round(e.lenDev, 3) })),
    strokeLen: round(total, 3), axialLen: round(axial, 3), diagLen: round(diag, 3), arcLen: round(Math.max(0, total - axial - diag), 3),
    runLen: round(runLen, 3), meanPeak: runLen ? round(wPeak / runLen, 4) : null, coreShare: runLen ? round(coreLen / runLen, 4) : null,
    runs,
    box: { x0: round(bb.x0, 4), y0: round(bb.y0, 4), w: round(bb.x1 - bb.x0, 4), h: round(bb.y1 - bb.y0, 4) },
    file,
  };
}

/** Coverage of every device pixel with `covered()` at every sample — never `classify` (bf.mjs). */
export function bypassRasterise(reg, { px, rate = RATE, canvas = reg.canvas }) {
  const unit = canvas / px, r = rate / unit;
  const cov = new Float64Array(px * px);
  const { x0, y0, x1, y1 } = reg.bbox;
  for (let j = 0; j < px; j++) {
    const by0 = j * unit, by1 = (j + 1) * unit;
    if (by1 < y0 - 1e-9 || by0 > y1 + 1e-9) continue;
    const j0 = Math.ceil(by0 * r - 0.5), j1 = Math.ceil(by1 * r - 0.5);
    for (let i = 0; i < px; i++) {
      const bx0 = i * unit, bx1 = (i + 1) * unit;
      if (bx1 < x0 - 1e-9 || bx0 > x1 + 1e-9) continue;
      const i0 = Math.ceil(bx0 * r - 0.5), i1 = Math.ceil(bx1 * r - 0.5);
      let hit = 0, n = 0;
      for (let b = j0; b < j1; b++) { const y = (b + 0.5) / r; for (let a = i0; a < i1; a++) { n++; if (reg.covered((a + 0.5) / r, y)) hit++; } }
      cov[j * px + i] = n ? hit / n : 0;
    }
  }
  return cov;
}

/** Share of ink in part-covered pixels (blurScore's definition, on any coverage array). */
export function halfTone(cov) {
  let tot = 0, part = 0;
  for (const c of cov) { tot += c; if (c > 0 && c < PARTIAL) part += c; }
  return tot > 0 ? part / tot : 0;
}

export const bypassHalfTone = (file, { rate = RATE } = {}) => {
  const icon = readIcon(file); const reg = regionOf(icon);
  return round(halfTone(bypassRasterise(reg, { px: icon.canvas, rate })), 4);
};

// ── pixelgrid's diagonalShare, modelled (diag_quirk2.mjs) ───────────────────────

/** Straight segments as pixelgrid's flattenRuns sees them: a fragment restarts after every arc,
 *  and `Z` closes the LAST fragment back to that fragment's own first point. */
export function instrumentSegments(d) {
  const frags = []; let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  const open = (x, y) => { cur = { pts: [[x, y]], closed: false }; frags.push(cur); };
  const to = (x, y) => { if (!cur) open(cx, cy); cur.pts.push([x, y]); };
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    if (up === 'Z') { if (cur) cur.closed = true; cx = sx; cy = sy; cur = null; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; if (k === 0) { sx = x; sy = y; open(x, y); } else to(x, y); cx = x; cy = y; }
      else if (up === 'L') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; to(x, y); cx = x; cy = y; }
      else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; to(x, cy); cx = x; }
      else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; to(cx, y); cy = y; }
      else { const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]]; cur = null; cx = ex; cy = ey; }
    }
  }
  const out = [];
  for (const f of frags.filter((s) => s.pts.length > 1)) {
    const n = f.pts.length;
    for (let i = 0; i + 1 < n + (f.closed ? 1 : 0); i++) { const [a, b] = f.pts[i], [c, e] = f.pts[(i + 1) % n]; out.push([a, b, c, e]); }
  }
  return out;
}
export const trueSegments = (d) => straightRuns(d).map((r) => [r.ax, r.ay, r.bx, r.by]);
/** Share of straight length that is not axis-aligned. */
export function diagonalShareOf(segs) {
  let ax = 0, ot = 0;
  for (const [x1, y1, x2, y2] of segs) { const L = Math.hypot(x2 - x1, y2 - y1); if (x1 === x2 || y1 === y2) ax += L; else ot += L; }
  return ax + ot > 0 ? ot / (ax + ot) : null;
}

// ── an independent landing score (the card reviewer's pg_lib.mjs, restated) ────

/** Arc extremes by the documented definition, with a sweep test that does not flicker on
 *  float noise and a zero-length arc skipped (SVG F.6.2 omits it). */
function independentArc(x1, y1, rx, ry, fA, fS, x2, y2, h, px, canvas, tolDev) {
  if (!rx || !ry) return [];
  if (x1 === x2 && y1 === y2) return [];
  rx = Math.abs(rx); ry = Math.abs(ry);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const lam = dx * dx / (rx * rx) + dy * dy / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx;
  const den = rx * rx * dy * dy + ry * ry * dx * dx;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cx = co * rx * dy / ry + (x1 + x2) / 2, cy = -co * ry * dx / rx + (y1 + y2) / 2;
  const t1 = Math.atan2((y1 - cy) / ry, (x1 - cx) / rx), t2 = Math.atan2((y2 - cy) / ry, (x2 - cx) / rx);
  let dt = t2 - t1;
  if (!fS && dt > 0) dt -= 2 * Math.PI;
  if (fS && dt < 0) dt += 2 * Math.PI;
  const tolC = tolDev * canvas / px;
  const angDiff = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  const reachable = (t) => {
    const u = ((t - t1) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    if (dt >= 0) return u <= dt + 1e-9 || u >= 2 * Math.PI - 1e-9;
    const w = (2 * Math.PI - u) % (2 * Math.PI);
    return w <= -dt + 1e-9;
  };
  const out = [];
  for (const sp of [
    { t: 0, c0: cx, semi: rx, kr: ry * ry / rx, dir: +1 }, { t: Math.PI, c0: cx, semi: rx, kr: ry * ry / rx, dir: -1 },
    { t: Math.PI / 2, c0: cy, semi: ry, kr: rx * rx / ry, dir: +1 }, { t: -Math.PI / 2, c0: cy, semi: ry, kr: rx * rx / ry, dir: -1 },
  ]) {
    if (!reachable(sp.t)) continue;
    const share = angDiff(sp.t, t1) < 1e-6 || angDiff(sp.t, t1 + dt) < 1e-6 ? 0.5 : 1;
    for (const s of (h ? [1, -1] : [0])) {
      const R = sp.kr + s * h;
      if (R <= 0) continue;
      const half = Math.acos(Math.max(-1, 1 - tolC / R));
      out.push({ kind: 'extreme', coord: sp.c0 + sp.dir * (sp.semi + s * h), len: Math.min(2 * R * half, Math.abs(dt) * R) * share });
    }
  }
  return out;
}

/** Every ink edge of an icon by the landing score's written definition, written without pixelgrid. */
export function independentEdges(icon, px, { tolDev = 0.25, minRun = MIN_RUN } = {}) {
  const scale = px / icon.canvas, edges = [];
  for (const p of icon.paths) {
    const h = p.kind === 'stroke' ? p.weight / 2 : 0;
    let cx = 0, cy = 0, sx = 0, sy = 0;
    const run = (ax, ay, bx, by) => {
      const L = Math.hypot(bx - ax, by - ay);
      if (L < minRun) return;
      if (ay === by) for (const s of (h ? [-1, 1] : [0])) edges.push({ kind: 'run', coord: ay + s * h, len: L });
      else if (ax === bx) for (const s of (h ? [-1, 1] : [0])) edges.push({ kind: 'run', coord: ax + s * h, len: L });
    };
    for (const { cmd, args } of parsePath(p.d)) {
      const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
      if (up === 'Z') { run(cx, cy, sx, sy); cx = sx; cy = sy; continue; }
      const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
      for (let k = 0; k + step <= args.length; k += step) {
        const a = args.slice(k, k + step);
        if (up === 'M') { const x = rel ? cx + a[0] : a[0], y = rel ? cy + a[1] : a[1]; if (k === 0) { sx = x; sy = y; } else run(cx, cy, x, y); cx = x; cy = y; }
        else if (up === 'L') { const x = rel ? cx + a[0] : a[0], y = rel ? cy + a[1] : a[1]; run(cx, cy, x, y); cx = x; cy = y; }
        else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; run(cx, cy, x, cy); cx = x; }
        else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; run(cx, cy, cx, y); cy = y; }
        else { const ex = rel ? cx + a[5] : a[5], ey = rel ? cy + a[6] : a[6]; edges.push(...independentArc(cx, cy, a[0], a[1], a[3], a[4], ex, ey, h, px, icon.canvas, tolDev)); cx = ex; cy = ey; }
      }
    }
  }
  return edges.map((e) => { const dev = e.coord * scale; return { ...e, off: Math.abs(dev - Math.round(dev)), lenDev: e.len * scale }; });
}
/** The landing score of an edge list: ink-length-weighted mean of 2 × off. */
export const landingScore = (list) => { let w = 0, s = 0; for (const e of list) { w += e.lenDev; s += e.lenDev * 2 * e.off; } return w > 0 ? s / w : null; };

/** Arcs whose end point equals their start (zeroarc.mjs). */
export function zeroLengthArcs(d) {
  const hits = []; let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    if (up === 'Z') { cx = sx; cy = sy; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; if (k === 0) { sx = x; sy = y; } cx = x; cy = y; }
      else if (up === 'L') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; cx = x; cy = y; }
      else if (up === 'H') cx = rel ? cx + a[0] : a[0];
      else if (up === 'V') cy = rel ? cy + a[0] : a[0];
      else { const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]]; if (Math.abs(ex - cx) < 1e-9 && Math.abs(ey - cy) < 1e-9) hits.push([ex, ey]); cx = ex; cy = ey; }
    }
  }
  return hits;
}

// ── classifiers the tables use (gen_grid_tables.mjs) ───────────────────────────

/** §3.4: where a centreline sits on the eighth grid. */
export function centrelineClass(c, canvas) {
  const f = ((c % 1) + 1) % 1; const r = Math.round(f * 8) / 8;
  if (Math.abs(f - r) > 1e-3) return 'off the eighth grid';
  if (Math.abs(c - canvas / 2) < 1e-6) return 'canvas midline';
  return ['whole number', 'x.125', 'x.25', 'x.375', 'x.5', 'x.625', 'x.75', 'x.875'][Math.round(f * 8) % 8];
}
export const CENTRE_ORDER = ['canvas midline', 'whole number', 'x.125', 'x.25', 'x.375', 'x.5', 'x.625', 'x.75', 'x.875', 'off the eighth grid'];

/** §3.3: why a soft run (no fully inked pixel) at 16 is soft — where its centreline sits. */
export const SOFT_ORDER = ['on the canvas midline (y or x = 8)', 'on another whole number', 'on x.125 or x.875', 'on x.25 or x.75', 'off the eighth grid'];
export function softCause(c, canvas = 16) {
  const f = ((c % 1) + 1) % 1;
  if (Math.abs(c - canvas / 2) < 1e-6) return SOFT_ORDER[0];
  if (Math.abs(f) < 1e-6 || Math.abs(f - 1) < 1e-6) return SOFT_ORDER[1];
  if (Math.abs(f * 8 - Math.round(f * 8)) < 1e-6 && Math.round(f * 8) % 2 === 1) return SOFT_ORDER[2];
  if (Math.abs(f * 4 - Math.round(f * 4)) < 1e-6) return SOFT_ORDER[3];
  return SOFT_ORDER[4];
}

/** §4.3: one run's score at `s` device px per unit = the two edges' distances from a pixel line. */
export const runScoreAt = (c, w, s) => off((c - w / 2) * s) + off((c + w / 2) * s);
export const RETINA_BINS = ['perfect (0)', '(0, 0.25]', '(0.25, 0.5]', '(0.5, 0.75]', '> 0.75'];
export const retinaBin = (s) => (s < 0.001 ? RETINA_BINS[0] : s <= 0.25 + 1e-9 ? RETINA_BINS[1] : s <= 0.5 + 1e-9 ? RETINA_BINS[2] : s <= 0.75 + 1e-9 ? RETINA_BINS[3] : RETINA_BINS[4]);

/** The band a stored (4-dp) score falls in; lower edge inclusive. */
export const bandOf = (v) => BANDS.find(([, lo, hi]) => v >= lo && v < hi)?.[0] ?? null;

// ── the census over a pin ──────────────────────────────────────────────────────

export function listDrawings(pin) {
  const out = [];
  for (const master of MASTERS) {
    const dir = join(pin, 'src/icons', String(master));
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) {
      const name = f.replace(/\.svg$/, '');
      out.push({ master, file: join(dir, f), name, concept: name.replace(/-filled$/, ''), style: name.endsWith('-filled') ? 'filled' : 'outline' });
    }
  }
  return out;
}

export function census(pin) {
  const t0 = Date.now();
  const files = listDrawings(pin);
  const rows = files.map((f) => measureDrawing(f.file));
  rows.sort((a, b) => b.master - a.master || a.name.localeCompare(b.name));
  const kinds = {};
  for (const f of files) if (f.style === 'outline') (kinds[f.concept] ??= {})[f.master] = kindOfText(readFileSync(f.file, 'utf8'));
  const by = (m, s) => rows.filter((x) => x.master === m && x.style === s);
  const at = new Map(rows.map((r) => [`${r.master}/${r.name}`, r]));
  const C = { pin, rows, kinds, by, at, ms: Date.now() - t0 };
  C.twin = (r) => at.get(`${r.master}/${r.style === 'outline' ? r.concept + '-filled' : r.concept}`);
  return C;
}

/** Bypass half-tone on the rows that need it (lazily, once per row). */
function withHalfTone(rows) { for (const r of rows) if (r.halfTone === undefined) r.halfTone = bypassHalfTone(r.file); return rows; }

// ── derived quantities shared by several sections ──────────────────────────────

export function solidByMaster(C, m, s) {
  let tot = 0, core = 0, wp = 0, mid = 0, midSoft = 0; const soft = new Set(), mids = new Set(), all = new Set();
  for (const x of C.by(m, s)) for (const [, c, len, w] of x.runs) {
    const p = pixelProfile(c - w / 2, c + w / 2, 1e-9); tot += len; wp += len * p.peak; all.add(x.name);
    if (p.core) core += len; else soft.add(x.name);
    if (Math.abs(c - m / 2) < 1e-6) { mid += len; mids.add(x.name); if (!p.core) midSoft += len; }
  }
  return { drawings: all.size, tot, core, softShare: 1 - core / tot, softDrawings: soft.size, meanPeak: wp / tot, mid, midDrawings: mids.size, midSoft };
}

export function softCauses(C) {
  const cls = Object.fromEntries(SOFT_ORDER.map((k) => [k, { n: 0, len: 0, c: new Set(), at: new Map() }]));
  let tot = 0, soft = 0;
  for (const x of C.by(16, 'outline')) for (const [h, c, len, w] of x.runs) {
    tot += len; if (pixelProfile(c - w / 2, c + w / 2, 1e-9).core) continue;
    soft += len; const k = softCause(c, 16); cls[k].n++; cls[k].len += len; cls[k].c.add(x.concept);
    (cls[k].at.get(x.concept) ?? cls[k].at.set(x.concept, new Set()).get(x.concept)).add(`${h ? 'y' : 'x'}=${c}`);
  }
  return { cls, tot, soft, mid: cls[SOFT_ORDER[0]].len };
}

export function bandRows(C, s) {
  const j = C.by(16, s).filter(judge);
  return BANDS.map(([n, lo, hi]) => {
    const x = j.filter((y) => bandOf(y.blur) === n);                // one band rule: bandOf (lower edge in, upper out)
    const mean = (f) => { const v = x.map(f).filter((a) => a != null); return v.reduce((a, b) => a + b, 0) / v.length; };
    const ex = [...x].sort((a, b) => a.blur - b.blur);
    const pick = x.length ? [...new Set([0, 0.25, 0.5, 0.75, 1].map((p) => ex[Math.round(p * (ex.length - 1))].name))] : [];
    return { n, lo, hi, x, count: x.length, share: x.length / j.length, core: mean((y) => y.coreShare), peak: mean((y) => y.meanPeak), curve: mean((y) => (y.strokeLen > 0 ? y.arcLen / y.strokeLen : null)), pick };
  }).filter((b) => b.count);
}

export function outerOn(C, m, s) {
  const res = {}; const r = C.by(m, s);
  const on = (y) => Math.max(...[y.box.x0, y.box.x0 + y.box.w, y.box.y0, y.box.y0 + y.box.h].map(off)) < ON_LINE;
  for (const k of ['silhouette', 'box', 'anchor', 'mark']) { const x = r.filter((y) => C.kinds[y.concept][m] === k); res[k] = [x.filter(on).length, x.length]; }
  res.all = [r.filter(on).length, r.length];
  return res;
}

export function fill2(C, m) {
  let tot = 0; const len = {}, names = {};
  for (const x of C.by(m, 'filled')) for (const [, c, l, w] of x.runs) if (w === 2) {
    const s = off(c - 1) + off(c + 1); const k = s < 0.001 ? '0' : s > 0.99 ? '1.0' : '(0,1)';
    len[k] = (len[k] || 0) + l; tot += l; (names[k] ??= new Set()).add(x.concept);
  }
  return { tot, len, names };
}

export function retina(C, m, sc) {
  let tot = 0, sum = 0; const b = {};
  for (const x of C.by(m, 'outline')) for (const [, c, len, w] of x.runs) { const s = runScoreAt(c, w, sc); tot += len; sum += len * s; const k = retinaBin(s); b[k] = (b[k] || 0) + len; }
  return { tot, mean: sum / tot, b };
}

export function centrelines(C, m) {
  const tot = {}; let T0 = 0;
  for (const x of C.by(m, 'outline')) for (const [, c, len] of x.runs) { const k = centrelineClass(c, m); tot[k] = (tot[k] || 0) + len; T0 += len; }
  return { tot, T0 };
}

// ── §2 probes ───────────────────────────────────────────────────────────────────

export const PROFILE_POSITIONS = [[16, 1.25, [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]], [24, 1.5, [0, 0.25, 0.5, 0.75]], [20, 1.5, [0, 0.25, 0.5, 0.75]]];
/** One horizontal line at the canvas centre + f: rasterised coverage across it and the instrument score. */
export function lineProfile(canvas, w, f) {
  const c = canvas / 2 + f;
  const ctx = probe([{ d: `M2 ${c}H${canvas - 2}`, kind: 'stroke', weight: w }], canvas);
  const rp = rowProfile(ctx, canvas, { rate: RATE, window: [canvas / 2 - 2, canvas / 2 + 2] });
  const cov = rp.rows.filter((r) => r.max > 0).map((r) => +(r.max * 100).toFixed(1));
  const sc = blurScore(ctx, canvas, { rate: RATE }).straightOnly;
  const where = f === 0 ? 'on a whole number (so is the canvas midline: 12 · 10 · 8)' : (canvas === 16 ? (f === 0.375 || f === 0.625 ? 'the C7 construction' : f === 0.5 ? 'on a pixel centre' : 'between') : (f === 0.5 ? 'on a pixel centre' : 'the quarter grid'));
  return { canvas, w, c, where, cov, score: sc };
}

/** A 1.25 line at 45° shifted by `o`: mean darkest pixel over interior rows 5–10 and pixels touched in row 10. */
export function diagonalProbe(o) {
  const reg = probe([{ d: `M${2 + o} 2L${14 + o} 14`, kind: 'stroke', weight: 1.25 }], 16).region;
  const { cov } = rasterise(reg, { px: 16, rate: RATE, canvas: 16 });
  const peaks = []; let touched = 0;
  for (let j = 5; j <= 10; j++) { let mx = 0, n = 0; for (let i = 0; i < 16; i++) { const v = cov[j * 16 + i]; if (v > mx) mx = v; if (v > 0.02) n++; } peaks.push(mx); touched = n; }
  return { o, darkest: peaks.reduce((a, b) => a + b) / peaks.length, touched };
}

/** The analytic profile (pixelProfile) against the rasteriser on probe lines: six weight/canvas pairs ×
 *  eight eighth-unit positions (validate_profile.mjs). Returns the case count and the largest difference. */
export function validateProfile() {
  let worst = 0, n = 0;
  for (const [w, canvas] of [[1.25, 16], [1.5, 24], [1.5, 20], [2, 16], [2.5, 24], [2, 20]]) {
    for (let k = 0; k < 8; k++) {
      const c = canvas / 2 + k / 8;
      const ctx = probe([{ d: `M2 ${c}H${canvas - 2}`, kind: 'stroke', weight: w }], canvas);
      const got = rowProfile(ctx, canvas, { rate: RATE, window: [canvas / 2 - 2, canvas / 2 + 2] }).rows.filter((r) => r.max > 0).map((r) => r.max);
      const want = []; const e1 = c - w / 2, e2 = c + w / 2;
      for (let i = Math.floor(e1 + 1e-9); i < Math.ceil(e2 - 1e-9); i++) want.push(Math.max(0, Math.min(i + 1, e2) - Math.max(i, e1)));
      const d = got.length === want.length ? Math.max(...got.map((g, i) => Math.abs(g - want[i]))) : Infinity;
      worst = Math.max(worst, d); n++;
    }
  }
  return { n, worst };
}

/** A shipped 16 drawing: the darkest pixel of every row that has one above 0.5, and fully inked pixels. */
export function rowPeaks(file) {
  const { cov } = rasterise(regionOf(readIcon(file)), { px: 16, rate: RATE });
  const peaks = []; let full = 0;
  for (let j = 0; j < 16; j++) { let mx = 0; for (let i = 0; i < 16; i++) { mx = Math.max(mx, cov[j * 16 + i]); if (cov[j * 16 + i] >= PARTIAL) full++; } if (mx > 0.5) peaks.push(mx); }
  return { lo: Math.min(...peaks), hi: Math.max(...peaks), full };
}

/** Where the independent landing score and the instrument's differ (edge count, or score by > 1e-9). */
export function independentDiffs(C) {
  if (C.indep) return C.indep;
  const diffs = [];
  for (const r of C.rows) {
    const icon = readIcon(r.file);
    const mine = independentEdges(icon, r.canvas);
    const land = edgeLanding({ icon, region: NO_REGION }, r.canvas);
    const a = landingScore(mine), b = landingScore(land.edges);
    if (a == null && b == null) continue;
    if (mine.length !== land.edges.length || Math.abs(a - b) > 1e-9) diffs.push({ key: `${r.master}/${r.name}`, r, d: a - b, a });
  }
  return (C.indep = { diffs, scored: C.rows.filter((r) => r.blur != null).length });
}

// ── sections ───────────────────────────────────────────────────────────────────

const out = [];
const say = (...l) => out.push(l.join(' '));
const head = (t) => { out.push('', `## ${t}`); };

export function topTable(C, s) {
  const r = C.by(16, s).filter((x) => x.blur != null && x.blur >= TOP).sort((a, b) => b.blur - a.blur);
  const body = r.map((x) => {
    const w = x.worst[0], tw = C.twin(x);
    return [tick(x.concept), f3(x.blur), kindOf(x), f3(x.straightOnly), x.diagonalShare == null ? '—' : Math.round(100 * x.diagonalShare) + '%', x.runCount, w ? `${w.kind === 'run' ? 'run' : 'curve'} ${w.axis}=${w.coord} (off ${w.off.toFixed(3)})` : '—', tw ? f3(tw.blur) : '—'];
  });
  return { r, table: md(['Drawing', 'Score', 'J / D / A / N', 'Straight-runs-only score', 'Diagonal share', 'Straight-run edges (two per stroked segment)', 'Worst edge', `Score of its ${s === 'outline' ? 'filled' : 'outline'} twin`], body, ['l', 'r', 'l', 'r', 'r', 'r', 'l', 'r']) };
}

const SECTIONS = {
  s0(C) {
    head('§0 The short version');
    say(`drawings at the pin: ${C.rows.length} (${new Set(C.rows.map((r) => r.concept)).size} concepts × ${MASTERS.length} masters × ${STYLES.length} styles)`);
    let lo = Infinity, hi = -Infinity;
    for (let k = 0; k < 1024; k++) { const s = runScoreAt(8 + k / 1024, 1.25, 1); lo = Math.min(lo, s); hi = Math.max(hi, s); }
    say(`a straight 1.25 line at 16: best score ${lo.toFixed(2)}, worst ${hi.toFixed(2)}`);
    const o = C.by(16, 'outline'); const k = (t) => o.filter((x) => kindOf(x) === t);
    say(`outlines at 16: ${o.length} · J ${k('J').length} · A ${k('A').length} · D ${k('D').length} · N ${k('N').length} (${k('N').map((x) => x.name).join(', ')})`);
    const outside = o.length - k('J').length;
    say(`outside the instrument: ${outside} of ${o.length} (${Math.round(100 * outside / o.length)}%)`);
    const ranked = o.filter((x) => x.blur != null).sort((a, b) => b.blur - a.blur);
    const first = ranked.findIndex(judge);
    say(`unfiltered ranking: the first ${first} places are ${[...new Set(ranked.slice(0, first).map(kindOf))].join('/')}; first scorable at place ${first + 1}`);
    const j = k('J').map((x) => x.blur);
    say(`J ${j.length}, floor ${f3(Math.min(...j))}, median ${f3(q(j, 0.5))}, max ${f3(Math.max(...j))}`);
    say(`bands (${j.length} scorable outlines): ${bandRows(C, 'outline').map((b) => `${b.n} ${b.count} (${Math.round(100 * b.share)}%)`).join(' · ')}`);
    const D = k('J').filter((x) => x.blur >= 0.70).sort((a, b) => b.blur - a.blur || a.name.localeCompare(b.name));
    say(`0.70–0.75 band: ${D.map((x) => `${x.name} ${f3(x.blur)}`).join(', ')}`);
    const at750 = D.filter((x) => x.blur === 0.75);
    say(`exactly 0.750: ${at750.length}; every straight run on a whole-number centreline: ${at750.every((x) => x.runs.every(([, c]) => c === Math.round(c))) ? 'yes' : 'no'}; plug-3: ${C.at.get('16/plug-3').runs.every(([, c]) => c === Math.round(c)) ? 'yes' : 'no'}`);
    const sm = Object.fromEntries(MASTERS.map((m) => [m, solidByMaster(C, m, 'outline')]));
    say(`on the canvas midline: 16 ${pc(sm[16].mid, sm[16].tot)} · 24 ${pc(sm[24].mid, sm[24].tot)} · 20 ${pc(sm[20].mid, sm[20].tot)}; of it with a solid pixel at any master: ${pc(MASTERS.reduce((a, m) => a + sm[m].mid - sm[m].midSoft, 0), MASTERS.reduce((a, m) => a + sm[m].mid, 0))}`);
    const sc = softCauses(C);
    say(`soft off the midline at 16: ${pc(sc.soft - sc.mid, sc.tot)}`);
    for (const m of [24, 20]) { const jj = C.by(m, 'outline').filter(judge); say(`${m}: straight-runs-only score of all ${jj.length} scorable outlines is 0.500: ${jj.every((x) => Math.abs(x.straightExact - 0.5) < 1e-12) ? 'yes' : 'no'}`); }
    say(`no fully inked pixel: 24 ${pc(sm[24].tot - sm[24].core, sm[24].tot)} · 20 ${pc(sm[20].tot - sm[20].core, sm[20].tot)} · 16 ${pc(sm[16].tot - sm[16].core, sm[16].tot)}; mean darkest pixel ${sm[24].meanPeak.toFixed(3)} · ${sm[20].meanPeak.toFixed(3)} · ${sm[16].meanPeak.toFixed(3)}`);
    say(`16 behind 24 by ${(100 * (sm[16].softShare - sm[24].softShare)).toFixed(1)} points of length`);
    say(`2×: perfect 24 ${pc(retina(C, 24, 2).b[RETINA_BINS[0]] ?? 0, retina(C, 24, 2).tot)} · 20 ${pc(retina(C, 20, 2).b[RETINA_BINS[0]] ?? 0, retina(C, 20, 2).tot)} · 16 ${pc(retina(C, 16, 2).b[RETINA_BINS[0]] ?? 0, retina(C, 16, 2).tot)}`);
    const fj = C.by(16, 'filled').filter(judge).map((x) => x.blur);
    const fb = bandRows(C, 'filled'), ob = bandRows(C, 'outline');
    say(`filled scorable median ${f3(q(fj, 0.5))} against ${f3(q(j, 0.5))}; band A ${Math.round(100 * fb[0].share)}% against ${Math.round(100 * ob[0].share)}%`);
    const tw = (xs) => xs.map((x) => C.twin(x).blur);
    const arrows = C.by(16, 'outline').filter((x) => /^arrow-(up|down|left|right)(-[23])?$/.test(x.name));
    say(`filled twins: the eight at 0.750 score ${f3(Math.min(...tw(at750)))}–${f3(Math.max(...tw(at750)))}; the ${arrows.length} arrows score ${f3(Math.min(...tw(arrows)))}–${f3(Math.max(...tw(arrows)))}; plug-3's twin ${f3(C.twin(C.at.get('16/plug-3')).blur)}`);
    say(`filled 2.0 lines on half-numbers: ${fill2(C, 16).names['1.0'].size} concepts at 16, ${fill2(C, 20).names['1.0'].size} at 20`);
    const oe = outerOn(C, 16, 'outline');
    say(`outer edges on pixel lines at 16: ${oe.all[0]} of ${oe.all[1]} (${Math.round(100 * oe.all[0] / oe.all[1])}%); silhouette ${oe.silhouette[0]} of ${oe.silhouette[1]} (${Math.round(100 * oe.silhouette[0] / oe.silhouette[1])}%); declared box ${oe.box[0]} of ${oe.box[1]}; marks ${oe.mark[0]} of ${oe.mark[1]}`);
  },

  s1(C) {
    head('§1 What a score is, and what it rests on');
    say(`darkest pixel of a 1.25 line on the 16 midline: ${pixelProfile(8 - 0.625, 8 + 0.625).peak.toFixed(3)}`);
    const v = validateProfile();
    say(`analytic pixel profile against the rasteriser: ${v.n} test lines, largest difference ${v.worst.toFixed(4)}`);
  },

  's1.1'(C) {
    head('§1.1 The raster.mjs bug, and why it does not touch the scores');
    const d = 'M2 2.375H14V13.625H2Z';
    const reg = areaRegion([d]);
    const { cov } = rasterise(reg, { px: 16, rate: RATE, canvas: 16 });
    const bp = bypassRasterise({ ...reg, canvas: 16 }, { px: 16, rate: RATE });
    const pts = [[2, 2.375], [14, 2.375], [14, 13.625], [2, 13.625]];
    let shoe = 0; for (let i = 0; i < 4; i++) { const [a, b] = pts[i], [c, e] = pts[(i + 1) % 4]; shoe += a * e - c * b; }
    const exactRow = (j) => Math.max(0, Math.min(j + 1, 13.625) - Math.max(j, 2.375));
    say(`rectangle ${d}: closed form area ${Math.abs(shoe / 2)}, rows 2 and 13 at ${exactRow(2).toFixed(3)} / ${exactRow(13).toFixed(3)}`);
    say(`rasterise rows 2 and 13 (columns 4–7): ${[2, 13].map((j) => [4, 5, 6, 7].map((i) => cov[j * 16 + i].toFixed(3)).join(' ')).join(' | ')}; inkArea ${inkArea(reg, { rate: RATE }).area.toFixed(1)}; bypass rows ${[2, 13].map((j) => bp[j * 16 + 4].toFixed(3)).join(' / ')}`);
    let maxRound = 0, maxExact = 0, n = 0;
    for (const r of C.rows) {
      const land = edgeLanding({ icon: readIcon(r.file), region: NO_REGION }, r.canvas);
      const s = landingScore(land.edges);
      if (s == null && r.blur == null) continue;
      n++; maxRound = Math.max(maxRound, Math.abs(s - r.blur)); maxExact = Math.max(maxExact, Math.abs(s - r.blurExact));
    }
    say(`landing score recomputed from edgeLanding alone on ${n} scored files: largest difference ${maxRound.toFixed(5)} from the stored 4-dp value, ${maxExact.toFixed(5)} from blurScore().blur`);
    // the reviewer's independent re-implementation
    const { diffs, scored } = independentDiffs(C);
    const ad = diffs.map((x) => Math.abs(x.d)); const big = diffs.reduce((p, x) => (Math.abs(x.d) > Math.abs(p.d) ? x : p));
    say(`independent re-implementation: differs on ${diffs.length} of ${scored} scorable scores, by ${Math.min(...ad).toFixed(4)}–${Math.max(...ad).toFixed(3)} (largest ${big.key})`);
    const o16 = diffs.filter((x) => x.r.master === 16 && x.r.style === 'outline');
    say(`at 16 outline: ${o16.map((x) => x.r.name).join(', ')}, by at most ${Math.max(...o16.map((x) => Math.abs(x.d))).toFixed(4)}`);
    const dm = new Map(diffs.map((x) => [x.key, x.a]));
    const indep = C.by(16, 'outline').filter(judge).map((r) => round(dm.has(`16/${r.name}`) ? dm.get(`16/${r.name}`) : r.blurExact, 4));
    say(`independent, 16 outline scorable: ${indep.length}, ${f3(Math.min(...indep))}, ${f3(q(indep, 0.5))}, ${f3(Math.max(...indep))}; bands ${BANDS.map(([n]) => `${n} ${indep.filter((v) => bandOf(v) === n).length}`).join(' · ')}`);
    // half-tone: instrument (classify) against the bypass
    withHalfTone(C.rows);
    const ch = C.rows.filter((r) => Math.abs(r.halfTone - r.halfToneInstrument) > CHANGED);
    say(`half-tone share, instrument against bypass: ${ch.length} files changed, largest change ${Math.max(...C.rows.map((r) => Math.abs(r.halfTone - r.halfToneInstrument))).toFixed(3)}; with an area path: ${ch.filter((r) => r.hasArea).length} of ${ch.length}`);
    // diagonalShare as pixelgrid gives it, modelled, against every straight segment
    const o = C.by(16, 'outline'); let match = 0, differ = 0; const drop = [], spur = [];
    for (const r of o) {
      const icon = readIcon(r.file);
      const I = icon.paths.flatMap((p) => instrumentSegments(p.d)), T = icon.paths.flatMap((p) => trueSegments(p.d));
      const iS = diagonalShareOf(I), tS = diagonalShareOf(T), rep = r.diagonalShare;
      if ((iS == null && rep == null) || Math.abs(iS - rep) < 1e-4) match++;
      r.trueDiag = tS == null ? null : round(tS, 4);
      if (!((tS == null && rep == null) || Math.abs(tS - rep) < 1e-4)) {
        differ++;
        let arcBeforeZ = false, straightAfterArc = false;
        for (const p of icon.paths) { const cmds = parsePath(p.d); for (let i = 0; i < cmds.length; i++) if (cmds[i].cmd.toUpperCase() === 'Z') { if (cmds[i - 1]?.cmd.toUpperCase() === 'A') arcBeforeZ = true; else if (cmds.slice(0, i).some((c) => c.cmd.toUpperCase() === 'A')) straightAfterArc = true; } }
        (arcBeforeZ && !straightAfterArc ? drop : spur).push(r.name);
      }
    }
    say(`diagonalShare model reproduces the instrument on ${match} of ${o.length} outlines at 16; differs from every straight segment on ${differ}: closing segment dropped ${drop.length}, spurious chord ${spur.length}`);
    const flips = o.filter((r) => judge(r) !== (r.runCount > 0 && (r.trueDiag ?? 0) < JUDGE_DIAG));
    say(`change side of 0.5: ${flips.map((r) => `${r.name} (${judge(r) ? 'would be diagonal-heavy' : 'would be scorable'})`).join(', ')}`);
    const jt = o.filter((r) => r.runCount > 0 && (r.trueDiag ?? 0) < JUDGE_DIAG).map((r) => r.blur);
    say(`with every straight segment: J ${jt.length}, floor ${f3(Math.min(...jt))}, median ${f3(q(jt, 0.5))}, max ${f3(Math.max(...jt))}`);
    // the arc-extreme flicker
    const shifts = [0, 0.001, 0.002, 0.003, 0.005, 0.007, 0.011, 0.013];
    const counts = shifts.map((dx) => edgeLanding(probe([{ d: `M${(7.735 + dx).toFixed(3)} 7.875A0.625 0.625 0 0 1 ${(8.36 + dx).toFixed(3)} 8.5`, kind: 'stroke', weight: 1.25 }], 16), 16).edges.length);
    const steps = shifts.slice(1).map((dx, i) => (counts[i + 1] > counts[i] ? `+${dx} gains` : counts[i + 1] < counts[i] ? `+${dx} loses` : null)).filter(Boolean);
    say(`quarter arc (info-2) translated: edge counts ${shifts.map((dx, i) => `+${dx}: ${counts[i]}`).join(' · ')}; against the shift before: ${steps.join(', ')}`);
  },

  s2(C) {
    head('§2 The key: what a line looks like at 16');
    const body = [];
    for (const [canvas, w, fr] of PROFILE_POSITIONS) for (const f of fr) {
      const p = lineProfile(canvas, w, f);
      body.push([`${canvas} px, stroke ${w}`, `y = ${p.c}`, p.where, p.cov.map((v) => v + '%').join(' · '), '[browser]', p.score.toFixed(3)]);
    }
    say(md(['Master, stroke', 'Centreline', 'Where it sits', 'Pixel coverages across the line — exact geometry (rate 32)', 'Chromium (Skia), measured', 'Instrument score'], body, ['l', 'l', 'l', 'l', 'l', 'r']));
    const rows45 = Array.from({ length: 8 }, (_, ph) => diagonalProbe(ph / 8));
    say(md(['Perpendicular offset of the line (units)', 'Darkest pixel in each row (interior rows)', 'Pixels touched per row'], rows45.map((r) => [r.o.toFixed(3), r.darkest.toFixed(2), r.touched]), ['r', 'r', 'r']));
    const shipped = ['chevron-down', 'check', 'x'].map((n) => ({ n, ...rowPeaks(join(C.pin, 'src/icons/16', `${n}.svg`)) }));
    say(`shipped diagonals: ${shipped.map((s) => `${tick(s.n)} ${s.lo.toFixed(2)}–${s.hi.toFixed(2)}`).join(', ')} (darkest pixel per row; fully inked pixels: ${shipped.reduce((a, s) => a + s.full, 0)})`);
  },

  's3.1'(C) {
    head('§3.1 Who can be scored');
    const body = [];
    for (const s of STYLES) for (const m of MASTERS) { const r = C.by(m, s); body.push([s, m, ...['J', 'D', 'A', 'N'].map((t) => r.filter((x) => kindOf(x) === t).length)]); }
    say(md(['Style', 'Master', 'J — judgeable', 'D — diagonal-heavy (≥ 50% of straight length is not axis-aligned)', 'A — arcs only, scored on curve extremes alone', 'N — no axis-aligned edge at all'], body, ['l', 'r', 'r', 'r', 'r', 'r']));
    const o = C.by(16, 'outline');
    say(`J at 16 outline: ${o.filter(judge).length} of ${o.length}`);
    const ranked = o.filter((x) => x.blur != null).sort((a, b) => b.blur - a.blur);
    const first = ranked.findIndex(judge); const top = first < 0 ? ranked : ranked.slice(0, first);
    const range = top.length ? `${top.at(-1).blur.toFixed(2)}–${top[0].blur.toFixed(2)}` : '—';
    say(`unfiltered top (scores ${range}): ${top.map((x) => `${x.name} (${kindOf(x)})`).join(', ')}; ${top.length} drawings; first scorable at place ${first < 0 ? '—' : `${first + 1} (${ranked[first].name})`}`);
  },

  's3.2'(C) {
    head('§3.2 The census and the four bands');
    const body = [];
    for (const s of STYLES) for (const m of MASTERS) {
      const r = C.by(m, s), j = r.filter(judge), b = j.map((x) => x.blur), so = j.map((x) => x.straightOnly).filter((v) => v != null);
      body.push([s, m, r.length, r.filter((x) => x.blur == null).length, `${j.length}`, f3(Math.min(...b)), f3(q(b, 0.25)), `**${f3(q(b, 0.5))}**`, f3(q(b, 0.75)), f3(Math.max(...b)), `${f3(Math.min(...so))} / ${f3(q(so, 0.5))} / ${f3(Math.max(...so))}`]);
    }
    say(md(['Style', 'Master (own size)', 'Drawings', 'No axis-aligned edge at all', 'Judgeable (straight run, diagonal < 50%)', 'score min', 'p25', 'median', 'p75', 'max', 'straight-runs-only score: min / median / max'], body, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const bb = [];
    for (const s of STYLES) for (const b of bandRows(C, s)) bb.push([s, b.n, `${b.lo.toFixed(2)}–${b.hi > 5 ? '0.75+' : b.hi.toFixed(2)}`, b.count, `${Math.round(100 * b.share)}%`, `${Math.round(100 * b.core)}%`, f2(b.peak), f2(b.curve), b.pick.map(tick).join(', ')]);
    say(md(['Style', 'Band', 'Score', 'Drawings', 'Share of judgeable', 'Solid-pixel share (mean over the band’s drawings of each drawing’s own share)', 'Darkest pixel across a line (mean over the band’s drawings)', 'Share of stroked line that is curve (mean; drawings with no stroked path left out)', 'Spread through the band'], bb, ['l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'l']));
    const j = C.by(16, 'outline').filter(judge);
    const tie = j.filter((x) => x.blur === 0.5 && x.blurExact !== 0.5);
    say(`tie at 0.5: ${tie.map((x) => `${x.name} ${x.blurExact.toPrecision(17)}`).join(', ')}; strict < on the exact score gives B ${j.filter((x) => x.blurExact >= 0.3 && x.blurExact < 0.5).length} and C ${j.filter((x) => x.blurExact >= 0.5 && x.blurExact < 0.7).length}`);
    const ob = bandRows(C, 'outline');
    for (const b of ob) say(`viewer band ${b.n}: ${b.count} outlines (${Math.round(100 * b.share)}%), solid share ${Math.round(100 * b.core)}%, darkest pixel ${f2(b.peak)}`);
    // the drawings the viewer bullets name, with the band each is in (the visual descriptions are eye readings)
    const named = { A: ['archive', 'folder', 'file', 'mail', 'lock'], B: ['alert-circle', 'book-open', 'bug'], C: ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right'], D: ['plus', 'minus'] };
    for (const [band, names] of Object.entries(named)) {
      const rs = names.map((n) => C.at.get(`16/${n}`)).filter(Boolean);
      if (rs.length) say(`named in bullet ${band}: ${rs.map((r) => `${r.name} ${judge(r) ? bandOf(r.blur) : kindOf(r)} ${f3(r.blur)}`).join(', ')}`);
    }
    const fb = bandRows(C, 'filled'), fj = C.by(16, 'filled').filter(judge);
    const dd = fb.find((b) => b.n === 'D');
    say(`filled scorable (${fj.length}): ${fb.map((b) => `${b.count} in ${b.n}${b.n === 'A' ? ` (${Math.round(100 * b.share)}%)` : ''}`).join(', ')}${dd ? ` (${dd.x.map((x) => `${x.name}, ${f3(x.blur)}`).join('; ')})` : ''}`);
  },

  's3.3'(C) {
    head('§3.3 The 0.70–0.75 band, by name, and everything near it');
    say(topTable(C, 'outline').table);
    const o = C.by(16, 'outline');
    const at750 = o.filter((x) => judge(x) && x.blur === 0.75);
    say(`exactly 0.750 (${at750.length}): ${at750.map((x) => x.name).join(', ')}; every straight run on a whole number: ${at750.every((x) => x.runs.every(([, c]) => c === Math.round(c))) ? 'yes' : 'no'}`);
    const plug = C.at.get('16/plug-3');
    say(`plug-3 ${f3(plug.blur)}: straight runs at ${plug.runs.map(([, c]) => c).join(', ')}; straight-runs-only ${f3(plug.straightOnly)}; on x.125 / x.875: ${plug.runs.filter(([, c]) => softCause(c, 16) === SOFT_ORDER[2]).length} of ${plug.runs.length}`);
    const arrows = o.filter((x) => /^(arrow-(up|down|left|right)(-[23])?|sort(-2)?)$/.test(x.name));
    const arrowsAndSort = arrows.filter((x) => x.name !== 'sort-2');   // the bullet's range is the arrows and `sort`
    say(`arrows and sort: ${f3(Math.min(...arrowsAndSort.map((x) => x.blur)))}–${f3(Math.max(...arrowsAndSort.map((x) => x.blur)))}; straight-runs-only ${[...new Set(arrows.map((x) => f3(x.straightOnly)))].join('/')}; J: ${arrows.filter(judge).map((x) => x.name).join(', ')}; D: ${arrows.filter((x) => kindOf(x) === 'D').map((x) => `${x.name} ${f3(x.blur)}`).join(', ')}`);
    say(`play-2 ${f3(C.at.get('16/play-2').blur)}, play-3 ${f3(C.at.get('16/play-3').blur)} (${kindOf(C.at.get('16/play-2'))}, ${kindOf(C.at.get('16/play-3'))})`);
    const twins = [...at750, ...arrows].map((x) => C.twin(x).blur);
    say(`their filled twins ${f3(Math.min(...twins))}–${f3(Math.max(...twins))}; plug-3's twin ${f3(C.twin(plug).blur)}`);
    const plus = C.at.get('16/plus'), plusF = C.twin(plus);
    say(`plus darkest pixel: outline ${(100 * plus.meanPeak).toFixed(1)}%, filled ${(100 * plusF.meanPeak).toFixed(1)}%`);
    const sc = softCauses(C);
    const body = SOFT_ORDER.map((k) => [k, sc.cls[k].n, sc.cls[k].len.toFixed(0), pc(sc.cls[k].len, sc.tot), `${(100 * sc.cls[k].len / sc.soft).toFixed(0)}%`, sc.cls[k].c.size]);
    body.push(['**all soft runs**', SOFT_ORDER.reduce((a, k) => a + sc.cls[k].n, 0), sc.soft.toFixed(0), `**${pc(sc.soft, sc.tot)}**`, '100%', '—']);
    say(`soft straight length: ${pc(sc.soft, sc.tot)}`);
    say(md(['Where the centreline of a soft straight run sits (16 outline)', 'Segments', 'Length (units)', 'Share of all straight length', 'Share of the soft length', 'Concepts'], body, ['l', 'r', 'r', 'r', 'r', 'r']));
    say(`midline ${(100 * sc.mid / sc.tot).toFixed(1)} points; off the midline ${(100 * (sc.soft - sc.mid) / sc.tot).toFixed(1)} points`);
    for (const k of SOFT_ORDER.slice(1)) say(`${k}: ${(100 * sc.cls[k].len / sc.tot).toFixed(1)} points, ${sc.cls[k].c.size} concepts: ${[...sc.cls[k].c].sort().join(', ')}`);
    const wn = sc.cls[SOFT_ORDER[1]].at;
    say(`other whole numbers: ${['chart-bar', 'menu-3', 'sort'].map((n) => `${n} at ${[...(wn.get(n) ?? [])].join(', ')}`).join('; ')}`);
  },

  's3.4'(C) {
    head('§3.4 Where the centrelines sit');
    const body = MASTERS.map((m) => { const { tot, T0 } = centrelines(C, m); return [m, T0.toFixed(0), ...CENTRE_ORDER.map((k) => (tot[k] ? pc(tot[k], T0) : '·'))]; });
    say(md(['Master', 'Straight run length (units)', ...CENTRE_ORDER], body, ['r', 'r', ...CENTRE_ORDER.map(() => 'r')]));
    const c16 = centrelines(C, 16), c24 = centrelines(C, 24), c20 = centrelines(C, 20);
    say(`16 on x.375 or x.625: ${pc(c16.tot['x.375'] + c16.tot['x.625'], c16.T0)}; 24 and 20 on x.25 / x.75: ${pc(c24.tot['x.25'] + c24.tot['x.75'], c24.T0)} and ${pc(c20.tot['x.25'] + c20.tot['x.75'], c20.T0)}`);
  },

  's3.5'(C) {
    head('§3.5 Outer edges');
    const body = [];
    for (const s of STYLES) for (const m of MASTERS) { const r = outerOn(C, m, s); body.push([s, m, ...['silhouette', 'box', 'anchor', 'mark'].map((k) => `${r[k][0]} / ${r[k][1]}`), `**${r.all[0]} / ${r.all[1]}**`]); }
    say(md(['Style', 'Master', 'silhouette-keyline icons', 'declared-box icons', 'anchored (level family)', 'marks', 'all'], body, ['l', 'r', 'r', 'r', 'r', 'r', 'r']));
    const r = outerOn(C, 16, 'outline');
    say(`at 16: ${Math.round(100 * r.silhouette[0] / r.silhouette[1])}% of silhouette-keyline icons (${r.silhouette[0]} of ${r.silhouette[1]}), ${Math.round(100 * r.box[0] / r.box[1])}% of declared-box icons; marks ${r.mark[0]} of ${r.mark[1]} (${Math.round(100 * r.mark[0] / r.mark[1])}%)`);
    say(`chevron-down at 16 is ${C.at.get('16/chevron-down').box.w.toFixed(2)} wide`);
    const ex = C.by(16, 'outline').filter((x) => Math.max(...[x.box.x0, x.box.x0 + x.box.w, x.box.y0, x.box.y0 + x.box.h].map(off)) >= HALF_OFF && C.kinds[x.concept][16] !== 'mark');
    say(`non-mark outlines with an outer edge on a half pixel at 16 (${ex.length}): ${ex.map((x) => `${tick(x.concept)} (x ${x.box.x0.toFixed(2)}–${(x.box.x0 + x.box.w).toFixed(2)}, y ${x.box.y0.toFixed(2)}–${(x.box.y0 + x.box.h).toFixed(2)})`).join('; ')}`);
  },

  's3.6'(C) {
    head('§3.6 The filled style');
    const body = [20, 16].map((m) => { const f = fill2(C, m); const g = (k) => `${pc(f.len[k] || 0, f.tot)} (${f.names[k]?.size ?? 0})`; return [m, 2, f.tot.toFixed(0), g('0'), g('(0,1)'), g('1.0')]; });
    say(md(['Master', 'Filled line weight', 'Run length (units)', 'On a whole number — score 0, crisp (concepts)', 'In between (concepts)', 'On a half-number — score 1.0, worst (concepts)'], body, ['r', 'r', 'r', 'r', 'r', 'r']));
    const f16 = fill2(C, 16), f20 = fill2(C, 20);
    say(`on a half-number at 16: ${pc(f16.len['1.0'], f16.tot)} of the 2.0 length in ${f16.names['1.0'].size} concepts: ${[...f16.names['1.0']].sort().map(tick).join(', ')}`);
    say(`at 20: ${pc(f20.len['1.0'], f20.tot)} in ${f20.names['1.0'].size} concepts`);
    let n25 = 0, at05 = 0;
    for (const x of C.by(24, 'filled')) for (const [, c, len, w] of x.runs) if (w === 2.5) { n25 += len; if (Math.abs(runScoreAt(c, w, 1) - 0.5) < 1e-9) at05 += len; }
    say(`24 filled, weight-2.5 runs scoring exactly 0.500: ${pc(at05, n25)}`);
    const t = topTable(C, 'filled');
    say(t.table);
    say(`scorable above ${TOP}: ${t.r.filter(judge).map((x) => `${x.concept} (${f3(x.blur)})`).join(', ')}`);
  },

  's4.1'(C) {
    head('§4.1 The instrument cannot tell at 24 and 20');
    for (const m of [24, 20, 16]) {
      const j = C.by(m, 'outline').filter(judge), so = j.map((x) => x.straightOnly), b = j.map((x) => x.blur);
      say(`${m}: ${j.length} scorable outlines; straight-runs-only ${f3(Math.min(...so))} / ${f3(q(so, 0.5))} / ${f3(Math.max(...so))}; whole-drawing ${f3(Math.min(...b))}–${f3(Math.max(...b))}`);
    }
  },

  's4.2'(C) {
    head('§4.2 By a fully inked pixel: narrowly, yes');
    const body = [];
    for (const s of STYLES) for (const m of MASTERS) { const x = solidByMaster(C, m, s); body.push([s, m, x.drawings, x.tot.toFixed(0), pc(x.core, x.tot), pc(x.tot - x.core, x.tot), x.softDrawings, x.meanPeak.toFixed(3), `${pc(x.mid, x.tot)} (${x.midDrawings} drawings)`, x.mid ? `${Math.round(100 * x.midSoft / x.mid)}%` : '—']); }
    say(md(['Style', 'Master', 'Drawings with a straight stroke run', 'Run length (units)', 'With a fully inked pixel', 'Without one', 'Drawings containing such a run', 'Mean darkest pixel across a line (pooled over all straight length)', 'Run length on the canvas midline', 'of which without a fully inked pixel'], body, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const sm = Object.fromEntries(MASTERS.map((m) => [m, solidByMaster(C, m, 'outline')]));
    for (const m of MASTERS) say(`${m}: no fully inked pixel ${pc(sm[m].tot - sm[m].core, sm[m].tot)}, ${sm[m].softDrawings} drawings (of ${sm[m].drawings}); darkest ${sm[m].meanPeak.toFixed(3)}; midline ${pc(sm[m].mid, sm[m].tot)}, ${sm[m].midDrawings} drawings`);
    say(`16 against 24: ${(100 * (sm[16].softShare - sm[24].softShare)).toFixed(1)} points (${(100 * sm[16].softShare).toFixed(2)}% against ${(100 * sm[24].softShare).toFixed(2)}%), darkest pixel ${(sm[24].meanPeak - sm[16].meanPeak).toFixed(3)}`);
    const sc = softCauses(C);
    say(`the extra at 16: x.125 / x.875 ${(100 * sc.cls[SOFT_ORDER[2]].len / sc.tot).toFixed(1)} points, x.25 / x.75 ${(100 * sc.cls[SOFT_ORDER[3]].len / sc.tot).toFixed(1)}`);
    const ob = bandRows(C, 'outline');
    say(`mean solid-pixel share inside the 16 master: ${Math.round(100 * ob[0].core)}% (band A) to ${Math.round(100 * ob.at(-1).core)}% (band D)`);
  },

  's4.3'(C) {
    head('§4.3 On a 2× screen');
    const body = [];
    for (const m of MASTERS) for (const sc of [1, 2]) {
      const r = retina(C, m, sc); const g = (k) => (r.b[k] ? pc(r.b[k], r.tot) : '·');
      body.push([m, `${sc}× (${m * sc} px)`, `${(m === 16 ? 1.25 : 1.5) * sc}`, r.mean.toFixed(3), ...RETINA_BINS.map(g)]);
    }
    say(md(['Master', 'Shown at', 'Stroke in device px', 'Mean per-run score', 'Perfect (0)', '(0, 0.25]', '(0.25, 0.5]', '(0.5, 0.75]', '> 0.75'], body, ['r', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const r24 = retina(C, 24, 2), r20 = retina(C, 20, 2), r16 = retina(C, 16, 2);
    let exact = 0; for (const x of C.by(16, 'outline')) for (const [, c, len, w] of x.runs) if (Math.abs(runScoreAt(c, w, 2) - 0.5) < 1e-9) exact += len;
    say(`2×: perfect 24 ${pc(r24.b[RETINA_BINS[0]], r24.tot)}, 20 ${pc(r20.b[RETINA_BINS[0]], r20.tot)}; worst-case 24 ${pc(r24.b[RETINA_BINS[4]], r24.tot)}, 20 ${pc(r20.b[RETINA_BINS[4]], r20.tot)}; 16 runs scoring exactly 0.500: ${pc(exact, r16.tot)}`);
  },

  s5(C) {
    head('§5 What the instrument cannot see');
    const o = C.by(16, 'outline'); const k = (t) => o.filter((x) => kindOf(x) === t).length;
    say(`not scorable at 16: ${o.length - k('J')} of ${o.length} (${Math.round(100 * (o.length - k('J')) / o.length)}%): ${k('D')} diagonal-heavy, ${k('A')} arcs-only, ${k('N')} with no axis-aligned edge`);
    const rows45 = Array.from({ length: 8 }, (_, ph) => diagonalProbe(ph / 8)).map((r) => +r.darkest.toFixed(2));
    const shipped = ['chevron-down', 'check', 'x'].map((n) => rowPeaks(join(C.pin, 'src/icons/16', `${n}.svg`)));
    say(`diagonals: darkest pixel per row ${Math.min(...rows45).toFixed(2)}–${Math.max(...rows45).toFixed(2)}; shipped chevron, check and x ${Math.min(...shipped.map((s) => s.lo)).toFixed(2)}–${Math.max(...shipped.map((s) => s.hi)).toFixed(2)}`);
    const v = withHalfTone(o).map((x) => x.halfTone);
    say(`half-tone share at 16 outline: median ${q(v, 0.5).toFixed(2)}, 10th percentile ${q(v, 0.1).toFixed(2)}, 90th percentile ${q(v, 0.9).toFixed(2)}`);
  },

  s6(C) {
    head('§6 Judged list');
    const sm = Object.fromEntries(MASTERS.map((m) => [m, solidByMaster(C, m, 'outline')]));
    const sc = softCauses(C);
    const shipped = rowPeaks(join(C.pin, 'src/icons/16', 'x.svg'));
    const mid = sc.cls[SOFT_ORDER[0]];
    say(`G-1: plus darkest pixel ${C.at.get('16/plus').meanPeak.toFixed(3)} against ${shipped.hi.toFixed(2)} for x; midline ${pc(sm[16].mid, sm[16].tot)} of straight length at 16, ${mid.n} runs in ${mid.c.size} drawings (24 ${pc(sm[24].mid, sm[24].tot)}, 20 ${pc(sm[20].mid, sm[20].tot)}); plus filled twin darkest ${(100 * C.twin(C.at.get('16/plus')).meanPeak).toFixed(1)}%`);
    const o = C.by(16, 'outline');
    const pm = o.filter((x) => /^(plus|minus)(-small|-large)?$/.test(x.name));
    say(`G-2: eight at exactly 0.750: ${o.filter((x) => judge(x) && x.blur === 0.75).length}; plug-3 ${f3(C.at.get('16/plug-3').blur)}; plus and minus families on the midline only: ${pm.length} drawings, all runs at 8: ${pm.every((x) => x.runs.every(([, c]) => c === 8)) ? 'yes' : 'no'}; chart-bar, menu-3, sort: non-midline whole-number runs at ${['chart-bar', 'menu-3', 'sort'].map((n) => [...new Set(C.at.get(`16/${n}`).runs.map(([, c]) => c).filter((c) => c === Math.round(c) && c !== 8))].sort((a, b) => a - b).join(' and ')).join(' · ')}`);
    say(`G-3: soft off the midline ${pc(sc.soft - sc.mid, sc.tot)} (${(sc.soft - sc.mid).toFixed(0)} units): x.125/x.875 ${(100 * sc.cls[SOFT_ORDER[2]].len / sc.tot).toFixed(1)} in ${sc.cls[SOFT_ORDER[2]].c.size}, other whole numbers ${(100 * sc.cls[SOFT_ORDER[1]].len / sc.tot).toFixed(1)} in ${sc.cls[SOFT_ORDER[1]].c.size}, x.25/x.75 ${(100 * sc.cls[SOFT_ORDER[3]].len / sc.tot).toFixed(1)} in ${sc.cls[SOFT_ORDER[3]].c.size}, off the grid ${(100 * sc.cls[SOFT_ORDER[4]].len / sc.tot).toFixed(1)}`);
    const f16 = fill2(C, 16), f20 = fill2(C, 20);
    say(`G-4: filled 2.0 on half-numbers: ${f16.names['1.0'].size} concepts at 16, ${f20.names['1.0'].size} at 20; ${pc(f16.len['1.0'], f16.tot)} of the length at 16 (${pc(f20.len['1.0'], f20.tot)} at 20)`);
    say(`G-5: no fully inked pixel 16 ${pc(sm[16].tot - sm[16].core, sm[16].tot)} against 24 ${pc(sm[24].tot - sm[24].core, sm[24].tot)} and 20 ${pc(sm[20].tot - sm[20].core, sm[20].tot)}; darkest ${sm[16].meanPeak.toFixed(3)} against ${sm[24].meanPeak.toFixed(3)} and ${sm[20].meanPeak.toFixed(3)}`);
    let exact = 0; for (const x of o) for (const [, c, len, w] of x.runs) if (Math.abs(runScoreAt(c, w, 2) - 0.5) < 1e-9) exact += len;
    const r24 = retina(C, 24, 2), r20 = retina(C, 20, 2);
    say(`G-6: 2×: 16 runs at exactly 0.500 ${pc(exact, sm[16].tot)}; perfect 24 ${pc(r24.b[RETINA_BINS[0]], r24.tot)}, 20 ${pc(r20.b[RETINA_BINS[0]], r20.tot)}`);
    const rows45 = Array.from({ length: 8 }, (_, ph) => +diagonalProbe(ph / 8).darkest.toFixed(2));
    say(`G-7: outside the landing score ${o.filter((x) => !judge(x)).length} of ${o.length}; diagonal darkest pixel ${Math.min(...rows45).toFixed(2)}–${Math.max(...rows45).toFixed(2)}`);
    const c16 = centrelines(C, 16);
    say(`G-8: on x.375 / x.625 ${pc(c16.tot['x.375'] + c16.tot['x.625'], c16.T0)}; midline ${pc(c16.tot['canvas midline'], c16.T0)}`);
    const ex = o.filter((x) => Math.max(...[x.box.x0, x.box.x0 + x.box.w, x.box.y0, x.box.y0 + x.box.h].map(off)) >= HALF_OFF && C.kinds[x.concept][16] !== 'mark');
    say(`G-9: ${ex.length} non-mark outlines with a half-pixel outer edge: ${ex.map((x) => x.concept).join(', ')}`);
  },

  s7(C) {
    head('§7 Noticed in passing');
    const hits = [];
    for (const r of C.rows) { const icon = readIcon(r.file); if (icon.paths.some((p) => zeroLengthArcs(p.d).length)) hits.push(`${r.master}/${r.name}`); }
    say(`files with a zero-length arc: ${new Set(hits).size}: ${[...new Set(hits)].join(', ')}`);
    const { diffs, scored } = independentDiffs(C);
    say(`arcExtremes noise: ${diffs.length} of ${scored} scores move, by up to ${Math.max(...diffs.map((x) => Math.abs(x.d))).toFixed(3)}`);
  },

  appA1(C) { appendixA(C, 'outline', 'Appendix A1. Every outline at 16'); },
  appA2(C) { appendixA(C, 'filled', 'Appendix A2. Every filled drawing at 16'); },

  appB(C) {
    head('Appendix B. 24 and 20 — every drawing');
    const L = [];
    const concepts = [...new Set(C.rows.map((r) => r.concept))].sort();
    const g = (c, m, s) => C.at.get(`${m}/${s === 'filled' ? c + '-filled' : c}`);
    for (const c of concepts) {
      const a = g(c, 24, 'outline'), b = g(c, 20, 'outline'), d = g(c, 24, 'filled'), e = g(c, 20, 'filled');
      L.push([tick(c), f3(a.blur), a.coreShare == null ? '—' : Math.round(100 * a.coreShare), f3(b.blur), b.coreShare == null ? '—' : Math.round(100 * b.coreShare), f3(d.blur), f3(e.blur)]);
    }
    say(md(['concept', 'O24 score', 'O24 solid-run %', 'O20 score', 'O20 solid-run %', 'F24 score', 'F20 score'], L, ['l', 'r', 'r', 'r', 'r', 'r', 'r']));
  },
};

/** App. A1's note: scores stored to 4 dp and shown to 3 — how many shown values sit more than 0.0005
 *  from the exact score (double rounding), over the defined landing and straight-only scores. */
export function roundingNote(rows) {
  let n = 0, big = 0;
  for (const x of rows) for (const [k, ex] of [['blur', 'blurExact'], ['straightOnly', 'straightExact']]) {
    if (x[k] == null) continue; n++; if (Math.abs(Number(x[k].toFixed(3)) - x[ex]) > 0.0005) big++;
  }
  return { n, big };
}

function appendixA(C, s, title) {
  head(title);
  if (s === 'outline') {
    const { n, big } = roundingNote(STYLES.flatMap((st) => C.by(16, st)));
    say(`scores shown to three decimals from a 4-dp store: ${big} of ${n} defined scores differ by 0.001 from rounding the exact value`);
  }
  const rows = withHalfTone(C.by(16, s).sort((a, b) => a.name.localeCompare(b.name)));
  const L = rows.map((x) => {
    const w = x.worst[0];
    return [tick(x.concept), f3(x.blur), kindOf(x), f3(x.straightOnly), x.diagonalShare == null ? '—' : Math.round(100 * x.diagonalShare), x.strokeLen > 0 ? Math.round(100 * x.arcLen / x.strokeLen) : '—', x.runCount, x.edgeCount, Math.round(100 * x.halfTone), x.meanPeak == null ? '—' : x.meanPeak.toFixed(2), x.coreShare == null ? '—' : Math.round(100 * x.coreShare), w ? `${w.kind === 'run' ? 'run' : 'curve'} ${w.axis}=${w.coord}, ${w.off.toFixed(3)}, ${w.lenDev.toFixed(2)}` : '—'];
  });
  say(md(['concept', 'score', 'judge', 'straight-only', 'diagonal %', 'curve %', 'run edges', 'edges', 'half-tone %', 'darkest px', 'solid-run %', 'worst edge (kind axis=coord, off, ink length px)'], L, ['l', 'r', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l']));
}

export const SECTION_NAMES = Object.keys(SECTIONS);
const FLAGS = ['--timing'];

export function run(pin, wanted = SECTION_NAMES, { timing = false } = {}) {
  out.length = 0;
  const C = census(pin);
  if (timing) out.push(`(census ${(C.ms / 1000).toFixed(1)} s)`);
  for (const s of wanted) { const t = Date.now(); SECTIONS[s](C); if (timing) out.push(`(${s} ${((Date.now() - t) / 1000).toFixed(1)} s)`); }
  return out.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const pinArg = args.find((a) => !a.startsWith('--'));
  const usage = 'usage: node tools/audit/grid-probe.mjs <pin-dir> [section …] [--timing]\n  sections: ' + SECTION_NAMES.join(' ');
  if (!pinArg) { console.error(usage); process.exit(2); }
  const pin = resolve(pinArg);
  const missing = MASTERS.filter((m) => { const d = join(pin, 'src/icons', String(m)); return !existsSync(d) || !statSync(d).isDirectory(); });
  if (missing.length) { console.error(`no ${missing.map((m) => `src/icons/${m}`).join(', ')} in ${pin}\n${usage}`); process.exit(2); }
  const badFlags = args.filter((a) => a.startsWith('--') && !FLAGS.includes(a));
  if (badFlags.length) { console.error(`unknown flag: ${badFlags.join(' ')}\n${usage}`); process.exit(2); }
  const wanted = args.filter((a) => !a.startsWith('--') && a !== pinArg);
  const bad = wanted.filter((s) => !SECTION_NAMES.includes(s));
  if (bad.length) { console.error(`unknown section: ${bad.join(' ')}\n${usage}`); process.exit(2); }
  console.log(run(pin, wanted.length ? wanted : SECTION_NAMES, { timing: args.includes('--timing') }).replace(/^\n/, ''));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
