// Tests for tools/audit/fluent-probe.mjs — synthetic fixtures only (hand-built paths, a fake pin and a
// fake references folder in a temp directory). No scratch paths, no real pin, no research/, no network.
//   node --test tools/audit/fluent-probe.test.mjs

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  measureDrawing, sampleFromCatalogue, orphans, lossLadder, rescale, angDrift, pairBox, keylineLanding, markRatio,
  radiusSteps, triHold, gapsOf, parseOurSvg, fluentKeylines, lineGrowth, strokeLadder, fluentDrawings, readFluentDocs,
  floors, med, qq, minMargin, CIRC_GENUINE, regularLadder, plausibleDeaths, edgeConcepts, bottomDecile, marginShares, pairBoxTable,
  BOX_EQUALITY, filledBoxLine, fluentGapRows, flattenCurves, bezierAt, mergeReadings, LABEL_S, LABEL_T, pctW, pctX,
} from './fluent-probe.mjs';
import { bbox } from '../geometry.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const rect = (x, y, w, h) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
const tmp = mkdtempSync(join(tmpdir(), 'fluent-probe-'));
after(() => rmSync(tmp, { recursive: true, force: true }));

test('measureDrawing: path box, margins, subpath and command counts; a stroke grows by half its weight', () => {
  const a = measureDrawing({ paths: [{ d: rect(2, 3, 10, 8), style: 'area' }], canvas: 16, stroke: 1, label: 'a' });
  assert.deepEqual(a.ink, { x: 2, y: 3, w: 10, h: 8 });
  assert.deepEqual(a.margin, { l: 2, t: 3, r: 4, b: 5 });
  assert.equal(minMargin(a), 2);
  assert.equal(a.nSubs, 1);
  assert.equal(a.nCmds, 5);
  assert.equal(a.angles.maxDev, 0);
  const s = measureDrawing({ paths: [{ d: 'M4 8H12', style: 'stroke' }], canvas: 16, stroke: 2, label: 's' });
  assert.deepEqual(s.ink, { x: 3, y: 7, w: 10, h: 2 });
  const two = measureDrawing({ paths: [{ d: rect(1, 1, 2, 2) + rect(4, 4, 10, 10), style: 'area' }], canvas: 16, stroke: 1, label: 't' });
  assert.equal(two.nSubs, 2);
  assert.deepEqual(two.subs[0], { w: 10, h: 10, x: 4, y: 4 }, 'subpaths come biggest first');
});

test('sampleFromCatalogue: size distribution, the seven-size set and an even spread in page order', () => {
  const row = (name, n) => [null, name, '', 1, n * 2, `Size:${n}|Theme:2`, 24, 24, name];
  const cat = { page: { id: 'p', name: 'System icons' }, file: { key: 'k' }, at: 't',
    rows: [row('A', 7), row('B', 3), row('C', 1), row('D', 4), row('E', 7), row('F', 6), row('G', 5), row('A', 2)] };
  const S = sampleFromCatalogue(cat, 2);
  assert.equal(S.sets, 8);
  assert.equal(S.names, 7);
  assert.deepEqual(S.dist, { 7: 2, 3: 1, 1: 1, 4: 1, 6: 1, 5: 1, 2: 1 });
  assert.deepEqual(S.all7, ['A', 'E']);
  assert.equal(S.band, 4);                       // B D F G
  assert.deepEqual(S.spread36, ['D', 'G']);      // indices floor((k + 0.5) × 4 / 2) = 1 and 3 of [B, D, F, G]
});

// A concept drawn at 24 with a body and two dots, and at 20 with the body and one dot.
const at = (k) => (v) => Math.round(v * k * 1000) / 1000;
function deathRows() {
  const k = at(20 / 24);
  const big = measureDrawing({ paths: [{ d: rect(4, 4, 16, 8) + rect(6, 16, 1.5, 1.5) + rect(16, 16, 1.5, 1.5), style: 'area' }], canvas: 24, stroke: 1.5, label: 'x24' });
  const small = measureDrawing({ paths: [{ d: rect(k(4), k(4), k(16), k(8)) + rect(k(6), k(16), k(1.5), k(1.5)), style: 'area' }], canvas: 20, stroke: 1.5, label: 'x20' });
  return [{ concept: 'X', size: 24, style: 'outline', ...big }, { concept: 'X', size: 20, style: 'outline', ...small }];
}

test('orphans: the part with no counterpart one size down dies; its thin side is rescaled to the small canvas', () => {
  const { died, kept } = orphans(deathRows(), [16, 20, 24]);
  assert.equal(died.length, 1);
  assert.equal(kept.length, 2);
  assert.equal(died[0].step, '24->20');
  assert.equal(died[0].minSideBig, 1.5);
  assert.equal(died[0].minSideAtSmallScale, 1.25);
  assert.equal(died[0].minSideCanvas, 1.5 / 24);
  // a part that moves across the canvas is not the same part, however few parts there are
  const far = [{ concept: 'Y', size: 24, style: 'outline', ...measureDrawing({ paths: [{ d: rect(2, 2, 2, 2), style: 'area' }], canvas: 24, stroke: 1.5, label: 'y24' }) },
    { concept: 'Y', size: 20, style: 'outline', ...measureDrawing({ paths: [{ d: rect(16, 16, 2, 2), style: 'area' }], canvas: 20, stroke: 1.5, label: 'y20' }) }];
  assert.equal(orphans(far, [16, 20, 24]).died.length, 1);
});

test('lossLadder: a step where the subpath count falls is counted once per concept', () => {
  const L = lossLadder(deathRows(), [16, 20, 24]);
  assert.deepEqual(L.get('24->20'), { pairs: 1, lost: 1 });
  const gained = deathRows().map((d) => ({ ...d, nSubs: d.size === 24 ? 2 : 3 }));
  assert.deepEqual(lossLadder(gained, [16, 20, 24]).get('24->20'), { pairs: 1, lost: 0 }, 'a gained part is not a loss');
});

test('rescale: a pure rescale is found; a redraw is not', () => {
  const r = (concept, size, w, h) => ({ concept, size, style: 'outline', ink: { w, h } });
  const rows = [r('A', 24, 18, 12), r('A', 20, 15, 10), r('B', 24, 18, 12), r('B', 20, 16, 10)];
  const R = rescale(rows, 24, 20);
  assert.equal(R.n, 2);
  assert.equal(R.exact, 1);
  assert.equal(R.errMed, 0.5);
});

test('angDrift: only concepts on-axis at their biggest size count; a tilt below it is caught', () => {
  const r = (concept, size, maxDev) => ({ concept, size, style: 'outline', angles: { maxDev } });
  const rows = [r('A', 24, 0), r('A', 16, 1.2), r('B', 24, 0), r('B', 16, 0), r('C', 24, 3), r('C', 16, 0)];
  const A = angDrift(rows, [16, 20, 24]);
  assert.equal(A.n, 2);
  assert.equal(A.at[16].still, 0.5);
  assert.equal(A.at[16].max, 1.2);
});

test('pairBox: identical, grows, shrinks — and a Light record lands in the outline map, last one winning', () => {
  const r = (concept, style, w, h) => ({ concept, size: 16, style, ink: { w, h } });
  const rows = [r('A', 'outline', 10, 10), r('A', 'filled', 10, 10), r('B', 'outline', 10, 10), r('B', 'filled', 10.5, 10.5),
    r('C', 'outline', 10, 10), r('C', 'filled', 9, 10), r('D', 'outline', 10, 10), r('D', 'filled', 10, 10), r('D', 'light', 12, 12)];
  const P = pairBox(rows, 16);
  assert.deepEqual([P.n, P.same, P.grow, P.shrink], [4, 1, 1, 2]);
  assert.deepEqual(P.differ, ['B', 'C', 'D']);
});

test('keylineLanding: past / on the circle / between / on the square / under', () => {
  const r = (w) => ({ size: 16, style: 'outline', ink: { w, h: 1 } });
  const L = keylineLanding([r(15), r(14), r(13), r(12), r(10)], 16, { circle: 14, square: 12 });
  assert.deepEqual([L.n, L.past, L.circle, L.between, L.square, L.under], [5, 0.2, 0.2, 0.2, 0.2, 0.2]);
});

test('markRatio: the mark over the container, the container\'s own inner contour left out', () => {
  const subs = [{ x: 2, y: 2, w: 20, h: 20 }, { x: 3.5, y: 3.5, w: 17, h: 17 }, { x: 7, y: 11, w: 10, h: 2 }, { x: 11, y: 7, w: 2, h: 10 }];
  assert.equal(markRatio([{ concept: 'Add Circle', size: 24, style: 'outline', subs }], 'Add Circle', 24), 0.5);
});

test('radiusSteps: quantised, caps and near-zero radii left out, commonest first', () => {
  const corners = { radii: [{ r: 0.75, role: 'bend' }, { r: 0.74, role: 'bend' }, { r: 2.5, role: 'container' }, { r: 0.75, role: 'cap' }, { r: 0.01, role: 'bend' }] };
  const R = radiusSteps([{ size: 24, style: 'outline', corners }], 24, 4);
  assert.equal(R.n, 3);
  assert.deepEqual(R.top[0], { r: 0.75, share: 2 / 3 });
  assert.equal(R.top[1].r, 2.5);
});

test('triHold: a trio holding its command count exactly', () => {
  const r = (concept, size, nCmds) => ({ concept, size, nCmds, nSubs: 1, ink: { w: size * 0.75, h: size * 0.5 } });
  const T = triHold([r('A', 16, 10), r('A', 20, 10), r('A', 24, 10), r('B', 16, 10), r('B', 20, 12), r('B', 24, 10)]);
  assert.equal(T.n, 2);
  assert.equal(T.cmdsExact, 0.5);
  assert.equal(T.spreadMed, 0);
});

test('gapsOf: a punched line reads as a cut of its width; an island bar reads as material', () => {
  const cut = gapsOf({ ds: [], areas: [rect(0, 0, 16, 16) + ' ' + rect(2, 7.5, 12, 1)], stroke: 1, canvas: 16 });
  assert.deepEqual(cut.air, [{ kind: 'cut', gap: 1 }]);
  assert.deepEqual(gapsOf({ ds: [], areas: [rect(2, 2, 5, 12), rect(8, 2, 5, 12)], stroke: 1, canvas: 16 }).air, [{ kind: 'separation', gap: 1 }]);
  const island = gapsOf({ ds: [], areas: [rect(0, 0, 10, 10) + rect(1, 1, 8, 8) + rect(3, 4.5, 4, 1)], stroke: 1, canvas: 16 });
  assert.equal(island.material, 1);
  const G = [{ size: 16, style: 'filled', ...cut, material: 1.5 }, { size: 16, style: 'filled', air: [{ kind: 'separation', gap: 0.5 }], selfAir: [1.25], material: null }];
  const F = floors(G, 16, 'filled');
  assert.deepEqual(F.material, [1.5]);
  assert.deepEqual(F.kinds, { cut: [1], separation: [0.5], selfLine: [1.25] });
});

test('gapsOf: the window scales with the canvas — a 2-wide cut is read at 48, not at 16', () => {
  const area = [rect(0, 0, 40, 40) + ' ' + rect(4, 19, 32, 2)];
  assert.deepEqual(gapsOf({ ds: [], areas: area, stroke: 2.5, canvas: 48 }).air, [{ kind: 'cut', gap: 2 }]);
  assert.deepEqual(gapsOf({ ds: [], areas: area, stroke: 1, canvas: 16 }).air, []);
});

test('parseOurSvg: an area is stroke="none" + fill; a shape-filled file keeps the outline weight', () => {
  const area = '<svg viewBox="0 0 24 24" stroke-width="2.5"><path fill="currentColor" stroke="none" d="M2 2H6V6H2Z"/><path d="M8 8H12"/></svg>';
  const A = parseOurSvg(area, 24);
  assert.equal(A.hasAreas, true);
  assert.equal(A.stroke, 1.5);
  assert.deepEqual(A.paths.map((p) => p.style), ['area', 'stroke']);
  const line = parseOurSvg('<svg viewBox="0 0 24 24" stroke-width="2.5"><path d="M8 8H12"/></svg>', 24);
  assert.equal(line.stroke, 2.5);
});

test('fluentKeylines: the commonest circle-container width, and the Square concept\'s filled width', () => {
  const r = (concept, style, w) => ({ concept, size: 16, style, ink: { w, h: w } });
  const rows = [r(CIRC_GENUINE[0], 'outline', 14), r(CIRC_GENUINE[1], 'outline', 14), r(CIRC_GENUINE[2], 'outline', 12), r('Square', 'filled', 12)];
  assert.deepEqual(fluentKeylines(rows)[16], { circle: 14, square: 12 });
});

test('lineGrowth: half the larger box delta, filled over outline', () => {
  const r = (style, w) => ({ concept: 'Add', size: 16, style, ink: { w, h: w } });
  assert.deepEqual(lineGrowth([r('outline', 12), r('filled', 12.5)], 'Add', [16, 20]), [0.25, null]);
});

test('regularLadder: the outline records\' first strokeBasis per size; filled rows do not count', () => {
  const r = (size, style, stroke) => ({ size, style, stroke });
  const L = regularLadder([r(16, 'filled', 9), r(16, 'outline', 1), r(16, 'outline', 1.5), r(24, 'outline', 1.5)]);
  assert.equal(L[16], 1);
  assert.equal(L[24], 1.5);
  assert.equal(L[12], undefined);
});

test('plausibleDeaths: under 6 strokes of the size it died at, and no further', () => {
  const reg = { 12: 1, 16: 1 };
  const died = [{ to: 12, minSideAtSmallScale: 0.75 }, { to: 16, minSideAtSmallScale: 5.99 }, { to: 16, minSideAtSmallScale: 6 }, { to: 12, minSideAtSmallScale: 9 }];
  assert.deepEqual(plausibleDeaths(died, reg).map((x) => x.minSideAtSmallScale), [0.75, 5.99]);
});

test('edgeConcepts: ink at the canvas edge (margin under 0.02), outline only, once per concept', () => {
  const r = (concept, size, style, l) => ({ concept, size, style, margin: { l, r: 3, t: 3, b: 3 } });
  const rows = [r('A', 16, 'outline', 0), r('A', 24, 'outline', 0.01), r('B', 16, 'outline', 0.5), r('C', 16, 'filled', 0), r('D', 12, 'outline', 0)];
  assert.deepEqual(edgeConcepts(rows, [16, 20, 24]), ['A']);
});

test('bottomDecile: the values at or under the index p10', () => {
  const v = [0.07, 0.5, 0.39, 1, 1, 1, 1.2, 1.5, 2, 2.5, 3];
  assert.deepEqual(bottomDecile(v), { p10: 0.39, lo: 0.07, hi: 0.39 });
});

test('marginShares: median min-margin over canvas, ours over theirs', () => {
  const r = (size, l) => ({ size, style: 'outline', margin: { l, r: 9, t: 9, b: 9 } });
  const M = marginShares([r(24, 2), r(16, 1)], [r(24, 3), r(16, 2)], [24, 16]);
  assert.deepEqual(M.theirs, [2 / 24, 1 / 16]);
  assert.deepEqual(M.ours, [3 / 24, 2 / 16]);
  assert.deepEqual(M.ratio, [1.5, 2]);
});

test('pairBoxTable: counts and shares per size, shrinks counted as shrinks', () => {
  const r = (concept, size, style, w) => ({ concept, size, style, ink: { w, h: 10 } });
  const T = pairBoxTable([r('A', 16, 'outline', 10), r('A', 16, 'filled', 10), r('B', 16, 'outline', 10), r('B', 16, 'filled', 9),
    r('C', 16, 'outline', 10), r('C', 16, 'filled', 11), r('D', 16, 'outline', 10), r('D', 16, 'filled', 8)], [16]);
  assert.deepEqual([T[0].n, T[0].same, T[0].grow, T[0].shrink], [4, 1, 1, 2]);
  assert.equal(T[0].shrinkShare, 0.5);
  assert.match(filledBoxLine(T), /identical in 25\.0%; grows in 25\.0–25\.0%; shrinks in 50\.0–50\.0% \(shrink counts 2\)/);
  assert.match(BOX_EQUALITY, /width and height agree within 0\.02; position ignored/);
});

test('flattenCurves: a cubic\'s box is the curve\'s, not its control polygon\'s (the geometry.mjs defect)', () => {
  const d = 'M0 0C0 10 10 10 10 0';
  assert.equal(bbox([d]).y1, 10, 'the instrument reads the control points');
  const b = bbox([flattenCurves(d)]);
  assert.ok(Math.abs(b.y1 - 7.5) < 0.005, `true height 7.5, got ${b.y1}`);
  assert.deepEqual([b.x0, b.x1, b.y0], [0, 10, 0]);
  // relative cubic, then S reflecting the last control point: the second arch dips to −7.5
  const s2 = bbox([flattenCurves('M0 0c0 10 10 10 10 0s10 -10 10 0')]);
  assert.ok(Math.abs(s2.y0 + 7.5) < 0.005 && Math.abs(s2.y1 - 7.5) < 0.005 && s2.x1 === 20, JSON.stringify(s2));
  // Q peaks at half its control height; T reflects it
  const q = bbox([flattenCurves('M0 0Q5 10 10 0T20 0')]);
  assert.ok(Math.abs(q.y1 - 5) < 0.005 && Math.abs(q.y0 + 5) < 0.005, JSON.stringify(q));
  // straight commands keep their geometry exactly, made absolute
  assert.equal(flattenCurves('M1 1h2v3l-1 1z'), 'M1 1L3 1L3 4L2 5Z');
  assert.deepEqual(bezierAt([[0, 0], [0, 10], [10, 10], [10, 0]], 0.5), [5, 7.5]);
});

test('measureDrawing: the box reads the true geometry `g`; the command count still reads the original `d`', () => {
  const d = 'M2 8C2 18 12 18 12 8Z';
  const m = measureDrawing({ paths: [{ d, g: flattenCurves(d), style: 'area' }], canvas: 16, stroke: 1, label: 'c' });
  assert.ok(Math.abs(m.ink.h - 7.5) < 0.005, `h ${m.ink.h}`);
  assert.equal(m.nCmds, 3);
  assert.equal(measureDrawing({ paths: [{ d, style: 'area' }], canvas: 16, stroke: 1, label: 'c' }).ink.h, 10);
});

test('mergeReadings: alike once; different twice, the instrument\'s reading first, both labelled', () => {
  assert.deepEqual(mergeReadings(['## §2 x', 'a 1', 'b'], ['## §2 x', 'a 2', 'b']), ['## §2 x', LABEL_S + 'a 1', LABEL_T + 'a 2', 'b']);
  assert.match(LABEL_S, /^as the instrument samples it/);
  assert.match(LABEL_T, /^true geometry/);
});

test('pctW and pctX: the document\'s own percent formats', () => {
  assert.deepEqual([pctW(1), pctW(0), pctW(0.95)], ['100%', '0%', '95.0%']);
  assert.deepEqual([pctX(2 / 24), pctX(0.1), pctX(1 / 16)], ['8.3%', '10.0%', '6.25%']);
});

test('med and qq: the card\'s median and index quantile', () => {
  assert.equal(med([3, 1, 2, 10]), 2.5);
  assert.equal(qq([5, 1, 4, 2, 3], 0.25), 2);
  assert.equal(qq([1, 2, 3, 4], 0.9), 4);
});

// ── a fake references folder and a fake pin ─────────────────────────────────────────────────────────
const refs = join(tmp, 'refs'), fig = join(refs, 'fluent', 'figma');
mkdirSync(fig, { recursive: true });
const rec = (name, master, style, d, sb = master < 24 ? 1 : 1.5) => ({
  name, master, style, canvas: [master, master], strokeBasis: { value: sb }, variant: { Theme: style === 'filled' ? 'Filled' : 'Regular' },
  meta: { axes: { Size: { values: ['16', '24'] } }, flags: {} }, measure: { ink: { w: { abs: 0 }, h: { abs: 0 } }, inkSource: 'render' },
  paths: [{ d, paint: 'fill' }] });
const doc = (name, records, page = 'System icons') => ({ schema: 's', source: 'fluent', page: { id: '1', name: page }, name, records });
writeFileSync(join(fig, 'catalogue.json'), JSON.stringify({ page: { id: '1124:9833', name: 'System icons' }, file: { key: 'K' }, at: 'T',
  rows: [[null, 'Add', '', 1, 4, 'Size:7|Theme:2', 24, 24, 'a'], [null, 'Box', '', 1, 6, 'Size:3|Theme:2', 24, 24, 'b'], [null, 'One', '', 1, 2, 'Size:1|Theme:2', 24, 24, 'c'],
    [null, 'One', '', 1, 2, 'Size:1|Theme:2', 24, 24, 'd']] }));
writeFileSync(join(fig, 'calibration.json'), JSON.stringify({ table: {} }));
writeFileSync(join(fig, 'add--1.json'), JSON.stringify(doc('Add', [rec('Add', 16, 'outline', rect(2, 2, 12, 12)), rec('Add', 16, 'filled', rect(1.75, 1.75, 12.5, 12.5)),
  rec('Add', 24, 'outline', rect(3, 3, 18, 18)), rec('Add', 24, 'filled', rect(2.75, 2.75, 18.5, 18.5))])));
writeFileSync(join(fig, 'box--2.json'), JSON.stringify(doc('Box', [rec('Box', 16, 'outline', rect(2, 2, 12, 12)), { ...rec('Box', 16, 'filled', rect(2, 2, 12, 12)), strokeBasis: null }])));
writeFileSync(join(fig, 'box--copy.json'), JSON.stringify(doc('Box', [rec('Box', 16, 'outline', rect(0, 0, 16, 16))], 'Microsoft FLuent')));
writeFileSync(join(fig, 'curve--4.json'), JSON.stringify(doc('Curve', [rec('Curve', 16, 'outline', 'M2 8C2 18 12 18 12 8Z'),
  rec('Curve', 16, 'filled', 'M2 2L7 2L7 14L2 14Z M8.5 2C7.6 6 7.6 10 8.5 14L13 14L13 2Z')])));
writeFileSync(join(fig, 'subtract--3.json'), JSON.stringify(doc('Subtract', [rec('Subtract', 16, 'outline', rect(2, 7.5, 12, 1)), rec('Subtract', 16, 'filled', rect(1.75, 7.25, 12.5, 1.5))])));

test('readFluentDocs + fluentDrawings: reserved files skipped, the other page skipped, a record without a weight skipped', () => {
  const docs = readFluentDocs(refs);
  assert.deepEqual(docs.map((d) => d.file), ['add--1.json', 'box--2.json', 'box--copy.json', 'curve--4.json', 'subtract--3.json']);
  const flat = readFluentDocs(refs, { flatten: true }).find((d) => d.name === 'Curve');
  assert.ok(Math.abs(fluentDrawings([flat], ['Curve'])[0].ink.h - 7.5) < 0.005, 'the true reading flattens the record\'s curves');
  assert.equal(fluentDrawings(docs.filter((d) => d.name === 'Curve'), ['Curve'])[0].ink.h, 10);
  // the band between two filled parts, one edge a cubic bulging toward the other: 0.6 to its control points, 0.83 to the curve
  assert.deepEqual(fluentGapRows([flat], ['Curve'])[1].air, [{ kind: 'separation', gap: 0.83 }]);
  assert.deepEqual(fluentGapRows(docs.filter((d) => d.name === 'Curve'), ['Curve'])[1].air, [{ kind: 'separation', gap: 0.6 }]);
  const F = fluentDrawings(docs, ['Add', 'Box']);
  assert.equal(F.length, 5);
  assert.deepEqual(F.filter((d) => d.concept === 'Box').map((d) => d.ink.w), [12]);
  const L = strokeLadder(F, docs);
  assert.deepEqual(L.basis[16], [1]);
  assert.equal(L.bar.outline[16], 1);
  assert.equal(L.bar.filled[16], 1.5);
  assert.deepEqual(lineGrowth(F, 'Add', [16, 24]), [0.25, 0.25]);
});

const pin = join(tmp, 'pin');
const svg = (body, sw) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}">${body}</svg>`;
for (const m of [24, 20, 16]) {
  mkdirSync(join(pin, 'src', 'icons', String(m)), { recursive: true });
  writeFileSync(join(pin, 'src', 'icons', String(m), 'bar.svg'), svg(`<path d="M4 ${m / 2}H${m - 4}"/>`, m === 16 ? 1.25 : 1.5));
  writeFileSync(join(pin, 'src', 'icons', String(m), 'bar-filled.svg'), svg(`<path d="M4 ${m / 2}H${m - 4}"/>`, m === 24 ? 2.5 : 2));
}
const run = (...args) => spawnSync(process.execPath, [join(HERE, 'fluent-probe.mjs'), ...args], { encoding: 'utf8' });

test('CLI: sections print their headings and figures on a fake pin; bad input exits 2', () => {
  const r = run(pin, 'sample', 's1', 'answer', '--refs', refs);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^## §sample /m);
  assert.match(r.stdout, /^## §1 The stroke table/m);
  assert.match(r.stdout, /component sets enumerated: 4 · distinct names: 3/);
  assert.match(r.stdout, /\| Regular, calibrated \(records' strokeBasis\) \|  \| 1 \|  \| 1\.5 \|  \|  \|  \|/);
  assert.match(r.stdout, /\| as a share of canvas \| — \| 6\.25% \| — \| 6\.25% \| — \| — \| — \|/);
  assert.match(r.stdout, /sample: 1 at all seven \+ an even spread of 100 = 101/);
  assert.match(r.stdout, /our side: 1 concepts × 3 masters × 2 styles = 6 drawings/);
  assert.match(r.stdout, /our drawings: 6 · reaching the canvas edge \(min margin < 0\.02\): 0 · past the circle keyline: 0/);
  assert.equal(run(pin, 'nope', '--refs', refs).status, 2);
  assert.equal(run(join(tmp, 'missing'), '--refs', refs).status, 2);
  const short = join(tmp, 'short-pin'); mkdirSync(join(short, 'src', 'icons', '24'), { recursive: true }); mkdirSync(join(short, 'src', 'icons', '20'), { recursive: true });
  assert.equal(run(short, 'answer', '--refs', refs).status, 2, 'a pin without src/icons/16 is refused');
  assert.equal(run(pin, '--refs', join(tmp, 'missing')).status, 2);
});
