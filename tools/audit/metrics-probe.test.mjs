// Tests for tools/audit/metrics-probe.mjs (card 1.12): the `examples` section runs on
// the archived pin and prints every worked example docs/audit/findings-metrics.md
// quotes, each under the label of the section it backs, as the document states it.
//
// The pin is rebuilt in a temporary directory (git archive + the pin's own
// tools/build.mjs), so nothing in this repository is read for the figures or written.

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
const PIN = '5933041';

test('metrics-probe examples: runs on the archived pin and prints every quoted figure under its label', (t) => {
  if (spawnSync('git', ['-C', REPO, 'cat-file', '-e', `${PIN}^{commit}`]).status !== 0) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const dir = mkdtempSync(join(tmpdir(), 'metrics-probe-'));
  try {
    execFileSync('sh', ['-c', `git -C "${REPO}" archive ${PIN} | tar -x -C "${dir}"`]);
    execFileSync('node', ['tools/build.mjs'], { cwd: dir, stdio: 'ignore' });
    const out = execFileSync('node', [join(HERE, 'metrics-probe.mjs'), dir, 'examples'], { encoding: 'utf8' });
    const lines = Object.fromEntries(out.split('\n').filter((l) => l.startsWith('§')).map((l) => [l.split(' ')[0] + (l.includes('compose-4') ? 'a' : l.includes('paintbrush-5') ? 'b' : ''), l]));
    const want = {
      '§2': ['arrow-right recession 0.05 at the shaft end', '1.11 at the head', 'plus recession 0.03 / 0.03 / 0.03 / 0.03',
        'plus 4.5', 'plus-large 3', 'chevron-down 5 / 5 left/right and 8.79 / 7.78 top/bottom'],
      '§3.2': ['zero-length arc removed (1 arc): 3.23 / 3.95 / 4 / 3.26'],
      '§3.3a': ['compose-4@16 frame wall', 'the build reads 13.987 for 14.000'],
      '§3.3b': ['paintbrush-5@16 left side at y = 9.0000', 'the build reads 5.24 where the ink reaches 4.50'],
      '§3.4': ['written 5.47 for 5.4697', 'ink\'s left edge at 4.5007, 0.0007 off the quarter grid'],
      '§5': ['x 13 · x-large 16 · x-small 10', 'ratio 1×1 · 1×1 · 1×1'],
      '§6': ['image 4.29 · wallet-2 1.5 · wand 8.08'],
      '§7': ['bell-filled@24 bearing left 4 / right 3.99; exact 3.9958 / 3.9958'],
      '§11.1': ['45 entries / 15 names', 'enclosing the rest 81 / 27', 'names in both 7', 'only in the first 8', 'only in the second 20'],
    };
    for (const [label, parts] of Object.entries(want)) {
      assert.ok(lines[label], `no line labelled ${label} in:\n${out}`);
      for (const p of parts) assert.ok(lines[label].includes(p), `${label} should say "${p}":\n${lines[label]}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
