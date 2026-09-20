// Tests for selfGap — the measure docs/08 §6.4 calls "the hard one", written twice
// before and wrong both times. The fixtures are the two drawings that got through
// lint clean in one session (2026-09-18) plus the bends that must NOT flag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { materialGap, selfGap } from './geometry.mjs';
import { lintSource, parseBoxNote } from './lint.mjs';
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

// ── materialGap: what a knockout leaves standing ─────────────────────────────
// Lint's knockout check used to infer this from the OUTLINE twin (cut width = twice the
// furthest the knockout strays from the outline's centreline), which is only true while
// the cut is centred on the outline. These pin the measure to the filled drawing alone.

const DISC16 = 'M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8Z';
const PLATE = 'M0 0H14V14H0Z';

test('help-4-filled at 16 reads its own mouth: 1.13, whatever the outline does', () => {
  // The shipped knockout, unchanged since it was approved. Exact geometry: the start cap
  // is A0.88 over a 1.75 chord, so its centre sits 0.094 above the chord at (6.255, 5.656),
  // 2.014 from the diagonal's inner edge (x + y = 14.76) - 1.134 of material. The old
  // twin-derived reading was 1.07 against the 1.5 outline and 0.91 against the 1.25 one.
  const d = `${DISC16}M7 10.75A1 1 0 1 0 9 10.75A1 1 0 1 0 7 10.75ZM7.13 5.75L7 5.88L9 5.88L8.88 5.75L8.88 5.94L8.91 5.85L7.38 7.38A0.88 0.88 0 0 0 8.62 8.62L10.15 7.09A1.63 1.63 0 0 0 10.63 5.94L10.63 5.75A1.63 1.63 0 0 0 9 4.13L7 4.13A1.63 1.63 0 0 0 5.38 5.75A0.88 0.88 0 0 0 7.13 5.75Z`;
  const got = materialGap(d);
  near(got.gap, 1.13, 0.02);
  assert.equal(got.sub, 2, 'measured on the ? knockout, not the disc or the dot');
  assert.ok(got.gap >= GLYPH_GAP, 'passes C19 on its own geometry');
});

test('two round caps facing each other: help-filled at 16 reads 1.23', () => {
  // cap centres (6.446, 5.693) and (8, 8.25), both r 0.88: 2.992 apart, 1.232 of material
  const d = `${DISC16}M5.62 5.39A2.63 2.63 0 1 1 8 9.13A0.88 0.88 0 0 1 8 7.37A0.87 0.87 0 1 0 7.21 6.13A0.88 0.88 0 0 1 5.62 5.39Z`;
  near(materialGap(d).gap, 1.23, 0.02);
});

test('reads the tongue between the legs of a U, never the width of the cut', () => {
  // legs 1 wide, 2 apart: the cut's own width joins the same two walls through the hole
  const u = (x) => `M4 4H5V9H${x}V4H${x + 1}V10H4Z`;
  assert.equal(materialGap(PLATE + u(7)).gap, 2);
  // an over-cut knockout still fires: the same U with its legs 0.8 apart
  const tight = materialGap(PLATE + u(5.8));
  assert.equal(tight.gap, 0.8);
  assert.ok(tight.gap < GLYPH_GAP);
  assert.deepEqual(tight.at, [5.4, 4]);
});

test('the inside of a bend is not a gap', () => {
  // a 90 deg chevron knocked out of a plate: across its inside corner every chord sits
  // 45 deg off both walls and shrinks to nothing at the apex
  assert.equal(materialGap(`${PLATE}M3 5L7 9L11 5L11 7L7 11L3 7Z`), null);
});

test('two corners pointing at each other count, though neither wall is square-on', () => {
  // a C whose arms end in points 3 apart; at a point the wall has no single normal
  const c = 'M7 5L9 3.5L12 3.5L12 9.5L9 9.5L7 8L9 8.5L11 8.5L11 4.5L9 4.5Z';
  const got = materialGap(PLATE + c);
  assert.equal(got.gap, 3);
  assert.deepEqual(got.at, [7, 6.5]);
});

test('a hairline loop left by a collapsed fillet is not a neck', () => {
  // help-filled at 20 carries an arc of radius 0.02 where the hook meets its cap; evenodd
  // paints the loop as a sliver 0.003 across. The mouth is what should be read: 1.99.
  const d = 'M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM6.92 7.46A3.13 3.13 0 1 1 10.86 11.01A-0.02 -0.02 0 0 0 10.88 10.99A0.88 0.88 0 0 1 9.12 10.99A1.74 1.74 0 0 1 10.38 9.32A1.37 1.37 0 1 0 8.65 7.76A0.88 0.88 0 0 1 6.92 7.46Z';
  near(materialGap(d).gap, 1.99, 0.02);
});

test('only holes are judged: a dot has no neck, and a thin solid is not a knockout', () => {
  assert.equal(materialGap(`${DISC16}M7 10.75A1 1 0 1 0 9 10.75A1 1 0 1 0 7 10.75Z`), null);
  assert.equal(materialGap('M2 7H12V8H2Z'), null);              // a 1-thick bar: material, not a cut
  assert.equal(materialGap([PLATE, 'M2 16H12V17H2Z']), null);   // several areas, still no hole
});

test('a wall that a second area paints over is no longer an edge', () => {
  // a file's areas are drawn together, so material is whatever any of them fills: with
  // the left leg filled back in, the tongue is the middle of a solid and not a neck
  const u = 'M4 4H5V9H5.8V4H6.8V10H4Z';
  assert.equal(materialGap([PLATE + u]).gap, 0.8);
  assert.equal(materialGap([PLATE + u, 'M3.9 3.9H5.1V9.1H3.9Z']), null);
});

test('an island left inside a ring-shaped cut is measured across', () => {
  // a square ring knocked out of the plate leaves an island 0.8 wide: a hole inside out
  const got = materialGap(`${PLATE}M3 3H11V11H3ZM6.6 5H7.4V9H6.6Z`);
  assert.equal(got.gap, 0.8);
  assert.equal(got.sub, 2);
  // the plate itself is never judged, however thin: its thickness is a drawing decision
  assert.equal(materialGap('M0 0H14V0.8H0Z'), null);
});

test('a tapering tongue is read at its tip, to within one fine step', () => {
  // walls 8 deg off the axis each (16 deg of taper), free tip 0.9 wide. Walked at the
  // 0.25 of samplePath this read 0.97 - enough to pass a 0.95 neck at a floor of 1.
  const tongue = (half, base) => `${PLATE}M4 4H10V11H${7 + base}L${7 + half} 5L${7 - half} 5L${7 - base} 11H4Z`;
  near(materialGap(tongue(0.45, 1.15)).gap, 0.9, 0.02);
  // the gate's blind side, stated rather than hidden: at 30 deg of taper the chords sit
  // 15 deg off each wall and the wedge is treated as the inside of a bend, like selfGap's 170
  assert.equal(materialGap(tongue(0.45, 0.45 + 6 * Math.tan(Math.PI / 12))), null);
});

test('help-3-filled at 16 reads the island inside its bowl: 1.23', () => {
  // The tightest reading against the facing gate in the set: the span joins two corners
  // of the r0.63 inner arc, 6 deg off-normal at one end because 2 dp leaves small kinks
  // at the arc's joins. Pinned so a change to FACING cannot turn it into a silent null.
  const d = readFileSync(new URL('../src/icons/16/help-3-filled.svg', import.meta.url), 'utf8').match(/ d="([^"]+)"/)[1];
  near(materialGap(d).gap, 1.23, 0.02);
});

test('a span that crosses a second hole is two spans, not one', () => {
  // the U's tongue is 3 wide, x 4 to 7, y 4 to 9. A 1-wide slot cut down its middle to
  // y 8.475 leaves the two walls joined through material only in the half unit below it
  const u = 'M3 4H4V9H7V4H8V10H3Z';
  assert.deepEqual(materialGap(PLATE + u).at, [5.5, 4]);
  const got = materialGap(`${PLATE}${u}M5 3H6V8.475H5Z`);
  assert.equal(got.gap, 3);
  assert.equal(got.sub, 1);
  assert.ok(got.at[1] > 8.475, `read below the slot, not through it (at y ${got.at[1]})`);
});

// ── lint: an agreed per-icon ink box ─────────────────────────────────────────
// `<!-- box: WxH -->` says "this icon keeps a box of its own" (folder, 2026-09-20):
// lint stops asking it to match a keyline and holds it to the declared size instead.
// The note is only worth having if it cannot hide a mistake, so a drawing that does
// not measure what it declares is an error, and so is a note lint cannot read.

const FOLDER24 = readFileSync(new URL('../src/icons/24/folder.svg', import.meta.url), 'utf8');
const lintFolder = (src) => lintSource(24, 'folder.svg', src);
const noKeyline = (r) => r.warnings.filter((w) => w.includes('keyline'));

test('parseBoxNote reads a size and refuses anything else', () => {
  assert.deepEqual(parseBoxNote('<!-- box: 20x18 -->'), { w: 20, h: 18, raw: '20x18' });
  assert.deepEqual(parseBoxNote('<!-- box: 13.5x10 -->'), { w: 13.5, h: 10, raw: '13.5x10' });
  assert.equal(parseBoxNote('<!-- box: 16 × 14 -->').w, 16);      // unicode ×, spaces round it
  assert.equal(parseBoxNote('<!-- box:16x14-->').h, 14);
  assert.equal(parseBoxNote('<!-- tags: plain -->'), null);
  assert.equal(parseBoxNote('<!-- Plain: Folder box, this icon only: 20x18 -->'), null);  // prose, not the note
  assert.deepEqual(parseBoxNote('<!-- box: big -->'), { raw: 'big', bad: true });
  assert.ok(parseBoxNote('<!-- box: 20 -->').bad);
});

test('a declared box that matches: no keyline warning, no error', () => {
  const r = lintFolder(FOLDER24);                                  // shipped folder is 20×18
  assert.deepEqual(r.errors, []);
  assert.deepEqual(noKeyline(r), []);
  assert.ok(r.notes.some((n) => n.includes('20×18  agreed box  centre 12,12')), r.notes.join(' | '));
});

test('a declared box the drawing does not measure is an ERROR', () => {
  const r = lintFolder(FOLDER24.replace('box: 20x18', 'box: 20x17.5'));
  assert.equal(r.errors.length, 1, r.errors.join(' | '));
  assert.match(r.errors[0], /declares box 20x17\.5 but the ink is 20×18 — the agreed size and the drawing disagree/);
  // and 0.01 is the tolerance, not a free quarter unit
  assert.equal(lintFolder(FOLDER24.replace('box: 20x18', 'box: 20x18.005')).errors.length, 0);
  assert.equal(lintFolder(FOLDER24.replace('box: 20x18', 'box: 20x18.02')).errors.length, 1);
});

test('a box note lint cannot read is an ERROR, never a silent pass', () => {
  const r = lintFolder(FOLDER24.replace('box: 20x18', 'box: big'));
  assert.equal(r.errors.length, 1, r.errors.join(' | '));
  assert.match(r.errors[0], /is not a size/);
});

test('declaring both `keyline: mark` and a box is an ERROR', () => {
  const r = lintFolder(FOLDER24.replace('<!-- box: 20x18 -->', '<!-- keyline: mark -->\n  <!-- box: 20x18 -->'));
  assert.ok(r.errors.some((e) => /declares both/.test(e)), r.errors.join(' | '));
});

test('without the note nothing changes: the keyline warning comes back', () => {
  const r = lintFolder(FOLDER24.replace('  <!-- box: 20x18 -->\n', ''));
  assert.deepEqual(r.errors, []);
  assert.equal(noKeyline(r).length, 1);
  assert.match(noKeyline(r)[0], /20×18 matches no keyline/);
  assert.ok(r.notes.some((n) => n.includes('no keyline match')));
});

test('the box does not excuse the margin or the centre', () => {
  // a 20×18 box, exactly as declared, but sitting 2 to the right: the ink runs to x 24
  const moved = FOLDER24.replace(/ d="[^"]+"/, ' d="M6.75 3.75H25.25V20.25H6.75Z"');
  const r = lintFolder(moved);
  assert.deepEqual(r.errors.filter((e) => /agreed size/.test(e)), [], 'the box itself still matches');
  assert.ok(r.errors.some((e) => /crosses the margin/.test(e)), r.errors.join(' | '));
  assert.ok(r.warnings.some((w) => /off-centre/.test(w)), r.warnings.join(' | '));
});
