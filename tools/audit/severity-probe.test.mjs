// Tests for tools/audit/severity-probe.mjs (card "reprint", severity-proposal.md). Synthetic fixtures
// only: SVG texts handed to this repo's tools/lint.mjs (byte-identical to the pin's), hand-written test
// text, and a tiny fake pin in a temp directory. Nothing under research/ or a real pin is read.
// Run: node --test tools/audit/severity-probe.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import * as L from '../lint.mjs';
import { shiftProbe, coverage } from './severity-probe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const PROBE = join(HERE, 'severity-probe.mjs');

test('shiftProbe: a line `off` units right of centre is silenced by `optical: off 0`', () => {
  const p = shiftProbe(L, 3);
  assert.deepEqual(p.warnings, []);
  assert.match(p.headline, /centre 12,12$/);
  const q = shiftProbe(L, 0.25);
  assert.match(q.headline, /centre 12,12$/);
});

test('coverage counts lines matching each grep term, case-insensitively', () => {
  const c = coverage('test checkfamilies\nuses g here\nOPTICAL shift\nexceeds 2 decimal places\nno <svg> root\nan undocumented value\nnothing');
  assert.deepEqual(c, { checkFamilies: 1, 'banned element / attribute': 1, 'decimal-count error': 1, 'undocumented off-grid': 1, 'missing <path> / <svg>': 1, optical: 1 });
});

test('the CLI on a fake pin prints §4.3 from the set and refuses an unknown section', () => {
  const dir = mkdtempSync(join(tmpdir(), 'severity-probe-'));
  const svg = (m, w, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
  try {
    for (const [m, w] of [[24, 1.5], [20, 1.5], [16, 1.25]]) {
      mkdirSync(join(dir, 'src/icons', String(m)), { recursive: true });
      writeFileSync(join(dir, 'src/icons', String(m), 'disc.svg'), svg(m, w, '  <!-- box: 1x1 -->\n  <path d="M4 4H8"/>'));
      writeFileSync(join(dir, 'src/icons', String(m), 'disc-filled.svg'), svg(m, w, '  <path d="M4 4H8"/>\n  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M2 2H6V6H2Z"/>'));
    }
    mkdirSync(join(dir, 'tools'));
    for (const t of ['lint.mjs', 'geometry.mjs', 'masters.mjs']) copyFileSync(join(REPO, 'tools', t), join(dir, 'tools', t));
    const r = spawnSync(process.execPath, [PROBE, dir, 's4.3'], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /^## §4\.3 /m);
    assert.match(r.stdout, /also carry strokes \(§5c never runs\): 3/);
    assert.match(r.stdout, /opting out of the keyline match by note: 1 of 1/);
    assert.equal(spawnSync(process.execPath, [PROBE, dir, 's9'], { encoding: 'utf8' }).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ── the print lines, with every quantity distinct so a swapped field shows ──────────

import { holesLines, offGridLine, numeralLine, recommendLine } from './severity-probe.mjs';

test('holesLines prints mixed, shape-filled and the opt-outs from the right fields', () => {
  const fk = { 24: { mixed: 1, shapeFilled: 10 }, 20: { mixed: 2, shapeFilled: 20 }, 16: { mixed: 4, shapeFilled: 40 } };
  assert.deepEqual(holesLines(fk, 5, 9), [
    'shape-filled drawings that also carry strokes (§5c never runs): 7',
    'shape-filled drawings (the bend check never reads their corners): 70',
    'concepts opting out of the keyline match by note: 5 of 9',
  ]);
});

test('offGridLine keeps arc and straight counts apart', () => {
  const og = { values: 1000, arc: 600, straight: 400, straightDrawings: 30, arcOnly: 7, worst: [['a-filled.svg', 9], ['b.svg', 8], ['c.svg', 3], ['d.svg', 1]] };
  assert.equal(offGridLine(og, 120), '4 off-grid coordinates 1,000: 600 arc parameters or arc endpoints, 400 on a plain M/L/H/V; 30 of 120 drawings (25.0%) put a straight-segment coordinate off the grid; arc-derived only 7; worst files (all masters) a-filled 9, b 8, c 3');
});

test('numeralLine and recommendLine count the sort lines, not every warning line', () => {
  const wf = { sortLines: 72, lines: Array(74) };
  const wi = { before: { outline: 12, filled: 24 }, after: { outline: 0, filled: 24 } };
  assert.equal(numeralLine(wf, wi), 'with `glyph: numeral` injected on the sort-numeric files: 12 of 72 sort warning lines clear (outline 12 → 0, filled 24 → 24); 72 → 60');
  assert.equal(recommendLine({ straightDrawings: 1888 }, wf, wi), '4b 12 of 72 warning lines go with `glyph: numeral`; 5 drawings behind the off-grid hatch with a straight-segment coordinate off the grid: 1,888');
});
