// Tests for tools/audit/stale-probe.mjs (card "reprint", stale-statements.md). Synthetic fixtures only:
// a hand-written sheet, a fake manifest and snapshot, SVG texts, a tiny fake Fluent reference record in a
// temp directory, and a tiny fake pin. Nothing under research/ or a real pin is read.
// Run: node --test tools/audit/stale-probe.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { radiiOf } from './radii.mjs';
import { iconFromSource } from './angles.mjs';
import { sheetRows, categoriesOf, inkboxGuard, stampInk, holeWidths, familyBoxes, fluentPairs, bottomCornerRadius, keylineFacts, decimalFacts, filledAir, share } from './stale-probe.mjs';
import { Ctx, loadSet } from './register-probe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const PROBE = join(HERE, 'stale-probe.mjs');
const svg = (m, w, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;

test('sheetRows reads statuses, numbers and categories; categoriesOf drops the "variant of" the regex also catches', () => {
  const text = [
    '## A · Marks',
    '- [x] 1. `plus` · UI & Layout — note',
    '- [x] 1. `plus-small` · variant of `plus`',
    '- [~] 2. `thumbs-down` · Status & Feedback',
    '- [ ] 3. `calendar` · Time & Calendar',
    'prose that is not a row',
  ].join('\n');
  const rows = sheetRows(text);
  assert.deepEqual(rows.map((r) => r.st), ['x', 'x', '~', ' ']);
  assert.equal(new Set(rows.map((r) => r.n)).size, 3);
  assert.deepEqual(categoriesOf(rows), ['Status & Feedback', 'Time & Calendar', 'UI & Layout']);
});

test('inkboxGuard: identical, thinned line stacks, a bent mark inside the allowance, drift, gone and new', () => {
  const ink = (x, y, w, h) => ({ x, y, w, h });
  const snap = { near: ink(1, 1, 14, 14), same: ink(1, 1, 14, 14), minus: ink(2, 7.375, 12, 1.25), chev: ink(3, 5, 10, 6), drift: ink(1, 1, 14, 14), gone: ink(1, 1, 1, 1) };
  const icons = {
    same: { ink: ink(1, 1, 14, 14), paths: ['M1 1H15'] },
    near: { ink: ink(1.005, 1, 14, 14), paths: ['M1 1H15'] },
    minus: { ink: ink(2, 7.5, 12, 1), paths: ['M2.625 8h10.75'] },
    chev: { ink: ink(3, 5.05, 10, 6), paths: ['M3 5L8 10A0.5 0.5 0 0 0 9 10L13 5'], mark: true },
    drift: { ink: ink(1.5, 1, 14, 14), paths: ['M1 1H15'] },
    added: { ink: ink(1, 1, 2, 2), paths: ['M1 1H3'] },
  };
  const g = inkboxGuard(icons, snap);
  assert.deepEqual([g.total, g.identical, g.thinned, g.allowed, g.drift, g.gone, g.added], [6, 2, ['minus'], ['chev'], ['drift'], ['gone'], ['added']], 'a 0.005 shift is inside EXACT (0.011)');
});

test('stampInk: a capped line\'s ink is its length × width plus the two caps', () => {
  const r = stampInk(svg(16, 2, '  <path d="M4 8H12"/>'), 16);
  const want = 8 * 2 + Math.PI;   // 8 long, 2 wide, two half-discs of radius 1
  assert.ok(Math.abs(r.total - want) < 0.15, `${r.total} vs ${want}`);
  assert.ok(r.solid >= 8, 'the line\'s own pixels are solid');
});

test('holeWidths reads cuts from round ends and dots from all-arc holes of one radius', () => {
  const minus = 'M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM7.5 10.75L16.5 10.75A1.25 1.25 0 0 1 16.5 13.25L7.5 13.25A1.25 1.25 0 0 1 7.5 10.75Z';
  assert.deepEqual(holeWidths(minus), [{ kind: 'cut', widths: [2.5] }]);
  const info = 'M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.75 7.25A1.25 1.25 0 1 0 13.25 7.25A1.25 1.25 0 1 0 10.75 7.25ZM11 10.5A1 1 0 0 1 13 10.5L13 17A1 1 0 0 1 11 17Z';
  assert.deepEqual(holeWidths(info), [{ kind: 'dot', width: 2.5 }, { kind: 'cut', widths: [2] }]);
  const bowl = 'M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM8 9A4 4 0 1 1 13 13A1 1 0 0 1 11 13A2 2 0 1 0 10 9A1 1 0 0 1 8 9Z';
  assert.deepEqual(holeWidths(bowl), [{ kind: 'cut', widths: [2] }]);
});

test('familyBoxes groups by name minus a trailing number, skips sizes, and keeps a family with one box', () => {
  const h = (name, w, hh) => ({ name, w, h: hh });
  const fb = familyBoxes([h('lock', 16, 20), h('lock-2', 16, 20), h('menu', 18, 10.5), h('menu-2', 18, 7.5), h('menu-small', 15, 6), h('foo-small', 1, 1), h('foo-small-2', 2, 2), h('solo', 1, 1)]);
  assert.equal(fb.multi, 2);
  assert.deepEqual(fb.uniform, [{ stem: 'lock', members: 2, box: '16×20' }]);
});

test('fluentPairs compares regular/filled ink by measure.ink and by the path', () => {
  const dir = mkdtempSync(join(tmpdir(), 'stale-probe-fluent-'));
  try {
    const box = (x, y, w, h) => ({ x: { abs: x }, y: { abs: y }, w: { abs: w }, h: { abs: h } });
    const rec = (style, master, ink, d, paint) => ({ style, master, measure: { ink }, paths: [{ d, paint, stroke: paint === 'stroke' ? { weight: 1, cap: 'ROUND', join: 'ROUND' } : null }] });
    const concept = { name: 'Add', records: [
      rec('outline', 16, box(2, 2, 12, 12), 'M2.5 8L13.5 8M8 2.5L8 13.5', 'stroke'),
      rec('filled', 16, box(2, 2, 12, 12), 'M2 2L14 2L14 14L2 14Z', 'fill'),
      rec('outline', 20, box(2, 2, 16, 16), 'M2.5 10L17.5 10', 'stroke'),
      rec('filled', 20, box(1.75, 1.75, 16.5, 16.5), 'M1.75 9.5L18.25 9.5L18.25 10.5L1.75 10.5Z', 'fill'),
      rec('outline', 24, box(3, 3, 18, 18), 'M3.5 12L20.5 12', 'stroke'),
      rec('filled', 24, box(3.1, 3, 18, 18), 'M3 11.5L21 11.5L21 12.5L3 12.5Z', 'fill'),
    ] };
    writeFileSync(join(dir, 'add--1-1.json'), JSON.stringify(concept));
    const r = fluentPairs(dir);
    assert.deepEqual([r.pairs, r.sameInk, r.differConcepts], [3, 1, 1], 'a 0.1 difference is a difference');
    assert.equal(r.samePath, 2, 'by the path (Figma\'s M L C Q Z) the 16 and 24 pairs share a box; the 20 pair is 0.25 wider');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('bottomCornerRadius reads the lowest convex right-angle corners of a drawing', () => {
  const d = 'M6.5 4H17.5A2.5 2.5 0 0 1 20 6.5V18.5A1.5 1.5 0 0 1 18.5 20H5.5A1.5 1.5 0 0 1 4 18.5V6.5A2.5 2.5 0 0 1 6.5 4Z';
  const rec = radiiOf(iconFromSource(svg(24, 1.5, `  <path d="${d}"/>`), { file: 'can.svg', master: 24 }));
  assert.deepEqual(bottomCornerRadius(rec), [1.5]);
});

test('the CLI on a fake pin prints §3 (templates, the legacy folder) and refuses an unknown section', () => {
  const dir = mkdtempSync(join(tmpdir(), 'stale-probe-pin-'));
  try {
    mkdirSync(join(dir, 'src/icons/24'), { recursive: true });
    writeFileSync(join(dir, 'src/icons/24/minus.svg'), svg(24, 1.5, '  <path d="M5.25 12h13.5"/>'));
    mkdirSync(join(dir, 'templates'));
    writeFileSync(join(dir, 'templates/grid-24.svg'), '<svg/>');
    mkdirSync(join(dir, 'tools'));
    for (const t of ['lint.mjs', 'geometry.mjs', 'masters.mjs']) copyFileSync(join(REPO, 'tools', t), join(dir, 'tools', t));
    const r = spawnSync(process.execPath, [PROBE, dir, 's3'], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /^## §3 /m);
    assert.match(r.stdout, /templates\/ at the pin: exists \(grid-24\.svg\); src\/_legacy-stroke-2\/: absent/);
    assert.match(r.stdout, /dead lab pages present: 0 of 6/);
    assert.equal(spawnSync(process.execPath, [PROBE, dir, 'zz'], { encoding: 'utf8' }).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('keylineFacts prints the keyline ratios as the document writes them and counts lint\'s readings', () => {
  const rd = ['circle', 'square', 'portrait', 'portrait', 'landscape', 'mark', 'box', 'anchored'].map((kind) => ({ m: 24, filled: false, kind }));
  const [ratios, readings] = keylineFacts({}, rd);
  assert.match(ratios, /landscape 1\.25 → 1\.333 → 1\.40, portrait 0\.80 → 0\.75 → 0\.714/);
  assert.match(readings, /circle 1 · square 1 · portrait 2 · landscape 1 · declared mark 1 · agreed box 1 · anchored 1; held to landscape or portrait 3/);
});

test('decimalFacts counts files with three or more decimals and the 0.88 cut, master by master', () => {
  const f = (m, name, d) => ({ m, name, filled: /-filled$/.test(name), src: `<path d="${d}"/>` });
  const files = [f(24, 'a', 'M1.25 2.5H3.75'), f(20, 'b-filled', 'M1 1A0.88 0.88 0 0 1 2.76 1'), f(16, 'c', 'M1.125 2.375H4')];
  const line = decimalFacts({ set: { files, byKey: new Map() } });
  assert.match(line, /files with a 3\+ dp number: 0 at 24, 0 at 20, 1 at 16; `A0\.88 0\.88`: 0 at 24, 1 at 20 \(filled 1\), 0 at 16/);
});

test('filledAir honours its cap: a 2.0 cut is read with the cap at 3 and dropped at 1.75', () => {
  const dir = mkdtempSync(join(tmpdir(), 'stale-probe-air-'));
  try {
    mkdirSync(join(dir, 'src/icons/16'), { recursive: true });
    writeFileSync(join(dir, 'src/icons/16/bar-filled.svg'), svg(16, 1.25, '  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM4 7H12V9H4Z"/>'));
    const ctx = new Ctx(dir);
    assert.equal(filledAir(ctx, 1.75)[0].kinds.cut, undefined);
    assert.ok(Math.abs(filledAir(ctx, 3)[0].kinds.cut - 2) < 0.01, JSON.stringify(filledAir(ctx, 3)[0].kinds));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('share writes a stroke share as the README row does', () => {
  assert.deepEqual([6.25, 7.5, 7.8125].map(share), ['6.25', '7.5', '7.8']);
});

import { guardLine } from './stale-probe.mjs';

test('guardLine prints identical, thinned, drifted and new from the right fields', () => {
  const g = { total: 228, identical: 217, thinned: Array(9), drift: Array(2), added: Array(742) };
  assert.equal(guardLine(g, 970), '2.19 inkbox-guard read-only: 228 drawings at 16 · 217 identical · 9 line stacks thinned · 2 drifted; new since 742; drawings at 16 970');
});
