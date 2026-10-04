// Tests for tools/audit/angles.mjs.
//
// Two halves. First, synthetic cases where the right answer is known exactly —
// a segment at 45.000°, one at 44.900°, the two axes, the two diagonal
// directions, a closing `Z`, relative commands, and an arc (which is not a
// straight segment at all). Then the numbers the repo already states, measured
// off the shipped files: `code`'s slash, `trash`'s taper, the chevron's leg at
// 16, `check-circle-small`'s 1.87° shift, `help-3`'s tail.

import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { segmentsOf, anglesOf, census, angleOf, piecesOf, arcParams, readIcon } from './angles.mjs';

const icon = (master, name) => fileURLToPath(new URL(`../../src/icons/${master}/${name}.svg`, import.meta.url));
const close = (a, b, tol, what) =>
  assert.ok(Math.abs(a - b) <= tol, `${what ?? ''} expected ${b} ± ${tol}, measured ${a}`);
const seg = (d) => segmentsOf(d);

// ── the conventions ────────────────────────────────────────────────────────

test('a horizontal run reads 0° and a vertical one 90°, whichever way it is drawn', () => {
  for (const d of ['M0 0H10', 'M10 0H0', 'M0 0h10']) {
    const [s] = seg(d);
    close(s.angle, 0, 1e-12, d); close(s.dev, 0, 1e-12, d); close(s.fromVertical, 90, 1e-12, d);
  }
  for (const d of ['M0 0V10', 'M0 10V0', 'M0 0v10']) {
    const [s] = seg(d);
    close(s.angle, 90, 1e-12, d); close(s.dev, 0, 1e-12, d); close(s.fromHorizontal, 90, 1e-12, d);
  }
});

test('a slash reads 45° and a backslash 106.86° — y is flipped to a designer reading', () => {
  const up = seg('M0 10L10 0')[0];          // `/`
  close(up.angle, 45, 1e-12, '/');
  close(up.dev, 0, 1e-12, '/ dev');
  const down = seg('M0 0L10 10')[0];        // `\`
  close(down.angle, 135, 1e-12, '\\');
  close(down.fromHorizontal, 45, 1e-12, '\\ fromHorizontal');
  close(down.dev, 0, 1e-12, '\\ dev');
});

test('exactly 45° has zero deviation; 44.9° has 0.1°', () => {
  const exact = seg('M0 10L10 0')[0];
  assert.equal(exact.dev, 0);
  assert.equal(exact.nearest, 45);

  const rise = 10 * Math.tan((44.9 * Math.PI) / 180);
  const off = seg(`M0 ${rise}L10 0`)[0];
  close(off.angle, 44.9, 1e-9, '44.9° angle');
  close(off.dev, 0.1, 1e-9, '44.9° deviation');
  assert.equal(off.nearest, 45);
  // and what 0.1° buys over that length: length × sin(0.1°)
  close(off.offset, off.length * Math.sin((0.1 * Math.PI) / 180), 1e-12, 'offset');
});

test('the nearest legal angle is one of 0/45/90, read off the acute angle', () => {
  assert.equal(angleOf(10, 0).nearest, 0);
  assert.equal(angleOf(0, 10).nearest, 90);
  assert.equal(angleOf(10, -10).nearest, 45);
  assert.equal(angleOf(10, -0.5).nearest, 0);        // 2.86° — nearest 0
  close(angleOf(10, -0.5).dev, 2.862, 0.001, '2.86° deviation');
  assert.equal(angleOf(0.5, -10).nearest, 90);       // 87.1° — nearest 90
});

// ── decomposition ──────────────────────────────────────────────────────────

test('an arc is not a straight segment, and a closing Z is', () => {
  assert.equal(seg('M0 0A5 5 0 1 0 10 0').length, 0);
  const box = seg('M0 0H10V10H0Z');
  assert.equal(box.length, 4);
  assert.equal(box.filter((s) => s.closing).length, 1);
  // the closing run goes back up the left edge
  close(box[3].angle, 90, 1e-12, 'Z segment');
});

test('a Z that lands on a point the path is already on draws nothing', () => {
  // Every closed shape in the set ends this way: the last arc already returns
  // to the subpath start, so the Z is a zero-length move, not a segment.
  const d = 'M7.25 2.75H13.25L19.25 8.75V18.75A2.5 2.5 0 0 1 16.75 21.25H7.25A2.5 2.5 0 0 1 4.75 18.75V5.25A2.5 2.5 0 0 1 7.25 2.75Z';
  assert.equal(seg(d).filter((s) => s.closing).length, 0);
});

test('relative commands and repeated argument groups decompose the same as absolute', () => {
  const abs = seg('M0 0L5 0L10 5');
  const rel = seg('m0 0l5 0l5 5');
  const run = seg('M0 0L5 0 10 5');            // one L, two coordinate pairs
  for (const got of [rel, run]) {
    assert.equal(got.length, abs.length);
    got.forEach((s, i) => close(s.angle, abs[i].angle, 1e-12, 'angle'));
  }
});

test('an arc whose typed radii cannot span its endpoints is scaled up by the spec', () => {
  // SVG F.6.6.2: `A5 5` across a chord of 14.14 draws r7.071, not r5. This is
  // why radii.mjs never trusts a literal — and it is handled in the shared
  // decomposition, so both instruments see the same geometry.
  const p = arcParams(10, 0, 5, 5, 0, 0, 1, 20, 10);
  assert.equal(p.scaled, true);
  close(p.rx, 5 * Math.SQRT2, 1e-9, 'scaled radius');
  assert.deepEqual(p.given, [5, 5]);
  const { pieces } = piecesOf('M0 0H10A5 5 0 0 1 20 10V20');
  assert.deepEqual(pieces.map((x) => x.type), ['line', 'arc', 'line']);
  close(pieces[1].arc.rx, 5 * Math.SQRT2, 1e-9, 'piece radius');
});

test('zero-length segments are dropped and minLength filters short ones', () => {
  assert.equal(seg('M5 5L5 5').length, 0);
  assert.equal(segmentsOf('M0 0H0.05H3', { minLength: 0.1 }).length, 1);
});

// ── the numbers the repo already states ────────────────────────────────────

test("code's slash: C30 says 73.14 · 72.26 · 73.18", () => {
  const stated = { 24: 73.14, 20: 72.26, 16: 73.18 };
  for (const m of [24, 20, 16]) {
    const slash = anglesOf(icon(m, 'code')).segments.filter((s) => s.dev > 1);
    assert.equal(slash.length, 1, `one off-axis segment at ${m}`);
    close(slash[0].fromHorizontal, stated[m], 0.005, `code slash at ${m}`);
  }
  // C30 also says the file declares run and rise, not a degree figure
  const s = anglesOf(icon(24, 'code')).segments.find((x) => x.dev > 1);
  close(Math.abs(s.dx), 5, 1e-12, 'run'); close(Math.abs(s.dy), 16.5, 1e-12, 'rise');
});

test("trash's walls: C22 says they taper 4°", () => {
  for (const m of [24, 20, 16]) {
    const walls = anglesOf(icon(m, 'trash')).segments.filter((s) => s.dev > 1);
    assert.equal(walls.length, 2, `two tapered walls at ${m}`);
    for (const w of walls) close(w.fromVertical, 4, 0.03, `trash wall at ${m}`);
  }
});

test("the classic chevron's leg: C10 says 45° goes to 45.5° at 16", () => {
  // C10's "45°" is the 16 master as it shipped BEFORE the stroke went to 1.25,
  // which measures exactly 45.000; the figure is the conversion's cost at 16,
  // not a 24-to-16 difference. 24 itself measures 44.95.
  const was = segmentsOf('M3.5 6.29L7.47 10.26A0.75 0.75 0 0 0 8.53 10.26L12.5 6.29');
  for (const s of was) close(s.fromHorizontal, 45, 1e-9, 'pre-C7 16 chevron leg');
  const now = anglesOf(icon(16, 'chevron-down')).segments;
  for (const s of now) close(s.fromHorizontal, 45.5, 0.005, '16 chevron leg');
  const at24 = anglesOf(icon(24, 'chevron-down')).segments;
  for (const s of at24) close(s.fromHorizontal, 44.95, 0.005, '24 chevron leg');
});

test("check-circle-small is C10's largest leg-angle shift at 16: 1.87°", () => {
  const was = segmentsOf('M5.9 8.3L6.67 9.07A0.75 0.75 0 0 0 7.73 9.07L10.1 6.71');
  const now = anglesOf(icon(16, 'check-circle-small')).segments;
  assert.equal(was.length, 2); assert.equal(now.length, 2);
  const shift = Math.max(...now.map((s, i) => Math.abs(s.fromHorizontal - was[i].fromHorizontal)));
  close(shift, 1.87, 0.005, 'largest leg shift');
});

test("help-3's tail: plans/stroke-16.md says 46.9° at 16, was 45°", () => {
  const tail = anglesOf(icon(16, 'help-3')).segments;
  assert.equal(tail.length, 1);
  close(tail[0].fromVertical, 46.9, 0.05, 'help-3 tail at 16');
  const was = segmentsOf('M6.69 5.19A1.5 1.5 0 0 1 8.81 7.31L8 8.12');
  close(was[0].fromVertical, 45, 0.001, 'pre-C7 help-3 tail');
});

// ── the file reader and the census ─────────────────────────────────────────

test('a filled file\'s area paths are read, labelled and measured', () => {
  const f = readIcon(icon(24, 'file-filled'));
  assert.equal(f.master, 24);
  assert.equal(f.filled, true);
  assert.equal(f.paths.length, 2);
  assert.ok(f.paths.every((p) => p.style === 'area'));
  // lint.mjs:207-210 — a shape-filled file keeps the master's OUTLINE weight
  assert.equal(f.stroke, 1.5);
  const a = anglesOf(icon(24, 'file-filled'));
  assert.ok(a.segments.length > 0, 'area paths yield segments');
  assert.ok(a.segments.every((s) => s.style === 'area'));
});

test('census totals, groups and sorts the deviations worst first', () => {
  const c = census([icon(24, 'code'), icon(24, 'trash'), icon(24, 'chevron-down')]);
  assert.equal(c.drawings, 3);
  assert.equal(c.segments, c.per.reduce((n, p) => n + p.segments.length, 0));
  assert.deepEqual(c.offConcepts, ['code', 'trash']);
  for (let i = 1; i < c.off.length; i++) assert.ok(c.off[i - 1].dev >= c.off[i].dev, 'sorted');
  close(c.off[0].fromHorizontal, 73.142, 0.001, 'worst is the code slash');
  // the chevron's 0.05° sits under the default 0.5° tolerance
  assert.ok(!c.off.some((s) => s.name === 'chevron-down'));
  // and raising the bar to a hard 0.01° brings it in
  assert.ok(census([icon(24, 'chevron-down')], { tolerance: 0.01 }).off.length === 2);
});
