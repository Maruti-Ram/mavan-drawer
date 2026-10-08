// Tests for tools/audit/grid-probe.mjs (card 1.6, docs/audit/findings-grid.md).
// Synthetic fixtures only: hand-built path strings and a tiny fake pin in a temp directory.
// Nothing in src/icons, research/ or any scratch path is read.

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  straightRuns, pixelProfile, measureDrawing, judge, kindOf, kindOfText, bypassRasterise, halfTone,
  instrumentSegments, trueSegments, diagonalShareOf, independentEdges, landingScore, zeroLengthArcs,
  centrelineClass, softCause, runScoreAt, retinaBin, bandOf, census, solidByMaster, softCauses, bandRows,
  outerOn, fill2, retina, centrelines, lineProfile, diagonalProbe, validateProfile, independentDiffs, round, q, SOFT_ORDER,
  rowPeaks, topTable, bypassHalfTone, roundingNote,
} from './grid-probe.mjs';
import { areaRegion, strokeRegion, rasterise, readIcon, regionOf } from './raster.mjs';
import { edgeLanding, probe } from './pixelgrid.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);
const ROOT = (w, n) => `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 ${n} ${n}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">`;
const svg = (w, ds, note = '', n = 16) => `${ROOT(w, n)}${note}${ds.map((d) => `<path d="${d}"/>`).join('')}</svg>\n`;

/** A fake pin: six drawings at 16, one at 24, one at 20. */
function fakePin() {
  const dir = mkdtempSync(join(tmpdir(), 'grid-probe-'));
  for (const m of [24, 20, 16]) mkdirSync(join(dir, 'src/icons', String(m)), { recursive: true });
  const put = (n, text, m = 16) => writeFileSync(join(dir, 'src/icons', String(m), `${n}.svg`), text);
  put('plus', svg(1.5, ['M3.75 12h16.5M12 3.75v16.5'], '', 24), 24);              // the 24 midline
  put('flake', svg(1.25, ['M6.485 7.875H7.735A0.625 0.625 0 0 1 8.36 8.5V11.125'], '', 20), 20); // info-2's quarter arc: pixelgrid drops its end extreme
  put('plus', svg(1.25, ['M2.625 8h10.75M8 2.625v10.75']));                        // midline: 0.750, no solid pixel
  put('plus-filled', svg(2, ['M3 8h10M8 3v10']));                                     // 2.0 on a whole number: 0.000
  put('bar-filled', svg(2, ['M3 8.5h10']));                                           // 2.0 on a half-number: the worst, 1.000
  put('bar', svg(1.25, ['M2.625 5.375h10.75'], '<!-- box: 12x1.25 -->'));          // C7 construction: 0.250
  put('chev', svg(1.25, ['M4 6l4 4 4-4'], '<!-- keyline: mark -->'));                // diagonal only: no edge (N)
  put('ring', svg(1.25, ['M2 8A6 6 0 1 0 14 8A6 6 0 1 0 2 8Z']));                    // arcs only (A)
  return dir;
}

test('straightRuns: Z closes to the subpath start, extra M pairs are line-tos, arcs are skipped', () => {
  const a = straightRuns('M2 2H6V6Z');
  assert.equal(a.length, 3);
  near(a[2].len, Math.hypot(4, 4));
  assert.deepEqual([a[2].bx, a[2].by], [2, 2]);
  const b = straightRuns('M1 1A1 1 0 0 1 3 1H5Z');
  assert.deepEqual(b.map((r) => [r.ax, r.ay, r.bx, r.by]), [[3, 1, 5, 1], [5, 1, 1, 1]]);
  assert.deepEqual(straightRuns('M0 0 4 0').map((r) => r.len), [4]);
  assert.deepEqual(straightRuns('m2 2h4v4').map((r) => [r.bx, r.by]), [[6, 2], [6, 6]]);
});

test('pixelProfile: the 1.25 line on a whole number has no solid pixel; on x.375 it has one', () => {
  const mid = pixelProfile(8 - 0.625, 8 + 0.625);
  near(mid.peak, 0.625); assert.equal(mid.core, false);
  const c7 = pixelProfile(8.375 - 0.625, 8.375 + 0.625);
  near(c7.peak, 1); assert.equal(c7.core, true);
  const two = pixelProfile(7, 9, 1e-9);
  near(two.peak, 1); assert.equal(two.core, true);
  const half = pixelProfile(7.5, 9.5);                                               // 2.0 on a half-number: 50 · 100 · 50
  near(half.peak, 1);
});

test('runScoreAt and retinaBin: the edge arithmetic at 1× and 2×', () => {
  near(runScoreAt(8, 1.25, 1), 0.75);
  near(runScoreAt(8.375, 1.25, 1), 0.25);
  near(runScoreAt(8.375, 1.25, 2), 0.5);
  near(runScoreAt(8.25, 1.5, 2), 0);
  near(runScoreAt(8, 1.5, 1), 0.5);
  assert.deepEqual([0, 0.25, 0.5, 0.75, 1].map(retinaBin), ['perfect (0)', '(0, 0.25]', '(0.25, 0.5]', '(0.5, 0.75]', '> 0.75']);
});

test('centrelineClass, softCause and bandOf', () => {
  assert.equal(centrelineClass(8, 16), 'canvas midline');
  assert.equal(centrelineClass(4, 16), 'whole number');
  assert.equal(centrelineClass(5.125, 16), 'x.125');
  assert.equal(centrelineClass(8.375, 16), 'x.375');
  assert.equal(centrelineClass(12, 24), 'canvas midline');
  assert.equal(centrelineClass(3.1, 16), 'off the eighth grid');
  assert.deepEqual([8, 5, 5.125, 4.875, 4.25, 4.3].map((c) => softCause(c, 16)), [SOFT_ORDER[0], SOFT_ORDER[1], SOFT_ORDER[2], SOFT_ORDER[2], SOFT_ORDER[3], SOFT_ORDER[4]]);
  assert.deepEqual([0.2999, 0.3, 0.5, 0.6999, 0.7, 0.75].map(bandOf), ['A', 'B', 'C', 'C', 'D', 'D']);
});

test('judge and kindOf: J, D, A, N', () => {
  assert.equal(kindOf({ runCount: 2, diagonalShare: 0.4, blur: 0.3 }), 'J');
  assert.equal(kindOf({ runCount: 2, diagonalShare: 0.5, blur: 0.3 }), 'D');
  assert.equal(kindOf({ runCount: 0, diagonalShare: null, blur: 0.4 }), 'A');
  assert.equal(kindOf({ runCount: 0, diagonalShare: 1, blur: null }), 'N');
  assert.equal(judge({ runCount: 1, diagonalShare: null, blur: 0.2 }), true);
  assert.equal(kindOfText('<!-- keyline: mark -->'), 'mark');
  assert.equal(kindOfText('<!-- box: 4x4 -->'), 'box');
  assert.equal(kindOfText('<!-- anchor: volume -->'), 'anchor');
  assert.equal(kindOfText(''), 'silhouette');
});

test('bypassRasterise: right where rasterise is wrong on an area edge at x.375', () => {
  const reg = { ...areaRegion(['M2 2.375H14V13.625H2Z']), canvas: 16 };
  const cov = bypassRasterise(reg, { px: 16, rate: 32 });
  near(cov[2 * 16 + 4], 0.625); near(cov[13 * 16 + 4], 0.625); near(cov[7 * 16 + 4], 1); near(cov[0], 0);
  near(cov.reduce((a, b) => a + b, 0), 135);
  near(rasterise(reg, { px: 16, rate: 32 }).cov[2 * 16 + 4], 1);                    // the instrument's defect, for contrast
  const line = bypassRasterise({ ...strokeRegion(['M2 8.375H14'], 1.25), canvas: 16 }, { px: 16, rate: 32 });
  near(line[7 * 16 + 8], 0.25); near(line[8 * 16 + 8], 1); near(line[9 * 16 + 8], 0);   // no sample sits on the 9.0 edge
  const vline = bypassRasterise({ ...strokeRegion(['M8.375 2V14'], 1.25), canvas: 16 }, { px: 16, rate: 32 });
  near(vline[8 * 16 + 7], 0.25); near(vline[8 * 16 + 8], 1); near(vline[8 * 16 + 9], 0);
  near(halfTone([1, 0.5, 0]), 0.5 / 1.5);
  near(halfTone([0.996, 1]), 0);
});

test('instrumentSegments: an arc before Z drops the closing segment; a straight after an arc closes to the arc end', () => {
  const drop = 'M2 2H6A2 2 0 0 1 8 4Z';
  near(diagonalShareOf(instrumentSegments(drop)), 0);
  near(diagonalShareOf(trueSegments(drop)), Math.hypot(6, 2) / (4 + Math.hypot(6, 2)));
  const spur = 'M2 2A2 2 0 0 1 4 4H8V8Z';
  near(diagonalShareOf(instrumentSegments(spur)), Math.hypot(4, 4) / (8 + Math.hypot(4, 4)));
  near(diagonalShareOf(trueSegments(spur)), Math.hypot(6, 6) / (8 + Math.hypot(6, 6)));
  assert.equal(diagonalShareOf([]), null);
});

test('independentEdges + landingScore agree with edgeLanding on plain runs and a ring, and skip a zero-length arc', () => {
  const icon = (d, w = 1.25) => ({ canvas: 16, paths: [{ d, kind: 'stroke', weight: w }] });
  near(landingScore(independentEdges(icon('M2 8.375H14'), 16)), 0.25);
  near(landingScore(independentEdges(icon('M2 8H14'), 16)), 0.75);
  near(landingScore(independentEdges(icon('M2 8.375H14M8 2.625V5'), 16)), (12 * 0.5 + 2 * 2.375 * 0.75) / 28.75);   // ink-length weighted
  for (const d of ['M2 8.375H14', 'M2.5 8A5.5 5 0 1 0 13.5 8A5.5 5 0 1 0 2.5 8Z', 'M3 3.25H9A2 2 0 0 1 11 5.25V11']) {
    const inst = edgeLanding(probe([{ d, kind: 'stroke', weight: 1.25 }], 16), 16).edges;
    near(landingScore(independentEdges(icon(d), 16)), landingScore(inst), 1e-12);
  }
  assert.equal(independentEdges(icon('M2 2A1 1 0 0 1 2 2'), 16).length, 0);
  assert.deepEqual(zeroLengthArcs('M2 2A1 1 0 0 1 2 2M4 4A1 1 0 0 1 6 4'), [[2, 2]]);
  assert.deepEqual(zeroLengthArcs('M3 3h2a1 1 0 0 1 0 0'), [[5, 3]]);
});

test('lineProfile and diagonalProbe: the §2 key', () => {
  const mid = lineProfile(16, 1.25, 0);
  assert.deepEqual(mid.cov, [62.5, 62.5]); near(mid.score, 0.75);
  const c7 = lineProfile(16, 1.25, 0.375);
  assert.deepEqual(c7.cov, [25, 100]); near(c7.score, 0.25);
  assert.deepEqual(lineProfile(24, 1.5, 0.5).cov, [25, 100, 25]);
  const d = diagonalProbe(0.5);
  assert.ok(d.darkest > 0.7 && d.darkest < 0.9, `darkest ${d.darkest}`);
  assert.equal(d.touched, 4);
  assert.equal(diagonalProbe(0.25).touched, 3);
});

test('validateProfile: the analytic profile equals the rasteriser on 48 probe lines', () => {
  const v = validateProfile();
  assert.equal(v.n, 48); assert.ok(v.worst < 1e-9, `worst ${v.worst}`);
});

test('rowPeaks: darkest pixel per row and fully inked pixels of a shipped-style 16 file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'grid-probe-rows-'));
  try {
    writeFileSync(join(dir, 'diag.svg'), svg(1.25, ['M2 2L14 14']));
    writeFileSync(join(dir, 'line.svg'), svg(1.25, ['M2 8.375H14']));
    const d = rowPeaks(join(dir, 'diag.svg'));
    assert.equal(d.full, 0); assert.ok(d.lo > 0.9 && d.hi < 0.995, `${d.lo} ${d.hi}`);
    const l = rowPeaks(join(dir, 'line.svg'));
    assert.equal(l.full, 12); near(l.lo, 1); near(l.hi, 1);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('bypassHalfTone: taken at rate 32 (the shape below reads differently at 16)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'grid-probe-ht-'));
  try {
    const f = join(dir, 'disc.svg');
    writeFileSync(f, `${ROOT(1.25, 16)}<path d="M2.3 8.1A5.7 5.7 0 1 0 13.7 8.1A5.7 5.7 0 1 0 2.3 8.1Z" fill="black" fill-rule="evenodd" stroke="none"/></svg>\n`);
    const reg = regionOf(readIcon(f));
    const at = (rate) => round(halfTone(bypassRasterise(reg, { px: 16, rate })), 4);
    assert.notEqual(at(32), at(16));                                                  // the fixture is rate-sensitive
    assert.equal(bypassHalfTone(f), at(32));
    assert.equal(bypassHalfTone(f, { rate: 16 }), at(16));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('roundingNote: counts shown (3 dp of a 4-dp store) scores more than 0.0005 from the exact one', () => {
  const rows = [
    { blur: 0.1235, blurExact: 0.12354, straightOnly: 0.3145, straightExact: 0.31449 },   // both double-rounded away
    { blur: 0.1235, blurExact: 0.12346, straightOnly: 0.2, straightExact: 0.2 },           // both fine
    { blur: null, blurExact: null, straightOnly: null, straightExact: null },               // undefined: not counted
  ];
  assert.deepEqual(roundingNote(rows), { n: 4, big: 2 });
});

test('bandRows: means per band and the spread pick at quartile positions (rounded index)', () => {
  const mk = (name, blur) => ({ name, blur, runCount: 2, diagonalShare: 0, coreShare: 1, meanPeak: 1, strokeLen: 10, arcLen: 2 });
  const rows = ['a', 'b', 'c', 'd', 'e', 'f'].map((n, i) => mk(n, 0.1 + i * 0.01));
  const C = { by: (m, s) => (m === 16 && s === 'outline' ? rows : []) };
  const [A] = bandRows(C, 'outline');
  assert.equal(A.count, 6); near(A.share, 1); near(A.curve, 0.2);
  assert.deepEqual(A.pick, ['a', 'b', 'd', 'e', 'f']);                                  // indices round(p × 5) = 0, 1, 3, 4, 5
  // both sides of every band edge: a score exactly on an edge goes to the upper band
  const edge = [0.2999, 0.3, 0.4999, 0.5, 0.6999, 0.7, 0.75].map((v, i) => mk(`e${i}`, v));
  const E = bandRows({ by: (m, s) => (m === 16 && s === 'outline' ? edge : []) }, 'outline');
  assert.deepEqual(E.map((b) => [b.n, b.x.map((y) => y.blur)]), [['A', [0.2999]], ['B', [0.3, 0.4999]], ['C', [0.5, 0.6999]], ['D', [0.7, 0.75]]]);
});

test('helpers: round and q (linear interpolation)', () => {
  assert.equal(round(0.123456, 4), 0.1235); assert.equal(round(null), null);
  near(q([1, 2, 3, 4], 0.5), 2.5); near(q([4, 1, 3, 2], 0.25), 1.75);
});

test('measureDrawing and the census aggregates on a fake pin', () => {
  const dir = fakePin();
  try {
    const plus = measureDrawing(join(dir, 'src/icons/16/plus.svg'));
    assert.equal(plus.blur, 0.75); assert.equal(plus.straightOnly, 0.75); assert.equal(plus.runCount, 4); assert.equal(plus.diagonalShare, 0);
    assert.deepEqual(plus.runs, [[1, 8, 10.75, 1.25], [0, 8, 10.75, 1.25]]);
    assert.equal(plus.meanPeak, 0.625); assert.equal(plus.coreShare, 0); assert.equal(plus.arcLen, 0);
    assert.deepEqual(plus.box, { x0: 2, y0: 2, w: 12, h: 12 });
    const bar = measureDrawing(join(dir, 'src/icons/16/bar.svg'));
    assert.deepEqual(bar.box, { x0: 2, y0: 4.75, w: 12, h: 1.25 }); assert.equal(bar.coreShare, 1); assert.equal(bar.blur, 0.25);
    const chev = measureDrawing(join(dir, 'src/icons/16/chev.svg'));
    assert.equal(chev.arcLen, 0); assert.equal(chev.diagLen, round(2 * Math.hypot(4, 4), 3)); assert.equal(chev.diagonalShare, 1);
    const ring = measureDrawing(join(dir, 'src/icons/16/ring.svg'));
    assert.equal(kindOf(ring), 'A'); assert.ok(ring.arcLen > 37 && ring.arcLen <= ring.strokeLen);
    assert.equal(kindOf(chev), 'N');

    const C = census(dir);
    assert.equal(C.rows.length, 8);
    const ind = independentDiffs(C);
    assert.deepEqual(ind.diffs.map((x) => x.key), ['20/flake']); assert.equal(ind.scored, 7);
    assert.ok(ind.diffs[0].d > 0.001, `diff ${ind.diffs[0].d}`);
    assert.equal(C.twin(C.at.get('16/plus')).name, 'plus-filled');
    const s = solidByMaster(C, 16, 'outline');
    near(s.tot, 32.25); near(s.core, 10.75); near(s.meanPeak, (21.5 * 0.625 + 10.75) / 32.25); near(s.mid, 21.5); assert.equal(s.midDrawings, 1); near(s.midSoft, 21.5);
    const sc = softCauses(C);
    near(sc.soft, 21.5); near(sc.mid, 21.5); assert.equal(sc.cls[SOFT_ORDER[0]].n, 2);
    const b = bandRows(C, 'outline');
    assert.deepEqual(b.map((x) => [x.n, x.count]), [['A', 1], ['D', 1]]);
    near(b[0].core, 1); near(b[1].peak, 0.625); near(b[1].core, 0);
    const oe = outerOn(C, 16, 'outline');
    assert.deepEqual(oe.all, [1, 4]); assert.deepEqual(oe.box, [0, 1]); assert.deepEqual(oe.mark, [0, 1]); assert.deepEqual(oe.silhouette, [1, 2]);
    const f = fill2(C, 16);
    near(f.tot, 30); near(f.len['0'], 20); assert.equal(f.names['0'].size, 1);
    near(f.len['1.0'], 10); assert.deepEqual([...f.names['1.0']], ['bar']); assert.equal(f.len['(0,1)'], undefined);
    // §3.3 / §3.6: the twin column is the other style's score
    const to = topTable(C, 'outline').table, tf = topTable(C, 'filled').table;
    assert.match(to, /^\| `plus` \| 0\.750 \| J \| 0\.750 \| 0% \| 4 \| run y=7\.375 \(off 0\.375\) \| 0\.000 \|$/m);
    assert.match(tf, /^\| `bar` \| 1\.000 \| J \| 1\.000 \| 0% \| 2 \| run y=7\.5 \(off 0\.500\) \| 0\.250 \|$/m);
    assert.deepEqual(topTable(C, 'outline').r.map((x) => x.name), ['plus', 'ring']);   // ring has no twin: '—'
    assert.match(to, /^\| `ring` \| 0\.750 \| A \|.*\| — \|$/m);
    const r1 = retina(C, 16, 1);
    near(r1.mean, (21.5 * 0.75 + 10.75 * 0.25) / 32.25); near(r1.b['(0.5, 0.75]'], 21.5); near(r1.b['(0, 0.25]'], 10.75);
    const r2 = retina(C, 16, 2);
    near(r2.mean, 0.5); near(r2.b['(0.25, 0.5]'], 32.25);
    const cl = centrelines(C, 16);
    near(cl.tot['canvas midline'], 21.5); near(cl.tot['x.375'], 10.75); near(cl.T0, 32.25);
    near(centrelines(C, 24).tot['canvas midline'], 33);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('CLI: a section prints its heading on a fake pin; an unknown section or a missing pin exits 2', () => {
  const dir = fakePin();
  try {
    const ok = spawnSync('node', [join(HERE, 'grid-probe.mjs'), dir, 's3.1', 's3.2'], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^## §3\.1 Who can be scored$/m);
    assert.match(ok.stdout, /^\| outline \| 16 \| 2 \| 0 \| 1 \| 1 \|$/m);
    assert.match(ok.stdout, /^## §3\.2 The census and the four bands$/m);
    const bad = spawnSync('node', [join(HERE, 'grid-probe.mjs'), dir, 's9'], { encoding: 'utf8' });
    assert.equal(bad.status, 2); assert.match(bad.stderr, /unknown section: s9/);
    const none = spawnSync('node', [join(HERE, 'grid-probe.mjs'), join(dir, 'nope')], { encoding: 'utf8' });
    assert.equal(none.status, 2);
    const noArg = spawnSync('node', [join(HERE, 'grid-probe.mjs')], { encoding: 'utf8' });
    assert.equal(noArg.status, 2);
    const flag = spawnSync('node', [join(HERE, 'grid-probe.mjs'), dir, 's3.1', '--bogus'], { encoding: 'utf8' });
    assert.equal(flag.status, 2); assert.match(flag.stderr, /unknown flag: --bogus/);
    rmSync(join(dir, 'src/icons/24'), { recursive: true, force: true });             // a pin with a master missing
    const part = spawnSync('node', [join(HERE, 'grid-probe.mjs'), dir, 's3.1'], { encoding: 'utf8' });
    assert.equal(part.status, 2); assert.match(part.stderr, /no src\/icons\/24/); assert.doesNotMatch(part.stderr, /ENOENT/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
