// Optical side bearings.
//
// A geometric bbox says where ink *stops*. It does not say where ink *feels*
// like it stops. A circle touches its bounding box at a single tangent point
// and recedes everywhere else, so it reads as ending earlier than a flat edge
// at the same coordinate — which is why a round icon in a button needs less
// padding than a square one to look equal.
//
// Type solves this with optically-tuned side bearings ("o" is set tighter than
// "n"). This computes the same thing for icons, from the outline.
//
// A round-capped, round-joined stroke is exactly the union of discs of radius
// stroke/2 swept along the centreline, so the ink edge per scanline is exact,
// not approximated.

//
// A filled area (fill="currentColor", the shape-filled twins) is ink out to its edge.
// Its ink per scanline is read straight off that edge — where the scanline crosses the
// area's boundary — so a solid disc recedes exactly as the ring it was filled from, and
// a filled twin whose ink box equals its outline twin's lands on the same optical
// bearings. A hole never reaches the edge, so it does not change the reading; a notch
// cut into the silhouette does, as it should. Until 2026-10-26 a filled area got no
// recession at all (doc 09: plus-circle 2.71, plus-circle-filled 2.0, same silhouette).

import { bbox, samplePath, subpathsOf } from './geometry.mjs';

// Scanlines run every quarter unit from the ink's own edge, as they always have — snapped to
// 1e-4, so a box that moves by a millionth (piggy-bank's ear arc, 3.7499992) does not move
// every scanline with it, miss the snout's tangent and read it 0.41 differently. Anchoring
// them to the canvas grid instead was measured 2026-10-26 and rejected: a box off the quarter
// grid (gear's 2.69, every arc and diagonal) then gets a new phase, and 242 outline files
// moved by more than 0.05 against 47 (plans/shipping.md card 1.2).
const STEP = 0.25;
// A tangent is read with a tolerance: the pen's disc, a vertex the scanline touches and a
// flat edge the scanline lies on all count within this much of a unit.
const TOL = 1e-4;

/** The edges of filled areas as closed polylines, one list per area (its subpaths), curves
 *  and arcs followed closely (an arc within a degree, a curve every STEP). A fill closes
 *  its boundary whether or not a Z was written. */
function edgesOf(areas) {
  return areas.map((d) => subpathsOf(d).flatMap((sub) => {
    const p = samplePath(sub, { curves: true, arcStep: 1 });
    if (p.length < 2) return [];
    if (Math.hypot(p.at(-1)[0] - p[0][0], p.at(-1)[1] - p[0][1]) > 1e-9) p.push(p[0]);
    return [p];
  })).filter((polys) => polys.length);
}

/** Where one area's ink starts on this scanline, from the `want` side: its edges' crossings
 *  in order, painted between every odd and even one (evenodd, as every area is filled), the
 *  outermost span of real width counted — so a cut-out that shares the silhouette's edge is
 *  white, not ink — and a vertex the scanline only touches (the top of a disc, the crown of a
 *  bend: both its neighbours on one side) counted as a point of ink, as the pen's tangent
 *  disc is in a stroked twin's reading, and a flat edge the scanline lies on read as ink
 *  from end to end (a lid's underside, a foot's sole: the stroked twin keeps its cap's
 *  tangent there, so the filled one must keep its edge). A vertex the edge passes through
 *  counts once (half-open). -Infinity for no ink. */
function areaEdge(polys, s, A, X, want) {
  const xs = [];
  let best = -Infinity;
  for (const poly of polys) {
    const n = poly.length - 1;   // poly[n] repeats poly[0]
    for (let i = 1; i <= n; i++) {
      const p = poly[i - 1], q = poly[i], lo = Math.min(p[A], q[A]), hi = Math.max(p[A], q[A]);
      if (hi - lo > TOL) { if (s >= lo && s < hi) xs.push(p[X] + ((s - p[A]) * (q[X] - p[X])) / (q[A] - p[A])); }
      else if (Math.abs(lo - s) < TOL) best = Math.max(best, want * p[X], want * q[X]);   // a flat edge on the scanline
      if (Math.abs(q[A] - s) < TOL) {
        const prev = poly[i - 1], next = poly[i === n ? 1 : i + 1];
        if ((prev[A] - s) * (next[A] - s) > TOL * TOL) best = Math.max(best, want * q[X]);   // a touch
      }
    }
  }
  xs.sort((a, b) => a - b);
  if (want < 0) { for (let i = 0; i + 1 < xs.length; i += 2) if (xs[i + 1] - xs[i] > 1e-9) return Math.max(best, -xs[i]); }
  else for (let i = xs.length - 2; i >= 0; i -= 2) if (xs[i + 1] - xs[i] > 1e-9) return Math.max(best, xs[i + 1]);
  return best;
}

/** The ink's edge on one side, scanline by scanline, as `opticalBearings` reads it — for tests
 *  and for looking at why two twins differ. Same arguments as `opticalBearings`, plus the side. */
export function inkProfile(paths, stroke, side, { areas = [] } = {}) {
  const weightAt = (i) => (Array.isArray(stroke) ? stroke[i] : stroke);
  const pts = paths.flatMap((d, i) => samplePath(d).map(([x, y]) => [x, y, weightAt(i) / 2]));
  const box = inkBox(paths, weightAt, areas);
  const vertical = side === 'left' || side === 'right';
  return profile(pts, edgesOf(areas), side, vertical ? box.y0 : box.x0, vertical ? box.y1 : box.x1);
}

/** The exact ink box: each stroke's centreline box grown by half its weight, each area's own. */
function inkBox(paths, weightAt, areas) {
  const boxes = paths.map((d, i) => { const b = bbox([d]), h = weightAt(i) / 2; return { x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h }; });
  if (areas.length) boxes.push(bbox(areas));
  return boxes.reduce((u, v) => ({ x0: Math.min(u.x0, v.x0), y0: Math.min(u.y0, v.y0), x1: Math.max(u.x1, v.x1), y1: Math.max(u.y1, v.y1) }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
}

/** Per-scanline extreme ink position for one side. Each stroke point carries its own pen
 *  radius; each filled area is read where the scanline crosses its edges (`areaEdge`), the
 *  areas painted over one another. Scanlines run every STEP from the ink's edge (snapped to
 *  1e-4) to its far edge; those with no ink are left out. */
function profile(pts, edges, side, lo, hi) {
  const vertical = side === 'left' || side === 'right';
  const want = side === 'right' || side === 'bottom' ? 1 : -1;
  const A = vertical ? 1 : 0, X = 1 - A;              // A: the scanline axis, X: the measured axis
  const out = [];
  const from = Math.round(lo * 1e4) / 1e4, last = Math.floor((hi + TOL - from) / STEP);
  for (let k = 0; k <= last; k++) {
    const s = from + k * STEP;
    let best = -Infinity;
    for (const [px, py, r] of pts) {
      const along = vertical ? py : px;
      const across = vertical ? px : py;
      const d = Math.abs(along - s);
      if (d > r + TOL) continue;
      const bulge = Math.sqrt(Math.max(0, r * r - d * d));
      const edge = want * (across + want * bulge);
      if (edge > best) best = edge;
    }
    for (const polys of edges) best = Math.max(best, areaEdge(polys, s, A, X, want));
    if (best > -Infinity) out.push(want * best);
  }
  return out;
}

/**
 * @param alpha how much of the mean recession to charge as optical bearing.
 *              0 = geometric only. 1 = fully area-compensated. 0.75 matches
 *              the corrections designers make by hand.
 */
/** Mean recession, counting only the run of scanlines *contiguous* with the
 *  extreme edge. A circle recedes smoothly, so all of it counts. A plus jumps
 *  straight from its arm tip to the far-away stem — that jump is a counter, not
 *  a shaped edge, and the eye does not read it as empty margin. */
function contiguousRecession(prof, far, stroke) {
  if (!prof.length) return 0;
  const CAP = stroke;              // recession deeper than one stroke stops counting
  // A step larger than one stroke is a discontinuity; one of exactly one stroke bridges, as
  // `> stroke` always read it on a grid-exact box, now within 0.01 so it cannot flip on
  // floating-point luck (command's box sat 0.0007 off its samples, its 1.5 step read 1.5007
  // and broke: 4.67; exact, it bridges: 5.06). Measured 2026-10-26 against main: bridging
  // moves 47 outline files by more than 0.05, breaking moves 113 and parts every filled twin
  // whose C22 band is one stroke from its outline's edge (archive-filled 3.06 against 3.84).
  // Whether a one-stroke step should break instead is Maruti's call (card 1.2 review).
  const JUMP = stroke + 0.01;
  let iMax = 0;
  for (let i = 1; i < prof.length; i++) {
    if (Math.abs(prof[i] - far) < Math.abs(prof[iMax] - far)) iMax = i;
  }
  let sum = 0;
  for (const dir of [-1, 1]) {
    let prev = prof[iMax];
    for (let i = iMax + dir; i >= 0 && i < prof.length; i += dir) {
      if (Math.abs(prof[i] - prev) > JUMP) break;
      sum += Math.min(Math.abs(far - prof[i]), CAP);
      prev = prof[i];
    }
  }
  return sum / prof.length;
}

// `stroke` is one weight, or one per path (C32: a numeral, a letter or a currency sign in a line-heavy filled drawing keeps
// the outline weight beside heavier rails); a recession is capped at the heaviest. `areas` are the
// drawing's filled paths (fill="currentColor"), read as ink to their edge; with none the stroked
// paths alone are read, as before. The box is the exact ink box (`bbox`: true arc and curve
// extremes), each stroke grown by half its weight, so the geometric bearing here is the build's.
export function opticalBearings(paths, stroke = 2, canvas = 24, alpha = 0.75, { areas = [] } = {}) {
  const weightAt = (i) => (Array.isArray(stroke) ? stroke[i] : stroke);
  const pts = paths.flatMap((d, i) => samplePath(d).map(([x, y]) => [x, y, weightAt(i) / 2]));
  const polys = edgesOf(areas);
  if (!pts.length && !polys.length) return null;
  const box = inkBox(paths, weightAt, areas);
  // the heaviest line in the drawing; a shape-filled drawing with no line keeps its root weight,
  // the master's outline stroke, so its recession is capped as its outline twin's is
  const heaviest = paths.length ? Math.max(...paths.map((_, i) => weightAt(i))) : Array.isArray(stroke) ? Math.max(...stroke) : stroke;
  const r2 = (n) => Math.round(n * 100) / 100;
  const out = {};
  for (const side of ['left', 'right', 'top', 'bottom']) {
    const vertical = side === 'left' || side === 'right';
    const prof = profile(pts, polys, side, vertical ? box.y0 : box.x0, vertical ? box.y1 : box.x1);
    const far = side === 'right' || side === 'bottom'
      ? Math.max(...prof) : Math.min(...prof);
    const recession = contiguousRecession(prof, far, heaviest);
    const geo = side === 'left' ? box.x0
      : side === 'top' ? box.y0
      : side === 'right' ? canvas - box.x1
      : canvas - box.y1;
    out[side] = { geometric: r2(geo), recession: r2(recession), optical: r2(geo + alpha * recession) };
  }
  return out;
}
