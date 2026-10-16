// Tests for tools/audit/pixelgrid.mjs.
//
// The anchors here are cases where the right answer is forced by arithmetic, not
// by agreement with a previous measurement: a stroke of width 1 centred on x.5
// has its edges on whole pixels and must score 0; the same stroke centred on a
// whole number has them on pixel centres and must score 1. Between those two the
// scale has no freedom left, which is the only way a summary number earns its
// keep.
//
// Three figures already on record are reproduced here as tests rather than
// quoted: C7's 62.5%-against-75% peak, docs/08 §3.2's `minus` bar table, and
// docs/08 §3.4's "100% clear at a 0.88 gap". The third does not reproduce, and
// the test records what the geometry actually does.

import test from 'node:test';
import assert from 'node:assert/strict';
import { iconFromText } from './raster.mjs';
import { edgeLanding, blurScore, peakCoverage, rowProfile, census, probe } from './pixelgrid.mjs';

const svg = (canvas, stroke, ds) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ds.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
const icon = (canvas, stroke, ds) => iconFromText(svg(canvas, stroke, ds), 'probe');
const near = (got, want, tol, what) =>
  assert.ok(Math.abs(got - want) <= tol, `${what}: got ${got}, want ${want} +/- ${tol}`);

// ── peakCoverage: the figure C7 reasons about ─────────────────────────────

test('C7: a line on the canvas centre axis peaks at 62.5% at stroke 1.25, 75% at 1.5', () => {
  near(peakCoverage('M8 0V16', 16, { weight: 1.25, canvas: 16, rate: 256 }).peak, 0.625, 1e-3, 'peak at 1.25');
  near(peakCoverage('M8 0V16', 16, { weight: 1.5, canvas: 16, rate: 256 }).peak, 0.75, 1e-3, 'peak at 1.5');
  // and neither ever fills a pixel, which is the point of the complaint
  assert.equal(peakCoverage('M8 0V16', 16, { weight: 1.25, canvas: 16, rate: 128 }).fullyInked, 0);
  assert.equal(peakCoverage('M8 0V16', 16, { weight: 1.5, canvas: 16, rate: 128 }).fullyInked, 0);
});

test("docs/08 3.2: the `minus` bar's peak and fully-inked pixels at y 12 / 12.25 / 12.5", () => {
  const at = (y) => peakCoverage(`M3.75 ${y}H20.25`, 24, { weight: 1.5, canvas: 24, rate: 256 });
  near(at(12).peak, 0.75, 1e-3, 'y=12, the centre axis, as shipped');
  assert.equal(at(12).fullyInked, 0, 'y=12 fills no pixel at all — the doc\'s "0"');
  near(at(12.25).peak, 1, 1e-6, 'y=12.25 reaches a full pixel');
  near(at(12.5).peak, 1, 1e-6, 'y=12.5 reaches a full pixel');
  // the doc's table is one column's profile, so its "1" is one full pixel per
  // column; across the 16-unit bar that is one full pixel in each inked column
  assert.ok(at(12.25).fullyInked >= 16, `y=12.25 should fill a row of pixels, got ${at(12.25).fullyInked}`);
});

test('moving a line half a pixel is the whole difference between crisp and not', () => {
  const sharp = peakCoverage('M8.5 0V16', 16, { weight: 1.25, canvas: 16, rate: 256 });
  const blurred = peakCoverage('M8 0V16', 16, { weight: 1.25, canvas: 16, rate: 256 });
  near(sharp.peak, 1, 1e-6, 'edges at 7.875 and 9.125 put a whole pixel inside the ink');
  near(blurred.peak, 0.625, 1e-3, 'edges at 7.375 and 8.625 do not');
});

test('peakCoverage respects the canvas, so a 24 drawing shown at 16px is a different question', () => {
  const own = peakCoverage('M12 0V24', 24, { weight: 1.5, canvas: 24, px: 24, rate: 128 });
  assert.equal(own.devicePxPerUnit, 1);
  const shown = peakCoverage('M12 0V24', 16, { weight: 1.5, canvas: 24, rate: 128 });
  near(shown.devicePxPerUnit, 16 / 24, 1e-9, 'a 24 canvas at 16px is 2/3 of a device pixel per unit');
  near(shown.peak, 0.5, 1e-3, 'at 16px that 1.5 stroke is 1.0 device px, split evenly by the centre line');
});

test('peakCoverage requires px — a coverage figure without a render size is meaningless', () => {
  assert.throws(() => peakCoverage('M8 0V16', undefined, { weight: 1.25 }), /px is required/);
  assert.throws(() => edgeLanding('src/icons/16/help-circle.svg'), /px is required/);
  assert.throws(() => blurScore('src/icons/16/help-circle.svg'), /px is required/);
});

// ── edgeLanding ───────────────────────────────────────────────────────────

test('a line on a pixel boundary vs one on a pixel centre: off = 0 against off = 0.5', () => {
  const onBoundary = edgeLanding(icon(16, 1, ['M8.5 2V14']), 16);
  assert.equal(onBoundary.edges.length, 2, 'a vertical run offsets to two vertical ink edges');
  for (const e of onBoundary.edges) {
    assert.equal(e.kind, 'run');
    assert.equal(e.axis, 'x');
    near(e.off, 0, 1e-9, `edge at ${e.coord} should land exactly on a pixel line`);
  }
  assert.deepEqual(onBoundary.edges.map((e) => e.coord).sort(), [8, 9]);

  const onCentre = edgeLanding(icon(16, 1, ['M8 2V14']), 16);
  for (const e of onCentre.edges) near(e.off, 0.5, 1e-9, `edge at ${e.coord} should land on a pixel centre`);
  assert.deepEqual(onCentre.edges.map((e) => e.coord).sort(), [7.5, 8.5]);
});

test("C7's construction: a 16 centreline on x.375 puts its outer ink edge on a whole pixel", () => {
  // calendar's body: centreline 2.625, stroke 1.25 -> outer edge 2.0, inner 3.25
  const e = edgeLanding(icon(16, 1.25, ['M2.625 4V12']), 16);
  const coords = e.edges.map((x) => x.coord).sort((a, b) => a - b);
  assert.deepEqual(coords, [2, 3.25]);
  near(e.edges.find((x) => x.coord === 2).off, 0, 1e-9, 'the outer edge lands on pixel line 2');
  near(e.edges.find((x) => x.coord === 3.25).off, 0.25, 1e-9, 'the inner edge lands a quarter pixel off');
  assert.equal(e.onPixel, 1);
});

test('a short run is not an ink edge; the threshold is a parameter', () => {
  assert.equal(edgeLanding(icon(16, 1.25, ['M8 8H8.3']), 16).edges.length, 0);
  assert.equal(edgeLanding(icon(16, 1.25, ['M8 8H8.3']), 16, { minRun: 0.2 }).edges.length, 2);
});

test('a diagonal has no ink edge to land anywhere', () => {
  const e = edgeLanding(icon(16, 1.25, ['M4 4L12 12']), 16);
  assert.equal(e.edges.length, 0, 'a 45-degree edge cannot sit on a pixel line along its length');
  const b = blurScore(icon(16, 1.25, ['M4 4L12 12']), 16, { rate: 32 });
  assert.equal(b.blur, null, 'and the score must decline to answer rather than invent one');
  near(b.diagonalShare, 1, 1e-9, 'while reporting that it had no opinion about 100% of the drawing');
});

test("an arc's axis-aligned extremes are ink edges, inside and out", () => {
  // help's ring: r 6.375 at (8,8), stroke 1.25 -> outer 1 and 15, inner 2.25 and 13.75
  const e = edgeLanding(icon(16, 1.25, ['M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z']), 16);
  const xs = [...new Set(e.edges.filter((x) => x.axis === 'x').map((x) => Math.round(x.coord * 1000) / 1000))].sort((a, b) => a - b);
  assert.deepEqual(xs, [1, 2.25, 13.75, 15]);
  assert.equal(e.runs, 0, 'a circle has no straight run');
  const ys = [...new Set(e.edges.filter((x) => x.axis === 'y').map((x) => Math.round(x.coord * 1000) / 1000))].sort((a, b) => a - b);
  assert.deepEqual(ys, [1, 2.25, 13.75, 15], 'and the same four on the other axis');
  assert.equal(e.distinct, 8, 'eight distinct ink edges: outer and inner, on all four sides');
  // the set draws a circle as two 180-degree arcs meeting at the left and right
  // extremes, so those two are each recorded twice at half length
  assert.equal(e.extremes, 12, 'twelve records: 4 shared end-extremes x2, plus top and bottom');
  assert.equal(e.edges.filter((x) => x.atEnd).length, 8, 'the shared ones must be marked and half-weighted');
  for (const x of e.edges.filter((v) => v.coord === 1 || v.coord === 15)) near(x.off, 0, 1e-9, 'outer edges on whole pixels');
  for (const x of e.edges.filter((v) => v.coord === 2.25 || v.coord === 13.75)) near(x.off, 0.25, 1e-9, 'inner edges a quarter off');
});

test("a stroke that has closed over its centre has no inner edge to report", () => {
  // r 0.375 with stroke 1.25 is a solid disc: only the outer edge exists
  const e = edgeLanding(icon(16, 1.25, ['M7.625 11A0.375 0.375 0 1 0 8.375 11A0.375 0.375 0 1 0 7.625 11Z']), 16);
  assert.ok(e.edges.every((x) => x.side === 1), 'every edge must be an outer one');
});

test('a filled area path has no half-stroke: its boundary IS the ink edge', () => {
  const e = edgeLanding(iconFromText(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25"><path fill="currentColor" fill-rule="evenodd" stroke="none" d="M2 2H14V14H2Z"/></svg>',
  ), 16);
  assert.deepEqual([...new Set(e.edges.map((x) => x.coord))].sort((a, b) => a - b), [2, 14]);
  for (const x of e.edges) near(x.off, 0, 1e-9, 'a fill on whole units is crisp on every side');
});

// ── blurScore: the scale is pinned at both ends ───────────────────────────

test('blurScore is 0 when every edge is on a pixel line and 1 when every edge is on a centre', () => {
  near(blurScore(icon(16, 1, ['M8.5 2V14']), 16, { rate: 32 }).blur, 0, 1e-9, 'the crisp end of the scale');
  near(blurScore(icon(16, 1, ['M8 2V14']), 16, { rate: 32 }).blur, 1, 1e-9, 'the blurred end of the scale');
});

test('blurScore is ink-length weighted, not edge-count weighted', () => {
  // one long crisp run (edges on 8 and 9) and one short blurred one (edges on
  // 2.5 and 3.5) must not come out at 0.5
  const b = blurScore(icon(16, 1, ['M8.5 1V15', 'M3 3H4']), 16, { rate: 16 }).blur;
  assert.ok(b > 0 && b < 0.2, `a 14-unit crisp run must dominate a 1-unit blurred one; got ${b}`);
});

test('blurScore reports the render size it was taken at, and changes with it', () => {
  const d = icon(16, 1.25, ['M2.625 2V14']);         // edges at 2.0 and 3.25
  const at16 = blurScore(d, 16, { rate: 32 });
  const at32 = blurScore(d, 32, { rate: 32 });
  assert.equal(at16.px, 16);
  assert.equal(at32.px, 32);
  near(at16.blur, 0.25, 1e-9, 'at 16px: one edge on 0, one 0.25 off -> mean 2*0.125');
  // doubling the render size does NOT simply make a drawing crisp: 2.0 lands on
  // device pixel 4 and stays crisp, but 3.25 lands on 6.5 — a pixel centre, the
  // worst place there is. This is C7's "1.25 is 2.5 device pixels on retina and
  // cannot sit clean on both edges", measured.
  near(at32.blur, 0.5, 1e-9, 'at 32px the outer edge is crisp and the inner one is on a pixel centre');
});

test('blurScore keeps halfToneShare separate, and says why it is not the score', () => {
  const b = blurScore('src/icons/16/help-circle.svg', 16, { rate: 64 });
  near(b.halfToneShare, 1, 1e-6, 'every inked pixel of a 1.25 ring is partial — this cannot rank anything');
  assert.ok(b.blur < 0.4, 'while the landing measure separates it from a blurry icon');
  assert.ok(typeof b.definition === 'string' && b.definition.includes('whole-pixel boundary'));
  assert.ok(b.straightOnly === null, 'help has no straight runs, so the runs-only variant must say so');
});

test('plus pays for sitting on the centre axis; calendar does not', () => {
  // the two ends of C7's own accepted cost, measured
  const plus = blurScore('src/icons/16/plus.svg', 16, { rate: 32 });
  const cal = blurScore('src/icons/16/calendar.svg', 16, { rate: 32 });
  near(plus.blur, 0.75, 1e-9, 'plus: both runs centred on 8, edges 0.375 off');
  assert.ok(cal.blur < 0.3, `calendar's outer edges are on their pixels; got ${cal.blur}`);
  assert.ok(plus.blur > cal.blur * 2, 'the measure must separate them, not average them away');
});

// ── rowProfile, and the 0.88 gap ──────────────────────────────────────────

test('a clear pixel row needs a whole aligned pixel of air: 1.0 is the floor, not 1.5', () => {
  // Two bars, 1.25 wide, with their facing ink edges on whole pixels, so the
  // clear band is exactly `gap` and exactly pixel-aligned.
  const bars = (gap) => icon(16, 1.25, [`M2 ${6 - 0.625}H14`, `M2 ${6 + gap + 0.625}H14`]);
  const rowAt = (gap, row) => rowProfile(bars(gap), 16, { rate: 256, window: [3, 13] }).rows[row];
  assert.equal(rowAt(1.0, 6).clear, true, 'a 1.0 gap holds a 100% clear pixel row');
  assert.equal(rowAt(1.5, 6).clear, true, 'so does 1.5');
  assert.equal(rowAt(0.88, 6).clear, false, 'a 0.88 gap cannot: there is no whole pixel of air to hold');
  assert.ok(rowAt(0.88, 6).max > 0, 'and what it leaves is ink, however little');
});

test("docs/08 3.4's 0.88 gap: clear in the render, 3% inked in the drawing", () => {
  // THE CLAIM. docs/08 §3.4: "the separating pixel row reads 100% clear
  // background at a 0.88 gap just as at 1.5 — the extra 0.6 bought no
  // separation at all." It is the linchpin of the gap question.
  //
  // WHAT IS TRUE. In a browser it reproduces: that row renders 0% ink. But
  // `lab/refs/gap.html` contains no measuring code of any kind — it only draws —
  // so the reading was taken by eye off a 12x magnified bitmap, and the bitmap
  // is honest only to the renderer's own precision.
  //
  // WHAT THE GEOMETRY SAYS. The band is 0.88 tall and a pixel row is 1.0, so no
  // whole row can fit inside it: the tail's round cap leaves about 3% ink in two
  // pixels, which Chromium's anti-aliasing rounds away to nothing. 1.08 clears a
  // whole aligned pixel and really is as clear as 1.5.
  //
  // The docs half-know this. docs/07 C19's own evidence says the 0.88 test
  // "passed on phase, the round cap's last sliver covering almost nothing", and
  // docs/08:136 says "passed on phase, not principle" — both of which this
  // measures. §3.4's flat "100% clear" is the statement that overreaches, and
  // the floor it implies is one whole ALIGNED pixel, which is exactly the
  // rationale tools/masters.mjs already gives for GLYPH_GAP = 1.
  //
  // The three drawings below are gap.html's own three candidates.
  const RING = 'M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z';
  const DOT = 'M7.75 11A0.25 0.25 0 1 0 8.25 11A0.25 0.25 0 1 0 7.75 11Z';
  const row9 = (bowl) => rowProfile(icon(16, 1.5, [RING, bowl, DOT]), 16, { rate: 256, window: [6, 10] }).rows[9];

  const foot = row9('M6.64 5.62A1.5 1.5 0 1 1 8 7.75');                               // gap 1.50
  const tuck = row9('M6.55 5.86A1.5 1.5 0 1 1 8.5 7.66A0.75 0.75 0 0 0 8 8.37');      // gap 0.88
  const dee = row9('M6.75 6A1.25 1.25 0 1 1 8.63 7.08A1.25 1.25 0 0 0 8 8.17');       // gap 1.08

  assert.equal(foot.clear, true, 'at 1.50 the separating row is 100% clear on the geometry too');
  assert.equal(dee.clear, true, 'and at 1.08 it still is — 1.08 clears a whole aligned pixel');
  assert.equal(tuck.clear, false, 'at 0.88 it is not: 0.88 cannot hold a 1.0 pixel row');
  near(tuck.max, 0.03, 0.02, 'the cap leaves about 3% ink — below what a renderer resolves');
  assert.ok(tuck.max > 0 && tuck.max < 0.1, 'small enough to vanish in a render, large enough to exist');
});

test('rowProfile without a window is honest but useless for a gap', () => {
  const p = rowProfile('src/icons/16/help-circle.svg', 16, { rate: 32 });
  assert.deepEqual(p.window, [0, 16]);
  assert.ok(p.rows.filter((r) => r.hasClearPixel).length > 10, 'almost every row has a clear pixel — the canvas has corners');
  assert.ok(typeof p.note === 'string');
});

// ── census ────────────────────────────────────────────────────────────────

test('census ranks blurriest first, names the reason, and flags the undecidable', () => {
  const c = census([
    'src/icons/16/plus.svg',
    'src/icons/16/calendar.svg',
    'src/icons/16/help-circle.svg',
    'src/icons/16/chevron-down.svg',
  ], 16, { rate: 16 });
  assert.equal(c.px, 16);
  assert.equal(c.rows[0].name, 'plus', 'plus must come out blurriest of these four');
  assert.ok(c.rows[0].why.includes('off'), 'every row must name the edge that cost it');
  const chev = c.rows.find((r) => r.name === 'chevron-down');
  assert.ok(chev.diagonalShare > 0.8, 'a chevron must declare itself mostly diagonal so its score can be discounted');
  assert.ok(c.blurriest.length && c.crispest.length);
  assert.ok(c.stats.max >= c.stats.median && c.stats.median >= c.stats.min);
});

test('census survives a bad file when asked, and refuses to default px', () => {
  const c = census(['src/icons/16/help-circle.svg', 'src/icons/16/nope.svg'], 16, { rate: 8, onError: 'collect' });
  assert.equal(c.failed.length, 1);
  assert.throws(() => census(['src/icons/16/help-circle.svg'], undefined, {}), /px is required/);
});

test('probe builds a region from paths that are not a shipped file', () => {
  const p = probe([{ d: 'M8.5 2V14', kind: 'stroke', weight: 1 }], 16, { name: 'test-line' });
  near(blurScore(p, 16, { rate: 16 }).blur, 0, 1e-9, 'a probe must measure like a file');
  assert.equal(edgeLanding(p, 16).name, 'test-line');
});
