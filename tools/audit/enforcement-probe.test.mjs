// Tests for tools/audit/enforcement-probe.mjs (card "reprint", enforcement-gap.md). Synthetic fixtures
// only: hand-written lint text, SVG texts handed to this repo's tools/lint.mjs (the pin's lint is
// byte-identical to it), and a tiny fake pin in a temp directory. Nothing under research/ or a real pin.
// Run: node --test tools/audit/enforcement-probe.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import * as L from '../lint.mjs';
import { Ctx } from './register-probe.mjs';
import { errorSites, sectionCites, opticalProbe, gapProbe, injectProbe, rootlessProbe, zeroArcFiles, svg24, symlinkedRun } from './enforcement-probe.mjs';
import { realpathSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const PROBE = join(HERE, 'enforcement-probe.mjs');

function fakePin(files) {
  const dir = mkdtempSync(join(tmpdir(), 'enforcement-probe-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, 'src/icons', rel)), { recursive: true });
    writeFileSync(join(dir, 'src/icons', rel), text);
  }
  mkdirSync(join(dir, 'tools'));
  for (const t of ['lint.mjs', 'geometry.mjs', 'masters.mjs']) copyFileSync(join(REPO, 'tools', t), join(dir, 'tools', t));
  return dir;
}
const MINUS = svg24('  <!-- keyline: mark -->\n  <path d="M5.25 12h13.5"/>');

test('errorSites counts every line that pushes or returns an error, and nothing else', () => {
  const text = [
    "  if (a) errors.push('x');",
    '  r.errors.push(...pair.errors);',
    "  return { errors: [], warnings: [] };",
    "  if (!root) return { file, errors: ['no <svg> root'] };",
    '  // errors.push(in a comment)',
    "  warnings.push('w');",
  ].join('\n');
  assert.deepEqual(errorSites(text), [1, 4]);
});

test('sectionCites finds lint\'s internal §5b…§5f labels and not §5, §5a, §5g or §6', () => {
  assert.deepEqual(sectionCites('lint §5f measures\n§5 and §6 only\n§5b and §5c\nnone\n§5a here\n§5g there'), [1, 3]);
});

test('opticalProbe: a declared shift silences an off-centre mark; a malformed one disables the check', () => {
  assert.equal(opticalProbe(L, null).warnings.length, 1);
  assert.match(opticalProbe(L, null).warnings[0], /off-centre at 7,12/);
  assert.deepEqual(opticalProbe(L, '<!-- optical: -5 0 -->').warnings, []);
  const nan = opticalProbe(L, '<!-- optical: - . -->');
  assert.match(nan.headline, /centre NaN,NaN/);
  assert.deepEqual([nan.warnings.length, nan.errors.length], [0, 0]);
  const typo = opticalProbe(L, '<!-- opticl: -5 0 -->');
  assert.deepEqual([typo.errors.length, typo.warnings.length], [0, 1]);
});

test('gapProbe: a `gap: 0.5` note over edges 1.0 apart is accepted silently', () => {
  assert.equal(gapProbe(L, null).warnings.length, 1);
  const g = gapProbe(L, '<!-- gap: 0.5 -->');
  assert.deepEqual([g.warnings.length, g.errors.length], [0, 0]);
  assert.ok(g.notes.some((x) => /agreed gap 0\.5 — smallest measured 1/.test(x)));
});

test('injectProbe: an area-form path in an outline file changes nothing; a banned element does', () => {
  const area = injectProbe(L, 24, 'minus.svg', MINUS, '  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M-50 -50H99.123456V99Z"/>');
  assert.equal(area.same, true);
  const g = injectProbe(L, 24, 'minus.svg', MINUS, '  <g></g>');
  assert.equal(g.same, false);
  assert.ok(g.after.errors.length > 0);
});

test('rootlessProbe: with no <svg> root only that error survives; with one, the bad note errors', () => {
  const r = rootlessProbe(L);
  assert.deepEqual(r.rootless, ['no <svg> root']);
  assert.ok(r.withRoot.some((x) => /gap note "wide" is not a distance/.test(x)), r.withRoot.join(' | '));
});

test('symlinkedRun: through a symlinked directory prefix lint prints nothing and exits 0 (where such a prefix exists)', () => {
  const dir = fakePin({ '24/minus.svg': MINUS });
  try {
    const s = symlinkedRun(realpathSync(dir));
    if (s) assert.deepEqual([s.bytes, s.exit], [0, 0]);
    const direct = spawnSync(process.execPath, [join(realpathSync(dir), 'tools/lint.mjs')], { cwd: dir, encoding: 'utf8' });
    assert.match(direct.stdout, /1 drawings/, 'by its real path the same lint runs');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('zeroArcFiles finds an arc whose ends meet (and not a full circle) on a fake pin; the CLI prints §3 and refuses an unknown section', () => {
  const dir = fakePin({
    '24/minus.svg': MINUS,
    '24/dot.svg': svg24('  <path d="M11 12A1 1 0 1 0 13 12A1 1 0 1 0 11 12Z"/>'),
    '24/bad.svg': svg24('  <path d="M4 12A7 7 0 0 1 4 12L10 12"/>'),
    '24/near.svg': svg24('  <path d="M4 12A7 7 0 0 1 4.01 12L10 12"/>'),
    '24/ring.svg': svg24('  <path d="M4 12A4 4 0 1 0 4.001 12"/>'),
  });
  try {
    const hits = zeroArcFiles(new Ctx(dir));
    assert.deepEqual(hits.map((f) => f.name), ['bad'], 'a chord of 0.01 is not zero; a near-closed 360° arc is a full circle, not a zero-length one');
    const r = spawnSync(process.execPath, [PROBE, dir, 's3'], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /^## §3 /m);
    assert.match(r.stdout, /error sites in the pin's tools\/lint\.mjs: \d+ — lines /);
    const bad = spawnSync(process.execPath, [PROBE, dir, 's9'], { encoding: 'utf8' });
    assert.equal(bad.status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

import { headlineLines } from './enforcement-probe.mjs';

test('headlineLines prints the summary, the error sites and the sort family\'s share of the warned drawings', () => {
  const run = { summary: { drawings: 100, clean: 90, warned: 8, failed: 2 }, exit: 1 };
  assert.deepEqual(headlineLines(run, 28, { sortDrawings: 6, drawings: 8 }), [
    'lint at the pin: 100 drawings · 90 clean · 8 warned · 2 failed, exit 1',
    "error sites in the pin's lint.mjs: 28 (see §3)",
    'warned drawings from the sort family: 6 of 8',
  ]);
});
