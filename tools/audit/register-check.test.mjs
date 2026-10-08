// Tests for tools/audit/register-check.mjs.
//
// Synthetic fixtures only: a tiny fake source document and a tiny register, written to a
// temporary directory, whose right answers are known by construction. Each test breaks one thing
// and expects the checker to fail on exactly that — a citation to the wrong line, a number no
// cited line holds, a number that is only close to the source's, a number read out of an icon
// name, a table that mixes two kinds, a dead file or line, a bad id, a cell that is not a count,
// a proposal index that does not match the rows — because a check that passes a wrong register is
// worse than none.
//
// Nothing here reads the shipped register or any real audit document: a suite every later card
// gates on must not turn red when someone adds a line to a plan. The shipped register is checked
// from the command line (`node tools/audit/register-check.mjs docs/audit/findings-register.md`),
// and `--at <rev>` repeats that check against the documents as they stood at a commit.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  checkRegister, extractRowNumbers, extractSourceNumbers, parseCitation, parseDrawingsCell,
  parseRegister, proposalIds, reachCellOk, sameNumber, splitCitations,
} from './register-check.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const tool = join(here, 'register-check.mjs');

// --- fixtures --------------------------------------------------------------------------------

const SOURCE = [
  '# A fake findings document',                                                  // 1
  '',                                                                            // 2
  'Pinned tree. 485 concepts, 2,910 drawings.',                                  // 3
  '',                                                                            // 4
  '## 3. The census',                                                            // 5
  '',                                                                            // 6
  '1. **The gap floor delivers a clear pixel on 84.0% / 82.2% / 51.1% of axial spans** at', // 7
  '   24 / 20 / 16; across all spans 41.5% at 16. 1,455 spans. Section 4b.',    // 8
  '2. **12 files at 16 carry the 1.5-era `A2.25` instead of 2.125.** `folder` ×3, `file`.', // 9
  '',                                                                            // 10
  '## 4. Elsewhere',                                                             // 11
  '',                                                                            // 12
  'The chevron family: 36 concepts, 216 files, every value within 0.16 of the measure.', // 13
  'Twenty-two concepts (0.750 band) sit on whole-number centrelines, 61.8% of them.',    // 14
  '',                                                                            // 15
  'A line far away with the number 99 on it, and 7 of 8.',                       // 16
  '',                                                                            // 17
  'Filled leg at 16: 1.957 degrees; the box is 2.4 wide; 1,967 drawings off grid.', // 18
  '',                                                                            // 19
  'Names only: `check-circle-3`, C14, R-F7-03, docs/07:49, §4.4, 2026-10-05, commit 2b6ed80.', // 20
  '',                                                                            // 21
  'Pinned tree: `5933041` — the pin line, 485 concepts.',                        // 22
  '',                                                                            // 23
  'Twice here: a repeated phrase.',                                              // 24
  'Twice here: a repeated phrase.',                                              // 25
].join('\n') + '\n';

function tmp(source = SOURCE) {
  const dir = mkdtempSync(join(tmpdir(), 'register-check-'));
  mkdirSync(join(dir, 'docs', 'audit'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'audit', 'fake.md'), source);
  return dir;
}

function withDir(fn, source) {
  const dir = tmp(source);
  try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

const HEADER = "| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |\n|---|---|---|---|---|---|---|---|---|\n";

function register(rows, { heading = '### Kind (2) — a rule disagrees with another rule or the docs', index = '' } = {}) {
  return `# Fake register\n\n## F8 — Air\n\n${heading}\n\n${HEADER}${rows.join('\n')}\n${index}`;
}

function indexTable(lines) {
  return `\n## 16. Proposal index\n\n| id | made by | answers |\n|---|---|---|\n${lines.join('\n')}\n`;
}

function row({ id = 'R-F8-01', kind = '(2)', eye = 'x', icons = '—', reach = '[needs measuring]', drawings = '[needs measuring]', scope = 'systemic', sources = 'docs/audit/fake.md:7', proposals = '—' } = {}) {
  return `| ${id} | ${kind} | ${eye} | ${icons} | ${reach} | ${drawings} | ${scope} | ${sources} | ${proposals} |`;
}

const GOOD_ROW = row({ eye: 'The floor holds a clear pixel on 84.0% / 82.2% / 51.1% of axial spans at 24 / 20 / 16; 41.5% of all spans at 16', icons: 'every drawing', reach: '1,455 spans', proposals: 'R-9' });
const GOOD_ROW_2 = row({ id: 'R-F8-02', eye: '12 files at 16 carry the 1.5-era corner 2.25 instead of 2.125', icons: '`folder` ×3, `file`', reach: '12 files', drawings: '12 drawings', sources: 'docs/audit/fake.md:9 · docs/audit/fake.md:14' });

const failures = (r) => r.failures.map((f) => f.message).join('\n');

// --- number extraction -----------------------------------------------------------------------

test('identifiers are not numbers in a row: code spans, rule ids, section marks, dates, path:line, card refs, icon names', () => {
  const text = 'C14 and F7 say so; `check-circle-3` and `gap: 1`; §4c and §3.3; 2026-10-05; docs/audit/findings-air.md:212; '
    + 'docs/07:49; R-F7-03, OC-1, PL-9, FM-1, FD-2, A-12, L-7, R-10; 3b.2; card 1.8 and cards 1.1, 1.4; D23; v1; '
    + 'check-circle-3 and chevron-down-2-small; [needs measuring]; card 1.12\'s kind (1); moved from kind (2) · (3)';
  assert.deepEqual(extractRowNumbers(text), []);
});

test('numbers survive the strip and normalise: thousands, decimals, percent, ranges, signs', () => {
  const ns = extractRowNumbers('1,455 spans; 0.750 band; 61.8%; 0.70–0.995; −0.5 and ±0.25; 24 · 20 · 16; 2× and 8.4×; 20×18');
  assert.deepEqual(ns, [1455, 0.75, 61.8, 0.7, 0.995, 0.5, 0.25, 24, 20, 16, 2, 8.4, 20, 18]);
  assert.deepEqual(extractSourceNumbers('reads 1455 or 1,455; 0.75; 61.8 per cent'), [1455, 1455, 0.75, 61.8]);
});

test('a decimal fragment, a letter-suffixed token and a version are not row numbers; a unit is split off', () => {
  assert.deepEqual(extractRowNumbers('x.375 and 1e-6 and 0.0.1 and 12em'), []);
  assert.deepEqual(extractRowNumbers('13.7–16.2px and 0.5u and 2 dp'), [13.7, 16.2, 0.5, 2]);
});

test('a source holds figures written against a letter or in code, never the digits of an identifier', () => {
  assert.deepEqual(extractSourceNumbers('`A2.25` x4 and r1.625; `box: 14x20`; ×3'), [2.25, 4, 1.625, 14, 20, 3]);
  assert.deepEqual(extractSourceNumbers('`check-circle-3`, check-circle-3, chevron-down-2-small, C14, D23, R-F7-03, OC-1, L-10'), []);
  assert.deepEqual(extractSourceNumbers('docs/07:49, lint.mjs:216, §4.4, §7a-5, 2026-10-05, 2b6ed80, 3b.2, card 1.8, x.375'), []);
});

test('numbers must match exactly: a rounding, a near value or an integer of the same size is a different number', () => {
  assert.ok(sameNumber(0.75, 0.750));
  assert.ok(!sameNumber(1.957, 1.96));
  assert.ok(!sameNumber(2, 2.4));
  assert.ok(!sameNumber(0.583, 0.58));
  assert.ok(!sameNumber(1967, 1968));
});

// --- citations -------------------------------------------------------------------------------

test('citations parse as path:line, path:line-line and path "anchor", and split on the middle dot outside quotes', () => {
  assert.deepEqual(parseCitation('docs/audit/fake.md:7'), { path: 'docs/audit/fake.md', from: 7, to: 7, text: 'docs/audit/fake.md:7' });
  assert.deepEqual(parseCitation('`plans/set-and-rules-audit.md:96-104`').from, 96);
  assert.equal(parseCitation('plans/set-and-rules-audit.md:96-104').to, 104);
  assert.deepEqual(parseCitation('plans/x.md "Pinned tree"'), { path: 'plans/x.md', anchor: 'Pinned tree', text: 'plans/x.md "Pinned tree"' });
  assert.equal(parseCitation('see the doc'), null);
  assert.equal(parseCitation('docs/audit/fake.md:9-7'), null);
  assert.deepEqual(splitCitations('docs/audit/a.md:1 · docs/audit/b.md:2-4'), ['docs/audit/a.md:1', 'docs/audit/b.md:2-4']);
  assert.deepEqual(splitCitations('plans/x.md "a · b; c" · docs/audit/b.md:2'), ['plans/x.md "a · b; c"', 'docs/audit/b.md:2']);
});

// --- the register check ----------------------------------------------------------------------

test('a correct register passes with zero failures and the right counts', () => withDir((dir) => {
  const r = checkRegister(register([GOOD_ROW, GOOD_ROW_2]), { root: dir });
  assert.deepEqual(r.failures, []);
  assert.equal(r.rows, 2);
  assert.equal(r.citations, 3);
  assert.deepEqual(r.byKind, { 1: 0, 2: 2, 3: 0 });
  assert.deepEqual(r.bySection, { F8: 2 });
}));

test('a citation to the wrong line fails: the numbers are not within three lines of it', () => withDir((dir) => {
  const wrong = GOOD_ROW.replace('docs/audit/fake.md:7', 'docs/audit/fake.md:16');
  const r = checkRegister(register([wrong]), { root: dir });
  assert.ok(r.failures.length >= 1, 'expected a failure');
  assert.ok(r.failures.some((f) => /number 84 /.test(f.message)), failures(r));
  assert.ok(r.failures.every((f) => f.id === 'R-F8-01'));
}));

test('a number the cited lines do not hold fails, and names the number', () => withDir((dir) => {
  const r = checkRegister(register([GOOD_ROW.replace('1,455 spans', '1,455 spans and 99 near-welds')]), { root: dir });
  assert.equal(r.failures.length, 1);
  assert.match(r.failures[0].message, /number 99 /);
}));

test('a figure restated rounded or near fails: 1.96 for 1.957, 2 for 2.4, 1,968 for 1,967', () => withDir((dir) => {
  for (const [said, n] of [['1.96 degrees', 1.96], ['2 wide', 2], ['1,968 drawings', 1968], ['1.95 degrees', 1.95]]) {
    const r = checkRegister(register([row({ eye: `the leg ${said}`, sources: 'docs/audit/fake.md:18' })]), { root: dir });
    assert.equal(r.failures.length, 1, `${said}: ${failures(r)}`);
    assert.match(r.failures[0].message, new RegExp(`number ${String(n).replace('.', '\\.')} `));
  }
  const exact = checkRegister(register([row({ eye: 'the leg 1.957 degrees; 2.4 wide; 1,967 drawings', sources: 'docs/audit/fake.md:18' })]), { root: dir });
  assert.deepEqual(exact.failures, []);
}));

test('a number found only inside a source identifier fails: an icon name, a rule id, a path:line, a section, a date', () => withDir((dir) => {
  for (const n of ['3', '14', '7', '49', '4.4', '10']) {
    const r = checkRegister(register([row({ eye: `${n} of them`, sources: 'docs/audit/fake.md:20' })]), { root: dir });
    assert.equal(r.failures.length, 1, `${n}: ${failures(r)}`);
  }
}));

test('the window is three lines: a number three lines below the cited line passes, four fails', () => withDir((dir) => {
  // line 8 holds 41.5; cited line 5 is three above it; cited line 4 is four above it.
  assert.deepEqual(checkRegister(register([row({ eye: 'all spans 41.5', sources: 'docs/audit/fake.md:5' })]), { root: dir }).failures, []);
  assert.equal(checkRegister(register([row({ eye: 'all spans 41.5', sources: 'docs/audit/fake.md:4' })]), { root: dir }).failures.length, 1);
}));

test('a number may be found under any one of several citations', () => withDir((dir) => {
  const r = row({ eye: '36 concepts hold within 0.16; 1,455 spans', sources: 'docs/audit/fake.md:13 · docs/audit/fake.md:8' });
  assert.deepEqual(checkRegister(register([r]), { root: dir }).failures, []);
}));

test('an anchor citation finds its one line, and still does after lines are added above it', () => {
  const anchored = row({ eye: 'the pin holds 485 concepts', sources: 'docs/audit/fake.md "Pinned tree: `5933041`"' });
  withDir((dir) => assert.deepEqual(checkRegister(register([anchored]), { root: dir }).failures, []));
  const lines = SOURCE.split('\n');
  const shifted = [...lines.slice(0, 2), ...Array(8).fill('an inserted line'), ...lines.slice(2)].join('\n');
  withDir((dir) => {
    assert.deepEqual(checkRegister(register([anchored]), { root: dir }).failures, []);
    // the same claim cited by line number now points at the wrong place
    const byLine = row({ eye: 'the pin holds 485 concepts', sources: 'docs/audit/fake.md:22' });
    assert.ok(checkRegister(register([byLine]), { root: dir }).failures.length >= 1);
  }, shifted);
});

test('an anchor that matches no line or two lines fails', () => withDir((dir) => {
  const none = checkRegister(register([row({ sources: 'docs/audit/fake.md "No such words"' })]), { root: dir });
  assert.match(failures(none), /anchor matches 0 lines/);
  const two = checkRegister(register([row({ sources: 'docs/audit/fake.md "Twice here"' })]), { root: dir });
  assert.match(failures(two), /anchor matches 2 lines/);
}));

test('--at reads the cited files as they stood at a git revision, not the working tree', (t) => {
  const git = spawnSync('git', ['--version'], { encoding: 'utf8' });
  if (git.status !== 0) { t.skip('git not available'); return; }
  withDir((dir) => {
    const run = (...a) => spawnSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@example.com', ...a], { encoding: 'utf8' });
    assert.equal(run('init', '-q').status, 0);
    assert.equal(run('add', '.').status, 0);
    assert.equal(run('commit', '-q', '-m', 'fixture').status, 0);
    // the working copy moves on: eight lines above everything
    writeFileSync(join(dir, 'docs', 'audit', 'fake.md'), 'new\n'.repeat(8) + SOURCE);
    const text = register([GOOD_ROW]);
    assert.ok(checkRegister(text, { root: dir }).failures.length >= 1, 'the working tree has moved');
    assert.deepEqual(checkRegister(text, { root: dir, at: 'HEAD' }).failures, []);
    const missing = checkRegister(register([row({ sources: 'docs/audit/other.md:3' })]), { root: dir, at: 'HEAD' });
    assert.match(failures(missing), /other\.md: file not found at HEAD/);
  });
});

test('a table that mixes two kinds fails, on the row and on the table', () => withDir((dir) => {
  const mixed = GOOD_ROW_2.replace('| (2) |', '| (3) |');
  const r = checkRegister(register([GOOD_ROW, mixed]), { root: dir });
  assert.ok(r.failures.some((f) => f.id === 'R-F8-02' && /kind \(3\) under a "Kind \(2\)" heading/.test(f.message)));
  assert.ok(r.failures.some((f) => /table mixes kinds \(2, 3\)/.test(f.message)));
}));

test('a kind table under a heading that names no kind fails; a kind outside (1)-(3) fails; "(1) in the sheet" reads as (1)', () => withDir((dir) => {
  const noKind = checkRegister(register([GOOD_ROW], { heading: '### Rows' }), { root: dir });
  assert.ok(noKind.failures.some((f) => /under no "Kind \(n\)" heading/.test(f.message)));
  const bad = checkRegister(register([GOOD_ROW.replace('| (2) |', '| (4) |')]), { root: dir });
  assert.ok(bad.failures.some((f) => /is not \(1\), \(2\) or \(3\)/.test(f.message)));
  const sheet = checkRegister(register([row({ kind: '(1) in the sheet' })], { heading: '### Kind (1) — a drawing disagrees' }), { root: dir });
  assert.deepEqual(sheet.failures, []);
  assert.deepEqual(sheet.byKind, { 1: 1, 2: 0, 3: 0 });
}));

test('a missing file, a line past the end, an unreadable citation and no citation each fail', () => withDir((dir) => {
  const rows = [
    GOOD_ROW.replace('docs/audit/fake.md:7', 'docs/audit/missing.md:7'),
    GOOD_ROW_2.replace('docs/audit/fake.md:9 · docs/audit/fake.md:14', 'docs/audit/fake.md:900'),
    row({ id: 'R-F8-05', sources: 'see the doc' }),
    row({ id: 'R-F8-06', sources: '' }),
  ];
  const msgs = failures(checkRegister(register(rows), { root: dir }));
  assert.match(msgs, /missing\.md: file not found/);
  assert.match(msgs, /line 900 is past the end/);
  assert.match(msgs, /unreadable citation "see the doc"/);
  assert.match(msgs, /no source cited/);
}));

test('ids must be R-F<axis>-<nn> or R-X-<nn>, and unique', () => withDir((dir) => {
  const r = checkRegister(register([GOOD_ROW, GOOD_ROW, GOOD_ROW_2.replace('R-F8-02', 'F8-02')]), { root: dir });
  assert.ok(r.failures.some((f) => /repeats line/.test(f.message)));
  assert.ok(r.failures.some((f) => /is not R-F<axis>-<nn>/.test(f.message)));
  assert.deepEqual(checkRegister(register([GOOD_ROW.replace('R-F8-01', 'R-X-01')], { index: indexTable(['| R-9 | ledger | R-X-01 |']) }), { root: dir }).failures, []);
}));

// --- the drawings and reach cells --------------------------------------------------------------

test('a drawings cell is a count of drawings, every drawing, [needs measuring] or none; anything else fails', () => {
  assert.deepEqual(parseDrawingsCell('1,967 drawings'), { ok: true, counts: [1967], whole: false });
  assert.deepEqual(parseDrawingsCell('45 drawings (card 1.7) ⇄ 43 drawings (card 1.13)'), { ok: true, counts: [45, 43], whole: false });
  assert.deepEqual(parseDrawingsCell('31 + 18 drawings'), { ok: true, counts: [49], whole: false });
  assert.deepEqual(parseDrawingsCell('ten drawings'), { ok: true, counts: [10], whole: false });
  assert.deepEqual(parseDrawingsCell('every drawing (by construction)'), { ok: true, counts: [], whole: true });
  assert.deepEqual(parseDrawingsCell('[needs measuring]'), { ok: true, counts: [], whole: false });
  assert.deepEqual(parseDrawingsCell('none (a doc line)'), { ok: true, counts: [], whole: false });
  assert.deepEqual(parseDrawingsCell('see R-F7-02 (one finding, two kinds)'), { ok: true, counts: [], whole: false, see: 'R-F7-02' });
  assert.equal(parseDrawingsCell('every drawings').ok, false);
  assert.equal(parseDrawingsCell('31 + many drawings').ok, false);
  for (const bad of ['12 concepts', '108 pairs', 'every drawing in sight', '2,910', 'about 40 drawings', '12 drawings ⇄ 3 concepts', '1 ⇄ 2 ⇄ 3 drawings']) assert.equal(parseDrawingsCell(bad).ok, false, bad);
  withDir((dir) => {
    const r = checkRegister(register([row({ drawings: '36 concepts', eye: '36', sources: 'docs/audit/fake.md:13' })]), { root: dir });
    assert.match(failures(r), /drawings cell "36 concepts" is not/);
  });
});

test('a reach cell must hold a count, an enumeration of icons, [needs measuring] or none', () => {
  assert.ok(reachCellOk('12 concepts'));
  assert.ok(reachCellOk('[needs measuring]'));
  assert.ok(reachCellOk('none (a doc)'));
  assert.ok(reachCellOk('`map-pin` · `map-pin-2`'));
  assert.ok(reachCellOk('eleven concepts'));
  assert.ok(reachCellOk('`ban`, `ban-2` and `ban-3`'));
  assert.ok(!reachCellOk('the swap partners'));
  assert.ok(!reachCellOk('`check-3` and its partners'));
  withDir((dir) => {
    const r = checkRegister(register([row({ reach: 'the rings that fill' })]), { root: dir });
    assert.match(failures(r), /reach cell "the rings that fill" holds no count/);
  });
});

test('rows rank by their drawings count, a ⇄ cell by its smaller figure, ties in document order; every-drawing rows are listed apart; the figures are source-checked', () => withDir((dir) => {
  const rows = [
    row({ id: 'R-F8-01', drawings: '216 drawings', sources: 'docs/audit/fake.md:13' }),
    row({ id: 'R-F8-02', drawings: '1,967 drawings', sources: 'docs/audit/fake.md:18' }),
    row({ id: 'R-F8-03', drawings: '2,910 drawings (card 1.15) ⇄ 12 drawings (card 1.2)', sources: 'docs/audit/fake.md:3 · docs/audit/fake.md:9' }),
    row({ id: 'R-F8-04', drawings: '[needs measuring]' }),
    row({ id: 'R-F8-05', drawings: 'every drawing (by construction)' }),
    row({ id: 'R-F8-06', drawings: '36 + 216 drawings', sources: 'docs/audit/fake.md:13' }),
    row({ id: 'R-F8-07', drawings: '216 drawings', sources: 'docs/audit/fake.md:13' }),
  ];
  const r = checkRegister(register(rows), { root: dir });
  assert.deepEqual(r.failures, []);
  assert.deepEqual(r.ranking.map((x) => x.id), ['R-F8-02', 'R-F8-06', 'R-F8-01', 'R-F8-07', 'R-F8-03']);
  assert.deepEqual(r.wholeSet, ['R-F8-05']);
  const wrong = checkRegister(register([row({ drawings: '217 drawings', sources: 'docs/audit/fake.md:13' })]), { root: dir });
  assert.match(failures(wrong), /number 217 /);
  const seeOk = checkRegister(register([row({ id: 'R-F8-01', drawings: '216 drawings', sources: 'docs/audit/fake.md:13' }), row({ id: 'R-F8-02', drawings: 'see R-F8-01' })]), { root: dir });
  assert.deepEqual(seeOk.failures, []);
  assert.deepEqual(seeOk.ranking.map((x) => x.id), ['R-F8-01']);
  const seeBad = checkRegister(register([row({ id: 'R-F8-01' }), row({ id: 'R-F8-02', drawings: 'see R-F8-01' }), row({ id: 'R-F8-03', drawings: 'see R-F8-09' })]), { root: dir });
  assert.match(failures(seeBad), /points at R-F8-01, which carries no count/);
  assert.match(failures(seeBad), /points at R-F8-09, which is no row/);
}));

// --- the proposal index ------------------------------------------------------------------------

test('proposal ids are read in their canonical forms and never inside a longer id', () => {
  assert.deepEqual(
    proposalIds('R-6 · OC-1 · sev §4.5 row 3 · P1(a) · metrics F5 (a decision) · angles §7a-7 · corners §11a-2 · sev §7-4b · sev §6b · primitive-drift check 2b · primitives item 12 · FM-5 (E-1) · PL-7 · FD-3 · Fluent T3 · SF T8 · Nucleo T1 · scaling S1 · mass M-2 · grid G-5'),
    ['R-6', 'OC-1', 'sev §4.5 row 3', 'P1', 'metrics F5', 'angles §7a-7', 'corners §11a-2', 'sev §7-4b', 'sev §6b', 'primitive-drift check 2b', 'primitives item 12', 'FM-5', 'PL-7', 'FD-3', 'Fluent T3', 'SF T8', 'Nucleo T1', 'scaling S1', 'mass M-2', 'grid G-5'],
  );
  assert.deepEqual(proposalIds('R-10 · — (card 1.8, F13; see R-X-13)'), ['R-10']);
  assert.deepEqual(proposalIds('PL-1'), ['PL-1']);
  assert.deepEqual(proposalIds('Untitled take (fix the sentence) · Central take'), ['Untitled take', 'Central take']);
});

test('the proposal index must be the exact inverse of the rows\' proposals cells', () => withDir((dir) => {
  const rows = [row({ proposals: 'R-9 · OC-1' }), row({ id: 'R-F8-02', proposals: 'R-10' })];
  const good = indexTable(['| R-9 | ledger | R-F8-01 |', '| R-10 | ledger | R-F8-02 |', '| OC-1 | optical | R-F8-01 |', '| FD-2 | field | no deviation row |']);
  assert.deepEqual(checkRegister(register(rows, { index: good }), { root: dir }).failures, []);

  const notIndexed = indexTable(['| R-9 | ledger | R-F8-01 |', '| R-10 | ledger | R-F8-02 |']);
  assert.match(failures(checkRegister(register(rows, { index: notIndexed }), { root: dir })), /proposal OC-1 is not in the index/);

  const wrongRow = indexTable(['| R-9 | ledger | R-F8-01 · R-F8-02 |', '| R-10 | ledger | R-F8-02 |', '| OC-1 | optical | R-F8-01 |']);
  assert.match(failures(checkRegister(register(rows, { index: wrongRow }), { root: dir })), /R-9 answers R-F8-02, whose proposals cell does not name it/);

  const missingRow = indexTable(['| R-9 | ledger | R-F8-01 |', '| R-10 | ledger | R-F8-02 · R-F8-07 |', '| OC-1 | optical | R-F8-01 |']);
  assert.match(failures(checkRegister(register(rows, { index: missingRow }), { root: dir })), /R-10 answers R-F8-07, which is no row/);

  const rowNotListed = indexTable(['| R-9 | ledger | — |', '| R-10 | ledger | R-F8-02 |', '| OC-1 | optical | R-F8-01 |']);
  assert.match(failures(checkRegister(register(rows, { index: rowNotListed }), { root: dir })), /proposal R-9: the index does not list this row/);

  const twice = indexTable(['| R-9 | ledger | R-F8-01 |', '| R-9 | ledger | R-F8-01 |', '| R-10 | ledger | R-F8-02 |', '| OC-1 | optical | R-F8-01 |']);
  assert.match(failures(checkRegister(register(rows, { index: twice }), { root: dir })), /"R-9" is listed twice/);
}));

test('a table without a kind column is still number-checked when it has a sources column', () => withDir((dir) => {
  const text = '# r\n\n## Reconcile index\n\n| quantity | figures | sources |\n|---|---|---|\n'
    + '| the band | 84.0% / 82.2% / 51.1% | docs/audit/fake.md:7 |\n'
    + '| wrong | 12 files at 2.125 | docs/audit/fake.md:3 |\n';
  const r = checkRegister(text, { root: dir });
  assert.equal(r.rows, 2);
  assert.equal(r.failures.length, 2, failures(r));
  assert.ok(r.failures.every((f) => f.line === 8));
}));

test('parseRegister ignores tables without a sources column, reads the section from the H2 and finds the index', () => {
  const text = '# r\n\n## F2 — One apparent size\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n### Kind (1) — x\n\n' + HEADER + GOOD_ROW + '\n'
    + indexTable(['| R-9 | ledger | R-F8-01 |']);
  const { tables, index } = parseRegister(text);
  assert.equal(tables.length, 1);
  assert.equal(tables[0].section, 'F2');
  assert.equal(tables[0].headingKind, 1);
  assert.equal(tables[0].rows[0].kind, 2);
  assert.equal(tables[0].rows[0].drawings, '[needs measuring]');
  assert.equal(tables[0].rows[0].reach, '1,455 spans');
  assert.deepEqual(index.map((e) => e.id), ['R-9']);
});

// --- the CLI ---------------------------------------------------------------------------------

test('the CLI exits 0 on a clean register and 1 on a broken one, printing the summary and the ranking', () => withDir((dir) => {
  writeFileSync(join(dir, 'good.md'), register([GOOD_ROW, GOOD_ROW_2], { index: indexTable(['| R-9 | ledger | R-F8-01 |']) }));
  writeFileSync(join(dir, 'bad.md'), register([GOOD_ROW.replace('1,455 spans', '1,455 spans and 99 more')]));
  const good = spawnSync(process.execPath, [tool, join(dir, 'good.md'), '--root', dir], { encoding: 'utf8' });
  assert.equal(good.status, 0, good.stdout + good.stderr);
  assert.match(good.stdout, /rows 2 \(2 in 1 kind tables, 0 elsewhere\) · citations 3 · index 1 · failures 0/);
  assert.match(good.stdout, /by kind: \(1\) 0 · \(2\) 2 · \(3\) 0/);
  assert.match(good.stdout, /by drawings \(top 5 of 1 counted; ties in document order\): R-F8-02 12/);
  assert.match(good.stdout, /every drawing, by construction \(not ranked\): —/);
  const bad = spawnSync(process.execPath, [tool, join(dir, 'bad.md'), '--root', dir], { encoding: 'utf8' });
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /FAIL {2}line \d+ · R-F8-01 · number 99 /);
  assert.match(bad.stdout, /failures 1/);
  assert.equal(spawnSync(process.execPath, [tool], { encoding: 'utf8' }).status, 2);
  assert.equal(spawnSync(process.execPath, [tool, join(dir, 'good.md'), '--at'], { encoding: 'utf8' }).status, 2);
}));
