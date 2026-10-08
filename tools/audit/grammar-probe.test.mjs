// Tests for grammar-probe.mjs (audit card 1.9's reprint). Synthetic fixtures only: hand-built paths, a tiny fake pin
// made with mkdtempSync, a tiny synthetic sheet. Nothing here reads the real pin, research/ or the network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  parseIcon, setOf, inkBox, union, polyDist, minDist, air, airToArea, mirrorX, turn90, sameShape, residual, residualRaw,
  stemOf, legTurn, SELECT, measureComposite, categorise, familyCensus, bodyPairsAtSomeMasters, pairReuse, stackOf,
  sheetRows, sheetCensus, longestCommon, lineLength, derivedComposites, sharedParts, PX16,
  airGroups, brokenConcepts, narrowHeadCarriers, slotWidth, channel, wordOf, CARD_BADGE_ROWS, CARD_GREP_WORDS, STRIKE_WORDS, ENCLOSURE_WORDS,
} from './grammar-probe.mjs';

const PROBE = join(dirname(fileURLToPath(import.meta.url)), 'grammar-probe.mjs');
const svg = (paths, sw = 1.5) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}">\n${paths.map((p) => (typeof p === 'string' ? `  <path d="${p}"/>` : `  <path d="${p.d}" fill="currentColor" stroke="none"/>`)).join('\n')}\n</svg>\n`;
const icon = (m, file, paths, extra = '') => parseIcon(svg(paths, m === 16 ? 1.25 : 1.5).replace('<path', `${extra}<path`), m, file);
const filesOf = (list) => new Map(list.map((f) => [`${f.master}/${f.name}${f.filled ? '-filled' : ''}`, f]));
// the instrument defect's own case: a rounded square, and the same square walked the other way round
const RING = 'M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z';
const RING_REV = 'M17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z';

test('ink box grows a line by half its stroke; an area path keeps its edge', () => {
  const b = inkBox('M2 12H12', 1.5);
  assert.deepEqual([b.x0, b.y0, b.w, b.h], [1.25, 11.25, 11.5, 1.5]);
  const a = inkBox('M2 2H6V6H2Z', 1.5, true);
  assert.deepEqual([a.w, a.h], [4, 4]);
  assert.equal(union([b, a]).x1, 12.75);
});

test('air is the centreline gap minus the stroke; negative is overlap; a solid takes half a stroke', () => {
  assert.equal(Math.round(minDist(['M2 10H12'], ['M2 13H12']) * 1000) / 1000, 3);
  assert.equal(Math.round(air(['M2 10H12'], ['M2 13H12'], 1.5) * 1000) / 1000, 1.5);
  assert.equal(Math.round(air(['M2 10H12'], ['M7 5V15'], 1.5) * 1000) / 1000, -1.5);
  assert.equal(Math.round(airToArea(['M2 10H12'], ['M2 13H12V15H2Z'], 1.5) * 1000) / 1000, 2.25);
  // a long hop between two samples is a jump between subpaths, not ink: the point beside the gap's middle is far
  assert.ok(polyDist([[5, 0]], [[0, 0], [10, 0]]) > 4.9);
});

test("stems follow card 1.9's rule: the compound objects whole, else the first word", () => {
  assert.equal(stemOf('sort-alpha-ascending-2'), 'sort-alpha');
  assert.equal(stemOf('login-3'), 'login');
  assert.equal(stemOf('arrow-up-right-5'), 'arrow-up-right');
  assert.equal(stemOf('layout-sidebar-right-4'), 'layout-sidebar-right');
  assert.equal(stemOf('volume-off'), 'volume');
});

test('a mirror and a quarter turn re-emit the shape, and only the shape', () => {
  const L = 'M4 4V10H8';
  assert.ok(sameShape(mirrorX(L, 24), 'M20 4V10H16'));
  assert.ok(!sameShape(mirrorX(L, 24), L));
  assert.ok(sameShape(turn90('M4 4V10H8'), 'M4 -4H10V-8'));     // an L turned a quarter, not mirrored
  assert.ok(!sameShape(turn90('M4 4V10H8'), 'M-4 -4H-10V-8'));
  assert.ok(sameShape(mirrorX('M4 6A2 2 0 0 1 8 6', 24), 'M20 6A2 2 0 0 0 16 6'));
});

test('a rounded square walked the other way: the raw compare says ∞, the canonical workaround says 0', () => {
  assert.equal(residualRaw(RING, RING_REV), Infinity);
  assert.equal(residual(RING, RING_REV), 0);
  assert.ok(Math.abs(residual('M2 2H10', 'M2 2H10.25') - 0.125) < 1e-9);
});

test('a head is two legs about 90° apart', () => {
  assert.equal(Math.round(legTurn('M6 10L11 5A0.75 0.75 0 0 1 12 5L17 10')), 90);
  assert.equal(legTurn('M6 10L12 4'), null);
});

test('a composite: the modifier beside its base, measured as the card measured it', () => {
  const f = icon(24, 'thing-plus.svg', ['M3 6H11V18H3Z', 'M17 9V15', 'M14 12H20']);
  const set = setOf(filesOf([f]));
  const r = measureComposite(set, { n: 'thing-plus', kind: 'beside', sel: SELECT.firstBase }, 24, null);
  assert.equal(Math.round(r.air * 1000) / 1000, 1.5);          // 14 − 11 − 1.5
  assert.equal(r.toBound, 22 - 20.75);                          // right edge 20.75 against the bound 22
  assert.equal(r.dx, 17 - 12);
  assert.equal(Math.round(r.share * 100) / 100, Math.round((7.5 / 13.5) * 100) / 100);
});

test('the arrow selector takes the head and the shaft that lands on it', () => {
  const f = icon(24, 'sort-x.svg', ['M3 6H9', 'M3 12H9', 'M14 8L17 5A0.75 0.75 0 0 1 18 5L21 8', 'M17.5 5V19']);
  const { mod, base } = SELECT.arrow(f);
  assert.deepEqual(mod, [2, 3]);
  assert.deepEqual(base, [0, 1]);
});

test("the body categories in the card's order; a pair of two bodies is 'all but one' unless moved as the document did", () => {
  const fam = (n, groups) => ({ stem: 'a', n, members: groups.flat(), m: Object.fromEntries([24, 20, 16].map((m) => [m, { groups }])) });
  assert.equal(categorise(fam(3, [['a', 'a-2', 'a-3']])), 'all');
  assert.equal(categorise(fam(2, [['a'], ['a-2']])), 'allButOne');
  assert.equal(categorise(fam(2, [['a'], ['a-2']]), { pairsAsDifferent: true }), 'allDiff');
  assert.equal(categorise(fam(3, [['a'], ['a-2'], ['a-3']])), 'allDiff');
  assert.equal(categorise(fam(3, [['a', 'a-2'], ['a-3']])), 'allButOne');
  assert.equal(categorise(fam(4, [['a', 'a-2'], ['a-3', 'a-4']])), 'twoWays');
  const mixed = { stem: 'a', n: 3, members: ['a', 'a-2', 'a-3'], m: { 24: { groups: [['a', 'a-2'], ['a-3']] }, 20: { groups: [['a'], ['a-2'], ['a-3']] }, 16: { groups: [['a', 'a-2', 'a-3']] } } };
  assert.equal(categorise(mixed), 'rest');
});

test('families, bodies at some masters only, and the cross-family core on a tiny set', () => {
  const list = [];
  for (const m of [24, 20, 16]) {
    list.push(icon(m, 'box.svg', ['M4 4H20V20H4Z']));
    list.push(icon(m, 'box-2.svg', [m === 20 ? 'M4 4H20V20.5H4Z' : 'M4 4H20V20H4Z', 'M4 12H20']));
    list.push(icon(m, 'box-4.svg', ['M4 4H20V20H4Z']));
    list.push(icon(m, 'plus.svg', ['M12 4V20', 'M4 12H20', 'M2 2L5 5A0.75 0.75 0 0 1 6 5L9 2']));
    list.push(icon(m, 'box-3.svg', ['M5 5H19V19H5Z', 'M2 2L5 5A0.75 0.75 0 0 1 6 5L9 2']));
  }
  const set = setOf(filesOf(list));
  const census = familyCensus(set);
  const box = census.find((f) => f.stem === 'box');
  assert.deepEqual(box.members, ['box', 'box-2', 'box-3', 'box-4']);
  // box-4 is box at all three masters, so it is not "some masters only"; box-2 drifts 0.25 at 20
  assert.deepEqual(bodyPairsAtSomeMasters(census).map((p) => `${p.a}/${p.b}@${p.at.join('+')}`), ['box/box-2@24+16', 'box-2/box-4@24+16']);
  const A = sharedParts(set);
  const D = derivedComposites(A);
  assert.deepEqual(Object.keys(D), ['box-3']);                 // carries plus's bent part exactly; box-2's shared line is trivial
});

test('pair reuse counts exact, mirrored and leftover parts; trivial lines are not matched', () => {
  const list = [];
  for (const m of [24, 20, 16]) {
    list.push(icon(m, 'door.svg', ['M4 4H8V20H4', 'M12 12H20']));
    list.push(icon(m, 'door-2.svg', [mirrorX('M4 4H8V20H4', m), 'M2 2H3']));
  }
  const set = setOf(filesOf(list));
  const r = pairReuse(set, 'door-2', 'door', 24);
  assert.equal(r.mirror, 1);
  assert.equal(r.exact, 0);
  assert.equal(r.trivial, 1);
  assert.equal(r.nearRawMissed, 0);
});

test('a stack: how far the back sheet shows past the front, and the air between', () => {
  const f = icon(24, 'cards.svg', ['M8 3H21V18H8Z', 'M5 7V21H17']);
  const set = setOf(filesOf([f]));
  const s = stackOf(set, 'cards', 24);
  assert.equal(Math.round(s.past.left * 100) / 100, 3);
  assert.equal(Math.round(s.past.bottom * 100) / 100, 3);
  assert.equal(Math.round(s.air * 100) / 100, 1.5);
});

test('the sheet census: the card\'s grep, the hand selection, the dropped names, a two-word modifier, bases', () => {
  const text = ['- [x] 1. `file` · A', '- [ ] 2. `file-plus` · A', '- [ ] 3. `file-minus` · A', '- [ ] 4. `alarm-clock` · A', '- [ ] 5. `mail-follow-up` · A',
    '- [~] 6. `bell-off` · A', '- [ ] 7. `stop-circle` · A', '- [ ] 8. `file` · A', '- [ ] 9. `zoom-in` · A', '- [ ] 10. `clock` · A'].join('\n');
  const rows = sheetRows(text);
  assert.equal(rows.length, 10);
  const c = sheetCensus(rows, new Set(['file']), ['file-plus', 'file-minus', 'mail-follow-up', 'user-x']);
  assert.equal(c.notApproved, 9);
  assert.equal(c.review.length, 1);
  assert.deepEqual(c.grep.map((r) => r.name).sort(), ['alarm-clock', 'bell-off', 'file-minus', 'file-plus', 'mail-follow-up', 'stop-circle', 'zoom-in']);
  assert.deepEqual(c.other.map((r) => r.name).sort(), ['alarm-clock', 'file-minus', 'file-plus', 'mail-follow-up', 'zoom-in']);
  assert.deepEqual(c.badge.map((r) => r.name).sort(), ['file-minus', 'file-plus', 'mail-follow-up']);
  assert.deepEqual(c.dropped.map((r) => r.name).sort(), ['alarm-clock', 'zoom-in']);
  assert.deepEqual(c.handMissing, ['user-x']);
  assert.equal(c.badge.find((r) => r.name === 'mail-follow-up').base, 'mail');
  assert.deepEqual(c.strike.map((r) => r.name), ['bell-off']);
  assert.deepEqual(c.enclosure.map((r) => r.name), ['stop-circle']);
  assert.deepEqual(c.perBase.file, ['file-plus', 'file-minus']);
  assert.equal(CARD_BADGE_ROWS.length, 38);
});

test("the word lists are the card's own grep, word for word, and each word bites on a sheet", () => {
  // the card's grep (toolu_01E2ZDLTTYCmY6x4RssJ785J), typed here as its regex: the probe's list must be exactly its words
  const CARD_REGEX = '-(plus|minus|x|check|off|clock|star|lock|arrow|slash|search|settings|cog|dollar|heart|user|edit|key|question|alert|warning|add|remove|cancel|sync|share|download|upload|badge|dot|notification|circle|square|up|down|left|right|in|out|open|closed|filled|list|text|code|link|pin|minus|plus)';
  const words = [...new Set(CARD_REGEX.slice(2, -1).split('|'))].sort();
  assert.deepEqual([...CARD_GREP_WORDS].sort(), words);
  assert.deepEqual(STRIKE_WORDS, ['off', 'closed']);
  assert.deepEqual(ENCLOSURE_WORDS, ['circle', 'square']);
  const text = ['- [ ] 1. `user-square` · A', '- [ ] 2. `eye-closed` · A', '- [ ] 3. `folder-open` · A', '- [ ] 4. `bell-off` · A', '- [ ] 5. `play-circle` · A',
    '- [ ] 6. `file-plus` · A', '- [ ] 7. `window-key` · A', '- [ ] 8. `heart-hand` · A'].join('\n');
  const c = sheetCensus(sheetRows(text), new Set(), ['file-plus']);
  assert.deepEqual(c.grep.map((r) => r.name).sort(), ['bell-off', 'eye-closed', 'file-plus', 'folder-open', 'play-circle', 'user-square', 'window-key']);
  assert.deepEqual(c.strike.map((r) => r.name).sort(), ['bell-off', 'eye-closed']);
  assert.deepEqual(c.enclosure.map((r) => r.name).sort(), ['play-circle', 'user-square']);
  assert.deepEqual(c.other.map((r) => r.name).sort(), ['file-plus', 'folder-open', 'window-key']);
  assert.deepEqual(c.dropped.map((r) => r.name).sort(), ['folder-open', 'window-key']);
});

test('a modifier word is read off the last word only', () => {
  assert.equal(wordOf('folder-plus', ['plus']), 'plus');
  assert.equal(wordOf('plus-circle-x', ['plus']), null);
  assert.equal(wordOf('folder-plus-open', ['plus']), null);         // a middle word is not the modifier
  assert.equal(wordOf('plus', ['plus']), null);
  assert.equal(wordOf('mail-follow-up', ['up']), 'follow-up');
});

test('the canonical residual: a square walked the other way and 0.25 taller is a small residual, not ∞', () => {
  const taller = 'M17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V18A2.5 2.5 0 0 0 6.25 20.5H17.75A2.5 2.5 0 0 0 20.25 18V6.25A2.5 2.5 0 0 0 17.75 3.75Z';
  assert.equal(residualRaw(RING, taller), Infinity);
  assert.equal(Math.round(residual(RING, taller) * 1000) / 1000, 0.139);
});

test("share is the modifier's long side over the base's; an opening is end to end minus the stroke", () => {
  const f = icon(24, 'thing-minus.svg', ['M3 6H11V18H3Z', 'M14 12H20']);
  const r = measureComposite(setOf(filesOf([f])), { n: 'thing-minus', kind: 'beside', sel: SELECT.firstBase }, 24, null);
  assert.equal(Math.round(r.share * 1000) / 1000, Math.round((7.5 / 13.5) * 1000) / 1000);
  const g = icon(24, 'door-in.svg', ['M20 4H4V20H20', 'M10 12H22']);
  const o = measureComposite(setOf(filesOf([g])), { n: 'door-in', kind: 'through', sel: SELECT.firstBase }, 24, null);
  assert.deepEqual(o.openings.map((x) => Math.round(x * 100) / 100), [14.5]);
});

test('a filled file without an area path carries FILLED_WEIGHT; one with an area keeps the outline stroke', () => {
  assert.equal(parseIcon(svg(['M4 12H20'], 2.5), 24, 'minus-filled.svg').stroke, 2.5);
  assert.equal(parseIcon(svg(['M4 12H20'], 2), 16, 'minus-filled.svg').stroke, 2);
  assert.equal(parseIcon(svg([{ d: 'M2 2H10V10H2Z' }, 'M4 12H20']), 24, 'box-filled.svg').stroke, 1.5);
  assert.equal(parseIcon(svg(['M4 12H20']), 24, 'minus.svg').stroke, 1.5);
});

test('the family near band scales with the master: 0.5 · m/24', () => {
  const list = [];
  for (const m of [24, 20, 16]) {
    list.push(icon(m, 'tile.svg', ['M4 4H20V20H4Z']));
    list.push(icon(m, 'tile-2.svg', ['M4 4H20V20.75H4Z']));      // residual 0.45: near at 24 (0.5), not at 20 (0.417)
  }
  const fam = familyCensus(setOf(filesOf(list))).find((f) => f.stem === 'tile');
  assert.equal(fam.m[24].bodyNear.length, 1);
  assert.equal(Math.round(fam.m[24].bodyNear[0].r * 100) / 100, 0.45);
  assert.equal(fam.m[20].bodyNear.length, 0);
  assert.equal(fam.m[16].bodyNear.length, 0);
});

test('the longest common string and a line length', () => {
  assert.equal(longestCommon('M4 4L16.81 4.19A1.5', 'M9 9L16.81 4.19A1.5 2'), 'L16.81 4.19A1.5');
  assert.equal(lineLength('M3 4L6 8'), 5);
  assert.equal(Math.round(PX16[24] * 1000) / 1000, 0.667);
});

test('the through air groups: exactly 1.500, just over, standing off', () => {
  const row = (a24, a20, a16) => ({ 24: { air: a24 }, 20: { air: a20 }, 16: { air: a16 } });
  const T = { a: row(1.5, 1.5, 1.5000001), b: row(1.505, 1.505, 1.578), c: row(5.175, 3.761, 3.282), d: row(1.5, 1.5, 1.49) };
  const g = airGroups(T, ['a', 'b', 'c', 'd']);
  assert.deepEqual(g.exact.map((x) => x.n), ['a']);
  assert.deepEqual(g.near.map((x) => x.n), ['b']);
  assert.deepEqual(g.off.map((x) => x.n), ['c', 'd']);
});

test('a part breaks when it is one drawing at one master and not at another', () => {
  const { broken, involved } = brokenConcepts([
    { a: 'home', b: 'store', r: [0, 0, 0.167] }, { a: 'home', b: 'home-2', r: [0, 0, 0] }, { a: 'x', b: 'y', r: [0.5, 0.5, 0.5] }, { a: 'p', b: 'q', r: [Infinity, 0, 0] },
  ]);
  assert.equal(broken.length, 2);
  assert.deepEqual(involved, ['home', 'p', 'q', 'store']);
});

test("a narrow head: an arrow whose head is no free arrow's, and the chevrons that are that head", () => {
  const list = [];
  for (const m of [24, 20, 16]) {
    list.push(icon(m, 'arrow-up.svg', ['M7 8L11.5 3.5A0.75 0.75 0 0 1 12.5 3.5L17 8', 'M12 3.75V20.25']));
    list.push(icon(m, 'pile.svg', ['M3 6H9', 'M14 8L17 5A0.75 0.75 0 0 1 18 5L21 8', 'M17.5 5V19']));          // own narrow head + shaft
    list.push(icon(m, 'pile-2.svg', ['M3 6H9', 'M5 8L9.5 3.5A0.75 0.75 0 0 1 10.5 3.5L15 8', 'M10 3.75V20.25'])); // arrow-up's head, moved
    list.push(icon(m, 'pile-3.svg', ['M3 6H9', 'M14 9L17 6A0.75 0.75 0 0 1 18 6L21 9']));                     // the narrow head as a chevron
    list.push(icon(m, 'pile-4.svg', ['M3 6H9', 'M14 9L16 7A0.75 0.75 0 0 1 17 7L19 9']));                     // a chevron of its own
  }
  const set = setOf(filesOf(list));
  const specs = ['pile', 'pile-2', 'pile-3', 'pile-4'].map((n) => ({ n, sel: SELECT.lastBase }));
  const T = {};
  for (const sp of specs) { T[sp.n] = {}; for (const m of [24, 20, 16]) T[sp.n][m] = measureComposite(set, { n: sp.n, kind: 'beside', sel: (f) => ({ base: [0], mod: f.paths.map((_, i) => i).slice(1) }) }, m, null); }
  assert.deepEqual(narrowHeadCarriers(set, T, ['pile', 'pile-2', 'pile-3', 'pile-4'], ['arrow-up']), ['pile', 'pile-3']);
});

test("a slot's width between its straight edges, and the narrowest white between two solids", () => {
  const slot = parseIcon(svg([{ d: 'M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM7.41 5.99L18.01 16.59A1 1 0 0 1 16.59 18.01L5.99 7.41A1 1 0 0 1 7.41 5.99Z' }]), 24, 'ban-2-filled.svg');
  assert.equal(Math.round(slotWidth(slot) * 1000) / 1000, 2.008);
  const two = parseIcon(svg([{ d: 'M2 2H10V10H2Z' }, { d: 'M2 11.5H10V20H2Z' }]), 24, 'pair-filled.svg');
  assert.equal(Math.round(channel(two) * 1000) / 1000, 1.5);
});

test('CLI: a section heading on a fake pin; an unknown section and a missing pin exit 2', () => {
  const pin = mkdtempSync(join(tmpdir(), 'grammar-pin-'));
  try {
    for (const m of [24, 20, 16]) {
      mkdirSync(join(pin, 'src/icons', String(m)), { recursive: true });
      writeFileSync(join(pin, 'src/icons', String(m), 'box.svg'), svg(['M4 4H20V20H4Z'], m === 16 ? 1.25 : 1.5));
      writeFileSync(join(pin, 'src/icons', String(m), 'box-2.svg'), svg(['M5 5H19V19H5Z'], m === 16 ? 1.25 : 1.5));
    }
    const outp = execFileSync(process.execPath, [PROBE, pin, 's2.1'], { encoding: 'utf8' });
    assert.match(outp, /^## §2\.1 Families, counted$/m);
    assert.match(outp, /2 concepts → 1 object stems: 1 families of two or more/);
    const run = (args) => { try { execFileSync(process.execPath, [PROBE, ...args], { stdio: 'pipe' }); return 0; } catch (e) { return e.status; } };
    assert.equal(run([pin, 'nope']), 2);
    assert.equal(run([join(pin, 'missing')]), 2);
  } finally { rmSync(pin, { recursive: true, force: true }); }
});
