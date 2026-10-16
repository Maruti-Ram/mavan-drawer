// Tests for tools/audit/mass.mjs and the rasteriser under it.
//
// Every case here has an answer that is known in closed form and can be checked
// on paper — a square, a stadium, an annulus — because doc 08 §10.4's lesson on
// this project was "do not trust a hand-rolled measure: the bowl-mouth measure
// was written twice and wrong twice, and both times the numbers looked
// plausible". A plausible number is exactly what this file exists to refuse.

import test from 'node:test';
import assert from 'node:assert/strict';
import { samplePath } from '../geometry.mjs';
import {
  iconFromText, readIcon, region, regionOf, strokeRegion, areaRegion,
  inkArea as regionInkArea, rasterise, inkBox, convergence, flatten, assertFlattenable,
} from './raster.mjs';
import { inkArea, inkPixels, density, census, BANDS } from './mass.mjs';

const PI = Math.PI;
const svg = (canvas, stroke, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const near = (got, want, tol, what) =>
  assert.ok(Math.abs(got - want) <= tol, `${what}: got ${got}, want ${want} +/- ${tol} (off by ${(got - want).toExponential(2)})`);

// ── the exact synthetic cases the instrument has to get right ──────────────

test('a full-canvas square fill: coverage 1.0 in every pixel, area = canvas^2', () => {
  const reg = areaRegion(['M0 0H16V16H0Z'], { label: 'square' });
  const { area } = regionInkArea(reg, { rate: 8 });
  near(area, 256, 1e-9, 'area of a 16x16 fill');

  const { cov } = rasterise({ ...reg, canvas: 16 }, { px: 16, rate: 8 });
  assert.equal(cov.length, 256);
  for (let k = 0; k < cov.length; k++) assert.equal(cov[k], 1, `pixel ${k} should be fully covered`);

  // and the cell classifier must be carrying it, not brute force
  const { cells } = regionInkArea(reg, { rate: 8 });
  assert.ok(cells.uniform > 0, 'a solid fill should classify cells as uniform, not sample them');
});

test('a horizontal line: area = length * width + two half-discs (the closed form)', () => {
  // centreline runs x 4 -> 12 at y 8, so length 8; round caps add one full disc
  for (const w of [1, 1.25, 1.5, 2, 2.5]) {
    const exact = 8 * w + PI * (w / 2) ** 2;
    const reg = strokeRegion(['M4 8H12'], w, { label: `line w=${w}` });
    const { area } = regionInkArea(reg, { rate: 128 });
    near(area, exact, 0.01, `stadium area at stroke ${w}`);
  }
});

test('a vertical line gives the same answer as the horizontal one (no axis bias)', () => {
  const h = regionInkArea(strokeRegion(['M4 8H12'], 1.25), { rate: 128 }).area;
  const v = regionInkArea(strokeRegion(['M8 4V12'], 1.25), { rate: 128 }).area;
  near(h, v, 0.005, 'horizontal vs vertical stadium');
});

test('a closed circle: area = the annulus, exactly, with no caps', () => {
  // r 6.375 at (8,8), stroke 1.25 -> outer 7, inner 5.75
  const d = 'M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z';
  const exact = PI * (7 ** 2 - 5.75 ** 2);
  const { area } = regionInkArea(strokeRegion([d], 1.25), { rate: 128 });
  near(area, exact, 0.02, 'annulus area');
});

test('a dot whose inner radius would go negative is a solid disc, not an annulus', () => {
  // r 0.375, stroke 1.25: every point within 0.625 of the circle covers the centre
  const d = 'M7.625 11A0.375 0.375 0 1 0 8.375 11A0.375 0.375 0 1 0 7.625 11Z';
  const { area } = regionInkArea(strokeRegion([d], 1.25), { rate: 128 });
  near(area, PI * 1 ** 2, 0.01, 'solid dot area');
});

test('an arc stroke: area = sweep * r * w plus one disc of caps', () => {
  // help's bowl at 16: r 1.875, large-arc, sweep
  const d = 'M6.3 5.71A1.875 1.875 0 1 1 8 8.375';
  const chord = Math.hypot(8 - 6.3, 8.375 - 5.71);
  const sweep = 2 * PI - 2 * Math.asin(chord / 2 / 1.875);
  const exact = sweep * 1.875 * 1.25 + PI * 0.625 ** 2;
  const { area } = regionInkArea(strokeRegion([d], 1.25), { rate: 128 });
  near(area, exact, 0.01, 'annular-sector area plus caps');
});

test('an even-odd hole is subtracted, not painted', () => {
  const reg = areaRegion(['M2 2H14V14H2ZM6 6H10V10H6Z'], { label: 'ring' });
  const { area } = regionInkArea(reg, { rate: 32 });
  near(area, 12 * 12 - 4 * 4, 1e-9, 'square with a square hole');
});

test('overlapping strokes are a union, never counted twice', () => {
  const w = 2;
  const one = 8 * w + PI * (w / 2) ** 2;
  const reg = strokeRegion(['M4 8H12', 'M8 4V12'], w, { label: 'cross' });
  const { area } = regionInkArea(reg, { rate: 128 });
  assert.ok(area < 2 * one, `a cross must be less than two bars (got ${area}, two bars = ${2 * one})`);
  near(area, 2 * one - w * w, 0.02, 'cross = two stadiums minus the shared square');
});

// ── the rate is a parameter, and the answer stops moving ───────────────────

test('convergence: the area stops moving as the rate rises, and lands on the closed form', () => {
  const w = 1.25;
  const exact = 8 * w + PI * (w / 2) ** 2;
  const reg = strokeRegion(['M4 8H12'], w);
  const rows = convergence((rate) => regionInkArea(reg, { rate }).area, [4, 8, 16, 32, 64, 128, 256]);
  const err = rows.map((r) => Math.abs(r.value - exact));
  assert.ok(err.at(-1) < 0.005, `at rate 256 the error should be under 0.005, got ${err.at(-1)}`);
  assert.ok(err.at(-1) < err[0], `the error should fall with the rate (rate 4: ${err[0]}, rate 256: ${err.at(-1)})`);
  for (const r of rows) assert.equal(r.rate > 0, true);
  // and the rate must be reported back, so no figure is quotable without it
  assert.equal(regionInkArea(reg, { rate: 64 }).rate, 64);
});

test('ink area does not depend on the tile it is rendered into', () => {
  // The invariant that caught the one real bug in this rasteriser: `classify`
  // was reading only the grid cell under a box's centre, which is unsound as
  // soon as a pixel is bigger than a cell — a 24 master shown at 16px gives a
  // 1.5-unit pixel — so ink in the next cell was being called empty.
  for (const [f, canvas] of [['src/icons/24/help-circle.svg', 24], ['src/icons/20/help-circle.svg', 20],
    ['src/icons/16/help-circle.svg', 16], ['src/icons/24/help-circle-filled.svg', 24]]) {
    const a = inkArea(f, { rate: 64 }).area;
    for (const px of [16, 24, 32, 48]) {
      const cov = inkPixels(f, px, { rate: 64 }).coverage;
      const want = a * (px / canvas) ** 2;
      assert.ok(Math.abs(cov - want) / want < 0.002,
        `${f} at ${px}px: coverage ${cov} against scaled area ${want} (${((cov / want - 1) * 100).toFixed(3)}%)`);
    }
  }
});

test('every result carries its rate and its flattening tolerance', () => {
  const f = 'src/icons/16/help-circle.svg';
  assert.equal(inkArea(f, { rate: 32 }).rate, 32);
  assert.equal(inkPixels(f, 16, { rate: 32 }).rate, 32);
  assert.equal(density(f, { rate: 32 }).rate, 32);
  assert.ok(inkArea(f, { rate: 32 }).flatten > 0);
});

// ── the arc maths agrees with the project's own sampler ────────────────────

test('flatten agrees with geometry.mjs on where an arc goes', () => {
  for (const d of [
    'M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z',
    'M6.3 5.71A1.875 1.875 0 1 1 8 8.375',
    'M2 9.75A3.25 3.25 0 0 1 5.25 6.5H5.9',
  ]) {
    const mine = flatten(d).flatMap((s) => s.pts);
    const theirs = samplePath(d, { arcStep: 0.25 });
    // Every point geometry.mjs puts on the curve must lie ON my polyline — on a
    // segment of it, not near a vertex of it. (Comparing vertex to vertex only
    // measures whose sampling is denser, which is not the question.)
    const toSeg = (x, y, ax, ay, bx, by) => {
      const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy;
      const t = L2 ? Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / L2)) : 0;
      return Math.hypot(x - (ax + t * vx), y - (ay + t * vy));
    };
    for (const [x, y] of theirs) {
      let best = Infinity;
      for (let i = 0; i + 1 < mine.length; i++) {
        best = Math.min(best, toSeg(x, y, mine[i][0], mine[i][1], mine[i + 1][0], mine[i + 1][1]));
      }
      // the flattening tolerance is 1e-4, so allow it plus geometry.mjs's own
      // chordal error at arcStep 0.25 deg on the largest radius in the set
      assert.ok(best < 2e-3, `geometry.mjs point (${x},${y}) is ${best} off my flattening of ${d}`);
    }
  }
});

test('a Bezier is refused, not approximated', () => {
  assert.throws(() => assertFlattenable('M0 0C1 1 2 2 3 3', 'probe'), /Bezier/);
  assert.throws(() => flatten('M0 0Q1 1 2 2'), /Bezier/);
});

// ── parsing is strict, because a silent misparse is the dangerous failure ──

test('reading an SVG is strict about anything the set does not actually contain', () => {
  assert.throws(() => iconFromText('<p>no svg</p>'), /no <svg> root/);
  assert.throws(() => iconFromText(svg(16, 1.25, '<rect x="0" y="0" width="4" height="4"/>')), /unexpected element/);
  assert.throws(() => iconFromText('<svg viewBox="0 0 16 20"></svg>'), /not square|no "0 0 N N"/);
  assert.throws(
    () => iconFromText(svg(16, 1.25, '<path fill="currentColor" stroke="none" d="M0 0H4V4H0Z"/>')),
    /evenodd only/,
  );
});

test('a filled path that also strokes is counted as both', () => {
  const icon = iconFromText(svg(16, 1.25, '<path fill="currentColor" fill-rule="evenodd" d="M2 2H14V14H2Z"/>'));
  assert.deepEqual(icon.paths.map((p) => p.kind), ['area', 'stroke']);
  assert.equal(icon.paths[1].weight, 1.25);
});

// ── the shipped API ────────────────────────────────────────────────────────

test('inkPixels bands the tile, and states the threshold for every count', () => {
  const p = inkPixels('src/icons/16/help-circle.svg', 16, { rate: 64 });
  assert.equal(p.tile, 256);
  assert.equal(p.full + p.partial + p.clear, 256);
  assert.equal(p.px16Solid + p.px16HalfTone, 256);
  near(p.coverage, 64.4638, 0.05, 'help 16 coverage at 16x16');
  for (const k of ['full', 'partial', 'solidOver85', 'px16HalfTone', 'px16Solid']) {
    assert.ok(typeof p.thresholds[k] === 'string' && p.thresholds[k].length > 10, `${k} must state its threshold`);
  }
  assert.ok(BANDS.solid === 0.85, 'the 0.85 band must stay the one lab/refs/stroke16.html used');
});

test('a line on a pixel boundary fully inks pixels; the same line on a pixel centre never does', () => {
  // width 1, so edges land exactly on whole pixels or exactly on pixel centres
  const onBoundary = density({ ...iconFromText(svg(16, 1, '<path d="M8.5 2V14"/>')), canvas: 16 }, { rate: 64 });
  const onCentre = density({ ...iconFromText(svg(16, 1, '<path d="M8 2V14"/>')), canvas: 16 }, { rate: 64 });
  near(onBoundary.area, onCentre.area, 0.01, 'the two lines carry the same ink');

  const b = inkPixels(iconFromText(svg(16, 1, '<path d="M8.5 2V14"/>')), 16, { rate: 64 });
  const c = inkPixels(iconFromText(svg(16, 1, '<path d="M8 2V14"/>')), 16, { rate: 64 });
  assert.ok(b.full > 0, `a line whose edges sit on whole pixels must fill some (got ${b.full})`);
  assert.equal(c.full, 0, `a line centred on a pixel centre must fill none (got ${c.full})`);
  near(b.peak, 1, 1e-6, 'peak on the boundary case');
  near(c.peak, 0.5, 1e-6, 'peak on the centre case');
});

test('density: both ratios, and a solid canvas scores 1 on each', () => {
  const d = density(iconFromText(svg(16, 1.25, '<path fill="currentColor" fill-rule="evenodd" stroke="none" d="M0 0H16V16H0Z"/>')), { rate: 16 });
  near(d.ofCanvas, 1, 1e-9, 'ofCanvas of a full fill');
  near(d.ofBbox, 1, 0.02, 'ofBbox of a full fill');

  const thin = density('src/icons/16/minus.svg', { rate: 32 });
  assert.ok(thin.ofBbox > thin.ofCanvas, 'a bar is dense in its own box and light in the canvas — the two must not agree');
});

test('density of a filled icon beats its outline twin', () => {
  const o = density('src/icons/16/help-circle.svg', { rate: 32 });
  const f = density('src/icons/16/help-circle-filled.svg', { rate: 32 });
  assert.ok(f.area > o.area * 1.5, `filled help should carry far more ink (outline ${o.area}, filled ${f.area})`);
});

test('inkBox finds where ink stops, not where the centreline does', () => {
  const reg = regionOf(readIcon('src/icons/16/help-circle.svg'));
  const b = inkBox(reg, { rate: 64 });
  near(b.x0, 1, 0.02, 'ink starts at 1 (centreline 1.625 minus half of 1.25)');
  near(b.x1, 15, 0.02, 'ink stops at 15');
  near(b.w, 14, 0.04, 'ink box is 14 wide');
});

test('census ranks, reports its rate, and names both ends', () => {
  const files = ['src/icons/16/minus.svg', 'src/icons/16/help-circle.svg', 'src/icons/16/help-circle-filled.svg'];
  const c = census(files, { rate: 16 });
  assert.equal(c.n, 3);
  assert.equal(c.rate, 16);
  assert.equal(c.rows[0].name, 'minus', 'minus must be the lightest of these three');
  assert.equal(c.rows.at(-1).name, 'help-circle-filled', 'the filled disc must be the heaviest');
  assert.ok(c.stats.spread > 1, 'spread is max/min and must exceed 1');
  assert.ok(c.lightest.length && c.heaviest.length);
});

test('census survives a bad file when asked to, and says which', () => {
  const c = census(['src/icons/16/help-circle.svg', 'src/icons/16/does-not-exist.svg'], { rate: 8, onError: 'collect' });
  assert.equal(c.n, 1);
  assert.equal(c.failed.length, 1);
});

// ── the figure the whole 16 master was changed on ──────────────────────────

// THE 60.9 / 71.2 / 48.4 FIGURES, AND WHAT THEY ACTUALLY MEASURE.
//
// All three are on record (docs/07 C7, docs/08 §3.1) and all three reproduce
// exactly in a browser: driving `lab/refs/stroke16-proof.html`'s own `raster()`
// in Chromium 152 returns 60.93, 71.20 and 48.44. They were transcribed
// correctly and the sheet is doing what it says.
//
// They are not, however, the ink in the drawing. They are what CHROMIUM'S
// 16x16 rasterisation of it contains, and at one device pixel per unit that is
// about 5% under the geometry — the loss sits in the curves, where Skia's
// flattening tolerance is set in device space (`help`'s r=0.25 dot, stroke 1.5,
// comes out as four 50% pixels, 2.0 px of ink, against the exact disc's 3.14).
// It is also not a stable quantity: the same sheet returns 71.85 for the same
// drawing on a software 2D context, and 74.35 when rendered at 32x32 and halved.
// The repo records neither the browser nor the version beside the figures.
//
// This instrument measures the GEOMETRY, which is the thing that can be checked
// on paper and does not move when Chrome ships a release. Where a figure here
// disagrees with one of those, both are right about different questions.
test('help at 16 carries the ink its geometry says it does: 64.46', () => {
  // Closed form, checkable on paper. The three paths do not overlap:
  //   ring   annulus r 6.375 +/- 0.625           -> pi(7^2 - 5.75^2)
  //   dot    r 0.375, stroke closes it           -> pi * 1^2
  //   bowl   245 deg of r 1.875 + two half caps  -> sweep*r*w + pi*0.625^2
  const ring = PI * (7 ** 2 - 5.75 ** 2);
  const dot = PI * 1 ** 2;
  const chord = Math.hypot(8 - 6.3, 8.375 - 5.71);
  const bowl = (2 * PI - 2 * Math.asin(chord / 2 / 1.875)) * 1.875 * 1.25 + PI * 0.625 ** 2;
  const exact = ring + dot + bowl;
  near(exact, 64.4638, 0.001, 'the closed form itself');

  const measured = inkArea('src/icons/16/help-circle.svg', { rate: 128 }).area;
  near(measured, exact, 0.02, 'help 16 ink area against the closed form');

  // The 60.9 on record is Chromium's 16x16 render of this same drawing, 5.5%
  // under. The instrument is not tuned to agree with it; see the note above.
  assert.ok(measured - 60.9 > 3, `the drawing carries ${measured.toFixed(2)}; the browser renders 60.9 of it`);
});

test('the pre-C7 help at 16 (stroke 1.5) carries 75.03; the browser renders 71.2 of it', () => {
  const ds = [
    'M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z',
    'M6.41 5.76A1.75 1.75 0 1 1 8 8.25',
    'M7.75 11A0.25 0.25 0 1 0 8.25 11A0.25 0.25 0 1 0 7.75 11Z',
  ];
  const ring = PI * (7 ** 2 - 5.5 ** 2);
  const dot = PI * 1 ** 2;
  const chord = Math.hypot(8 - 6.41, 8.25 - 5.76);
  const bowl = (2 * PI - 2 * Math.asin(chord / 2 / 1.75)) * 1.75 * 1.5 + PI * 0.75 ** 2;
  const exact = ring + dot + bowl;
  near(exact, 75.03, 0.01, 'the closed form for the 1.5-era drawing');

  const measured = regionInkArea(strokeRegion(ds, 1.5), { rate: 128 }).area;
  near(measured, exact, 0.03, '1.5-era help 16 ink area');

  // The ratio the C7 decision turned on survives: the fall is real, 14.1% here
  // against the 14.5% on record. It is the two absolute figures that are low.
  const now = regionInkArea(strokeRegion([
    'M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z',
    'M6.3 5.71A1.875 1.875 0 1 1 8 8.375',
    'M7.625 11A0.375 0.375 0 1 0 8.375 11A0.375 0.375 0 1 0 7.625 11Z',
  ], 1.25), { rate: 128 }).area;
  const fall = 1 - now / measured;
  assert.ok(fall > 0.12 && fall < 0.15, `C7's "ink falls 12-15%" must still hold; got ${(fall * 100).toFixed(1)}%`);
});

test('half-tone pixels across stroke weight, on geometry (docs/08 3.1 records 79 / 80 / 80)', () => {
  // The claim is about ONE geometry rendered at three weights, so that is the test:
  // the pre-C7 help 16, at 1.5, 1.25 and 1.0, counted on px16.html's own band.
  const ds = [
    'M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z',
    'M6.41 5.76A1.75 1.75 0 1 1 8 8.25',
    'M7.75 11A0.25 0.25 0 1 0 8.25 11A0.25 0.25 0 1 0 7.75 11Z',
  ];
  const counts = [1.5, 1.25, 1].map((w) => {
    const icon = iconFromText(svg(16, w, ds.map((d) => `<path d="${d}"/>`).join('')));
    return inkPixels(icon, 16, { rate: 64 }).px16HalfTone;
  });

  // Measured on the geometry: 65 / 65 / 81. The published 79 / 80 / 80 also
  // reproduce — in Chromium, through px16.html's own code — so the two are both
  // real and they disagree because the browser's anti-aliasing pulls coverage
  // toward the middle of the band: a pixel the geometry puts at 0.88 renders
  // nearer 0.75 and is then counted as half-tone rather than solid.
  //
  // What survives either way is the comparison C7 actually turned on: 1.5
  // against 1.25 is flat, to the pixel, in both. What does NOT survive is the
  // claim as generalised to 1.0 — on the geometry the count jumps 25% there,
  // because a 1.0 stroke lands both of its columns inside the 0.15-0.85 band.
  // Asserted as measured, not as published.
  assert.deepEqual(counts, [65, 65, 81], 'px16-band half-tone counts at stroke 1.5 / 1.25 / 1.0');
  assert.equal(counts[0], counts[1], 'the 1.5-vs-1.25 comparison C7 rested on really is flat');
});
