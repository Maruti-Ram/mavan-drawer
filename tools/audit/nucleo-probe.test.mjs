// Tests for tools/audit/nucleo-probe.mjs — synthetic fixtures only (hand-built drawings, a tiny fake
// pin and a tiny fake Nucleo library under a temporary HOME). Run: node --test tools/audit/nucleo-probe.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  percentile, rint, npRound, fx, modeOf, radiiToCover, gapsOf, roleOf, summarise, distinctRows, repeatCensus,
  inkCompare, runs, partsCompare, pairCategory, partKind, dotGap, quarterTurnRadii, ourRecord, floorOf,
  chainRow, verdictRow, partRow, detailTable, strokeRow, pairStat,
  land, airRow, pixelBand, dotCell, runShares, belowOneStroke, cornerRow, trend, median, mean,
  touchFmt, oneValuePerSetGrid, matchParts, cornerStroke, STEP, MIN_LEG, lengthFmt, inkPct, partsOf, valueCounts, inkOf, svgptSegments,
  CORE_KEYS, UI_KEYS, OUR_KEYS, SIX_KEYS, SIZE_CHAINS, CORE_GRIDS, UI_GRIDS, OUR_MASTERS, OUR_UP, shareRatio, partsAt,
} from './nucleo-probe.mjs';
import { bboxOf, normalisePath, sampleSegs, fitSimilarity } from './refs/nucleo.mjs';
import { cornersOf } from './radii.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROBE = path.join(HERE, 'nucleo-probe.mjs');
const svg = (body, vb = 24) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const rec = (body, vb = 24) => ourRecord(svg(body, vb));

test('numpy / pandas semantics: linear percentile, half-even rounding, smallest mode, radii to 90%', () => {
  assert.equal(percentile([1, 2, 3, 4], 50), 2.5);
  assert.equal(percentile([0, 10], 10), 1);
  assert.ok(Number.isNaN(percentile([], 50)));
  assert.equal(rint(2.5), 2); assert.equal(rint(3.5), 4); assert.equal(rint(2.52), 3); assert.equal(rint(2.49), 2); assert.equal(rint(0.5), 0); assert.equal(rint(1.2), 1);
  assert.equal(npRound(0.125, 2), 0.12);
  assert.equal(fx(0.125, 2), '0.12'); assert.equal(fx(2.675, 2), (2.675).toFixed(2)); assert.equal(fx(1.5, 0), '2');
  assert.equal(modeOf([3, 1, 3, 1, 2]), 1);
  assert.equal(modeOf([2, 2, 5]), 2);
  assert.equal(radiiToCover([2, 2, 2, 2, 2, 2, 2, 2, 3, 4]), 2);       // 80% then 90%: two values reach 90%
  assert.equal(radiiToCover([2, 2, 2, 2, 2, 2, 2, 2, 2, 3]), 1);
});

test('gapsOf: air between distinct sub-paths; a touching pair is a join and dropped', () => {
  const r = rec('<path d="M4 10h16"/><path d="M4 13h16"/>');
  const g = gapsOf(r, 24);
  assert.equal(g.length, 1);
  assert.ok(Math.abs(g[0].d - 3) < 1e-9 && g[0].w === 1.5 && !g[0].same);
  assert.equal(gapsOf(rec('<path d="M4 10h16M12 10v8"/>'), 24).length, 0);     // a T junction touches
  const f = floorOf(gapsOf(r, 24).map((x) => [x.d, x.w, 0]));
  assert.ok(Math.abs(f.fl - 1.5) < 1e-9 && f.w === 1.5);
  assert.equal(floorOf([[1.7, 1.5, 0]]), null);                                // 0.2 of air is under the 0.5 px visibility floor
});

test('roleOf: container, bend, detail, ambiguous', () => {
  const ink = { x0: 2, y0: 2, x1: 22, y1: 22 };
  const c = (o) => ({ tangentError: 0, convex: true, legs: [5, 5], ...o, subInfo: { bbox: { x0: 2, y0: 2, x1: 22, y1: 22 }, closed: true, fill: 1, corners: 4, ...(o.subInfo || {}) } });
  assert.equal(roleOf(c({}), ink, 1), 'container');
  assert.equal(roleOf(c({ subInfo: { closed: false, fill: 0, corners: 1 } }), ink, 1), 'bend');
  assert.equal(roleOf(c({ subInfo: { bbox: { x0: 10, y0: 10, x1: 12, y1: 12 } } }), ink, 1), 'detail');
  assert.equal(roleOf(c({ tangentError: 9 }), ink, 1), 'ambiguous');
});

test('summarise: ink box, margins, the keyline circle, parts, segments, container corners', () => {
  const r = summarise(rec('<path d="M12 2.75a9.25 9.25 0 1 0 0 18.5a9.25 9.25 0 1 0 0 -18.5"/><path d="M8 12h8"/>'));
  assert.deepEqual(r.box, { x0: 2, y0: 2, x1: 22, y1: 22 });
  assert.deepEqual(r.margins, { l: 2, t: 2, r: 2, b: 2 });
  assert.equal(r.circleR, 9.25);
  assert.equal(r.parts, 2); assert.equal(r.subs, 2); assert.equal(r.seg.A, 2); assert.equal(r.seg.L, 1);
  const sq = summarise(rec('<path d="M6 3.75h12a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25v-12a2.25 2.25 0 0 1 2.25-2.25z"/>'));
  const cont = sq.corners.filter((c) => c[1] === 'container');
  assert.equal(cont.length, 4);
  assert.ok(cont.every((c) => Math.abs(c[0] - 2.25) < 0.01 && c[2] !== 'sharp'));
});

test('distinctRows and repeatCensus: the same drawing filed twice counts once', () => {
  const base = { fam: 'Core', grid: 24, klass: 'outline', box: { x0: 1, y0: 1, x1: 23, y1: 23 }, seg: { L: 2, C: 0, Q: 0, A: 0, Z: 0 }, parts: 1, subs: 1 };
  const rows = [{ ...base, name: 'a' }, { ...base, name: 'a' }, { ...base, name: 'b' }, { ...base, name: 'b', parts: 2 }];
  assert.equal(distinctRows(rows).length, 3);
  assert.deepEqual(repeatCensus(rows), { keys: 2, multi: 2, same: 1 });
});

test('inkCompare: one drawing against itself is all held; an added bar is gone ink', () => {
  const a = rec('<path d="M4 12h16"/>');
  const same = inkCompare(a, rec('<path d="M4 12h16"/>'));
  assert.equal(same.A.held, 1); assert.equal(same.B.gone, 0);
  const more = inkCompare(rec('<path d="M4 12h16"/><path d="M4 20h16"/>'), a);
  assert.ok(more.A.gone > 0.4 && more.A.gone < 0.6, `gone ${more.A.gone}`);
  assert.equal(more.B.gone, 0);
  assert.ok(more.goneRunsA.length >= 1 && more.goneRunsA[0] > 5);
  const moved = inkCompare(rec('<path d="M4 12h16"/>'), rec('<path d="M4 13h16"/>'));     // 1 unit = 2/3 stroke
  assert.equal(moved.A.nudged, 1);
  const far = inkCompare(rec('<path d="M4 12h16"/>'), rec('<path d="M4 14h16"/>'));       // 2 units = 4/3 stroke: gone
  assert.equal(far.A.gone, 1);
});

test('runs: lengths of flagged stretches', () => {
  const pts = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
  assert.deepEqual(runs([false, true, true, true, false], pts), [2]);
  assert.deepEqual(runs([true, true, false, true, true], pts), [1, 1]);
});

test('partsCompare: matched in place, a dropped part, and the kinds', () => {
  const a = rec('<path d="M4 12h16"/><path d="M12 4v4"/>'), b = rec('<path d="M4 12h16"/>');
  const p = partsCompare(a, b);
  assert.equal(p.nA, 2); assert.equal(p.nB, 1);
  assert.equal(p.dropped.length, 1); assert.equal(pairCategory(p), 'dropped/added');
  assert.equal(partKind(p.dropped[0]), 'open line');
  const q = partsCompare(b, rec('<path d="M4 12h16"/>'));
  assert.equal(pairCategory(q), 'pure');
  assert.equal(pairCategory({ dropped: [], added: [], matched: [{ stage: 'place', maxS: 0.5 }] }), 'nudged');
  assert.equal(pairCategory({ dropped: [], added: [], matched: [{ stage: 'place', maxS: 1.5 }] }), 'reshaped');
  assert.equal(pairCategory({ dropped: [], added: [], matched: [{ stage: 'shape', maxS: 0.2 }] }), 'moved/resized');
  assert.equal(partKind({ closed: 1, len: 5 }), 'closed shape');
  assert.equal(partKind({ closed: 0, len: 1 }), 'dot');
});

test('dotGap: the dot of an exclamation mark to its stem', () => {
  const r = rec('<path d="M12 6v8"/><path d="M12 17.5h.01"/>');
  // dot centre 12.005, 17.5; outer radius (0.01 + 1.5)/2; stem end 14 + half stroke
  const g = dotGap(r, 1.5, { nucleo: false });
  assert.ok(Math.abs(g - (3.5 - 0.755 - 0.75)) < 0.01, `gap ${g}`);
  assert.equal(dotGap(rec('<path d="M12 6v8"/>'), 1.5, { nucleo: false }), null);
});

test('quarterTurnRadii: the §8 svgpathtools reading of a rounded rectangle', () => {
  const k = 0.5523 * 2;
  const d = `M5 3H19C${19 + k} 3 21 ${5 - k} 21 5V19C21 ${19 + k} ${19 + k} 21 19 21H5C${5 - k} 21 3 ${19 + k} 3 19V5C3 ${5 - k} ${5 - k} 3 5 3Z`;
  assert.deepEqual(quarterTurnRadii(d), [2, 2, 2]);              // the fourth corner has no segment after it: Z closes nothing (start = end), as in svgpathtools
  assert.deepEqual(quarterTurnRadii('M3 5V19A2 2 0 0 0 5 21H19'), [2]);
  assert.deepEqual(quarterTurnRadii('M3 5L19 5L19 19'), []);
  assert.deepEqual(quarterTurnRadii('M3 5H19V21H5A2 2 0 0 1 3 19Z'), [2]);     // the closing Z is the line after the corner
});

test('chainRow: orientation, bands, unchanged / minor / changed and the fit ratio', () => {
  const P = [
    { A: { held: 1, nudged: 0, gone: 0 }, B: { held: 0.9, nudged: 0.1, gone: 0 }, goneRunsA: [], goneRunsB: [], fit: { s: 0.8 } },
    { A: { held: 0.8, nudged: 0.1, gone: 0.1 }, B: { held: 0.5, nudged: 0.3, gone: 0.2 }, goneRunsA: [1], goneRunsB: [12], fit: { s: 0.5 } },
  ];
  const big = chainRow(P, false);                // A is the larger grid
  assert.equal(big.held, 0.9); assert.equal(big.unchanged, 0.5); assert.equal(big.changed, 0.5);
  assert.equal(big.bigDetail, 0.5); assert.equal(big.smallDetail, 0.5);
  assert.equal(big.fit, (1 / 0.8 + 1 / 0.5) / 2);
  const small = chainRow(P, true);               // A is the smaller grid
  assert.equal(small.held, 0.7); assert.equal(small.fit, (0.8 + 0.5) / 2);
});

test('verdictRow and partRow: shares and part statistics', () => {
  const v = verdictRow([{ verdict: 'redrawn', fit: 2 }, { verdict: 're-tuned', fit: 0.5 }, { verdict: 'scaled copy', fit: 0.1 }, { verdict: 'same shape, own weight', fit: 0.2 }]);
  assert.equal(v.redrawn, 0.25); assert.equal(v.scaled, 0.5); assert.equal(v.worst, 0.35);
  const pr = partRow([
    { dropped: [], added: [], matched: [{ stage: 'place', maxS: 0.5, dC: 0.2, size: 1 }, { stage: 'place', maxS: 0.4, dC: 0.1, size: 1 }] },
    { dropped: [{ closed: 0, len: 3 }], added: [{ closed: 1, len: 1 }], matched: [{ stage: 'shape', maxS: 0.3, dC: 0.6, size: 0.8 }] },
  ]);
  assert.equal(pr.cat.nudged, 0.5); assert.equal(pr.cat['dropped/added'], 0.5);
  assert.equal(pr.matched, 3); assert.equal(pr.place, 2 / 3);
  assert.deepEqual(pr.kd, { 'open line': 1, 'closed shape': 0, dot: 0 });
  assert.deepEqual(pr.ka, { 'open line': 0, 'closed shape': 0, dot: 1 });
});

test('detailTable, strokeRow and pairStat on hand-made census rows', () => {
  const row = (name, grid, parts, extra = {}) => ({ name, grid, parts, seg: { L: parts, C: 0, Q: 0, A: 0 }, own: 2, stroke: 2, W: grid, H: grid, box: { x0: 1, y0: 1, x1: grid - 1, y1: grid - 1 }, margins: { l: 1, t: 1, r: 1, b: 1 }, circleR: null, corners: [], gaps: null, ...extra });
  const T = detailTable([row('a', 24, 2), row('a', 32, 3), row('a', 24, 7), row('b', 24, 2), row('b', 32, 2), row('c', 24, 1)], [24, 32]);   // the first drawing per name and grid stands
  assert.equal(T.n, 2); assert.equal(T.parts[32], 2.5);
  assert.deepEqual(T.step(24, 32), { same: 0.5, more: 0.5, fewer: 0 });
  const s = strokeRow([row('a', 24, 1, { circleR: 10, margins: { l: 2, t: 2, r: 2, b: 2 } }), row('b', 24, 1)], 24);
  assert.equal(s.stroke, 2); assert.equal(s.kl, 22); assert.equal(s.kn, 1); assert.equal(s.marginMode, 1);
  assert.equal(s.ink50, 22); assert.equal(s.whole, 1);
  const g = (fl) => [[fl + 2, 2, 0]];
  const small = new Map([['a', row('a', 24, 1, { gaps: g(1), corners: [[2, 'container', 'arc'], [9, 'detail', 'arc'], [0, 'container', 'sharp']] })]]);
  const big = new Map([['a', row('a', 48, 1, { gaps: g(2), corners: [[5, 'container', 'arc'], [1, 'bend', 'arc']] })]]);
  const ps = pairStat(small, big, 24, 48);
  assert.equal(ps.air.ratio, 2); assert.equal(ps.air.bigger, 1);
  assert.equal(ps.radius.ratio, 2.5); assert.equal(ps.ink.ratio, 46 / 22); assert.equal(ps.grid, 2);
});

test('section aggregations: the thresholds each printed figure depends on', () => {
  // §1: whole-pixel edges, the keyline filter (≥ 0.6 of the canvas), the touch test (≤ 0.5)
  assert.equal(land({ x0: 1, y0: 2.01, x1: 23, y1: 22 }), true);
  assert.equal(land({ x0: 1.1, y0: 2, x1: 23, y1: 22 }), false);
  const row = (o) => ({ own: 2, stroke: 2, W: 24, H: 24, box: { x0: 2, y0: 2, x1: 22, y1: 22 }, margins: { l: 2, t: 2, r: 2, b: 2 }, circleR: null, ...o });
  const small = strokeRow([row({ circleR: 5 }), row({ circleR: 5, margins: { l: 1, t: 2, r: 2, b: 2 } })], 24);     // ⌀ 12 = half the canvas
  assert.ok(Number.isNaN(small.kl), 'a circle under 0.6 of the canvas is not the keyline');
  assert.equal(small.touch, 0, 'a 1 px margin does not touch the edge');
  assert.equal(strokeRow([row({ margins: { l: 0.5, t: 2, r: 2, b: 2 } })], 24).touch, 1);
  // §3: below one stroke (< 0.995), the Pixel band (0.82 or 0.83 at 2 dp), the dot cell's upper median
  const g = (fl, w) => [[fl + w, w, 0]];
  const a = airRow('x', [row({ gaps: g(1.9, 2) }), row({ gaps: g(1.5, 2) }), row({ gaps: g(2.5, 2) })], 24);
  assert.equal(a.below, 2 / 3);                       // 0.95 and 0.75 of a stroke are below; 1.25 is not
  assert.equal(pixelBand([0.82, 0.8299, 0.834, 0.81, 0.8351]), 3);
  assert.deepEqual(dotCell([{ gap: 3, stroke: 2 }, { gap: 1, stroke: 2 }, { gap: 2, stroke: 2 }, { gap: 4, stroke: 2 }]), { n: 4, med: 3, st: 1.5 });
  assert.equal(dotCell([]), null);
  // §4.2: the short-run share (< 3 strokes) and the long one (≥ 10)
  const rs = runShares([[1, 5, 20], []]);
  assert.equal(rs.shortS.length, 1); assert.ok(Math.abs(rs.shortS[0] - 100 / 3) < 1e-9 && Math.abs(rs.longS[0] - 100 / 3) < 1e-9);
  // §4.2 bands: 2.5% unmatched is minor, not unchanged
  const band = (gone) => ({ A: { held: 1, nudged: 0, gone }, B: { held: 1, nudged: 0, gone: 0 }, goneRunsA: [], goneRunsB: [], fit: null });
  const cr = chainRow([band(0.025), band(0.01)], false);
  assert.equal(cr.unchanged, 0.5); assert.equal(cr.minor, 0.5);
  // §3 same concept: 0.2 px more air is "bigger", not "equal"
  const one = (fl, grid) => new Map([['a', row({ W: grid, H: grid, gaps: g(fl, 2), corners: [] })]]);
  const ps = pairStat(one(1, 24), one(1.2, 32), 24, 32);
  assert.equal(ps.air.equal, 0); assert.equal(ps.air.bigger, 1);
  // §6 Kind 1: 0.8 of a stroke is under one stroke
  assert.equal(belowOneStroke([row({ name: 'a', gaps: g(1.6, 2) }), row({ name: 'b', gaps: g(2, 2) })]).length, 1);
  // §2: radius ÷ the MEDIAN stroke
  const cr2 = cornerRow([{ radius: 2, role: 'container', kind: 'arc', stroke: 1, side: 24 }, { radius: 2, role: 'container', kind: 'arc', stroke: 1, side: 24 }, { radius: 3, role: 'container', kind: 'arc', stroke: 2, side: 24 }, { radius: 0, role: 'bend', kind: 'sharp', stroke: 1, side: 24 }]);
  assert.equal(cr2.modal, 2); assert.equal(cr2.perStroke, 2); assert.equal(cr2.sharpBend, 1); assert.equal(cr2.n, 3);
  // §8: a 60° turn between two lines is not a quarter turn
  assert.deepEqual(quarterTurnRadii('M0 0L10 0C12 0 13.5 1.2 14 3L20 13'), []);
});


// ── band edges on both sides, and medians that are not means ────────────────
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
const crow = (o) => ({ own: 2, stroke: 2, W: 24, H: 24, box: { x0: 2, y0: 2, x1: 22, y1: 22 }, margins: { l: 2, t: 2, r: 2, b: 2 }, circleR: null, corners: [], gaps: null, ...o });

test('strokeRow: own-stroke share at 3 dp, the 0.6-canvas keyline floor, margin mode at 2 dp, touch ≤ 0.5, whole pixels < 0.02, median ink', () => {
  const m = (v) => ({ l: v, t: 3, r: 3, b: 3 });
  const rows = [
    crow({ circleR: 6.2, margins: m(0.5) }),                                                         // ⌀ 14.4 = 0.6 × 24: in; touches
    crow({ own: 2, circleR: 6.195, margins: m(0.51), box: { x0: 2.0199, y0: 2, x1: 22, y1: 22 } }),  // ⌀ 14.39: out; 0.51 does not touch; 0.0199 off is whole
    crow({ own: 2.0004, circleR: 9.998, margins: m(1.004), box: { x0: 2.02, y0: 2, x1: 22, y1: 14 } }),  // ⌀ 21.996 → 22.00; 0.02 off is not whole
    crow({ own: 1.5, circleR: 10, margins: m(1), box: { x0: 4, y0: 4, x1: 20, y1: 20 } }),
    crow({ own: 0, margins: m(1), box: { x0: 2, y0: 2, x1: 12, y1: 12 } }),                            // no own stroke: out of the stroke share
  ];
  const s = strokeRow(rows, 24);
  assert.equal(s.n, 5); assert.equal(s.stroke, 2); assert.equal(s.strokeShare, 3 / 4);
  assert.equal(s.kl, 22); assert.equal(s.kn, 2);
  near(s.strokePctKeyline, 100 * 2 / 22); near(s.keylinePctCanvas, 100 * 22 / 24); near(s.strokePctCanvas, 100 * 2 / 24);
  assert.equal(s.marginMode, 1); assert.equal(s.marginShare, 3 / 5);
  assert.equal(s.touch, 1 / 5); assert.equal(s.whole, 4 / 5);
  near(s.ink50, 19.98); near(s.ink50Pct, 100 * 19.98 / 24);              // extents 20, 20, 19.98, 16, 10: the median, not the mean 17.2
});

test('cornerRow: radii at 2 dp, the modal share, radii to 90%, ÷ the median stroke, sharp shares', () => {
  const k = (radius, stroke, role = 'container', kind = 'arc') => ({ radius, role, kind, stroke, side: 24 });
  const r = cornerRow([k(2.004, 1), k(2, 1), k(2, 1), k(3, 2), k(3.004, 2), k(5, 5), k(0, 1, 'container', 'sharp'), k(0, 1, 'container', 'sharp'),
    k(0, 1, 'bend', 'sharp'), k(1, 1, 'bend'), k(1, 1, 'bend'), k(7, 1, 'detail')]);
  assert.equal(r.n, 6); assert.equal(r.modal, 2); assert.equal(r.shareModal, 0.5); assert.equal(r.cover, 3);
  near(r.perStroke, 2 / 1.5);                                            // median of 1,1,1,2,2,5 is 1.5 (the mean is 2)
  near(r.perCanvas, 2 / 24); assert.equal(r.sharpContainer, 0.25); assert.equal(r.nContainer, 8); near(r.sharpBend, 1 / 3); assert.equal(r.nBend, 3);
});

test('airRow and belowOneStroke: the 0.5 px visibility floor, the first pair\'s stroke, interpolated percentiles, below < 0.995', () => {
  const rows = [
    crow({ gaps: [[2.0, 1.5, 0]] }),                   // 0.5 of air: counted (fl 0.5, fs 1/3)
    crow({ gaps: [[1.99, 1.5, 0]] }),                  // 0.49: not visible, the drawing drops out
    crow({ gaps: [[4, 1, 0], [3.5, 2, 1]] }),           // floor 1.5; its stroke is the FIRST pair's (1), not the floor pair's
    crow({ gaps: [[3.99, 2, 0]] }),                    // 0.995 stroke: not below
    crow({ gaps: [[3.988, 2, 0]] }),                   // 0.994 stroke: below
    crow({ gaps: [[6, 2, 0]] }),
  ];
  const a = airRow('t', rows, 24);
  assert.equal(a.n, 5);
  near(a.p5, 0.7); near(a.p10, 0.9); near(a.p25, 1.5); near(a.p50, 1.988);
  near(a.s10, 1 / 3 + 0.4 * (0.994 - 1 / 3)); near(a.s50, 0.995);
  assert.equal(a.below, 2 / 5);
  assert.deepEqual(belowOneStroke(rows).map((o) => o.f.fl), [0.5, 1.988]);
});

test('pairStat: the ±0.1 px equal band, medians of ratios (not means), container-only radius', () => {
  const g = (fl) => [[fl + 2, 2, 0]];
  const ct = (rs) => rs.map((r) => [r, 'container', 'arc']);
  const S = new Map([
    ['a', crow({ gaps: g(1), corners: [...ct([2, 2, 3]), [9, 'bend', 'arc'], [0, 'container', 'sharp']] })],
    ['b', crow({ gaps: g(1), corners: ct([2]) })],
    ['c', crow({ gaps: g(2), box: { x0: 2, y0: 2, x1: 12, y1: 12 } })],
    ['d', crow({ gaps: g(1), corners: ct([1]) })],
    ['e', crow({ gaps: null })],
  ]);
  const B = new Map([
    ['a', crow({ W: 32, H: 32, gaps: g(1.0625), corners: ct([2.0625]), box: { x0: 1, y0: 1, x1: 31, y1: 31 } })],   // +0.0625: equal
    ['b', crow({ W: 32, H: 32, gaps: g(1.125), corners: ct([3]), box: { x0: 4, y0: 4, x1: 28, y1: 28 } })],         // +0.125: bigger
    ['c', crow({ W: 32, H: 32, gaps: g(1.875), corners: ct([2]) })],                                                 // −0.125: smaller
    ['d', crow({ W: 32, H: 32, gaps: g(3), corners: ct([1.125]) })],
    ['e', crow({ W: 32, H: 32, gaps: g(1) })],
  ]);
  const p = pairStat(S, B, 24, 32);
  assert.equal(p.air.n, 4); near(p.air.ratio, (1.0625 + 1.125) / 2);
  assert.equal(p.air.equal, 0.25); assert.equal(p.air.bigger, 0.5); assert.equal(p.air.smaller, 0.25);
  assert.equal(p.radius.n, 3); near(p.radius.ratio, 1.125); near(p.radius.equal, 1 / 3);
  assert.equal(p.ink.n, 5); near(p.ink.ratio, 1.2);                       // ratios 1.5, 1.2, 2, 1, 1: median 1.2 (mean 1.34)
  near(p.share.small, 20 / 24); near(p.share.big, 20 / 32); near(p.grid, 32 / 24);
});

test('chainRow: the 2 % / 5 % / 10 % edges on both sides, mean bands, median fit', () => {
  const P = [[0.9, 0.1, 0.02, 0, 0.5], [0.2, 0.5, 0.021, 0, 1], [0.3, 0.6, 0.1, 0, 2], [0.4, 0.4, 0.101, 0, 4], [1, 0, 0.05, 0.051, null], [0.5, 0.3, 0.06, 0, 8]]
    .map(([held, nudged, ga, gb, s]) => ({ A: { held, nudged, gone: ga }, B: { held: 1, nudged: 0, gone: gb }, goneRunsA: [], goneRunsB: [], fit: s ? { s } : null }));
  const r = chainRow(P, false);
  near(r.held, 0.55); near(r.nudged, 1.9 / 6); near(r.bigGone, 0.352 / 6);          // means (the held median would be 0.45)
  near(r.unchanged, 1 / 6); near(r.minor, 4 / 6); near(r.changed, 1 / 6); near(r.over5, 4 / 6);
  near(r.bigDetail, 3 / 6); near(r.smallDetail, 1 / 6);                                // 0.05 is not over 5%; 0.06 is
  near(r.fit, 0.5);                                                     // 1/s = 2, 1, 0.5, 0.25, 0.125: median 0.5 (mean 0.775)
});

test('runShares, verdictRow, partRow, pairCategory, partKind: edges and interpolated percentiles', () => {
  const rs = runShares([[2.9, 3, 9.9, 10, 1]]);
  near(rs.shortS[0], 40); near(rs.longS[0], 20);
  const v = verdictRow([0.2, 0.4, 0.6, 3].map((fit, i) => ({ fit, verdict: ['redrawn', 're-tuned', 'scaled copy', 'redrawn'][i] })).concat([{ fit: null, verdict: 'same shape, own weight' }]));
  near(v.worst, 0.5); near(v.p90, 0.6 + 0.7 * 2.4); assert.equal(v.redrawn, 0.4); assert.equal(v.scaled, 0.4); assert.equal(v.retuned, 0.2);
  const mk = (maxS, stage = 'place', dC = 0, size = 1) => ({ stage, maxS, dC, size });
  assert.equal(pairCategory({ dropped: [], added: [], matched: [mk(0.1)] }), 'pure');
  assert.equal(pairCategory({ dropped: [], added: [], matched: [mk(0.1001)] }), 'nudged');
  assert.equal(pairCategory({ dropped: [], added: [], matched: [mk(1.0)] }), 'nudged');
  assert.equal(pairCategory({ dropped: [], added: [], matched: [mk(1.0001)] }), 'reshaped');
  assert.equal(partKind({ closed: 0, len: 2 }), 'open line'); assert.equal(partKind({ closed: 0, len: 1.99 }), 'dot');
  assert.equal(partKind({ closed: 1, len: 2 }), 'closed shape'); assert.equal(partKind({ closed: 1, len: 1.99 }), 'dot');
  const pr = partRow([{ dropped: [], added: [], matched: [mk(0.2, 'place', 0, 0.5), mk(0.4, 'place', 1, 1), mk(0.6, 'shape', 2, 2), mk(3, 'place', 7, null)] }]);
  near(pr.dC[0], 1.5); near(pr.dC[1], 5.5); near(pr.dev[0], 0.5); near(pr.dev[1], 0.6 + 0.7 * 2.4);
  near(pr.size[0], 0.6); near(pr.size[1], 1); near(pr.size[2], 1.8); near(pr.place, 0.75);
});

test('land, pixelBand, dotCell, trend: edges and the upper median', () => {
  assert.equal(land({ x0: 2.0199, y0: 2, x1: 22, y1: 22 }), true); assert.equal(land({ x0: 2.0201, y0: 2, x1: 22, y1: 22 }), false);
  assert.equal(land({ x0: 1.9801, y0: 2, x1: 22, y1: 22 }), true); assert.equal(land({ x0: 2, y0: 2, x1: 22, y1: 21.979 }), false);
  assert.equal(pixelBand([0.8149, 0.8151, 0.82, 0.83, 0.8349, 0.8351]), 4);
  assert.equal(dotCell([{ gap: 1, stroke: 1 }, { gap: 3, stroke: 1 }, { gap: 2, stroke: 1 }]).med, 2);
  assert.equal(dotCell([{ gap: 1, stroke: 1 }, { gap: 1, stroke: 1 }, { gap: 1, stroke: 1 }, { gap: 9, stroke: 1 }]).med, 1);
  assert.equal(trend([8.3, 12.5]), 'rises'); assert.equal(trend([8.3, 6.2, 4.2]), 'falls'); assert.equal(trend([2, 3, 2]), 'holds');
});

test('quarterTurnRadii: the ±3° window on both sides, the radius from the chord at the quarter', () => {
  const corner = (deg) => {          // a line along +x, a cubic turning by `deg`, a line on along the new direction
    const t = (deg * Math.PI) / 180, e = [10 + 2 * Math.sin(t), 2 - 2 * Math.cos(t)], k = 0.8;
    return `M0 0L10 0C${10 + k} 0 ${e[0] - k * Math.cos(t)} ${e[1] - k * Math.sin(t)} ${e[0]} ${e[1]}L${e[0] + 5 * Math.cos(t)} ${e[1] + 5 * Math.sin(t)}`;
  };
  assert.equal(quarterTurnRadii(corner(87.1)).length, 1); assert.equal(quarterTurnRadii(corner(86.9)).length, 0);
  assert.equal(quarterTurnRadii(corner(92.9)).length, 1); assert.equal(quarterTurnRadii(corner(93.1)).length, 0);
  assert.deepEqual(quarterTurnRadii('M0 0L10 0C11.1 0 12 0.9 12 2L12 9'), [2]);                 // chord 2√2 → 2
  assert.deepEqual(quarterTurnRadii('M0 0L10 0C11.24 0 12.26 0.98 12.26 2.26L12.26 9'), [2.25]); // chord ÷ √2 = 2.26 → the quarter below
});

test('inkCompare: the quarter-stroke and one-stroke bands on both sides', () => {
  const at = (dy) => inkCompare(rec('<path d="M4 12h16"/>'), rec(`<path d="M4 ${12 + dy}h16"/>`));
  assert.equal(at(0.375).A.held, 1);                 // exactly ¼ of the 1.5 stroke: held
  assert.equal(at(0.4).A.nudged, 1);
  assert.equal(at(1.5).A.nudged, 1);                 // exactly one stroke: nudged
  assert.equal(at(1.6).A.gone, 1);
});

test('dotGap: the 1.7-stroke dot test on both sides', () => {
  assert.ok(dotGap(rec('<path d="M12 6v8"/><path d="M12 17.5h0.94"/>'), 1.5, { nucleo: false }) != null);   // 0.94 + 1.5 ≤ 2.55
  assert.equal(dotGap(rec('<path d="M12 6v8"/><path d="M12 17.5h1.06"/>'), 1.5, { nucleo: false }), null);    // 2.56: not a dot
});

test('curves are read as curves, not by their control points (geometry.mjs cubic sampling is not on this path)', () => {
  const d = 'M0 0C0 10 10 10 10 0';
  const b = bboxOf(normalisePath(d)); near(b.y1 - b.y0, 7.5);                                   // control points would say 10
  near(Math.max(...sampleSegs(normalisePath(d), 0.01).flatMap((s) => s.pts.map((p) => p[1]))), 7.5, 1e-3);
  const r = summarise(rec(`<path d="${d.replace('M0 0', 'M4 8').replace('C0 10 10 10 10 0', 'C4 18 14 18 14 8')}"/>`));
  near(r.box.y1 - r.box.y0, 7.5 + 1.5);
  const k = 0.5523 * 3;   // a quarter-circle corner of radius 3 drawn as a cubic: cornersOf reads ~3, not the control-point hull
  const c = cornersOf(`M2 5H15C${15 + k} 5 18 ${8 - k} 18 8V20`);
  assert.ok(c.some((x) => Math.abs(x.radius - 3) < 0.05), JSON.stringify(c.map((x) => x.radius)));
});

test('exact band edges: values that sit on the threshold as doubles', () => {
  // below one stroke is < 0.995: 199 / 200 is that double exactly
  assert.equal(airRow('t', [crow({ gaps: [[399, 200, 0]] }), crow({ gaps: [[398.9, 200, 0]] })], 24).below, 0.5);
  assert.deepEqual(belowOneStroke([crow({ name: 'a', gaps: [[399, 200, 0]] }), crow({ name: 'b', gaps: [[398.9, 200, 0]] })]).map((o) => o.r.name), ['b']);
  // whole pixel is |v − round(v)| < 0.02: 0.02 itself is not whole
  assert.equal(land({ x0: 0.02, y0: 2, x1: 22, y1: 22 }), false);
  // the keyline floor is ≥ 0.6 of the canvas: ⌀ 6 on a 10 canvas is in, ⌀ 5.99 out
  const kl = strokeRow([crow({ W: 10, H: 10, circleR: 2, stroke: 2 }), crow({ W: 10, H: 10, circleR: 1.995, stroke: 2 })], 10);
  assert.equal(kl.kl, 6); assert.equal(kl.kn, 1);
  // same-concept radius equal is ≤ 0.1: 0.225 − 0.125 is 0.1 exactly
  const ct = (r) => [[r, 'container', 'arc']];
  const pr = pairStat(new Map([['a', crow({ corners: ct(0.125) })], ['b', crow({ corners: ct(1) })]]), new Map([['a', crow({ corners: ct(0.225) })], ['b', crow({ corners: ct(1.105) })]]), 24, 32);
  assert.equal(pr.radius.equal, 0.5);
  // air equal ≤ 0.1 px (the exact tie is unreachable above the 0.5 floor; 0.105 is bigger, not equal)
  const fl = (v) => [[v + 2, 2, 0]];
  const pa = pairStat(new Map([['a', crow({ gaps: fl(1) })]]), new Map([['a', crow({ gaps: fl(1.105) })]]), 24, 32);
  assert.equal(pa.air.equal, 0); assert.equal(pa.air.bigger, 1);
  // over 5 % is > 0.05, on the bigger side and the smaller side
  const P = [[0.05, 0.05], [0.0501, 0], [0, 0.0501]].map(([ga, gb]) => ({ A: { held: 1, nudged: 0, gone: ga }, B: { held: 1, nudged: 0, gone: gb }, goneRunsA: [], goneRunsB: [], fit: null }));
  const cr = chainRow(P, false);
  near(cr.over5, 2 / 3); near(cr.bigDetail, 1 / 3); near(cr.smallDetail, 1 / 3); near(cr.minor, 1);
  // the touch format: one decimal under 1 %, whole from 1 %
  assert.equal(touchFmt(0.01), '1%'); assert.equal(touchFmt(0.0099), '1.0%'); assert.equal(touchFmt(0.003), '0.3%'); assert.equal(touchFmt(0), '0%'); assert.equal(touchFmt(0.0105), '1%');
  // K2: one stroke_max value per set and grid
  assert.equal(oneValuePerSetGrid([{ t: 'A', g: 24, v: 2 }, { t: 'A', g: 32, v: 2 }, { t: 'B', g: 30, v: 4 }]), true);
  assert.equal(oneValuePerSetGrid([{ t: 'A', g: 24, v: 2 }, { t: 'B', g: 30, v: 4 }, { t: 'B', g: 30, v: 3 }]), false);
});

test('gapsOf, roleOf, the keyline probe and the dot test: thresholds on both sides', () => {
  const two = (dy, w = 2) => gapsOf(ourRecord(`<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${w}"><path d="M4 0h16"/><path d="M4 ${dy}h16"/></svg>`), 24);
  assert.equal(two(0.6).length, 0, 'd = 0.3 w is a join');
  assert.equal(two(0.61).length, 1);
  assert.equal(two(0.63).length, 1, '0.63 is air, not a join (a 0.33 w join band would drop it)');
  const ends = gapsOf(rec('<path d="M4 10h6"/><path d="M10.5 11h6"/>'), 24);        // end to end: the clamped segment distance
  near(ends[0].d, Math.hypot(0.5, 1));
  const ink = { x0: 0, y0: 0, x1: 10, y1: 10 };
  const c = (bw, fill, tangentError = 0, corners = 4, closed = true) => ({ tangentError, convex: true, legs: [5, 5], subInfo: { bbox: { x0: 0, y0: 0, x1: bw, y1: bw }, closed, fill, corners } });
  assert.equal(roleOf(c(6, 1), ink, 1), 'container'); assert.equal(roleOf(c(5.99, 1), ink, 1), 'detail');
  assert.equal(roleOf(c(6, 0.7, 0, 4, false), ink, 1), 'container'); assert.notEqual(roleOf(c(6, 0.69, 0, 4, false), ink, 1), 'container');
  assert.equal(roleOf(c(6, 1, 5), ink, 1), 'container'); assert.equal(roleOf(c(6, 1, 5.01), ink, 1), 'ambiguous');
  assert.equal(roleOf(c(3, 0.2, 0, 3, false), ink, 1), 'bend'); assert.equal(roleOf(c(3, 0.2, 0, 4, false), ink, 1), 'ambiguous');
  assert.equal(roleOf({ ...c(6, 1), legs: [1, 5] }, ink, 1), 'container'); assert.equal(roleOf({ ...c(6, 1), legs: [0.99, 5] }, ink, 1), 'ambiguous');
  const circ = (turnDeg, n, kind = 'arc') => summarise({ canvas: [24, 24], paths: [], strokeBasis: { value: 2 }, strokeWidth: 2, measure: { ink: null, margins: null, radii: [{ kind, turnDeg, n, circular: true, r: { abs: 9 } }] } }).circleR;
  assert.equal(circ(179, 2), 9); assert.equal(circ(178.99, 2), null); assert.equal(circ(180, 1), null); assert.equal(circ(0, 1, 'circle'), 9);
  const stem = (x, w = 1) => `<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${w}"><path d="M0 0L0 10"/><path d="M${x} 5L${x} 5"/></svg>`;
  near(dotGap(ourRecord(stem(1.21)), 1, { nucleo: false }), 0.21, 1e-3);      // centre 1.21 away, minus the dot's 0.5 and the stem's 0.5
  assert.equal(dotGap(ourRecord(stem(1.19)), 1, { nucleo: false }), null);      // 0.19 of air: under the 0.2 floor
  near(dotGap(ourRecord(stem(6.9)), 1, { nucleo: false }), 5.9, 1e-3);
  assert.equal(dotGap(ourRecord(stem(7.3)), 1, { nucleo: false }), null);       // 6.3: not a stem neighbour
  const dot = (len) => `<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M0 0L0 10"/><path d="M2 13h${len}"/></svg>`;
  assert.ok(dotGap(ourRecord(dot(1.4)), 2, { nucleo: false }) != null, 'diag 1.4 + stroke 2 = 1.7 strokes is a dot');
  assert.equal(dotGap(ourRecord(dot(1.41)), 2, { nucleo: false }), null);
});

test('matchParts: the place band (mean ≤ 0.75, max ≤ 1.5 strokes) and the shape fit\'s scale range', () => {
  const line = (y, x0 = 0.1, x1 = 0.9, n = 81) => Array.from({ length: n }, (_, i) => [x0 + ((x1 - x0) * i) / (n - 1), y]);
  const part = (pts, closed = false) => ({ pts, closed });
  const at = (A, B, S = 0.1) => matchParts({ parts: [part(A)] }, { parts: [part(B)] }, S);
  assert.equal(at(line(0.5), line(0.575)).pairs[0]?.stage, 'place');           // offset 0.075 = 0.75 S
  assert.notEqual(at(line(0.5), line(0.576)).pairs[0]?.stage, 'place');
  assert.equal(at(line(0.5), [...line(0.5), [0.5, 0.65]]).pairs[0]?.stage, 'place');     // one point 1.5 S away
  assert.equal(at(line(0.5), [...line(0.5), [0.5, 0.651]]).pairs.length, 0);           // 1.51 S: not in place, and no fit removes the stray point
  const scaled = (k) => line(0.5, 0.5 - 0.4 * k, 0.5 + 0.4 * k).map(([x]) => [x, 0.5 + 0.1 * 0]);
  const zig = (k) => { const p = []; for (let i = 0; i <= 40; i++) p.push([0.5 + (i / 40 - 0.5) * 0.4 * k, 0.5 + ((i % 2) - 0.5) * 0.02 * k]); return p; };
  const A = zig(1);
  const fitOnly = (k) => at(A, zig(k), 0.02);                                    // too far apart to sit in place: only the fit can pair them
  assert.equal(fitOnly(1 / 3.2).pairs[0]?.stage, 'shape', 'a part a 3.2th the size is found by the fit');
  assert.equal(fitOnly(1 / 3.4).pairs.length, 0, 'beyond 3.3× it is not');
  assert.equal(fitOnly(3.2).pairs[0]?.stage, 'shape'); assert.equal(fitOnly(3.4).pairs.length, 0);
  void scaled;
});

// ── the CLI on a fake pin and a fake Nucleo library (HOME redirected) ────────
function fakeWorld() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nucleo-probe-'));
  const pin = path.join(root, 'pin');
  for (const m of [24, 20, 16]) {
    fs.mkdirSync(path.join(pin, 'src/icons', String(m)), { recursive: true });
    const w = m === 16 ? 1.25 : 1.5, c = m / 2;
    fs.writeFileSync(path.join(pin, 'src/icons', String(m), 'minus.svg'), svg(`<path stroke-width="${w}" d="M4 ${c}h${m - 8}"/>`, m));
    fs.writeFileSync(path.join(pin, 'src/icons', String(m), 'minus-filled.svg'), svg(`<path d="M4 ${c}h${m - 8}"/>`, m));
  }
  const lib = path.join(root, 'home', 'Library/Application Support/Nucleo/icons');
  fs.mkdirSync(lib, { recursive: true });
  return { root, pin, lib, home: path.join(root, 'home') };
}
async function fakeLibrary(lib) {
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(path.join(lib, 'data.sqlite3'));
  db.exec(`CREATE TABLE groups (id integer primary key, title varchar(255));
    CREATE TABLE sets (id integer primary key, title varchar(255), group_id integer, local boolean);
    CREATE TABLE icons (id integer primary key, set_id integer, klass varchar(255), grid integer, width integer, height integer, size integer, name varchar(255), tags varchar(255), nucleo_tags varchar(255), stroke_max integer, corner_custom integer default 0);
    INSERT INTO groups VALUES (1, 'Nucleo UI'), (2, 'Nucleo Core');
    INSERT INTO sets VALUES (10, 'UI/Layout', 1, 0), (11, 'Core/Layout', 2, 0);`);
  let id = 100;
  const add = (set, grid, name, body) => {
    id++;
    db.prepare('INSERT INTO icons (id, set_id, klass, grid, width, height, size, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, set, 'outline', grid, grid, grid, 0, name);
    fs.mkdirSync(path.join(lib, 'sets', String(set)), { recursive: true });
    const w = set === 10 ? 1.5 : 2;
    fs.writeFileSync(path.join(lib, 'sets', String(set), `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${grid} ${grid}"><g fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round">${body(grid)}</g></svg>`);
  };
  for (const g of [24, 32, 48]) { add(11, g, 'minus', (s) => `<line x1="2" y1="${s / 2}" x2="${s - 2}" y2="${s / 2}"/>`); add(11, g, 'equals', (s) => `<line x1="2" y1="${s / 2 - 3}" x2="${s - 2}" y2="${s / 2 - 3}"/><line x1="2" y1="${s / 2 + 3}" x2="${s - 2}" y2="${s / 2 + 3}"/>`); }
  for (const g of [12, 18]) add(10, g, 'minus', (s) => `<line x1="1" y1="${s / 2}" x2="${s - 1}" y2="${s / 2}"/>`);
  db.close();
}

test('matchParts, dotGap, inkCompare, cornerStroke: ties on the threshold and the shape stage on both sides', () => {
  // place stage: mean ≤ 0.75 S and max ≤ 1.5 S, met exactly (S = 0.125: every distance is a dyadic double)
  const line = (y, x0 = 0.1, x1 = 0.9, n = 81) => Array.from({ length: n }, (_, i) => [x0 + ((x1 - x0) * i) / (n - 1), y]);
  const part = (pts, closed = false) => ({ pts, closed });
  const one = (A, B, S) => matchParts({ parts: [part(A)] }, { parts: [part(B)] }, S);
  assert.equal(one(line(0.5), line(0.59375), 0.125).pairs[0]?.stage, 'place');            // every point 0.09375 = 0.75 S away
  const spike = line(0.5); spike[40] = [spike[40][0], 0.6875];                              // one point 0.1875 = 1.5 S away
  assert.equal(one(line(0.5), spike, 0.125).pairs[0]?.stage, 'place');
  assert.notEqual(one(line(0.5), spike, 0.124).pairs[0]?.stage, 'place');
  // shape stage: after the uniform fit, max ≤ 0.5 S and mean ≤ 0.25 S
  const ell = [...Array.from({ length: 41 }, (_, i) => [0.1, 0.1 + i * 0.005]), ...Array.from({ length: 40 }, (_, i) => [0.105 + i * 0.005, 0.3])];
  const far = (P, f = (p, i) => p) => P.map((p, i) => f([0.35 + 2 * p[0], 0.35 + 2 * p[1]], i));
  const bump = far(ell, (p, i) => (i === 20 ? [p[0] - 0.03, p[1]] : p));                    // one point pushed off the line
  const fb = fitSimilarity(ell, bump);
  assert.ok(fb.c.mean < 0.1 * fb.c.max, 'one bump: the mean stays far under the max');
  assert.equal(one(ell, bump, fb.c.max / 0.49).pairs[0]?.stage, 'shape');                  // max = 0.49 S: kept
  assert.equal(one(ell, bump, fb.c.max / 0.52).pairs.length, 0);                            // max = 0.52 S: no counterpart
  const zig = far(ell, (p, i) => (i < 41 ? [p[0] + (i % 2 ? 0.012 : -0.012), p[1]] : [p[0], p[1] + (i % 2 ? 0.012 : -0.012)]));
  const fz = fitSimilarity(ell, zig);
  assert.ok(fz.c.max / fz.c.mean < 1.9, 'zigzag: the max stays under twice the mean');
  assert.equal(one(ell, zig, fz.c.mean / 0.24).pairs[0]?.stage, 'shape');                   // mean = 0.24 S: kept
  assert.equal(one(ell, zig, fz.c.mean / 0.26).pairs.length, 0);                            // mean = 0.26 S: no counterpart
  // the dot test met exactly: diag 0.5 + its own stroke 1.2 = 1.7 strokes of 1
  const dotW = (w) => ourRecord(`<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1"><path d="M0 0L0 10"/><path d="M2 13h0.5" stroke-width="${w}"/></svg>`);
  near(dotGap(dotW(1.2), 1, { nucleo: false }), 2.4, 1e-9);                                  // hypot(2.25, 3) − 0.85 − 0.5
  assert.equal(dotGap(dotW(1.2001), 1, { nucleo: false }), null);
  // dot-to-stem air exactly 0.2 and exactly 6 (filled parts, so no half-strokes come off)
  const air = (y) => ourRecord(`<svg viewBox="0 0 24 24" fill="#000" stroke="none"><path d="M-1 0H1"/><path d="M0 ${y}h0"/></svg>`);
  assert.equal(dotGap(air(0.2), 1, { nucleo: false }), null);                               // ours: 0.2 is not over the floor
  assert.equal(dotGap(air(0.2), 1, { nucleo: true }), 0.2);                                 // Nucleo: 0.2 is kept, under 0.2 is not
  assert.equal(dotGap(air(0.1875), 1, { nucleo: true }), null);
  assert.equal(dotGap(air(6), 1, { nucleo: false }), null);                                 // ours: 6 is not under the ceiling
  assert.equal(dotGap(air(6), 1, { nucleo: true }), 6);                                     // Nucleo: 6 is kept, over 6 is not
  assert.equal(dotGap(air(6.25), 1, { nucleo: true }), null);
  assert.equal(dotGap(air(0.25), 1, { nucleo: true }), 0.25);
  // a zero-length dot that is gone ink is not a run
  const gone = inkCompare(rec('<path d="M4 12h16"/><path d="M12 20h0"/>'), rec('<path d="M4 12h16"/>'));
  assert.ok(gone.A.gone > 0);
  assert.deepEqual(gone.goneRunsA, []);
  assert.deepEqual(inkCompare(rec('<path d="M4 12h16"/>'), rec('<path d="M4 12h16"/><path d="M12 20h0"/>')).goneRunsB, []);
  const goneBar = inkCompare(rec('<path d="M4 12h16"/><path d="M8 20h4"/>'), rec('<path d="M4 12h16"/>'));
  assert.deepEqual(goneBar.goneRunsA, [2.7]);                                               // 4 units ÷ a stroke of 1.5
  // the stroke a §2 corner is divided by
  assert.equal(cornerStroke({ own: 1.5, stroke: 2 }), 1.5);
  assert.equal(cornerStroke({ own: 0, stroke: 2 }), 2);
  assert.equal(cornerStroke({ own: -1, stroke: 2 }), 2);
});

test('precision and parameters: radii, strokes, keylines and margins at the printed decimals; the leg floor; the census rounding', () => {
  // §2 counts container radii at 2 dp: 2.04 and 2.044 are one radius, 2.06 another (1 dp would merge all three, 3 dp split them)
  const k = (radius) => ({ radius, role: 'container', kind: 'arc', stroke: 2, side: 24 });
  const cr = cornerRow([k(2.04), k(2.044), k(2.06)]);
  assert.equal(cr.modal, 2.04); near(cr.shareModal, 2 / 3); assert.equal(cr.cover, 2);
  // §1: own stroke shared at 3 dp (2.0004 joins 2, 2.004 does not); keyline ⌀ and margins at 2 dp (x.004 joins x, x.04 does not)
  const m = (v) => ({ l: v, t: 3, r: 3, b: 3 });
  const s = strokeRow([crow({ own: 2, circleR: 9, margins: m(1) }), crow({ own: 2, circleR: 9.002, margins: m(1.004) }), crow({ own: 2.0004, circleR: 9.02, margins: m(1.04) }),
    crow({ own: 2.004, circleR: 9.02, margins: m(1.04) }), crow({ own: 2.004, circleR: 9.02, margins: m(1.04) })], 24);
  assert.equal(s.stroke, 2); near(s.strokeShare, 3 / 5);                                  // the mode of the raw values is 2 (the smaller of two modes)
  assert.equal(s.kl, 20.04); assert.equal(s.kn, 3);                                       // ⌀ 20, 20.004 → 20.00 (2); 20.04 (3)
  assert.equal(s.marginMode, 1.04); near(s.marginShare, 3 / 5);
  // the container corner's legs must reach side ÷ 24 (1 at 24): legs 1.1 and 1 make a container, 0.95 does not
  const rr = (r, L) => { const a = 2, b = 2 + 2 * r + L; return `<path d="M${a + r} ${a}H${a + r + L}A${r} ${r} 0 0 1 ${b} ${a + r}V${a + r + L}A${r} ${r} 0 0 1 ${a + r + L} ${b}H${a + r}A${r} ${r} 0 0 1 ${a} ${a + r + L}V${a + r}A${r} ${r} 0 0 1 ${a + r} ${a}Z"/>`; };
  const roles = (r, L) => summarise(rec(rr(r, L))).corners.map((c) => c[1]);
  assert.deepEqual(roles(4, 1.1), ['container', 'container', 'container', 'container']);
  assert.deepEqual(roles(4, 1), ['container', 'container', 'container', 'container']);
  assert.ok(!roles(4, 0.95).includes('container'));
  assert.equal(summarise(rec(rr(4, 1.1), 48)).corners.some((c) => c[1] === 'container'), false);     // at 48 the floor is 2
  // the census keeps corner radii at 3 dp, and its turn in whole degrees
  const c0 = summarise(rec(rr(2.1354, 6))).corners[0];                                   // the record keeps 6 dp; the census 3
  assert.equal(c0[0], 2.135); assert.equal(c0[3], 90);
  // the card's sampling steps and the leg floor, as fractions of the canvas side
  assert.deepEqual(STEP, { air: 48, ink: 240, parts: 200, dot: 400 }); assert.equal(MIN_LEG, 24);
  // lengths as the tables write them, ink shares at one decimal
  assert.equal(lengthFmt(22), '22'); assert.equal(lengthFmt(2.5), '2.5'); assert.equal(lengthFmt(1.125), '1.12'); assert.equal(lengthFmt(18.504), '18.5');
  assert.equal(inkPct(100), '100'); assert.equal(inkPct(99.96), '100'); assert.equal(inkPct(81.25), '81.2'); assert.equal(inkPct(91.66), '91.7');
  // part and dot readings keep 3 dp (part lengths 2): a part moved one unit (2/3 stroke), a dropped part 4 units long
  const p = partsCompare(rec('<path d="M4 12h16"/><path d="M12 4v4"/>'), rec('<path d="M4 13h16"/>'));
  assert.equal(p.matched[0].dC, 0.667); assert.equal(p.matched[0].maxS, 0.667); assert.equal(p.dropped[0].len, 2.67);
  const resized = partsCompare(rec('<path d="M4 4v12h12"/>'), rec('<path d="M4 4v8h8"/>')).matched[0];   // two thirds the size, found by the shape fit
  assert.equal(resized.stage, 'shape'); assert.equal(resized.size, 0.667); assert.equal(resized.dC, 2.108);
  assert.equal(inkCompare(rec('<path d="M4 4v12h12"/>'), rec('<path d="M4 4v11h11"/>')).fit.s, 1.0911);       // the fit's scale kept at 4 dp
  const st = (x) => `<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1"><path d="M0 0L0 10"/><path d="M${x} 5L${x} 5"/></svg>`;
  assert.equal(dotGap(ourRecord(st(2.2345)), 1, { nucleo: false }), 1.235);
  // gone runs in the other direction too, at 1 dp of a stroke
  assert.deepEqual(inkCompare(rec('<path d="M4 12h16"/>'), rec('<path d="M4 12h16"/><path d="M8 20h4"/>')).goneRunsB, [2.7]);
  // a pair whose every part is pure scaling is counted as such
  const pure = partRow([{ dropped: [], added: [], matched: [{ stage: 'place', maxS: 0.05, dC: 0, size: 1 }] }, { dropped: [], added: [], matched: [{ stage: 'place', maxS: 0.5, dC: 0, size: 1 }] }]);
  assert.equal(pure.cat.pure, 0.5); assert.equal(pure.cat.nudged, 0.5);
  // value counts: by count, ties by value; percentiles skip NaN and null
  assert.deepEqual(valueCounts([3, 3, 2, 2, 1]), [[2, 2], [3, 2], [1, 1]]); assert.deepEqual(valueCounts([1.8, 1.8, 1.5, 1.5]), [[1.5, 2], [1.8, 2]]);
  assert.equal(percentile([1, NaN, 3, null], 50), 2);
  // a canvas that is not square reads at its shorter side (the leg floor 20 ÷ 24 here, so legs of 0.9 make a container)
  const rrect = (r, L) => { const a = 2, b = 2 + 2 * r + L; return `<path d="M${a + r} ${a}H${a + r + L}A${r} ${r} 0 0 1 ${b} ${a + r}V${a + r + L}A${r} ${r} 0 0 1 ${a + r + L} ${b}H${a + r}A${r} ${r} 0 0 1 ${a} ${a + r + L}V${a + r}A${r} ${r} 0 0 1 ${a + r} ${a}Z"/>`; };
  const wide = ourRecord(svg(rrect(4, 0.9), 24).replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 20"'));
  assert.deepEqual(summarise(wide).corners.map((c) => c[1]), ['container', 'container', 'container', 'container']);
  assert.equal(partsOf(wide).side, 20); assert.equal(inkOf(wide).side, 20);
  // the census counts each segment kind, and reads corners and air on stroked paths only
  assert.deepEqual(summarise(rec('<path d="M2 2L10 2C12 2 12 4 12 6Q12 8 10 8A2 2 0 0 1 8 6Z"/>')).seg, { L: 1, C: 1, Q: 1, A: 1, Z: 1 });
  const filled = summarise(ourRecord('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2H20V20H2Z" fill="#000"/><path d="M4 12h6" stroke="#000" stroke-width="1.5" fill="none"/></svg>'));
  assert.deepEqual(filled.corners, []); assert.deepEqual(filled.gaps, []);
  // a sub-path of one point: air measured to the point itself (census), and Nucleo's dot test reads it as a point
  assert.equal(gapsOf(rec('<path d="M4 4h10"/><path d="M8 8"/>'), 24)[0].d, 4);
  assert.equal(dotGap(ourRecord('<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1"><path d="M0 10" stroke-width="2"/><path d="M2 13h0.5"/></svg>'), 1, { nucleo: true }), 2);
  // the fit's scale is taken on the ink both drawings share, not on gone ink
  assert.equal(inkCompare(rec('<path d="M4 4v12h12"/><path d="M20 4v4"/>'), rec('<path d="M4 4v11h11"/>')).fit.s, 1.0911);
  assert.equal(inkCompare(rec('<path d="M4 4v11h11"/>'), rec('<path d="M4 4v12h12"/><path d="M20 4v4"/>')).fit.s, 0.9161);
  // §8: a quarter arc that starts at 30° (its end tangents are not on the axes) is one quarter-turn corner of radius 3
  assert.deepEqual(quarterTurnRadii('M17.598076 8.5L14.598076 13.5A3 3 0 0 1 10.5 14.598076L6.5 12.598076'), [3]);
  assert.deepEqual(quarterTurnRadii('M17.598076 8.5L14.598076 13.5A3 3 30 0 1 10.5 14.598076L6.5 12.598076'), [3]);   // the same arc written with a rotation
  // our stroke is the first stroked path's
  assert.equal(ourRecord('<svg viewBox="0 0 24 24" fill="none" stroke="#000"><path d="M4 4h10" stroke-width="1.5"/><path d="M4 8h10" stroke-width="2"/></svg>').strokeBasis.value, 1.5);
  // the §8 port of svgpathtools: S and T reflect the previous control point, Q and A keep theirs, Z closes with a line
  assert.deepEqual(svgptSegments('M0 0C0 2 2 4 4 4S8 2 8 0Q10 0 10 2T10 6A2 3 0 0 1 14 6Z'), [
    { t: 'C', p0: [0, 0], c1: [0, 2], c2: [2, 4], p1: [4, 4] }, { t: 'C', p0: [4, 4], c1: [6, 4], c2: [8, 2], p1: [8, 0] },
    { t: 'Q', p0: [8, 0], c: [10, 0], p1: [10, 2] }, { t: 'Q', p0: [10, 2], c: [10, 4], p1: [10, 6] },
    { t: 'A', p0: [10, 6], rx: 2, ry: 3, phi: 0, fa: 0, fs: 1, p1: [14, 6] }, { t: 'L', p0: [14, 6], p1: [0, 0] }]);
  // a path at opacity 0 is not a part
  const op = (o) => ({ canvas: [24, 24], strokeBasis: { value: 2 }, paths: [{ d: 'M4 12h16', prim: 'path', opacity: o }, { d: 'M4 6h16', prim: 'path', opacity: 1 }] });
  assert.equal(partsOf(op(0)).parts.length, 1); assert.equal(partsOf(op(0.13)).parts.length, 2);
  // the cells and grids the sections quote, member by member and in order
  assert.deepEqual(CORE_KEYS, ['Core 24', 'Core 32', 'Core 48']); assert.deepEqual(UI_KEYS, ['UI 18', 'UI 12']); assert.deepEqual(OUR_KEYS, ['Ours 24', 'Ours 20', 'Ours 16']);
  assert.deepEqual(SIX_KEYS, ['Core 24', 'Core 32', 'Core 48', 'UI 18', 'UI 12', 'Micro Bold 20']);
  assert.deepEqual(SIZE_CHAINS, ['core24_core32', 'core32_core48', 'core24_core48', 'ui18_ui12']);
  assert.deepEqual([CORE_GRIDS, UI_GRIDS, OUR_MASTERS, OUR_UP], [[24, 32, 48], [12, 18], [24, 20, 16], [16, 20, 24]]);
  // two shares divided as printed (17.0 ÷ 6.2, not 17.00 ÷ 6.17); a concept's parts at 24/20/16
  assert.equal(fx(shareRatio(0.17, 0.0617), 1), '2.7'); assert.equal(fx(shareRatio(0.175, 0.0625), 1), '2.8'); assert.equal(fx(shareRatio(0.1766, 0.0625), 1), '2.9'); assert.equal(shareRatio(0.5, 0.25), 2);
  assert.equal(partsAt([{ grid: 16, name: 'gear-3', parts: 13 }, { grid: 24, name: 'gear-3', parts: 19 }, { grid: 20, name: 'gear-3', parts: 16 }, { grid: 24, name: 'x', parts: 1 }], 'gear-3'), '19/16/13');
  assert.equal(partsAt([{ grid: 24, name: 'trash', parts: 5 }], 'trash'), '5//');
});

// ── a world spread cell by cell: the six collections written straight into a stamped cache, so every cell can carry its
//    own value. Each printed range then has its two ends in two named cells, and every cell a wrong selection would add
//    (UI into Core's span, Pixel into the professionals' band, ours into Nucleo's) sits outside it. The library and the pin
//    are the rich world's (they feed only the sample counts, K2 and §8). ──
function spreadCollections() {
  const N = 20, idx = [...Array(N).keys()];
  const rect = (x0, y0, x1, y1) => ({ x0, y0, x1, y1 });
  // per cell: stroke, own strokes off the modal one, ink long side H, rows on whole pixels, margin, keyline ⌀, container radii
  // [radius, count] (Micro Bold's 2.01 is within 0.01 of its stroke, not equal to it), extra square container corners, sharp bends
  // (of 20), air floor base, rows under one stroke
  const cells = {
    'Core 24': { f: 'Core', g: 24, k: 'outline', set: [11, 'Core/Layout'], w: 2, off: 0, H: 22, whole: 10, m: 1, kl: 22, radii: [[2, 20]], sharpC: 8, sharpB: 10, air: 2, low: 0 },
    'Core 32': { f: 'Core', g: 32, k: 'outline', set: [11, 'Core/Layout'], w: 2.5, off: 2, H: 30, whole: 13, m: 2, kl: 28, radii: [[3, 10], [4, 6], [5, 4]], sharpC: 24, sharpB: 12, air: 3, low: 1 },
    'Core 48': { f: 'Core', g: 48, k: 'outline', set: [11, 'Core/Layout'], w: 2, off: 4, H: 43, whole: 16, m: 1, kl: 46, radii: [[5, 14], [6, 6]], sharpC: 40, sharpB: 14, air: 5, low: 1 },
    'UI 18': { f: 'UI', g: 18, k: 'outline', set: [10, 'UI/Layout'], w: 1.5, off: 6, H: 15, whole: 7, m: 1, kl: 16, radii: [[2, 12], [3, 8]], sharpC: 0, sharpB: 4, air: 2.325, low: 1 },
    'UI 12': { f: 'UI', g: 12, k: 'outline', set: [10, 'UI/Layout'], w: 1.5, off: 8, H: 10, whole: 5, m: 1, kl: 10, radii: [[2, 16], [3, 4]], sharpC: 4, sharpB: 6, air: 1.5, low: 1 },
    'Micro Bold 20': { f: 'Micro Bold', g: 20, k: 'glyph', set: [13, 'MB/Arrows'], w: 2, off: 0, H: 16, whole: 12, m: 2, kl: 18, radii: [[2.01, 18], [3, 2]], sharpC: 2, sharpB: 8, air: 2.5, low: 2 },
    'Sharp 24': { f: 'Sharp', g: 24, k: 'outline', set: [14, 'Sharp/Basic'], w: 2, off: 0, H: 21, whole: 11, m: 1, kl: 22, radii: [[2, 8], [3, 6], [4, 6]], sharpC: 80, sharpB: 20, air: 2.2, low: 1 },
    'Pixel 24': { f: 'Pixel', g: 24, k: 'outline', set: [15, 'Pixel/Basic'], w: 2, off: 0, H: 20, whole: 18, m: 1, kl: 22, radii: [[2, 6], [3, 6], [4, 4], [5, 4]], sharpC: 0, sharpB: 20, air: 2, low: 10 },
    'Ours 24': { f: 'Ours', g: 24, k: 'outline', w: 1.5, off: 0, H: 18, whole: 10, m: 2, kl: 20, radii: [[2.25, 20]], sharpC: 0, sharpB: 2, air: 1.6, low: 3 },
    'Ours 20': { f: 'Ours', g: 20, k: 'outline', w: 1.5, off: 0, H: 16, whole: 12, m: 2, kl: 16, radii: [[2, 16], [2.5, 4]], sharpC: 8, sharpB: 4, air: 1.5, low: 6 },
    'Ours 16': { f: 'Ours', g: 16, k: 'outline', w: 1.25, off: 0, H: 14, whole: 14, m: 1, kl: 14, radii: [[1.5, 12], [2, 8]], sharpC: 16, sharpB: 6, air: 1.35, low: 9 },
  };
  // parts per concept: Core (24, 32, 48) in patterns that give 25 · 40 · 55% of concepts changing (more 20 · 30 · 40%,
  // fewer 5 · 10 · 15%); UI (12, 18) four fewer at 18; ours (16, 20, 24) 10 · 5 · 15%
  const corePat = [...Array(2).fill([2, 3, 4]), ...Array(2).fill([2, 3, 3]), [3, 2, 2], ...Array(4).fill([2, 2, 3]), ...Array(2).fill([2, 2, 1]), ...Array(9).fill([2, 2, 2])];
  const parts = (c, i) => (c.f === 'Core' ? corePat[i][CORE_GRIDS_T.indexOf(c.g)] : c.f === 'UI' ? (i < 4 ? (c.g === 12 ? 3 : 2) : 2)
    : c.f === 'Ours' ? ([[1, 2, 2], [1, 2, 2], [2, 2, 3]][i] ?? [2, 2, 2])[[16, 20, 24].indexOf(c.g)] : 2);
  const names = (c) => (c.f === 'Ours' ? ['gear-3', 'building', 'sliders-2', 'trash', ...idx.slice(4).map((i) => `o${i}`)] : ['square-warning', ...idx.slice(1).map((i) => `${c.f[0].toLowerCase()}${i}`)]);
  const row = (key, c, i) => {      // (Pixel's canvas is 24 × 20: the §2 canvas share reads the shorter side)
    const radius = c.radii.flatMap(([r, n]) => Array(n).fill(r))[i];
    const sharpHere = Math.floor(c.sharpC / N) + (i < c.sharpC % N ? 1 : 0);
    // Core 48's square-warning has five rounded corners whose modal radius is not their median
    const rr = c.f === 'Core' && c.g === 48 && i === 0 ? [radius, radius, radius + 1, radius + 2, radius + 3] : Array(4).fill(radius);
    const corners = [...rr.map((r) => [r, 'container', 'arc', 90, 1, 1]), ...Array(sharpHere).fill([0, 'container', 'sharp', 90, 1, 1]), [i < c.sharpB ? 0 : 1, 'bend', i < c.sharpB ? 'sharp' : 'arc', 90, 1, 0]];
    const fl = i < c.low ? 0.9 * c.w * (1 - 0.01 * i) : c.air * (1 + 0.05 * i);
    const dx = i < c.whole ? 0 : 0.3, own = c.f === 'Ours' && i === 0 ? c.w + 0.25 : i < c.off ? c.w + 0.5 : c.w, p = parts(c, i);
    return {
      fam: c.f, ...(c.set ? { setId: c.set[0], set: c.set[1] } : {}), grid: c.g, klass: c.k, name: names(c)[i], effects: 0, W: c.g, H: c.f === 'Pixel' ? 20 : c.g, stroke: c.w, own,
      cap: c.f === 'UI' ? 'round' : 'square', join: c.f === 'UI' ? 'round' : 'miter', paint: { stroke: p, fill: c.f === 'Core' && i < 3 && c.g === 48 ? 1 : 0, both: 0, none: 0 },
      parts: p, subs: p, seg: { L: 2 + p, C: i % 2, Q: 0, A: 4, Z: 1 }, box: rect(c.m + dx, c.m, c.m + dx + c.H - 2, c.m + c.H),
      margins: { l: c.m, t: c.m, r: c.m + 1, b: c.m + 1 }, circleR: (c.kl - c.w) / 2, corners, gaps: [[fl + c.w, c.w, 0], [fl + c.w + 1, c.w, 0]],
      ...(c.f === 'Ours' ? { glyph: i === 0 ? 1 : 0 } : {}),
    };
  };
  const census = [], ours = [];
  // glyph-style drawings of five Core and five UI concepts come first in the census: only the outline ones count per concept
  for (const key of ['Core 24', 'Core 32', 'Core 48', 'UI 18', 'UI 12']) for (const i of idx.slice(1, 6)) census.push({ ...row(key, cells[key], i), klass: 'glyph', parts: 7 + i, subs: 7 + i });
  for (const [key, c] of Object.entries(cells)) for (const i of idx) (c.f === 'Ours' ? ours : census).push(row(key, c, i));
  // two Sharp drawings filed twice: once as the same drawing, once as another one under the same name; a second outline
  // square-warning in UI 18 (another box) and Core 48 (other radii)
  census.push({ ...row('UI 18', cells['UI 18'], 5), name: 'square-warning', box: rect(2, 1, 14, 16) }, { ...row('Core 48', cells['Core 48'], 5), name: 'square-warning', box: rect(2, 1, 40, 44), corners: Array(4).fill([7, 'container', 'arc', 90, 1, 1]) });
  census.push(row('Sharp 24', cells['Sharp 24'], 15), { ...row('Sharp 24', cells['Sharp 24'], 16), box: rect(1.3, 1, 21.3, 22) });
  // ink chains: per chain [held, nudged, bigGone, records unchanged, records whose smaller side lacks > 5%]; run lists per side
  const chain = (aIsSmaller, held, nudged, bigGone, unchanged, smallDetail, runsBig, runsSmall) => idx.slice(0, 10).map((i) => {
    const changed = i >= unchanged, big = { held, nudged, gone: changed ? (bigGone * 10) / (10 - unchanged) : 0 }, small = { held, nudged, gone: i >= 10 - smallDetail ? 0.08 : changed ? 0.03 : 0 };
    const rb = runsBig.filter((_, j) => j % 10 === i), rsm = runsSmall.filter((_, j) => j % 10 === i);
    return { name: `n${i}`, A: aIsSmaller ? small : big, B: aIsSmaller ? big : small, goneRunsA: aIsSmaller ? rsm : rb, goneRunsB: aIsSmaller ? rb : rsm, fit: { s: aIsSmaller ? 0.95 + i / 100 : 1.05 - i / 100 } };
  });
  const runs = (short, long, n) => [...Array(short).fill(1.5), ...Array(n - short - long).fill(5), ...Array(long).fill(12)];
  const ink = {
    core24_core32: chain(true, 0.60, 0.35, 0.04, 6, 1, runs(9, 1, 10), runs(5, 2, 10)),
    core32_core48: chain(true, 0.55, 0.30, 0.06, 7, 2, runs(4, 6, 10), runs(2, 3, 10)),
    core24_core48: chain(true, 0.58, 0.40, 0.08, 5, 3, runs(6, 4, 10), runs(15, 1, 20)),
    ui18_ui12: chain(false, 0.65, 0.45, 0.02, 8, 0, runs(7, 2, 10), runs(8, 1, 10)),
    core24_ui18: chain(false, 0.40, 0.20, 0.15, 4, 2, runs(3, 1, 5), runs(2, 2, 5)),
    ours24_20: chain(false, 0.70, 0.50, 0.01, 9, 0, [], []),
    ours20_16: chain(false, 0.75, 0.55, 0, 10, 0, [], []),
    ours24_16: chain(false, 0.80, 0.25, 0.10, 9, 1, runs(1, 0, 2), []),
  };
  const verdict = (L) => L.map((v, i) => ({ name: `n${i}`, verdict: v, fit: v === 'same shape, own weight' ? null : 0.1 + i / 10 }));
  const verdicts = {
    core24_ui18: verdict(['redrawn', 'redrawn', 're-tuned', 're-tuned', 're-tuned', 'scaled copy']),
    core24_core32: verdict(['re-tuned', 'scaled copy', 'scaled copy', 'same shape, own weight']),
    core32_core48: verdict(['redrawn', 're-tuned', 're-tuned', 'scaled copy']),
    ui18_ui12: verdict(['redrawn', 're-tuned', 're-tuned', 're-tuned', 'scaled copy']),
  };
  // parts: what vanishes or appears, open lines · closed shapes · dots — cross dropped 6·3·1, added 2·5·3; UI dropped 8·0·2, added 4·2·4
  const kinds = (open, closed, dot) => [...Array(open).fill({ len: 3, closed: 0 }), ...Array(closed).fill({ len: 4, closed: 1 }), ...Array(dot).fill({ len: 1, closed: 0 })];
  const pair = (dropped, added, i) => ({ name: `n${i}`, nA: 3, nB: 3, dropped, added, matched: [{ stage: 'place', maxS: 0.05 * (i + 1), dC: 0.1 * i, size: 1 - 0.02 * i }, { stage: i % 3 ? 'place' : 'shape', maxS: 0.4, dC: 0.5, size: 0.9 }] });
  const split = (L) => [L.slice(0, Math.ceil(L.length / 2)), L.slice(Math.ceil(L.length / 2))];
  const [cd1, cd2] = split(kinds(6, 3, 1)), [ca1, ca2] = split(kinds(2, 5, 3)), [ud1, ud2] = split(kinds(8, 0, 2)), [ua1, ua2] = split(kinds(4, 2, 4));
  const partsC = {
    core24_ui18: [pair(cd1, ca1, 0), pair(cd2, ca2, 1), pair([], [], 2), pair([], [], 3)],
    ui18_ui12: [pair(ud1, ua1, 0), pair(ud2, ua2, 1), pair([], [], 2), pair([], [], 3), { ...pair([], [], 4), matched: [...pair([], [], 4).matched, { stage: 'shape', maxS: 0.2, dC: 0.3, size: 0 }] }],
  };
  // dots: dot-to-stem air in strokes Core 24 1.1, Core 32 1.8, UI 18 1.2, UI 12 0.5, Sharp 1.0; Pixel 0.4; ours 2.0 · 2.2 · 2.5
  const dot = (fam, grid, stroke, st, n) => idx.slice(0, n).map((i) => ({ name: `d${i}`, fam, grid, stroke, gap: +(st * stroke * (1 + (i - Math.floor(n / 2)) / 50)).toFixed(3) }));
  const dots = [...dot('Core', 24, 2, 1.1, 2), ...dot('Core', 32, 2, 1.8, 3), ...dot('UI', 18, 1.5, 1.2, 3), ...dot('UI', 12, 1.5, 0.5, 3), ...dot('Sharp', 24, 2, 1.0, 3),
    ...dot('Pixel', 24, 2, 0.4, 3), ...dot('Ours', 24, 1.5, 2.0, 3), ...dot('Ours', 20, 1.5, 2.2, 3), ...dot('Ours', 16, 1.25, 2.5, 4)];
  return { census, ours, ink, verdicts, parts: partsC, dots };
}
const CORE_GRIDS_T = [24, 32, 48];

test('CLI: on a world spread cell by cell, every printed range has two named, distinct ends and every cell left out falls outside it', async () => {
  const W = await richWorld({ k2Yes: true });
  const cache = path.join(W.root, 'cache');
  assert.equal(W.run('s4.6', '--cache', cache).status, 0);                      // stamps a cache for this pin and library
  const stamp = JSON.parse(fs.readFileSync(path.join(cache, 'nucleo-probe-census.json'), 'utf8'));
  for (const [k, data] of Object.entries(spreadCollections())) fs.writeFileSync(path.join(cache, `nucleo-probe-${k}.json`), JSON.stringify({ format: stamp.format, pin: stamp.pin, library: stamp.library, data }));
  const r = spawnSync(process.execPath, [PROBE, W.pin, '--cache', cache], { encoding: 'utf8', env: { ...process.env, HOME: W.home, NUCLEO_PROBE_TRACE: '1' } });
  assert.equal(r.status, 0, r.stderr.split('\n').filter((l) => !l.startsWith('TRACE ')).join('\n'));
  const traces = r.stderr.split('\n').filter((l) => l.startsWith('TRACE ')).map((l) => JSON.parse(l.slice(6)));
  assert.ok(traces.length >= 50, `${traces.length} ranges traced`);
  for (const t of traces) {
    const v = t.printed.map(Number), lo = Math.min(...v), hi = Math.max(...v);
    const atLo = t.cells.filter((_, i) => v[i] === lo), atHi = t.cells.filter((_, i) => v[i] === hi);
    assert.ok(lo !== hi && atLo.length === 1 && atHi.length === 1, `${t.site}: ends ${atLo.join('+')} ${lo} and ${atHi.join('+')} ${hi}`);
    for (const [c, p] of t.left) assert.ok(!(Number(p) >= lo && Number(p) <= hi), `${t.site}: ${c} ${p} falls inside ${lo} – ${hi}`);
  }
  // the run lists: one end comes from a smaller grid's runs, the other from a bigger grid's
  for (const site of ['§4.2 runs under three strokes', '§4.2 runs of ten strokes']) {
    const t = traces.find((x) => x.site === site), v = t.printed.map(Number);
    const ends = [t.cells[v.indexOf(Math.min(...v))], t.cells[v.indexOf(Math.max(...v))]];
    assert.ok(ends.some((c) => c.endsWith('smaller')) && ends.some((c) => c.endsWith('bigger')), `${site}: ${ends.join(', ')}`);
  }
  const have = r.stdout.split('\n').slice(1).join('\n').trimEnd().split('\n'), want = SPREAD_EXPECTED.split('\n');
  for (let i = 0; i < Math.max(want.length, have.length); i++) assert.equal(have[i], want[i], `line ${i + 2} differs`);
  fs.rmSync(W.root, { recursive: true, force: true });
});

const SPREAD_EXPECTED = "\n## The short answer\n1. Core's line is 2.0 px at 24, 32 and 48 (81% of 61 drawings); UI's is 1.5 px at 12 and 18 (60 \u2013 67% of 41)\n   ink \u00d71.36 for \u00d71.33; \u00d71.43 for \u00d71.5; air \u00d71.50 for \u00d71.33, \u00d71.67 for \u00d71.5, \u00d71.55 for UI's \u00d71.5\n   radius Core 2 \u2192 3 \u2192 5 px, UI 2 \u2192 2; stroke share falls 8.3 \u2192 7.8 \u2192 4.2% in Core (24 \u2192 32 \u2192 48) and rises 8.3 \u2192 12.5% in UI (18 \u2192 12)\n2. ours: tightest air \u00d71.07 \u2013 1.19 (1.3 px at all three), stroke \u00d71.0 then \u00d71.2, margin 2 \u00b7 2 \u00b7 1\n3. radius \u00f7 stroke: Core 24 1.00\u00d7, Core 32 1.20\u00d7, Core 48 2.50\u00d7, UI 18 1.33\u00d7, UI 12 1.33\u00d7, Micro Bold 20 1.00\u00d7; one radius on 50 \u2013 100% of each grid's rounded container corners; ours 2.25 \u00b7 2 \u00b7 1.5 \u2014 1.50\u00d7, 1.33\u00d7, 1.20\u00d7 (the share on it in the document cites card 1.2)\n4. p10 air: 2.2 \u00b7 3.3 \u00b7 5.5 px in Core (9.1 \u00b7 10.3 \u00b7 11.5% of the canvas, 1.09 \u00b7 1.31 \u00b7 2.75 of the stroke), 2.6 \u00b7 1.6 px in UI; ours 1.3 px (5.6 \u00b7 6.5 \u00b7 6.6%, 0.9 \u00b7 0.9 \u00b7 0.8 strokes)\n5. the bigger grid carries more parts in 0 \u2013 40% of concepts (UI 12 \u2192 18: 0%; Core 24 \u2192 48: 40%) and fewer in 5 \u2013 20%; ours 24 \u2192 16: 15.0% shed, 0% gain; >5% extra ink 40% (24 \u2192 32) and 30% (32 \u2192 48)\n6. \"redrawn\": 0.0% Core 24 \u2192 32, 25.0% Core 32 \u2192 48, 20.0% UI 18 \u2192 12, 33.3% Core 24 \u2192 UI 18 (+33 points); stroke 8.3% of Core 24, 4.2% of Core 48, 12.5% of UI 12\n   50 \u2013 80% of size-only pairs unchanged within 2% of ink; nudged 30 \u2013 45% of the ink\n7. ours 24 \u2192 16 unchanged 90% against UI 18 \u2192 12 80%; changed >10% 10% against 0%; ours 24 \u2192 20 and 20 \u2192 16 90% and 100%\n\n## Sample, and why this one\nSource: Nucleo's local library, data.sqlite3 + 61 .svg (icon rows in the database)\nFamilies: 189 drawings in the five families (Core 76 \u00b7 UI 51 \u00b7 Sharp 22 \u00b7 Pixel 20 \u00b7 Micro Bold 20); the other -128 are free sets outside them\nDistinct: 188 once repeats are set aside (4 family \u00d7 grid \u00d7 style \u00d7 name keys occur more than once; 25.0% of those are the same drawing)\nConcepts: Core 6 at all three grids \u00b7 UI 6 at both \u00b7 6 shared by Core 24 and UI 18\nOur side: 20 concepts \u00d7 3 masters = 60 drawings\n\nWhy Nucleo is a control group:\n- stroke_max is set on 6 icons (9.8%), in 2 sets (Arcade 1; Core Essential 5)\n- the families and their grids: Core 24/32/48, UI 12/18, Sharp 24, Pixel 24, Micro Bold 20\n- 8 grids in 5 families; steps \u00d71.33 \u00b7 \u00d71.5 \u00b7 \u00d72.0 (Core), \u00d71.5 (UI) against our \u00d71.2 \u00b7 \u00d71.25 \u00b7 \u00d71.5\n\nInstruments:\n- square caps and mitres Core 24 uses in 100.0% and 100.0% of drawings\n- the keyline probe has few circles at Core 48 (n = 21) and Sharp (21)\n\nDeclared limits:\n- across families the part view and the ink view agree (50.0% and 60.0% of pairs differ), within UI 18 \u2192 12 the part view reports 40.0% against 20.0%\n- the first drawing per name stands for its repeats (25.0% identical)\n- corner_custom (1 icons) is not measured\n\n## \u00a71 Stroke, keyline and margin\n| Family \u00b7 grid | Drawings | Stroke px (at modal) | % of canvas | Circle keyline \u2300 (n) | Stroke \u00f7 keyline | Typical ink long side | Modal min margin | Touch the edge (\u22640.5) | Outer edge on whole px |\n| Core 24 | 20 | 2.0 (100%) | 8.33% | 22 (20) | 9.1% | 22 \u00b7 91.7% | 1 (100%) | 0% | 50% |\n| Core 32 | 20 | 2.5 (90%) | 7.81% | 28 (20) | 8.9% | 30 \u00b7 93.8% | 2 (100%) | 0% | 65% |\n| Core 48 | 21 | 2.0 (81%) | 4.17% | 46 (21) | 4.3% | 43 \u00b7 89.6% | 1 (100%) | 0% | 81% |\n| UI 18 | 21 | 1.5 (67%) | 8.33% | 16 (21) | 9.4% | 15 \u00b7 83.3% | 1 (100%) | 0% | 38% |\n| UI 12 | 20 | 1.5 (60%) | 12.5% | 10 (20) | 15.0% | 10 \u00b7 83.3% | 1 (100%) | 0% | 25% |\n| Micro Bold 20 | 20 | 2.0 (100%) | 10.0% | 18 (20) | 11.1% | 16 \u00b7 80.0% | 2 (100%) | 0% | 60% |\n| Sharp 24 | 21 | 2.0 (100%) | 8.33% | 22 (21) | 9.1% | 21 \u00b7 87.5% | 1 (100%) | 0% | 52% |\n| Pixel 24 | 20 | 2.0 (100%) | 8.33% | 22 (20) | 9.1% | 20 \u00b7 83.3% | 1 (100%) | 0% | 90% |\n| **Ours 24** | 20 | 1.5 (95%) | 6.25% | 20 | 7.5% | 18 \u00b7 75.0% | 2 (100%) | 0% | 50% |\n| **Ours 20** | 20 | 1.5 (95%) | 7.50% | 16 | 9.4% | 16 \u00b7 80.0% | 2 (100%) | 0% | 60% |\n| **Ours 16** | 20 | 1.25 (95%) | 7.81% | 14 | 8.9% | 14 \u00b7 87.5% | 1 (100%) | 0% | 70% |\n(Our keylines, read by the same probe: 20 \u00b7 16 \u00b7 14; ring outer edge = 2r + stroke = 18.5 + 1.5, 14.5 + 1.5, 12.75 + 1.25.)\n\nLive area (canvas \u2212 2 \u00d7 modal margin): 22 \u00b7 28 \u00b7 46 px in Core (92 \u00b7 88 \u00b7 96%), 16 and 10 in UI (89 \u00b7 83%), 16 in Micro Bold (80%), 22 in Sharp and 22 in Pixel (92%)\n  in Core, UI and Micro Bold the live area equals the keyline probe: no\n  Ours: 20 \u00b7 16 \u00b7 14 (83 \u00b7 80 \u00b7 88%), set by a margin of 2 \u00b7 2 \u00b7 1\n\nWhat the eye sees: 90 \u2013 94% of the box in Core at every grid, 83% then 83% in UI; at UI 12 0% touch the edge.\n  Ours stands in at 75 \u2013 88% for a typical drawing and 80 \u2013 87.5% for the ring (83.3 \u00b7 80.0 \u00b7 87.5%)\n  0% of UI 12 and 0% of Core 24 touch the canvas edge; Core 48 0%, Micro Bold 0%, which still fill 90% and 80% of the box\n\nThe stroke: 3 values (2.5 and 2.0 and 1.5) cover all 8 grids. Stroke \u00f7 keyline across grids: Core 4.3 \u2013 9.1% (4.8 points), UI 9.4 \u2013 15.0% (5.6 points), ours 7.5 \u2013 9.4% (1.9 points)\n\nOn the grid: outer edge on whole pixels in 50 \u2013 81% of Core drawings and 50 \u2013 70% of ours; UI 25 \u2013 38%\n  square-warning's outer edge: UI 18 1.0 and 14.0, UI 12 1.0 and 9.0\n\n## \u00a72 Corner radius \u2014 does it track the stroke?\n| Family \u00b7 grid | Corners | Modal radius | Share on it | Radii to cover 90% | \u00f7 stroke | \u00f7 canvas | Sharp share of container corners | Open-line bends that are sharp |\n| Core 24 | 80 | 2.0 | 100.0% | 1 | 1.00 | 8.3% | 9.1% | 50% |\n| Core 32 | 80 | 3.0 | 50.0% | 3 | 1.20 | 9.4% | 23.1% | 60% |\n| Core 48 | 85 | 5.0 | 63.5% | 2 | 2.50 | 10.4% | 32.0% | 70% |\n| UI 18 | 84 | 2.0 | 61.9% | 2 | 1.33 | 11.1% | 0.0% | 19% |\n| UI 12 | 80 | 2.0 | 80.0% | 2 | 1.33 | 16.7% | 4.8% | 30% |\n| Micro Bold 20 | 80 | 2.0 | 90.0% | 1 | 1.00 | 10.0% | 2.4% | 40% |\n| Sharp 24 | 84 | 2.0 | 38.1% | 3 | 1.00 | 8.3% | 50.0% | 100% |\n| Pixel 24 | 80 | 2.0 | 30.0% | 4 | 1.00 | 10.0% | 0.0% | 100% |\n| **Ours 24** | 80 | 2.2 | 100.0% | 1 | 1.50 | 9.4% | 0.0% | 10% |\n| **Ours 20** | 80 | 2.0 | 80.0% | 2 | 1.33 | 10.0% | 9.1% | 20% |\n| **Ours 16** | 80 | 1.5 | 60.0% | 2 | 1.20 | 9.4% | 16.7% | 30% |\n(Our share on the modal value in this table is this probe's own two-decimal count; the document's three table cells for it cite card 1.2, findings-corners.md \u00a71.1 \u2014 a wave-5 reconcile item.)\nsquare-warning, container corner radius: Core 24 2, Core 32 3, Core 48 5, UI 18 2, UI 12 2\nRadius equals stroke in 1 cell of 6 (Core 24); the others: Core 32 1.20\u00d7, Core 48 2.50\u00d7, UI 18 1.33\u00d7, UI 12 1.33\u00d7, Micro Bold 20 1.00\u00d7\n  Core 24 \u2192 32 \u2192 48: 2 \u2192 3 \u2192 5 (steps \u00d71.5, \u00d71.67); UI 2 at 18 and 2 at 12\n  share of canvas: Core 8.3% \u2192 10.4%, UI 11.1% \u2192 16.7%; ours 1.50\u00d7 \u00b7 1.33\u00d7 \u00b7 1.20\u00d7, 9.4 \u00b7 10.0 \u00b7 9.4% of the canvas\n\nEach grid has one radius: 100% of Core 24's and 50% of Core 32's rounded container corners, 62% of UI 18's, on the modal value; 1 or 3 radii reach 90%. Ours (this probe): 60 \u2013 100% on the modal value, 1/2 radii to 90%\n  one radius per master used by 50 \u2013 100% of rounded container corners (the six cells)\nCore is mixed-corner: 9 \u2013 32% of container corners square, 50 \u2013 70% of open-line bends mitred; UI 0 \u2013 5%, ours 0 \u2013 17%; Sharp 50.0%, Pixel 0%\nBends: UI's centreline radius reads 0 in 19 \u2013 30%; ours draws an arc in 70 \u2013 90%\n\n## \u00a73 Air \u2014 the practical floor\n| Family \u00b7 grid | Drawings | px at p5 \u00b7 p10 \u00b7 p25 \u00b7 p50 | Strokes at p10 \u00b7 p50 | Canvas share at p10 \u00b7 p50 | Below one stroke |\n| Core 24 | 20 | 2.09 \u00b7 2.19 \u00b7 2.48 \u00b7 2.95 | 1.09 \u00b7 1.48 | 9.1% \u00b7 12.3% | 0% |\n| Core 32 | 20 | 3.11 \u00b7 3.29 \u00b7 3.71 \u00b7 4.42 | 1.31 \u00b7 1.77 | 10.3% \u00b7 13.8% | 5% |\n| Core 48 | 21 | 5.25 \u00b7 5.50 \u00b7 6.25 \u00b7 7.25 | 2.75 \u00b7 3.62 | 11.5% \u00b7 15.1% | 5% |\n| UI 18 | 21 | 2.44 \u00b7 2.56 \u00b7 2.91 \u00b7 3.37 | 1.71 \u00b7 2.25 | 14.2% \u00b7 18.7% | 5% |\n| UI 12 | 20 | 1.56 \u00b7 1.64 \u00b7 1.86 \u00b7 2.21 | 1.10 \u00b7 1.48 | 13.7% \u00b7 18.4% | 5% |\n| Micro Bold 20 | 20 | 1.80 \u00b7 2.65 \u00b7 3.09 \u00b7 3.69 | 1.33 \u00b7 1.84 | 13.3% \u00b7 18.4% | 10% |\n| Sharp 24 | 21 | 2.31 \u00b7 2.42 \u00b7 2.75 \u00b7 3.30 | 1.21 \u00b7 1.65 | 10.1% \u00b7 13.8% | 5% |\n| Pixel 24 | 20 | 1.66 \u00b7 1.67 \u00b7 1.72 \u00b7 2.40 | 0.84 \u00b7 1.20 | 7.0% \u00b7 10.0% | 50% |\n| **Ours 24** | 20 | 1.34 \u00b7 1.35 \u00b7 1.98 \u00b7 2.36 | 0.90 \u00b7 1.57 | 5.6% \u00b7 9.8% | 15% |\n| **Ours 20** | 20 | 1.30 \u00b7 1.31 \u00b7 1.35 \u00b7 2.21 | 0.87 \u00b7 1.48 | 6.5% \u00b7 11.1% | 30% |\n| **Ours 16** | 20 | 1.05 \u00b7 1.06 \u00b7 1.09 \u00b7 1.99 | 0.85 \u00b7 1.59 | 6.6% \u00b7 12.4% | 45% |\nCore's floor: 2.2 \u2192 3.3 \u2192 5.5 px; 1.1 \u2192 1.3 \u2192 2.8 strokes; 9.1 \u2013 11.5% of the canvas. UI: 2.6 \u2192 1.6 px, 14.2 \u2192 13.7%\nOurs: 1.34/1.35/1.98 \u00b7 1.30/1.31/1.35 \u00b7 1.05/1.06/1.09 at p5/p10/p25; 5.6 \u2192 6.5 \u2192 6.6% of the canvas; 0.9 \u2192 0.9 \u2192 0.8 strokes; 15 \u2013 45% below one stroke against 0 \u2013 10% of the Nucleo families' (Pixel 50%)\n\nThe same concept at two grids:\n| Same concept | Grid \u00d7 | Air floor \u00d7 | Pairs where the air is bigger \u00b7 equal \u00b7 smaller at the bigger grid |\n| Core 24 \u2192 32 | 1.33 | 1.50 | 100% \u00b7 0% \u00b7 0% (n = 20) |\n| Core 32 \u2192 48 | 1.50 | 1.67 | 95% \u00b7 0% \u00b7 5% (n = 20) |\n| Core 24 \u2192 48 | 2.00 | 2.50 | 95% \u00b7 0% \u00b7 5% (n = 20) |\n| UI 12 \u2192 18 | 1.50 | 1.55 | 95% \u00b7 5% \u00b7 0% (n = 20) |\n| **Ours 20 \u2192 24** | 1.20 | 1.07 | 85% \u00b7 15% \u00b7 0% (n = 20) |\n| **Ours 16 \u2192 20** | 1.25 | 1.11 | 100% \u00b7 0% \u00b7 0% (n = 20) |\n| **Ours 16 \u2192 24** | 1.50 | 1.19 | 100% \u00b7 0% \u00b7 0% (n = 20) |\n\nGlyph dot-to-stem air (exclamation, question and info icons):\n| | Core 24 | Core 32 | UI 18 | UI 12 | Sharp 24 | Pixel 24 | **Ours 24 \u00b7 20 \u00b7 16** |\n| dot-to-stem air, median px | 2.20 | 3.60 | 1.80 | 0.75 | 2.00 | 0.80 | **3.00 \u00b7 3.30 \u00b7 3.12** |\n| in strokes | 1.10 | 1.80 | 1.20 | 0.50 | 1.00 | 0.40 | **2.00 \u00b7 2.20 \u00b7 2.50** |\n| drawings in the cell | 2 | 3 | 3 | 3 | 3 | 3 | 3 \u00b7 3 \u00b7 4 |\n  the professionals' band: 0.5 \u2013 1.8 stroke; ours 2.0 \u2013 2.5; cells 2 \u2013 4 drawings\nPixel: 0 of its 20 drawings sit at 0.82 \u2013 0.83 on the air measure (2 dp); 2\u221a2 \u2212 2 = 0.83\n\n## \u00a74.1 Ratios to the grid\n| Same concept | Grid ratio | Stroke | Ink long side | Air floor | Container radius |\n| Core 24 \u2192 32 | 1.33 | 1.25 | 1.36 | 1.50 | 1.75 (n = 20) |\n| Core 32 \u2192 48 | 1.50 | 0.80 | 1.43 | 1.67 | 1.58 (n = 20) |\n| Core 24 \u2192 48 | 2.00 | 1.00 | 1.95 | 2.50 | 2.50 (n = 20) |\n| UI 12 \u2192 18 | 1.50 | 1.00 | 1.50 | 1.55 | 1.00 (n = 20; equal in 80%) |\n| **Ours 20 \u2192 24** | 1.20 | 1.00 | 1.12 | 1.07 | 1.12 (n = 20) |\n| **Ours 16 \u2192 20** | 1.25 | 1.17 | 1.14 | 1.11 | 1.33 (n = 20) |\n| **Ours 16 \u2192 24** | 1.50 | 1.17 | 1.29 | 1.19 | 1.50 (n = 20) |\n(Stroke column: Nucleo = ratio of the two grids' modal strokes (\u00a71); ours = the two masters' strokes.)\nUI's ink share: 12-grid 83% against 18-grid 83%\n\n## \u00a74.2 The ink itself \u2014 held, nudged, gone\n| Chain | Pairs | Ink held | Nudged | Unchanged (\u22642% of ink unmatched) | Minor (2 \u2013 10%) | Changed (>10%) | Bigger grid has >5% ink the smaller lacks | Smaller has >5% the bigger lacks | Held ink, smaller \u00f7 larger (canvas share) |\n| Core 32 \u2192 24 | 10 | 60% | 35% | 60% | 40% | 0% | 40% | 10% | \u00d70.995 |\n| Core 48 \u2192 32 | 10 | 55% | 30% | 70% | 0% | 30% | 30% | 20% | \u00d70.995 |\n| Core 48 \u2192 24 | 10 | 58% | 40% | 50% | 0% | 50% | 50% | 30% | \u00d70.995 |\n| UI 18 \u2192 12 | 10 | 65% | 45% | 80% | 20% | 0% | 20% | 0% | \u00d70.995 |\n| *Core 24 \u2192 UI 18 (style changes too)* | 10 | 40% | 20% | 40% | 0% | 60% | 60% | 20% | \u00d70.995 |\n| **Ours 24 \u2192 20** | 10 | 70% | 50% | 90% | 10% | 0% | 10% | 0% | \u00d70.995 |\n| **Ours 20 \u2192 16** | 10 | 75% | 55% | 100% | 0% | 0% | 0% | 0% | \u00d70.995 |\n| **Ours 24 \u2192 16** | 10 | 80% | 25% | 90% | 0% | 10% | 10% | 10% | \u00d70.995 |\nWhat stays: 92 \u2013 98% of the larger grid's ink is within one stroke of the smaller grid's; 55 \u2013 65% within a quarter-stroke (the four size-only chains)\nWhat goes: in Core the bigger grid carries \u22655% extra ink in 40% (24 \u2192 32), 30% (32 \u2192 48) and 50% (24 \u2192 48) of concepts, against 10 \u2013 30% the other way. UI 18 \u2192 12 sheds in 20% and adds in 0%.\n  unmatched stretches: 20 \u2013 90% of the dropped or added runs are under three strokes long, 5 \u2013 60% ten strokes or more\nOurs 24 \u2192 16 against UI 18 \u2192 12: 90% unchanged against 80%; 10% changed against 0%. Ours 24 \u2192 20 and 20 \u2192 16: 90% and 100% unchanged; held ink \u00d70.995 at 20, \u00d70.995 at 16\n\n## \u00a74.3 The repo's \"redrawn\" verdict\n| Chain | Pairs | Redrawn | Re-tuned | Scaled / same shape own weight | Worst gap, median |\n| Core 24 \u2192 UI 18 (size **and** style) | 6 | 33.3% | 50.0% | 16.7% | 0.35 strokes |\n| Core 24 \u2192 Core 32 (every third concept) | 4 | 0.0% | 25.0% | 75.0% | 0.20 |\n| Core 32 \u2192 Core 48 (every third concept) | 4 | 25.0% | 50.0% | 25.0% | 0.25 |\n| UI 18 \u2192 UI 12 (all) | 5 | 20.0% | 60.0% | 20.0% | 0.30 |\nThe stroke's share of the canvas: 8.3% of Core 24, 7.8% of Core 32, 4.2% of Core 48; 12.5% of UI 12\n  \"redrawn\": 20.0% (UI 18 \u2192 12, line 8.3 \u2013 12.5% of the canvas), 0.0% (Core \u00d71.33), 25.0% (Core \u00d71.5); cross-family 33.3% \u2014 33.3 points above the same \u00d71.33 step inside Core\n\n## \u00a74.4 Part by part\n| | Core 24 \u2192 UI 18 | UI 18 \u2192 UI 12 |\n| every part has a counterpart, none off by more than a stroke | 25.0% | 20.0% |\n| \u2026 and a part is reshaped in place by more than a stroke | 0.0% | 0.0% |\n| \u2026 and a part moved or was resized (needed the shape fit) | 25.0% | 40.0% |\n| every part pure scaling (\u22640.1 stroke) | 0% | 0% |\n| **some part has no counterpart (dropped or added)** | **50.0%** | **40.0%** |\n| matched parts | 8 | 11 |\n| of them matched in place (not after a move) | 75.0% | 72.7% |\n| a part's centre moves \u2014 median \u00b7 p90, strokes | 0.40 \u00b7 0.50 | 0.40 \u00b7 0.50 |\n| a part's own worst deviation \u2014 median \u00b7 p90, strokes | 0.30 \u00b7 0.40 | 0.25 \u00b7 0.40 |\n| part size as a share of canvas, other \u00f7 this \u2014 p10 \u00b7 median \u00b7 p90 | 0.90 \u00b7 0.92 \u00b7 0.99 | 0.90 \u00b7 0.91 \u00b7 0.98 |\n| parts with no counterpart in the other drawing | 10 in A \u00b7 10 in B | 10 in A \u00b7 10 in B |\n| \u2026 of which open lines \u00b7 closed shapes \u00b7 dots | A 60 \u00b7 30 \u00b7 10% \u00b7 B 20 \u00b7 50 \u00b7 30% | A 80 \u00b7 0 \u00b7 20% \u00b7 B 40 \u00b7 20 \u00b7 40% |\nThe parts that vanish or appear: open lines 20 \u2013 80%, closed shapes 0 \u2013 50%, dots 10 \u2013 40%; the parts that stay move by a median 0.40 \u00b7 0.40 of a stroke\nInk view at the same strictness (>2% of ink unmatched): 60.0% of Core \u2194 UI pairs and 20.0% of UI 18 \u2192 12; part view 50.0% and 40.0%. Looser: 60.0% and 20.0% over 5%, 60.0% and 0.0% over 10%\n\n## \u00a74.5 What the redraws look like\ncaps: Core 24 square 100.0% / mixed 0.0%, UI 18 round 100.0%; joins: Core 24 mitre 100.0%, UI 18 round 100.0%\nsolid (filled) parts at the smaller grid: rise in 0% of UI concepts and fall in 0%; Core 48 \u2192 24 rise in 0%, fall in 15%\nmean parts per concept: 2.05 \u2192 2.20 \u2192 2.40 (24 \u2192 32 \u2192 48)\n(The named examples and the 28 overlay sheets are a look, not a census.)\n\n## \u00a74.6 Detail by grid, for the same concept\n| | Mean parts | Concepts with the same parts | Bigger grid has more | Bigger grid has fewer | Mean segments |\n| Core 24 \u2192 32 | 2.05 \u2192 2.20 | 75.0% | 20.0% | 5.0% | 8.6 \u2192 8.7 |\n| Core 32 \u2192 48 | 2.20 \u2192 2.40 | 60.0% | 30.0% | 10.0% | 8.7 \u2192 8.9 |\n| Core 24 \u2192 48 | 2.05 \u2192 2.40 | 45.0% | 40.0% | 15.0% | 8.6 \u2192 8.9 |\n| UI 12 \u2192 18 | 2.20 \u2192 2.00 | 80.0% | 0.0% | 20.0% | 8.7 \u2192 8.5 |\n| **Ours 16 \u2192 20** | 1.90 \u2192 2.00 | 90.0% | 10.0% | 0 | 8.4 \u2192 8.5 |\n| **Ours 20 \u2192 24** | 2.00 \u2192 2.05 | 95.0% | 5.0% | 0 | 8.5 \u2192 8.6 |\n| **Ours 16 \u2192 24** | 1.90 \u2192 2.05 | 85.0% | 15.0% | 0 | 8.4 \u2192 8.6 |\n(concepts at every grid: Core 20, UI 20, ours 20)\nAt the same \u00d71.5 step their rate is 0.0 times ours (UI 12 \u2192 18: 0.0%, against our 16 \u2192 24: 15.0%); at Core 32 \u2192 48 it is 2.0 times\n\n## \u00a75 What is held and what is let go \u2014 the list\nNucleo \u2014 held: the stroke (2.0 or 1.5); scaled: the ink (\u00d71.36 \u2013 1.95), the air floor (\u00d71.50 \u2013 2.50), Core's container radius (\u00d71.58 \u2013 2.50)\n  let go: the number of parts (20 \u2013 55% of concepts differ; 0 \u2013 40% gain parts on the bigger grid); exact position: 30 \u2013 45% of the ink nudged by 0.25 \u2013 1 stroke\n  margin: 1 and 2 px at Core 24 and 32; 1 at UI 12, 1 at Core 48\nOurs \u2014 held: the air (\u00d71.07 \u2013 1.19); the stroke at 24/20 (1.5), then \u00d71.2 at 16; scaled: the ink (\u00d71.12 \u2013 1.29), the container radius (\u00d71.12 \u2013 1.50); let go: 5 \u2013 15% of concepts' parts; the share of canvas (ink 75 \u2192 80 \u2192 88%); the margin (2 \u00b7 2 \u00b7 1)\n\n## \u00a76 Findings\nK1. dot-to-stem air: 2.20 px (Core 24), 3.60 (Core 32), 1.80 (UI 18), 0.75 (UI 12), 2.00 (Sharp 24); Pixel 0.80\nK2. stroke_max is set on 6 of 61 icons (9.8%), in 2 sets \u2014 Arcade 1, Core Essential 5 \u2014 one value per set and grid: yes (Arcade 30: 4; Core Essential 24: 2; Core Essential 32: 2; Core Essential 48: 4)\nK3. our floor is 5.6% of the 24 canvas and 6.6% of the 16; \u00d71.07 against \u00d71.50 \u2013 1.67 for the same step\nK4. typical drawing 75.0 \u00b7 80.0 \u00b7 87.5% of the canvas (ring 83.3 \u00b7 80.0 \u00b7 87.5%); held ink \u00d70.995 at 20 and \u00d70.995 at 16; Core 91.7 \u00b7 93.8 \u00b7 89.6%\nK5. our detail budget differs in 5 \u2013 15% of concepts, theirs in 20 \u2013 55%\nKind 1 \u2014 our drawings under one stroke of air (the \u00a73 table's floor \u00f7 stroke < 0.995):\n  24: 3 of 20 (15%); glyph-noted concepts 1; the others: building 1.34, sliders-2 1.32\n  20: 6 of 20 (30%); glyph-noted concepts 1; the others: building 1.34, sliders-2 1.32, trash 1.31, o4 1.30, o5 1.28\n  16: 9 of 20 (45%); glyph-noted concepts 1; the others: building 1.11, sliders-2 1.10, trash 1.09, o4 1.08, o5 1.07, o6 1.06, o7 1.05, o8 1.04\n\n## \u00a77 What only Maruti's eye can settle \u2014 the figures it quotes\n1. the 16 holds 1.1 px of air; UI's floor (2.6 px) in its place would be \u00d72.42\n2. UI 12 fills 83%; Core holds 90 \u2013 94%; ours falls to 80% at 20\n3. 15.0% of our concepts differ in parts between 24 and 16; UI 18 \u2192 12 differs in 20.0%\n   (the four concepts the document names, parts at 24/20/16: gear-3 2/2/1, building 2/2/1, sliders-2 3/2/2, trash 2/2/2 \u2014 a pick, not a census)\n\n## \u00a78 Independently re-derived\nstroke-width=\"2\" in 81.8% / 72.7% / 72.7% of the attributes in Core 24 / 32 / 48; \"1.5\" in 77.8% / 77.8% of UI 12 / 18's\nmodal quarter-turn corner radius, every third drawing (svgpathtools reading, ported): Core 24 **3.0** (100% of 1), Core 32 \u2014 (no quarter-turn corner), Core 48 \u2014 (no quarter-turn corner), UI 18 **3.0** (100% of 1), UI 12 \u2014 (no quarter-turn corner)\n[not reprinted by a committed tool: the ink bands re-implemented with svgpathtools + a KD-tree on 24 pairs chosen by python's seeded random.shuffle \u2014 the card's own research/references/nucleo/card-2.3/ink_indep.py (gitignored) prints them with python3 + svgpathtools + scipy in < 1 s]";

test('CLI: the glyph spot check finds every name pattern it queries, and only those', async () => {
  const W = await richWorld({ glyphNames: true });
  const r = W.run('s3');
  assert.equal(r.status, 0, r.stderr);
  const cells = r.stdout.split('\n').find((l) => l.startsWith('| drawings in the cell |'));
  // Core 24: square-warning and circle-info as before, plus x-circle-help-y, big-triangle-warning, info, help, circle-warning-2 and
  // octagon-warning; not info-2, my-circle-warning or help-circle
  assert.equal(cells, '| drawings in the cell | 8 | 2 | 2 | 2 | 2 | 2 | 1 · 1 · 1 |');
  fs.rmSync(W.root, { recursive: true, force: true });
});

test('CLI: a section heading on a fake pin and library; unknown section and missing pin exit 2', async () => {
  const W = fakeWorld();
  await fakeLibrary(W.lib);
  const env = { ...process.env, HOME: W.home };
  const ok = spawnSync(process.execPath, [PROBE, W.pin, 's4.6'], { encoding: 'utf8', env });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /## §4\.6 Detail by grid/);
  assert.match(ok.stdout, /\| Core 24 → 32 \| 1\.50 → 1\.50 \| 100\.0% \|/);
  const bad = spawnSync(process.execPath, [PROBE, W.pin, 'nope'], { encoding: 'utf8', env });
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /unknown section: nope/);
  const none = spawnSync(process.execPath, [PROBE, path.join(W.root, 'missing')], { encoding: 'utf8', env });
  assert.equal(none.status, 2);
  const refs = spawnSync(process.execPath, [PROBE, W.pin, '--refs', path.join(W.root, 'refs'), 's4.6'], { encoding: 'utf8', env });   // --refs takes a value (read by nothing)
  assert.equal(refs.status, 0, refs.stderr); assert.equal(refs.stdout.split('\n').slice(1).join('\n'), ok.stdout.split('\n').slice(1).join('\n'));
  fs.rmSync(W.root, { recursive: true, force: true });
});

// ── every section on a richer synthetic world: Core, UI, Micro Bold, Sharp, Pixel, a free set, repeats,
//    stroke_max, solid dots, our seven concepts at three masters. The expected output below was produced by this
//    probe and read line by line by hand against the fixture before it was frozen; any change to a section's
//    arithmetic, threshold or format shows up as a diff. ─────────────────────────────────────────────────────
async function richWorld(opt = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nucleo-world-'));
  const pin = path.join(root, 'pin'), home = path.join(root, 'home'), lib = path.join(home, 'Library/Application Support/Nucleo/icons');
  // our side: four concepts at three masters
  const ours = {
    minus: (m, w) => `<path d="M${w / 2 + 3} ${m / 2}h${m - 6 - w}"/>`,
    circle: (m, w) => { const r = m / 2 - (m === 16 ? 1 : 2) - w / 2; return `<path d="M${m / 2 - r} ${m / 2}A${r} ${r} 0 1 0 ${m / 2 + r} ${m / 2}A${r} ${r} 0 1 0 ${m / 2 - r} ${m / 2}Z"/>`; },
    'alert-circle': (m, w) => { const r = m / 2 - (m === 16 ? 1 : 2) - w / 2; return `<!-- glyph: dot --><path d="M${m / 2 - r} ${m / 2}A${r} ${r} 0 1 0 ${m / 2 + r} ${m / 2}A${r} ${r} 0 1 0 ${m / 2 - r} ${m / 2}Z"/><path d="M${m / 2} ${m * 0.3}v${m * 0.25}"/><path d="M${m / 2} ${m * 0.68}h0.01"/>`; },
    'square-2': (m, w) => { const a = m === 16 ? 2 : 3, b = m - a, r = m === 24 ? 2.5 : m === 20 ? 2 : 1.5; return `<path d="M${a + r} ${a}H${b - r}A${r} ${r} 0 0 1 ${b} ${a + r}V${b - r}A${r} ${r} 0 0 1 ${b - r} ${b}H${a + r}A${r} ${r} 0 0 1 ${a} ${b - r}V${a + r}A${r} ${r} 0 0 1 ${a + r} ${a}Z"/>${m === 16 ? '' : `<path d="M${m / 2 - 2} ${m / 2}h4"/><path d="M${m / 2 - 2} ${m / 2 + 2.75}h4"/>`}`; },
    check: (m, w) => { const k = m / 24, f = (v) => +(v * k).toFixed(4); return `<path d="M${f(5)} ${f(12)}L${f(9.4697)} ${f(16.4697)}A${f(0.75)} ${f(0.75)} 0 0 0 ${f(10.5303)} ${f(16.4697)}L${f(19)} ${f(8)}"/>`; },
    'check-2': (m) => { const k = m / 24, f = (v) => +(v * k).toFixed(4); return `<path d="M${f(5)} ${f(12)}L${f(10)} ${f(17)}L${f(19)} ${f(8)}"/>`; },
    bars: (m, w) => `<path d="M${m * 0.25} ${m * 0.4}h${m * 0.5}"/><path d="M${m * 0.25} ${m * 0.4 + w + (m === 24 ? 1.5 : m === 20 ? 1 : 0.5)}h${m * 0.5}"/>`,
  };
  for (const m of [24, 20, 16]) {
    fs.mkdirSync(path.join(pin, 'src/icons', String(m)), { recursive: true });
    const w = m === 16 ? 1.25 : 1.5;
    for (const [n, f] of Object.entries(ours)) {
      const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${f(m, w)}</svg>`;
      fs.writeFileSync(path.join(pin, 'src/icons', String(m), `${n}.svg`), body);
      fs.writeFileSync(path.join(pin, 'src/icons', String(m), `${n}-filled.svg`), body);
    }
  }
  fs.mkdirSync(lib, { recursive: true });
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(path.join(lib, 'data.sqlite3'));
  db.exec(`CREATE TABLE groups (id integer primary key, title varchar(255));
    CREATE TABLE sets (id integer primary key, title varchar(255), group_id integer, local boolean);
    CREATE TABLE icons (id integer primary key, set_id integer, klass varchar(255), grid integer, width integer, height integer, size integer, name varchar(255), tags varchar(255), nucleo_tags varchar(255), stroke_max integer, corner_custom integer default 0);
    INSERT INTO groups VALUES (1, 'Nucleo UI'), (2, 'Nucleo Core'), (3, 'Nucleo Micro Bold'), (4, 'Nucleo Sharp'), (5, 'Nucleo Pixel');
    INSERT INTO sets VALUES (10, 'UI/Layout', 1, 0), (11, 'Core/Layout', 2, 0), (12, 'Nucleo Core Essential', NULL, 0), (13, 'MB/Arrows', 3, 0), (14, 'Sharp/Basic', 4, 0), (15, 'Pixel/Basic', 5, 0), (16, 'Nucleo Arcade', NULL, 0);`);
  let id = 100;
  const add = (set, klass, grid, name, svg, extra = {}) => {
    id++;
    db.prepare('INSERT INTO icons (id, set_id, klass, grid, width, height, size, name, stroke_max, corner_custom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, set, klass, grid, grid, grid, 0, name, extra.strokeMax ?? null, extra.cornerCustom ?? 0);
    fs.mkdirSync(path.join(lib, 'sets', String(set)), { recursive: true });
    fs.writeFileSync(path.join(lib, 'sets', String(set), `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${grid} ${grid}">${svg}</svg>`);
  };
  const g = (w, cap, join, body) => `<g fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="${join}">${body}</g>`;
  const fam = {
    core: { w: 2, cap: 'square', join: 'miter', m: 1 }, ui: { w: 1.5, cap: 'round', join: 'round', m: 1 },
    mb: { w: 2, cap: 'round', join: 'round', m: 2 }, sharp: { w: 2, cap: 'square', join: 'miter', m: 1 }, pixel: { w: 2, cap: 'butt', join: 'miter', m: 1 },
  };
  const draw = {
    minus: (s, f) => `<line x1="${f.m + f.w / 2}" y1="${s / 2}" x2="${s - f.m - f.w / 2}" y2="${s / 2}"/>` + (s === 48 ? `<line x1="${s * 0.4}" y1="${s * 0.2}" x2="${s * 0.6}" y2="${s * 0.2}"/>` : ''),
    equals: (s, f) => `<line x1="${f.m + 1}" y1="${s / 2 - s / 8}" x2="${s - f.m - 1}" y2="${s / 2 - s / 8}"/><line x1="${f.m + 1}" y1="${s / 2 + s / 8}" x2="${s - f.m - 1}" y2="${s / 2 + s / 8}"/>`,
    'square-warning': (s, f) => `<rect x="${f.m + f.w / 2}" y="${f.m + f.w / 2}" width="${s - 2 * f.m - f.w}" height="${s - 2 * f.m - f.w}" rx="${Math.round(s / 10)}" ry="${Math.round(s / 10)}"/><line x1="${s / 2}" y1="${s * 0.28}" x2="${s / 2}" y2="${s * 0.55}"/><circle cx="${s / 2}" cy="${s * 0.72}" r="${f.w * 0.4}" fill="#000" stroke-width="0"/>`,
    'circle-info': (s, f) => `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - f.m - f.w / 2}"/><line x1="${s / 2}" y1="${s * 0.45}" x2="${s / 2}" y2="${s * 0.72}"/><circle cx="${s / 2}" cy="${s * 0.3}" r="${f.w * 0.45}" fill="#000" stroke-width="0"/>`,
    pair: (s, f) => (s === 18 ? '' : `<line x1="${f.m + 1}" y1="${s * 0.3}" x2="${s - f.m - 1}" y2="${s * 0.3}"/>`) + (s === 12 ? '' : `<line x1="${f.m + 1}" y1="${s * 0.6}" x2="${s / 2}" y2="${s * 0.6}"/>`) + (s === 48 ? `<circle cx="${s * 0.8}" cy="${s * 0.6}" r="1" fill="#000" stroke="none"/>` : ''),
    corner: (s, f) => (s === 32 || s === 48 ? `<circle cx="${s * 0.75}" cy="${s * 0.25}" r="1" fill="#000" stroke-width="0"/>` : '') + (s === 18 ? `<circle cx="${s * 0.8}" cy="${s * 0.25}" r="0.6" fill="#000" stroke="none"/>` : '') + `<path d="M${f.m + f.w} ${s / 2}V${f.m + f.w + 3}A3 3 0 0 1 ${f.m + f.w + 3} ${f.m + f.w}H${s / 2}"/><polyline points="${s - 6} ${s - 4} ${s - 4} ${s - 4} ${s - 4} ${s - 6}"/>`,
  };
  const put = (set, klass, grid, name, f, extra) => add(set, klass, grid, name, g(f.w, f.cap, f.join, draw[name](grid, f)), extra);
  for (const n of Object.keys(draw)) {
    for (const s of [24, 32, 48]) put(11, 'outline', s, n, fam.core);
    for (const s of [18, 12]) put(10, 'outline', s, n, fam.ui);
    put(13, 'glyph', 20, n, fam.mb); put(14, 'outline', 24, n, fam.sharp); put(15, 'outline', 24, n, fam.pixel);
  }
  add(11, 'outline', 24, 'blob', '<circle cx="12" cy="12" r="5" fill="#000"/><circle cx="12" cy="19" r="1.5" fill="#000"/>');   // an outline-class drawing with no stroke of its own
  put(10, 'outline-duo', 18, 'minus', fam.ui);
  put(10, 'outline-duo', 18, 'equals', fam.ui);                                       // a two-tone drawing with air: in §3's UI 18 row only
  add(12, 'outline', 24, 'pair', g(2, 'square', 'miter', `<path d="M2 7.2C8 7.2 16 7.2 22 7.2"/><line x1="2" y1="14.4" x2="12" y2="14.4"/>`), { strokeMax: 2 });   // same box, parts and sub-paths as Core 24's pair, another segment kind
  put(12, 'outline', 24, 'minus', fam.core, { strokeMax: 2 });                       // the same drawing filed again
  add(12, 'outline', 24, 'equals', g(2, 'square', 'miter', '<line x1="3" y1="10" x2="21" y2="10"/>'), { strokeMax: 2 });   // same name, another drawing
  add(12, 'outline', 32, 'equals', g(2, 'round', 'round', '<line x1="3" y1="12" x2="29" y2="12"/>'), { strokeMax: 2, cornerCustom: 1 });
  add(16, 'outline', 30, 'ship', g(4, 'round', 'round', '<line x1="4" y1="15" x2="26" y2="15"/>'), { strokeMax: 4 });
  if (opt.k2Yes) add(12, 'outline', 48, 'minus', g(2, 'square', 'miter', '<line x1="3" y1="24" x2="45" y2="24"/>'), { strokeMax: 4 });   // one value per set and grid, two across a set's grids
  else add(16, 'outline', 30, 'boat', g(3, 'round', 'round', '<line x1="4" y1="15" x2="26" y2="15"/>'), { strokeMax: 3 });   // a second value in one set and grid
  // concepts drawn at some grids only: they stay out of "concepts at every grid"
  add(11, 'outline', 32, 'only-big', g(2, 'square', 'miter', '<line x1="4" y1="8" x2="28" y2="8"/>'));
  add(11, 'outline', 48, 'only-big', g(2, 'square', 'miter', '<line x1="4" y1="12" x2="44" y2="12"/><line x1="4" y1="30" x2="44" y2="30"/>'));
  add(10, 'outline', 18, 'only-18', g(1.5, 'round', 'round', '<line x1="3" y1="9" x2="15" y2="9"/>'));
  add(10, 'outline', 12, 'only-12', g(1.5, 'round', 'round', '<line x1="2" y1="6" x2="10" y2="6"/>'));
  if (opt.glyphNames) for (const m of [24, 20, 16]) {
    const w = m === 16 ? 1.25 : 1.5;
    fs.writeFileSync(path.join(pin, 'src/icons', String(m), 'numeral-1.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}"><!-- glyph: numeral --><path d="M${m / 2} ${m * 0.3}v${m * 0.25}"/><path d="M${m / 2} ${m * 0.68}h0.01"/></svg>`);
  }
  if (opt.glyphNames) for (const n of ['x-circle-help-y', 'big-triangle-warning', 'info', 'help', 'circle-warning-2', 'octagon-warning', 'info-2', 'my-circle-warning', 'help-circle'])
    add(11, 'outline', 24, n, g(fam.core.w, fam.core.cap, fam.core.join, draw['circle-info'](24, fam.core)));
  db.close();
  const run = (...a) => spawnSync(process.execPath, [PROBE, pin, ...a], { encoding: 'utf8', env: { ...process.env, HOME: home } });
  return { root, pin, home, run };
}
const WORLD_EXPECTED = "\n## The short answer\n1. Core's line is 2.0 px at 24, 32 and 48 (100% of 24 drawings); UI's is 1.5 px at 12 and 18 (100% of 14)\n   ink \u00d71.36 for \u00d71.33; \u00d71.53 for \u00d71.5; air \u00d71.60 for \u00d71.33, \u00d71.75 for \u00d71.5, \u00d72.82 for UI's \u00d71.5\n   radius Core 2 \u2192 3 \u2192 5 px, UI 1 \u2192 2; stroke share falls 8.3 \u2192 6.2 \u2192 4.2% in Core (24 \u2192 32 \u2192 48) and rises 8.3 \u2192 12.5% in UI (18 \u2192 12)\n2. ours: tightest air \u00d71.47 \u2013 2.48 (1.3 px at all three), stroke \u00d71.0 then \u00d71.2, margin 2 \u00b7 2 \u00b7 1\n3. radius \u00f7 stroke: Core 24 1.00\u00d7, Core 32 1.50\u00d7, Core 48 2.50\u00d7, UI 18 1.33\u00d7, UI 12 0.67\u00d7, Micro Bold 20 1.00\u00d7; one radius on 100% of each grid's rounded container corners; ours 2.5 \u00b7 2 \u00b7 1.5 \u2014 1.67\u00d7, 1.33\u00d7, 1.20\u00d7 (the share on it in the document cites card 1.2)\n4. p10 air: 2.7 \u00b7 5.0 \u00b7 9.4 px in Core (11.3 \u00b7 15.5 \u00b7 19.7% of the canvas, 1.36 \u00b7 2.48 \u00b7 4.72 of the stroke), 1.8 \u00b7 1.6 px in UI; ours 1.3 px (5.4 \u00b7 5.1 \u00b7 3.3%, 0.9 \u00b7 0.7 \u00b7 0.4 strokes)\n5. the bigger grid carries more parts in 17 \u2013 50% of concepts (UI 12 \u2192 18: 17%; Core 24 \u2192 48: 50%) and fewer in 0%; ours 24 \u2192 16: 14.3% shed, 0% gain; >5% extra ink 17% (24 \u2192 32) and 43% (32 \u2192 48)\n6. \"redrawn\": 0.0% Core 24 \u2192 32, 33.3% Core 32 \u2192 48, 16.7% UI 18 \u2192 12, 33.3% Core 24 \u2192 UI 18 (+33 points); stroke 8.3% of Core 24, 4.2% of Core 48, 12.5% of UI 12\n   43 \u2013 83% of size-only pairs unchanged within 2% of ink; nudged 39 \u2013 42% of the ink\n7. ours 24 \u2192 16 unchanged 86% against UI 18 \u2192 12 67%; changed >10% 14% against 33%; ours 24 \u2192 20 and 20 \u2192 16 100% and 86%\n\n## Sample, and why this one\nSource: Nucleo's local library, data.sqlite3 + 61 .svg (icon rows in the database)\nFamilies: 59 drawings in the five families (Core 25 \u00b7 UI 16 \u00b7 Sharp 6 \u00b7 Pixel 6 \u00b7 Micro Bold 6); the other 2 are free sets outside them\nDistinct: 58 once repeats are set aside (4 family \u00d7 grid \u00d7 style \u00d7 name keys occur more than once; 25.0% of those are the same drawing)\nConcepts: Core 6 at all three grids \u00b7 UI 6 at both \u00b7 6 shared by Core 24 and UI 18\nOur side: 7 concepts \u00d7 3 masters = 21 drawings\n\nWhy Nucleo is a control group:\n- stroke_max is set on 6 icons (9.8%), in 2 sets (Arcade 2; Core Essential 4)\n- the families and their grids: Core 24/32/48, UI 12/18, Sharp 24, Pixel 24, Micro Bold 20\n- 8 grids in 5 families; steps \u00d71.33 \u00b7 \u00d71.5 \u00b7 \u00d72.0 (Core), \u00d71.5 (UI) against our \u00d71.2 \u00b7 \u00d71.25 \u00b7 \u00d71.5\n\nInstruments:\n- square caps and mitres Core 24 uses in 100.0% and 100.0% of drawings\n- the keyline probe has few circles at Core 48 (n = 1) and Sharp (1)\n\nDeclared limits:\n- across families the part view and the ink view agree (33.3% and 33.3% of pairs differ), within UI 18 \u2192 12 the part view reports 16.7% against 33.3%\n- the first drawing per name stands for its repeats (25.0% identical)\n- corner_custom (1 icons) is not measured\n\n## \u00a71 Stroke, keyline and margin\n| Family \u00b7 grid | Drawings | Stroke px (at modal) | % of canvas | Circle keyline \u2300 (n) | Stroke \u00f7 keyline | Typical ink long side | Modal min margin | Touch the edge (\u22640.5) | Outer edge on whole px |\n| Core 24 | 9 | 2.0 (100%) | 8.33% | 22 (1) | 9.1% | 22 \u00b7 91.7% | 1 (67%) | 0% | 67% |\n| Core 32 | 8 | 2.0 (100%) | 6.25% | 30 (1) | 6.7% | 30 \u00b7 93.8% | 1 (62%) | 0% | 88% |\n| Core 48 | 7 | 2.0 (100%) | 4.17% | 46 (1) | 4.3% | 46 \u00b7 95.8% | 1 (71%) | 0% | 71% |\n| UI 18 | 7 | 1.5 (100%) | 8.33% | 16 (1) | 9.4% | 15.5 \u00b7 86.1% | 1 (43%) | 0% | 29% |\n| UI 12 | 7 | 1.5 (100%) | 12.5% | 10 (1) | 15.0% | 9.5 \u00b7 79.2% | 1 (43%) | 0% | 29% |\n| Micro Bold 20 | 6 | 2.0 (100%) | 10.0% | 16 (1) | 12.5% | 16 \u00b7 80.0% | 2 (83%) | 0% | 83% |\n| Sharp 24 | 6 | 2.0 (100%) | 8.33% | 22 (1) | 9.1% | 22 \u00b7 91.7% | 1 (83%) | 0% | 83% |\n| Pixel 24 | 6 | 2.0 (100%) | 8.33% | 22 (1) | 9.1% | 22 \u00b7 91.7% | 1 (83%) | 0% | 83% |\n| **Ours 24** | 7 | 1.5 (100%) | 6.25% | 20 | 7.5% | 18 \u00b7 75.0% | 2 (29%) | 0% | 29% |\n| **Ours 20** | 7 | 1.5 (100%) | 7.50% | 16 | 9.4% | 14 \u00b7 70.0% | 2 (29%) | 0% | 29% |\n| **Ours 16** | 7 | 1.25 (100%) | 7.81% | 14 | 8.9% | 10.6 \u00b7 66.1% | 1 (29%) | 0% | 29% |\n(Our keylines, read by the same probe: 20 \u00b7 16 \u00b7 14; ring outer edge = 2r + stroke = 18.5 + 1.5, 14.5 + 1.5, 12.75 + 1.25.)\n\nLive area (canvas \u2212 2 \u00d7 modal margin): 22 \u00b7 30 \u00b7 46 px in Core (92 \u00b7 94 \u00b7 96%), 16 and 10 in UI (89 \u00b7 83%), 16 in Micro Bold (80%), 22 in Sharp and 22 in Pixel (92%)\n  in Core, UI and Micro Bold the live area equals the keyline probe: yes\n  Ours: 20 \u00b7 16 \u00b7 14 (83 \u00b7 80 \u00b7 88%), set by a margin of 2 \u00b7 2 \u00b7 1\n\nWhat the eye sees: 92 \u2013 96% of the box in Core at every grid, 86% then 79% in UI; at UI 12 0% touch the edge.\n  Ours stands in at 66 \u2013 75% for a typical drawing and 80 \u2013 87.5% for the ring (83.3 \u00b7 80.0 \u00b7 87.5%)\n  0% of UI 12 and 0% of Core 24 touch the canvas edge; Core 48 0%, Micro Bold 0%, which still fill 96% and 80% of the box\n\nThe stroke: 2 values (2.0 and 1.5) cover all 8 grids. Stroke \u00f7 keyline across grids: Core 4.3 \u2013 9.1% (4.8 points), UI 9.4 \u2013 15.0% (5.6 points), ours 7.5 \u2013 9.4% (1.9 points)\n\nOn the grid: outer edge on whole pixels in 67 \u2013 88% of Core drawings and 29% of ours; UI 29%\n  square-warning's outer edge: UI 18 1.0 and 17.0, UI 12 1.0 and 11.0\n\n## \u00a72 Corner radius \u2014 does it track the stroke?\n| Family \u00b7 grid | Corners | Modal radius | Share on it | Radii to cover 90% | \u00f7 stroke | \u00f7 canvas | Sharp share of container corners | Open-line bends that are sharp |\n| Core 24 | 4 | 2.0 | 100.0% | 1 | 1.00 | 8.3% | 0.0% | 50% |\n| Core 32 | 4 | 3.0 | 100.0% | 1 | 1.50 | 9.4% | 0.0% | 50% |\n| Core 48 | 4 | 5.0 | 100.0% | 1 | 2.50 | 10.4% | 0.0% | 50% |\n| UI 18 | 4 | 2.0 | 100.0% | 1 | 1.33 | 11.1% | 0.0% | 50% |\n| UI 12 | 4 | 1.0 | 100.0% | 1 | 0.67 | 8.3% | 0.0% | 50% |\n| Micro Bold 20 | 4 | 2.0 | 100.0% | 1 | 1.00 | 10.0% | 0.0% | 50% |\n| Sharp 24 | 4 | 2.0 | 100.0% | 1 | 1.00 | 8.3% | 0.0% | 50% |\n| Pixel 24 | 4 | 2.0 | 100.0% | 1 | 1.00 | 8.3% | 0.0% | 50% |\n| **Ours 24** | 4 | 2.5 | 100.0% | 1 | 1.67 | 10.4% | 0.0% | 50% |\n| **Ours 20** | 4 | 2.0 | 100.0% | 1 | 1.33 | 10.0% | 0.0% | 50% |\n| **Ours 16** | 4 | 1.5 | 100.0% | 1 | 1.20 | 9.4% | 0.0% | 50% |\n(Our share on the modal value in this table is this probe's own two-decimal count; the document's three table cells for it cite card 1.2, findings-corners.md \u00a71.1 \u2014 a wave-5 reconcile item.)\nsquare-warning, container corner radius: Core 24 2, Core 32 3, Core 48 5, UI 18 2, UI 12 1\nRadius equals stroke in 2 cell of 6 (Core 24, Micro Bold 20); the others: Core 32 1.50\u00d7, Core 48 2.50\u00d7, UI 18 1.33\u00d7, UI 12 0.67\u00d7\n  Core 24 \u2192 32 \u2192 48: 2 \u2192 3 \u2192 5 (steps \u00d71.5, \u00d71.67); UI 2 at 18 and 1 at 12\n  share of canvas: Core 8.3% \u2192 10.4%, UI 11.1% \u2192 8.3%; ours 1.67\u00d7 \u00b7 1.33\u00d7 \u00b7 1.20\u00d7, 10.4 \u00b7 10.0 \u00b7 9.4% of the canvas\n\nEach grid has one radius: 100% of Core 24's and 100% of Core 32's rounded container corners, 100% of UI 18's, on the modal value; 1 or 1 radii reach 90%. Ours (this probe): 100% on the modal value, 1 radii to 90%\n  one radius per master used by 100% of rounded container corners (the six cells)\nCore is mixed-corner: 0% of container corners square, 50% of open-line bends mitred; UI 0%, ours 0%; Sharp 0.0%, Pixel 0%\nBends: UI's centreline radius reads 0 in 50%; ours draws an arc in 50%\n\n## \u00a73 Air \u2014 the practical floor\n| Family \u00b7 grid | Drawings | px at p5 \u00b7 p10 \u00b7 p25 \u00b7 p50 | Strokes at p10 \u00b7 p50 | Canvas share at p10 \u00b7 p50 | Below one stroke |\n| Core 24 | 6 | 2.72 \u00b7 2.72 \u00b7 3.04 \u00b7 4.60 | 1.36 \u00b7 2.30 | 11.3% \u00b7 19.2% | 0% |\n| Core 32 | 5 | 4.96 \u00b7 4.96 \u00b7 4.96 \u00b7 6.00 | 2.48 \u00b7 3.00 | 15.5% \u00b7 18.8% | 0% |\n| Core 48 | 7 | 9.44 \u00b7 9.44 \u00b7 9.72 \u00b7 12.40 | 4.72 \u00b7 6.20 | 19.7% \u00b7 25.8% | 0% |\n| UI 18 | 5 | 1.79 \u00b7 1.79 \u00b7 1.79 \u00b7 3.00 | 1.19 \u00b7 2.00 | 9.9% \u00b7 16.7% | 0% |\n| UI 12 | 2 | 1.55 \u00b7 1.60 \u00b7 1.76 \u00b7 2.02 | 1.07 \u00b7 1.34 | 13.4% \u00b7 16.8% | 0% |\n| Micro Bold 20 | 5 | 0.60 \u00b7 0.60 \u00b7 0.60 \u00b7 3.00 | 0.30 \u00b7 1.50 | 3.0% \u00b7 15.0% | 40% |\n| Sharp 24 | 5 | 2.72 \u00b7 2.72 \u00b7 2.72 \u00b7 4.00 | 1.36 \u00b7 2.00 | 11.3% \u00b7 16.7% | 0% |\n| Pixel 24 | 5 | 2.72 \u00b7 2.72 \u00b7 2.72 \u00b7 4.00 | 1.36 \u00b7 2.00 | 11.3% \u00b7 16.7% | 0% |\n| **Ours 24** | 3 | 1.27 \u00b7 1.30 \u00b7 1.38 \u00b7 1.50 | 0.87 \u00b7 1.00 | 5.4% \u00b7 6.2% | 33% |\n| **Ours 20** | 3 | 1.01 \u00b7 1.02 \u00b7 1.05 \u00b7 1.10 | 0.68 \u00b7 0.73 | 5.1% \u00b7 5.5% | 100% |\n| **Ours 16** | 2 | 0.52 \u00b7 0.53 \u00b7 0.58 \u00b7 0.67 | 0.43 \u00b7 0.53 | 3.3% \u00b7 4.2% | 100% |\nCore's floor: 2.7 \u2192 5.0 \u2192 9.4 px; 1.4 \u2192 2.5 \u2192 4.7 strokes; 11.3 \u2013 19.7% of the canvas. UI: 1.8 \u2192 1.6 px, 9.9 \u2192 13.4%\nOurs: 1.27/1.30/1.38 \u00b7 1.01/1.02/1.05 \u00b7 0.52/0.53/0.58 at p5/p10/p25; 5.4 \u2192 5.1 \u2192 3.3% of the canvas; 0.9 \u2192 0.7 \u2192 0.4 strokes; 33 \u2013 100% below one stroke against 0 \u2013 40% of the Nucleo families' (Pixel 0%)\n\nThe same concept at two grids:\n| Same concept | Grid \u00d7 | Air floor \u00d7 | Pairs where the air is bigger \u00b7 equal \u00b7 smaller at the bigger grid |\n| Core 24 \u2192 32 | 1.33 | 1.60 | 100% \u00b7 0% \u00b7 0% (n = 5) |\n| Core 32 \u2192 48 | 1.50 | 1.75 | 100% \u00b7 0% \u00b7 0% (n = 5) |\n| Core 24 \u2192 48 | 2.00 | 2.79 | 100% \u00b7 0% \u00b7 0% (n = 5) |\n| UI 12 \u2192 18 | 1.50 | 2.82 | 100% \u00b7 0% \u00b7 0% (n = 2) |\n| **Ours 20 \u2192 24** | 1.20 | 1.47 | 67% \u00b7 33% \u00b7 0% (n = 3) |\n| **Ours 16 \u2192 20** | 1.25 | 1.66 | 100% \u00b7 0% \u00b7 0% (n = 2) |\n| **Ours 16 \u2192 24** | 1.50 | 2.48 | 100% \u00b7 0% \u00b7 0% (n = 2) |\n\nGlyph dot-to-stem air (exclamation, question and info icons):\n| | Core 24 | Core 32 | UI 18 | UI 12 | Sharp 24 | Pixel 24 | **Ours 24 \u00b7 20 \u00b7 16** |\n| dot-to-stem air, median px | 2.28 | 3.64 | 1.71 | 0.38 | 2.28 | 2.28 | **1.61 \u00b7 1.09 \u00b7 0.82** |\n| in strokes | 1.14 | 1.82 | 1.14 | 0.25 | 1.14 | 1.14 | **1.08 \u00b7 0.73 \u00b7 0.66** |\n| drawings in the cell | 2 | 2 | 2 | 2 | 2 | 2 | 1 \u00b7 1 \u00b7 1 |\n  the professionals' band: 0.2 \u2013 1.8 stroke; ours 0.7 \u2013 1.1; cells 1 \u2013 2 drawings\nPixel: 0 of its 5 drawings sit at 0.82 \u2013 0.83 on the air measure (2 dp); 2\u221a2 \u2212 2 = 0.83\n\n## \u00a74.1 Ratios to the grid\n| Same concept | Grid ratio | Stroke | Ink long side | Air floor | Container radius |\n| Core 24 \u2192 32 | 1.33 | 1.00 | 1.36 | 1.60 | 1.50 (n = 1) |\n| Core 32 \u2192 48 | 1.50 | 1.00 | 1.53 | 1.75 | 1.67 (n = 1) |\n| Core 24 \u2192 48 | 2.00 | 1.00 | 2.09 | 2.79 | 2.50 (n = 1) |\n| UI 12 \u2192 18 | 1.50 | 1.00 | 1.60 | 2.82 | 2.00 (n = 1; equal in 0%) |\n| **Ours 20 \u2192 24** | 1.20 | 1.00 | 1.25 | 1.47 | 1.25 (n = 1) |\n| **Ours 16 \u2192 20** | 1.25 | 1.20 | 1.24 | 1.66 | 1.33 (n = 1) |\n| **Ours 16 \u2192 24** | 1.50 | 1.20 | 1.46 | 2.48 | 1.67 (n = 1) |\n(Stroke column: Nucleo = ratio of the two grids' modal strokes (\u00a71); ours = the two masters' strokes.)\nUI's ink share: 12-grid 81% against 18-grid 88%\n\n## \u00a74.2 The ink itself \u2014 held, nudged, gone\n| Chain | Pairs | Ink held | Nudged | Unchanged (\u22642% of ink unmatched) | Minor (2 \u2013 10%) | Changed (>10%) | Bigger grid has >5% ink the smaller lacks | Smaller has >5% the bigger lacks | Held ink, smaller \u00f7 larger (canvas share) |\n| Core 32 \u2192 24 | 6 | 54% | 42% | 83% | 0% | 17% | 17% | 0% | \u00d70.971 |\n| Core 48 \u2192 32 | 7 | 50% | 39% | 43% | 29% | 29% | 43% | 0% | \u00d70.955 |\n| Core 48 \u2192 24 | 6 | 47% | 42% | 50% | 17% | 33% | 50% | 17% | \u00d70.916 |\n| UI 18 \u2192 12 | 6 | 37% | 40% | 67% | 0% | 33% | 33% | 33% | \u00d70.885 |\n| *Core 24 \u2192 UI 18 (style changes too)* | 6 | 79% | 10% | 67% | 0% | 33% | 17% | 17% | \u00d70.980 |\n| **Ours 24 \u2192 20** | 7 | 59% | 41% | 100% | 0% | 0% | 0% | 0% | \u00d71.000 |\n| **Ours 20 \u2192 16** | 7 | 58% | 40% | 86% | 0% | 14% | 14% | 0% | \u00d71.000 |\n| **Ours 24 \u2192 16** | 7 | 96% | 2% | 86% | 0% | 14% | 14% | 0% | \u00d71.003 |\nWhat stays: 76 \u2013 97% of the larger grid's ink is within one stroke of the smaller grid's; 37 \u2013 54% within a quarter-stroke (the four size-only chains)\nWhat goes: in Core the bigger grid carries \u22655% extra ink in 17% (24 \u2192 32), 43% (32 \u2192 48) and 50% (24 \u2192 48) of concepts, against 0 \u2013 17% the other way. UI 18 \u2192 12 sheds in 33% and adds in 33%.\n  unmatched stretches: 33 \u2013 100% of the dropped or added runs are under three strokes long, 0 \u2013 33% ten strokes or more\nOurs 24 \u2192 16 against UI 18 \u2192 12: 86% unchanged against 67%; 14% changed against 33%. Ours 24 \u2192 20 and 20 \u2192 16: 100% and 86% unchanged; held ink \u00d71.000 at 20, \u00d71.000 at 16\n\n## \u00a74.3 The repo's \"redrawn\" verdict\n| Chain | Pairs | Redrawn | Re-tuned | Scaled / same shape own weight | Worst gap, median |\n| Core 24 \u2192 UI 18 (size **and** style) | 6 | 33.3% | 50.0% | 16.7% | 0.25 strokes |\n| Core 24 \u2192 Core 32 (every third concept) | 2 | 0.0% | 50.0% | 50.0% | 0.20 |\n| Core 32 \u2192 Core 48 (every third concept) | 3 | 33.3% | 66.7% | 0.0% | 0.46 |\n| UI 18 \u2192 UI 12 (all) | 6 | 16.7% | 66.7% | 16.7% | 0.38 |\nThe stroke's share of the canvas: 8.3% of Core 24, 6.2% of Core 32, 4.2% of Core 48; 12.5% of UI 12\n  \"redrawn\": 16.7% (UI 18 \u2192 12, line 8.3 \u2013 12.5% of the canvas), 0.0% (Core \u00d71.33), 33.3% (Core \u00d71.5); cross-family 33.3% \u2014 33.3 points above the same \u00d71.33 step inside Core\n\n## \u00a74.4 Part by part\n| | Core 24 \u2192 UI 18 | UI 18 \u2192 UI 12 |\n| every part has a counterpart, none off by more than a stroke | 66.7% | 66.7% |\n| \u2026 and a part is reshaped in place by more than a stroke | 0.0% | 0.0% |\n| \u2026 and a part moved or was resized (needed the shape fit) | 0.0% | 16.7% |\n| every part pure scaling (\u22640.1 stroke) | 0% | 0% |\n| **some part has no counterpart (dropped or added)** | **33.3%** | **16.7%** |\n| matched parts | 12 | 11 |\n| of them matched in place (not after a move) | 91.7% | 81.8% |\n| a part's centre moves \u2014 median \u00b7 p90, strokes | 0.00 \u00b7 0.24 | 0.00 \u00b7 1.70 |\n| a part's own worst deviation \u2014 median \u00b7 p90, strokes | 0.17 \u00b7 0.37 | 0.18 \u00b7 0.53 |\n| part size as a share of canvas, other \u00f7 this \u2014 p10 \u00b7 median \u00b7 p90 | 0.93 \u00b7 0.97 \u00b7 1.00 | 0.86 \u00b7 1.00 \u00b7 1.50 |\n| parts with no counterpart in the other drawing | 1 in A \u00b7 1 in B | 2 in A \u00b7 1 in B |\n| \u2026 of which open lines \u00b7 closed shapes \u00b7 dots | A 100 \u00b7 0 \u00b7 0% \u00b7 B 0 \u00b7 100 \u00b7 0% | A 50 \u00b7 50 \u00b7 0% \u00b7 B 100 \u00b7 0 \u00b7 0% |\nThe parts that vanish or appear: open lines 0 \u2013 100%, closed shapes 0 \u2013 100%, dots 0%; the parts that stay move by a median 0.00 \u00b7 0.00 of a stroke\nInk view at the same strictness (>2% of ink unmatched): 33.3% of Core \u2194 UI pairs and 33.3% of UI 18 \u2192 12; part view 33.3% and 16.7%. Looser: 33.3% and 33.3% over 5%, 33.3% and 33.3% over 10%\n\n## \u00a74.5 What the redraws look like\ncaps: Core 24 square 100.0% / mixed 0.0%, UI 18 round 100.0%; joins: Core 24 mitre 100.0%, UI 18 round 100.0%\nsolid (filled) parts at the smaller grid: rise in 0% of UI concepts and fall in 17%; Core 48 \u2192 24 rise in 0%, fall in 33%\nmean parts per concept: 2.17 \u2192 2.33 \u2192 2.67 (24 \u2192 32 \u2192 48)\n(The named examples and the 28 overlay sheets are a look, not a census.)\n\n## \u00a74.6 Detail by grid, for the same concept\n| | Mean parts | Concepts with the same parts | Bigger grid has more | Bigger grid has fewer | Mean segments |\n| Core 24 \u2192 32 | 2.17 \u2192 2.33 | 83.3% | 16.7% | 0 | 4.3 \u2192 4.7 |\n| Core 32 \u2192 48 | 2.33 \u2192 2.67 | 66.7% | 33.3% | 0 | 4.7 \u2192 5.2 |\n| Core 24 \u2192 48 | 2.17 \u2192 2.67 | 50.0% | 50.0% | 0 | 4.3 \u2192 5.2 |\n| UI 12 \u2192 18 | 2.00 \u2192 2.17 | 83.3% | 16.7% | 0 | 4.2 \u2192 4.5 |\n| **Ours 16 \u2192 20** | 1.43 \u2192 1.71 | 85.7% | 14.3% | 0 | 3.1 \u2192 3.4 |\n| **Ours 20 \u2192 24** | 1.71 \u2192 1.71 | 100.0% | 0.0% | 0 | 3.4 \u2192 3.4 |\n| **Ours 16 \u2192 24** | 1.43 \u2192 1.71 | 85.7% | 14.3% | 0 | 3.1 \u2192 3.4 |\n(concepts at every grid: Core 6, UI 6, ours 7)\nAt the same \u00d71.5 step their rate is 1.2 times ours (UI 12 \u2192 18: 16.7%, against our 16 \u2192 24: 14.3%); at Core 32 \u2192 48 it is 2.3 times\n\n## \u00a75 What is held and what is let go \u2014 the list\nNucleo \u2014 held: the stroke (2.0 or 1.5); scaled: the ink (\u00d71.36 \u2013 2.09), the air floor (\u00d71.60 \u2013 2.82), Core's container radius (\u00d71.50 \u2013 2.50)\n  let go: the number of parts (17 \u2013 50% of concepts differ; 17 \u2013 50% gain parts on the bigger grid); exact position: 39 \u2013 42% of the ink nudged by 0.25 \u2013 1 stroke\n  margin: 1 and 1 px at Core 24 and 32; 1 at UI 12, 1 at Core 48\nOurs \u2014 held: the air (\u00d71.47 \u2013 2.48); the stroke at 24/20 (1.5), then \u00d71.2 at 16; scaled: the ink (\u00d71.24 \u2013 1.46), the container radius (\u00d71.25 \u2013 1.67); let go: 0 \u2013 14% of concepts' parts; the share of canvas (ink 75 \u2192 70 \u2192 66%); the margin (2 \u00b7 2 \u00b7 1)\n\n## \u00a76 Findings\nK1. dot-to-stem air: 2.28 px (Core 24), 3.64 (Core 32), 1.71 (UI 18), 0.38 (UI 12), 2.28 (Sharp 24); Pixel 2.28\nK2. stroke_max is set on 6 of 61 icons (9.8%), in 2 sets \u2014 Arcade 2, Core Essential 4 \u2014 one value per set and grid: no (Arcade 30: 3; Arcade 30: 4; Core Essential 24: 2; Core Essential 32: 2)\nK3. our floor is 5.4% of the 24 canvas and 3.3% of the 16; \u00d71.47 against \u00d71.60 \u2013 2.82 for the same step\nK4. typical drawing 75.0 \u00b7 70.0 \u00b7 66.1% of the canvas (ring 83.3 \u00b7 80.0 \u00b7 87.5%); held ink \u00d71.000 at 20 and \u00d71.000 at 16; Core 91.7 \u00b7 93.8 \u00b7 95.8%\nK5. our detail budget differs in 0 \u2013 14% of concepts, theirs in 17 \u2013 50%\nKind 1 \u2014 our drawings under one stroke of air (the \u00a73 table's floor \u00f7 stroke < 0.995):\n  24: 1 of 3 (33%); glyph-noted concepts 0; the others: square-2 1.25\n  20: 3 of 3 (100%); glyph-noted concepts 1; the others: bars 1.00, square-2 1.25\n  16: 2 of 2 (100%); glyph-noted concepts 1; the others: bars 0.50\n\n## \u00a77 What only Maruti's eye can settle \u2014 the figures it quotes\n1. the 16 holds 0.5 px of air; UI's floor (1.8 px) in its place would be \u00d73.36\n2. UI 12 fills 79%; Core holds 92 \u2013 96%; ours falls to 70% at 20\n3. 14.3% of our concepts differ in parts between 24 and 16; UI 18 \u2192 12 differs in 16.7%\n   (the four concepts the document names, parts at 24/20/16: gear-3 //, building //, sliders-2 //, trash // \u2014 a pick, not a census)\n\n## \u00a78 Independently re-derived\nstroke-width=\"2\" in 81.8% / 72.7% / 70.0% of the attributes in Core 24 / 32 / 48; \"1.5\" in 77.8% / 77.8% of UI 12 / 18's\nmodal quarter-turn corner radius, every third drawing (svgpathtools reading, ported): Core 24 **3.0** (100% of 1), Core 32 \u2014 (no quarter-turn corner), Core 48 \u2014 (no quarter-turn corner), UI 18 **3.0** (100% of 1), UI 12 \u2014 (no quarter-turn corner)\n[not reprinted by a committed tool: the ink bands re-implemented with svgpathtools + a KD-tree on 24 pairs chosen by python's seeded random.shuffle \u2014 the card's own research/references/nucleo/card-2.3/ink_indep.py (gitignored) prints them with python3 + svgpathtools + scipy in < 1 s]";

test('CLI: every section on the rich synthetic world matches the frozen output; a cache from another pin is refused', async () => {
  const W = await richWorld();
  const cache = path.join(W.root, 'cache');
  const r = W.run('--cache', cache);
  assert.equal(r.status, 0, r.stderr);
  const got = r.stdout.split('\n').slice(1).join('\n').trimEnd();
  const want = WORLD_EXPECTED.trimEnd().split('\n'), have = got.split('\n');
  for (let i = 0; i < Math.max(want.length, have.length); i++) assert.equal(have[i], want[i], `line ${i + 2} differs`);
  const again = W.run('short', 's8', '--cache', cache);                       // the stamped cache is reused
  assert.equal(again.status, 0, again.stderr);
  for (const f of fs.readdirSync(cache)) {                                       // each file carries the stamp: format, pin digest, library size|whole ms
    const c = JSON.parse(fs.readFileSync(path.join(cache, f), 'utf8'));
    assert.equal(c.format, 'nucleo-probe/2'); assert.match(c.pin, /^[0-9a-f]{64}$/); assert.match(c.library, /^\d+\|\d+$/);
  }
  for (const m of [24, 20, 16]) {                                             // a changed pin, at any master: refused
    const f = path.join(W.pin, `src/icons/${m}/minus.svg`), was = fs.readFileSync(f);
    fs.appendFileSync(f, ' ');
    const other = W.run('s1', '--cache', cache);
    assert.equal(other.status, 2, `${m}`);
    assert.match(other.stderr, /was not made from this pin/);
    fs.writeFileSync(f, was);
  }
  assert.equal(W.run('s1', '--cache', cache).status, 0);                       // restored: the cache is good again
  fs.rmSync(W.root, { recursive: true, force: true });
});
