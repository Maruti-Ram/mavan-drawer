// Tests for tools/audit/families.mjs (card 1.10).
//
// Two halves. First, synthetic sets whose right answer is known exactly: a plus family whose sizes can be bent by a
// quarter unit, a ring with a small mark, a volume family with a moved speaker, tag notes that collide, a sheet of a
// dozen rows. Then the archived pin (git archive of 5933041 into a temporary directory — nothing in this repository
// is read for the figures or written), where every headline figure docs/audit/findings-families.md quotes must come
// out as the document states it, and where the grammar card's partition (125 stems · 105 families · 20 singletons ·
// 96 object families · 378 concepts) must be reproduced by the folding rule rebuilt from its tables.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_SPEC, MASTER_LIST, amountScan, antonymFaults, boxesReport, checkShapes, layoutTurns, samplesOf, turnDistance, censusReport, containerReport, figureOf, figureReport, figuresDefaults, figuresPage, foldGrammar,
  gridReport, identityReport, iconOf, keylineOf, levelReport, lintReading, loadSet, loadSpec, nameFaults, numberedRuns, parseName, parseSheet, partitionBoxes, partsOf,
  ruleText, runBoxes, runsReport, setFromTexts, sheetReport, sizeFamilies, sizeReport, specEqual, spreadOf, stepRow, tagsOf, tagsReport, tickTravel, travelReport, wavesDropped, withinTolerance,
} from './families.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
const PIN = '5933041';

// ── synthetic files ──────────────────────────────────────────────────────────────────────────────────────
const STROKE = { 24: 1.5, 20: 1.5, 16: 1.25 }, FILLED = { 24: 2.5, 20: 2, 16: 2 };
const ROOT = (m, w) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">`;
const svg = (m, w, lines) => `${ROOT(m, w)}\n${lines.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
/** A plus whose outer ink is L × L at master m in weight w: the centreline runs half a stroke short on each end. */
const plus = (m, L, w) => { const c = m / 2, h = (L - w) / 2; return svg(m, w, ['<!-- keyline: mark -->', `<path d="M${c - h} ${c}H${c + h}M${c} ${c - h}V${c + h}"/>`]); };
const SIZES = { 24: [12, 15, 18], 20: [11, 13.5, 16], 16: [10, 12, 14] };
/** The plus family, every master and both styles; `bend` moves one member's long side. */
function plusSet(bend = {}) {
  const texts = {};
  for (const m of MASTER_LIST) [['plus-small', 0], ['plus', 1], ['plus-large', 2]].forEach(([name, i]) => {
    const L = SIZES[m][i] + (bend[`${m}/${name}`] ?? 0);
    texts[`${m}/${name}`] = plus(m, L, STROKE[m]);
    texts[`${m}/${name}-filled`] = plus(m, L, FILLED[m]);
  });
  return setFromTexts(texts);
}
const tagged = (name, tags) => [`24/${name}`, `<svg>\n  <!-- tags: ${tags.join(', ')} -->\n</svg>`];
const tagSet = (rows) => setFromTexts(Object.fromEntries(rows.map(([n, t]) => tagged(n, t))));

// ── names ────────────────────────────────────────────────────────────────────────────────────────────────
test('C9 names: size last, number before it, stem what is left; a figure word after the number is C27\'s', () => {
  assert.deepEqual(parseName('check'), { name: 'check', stem: 'check', number: null, n: 1, size: null });
  assert.deepEqual(parseName('check-2-small'), { name: 'check-2-small', stem: 'check', number: 2, n: 2, size: 'small' });
  assert.equal(parseName('check-circle-3-small').stem, 'check-circle');
  assert.equal(parseName('rotate-ccw-10').n, 10);
  assert.equal(parseName('x-large').stem, 'x');
  assert.equal(parseName('users-2-behind').stem, 'users-2-behind', 'the word after the number keeps the number inside the stem');
  assert.deepEqual(figureOf('users-2-behind'), { object: 'users', figure: 2, word: 'behind' });
  assert.deepEqual(figureOf('user-3'), { object: 'user', figure: 3, word: null });
  assert.deepEqual(figureOf('users-level'), { object: 'users', figure: 1, word: 'level' });
  assert.equal(figureOf('user-plus'), null);
  const faults = nameFaults(['ok-2-small', 'x-small-2', 'plus-filled', 'Bad', 'users-3-wide', 'a-2-b']);
  assert.deepEqual(faults.map((f) => f.name).sort(), ['Bad', 'a-2-b', 'plus-filled', 'x-small-2']);
});

test('the grammar card\'s folding rule, and this card\'s one departure from it', () => {
  const f = (n, o) => foldGrammar(n, o);
  assert.equal(f('arrow-up-2'), 'arrow');
  assert.equal(f('arrow-up-right-3'), 'arrow-up-right', 'a diagonal is not one of the four directions');
  assert.equal(f('chevron-left-3-small'), 'chevron');
  assert.equal(f('plus-circle-small'), 'plus');
  assert.equal(f('plus-circle-small', { unfoldCircles: true }), 'plus-circle');
  assert.equal(f('check-circle-3'), 'check-circle', 'check-circle stands alone in the grammar card too');
  assert.equal(f('sort-alpha-descending-3'), 'sort-alpha');
  assert.equal(f('sort-descending'), 'sort');
  assert.equal(f('users-3-behind'), 'users');
  assert.equal(f('users'), 'users');
  assert.equal(f('volume-x'), 'volume');
  assert.equal(f('face-sad'), 'face');
  assert.equal(f('menu-arrow-left'), 'menu-arrow');
  assert.equal(f('layout-sidebar-right-2'), 'layout-sidebar-right');
  assert.equal(f('login-3'), 'login');
});

// ── §1 numbered runs, identity, tags, travel ─────────────────────────────────────────────────────────────
test('a run lists the numbers it ships and the gaps between them; sizes are not shapes', () => {
  const names = ['trash', 'trash-5', 'check-circle', 'check-circle-3', 'check-circle-4', 'check-circle-small', 'check-circle-3-small', 'plus', 'plus-small', 'users-2-behind', 'rotate-ccw', 'rotate-ccw-2'];
  const r = runsReport(names);
  assert.deepEqual(r.runs.map((x) => x.stem), ['check-circle', 'rotate-ccw', 'trash']);
  assert.deepEqual(r.gapped.map((x) => [x.stem, x.gaps]), [['check-circle', [2]], ['trash', [2, 3, 4]]]);
  assert.deepEqual(r.lengths, { 2: 2, 3: 1 });
  assert.equal(numberedRuns(names).find((x) => x.stem === 'plus').numbers.length, 1, 'plus-small is a size, not a second shape');
  assert.equal(r.variants, 1 + 1 + 2);
  assert.deepEqual(runsReport(['foo-2', 'foo-3']).defaultMissing.map((x) => x.stem), ['foo'], 'a run with no unnumbered member is reported');
  assert.deepEqual(numberedRuns(['foo-2', 'foo-3'])[0].gaps, [1], 'and its missing default is a gap at 1');
});

test('the same drawing under two names: whole icon, outline only, at how many masters', () => {
  const file = (body) => `<svg viewBox="0 0 24 24">\n<!-- a note -->\n  <path d="${body}"/>\n</svg>`;
  const t = {};
  for (const m of MASTER_LIST) {
    for (const [name, o, f] of [['a', 'M1 1H5', 'M1 1H9'], ['b', 'M1 1H5', 'M2 2H9'], ['c', m === 16 ? 'M1 1H5' : 'M3 3H5', m === 16 ? 'M1 1H9' : 'M3 3H9'], ['d', 'M7 7H8', 'M7 7H9'],
      ['e', m === 24 ? 'M6 6H8' : `M6 ${m}H8`, 'M6 6H8'], ['f', m === 24 ? 'M6 6H8' : `M7 ${m}H8`, 'M6 6H9']]) {
      t[`${m}/${name}`] = file(o); t[`${m}/${name}-filled`] = file(f);
    }
  }
  const set = setFromTexts(t);
  const r = identityReport(set, set.names);
  assert.deepEqual(r.libraryTwins, [['a', 'b']], 'the Library groups outlines identical at all three masters — e and f match at 24 only and are not twins');
  assert.deepEqual(r.outlineOnly.map((p) => `${p.a}|${p.b}`), ['a|b']);
  assert.deepEqual(r.wholeSome.map((p) => [`${p.a}|${p.b}`, p.whole]), [['a|c', [16]]], 'a and c are the same icon at 16 only');
  assert.equal(r.wholeAll.length, 0);
});

test('tags: variants a search cannot tell apart, variants with no word of their own, a direction word that lies', () => {
  const set = tagSet([
    ['chart-pie', ['pie', 'chart']], ['chart-pie-2', ['chart', 'pie']], ['chart-pie-3', ['pie', 'chart']],
    ['check', ['classic']], ['check-2', ['long sweep']], ['check-small', ['classic']],
    ['sort-alpha-descending', ['sort', 'descending']], ['sort-alpha-descending-2', ['sort', 'ascending', 'lines']],
    ['users', ['team', 'group', 'people', 'members']], ['users-4', ['pair']],
  ]);
  const t = tagsReport(set, set.names);
  assert.equal(t.identical.length, 3, 'three variants with one tag set are three pairs, in any word order');
  assert.deepEqual(t.noOwn.sort(), ['chart-pie-2', 'chart-pie-3']);
  assert.deepEqual(t.faults.map((f) => f.name), ['sort-alpha-descending-2']);
  assert.deepEqual(t.sizedDiffer, [], 'a size carries its default\'s tags');
  assert.deepEqual(t.usersLacking, ['users-4']);
  assert.deepEqual(t.against.sort(), ['chart-pie', 'chart-pie-2', 'chart-pie-3', 'sort-alpha-descending-2'], 'kind 1: against C9\'s style word — the same-tag trio and the lying antonym');
  assert.ok(!t.against.includes('users-4') && t.problems.includes('users-4') && t.problems.length === 5, 'kind 3: the group words no rule asks for are counted apart');
  assert.deepEqual(antonymFaults('sort-descending', ['sort', 'ascending', 'descending']), [], 'both words present is not a lie');
  assert.deepEqual(antonymFaults('sort-ascending', ['sort', 'descending']).map((f) => f.other), ['descending']);
  assert.deepEqual(antonymFaults('plus', ['ascending']), [], 'a name without the word is not held to it');
  assert.deepEqual(tagsOf('<!-- tags: a,  b ,, c -->'), ['a', 'b', 'c']);
  assert.equal(tagsOf('<svg/>'), null);
});

test('a number travels when every stem of a sibling set gives it the same style word', () => {
  const set = tagSet([
    ['check', ['classic']], ['check-2', ['classic', 'long sweep']], ['check-3', ['classic', 'steep']], ['check-4', ['classic', 'lean']],
    ['check-circle', ['classic']], ['check-circle-3', ['classic', 'steep']], ['check-circle-4', ['classic', 'lean']],
    ['checkbox', ['classic', 'task']], ['checkbox-2', ['classic', 'task', 'steep']], ['checkbox-3', ['classic', 'task', 'lean']], ['checkbox-4', ['classic', 'task']],
  ]);
  const sib = travelReport(set, set.names).find((s) => s.id.startsWith('check,'));
  assert.deepEqual(sib.stems, ['check', 'check-circle', 'checkbox']);
  const by = Object.fromEntries(sib.rows.map((r) => [r.number, r]));
  assert.equal(by[2].agree, false, 'check-2 is a long sweep and checkbox-2 steep');
  assert.equal(by[3].agree, false);
  assert.deepEqual(by[3].groups.map((g) => g.stems), [['check', 'check-circle'], ['checkbox']]);
  assert.equal(by[4].groups.find((g) => g.stems.includes('checkbox')).words, '(none)', 'checkbox-4 adds no word to checkbox');
});

/** The four layout regions on a bare frame: a band line at the bottom, mirrored, turned, turned and reflected. */
function layoutSet(drift = 0, extra = false) {
  const t = {};
  for (const m of MASTER_LIST) for (const f of ['', '-filled']) {
    const w = f ? FILLED[m] : STROKE[m], frame = `<path d="M3 3H${m - 3}V${m - 3}H3Z"/>`;
    t[`${m}/layout-footer${f}`] = svg(m, w, [frame, `<path d="M3 ${m - 9}H${m - 3}"/>`]);
    t[`${m}/layout-header${f}`] = svg(m, w, [frame, `<path d="M3 ${9 + drift}H${m - 3}"/>`, ...(extra ? [`<path d="M3 ${m / 2}H${m - 3}"/>`] : [])]);
    t[`${m}/layout-sidebar${f}`] = svg(m, w, [frame, `<path d="M9 3V${m - 3}"/>`]);
    t[`${m}/layout-sidebar-right${f}`] = svg(m, w, [frame, `<path d="M${m - 9} 3V${m - 3}"/>`]);
  }
  return setFromTexts(t);
}
test('C29: header, sidebar and sidebar-right are the footer turned — exactly, and a quarter-unit drift shows', () => {
  const set = layoutSet(), rows = layoutTurns(set, set.names);
  assert.equal(rows.length, 6, 'one construction, both styles, three masters');
  for (const r of rows) assert.deepEqual([r.header, r.sidebar, r.right], [0, 0, 0], `${r.style} ${r.master}`);
  const f = samplesOf(set, '24/layout-footer'), h = samplesOf(set, '24/layout-header'), s = samplesOf(set, '24/layout-sidebar');
  assert.ok(turnDistance(f, h, 'mirrorX', 24) > 1, 'the wrong symmetry is far');
  assert.ok(turnDistance(f, s, 'quarterCCW', 24) > 1, 'a quarter turn the other way is far');
  const bad = layoutSet(0.25);
  assert.ok(Math.abs(Math.max(...layoutTurns(bad, bad.names).map((r) => r.header)) - 0.25) < 1e-6, 'a header 0.25 off its mirror reads as 0.25');
  const extra = layoutSet(0, true);
  assert.ok(Math.max(...layoutTurns(extra, extra.names).map((r) => r.header)) > 1, 'a header with a line the footer has no mirror of is far, though every footer sample finds its mate');
});

test('where C9\'s two numbering sentences are written: a hit is a file and a line, and a file that lacks them says none', () => {
  const dir = mkdtempSync(join(tmpdir(), 'families-rules-'));
  try {
    execFileSync('mkdir', ['-p', join(dir, 'docs'), join(dir, '.claude/skills/icon')]);
    writeFileSync(join(dir, 'docs/07-character.md'), 'one\n| C9 | Numbers are assigned in approval order and never reused; a composite may ship other shapes, numbered after the shape they use |\nthree\n');
    writeFileSync(join(dir, 'CLAUDE.md'), 'a\nb\n| Naming (C9) | shape variants are numbered (`check-2`) |\n');
    writeFileSync(join(dir, '.claude/skills/icon/SKILL.md'), 'a size name (`bell-small`) goes under its default\n');
    const r = ruleText(dir);
    assert.deepEqual(r['docs/07-character.md'].hits, { 'approval order': [2], 'numbered after the shape': [2], C9: [2] });
    assert.deepEqual(r['CLAUDE.md'].hits, { 'approval order': [], 'numbered after the shape': [], C9: [3] });
    assert.deepEqual(r['.claude/skills/icon/SKILL.md'].hits, { 'approval order': [], 'numbered after the shape': [], C9: [] });
    rmSync(join(dir, 'CLAUDE.md'));
    assert.equal(ruleText(dir)['CLAUDE.md'].exists, false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('a checkbox tick is a check-circle tick when the shape is the same, wherever it sits', () => {
  const frame = '<path d="M3 3H21V21H3Z"/>';
  const tick = (d) => `<path d="${d}"/>`;
  const set = setFromTexts(Object.fromEntries(MASTER_LIST.flatMap((m) => [
    [`${m}/check-circle`, svg(m, 1.5, [frame, tick('M8 12L11 15L16 9')])],
    [`${m}/check-circle-3`, svg(m, 1.5, [frame, tick('M8 12L10 16L16 8')])],
    [`${m}/checkbox`, svg(m, 1.5, [frame, tick('M9 11L12 14L17 8')])],            // check-circle's tick moved by (1, -1)
    [`${m}/checkbox-2`, svg(m, 1.5, [frame, tick('M8 12L10 16L16 8')])],          // check-circle-3's, in place
    [`${m}/checkbox-3`, svg(m, 1.5, [frame, tick('M8 12L12 16L16 8')])],          // a tick nobody else has
  ])));
  assert.deepEqual(tickTravel(set, 24).map((x) => [x.box, x.tickIs]), [['checkbox', ['check-circle']], ['checkbox-2', ['check-circle-3']], ['checkbox-3', []]]);
  assert.deepEqual(checkShapes(['checkbox', 'checkbox-2', 'checkbox-10', 'check-circle', 'check-circle-small', 'check-circle-3', 'check-circle-3-small', 'check-2']),
    { box: ['checkbox-2', 'checkbox-10'], ring: ['check-circle-3', 'check-circle-3-small'] }, 'the numbered shapes only: neither the default nor the unnumbered small, nor check-2');
});

test('lintReading: the largest gap between lint\'s size and the exact one, and the family warnings lint raises', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'families-stub-'));
  try {
    execFileSync('mkdir', ['-p', join(dir, 'tools')]);
    writeFileSync(join(dir, 'tools/lint.mjs'), `export const lintSource = () => ({ size: 15.004, inner: null, isMark: true, warnings: [], errors: [] });
export const checkFamilies = (results) => { for (const [k, r] of results) if (/plus-large/.test(k)) r.warnings.push('large is 15.004 — C8 wants 18'); return results; };`);
    const set = plusSet(), s = sizeReport(set, set.names);
    const r = await lintReading(set, dir, s);
    assert.equal(r.files, 18);
    assert.ok(Math.abs(r.maxDiff - 5.004) < 1e-9, `the stub says 15.004 everywhere and the smallest plus is 10: ${r.maxDiff}`);
    assert.equal(r.warned.length, 6, 'plus-large at three masters in two styles');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ── §2 size families ─────────────────────────────────────────────────────────────────────────────────────
test('C8: a plus of 12 / 15 / 18 at 24 holds the step in both styles; bend the large by a quarter and it is found', () => {
  assert.deepEqual(sizeFamilies(['plus', 'plus-small', 'plus-large', 'check', 'check-small', 'ban']).map((f) => [f.base, f.small, f.large]), [['check', true, false], ['plus', true, true]]);
  const ok = sizeReport(plusSet(), plusSet().names);
  assert.equal(ok.families.length, 1);
  assert.equal(ok.families[0].kind, 'mark');
  assert.equal(ok.markCells, 6);
  assert.ok(ok.maxDev < 1e-9);
  for (const c of ok.families[0].cells) assert.ok(Math.abs(c.stepSmall - c.want) < 1e-9 && Math.abs(c.stepLarge - c.want) < 1e-9, `${c.style} ${c.master}`);
  const bent = plusSet({ '24/plus-large': 0.25 });
  const r = sizeReport(bent, bent.names);
  assert.ok(Math.abs(r.maxDev - 0.25) < 1e-9, `max deviation ${r.maxDev}`);
  const cell = r.families[0].cells.find((c) => c.style === 'outline' && c.master === 24);
  assert.ok(Math.abs(cell.devLarge - 0.25) < 1e-9 && Math.abs(cell.devSmall) < 1e-9);
  assert.deepEqual(stepRow(16, { small: 10, default: 12, large: 14 }), { master: 16, want: 2, L: { small: 10, default: 12, large: 14 }, stepSmall: 2, devSmall: 0, stepLarge: 2, devLarge: 0 });
  assert.equal(ok.steps, 12, 'six family × master × style cells, a small and a large each');
  // the small is measured as well as the large: a plus-small half a unit short at 20 reads as a step half a unit too long
  const short = plusSet({ '20/plus-small': -0.5 }), rs = sizeReport(short, short.names);
  for (const style of ['outline', 'filled']) {
    const c = rs.families[0].cells.find((x) => x.style === style && x.master === 20);
    assert.ok(Math.abs(c.stepSmall - 3) < 1e-9 && Math.abs(c.devSmall - 0.5) < 1e-9 && Math.abs(c.devLarge) < 1e-9, `${style}: step ${c.stepSmall}, deviation ${c.devSmall}`);
  }
  assert.ok(Math.abs(rs.maxDev - 0.5) < 1e-9);
  assert.ok(rs.families[0].cells.filter((x) => x.master !== 20).every((x) => Math.abs(x.devSmall) < 1e-9), 'the other masters are untouched');
});
test('the spec C8 is held to travels with the set: a pin\'s own SIZE_STEP is what a step is measured against', async () => {
  const set = plusSet();
  const stricter = { ...DEFAULT_SPEC, SIZE_STEP: { 24: 3, 20: 2.5, 16: 1.5 } };
  const r = sizeReport({ ...set, spec: stricter }, set.names);
  const c16 = r.families[0].cells.find((c) => c.style === 'outline' && c.master === 16);
  assert.deepEqual([c16.want, Math.round(c16.devSmall * 1000) / 1000, Math.round(c16.devLarge * 1000) / 1000], [1.5, 0.5, 0.5]);
  assert.ok(Math.abs(r.maxDev - 0.5) < 1e-9);
  assert.equal(sizeReport(set, set.names).maxDev < 1e-9, true, 'with no spec the tool\'s own copy is used');
  const dir = mkdtempSync(join(tmpdir(), 'families-spec-')), bare = mkdtempSync(join(tmpdir(), 'families-nospec-'));
  try {
    execFileSync('mkdir', ['-p', join(dir, 'tools')]);
    writeFileSync(join(dir, 'tools/masters.mjs'), 'export const SIZE_STEP = { 24: 4, 20: 3, 16: 2 };\nexport const MASTERS = { 24: { bound: [2, 22], keylines: { square: [18, 18] }, mark: 18 } };\n');
    const sp = await loadSpec(dir);
    assert.deepEqual(sp.SIZE_STEP, { 24: 4, 20: 3, 16: 2 });
    assert.equal(specEqual(sp, DEFAULT_SPEC), false);
    assert.equal(specEqual(DEFAULT_SPEC, DEFAULT_SPEC), true);
    assert.match((await loadSpec(bare)).source, /working tree/, 'a directory without tools/masters.mjs falls back, and says so');
  } finally { rmSync(dir, { recursive: true, force: true }); rmSync(bare, { recursive: true, force: true }); }
});

/** A ring-and-bar container at every master and both styles: outer ring ⌀ 20 · 16 · 14, a bar of outer ink `L`. */
function ringSet(L = { 24: [10.5, 9], 20: [8, 7], 16: [6.5, 5.5] }) {
  const OUT = { 24: 20, 20: 16, 16: 14 }, texts = {};
  for (const m of MASTER_LIST) [['ring', 0], ['ring-small', 1]].forEach(([name, i]) => {
    const w = STROKE[m], R = (OUT[m] - w) / 2, c = m / 2, len = L[m][i] - w;
    texts[`${m}/${name}`] = svg(m, w, [`<path d="M${c - R} ${c}A${R} ${R} 0 1 0 ${c + R} ${c}A${R} ${R} 0 1 0 ${c - R} ${c}Z"/>`, `<path d="M${c - len / 2} ${c}H${c + len / 2}"/>`]);
    const r = OUT[m] / 2, cut = L[m][i];
    texts[`${m}/${name}-filled`] = `${ROOT(m, w)}\n  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="M${c - r} ${c}A${r} ${r} 0 1 0 ${c + r} ${c}A${r} ${r} 0 1 0 ${c - r} ${c}Z M${c - cut / 2} ${c - 0.75}H${c + cut / 2}V${c + 0.75}H${c - cut / 2}Z"/>\n</svg>\n`;
  });
  return setFromTexts(texts);
}
test('a container keeps its ring and changes only the mark; the filled twin cuts the mark out of the disc', () => {
  const set = ringSet(), s = sizeReport(set, set.names);
  assert.deepEqual([s.families.length, s.containers.length, s.marks.length], [1, 1, 0], 'no keyline: mark, so a container, and no C8 step is asked of it');
  const rows = containerReport(set, s)[0].rows;
  for (const r of rows) for (const style of ['outline', 'filled']) assert.equal(r[style].containerSame, true, `${r.master} ${style}`);
  const step = Object.fromEntries(rows.map((r) => [r.master, [r.outline.step, r.filled.step].map((x) => Math.round(x * 1000) / 1000)]));
  assert.deepEqual(step, { 24: [1.5, 1.5], 20: [1, 1], 16: [1, 1] }, 'the mark steps by what the sizes say; the ring does not move');
  assert.equal(Math.round(rows[0].outline.container), 20);
  // redraw the small ring one unit smaller at 16 and the container is no longer the same
  const t = Object.fromEntries([...set.files].map(([k, v]) => [k, v.text]));
  t['16/ring-small'] = t['16/ring-small'].replace(/6\.375/g, '5.875');
  const moved = setFromTexts(t);
  assert.equal(containerReport(moved, sizeReport(moved, moved.names))[0].rows.find((r) => r.master === 16).outline.containerSame, false);
  const p = partsOf(readIcon(ringSet().files.get('24/ring').text), false);
  assert.equal(Math.round(p.container.x1 - p.container.x0), 20);
});
function readIcon(text) { return iconOf(setFromTexts({ '24/probe': text }), '24/probe'); }

test('the grid: every concept six files, no size without its default, sizes by number', () => {
  const set = plusSet();
  const t = Object.fromEntries([...set.files].map(([k, v]) => [k, v.text]));
  delete t['16/plus-large-filled'];
  t['24/chevron-up-2-small'] = t['24/plus-small']; t['24/chevron-up-2-small-filled'] = t['24/plus-small-filled'];
  const broken = setFromTexts(t);
  const g = gridReport(broken, broken.names);
  assert.deepEqual(g.missing.sort(), ['16/plus-large-filled', '20/chevron-up-2-small', '20/chevron-up-2-small-filled', '16/chevron-up-2-small', '16/chevron-up-2-small-filled'].sort());
  assert.deepEqual(g.noDefault, ['chevron-up-2']);
  assert.deepEqual(gridReport(set, set.names).missing, []);
  assert.deepEqual([...gridReport(set, set.names).objects.get('plus')], [[1, 'SDL']]);
  assert.equal(gridReport(set, set.names).expected, 18);
});

// ── §3 the sheet ─────────────────────────────────────────────────────────────────────────────────────────
const SHEET = `# Drawing queue

## A · Marks

- [x] 1. \`plus\` · UI & Layout — approved 2026-09-17
- [x] 2. \`user\` · Users & Access — approved 2026-09-20
- [x] 2. \`user-2\` · Users & Access · variant of \`user\` — Large head · approved 2026-09-20
- [x] 2. \`user-3\` · Users & Access · variant of \`user\` — Open shoulders · approved 2026-09-20

## D · The rest

- [ ] 300. \`user-plus\` · Users & Access · variant of \`user\`
- [ ] 301. \`user-check\` · Users & Access · variant of \`user\`
- [ ] 302. \`battery\` · Devices & Hardware
- [ ] 303. \`battery-low\` · Devices & Hardware · variant of \`battery\`
- [ ] 304. \`layout-list\` · UI & Layout
- [ ] 305. \`plus-large\` · UI & Layout · variant of \`plus\`
- [ ] 306. \`chart-bar-horizontal\` · Charts · variant of \`chart-bar\`
`;
test('the sheet: queued relatives of shipped bases, the shapes they could multiply over, rows a numbering rule speaks for', () => {
  const rows = parseSheet(SHEET);
  assert.equal(rows.length, 11);
  assert.deepEqual(rows.find((r) => r.name === 'user-2'), { status: 'x', n: 2, name: 'user-2', section: 'A', variantOf: 'user', approved: '2026-09-20' });
  const s = sheetReport(rows, ['plus', 'user', 'user-2', 'user-3']);
  assert.equal(s.open, 7);
  assert.equal(s.withBase, 5);
  assert.equal(s.shipped, 3, 'user-plus, user-check, plus-large have shipped bases; battery-low and chart-bar-horizontal do not');
  assert.equal(s.queuedBase, 2);
  assert.deepEqual(s.styleWords, [{ name: 'chart-bar-horizontal', base: 'chart-bar', baseShips: false }]);
  assert.deepEqual(s.sized, ['plus-large']);
  assert.deepEqual(s.layoutRows, ['layout-list']);
  assert.deepEqual(s.figureRows, ['user-plus', 'user-check']);
  assert.deepEqual(s.bases.find((b) => b.base === 'user'), { base: 'user', relatives: ['user-plus', 'user-check'], shapes: 3 });
  assert.equal(s.onDefaultShape, 3);
  assert.equal(s.onEveryShape, 3 + 3 + 1, 'two on three shapes and one on one');
  assert.deepEqual(s.doneNotInSet, []);
});

const SHEET2 = `## A · Marks

- [x] 1. \`file\` · Files — approved 2026-09-17
- [x] 2. \`folder\` · Files — approved 2026-09-17
- [x] 2. \`folder-2\` · Files · variant of \`folder\` — approved 2026-09-17
- [x] 2. \`folder-3\` · Files · variant of \`folder\` — approved 2026-09-17
- [x] 3. \`mail\` · Communication — approved 2026-09-17
- [x] 4. \`check-circle\` · Status — approved 2026-09-17

## D · The rest

- [ ] 10. \`file-plus\` · Files · variant of \`file\`
- [ ] 11. \`file-minus\` · Files · variant of \`file\`
- [ ] 12. \`file-clock\` · Files · variant of \`file\`
- [ ] 13. \`folder-open\` · Files · variant of \`folder\`
- [ ] 14. \`folder-plus\` · Files · variant of \`folder\`
- [ ] 15. \`mail-open\` · Communication · variant of \`mail\`
- [ ] 16. \`check-circle-dashed\` · Status · variant of \`check-circle\`
- [ ] 17. \`flip-horizontal\` · Editing
- [ ] 18. \`viewport-wide\` · Layout
`;
test('the sheet: the base ranking counts a one-shape base, and the two lists of style words are named and kept apart', () => {
  const s = sheetReport(parseSheet(SHEET2), ['file', 'folder', 'folder-2', 'folder-3', 'mail', 'check-circle']);
  assert.deepEqual(s.bases.map((b) => [b.base, b.shapes, b.relatives.length]), [['file', 1, 3], ['folder', 3, 2], ['check-circle', 1, 1], ['mail', 1, 1]],
    'file has one shape and the most relatives, so it ranks first — a ranking over multi-shape bases only would leave it out');
  assert.deepEqual(s.basesMultiShape.map((b) => b.base), ['folder']);
  assert.deepEqual(s.styleWords, [{ name: 'check-circle-dashed', base: 'check-circle', baseShips: true }]);
  assert.deepEqual(s.styleNoBase, ['flip-horizontal'], 'the named list also reaches a name with no base, which is not a shape of anything');
  assert.deepEqual(s.nearStyle.map((x) => [x.name, x.base, x.baseShips]), [['folder-open', 'folder', true], ['mail-open', 'mail', true], ['viewport-wide', null, null]]);
});

// ── §4 figures ───────────────────────────────────────────────────────────────────────────────────────────
test('lab/figures.html\'s cells: a name that does not ship is the dashed one, and C27\'s fourth word dashes four', () => {
  const names = ['user', 'user-2', 'users', 'users-2', 'users-behind', 'users-wide', 'users-level', 'users-2-behind', 'users-2-wide'];
  const p = figuresPage(names);
  assert.deepEqual(p.figures, ['user', 'user-2']);
  assert.equal(p.cells.flat().length, 10);
  assert.deepEqual(p.missing.map((c) => c.name), ['users-2-level']);
  assert.deepEqual(figuresPage(names, { words: ['behind', 'heads'] }).missing.map((c) => c.name), ['users-heads', 'users-2-heads', 'users-2-behind'].filter((n) => !names.includes(n)));
  const html = "const OBJECT = q.get('object') || 'user';\nconst GROUP = q.get('group') || 'users';\nconst WORDS = (q.get('words') ?? 'behind,wide,level').split(',')";
  assert.deepEqual(figuresDefaults(html), { object: 'user', group: 'users', words: ['behind', 'wide', 'level'] });
});

// ── §5 levels ────────────────────────────────────────────────────────────────────────────────────────────
const speaker = (dx = 0) => `<path d="M${3 + dx} 9H${6 + dx}L${10 + dx} 5V19L${6 + dx} 15H${3 + dx}Z"/>`;
const wave1 = '<path d="M14 9A4 4 0 0 1 14 15"/>', wave2 = '<path d="M17 6A8 8 0 0 1 17 18"/>';
function volumeSet() {
  const t = {};
  for (const m of MASTER_LIST) for (const f of ['', '-filled']) {
    const w = f ? FILLED[m] : STROKE[m];
    t[`${m}/volume${f}`] = svg(m, w, [speaker(), wave1, wave2]);
    t[`${m}/volume-low${f}`] = svg(m, w, ['<!-- anchor: volume -->', speaker(), wave1]);
    t[`${m}/volume-none${f}`] = svg(m, w, ['<!-- anchor: volume -->', speaker()]);
    t[`${m}/volume-off${f}`] = svg(m, w, [speaker(5), '<path d="M4 4L20 20"/>']);
  }
  return setFromTexts(t);
}
test('C28: the body stays identical and in place, waves drop outside-in, volume-off is its own icon translated', () => {
  const set = volumeSet();
  const rows = Object.fromEntries(levelReport(set, set.names, 'volume').map((r) => [r.name, r]));
  assert.deepEqual(Object.keys(rows).sort(), ['volume', 'volume-low', 'volume-none', 'volume-off']);
  for (const c of rows['volume-low'].cells) assert.deepEqual([c.same, c.paths, c.anchor, c.inside, c.sharesLeft], [2, 2, 'volume', true, true]);
  for (const c of rows['volume-none'].cells) assert.deepEqual([c.same, c.paths, c.sharesLeft, c.sharesRight], [1, 1, true, false]);
  for (const c of rows['volume-off'].cells) assert.deepEqual([c.same, c.anchor ?? null, c.moved[0]], [0, null, [5, 0]]);
  const w = wavesDropped(set, 'volume', 'volume-low', 24);
  assert.deepEqual([w.body, w.kept, w.dropped, w.outsideIn], [true, 1, 1, true]);
  const inside = wavesDropped(set, 'volume', 'volume-none', 24);
  assert.deepEqual([inside.kept, inside.dropped, inside.outsideIn], [0, 2, true], 'with no wave kept there is nothing to be inside of');
});
test('C28 negatives: a member that keeps the outer wave is not outside-in; one that leaves the full member\'s box is not inside it', () => {
  const t = Object.fromEntries([...volumeSet().files].map(([k, v]) => [k, v.text]));
  for (const m of MASTER_LIST) for (const f of ['', '-filled']) {
    const w = f ? FILLED[m] : STROKE[m];
    t[`${m}/volume-odd${f}`] = svg(m, w, ['<!-- anchor: volume -->', speaker(), wave2]);
    t[`${m}/volume-wide${f}`] = svg(m, w, ['<!-- anchor: volume -->', speaker(), wave1, '<path d="M20 4A12 12 0 0 1 20 20"/>']);
  }
  const set = setFromTexts(t);
  assert.equal(wavesDropped(set, 'volume', 'volume-odd', 24).outsideIn, false, 'the inner wave is dropped and the outer one kept');
  assert.equal(wavesDropped(set, 'volume', 'volume-low', 24).outsideIn, true);
  const rows = Object.fromEntries(levelReport(set, set.names, 'volume').map((r) => [r.name, r]));
  assert.ok(rows['volume-wide'].cells.every((c) => c.inside === false), 'its ink runs past volume\'s right edge');
  assert.ok(rows['volume-low'].cells.every((c) => c.inside === true));
});
test('names that say an amount or a state are found by their tokens', () => {
  const hits = amountScan(['volume-low', 'battery-full', 'plus', 'toggle-off', 'signal']);
  assert.deepEqual(hits.map((h) => h.name), ['volume-low', 'battery-full', 'toggle-off', 'signal']);
  assert.deepEqual(hits[0], { name: 'volume-low', words: ['low'], stems: ['volume'] });
});

// ── §6 boxes ─────────────────────────────────────────────────────────────────────────────────────────────
test('a run keeps one ink box when every member measures the same; the keyline it sits on is named', () => {
  const sq = (m, L) => svg(m, STROKE[m], [`<path d="M${12 - (L - STROKE[m]) / 2} ${12 - (L - STROKE[m]) / 2}h${L - STROKE[m]}v${L - STROKE[m]}h-${L - STROKE[m]}Z"/>`]);
  const t = {};
  const box = { 24: 18, 20: 14, 16: 12 };
  for (const m of MASTER_LIST) for (const [n, L] of [['sq', box[m]], ['sq-2', box[m]], ['wob', box[m]], ['wob-2', box[m] - 2]]) { t[`${m}/${n}`] = sq(m, L); t[`${m}/${n}-filled`] = sq(m, L); }
  const set = setFromTexts(t);
  const rows = Object.fromEntries(runBoxes(set, set.names).map((r) => [r.stem, r]));
  assert.equal(rows.sq.kind, 'one');
  assert.equal(rows.sq.keyline, 'square');
  assert.equal(rows.wob.kind, 'none');
  assert.deepEqual(rows.wob.outline, [2, 2, 2]);
  assert.equal(boxesReport(set, set.names).one.length, 1);
  assert.equal(keylineOf(24, 18, 18), 'square');
  assert.equal(keylineOf(16, 14, 14), 'circle');
  assert.equal(keylineOf(24, 20, 19.499), null, 'a thousandth past half a unit is no match (a tolerance of 0.51, or 0.6, would take it)');
  assert.equal(keylineOf(24, 20, 19.45), null, 'nor 0.55 off');
  assert.equal(keylineOf(24, 20, 19.5), 'circle', 'exactly half a unit off still matches: lint\'s test is <= 0.5 (a tolerance of 0.45 would lose it)');
  assert.equal(keylineOf(24, 18.4, 17.6), 'square', 'within 0.5, as lint reads it');
  assert.equal(keylineOf(24, 18, 18, { MASTERS: { 24: { keylines: { square: [14, 14], circle: [18, 18] } } } }), 'circle', 'the keylines are the spec\'s, not a constant');
});

test('one box, two definitions: the same 2 dp box exactly, or within lint\'s 0.01', () => {
  assert.deepEqual(spreadOf([{ w: 18, h: 18 }, { w: 18.01, h: 18 }]), [1, 0]);
  assert.equal(withinTolerance([{ w: 18, h: 18 }, { w: 18.01, h: 17.99 }]), true, '0.01 each way is within');
  assert.equal(withinTolerance([{ w: 18, h: 18 }, { w: 18.02, h: 18 }]), false, '0.02 is not');
  assert.equal(withinTolerance([{ w: 18.0038, h: 18.0038 }, { w: 17.9954, h: 17.9954 }, { w: 18.0086, h: 18.0086 }]), true, 'exact boxes 0.0132 apart round to 18.00 · 18.00 · 18.01, which is 0.01 apart');
  // a run whose members are 0.0132 apart at 24 and identical at 20 and 16, and one that is 0.02 apart
  const sq = (m, L) => svg(m, STROKE[m], [`<path d="M${12 - (L - STROKE[m]) / 2} ${12 - (L - STROKE[m]) / 2}h${L - STROKE[m]}v${L - STROKE[m]}h-${L - STROKE[m]}Z"/>`]);
  const lens = { q: [[18.0038, 14, 12], [17.9954, 14, 12], [18.0086, 14, 12]], far: [[18, 14, 12], [18.03, 14, 12]] };
  const tx = {};
  for (const [stem, list] of Object.entries(lens)) list.forEach((L, i) => MASTER_LIST.forEach((m, j) => {
    const name = i === 0 ? stem : `${stem}-${i + 1}`;
    tx[`${m}/${name}`] = sq(m, L[j]); tx[`${m}/${name}-filled`] = sq(m, L[j]);
  }));
  const set = setFromTexts(tx), rows = Object.fromEntries(runBoxes(set, set.names).map((r) => [r.stem, r]));
  assert.deepEqual([rows.q.outline[0], rows.q.kind, rows.q.tolKind], [2, 'some', 'one'], 'at 24 the 2 dp boxes are two (18.00 and 18.01); within 0.01 they are one');
  assert.deepEqual([rows.far.kind, rows.far.tolKind], ['some', 'some'], '0.03 apart is two boxes under either definition');
  const b = boxesReport(set, set.names);
  assert.deepEqual([b.one.length, b.tolerant.one.length, b.tolerant.at], [0, 1, [1, 2, 2]]);
  assert.deepEqual(b.tolerant.flips.map((f) => [f.stem, f.master, f.spread]), [['q', 24, [1, 1]]], 'only the run that the two definitions part on is listed');
  assert.deepEqual(partitionBoxes(set, set.names).tolerant.at24, 1);
});

// ── the pin ──────────────────────────────────────────────────────────────────────────────────────────────
const haveCommit = () => spawnSync('git', ['-C', REPO, 'cat-file', '-e', `${PIN}^{commit}`]).status === 0;
let pinDir = null;
function pin() {
  if (!pinDir) {
    pinDir = mkdtempSync(join(tmpdir(), 'families-pin-'));
    execFileSync('sh', ['-c', `git -C "${REPO}" archive ${PIN} | tar -x -C "${pinDir}"`]);
  }
  return pinDir;
}
after(() => { if (pinDir) rmSync(pinDir, { recursive: true, force: true }); });

test('the pin: the grammar card\'s partition is reproduced, the runs and their two gaps, the tags, the twins', (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const set = loadSet(pin());
  const c = censusReport(set);
  assert.deepEqual([c.concepts, c.files, c.perConcept.min, c.perConcept.max, c.orphans], [485, 2910, 6, 6, 0]);
  assert.deepEqual(c.roles, { unnumbered: 147, numbered: 286, sized: 40, figureWord: 12 });
  assert.deepEqual(c.grammar, { stems: 125, families: 105, singletons: 20, marks: 9, markConcepts: 87, objectFamilies: 96, objectConcepts: 378, tableFamilies: 105, tableMatches: 105 }, 'findings-grammar.md §2.1');
  assert.equal(c.mine.stems, 128);
  assert.deepEqual(c.nameFaults, []);
  const r = runsReport(set.names);
  assert.equal(r.runs.length, 107);
  assert.deepEqual(r.gapped.map((x) => [x.stem, x.gaps]), [['check-circle', [2]], ['trash', [2, 3, 4]]]);
  assert.deepEqual(r.lengths, { 2: 17, 3: 40, 4: 31, 5: 9, 6: 5, 7: 3, 8: 1, 11: 1 });
  const tg = tagsReport(set, set.names);
  assert.deepEqual([tg.withTags.length, tg.without.length, tg.mixed.length, tg.variants, tg.variantsWithTags], [468, 17, 0, 286, 286]);
  assert.deepEqual([tg.identical.length, tg.identicalRuns.length, tg.identicalConcepts.length, tg.noOwn.length], [14, 10, 22, 6]);
  assert.deepEqual(tg.faults.map((f) => f.name), ['sort-alpha-descending-2', 'sort-alpha-descending-3']);
  assert.deepEqual(tg.usersLacking, ['users-4', 'users-4-behind', 'users-4-level', 'users-4-wide']);
  assert.deepEqual([tg.against.length, tg.usersLacking.length, tg.problems.length], [23, 4, 27], 'kind 1: 22 in same-tag pairs + key-5; kind 3: the four users-4*');
  assert.deepEqual(tg.noOwn.filter((n) => !tg.identicalConcepts.includes(n)), ['key-5']);
  assert.ok(tg.faults.every((f) => tg.identicalConcepts.includes(f.name)), 'the two lying antonyms are inside the pairs');
  const id = identityReport(set, set.names);
  assert.deepEqual([id.wholeAll.length, id.wholeSome.length, id.outlineOnly.length, id.libraryTwins.length], [2, 5, 15, 9]);
  const trav = travelReport(set, set.names);
  assert.deepEqual(trav.find((s) => s.id.startsWith('check,')).differ, [2, 3, 4]);
  for (const s of trav.filter((x) => !x.id.startsWith('check,') && !x.id.startsWith('sort-alpha'))) assert.deepEqual(s.differ, [], s.id);
  assert.deepEqual(trav.find((s) => s.id.startsWith('sort-alpha')).differ, [2, 3], 'the descending pair says "ascending"');
  assert.deepEqual(tickTravel(set, 24).map((x) => x.tickIs), [['check-circle'], ['check-circle-3'], ['check-circle-4'], ['check-circle-small']]);
  const rt = ruleText(pin());
  assert.deepEqual([rt['docs/07-character.md'].hits['approval order'], rt['docs/07-character.md'].hits['numbered after the shape']], [[49], [49]], 'C9 states both sentences at docs/07-character.md:49');
  assert.deepEqual([rt['CLAUDE.md'].hits['approval order'], rt['CLAUDE.md'].hits['numbered after the shape'], rt['CLAUDE.md'].hits.C9], [[], [], [193]], 'the Settled row names C9 and carries neither sentence');
  assert.deepEqual(Object.values(rt['.claude/skills/icon/SKILL.md'].hits), [[], [], []], 'the icon skill never mentions C9');
  assert.deepEqual(checkShapes(set.names), { box: ['checkbox-2', 'checkbox-3', 'checkbox-4'], ring: ['check-circle-3', 'check-circle-3-small', 'check-circle-4', 'check-circle-4-small'] }, 'FM-1 touches 3 concepts (18 files) under (a), the ring\'s 4 (24 files) under (b)');
  const turns = layoutTurns(set, set.names);
  assert.equal(turns.length, 24, 'four constructions × two styles × three masters');
  assert.ok(turns.every((r) => r.header === 0 && r.sidebar === 0 && r.right === 0), 'C29: the regions are one drawing turned, at every master');
});

test('the pin: the 19 mark families hold C8 to the thousandth (204 steps), lint reads the same sizes, the 6 containers keep their rings', async (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const set = loadSet(pin());
  const s = sizeReport(set, set.names);
  assert.deepEqual([s.families.length, s.marks.length, s.containers.length, s.mixed.length, s.members, s.markCells, s.steps], [25, 19, 6, 0, 65, 114, 204], 'the 19 marks step; the 6 containers keep their rings (C18)');
  assert.ok(s.maxDev < 1e-6, `largest deviation ${s.maxDev}`);
  const spec = await loadSpec(pin());
  assert.equal(specEqual(spec, DEFAULT_SPEC), true, 'the pin\'s tools/masters.mjs and the working tree\'s agree today');
  assert.deepEqual(spec.SIZE_STEP, { 24: 3, 20: 2.5, 16: 2 });
  const r3 = (x) => Math.round(x * 1000) / 1000;
  const plusRow = s.marks.find((f) => f.base === 'plus').cells.filter((c) => c.style === 'outline').map((c) => [c.L.small, c.L.default, c.L.large].map(r3));
  assert.deepEqual(plusRow, [[12, 15, 18], [11, 13.5, 16], [10, 12, 14]], 'docs/07-character.md:48');
  const cont = containerReport(set, s);
  assert.equal(cont.length, 6);
  assert.ok(cont.every((f) => f.rows.every((r) => r.outline.containerSame && r.filled.containerSame)));
  const step16 = Object.fromEntries(cont.map((f) => [f.base, Math.round(f.rows.find((r) => r.master === 16).outline.step * 1000) / 1000]));
  assert.deepEqual(step16, { 'check-circle': 0.88, 'check-circle-3': 0.72, 'check-circle-4': 0.78, 'minus-circle': 1, 'plus-circle': 1, 'x-circle': 0.5 });
  const l = await lintReading(set, pin(), s);
  assert.equal(l.files, 390);
  assert.ok(l.maxDiff < 1e-9);
  assert.equal(l.warned.length, 0);
  assert.deepEqual(l.innerRead, { outline: 36, filled: 0, of: 36 });
  assert.ok(l.probe.length === 6 && l.probe.every((p) => p.warnings.length === 0), 'checkbox-4 is a lawful checkbox-small');
});

test('the pin: the grid is full, the sheet queues no size and no number, the figures page dashes nothing, volume follows C28', (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const set = loadSet(pin());
  const g = gridReport(set, set.names);
  assert.deepEqual([g.files, g.expected, g.missing.length, g.orphans.length, g.noDefault.length, g.asym.length, g.bare.length], [2910, 2910, 0, 0, 0, 0, 0]);
  const sheet = sheetReport(parseSheet(readSheet()), set.names);
  assert.deepEqual([sheet.rows, sheet.done, sheet.open, sheet.withBase, sheet.shipped, sheet.queuedBase, sheet.noBase], [834, 485, 349, 133, 110, 23, 216]);
  assert.deepEqual([sheet.sized.length, sheet.numbered.length, sheet.doneNotInSet.length, sheet.setNotDone.length], [0, 0, 0, 0]);
  assert.deepEqual(sheet.bases.slice(0, 5).map((b) => [b.base, b.shapes, b.relatives.length]), [['user', 4, 12], ['file', 1, 9], ['phone', 1, 6], ['text', 4, 6], ['folder', 3, 5]]);
  assert.deepEqual([sheet.bases.length, sheet.basesMultiShape.length, sheet.bases.filter((b) => b.shapes === 1).map((b) => b.base)], [55, 47, ['file', 'phone', 'eye', 'face-smile', 'minus', 'plus', 'star', 'x']]);
  assert.deepEqual(sheet.styleWords.map((x) => x.name).sort(), ['chart-bar-horizontal', 'chart-bar-stacked', 'check-circle-dashed', 'collapse-horizontal', 'expand-horizontal', 'play-circle-dotted', 'rotate-ccw-dotted']);
  assert.deepEqual([sheet.styleWords.length, sheet.styleWords.filter((x) => x.baseShips).length, sheet.styleNoBase, sheet.nearStyle.length], [7, 4, ['flip-horizontal', 'flip-vertical'], 7]);
  assert.deepEqual(sheet.nearStyle.map((x) => x.name).sort(), ['eye-closed', 'folder-open', 'mail-open', 'viewport-narrow', 'viewport-short', 'viewport-tall', 'viewport-wide']);
  const html = readFile('lab/figures.html');
  const f = figureReport(set, set.names, html);
  assert.deepEqual([f.page.figures.length, f.page.cells.flat().length, f.page.shipped, f.page.missing.length], [4, 20, 20, 0]);
  assert.equal(figuresPage(set.names, { ...f.def, words: [...f.def.words, 'heads'] }).missing.length, 4);
  assert.deepEqual(f.heads, []);
  assert.deepEqual(Object.fromEntries(f.arrangement.map((a) => [a.word, a.distinct])), { '(default)': ['18×18 · 14×14 · 12×12'], behind: ['18×18 · 14×14 · 12×12'], level: ['20×16 · 16×12 · 14×10'], wide: ['20×16 · 16×12 · 14×10'] });
  assert.deepEqual(f.figureBoxes.map((b) => b.boxes[0]), ['16×20', '16×20', '16×20', '18×18']);
  const lv = Object.fromEntries(levelReport(set, set.names, 'volume').map((r) => [r.name, r]));
  assert.deepEqual(Object.keys(lv).sort(), ['volume', 'volume-low', 'volume-minus', 'volume-none', 'volume-off', 'volume-plus', 'volume-x']);
  for (const n of ['volume-low', 'volume-none', 'volume-x', 'volume-plus', 'volume-minus']) {
    assert.ok(lv[n].cells.every((c) => c.anchor === 'volume' && c.inside && (c.sharesLeft || c.sharesRight) && c.same >= 1), n);
  }
  assert.ok(lv['volume-off'].cells.filter((c) => c.style === 'outline').every((c) => c.moved.length === 1 && c.moved[0][1] === 0 && !c.anchor));
  for (const m of MASTER_LIST) assert.deepEqual([wavesDropped(set, 'volume', 'volume-low', m).kept, wavesDropped(set, 'volume', 'volume-low', m).outsideIn], [1, true]);
});

test('the pin: 51 of 107 runs keep one ink box, 4 some, 52 none; the plan\'s five named families keep none', (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const set = loadSet(pin());
  const b = boxesReport(set, set.names);
  assert.deepEqual([b.rows.length, b.one.length, b.some.length, b.none.length], [107, 51, 4, 52]);
  assert.deepEqual(b.oneKinds, { 'named keyline': 43, 'agreed box': 7, mark: 1 });
  assert.deepEqual(b.filledDiffers, ['bell', 'globe', 'language']);
  for (const stem of ['menu', 'chevron-up', 'list-bullet', 'arrow-up', 'sort']) assert.deepEqual([b.rows.find((r) => r.stem === stem).kind, b.rows.find((r) => r.stem === stem).tolKind], ['none', 'none'], `${stem}: no one box, under either definition`);
  assert.deepEqual([b.heldW.length, b.heldH.length, b.heldNeither.length], [14, 7, 35]);
  assert.deepEqual([b.rows.filter((r) => r.outline[0] === 1).length, b.rows.filter((r) => r.outline[1] === 1).length, b.rows.filter((r) => r.outline[2] === 1).length], [52, 52, 55], 'definition A (the same 2 dp box exactly): one box at 24 alone, 20 alone, 16 alone');
  const tl = b.tolerant;
  assert.deepEqual([tl.one.length, tl.some.length, tl.none.length, ...tl.at], [53, 2, 52, 53, 54, 55], 'definition B (within lint\'s 0.01): the 53 of card 1.16, counted at 24, is also the count at all three masters');
  assert.deepEqual(tl.flips.map((f) => `${f.stem}@${f.master}`), ['cursor@24', 'cursor@20', 'home@20'], 'the runs the two definitions part on');
  assert.ok(tl.flips.every((f) => f.spread.every((d) => d <= 1)), 'none is more than 0.01 apart at 2 dp');
  assert.deepEqual(Object.fromEntries(Object.entries(tl.byKind).map(([k, v]) => [k, [v.runs, v.A, v.B]])), { marks: [20, 1, 2], 'silhouette or agreed box': [82, 50, 51], mixed: [5, 0, 0] });
  assert.deepEqual([tl.held.rest, tl.held.W.length, tl.held.H.length, tl.held.neither.length], [54, 13, 7, 34], 'under B the 54 that do not keep one box: 13 hold the width, 7 the height, 34 neither (A: 56 · 14 · 7 · 35)');
  assert.deepEqual([...b.heldW, ...b.heldH].filter((n) => !tl.held.W.includes(n) && !tl.held.H.includes(n)), ['home'], 'home holds its width at 2 dp exactly under A; under B it keeps one box and leaves the group');
  assert.deepEqual(partitionBoxes(set, set.names).tolerant.one.length, 52, 'over the grammar partition, B: 52 of 105 (A: 50)');
  assert.equal(partitionBoxes(set, set.names, { unfoldCircles: true }).tolerant.one.length, 55);
});

test('the CLI prints a section for a pin directory and refuses an unknown one', (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const out = execFileSync('node', [join(HERE, 'families.mjs'), pin(), 'census'], { encoding: 'utf8' });
  assert.match(out, /files 2910 · concepts 485/);
  assert.match(out, /geometry spec \(SIZE_STEP 3 · 2\.5 · 2;.*identical to the working tree's tools\/masters\.mjs: true/);
  assert.match(out, /125 stems = 105 families \+ 20 singletons; 9 mark families \(87 concepts\); 96 object families, 378 concepts/);
  const bad = spawnSync('node', [join(HERE, 'families.mjs'), pin(), 'nonsense'], { encoding: 'utf8' });
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /unknown section nonsense/);
});

function readFile(rel) { return readFileSync(join(pin(), rel), 'utf8'); }
function readSheet() { return readFile('research/queue.md'); }
