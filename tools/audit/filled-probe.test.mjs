// Tests for filled-probe.mjs — synthetic fixtures only (hand-built SVG texts and a tiny fake pin).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  parseDrawing, inkOf, boxDelta, growsOf, matchSegments, cornerPairs, derivedOf, pairRecord,
  clearance, inkGeometry, enclosedOf, silhouetteOf, piecesOf, legRow, chevronVariant, SECTIONS,
  closesAirOf, ringRowsOf, areaCornersOf, boxBands, pinDigest,
} from './filled-probe.mjs';
import * as radii from './radii.mjs';
import * as raster from './raster.mjs';

const PROBE = join(dirname(fileURLToPath(import.meta.url)), 'filled-probe.mjs');
const svg = (c, w, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c} ${c}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
const area = (d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;
const line = (d) => `<path d="${d}"/>`;

// a bar: outline 1.5 at 24, filled (line-heavy) 2.5, grows by half the weight step top and bottom
const BAR_O = svg(24, 1.5, line('M3.75 12h16.5'));
const BAR_F = svg(24, 2.5, `<!-- grows: 0 0 0.5 0.5 -->\n${line('M4.25 12h15.5')}`);
// a rounded square: outline centreline r2.5, filled contour r3.25 (= 2.5 + 0.75), punched with a 2 × 2 hole
const SQ_O = svg(24, 1.5, line('M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z'));
const SQ_F = svg(24, 1.5, area('M6.25 3H17.75A3.25 3.25 0 0 1 21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3ZM11 11H13V13H11Z'));
// a ring against a solid disc of the same outer radius
const RING_O = svg(24, 1.5, line('M5.75 12A6.25 6.25 0 1 0 18.25 12A6.25 6.25 0 1 0 5.75 12Z'));
const RING_F = svg(24, 1.5, area('M5 12A7 7 0 1 0 19 12A7 7 0 1 0 5 12Z'));
// a chevron: outline legs at 45°, filled legs flatter (the leg angle moves)
const CHEV_O = svg(24, 1.5, line('M6 9L12 15L18 9'));
const CHEV_F = svg(24, 2.5, line('M6.25 9.5L12 14.5L17.75 9.5'));

test('parseDrawing splits area from stroke and takes the weight from the presence of areas', () => {
  const a = parseDrawing(SQ_F, 'sq-filled', 24), b = parseDrawing(BAR_F, 'bar-filled', 24), c = parseDrawing(BAR_O, 'bar', 16);
  assert.equal(a.areas.length, 1); assert.equal(a.ds.length, 0); assert.equal(a.stroke, 1.5);
  assert.equal(b.areas.length, 0); assert.equal(b.ds.length, 1); assert.equal(b.stroke, 2.5);
  assert.equal(c.stroke, 1.25);
});

test('inkOf grows a centreline by half the weight; boxDelta reads the filled growth per side', () => {
  const o = inkOf(parseDrawing(BAR_O, 'bar', 24)), f = inkOf(parseDrawing(BAR_F, 'bar-filled', 24));
  assert.deepEqual([o.x0, o.x1, o.y0, o.y1], [3, 21, 11.25, 12.75]);
  const d = boxDelta(o, f);
  assert.deepEqual(d, { l: 0, r: 0, t: 0.5, b: 0.5 });
});

test('boxDelta: positive where the filled ink stands proud, on each side', () => {
  const o = { x0: 3, y0: 3, x1: 21, y1: 21 }, f = { x0: 2.5, y0: 3.25, x1: 21.5, y1: 20 };
  assert.deepEqual(boxDelta(o, f), { l: 0.5, r: 0.5, t: -0.25, b: -1 });
});

test('matchSegments: an area edge half a stroke off the centreline matches; a 45° crossing does not', () => {
  const o = parseDrawing(svg(24, 1.5, line('M3 12H21')), 'bar', 24);
  const slab = matchSegments(o, parseDrawing(svg(24, 1.5, area('M3 10.5H21V13.5H3Z')), 'bar-filled', 24), { minLength: 0.75 });
  const long = slab.filter((r) => r.lenFil > 10);
  assert.equal(long.length, 2);
  assert.ok(long.every((r) => !r.unmatched && r.delta === 0), JSON.stringify(long));
  const cross = matchSegments(o, parseDrawing(svg(24, 2.5, line('M8 8L16 16')), 'bar-filled', 24), { minLength: 0.75 });
  assert.ok(cross[0].unmatched, JSON.stringify(cross));
});

test('growsOf reads lint\'s note and flags a bad one', () => {
  assert.deepEqual(growsOf('<!-- grows: 0 0 0.5 0.5 -->'), { l: 0, r: 0, t: 0.5, b: 0.5, raw: '0 0 0.5 0.5' });
  assert.equal(growsOf('<!-- prose about no grows: here -->'), null);
  assert.equal(growsOf('<!-- grows: 1 2 -->').bad, true);
});

test('matchSegments pairs a filled edge with the centreline it offsets, and flags a lone one', () => {
  const o = parseDrawing(SQ_O, 'sq', 24), f = parseDrawing(SQ_F, 'sq-filled', 24);
  const rows = matchSegments(o, f, { minLength: 0.75 });
  const matched = rows.filter((r) => !r.unmatched);
  assert.ok(matched.length >= 4);
  assert.ok(matched.every((r) => r.delta === 0));
  // the 2 × 2 hole's edges are parallel to the outline's sides but 8 units in: no centreline offsets them
  assert.equal(rows.filter((r) => r.unmatched).length, 4);
  const tilted = parseDrawing(svg(24, 1.5, area('M3 3L21 4L21 5.5L3 4.5Z')), 'x-filled', 24);
  const t = matchSegments(parseDrawing(svg(24, 1.5, line('M3.75 3.75L20.25 3.75')), 'x', 24), tilted, { minLength: 0.75 });
  assert.ok(t.some((r) => !r.unmatched && r.delta > 3));
});

test('derivedOf: a filled corner is the centreline radius plus (outer) or minus (inner) half the outline stroke', () => {
  assert.deepEqual(derivedOf(3.25, 2.5, 24), { side: 'outer', delta: 0 });
  assert.deepEqual(derivedOf(0.75, 1.5, 24), { side: 'inner', delta: 0 });
  assert.deepEqual(derivedOf(3.25, 2.5, 16), { side: 'outer', delta: 0.125 });   // the 1.5-era offset at 16
});

test('cornerPairs matches each filled corner to its outline corner', () => {
  const rows = cornerPairs(radii.iconFromSource(SQ_O, { file: 'sq.svg' }), radii.iconFromSource(SQ_F, { file: 'sq-filled.svg' }), 24);
  const outer = rows.filter((r) => r.rFilled === 3.25);
  assert.equal(outer.length, 4);
  assert.ok(outer.every((r) => r.rOutline === 2.5 && derivedOf(r.rFilled, r.rOutline, 24).delta === 0));
});

test('clearance is the distance to the nearest ink, less half a stroke', () => {
  const geo = inkGeometry(raster.iconFromText(svg(24, 2, line('M2 12H22')), 't'));
  assert.ok(Math.abs(clearance(12, 15, geo) - 2) < 1e-9);
  assert.ok(clearance(12, 12, geo) < 0);
});

test('enclosedOf measures an enclosed hole by its largest inscribed circle and ignores open air', () => {
  const r = enclosedOf(SQ_F, 'sq');
  assert.equal(r.regions.length, 1);
  // a square hole: the continuous maximum is its side; `width` is the median over the ridge, which on
  // a square runs down the diagonals (the original's definition, built for bars)
  assert.ok(Math.abs(r.regions[0].widthMax - 2) < 0.01, `widthMax ${r.regions[0].widthMax}`);
  assert.ok(r.regions[0].width < 2);
  const bar = enclosedOf(svg(24, 1.5, area('M3 3H21V21H3ZM8 11H16V13H8Z')), 'slot');   // a 2-wide slot: its spine is the ridge
  assert.ok(Math.abs(bar.regions[0].width - 2) < 0.01, `slot width ${bar.regions[0].width}`);
  assert.equal(enclosedOf(RING_F, 'disc').regions.length, 0);
  const ring = enclosedOf(RING_O, 'ring');           // the outline ring's counter: 2 × (6.25 − 0.75)
  assert.ok(Math.abs(ring.regions[0].width - 11) < 0.01, `width ${ring.regions[0].width}`);
});

test('silhouetteOf: a ring and a solid disc share an outer region but not their ink', () => {
  const s = silhouetteOf(RING_O, RING_F, 'ring');
  assert.ok(s.iou > 0.99);
  assert.ok(s.outlineOnly + s.filledOnly < 0.5);
  assert.equal(s.encOutAreas.length, 1);
  assert.equal(s.encFilAreas.length, 0);
  assert.ok(s.inkFil > s.inkOut * 2);
  const both = svg(24, 1.5, `${area('M3 3H9V9H3Z')}\n${line('M3 3H9V9H3Z')}`);
  assert.equal(silhouetteOf(RING_O, both, 'dup').dupPaths, 1);
});

test('piecesOf counts separate pieces of ink', () => {
  assert.equal(piecesOf(svg(24, 1.5, `${area('M3 3H9V9H3Z')}\n${area('M12 3H18V9H12Z')}`), 'two'), 2);
  assert.equal(piecesOf(RING_O, 'one'), 1);
});

test('legRow reads the leg angle a filled chevron gives up, and skips shape-filled pairs', () => {
  const r = legRow(CHEV_O, CHEV_F, 'chev', 24);
  assert.ok(r && r.worst > 3, JSON.stringify(r));
  assert.equal(legRow(SQ_O, SQ_F, 'sq', 24), null);
  // a shape-filled twin with the same segment structure is still not a leg pair
  assert.equal(legRow(svg(24, 1.5, line('M3.75 3.75H20.25V20.25H3.75Z')), svg(24, 1.5, area('M3 3H21V21H3Z')), 'box', 24), null);
  assert.equal(legRow(CHEV_O, CHEV_O.replace('stroke-width="1.5"', 'stroke-width="2.5"'), 'chev', 24).worst, 0);
});

test('chevronVariant groups chevrons by shape number', () => {
  assert.equal(chevronVariant('chevron-down'), '-1(classic)');
  assert.equal(chevronVariant('chevron-left-2-small'), '-2');
  assert.equal(chevronVariant('chevrons-up-down-3'), '-3');
  assert.equal(chevronVariant('chevrons-up-down'), '-1(classic)');
});

test('pairRecord: box, notes and class on a line-heavy pair', () => {
  const d = pairRecord(BAR_O, BAR_F, 'bar', 24);
  assert.equal(d.klass, 'line-heavy');
  assert.equal(d.maxDelta, 0.5);
  assert.equal(d.growsCovers, true);
  const s = pairRecord(SQ_O, SQ_F, 'sq', 24);
  assert.equal(s.klass, 'shape-only');
  assert.equal(s.maxDelta, 0);
});

test('closesAirOf counts a pair only when the filled air is tighter than the outline\'s by more than 0.01', () => {
  const rec = (name, f, o) => ({ name, master: 24, klass: 'shape-only', air: { self: [], area: [{ kind: 'cut', gap: f }] }, airOutlineSelf: [{ gap: o }] });
  const rows = closesAirOf([rec('tighter', 1.5, 4), rec('within', 1.995, 2), rec('same', 2, 2), rec('wider', 3, 2)]);
  assert.deepEqual(rows.map((r) => r.name), ['tighter']);
});

test('ringRowsOf: a counter that shrank by exactly 2 × the weight step is a hit; one a unit off is not', () => {
  const disc = (d) => Math.PI * (d / 2) ** 2;
  const silh = [
    { name: 'ring', master: 24, encOutAreas: [disc(12.5)], encFilAreas: [disc(10.5)] },        // shrink 2.0 = 2 × (2.5 − 1.5)
    { name: 'off', master: 24, encOutAreas: [disc(12.5)], encFilAreas: [disc(11.5)] },         // shrink 1.0
    { name: 'cut', master: 24, encOutAreas: [disc(12.5)], encFilAreas: [disc(3)] },            // filled counter under 4: a cut
  ];
  const rows = ringRowsOf(silh, new Map([['24/ring', 'shape-only']]));
  assert.deepEqual(rows.map((r) => [r.name, r.hit]), [['ring', true], ['off', false]]);
  assert.equal(rows[0].klass, 'shape-only');
});

test('areaCornersOf keeps matched AREA corners only', () => {
  const pairs = [{ name: 'p', master: 24, corners: [
    { style: 'area', role: 'container', rFilled: 3.25, rOutline: 2.5 },
    { style: 'stroke', role: 'bend', rFilled: 1.25, rOutline: 0.75 },
    { style: 'area', role: 'detail', rFilled: 0.5, rOutline: null }] }];
  const rows = areaCornersOf(pairs);
  assert.equal(rows.length, 1);
  assert.deepEqual([rows[0].side, rows[0].delta], ['outer', 0]);
});

test('boxBands splits at 0.0005 and 0.01', () => {
  const D = [0, 0.001, 0.003, 0.01, 0.011, 0.5].map((maxDelta, i) => ({ name: `n${i}`, maxDelta, grows: i === 5 ? { raw: 'x' } : null }));
  const b = boxBands(D);
  assert.deepEqual([b.exact.length, b.tiny.length, b.declared.length, b.undeclared.length], [1, 3, 1, 1]);
});

test('cornerPairs never pairs corners that turn opposite ways', () => {
  // the same rounded square as SQ_F, drawn the other way round: every corner turns the other way
  const rev = svg(24, 1.5, area('M6.25 3A3.25 3.25 0 0 0 3 6.25V17.75A3.25 3.25 0 0 0 6.25 21H17.75A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3Z'));
  const rows = cornerPairs(radii.iconFromSource(SQ_O, { file: 'sq.svg' }), radii.iconFromSource(rev, { file: 'sq-filled.svg' }), 24);
  assert.equal(rows.filter((r) => r.rFilled === 3.25).length, 4);
  assert.ok(rows.every((r) => r.rOutline === null), JSON.stringify(rows));
});

test('silhouetteOf: IoU is intersection over union', () => {
  const half = svg(24, 1.5, area('M3 3H21V12H3Z')), whole = svg(24, 1.5, area('M3 3H21V21H3Z'));
  const s = silhouetteOf(half, whole, 'iou');
  assert.ok(Math.abs(s.iou - 0.5) < 0.01, `iou ${s.iou}`);
  assert.ok(Math.abs(s.filledOnly - 162) < 0.5 && s.outlineOnly === 0);
});

test('enclosedOf drops a hole under 16 lattice cells as flattening noise', () => {
  const r = enclosedOf(svg(24, 1.5, area('M3 3H21V21H3ZM11.95 11.95H12.1V12.1H11.95Z')), 'pin-hole');
  assert.equal(r.regions.length, 0);
  assert.equal(r.droppedSmall, 1);
});

test('CLI on a fake pin: a section heading prints; unknown section and bad pin exit 2', () => {
  const pin = mkdtempSync(join(tmpdir(), 'filled-probe-'));
  try {
    // `nudge`'s filled top edge sits 0.005 low (inside lint's 0.01) at 24 and 20; at 16 the 1.25 outline moves it out
    const files = { bar: [BAR_O, BAR_F], sq: [SQ_O, SQ_F], ring: [RING_O, RING_F], 'chevron-down': [CHEV_O, CHEV_F],
      nudge: [SQ_O, svg(24, 1.5, area('M3 3.005H21V21H3Z'))] };
    for (const m of [24, 20, 16]) {
      mkdirSync(join(pin, 'src/icons', String(m)), { recursive: true });
      for (const [n, [o, f]] of Object.entries(files)) {
        writeFileSync(join(pin, 'src/icons', String(m), `${n}.svg`), o);
        writeFileSync(join(pin, 'src/icons', String(m), `${n}-filled.svg`), f);
      }
    }
    const ok = spawnSync(process.execPath, [PROBE, pin, 's1', 's2.2', 's5.7'], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /## §1 The ink box/);
    assert.match(ok.stdout, /\| Any side differs by > 0\.01 \| \d+ \| \d+ \|/);
    assert.match(ok.stdout, /\| …note matches the drawings to 0\.01 \| 1 \| 1 \|/);   // bar at 24 only
    assert.match(ok.stdout, /the band lint cannot see \(0\.0005–0\.01\): 2 pairs on 1 concepts/);
    assert.match(ok.stdout, /## §2\.2 The bent-mark leg angle/);
    assert.match(ok.stdout, /## §5\.7 Path counts/);
    // a cache is stamped with the pin's digest and refused for any other pin
    const cache = join(pin, 'cache');
    const c1 = spawnSync(process.execPath, [PROBE, pin, 's5.7', '--cache', cache], { encoding: 'utf8' });
    assert.equal(c1.status, 0, c1.stderr);
    const before = pinDigest(join(pin, 'src/icons'));
    writeFileSync(join(pin, 'src/icons/24/bar.svg'), BAR_O.replace('M3.75 12h16.5', 'M3.75 12h16'));
    assert.notEqual(pinDigest(join(pin, 'src/icons')), before);
    const c2 = spawnSync(process.execPath, [PROBE, pin, 's5.7', '--cache', cache], { encoding: 'utf8' });
    assert.equal(c2.status, 2);
    assert.match(c2.stderr, /not made from this pin/);
    const bad = spawnSync(process.execPath, [PROBE, pin, 'nope'], { encoding: 'utf8' });
    assert.equal(bad.status, 2);
    const nopin = spawnSync(process.execPath, [PROBE, join(pin, 'missing')], { encoding: 'utf8' });
    assert.equal(nopin.status, 2);
    assert.ok(SECTIONS.includes('s4.3') && SECTIONS.includes('s8'));
  } finally { rmSync(pin, { recursive: true, force: true }); }
});
