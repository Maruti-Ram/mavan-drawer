// Tests for tools/audit/radii.mjs.
//
// Two halves. First, synthetic corners built from the fillet relation itself,
// so the right answer is known exactly: a 90° corner at a known radius, a 45°
// corner (whose tangent length is r / tan 22.5°, the figure C23 relies on), the
// same corner drawn as a Bezier instead of an arc, a sharp corner, an arc whose
// typed radii are a lie, and a full circle — which has no corners at all.
// Then the numbers the repo already states, measured off the shipped files:
// `file`'s container and fold radii, `trash`'s bottom corners, and `file`'s
// flap tips, which are on a filled AREA path — the case lint cannot see.

import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { cornersOf, radiiOf, census, fitCircle } from './radii.mjs';
import { bendMin } from '../masters.mjs';

const icon = (master, name) => fileURLToPath(new URL(`../../src/icons/${master}/${name}.svg`, import.meta.url));
const close = (a, b, tol, what) =>
  assert.ok(Math.abs(a - b) <= tol, `${what ?? ''} expected ${b} ± ${tol}, measured ${a}`);
const f4 = (n) => Number(n.toFixed(4));

/**
 * A single filleted corner, built from the relation the tool is supposed to
 * recover: vertex at the origin, one leg arriving along +x, the other leaving
 * at `interior` degrees, joined by a true tangent arc of radius `radius`.
 * Tangent length T = radius × tan(turn / 2), turn = 180 − interior.
 * `as: 'bezier'` draws the same quarter-ish arc as a cubic instead.
 */
function fillet({ interior, radius, leg = 10, as = 'arc' }) {
  const t = (180 - interior) * (Math.PI / 180);         // the turn, in radians
  const T = radius * Math.tan(t / 2);
  const u = [1, 0];                                      // arrives travelling +x
  const v = [Math.cos(t), -Math.sin(t)];                 // leaves, turned anticlockwise on screen
  const p = (a, s, b) => [f4(a[0] + s * b[0]), f4(a[1] + s * b[1])];
  const V = [0, 0];
  const tp1 = p(V, -T, u), tp2 = p(V, T, v);
  const a = p(tp1, -leg, u), z = p(tp2, leg, v);
  if (as === 'arc')
    return { d: `M${a[0]} ${a[1]}L${tp1[0]} ${tp1[1]}A${radius} ${radius} 0 0 0 ${tp2[0]} ${tp2[1]}L${z[0]} ${z[1]}`, T, tp1, tp2 };
  // cubic approximation of a circular arc: handle length k·r, k = 4/3·tan(t/4)
  const k = (4 / 3) * Math.tan(t / 4) * radius;
  const c1 = p(tp1, k, u), c2 = p(tp2, -k, v);
  return { d: `M${a[0]} ${a[1]}L${tp1[0]} ${tp1[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${tp2[0]} ${tp2[1]}L${z[0]} ${z[1]}`, T, tp1, tp2 };
}

// ── synthetic corners ──────────────────────────────────────────────────────

test('a 90° corner at a known radius, measured three independent ways', () => {
  const { d, T } = fillet({ interior: 90, radius: 2.5 });
  close(T, 2.5, 1e-12, 'tangent length of a 90° fillet is r');
  const [c] = cornersOf(d);
  assert.equal(cornersOf(d).length, 1);
  assert.equal(c.kind, 'arc');
  close(c.radius, 2.5, 1e-9, 'radius from the curve');
  close(c.radiusByTangent, 2.5, 1e-6, 'radius from the two legs');
  close(c.radiusFit, 2.5, 1e-6, 'radius from a circle fit');
  close(Math.abs(c.turn), 90, 1e-6, 'turn');
  close(c.interior, 90, 1e-6, 'interior angle');
  close(c.tangentError, 0, 1e-3, 'meets both legs on tangent');
  close(c.tangentUneven, 0, 1e-3, 'tangent lengths equal');
  assert.deepEqual(c.literal, [2.5, 2.5]);
  assert.equal(c.exact, true);
});

test("a 45° corner: tangent length is r / tan 22.5°, the figure C23 relies on", () => {
  const radius = 0.5;
  const { d, T } = fillet({ interior: 45, radius });
  close(T, radius / Math.tan((22.5 * Math.PI) / 180), 1e-12, 'r / tan 22.5°');
  close(T, 1.2071, 1e-4, 'r0.5 pulls each tip back 1.21 along the edge (C23)');
  const [c] = cornersOf(d);
  close(c.radius, radius, 1e-4, 'radius');
  close(c.radiusByTangent, radius, 1e-4, 'radius from the legs');
  close(c.interior, 45, 1e-3, 'interior angle');
  close(Math.abs(c.turn), 135, 1e-3, 'turn');
  close(c.tangentLengths[0], T, 1e-3, 'tangent length recovered');
});

test('the same corner drawn as a Bezier is measured as a Bezier', () => {
  for (const interior of [90, 45, 135]) {
    const { d } = fillet({ interior, radius: 2.5, as: 'bezier' });
    const [c] = cornersOf(d);
    assert.equal(c.kind, 'bezier', `interior ${interior}`);
    assert.equal(c.literal, null, 'a Bezier has no literal to read');
    // a cubic approximation of a circular arc is good to ~0.03% of r
    close(c.radius, 2.5, 0.01, `bezier radius at interior ${interior}`);
    close(c.radiusByTangent, 2.5, 0.01, `bezier radius from the legs at ${interior}`);
    assert.ok(c.fitError < 0.01, `fit error ${c.fitError}`);
    assert.equal(c.exact, false);
  }
});

test('a sharp corner has radius 0 and reports its turn', () => {
  const cs = cornersOf('M0 0H10V10');
  assert.equal(cs.length, 1);
  assert.equal(cs[0].kind, 'sharp');
  assert.equal(cs[0].radius, 0);
  assert.equal(cs[0].radiusByTangent, 0);
  assert.equal(cs[0].literal, null);
  close(Math.abs(cs[0].turn), 90, 1e-9, 'turn');
  assert.deepEqual(cs[0].at, [10, 0]);
  // a 135° chamfer cut, as `file`'s silhouette makes it
  const chamfer = cornersOf('M0 0H10L20 10');
  close(chamfer[0].interior, 135, 1e-9, 'chamfer interior angle');
  assert.equal(chamfer[0].radius, 0);
});

test('a full circle has no corners — and neither has a dot or a ring', () => {
  assert.equal(cornersOf('M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z').length, 0);
  assert.equal(cornersOf('M11.5 16.75A0.5 0.5 0 1 0 12.5 16.75A0.5 0.5 0 1 0 11.5 16.75Z').length, 0);
  // the real case: `help-3` is a ring, a bowl with a tail, and a dot — three
  // shapes and no corners, which is `docs/09:23`'s own distinction
  assert.equal(radiiOf(icon(24, 'help-circle-3')).corners.length, 0);
  assert.equal(radiiOf(icon(24, 'info-circle')).corners.length, 0);
  // a half-round slot end is a 180° turn, not a corner
  assert.equal(cornersOf('M0 0H10A2 2 0 0 1 10 4H0').length, 0);
});

test('a lying literal is caught: three different numbers for one corner', () => {
  // `A5 5` across a 14.14 chord cannot be drawn, so the spec scales it to
  // r7.071 — and the two legs, which are 10 from the vertex, imply r10. Only
  // the middle number is the radius actually on the page.
  const [c] = cornersOf('M0 0H10A5 5 0 0 1 20 10V20');
  assert.deepEqual(c.literal, [5, 5]);
  close(c.radius, 5 * Math.SQRT2, 1e-9, 'radius drawn');
  close(c.radiusByTangent, 10, 1e-9, 'radius the legs imply');
  assert.ok(c.tangentError > 1, 'and it does not meet its legs on tangent');
});

test('collinear runs merge, so a polyline does not invent corners', () => {
  assert.equal(cornersOf('M0 0H5H10V10').length, 1);
  assert.equal(cornersOf('M0 0L5 0L10 0L10 10').length, 1);
  // a closed box is four corners however its Z lands
  assert.equal(cornersOf('M0 0H10V10H0Z').length, 4);
  assert.equal(cornersOf('M5 0H10V10H0V0Z').length, 4);
});

test('fitCircle recovers a known circle and refuses collinear points', () => {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const t = (i / 19) * Math.PI / 2;
    return [3 + 1.75 * Math.cos(t), -4 + 1.75 * Math.sin(t)];
  });
  const fit = fitCircle(pts);
  close(fit.radius, 1.75, 1e-9, 'radius'); close(fit.cx, 3, 1e-9, 'cx'); close(fit.cy, -4, 1e-9, 'cy');
  assert.equal(fitCircle([[0, 0], [1, 1], [2, 2], [3, 3]]), null);
});

// ── the numbers the repo already states ────────────────────────────────────

test("file's container radius: C23 says 2.5 · 2 · 1.5 on the centreline", () => {
  const stated = { 24: 2.5, 20: 2, 16: 1.5 };
  for (const m of [24, 20, 16]) {
    const cs = radiiOf(icon(m, 'file')).corners.filter((c) => c.role === 'container' && c.kind === 'arc');
    assert.equal(cs.length, 3, `three rounded container corners at ${m}`);
    for (const c of cs) close(c.radius, stated[m], 1e-9, `file container at ${m}`);
  }
});

test("file's outer radius: C23 says 3.25 · 2.75 · 2.25 — and at 16 only the filled twin holds it", () => {
  const stated = { 24: 3.25, 20: 2.75, 16: 2.25 };
  for (const m of [24, 20, 16]) {
    const cs = radiiOf(icon(m, 'file-filled')).corners.filter((c) => c.role === 'container' && c.radius > 1);
    assert.equal(cs.length, 3, `three outer container corners at ${m}`);
    for (const c of cs) {
      close(c.radius, stated[m], 1e-9, `file-filled outer at ${m}`);
      assert.equal(c.style, 'area', 'measured on a filled area path');
    }
  }
  // The outline's own outer edge is its centreline plus half its stroke. At 24
  // and 20 that is the stated figure; at 16 the 1.25 stroke makes it 2.125,
  // while the filled twin still carries the 1.5-era 2.25 (docs/09, on record).
  for (const [m, want] of [[24, 3.25], [20, 2.75], [16, 2.125]]) {
    const out = radiiOf(icon(m, 'file'));
    const c = out.corners.find((x) => x.role === 'container' && x.kind === 'arc');
    close(c.radius + out.stroke / 2, want, 1e-9, `file outline outer edge at ${m}`);
  }
  const filled16 = radiiOf(icon(16, 'file-filled')).corners.find((c) => c.role === 'container' && c.radius > 1);
  close(filled16.radius - 2.125, 0.125, 1e-9, 'the 16 filled corner stands 0.125 of radius proud');
});

test("trash's bottom corners: C22 says 1.5 · 1.25 · 1", () => {
  const stated = { 24: 1.5, 20: 1.25, 16: 1 };
  for (const m of [24, 20, 16]) {
    const cs = radiiOf(icon(m, 'trash')).corners.filter((c) => c.role === 'container');
    assert.equal(cs.length, 2, `two can-body corners at ${m}`);
    for (const c of cs) close(c.radius, stated[m], 1e-9, `trash bottom corner at ${m}`);
  }
});

test("docs/09:23 — trash's container uses 1.5 where docs/01 §5 says 2.5", () => {
  const trash = radiiOf(icon(24, 'trash')).corners.filter((c) => c.role === 'container');
  const file = radiiOf(icon(24, 'file')).corners.filter((c) => c.role === 'container' && c.kind === 'arc');
  for (const c of trash) close(c.radius, 1.5, 1e-9, 'trash');
  for (const c of file) close(c.radius, 2.5, 1e-9, 'file');
  assert.ok(trash[0].radius < file[0].radius, 'the claim holds: trash is the tighter corner');
});

test("file's fold corner: C23 says 1.5 · 1.25 · 1", () => {
  const stated = { 24: 1.5, 20: 1.25, 16: 1 };
  for (const m of [24, 20, 16]) {
    const fold = radiiOf(icon(m, 'file')).corners.filter((c) => c.path === 1);
    assert.equal(fold.length, 1, `one fold corner at ${m}`);
    close(fold[0].radius, stated[m], 1e-9, `file fold at ${m}`);
  }
});

test("file's flap tips: C23 says r0.25, not 0.5 — and they are on an area path", () => {
  for (const m of [24, 20, 16]) {
    const flap = radiiOf(icon(m, 'file-filled')).corners.filter((c) => c.path === 1);
    const tips = flap.filter((c) => Math.abs(c.interior - 45) < 1);
    assert.equal(tips.length, 2, `two 45° tips at ${m}`);
    for (const c of tips) {
      close(c.radius, 0.25, 1e-9, `flap tip at ${m}`);
      assert.equal(c.style, 'area', 'on a filled area path — invisible to lint');
      close(c.tangentLengths[0], 0.25 / Math.tan((22.5 * Math.PI) / 180), 0.01, 'tangent length');
    }
  }
});

test("a chevron's bend is C10's half the stroke, and reads as a bend not a container", () => {
  for (const [m, want] of [[24, 0.75], [20, 0.75], [16, 0.625]]) {
    const x = radiiOf(icon(m, 'chevron-down'));
    assert.equal(x.corners.length, 1);
    const [c] = x.corners;
    assert.equal(c.role, 'bend');
    close(c.radius, want, 1e-9, `chevron bend at ${m}`);
    close(c.radius, bendMin(x.stroke), 1e-9, 'equals bendMin for this master');
    close(c.bendRatio, 1, 1e-9, 'bendRatio');
  }
});

// ── roles ──────────────────────────────────────────────────────────────────

test('roles separate a body from a bent line with a wide margin, not a knife-edge', () => {
  const body = radiiOf(icon(24, 'trash')).corners.find((c) => c.role === 'container');
  const tab = radiiOf(icon(24, 'trash')).corners.find((c) => c.path === 1);
  const chevron = radiiOf(icon(24, 'chevron-down')).corners[0];
  const fold = radiiOf(icon(24, 'file')).corners.find((c) => c.path === 1);
  assert.equal(tab.role, 'detail', 'the handle is a part inside the icon');
  assert.ok(body.fill > 0.9, `can body fill ${body.fill}`);
  assert.ok(chevron.fill < 0.6, `chevron fill ${chevron.fill}`);
  assert.ok(fold.fill < 0.6, `fold fill ${fold.fill}`);
  assert.equal(chevron.spansIcon, true, 'the chevron IS the icon');
  assert.equal(radiiOf(icon(24, 'code')).corners[0].spansIcon, false, "code's bracket is not");
  // a notch cut into the body is concave, so it is detail and never a container
  const notch = radiiOf(icon(24, 'file-filled')).corners.find((c) => !c.convex);
  assert.equal(notch.role, 'detail');
  close(notch.radius, 2.25, 1e-9, 'the notch carries the fold radius plus half a stroke');
  close(notch.centreline, 1.5, 1e-9, 'which is the fold radius itself');
});

// ── census ─────────────────────────────────────────────────────────────────

test('census groups by measured radius and by role', () => {
  const c = census([icon(24, 'file'), icon(24, 'file-filled'), icon(24, 'trash')]);
  assert.equal(c.drawings, 3);
  assert.equal(c.corners, c.all.length);
  assert.equal(c.byRadius['2.5'].count, 3);
  assert.deepEqual(Object.keys(c.byRadius['2.5'].roles), ['container']);
  assert.equal(c.byRadius['3.25'].count, 3);
  assert.deepEqual(c.byRadius['3.25'].styles, { area: 3 });
  // the centreline scale is where a stroked corner and a filled contour meet
  assert.equal(c.centrelineGroups['2.5'].count, 6, 'three stroked 2.5 and three filled 3.25');
  assert.ok(c.byRole.container.radii['2.5'] >= 3);
  assert.equal(c.literalLies.length, 0, 'no shipped corner has a lying literal');
  assert.equal(c.kinds.sharp, 2, "file's two chamfer corners");
});
