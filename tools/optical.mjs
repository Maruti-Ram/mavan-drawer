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

import { samplePath } from './geometry.mjs';

const STEP = 0.25;

/** Per-scanline extreme ink position for one side. Each point carries its own pen radius. */
function profile(pts, side, lo, hi) {
  const vertical = side === 'left' || side === 'right';
  const want = side === 'right' || side === 'bottom' ? 1 : -1;
  const out = [];
  for (let s = lo; s <= hi + 1e-9; s += STEP) {
    let best = -Infinity;
    for (const [px, py, r] of pts) {
      const along = vertical ? py : px;          // the scanline axis
      const across = vertical ? px : py;         // the measured axis
      const d = Math.abs(along - s);
      if (d > r) continue;
      const bulge = Math.sqrt(r * r - d * d);
      const edge = want * (across + want * bulge);
      if (edge > best) best = edge;
    }
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
  const JUMP = stroke;             // a step larger than this is a discontinuity
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

// `stroke` is one weight, or one per path (C32: a numeral or a letter in a line-heavy filled drawing keeps
// the outline weight beside heavier rails); a recession is capped at the heaviest.
export function opticalBearings(paths, stroke = 2, canvas = 24, alpha = 0.75) {
  const weightAt = (i) => (Array.isArray(stroke) ? stroke[i] : stroke);
  const pts = paths.flatMap((d, i) => samplePath(d).map(([x, y]) => [x, y, weightAt(i) / 2]));
  if (!pts.length) return null;
  const box = {
    x0: Math.min(...pts.map((p) => p[0] - p[2])), x1: Math.max(...pts.map((p) => p[0] + p[2])),
    y0: Math.min(...pts.map((p) => p[1] - p[2])), y1: Math.max(...pts.map((p) => p[1] + p[2])),
  };
  const heaviest = Math.max(...paths.map((_, i) => weightAt(i)));
  const r2 = (n) => Math.round(n * 100) / 100;
  const out = {};
  for (const side of ['left', 'right', 'top', 'bottom']) {
    const vertical = side === 'left' || side === 'right';
    const prof = profile(pts, side, vertical ? box.y0 : box.x0, vertical ? box.y1 : box.x1);
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
