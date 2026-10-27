// Tests for the release's pure parts (plans/shipping.md card 2.1): versions, templates, the names lock, the
// changelog, the shipped-file gate and the metrics trim. `node --test tools/release.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { outline } from './outline.mjs';
import {
  parseVersion, compareVersions, frozen, placeholders, fillTemplate, marutiMarks, parseLock, formatLock, lockProblems,
  extendLock, changelog, paint, shippedProblems, shippedFiles, trimMetrics, unbuiltTarballs,
} from './release.mjs';

test('versions: semver precedence, frozen from 1.0.0', () => {
  assert.equal(frozen('0.0.1'), false);
  assert.equal(frozen('0.9.9'), false);
  assert.equal(frozen('1.0.0-rc.1'), false, 'a 1.0.0 prerelease is below 1.0.0');
  assert.equal(frozen('1.0.0'), true);
  assert.equal(frozen('2.3.4'), true);
  assert.equal(compareVersions('1.2.3', '1.2.3-rc.1'), 1);
  assert.equal(compareVersions('1.0.0-rc.2', '1.0.0-rc.10'), -1, 'numeric identifiers compare as numbers');
  assert.equal(compareVersions('1.10.0', '1.9.0'), 1);
  assert.equal(compareVersions('1.0.0', '1.0.0'), 0);
  assert.throws(() => parseVersion('1.0'), /semver/);
  assert.throws(() => parseVersion('01.0.0'), /semver/);
});

test('templates: exactly the known keys are filled, anything else is left to be found', () => {
  const t = '# Mavan Drawer {{version}}\n{{icons}} icons, {{names}} names. {{ version }} {{x}}';
  const out = fillTemplate(t, { version: '0.0.1', icons: '448', names: '1,310' });
  assert.equal(out, '# Mavan Drawer 0.0.1\n448 icons, 1,310 names. {{ version }} {{x}}');
  assert.deepEqual(placeholders(out), [' version ', 'x']);
  assert.deepEqual(placeholders(fillTemplate('{{version}}', { version: '1.0.0' })), []);
  assert.equal(fillTemplate('{{constructor}}', {}), '{{constructor}}', 'no inherited key is filled');
  assert.equal(marutiMarks('a [Maruti: seats] b [Maruti] c [maruti]'), 2);
});

const LOCK = { sections: [], names: new Map(), problems: [] };

test('the README names only tarballs the box holds: a skipped one is found, with its lines', () => {
  const readme = fillTemplate(readFileSync(new URL('../packages/templates/README.md', import.meta.url), 'utf8'), { version: '0.0.1', icons: '448', names: '1,310' });
  const both = ['mavan-icons-0.0.1.tgz', 'mavan-icons-react-0.0.1.tgz'];
  assert.deepEqual(unbuiltTarballs(readme, both), [], 'both built: nothing to refuse');
  const skipped = unbuiltTarballs(readme, ['mavan-icons-0.0.1.tgz']);
  assert.deepEqual(skipped.map((u) => u.tarball), ['mavan-icons-react-0.0.1.tgz'], 'no React tool: its tarball is named and missing');
  assert.ok(skipped[0].lines.length >= 2, `the layout and the install line (lines ${skipped[0].lines})`);
  for (const n of skipped[0].lines) assert.match(readme.split('\n')[n - 1], /mavan-icons-react-0\.0\.1\.tgz/);
  const text = 'download/\n  mavan-icons-0.0.1.tgz\n  mavan-icons-react-0.0.1.tgz\nnpm install ./mavan-icons-react-0.0.1.tgz ./mavan-icons-react-0.0.1.tgz\nthe `.tgz` files, ./old-0.0.0.tgz';
  assert.deepEqual(unbuiltTarballs(text, ['mavan-icons-0.0.1.tgz']), [
    { tarball: 'mavan-icons-react-0.0.1.tgz', lines: [3, 4] },
    { tarball: 'old-0.0.0.tgz', lines: [5] },
  ], 'each missing name once, its lines once each; a bare `.tgz` names nothing; a path names its file');
  assert.deepEqual(unbuiltTarballs(text, []).map((u) => u.tarball), ['mavan-icons-0.0.1.tgz', 'mavan-icons-react-0.0.1.tgz', 'old-0.0.0.tgz'], 'nothing built: every name refused');
  assert.deepEqual(unbuiltTarballs('# Licence\nNo tarball here.', []), []);
});

test('the lock: written from the sheet, extended under a new version, never losing a name', () => {
  const a = extendLock(LOCK, ['check', 'check-2', 'x'], '1.0.0', '2026-11-01');
  assert.deepEqual(a.added, ['check', 'check-2', 'x']);
  const text = formatLock(a.sections), back = parseLock(text);
  assert.deepEqual(back.problems, []);
  assert.deepEqual(back.sections, [{ version: '1.0.0', date: '2026-11-01', names: ['check', 'check-2', 'x'] }]);
  assert.equal(back.names.get('check-2'), '1.0.0');
  // a later version adds only the new names, in sheet order, under its own section
  const b = extendLock(back, ['check', 'plus', 'check-2', 'x', 'minus'], '1.1.0', '2026-12-01');
  assert.deepEqual(b.added, ['plus', 'minus']);
  assert.deepEqual(b.sections.map((s) => [s.version, s.names]), [['1.0.0', ['check', 'check-2', 'x']], ['1.1.0', ['plus', 'minus']]]);
  // the same version again appends to its section and keeps its date
  const c = extendLock(parseLock(formatLock(b.sections)), ['check', 'plus', 'check-2', 'x', 'minus', 'star'], '1.1.0', '2026-12-09');
  assert.deepEqual(c.sections.at(-1), { version: '1.1.0', date: '2026-12-01', names: ['plus', 'minus', 'star'] });
  // nothing new: nothing added
  assert.deepEqual(extendLock(back, ['check', 'check-2', 'x'], '1.0.1', '2026-11-02').added, []);
  // a locked name gone from the sheet, or a version going backwards, is refused
  assert.throws(() => extendLock(back, ['check', 'x'], '1.1.0', '2026-12-01'), /gone from the sheet.*check-2/);
  assert.throws(() => extendLock(parseLock(formatLock(b.sections)), ['check', 'plus', 'check-2', 'x', 'minus', 'new'], '1.0.5', '2026-12-01'), /below/);
  assert.deepEqual(lockProblems(back, ['check', 'x', 'plus']), { gone: ['check-2'], unlocked: ['plus'] });
});

test('the lock: what it cannot read is a problem, never silently skipped', () => {
  const p = parseLock('check\n## 1.0.0 — 2026-11-01\ncheck\ncheck\nNot A Name\n## 0.9.0 — 2026-11-02\n## one — 2026-11-03\n').problems;
  assert.equal(p.length, 5, p.join('\n'));
  assert.match(p[0], /before any/);
  assert.match(p[1], /locked twice/);
  assert.match(p[2], /not a name/);
  assert.match(p[3], /"one" is not a version/);
  assert.match(p[4], /must rise/);
  assert.deepEqual(parseLock('# a comment\n\n## 1.0.0 — 2026-11-01\n  check  \n').sections[0].names, ['check']);
});

const META = {
  counts: { icons: 5, concepts: 2 },
  icons: [
    { name: 'check', category: 'UI & Layout', family: 'check', variantOf: null, approved: '2026-09-17' },
    { name: 'check-2', category: 'UI & Layout', family: 'check', variantOf: 'check', approved: '2026-10-02' },
    { name: 'arrow', category: 'Arrows & Direction', family: 'arrow', variantOf: null, approved: '2026-10-26' },
    { name: 'arrow-2', category: 'Arrows & Direction', family: 'arrow', variantOf: 'arrow', approved: '2026-11-20' },
    { name: 'link-off', category: 'Editing & Text', family: 'arrow', variantOf: 'arrow', approved: '2026-10-05' },
  ],
};

test('the changelog: the first build lists every name, by category, dated by the newest approval', () => {
  const md = changelog(META, null, '0.0.1');
  assert.equal(md, changelog(structuredClone(META), null, '0.0.1'), 'deterministic');
  assert.match(md, /^## 0\.0\.1 — 2026-11-20$/m);
  assert.match(md, /no earlier release/);
  assert.match(md, /2 icons and 5 names \(30 SVG files\)/);
  assert.match(md, /Approved between 2026-09-17 and 2026-11-20/);
  const heads = [...md.matchAll(/^### (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(heads, ['Arrows & Direction — 1 icon, 2 names', 'Editing & Text — 0 icons, 1 name', 'UI & Layout — 1 icon, 2 names']);
  assert.match(md, /^- `check` · `check-2`$/m, 'a family on one line, in sheet order');
});

test('the changelog after 1.0: each release lists the names it added; the newest also what was redrawn', () => {
  const lock = parseLock(formatLock([
    { version: '1.0.0', date: '2026-11-01', names: ['check', 'check-2', 'arrow', 'link-off'] },
    { version: '1.1.0', date: '2026-12-01', names: ['arrow-2'] },
  ]));
  const md = changelog(META, lock, '1.1.0');
  const sections = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(sections, ['1.1.0 — 2026-12-01', '1.0.0 — 2026-11-01'], 'newest first');
  const top = md.split('\n## ')[1];
  assert.match(top, /New: 0 icons and 1 name \(6 SVG files\)/);
  assert.match(top, /`arrow-2`/);
  assert.doesNotMatch(top, /`check`/, 'a name locked before is not new');
  assert.match(top, /Nothing redrawn since 1\.0\.0/);
  // a release that added no names has its own section on top, and lists what was approved again since the last
  const later = { ...META, icons: META.icons.map((i) => (i.name === 'check' ? { ...i, approved: '2026-12-05' } : i)) };
  const md2 = changelog(later, lock, '1.1.1');
  assert.match(md2, /^## 1\.1\.1 — 2026-12-05$/m);
  assert.match(md2.split('\n## ')[1], /No new names\.\n- Redrawn since 1\.1\.0 \(approved after 2026-12-01\): `check`\./);
});

test('the shipped-file gate: an outlined file passes, anything stroked or extra is named', async () => {
  const src = readFileSync(new URL('../src/icons/24/plus-circle.svg', import.meta.url), 'utf8');
  const out = await outline(src, { master: 24 });
  assert.deepEqual(shippedProblems(out, 24), []);
  assert.deepEqual(paint(out), { elements: ['path', 'svg'], strokeAttrs: 0, paths: 1, stroked: 0, filled: 1, styled: 0 });
  const s = paint(src);
  assert.ok(s.paths > 0 && s.stroked === s.paths, `the source: every path stroked by its root (${s.stroked} of ${s.paths})`);
  const planted = {
    stroke: out.replace('<path ', '<path stroke="currentColor" '),
    width: out.replace('fill="currentColor">', 'fill="currentColor" stroke-width="2">'),
    comment: out.replace('<path ', '<!-- tags: x --><path '),
    group: out.replace('<path ', '<g><path ').replace('</svg>', '</g></svg>'),
    style: out.replace('<path ', '<path style="fill:red" '),
    relative: out.replace(/ d="M/, ' d="m'),
    deep: out.replace(/ d="M[\d.]+/, ' d="M2.0001'),
  };
  for (const [k, svg] of Object.entries(planted)) assert.ok(shippedProblems(svg, 24).length, `${k}: not caught`);
  assert.match(shippedProblems(out, 20).join(), /root is not exactly/);
  // a stroke inherited from an element around the path is a stroked path, by SVG's own rule
  assert.equal(paint('<svg stroke="red"><g><path d="M0 0"/></g></svg>').stroked, 1);
  assert.equal(paint('<svg stroke="red"><path stroke="none" d="M0 0"/></svg>').stroked, 0);
});

test('the shipped names and the metrics trimmed to the contract', () => {
  assert.deepEqual(shippedFiles(['x', 'check-2', 'check']), ['check', 'check-filled', 'check-2', 'check-2-filled', 'x', 'x-filled']);
  const e = (x) => ({ ink: { x, y: 1, w: 2, h: 3 }, shift: [0, 0], bearing: { left: x, top: 1, right: 2, bottom: 3 }, container: 20, ratio: 0.5, gap: null,
    optical: Object.fromEntries(['left', 'top', 'right', 'bottom'].map((k) => [k, { geometric: 1, recession: 0.5, optical: 1.5 }])) });
  const dist = Object.fromEntries([24, 20, 16].map((m) => [m, { a: e(m), 'a-filled': e(m + 1), extra: e(0) }]));
  const m = trimMetrics(dist, ['a', 'a-filled'], '0.0.1');
  assert.equal(m.version, '0.0.1');
  assert.match(m.units, /S ÷ that master/);
  assert.deepEqual(Object.keys(m.icons[24]), ['a', 'a-filled'], 'only the shipped names');
  assert.deepEqual(m.icons[16].a, { ink: { x: 16, y: 1, w: 2, h: 3 }, bearing: { left: 16, top: 1, right: 2, bottom: 3 }, optical: { left: 1.5, top: 1.5, right: 1.5, bottom: 1.5 } });
  assert.throws(() => trimMetrics(dist, ['a', 'b'], '0.0.1'), /no 24\/b/);
});
