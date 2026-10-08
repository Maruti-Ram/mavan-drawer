// Tests for tools/audit/angles-probe.mjs — the probe that reprints docs/audit/findings-angles.md.
// Synthetic fixtures only: hand-written path strings, comment strings and a throwaway pin made with
// mkdtempSync. Nothing here reads the real pin, the repo's src/icons or research/.
// Run: node --test tools/audit/angles-probe.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { iconFromSource, anglesOf } from './angles.mjs';
import {
  toRow, population, bucketOf, BUCKET_LABELS, kindByToken, kindByTail, isVariant, runRiseOnGrid, endpointsOnGrid,
  imbalance, decimalsNeeded, smallRatio, declares, DECLARES, GREP, grepL, declaredTokens, pairStyles, worstWithin,
  chevronLegs, rollup, convention, load, report, fx, trim, rnd, rrFixed, rrRound, heldTo, filledOnly, meanOffsetText,
} from './angles-probe.mjs';

const PROBE = fileURLToPath(new URL('./angles-probe.mjs', import.meta.url));
const DEG = 180 / Math.PI;
const close = (a, b, tol, what = '') => assert.ok(Math.abs(a - b) <= tol, `${what} expected ${b} ± ${tol}, got ${a}`);

/** An SVG the way the set writes one: stroked paths, plus area paths in a shape-filled file. */
const svg = (paths, { area = [], comment = '', size = 24 } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor" stroke-width="1.5">` +
  `<!-- ${comment} -->${paths.map((d) => `<path d="${d}"/>`).join('')}` +
  `${area.map((d) => `<path d="${d}" fill="currentColor" stroke="none"/>`).join('')}</svg>`;
/** Every straight segment of one synthetic drawing, as probe rows. */
const rowsOf = (name, master, paths, opts = {}) =>
  anglesOf(iconFromSource(svg(paths, { ...opts, size: master }), { file: `${name}.svg`, master }), { minLength: 0.1 }).segments.map(toRow);

// ── formatting helpers the printed figures depend on ──────────────────────────────────────────
test('fx drops the sign from a rounded zero; trim gives the shortest form; rnd rounds half up', () => {
  assert.equal(fx(-0.0001, 3), '0.000');
  assert.equal(fx(2.8128, 3), '2.813');
  assert.equal(trim(16.5000001), '16.5');
  assert.equal(trim(5), '5');
  assert.equal(rnd(0.96534, 4), 0.9653);
  assert.equal(rnd(0.0636, 3), 0.064);
});

// ── one segment: the dump's rounding and the raw copy ─────────────────────────────────────────
test('toRow rounds exactly as the dump did and keeps the unrounded values under .raw', () => {
  const [r] = rowsOf('check-filled', 24, ['M0 0L10 10.1']);
  const raw = Math.atan2(10.1, 10) * DEG - 45;
  close(r.raw.dev, raw, 1e-12, 'raw dev');
  assert.equal(r.dev, Math.round(raw * 1e5) / 1e5);
  assert.equal(r.fromHorizontal, Math.round((45 + raw) * 1e4) / 1e4);
  assert.equal(r.length, Math.round(Math.hypot(10, 10.1) * 1e4) / 1e4);
  assert.deepEqual(r.to, [10, 10.1]);
  assert.equal(r.concept, 'check');
  assert.equal(r.filled, true);
  assert.equal(r.nearest, 45);
});

// ── the three populations and the histogram ───────────────────────────────────────────────────
test('population cuts at 1e-9, 0.5 and 2, each upper edge inclusive', () => {
  const p = (dev) => population({ dev });
  assert.equal(p(0), 'on');
  assert.equal(p(1e-10), 'on');
  assert.equal(p(1e-5), 'A');
  assert.equal(p(0.5), 'A');
  assert.equal(p(0.50001), 'B');
  assert.equal(p(2), 'B');
  assert.equal(p(2.0001), 'C');
});

test('bucketOf follows the document histogram: == 0, (0, 0.001], … (15, 22.5], > 22.5', () => {
  assert.equal(BUCKET_LABELS.length, 12);
  assert.equal(BUCKET_LABELS[0], '== 0');
  assert.equal(BUCKET_LABELS[1], '(0, 0.001]');
  assert.equal(BUCKET_LABELS.at(-1), '> 22.5');
  assert.equal(bucketOf(0), 0);
  assert.equal(bucketOf(0.0005), 1);
  assert.equal(bucketOf(0.001), 1);
  assert.equal(bucketOf(0.0011), 2);
  assert.equal(bucketOf(0.5), 4);
  assert.equal(bucketOf(0.51), 5);
  assert.equal(bucketOf(22.5), 10);
  assert.equal(bucketOf(23), 11);
});

// ── name kinds: two definitions, used in different sections ───────────────────────────────────
test('kindByToken counts a number anywhere; kindByTail only at the end (or before a size)', () => {
  assert.equal(kindByToken('users-2-behind'), 'num');
  assert.equal(kindByTail('users-2-behind'), 'bare');
  for (const k of [kindByToken, kindByTail]) {
    assert.equal(k('check-2-small'), 'num+size');
    assert.equal(k('check-small'), 'size');
    assert.equal(k('check'), 'bare');
    assert.equal(k('check-3'), 'num');
  }
  assert.equal(isVariant('check-circle-small'), false);
  assert.equal(isVariant('chevron-down-2-large'), true);
});

// ── grids, run and rise ───────────────────────────────────────────────────────────────────────
test('run, rise and endpoints are tested against the master grid: quarter at 24, eighth at 16', () => {
  const at24 = { master: 24, dx: 0.5, dy: -1.25, from: [1, 1], to: [1.5, 2.25] };
  assert.equal(runRiseOnGrid(at24), true);
  assert.equal(endpointsOnGrid(at24), 2);
  assert.equal(runRiseOnGrid({ ...at24, dx: 0.125 }), false);
  assert.equal(runRiseOnGrid({ ...at24, dy: 1.1 }), false);
  assert.equal(endpointsOnGrid({ ...at24, from: [1.01, 1] }), 1);
  assert.equal(endpointsOnGrid({ ...at24, from: [1, 1.01] }), 1);
  const at16 = { master: 16, dx: 0.125, dy: 0.375, from: [0.125, 0.5], to: [0.25, 0.875] };
  assert.equal(runRiseOnGrid(at16), true);
  assert.equal(endpointsOnGrid(at16), 2);
  assert.equal(endpointsOnGrid({ ...at16, to: [0.26, 0.875] }), 1);
});

test('imbalance reads | |dx| - |dy| | at 3 dp; decimalsNeeded the widest coordinate', () => {
  assert.equal(imbalance({ raw: { dx: 4.55, dy: -4.56 } }), '0.010');
  assert.equal(imbalance({ raw: { dx: 6.174, dy: 6.253 } }), '0.079');
  assert.equal(decimalsNeeded({ raw: { from: [6.201, 11.038], to: [12.375, 4.785] } }), 3);
  assert.equal(decimalsNeeded({ raw: { from: [1.5, 2], to: [3, 4.25] } }), 2);
  assert.equal(decimalsNeeded({ raw: { from: [1, 2], to: [3, 4] } }), 0);
});

test('smallRatio finds p:q with p, q <= 8 and the first p, or null', () => {
  assert.equal(smallRatio(2, 1), '2:1');
  assert.equal(smallRatio(-4, 2), '2:1');
  assert.equal(smallRatio(3.5, 2), '7:4');
  assert.equal(smallRatio(8, 5.00001), '8:5');
  assert.equal(smallRatio(5, 16.5), null);           // code's 10:33 is not small
  assert.equal(smallRatio(4.36, 12), null);
  assert.equal(smallRatio(0, 3), null);
});

test('run x rise is written two ways, as the two scripts did', () => {
  const r = { dx: -0.43, dy: 5.39 };
  assert.equal(rrFixed(r), '0.43x5.39');
  assert.equal(rrRound({ dx: 1.6349, dy: -4.4801 }), '1.635x4.48');
});

// ── what a file declares ──────────────────────────────────────────────────────────────────────
test('declares and the grep patterns read the three spellings, and "degrees" is not "deg"', () => {
  const all = '<!-- slash 73.2 deg, walls 4 degrees, point 63.43° -->';
  assert.equal(declares(all), true);
  for (const k of ['any', 'sign', 'deg', 'degrees', 'first']) assert.equal(grepL(all, GREP[k]), true, k);
  assert.deepEqual(declaredTokens(all), ['4 degrees', '63.43°', '73.2 deg']);
  assert.deepEqual(declaredTokens(all, ['°']), ['63.43°']);
  const only = '<!-- leans 50 degrees -->';
  assert.equal(grepL(only, GREP.deg), false);
  assert.equal(grepL(only, GREP.degrees), true);
  assert.equal(grepL(only, GREP.first), true);
  assert.equal(grepL('<!-- 12 deg -->', GREP.first), false);
  assert.equal(grepL('<!-- 12 deg -->', GREP.any), true);
  assert.equal(declares('<!-- a 2 degree bend -->'), false);
  assert.equal(declares('<!-- walls taper 4 degrees -->'), true);
  assert.equal(declares('<!-- slash 73.2 deg. -->'), true);
  assert.equal(declares(null), null);
});

test('the whole-file test spans a line break; the line-by-line grep does not', () => {
  const split = '<!-- turns 12\n° -->';
  assert.equal(DECLARES.test(split), true);
  assert.equal(grepL(split, GREP.any), false);
});

// ── outline against filled (§5) ───────────────────────────────────────────────────────────────
test('pairStyles takes the closest angle inside the 25% length window and leaves the rest unmatched', () => {
  const rows = [
    ...rowsOf('x', 24, ['M0 0L10 10', 'M20 0L20 10']),
    ...rowsOf('x-filled', 24, ['M0 0L10 10.7', 'M0 0L7 12.124', 'M0 0L1 1.2', 'M0 0L20 0']),
  ];
  const { results, onlyOut, onlyFil } = pairStyles(rows);
  assert.equal(results.length, 1);
  assert.equal(onlyOut.length + onlyFil.length, 0);
  const [res] = results;
  assert.equal(res.nMatched, 1);
  close(res.per[0].d, Math.atan2(10.7, 10) * DEG - 45, 1e-9, 'diagonal partner');
  assert.equal(res.per[1].f, null, 'the vertical has no partner within 25% of its length');
  close(res.worst.d, res.per[0].d, 1e-12);
  assert.equal(worstWithin(res, 1), null);
  close(worstWithin(res, 10).d, res.per[0].d, 1e-12);
  close(worstWithin(res, res.per[0].d).d, res.per[0].d, 1e-12, 'a partner exactly at the cap is kept');
});

test('pairStyles breaks an angle tie by the closer length, and the window edge is inclusive', () => {
  const far = 'M0 0L12 11.538461538461538', near = 'M0 0L10 10.4';      // both 1.12 degrees off 45
  const rows = [...rowsOf('y', 24, ['M0 0L10 10']), ...rowsOf('y-filled', 24, [far, near])];
  const [res] = pairStyles(rows).results;
  close(res.per[0].f.raw.length, Math.hypot(10, 10.4), 1e-9, 'nearer length wins');
  const edge = [...rowsOf('z', 24, ['M0 0L10 0']), ...rowsOf('z-filled', 24, ['M0 0L12.5 0'])];
  assert.equal(pairStyles(edge).results[0].nMatched, 1);
  assert.equal(pairStyles(edge, { inclusive: false }).results[0].nMatched, 0);
});

test('chevronLegs pairs legs by angle alone and reports the worst difference per master', () => {
  const rows = [
    ...rowsOf('chevron-down', 24, ['M5.75 9.54L11.47 15.25', 'M18.25 9.54L12.53 15.25']),
    ...rowsOf('chevron-down-filled', 24, ['M5.8 9.6L11.47 15.25', 'M18.2 9.6L12.53 15.25']),
    ...rowsOf('arrow-down', 24, ['M0 0L5 5']),
  ];
  const lines = chevronLegs(rows);
  assert.equal(lines.length, 3, 'one concept x three masters; arrow-down is not a chevron');
  const at24 = lines[0];
  assert.equal(at24.m, 24);
  assert.equal(at24.oFh, '44.950');
  const want = Math.abs(Math.atan2(5.71, 5.72) - Math.atan2(5.65, 5.67)) * DEG;
  close(at24.maxd, want, 1e-9);
  assert.equal(at24.dd, fx(Math.atan2(5.65, 5.67) * DEG - Math.atan2(5.71, 5.72) * DEG, 3));
  assert.equal(lines[1].maxd, null, 'masters with no legs sort last');
});

// ── the roll-up (§6a) and the conventions (§3.3) ──────────────────────────────────────────────
test('rollup builds the §6a row: 2 dp dev, 3 dp offset, masters, style, kind, declares, 1 dp angles', () => {
  const rows = [
    ...rowsOf('pencil', 24, ['M0 0L3.04 0.813']),
    ...rowsOf('pencil-filled', 20, ['M0 0L2.01 0.54']),
    ...rowsOf('check-2-small', 16, ['M2 2L8 8.2']),
    ...rowsOf('plus', 24, ['M0 0L10 0']),
  ];
  const src = { pencil: '<!-- 15° -->', 'check-2-small': '<!-- none -->' };
  const out = rollup(rows, (c) => src[c] ?? null);
  assert.deepEqual(out.map((x) => x.k), ['pencil', 'check-2-small']);
  const [p, c] = out;
  assert.equal(p.maxDev, rnd(Math.max(Math.atan2(0.813, 3.04), Math.atan2(0.54, 2.01)) * DEG, 2));
  assert.equal(p.maxOff, 0.813, 'max offset at 3 dp: the run-and-rise drift of the 24 stroke');
  assert.equal(p.m, '24 20');
  assert.equal(p.style, 'both');
  assert.equal(p.kind, 'bare');
  assert.equal(p.d, true);
  assert.equal(p.n, 2);
  assert.equal(c.kind, 'num+size');
  assert.equal(c.style, 'outline');
  assert.equal(c.d, false);
  assert.equal(c.ang, String(rnd(Math.atan2(6.2, 6) * DEG, 1)));
});

test('convention keeps a concept only when every off-axis segment sits on a target and it reaches each one', () => {
  const seg = (concept, fromHorizontal) => ({ concept, fromHorizontal, dev: Math.min(fromHorizontal, Math.abs(45 - fromHorizontal), 90 - fromHorizontal) });
  const rows = [seg('a', 20.02), seg('a', 69.97), seg('b', 20), seg('c', 20), seg('c', 70), seg('c', 33)];
  assert.deepEqual(convention(rows, [20, 70]).map((x) => x.c), ['a']);
  assert.deepEqual(convention(rows, [20, 70], 0.01).map((x) => x.c), []);
});

test('heldTo counts segments within the claimed spread; filledOnly finds concepts off axis only in the filled file', () => {
  const seg = (fromHorizontal) => ({ fromHorizontal });
  assert.equal(heldTo([seg(20.08), seg(69.92), seg(70.25), seg(19.75)], [20, 70]), 2);
  // either side of the claimed 0.08 (the default): 20.08 and 69.92 in; 20.09 and 69.905 out
  assert.equal(heldTo([seg(20.08), seg(69.92), seg(20.09), seg(69.905)], [20, 70]), 2);
  assert.equal(heldTo([seg(20.08)], [20, 70], 0.05), 0);
  const rows = [
    { concept: 'a', filled: true, dev: 10 }, { concept: 'a', filled: false, dev: 0 },
    { concept: 'b', filled: true, dev: 3 }, { concept: 'b', filled: false, dev: 3 },
    { concept: 'c', filled: false, dev: 0.6 }, { concept: 'd', filled: true, dev: 0.4 },
    { concept: 'e', filled: true, dev: 1 }, { concept: 'e', filled: false, dev: 0.3 },   // off by 0.5-2, filled only
  ];
  assert.deepEqual(filledOnly(rows), ['a', 'e']);
});

test('meanOffsetText writes 3 dp, or 4 dp below 0.01, as §2 does', () => {
  assert.equal(meanOffsetText(0.96534), '0.965');
  assert.equal(meanOffsetText(0.0580), '0.058');
  assert.equal(meanOffsetText(0.00941), '0.0094');
});

// ── the pin: loading and the CLI ──────────────────────────────────────────────────────────────
function fakePin() {
  const dir = mkdtempSync(join(tmpdir(), 'angles-probe-'));
  const put = (m, name, text) => { mkdirSync(join(dir, 'src/icons', String(m)), { recursive: true }); writeFileSync(join(dir, 'src/icons', String(m), `${name}.svg`), text); };
  // A, one under 0.1 (dropped), one of exactly 0.1 (kept), one at 0.5
  put(24, 'check', svg(['M4 4L14 14.1', 'M2 2L2.05 2.02', 'M0 10L0.1 10', 'M20 20L20.5 20'], { size: 24 }));
  put(24, 'check-filled', svg([], { area: ['M4 4L14 14.1L14 4Z'], size: 24 }));
  put(24, 'code', svg(['M9.5 20.25L14.5 3.75'], { comment: 'slash 73.14°', size: 24 }));  // C, declares in "°"
  put(24, 'circle', svg(['M3 12A9 9 0 1 0 21 12A9 9 0 1 0 3 12Z'], { comment: 'seam at 12 deg', size: 24 }));  // no straight segment
  put(24, 'star', svg(['M2 2L12 7.773502691896258', 'M2 12L12 17.95'], { size: 24 }));   // C at 30.00 and 30.75, silent
  put(24, 'flag', svg(['M4 4L4 20'], { size: 24 }));                                     // on axis in the outline …
  put(24, 'flag-filled', svg([], { area: ['M4 4L14 8L4 12Z'], size: 24 }));              // … off axis (21.8) in the filled
  put(16, 'check', svg(['M2 2L8 8.2', 'M2 10L8 16.1'], { size: 16 }));                   // B, and A at 16
  return dir;
}

test('load reads every master, splits off segments under 0.1 and lists curve-only drawings', () => {
  const pin = fakePin();
  try {
    const c = load(pin);
    assert.equal(c.fileList.length, 8);
    assert.equal(c.tiny.length, 1);
    assert.equal(c.rows.length, 15);
    assert.deepEqual(c.noSeg, [{ master: 24, name: 'circle' }]);
    assert.deepEqual(['A', 'B', 'C'].map((k) => c.rows.filter((r) => population(r) === k).length), [3, 1, 5]);
    assert.match(c.src24('code'), /73\.14°/);
    assert.equal(c.src24('nothing'), null);
    const text = report(c, ['s2']);
    assert.match(text, /## §2 Three populations/);
    assert.match(text, /A \+ B \+ C = 9 · B \+ C = 6/);
    assert.match(text, /\| A\. Near-miss 0 < dev <= 0\.5 \| 3 \| 1 \| 24:2 · 20:0 · 16:1 \|/);
    const cMean = meanOffsetText(c.rows.filter((r) => population(r) === 'C').reduce((a, r) => a + r.offset, 0) / 5);
    assert.ok(text.includes(`| C. Genuinely off axis dev > 2 | 5 | 3 | 24:5 · 20:0 · 16:0 |`), 'C row');
    assert.ok(text.endsWith('') && text.split('\n').some((l) => l.startsWith('| C.') && l.endsWith(`| ${cMean} |`)), `C mean offset ${cMean}`);
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

test('the sections compute their figures from the pin: bins, window, shares, counts', () => {
  const pin = fakePin();
  try {
    const c = load(pin);
    const t = (s) => report(c, [s]);
    // §1.2: the legal-band ratio is 16 over 24, on the 5 dp means
    const legal = (m) => { const v = c.rows.filter((r) => r.master === m && r.dev <= 0.5).map((r) => r.offset); return v.reduce((a, b) => a + b, 0) / v.length; };
    assert.ok(t('s1').includes(`against 24's: ${fx(rnd(legal(16), 5) / rnd(legal(24), 5), 2)}x on the 5 dp means`), 'legal-band ratio');
    // §3.1 bins at 1 dp, commonest first
    assert.match(t('s3.1'), /\| 21\.8 \| 2 \| 1 — `flag` \|\n\| 73\.1 \| 1 \| 1 — `code` \|/);
    assert.match(t('s3.1'), /\| 30\.8 \| 1 \| 1 — `star` \|/);
    // §3.4: the window is 0.5 — 30.00 is in, 30.75 is out
    assert.ok(t('s3.4').includes('| Segments within 0.5 of 30 or 60 | 1, in 1 concepts (1 near 30, 0 near 60); by master 1 / 0 / 0 |'));
    // §5.2: found, not named
    assert.ok(t('s5.2').includes('in the filled file only, set-wide: 1 — `flag`'));
    // §6: declared against silent, and the grep counts over the five 24 outline files
    const s6 = t('s6');
    assert.ok(s6.includes('concepts off axis by more than 2: 3; the 24 outline file states a degree figure: 1 · states none: 2 · no 24 file: 0'));
    assert.ok(s6.includes('(any of three spellings): 2 of 5'));
    assert.ok(s6.includes('by spelling: "63.43°" 1 · "4 degrees" 0 · "73.2 deg" 1'));
    assert.ok(s6.includes('two-spelling count — "°" or " degrees" — 1)'));
    // §6.1: the silent ones
    assert.match(t('s6.1'), /silent — 2 concepts/);
    assert.match(t('s6.1'), /\| `flag` \|[\s\S]*\| `star` \|/);
    // A-17: dev > 2 as a share of everything off axis, and of everything beyond 0.5
    assert.ok(t('s7').includes('dev > 2: 5 = 55.56% of the 9 off axis (83.33% of the 6 beyond 0.5)'));
  } finally { rmSync(pin, { recursive: true, force: true }); }
});

test('§5 counts a spurious partner only within 0.001 of exactly 90 or 45', () => {
  const dir = mkdtempSync(join(tmpdir(), 'angles-probe-s5-'));
  try {
    mkdirSync(join(dir, 'src/icons/24'), { recursive: true });
    writeFileSync(join(dir, 'src/icons/24/bar.svg'), svg(['M2 2L12 2'], { size: 24 }));
    writeFileSync(join(dir, 'src/icons/24/bar-filled.svg'), svg(['M2 2L2.01 12'], { size: 24 }));   // 89.94 apart
    const t = report(load(dir), ['s5']);
    assert.ok(t.includes('spurious partners at exactly 90 and 45 (±0.001): 0 and 0'), t);
    assert.match(t, /\| 2 degrees \| 1 \(1\) \| 0 \(0\) \|/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the CLI prints a section heading, and exits 2 on an unknown section or a missing pin', () => {
  const pin = fakePin();
  try {
    const ok = spawnSync(process.execPath, [PROBE, pin, 's1'], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^## §1 Totals/m);
    assert.match(ok.stdout, /\| All \| 15 \| 6 \| 40\.00% \|/);
    const bad = spawnSync(process.execPath, [PROBE, pin, 'zz'], { encoding: 'utf8' });
    assert.equal(bad.status, 2);
    assert.match(bad.stderr, /unknown section: zz/);
    const none = spawnSync(process.execPath, [PROBE, join(pin, 'missing')], { encoding: 'utf8' });
    assert.equal(none.status, 2);
    assert.match(none.stderr, /usage/);
  } finally { rmSync(pin, { recursive: true, force: true }); }
});
