// Tests for selfGap — the measure docs/08 §6.4 calls "the hard one", written twice
// before and wrong both times. The fixtures are the two drawings that got through
// lint clean in one session (2026-09-18) plus the bends that must NOT flag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { facingGap, isSolidDot, isSolidStroke, materialGap, ringHole, selfGap } from './geometry.mjs';
import { checkAnchors, checkPairs, checkTwins, comparePair, lintSource, parseAnchorNote, parseBadgeNote, parseBoxNote, parseGapNote, parseGlyphNote, parseGrowsNote, stateShape } from './lint.mjs';
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

test('parseGlyphNote reads dot and numeral and refuses anything else', () => {
  assert.deepEqual(parseGlyphNote('<!-- glyph: dot -->'), { kind: 'dot', raw: 'dot' });
  assert.deepEqual(parseGlyphNote('<!--glyph:numeral-->'), { kind: 'numeral', raw: 'numeral' });
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
  assert.ok(r.errors.some((e) => /^path 2 carries its own stroke-width="1\.5" — only a numeral may, in a file that declares <!-- glyph: numeral --> \(C32\)/.test(e)), r.errors.join(' | '));
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
  assert.ok(none.errors.some((e) => /only a numeral may, in a file that declares <!-- glyph: numeral --> \(C32\), or a line badge, in one that declares <!-- badge: line --> \(C33\)/.test(e)), none.errors.join(' | '));
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
