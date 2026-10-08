// Tests for tools/audit/mass-probe.mjs (card 1.5, findings-mass.md reprinted). Synthetic fixtures
// only: hand-built path strings, a tiny fake pin made with mkdtempSync, hand-made reference records.
// Nothing here reads the real pin, research/ or the network.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { areaRegion, strokeRegion, rasterise, readIcon, regionOf } from './raster.mjs';
import {
  bfRasterise, bfInkArea, bugCases, lineLengths, horizontalEdges, hasTrigger, zeroLengthArcs, kindOf, pathSignature,
  q, rankAvg, rankStable, spearman, pearson, bandOf, bandIndex, stemOf, sizeOf, gaussKernel, blur, squintPeak, densest3x3,
  cosine, simplify, lucideShapes, lucideMeasure, listFiles, measureFile, measureAll, buildContext, bugScope, classifyPatch,
  duplicates, seedPairs, varianceSplit, weldStats, denseRows, hairRows, crowdedRows, matchedLucide, filledFamilies, ratioRows,
  SQUINT, loadLucide, sigmaSweep, driftOf, lensWidth,
} from './mass-probe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} ${a} vs ${b} (±${tol})`);

// ── the bypass ─────────────────────────────────────────────────────────────
test('bfRasterise: a filled rectangle with fractional top/bottom edges gets its closed-form coverage', () => {
  const reg = { ...areaRegion(['M2 2.375H14V13.625H2Z']), canvas: 16 };
  const { cov } = bfRasterise(reg, { px: 16, rate: 32 });
  near(cov[2 * 16 + 8], 0.625, 1e-12, 'row 2'); near(cov[13 * 16 + 8], 0.625, 1e-12, 'row 13');
  near(cov[7 * 16 + 8], 1, 1e-12, 'interior'); near(cov[1 * 16 + 8], 0, 1e-12, 'outside');
  near(bfInkArea(reg, { rate: 32 }), 135, 1e-9, 'area');
  // the classify path (raster.mjs:257) scores the same straddling row 1.000 — the defect the bypass avoids
  assert.equal(rasterise(reg, { px: 16, rate: 32, canvas: 16 }).cov[2 * 16 + 8], 1);
});

test('bfRasterise: a 24 master shown at 16 px uses 32 samples per device pixel and keeps the ink', () => {
  const reg = { ...strokeRegion(['M6 12H18'], 1.5), canvas: 24 };
  const tot = bfRasterise(reg, { px: 16, rate: 32 }).cov.reduce((a, b) => a + b, 0);
  near(tot * (24 / 16) ** 2, 12 * 1.5 + Math.PI * 0.75 ** 2, 0.05, 'ink area in canvas units');
  // an edge one third into a 1.5-unit pixel: 11 of the pixel's 32 sample columns fall inside it
  const strip = { ...areaRegion(['M0 0H0.5V24H0Z']), canvas: 24 };
  assert.equal(bfRasterise(strip, { px: 16, rate: 32 }).cov[5 * 16], 11 / 32);
});

test('bugCases: the bypass meets every closed form; the classify path does not on the straddling cases', () => {
  const c = bugCases();
  assert.equal(c.length, 6);
  for (const x of c) assert.ok(x.bypassMatchesClosed, x.label);
  assert.deepEqual(c[0].classifyVals, [1, 1]); near(c[0].classifyArea, 144, 1e-9); near(c[0].bypassArea, 135, 1e-9);
  assert.deepEqual(c[1].classifyVals, [1, 0]); near(c[1].classifyArea, 132, 1e-9);
  assert.deepEqual(c[3].classifyVals, [1, 1]);                // edges on pixel lines: exact either way
  near(c[5].closedArea, 135 - (4 - Math.PI) * 4, 1e-9); assert.equal(c[5].classifyVals[0], 1);
});

// ── drawing geometry ───────────────────────────────────────────────────────
test('lineLengths: centreline of strokes (closing chord when closed), outline of fills, subpaths', () => {
  const sq = lineLengths({ paths: [{ d: 'M2 2H10V10H2Z', kind: 'stroke', weight: 1.25 }] });
  near(sq.L, 32, 1e-9); near(sq.Lw, 40, 1e-9); assert.equal(sq.P, 0); assert.equal(sq.nSub, 1);
  const open = lineLengths({ paths: [{ d: 'M2 2H10V10', kind: 'stroke', weight: 1.5 }, { d: 'M0 0H4V4H0', kind: 'area' }] });
  near(open.L, 16, 1e-9); near(open.P, 16, 1e-9, 'an area path always closes'); assert.equal(open.nSub, 2);
  const arc = lineLengths({ paths: [{ d: 'M4 8A4 4 0 0 1 12 8', kind: 'stroke', weight: 1 }] });
  near(arc.L, Math.PI * 4, 1e-3, 'half circle');
});

test('horizontalEdges / hasTrigger: straight horizontal edges at a non-integer y, absolute and relative', () => {
  assert.ok(hasTrigger(['M2 2.375H14V13.625H2Z']));
  assert.ok(!hasTrigger(['M2 2H14V14H2Z']));
  assert.ok(hasTrigger(['M2 3V5.5h4V3Z']), 'relative h at y 5.5');
  assert.ok(hasTrigger(['M2 2.25H14V8H2Z']), 'a quarter off the grid counts too');
  assert.ok(hasTrigger(['M2 2H14V7.875H2Z']), 'and an eighth');
  assert.ok(hasTrigger(['M2 4.5L6 4.5L6 8Z']), 'an L between equal y');
  assert.ok(hasTrigger(['M6 8L6 2.5L2 2.5L2 8Z']), 'closing… and L at 2.5');
  assert.ok(!hasTrigger(['M2 2.5A2 2 0 0 1 6 2.5V8H2Z']), 'an arc is not a straight edge; Z from (2,8) to (2,2.5) is vertical');
  assert.deepEqual(horizontalEdges('M0 1.5H4V3H0Z').map(([y, w]) => [y, w]), [[1.5, 4], [3, 4]]);
  assert.deepEqual(horizontalEdges('M0 0V2H3V0Z'), [[2, 3], [0, 3]], 'the closing Z counts');
});

test('zeroLengthArcs: an arc whose end point is its start point', () => {
  assert.deepEqual(zeroLengthArcs('M3.75 19.5A7 7 0 0 1 3.75 19.5L8 8'), ['A7 7 0 0 1 3.75 19.5']);
  assert.deepEqual(zeroLengthArcs('M3 3A2 2 0 0 1 7 3'), []);
  assert.equal(zeroLengthArcs('M3 3a2 2 0 0 1 0 0').length, 1, 'relative');
  assert.deepEqual(zeroLengthArcs('M3 3A2 2 0 0 1 3 7'), [], 'same x, different y is a real arc');
});

test('kindOf and pathSignature read the file the way the card did', () => {
  assert.equal(kindOf('<svg><!-- keyline: mark --><path d="M0 0"/></svg>'), 'mark');
  assert.equal(kindOf('<svg><!-- box: 14x12 --></svg>'), 'box');
  assert.equal(kindOf('<svg><!-- anchor: volume --></svg>'), 'anchor');
  assert.equal(kindOf('<svg><!-- tags: plain --></svg>'), 'silhouette');
  assert.equal(kindOf('<svg><!-- box: 12x2 --><!-- keyline: mark --></svg>'), 'mark', 'the mark note wins, as the card read it');
  assert.equal(pathSignature('<path d="M1  2\n H3"/><path fill="x" d="M0 0"/>'), 'M1 2 H3|M0 0');
  assert.equal(pathSignature('<path d="M1 2 H3"/>'), pathSignature('<path  d="M1   2 H3" />'));
});

// ── statistics ─────────────────────────────────────────────────────────────
test('q, ranks and correlations', () => {
  assert.equal(q([1, 2, 3, 4], 0.5), 2.5); assert.equal(q([4, 1, 3, 2], 0.25), 1.75); assert.equal(q([5], 0.9), 5);
  assert.deepEqual(rankAvg([10, 20, 20, 5]), [2, 3.5, 3.5, 1]);
  assert.deepEqual(rankStable([10, 20, 20, 5]), [2, 3, 4, 1]);
  near(pearson([1, 2, 3], [2, 4, 6]), 1, 1e-12);
  near(spearman([1, 2, 3, 4], [1, 4, 9, 16]), 1, 1e-12);
  near(spearman([1, 2, 3, 4], [4, 3, 2, 1]), -1, 1e-12);
});

test('bands: edges belong to the band above', () => {
  assert.equal(bandOf(4.9, 10), 'Hairline'); assert.equal(bandOf(5, 10), 'Light'); assert.equal(bandOf(7.5, 10), 'Level');
  assert.equal(bandOf(12.5, 10), 'Full'); assert.equal(bandOf(15, 10), 'Dense');
  assert.deepEqual([4.9, 5, 7.5, 12.49, 12.5, 15].map((v) => bandIndex(v, 10)), [0, 1, 2, 2, 3, 4]);
});

test('stemOf / sizeOf: siblings share a stem and a size', () => {
  assert.equal(stemOf('check-4-small'), 'check'); assert.equal(stemOf('check-4'), 'check'); assert.equal(stemOf('menu-arrow-left'), 'menu-arrow-left'); assert.equal(stemOf('globe'), 'globe');
  assert.equal(sizeOf('check-small'), 'small'); assert.equal(sizeOf('chevron-down-large'), 'large'); assert.equal(sizeOf('x'), 'default');
});

test('local darkness: kernel, blur (white outside), squint peak, densest 3×3, cosine', () => {
  const k = gaussKernel(1.5, 5);
  assert.equal(k.length, 11); near(k.reduce((a, b) => a + b, 0), 1, 1e-12); assert.ok(k[5] > k[4] && k[4] === k[6]);
  const one = new Float64Array(256); one[8 * 16 + 8] = 1;
  near(max(blur(one, 16, k)), k[5] * k[5], 1e-12, 'a lone pixel peaks at the kernel centre squared');
  near(squintPeak(one, 16, SQUINT), k[5] * k[5], 1e-12);
  const solid = new Float64Array(256).fill(1);
  near(blur(solid, 16, k)[8 * 16 + 8], 1, 1e-12, 'interior of a solid tile');
  assert.ok(blur(solid, 16, k)[0] < 0.5, 'a corner loses ink to the white outside');
  const blk = new Float64Array(256); for (let y = 3; y < 6; y++) for (let x = 10; x < 13; x++) blk[y * 16 + x] = 1; blk[0] = 1;
  near(densest3x3(blk, 16), 1, 1e-12);
  const stripes = new Float64Array(256); for (let i = 0; i < 256; i += 2) stripes[i] = 1; near(densest3x3(stripes, 16), 6 / 9, 1e-12, 'every other column');
  near(cosine([1, 0, 1], [1, 0, 1]), 1, 1e-12); near(cosine([1, 0], [0, 1]), 0, 1e-12);
});
const max = (a) => a.reduce((x, y) => Math.max(x, y), -Infinity);

// ── Lucide ─────────────────────────────────────────────────────────────────
test('simplify: Bézier commands become 32 chords; arcs and lines pass through absolute', () => {
  const c = simplify('M0 0C0 10 10 10 10 0');
  assert.equal((c.match(/L/g) || []).length, 32); assert.ok(c.endsWith('L10 0'));
  assert.equal((simplify('M2 2c0 4 4 4 4 0q2 2 4 0').match(/L/g) || []).length, 64);
  assert.equal(simplify('M1 1h3v2a1 1 0 0 1 1 1z'), 'M1 1L4 1L4 3A1 1 0 0 1 5 4Z');
});

test('lucideShapes: circles, rects, lines and polylines become paths; a filled element refuses the file', () => {
  assert.deepEqual(lucideShapes('<svg><circle cx="12" cy="12" r="10"/></svg>'), ['M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z']);
  assert.deepEqual(lucideShapes('<svg><line x1="1" y1="2" x2="3" y2="4"/><polyline points="1 1 2 2 3 1"/></svg>'), ['M1 2L3 4', 'M1 1L2 2L3 1']);
  assert.match(lucideShapes('<svg><rect x="2" y="2" width="20" height="10" rx="2"/></svg>')[0], /^M4 2L20 2A2 2 0 0 1 22 4/);
  assert.equal(lucideShapes('<svg><path d="M0 0" fill="currentColor"/></svg>'), null);
});

test('lucideMeasure: line length and ink at stroke 2 on the 24 grid', () => {
  const r = lucideMeasure('<svg><path d="M2 12h10"/></svg>', 't');
  near(r.L, 10, 1e-9); near(r.area, 10 * 2 + Math.PI, 0.03); near(r.ofCanvas, r.area / 576, 1e-5);
  assert.equal(lucideMeasure('<svg><rect width="4" height="4" fill="red"/></svg>', 'f'), null);
});

// ── a fake pin ─────────────────────────────────────────────────────────────
const SW = { 24: 1.5, 20: 1.5, 16: 1.25 };
const svg = (c, sw, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c} ${c}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
function fakePin() {
  const dir = mkdtempSync(join(tmpdir(), 'mass-probe-'));
  for (const c of [24, 20, 16]) {
    const d = join(dir, 'src/icons', String(c)); mkdirSync(d, { recursive: true });
    const w = (n, t) => writeFileSync(join(d, `${n}.svg`), t);
    const sq = `M4 4H${c - 4}V${c - 4}H4Z`;
    w('minus', svg(c, SW[c], `  <!-- keyline: mark -->\n  <path d="M4 ${c / 2}H${c - 4}"/>`));
    w('minus-filled', svg(c, 2, `  <!-- box: 8x2 -->\n  <path d="M4.5 ${c / 2}H${c - 4.5}"/>`));   // kinds are read from the OUTLINE file only
    w('folder', svg(c, SW[c], `  <path d="${sq}"/>`));
    w('folder-2', svg(c, SW[c], `  <path d="${sq}"/>`));                          // identical to folder: a twin
    w('folder-filled', svg(c, SW[c], `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M3.25 3.375H${c - 3.25}V${c - 3.375}H3.25Z"/>`)); // the classify trigger
    w('folder-2-filled', svg(c, SW[c], `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M3.25 3H${c - 3.25}V${c - 3}H3.25Z"/>\n  <path d="M5 ${c / 2}H${c - 5}"/>`)); // a fill and a stroke
    w('plus', svg(c, SW[c], `  <!-- keyline: mark -->\n  <path d="M4 ${c / 2}H${c - 4}M${c / 2} 4V${c - 4}"/>`));
    w('plus-filled', svg(c, 2, `  <!-- keyline: mark -->\n  <path d="M4.5 ${c / 2}H${c - 4.5}M${c / 2} 4.5V${c - 4.5}"/>`));
  }
  return dir;
}

test('measureFile / measureAll on a fake pin: bypass ink, the split, classify, rate 64; workers and cache agree', async () => {
  const pin = fakePin();
  try {
    const files = listFiles(pin);
    assert.equal(files.length, 24); assert.equal(files[0].key, '24/folder-2-filled'); assert.equal(files.at(-1).key, '16/plus');
    const one = await measureAll(files, { classify: true, r64: true, jobs: 1 });
    const two = await measureAll(files, { classify: true, r64: true, jobs: 2 });
    assert.deepEqual(two, one, 'worker threads change nothing');
    const at = (k) => one.find((r) => r.key === k);
    const m16 = at('16/minus');
    near(m16.area, 8 * 1.25 + Math.PI * 0.625 ** 2, 0.01, 'a round-capped line');
    assert.equal(m16.strokeInk, m16.area); assert.equal(m16.areaInk, 0); near(m16.L, 8, 1e-9); assert.equal(m16.cov.length, 256);
    const f16 = at('16/folder-filled');
    near(f16.area, (16 - 6.5) * (16 - 6.75), 1e-6, 'a 9.5 × 9.25 rectangle'); assert.ok(f16.trigger); assert.ok(f16.hasArea);
    assert.ok(Math.abs(f16.c.area - f16.area) > 0.05, 'the classify path is wrong on it');
    assert.equal(at('16/folder-2-filled').trigger, false); near(at('16/folder-2-filled').c.area, at('16/folder-2-filled').area, 1e-6);
    near(m16.c.area, m16.area, 1e-9, 'strokes are unaffected'); near(m16.area64, m16.area, 0.05);
    const reg = regionOf(readIcon(files.find((f) => f.key === '16/minus').file));
    assert.equal(m16.area64, Math.round(bfInkArea(reg, { rate: 64 }) * 1e4) / 1e4, 'the convergence pass is the bypass at rate 64');
    const g16 = at('16/folder-2-filled');
    near(g16.areaInk, g16.area, 1e-6, 'the line lies inside the fill'); near(g16.strokeInk, 6 * 1.25 + Math.PI * 0.625 ** 2, 0.02, 'the stroke alone');
    assert.equal(g16.nStroke, 1); assert.equal(g16.nArea, 1);
    assert.ok(!('cov' in at('24/minus')), 'only the 16 master keeps its pixels');
    // cache: written to the directory the user names, reused, and refused once a drawing changes
    const cache = mkdtempSync(join(tmpdir(), 'mass-probe-cache-'));
    try {
      const a = await measureAll(files, { jobs: 1, cache });
      assert.ok(existsSync(join(cache, 'mass-probe-census.json')));
      let logged = ''; const b = await measureAll(files, { jobs: 1, cache, log: (m) => { logged = m; } });
      assert.match(logged, /from the cache/); assert.deepEqual(b, a);
      writeFileSync(files.find((f) => f.key === '16/minus').file, svg(16, 1.25, '  <!-- keyline: mark -->\n  <path d="M3 8H13"/>'));
      const c2 = await measureAll(files, { jobs: 1, cache, log: (m) => { logged = m; } });
      assert.match(logged, /measured/); assert.ok(c2.find((r) => r.key === '16/minus').area > b.find((r) => r.key === '16/minus').area);
    } finally { rmSync(cache, { recursive: true, force: true }); }
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

test('context and derivations on the fake pin: kinds, twins, the bug scope, seed pairs, variance split', async () => {
  const pin = fakePin();
  try {
    const files = listFiles(pin), X = buildContext(files, await measureAll(files, { classify: true, jobs: 1 }));
    assert.deepEqual(X.concepts, ['folder', 'folder-2', 'minus', 'plus']);
    assert.equal(X.kinds.minus[16], 'mark'); assert.equal(X.kinds.folder[24], 'silhouette');
    for (const m of [24, 20, 16]) { const r = X.get('folder', m, 'outline'); assert.equal(r.ofCanvas, Math.round(r.area / m ** 2 * 1e5) / 1e5, `ink share over the ${m} canvas`); assert.equal(r.ofBbox, Math.round(r.area / (r.box.w * r.box.h) * 1e5) / 1e5); }
    assert.deepEqual(X.twins('folder', 16, 'outline'), ['folder-2']); assert.deepEqual(X.twins('folder', 16, 'filled'), []);
    const du = duplicates(X);
    assert.equal(du.sets.length, 1); assert.equal(du.groups, 3); assert.equal(du.inGroups, 6);
    assert.deepEqual(du.sets[0], ['folder = folder-2', { outline: [24, 20, 16], filled: [] }]);
    const b = bugScope(X);
    assert.equal(b.shapeN, 6); assert.equal(b.groups[2].changed, 3, 'one folder-filled per master'); assert.equal(b.groups[0].changed, 0);
    assert.equal(b.trig.length, 3); assert.equal(b.trigChanged, 3); assert.equal(b.noTrigChanged, 0);
    assert.deepEqual(b.byMaster.map((x) => x.changed), [1, 1, 1]); assert.ok(b.pxTotal > 0 && b.pxMax > 0.3);
    const cp = classifyPatch(X); assert.equal(cp.n, 8); assert.ok(cp.htAllShape);
    const sp = seedPairs(X, 'outline');
    assert.equal(sp.total, 6); assert.equal(sp.identical, 1, 'folder ≡ folder-2');
    const picked = sp.pick(5);
    assert.equal(picked.length, 3, 'folder ≡ folder-2 share a stem, so three cross-stem pairs remain');
    for (const [, a, b2] of picked) assert.notEqual(stemOf(a), stemOf(b2), 'cross-stem only');
    assert.ok(picked[0][0] >= picked[1][0] && picked[1][0] >= picked[2][0], 'ranked by cosine');
    const vs = varianceSplit(X, 16, 'outline'); near(vs.foot + vs.pack, 1, 0.01, 'log share = log footprint + log packing');
    const ws = weldStats(X, 16); assert.equal(ws.w.length, 4); assert.equal(ws.below, 0);
    near(X.get('minus', 16, 'outline').strokeInk / X.get('minus', 16, 'outline').Lw, (10 + Math.PI * 0.625 ** 2) / 10, 0.01, 'a lone capped line scores a little above 1');
    near(X.get('plus', 16, 'outline').strokeInk / X.get('plus', 16, 'outline').Lw, (2 * (10 + Math.PI * 0.625 ** 2) - 1.25 ** 2) / 20, 0.01, 'the crossing is inked once');
    const rr = ratioRows(X).find((x) => x.m === 16); assert.equal(rr.lh.length, 2); assert.equal(rr.sh.length, 2, 'a filled drawing with any area path is shape-filled, strokes or not');
    const fam = filledFamilies(X); assert.deepEqual(fam.map((x) => x.k).sort(), ['folder', 'minus', 'plus']); assert.equal(fam.find((x) => x.k === 'folder').n, 2);
    const luc = { minus: { name: 'minus', L: 16 }, folder: { name: 'folder', L: 80 } };
    const mt = matchedLucide(X, luc);
    assert.deepEqual(mt.map((m) => m.c), ['minus', 'folder'], 'sorted by our line ÷ theirs, heaviest first; plus has no reference here');
    near(mt[1].r24, 64 / 80, 1e-9);
    near(mt.find((m) => m.c === 'minus').r24, 16 / 16, 1e-9, 'our minus line at 24 is 16 units, as long as the reference');
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

// ── the §3 lists, on hand-made contexts ────────────────────────────────────
function fakeX(rows, { twins = {}, patch = {} } = {}) {
  const o16 = rows.map((r) => ({ master: 16, style: 'outline', name: r.c, concept: r.c, strokeInk: r.area, Lw: r.Lw ?? r.area, ...r }));
  return {
    med: { '16outline': 10 }, byMS: (m, s) => (m === 16 && s === 'outline' ? o16 : []),
    twins: (c) => twins[c] ?? [], get: (c) => ({ L: 10 }), patch: { get: (c) => ({ patch3: patch[c] ?? 0.5, squint: 0.4 }) },
    kinds: Object.fromEntries(rows.map((r) => [r.c, { 16: 'mark' }])),
  };
}
test('denseRows / hairRows: thresholds at 1.5× and 0.5× the median, twins and flips listed once', () => {
  const X = fakeX([{ c: 'a', area: 4 }, { c: 'b', area: 10 }, { c: 'g', area: 16 }, { c: 'g-2', area: 15.5 }, { c: 'lang', area: 16 }, { c: 'h', area: 14.9 },
    { c: 'chevron-down', area: 4.97 }, { c: 'chevron-up', area: 4.99 }, { c: 'chevron-up-2', area: 3 }, { c: 'g-3', area: 10 }], { twins: { g: ['lang', 'g-3'], lang: ['g', 'g-3'], 'g-3': ['g', 'lang'] } });
  const d = denseRows(X, {});
  assert.deepEqual(d.dense.map((x) => x.concept), ['g', 'lang', 'g-2']); assert.deepEqual(d.out.map((x) => x.d.concept), ['g', 'g-2']);
  assert.deepEqual(d.out[0].tw, ['lang', 'g-3']); assert.equal(d.out[0].e.sibs.map((x) => x.concept).join(), 'g-2', 'a twin (g-3, same stem, same drawing) is not a sibling');
  const h = hairRows(X, {});
  assert.deepEqual(h.hair.map((x) => x.concept), ['chevron-up-2', 'a', 'chevron-down', 'chevron-up']);
  assert.deepEqual(h.out.map((x) => x.grp.map((y) => y.concept).join('+')), ['chevron-up-2', 'a', 'chevron-down+chevron-up']);
});
test('crowdedRows: line on line (< 0.90) or a knot (≥ 0.90), sorted by the overlap; 0.85–0.90 reported apart', () => {
  const X = fakeX([{ c: 'p', area: 9, Lw: 10 }, { c: 'q', area: 8, Lw: 10 }, { c: 'r', area: 10, Lw: 10 }, { c: 's', area: 10, Lw: 10 }, { c: 't', area: 8.7, Lw: 10 }], { patch: { r: 0.95, s: 0.87 } });
  const cr = crowdedRows({ ...X, get: (c, m) => X.byMS(16, 'outline').find((x) => x.concept === c) });
  assert.deepEqual(cr.body.map((x) => x.c), ['q', 't', 'r'], 'p sits exactly at 0.90 and is not crowded; t at 0.87 is');
  assert.deepEqual(cr.near.map((x) => x.concept), ['s']);
  const ws = weldStats(X, 16); assert.equal(ws.below, 2); assert.deepEqual(ws.w.map((v) => Math.round(v * 100) / 100), [0.9, 0.8, 1, 1, 0.87]);
});

// ── the command line ───────────────────────────────────────────────────────
test('CLI: a section prints its heading on a fake pin; bad sections and pins exit 2', () => {
  const pin = fakePin();
  try {
    const run = (...a) => spawnSync(process.execPath, [join(HERE, 'mass-probe.mjs'), ...a], { encoding: 'utf8' });
    const ok = run(pin, 's2.1', 's7', '--jobs', '1');
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^## §2\.1 Ink by master and style$/m); assert.match(ok.stdout, /^## §7 Noticed in passing$/m);
    assert.match(ok.stdout, /\| 16 \| outline \|/); assert.match(ok.stdout, /name-sets with identical path data .*: 1 · 3 · 6/);
    assert.equal(run(pin, 'nosuch').status, 2);
    assert.equal(run(join(pin, 'missing')).status, 2);
    assert.equal(run().status, 2);
    assert.equal(readdirSync(pin).join(), 'src', 'the probe wrote nothing into the pin');
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

// ── behaviours a reviewer found unpinned (2026-10-08) ──────────────────────
test('bugScope: a file is "changed" above 0.05 px² and "big" above 0.5', () => {
  const blank = () => new Array(256).fill(0);
  const row = (key, d) => ({ key, master: 16, style: 'filled', hasArea: true, trigger: true, area: 50, c: { area: 50 - d, cov: blank() }, cov: blank() });
  const b = bugScope({ rows: [row('16/a', 0.1), row('16/b', 0.6), row('16/c', 0.04)] });
  assert.equal(b.groups[2].changed, 2, '0.1 and 0.6 move; 0.04 does not'); assert.equal(b.groups[2].big, 1);
  assert.equal(b.trigChanged, 2); assert.equal(b.trigSame, 1);
});
test('seedPairs: only a raw cosine ≥ 0.9999 is "the same drawing"; 0.995 is not', () => {
  const a = new Array(256).fill(0); for (let i = 0; i < 100; i++) a[i] = 1;
  const b = [...a]; b[200] = 1;                                      // cosine with a = 100 / √(100·101) ≈ 0.995
  const rows = [['p', a], ['q', b], ['r', [...a]]].map(([c, cov]) => ({ master: 16, style: 'outline', concept: c, cov }));
  const sp = seedPairs({ rows }, 'outline');
  assert.ok(cosine(a, b) > 0.99 && cosine(a, b) < 0.9999);
  assert.equal(sp.total, 3); assert.equal(sp.identical, 1, 'p ≡ r only');
});
test('loadLucide: cubic and quadratic Bézier letters are both counted; a filled file is skipped', () => {
  const refs = mkdtempSync(join(tmpdir(), 'mass-probe-refs-'));
  try {
    mkdirSync(join(refs, 'lucide'));
    writeFileSync(join(refs, 'lucide', 'a.svg'), '<svg><path d="M2 12C2 6 12 6 12 12"/><path d="M2 18q5 -4 10 0"/></svg>');
    writeFileSync(join(refs, 'lucide', 'b.svg'), '<svg><path d="M2 2c1 1 2 1 3 0"/><rect x="1" y="1" width="2" height="2" fill="red"/></svg>');
    const L = loadLucide(refs);
    assert.equal(L.files, 2); assert.equal(L.rows.length, 1); assert.deepEqual(L.skipped, ['b.svg']);
    assert.deepEqual(L.bezier, { cubic: 1, quadratic: 1 }); assert.deepEqual(L.bezierAll, { cubic: 2, quadratic: 1 });
  } finally { rmSync(refs, { recursive: true, force: true }); }
});
test('sigmaSweep: the kernel reaches ceil(3σ) pixels either side', () => {
  const lone = new Array(256).fill(0); lone[8 * 16 + 8] = 1; const solid = new Array(256).fill(1);
  const rows = ['outline', 'filled'].flatMap((style) => [{ master: 16, style, cov: lone, area: 1 }, { master: 16, style, cov: solid, area: 256 }]);
  const res = sigmaSweep({ rows });
  for (const sg of [1, 1.5, 2]) near(res[sg].outline.spread, 1 / gaussKernel(sg, Math.ceil(3 * sg))[Math.ceil(3 * sg)] ** 2, 1e-9, `σ ${sg}`);
  assert.ok(Math.abs(res[1].outline.spread - 1 / gaussKernel(1, 2)[2] ** 2) > 0.05, 'a narrower kernel would read differently');
  assert.ok(res[2.5].outline.spread > res[2].outline.spread, 'at σ 2.5 the 8-pixel reach also dims the solid tile');
});
test('driftOf: each master against the 24, per concept', () => {
  const share = { 24: 0.1, 20: 0.12, 16: 0.15 };
  const d = driftOf({ concepts: ['a'], get: (c, m) => ({ ofCanvas: share[m] }) }, 'outline');
  near(d[0].r16, 1.5, 1e-12); near(d[0].r20, 1.2, 1e-12);
});
test('lensWidth: two arcs between two tips, measured across the tip-to-tip line', () => {
  const r = 22.25, half = Math.hypot(5.75, 5.75) / 2, sag = r - Math.sqrt(r * r - half * half);
  near(lensWidth('M7.625 8.375A22.25 22.25 0 0 1 13.375 2.625A22.25 22.25 0 0 1 7.625 8.375Z'), 2 * sag, 1e-3);
  near(lensWidth('M0 0A5 5 0 0 1 8 0A5 5 0 0 1 0 0Z'), 2 * (5 - 3), 1e-3, 'two arcs of radius 5 on an 8 chord: sagitta 2 each');
});
