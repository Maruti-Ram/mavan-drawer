// Tests for tools/audit/parameter-reach.mjs.
//
// A synthetic pin is written to a temporary directory: a handful of drawings whose reach under
// each parameter is known by construction — a plus and its sizes (open ends, the mark ceiling,
// the -large at the bound, SIZE_STEP), a rounded box at every master (container corners on each
// tier, eighth-grid coordinates at 16, a filled twin with a 1.5 cut), a chevron with a C10 bend
// in both weights, a solid dot, a declared glyph with a 1.0 dot gap, and three pairs of lines
// at 1.0 / 1.25 / 1.5 of air (one declared). Every count the sections report is asserted
// against those constructions, so a section that drifts fails here. A second group checks the
// identities that must hold on any set, run on the shipped files when they are present.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reach, polyGap, crosses, bands, gapReadings, drawingOf, isSolidDot, SECTIONS } from './parameter-reach.mjs';
import { samplePath } from '../geometry.mjs';
import { MIN_GAP } from '../masters.mjs';

const ROOT = (canvas, weight) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">`;
const svg = (canvas, weight, lines) => `${ROOT(canvas, weight)}\n${lines.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
const P = (d) => `<path d="${d}"/>`;
const AREA = (d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;

// ── the synthetic pin ──────────────────────────────────────────────────────────────────────

// Rounded square on the square keyline at each master: centreline inset half the stroke, radius
// on that master's de-facto tier (2.5 · 2 · 1.5).
const BOX = {
  24: 'M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z',
  20: 'M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z',
  16: 'M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z',
};

const FILES = {
  24: {
    // a plus: two crossing lines spanning the 18 mark ceiling (ink 3→21); filled at 2.5, ends pulled in 0.5
    'plus.svg': svg(24, 1.5, ['<!-- keyline: mark -->', '<!-- tags: add -->', P('M12 3.75v16.5'), P('M3.75 12h16.5')]),
    'plus-filled.svg': svg(24, 2.5, ['<!-- keyline: mark -->', P('M12 4.25v15.5'), P('M4.25 12h15.5')]),
    'plus-small.svg': svg(24, 1.5, ['<!-- keyline: mark -->', P('M12 5.25v13.5'), P('M5.25 12h13.5')]),
    'plus-small-filled.svg': svg(24, 2.5, ['<!-- keyline: mark -->', P('M12 5.75v12.5'), P('M5.75 12h12.5')]),
    // -large runs to the margin edge (ink 2→22)
    'plus-large.svg': svg(24, 1.5, ['<!-- keyline: mark -->', P('M12 2.75v18.5'), P('M2.75 12h18.5')]),
    'plus-large-filled.svg': svg(24, 2.5, ['<!-- keyline: mark -->', P('M12 3.25v17.5'), P('M3.25 12h17.5')]),
    // the box with an inner bar whose ends leave exactly 1.5 of air to the walls (3.0 centreline to centreline)
    'box.svg': svg(24, 1.5, ['<!-- a box -->', P(BOX[24]), P('M6.75 12h10.5')]),
    // its filled twin: solid 3→21 at r3.25 with the bar punched out 1.5 tall
    'box-filled.svg': svg(24, 1.5, ['<!-- a box, filled -->', AREA('M6.25 3H17.75A3.25 3.25 0 0 1 21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3ZM6.75 11.25H17.25V12.75H6.75Z')]),
    // a chevron down: 45° legs into a C10 bend of exactly half the weight (0.75 outline, 1.25 filled)
    'chev.svg': svg(24, 1.5, ['<!-- keyline: mark -->', '<!-- 45° legs, tangent points off the grid -->', P('M5.25 9.75L11.47 15.97A0.75 0.75 0 0 0 12.53 15.97L18.75 9.75')]),
    'chev-filled.svg': svg(24, 2.5, ['<!-- keyline: mark -->', '<!-- bend 1.25 -->', P('M5.75 10.25L11.12 15.62A1.25 1.25 0 0 0 12.88 15.62L18.25 10.25')]),
    // a solid dot: ink diameter 2, radius (2 − 1.5) / 2
    'dot.svg': svg(24, 1.5, ['<!-- keyline: mark -->', P('M12 11.75A0.25 0.25 0 1 1 12 12.25A0.25 0.25 0 1 1 12 11.75Z')]),
    // a glyph: ring on the ⌀20 keyline, stem, dot 1.0 above the stem (C19)
    'glyph.svg': svg(24, 1.5, ['<!-- glyph: dot -->', P('M2.75 12A9.25 9.25 0 1 1 21.25 12A9.25 9.25 0 1 1 2.75 12Z'), P('M12 10.25v6'), P('M12 7.25A0.25 0.25 0 1 1 12 7.75A0.25 0.25 0 1 1 12 7.25Z')]),
    // three pairs of parallel lines: 1.25 of air (declared), 1.5 (at the floor), 1.0 (undeclared — lint warns)
    'tight.svg': svg(24, 1.5, ['<!-- keyline: mark -->', '<!-- gap: 1.25 -->', P('M6 10h12'), P('M6 12.75h12')]),
    'tight2.svg': svg(24, 1.5, ['<!-- keyline: mark -->', P('M6 10h12'), P('M6 13h12')]),
    'tight3.svg': svg(24, 1.5, ['<!-- keyline: mark -->', P('M6 10h12'), P('M6 12.5h12')]),
  },
  // The 20 master carries the box plus one fixture per threshold the tool must not relax: each
  // sits just the wrong side of a line, so loosening that line (snap, tolerance, cap) fails a test.
  20: {
    'box.svg': svg(20, 1.5, ['<!-- a box -->', P(BOX[20])]),
    // container corners at 2.1: 0.1 off the tier — OFF at snap 0.025, on at 0.3
    'offtier.svg': svg(20, 1.5, ['<!-- r 2.1, off the tier on purpose -->', P('M5.85 3.75H14.15A2.1 2.1 0 0 1 16.25 5.85V14.15A2.1 2.1 0 0 1 14.15 16.25H5.85A2.1 2.1 0 0 1 3.75 14.15V5.85A2.1 2.1 0 0 1 5.85 3.75Z')]),
    // a chevron with a 0.8 bend: 0.05 ABOVE bendMin 0.75, so not "at" it
    'chev8.svg': svg(20, 1.5, ['<!-- keyline: mark -->', '<!-- bend 0.8, above the floor -->', P('M4.5 8.5L9.43 13.43A0.8 0.8 0 0 0 10.57 13.43L15.5 8.5')]),
    // a bar whose ink stops 0.3 inside the bound (2.3 → 17.7): not reaching it at 0.01
    'near.svg': svg(20, 1.5, ['<!-- keyline: mark -->', '<!-- 0.3 inside the bound -->', P('M3.05 10h13.9')]),
    // a box 0.3 proud of the square keyline (ink 14.3): lint's ±0.5 matches it, 0.01 does not
    'proud.svg': svg(20, 1.5, ['<!-- 0.3 proud of the square keyline -->', P('M5.6 3.6H14.4A2 2 0 0 1 16.4 5.6V14.4A2 2 0 0 1 14.4 16.4H5.6A2 2 0 0 1 3.6 14.4V5.6A2 2 0 0 1 5.6 3.6Z')]),
    // a ring of radius 1.0: two arcs, closed, but over half the stroke — not a solid dot
    'ring.svg': svg(20, 1.5, ['<!-- keyline: mark -->', P('M10 9A1 1 0 1 1 10 11A1 1 0 1 1 10 9Z')]),
    // two lines 1.245 apart (3 dp on purpose): under the floor, but NOT under a 1.25 floor on lint's −0.01 line
    'gap1245.svg': svg(20, 1.5, ['<!-- keyline: mark -->', '<!-- 1.245 of air -->', P('M5 8h10'), P('M5 10.745h10')]),
    // a filled box with a 2.0 cut: read only because the census raises facingGap's cap past lint's 1.75
    'cut2-filled.svg': svg(20, 1.5, ['<!-- a 2.0 cut -->', AREA('M5.75 3H14.25A2.75 2.75 0 0 1 17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3ZM6 9H14V11H6Z')]),
  },
  16: { 'box.svg': svg(16, 1.25, ['<!-- a box -->', P(BOX[16])]) },
};

function makePin() {
  const root = mkdtempSync(join(tmpdir(), 'parameter-reach-'));
  for (const [m, files] of Object.entries(FILES)) {
    const dir = join(root, 'src/icons', m);
    mkdirSync(dir, { recursive: true });
    for (const [f, src] of Object.entries(files)) writeFileSync(join(dir, f), src);
  }
  return root;
}

const root = makePin();
const R = reach(root, SECTIONS, { cap: 2.5, band: 0.25 });
test.after(() => rmSync(root, { recursive: true, force: true }));

// ── the helpers ────────────────────────────────────────────────────────────────────────────

test('polyGap reads point-to-segment and crosses detects a proper crossing', () => {
  const a = samplePath('M0 0h10'), b = samplePath('M0 3h10');
  // The crossing sits between samples on both lines. A crossing exactly ON a sample is not a
  // "proper" crossing for lint's test (lint.mjs:49-57, copied here); lint reads that pair as
  // touching instead (`min <= 0.1`), which is how `plus` passes — see gapReadings below.
  const c = samplePath('M5.1 -5.1v10');
  assert.ok(Math.abs(polyGap(a, b) - 3) < 1e-6, 'parallel lines 3 apart');
  assert.equal(crosses(a, c), true);
  assert.equal(crosses(a, b), false);
});

test('bands bins around a floor with lint\'s −0.01 warning line', () => {
  const b = bands([{ gap: 1.0 }, { gap: 1.495 }, { gap: 1.5 }, { gap: 1.74 }, { gap: 1.75 }, { gap: 2.0 }, { gap: 2.5 }], MIN_GAP, 0.25);
  assert.deepEqual(b, { under: 1, binding: 3, near: 1, clear: 2, total: 7 });
});

test('isSolidDot takes a disc and refuses a ring drawn as two arcs', () => {
  assert.equal(isSolidDot('M12 11.75A0.25 0.25 0 1 1 12 12.25A0.25 0.25 0 1 1 12 11.75Z', 1.5), true);
  assert.equal(isSolidDot('M2.75 12A9.25 9.25 0 1 1 21.25 12A9.25 9.25 0 1 1 2.75 12Z', 1.5), false, 'a ⌀20 ring is not a dot');
  assert.equal(isSolidDot('M12 3.75v16.5', 1.5), false);
});

// ── the sections, against the constructions ────────────────────────────────────────────────

test('the pin loads: 24 drawings (15 at 24, 8 at 20, 1 at 16), 17 concepts', () => {
  assert.equal(R.drawings, 15 + 8 + 1);
  assert.equal(R.concepts, 10 + 7);
});

test('stroke: files at the outline weight, open ends, solid dots, eighth-only coordinates', () => {
  const s = R.sections.stroke;
  assert.equal(s[24].stroke, 1.5);
  assert.equal(s[24].files, 15 - 4, 'four line-heavy filled twins are FILLED_WEIGHT\'s');
  assert.equal(s[24].outline, 10);
  assert.equal(s[24].shapeFilled, 1);
  // plus ×3 sizes: 4 ends each; box's bar 2; chev 2; glyph stem 2; tight ×3: 4 each — the filled twins are not counted
  assert.equal(s[24].openEnds, 4 * 3 + 2 + 2 + 2 + 4 * 3);
  assert.equal(s[24].dots, 2, 'dot.svg and the glyph\'s dot; the glyph\'s ring is not a dot');
  assert.equal(s[24].dotFiles, 2);
  assert.equal(s[24].eighthOnly, 0);
  assert.equal(s[16].stroke, 1.25);
  assert.equal(s[16].eighthOnly, 14, 'the 16 box: 4 corners × (two end coordinates + one H/V) + 2 for the M');
  assert.equal(s[16].eighthOnlyFiles, 1);
  // 20: seven outline files + the shape-filled cut2; the ring is closed (no ends) and is NOT a dot
  assert.equal(s[20].files, 8);
  assert.equal(s[20].openEnds, 2 + 2 + 4, 'chev8, near, the two lines of gap1245');
  assert.equal(s[20].dots, 0, 'a ring of radius 1.0 is over half the stroke: not a solid dot');
});

test('filled: the line-heavy / shape-filled split', () => {
  const f = R.sections.filled[24];
  assert.equal(f.weight, 2.5);
  assert.equal(f.lineHeavy, 4);
  assert.equal(f.lineHeavyConceptCount, 4);
  assert.equal(f.shapeFilled, 1);
  assert.equal(f.mixedShape, 0);
  assert.equal(f.outline, 10);
});

test('bend: the chevron\'s corner sits at bendMin in both weights, nothing else does', () => {
  const b = R.sections.bend[24];
  assert.deepEqual(b.bendMin, { 0.75: 1, 1.25: 1 });
  assert.equal(b.atBendMin, 2);
  assert.equal(b.roleBendAtMin, 2);
  assert.equal(b.bends, 2);
  assert.equal(b.underBendMin, 0);
  assert.deepEqual(b.byFile, { outline: 1, filled: 1 });
  // lint's reading: the same two typed radii (0.75 and 1.25); the box's A2.5 corners are not at bendMin
  assert.equal(b.typedAtBendMin, 2);
  assert.equal(b.typedAtBendMinOutlineWeight, 1, 'only chev.svg is at the outline weight');
  // 20: the 0.8 bend is 0.05 above the floor — a fillet, but not "at" bendMin on either reading
  const b20 = R.sections.bend[20];
  assert.equal(b20.bends, 1);
  assert.equal(b20.atBendMin, 0);
  assert.equal(b20.typedAtBendMin, 0);
  assert.equal(b20.underBendMin, 0);
});

test('radius: the box\'s container corners are on each master\'s tier, outline and filled alike', () => {
  const r = R.sections.radius;
  assert.equal(r[24].tier, 2.5);
  assert.equal(r[24].container.corners, 8, 'four outline corners + four filled-contour corners');
  assert.deepEqual(r[24].container.byFile, { outline: 4, filled: 4 });
  assert.deepEqual(r[24].container.onTierByFile, { outline: 4, filled: 4 }, 'the filled 3.25 reads as 2.5 on the centreline');
  assert.equal(r[24].container.histogram['2.5'], 8);
  assert.equal(r[24].container.concepts, 1);
  assert.equal(r[24].container.conceptsOnTierCount, 1);
  assert.equal(r[24].container.conceptsOffTierCount, 0);
  assert.equal(r[20].tier, 2);
  // 20: box and proud on the tier (8 outline corners), offtier's four at 2.1 off it, cut2's contour on it
  assert.deepEqual(r[20].container.byFile, { outline: 12, filled: 4 });
  assert.deepEqual(r[20].container.onTierByFile, { outline: 8, filled: 4 });
  assert.equal(r[20].container.histogram['2.125'], 4, '2.1 snaps to the sixteenth 2.125 and stays off the tier');
  assert.equal(r[20].container.concepts, 3);
  assert.equal(r[20].container.conceptsOnTierCount, 2);
  assert.equal(r[20].container.conceptsOffTierCount, 1);
  assert.deepEqual(r[20].container.conceptsOffTier, ['offtier']);
  assert.equal(r[16].tier, 1.5);
  assert.equal(r[16].container.onTierByFile.outline, 4);
});

test('gap: five MIN_GAP readings at 24 — two under, three at the floor; the declared one is told apart', () => {
  const g = R.sections.gap[24];
  assert.equal(g.readings.total, 5, 'box bar-to-wall, box-filled cut, tight, tight2, tight3');
  assert.deepEqual(g.readings, { under: 2, binding: 3, near: 0, clear: 0, total: 5 });
  assert.equal(g.atFloor.readings, 3);
  assert.equal(g.atFloor.drawings, 3);
  assert.equal(g.atFloor.tightest, 3);
  assert.deepEqual(g.drawingsBy, { under: 2, binding: 3, near: 0, clear: 0, none: 15 - 5 });
  assert.equal(g.underDeclared, 1, 'tight declares gap: 1.25');
  assert.equal(g.underUndeclared, 1, 'tight3 does not');
  assert.equal(g.underReadingsUndeclared, 1, 'what lint would warn on');
  assert.equal(g.byMeasure.pair.total, 4);
  assert.equal(g.byMeasure['facing-cut'].total, 1);
  // what other floors would warn on: 1.0 is not under 0.99; under 1.24 it is; 1.75 and 2 catch all five
  assert.deepEqual(g.whatIf, { floor1: 0, floor1_25: 1, floor1_75: 5, floor2: 5 });
  // 20: a 1.245 pair (under the floor, but NOT under 1.25 on lint's −0.01 line) and a 2.0 cut that
  // only a cap above lint's 1.75 can see
  const g20 = R.sections.gap[20];
  // the 2.0 cut lands in `clear` (the near band is [1.75, 2.0)); with lint's cap it would not be read at all
  assert.deepEqual(g20.readings, { under: 1, binding: 0, near: 0, clear: 1, total: 2 });
  assert.equal(g20.byMeasure.pair.total, 1);
  assert.equal(g20.byMeasure['facing-cut'].total, 1, 'the 2.0 cut is read: the census raises facingGap\'s cap');
  assert.equal(g20.atFloor.readings, 0);
  assert.deepEqual(g20.whatIf, { floor1: 0, floor1_25: 0, floor1_75: 1, floor2: 1 }, '1.245 is not under 1.24');
  assert.equal(g20.underUndeclared, 1);
  assert.deepEqual(g20.drawingsBy, { under: 1, binding: 0, near: 0, clear: 1, none: 6 });
});

test('gapReadings: the glyph pair is floored by GLYPH_GAP and reads 1.0; the plus crosses and reads nothing', () => {
  const glyph = gapReadings(drawingOf(join(root, 'src/icons/24/glyph.svg')), { cap: 2.5 });
  assert.equal(glyph.length, 1);
  assert.equal(glyph[0].floor, 'glyph');
  assert.ok(Math.abs(glyph[0].gap - 1.0) < 0.01, `dot to stem ${glyph[0].gap}`);
  assert.equal(gapReadings(drawingOf(join(root, 'src/icons/24/plus.svg')), { cap: 2.5 }).length, 0);
  const tight = gapReadings(drawingOf(join(root, 'src/icons/24/tight.svg')), { cap: 2.5 });
  assert.equal(tight[0].declared, 1.25, 'the file\'s own gap: note travels with the reading');
});

test('glyph: one declared file, one reading that needs the carve-out', () => {
  const g = R.sections.glyph[24];
  assert.equal(g.files, 1);
  assert.equal(g.conceptCount, 1);
  assert.equal(g.readings, 1);
  assert.equal(g.between1and1_5, 1);
  assert.equal(g.under1, 0);
});

test('keyline: opt-outs, exact matches, the bound and the mark ceiling', () => {
  const k = R.sections.keyline[24];
  assert.equal(k.drawings, 15);
  assert.deepEqual(k.optOut, { mark: 12, box: 0, anchor: 0 });
  assert.equal(k.held, 3, 'box, box-filled, glyph');
  assert.equal(k.exact.square, 2);
  assert.equal(k.exact.circle, 1);
  assert.equal(k.exact.diagonal, 1, 'diagonal has the circle\'s dimensions');
  assert.equal(k.noMatchLint, 0);
  assert.equal(k.reachesBound, 3, 'the ⌀20 ring and the two -large files');
  assert.equal(k.largeAtBound, 2);
  assert.equal(k.marksAtCeiling, 4, 'plus and plus-filled at 18; plus-large and its twin at the margin edge');
  assert.equal(R.sections.keyline[16].exact.square, 1);
  // 20: box, offtier and cut2 are on the square keyline to 0.01; proud (14.3) only at lint's ±0.5;
  // near's ink stops 0.3 inside the bound and must not count as reaching it
  const k20 = R.sections.keyline[20];
  assert.equal(k20.drawings, 8);
  assert.deepEqual(k20.optOut, { mark: 4, box: 0, anchor: 0 });
  assert.equal(k20.held, 4);
  assert.equal(k20.exact.square, 3);
  assert.equal(k20.lint.square, 4, 'proud is 0.3 wide of the keyline: a lint match, not an exact one');
  assert.equal(k20.noMatchLint, 0);
  assert.equal(k20.reachesBound, 0, 'near.svg stops 0.3 inside the bound');
  assert.equal(k20.marksAtCeiling, 0);
});

test('size: the plus family is one mark family with two sizes', () => {
  const s = R.sections.size[24];
  assert.equal(s.step, 3);
  assert.equal(s.sized, 4);
  assert.equal(s.small, 2);
  assert.equal(s.large, 2);
  assert.equal(s.markFamiliesCount, 1);
  assert.equal(s.containerFamiliesCount, 0);
  assert.deepEqual(s.noDefault, []);
});

test('grid: the 16 box is on the eighth grid with 14 eighth-only values; the chevrons carry the 24 off-grid values', () => {
  const g = R.sections.grid;
  assert.equal(g[16].grid, 0.125);
  assert.equal(g[16].decimals, 3);
  assert.equal(g[16].coordinates, 34);
  assert.equal(g[16].onGrid, 34);
  assert.equal(g[16].onQuarter, 20);
  assert.equal(g[16].eighthOnly, 14);
  assert.equal(g[16].offGrid, 0);
  assert.equal(g[24].grid, 0.25);
  assert.equal(g[24].offGrid, 8, 'four tangent points in each chevron');
  assert.equal(g[24].offGridDrawings, 2);
  assert.equal(g[24].lintPrints.documented, 2, 'both carry a comment, so lint prints "documented exception"');
  assert.equal(g[24].overPrecision, 0);
  // 20: gap1245's 10.745 is over the 2 dp ceiling (counted, not binned); offtier, chev8, near and
  // proud carry off-quarter values, every one in a file with a comment
  assert.equal(g[20].overPrecision, 1);
  assert.equal(g[20].offGridDrawings, 4);
  assert.equal(g[20].lintPrints.documented, 4);
});

test('drawingOf: a line grows by its own weight (lint §4 today); at one weight per file that is the pin\'s §4 box', () => {
  const dir = mkdtempSync(join(tmpdir(), 'parameter-reach-ink-'));
  try {
    mkdirSync(join(dir, '24'));
    const inkOf = (f, src) => { const p = join(dir, '24', f); writeFileSync(p, src); return drawingOf(p).ink; };
    // one weight, as at the pin: each line grown by 1.25 is the union grown once (pin lint.mjs:304-306)
    assert.deepEqual(inkOf('one-filled.svg', svg(24, 2.5, [P('M4 12H20'), P('M12 4V8')])), { x0: 2.75, y0: 2.75, x1: 21.25, y1: 13.25 });
    // a C32 / C33 line at the outline weight keeps its own 1.5: the stem's top stands 0.75 above it, not 1.25
    assert.deepEqual(inkOf('own-filled.svg', svg(24, 2.5, [P('M4 12H20'), '<path stroke-width="1.5" d="M12 4V8"/>'])), { x0: 2.75, y0: 3.25, x1: 21.25, y1: 13.25 });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('reach runs only the sections asked for', () => {
  const one = reach(root, ['size']);
  assert.deepEqual(Object.keys(one.sections), ['size']);
});

// ── identities on the shipped set, when it is there ────────────────────────────────────────

const repo = fileURLToPath(new URL('../../', import.meta.url));
const haveSet = existsSync(join(repo, 'src/icons/24'));

test('shipped set: every file is at the outline weight or line-heavy; every file is a mark, a box, anchored or held', { skip: !haveSet }, () => {
  const S = reach(repo, ['stroke', 'filled', 'keyline']);
  for (const m of [24, 20, 16]) {
    const perMaster = S.sections.keyline[m].drawings;
    assert.equal(S.sections.stroke[m].files + S.sections.filled[m].lineHeavy, perMaster, `${m}: weight split`);
    assert.equal(S.sections.filled[m].lineHeavy + S.sections.filled[m].shapeFilled + S.sections.filled[m].outline, perMaster, `${m}: style split`);
    const k = S.sections.keyline[m];
    assert.equal(k.optOut.mark + k.optOut.box + k.optOut.anchor + k.held, perMaster, `${m}: keyline regimes`);
    assert.equal(k.noMatchLint, 0, `${m}: lint reports no "no keyline match" at the pin (enforcement-gap.md §5 row 1)`);
  }
});
