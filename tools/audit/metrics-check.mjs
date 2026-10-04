#!/usr/bin/env node
// METRICS TRUTHFULNESS — card 1.12 (axis F12, "honest metrics"). AUDIT ONLY.
//
// `dist/metrics.json` is the product's differentiator (CLAUDE.md, after the Tools
// table): per drawing an ink box, geometric bearings (where ink stops) and optical
// bearings (where it reads as stopping), which a customer subtracts as negative
// margins. If one of those numbers is wrong, every layout that uses the icon is
// wrong by that much. This file recomputes every published field from the SVG,
// INDEPENDENTLY of `tools/geometry.mjs` and `tools/optical.mjs`, and says where the
// published number and the drawing part company. `metrics-probe.mjs` prints every
// figure in docs/audit/findings-metrics.md from it.
//
// Nothing in `tools/lint.mjs`, `tools/build.mjs` or the lab imports this, and it
// must stay that way.
//
// WHAT IS INDEPENDENT, AND HOW PRECISE.
//   · Its own path parser and arc centre parameterisation (SVG 1.1 F.6.5), with
//     F.6.2's out-of-range rules: a zero-length arc is OMITTED, a zero radius is a
//     line, a radius too short for its chord is scaled up.
//   · Ink is the set's own declared paint, restated: a stroked path inks every point
//     within half its width of the centreline (that IS round cap + round join, which
//     every root in the set declares); an area path inks its even-odd interior (a
//     point is ink when a ray from it crosses the outline an odd number of times).
//   · Boxes are solved, not sampled: arc and Bézier extremes come from the curve.
//   · The edge on a scanline is ANALYTIC for straight runs and circular arcs (the
//     swept disc's boundary is two offset lines or two offset circles plus the round
//     caps). Only elliptical arcs (312 of the 18,133 arcs at 5933041) have no closed
//     form; their centreline is sampled every 0.0005 unit, an edge error under 1e-7.
//   · The OPTICAL MODEL is not mine to re-derive: it is the specification in
//     `tools/optical.mjs:41-68` (alpha 0.75; a recession deeper than one stroke stops
//     counting; a step larger than one stroke ends the run; the mean is over every
//     scanline that holds ink). `modelRecession` restates it. A step equal to one
//     stroke continues the run ("larger than"); equality is read with an allowance of
//     TIE = 1e-6, which absorbs floating-point noise and nothing else.
//
// Usage:
//   node tools/audit/metrics-check.mjs <icons-dir> <metrics.json> [--out report.json]
// e.g. from an archived pin:  git archive 5933041 | tar -x -C /tmp/pin
//   (cd /tmp/pin && node tools/build.mjs)
//   node tools/audit/metrics-check.mjs /tmp/pin/src/icons /tmp/pin/dist/metrics.json
// Writes nothing unless --out is given, and never inside src/, dist/ or lab/.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TAU = Math.PI * 2;
const EPS = 1e-9;                // geometric coincidence (a scanline exactly on a tangent)
export const STEP = 0.25;        // optical.mjs:18 — the scanline pitch the model is specified at
export const ALPHA = 0.75;       // optical.mjs:70 — share of the mean recession charged as bearing
export const TIE = 1e-6;         // a step within this of one stroke IS one stroke (float noise only)
export const TIE_WIDE = 1e-3;    // the first version's allowance, kept to show what depends on it
export const NUDGE = 0.002;      // a hair: far below anything a renderer or an eye resolves
export const NEAR = 0.02;        // two extremes this close are one edge to the eye (0.02 px at 16)
const SAME = 0.01;               // geometry.mjs:154's tolerance for "the same box"
const ELL_STEP = 0.0005;         // centreline sampling for elliptical arcs only
const DENSE = 0.01;              // polylines for containers and enclosure tests
const DOT_MAX = 3;               // a dot is a circle at most this wide on its centreline
export const SIDES = ['left', 'right', 'top', 'bottom'];
export const r2 = (n) => (n == null || !Number.isFinite(n) ? null : Math.round(n * 100) / 100);

// ── reading a file ─────────────────────────────────────────────────────────

const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1], m[2]]));

/** One SVG text → canvas, paint per path (attribute order does not matter), notes. */
export function readSvg(text, label = '<text>') {
  const notes = [...text.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].trim());
  const clean = text.replace(/<!--[\s\S]*?-->/g, '');
  const rootM = clean.match(/<svg\b([^>]*)>/);
  if (!rootM) throw new Error(`${label}: no <svg> root`);
  const root = attrsOf(rootM[1]);
  const vb = (root.viewBox ?? '').trim().split(/[\s,]+/).map(Number);
  if (vb.length !== 4 || vb[0] !== 0 || vb[1] !== 0 || vb[2] !== vb[3]) throw new Error(`${label}: viewBox ${root.viewBox} is not 0 0 n n`);
  const canvas = vb[2];
  const strokes = [], areas = [], other = [];
  for (const m of clean.matchAll(/<(\w+)\b([^>]*?)\/?>/g)) {
    if (m[1] === 'svg') continue;
    if (m[1] !== 'path') { other.push(m[1]); continue; }
    const a = attrsOf(m[2]);
    if (a.transform) throw new Error(`${label}: transform on a path is not supported`);
    const fill = a.fill ?? root.fill ?? 'black';               // SVG's initial fill is black
    const stroke = a.stroke ?? root.stroke ?? 'none';
    const width = Number(a['stroke-width'] ?? root['stroke-width'] ?? 1);
    const sub = parseD(a.d ?? '', label);
    const paint = { d: a.d, syntaxDot: /^M[^A-Za-z]+A[^A-Za-z]+A[^A-Za-z]+Z$/.test((a.d ?? '').trim()), ...sub };
    if (fill !== 'none') areas.push({ ...paint, rule: a['fill-rule'] ?? root['fill-rule'] ?? 'nonzero' });
    if (stroke !== 'none') strokes.push({ ...paint, width, cap: a['stroke-linecap'] ?? root['stroke-linecap'] ?? 'butt', join: a['stroke-linejoin'] ?? root['stroke-linejoin'] ?? 'miter' });
  }
  const note = (re) => notes.map((n) => n.match(re)).find(Boolean);
  const opt = note(/^optical:\s*([-\d.]+)\s+([-\d.]+)$/);
  return {
    label, canvas, rootWidth: Number(root['stroke-width'] ?? 1), strokes, areas, other,
    notes: {
      optical: opt ? [Number(opt[1]), Number(opt[2])] : null,
      glyph: note(/^glyph:\s*(\w+)$/)?.[1] ?? null,
      keylineMark: notes.some((n) => /^keyline:\s*mark$/.test(n)),
      anchor: note(/^anchor:\s*([\w-]+)$/)?.[1] ?? null,
      box: note(/^box:\s*([\d.]+)\s*[x×]\s*([\d.]+)$/)?.slice(1).map(Number) ?? null,
      grows: notes.some((n) => /^grows:/.test(n)),
    },
  };
}

// ── the path grammar ───────────────────────────────────────────────────────

const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

/** `d` → command letters and numbers; arc flags may be packed (`A.5.5 0 1012 3`). */
export function tokens(d) {
  const out = [];
  let i = 0, cmd = null, n = 0;
  const num = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;
  while (i < d.length) {
    const ch = d[i];
    if (/[\s,]/.test(ch)) { i++; continue; }
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(ch)) { cmd = ch; n = 0; out.push(ch); i++; continue; }
    // arc flags (params 4 and 5 of each 7-tuple) are one character and need no separator
    if (cmd && cmd.toUpperCase() === 'A' && (n % 7 === 3 || n % 7 === 4)) {
      if (ch !== '0' && ch !== '1') throw new Error(`bad arc flag '${ch}' in ${d}`);
      out.push(Number(ch)); i++; n++; continue;
    }
    const m = num.exec(d.slice(i));
    if (!m) throw new Error(`unparseable '${d.slice(i, i + 12)}' in ${d}`);
    out.push(Number(m[0])); i += m[0].length; n++;
  }
  return out;
}

/** `d` → subpaths of absolute segments. Each subpath: { segs, closed, start }. */
export function parseD(d, label = '') {
  const t = tokens(d);
  const subpaths = [];
  let sp = null, cx = 0, cy = 0, sx = 0, sy = 0, lastC = null, lastQ = null, omitted = 0, elliptical = 0;
  let i = 0;
  const begin = (x, y) => { sp = { segs: [], closed: false, start: [x, y] }; subpaths.push(sp); sx = x; sy = y; };
  const line = (x, y) => { sp.segs.push({ k: 'L', a: [cx, cy], b: [x, y] }); cx = x; cy = y; };
  while (i < t.length) {
    const c = t[i++];
    if (typeof c !== 'string') throw new Error(`${label}: number without a command in ${d}`);
    const up = c.toUpperCase(), rel = c !== up;
    if (up === 'Z') {
      if (!sp) continue;                                        // a second Z closes nothing
      if (Math.hypot(cx - sx, cy - sy) > 0) line(sx, sy);
      sp.closed = true; cx = sx; cy = sy; lastC = lastQ = null;
      sp = null;                    // anything but M after Z starts a new subpath here
      continue;
    }
    let first = true;
    do {
      const args = t.slice(i, i + ARITY[up]);
      if (args.length < ARITY[up] || args.some((v) => typeof v !== 'number')) throw new Error(`${label}: short ${c} in ${d}`);
      i += ARITY[up];
      const P = (x, y) => (rel ? [cx + x, cy + y] : [x, y]);
      if (up === 'M') {
        const [x, y] = P(args[0], args[1]);
        if (first) { begin(x, y); cx = x; cy = y; } else line(x, y);       // implicit lineto
        lastC = lastQ = null;
      } else {
        if (!sp) begin(cx, cy);
        if (up === 'L') line(...P(args[0], args[1]));
        else if (up === 'H') line(rel ? cx + args[0] : args[0], cy);
        else if (up === 'V') line(cx, rel ? cy + args[0] : args[0]);
        else if (up === 'C' || up === 'S') {
          const c1 = up === 'C' ? P(args[0], args[1]) : lastC ? [2 * cx - lastC[0], 2 * cy - lastC[1]] : [cx, cy];
          const c2 = up === 'C' ? P(args[2], args[3]) : P(args[0], args[1]);
          const b = up === 'C' ? P(args[4], args[5]) : P(args[2], args[3]);
          sp.segs.push({ k: 'C', a: [cx, cy], c1, c2, b }); [cx, cy] = b; lastC = c2; lastQ = null;
          first = false; continue;
        } else if (up === 'Q' || up === 'T') {
          const q = up === 'Q' ? P(args[0], args[1]) : lastQ ? [2 * cx - lastQ[0], 2 * cy - lastQ[1]] : [cx, cy];
          const b = up === 'Q' ? P(args[2], args[3]) : P(args[0], args[1]);
          sp.segs.push({ k: 'Q', a: [cx, cy], c: q, b }); [cx, cy] = b; lastQ = q; lastC = null;
          first = false; continue;
        } else if (up === 'A') {
          const [x, y] = P(args[5], args[6]);
          const seg = arcSegment(cx, cy, args[0], args[1], args[2], args[3], args[4], x, y);
          if (seg === null) omitted++;
          else { sp.segs.push(seg); if (seg.k === 'A' && Math.abs(seg.rx - seg.ry) > 1e-12) elliptical++; }
          cx = x; cy = y;
        }
        lastC = lastQ = null;
      }
      first = false;
    } while (i < t.length && typeof t[i] === 'number');
  }
  return { subpaths, omitted, elliptical };
}

/** SVG 1.1 F.6.5 endpoint → centre, with F.6.2's out-of-range handling. null = omitted. */
export function arcSegment(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2) {
  if (x1 === x2 && y1 === y2) return null;                    // F.6.2: identical endpoints → omit
  if (rx === 0 || ry === 0) return { k: 'L', a: [x1, y1], b: [x2, y2] };
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = (rotDeg * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  const lam = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
  const den = rx * rx * yp * yp + ry * ry * xp * xp;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * yp) / ry, cyp = (-co * ry * xp) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => {
    const c = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    const a = Math.acos(Math.min(1, Math.max(-1, c)));
    return ux * vy - uy * vx < 0 ? -a : a;
  };
  const t0 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry);
  let dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry);
  if (!fS && dt > 0) dt -= TAU;
  if (fS && dt < 0) dt += TAU;
  return { k: 'A', a: [x1, y1], b: [x2, y2], cx, cy, rx, ry, phi, t0, dt };
}

const arcPoint = (s, t) => {
  const c = Math.cos(s.phi), si = Math.sin(s.phi), px = Math.cos(t) * s.rx, py = Math.sin(t) * s.ry;
  return [c * px - si * py + s.cx, si * px + c * py + s.cy];
};

/** Is parameter angle t on the arc's sweep (ends included)? */
function inSweep(s, t) {
  const u = ((((t - s.t0) * Math.sign(s.dt)) % TAU) + TAU) % TAU;
  return u <= Math.abs(s.dt) + EPS || u >= TAU - EPS;
}

/** Angles (absolute) inside an arc's sweep where x or y is extreme. */
function arcExtremeAngles(s) {
  const c = Math.cos(s.phi), si = Math.sin(s.phi);
  const tx = Math.atan2(-s.ry * si, s.rx * c), ty = Math.atan2(s.ry * c, s.rx * si);
  const out = [];
  for (const base of [tx, tx + Math.PI, ty, ty + Math.PI]) {
    const u = s.dt >= 0 ? (((base - s.t0) % TAU) + TAU) % TAU : (((s.t0 - base) % TAU) + TAU) % TAU;
    if (u > 1e-12 && u < Math.abs(s.dt) - 1e-12) out.push(s.dt >= 0 ? s.t0 + u : s.t0 - u);
  }
  return out;
}

const bez = (p, t) => {          // de Casteljau, any degree
  let q = p.map((v) => [...v]);
  while (q.length > 1) q = q.slice(1).map((v, i) => [q[i][0] + (v[0] - q[i][0]) * t, q[i][1] + (v[1] - q[i][1]) * t]);
  return q[0];
};
const ctrl = (s) => (s.k === 'C' ? [s.a, s.c1, s.c2, s.b] : [s.a, s.c, s.b]);

/** Parameter values in (0,1) where a Bézier's x or y is extreme. */
function bezExtremeTs(s) {
  const p = ctrl(s), ts = [];
  for (const k of [0, 1]) {
    if (p.length === 3) {
      const den = p[0][k] - 2 * p[1][k] + p[2][k];
      if (Math.abs(den) > 1e-12) ts.push((p[0][k] - p[1][k]) / den);
    } else {
      const a = -p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k];
      const b = 2 * (p[0][k] - 2 * p[1][k] + p[2][k]);
      const c = p[1][k] - p[0][k];
      if (Math.abs(a) < 1e-12) { if (Math.abs(b) > 1e-12) ts.push(-c / b); }
      else {
        const disc = b * b - 4 * a * c;
        if (disc >= 0) { const r = Math.sqrt(disc); ts.push((-b + r) / (2 * a), (-b - r) / (2 * a)); }
      }
    }
  }
  return ts.filter((t) => t > 1e-12 && t < 1 - 1e-12);
}

/** Exact box of one segment's centreline. */
export function segBox(s) {
  const pts = [s.a, s.b];
  if (s.k === 'A') for (const t of arcExtremeAngles(s)) pts.push(arcPoint(s, t));
  if (s.k === 'C' || s.k === 'Q') for (const t of bezExtremeTs(s)) pts.push(bez(ctrl(s), t));
  return boxOf(pts);
}
const boxOf = (pts) => pts.reduce((b, [x, y]) => ({ x0: Math.min(b.x0, x), y0: Math.min(b.y0, y), x1: Math.max(b.x1, x), y1: Math.max(b.y1, y) }),
  { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
const grow = (b, h) => ({ x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h });
const EMPTY = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };

/** Exact centreline box of a path (all subpaths). A lone moveto paints nothing. */
export function centrelineBox(p) {
  let b = EMPTY;
  for (const sp of p.subpaths) for (const s of sp.segs) b = union(b, segBox(s));
  return b;
}

/** The ink box of what ships: strokes grown by half their width, areas as drawn. */
export function inkBoxOf(icon) {
  let b = EMPTY;
  for (const p of icon.strokes) { const c = centrelineBox(p); if (c.x0 <= c.x1) b = union(b, grow(c, p.width / 2)); }
  for (const p of icon.areas) { const c = centrelineBox(p); if (c.x0 <= c.x1) b = union(b, c); }
  return b;
}

// ── on-curve sampling (anatomy and the elliptical edge) ────────────────────

/** Points along one segment, every <= step, endpoints and axis extremes included. */
export function sampleSeg(s, step = DENSE) {
  if (s.k === 'L') {
    const n = Math.max(1, Math.ceil(Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) / step));
    return Array.from({ length: n + 1 }, (_, i) => [s.a[0] + ((s.b[0] - s.a[0]) * i) / n, s.a[1] + ((s.b[1] - s.a[1]) * i) / n]);
  }
  if (s.k === 'A') {
    const n = Math.max(2, Math.ceil((Math.abs(s.dt) * Math.max(s.rx, s.ry)) / step));
    const ts = Array.from({ length: n + 1 }, (_, i) => s.t0 + (s.dt * i) / n).concat(arcExtremeAngles(s));
    const pts = ts.sort((u, v) => (s.dt >= 0 ? u - v : v - u)).map((t) => arcPoint(s, t));
    pts[0] = [...s.a]; pts[pts.length - 1] = [...s.b];         // exact endpoints
    return pts;
  }
  const p = ctrl(s);
  const len = p.slice(1).reduce((l, v, i) => l + Math.hypot(v[0] - p[i][0], v[1] - p[i][1]), 0);
  const n = Math.max(2, Math.ceil(len / step));
  const ts = Array.from({ length: n + 1 }, (_, i) => i / n).concat(bezExtremeTs(s)).sort((u, v) => u - v);
  return ts.map((t) => bez(p, t));
}

/** Every subpath as a polyline (closed ones end where they start). */
export function polylines(p, step = DENSE) {
  return p.subpaths.filter((sp) => sp.segs.length).map((sp) => {
    const pts = [];
    for (const s of sp.segs) { const q = sampleSeg(s, step); pts.push(...(pts.length ? q.slice(1) : q)); }
    return { pts, closed: sp.closed };
  });
}

// ── the exact edge on one scanline ─────────────────────────────────────────

const along = (p, vertical) => (vertical ? p[1] : p[0]);     // the scanline's own coordinate
const across = (p, vertical) => (vertical ? p[0] : p[1]);    // the measured coordinate

/** Dense on-curve points of a segment with no closed-form swept edge, sorted on each
 *  axis once so a scanline reads only its window. */
function denseCache(seg) {
  if (!seg._dense) {
    const pts = sampleSeg(seg, ELL_STEP);
    seg._dense = { 1: [...pts].sort((p, q) => p[1] - q[1]), 0: [...pts].sort((p, q) => p[0] - q[0]) };
  }
  return seg._dense;
}

/**
 * The ink of one stroked segment (half-width r) on the scanline `s`, as [lo, hi] of
 * the measured coordinate, or null. vertical = true: the scanline is y = s and x is
 * measured (left/right sides); false: x = s and y is measured (top/bottom).
 * A straight run's swept disc is bounded by its two offset lines and its two round
 * caps; a circular arc's by its two offset circles and its caps — so both are exact.
 */
export function strokeSlice(seg, r, s, vertical) {
  let lo = Infinity, hi = -Infinity;
  const put = (m) => { if (m < lo) lo = m; if (m > hi) hi = m; };
  const disc = (p) => {
    const d = s - along(p, vertical);
    if (Math.abs(d) <= r + EPS) { const w = Math.sqrt(Math.max(0, r * r - d * d)); put(across(p, vertical) - w); put(across(p, vertical) + w); }
  };
  disc(seg.a); disc(seg.b);
  const circular = seg.k === 'A' && Math.abs(seg.rx - seg.ry) < 1e-12 && seg.phi === 0
    && (seg.rx >= r || Math.abs(seg.dt) <= Math.PI);
  if (seg.k === 'L') {
    const a0 = along(seg.a, vertical), a1 = along(seg.b, vertical), m0 = across(seg.a, vertical), m1 = across(seg.b, vertical);
    const L = Math.hypot(a1 - a0, m1 - m0);
    if (L > 0 && Math.abs(a1 - a0) > 1e-15) {
      const na = (m1 - m0) / L, nm = -(a1 - a0) / L;         // a unit normal, in (along, across)
      for (const sg of [-1, 1]) {
        const t = (s - (a0 + sg * r * na)) / (a1 - a0);
        if (t >= -EPS && t <= 1 + EPS) put(m0 + sg * r * nm + Math.min(1, Math.max(0, t)) * (m1 - m0));
      }
    }
  } else if (circular) {
    const R = seg.rx, ca = along([seg.cx, seg.cy], vertical), cm = across([seg.cx, seg.cy], vertical);
    // outer offset circle at the same angle; inner at the same angle (R > r) or
    // through the centre to the opposite side (R < r; only safe up to a half turn,
    // where the end caps cover what the inner side leaves)
    for (const [rho, flip] of [[R + r, false], [Math.abs(R - r), R < r]]) {
      if (rho <= 0) continue;
      const d = s - ca;
      if (Math.abs(d) > rho + EPS) continue;
      const w = Math.sqrt(Math.max(0, rho * rho - d * d));
      for (const m of [cm - w, cm + w]) {
        const x = vertical ? m : s, y = vertical ? s : m;
        let t = Math.atan2(y - seg.cy, x - seg.cx);
        if (flip) t += Math.PI;
        if (inSweep(seg, t)) put(m);
      }
    }
  } else {
    const dense = denseCache(seg), arr = dense[vertical ? 1 : 0], ax = vertical ? 1 : 0;
    let i0 = 0, i1 = arr.length;
    while (i0 < i1) { const mid = (i0 + i1) >> 1; if (arr[mid][ax] < s - r - EPS) i0 = mid + 1; else i1 = mid; }
    for (let i = i0; i < arr.length && arr[i][ax] <= s + r + EPS; i++) disc(arr[i]);
  }
  return lo === Infinity ? null : [lo, hi];
}

/** Where one area-boundary segment crosses the scanline `s` (measured coordinates). */
export function areaCrossings(seg, s, vertical, out) {
  if (seg.k === 'L') {
    const a0 = along(seg.a, vertical), a1 = along(seg.b, vertical), m0 = across(seg.a, vertical), m1 = across(seg.b, vertical);
    if (s < Math.min(a0, a1) - EPS || s > Math.max(a0, a1) + EPS) return;
    if (Math.abs(a1 - a0) <= EPS) { out.push(m0, m1); return; }   // an edge lying on the scanline
    const t = Math.min(1, Math.max(0, (s - a0) / (a1 - a0)));
    out.push(m0 + t * (m1 - m0));
    return;
  }
  if (seg.k === 'A' && seg.phi === 0) {
    if (vertical) {
      const q = (s - seg.cy) / seg.ry; if (Math.abs(q) > 1 + 1e-12) return;
      const t0 = Math.asin(Math.max(-1, Math.min(1, q)));
      for (const t of [t0, Math.PI - t0]) if (inSweep(seg, t)) out.push(seg.cx + seg.rx * Math.cos(t));
    } else {
      const q = (s - seg.cx) / seg.rx; if (Math.abs(q) > 1 + 1e-12) return;
      const t0 = Math.acos(Math.max(-1, Math.min(1, q)));
      for (const t of [t0, -t0]) if (inSweep(seg, t)) out.push(seg.cy + seg.ry * Math.sin(t));
    }
    return;
  }
  const pts = sampleSeg(seg, ELL_STEP);                     // Béziers and rotated arcs: none in the set
  for (let i = 1; i < pts.length; i++) areaCrossings({ k: 'L', a: pts[i - 1], b: pts[i] }, s, vertical, out);
}

/** The ink's extent on one scanline, over every stroked and area segment. */
export function inkSlice(icon, s, vertical) {
  let lo = Infinity, hi = -Infinity;
  for (const p of icon.strokes) {
    const r = p.width / 2;
    for (const sp of p.subpaths) for (const seg of sp.segs) {
      const e = strokeSlice(seg, r, s, vertical);
      if (e) { if (e[0] < lo) lo = e[0]; if (e[1] > hi) hi = e[1]; }
    }
  }
  const xs = [];
  for (const p of icon.areas) for (const sp of p.subpaths) for (const seg of sp.segs) areaCrossings(seg, s, vertical, xs);
  for (const m of xs) { if (m < lo) lo = m; if (m > hi) hi = m; }
  return lo === Infinity ? null : [lo, hi];
}

/**
 * Per-scanline extreme ink for each side. Scanlines run every STEP from the ink box's
 * own edge (optical.mjs:83 anchors them there too), shifted by `offset`; with
 * anchor 'high' they run from the far edge back, which is exactly the grid the
 * drawing's mirror image is read on. Scanlines that meet no ink are left out, as
 * optical.mjs:36 leaves them out. `at` keeps each kept scanline's position.
 */
export function sideProfiles(icon, { step = STEP, offset = 0, anchor = 'low', box = null } = {}) {
  const ink = box ?? inkBoxOf(icon);
  if (!(ink.x0 <= ink.x1)) return null;
  const out = { box: ink };
  for (const [axis, lo, hi] of [['h', ink.y0, ink.y1], ['v', ink.x0, ink.x1]]) {
    const vertical = axis === 'h';
    const [a, b] = vertical ? ['left', 'right'] : ['top', 'bottom'];
    const P = { [a]: [], [b]: [], at: [] };
    for (let k = 0; ; k++) {
      const s = anchor === 'low' ? lo + offset + k * step : hi - offset - k * step;
      if (anchor === 'low' ? s > hi + EPS : s < lo - EPS) break;
      const e = inkSlice(icon, s, vertical);
      if (!e) continue;
      P[a].push(e[0]); P[b].push(e[1]); P.at.push(s);
    }
    out[a] = P[a]; out[b] = P[b]; out[`at${axis}`] = P.at;
  }
  return out;
}

/**
 * optical.mjs:46-68, restated: mean recession over every inked scanline, counting
 * only the run contiguous with the extreme edge, each scanline capped at one stroke,
 * the run ending at any step larger than one stroke. tie 'continue' reads a step
 * within `tol` of one stroke as one stroke (the specification: "larger than"); tie
 * 'break' reads it as larger. `start` overrides the scanline the run starts from
 * (the code takes the first extreme in scan order).
 * Fed the build's own samples with tol 0, this reproduces every non-null published
 * recession at 5933041 (7,528 sides of 1,884 stroke-only drawings).
 */
export function modelRecession(prof, far, stroke, { tie = 'continue', tol = TIE, start = null } = {}) {
  if (!prof.length) return 0;
  const CAP = stroke, JUMP = stroke;
  let iMax = 0;
  for (let i = 1; i < prof.length; i++) if (Math.abs(prof[i] - far) < Math.abs(prof[iMax] - far)) iMax = i;
  if (start != null) iMax = start;
  let sum = 0;
  for (const dir of [-1, 1]) {
    let prev = prof[iMax];
    for (let i = iMax + dir; i >= 0 && i < prof.length; i += dir) {
      const step = Math.abs(prof[i] - prev);
      if (step > JUMP + tol || (tie === 'break' && step > JUMP - tol)) break;
      sum += Math.min(Math.abs(far - prof[i]), CAP);
      prev = prof[i];
    }
  }
  return sum / prof.length;
}

const farOf = (prof, side) => (side === 'left' || side === 'top' ? Math.min(...prof) : Math.max(...prof));

/**
 * The model applied to the shipped ink of ANY drawing — strokes, areas or both.
 * `stroke` is the file's root stroke-width, which is what build.mjs:35 hands the
 * model for every drawing it does model.
 */
export function opticalOf(icon, { alpha = ALPHA, stroke = icon.rootWidth, tie = 'continue', tol = TIE, profiles = null } = {}) {
  const pr = profiles ?? sideProfiles(icon);
  if (!pr) return null;
  const { box } = pr, c = icon.canvas, out = {};
  for (const side of SIDES) {
    const prof = pr[side];
    const rec = modelRecession(prof, farOf(prof, side), stroke, { tie, tol });
    const geo = { left: box.x0, top: box.y0, right: c - box.x1, bottom: c - box.y1 }[side];
    out[side] = { geometric: geo, recession: rec, optical: geo + alpha * rec, scanlines: prof.length };
  }
  return out;
}

/**
 * How much the model's answer moves when the drawing does not. Every combination
 * of: the scanline grid slid by -NUDGE, 0, +NUDGE; a step of exactly one stroke read
 * as continuing or as breaking; the run started from each scanline within NEAR of the
 * extreme. Per side: the lowest and highest reading (lo, hi) and, for the mechanism
 * table, how far each perturbation ALONE moves the base reading (slide, tie, start).
 */
export function stability(icon, { alpha = ALPHA, stroke = icon.rootWidth, profiles = null } = {}) {
  const base = profiles ?? sideProfiles(icon);
  const slid = [base, sideProfiles(icon, { offset: NUDGE }), sideProfiles(icon, { offset: -NUDGE })];
  const geo = { left: base.box.x0, top: base.box.y0, right: icon.canvas - base.box.x1, bottom: icon.canvas - base.box.y1 };
  const read = (prof, side, o) => geo[side] + alpha * modelRecession(prof, farOf(prof, side), stroke, o);
  const out = {};
  for (const side of SIDES) {
    const b = read(base[side], side, {});
    let lo = Infinity, hi = -Infinity, bySlide = 0, byStart = 0;
    slid.forEach((pr, j) => {
      const prof = pr[side], far = farOf(prof, side);
      for (const tie of ['continue', 'break']) {
        prof.forEach((v, i) => {
          if (Math.abs(v - far) > NEAR + EPS) return;
          const x = geo[side] + alpha * modelRecession(prof, far, stroke, { tie, start: i });
          if (x < lo) lo = x; if (x > hi) hi = x;
        });
      }
      if (j > 0) bySlide = Math.max(bySlide, Math.abs(read(prof, side, {}) - b));
      else prof.forEach((v, i) => { if (Math.abs(v - far) <= NEAR + EPS) byStart = Math.max(byStart, Math.abs(read(prof, side, { start: i }) - b)); });
    });
    const byTie = Math.abs(read(base[side], side, { tie: 'break' }) - b);
    out[side] = { lo, hi, base: b, bySlide, byTie, byStart };
  }
  return out;
}

/**
 * The model read on the drawing's mirror image, side by side with the original. A
 * mirror swaps which edge the scanline grid is anchored to (optical.mjs:83) and
 * reverses the scan order (optical.mjs:55-57's "first extreme"). A left-right mirror
 * changes only the top and bottom readings, a top-bottom mirror only the left and
 * right. Per side: total = mirror − original; order = the same grid read backwards −
 * original; grid = total − order (a remainder); gridDirect = the far-anchored grid
 * read forwards − original (the re-anchoring measured on its own).
 */
export function mirrorCheck(icon, { alpha = ALPHA, stroke = icon.rootWidth, profiles = null } = {}) {
  const base = profiles ?? sideProfiles(icon);
  const high = sideProfiles(icon, { anchor: 'high' });
  const out = {};
  for (const side of SIDES) {
    const rd = (prof) => alpha * modelRecession(prof, farOf(prof, side), stroke);
    const o = rd(base[side]);
    const total = rd(high[side]) - o, order = rd([...base[side]].reverse()) - o;
    out[side] = { total, order, grid: total - order, gridDirect: rd([...high[side]].reverse()) - o };
  }
  return out;
}

/** The drawing as a multiset of segments, direction-blind, for finding exact mirror
 *  pairs. how: null (as drawn), 'lr' (x → canvas − x), 'tb' (y → canvas − y). */
export function geometryKey(icon, how = null) {
  const c = icon.canvas, F = ([x, y]) => [how === 'lr' ? c - x : x, how === 'tb' ? c - y : y];
  const P = (p) => F(p).map((v) => (Math.abs(v) < 5e-7 ? 0 : v).toFixed(6)).join(',');
  const keys = [];
  for (const [kind0, ps] of [['s', icon.strokes], ['a', icon.areas]]) for (const p of ps) for (const sp of p.subpaths) for (const g of sp.segs) {
    const kind = kind0 === 's' ? `s${p.width}` : kind0;          // a 2.5 line is not a 1.5 line
    const ends = [P(g.a), P(g.b)].sort().join(' ');
    if (g.k === 'L') keys.push(`${kind} L ${ends}`);
    else if (g.k === 'A') keys.push(`${kind} A ${P([g.cx, g.cy])} ${g.rx.toFixed(6)},${g.ry.toFixed(6)} ${ends} via ${P(arcPoint(g, g.t0 + g.dt / 2))}`);
    else keys.push(`${kind} ${g.k} ${ctrl(g).map(P).join(' ')}`);
  }
  return keys.sort().join('|');
}

// ── anatomy: is the published "container" a container? ─────────────────────

/** Even-odd point-in-polygon over a set of closed rings. */
function insideRings(rings, x, y) {
  let odd = false;
  for (const ring of rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
  }
  return odd;
}
const distToPolyline = (pts, x, y) => {
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L2)) : 0;
    best = Math.min(best, Math.hypot(ax + t * dx - x, ay + t * dy - y));
  }
  return best;
};

/**
 * What build.mjs:54 publishes as `container`/`ratio` is anatomy()'s choice of
 * "shell": the first stroked path whose grown box equals the whole stroked
 * drawing's (geometry.mjs:171-183). This re-identifies that path from the exact
 * boxes and asks the question the field's own comment poses (build.mjs:90, "the
 * silhouette's ink diameter, when there is one"): is the shell a CLOSED path that
 * ENCLOSES the rest of the drawing? A point of another path counts as inside when
 * the shell's centreline polygon contains it, or when it lies within half a stroke of
 * the shell's centreline (touching the wall from inside).
 */
export function shellOf(icon) {
  const ps = icon.strokes;
  if (ps.length < 2) return { shell: -1, reason: 'fewer than two stroked paths' };
  const boxes = ps.map((p) => grow(centrelineBox(p), p.width / 2));
  const whole = boxes.reduce(union, EMPTY);
  const same = (a, b) => ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(a[k] - b[k]) < SAME);
  const shell = boxes.findIndex((b) => same(b, whole));
  if (shell < 0) return { shell: -1, reason: 'no path spans the whole stroked box' };
  const sp = ps[shell];
  const closed = sp.subpaths.filter((s) => s.segs.length).every((s) => s.closed
    || Math.hypot(s.segs.at(-1).b[0] - s.start[0], s.segs.at(-1).b[1] - s.start[1]) < 1e-6);
  const rings = polylines(sp, 0.05).map((l) => l.pts);
  let inside = 0, outside = 0;
  for (let i = 0; i < ps.length; i++) {
    if (i === shell) continue;
    for (const { pts } of polylines(ps[i], 0.1)) for (const [x, y] of pts) {
      const onWall = rings.some((r) => distToPolyline(r, x, y) <= sp.width / 2 + 1e-6);
      if (onWall || (closed && insideRings(rings, x, y))) inside++; else outside++;
    }
  }
  const rest = boxes.filter((_, i) => i !== shell).reduce(union, EMPTY);
  const sb = boxes[shell];
  return {
    shell, closed, encloses: closed && outside === 0, inside, outside,
    container: Math.max(sb.x1 - sb.x0, sb.y1 - sb.y0), mark: { w: rest.x1 - rest.x0, h: rest.y1 - rest.y0 },
  };
}

/**
 * The same question asked of a SHAPE-FILLED drawing, which build.mjs:54 never asks
 * (it hands anatomy() the stroked leftovers only). The container is an area subpath
 * whose box is the whole drawing's (within 0.01); the mark is everything else.
 * `encloses` is decided three ways, because the answer depends on it:
 *   box     — no test beyond the box;
 *   ring    — every point of every other part (sampled every 0.1) lies inside the
 *             outer subpath or within 1e-6 of it;
 *   strict  — as ring, but a point ON the outer subpath counts as outside.
 * A drawing that is one shape with nothing inside it is `alone`: enclosed, no mark.
 */
export function filledContainerOf(icon) {
  const whole = inkBoxOf(icon);
  const same = (a, b) => ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(a[k] - b[k]) < SAME);
  for (const p of icon.areas) {
    const subs = p.subpaths.filter((s) => s.segs.length);
    const boxes = subs.map((s) => s.segs.map(segBox).reduce(union, EMPTY));
    const outer = boxes.findIndex((b) => same(b, whole));
    if (outer < 0) continue;
    const ring = polylines({ subpaths: [subs[outer]] }, 0.05)[0].pts;
    let rest = EMPTY, n = 0, outRing = 0, outStrict = 0;
    const take = (b, pts) => {
      rest = union(rest, b); n++;
      let o1 = false, o2 = false;
      for (const [x, y] of pts) {
        const d = distToPolyline(ring, x, y), inn = insideRings([ring], x, y);
        if (!inn && d > 1e-6) o1 = true;
        if (!inn || d <= 1e-6) o2 = true;
      }
      if (o1) outRing++; if (o2) outStrict++;
    };
    subs.forEach((s, i) => { if (i !== outer) take(boxes[i], polylines({ subpaths: [s] }, 0.1)[0].pts); });
    for (const q of icon.areas) if (q !== p) for (const s of q.subpaths.filter((t) => t.segs.length)) take(s.segs.map(segBox).reduce(union, EMPTY), polylines({ subpaths: [s] }, 0.1)[0].pts);
    for (const q of icon.strokes) take(grow(centrelineBox(q), q.width / 2), polylines(q, 0.1).flatMap((l) => l.pts));
    const container = Math.max(whole.x1 - whole.x0, whole.y1 - whole.y0);
    // one shape and nothing else: a silhouette with no part inside it (the outline's
    // inner line became a notch in the edge, as in send-filled) — a container, no mark
    if (!n) return { container, mark: null, alone: true, encloses: { box: true, ring: true, strict: true } };
    return { container, mark: { w: rest.x1 - rest.x0, h: rest.y1 - rest.y0 }, parts: n,
      encloses: { box: true, ring: outRing === 0, strict: outStrict === 0 } };
  }
  return null;
}

// ── the dot-to-body gap ────────────────────────────────────────────────────

/** A dot: one closed subpath of arcs sweeping one full turn, whose box is a circle no
 *  more than DOT_MAX across on its centreline. Unlike geometry.mjs:151's `isDot` (a
 *  syntax test, M A A Z), this refuses an ellipse (`globe`'s meridian) and a ring. */
export function isDotPath(p) {
  const subs = p.subpaths.filter((s) => s.segs.length);
  if (subs.length !== 1 || !subs[0].closed) return false;
  const segs = subs[0].segs.filter((s) => !(s.k === 'L' && s.a[0] === s.b[0] && s.a[1] === s.b[1]));
  if (!segs.length || !segs.every((s) => s.k === 'A')) return false;
  const b = centrelineBox(p);
  return Math.abs((b.x1 - b.x0) - (b.y1 - b.y0)) < 1e-6 && b.x1 - b.x0 <= DOT_MAX
    && Math.abs(segs.reduce((t, s) => t + Math.abs(s.dt), 0) - TAU) < 1e-6;
}

/**
 * The dot-to-body gap, computed exactly for the SAME pair the build measures:
 * anatomy()'s dot is any non-shell path that passes the syntax test M A A Z
 * (geometry.mjs:151), when exactly one does (geometry.mjs:187-188). Returned with
 * `realDot`, whether that path is a dot at all by isDotPath.
 */
export function dotGapOf(icon, shellIndex) {
  const rest = icon.strokes.filter((_, i) => i !== shellIndex);
  const dots = rest.filter((p) => p.syntaxDot);
  if (dots.length !== 1 || rest.length < 2) return null;
  const dot = dots[0], body = rest.filter((p) => p !== dot);
  const segs = body.flatMap((p) => p.subpaths.flatMap((sp) => sp.segs));
  let min = Infinity;
  for (const { pts } of polylines(dot, 0.002)) for (const [x, y] of pts) for (const g of segs) min = Math.min(min, distToSeg(g, x, y));
  const db = grow(centrelineBox(dot), dot.width / 2);
  const size = min - dot.width, part = db.y1 - db.y0;
  return { size, part, ratio: size / part, realDot: isDotPath(dot) };
}

/** Exact distance from a point to a segment's centreline (circular arcs in closed form). */
function distToSeg(g, x, y) {
  if (g.k === 'L') return distToPolyline([g.a, g.b], x, y);
  if (g.k === 'A' && Math.abs(g.rx - g.ry) < 1e-12 && g.phi === 0) {
    const t = Math.atan2(y - g.cy, x - g.cx);
    const ends = Math.min(Math.hypot(x - g.a[0], y - g.a[1]), Math.hypot(x - g.b[0], y - g.b[1]));
    return inSweep(g, t) ? Math.min(ends, Math.abs(Math.hypot(x - g.cx, y - g.cy) - g.rx)) : ends;
  }
  return distToPolyline(sampleSeg(g, 0.002), x, y);
}

// ── comparing against what the build published ─────────────────────────────

export const styleOf = (icon, name) => (icon.areas.length ? 'shape-filled' : /-filled$/.test(name) ? 'line-filled' : 'outline');

/** One drawing: everything recomputed, next to everything published. */
export function checkOne(icon, pub) {
  const box = inkBoxOf(icon);
  const c = icon.canvas;
  const ink = { x: box.x0, y: box.y0, w: box.x1 - box.x0, h: box.y1 - box.y0 };
  const bearing = { left: box.x0, top: box.y0, right: c - box.x1, bottom: c - box.y1 };
  const profiles = sideProfiles(icon, { box });
  const opt = opticalOf(icon, { profiles });
  const wide = opticalOf(icon, { profiles, tol: TIE_WIDE });
  const stab = stability(icon, { profiles });
  const mirror = mirrorCheck(icon, { profiles });
  const sh = shellOf(icon);
  const filled = icon.areas.length ? filledContainerOf(icon) : null;
  const gap = sh.shell >= 0 ? dotGapOf(icon, sh.shell) : null;
  const centre = { dx: (box.x0 + box.x1) / 2 - c / 2, dy: (box.y0 + box.y1) / 2 - c / 2 };
  const pubOpt = (s, k) => pub.optical?.[s]?.[k];
  const diff = {
    ink: Math.max(...['x', 'y', 'w', 'h'].map((k) => Math.abs((pub.ink?.[k] ?? NaN) - ink[k]))),
    bearing: Math.max(...SIDES.map((s) => Math.abs((pub.bearing?.[s] ?? NaN) - bearing[s]))),
    optical: Object.fromEntries(SIDES.map((s) => [s, {
      geometric: pubOpt(s, 'geometric') == null ? null : pubOpt(s, 'geometric') - opt[s].geometric,
      recession: pubOpt(s, 'recession') == null ? null : pubOpt(s, 'recession') - opt[s].recession,
      optical: pubOpt(s, 'optical') == null ? null : pubOpt(s, 'optical') - opt[s].optical,
      opticalWide: pubOpt(s, 'optical') == null ? null : pubOpt(s, 'optical') - wide[s].optical,
    }])),
    // the published geometric bearing twice: in `bearing` and in `optical.*.geometric`
    twoGeometrics: SIDES.filter((s) => pubOpt(s, 'geometric') != null && pubOpt(s, 'geometric') !== pub.bearing?.[s]).length,
    shift: { dx: (pub.shift?.[0] ?? 0) - centre.dx, dy: (pub.shift?.[1] ?? 0) - centre.dy },
  };
  return { ink, bearing, optical: opt, opticalWide: wide, stability: stab, mirror, shell: sh, filled, gap, centre, diff, pub,
    mirrorKeys: { self: geometryKey(icon), lr: geometryKey(icon, 'lr'), tb: geometryKey(icon, 'tb') } };
}

/** Every drawing under <dir>/<master>/ against metrics[<master>][<name>]. */
export function checkAll(iconsDir, metrics, { only = null } = {}) {
  const rows = [];
  for (const m of Object.keys(metrics).sort((a, b) => b - a)) {
    for (const f of readdirSync(join(iconsDir, m)).filter((x) => x.endsWith('.svg')).sort()) {
      const name = f.replace(/\.svg$/, '');
      if (only && !only.includes(name)) continue;
      const icon = readSvg(readFileSync(join(iconsDir, m, f), 'utf8'), `${m}/${f}`);
      const pub = metrics[m][name];
      if (!pub) { rows.push({ master: +m, name, missing: true }); continue; }
      rows.push({ master: +m, name, style: styleOf(icon, name), notes: icon.notes,
        omittedArcs: icon.strokes.concat(icon.areas).reduce((t, p) => t + p.omitted, 0),
        ellipticalArcs: icon.strokes.concat(icon.areas).reduce((t, p) => t + p.elliptical, 0),
        ...checkOne(icon, pub) });
    }
  }
  return rows;
}

/** The counts the CLI prints, as data — what docs/audit/findings-metrics.md §1 quotes. */
export function summarize(rows) {
  const by = new Map(rows.map((r) => [`${r.master} ${r.name}`, r]));
  const twin = (r) => by.get(`${r.master} ${r.name.replace(/-filled$/, '')}`);
  const n = (f) => rows.filter(f).length;
  const sides = (f) => rows.reduce((t, r) => t + SIDES.filter((s) => f(r, s)).length, 0);
  const strokeOnly = (r) => r.style !== 'shape-filled';
  const off = (r, s) => r.diff.optical[s].optical;
  const range = (r, s) => r.stability[s].hi - r.stability[s].lo;
  const centreOff = (r) => Math.max(Math.abs(r.diff.shift.dx), Math.abs(r.diff.shift.dy));
  const drawnOff = (r) => Math.max(Math.abs(r.centre.dx), Math.abs(r.centre.dy));
  const notRounded = (r) => ['x', 'y', 'w', 'h'].some((k) => r.pub.ink[k] !== r2(r.ink[k])) || SIDES.some((s) => r.pub.bearing[s] !== r2(r.bearing[s]));
  return {
    entries: rows.length,
    inkMaxErr: Math.max(...rows.map((r) => Math.max(r.diff.ink, r.diff.bearing))),
    notOneRounding: n(notRounded),
    twoGeometrics: { sides: rows.reduce((t, r) => t + r.diff.twoGeometrics, 0), entries: n((r) => r.diff.twoGeometrics > 0) },
    opticalNull: n((r) => SIDES.some((s) => r.pub.optical[s].optical == null)),
    forcedZero: n((r) => r.style === 'shape-filled' && SIDES.every((s) => r.pub.optical[s].recession === 0)),
    understatedSides: sides((r, s) => r.style === 'shape-filled' && off(r, s) < -0.01),
    strokeMisread: { sides: sides((r, s) => strokeOnly(r) && off(r, s) != null && Math.abs(off(r, s)) > 0.01),
      entries: n((r) => strokeOnly(r) && SIDES.some((s) => off(r, s) != null && Math.abs(off(r, s)) > 0.01)) },
    unstable: { sides: sides((r, s) => range(r, s) > 0.05), entries: n((r) => SIDES.some((s) => range(r, s) > 0.05)) },
    shiftDeclaredOff: n((r) => r.notes.optical && centreOff(r) > 0.01),
    shiftUndeclaredOff: n((r) => !r.notes.optical && drawnOff(r) > 0.005),
    container: { published: n((r) => r.pub.container != null), notRing: n((r) => r.pub.container != null && !r.shell.encloses),
      missing: n((r) => r.style === 'shape-filled' && r.pub.container == null && twin(r)?.shell.encloses) },
    gap: { published: n((r) => r.pub.gap != null), nonGlyph: n((r) => r.pub.gap != null && r.notes.glyph !== 'dot'),
      falseDot: n((r) => r.pub.gap != null && r.gap && !r.gap.realDot), declaredNull: n((r) => r.notes.glyph === 'dot' && r.pub.gap == null) },
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [dir, metricsFile] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const outAt = process.argv.indexOf('--out');
  if (!dir || !metricsFile) { console.error('usage: metrics-check.mjs <icons-dir> <metrics.json> [--out report.json]'); process.exit(2); }
  const out = outAt > 0 ? resolve(process.argv[outAt + 1]) : null;
  if (out && /\/(src|dist|lab)\//.test(out) && out.startsWith(resolve('.'))) { console.error('refusing to write inside src/, dist/ or lab/'); process.exit(2); }
  const rows = checkAll(dir, JSON.parse(readFileSync(metricsFile, 'utf8')));
  const S = summarize(rows);
  console.log(`${S.entries} drawings checked against ${metricsFile}`);
  console.log(`ink/bearing: max |published - exact| ${S.inkMaxErr.toFixed(4)} units; entries not equal to one correct 2-dp rounding: ${S.notOneRounding}; `
    + `sides whose optical.geometric differs from bearing: ${S.twoGeometrics.sides} (${S.twoGeometrics.entries} entries)`);
  console.log(`optical: null published ${S.opticalNull} · shape-filled with recession forced to 0 ${S.forcedZero} (understated > 0.01 on ${S.understatedSides} sides)`);
  console.log(`optical, stroke-only drawings: |published - exact model| > 0.01 on ${S.strokeMisread.sides} sides (${S.strokeMisread.entries} entries)`);
  console.log(`optical model: stability range > 0.05 on ${S.unstable.sides} sides (${S.unstable.entries} entries)`);
  console.log(`shift: declared and drawn differ by > 0.01 on ${S.shiftDeclaredOff} · undeclared, ink off-centre by > 0.005 on ${S.shiftUndeclaredOff}`);
  console.log(`container: published ${S.container.published} · not a closed ring enclosing the rest ${S.container.notRing} · `
    + `null on a shape-filled drawing whose outline twin has one ${S.container.missing}`);
  console.log(`gap: published ${S.gap.published} · on a drawing without a glyph: dot note ${S.gap.nonGlyph} · whose "dot" is not a dot ${S.gap.falseDot} · `
    + `glyph: dot declared, gap null ${S.gap.declaredNull}`);
  if (out) { writeFileSync(out, JSON.stringify(rows, (k, v) => (typeof v === 'number' ? Math.round(v * 1e9) / 1e9 : v))); console.log(`report → ${out}`); }
}
