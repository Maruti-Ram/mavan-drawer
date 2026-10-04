// tools/audit/refs/pairgeom.test.mjs — synthetic geometry only (no third-party drawing is read).
// Run: node --test tools/audit/refs/pairgeom.test.mjs
// Each test states a number a person can check by hand.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyticBox, pathInkBox, parsePath, roundSharp, cornerRuns, sharpVertices, offsetVertex, rasterise, areaOf, iou,
  closedSilhouette, holesOf, distanceTo, silhouette, newMask, extremeKinds, skeletonBox, allRoundCentre, endsCensus,
} from './pairgeom.mjs';

const stroke = (d, weight = 2, cap = 'ROUND', join = 'ROUND', extra = {}) => ({
  d, paint: 'stroke', winding: 'NONE', node: { type: 'VECTOR' }, cornerRadiusProp: 0,
  stroke: { weight, align: 'CENTER', cap, join, miterLimit: 4 }, ...extra,
});
const fill = (d, extra = {}) => ({ d, paint: 'fill', winding: 'NONZERO', node: { type: 'VECTOR' }, cornerRadiusProp: 0, stroke: null, ...extra });
const rec = (...paths) => ({ canvas: [24, 24], paths, meta: { flags: {} } });
const near = (a, b, t = 1e-6) => assert.ok(Math.abs(a - b) <= t, `${a} vs ${b}`);

test('a round-capped line grows by half the weight on every side', () => {
  const b = analyticBox(rec(stroke('M 4 12 L 20 12')));
  near(b.x0, 3); near(b.x1, 21); near(b.y0, 11); near(b.y1, 13); assert.equal(b.exact, true);
});

test('a butt-capped line grows only across its width', () => {
  const b = analyticBox(rec(stroke('M 4 12 L 20 12', 2, 'NONE', 'ROUND')));
  near(b.x0, 4); near(b.x1, 20); near(b.y0, 11); near(b.y1, 13);
});

test('a mitred right-angle tip reaches h * sqrt(2) past the vertex', () => {
  const b = analyticBox(rec(stroke('M 4 4 L 12 12 L 20 4', 2, 'NONE', 'MITER')));
  near(b.y1, 12 + Math.SQRT2, 1e-9);
});

test('mixed caps are reported as inexact, not guessed', () => {
  const b = analyticBox(rec(stroke('M 4 12 L 20 12', 2, 'mixed', 'ROUND')));
  assert.equal(b.exact, false);
});

test('a filled path contributes its own box', () => {
  const b = analyticBox(rec(fill('M 2 3 L 10 3 L 10 9 L 2 9 Z')));
  near(b.x0, 2); near(b.x1, 10); near(b.y0, 3); near(b.y1, 9);
});

test('rounding put back on a sharp square gives four corners of the radius asked', () => {
  const cmds = roundSharp(parsePath('M 4 4 L 20 4 L 20 20 L 4 20 L 4 4 Z'), 2);
  const runs = cornerRuns(cmds);
  assert.equal(runs.filter((c) => c.kind === 'corner').length, 4);
  for (const c of runs) { near(c.r, 2, 0.01); near(c.turn, 90, 1e-6); }
});

test('rounding is cut back to half the shorter edge, not drawn past it', () => {
  const runs = cornerRuns(roundSharp(parsePath('M 0 0 L 4 0 L 4 4 L 0 4 Z'), 10));
  assert.ok(runs.every((c) => c.r <= 2.0001), 'a 4-unit edge can carry a radius of 2 at most');
});

test('a sharp vertex is reported with radius 0 and its turn', () => {
  const v = sharpVertices(parsePath('M 4 4 L 12 12 L 20 4'));
  assert.equal(v.length, 1); near(v[0].turn, 90, 1e-6); assert.equal(v[0].r, 0);
});

test('pushing a convex corner out by h moves its virtual vertex by h on each axis', () => {
  const [c] = cornerRuns(roundSharp(parsePath('M 4 4 L 20 4 L 20 20 L 4 20 L 4 4 Z'), 2)).filter((x) => x.V[0] > 19 && x.V[1] < 5);
  const V = offsetVertex(c, 1);
  near(V[0], c.V[0] + 1, 1e-6); near(V[1], c.V[1] - 1, 1e-6);
});

test('the raster area of a round-capped line is length x width + pi r^2', () => {
  const m = rasterise(rec(stroke('M 4 12 L 20 12')), { scale: 32 });
  near(areaOf(m), 16 * 2 + Math.PI, 0.1);
});

test('even-odd fill leaves a hole, non-zero does not need one', () => {
  const ring = fill('M 2 2 L 22 2 L 22 22 L 2 22 Z M 8 8 L 16 8 L 16 16 L 8 16 Z', { winding: 'EVENODD' });
  const m = rasterise(rec(ring), { scale: 8 });
  near(areaOf(m), 400 - 64, 0.5);
  const holes = holesOf(m);
  assert.equal(holes.length, 1); near(holes[0].area, 64, 0.5); near(holes[0].width, 8, 0.3);
});

test('a ring with a gap becomes a filled disc once the gap is closed', () => {
  // a C-shaped ring of radius 9 about (12,12), stroke 2, open for a quarter turn on the right (a gap of about 12 units)
  const pts = [];
  for (let k = 0; k <= 54; k++) { const a = (Math.PI / 4) + (k / 54) * (Math.PI * 1.5); pts.push(`${(12 + 9 * Math.cos(a)).toFixed(4)} ${(12 + 9 * Math.sin(a)).toFixed(4)}`); }
  const ring = rasterise(rec(stroke('M ' + pts.join(' L '), 2)), { scale: 16 });
  const open = silhouette(ring);
  assert.ok(areaOf(open) < areaOf(ring) + 5, 'with the gap open nothing is enclosed');
  const closed = closedSilhouette(ring, 7);
  assert.ok(areaOf(closed) > 0.8 * Math.PI * 100, 'the closed silhouette should be near a full disc of radius 10');
});

test('iou of a mask with itself is 1, with an empty one 0', () => {
  const m = rasterise(rec(stroke('M 4 12 L 20 12')), { scale: 8 });
  near(iou(m, m), 1);
  near(iou(m, newMask(24, 24, 8)), 0);
});

test('distance transform of one pixel is the pixel distance in canvas units', () => {
  const m = newMask(8, 8, 1); m.data[3 * 8 + 3] = 1;
  const d = distanceTo(m.data, 8, 8, 1);
  near(d[3 * 8 + 6], 3); near(d[0], Math.hypot(3, 3), 1e-6);
});

test('a flat edge, an apex and a smooth extreme are told apart', () => {
  const r = rec(stroke('M 4 4 L 20 4 L 20 12 L 12 20 L 4 12 Z'));
  const k = extremeKinds(r, skeletonBox(r));
  assert.equal(k.top, 'flat'); assert.equal(k.bottom, 'apex');
});

test('only centre-aligned round strokes count as round-centre, and a closed shape ignores its caps', () => {
  assert.equal(allRoundCentre(rec(stroke('M 4 4 L 20 4 L 20 20 Z', 2, 'NONE', 'ROUND'))), true);
  assert.equal(allRoundCentre(rec(stroke('M 4 4 L 20 4', 2, 'NONE', 'ROUND'))), false);
  assert.equal(allRoundCentre(rec(stroke('M 4 4 L 20 4 L 20 20', 2, 'ROUND', 'MITER'))), false);
});

test('an end running at 45 degrees is slanted, one running square-on is not', () => {
  const e = endsCensus(rec(stroke('M 4 4 L 12 12'), stroke('M 4 20 L 20 20')));
  assert.equal(e.ends.filter((x) => x.kind === 'diag').length, 2);
  assert.equal(e.ends.filter((x) => x.kind === 'axis').length, 2);
});

test('silhouette fills what is enclosed', () => {
  const m = rasterise(rec(stroke('M 4 4 L 20 4 L 20 20 L 4 20 Z')), { scale: 8 });
  assert.ok(areaOf(silhouette(m)) > areaOf(m) + 190, 'the 14 x 14 inside is added');
});
