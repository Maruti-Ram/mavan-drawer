// A pure-JS rasteriser for the audit instruments. AUDIT ONLY — nothing in
// `tools/lint.mjs`, `tools/build.mjs` or the lab imports this, and it must stay
// that way: it is slow by design (it trades speed for a number you can check by
// hand) and it answers questions the shipping pipeline has no opinion about.
//
// WHY IT EXISTS. Two of the set's judging axes have no instrument. We measure the
// *box* a drawing fills and never how much ink is inside it, so "does every icon
// read with the same darkness in a 16px row" is unanswerable. And lint checks the
// coordinate literals against a grid, never where an ink EDGE lands on a real
// pixel or what grey that produces — which is what the whole 16 master rests on.
//
// NO DEPENDENCIES. The set never needed one: a census of every `d` in
// `src/icons/` (2,910 files, commit 5933041) shows only `M L H V A Z` and the
// relative `l h v` — 18,133 arcs and ZERO Bezier curves, and zero `<rect>`,
// `<circle>`, `<line>`, `<g>`. So a rasteriser for this set needs exactly two
// primitives: a polyline and an axis-aligned elliptical arc. Both are exact.
// `assertFlattenable` refuses a `C`/`S`/`Q`/`T` rather than approximating one,
// because a conservative control-point hull (which is what `geometry.mjs`'s
// `samplePath` falls back to) would be silently wrong here.
//
// HOW COVERAGE IS DEFINED. One rule, and every cap and join falls out of it:
//
//   a point is INKED by a stroked path  iff  its distance to the path's
//   centreline is <= half the stroke width.
//
// That IS `stroke-linecap="round" stroke-linejoin="round"`, which every file in
// the set declares on its root — so this is not an approximation of the set's
// cap style, it is a restatement of it. A filled area path inks a point when the
// even-odd winding of all its subpaths is odd, which is what `fill-rule="evenodd"`
// means and what every area path in the set declares. Nothing else paints.
//
// HOW A NUMBER IS TAKEN. Supersampling, at a rate carried in and reported back
// with every result, so no figure from here is ever quotable without its rate.
// Sample points sit at `(k + 0.5) / rate` in ABSOLUTE canvas units, not relative
// to the cell, for one reason: the set draws on quarters (24, 20) and eighths
// (16), and a half-offset absolute grid with `rate` a power of two >= 8 can never
// land a sample exactly ON an eighth-grid ink edge, where "inside" is a coin flip.
//
// Cells whose interior no boundary crosses are counted, not sampled — sound in
// both directions (see `classify`) and worth 5-20x on a ring or a filled disc,
// which is most of this set.
//
// ONE-SIDED ERROR, STATED. Flattening an arc to chords puts the polyline just
// INSIDE the true curve, so distance-to-polyline >= distance-to-arc and the inked
// region comes out a hair small. The size of it is bounded: at the default
// tolerance the deviation is <= 1e-4 units, so the area loss is at most
// (ink perimeter) x 1e-4 — under 0.01 px^2 for a 16 master. It is reported as
// `flatten` on every result and it never goes the other way.

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { parsePath } from '../geometry.mjs';

export const DEFAULT_RATE = 16;      // subsamples per axis, per cell
export const DEFAULT_FLATTEN = 1e-4; // max chordal deviation when an arc becomes chords, in canvas units
const CELL = 1;                      // spatial-index / classify cell, in canvas units

// ── reading a file ─────────────────────────────────────────────────────────

const NUM = '([-+]?[0-9]*\\.?[0-9]+)';

/**
 * One drawing, as the rasteriser needs it. Deliberately strict: the set is
 * uniform (verified at the pin), so anything unexpected is a parse bug or a file
 * that has changed shape, and either way a silent misparse would produce a
 * plausible wrong number — the one failure mode doc 08 §10.4 warns about.
 */
export function iconFromText(text, label = '<text>') {
  const root = text.match(/<svg\b[^>]*>/);
  if (!root) throw new Error(`${label}: no <svg> root`);
  const vb = root[0].match(new RegExp(`viewBox="0 0 ${NUM} ${NUM}"`));
  if (!vb) throw new Error(`${label}: no "0 0 N N" viewBox`);
  const canvas = Number(vb[1]);
  if (Number(vb[2]) !== canvas) throw new Error(`${label}: viewBox is not square`);

  const rootWidth = root[0].match(/stroke-width="([^"]+)"/);
  const rootStroke = rootWidth ? Number(rootWidth[1]) : null;
  const rootPaint = (root[0].match(/\bstroke="([^"]+)"/) || [, 'none'])[1];
  const rootFill = (root[0].match(/\bfill="([^"]+)"/) || [, 'black'])[1];

  const bad = text.replace(/<svg\b[^>]*>|<\/svg>|<!--[\s\S]*?-->|<\?[^>]*\?>/g, '')
    .match(/<(?!path\b)[a-zA-Z][^>]*>/);
  if (bad) throw new Error(`${label}: unexpected element ${bad[0].slice(0, 40)}`);

  const paths = [];
  for (const tag of text.matchAll(/<path\b([^>]*)\/>/g)) {
    const attrs = tag[1];
    const d = (attrs.match(/\bd="([^"]+)"/) || [])[1];
    if (!d) throw new Error(`${label}: <path> with no d`);
    const fill = (attrs.match(/\bfill="([^"]+)"/) || [, rootFill])[1];
    const stroke = (attrs.match(/\bstroke="([^"]+)"/) || [, rootPaint])[1];
    const w = attrs.match(/\bstroke-width="([^"]+)"/);
    const rule = (attrs.match(/\bfill-rule="([^"]+)"/) || [, 'nonzero'])[1];
    if (fill !== 'none' && rule !== 'evenodd') {
      throw new Error(`${label}: filled path is fill-rule="${rule}"; this set is evenodd only`);
    }
    if (fill !== 'none') paths.push({ d, kind: 'area' });
    if (stroke !== 'none') {
      const weight = w ? Number(w[1]) : rootStroke;
      if (!(weight > 0)) throw new Error(`${label}: stroked path with no usable stroke-width`);
      paths.push({ d, kind: 'stroke', weight });
    }
  }
  if (!paths.length) throw new Error(`${label}: nothing paints`);
  return { label, canvas, rootStroke, paths };
}

/** `src/icons/<master>/<name>.svg` -> an icon, with its master and name filled in. */
export function readIcon(file) {
  const icon = iconFromText(readFileSync(file, 'utf8'), file);
  const m = file.match(/icons\/(\d+)\/([^/]+)\.svg$/);
  return {
    ...icon,
    file,
    name: m ? m[2] : basename(file, '.svg'),
    master: m ? Number(m[1]) : icon.canvas,
    filled: /-filled$/.test(m ? m[2] : basename(file, '.svg')),
  };
}

// ── flattening ─────────────────────────────────────────────────────────────

/** Refuses what this rasteriser cannot do exactly, rather than guessing at it. */
export function assertFlattenable(d, label = '') {
  const curve = d.match(/[CcSsQqTt]/);
  if (curve) throw new Error(`${label}: Bezier command "${curve[0]}" — raster.mjs is exact for M L H V A Z only`);
}

/**
 * `d` -> its subpaths as polylines. `closed` records whether the subpath shut,
 * because that is what decides whether the stroke gets two round caps or none.
 * Arcs use the SVG spec's endpoint->centre parameterisation (F.6.5), the same
 * maths as `geometry.mjs`'s private `sampleArc` — a test asserts the two agree.
 * The step is chosen from `tol`, the largest chordal deviation allowed, using
 * the arc's worst-case radius of curvature (max(rx,ry)^2 / min(rx,ry)).
 */
export function flatten(d, { tol = DEFAULT_FLATTEN, label = '' } = {}) {
  assertFlattenable(d, label);
  const subs = [];
  let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  const open = (x, y) => { cur = { pts: [[x, y]], closed: false }; subs.push(cur); };
  const to = (x, y) => { if (!cur) open(cx, cy); cur.pts.push([x, y]); };

  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase();
    const up = cmd.toUpperCase();
    if (up === 'Z') { if (cur) cur.closed = true; cx = sx; cy = sy; cur = null; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    if (!step) throw new Error(`${label}: unsupported command "${cmd}"`);
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : a;
        if (k === 0) { sx = x; sy = y; open(x, y); } else to(x, y);
        cx = x; cy = y;
      } else if (up === 'L') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : a;
        to(x, y); cx = x; cy = y;
      } else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; to(x, cy); cx = x; }
      else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; to(cx, y); cy = y; }
      else {
        const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]];
        for (const [x, y] of arcPoints(cx, cy, a[0], a[1], a[2], a[3], a[4], ex, ey, tol)) to(x, y);
        cx = ex; cy = ey;
      }
    }
  }
  return subs.filter((s) => s.pts.length > 1 || s.closed);
}

/** SVG F.6.5 endpoint -> centre, then points 1..n along the sweep (the start is already placed). */
function arcPoints(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2, tol) {
  if (!rx || !ry) return [[x2, y2]];
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
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;

  const ang = (ux, uy, vx, vy) => {
    const dd = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    const t = Math.acos(Math.min(1, Math.max(-1, dd)));
    return ux * vy - uy * vx < 0 ? -t : t;
  };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  const t1 = ang(1, 0, ux, uy);
  let dt = ang(ux, uy, vx, vy);
  if (!fS && dt > 0) dt -= 2 * Math.PI;
  if (fS && dt < 0) dt += 2 * Math.PI;

  // worst-case radius of curvature of an axis-aligned ellipse, then the step that
  // keeps the chord within `tol` of the curve: tol ~= r * step^2 / 8
  const rWorst = Math.max(rx, ry) ** 2 / Math.max(1e-9, Math.min(rx, ry));
  const stepRad = Math.sqrt((8 * tol) / rWorst);
  const n = Math.max(2, Math.ceil(Math.abs(dt) / stepRad));
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = t1 + (dt * i) / n;
    const px = Math.cos(t) * rx, py = Math.sin(t) * ry;
    out.push([cos * px - sin * py + cx, sin * px + cos * py + cy]);
  }
  return out;
}

// ── the inked region ───────────────────────────────────────────────────────

/**
 * An icon (or a hand-built path list) -> a queryable inked region.
 *
 * `strokes` become a flat segment list with a half-width, indexed into a uniform
 * grid by each segment's box grown by that half-width, so a point query only ever
 * looks at segments that could reach it.
 *
 * `areas` keep ALL their subpaths' edges in one list per `d`, bucketed by y.
 * Even-odd fill of a multi-subpath path is simply the parity of the crossings of
 * a ray, so one parity count over one edge list is the whole rule — no
 * per-ring point-in-polygon, and no chance of getting the hole nesting wrong.
 */
export function region(paths, { tol = DEFAULT_FLATTEN, cell = CELL, label = '' } = {}) {
  const segs = [];               // [ax, ay, bx, by, h, h*h]
  const areas = [];              // [{ edges: [ax,ay,bx,by], buckets }]
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const see = (x, y, pad) => {
    if (x - pad < x0) x0 = x - pad; if (y - pad < y0) y0 = y - pad;
    if (x + pad > x1) x1 = x + pad; if (y + pad > y1) y1 = y + pad;
  };

  for (const p of paths) {
    const subs = flatten(p.d, { tol, label });
    if (p.kind === 'stroke') {
      const h = p.weight / 2;
      for (const { pts, closed } of subs) {
        const n = pts.length;
        if (n === 1) { segs.push([pts[0][0], pts[0][1], pts[0][0], pts[0][1], h, h * h]); see(pts[0][0], pts[0][1], h); continue; }
        for (let i = 0; i + 1 < n; i++) segs.push([pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], h, h * h]);
        if (closed && (pts[0][0] !== pts[n - 1][0] || pts[0][1] !== pts[n - 1][1])) {
          segs.push([pts[n - 1][0], pts[n - 1][1], pts[0][0], pts[0][1], h, h * h]);
        }
        for (const [x, y] of pts) see(x, y, h);
      }
    } else {
      const edges = [];
      for (const { pts } of subs) {
        const n = pts.length;
        for (let i = 0; i < n; i++) {
          const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n];
          if (ay !== by) edges.push([ax, ay, bx, by]);   // horizontal edges never cross a horizontal ray
          see(ax, ay, 0);
        }
      }
      if (edges.length) areas.push({ edges });
    }
  }
  if (!segs.length && !areas.length) throw new Error(`${label}: empty region`);

  // uniform grid for the stroke segments
  const gx = Math.floor(x0 / cell), gy = Math.floor(y0 / cell);
  const gw = Math.max(1, Math.ceil(x1 / cell) - gx + 1), gh = Math.max(1, Math.ceil(y1 / cell) - gy + 1);
  const grid = Array.from({ length: gw * gh }, () => []);
  for (let s = 0; s < segs.length; s++) {
    const [ax, ay, bx, by, h] = segs[s];
    const lo = Math.max(0, Math.floor((Math.min(ax, bx) - h) / cell) - gx);
    const hi = Math.min(gw - 1, Math.floor((Math.max(ax, bx) + h) / cell) - gx);
    const lv = Math.max(0, Math.floor((Math.min(ay, by) - h) / cell) - gy);
    const hv = Math.min(gh - 1, Math.floor((Math.max(ay, by) + h) / cell) - gy);
    for (let j = lv; j <= hv; j++) for (let i = lo; i <= hi; i++) grid[j * gw + i].push(s);
  }

  // y-buckets for each area's edges
  for (const a of areas) {
    a.buckets = Array.from({ length: gh }, () => []);
    for (let e = 0; e < a.edges.length; e++) {
      const [, ay, , by] = a.edges[e];
      const lv = Math.max(0, Math.floor(Math.min(ay, by) / cell) - gy);
      const hv = Math.min(gh - 1, Math.floor(Math.max(ay, by) / cell) - gy);
      for (let j = lv; j <= hv; j++) a.buckets[j].push(e);
    }
  }

  const segDist2 = (s, x, y) => {
    const [ax, ay, bx, by] = s;
    const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy;
    let t = L2 ? ((x - ax) * vx + (y - ay) * vy) / L2 : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const dx = x - (ax + t * vx), dy = y - (ay + t * vy);
    return dx * dx + dy * dy;
  };

  const inArea = (a, bj, x, y) => {
    let odd = false;
    for (const e of a.buckets[bj]) {
      const [ax, ay, bx, by] = a.edges[e];
      if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) odd = !odd;
    }
    return odd;
  };

  function covered(x, y) {
    const i = Math.floor(x / cell) - gx, j = Math.floor(y / cell) - gy;
    if (i < 0 || j < 0 || i >= gw || j >= gh) return false;
    for (const s of grid[j * gw + i]) if (segDist2(segs[s], x, y) <= segs[s][5]) return true;
    for (const a of areas) if (inArea(a, j, x, y)) return true;
    return false;
  }

  /**
   * Is the box [bx0,bx1] x [by0,by1] uniform, and if so which way?
   *   'empty' — no area edge crosses it, its centre is in no area, and no stroke
   *             segment comes within its own half-width of the box.
   *   'full'  — no area edge crosses it and its centre is inside an area. (Strokes
   *             only add ink, so a box already full stays full.)
   *   null    — a boundary runs through it; it has to be sampled.
   * Both answers are sound, which is what lets a census skip most of a ring.
   */
  function classify(bx0, by0, bx1, by1) {
    // Every cell and bucket the box OVERLAPS, not just the one under its centre.
    // A box can be larger than `cell` — a 24 master rendered at 16px gives a
    // 1.5-unit pixel — and looking only at the centre's cell would miss ink in
    // the next one and call a mixed box empty.
    const i0 = Math.floor(bx0 / cell) - gx, i1 = Math.floor(bx1 / cell) - gx;
    const j0 = Math.floor(by0 / cell) - gy, j1 = Math.floor(by1 / cell) - gy;
    if (i1 < 0 || j1 < 0 || i0 >= gw || j0 >= gh) return 'empty';
    const ia = Math.max(0, i0), ib = Math.min(gw - 1, i1);
    const ja = Math.max(0, j0), jb = Math.min(gh - 1, j1);

    for (const a of areas) {
      for (let j = ja; j <= jb; j++) {
        for (const e of a.buckets[j]) {
          const [ax, ay, bx, by] = a.edges[e];
          if (Math.min(ay, by) < by1 && Math.max(ay, by) > by0 && Math.min(ax, bx) < bx1 && Math.max(ax, bx) > bx0) return null;
        }
      }
    }
    const cxm = (bx0 + bx1) / 2, cym = (by0 + by1) / 2;
    const jc = Math.min(gh - 1, Math.max(0, Math.floor(cym / cell) - gy));
    for (const a of areas) if (inArea(a, jc, cxm, cym)) return 'full';

    for (let j = ja; j <= jb; j++) {
      for (let i = ia; i <= ib; i++) {
        for (const s of grid[j * gw + i]) {
          const [ax, ay, bx, by, h] = segs[s];
          if (Math.min(ax, bx) - h < bx1 && Math.max(ax, bx) + h > bx0
            && Math.min(ay, by) - h < by1 && Math.max(ay, by) + h > by0) return null;
        }
      }
    }
    return 'empty';
  }

  return {
    covered, classify, segs, areas, cell, tol,
    segCount: segs.length,
    areaCount: areas.length,
    bbox: { x0, y0, x1, y1 },
  };
}

/** An icon -> its region, with the icon's own canvas carried along. */
export function regionOf(icon, opts = {}) {
  return { ...region(icon.paths, { label: icon.label ?? icon.file, ...opts }), canvas: icon.canvas };
}

// ── taking a number ────────────────────────────────────────────────────────

/**
 * Coverage of one box, as a fraction in [0,1]. Sample points sit at
 * (k + 0.5) / rate in ABSOLUTE canvas units — see the header: it is what keeps a
 * sample off an eighth-grid ink edge.
 */
export function boxCoverage(reg, bx0, by0, bx1, by1, rate) {
  const u = reg.classify(bx0, by0, bx1, by1);
  if (u === 'empty') return 0;
  if (u === 'full') return 1;
  const step = 1 / rate;
  const i0 = Math.ceil(bx0 * rate - 0.5), i1 = Math.ceil(bx1 * rate - 0.5);
  const j0 = Math.ceil(by0 * rate - 0.5), j1 = Math.ceil(by1 * rate - 0.5);
  let hit = 0, n = 0;
  for (let j = j0; j < j1; j++) {
    const y = (j + 0.5) * step;
    for (let i = i0; i < i1; i++) { n++; if (reg.covered((i + 0.5) * step, y)) hit++; }
  }
  return n ? hit / n : 0;
}

/**
 * Render at `px` x `px` device pixels. Returns the coverage of every pixel in
 * [0,1], row-major, with the rate it was taken at. `px` need not equal the
 * canvas: `px = 16` on a 24 master is "the 24 drawing shown at 16px".
 */
export function rasterise(reg, { px, rate = DEFAULT_RATE, canvas = reg.canvas } = {}) {
  if (!canvas) throw new Error('rasterise: no canvas size');
  const unit = canvas / px;                       // canvas units per device pixel
  const cov = new Float64Array(px * px);
  for (let j = 0; j < px; j++) {
    for (let i = 0; i < px; i++) {
      cov[j * px + i] = boxCoverage(reg, i * unit, j * unit, (i + 1) * unit, (j + 1) * unit, rate / unit);
    }
  }
  return { cov, px, rate, canvas, unit, flatten: reg.tol };
}

/**
 * Inked area over the whole canvas, in that master's SQUARE UNITS. Walks the ink
 * box on `cell`-sized boxes so the uniform ones cost nothing, and samples the
 * rest at `rate` per unit.
 */
export function inkArea(reg, { rate = DEFAULT_RATE, cell = reg.cell } = {}) {
  const { x0, y0, x1, y1 } = reg.bbox;
  const a0 = Math.floor(x0 / cell) * cell, b0 = Math.floor(y0 / cell) * cell;
  const a1 = Math.ceil(x1 / cell) * cell, b1 = Math.ceil(y1 / cell) * cell;
  let area = 0, sampled = 0, uniform = 0;
  for (let by = b0; by < b1 - 1e-12; by += cell) {
    for (let bx = a0; bx < a1 - 1e-12; bx += cell) {
      const u = reg.classify(bx, by, bx + cell, by + cell);
      if (u === 'empty') { uniform++; continue; }
      if (u === 'full') { uniform++; area += cell * cell; continue; }
      sampled++;
      area += boxCoverage(reg, bx, by, bx + cell, by + cell, rate) * cell * cell;
    }
  }
  return { area, rate, cell, flatten: reg.tol, cells: { sampled, uniform } };
}

/** The ink box: where ink actually stops, including caps. Grid-walked, so exact to 1/rate. */
export function inkBox(reg, { rate = DEFAULT_RATE } = {}) {
  const { x0, y0, x1, y1 } = reg.bbox;
  const step = 1 / rate;
  let lx = Infinity, ly = Infinity, hx = -Infinity, hy = -Infinity;
  for (let j = Math.ceil(y0 * rate - 0.5); j <= Math.ceil(y1 * rate); j++) {
    const y = (j + 0.5) * step;
    for (let i = Math.ceil(x0 * rate - 0.5); i <= Math.ceil(x1 * rate); i++) {
      const x = (i + 0.5) * step;
      if (!reg.covered(x, y)) continue;
      if (x < lx) lx = x; if (x > hx) hx = x;
      if (y < ly) ly = y; if (y > hy) hy = y;
    }
  }
  return { x0: lx, y0: ly, x1: hx, y1: hy, w: hx - lx, h: hy - ly, rate };
}

/**
 * Convergence evidence: the same number at rising rates, with the step-to-step
 * change. A figure from here is only quotable once this has stopped moving.
 */
export function convergence(fn, rates = [4, 8, 16, 32, 64, 128]) {
  const rows = [];
  for (const rate of rates) {
    const value = fn(rate);
    const prev = rows.at(-1);
    rows.push({ rate, value, delta: prev ? value - prev.value : null });
  }
  return rows;
}

// ── small shared helpers ───────────────────────────────────────────────────

/** Build a region from bare `d` strings at one weight — for tests and probes. */
export const strokeRegion = (ds, weight, opts = {}) =>
  region(ds.map((d) => ({ d, kind: 'stroke', weight })), opts);

/** Build a region from bare `d` strings as evenodd areas — for tests and probes. */
export const areaRegion = (ds, opts = {}) =>
  region(ds.map((d) => ({ d, kind: 'area' })), opts);

export const sum = (a) => a.reduce((x, y) => x + y, 0);
export const r2 = (n) => Math.round(n * 100) / 100;
export const r3 = (n) => Math.round(n * 1000) / 1000;
