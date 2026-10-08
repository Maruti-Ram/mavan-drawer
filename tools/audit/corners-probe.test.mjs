// Tests for corners-probe.mjs — synthetic fixtures only (hand-built paths, a tiny fake pin).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  TIERS, SNAP_TOL, SNAP_TOL_C2, snap, tierOf, tierName, famOf, arcsOf, bezierCount, lambdaOf, chordShortfall,
  isZeroLength, arcDepth, buildRows, tierTable, signatures, crossMaster, nesting, pairNearest, pairModal,
  pairVertex, containment, literalPairing, doubledPaths, familySplits, rollup, main,
  containerHistogram, phraseCounts, underBendMin, filletQuality, gainsAt16, BEND_MARGIN, otherRolesUnderBendMin, bendFloor,
} from './corners-probe.mjs';

const PROBE = fileURLToPath(new URL('./corners-probe.mjs', import.meta.url));

// ── fixtures ───────────────────────────────────────────────────────────────
const svg = (m, paths) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor">\n${paths.join('\n')}\n</svg>\n`;
/** A rounded rectangle drawn clockwise, four circular corners of radius r. */
const sq = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`;
const area = (d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;
const line = (d) => `<path d="${d}"/>`;
// `box`: an outline card at tier 1 (24: r2.5, 16: r1.5). Its filled twin at 24 grows by half the
// stroke (r3.25) and punches a r1 hole; at 16 it keeps the 1.5-era 2.25 instead of 2.125.
const DRAWINGS = [
  { master: 24, file: 'box.svg', src: svg(24, [line(sq(3.75, 3.75, 20.25, 20.25, 2.5))]) },
  { master: 24, file: 'box-filled.svg', src: svg(24, [area(sq(3, 3, 21, 21, 3.25) + sq(8, 8, 16, 16, 1))]) },
  { master: 16, file: 'box.svg', src: svg(16, [line(sq(2.625, 2.625, 13.375, 13.375, 1.5))]) },
  { master: 16, file: 'box-filled.svg', src: svg(16, [area(sq(2, 2, 14, 14, 2.25))]) },
];
/** A synthetic corner row, as `cornerRowsOf` emits them. */
const row = (o) => ({ role: 'container', pstyle: 'stroke', style: 'outline', kind: 'arc', master: 24, concept: 'x', name: 'x', convex: true, at: [0, 0], ...o });

// ── parameters and snapping ────────────────────────────────────────────────
test('snap and tierOf: the 0.02 / 0.025 tolerance decides a 0.7724 composite', () => {
  assert.equal(SNAP_TOL, 0.025); assert.equal(SNAP_TOL_C2, 0.02);
  assert.equal(snap(0.7724, 0.02), 0.7724);
  assert.equal(snap(0.7724, 0.025), 0.75);
  assert.equal(snap(2.5015), 2.5);
  assert.equal(tierOf(24, 0.7724, TIERS, 0.02), 0);
  assert.equal(tierOf(24, 0.7724), 3);
  assert.equal(tierOf(16, 1), 2);
  assert.equal(tierOf(20, 2), 1);
  assert.equal(tierOf(24, 1), 0);
  assert.equal(tierName(24, 0), 'sharp'); assert.equal(tierName(20, 1.25), 't2'); assert.equal(tierName(24, 9), '9');
  assert.equal(famOf('pin-6'), 'pin'); assert.equal(famOf('chevron-down-2-small'), 'chevron-down');
});

// ── typed arcs ─────────────────────────────────────────────────────────────
test('arcsOf tracks the pen through relative commands and implicit repeats, and keeps degenerate arcs', () => {
  const a = arcsOf('M10 10h2a2 2 0 0 1 4 0');
  assert.deepEqual([a[0].x1, a[0].y1, a[0].x2, a[0].y2, a[0].rx], [12, 10, 16, 10, 2]);
  const b = arcsOf('M0 0A1 1 0 0 1 2 0 1 1 0 0 1 4 0');
  assert.equal(b.length, 2);
  assert.deepEqual([b[1].x1, b[1].x2], [2, 4]);
  const z = arcsOf('M3 3L5 5Z A1 1 0 0 1 3 3');                   // Z returns the pen to 3,3
  assert.equal(z.length, 1); assert.ok(isZeroLength(z[0]));
  assert.ok(!isZeroLength(a[0]));
  assert.equal(bezierCount('M0 0C1 1 2 2 3 3s1 1 2 2Q0 0 1 1L4 4'), 3);
  assert.equal(bezierCount('M0 0A1 1 0 0 1 2 0H4'), 0);
});

test('lambdaOf and chordShortfall: a 2-dp radius a hair short of its chord', () => {
  const short = { rx: 4.24, ry: 4.24, rot: 0, x1: 0, y1: 0, x2: 8.4994, y2: 0 };
  const exact = { ...short, rx: 4.2497, ry: 4.2497 };
  assert.ok(lambdaOf(short) > 1);
  assert.ok(Math.abs(Math.sqrt(lambdaOf(short)) - 4.2497 / 4.24) < 1e-9);
  assert.ok(lambdaOf(exact) <= 1);
  assert.ok(Math.abs(chordShortfall(short) - 0.0097) < 1e-9);
  assert.ok(chordShortfall(exact) <= 1e-9);
  assert.equal(lambdaOf({ ...short, rx: 0 }), 0);                    // a zero radius draws a line
  // an ellipse: the author's chord check reads rx only, Λ reads both radii
  const ell = { rx: 1, ry: 10, rot: 0, x1: 0, y1: 0, x2: 3, y2: 0 };
  assert.ok(chordShortfall(ell) > 0); assert.ok(lambdaOf(ell) > 1);
  assert.ok(Math.abs(arcDepth(2.5) - 2.5 * (Math.SQRT2 - 1)) < 1e-12);
});

// ── the corner table, from real drawings ───────────────────────────────────
test('buildRows: an outline card and its filled twin', () => {
  const R = buildRows(DRAWINGS);
  const o24 = R.filter((c) => c.master === 24 && c.style === 'outline');
  assert.equal(o24.length, 4);
  assert.ok(o24.every((c) => c.role === 'container' && c.radius === 2.5 && c.pstyle === 'stroke'));
  const f24 = R.filter((c) => c.master === 24 && c.style === 'filled');
  assert.deepEqual(f24.map((c) => c.radius).sort(), [1, 1, 1, 1, 3.25, 3.25, 3.25, 3.25]);
  assert.ok(f24.every((c) => c.pstyle === 'area'));
  assert.equal(R.filter((c) => c.master === 16 && c.style === 'filled' && c.radius === 2.25).length, 4);
  // the card counted on radii rounded to 4 dp (its dumps did), so the rows carry that rounding
  const odd = buildRows([{ master: 24, file: 'odd.svg', src: svg(24, [line(sq(3.75, 3.75, 20.25, 20.25, 2.123456))]) }]);
  assert.deepEqual(odd.map((c) => c.radius), [2.1235, 2.1235, 2.1235, 2.1235]);
});

test('tierTable counts each tier, on-tier and distinct values, at the tolerance it is given', () => {
  const R = [row({ radius: 2.5 }), row({ radius: 2.5 }), row({ radius: 1.5 }), row({ radius: 0.7724 }), row({ radius: 9 }),
    row({ radius: 2.5, role: 'detail' }), row({ radius: 2.5, style: 'filled', pstyle: 'area' }), row({ radius: 0, kind: 'sharp' })];
  const [t24] = tierTable(R);
  assert.equal(t24.n, 5);
  assert.deepEqual(t24.byTier, [2, 1, 0]);
  assert.equal(t24.onTier, 3);
  assert.equal(t24.distinct, 4);
  const [u24] = tierTable(R, TIERS, 0.025);
  assert.deepEqual(u24.byTier, [2, 1, 1]);
  assert.equal(u24.onTier, 4); assert.equal(u24.distinct, 4);   // 2.5 · 1.5 · 0.75 · 9
});

test('signatures and crossMaster', () => {
  const R = [row({ concept: 'a', radius: 2.5 }), row({ concept: 'a', radius: 1.5 }), row({ concept: 'b', radius: 1 }),
    row({ concept: 'c', radius: 0.75 }), row({ concept: 'c', radius: 2.5, role: 'detail' })];
  const s = signatures(R, 24);
  assert.equal(s.get('a'), '1+2'); assert.equal(s.get('b'), '0'); assert.equal(s.get('c'), '3');
  const X = crossMaster([
    row({ concept: 'x', radius: 2.5 }), row({ concept: 'x', radius: 2, master: 20 }), row({ concept: 'x', radius: 1.5, master: 16 }),
    row({ concept: 'y', radius: 1.5, role: 'detail' }), row({ concept: 'y', radius: 1.25, master: 20 }), row({ concept: 'y', radius: 0.625, master: 16 }),
    row({ concept: 'z', radius: 2.5 })]);
  assert.equal(X.per.size, 3); assert.equal(X.clean, 1);
  assert.deepEqual(X.changes.map((c) => c.concept), ['y']);
  assert.deepEqual(X.changes[0].sig, ['t2', 't2', 't3']);
  assert.deepEqual(X.missing, ['z']);
});

test('nesting finds the filled hole and the outline nest', () => {
  const N = nesting(buildRows(DRAWINGS));
  assert.equal(N.outlineDrawings, 2); assert.equal(N.nested, 0); assert.equal(N.multi.length, 0);
  assert.deepEqual(N.pairs, [{ concept: 'box', master: 24, outer: 3.25, inner: 1, diff: 2.25 }]);
  const nest = [{ master: 24, file: 'frame.svg', src: svg(24, [line(sq(3.75, 3.75, 20.25, 20.25, 2.5)), line(sq(8, 8, 16, 16, 1.5))]) }];
  const M = nesting(buildRows(nest));
  assert.equal(M.multi.length, 1); assert.equal(M.nested, 1);
});

test('filled against outline: nearest, modal, containment, literal pairing', () => {
  const R = buildRows(DRAWINGS);
  const P = pairNearest(R);                                            // 24 grows by 0.75; 16 by 0.75, not 0.625
  assert.equal(P.pairs, 2); assert.equal(P.agree, 1); assert.deepEqual(P.rows.map((x) => x.worst), [0, 0.125]);
  const M = pairModal(R);
  assert.equal(M.pairs, 2); assert.equal(M.agree, 1);
  assert.deepEqual(M.rows.map((x) => x.grow), [0.75, 0.75]);
  const K = containment(R);
  assert.equal(K.total, 8); assert.equal(K.ok, 4);
  assert.deepEqual(K.extras.map((e) => e.r).sort(), [1, 1, 1, 1, 2.25, 2.25, 2.25, 2.25]);
  const L = literalPairing(DRAWINGS);
  assert.deepEqual(L.pairs.map((p) => [p.m, p.total, p.missing]), [[24, 1, 0], [16, 1, 1]]);
  assert.deepEqual(L.legacy, [{ name: 'box', o: 1.5 }]);
  assert.deepEqual(L.modern, []);
});

test('pairVertex pairs on the vertex within 0.3 and measures the growth', () => {
  const R = [row({ concept: 'v', radius: 2.5, at: [4, 4] }), row({ concept: 'v', style: 'filled', pstyle: 'area', radius: 3.25, at: [4.1, 4] }),
    row({ concept: 'v', radius: 1.5, at: [10, 10] }), row({ concept: 'v', style: 'filled', pstyle: 'area', radius: 1.5, at: [10.5, 10] })];
  const V = pairVertex(R);
  assert.equal(V.pairs, 1); assert.equal(V.agree, 1); assert.equal(V.rows[0].off, 0);
});

test('doubledPaths finds a d published as both area and stroke', () => {
  const tri = 'M8.5 12.81H15.5L12 6.75Z';
  const D = [{ master: 24, file: 'arrow-filled.svg', src: svg(24, [area(tri), line(tri), line('M12 12.81V18.75')]) },
    { master: 24, file: 'box-filled.svg', src: DRAWINGS[1].src }];
  assert.deepEqual(doubledPaths(D), [{ master: 24, file: 'arrow-filled.svg', n: 1 }]);
});

test('familySplits groups siblings by their set of container radii at 24', () => {
  const R = [row({ concept: 'play', radius: 1.5 }), row({ concept: 'play-2', radius: 2.5 }), row({ concept: 'play-3', radius: 0.75 }),
    row({ concept: 'card', radius: 2.5 }), row({ concept: 'card-2', radius: 2.5 }), row({ concept: 'pin-2', radius: 1 }), row({ concept: 'pin', radius: 0, kind: 'sharp' })];
  const F = familySplits(R);
  assert.deepEqual(F.map((f) => f.family), ['pin', 'play']);
  assert.deepEqual(F[1].groups, [['t1', ['play-2']], ['t2', ['play']], ['t3', ['play-3']]]);
  assert.deepEqual(F[0].groups, [['1', ['pin-2']], ['sharp', ['pin']]]);
});

test('rollup formats the §10a row and compares tier signatures', () => {
  const R = [
    row({ concept: 'card', radius: 2.5 }), row({ concept: 'card', radius: 2, master: 20 }), row({ concept: 'card', radius: 1.5, master: 16 }),
    row({ concept: 'card', radius: 0, kind: 'sharp' }), row({ concept: 'card', radius: 0, kind: 'sharp' }),
    row({ concept: 'card', radius: 0, kind: 'sharp', master: 20 }), row({ concept: 'card', radius: 0, kind: 'sharp', master: 16 }),
    row({ concept: 'odd', radius: 1 }), row({ concept: 'odd', radius: 1, master: 20 })];
  const [card, odd] = rollup(R);
  assert.deepEqual(card, { concept: 'card', cells: ['2.5 + 2x sharp', '2 + 1x sharp', '1.5 + 1x sharp'], sig24: 't1+sharp', stable: true });
  assert.deepEqual(odd, { concept: 'odd', cells: ['1', '1', '—'], sig24: '1', stable: false });
});

// ── section logic ──────────────────────────────────────────────────────────
test('crossMaster snaps at 0.025: a 0.7724 composite reads as tier 3 and the concept stays clean', () => {
  const X = crossMaster([row({ concept: 'h', radius: 0.7724 }), row({ concept: 'h', radius: 0.75, master: 20 }), row({ concept: 'h', radius: 0.625, master: 16 })]);
  assert.equal(X.clean, 1); assert.deepEqual(X.changes, []);
  assert.deepEqual(gainsAt16(new Map([['a', { 24: [1], 16: [1, 2] }], ['b', { 24: [1, 2], 16: [1] }], ['c', { 16: [1, 2] }], ['d', { 24: [1], 16: [0.75] }]])), ['a']);
});

test('nesting needs clearance on all four sides', () => {
  const touching = [{ master: 24, file: 't.svg', src: svg(24, [line(sq(3.75, 3.75, 20.25, 20.25, 2.5)), line(sq(8, 8, 16, 20.25, 1.5))]) }];
  const N = nesting(buildRows(touching));
  assert.equal(N.multi.length, 1); assert.equal(N.nested, 0);
});

test('containerHistogram keeps the container role only, any style', () => {
  const H = containerHistogram([row({ radius: 2.5 }), row({ radius: 3.25, style: 'filled', pstyle: 'area' }), row({ radius: 3.25, style: 'filled', pstyle: 'area' }),
    row({ radius: 0.75, role: 'detail' }), row({ radius: 0, kind: 'sharp' }), row({ radius: 2.5, master: 20 })], 24);
  assert.deepEqual(H, [[3.25, 2], [2.5, 1]]);
});

test('phraseCounts: files by case and occurrences in either case', () => {
  const C = phraseCounts(['Container radius 2.5; Container radius', 'detail radius 1.5', 'container radius (2.5'], 'container radius');
  assert.deepEqual(C, { filesCs: 1, filesCi: 2, occ: 3 });
  assert.deepEqual(phraseCounts(["C10's minimum"], "C10's minimum"), { filesCs: 1, filesCi: 1, occ: 1 });
});

test('underBendMin: composite fits more than 0.005 under the file floor', () => {
  const U = underBendMin([row({ radius: 0.744, bendMin: 0.75, exact: false }), row({ radius: 0.746, bendMin: 0.75, exact: false }),
    row({ radius: 0.5, bendMin: 0.75, exact: true }), row({ radius: 0.1, bendMin: 0.625, exact: false }), row({ radius: 0, kind: 'sharp', bendMin: 0.75 })]);
  assert.deepEqual(U.map((c) => c.radius), [0.1, 0.744]);
});

test('the bendMin margin: corners on both sides of 0.005, in every role, as §8.1 and §8.2 count them', () => {
  assert.equal(BEND_MARGIN, 0.005);
  const rows = [
    row({ role: 'detail', pstyle: 'area', radius: 0.744, bendMin: 0.75 }),   // 0.006 under: counts
    row({ role: 'detail', pstyle: 'area', radius: 0.746, bendMin: 0.75 }),   // 0.004 under: inside the margin
    row({ role: 'detail', pstyle: 'area', radius: 0.71, bendMin: 0.75 }),    // 0.04 under: counts at 0.005, not at 0.05
    row({ role: 'container', radius: 0.6185, bendMin: 0.625 }),              // 0.0065 under: counts
    row({ role: 'detail', kind: 'sharp', radius: 0, bendMin: 0.75 }),        // sharp: never a fillet under the floor
    row({ role: 'bend', radius: 0.744, bendMin: 0.75 }), row({ role: 'bend', radius: 0.746, bendMin: 0.75 }),
    row({ role: 'bend', radius: 0.75, bendMin: 0.75 }), row({ role: 'bend', radius: 0.625, bendMin: 0.625 })];
  assert.deepEqual(otherRolesUnderBendMin(rows).map((c) => c.radius), [0.744, 0.71, 0.6185]);
  assert.deepEqual(bendFloor(rows), { bends: 4, under: 1, on: 2 });
});

test('filletQuality counts reflex corners by drawing name and by concept', () => {
  const Q = filletQuality([row({ name: 'cam', concept: 'cam', reflex: true, tangentError: 180, tangentUneven: 0 }),
    row({ name: 'cam-filled', concept: 'cam', reflex: true, tangentError: 180, tangentUneven: 0 }),
    row({ tangentError: 1, tangentUneven: 0.01, reflex: false }), row({ tangentError: 1.01, tangentUneven: 0.02, reflex: false, role: 'ambiguous' }),
    row({ kind: 'sharp', tangentError: 0, tangentUneven: null, reflex: false })]);
  assert.equal(Q.reflex.length, 2); assert.deepEqual(Q.reflexNames, ['cam', 'cam-filled']); assert.deepEqual(Q.reflexConcepts, ['cam']);
  assert.equal(Q.notTangent.length, 3); assert.equal(Q.lopsided.length, 1); assert.equal(Q.ambiguous, 1);
});

// ── the CLI, on a fake pin ─────────────────────────────────────────────────
test('CLI: prints every section on a tiny pin; unknown section and missing pin exit 2', () => {
  const pin = mkdtempSync(join(tmpdir(), 'corners-probe-'));
  try {
    for (const m of [24, 20, 16]) mkdirSync(join(pin, 'src/icons', String(m)), { recursive: true });
    for (const d of DRAWINGS) writeFileSync(join(pin, 'src/icons', String(d.master), d.file), d.src);
    const all = spawnSync(process.execPath, [PROBE, pin], { encoding: 'utf8' });
    assert.equal(all.status, 0, all.stderr);
    assert.match(all.stdout, /## §0 What the instrument sees/);
    assert.match(all.stdout, /## §10a /);
    assert.match(all.stdout, /4 drawings · 20 corners: 20 fillets and 0 sharp/);   // 4 + 8 + 4 + 4
    const one = spawnSync(process.execPath, [PROBE, pin, 's7.1'], { encoding: 'utf8' });
    assert.equal(one.status, 0);
    assert.match(one.stdout, /## §7\.1 /);
    assert.doesNotMatch(one.stdout, /## §0 /);
    assert.match(one.stdout, /carrying rx 2\.125: 0 · carrying rx 2\.25: 1/);
    const bad = spawnSync(process.execPath, [PROBE, pin, 'nope'], { encoding: 'utf8' });
    assert.equal(bad.status, 2); assert.match(bad.stderr, /unknown section/);
    assert.equal(spawnSync(process.execPath, [PROBE, join(pin, 'missing')], { encoding: 'utf8' }).status, 2);
    assert.equal(main([]), 2);
  } finally { rmSync(pin, { recursive: true, force: true }); }
});
