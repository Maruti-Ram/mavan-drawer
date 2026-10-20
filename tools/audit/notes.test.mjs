// Tests for tools/audit/notes.mjs.
//
// Two halves. First, synthetic comments and files whose right answer is known exactly: one
// of each note kind, well-formed and malformed, so "lint reads this" is checked against the
// lint lines the extractor cites; an off-grid census on a path whose off-grid values can be
// counted by hand; the two text proxies. Then the shipped files, where the extractor must
// reproduce numbers the audit documents already state — `trash` at 24 carries five distinct
// off-quarter values (`docs/audit/enforcement-gap.md:66-67`), every file carries a comment
// (`:60-61`) — and, for every one of the shipped files, agree field by field with `lintSource`,
// lint's own exported check, imported from `tools/lint.mjs`. That last test is what makes
// "mirrors lint line for line" a tested claim rather than a stated one: if lint's reading of a
// note or of the grid ever moves, this fails. (Importing `tools/lint.mjs` runs nothing: its one
// top-level statement, `lint.mjs:620`, fires `run()` only when lint itself is the entry point.)

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NOTE_KEYS, SLOTS, consistency, extractFile, extractSet, inventory, parseComment } from './notes.mjs';
import { lintSource } from '../lint.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const icons = `${repo}src/icons`;
const haveSet = existsSync(`${icons}/24`);

const ROOT = (canvas, weight) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">`;
const svg = (canvas, weight, lines) => `${ROOT(canvas, weight)}\n${lines.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;

// --- comments -------------------------------------------------------------------------------

test('every key lint or the build reads is a note; anything else is free text', () => {
  assert.deepEqual(NOTE_KEYS, ['keyline', 'tags', 'box', 'anchor', 'grows', 'gap', 'glyph', 'optical']);
  for (const key of NOTE_KEYS) assert.equal(parseComment(`${key}: x`, { style: 'filled', concept: 'a' }).kind, 'note', key);
  const plain = parseComment('Plain: folder box, this icon only (2026-09-20)');
  assert.equal(plain.kind, 'text');
  assert.equal(plain.looksLikeNote, null, 'a capitalised label is not a misspelt key');
  assert.equal(parseComment('x-circle: our x, centred (C18)').looksLikeNote, null, 'a hyphenated relative name is not a key');
  assert.equal(parseComment('volume: The full member').looksLikeNote, 'volume');
  const typo = parseComment('opticl: 0 0.5');
  assert.equal(typo.kind, 'text');
  assert.equal(typo.looksLikeNote, 'opticl');
});

test('keyline: only the word mark does anything (lint.mjs:322-323)', () => {
  assert.equal(parseComment('keyline: mark').lint.reads, true);
  const other = parseComment('keyline: marks');
  assert.equal(other.lint.reads, false);
  assert.match(other.lint.why, /silent no-op/);
});

test('box: WxH reads; anything else is lint\'s error (lint.mjs:65-70, 325)', () => {
  const b = parseComment('box: 20x18');
  assert.deepEqual(b.parsed, { w: 20, h: 18 });
  assert.equal(b.lint.reads, true);
  assert.deepEqual(parseComment('box: 20×18').parsed, { w: 20, h: 18 }, 'the × form lint accepts');
  const bad = parseComment('box: 20 by 18');
  assert.equal(bad.lint.reads, false);
  assert.equal(bad.parsed.bad, true);
});

test('grows: four signed numbers on a filled file; an outline file is an error (lint.mjs:85-92, 222-224)', () => {
  const g = parseComment('grows: 0 0 0.5 0.5', { style: 'filled', concept: 'menu' });
  assert.deepEqual(g.parsed, { l: 0, r: 0, t: 0.5, b: 0.5 });
  assert.equal(g.lint.reads, true);
  assert.equal(parseComment('grows: 0 0 0.5', { style: 'filled', concept: 'menu' }).lint.reads, false, 'three numbers');
  const outline = parseComment('grows: 0 0 0.5 0.5', { style: 'outline', concept: 'menu' });
  assert.equal(outline.lint.reads, false);
  assert.match(outline.lint.why, /222-224/);
});

test('gap: a positive number below MIN_GAP; 1.5 and above is an error (lint.mjs:106-111, 235-238)', () => {
  const g = parseComment('gap: 1');
  assert.equal(g.parsed.n, 1);
  assert.equal(g.lint.reads, true);
  assert.equal(parseComment('gap: 1.5').lint.reads, false);
  assert.match(parseComment('gap: 1.5').lint.why, /not below/);
  assert.equal(parseComment('gap: one').lint.reads, false);
  assert.equal(parseComment('gap: 0').lint.reads, false, 'lint requires > 0');
});

test('glyph: dot, numeral or letter; anything else is an error (lint.mjs:142-147)', () => {
  assert.equal(parseComment('glyph: dot').parsed.kind, 'dot');
  assert.equal(parseComment('glyph: numeral').lint.reads, true);
  assert.equal(parseComment('glyph: letter').lint.reads, true);
  assert.equal(parseComment('glyph: letter').parsed.kind, 'letter');
  assert.equal(parseComment('glyph: letters').lint.reads, false);
});

test('anchor: an icon name, never -filled, never itself (lint.mjs:124-129, 259-262)', () => {
  const a = parseComment('anchor: volume', { style: 'filled', concept: 'volume-low' });
  assert.equal(a.parsed.name, 'volume');
  assert.equal(a.lint.reads, true);
  assert.equal(parseComment('anchor: volume-filled', { concept: 'volume-low' }).lint.reads, false);
  assert.equal(parseComment('anchor: Volume', { concept: 'volume-low' }).lint.reads, false);
  const self = parseComment('anchor: volume', { style: 'outline', concept: 'volume' });
  assert.equal(self.lint.reads, false);
  assert.match(self.lint.why, /anchor itself/);
});

test('optical: read and never validated; a malformed pair is NaN and disables the check (lint.mjs:319, 361)', () => {
  const o = parseComment('optical: 0 0.5');
  assert.deepEqual(o.parsed, { dx: 0, dy: 0.5, valid: true });
  assert.equal(o.lint.reads, true);
  assert.match(o.lint.why, /never checked/);
  const nan = parseComment('optical: - .');
  assert.equal(nan.lint.reads, true, 'lint does match it');
  assert.equal(nan.parsed.valid, false);
  assert.match(nan.lint.why, /NaN/);
  assert.equal(parseComment('optical: 0.5').lint.reads, false, 'one number does not match lint\'s regex');
});

test('tags: never read by lint, split on commas by the build (build.mjs:27)', () => {
  const t = parseComment('tags: long sweep, classic');
  assert.deepEqual(t.parsed.list, ['long sweep', 'classic']);
  assert.equal(t.lint.reads, false);
  assert.match(t.lint.why, /build\.mjs:27/);
});

test('a ">" inside a note value: lint silently reads no note; the mirror says so instead of throwing', () => {
  for (const [key, value] of [['box', '20x18 > 19'], ['gap', '1 > 0'], ['glyph', 'dot > numeral'], ['anchor', 'volume > low'], ['grows', '0 0 0.5 > 0.5'], ['keyline', 'mark >'], ['optical', '0 > 0.5'], ['tags', 'a > b']]) {
    const c = parseComment(`${key}: ${value}`, { style: 'filled', concept: 'a' });
    assert.equal(c.kind, 'note', key);
    assert.equal(c.lint.reads, false, key);
    assert.match(c.lint.why, key === 'keyline' || key === 'optical' || key === 'tags' ? /does not match|contains ">"/ : /contains ">"/, key);
  }
  const r = extractFile(svg(24, 1.5, ['<!-- box: 20x18 > 19 -->', '<path d="M4 4H20"/>']), 24, 'gt.svg');
  assert.equal(r.notes.box.lint.reads, false);
  assert.equal(r.notes.box.parsed.unread, true);
});

// --- one file ---------------------------------------------------------------------------------

// chevron-down at 24, as shipped at the pin: one bend, two tangent points, an optical shift.
const CHEVRON = svg(24, 1.5, [
  '<!-- keyline: mark -->',
  '<!-- tags: classic -->',
  '<!-- optical: 0 0.5 -->',
  '<!-- chevron-down · classic: 45° legs, right-angle corner. 14 · 12 · 10.5 wide · filled leg 24: bend 1.97 -->',
  '<path d="M5.75 9.54L11.47 15.25A0.75 0.75 0 0 0 12.53 15.25L18.25 9.54"/>',
]);

test('extractFile: notes, text and the off-grid census by hand', () => {
  const r = extractFile(CHEVRON, 24, 'chevron-down.svg');
  assert.equal(r.concept, 'chevron-down');
  assert.equal(r.style, 'outline');
  assert.equal(r.comments.length, 4);
  assert.deepEqual(Object.keys(r.notes).sort(), ['keyline', 'optical', 'tags']);
  assert.equal(r.notes.keyline.lint.reads, true);
  assert.deepEqual(r.notes.optical.parsed, { dx: 0, dy: 0.5, valid: true });
  assert.equal(r.text.length, 1);
  assert.deepEqual(r.body, { strokes: 1, areas: 0, areaFormInOutline: 0 });
  // off the quarter grid: 9.54 (M), 11.47 (L), 12.53 (the arc's end x), 9.54 again (L) — 4 values, 3 distinct
  assert.equal(r.offGrid.total, 4);
  assert.deepEqual(r.offGrid.distinct, ['9.54', '11.47', '12.53']);
  assert.deepEqual(r.offGrid.byCommand, { straight: 3, arcParam: 0, arcEnd: 1, curve: 0, mismatch: false });
  assert.equal(r.offGrid.overPrecision, 0);
  assert.equal(r.offGrid.namedInText, 0, 'the comment names 1.97, not any off-grid value');
  assert.equal(r.offGrid.keywordInText, false);
  assert.equal(r.offGrid.lintPrints, 'documented exception');
});

test('extractFile: the grid is the master\'s — eighths at 16, quarters at 24, and the decimal ceiling comes first', () => {
  // 1.375 sits on the eighth grid: at 16 it is on-grid …
  const eighths = '<path d="M1.375 8H14.625"/>';
  const at16 = extractFile(svg(16, 1.25, ['<!-- a line -->', eighths]), 16, 'line.svg');
  assert.equal(at16.offGrid.total, 0);
  assert.equal(at16.offGrid.grid, 0.125);
  assert.equal(at16.offGrid.lintPrints, null);
  // … and at 24 it is not off-grid either: its third decimal is over the 2 dp ceiling, which lint
  // reports as an ERROR before it ever reaches the grid test (lint.mjs:294-295)
  const at24 = extractFile(svg(24, 1.5, ['<!-- a line -->', eighths]), 24, 'line.svg');
  assert.equal(at24.offGrid.grid, 0.25);
  assert.equal(at24.offGrid.overPrecision, 2);
  assert.equal(at24.offGrid.total, 0);
  // a 2 dp value off the quarter grid is what the off-grid census counts at 24 — and at 16 too,
  // since 1.35 is not on the eighth grid either
  const hundredths = '<path d="M1.35 8H14.65"/>';
  assert.equal(extractFile(svg(24, 1.5, ['<!-- a line -->', hundredths]), 24, 'line.svg').offGrid.total, 2);
  assert.equal(extractFile(svg(16, 1.25, ['<!-- a line -->', hundredths]), 16, 'line.svg').offGrid.total, 2);
});

test('extractFile: a curve\'s arguments are labelled curve, not straight (none in the set today)', () => {
  const r = extractFile(svg(24, 1.5, ['<!-- a curve -->', '<path d="M4 4C5.13 6 7 8.37 12 12Q13.11 14 20 20"/>']), 24, 'curve.svg');
  // off the quarter grid: 5.13 and 8.37 (C), 13.11 (Q) — all curve arguments
  assert.equal(r.offGrid.total, 3);
  assert.deepEqual(r.offGrid.byCommand, { straight: 0, arcParam: 0, arcEnd: 0, curve: 3, mismatch: false });
});

test('extractFile: no comment at all → lint would print "undocumented" (lint.mjs:216, 299)', () => {
  const r = extractFile(svg(24, 1.5, ['<path d="M5.75 9.54H18.25"/>']), 24, 'bare.svg');
  assert.equal(r.comments.length, 0);
  assert.equal(r.offGrid.lintPrints, 'undocumented');
});

test('extractFile: the two text proxies — a value named verbatim, a construction word', () => {
  const named = extractFile(svg(24, 1.5, ['<!-- the tangent point lands at 9.54, r × tan 22.5 back along the leg -->', '<path d="M5.75 9.54H18.25"/>']), 24, 'a.svg');
  assert.equal(named.offGrid.namedInText, 1);
  assert.equal(named.offGrid.keywordInText, true);
  const partial = extractFile(svg(24, 1.5, ['<!-- the head is 19.54 wide -->', '<path d="M5.75 9.54H18.25"/>']), 24, 'b.svg');
  assert.equal(partial.offGrid.namedInText, 0, '19.54 does not name 9.54');
  assert.equal(partial.offGrid.keywordInText, false);
});

test('extractFile: a filled file\'s AREA paths are counted; an AREA path in an outline file is invisible to lint and counted apart', () => {
  const area = '<path fill="currentColor" fill-rule="evenodd" stroke="none" d="M3 3H21.13V21Z"/>';
  const filled = extractFile(svg(24, 1.5, ['<!-- a shape -->', area, '<path d="M4 4H20"/>']), 24, 'shape-filled.svg');
  assert.deepEqual(filled.body, { strokes: 1, areas: 1, areaFormInOutline: 0 });
  assert.equal(filled.offGrid.total, 1, '21.13 is off the quarter grid');
  const outline = extractFile(svg(24, 1.5, ['<!-- a shape -->', area, '<path d="M4 4H20"/>']), 24, 'shape.svg');
  assert.deepEqual(outline.body, { strokes: 1, areas: 0, areaFormInOutline: 1 });
  assert.equal(outline.offGrid.total, 0, 'lint strips the AREA form from an outline file before it counts (lint.mjs:278)');
});

test('extractFile: a key declared twice — lint reads the first, the second is recorded', () => {
  const r = extractFile(svg(24, 1.5, ['<!-- box: 20x18 -->', '<!-- box: 18x18 -->', '<path d="M4 4H20"/>']), 24, 'twice.svg');
  assert.deepEqual(r.notes.box.parsed, { w: 20, h: 18 });
  assert.deepEqual(r.duplicateKeys, ['box']);
});

// --- a set ------------------------------------------------------------------------------------

test('inventory and consistency over a synthetic set', () => {
  const files = [
    extractFile(svg(24, 1.5, ['<!-- box: 20x18 -->', '<!-- tags: plain -->', '<!-- Plain: a folder -->', '<path d="M4 4H20"/>']), 24, 'folder.svg'),
    extractFile(svg(24, 1.5, ['<!-- tags: plain -->', '<!-- folder, filled -->', '<path d="M4 4H20"/>']), 24, 'folder-filled.svg'),
    extractFile(svg(20, 1.5, ['<!-- box: 16x14 -->', '<!-- tags: plain -->', '<path d="M4 4H16.13"/>']), 20, 'folder.svg'),
  ];
  const s = inventory(files);
  assert.equal(s.files, 3);
  assert.equal(s.concepts, 1);
  assert.deepEqual(s.comments, { total: 7, notes: 5, text: 2, filesWithout: 0 });
  assert.equal(s.byKey.box.files, 2);
  assert.equal(s.byKey.box.concepts, 1);
  assert.deepEqual(s.byKey.box.conceptList, ['folder']);
  assert.deepEqual(s.byKey.box.values, { '20x18': 1, '16x14': 1 });
  assert.equal(s.byKey.tags.lintIgnores, 3);
  assert.equal(s.offGrid.files, 1);
  assert.equal(s.offGrid.noFreeText, 1, 'the 20 file has only notes, no construction line');
  const rows = consistency(files);
  const box = rows.find((r) => r.key === 'box');
  assert.deepEqual(box.have, ['24/outline', '20/outline']);
  assert.deepEqual(box.missing, ['24/filled'], 'only slots that exist count as missing');
  assert.equal(box.partial, true);
  assert.deepEqual(box.values, { '24/outline': '20x18', '20/outline': '16x14' });
  assert.equal(rows.find((r) => r.key === 'tags').partial, false);
  assert.equal(SLOTS.length, 6);
});

// --- the shipped set, where the extractor must reproduce what the documents say ------------------

test('shipped: one record per .svg, every file carries a comment, no file is "undocumented"', { skip: !haveSet }, () => {
  const set = extractSet(icons);
  const expected = [24, 20, 16].reduce((n, m) => n + readdirSync(`${icons}/${m}`).filter((f) => f.endsWith('.svg')).length, 0);
  assert.equal(set.files.length, expected);
  assert.equal(set.summary.comments.filesWithout, 0, 'enforcement-gap.md:60-61 — every file contains a comment');
  assert.equal(set.summary.offGrid.undocumented, 0, 'so the warning branch at lint.mjs:299 never fires');
  assert.equal(set.summary.offGrid.overPrecision, 0, 'lint reports 0 failed at the pin, so nothing is over the decimal ceiling');
});

test('shipped: trash at 24 carries five distinct off-quarter values (enforcement-gap.md:66-67)', { skip: !haveSet }, () => {
  const r = extractFile(readFileSync(`${icons}/24/trash.svg`, 'utf8'), 24, 'trash.svg');
  assert.equal(r.offGrid.distinct.length, 5);
  assert.deepEqual(r.offGrid.distinct, ['6.1', '18.85', '7.59', '16.41', '17.9']);
  assert.equal(r.offGrid.total, 6, '18.85 appears twice');
  assert.deepEqual(r.offGrid.byCommand, { straight: 3, arcParam: 0, arcEnd: 3, curve: 0, mismatch: false });
  assert.equal(r.offGrid.namedInText, 0, 'its comment explains the 4° taper and names none of them');
});

// `lintSource` is lint's whole per-file check, exported for tools/geometry.test.mjs; it reads
// nothing from disk. Its return carries the parsed `gap`, `grows` and `anchor` notes, `isMark`,
// and the printed notes — the off-grid line ("N off-quarter-grid value(s): a, b — documented
// exception"), the "optical shift dx, dy" line and the "agreed box" headline — so every field
// the extractor claims to mirror can be read back from lint itself. Runs over all 2,910 files
// (about 20 s): the claim is about the whole set.
test('shipped: every file agrees with lintSource, field by field (tools/lint.mjs:202-530)', { skip: !haveSet }, () => {
  let n = 0;
  const bad = [];
  const chk = (ok, where, msg) => { if (!ok) bad.push(`${where}: ${msg}`); };
  for (const m of [24, 20, 16]) for (const f of readdirSync(`${icons}/${m}`).filter((f) => f.endsWith('.svg')).sort()) {
    const src = readFileSync(`${icons}/${m}/${f}`, 'utf8');
    const L = lintSource(m, f, src), N = extractFile(src, m, f);
    const where = `${m}/${f}`;
    n++;
    // the off-grid census: count, the distinct values as lint prints them, and which branch printed
    const og = L.notes.find((x) => /off-\w+-grid value/.test(x));
    const lintTotal = og ? +og.match(/^(\d+) off/)[1] : 0;
    const lintDistinct = og ? og.replace(/^\d+ off-\w+-grid value\(s\): /, '').replace(/ — .*$/, '').split(', ') : [];
    chk(lintTotal === N.offGrid.total, where, `off-grid total: lint ${lintTotal}, notes ${N.offGrid.total}`);
    chk(lintDistinct.join(',') === N.offGrid.distinct.join(','), where, 'off-grid distinct values differ');
    chk(!N.offGrid.byCommand.mismatch, where, 'by-command split does not add up to the total');
    const printed = og ? (/documented exception/.test(og) ? 'documented exception' : 'undocumented') : null;
    chk(printed === N.offGrid.lintPrints, where, `lintPrints: lint ${printed}, notes ${N.offGrid.lintPrints}`);
    // the notes lint acts on
    chk(L.isMark === (N.notes.keyline?.lint.reads === true), where, `keyline: lint isMark ${L.isMark}`);
    chk((L.gap?.n ?? null) === (N.notes.gap?.lint.reads ? N.notes.gap.parsed.n : null), where, 'gap');
    const lg = L.grows ? [L.grows.l, L.grows.r, L.grows.t, L.grows.b] : null;
    const ng = N.notes.grows?.lint.reads ? [N.notes.grows.parsed.l, N.notes.grows.parsed.r, N.notes.grows.parsed.t, N.notes.grows.parsed.b] : null;
    chk(JSON.stringify(lg) === JSON.stringify(ng), where, 'grows');
    chk((L.anchor?.name ?? null) === (N.notes.anchor?.lint.reads ? N.notes.anchor.parsed.name : null), where, 'anchor');
    const sh = L.notes.find((x) => /^optical shift /.test(x));
    const lintShift = sh ? sh.replace('optical shift ', '').split(', ').map(Number) : null;   // lint prints it only when sx || sy (lint.mjs:321)
    const o = N.notes.optical;
    const noteShift = o?.lint.reads && o.parsed.valid && (o.parsed.dx || o.parsed.dy) ? [o.parsed.dx, o.parsed.dy] : null;
    chk(JSON.stringify(lintShift) === JSON.stringify(noteShift), where, `optical: lint ${lintShift}, notes ${noteShift}`);
    chk(L.notes.some((x) => /agreed box/.test(x)) === (N.notes.box?.lint.reads === true), where, 'box');
    chk(L.errors.length === 0, where, `lint errors: ${L.errors.join('; ')}`);
  }
  assert.ok(n >= 2898, `read ${n} files`);
  assert.deepEqual(bad, [], `${bad.length} disagreement(s) with lintSource:\n${bad.slice(0, 20).join('\n')}`);
});
