// node --test tools/audit/primitives-probe.test.mjs
//
// Synthetic fixtures only: hand-built path strings and a tiny fake pin made in a temp directory.
// Each test pins a function whose breakage would change a figure primitives-probe.mjs prints
// for docs/audit/findings-primitives.md.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { congruentUpToTranslation } from './congruence.mjs';
import {
  classifySub, outerDiameter, outerR, stemOf, comparePart, arrowheadClasses, persistenceCensus,
  offGridCircles, turningBends, belowOwnStroke, repeatedSpacing, shapesAcrossMasters, scalePairs,
  spanOf, ringClass, loadSet, allSubpaths, makeContext, runSections, lineAngle,
  squareClass, dotsOf, bandFor, hu, oneDp, chevR, residualCell,
} from './primitives-probe.mjs';

const PROBE = join(dirname(fileURLToPath(import.meta.url)), 'primitives-probe.mjs');

const RING24 = 'M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z';
const CHEVRON = 'M6 9L11.47 14.47A0.75 0.75 0 0 0 12.53 14.47L18 9';
const RRECT_CW = 'M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z';
const RRECT_CCW = 'M4.125 2.625A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625Z';
const dot = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;

/** A classified part with the provenance fields the probe adds in allSubpaths. */
const part = (d, o = {}) => ({
  ...classifySub(d), concept: 'x', base: 'x', master: 24, style: 'outline', sw: 1.5, ink: 'stroke',
  pathIndex: 0, subIndex: 0, id: `${o.base ?? o.concept ?? 'x'}@${o.master ?? 24}#${o.pathIndex ?? 0}.0`, ...o,
});

// ── the part classifier ────────────────────────────────────────────────────

test('classifySub: a full circle carries its radius and centre', () => {
  const c = classifySub(RING24);
  assert.equal(c.kind, 'circle');
  assert.equal(c.r, 9.25);
  assert.deepEqual([c.cx, c.cy], [12, 12]);
});

test('classifySub: two same-radius arcs out and back are a lens, not a circle (the card\'s correction)', () => {
  const lens = classifySub('M5 5A10 10 0 0 1 12 12A10 10 0 0 1 5 5Z');
  assert.equal(lens.kind, 'lens');
  assert.equal(lens.r, 10);
});

test('classifySub: line length and folded angle', () => {
  const l = classifySub('M5.25 12h13.5');
  assert.equal(l.kind, 'line');
  assert.equal(l.length, 13.5);
  assert.equal(l.angle, 0);
  assert.equal(classifySub('M18 6L6 18').angle, 135);
  assert.equal(lineAngle([0, 0], [-1, 0]), 0, 'a line has no direction');
});

test('classifySub: a bend reports legs, bend radius and the turn between its legs', () => {
  const b = classifySub(CHEVRON);
  assert.equal(b.kind, 'bend');
  assert.equal(b.bendR, 0.75);
  assert.equal(b.turn, 90);
  assert.equal(b.legs[0], b.legs[1]);
  assert.deepEqual([...b.angles].sort((x, y) => x - y), [45, 135]);
  const wide = classifySub('M0 0L10 0A1 1 0 0 1 11 1L7 5');   // legs at 0° and 135°
  assert.equal(wide.kind, 'bend');
  assert.equal(wide.turn, 45, 'the turn is folded to ≤ 90°');
});

test('classifySub: closed with one arc radius is rrect-ish; open straight runs are a polyline', () => {
  const r = classifySub(RRECT_CW);
  assert.equal(r.kind, 'rrect-ish');
  assert.equal(r.r, 1.5);
  assert.deepEqual([r.w, r.h], [10.75, 10.75]);
  assert.equal(classifySub('M2 2L4 4L6 2').kind, 'polyline');
  assert.equal(classifySub('M2 8A6 6 0 0 1 14 8').kind, 'arc');
});

test('outer ink edge: a stroke grows by half its file\'s stroke, a shape does not', () => {
  const stroked = part(dot(12, 12, 0.75), { sw: 1.5, ink: 'stroke' });
  assert.equal(outerDiameter(stroked), 3);
  assert.equal(outerR(part(RING24, { sw: 1.5 })), 10);
  assert.equal(outerDiameter(part(dot(12, 12, 1), { ink: 'fill', sw: 1.5 })), 2);
});

test('stemOf: the family split the near-miss census uses', () => {
  assert.equal(stemOf('users-3-behind'), 'users');
  assert.equal(stemOf('chevron-down-2-small'), 'chevron-down');
  assert.equal(stemOf('check-circle-4-small'), 'check-circle');
  assert.equal(stemOf('paintbrush-7'), 'paintbrush');
  assert.notEqual(stemOf('globe'), stemOf('language-2'));
});

// ── comparing parts, around the instrument's known defect ──────────────────

test('comparePart: one ring walked the other way is the same part (congruence.mjs defect worked around)', () => {
  const raw = congruentUpToTranslation(RRECT_CW, RRECT_CCW);
  assert.equal(raw.same, false, 'the defect this works around is still there');
  const r = comparePart(RRECT_CW, RRECT_CCW);
  assert.equal(r.same, true);
  assert.equal(r.maxDeviation, 0);
  assert.equal(r.raw.same, false);
});

test('comparePart: a moved copy is identical with its offset; a near miss reports its residual', () => {
  const r = comparePart('M2 2h10', 'M5 7h10');
  assert.equal(r.same, true);
  assert.deepEqual(r.offset, [3, 5]);
  const n = comparePart('M2 2h10', 'M2 2h10.3');
  assert.equal(n.same, false);
  assert.ok(Math.abs(n.maxDeviation - 0.15) < 1e-9, 'best fit splits the error between the ends');
  const s = comparePart(CHEVRON, 'M12 18L22.94 28.94A1.5 1.5 0 0 0 25.06 28.94L36 18', 'scale');
  assert.equal(s.same, true);
  assert.equal(s.scale, 2);
});

// ── censuses ───────────────────────────────────────────────────────────────

test('arrowheadClasses: symmetric V bends outside the chevrons, grouped by (leg, R, turn)', () => {
  const up = 'M8 10L11.47 6.53A0.75 0.75 0 0 1 12.53 6.53L16 10';
  const down = 'M8 14L11.47 17.47A0.75 0.75 0 0 0 12.53 17.47L16 14';
  const subs = [
    part(up, { concept: 'arrow-up', base: 'arrow-up' }),
    part(down, { concept: 'arrow-down', base: 'arrow-down' }),
    part(down, { concept: 'sort', base: 'sort' }),
    part(CHEVRON, { concept: 'chevron-down', base: 'chevron-down' }),            // excluded: a chevron
    part('M4 4L11.47 11.47A0.75 0.75 0 0 0 12.53 11.47L14 10', { concept: 'check' }), // excluded: legs unequal
    part('M0 5L4.5 0.5A0.707 0.707 0 0 1 5.5 0.5L9.25 4.25', { concept: 'arrow-near' }),  // excluded: legs 17% apart (> 2%)
  ];
  const a = arrowheadClasses(subs);
  assert.equal(a.heads, 3);
  assert.equal(a.rows.length, 1, 'direction is ignored');
  assert.equal(a.rows[0].n, 3);
  assert.deepEqual(a.rows[0].concepts, ['arrow-down', 'arrow-up', 'sort']);
  assert.equal(a.rows[0].turn, 90);
});

test('persistenceCensus: a part shared at 24 and 20 and split at 16 is flagged, a constant share is not', () => {
  const check24 = 'M7.61 12.46L9.81 14.65A0.75 0.75 0 0 0 10.87 14.65L16.39 9.13';
  const check16a = 'M5.375 8.31L6.562 9.498A0.625 0.625 0 0 0 7.446 9.498L10.625 6.319';
  const check16b = 'M5.335 8.205L6.593 9.53A0.625 0.625 0 0 0 7.493 9.536L10.665 6.285';
  const subs = [
    part(check24, { concept: 'box', master: 24 }), part(check24, { concept: 'ring', master: 24 }),
    part(check24, { concept: 'box', master: 20 }), part(check24, { concept: 'ring', master: 20 }),
    part(check16a, { concept: 'box', master: 16 }), part(check16b, { concept: 'ring', master: 16 }),
    part(dot(8, 8, 1), { concept: 'p', master: 24 }), part(dot(8, 8, 1), { concept: 'q', master: 24 }),
    part(dot(8, 8, 1), { concept: 'p', master: 20 }), part(dot(8, 8, 1), { concept: 'q', master: 20 }),
    part(dot(8, 8, 1), { concept: 'p', master: 16 }), part(dot(8, 8, 1), { concept: 'q', master: 16 }),
    // u has the shared dot twice, v once, at 24 only: shared count is the smaller multiplicity (1),
    // and a share at one master only varies but is not "two agree, the third has fewer"
    part(dot(3, 3, 0.5), { concept: 'u', master: 24 }), part(dot(3, 3, 0.5), { concept: 'u', master: 24, subIndex: 1 }),
    part(dot(3, 3, 0.5), { concept: 'v', master: 24 }),
    // the same dot in two places is NOT a shared part: same shape, different position
    ...[24, 20, 16].flatMap((m) => [part(dot(5, 5, 1.5), { concept: 'g', master: m }), part(dot(9, 9, 1.5), { concept: 'h', master: m })]),
    // y and z share a part at 16 only (at 24 and 20 the same dot sits in different places)
    ...[24, 20, 16].flatMap((m) => [part(dot(20, 20, 0.5), { concept: 'y', master: m }), part(dot(m === 16 ? 20 : 21, 20, 0.5), { concept: 'z', master: m })]),
    // w and x share two parts at 24 and 16 but one at 20: the count varies, yet they share at every master
    ...[24, 20, 16].flatMap((m) => ['w', 'x'].flatMap((c) => [part(dot(14, 4, 0.75), { concept: c, master: m }),
      part(m === 20 && c === 'x' ? dot(18, 5, 0.75) : dot(18, 4, 0.75), { concept: c, master: m, subIndex: 1 })])),
  ];
  const p = persistenceCensus(subs).outline;
  assert.equal(p.all.length, 5, 'a congruent part in another place is not shared');
  assert.deepEqual(p.notAll.map((x) => x.id), ['box + ring', 'u + v', 'y + z'], 'shares nothing at some master — at 24, 20 or 16');
  assert.deepEqual(p.varying.find((x) => x.id === 'y + z').c, [0, 0, 1]);
  assert.equal(p.varying.length, 4, 'the count of shared parts is not the same at all three masters');
  assert.deepEqual(p.varying.find((x) => x.id === 'u + v').c, [1, 0, 0]);
  assert.deepEqual(p.varying.find((x) => x.id === 'w + x').c, [2, 1, 2]);
  assert.deepEqual(p.lost.map((x) => x.id), ['box + ring', 'w + x']);
  assert.deepEqual(p.lost[0], { id: 'box + ring', c: [1, 1, 0] });
});

test('offGridCircles: a radius off its master\'s grid (0.25 at 24/20, 0.125 at 16)', () => {
  const subs = [
    part(dot(10, 10, 0.6), { master: 20 }), part(dot(10, 10, 0.5), { master: 20 }),
    part(dot(8, 8, 0.575), { master: 16 }), part(dot(8, 8, 0.625), { master: 16 }),
    part(dot(12, 12, 0.75), { master: 24 }),
  ];
  assert.deepEqual(offGridCircles(subs).map((s) => [s.master, s.r]), [[20, 0.6], [16, 0.575]]);
});

test('turningBends / belowOwnStroke: the minimum is half the stroke of the file the bend is in', () => {
  const light = part(CHEVRON, { sw: 1.5 }), heavy = part(CHEVRON, { sw: 2.5 });
  const flat = part('M2 2L10 2A0.75 0.75 0 0 1 10.5 2.2L18 2.4');
  assert.equal(turningBends([light, flat]).length, 1, 'a bend that barely turns is not a corner');
  assert.deepEqual(belowOwnStroke([light, heavy]), [heavy]);
});

test('repeatedSpacing: C17 gap and thickness, dots and lines', () => {
  const dots = [dot(6, 12, 0.75), dot(12, 12, 0.75), dot(18, 12, 0.75)].map((d) => part(d));
  assert.deepEqual(repeatedSpacing(dots, 1.5), { el: 'dot', th: 3, gap: 3 });
  const lines = ['M4 7.5h16', 'M4 12h16', 'M4 16.5h16'].map((d) => part(d));
  assert.deepEqual(repeatedSpacing(lines, 1.5), { el: 'line', th: 1.5, gap: 3 });
});

test('spanOf: the mark\'s x extent plus the stroke, a container ring left out', () => {
  const plus = ['M12 5.25v13.5', 'M5.25 12h13.5'].map((d) => part(d));
  assert.equal(spanOf(plus, 1.5), 15);
  assert.equal(spanOf([...plus, part(RING24)], 1.5), 15);
});

test('ringClass: the most common (radius, centre) among big circles', () => {
  const subs = [
    part(RING24, { concept: 'a' }), part(RING24, { concept: 'b' }), part(dot(12, 12, 7.5), { concept: 'c' }),
    part(dot(12, 12, 1), { concept: 'd' }),
  ];
  assert.deepEqual(ringClass(subs, 24, 'outline').map((s) => s.concept), ['a', 'b']);
});

test('shapesAcrossMasters and scalePairs: same size at two masters; resized vs redrawn vs trivial', () => {
  const subs = [
    part('M2 2h1.5v1.5h-1.5Z', { master: 24, base: 'a' }), part('M9 9h1.5v1.5h-1.5Z', { master: 20, base: 'b' }),
    part('M2 2h3v1.5h-3Z', { master: 24, base: 'c' }), part('M6 6h3v1.5h-3Z', { master: 24, base: 'd' }),
  ];
  assert.equal(shapesAcrossMasters(subs).length, 1, 'a shape at one master only does not count');
  const k = { pathIndex: 0, subIndex: 0 };
  const pairs = [
    part(CHEVRON, { master: 24, base: 'chev', ...k }),
    part('M5 7.5L9.558 12.058A0.625 0.625 0 0 0 10.442 12.058L15 7.5', { master: 20, base: 'chev', ...k }),  // ×5/6
    part(CHEVRON, { master: 24, base: 'tick', ...k }),
    part('M2 6L5 9A0.75 0.75 0 0 0 6 9L12 3', { master: 20, base: 'tick', ...k }),                         // redrawn
    part('M5 12h14', { master: 24, base: 'bar', ...k }), part('M4 10h12', { master: 20, base: 'bar', ...k }),  // trivial
  ];
  const r = scalePairs(pairs, 20);
  assert.equal(r.n, 3);
  assert.equal(r.trivial, 1);
  assert.equal(r.fixed.same, 1);
  assert.equal(r.fixed.diff, 1);
  assert.deepEqual(r.fixed.scales, [0.833]);
});

test('squareClass: the most common rounded square, keyed on size, radius and position', () => {
  const sq = (x) => `M${x + 2.5} 3.75H${x + 14}A2.5 2.5 0 0 1 ${x + 16.5} 6.25V17.75A2.5 2.5 0 0 1 ${x + 14} 20.25H${x + 2.5}A2.5 2.5 0 0 1 ${x} 17.75V6.25A2.5 2.5 0 0 1 ${x + 2.5} 3.75Z`;
  const subs = [
    ...['a', 'b', 'c'].map((c) => part(sq(3.75), { concept: c })),
    ...['d', 'e'].map((c) => part(sq(4.75), { concept: c })),                 // same size and radius, 1 unit right
    part(RING24, { concept: 'f' }),                                         // a circle is not a rounded square
  ];
  const k = squareClass(subs, 24, 'outline');
  assert.deepEqual(k.members.map((s) => s.concept), ['a', 'b', 'c']);
  assert.equal(k.ink, '18 × 18');
  assert.deepEqual(squareClass([], 24, 'outline').members, []);
  // the 55%-of-canvas floor (13.2 at 24): 13.5 wide is in, 13 wide is out — even though more of them
  const sqw = (w) => { const a = 5, b = 5 + w; return `M${a + 1} ${a}H${b - 1}A1 1 0 0 1 ${b} ${a + 1}V${b - 1}A1 1 0 0 1 ${b - 1} ${b}H${a + 1}A1 1 0 0 1 ${a} ${b - 1}V${a + 1}A1 1 0 0 1 ${a + 1} ${a}Z`; };
  const floor = [...['p', 'q'].map((c) => part(sqw(13.5), { concept: c })), ...['r', 's', 't'].map((c) => part(sqw(13), { concept: c }))];
  assert.deepEqual(floor.map((x) => x.w), [13.5, 13.5, 13, 13, 13]);
  assert.deepEqual(squareClass(floor, 24, 'outline').members.map((x) => x.concept), ['p', 'q']);
});

test('dotsOf: circles below the container threshold only (r < 5 at 24, < 4 at 20, < 3.5 at 16)', () => {
  const subs = [part(dot(12, 12, 4.75)), part(dot(12, 12, 5)), part(dot(12, 12, 9.25)), part(dot(10, 10, 3.75), { master: 20 }),
    part(dot(10, 10, 4), { master: 20 }), part(dot(8, 8, 3.25), { master: 16 }), part(dot(8, 8, 3.5), { master: 16 })];
  assert.deepEqual(dotsOf(subs, 24, 'outline').map((s) => s.r), [4.75]);
  assert.deepEqual(dotsOf(subs, 20, 'outline').map((s) => s.r), [3.75]);
  assert.deepEqual(dotsOf(subs, 16, 'outline').map((s) => s.r), [3.25], 'the 16 threshold is 3.5');
});

test('bandFor: classify\'s 0.5 at 24, held at one share of canvas', () => {
  assert.equal(bandFor(24), 0.5);
  assert.ok(Math.abs(bandFor(16) - 1 / 3) < 1e-12);
});

test('hu / oneDp / chevR: the document\'s rounding', () => {
  assert.equal(hu(10.28 / 16, 3), '0.643', 'half-up on the decimal value, not toFixed\'s 0.642');
  assert.equal(hu(-0.0324, 3), '-0.032');
  assert.equal(hu(0.2055, 3), '0.206');
  assert.equal(oneDp(2), '2.0');
  assert.equal(oneDp(2.125), '2.125');
  assert.deepEqual([1.3, 1.97, 2.5, 2].map(chevR), ['1.30', '1.97', '2.5', '2.0']);
  assert.equal(residualCell(0.0141, 24), '0.0141 u = 0.009 px@16');
  assert.equal(residualCell(0.10601, 16), '0.106 u = 0.106 px');
  assert.equal(residualCell(1.5274, 20), '1.527 u = 1.22 px');
});

// ── the loader and the CLI on a fake pin ───────────────────────────────────

const POOLED24 = '| 24 | 10 | 7 | 6 | 30.0% |';  // both styles pooled (outline alone: 5 · 4 · 3)
function fakePin() {
  const dir = mkdtempSync(join(tmpdir(), 'prim-probe-'));
  const svg = (sw, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}">\n${body}\n</svg>\n`;
  const files = {
    24: { 'ring.svg': svg(1.5, `  <path d="${RING24}"/>`), 'ring-filled.svg': svg(1.5, '  <path fill="currentColor" stroke="none" d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z"/>'),
      'tick.svg': svg(1.5, `  <!-- glyph: dot -->\n  <path d="${CHEVRON}"/>`), 'tick-filled.svg': svg(2.5, '  <path d="M6.5 9.5L11.12 14.12A1.25 1.25 0 0 0 12.88 14.12L17.5 9.5"/>'),
      'dot.svg': svg(1.5, `  <path d="${dot(4, 4, 1)}"/>`), 'dot-filled.svg': svg(1.5, `  <path fill="currentColor" stroke="none" d="${dot(4, 4, 1.75)}"/>`) },
    20: { 'ring.svg': svg(1.5, '  <path d="M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z"/>'), 'ring-filled.svg': svg(1.5, '  <path fill="currentColor" stroke="none" d="M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10Z"/>'),
      'tick.svg': svg(1.5, '  <path d="M5 7.5L9.47 11.97A0.75 0.75 0 0 0 10.53 11.97L15 7.5"/>'), 'tick-filled.svg': svg(2, '  <path d="M5.5 8L9.29 11.79A1 1 0 0 0 10.71 11.79L14.5 8"/>'),
      'dot.svg': svg(1.5, `  <path d="${dot(4, 4, 1)}"/>\n  <path d="${dot(10, 10, 0.6)}"/>`), 'dot-filled.svg': svg(1.5, `  <path fill="currentColor" stroke="none" d="${dot(4, 4, 1.75)}"/>`) },
    16: { 'ring.svg': svg(1.25, '  <path d="M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z"/>'), 'ring-filled.svg': svg(1.25, '  <path fill="currentColor" stroke="none" d="M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8Z"/>'),
      'tick.svg': svg(1.25, '  <path d="M4 6L7.558 9.558A0.625 0.625 0 0 0 8.442 9.558L12 6"/>'), 'tick-filled.svg': svg(2, '  <path d="M4.5 6.5L7.29 9.29A1 1 0 0 0 8.71 9.29L11.5 6.5"/>'),
      'dot.svg': svg(1.25, `  <path d="${dot(4, 4, 1)}"/>`), 'dot-filled.svg': svg(1.25, `  <path fill="currentColor" stroke="none" d="${dot(4, 4, 1.625)}"/>`) },
  };
  for (const m of ['24', '20', '16']) {
    const sw = m === '16' ? 1.25 : 1.5;
    files[m]['bar.svg'] = svg(sw, '  <path d="M4 8h8"/>');
    files[m]['bar-filled.svg'] = svg(2, '  <path d="M4 8h8"/>');
    files[m]['bar-2.svg'] = svg(sw, `  <path d="${m === '16' ? 'M4 8h8.8' : 'M4 8h8'}"/>`);
    files[m]['bar-2-filled.svg'] = svg(2, `  <path d="${m === '16' ? 'M4 8h8.8' : 'M4 8h8'}"/>`);
  }
  for (const [m, fs] of Object.entries(files)) {
    mkdirSync(join(dir, 'src/icons', m), { recursive: true });
    for (const [n, t] of Object.entries(fs)) writeFileSync(join(dir, 'src/icons', m, n), t);
  }
  return dir;
}

test('loadSet / allSubpaths on a fake pin: styles, root stroke, notes, shape fills', () => {
  const pin = fakePin();
  try {
    const files = loadSet(pin);
    assert.equal(files.length, 30);
    const tf = files.find((f) => f.base === 'tick-filled' && f.master === 24);
    assert.equal(tf.style, 'filled');
    assert.equal(tf.concept, 'tick');
    assert.equal(tf.sw, 2.5);
    assert.ok(files.find((f) => f.base === 'tick' && f.master === 24).notes.includes('glyph: dot'));
    const subs = allSubpaths(files);
    assert.equal(subs.length, 31);
    assert.equal(subs.find((s) => s.base === 'ring-filled' && s.master === 24).ink, 'fill');
    const ctx = makeContext(pin);
    const lines = runSections(ctx, ['s0', 's1.1', 's5', 's8']);
    assert.ok(lines.includes('\n## §0 Method — the pin, the unit, the lens correction'));
    assert.ok(lines.some((l) => /concepts 5 · files 30/.test(l)));
    assert.ok(lines.includes('| 24 | outline | 5 | 4 | 3 | 20.0% |'), 'bar = bar-2 at 24');
    assert.ok(lines.includes('| 16 | outline | 5 | 5 | 5 | 0.0% |'), 'split at 16');
    assert.ok(lines.includes(POOLED24), lines.filter((l) => /^\| 24 \| \d/.test(l)).join('\n'));
    // s1.1 path level: shapes counted per master, then pooled (dots and bars repeat across masters)
    assert.ok(lines.includes('<path> level: 31 paths carry 23 distinct (shape, master) pairs — 8 paths, 26%, redraw something the set already contains'), lines.find((l) => /path> level/.test(l)));
    assert.ok(lines.includes('pooling masters as well: 18 distinct shapes, so 5 (shape, master) pairs collapse'), lines.find((l) => /pooling/.test(l)));
    // s5: the band is scaled by master — bar vs bar-2 at 16 (0.4 apart) is a near miss only at the fixed 0.5
    assert.ok(lines.includes("wave 0's fixed band (classify's default, 0.5 units at every master), outline: 0 → 0 → 1"));
    assert.ok(lines.includes('| 16 | outline | 5 | 0.333 | 0 | 0 | 0 | 0.0 |'), lines.filter((l) => l.startsWith('| 16 | outline')).join('\n'));
    assert.ok(lines.includes('   with the band at 2% of canvas: 0 pairs across the six buckets, 0 of them at 16 outline'));
    // s8 check 4: one off-grid circle (r 0.6 at 20)
    assert.ok(lines.includes('check 4, off-grid radius: 1 circles in 1 files, 1 concepts'), lines.find((l) => /check 4/.test(l)));
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

test('CLI: a section heading on a fake pin; unknown section and a missing pin exit 2', () => {
  const pin = fakePin();
  try {
    const ok = spawnSync(process.execPath, [PROBE, pin, 's0', 's2.9'], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^## §0 /m);
    assert.match(ok.stdout, /^## §2\.9 /m);
    const bad = spawnSync(process.execPath, [PROBE, pin, 'nope'], { encoding: 'utf8' });
    assert.equal(bad.status, 2);
    assert.match(bad.stderr, /unknown section: nope/);
    const none = spawnSync(process.execPath, [PROBE, join(pin, 'missing')], { encoding: 'utf8' });
    assert.equal(none.status, 2);
    assert.match(none.stderr, /usage/);
  } finally { rmSync(pin, { recursive: true, force: true }); }
});
