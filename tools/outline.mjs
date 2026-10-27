#!/usr/bin/env node
// The outliner (plans/shipping.md card 1.1): a stroked source SVG in, the outlined-fill SVG the box ships out.
//
// Every stroked path becomes a filled shape of exactly its ink. Our own stroker offsets each line and circular arc
// exactly — a line stays a line, an arc of radius r stays an arc of radius r ∓ w/2, every cap and join is a round
// arc of radius w/2 — and Skia's PathOps (canvaskit-wasm) unions the pieces, holding every arc as an exact conic.
// Each conic is written back as a true SVG arc at 3 dp. Paths already `fill="currentColor"` (a filled drawing's
// shapes, evenodd) pass through the union untouched. A stroked elliptical arc or a cubic curve has no exact offset:
// that path goes to Skia's own stroker at precision 256 (its error is measured by `--check`).
//
// PathOps is exact on clean input and wrong on three kinds of near-degenerate input, all of which this set draws on
// purpose: two curves that nearly coincide (a stem hugging a ring, a cap on another path's corner), a contour of no
// width (a shape no deeper than its pen), and a conic split at a point off its circle. So every arc is drawn on a
// circle registry with shared breakpoints, a hairline inner contour is left out, the conics PathOps hands back are
// put back on their circles, and the union is checked against Skia's own rendering of its pieces and retried with
// stroke circles snapping to each other before it is an error (`outlinePaths` returns the level it needed).
//
//   import { outline, check } from './outline.mjs';
//   const out = await outline(svgText, { master: 24 });        // the shipped SVG text
//   const gate = await check(svgText, out, { master: 24 });    // { wrong, max, source: box, result: box, exact }
//
//   node tools/outline.mjs <in.svg> [out.svg]     convert one file (stdout without out.svg)
//   node tools/outline.mjs --check [names…]       every file in src/icons/{24,20,16} through outline + check
//
// The raster gate: the source's exact ink — a pixel sample is ink when it lies within w/2 of a stroke's centreline
// or inside a filled area (even-odd), no stroker involved — against the output rendered by Skia, both at 96 px for
// the 24 master (80 and 64 for 20 and 16), 4 × 4 samples a pixel; a pixel is wrong when the two differ by more than
// half of full coverage. Ink boxes: the source's from its centrelines plus half the weight, the output's from its
// written arcs; both are exact extremes.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join as pathJoin, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = pathJoin(dirname(fileURLToPath(import.meta.url)), '..');

/** Skia's stroker, for the paths our own cannot offset exactly (elliptical arcs, cubics). */
export const FALLBACK_PRECISION = 256;
/** The raster gate's width at the 24 master, in pixels; other masters scale with the canvas. */
const GATE_PX = 96;
const GATE_SS = 4; // samples per pixel edge

// ── Skia ────────────────────────────────────────────────────────────────────────────────────────────────────────

let ck = null, loading = null;
/** Load CanvasKit once; `outline` and `check` await it themselves. */
export function load() {
  if (ck) return Promise.resolve(ck);
  return loading ??= require('canvaskit-wasm')().then((k) => (ck = k));
}

// ── SVG in ──────────────────────────────────────────────────────────────────────────────────────────────────────

const attr = (tag, k) => (tag.match(new RegExp(`\\s${k}="([^"]*)"`)) || [])[1];

/** The stroked source, read as `tools/build.mjs` reads it: root weight, each path at its own weight, filled areas. */
export function parseSource(text) {
  const clean = text.replace(/<!--[\s\S]*?-->/g, '');
  const root = clean.match(/<svg\b[^>]*>/)?.[0];
  if (!root) throw new Error('no <svg> root');
  const vb = (attr(root, 'viewBox') || '').trim().split(/[\s,]+/).map(Number);
  if (vb.length !== 4 || vb[0] !== 0 || vb[1] !== 0 || vb[2] !== vb[3] || !(vb[2] > 0)) throw new Error(`viewBox must be "0 0 N N", got "${attr(root, 'viewBox')}"`);
  const size = vb[2];
  const rootW = Number(attr(root, 'stroke-width'));
  const cap = attr(root, 'stroke-linecap'), joinKind = attr(root, 'stroke-linejoin');
  if (cap !== 'round' || joinKind !== 'round') throw new Error(`the outliner draws round caps and joins only (root has linecap ${cap}, linejoin ${joinKind})`);
  for (const bad of ['<rect', '<circle', '<ellipse', '<line', '<polyline', '<polygon', '<g', '<use', 'transform=']) if (clean.includes(bad)) throw new Error(`unsupported: ${bad} — the source is <path> elements only`);
  const strokes = [], areas = [];
  for (const tag of clean.match(/<path\b[^>]*>/g) || []) {
    const d = attr(tag, 'd'); if (!d) continue;
    if (/\bfill="currentColor"/.test(tag)) { areas.push({ d, rule: attr(tag, 'fill-rule') || 'nonzero' }); continue; }
    const w = Number(attr(tag, 'stroke-width') || rootW);
    if (!(w > 0)) throw new Error('a stroked path with no weight');
    strokes.push({ d, w });
  }
  return { size, strokes, areas };
}

// ── path data ───────────────────────────────────────────────────────────────────────────────────────────────────

const CMD = /([MmLlHhVvCcSsQqTtAaZz])/;
const NUM = /[+-]?(\d*\.\d+|\d+\.?)([eE][+-]?\d+)?/y;
function tokens(d) {
  const out = [];
  for (const part of d.split(CMD).map((s) => s.trim()).filter(Boolean)) {
    if (CMD.test(part) && part.length === 1) { out.push({ cmd: part, args: [] }); continue; }
    const cur = out[out.length - 1]; if (!cur) throw new Error(`path data does not start with a command: ${d.slice(0, 20)}`);
    const isArc = /[Aa]/.test(cur.cmd);
    let i = 0, n = 0;
    while (i < part.length) {
      while (i < part.length && /[\s,]/.test(part[i])) i++;
      if (i >= part.length) break;
      if (isArc && (n % 7 === 3 || n % 7 === 4)) { cur.args.push(Number(part[i])); i++; n++; continue; }
      NUM.lastIndex = i; const m = NUM.exec(part); if (!m) throw new Error(`bad path data near "${part.slice(i, i + 12)}"`);
      cur.args.push(Number(m[0])); i += m[0].length; n++;
    }
  }
  return out;
}
/** Subpaths as absolute segments: [{ segs: [{ t: 'L'|'C'|'Q'|'A', p: [[x,y]…], rx, ry, rot, fa, fs }], closed }]. */
export function normalise(d) {
  const subs = []; let sub = null, cx = 0, cy = 0, sx = 0, sy = 0, lc = null, lq = null;
  for (const { cmd, args } of tokens(d)) {
    const rel = cmd !== cmd.toUpperCase(), up = cmd.toUpperCase();
    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }[up];
    if (up === 'Z') { if (sub) { if (cx !== sx || cy !== sy) sub.segs.push({ t: 'L', p: [[cx, cy], [sx, sy]] }); sub.closed = true; } cx = sx; cy = sy; lc = lq = null; continue; }
    if (args.length % step) throw new Error(`${cmd} with ${args.length} numbers`);
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      const X = (v) => (rel ? cx + v : v), Y = (v) => (rel ? cy + v : v);
      if (up === 'M' && k === 0) { cx = X(a[0]); cy = Y(a[1]); sx = cx; sy = cy; sub = { segs: [], closed: false, start: [cx, cy] }; subs.push(sub); lc = lq = null; continue; }
      if (!sub) throw new Error('path data does not start with M');
      if (up === 'M' || up === 'L' || up === 'H' || up === 'V') {
        const x = up === 'V' ? cx : X(a[0]), y = up === 'H' ? cy : up === 'V' ? Y(a[0]) : Y(a[1]);
        sub.segs.push({ t: 'L', p: [[cx, cy], [x, y]] }); cx = x; cy = y; lc = lq = null;
      } else if (up === 'C' || up === 'S') {
        let c1, c2, e;
        if (up === 'C') { c1 = [X(a[0]), Y(a[1])]; c2 = [X(a[2]), Y(a[3])]; e = [X(a[4]), Y(a[5])]; }
        else { c1 = lc ? [2 * cx - lc[0], 2 * cy - lc[1]] : [cx, cy]; c2 = [X(a[0]), Y(a[1])]; e = [X(a[2]), Y(a[3])]; }
        sub.segs.push({ t: 'C', p: [[cx, cy], c1, c2, e] }); lc = c2; lq = null; [cx, cy] = e;
      } else if (up === 'Q' || up === 'T') {
        let c, e;
        if (up === 'Q') { c = [X(a[0]), Y(a[1])]; e = [X(a[2]), Y(a[3])]; }
        else { c = lq ? [2 * cx - lq[0], 2 * cy - lq[1]] : [cx, cy]; e = [X(a[0]), Y(a[1])]; }
        sub.segs.push({ t: 'Q', p: [[cx, cy], c, e] }); lq = c; lc = null; [cx, cy] = e;
      } else if (up === 'A') {
        const e = [X(a[5]), Y(a[6])];
        sub.segs.push({ t: 'A', p: [[cx, cy], e], rx: a[0], ry: a[1], rot: a[2], fa: a[3], fs: a[4] }); [cx, cy] = e; lc = lq = null;
      }
    }
  }
  return subs;
}
/** An SVG arc's centre parameterisation (W3C F.6.5): { cx, cy, rx, ry, t1, dt, cos, sin }. */
export function arcInfo(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2) {
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = (rotDeg * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => { const d = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy)); const t = Math.acos(Math.min(1, Math.max(-1, d))); return ux * vy - uy * vx < 0 ? -t : t; };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry, vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  let t1 = ang(1, 0, ux, uy), dt = ang(ux, uy, vx, vy);
  if (!fS && dt > 0) dt -= 2 * Math.PI; if (fS && dt < 0) dt += 2 * Math.PI;
  return { cx, cy, rx, ry, t1, dt, cos, sin };
}
const arcPts = (s, stepDeg) => {
  const [[x1, y1], [x2, y2]] = s.p; if (!s.rx || !s.ry) return [[x2, y2]];
  const k = arcInfo(x1, y1, s.rx, s.ry, s.rot, s.fa, s.fs, x2, y2);
  const n = Math.max(8, Math.ceil((Math.abs(k.dt) * 180) / Math.PI / stepDeg)), pts = [];
  for (let i = 1; i <= n; i++) { const t = k.t1 + (k.dt * i) / n, px = Math.cos(t) * k.rx, py = Math.sin(t) * k.ry; pts.push([k.cos * px - k.sin * py + k.cx, k.sin * px + k.cos * py + k.cy]); }
  pts[pts.length - 1] = [x2, y2];
  return pts;
};
/** The path as polylines, one per subpath: [{ pts, closed }]. */
export function flatten(d, { stepDeg = 0.1, curveSteps = 400, lineStep = 0 } = {}) {
  return normalise(d).map(({ segs, closed, start }) => {
    const pts = [start];
    for (const s of segs) {
      if (s.t === 'L') {
        const [[x0, y0], [x1, y1]] = s.p;
        const n = lineStep ? Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / lineStep)) : 1;
        for (let i = 1; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n]);
      } else if (s.t === 'C') {
        const [p0, p1, p2, p3] = s.p;
        for (let i = 1; i <= curveSteps; i++) { const t = i / curveSteps, u = 1 - t; pts.push([0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])); }
      } else if (s.t === 'Q') {
        const [p0, p1, p2] = s.p;
        for (let i = 1; i <= curveSteps; i++) { const t = i / curveSteps, u = 1 - t; pts.push([0, 1].map((k) => u * u * p0[k] + 2 * u * t * p1[k] + t * t * p2[k])); }
      } else pts.push(...arcPts(s, stepDeg));
    }
    return { pts, closed };
  });
}

// ── the exact stroker ───────────────────────────────────────────────────────────────────────────────────────────
// Each subpath of lines and circular arcs becomes one contour drawn the way a pen of radius h = w/2 sweeps it: the
// left offset of every segment, a round join of radius h at every vertex (through the vertex on the inside of a
// turn, as Skia joins), round caps — all as SVG arcs, which Skia holds exactly as conics. PathOps resolves the
// contour under the nonzero rule. A closed circle with r ≤ h is a dot, written as a disc of radius r + h.

const rot = (v) => [-v[1], v[0]], add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const unit = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
const ang = (v) => Math.atan2(v[1], v[0]);
const N = (v) => +v.toPrecision(15);
const P = (p) => `${N(p[0])} ${N(p[1])}`;
const TIDY = 1e-3;
/** A closed loop's inner contour thinner than this is a solid shape's axis, not a hole (see strokeContours). */
const SLIVER = 0.02;

/** The subpath as exact segments — { t: 'L', a, b } or { t: 'A', c, r, t1, dt } — or null where one is not circular. */
function toSegs(sub) {
  const out = [];
  for (const s of sub.segs) {
    const a = s.p[0], b = s.p[s.p.length - 1];
    if (s.t === 'L') { if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1e-9) out.push({ t: 'L', a, b }); continue; }
    if (s.t !== 'A') return null;
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-9) continue; // SVG omits an arc whose ends coincide
    if (!s.rx || !s.ry) { out.push({ t: 'L', a, b }); continue; } // SVG draws a zero-radius arc as a line
    const k = arcInfo(a[0], a[1], s.rx, s.ry, s.rot, s.fa, s.fs, b[0], b[1]);
    if (Math.abs(k.rx - k.ry) > 1e-9) return null;
    out.push({ t: 'A', c: [k.cx, k.cy], r: k.rx, t1: k.t1, dt: k.dt });
  }
  return out;
}
const tanStart = (s) => (s.t === 'L' ? unit([s.b[0] - s.a[0], s.b[1] - s.a[1]]) : ((q) => [-Math.sin(s.t1) * q, Math.cos(s.t1) * q])(Math.sign(s.dt)));
const tanEnd = (s) => (s.t === 'L' ? tanStart(s) : ((q) => [-Math.sin(s.t1 + s.dt) * q, Math.cos(s.t1 + s.dt) * q])(Math.sign(s.dt)));
const pStart = (s) => (s.t === 'L' ? s.a : [s.c[0] + Math.cos(s.t1) * s.r, s.c[1] + Math.sin(s.t1) * s.r]);
const pEnd = (s) => (s.t === 'L' ? s.b : [s.c[0] + Math.cos(s.t1 + s.dt) * s.r, s.c[1] + Math.sin(s.t1 + s.dt) * s.r]);
const rev = (s) => (s.t === 'L' ? { t: 'L', a: s.b, b: s.a } : { t: 'A', c: s.c, r: s.r, t1: s.t1 + s.dt, dt: -s.dt });

/** Every circle an arc was drawn on, so a conic PathOps hands back can be put back on its circle. */
let CIRCLES = [];
/** The file's circle registry. A stroke's arc meant to lie on a filled shape's edge lands within the source's own
 *  rounding of it (the 20 headphones-3 stem hugs its ring 0.004 off, because 7.41 is a 2-dp rounding of the true
 *  point), and PathOps cannot resolve two curves that nearly coincide — it resolves identical ones. So a stroke
 *  circle within SNAP of a filled shape's circle is drawn on the shape's circle; a filled shape's circles are never
 *  moved, and stroke circles snap to each other only when they are the same circle to 1e-6 (a cap on another
 *  path's corner), never by a visible amount. */
const SNAP = 0.005, SAME = 1e-6;
/** How far stroke circles snap to each other: SAME normally; a file PathOps still resolves wrong is retried with
 *  them snapping at SNAP, then at 2 × SNAP (`outlinePaths` escalates, and reports the level it needed). */
let STROKE_SNAP = SAME;
let REGISTRY = null; // [{ x, y, r, area, angles: [] }] once built; null during the dry run that collects ARCS
let ARCS = [];       // the dry run's record: [x, y, r, a0, a1, fromArea] per arc drawn
let IN_AREA = false;
const TAU = 2 * Math.PI, HALF_PI = Math.PI / 2;
const mod = (t) => ((t % TAU) + TAU) % TAU;
const nearCircle = (e, c, R, tol) => Math.abs(e.r - R) < tol && Math.hypot(c[0] - e.x, c[1] - e.y) < tol;
/** How close a circle must be to join a registry entry: a filled shape's own circles are never moved (SAME), a stroke's
 *  circle joins a filled shape's within SNAP, and another stroke's within STROKE_SNAP. */
const joinTol = (e, fromArea) => (fromArea ? SAME : e.area ? SNAP : STROKE_SNAP);
function snapCircle(c, R) {
  if (!REGISTRY) return null;
  for (const e of REGISTRY) if (nearCircle(e, c, R, joinTol(e, IN_AREA))) return e;
  return null;
}
/** The registry from the dry run's arcs: clustered circles, each with every angle at which any arc on it starts or ends. */
function buildRegistry() {
  const reg = [];
  for (const [x, y, r, a0, a1, area] of ARCS) {
    let e = reg.find((q) => nearCircle(q, [x, y], r, joinTol(q, area)));
    if (!e) { e = { x, y, r, area, angles: [] }; reg.push(e); }
    for (const t of [mod(a0), mod(a1)]) if (!e.angles.some((u) => Math.abs(u - t) < 1e-9 || Math.abs(Math.abs(u - t) - TAU) < 1e-9)) e.angles.push(t);
  }
  return reg;
}
/** An arc of radius R around c from angle a0 turning by da (signed), broken at every odd multiple of 45° on the way
 *  and at every angle where another arc on the same circle starts or ends: two arcs on one circle then consist of
 *  identical pieces wherever they overlap, which PathOps resolves as coincident. Without that, a cap sitting on
 *  another path's corner (book-open-2's spine on the book's point) or a stem hugging a ring is resolved wrong. The
 *  grid sits at 45° so no vertex lands where a cap touches an axis-aligned line's edge (select-object's bars leave
 *  its squares' sides), and no piece is shorter than a hundredth of a unit, which Skia would hold as a degenerate conic. */
function arcTo(c, R, a0, da) {
  const e = snapCircle(c, R); if (e) { c = [e.x, e.y]; R = e.r; }
  if (R < 1e-12) return `L${P(c)}`;
  const a1 = a0 + da;
  if (!REGISTRY) ARCS.push([c[0], c[1], R, a0, a1, IN_AREA]);
  CIRCLES.push([c[0], c[1], R]);
  const lo = Math.min(a0, a1), hi = Math.max(a0, a1), margin = Math.min(0.01 / R, Math.abs(da) / 3); // no piece under 0.01 of arc
  const stops = [], inside = (t) => t > lo + margin && t < hi - margin && !stops.some((v) => Math.abs(v - t) < 1e-9);
  for (let k = Math.floor((lo - HALF_PI / 2) / HALF_PI); (k + 0.5) * HALF_PI < hi; k++) { const t = (k + 0.5) * HALF_PI; if (inside(t)) stops.push(t); }
  if (e) for (const u of e.angles) for (let t = u + TAU * Math.floor((lo - u) / TAU); t <= hi; t += TAU) if (inside(t)) stops.push(t);
  stops.sort((p, q) => (da > 0 ? p - q : q - p));
  stops.push(a1);
  let o = '';
  for (const t of stops) o += `A${N(R)} ${N(R)} 0 0 ${da > 0 ? 1 : 0} ${P([c[0] + Math.cos(t) * R, c[1] + Math.sin(t) * R])}`;
  return o;
}
/** The left offset of one segment, drawn from its start offset point. */
function offset(s, h) {
  if (s.t === 'L') { const n = rot(tanStart(s)); return `L${P(add(s.b, n, h))}`; }
  const rho = s.r - Math.sign(s.dt) * h; // left of travel: inside for a positive sweep
  // The inner offset collapses through the centre (r ≤ h): go through the centre instead, as a pivot. Both edges
  // lie inside the stroke (inside the end discs), so they add no ink and leave no hole.
  if (rho < 1e-12) return `L${P(s.c)}L${P(add(pEnd(s), rot(tanEnd(s)), h))}`;
  // c + ρ·u(t): for ρ < 0 this is c + |ρ|·u(t + π), same sweep
  return arcTo(s.c, Math.abs(rho), s.t1 + (rho < 0 ? Math.PI : 0), s.dt);
}
/** A round join on the left side: the normal turns with the tangent; on the inside of a turn, through the vertex. */
function join(p, tIn, tOut, h) {
  let th = ang(tOut) - ang(tIn); while (th > Math.PI) th -= 2 * Math.PI; while (th < -Math.PI) th += 2 * Math.PI;
  if (Math.abs(th) < 1e-12) return '';
  if (th > 0) return th < 0.1 ? `L${P(add(p, rot(tOut), h))}` // a near-tangent inner turn: the chord lies inside the pen's disc
    : `L${P(p)}L${P(add(p, rot(tOut), h))}`;
  return arcTo(p, h, ang(rot(tIn)), th);
}
function leftChain(segs, h, closed) {
  let o = '';
  segs.forEach((s, i) => {
    o += offset(s, h);
    const nx = segs[i + 1] || (closed ? segs[0] : null);
    if (nx) o += join(pEnd(s), tanEnd(s), tanStart(nx), h);
  });
  return o;
}
/** How thick one contour is: the farthest its points stand from the chord between its two farthest-apart points. */
function thickness(d) {
  const pts = flatten(d, { stepDeg: 2 }).flatMap((p) => p.pts); if (pts.length < 3) return 0;
  const far = (from) => pts.reduce((b, p) => (Math.hypot(p[0] - from[0], p[1] - from[1]) > Math.hypot(b[0] - from[0], b[1] - from[1]) ? p : b), pts[0]);
  const a = far(pts[0]), b = far(a), l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1e-9) return 0;
  return Math.max(...pts.map((p) => Math.abs((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) / l));
}
/** Drop zero-length L/A steps (PathOps mis-resolves contours full of them). */
function tidy(d) {
  let cur = null, out = '';
  for (const m of d.matchAll(/([MLAZ])([^MLAZ]*)/g)) {
    if (m[1] === 'Z') { out += 'Z'; continue; }
    const n = m[2].trim().split(/\s+/).map(Number);
    const e = [n[n.length - 2], n[n.length - 1]];
    if (m[1] !== 'M' && cur && Math.hypot(e[0] - cur[0], e[1] - cur[1]) < TIDY) continue;
    out += m[1] + m[2]; cur = e;
  }
  return out;
}
/** One raw contour string per subpath of `d` stroked at `w`, or null where a subpath is not lines and circular arcs. */
export function strokeContours(d, w) {
  const h = w / 2, out = [];
  for (const sub of normalise(d)) {
    const segs = toSegs(sub); if (segs === null) return null;
    let o = '';
    if (!segs.length) { const p = sub.start; o = `M${P([p[0] - h, p[1]])}` + arcTo(p, h, Math.PI, 2 * Math.PI) + 'Z'; out.push(o); continue; }
    // a dot: a closed circle no wider than its pen
    if (sub.closed && segs.every((s) => s.t === 'A' && Math.hypot(s.c[0] - segs[0].c[0], s.c[1] - segs[0].c[1]) < 1e-6 && Math.abs(s.r - segs[0].r) < 1e-9) && segs[0].r <= h + 1e-9) {
      const c = segs[0].c, R = segs[0].r + h; out.push(`M${P([c[0] + R, c[1]])}` + arcTo(c, R, 0, 2 * Math.PI) + 'Z'); continue;
    }
    const e0 = pEnd(segs[segs.length - 1]), s0 = pStart(segs[0]);
    const closed = sub.closed && Math.hypot(e0[0] - s0[0], e0[1] - s0[1]) < 1e-9;
    const R = segs.slice().reverse().map(rev);
    if (closed) {
      // Each side of a closed loop is its own contour. The inside of a shape no deeper than its pen — the two sides'
      // offsets meet on the axis (pen-tool-2's holder, calculator's keys; lint's `isSolidStroke`) — is a sliver, or
      // a hairline where the source's 2-dp rounding leaves the shape a hundredth wider than the pen. It is left out:
      // a hole under SLIVER wide is nothing the eye or the raster gate sees, and PathOps mis-resolves a contour that thin.
      for (const chain of [segs, R]) {
        const d = `M${P(add(pStart(chain[0]), rot(tanStart(chain[0])), h))}` + leftChain(chain, h, true) + 'Z';
        if (thickness(d) >= SLIVER) o += d;
      }
    } else {
      const a = segs[0], e = segs[segs.length - 1], te = tanEnd(e), ts = tanStart(a);
      o += `M${P(add(pStart(a), rot(ts), h))}` + leftChain(segs, h, false);
      o += arcTo(pEnd(e), h, ang(rot(te)), -Math.PI); // end cap, around the front
      o += leftChain(R, h, false);
      o += arcTo(pStart(a), h, ang(rot([-ts[0], -ts[1]])), -Math.PI) + 'Z'; // start cap
    }
    if (o) out.push(tidy(o));
  }
  return out;
}

// ── Skia's commands back to SVG ─────────────────────────────────────────────────────────────────────────────────

const conicMid = (p0, a) => { const w = a[4]; return [(p0[0] + 2 * w * a[0] + a[2]) / (2 + 2 * w), (p0[1] + 2 * w * a[1] + a[3]) / (2 + 2 * w)]; };
/** The circle a conic lies on, if its two legs are equal and it is a true circular arc; else null. */
const conicCircle = (p0, a) => {
  const [px, py, ex, ey] = a, ax = -(py - p0[1]), ay = px - p0[0], bx = -(ey - py), by = ex - px, den = ax * by - ay * bx;
  if (Math.abs(den) < 1e-12) return null;
  const t = ((ex - p0[0]) * by - (ey - p0[1]) * bx) / den, c = [p0[0] + ax * t, p0[1] + ay * t];
  const r0 = Math.hypot(p0[0] - c[0], p0[1] - c[1]), r1 = Math.hypot(ex - c[0], ey - c[1]);
  return Math.abs(r0 - r1) < 1e-4 * Math.max(1, r0) ? [c[0], c[1], r0] : null;
};
/** Split Skia's flat command array into [verb, args] pairs. */
function splitCmds(cmds) {
  const segs = [];
  for (let i = 0; i < cmds.length;) { const v = cmds[i++]; const n = { 0: 2, 1: 2, 2: 4, 3: 5, 4: 6, 5: 0 }[v]; segs.push([v, Array.from(cmds.slice(i, i + n))]); i += n; }
  return segs;
}
/** Put PathOps' output conics back on the circles they came from. A conic whose start, middle and end lie on one
 *  known circle is kept as it is. PathOps occasionally splits a conic at a point that is on no circle (seen on
 *  power-filled's caps, off by 0.18): a conic that fits no circle is merged with the ones after it until the run's
 *  ends lie on a known circle and its joints and middles lie near it, and the run is written as one arc on the
 *  circle it fits best. The test is on points, not on a fitted centre, which a short conic places badly. */
function snap(segs) {
  const out = []; let cur = [0, 0];
  const dev = (p, c) => Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1]) - c[2]);
  const ON = 5e-4, JOINT = 0.2; // ON: the output's own 3-dp rounding
  for (let k = 0; k < segs.length; k++) {
    const [v, a] = segs[k];
    if (v !== 3 || !CIRCLES.length) { out.push([v, a]); if (v !== 5) cur = a.slice(-2); continue; }
    const onOne = (p0, q) => CIRCLES.some((c) => dev(p0, c) < ON && dev(conicMid(p0, q), c) < ON && dev([q[2], q[3]], c) < ON);
    const start = cur, end0 = [a[2], a[3]], mid0 = conicMid(start, a);
    if (onOne(start, a)) { out.push([v, a]); cur = end0; continue; }
    let j = k, end = end0, inner = [mid0], hit = null; // inner: the run's middles and joints
    const fit = () => { let best = null, worst = Infinity; for (const c of CIRCLES) { if (dev(start, c) >= ON || dev(end, c) >= ON) continue; const w = Math.max(...inner.map((p) => dev(p, c))); if (w < JOINT && w < worst) { worst = w; best = c; } } return best; };
    hit = fit();
    // the run grows only over conics that fit no circle themselves: one that does is right as it is
    while (!hit && j + 1 < segs.length && segs[j + 1][0] === 3 && !onOne(end, segs[j + 1][1])) { j++; inner.push(end, conicMid(end, segs[j][1])); end = [segs[j][1][2], segs[j][1][3]]; hit = fit(); }
    if (!hit) { out.push([v, a]); cur = end0; continue; }
    // the sweep, accumulated through the run's points so any span is read right
    const pts = [start, ...inner, end]; let da = 0;
    for (let i = 1; i < pts.length; i++) { let d = Math.atan2(pts[i][1] - hit[1], pts[i][0] - hit[0]) - Math.atan2(pts[i - 1][1] - hit[1], pts[i - 1][0] - hit[0]); while (d > Math.PI) d -= TAU; while (d <= -Math.PI) d += TAU; da += d; }
    out.push(['arc', [hit, end, da]]); cur = end; k = j;
  }
  return out;
}
function toSVG(cmds) {
  let o = '', cx = 0, cy = 0; const f = (v) => +v.toFixed(6);
  const flat = [];
  for (const [v, a] of snap(splitCmds(cmds))) {
    if (v !== 'arc') { flat.push(v, ...a); continue; }
    const [[, , r], e, da] = a; flat.push('A', r, da, e[0], e[1]);
  }
  for (let i = 0; i < flat.length;) {
    const v = flat[i++];
    if (v === 'A') { const r = flat[i++], da = flat[i++], ex = flat[i++], ey = flat[i++]; o += `A${f(r)} ${f(r)} 0 ${Math.abs(da) > Math.PI ? 1 : 0} ${da > 0 ? 1 : 0} ${f(ex)} ${f(ey)}`; cx = ex; cy = ey; continue; }
    if (v === ck.MOVE_VERB) { cx = flat[i++]; cy = flat[i++]; o += `M${f(cx)} ${f(cy)}`; }
    else if (v === ck.LINE_VERB) { cx = flat[i++]; cy = flat[i++]; o += `L${f(cx)} ${f(cy)}`; }
    else if (v === ck.QUAD_VERB) { const q = [flat[i++], flat[i++], flat[i++], flat[i++]]; o += `Q${q.map(f).join(' ')}`; [cx, cy] = q.slice(2); }
    else if (v === ck.CUBIC_VERB) { const q = flat.slice(i, i + 6); i += 6; o += `C${q.map(f).join(' ')}`; [cx, cy] = [q[4], q[5]]; }
    else if (v === ck.CONIC_VERB) {
      const [px, py, ex, ey, w] = [flat[i++], flat[i++], flat[i++], flat[i++], flat[i++]];
      const l0 = Math.hypot(px - cx, py - cy), l1 = Math.hypot(ex - px, ey - py);
      const ax = -(py - cy), ay = px - cx, bx = -(ey - py), by = ex - px, den = ax * by - ay * bx;
      const turn = Math.acos(Math.max(-1, Math.min(1, ((px - cx) * (ex - px) + (py - cy) * (ey - py)) / (l0 * l1 || 1))));
      if (Math.abs(l0 - l1) > 1e-4 * Math.max(l0, l1, 1) || Math.abs(den) < 1e-12 || Math.abs(w - Math.cos(turn / 2)) > 1e-4) { // not a circle: sample to quads
        let [sx, sy] = [cx, cy]; const n = 16, Pt = (t) => { const u = 1 - t, dd = u * u + 2 * w * u * t + t * t; return [(u * u * cx + 2 * w * u * t * px + t * t * ex) / dd, (u * u * cy + 2 * w * u * t * py + t * t * ey) / dd]; };
        for (let k = 1; k <= n; k++) { const [mx, my] = Pt((k - 0.5) / n), [qx, qy] = Pt(k / n); o += `Q${f(2 * mx - (sx + qx) / 2)} ${f(2 * my - (sy + qy) / 2)} ${f(qx)} ${f(qy)}`; [sx, sy] = [qx, qy]; }
      } else {
        const t = ((ex - cx) * by - (ey - cy) * bx) / den, r = Math.hypot(ax * t, ay * t);
        const cross = (px - cx) * (ey - py) - (py - cy) * (ex - px);
        o += `A${f(r)} ${f(r)} 0 0 ${cross > 0 ? 1 : 0} ${f(ex)} ${f(ey)}`;
      }
      cx = ex; cy = ey;
    } else if (v === ck.CLOSE_VERB) o += 'Z';
  }
  return o;
}

// ── 3 dp ────────────────────────────────────────────────────────────────────────────────────────────────────────

const r3 = (v) => { const s = (Math.round(v * 1000) / 1000).toFixed(3).replace(/\.?0+$/, ''); return s === '-0' ? '0' : s; };
/** How far a curve's control point may stand off its chord and still be the chord at 3 dp: half a rounding cell's
 *  diagonal, the most rounding moves any written point. */
const FLAT = 0.0005 * Math.SQRT2;
/** A control point's distance to the chord a–b as a segment — the projection clamped to its ends — never to the
 *  chord's whole line: a curve that doubles back along its own line (`M0 0Q10 0 1 0` runs out to x 5.26 and back to
 *  1) has its control point on that line but 9 past the chord's end, and stays a curve. With every control point
 *  within FLAT of the segment, the curve (inside their hull) is within FLAT of it too, so the chord loses no ink. */
const offChord = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
  if (l2 < 1e-24) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.min(1, Math.max(0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
/** Re-emit from the normalised segments: absolute M/L/H/V/A/C/Q/Z, 3 dp, arcs over 90° split, no space it does not
 *  need. A step the 3-dp output cannot see is left out, which changes no rendering: one whose written end is its
 *  written start (`H7.996H7.996` once a near-tangent join rounds; a degenerate conic's quads), and a subpath of
 *  nothing else. A curve whose control points all lie within FLAT of its written chord, the segment (`offChord`), is
 *  written as the chord: PathOps hands back a sliver of a circle as a quad now and then (crown-4's 0.003-long `Q`),
 *  and a sampled conic's flattest quads are lines at this precision (card 2.1's polish, 2026-10-27; measured to the
 *  segment since its review, the same day). */
export function clean(d) {
  let o = '';
  const j = (...n) => n.map(r3).join(' ').replace(/ -/g, '-');
  const R = (p) => [Number(r3(p[0])), Number(r3(p[1]))];
  const same = (p, q) => p[0] === q[0] && p[1] === q[1];
  for (const { segs, closed, start } of normalise(d)) {
    let cur = R(start), body = '';
    const line = (e) => { const q = R(e); if (same(q, cur)) return; body += q[1] === cur[1] ? 'H' + r3(q[0]) : q[0] === cur[0] ? 'V' + r3(q[1]) : 'L' + j(...q); cur = q; };
    segs.forEach((s, i) => {
      if (closed && i === segs.length - 1 && s.t === 'L') return; // Z draws it
      const [x0, y0] = s.p[0], [x1, y1] = s.p[s.p.length - 1];
      if (s.t === 'L') line([x1, y1]);
      else if (s.t === 'A') {
        // A half-circle arc is ill-conditioned once its ends are rounded (the centre moves by √(2rε)): split every arc over 90° into pieces of 90° or less.
        const k = arcInfo(x0, y0, s.rx, s.ry, s.rot, s.fa, s.fs, x1, y1);
        const n = Math.max(1, Math.ceil(Math.abs(k.dt) / (Math.PI / 2) - 1e-9));
        for (let q = 1; q <= n; q++) {
          const t = k.t1 + (k.dt * q) / n, px = Math.cos(t) * k.rx, py = Math.sin(t) * k.ry;
          const ex = q === n ? x1 : k.cos * px - k.sin * py + k.cx, ey = q === n ? y1 : k.sin * px + k.cos * py + k.cy;
          const e = R([ex, ey]); if (same(e, cur)) continue; // SVG draws nothing for an arc whose ends coincide
          body += 'A' + j(s.rx, s.ry, s.rot) + ` 0 ${s.fs} ` + j(ex, ey); cur = e;
        }
      } else { // C or Q
        const e = R([x1, y1]);
        if (s.p.slice(1, -1).every((c) => offChord(R(c), cur, e) <= FLAT + 1e-9)) { line([x1, y1]); return; }
        body += s.t + j(...s.p.slice(1).flat()); cur = e;
      }
    });
    if (body) o += 'M' + j(...start) + body + (closed ? 'Z' : '');
  }
  return o;
}

// ── outline ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** The outlined path data of a parsed source: { d, fallback, level } — `fallback` counts the stroked paths Skia
 *  offset, `level` how far stroke circles had to snap (0 normally). The union is checked against Skia's own
 *  rendering of the pieces it was given; PathOps resolves a near-coincidence wrong now and then, and a wrong union
 *  is retried with stroke circles snapping to each other, before it is an error. */
export function outlinePaths(src) {
  const levels = [SAME, SNAP, 2 * SNAP]; let last;
  for (let i = 0; i < levels.length; i++) {
    STROKE_SNAP = levels[i];
    try { const r = unionOnce(src); if (unionHolds(r.pieces, r.path, src.size)) { r.path.delete(); return { d: r.d, fallback: r.fallback, level: i }; } r.path.delete(); last = 'the union does not match its pieces'; }
    catch (e) { last = e.message; }
    finally { STROKE_SNAP = SAME; }
  }
  throw new Error(`PathOps could not resolve the drawing at any snap level: ${last}`);
}
/** Skia's rendering of the union's pieces, each painted on its own, against its rendering of the union: 8 px a
 *  unit, drawn at 4 × that and box-filtered down so painting the pieces over each other costs no coverage, no pixel
 *  more than half off. The pieces are exact, so this is the union step alone under test. */
function unionHolds(pieces, path, size) {
  const SS = 4, px = size * 8, S = px * SS, surf = ck.MakeSurface(S, S), cv = surf.getCanvas(), paint = new ck.Paint(); paint.setAntiAlias(true); paint.setColor(ck.BLACK);
  const read = () => { surf.flush(); const raw = cv.readPixels(0, 0, { width: S, height: S, colorType: ck.ColorType.RGBA_8888, alphaType: ck.AlphaType.Unpremul, colorSpace: ck.ColorSpace.SRGB }); const a = new Float64Array(px * px); for (let Y = 0; Y < S; Y++) for (let X = 0; X < S; X++) a[Math.floor(Y / SS) * px + Math.floor(X / SS)] += raw[(Y * S + X) * 4 + 3] / (SS * SS); return a; };
  cv.clear(ck.TRANSPARENT); cv.scale(S / size, S / size);
  for (const { d, rule, stroke } of pieces) {
    const p = ck.Path.MakeFromSVGString(d);
    if (stroke) { paint.setStyle(ck.PaintStyle.Stroke); paint.setStrokeWidth(stroke); paint.setStrokeCap(ck.StrokeCap.Round); paint.setStrokeJoin(ck.StrokeJoin.Round); }
    else { paint.setStyle(ck.PaintStyle.Fill); p.setFillType(rule === 'evenodd' ? ck.FillType.EvenOdd : ck.FillType.Winding); }
    cv.drawPath(p, paint); p.delete();
  }
  const a = read(); cv.clear(ck.TRANSPARENT); paint.setStyle(ck.PaintStyle.Fill); cv.drawPath(path, paint); const b = read();
  paint.delete(); surf.dispose();
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 128) return false;
  return true;
}
function unionOnce(src) {
  // The registry: a dry run of the stroker lists every circle the file draws on; a filled shape's circles first,
  // so they win their clusters. Then the real run snaps to it.
  REGISTRY = null; ARCS = []; CIRCLES = [];
  IN_AREA = true; for (const a of src.areas) canonical(a.d); IN_AREA = false; // the dry run: areas first, so their circles seed the clusters
  for (const s of src.strokes) strokeContours(s.d, s.w);
  REGISTRY = buildRegistry(); ARCS = []; CIRCLES = [];
  let acc = new ck.Path(), fallback = 0; const pieces = [];
  const union = (p) => { const r = ck.Path.MakeFromOp(acc, p, ck.PathOp.Union); if (!r) throw new Error('PathOps union failed'); acc.delete(); p.delete(); acc = r; };
  const simplified = (p) => { const e = new ck.Path(), q = ck.Path.MakeFromOp(e, p, ck.PathOp.Union); e.delete(); p.delete(); if (!q) throw new Error('PathOps simplify failed'); return q; };
  const fromSVG = (d) => { const p = ck.Path.MakeFromSVGString(d); if (!p) throw new Error(`Skia could not read path data: ${d.slice(0, 40)}`); return p; };
  for (const a of src.areas) { IN_AREA = true; const d = canonical(a.d); IN_AREA = false; pieces.push({ d, rule: a.rule }); const p = fromSVG(d); p.setFillType(a.rule === 'evenodd' ? ck.FillType.EvenOdd : ck.FillType.Winding); union(simplified(p)); }
  for (const s of src.strokes) {
    const contours = strokeContours(s.d, s.w);
    if (contours) { for (const c of contours) { pieces.push({ d: c, rule: 'nonzero' }); const p = fromSVG(c); p.setFillType(ck.FillType.Winding); union(simplified(p)); } continue; }
    fallback++; pieces.push({ d: s.d, stroke: s.w });
    const p = fromSVG(s.d);
    const q = p.makeStroked({ width: s.w, cap: ck.StrokeCap.Round, join: ck.StrokeJoin.Round, precision: FALLBACK_PRECISION });
    p.delete(); if (!q) throw new Error('Skia stroke failed');
    union(simplified(q));
  }
  const d = clean(toSVG(acc.toCmds())); CIRCLES = []; REGISTRY = null; ARCS = [];
  // the union is judged on the path as written, so a 3-dp rounding or a mis-snapped conic counts too
  const path = fromSVG(d); path.setFillType(ck.FillType.EvenOdd); acc.delete();
  return { d, fallback, path, pieces };
}
/** A filled area re-emitted with its circular arcs broken at the registry's breakpoints (lines and other curves as they are). */
function canonical(d) {
  let o = '';
  for (const { segs, closed, start } of normalise(d)) {
    o += `M${P(start)}`;
    for (const s of segs) {
      const e = s.p[s.p.length - 1];
      if (s.t === 'L') o += `L${P(e)}`;
      else if (s.t === 'C') o += `C${P(s.p[1])} ${P(s.p[2])} ${P(e)}`;
      else if (s.t === 'Q') o += `Q${P(s.p[1])} ${P(e)}`;
      else {
        const k = arcInfo(s.p[0][0], s.p[0][1], s.rx, s.ry, s.rot, s.fa, s.fs, e[0], e[1]);
        if (Math.abs(k.rx - k.ry) > 1e-9 || !s.rx || !s.ry) o += `A${N(s.rx)} ${N(s.ry)} ${N(s.rot)} ${s.fa} ${s.fs} ${P(e)}`;
        else o += arcTo([k.cx, k.cy], k.rx, k.t1, k.dt);
      }
    }
    if (closed) o += 'Z';
  }
  return o;
}

/** Stroked source SVG text in → the outlined-fill SVG text the box ships. `master` must equal the viewBox size. */
export async function outline(svgText, { master } = {}) {
  await load();
  const src = parseSource(svgText);
  if (master !== undefined && Number(master) !== src.size) throw new Error(`master ${master} but the viewBox is ${src.size}`);
  const { d } = outlinePaths(src);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${src.size} ${src.size}" fill="currentColor"><path fill-rule="evenodd" d="${d}"/></svg>\n`;
}

// ── check: the raster gate ──────────────────────────────────────────────────────────────────────────────────────

const inPoly = (x, y, rings) => { let c = false; for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const segDist = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy; let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - ax - t * dx, py - ay - t * dy); };
const pieces = (polys) => polys.flatMap(({ pts, closed }) => { const o = []; for (let i = 1; i < pts.length; i++) o.push([...pts[i - 1], ...pts[i]]); if (pts.length === 1) o.push([...pts[0], ...pts[0]]); if (closed && pts.length > 1) o.push([...pts[pts.length - 1], ...pts[0]]); return o; });

/** The source's exact coverage at px × px, SS × SS samples a pixel, 0–255: no stroker, just distance to the centreline. */
function exactCoverage(src, px, SS) {
  const S = px * SS, k = src.size / S, cov = new Float64Array(px * px);
  // arcs flattened at 1°: a chord's sagitta on the widest circle here (r 11) is 0.0004, far under the gate's half-pixel
  const st = src.strokes.map((s) => ({ h: s.w / 2, segs: pieces(flatten(s.d, { stepDeg: 1, curveSteps: 200 })) }));
  const ar = src.areas.map((a) => flatten(a.d, { stepDeg: 1, curveSteps: 200 }).map((p) => p.pts));
  const C = 0.5, G = Math.ceil(src.size / C) + 1, cells = Array.from({ length: G * G }, () => []);
  for (const s of st) for (const g of s.segs) {
    const x0 = Math.max(0, Math.floor((Math.min(g[0], g[2]) - s.h) / C)), x1 = Math.min(G - 1, Math.floor((Math.max(g[0], g[2]) + s.h) / C));
    const y0 = Math.max(0, Math.floor((Math.min(g[1], g[3]) - s.h) / C)), y1 = Math.min(G - 1, Math.floor((Math.max(g[1], g[3]) + s.h) / C));
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) cells[cy * G + cx].push([g, s.h]);
  }
  for (let Y = 0; Y < S; Y++) for (let X = 0; X < S; X++) {
    const x = (X + 0.5) * k, y = (Y + 0.5) * k; let ink = false;
    const cell = cells[Math.min(G - 1, Math.floor(y / C)) * G + Math.min(G - 1, Math.floor(x / C))];
    for (const [g, h] of cell) if (segDist(x, y, g[0], g[1], g[2], g[3]) <= h) { ink = true; break; }
    if (!ink) for (const r of ar) if (inPoly(x, y, r)) { ink = true; break; }
    if (ink) cov[Math.floor(Y / SS) * px + Math.floor(X / SS)] += 255 / (SS * SS);
  }
  return cov;
}
/** The outlined SVG rendered by Skia at px × px (drawn at SS× and box-filtered down), 0–255 a pixel. */
function renderCoverage(outlined, size, px, SS) {
  const S = px * SS, surface = ck.MakeSurface(S, S); if (!surface) throw new Error('no Skia surface');
  const canvas = surface.getCanvas(); canvas.clear(ck.TRANSPARENT); canvas.scale(S / size, S / size);
  const paint = new ck.Paint(); paint.setAntiAlias(true); paint.setColor(ck.BLACK); paint.setStyle(ck.PaintStyle.Fill);
  for (const tag of outlined.match(/<path\b[^>]*>/g) || []) {
    const p = ck.Path.MakeFromSVGString(attr(tag, 'd')); if (!p) throw new Error('Skia could not read the outlined path');
    p.setFillType(attr(tag, 'fill-rule') === 'evenodd' ? ck.FillType.EvenOdd : ck.FillType.Winding);
    canvas.drawPath(p, paint); p.delete();
  }
  surface.flush();
  const img = canvas.readPixels(0, 0, { width: S, height: S, colorType: ck.ColorType.RGBA_8888, alphaType: ck.AlphaType.Unpremul, colorSpace: ck.ColorSpace.SRGB });
  paint.delete(); surface.dispose();
  const cov = new Float64Array(px * px);
  for (let Y = 0; Y < S; Y++) for (let X = 0; X < S; X++) cov[Math.floor(Y / SS) * px + Math.floor(X / SS)] += img[(Y * S + X) * 4 + 3] / (SS * SS);
  return cov;
}
const r2 = (v) => Math.round(v * 100) / 100;
const boxOf = (take) => { const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }; take((x, y, r) => { b.x0 = Math.min(b.x0, x - r); b.y0 = Math.min(b.y0, y - r); b.x1 = Math.max(b.x1, x + r); b.y1 = Math.max(b.y1, y + r); }); return { x: b.x0, y: b.y0, w: b.x1 - b.x0, h: b.y1 - b.y0 }; };
/** The exact ink box of the stroked source: a round-capped, round-joined stroke is its centreline ⊕ a disc, so its box is the centreline's ± w/2. */
export function sourceBox(src) {
  return boxOf((take) => {
    for (const s of src.strokes) for (const { pts } of flatten(s.d, { stepDeg: 0.01, curveSteps: 20000 })) for (const [x, y] of pts) take(x, y, s.w / 2);
    for (const a of src.areas) for (const { pts } of flatten(a.d, { stepDeg: 0.01, curveSteps: 20000 })) for (const [x, y] of pts) take(x, y, 0);
  });
}
/** The ink box of outlined SVG text, from its arcs' true extremes. */
export function outlinedBox(outlined) {
  return boxOf((take) => { for (const tag of outlined.match(/<path\b[^>]*>/g) || []) for (const { pts } of flatten(attr(tag, 'd'), { stepDeg: 0.01, curveSteps: 2000 })) for (const [x, y] of pts) take(x, y, 0); });
}
const sameBox = (a, b, tol = 0.005) => ['x', 'y', 'w', 'h'].every((k) => Math.abs(a[k] - b[k]) < tol + 1e-9);

/** The raster gate on one conversion: { wrong, max, source, result, exact } — wrong pixels (over half coverage off),
 *  the largest difference (0–255), the source's exact ink box, the output's, and whether they agree to 2 dp. */
export async function check(svgText, outlined, { master } = {}) {
  await load();
  const src = parseSource(svgText);
  if (master !== undefined && Number(master) !== src.size) throw new Error(`master ${master} but the viewBox is ${src.size}`);
  const px = Math.round((GATE_PX * src.size) / 24);
  const a = exactCoverage(src, px, GATE_SS), b = renderCoverage(outlined, src.size, px, GATE_SS);
  let wrong = 0, max = 0;
  for (let i = 0; i < a.length; i++) { const v = Math.abs(a[i] - b[i]); if (v > max) max = v; if (v > 128) wrong++; }
  const source = sourceBox(src), result = outlinedBox(outlined);
  return { wrong, max: Math.round(max), source, result, exact: sameBox(source, result) };
}

/** How far the output's edge strays from the exact stroke edge, for a fallback file: the largest distance from a
 *  point on the output outline to the nearest exact edge (a centreline at w/2, or an area's boundary). */
export function edgeError(src, outlined) {
  const cl = src.strokes.map((s) => ({ h: s.w / 2, segs: pieces(flatten(s.d, { stepDeg: 0.05, curveSteps: 2000 })) }));
  const ar = src.areas.map((a) => pieces(flatten(a.d, { stepDeg: 0.05, curveSteps: 2000 })));
  const near = (x, y, segs) => { let m = Infinity; for (const g of segs) { const v = segDist(x, y, g[0], g[1], g[2], g[3]); if (v < m) m = v; } return m; };
  let max = 0;
  for (const tag of outlined.match(/<path\b[^>]*>/g) || []) for (const { pts } of flatten(attr(tag, 'd'), { stepDeg: 0.5, curveSteps: 24, lineStep: 0.05 })) for (const [x, y] of pts) {
    let e = Infinity;
    for (const c of cl) e = Math.min(e, Math.abs(near(x, y, c.segs) - c.h));
    for (const p of ar) e = Math.min(e, near(x, y, p));
    if (e > max) max = e;
  }
  return max;
}

/** The curve fallback's own error: each stroked path our stroker cannot offset, stroked by Skia at FALLBACK_PRECISION
 *  on its own, against its exact edge — the largest, or 0 when every path is exact. */
export function fallbackError(src) {
  let worst = 0;
  for (const s of src.strokes) {
    if (strokeContours(s.d, s.w)) continue;
    // simplified first: the stroker's raw contour pivots through the centreline on the inside of a turn, which
    // the union removes (as it does in `unionOnce`), and measuring those would read as the whole half-weight
    const p = ck.Path.MakeFromSVGString(s.d), q = p.makeStroked({ width: s.w, cap: ck.StrokeCap.Round, join: ck.StrokeJoin.Round, precision: FALLBACK_PRECISION });
    const e = new ck.Path(), u = ck.Path.MakeFromOp(e, q, ck.PathOp.Union);
    worst = Math.max(worst, edgeError({ strokes: [s], areas: [] }, `<path d="${u.toSVGString()}"/>`)); p.delete(); q.delete(); e.delete(); u.delete();
  }
  return worst;
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** One file through outline + check, as the CLI reports it. */
async function checkOne(rel, dist) {
  const text = readFileSync(pathJoin(ROOT, 'src/icons', rel + '.svg'), 'utf8');
  try {
    const src = parseSource(text), t = performance.now();
    const { d, fallback } = outlinePaths(src); const ms = performance.now() - t;
    const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${src.size} ${src.size}" fill="currentColor"><path fill-rule="evenodd" d="${d}"/></svg>\n`;
    const r = await check(text, out);
    const [m, name] = rel.split('/'), want = dist?.[m]?.[name]?.ink;
    return {
      rel, ms,
      wrong: r.wrong ? `${rel}: ${r.wrong} wrong pixel(s), largest difference ${r.max}/255` : null,
      offExact: r.exact ? null : `${rel}: exact ${fmtBox(r.source)} → output ${fmtBox(r.result)}`,
      // against dist/icons.json: its box is 2 dp, the output's 3 dp, so a difference under 0.0055 is a rounding tie
      distWrong: want && !sameBox(want, r.source) ? `${rel}: icons.json ${fmtBox(want)}, exact ink ${fmtBox(r.source)}` : null,
      offDist: want && sameBox(want, r.source) && !sameBox(want, r.result, 0.0055) ? `${rel}: icons.json ${fmtBox(want)} → output ${fmtBox(r.result)}` : null,
      tie: want && sameBox(want, r.source) && sameBox(want, r.result, 0.0055) && !sameBox(want, r.result) ? rel : null,
      curve: fallback ? `${rel}: ${fallbackError(src).toFixed(4)}${fallback > 1 ? ` (${fallback} paths)` : ''}` : null, curveErr: fallback ? fallbackError(src) : 0,
      edge: (() => { const e = edgeError(src, out); return e > 0.005 ? `${rel}: ${e.toFixed(4)}` : null; })(),
      bad: !!(r.wrong || !r.exact), tooDeep: /\d\.\d{4}/.test(out) ? `${rel}: a number over 3 dp` : null, notes: /<!--|stroke/.test(out) ? `${rel}: a comment or stroke attribute` : null,
    };
  } catch (e) { return { rel, error: `${rel}: ${e.message}` }; }
}

async function checkAll(only) {
  const t0 = performance.now();
  const files = ['24', '20', '16'].flatMap((m) => readdirSync(pathJoin(ROOT, 'src/icons', m)).filter((f) => f.endsWith('.svg')).sort().map((f) => `${m}/${f.slice(0, -4)}`))
    .filter((rel) => !only.length || only.includes(rel) || only.includes(rel.split('/')[1]));
  const distPath = pathJoin(ROOT, 'dist/icons.json');
  const dist = existsSync(distPath) ? JSON.parse(readFileSync(distPath, 'utf8')) : null;
  if (!dist) console.log('dist/icons.json not found: run `npm run build` to compare against its ink boxes');
  // the exact reference costs ~0.3 s a file in plain JS, so the files are shared out over the cores
  const { Worker } = await import('node:worker_threads'); const os = await import('node:os');
  const n = Math.max(1, Math.min(os.availableParallelism(), Math.ceil(files.length / 8)));
  const parts = Array.from({ length: n }, (_, i) => files.filter((_, j) => j % n === i));
  const results = (await Promise.all(parts.map((part) => new Promise((resolve, reject) => {
    const w = new Worker(new URL(import.meta.url), { workerData: { files: part, dist } });
    w.on('message', resolve); w.on('error', reject); w.on('exit', (c) => c && reject(new Error(`worker exited ${c}`)));
  })))).flat().sort((a, b) => files.indexOf(a.rel) - files.indexOf(b.rel));
  const pick = (k) => results.map((r) => r[k]).filter(Boolean);
  const list = (title, rows) => { console.log(`\n${title}: ${rows.length}`); for (const r of rows) console.log('  ' + r); };
  const ok = results.filter((r) => !r.error), ms = ok.reduce((a, r) => a + r.ms, 0);
  console.log(`${ok.length} of ${files.length} files converted in ${((performance.now() - t0) / 1000).toFixed(1)} s on ${n} workers (${(ms / Math.max(1, ok.length)).toFixed(2)} ms a file in the stroker and union)`);
  list('errors', pick('error'));
  list('files with wrong pixels', pick('wrong'));
  list('files whose ink box differs from the exact ink at 2 dp', pick('offExact'));
  list("files whose ink box differs from dist/icons.json's by over 0.0055 (a 2-dp step plus the output's 3-dp rounding)", pick('offDist'));
  console.log(`  …and ${pick('tie').length} whose exact ink box sits within 0.0005 of a 2-dp boundary, so icons.json and the 3-dp output round apart`);
  list('files where dist/icons.json itself is off the exact ink by over 0.005 (plans/shipping.md card 1.2)', pick('distWrong'));
  list('files with a number over 3 dp, a comment or a stroke attribute in the output', [...pick('tooDeep'), ...pick('notes')]);
  list('files whose outline strays over 0.005 from the exact edge somewhere (the worst point; a corner arc whose rounded ends miss its edge by that much draws a corner there)', pick('edge'));
  const curves = ok.filter((r) => r.curve).sort((a, b) => b.curveErr - a.curveErr);
  list(`curve-fallback files (a stroked elliptical arc or cubic, offset by Skia at precision ${FALLBACK_PRECISION}), worst edge error first`, curves.map((r) => r.curve));
  if (pick('wrong').length || pick('error').length) process.exit(1);
}
const fmtBox = (b) => `${r2(b.x)},${r2(b.y)} ${r2(b.w)}×${r2(b.h)}`;

const { isMainThread, parentPort, workerData } = await import('node:worker_threads');
if (!isMainThread && workerData?.files) {
  await load();
  const out = []; for (const rel of workerData.files) out.push(await checkOne(rel, workerData.dist));
  parentPort.postMessage(out);
} else if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args[0] === '--check') await checkAll(args.slice(1));
  else if (!args.length || args[0].startsWith('-')) { console.log('usage: node tools/outline.mjs <in.svg> [out.svg] | --check [names…]'); process.exit(2); }
  else {
    const text = readFileSync(args[0], 'utf8'), out = await outline(text);
    if (args[1]) writeFileSync(args[1], out); else process.stdout.write(out);
    const r = await check(text, out);
    console.error(`${r.wrong} wrong pixel(s); ink ${fmtBox(r.source)} → ${fmtBox(r.result)}${r.exact ? '' : ' DIFFERS'}`);
    if (r.wrong) process.exit(1);
  }
}
