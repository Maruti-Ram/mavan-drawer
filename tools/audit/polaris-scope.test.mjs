// Tests for tools/audit/polaris-scope.mjs (card 1.17).
//
// Almost everything here runs on synthetic fixtures: a tiny synonym table, hand-made Polaris name
// lists, a hand-made sheet, hand-made `audit.json` objects, a made-up bridge answer. They are built
// so the right answer is known by counting. No Figma, no gitignored file, no scratch directory.
//
// One group at the end ("tracked files") reads three files that ARE tracked — research/synonyms.mjs,
// research/sources/polaris.json, research/audit.json — and tools/audit.mjs itself. That group is the
// drift guard: the tool's matching rule is a COPY of tools/audit.mjs's (which cannot be imported — it
// writes research/ when loaded), so it fails the day the copy and the original stop being the same
// text, or the day the table / archive / audit.json stop agreeing with each other.

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  BADGE38, BADGE_TAILS, CITED, DOC06_EXPECTED, DOC06_THREE, DOC06_TWO, LUCIDE_MAPPED_TAGS, PLACEMENT_WORDS, REPO, REVISIONS, SHEET_NAME, SLOTS, STRICT_TAILS,
  assertOutsideRepo, badgeComposites, band, buildMatcher, classifyKeyHits, compareCatalogue, conceptMap, countsOf, cutOf, d23Entries, diffNames, diffRanking, entrantBases,
  fluentPageReport, fnv, heldBack, kebab, keyTotals, liveFrom, matchesDoc06, missingFrom, nameCounts, normalise, parseArgs, parseSheet, pinDrawn, placementOf, rankedHeadings,
  renameLeads, repoMatcher, rowMap, runRerank, shapeLive, sheetFacts, sheetIndex, shopifyRiders, slotLeads, tailOf, tailTable, trackedGrep, unwrapCapture, words,
} from './polaris-scope.mjs';

const SCRIPT = join(REPO, 'tools/audit/polaris-scope.mjs');
const run = (args) => spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8' });

// A small synonym table in the real file's format: canonical first, then aliases; `source:raw` for a
// name that means something different in one set.
const CONCEPTS = {
  arrows: `
    arrow-up-right      arrow-diagonal
    arrow-down-circle   down-circle
    chevron-down-circle
  `,
  ui: `
    x                   xmark close
    trash               polaris:delete
    zap                 bolt-lightning nucleo:bolt
    columns             layout-column layout-columns
    home                house
  `,
  files: `
    file                page
    file-plus           page-add
  `,
};
const PLATFORM = 'sidekick domain';
const M = buildMatcher({ CONCEPTS, PLATFORM });
const P = (raw) => M.resolve('polaris', raw);

// ── the counting rule ────────────────────────────────────────────────────────────────────────

test('kebab splits camel case the way tools/audit.mjs does', () => {
  assert.equal(kebab('AlertCircle'), 'alert-circle');
  assert.equal(kebab('XSmall'), 'x-small');
  assert.equal(kebab('LogoX'), 'logo-x');
  assert.equal(kebab('QRCode'), 'qr-code');
  assert.equal(kebab('LayoutColumns2'), 'layout-columns2');
  assert.equal(kebab('circle-chevron-down'), 'circle-chevron-down', 'a kebab name is unchanged by kebab — live names rely on it');
});

test('normalise drops digits and `-small`, turns slash into off, and moves a leading container to the end', () => {
  const cases = {
    'layout-column1': 'layout-column', 'check-small': 'check', 'circle-chevron-down': 'chevron-down-circle', 'bell-slash': 'bell-off',
    'house-5': 'house', '1x1': '1x1', 'x-small': 'x', small: 'small', 'circle-down': 'down-circle', 'square-plus': 'plus-square',
    'a-b-2-small': 'a-b', 'pencil-ruler2': 'pencil-ruler',
  };
  for (const [raw, want] of Object.entries(cases)) assert.equal(normalise(raw), want, raw);
});

test('resolve: a source-specific alias beats a generic one, generic aliases follow normalise, anything else stands for itself', () => {
  assert.equal(P('circle-chevron-down'), 'chevron-down-circle', 'container moved, then it is the concept');
  assert.equal(P('circle-down'), 'arrow-down-circle', 'moved to down-circle, which the table maps');
  assert.equal(P('arrow-diagonal'), 'arrow-up-right');
  assert.equal(P('delete'), 'trash', 'polaris:delete');
  assert.equal(M.resolve('nucleo', 'delete'), 'delete', 'the same raw name in another set is not the trash can');
  assert.equal(P('bolt'), 'bolt', 'only nucleo:bolt is zap');
  assert.equal(M.resolve('nucleo', 'bolt'), 'zap');
  assert.equal(P('x-small'), 'x');
  assert.equal(P('layout-column1'), 'columns');
  assert.equal(P('page-add'), 'file-plus');
  assert.equal(P('something-new'), 'something-new');
});

test('the table refuses what tools/audit.mjs refuses: a concept listed twice, an alias claimed twice', () => {
  assert.throws(() => buildMatcher({ CONCEPTS: { a: 'x\n', b: 'x\n' }, PLATFORM: '' }), /listed twice/);
  assert.throws(() => buildMatcher({ CONCEPTS: { a: 'x  close\n', b: 'y  close\n' }, PLATFORM: '' }), /claimed by x and y/);
});

test('Shopify-only and logo concepts are told apart, and a logo that is in the table is not a logo', () => {
  assert.ok(M.isPlatform('sidekick') && !M.isPlatform('home'));
  assert.ok(M.isBrand('logo-x') && !M.isPlatform('logo-x'));
  const withLogo = buildMatcher({ CONCEPTS: { a: 'logo-y\n' }, PLATFORM: '' });
  assert.ok(!withLogo.isBrand('logo-y'));
  assert.ok(M.inTable('home') && !M.inTable('bolt'));
});

test('nameCounts: names collapse into concepts, twins add drawings, the two filters are counted apart', () => {
  const names = ['x', 'x-small', 'delete', 'sidekick', 'logo-x', 'bolt', 'page', 'file'];
  const c = nameCounts(names, 3, M);
  assert.equal(c.names, 8);
  assert.equal(c.twins, 3);
  assert.equal(c.drawings, 11);
  assert.equal(c.concepts, 6, 'x+x-small and page+file each fold into one');
  assert.equal(c.platform, 1);
  assert.equal(c.logos, 1);
  assert.equal(c.rest, 4);
  assert.deepEqual(c.byC.get('x'), ['x', 'x-small']);
});

test('conceptMap keeps each raw name once, in the order met', () => {
  const m = conceptMap(['page', 'file', 'page'], P);
  assert.deepEqual(m.get('file'), ['page', 'file']);
});

// ── live against archive ─────────────────────────────────────────────────────────────────────

test('diffNames sorts every name that is on one side only: respelled, folded, gone, new', () => {
  const archive = ['circle-down', 'x', 'x-small', 'sidekick', 'layout-column1', 'home', 'bolt'];
  const live = ['arrow-down-circle', 'x', 'layout-column-1', 'home', 'house', 'zap', 'eraser'];
  const d = diffNames(archive, live, P);
  assert.deepEqual(d.same, ['x', 'home']);
  const kinds = (xs) => Object.fromEntries(xs.map((x) => [x.name, x.kind]));
  assert.deepEqual(kinds(d.archiveOnly), { 'circle-down': 'respelled', 'x-small': 'folded', sidekick: 'gone', 'layout-column1': 'respelled', bolt: 'gone' });
  assert.deepEqual(kinds(d.liveOnly), { 'arrow-down-circle': 'respelled', 'layout-column-1': 'respelled', house: 'folded', zap: 'new', eraser: 'new' });
  assert.deepEqual(d.goneConcepts.sort(), ['bolt', 'sidekick']);
  assert.deepEqual(d.newConcepts.sort(), ['eraser', 'zap']);
  assert.equal(d.arcByC.size - d.goneConcepts.length + d.newConcepts.length, d.liveByC.size, 'archive − gone + new = live, in concepts');
});

test('renameLeads pairs a gone concept with a new one only when a whole word is shared', () => {
  const d = diffNames(['catalog', 'globe-eu', 'inbound'], ['catalog-product', 'globe-europe', 'order-batches'], P);
  const leads = renameLeads(d);
  assert.deepEqual(leads.map((l) => [l.gone, l.now]).sort(), [['catalog', 'catalog-product'], ['globe-eu', 'globe-europe']]);
  assert.ok(!leads.some((l) => l.gone === 'inbound'), 'no word in common, no lead');
});

test('liveFrom reads a bridge answer, folds `-filled` into its base, keeps page order and notices an orphan twin', () => {
  const rows = [['1:1', 'adjust', 20, 20, '1:0'], ['1:2', 'star', 20, 20, '1:0'], ['1:3', 'star-filled', 20, 20, '1:0'], ['1:4', 'lonely-filled', 20, 20, '1:0']];
  const l = liveFrom({ kind: 'polaris-live-list/1', rows, counts: {}, top: [] });
  assert.equal(l.kind, 'bridge');
  assert.deepEqual(l.names, ['adjust', 'star', 'lonely']);
  assert.equal(l.drawings, 4);
  assert.deepEqual([...l.twins].sort(), ['lonely', 'star']);
  assert.deepEqual(l.orphanTwins, ['lonely']);
});

test('liveFrom reads the catalogue: items of 2 mean a filled twin; a plain list of names works too', () => {
  const cat = { schema: 'mdx-ref/1/catalogue', at: 't', page: {}, file: {}, rows: [[null, 'a', '', 1, 1, '', 20, 20, '1:1'], [null, 'b', '', 2, 1, '', 20, 20, '1:2']] };
  const l = liveFrom(cat);
  assert.equal(l.kind, 'catalogue');
  assert.deepEqual(l.names, ['a', 'b']);
  assert.equal(l.drawings, 3);
  assert.deepEqual([...l.twins], ['b']);
  assert.deepEqual(liveFrom(['x', 'y']).names, ['x', 'y']);
  assert.throws(() => liveFrom({ nothing: 1 }), /unrecognised/);
});

test('shapeLive writes {name, filled, keywords} and refuses a name that kebab() would change', () => {
  const l = liveFrom(['alpha', 'beta', 'beta-filled']);
  assert.deepEqual(shapeLive(l), [{ name: 'alpha', filled: false, keywords: [] }, { name: 'beta', filled: true, keywords: [] }]);
  assert.throws(() => shapeLive(liveFrom(['AlertCircle'])), /changed by kebab/);
});

test('compareCatalogue: equal when names, order, first node, items and canvas agree; says exactly what differs otherwise', () => {
  const live = liveFrom({ rows: [['1:1', 'a', 20, 20, null], ['1:2', 'b', 20, 20, null], ['1:3', 'b-filled', 20, 20, null]] });
  const cat = { rows: [[null, 'a', '', 1, 1, '', 20, 20, '1:1'], [null, 'b', '', 2, 1, '', 20, 20, '1:2']] };
  const same = compareCatalogue(live, cat);
  assert.ok(same.sameOrder && !same.onlyLive.length && !same.onlyCatalogue.length && !same.fieldDiffs.length);
  assert.equal(same.liveDrawings, 3);
  assert.equal(same.catalogueDrawings, 3);
  const changed = compareCatalogue(live, { rows: [[null, 'a', '', 1, 1, '', 20, 20, '9:9'], [null, 'c', '', 1, 1, '', 20, 20, '1:2']] });
  assert.deepEqual(changed.onlyLive, ['b']);
  assert.deepEqual(changed.onlyCatalogue, ['c']);
  assert.deepEqual(changed.fieldDiffs, [{ name: 'a', field: 'id', live: '1:1', catalogue: '9:9' }]);
  assert.equal(changed.sameOrder, false);
});

// ── what the bridge hands back ───────────────────────────────────────────────────────────────

const capture = (over = {}) => {
  const rows = [['1:1', 'a', 20, 20, '1:0'], ['1:2', 'b', 20, 20, '1:0']];
  const result = { kind: 'polaris-live-list/1', file: 'f', page: { id: '1:0', name: 'p', type: 'PAGE' }, at: 't', rows, hash: fnv(rows.map((r) => r.slice(0, 4).join('|')).join('\n')), pad: 'aaaa', ...over };
  return JSON.stringify({ _mcp: 'x', success: true, result, fileContext: { fileName: 'f', fileKey: 'K' } });
};

test('fnv is the 32-bit FNV-1a the snippet runs inside Figma', () => {
  assert.equal(fnv(''), '811c9dc5');
  assert.equal(fnv('a'), 'e40c292c');
  assert.equal(fnv('foobar'), 'bf9cf968');
});

test('unwrapCapture drops the pad, keeps the rows, and checks the checksum computed in Figma', () => {
  const { list, recomputed } = unwrapCapture(capture());
  assert.equal(list.rows.length, 2);
  assert.ok(!('pad' in list));
  assert.equal(list.hash, recomputed);
  assert.equal(list.fileContext.fileKey, 'K');
  assert.throws(() => unwrapCapture(capture({ hash: '00000000' })), /checksum differs/);
  assert.throws(() => unwrapCapture(capture({ kind: 'other' })), /not a polaris-live-list/);
  assert.throws(() => unwrapCapture(JSON.stringify({ success: false, error: 'boom' })), /boom/);
});

// ── the sheet at the pin ─────────────────────────────────────────────────────────────────────

const SHEET = [
  '## D · The rest',
  '- [x] 1. `home` · UI & Layout — approved 2026-09-20',
  '- [x] 1. `home-2` · UI & Layout · variant of `home` — Low roof · approved 2026-09-20',
  '- [ ] 2. `caret-up` · Arrows & Direction',
  '- [~] 3. `thumbs-down` · Communication',
  '- [x] 4. `layout-sidebar` — added 2026-09-26 · approved 2026-09-26',
  '- [x] 5. `ghost` · UI & Layout — approved 2026-09-21',
  '- [ ] 6. `caret-up-2` · Arrows & Direction · variant of `caret-up`',
  'not a row',
].join('\n');
const TREE = ['src/icons/24/home.svg', 'src/icons/24/home-filled.svg', 'src/icons/24/home-2.svg', 'src/icons/24/home-2-filled.svg', 'src/icons/24/layout-sidebar.svg', 'src/icons/24/layout-sidebar-filled.svg'].join('\n');

test('parseSheet reads every row form: category rows, variants, rows added on request, all three marks', () => {
  const rows = parseSheet(SHEET);
  assert.equal(rows.length, 7);
  assert.deepEqual(rows.map((r) => r.st), ['x', 'x', ' ', '~', 'x', 'x', ' ']);
  assert.equal(rows[1].base, 'home');
  assert.equal(rows[0].approved, '2026-09-20');
  assert.equal(rows[4].name, 'layout-sidebar');
  assert.deepEqual(rows.map((r) => r.section), ['D', 'D', 'D', 'D', 'D', 'D', 'D'], 'each row knows its section');
  const two = parseSheet('## D · x\n- [x] 1. `a` · UI\n## E · y\n- [ ] 2. `b` — added 2026-01-01');
  assert.deepEqual(two.map((r) => r.section), ['D', 'E']);
});

test('pinDrawn turns a tree listing into the names drawn, one per concept', () => {
  assert.deepEqual([...pinDrawn(TREE)].sort(), ['home', 'home-2', 'layout-sidebar']);
});

test('sheetIndex: drawn comes from the tree, not the tick; queued, in review, absent and the odd row are told apart', () => {
  const sh = sheetIndex(parseSheet(SHEET), pinDrawn(TREE));
  assert.equal(sh.status('home'), 'drawn');
  assert.equal(sh.status('caret-up'), 'queued');
  assert.equal(sh.status('thumbs-down'), 'in review');
  assert.equal(sh.status('caret-left'), 'absent');
  assert.equal(sh.status('ghost'), 'approved, no files', 'ticked on the sheet, nothing in the tree');
  assert.deepEqual(sheetFacts(sh, 'home'), { name: 'home', n: '1', status: 'drawn', rows: 2, shipped: 2, approved: '2026-09-20', renamed: false });
  assert.equal(sheetFacts(sh, 'caret-up').rows, 2, 'a queued variant counts as a row under its base');
  assert.equal(sheetFacts(sh, 'caret-up').shipped, 0);
});

test('the sheet carries three audit concepts under another name, and sheetFacts follows that', () => {
  assert.deepEqual(SHEET_NAME, { sidebar: 'layout-sidebar', 'sidebar-right': 'layout-sidebar-right', 'volume-high': 'volume' });
  const sh = sheetIndex(parseSheet(SHEET), pinDrawn(TREE));
  const f = sheetFacts(sh, 'sidebar');
  assert.equal(f.name, 'layout-sidebar');
  assert.equal(f.status, 'drawn');
  assert.ok(f.renamed);
});

// ── the ranking, before and after ────────────────────────────────────────────────────────────

const R = (concept, o = {}) => ({ concept, category: 'ui', tier: 1, votes: 1, P: 0, N: 0, L: 1, score: 1, evidence: true, rank: 1, top: true, d23: null, names: { polaris: [], nucleo: [], lucide: [] }, nucleoUI: 0, feather: 0, ...o });
const base = {
  ranked: [
    R('keep', { P: 1, votes: 2, score: 2, rank: 1 }),
    R('loses-polaris', { P: 1, N: 0, L: 0, votes: 1, score: 1, rank: 2 }),
    R('d23-concept', { P: 0, N: 1, L: 1, votes: 2, score: 2, rank: 3, d23: ['d23-concept'] }),
    R('cut-victim', { rank: 4, top: true }),
    R('wants-in', { P: 0, N: 0, L: 1, evidence: false, rank: 6, top: false }),
    R('d23-out', { P: 0, N: 0, L: 0, votes: 0, score: 0, evidence: false, rank: 9, top: false, d23: ['d23-out'] }),
  ],
  excluded: [R('sidekick', { category: 'platform', tier: 0, P: 1, N: 0, L: 0, rank: undefined, top: false, evidence: false })],
};
const live = {
  ranked: [
    R('keep', { P: 1, votes: 2, score: 2, rank: 1 }),
    R('d23-concept', { P: 1, N: 1, L: 1, votes: 3, score: 3, rank: 2, d23: ['d23-concept'] }),
    R('wants-in', { P: 1, N: 0, L: 1, votes: 2, score: 2, evidence: true, rank: 3, top: true }),
    R('brand-new', { P: 1, N: 0, L: 0, votes: 1, score: 1, rank: 4, top: true }),
    R('cut-victim', { rank: 5, top: false }),
    R('d23-out', { P: 0, N: 0, L: 0, votes: 0, score: 0, evidence: false, rank: 9, top: false, d23: ['d23-out'] }),
  ],
  excluded: [],
};

test('diffRanking: who loses and gains Polaris, who enters and leaves the cut and why, what moves in D23', () => {
  const D = diffRanking(base, live);
  assert.deepEqual(D.lost.sort(), ['loses-polaris', 'sidekick']);
  assert.deepEqual(D.gained.sort(), ['brand-new', 'd23-concept', 'wants-in']);
  assert.deepEqual(D.entered.sort(), ['brand-new', 'wants-in']);
  assert.deepEqual(D.left.sort(), ['cut-victim', 'loses-polaris']);
  assert.deepEqual(Object.fromEntries(D.leftWhy.map((x) => [x.concept, x.why])), { 'loses-polaris': 'no vote left', 'cut-victim': 'cut at rank 5' });
  assert.deepEqual(D.beyondCut, [{ concept: 'cut-victim', rank: 5 }]);
  assert.equal(D.base.top, 4);
  assert.equal(D.live.top, 4);
  assert.equal(D.base.backed, 4, 'evidence-backed tier 1–2 before: keep, loses-polaris, d23-concept, cut-victim; wants-in has none');
  assert.equal(D.live.backed, 5, 'after: keep, d23-concept, wants-in, brand-new, cut-victim — one more than the cut lets in');
  assert.deepEqual(D.d23.changed, ['d23-concept']);
  assert.equal(D.d23.names, 2);
  assert.equal(D.d23.insideBefore, 1);
  assert.equal(D.d23.insideAfter, 1);
  assert.deepEqual(D.d23.outsideBoth, ['d23-out']);
  assert.equal(D.tierChanged.length, 0);
});

test('diffRanking sees a tier change between two concepts that exist in both runs', () => {
  const moved = { ranked: [R('keep', { tier: 3, category: 'other', P: 1, votes: 2, score: 2 })], excluded: [] };
  const was = { ranked: [R('keep', { P: 1, votes: 2, score: 2 })], excluded: [] };
  assert.deepEqual(diffRanking(was, moved).tierChanged.map((x) => x.concept), ['keep']);
});

test('band counts the score bands of a list of rows', () => {
  assert.deepEqual(band([R('a', { score: 3 }), R('b', { score: 2 }), R('c', { score: 2 }), R('d', { score: 1 })]), { 3: 1, 2: 2, 1: 1 });
  assert.equal(rowMap(base).size, 7, 'ranked and excluded are one map');
});

test('rankedHeadings reads the counts in ranked.md\'s headings and its first line', () => {
  const md = '# Ranked\n\nEvidence-backed concepts: **487** — **13 slots open** (see the end).\n\n## Arrows & Direction — 56\n\n## Held back: Tier 3 with two or more sets (29)\n\n## Excluded (131)\n';
  const h = rankedHeadings(md);
  assert.deepEqual(h.headings, [{ title: 'Arrows & Direction', n: 56 }, { title: 'Held back: Tier 3 with two or more sets', n: 29 }, { title: 'Excluded', n: 131 }]);
  assert.equal(h.backed, 487);
  assert.equal(h.slotsOpen, 13);
  assert.equal(rankedHeadings('Evidence-backed concepts: **500**.\n').slotsOpen, 0);
});

// ── composites and the lists the document states ─────────────────────────────────────────────

test('tailOf takes the longest matching tail and badgeComposites leaves out a direction word\'s own up/down', () => {
  assert.deepEqual(tailOf('email-follow-up'), { tail: 'follow-up', object: 'email' });
  assert.deepEqual(tailOf('eye-check-mark'), { tail: 'check-mark', object: 'eye' });
  assert.equal(tailOf('check'), null, 'a bare word has no object');
  const got = badgeComposites(['person-add', 'arrow-up', 'chevron-down', 'caret-up', 'thumbs-up', 'plus-circle-up', 'cart-down', 'credit-card-reader', 'folder-remove']).map((c) => c.name);
  assert.deepEqual(got, ['person-add', 'plus-circle-up', 'cart-down', 'folder-remove']);
});

test('every one of the 38 queued badge names ends in a word the strict list holds, and the strict list is inside the full one', () => {
  assert.equal(BADGE38.length, 38);
  assert.equal(new Set(BADGE38).size, 38);
  for (const n of BADGE38) assert.ok(tailOf(n, STRICT_TAILS), n);
  for (const t of STRICT_TAILS) assert.ok(BADGE_TAILS.includes(t), t);
});

test('tailTable counts last words and ignores one-word names', () => {
  const t = tailTable(['a-add', 'b-add', 'c-up', 'solo']);
  assert.deepEqual(t[0], ['add', ['a-add', 'b-add']]);
  assert.equal(t.length, 2);
});

test('missingFrom names what a cited line range no longer holds', () => {
  const doc = 'line one\n`history` · `badge` ·\n`webhook` and arrow-{up,down,left,right}-circle\nlast';
  assert.deepEqual(missingFrom(doc, 2, 3, ['history', 'badge', 'webhook', 'arrow-up-circle']), []);
  assert.deepEqual(missingFrom(doc, 2, 2, ['history', 'webhook']), ['webhook']);
  assert.deepEqual(missingFrom(doc, 4, 4, ['badge']), ['badge']);
  assert.deepEqual(missingFrom('a hash-circle b', 1, 1, ['circle']), ['circle'], 'a name inside a longer one does not count');
});

test('the lists the tool embeds have the sizes the documents give', () => {
  assert.equal(SLOTS.length, 13);
  assert.equal(DOC06_THREE.length, 39);
  assert.equal(DOC06_TWO.length, 15);
  assert.equal(REVISIONS.length, 8);
  assert.deepEqual(REVISIONS.map((r) => r.kind), ['add', 'add', 'add', 'add', 'cut', 'cut', 'merge', 'merge']);
  assert.ok(CITED.every((c) => c.names.length && c.from <= c.to));
});

test('d23Entries turns the table\'s D23 spelling into names and concepts: `close:x` is the name close, the concept x', () => {
  const e = d23Entries({ ui: 'menu close:x x', files: 'copy duplicate:copy' });
  assert.deepEqual(e.map((x) => [x.name, x.concept]), [['menu', 'menu'], ['close', 'x'], ['x', 'x'], ['copy', 'copy'], ['duplicate', 'copy']]);
  assert.deepEqual(words('  a  b\nc '), ['a', 'b', 'c']);
});

// ── the tool never writes inside the repository ──────────────────────────────────────────────

test('assertOutsideRepo refuses the repo, anything under it and a path that does not exist yet, and allows a temp directory', () => {
  assert.throws(() => assertOutsideRepo(REPO), /refusing/);
  assert.throws(() => assertOutsideRepo(join(REPO, 'research')), /refusing/);
  assert.throws(() => assertOutsideRepo(join(REPO, 'not-yet', 'there')), /refusing/);
  assert.throws(() => assertOutsideRepo(join(REPO, 'a', '..', 'research')), /refusing/);
  const t = mkdtempSync(join(tmpdir(), 'polaris-scope-'));
  try { assert.ok(assertOutsideRepo(join(t, 'x', 'y'))); } finally { rmSync(t, { recursive: true, force: true }); }
});

test('rerank and capture refuse a destination inside the repository before touching anything', () => {
  const inside = join(REPO, 'polaris-scope-test-must-not-exist');
  assert.throws(() => runRerank({ scratch: inside, live: liveFrom(['a']) }), /refusing/);
  const r = run(['rerank', '--live', join(tmpdir(), 'nothing.json'), '--scratch', inside]);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /refusing to write inside the repository/);
  assert.ok(!existsSync(inside), 'nothing was created');
  const c = run(['capture', join(tmpdir(), 'nothing.txt'), '--out', join(REPO, 'polaris-scope-test-must-not-exist.json')]);
  assert.notEqual(c.status, 0);
  assert.ok(!existsSync(join(REPO, 'polaris-scope-test-must-not-exist.json')));
});

test('the command line: an unknown section exits 2; options are read pairwise; a flag with no value is an error', () => {
  const r = run(['nonsense']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage/);
  assert.deepEqual(parseArgs(['names', '--live', 'a.json', '--all-d23']), { _: ['names'], live: 'a.json', 'all-d23': true });
  assert.throws(() => parseArgs(['names', '--live']), /needs a value/);
});

// ── end to end, on made-up files ─────────────────────────────────────────────────────────────

test('the names section on made-up archive and live files prints the counts the fixtures are built to give', () => {
  const dir = mkdtempSync(join(tmpdir(), 'polaris-scope-'));
  try {
    const archive = ['AlertCircle', 'CircleChevronDown', 'Sidekick', 'LogoX', 'Delete', 'XSmall', 'X'].map((name) => ({ name, filled: name === 'Delete', keywords: [] }));
    const liveRows = ['alert-circle', 'chevron-down-circle', 'x', 'bolt', 'bolt-filled'].map((n, i) => [`1:${i}`, n, 20, 20, '1:0']);
    writeFileSync(join(dir, 'archive.json'), JSON.stringify(archive));
    writeFileSync(join(dir, 'live.json'), JSON.stringify({ kind: 'polaris-live-list/1', rows: liveRows, counts: {}, top: [], at: 't', file: 'f', page: { id: '1:0', name: 'p' } }));
    const r = run(['names', '--archive', join(dir, 'archive.json'), '--live', join(dir, 'live.json')]);
    assert.equal(r.status, 0, r.stderr);
    const t = r.stdout;
    assert.match(t, /\| names \(outline bases[^|]*\| 7 \| 4 \|/);
    assert.match(t, /\| names with a filled twin \| 1 \| 1 \|/);
    assert.match(t, /\| drawings \(names \+ twins\) \| 8 \| 5 \|/);
    assert.match(t, /\*\*concepts\*\* after the rule \| \*\*6\*\* \| \*\*4\*\*/);
    assert.match(t, /of which Shopify-only \(PLATFORM\) \| 1 \| 0 \|/);
    assert.match(t, /of which logos \| 1 \| 0 \|/);
    assert.match(t, /same name on both sides: 2 · only in the archive: 5 · only in the live page: 2/);
    assert.match(t, /"respelled":1,"gone":3,"folded":1/);
    assert.match(t, /gone: 3 = 1 Shopify-only \+ 1 logos \+ 1 others \(`trash`\)/);
    assert.match(t, /concepts: archive 6 · live 4 · kept 3 · gone 3 · new 1 \(6 − 3 \+ 1 = 4\)/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the bridge section says the catalogue still matches when it does, and what differs when it does not', () => {
  const dir = mkdtempSync(join(tmpdir(), 'polaris-scope-'));
  try {
    const rows = [['1:1', 'a', 20, 20, '1:0'], ['1:2', 'b', 20, 20, '1:0'], ['1:3', 'b-filled', 20, 20, '1:0']];
    const hash = fnv(rows.map((r) => r.join('|').split('|').slice(0, 4).join('|')).join('\n'));
    writeFileSync(join(dir, 'live.json'), JSON.stringify({ kind: 'polaris-live-list/1', rows, hash, at: 't', file: 'f', page: { id: '1:0', name: 'p', type: 'PAGE' }, counts: { COMPONENT: 3 }, top: [{ id: '1:9', type: 'SECTION', name: '', kids: 3 }] }));
    const cat = (extra) => ({ schema: 'mdx-ref/1/catalogue', at: 'then', page: { id: '1:0', name: 'p' }, file: { name: 'f', key: 'K' }, enumerated: 2 + extra.length, rows: [[null, 'a', '', 1, 1, '', 20, 20, '1:1'], [null, 'b', '', 2, 1, '', 20, 20, '1:2'], ...extra] });
    writeFileSync(join(dir, 'cat-same.json'), JSON.stringify(cat([])));
    writeFileSync(join(dir, 'cat-diff.json'), JSON.stringify(cat([[null, 'gone', '', 1, 1, '', 20, 20, '1:7']])));
    const same = run(['bridge', '--live', join(dir, 'live.json'), '--catalogue', join(dir, 'cat-same.json')]);
    assert.equal(same.status, 0, same.stderr);
    assert.match(same.stdout, /checksum computed in Figma [0-9a-f]{8} · recomputed from the saved rows [0-9a-f]{8} · equal/);
    assert.match(same.stdout, /names after folding `-filled` into the base: 2 · drawings: 3 · names with a filled twin: 1 \(`b`\) · twins with no base: 0/);
    assert.match(same.stdout, /names: live 2 · catalogue 2 · drawings: live 3 · catalogue 3/);
    assert.ok(!/concepts/.test(same.stdout.split('## §0.3')[0].replace(/the catalogue's own word is "concepts"/, '')), 'the page holds names, not concepts');
    assert.match(same.stdout, /THE CATALOGUE STILL MATCHES THE LIVE PAGE/);
    // §0.1 prints what the bridge said about the page, the canvas of every component and the page order
    assert.match(same.stdout, /^file "f" · page 1:0 "p" \(PAGE\) · captured t$/m);
    assert.match(same.stdout, /^direct children of the page: SECTION id 1:9 holding 3$/m);
    assert.match(same.stdout, /^node counts \([^)]*\): COMPONENT 3$/m);
    assert.match(same.stdout, /^canvas of the 3 components: 20×20 ×3$/m);
    assert.match(same.stdout, /^page order is alphabetical: yes$/m);
    const diff = run(['bridge', '--live', join(dir, 'live.json'), '--catalogue', join(dir, 'cat-diff.json')]);
    assert.match(diff.stdout, /THE LIVE PAGE DIFFERS FROM THE CATALOGUE/);
    assert.match(diff.stdout, /only in the catalogue: `gone`/);
    // a page out of order, with two canvas sizes and a checksum that does not recompute, says so in so many words
    const odd = [['1:1', 'b', 20, 20, '1:0'], ['1:2', 'a', 24, 20, '1:0']];
    writeFileSync(join(dir, 'odd.json'), JSON.stringify({ kind: 'polaris-live-list/1', rows: odd, hash: 'deadbeef', at: 't', file: 'f', page: { id: '1:0', name: 'p', type: 'PAGE' }, counts: { COMPONENT: 1, COMPONENT_SET: 1 }, top: [] }));
    const o = run(['bridge', '--live', join(dir, 'odd.json'), '--catalogue', join(dir, 'no-such-catalogue.json')]);
    assert.equal(o.status, 0, o.stderr);
    assert.match(o.stdout, /^canvas of the 2 components: 20×20 ×1 · 24×20 ×1$/m);
    assert.match(o.stdout, /^page order is alphabetical: no$/m);
    assert.match(o.stdout, /checksum computed in Figma deadbeef · recomputed from the saved rows [0-9a-f]{8} · DIFFERENT/);
    assert.match(o.stdout, /^node counts \([^)]*\): COMPONENT 1 · COMPONENT_SET 1$/m);
    assert.match(o.stdout, /catalogue not on disk .*comparison skipped/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ── the fixture repository: a toy Polaris world whose answer is known ────────────────────────
//
// §2–§5 assemble their figures from the audit's own output, the sheet at the pin and the documents, so they are
// tested the way they are used: on a real git repository holding a toy set of Polaris names, the other sets' names,
// a small synonym table, the REAL tools/audit.mjs (only its cut made smaller, so the cut binds on a toy set), a
// sheet, a few drawn icons and the documents the sections cite; the tool is run on it with --repo and --pin.
// Every expected figure was worked out by hand from the fixture (the comments say how), not copied from a run.

// FIXTURE-BEGIN
const FX_CUT = 32;
const FX_CATEGORIES = {
  arrows: ['Arrows & Direction', 1], ui: ['UI & Layout', 1], files: ['Files & Folders', 1], users: ['Users & Access', 1], comms: ['Communication', 1],
  time: ['Time & Calendar', 1], status: ['Status & Feedback', 1], editing: ['Editing & Text', 1], data: ['Charts & Data', 1], commerce: ['Commerce & Payments', 2],
  media: ['Media & Playback', 2], maps: ['Maps & Location', 2], devices: ['Devices & Hardware', 2], dev: ['Development & Infra', 2], design: ['Design Tools', 2],
  other: ['Tier 3 (on demand)', 3], brands: ['Logos', 0], platform: ['Shopify-specific', 0],
};
const FX_TABLE = {
  arrows: ['chevrons-up-down select', 'caret-up', 'caret-down', 'caret-left', 'caret-right', 'chevron-down-circle'],
  ui: ['x xmark close', 'plus', 'home house', 'checkbox check-square', 'search'],
  files: ['file page', 'file-plus page-add', 'copy duplicate', 'save', 'download'],
  users: ['user person', 'user-plus person-add'],
  time: ['clock', 'history rotate-ccw-clock', 'calendar-check'],
  status: ['star', 'sparkle magic sparkles', 'info', 'help question-circle help-circle'],
  design: ['zap nucleo:bolt'],
  dev: ['webhook', 'cloud-off'],
  devices: ['wifi-off'],
  commerce: ['catalog', 'order', 'atm atm-withdrawal'],
  other: ['measurement-volume', 'gem'],
};
const FX_D23 = { arrows: 'caret-up caret-down caret-left caret-right', ui: 'close:x x plus', files: 'file copy duplicate:copy', time: 'clock history', status: 'star sparkle' };
// The archive: PascalCase, as research/sources/polaris.json is. `XSmall` folds into `x`, `Magic` is `sparkle`, `AtmWithdrawal` is `atm`,
// `CircleChevronDown` is `chevron-down-circle`, `Page` is `file`; Catalog, Order and Sidekick are Shopify-only, LogoX a logo.
const FX_ARCHIVE = ['Home', 'Checkbox', 'CaretUp', 'CaretDown', 'Select', 'X', 'XSmall', 'Duplicate', 'Save', 'Star', 'Info', 'QuestionCircle', 'Clock', 'Search', 'Plus', 'Magic', 'AtmWithdrawal', 'Catalog', 'Order', 'Sidekick', 'LogoX', 'CircleChevronDown', 'Page'];
// The live page: no Magic, AtmWithdrawal, Catalog, Sidekick, LogoX or XSmall; and new names (`order-batches` is a variant of the Shopify-only `order`,
// `catalog-product` starts with the Shopify-only `catalog`, `bag`/`joystick`/`measurement-volume-list`/`paste`/`person-list` land in Tier 3,
// `product-add` is Shopify-only, `search-add` a variant of `search`).
const FX_LIVE = ['caret-down', 'caret-up', 'checkbox', 'chevron-down-circle', 'circle-dashed', 'clock', 'clock-revert', 'bolt', 'download', 'duplicate', 'eraser', 'home', 'info', 'order', 'order-batches', 'catalog-product', 'page', 'page-add', 'calendar-check', 'person-add', 'paste', 'person-list', 'plus', 'question-circle', 'save', 'search', 'select', 'star', 'star-list', 'x', 'bag', 'measurement-volume-list', 'joystick', 'search-add', 'product-add', 'gem', 'history', 'circle', 'star-filled'];
const FX_SHEET = [
  '# Drawing queue', '', '## A · Marks', '',
  '- [x] 1. `x` · UI & Layout — approved 2026-09-17', '- [x] 1. `x-small` · UI & Layout · variant of `x` — Small · approved 2026-09-17', '- [x] 2. `plus` · UI & Layout — approved 2026-09-17',
  '', '## D · The rest, by audit rank', '',
  '- [x] 3. `home` · UI & Layout — approved 2026-09-20', '- [x] 3. `home-2` · UI & Layout · variant of `home` — Low roof · approved 2026-09-20',
  '- [x] 4. `checkbox` · UI & Layout — approved 2026-09-23', '- [x] 5. `save` · Files & Folders — approved 2026-09-23', '- [x] 6. `chevrons-up-down` · Arrows & Direction — approved 2026-09-26',
  '- [x] 7. `sparkle` · Status & Feedback — approved 2026-09-26', '- [x] 8. `copy` · Files & Folders — approved 2026-09-29',
  '- [ ] 9. `caret-up` · Arrows & Direction', '- [ ] 10. `caret-down` · Arrows & Direction', '- [ ] 11. `atm` · Commerce & Payments', '- [ ] 12. `download` · Files & Folders',
  '- [ ] 13. `file-plus` · Files & Folders', '- [ ] 14. `user-plus` · Users & Access · variant of `user`', '- [ ] 15. `calendar-check` · Time & Calendar', '- [ ] 16. `bell-plus` · Communication',
  '- [ ] 17. `cloud-off` · Development & Infra · variant of `cloud`', '- [ ] 18. `wifi-off` · Devices & Hardware · variant of `wifi`',
  '', '## E · Added on request', '', '- [x] 19. `layout-sidebar` — added 2026-09-26 · approved 2026-09-26', '',
].join('\n');
const FX_DRAWN = ['x', 'x-small', 'plus', 'home', 'home-2', 'checkbox', 'save', 'chevrons-up-down', 'sparkle', 'copy', 'layout-sidebar'];
/** A file of `n` lines with the given lines (1-based) filled in, the rest placeholder text — the sections cite documents by line. */
const atLines = (n, at) => Array.from({ length: n }, (_, i) => at[i + 1] ?? `line ${i + 1}`).join('\n') + '\n';

function buildFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'polaris-scope-fx-'));
  const w = (rel, text) => { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), text); };
  const j = JSON.stringify;
  w('research/synonyms.mjs', [
    `export const CATEGORIES = ${j(Object.fromEntries(Object.entries(FX_CATEGORIES).map(([k, [label, tier]]) => [k, { label, tier }])))};`,
    `export const CONCEPTS = ${j(Object.fromEntries(Object.entries(FX_TABLE).map(([k, v]) => [k, `\n${v.join('\n')}\n`])))};`,
    "export const PLATFORM = 'catalog order sidekick product-add measurement-volume';", "export const NOT_VARIANT = '';", "export const BRAND_PREFIX = 'logo-';", 'export const LUCIDE_ALIAS_IGNORE = [];', `export const D23 = ${j(FX_D23)};`, '',
  ].join('\n'));
  w('research/sources/polaris.json', j(FX_ARCHIVE.map((name) => ({ name, filled: name === 'Star', keywords: [] }))));
  w('research/sources/nucleo.json', j(['home', 'checkbox', 'save', 'select', 'xmark', 'plus', 'star', 'info', 'question-circle', 'clock', 'search', 'magic', 'download', 'bolt', 'page'].map((name) => ({ name, set: 10 }))));
  w('research/sources/lucide.json', j([
    ['home', ['navigation']], ['check-square', ['layout']], ['save', ['files']], ['chevrons-up-down', ['arrows']], ['x', ['layout']], ['plus', ['layout']], ['star', ['social']], ['info', ['notifications']],
    ['circle-help', ['notifications']], ['clock', ['time']], ['search', ['layout']], ['sparkles', ['design']], ['copy', ['files']], ['download', ['files']], ['zap', ['connectivity']], ['bolt', ['tools', 'home']],
    ['eraser', ['text']], ['circle-dashed', ['development', 'shapes']], ['cloud-off', ['connectivity']], ['wifi-off', ['connectivity']], ['history', ['time']], ['webhook', ['development']], ['file', ['files']], ['joystick', ['gaming']], ['circle', ['shapes']],
  ].map(([name, categories]) => ({ name, aliases: [], categories, tags: [] }))));
  w('research/sources/feather.json', j(['cloud-off', 'wifi-off']));
  w('research/sources/nucleo-ui.json', j([{ name: 'eraser', category: 'Design/Development' }, { name: 'circle-dashed', category: 'UI/Layout' }, { name: 'webhook', category: 'Design/Development' }, { name: 'history', category: 'Time' }, { name: 'bag', category: 'Fashion' }]));
  const real = readFileSync(join(REPO, 'tools/audit.mjs'), 'utf8');
  if (!real.includes('const CUT = 500;')) throw new Error('tools/audit.mjs no longer says `const CUT = 500;` — the fixture shrinks it');
  w('tools/audit.mjs', real.replace('const CUT = 500;', `const CUT = ${FX_CUT};`));
  execFileSync('node', ['tools/audit.mjs'], { cwd: dir, stdio: 'pipe' });
  // the sheet, the drawn icons and the documents the sections cite
  w('research/queue.md', FX_SHEET);
  for (const n of FX_DRAWN) { w(`src/icons/24/${n}.svg`, '<svg/>'); w(`src/icons/24/${n}-filled.svg`, '<svg/>'); }
  const slots = SLOTS.map((x) => `\`${x}\``).join(' · ');
  w('docs/06-audit.md', atLines(180, {
    40: '### 1. The evidence supports 487 concepts, and 500 is the right size', 44: 'curated set. That leaves **13 open slots** (see §6). The D23 estimate holds.',
    46: 'Arrows + UI/Layout take **23%** (114 of 487), close to the 26% share in', 49: '### 2. D23 is 120 concepts, not 122, and 114 of them are in',
    81: DOC06_THREE.slice(0, 20).join(' · '), 82: `${DOC06_THREE.slice(20, 35).join(' · ')} · arrow-{up,down,left,right}-circle`,
    92: DOC06_TWO.slice(0, 8).join(' · '), 93: DOC06_TWO.slice(8).join(' · '), 97: '### 4. Tier 2 is 161 of the 487', 117: '**29 Tier 3 concepts have two or more votes** (flower, forklift, gamepad and',
    126: slots.slice(0, 80), 127: slots.slice(80, 160), 128: slots.slice(160), 132: '### 7. Modifiers: 145 of the 487 are variants', 139: '### 8. Polaris is heavily commerce: 118 of its concepts are excluded',
    142: 'editor parts. The "499" in CLAUDE.md does not match the archive, which has',
  }));
  w('docs/audit/findings-grammar.md', atLines(280, { 273: `| **corner badge** | ${BADGE38.map((b) => `\`${b}\``).join(', ')} |` }));
  w('CLAUDE.md', ['# x', '', '**Audit** — done: `docs/06-audit.md`, `research/ranked.md`. The user has **not** yet ruled on', "the D23 revisions it proposes. The audit used the Polaris *archive*; the user's Figma Polaris frame",
    '(file `XewrhAKrNGVZtikkpI5am9`, node `15643:27748`) is newer (~490 icons) and should be', 're-audited. To refresh', 'Polaris use the **git trees API** — the contents API silently stops at 1,000 entries.', '',
    '- Polaris (archive): 463 outline bases + 72 filled = 535 SVGs, all 20×20', ''].join('\n'));
  w('README.md', '- **Shopify Polaris** — 499 components, all 20×20, zero strokes\n');
  w('docs/04-scope.md', "| Shopify Polaris | 499 | one product's actual need |\n");
  w('docs/audit/stale-statements.md', ['# s', "| **Correct** | Fluent's source table (file `rdI0uXVzp89fOZpYcQV6mo`, page Guidelines) has two columns |", '| **Correct** | that node is not in the file. The live source is file **`rdI0uXVzp89fOZpYcQV6mo`**, page **"Polarris icons"** |', ''].join('\n'));
  w('plans/set-and-rules-audit.md', ['# p', 'The authoritative file is **`rdI0uXVzp89fOZpYcQV6mo`** ("a.1. Microsoft Fluent system iconography"):', ''].join('\n'));
  w('docs/audit/references-fluent.md', '| Source | Figma file `rdI0uXVzp89fOZpYcQV6mo` *a.1. Microsoft Fluent system iconography* |\n  paste into figma_execute with fileKey rdI0uXVzp89fOZpYcQV6mo\n');
  w('docs/08-refinement.md', ['- `research/references/fluent-guidelines.md` — read off the Figma desktop bridge from', '  `rdI0uXVzp89fOZpYcQV6mo`, page "Guidelines". Stroke table.', ''].join('\n'));
  w('docs/09-notes.md', 'an unrelated line that does not mention it\n');
  w('docs/10-misc.md', ['# misc', '', 'the grid file is rdI0uXVzp89fOZpYcQV6mo, as noted by the designer', ''].join('\n'));
  // this card's own files quote the key too and must be left out of the count
  w('docs/audit/references-polaris.md', 'the key `rdI0uXVzp89fOZpYcQV6mo` is quoted here\n');
  w('tools/audit/polaris-scope.mjs', "export const FLUENT_KEY = 'rdI0uXVzp89fOZpYcQV6mo';\n");
  const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
  const g = (...a) => execFileSync('git', ['-C', dir, '-c', 'commit.gpgsign=false', ...a], { env, stdio: 'pipe', encoding: 'utf8' });
  g('init', '-q'); g('add', '-A'); g('commit', '-q', '-m', 'fixture');
  const pin = g('rev-parse', 'HEAD').trim();
  // after the pin: caret-up is approved on the sheet and a comment lands in the synonym table — HEAD is no longer the pin
  writeFileSync(join(dir, 'research/queue.md'), FX_SHEET.replace('- [ ] 9. `caret-up`', '- [x] 9. `caret-up`'));
  writeFileSync(join(dir, 'research/synonyms.mjs'), `${readFileSync(join(dir, 'research/synonyms.mjs'), 'utf8')}// a comment added after the pin\n`);
  g('add', '-A'); g('commit', '-q', '-m', 'after the pin');
  const live = join(dir, '.live.json');
  writeFileSync(live, j({ kind: 'polaris-live-list/1', file: 'fixture', page: { id: '1:0', name: 'p', type: 'PAGE' }, at: 't', counts: {}, top: [], rows: FX_LIVE.map((n, i) => [`1:${i + 1}`, n, 20, 20, '1:0']) }));
  return { dir, pin, live, scratch: join(mkdtempSync(join(tmpdir(), 'polaris-scope-sc-')), 'scratch') };
}

// FIXTURE-END
let fixtureMemo = null;
const gitAvailable = spawnSync('git', ['--version']).status === 0 && spawnSync('tar', ['--version']).status === 0;
function fixture() {
  if (!fixtureMemo) {
    fixtureMemo = buildFixture();
    process.on('exit', () => { rmSync(fixtureMemo.dir, { recursive: true, force: true }); rmSync(join(fixtureMemo.scratch, '..'), { recursive: true, force: true }); });
  }
  return fixtureMemo;
}
const sections = new Map();
/** Runs one section of the tool on the fixture (once; the text is kept). */
function section(name, extra = []) {
  const key = [name, ...extra].join(' ');
  if (!sections.has(key)) {
    const fx = fixture();
    const r = run([name, '--repo', fx.dir, '--pin', fx.pin, '--live', fx.live, '--scratch', fx.scratch, ...extra]);
    assert.equal(r.status, 0, `${name} failed:\n${r.stderr}`);
    sections.set(key, r.stdout);
  }
  return sections.get(key);
}
const lineOf = (text, prefix) => { const l = text.split('\n').find((x) => x.startsWith(prefix)); assert.ok(l, `no line starts with "${prefix}" in:\n${text}`); return l; };
const hasLine = (text, exact) => assert.ok(text.split('\n').includes(exact), `no line equal to:\n${exact}\nin:\n${text}`);
const skipNoGit = gitAvailable ? false : 'git or tar is not available';
/** A line equal to `template`, where ` r#` stands for ` r` and any number — ranks come from the audit's own sort, which these tests do not pin. */
const hasRow = (text, template) => assert.match(text, new RegExp(`^${template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ r#/g, ' r\\d+')}$`, 'm'), `no row like:\n${template}\nin:\n${text}`);

// ── §2: the re-rank ──────────────────────────────────────────────────────────────────────────

test('fixture §2.1: the scratch copy reproduces research/ byte for byte, and the matcher agrees with the audit on every Polaris concept', { skip: skipNoGit }, () => {
  const t = section('rerank');
  for (const f of ['ranked.md', 'audit.csv', 'audit.json']) assert.match(t, new RegExp(`\\| research/${f.replace('.', '\\.')} \\| [0-9a-f]{12} \\| [0-9a-f]{12} \\| [0-9a-f]{12} \\| byte-identical \\|`));
  // HEAD is one commit past the pin, and that commit touched research/synonyms.mjs: the tool says so, and shows the stat
  assert.match(t, /between the pin [0-9a-f]{40} and HEAD: CHANGED\nresearch\/synonyms\.mjs \| 1 \+\n 1 file changed, 1 insertion\(\+\)/);
  // archive Polaris concepts: home checkbox caret-up caret-down chevrons-up-down x copy save star info help clock search plus sparkle atm catalog order sidekick logo-x chevron-down-circle file = 22
  // live: the 22 minus sparkle's Magic, atm, catalog, sidekick, logo-x (17), plus 21 new = 38
  assert.match(t, /my matcher against the tool's own P flags: archive agrees on all 22 · live agrees on all 38/);
  assert.match(t, /archive 22 = tier 0: 4 \(3 Shopify-only \+ 1 logos\) · tier 1: 17 · tier 2: 1 · tier 3: 0/);
  assert.match(t, /live 38 = tier 0: 2 \(2 Shopify-only \+ 0 logos\) · tier 1: 25 · tier 2: 5 · tier 3: 6/);
  assert.match(t, /the live file: 38 records of the same shape/);
});

test('fixture §2.3: evidence-backed, the cut, the open slots and the bands, from the cut the audit wrote into audit.json', { skip: skipNoGit }, () => {
  const t = section('rerank');
  // archive evidence-backed tier 1–2 = the 17 tier-1 Polaris concepts + atm + download + zap + cloud-off + wifi-off = 22 (the cut is 32: 10 open)
  // live = 22 − atm + dashed-circle eraser bolt circle history calendar-check user-plus catalog-product clock-revert file-plus star-list order-batches search-add = 34; 32 inside, cloud-off and wifi-off cut
  hasLine(t, '| evidence-backed tier 1–2 concepts, no cut | 22 | 34 |');
  hasLine(t, '| inside the cut of 32 ("the first 32") | 22 | 32 |');
  hasLine(t, '| open slots (32 − inside) | 10 | 0 |');
  hasLine(t, '| inside the cut, scoring 3/3 · 2/3 · 1/3 | 13 · 3 · 6 | 13 · 8 · 11 |');
  assert.match(t, /\| UI & Layout \| 5 \| 7 \|/);
  assert.match(t, /sections of ranked\.md with a count in their heading that do not change: Arrows & Direction \(4\); 12 such sections in all/);
  assert.match(t, /: archive 4 · live 1; ranked\.md's own bullets count 4 · 1; leave the pool: `dashed-circle` `history` `eraser`; join it: —/);
  assert.match(t, /held back \(Tier 3 with two or more sets\): archive 0 · live 1; joins: `joystick`; leaves: —/);
  // the line counts again, from the diff the tool saved, counted another way
  const diff = readFileSync(join(fixture().scratch, 'rerank-out', 'ranked.diff'), 'utf8').split('\n');
  const gone = diff.filter((l) => /^-(?!--)/.test(l)).map((l) => l.slice(1));
  const came = diff.filter((l) => /^\+(?!\+\+)/.test(l)).map((l) => l.slice(1));
  const cell = (l) => l.replace(/^\| \d+ \|/, '| # |');
  const spare = new Map();
  for (const l of came) spare.set(cell(l), (spare.get(cell(l)) ?? 0) + 1);
  let back = 0;
  for (const l of gone) if ((spare.get(cell(l)) ?? 0) > 0) { spare.set(cell(l), spare.get(cell(l)) - 1); back++; }
  assert.ok(gone.length > back && back > 0, 'some removed lines — not all — differ only in their rank cell');
  assert.ok(t.includes(`${gone.length} lines removed, ${came.length} added; ${back} of the removed lines come back with only their rank number`), `the tool counts ${gone.length} / ${came.length} / ${back}`);
});

test("fixture §2.3b: docs/06's own counts are counted from the right categories, and the check against docs/06 says no on a toy set", { skip: skipNoGit }, () => {
  const t = section('rerank');
  // arrows in the archive top: chevrons-up-down caret-up caret-down chevron-down-circle (4); ui: x plus home checkbox search (5) → 9. Live: ui gains dashed-circle and search-add → 4 + 7 = 11 of 32
  hasLine(t, '| Arrows + UI/Layout 114 of 487 (23%) | docs/06-audit.md:46 | 9 of 22 (40.9%) | 11 of 32 (34.4%) |');
  hasLine(t, '| Tier 2 is 161 of the 487 | docs/06-audit.md:97 | 4 of 22 | 6 of 32 |');
  hasLine(t, '| 145 of the 487 are variants | docs/06-audit.md:132 | 0 of 22 | 5 of 32 |');
  hasLine(t, '| 29 Tier 3 concepts have two or more votes | docs/06-audit.md:117 | 0 | 1 |');
  hasLine(t, '| 118 Shopify-only concepts excluded (plus logos) | docs/06-audit.md:139 | 3 + 1 logos = 4 | 2 + 0 logos = 2 |');
  hasLine(t, '| D23: 120 concepts, 114 of them in | docs/06-audit.md:49 | 12, 9 in | 12, 10 in |');
  hasLine(t, '| 487 evidence-backed Tier 1–2 concepts (126 · 226 · 135) | docs/06-audit.md:40 | 22 (13 · 3 · 6) | 32 inside the cut, 34 without it (13 · 8 · 11) |');
  hasLine(t, '| 13 open slots | docs/06-audit.md:44 | 10 | 0 |');
  assert.match(t, /the archive column equals docs\/06's figures on every row: NO — see the rows/);
  assert.match(t, /D23 concepts inside the cut on one vote or less .*: archive caret-down \(P\), caret-up \(P\) · live caret-down \(P\), caret-up \(P\)/);
});

test('fixture §2.4: who loses and who gains a Polaris vote, by tier, with the sheet beside each', { skip: skipNoGit }, () => {
  const t = section('rerank');
  assert.match(t, /concepts that lose Polaris: 5 · gain it: 21 \(net 16\)/);
  hasRow(t, '| `sparkle` | status | 111 v3 s3 t1 r# → 011 v2 s2 t1 r# | drawn #7 |');
  hasRow(t, '| `atm` | commerce | 100 v1 s1 t2 r# → — | queued #11 |');
  hasLine(t, '| `catalog` | platform | 100 v1 s1 t0 r– (out) → — | absent |');
  hasRow(t, '| `download` | `download` | files | 011 v2 s2 t1 r# → 111 v3 s3 t1 r# | queued #12 |');
  hasRow(t, '| `joystick` | `joystick` | other | 001 v1 s1 t3 r# (out) → 101 v2 s2 t3 r# (out) | absent |');
  hasLine(t, 'by tier — lose Polaris: tier 0: 3 · tier 1: 1 · tier 2: 1 · tier 3: 0 · gain it: tier 0: 1 · tier 1: 9 · tier 2: 5 · tier 3: 6');
  assert.match(t, /on the sheet at the pin — concepts that lose Polaris: 1 drawn \(`sparkle`\), 1 queued \(`atm`\); concepts that gain it: 0 drawn, 4 queued \(`download` `calendar-check` `user-plus` `file-plus`\), 17 absent/);
  assert.match(t, /gained: 7 already had a row in the archive run because Nucleo or Lucide draws them \(2 are table concepts: `download` `history`; 5 are not in the table: `dashed-circle` `eraser` `bolt` `circle` `joystick`\) · 14 had none/);
  hasRow(t, '| `product-add` | `product-add` | platform | — → 100 v1 s1 t0 r– (out) | absent |');
  assert.match(t, /gained and landing in tier 3 \("on demand"\) only because the table has no row for them: 5 \(`joystick` `bag` `measurement-volume-list` `paste` `person-list`\)/);
  hasLine(t, 'concepts that stay Polaris-drawn and change votes, score or evidence: 0');
  hasLine(t, 'concepts present in both runs whose tier or category changes: 0');
});

test("fixture §2.5: who enters and leaves the cut, what the entrants sit on, and the Shopify-only names that ride in", { skip: skipNoGit }, () => {
  const t = section('rerank');
  hasLine(t, '## §2.5 in and out of the first 32');
  hasLine(t, 'enter: 13 · leave: 3 · net 10');
  assert.match(t, /^\| `atm` \| no vote left \| queued #11 \| \d+ \|$/m);
  assert.match(t, /^\| `cloud-off` \| cut at rank 33 \| queued #17 \| \d+ \|$/m);
  assert.match(t, /^\| `wifi-off` \| cut at rank 34 \| queued #18 \| \d+ \|$/m);
  assert.match(t, /evidence-backed but beyond the cut of 32 in the live run: 2 \(`cloud-off` r33, `wifi-off` r34\) — these are sheet rows #17 · #18; section D \(the audit ranking\) runs #3 to #18 and section E \(rows added on request\) from #19/);
  hasLine(t, 'of the 13 that enter, on the sheet at the pin: 3; of the 3 that leave: 3 queued, 0 drawn');
  // entrants: dashed-circle history eraser bolt circle (a second vote) · calendar-check user-plus catalog-product clock-revert file-plus star-list order-batches search-add (Polaris alone)
  hasLine(t, 'of the 13 that enter: 5 gain Polaris as a second vote · 8 have Polaris as their only vote · 5 are modifier variants (the audit\'s `variantOf`) · 8 are not (`dashed-circle` `history` `eraser` `bolt` `circle` `calendar-check` `user-plus` `catalog-product`)');
  // variants: clock-revert on clock, star-list on star, file-plus on file, search-add on search (all inside the cut) and order-batches on order, which is Shopify-only and outside the ranking
  hasLine(t, 'the 5 variants: 4 sit on a base that is itself inside the cut; 1 on a base that is not: `order-batches` on `order` (platform, tier 0, excluded from the ranking)');
  // a third rides on a Shopify-only name and stays out: `measurement-volume-list` (Tier 3), on the listed `measurement-volume`
  assert.match(t, /archive 0 · live 3 — `catalog-product` on `catalog` \(tier 2, inside the cut\); `order-batches` on `order` \(tier 2, inside the cut\); `measurement-volume-list` on `measurement-volume` \(tier 3, outside it\); of the 13 that enter: 2 \(`catalog-product` `order-batches`\)/);
});

test('fixture §2.6: the D23 column — who is inside, who is outside in both, and what changes', { skip: skipNoGit }, () => {
  const t = section('rerank');
  // D23 names: 4 carets, close:x x plus, file copy duplicate:copy, clock history, star sparkle = 14 → 12 concepts; inside: 2 carets + x plus file copy clock star sparkle = 9
  // `history` is a D23 concept Polaris now draws: it comes inside the cut (9 → 10); `sparkle` loses its Polaris vote but stays inside
  assert.match(t, /D23's names resolve to 12 concepts \(docs\/06-audit\.md:49-55\); inside the cut: archive 9 · live 10; outside in both: 2 \(`caret-left` `caret-right`\)/);
  assert.match(t, /D23 concepts whose votes, score or evidence change: 2 — `sparkle` 111 v3 s3 t1 r\d+ → 011 v2 s2 t1 r\d+; `history` 001 v1 s1 t1 r\d+ \(out\) → 101 v2 s2 t1 r\d+/);
  hasLine(t, 'D23 concepts Polaris draws: archive 9 · live 9 of 12');
  // the rank numbers move for 9 of the 12 — `x`, `clock` and `star` keep theirs. Counted again here from the order of `ranked` in the two
  // audit.json files the tool saved (not from the `rank` field the tool reads), and pinned as a literal too.
  const order = (d) => JSON.parse(readFileSync(join(fixture().scratch, 'rerank-out', d, 'audit.json'), 'utf8')).ranked.map((r) => r.concept);
  const [was, now] = [order('base'), order('live')];
  const d23 = ['caret-up', 'caret-down', 'caret-left', 'caret-right', 'x', 'plus', 'file', 'copy', 'clock', 'history', 'star', 'sparkle'];
  assert.deepEqual(d23.filter((c) => was.indexOf(c) === now.indexOf(c)), ['x', 'clock', 'star']);
  hasLine(t, `D23 concepts whose rank number moves (the ranks of everything shift when 13 concepts enter above): ${d23.filter((c) => was.indexOf(c) !== now.indexOf(c)).length} of 12`);
  hasLine(t, 'D23 concepts whose rank number moves (the ranks of everything shift when 13 concepts enter above): 9 of 12');
  hasLine(t, 'categories whose size changes: shown above; categories where the D23 count changes: 1');
  hasLine(t, '| Time & Calendar | 1 · 1 | 4 · 2 |');
  hasLine(t, '| Design Tools | 1 · 0 | 4 · 0 |');
});

test('fixture §2.7: what placed each new live name — in the order tools/audit.mjs decides, and what put the Tier-3 ones there', { skip: skipNoGit }, () => {
  const t = section('rerank');
  hasLine(t, 'new live concepts with no row in research/synonyms.mjs: 14');
  hasLine(t, "| `circle` | `circle` | Design Tools (tier 2) | Lucide's category tags | `circle` |");
  hasLine(t, "| `dashed-circle` | `circle-dashed` | UI & Layout (tier 1) | Nucleo UI's category | `circle-dashed` |");
  hasLine(t, "| `bolt` | `bolt` | Design Tools (tier 2) | Lucide's category tags | `bolt` |");
  hasLine(t, "| `catalog-product` | `catalog-product` | Commerce & Payments (tier 2) | the table's `catalog` (its name starts with it) | — |");
  hasLine(t, "| `joystick` | `joystick` | Tier 3 (on demand) (tier 3) | Lucide's category tags (none maps: Tier 3) | `joystick` |");
  hasLine(t, "| `bag` | `bag` | Tier 3 (on demand) (tier 3) | Nucleo UI's category | — |");
  hasLine(t, "| `paste` | `paste` | Tier 3 (on demand) (tier 3) | nothing: Tier 3 by default | — |");
  assert.match(t, /: a table concept at the start of its name ×6 · Nucleo UI's category ×3 · Lucide's category tags ×2 · nothing: Tier 3 by default ×2 · Lucide's category tags \(none maps: Tier 3\) ×1$/m);
  hasLine(t, 'of the 14: 5 land in Tier 3 (held back); 9 are placed in Tier 1 or 2');
  assert.match(t, /the 5 in Tier 3, by what placed them: nothing: Tier 3 by default ×2 · Lucide's category tags \(none maps: Tier 3\) ×1 · Nucleo UI's category ×1 · a table concept at the start of its name ×1 — `joystick` by Lucide's category tags \(none maps: Tier 3\); `bag` by Nucleo UI's category; `measurement-volume-list` by the start of its name \(`measurement-volume`, itself Tier 3 \(on demand\)\)/);
  hasLine(t, 'live names that Nucleo or Lucide already file under a different concept than the rule gives Polaris: 1 — `bolt` is `bolt` here and `zap` there');
});

// ── §3: the D23 revisions and the slots ──────────────────────────────────────────────────────

test('fixture §3.0–§3.1: the sheet at the pin and the eight revisions, each with its votes before and after and its sheet row', { skip: skipNoGit }, () => {
  const t = section('d23');
  assert.match(t, /21 rows at [0-9a-f]{40}: 11 approved · 10 queued · 0 in review; 11 names drawn in the tree \(src\/icons\/24 at the pin\); approved rows against drawn names: the same set/);
  hasRow(t, '| add `home` | `home` | `home` | `home` | 1·1·1  v3 s3 t1  r# | 1·1·1  v3 s3 t1  r# | drawn #3 2026-09-20, 2 rows, 2 shipped |');
  hasRow(t, '| add `chevrons-up-down` | `chevrons-up-down` | `select` | `select` | 1·1·1  v3 s3 t1  r# | 1·1·1  v3 s3 t1  r# | drawn #6 2026-09-26, 1 row, 1 shipped |');
  hasRow(t, '| cut `caret-left` | `caret-left` | — | — | 0·0·0  v0 s0 t1  r# out | 0·0·0  v0 s0 t1  r# out | absent |');
  hasRow(t, '| merge `close` = `x` | `x` | `x` `x-small` | `x` | 1·1·1  v3 s3 t1  r# | 1·1·1  v3 s3 t1  r# | drawn #1 2026-09-17, 2 rows, 2 shipped |');
  hasRow(t, '| merge `copy` = `duplicate` | `copy` | `duplicate` | `duplicate` | 1·0·1  v2 s2 t1  r# | 1·0·1  v2 s2 t1  r# | drawn #8 2026-09-29, 1 row, 1 shipped |');
  hasLine(t, '| `close` | `x` | no | none |');
  hasLine(t, '| `duplicate` | `copy` | yes | none |');
  hasLine(t, 'how D23 spells them: `close:x` `x` `copy` `duplicate:copy` — `:` means "is the audit concept after it"');
  // the sheet is read at the pin: caret-up is approved at HEAD (the commit after the pin) and still queued here
  hasLine(t, 'the carets: live Polaris names `caret-down` `caret-up` · the sheet has `caret-up` queued (row 9) · `caret-down` queued (row 10) · `caret-left` absent · `caret-right` absent');
  hasLine(t, 'D23 as the table spells it: 14 names → 12 concepts');
});

test('fixture §3.2: the 13 open slots — Polaris and the sheet on each, and the arithmetic of the cut', { skip: skipNoGit }, () => {
  const t = section('d23');
  hasRow(t, '| `history` | `history` | — | `history` | 0·0·1  v1 s1 t1  r# out → 1·0·1  v2 s2 t1  r# | absent | `history` |');
  hasRow(t, '| `webhook` | — | — | — | 0·0·1  v1 s1 t2  r# out → 0·0·1  v1 s1 t2  r# out | absent | — |');
  assert.match(t, /\| `badge` \| — \| — \| — \| no row → no row \| absent \| — \|/);
  // `history` is the one slot Polaris draws on the live page (and it comes inside the cut); the other twelve are not drawn
  hasLine(t, 'slots Polaris draws: archive 0 · live 1 of 13; slots on the sheet at the pin: 0');
  hasLine(t, 'slots of the 13 that are evidence-backed in the live run (any set): 1; inside the live cut: 1');
  assert.match(t, /the open slots, counted: archive 10 · live 0 \(evidence-backed without the cut: 34\); a cut that would hold every evidence-backed concept and the 13 picks: archive 22 \+ 13 = 35 · live 34 \+ 13 = 47/);
  assert.match(t, /the slots inside ranked\.md's candidate pool .*: archive 2 of 13 · live 1 of 13; the slots outside it: `badge` .*; the pool itself: archive 4 · live 1; the 3 the live Polaris takes out of it: `dashed-circle` `history` `eraser`/);
});

test("fixture §3.3–§3.5: docs/06's claims about Polaris are checked against the live names, and its two lists against the sheet", { skip: skipNoGit }, () => {
  const t = section('d23');
  assert.match(t, /\| "Polaris has only vertical carets" \| docs\/06-audit\.md:61 \| holds \| live: `caret-down` `caret-up`; archive: `caret-up` `caret-down` \|/);
  assert.match(t, /\| "Polaris calls it `Duplicate`" \(copy\) \| docs\/06-audit\.md:54 \| holds \|/);
  assert.match(t, /\| "Polaris and Nucleo use a plain clock for history" \| docs\/06-audit\.md:62 \| \*\*changed\*\* \|/);
  assert.match(t, /\| "Polaris draws only the maximise\/minimise pair" .* \| \*\*does not hold\*\* \|/);
  hasLine(t, 'live Polaris draws 5 of 39 (archive 4); the sheet at the pin: drawn 4 · queued 1 · absent 34 · in review 0');
  hasLine(t, 'live Polaris draws 1 of 15 (archive 0); the sheet at the pin: drawn 0 · queued 1 · absent 14 · in review 0');
  assert.match(t, /D23's 12 concepts: Polaris draws 9 in the archive, 9 on the live page; the sheet at the pin holds \(drawn · queued · absent\): 4 · 2 · 6 /);
  hasLine(t, '| `clock-revert` | `1:7` | D23 `history` (docs/06-audit.md:62) |');
  hasLine(t, '| `page-report` | not in this list (names only) | D23 `report` = `file-chart`? |');
  assert.match(t, /the lists this tool embeds, checked against the lines they come from: SLOTS \(docs\/06-audit\.md:126-128\) all present · DOC06_THREE \(docs\/06-audit\.md:81-87\) all present · DOC06_TWO \(docs\/06-audit\.md:92-95\) all present · BADGE38 \(docs\/audit\/findings-grammar\.md:273\) all present/);
});

test("fixture §3.5: Polaris's D23 concepts are counted on each side from that side's own names — archive and live apart", { skip: skipNoGit }, () => {
  const fx = fixture();
  const dir = mkdtempSync(join(tmpdir(), 'polaris-scope-arc-'));
  try {
    // an archive that also draws CaretLeft (a D23 concept the live page lacks): 10 in the archive, still 9 on the live page
    const arc = JSON.parse(readFileSync(join(fx.dir, 'research/sources/polaris.json'), 'utf8'));
    writeFileSync(join(dir, 'archive.json'), JSON.stringify([...arc, { name: 'CaretLeft', filled: false, keywords: [] }]));
    const t = section('d23', ['--archive', join(dir, 'archive.json')]);
    assert.match(t, /D23's 12 concepts: Polaris draws 10 in the archive, 9 on the live page;/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('fixture §3.5: a name the cited lines no longer hold is reported by name', { skip: skipNoGit }, () => {
  const fx = fixture();
  const doc = join(fx.dir, 'docs/06-audit.md');
  const was = readFileSync(doc, 'utf8');
  try {
    writeFileSync(doc, was.replace('`trophy`', '`podium`'));
    const r = run(['d23', '--repo', fx.dir, '--pin', fx.pin, '--live', fx.live, '--scratch', fx.scratch]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /SLOTS \(docs\/06-audit\.md:126-128\) MISSING trophy ·/);
    assert.match(r.stdout, /DOC06_THREE \(docs\/06-audit\.md:81-87\) all present/);
  } finally { writeFileSync(doc, was); }
});

// ── §4: P5 and the badge composites ──────────────────────────────────────────────────────────

test('fixture §4.1: how Polaris names help and info, set beside what the other two sets call them', { skip: skipNoGit }, () => {
  const t = section('grammar');
  hasLine(t, '| `help` | `question-circle` | `question-circle` | `question-circle` | `circle-help` |');
  hasLine(t, '| `info` | `info` | `info` | `info` | `info` |');
  hasLine(t, "the audit table's spellings for `help`: `help` `question-circle` `help-circle`; for `info`: `info`");
  hasLine(t, 'live Polaris names that end `-circle` or run `-circle-up/-down`: 2 — `chevron-down-circle` `question-circle`');
  assert.match(t, /live Polaris names the ring in: 1 \(`question-circle`\); `info` is bare: yes \(`info`\); `help` is `question-circle`, not `help-circle`: yes/);
  assert.match(t, /the queued neighbours P5 names: `help-square` absent \(row –\), Polaris draws it: no/);
});

test('fixture §4.2: how many of the 38 queued badge names Polaris draws, and under what name', { skip: skipNoGit }, () => {
  const t = section('grammar');
  hasLine(t, 'the 38 names (findings-grammar.md:273) on the sheet at the pin: queued 4 · drawn 0 · absent 34 · in review 0');
  hasLine(t, '**live Polaris draws 3 of the 38** (archive 0; NOT the same names); under the same name 1, under a name the audit\'s table equates with ours 2; not drawn by Polaris: 35');
  hasLine(t, '| `calendar-check` | `calendar-check` | same name | 15 queued |');
  hasLine(t, '| `file-plus` | `page-add` | table alias | 13 queued |');
  hasLine(t, '| `user-plus` | `person-add` | table alias | 14 queued |');
  hasLine(t, '| `bell-plus` | — | **not drawn** | 16 queued |');
});

test('fixture §4.3: the composite census counts names by their last word, and says which words found them', { skip: skipNoGit }, () => {
  const t = section('grammar');
  hasLine(t, '| `add` | 4 | `page-add` `person-add` `search-add` `product-add` |');
  hasLine(t, '| `check` | 1 | `calendar-check` |');
  assert.match(t, /\*\*5 live names are composites of the kind\*\* \(of 38\) — 1 by the 38's own modifier words alone \(.*\), 4 more only through the spellings \(.*\); excluded by the direction rule: `caret-down` `caret-up`$/m);
  hasLine(t, 'of the 3 live names that match one of our 38: 3 are in this census; 0 are not');
  hasLine(t, 'composites in the census that match none of our 38: 2 — `search-add` `product-add`; of these 1 are Shopify-only by the table (`product-add`)');
});

// ── §5: the pointer ──────────────────────────────────────────────────────────────────────────

test('fixture §5.1–§5.2: the Audit paragraph is printed with its line numbers, and the sizes the documents state are found', { skip: skipNoGit }, () => {
  const t = section('pointer');
  hasLine(t, 'CLAUDE.md:3: **Audit** — done: `docs/06-audit.md`, `research/ranked.md`. The user has **not** yet ruled on');
  hasLine(t, 'CLAUDE.md:7: Polaris use the **git trees API** — the contents API silently stops at 1,000 entries.');
  assert.match(t, /the live page is in file `XewrhAKrNGVZtikkpI5am9`/);
  hasLine(t, 'CLAUDE.md says "~490 icons" for the frame: live names 38, live drawings 39');
  hasLine(t, 'CLAUDE.md:9: - Polaris (archive): 463 outline bases + 72 filled = 535 SVGs, all 20×20');
  hasLine(t, 'README.md:1: - **Shopify Polaris** — 499 components, all 20×20, zero strokes');
  hasLine(t, 'docs/06-audit.md:142: editor parts. The "499" in CLAUDE.md does not match the archive, which has');
  // the archive: 23 names, 1 flagged filled (Star) → 24 files, 22 concepts; the live page: 38 names plus the `star-filled` twin = 39 drawings, 38 concepts, 2 Shopify-only (order, product-add)
  hasLine(t, 'measured: archive 23 bases + 1 twins = 24 files, 22 concepts, 3 Shopify-only · live 38 names, 39 drawings (39 of them 20×20), 38 audit concepts, 2 Shopify-only');
  assert.ok(!t.split('\n').some((l) => l.startsWith('CLAUDE.md:8:')), 'the Audit paragraph stops at its blank line');
});

test('fixture §5.3: the key is found on every tracked line, not in six named files, and each line is told Fluent from Polaris', { skip: skipNoGit }, () => {
  const t = section('pointer');
  hasLine(t, '| docs/08-refinement.md:2 | Fluent\'s file | `rdI0uXVzp89fOZpYcQV6mo`, page "Guidelines". Stroke table. |');
  hasLine(t, '| docs/audit/stale-statements.md:3 | the live Polaris source | \\| **Correct** \\| that node is not in the file. The live source is file **`rdI0uXVzp89fOZpYcQV6mo`**, page **"Polarris icons"** \\| |');
  assert.ok(!t.split('\n').some((l) => l.startsWith('| docs/audit/references-polaris.md') || l.startsWith('| tools/audit/polaris-scope.mjs')), "this card's own files are left out");
  hasLine(t, '| docs/audit/references-fluent.md:2 | Fluent\'s file | paste into figma_execute with fileKey rdI0uXVzp89fOZpYcQV6mo |');
  hasLine(t, '| docs/10-misc.md:3 | neither | the grid file is rdI0uXVzp89fOZpYcQV6mo, as noted by the designer |');
  hasLine(t, '**7 lines in 5 files**: Fluent\'s file on 5 lines in 4 files · the live Polaris source on 1 line in 1 file (docs/audit/stale-statements.md:3) · neither 1');
  hasLine(t, '(no --pages-fluent capture given: whether the Fluent file holds a Polaris page is not measured here)');
});

test("fixture §0.4 and §5.3: the Fluent file's own page list says whether it holds a Polaris page", { skip: skipNoGit }, () => {
  const fx = fixture();
  const dir = mkdtempSync(join(tmpdir(), 'polaris-scope-pf-'));
  try {
    const none = { file: 'a.1. Microsoft Fluent system iconography', fileKey: 'rdI0uXVzp89fOZpYcQV6mo', at: '2026-10-05T06:01Z', by: 'a listing', pages: [{ id: '1:1', name: 'Cover' }, { id: '2:2', name: null, note: 'a separator' }, { id: '3:3', name: 'System icons' }] };
    const some = { ...none, pages: [...none.pages, { id: '15721:27960', name: 'Polarris icons' }] };
    writeFileSync(join(dir, 'none.json'), JSON.stringify(none));
    writeFileSync(join(dir, 'some.json'), JSON.stringify(some));
    const a = run(['bridge', '--live', fx.live, '--pages-fluent', join(dir, 'none.json')]).stdout;
    assert.match(a, /## §0\.4 the pages of the Fluent file \(rdI0uXVzp89fOZpYcQV6mo\)/);
    assert.match(a, /listed 2026-10-05T06:01Z · a listing · 3 pages:/);
    assert.match(a, /\| `2:2` \| \(a separator\) \|/);
    assert.match(a, /pages whose name contains "Polaris" or "Polarris": none · the page 15721:27960 among them: no · result: THE FLUENT FILE HAS NO POLARIS PAGE/);
    const b = run(['bridge', '--live', fx.live, '--pages-fluent', join(dir, 'some.json')]).stdout;
    assert.match(b, /contains "Polaris" or "Polarris": `Polarris icons` · the page 15721:27960 among them: yes · result: THE FLUENT FILE HOLDS A POLARIS PAGE/);
    const p = run(['pointer', '--repo', fx.dir, '--pin', fx.pin, '--live', fx.live, '--pages-fluent', join(dir, 'none.json')]).stdout;
    assert.match(p, /the Fluent file's own page list \(2026-10-05T06:01Z, a listing\): 3 pages — Cover · \(a separator\) · System icons; a Polaris page among them: none/);
    assert.deepEqual(fluentPageReport(some).polaris.map((x) => x.name), ['Polarris icons']);
    assert.equal(fluentPageReport(none).pages, 3);
    assert.equal(fluentPageReport({ pages: [{ id: '15721:27960', name: 'x' }] }).hasPolarisId, true);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ── the figure assembly's own pieces, on synthetic audit.json rows ───────────────────────────

test("countsOf counts docs/06's figures from one run — Arrows + UI is both categories, not one", () => {
  const rows = [
    R('a1', { category: 'arrows', tier: 1, score: 3 }), R('a2', { category: 'arrows', tier: 1, score: 1 }), R('u1', { category: 'ui', tier: 1, score: 2, variantOf: 'u0' }),
    R('u2', { category: 'ui', tier: 1, score: 1 }), R('u3', { category: 'ui', tier: 1, score: 1 }), R('c1', { category: 'commerce', tier: 2, score: 1 }), R('o1', { category: 'other', tier: 3, score: 2, top: false }),
    R('o2', { category: 'other', tier: 3, score: 1, top: false }),
  ];
  const json = { cut: 10, ranked: rows, excluded: [R('p1', { category: 'platform', tier: 0 }), R('p2', { category: 'platform', tier: 0 }), R('b1', { category: 'brands', tier: 0 })] };
  const c = countsOf(json);
  assert.equal(c.backed, 6, 'inside the cut');
  assert.deepEqual(c.bands, { 3: 1, 2: 1, 1: 4 });
  assert.equal(c.arrowsUi, 5, '2 arrows + 3 ui');
  assert.equal(c.tier2, 1);
  assert.equal(c.variants, 1);
  assert.equal(c.held, 1, 'a Tier 3 concept with two or more sets');
  assert.deepEqual([c.excl, c.platform, c.logos], [3, 2, 1]);
  assert.deepEqual(heldBack(json), ['o1']);
  assert.equal(cutOf(json), 10);
  assert.equal(cutOf({}), 500, 'the shipped cut');
});

test("matchesDoc06 says yes only when every one of docs/06's figures is met, and no when one is not", () => {
  const want = { backed: 5, bands: [2, 2, 1], slots: 1, arrowsUi: 3, tier2: 1, variants: 1, held: 1, platform: 2, d23: 9, d23In: 7 };
  const c = { backed: 5, bands: { 3: 2, 2: 2, 1: 1 }, arrowsUi: 3, tier2: 1, variants: 1, held: 1, platform: 2 };
  const ctx = { cut: 6, d23Names: 9, d23In: 7 };
  assert.equal(matchesDoc06(c, ctx, want), true);
  for (const [k, v] of [['backed', 6], ['arrowsUi', 2], ['tier2', 2], ['variants', 0], ['held', 0], ['platform', 1]]) assert.equal(matchesDoc06({ ...c, [k]: v }, ctx, want), false, k);
  assert.equal(matchesDoc06({ ...c, bands: { 3: 2, 2: 1, 1: 2 } }, ctx, want), false, 'the bands');
  assert.equal(matchesDoc06(c, { ...ctx, cut: 7 }, want), false, 'the open slots');
  assert.equal(matchesDoc06(c, { ...ctx, d23In: 6 }, want), false, 'D23 inside');
  assert.deepEqual(DOC06_EXPECTED.bands, [126, 226, 135]);
});

test('entrantBases tells a variant on a base inside the cut from one on a base outside it, and shopifyRiders finds names that ride on a Shopify-only name', () => {
  const rows = (arr) => ({ ranked: arr, excluded: [] });
  const base = rows([R('star'), R('order', { tier: 0, category: 'platform', top: false })]);
  const live = rows([
    R('star'), R('star-list', { variantOf: 'star' }), R('order-batches', { variantOf: 'order', tier: 2, category: 'commerce' }), R('catalog-product', { tier: 2, category: 'commerce' }), R('eraser', { P: 1, L: 1 }),
    R('order', { tier: 0, category: 'platform', top: false }), R('catalog', { tier: 0, category: 'platform', top: false }),
  ]);
  live.excluded = [];
  const D = diffRanking(base, live);
  assert.deepEqual(D.entered.sort(), ['catalog-product', 'eraser', 'order-batches', 'star-list']);
  const E = entrantBases(D);
  assert.deepEqual(E.variants.sort(), ['order-batches', 'star-list']);
  assert.deepEqual(E.onTop, ['star-list']);
  assert.deepEqual(E.offTop, [{ concept: 'order-batches', base: 'order', baseTier: 0, baseCategory: 'platform' }]);
  assert.deepEqual(E.bases.sort(), ['catalog-product', 'eraser']);
  const riders = shopifyRiders(live, new Set(['order', 'catalog']));
  assert.deepEqual(riders.map((x) => [x.concept, x.base, x.top]).sort(), [['catalog-product', 'catalog', true], ['order-batches', 'order', true]]);
  assert.deepEqual(shopifyRiders(base, new Set(['order', 'catalog'])), [], 'listed names themselves are not riders');
});

test("placementOf follows tools/audit.mjs's order: the start of the name, Lucide tags when none maps, Nucleo UI's category, Lucide's tags, nothing", () => {
  const m = buildMatcher({ CONCEPTS: { commerce: 'catalog\n', other: 'measurement-volume\n' }, PLATFORM: 'catalog' });
  const lucide = [{ name: 'circle', categories: ['shapes'] }, { name: 'dice', categories: ['gaming'] }, { name: 'eraser', categories: ['text'] }, { name: 'both', categories: ['gaming'] }];
  const row = (o = {}) => ({ names: { lucide: [] }, nucleoUI: 0, ...o });
  const at = (c, r) => placementOf(c, r, { matcher: m, lucide }).kind;
  assert.equal(at('catalog-product', row({ names: { lucide: ['eraser'] }, nucleoUI: 1 })), 'prefix', 'the start of the name comes first');
  assert.deepEqual(placementOf('measurement-volume-list', row(), { matcher: m, lucide }), { kind: 'prefix', via: 'measurement-volume' });
  assert.equal(at('dice', row({ names: { lucide: ['dice'] } })), 'lucide-unmapped', 'every Lucide tag unmapped: Tier 3, decided by Lucide');
  assert.equal(at('both', row({ names: { lucide: ['both'] }, nucleoUI: 1 })), 'lucide-unmapped', 'and that beats Nucleo UI');
  assert.equal(at('eraser', row({ names: { lucide: ['eraser'] }, nucleoUI: 1 })), 'nucleo-ui', "Nucleo UI's category beats Lucide's tags");
  assert.equal(at('circle', row({ names: { lucide: ['circle'] } })), 'lucide');
  assert.equal(at('bag', row({ nucleoUI: 1 })), 'nucleo-ui');
  assert.equal(at('paste', row()), 'default');
  assert.equal(at('catalog', row()), 'table');
  assert.equal(at('logo-x', row()), 'brand');
  assert.ok(Object.keys(PLACEMENT_WORDS).every((k) => PLACEMENT_WORDS[k]));
});

// ── git: the key over the tracked tree ───────────────────────────────────────────────────────

test('trackedGrep finds a key on every tracked line at HEAD, leaves named files out, and classifyKeyHits tells the files apart by their context', { skip: skipNoGit }, () => {
  const fx = fixture();
  const all = trackedGrep(fx.dir, 'rdI0uXVzp89fOZpYcQV6mo', []);
  assert.equal(all.length, 9, 'seven lines elsewhere and the two lines of this card’s own files');
  const some = trackedGrep(fx.dir, 'rdI0uXVzp89fOZpYcQV6mo', ['docs/audit/references-polaris.md', 'tools/audit/polaris-scope.mjs']);
  assert.deepEqual(some.map((h) => `${h.file}:${h.n}`), ['docs/08-refinement.md:2', 'docs/10-misc.md:3', 'docs/audit/references-fluent.md:1', 'docs/audit/references-fluent.md:2', 'docs/audit/stale-statements.md:2', 'docs/audit/stale-statements.md:3', 'plans/set-and-rules-audit.md:2']);
  assert.deepEqual(trackedGrep(fx.dir, 'no such text anywhere', []), []);
  const cls = classifyKeyHits(some, (f) => readFileSync(join(fx.dir, f), 'utf8').split('\n'));
  assert.deepEqual(cls.map((h) => h.as), ["Fluent's file", 'neither', "Fluent's file", "Fluent's file", "Fluent's file", 'the live Polaris source', "Fluent's file"]);
  assert.deepEqual(keyTotals(cls), { "Fluent's file": { lines: 5, files: 4 }, 'the live Polaris source': { lines: 1, files: 1 }, neither: { lines: 1, files: 1 } });
  // a line that says nothing about Fluent and has no Fluent line before it is "neither"
  assert.equal(classifyKeyHits([{ file: 'x.md', n: 3, text: 'the key abc' }], () => ['a', 'b', 'the key abc'])[0].as, 'neither');
  assert.equal(classifyKeyHits([{ file: 'x.md', n: 3, text: 'the key abc' }], () => ['Fluent', 'b', 'the key abc'])[0].as, "Fluent's file", 'two lines back counts');
  const bare = mkdtempSync(join(tmpdir(), 'polaris-scope-nogit-'));   // a folder that is not a checkout
  try { assert.throws(() => trackedGrep(bare, 'x', []), /git grep failed/); } finally { rmSync(bare, { recursive: true, force: true }); }
});

// ── rerank: it deletes only what it made, and says so when there is no checkout ──────────────

test('rerank refuses to delete a folder it did not make — before it asks git anything, so an exported copy (no .git) still refuses', () => {
  const root = mkdtempSync(join(tmpdir(), 'polaris-scope-'));
  const repo = join(root, 'exported-copy');           // not a git checkout
  const scratch = join(root, 'scratch');
  try {
    mkdirSync(repo);
    mkdirSync(join(scratch, 'rerank'), { recursive: true });
    writeFileSync(join(scratch, 'rerank', 'precious.txt'), 'keep me');
    assert.throws(() => runRerank({ repo, scratch, live: liveFrom(['a']) }), /refusing to delete/);
    assert.equal(readFileSync(join(scratch, 'rerank', 'precious.txt'), 'utf8'), 'keep me');
    rmSync(join(scratch, 'rerank'), { recursive: true });
    assert.throws(() => runRerank({ repo, scratch, live: liveFrom(['a']) }), /rerank needs a git checkout .* is not one/, 'and a clear message when there is nothing to archive');
    assert.ok(!existsSync(join(scratch, 'rerank-out')), 'nothing was made before the message');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('rerank reuses its own work and rebuilds it with --force, and only the sentinel makes a folder its own', { skip: skipNoGit }, () => {
  const fx = fixture();
  section('rerank');                                    // builds
  const again = runRerank({ repo: fx.dir, scratch: fx.scratch, live: liveFrom(JSON.parse(readFileSync(fx.live, 'utf8'))) });
  assert.equal(again.cached, true, 'same HEAD, same live names: reused');
  const forced = runRerank({ repo: fx.dir, scratch: fx.scratch, live: liveFrom(JSON.parse(readFileSync(fx.live, 'utf8'))), force: true });
  assert.equal(forced.cached, false);
  assert.ok(existsSync(join(fx.scratch, 'rerank-out', '.polaris-scope.json')));
  const changed = runRerank({ repo: fx.dir, scratch: fx.scratch, live: liveFrom(['home', 'checkbox']) });
  assert.equal(changed.cached, false, 'other live names: rebuilt');
  assert.equal(changed.live.json.ranked.find((r) => r.concept === 'eraser').P, 0, 'two live names: Polaris no longer draws an eraser');
  sections.clear();                                     // the scratch now holds the 2-name run; later sections must rebuild theirs
  runRerank({ repo: fx.dir, scratch: fx.scratch, live: liveFrom(JSON.parse(readFileSync(fx.live, 'utf8'))) });
});

test('rerank stops, and says so, when the scratch copy does not reproduce research/ — the working tree has moved from what HEAD holds', { skip: skipNoGit }, () => {
  const fx = fixture();
  const f = join(fx.dir, 'research/ranked.md');
  const was = readFileSync(f, 'utf8');
  try {
    writeFileSync(f, `${was}\nan edit nobody committed\n`);
    const r = run(['rerank', '--repo', fx.dir, '--pin', fx.pin, '--live', fx.live, '--scratch', fx.scratch]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /\| research\/ranked\.md \| [0-9a-f]{12} \| [0-9a-f]{12} \| [0-9a-f]{12} \| \*\*DIFFERENT\*\* \|/);
    assert.match(r.stdout, /\| research\/audit\.json \| [0-9a-f]{12} \| [0-9a-f]{12} \| [0-9a-f]{12} \| byte-identical \|/);
    assert.match(r.stdout, /STOP — the scratch copy does not reproduce research\/; nothing below is meaningful\./);
    assert.ok(!/§2\.3/.test(r.stdout), 'and nothing is measured after the stop');
  } finally { writeFileSync(f, was); }
});

test('script prints read-only snippets for the live list, the page list, and the page list aimed at the Fluent file', () => {
  const list = run(['script', 'list']).stdout;
  assert.match(list, /fileKey XewrhAKrNGVZtikkpI5am9 · timeout 30000 · READ ONLY/);
  assert.match(list, /getNodeByIdAsync\('15721:27960'\)/);
  assert.match(list, /findAllWithCriteria\(\{ types: \['COMPONENT'\] \}\)/);
  const pages = run(['script', 'pages']).stdout;
  assert.match(pages, /fileKey XewrhAKrNGVZtikkpI5am9 \(the Polaris file\) or rdI0uXVzp89fOZpYcQV6mo \(the Fluent file\)/);
  assert.match(pages, /figma\.root\.children\.map/);
  const fl = run(['script', 'fluent-pages']).stdout;
  assert.match(fl, /^\/\/ figma_execute · fileKey rdI0uXVzp89fOZpYcQV6mo \(the Fluent file\) · timeout 30000 · READ ONLY/);
  // the Fluent page list is the one-liner the main session ran, word for word, and says what shape its answer is saved in
  assert.ok(fl.split('\n').includes('return figma.root.children.map(p => ({id: p.id, name: p.name}))'), 'the one-liner, as it was run');
  assert.match(fl, /--pages-fluent reads \{"kind":"polaris-pages\/1","file":"<the file's name>","fileKey":"rdI0uXVzp89fOZpYcQV6mo"/);
  for (const t of [list, pages, fl]) assert.ok(!/figma\.create|\.remove\(|setPluginData|loadAllPagesAsync\(|appendChild|insertChild|figma\.currentPage\s*=|figma_navigate/.test(t), 'nothing that writes, loads every page or switches file');
  const bad = run(['script', 'nonsense']);
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /script list \| pages \| fluent-pages/);
});

test('capture unwraps what the host saved, drops the pad, and refuses a checksum that does not match', () => {
  const dir = mkdtempSync(join(tmpdir(), 'polaris-scope-cap-'));
  try {
    writeFileSync(join(dir, 'saved.txt'), capture());
    const ok = run(['capture', join(dir, 'saved.txt'), '--out', join(dir, 'out', 'live.json')]);
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /captured 2 rows from page 1:0 "p" of "f" at t/);
    assert.match(ok.stdout, /checksum recorded [0-9a-f]{8} · recomputed [0-9a-f]{8} · equal/);
    const written = JSON.parse(readFileSync(join(dir, 'out', 'live.json'), 'utf8'));
    assert.equal(written.rows.length, 2);
    assert.ok(!('pad' in written));
    writeFileSync(join(dir, 'bad.txt'), capture({ hash: '00000000' }));
    const bad = run(['capture', join(dir, 'bad.txt'), '--out', join(dir, 'out', 'bad.json')]);
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /checksum differs/);
    assert.ok(!existsSync(join(dir, 'out', 'bad.json')), 'nothing written for a bad capture');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('slotLeads lists live names that share a whole word with a slot, and ignores last words that four or more names end with', () => {
  const names = ['filter', 'filter-active', 'a-list', 'b-list', 'c-list', 'd-list', 'person-list', 'chart-donut', 'chart-line'];
  assert.deepEqual(slotLeads('list-filter', names), ['filter', 'filter-active'], '`list` ends five names, so it is no lead');
  assert.deepEqual(slotLeads('list-todo', names), []);
  assert.deepEqual(slotLeads('chart-area', names), ['chart-donut', 'chart-line'], 'a head word shared by names is a lead');
  assert.deepEqual(slotLeads('list-filter', ['a-list', 'b-list', 'c-list']), ['a-list', 'b-list', 'c-list'], 'three names are not enough to call a word generic');
  assert.deepEqual(slotLeads('list-filter', ['a-list', 'b-list', 'c-list'], 3), [], 'unless the bar is lowered');
});


// ── tracked files: the drift guard and the archive ───────────────────────────────────────────

const flat = (s) => s.replace(/\s+/g, ' ').trim();
const audit = existsSync(join(REPO, 'tools/audit.mjs')) ? readFileSync(join(REPO, 'tools/audit.mjs'), 'utf8') : null;
const line = (src, startsWith) => { const m = new RegExp(`^[ \\t]*(?:export )?${startsWith.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*`, 'm').exec(src); assert.ok(m, `not found: ${startsWith}`); return flat(m[0]).replace(/^export /, ''); };
// A statement that ends in a matching brace: from the marker (which ends in `{`) to its partner, plus a trailing `;`.
const block = (src, marker) => {
  const i = src.indexOf(marker);
  assert.ok(i >= 0, `not found: ${marker}`);
  let depth = 1;
  let k = i + marker.length;
  while (depth > 0 && k < src.length) { const ch = src[k++]; if (ch === '{') depth++; else if (ch === '}') depth--; }
  if (src[k] === ';') k++;
  return flat(src.slice(i, k));
};

test('drift guard: the matching rule here is, word for word, the one in tools/audit.mjs', { skip: !audit && 'tools/audit.mjs not present' }, () => {
  const mine = readFileSync(join(REPO, 'tools/audit/polaris-scope.mjs'), 'utf8');
  for (const start of ['const words =', 'const kebab =', 'const platform = new Set(words(PLATFORM));', 'const resolve = (source, raw) =>']) {
    assert.equal(line(mine, start), line(audit, start), `drifted: ${start}`);
  }
  for (const marker of ['function normalise(raw) {', 'const claim = (map, key, c) => {', 'for (const [cat, block] of Object.entries(CONCEPTS)) {']) {
    assert.equal(block(mine, marker), block(audit, marker), `drifted: ${marker}`);
  }
  // the counting rule itself: Polaris names are kebab-cased, resolved, and counted once per concept
  assert.ok(flat(audit).includes(flat("for (const r of load('polaris')) { const raw = kebab(r.name); hit('P', resolve('polaris', raw), raw); }")), 'audit.mjs no longer counts Polaris names that way');
  assert.ok(flat(audit).includes("votes: has('P') + has('N') + has('L')"), 'audit.mjs no longer scores a vote per set');
});

test('the drift guard can tell: a changed rule is caught', () => {
  const a = 'function normalise(raw) {\n  let t = raw.split("-");\n  return t.join("-");\n}\nnext';
  const b = 'function normalise(raw) {\n  let t = raw.split("_");\n  return t.join("-");\n}\nnext';
  assert.notEqual(block(a, 'function normalise(raw) {'), block(b, 'function normalise(raw) {'));
  assert.equal(block(a, 'function normalise(raw) {'), block(a.replace(/\n  /g, '\n\t'), 'function normalise(raw) {'), 'indentation is not a difference');
});

test('drift guard: the Lucide tags placementOf treats as mappable are the keys of FROM_LUCIDE in tools/audit.mjs', { skip: !audit && 'tools/audit.mjs not present' }, () => {
  const m = /const FROM_LUCIDE = \{([\s\S]*?)\};/.exec(audit);
  assert.ok(m, 'FROM_LUCIDE not found');
  const keys = [...m[1].matchAll(/(\w+):\s*'\w+'/g)].map((x) => x[1]).sort();
  assert.deepEqual(keys, [...LUCIDE_MAPPED_TAGS].sort());
  // and the order inferCategory decides in: the prefix loop, then the Lucide veto, then Nucleo UI, then Lucide's majority
  const body = flat(audit.slice(audit.indexOf('function inferCategory(c) {'), audit.indexOf('// ── d23')));
  const at = (s) => { const i = body.indexOf(s); assert.ok(i >= 0, `not in inferCategory: ${s}`); return i; };
  assert.ok(at('byBase[t.join(\'-\')]') < at('if (lc.length && !mapped.length) return \'other\';') && at('if (lc.length && !mapped.length) return \'other\';') < at('if (nucleoUiCat[c])') && at('if (nucleoUiCat[c])') < at('return mapped.length * 2 >= lc.length'), 'inferCategory decides in another order');
});


test('tracked files: the matcher lands every archive name on the concept research/audit.json gave it, and the counts are the ones the docs state', async (t) => {
  const files = ['research/synonyms.mjs', 'research/sources/polaris.json', 'research/audit.json', 'docs/06-audit.md', 'CLAUDE.md'];
  if (files.some((f) => !existsSync(join(REPO, f)))) { t.skip('a tracked file is missing'); return; }
  const { matcher } = await repoMatcher(REPO);
  const archive = JSON.parse(readFileSync(join(REPO, 'research/sources/polaris.json'), 'utf8'));
  const names = archive.map((r) => kebab(r.name));
  const byC = conceptMap(names, (raw) => matcher.resolve('polaris', raw));
  const shipped = JSON.parse(readFileSync(join(REPO, 'research/audit.json'), 'utf8'));
  const withP = new Map([...shipped.ranked, ...shipped.excluded].filter((r) => r.P).map((r) => [r.concept, r]));
  assert.deepEqual([...byC.keys()].sort(), [...withP.keys()].sort(), 'the same concepts have a Polaris vote');
  for (const [c, raws] of byC) assert.deepEqual([...withP.get(c).names.polaris].sort(), [...raws].sort(), c);
  const counts = nameCounts(names, archive.filter((r) => r.filled).length, matcher);
  assert.equal(counts.concepts, withP.size);
  assert.equal(counts.platform, [...withP.values()].filter((r) => r.category === 'platform').length);
  assert.equal(counts.logos, [...withP.values()].filter((r) => r.category === 'brands').length);
  const doc06 = readFileSync(join(REPO, 'docs/06-audit.md'), 'utf8');
  assert.ok(doc06.includes(`${counts.names} bases (${counts.drawings} files)`), 'docs/06-audit.md:15 states the archive size');
  assert.ok(doc06.includes(`${counts.platform} of its concepts are excluded`), 'docs/06-audit.md:139 states the Shopify-only count');
  assert.ok(readFileSync(join(REPO, 'CLAUDE.md'), 'utf8').includes(`${counts.names} outline bases + ${counts.twins} filled = ${counts.drawings} SVGs`));
});

test('tracked files: D23 resolves to the 120 concepts docs/06 counts, lacks what the revisions add, and holds what they cut or merge', async (t) => {
  if (!existsSync(join(REPO, 'research/synonyms.mjs'))) { t.skip('research/synonyms.mjs is missing'); return; }
  const { D23, matcher } = await repoMatcher(REPO);
  const e = d23Entries(D23);
  assert.equal(e.length, 122);
  assert.equal(new Set(e.map((x) => x.concept)).size, 120);
  assert.deepEqual(e.filter((x) => x.concept === 'x').map((x) => x.name).sort(), ['close', 'x']);
  assert.deepEqual(e.filter((x) => x.concept === 'copy').map((x) => x.name).sort(), ['copy', 'duplicate']);
  for (const r of REVISIONS) assert.equal(e.some((x) => x.concept === r.concept), r.kind !== 'add', `${r.label}: D23 lacks an "add" and holds a "cut" or "merge"`);
  assert.equal(matcher.resolve('polaris', 'select'), 'chevrons-up-down', 'Polaris\' select is the chevrons-up-down concept');
  assert.equal(matcher.resolve('polaris', 'duplicate'), 'copy');
});
