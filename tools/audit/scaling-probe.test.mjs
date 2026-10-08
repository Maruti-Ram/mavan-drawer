// Tests for scaling-probe.mjs — synthetic fixtures only (hand-built paths and a tiny fake pin in a temp dir).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  lintInkBox, keylineOf, drawingOf, containerOf, shapeOf, keylineCurve, onOwnCurve, holdsOf, classOf, insetPolicy,
  familyOf, quantile, medianUpper, half2, half3, scalePair, refitAcrossDirection, gridLanding, bypassRegion, inkOf,
  loadSet, detailCensus, radiusTriples, exactShare, squareCircle, appendixRow, shareChange,
  ctx, markDrift, sizeSteps, densityRatios, filledDivergence, familySpreads, boxDrift,
  keylineExactness, solvedDims, lintDims,
} from './scaling-probe.mjs';
import { readIcon as rasterIcon, regionOf } from './raster.mjs';
import { inkArea as massInkArea } from './mass.mjs';

const PROBE = join(dirname(fileURLToPath(import.meta.url)), 'scaling-probe.mjs');
const svg = (canvas, stroke, body, notes = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${notes}${body}</svg>\n`;
const paths = (...ds) => ds.map((d) => `<path d="${d}"/>`).join('');
const ring = (cx, cy, r) => `M${cx} ${cy - r}a${r} ${r} 0 1 0 0 ${2 * r}a${r} ${r} 0 1 0 0 ${-2 * r}Z`;

// A tiny pin: a circle container with a plus in it, a plus mark, a square box with a box: note.
const FIX = {
  24: {
    'plus-circle.svg': svg(24, 1.5, paths(ring(12, 12, 9.25), 'M12 7.5v9', 'M7.5 12h9')),
    'plus.svg': svg(24, 1.5, paths('M12 5.25v13.5', 'M5.25 12h13.5'), '<!-- keyline: mark -->'),
    'tag.svg': svg(24, 1.5, paths('M6.25 6.75h11.5a2.5 2.5 0 0 1 2.5 2.5v5.5a2.5 2.5 0 0 1 -2.5 2.5h-11.5a2.5 2.5 0 0 1 -2.5 -2.5v-5.5a2.5 2.5 0 0 1 2.5 -2.5Z'), '<!-- box: 18x12 -->'),
  },
  20: {
    'plus-circle.svg': svg(20, 1.5, paths(ring(10, 10, 7.25), 'M10 6.5v7', 'M6.5 10h7')),
    'plus.svg': svg(20, 1.5, paths('M10 4v12', 'M4 10h12'), '<!-- keyline: mark -->'),
    'tag.svg': svg(20, 1.5, paths('M5.75 5.75h8.5a2 2 0 0 1 2 2v4.5a2 2 0 0 1 -2 2h-8.5a2 2 0 0 1 -2 -2v-4.5a2 2 0 0 1 2 -2Z'), '<!-- box: 14x10 -->'),
  },
  16: {
    'plus-circle.svg': svg(16, 1.25, paths(ring(8, 8, 6.375), 'M8 5.25v5.5', 'M5.25 8h5.5')),
    'plus.svg': svg(16, 1.25, paths('M8 2.625v10.75', 'M2.625 8h10.75'), '<!-- keyline: mark -->'),
    'tag.svg': svg(16, 1.25, paths('M4.125 4.625h7.75a1.5 1.5 0 0 1 1.5 1.5v3.75a1.5 1.5 0 0 1 -1.5 1.5h-7.75a1.5 1.5 0 0 1 -1.5 -1.5v-3.75a1.5 1.5 0 0 1 1.5 -1.5Z'), '<!-- box: 12x8 -->'),
  },
};
function fakePin(extra = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'scaling-probe-'));
  for (const [m, files] of Object.entries(FIX)) {
    mkdirSync(join(dir, 'src/icons', m), { recursive: true });
    for (const [f, t] of Object.entries({ ...files, ...(extra[m] ?? {}) })) writeFileSync(join(dir, 'src/icons', m, f), t);
  }
  return dir;
}

test('lintInkBox grows a centreline by half the weight and takes an area as drawn', () => {
  assert.deepEqual(lintInkBox(['M3.75 12h16.5'], [], 1.5), { x0: 3, y0: 11.25, x1: 21, y1: 12.75 });
  assert.deepEqual(lintInkBox([], ['M2 3H10V9H2Z'], 1.5), { x0: 2, y0: 3, x1: 10, y1: 9 });
});

test('keylineOf matches within ±0.5 in masters.mjs order, else null', () => {
  assert.equal(keylineOf(18, 18, 24), 'square');
  assert.equal(keylineOf(20, 20, 24), 'circle');
  assert.equal(keylineOf(17.6, 18, 24), 'square');
  assert.equal(keylineOf(17.4, 18, 24), null);
  assert.equal(keylineOf(10, 14, 16), 'portrait');
  // exactly on the slack's edge still matches (map-pin's 12×15.5 at 20 and 10×13.5 at 16 sit there)
  assert.equal(keylineOf(12, 15.5, 20), 'portrait');
  assert.equal(keylineOf(10, 13.5, 16), 'portrait');
});

test('drawingOf: régime precedence, share rounded to 3 dp, subpaths, lint\'s cruder container', () => {
  const pc = drawingOf(FIX[24]['plus-circle.svg'], { master: 24, file: 'plus-circle.svg' });
  assert.equal(pc.regime, 'keyline'); assert.equal(pc.keyline, 'circle');
  assert.equal(pc.w, 20); assert.equal(pc.sizeOfCanvas, 0.833);
  assert.equal(pc.subpaths, 3); assert.equal(pc.lintContainer, 20); assert.equal(pc.lintInner, 10.5);
  assert.equal(pc.lintMarkRatio, 0.525);
  const mark = drawingOf(FIX[24]['plus.svg'], { master: 24, file: 'plus.svg' });
  assert.equal(mark.regime, 'mark'); assert.equal(mark.size, 15); assert.equal(mark.lintContainer, null);
  const box = drawingOf(FIX[24]['tag.svg'], { master: 24, file: 'tag.svg' });
  assert.equal(box.regime, 'box'); assert.equal(box.boxNote, '18x12');
  const anchored = drawingOf(svg(24, 1.5, paths('M3.75 12h16.5'), '<!-- anchor: volume -->'), { master: 24, file: 'v.svg' });
  assert.equal(anchored.regime, 'anchor');
  assert.equal(anchored.angle.segments, 1); assert.equal(anchored.angle.meanDev, 0);
  // `keyline: mark` outranks a `box:` note in the same file, and a subpath is counted per M, not per <path>
  const both = drawingOf(svg(24, 1.5, paths('M5 12h14', 'M8 8h8M8 16h8'), '<!-- keyline: mark --><!-- box: 15x9.5 -->'), { master: 24, file: 'w.svg' });
  assert.equal(both.regime, 'mark'); assert.equal(both.boxNote, '15x9.5');
  assert.equal(both.paths, 2); assert.equal(both.subpaths, 3);
  // `box:` outranks `anchor:`
  const boxAnchor = drawingOf(svg(24, 1.5, paths('M3.75 12h16.5'), '<!-- box: 18x1.5 --><!-- anchor: volume -->'), { master: 24, file: 'u.svg' });
  assert.equal(boxAnchor.regime, 'box');
});

test('containerOf: a true container holds the mark and is the body; ratio and inset', () => {
  const pc = drawingOf(FIX[24]['plus-circle.svg'], { master: 24, file: 'plus-circle.svg' });
  const t = containerOf(pc);
  assert.ok(Math.abs(t.ratio - 10.5 / 20) < 1e-9);
  assert.ok(Math.abs(t.clear - 4.75) < 1e-9);
  // the inset is the SMALLEST gap: a lone upright bar is 4.75 from the ring's top, 9.25 from its sides
  const bar = containerOf(drawingOf(svg(24, 1.5, paths(ring(12, 12, 9.25), 'M12 7.5v9')), { master: 24, file: 'b.svg' }));
  assert.ok(Math.abs(bar.clear - 4.75) < 1e-9);
  // the mark sticks out of the ring (the ring is still the body of the drawing): not a container
  const out = drawingOf(svg(24, 1.5, paths(ring(12, 12, 8), 'M12 2.5v5')), { master: 24, file: 'x.svg' });
  assert.equal(containerOf(out), null);
  // the first path is small beside the drawing: not the body
  const small = drawingOf(svg(24, 1.5, paths(ring(6, 6, 2), 'M3 20h18')), { master: 24, file: 'y.svg' });
  assert.equal(containerOf(small), null);
});

test('shapeOf names the trajectory of a share', () => {
  assert.equal(shapeOf(-0.04, 0.05), 'dip-then-rise');
  assert.equal(shapeOf(-0.067, 0), 'dip-then-back');
  assert.equal(shapeOf(0.03, 0.15), 'rises');
  assert.equal(shapeOf(-0.04, -0.08), 'falls');
  assert.equal(shapeOf(0.001, 0.05), 'flat-then-rise');
  assert.equal(shapeOf(0.001, -0.002), 'flat');
});

test('keylineCurve, squareCircle and onOwnCurve read the keyline table', () => {
  const c = keylineCurve('circle');
  assert.ok(Math.abs(c.a + 0.04) < 1e-9 && Math.abs(c.b - 0.05) < 1e-9);
  const s = keylineCurve('square');
  assert.ok(Math.abs(s.a + 1 / 15) < 1e-9 && Math.abs(s.b) < 1e-9);
  assert.deepEqual(keylineCurve('portrait').share, c.share);    // the larger side, not the smaller
  const sc = squareCircle();
  assert.equal(sc[0], 0.9); assert.equal(sc[1], 0.875); assert.ok(Math.abs(sc[2] - 12 / 14) < 1e-12);
  const o = (sizes, k) => sizes.map((size, i) => ({ sizeOfCanvas: Math.round((size / [24, 20, 16][i]) * 1000) / 1000, keyline: k }));
  assert.equal(onOwnCurve(o([18, 14, 12], 'square')), true);
  assert.equal(onOwnCurve(o([18, 14.5, 12], 'square')), false);
  assert.equal(onOwnCurve(o([18, 14, 13], 'square')), false);   // right at 20, off at 16
  assert.equal(onOwnCurve(o([20, 16, 14], 'circle')), true);
  assert.deepEqual(shareChange(o([20, 16, 14])).map((x) => Math.round(x * 1e4) / 1e4), [-0.0396, 0.0504]);
});

test('holdsOf and classOf partition the concepts', () => {
  const pin = fakePin();
  try {
    const set = loadSet(pin);
    assert.equal(holdsOf(set.tri('plus-circle')), 'KAD');      // mark/container 0.525 → 0.482: drifts, so no M
    assert.equal(holdsOf(set.tri('plus')), 'AD');
    assert.equal(holdsOf(set.tri('tag')), 'D');                  // aspect 1.5 → 1.4 → 1.5
  } finally { rmSync(pin, { recursive: true, force: true }); }
  assert.equal(classOf('KAD'), 1); assert.equal(classOf('KADM'), 2); assert.equal(classOf('KD'), 3);
  assert.equal(classOf('KDM'), 3); assert.equal(classOf('D'), 4); assert.equal(classOf('DM'), 4);
  assert.equal(classOf('AD'), 5); assert.equal(classOf('KA'), 6); assert.equal(classOf('K'), 6);
  assert.equal(classOf('KM'), 6); assert.equal(classOf('A'), 7); assert.equal(classOf(''), 8);
});

test('insetPolicy and familyOf', () => {
  assert.equal(insetPolicy(1.0), 'absolute'); assert.equal(insetPolicy(0.93), 'absolute');
  assert.equal(insetPolicy(2 / 3), 'proportional'); assert.equal(insetPolicy(0.71), 'proportional');
  assert.equal(insetPolicy(0.8), 'between'); assert.equal(insetPolicy(0.5), 'other'); assert.equal(insetPolicy(1.2), 'other');
  assert.equal(familyOf('chevron-down-2-large'), 'chevron-down');
  assert.equal(familyOf('users-2-behind'), 'users-2-behind');
  assert.equal(familyOf('plus-small'), 'plus');
});

test('quantile, medianUpper and the half-up roundings follow the card', () => {
  assert.equal(quantile([4, 1, 3, 2], 0.5), 2);         // xs[floor(0.5·3)]
  assert.equal(medianUpper([4, 1, 3, 2]), 3);           // xs[floor(4/2)]
  assert.equal(quantile([3, null, 1, 2], 0.5), 2);
  assert.equal(half2(15.945), 15.95); assert.equal(half2(19.229), 19.23);
  assert.equal(half3(0.4875), 0.488); assert.equal(half3(0.5357), 0.536);
  assert.equal(half2(1.005), 1.01); assert.equal(half3(0.5005), 0.501);   // where Math.round(x·100) would go down
});

test('scalePair: an exact rescale, a redraw, and a path-count difference', () => {
  const A = svg(24, 1.5, paths('M5 5h10v10h-10Z', 'M8 8l4 4'));
  const B = svg(20, 1.5, paths('M3 3h8v8h-8Z', 'M5.4 5.4l3.2 3.2'));
  const ex = scalePair(A, B, 24, 20);
  assert.equal(ex.verdict, 'exact'); assert.equal(ex.scale, 0.8); assert.equal(ex.trivial, false);
  // a residual inside the 0.005 tolerance is still exact; one past it is near
  assert.equal(scalePair(A, svg(20, 1.5, paths('M3 3h8v8h-8Z', 'M5.4 5.4l3.204 3.2')), 24, 20).verdict, 'exact');
  assert.equal(scalePair(A, svg(20, 1.5, paths('M3 3h8v8h-8Z', 'M5.4 5.4l3.24 3.2')), 24, 20).verdict, 'near');
  const C = svg(20, 1.5, paths('M3 3h8v8h-8Z', 'M5.4 5.4l3.6 3.2'));
  assert.notEqual(scalePair(A, C, 24, 20).verdict, 'exact');
  const D = svg(20, 1.5, paths('M3 3h8v8h-8Z'));
  assert.equal(scalePair(A, D, 24, 20).verdict, 'structure');
  assert.equal(scalePair(A, D, 24, 20).reason, 'path count differs');
});

test('refitAcrossDirection: a ring written the other way round is the same drawing resized', () => {
  // the same rounded square, clockwise at 24 and counter-clockwise at 20 (0.8 ×)
  const cw = 'M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2Z';
  const ccw = 'M5.6 4a1.6 1.6 0 0 0 -1.6 1.6v8a1.6 1.6 0 0 0 1.6 1.6h8a1.6 1.6 0 0 0 1.6 -1.6v-8a1.6 1.6 0 0 0 -1.6 -1.6Z';
  const row = scalePair(svg(24, 1.5, paths(cw)), svg(20, 1.5, paths(ccw)), 24, 20);
  assert.equal(row.verdict, 'structure'); assert.equal(row.reason, 'different segment structure');
  const fixed = refitAcrossDirection(row);
  assert.equal(fixed.verdict, 'exact'); assert.equal(fixed.scale, 0.8);
  // a genuinely different structure stays unexposed
  const other = scalePair(svg(24, 1.5, paths(cw)), svg(20, 1.5, paths('M4 4h12v12h-12Z')), 24, 20);
  assert.equal(refitAcrossDirection(other), null);
});

test('gridLanding counts the 24 coordinates that land on the 20 quarter and 16 eighth grids', () => {
  assert.deepEqual(gridLanding([6, 3, 1.5]), { tot: 3, ok20: 3, ok16: 3 });
  assert.deepEqual(gridLanding([0.25, 12]), { tot: 2, ok20: 1, ok16: 1 });
  assert.deepEqual(gridLanding([0.75]), { tot: 1, ok20: 0, ok16: 1 });
});

test('bypassRegion: a horizontal area edge across a cell is sampled, not called full', () => {
  const dir = mkdtempSync(join(tmpdir(), 'scaling-probe-raster-'));
  try {
    mkdirSync(join(dir, 'src/icons/24'), { recursive: true });
    const file = join(dir, 'src/icons/24/slab-filled.svg');
    writeFileSync(file, svg(24, 1.5, '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M0.5 0.25H3.5V2.75H0.5Z"/>'));
    const icon = rasterIcon(file);
    const committed = massInkArea(icon, { rate: 32 }).area;
    const fixed = massInkArea({ icon, region: bypassRegion(icon) }, { rate: 32 }).area;
    assert.ok(Math.abs(fixed - 7.5) < 1e-6, `bypass ${fixed}`);
    assert.ok(committed > 7.5 + 0.1, `the committed classify should over-count here (${committed})`);
    assert.equal(inkOf(file, { bypass: true }).area, 7.5);
    assert.equal(inkOf(file, { bypass: true }).ofCanvas, Math.round((7.5 / 576) * 1e5) / 1e5);
    // a drawing with no area path measures the same either way
    const plain = join(fakePinOnce(), 'src/icons/24/plus.svg');
    assert.deepEqual(inkOf(plain, { bypass: true }), inkOf(plain));
    assert.ok(regionOf(rasterIcon(plain)).classify !== undefined);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
let once = null;
function fakePinOnce() { return (once ??= fakePin()); }
process.on('exit', () => { if (once) rmSync(once, { recursive: true, force: true }); });

test('set censuses: detail, radius triples, exact keyline share', () => {
  // plus-circle sheds its cross-bar at 16; plus splits a stroke into two subpaths at 16
  const pin = fakePin({ 16: { 'plus-circle.svg': svg(16, 1.25, paths(ring(8, 8, 6.375), 'M8 5.25v5.5')),
    'plus.svg': svg(16, 1.25, paths('M8 2.625v4.5M8 8.875v4.5', 'M2.625 8h10.75'), '<!-- keyline: mark -->') } });
  try {
    const set = loadSet(pin);
    const d = detailCensus(set, 'outline');
    assert.equal(d.same, 1); assert.deepEqual(d.lose.map((x) => [x.c, x.v]), [['plus-circle', [3, 3, 2]]]);
    assert.deepEqual(d.gain.map((x) => [x.c, x.v, x.paths]), [['plus', [2, 2, 3], [2, 2, 2]]]);
    assert.deepEqual(radiusTriples(set).rows.map((r) => r.c), ['tag']);
    assert.deepEqual(radiusTriples(set).triples, [['2.5/2/1.5', 1]]);
    const e = exactShare(set, 24);
    assert.deepEqual([e.n, e.exact], [1, 1]);
  } finally { rmSync(pin, { recursive: true, force: true }); }
  // on hand-built rows: the LARGEST container radius per master, and exact means within 0.005 on both sides
  const row = (m, extra) => ({ master: m, radii: { container: [] }, regime: 'keyline', keyline: 'square', ...extra });
  const C = { concepts: ['a', 'b'], byConcept: new Map([
    ['a', { outline: { 24: row(24, { radii: { container: [1.5, 2.5] }, w: 18, h: 18 }), 20: row(20, { radii: { container: [2] }, w: 14, h: 14 }), 16: row(16, { radii: { container: [1, 1.5] }, w: 12, h: 12 }) } }],
    ['b', { outline: { 24: row(24, { w: 18, h: 17.75 }), 20: row(20, { w: 14, h: 14 }), 16: row(16, { w: 12, h: 12 }) } }],
  ]) };
  assert.deepEqual(radiusTriples(C).triples, [['2.5/2/1.5', 1]]);
  assert.deepEqual(exactShare(C, 24), { n: 2, exact: 1, share: 0.5 });
});

test('appendixRow prints the card\'s row format', () => {
  const pin = fakePin();
  try {
    const set = loadSet(pin);
    const o = set.tri('plus-circle');
    o.forEach((r, i) => { r.mass = { area: [100.5, 80.25, 60][i], ofCanvas: [0.17448, 0.20063, 0.23438][i] }; });
    assert.equal(appendixRow('plus-circle', o),
      '| `plus-circle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 100.5 / 80.25 / 60 | 0.174 / 0.201 / 0.234 | 0.525 / 0.531 / 0.482 | 4.75 / 3.75 / 3.63 | 0.000 / 0.000 / 0.000 | KAD |');
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

test('CLI: a section heading on a fake pin; an unknown section and a bad pin exit 2', () => {
  // `frame` sits on the square keyline at every master but 14.4 wide at 20: off the square's curve
  const pin = fakePin({ 24: { 'frame.svg': svg(24, 1.5, paths('M3.75 3.75h16.5v16.5h-16.5Z')) },
    20: { 'frame.svg': svg(20, 1.5, paths('M3.55 3.55h12.9v12.9h-12.9Z')) },
    16: { 'frame.svg': svg(16, 1.25, paths('M2.625 2.625h10.75v10.75h-10.75Z')) } });
  const ok = spawnSync(process.execPath, [PROBE, pin, 's2', 's9', 's10'], { encoding: 'utf8' });
  rmSync(pin, { recursive: true, force: true });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /## §2 The root cause/);
  assert.match(ok.stdout, /## §10 The classes/);
  assert.match(ok.stdout, /keyline-held outline concepts on their own curve within 1pp: 1 of 2; the other 1:\n  frame \(square/);
  const bad = spawnSync(process.execPath, [PROBE, fakePinOnce(), 'nope'], { encoding: 'utf8' });
  assert.equal(bad.status, 2); assert.match(bad.stderr, /unknown section/);
  const nopin = spawnSync(process.execPath, [PROBE, join(fakePinOnce(), 'missing')], { encoding: 'utf8' });
  assert.equal(nopin.status, 2); assert.match(nopin.stderr, /usage/);
});

// ── the set-level helpers, on hand-built rows ─────────────────────────────────────────────────────────────
const MS = [24, 20, 16];
const row = (m, size, extra = {}) => ({ master: m, w: size, h: size, sizeOfCanvas: Math.round((size / m) * 1000) / 1000, ...extra });
function synth(map) {
  const concepts = Object.keys(map).sort();
  const byConcept = new Map(concepts.map((c) => [c, {
    outline: Object.fromEntries((map[c].outline ?? []).map((r) => [r.master, r])),
    filled: Object.fromEntries((map[c].filled ?? []).map((r) => [r.master, r])),
  }]));
  const tri = (c, style = 'outline') => MS.map((m) => byConcept.get(c)?.[style][m]);
  return { concepts, byConcept, tri, full: concepts.filter((c) => tri(c).every(Boolean)) };
}
const three = (sizes, extra = () => ({})) => sizes.map((v, i) => row(MS[i], v, extra(i)));

test('filledDivergence compares the 24→16 change only, beyond 1pp', () => {
  const C = synth({
    a: { outline: three([20, 16, 14]), filled: three([20, 15, 14], () => ({ growsNote: '0 0 0 0' })) },   // differs at 20 only
    b: { outline: three([20, 16, 14]), filled: three([20, 16, 13], () => ({ growsNote: '0 0 0 0' })) },   // differs at 16
    c: { outline: three([18, 14, 12]) },                                                                    // no filled twin
  });
  const d = filledDivergence(C);
  assert.equal(d.both, 2);
  assert.deepEqual(d.rows.map((x) => x.c), ['b']);
});

test('boxDrift takes only concepts with box: at all three masters', () => {
  const C = synth({
    p: { outline: [row(24, 0, { w: 11, h: 20, boxNote: '11x20' }), row(20, 0, { w: 10, h: 16, boxNote: '10x16' }), row(16, 0, { w: 10, h: 14, boxNote: '10x14' })] },
    q: { outline: [row(24, 0, { w: 14, h: 20, boxNote: '14x20' }), row(20, 0, { w: 12, h: 16 }), row(16, 0, { w: 10, h: 14 })] },
  });
  const b = boxDrift(C);
  assert.deepEqual(b.map((x) => x.c), ['p']);
  assert.ok(Math.abs(b[0].d - ((10 / 14) / 0.55 - 1)) < 1e-12);
});

test('markDrift is the 24→16 change of the 4 dp mark/container ratio, worst shrink first', () => {
  const C = { T: new Map([['j', [{ ratio: 0.4 }, { ratio: 0.38 }, { ratio: 0.4 }]], ['k', [{ ratio: 0.5 }, { ratio: 0.5 }, { ratio: 0.4 }]]]) };
  const d = markDrift(C);
  assert.deepEqual(d.map((x) => x.c), ['k', 'j']);
  assert.ok(Math.abs(d[0].d + 0.2) < 1e-12); assert.equal(d[1].d, 0);
});

test('familySpreads: families of two or more, spread of the 24→16 change', () => {
  const C = { traj: [
    { c: 'x', b: 0.21, regime: 'mark' }, { c: 'x-large', b: 0.171, regime: 'mark' }, { c: 'x-small', b: 0.273, regime: 'mark' },
    { c: 'alone', b: 0.5, regime: 'keyline' },
  ] };
  const f = familySpreads(C);
  assert.deepEqual(f.map((r) => r.fam), ['x']);
  assert.ok(Math.abs(f[0].spread - 0.102) < 1e-12);
  assert.deepEqual(f[0].regimes, ['mark']);
});

test('sizeSteps checks the -large and the -small step against SIZE_STEP', () => {
  const C = synth({
    plus: { outline: three([15, 13.5, 12]) },
    'plus-large': { outline: three([18, 16, 14]) },
    'plus-small': { outline: three([12, 11, 9]) },        // one unit short at 16
  });
  const st = sizeSteps(C);
  assert.equal(st.checked, 6); assert.equal(st.ok, 5);
  assert.deepEqual(st.off, [{ name: 'plus-small', m: 16, got: -3 }]);
  // a -small one step LARGER than its default is off, not a step
  const W = synth({ minus: { outline: three([15, 13.5, 12]) }, 'minus-small': { outline: three([18, 16, 14]) } });
  assert.equal(sizeSteps(W).ok, 0);
});

test('densityRatios: the later master over the earlier one', () => {
  const C = synth({ a: { outline: three([20, 16, 14], (i) => ({ mass: { ofCanvas: [0.1, 0.11, 0.12][i] } })) } });
  const r = densityRatios(C, 'outline');
  assert.ok(Math.abs(r['24-16'] - 1.2) < 1e-12);
  assert.ok(Math.abs(r['24-20'] - 1.1) < 1e-12);
  assert.ok(Math.abs(r['20-16'] - 0.12 / 0.11) < 1e-12);
});

test('ctx: the inset table (T66) keeps only containers with a non-zero inset at every master', () => {
  // `book`: a frame with a spine that touches it top and bottom — a true container whose inset is 0
  const pin = fakePin({ 24: { 'book.svg': svg(24, 1.5, paths('M3.75 3.75h16.5v16.5h-16.5Z', 'M12 3.75v16.5')) },
    20: { 'book.svg': svg(20, 1.5, paths('M3.75 3.75h12.5v12.5h-12.5Z', 'M10 3.75v12.5')) },
    16: { 'book.svg': svg(16, 1.25, paths('M2.625 2.625h10.75v10.75h-10.75Z', 'M8 2.625v10.75')) } });
  try {
    const C = ctx(loadSet(pin));
    assert.deepEqual([...C.T.keys()].sort(), ['book', 'plus-circle']);
    assert.deepEqual([...C.T66.keys()], ['plus-circle']);
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

test('exact keyline fit: 0.01 off is not exact; the slack count; lint\'s box against the solved box', () => {
  const kr = (m, w, h) => ({ master: m, w, h, sizeOfCanvas: Math.round((Math.max(w, h) / m) * 1000) / 1000, regime: 'keyline', keyline: 'square' });
  const C = synth({
    on: { outline: [kr(24, 18, 18), kr(20, 14, 14), kr(16, 12, 12)] },
    off: { outline: [kr(24, 18, 18), kr(20, 13.99, 14), kr(16, 12, 12)] },     // 0.01 short at 20 (message-5's case)
  });
  assert.deepEqual(exactShare(C, 20), { n: 2, exact: 1, share: 0.5 });
  assert.deepEqual(exactShare(C, 24), { n: 2, exact: 2, share: 1 });
  assert.deepEqual(keylineExactness(C), { n: 2, all3: 1, slack: 1 });
  // read on other dimensions (as the solved box would give them), the 13.99 is 14 and both are exact
  const dims = (r) => [r.w === 13.99 ? 14 : r.w, r.h];
  assert.deepEqual(keylineExactness(C, dims), { n: 2, all3: 2, slack: 0 });
  assert.deepEqual(lintDims({ w: 1, h: 2 }), [1, 2]);
  // the solved box of a ring is its exact diameter plus the stroke
  const pc = drawingOf(FIX[24]['plus-circle.svg'], { master: 24, file: 'plus-circle.svg' });
  assert.deepEqual(solvedDims(pc), [20, 20]);
  // a 300° arc whose top falls between geometry.bbox's 64 samples: lint's box reads 19.99 tall, the solved box 20
  const arc = drawingOf(svg(24, 1.5, paths('M21.237 11.516A9.25 9.25 0 1 0 17.038 19.758')), { master: 24, file: 'arc.svg' });
  assert.equal(arc.h, 19.99);
  assert.deepEqual(solvedDims(arc), [19.99, 20]);
});
