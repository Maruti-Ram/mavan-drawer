#!/usr/bin/env node
// tools/audit/refs/nucleo.mjs — Nucleo reference extractor (plan card 0.3).
//
// WHAT IT DOES.  Reads the Nucleo desktop app's local library (a sqlite database
// plus one .svg per icon) and writes a normalised JSON record per drawing under
// research/references/nucleo/. Wave 0 proves it on a bounded sample; the same
// code walks all 64,933 drawings for wave 2 (`--all`).
//
// WHY IT ALSO LIVES HERE: the helpers below the "SHARED" banner (dual(),
// normalisePath(), bboxOf(), measure() …) are the single copy of the record
// vocabulary. tools/audit/refs/sfsymbols.mjs imports them rather than keeping a
// second copy — "a rule lives in one place".
//
// LICENSING.  Nucleo is licensed third-party artwork. Everything this file writes
// goes under research/references/ (gitignored: "internal comparison only, never
// commit or ship"). Nothing here may be copied into src/icons/. We measure these
// drawings to calibrate OUR method; we never adopt their values.
//
// EVERY MEASUREMENT IS RECORDED TWICE (plans/set-and-rules-audit.md, "Fixed input"):
// as a share of its own canvas and as a multiple of its own stroke. See dual().
// A record that only carries absolute units is a defect. Raw path coordinates are the one
// exception — they are source units; `canvas` and `strokeBasis.value` are the two divisors
// that turn them into either relative form (`scaledPaths()` does it).
//
// RECORD SHAPE = tools/audit/refs/figma.mjs's (schema mdx-ref/1), so one reader serves every
// source: dual leaves are {abs, canvas, stroke}; a record carries `measure` {stroke, ink{x,y,w,h},
// margins, radii[]}, `strokeBasis` {value, from}, and paths with paint/winding/stroke{}. This file
// adds family/set/grid (the brief's names) and arcs ('A' in `d`, with `dCubic` beside it).
//
//   node tools/audit/refs/nucleo.mjs                 extract the default sample
//   node tools/audit/refs/nucleo.mjs extract --names heart,bell --run mine
//   node tools/audit/refs/nucleo.mjs census          what stroke_max etc. really look like
//   node tools/audit/refs/nucleo.mjs verify bell …   extracted geometry vs the file itself
//   node tools/audit/refs/nucleo.mjs compare bell    Core vs UI: redrawn or just scaled?
//   node tools/audit/refs/nucleo.mjs --help          the full option list

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parsePath } from '../../geometry.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '..', '..', '..');
export const REF_ROOT = path.join(REPO, 'research', 'references');
export const SCHEMA = 'mdx-ref/1';          // same id as tools/audit/refs/figma.mjs: one record family
export const NUCLEO_DIR = path.join(os.homedir(), 'Library/Application Support/Nucleo/icons');

// ═══════════════════════════════════════════════════════════════════════════
// SHARED — the record vocabulary. Imported by sfsymbols.mjs.
// ═══════════════════════════════════════════════════════════════════════════

/** Round, never emit -0. */
export const r = (n, dp = 4) => {
  const k = 10 ** dp;
  const q = Math.round(n * k) / k;
  return Object.is(q, -0) ? 0 : q;
};
const fmt = (n, dp) => String(r(n, dp));

/**
 * THE DUAL MEASUREMENT — one number, three readings (same shape as tools/audit/refs/figma.mjs):
 *   abs     the source's own units
 *   canvas  share of its own canvas: x-lengths by the canvas width, y-lengths by its height,
 *           direction-free lengths (a radius, the stroke) by the shorter side
 *   stroke  multiple of the drawing's own stroke (null when it has none we can name —
 *           see strokeBasis; never guessed)
 * ctx = { W, H, basis }  (basis = strokeBasis.value). axis = 'x' | 'y' | 'min'.
 */
export function dual(abs, ctx, axis = 'min') {
  const den = axis === 'x' ? ctx.W : axis === 'y' ? ctx.H : Math.min(ctx.W, ctx.H);
  const q = (v) => (Number.isFinite(v) ? r(v, 5) : null);
  return { abs: q(abs), canvas: den > 0 ? q(abs / den) : null, stroke: ctx.basis > 0 ? q(abs / ctx.basis) : null };
}
/** The divisors a record's measurements used. */
export const ctxOf = (rec) => ({ W: rec.canvas[0], H: rec.canvas[1], basis: rec.strokeBasis?.value ?? null });
/** The one length "share of canvas" means for a direction-free quantity. */
export const canvasSide = (rec) => Math.min(rec.canvas[0], rec.canvas[1]);

/** Walk a measure tree: every number must sit inside a {abs, canvas, stroke} leaf. Returns the offending paths. */
export function assertDual(node, trail = 'measure') {
  const bad = [];
  const isLeaf = (o) => o && typeof o === 'object' && 'abs' in o && 'canvas' in o && 'stroke' in o;
  (function visit(o, p) {
    if (isLeaf(o)) return;
    if (Array.isArray(o)) return o.forEach((v, i) => visit(v, `${p}[${i}]`));
    if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === 'number' && !COUNTS.has(k)) bad.push(`${p}.${k}`);
        else visit(v, `${p}.${k}`);
      }
    }
  })(node, trail);
  return bad;
}
// dimensionless counts / indices / ratios that are allowed to stand bare inside `measure`
const COUNTS = new Set(['path', 'paths', 'count', 'turnDeg', 'n', 'pieces']);

// ── path tools ─────────────────────────────────────────────────────────────
// Segments are arrays:  ['M',x,y] ['L',x,y] ['C',x1,y1,x2,y2,x,y] ['Q',x1,y1,x,y]
// ['A',rx,ry,rotDeg,large,sweep,x,y] ['Z']. ABSOLUTE ONLY: no H/V/S/T, nothing relative.

const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 };

/** SVG path data → absolute segments. Reuses the repo's tokenizer (tools/geometry.mjs). */
export function normalisePath(d) {
  const out = [];
  let cx = 0, cy = 0, sx = 0, sy = 0, lastC = null, lastQ = null, started = false, closed = false;
  for (const { cmd, args } of parsePath(d)) {
    const up = cmd.toUpperCase();
    const rel = cmd !== up;
    if (up === 'Z') {
      if (!started) continue;
      out.push(['Z']); cx = sx; cy = sy; closed = true; lastC = lastQ = null;
      continue;
    }
    const n = ARITY[up];
    if (!n) continue;
    for (let k = 0, first = true; k + n <= args.length; k += n, first = false) {
      const a = args.slice(k, k + n);
      let c = up;
      if (c === 'M' && !first) c = 'L';                 // extra pairs after M are lineto
      if (!started && c !== 'M') break;                  // path must begin with a moveto
      if (closed && c !== 'M') { out.push(['M', sx, sy]); closed = false; }   // new subpath from the old start
      const X = (v) => (rel ? cx + v : v);
      const Y = (v) => (rel ? cy + v : v);
      if (c === 'M') {
        const x = X(a[0]), y = Y(a[1]);
        out.push(['M', x, y]); cx = sx = x; cy = sy = y; started = true; closed = false; lastC = lastQ = null;
      } else if (c === 'L') {
        const x = X(a[0]), y = Y(a[1]); out.push(['L', x, y]); cx = x; cy = y; lastC = lastQ = null;
      } else if (c === 'H') {
        const x = rel ? cx + a[0] : a[0]; out.push(['L', x, cy]); cx = x; lastC = lastQ = null;
      } else if (c === 'V') {
        const y = rel ? cy + a[0] : a[0]; out.push(['L', cx, y]); cy = y; lastC = lastQ = null;
      } else if (c === 'C') {
        const s = ['C', X(a[0]), Y(a[1]), X(a[2]), Y(a[3]), X(a[4]), Y(a[5])];
        out.push(s); lastC = [s[3], s[4]]; lastQ = null; cx = s[5]; cy = s[6];
      } else if (c === 'S') {
        const c1 = lastC ? [2 * cx - lastC[0], 2 * cy - lastC[1]] : [cx, cy];
        const s = ['C', c1[0], c1[1], X(a[0]), Y(a[1]), X(a[2]), Y(a[3])];
        out.push(s); lastC = [s[3], s[4]]; lastQ = null; cx = s[5]; cy = s[6];
      } else if (c === 'Q') {
        const s = ['Q', X(a[0]), Y(a[1]), X(a[2]), Y(a[3])];
        out.push(s); lastQ = [s[1], s[2]]; lastC = null; cx = s[3]; cy = s[4];
      } else if (c === 'T') {
        const c1 = lastQ ? [2 * cx - lastQ[0], 2 * cy - lastQ[1]] : [cx, cy];
        const s = ['Q', c1[0], c1[1], X(a[0]), Y(a[1])];
        out.push(s); lastQ = c1; lastC = null; cx = s[3]; cy = s[4];
      } else if (c === 'A') {
        const x = X(a[5]), y = Y(a[6]);
        let rx = Math.abs(a[0]), ry = Math.abs(a[1]);
        lastC = lastQ = null;
        if (x === cx && y === cy) continue;              // zero-length arc: omitted by the spec
        if (!rx || !ry) { out.push(['L', x, y]); cx = x; cy = y; continue; }   // degenerate arc is a line
        const fixed = fixArcRadii(cx, cy, rx, ry, a[2], x, y);   // spec F.6.6: grow radii that cannot reach
        out.push(['A', fixed.rx, fixed.ry, a[2], a[3] ? 1 : 0, a[4] ? 1 : 0, x, y]); cx = x; cy = y;
      }
    }
  }
  return out;
}

function fixArcRadii(x1, y1, rx, ry, phiDeg, x2, y2) {
  const phi = (phiDeg * Math.PI) / 180, cs = Math.cos(phi), sn = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cs * dx + sn * dy, y1p = -sn * dx + cs * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); return { rx: rx * s, ry: ry * s, grown: true }; }
  return { rx, ry, grown: false };
}

/** SVG F.6.5: endpoint → centre parameterisation. Returns the centre, start angle t1 and sweep dt (radians). */
export function arcCenter(x1, y1, rx, ry, phiDeg, fa, fs, x2, y2) {
  const phi = (phiDeg * Math.PI) / 180, cs = Math.cos(phi), sn = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cs * dx + sn * dy, y1p = -sn * dx + cs * dy;
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fa !== fs ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cs * cxp - sn * cyp + (x1 + x2) / 2;
  const cy = sn * cxp + cs * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => {
    const dot = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    const t = Math.acos(Math.min(1, Math.max(-1, dot)));
    return ux * vy - uy * vx < 0 ? -t : t;
  };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  const t1 = ang(1, 0, ux, uy);
  let dt = ang(ux, uy, vx, vy);
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  return { cx, cy, t1, dt, phi, cs, sn };
}

const arcPoint = (c, rx, ry, t) => {
  const px = rx * Math.cos(t), py = ry * Math.sin(t);
  return [c.cs * px - c.sn * py + c.cx, c.sn * px + c.cs * py + c.cy];
};

/** 2×3 affine [a,b,c,d,e,f]: x' = a x + c y + e,  y' = b x + d y + f. */
export const IDENT = [1, 0, 0, 1, 0, 0];
export const mulM = (A, B) => [
  A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1],
  A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3],
  A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5],
];
const applyM = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
export const detM = (m) => m[0] * m[3] - m[1] * m[2];
export const isIdent = (m) => m.every((v, i) => Math.abs(v - IDENT[i]) < 1e-12);

/** Parse an SVG transform list into one matrix (innermost last). */
export function parseTransform(s) {
  let M = IDENT;
  if (!s) return M;
  for (const t of s.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const a = t[2].split(/[\s,]+/).filter(Boolean).map(Number);
    let m = IDENT;
    if (t[1] === 'matrix' && a.length === 6) m = a;
    else if (t[1] === 'translate') m = [1, 0, 0, 1, a[0] || 0, a[1] || 0];
    else if (t[1] === 'scale') m = [a[0], 0, 0, a[1] ?? a[0], 0, 0];
    else if (t[1] === 'rotate') {
      const th = ((a[0] || 0) * Math.PI) / 180, c = Math.cos(th), sn = Math.sin(th);
      m = [c, sn, -sn, c, 0, 0];
      if (a.length === 3) m = mulM(mulM([1, 0, 0, 1, a[1], a[2]], m), [1, 0, 0, 1, -a[1], -a[2]]);
    } else if (t[1] === 'skewX') m = [1, 0, Math.tan(((a[0] || 0) * Math.PI) / 180), 1, 0, 0];
    else if (t[1] === 'skewY') m = [1, Math.tan(((a[0] || 0) * Math.PI) / 180), 0, 1, 0, 0];
    M = mulM(M, m);
  }
  return M;
}

/** Apply an affine map to segments. Arcs are mapped EXACTLY (SVD of the 2×2 part), so a rotated or mirrored circle stays an arc. */
export function transformSegs(segs, m) {
  if (isIdent(m)) return segs;
  const det = detM(m);
  return segs.map((s) => {
    const k = s[0];
    if (k === 'Z') return s;
    if (k === 'M' || k === 'L') { const [x, y] = applyM(m, s[1], s[2]); return [k, x, y]; }
    if (k === 'C') { const p = applyM(m, s[1], s[2]), q = applyM(m, s[3], s[4]), e = applyM(m, s[5], s[6]); return ['C', ...p, ...q, ...e]; }
    if (k === 'Q') { const p = applyM(m, s[1], s[2]), e = applyM(m, s[3], s[4]); return ['Q', ...p, ...e]; }
    // arc: new ellipse = L · R(phi) · diag(rx,ry) — take its SVD for the new radii and rotation
    const [, rx, ry, phiDeg, fa, fs, x, y] = s;
    const phi = (phiDeg * Math.PI) / 180, cs = Math.cos(phi), sn = Math.sin(phi);
    const m00 = m[0] * cs * rx + m[2] * sn * rx, m10 = m[1] * cs * rx + m[3] * sn * rx;
    const m01 = -m[0] * sn * ry + m[2] * cs * ry, m11 = -m[1] * sn * ry + m[3] * cs * ry;
    const E = (m00 + m11) / 2, F = (m00 - m11) / 2, G = (m10 + m01) / 2, H = (m10 - m01) / 2;
    const Q = Math.hypot(E, H), R = Math.hypot(F, G);
    const a1 = Math.atan2(G, F), a2 = Math.atan2(H, E);
    const beta = (a2 + a1) / 2;
    let deg = (beta * 180) / Math.PI;
    deg = ((deg + 180) % 360 + 360) % 360 - 180;
    const [ex, ey] = applyM(m, x, y);
    const nrx = Q + R, nry = Math.abs(Q - R);
    if (nry < 1e-12) return ['L', ex, ey];
    const circular = Math.abs(nrx - nry) < 1e-9 * Math.max(nrx, nry);      // a circle has no axis: leave the rotation at 0
    return ['A', nrx, circular ? nrx : nry, circular || Math.abs(deg) < 1e-9 ? 0 : deg, fa, det < 0 ? 1 - fs : fs, ex, ey];
  });
}

/**
 * Segments → compact absolute path data. 6 decimals by default: Nucleo's own files carry
 * up to 5 (and a few 7+), and a dot drawn as a 0.0001-long line with square caps takes its
 * ORIENTATION from the 5th decimal — at 4 dp such dots rotate (measured: circle-half-dotted-check, Sharp).
 */
export function formatPath(segs, dp = 6) {
  return segs.map((s) => {
    if (s[0] === 'Z') return 'Z';
    if (s[0] === 'A') return `A${fmt(s[1], dp)} ${fmt(s[2], dp)} ${fmt(s[3], dp)} ${s[4]} ${s[5]} ${fmt(s[6], dp)} ${fmt(s[7], dp)}`;
    return s[0] + s.slice(1).map((v) => fmt(v, dp)).join(' ');
  }).join(' ');
}

/** Exact bounding box of the centreline: curves by derivative roots, arcs by their angular extremes. */
export function bboxOf(segs) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
  let cx = 0, cy = 0, sx = 0, sy = 0;
  const cubicAxis = (p0, p1, p2, p3) => {
    const d0 = p1 - p0, d1 = p2 - p1, d2 = p3 - p2;
    const A = d0 - 2 * d1 + d2, B = 2 * (d1 - d0), C = d0, ts = [];
    if (Math.abs(A) < 1e-12) { if (Math.abs(B) > 1e-12) ts.push(-C / B); }
    else { const disc = B * B - 4 * A * C; if (disc >= 0) { const q = Math.sqrt(disc); ts.push((-B + q) / (2 * A), (-B - q) / (2 * A)); } }
    return ts.filter((t) => t > 0 && t < 1);
  };
  const cub = (p0, p1, p2, p3, t) => (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3;
  const quad = (p0, p1, p2, t) => (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  for (const s of segs) {
    switch (s[0]) {
      case 'M': add(s[1], s[2]); cx = sx = s[1]; cy = sy = s[2]; break;
      case 'L': add(s[1], s[2]); cx = s[1]; cy = s[2]; break;
      case 'Z': cx = sx; cy = sy; break;
      case 'C': {
        add(s[5], s[6]);
        for (const t of cubicAxis(cx, s[1], s[3], s[5])) add(cub(cx, s[1], s[3], s[5], t), cub(cy, s[2], s[4], s[6], t));
        for (const t of cubicAxis(cy, s[2], s[4], s[6])) add(cub(cx, s[1], s[3], s[5], t), cub(cy, s[2], s[4], s[6], t));
        cx = s[5]; cy = s[6]; break;
      }
      case 'Q': {
        add(s[3], s[4]);
        for (const [p0, p1, p2] of [[cx, s[1], s[3]], [cy, s[2], s[4]]]) {
          const den = p0 - 2 * p1 + p2;
          if (Math.abs(den) > 1e-12) { const t = (p0 - p1) / den; if (t > 0 && t < 1) add(quad(cx, s[1], s[3], t), quad(cy, s[2], s[4], t)); }
        }
        cx = s[3]; cy = s[4]; break;
      }
      case 'A': {
        const [, rx, ry, phiDeg, fa, fs, x, y] = s;
        add(x, y);
        const c = arcCenter(cx, cy, rx, ry, phiDeg, fa, fs, x, y);
        const cands = [Math.atan2(-ry * c.sn, rx * c.cs), Math.atan2(ry * c.cs, rx * c.sn)];
        for (const base of cands) for (const t0 of [base, base + Math.PI]) {
          let u = (t0 - c.t1) % (2 * Math.PI);
          if (c.dt >= 0) { if (u < 0) u += 2 * Math.PI; if (u <= c.dt) add(...arcPoint(c, rx, ry, c.t1 + u)); }
          else { if (u > 0) u -= 2 * Math.PI; if (u >= c.dt) add(...arcPoint(c, rx, ry, c.t1 + u)); }
        }
        cx = x; cy = y; break;
      }
      default:
    }
  }
  return x0 === Infinity ? null : { x0, y0, x1, y1 };
}

/** Sample every subpath into points no further apart than `step`. → [{pts, closed}] */
export function sampleSegs(segs, step = 0.1) {
  const subs = [];
  let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  const push = (x, y) => cur.pts.push([x, y]);
  for (const s of segs) {
    if (s[0] === 'M') { cur = { pts: [[s[1], s[2]]], closed: false }; subs.push(cur); cx = sx = s[1]; cy = sy = s[2]; continue; }
    if (!cur) continue;
    if (s[0] === 'L') {
      const n = Math.max(1, Math.ceil(Math.hypot(s[1] - cx, s[2] - cy) / step));
      for (let i = 1; i <= n; i++) push(cx + ((s[1] - cx) * i) / n, cy + ((s[2] - cy) * i) / n);
      cx = s[1]; cy = s[2];
    } else if (s[0] === 'Z') {
      const n = Math.max(1, Math.ceil(Math.hypot(sx - cx, sy - cy) / step));
      for (let i = 1; i <= n; i++) push(cx + ((sx - cx) * i) / n, cy + ((sy - cy) * i) / n);
      cur.closed = true; cx = sx; cy = sy;
    } else if (s[0] === 'C') {
      const len = Math.hypot(s[1] - cx, s[2] - cy) + Math.hypot(s[3] - s[1], s[4] - s[2]) + Math.hypot(s[5] - s[3], s[6] - s[4]);
      const n = Math.max(2, Math.ceil(len / step));
      for (let i = 1; i <= n; i++) {
        const t = i / n, u = 1 - t;
        push(u ** 3 * cx + 3 * u * u * t * s[1] + 3 * u * t * t * s[3] + t ** 3 * s[5],
          u ** 3 * cy + 3 * u * u * t * s[2] + 3 * u * t * t * s[4] + t ** 3 * s[6]);
      }
      cx = s[5]; cy = s[6];
    } else if (s[0] === 'Q') {
      const len = Math.hypot(s[1] - cx, s[2] - cy) + Math.hypot(s[3] - s[1], s[4] - s[2]);
      const n = Math.max(2, Math.ceil(len / step));
      for (let i = 1; i <= n; i++) {
        const t = i / n, u = 1 - t;
        push(u * u * cx + 2 * u * t * s[1] + t * t * s[3], u * u * cy + 2 * u * t * s[2] + t * t * s[4]);
      }
      cx = s[3]; cy = s[4];
    } else if (s[0] === 'A') {
      const [, rx, ry, phiDeg, fa, fs, x, y] = s;
      const c = arcCenter(cx, cy, rx, ry, phiDeg, fa, fs, x, y);
      const n = Math.max(4, Math.ceil((Math.abs(c.dt) * Math.max(rx, ry)) / step));
      for (let i = 1; i <= n; i++) push(...arcPoint(c, rx, ry, c.t1 + (c.dt * i) / n));
      cx = x; cy = y;
    }
  }
  return subs;
}

export const pathLength = (segs) => {
  let L = 0;
  for (const sub of sampleSegs(segs, 0.05)) for (let i = 1; i < sub.pts.length; i++) L += Math.hypot(sub.pts[i][0] - sub.pts[i - 1][0], sub.pts[i][1] - sub.pts[i - 1][1]);
  return L;
};

/** Multiply every coordinate (and radius) by k — "express this drawing as canvas shares / stroke multiples". */
export function scaleSegs(segs, k) {
  return segs.map((s) => (s[0] === 'Z' ? s : s[0] === 'A' ? ['A', s[1] * k, s[2] * k, s[3], s[4], s[5], s[6] * k, s[7] * k] : [s[0], ...s.slice(1).map((v) => v * k)]));
}
/** The record's geometry in the two relative forms: 'canvas' (shorter canvas side = 1) or 'stroke' (stroke = 1). */
export function scaledPaths(rec, basis) {
  const div = basis === 'canvas' ? canvasSide(rec) : rec.strokeBasis?.value;
  if (!(div > 0)) return null;
  return rec.paths.map((p) => formatPath(scaleSegs(normalisePath(p.d), 1 / div), 6));
}

/** Arcs → cubic Béziers (≤ 90° each), for readers that only know M L C Q Z (tools/audit/refs/figma.mjs does). */
export function arcsToCubics(segs) {
  const out = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const s of segs) {
    if (s[0] === 'M') { out.push(s); cx = sx = s[1]; cy = sy = s[2]; continue; }
    if (s[0] === 'Z') { out.push(s); cx = sx; cy = sy; continue; }
    if (s[0] !== 'A') { out.push(s); cx = s[s.length - 2]; cy = s[s.length - 1]; continue; }
    const [, rx, ry, phiDeg, fa, fs, x, y] = s;
    const c = arcCenter(cx, cy, rx, ry, phiDeg, fa, fs, x, y);
    const n = Math.max(1, Math.ceil(Math.abs(c.dt) / (Math.PI / 2) - 1e-9));
    const d = c.dt / n, k = (4 / 3) * Math.tan(d / 4);
    for (let i = 0; i < n; i++) {
      const t0 = c.t1 + i * d, t1 = t0 + d;
      const p0 = arcPoint(c, rx, ry, t0), p3 = i === n - 1 ? [x, y] : arcPoint(c, rx, ry, t1);
      const dv = (t) => [-rx * Math.sin(t), ry * Math.cos(t)];
      const rot = (v) => [c.cs * v[0] - c.sn * v[1], c.sn * v[0] + c.cs * v[1]];
      const d0 = rot(dv(t0)), d1 = rot(dv(t1));
      out.push(['C', p0[0] + k * d0[0], p0[1] + k * d0[1], p3[0] - k * d1[0], p3[1] - k * d1[1], p3[0], p3[1]]);
    }
    cx = x; cy = y;
  }
  return out;
}

// ── what a record measures about itself — always as dual() ─────────────────

/**
 * The measurements an extractor can make without judging anything: the stroke, the outer ink
 * box, the four margins, the ink-centre offset and every drawn radius. Each leaf is a dual().
 * Ink = path bbox grown by half the stroke (exact for round caps and joins; a lower bound for
 * square caps and mitres — said in meta.inkBasis). Also fills each path's own `bbox`.
 * Same key names as tools/audit/refs/figma.mjs: stroke · ink{x,y,w,h} · margins · radii[].
 */
export function measure(rec) {
  const ctx = ctxOf(rec);
  const [W, H] = rec.canvas;
  const m = {};
  m.stroke = ctx.basis ? dual(ctx.basis, ctx) : null;
  if (rec.meta?.nucleo?.strokeMax != null) m.strokeMax = dual(rec.meta.nucleo.strokeMax, ctx);
  const radii = new Map();
  const addRadius = (e) => {
    const key = `${e.kind}|${e.edge}|${Math.round(e.rx * 20) / 20}|${Math.round(e.ry * 20) / 20}|${Math.round(e.turn / 5) * 5}`;
    const o = radii.get(key) || { ...e, n: 0 };
    o.n += e.n ?? 1;
    radii.set(key, o);
  };
  let box = null;
  rec.paths.forEach((p) => {
    if (p.opacity === 0) return;                         // invisible layers (SF templates' clear-behind) are not ink
    const segs = normalisePath(p.d);
    const b = bboxOf(segs);
    if (!b) return;
    p.bbox = { x: dual(b.x0, ctx, 'x'), y: dual(b.y0, ctx, 'y'), w: dual(b.x1 - b.x0, ctx, 'x'), h: dual(b.y1 - b.y0, ctx, 'y') };
    const grow = p.stroke ? p.stroke.weight / 2 : 0;
    const e = { x0: b.x0 - grow, y0: b.y0 - grow, x1: b.x1 + grow, y1: b.y1 + grow };
    box = box ? { x0: Math.min(box.x0, e.x0), y0: Math.min(box.y0, e.y0), x1: Math.max(box.x1, e.x1), y1: Math.max(box.y1, e.y1) } : e;
    const edge = p.paint === 'stroke' ? 'centreline' : p.paint === 'fill' ? 'edge' : 'both';
    if (p.prim === 'circle' && p.src?.circle) addRadius({ kind: 'circle', edge, rx: p.src.circle.r, ry: p.src.circle.r, turn: 360, n: 1 });
    else if (p.prim === 'ellipse' && p.src?.ellipse) addRadius({ kind: 'ellipse', edge, rx: p.src.ellipse.rx, ry: p.src.ellipse.ry, turn: 360, n: 1 });
    else if (p.prim === 'rect' && p.src?.rect && (p.src.rect.rx || p.src.rect.ry)) addRadius({ kind: 'corner', edge, rx: p.src.rect.rx, ry: p.src.rect.ry, turn: 90, n: 4 });
    else {
      let cx = 0, cy = 0;
      for (const s of segs) {
        if (s[0] === 'A') {
          const c = arcCenter(cx, cy, s[1], s[2], s[3], s[4], s[5], s[6], s[7]);
          addRadius({ kind: 'arc', edge, rx: s[1], ry: s[2], turn: Math.abs(c.dt) * 180 / Math.PI, n: 1 });
        }
        if (s[0] !== 'Z') { cx = s[s.length - 2]; cy = s[s.length - 1]; }      // (normalisePath puts an explicit M after every Z, so a Z needs no tracking)
      }
    }
  });
  if (box) {
    m.ink = { x: dual(box.x0, ctx, 'x'), y: dual(box.y0, ctx, 'y'), w: dual(box.x1 - box.x0, ctx, 'x'), h: dual(box.y1 - box.y0, ctx, 'y') };
    m.inkSource = 'analytic';
    m.margins = { left: dual(box.x0, ctx, 'x'), top: dual(box.y0, ctx, 'y'), right: dual(W - box.x1, ctx, 'x'), bottom: dual(H - box.y1, ctx, 'y') };
    m.centreOffset = { x: dual((box.x0 + box.x1) / 2 - W / 2, ctx, 'x'), y: dual((box.y0 + box.y1) / 2 - H / 2, ctx, 'y') };
  } else { m.ink = null; m.margins = null; }
  m.radii = [...radii.values()].map((e) => {
    const o = { kind: e.kind, edge: e.edge, r: dual(e.rx, ctx), turnDeg: r(e.turn, 2), n: e.n, circular: Math.abs(e.rx - e.ry) < 1e-6, smooth: false, pieces: 1 };
    if (!o.circular) o.ry = dual(e.ry, ctx);
    return o;
  }).sort((a, b) => a.r.abs - b.r.abs);
  return m;
}

/** A record as a standalone SVG (for rasterising and for the lab). Paint is rebuilt from the record only. */
export function recordToSvg(rec, { px } = {}) {
  const [W, H] = rec.canvas;
  const size = px ? ` width="${px}" height="${r((px * H) / W, 2)}"` : '';
  const body = rec.paths.map((p) => {
    const filled = p.paint === 'fill' || p.paint === 'both';
    const a = [`d="${p.d}"`, `fill="${filled ? (p.fill || '#000') : 'none'}"`];
    if (filled && p.winding === 'EVENODD') a.push('fill-rule="evenodd"');
    if (filled && p.fillOpacity != null && p.fillOpacity !== 1) a.push(`fill-opacity="${p.fillOpacity}"`);
    if (p.stroke) {
      a.push(`stroke="${p.stroke.color || '#000'}"`, `stroke-width="${p.stroke.weight}"`, `stroke-linecap="${p.stroke.cap}"`, `stroke-linejoin="${p.stroke.join}"`, `stroke-miterlimit="${p.stroke.miterLimit}"`);
      if (p.stroke.opacity != null && p.stroke.opacity !== 1) a.push(`stroke-opacity="${p.stroke.opacity}"`);
    }
    if (p.opacity != null && p.opacity !== 1) a.push(`opacity="${p.opacity}"`);
    return `<path ${a.join(' ')}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${size}>${body}</svg>`;
}

export function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj));
}
/** Refuse to write anywhere but research/references/ — the licensing fence. */
export function assertInRefRoot(p) {
  const abs = path.resolve(p);
  if (!abs.startsWith(REF_ROOT + path.sep)) throw new Error(`refusing to write outside research/references/: ${abs}`);
  return abs;
}
/** True when this module is the entry point (so importing it never runs the CLI). */
export const isMain = (metaUrl) => process.argv[1] && pathToFileURL(fs.realpathSync(process.argv[1])).href === metaUrl;

// tiny argv parser: `--flag`, `--key value`, `--key=value`, positionals
export function parseArgs(argv, valued) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > 0) o[a.slice(2, eq)] = a.slice(eq + 1);
      else if (valued.has(a.slice(2))) o[a.slice(2)] = argv[++i];
      else o[a.slice(2)] = true;
    } else o._.push(a);
  }
  return o;
}
export const csv = (s) => (s == null || s === true ? null : String(s).split(',').map((x) => x.trim()).filter(Boolean));

// ═══════════════════════════════════════════════════════════════════════════
// NUCLEO — SVG reader
// ═══════════════════════════════════════════════════════════════════════════

const HIDDEN = new Set(['defs', 'clipPath', 'mask', 'filter', 'linearGradient', 'radialGradient', 'pattern', 'symbol', 'style', 'title', 'desc', 'metadata', 'marker']);
const DRAWABLE = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon']);
const INHERIT = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity'];
const DEFAULTS = { fill: '#000', 'fill-opacity': '1', 'fill-rule': 'nonzero', stroke: 'none', 'stroke-width': '1', 'stroke-linecap': 'butt', 'stroke-linejoin': 'miter', 'stroke-miterlimit': '4', 'stroke-opacity': '1' };
const ent = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Minimal XML tree. The Nucleo files are machine-written and well formed; anything odd is skipped, not guessed at. */
export function parseXml(text) {
  const root = { name: '#root', attrs: {}, children: [], parent: null };
  let cur = root;
  const tag = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[^>]*>|<(\/?)([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
  for (let m; (m = tag.exec(text));) {
    if (m[2] === undefined) continue;
    if (m[1]) { if (cur.parent) cur = cur.parent; continue; }
    const attrs = {};
    for (const a of m[3].matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[a[1]] = ent(a[2] ?? a[3]);
    if (attrs.style) {
      for (const decl of attrs.style.split(';')) { const i = decl.indexOf(':'); if (i > 0) attrs[decl.slice(0, i).trim()] = decl.slice(i + 1).trim(); }
    }
    const node = { name: m[2], attrs, children: [], parent: cur };
    cur.children.push(node);
    if (!m[4]) cur = node;
  }
  return root;
}

const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };

/** One SVG primitive → absolute segments in its own coordinates, plus the attributes it came from. */
function primitiveSegs(name, a) {
  if (name === 'path') return { segs: normalisePath(a.d || ''), src: null };
  if (name === 'line') {
    const src = { x1: num(a.x1), y1: num(a.y1), x2: num(a.x2), y2: num(a.y2) };
    return { segs: [['M', src.x1, src.y1], ['L', src.x2, src.y2]], src: { line: src } };
  }
  if (name === 'polyline' || name === 'polygon') {
    const pts = (a.points || '').trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const segs = [];
    for (let i = 0; i + 1 < pts.length; i += 2) segs.push([i ? 'L' : 'M', pts[i], pts[i + 1]]);
    if (name === 'polygon' && segs.length) segs.push(['Z']);
    return { segs, src: { [name]: { points: pts } } };
  }
  if (name === 'circle') {
    const c = { cx: num(a.cx), cy: num(a.cy), r: num(a.r) };
    if (!(c.r > 0)) return { segs: [], src: { circle: c } };
    return { segs: [['M', c.cx + c.r, c.cy], ['A', c.r, c.r, 0, 1, 1, c.cx - c.r, c.cy], ['A', c.r, c.r, 0, 1, 1, c.cx + c.r, c.cy], ['Z']], src: { circle: c } };
  }
  if (name === 'ellipse') {
    const e = { cx: num(a.cx), cy: num(a.cy), rx: num(a.rx), ry: num(a.ry) };
    if (!(e.rx > 0 && e.ry > 0)) return { segs: [], src: { ellipse: e } };
    return { segs: [['M', e.cx + e.rx, e.cy], ['A', e.rx, e.ry, 0, 1, 1, e.cx - e.rx, e.cy], ['A', e.rx, e.ry, 0, 1, 1, e.cx + e.rx, e.cy], ['Z']], src: { ellipse: e } };
  }
  if (name === 'rect') {
    const x = num(a.x), y = num(a.y), w = num(a.width), h = num(a.height);
    if (!(w > 0 && h > 0)) return { segs: [], src: { rect: { x, y, w, h } } };
    let rx = a.rx != null ? num(a.rx) : null, ry = a.ry != null ? num(a.ry) : null;
    if (rx == null && ry != null) rx = ry;
    if (ry == null && rx != null) ry = rx;
    rx = Math.min(rx || 0, w / 2); ry = Math.min(ry || 0, h / 2);
    const src = { rect: { x, y, w, h, rx, ry } };
    if (!rx || !ry) return { segs: [['M', x, y], ['L', x + w, y], ['L', x + w, y + h], ['L', x, y + h], ['Z']], src };
    return {
      segs: [['M', x + rx, y], ['L', x + w - rx, y], ['A', rx, ry, 0, 0, 1, x + w, y + ry], ['L', x + w, y + h - ry],
        ['A', rx, ry, 0, 0, 1, x + w - rx, y + h], ['L', x + rx, y + h], ['A', rx, ry, 0, 0, 1, x, y + h - ry],
        ['L', x, y + ry], ['A', rx, ry, 0, 0, 1, x + rx, y], ['Z']],
      src,
    };
  }
  return { segs: [], src: null };
}

/**
 * Read one SVG file's text into canvas + drawable paths with their painting resolved
 * (presentation attributes inherited down through <g>, style="" folded in, transforms
 * baked into the geometry). Effects we cannot reduce to geometry (clip, mask, filter,
 * gradient) are counted in `effects` — the paths are still returned.
 */
export function readSvg(text) {
  const tree = parseXml(text);
  const svg = tree.children.find((c) => c.name === 'svg');
  if (!svg) return { canvas: null, paths: [], effects: {}, errors: ['no <svg> root'] };
  const vb = (svg.attrs.viewBox || '').trim().split(/[\s,]+/).map(Number);
  let canvas, origin = [0, 0];
  if (vb.length === 4 && vb.every(Number.isFinite)) { canvas = [vb[2], vb[3]]; origin = [vb[0], vb[1]]; }
  else canvas = [num(svg.attrs.width), num(svg.attrs.height)];
  const effects = {}, errors = [], paths = [];
  const bump = (k) => { effects[k] = (effects[k] || 0) + 1; };
  const base = mulM(IDENT, [1, 0, 0, 1, -origin[0], -origin[1]]);

  const walk = (node, inh, ctm, opacity, role, masked) => {
    for (const ch of node.children) {
      if (HIDDEN.has(ch.name)) { if (ch.name !== 'title' && ch.name !== 'desc' && ch.name !== 'metadata') bump(ch.name); continue; }
      const a = ch.attrs;
      const nextInh = { ...inh };
      for (const k of INHERIT) if (a[k] !== undefined) nextInh[k] = a[k];
      const m = a.transform ? mulM(ctm, parseTransform(a.transform)) : ctm;
      const op = opacity * num(a.opacity, 1);
      const rl = a['data-color'] || role;
      const mk = masked || !!(a['clip-path'] || a.mask || a.filter);
      if (a['clip-path']) bump('clip-path');
      if (a.mask) bump('mask');
      if (a.filter) bump('filter');
      if (ch.name === 'g' || ch.name === 'svg' || ch.name === 'a' || ch.name === 'switch') { walk(ch, nextInh, m, op, rl, mk); continue; }
      if (!DRAWABLE.has(ch.name)) continue;
      try {
        const { segs: local, src } = primitiveSegs(ch.name, a);
        if (!local.length) continue;
        const segs = transformSegs(local, m);
        const s = nextInh;
        const sw = num(s['stroke-width'], 1) * Math.sqrt(Math.abs(detM(m)) || 1);
        const stroked = s.stroke !== 'none' && sw > 0;
        const filled = s.fill !== 'none';
        if (/url\(/.test(s.fill) || /url\(/.test(s.stroke)) bump('gradient-paint');
        const p = {
          d: formatPath(segs),
          prim: ch.name,
          paint: stroked && filled ? 'both' : stroked ? 'stroke' : filled ? 'fill' : 'none',     // decided by what is PAINTED, as figma.mjs does
          fill: filled ? s.fill : 'none',
          winding: filled ? (s['fill-rule'] === 'evenodd' ? 'EVENODD' : 'NONZERO') : 'NONE',
          stroke: stroked ? { weight: r(sw, 5), align: 'CENTER', cap: s['stroke-linecap'], join: s['stroke-linejoin'], miterLimit: num(s['stroke-miterlimit'], 4), dash: null, color: s.stroke } : null,
        };
        if (segs.some((q) => q[0] === 'A')) p.dCubic = formatPath(arcsToCubics(segs));        // same geometry for readers without arcs
        if (filled && num(s['fill-opacity'], 1) !== 1) p.fillOpacity = num(s['fill-opacity'], 1);
        if (stroked && num(s['stroke-opacity'], 1) !== 1) p.stroke.opacity = num(s['stroke-opacity'], 1);
        if (op !== 1) p.opacity = r(op, 4);
        p.role = rl === 'color-2' ? 'secondary' : 'primary';
        if (src) p.src = src;
        if (a.transform) p.transform = a.transform;
        if (mk) p.masked = true;
        const nc = {};
        for (const k of ['data-cap', 'data-stroke', 'data-square-cap', 'data-glass']) if (a[k] !== undefined) nc[k.slice(5)] = a[k];
        if (Object.keys(nc).length) p.nc = nc;      // Nucleo's own authoring flags (e.g. cap = butt, stroke = none)
        paths.push(p);
      } catch (err) { errors.push(`${ch.name}: ${err.message}`); }
    }
  };
  const rootInh = { ...DEFAULTS };
  for (const k of INHERIT) if (svg.attrs[k] !== undefined) rootInh[k] = svg.attrs[k];
  walk(svg, rootInh, base, 1, null, false);
  return { canvas, origin, paths, effects, errors };
}

/** Mode of a list of strings/numbers (ties → the larger number / later key). */
function modeOf(vals) {
  const c = new Map();
  for (const v of vals) c.set(v, (c.get(v) || 0) + 1);
  let best = null;
  for (const [k, n] of c) if (!best || n > best[1] || (n === best[1] && k > best[0])) best = [k, n];
  return { value: best ? best[0] : null, counts: Object.fromEntries(c) };
}

// ═══════════════════════════════════════════════════════════════════════════
// NUCLEO — database
// ═══════════════════════════════════════════════════════════════════════════

export async function openDb() {
  const { DatabaseSync } = await import('node:sqlite');      // lazy: sfsymbols.mjs imports this file without it
  const f = path.join(NUCLEO_DIR, 'data.sqlite3');
  if (!fs.existsSync(f)) throw new Error(`Nucleo database not found: ${f}`);
  return new DatabaseSync(f, { readOnly: true });
}

const ESSENTIAL_FAMILY = {
  'Nucleo UI Essential': 'Nucleo UI', 'Nucleo Core Essential': 'Nucleo Core', 'Nucleo Micro Bold Essential': 'Nucleo Micro Bold',
  'Nucleo Pixel Essential': 'Nucleo Pixel', 'Nucleo Sharp Essential': 'Nucleo Sharp',
};
const BASE_SQL = `SELECT i.id, i.set_id, i.klass, i.grid, i.width, i.height, i.size, i.name, i.tags, i.nucleo_tags, i.stroke_max, i.corner_custom,
  s.title AS set_title, s.group_id AS group_id, g.title AS group_title, s.local AS set_local
  FROM icons i LEFT JOIN sets s ON s.id = i.set_id LEFT JOIN groups g ON g.id = s.group_id`;

export const familyOf = (row) => row.group_title || ESSENTIAL_FAMILY[row.set_title] || 'Nucleo (other free sets)';
export const svgFile = (row) => path.join(NUCLEO_DIR, 'sets', String(row.set_id), `${row.id}.svg`);

/**
 * Select rows. Every filter is optional and they AND together.
 *   names, sets (ids), families (titles), grids, klasses, ids ("set:id" or id), hasStrokeMax, limit, every (take every Nth)
 */
export function selectRows(db, f = {}) {
  const w = [], p = [];
  const inList = (col, vals) => { if (vals?.length) { w.push(`${col} IN (${vals.map(() => '?').join(',')})`); p.push(...vals); } };
  inList('i.name', f.names);
  inList('i.set_id', f.sets?.map(Number));
  inList('i.grid', f.grids?.map(Number));
  inList('i.klass', f.klasses);
  inList('i.id', f.ids?.map((x) => Number(String(x).split(':').pop())));
  if (f.families?.length) {
    const ors = f.families.map(() => '(g.title = ? OR s.title = ?)').join(' OR ');
    w.push(`(${ors})`);
    for (const fam of f.families) {
      const ess = Object.entries(ESSENTIAL_FAMILY).find(([, v]) => v === fam)?.[0] ?? fam;
      p.push(fam, ess);
    }
  }
  if (f.hasStrokeMax) w.push('i.stroke_max IS NOT NULL');
  const sql = `${BASE_SQL}${w.length ? ' WHERE ' + w.join(' AND ') : ''} ORDER BY i.set_id, i.name, i.grid, i.klass, i.id${f.limit && !f.every ? ` LIMIT ${Number(f.limit)}` : ''}`;
  let rows = db.prepare(sql).all(...p);
  if (f.every > 1) rows = rows.filter((_, i) => i % f.every === 0);      // an even spread across the selection
  if (f.every && f.limit) rows = rows.slice(0, Number(f.limit));
  return rows;
}

/**
 * The bounded wave-0 sample: five concepts taken wherever they exist in the Essential
 * sets — Core 24/32/48, UI 12/18 (plus UI's two-tone 18), Sharp 24, Pixel 24, Micro
 * Bold 20 — so the SAME concept appears at several grids and in five drawing
 * systems (bookmark, circle-info and paperclip exist in all five; heart and bell
 * round it out with curves). Wave 2 widens it with --names/--all.
 */
export const SAMPLE = {
  names: ['bookmark', 'circle-info', 'paperclip', 'heart', 'bell'],
  picks: [
    { sets: [11], klasses: ['outline'] },                  // Core: 24 · 32 · 48
    { sets: [11], grids: [24], klasses: ['glyph'] },       // Core filled, one grid (the fill/outline contrast)
    { sets: [10], klasses: ['outline'] },                  // UI: 12 · 18
    { sets: [10], grids: [18], klasses: ['outline-duo'] }, // UI two-tone
    { sets: [9], klasses: ['outline'] },                   // Sharp 24
    { sets: [8], klasses: ['outline'] },                   // Pixel 24
    { sets: [7], klasses: ['glyph'] },                     // Micro Bold 20 (its stroked style is filed under "glyph")
  ],
};
export function sampleRows(db) {
  const seen = new Set(), rows = [];
  for (const pick of SAMPLE.picks) for (const row of selectRows(db, { ...pick, names: SAMPLE.names })) {
    if (!seen.has(row.id)) { seen.add(row.id); rows.push(row); }
  }
  return rows.sort((a, b) => SAMPLE.names.indexOf(a.name) - SAMPLE.names.indexOf(b.name) || a.set_id - b.set_id || a.grid - b.grid || a.klass.localeCompare(b.klass));
}

// ═══════════════════════════════════════════════════════════════════════════
// NUCLEO — one drawing → one normalised record
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The line a family is built on at a grid, for drawings that carry no stroke of their own
 * (fills). Mode of the strokes of up to 25 sibling drawings in the same set at the same grid —
 * outline-style siblings first, then any — so a filled icon can still be read "in strokes".
 * One value per (set, grid), cached. Recorded as strokeBasis.from = 'calibration:siblings …';
 * null when the set has no line at all.
 */
function siblingStroke(db, row, cache) {
  const key = `${row.set_id}|${row.grid}`;
  if (cache.has(key)) return cache.get(key);
  const sibs = db.prepare('SELECT id, set_id FROM icons WHERE set_id = ? AND grid = ? AND id <> ? ORDER BY (klass LIKE \'outline%\') DESC, (name = ?) DESC, id LIMIT 25')
    .all(row.set_id, row.grid, row.id, row.name);
  const widths = [];
  for (const s of sibs) {
    const f = svgFile(s);
    if (!fs.existsSync(f)) continue;
    for (const p of readSvg(fs.readFileSync(f, 'utf8')).paths) if (p.stroke) widths.push(p.stroke.weight);
  }
  const found = widths.length ? modeOf(widths).value : null;
  cache.set(key, found);
  return found;
}

/** Nucleo's klass → the outline / filled vocabulary figma.mjs uses; the raw klass stays in meta. */
const STYLE_OF = { outline: 'outline', 'outline-duo': 'outline', glyph: 'filled', 'glyph-duo': 'filled', colored: 'colored' };

export function extractRecord(row, ctx = {}) {
  const file = svgFile(row);
  const text = fs.readFileSync(file, 'utf8');
  const sv = readSvg(text);
  const stroked = sv.paths.filter((p) => p.stroke);
  const widths = modeOf(stroked.map((p) => p.stroke.weight));
  const own = stroked.length ? widths.value : null;
  const caps = modeOf(stroked.map((p) => p.stroke.cap)), joins = modeOf(stroked.map((p) => p.stroke.join));
  const canvas = sv.canvas;
  let strokeBasis = { value: null, from: null };
  if (own != null) strokeBasis = { value: own, from: 'measured' };
  else if (ctx.db) {
    const sib = siblingStroke(ctx.db, row, ctx.cache ?? (ctx.cache = new Map()));
    if (sib) strokeBasis = { value: sib, from: `calibration:siblings (modal stroke of drawings in set ${row.set_id} at grid ${row.grid})` };
  }
  const rec = {
    schema: SCHEMA,
    source: 'nucleo',
    page: null,
    family: familyOf(row),
    set: row.set_title,
    group: row.set_title,                          // figma.mjs's word for the same thing
    name: row.name,
    aliases: [],
    id: `nucleo:${row.set_id}:${row.id}`,
    variant: { grid: row.grid, klass: row.klass, ...(/-duo$/.test(row.klass) ? { tone: 'duo' } : {}) },
    style: STYLE_OF[row.klass] ?? row.klass,
    master: row.grid,
    grid: row.grid,
    canvas,
    strokeWidth: own ?? 0,
    strokeCap: stroked.length ? (Object.keys(caps.counts).length > 1 ? 'mixed' : caps.value) : null,
    strokeJoin: stroked.length ? (Object.keys(joins.counts).length > 1 ? 'mixed' : joins.value) : null,
    strokeBasis,
    paths: sv.paths,
    meta: {
      nucleo: {
        iconId: row.id, setId: row.set_id, groupId: row.group_id ?? null, klass: row.klass,
        strokeMax: row.stroke_max ?? null, cornerCustom: row.corner_custom ?? 0,
        tags: row.tags || null, nucleoTags: row.nucleo_tags || null,
        bodyBytes: row.size, svgFile: path.relative(NUCLEO_DIR, file),
        dbGrid: row.grid, dbWidth: row.width, dbHeight: row.height,
      },
      units: "source units = the file's own viewBox units; y down",
      paint: { stroke: sv.paths.filter((p) => p.paint === 'stroke').length, fill: sv.paths.filter((p) => p.paint === 'fill').length, both: sv.paths.filter((p) => p.paint === 'both').length, none: sv.paths.filter((p) => p.paint === 'none').length },
      caps: caps.counts, joins: joins.counts, strokeWeights: widths.counts,
      inkBasis: 'path bbox grown by half the stroke: exact for round caps/joins, a lower bound for square caps and mitres',
    },
  };
  if (Object.keys(sv.effects).length) { rec.meta.effects = sv.effects; rec.meta.lossy = 'clip/mask/filter/gradient are counted but not applied; geometry is the unmasked drawing'; }
  if (sv.errors.length) rec.meta.errors = sv.errors;
  if (sv.origin && (sv.origin[0] || sv.origin[1])) rec.meta.viewBoxOrigin = sv.origin;
  if (canvas[0] !== canvas[1]) rec.meta.nonSquareCanvas = true;
  if (row.grid !== canvas[0]) rec.meta.gridMismatch = { db: row.grid, viewBox: canvas };
  rec.measure = measure(rec);
  const bad = assertDual(rec.measure);
  if (bad.length) throw new Error(`measure not dual: ${bad.join(', ')}`);
  return rec;
}

export async function selectFor(filter = {}) {
  const db = await openDb();
  return { db, rows: filter.sample ? sampleRows(db) : selectRows(db, filter) };
}
/** Build records for rows. A drawing that cannot be read becomes {error} instead of stopping the run. */
export function recordsFor(db, rows, { onRow, cache = new Map() } = {}) {
  const ctx = { db, cache };
  const records = [];
  for (const row of rows) {
    try { records.push(extractRecord(row, ctx)); onRow?.(row, records.length, rows.length); }
    catch (err) { records.push({ schema: SCHEMA, source: 'nucleo', id: `nucleo:${row.set_id}:${row.id}`, name: row.name, error: String(err.message) }); }
  }
  return records;
}
export async function extract(filter = {}, opts = {}) {
  const { db, rows } = await selectFor(filter);
  return recordsFor(db, rows, opts);
}

// ═══════════════════════════════════════════════════════════════════════════
// NUCLEO — census (what the database and the files really contain)
// ═══════════════════════════════════════════════════════════════════════════

export async function census({ files = true } = {}) {
  const db = await openDb();
  const all = (sql, ...p) => db.prepare(sql).all(...p);
  const out = { generatedAt: new Date().toISOString(), db: path.join(NUCLEO_DIR, 'data.sqlite3') };
  out.totals = all('SELECT COUNT(*) n, SUM(stroke_max IS NOT NULL) strokeMaxSet, SUM(corner_custom = 1) cornerCustom FROM icons')[0];
  out.families = all(`SELECT COALESCE(g.title, s.title) AS family, g.sizes, COUNT(DISTINCT s.id) sets, COUNT(i.id) icons
    FROM icons i JOIN sets s ON s.id = i.set_id LEFT JOIN groups g ON g.id = s.group_id GROUP BY s.group_id, CASE WHEN s.group_id IS NULL THEN s.id END ORDER BY s.group_id IS NULL, g.title, s.id`);
  out.klassByGrid = all('SELECT klass, grid, COUNT(*) n FROM icons GROUP BY klass, grid ORDER BY grid, klass');
  out.sizeColumn = (() => {          // the `size` column is NOT a pixel size: it is the svg body's byte length
    const rows = all('SELECT id, set_id, size FROM icons WHERE set_id = 10 LIMIT 40');
    const diffs = rows.map((x) => fs.statSync(svgFile(x)).size - x.size);
    return { meaning: 'bytes of svg markup (file size minus a constant wrapper)', constantWrapperBytes: modeOf(diffs).value, sampled: rows.length, agree: diffs.filter((d) => d === modeOf(diffs).value).length };
  })();
  // ── stroke_max ──
  const sm = all(`SELECT i.stroke_max AS value, i.corner_custom AS cc, i.set_id, s.title set_title, i.grid, i.klass, COUNT(*) n
    FROM icons i JOIN sets s ON s.id = i.set_id WHERE i.stroke_max IS NOT NULL GROUP BY 1,2,3,4,5,6 ORDER BY i.set_id, i.grid, i.klass`);
  const total = out.totals.n;
  const byValue = all('SELECT stroke_max v, COUNT(*) n FROM icons WHERE stroke_max IS NOT NULL GROUP BY 1 ORDER BY 1');
  out.strokeMax = {
    set: out.totals.strokeMaxSet, unset: total - out.totals.strokeMaxSet, shareSet: r(out.totals.strokeMaxSet / total, 5),
    values: Object.fromEntries(byValue.map((x) => [x.v, x.n])),
    setsCarryingIt: [...new Set(sm.map((x) => `${x.set_id} ${x.set_title}`))],
    setsInDb: all('SELECT COUNT(*) n FROM sets')[0].n,
    onlyOnKlass: [...new Set(sm.map((x) => x.klass))],
    groups: [],
  };
  const drawnByGrid = new Map(), perIcon = new Map();
  if (files) {
    for (const g of sm) {
      const rows = all('SELECT id, set_id FROM icons WHERE set_id = ? AND grid = ? AND klass = ? AND stroke_max IS NOT NULL', g.set_id, g.grid, g.klass);
      const widths = [], ratios = {};
      let drawnAboveMax = 0, noStroke = 0;
      for (const row of rows) {
        const sv = readSvg(fs.readFileSync(svgFile(row), 'utf8'));
        const used = sv.paths.filter((p) => p.stroke).map((p) => p.stroke.weight);
        const w = used.length ? modeOf(used).value : null;
        if (w != null) { widths.push(w); const q = String(r(g.value / w, 3)); ratios[q] = (ratios[q] || 0) + 1; } else noStroke++;
        if (used.some((x) => x > g.value + 1e-9)) drawnAboveMax++;
      }
      drawnByGrid.set(`${g.set_id}|${g.grid}|${g.klass}`, modeOf(widths));
      perIcon.set(`${g.set_id}|${g.grid}|${g.klass}`, { ratios, drawnAboveMax, noStroke, icons: rows.length });
    }
  }
  for (const g of sm) {
    const drawn = drawnByGrid.get(`${g.set_id}|${g.grid}|${g.klass}`);
    const d = drawn?.value ?? null;
    out.strokeMax.groups.push({
      set_id: g.set_id, set: g.set_title, grid: g.grid, klass: g.klass, icons: g.n, strokeMax: g.value, cornerCustom: g.cc,
      drawnStroke: d, drawnStrokeCounts: drawn?.counts ?? null,
      perIcon: perIcon.get(`${g.set_id}|${g.grid}|${g.klass}`) ?? null,     // strokeMax ÷ each icon's own drawn stroke; icons that draw heavier than their own stroke_max
      // the two normalisations of the same number
      strokeMaxOfCanvas: r(g.value / g.grid, 5), strokeMaxInDrawnStrokes: d ? r(g.value / d, 4) : null,
      drawnOfCanvas: d ? r(d / g.grid, 5) : null,
    });
  }
  // ── what is actually drawn: modal stroke per (family, grid, klass) from every file ──
  if (files) {
    const rows = all(`SELECT i.id, i.set_id, i.grid, i.klass, COALESCE(g.title, CASE WHEN s.title LIKE 'Nucleo % Essential' THEN replace(s.title, ' Essential', '') ELSE 'free sets' END) fam
      FROM icons i JOIN sets s ON s.id = i.set_id LEFT JOIN groups g ON g.id = s.group_id`);
    const acc = new Map(), prim = {}, gridMismatch = [];
    for (const row of rows) {
      const text = fs.readFileSync(svgFile(row), 'utf8');
      const vb = text.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      if (vb && (Number(vb[1]) !== row.grid || Number(vb[2]) !== row.grid)) gridMismatch.push({ id: row.id, set: row.set_id, grid: row.grid, viewBox: `${vb[1]}x${vb[2]}` });
      const k = `${row.fam}|${row.grid}|${row.klass}`;
      const e = acc.get(k) || { fam: row.fam, grid: row.grid, klass: row.klass, n: 0, sw: new Map(), cap: new Map(), join: new Map() };
      e.n++;
      for (const m of text.matchAll(/<(path|rect|line|circle|polyline|polygon|ellipse)\b([^>]*?)\/?>/g)) {
        prim[m[1]] = (prim[m[1]] || 0) + 1;
        if (/\bstroke="(?!none)/.test(m[2])) {
          const sw = m[2].match(/stroke-width="([\d.]+)"/);
          if (sw && Number(sw[1]) > 0) {
            e.sw.set(sw[1], (e.sw.get(sw[1]) || 0) + 1);
            const c = (m[2].match(/stroke-linecap="(\w+)"/) || [])[1] || 'butt'; e.cap.set(c, (e.cap.get(c) || 0) + 1);
            const j = (m[2].match(/stroke-linejoin="(\w+)"/) || [])[1] || 'miter'; e.join.set(j, (e.join.get(j) || 0) + 1);
          }
        }
      }
      acc.set(k, e);
    }
    const top = (m) => { const a = [...m].sort((x, y) => y[1] - x[1]); return a.length ? { value: a[0][0], share: r(a[0][1] / [...m.values()].reduce((s, v) => s + v, 0), 3) } : null; };
    out.drawnStroke = [...acc.values()].map((e) => {
      const t = top(e.sw);
      return { family: e.fam, grid: e.grid, klass: e.klass, icons: e.n, modalStroke: t ? Number(t.value) : null, modalShare: t?.share ?? null,
        modalStrokeOfCanvas: t ? r(Number(t.value) / e.grid, 5) : null, cap: top(e.cap)?.value ?? null, join: top(e.join)?.value ?? null };
    }).sort((a, b) => a.family.localeCompare(b.family) || a.grid - b.grid || a.klass.localeCompare(b.klass));
    out.elementCounts = prim;
    out.gridVsViewBox = { mismatches: gridMismatch.length, examples: gridMismatch.slice(0, 5) };
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════
// NUCLEO — verify: the extracted geometry against the .svg file itself
// ═══════════════════════════════════════════════════════════════════════════
// Three independent checks per file. (1) Attributes: every drawable element in
// the file has one record path, same element name, same raw coordinates.
// (2) Geometry: svgpathtools (Python, a different implementation from this file)
// parses the ORIGINAL file and the record's `d`, both are sampled, and the largest
// gap between matching points is reported. (3) Pixels: skia renders the original
// file and an SVG rebuilt from the record alone; the differing pixels are counted.

const PY_VERIFY = String.raw`
import sys, json, re, math
import xml.etree.ElementTree as ET
import numpy as np
from scipy.spatial import cKDTree
from svgpathtools import parse_path
from svgpathtools.parser import parse_transform
from svgpathtools.path import transform as path_transform
from svgpathtools.svg_to_paths import ellipse2pathd, line2pathd, polyline2pathd, polygon2pathd, rect2pathd
import skia

HIDDEN = {'defs', 'clipPath', 'mask', 'filter', 'linearGradient', 'radialGradient', 'pattern', 'symbol', 'style', 'title', 'desc', 'metadata', 'marker'}
STEP = 0.004

def local(tag):
    return tag.split('}')[-1]

def elements(root):
    """drawable elements in DOCUMENT order (svgpathtools.svg2paths regroups them by element type), with their transforms"""
    out = []
    def walk(node, tf):
        for ch in node:
            name = local(ch.tag)
            if name in HIDDEN:
                continue
            t = tf
            if 'transform' in ch.attrib:
                t = tf + [parse_transform(ch.attrib['transform'])]
            if name in ('path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'):
                out.append((name, ch, t))
            else:
                walk(ch, t)
    walk(root, [])
    return out

def to_path(name, a):
    if name == 'path': return parse_path(a.get('d', ''))
    if name == 'line': return parse_path(line2pathd(a))
    if name == 'polyline': return parse_path(polyline2pathd(a))
    if name == 'polygon': return parse_path(polygon2pathd(a))
    if name == 'rect': return parse_path(rect2pathd(a))
    if name in ('circle', 'ellipse'): return parse_path(ellipse2pathd(a))
    raise ValueError(name)

def dense(path):
    pts = []
    for seg in path:
        L = seg.length(error=1e-5)
        n = max(16, int(L / STEP))
        for t in np.linspace(0, 1, n + 1):
            z = seg.point(t); pts.append((z.real, z.imag))
    return np.array(pts)

def pointwise(p, q):
    """same segment structure → compare seg.point(t) at identical t"""
    if len(p) != len(q): return None
    worst = 0.0
    for a, b in zip(p, q):
        if type(a) is not type(b): return None
        for t in np.linspace(0, 1, 41):
            worst = max(worst, abs(a.point(t) - b.point(t)))
    return worst

def hausdorff(A, B):
    return float(max(cKDTree(B).query(A)[0].max(), cKDTree(A).query(B)[0].max()))

def render(svg_text, W, H, scale):
    if not re.search(r'<svg[^>]*\swidth=', svg_text):
        svg_text = svg_text.replace('<svg ', '<svg width="%d" height="%d" ' % (W, H), 1)
    data = skia.Data.MakeWithCopy(svg_text.encode('utf8'))      # MemoryStream(bytes) does NOT copy: a temporary is freed mid-parse
    dom = skia.SVGDOM.MakeFromStream(skia.MemoryStream(data))
    if dom is None: raise ValueError('skia could not parse the svg')
    dom.setContainerSize(skia.Size(W, H))
    surf = skia.Surface(int(W * scale), int(H * scale))
    c = surf.getCanvas(); c.clear(skia.ColorWHITE); c.scale(scale, scale)
    dom.render(c)
    return surf.makeImageSnapshot().toarray()[:, :, :3].astype(float).mean(axis=2)

job = json.load(sys.stdin)
out = []
for item in job['items']:
    res = {'file': item['file'], 'id': item['id']}
    try:
        els = elements(ET.parse(item['file']).getroot())
        rec = item['paths']
        res['elements_in_file'] = len(els); res['paths_in_record'] = len(rec); res['count_match'] = len(els) == len(rec)
        worst_h = 0.0; worst_pw = 0.0; n_pw = 0; notes = []
        for k, (name, a, tfs) in enumerate(els):
            p = to_path(name, a)
            for m in tfs: p = path_transform(p, m)
            q = parse_path(rec[k]['d'])
            h = hausdorff(dense(p), dense(q)); worst_h = max(worst_h, h)
            if name == 'path':
                pw = pointwise(p, q)
                if pw is not None: worst_pw = max(worst_pw, pw); n_pw += 1
                else: notes.append({'path': k, 'segments_file': len(p), 'segments_record': len(q)})
        res['max_hausdorff'] = worst_h
        res['max_pointwise'] = worst_pw if n_pw else None
        res['pointwise_paths'] = n_pw
        res['notes'] = notes
    except Exception as e:
        res['geometry_error'] = repr(e)
    try:
        W, H = item['canvas']
        scale = max(4, int(round(512 / max(W, H))))
        text = open(item['file'], encoding='utf8').read()
        A = render(text, W, H, scale); B = render(item['svg'], W, H, scale)
        ink = float((A < 200).sum()); diff = float((np.abs(A - B) > 64).sum())
        res['raster'] = {'px': '%dx%d' % (A.shape[1], A.shape[0]), 'ink_px_original': ink, 'differing_px': diff,
                         'differing_share_of_ink': (diff / ink) if ink else None, 'max_abs_diff': float(np.abs(A - B).max())}
    except Exception as e:
        res['raster_error'] = repr(e)
    out.append(res)
print(json.dumps(out))
`;

/** Check (1): attributes. Pure JS, no Python needed. */
export function attributeCheck(text, rec) {
  const tree = parseXml(text);
  const found = [];
  (function walk(n) {
    for (const c of n.children) {
      if (HIDDEN.has(c.name)) continue;
      if (DRAWABLE.has(c.name)) found.push(c);
      else walk(c);
    }
  })(tree);
  const issues = [];
  if (found.length !== rec.paths.length) issues.push(`element count ${found.length} ≠ record paths ${rec.paths.length}`);
  const numeric = { circle: ['cx', 'cy', 'r'], ellipse: ['cx', 'cy', 'rx', 'ry'], line: ['x1', 'y1', 'x2', 'y2'], rect: ['x', 'y', 'width', 'height', 'rx', 'ry'] };
  let primitives = 0;
  found.forEach((el, i) => {
    const p = rec.paths[i];
    if (!p) return;
    if (p.prim !== el.name) issues.push(`#${i}: element ${el.name} ≠ record prim ${p.prim}`);
    const want = numeric[el.name];
    if (want && p.src) {
      const s = p.src[el.name === 'rect' ? 'rect' : el.name];
      const map = el.name === 'rect' ? { x: 'x', y: 'y', width: 'w', height: 'h', rx: 'rx', ry: 'ry' } : null;
      for (const k of want) {
        if (el.attrs[k] === undefined) continue;
        const have = map ? s[map[k]] : s[k];
        if (el.name === 'rect' && (k === 'rx' || k === 'ry')) continue;      // rect radii are clamped/defaulted by the spec
        if (Math.abs(have - Number(el.attrs[k])) > 1e-9) issues.push(`#${i} ${el.name}.${k}: file ${el.attrs[k]} ≠ record ${have}`);
      }
      primitives++;
    }
  });
  return { elements: found.length, primitivesChecked: primitives, issues };
}

export async function verify(rows, { python = true } = {}) {
  const db = await openDb();
  const ctx = { db, cache: new Map() };
  const items = [], report = [];
  for (const row of rows) {
    const rec = extractRecord(row, ctx);
    const file = svgFile(row);
    const attr = attributeCheck(fs.readFileSync(file, 'utf8'), rec);
    report.push({ id: rec.id, name: rec.name, grid: rec.grid, style: rec.style, set: rec.set, paths: rec.paths.length,
      prims: [...new Set(rec.paths.map((p) => p.prim))].join('+') + (rec.paths.some((p) => p.transform) ? ' +transform' : ''),
      attr });
    items.push({ file, id: rec.id, canvas: rec.canvas, paths: rec.paths.map((p) => ({ d: p.d })), svg: recordToSvg(rec) });
  }
  if (python) {
    const run = spawnSync('python3', ['-c', PY_VERIFY], { input: JSON.stringify({ items }), encoding: 'utf8', maxBuffer: 1 << 28 });
    if (run.status !== 0) report.forEach((x) => { x.python = { error: (run.stderr || '').split('\n').slice(-4).join(' | ') }; });
    else JSON.parse(run.stdout).forEach((res, i) => { report[i].python = res; });
  }
  return report;
}

// ═══════════════════════════════════════════════════════════════════════════
// NUCLEO — compare: is the UI drawing a redrawing of the Core drawing, or a scaling?
// ═══════════════════════════════════════════════════════════════════════════
// Method (stated so it can be argued with):
//  1. Take every drawing of one concept and sample its INK (stroked paths along their
//     centreline, filled shapes along their outline) into points 1/500 of the canvas apart.
//     Work in UNIT-CANVAS coordinates (divide by the canvas) so different grids compare.
//  2. Pair drawings A, B. Null hypothesis H0 = "B is A scaled by canvasB/canvasA and nothing
//     else": test it directly (identity in unit-canvas space) and report the chamfer distance —
//     for each point of one drawing, the gap to the nearest point of the other, both ways —
//     as mean / 95th percentile / worst, in canvas shares and in B's own strokes.
//  3. Test the generous H0' = "B is A scaled by SOME amount and shifted": fit the best uniform
//     scale + translation (closest-point iteration from two starts, closed-form step) and
//     report what is left over.
//  4. The sampling NOISE FLOOR is measured, not assumed: the same drawing sampled at two
//     different spacings, compared with itself. A residual at that floor is "the same shape".
//  5. The line weight is a separate test: a true uniform scaling scales the stroke too, so
//     stroke ÷ canvas must match. It is reported beside the shape result, not folded into it.
//  6. Structure as a cross-check: element kinds and path-command letters per drawing.
// A pair is called a SCALED COPY only if the shape residual is within max(2 floors, 0.1 stroke)
// AND the stroke share matches within 2%; SAME SHAPE, OWN WEIGHT if only the first holds;
// RE-TUNED if the worst gap is under one stroke; REDRAWN above that. The thresholds are the claim.

const SAMPLE_DIV = 500;
function inkPoints(rec, div = SAMPLE_DIV) {
  const side = canvasSide(rec);
  const step = side / div;
  const pts = [];
  for (const p of rec.paths) for (const sub of sampleSegs(normalisePath(p.d), step)) pts.push(...sub.pts);
  return pts.map((q) => [q[0] / side, q[1] / side]);
}

function nnGrid(pts, cell) {
  const g = new Map();
  for (const q of pts) { const k = `${Math.floor(q[0] / cell)},${Math.floor(q[1] / cell)}`; (g.get(k) || g.set(k, []).get(k)).push(q); }
  return (x, y, maxR) => {
    let best = Infinity, bq = null;
    const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
    for (let ring = 0; ring <= maxR; ring++) {
      for (let i = cx - ring; i <= cx + ring; i++) for (let j = cy - ring; j <= cy + ring; j++) {
        if (Math.max(Math.abs(i - cx), Math.abs(j - cy)) !== ring) continue;
        for (const q of g.get(`${i},${j}`) || []) { const d = Math.hypot(q[0] - x, q[1] - y); if (d < best) { best = d; bq = q; } }
      }
      if (best <= ring * cell) break;
    }
    return { d: best, q: bq };
  };
}

/** Symmetric chamfer between two point clouds in the same units → {mean, p95, max}. */
export function chamfer(A, B, cell = 0.02) {
  const nnA = nnGrid(A, cell), nnB = nnGrid(B, cell);
  const ds = [];
  for (const [X, nn] of [[A, nnB], [B, nnA]]) for (const p of X) { const { d } = nn(p[0], p[1], 50); ds.push(Number.isFinite(d) ? d : 1); }
  ds.sort((x, y) => x - y);
  return { mean: ds.reduce((s, v) => s + v, 0) / ds.length, p95: ds[Math.floor(ds.length * 0.95)], max: ds[ds.length - 1] };
}

/** Best uniform scale + translation of B onto A (closest-point iteration, closed-form step), from two starts. */
export function fitSimilarity(A, B, iters = 30) {
  const bb = (P) => P.reduce((o, p) => ({ x0: Math.min(o.x0, p[0]), y0: Math.min(o.y0, p[1]), x1: Math.max(o.x1, p[0]), y1: Math.max(o.y1, p[1]) }), { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
  const ba = bb(A), bbB = bb(B);
  const s0 = Math.sqrt(((ba.x1 - ba.x0) * (ba.y1 - ba.y0)) / (((bbB.x1 - bbB.x0) * (bbB.y1 - bbB.y0)) || 1)) || 1;
  const starts = [
    { s: s0, tx: (ba.x0 + ba.x1) / 2 - (s0 * (bbB.x0 + bbB.x1)) / 2, ty: (ba.y0 + ba.y1) / 2 - (s0 * (bbB.y0 + bbB.y1)) / 2 },   // match the ink boxes
    { s: 1, tx: 0, ty: 0 },                                                                                                           // H0 itself
  ];
  const nnA = nnGrid(A, 0.02);
  let best = null;
  for (const st of starts) {
    let { s, tx, ty } = st;
    for (let it = 0; it < iters; it++) {
      const pairs = [];
      for (const p of B) { const { d, q } = nnA(s * p[0] + tx, s * p[1] + ty, 50); if (q && d < 0.2) pairs.push([p, q]); }
      if (pairs.length < 4) break;
      const n = pairs.length;
      let mbx = 0, mby = 0, maxx = 0, may = 0;
      for (const [p, q] of pairs) { mbx += p[0]; mby += p[1]; maxx += q[0]; may += q[1]; }
      mbx /= n; mby /= n; maxx /= n; may /= n;
      let num = 0, den = 0;
      for (const [p, q] of pairs) { num += (p[0] - mbx) * (q[0] - maxx) + (p[1] - mby) * (q[1] - may); den += (p[0] - mbx) ** 2 + (p[1] - mby) ** 2; }
      const ns = den ? num / den : s;
      const ntx = maxx - ns * mbx, nty = may - ns * mby;
      const moved = Math.abs(ns - s) + Math.abs(ntx - tx) + Math.abs(nty - ty);
      s = ns; tx = ntx; ty = nty;
      if (moved < 1e-9) break;
    }
    const pts = B.map((p) => [s * p[0] + tx, s * p[1] + ty]);
    const c = chamfer(A, pts);
    if (!best || c.max < best.c.max) best = { s, tx, ty, pts, c };
  }
  return best;
}

const letters = (rec) => rec.paths.map((p) => `${p.prim}:${(p.d.match(/[MLCQAZ]/g) || []).join('')}`).join(' ');       // exact command sequence per path

/** The sampling noise floor of a drawing against itself (two different spacings). In unit-canvas. */
function noiseFloor(rec) {
  return chamfer(inkPoints(rec, SAMPLE_DIV), inkPoints(rec, Math.round(SAMPLE_DIV * 1.37))).max;
}

/** Compare two records. Everything is expressed in canvas shares and in the B drawing's own strokes. */
export function compareRecords(a, b) {
  const A = inkPoints(a), B = inkPoints(b);
  const floor = Math.max(noiseFloor(a), noiseFloor(b));
  const direct = chamfer(A, B);                       // H0: same drawing, only the canvas differs
  const fit = fitSimilarity(A, B);                    // H0': scaled and shifted
  const sa = a.strokeBasis.value ? a.strokeBasis.value / canvasSide(a) : null, sb = b.strokeBasis.value ? b.strokeBasis.value / canvasSide(b) : null;
  const stRatio = sa && sb ? sb / sa : null;
  const inSt = (v) => (sb ? r(v / sb, 3) : null);
  const shapeSame = sb != null && fit.c.max <= Math.max(2 * floor, 0.1 * sb);
  const weightSame = stRatio != null && Math.abs(stRatio - 1) < 0.02;
  let verdict;
  if (!sb) verdict = 'no stroke reference';
  else if (shapeSame && weightSame) verdict = 'scaled copy';
  else if (shapeSame) verdict = 'same shape, own weight';
  else if (fit.c.max <= sb) verdict = 're-tuned';
  else verdict = 'redrawn';
  return {
    a: `${a.name} ${a.set} @${a.grid} ${a.style}`, b: `${b.name} ${b.set} @${b.grid} ${b.style}`, aGrid: a.grid, bGrid: b.grid,
    aLabel: `${a.family.replace('Nucleo ', '')} ${a.grid}`, bLabel: `${b.family.replace('Nucleo ', '')} ${b.grid}`,
    strokeOfCanvas: { a: sa ? r(sa, 4) : null, b: sb ? r(sb, 4) : null, ratioBA: stRatio ? r(stRatio, 3) : null },
    paths: { a: a.paths.length, b: b.paths.length },
    sameStructure: letters(a) === letters(b),
    noiseFloorOfCanvas: r(floor, 5),
    pureScaling: { meanOfCanvas: r(direct.mean, 5), p95OfCanvas: r(direct.p95, 5), maxOfCanvas: r(direct.max, 5), maxInStrokes: inSt(direct.max) },
    bestFit: { scale: r(fit.s, 4), tx: r(fit.tx, 4), ty: r(fit.ty, 4), meanOfCanvas: r(fit.c.mean, 5), p95OfCanvas: r(fit.c.p95, 5), maxOfCanvas: r(fit.c.max, 5), maxInStrokes: inSt(fit.c.max) },
    verdict,
  };
}

/** Every Core-24 / UI-18 outline pair that shares a name across the whole library (or just the Essential sets). */
export async function coreVsUi({ essentialOnly = false, every = 1, limit } = {}) {
  const db = await openDb();
  const ctx = { db, cache: new Map() };
  const pick = (g, grid, sets) => {
    const w = `i.klass = 'outline' AND i.grid = ? AND ${sets}`;
    return db.prepare(`${BASE_SQL} WHERE ${w} ORDER BY i.name, i.set_id, i.id`).all(grid);
  };
  const core = pick('core', 24, essentialOnly ? 'i.set_id = 11' : 's.group_id = 2');
  const ui = pick('ui', 18, essentialOnly ? 'i.set_id = 10' : 's.group_id = 1');
  const byName = new Map();
  for (const row of ui) if (!byName.has(row.name)) byName.set(row.name, row);
  let pairs = [];
  const seen = new Set();
  for (const row of core) if (byName.has(row.name) && !seen.has(row.name)) { seen.add(row.name); pairs.push([row, byName.get(row.name)]); }
  if (every > 1) pairs = pairs.filter((_, i) => i % every === 0);
  if (limit) pairs = pairs.slice(0, limit);
  const out = [];
  for (const [c, u] of pairs) out.push({ name: c.name, ...compareRecords(extractRecord(c, ctx), extractRecord(u, ctx)) });
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════

const HELP = `nucleo.mjs — Nucleo reference extractor (writes only under research/references/nucleo/)

  extract [--sample | --names a,b | --sets 10,11 | --family "Nucleo Core" | --grids 24,48
           | --klass outline,glyph | --ids set:id,… | --stroke-max | --all] [--limit N] [--every N]
          [--run NAME] [--out DIR] [--shard N (default 2000 records per file)] [--dry]
      → <out>/<run>.json   an array of normalised records (default run: sample)
  census [--quick]          → <out>/census.json  database + file census, incl. every stroke_max group
  verify  <name…> | --ids set:id,… | --sample | --sets 7,8 [--limit N] [--summary] [--no-python]
                            extracted geometry vs the .svg file itself (python3 + svgpathtools + skia)
  compare <concept…> [--core 11] [--ui 10]        Core 24/32/48 vs UI 12/18: redrawn or scaled?
  compare --census | --all-pairs [--every N]      the same test over every concept in both families
  --help

With no subcommand: extract the default sample (${SAMPLE.names.join(', ')} across all five families).`;

export async function main(argv) {
  const sub = ['extract', 'census', 'verify', 'compare'].includes(argv[0]) ? argv.shift() : 'extract';
  const o = parseArgs(argv, new Set(['names', 'sets', 'family', 'families', 'grids', 'klass', 'ids', 'limit', 'every', 'run', 'out', 'core', 'ui', 'shard']));
  if (o.help) return console.log(HELP);
  const outDir = assertInRefRoot(o.out || path.join(REF_ROOT, 'nucleo'));

  if (sub === 'census') {
    const c = await census({ files: !o.quick });
    writeJson(path.join(outDir, 'census.json'), c);
    const sm = c.strokeMax;
    console.log(`icons ${c.totals.n} · stroke_max set on ${sm.set} (${(sm.shareSet * 100).toFixed(1)}%) · values ${JSON.stringify(sm.values)}`);
    console.log('sets carrying it:', sm.setsCarryingIt.join(' · '), `(of ${sm.setsInDb} sets)`);
    console.table(sm.groups.map((g) => ({ set: g.set, grid: g.grid, klass: g.klass, icons: g.icons, strokeMax: g.strokeMax, drawn: g.drawnStroke, 'max/drawn': g.strokeMaxInDrawnStrokes, 'max % canvas': r(g.strokeMaxOfCanvas * 100, 2), 'drawn % canvas': g.drawnOfCanvas == null ? null : r(g.drawnOfCanvas * 100, 2), cornerCustom: g.cornerCustom })));
    return console.log(`→ ${path.relative(REPO, path.join(outDir, 'census.json'))}`);
  }

  if (sub === 'verify') {
    const db = await openDb();
    let rows = [];
    if (o.ids) rows = selectRows(db, { ids: csv(o.ids) });
    else if (o.sample) rows = sampleRows(db);
    else if (o._.length) {
      const grids = csv(o.grids);
      for (const name of o._) rows.push(...selectRows(db, { names: [name], sets: [10, 11, 9, 8, 7], grids: grids ?? undefined, klasses: ['outline', 'glyph'] }).slice(0, 3));
    } else rows = selectRows(db, { sets: csv(o.sets), families: csv(o.family), grids: csv(o.grids), klasses: csv(o.klass), limit: o.limit ? Number(o.limit) : undefined, every: o.every ? Number(o.every) : undefined });
    if (!rows.length) return console.error('nothing matched');
    // check in batches so a few thousand files do not become one giant pipe
    const rep = [];
    for (let i = 0; i < rows.length; i += 200) rep.push(...await verify(rows.slice(i, i + 200), { python: !o['no-python'] }));
    if (!o.summary) {
      for (const x of rep) {
        const py = x.python || {};
        console.log(`${x.id.padEnd(16)} ${x.name.padEnd(12)} @${String(x.grid).padEnd(3)} ${x.style.padEnd(8)} ${String(x.paths).padStart(2)} paths [${x.prims}]  attributes: ${x.attr.issues.length ? x.attr.issues.join('; ') : `ok (${x.attr.elements} elements, ${x.attr.primitivesChecked} primitives)`}`
          + (py.max_hausdorff !== undefined ? `  geometry: Hausdorff ${py.max_hausdorff.toExponential(1)}${py.max_pointwise != null ? `, pointwise ${py.max_pointwise.toExponential(1)} (${py.pointwise_paths} paths)` : ''}${py.count_match ? '' : ' COUNT MISMATCH'}` : py.geometry_error ? `  geometry: ${py.geometry_error}` : '')
          + (py.raster ? `  pixels: ${py.raster.differing_px}/${py.raster.ink_px_original} differ at ${py.raster.px}` : py.raster_error ? `  pixels: ${py.raster_error}` : ''));
      }
    }
    const py = rep.map((x) => x.python || {});
    const worst = (k) => Math.max(0, ...py.map((x) => x[k] ?? 0));
    const shares = py.map((x) => x.raster?.differing_share_of_ink).filter((v) => v != null);
    console.log(`\n${rep.length} drawings checked · element-count/attribute issues ${rep.filter((x) => x.attr.issues.length).length}`
      + ` · count mismatches ${py.filter((x) => x.count_match === false).length} · geometry errors ${py.filter((x) => x.geometry_error).length} · raster errors ${py.filter((x) => x.raster_error).length}`
      + `\nworst Hausdorff ${worst('max_hausdorff').toExponential(2)} (sampling floor 2e-3) · worst pointwise on path elements ${worst('max_pointwise').toExponential(2)}`
      + `\npixels: ${shares.filter((v) => v === 0).length} of ${shares.length} identical · worst differing share of ink ${(Math.max(0, ...shares) * 100).toFixed(3)}% · median ${(shares.sort((a, b) => a - b)[Math.floor(shares.length / 2)] * 100).toFixed(4)}%`);
    return;
  }

  if (sub === 'compare') {
    const db = await openDb();
    if (o.census || o['all-pairs']) {
      const res = await coreVsUi({ essentialOnly: !o['all-pairs'], every: o.every ? Number(o.every) : 1, limit: o.limit ? Number(o.limit) : undefined });
      writeJson(path.join(outDir, o['all-pairs'] ? 'core-vs-ui-all.json' : 'core-vs-ui-essential.json'), res);
      const count = (f) => res.filter(f).length;
      const verdicts = {};
      for (const x of res) verdicts[x.verdict] = (verdicts[x.verdict] || 0) + 1;
      const q = (arr, p) => arr.sort((a, b) => a - b)[Math.min(arr.length - 1, Math.floor(arr.length * p))];
      const fitMax = res.map((x) => x.bestFit.maxInStrokes).filter((v) => v != null);
      console.log(`Core 24 outline vs UI 18 outline, ${res.length} concepts that exist in both${o['all-pairs'] ? ' (whole library)' : ' (Essential sets)'}`);
      console.log('verdicts:', verdicts, '· structure identical:', count((x) => x.sameStructure), `· stroke share equal (both ${(res[0]?.strokeOfCanvas.a * 100).toFixed(2)}% of canvas):`, count((x) => Math.abs(x.strokeOfCanvas.ratioBA - 1) < 0.02));
      console.log(`best-fit worst gap in B strokes — median ${q([...fitMax], 0.5)} · p90 ${q([...fitMax], 0.9)} · share ≤0.25 stroke ${(count((x) => x.bestFit.maxInStrokes <= 0.25) / res.length * 100).toFixed(1)}% · ≤1 stroke ${(count((x) => x.bestFit.maxInStrokes <= 1) / res.length * 100).toFixed(1)}% · >1 stroke ${(count((x) => x.bestFit.maxInStrokes > 1) / res.length * 100).toFixed(1)}%`);
      return console.log(`→ ${path.relative(REPO, path.join(outDir, o['all-pairs'] ? 'core-vs-ui-all.json' : 'core-vs-ui-essential.json'))}`);
    }
    const core = Number(o.core || 11), ui = Number(o.ui || 10);
    const ctx = { db, cache: new Map() };
    for (const name of o._) {
      const pick = (set, grids) => grids.map((g) => selectRows(db, { names: [name], sets: [set], grids: [g], klasses: ['outline'] })[0]).filter(Boolean).map((row) => extractRecord(row, ctx));
      const C = pick(core, [24, 32, 48]), U = pick(ui, [12, 18]);
      const rows = [];
      for (const u of U) for (const c of C) rows.push(compareRecords(c, u));
      for (const [x, y] of [[C[0], C[1]], [C[0], C[2]], [C[1], C[2]], [U[1], U[0]]]) if (x && y) rows.push(compareRecords(x, y));
      console.log(`\n${name}: stroke ÷ canvas  ${[...C, ...U].map((x) => `${x.grid}→${r((x.strokeBasis.value / canvasSide(x)) * 100, 2)}%`).join('  ')}`);
      console.table(rows.map((x) => ({ A: x.aLabel, B: x.bLabel, 'struct=': x.sameStructure, 'floor %cv': r(x.noiseFloorOfCanvas * 100, 2), 'pure max %cv': r(x.pureScaling.maxOfCanvas * 100, 2), 'fit scale': x.bestFit.scale, 'fit p95 %cv': r(x.bestFit.p95OfCanvas * 100, 2), 'fit max %cv': r(x.bestFit.maxOfCanvas * 100, 2), 'fit max /stroke': x.bestFit.maxInStrokes, 'stroke B/A': x.strokeOfCanvas.ratioBA, verdict: x.verdict })));
    }
    return;
  }

  // extract
  const filter = {
    names: csv(o.names), sets: csv(o.sets), families: csv(o.family || o.families), grids: csv(o.grids), klasses: csv(o.klass),
    ids: csv(o.ids), hasStrokeMax: !!o['stroke-max'], limit: o.limit ? Number(o.limit) : undefined, every: o.every ? Number(o.every) : undefined,
  };
  const anyFilter = Object.values(filter).some((v) => v && (!Array.isArray(v) || v.length));
  filter.sample = !anyFilter && !o.all;
  const run = o.run || (o.all ? 'all' : filter.sample ? 'sample' : 'selection');
  const t0 = Date.now();
  const { db, rows } = await selectFor(filter);
  const shard = o.shard ? Number(o.shard) : 2000;                // a few thousand records per file keeps each JSON a size a human tool can open
  const cache = new Map();
  const tally = {};
  let failed = 0, lossy = 0, count = 0;
  const parts = [];
  const selection = filter.sample ? { sample: SAMPLE } : filter;
  const meta = { schema: SCHEMA, source: 'nucleo', generatedAt: new Date().toISOString(), selection };
  const dest = rows.length > shard ? path.join(outDir, run) : null;
  for (let i = 0; i < rows.length; i += shard) {
    const records = recordsFor(db, rows.slice(i, i + shard), { cache });
    for (const x of records) {
      if (x.error) { failed++; if (failed <= 5) console.error('  FAILED', x.id, x.name, x.error); continue; }
      if (x.meta?.lossy) lossy++;
      const k = `${x.family} ${x.grid} ${x.style}`; tally[k] = (tally[k] || 0) + 1;
    }
    count += records.length;
    if (!o.dry) {
      const file = dest ? path.join(dest, `part-${String(parts.length + 1).padStart(4, '0')}.json`) : path.join(outDir, `${run}.json`);
      writeJson(file, { ...meta, part: parts.length + 1, count: records.length, records });
      parts.push(path.relative(REPO, file));
    }
    if (rows.length > shard) console.error(`  ${count}/${rows.length}`);
  }
  if (!o.dry && dest) writeJson(path.join(dest, 'index.json'), { ...meta, count, parts: parts.map((f) => path.basename(f)) });
  const where = o.dry ? '(dry run: nothing written)' : dest ? `→ ${path.relative(REPO, dest)}/ (${parts.length} parts + index.json)` : `→ ${parts[0]}`;
  console.log(`${count} drawings (${failed} failed, ${lossy} lossy: clip/mask/filter/gradient counted but not applied) in ${((Date.now() - t0) / 1000).toFixed(1)}s ${where}`);
  if (rows.length <= 400) console.table(tally);
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
