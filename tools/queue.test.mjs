// The sheet's grammar and the commands that edit it (plans/plan-view.md, cards 1.1 and 1.2).
//   node --test tools/queue.test.mjs
// Reads the live research/queue.md; every command that writes runs on a copy in a temp directory.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseSheet, format, stamped, next, counts } from './queue.mjs';
import { sizeBase } from './masters.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_MJS = join(ROOT, 'tools/queue.mjs');
const LIVE = readFileSync(join(ROOT, 'research/queue.md'), 'utf8');
// The live sheet with every MVP mark cleared, for tests that need to know where the marks are.
const PLAIN = (() => { const q = parseSheet(LIVE); for (const r of q.rows) q.lines[r.i] = format({ ...r, mvp: false }); return q.lines.join('\n'); })();

// A scratch copy of the sheet; `run` executes queue.mjs against it.
function scratch(text = LIVE) {
  const dir = mkdtempSync(join(tmpdir(), 'queue-test-'));
  mkdirSync(join(dir, 'research'));
  writeFileSync(join(dir, 'research/queue.md'), text);
  const run = (...args) => spawnSync('node', [QUEUE_MJS, ...args], { cwd: dir, encoding: 'utf8' });
  const sheet = () => readFileSync(join(dir, 'research/queue.md'), 'utf8');
  return { dir, run, sheet, done: () => rmSync(dir, { recursive: true, force: true }) };
}

test('every row of the live sheet round-trips byte-identical', () => {
  const q = parseSheet(LIVE);
  for (const r of q.rows) assert.equal(format(r), q.lines[r.i], `row ${r.i + 1}`);
});

test('a variant with no category is a variant, not an icon', () => {
  const [r] = parseSheet('- [x] 493. `layout-sidebar-2` · variant of `layout-sidebar` — Third · approved 2026-09-26').rows;
  assert.deepEqual([r.category, r.base, r.note], [null, 'layout-sidebar', 'Third · approved 2026-09-26']);
  for (const x of parseSheet(LIVE).rows) assert.doesNotMatch(x.category ?? '', /variant of/, x.name);
});

test('the parser finds exactly the lines that begin "- ["', () => {
  const q = parseSheet(LIVE);
  assert.equal(q.rows.length, LIVE.split('\n').filter((l) => l.startsWith('- [')).length);
});

test('a row with the MVP mark round-trips, with and without a note', () => {
  const q = parseSheet(LIVE);
  for (const r of q.rows) {
    const line = format({ ...r, mvp: true });
    assert.match(line, r.note ? / — mvp · / : / — mvp$/);
    const [back] = parseSheet(line).rows;
    assert.equal(format(back), line);
    for (const k of ['status', 'n', 'name', 'category', 'base', 'note', 'date']) assert.equal(back[k], r[k], `${r.name} ${k}`);
    assert.equal(back.mvp, true);
  }
  // `mvp` only counts as the mark when it is a whole token at the start of the note.
  for (const note of ['mvp-ish', 'mvpx · a', 'an mvp', 'MVP']) {
    const [r] = parseSheet(`- [ ] 9. \`a\` — ${note}`).rows;
    assert.equal(r.mvp, false, note);
    assert.equal(r.note, note);
  }
});

test('stamped() keeps the MVP mark and replaces an earlier approval date', () => {
  const stamp = 'approved 2026-10-17';
  const [r] = parseSheet('- [~] 9. `a` · UI & Layout — mvp · tall · approved 2026-09-01').rows;
  r.status = 'done'; r.note = stamped(r.note, stamp);
  assert.equal(format(r), '- [x] 9. `a` · UI & Layout — mvp · tall · approved 2026-10-17');
  const [bare] = parseSheet('- [~] 9. `a` — mvp').rows;
  bare.note = stamped(bare.note, stamp);
  assert.equal(format(bare), '- [~] 9. `a` — mvp · approved 2026-10-17');
  assert.equal(parseSheet(format(bare)).rows[0].date, '2026-10-17');
});

test('mvp on then off leaves the sheet byte-identical', () => {
  const s = scratch();
  try {
    const q = parseSheet(LIVE);
    const withNote = q.rows.find((r) => !r.base && !r.mvp && r.note);
    const noNote = q.rows.find((r) => !r.base && !r.mvp && !r.note);
    assert.ok(withNote && noNote, 'the sheet has icons with and without notes');
    const on = s.run('mvp', withNote.name, noNote.name, 'on');
    assert.equal(on.status, 0, on.stderr);
    assert.equal(on.stdout.trim().split('\n').length, 2);
    const after = parseSheet(s.sheet());
    for (const name of [withNote.name, noNote.name]) assert.equal(after.rows.find((r) => r.name === name).mvp, true);
    // exactly two lines changed
    const a = LIVE.split('\n'), b = s.sheet().split('\n');
    assert.equal(a.length, b.length);
    assert.equal(a.filter((l, i) => l !== b[i]).length, 2);
    assert.equal(s.run('mvp', withNote.name, noNote.name, 'off').status, 0);
    assert.equal(s.sheet(), LIVE);
  } finally { s.done(); }
});

test('mvp refuses an unknown name and a variant, and writes nothing', () => {
  const s = scratch();
  try {
    const q = parseSheet(LIVE);
    const icon = q.rows.find((r) => !r.base);
    const variant = q.rows.find((r) => r.base);
    for (const args of [[icon.name, 'no-such-icon-xyz', 'on'], [variant.name, 'on'], [icon.name, 'maybe'], ['on']]) {
      const r = s.run('mvp', ...args);
      assert.equal(r.status, 1, args.join(' '));
      assert.equal(s.sheet(), LIVE);
    }
  } finally { s.done(); }
});

test('add puts a size name under its default and its sizes', () => {
  const s = scratch();
  try {
    const q = parseSheet(LIVE);
    const names = new Set(q.rows.map((r) => r.name));
    // an icon that already has a size row, and lacks the other size
    const base = q.rows.find((r) => !r.base && names.has(`${r.name}-small`) && !names.has(`${r.name}-large`));
    assert.ok(base);
    const name = `${base.name}-large`;
    const r = s.run('add', name);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout.trim().split('\n').length, 1);
    const last = Math.max(base.i, ...q.rows.filter((x) => x.base === base.name && sizeBase(x.name) === base.name).map((x) => x.i));
    const after = parseSheet(s.sheet());
    const row = after.rows.find((x) => x.name === name);
    assert.equal(row.i, last + 1);
    assert.equal(row.base, base.name);
    assert.equal(row.n, base.n);
    assert.equal(row.category, base.category);
    assert.equal(row.status, 'todo');
    assert.equal(row.mvp, false);
    assert.match(row.note, /^added \d{4}-\d{2}-\d{2}$/);
    assert.equal(after.lines.length, q.lines.length + 1);
  } finally { s.done(); }
});

test('add puts any other name at the end of "E · Added on request"', () => {
  const s = scratch();
  try {
    const q = parseSheet(LIVE);
    const r = s.run('add', 'zz-test-one', 'zz-test-two');
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout.trim().split('\n').length, 2);
    const after = parseSheet(s.sheet());
    const top = Math.max(...q.rows.map((x) => x.n));
    const [one, two] = ['zz-test-one', 'zz-test-two'].map((n) => after.rows.find((x) => x.name === n));
    assert.equal(one.section, 'E · Added on request');
    assert.deepEqual([one.n, two.n], [top + 1, top + 2]);
    assert.equal(two.i, one.i + 1);
    assert.equal(after.rows.at(-1), two);
    assert.equal(one.base, null);
    assert.ok(s.sheet().endsWith(`${format(two)}\n`));
    // nothing above the new rows moved
    assert.equal(after.lines.slice(0, q.rows.at(-1).i + 1).join('\n'), q.lines.slice(0, q.rows.at(-1).i + 1).join('\n'));
  } finally { s.done(); }
});

test('add refuses a name on the sheet, a malformed name and a repeat, and writes nothing', () => {
  const s = scratch();
  try {
    const on = parseSheet(LIVE).rows[0].name;
    for (const args of [[on], ['Bell_Off'], ['ok-name', 'bad name'], ['zz-a', 'zz-a'], ['zz-b', on]]) {
      const r = s.run('add', ...args);
      assert.equal(r.status, 1, args.join(' '));
      assert.equal(s.sheet(), LIVE, args.join(' '));
    }
  } finally { s.done(); }
});

test('next takes the first undrawn MVP icon, else the first undrawn icon', () => {
  const live = parseSheet(LIVE);
  const open = (r) => r.status !== 'done' && !r.base;
  assert.equal(next(live)?.name, (live.rows.find((r) => open(r) && r.mvp) ?? live.rows.find(open))?.name);

  const q = parseSheet(PLAIN);
  const firstOpen = q.rows.find(open);
  assert.equal(next(q).name, firstOpen.name);
  const s = scratch(PLAIN);
  try {
    const plain = s.run('next');
    assert.equal(plain.stdout.split('\t')[0], firstOpen.name);
    // a done icon marked MVP does not count; the later undrawn MVP icon does
    const done = q.rows.find((r) => r.status === 'done' && !r.base);
    const left = q.rows.filter(open);
    const [a, b] = left.slice(-2);
    assert.notEqual(a.name, firstOpen.name);
    assert.equal(s.run('mvp', done.name, 'on').status, 0);
    assert.equal(s.run('next').stdout.split('\t')[0], firstOpen.name);
    assert.equal(s.run('mvp', b.name, a.name, 'on').status, 0);
    assert.equal(s.run('next').stdout.split('\t')[0], a.name);   // sheet order among MVP icons
    assert.match(s.run('status').stdout, new RegExp(`Next after that: #${a.n} ${a.name} · MVP`));
  } finally { s.done(); }
});

test('status counts icons, the MVP and rows the same as an independent count', () => {
  const s = scratch(PLAIN);
  try {
    const q = parseSheet(PLAIN);
    const icons = q.rows.filter((r) => !r.base && r.status !== 'done').slice(0, 3).map((r) => r.name);
    const drawnIcon = q.rows.find((r) => !r.base && r.status === 'done').name;
    assert.equal(s.run('mvp', ...icons, drawnIcon, 'on').status, 0);

    // independent: straight from the text, no parser
    const rowLines = s.sheet().split('\n').filter((l) => l.startsWith('- ['));
    const iconLines = rowLines.filter((l) => !l.includes(' · variant of `'));
    const drawn = (ls) => ls.filter((l) => l.startsWith('- [x]')).length;
    const mvpLines = iconLines.filter((l) => / — mvp( · |$)/.test(l));
    const out = s.run('status').stdout;
    assert.match(out, new RegExp(`^Icons ${drawn(iconLines)} drawn · ${iconLines.length - drawn(iconLines)} left \\(${iconLines.length}\\)$`, 'm'));
    assert.match(out, new RegExp(`^MVP ${drawn(mvpLines)} drawn · ${mvpLines.length - drawn(mvpLines)} left \\(${mvpLines.length}\\)$`, 'm'));
    assert.match(out, new RegExp(`^Rows ${drawn(rowLines)} approved of ${rowLines.length}`, 'm'));
    assert.deepEqual(counts(parseSheet(s.sheet())).mvp, { drawn: 1, left: 3, total: 4 });
  } finally { s.done(); }
});

test("build.mjs reads the sheet with queue.mjs's parser, and it agrees with build's old regex on every row", () => {
  const src = readFileSync(join(ROOT, 'tools/build.mjs'), 'utf8');
  assert.match(src, /import \{ parseSheet \} from '\.\/queue\.mjs'/);
  assert.doesNotMatch(src, /\\\[\(\[ x~\]\)\\\]/, 'build.mjs carries no row regex of its own');
  // The regex build.mjs carried until 2026-10-17: the fields it produced must not change.
  const OLD = /^- \[([ x~])\] (\d+)\. `([^`]+)`(?: · ([^·]+?))?(?: · variant of `([^`]+)`)?(?: — (.+))?\s*$/;
  const rows = parseSheet(LIVE).rows;
  const old = LIVE.split('\n').map((l, i) => [i, l.match(OLD)]).filter(([, m]) => m);
  assert.equal(old.length, rows.length);
  old.forEach(([i, m], k) => {
    const r = rows[k];
    assert.equal(r.i, i);
    // The one difference meant: the old regex read a category-less variant's base as its category.
    const swallowed = m[4]?.match(/^variant of `([^`]+)`$/)?.[1];
    assert.deepEqual([r.status, r.n, r.name, r.category, r.base, r.note],
      [{ ' ': 'todo', '~': 'review', x: 'done' }[m[1]], +m[2], m[3], swallowed ? null : m[4]?.trim() ?? null, swallowed ?? m[5] ?? null,
        m[6] == null ? null : m[6].replace(/^mvp(?: · |$)/, '') || null], r.name);   // the old regex left the mark in the note
    assert.equal(r.mvp, /^mvp(?: · |$)/.test(m[6] ?? ''));
    assert.equal(r.date, r.note?.match(/approved (\d{4}-\d{2}-\d{2})/)?.[1] ?? null);
  });
  // every approved row carries its date
  for (const r of rows.filter((x) => x.status === 'done')) assert.match(r.date ?? '', /^\d{4}-\d{2}-\d{2}$/, r.name);
});
