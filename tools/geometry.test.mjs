// Tests for selfGap — the measure docs/08 §6.4 calls "the hard one", written twice
// before and wrong both times. The fixtures are the two drawings that got through
// lint clean in one session (2026-09-18) plus the bends that must NOT flag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { anatomy, armTipGap, facingGap, insideAir, isSolidDot, isSolidStroke, materialGap, ringHole, selfGap } from './geometry.mjs';
import { checkAnchors, checkBases, checkPairs, checkTwins, comparePair, lintSource, offsetText, parseAnchorNote, parseBadgeNote, parseBaseNote, parseBoxNote, parseGapNote, parseGlyphNote, parseGrowsNote, stateShape } from './lint.mjs';
import { candidateFiles, planArg } from './draft-svg.mjs';
import {
  FILLED_WEIGHT, GLYPH_GAP, MASTERS, MIN_GAP, STROKES, bendMin, decimalsFor, decimalsOf,
  gridFor, gridNameFor, gridOf, strokeOf, weightOf,
} from './masters.mjs';

const near = (got, want, tol = 0.06) =>
  assert.ok(Math.abs(got - want) <= tol, `expected ~${want}, got ${got}`);

test('catches a closed mouth: help-circle-4 16 as first drawn', () => {
  const d = 'M6.5 7L6.5 6A1 1 0 0 1 7.5 5L8.5 5A1 1 0 0 1 9.5 6L9.5 6.09A1 1 0 0 1 9.21 6.79L8 8';
  const got = selfGap(d, 1.5).gap;
  near(got, 0.30);
  // it must still fail under C19's looser floor for the inside of a character,
  // or extending C19 to the mouth would have disarmed the check that found it
  assert.ok(got < 1.0, 'must fail even at GLYPH_GAP');
});

test('passes the same mark once the mouth is opened (shipped help-circle-4 16)', () => {
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
  // help-circle-3's proposed 16: bowl r1.5 centred (7.75, 6.25) swept 180 deg, then a
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

test('help-circle-4-filled at 16 reads its own mouth: 1.13, whatever the outline does', () => {
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

test('help-circle-3-filled at 16 reads the island inside its bowl: 1.23', () => {
  // The tightest reading against the facing gate in the set: the span joins two corners
  // of the r0.63 inner arc, 6 deg off-normal at one end because 2 dp leaves small kinks
  // at the arc's joins. Pinned so a change to FACING cannot turn it into a silent null.
  const d = readFileSync(new URL('../src/icons/16/help-circle-3-filled.svg', import.meta.url), 'utf8').match(/ d="([^"]+)"/)[1];
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

// ── lint: the pair — a filled drawing's ink box is its outline twin's ────────
// Settled ("Exact placement"): the two styles of one icon at one master occupy the same
// ink box, to 2 dp. Until 2026-09-20 nothing compared them (docs/09 §2). `comparePair`
// is pure — two boxes and an optional note — so these need no drawing on disk, and
// `checkPairs` is handed a plain Map for the same reason.
// Signs read OUTWARD on every side: + is filled ink standing proud of the outline's.

const BOX = (x0, y0, x1, y1) => ({ x0, y0, x1, y1 });
const pairWarn = (r) => r.warnings.filter((w) => w.includes('ink box differs'));

test('a pair in the same ink box is clean and says nothing', () => {
  const r = comparePair(BOX(4.5, 6.75, 19.5, 17.25), BOX(4.5, 6.75, 19.5, 17.25));
  assert.deepEqual(r, { errors: [], warnings: [], notes: [] });
  // 0.01 is the tolerance, and it is a tolerance, not a free eighth
  assert.deepEqual(comparePair(BOX(4.5, 6.75, 19.5, 17.25), BOX(4.505, 6.75, 19.5, 17.25)).warnings, []);
  assert.equal(comparePair(BOX(4.5, 6.75, 19.5, 17.25), BOX(4.52, 6.75, 19.5, 17.25)).warnings.length, 1);
});

test('an undeclared difference is a WARNING, with the four sides and both boxes', () => {
  // the shipped `menu` at 24, measured 2026-09-20: the stack thickens in place (C17),
  // so the filled ink stands 0.5 proud top and bottom and the sides do not move
  const r = comparePair(BOX(4.5, 6.25, 19.5, 17.75), BOX(4.5, 6.75, 19.5, 17.25));
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings.length, 1);
  assert.match(r.warnings[0], /^ink box differs from the outline's: left 0 · right 0 · top \+0\.5 · bottom \+0\.5 \(filled 15×11\.5 vs outline 15×10\.5\) — Settled: filled box = outline box$/);
});

test('an eighth-grid difference at 16 prints as 0.375, not a rounded 0.38', () => {
  // shipped `minus` at 16: outline 1.25 thick, filled 2 — half the extra each side
  const r = comparePair(BOX(2, 7, 14, 9), BOX(2, 7.375, 14, 8.625));
  assert.match(r.warnings[0], /top \+0\.375 · bottom \+0\.375/);
  assert.match(r.warnings[0], /filled 12×2 vs outline 12×1\.25/);
});

test('filled ink pulled INSIDE the outline reads negative', () => {
  const r = comparePair(BOX(5, 5, 19, 19), BOX(4.5, 5, 19.5, 19));
  assert.match(r.warnings[0], /left -0\.5 · right -0\.5 · top 0 · bottom 0/);
});

test('parseGrowsNote reads four signed numbers and refuses anything else', () => {
  assert.deepEqual(parseGrowsNote('<!-- grows: 0 0 0.5 0.5 -->'), { l: 0, r: 0, t: 0.5, b: 0.5, raw: '0 0 0.5 0.5' });
  assert.deepEqual(parseGrowsNote('<!-- grows: -0.25 +0.25 0 0 -->').l, -0.25);
  assert.equal(parseGrowsNote('<!-- grows:0 0 0.375 0.375-->').t, 0.375);
  assert.equal(parseGrowsNote('<!-- box: 20x18 -->'), null);
  assert.ok(parseGrowsNote('<!-- grows: 0 0 0.5 -->').bad, 'three numbers is not four');
  assert.ok(parseGrowsNote('<!-- grows: 0 0 0.5 0.5 0.5 -->').bad, 'five numbers is not four');
  assert.ok(parseGrowsNote('<!-- grows: 0,0,0.5,0.5 -->').bad, 'commas are not spaces');
  assert.ok(parseGrowsNote('<!-- grows: a bit taller -->').bad);
});

test('a declared growth the drawings measure: clean, with a note saying so', () => {
  const grows = parseGrowsNote('<!-- grows: 0 0 0.5 0.5 -->');
  const r = comparePair(BOX(4.5, 6.25, 19.5, 17.75), BOX(4.5, 6.75, 19.5, 17.25), grows);
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
  assert.deepEqual(r.notes, ['agreed growth 0 0 0.5 0.5']);
});

test('a declared growth the drawings do NOT measure is an ERROR', () => {
  // the note may never hide a mistake: declare the C17 growth, then draw it 0.25 wider
  const grows = parseGrowsNote('<!-- grows: 0 0 0.5 0.5 -->');
  const r = comparePair(BOX(4.25, 6.25, 19.75, 17.75), BOX(4.5, 6.75, 19.5, 17.25), grows);
  assert.deepEqual(r.warnings, [], 'an error, not a warning — a wrong note is worse than no note');
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /declares growth 0 0 0\.5 0\.5 but the filled ink measures left \+0\.25 · right \+0\.25 · top \+0\.5 · bottom \+0\.5 — the agreed growth and the drawings disagree/);
  // and a note of zeroes does not excuse a difference either
  assert.equal(comparePair(BOX(4.5, 6.25, 19.5, 17.75), BOX(4.5, 6.75, 19.5, 17.25),
    parseGrowsNote('<!-- grows: 0 0 0 0 -->')).errors.length, 1);
});

test('a grows note lint cannot read is an ERROR, never a silent pass', () => {
  const src = FOLDER24.replace('<!-- box: 20x18 -->', '<!-- grows: a bit taller -->');
  const r = lintSource(24, 'folder-filled.svg', src);
  assert.ok(r.errors.some((e) => /grows note "a bit taller" is not four numbers/.test(e)), r.errors.join(' | '));
  assert.equal(r.grows, null, 'an unreadable note is dropped, not half-believed');
});

test('only a -filled file may declare `grows`', () => {
  const r = lintSource(24, 'folder.svg', FOLDER24.replace('<!-- box: 20x18 -->', '<!-- grows: 0 0 0.5 0.5 -->'));
  assert.ok(r.errors.some((e) => /only a `-filled` file may declare/.test(e)), r.errors.join(' | '));
  assert.equal(r.grows, null);
});

test('checkPairs finds the twin in the same master and judges once, on the filled file', () => {
  const results = new Map([
    ['24/menu.svg', { errors: [], warnings: [], notes: ['head'], ink: BOX(4.5, 6.75, 19.5, 17.25), grows: null }],
    ['24/menu-filled.svg', { errors: [], warnings: [], notes: ['head'], ink: BOX(4.5, 6.25, 19.5, 17.75), grows: null }],
  ]);
  checkPairs(results);
  assert.deepEqual(results.get('24/menu.svg').warnings, [], 'the outline half stays quiet');
  assert.equal(pairWarn(results.get('24/menu-filled.svg')).length, 1);
});

test('a missing twin is a warning on whichever file exists', () => {
  const lone = (key) => {
    const r = { errors: [], warnings: [], notes: ['head'], ink: BOX(4.5, 6.75, 19.5, 17.25), grows: null };
    checkPairs(new Map([[key, r]]));
    return r.warnings;
  };
  assert.equal(lone('24/menu.svg').length, 1);
  assert.match(lone('24/menu.svg')[0], /no filled twin `menu-filled\.svg` at 24 — an icon ships as a pair/);
  assert.match(lone('24/menu-filled.svg')[0], /no outline twin `menu\.svg` at 24/);
  // and a twin at a DIFFERENT master is not a twin
  const r = { errors: [], warnings: [], notes: ['head'], ink: BOX(4.5, 6.75, 19.5, 17.25), grows: null };
  checkPairs(new Map([['24/menu-filled.svg', r], ['20/menu.svg', { errors: [], warnings: [], notes: [], ink: null, grows: null }]]));
  assert.match(r.warnings[0], /no outline twin/);
});

test('the shipped set: `more-horizontal` at 24 is C17 thickening in place', () => {
  // measured from src this session, not recalled: both styles carry the SAME three
  // r0.75 discs, so the whole difference is half the weight step (1.5 → 2.5) on all
  // four sides. The reading a `<!-- grows: 0.5 0.5 0.5 0.5 -->` note would have to match.
  const ink = (f) => lintSource(24, f, readFileSync(new URL(`../src/icons/24/${f}`, import.meta.url), 'utf8')).ink;
  const r = comparePair(ink('more-horizontal-filled.svg'), ink('more-horizontal.svg'));
  assert.match(r.warnings[0], /left \+0\.5 · right \+0\.5 · top \+0\.5 · bottom \+0\.5 \(filled 16×4 vs outline 15×3\)/);
  assert.deepEqual(comparePair(ink('more-horizontal-filled.svg'), ink('more-horizontal.svg'),
    parseGrowsNote('<!-- grows: 0.5 0.5 0.5 0.5 -->')), { errors: [], warnings: [], notes: ['agreed growth 0.5 0.5 0.5 0.5'] });
});

// ── lint: an agreed per-file gap ─────────────────────────────────────────────
// `<!-- gap: N -->` says "this drawing holds N, not §6's 1.5" (attachment-4-filled,
// 2026-09-20: the filled clip keeps all four legs, so the path passes within 1.04 of
// itself at 24 and 1.0 at 20). It replaces MIN_GAP in that file's two proximity checks
// and nowhere else. Like `box` and `grows`, it may not hide a mistake: a note lint
// cannot read, one that is not below MIN_GAP, and one the drawing no longer needs are
// all errors.

const shipped = (m, f) => readFileSync(new URL(`../src/icons/${m}/${f}`, import.meta.url), 'utf8');
const CLIP24 = shipped(24, 'attachment-4-filled.svg');
const CLIP20 = shipped(20, 'attachment-4-filled.svg');
const CLIP16 = shipped(16, 'attachment-4-filled.svg');
const lintClip = (m, src) => lintSource(m, 'attachment-4-filled.svg', src);
const gapWarn = (r) => r.warnings.filter((w) => /comes within|apart/.test(w));

test('parseGapNote reads a distance and refuses anything else', () => {
  assert.deepEqual(parseGapNote('<!-- gap: 1 -->'), { n: 1, raw: '1' });
  assert.deepEqual(parseGapNote('<!-- gap: 1.25 -->'), { n: 1.25, raw: '1.25' });
  assert.equal(parseGapNote('<!-- gap:1.04-->').n, 1.04);
  assert.equal(parseGapNote('<!-- grows: 0 0 0.5 0.5 -->'), null);
  assert.equal(parseGapNote('<!-- box: 20x18 -->'), null);
  assert.ok(parseGapNote('<!-- gap: tight -->').bad);
  assert.ok(parseGapNote('<!-- gap: 1 1 -->').bad, 'a gap is one number');
  assert.ok(parseGapNote('<!-- gap: -1 -->').bad, 'a gap is a distance, so it is positive');
  assert.ok(parseGapNote('<!-- gap: 0 -->').bad);
});

test('the shipped clip declares the gap it holds: clean, with a note saying so', () => {
  // 1.04 at 24 and exactly 1.0 at 20 — the tolerance is what carries the 20
  const r24 = lintClip(24, CLIP24);
  assert.deepEqual(r24.errors, []);
  assert.deepEqual(gapWarn(r24), []);
  assert.ok(r24.notes.some((n) => n === 'agreed gap 1 — smallest measured 1.04'), r24.notes.join(' | '));
  const r20 = lintClip(20, CLIP20);
  assert.deepEqual(r20.errors, []);
  assert.deepEqual(gapWarn(r20), []);
  assert.ok(r20.notes.some((n) => n === 'agreed gap 1 — smallest measured 1'), r20.notes.join(' | '));
  // and the headline note is still the last one, so run() prints it inline
  assert.match(r24.notes.at(-1), /fits circle keyline/);
});

test('without the note nothing changes: the §6 warning comes back', () => {
  const r = lintClip(24, CLIP24.replace('  <!-- gap: 1 -->\n', ''));
  assert.deepEqual(r.errors, []);
  assert.equal(gapWarn(r).length, 1);
  assert.match(gapWarn(r)[0], /comes within 1\.04 of itself at 8\.53,15\.47 — §6 needs 1\.5/);
});

test('a drawing that measures below its declared gap still WARNS, against that number', () => {
  const r = lintClip(24, CLIP24.replace('gap: 1 ', 'gap: 1.25 '));
  assert.deepEqual(r.errors, []);
  assert.equal(gapWarn(r).length, 1);
  assert.match(gapWarn(r)[0], /comes within 1\.04 of itself at 8\.53,15\.47 — agreed gap 1\.25 needs 1\.25/);
  assert.ok(!r.notes.some((n) => n.startsWith('agreed gap')), 'no "in force" note while it is failing');
  // 0.01 is the tolerance, not a free eighth
  assert.deepEqual(gapWarn(lintClip(24, CLIP24.replace('gap: 1 ', 'gap: 1.045 '))), []);
  assert.equal(gapWarn(lintClip(24, CLIP24.replace('gap: 1 ', 'gap: 1.06 '))).length, 1);
});

test('the note covers the path-vs-path check too, not just path-vs-itself', () => {
  // shipped `trash` at 20 warns: paths 2/3 are 2.49 apart, an edge gap of 0.99
  const TRASH20 = shipped(20, 'trash.svg');
  assert.equal(lintSource(20, 'trash.svg', TRASH20).warnings.filter((w) => /apart/.test(w)).length, 1);
  const r = lintSource(20, 'trash.svg', TRASH20.replace(/(<!-- [^>]*-->)/, '<!-- gap: 0.75 -->\n  $1'));
  assert.deepEqual(r.warnings.filter((w) => /apart/.test(w)), [], 'the §6 pair warning is silenced by the note');
  assert.ok(r.notes.some((n) => n === 'agreed gap 0.75 — smallest measured 0.99'), r.notes.join(' | '));
});

test('a gap note lint cannot read is an ERROR, never a silent pass', () => {
  const r = lintClip(24, CLIP24.replace('gap: 1 ', 'gap: tight '));
  assert.ok(r.errors.some((e) => /gap note "tight" is not a distance/.test(e)), r.errors.join(' | '));
  assert.equal(r.gap, null, 'an unreadable note is dropped, not half-believed');
  assert.equal(gapWarn(r).length, 1, 'and the drawing is judged at §6 again');
});

test('a gap that is not BELOW §6 is an ERROR — the note only ever lowers the floor', () => {
  for (const n of [1.5, 2]) {
    const r = lintClip(24, CLIP24.replace('gap: 1 ', `gap: ${n} `));
    assert.ok(r.errors.some((e) => new RegExp(`declares gap ${n}, which is not below §6's 1\\.5`).test(e)), r.errors.join(' | '));
    assert.equal(r.gap, null);
  }
  assert.deepEqual(lintClip(24, CLIP24.replace('gap: 1 ', 'gap: 1.49 ')).errors, [], '1.49 is below 1.5 and is allowed');
});

test('a stale gap note — the drawing already holds §6 — is an ERROR', () => {
  // the clip at 16 measures 1.86, so it never needed the note
  const r = lintClip(16, CLIP16.replace(/(<!-- tags:[^>]*-->)/, '$1\n  <!-- gap: 1 -->'));
  assert.deepEqual(gapWarn(r), []);
  assert.equal(r.errors.length, 1, r.errors.join(' | '));
  assert.match(r.errors[0], /declares gap 1 but nothing in this drawing comes within §6's 1\.5 \(smallest measured 1\.86\) — the note is not needed; delete it/);
});

test('a gap note on a drawing with nothing to measure is an ERROR too', () => {
  const r = lintSource(24, 'minus.svg', shipped(24, 'minus.svg').replace(/(<!--)/, '<!-- gap: 1 -->\n  $1'));
  assert.ok(r.errors.some((e) => /the note is not needed/.test(e)), r.errors.join(' | '));
  assert.ok(!/smallest measured/.test(r.errors.find((e) => /not needed/.test(e))), 'nothing measured, so no number is invented');
});

// --- level families (C28): `<!-- anchor: NAME -->` ------------------------------------
// A member keeps its full member's canvas position, so it is neither centred nor on a
// keyline; the note swaps those two warnings for "inside the full member's box". Fixture:
// a speaker and two straight "waves" at 24. The full member spans 2,4 → 22,20 — the 20×16
// landscape keyline, centred on 12,12. The one-wave member drops the outer wave and keeps
// the rest in place: 15×16, centre 9.5,12.
const ROOT24 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
const SPEAKER = 'M2.75 8.75H7.25L11.25 4.75V19.25L7.25 15.25H2.75Z';
const WAVE1 = 'M16.25 9.25V14.75', WAVE2 = 'M21.25 6.75V17.25';
const icon = (ds, notes = []) => [ROOT24, ...notes.map((n) => `  <!-- ${n} -->`), ...ds.map((d) => `  <path d="${d}"/>`), '</svg>', ''].join('\n');
const FULL = icon([SPEAKER, WAVE1, WAVE2]);
const LOW = icon([SPEAKER, WAVE1], ['anchor: volume']);
const family = (files) => checkAnchors(new Map(Object.entries(files).map(([f, src]) => [`24/${f}`, lintSource(24, f, src)])));
const placement = (r) => r.warnings.filter((w) => /keyline|off-centre/.test(w));

test('parseAnchorNote reads an icon name and refuses anything else', () => {
  assert.deepEqual(parseAnchorNote('<!-- anchor: volume -->'), { name: 'volume', raw: 'volume' });
  assert.equal(parseAnchorNote('<!--anchor:volume-2-->').name, 'volume-2');
  assert.equal(parseAnchorNote('<!-- box: 20x18 -->'), null);
  assert.ok(parseAnchorNote('<!-- anchor: Volume -->').bad);
  assert.ok(parseAnchorNote('<!-- anchor: volume low -->').bad);
  assert.ok(parseAnchorNote('<!-- anchor: volume-filled -->').bad, 'the note names the outline; a filled file finds NAME-filled itself');
});

test('the fixture: the full member is clean, the member without the note warns twice', () => {
  const r = family({ 'volume.svg': FULL, 'volume-low.svg': LOW.replace('  <!-- anchor: volume -->\n', '') });
  assert.deepEqual(r.get('24/volume.svg').warnings, []);
  assert.match(r.get('24/volume.svg').notes.at(-1), /20×16  fits landscape keyline  centre 12,12/);
  assert.deepEqual(placement(r.get('24/volume-low.svg')), ['15×16 matches no keyline (§2) — if this is a directional mark, declare <!-- keyline: mark -->', 'off-centre at 9.5,12']);
});

test('an anchored member inside its full member: no keyline or centre warning, an info line instead', () => {
  const r = family({ 'volume.svg': FULL, 'volume-low.svg': LOW }).get('24/volume-low.svg');
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
  assert.ok(r.notes.includes('anchored to volume: ink 2,4 → 17,20 inside 2,4 → 22,20'), r.notes.join(' | '));
  assert.ok(r.notes.includes("2 of 2 paths identical to volume's"), r.notes.join(' | '));
  assert.equal(r.notes.at(-1), '15×16  anchored to volume  centre 9.5,12', 'the headline stays last');
  // whitespace is not a difference; a moved point is
  const spaced = LOW.replace(WAVE1, 'M16.25  9.25 V14.75');
  assert.ok(family({ 'volume.svg': FULL, 'volume-low.svg': spaced }).get('24/volume-low.svg').notes.includes("2 of 2 paths identical to volume's"));
  const moved = LOW.replace(WAVE1, 'M16.25 9.5V14.5');
  assert.ok(family({ 'volume.svg': FULL, 'volume-low.svg': moved }).get('24/volume-low.svg').notes.includes("1 of 2 paths identical to volume's"));
});

test('ink outside the full member\'s box is an ERROR', () => {
  const r = family({ 'volume.svg': FULL, 'volume-low.svg': LOW.replace(WAVE1, 'M16.25 3.75V14.75') }).get('24/volume-low.svg');
  assert.equal(r.errors.length, 1, r.errors.join(' | '));
  assert.match(r.errors[0], /^ink 2,3 → 17,20 runs outside volume's 2,4 → 22,20 on the top by 1 — a level family's members stay inside the full member's box \(C28\)$/);
  // 0.01 is the tolerance, not a free quarter
  const r2 = family({ 'volume.svg': FULL, 'volume-low.svg': LOW.replace(WAVE1, 'M16.25 4.5V14.75') }).get('24/volume-low.svg');
  assert.match(r2.errors[0] ?? '', /on the top by 0\.25/);
});

test('a member re-centred inside the full member\'s box is an ERROR: the body moved', () => {
  // the one-wave member slid 2.5 right: 4.5 → 19.5, centred on 12 and still inside 2 → 22
  const shift = (d) => d.replace(/([MHL])([\d.]+)/g, (_, c, x) => `${c}${+x + 2.5}`);
  const r = family({ 'volume.svg': FULL, 'volume-low.svg': icon([shift(SPEAKER), shift(WAVE1)], ['anchor: volume']) }).get('24/volume-low.svg');
  assert.deepEqual(r.errors, ["ink x 4.5 → 19.5 shares neither side of volume's 2 → 22 — the body moves; a level family keeps it in place (C28)"]);
  // sharing the right side instead is allowed (a body drawn on the right, waves to its left)
  const right = (d) => d.replace(/([MHL])([\d.]+)/g, (_, c, x) => `${c}${+x + 5}`);
  assert.deepEqual(family({ 'volume.svg': FULL, 'volume-low.svg': icon([right(SPEAKER), right(WAVE1)], ['anchor: volume']) }).get('24/volume-low.svg').errors, []);
});

test('an anchor that is itself anchored, or has no ink, is an ERROR and the placement warnings come back', () => {
  const chained = family({ 'volume.svg': FULL, 'volume-medium.svg': LOW, 'volume-low.svg': icon([SPEAKER], ['anchor: volume-medium']) }).get('24/volume-low.svg');
  assert.equal(placement(chained).length, 2, chained.warnings.join(' | '));
  const inkless = family({ 'volume.svg': icon([]), 'volume-low.svg': LOW }).get('24/volume-low.svg');
  assert.deepEqual(inkless.errors, ["anchored to volume, but `volume.svg` at 24 has no ink to hold it to (C28)"]);
  assert.equal(placement(inkless).length, 2);
});

test('an anchor file that is not there is an ERROR, and the placement warnings come back', () => {
  const r = family({ 'volume-low.svg': LOW }).get('24/volume-low.svg');
  assert.deepEqual(r.errors, ["anchored to volume, but there is no `volume.svg` at 24 to hold it to — the full member ships before its levels, or with them (C28)"]);
  assert.equal(placement(r).length, 2);
  // same master, same style: a filled member is held to `volume-filled.svg`, not to the outline
  const f = family({ 'volume.svg': FULL, 'volume-low-filled.svg': LOW }).get('24/volume-low-filled.svg');
  assert.ok(f.errors.some((e) => e.includes('no `volume-filled.svg` at 24')), f.errors.join(' | '));
});

test('a member that fills the full member\'s own box keeps its note: membership, not a licence', () => {
  // C28: every member but the full one declares the anchor, so lint never asks for it off
  // (volume-x's × may span exactly the waves' box).
  const r = family({ 'volume.svg': FULL, 'volume-x.svg': icon([SPEAKER, WAVE1, WAVE2], ['anchor: volume']) }).get('24/volume-x.svg');
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
  assert.ok(r.notes.includes("anchored to volume: ink is volume's own box (2,4 → 22,20)"), r.notes.join(' | '));
  assert.ok(r.notes.includes("3 of 3 paths identical to volume's"), r.notes.join(' | '));
});

test('anchor with a box or a mark is an ERROR, and the anchor is dropped', () => {
  const r = lintSource(24, 'volume-low.svg', icon([SPEAKER, WAVE1], ['anchor: volume', 'box: 15x16']));
  assert.ok(r.errors.some((e) => /declares both `anchor:` and `box:`/.test(e)), r.errors.join(' | '));
  assert.equal(r.anchor, null);
  assert.ok(placement(r).some((w) => /off-centre/.test(w)), 'judged as if there were no anchor');
  const m = lintSource(24, 'volume-low.svg', icon([SPEAKER, WAVE1], ['keyline: mark', 'anchor: volume']));
  assert.ok(m.errors.some((e) => /declares both `anchor:` and `keyline: mark`/.test(e)), m.errors.join(' | '));
});

test('an anchor note lint cannot read, or one naming its own file, is an ERROR', () => {
  const bad = lintSource(24, 'volume-low.svg', icon([SPEAKER, WAVE1], ['anchor: the speaker']));
  assert.ok(bad.errors.some((e) => /anchor note "the speaker" is not an icon name/.test(e)), bad.errors.join(' | '));
  assert.equal(placement(bad).length, 2, 'an unreadable note is dropped, not half-believed');
  const self = lintSource(24, 'volume-filled.svg', icon([SPEAKER, WAVE1, WAVE2], ['anchor: volume']));
  assert.ok(self.errors.some((e) => /declares itself as its anchor/.test(e)), self.errors.join(' | '));
});

test('a member anchored to another member, not the full one, is an ERROR', () => {
  const mid = icon([SPEAKER, WAVE1], ['anchor: volume']);
  const r = family({ 'volume.svg': FULL, 'volume-medium.svg': mid, 'volume-low.svg': icon([SPEAKER], ['anchor: volume-medium']) });
  assert.ok(r.get('24/volume-low.svg').errors.some((e) => /is itself anchored to volume/.test(e)));
});

// --- C33 composites: `<!-- base: NAME -->` (2026-10-20) --------------------------------
// A composite keeps its base's drawing and canvas position under the badge, so on a short base
// it sits off the canvas centre; the note swaps the off-centre warning for "keeps NAME's place".
// Fixture: the shipped `password` field at 24 (ink 2,7 → 22,17, centred) and password-lock's
// candidate D at 24 — the field cut back for a lock on its bottom-right corner, one dot kept
// (ink 2,7 → 22,22: 20×15, centre 12,14.5, 2.5 below the canvas centre).
const PW_FIELD = 'M5.25 7.75H18.75A2.5 2.5 0 0 1 21.25 10.25V13.75A2.5 2.5 0 0 1 18.75 16.25H5.25A2.5 2.5 0 0 1 2.75 13.75V10.25A2.5 2.5 0 0 1 5.25 7.75Z';
const PW_DOT = (x) => `M${x - 0.75} 12A0.75 0.75 0 1 0 ${x + 0.75} 12A0.75 0.75 0 1 0 ${x - 0.75} 12Z`;
const PASSWORD = icon([PW_FIELD, PW_DOT(7), PW_DOT(12), PW_DOT(17)], ['box: 20x10']);
const LOCKED = [
  'M12.25 16.25H5.25A2.5 2.5 0 0 1 2.75 13.75V10.25A2.5 2.5 0 0 1 5.25 7.75H18.75A2.5 2.5 0 0 1 21.25 10.25',
  PW_DOT(7),
  'M16 17.25H20A1.25 1.25 0 0 1 21.25 18.5V20A1.25 1.25 0 0 1 20 21.25H16A1.25 1.25 0 0 1 14.75 20V18.5A1.25 1.25 0 0 1 16 17.25Z',
  'M16.25 17.25V15A1.75 1.75 0 0 1 19.75 15V17.25',
];
const PASSWORD_LOCK = (notes = ['box: 20x15', 'base: password'], ds = LOCKED) => icon(ds, notes);
const composite = (files) => checkBases(new Map(Object.entries(files).map(([f, src]) => [`24/${f}`, lintSource(24, f, src)])));
// every y in an absolute M/L/H/V/A/Z path moved up by dy
const up = (d, dy) => d.replace(/([MLHVAZ])([^MLHVAZ]*)/g, (_, c, a) => {
  const n = a.trim() ? a.trim().split(/[\s,]+/).map(Number) : [];
  if (c === 'V') n[0] -= dy;
  if (c === 'M' || c === 'L') for (let i = 1; i < n.length; i += 2) n[i] -= dy;
  if (c === 'A') for (let i = 6; i < n.length; i += 7) n[i] -= dy;
  return c + n.join(' ');
});

test('parseBaseNote reads an icon name and refuses anything else', () => {
  assert.deepEqual(parseBaseNote('<!-- base: password -->'), { name: 'password', raw: 'password' });
  assert.equal(parseBaseNote('<!--base:map-pin-2-->').name, 'map-pin-2');
  assert.equal(parseBaseNote('<!-- anchor: volume -->'), null);
  assert.ok(parseBaseNote('<!-- base: Password -->').bad);
  assert.ok(parseBaseNote('<!-- base: the field -->').bad);
  assert.ok(parseBaseNote('<!-- base: password-filled -->').bad, 'the note names the outline; a filled file finds NAME-filled itself');
});

test('offsetText says where the ink centre sits, in 3 dp', () => {
  assert.equal(offsetText([0, 2.5]), '2.5 below centre');
  assert.equal(offsetText([1, 0]), '1 right of centre');
  assert.equal(offsetText([-0.125, -1.5]), '1.5 above and 0.125 left of centre');
  assert.equal(offsetText([0, 0]), 'on centre');
  assert.equal(offsetText([0.004, -0.004]), 'on centre');
});

test('the fixture: password is clean, password-lock without the note warns off-centre', () => {
  const r = composite({ 'password.svg': PASSWORD, 'password-lock.svg': PASSWORD_LOCK(['box: 20x15']) });
  assert.deepEqual(r.get('24/password.svg').warnings, []);
  assert.deepEqual(r.get('24/password-lock.svg').errors, []);
  assert.deepEqual(r.get('24/password-lock.svg').warnings, ['off-centre at 12,14.5']);
});

test('a composite that keeps its base\'s place: no centre warning, an info line instead; box stays allowed', () => {
  const r = composite({ 'password.svg': PASSWORD, 'password-lock.svg': PASSWORD_LOCK() }).get('24/password-lock.svg');
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
  assert.ok(r.notes.includes("keeps password's place: left, top and right edges shared, 2.5 below centre (C33)"), r.notes.join(' | '));
  assert.equal(r.notes.at(-1), '20×15  agreed box  centre 12,14.5', 'the headline stays last');
  // the note does not loosen the box: a wrong one is still an error
  const box = composite({ 'password.svg': PASSWORD, 'password-lock.svg': PASSWORD_LOCK(['box: 20x14', 'base: password']) }).get('24/password-lock.svg');
  assert.ok(box.errors.some((e) => /declares box 20x14 but the ink is 20×15/.test(e)), box.errors.join(' | '));
});

test('a composite whose base moved up 1 leaves its top-left corner: an ERROR', () => {
  // still holds the base's box (6 < 7, 21 > 17) and its left and right edges, but not the top
  const r = composite({ 'password.svg': PASSWORD, 'password-lock.svg': PASSWORD_LOCK(undefined, LOCKED.map((d) => up(d, 1))) }).get('24/password-lock.svg');
  assert.deepEqual(r.errors, ["ink 2,6 → 22,21 does not keep password's top-left corner 2,7 → 22,17 (shares only its left and right edges) — the base has moved; C33 puts the badge bottom-right and keeps the base in place, so its left and top edges stay on password's"]);
  // the whole icon centred instead (password-lock's Dc: up 2.5) is the same error
  const centred = composite({ 'password.svg': PASSWORD, 'password-lock.svg': PASSWORD_LOCK(undefined, LOCKED.map((d) => up(d, 2.5))) }).get('24/password-lock.svg');
  assert.match(centred.errors[0] ?? '', /^ink 2,4\.5 → 22,19\.5 does not keep password's top-left corner/);
  assert.deepEqual(centred.warnings, [], 'an error, not the off-centre warning back');
  // moved up by exactly the badge's overhang (5): the bottom corners now coincide with the base's,
  // which any-corner let through (review, 2026-10-20) — the top-left rule catches it
  const five = composite({ 'password.svg': PASSWORD, 'password-lock.svg': PASSWORD_LOCK(undefined, LOCKED.map((d) => up(d, 5))) }).get('24/password-lock.svg');
  assert.match(five.errors[0] ?? '', /does not keep password's top-left corner/);
});

test('a composite that does not hold its base\'s box is an ERROR, whatever corner it shares', () => {
  // left and top shared, but the right stops 1 short of the field's 22
  const r = composite({ 'password.svg': PASSWORD, 'password-lock.svg': icon(['M2.75 7.75H20.25', 'M16 21.25H19.25'], ['base: password']) }).get('24/password-lock.svg');
  assert.deepEqual(r.errors, ["ink 2,7 → 21,22 does not hold password's 2,7 → 22,17: it stops short on the right by 1 — the base keeps its drawing and its place under the badge (C33)"]);
});

test('only the top-left corner holds the base: a composite on the base\'s own box says "on centre" and keeps its note', () => {
  // a badge drawn on the top edge shares only the bottom corners — the badge's side under C33's
  // bottom-right rule could be its own, so it is an error, not a pass
  const top = composite({ 'password.svg': PASSWORD, 'password-up.svg': icon([PW_FIELD, PW_DOT(7), 'M16 2.75H21.25'], ['base: password']) }).get('24/password-up.svg');
  assert.match(top.errors[0] ?? '', /does not keep password's top-left corner/);
  // inside the base's own box the note still states how the drawing was built: never asked off
  const own = composite({ 'password.svg': PASSWORD, 'password-dot.svg': icon([PW_FIELD, PW_DOT(7)], ['box: 20x10', 'base: password']) }).get('24/password-dot.svg');
  assert.deepEqual([own.errors, own.warnings], [[], []]);
  assert.ok(own.notes.includes("keeps password's place: left, top, right and bottom edges shared, on centre (C33)"), own.notes.join(' | '));
});

test('a base that is not there, or has no ink, is an ERROR, and the centre warning comes back', () => {
  const gone = composite({ 'password-lock.svg': PASSWORD_LOCK() }).get('24/password-lock.svg');
  assert.deepEqual(gone.errors, ["keeps password's place, but there is no `password.svg` at 24 to hold it to — the base ships before its composites, or with them (C33)"]);
  assert.deepEqual(gone.warnings, ['off-centre at 12,14.5']);
  // same master, same style: a filled composite is held to `password-filled.svg`, not to the outline
  const f = composite({ 'password.svg': PASSWORD, 'password-lock-filled.svg': PASSWORD_LOCK() }).get('24/password-lock-filled.svg');
  assert.ok(f.errors.some((e) => e.includes('no `password-filled.svg` at 24')), f.errors.join(' | '));
  const inkless = composite({ 'password.svg': icon([]), 'password-lock.svg': PASSWORD_LOCK() }).get('24/password-lock.svg');
  assert.deepEqual(inkless.errors, ["keeps password's place, but `password.svg` at 24 has no ink to hold it to (C33)"]);
  assert.deepEqual(inkless.warnings, ['off-centre at 12,14.5']);
});

test('a base note lint cannot read, or one naming its own file, is an ERROR, and the note is dropped', () => {
  const bad = lintSource(24, 'password-lock.svg', PASSWORD_LOCK(['box: 20x15', 'base: the field']));
  assert.ok(bad.errors.some((e) => /base note "the field" is not an icon name/.test(e)), bad.errors.join(' | '));
  assert.equal(bad.base, null);
  assert.deepEqual(bad.warnings, ['off-centre at 12,14.5'], 'an unreadable note is dropped, not half-believed');
  const self = lintSource(24, 'password-lock-filled.svg', PASSWORD_LOCK(['box: 20x15', 'base: password-lock']));
  assert.ok(self.errors.some((e) => /declares itself as its base/.test(e)), self.errors.join(' | '));
  assert.equal(self.base, null);
});

test('base with an anchor or a mark is an ERROR, and the base is dropped', () => {
  const a = lintSource(24, 'password-lock.svg', PASSWORD_LOCK(['base: password', 'anchor: password']));
  assert.ok(a.errors.some((e) => /declares both `anchor:` and `base:`/.test(e)), a.errors.join(' | '));
  assert.equal(a.base, null);
  const m = lintSource(24, 'password-lock.svg', PASSWORD_LOCK(['keyline: mark', 'base: password']));
  assert.ok(m.errors.some((e) => /declares both `base:` and `keyline: mark`/.test(e)), m.errors.join(' | '));
  assert.equal(m.base, null);
});

test('the shipped C33 composites already keep their base\'s place: the rule is their practice', () => {
  // calendar-repeat on calendar (badge 1 past the box, right and bottom) and map-pinned on map
  // (badge below the sheet), every master and style, with the note added in memory only
  for (const [comp, base, edges] of [['calendar-repeat', 'calendar', 'left and top'], ['map-pinned', 'map', 'left, top and right']])
    for (const m of [24, 20, 16]) for (const sfx of ['', '-filled']) {
      const src = shipped(m, `${comp}${sfx}.svg`).replace(/(<svg[^>]*>\n)/, `$1  <!-- base: ${base} -->\n`);
      const r = checkBases(new Map([[`${m}/${comp}${sfx}.svg`, lintSource(m, `${comp}${sfx}.svg`, src)],
        [`${m}/${base}${sfx}.svg`, lintSource(m, `${base}${sfx}.svg`, shipped(m, `${base}${sfx}.svg`))]])).get(`${m}/${comp}${sfx}.svg`);
      assert.deepEqual(r.errors, [], `${m}/${comp}${sfx}`);
      assert.ok(r.notes.some((n) => n.startsWith(`keeps ${base}'s place: ${edges} edges shared`)), `${m}/${comp}${sfx}: ${r.notes.join(' | ')}`);
    }
});

test('draft-svg writes a candidate\'s base into both files; `base: null` opts out of the board\'s', () => {
  const c = { id: 'D', label: 'lock badge', base: 'password', masters: { 24: LOCKED, 20: LOCKED, 16: LOCKED },
    filled: { 24: { fill: [], stroke: LOCKED }, 20: { fill: [], stroke: LOCKED }, 16: { fill: [], stroke: LOCKED } } };
  const out = candidateFiles({}, c, 'password-lock');
  assert.equal(out.length, 6);
  assert.ok(out.every((f) => f.src.includes('<!-- base: password -->')));
  assert.ok(candidateFiles({ base: 'password' }, { ...c, base: undefined }, 'password-lock').every((f) => f.src.includes('<!-- base: password -->')), 'board-level');
  assert.ok(candidateFiles({ base: 'password' }, { ...c, base: null }, 'password').every((f) => !f.src.includes('base:')), 'the base itself opts out');
  // what draft-svg writes, lint reads
  assert.deepEqual(parseBaseNote(out.find((f) => f.master === 24 && f.filled).src), { name: 'password', raw: 'password' });
});

// --- state twins (C34): `unlock-<n>` for every `lock-<n>` -------------------------------
test('stateShape reads the numbered shapes of a twin and its base, and nothing else', () => {
  assert.deepEqual(stateShape('lock-3'), { twin: 'unlock', base: 'lock', side: 'base', counterpart: 'unlock-3' });
  assert.deepEqual(stateShape('unlock'), { twin: 'unlock', base: 'lock', side: 'twin', counterpart: 'lock' });
  for (const n of ['unlock-swung', 'unlock-3-swung', 'lock-small', 'lock-2-filled', 'padlock', 'lock-open'])
    assert.equal(stateShape(n), null, n);
  assert.equal(stateShape('eye-off-2', { 'eye-off': 'eye' }).counterpart, 'eye-2', 'a later twin is one entry');
});

test('checkTwins: a missing twin warns on whichever file exists, per master; lock alone is clean', () => {
  const stub = () => ({ errors: [], warnings: [], notes: [] });
  const run = (keys) => checkTwins(new Map(keys.map((k) => [k, stub()])));
  const r = run(['24/lock.svg', '24/lock-3.svg', '24/unlock.svg', '24/unlock-swung.svg', '20/unlock-3.svg']);
  assert.match(r.get('24/lock-3.svg').warnings[0], /no state twin `unlock-3\.svg` at 24 .* `lock-3` needs `unlock-3` \(C34\)/);
  assert.match(r.get('20/unlock-3.svg').warnings[0], /no base shape `lock-3\.svg` at 20 .* \(C34\)/);
  for (const k of ['24/lock.svg', '24/unlock.svg', '24/unlock-swung.svg']) assert.deepEqual(r.get(k).warnings, [], k);
  assert.deepEqual(run(['24/lock.svg', '24/lock-3.svg']).get('24/lock-3.svg').warnings, [], 'no twin started yet');
});

test('draft-svg writes a candidate\'s anchor into both files; `anchor: null` opts out of the board\'s', () => {
  const c = { id: 'A1', label: 'one wave', anchor: 'volume', masters: { 24: [SPEAKER], 20: [SPEAKER], 16: [SPEAKER] },
    filled: { 24: { fill: [], stroke: [SPEAKER] }, 20: { fill: [], stroke: [SPEAKER] }, 16: { fill: [], stroke: [SPEAKER] } } };
  const out = candidateFiles({}, c, 'volume-low');
  assert.equal(out.length, 6);
  assert.ok(out.every((f) => f.src.includes('<!-- anchor: volume -->')));
  assert.ok(candidateFiles({ anchor: 'volume' }, { ...c, anchor: undefined }, 'volume-low').every((f) => f.src.includes('<!-- anchor: volume -->')), 'board-level');
  assert.ok(candidateFiles({ anchor: 'volume' }, { ...c, anchor: null }, 'volume').every((f) => !f.src.includes('anchor:')), 'the full member opts out');
});

test('a bare id ships under its `set` name, else the concept; id=file always wins (approve and draft-check share it)', () => {
  const d = { concept: 'volume', set: { A3: 'volume', A2: 'volume-medium', Ax: 'volume-x' } };
  assert.deepEqual(planArg(d, 'A2'), { id: 'A2', file: 'volume-medium', from: 'set' });
  assert.deepEqual(planArg(d, 'A3'), { id: 'A3', file: 'volume', from: 'set' });
  assert.deepEqual(planArg(d, 'B'), { id: 'B', file: 'volume', from: 'concept' }, 'not in set: the concept');
  assert.deepEqual(planArg(d, 'A2=volume-low'), { id: 'A2', file: 'volume-low', from: 'explicit' }, 'explicit wins');
  assert.deepEqual(planArg({ concept: 'user' }, 'C'), { id: 'C', file: 'user', from: 'concept' }, 'no set at all');
});

// --- C19 extended to numerals: `<!-- glyph: numeral -->` (2026-09-26) ------------------
// A numeral's own opening (the mouth of a 2, terminal to neck) floors at GLYPH_GAP; nothing
// else in the file does. Fixture: list-ordered's first 16 draft (1, 2, three lines), with the
// 2's entry terminal moved to set its mouth. The shipped 2 enters 30° above 9 o'clock (1.53);
// 15° above gives 1.23; below 9 o'clock it closes to 0.58.
const ROOT16 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">';
const TWO16 = (entry) => `M${entry}A1.375 1.375 0 0 1 4 9.375A1.375 1.375 0 0 1 5.375 10.75A1.797 1.797 0 0 1 4.477 12.306L2.625 13.375H5.375`;
const LIST16 = (entry, notes = ['keyline: mark']) => [ROOT16, ...notes.map((n) => `  <!-- ${n} -->`),
  ...['M3.125 3.25L4.375 2.625V6.625', TWO16(entry), 'M8.375 4.5H13.375', 'M8.375 8H13.375', 'M8.375 11.5H13.375'].map((d) => `  <path d="${d}"/>`), '</svg>', ''].join('\n');
const lintList = (entry, notes) => lintSource(16, 'list-ordered.svg', LIST16(entry, notes));
const selfWarn = (r) => r.warnings.filter((w) => /of itself/.test(w));

test('parseGlyphNote reads dot, numeral and letter and refuses anything else', () => {
  assert.deepEqual(parseGlyphNote('<!-- glyph: dot -->'), { kind: 'dot', raw: 'dot' });
  assert.deepEqual(parseGlyphNote('<!--glyph:numeral-->'), { kind: 'numeral', raw: 'numeral' });
  assert.deepEqual(parseGlyphNote('<!-- glyph: letter -->'), { kind: 'letter', raw: 'letter' });
  assert.ok(parseGlyphNote('<!-- glyph: letters -->').bad);
  assert.equal(parseGlyphNote('<!-- gap: 1 -->'), null);
  assert.ok(parseGlyphNote('<!-- glyph: numerals -->').bad);
  assert.ok(parseGlyphNote('<!-- glyph: dot numeral -->').bad);
});

test('a 2 with a 1.23 mouth warns under §6 and passes with `glyph: numeral`', () => {
  const bare = lintList('2.65 10.5');
  assert.equal(selfWarn(bare).length, 1, bare.warnings.join(' | '));
  assert.match(selfWarn(bare)[0], /path 2 comes within 1\.23 of itself .* — §6 needs 1\.5/);
  const noted = lintList('2.65 10.5', ['keyline: mark', 'glyph: numeral']);
  assert.deepEqual(noted.errors, []);
  assert.deepEqual(selfWarn(noted), []);
  assert.ok(noted.notes.includes('C19 numeral opening 1.23 — floor 1, not §6\'s 1.5'), noted.notes.join(' | '));
  assert.match(noted.notes.at(-1), /declared mark/, 'the headline stays last');
});

test('the numeral floor keeps its teeth: a 0.58 mouth still warns, against GLYPH_GAP', () => {
  const r = lintList('2.708 11.22', ['keyline: mark', 'glyph: numeral']);
  assert.equal(selfWarn(r).length, 1);
  assert.match(selfWarn(r)[0], /within 0\.58 of itself .* — C19 numeral gap needs 1 /);
});

test('`glyph: numeral` relaxes no pair gap: numeral-to-line keeps §6', () => {
  // the bottom line moved onto the 2's foot row and 0.5 left: 1.25 of air from the foot's cap
  const src = LIST16('2.809 10.063', ['keyline: mark', 'glyph: numeral']).replace('M8.375 11.5H13.375', 'M7.875 13.375H13.375');
  const r = lintSource(16, 'list-ordered.svg', src);
  assert.ok(r.warnings.some((w) => /paths 2\/5 are .* — §6 needs/.test(w)), r.warnings.join(' | '));
});

test('a numeral note with nothing under §6 is an info line, not an error (the board writes it into all six files)', () => {
  const r = lintList('2.809 10.063', ['keyline: mark', 'glyph: numeral']);
  assert.deepEqual(r.errors, []);
  assert.deepEqual(selfWarn(r), []);
  assert.ok(r.notes.some((n) => /^glyph: numeral — not in use here \(smallest opening 1\.53, §6's 1\.5 already holds\)$/.test(n)), r.notes.join(' | '));
});

test('a glyph note lint cannot read is an ERROR, and the drawing is held to §6', () => {
  const r = lintList('2.65 10.5', ['keyline: mark', 'glyph: numerals']);
  assert.ok(r.errors.some((e) => /glyph note "numerals" is not a kind lint knows/.test(e)), r.errors.join(' | '));
  assert.equal(selfWarn(r).length, 1);
});

test('draft-svg writes a candidate\'s `glyph: numeral` into all six files', () => {
  const two = TWO16('2.65 10.5');
  const f = { fill: [], stroke: [two] };
  const c = { id: 'A', label: 'numerals', glyph: 'numeral', masters: { 24: [two], 20: [two], 16: [two] }, filled: { 24: f, 20: f, 16: f } };
  const out = candidateFiles({ keyline: 'mark' }, c, 'list-ordered');
  assert.equal(out.length, 6);
  assert.ok(out.every((f) => f.src.includes('<!-- glyph: numeral -->')));
});

// ── facingGap (lint §5f; plans/facing-gap.md) ───────────────────────────────
// Fixtures are shipped drawings as they stood on 2026-09-28, inlined so a redraw after
// Maruti's ruling does not move the tests. The three things it must never do: read a
// bend's inside as a gap, read a ring's hole short (the set is drawn AT 1.5), and read a
// rounded end converging on a flat as a neck.
const COLLAR16 = 'M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375A2 2 0 0 1 4.618 9.375A0.625 0.625 0 0 0 5.058 9.192L7.058 7.192A0.625 0.625 0 0 1 7.5 7.009A0.625 0.625 0 0 1 7.942 7.192L8.808 8.058A0.625 0.625 0 0 1 8.991 8.5A0.625 0.625 0 0 1 8.808 8.942L6.808 10.942A0.625 0.625 0 0 0 6.625 11.382A2 2 0 0 1 4.625 13.375Z';

test('facingGap reads the air inside a closed path: paintbrush 16 collar, 1.22', () => {
  assert.equal(selfGap(COLLAR16, 1.25), null, 'selfGap does not judge a closed path - the hole this closes');
  const { self } = facingGap([COLLAR16, 'M8.375 7.625L13.375 2.625'], 1.25);
  assert.equal(self.length, 1);
  assert.equal(self[0].path, 0);
  near(self[0].gap, 1.22, 0.01);
});

test('facingGap: a bend, a sharp corner and a straight run have no gap', () => {
  assert.deepEqual(facingGap(['M4 8L4 5A0.75 0.75 0 0 1 4.75 4.25L8 4.25'], 1.5).self, []);   // C10 at the minimum
  assert.deepEqual(facingGap(['M4 8L4 4.25L8 4.25'], 1.5).self, []);
  assert.deepEqual(facingGap(['M3.75 12h16.5'], 1.5).self, []);
});

test('facingGap reads a ring\'s hole at its full diameter, never a chord short of it', () => {
  // r 1.5 at stroke 1.5 leaves exactly 1.5: a reading of 1.48 here would warn on the set
  assert.equal(facingGap(['M12 10.5A1.5 1.5 0 0 1 12 13.5A1.5 1.5 0 0 1 12 10.5Z'], 1.5).self[0].gap, 1.5);
  near(facingGap(['M12 11A1 1 0 0 1 12 13A1 1 0 0 1 12 11Z'], 1.5).self[0].gap, 0.5, 0.01);
});

test('facingGap: a rounded end converging on a flat is not a neck (users-wide 16 body, 1.5 inside)', () => {
  const body = 'M1.625 11.5A1.875 1.875 0 0 1 3.5 9.625H6.5A1.875 1.875 0 0 1 8.375 11.5A0.875 0.875 0 0 1 7.5 12.375H2.5A0.875 0.875 0 0 1 1.625 11.5Z';
  assert.ok(facingGap([body], 1.25).self[0].gap >= 1.49);
});

test('facingGap agrees with selfGap on an open mouth (help-circle-4 16 as first drawn)', () => {
  const d = 'M6.5 7L6.5 6A1 1 0 0 1 7.5 5L8.5 5A1 1 0 0 1 9.5 6L9.5 6.09A1 1 0 0 1 9.21 6.79L8 8';
  near(facingGap([d], 1.5).self[0].gap, selfGap(d, 1.5).gap, 0.02);
});

test('facingGap leaves two separate stroked paths to lint §5, and a span blocked by ink is no gap', () => {
  assert.deepEqual(facingGap(['M3 3H10', 'M3 5H10'], 1.5), { self: [], area: [] });
  // a closed box 3 tall inside, split by a line through its middle: two 0.75 gaps, both
  // between separate paths - nothing for the box against itself
  assert.deepEqual(facingGap(['M3 3H13V7.5H3Z', 'M4 5.25H12'], 1.5).self, []);
});

test('facingGap reads a filled drawing\'s air and says what kind it is', () => {
  // compass-3-filled 16: the band round the knocked-out needle
  const compass = 'M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM11.296 6.306L10.164 9.417A1.25 1.25 0 0 1 9.417 10.164L6.306 11.296A1.25 1.25 0 0 1 4.704 9.694L5.836 6.583A1.25 1.25 0 0 1 6.583 5.836L9.694 4.704A1.25 1.25 0 0 1 11.296 6.306ZM5.879 10.121L8.989 8.989L7.011 7.011L5.879 10.121Z';
  const c = facingGap([], 1.25, [compass]).area;
  assert.equal(c[0].kind, 'separation');
  near(c[0].gap, 1.25, 0.01);
  // book-3-filled 16: the title label punched at the outline's 1.25 (C22's true size)
  const book = 'M4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V13.375A0.375 0.375 0 0 1 11.375 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12ZM6.625 4H9.375A0.625 0.625 0 0 1 10 4.625A0.625 0.625 0 0 1 9.375 5.25H6.625A0.625 0.625 0 0 1 6 4.625A0.625 0.625 0 0 1 6.625 4Z';
  const b = facingGap([], 1.25, [book]).area;
  assert.equal(b[0].kind, 'cut');
  near(b[0].gap, 1.25, 0.01);
  // external-link-filled 24: the arrow's cap in a notch whose arc sits 0.23 off it
  const box = 'M6.25 6L13.6 6A0.5 0.5 0 0 1 13.96 6.85L8.91 11.91A2.26 2.26 0 0 0 12.09 15.09L17.15 10.04A0.5 0.5 0 0 1 18 10.4L18 17.75A3.25 3.25 0 0 1 14.75 21L6.25 21A3.25 3.25 0 0 1 3 17.75L3 9.25A3.25 3.25 0 0 1 6.25 6Z';
  const e = facingGap(['M14.25 3.75L19.5 3.75A0.75 0.75 0 0 1 20.25 4.5L20.25 9.75', 'M20.03 3.97L10.5 13.5'], 1.5, [box]).area;
  assert.equal(e[0].kind, 'line');
  near(e[0].gap, 1.28, 0.01);
  // a solid disc has no air to read
  assert.deepEqual(facingGap([], 1.5, ['M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z']).area, []);
});

const PAINTBRUSH16 = (collar) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
  <!-- off-grid tangent points -->
  <path d="${collar}"/>
  <path d="M8.375 7.625L13.375 2.625"/>
</svg>`;

test('lint §5f warns on a closed path facing itself under §6, and stays quiet on an open one 5b reads', () => {
  const r = lintSource(16, 'paintbrush.svg', PAINTBRUSH16(COLLAR16));
  assert.equal(r.errors.length, 0);
  assert.ok(r.warnings.some((w) => w.includes('faces itself across 1.22')), r.warnings.join('\n'));
  // help-circle-4 16 as first drawn: one open stroke, so 5b's warning and not a second one from 5f
  const help = lintSource(16, 'help-circle-4.svg', PAINTBRUSH16('M6.5 7L6.5 6A1 1 0 0 1 7.5 5L8.5 5A1 1 0 0 1 9.5 6L9.5 6.09A1 1 0 0 1 9.21 6.79L8 8').replace('<path d="M8.375 7.625L13.375 2.625"/>', ''));
  assert.equal(help.warnings.filter((w) => w.includes('faces itself')).length, 0);
});

// Found by the fresh review of this change (2026-09-28).
test('facingGap reads air off a SHARP corner of a shape (no wall there faces square-on)', () => {
  const diamond = facingGap([], 1.5, ['M2 2H22V22H2ZM5 5H19V19H5ZM12 6L18 12L12 18L6 12Z']).area;
  assert.equal(diamond[0].kind, 'separation');
  near(diamond[0].gap, 1, 0.01);
  const corner = facingGap(['M11.85 11.85L20 20'], 1.5, ['M3 3H11V11H3Z']).area;
  assert.equal(corner[0].kind, 'line');
  near(corner[0].gap, 0.45, 0.01);
});

const lint24 = (d) => lintSource(24, 't.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- fixture -->
  <path d="${d}"/>
</svg>`).warnings;

test('lint §5f does not warn twice on a neck 5b already read inside a many-subpath path', () => {
  const w = lint24('M6.5 7L6.5 6A1 1 0 0 1 7.5 5L8.5 5A1 1 0 0 1 9.5 6L9.5 6.09A1 1 0 0 1 9.21 6.79L8 8M3 13H13');
  assert.equal(w.filter((x) => x.includes('of itself')).length, 1);
  assert.equal(w.filter((x) => x.includes('faces itself')).length, 0);
});

test('lint §5f reads a path that closes without a Z (5b takes it for a closed path and skips it)', () => {
  const w = lint24('M5 10H19V12.5H5V10');
  assert.ok(w.some((x) => x.includes('faces itself across 1 ')), w.join('\n'));
});

test('facingGap: a sliver of ink at a fillet that overshoots (puzzle-4-filled 16) reads from its tip', () => {
  // the knob's fillet runs to x 8.01, past the piece's edge at 7.5, and the path doubles back
  const a = facingGap([], 1.25, ["M1 6.375A2.125 2.125 0 0 1 3.125 4.25H3.24A0.25 0.25 0 0 0 3.479 3.925A2.25 2.25 0 0 1 5.625 1A2.25 2.25 0 0 1 7.771 3.925A0.25 0.25 0 0 0 8.01 4.25H7A0.5 0.5 0 0 1 7.5 4.75V7.334A1.5 1.5 0 0 0 9.6 8.708A1 1 0 0 1 11 9.625A1 1 0 0 1 9.6 10.542A1.5 1.5 0 0 0 7.5 11.916V14.5A0.5 0.5 0 0 1 7 15H3.125A2.125 2.125 0 0 1 1 12.875Z", "M8.75 4.75A0.5 0.5 0 0 1 9.25 4.25H12.875A2.125 2.125 0 0 1 15 6.375V12.875A2.125 2.125 0 0 1 12.875 15H9.25A0.5 0.5 0 0 1 8.75 14.5V11.916A0.25 0.25 0 0 1 9.1 11.687A2.25 2.25 0 0 0 12.25 9.625A2.25 2.25 0 0 0 9.1 7.563A0.25 0.25 0 0 1 8.75 7.334Z"]).area;
  near(a.find((x) => x.kind === 'separation').gap, 0.84, 0.01);
});

test('facingGap: no false gap where one shape overlaps another, or in a collapsed fillet\'s hairline loop', () => {
  // desktop-6-filled 16: the stand overlaps the screen's bottom edge
  assert.deepEqual(facingGap([], 1.25, ["M3.125 2H12.875A2.125 2.125 0 0 1 15 4.125V8.875A2.125 2.125 0 0 1 12.875 11H3.125A2.125 2.125 0 0 1 1 8.875V4.125A2.125 2.125 0 0 1 3.125 2Z", "M6 10.375V12.375A0.375 0.375 0 0 1 5.625 12.75H4.625A0.625 0.625 0 0 0 4.625 14H11.375A0.625 0.625 0 0 0 11.375 12.75H10.375A0.375 0.375 0 0 1 10 12.375V10.375Z"]).area.filter((x) => x.gap < 1.49), []);
  // help-circle-4-filled 16: its cut carries self-crossing loops 0.1 across, left from an offset
  assert.deepEqual(facingGap([], 1.25, ["M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 10.75A1 1 0 1 0 9 10.75A1 1 0 1 0 7 10.75ZM7.13 5.75L7 5.88L9 5.88L8.88 5.75L8.88 5.94L8.91 5.85L7.38 7.38A0.88 0.88 0 0 0 8.62 8.62L10.15 7.09A1.63 1.63 0 0 0 10.63 5.94L10.63 5.75A1.63 1.63 0 0 0 9 4.13L7 4.13A1.63 1.63 0 0 0 5.38 5.75A0.88 0.88 0 0 0 7.13 5.75Z"]).area.filter((x) => x.gap < 1.49), []);
});

// Found 2026-09-28, fixed 2026-09-29: two rounds bulging toward each other were not read.
const PUZZLE24 = 'M2.75 9.75A2.5 2.5 0 0 1 5.25 7.25H7.15A1 1 0 0 0 8.02 5.75A2 2 0 0 1 9.75 2.75A2 2 0 0 1 11.48 5.75A1 1 0 0 0 12.35 7.25H14.25A2.5 2.5 0 0 1 16.75 9.75V11.65A1 1 0 0 0 18.25 12.52A2 2 0 0 1 21.25 14.25A2 2 0 0 1 18.25 15.98A1 1 0 0 0 16.75 16.85V18.75A2.5 2.5 0 0 1 14.25 21.25H5.25A2.5 2.5 0 0 1 2.75 18.75Z';

test('facingGap reads the neck between two knob feet (puzzle 24 as shipped 2026-09-28, 1.692 by dense sampling)', () => {
  // the feet bulge into the neck at radius 1.75; offset square to each 1 deg piece, the
  // outside of a curve left a slit between every two pieces and the rays slipped through
  const { self } = facingGap([PUZZLE24], 1.5);
  assert.equal(self.length, 1);
  near(self[0].gap, 1.692, 0.02);
});

const rounded = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`;

test('facingGap reads two small rounds facing each other at their true distance', () => {
  // two filled squares, corners of radius 0.25, set corner to corner: the rays off one
  // corner arrive at the other up to 4 deg off square-on, past ARRIVE
  const truth = Math.SQRT2 * 1.5 - 0.5;   // 1.621: centres 1.5 apart each way, less two radii
  const area = facingGap([], 1.5, [rounded(2, 2, 6, 6, 0.25), rounded(7, 7, 11, 11, 0.25)]).area;
  assert.equal(area[0].kind, 'separation');
  near(area[0].gap, truth, 0.02);
  // the same between two subpaths of one stroked path (bend radius 0.75, edge radius 1.5)
  const self = facingGap([rounded(2, 2, 6, 6, 0.75) + rounded(7.5, 7, 12, 12, 0.75)], 1.5).self;
  near(self[0].gap, Math.hypot(3, 2.5) - 1.5 - 1.5, 0.02);
  // and two round caps of one open path pointing at each other
  near(facingGap(['M10 5.5V4H4V12H10V8.7'], 1.5).self[0].gap, 1.7, 0.01);
});

test('facingGap: two strokes that touch and curve apart leave a sliver that is not a neck (paintbrush-4 24)', () => {
  // the ferrule's two sides lie 1.5 apart (touching) and end in rounds bulging toward each
  // other; the air where they part is a bend's inside, not a gap. Read at a flat 10 deg of
  // arrival it came out 0.02
  const d = 'M4.83 20.17A0.75 0.75 0 0 1 4.5 20.25A0.75 0.75 0 0 1 3.75 19.5A7 7 0 0 1 3.75 19.5A7 7 0 0 1 5.45 14.93A2.75 2.75 0 0 1 7.53 13.97A2.75 2.75 0 0 1 8.3 14.08A0.75 0.75 0 0 0 8.51 14.11A0.75 0.75 0 0 0 9.04 13.89L10.97 11.97L12.03 13.03L10.23 14.83A0.75 0.75 0 0 0 10.01 15.36A0.75 0.75 0 0 0 10.07 15.66A2.75 2.75 0 0 1 10.28 16.72A2.75 2.75 0 0 1 7.63 19.47A7 7 0 0 0 4.83 20.17Z';
  assert.deepEqual(facingGap([d, 'M11.5 12.5L20.25 3.75'], 1.5).self, []);
});

// Found by the fresh review of the fix (2026-09-29): what the bulge slack must never read.
test('facingGap: a corner\'s turn is not curve - a notch or a wedge beside a sharp corner reads nothing', () => {
  assert.deepEqual(facingGap([], 1.5, ['M2 2H14V7.81L10.894 8L14 8.19V14H2Z']).area, []);          // walls open at 7 deg
  assert.deepEqual(facingGap(['M2 2H30V15.06L14.6311 16L30 16.94V30H2Z'], 1.5).self, []);
  assert.deepEqual(facingGap([], 1.5, ['M8 8L12 8L12 12L8 12L8 8Z', 'M12.046 7.924L16.033 8.253L15.704 12.24L11.717 11.911L12.046 7.924Z']).area, []);
});

test('facingGap: two shapes crossing in a narrow wedge, tiny rounds at its mouth, read nothing', () => {
  assert.deepEqual(facingGap([], 1.5, ['M8.1 8L11.9 8A0.1 0.1 0 0 1 12 8.1L12 11.9A0.1 0.1 0 0 1 11.9 12L8.1 12A0.1 0.1 0 0 1 8 11.9L8 8.1A0.1 0.1 0 0 1 8.1 8Z', 'M12.374 7.843L15.856 8.2A0.25 0.25 0 0 1 16.079 8.474L15.722 11.956A0.25 0.25 0 0 1 15.448 12.179L11.966 11.822A0.25 0.25 0 0 1 11.743 11.548L12.1 8.066A0.25 0.25 0 0 1 12.374 7.843Z']).area, []);
});

// --- C32: a numeral keeps the outline weight in a line-heavy filled drawing (2026-10-17) ---
// repeat-once's 1 inside 2.5 rails: a 2.5 one with a flag thickens into a blob, so its path
// carries `stroke-width` at the master's outline weight, and only in a file that declares
// `<!-- glyph: numeral -->`. Every measure reads each path at its own weight. Fixture: a rail
// at 2.5 and a stem below it at 1.5, at 24 (gap = centreline distance − half of each weight).
const ROOT24F = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">';
const RAIL24 = (stem, { notes = ['keyline: mark', 'glyph: numeral'], sw = '1.5' } = {}) => [ROOT24F, ...notes.map((n) => `  <!-- ${n} -->`),
  '  <path d="M5 7H19"/>', `  <path stroke-width="${sw}" d="${stem}"/>`, '</svg>', ''].join('\n');
const numPairWarn = (r) => r.warnings.filter((w) => /^paths /.test(w));

test('C32: a 1.5 numeral beside a 2.5 rail is measured at its own weight', () => {
  // 3.5 between centrelines: 3.5 − (2.5 + 1.5) / 2 = 1.5 of air, which holds §6 (at one 2.5 it would read 1)
  const ok = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17'));
  assert.deepEqual(ok.errors, []);
  assert.deepEqual(numPairWarn(ok), [], ok.warnings.join(' | '));
  assert.ok(ok.notes.includes('path 2 is a numeral at 1.5 (C32)'), ok.notes.join(' | '));
  assert.match(ok.notes.at(-1), /declared mark/, 'the headline stays last');
  // ink box: the stem's foot grows by 0.75, not 1.25
  assert.equal(ok.ink.y1, 17.75);
  assert.equal(ok.ink.x0, 3.75);
  // 3 apart: 1 of air, and the warning says so in the numeral's own terms
  const close = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10V17'));
  assert.equal(numPairWarn(close).length, 1);
  assert.match(numPairWarn(close)[0], /^paths 1\/2 are 3 apart — §6 needs 3\.5 \(edge gap 1 < 1\.5\)$/);
});

test('C32: a per-path stroke-width without `glyph: numeral` is an ERROR naming the path', () => {
  const r = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17', { notes: ['keyline: mark'] }));
  assert.ok(r.errors.some((e) => /^path 2 carries its own stroke-width="1\.5" — only a numeral or a letter may, in a file that declares <!-- glyph: numeral --> or <!-- glyph: letter --> \(C32\)/.test(e)), r.errors.join(' | '));
});

test('C32: a numeral at any weight but the outline\'s is an ERROR, and so is one that repeats the root', () => {
  const wrong = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17', { sw: '2' }));
  assert.ok(wrong.errors.some((e) => /^path 2 carries stroke-width="2" — a numeral keeps this master's outline weight, "1\.5" \(C32\)$/.test(e)), wrong.errors.join(' | '));
  // at 16 the outline weight is 1.25, so 1.5 is wrong there
  const at16 = lintSource(16, 'x-filled.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <!-- keyline: mark -->\n  <!-- glyph: numeral -->\n  <path d="M3 5H13"/>\n  <path stroke-width="1.5" d="M8 8V12"/>\n</svg>\n');
  assert.ok(at16.errors.some((e) => /path 2 carries stroke-width="1\.5" — .* "1\.25"/.test(e)), at16.errors.join(' | '));
  // an outline file already draws at 1.5: a per-path 1.5 there says nothing
  const outline = lintSource(24, 'repeat-once.svg', RAIL24('M12 10.5V17').replace('stroke-width="2.5"', 'stroke-width="1.5"'));
  assert.ok(outline.errors.some((e) => /path 2 carries stroke-width="1\.5", which is the root's own/.test(e)), outline.errors.join(' | '));
  // any other stroke attribute on a path is still refused
  const other = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17').replace('<path d="M5 7H19"/>', '<path stroke-linecap="butt" d="M5 7H19"/>'));
  assert.ok(other.errors.includes('stroke attribute on a <path> — belongs on the root'), other.errors.join(' | '));
});

test('facingGap reads each path at its own weight when handed one per path (C32)', () => {
  const box = 'M8 8H16V11H8Z';   // 3 between centrelines inside
  near(facingGap([box], 1.5).self[0].gap, 1.5, 0.02);
  near(facingGap([box], 2.5).self[0].gap, 0.5, 0.02);
  const mixed = facingGap(['M4 4H20', box], [2.5, 1.5]).self;
  assert.equal(mixed.length, 1);
  assert.equal(mixed[0].path, 1);
  near(mixed[0].gap, 1.5, 0.02);
});

test('draft-svg writes `filled.glyph` at the outline weight and refuses it where it does not belong (C32)', () => {
  const m = (w) => ({ 24: w, 20: w, 16: w });
  const c = { id: 'D', label: 'stem', glyph: 'numeral', masters: m(['M5 7H19', 'M12 10.5V17']),
    filled: { 24: { weight: 2.5, stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] }, 20: { weight: 2, stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] }, 16: { weight: 2, stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] } } };
  const out = candidateFiles({ keyline: 'mark' }, c, 'repeat-once');
  const f24 = out.find((f) => f.master === 24 && f.filled).src, f16 = out.find((f) => f.master === 16 && f.filled).src;
  assert.ok(f24.includes('  <path stroke-width="1.5" d="M12 10.5V17"/>'), f24);
  assert.ok(f16.includes('  <path stroke-width="1.25" d="M12 10.5V17"/>'), f16);
  assert.ok(f24.includes('stroke-width="2.5" stroke-linecap'), 'the root keeps the filled weight');
  assert.match(f24, /<!-- stem, filled: weight 2\.5, ends pulled in 0\.5 so the ink box matches the outline, numeral stays at 1\.5 -->/);
  assert.ok(f24.includes('<!-- glyph: numeral -->'));
  // the file it writes lints with the info line and no error
  const r = lintSource(24, 'repeat-once-filled.svg', f24);
  assert.deepEqual(r.errors, []);
  assert.ok(r.notes.includes('path 2 is a numeral at 1.5 (C32)'));
  // refusals
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, glyph: undefined }, 'repeat-once'), /needs glyph: 'numeral'/);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, filled: { ...c.filled, 24: { fill: ['M4 4H8V8H4Z'], glyph: ['M12 10.5V17'] } } }, 'repeat-once'), /fills shapes/);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, filled: { ...c.filled, 24: { stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] } } }, 'repeat-once'), /heavier than 1\.5/);
});

test('C32: only the one double-quoted form is accepted — single quotes, other stroke attributes and a repeat fail', () => {
  const STRAY = 'stroke attribute on a <path> — belongs on the root';
  // single-quoted weight on the numeral: not the accepted form, refused like any stroke attribute
  const single = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17').replace('stroke-width="1.5"', "stroke-width='1.5'"));
  assert.ok(single.errors.includes(STRAY), single.errors.join(' | '));
  assert.ok(!single.notes.some((n) => /numeral at/.test(n)), 'not read as a numeral');
  // another stroke attribute in single quotes, on the rail, beside an accepted numeral
  const other = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17').replace('<path d="M5 7H19"/>', "<path stroke-linecap='butt' d=\"M5 7H19\"/>"));
  assert.ok(other.errors.includes(STRAY), other.errors.join(' | '));
  // and on the numeral itself, beside its accepted weight
  const beside = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17').replace('stroke-width="1.5"', "stroke-width=\"1.5\" stroke-linecap='butt'"));
  assert.ok(beside.errors.includes(STRAY), beside.errors.join(' | '));
  // the weight given twice on one path
  const twice = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17').replace('stroke-width="1.5"', 'stroke-width="1.5" stroke-width="2.5"'));
  assert.ok(twice.errors.includes('path 2 carries stroke-width more than once (C32)'), twice.errors.join(' | '));
  assert.ok(twice.errors.includes(STRAY), twice.errors.join(' | '));
});

// --- C32 widened to letters: `<!-- glyph: letter -->` (2026-10-20) -------------------------
// translate's A and 文 inside its 2.5 swap hooks: at 2.5 the A's counter closed solid and the 文's
// bar came within 0.98 of its strokes, so the letters keep the outline weight, as a numeral does.
// C32's weight and nothing else: C19's opening floor of 1 is a numeral's (and a dot glyph's), not
// a letter's, so a letter's openings keep §6 or the file's `gap` note. Same fixture as C32 above.
const LETTER = ['keyline: mark', 'glyph: letter'];

test('C32 letter: a 1.5 letter beside a 2.5 rail passes, and the info line says letter', () => {
  const ok = lintSource(24, 'translate-filled.svg', RAIL24('M12 10.5V17', { notes: LETTER }));
  assert.deepEqual(ok.errors, []);
  assert.deepEqual(numPairWarn(ok), [], ok.warnings.join(' | '));
  assert.ok(ok.notes.includes('path 2 is a letter at 1.5 (C32)'), ok.notes.join(' | '));
  assert.ok(!ok.notes.some((n) => /numeral/.test(n)), ok.notes.join(' | '));
  assert.equal(ok.ink.y1, 17.75, 'the letter grows by its own half, 0.75');
  const two = lintSource(24, 'translate-filled.svg', BADGE24(['<path d="M5 7H19"/>', '<path stroke-width="1.5" d="M8 10.5V17"/>', '<path stroke-width="1.5" d="M16 10.5V17"/>'], LETTER));
  assert.deepEqual(two.errors, []);
  assert.ok(two.notes.includes('paths 2, 3 are letters at 1.5 (C32)'), two.notes.join(' | '));
  // its pair air is read at its own weight, as a numeral's is
  const close = lintSource(24, 'translate-filled.svg', RAIL24('M12 10V17', { notes: LETTER }));
  assert.deepEqual(numPairWarn(close), ['paths 1/2 are 3 apart — §6 needs 3.5 (edge gap 1 < 1.5)']);
});

test('C32 letter: the numeral\'s errors, in the letter\'s words — wrong weight, the root\'s own, a stale note, beside a badge', () => {
  const wrong = lintSource(24, 'translate-filled.svg', RAIL24('M12 10.5V17', { notes: LETTER, sw: '2' }));
  assert.ok(wrong.errors.some((e) => /^path 2 carries stroke-width="2" — a letter keeps this master's outline weight, "1\.5" \(C32\)$/.test(e)), wrong.errors.join(' | '));
  assert.ok(!wrong.errors.some((e) => /no path carries/.test(e)), 'one error for one mistake');
  const at16 = lintSource(16, 'translate-filled.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <!-- keyline: mark -->\n  <!-- glyph: letter -->\n  <path d="M3 5H13"/>\n  <path stroke-width="1.5" d="M8 8V12"/>\n</svg>\n');
  assert.ok(at16.errors.some((e) => /^path 2 carries stroke-width="1\.5" — a letter keeps this master's outline weight, "1\.25" \(C32\)$/.test(e)), at16.errors.join(' | '));
  const outline = lintSource(24, 'translate.svg', RAIL24('M12 10.5V17', { notes: LETTER }).replace('stroke-width="2.5"', 'stroke-width="1.5"'));
  assert.ok(outline.errors.some((e) => /path 2 carries stroke-width="1\.5", which is the root's own — only a letter inside a line-heavy filled drawing needs its own weight \(C32\); delete it/.test(e)), outline.errors.join(' | '));
  const stale = lintSource(24, 'translate-filled.svg', BADGE24(['<path d="M5 7H19"/>', '<path d="M12 10.5V17"/>'], LETTER));
  assert.ok(stale.errors.some((e) => /^declares <!-- glyph: letter --> but no path carries its own weight/.test(e)), stale.errors.join(' | '));
  const both = lintSource(24, 'translate-filled.svg', RAIL24('M12 10.5V17', { notes: ['keyline: mark', 'glyph: letter', 'badge: line'] }));
  assert.ok(both.errors.some((e) => /^declares both <!-- glyph: letter --> and <!-- badge: line -->/.test(e)), both.errors.join(' | '));
  assert.ok(both.notes.includes('path 2 is a letter at 1.5 (C32)'), 'read as the letter note alone');
});

test('C32 letter: a letter\'s 1.23 opening warns under §6 — it would pass as a numeral — and honours a gap note', () => {
  // the list-ordered 2 (1.23 mouth at 1.25) as a kept-weight path beside a rail at 2, at 16
  const src = (notes) => ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    ...notes.map((n) => `  <!-- ${n} -->`), '  <path d="M9.5 3.5H13.5"/>', `  <path stroke-width="1.25" d="${TWO16('2.65 10.5')}"/>`, '</svg>', ''].join('\n');
  const letter = lintSource(16, 'x-filled.svg', src(LETTER));
  assert.deepEqual(letter.errors, []);
  assert.ok(letter.notes.includes('path 2 is a letter at 1.25 (C32)'), letter.notes.join(' | '));
  assert.equal(selfWarn(letter).length, 1, letter.warnings.join(' | '));
  assert.match(selfWarn(letter)[0], /^path 2 comes within 1\.23 of itself .* — §6 needs 1\.5 /);
  const numeral = lintSource(16, 'x-filled.svg', src(['keyline: mark', 'glyph: numeral']));
  assert.deepEqual(numeral.errors, []);
  assert.deepEqual(selfWarn(numeral), [], 'the numeral takes C19\'s floor of 1');
  assert.ok(numeral.notes.includes('C19 numeral opening 1.23 — floor 1, not §6\'s 1.5'), numeral.notes.join(' | '));
  const agreed = lintSource(16, 'x-filled.svg', src(['keyline: mark', 'gap: 1', 'glyph: letter']));
  assert.deepEqual(agreed.errors, [], 'the gap note is in use: the letter needs it');
  assert.deepEqual(selfWarn(agreed), []);
  assert.ok(agreed.notes.includes('agreed gap 1 — smallest measured 1.23'), agreed.notes.join(' | '));
});

test('C32 letter: the inside of a closed letter path (§5f) keeps §6 — it would pass as a numeral', () => {
  // a closed counter 2.75 tall at 1.5: 1.25 of air inside, read by §5f (5b skips a closed path)
  const src = (notes) => BADGE24(['<path d="M5 7H19"/>', '<path stroke-width="1.5" d="M9 12H15V14.75H9Z"/>'], notes);
  const faces = (r) => r.warnings.filter((w) => /faces itself/.test(w));
  const letter = lintSource(24, 'translate-filled.svg', src(LETTER));
  assert.deepEqual(letter.errors, []);
  assert.equal(faces(letter).length, 1, letter.warnings.join(' | '));
  assert.match(faces(letter)[0], /^path 2 faces itself across 1\.25 of air at .* — §6 needs 1\.5$/);
  const numeral = lintSource(24, 'translate-filled.svg', src(['keyline: mark', 'glyph: numeral']));
  assert.deepEqual(numeral.errors, []);
  assert.deepEqual(faces(numeral), [], 'the numeral takes C19\'s floor of 1');
});

test('draft-svg writes `glyph: letter` with `filled.glyph` at the outline weight, the note only where a letter keeps its weight (C32)', () => {
  const m = (w) => ({ 24: w, 20: w, 16: w });
  const c = { id: 'T', label: 'letters', glyph: 'letter', masters: m(['M5 7H19', 'M12 10.5V17']),
    filled: { 24: { weight: 2.5, stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] }, 20: { weight: 2, stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] }, 16: { weight: 2, stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] } } };
  const out = candidateFiles({ keyline: 'mark' }, c, 'translate');
  const f24 = out.find((f) => f.master === 24 && f.filled).src, f16 = out.find((f) => f.master === 16 && f.filled).src;
  assert.ok(out.filter((f) => f.filled).every((f) => f.src.includes('<!-- glyph: letter -->')));
  assert.ok(out.filter((f) => !f.filled).every((f) => !f.src.includes('glyph:')), 'the outline draws its letters at the outline weight already: no note');
  assert.ok(f24.includes('  <path stroke-width="1.5" d="M12 10.5V17"/>'), f24);
  assert.ok(f16.includes('  <path stroke-width="1.25" d="M12 10.5V17"/>'), f16);
  assert.match(f24, /<!-- letters, filled: weight 2\.5, ends pulled in 0\.5 so the ink box matches the outline, letter stays at 1\.5 -->/);
  const r = lintSource(24, 'translate-filled.svg', f24);
  assert.deepEqual(r.errors, []);
  assert.ok(r.notes.includes('path 2 is a letter at 1.5 (C32)'));
  // a master whose filled drawing keeps no letter at its own weight carries no note
  const shaped = candidateFiles({ keyline: 'mark' }, { ...c, filled: { ...c.filled, 24: { fill: ['M4 4H8V8H4Z'], stroke: ['M12 10.5V17'] } } }, 'translate');
  assert.ok(!shaped.find((f) => f.master === 24 && f.filled).src.includes('glyph:'));
  // the board may carry the flag; without one, filled.glyph is refused
  assert.equal(candidateFiles({ keyline: 'mark', glyph: 'letter' }, { ...c, glyph: undefined }, 'translate').length, 6);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, glyph: undefined }, 'translate'), /needs glyph: 'numeral' or glyph: 'letter'/);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, filled: { ...c.filled, 24: { stroke: ['M5 7H19'], glyph: ['M12 10.5V17'] } } }, 'translate'), /heavier than 1\.5 .* the letter belongs in filled\.stroke/);
});

// --- C33: a line badge keeps the outline weight on a line-heavy base (2026-10-19) ----------
// passkey-2's key on fingerprint's bold print: drawn at 2.5 the bow closed solid and the key read
// as a thermometer. Its paths carry `stroke-width` at the outline weight, as a C32 numeral's do,
// in a filled file that declares `<!-- badge: line -->`; badge-to-base air floors at MIN_GAP,
// each side at its own weight, whatever the file's `gap` note says. Same fixture as C32 above.
const BADGE = ['keyline: mark', 'badge: line'];
const BADGE24 = (paths, notes = BADGE) => [ROOT24F, ...notes.map((n) => `  <!-- ${n} -->`), ...paths.map((p) => `  ${p}`), '</svg>', ''].join('\n');

test('parseBadgeNote reads line and refuses anything else', () => {
  assert.deepEqual(parseBadgeNote('<!-- badge: line -->'), { kind: 'line', raw: 'line' });
  assert.deepEqual(parseBadgeNote('<!--badge:line-->'), { kind: 'line', raw: 'line' });
  assert.equal(parseBadgeNote('<!-- glyph: numeral -->'), null);
  assert.ok(parseBadgeNote('<!-- badge: lines -->').bad);
  assert.ok(parseBadgeNote('<!-- badge: shape -->').bad, 'a shape badge fills; it has no note');
});

test('C33: a 1.5 line badge beside a 2.5 base is measured at its own weight, and its air is said', () => {
  const ok = lintSource(24, 'passkey-2-filled.svg', RAIL24('M12 10.5V17', { notes: BADGE }));
  assert.deepEqual(ok.errors, []);
  assert.deepEqual(numPairWarn(ok), [], ok.warnings.join(' | '));
  assert.ok(ok.notes.includes('path 2 is the line badge at 1.5 (C33)'), ok.notes.join(' | '));
  assert.ok(ok.notes.includes('line badge to base: tightest air 1.5 (C33, floor 1.5)'), ok.notes.join(' | '));
  assert.match(ok.notes.at(-1), /declared mark/, 'the headline stays last');
  assert.equal(ok.ink.y1, 17.75, 'the badge grows by its own half, 0.75');
  const close = lintSource(24, 'passkey-2-filled.svg', RAIL24('M12 10V17', { notes: BADGE }));
  assert.equal(numPairWarn(close).length, 1);
  assert.match(numPairWarn(close)[0], /^paths 1\/2 are 3 apart — C33 badge air needs 3\.5 \(edge gap 1 < 1\.5\)$/);
});

test('C33: the file\'s gap note loosens the base, never the badge', () => {
  // rails 3.5 apart at 2.5 leave 1 of air (agreed); the badge stands 3 from the top rail, 1 of air
  const src = (y) => BADGE24(['<path d="M5 7H19"/>', '<path d="M5 10.5H10"/>', `<path stroke-width="1.5" d="M14 ${y}V17"/>`], ['keyline: mark', 'gap: 1', 'badge: line']);
  const r = lintSource(24, 'passkey-2-filled.svg', src(10));
  assert.deepEqual(r.errors, [], 'the note is in use: the base needs it');
  assert.ok(r.notes.includes('agreed gap 1 — smallest measured 1'), r.notes.join(' | '));
  assert.deepEqual(numPairWarn(r), ['paths 1/3 are 3 apart — C33 badge air needs 3.5 (edge gap 1 < 1.5)']);
  const clear = lintSource(24, 'passkey-2-filled.svg', src(10.5));
  assert.deepEqual(numPairWarn(clear), [], clear.warnings.join(' | '));
  assert.ok(clear.notes.includes('agreed gap 1 — smallest measured 1'), 'badge air is not what keeps the note in use');
});

test('C33: a badge that touches or crosses its base warns — it is cut back, never joined', () => {
  const touch = lintSource(24, 'passkey-2-filled.svg', RAIL24('M12 7V17', { notes: BADGE }));
  assert.ok(touch.warnings.includes('paths 1/2 meet — C33 cuts the base back with 1.5 of air from the badge\'s ink'), touch.warnings.join(' | '));
  const cross = lintSource(24, 'passkey-2-filled.svg', RAIL24('M12 4V17', { notes: BADGE }));
  assert.ok(cross.warnings.includes('paths 1/2 meet — C33 cuts the base back with 1.5 of air from the badge\'s ink'), cross.warnings.join(' | '));
  // the badge's own paths join by design: a key's bow, shank and tooth
  const key = lintSource(24, 'passkey-2-filled.svg', BADGE24(['<path d="M5 5H11"/>',
    ...['M16.5 19A2.25 2.25 0 1 0 21 19A2.25 2.25 0 1 0 16.5 19Z', 'M18.75 16.75L18.75 11.75', 'M18.75 13.75L21 13.75'].map((d) => `<path stroke-width="1.5" d="${d}"/>`)]));
  assert.deepEqual(key.errors, []);
  assert.ok(!key.warnings.some((w) => /meet|apart/.test(w)), key.warnings.join(' | '));
  assert.ok(key.notes.includes('paths 2, 3, 4 are the line badge at 1.5 (C33)'), key.notes.join(' | '));
});

test('C33: a badge pair floors at 1.5 even beside `glyph: dot` — a ring badge is not the glyph\'s dot', () => {
  // isDot reads any closed two-arc ring as a dot, so before the fix the pair took C19's 1 and passed
  const ring = 'M10 14.1A2 2 0 1 0 14 14.1A2 2 0 1 0 10 14.1Z';   // top 12.1: 3.1 from the line, 1.1 of air
  const r = lintSource(24, 'passkey-2-filled.svg', BADGE24(['<path d="M5 9H19"/>', `<path stroke-width="1.5" d="${ring}"/>`], ['keyline: mark', 'glyph: dot', 'badge: line']));
  assert.deepEqual(r.errors, []);
  assert.deepEqual(numPairWarn(r), ['paths 1/2 are 3.1 apart — C33 badge air needs 3.5 (edge gap 1.1 < 1.5)']);
  assert.ok(r.notes.includes('line badge to base: tightest air 1.1 (C33, floor 1.5)'), r.notes.join(' | '));
});

test('C33: the badge note is an ERROR when lint cannot read it, when nothing draws under it, or beside glyph: numeral', () => {
  const none = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17', { notes: ['keyline: mark'] }));
  assert.ok(none.errors.some((e) => /only a numeral or a letter may, in a file that declares <!-- glyph: numeral --> or <!-- glyph: letter --> \(C32\), or a line badge, in one that declares <!-- badge: line --> \(C33\)/.test(e)), none.errors.join(' | '));
  const wrong = lintSource(24, 'passkey-2-filled.svg', RAIL24('M12 10.5V17', { notes: BADGE, sw: '2' }));
  assert.ok(wrong.errors.some((e) => /^path 2 carries stroke-width="2" — a line badge keeps this master's outline weight, "1\.5" \(C33\)$/.test(e)), wrong.errors.join(' | '));
  assert.ok(!wrong.errors.some((e) => /no path carries/.test(e)), 'one error for one mistake');
  const outline = lintSource(24, 'passkey-2.svg', RAIL24('M12 10.5V17', { notes: BADGE }).replace('stroke-width="2.5"', 'stroke-width="1.5"'));
  assert.ok(outline.errors.some((e) => /which is the root's own — only a line badge on a line-heavy filled base needs its own weight \(C33\); delete it/.test(e)), outline.errors.join(' | '));
  const stale = lintSource(24, 'passkey-2-filled.svg', BADGE24(['<path d="M5 7H19"/>', '<path d="M12 10.5V17"/>']));
  assert.ok(stale.errors.some((e) => /^declares <!-- badge: line --> but no path carries its own weight/.test(e)), stale.errors.join(' | '));
  const misspelt = lintSource(24, 'passkey-2-filled.svg', RAIL24('M12 10.5V17', { notes: ['keyline: mark', 'badge: lines'] }));
  assert.ok(misspelt.errors.some((e) => /^badge note "lines" is not a kind lint knows/.test(e)), misspelt.errors.join(' | '));
  assert.ok(misspelt.errors.some((e) => /path 2 carries its own stroke-width/.test(e)), 'and the path is then refused');
  const both = lintSource(24, 'repeat-once-filled.svg', RAIL24('M12 10.5V17', { notes: ['keyline: mark', 'glyph: numeral', 'badge: line'] }));
  assert.ok(both.errors.some((e) => /^declares both <!-- glyph: numeral --> and <!-- badge: line -->/.test(e)), both.errors.join(' | '));
  assert.ok(both.notes.includes('path 2 is a numeral at 1.5 (C32)'), 'read as the numeral note alone');
});

test('draft-svg writes `filled.badge` at the outline weight, with the note only where it draws, and refuses it where it does not belong (C33)', () => {
  const m = (w) => ({ 24: w, 20: w, 16: w });
  const fl = (weight) => ({ weight, stroke: ['M5 7H19'], badge: ['M12 10.5V17'] });
  const c = { id: 'P', label: 'stem', badge: 'line', masters: m(['M5 7H19', 'M12 10.5V17']), filled: { 24: fl(2.5), 20: fl(2), 16: fl(2) } };
  const out = candidateFiles({ keyline: 'mark' }, c, 'passkey-2');
  const f24 = out.find((f) => f.master === 24 && f.filled).src, f16 = out.find((f) => f.master === 16 && f.filled).src;
  assert.ok(f24.includes('  <path stroke-width="1.5" d="M12 10.5V17"/>'), f24);
  assert.ok(f16.includes('  <path stroke-width="1.25" d="M12 10.5V17"/>'), f16);
  assert.ok(f24.includes('stroke-width="2.5" stroke-linecap'), 'the root keeps the filled weight');
  assert.match(f24, /<!-- stem, filled: weight 2\.5, ends pulled in 0\.5 so the ink box matches the outline, badge stays at 1\.5 -->/);
  assert.ok(out.filter((f) => f.filled).every((f) => f.src.includes('<!-- badge: line -->')));
  assert.ok(out.filter((f) => !f.filled).every((f) => !f.src.includes('badge:')), 'the outline draws at 1.5 already: no note');
  const r = lintSource(24, 'passkey-2-filled.svg', f24);
  assert.deepEqual(r.errors, []);
  assert.ok(r.notes.includes('path 2 is the line badge at 1.5 (C33)'));
  // the board may carry the flag for every candidate
  assert.equal(candidateFiles({ keyline: 'mark', badge: 'line' }, { ...c, badge: undefined }, 'passkey-2').length, 6);
  // refusals
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, badge: undefined }, 'passkey-2'), /needs badge: 'line'/);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, badge: 'shape' }, 'passkey-2'), /badge: 'shape' is not a kind/);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, filled: { ...c.filled, 24: { fill: ['M4 4H8V8H4Z'], badge: ['M12 10.5V17'] } } }, 'passkey-2'), /fills shapes/);
  assert.throws(() => candidateFiles({ keyline: 'mark' }, { ...c, filled: { ...c.filled, 24: { stroke: ['M5 7H19'], badge: ['M12 10.5V17'] } } }, 'passkey-2'), /heavier than 1\.5/);
});

test('a solid key is not a bend: a closed capsule no wider than its stroke (calculator, 2026-10-19)', () => {
  const key = 'M11.75 9A0.25 0.25 0 0 1 12.25 9L12.25 15A0.25 0.25 0 0 1 11.75 15Z';   // centreline 0.5 wide
  assert.equal(isSolidStroke(key, 1.5), true);
  assert.equal(isSolidStroke(key, 0.4), false);                                         // thinner stroke leaves a counter
  assert.equal(isSolidStroke('M9 12A3 3 0 0 1 15 12A3 3 0 0 1 9 12Z', 1.5), false);    // a ring has a hole
  assert.equal(isSolidStroke('M11.75 9A0.25 0.25 0 0 1 12.25 9L12.25 15', 1.5), false); // open: a bend, not a key
  const lint = lintSource(24, 'calculator.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><!-- keyline: mark --><!-- a key --><path d="${key}"/></svg>`);
  assert.ok(!lint.warnings.some((w) => /C10/.test(w)), lint.warnings.join('\n'));
});

// --- rings (lint §5f, 2026-10-20): the air inside a closed two-arc circle ---
// `isDot` matches every closed two-arc path, and §5f skipped them all as dots, so a ring's hole
// was never measured: passkey-2's first filled key, drawn bold, closed its bow and read as a
// thermometer at 16. A ring's hole is 2r − w across; a dot (r ≤ w/2) draws solid and has none.
const RING = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
const ringWarn = (r) => r.warnings.filter((w) => /is a ring with a hole/.test(w));
const ONE = (root, paths, notes = ['keyline: mark']) => [root, ...notes.map((n) => `  <!-- ${n} -->`), ...paths.map((d) => `  <path d="${d}"/>`), '</svg>', ''].join('\n');

test('ringHole: a ring\'s hole is 2r − w; a dot, an ellipse and a crescent have none to read', () => {
  assert.deepEqual(ringHole(RING(12, 12, 1.25), 1.5), { hole: 1, r: 1.25, at: [12, 12] });
  assert.deepEqual(ringHole(RING(12, 12, 1.5), 1.5), { hole: 1.5, r: 1.5, at: [12, 12] });
  assert.equal(ringHole(RING(8, 8, 1.375), 1.25).hole, 1.5);                     // 16's eighth grid
  // a circle split anywhere, not only across a diameter: one short arc, one long
  const c = 2 * Math.SQRT1_2;
  assert.deepEqual(ringHole(`M${12 - c} ${12 - c}A2 2 0 0 1 ${12 + c} ${12 - c}A2 2 0 1 1 ${12 - c} ${12 - c}Z`, 1.5), { hole: 2.5, r: 2, at: [12, 12] });
  // a dot: at half the stroke the hole closes to a point (97 of the set's dots are drawn so)
  for (const r of [0.75, 0.5, 0.25]) {
    assert.equal(ringHole(RING(12, 12, r), 1.5), null, `r ${r}`);
    assert.equal(isSolidDot(RING(12, 12, r), 1.5), true, `r ${r}`);
  }
  assert.equal(isSolidDot(RING(12, 12, 1.25), 1.5), false, 'a ring is not a dot');
  assert.equal(ringHole('M2.625 4.125A5.375 1.5 0 0 1 13.375 4.125A5.375 1.5 0 0 1 2.625 4.125Z', 1.25), null);   // database 16's lid
  assert.equal(ringHole('M8 1.625A6.375 6.375 0 1 0 14.375 8A4.508 4.508 0 0 1 8 1.625Z', 1.25), null);           // moon 16
  assert.equal(ringHole('M9 12A3 3 0 0 1 15 12A3 3 0 0 1 9 12', 1.5), null, 'open: a bend');
  // a semicircle traced out and back has no hole; a split at an odd angle is still a circle
  assert.equal(ringHole('M10.75 12A1.25 1.25 0 0 1 13.25 12A1.25 1.25 0 0 0 10.75 12Z', 1.5), null);
  const [sx, sy, ex, ey] = [12 + 9.25 * Math.cos(0.1), 12 + 9.25 * Math.sin(0.1), 12 + 9.25 * Math.cos(0.3), 12 + 9.25 * Math.sin(0.3)].map((n) => n.toFixed(4));
  assert.equal(ringHole(`M${sx} ${sy}A9.25 9.25 0 0 1 ${ex} ${ey}A9.25 9.25 0 1 1 ${sx} ${sy}Z`, 1.5)?.hole, 17);
  // a malformed arc is no ring, and does not stop lint (it threw before the guard)
  for (const bad of ['M10 12A0 0 0 1 0 14 12A0 0 0 1 0 10 12Z', 'M10 12A2 2 0 1 0 14A2 2 0 1 0 10Z']) {
    assert.equal(ringHole(bad, 1.5), null, bad);
    assert.doesNotThrow(() => lintSource(24, 'bad.svg', ONE(ROOT24, [bad])), bad);
  }
  // facingGap reads the same hole on the ink's edges, and nothing inside a dot
  assert.equal(facingGap([RING(12, 12, 1.25)], 1.5).self[0].gap, 1);
  assert.deepEqual(facingGap([RING(12, 12, 0.75)], 1.5).self, []);
});

test('lint §5f: a ring with a 1.0 hole warns, a 1.5 hole passes, at 24 and 16', () => {
  const tight = lintSource(24, 'key.svg', ONE(ROOT24, [RING(12, 12, 1.25)]));
  assert.deepEqual(tight.warnings, ['path 1 is a ring with a hole 1 across at 12,12 — §6 needs 1.5 (radius 1.25 at stroke 1.5)']);
  assert.deepEqual(lintSource(24, 'key.svg', ONE(ROOT24, [RING(12, 12, 1.5)])).warnings, []);
  const tight16 = lintSource(16, 'key.svg', ONE(ROOT16, [RING(8, 8, 1.125)]));
  assert.deepEqual(tight16.warnings, ['path 1 is a ring with a hole 1 across at 8,8 — §6 needs 1.5 (radius 1.125 at stroke 1.25)']);
  assert.deepEqual(lintSource(16, 'key.svg', ONE(ROOT16, [RING(8, 8, 1.375)])).warnings, []);
  // a bold bow like passkey-2's first filled key at 16: outer ⌀4.75 kept at weight 2 leaves 0.75
  const bold = ONE(ROOT16.replace('stroke-width="1.25"', 'stroke-width="2"'), [RING(8, 8, 1.375), 'M8 6.625V2.125']);
  assert.deepEqual(ringWarn(lintSource(16, 'passkey-2-filled.svg', bold)), ['path 1 is a ring with a hole 0.75 across at 8,8 — §6 needs 1.5 (radius 1.375 at stroke 2)']);
});

test('lint §5f: a solid dot is untouched — it has no hole, and stays C19\'s dot', () => {
  for (const r of [0.75, 0.5, 0.25]) {
    const dot = lintSource(24, 'dot.svg', ONE(ROOT24, [RING(12, 12, r)]));
    assert.deepEqual(dot.warnings, [], `r ${r}: ${dot.warnings.join(' | ')}`);
  }
  // C19: {dot, body} 1 apart passes at the glyph floor; a ring standing where the dot was is
  // no character's dot, so the same 1 of air is §6's and warns (before 2026-10-20 it took C19's 1)
  const glyph = (d) => lintSource(24, 'info.svg', ONE(ROOT24, [d, 'M12 10V18'], ['keyline: mark', 'glyph: dot']));
  assert.deepEqual(numPairWarn(glyph(RING(12, 7, 0.5))), []);
  assert.deepEqual(numPairWarn(glyph(RING(12, 6, 1.5))), ['paths 1/2 are 2.5 apart — §6 needs 3 (edge gap 1 < 1.5)']);
  assert.deepEqual(ringWarn(glyph(RING(12, 6, 1.5))), [], 'its own hole is 1.5');
});

test('lint §5f: a ring\'s hole honours the file\'s gap note; a badge\'s ring never does, and C19 never reaches it', () => {
  const noted = (r, notes) => lintSource(24, 'key.svg', ONE(ROOT24, [RING(12, 12, r)], ['keyline: mark', ...notes]));
  const agreed = noted(1.25, ['gap: 1']);
  assert.deepEqual(agreed.warnings, []);
  assert.deepEqual(agreed.errors, [], 'the note is in use: the ring needs it');
  assert.ok(agreed.notes.includes('agreed gap 1 — smallest measured 1'), agreed.notes.join(' | '));
  assert.deepEqual(noted(1, ['gap: 1']).warnings, ['path 1 is a ring with a hole 0.5 across at 12,12 — agreed gap 1 needs 1 (radius 1 at stroke 1.5)']);
  // `glyph: dot` lowers a character's own openings to 1, but a ring is not one
  assert.deepEqual(ringWarn(noted(1.25, ['glyph: dot'])), ['path 1 is a ring with a hole 1 across at 12,12 — §6 needs 1.5 (radius 1.25 at stroke 1.5)']);
  // a C33 ring badge on a line-heavy base keeps 1.5 inside its bow whatever the base agreed
  const badge = lintSource(24, 'passkey-2-filled.svg', BADGE24(['<path d="M5 7H19"/>', '<path d="M5 10.5H10"/>',
    `<path stroke-width="1.5" d="${RING(17, 17, 1.25)}"/>`], ['keyline: mark', 'gap: 1', 'badge: line']));
  assert.deepEqual(badge.errors, [], badge.errors.join(' | '));
  assert.deepEqual(ringWarn(badge), ['path 3 is a ring with a hole 1 across at 17,17 — §6 needs 1.5 (radius 1.25 at stroke 1.5)']);
});

// --- anatomy's detached dot is a solid one (build metrics, the Library's "void", 2026-10-20) ---
// It looked for "one detached dot" with `isDot`, which matches every closed two-arc path, so
// target's inner ring made a second "dot" (no reading), id-card 24's ring head read as the dot,
// and globe's meridian ellipse gave a negative void.
test('anatomy: a mark\'s detached dot is a solid dot, never a ring or an ellipse', () => {
  const SHELL = RING(12, 12, 9.25);
  // target: a ring and a dot inside the ring — the dot's void is to the inner ring's edge
  assert.deepEqual(anatomy([SHELL, RING(12, 12, 5), RING(12, 12, 0.75)], 1.5).gap, { size: 2.75, part: 3, ratio: 0.92 });
  // a ring head over a line (id-card at 24): no dot, so no void
  assert.equal(anatomy([SHELL, RING(12, 9, 2), 'M8 16H16'], 1.5).gap, null);
  // globe: a meridian ellipse crossing the equator is body, not a dot
  assert.equal(anatomy([SHELL, 'M12 2.75A3.75 9.25 0 1 0 12 21.25A3.75 9.25 0 1 0 12 2.75Z', 'M2.75 12H21.25'], 1.5).gap, null);
  // the dot is judged at the stroke it is drawn at: r 1 is a dot at 2, a ring at 1.5
  assert.deepEqual(anatomy([SHELL, RING(12, 8, 1), 'M12 12V17'], 2).gap, { size: 1, part: 4, ratio: 0.25 });
  assert.equal(anatomy([SHELL, RING(12, 8, 1), 'M12 12V17'], 1.5).gap, null);
});

// --- arms that cross (lint §5 and 5h, 2026-10-20): tip air at equal reach ---------------
// Where two strokes cross at an acute angle the wedge between two neighbouring arms fills in at
// 16 when the arms are short; §5 read every crossing as a join and measured nothing. Maruti's
// measure: the shorter arm's cap centre, r from the crossing, to the point r along its
// neighbour, less half of each weight. For equal arms it is the drawer's "tip air".
const rootOf = (m, w) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">`;
const AREA_OF = (d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;
const drawn = (m, w, paths, { notes = ['keyline: mark'], areas = [] } = {}) =>
  [rootOf(m, w), ...notes.map((n) => `  <!-- ${n} -->`), ...areas.map((d) => `  ${AREA_OF(d)}`), ...paths.map((d) => `  <path d="${d}"/>`), '</svg>', ''].join('\n');
const armWarn = (r) => r.warnings.filter((w) => /arm tips/.test(w));
const tipsOf = (ds, w, areas = []) => armTipGap(ds, w, areas, { weight: w });
const minGap = (list) => Math.min(...list.map((t) => t.gap));

// password-2 as shipped: six arms 60° apart, tip air 2.25 · 1.5 · 1.5, and a filled twin that
// traces the outline's arms as one evenodd shape per asterisk
const PW2 = {
  24: { w: 1.5, ds: ['M7 6.25V13.75', 'M3.75 8.13L10.25 11.88', 'M3.75 11.88L10.25 8.13', 'M17 6.25V13.75', 'M13.75 8.13L20.25 11.88', 'M13.75 11.88L20.25 8.13', 'M3.75 17.25H20.25'],
    areas: ['M6.25 8.7L6.25 6.25A0.74 0.74 0 0 1 7.75 6.25L7.75 8.7L9.87 7.48A0.74 0.74 0 0 1 10.62 8.77L8.5 10L10.62 11.23A0.74 0.74 0 0 1 9.87 12.52L7.75 11.3L7.75 13.75A0.74 0.74 0 0 1 6.25 13.75L6.25 11.3L4.13 12.52A0.74 0.74 0 0 1 3.38 11.23L5.5 10L3.38 8.77A0.74 0.74 0 0 1 4.13 7.48L6.25 8.7Z',
      'M16.25 8.7L16.25 6.25A0.74 0.74 0 0 1 17.75 6.25L17.75 8.7L19.87 7.48A0.74 0.74 0 0 1 20.62 8.77L18.5 10L20.62 11.23A0.74 0.74 0 0 1 19.87 12.52L17.75 11.3L17.75 13.75A0.74 0.74 0 0 1 16.25 13.75L16.25 11.3L14.13 12.52A0.74 0.74 0 0 1 13.38 11.23L15.5 10L13.38 8.77A0.74 0.74 0 0 1 14.13 7.48L16.25 8.7Z',
      'M4.25 16H19.75A1.25 1.25 0 0 1 19.75 18.5H4.25A1.25 1.25 0 0 1 4.25 16Z'], air: 2.25 },
  20: { w: 1.5, ds: ['M5.75 5.5V11.5', 'M3.15 7L8.35 10', 'M3.15 10L8.35 7', 'M14.25 5.5V11.5', 'M11.65 7L16.85 10', 'M11.65 10L16.85 7', 'M3.25 14.75H16.75'],
    areas: ['M5 7.2L5 5.5A0.74 0.74 0 0 1 6.5 5.5L6.5 7.2L7.97 6.35A0.74 0.74 0 0 1 8.72 7.65L7.25 8.5L8.72 9.35A0.74 0.74 0 0 1 7.97 10.65L6.5 9.8L6.5 11.5A0.74 0.74 0 0 1 5 11.5L5 9.8L3.53 10.65A0.74 0.74 0 0 1 2.78 9.35L4.25 8.5L2.78 7.65A0.74 0.74 0 0 1 3.53 6.35L5 7.2Z',
      'M13.5 7.2L13.5 5.5A0.74 0.74 0 0 1 15 5.5L15 7.2L16.47 6.35A0.74 0.74 0 0 1 17.22 7.65L15.75 8.5L17.22 9.35A0.74 0.74 0 0 1 16.47 10.65L15 9.8L15 11.5A0.74 0.74 0 0 1 13.5 11.5L13.5 9.8L12.03 10.65A0.74 0.74 0 0 1 11.28 9.35L12.75 8.5L11.28 7.65A0.74 0.74 0 0 1 12.03 6.35L13.5 7.2Z',
      'M3.5 13.75H16.5A1 1 0 0 1 16.5 15.75H3.5A1 1 0 0 1 3.5 13.75Z'], air: 1.5 },
  16: { w: 1.25, ds: ['M4.125 3.75V9.25', 'M1.743 5.125L6.507 7.875', 'M1.743 7.875L6.507 5.125', 'M11.875 3.75V9.25', 'M9.493 5.125L14.257 7.875', 'M9.493 7.875L14.257 5.125', 'M1.75 12.375H14.25'],
    areas: ['M3.5 5.417L3.5 3.75A0.624 0.624 0 0 1 4.75 3.75L4.75 5.417L6.194 4.584A0.624 0.624 0 0 1 6.819 5.666L5.375 6.5L6.819 7.334A0.624 0.624 0 0 1 6.194 8.416L4.75 7.583L4.75 9.25A0.624 0.624 0 0 1 3.5 9.25L3.5 7.583L2.056 8.416A0.624 0.624 0 0 1 1.431 7.334L2.875 6.5L1.431 5.666A0.624 0.624 0 0 1 2.056 4.584L3.5 5.417Z',
      'M11.25 5.417L11.25 3.75A0.624 0.624 0 0 1 12.5 3.75L12.5 5.417L13.944 4.584A0.624 0.624 0 0 1 14.569 5.666L13.125 6.5L14.569 7.334A0.624 0.624 0 0 1 13.944 8.416L12.5 7.583L12.5 9.25A0.624 0.624 0 0 1 11.25 9.25L11.25 7.583L9.806 8.416A0.624 0.624 0 0 1 9.181 7.334L10.625 6.5L9.181 5.666A0.624 0.624 0 0 1 9.806 4.584L11.25 5.417Z',
      'M2.125 11.375H13.875A1 1 0 0 1 13.875 13.375H2.125A1 1 0 0 1 2.125 11.375Z'], air: 1.5 },
};

test('armTipGap: password-2 reads its drawn tip air, 2.25 · 1.5 · 1.5, in both styles', () => {
  for (const [m, { w, ds, areas, air }] of Object.entries(PW2)) {
    const outline = tipsOf(ds, w);
    assert.equal(outline.cross.length, 6, `${m}: three pairs of neighbouring arms per asterisk`);
    assert.ok(outline.cross.every((t) => Math.abs(t.angle - 60) < 0.5), `${m}: 60°`);
    near(minGap(outline.cross), air, 0.01);
    // the filled twin's notches rebuild the same arms: one reading per asterisk, the outline's air
    const filled = tipsOf([], w, areas);
    assert.deepEqual(filled.cross, []);
    assert.equal(filled.notch.length, 2, `${m}: the bar has no notch`);
    near(minGap(filled.notch), air, 0.01);
  }
  // at 20 the traced arms read 1.495: inside lint's 0.01, so drawn AT the floor passes
  near(minGap(tipsOf([], 1.5, PW2[20].areas).notch), 1.495, 0.002);
});

test('lint: password-2 passes at every master, outline and filled', () => {
  for (const [m, { w, ds, areas }] of Object.entries(PW2)) {
    const outline = lintSource(+m, 'password-2.svg', drawn(+m, w, ds));
    assert.deepEqual(armWarn(outline), [], `${m}: ${outline.warnings.join(' | ')}`);
    const filled = lintSource(+m, 'password-2-filled.svg', drawn(+m, w, [], { areas }));
    assert.deepEqual(armWarn(filled), [], `${m} filled: ${filled.warnings.join(' | ')}`);
  }
});

// password-3 as first committed (53c059c): the same asterisk with arms too short to hold 1.5
const PW3 = {
  20: ['M4.75 7.7V12.3', 'M2.76 8.85L6.74 11.15', 'M2.76 11.15L6.74 8.85', 'M11.75 7.7V12.3', 'M9.76 8.85L13.74 11.15', 'M9.76 11.15L13.74 8.85', 'M17 4.25V15.75'],
  16: ['M3.25 6.125V9.875', 'M1.626 7.063L4.874 8.938', 'M1.626 8.938L4.874 7.063', 'M9.25 6.125V9.875', 'M7.626 7.063L10.874 8.938', 'M7.626 8.938L10.874 7.063', 'M14 3.125V12.875'],
};

test('lint: password-3 as first drawn warns at 20 and 16 — 0.8 and 0.63 of tip air', () => {
  const at20 = armWarn(lintSource(20, 'password-3.svg', drawn(20, 1.5, PW3[20])));
  assert.equal(at20.length, 6, at20.join(' | '));
  assert.equal(at20[0], 'paths 1/2 cross at 60° with 0.8 of air at the arm tips at 5.75,11.72 — §6 needs 1.5');
  const at16 = armWarn(lintSource(16, 'password-3.svg', drawn(16, 1.25, PW3[16])));
  assert.equal(at16.length, 6, at16.join(' | '));
  assert.equal(at16[0], 'paths 1/2 cross at 60° with 0.63 of air at the arm tips at 4.06,9.41 — §6 needs 1.5');
  near(minGap(tipsOf(PW3[16], 1.25).cross), 0.625, 0.002);
});

test('armTipGap: right-angle crossings are never judged, however short the arms', () => {
  const none = (ds, w = 1.5) => assert.deepEqual(tipsOf(ds, w).cross, [], ds.join(' '));
  none(['M12 5.25v13.5', 'M5.25 12h13.5']);                                          // plus (relative commands)
  none(['M6.25 6.25l11.5 11.5', 'M17.75 6.25l-11.5 11.5']);                          // x
  none(['M9 5.25L9 18.75', 'M15 5.25L15 18.75', 'M5.25 9H18.75', 'M5.25 15H18.75']); // #
  // command: one path that crosses itself four times, every crossing square
  none(['M14.25 7.5V16.5A2.25 2.25 0 1 0 16.5 14.25H7.5A2.25 2.25 0 1 0 9.75 16.5V7.5A2.25 2.25 0 1 0 7.5 9.75H16.5A2.25 2.25 0 1 0 14.25 7.5Z']);
  // an x with arms of 1: at 90° its tips would read 1.41 − 1.5 if judged; the angle keeps it out
  none(['M11 11L13 13', 'M13 11L11 13']);
  for (const ds of [['M12 5.25v13.5', 'M5.25 12h13.5'], ['M11 11L13 13', 'M13 11L11 13']])
    assert.deepEqual(armWarn(lintSource(24, 'x.svg', drawn(24, 1.5, ds))), []);
  // the slanted # crosses at 80°: judged, and holds at 1.5 in the outline; bold, it does not
  const slanted = ['M10 5.25L7.75 18.75', 'M16.25 5.25L14 18.75', 'M5.25 9H18.75', 'M5.25 15H18.75'];
  assert.ok(minGap(tipsOf(slanted, 1.5).cross) >= 1.5);
  const bold = tipsOf(['M10 5.75L7.75 18.25', 'M16.25 5.75L14 18.25', 'M5.75 9H18.25', 'M5.75 15H18.25'], 2.5).cross;
  assert.equal(bold.length, 4);
  assert.ok(bold.every((t) => Math.abs(t.angle - 79.8) < 0.1));
  near(minGap(bold), 0.82, 0.005);
});

test('armTipGap: an overhang whose cap sits inside its neighbour\'s ink is a join (store at 16)', () => {
  // each wall starts where it crosses the awning's end scallop and pokes 1.14 past it, 25° off
  const STORE16 = ['M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z',
    'M3.625 6.375V12.375A1 1 0 0 0 4.625 13.375H11.375A1 1 0 0 0 12.375 12.375V6.375',
    'M6.625 13.375V10.625A1 1 0 0 1 7.625 9.625H8.375A1 1 0 0 1 9.375 10.625V13.375'];
  assert.deepEqual(tipsOf(STORE16, 1.25).cross, []);
  assert.deepEqual(armWarn(lintSource(16, 'store.svg', drawn(16, 1.25, STORE16))), []);
});

test('armTipGap: arms that curve are judged where they end up, tip to tip (language)', () => {
  // 文's 撇 and 捺 are arcs: at 20 filled they LEAVE the crossing 86° apart, over the gate, but
  // their tips are 57° apart and 0.5 of air sits between them
  const LANG20F = ['M3 4.75H9M6 3V4.75', 'M7.25 8.25A4.46 4.46 0 0 1 3.75 11.75', 'M4.75 8.25A4.46 4.46 0 0 0 8.25 11.75',
    'M9.5 17L12.38 12A1 1 0 0 1 14.12 12L17 17', 'M10.08 16H16.42'];
  const f20 = tipsOf(LANG20F, 2).cross;
  assert.equal(f20.length, 1);
  assert.deepEqual(f20[0].paths, [1, 2]);
  near(f20[0].angle, 56.9, 0.1);
  near(f20[0].gap, 0.5, 0.005);
  const LANG16 = ['M1.625 3.375H6.875M4.25 1.625V3.375', 'M5.25 6.125A4.031 4.031 0 0 1 2.5 8.875', 'M3.25 6.125A4.031 4.031 0 0 0 6 8.875',
    'M6.375 14.375L9.834 8.384A0.625 0.625 0 0 1 10.916 8.384L14.375 14.375', 'M7.963 11.625H12.787'];
  assert.deepEqual(armWarn(lintSource(16, 'language.svg', drawn(16, 1.25, LANG16))),
    ['paths 2/3 cross at 61° with 0.75 of air at the arm tips at 4.25,6.13 — §6 needs 1.5']);
  // the A's crossbar ends on its legs: a T-join, not judged
  assert.ok(tipsOf(LANG16, 1.25).cross.every((t) => t.paths.join() === '1,2'));
});

test('lint: a character\'s own crossing arms floor at C19\'s 1 under `glyph:`; the gap note and a badge keep theirs', () => {
  // an asterisk inside a ring, arms 2.75 at 1.5: 1.25 of tip air (1.26 once its ends are on 2 dp).
  // Where its strokes cross on a sample of the pair loop, the crossing branch cannot see it, and
  // the pair is judged after the loop - so the order of the warnings is not the paths' order.
  const star = (r) => {
    const dx = (r * Math.cos(Math.PI / 6)).toFixed(2), dy = (r / 2).toFixed(2), f = (n) => +n.toFixed(2);
    return [`M12 ${f(12 - r)}V${f(12 + r)}`, `M${f(12 - dx)} ${f(12 - dy)}L${f(12 + +dx)} ${f(12 + +dy)}`, `M${f(12 - dx)} ${f(12 + +dy)}L${f(12 + +dx)} ${f(12 - dy)}`];
  };
  const lint = (r, notes) => lintSource(24, 'mark.svg', drawn(24, 1.5, [RING(12, 12, 9.25), ...star(r)], { notes: ['keyline: mark', ...notes] }));
  const plain = armWarn(lint(2.75, [])).sort();
  assert.deepEqual(plain.map((w) => w.slice(0, 10)), ['paths 2/3 ', 'paths 2/4 ', 'paths 3/4 ']);
  for (const w of plain) assert.match(w, /^paths \d\/\d cross at 60° with 1\.2\d of air at the arm tips at [\d.,]+ — §6 needs 1\.5$/);
  assert.deepEqual(armWarn(lint(2.75, ['glyph: dot'])), [], 'the inside of a character');
  // a numeral's floor is its own: one path crossing itself takes 1, separate paths keep 1.5
  assert.equal(armWarn(lint(2.75, ['glyph: numeral'])).length, 3, 'numeral to numeral keeps §6');
  const one = (notes) => lintSource(24, 'mark.svg', drawn(24, 1.5, [RING(12, 12, 9.25), star(2.75).join('')], { notes: ['keyline: mark', ...notes] }));
  assert.match(armWarn(one([]))[0], /^path 2 crosses itself at 60° with 1\.2\d of air at the arm tips at [\d.,]+ — §6 needs 1\.5$/);
  assert.deepEqual(armWarn(one(['glyph: numeral'])), []);
  assert.match(armWarn(lint(2.25, ['glyph: dot']))[0], /with 0\.7\d of air at the arm tips at [\d.,]+ — C19 glyph gap needs 1$/);
  // the agreed gap governs crossing arms like any other air, and is in use for them
  const agreed = lint(2.75, ['gap: 1']);
  assert.deepEqual(armWarn(agreed), []);
  assert.deepEqual(agreed.errors, [], agreed.errors.join(' | '));
  assert.ok(agreed.notes.some((n) => /^agreed gap 1 — smallest measured 1\.2\d$/.test(n)), agreed.notes.join(' | '));
  assert.match(armWarn(lint(2.25, ['gap: 1']))[0], /0\.7\d of air at the arm tips at [\d.,]+ — agreed gap 1 needs 1$/);
  // a C33 line badge's own arms keep 1.5, whatever the base agreed
  const badge = lintSource(24, 'passkey-2-filled.svg', BADGE24(['<path d="M5 7H19"/>', '<path d="M5 10.5H10"/>',
    ...star(2.75).map((d) => `<path stroke-width="1.5" d="${d.replace(/[\d.]+/g, (n) => String(+(+n + 4).toFixed(2)))}"/>`)], ['keyline: mark', 'gap: 1', 'badge: line']));
  assert.deepEqual(badge.errors, [], badge.errors.join(' | '));
  assert.equal(armWarn(badge).length, 3, badge.warnings.join(' | '));
  for (const w of armWarn(badge)) assert.match(w, /^paths [345]\/[345] cross at 60° with 1\.2\d of air at the arm tips at [\d.,]+ — §6 needs 1\.5$/);
});

test('armTipGap: an arrowhead is not judged, even where the shaft pokes through its point', () => {
  const ARROW = ['M14.81 7.75L18.53 11.47A0.75 0.75 0 0 1 18.53 12.53L14.81 16.25', 'M18.75 12H5.25'];   // arrow-right 24
  // a tight head whose legs would leave 0.67 at their tips if read as crossing arms; all three
  // arms point back from the crossing, so no gap between neighbours is under 180°
  const POKED = ['M16 10L18 12L16 14', 'M5 12H18.5'];
  for (const ds of [ARROW, POKED]) {
    assert.deepEqual(tipsOf(ds, 1.5).cross, [], ds.join(' '));
    assert.deepEqual(armWarn(lintSource(24, 'arrow.svg', drawn(24, 1.5, ds))), []);
  }
});

test('armTipGap: unequal arms are read at the shorter arm\'s reach; the longer arm\'s extra is ignored', () => {
  // a horizontal with arms 5 and 2.5, crossed at 60° by a line with arms 2.5 and 5: each 60°
  // wedge pairs a 2.5 arm with a 5 arm. Tip to tip it would read 2.83; at equal reach, 2.5 − 1.5
  const ds = ['M7 12H14.5', 'M10.75 9.83L14.5 16.33'];
  const [t] = tipsOf(ds, 1.5).cross;
  near(t.angle, 60, 0.1);
  near(t.reach, 2.5, 0.01);
  near(t.gap, 1, 0.01);
  assert.deepEqual(armWarn(lintSource(24, 'x.svg', drawn(24, 1.5, ds))), [`paths 1/2 cross at 60° with ${r2t(t.gap)} of air at the arm tips at ${t.at.join(',')} — §6 needs 1.5`]);
});
const r2t = (n) => Math.round(n * 100) / 100;

test('lint §5h: password-3-filled as first drawn (53c059c) warns at 16 — 0.62 at the traced tips', () => {
  const PW3F16 = ['M2.625 6.917L2.625 6.125A0.624 0.624 0 0 1 3.875 6.125L3.875 6.917L4.561 6.521A0.624 0.624 0 0 1 5.186 7.604L4.5 8L5.186 8.396A0.624 0.624 0 0 1 4.561 9.479L3.875 9.083L3.875 9.875A0.624 0.624 0 0 1 2.625 9.875L2.625 9.083L1.939 9.479A0.624 0.624 0 0 1 1.314 8.396L2 8L1.314 7.604A0.624 0.624 0 0 1 1.939 6.521L2.625 6.917Z',
    'M8.625 6.917L8.625 6.125A0.624 0.624 0 0 1 9.875 6.125L9.875 6.917L10.561 6.521A0.624 0.624 0 0 1 11.186 7.604L10.5 8L11.186 8.396A0.624 0.624 0 0 1 10.561 9.479L9.875 9.083L9.875 9.875A0.624 0.624 0 0 1 8.625 9.875L8.625 9.083L7.939 9.479A0.624 0.624 0 0 1 7.314 8.396L8 8L7.314 7.604A0.624 0.624 0 0 1 7.939 6.521L8.625 6.917Z',
    'M13 3.5A1 1 0 0 1 15 3.5V12.5A1 1 0 0 1 13 12.5Z'];
  assert.deepEqual(armWarn(lintSource(16, 'password-3-filled.svg', drawn(16, 1.25, [], { areas: PW3F16 }))), [
    'a filled shape\'s arms meet at 60° with 0.62 of air at the arm tips at 4.06,6.59 — §6 needs 1.5',
    'a filled shape\'s arms meet at 60° with 0.62 of air at the arm tips at 8.44,6.59 — §6 needs 1.5',
  ]);
});

test('lint §5h: a traced character\'s own notches floor at C19\'s 1 under `glyph:`; the silhouette and the gap note keep theirs', () => {
  // an asterisk traced as one shape, as password-2-filled draws it: six arms r from (12, 12),
  // 1.5 wide with round tips, tip air r − 1.5
  const traced = (r, h = 0.75) => {
    const f = (n) => +n.toFixed(2), at = (a, d, s = 0) => [f(12 + d * Math.cos(a) + s * Math.sin(a)), f(12 + d * Math.sin(a) - s * Math.cos(a))];
    const arm = (k) => (-90 + 60 * k) * Math.PI / 180, notch = (k) => at(arm(k) - Math.PI / 6, 2 * h);
    let d = `M${notch(0).join(' ')}`;
    for (let k = 0; k < 6; k++) d += `L${at(arm(k), r, h).join(' ')}A${h - 0.01} ${h - 0.01} 0 0 1 ${at(arm(k), r, -h).join(' ')}L${notch(k + 1).join(' ')}`;
    return `${d}Z`;
  };
  const RINGED = 'M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12ZM4.25 12A7.75 7.75 0 1 0 19.75 12A7.75 7.75 0 1 0 4.25 12Z';
  const lint = (areas, notes) => lintSource(24, 'mark-filled.svg', drawn(24, 1.5, [], { areas, notes: ['keyline: mark', ...notes] }));
  near(tipsOf([], 1.5, [traced(2.75)]).notch[0].gap, 1.25, 0.02);
  assert.match(armWarn(lint([RINGED, traced(2.75)], []))[0] ?? '', /^a filled shape's arms meet at 60° with 1\.2\d of air at the arm tips at [\d.,]+ — §6 needs 1\.5$/);
  assert.deepEqual(armWarn(lint([RINGED, traced(2.75)], ['glyph: dot'])), [], 'the inside of a character');
  assert.deepEqual(armWarn(lint([RINGED, traced(2.75)], ['glyph: numeral'])), [], 'a notch is always within one shape');
  assert.match(armWarn(lint([RINGED, traced(2.25)], ['glyph: dot']))[0] ?? '', /0\.7\d of air at the arm tips at [\d.,]+ — C19 glyph gap needs 1$/);
  // drawn alone, the asterisk IS the silhouette: not the inside of a character, so §6's 1.5
  assert.match(armWarn(lint([traced(2.75)], ['glyph: dot']))[0] ?? '', /— §6 needs 1\.5$/);
  // the agreed gap governs a traced notch, and is in use for it
  const agreed = lint([RINGED, traced(2.75)], ['gap: 1']);
  assert.deepEqual(armWarn(agreed), []);
  assert.deepEqual(agreed.errors, [], agreed.errors.join(' | '));
  assert.ok(agreed.notes.some((n) => /^agreed gap 1 — smallest measured 1\.2\d$/.test(n)), agreed.notes.join(' | '));
});

// --- inside air (lint §5i, 2026-10-20): the widest circle in one closed shape's white ----------
// docs/01 §6's "no enclosed shape smaller than 1.5 units across", measured as Maruti agreed it: the
// diameter of the widest circle that fits in the white one closed shape leaves inside itself.
// facingGap reads a neck square-on and nothing inside a wedge or a small triangle, so rewind-2's
// trailing triangle (1.07 at 16 and 20) and video-3's play at 20 (1.13) passed in silence.
const airWarn = (r) => r.warnings.filter((w) => /of air inside/.test(w));
const airLines = (r) => r.warnings.filter((w) => /of air|a hole|itself/.test(w));
const WEDGE10 = 'M4 12L15.23 11.02L15.23 12.98Z';   // 10°, 0.2964 inside (its incircle, less the stroke)
const WEDGE17 = 'M4 12L15.23 10.25L15.23 13.75Z';   // the same length opened to ~17.7°: 1.4968 inside
const THIN = 'M4 11.1H20V12.9H4Z';                  // a channel 1.8 − 1.5 = 0.3 tall
const TRI12 = 'M12 9.3L14.34 13.35L9.66 13.35Z';    // incircle 1.35 at the centreline: 1.2 inside

test('insideAir: a 10° wedge with 0.30 inside warns, where lint was silent; opened to ~17.7° (1.5 inside) it passes', () => {
  near(insideAir([WEDGE10], 1.5).paths[0].air, 0.2964, 0.003);
  assert.deepEqual(facingGap([WEDGE10], 1.5).self, [], 'its walls never face square-on');
  const tight = lintSource(24, 'wedge.svg', ONE(ROOT24, [WEDGE10]));
  assert.deepEqual(airLines(tight), ['path 1 leaves 0.3 of air inside itself at 14.33,12 (the widest circle that fits) — §6 needs 1.5']);
  near(insideAir([WEDGE17], 1.5).paths[0].air, 1.4968, 0.003);
  assert.deepEqual(airLines(lintSource(24, 'wedge.svg', ONE(ROOT24, [WEDGE17]))), []);
});

test('insideAir: a thin rectangle reads 0.30, as facingGap does, and warns once, not twice', () => {
  const [ia] = insideAir([THIN], 1.5).paths;
  assert.equal(ia.air, 0.3);
  assert.equal(facingGap([THIN], 1.5).self[0].gap, 0.3);
  assert.deepEqual(airLines(lintSource(24, 'slot.svg', ONE(ROOT24, [THIN]))), ['path 1 faces itself across 0.3 of air at 4.79,12 — §6 needs 1.5']);
});

test('insideAir: a play triangle, an alert triangle and a shield pass — sharp inner corners never decide it', () => {
  const PLAY16 = 'M4.22 4.13A1 1 0 0 1 5.22 3.13A1 1 0 0 1 5.71 3.26L12.46 7.13A1 1 0 0 1 12.97 8A1 1 0 0 1 12.46 8.87L5.71 12.74A1 1 0 0 1 5.22 12.88A1 1 0 0 1 4.22 11.88Z';
  const ALERT16 = ['M6.227 2.699A2 2 0 0 1 8 1.625A2 2 0 0 1 9.773 2.699L14.204 11.18A1.5 1.5 0 0 1 14.375 11.875A1.5 1.5 0 0 1 12.875 13.375L3.125 13.375A1.5 1.5 0 0 1 1.625 11.875A1.5 1.5 0 0 1 1.796 11.18Z',
    'M8 5.25V7.375', 'M7.625 10A0.375 0.375 0 1 0 8.375 10A0.375 0.375 0 1 0 7.625 10Z'];
  const SHIELD16 = 'M8 1.625L10.875 1.625A1.5 1.5 0 0 1 12.375 3.125L12.375 8.947A5.5 5.5 0 0 1 8.935 14.046L8.234 14.329A0.625 0.625 0 0 1 8 14.375A0.625 0.625 0 0 1 7.766 14.329L7.065 14.046A5.5 5.5 0 0 1 3.625 8.947L3.625 3.125A1.5 1.5 0 0 1 5.125 1.625L8 1.625Z';
  // video-3 16's play, drawn at the floor: its incircle leaves 1.496, inside lint's 0.01
  const VPLAY16 = 'M7.437 4.664L9.684 5.958A0.625 0.625 0 0 1 9.684 7.042L7.437 8.336A0.625 0.625 0 0 1 6.5 7.794L6.5 5.206A0.625 0.625 0 0 1 7.437 4.664Z';
  for (const [ds, least] of [[[PLAY16], 5], [ALERT16, 7.5], [[SHIELD16], 7.4], [[VPLAY16], 1.49]]) {
    const got = insideAir(ds, 1.25).paths;
    assert.equal(got.length, 1, ds[0]);   // the dot is solid: no white, no reading
    assert.ok(got[0].air >= least, `${got[0].air} < ${least}`);
    assert.deepEqual(airWarn(lintSource(16, 'shape.svg', ONE(ROOT16, ds))), [], ds[0]);
  }
  near(insideAir([VPLAY16], 1.25).paths[0].air, 1.496, 0.003);
  // the same play at 20 (1.13) and rewind-2's trailing triangle (1.07) are the ones that warn
  const VPLAY20 = 'M9.62 6.88L11.34 7.85A0.75 0.75 0 0 1 11.34 9.15L9.62 10.12A0.75 0.75 0 0 1 8.5 9.47L8.5 7.53A0.75 0.75 0 0 1 9.62 6.88Z';
  const REW16 = 'M12.75 7A0.625 0.625 0 0 0 12.125 6.375A0.625 0.625 0 0 0 11.778 6.48L10.278 7.48A0.625 0.625 0 0 0 10 8A0.625 0.625 0 0 0 10.278 8.52L11.778 9.52A0.625 0.625 0 0 0 12.125 9.625A0.625 0.625 0 0 0 12.75 9Z';
  near(insideAir([VPLAY20], 1.5).paths[0].air, 1.13, 0.005);
  near(insideAir([REW16], 1.25).paths[0].air, 1.07, 0.005);
});

test('insideAir agrees with ringHole on a ring, and lint warns on a tight ring once', () => {
  const c = 2 * Math.SQRT1_2;
  for (const [d, w] of [[RING(12, 12, 1.25), 1.5], [RING(12, 12, 1.5), 1.5], [RING(8, 8, 1.375), 1.25], [RING(12, 12, 9.25), 1.5],
    [`M${12 - c} ${12 - c}A2 2 0 0 1 ${12 + c} ${12 - c}A2 2 0 1 1 ${12 - c} ${12 - c}Z`, 1.5]]) {
    const [got] = insideAir([d], w).paths;
    near(got.air, ringHole(d, w).hole, 0.003);
  }
  assert.deepEqual(insideAir([RING(12, 12, 0.75)], 1.5).paths, [], 'a dot is solid');
  assert.deepEqual(airLines(lintSource(24, 'key.svg', ONE(ROOT24, [RING(12, 12, 1.25)]))), ['path 1 is a ring with a hole 1 across at 12,12 — §6 needs 1.5 (radius 1.25 at stroke 1.5)']);
});

test('insideAir: an evenodd hole is read less any island; facingGap\'s line on the same white is not repeated', () => {
  const SQ = 'M4 4H20V20H4Z', F = (areas, notes = ['keyline: mark']) => drawn(24, 1.5, [], { areas, notes });
  // a triangular cut-out: facingGap reads nothing in it, the widest circle 1.2
  const TRI = `${SQ}M12 10.3L13.04 12.1L10.96 12.1Z`;
  assert.deepEqual(facingGap([], 1.5, [TRI]).area, []);
  near(insideAir([], 1.5, [TRI]).holes[0].air, 1.2, 0.005);
  assert.deepEqual(airLines(lintSource(24, 'x-filled.svg', F([TRI]))), ['a cut-out leaves 1.2 of air inside it at 12,11.5 (the widest circle that fits) — §6 needs 1.5']);
  // an island in a 4 × 4 hole leaves a frame 1 wide: the widest circle sits in a corner of it,
  // touching both outer walls and the island's corner, 2√2 / (1 + √2) = 1.17 — not the hole's 4
  const ISLAND = `${SQ}M10 10H14V14H10ZM11 11H13V13H11Z`;
  near(insideAir([], 1.5, [ISLAND]).holes[0].air, 2 * Math.SQRT2 / (1 + Math.SQRT2), 0.003);
  assert.deepEqual(airLines(lintSource(24, 'x-filled.svg', F([ISLAND]))), ['1 of air between two filled edges at 11.04,10.5 — §6 needs 1.5']);
  // a slot 0.5 wide: facingGap's cut line, and nothing more
  const SLOT = `${SQ}M8 11.75H16V12.25H8Z`;
  assert.equal(insideAir([], 1.5, [SLOT]).holes[0].air, 0.5);
  assert.deepEqual(airLines(lintSource(24, 'x-filled.svg', F([SLOT]))), ['0.5 of air across one cut-out at 8.04,12 — §6 needs 1.5']);
  // a shape painted inside a closed stroke takes its white
  assert.equal(insideAir([THIN.replace('11.1', '9.1').replace('12.9', '14.9')], 1.5, ['M5 10H19V12H5Z']).paths[0].air, 2.15);
});

test('lint §5i: a character\'s own closed shape floors at C19\'s 1 under `glyph:`; the silhouette, the gap note and a badge keep theirs', () => {
  const shell = RING(12, 12, 9.25), at = (notes, ds = [shell, TRI12]) => airWarn(lintSource(24, 't.svg', ONE(ROOT24, ds, ['keyline: mark', ...notes])));
  assert.deepEqual(at([]), ['path 2 leaves 1.2 of air inside itself at 12,12 (the widest circle that fits) — §6 needs 1.5']);
  assert.deepEqual(at(['glyph: dot']), [], 'the inside of a character');
  assert.deepEqual(at(['glyph: numeral']), []);
  assert.deepEqual(at(['glyph: dot'], [TRI12]), ['path 1 leaves 1.2 of air inside itself at 12,12 (the widest circle that fits) — §6 needs 1.5'], 'drawn alone it is the silhouette');
  const agreed = lintSource(24, 't.svg', ONE(ROOT24, [shell, TRI12], ['keyline: mark', 'gap: 1']));
  assert.deepEqual(airWarn(agreed), []);
  assert.deepEqual(agreed.errors, [], 'the note is in use: the triangle needs it');
  assert.ok(agreed.notes.includes('agreed gap 1 — smallest measured 1.2'), agreed.notes.join(' | '));
  // a hole: in a shape that is not the silhouette, a character's; in the silhouette, §6's
  const RINGED = 'M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12ZM4.25 12A7.75 7.75 0 1 0 19.75 12A7.75 7.75 0 1 0 4.25 12Z';
  const CUT = 'M9 9H15V15H9ZM12 10.3L13.04 12.1L10.96 12.1Z';
  const holes = (areas, notes) => airWarn(lintSource(24, 'g-filled.svg', drawn(24, 1.5, [], { areas, notes: ['keyline: mark', ...notes] })));
  assert.equal(holes([RINGED, CUT], []).length, 1);
  assert.deepEqual(holes([RINGED, CUT], ['glyph: dot']), []);
  assert.deepEqual(holes([CUT], ['glyph: dot']), ['a cut-out leaves 1.2 of air inside it at 12,11.5 (the widest circle that fits) — §6 needs 1.5']);
  // a C33 line badge's own closed shape keeps 1.5, whatever the base agreed
  const badge = lintSource(24, 'passkey-2-filled.svg', BADGE24(['<path d="M5 7H19"/>', '<path d="M5 10.5H10"/>',
    `<path stroke-width="1.5" d="${TRI12.replace(/[\d.]+/g, (n) => String(+(+n + 4).toFixed(2)))}"/>`], ['keyline: mark', 'gap: 1', 'badge: line']));
  assert.deepEqual(airWarn(badge), ['path 3 leaves 1.2 of air inside itself at 16,16 (the widest circle that fits) — §6 needs 1.5']);
});
