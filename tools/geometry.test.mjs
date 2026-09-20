// Tests for selfGap — the measure docs/08 §6.4 calls "the hard one", written twice
// before and wrong both times. The fixtures are the two drawings that got through
// lint clean in one session (2026-09-18) plus the bends that must NOT flag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selfGap } from './geometry.mjs';
import {
  FILLED_WEIGHT, GLYPH_GAP, MASTERS, MIN_GAP, STROKES, bendMin, decimalsFor, decimalsOf,
  gridFor, gridNameFor, gridOf, strokeOf, weightOf,
} from './masters.mjs';

const near = (got, want, tol = 0.06) =>
  assert.ok(Math.abs(got - want) <= tol, `expected ~${want}, got ${got}`);

test('catches a closed mouth: help-4 16 as first drawn', () => {
  const d = 'M6.5 7L6.5 6A1 1 0 0 1 7.5 5L8.5 5A1 1 0 0 1 9.5 6L9.5 6.09A1 1 0 0 1 9.21 6.79L8 8';
  const got = selfGap(d, 1.5).gap;
  near(got, 0.30);
  // it must still fail under C19's looser floor for the inside of a character,
  // or extending C19 to the mouth would have disarmed the check that found it
  assert.ok(got < 1.0, 'must fail even at GLYPH_GAP');
});

test('passes the same mark once the mouth is opened (shipped help-4 16)', () => {
  const d = 'M6.25 5.75A0.75 0.75 0 0 1 7 5L9 5A0.75 0.75 0 0 1 9.75 5.75L9.75 5.94A0.75 0.75 0 0 1 9.53 6.47L8 8';
  assert.ok(selfGap(d, 1.5).gap >= 1.3);
});

test('a single C10 corner at the minimum radius never flags', () => {
  // r 0.75 brings its own tangent points 1.06 apart - legal, and indistinguishable
  // from a bad counter on a ruler. It turns 90 deg, so it is never judged.
  assert.equal(selfGap('M4 8L4 5A0.75 0.75 0 0 1 4.75 4.25L8 4.25', 1.5), null);
});

test('a straight run has nothing to check', () => {
  assert.equal(selfGap('M3.75 12h16.5', 1.5), null);
});

test('catches a bowl too small to hold its own counter', () => {
  // centre (8, 6.5) r 1.25 swept 245 deg - the "stuffed coil" shape. Its counter is
  // 2r - stroke = 1.0 and its mouth is tighter still at 0.61; selfGap reports the
  // narrowest, which is the mouth. Either way it is under MIN_GAP and must flag.
  const got = selfGap('M6.87 5.97A1.25 1.25 0 1 1 8 7.75', 1.5).gap;
  assert.ok(got < 1.5, `expected a flag, got ${got}`);
  near(got, 0.61, 0.1);
});

test('passes the same bowl at r 1.75 (shipped help 16)', () => {
  assert.ok(selfGap('M6.41 5.76A1.75 1.75 0 1 1 8 8.25', 1.5).gap >= 1.4);
});

test('a closed circle is never judged against itself', () => {
  // Going the short way round, no two points on a circle are more than 180 deg
  // apart, so a ring, a disc and a dot all return null rather than reading as
  // touching themselves at the seam. A circle's hole is a radius, not a counter.
  assert.equal(selfGap('M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z', 1.5), null);
  assert.equal(selfGap('M11.5 16.75A0.5 0.5 0 1 0 12.5 16.75A0.5 0.5 0 1 0 11.5 16.75Z', 1.5), null);
  assert.equal(selfGap('M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z', 0), null);
});

test('an S unwinds: reversing curvature is not doubling back', () => {
  // help 24: bowl, then a reverse tuck. Signed turn cancels, so the tuck does not
  // count toward the wrap that brought the bowl round.
  const d = 'M9.01 9.49A3 3 0 1 1 12.83 12.63A1.14 1.14 0 0 0 12 13.73';
  assert.ok(selfGap(d, 1.5).gap >= 1.5, 'shipped help 24 must pass');
});

test('a half-circle bowl is judged, though the grid rounds its sweep under 180', () => {
  // help-3's proposed 16: bowl r1.5 centred (7.75, 6.25) swept 180 deg, then a
  // straight 45 deg tangent tail. Its ends sit on the diagonal, where 2 dp turns
  // 1.0607 into 1.06 and the sweep into 175.96 - so a 180 gate never judged it and
  // the mark passed lint with its counter, its mouth and its knockout all unseen.
  const d = 'M6.69 5.19A1.5 1.5 0 0 1 8.81 7.31L8 8.12';
  const got = selfGap(d, 1.5);
  assert.ok(got, 'a half-circle bowl must be judged');
  near(got.gap, 1.5);           // 2r - stroke, the counter
});

test('a 135 deg bend - the widest C10 allows - is still never judged', () => {
  assert.equal(selfGap('M4 4L8 8A0.75 0.75 0 0 1 7.47 9.28L4 10.31', 1.5), null);
});

// ─── masters.mjs: the stroke is per master, and what follows it ──────────────
// Written for plans/stroke-16.md card 2. The point of these is that flipping
// STROKES[16] to 1.25 is the WHOLE change: the grid, the decimal ceiling and
// C10's bend minimum move with it, and the gap floor does not. So wherever it
// can be done, the derivation is tested with an explicit weight rather than by
// asking what the 16 master happens to be today.
const masters = Object.keys(MASTERS).map(Number);

test('every master declares its own stroke', () => {
  assert.deepEqual(Object.keys(STROKES).map(Number).sort(), masters.slice().sort());
  for (const m of masters) assert.equal(strokeOf(m), STROKES[m], `strokeOf(${m})`);
  assert.equal(strokeOf(24), 1.5);
  assert.equal(strokeOf(20), 1.5);
  // 16 is mid-transition (C7 amended 2026-09-20): 1.5 until the conversion lands,
  // 1.25 after. Either is legal here; nothing else in these tests depends on which.
  assert.ok([1.5, 1.25].includes(strokeOf(16)), `16 is ${strokeOf(16)}`);
});

test('weightOf picks the style first, then the master', () => {
  for (const m of masters) {
    assert.equal(weightOf('check', m), strokeOf(m), `outline at ${m}`);
    assert.equal(weightOf('check.svg', m), strokeOf(m), `outline at ${m}, with extension`);
    assert.equal(weightOf('check-filled', m), FILLED_WEIGHT[m], `filled at ${m}`);
    assert.equal(weightOf('check-filled.svg', m), FILLED_WEIGHT[m], `filled at ${m}, with extension`);
  }
  // a name that merely contains the word is not a filled file
  assert.equal(weightOf('filled-box', 24), strokeOf(24));
});

test('the gap floor is 1.5 units whatever the stroke does', () => {
  // MIN_GAP is a literal, not strokeOf(master): the floor is what survives a 16px
  // render, so a lighter line leaves more air rather than a narrower gap.
  assert.equal(MIN_GAP, 1.5);
  assert.equal(GLYPH_GAP, 1);
  for (const m of masters) assert.equal(MIN_GAP, 1.5, `floor at ${m} (stroke ${strokeOf(m)})`);
});

test('C10: the bend minimum is half the weight the mark is drawn at', () => {
  assert.equal(bendMin(1.5), 0.75);          // outline at 24 / 20, and 16 today
  assert.equal(bendMin(1.25), 0.625);        // outline at 16 after the flip
  assert.equal(bendMin(2.5), 1.25);          // filled line icon at 24
  assert.equal(bendMin(2), 1);               // filled line icon at 20 / 16
  for (const m of masters) {
    assert.equal(bendMin(strokeOf(m)), strokeOf(m) / 2, `outline bend at ${m}`);
    assert.equal(bendMin(FILLED_WEIGHT[m]), FILLED_WEIGHT[m] / 2, `filled bend at ${m}`);
  }
});

test('the grid and the decimal ceiling are derived from the stroke', () => {
  // A container's outer edge is on a whole pixel only when its centreline sits at
  // edge ∓ stroke/2. Half of 1.5 is 0.75 — already a quarter. Half of 1.25 is
  // 0.625, which is not, so that master needs eighths and a third decimal.
  assert.equal(gridFor(1.5), 0.25);
  assert.equal(decimalsFor(1.5), 2);
  assert.equal(gridNameFor(1.5), 'quarter');
  assert.equal(gridFor(1.25), 0.125);
  assert.equal(decimalsFor(1.25), 3);
  assert.equal(gridNameFor(1.25), 'eighth');
  assert.equal(gridFor(2), 0.25);            // filled weights stay on quarters
  assert.equal(gridFor(2.5), 0.25);
});

test('gridOf and decimalsOf apply that derivation per master', () => {
  for (const m of masters) {
    assert.equal(gridOf(m), gridFor(strokeOf(m)), `grid at ${m}`);
    assert.equal(decimalsOf(m), decimalsFor(strokeOf(m)), `decimals at ${m}`);
  }
  assert.equal(gridOf(24), 0.25);
  assert.equal(decimalsOf(24), 2);
});

test('the eighth grid only ever widens the quarter grid', () => {
  // Why the allowance is per master and not per style: the 16 filled files are not
  // being redrawn, and they must keep passing. Every quarter IS an eighth and 2 dp
  // is within 3, so loosening the master never rejects a drawing it accepted.
  for (const v of [0, 0.25, 0.75, 3.75, 8.5, 12, 20.25]) {
    assert.ok(Number.isInteger(v / gridFor(1.5)), `${v} is on the quarter grid`);
    assert.ok(Number.isInteger(v / gridFor(1.25)), `${v} is still on the eighth grid`);
  }
  assert.ok(decimalsFor(1.25) >= decimalsFor(1.5));
  assert.ok(gridFor(1.25) < gridFor(1.5));
});
