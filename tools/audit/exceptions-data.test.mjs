// Tests for tools/audit/exceptions-data.mjs — synthetic fixtures only.
//
// Two halves. First the pure pieces, each against an answer known by hand: the grouping rule
// (every comment in exactly one group, in the stated order), the hash the page recomputes, the
// lint patch (it must refuse a source it does not match exactly), the reading of a gap warning,
// the centre a headline prints. Then one end-to-end build over a tiny pin made in a temporary
// directory: six hand-drawn files and the repo's own lint.mjs, geometry.mjs and masters.mjs, so
// the patch is proven against the real lint source and each escape group finds the one drawing
// built to land in it.

import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseComment, extractFile } from './notes.mjs';
import { CROSS, DEGREE, DEGREE_SINGULAR, EYE, GROUPS, KEY_GROUP, PROPOSALS, SLACK, SPELLING, TOUCH, build, by3, centreOf, classifyWarning, countRow, exactComments, extra, fnv, groupOfComment, inBand, isAnchored, isSortFamily, patchLint, skipsKnockout } from './exceptions-data.mjs';

const TOOLS = fileURLToPath(new URL('../', import.meta.url));
const ROOT = (canvas, weight) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">`;
const svg = (canvas, weight, lines) => `${ROOT(canvas, weight)}\n${lines.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;

// --- the ledger's groups ------------------------------------------------------------------------

test('twenty groups in the ledger\'s order, each with its section, verdict and a known proposal', () => {
  assert.equal(GROUPS.length, 20);
  assert.deepEqual(GROUPS.map((g) => g.n), Array.from({ length: 20 }, (_, i) => i + 1));
  assert.equal(new Set(GROUPS.map((g) => g.id)).size, 20);
  assert.deepEqual(GROUPS.map((g) => g.row), Array.from({ length: 20 }, (_, i) => 85 + i), 'one §1 table row each, lines 85–104');
  for (const g of GROUPS) {
    assert.ok(g.section && g.verdict && g.kind && g.lintDoes, g.id);
    for (const p of g.proposals) assert.ok(PROPOSALS[p], `${g.id} names ${p}`);
    assert.ok(g.proposals.length || g.other, `${g.id} says what answers it`);
  }
  for (const key of Object.values(KEY_GROUP)) assert.ok(GROUPS.some((g) => g.id === key), key);
  for (const [id, qs] of Object.entries(EYE)) {
    assert.ok(GROUPS.some((g) => g.id === id), `eye question on ${id}`);
    for (const e of qs) assert.ok(e.line >= 768 && e.line <= 785 && e.q && e.where && Array.isArray(e.show), `${id}:${e.line} sits in the ledger's §6`);
  }
});

// --- the grouping rule ----------------------------------------------------------------------------

test('each comment lands in exactly one group, by the stated rule', () => {
  const ctx = { style: 'outline', concept: 'a' };
  const g = (raw, c = ctx, seen) => groupOfComment(parseComment(raw, c), seen);
  assert.equal(g('A free sentence about the drawing'), 'text');
  assert.equal(g('keyline: mark'), 'keyline');
  assert.equal(g('box: 20x18'), 'box');
  assert.equal(g('optical: 0.5 0'), 'optical');
  assert.equal(g('glyph: numeral'), 'glyph');
  assert.equal(g('glyph: letter'), 'glyph', 'a kind lint knows since 2026-10-20 (C32)');
  assert.equal(g('grows: 0 0 0.5 0.5', { style: 'filled', concept: 'a' }), 'grows');
  assert.equal(g('anchor: volume'), 'anchor');
  assert.equal(g('gap: 1'), 'gap');
  assert.equal(g('tags: long, sweep'), 'tags');
  // rule 1 before rule 3: a ">" wins even where the value would be bad anyway
  assert.equal(g('box: 20x18 >'), 'gt');
  assert.equal(g('tags: a > b'), 'gt');
  // rule 2: the second note of a key
  assert.equal(g('box: 20x18', ctx, new Set(['box'])), 'ungrouped');
  assert.equal(g('box: 20x18 >', ctx, new Set(['box'])), 'gt', 'rule 1 comes before rule 2');
  // rule 3: what lint rejects or ignores
  assert.equal(g('box: 20 by 18'), 'ungrouped');
  assert.equal(g('keyline: marks'), 'ungrouped');
  assert.equal(g('grows: 0 0 0.5 0.5'), 'ungrouped', 'grows in an outline file');
  assert.equal(g('gap: 1.5'), 'ungrouped', 'at the floor');
  assert.equal(g('anchor: a'), 'ungrouped', 'names its own file');
  assert.equal(g('glyph: letters'), 'ungrouped');
  // a misspelt key is free text, as lint reads it
  assert.equal(g('opticl: 0 0.5'), 'text');
});

test('the exact comment text lines up with notes.mjs\'s comment index', () => {
  const src = svg(24, 1.5, ['<!--  keyline: mark  -->', '<!-- Two\nlines -->', '<path d="M4 12H20"/>']);
  const rec = extractFile(src, 24, 'a.svg');
  const exact = exactComments(src);
  assert.equal(exact.length, rec.comments.length);
  assert.equal(exact[0], '<!--  keyline: mark  -->', 'spacing kept as written');
  assert.equal(rec.comments[0].key, 'keyline');
  assert.equal(exact[1], '<!-- Two\nlines -->');
});

// --- the hash the page recomputes ----------------------------------------------------------------------

test('fnv is FNV-1a 32-bit (published test vectors)', () => {
  assert.equal(fnv(''), '811c9dc5');
  assert.equal(fnv('a'), 'e40c292c');
  assert.equal(fnv('foobar'), 'bf9cf968');
});

// --- the lint patch ----------------------------------------------------------------------------------

const FAKE = [
  CROSS, 'const min = 2;', TOUCH,
  'if (min < need - 0.01) w();', 'if (self.gap < floor - 0.01) w();', 'if (left && left.gap < floor - 0.01) w();',
  'if (g < floor - 0.01) w();', 'if (g < GAP - 0.01) w();',
  'if (smallest >= MIN_GAP - 0.01) e();', 'x = numeralMin < MIN_GAP - 0.01\n ? a : b;',
].join('\n');

test('patchLint drops exactly the five gap slacks and reports both pair skips', () => {
  const out = patchLint(FAKE);
  assert.equal([...out.matchAll(SLACK)].length, 0);
  assert.match(out, /if \(min < need\) w\(\);/);
  assert.match(out, /if \(g < GAP\) w\(\);/);
  assert.match(out, /smallest >= MIN_GAP - 0\.01/, '5d\'s stale-note test keeps its tolerance');
  assert.match(out, /numeralMin < MIN_GAP - 0\.01/, '5e\'s info line is not a gap check');
  assert.match(out, /__mdxPair\?\.\(i, j, "cross", null\); continue;/);
  assert.match(out, /__mdxPair\?\.\(i, j, "touch", min\); continue;/);
});

test('patchLint refuses a source it does not match exactly', () => {
  assert.throws(() => patchLint(FAKE.replace('if (g < GAP - 0.01) w();', '')), /expected 5 gap comparisons/);
  assert.throws(() => patchLint(FAKE.replace(CROSS, '')), /CROSS skip once, found 0/);
  assert.throws(() => patchLint(`${FAKE}\n${TOUCH}`), /TOUCH skip once, found 2/);
});

test('patchLint matches the repo\'s lint.mjs as it stands', () => {
  const src = readFileSync(join(TOOLS, 'lint.mjs'), 'utf8');
  assert.doesNotThrow(() => patchLint(src));
});

test('extra is a multiset difference', () => {
  assert.deepEqual(extra(['a', 'b'], ['a', 'a', 'b', 'c']), ['a', 'c']);
  assert.deepEqual(extra(['a'], ['a']), []);
});

// --- reading lint's lines --------------------------------------------------------------------------------

test('classifyWarning reads every gap warning lint prints', () => {
  const pair = classifyWarning('paths 2/3 are 2.99 apart — §6 needs 3 (edge gap 1.49 < 1.5)');
  assert.deepEqual([pair.check, pair.reading, pair.floor, pair.paths, pair.floorKind], ['§5', 1.49, 1.5, [2, 3], '§6']);
  const over = classifyWarning('paths 4/5 are 0.46 apart — §6 needs 3 (edge gap -1.04 < 1.5)');
  assert.equal(over.reading, -1.04);
  const open = classifyWarning('path 1 comes within 1.49 of itself at 9.74,5.1 — §6 needs 1.5 (it turns 360°)');
  assert.deepEqual([open.check, open.kind, open.reading, open.at], ['§5b', 'opening', 1.49, [9.74, 5.1]]);
  const glyph = classifyWarning('path 2 comes within 0.99 of itself at 1,2 — C19 glyph gap needs 1 (it turns 200°)');
  assert.equal(glyph.floorKind, 'glyph');
  const ko = classifyWarning('the knockout leaves 1.2 of material between two parts of itself at 3,4 — §6 needs 1.5: a knockout may not be cut wider than the counter it sits in');
  assert.deepEqual([ko.check, ko.reading], ['§5c', 1.2]);
  const self = classifyWarning('path 1 faces itself across 1.22 of air at 8,9 — agreed gap 1 needs 1');
  assert.deepEqual([self.check, self.kind, self.floorKind], ['§5f', 'self', 'agreed']);
  for (const [phrase, kind] of [['across one cut-out', 'cut'], ['in a notch of the outer edge', 'notch'], ['between two filled edges', 'separation'], ['between a shape and a line', 'line']])
    assert.equal(classifyWarning(`1.49 of air ${phrase} at 1,2 — §6 needs 1.5`).kind, kind);
  // the gap checks lint gained on 2026-10-20: §5's crossing arms, §5f's ring hole, §5h, §5i
  const arms = classifyWarning('paths 1/2 cross at 21° with 0 of air at the arm tips at 6,12.75 — §6 needs 1.5');
  assert.deepEqual([arms.check, arms.kind, arms.reading, arms.floor, arms.paths, arms.at], ['§5', 'arms', 0, 1.5, [1, 2], [6, 12.75]]);
  assert.deepEqual(classifyWarning('path 3 crosses itself at 40° with 0.9 of air at the arm tips at 1,2 — C19 numeral gap needs 1').paths, [3]);
  const ring = classifyWarning('path 1 is a ring with a hole 0.9 across at 12,12 — §6 needs 1.5 (radius 1.2 at stroke 1.5)');
  assert.deepEqual([ring.check, ring.kind, ring.reading, ring.floor, ring.paths], ['§5f', 'ring', 0.9, 1.5, [1]]);
  const notch = classifyWarning('a filled shape\'s arms meet at 30° with 1.2 of air at the arm tips at 3,4 — agreed gap 1 needs 1');
  assert.deepEqual([notch.check, notch.kind, notch.reading, notch.floorKind], ['§5h', 'arms', 1.2, 'agreed']);
  const inside = classifyWarning('path 2 (subpath 1) leaves 0.82 of air inside itself at 12,11.16 (the widest circle that fits) — §6 needs 1.5');
  assert.deepEqual([inside.check, inside.kind, inside.reading, inside.paths], ['§5i', 'inside', 0.82, [2]]);
  const hole = classifyWarning('a cut-out leaves 1.39 of air inside it at 12,10.69 (the widest circle that fits) — §6 needs 1.5');
  assert.deepEqual([hole.check, hole.kind, hole.reading, hole.at], ['§5i', 'hole', 1.39, [12, 10.69]]);
  assert.equal(classifyWarning('off-centre at 7.5,8'), null);
});

test('centreOf reads the headline\'s centre against the canvas middle', () => {
  assert.deepEqual(centreOf('12×12  fits square keyline  centre 7.5,8', 8), { cx: 7.5, cy: 8, dx: -0.5, dy: 0, off: 0.5 });
  assert.equal(centreOf('15×15  declared mark  centre 12,12', 12).off, 0);
  assert.equal(centreOf('no centre here', 12), null);
  assert.ok(Number.isNaN(centreOf('5×5  declared mark  centre NaN,NaN', 12).off));
});

// --- the small rules each group stands on ----------------------------------------------------------------

test('inBand: a reading printed under its floor is in the band; 1.5 against 1.5 is not', () => {
  assert.equal(inBand({ reading: 1.49, floor: 1.5 }), true);
  assert.equal(inBand({ reading: 1.5, floor: 1.5 }), false, 'the 59 that print 1.5 are rounding, not air');
  assert.equal(inBand({ reading: 0.99, floor: 1 }), true);
  assert.equal(inBand(null), false);
});

test('isSortFamily: the twelve sort-alpha-* / sort-numeric-* names, not sort or sort-2', () => {
  for (const c of ['sort-alpha-ascending', 'sort-numeric-descending-2']) assert.equal(isSortFamily(c), true, c);
  for (const c of ['sort', 'sort-2', 'sort-ascending', 'alpha-sort', 'sort-alphabet']) assert.equal(isSortFamily(c), false, c);
});

test('skipsKnockout: filled, with a shape and a stroke — nothing less', () => {
  assert.equal(skipsKnockout({ s: 'f', ar: 1, sk: 1 }), true);
  assert.equal(skipsKnockout({ s: 'f', ar: 1, sk: 0 }), false, 'shapes only: §5c runs');
  assert.equal(skipsKnockout({ s: 'f', ar: 0, sk: 2 }), false, 'a line-heavy filled file has no knockout');
  assert.equal(skipsKnockout({ s: 'o', ar: 1, sk: 1 }), false);
});

test('isAnchored reads the headline lint prints for an anchored member', () => {
  assert.equal(isAnchored('15×16  anchored to volume  centre 9.5,12'), true);
  assert.equal(isAnchored('12×12  fits square keyline  centre 7.5,8'), false);
  assert.equal(isAnchored(undefined), false);
});

test('countRow compares the figures as printed, thousands separators and all', () => {
  const r = countRow('drawings', 1967, 'ledger:130', 1967);
  assert.deepEqual([r.ledger, r.data, r.match], ['1,967', '1,967', true]);
  assert.equal(countRow('q', '1,967', 'c', 1967).match, true, 'a ledger figure typed with its comma');
  assert.equal(countRow('q', 1967, 'c', 1966).match, false);
  assert.equal(countRow('q', '1,404 · 1,404', 'c', '1,404 · 1,404').match, true);
  assert.equal(countRow('q', '—', 'c', 5).match, null, 'a reference row is not compared');
  assert.equal(countRow('q', '[needs measuring]', 'c', null).match, null);
  assert.equal(countRow('q', 34, 'c', null).data, null);
});

test('by3 splits by master in 24 · 20 · 16 order and prints thousands', () => {
  const list = [...Array(1404)].map(() => ({ m: 20 })).concat([{ m: 24 }, { m: 16 }, { m: 16 }]);
  assert.equal(by3(list), '1 · 1,404 · 2');
});

test('DEGREE is the angles probe\'s pattern: three spellings, plural only; SPELLING reads them line by line', () => {
  for (const t of ['63.43°', 'a 4 degrees taper', 'slash 73.2 deg', '36.9°']) assert.ok(DEGREE.test(t), t);
  for (const t of ['45 degree sides', 'degrees of freedom', '4 dg', 'C30']) assert.ok(!DEGREE.test(t), t);
  assert.ok(DEGREE_SINGULAR.test('45 degree sides'));
  assert.ok(SPELLING.sign.test('63.43°') && !SPELLING.sign.test('4 degrees'));
  assert.ok(SPELLING.degrees.test('4 degrees') && !SPELLING.degrees.test('4degrees'));
  assert.ok(SPELLING.deg.test('73.2 deg') && !SPELLING.deg.test('73.2 degrees'));
});

// --- end to end, on a tiny pin ---------------------------------------------------------------------------

test('build: every escape group finds the drawing built to land in it', async () => {
  const pin = mkdtempSync(join(tmpdir(), 'mdx-exc-test-'));
  try {
    mkdirSync(join(pin, 'tools'));
    for (const f of ['lint.mjs', 'geometry.mjs', 'masters.mjs']) copyFileSync(join(TOOLS, f), join(pin, 'tools', f));
    for (const m of [24, 20, 16]) mkdirSync(join(pin, 'src/icons', String(m)), { recursive: true });
    mkdirSync(join(pin, 'lab'));
    writeFileSync(join(pin, 'lab/manifest.json'), JSON.stringify({ masters: {} }));
    const put = (m, name, s) => writeFileSync(join(pin, 'src/icons', String(m), `${name}.svg`), s);
    // 16/a: two lines 1.493 apart — passes lint only through its 0.01 (prints 1.49)
    put(16, 'a', svg(16, 1.25, ['<!-- two rails, 1.493 of air: off the eighth grid on purpose -->', '<path d="M3 6H13"/>', '<path d="M3 8.743H13"/>']));
    // 24/b: a stem standing on a bar (touch) and a post through it (cross)
    put(24, 'b', svg(24, 1.5, ['<!-- a bar, a stem, a post -->', '<path d="M4 12H20"/>', '<path d="M8 12V20"/>', '<path d="M15 9L18 16"/>']));
    // 24/c: one short line far off centre
    put(24, 'c', svg(24, 1.5, ['<!-- off centre -->', '<path d="M4 8H14"/>']));
    // 24/d: a note lint cannot see, a note, and a second note of the same key
    // — and a box note after the unreadable one, which lint's pattern runs on to and reads
    put(24, 'd', svg(24, 1.5, ['<!-- box: 20x18 > -->', '<!-- tags: one -->', '<!-- tags: two -->', '<!-- box: 17.5x1.5 -->', '<path d="M4 12H20"/>']));
    // 24/e and its filled twin with the same body
    put(24, 'e', svg(24, 1.5, ['<!-- a line -->', '<path d="M4 12H20"/>']));
    put(24, 'e-filled', svg(24, 2.5, ['<!-- the same line, heavier -->', '<path d="M4 12H20"/>']));
    // 24/f-filled: a shape and a stroke — §5c never runs on it; 24/g-filled: a shape alone, which it does read
    put(24, 'f-filled', svg(24, 1.5, ['<!-- a block and a line -->', '<path fill="currentColor" fill-rule="evenodd" stroke="none" d="M4 4H12V12H4Z"/>', '<path d="M14 18H20"/>']));
    put(24, 'g-filled', svg(24, 1.5, ['<!-- a block alone -->', '<path fill="currentColor" fill-rule="evenodd" stroke="none" d="M4 4H12V12H4Z"/>']));
    // 24/h and its anchored member h-low, which keeps h's left edge and so sits off centre
    put(24, 'h', svg(24, 1.5, ['<!-- the full member -->', '<path d="M4 12H20"/>']));
    put(24, 'h-low', svg(24, 1.5, ['<!-- anchor: h -->', '<!-- one level down -->', '<path d="M4 12H10"/>']));
    // warned drawings: one the sort family claims, one it must not, one trash claims, one it must not
    put(24, 'sort-alpha-up', svg(24, 1.5, ['<!-- off centre -->', '<path d="M4 8H14"/>']));
    put(24, 'sort-2', svg(24, 1.5, ['<!-- off centre -->', '<path d="M4 8H14"/>']));
    put(20, 'trash', svg(20, 1.5, ['<!-- off centre -->', '<path d="M4 8H12"/>']));
    put(24, 'trash', svg(24, 1.5, ['<!-- off centre -->', '<path d="M4 8H14"/>']));
    // 24/ring: two rings 3 apart on centre — the sampled outer ring's chords sit a hair inside it, so
    // the pair reads under 1.5 by less than lint prints: a reading the slack passes that is not in the band
    put(24, 'ring', svg(24, 1.5, ['<!-- two rings -->', '<path d="M5 12A7 7 0 1 0 19 12A7 7 0 1 0 5 12Z"/>', '<path d="M8 12A4 4 0 1 0 16 12A4 4 0 1 0 8 12Z"/>']));

    const d = await build(pin, { commit: 'test' });
    const at = (m, n) => d.files.findIndex((f) => f.m === m && f.n === n);
    const G = Object.fromEntries(d.groups.map((g) => [g.id, g]));

    // every comment is in exactly one group
    const total = d.files.reduce((s, f) => s + f.k.length, 0);
    const placed = [...['text', 'keyline', 'box', 'optical', 'glyph', 'grows', 'anchor', 'gap', 'tags', 'gt'].flatMap((id) => G[id].refs), ...d.ungrouped];
    assert.equal(placed.length, total);
    assert.equal(new Set(placed.map(([f, c]) => `${f}:${c}`)).size, total);
    for (const f of d.files) for (const c of f.k) assert.ok(c.g, `${f.n} comment has a group`);

    const di = at(24, 'd');
    assert.deepEqual(G.gt.refs, [[di, 0]]);
    assert.deepEqual(G.tags.refs, [[di, 1]]);
    assert.deepEqual(d.ungrouped, [[di, 2]]);
    assert.deepEqual(G.box.refs, [[di, 3]], 'the box lint actually reads');
    assert.match(d.files[di].L.h, /agreed box/, 'and lint did read it');
    assert.equal(d.files[di].k[0].x, '<!-- box: 20x18 > -->');

    const slack = G.slack.refs.find((r) => r.f === at(16, 'a'));
    assert.ok(slack, 'the 1.493 gap is a slack reading');
    assert.deepEqual([slack.check, slack.reading, slack.floor, slack.band], ['§5', 1.49, 1.5, true]);
    assert.ok(!d.files[at(16, 'a')].L.w.some((w) => /apart/.test(w)), 'the pinned run does not warn on it');

    const contact = G.contact.refs.find((r) => r.f === at(24, 'b'));
    assert.deepEqual(contact.p.map((p) => p.slice(0, 3)), [[1, 2, 't'], [1, 3, 'x']]);

    const centre = G.centre.refs.find((r) => r.f === at(24, 'c'));
    assert.deepEqual([centre.cx, centre.cy, centre.off], [9, 8, 4]);

    assert.deepEqual(G.identical.refs, [{ f: at(24, 'e-filled'), o: at(24, 'e') }]);
    assert.deepEqual(G.knockout.refs, [{ f: at(24, 'f-filled') }], 'g-filled (shapes only) and e-filled (lines only) are not escapes');

    // the anchored member is off centre, and group 16 leaves it out
    const low = d.files[at(24, 'h-low')];
    assert.match(low.L.h, /anchored to h/);
    assert.ok(Math.abs(centreOf(low.L.h, 12).off) > 0.5, 'h-low really is off centre');
    assert.ok(!G.centre.refs.some((r) => r.f === at(24, 'h-low')));
    assert.ok(G.centre.refs.some((r) => r.f === at(24, 'sort-2')), 'the same offset un-anchored is listed');

    // warned drawings: claimed by exactly the group named for them, the rest visible
    assert.deepEqual(G.sort.refs.map((r) => d.files[r.f].n), ['sort-alpha-up']);
    assert.deepEqual(G.trash.refs.map((r) => `${d.files[r.f].m}/${d.files[r.f].n}`), ['20/trash']);
    const other = d.ungroupedWarned.map((i) => `${d.files[i].m}/${d.files[i].n}`);
    assert.ok(other.includes('24/sort-2') && other.includes('24/trash'), other.join(' '));
    assert.ok(!other.includes('24/sort-alpha-up') && !other.includes('20/trash'));

    // the slack: one reading in the band (16/a), one that prints 1.5 against 1.5 (24/ring)
    const ring = G.slack.refs.filter((r) => r.f === at(24, 'ring'));
    assert.ok(ring.length, 'the rings pass only through the slack');
    assert.ok(ring.every((r) => r.reading === 1.5 && r.floor === 1.5 && r.band === false), JSON.stringify(ring));
    assert.ok(!d.files[at(24, 'ring')].L.w.some((w) => /apart/.test(w)));

    // the record says where it came from
    assert.equal(d.schema, 'mdx-exceptions/1');
    assert.equal(d.pin.commit, 'test');
    assert.equal(d.pin.drawings, 15);
    assert.match(d.recipe, /git archive test/);
    for (const g of d.groups) for (const c of g.counts) assert.ok('label' in c && 'ledger' in c && 'cite' in c && 'data' in c && 'match' in c, `${g.id}: ${c.label}`);
    assert.ok(d.groups.find((g) => g.id === 'text').counts.some((c) => c.match === false), 'a tiny pin disagrees with the ledger, and says so');
  } finally {
    rmSync(pin, { recursive: true, force: true });
  }
});
