#!/usr/bin/env node
// Every figure in docs/audit/references-polaris.md (card 1.17), printed from committed sources.
// AUDIT ONLY — imported by nothing but its own test; it reads the repo and the pinned tree
// and writes ONLY inside a scratch directory outside the repo (`assertOutsideRepo`).
//
// What it reads
//   research/sources/polaris.json         the archive the 2026-09-16 audit used (tracked)
//   research/synonyms.mjs, tools/audit.mjs the counting rule (tracked) — `rerank` runs the real
//                                          tool, in a scratch copy of HEAD, never in the repo
//   git show <pin>:research/queue.md       the sheet at the pin
//   git ls-tree <pin> src/icons/24/        the concepts drawn at the pin
//   --live <file>                          the live Polaris names: either a bridge capture
//                                          (`script list` → paste into figma_execute → `capture`)
//                                          or the on-disk catalogue
//                                          research/references/polaris/figma/catalogue.json
//                                          (gitignored; equal to the live page on 2026-10-05, §0)
//
// Usage
//   node tools/audit/polaris-scope.mjs <section> [options]
//   Sections (one per document section):  script · capture · bridge · names · rerank · d23 ·
//                                         grammar · pointer · all
//   Options: --live F  --archive F  --catalogue F  --pages F  --scratch DIR  --pin SHA  --repo DIR
//            --out F (capture)   --all-d23 (d23: print every D23 concept, not only the revisions)
//
//   script list|pages          prints the two read-only figma_execute snippets
//   capture SAVED --out F      unwraps what the host saved from the bridge, checks its checksum
//   bridge                     §0  the live page against the catalogue on disk
//   names                      §1  live against archive, by the audit's own counting rule
//   rerank                     §2  a scratch copy of HEAD, run twice (archive, then live names)
//   d23                        §3  each D23 revision and the 13 open slots, as facts
//   grammar                    §4  P5 (help/info naming) and the badge composites
//   pointer                    §5  what the live source means for CLAUDE.md's Audit line
//
// The matching rule (`kebab`, `normalise`, `resolve`) is COPIED from tools/audit.mjs, which cannot
// be imported (it writes research/ on load). The test file holds a drift guard: it fails if the
// copy and the original stop being the same text.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, realpathSync, copyFileSync } from 'node:fs';
import { join, resolve as resolvePath, dirname, basename, relative, isAbsolute } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const PIN = '5933041';
export const FIGMA = { fileKey: 'XewrhAKrNGVZtikkpI5am9', pageId: '15721:27960', pageName: 'Polarris icons' };
export const DEAD_NODE = '15643:27748';
export const FLUENT_KEY = 'rdI0uXVzp89fOZpYcQV6mo';
const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolvePath(HERE, '../..');

// ── data the audit documents state, each with the line it comes from ─────────────────────────
// docs/06-audit.md:126-128 — "The 13 open slots" (the first four are weak D23 concepts)
export const SLOTS = ['history', 'badge', 'list-filter', 'file-chart', 'webhook', 'signature', 'list-todo', 'chart-area', 'folders', 'trophy', 'route', 'focus', 'router'];
// docs/06-audit.md:81-87 — "Tier 1 concepts score 3/3 but are not in D23" (arrow-{up,down,left,right}-circle expanded)
export const DOC06_THREE = ['home', 'checkbox', 'cursor', 'save', 'ban', 'pin', 'chevrons-up-down', 'clipboard', 'clipboard-check', 'files', 'images', 'book', 'book-open', 'face-smile', 'thumbs-up', 'microphone', 'compose', 'language', 'hash', 'target', 'lightbulb', 'wand', 'gauge', 'presentation', 'text', 'toggle-on', 'layout-footer', 'sidebar-right', 'sort-descending', 'rotate-ccw', 'plus-circle', 'minus-circle', 'file-plus', 'file-minus', 'shield-check', 'arrow-up-circle', 'arrow-down-circle', 'arrow-left-circle', 'arrow-right-circle'];
// docs/06-audit.md:92-95 — "Also worth adding, since Polaris backs them at 2/3"
export const DOC06_TWO = ['import', 'backspace', 'calculator', 'form', 'note', 'moon', 'sun', 'toggle-off', 'chevron-first', 'chevron-last', 'user-plus', 'user-minus', 'folder-plus', 'image-plus', 'thumbs-down'];
// docs/audit/findings-grammar.md:273 — the "at least 38" queued corner-badge composites
export const BADGE38 = ['bell-plus', 'calendar-check', 'calendar-clock', 'cart-minus', 'cart-plus', 'clipboard-check', 'code-plus', 'credit-card-lock', 'credit-card-x', 'database-plus', 'desktop-download', 'eye-check', 'face-smile-plus', 'file-check', 'file-clock', 'file-down', 'file-heart', 'file-minus', 'file-plus', 'file-up', 'folder-down', 'folder-minus', 'folder-plus', 'folder-up', 'grid-circle-plus', 'image-plus', 'mail-follow-up', 'message-alert', 'message-user', 'note-plus', 'package-check', 'shield-check', 'user-check', 'user-lock', 'user-minus', 'user-plus', 'user-search', 'user-x'];
export const CITED = [
  { what: 'SLOTS', names: SLOTS, file: 'docs/06-audit.md', from: 126, to: 128 },
  { what: 'DOC06_THREE', names: DOC06_THREE, file: 'docs/06-audit.md', from: 81, to: 87 },
  { what: 'DOC06_TWO', names: DOC06_TWO, file: 'docs/06-audit.md', from: 92, to: 95 },
  { what: 'BADGE38', names: BADGE38, file: 'docs/audit/findings-grammar.md', from: 273, to: 273 },
];
// The D23 revisions docs/06 §2–§3 proposes (docs/06-audit.md:49-95, CLAUDE.md:162-165).
export const REVISIONS = [
  { kind: 'add', label: 'add `home`', concept: 'home' },
  { kind: 'add', label: 'add `checkbox`', concept: 'checkbox' },
  { kind: 'add', label: 'add `save`', concept: 'save' },
  { kind: 'add', label: 'add `chevrons-up-down`', concept: 'chevrons-up-down' },
  { kind: 'cut', label: 'cut `caret-left`', concept: 'caret-left' },
  { kind: 'cut', label: 'cut `caret-right`', concept: 'caret-right' },
  { kind: 'merge', label: 'merge `close` = `x`', concept: 'x', names: ['close', 'x'] },
  { kind: 'merge', label: 'merge `copy` = `duplicate`', concept: 'copy', names: ['copy', 'duplicate'] },
];
// The sheet names three audit concepts differently (rows renamed or added on request, C28 / sheet §E).
export const SHEET_NAME = { sidebar: 'layout-sidebar', 'sidebar-right': 'layout-sidebar-right', 'volume-high': 'volume' };

// ── the counting rule — COPIED from tools/audit.mjs:12-13, 16-23, 25-44 ──────────────────────
export const words = (s) => s.trim().split(/\s+/).filter(Boolean);
export const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

// Generic normalisation — see the header of research/synonyms.mjs.
export function normalise(raw) {
  let t = raw.split('-').filter((x) => x && !/^\d+$/.test(x));
  t = t.map((x) => (/^\d+x\d+$/.test(x) ? x : x.replace(/(\D)\d+$/, '$1')));
  t = t.map((x) => ({ slash: 'off', xmark: 'x' }[x] ?? x));
  if (t.length > 1 && t.at(-1) === 'small') t.pop();
  if (t.length > 1 && (t[0] === 'circle' || t[0] === 'square')) t = [...t.slice(1), t[0]];
  return t.join('-');
}

/** The synonym table as tools/audit.mjs builds it, with the same refusals. */
export function buildMatcher({ CONCEPTS, PLATFORM, BRAND_PREFIX = 'logo-' }) {
  const category = {};
  const alias = {};
  const rawAlias = {};
  const claim = (map, key, c) => {
    if (map[key] && map[key] !== c) throw new Error(`alias "${key}" claimed by ${map[key]} and ${c}`);
    map[key] = c;
  };
  for (const [cat, block] of Object.entries(CONCEPTS)) {
    for (const line of block.split('\n').map((l) => l.trim()).filter(Boolean)) {
      const [c, ...as] = words(line);
      if (category[c]) throw new Error(`concept "${c}" listed twice`);
      category[c] = cat;
      claim(alias, c, c);
      for (const a of as) a.includes(':') ? claim(rawAlias, a, c) : claim(alias, a, c);
    }
  }
  const platform = new Set(words(PLATFORM));
  const resolve = (source, raw) => rawAlias[`${source}:${raw}`] ?? alias[normalise(raw)] ?? normalise(raw);
  return {
    category, alias, rawAlias, platform, resolve,
    inTable: (c) => !!category[c],
    isPlatform: (c) => platform.has(c),
    isBrand: (c) => !platform.has(c) && !category[c] && c.startsWith(BRAND_PREFIX),
  };
}

const synonymsCache = new Map();
/** A repo's own table, loaded once per repo. */
export async function repoMatcher(repo = REPO) {
  const key = resolvePath(repo);
  if (!synonymsCache.has(key)) synonymsCache.set(key, await import(pathToFileURL(join(key, 'research/synonyms.mjs')).href));
  const m = synonymsCache.get(key);
  return { matcher: buildMatcher({ CONCEPTS: m.CONCEPTS, PLATFORM: m.PLATFORM, BRAND_PREFIX: m.BRAND_PREFIX }), D23: m.D23, CATEGORIES: m.CATEGORIES };
}

// ── small helpers ────────────────────────────────────────────────────────────────────────────
export const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');
/** FNV-1a, 32 bit — the same function the bridge snippet runs inside Figma. */
export const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
export const unique = (xs) => [...new Set(xs)];
export const setEq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const nearestReal = (p) => { let q = resolvePath(p); const tail = []; while (!existsSync(q)) { tail.unshift(basename(q)); q = dirname(q); } return join(realpathSync(q), ...tail); };

/** Throws unless `p` lies outside `repo` — the tool never writes inside the repository. */
export function assertOutsideRepo(p, repo = REPO) {
  const a = nearestReal(p);
  const r = nearestReal(repo);
  const rel = relative(r, a);
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) throw new Error(`refusing to write inside the repository: ${p}`);
  return a;
}

const git = (repo, args, opts = {}) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...opts });
const readRepo = (repo, rel) => readFileSync(join(repo, rel), 'utf8');
/** Like readRepo, but a file the repo does not have reads as empty (the section then says what it did not find). */
const readIf = (repo, rel) => (existsSync(join(repo, rel)) ? readFileSync(join(repo, rel), 'utf8') : '');
const pct = (n, d) => (d ? `${(100 * n / d).toFixed(1)}%` : 'n/a');
const out = (s = '') => process.stdout.write(`${s}\n`);
const head = (t) => out(`\n## ${t}\n`);
const table = (cols, rows) => { out(`| ${cols.join(' | ')} |`); out(`|${cols.map(() => '---').join('|')}|`); for (const r of rows) out(`| ${r.join(' | ')} |`); out(); };
const code = (xs) => (xs.length ? xs.map((x) => `\`${x}\``).join(' ') : '—');

// ── the live list ────────────────────────────────────────────────────────────────────────────
/** Reads the three shapes `--live` may take. Folds `<name>-filled` into its base, as figma.mjs does. */
export function liveFrom(json) {
  let nodes = [];
  let kind = 'list';
  let meta = {};
  if (json && json.schema && String(json.schema).startsWith('mdx-ref/1/catalogue')) {
    kind = 'catalogue';
    meta = { at: json.at, page: json.page, file: json.file?.name ?? json.file, fileKey: json.file?.key };
    for (const r of json.rows) {
      const [, name, , items, , , w, h, id] = r;
      nodes.push({ id, name, w, h });
      if (items > 1) nodes.push({ id: null, name: `${name}-filled`, w, h, synthetic: true });
    }
  } else if (json && Array.isArray(json.rows)) {
    kind = 'bridge';
    meta = { at: json.at, page: json.page, file: json.file, fileKey: json.fileContext?.fileKey, fileContext: json.fileContext, counts: json.counts, top: json.top, hash: json.hash };
    nodes = json.rows.map((r) => (Array.isArray(r) ? { id: r[0], name: r[1], w: r[2], h: r[3], parent: r[4] } : r));
  } else if (Array.isArray(json)) {
    nodes = json.map((r) => (typeof r === 'string' ? { name: r } : r));
  } else throw new Error('--live: unrecognised shape (want a bridge capture, the catalogue, or a list of names)');
  const names = [];
  const seen = new Set();
  const twins = new Set();
  const orphanTwins = [];
  for (const n of nodes) {
    const filled = /-filled$/.test(n.name);
    const base = filled ? n.name.replace(/-filled$/, '') : n.name;
    n.base = base;
    n.filled = filled;
    if (!seen.has(base)) { seen.add(base); names.push(base); }
    if (filled) twins.add(base);
  }
  const bases = new Set(nodes.filter((n) => !n.filled).map((n) => n.name));
  for (const t of twins) if (!bases.has(t)) orphanTwins.push(t);
  return { kind, meta, nodes, names, twins, drawings: nodes.length, orphanTwins };
}

/** The file `rerank` swaps in for research/sources/polaris.json: same shape (`name`, `filled`,
 *  `keywords`), built from the live names. audit.mjs reads only `name`; it kebab-cases it, and a
 *  kebab name is unchanged by that (checked here). */
export function shapeLive(live) {
  return live.names.map((name) => {
    if (kebab(name) !== name) throw new Error(`live name "${name}" is changed by kebab()`);
    return { name, filled: live.twins.has(name), keywords: [] };
  });
}

/** research/synonyms.mjs D23 → one entry per D23 name: `close:x` is the name `close`, the concept `x`. */
export const d23Entries = (D23) => Object.entries(D23).flatMap(([cat, list]) => words(list).map((w) => { const [name, concept = name] = w.split(':'); return { cat, name, concept }; }));

export const conceptMap = (names, resolveFn) => {
  const m = new Map();
  for (const raw of names) { const c = resolveFn(raw); if (!m.has(c)) m.set(c, []); if (!m.get(c).includes(raw)) m.get(c).push(raw); }
  return m;
};

/** The counts of §1 for one side. */
export function nameCounts(names, twinCount, matcher) {
  const byC = conceptMap(names, (raw) => matcher.resolve('polaris', raw));
  const cs = [...byC.keys()];
  const platform = cs.filter((c) => matcher.isPlatform(c)).length;
  const logos = cs.filter((c) => matcher.isBrand(c)).length;
  return { names: names.length, twins: twinCount, drawings: names.length + twinCount, concepts: cs.length, platform, logos, rest: cs.length - platform - logos, byC };
}

/** Names against names, then concepts against concepts. */
export function diffNames(arcNames, liveNames, resolveFn) {
  const A = new Set(arcNames);
  const L = new Set(liveNames);
  const arcByC = conceptMap(arcNames, resolveFn);
  const liveByC = conceptMap(liveNames, resolveFn);
  const same = arcNames.filter((n) => L.has(n));
  const classify = (n, own, other, ownSet, otherSet, goneKind) => {
    const c = resolveFn(n);
    const theirs = other.get(c) ?? [];
    if (!theirs.length) return { name: n, concept: c, kind: goneKind, theirs: [] };
    const stillThere = theirs.some((x) => ownSet.has(x));
    return { name: n, concept: c, kind: stillThere ? 'folded' : 'respelled', theirs };
  };
  const archiveOnly = arcNames.filter((n) => !L.has(n)).map((n) => classify(n, arcByC, liveByC, A, L, 'gone'));
  const liveOnly = liveNames.filter((n) => !A.has(n)).map((n) => classify(n, liveByC, arcByC, L, A, 'new'));
  const keptConcepts = [...arcByC.keys()].filter((c) => liveByC.has(c));
  const goneConcepts = [...arcByC.keys()].filter((c) => !liveByC.has(c));
  const newConcepts = [...liveByC.keys()].filter((c) => !arcByC.has(c));
  return { same, archiveOnly, liveOnly, arcByC, liveByC, keptConcepts, goneConcepts, newConcepts };
}

/** Pairs (gone concept, new concept) whose raw names share a whole word — a lead for the eye, not a fact. */
export function renameLeads(diff) {
  const toks = (n) => n.split('-').filter((x) => x && !/^\d+$/.test(x));
  const leads = [];
  for (const g of diff.goneConcepts) {
    const gw = new Set(diff.arcByC.get(g).flatMap(toks));
    for (const n of diff.newConcepts) {
      const shared = diff.liveByC.get(n).flatMap(toks).filter((w) => gw.has(w));
      if (shared.length) leads.push({ gone: g, goneNames: diff.arcByC.get(g), now: n, nowNames: diff.liveByC.get(n), shared: unique(shared) });
    }
  }
  return leads;
}

// ── the sheet at the pin ─────────────────────────────────────────────────────────────────────
export function parseSheet(text) {
  const rows = [];
  let section = null;
  for (const line of text.split('\n')) {
    const h = /^## ([A-Z]) · /.exec(line);
    if (h) section = h[1];
    const m = /^- \[( |~|x)\] (\S+)\. `([^`]+)`(.*)$/.exec(line);
    if (!m) continue;
    const v = / · variant of `([^`]+)`/.exec(m[4]);
    const d = /approved (\d{4}-\d{2}-\d{2})/.exec(m[4]);
    rows.push({ st: m[1], n: m[2], name: m[3], base: v ? v[1] : null, approved: d ? d[1] : null, section, text: line });
  }
  return rows;
}

/** `git ls-tree --name-only` of src/icons/24/ → the names drawn at that tree. */
export function pinDrawn(lsTree) {
  const names = new Set();
  for (const line of lsTree.split('\n')) {
    const m = /(?:^|\/)([^/]+?)(-filled)?\.svg$/.exec(line.trim());
    if (m) names.add(m[1]);
  }
  return names;
}

/** drawn · queued · in review · absent, plus how many sheet rows sit under the name. */
export function sheetIndex(rows, drawn) {
  const byName = new Map(rows.map((r) => [r.name, r]));
  return {
    rows, drawn, byName,
    status(name) {
      const r = byName.get(name);
      if (drawn.has(name)) return 'drawn';
      if (!r) return 'absent';
      return r.st === '~' ? 'in review' : r.st === 'x' ? 'approved, no files' : 'queued';
    },
    family(name) { return rows.filter((r) => r.name === name || r.base === name); },
    row: (name) => byName.get(name),
  };
}

export function loadSheet(repo, pin) {
  const text = git(repo, ['show', `${pin}:research/queue.md`]);
  const tree = git(repo, ['ls-tree', '--name-only', pin, 'src/icons/24/']);
  const rows = parseSheet(text);
  return sheetIndex(rows, pinDrawn(tree));
}

/** For a concept: the name the sheet uses, its status, how many rows and shipped files it holds. */
export function sheetFacts(sheet, concept) {
  const name = SHEET_NAME[concept] ?? concept;
  const fam = sheet.family(name);
  const row = sheet.row(name);
  const shipped = fam.filter((r) => sheet.drawn.has(r.name)).length;
  return { name, n: row?.n ?? null, status: sheet.status(name), rows: fam.length, shipped, approved: row?.approved ?? null, renamed: name !== concept };
}

// ── the ranking, before and after ────────────────────────────────────────────────────────────
export const rowMap = (json) => { const m = new Map(); for (const r of [...json.ranked, ...json.excluded]) m.set(r.concept, r); return m; };
const pick = (r) => (r ? { P: r.P, N: r.N, L: r.L, votes: r.votes, score: r.score, tier: r.tier, category: r.category, evidence: !!r.evidence, rank: r.rank ?? null, top: !!r.top } : null);
export const band = (xs) => ({ 3: xs.filter((r) => r.score === 3).length, 2: xs.filter((r) => r.score === 2).length, 1: xs.filter((r) => r.score === 1).length });
const backed = (json) => json.ranked.filter((r) => r.evidence && r.tier >= 1 && r.tier <= 2);
/** The cut tools/audit.mjs applied (it writes it into audit.json); 500 in the shipped ranking. */
export const cutOf = (json) => json.cut ?? 500;

export function diffRanking(baseJson, liveJson) {
  const B = rowMap(baseJson);
  const L = rowMap(liveJson);
  const topB = new Set(baseJson.ranked.filter((r) => r.top).map((r) => r.concept));
  const topL = new Set(liveJson.ranked.filter((r) => r.top).map((r) => r.concept));
  const lost = [...B.values()].filter((r) => r.P && !L.get(r.concept)?.P).map((r) => r.concept);
  const gained = [...L.values()].filter((r) => r.P && !B.get(r.concept)?.P).map((r) => r.concept);
  const changed = [];
  const tierChanged = [];
  for (const [c, b] of B) {
    const l = L.get(c);
    if (!l) continue;
    if (b.tier !== l.tier || b.category !== l.category) tierChanged.push({ concept: c, before: pick(b), after: pick(l) });
    if (b.P !== l.P || b.votes !== l.votes || b.score !== l.score || !!b.evidence !== !!l.evidence) changed.push({ concept: c, before: pick(b), after: pick(l) });
  }
  const entered = [...topL].filter((c) => !topB.has(c));
  const left = [...topB].filter((c) => !topL.has(c));
  const reason = (c) => {
    const l = L.get(c);
    if (!l || !l.evidence || l.tier < 1 || l.tier > 2) return 'no vote left';
    return l.top ? 'stays' : `cut at rank ${l.rank}`;
  };
  const d23 = [...B.values()].filter((r) => r.d23);
  return {
    base: { backed: backed(baseJson).length, top: topB.size, bands: band([...topB].map((c) => B.get(c))) },
    live: { backed: backed(liveJson).length, top: topL.size, bands: band([...topL].map((c) => L.get(c))) },
    lost, gained, changed, tierChanged,
    entered, left, leftWhy: left.map((c) => ({ concept: c, why: reason(c) })),
    beyondCut: backed(liveJson).filter((r) => !r.top).map((r) => ({ concept: r.concept, rank: r.rank })),
    d23: {
      names: d23.length,
      insideBefore: d23.filter((r) => r.top).length,
      insideAfter: d23.filter((r) => L.get(r.concept)?.top).length,
      changed: d23.filter((r) => changed.some((x) => x.concept === r.concept)).map((r) => r.concept),
      movedRank: d23.filter((r) => r.rank !== L.get(r.concept)?.rank).length,
      outsideBoth: d23.filter((r) => !r.top && !L.get(r.concept)?.top).map((r) => r.concept),
    },
    B, L,
  };
}

/** Tier 3 concepts with two or more votes — the "held back" list at the foot of ranked.md. */
export const heldBack = (json) => json.ranked.filter((r) => r.tier === 3 && r.score >= 2).map((r) => r.concept);

/** The counts docs/06-audit.md states, measured on one run's audit.json. */
export function countsOf(json) {
  const t = json.ranked.filter((r) => r.top);
  const catN = (k) => t.filter((r) => r.category === k).length;
  return {
    backed: t.length, bands: band(t), arrowsUi: catN('arrows') + catN('ui'), tier2: t.filter((r) => r.tier === 2).length,
    variants: t.filter((r) => r.variantOf).length, held: heldBack(json).length,
    excl: json.excluded.length, platform: json.excluded.filter((r) => r.category === 'platform').length, logos: json.excluded.filter((r) => r.category === 'brands').length,
  };
}
/** docs/06-audit.md:40-49, 97, 117, 132, 139 — the figures the archive run must reproduce. */
export const DOC06_EXPECTED = { backed: 487, bands: [126, 226, 135], slots: 13, arrowsUi: 114, tier2: 161, variants: 145, held: 29, platform: 118, d23: 120, d23In: 114 };
export function matchesDoc06(c, { cut, d23Names, d23In }, want = DOC06_EXPECTED) {
  return c.backed === want.backed && c.bands[3] === want.bands[0] && c.bands[2] === want.bands[1] && c.bands[1] === want.bands[2] && cut - c.backed === want.slots
    && c.arrowsUi === want.arrowsUi && c.tier2 === want.tier2 && c.variants === want.variants && c.held === want.held && c.platform === want.platform
    && d23Names === want.d23 && d23In === want.d23In;
}

/** The entrants (concepts that come inside the cut) that are variants, and what each variant sits on:
 *  a base inside the cut, or one outside it (a Shopify-only concept is outside the ranking altogether). */
export function entrantBases(D) {
  const rows = D.entered.map((c) => D.L.get(c));
  const variants = rows.filter((r) => r.variantOf);
  const onBase = (r) => D.L.get(r.variantOf);
  return {
    variants: variants.map((r) => r.concept),
    onTop: variants.filter((r) => onBase(r)?.top).map((r) => r.concept),
    offTop: variants.filter((r) => !onBase(r)?.top).map((r) => ({ concept: r.concept, base: r.variantOf, baseTier: onBase(r)?.tier ?? null, baseCategory: onBase(r)?.category ?? null })),
    bases: rows.filter((r) => !r.variantOf).map((r) => r.concept),
  };
}

/** Ranked concepts whose name starts with a Shopify-only concept without being listed themselves.
 *  `PLATFORM` matches exact names, and a name takes its category from the table concept it starts with,
 *  so the exclusion does not travel: `catalog-product` is Commerce, Tier 2, in. */
export function shopifyRiders(json, platformSet) {
  const startsWith = (c) => { const t = c.split('-'); for (let n = t.length - 1; n > 0; n--) { const q = t.slice(0, n).join('-'); if (platformSet.has(q)) return q; } return null; };
  // `ranked` holds no Shopify-only name itself (tools/audit.mjs puts every Tier 0 row in `excluded`), so every hit rides on a listed base
  return json.ranked.map((r) => ({ concept: r.concept, base: startsWith(r.concept), tier: r.tier, top: !!r.top })).filter((x) => x.base);
}

// The Lucide category tags tools/audit.mjs can map to one of its own categories — the keys of its FROM_LUCIDE
// (tools/audit.mjs:83-89). A drift guard in the test compares them with the file.
export const LUCIDE_MAPPED_TAGS = ['arrows', 'layout', 'navigation', 'cursors', 'files', 'account', 'people', 'security', 'communication', 'mail', 'social', 'notifications', 'time', 'text', 'charts', 'finance', 'shopping', 'multimedia', 'photography', 'devices', 'connectivity', 'development', 'design', 'shapes', 'tools'];

/** Which branch of tools/audit.mjs `inferCategory` (lines 92-105) placed a concept the table has no row for,
 *  in that function's own order: the start of its name, then Lucide's tags when none of them maps (Tier 3),
 *  then Nucleo UI's category, then Lucide's tags by majority, then nothing (Tier 3). */
export function placementOf(concept, row, { matcher, lucide }) {
  if (matcher.inTable(concept)) return { kind: 'table' };
  if (matcher.isBrand(concept)) return { kind: 'brand' };
  const t = concept.split('-');
  while (t.length > 1) { t.pop(); const b = t.join('-'); if (matcher.inTable(b)) return { kind: 'prefix', via: b }; }
  const rec = lucide.find((x) => row.names.lucide.includes(x.name));
  const lc = rec?.categories ?? [];
  if (lc.length && !lc.some((x) => LUCIDE_MAPPED_TAGS.includes(x))) return { kind: 'lucide-unmapped' };
  if (row.nucleoUI) return { kind: 'nucleo-ui' };
  if (lc.length) return { kind: 'lucide' };
  return { kind: 'default' };
}
export const PLACEMENT_WORDS = {
  prefix: 'a table concept at the start of its name', 'lucide-unmapped': "Lucide's category tags (none maps: Tier 3)", 'nucleo-ui': "Nucleo UI's category",
  lucide: "Lucide's category tags", default: 'nothing: Tier 3 by default', table: 'the table', brand: 'the logo prefix',
};

/** `## Heading — N` / `## Heading (N)` lines of a ranked.md, plus its first line's count. */
export function rankedHeadings(md) {
  const out = [];
  for (const line of md.split('\n')) {
    const m = /^## (.+?)(?: — (\d+)| \((\d+)\))$/.exec(line);
    if (m) out.push({ title: m[1], n: Number(m[2] ?? m[3]) });
  }
  const first = /Evidence-backed concepts: \*\*(\d+)\*\*(?: — \*\*(\d+) slots open\*\*)?/.exec(md);
  return { headings: out, backed: first ? Number(first[1]) : null, slotsOpen: first && first[2] ? Number(first[2]) : 0 };
}

// ── composites, by name ──────────────────────────────────────────────────────────────────────
// The last words that make a name `<object>-<modifier>` of the corner-badge kind. STRICT_TAILS are the
// modifiers of the 38 names in findings-grammar.md:273 (plus, minus, check, x, lock, clock, down, up,
// download, heart, alert, user, search, follow-up); SPELLING_TAILS are the spellings Polaris and the audit's own
// table give the same modifiers (add, new, remove, cancel, check-mark, secure, time, person). A name
// is a composite of the kind when its tail is one of these and its object is not a direction word
// whose tail IS the object's own direction (arrow-up, chevron-down, caret-up, thumbs-up).
export const STRICT_TAILS = ['follow-up', 'download', 'plus', 'minus', 'check', 'x', 'alert', 'lock', 'clock', 'heart', 'search', 'user', 'up', 'down'];
export const SPELLING_TAILS = ['check-mark', 'add', 'new', 'remove', 'cancel', 'secure', 'time', 'person'];
export const BADGE_TAILS = [...STRICT_TAILS, ...SPELLING_TAILS];
export const DIRECTION_OBJECTS = ['arrow', 'chevron', 'caret', 'thumbs'];

export function tailOf(name, tails = BADGE_TAILS) {
  for (const t of tails) if (name === t ? false : name.endsWith(`-${t}`)) return { tail: t, object: name.slice(0, -(t.length + 1)) };
  return null;
}

export function badgeComposites(names, tails = BADGE_TAILS, directions = DIRECTION_OBJECTS) {
  const out = [];
  for (const n of names) {
    const t = tailOf(n, tails);
    if (!t || directions.includes(t.object)) continue;
    out.push({ name: n, ...t });
  }
  return out;
}

/** Every last word and how many names end with it (names of two or more words only). */
export function tailTable(names) {
  const m = new Map();
  for (const n of names) { const t = n.split('-'); if (t.length < 2) continue; const w = t.at(-1); if (!m.has(w)) m.set(w, []); m.get(w).push(n); }
  return [...m.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

/** Live names that share a whole word with a slot, ignoring last words that `generic` or more live names end with
 *  (`list`, `circle`, `add`…): leads for the eye, not matches. */
export function slotLeads(slot, liveNames, generic = 4) {
  const common = new Set(tailTable(liveNames).filter(([, ns]) => ns.length >= generic).map(([w]) => w));
  const words = slot.split('-').filter((x) => !common.has(x));
  return liveNames.filter((n) => n.split('-').some((x) => words.includes(x)));
}

/** Names from a cited line range that are missing from the cited text — a guard against the doc moving. */
export function missingFrom(text, from, to, names) {
  const span = text.split('\n').slice(from - 1, to).join('\n');
  return names.filter((n) => {
    if (/^arrow-(up|down|left|right)-circle$/.test(n)) return !/arrow-\{up,down,left,right\}-circle/.test(span);
    return !new RegExp(`(^|[^a-z0-9-])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9-]|$)`).test(span);
  });
}

// ── what the bridge returned ─────────────────────────────────────────────────────────────────
/** Unwraps what the host saved from `figma_execute` (an envelope around `result`), drops the pad
 *  and checks the checksum the snippet computed inside Figma. */
export function unwrapCapture(text) {
  const env = JSON.parse(text);
  if (env && env.success === false) throw new Error(`the bridge call failed: ${env.error}`);
  const r = env && env.result ? env.result : env;
  if (!r || r.kind !== 'polaris-live-list/1' || !Array.isArray(r.rows)) throw new Error('not a polaris-live-list/1 capture');
  delete r.pad;
  const recomputed = fnv(r.rows.map((x) => x.slice(0, 4).join('|')).join('\n'));
  if (r.hash && r.hash !== recomputed) throw new Error(`checksum differs: recorded ${r.hash}, recomputed ${recomputed}`);
  if (env && env.fileContext) r.fileContext = env.fileContext;
  return { list: r, recomputed };
}

/** §0.2 — the live page against the catalogue on disk: names, order, first node, items, canvas. */
export function compareCatalogue(live, cat) {
  const groups = new Map();
  for (const n of live.nodes) {
    if (!groups.has(n.base)) groups.set(n.base, []);
    groups.get(n.base).push(n);
  }
  const liveRows = [...groups.entries()].map(([name, ns]) => ({ name, items: ns.length, id: ns[0].id, w: ns[0].w, h: ns[0].h }));
  const catRows = cat.rows.map((r) => ({ name: r[1], items: r[3], id: r[8], w: r[6], h: r[7] }));
  const liveSet = new Set(liveRows.map((r) => r.name));
  const catSet = new Set(catRows.map((r) => r.name));
  const catBy = new Map(catRows.map((r) => [r.name, r]));
  const diffs = [];
  for (const r of liveRows) {
    const c = catBy.get(r.name);
    if (!c) continue;
    for (const k of ['items', 'id', 'w', 'h']) if (r[k] !== c[k] && !(r[k] == null || c[k] == null)) diffs.push({ name: r.name, field: k, live: r[k], catalogue: c[k] });
  }
  return {
    liveNames: liveRows.length, catalogueNames: catRows.length,
    onlyLive: liveRows.filter((r) => !catSet.has(r.name)).map((r) => r.name),
    onlyCatalogue: catRows.filter((r) => !liveSet.has(r.name)).map((r) => r.name),
    sameOrder: JSON.stringify(liveRows.map((r) => r.name)) === JSON.stringify(catRows.map((r) => r.name)),
    fieldDiffs: diffs,
    liveDrawings: live.nodes.length, catalogueDrawings: catRows.reduce((s, r) => s + r.items, 0),
    firstIdsCompared: liveRows.filter((r) => catBy.has(r.name) && r.id != null && catBy.get(r.name).id != null).length,
  };
}

/** §0.4 — a page listing of the Fluent file: how many pages, and does any of them look like Polaris. */
export function fluentPageReport(f) {
  const polaris = f.pages.filter((x) => /polaris|polarris/i.test(x.name ?? ''));
  return { pages: f.pages.length, polaris, hasPolarisId: f.pages.some((x) => x.id === FIGMA.pageId) };
}

// ── the scratch re-rank ──────────────────────────────────────────────────────────────────────
const AUDIT_FILES = ['ranked.md', 'audit.csv', 'audit.json'];

/** Runs tools/audit.mjs in a scratch copy of HEAD twice: with the archive (to prove the copy
 *  reproduces research/), then with the live names. Writes only under `scratch`. */
export function runRerank({ repo = REPO, scratch, live, force = false }) {
  assertOutsideRepo(scratch, repo);
  const root = join(resolvePath(scratch), 'rerank');
  const outDir = join(resolvePath(scratch), 'rerank-out');
  const sentinel = join(outDir, '.polaris-scope.json');
  // Only ever delete what this tool made: a directory counts as ours when `rerank-out` carries the sentinel.
  // Checked first, and without git, so an unrelated folder is refused whatever the repo looks like.
  if ((existsSync(root) || existsSync(outDir)) && !existsSync(sentinel)) throw new Error(`refusing to delete ${root} or ${outDir}: this tool did not make them (no ${basename(sentinel)})`);
  let headSha;
  try { headSha = git(repo, ['rev-parse', 'HEAD'], { stdio: ['ignore', 'pipe', 'pipe'] }).trim(); } catch { throw new Error(`rerank needs a git checkout (it copies HEAD with git archive): ${repo} is not one`); }
  const livePolaris = JSON.stringify(shapeLive(live).map((r) => r)).replace(/\},\{/g, '},\n{');
  const liveSha = sha1(livePolaris);
  const have = (d) => AUDIT_FILES.every((f) => existsSync(join(outDir, d, f))) && existsSync(join(outDir, d, 'stdout.txt'));
  if (!force && existsSync(sentinel) && have('base') && have('live')) {
    const s = JSON.parse(readFileSync(sentinel, 'utf8'));
    if (s.head === headSha && s.liveSha === liveSha) return { ...readRerank(outDir), cached: true, root, outDir, head: headSha, liveSha };
  }
  rmSync(root, { recursive: true, force: true });
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(root, { recursive: true });
  mkdirSync(join(outDir, 'base'), { recursive: true });
  mkdirSync(join(outDir, 'live'), { recursive: true });
  writeFileSync(sentinel, JSON.stringify({ building: true, head: headSha, at: new Date().toISOString() }));
  execFileSync('sh', ['-c', 'git -C "$1" archive HEAD | tar -x -C "$2"', 'sh', repo, root], { stdio: 'pipe' });
  const run = (dest) => {
    const stdout = execFileSync('node', ['tools/audit.mjs'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    writeFileSync(join(outDir, dest, 'stdout.txt'), stdout);
    for (const f of AUDIT_FILES) copyFileSync(join(root, 'research', f), join(outDir, dest, f));
  };
  run('base');
  writeFileSync(join(root, 'research/sources/polaris.json'), `${livePolaris}\n`);
  run('live');
  writeFileSync(join(outDir, 'polaris.live.json'), `${livePolaris}\n`);
  const d = spawnSync('diff', ['-u', join(outDir, 'base/ranked.md'), join(outDir, 'live/ranked.md')], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(join(outDir, 'ranked.diff'), d.stdout);
  writeFileSync(sentinel, JSON.stringify({ head: headSha, liveSha, at: new Date().toISOString() }));
  return { ...readRerank(outDir), cached: false, root, outDir, head: headSha, liveSha };
}

function readRerank(outDir) {
  const load = (d) => ({
    json: JSON.parse(readFileSync(join(outDir, d, 'audit.json'), 'utf8')),
    md: readFileSync(join(outDir, d, 'ranked.md'), 'utf8'),
    csv: readFileSync(join(outDir, d, 'audit.csv'), 'utf8'),
    stdout: readFileSync(join(outDir, d, 'stdout.txt'), 'utf8'),
  });
  return { base: load('base'), live: load('live'), diffText: readFileSync(join(outDir, 'ranked.diff'), 'utf8') };
}

// ── sections ─────────────────────────────────────────────────────────────────────────────────
async function context(opts) {
  const repo = opts.repo ?? REPO;
  const { matcher, D23, CATEGORIES } = await repoMatcher(repo);
  const archivePath = opts.archive ?? join(repo, 'research/sources/polaris.json');
  const archive = JSON.parse(readFileSync(archivePath, 'utf8'));
  const arcNames = archive.map((r) => kebab(r.name));
  const arcTwins = archive.filter((r) => r.filled).length;
  const livePath = opts.live ?? join(repo, 'research/references/polaris/figma/catalogue.json');
  const live = existsSync(livePath) ? liveFrom(JSON.parse(readFileSync(livePath, 'utf8'))) : null;
  const lucide = JSON.parse(readIf(repo, 'research/sources/lucide.json') || '[]');
  return { repo, matcher, D23, CATEGORIES, archive, arcNames, arcTwins, live, livePath, lucide, opts, pin: opts.pin ?? PIN };
}

const needLive = (ctx) => { if (!ctx.live) throw new Error(`--live is required (not found: ${ctx.livePath})`); return ctx.live; };
const needScratch = (ctx) => { if (!ctx.opts.scratch) throw new Error('--scratch DIR is required'); return ctx.opts.scratch; };
const resolveP = (ctx) => (raw) => ctx.matcher.resolve('polaris', raw);

const SNIPPETS = {
  list: `// figma_execute · fileKey ${FIGMA.fileKey} · timeout 30000 · READ ONLY
const T0 = Date.now();
const page = await figma.getNodeByIdAsync('${FIGMA.pageId}');
if (!page || page.type !== 'PAGE') return { error: 'page not found', got: page ? page.type : null };
await page.loadAsync();
const top = page.children.map((c) => ({ id: c.id, type: c.type, name: c.name, kids: ('children' in c) ? c.children.length : 0 }));
const comps = page.findAllWithCriteria({ types: ['COMPONENT'] });
const rows = comps.map((c) => [c.id, c.name, c.width, c.height, c.parent ? c.parent.id : null]);
const counts = {};
for (const t of ['COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'FRAME', 'SECTION', 'GROUP', 'TEXT', 'VECTOR']) {
  counts[t] = page.findAllWithCriteria({ types: [t] }).length;
}
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const hash = fnv(rows.map((r) => r.slice(0, 4).join('|')).join('\\n'));
const res = { kind: 'polaris-live-list/1', file: figma.root.name, page: { id: page.id, name: page.name, type: page.type }, at: new Date().toISOString(), ms: Date.now() - T0, top, counts, hash, columns: ['id', 'name', 'w', 'h', 'parent'], rows };
const len = JSON.stringify(res).length;
res.pad = 'a'.repeat(Math.max(0, 120000 - len));   // past ~100k the host saves the answer to disk and shows only its path
return res;`,
  pages: `// figma_execute · fileKey ${FIGMA.fileKey} (the Polaris file) or ${FLUENT_KEY} (the Fluent file) · timeout 30000 · READ ONLY
// Do NOT add figma.getNodeByIdAsync('${DEAD_NODE}'): on an id that is not in the file it timed out twice (10 s) on 2026-10-05.
return { file: figma.root.name, at: new Date().toISOString(), pages: figma.root.children.map((p) => ({ id: p.id, name: p.name, type: p.type })) };`,
};
// The Fluent file's page list is exactly the one-liner the main session ran on 2026-10-05T06:01Z (it answered six pages; a separator
// comes back with an empty name). Save the answer as the file `--pages-fluent` reads (the shape is in the second comment).
SNIPPETS['fluent-pages'] = `// figma_execute · fileKey ${FLUENT_KEY} (the Fluent file) · timeout 30000 · READ ONLY
return figma.root.children.map(p => ({id: p.id, name: p.name}))
// --pages-fluent reads {"kind":"polaris-pages/1","file":"<the file's name>","fileKey":"${FLUENT_KEY}","at":"<when>","by":"<who ran it>","pages":[<the answer; a page with no name as {"id":"…","name":null,"note":"a separator"}>]}`;

async function sectionScript(ctx) {
  const which = ctx.opts._[1] ?? 'list';
  if (!SNIPPETS[which]) throw new Error('script list | pages | fluent-pages');
  out(SNIPPETS[which]);
}

async function sectionCapture(ctx) {
  const saved = ctx.opts._[1];
  if (!saved || !ctx.opts.out) throw new Error('capture SAVED --out FILE');
  assertOutsideRepo(ctx.opts.out, ctx.repo);
  const { list, recomputed } = unwrapCapture(readFileSync(saved, 'utf8'));
  mkdirSync(dirname(resolvePath(ctx.opts.out)), { recursive: true });
  writeFileSync(ctx.opts.out, `${JSON.stringify(list)}\n`);
  out(`captured ${list.rows.length} rows from page ${list.page.id} "${list.page.name}" of "${list.file}" at ${list.at}`);
  out(`checksum recorded ${list.hash} · recomputed ${recomputed} · ${list.hash === recomputed ? 'equal' : 'DIFFERENT'}`);
  out(`written ${ctx.opts.out} (the pad is dropped)`);
}

async function sectionBridge(ctx) {
  const live = needLive(ctx);
  head('§0.1 the live page, as the bridge returned it');
  if (live.kind !== 'bridge') { out(`--live is a ${live.kind}, not a bridge capture; §0.1 needs a capture (script list → capture).`); }
  else {
    const m = live.meta;
    out(`file "${m.file}" · page ${m.page.id} "${m.page.name}" (${m.page.type}) · captured ${m.at}`);
    out(`direct children of the page: ${m.top.map((t) => `${t.type}${t.name ? ` "${t.name}"` : ''} id ${t.id} holding ${t.kids}`).join('; ')}`);
    out(`node counts (COMPONENT_SET, INSTANCE, FRAME, GROUP and TEXT are the ones that would change the reading): ${Object.entries(m.counts).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
    const sizes = new Map();
    for (const n of live.nodes) { const k = `${n.w}×${n.h}`; sizes.set(k, (sizes.get(k) ?? 0) + 1); }
    out(`canvas of the ${live.nodes.length} components: ${[...sizes].map(([k, v]) => `${k} ×${v}`).join(' · ')}`);
    const recomputed = fnv(live.nodes.map((n) => [n.id, n.name, n.w, n.h].join('|')).join('\n'));
    out(`checksum computed in Figma ${m.hash} · recomputed from the saved rows ${recomputed} · ${m.hash === recomputed ? 'equal' : 'DIFFERENT'}`);
  }
  out(`names after folding \`-filled\` into the base: ${live.names.length} · drawings: ${live.drawings} · names with a filled twin: ${live.twins.size} (${code([...live.twins])}) · twins with no base: ${live.orphanTwins.length}`);
  const sorted = [...live.names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  out(`page order is alphabetical: ${JSON.stringify(sorted) === JSON.stringify(live.names) ? 'yes' : 'no'}`);

  head('§0.2 against the catalogue on disk');
  const catPath = ctx.opts.catalogue ?? join(ctx.repo, 'research/references/polaris/figma/catalogue.json');
  if (!existsSync(catPath)) { out(`catalogue not on disk (${catPath}; research/references/ is gitignored) — comparison skipped.`); }
  else {
    const cat = JSON.parse(readFileSync(catPath, 'utf8'));
    out(`catalogue: "${cat.file.name}" (${cat.file.key}) · page ${cat.page.id} "${cat.page.name}" · captured ${cat.at} · ${cat.enumerated} names (the catalogue's own word is "concepts")`);
    const c = compareCatalogue(live, cat);
    out(`names: live ${c.liveNames} · catalogue ${c.catalogueNames} · drawings: live ${c.liveDrawings} · catalogue ${c.catalogueDrawings}`);
    out(`names only in the live page: ${code(c.onlyLive)} · only in the catalogue: ${code(c.onlyCatalogue)}`);
    out(`same names in the same order: ${c.sameOrder ? 'yes' : 'NO'} · first-node ids compared: ${c.firstIdsCompared}, item counts and canvas compared for every name · field differences: ${c.fieldDiffs.length}`);
    for (const d of c.fieldDiffs) out(`  - ${d.name}: ${d.field} live ${d.live}, catalogue ${d.catalogue}`);
    out(`result: ${!c.onlyLive.length && !c.onlyCatalogue.length && c.sameOrder && !c.fieldDiffs.length && c.liveDrawings === c.catalogueDrawings ? 'THE CATALOGUE STILL MATCHES THE LIVE PAGE' : 'THE LIVE PAGE DIFFERS FROM THE CATALOGUE'}`);
  }

  head('§0.3 the pages of the file');
  if (!ctx.opts.pages || !existsSync(ctx.opts.pages)) out('(no --pages capture given)');
  else {
    const p = JSON.parse(readFileSync(ctx.opts.pages, 'utf8'));
    out(`file "${p.file}" (${p.fileKey}) · captured ${p.at} · ${p.pages.length} pages:`);
    table(['page id', 'name'], p.pages.map((x) => [`\`${x.id}\``, x.name]));
    out(`the Polaris page ${FIGMA.pageId} is among them: ${p.pages.some((x) => x.id === FIGMA.pageId) ? 'yes' : 'NO'} · a page whose id begins "${DEAD_NODE.split(':')[0]}:": ${p.pages.some((x) => x.id.startsWith(`${DEAD_NODE.split(':')[0]}:`)) ? 'yes' : 'none'}`);
    if (p.deadNodeLookup) out(`the dead pointer ${p.deadNodeLookup.id}: ${p.deadNodeLookup.result}`);
  }

  head(`§0.4 the pages of the Fluent file (${FLUENT_KEY}), where stale-statements.md:133 says the live Polaris source is`);
  if (!ctx.opts['pages-fluent'] || !existsSync(ctx.opts['pages-fluent'])) out('(no --pages-fluent capture given; `script pages` run with that fileKey makes one)');
  else {
    const f = JSON.parse(readFileSync(ctx.opts['pages-fluent'], 'utf8'));
    const r = fluentPageReport(f);
    out(`file "${f.file}" (${f.fileKey}) · listed ${f.at}${f.by ? ` · ${f.by}` : ''} · ${r.pages} pages:`);
    table(['page id', 'name'], f.pages.map((x) => [`\`${x.id}\``, x.name ?? `(${x.note ?? 'no name'})`]));
    out(`pages whose name contains "Polaris" or "Polarris": ${r.polaris.length ? code(r.polaris.map((x) => x.name)) : 'none'} · the page ${FIGMA.pageId} among them: ${r.hasPolarisId ? 'yes' : 'no'} · result: ${r.polaris.length || r.hasPolarisId ? 'THE FLUENT FILE HOLDS A POLARIS PAGE' : 'THE FLUENT FILE HAS NO POLARIS PAGE'}`);
  }
}

async function sectionNames(ctx) {
  const live = needLive(ctx);
  const { matcher } = ctx;
  const r = resolveP(ctx);
  const A = nameCounts(ctx.arcNames, ctx.arcTwins, matcher);
  const L = nameCounts(live.names, live.twins.size, matcher);
  head('§1.1 how many, by the audit\'s own counting rule');
  out('The rule is tools/audit.mjs:50 — `kebab` the name, `resolve(\'polaris\', raw)` through research/synonyms.mjs, one concept per distinct result. A concept is Shopify-only when research/synonyms.mjs PLATFORM lists it (tier 0, "excluded"), a logo when it starts `logo-` and is not in the table (also tier 0).');
  out();
  table(['', 'archive (research/sources/polaris.json)', 'live page'], [
    ['names (outline bases; a filled twin is folded into its base)', A.names, L.names],
    ['names with a filled twin', A.twins, L.twins],
    ['drawings (names + twins)', A.drawings, L.drawings],
    ['**concepts** after the rule', `**${A.concepts}**`, `**${L.concepts}**`],
    ['of which Shopify-only (PLATFORM)', A.platform, L.platform],
    ['of which logos', A.logos, L.logos],
    ['concepts the ranking can use (tier 1–3)', A.rest, L.rest],
  ]);
  out(`names that fold into a concept another name already reaches (names − concepts): archive ${A.names - A.concepts} · live ${L.names - L.concepts}`);
  const collapse = (X) => [...X.byC].filter(([, ns]) => ns.length > 1).sort((a, b) => b[1].length - a[1].length);
  out(`concepts reached by more than one name: archive ${collapse(A).length} · live ${collapse(L).length}; the largest: archive ${collapse(A).slice(0, 4).map(([c, ns]) => `\`${c}\` ×${ns.length}`).join(', ')} · live ${collapse(L).slice(0, 4).map(([c, ns]) => `\`${c}\` ×${ns.length}`).join(', ')}`);

  const arcTwinNames = new Set(ctx.archive.filter((x) => x.filled).map((x) => kebab(x.name)));
  out(`filled twins: archive ${arcTwinNames.size} · live ${live.twins.size} · a twin on both sides ${[...live.twins].filter((n) => arcTwinNames.has(n)).length} (${code([...live.twins].filter((n) => arcTwinNames.has(n)))}) · a twin on the live page only ${[...live.twins].filter((n) => !arcTwinNames.has(n)).length} (${code([...live.twins].filter((n) => !arcTwinNames.has(n)))}) · of the archive's twins, a name the live page no longer draws at all: ${[...arcTwinNames].filter((n) => !live.names.includes(n)).length}`);
  const d = diffNames(ctx.arcNames, live.names, r);
  head('§1.2 names, archive against live');
  out(`same name on both sides: ${d.same.length} · only in the archive: ${d.archiveOnly.length} · only in the live page: ${d.liveOnly.length}`);
  const kinds = (xs) => xs.reduce((a, x) => ((a[x.kind] = (a[x.kind] ?? 0) + 1), a), {});
  out(`the ${d.archiveOnly.length} archive-only names: ${JSON.stringify(kinds(d.archiveOnly))} · the ${d.liveOnly.length} live-only names: ${JSON.stringify(kinds(d.liveOnly))}`);
  out('`respelled` = the name changed and the audit\'s rule still lands both on one concept (no effect on the ranking); `folded` = the concept survives under a name both sides share, and this was an extra spelling; `gone` / `new` = the concept has no name on the other side.');
  out();
  const respelled = d.archiveOnly.filter((x) => x.kind === 'respelled');
  const respelledBy = new Map();
  for (const x of respelled) { if (!respelledBy.has(x.concept)) respelledBy.set(x.concept, { archive: [], live: x.theirs }); respelledBy.get(x.concept).archive.push(x.name); }
  table(['concept the rule gives both', 'archive name(s)', 'live name(s)'], [...respelledBy].map(([c, v]) => [`\`${c}\``, code(v.archive), code(v.live)]));
  out(`respelled: ${respelled.length} archive names in ${respelledBy.size} concepts`);
  const folded = d.archiveOnly.filter((x) => x.kind === 'folded');
  out(`**folded, archive side (${folded.length}):** ${folded.map((x) => `\`${x.name}\` → \`${x.concept}\` (live: ${x.theirs.join(', ')})`).join(' · ') || '—'}`);
  const foldedLive = d.liveOnly.filter((x) => x.kind === 'folded');
  out(`**folded, live side (${foldedLive.length}) — a live name the rule merges into a concept that already had a Polaris name:** ${foldedLive.map((x) => `\`${x.name}\` joins ${code(d.arcByC.get(x.concept))} in \`${x.concept}\``).join(' · ') || '—'}`);
  out();
  head('§1.3 concepts, archive against live');
  out(`concepts: archive ${A.concepts} · live ${L.concepts} · kept ${d.keptConcepts.length} · gone ${d.goneConcepts.length} · new ${d.newConcepts.length} (${A.concepts} − ${d.goneConcepts.length} + ${d.newConcepts.length} = ${A.concepts - d.goneConcepts.length + d.newConcepts.length})`);
  const tag = (c) => (matcher.isPlatform(c) ? 'Shopify-only' : matcher.isBrand(c) ? 'logo' : matcher.inTable(c) ? matcher.category[c] : 'not in the table');
  out();
  table(['gone from the live page', 'archive name', 'filter'], d.goneConcepts.map((c) => [`\`${c}\``, code(d.arcByC.get(c)), tag(c)]));
  table(['new on the live page', 'live name', 'filter'], d.newConcepts.map((c) => [`\`${c}\``, code(d.liveByC.get(c)), tag(c)]));
  const gonePlatform = d.goneConcepts.filter((c) => matcher.isPlatform(c)).length;
  const goneLogo = d.goneConcepts.filter((c) => matcher.isBrand(c)).length;
  out(`gone: ${d.goneConcepts.length} = ${gonePlatform} Shopify-only + ${goneLogo} logos + ${d.goneConcepts.length - gonePlatform - goneLogo} others (${code(d.goneConcepts.filter((c) => !matcher.isPlatform(c) && !matcher.isBrand(c)))})`);
  const newPlatform = d.newConcepts.filter((c) => matcher.isPlatform(c)).length;
  const newNotInTable = d.newConcepts.filter((c) => !matcher.inTable(c));
  out(`new: ${d.newConcepts.length} = ${newPlatform} Shopify-only + ${d.newConcepts.length - newPlatform} others; ${d.newConcepts.length - newPlatform - newNotInTable.filter((c) => !matcher.isPlatform(c)).length} of the others are in the table already (another set draws them), ${newNotInTable.filter((c) => !matcher.isPlatform(c)).length} are not in the table at all`);
  out(`new, with no row in research/synonyms.mjs (the rule places each by the start of its name, by Lucide's or Nucleo's category, or in Tier 3): ${code(newNotInTable)}`);
  head('§1.4 leads on renames the table does not know (names only — shares a whole word; not facts)');
  const leads = renameLeads(d);
  const leadBy = new Map();
  for (const x of leads) { if (!leadBy.has(x.gone)) leadBy.set(x.gone, { goneNames: x.goneNames, now: [], shared: new Set() }); leadBy.get(x.gone).now.push(...x.nowNames); x.shared.forEach((w) => leadBy.get(x.gone).shared.add(w)); }
  table(['gone', 'new names sharing a word', 'shared word'], [...leadBy.values()].map((x) => [code(x.goneNames), code(x.now), [...x.shared].join(', ')]));
  out(`gone concepts with a lead: ${leadBy.size} of ${d.goneConcepts.length}`);
}

async function sectionRerank(ctx) {
  const live = needLive(ctx);
  const scratch = needScratch(ctx);
  const R = runRerank({ repo: ctx.repo, scratch, live, force: !!ctx.opts.force });
  const { repo } = ctx;
  head('§2.1 the scratch copy reproduces research/');
  out(`HEAD ${R.head.slice(0, 7)} copied with \`git archive HEAD | tar -x\` into ${R.root} (${R.cached ? 'cached run, same HEAD and same live names' : 'built now'}); \`node tools/audit.mjs\` run there with the archive.`);
  const headBlob = (f) => git(repo, ['show', `HEAD:research/${f}`], { encoding: 'buffer' });
  const rows = AUDIT_FILES.map((f) => {
    const wt = readFileSync(join(repo, 'research', f));
    const hd = headBlob(f);
    const sc = readFileSync(join(R.outDir, 'base', f));
    return [`research/${f}`, sha1(wt).slice(0, 12), sha1(hd).slice(0, 12), sha1(sc).slice(0, 12), wt.equals(sc) && hd.equals(sc) ? 'byte-identical' : '**DIFFERENT**'];
  });
  table(['file', 'working tree', 'HEAD', 'scratch run', ''], rows);
  const inputs = git(repo, ['diff', '--stat', ctx.pin, 'HEAD', '--', 'tools/audit.mjs', 'research/synonyms.mjs', 'research/sources']).trim();
  out(`the audit's inputs (tools/audit.mjs, research/synonyms.mjs, research/sources/) between the pin ${ctx.pin} and HEAD: ${inputs ? `CHANGED\n${inputs}` : 'identical'}`);
  if (AUDIT_FILES.some((f) => !readFileSync(join(repo, 'research', f)).equals(readFileSync(join(R.outDir, 'base', f))))) { out('STOP — the scratch copy does not reproduce research/; nothing below is meaningful.'); return; }

  const polarisLine = (s) => s.split('\n').filter((l) => l.startsWith('concepts:') || l.startsWith('evidence') || l.startsWith('D23')).join(' | ');
  head('§2.2 the two runs, as the tool prints them');
  out(`archive: ${polarisLine(R.base.stdout)}`);
  out(`live:    ${polarisLine(R.live.stdout)}`);
  out(`the live file: ${live.names.length} records of the same shape as research/sources/polaris.json (\`name\`, \`filled\`, \`keywords\` empty); sha1 ${R.liveSha.slice(0, 12)}`);

  const matcher = ctx.matcher;
  const resolveFn = resolveP(ctx);
  const aSet = (json) => new Set([...json.ranked, ...json.excluded].filter((r) => r.P).map((r) => r.concept));
  const mA = new Set(conceptMap(ctx.arcNames, resolveFn).keys());
  const mL = new Set(conceptMap(live.names, resolveFn).keys());
  out(`my matcher against the tool's own P flags: archive ${setEq(mA, aSet(R.base.json)) ? `agrees on all ${mA.size}` : 'DISAGREES'} · live ${setEq(mL, aSet(R.live.json)) ? `agrees on all ${mL.size}` : 'DISAGREES'}`);
  const pCats = (json) => { const P = [...json.ranked, ...json.excluded].filter((r) => r.P); const t = { 0: 0, 1: 0, 2: 0, 3: 0 }; for (const r of P) t[r.tier] += 1; return { all: P.length, platform: P.filter((r) => r.category === 'platform').length, brands: P.filter((r) => r.category === 'brands').length, tiers: t }; };
  const pb = pCats(R.base.json);
  const pl = pCats(R.live.json);
  out(`Polaris concepts by the tool's tiers: archive ${pb.all} = tier 0: ${pb.tiers[0]} (${pb.platform} Shopify-only + ${pb.brands} logos) · tier 1: ${pb.tiers[1]} · tier 2: ${pb.tiers[2]} · tier 3: ${pb.tiers[3]}`);
  out(`                                      live ${pl.all} = tier 0: ${pl.tiers[0]} (${pl.platform} Shopify-only + ${pl.brands} logos) · tier 1: ${pl.tiers[1]} · tier 2: ${pl.tiers[2]} · tier 3: ${pl.tiers[3]}`);

  const D = diffRanking(R.base.json, R.live.json);
  head('§2.3 the ranked set');
  table(['', 'archive (as shipped)', 'live names'], [
    ['evidence-backed tier 1–2 concepts, no cut', D.base.backed, D.live.backed],
    [`inside the cut of ${cutOf(R.base.json)} ("the first ${cutOf(R.base.json)}")`, D.base.top, D.live.top],
    [`open slots (${cutOf(R.base.json)} − inside)`, cutOf(R.base.json) - D.base.top, cutOf(R.live.json) - D.live.top],
    ['inside the cut, scoring 3/3 · 2/3 · 1/3', `${D.base.bands[3]} · ${D.base.bands[2]} · ${D.base.bands[1]}`, `${D.live.bands[3]} · ${D.live.bands[2]} · ${D.live.bands[1]}`],
  ]);
  const hb = rankedHeadings(R.base.md);
  const hl = rankedHeadings(R.live.md);
  const dl = R.diffText.split('\n');
  const removed = dl.filter((l) => l.startsWith('-') && !l.startsWith('---')).length;
  const added = dl.filter((l) => l.startsWith('+') && !l.startsWith('+++')).length;
  const stripRank = (l) => l.slice(1).replace(/^\| \d+ \|/, '|');
  const addedKeys = new Map();
  for (const l of dl.filter((x) => x.startsWith('+') && !x.startsWith('+++'))) addedKeys.set(stripRank(l), (addedKeys.get(stripRank(l)) ?? 0) + 1);
  let onlyRank = 0;
  for (const l of dl.filter((x) => x.startsWith('-') && !x.startsWith('---'))) { const k = stripRank(l); if ((addedKeys.get(k) ?? 0) > 0) { addedKeys.set(k, addedKeys.get(k) - 1); onlyRank++; } }
  out(`ranked.md, line by line (\`diff -u\`, kept at ${join(R.outDir, 'ranked.diff')}): ${removed} lines removed, ${added} added; ${onlyRank} of the removed lines come back with only their rank number (the first cell of a table row) changed`);
  out();
  const titles = unique([...hb.headings.map((h) => h.title), ...hl.headings.map((h) => h.title)]);
  const bt = new Map(hb.headings.map((h) => [h.title, h.n]));
  const lt = new Map(hl.headings.map((h) => [h.title, h.n]));
  table(['ranked.md section', 'archive', 'live'], titles.map((t) => [t, bt.get(t) ?? '—', lt.get(t) ?? '—']).filter((r) => r[1] !== r[2]));
  out(`sections of ranked.md with a count in their heading that do not change: ${titles.filter((t) => bt.get(t) === lt.get(t)).map((t) => `${t} (${bt.get(t)})`).join(', ') || 'none'}; ${titles.length} such sections in all`);
  const pool = (json) => json.ranked.filter((r) => r.tier < 3 && !r.evidence && !r.variantOf && r.nucleoUI).map((r) => r.concept);
  const poolB = pool(R.base.json);
  const poolL = pool(R.live.json);
  const bulletNames = (md) => { const m = /## Open-slot candidates[\s\S]*?\n\n(?:Tier[^\n]*\n\n)?((?:- [^\n]*\n)+)/.exec(md); return m ? m[1].split('\n').filter(Boolean).flatMap((l) => l.replace(/^- \*\*[^*]+:\*\* /, '').split(', ')) : []; };
  out(`the open-slot candidate pool at the end of ranked.md (Lucide-only bases that Nucleo's UI family also has): archive ${poolB.length} · live ${poolL.length}; ranked.md's own bullets count ${bulletNames(R.base.md).length} · ${bulletNames(R.live.md).length}; leave the pool: ${code(poolB.filter((c) => !poolL.includes(c)))}; join it: ${code(poolL.filter((c) => !poolB.includes(c)))}`);
  const held = heldBack;
  out(`held back (Tier 3 with two or more sets): archive ${held(R.base.json).length} · live ${held(R.live.json).length}; joins: ${code(held(R.live.json).filter((c) => !held(R.base.json).includes(c)))}; leaves: ${code(held(R.base.json).filter((c) => !held(R.live.json).includes(c)))}`);

  head('§2.3b docs/06-audit.md\'s own counts, reproduced by the archive run and set beside the live run');
  const cB = countsOf(R.base.json);
  const cL = countsOf(R.live.json);
  const d6 = (re) => { const i = readIf(repo, 'docs/06-audit.md').split('\n').findIndex((l) => re.test(l)); return i < 0 ? 'line not found' : `docs/06-audit.md:${i + 1}`; };
  table(['docs/06 says', 'where', 'archive run', 'live run'], [
    ['487 evidence-backed Tier 1–2 concepts (126 · 226 · 135)', d6(/The evidence supports 487/), `${cB.backed} (${cB.bands[3]} · ${cB.bands[2]} · ${cB.bands[1]})`, `${cL.backed} inside the cut, ${D.live.backed} without it (${cL.bands[3]} · ${cL.bands[2]} · ${cL.bands[1]})`],
    ['13 open slots', d6(/That leaves \*\*13 open slots/), cutOf(R.base.json) - cB.backed, Math.max(0, cutOf(R.live.json) - cL.backed)],
    ['Arrows + UI/Layout 114 of 487 (23%)', d6(/Arrows \+ UI\/Layout take/), `${cB.arrowsUi} of ${cB.backed} (${pct(cB.arrowsUi, cB.backed)})`, `${cL.arrowsUi} of ${cL.backed} (${pct(cL.arrowsUi, cL.backed)})`],
    ['Tier 2 is 161 of the 487', d6(/Tier 2 is 161/), `${cB.tier2} of ${cB.backed}`, `${cL.tier2} of ${cL.backed}`],
    ['145 of the 487 are variants', d6(/Modifiers: 145/), `${cB.variants} of ${cB.backed}`, `${cL.variants} of ${cL.backed}`],
    ['29 Tier 3 concepts have two or more votes', d6(/29 Tier 3 concepts/), cB.held, cL.held],
    ['118 Shopify-only concepts excluded (plus logos)', d6(/Polaris is heavily commerce/), `${cB.platform} + ${cB.logos} logos = ${cB.excl}`, `${cL.platform} + ${cL.logos} logos = ${cL.excl}`],
    ['D23: 120 concepts, 114 of them in', d6(/D23 is 120 concepts/), `${D.d23.names}, ${D.d23.insideBefore} in`, `${D.d23.names}, ${D.d23.insideAfter} in`],
  ]);
  out(`the archive column equals docs/06's figures on every row: ${matchesDoc06(cB, { cut: cutOf(R.base.json), d23Names: D.d23.names, d23In: D.d23.insideBefore }) ? 'yes' : 'NO — see the rows'}`);
  const single = (json) => json.ranked.filter((r) => r.top && r.d23 && r.score <= 1).map((r) => `${r.concept}${r.P ? ' (P)' : r.N ? ' (N)' : r.L ? (r.feather ? ' (L, kept by Feather)' : ' (L)') : r.feather ? ' (Feather)' : ''}`);
  out(`D23 concepts inside the cut on one vote or less (docs/06-audit.md:67-70 names caret-up, caret-down, stopwatch, trending-up, trending-down): archive ${single(R.base.json).join(', ')} · live ${single(R.live.json).join(', ')}`);

  const row = (c, X) => X.L.get(c);
  const fmt = (p) => (p ? `${p.P}${p.N}${p.L} v${p.votes} s${p.score} t${p.tier} r${p.rank ?? '–'}${p.top ? '' : ' (out)'}` : '—');
  head('§2.4 who loses and who gains a Polaris vote');
  const sheet = loadSheet(repo, ctx.pin);
  const sf = (c) => { const f = sheetFacts(sheet, c); return f.status === 'absent' ? 'absent' : `${f.status} #${f.n}`; };
  out(`concepts that lose Polaris: ${D.lost.length} · gain it: ${D.gained.length} (net ${D.gained.length - D.lost.length}); P·N·L are the three sets' votes, v votes, s score, t tier, r rank`);
  out();
  table(['loses Polaris', 'category', 'before → after', 'sheet at the pin'], D.lost.map((c) => [`\`${c}\``, D.B.get(c).category, `${fmt(pick(D.B.get(c)))} → ${fmt(pick(D.L.get(c)))}`, sf(c)]));
  table(['gains Polaris', 'live name', 'category', 'before → after', 'sheet at the pin'], D.gained.map((c) => [`\`${c}\``, code(D.L.get(c).names.polaris), D.L.get(c).category, `${fmt(pick(D.B.get(c)))} → ${fmt(pick(D.L.get(c)))}`, sf(c)]));
  const tierTally = (cs, M2) => [0, 1, 2, 3].map((t) => `tier ${t}: ${cs.filter((c) => M2.get(c).tier === t).length}`).join(' · ');
  out(`by tier — lose Polaris: ${tierTally(D.lost, D.B)} · gain it: ${tierTally(D.gained, D.L)}`);
  const onSheet = (cs, st) => cs.filter((c) => sheetFacts(sheet, c).status === st);
  out(`on the sheet at the pin — concepts that lose Polaris: ${onSheet(D.lost, 'drawn').length} drawn (${code(onSheet(D.lost, 'drawn'))}), ${onSheet(D.lost, 'queued').length} queued (${code(onSheet(D.lost, 'queued'))}); concepts that gain it: ${onSheet(D.gained, 'drawn').length} drawn, ${onSheet(D.gained, 'queued').length} queued (${code(onSheet(D.gained, 'queued'))}), ${onSheet(D.gained, 'absent').length} absent`);
  const hadRow = D.gained.filter((c) => D.B.has(c));
  out(`gained: ${hadRow.length} already had a row in the archive run because Nucleo or Lucide draws them (${hadRow.filter((c) => matcher.inTable(c)).length} are table concepts: ${code(hadRow.filter((c) => matcher.inTable(c)))}; ${hadRow.filter((c) => !matcher.inTable(c)).length} are not in the table: ${code(hadRow.filter((c) => !matcher.inTable(c)))}) · ${D.gained.length - hadRow.length} had none`);
  out(`gained and landing in tier 3 ("on demand") only because the table has no row for them: ${D.gained.filter((c) => D.L.get(c).tier === 3 && !matcher.inTable(c)).length} (${code(D.gained.filter((c) => D.L.get(c).tier === 3 && !matcher.inTable(c)))})`);
  const other = D.changed.filter((x) => !D.lost.includes(x.concept) && !D.gained.includes(x.concept));
  out(`concepts that stay Polaris-drawn and change votes, score or evidence: ${other.length}${other.length ? ` (${other.map((x) => `\`${x.concept}\` ${fmt(x.before)} → ${fmt(x.after)}`).join('; ')})` : ''}`);
  out(`concepts present in both runs whose tier or category changes: ${D.tierChanged.length}`);

  head(`§2.5 in and out of the first ${cutOf(R.base.json)}`);
  out(`enter: ${D.entered.length} · leave: ${D.left.length} · net ${D.entered.length - D.left.length}`);
  out();
  table(['enters', 'votes (P·N·L)', 'live name', 'sheet at the pin', 'why it counts'], D.entered.map((c) => {
    const l = D.L.get(c);
    const why = [];
    if (l.N + l.L > 0) why.push(`Polaris adds a second vote to ${l.N ? 'Nucleo' : 'Lucide'}'s`);
    else why.push('Polaris is its only vote');
    if (l.variantOf) why.push(`a variant of \`${l.variantOf}\``);
    if (!matcher.inTable(c)) why.push('not in the table');
    return [`\`${c}\``, `${l.P}·${l.N}·${l.L}`, code(l.names.polaris), sf(c), why.join('; ')];
  }));
  table(['leaves', 'why', 'sheet at the pin', 'archive rank'], D.left.map((c) => [`\`${c}\``, D.leftWhy.find((x) => x.concept === c).why, sf(c), D.B.get(c).rank]));
  const secOf = (c) => sheet.row(SHEET_NAME[c] ?? c);
  const secD = sheet.rows.filter((r) => r.section === 'D').map((r) => Number(r.n));
  const secE = sheet.rows.filter((r) => r.section === 'E').map((r) => Number(r.n));
  out(`evidence-backed but beyond the cut of ${cutOf(R.live.json)} in the live run: ${D.beyondCut.length} (${D.beyondCut.map((x) => `\`${x.concept}\` r${x.rank}`).join(', ')}) — these are sheet rows #${D.beyondCut.map((x) => secOf(x.concept)?.n ?? '–').join(' · #')}; section D (the audit ranking) runs #${Math.min(...secD)} to #${Math.max(...secD)} and section E (rows added on request) from #${Math.min(...secE)}`);
  out(`of the ${D.entered.length} that enter, on the sheet at the pin: ${D.entered.filter((c) => sheetFacts(sheet, c).status !== 'absent').length}; of the ${D.left.length} that leave: ${D.left.filter((c) => sheetFacts(sheet, c).status === 'queued').length} queued, ${D.left.filter((c) => sheetFacts(sheet, c).status === 'drawn').length} drawn`);
  const entMix = { second: D.entered.filter((c) => D.L.get(c).N + D.L.get(c).L > 0).length, only: D.entered.filter((c) => D.L.get(c).N + D.L.get(c).L === 0).length };
  const EB = entrantBases(D);
  out(`of the ${D.entered.length} that enter: ${entMix.second} gain Polaris as a second vote · ${entMix.only} have Polaris as their only vote · ${EB.variants.length} are modifier variants (the audit's \`variantOf\`) · ${EB.bases.length} are not (${code(EB.bases)})`);
  out(`the ${EB.variants.length} variants: ${EB.onTop.length} sit on a base that is itself inside the cut; ${EB.offTop.length} on a base that is not${EB.offTop.length ? `: ${EB.offTop.map((x) => `\`${x.concept}\` on \`${x.base}\` (${x.baseCategory}, tier ${x.baseTier}${x.baseTier === 0 ? ', excluded from the ranking' : ''})`).join('; ')}` : ''}`);
  const platformSet = ctx.matcher.platform;
  const ridersB = shopifyRiders(R.base.json, platformSet);
  const ridersL = shopifyRiders(R.live.json, platformSet);
  out(`ranked concepts whose name starts with a Shopify-only concept without being listed themselves (PLATFORM matches exact names, so the exclusion does not travel): archive ${ridersB.length} · live ${ridersL.length}${ridersL.length ? ` — ${ridersL.map((x) => `\`${x.concept}\` on \`${x.base}\` (tier ${x.tier}, ${x.top ? 'inside the cut' : 'outside it'})`).join('; ')}` : ''}; of the ${D.entered.length} that enter: ${ridersL.filter((x) => D.entered.includes(x.concept)).length} (${code(ridersL.filter((x) => D.entered.includes(x.concept)).map((x) => x.concept))})`);

  head('§2.6 the D23 column');
  out(`D23's names resolve to ${D.d23.names} concepts (docs/06-audit.md:49-55); inside the cut: archive ${D.d23.insideBefore} · live ${D.d23.insideAfter}; outside in both: ${D.d23.outsideBoth.length} (${code(D.d23.outsideBoth)})`);
  out(`D23 concepts whose votes, score or evidence change: ${D.d23.changed.length} — ${D.d23.changed.map((c) => `\`${c}\` ${fmt(pick(D.B.get(c)))} → ${fmt(pick(D.L.get(c)))}`).join('; ')}`);
  out(`D23 concepts whose rank number moves (the ranks of everything shift when ${D.entered.length} concepts enter above): ${D.d23.movedRank} of ${D.d23.names}`);
  const d23P = (json) => [...json.ranked, ...json.excluded].filter((r) => r.d23 && r.P).length;
  out(`D23 concepts Polaris draws: archive ${d23P(R.base.json)} · live ${d23P(R.live.json)} of ${D.d23.names}`);
  const cb = (json) => { const rows = {}; for (const r of json.ranked.filter((x) => x.top)) { rows[r.category] = rows[r.category] ?? { d23: 0, n: 0 }; rows[r.category].n++; if (r.d23) rows[r.category].d23++; } return rows; };
  const cbB = cb(R.base.json);
  const cbL = cb(R.live.json);
  const cats = unique([...Object.keys(cbB), ...Object.keys(cbL)]);
  table(['category (inside the cut)', 'archive total · D23', 'live total · D23'], cats.map((k) => [ctx.CATEGORIES[k].label, `${cbB[k]?.n ?? 0} · ${cbB[k]?.d23 ?? 0}`, `${cbL[k]?.n ?? 0} · ${cbL[k]?.d23 ?? 0}`]).filter((r) => r[1] !== r[2]));
  out(`categories whose size changes: shown above; categories where the D23 count changes: ${cats.filter((k) => (cbB[k]?.d23 ?? 0) !== (cbL[k]?.d23 ?? 0)).length}`);

  head('§2.7 what the table does not know — new live names the rule had to place by itself');
  const unknown = D.gained.filter((c) => !matcher.inTable(c) && !matcher.isPlatform(c));
  const allOtherNames = (c) => { const r = D.L.get(c); return [...r.names.nucleo, ...r.names.lucide]; };
  out(`new live concepts with no row in research/synonyms.mjs: ${unknown.length}`);
  const lucide = ctx.lucide;
  const placed = (c) => placementOf(c, D.L.get(c), { matcher, lucide });
  const placedBy = (c) => { const x = placed(c); return x.kind === 'prefix' ? `the table's \`${x.via}\` (its name starts with it)` : PLACEMENT_WORDS[x.kind]; };
  table(['concept', 'live name', 'placed in', 'by', 'also named by Nucleo/Lucide'], unknown.map((c) => {
    const l = D.L.get(c);
    return [`\`${c}\``, code(l.names.polaris), `${ctx.CATEGORIES[l.category].label} (tier ${l.tier})`, placedBy(c), allOtherNames(c).length ? code(allOtherNames(c)) : '—'];
  }));
  const tally = (cs) => Object.entries(cs.reduce((a, c) => { const k = placed(c).kind; a[k] = (a[k] ?? 0) + 1; return a; }, {})).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${PLACEMENT_WORDS[k]} ×${v}`).join(' · ');
  out(`placed by, in tools/audit.mjs's own order (the start of the name first, then Lucide's tags if none maps, then Nucleo UI's category, then Lucide's tags, then nothing): ${tally(unknown)}`);
  const byOther = unknown.filter((c) => D.L.get(c).tier === 3);
  out(`of the ${unknown.length}: ${byOther.length} land in Tier 3 (held back); ${unknown.length - byOther.length} are placed in Tier 1 or 2`);
  out(`the ${byOther.length} in Tier 3, by what placed them: ${tally(byOther)} — ${byOther.filter((c) => placed(c).kind !== 'default').map((c) => `\`${c}\` by ${placed(c).kind === 'prefix' ? `the start of its name (\`${placed(c).via}\`, itself ${ctx.CATEGORIES[matcher.category[placed(c).via]].label})` : PLACEMENT_WORDS[placed(c).kind]}`).join('; ') || 'none placed by anything but the default'}`);
  // a live name that another source already files under a different concept
  const clash = [];
  for (const c of D.gained) {
    for (const raw of D.L.get(c).names.polaris) {
      for (const [k, rr] of D.L) {
        if (k === c) continue;
        if ([...rr.names.nucleo, ...rr.names.lucide].includes(raw)) clash.push({ raw, polarisConcept: c, otherConcept: k });
      }
    }
  }
  out(`live names that Nucleo or Lucide already file under a different concept than the rule gives Polaris: ${clash.length}${clash.length ? ` — ${clash.map((x) => `\`${x.raw}\` is \`${x.polarisConcept}\` here and \`${x.otherConcept}\` there`).join('; ')}` : ''}`);
}

function revisionRows(ctx, R, sheet) {
  const D = diffRanking(R.base.json, R.live.json);
  const arcByC = conceptMap(ctx.arcNames, resolveP(ctx));
  const liveByC = conceptMap(ctx.live.names, resolveP(ctx));
  const f = (p) => (p ? `${p.P}·${p.N}·${p.L}  v${p.votes} s${p.score} t${p.tier}  r${p.rank}${p.top ? '' : ' out'}` : 'no row');
  const fact = (concept) => {
    const b = pick(D.B.get(concept));
    const l = pick(D.L.get(concept));
    const sh = sheetFacts(sheet, concept);
    return { concept, arc: arcByC.get(concept) ?? [], live: liveByC.get(concept) ?? [], before: b, after: l, sheet: sh, f };
  };
  return { D, fact, arcByC, liveByC, f };
}

async function sectionD23(ctx) {
  const live = needLive(ctx);
  const scratch = needScratch(ctx);
  const R = runRerank({ repo: ctx.repo, scratch, live });
  const sheet = loadSheet(ctx.repo, ctx.pin);
  const { D, fact, arcByC, liveByC, f } = revisionRows(ctx, R, sheet);
  const sheetNote = (s) => (s.status === 'absent' ? 'absent' : `${s.status} #${s.n}${s.approved ? ` ${s.approved}` : ''}, ${s.rows} row${s.rows === 1 ? '' : 's'}${s.shipped ? `, ${s.shipped} shipped` : ''}`);

  head('§3.0 the sheet at the pin');
  const rows = sheet.rows;
  const drawnRows = rows.filter((r) => r.st === 'x');
  const sheetDrawn = new Set(drawnRows.map((r) => r.name));
  out(`${rows.length} rows at ${ctx.pin}: ${drawnRows.length} approved · ${rows.filter((r) => r.st === ' ').length} queued · ${rows.filter((r) => r.st === '~').length} in review; ${sheet.drawn.size} names drawn in the tree (src/icons/24 at the pin); approved rows against drawn names: ${setEq(sheetDrawn, sheet.drawn) ? 'the same set' : 'DIFFERENT'}`);
  const rev = (r) => (r.names ? r.names : [r.concept]);

  head('§3.1 the D23 revisions, one by one');
  out('Columns: P·N·L is Polaris·Nucleo·Lucide (1 = the set draws it); v votes, s score (variants credit their base), t tier (doc 04), r rank in `research/ranked.md` ("out" = outside the cut). Archive = as shipped in research/ranked.md; live = the scratch re-rank of §2.');
  out();
  table(['revision', 'concept', 'archive Polaris draws it as', 'live Polaris draws it as', 'before the re-rank', 'after the re-rank', 'sheet at the pin'], REVISIONS.map((r) => {
    const x = fact(r.concept);
    return [r.label, `\`${r.concept}\``, code(x.arc), code(x.live), f(x.before), f(x.after), sheetNote(x.sheet)];
  }));
  out('The two merges, name by name (D23 lists both names; docs/06-audit.md:49-55):');
  out();
  const d23Names = d23Entries(ctx.D23);
  const d23Concepts = unique(d23Names.map((x) => x.concept));
  const d23Of = (n) => d23Names.find((x) => x.name === n)?.concept ?? n;
  table(['D23 name', 'concept it resolves to', 'a live Polaris name equal to it', 'a row of the sheet with that name'], REVISIONS.filter((r) => r.kind === 'merge').flatMap((r) => r.names.map((n) => [`\`${n}\``, `\`${d23Of(n)}\``, live.names.includes(n) ? 'yes' : 'no', sheet.row(n) ? sheet.status(n) : 'none'])));
  out(`how D23 spells them: ${d23Names.filter((x) => ['close', 'x', 'copy', 'duplicate'].includes(x.name)).map((x) => `\`${x.name}${x.name === x.concept ? '' : `:${x.concept}`}\``).join(' ')} — \`:\` means "is the audit concept after it"`);
  const carets = ['caret-up', 'caret-down', 'caret-left', 'caret-right'];
  out(`the carets: live Polaris names ${code(live.names.filter((n) => n.startsWith('caret-')))} · the sheet has ${carets.map((c) => `\`${c}\` ${sheet.status(c)}${sheet.row(c) ? ` (row ${sheet.row(c).n})` : ''}`).join(' · ')}`);
  out(`D23 as the table spells it: ${d23Names.length} names → ${d23Concepts.length} concepts`);

  head('§3.2 the 13 open slots');
  out('`docs/06-audit.md:126-128` — "chosen by judgement, not by the data". The last column lists live Polaris names that share a whole word with the slot, ignoring last words that four or more live names end with (`list`, `circle`, `add`…): leads for the eye, not matches.');
  out();
  const tokenLeads = (c) => slotLeads(c, live.names);
  table(['slot', 'in D23 as', 'archive Polaris', 'live Polaris', 'votes before → after', 'sheet at the pin', 'live names sharing a word'], SLOTS.map((c) => {
    const x = fact(c);
    const d = d23Names.filter((n) => n.concept === c).map((n) => n.name);
    return [`\`${c}\``, d.length ? code(d) : '—', code(x.arc), code(x.live), `${f(x.before)} → ${f(x.after)}`, sheetNote(x.sheet), code(tokenLeads(c).slice(0, 6))];
  }));
  out(`slots Polaris draws: archive ${SLOTS.filter((c) => arcByC.has(c)).length} · live ${SLOTS.filter((c) => liveByC.has(c)).length} of ${SLOTS.length}; slots on the sheet at the pin: ${SLOTS.filter((c) => sheet.status(c) !== 'absent').length}`);
  out(`slots of the ${SLOTS.length} that are evidence-backed in the live run (any set): ${SLOTS.filter((c) => D.L.get(c)?.evidence).length}; inside the live cut: ${SLOTS.filter((c) => D.L.get(c)?.top).length}`);
  const sum = (x) => `${x.backed} + ${SLOTS.length} = ${x.backed + SLOTS.length}`;
  out(`the open slots, counted: archive ${cutOf(R.base.json) - D.base.top} · live ${cutOf(R.live.json) - D.live.top} (evidence-backed without the cut: ${D.live.backed}); a cut that would hold every evidence-backed concept and the ${SLOTS.length} picks: archive ${sum(D.base)} · live ${sum(D.live)}`);
  const poolOf = (json) => json.ranked.filter((r) => r.tier < 3 && !r.evidence && !r.variantOf && r.nucleoUI).map((r) => r.concept);
  out(`the slots inside ranked.md's candidate pool (Lucide-only bases that Nucleo's UI family also has): archive ${SLOTS.filter((c) => poolOf(R.base.json).includes(c)).length} of ${SLOTS.length} · live ${SLOTS.filter((c) => poolOf(R.live.json).includes(c)).length} of ${SLOTS.length}; the slots outside it: ${code(SLOTS.filter((c) => !poolOf(R.base.json).includes(c)))}; the pool itself: archive ${poolOf(R.base.json).length} · live ${poolOf(R.live.json).length}; the ${poolOf(R.base.json).filter((c) => !poolOf(R.live.json).includes(c)).length} the live Polaris takes out of it: ${code(poolOf(R.base.json).filter((c) => !poolOf(R.live.json).includes(c)))}`);

  head('§3.3 the other things docs/06 says about Polaris, checked against the live names');
  const claim = (what, where, holds, detail) => [what, where, holds === 'changed' ? '**changed**' : holds ? 'holds' : '**does not hold**', detail];
  const has = (n) => live.names.includes(n);
  const arcHas = (n) => ctx.arcNames.includes(n);
  const cl = [];
  cl.push(claim('"Polaris has only vertical carets"', 'docs/06-audit.md:61', has('caret-up') && has('caret-down') && !has('caret-left') && !has('caret-right'), `live: ${code(live.names.filter((n) => n.startsWith('caret-')))}; archive: ${code(ctx.arcNames.filter((n) => n.startsWith('caret-')))}`));
  cl.push(claim('"`caret-up` and `caret-down` (Polaris)" are single-vote', 'docs/06-audit.md:67-68', ['caret-up', 'caret-down'].every((c) => D.L.get(c)?.P && !D.L.get(c).N && !D.L.get(c).L), `live votes ${['caret-up', 'caret-down'].map((c) => { const r = D.L.get(c); return `${c} ${r ? `${r.P}·${r.N}·${r.L}` : 'no row'}`; }).join(', ')}`));
  cl.push(claim('"Polaris calls it `Duplicate`" (copy)', 'docs/06-audit.md:54', has('duplicate') && !has('copy'), `live ${code(['duplicate', 'copy'].filter(has))}; archive ${code(['duplicate', 'copy'].filter(arcHas))}`));
  cl.push(claim('"Polaris draws only the maximise/minimise pair" (not expand/collapse)', 'docs/06-audit.md:73-74', has('maximize') && has('minimize') && !has('expand') && !has('collapse'), `live ${code(['maximize', 'minimize', 'expand', 'collapse'].filter(has))}; the horizontal pair ${code(live.names.filter((n) => /^arrows-(in|out)-horizontal$/.test(n)))} is also drawn`));
  cl.push(claim('"Polaris has `shield-check` and `shield-person` but no bare `shield`"', 'docs/06-audit.md:30-31', !has('shield') && has('shield-person') && live.names.some((n) => /^shield-check/.test(n)), `live ${code(live.names.filter((n) => n.startsWith('shield')))}`));
  cl.push(claim('"Polaris and Nucleo use a plain clock for history"', 'docs/06-audit.md:62', live.names.some((n) => /history|revert|restore/.test(n)) ? 'changed' : true, `live ${code(live.names.filter((n) => n.startsWith('clock')))}; archive ${code(ctx.arcNames.filter((n) => n.startsWith('clock')))} — \`clock-revert\` is new; what it draws is not read here`));
  cl.push(claim('"Its 1-vote concepts (`viewport-*`, `sandbox`, `channels`, `live`)"', 'docs/06-audit.md:168-169', ['viewport-narrow', 'viewport-short', 'viewport-tall', 'viewport-wide', 'sandbox', 'channels', 'live'].every(has), `live ${code(['viewport-narrow', 'viewport-short', 'viewport-tall', 'viewport-wide', 'sandbox', 'channels', 'live'].filter(has))}`));
  table(['claim', 'where', 'against the live names', 'detail'], cl);

  head('§3.4 the two additions lists in docs/06, against the live Polaris');
  const drawLine = (c) => {
    const x = fact(c);
    return [`\`${c}\``, code(x.arc), code(x.live), x.arc.length ? 'yes' : 'no', x.live.length ? 'yes' : 'no', f(x.before), f(x.after), sheetNote(x.sheet)];
  };
  out(`**"These Tier 1 concepts score 3/3 but are not in D23"** (docs/06-audit.md:81-87, ${DOC06_THREE.length} names):`);
  out();
  table(['concept', 'archive name', 'live name', 'archive draws', 'live draws', 'before', 'after', 'sheet at the pin'], DOC06_THREE.map(drawLine));
  out(`live Polaris draws ${DOC06_THREE.filter((c) => liveByC.has(c)).length} of ${DOC06_THREE.length} (archive ${DOC06_THREE.filter((c) => arcByC.has(c)).length}); the sheet at the pin: ${['drawn', 'queued', 'absent', 'in review'].map((s) => `${s} ${DOC06_THREE.filter((c) => sheetFacts(sheet, c).status === s).length}`).join(' · ')}`);
  out(`**"Also worth adding, since Polaris backs them at 2/3"** (docs/06-audit.md:92-95, ${DOC06_TWO.length} names):`);
  out();
  table(['concept', 'archive name', 'live name', 'archive draws', 'live draws', 'before', 'after', 'sheet at the pin'], DOC06_TWO.map(drawLine));
  out(`live Polaris draws ${DOC06_TWO.filter((c) => liveByC.has(c)).length} of ${DOC06_TWO.length} (archive ${DOC06_TWO.filter((c) => arcByC.has(c)).length}); the sheet at the pin: ${['drawn', 'queued', 'absent', 'in review'].map((s) => `${s} ${DOC06_TWO.filter((c) => sheetFacts(sheet, c).status === s).length}`).join(' · ')}`);

  if (ctx.opts['all-d23']) {
    head('§3.5 every D23 concept');
    table(['D23 name', 'concept', 'archive Polaris', 'live Polaris', 'before', 'after', 'sheet at the pin'], d23Names.map((n) => {
      const x = fact(n.concept);
      return [`\`${n.name}\``, `\`${n.concept}\``, code(x.arc), code(x.live), f(x.before), f(x.after), sheetNote(x.sheet)];
    }));
  }
  const d23Draw = (set) => d23Concepts.filter((c) => set.has(c)).length;
  out(`D23's ${d23Concepts.length} concepts: Polaris draws ${d23Draw(new Set(arcByC.keys()))} in the archive, ${d23Draw(new Set(liveByC.keys()))} on the live page; the sheet at the pin holds (drawn · queued · absent): ${['drawn', 'queued', 'absent'].map((s) => d23Concepts.filter((c) => sheetFacts(sheet, c).status === s).length).join(' · ')} (three concepts the sheet carries under another name: ${Object.entries(SHEET_NAME).map(([a, b]) => `\`${a}\` → \`${b}\``).join(', ')})`);
  head('§3.6 where to look — Figma node ids of the live drawings the open questions need an eye on (a bridge capture is needed for ids)');
  const lookAt = ['clock-revert', 'bolt', 'bolt-filled', 'circle-dashed', 'eraser', 'page-report', 'caret-up', 'caret-down', 'select', 'question-circle', 'info'];
  table(['live name', 'node id', 'why it needs an eye'], lookAt.map((n) => {
    const node = live.nodes.find((x) => x.name === n);
    const why = { 'clock-revert': 'D23 `history` (docs/06-audit.md:62)', bolt: 'same spelling as Lucide\'s nut, Nucleo\'s is the lightning bolt', 'bolt-filled': 'its filled twin', 'circle-dashed': 'a `dashed-circle` second vote', eraser: 'an `eraser` second vote', 'page-report': 'D23 `report` = `file-chart`?', 'caret-up': 'the one-product vote', 'caret-down': 'the one-product vote', select: '`chevrons-up-down`', 'question-circle': 'P5', info: 'P5' }[n];
    return [`\`${n}\``, node?.id ? `\`${node.id}\`` : 'not in this list (names only)', why];
  }));
  const verified = CITED.map((c) => ({ ...c, missing: existsSync(join(ctx.repo, c.file)) ? missingFrom(readRepo(ctx.repo, c.file), c.from, c.to, c.names) : ['(file not found)'] }));
  out(`the lists this tool embeds, checked against the lines they come from: ${verified.map((v) => `${v.what} (${v.file}:${v.from}${v.to !== v.from ? `-${v.to}` : ''}) ${v.missing.length ? `MISSING ${v.missing.join(', ')}` : 'all present'}`).join(' · ')}`);
}

async function sectionGrammar(ctx) {
  const live = needLive(ctx);
  const scratch = needScratch(ctx);
  const R = runRerank({ repo: ctx.repo, scratch, live });
  const sheet = loadSheet(ctx.repo, ctx.pin);
  const resolveFn = resolveP(ctx);
  const arcByC = conceptMap(ctx.arcNames, resolveFn);
  const liveByC = conceptMap(live.names, resolveFn);
  const auditJson = JSON.parse(readRepo(ctx.repo, 'research/audit.json'));
  const shipped = rowMap(auditJson);

  head('§4.1 P5 — how Polaris names its help and info icons');
  const ringNames = (names) => names.filter((n) => /-circle$/.test(n) || /-circle-(up|down)$/.test(n));
  const tw = (xs) => xs.map((n) => `\`${n}\``).join(' ');
  const row = (c) => {
    const s = shipped.get(c);
    return [`\`${c}\``, code(arcByC.get(c) ?? []), code(liveByC.get(c) ?? []), s ? code(s.names.nucleo) : '—', s ? code(s.names.lucide) : '—'];
  };
  table(['our name', 'archive Polaris', 'live Polaris', 'Nucleo (research/audit.json)', 'Lucide (research/audit.json)'], ['help', 'info', 'alert-circle', 'check-circle', 'x-circle', 'plus-circle', 'minus-circle', 'alert-triangle', 'help-square', 'info-square', 'alert-square'].map(row));
  out(`the audit table's spellings for \`help\`: ${code(Object.entries(ctx.matcher.alias).filter(([, c]) => c === 'help').map(([a]) => a))}; for \`info\`: ${code(Object.entries(ctx.matcher.alias).filter(([, c]) => c === 'info').map(([a]) => a))}`);
  out(`live Polaris names that end \`-circle\` or run \`-circle-up/-down\`: ${ringNames(live.names).length} — ${tw(ringNames(live.names))}`);
  const ringIcons = ['alert-circle', 'check-circle', 'minus-circle', 'plus-circle', 'question-circle', 'x-circle'];
  out(`of our six ring-and-glyph names for \`alert\`, \`check\`, \`minus\`, \`plus\`, \`help\`, \`x\`, live Polaris names the ring in: ${ringIcons.filter((n) => live.names.includes(n)).length} (${code(ringIcons.filter((n) => live.names.includes(n)))}); \`info\` is bare: ${live.names.includes('info') ? 'yes (`info`)' : 'no'}; \`help\` is \`question-circle\`, not \`help-circle\`: ${live.names.includes('question-circle') && !live.names.includes('help-circle') ? 'yes' : 'no'}`);
  out(`the queued neighbours P5 names: ${['help-square', 'info-square', 'alert-square'].map((c) => `\`${c}\` ${sheet.status(c)} (row ${sheet.row(c)?.n ?? '–'}), Polaris draws it: ${liveByC.has(c) ? 'yes' : 'no'}`).join(' · ')}`);
  out(`live Polaris \`alert-*\` names: ${code(live.names.filter((n) => n.startsWith('alert-')))}; \`question-*\`: ${code(live.names.filter((n) => n.startsWith('question')))}; \`info*\`: ${code(live.names.filter((n) => n.startsWith('info')))}`);

  head('§4.2 the at-least-38 queued corner-badge composites, and Polaris');
  const rows = BADGE38.map((c) => {
    const lv = liveByC.get(c) ?? [];
    const ar = arcByC.get(c) ?? [];
    const exact = lv.includes(c);
    return { c, lv, ar, exact, status: sheet.status(c), via: lv.length && !exact };
  });
  out(`the 38 names (findings-grammar.md:273) on the sheet at the pin: ${['queued', 'drawn', 'absent', 'in review'].map((s) => `${s} ${rows.filter((r) => r.status === s).length}`).join(' · ')}`);
  const drawn = rows.filter((r) => r.lv.length);
  out(`**live Polaris draws ${drawn.length} of the 38** (archive ${rows.filter((r) => r.ar.length).length}; ${setEq(new Set(rows.filter((r) => r.ar.length).map((r) => r.c)), new Set(drawn.map((r) => r.c))) ? 'the same names' : 'NOT the same names'}); under the same name ${drawn.filter((r) => r.exact).length}, under a name the audit's table equates with ours ${drawn.filter((r) => r.via).length}; not drawn by Polaris: ${rows.filter((r) => !r.lv.length).length}`);
  out();
  table(['queued name', 'live Polaris draws it as', 'how', 'sheet row'], rows.map((r) => [`\`${r.c}\``, code(r.lv), r.lv.length ? (r.exact ? 'same name' : 'table alias') : '**not drawn**', sheet.row(r.c) ? `${sheet.row(r.c).n} ${r.status}` : r.status]));
  out(`not drawn by Polaris: ${code(rows.filter((r) => !r.lv.length).map((r) => r.c))}`);

  const comp = badgeComposites(live.names);
  head('§4.3 composites of the badge kind among the live Polaris names');
  out(`rule: a live name is a composite of the kind when it ends in one of ${BADGE_TAILS.length} tail words — ${code(BADGE_TAILS)} — and the part before the tail is not ${code(DIRECTION_OBJECTS)} (whose \`-up\`/\`-down\` is the object's own direction). The tail words are the modifiers of the 38 plus the spellings Polaris and the table use for the same ones. Names only; no geometry was read, so a name that says "add" may or may not draw a corner badge.`);
  const byTail = new Map();
  for (const c of comp) { if (!byTail.has(c.tail)) byTail.set(c.tail, []); byTail.get(c.tail).push(c.name); }
  out();
  table(['tail', 'n', 'live names'], [...byTail.entries()].sort((a, b) => b[1].length - a[1].length).map(([t, ns]) => [`\`${t}\``, ns.length, code(ns)]));
  const strict = badgeComposites(live.names, STRICT_TAILS);
  out(`**${comp.length} live names are composites of the kind** (of ${live.names.length}) — ${strict.length} by the 38's own modifier words alone (${code(STRICT_TAILS)}), ${comp.length - strict.length} more only through the spellings (${code(SPELLING_TAILS)}); excluded by the direction rule: ${code(badgeComposites(live.names, BADGE_TAILS, []).filter((c) => DIRECTION_OBJECTS.includes(c.object)).map((c) => c.name))}`);
  const liveMatched = new Set(drawn.flatMap((r) => r.lv));
  const inCensus = new Set(comp.map((c) => c.name));
  const notInCensus = [...liveMatched].filter((n) => !inCensus.has(n));
  out(`of the ${liveMatched.size} live names that match one of our 38: ${[...liveMatched].filter((n) => inCensus.has(n)).length} are in this census; ${notInCensus.length} are not${notInCensus.length ? ` (${code(notInCensus)} — their tail is not a badge word)` : ''}`);
  const outside = comp.filter((c) => !liveMatched.has(c.name));
  const plat = (n) => ctx.matcher.isPlatform(resolveFn(n));
  out(`composites in the census that match none of our 38: ${outside.length} — ${code(outside.map((c) => c.name))}; of these ${outside.filter((c) => plat(c.name)).length} are Shopify-only by the table (${code(outside.filter((c) => plat(c.name)).map((c) => c.name))})`);
  head('§4.4 every last word in the live names (the census is only as good as its word list)');
  const tt = tailTable(live.names);
  table(['last word', 'n', 'in the badge list'], tt.filter(([, ns]) => ns.length >= 3).map(([w, ns]) => [`\`${w}\``, ns.length, BADGE_TAILS.includes(w) ? 'yes' : '']));
  out(`last words shared by three or more names: ${tt.filter(([, ns]) => ns.length >= 3).length}; by two: ${tt.filter(([, ns]) => ns.length === 2).length}; by one: ${tt.filter(([, ns]) => ns.length === 1).length}`);
  void R;
}

/** Every line of the tracked tree at HEAD that contains `needle`, except in the files named in `exclude`. */
export function trackedGrep(repo, needle, exclude = []) {
  const args = ['grep', '-n', '-I', '-F', '--no-color', needle, 'HEAD', '--', '.', ...exclude.map((f) => `:(exclude)${f}`)];
  const r = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status === 1) return [];
  if (r.status !== 0) throw new Error(`git grep failed (is ${repo} a git checkout?): ${(r.stderr || '').trim()}`);
  return r.stdout.split('\n').filter(Boolean).map((l) => { const m = /^HEAD:(.+?):(\d+):(.*)$/.exec(l); return m ? { file: m[1], n: Number(m[2]), text: m[3] } : null; }).filter(Boolean);
}

/** What each line calls the key: the live Polaris source, Fluent's file (on the line, on the two lines before it, or
 *  in a file about Fluent), or neither. `linesOf(file)` gives the file's lines. */
export function classifyKeyHits(hits, linesOf) {
  return hits.map((h) => {
    const lines = linesOf(h.file);
    const near = [lines[h.n - 3], lines[h.n - 2], h.text].filter((x) => x != null).join('\n');
    const as = /Polarris|Polaris/.test(h.text) ? 'the live Polaris source' : (/fluent/i.test(near) || /references-fluent\.md$/.test(h.file)) ? "Fluent's file" : 'neither';
    return { ...h, as };
  });
}
export const keyTotals = (hits) => Object.fromEntries(['Fluent\'s file', 'the live Polaris source', 'neither'].map((k) => { const xs = hits.filter((h) => h.as === k); return [k, { lines: xs.length, files: unique(xs.map((h) => h.file)).length }]; }));

async function sectionPointer(ctx) {
  const live = needLive(ctx);
  const repo = ctx.repo;
  const lines = (rel) => readIf(repo, rel).split('\n');
  const grep = (rel, re) => lines(rel).map((t, i) => ({ n: i + 1, t })).filter((x) => re.test(x.t));
  head('§5.1 what CLAUDE.md says, and where the live source is');
  const cl = lines('CLAUDE.md');
  const a0 = cl.findIndex((t) => t.startsWith('**Audit**'));
  if (a0 < 0) out('CLAUDE.md has no "**Audit**" paragraph');
  for (let i = Math.max(a0, 0); a0 >= 0 && i < cl.length && cl[i].trim() !== ''; i++) out(`CLAUDE.md:${i + 1}: ${cl[i]}`);
  out(`CLAUDE.md names file ${grep('CLAUDE.md', /XewrhAKrNGVZtikkpI5am9/).length ? `\`${FIGMA.fileKey}\`` : '(no file key)'} and node \`${DEAD_NODE}\`; the live page is in file \`${live.meta.fileKey ?? FIGMA.fileKey}\`${live.meta.file ? ` ("${live.meta.file}")` : ''}, page \`${live.meta.page?.id ?? FIGMA.pageId}\` "${live.meta.page?.name ?? FIGMA.pageName}" — a PAGE, not a frame: the file key was right, the node id was not`);
  out(`CLAUDE.md says "~490 icons" for the frame: live names ${live.names.length}, live drawings ${live.drawings}`);
  head('§5.2 where the documents state a Polaris size');
  const sized = [
    ['CLAUDE.md', /Polaris \(archive\)/], ['README.md', /Shopify Polaris/], ['docs/04-scope.md', /Shopify Polaris \| 499/], ['docs/06-audit.md', /\*\*Polaris\*\* \(`polaris-react-archive`\)|Polaris is heavily commerce|does not match the archive|463 outline bases/], ['docs/audit/stale-statements.md', /Polarris icons/], ['plans/set-and-rules-audit.md', /Polarris icons/],
  ];
  const A = nameCounts(ctx.arcNames, ctx.arcTwins, ctx.matcher);
  const L = nameCounts(live.names, live.twins.size, ctx.matcher);
  for (const [rel, re] of sized) for (const x of grep(rel, re)) out(`${rel}:${x.n}: ${x.t.trim().slice(0, 200)}`);
  out();
  out(`measured: archive ${A.names} bases + ${A.twins} twins = ${A.drawings} files, ${A.concepts} concepts, ${A.platform} Shopify-only · live ${L.names} names, ${L.drawings} drawings (${live.nodes.filter((n) => n.w === 20 && n.h === 20).length} of them 20×20), ${L.concepts} audit concepts, ${L.platform} Shopify-only`);
  head('§5.3 the file key stale-statements.md §1.9 gives for the live source');
  const SELF = ['docs/audit/references-polaris.md', 'tools/audit/polaris-scope.mjs', 'tools/audit/polaris-scope.test.mjs'];
  const hits = classifyKeyHits(trackedGrep(repo, FLUENT_KEY, SELF), (f) => { try { return git(repo, ['show', `HEAD:${f}`]).split('\n'); } catch { return []; } });
  out(`every line of the tracked tree at HEAD that contains \`${FLUENT_KEY}\` (\`git grep\`; the three files of this card are left out — they quote it):`);
  out();
  table(['file:line', 'calls the key', 'the line'], hits.map((h) => [`${h.file}:${h.n}`, h.as, h.text.trim().slice(0, 150).replace(/\|/g, '\\|')]));
  const T = keyTotals(hits);
  out(`**${hits.length} lines in ${unique(hits.map((h) => h.file)).length} files**: Fluent's file on ${T["Fluent's file"].lines} lines in ${T["Fluent's file"].files} files · the live Polaris source on ${T['the live Polaris source'].lines} line${T['the live Polaris source'].lines === 1 ? '' : 's'} in ${T['the live Polaris source'].files} file${T['the live Polaris source'].files === 1 ? '' : 's'} (${hits.filter((h) => h.as === 'the live Polaris source').map((h) => `${h.file}:${h.n}`).join(', ') || '—'}) · neither ${T.neither.lines}`);
  const catPath = join(repo, 'research/references/polaris/figma/catalogue.json');
  out(`this card read the Polaris page in \`${live.meta.fileKey ?? FIGMA.fileKey}\` (§0.1: file "${live.meta.file ?? '?'}"; the catalogue's own header: ${existsSync(catPath) ? JSON.parse(readFileSync(catPath, 'utf8')).file.key : 'catalogue not on disk'})`);
  if (ctx.opts['pages-fluent'] && existsSync(ctx.opts['pages-fluent'])) {
    const f = JSON.parse(readFileSync(ctx.opts['pages-fluent'], 'utf8'));
    const r = fluentPageReport(f);
    out(`the Fluent file's own page list (${f.at}${f.by ? `, ${f.by}` : ''}): ${r.pages} pages — ${f.pages.map((x) => x.name ?? `(${x.note ?? 'unnamed'})`).join(' · ')}; a Polaris page among them: ${r.polaris.length || r.hasPolarisId ? 'yes' : 'none'}`);
  } else out('(no --pages-fluent capture given: whether the Fluent file holds a Polaris page is not measured here)');
  head('§5.4 the other things CLAUDE.md says about refreshing Polaris');
  for (const x of grep('CLAUDE.md', /git trees API|contents API/)) out(`CLAUDE.md:${x.n}: ${x.t.trim()}`);
}

async function sectionAll(ctx) {
  for (const [name, fn] of [['bridge', sectionBridge], ['names', sectionNames], ['rerank', sectionRerank], ['d23', sectionD23], ['grammar', sectionGrammar], ['pointer', sectionPointer]]) {
    out(`\n# ${name}`);
    await fn(ctx);
  }
}

const SECTIONS = { script: sectionScript, capture: sectionCapture, bridge: sectionBridge, names: sectionNames, rerank: sectionRerank, d23: sectionD23, grammar: sectionGrammar, pointer: sectionPointer, all: sectionAll };

export function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (['all-d23', 'force'].includes(k)) o[k] = true;
      else { o[k] = argv[++i]; if (o[k] === undefined) throw new Error(`--${k} needs a value`); }
    } else o._.push(a);
  }
  return o;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const section = opts._[0];
  if (!section || !SECTIONS[section]) { console.error(`usage: polaris-scope.mjs <${Object.keys(SECTIONS).join('|')}> [--live F] [--scratch DIR] [--pages F] [--archive F] [--catalogue F] [--pin SHA] [--repo DIR] [--out F] [--all-d23]`); process.exit(2); }
  if (opts.scratch) assertOutsideRepo(opts.scratch, opts.repo ?? REPO);
  const ctx = await context(opts);
  await SECTIONS[section](ctx);
}

if (process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
