// tools/audit/refs/pairgeom.mjs — shared geometry for the two reference comparisons
// (plan card 2.4 Untitled UI outline-against-filled, card 2.5 Central parameter axes).
//
// AUDIT ONLY. Reads records written by `figma.mjs ingest` under research/references/<source>/figma/
// and never writes anywhere but research/references/ (gitignored: third-party geometry,
// internal comparison only). Nothing here is imported by lint, build or the lab.
//
// WHAT IT ADDS TO figma.mjs. figma.mjs already normalises a Figma dump into records and measures
// each drawing's ink box from Figma's own render bounds. Two things a pair comparison needs that
// it does not give:
//   1. an INDEPENDENT ink box — computed from the path and the stroke, so the render bounds can
//      be checked rather than trusted (`analyticBox`);
//   2. a mask of the ink — so two drawings made differently (a stroked ring and a filled disc)
//      can be compared as silhouettes, and what is knocked out of a solid can be measured
//      (`rasterise`, `fillHoles`, `holesOf`).
//
// WHAT THE RASTER IS. Ink is defined by one rule, the same one `tools/audit/raster.mjs` uses for
// our own set: a stroked path inks a point iff its distance to the centreline is <= half the
// weight (that IS round cap + round join, which is all Untitled UI uses); a filled path inks a
// point by its winding rule. Sample points sit at pixel centres. Nothing is anti-aliased: a mask
// is 0 or 1, and every area is a pixel count divided by scale^2, so a number from here carries
// its `scale`.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { parsePath, bboxOfPath, segmentsOf, REF_ROOT } from './figma.mjs';

export { parsePath, bboxOfPath, segmentsOf, REF_ROOT };

// ── reading what was ingested ─────────────────────────────────────────────

const SKIP = new Set(['index.json', 'catalogue.json', 'calibration.json']);

/** Every concept file of a source, parsed, in file-name order. */
export function* conceptsOf(source) {
  const dir = path.join(REF_ROOT, source, 'figma');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !SKIP.has(f)).sort();
  for (const f of files) {
    const c = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    c.file = f;
    yield c;
  }
}

export const r4 = (v) => Math.round(v * 10000) / 10000;
export const r3 = (v) => Math.round(v * 1000) / 1000;
export const r2 = (v) => Math.round(v * 100) / 100;

// ── flattening ────────────────────────────────────────────────────────────

const cubicPt = (a, b, c, d, t) => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
};
const quadPt = (a, b, c, t) => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
};

/**
 * Path commands -> subpaths of points. Curves are cut into chords whose number follows the length
 * of the control polygon (so a tight corner gets as many as a long sweep). `tol` is a rough
 * chord-per-unit density, not a promised deviation: at the default the deviation is < 0.005.
 */
export function flatten(cmds, density = 10) {
  const subs = [];
  let cur = null, start = null, sp = null;
  const begin = (pt) => { sp = { pts: [pt], closed: false }; subs.push(sp); cur = pt; start = pt; };
  for (const { c, p } of cmds) {
    if (c === 'M') begin([p[0], p[1]]);
    else if (c === 'L') { if (!sp) begin([p[0], p[1]]); else { sp.pts.push([p[0], p[1]]); cur = [p[0], p[1]]; } }
    else if (c === 'C' || c === 'Q') {
      if (!sp) continue;
      const pts = c === 'C' ? [cur, [p[0], p[1]], [p[2], p[3]], [p[4], p[5]]] : [cur, [p[0], p[1]], [p[2], p[3]]];
      let len = 0;
      for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      const n = Math.max(4, Math.min(96, Math.ceil(len * density)));
      for (let k = 1; k <= n; k++) {
        const t = k / n;
        sp.pts.push(c === 'C' ? cubicPt(pts[0], pts[1], pts[2], pts[3], t) : quadPt(pts[0], pts[1], pts[2], t));
      }
      cur = pts[pts.length - 1];
    } else if (c === 'Z') {
      if (sp) { sp.closed = true; cur = start; }
      sp = null;   // a following L would continue from start; Figma always writes M first
    }
  }
  return subs.filter((s) => s.pts.length >= 1);
}

// ── an independent ink box ────────────────────────────────────────────────

/**
 * Ink box of ONE path record, from its geometry and its stroke. Returns {x0,y0,x1,y1, exact}.
 * `exact` is false when the answer depends on something the record does not carry (caps that
 * differ end to end — `mixed` — or an INSIDE/OUTSIDE stroke with mitred corners). Callers must not
 * treat an inexact box as a measurement; it is a bound.
 */
export function pathInkBox(p, opts = {}) {
  const cmds = opts.rounded ? effectiveCmds(p, opts) : parsePath(p.d);
  const base = bboxOfPath(cmds);
  if (!base) return null;
  const filled = p.paint === 'fill' || p.paint === 'both';
  const stroked = (p.paint === 'stroke' || p.paint === 'both') && p.stroke && p.stroke.weight > 0;
  let box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  let exact = true;
  const grow = (x0, y0, x1, y1) => {
    if (x0 < box.x0) box.x0 = x0; if (y0 < box.y0) box.y0 = y0;
    if (x1 > box.x1) box.x1 = x1; if (y1 > box.y1) box.y1 = y1;
  };
  if (filled) grow(base.x0, base.y0, base.x1, base.y1);
  if (stroked) {
    const st = p.stroke, w = st.weight, h = w / 2;
    const align = st.align || 'CENTER';
    const subs = flatten(cmds);
    const anyClosed = subs.some((s) => s.closed);
    const allRound = st.cap === 'ROUND' && st.join === 'ROUND';
    if (align !== 'CENTER' && anyClosed) {
      // closed shapes only: INSIDE stays within the path, OUTSIDE grows by the full weight
      if (align === 'INSIDE') grow(base.x0, base.y0, base.x1, base.y1);
      else {
        grow(base.x0 - w, base.y0 - w, base.x1 + w, base.y1 + w);
        if (st.join !== 'ROUND') exact = false;
      }
    } else if (allRound) {
      grow(base.x0 - h, base.y0 - h, base.x1 + h, base.y1 + h);
    } else {
      if (st.cap === 'mixed' || st.join === 'mixed') exact = false;
      const limit = st.miterLimit || 4;
      for (const sub of subs) {
        const pts = sub.pts.filter((q, i, a) => i === 0 || Math.hypot(q[0] - a[i - 1][0], q[1] - a[i - 1][1]) > 1e-9);
        const n = pts.length;
        if (n === 1) { grow(pts[0][0] - h, pts[0][1] - h, pts[0][0] + h, pts[0][1] + h); continue; }
        const segs = [];
        for (let i = 0; i + 1 < n; i++) segs.push([pts[i], pts[i + 1]]);
        if (sub.closed && Math.hypot(pts[0][0] - pts[n - 1][0], pts[0][1] - pts[n - 1][1]) > 1e-9) segs.push([pts[n - 1], pts[0]]);
        const dirs = segs.map(([a, b]) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; });
        // segment rectangles
        segs.forEach(([a, b], i) => {
          const nx = -dirs[i][1] * h, ny = dirs[i][0] * h;
          for (const q of [a, b]) { grow(q[0] + nx, q[1] + ny, q[0] + nx, q[1] + ny); grow(q[0] - nx, q[1] - ny, q[0] - nx, q[1] - ny); }
        });
        // joins at interior vertices (and the seam of a closed path)
        const joinAt = (i0, i1) => {
          const d1 = dirs[i0], d2 = dirs[i1], v = segs[i1][0];
          if (st.join === 'ROUND' || st.join === 'mixed') { grow(v[0] - h, v[1] - h, v[0] + h, v[1] + h); return; }
          if (st.join !== 'MITER') return;   // BEVEL: the rectangle corners already cover it
          const cosT = d1[0] * d2[0] + d1[1] * d2[1];
          const sinHalfInterior = Math.sqrt(Math.max(0, (1 - -cosT) / 2));   // interior angle phi = pi - theta; sin(phi/2) = cos(theta/2)
          const ratio = sinHalfInterior > 1e-9 ? 1 / sinHalfInterior : Infinity;
          if (ratio > limit) return;
          for (const sgn of [1, -1]) {
            const n1 = [-d1[1] * sgn, d1[0] * sgn], n2 = [-d2[1] * sgn, d2[0] * sgn];
            const den = 1 + n1[0] * n2[0] + n1[1] * n2[1];
            if (den < 1e-9) continue;
            const tx = v[0] + (h * (n1[0] + n2[0])) / den, ty = v[1] + (h * (n1[1] + n2[1])) / den;
            grow(tx, ty, tx, ty);
          }
        };
        for (let i = 0; i + 1 < segs.length; i++) joinAt(i, i + 1);
        if (sub.closed && segs.length > 1) joinAt(segs.length - 1, 0);
        // caps on open subpaths
        if (!sub.closed) {
          const ends = [[segs[0][0], [-dirs[0][0], -dirs[0][1]]], [segs[segs.length - 1][1], dirs[dirs.length - 1]]];
          for (const [q, d] of ends) {
            if (st.cap === 'ROUND') grow(q[0] - h, q[1] - h, q[0] + h, q[1] + h);
            else if (st.cap === 'SQUARE' || st.cap === 'mixed') {
              const nx = -d[1] * h, ny = d[0] * h;
              for (const s of [1, -1]) { const qx = q[0] + s * nx + d[0] * h, qy = q[1] + s * ny + d[1] * h; grow(qx, qy, qx, qy); }
            }   // NONE (butt): the rectangle corners already cover it
          }
        }
      }
    }
  }
  if (!Number.isFinite(box.x0)) return null;
  return { ...box, exact };
}

/** Union ink box of a drawing record, analytic. {x0,y0,x1,y1,exact} */
export function analyticBox(rec, opts = {}) {
  let u = null;
  for (const p of rec.paths) {
    if (p.node && p.node.vis === 0) continue;
    if (p.paint === 'none') continue;
    const b = pathInkBox(p, opts);
    if (!b) continue;
    if (!u) u = { ...b };
    else {
      u.x0 = Math.min(u.x0, b.x0); u.y0 = Math.min(u.y0, b.y0);
      u.x1 = Math.max(u.x1, b.x1); u.y1 = Math.max(u.y1, b.y1);
      u.exact = u.exact && b.exact;
    }
  }
  return u;
}

/** Figma's own render bounds for a record, as {x0,y0,x1,y1}; null when it has none. */
export function renderBox(rec) {
  const k = rec.measure && rec.measure.ink;
  if (!k) return null;
  return { x0: k.x.abs, y0: k.y.abs, x1: k.x.abs + k.w.abs, y1: k.y.abs + k.h.abs };
}

/** Per-side signed difference b - a of two boxes. Positive left/top = b starts later; positive right/bottom = b reaches further. */
export function sideDiff(a, b) {
  return { left: b.x0 - a.x0, top: b.y0 - a.y0, right: b.x1 - a.x1, bottom: b.y1 - a.y1 };
}
export const maxAbs = (d) => Math.max(Math.abs(d.left), Math.abs(d.top), Math.abs(d.right), Math.abs(d.bottom));

// ── a pure-JS raster of the ink ───────────────────────────────────────────

/** A mask: { w, h, scale, data: Uint8Array } — pixel (i,j) covers [i/scale,(i+1)/scale) x [j/scale,(j+1)/scale). */
export function newMask(canvasW, canvasH, scale) {
  const w = Math.round(canvasW * scale), h = Math.round(canvasH * scale);
  return { w, h, scale, data: new Uint8Array(w * h) };
}

function fillPolygons(mask, polys, rule) {
  // scanline at pixel-centre rows; crossings collected per row
  const { w, h, scale, data } = mask;
  const edges = [];
  for (const pts of polys) {
    const n = pts.length;
    if (n < 2) continue;
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      if (a[1] === b[1]) continue;
      edges.push(a[1] < b[1] ? { x0: a[0], y0: a[1], x1: b[0], y1: b[1], dir: 1 } : { x0: b[0], y0: b[1], x1: a[0], y1: a[1], dir: -1 });
    }
  }
  if (!edges.length) return;
  const rows = new Array(h);
  for (const e of edges) {
    const j0 = Math.max(0, Math.ceil(e.y0 * scale - 0.5)), j1 = Math.min(h - 1, Math.ceil(e.y1 * scale - 0.5) - 1);
    for (let j = j0; j <= j1; j++) {
      const y = (j + 0.5) / scale;
      const x = e.x0 + ((y - e.y0) * (e.x1 - e.x0)) / (e.y1 - e.y0);
      (rows[j] || (rows[j] = [])).push([x, e.dir]);
    }
  }
  for (let j = 0; j < h; j++) {
    const xs = rows[j];
    if (!xs) continue;
    xs.sort((p, q) => p[0] - q[0]);
    let wind = 0;
    for (let k = 0; k + 1 < xs.length; k++) {
      wind += rule === 'EVENODD' ? 1 : xs[k][1];
      const inside = rule === 'EVENODD' ? wind % 2 !== 0 : wind !== 0;
      if (!inside) continue;
      const i0 = Math.max(0, Math.ceil(xs[k][0] * scale - 0.5)), i1 = Math.min(w - 1, Math.ceil(xs[k + 1][0] * scale - 0.5) - 1);
      for (let i = i0; i <= i1; i++) data[j * w + i] = 1;
    }
  }
}

function strokeCapsules(mask, pts, closed, r) {
  // ink = every pixel centre within r of the polyline (round cap + round join, exactly)
  const { w, h, scale, data } = mask;
  const segs = [];
  const n = pts.length;
  if (n === 1) segs.push([pts[0], pts[0]]);
  for (let i = 0; i + 1 < n; i++) segs.push([pts[i], pts[i + 1]]);
  if (closed && n > 2) segs.push([pts[n - 1], pts[0]]);
  const r2s = r * r;
  for (const [a, b] of segs) {
    const x0 = Math.min(a[0], b[0]) - r, x1 = Math.max(a[0], b[0]) + r, y0 = Math.min(a[1], b[1]) - r, y1 = Math.max(a[1], b[1]) + r;
    const i0 = Math.max(0, Math.floor(x0 * scale)), i1 = Math.min(w - 1, Math.ceil(x1 * scale)), j0 = Math.max(0, Math.floor(y0 * scale)), j1 = Math.min(h - 1, Math.ceil(y1 * scale));
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    for (let j = j0; j <= j1; j++) {
      const py = (j + 0.5) / scale;
      for (let i = i0; i <= i1; i++) {
        if (data[j * w + i]) continue;
        const px = (i + 0.5) / scale;
        let t = L2 > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = a[0] + t * dx - px, qy = a[1] + t * dy - py;
        if (qx * qx + qy * qy <= r2s) data[j * w + i] = 1;
      }
    }
  }
}

/**
 * Ink mask of a record. Models what Untitled UI draws: CENTER strokes with ROUND caps and joins,
 * and fills. Any other stroke throws, because a raster of a stroke the model does not know would
 * be a wrong number, not an approximation — unless `loose` says every stroke may be drawn round
 * (for LOOKING at a contact sheet, never for a figure). `rounded` puts node-level corner rounding
 * back (`roundSharp`), which Central's outlines need and Untitled's do not (its pairs agree better
 * without it: see untitled-pairs.mjs).
 */
export function rasterise(rec, { scale = 32, loose = false, rounded = false } = {}) {
  const mask = newMask(rec.canvas[0], rec.canvas[1], scale);
  for (const p of rec.paths) {
    if (p.node && p.node.vis === 0) continue;
    if (p.paint === 'none') continue;
    const cmds = loose || rounded ? effectiveCmds(p, { cap: 0.5 }) : parsePath(p.d);
    const subs = flatten(cmds);
    if (p.paint === 'fill' || p.paint === 'both') {
      fillPolygons(mask, subs.filter((s) => s.pts.length >= 3).map((s) => s.pts), p.winding === 'EVENODD' ? 'EVENODD' : 'NONZERO');
    }
    if (p.paint === 'stroke' || p.paint === 'both') {
      const st = p.stroke;
      if (!st || (!loose && (st.align !== 'CENTER' || st.cap !== 'ROUND' || st.join !== 'ROUND'))) throw new Error('rasterise: only CENTER ROUND ROUND strokes are modelled (pass loose:true to draw any stroke as round, for looking only)');
      for (const s of subs) strokeCapsules(mask, s.pts, s.closed, st.weight / 2);
    }
  }
  return mask;
}

export const areaOf = (m) => { let n = 0; for (let i = 0; i < m.data.length; i++) n += m.data[i]; return n / (m.scale * m.scale); };

export function iou(a, b) {
  let inter = 0, uni = 0;
  for (let i = 0; i < a.data.length; i++) { const x = a.data[i], y = b.data[i]; inter += x & y; uni += x | y; }
  return uni ? inter / uni : 1;
}
export function xorBox(a, b) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, n = 0;
  for (let j = 0; j < a.h; j++) for (let i = 0; i < a.w; i++) {
    if (a.data[j * a.w + i] !== b.data[j * a.w + i]) { n++; if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j; }
  }
  return n ? { n: n / (a.scale * a.scale), x0: x0 / a.scale, y0: y0 / a.scale, x1: (x1 + 1) / a.scale, y1: (y1 + 1) / a.scale } : { n: 0 };
}

/** The ink box of a mask in canvas units (pixel extremes — resolution is 1/scale). */
export function maskBox(m) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let j = 0; j < m.h; j++) for (let i = 0; i < m.w; i++) if (m.data[j * m.w + i]) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j; }
  return Number.isFinite(x0) ? { x0: x0 / m.scale, y0: y0 / m.scale, x1: (x1 + 1) / m.scale, y1: (y1 + 1) / m.scale } : null;
}

/** Everything not reachable from the border without crossing ink: the filled silhouette. */
export function silhouette(m) {
  const { w, h, data } = m;
  const out = new Uint8Array(w * h).fill(1);   // 1 = inside the silhouette
  const stack = [];
  const seed = (i, j) => { const k = j * w + i; if (!data[k] && out[k]) { out[k] = 0; stack.push(k); } };
  for (let i = 0; i < w; i++) { seed(i, 0); seed(i, h - 1); }
  for (let j = 0; j < h; j++) { seed(0, j); seed(w - 1, j); }
  while (stack.length) {
    const k = stack.pop(), i = k % w, j = (k - i) / w;
    if (i > 0) seed(i - 1, j); if (i < w - 1) seed(i + 1, j); if (j > 0) seed(i, j - 1); if (j < h - 1) seed(i, j + 1);
  }
  return { w, h, scale: m.scale, data: out };
}

// exact Euclidean distance transform (Felzenszwalb & Huttenlocher), squared, in pixels
function edt1d(f, n, d, v, z) {
  let k = 0;
  v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s;
    for (;;) {
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      if (s <= z[k]) k--; else break;
      if (k < 0) { k = 0; break; }
    }
    k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
}
/** Distance (canvas units) from each pixel centre to the nearest pixel where `target[i] === 1`. */
export function distanceTo(target, w, h, scale) {
  const INF = 1e12;
  const f = new Float64Array(Math.max(w, h)), d = new Float64Array(Math.max(w, h)), v = new Int32Array(Math.max(w, h)), z = new Float64Array(Math.max(w, h) + 1);
  const g = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = target[i] ? 0 : INF;
  for (let i = 0; i < w; i++) { for (let j = 0; j < h; j++) f[j] = g[j * w + i]; edt1d(f, h, d, v, z); for (let j = 0; j < h; j++) g[j * w + i] = d[j]; }
  for (let j = 0; j < h; j++) { for (let i = 0; i < w; i++) f[i] = g[j * w + i]; edt1d(f, w, d, v, z); for (let i = 0; i < w; i++) g[j * w + i] = d[i]; }
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = Math.sqrt(g[i]) / scale;
  return out;
}

/**
 * The holes of a mask: enclosed background components (not reachable from the border). Each gets its
 * area, box, and `width` = twice the largest inscribed radius (the diameter of the biggest circle
 * that fits) — for a slot that is the slot's width, for a round hole its diameter, for a
 * triangle or a bowl something between, which is why `area` and `aspect` travel with it.
 */
export function holesOf(m) {
  const { w, h, scale, data } = m;
  const sil = silhouette(m).data;
  const dist = distanceTo(data, w, h, scale);   // from ink
  const label = new Int32Array(w * h);
  const holes = [];
  let id = 0;
  for (let k0 = 0; k0 < w * h; k0++) {
    if (data[k0] || !sil[k0] || label[k0]) continue;
    id++;
    const stack = [k0];
    label[k0] = id;
    let n = 0, maxD = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, sx = 0, sy = 0;
    while (stack.length) {
      const k = stack.pop(), i = k % w, j = (k - i) / w;
      n++; sx += i; sy += j;
      if (dist[k] > maxD) maxD = dist[k];
      if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j;
      const nb = [];
      if (i > 0) nb.push(k - 1); if (i < w - 1) nb.push(k + 1); if (j > 0) nb.push(k - w); if (j < h - 1) nb.push(k + w);
      for (const q of nb) if (!data[q] && sil[q] && !label[q]) { label[q] = id; stack.push(q); }
    }
    const bw = (x1 - x0 + 1) / scale, bh = (y1 - y0 + 1) / scale;
    holes.push({
      id, area: n / (scale * scale), width: 2 * maxD, cx: sx / n / scale, cy: sy / n / scale,
      box: { x0: x0 / scale, y0: y0 / scale, x1: (x1 + 1) / scale, y1: (y1 + 1) / scale },
      aspect: Math.max(bw, bh) / Math.max(1e-9, Math.min(bw, bh)),
    });
  }
  return holes;
}

// ── a PNG, so a mask can be looked at ─────────────────────────────────────

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
/** RGB image -> PNG buffer. `rgb` is a Uint8Array of w*h*3. */
export function pngOf(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let j = 0; j < h; j++) { raw[j * (w * 3 + 1)] = 0; Buffer.from(rgb.buffer, rgb.byteOffset + j * w * 3, w * 3).copy(raw, j * (w * 3 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
/**
 * A contact sheet: each cell is a mask pair drawn as one image, ink A in blue, ink B in red,
 * both in dark grey, nothing in white. `cells` is [{a, b}] of equal-size masks. Written under
 * `outFile`, which must be inside research/references/ or the scratch directory the caller owns.
 */
export function sheetPng(cells, { cols = 6, cell = 192, pad = 4 } = {}) {
  const rows = Math.ceil(cells.length / cols);
  const W = cols * (cell + pad) + pad, H = rows * (cell + pad) + pad;
  const rgb = new Uint8Array(W * H * 3).fill(235);
  cells.forEach(({ a, b }, n) => {
    const ox = pad + (n % cols) * (cell + pad), oy = pad + Math.floor(n / cols) * (cell + pad);
    for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
      const i = Math.floor((x * a.w) / cell), j = Math.floor((y * a.h) / cell);
      const va = a.data[j * a.w + i], vb = b ? b.data[j * a.w + i] : 0;
      let col = [255, 255, 255];
      if (va && vb) col = [40, 40, 40]; else if (va) col = [30, 90, 220]; else if (vb) col = [220, 50, 50];
      const o = ((oy + y) * W + ox + x) * 3;
      rgb[o] = col[0]; rgb[o + 1] = col[1]; rgb[o + 2] = col[2];
    }
  });
  return pngOf(W, H, rgb);
}

// ── morphology on masks (via the exact distance transform) ───────────────

/** Pixels within `r` canvas units of ink (a disc dilation). */
export function dilate(m, r) {
  const d = distanceTo(m.data, m.w, m.h, m.scale);
  const out = new Uint8Array(m.w * m.h);
  for (let i = 0; i < out.length; i++) out[i] = m.data[i] || d[i] <= r ? 1 : 0;
  return { w: m.w, h: m.h, scale: m.scale, data: out };
}
/** Pixels whose whole `r`-disc is ink. */
export function erode(m, r) {
  const inv = new Uint8Array(m.w * m.h);
  for (let i = 0; i < inv.length; i++) inv[i] = m.data[i] ? 0 : 1;
  const d = distanceTo(inv, m.w, m.h, m.scale);   // from each ink pixel: distance to nearest non-ink
  const out = new Uint8Array(m.w * m.h);
  for (let i = 0; i < out.length; i++) out[i] = m.data[i] && d[i] > r ? 1 : 0;
  return { w: m.w, h: m.h, scale: m.scale, data: out };
}
/**
 * The silhouette of a drawing whose contour may have gaps: close gaps up to 2r wide, fill what is
 * enclosed, and give the shape back its size. Used so a line icon with a cut for a badge and the
 * filled icon that has the same cut can be compared as outlines.
 */
export function closedSilhouette(m, r = 1.6) {
  const D = dilate(m, r);
  const F = silhouette(D);
  return erode(F, r);
}


// ── corners, with where they are ─────────────────────────────────────────
//
// figma.mjs `roundings()` says WHAT roundings a path has (radius, turn) but not WHERE, which a pair
// comparison needs: to say that this filled corner is that stroked corner pushed out by half the
// stroke, the two have to be matched by place. `cornerRuns` re-reads the same thing — a run of curved
// pieces between two straight edges is ONE corner — and keeps the geometry:
//   A, B   where the straight edges end and the curve starts / stops
//   dA, dB unit directions of the incoming and outgoing straight edges
//   V      the virtual sharp corner (the two edges extended until they meet)
//   turn   how far the direction changes, degrees
//   sign   +1 / -1: which way it turns (the centre of curvature lies on the side `sign * (-dA.y, dA.x)`)
//   r      the radius of the circle tangent to both edges at the tangent lengths (tangent length / tan(turn/2));
//          for a smoothed (squircle-style) corner this is the circle it stands in for, and `smooth` says it is not that circle
// A corner that is not between two straight edges (a ring, a free curve) is not a corner here.

const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len2 = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => { const l = len2(a); return l > 0 ? [a[0] / l, a[1] / l] : [0, 0]; };
const crossv = (a, b) => a[0] * b[1] - a[1] * b[0];
const dotv = (a, b) => a[0] * b[0] + a[1] * b[1];

function segTurn(s) {
  // how much a piece bends, degrees (0 for a line)
  if (s.t === 'L') return 0;
  let t0 = sub2(s.c1, s.a);
  if (len2(t0) < 1e-6 && s.t === 'C') t0 = sub2(s.c2, s.a);
  let t1 = s.t === 'C' ? sub2(s.b, s.c2) : sub2(s.b, s.c1);
  if (len2(t1) < 1e-6 && s.t === 'C') t1 = sub2(s.b, s.c1);
  if (len2(t0) < 1e-9 || len2(t1) < 1e-9) return 0;
  const c = Math.max(-1, Math.min(1, dotv(t0, t1) / (len2(t0) * len2(t1))));
  return (Math.acos(c) * 180) / Math.PI;
}

export function cornerRuns(cmds) {
  const segs = segmentsOf(cmds);
  const bySp = new Map();
  for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
  const out = [];
  for (const [sp, list] of bySp) {
    const closed = list[0].closed;
    const bent = (s) => s.t !== 'L' && segTurn(s) >= 1;
    const straight = (s) => s && !bent(s) && len2(sub2(s.b, s.a)) > 1e-6;
    let order = list;
    if (closed) {
      const z = list.findIndex((s) => straight(s));
      if (z < 0) continue;
      order = list.slice(z + 1).concat(list.slice(0, z + 1));
    }
    let i = 0;
    while (i < order.length) {
      if (!bent(order[i])) { i++; continue; }
      let j = i;
      while (j + 1 < order.length && bent(order[j + 1])) j++;
      const prev = i > 0 ? order[i - 1] : closed ? order[order.length - 1] : null;
      const next = j + 1 < order.length ? order[j + 1] : closed ? order[0] : null;
      if (straight(prev) && straight(next)) {
        const A = order[i].a, B = order[j].b;
        const dA = unit(sub2(prev.b, prev.a)), dB = unit(sub2(next.b, next.a));
        const turn = (Math.acos(Math.max(-1, Math.min(1, dotv(dA, dB)))) * 180) / Math.PI;
        if (turn >= 20) {
          const den = crossv(dA, dB), AB = sub2(B, A);
          const tA = den ? crossv(AB, dB) / den : NaN, tB = den ? -crossv(AB, dA) / den : NaN;
          if (turn >= 170) {
            out.push({ kind: 'cap', sp, closed, A, B, dA, dB, turn, sign: 0, r: len2(AB) / 2, V: null, tA: NaN, tB: NaN, smooth: false, pieces: j - i + 1 });
          } else if (tA > 1e-6 && tB > 1e-6) {
            const half = Math.tan((turn * Math.PI) / 360);
            const r = (tA + tB) / 2 / half;
            const V = [A[0] + dA[0] * tA, A[1] + dA[1] * tA];
            out.push({ kind: 'corner', sp, closed, A, B, dA, dB, turn, sign: Math.sign(den), r, V, tA, tB, smooth: Math.abs(tA - tB) > 0.03 * Math.max(tA, tB) + 0.01, pieces: j - i + 1 });
          }
        }
      }
      i = j + 1;
    }
  }
  return out;
}

/** Inward unit normal of a corner at its first straight edge (toward the centre of curvature). */
export const innerNormal = (c) => [c.sign * -c.dA[1], c.sign * c.dA[0]];

/**
 * Where the virtual corner V goes when the contour is pushed OUT by `o` (negative: pulled in): each straight edge moves
 * by `o` along its outward normal and the new corner is where they meet. For a rounded corner the tangent points move by
 * `o` too, so the tangent lengths grow by `o * tan(turn/2)` each and the equivalent radius becomes `r + o`.
 */
export function offsetVertex(c, o) {
  const nA = innerNormal(c).map((x) => -x);
  const nB = [c.sign * -c.dB[1] * -1, c.sign * c.dB[0] * -1];
  const den = 1 + dotv(nA, nB);
  return [c.V[0] + (o * (nA[0] + nB[0])) / den, c.V[1] + (o * (nA[1] + nB[1])) / den];
}

// ── node-level corner rounding ────────────────────────────────────────────
//
// FINDING THAT SHAPES CENTRAL'S ANALYSIS (measured 2026-10-04): a Figma VECTOR node can carry its
// rounding as a PROPERTY (`cornerRadius`) while `vectorPaths` — and so every `d` in a record —
// still describes the SHARP polyline. `chevron-triangle-down-medium` reads
// `M 7 10 L 17 10 L 12 16 L 7 10 Z` at radius 0, 1, 2 and 3 alike, with cornerRadius 0, 0.5, 0.75, 1
// and a render box that shrinks 6.0 -> 6.56 -> 6.85 -> 7.13 on the left. So `d` alone under-reports the
// radius axis. `roundSharp` puts the rounding back: every vertex between two straight pieces gets a
// fillet of radius `R`, cut back so the tangent length is at most `cap` of the shorter neighbour
// (Figma limits a radius to what the edge can carry; `cap` is checked against the render bounds, not
// assumed). A vertex that already has a curve on either side is left alone, because the rounding
// property only acts on sharp vertices.

function splitSubs(cmds) {
  const subs = [];
  let sp = null, cur = null;
  for (const { c, p } of cmds) {
    if (c === 'M') { sp = { verts: [[p[0], p[1]]], segs: [], closed: false }; subs.push(sp); cur = [p[0], p[1]]; }
    else if (!sp) continue;
    else if (c === 'L') { sp.segs.push({ t: 'L', to: [p[0], p[1]] }); sp.verts.push([p[0], p[1]]); cur = [p[0], p[1]]; }
    else if (c === 'C') { sp.segs.push({ t: 'C', c1: [p[0], p[1]], c2: [p[2], p[3]], to: [p[4], p[5]] }); sp.verts.push([p[4], p[5]]); cur = [p[4], p[5]]; }
    else if (c === 'Q') { sp.segs.push({ t: 'Q', c1: [p[0], p[1]], to: [p[2], p[3]] }); sp.verts.push([p[2], p[3]]); cur = [p[2], p[3]]; }
    else if (c === 'Z') { sp.closed = true; }
  }
  return subs;
}

export function roundSharp(cmds, R, { cap = 0.5 } = {}) {
  if (!(R > 0)) return cmds;
  const subs = splitSubs(cmds);
  const out = [];
  for (const sp of subs) {
    const n0 = sp.verts.length;
    const segs = sp.segs.slice();
    let verts = sp.verts.slice();
    // a closed ring written with an explicit return to the start: the last piece ends where it began
    let ring = sp.closed;
    if (ring && verts.length > 1) {
      const a = verts[0], b = verts[verts.length - 1];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) verts = verts.slice(0, -1);   // vertices V0..Vn-1; segment i goes V_i -> V_{i+1 mod n}
      else segs.push({ t: 'L', to: a });                                                // implicit closing line
    }
    const n = verts.length;
    const segFrom = (i) => segs[i];   // segment i leaves vertex i (ring) -- for open paths segs[i] leaves verts[i]
    // direction helpers
    const isL = (i) => segs[((i % segs.length) + segs.length) % segs.length].t === 'L';
    const len = (i) => { const a = verts[((i % n) + n) % n], b = verts[(((i + 1) % n) + n) % n]; return Math.hypot(b[0] - a[0], b[1] - a[1]); };
    const unitv = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return l ? [(b[0] - a[0]) / l, (b[1] - a[1]) / l] : [0, 0]; };
    const fillets = new Map();   // vertex index -> {P1, P2, C1, C2}
    const vtx = (i) => verts[((i % n) + n) % n];
    for (let i = ring ? 0 : 1; i < (ring ? n : n - 1); i++) {
      if (!(isL(i - 1) && isL(i))) continue;
      const u1 = unitv(vtx(i - 1), vtx(i)), u2 = unitv(vtx(i), vtx(i + 1));
      const cos = Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]));
      const turn = Math.acos(cos);
      if (turn < (1 * Math.PI) / 180 || turn > (179 * Math.PI) / 180) continue;
      const tFull = R * Math.tan(turn / 2);
      const t = Math.min(tFull, cap * Math.min(len(i - 1), len(i)));
      const Re = t / Math.tan(turn / 2);
      const k = (4 / 3) * Math.tan(turn / 4) * Re;
      const P1 = [vtx(i)[0] - u1[0] * t, vtx(i)[1] - u1[1] * t], P2 = [vtx(i)[0] + u2[0] * t, vtx(i)[1] + u2[1] * t];
      fillets.set(i, { P1, P2, C1: [P1[0] + u1[0] * k, P1[1] + u1[1] * k], C2: [P2[0] - u2[0] * k, P2[1] - u2[1] * k] });
    }
    // emit
    const start = ring && fillets.has(0) ? fillets.get(0).P2 : verts[0];
    out.push({ c: 'M', p: [start[0], start[1]] });
    const nseg = ring ? n : segs.length;
    for (let i = 0; i < nseg; i++) {
      const seg = segs[i];
      const endIdx = (i + 1) % (ring ? n : n);
      const fEnd = fillets.get(ring ? (i + 1) % n : i + 1);
      if (seg.t === 'L') {
        const to = fEnd ? fEnd.P1 : seg.to;
        if (!(ring && i === nseg - 1 && !fEnd && Math.hypot(to[0] - start[0], to[1] - start[1]) < 1e-9)) out.push({ c: 'L', p: [to[0], to[1]] });
        if (fEnd) out.push({ c: 'C', p: [...fEnd.C1, ...fEnd.C2, ...fEnd.P2] });
      } else if (seg.t === 'C') {
        out.push({ c: 'C', p: [...seg.c1, ...seg.c2, ...seg.to] });
      } else {
        out.push({ c: 'Q', p: [...seg.c1, ...seg.to] });
      }
    }
    if (sp.closed) out.push({ c: 'Z', p: [] });
  }
  return out;
}

/** A path record's commands with its node-level corner radius put back (VECTOR / STAR / POLYGON nodes only). */
export function effectiveCmds(p, opts = {}) {
  const cmds = parsePath(p.d);
  const R = typeof p.cornerRadiusProp === 'number' ? p.cornerRadiusProp : 0;
  const t = p.node && p.node.type;
  if (R > 0 && (t === 'VECTOR' || t === 'STAR' || t === 'POLYGON')) return roundSharp(cmds, R, opts);
  return cmds;
}

// ── per-drawing features shared by the Central analyses ───────────────────

/** The box to believe for a record, and how far to believe it: 'verified' (my box with rounding put back agrees with Figma's render bounds to 0.01), 'rotated' (render bounds are unreliable on rotated or flipped nodes; mine stands alone), 'disputed' (the two disagree), or 'none'. */
export function boxOf(rec) {
  let a;
  try { a = analyticBox(rec, { rounded: true, cap: 0.5 }); } catch { a = null; }
  const b = renderBox(rec);
  const flags = rec.meta && rec.meta.flags ? rec.meta.flags : {};
  if (!a) return { box: null, status: 'none', a, b };
  const A = { x0: a.x0, y0: a.y0, x1: a.x1, y1: a.y1 };
  if (flags.rotated) return { box: A, status: 'rotated', a, b };
  if (!b) return { box: A, status: 'none', a, b };
  const m = maxAbs(sideDiff(A, b));
  if (a.exact && m <= 0.01) return { box: A, status: 'verified', a, b };
  return { box: A, status: 'disputed', a, b, gap: m };
}

/** Bounding box of the centrelines (stroke paths) or the shapes (fill paths) with node rounding put back. */
export function skeletonBox(rec) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of rec.paths) {
    if (p.paint === 'none') continue;
    const b = bboxOfPath(effectiveCmds(p, { cap: 0.5 }));
    if (!b) continue;
    x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1);
  }
  return Number.isFinite(x0) ? { x0, y0, x1, y1 } : null;
}

/** Straight pieces of a record (L only) in order: {path, idx, a, b, len, angle} with angle = acute angle to the horizontal, 0..90. */
export function straightPieces(rec) {
  const out = [];
  rec.paths.forEach((p, pi) => {
    const cmds = effectiveCmds(p, { cap: 0.5 });
    let cur = null, start = null, idx = 0;
    for (const { c, p: q } of cmds) {
      if (c === 'M') { cur = [q[0], q[1]]; start = cur; }
      else if (c === 'L') {
        const b = [q[0], q[1]];
        const dx = b[0] - cur[0], dy = b[1] - cur[1], len = Math.hypot(dx, dy);
        if (len > 1e-6) { let a = (Math.atan2(dy, dx) * 180) / Math.PI; a = ((a % 180) + 180) % 180; out.push({ path: pi, idx, a: cur, b, len, angle: Math.min(a, 180 - a) }); }
        idx++; cur = b;
      } else if (c === 'C') { idx++; cur = [q[4], q[5]]; }
      else if (c === 'Q') { idx++; cur = [q[2], q[3]]; }
      else if (c === 'Z') { if (cur && start && Math.hypot(cur[0] - start[0], cur[1] - start[1]) > 1e-6) { const dx = start[0] - cur[0], dy = start[1] - cur[1]; let a = (Math.atan2(dy, dx) * 180) / Math.PI; a = ((a % 180) + 180) % 180; out.push({ path: pi, idx, a: cur, b: start, len: Math.hypot(dx, dy), angle: Math.min(a, 180 - a), closing: true }); idx++; } cur = start; }
    }
  });
  return out;
}

/** Shape signature of a record: per path, the command letters. Two drawings with the same signature have the same topology. */
export const topology = (rec) => rec.paths.map((p) => effectiveCmds(p, { cap: 0.5 }).map((c) => c.c).join('')).join('|');

// ── what holds each side of the ink box ──────────────────────────────────

const _sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const _len = (v) => Math.hypot(v[0], v[1]);
const _fromAxis = (v) => { const a = (Math.atan2(v[1], v[0]) * 180) / Math.PI; const m = ((a % 90) + 90) % 90; return Math.min(m, 90 - m); };

/**
 * True when "centreline point +- half the weight" is the ink for every stroke in the record: CENTER-aligned, round joins
 * wherever the path bends, round caps wherever it has an open end. A closed path has no ends, so its cap setting is
 * moot (Central leaves `NONE` on many closed shapes); a path of one straight piece has no bend, so its join is moot.
 */
export function allRoundCentre(rec) {
  for (const p of rec.paths) {
    if (!(p.paint === 'stroke' || p.paint === 'both')) continue;
    const st = p.stroke;
    if (!st || st.align !== 'CENTER') return false;
    const segs = segmentsOf(parsePath(p.d));
    const bySp = new Map();
    for (const sg of segs) { if (!bySp.has(sg.sp)) bySp.set(sg.sp, []); bySp.get(sg.sp).push(sg); }
    let anyOpen = false, anyBend = false;
    for (const list of bySp.values()) {
      if (!list[0].closed) anyOpen = true;
      if (list.length > 1 || list[0].closed) anyBend = true;
    }
    if (anyOpen && st.cap !== 'ROUND') return false;
    if (anyBend && st.join !== 'ROUND') return false;
  }
  return true;
}

/**
 * For each side of `box`, the kinds of element whose ink reaches it (within `tol`): 'capDiag' / 'capAxis' (the end of an
 * open stroke, running slanted / square-on), 'dot' (a zero-length stroke), 'closed' (a point of a closed stroked subpath),
 * 'open' (an interior point of an open stroke), 'fill' (a filled path). Only meaningful when allRoundCentre(rec).
 */
export function sideKinds(rec, box, tol = 0.01) {
  const sides = { left: new Set(), top: new Set(), right: new Set(), bottom: new Set() };
  for (const p of rec.paths) {
    if (p.paint === 'none') continue;
    const cmds = effectiveCmds(p, { cap: 0.5 });
    if (p.paint === 'fill' || p.paint === 'both') {
      const b = bboxOfPath(cmds);
      if (b) {
        if (Math.abs(b.x0 - box.x0) < tol) sides.left.add('fill');
        if (Math.abs(b.x1 - box.x1) < tol) sides.right.add('fill');
        if (Math.abs(b.y0 - box.y0) < tol) sides.top.add('fill');
        if (Math.abs(b.y1 - box.y1) < tol) sides.bottom.add('fill');
      }
    }
    if (!(p.paint === 'stroke' || p.paint === 'both') || !p.stroke) continue;
    const h = p.stroke.weight / 2;
    const subs = flatten(cmds, 40);
    const segs = segmentsOf(cmds);
    const bySp = new Map();
    for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
    const startTan = (s) => { if (s.t === 'L') return _sub(s.b, s.a); const c1 = _sub(s.c1, s.a); if (_len(c1) > 1e-6) return c1; if (s.t === 'C') { const c2 = _sub(s.c2, s.a); if (_len(c2) > 1e-6) return c2; } return _sub(s.b, s.a); };
    const endTan = (s) => { if (s.t === 'L') return _sub(s.b, s.a); if (s.t === 'C') { const t = _sub(s.b, s.c2); if (_len(t) > 1e-6) return t; const t2 = _sub(s.b, s.c1); if (_len(t2) > 1e-6) return t2; return _sub(s.b, s.a); } const t = _sub(s.b, s.c1); return _len(t) > 1e-6 ? t : _sub(s.b, s.a); };
    subs.forEach((sp, si) => {
      const list = bySp.get(si) || [];
      let endKinds = [null, null];
      if (!sp.closed) {
        const total = list.reduce((a, s) => a + _len(_sub(s.b, s.a)), 0);
        if (!list.length || total < 1e-6) endKinds = ['dot', 'dot'];
        else endKinds = [_fromAxis(startTan(list[0])) > 1 ? 'capDiag' : 'capAxis', _fromAxis(endTan(list[list.length - 1])) > 1 ? 'capDiag' : 'capAxis'];
      }
      const n = sp.pts.length;
      sp.pts.forEach((q, i) => {
        const kind = sp.closed ? 'closed' : (i === 0 || i === n - 1) ? endKinds[i === 0 ? 0 : 1] : 'open';
        if (Math.abs(q[0] - h - box.x0) < tol) sides.left.add(kind);
        if (Math.abs(q[0] + h - box.x1) < tol) sides.right.add(kind);
        if (Math.abs(q[1] - h - box.y0) < tol) sides.top.add(kind);
        if (Math.abs(q[1] + h - box.y1) < tol) sides.bottom.add(kind);
      });
    });
  }
  return sides;
}
/** One label per side: an open-end cap wins, then a closed contour, then an open stroke's interior, then a fill. */
export function sideLabel(set) {
  for (const k of ['capDiag', 'capAxis', 'dot', 'closed', 'open', 'fill']) if (set.has(k)) return k;
  return 'none';
}

/** Sharp vertices: two straight pieces meeting with a turn of at least `minTurn` degrees, no curve between. Same fields as a corner run, with r = 0. */
export function sharpVertices(cmds, minTurn = 20) {
  const segs = segmentsOf(cmds);
  const bySp = new Map();
  for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
  const out = [];
  for (const [sp, list] of bySp) {
    const closed = list[0].closed;
    const n = list.length;
    const lim = closed ? n : n - 1;
    for (let i = 0; i < lim; i++) {
      const a = list[i], b = list[(i + 1) % n];
      if (a.t !== 'L' || b.t !== 'L') continue;
      const dA = unit(sub2(a.b, a.a)), dB = unit(sub2(b.b, b.a));
      if (!len2(dA) || !len2(dB)) continue;
      const turn = (Math.acos(Math.max(-1, Math.min(1, dotv(dA, dB)))) * 180) / Math.PI;
      if (turn < minTurn || turn > 175) continue;
      out.push({ kind: 'sharp', sp, closed, A: a.b, B: a.b, dA, dB, turn, sign: Math.sign(crossv(dA, dB)), r: 0, V: a.b, tA: 0, tB: 0, smooth: false, pieces: 0 });
    }
  }
  return out;
}

/** Every corner of a record's paths, rounded or sharp, tagged with the path's stroke (for the offset it implies). */
export function cornersOfRecord(rec, { sharp = true } = {}) {
  const out = [];
  rec.paths.forEach((p, pi) => {
    if (p.paint === 'none') return;
    const cmds = effectiveCmds(p, { cap: 0.5 });
    // a path whose cornerRadius is per-vertex ('mixed') may be rounded in places this model cannot see: its sharp vertices are not trusted
    const trustSharp = sharp && p.cornerRadiusProp !== 'mixed';
    const list = [...cornerRuns(cmds).filter((c) => c.kind === 'corner'), ...(trustSharp ? sharpVertices(cmds) : [])];
    const st = p.stroke && (p.paint === 'stroke' || p.paint === 'both') ? p.stroke : null;
    for (const c of list) out.push({ ...c, path: pi, paint: p.paint, stroke: st });
  });
  return out;
}

/**
 * For each side of the SKELETON (centreline / shape) box: is the extreme held by a flat run square-on to the side ('flat',
 * an edge of a rectangle, a straight end) or by a single point ('tip': a vertex, a ring's extreme, a bend's apex)?
 * A flat run is a stretch of the path at the extreme coordinate (within 0.002) at least `minRun` long.
 */
export function extremeKinds(rec, sk, minRun = 0.5) {
  const pts = [], apexes = [];
  for (const p of rec.paths) {
    if (p.paint === 'none') continue;
    const cmds = effectiveCmds(p, { cap: 0.5 });
    for (const sp of flatten(cmds, 60)) for (const q of sp.pts) pts.push(q);
    for (const v of sharpVertices(cmds)) apexes.push(v.V);
  }
  const out = {};
  const probe = (name, coord, along, ext) => {
    const near = pts.filter((q) => Math.abs(q[coord] - ext) < 0.002);
    if (!near.length) return (out[name] = 'none');
    const vals = near.map((q) => q[along]);
    if (Math.max(...vals) - Math.min(...vals) >= minRun) return (out[name] = 'flat');
    // a single point: a sharp vertex ('apex') or something smooth (a ring's extreme, a bend that is already an arc)
    out[name] = apexes.some((v) => Math.abs(v[coord] - ext) < 0.002) ? 'apex' : 'smooth';
  };
  probe('left', 0, 1, sk.x0); probe('right', 0, 1, sk.x1); probe('top', 1, 0, sk.y0); probe('bottom', 1, 0, sk.y1);
  return out;
}

/** Open ends of every stroked subpath of a record (node rounding put back): {ends:[{point,tan,dev,kind}], closed, dots}. kind = 'diag' when the end runs more than 1 degree off horizontal/vertical. */
export function endsCensus(rec) {
  const ends = []; let closed = 0, dots = 0;
  const startTan = (s) => { if (s.t === 'L') return _sub(s.b, s.a); const c1 = _sub(s.c1, s.a); if (_len(c1) > 1e-6) return c1; if (s.t === 'C') { const c2 = _sub(s.c2, s.a); if (_len(c2) > 1e-6) return c2; } return _sub(s.b, s.a); };
  const endTan = (s) => { if (s.t === 'L') return _sub(s.b, s.a); if (s.t === 'C') { const t = _sub(s.b, s.c2); if (_len(t) > 1e-6) return t; const t2 = _sub(s.b, s.c1); if (_len(t2) > 1e-6) return t2; return _sub(s.b, s.a); } const t = _sub(s.b, s.c1); return _len(t) > 1e-6 ? t : _sub(s.b, s.a); };
  for (const p of rec.paths) {
    if (!(p.paint === 'stroke' || p.paint === 'both')) continue;
    const segs = segmentsOf(effectiveCmds(p, { cap: 0.5 }));
    const bySp = new Map();
    for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
    for (const list of bySp.values()) {
      if (list[0].closed) { closed++; continue; }
      if (list.reduce((a, s) => a + _len(_sub(s.b, s.a)), 0) < 1e-6) { dots++; continue; }
      for (const [pt, tan] of [[list[0].a, startTan(list[0])], [list[list.length - 1].b, endTan(list[list.length - 1])]]) {
        if (_len(tan) < 1e-9) continue;
        const dev = _fromAxis(tan);
        ends.push({ point: pt, tan, dev, kind: dev > 1 ? 'diag' : 'axis' });
      }
    }
  }
  return { ends, closed, dots };
}
