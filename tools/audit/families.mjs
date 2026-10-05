#!/usr/bin/env node
// FAMILIES — card 1.10 of the set-and-rules audit (numbered, size, level and figure families, and the
// styles x sizes grid). AUDIT ONLY: nothing in lint, build, queue or the lab imports this, it reads an
// archived pin and writes nothing. Every figure in docs/audit/findings-families.md reprints from here.
//
//   git archive 5933041 | tar -x -C /tmp/pin && (cd /tmp/pin && node tools/build.mjs)
//   node tools/audit/families.mjs /tmp/pin [section …]
//
// Sections (default: all), one per section of the document:
//   census     §0    the partition: names parsed per C9, the grammar card's folding rule reproduced, this card's
//   runs       §1.1  every <object>-<n> run: numbers present, gaps, lengths
//   identity   §1.2  does a number mark a different drawing at every master? (the Library's own "twins" included)
//   tags       §1.3  tags: coverage, variants a search cannot tell apart, a wrong direction word, the vocabulary
//   travel     §1.4  does a number mean the same thing across sibling stems (chevron, arrow, layout, check …)? and are
//                    the layout regions the footer turned, exactly (C29)?
//   sizes      §2.1  every -small / -large family: the step against C8's 3 · 2.5 · 2, outline and filled
//   containers §2.2  container families (C18): the container kept, the mark's step, the filled cut-out
//   lintcmp    §2.3  lint's family check read through the pin's own lint.mjs, against the exact measure
//   grid       §3.1  the styles x masters x sizes grid, family by family
//   sheet      §3.2  the sheet at the pin against the families: what is queued, what is not
//   figures    §4    user / users: the figure x arrangement grid, boxes, tags, what lab/figures.html would dash
//   levels     §5    the volume family against C28, then every name that says an amount (set and sheet)
//   boxes      §6    does a family keep one ink box? by run, by kind, and the held dimension
//
// MEASURES, so a number can be read the same way everywhere.
//   ink box   strokes grown by half their width, area paths as drawn, arc and curve extremes SOLVED (the
//             instrument of card 1.12, metrics-check.mjs) — not lint's sampled bbox, which can sit up to
//             0.0056 inside a true arc edge. Printed to 3 dp.
//   size      the LONG side of that box. lint.mjs:316-317 uses the same one (`Math.max(w, h)` of a 2 dp box).
//   step      the size of the default minus the size of its -small, and of its -large minus the default;
//             C8 asks for SIZE_STEP (3 · 2.5 · 2 at 24 · 20 · 16).
//   run       one stem and its numbered shapes at the default size: `chevron-down`, `-2`, `-3`. A size is not
//             a shape, so -small / -large are left out of a run and measured as a size family.
//   twin      the Library's word (lab/library.html:317-335): two names whose OUTLINE files are the same
//             drawing at all three masters.
//
// READS from the pin directory: src/icons, research/queue.md, lab/figures.html, tools/lint.mjs and, when the pin has
// been built, dist/metrics.json (one cross-check in `boxes`). Nothing is written anywhere.

import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readSvg, inkBoxOf, segBox, polylines } from './metrics-check.mjs';
import { canonical } from './congruence.mjs';
import { MASTERS as MASTERS_DEFAULT, SIZE_STEP as SIZE_STEP_DEFAULT } from '../masters.mjs';

/** The geometry C8 and the keylines are held to: `SIZE_STEP` and `MASTERS` of `tools/masters.mjs`. A set that carries no
 *  `spec` falls back to the copy this tool imports (the working tree's); the command line reads the PIN's own with
 *  `loadSpec`, so a figure is measured against the spec that shipped at the pin. */
export const DEFAULT_SPEC = { SIZE_STEP: SIZE_STEP_DEFAULT, MASTERS: MASTERS_DEFAULT, source: 'the working tree\'s tools/masters.mjs' };
export async function loadSpec(pin) {
  const file = join(pin, 'tools/masters.mjs');
  if (!existsSync(file)) return { ...DEFAULT_SPEC, source: `${DEFAULT_SPEC.source} (the pin directory has no tools/masters.mjs)` };
  const m = await import(pathToFileURL(file).href);
  return { SIZE_STEP: m.SIZE_STEP, MASTERS: m.MASTERS, source: `${file}` };
}
export const specEqual = (a, b) => JSON.stringify([a.SIZE_STEP, a.MASTERS]) === JSON.stringify([b.SIZE_STEP, b.MASTERS]);
const specOf = (set) => set?.spec ?? DEFAULT_SPEC;
export const MASTER_LIST = [24, 20, 16];
export const STYLES = ['outline', 'filled'];
const r2 = (n) => Math.round(n * 100) / 100;
const f3 = (n) => (n == null ? '—' : (Math.abs(n) < 5e-10 ? 0 : n).toFixed(3));
const uniq = (a) => [...new Set(a)];
const byNumber = (a, b) => a - b;
const sortStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// ── names ──────────────────────────────────────────────────────────────────────────────────────────────
/** C9: `<object>[-<modifier>][-<n>][-<size>][-filled]`. A concept name has no `-filled`. `n` is 1 for the
 *  unnumbered default; `number` is null there. `users-2-behind` is C27's amendment (a word after the number):
 *  it parses as a stem of its own and `figureOf` reads it. */
export function parseName(name) {
  let rest = name, size = null, number = null;
  const sm = rest.match(/-(small|large)$/);
  if (sm) { size = sm[1]; rest = rest.slice(0, -sm[0].length); }
  const nm = rest.match(/-(\d+)$/);
  if (nm) { number = Number(nm[1]); rest = rest.slice(0, -nm[0].length); }
  return { name, stem: rest, number, n: number ?? 1, size };
}
export const conceptOf = (id) => id.replace(/-filled$/, '');

/** C27: `user[-n]` and `users[-n][-word]`. */
export function figureOf(name) {
  const m = name.match(/^(users?)(?:-(\d+))?(?:-(behind|wide|level|heads))?$/);
  return m ? { object: m[1], figure: m[2] ? Number(m[2]) : 1, word: m[3] ?? null } : null;
}

/** The grammar card's partition (docs/audit/findings-grammar.md §2.1: 125 stems = 105 families + 20 singletons;
 *  9 mark families; 96 object families, 378 concepts). The rule is not written there and the card's scratch
 *  script is not in the repo, so it is reconstructed from the card's own family lists and counts — and it
 *  reproduces every one of those counts (the `census` section prints them, the end-to-end test asserts them).
 *  size, then number, are stripped; then: the four directions of arrow and chevron fold (`arrow-up-right` does
 *  not); plus/minus/x-circle fold into their mark (check-circle does not); sort-(ascending|descending) → sort,
 *  sort-(alpha|numeric)-(…) → sort-alpha|numeric; users-[n]-[word] → users; volume-* → volume; face-* → face;
 *  menu-arrow-(left|right) → menu-arrow. */
export function foldGrammar(name, { unfoldCircles = false } = {}) {
  const { stem } = parseName(name);
  if (/^(arrow|chevron)-(up|down|left|right)$/.test(stem)) return stem.replace(/-(up|down|left|right)$/, '');
  if (!unfoldCircles && /^(plus|minus|x)-circle$/.test(stem)) return stem.replace(/-circle$/, '');
  if (/^sort-(ascending|descending)$/.test(stem)) return 'sort';
  const sn = stem.match(/^sort-(alpha|numeric)-(ascending|descending)$/);
  if (sn) return `sort-${sn[1]}`;
  if (/^users(-\d+)?(-(behind|wide|level))?$/.test(name.replace(/-(small|large)$/, ''))) return 'users';
  if (/^volume-/.test(stem)) return 'volume';
  if (/^face-/.test(stem)) return 'face';
  if (/^menu-arrow-(left|right)$/.test(stem)) return 'menu-arrow';
  return stem;
}
/** The nine families card 1.1 covered (findings-grammar.md:369-371). */
export const GRAMMAR_MARK_FAMILIES = ['plus', 'minus', 'x', 'check', 'chevron', 'arrow', 'arrow-up-right', 'sparkle', 'ban'];

/** The families findings-grammar.md §2.1 names in its five rows (`:379-383`) and the nine mark families (`:369-371`), with
 *  the member count each carries there — typed from the document, so the reconstructed rule can be held to it. */
export const GRAMMAR_TABLE = {
  'alert-circle': 4, 'alert-triangle': 4, bug: 2, calendar: 3, 'check-circle': 6, checkbox: 4, compass: 3, 'credit-card': 3, face: 3, 'file-text': 2, globe: 2,
  help: 4, info: 3, keyboard: 2, menu: 4, 'sort-alpha': 6, 'sort-numeric': 6, store: 2, table: 2,
  volume: 7, files: 5, images: 4, 'layout-footer': 4, 'layout-header': 4, 'layout-sidebar': 4, 'layout-sidebar-right': 4, book: 4, image: 3, mail: 3, target: 3, upload: 3,
  building: 4, 'chevrons-up-down': 4,
  attachment: 4, 'chart-bar': 5, 'chart-pie': 3, clipboard: 4, copy: 3, cursor: 3, database: 3, filter: 4, flag: 4, gear: 3, link: 3, 'list-bullet': 3, login: 4, logout: 4,
  'map-pin': 5, maximize: 5, megaphone: 3, message: 7, package: 3, pencil: 4, pin: 6, play: 3, puzzle: 5, refresh: 3, search: 3, user: 4, wallet: 3, wand: 3, watch: 3, wrench: 3,
  'at-sign': 2, 'book-open': 2, code: 2, 'external-link': 2, heart: 2, 'menu-arrow': 2, presentation: 2, printer: 2, shield: 2, 'thumbs-up': 2, 'toggle-on': 2, trash: 2,
  bell: 3, camera: 6, cart: 5, compose: 4, desktop: 6, folder: 3, grid: 7, hash: 3, home: 3, key: 6, language: 3, lightbulb: 4, lock: 6, microphone: 5, paintbrush: 8, plug: 7,
  'rotate-ccw': 11, sliders: 5, sort: 5, text: 4, users: 16,
  plus: 5, minus: 5, x: 5, check: 8, chevron: 36, arrow: 16, 'arrow-up-right': 5, sparkle: 4, ban: 3,
};

export function partition(names, opts) {
  const fam = new Map();
  for (const n of names) {
    const f = foldGrammar(n, opts);
    if (!fam.has(f)) fam.set(f, []);
    fam.get(f).push(n);
  }
  return fam;
}

// ── reading the pin ────────────────────────────────────────────────────────────────────────────────────
/** A set from `{ '24/plus': '<svg…>', '24/plus-filled': … }` — what loadSet reads from disk and what a test builds. */
export function setFromTexts(texts, extra = {}) {
  const files = new Map(), names = new Set();
  for (const [key, text] of Object.entries(texts)) {
    const [m, id] = key.split('/');
    files.set(key, { master: Number(m), id, concept: conceptOf(id), filled: id.endsWith('-filled'), text });
    if (!id.endsWith('-filled')) names.add(id);
  }
  return { files, names: [...names].sort(sortStr), _icons: new Map(), _boxes: new Map(), ...extra };
}
export function loadSet(pin) {
  const dir = join(pin, 'src/icons'), texts = {};
  for (const m of MASTER_LIST) {
    const d = join(dir, String(m));
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((x) => x.endsWith('.svg'))) texts[`${m}/${f.slice(0, -4)}`] = readFileSync(join(d, f), 'utf8');
  }
  return setFromTexts(texts, { pin });
}
export function iconOf(set, key) {
  if (!set._icons.has(key)) set._icons.set(key, readSvg(set.files.get(key).text, key));
  return set._icons.get(key);
}
/** Exact ink box of one file, with its sides. */
export function inkOf(set, key) {
  if (!set._boxes.has(key)) {
    const b = inkBoxOf(iconOf(set, key));
    set._boxes.set(key, { ...b, w: b.x1 - b.x0, h: b.y1 - b.y0 });
  }
  return set._boxes.get(key);
}
export const longSide = (b) => Math.max(b.w ?? b.x1 - b.x0, b.h ?? b.y1 - b.y0);
export const keyOf = (m, name, filled = false) => `${m}/${name}${filled ? '-filled' : ''}`;
/** The `<!-- tags: … -->` note, split as build.mjs:27 splits it; null when the file has none. */
export function tagsOf(text) {
  const m = text.match(/<!--\s*tags:\s*([^>]*?)\s*-->/);
  return m ? m[1].split(',').map((t) => t.trim()).filter(Boolean) : null;
}
/** The drawing, as the Library compares it (lab/library.html:317 `outlineSig`, build.mjs `body`): comments
 *  stripped, the root and its close removed, whitespace collapsed. */
export function bodyOf(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
}
/** Every `d` of a file, in file order. */
export const pathsOf = (text) => [...text.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<path\b[^>]*?\bd="([^"]*)"/g)].map((m) => m[1]);
const canon = (d) => { try { return canonical(d); } catch { return { key: d.replace(/\s+/g, ' '), shape: d.replace(/\s+/g, ' '), start: [0, 0] }; } };

// ── §1.1 runs ─────────────────────────────────────────────────────────────────────────────────────────
/** Every stem and the numbers it ships at the default size. A run is a stem with two or more. */
export function numberedRuns(names) {
  const by = new Map();
  for (const name of names) {
    const p = parseName(name);
    if (p.size) continue;
    if (!by.has(p.stem)) by.set(p.stem, []);
    by.get(p.stem).push(p);
  }
  return [...by].map(([stem, ms]) => {
    ms.sort((a, b) => a.n - b.n);
    const numbers = ms.map((m) => m.n), max = numbers[numbers.length - 1];
    const gaps = [];
    for (let k = 1; k <= max; k++) if (!numbers.includes(k)) gaps.push(k);
    return { stem, members: ms.map((m) => m.name), numbers, max, gaps };
  }).sort((a, b) => sortStr(a.stem, b.stem));
}
export const isRun = (r) => r.numbers.length >= 2;

/** C9's order of parts: a size word is last; a number comes right before it, or last; the only word allowed after a
 *  number is C27's arrangement word. Returns the names that break it. */
export function nameFaults(names) {
  const faults = [];
  for (const n of names) {
    const t = n.split('-');
    t.forEach((x, i) => {
      const next = t[i + 1];
      if (/^(small|large)$/.test(x) && i !== t.length - 1) faults.push({ name: n, why: 'size word is not last' });
      if (/^\d+$/.test(x) && !(i === t.length - 1 || (/^(small|large)$/.test(next) && i === t.length - 2) || /^(behind|wide|level)$/.test(next))) faults.push({ name: n, why: 'number is not before the size' });
      if (x === 'filled') faults.push({ name: n, why: 'a concept name carries -filled' });
    });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n)) faults.push({ name: n, why: 'not lower-case words and digits' });
  }
  return faults;
}

export function censusReport(set) {
  const names = set.names;
  const perConcept = names.map((n) => MASTER_LIST.flatMap((m) => [keyOf(m, n), keyOf(m, n, true)]).filter((k) => set.files.has(k)).length);
  const orphans = [...set.files.values()].filter((f) => f.filled && !set.files.has(keyOf(f.master, f.concept))).length;
  const roles = { unnumbered: 0, numbered: 0, sized: 0, figureWord: 0 };
  for (const n of names) {
    const p = parseName(n), fg = figureOf(n);
    if (p.size) roles.sized++;
    else if (p.number != null) roles.numbered++;
    else if (fg && fg.word) roles.figureWord++;
    else roles.unnumbered++;
  }
  const stems = uniq(names.map((n) => parseName(n).stem));
  const grammar = partition(names), mine = partition(names, { unfoldCircles: true });
  const multi = [...grammar].filter(([, m]) => m.length > 1), single = [...grammar].filter(([, m]) => m.length === 1);
  const marks = GRAMMAR_MARK_FAMILIES.filter((f) => grammar.has(f));
  const markConcepts = marks.reduce((n, f) => n + grammar.get(f).length, 0);
  const table = Object.entries(GRAMMAR_TABLE);
  const tableMatches = table.filter(([f, n]) => grammar.get(f)?.length === n).length;
  return {
    concepts: names.length, files: set.files.size, perConcept: { min: Math.min(...perConcept), max: Math.max(...perConcept) }, orphans,
    roles, stems: stems.length,
    grammar: { stems: grammar.size, families: multi.length, singletons: single.length, marks: marks.length, markConcepts,
      objectFamilies: multi.length - marks.length, objectConcepts: names.length - markConcepts - single.length,
      tableFamilies: table.length, tableMatches },
    mine: { stems: mine.size, families: [...mine].filter(([, m]) => m.length > 1).length },
    runs: numberedRuns(names).filter(isRun).length, nameFaults: nameFaults(names),
  };
}

/** Where C9 / doc 07 say a gap in a run is deliberate. Citations only — the gaps themselves are measured. */
export const RECORDED_GAPS = {
  trash: ['docs/07-character.md:44 (C4: -2, -3, -4 "not reassigned")', ':49 (C9 dated note: "still carry their gaps")', ':62 (C22: "left unused")'],
  'check-circle': [':49 (C9 dated note: "still carry their gaps")', ':58 (C18: "long-sweep checks were drawn and not taken")'],
};

export function runsReport(names) {
  const runs = numberedRuns(names).filter(isRun);
  const lengths = {};
  for (const r of runs) lengths[r.numbers.length] = (lengths[r.numbers.length] ?? 0) + 1;
  const gapped = runs.filter((r) => r.gaps.length);
  const variants = runs.reduce((n, r) => n + r.numbers.length - 1, 0);
  return { runs, lengths, gapped, variants, defaultMissing: runs.filter((r) => !r.numbers.includes(1)) };
}

// ── §1.2 a number marks a different drawing ──────────────────────────────────────────────────────────────
/** Pairs of concepts whose files are the same drawing: `whole` (outline AND filled equal) at k masters, and
 *  Library `twins` (outline equal at all three masters). Same body text as the Library compares. */
export function identityReport(set, names) {
  const sig = (m, n, f) => (set.files.has(keyOf(m, n, f)) ? bodyOf(set.files.get(keyOf(m, n, f)).text) : null);
  const pairs = new Map();
  const note = (a, b, m, kind) => {
    const k = `${a} | ${b}`;
    if (!pairs.has(k)) pairs.set(k, { a, b, outline: [], whole: [] });
    pairs.get(k)[kind].push(m);
  };
  for (const m of MASTER_LIST) {
    for (const kind of ['outline', 'whole']) {
      const groups = new Map();
      for (const n of names) {
        const o = sig(m, n, false), f = sig(m, n, true);
        if (!o) continue;
        const key = kind === 'outline' ? o : `${o}||${f}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(n);
      }
      for (const g of groups.values()) for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) note(g[i], g[j], m, kind);
    }
  }
  const all = [...pairs.values()];
  const twinsLib = new Map();      // the Library's groups: outline equal at ALL masters
  const lib = new Map();
  for (const n of names) {
    const s = MASTER_LIST.map((m) => sig(m, n, false) ?? '').join('|');
    if (!s.replace(/\|/g, '')) continue;
    if (!lib.has(s)) lib.set(s, []);
    lib.get(s).push(n);
  }
  for (const g of lib.values()) if (g.length > 1) twinsLib.set(g[0], g);
  return {
    pairs: all,
    wholeAll: all.filter((p) => p.whole.length === 3),
    wholeSome: all.filter((p) => p.whole.length > 0 && p.whole.length < 3),
    outlineOnly: all.filter((p) => p.outline.length === 3 && p.whole.length < 3),
    outlineSome: all.filter((p) => p.outline.length > 0 && p.outline.length < 3 && p.whole.length === 0),
    libraryTwins: [...twinsLib.values()],
  };
}

// ── §1.3 tags ────────────────────────────────────────────────────────────────────────────────────────────
const ANTONYMS = [['ascending', 'descending']];
/** The opposite word is in the tags and the file's own word is not (`sort-alpha-descending-2` says "ascending"). */
export function antonymFaults(name, tags) {
  const faults = [];
  const toks = name.split('-');
  for (const [a, b] of ANTONYMS) for (const [own, other] of [[a, b], [b, a]]) {
    if (toks.includes(own) && tags.includes(other) && !tags.includes(own)) faults.push({ name, own, other });
  }
  return faults;
}
export function tagsReport(set, names) {
  const T = (n, m = 24, f = false) => (set.files.has(keyOf(m, n, f)) ? tagsOf(set.files.get(keyOf(m, n, f)).text) : null);
  const withTags = names.filter((n) => T(n) != null), without = names.filter((n) => T(n) == null);
  const mixed = names.filter((n) => uniq(MASTER_LIST.flatMap((m) => [false, true].filter((f) => set.files.has(keyOf(m, n, f))).map((f) => JSON.stringify(T(n, m, f))))).length > 1);
  const runs = numberedRuns(names).filter(isRun);
  const variants = runs.flatMap((r) => r.members.slice(1));
  const sized = names.filter((n) => parseName(n).size);
  const identical = [], noOwn = [], own = new Map();
  for (const r of runs) {
    const ts = r.members.map((n) => ({ n, t: T(n) ?? [] }));
    const key = (t) => uniq(t).sort().join('|');
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) if (key(ts[i].t) === key(ts[j].t)) identical.push({ stem: r.stem, a: ts[i].n, b: ts[j].n, tags: ts[i].t });
    const def = new Set(ts[0].t);
    for (const v of ts.slice(1)) {
      const mine = uniq(v.t.filter((t) => !def.has(t)));
      if (!mine.length) noOwn.push(v.n);
      for (const w of mine) { if (!own.has(w)) own.set(w, new Set()); own.get(w).add(r.stem); }
    }
  }
  const faults = names.flatMap((n) => antonymFaults(n, T(n) ?? []));
  const sizedDiffer = sized.filter((n) => key2(T(n)) !== key2(T(parseName(n).name.replace(/-(small|large)$/, ''))));
  const identicalConcepts = uniq(identical.flatMap((x) => [x.a, x.b]));
  const figureNames = names.filter((n) => /^users(-\d+)?(-(behind|wide|level))?$/.test(n));
  const familyWords = ['team', 'group', 'people', 'members'];
  const lacking = figureNames.filter((n) => !familyWords.every((w) => (T(n) ?? []).includes(w)));
  return {
    concepts: names.length, withTags, without, mixed, variants: variants.length,
    variantsWithTags: variants.filter((n) => T(n) != null).length,
    identical, identicalRuns: uniq(identical.map((x) => x.stem)), identicalConcepts, noOwn, faults, sized: sized.length, sizedDiffer,
    usersLacking: lacking,
    // kind (1): stands against C9's "its style word is written into every file" — a same-tag pair, a shape with no word of its
    // own, a word that lies. kind (3): the four `users-4*` lack the group's search words, which no rule asks for.
    against: uniq([...identicalConcepts, ...noOwn, ...faults.map((f) => f.name)]),
    problems: uniq([...identicalConcepts, ...noOwn, ...faults.map((f) => f.name), ...lacking]),
    vocabulary: [...own].map(([w, s]) => [w, s.size]).sort((a, b) => b[1] - a[1] || sortStr(a[0], b[0])),
  };
}
const key2 = (t) => (t ? uniq(t).sort().join('|') : null);

// ── §1.4 do numbers travel across sibling stems ─────────────────────────────────────────────────────────
/** Sibling sets: stems the docs or the sheet group as one family. `rule` names the sentence that says the
 *  numbers travel, or null where none does (then it is a measured fact, not a violation). */
export const SIBLING_SETS = [
  { id: 'chevron ×4 directions', stems: ['chevron-up', 'chevron-down', 'chevron-left', 'chevron-right'], rule: 'C12 (up, left, right are the same drawings turned)' },
  { id: 'arrow ×4 directions + arrow-up-right', stems: ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up-right'], rule: 'C16 (arrow-<dir>-2 wide, -3 flat, -4 closed)' },
  { id: 'layout ×4 regions', stems: ['layout-footer', 'layout-header', 'layout-sidebar', 'layout-sidebar-right'], rule: 'C29 (the number names the construction, across the regions)' },
  { id: 'check, check-circle, checkbox', stems: ['check', 'check-circle', 'checkbox'], rule: 'C9 (a composite is numbered after the shape it uses)' },
  { id: 'login, logout', stems: ['login', 'logout'], rule: null },
  { id: 'alert-circle, alert-triangle', stems: ['alert-circle', 'alert-triangle'], rule: null },
  { id: 'sort-alpha ascending / descending', stems: ['sort-alpha-ascending', 'sort-alpha-descending'], rule: null },
  { id: 'sort-numeric ascending / descending', stems: ['sort-numeric-ascending', 'sort-numeric-descending'], rule: null },
];
/** For each number, the words each stem adds to its own default — and which stems agree. */
export function travelReport(set, names) {
  const T = (n) => (set.files.has(keyOf(24, n)) ? tagsOf(set.files.get(keyOf(24, n)).text) ?? [] : null);
  const have = new Set(names);
  return SIBLING_SETS.map((s) => {
    const stems = s.stems.filter((st) => have.has(st));
    const numbers = uniq(names.filter((n) => { const p = parseName(n); return !p.size && stems.includes(p.stem) && p.n > 1; }).map((n) => parseName(n).n)).sort(byNumber);
    const rows = numbers.map((k) => {
      const per = stems.filter((st) => have.has(`${st}-${k}`)).map((st) => {
        const def = new Set(T(st)), mine = uniq(T(`${st}-${k}`).filter((t) => !def.has(t)));
        return { stem: st, words: mine };
      });
      const groups = new Map();
      for (const p of per) { const key = [...p.words].sort().join(' · ') || '(none)'; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(p.stem); }
      return { number: k, groups: [...groups].map(([words, st]) => ({ words, stems: st })), agree: groups.size === 1, onlyIn: per.length === 1 ? per[0].stem : null };
    });
    return { ...s, stems, rows, travel: rows.filter((r) => r.agree).length, differ: rows.filter((r) => !r.agree).map((r) => r.number) };
  });
}
/** Which check-circle member carries the same tick as each checkbox member (translation-invariant shape; the
 *  tick is the second path of both). Exact at 24 and 20; at 16 only the small tick is exact (card 1.1 §3.3). */
export function tickTravel(set, master) {
  const tick = (n) => (set.files.has(keyOf(master, n)) ? pathsOf(set.files.get(keyOf(master, n)).text)[1] : null);
  const circles = ['check-circle', 'check-circle-small', 'check-circle-3', 'check-circle-3-small', 'check-circle-4', 'check-circle-4-small'].filter((n) => tick(n));
  const out = [];
  for (const cb of ['checkbox', 'checkbox-2', 'checkbox-3', 'checkbox-4']) {
    if (!tick(cb)) continue;
    const s = canon(tick(cb)).shape;
    out.push({ box: cb, tickIs: circles.filter((c) => canon(tick(c)).shape === s) });
  }
  return out;
}

// ── §1.4b one drawing turned ──────────────────────────────────────────────────────────────────────────
const TURNS = {
  mirrorY: (m, [x, y]) => [x, m - y],           // top to bottom
  mirrorX: (m, [x, y]) => [m - x, y],           // left to right
  quarterCW: (m, [x, y]) => [m - y, x],
  quarterCCW: (m, [x, y]) => [y, m - x],
};
/** Dense on-curve samples of every path of a file, strokes and areas alike. */
export function samplesOf(set, key, step = 0.05) {
  const ic = iconOf(set, key), out = [];
  for (const p of [...ic.strokes, ...ic.areas]) for (const pl of polylines(p, step)) out.push(...pl.pts);
  return out;
}
/** How far apart two drawings are once one is turned: every sample of the turned one that has no sample of the
 *  other within 1e-5 is measured to the nearest (brute force over those few only). 0 means the same samples — the
 *  same drawing, exactly. A drift of 0.01 reads as 0.01. */
export function turnDistance(A, B, turn, m) {
  const key = ([x, y]) => `${Math.round(x * 1e5)},${Math.round(y * 1e5)}`;
  const side = (P, Q, f) => {
    const have = new Set(Q.map(key));
    let worst = 0;
    for (const p of P) { const t = f ? f(m, p) : p; if (have.has(key(t))) continue; let best = Infinity; for (const q of Q) { const d = Math.hypot(t[0] - q[0], t[1] - q[1]); if (d < best) best = d; } worst = Math.max(worst, best); }
    return worst;
  };
  const inverse = { mirrorY: 'mirrorY', mirrorX: 'mirrorX', quarterCW: 'quarterCCW', quarterCCW: 'quarterCW' }[turn];
  return Math.max(side(A, B, TURNS[turn]), side(B, A, TURNS[inverse]));
}
/** C29 (`docs/07-character.md:69`): header is footer mirrored top to bottom, sidebar is footer turned a quarter, and
 *  sidebar-right is the sidebar reflected about the canvas centre — "no adjustment at any master". */
export function layoutTurns(set, names) {
  const have = new Set(names), rows = [];
  for (const n of ['', '-2', '-3', '-4']) for (const style of STYLES) for (const m of MASTER_LIST) {
    const f = style === 'filled', k = (name) => keyOf(m, `${name}${n}`, f);
    if (!['layout-footer', 'layout-header', 'layout-sidebar', 'layout-sidebar-right'].every((x) => have.has(`${x}${n}`))) continue;
    const foot = samplesOf(set, k('layout-footer')), side = samplesOf(set, k('layout-sidebar'));
    rows.push({ n: n || '-1', style, master: m,
      header: turnDistance(foot, samplesOf(set, k('layout-header')), 'mirrorY', m),
      sidebar: turnDistance(foot, side, 'quarterCW', m),
      right: turnDistance(side, samplesOf(set, k('layout-sidebar-right')), 'mirrorX', m) });
  }
  return rows;
}

/** Where C9's two numbering sentences are written down. `docs/07-character.md:49` states them; the Settled table's row
 *  (`CLAUDE.md:193`) and the icon skill are what a drawing session reads. Read from the pin; a hit is `file:line`. */
export const RULE_FILES = ['docs/07-character.md', 'CLAUDE.md', '.claude/skills/icon/SKILL.md'];
export const RULE_PHRASES = { 'approval order': /approval order/i, 'numbered after the shape': /numbered after the shape/i, 'C9': /\bC9\b/ };
export function ruleText(pin) {
  const out = {};
  for (const f of RULE_FILES) {
    const path = join(pin, f);
    out[f] = { exists: existsSync(path), hits: Object.fromEntries(Object.keys(RULE_PHRASES).map((k) => [k, []])) };
    if (!out[f].exists) continue;
    readFileSync(path, 'utf8').split('\n').forEach((line, i) => { for (const [k, re] of Object.entries(RULE_PHRASES)) if (re.test(line)) out[f].hits[k].push(i + 1); });
  }
  return out;
}

// ── §2 size families ─────────────────────────────────────────────────────────────────────────────────────
export function sizeFamilies(names) {
  const have = new Set(names), by = new Map();
  for (const name of names) {
    const p = parseName(name);
    if (!p.size) continue;
    const base = name.slice(0, -(p.size.length + 1));
    if (!by.has(base)) by.set(base, { base, small: false, large: false, hasDefault: have.has(base) });
    by.get(base)[p.size] = true;
  }
  return [...by.values()].sort((a, b) => sortStr(a.base, b.base));
}
/** C8's step at one master from three long sides (small and large may be absent). */
export function stepRow(master, L, spec = DEFAULT_SPEC) {
  const want = spec.SIZE_STEP[master], row = { master, want, L };
  if (L.small != null) { row.stepSmall = L.default - L.small; row.devSmall = row.stepSmall - want; }
  if (L.large != null) { row.stepLarge = L.large - L.default; row.devLarge = row.stepLarge - want; }
  return row;
}
const declaresMark = (set, key) => iconOf(set, key).notes.keylineMark;
export function sizeReport(set, names) {
  const fams = sizeFamilies(names).map((fam) => {
    const kinds = uniq(MASTER_LIST.flatMap((m) => STYLES.map((s) => declaresMark(set, keyOf(m, fam.base, s === 'filled')) ? 'mark' : 'container')));
    const cells = [];
    for (const style of STYLES) for (const m of MASTER_LIST) {
      const f = style === 'filled', L = { default: longSide(inkOf(set, keyOf(m, fam.base, f))) };
      if (fam.small) L.small = longSide(inkOf(set, keyOf(m, `${fam.base}-small`, f)));
      if (fam.large) L.large = longSide(inkOf(set, keyOf(m, `${fam.base}-large`, f)));
      cells.push({ style, ...stepRow(m, L, specOf(set)) });
    }
    return { ...fam, kind: kinds.length === 1 ? kinds[0] : 'mixed', cells };
  });
  const marks = fams.filter((f) => f.kind === 'mark');
  const devs = marks.flatMap((f) => f.cells.flatMap((c) => [c.devSmall, c.devLarge].filter((d) => d != null)));
  return { families: fams, marks, containers: fams.filter((f) => f.kind === 'container'), mixed: fams.filter((f) => f.kind === 'mixed'),
    maxDev: devs.length ? Math.max(...devs.map(Math.abs)) : 0, markCells: marks.reduce((n, f) => n + f.cells.length, 0), steps: devs.length,
    members: fams.reduce((n, f) => n + 1 + f.small + f.large, 0) };
}

const unionBox = (bs) => bs.reduce((a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) }),
  { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
const subBox = (sp) => unionBox(sp.segs.map(segBox));
const boxLong = (b) => Math.max(b.x1 - b.x0, b.y1 - b.y0);
const boxArea = (b) => (b.x1 - b.x0) * (b.y1 - b.y0);
const grown = (box, h) => ({ x0: box.x0 - h, y0: box.y0 - h, x1: box.x1 + h, y1: box.y1 + h });
/** A container icon's parts. Outline: the first stroke is the container, the rest the mark (lint.mjs:332-335 asks
 *  the same). Filled: the area's largest subpath is the disc, the others the cut-out mark. */
export function partsOf(icon, filledShape) {
  if (!filledShape) {
    const [first, ...rest] = icon.strokes;
    const cb = (p) => grown(unionBox(p.subpaths.map(subBox)), p.width / 2);
    return { container: cb(first), containerD: first.d, mark: rest.length ? unionBox(rest.map(cb)) : null };
  }
  const subs = icon.areas.flatMap((a) => a.subpaths).map((sp) => ({ sp, b: subBox(sp) })).sort((p, q) => boxArea(q.b) - boxArea(p.b));
  return { container: subs[0].b, containerD: null, mark: subs.length > 1 ? unionBox(subs.slice(1).map((s) => s.b)) : null };
}
export function containerReport(set, sizeRep) {
  return sizeRep.containers.map((fam) => {
    const rows = [];
    for (const m of MASTER_LIST) {
      const row = { master: m };
      for (const style of STYLES) {
        const f = style === 'filled';
        const d = partsOf(iconOf(set, keyOf(m, fam.base, f)), f), s = partsOf(iconOf(set, keyOf(m, `${fam.base}-small`, f)), f);
        row[style] = {
          containerSame: Math.abs(boxLong(d.container) - boxLong(s.container)) < 1e-9 && d.container.x0 === s.container.x0 && d.container.y0 === s.container.y0
            && (d.containerD == null || d.containerD === s.containerD),
          container: boxLong(d.container), markDefault: boxLong(d.mark), markSmall: boxLong(s.mark), step: boxLong(d.mark) - boxLong(s.mark),
        };
      }
      rows.push(row);
    }
    return { base: fam.base, rows };
  });
}

/** lint.mjs `checkFamilies` over the pin's own lint.mjs: the size it reads, its verdict, and where the exact
 *  measure says otherwise. Imports the PIN's lint, so the reading is the lint that shipped at the pin. */
export async function lintReading(set, pin, sizeRep) {
  const lint = await import(pathToFileURL(join(pin, 'tools/lint.mjs')).href);
  const results = new Map(), exact = new Map();
  for (const fam of sizeRep.families) for (const n of [fam.base, ...(fam.small ? [`${fam.base}-small`] : []), ...(fam.large ? [`${fam.base}-large`] : [])]) {
    for (const m of MASTER_LIST) for (const f of [false, true]) {
      const key = keyOf(m, n, f), file = `${n}${f ? '-filled' : ''}.svg`;
      results.set(`${m}/${file}`, lint.lintSource(m, file, set.files.get(key).text));
      exact.set(`${m}/${file}`, longSide(inkOf(set, key)));
    }
  }
  lint.checkFamilies(results);
  let maxDiff = 0, files = 0;
  const warned = [];
  for (const [k, r] of results) {
    files++;
    maxDiff = Math.max(maxDiff, Math.abs((r.size ?? 0) - exact.get(k)));
    if (r.warnings.some((w) => /C8|variant has no default/.test(w))) warned.push({ file: k, warnings: r.warnings });
  }
  // where lint's reach ends. (a) a container's inner mark is read from the outline file only: `inner` is null on a
  // filled file that has area paths. (b) the check is keyed on the -small / -large suffix: checkbox-4, filled in as
  // `checkbox-small`, is held to C18's two tests (same container, smaller mark) and what lint says is the probe.
  const containerFiles = sizeRep.containers.flatMap((f) => [f.base, `${f.base}-small`]);
  const innerOf = (f) => MASTER_LIST.flatMap((m) => containerFiles.map((n) => results.get(`${m}/${n}${f ? '-filled' : ''}.svg`).inner));
  const probe = new Map();
  if (set.files.has(keyOf(24, 'checkbox')) && set.files.has(keyOf(24, 'checkbox-4'))) {
    for (const m of MASTER_LIST) for (const f of [false, true]) {
      probe.set(`${m}/checkbox${f ? '-filled' : ''}.svg`, lint.lintSource(m, `checkbox${f ? '-filled' : ''}.svg`, set.files.get(keyOf(m, 'checkbox', f)).text));
      probe.set(`${m}/checkbox-small${f ? '-filled' : ''}.svg`, lint.lintSource(m, `checkbox-small${f ? '-filled' : ''}.svg`, set.files.get(keyOf(m, 'checkbox-4', f)).text));
    }
    lint.checkFamilies(probe);
  }
  return {
    files, maxDiff, warned, lintSizes: results,
    innerRead: { outline: innerOf(false).filter((x) => x != null).length, filled: innerOf(true).filter((x) => x != null).length, of: innerOf(false).length },
    probe: [...probe].filter(([k]) => /checkbox-small/.test(k)).map(([k, r]) => ({ file: k, warnings: r.warnings, inner: r.inner, size: r.size })),
  };
}

// ── §3 the grid and the sheet ────────────────────────────────────────────────────────────────────────────
export function gridReport(set, names) {
  const missing = [];
  for (const n of names) for (const m of MASTER_LIST) for (const f of [false, true]) if (!set.files.has(keyOf(m, n, f))) missing.push(keyOf(m, n, f));
  const orphans = [...set.files.values()].filter((f) => f.filled && !names.includes(f.concept));
  const fams = sizeFamilies(names);
  const noDefault = fams.filter((f) => !f.hasDefault).map((f) => f.base);
  // size-bearing objects: stems with at least one sized member, the sizes each of their numbers ships
  const have = new Set(names), objects = new Map();
  for (const f of fams) {
    const p = parseName(f.base);
    if (!objects.has(p.stem)) objects.set(p.stem, new Map());
    objects.get(p.stem).set(p.n, `${f.small ? 'S' : ''}D${f.large ? 'L' : ''}`);
  }
  // numbers that exist at the default size but carry no size, within a stem that has sizes
  const bare = [];
  for (const [stem, per] of objects) {
    for (const n of names) {
      const p = parseName(n);
      if (!p.size && p.stem === stem && !per.has(p.n)) bare.push(n);
    }
  }
  const asym = [...objects].filter(([, per]) => uniq([...per.values()]).length > 1).map(([stem]) => stem);
  return { files: set.files.size, expected: names.length * 6, missing, orphans, noDefault, objects, bare, asym, sizeFamilies: fams.length,
    sizedConcepts: names.filter((n) => parseName(n).size).length, familyConcepts: fams.reduce((n, f) => n + 1 + f.small + f.large, 0), have: have.size };
}

/** Words a name can end in that describe a shape's style or orientation — what C9 gives to a number and a tag
 *  (`docs/07-character.md:49`: "a shape variant is -2, -3 …, never a word"). A list to be read by hand afterwards. */
export const STYLE_WORDS = ['dotted', 'dashed', 'horizontal', 'vertical', 'stacked'];
/** Words outside that list which raise the same question (is this a shape of its base, or an icon of its own?). */
export const NEAR_STYLE_WORDS = ['open', 'closed', 'wide', 'narrow', 'tall', 'short'];

/** research/queue.md rows: `- [x] 42. `users-2` · category · variant of `users` — note · approved 2026-09-23`. */
export function parseSheet(text) {
  const rows = [];
  let section = null;
  for (const line of text.split('\n')) {
    const h = line.match(/^## (\w) · (.*)/);
    if (h) { section = h[1]; continue; }
    const m = line.match(/^- \[(.)\] (\d+)\. `([^`]+)`(.*)$/);
    if (!m) continue;
    rows.push({ status: m[1], n: Number(m[2]), name: m[3], section, variantOf: m[4].match(/variant of `([^`]+)`/)?.[1] ?? null,
      approved: m[4].match(/approved (\d{4}-\d{2}-\d{2})/)?.[1] ?? null });
  }
  return rows;
}
export function sheetReport(rows, names) {
  const have = new Set(names);
  const open = rows.filter((r) => r.status !== 'x'), done = rows.filter((r) => r.status === 'x');
  const statusCounts = {};
  for (const r of rows) statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  const runs = new Map(numberedRuns(names).map((r) => [r.stem, r]));
  const withBase = open.filter((r) => r.variantOf);
  const shipped = withBase.filter((r) => have.has(r.variantOf)), queuedBase = withBase.filter((r) => !have.has(r.variantOf));
  const byBase = new Map();
  for (const r of shipped) { if (!byBase.has(r.variantOf)) byBase.set(r.variantOf, []); byBase.get(r.variantOf).push(r.name); }
  const bases = [...byBase].map(([base, rel]) => {
    const p = parseName(base), run = runs.get(p.stem);
    return { base, relatives: rel, shapes: run ? run.numbers.length : 1 };
  }).sort((a, b) => b.relatives.length - a.relatives.length || sortStr(a.base, b.base));
  const sized = open.filter((r) => /-(small|large)$/.test(r.name)), numbered = open.filter((r) => /-\d+$/.test(r.name));
  return {
    rows: rows.length, statusCounts, open: open.length, done: done.length,
    doneNotInSet: done.filter((r) => !have.has(r.name)).map((r) => r.name), setNotDone: names.filter((n) => !done.some((r) => r.name === n)),
    openInSet: open.filter((r) => have.has(r.name)).map((r) => r.name),
    duplicates: uniq(rows.map((r) => r.name).filter((n, i, a) => a.indexOf(n) !== i)),
    withBase: withBase.length, shipped: shipped.length, queuedBase: queuedBase.length, noBase: open.length - withBase.length,
    sized: sized.map((r) => r.name), numbered: numbered.map((r) => r.name),
    bases, basesMultiShape: bases.filter((b) => b.shapes > 1),
    onDefaultShape: shipped.length, onEveryShape: shipped.reduce((n, r) => n + (bases.find((b) => b.base === r.variantOf)?.shapes ?? 1), 0),
    // names that a numbering rule speaks for: C29 gives a later layout region the same four numbers, C27 gives a
    // later composite on a figure the figure's number
    styleWords: open.filter((r) => r.variantOf && STYLE_WORDS.includes(r.name.split('-').pop())).map((r) => ({ name: r.name, base: r.variantOf, baseShips: have.has(r.variantOf) })),
    styleNoBase: open.filter((r) => !r.variantOf && STYLE_WORDS.includes(r.name.split('-').pop())).map((r) => r.name),
    nearStyle: open.filter((r) => NEAR_STYLE_WORDS.includes(r.name.split('-').pop())).map((r) => ({ name: r.name, base: r.variantOf, baseShips: r.variantOf ? have.has(r.variantOf) : null })),
    layoutRows: open.filter((r) => /^layout-/.test(r.name)).map((r) => r.name),
    figureRows: open.filter((r) => /^users?(-|$)/.test(r.name)).map((r) => r.name),
  };
}

// ── §4 figure families ───────────────────────────────────────────────────────────────────────────────────
/** lab/figures.html:113-170 restated: the rows are `user` and every `user-<n>` that ships; the columns are the
 *  figure, its group, and one per arrangement word; a cell is shipped when its name ships. (A cell could also be a
 *  draft on a board — the page reads lab/drafts for that, which a cell that already ships never needs.) */
export function figuresPage(names, { object = 'user', group = 'users', words = ['behind', 'wide', 'level'] } = {}) {
  const re = new RegExp(`^${object.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+$`);
  const figures = names.filter((n) => n === object || re.test(n)).sort((a, b) => (+(a.split('-').pop()) || 1) - (+(b.split('-').pop()) || 1));
  const cols = ['figure', 'group', ...words];
  const nameFor = (fig, col) => { const n = fig === object ? '' : fig.slice(object.length); return col === 'figure' ? fig : col === 'group' ? `${group}${n}` : `${group}${n}-${col}`; };
  const have = new Set(names);
  const cells = figures.map((fig) => cols.map((col) => { const name = nameFor(fig, col); return { fig, col, name, shipped: have.has(name) }; }));
  const flat = cells.flat();
  return { figures, cols, cells, shipped: flat.filter((c) => c.shipped).length, missing: flat.filter((c) => !c.shipped) };
}
/** The page's own defaults, read from the page at the pin. */
export function figuresDefaults(html) {
  return {
    object: html.match(/const OBJECT = q\.get\('object'\) \|\| '([^']+)'/)?.[1] ?? null,
    group: html.match(/const GROUP = q\.get\('group'\) \|\| '([^']+)'/)?.[1] ?? null,
    words: (html.match(/const WORDS = \(q\.get\('words'\) \?\? '([^']+)'\)/)?.[1] ?? '').split(',').filter(Boolean),
  };
}
export function figureReport(set, names, html) {
  const members = names.filter((n) => figureOf(n));
  const box = (n, m) => { const b = inkOf(set, keyOf(m, n)); return `${r2(b.w)}×${r2(b.h)}`; };
  const fb = (n, m) => { const b = inkOf(set, keyOf(m, n, true)); return `${r2(b.w)}×${r2(b.h)}`; };
  const rows = members.map((n) => ({ name: n, ...figureOf(n), boxes: MASTER_LIST.map((m) => box(n, m)), filledBoxes: MASTER_LIST.map((m) => fb(n, m)),
    tags: tagsOf(set.files.get(keyOf(24, n)).text) ?? [] }));
  const def = html ? figuresDefaults(html) : { object: 'user', group: 'users', words: ['behind', 'wide', 'level'] };
  const page = figuresPage(names, def);
  const byWord = new Map();
  for (const r of rows.filter((x) => x.object === 'users')) { const w = r.word ?? '(default)'; if (!byWord.has(w)) byWord.set(w, []); byWord.get(w).push(r); }
  const arrangement = [...byWord].map(([word, rs]) => ({ word, members: rs.map((r) => r.name), distinct: uniq(rs.map((r) => r.boxes.join(' · '))), filledSame: uniq(rs.map((r) => r.filledBoxes.join(' · '))).length === 1 }));
  const figureBoxes = rows.filter((r) => r.object === 'user').map((r) => ({ name: r.name, boxes: r.boxes }));
  const familyWords = ['team', 'group', 'people', 'members'];
  const users = rows.filter((r) => r.object === 'users');
  const figureTagged = (r) => (r.figure === 1 ? null : r.tags.includes(`user-${r.figure}`));
  return {
    rows, def, page, arrangement, figureBoxes,
    familyWordsMissing: users.filter((r) => !familyWords.every((w) => r.tags.includes(w))).map((r) => r.name),
    figureNamedInTags: users.filter((r) => r.figure > 1).map((r) => ({ name: r.name, figure: r.figure, named: figureTagged(r) })),
    heads: names.filter((n) => /^users?(-\d+)?-heads$/.test(n)),
  };
}

// ── §5 level families ───────────────────────────────────────────────────────────────────────────────────
/** The members of a level family and what C28 asks of each, at every master and style. */
export function levelReport(set, names, full) {
  const members = names.filter((n) => n === full || n.startsWith(`${full}-`));
  const out = [];
  for (const n of members) {
    const row = { name: n, cells: [], anchors: [] };
    for (const m of MASTER_LIST) for (const style of STYLES) {
      const f = style === 'filled';
      const key = keyOf(m, n, f), fk = keyOf(m, full, f);
      const ic = iconOf(set, key), base = iconOf(set, fk);
      const mine = pathsOf(set.files.get(key).text).map(canon), theirs = pathsOf(set.files.get(fk).text).map(canon);
      const same = mine.filter((p) => theirs.some((t) => t.key === p.key)).length;
      const moved = mine.filter((p) => !theirs.some((t) => t.key === p.key) && theirs.some((t) => t.shape === p.shape))
        .map((p) => { const t = theirs.find((x) => x.shape === p.shape); return [r2(p.start[0] - t.start[0]), r2(p.start[1] - t.start[1])]; });
      const b = inkOf(set, key), fb = inkOf(set, fk);
      const inside = b.x0 >= fb.x0 - 0.01 && b.x1 <= fb.x1 + 0.01 && b.y0 >= fb.y0 - 0.01 && b.y1 <= fb.y1 + 0.01;
      row.cells.push({ master: m, style, paths: mine.length, same, moved, inside, sharesLeft: Math.abs(b.x0 - fb.x0) <= 0.01, sharesRight: Math.abs(b.x1 - fb.x1) <= 0.01,
        w: b.w, h: b.h, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, anchor: ic.notes.anchor, fullPaths: theirs.length });
    }
    row.anchors = uniq(row.cells.map((c) => c.anchor ?? '—'));
    out.push(row);
  }
  return out;
}
/** Which paths of the full member a member drops, and whether they are the outermost (outside-in). The body is
 *  the path with the largest ink box; a wave's distance is the x of its centreline box's centre. */
export function wavesDropped(set, full, member, master) {
  const fp = iconOf(set, keyOf(master, full)).strokes, mk = new Set(iconOf(set, keyOf(master, member)).strokes.map((p) => canon(p.d).key));
  const info = fp.map((p) => { const b = unionBox(p.subpaths.map(subBox)); return { kept: mk.has(canon(p.d).key), x0: b.x0, x1: b.x1, area: boxArea(b) }; });
  const body = info.reduce((a, b) => (b.area > a.area ? b : a));
  const waves = info.filter((i) => i !== body);
  const kept = waves.filter((w) => w.kept), dropped = waves.filter((w) => !w.kept);
  return { body: body.kept, kept: kept.length, dropped: dropped.length,
    outsideIn: dropped.every((d) => kept.every((k) => d.x0 >= k.x1 - 1e-9)), keptX: kept.map((k) => [r2(k.x0), r2(k.x1)]), droppedX: dropped.map((d) => [r2(d.x0), r2(d.x1)]) };
}
export const AMOUNT_WORDS = ['low', 'medium', 'mid', 'high', 'none', 'full', 'empty', 'half', 'quarter', 'min', 'max', 'zero', 'off', 'on', 'closed', 'partial'];
export const AMOUNT_STEMS = ['battery', 'signal', 'wifi', 'brightness', 'contrast', 'volume', 'loader', 'progress', 'gauge', 'timer', 'zoom', 'speaker', 'thermometer', 'bars'];
/** Names that say an amount or a state, by token — a regex over names, to be read by hand afterwards. */
export function amountScan(list) {
  return list.map((n) => {
    const toks = n.split('-');
    return { name: n, words: toks.filter((t) => AMOUNT_WORDS.includes(t)), stems: toks.filter((t) => AMOUNT_STEMS.includes(t)) };
  }).filter((r) => r.words.length || r.stems.length);
}

// ── §6 one ink box ───────────────────────────────────────────────────────────────────────────────────────
/** The named keyline a box matches within 0.5, as lint.mjs:352 does; null when none. */
export function keylineOf(master, w, h, spec = DEFAULT_SPEC) {
  const keylines = Object.entries(spec.MASTERS[master].keylines).filter(([k]) => k !== 'diagonal');
  return keylines.find(([, [kw, kh]]) => Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5)?.[0] ?? null;
}
export const declOf = (icon) => (icon.notes.keylineMark ? 'mark' : icon.notes.box ? 'box' : icon.notes.anchor ? 'anchor' : 'silhouette');
/** Definition B of "one box": every member's 2 dp box within 0.01 of every other's — how lint holds a drawing to a declared
 *  box (`tools/lint.mjs:349`). Definition A is the same 2 dp box exactly. Hundredths are compared as integers, so a float
 *  cannot decide it. */
export const BOX_TOLERANCE = 1;
const hundredths = (x) => Math.round(x * 100);
/** The spread of each side of a list of boxes, in hundredths. */
export const spreadOf = (boxes) => [boxes.map((b) => hundredths(b.w)), boxes.map((b) => hundredths(b.h))].map((v) => Math.max(...v) - Math.min(...v));
export const withinTolerance = (boxes, tolerance = BOX_TOLERANCE) => spreadOf(boxes).every((d) => d <= tolerance);
export function runBoxes(set, names) {
  const runs = numberedRuns(names).filter(isRun);
  return runs.map((r) => {
    const per = (f) => MASTER_LIST.map((m) => uniq(r.members.map((n) => { const b = inkOf(set, keyOf(m, n, f)); return `${r2(b.w)}×${r2(b.h)}`; })).length);
    const outline = per(false), filled = per(true);
    const boxesAt = (m) => r.members.map((n) => inkOf(set, keyOf(m, n)));
    const tolOutline = MASTER_LIST.map((m) => withinTolerance(boxesAt(m)));
    const held = (idx) => MASTER_LIST.every((m) => uniq(r.members.map((n) => { const b = inkOf(set, keyOf(m, n)); return r2(idx === 0 ? b.w : b.h); })).length === 1);
    const heldTol = (idx) => MASTER_LIST.every((m) => spreadOf(boxesAt(m))[idx] <= BOX_TOLERANCE);
    const decls = uniq(r.members.map((n) => declOf(iconOf(set, keyOf(24, n)))));
    const first = inkOf(set, keyOf(24, r.members[0]));
    const kind = outline.every((x) => x === 1) ? 'one' : outline.some((x) => x === 1) ? 'some' : 'none';
    const tolKind = tolOutline.every(Boolean) ? 'one' : tolOutline.some(Boolean) ? 'some' : 'none';
    const exact = MASTER_LIST.map((m) => ({ w: boxesAt(m).map((b) => b.w), h: boxesAt(m).map((b) => b.h) }));
    return { stem: r.stem, members: r.members, outline, filled, kind, filledOne: filled.every((x) => x === 1), decls,
      keyline: kind === 'one' ? keylineOf(24, r2(first.w), r2(first.h), specOf(set)) : null, box24: `${r2(first.w)}×${r2(first.h)}`,
      keylineAny: keylineOf(24, r2(first.w), r2(first.h), specOf(set)), tolOutline, tolKind, exact,
      heldW: held(0), heldH: held(1), heldWTol: heldTol(0), heldHTol: heldTol(1) };
  });
}
export function boxesReport(set, names) {
  const rows = runBoxes(set, names);
  const one = rows.filter((r) => r.kind === 'one'), some = rows.filter((r) => r.kind === 'some'), none = rows.filter((r) => r.kind === 'none');
  const oneKind = (r) => (r.decls.includes('mark') ? 'mark' : r.decls.includes('box') ? 'agreed box' : r.keyline ? 'named keyline' : 'neither');
  const noneKind = (r) => (r.decls.length === 1 && r.decls[0] === 'mark' ? 'all marks' : !r.decls.includes('mark') ? 'no marks' : 'mixed');
  const rest = [...some, ...none];
  const kindOfRun = (r) => (r.decls.length === 1 && r.decls[0] === 'mark' ? 'marks' : !r.decls.includes('mark') ? 'silhouette or agreed box' : 'mixed');
  const tol = { one: rows.filter((r) => r.tolKind === 'one'), some: rows.filter((r) => r.tolKind === 'some'), none: rows.filter((r) => r.tolKind === 'none') };
  const byKind = Object.fromEntries(['marks', 'silhouette or agreed box', 'mixed'].map((k) => [k, {
    runs: rows.filter((r) => kindOfRun(r) === k).length, A: one.filter((r) => kindOfRun(r) === k).length, B: tol.one.filter((r) => kindOfRun(r) === k).length }]));
  const flips = rows.flatMap((r) => MASTER_LIST.map((m, i) => ({ stem: r.stem, master: m, exact: r.exact[i], strict: r.outline[i], tol: r.tolOutline[i], spread: spreadOf(r.members.map((n, j) => ({ w: r.exact[i].w[j], h: r.exact[i].h[j] }))) }))
    .filter((x) => x.tol && x.strict !== 1));
  return {
    rows, one, some, none, oneKinds: count(one, oneKind), noneKinds: count(none, noneKind), someKinds: count(some, noneKind),
    tolerant: { ...tol, at: MASTER_LIST.map((m, i) => rows.filter((r) => r.tolOutline[i]).length), flips, byKind,
      held: (() => { const restTol = [...tol.some, ...tol.none]; return { rest: restTol.length, W: restTol.filter((r) => r.heldWTol && !r.heldHTol).map((r) => r.stem),
        H: restTol.filter((r) => r.heldHTol && !r.heldWTol).map((r) => r.stem), neither: restTol.filter((r) => !r.heldWTol && !r.heldHTol).map((r) => r.stem) }; })(),
      oneKinds: count(tol.one, (r) => (r.decls.includes('mark') ? 'mark' : r.decls.includes('box') ? 'agreed box' : r.keylineAny ? 'named keyline' : 'neither')) },
    filledDiffers: one.filter((r) => !r.filledOne).map((r) => r.stem),
    keylines: count(one.filter((r) => oneKind(r) === 'named keyline'), (r) => r.keyline),
    heldW: rest.filter((r) => r.heldW && !r.heldH).map((r) => r.stem), heldH: rest.filter((r) => r.heldH && !r.heldW).map((r) => r.stem),
    heldNeither: rest.filter((r) => !r.heldW && !r.heldH).map((r) => r.stem),
  };
}
const count = (list, f) => { const o = {}; for (const x of list) { const k = f(x); o[k] = (o[k] ?? 0) + 1; } return o; };
/** The same question over the grammar card's folded partition (or this card's, with the circles unfolded): of the
 *  families of two or more members, how many keep one outline box at all three masters, at some, at none. Sizes
 *  and directions are inside the family here, so a mark family of three sizes is three boxes by C8's own rule. */
export function partitionBoxes(set, names, opts) {
  const fam = [...partition(names, opts)].filter(([, m]) => m.length > 1);
  const kinds = { one: [], some: [], none: [] }, tolKinds = { one: [], some: [], none: [] };
  let at24 = 0, tolAt24 = 0;
  for (const [f, ms] of fam) {
    const per = MASTER_LIST.map((m) => uniq(ms.map((n) => { const b = inkOf(set, keyOf(m, n)); return `${r2(b.w)}×${r2(b.h)}`; })).length);
    kinds[per.every((x) => x === 1) ? 'one' : per.some((x) => x === 1) ? 'some' : 'none'].push(f);
    if (per[0] === 1) at24++;
    const tol = MASTER_LIST.map((m) => withinTolerance(ms.map((n) => inkOf(set, keyOf(m, n)))));
    tolKinds[tol.every(Boolean) ? 'one' : tol.some(Boolean) ? 'some' : 'none'].push(f);
    if (tol[0]) tolAt24++;
  }
  return { families: fam.length, ...kinds, at24, tolerant: { ...tolKinds, at24: tolAt24 } };
}

// ── printing ─────────────────────────────────────────────────────────────────────────────────────────────
const head = (t) => console.log(`\n## ${t}`);
const list = (a) => a.join(' ');

function printCensus(set) {
  head('census (§0)');
  const c = censusReport(set);
  console.log(`files ${c.files} · concepts ${c.concepts} · files per concept ${c.perConcept.min}–${c.perConcept.max} · filled files without an outline twin ${c.orphans}`);
  console.log(`roles: unnumbered default ${c.roles.unnumbered} · numbered shape (stem-N) ${c.roles.numbered} · sized (-small / -large) ${c.roles.sized} · figure word after the number (users-N-word, C27) ${c.roles.figureWord}`);
  console.log(`stems after stripping size and number: ${c.stems}`);
  const g = c.grammar;
  console.log(`grammar card's partition (findings-grammar.md:369-375), reconstructed: ${g.stems} stems = ${g.families} families + ${g.singletons} singletons; ${g.marks} mark families (${g.markConcepts} concepts); ${g.objectFamilies} object families, ${g.objectConcepts} concepts`);
  console.log(`  held to the card's own tables (§2.1, ${g.tableFamilies} named families with their member counts): ${g.tableMatches} reproduced`);
  console.log(`this card's partition (plus-circle, minus-circle, x-circle unfolded from their marks): ${c.mine.stems} stems, ${c.mine.families} families of two or more`);
  console.log(`numbered runs (two or more members at the default size): ${c.runs}`);
  console.log(`names that break C9's order of parts (size last, number just before it): ${c.nameFaults.length}${c.nameFaults.length ? ` — ${c.nameFaults.map((f) => `${f.name} (${f.why})`).join('; ')}` : ''}`);
  const spec = specOf(set);
  console.log(`geometry spec (SIZE_STEP ${MASTER_LIST.map((m) => spec.SIZE_STEP[m]).join(' · ')}; bounds, mark ceilings and keylines of MASTERS) read from ${spec.source}; identical to the working tree's tools/masters.mjs: ${specEqual(spec, DEFAULT_SPEC)}`);
}
function printRuns(set) {
  head('runs (§1.1)');
  const r = runsReport(set.names);
  const inRuns = r.runs.reduce((n, x) => n + x.numbers.length, 0);
  console.log(`numbered runs ${r.runs.length} (${inRuns} concepts) · numbered shapes beyond the default ${r.variants} = ${(r.variants / set.names.length * 100).toFixed(1)}% of ${set.names.length} concepts · runs with no default (no unnumbered member): ${r.defaultMissing.length}`);
  console.log(`runs of 4 members or fewer: ${r.runs.filter((x) => x.numbers.length <= 4).length}`);
  console.log(`run length: ${Object.entries(r.lengths).map(([k, n]) => `${k} members ×${n}`).join(' · ')}`);
  console.log(`runs of 5 or more members: ${r.runs.filter((x) => x.numbers.length >= 5).length} (${r.runs.filter((x) => x.numbers.length >= 5).map((x) => `${x.stem} ${x.numbers.length}`).join(' · ')})`);
  console.log(`gaps in numbering: ${r.gapped.length ? r.gapped.map((x) => `${x.stem} {${x.gaps.join(',')}} (numbers present ${x.numbers.join(',')})`).join(' · ') : 'none'}`);
  for (const x of r.gapped) console.log(`  recorded: ${x.stem} → ${(RECORDED_GAPS[x.stem] ?? ['nowhere found']).join('; ')}`);
  console.log('runs by length:');
  for (const k of Object.keys(r.lengths).map(Number).sort(byNumber)) console.log(`  ${k}: ${list(r.runs.filter((x) => x.numbers.length === k).map((x) => x.stem))}`);
}
function printIdentity(set) {
  head('identity (§1.2)');
  const r = identityReport(set, set.names);
  const fmt = (p, key) => `${p.a} | ${p.b} @ ${p[key].join(',')}`;
  console.log(`concept pairs whose files are the same drawing — whole icon (outline AND filled) at all three masters: ${r.wholeAll.length}`);
  for (const p of r.wholeAll) console.log(`  ${fmt(p, 'whole')}`);
  console.log(`whole icon at some masters only: ${r.wholeSome.length}`);
  for (const p of r.wholeSome) console.log(`  ${fmt(p, 'whole')}`);
  console.log(`outline identical at all three masters, filled differs (a number that names a filled difference): ${r.outlineOnly.length} pairs`);
  console.log(`  ${list(r.outlineOnly.map((p) => `${p.a}|${p.b}`))}`);
  console.log(`outline identical at some masters only, filled differs: ${r.outlineSome.length}`);
  for (const p of r.outlineSome) console.log(`  ${fmt(p, 'outline')}`);
  console.log(`the Library's twin groups (outline identical at all three masters, lab/library.html:317-335): ${r.libraryTwins.length} groups, ${r.libraryTwins.reduce((n, g) => n + g.length, 0)} names`);
  for (const g of r.libraryTwins) console.log(`  ${g.join(' = ')}`);
}
function printTags(set) {
  head('tags (§1.3)');
  const t = tagsReport(set, set.names);
  console.log(`concepts with a tags note ${t.withTags.length} of ${t.concepts}; without: ${t.without.length} (${list(t.without)})`);
  console.log(`concepts whose six files carry different tags: ${t.mixed.length}`);
  console.log(`numbered shapes beyond the default (n ≥ 2, default size): ${t.variants}, with tags: ${t.variantsWithTags}`);
  console.log(`sized members whose tags differ from their default's: ${t.sizedDiffer.length} of ${t.sized}`);
  console.log(`pairs inside a run with the same tag set (a search cannot tell them apart): ${t.identical.length} in ${t.identicalRuns.length} runs, ${t.identicalConcepts.length} concepts`);
  for (const x of t.identical) console.log(`  ${x.a} = ${x.b}: ${x.tags.join(', ')}`);
  console.log(`numbered shapes with no word their default lacks: ${t.noOwn.length} (${list(t.noOwn)})`);
  console.log(`users members missing one of team / group / people / members (no rule asks for those words — kind 3, from the 12 siblings that carry them): ${t.usersLacking.length} (${list(t.usersLacking)})`);
  const noOwnOnly = t.noOwn.filter((n) => !t.identicalConcepts.includes(n));
  console.log(`concepts against C9's style word (a same-tag pair ${t.identicalConcepts.length}, + a shape with no word of its own that is in no pair ${noOwnOnly.length} (${list(noOwnOnly)}); the ${t.faults.length} lying antonyms are inside the pairs: ${t.faults.every((f) => t.identicalConcepts.includes(f.name))}): ${t.against.length} (× 6 files = ${t.against.length * 6}); kind 3: ${t.usersLacking.length} (× 6 = ${t.usersLacking.length * 6})`);
  console.log(`a direction word that contradicts the name: ${t.faults.length ? t.faults.map((f) => `${f.name} says "${f.other}", not "${f.own}"`).join('; ') : 'none'}`);
  console.log(`style words added by the shapes of a run, by number of runs using them: ${t.vocabulary.slice(0, 16).map(([w, n]) => `${w} ×${n}`).join(' · ')}`);
}
/** The numbered shapes FM-1 would touch: `checkbox-N`, and the ring's `check-circle-N` with their smalls. */
export const checkShapes = (names) => ({ box: names.filter((n) => /^checkbox-\d+$/.test(n)), ring: names.filter((n) => /^check-circle-\d+(-small)?$/.test(n)) });
function printTravel(set) {
  head('travel (§1.4)');
  for (const s of travelReport(set, set.names)) {
    console.log(`\n${s.id} — rule: ${s.rule ?? 'none states it'}; numbers whose style word agrees across the stems: ${s.travel} of ${s.rows.length}${s.differ.length ? ` (differ: ${s.differ.join(', ')})` : ''}`);
    for (const r of s.rows) console.log(`  -${r.number}: ${r.groups.map((g) => `${g.stems.join(', ')} → ${g.words}`).join('  ||  ')}`);
  }
  if (set.pin) {
    const rt = ruleText(set.pin);
    console.log(`\nwhere C9's numbering sentences are written (hits as line numbers; the pin's files): ${RULE_FILES.map((f) => `${f}${rt[f].exists ? '' : ' (absent)'} — ${Object.entries(rt[f].hits).map(([k, v]) => `"${k}" ${v.length ? v.join(', ') : 'none'}`).join(' · ')}`).join(' || ')}`);
    const sheetPath = join(set.pin, 'research/queue.md');
    if (existsSync(sheetPath)) {
      const rows = parseSheet(readFileSync(sheetPath, 'utf8')).filter((r) => /^checkbox(-\d)?$/.test(r.name));
      const raw = readFileSync(sheetPath, 'utf8').split('\n');
      console.log(`the sheet's checkbox rows, as written: ${rows.map((r) => raw.find((l) => l.includes('`' + r.name + '`')).replace(/^- \[.\] \d+\. /, '').replace(/ · UI & Layout/, '').replace(/ · approved .*/, '')).join(' || ')}`);
    }
    const note = (n) => { const t = set.files.get(keyOf(24, n))?.text ?? ''; const c = [...t.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].trim()).find((x) => !/^tags:/.test(x)) ?? ''; return c.length > 150 ? `${c.slice(0, 150)}…` : c; };
    for (const n of ['checkbox-2', 'checkbox-3', 'checkbox-4']) console.log(`  ${n}'s own comment, first words: ${note(n)}`);
  }
  const lt = layoutTurns(set, set.names);
  console.log(`\nC29's turns, header = footer mirrored top to bottom · sidebar = footer a quarter turn · sidebar-right = sidebar reflected left to right: ${lt.length} constructions × styles × masters, largest distance ${f3(Math.max(0, ...lt.flatMap((r) => [r.header, r.sidebar, r.right])))}`);
  const { box: boxShapes, ring: ringShapes } = checkShapes(set.names);
  console.log(`\nthe numbered shapes FM-1 would touch: checkbox-N ${boxShapes.length} concepts (× 6 = ${boxShapes.length * 6} files: ${list(boxShapes)}) · the ring's check-circle-N and their smalls ${ringShapes.length} concepts (× 6 = ${ringShapes.length * 6} files: ${list(ringShapes)})`);
  for (const m of MASTER_LIST) console.log(`\ncheckbox's tick, by which check-circle member carries the same tick (translation-invariant shape) @${m}: ${tickTravel(set, m).map((x) => `${x.box} = ${x.tickIs.join('/') || 'none exactly'}`).join(' · ')}`);
}
function printSizes(set) {
  head('sizes (§2.1)');
  const r = sizeReport(set, set.names);
  console.log(`size families ${r.families.length} (${r.marks.length} marks, ${r.containers.length} containers, ${r.mixed.length} mixed) · concepts in them ${r.members} · every default exists: ${r.families.every((f) => f.hasDefault)}`);
  const spec = specOf(set);
  console.log(`marks: ${r.markCells} family × master × style cells, ${r.steps} steps (a small and a large each count); largest |step − SIZE_STEP| = ${f3(r.maxDev)} (SIZE_STEP ${MASTER_LIST.map((m) => spec.SIZE_STEP[m]).join(' · ')}, read from ${spec.source})`);
  console.log(`containers: ${r.containers.length} families keep their ring instead — C18, not C8's step: their mark steps are in the containers section`);
  console.log('\nfamily | sizes | long side small · default · large at 24 | at 20 | at 16 | outline step small/large at 24 · 20 · 16 | filled step');
  for (const f of r.marks) {
    const row = (style, m) => f.cells.find((c) => c.style === style && c.master === m);
    const L = (m) => ['small', 'default', 'large'].filter((k) => row('outline', m).L[k] != null).map((k) => f3(row('outline', m).L[k])).join(' · ');
    const st = (style) => MASTER_LIST.map((m) => { const c = row(style, m); return `${f3(c.stepSmall)}${c.stepLarge != null ? `/${f3(c.stepLarge)}` : ''}`; }).join(' · ');
    console.log(`${f.base} | ${f.small ? 'S' : ''}D${f.large ? 'L' : ''} | ${MASTER_LIST.map(L).join(' | ')} | ${st('outline')} | ${st('filled')}`);
  }
  const c8 = (m) => ['small', 'default', 'large'].map((k) => f3(r.marks.find((f) => f.base === 'plus').cells.find((x) => x.style === 'outline' && x.master === m).L[k]));
  const groups = new Map();
  for (const f of r.marks) {
    const key = MASTER_LIST.map((m) => ['small', 'default', 'large'].filter((k) => f.cells.find((c) => c.style === 'outline' && c.master === m).L[k] != null).map((k) => f3(f.cells.find((c) => c.style === 'outline' && c.master === m).L[k])).join(' · ')).join('  |  ');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f.base);
  }
  console.log('\nthe same, grouped by the sizes (long side, small · default · large) at 24 | 20 | 16:');
  for (const [k, fs] of groups) console.log(`  ${k}  →  ${fs.length} families: ${list(fs)}`);
  for (const m of MASTER_LIST) {
    const [lo, hi] = spec.MASTERS[m].bound, edge = hi - lo, big = r.marks.filter((f) => f.large).map((f) => ({ base: f.base, L: f.cells.find((c) => c.style === 'outline' && c.master === m).L.large }));
    console.log(`-large at ${m}: ${big.filter((b) => b.L >= edge - 1e-9).length} of ${big.length} families reach the margin edge (${edge}); largest ${f3(Math.max(...big.map((b) => b.L)))}; mark ceiling ${spec.MASTERS[m].mark}; defaults over the ceiling: ${r.marks.filter((f) => f.cells.find((c) => c.style === 'outline' && c.master === m).L.default > spec.MASTERS[m].mark + 1e-9).length}`);
  }
  console.log(`\nC8's own example (docs/07-character.md:48) — plus 18 / 15 / 12 at 24, 16 / 13.5 / 11 at 20, 14 / 12 / 10 at 16 — measured large / default / small: ${MASTER_LIST.map((m) => c8(m).reverse().join(' / ')).join(' ; ')}`);
}
function printContainers(set) {
  head('containers (§2.2)');
  const s = sizeReport(set, set.names), rows = containerReport(set, s);
  console.log('family | master | container same (outline, filled) | container long side | mark default → small (outline) · step | filled cut-out default → small · step');
  for (const f of rows) for (const r of f.rows) {
    console.log(`${f.base} | ${r.master} | ${r.outline.containerSame}, ${r.filled.containerSame} | ${f3(r.outline.container)} | ${f3(r.outline.markDefault)} → ${f3(r.outline.markSmall)} · ${f3(r.outline.step)} | ${f3(r.filled.markDefault)} → ${f3(r.filled.markSmall)} · ${f3(r.filled.step)}`);
  }
  console.log('\nstep of the mark small → default, as a share of the canvas (outline):');
  for (const f of rows) console.log(`  ${f.base}: ${f.rows.map((r) => `${r.master}: ${f3(r.outline.step)} = ${(r.outline.step / r.master * 100).toFixed(1)}%`).join(' · ')}`);
  const stepSpec = specOf(set).SIZE_STEP;
  console.log(`  a mark family's step: ${MASTER_LIST.map((m) => `${stepSpec[m]} = ${(stepSpec[m] / m * 100).toFixed(1)}%`).join(' · ')}`);
  console.log(`  container steps at 16: ${rows.map((f) => f3(f.rows.find((r) => r.master === 16).outline.step)).join(' · ')} (smallest ${f3(Math.min(...rows.map((f) => f.rows.find((r) => r.master === 16).outline.step)))})`);
  // a container whose small is not named small
  const cb = ['checkbox', 'checkbox-4'].map((n) => partsOf(iconOf(set, keyOf(24, n)), false));
  console.log(`\ncheckbox-4 against checkbox at 24: container same ${boxLong(cb[0].container) === boxLong(cb[1].container) && cb[0].containerD === cb[1].containerD}; mark ${f3(boxLong(cb[0].mark))} → ${f3(boxLong(cb[1].mark))} (a small in all but name)`);
}
async function printLint(set) {
  head('lintcmp (§2.3)');
  if (!set.pin) { console.log('no pin directory — lint is read from <pin>/tools/lint.mjs'); return; }
  const r = await lintReading(set, set.pin, sizeReport(set, set.names));
  console.log(`${r.files} member files read through the pin's own lintSource + checkFamilies`);
  console.log(`lint's size (2 dp, sampled box) against the exact long side: largest |difference| ${f3(r.maxDiff)}`);
  console.log(`size-family warnings lint raises on them: ${r.warned.length}`);
  console.log(`a container's inner mark in lint's reading (\`inner\`, lint.mjs:332-335): read on ${r.innerRead.outline} of ${r.innerRead.of} outline container files, ${r.innerRead.filled} of ${r.innerRead.of} filled ones`);
  for (const p of r.probe) console.log(`checkbox-4 offered to lint as ${p.file}: size ${p.size}, inner ${p.inner}, warnings ${p.warnings.length ? p.warnings.join(' | ') : 'none'}`);
}
function printGrid(set) {
  head('grid (§3.1)');
  const g = gridReport(set, set.names);
  console.log(`files ${g.files} of ${g.expected} expected (6 per concept) · missing ${g.missing.length} · filled files without an outline twin ${g.orphans.length} · size variants without a default ${g.noDefault.length}`);
  console.log(`size families ${g.sizeFamilies} · concepts in them ${g.familyConcepts} (sized concepts ${g.sizedConcepts}) · files ${g.familyConcepts * 6}`);
  console.log('stem | numbers → sizes shipped (S small, D default, L large)');
  for (const [stem, per] of [...g.objects].sort((a, b) => sortStr(a[0], b[0]))) console.log(`  ${stem}: ${[...per].sort((a, b) => a[0] - b[0]).map(([n, s]) => `${n}:${s}`).join(' ')}`);
  console.log(`stems with sizes whose numbered shapes carry different size sets: ${g.asym.length ? list(g.asym) : 'none'}`);
  console.log(`default-size shapes in a stem that has sizes but carry none themselves: ${g.bare.length ? list(g.bare) : 'none'}`);
}
function printSheet(set) {
  head('sheet (§3.2)');
  const path = join(set.pin, 'research/queue.md');
  if (!existsSync(path)) { console.log('no research/queue.md at the pin'); return; }
  const s = sheetReport(parseSheet(readFileSync(path, 'utf8')), set.names);
  console.log(`rows ${s.rows}: ${Object.entries(s.statusCounts).map(([k, n]) => `[${k}] ${n}`).join(' · ')} · approved rows not in the set ${s.doneNotInSet.length} · set concepts without an approved row ${s.setNotDone.length} · open rows already in the set ${s.openInSet.length} · duplicate names ${s.duplicates.length}`);
  console.log(`open rows ${s.open}: with "variant of" ${s.withBase} (base ships ${s.shipped} · base queued ${s.queuedBase}) · no base ${s.noBase}`);
  console.log(`open rows that are a size (-small / -large): ${s.sized.length ? list(s.sized) : 'none'} · a number (-N): ${s.numbered.length ? list(s.numbered) : 'none'}`);
  console.log(`queued relatives of shipped bases: ${s.shipped}, on ${s.bases.length} bases; written on each base's default shape only ${s.onDefaultShape} drawings (×6 files = ${s.onDefaultShape * 6}); on every shipped shape of the base ${s.onEveryShape} (×6 = ${s.onEveryShape * 6})`);
  console.log(`queued names a numbering rule speaks for — layout-* (C29: a later region takes the same four numbers): ${s.layoutRows.length} (${list(s.layoutRows)}); user / users (C27: a later composite carries the figure number, \`user-2-plus\`): ${s.figureRows.length} (${list(s.figureRows)}), none of them numbered`);
  const sw = (ships) => s.styleWords.filter((x) => x.baseShips === ships).map((x) => `${x.name} ← ${x.base}`).join(' · ') || 'none';
  console.log(`queued relatives whose last word is one of ${STYLE_WORDS.join(' · ')} (a named list, not a census) — a number's job under C9, if each is a shape of its base: ${s.styleWords.length}; base ships: ${sw(true)}; base queued: ${sw(false)}; the same words on names with no base: ${s.styleNoBase.length ? list(s.styleNoBase) : 'none'}`);
  const nr = (x) => `${x.name}${x.base ? ` ← ${x.base}${x.baseShips ? '' : ' (queued)'}` : ' (no base)'}`;
  console.log(`the same question outside that list — last word one of ${NEAR_STYLE_WORDS.join(' · ')}: ${s.nearStyle.length} (${s.nearStyle.map(nr).join(' · ')})`);
  const top = s.bases.filter((b) => b.relatives.length >= 3), low = s.bases.filter((b) => b.relatives.length < 3);
  console.log(`queued relatives per shipped base, most first (shapes shipped in brackets): ${top.map((b) => `${b.base} (${b.shapes}) ${b.relatives.length}`).join(' · ')} · the other ${low.length} bases 2 or 1 (${low.filter((b) => b.relatives.length === 2).length} with 2); ${s.bases.filter((b) => b.shapes > 1).length} of the ${s.bases.length} bases ship more than one shape, the ${s.bases.filter((b) => b.shapes === 1).length} that ship one: ${s.bases.filter((b) => b.shapes === 1).map((b) => `${b.base} ${b.relatives.length}`).join(' · ')}`);
  console.log('bases with more than one shipped shape and queued relatives: base (shapes) → relatives');
  for (const b of s.basesMultiShape) console.log(`  ${b.base} (${b.shapes}) → ${b.relatives.length}: ${list(b.relatives)}`);
}
function printFigures(set) {
  head('figures (§4)');
  const html = existsSync(join(set.pin ?? '.', 'lab/figures.html')) ? readFileSync(join(set.pin, 'lab/figures.html'), 'utf8') : null;
  const f = figureReport(set, set.names, html);
  console.log(`page defaults read from lab/figures.html at the pin: object ${f.def.object} · group ${f.def.group} · words ${f.def.words.join(', ')}`);
  console.log(`the page's grid: ${f.page.figures.length} rows (${f.page.figures.join(', ')}) × ${f.page.cols.length} columns = ${f.page.cells.flat().length} cells · shipped ${f.page.shipped} · dashed (not shipped, none on a board) ${f.page.missing.length}${f.page.missing.length ? `: ${list(f.page.missing.map((c) => c.name))}` : ''}`);
  const heads = figuresPage(set.names, { ...f.def, words: [...f.def.words, 'heads'] });
  console.log(`with ?words=…,heads (the fourth word C27 lists): dashed ${heads.missing.length} (${list(heads.missing.map((c) => c.name))})`);
  console.log(`concepts named users?-<n>-heads at the pin: ${f.heads.length}`);
  console.log('\nname | figure | word | ink box 24 · 20 · 16 | filled box equal');
  for (const r of f.rows) console.log(`${r.name} | ${r.figure} | ${r.word ?? '—'} | ${r.boxes.join(' · ')} | ${r.boxes.join('|') === r.filledBoxes.join('|')}`);
  console.log('\narrangement word → distinct boxes across the four figures (outline):');
  for (const a of f.arrangement) console.log(`  ${a.word}: ${a.members.length} members, ${a.distinct.length} box${a.distinct.length > 1 ? 'es' : ''}: ${a.distinct.join(' ; ')}`);
  console.log(`user figures' boxes: ${f.figureBoxes.map((b) => `${b.name} ${b.boxes[0]}`).join(' · ')}`);
  console.log(`users members missing one of team / group / people / members in their tags: ${f.familyWordsMissing.length ? list(f.familyWordsMissing) : 'none'}`);
  console.log(`users-N* tags that name their figure (user-N): ${f.figureNamedInTags.map((x) => `${x.name} ${x.named}`).join(' · ')}`);
}
function printLevels(set) {
  head('levels (§5)');
  const rows = levelReport(set, set.names, 'volume');
  console.log('member | anchor note (24 · 20 · 16 × outline, filled) | speaker identical and in place, paths same/total (all six cells) | moved | ink inside volume\'s box | shares left / right edge | box w×h @24 · 20 · 16 | centre @24 · 20 · 16');
  for (const r of rows) {
    const c = (m, s) => r.cells.find((x) => x.master === m && x.style === s);
    const same = r.cells.map((x) => `${x.same}/${x.paths}`).join(' ');
    const moved = r.cells.filter((x) => x.moved.length).map((x) => `${x.master} ${x.style} ${x.moved.map((v) => v.join(',')).join(';')}`).join(' · ') || '—';
    console.log(`${r.name} | ${r.anchors.join('/')} | ${same} | ${moved} | ${r.cells.every((x) => x.inside)} | ${r.cells.every((x) => x.sharesLeft)} / ${r.cells.every((x) => x.sharesRight)} | ${MASTER_LIST.map((m) => `${r2(c(m, 'outline').w)}×${r2(c(m, 'outline').h)}`).join(' · ')} | ${MASTER_LIST.map((m) => `${r2(c(m, 'outline').cx)},${r2(c(m, 'outline').cy)}`).join(' · ')}`);
  }
  console.log('\nwaves dropped by volume-low (kept / dropped, outside-in?):');
  for (const m of MASTER_LIST) { const w = wavesDropped(set, 'volume', 'volume-low', m); console.log(`  ${m}: speaker kept ${w.body} · waves kept ${w.kept} (x ${w.keptX.map((x) => x.join('..')).join('; ')}) · dropped ${w.dropped} (x ${w.droppedX.map((x) => x.join('..')).join('; ')}) · outside-in ${w.outsideIn}`); }
  const widths = rows.filter((r) => ['volume', 'volume-low', 'volume-none'].includes(r.name)).map((r) => MASTER_LIST.map((m) => r.cells.find((c) => c.master === m && c.style === 'outline').w));
  console.log(`width volume · low · none at 24 · 20 · 16: ${MASTER_LIST.map((m, i) => `${widths.map((w) => r2(w[i])).join(' · ')}`).join(' ; ')} (one wave costs ${MASTER_LIST.map((m, i) => r2(widths[0][i] - widths[1][i])).join(' · ')})`);
  const anch = set.names.filter((n) => iconOf(set, keyOf(24, n)).notes.anchor);
  console.log(`concepts declaring an anchor note at 24: ${anch.length} (${list(anch)}) · anchored to: ${uniq(anch.map((n) => iconOf(set, keyOf(24, n)).notes.anchor)).join(', ')}`);
  console.log('\nnames that say an amount or a state (tokens ' + AMOUNT_WORDS.join(' ') + '; stems ' + AMOUNT_STEMS.join(' ') + '):');
  const scan = amountScan(set.names);
  console.log(`  shipped (${scan.length}): ${scan.map((r) => `${r.name}${r.words.length ? `[${r.words.join(',')}]` : ''}`).join(' ')}`);
  const path = join(set.pin ?? '.', 'research/queue.md');
  if (existsSync(path)) {
    const open = parseSheet(readFileSync(path, 'utf8')).filter((r) => r.status !== 'x').map((r) => r.name);
    const q = amountScan(open);
    console.log(`  queued (${q.length}): ${q.map((r) => `${r.name}${r.words.length ? `[${r.words.join(',')}]` : ''}`).join(' ')}`);
  }
}
function printBoxes(set) {
  head('boxes (§6)');
  const b = boxesReport(set, set.names), s = sizeReport(set, set.names);
  console.log(`numbered runs ${b.rows.length} — definition A, the same 2 dp box exactly: all three masters ${b.one.length} · some ${b.some.length} · none ${b.none.length}; at 24 alone ${b.rows.filter((r) => r.outline[0] === 1).length}, at 20 alone ${b.rows.filter((r) => r.outline[1] === 1).length}, at 16 alone ${b.rows.filter((r) => r.outline[2] === 1).length}`);
  const tl = b.tolerant;
  console.log(`  definition B, within lint's 0.01 (every member's 2 dp box within 0.01 of every other's, as tools/lint.mjs:349 holds a declared box): all three ${tl.one.length} · some ${tl.some.length} · none ${tl.none.length}; at 24 alone ${tl.at[0]}, at 20 alone ${tl.at[1]}, at 16 alone ${tl.at[2]}`);
  const exactSpread = (v) => Math.max(...v) - Math.min(...v);
  console.log(`  one box under B and not under A: ${tl.flips.map((f) => `${f.stem} at ${f.master} (exact widths ${f.exact.w.map((x) => x.toFixed(4)).join(' · ')}; heights ${f.exact.h.map((x) => x.toFixed(4)).join(' · ')}; 2 dp spread ${f.spread.map((d) => (d / 100).toFixed(2)).join(' × ')}; exact spread ${Math.max(exactSpread(f.exact.w), exactSpread(f.exact.h)).toFixed(4)} units = ${(Math.max(exactSpread(f.exact.w), exactSpread(f.exact.h)) * 16 / f.master).toFixed(4)} px at a 16 px render)`).join(' ; ') || 'none'}`);
  const sweep = [0, 1, 2, 3, 5].map((t) => `${t / 100}: ${MASTER_LIST.map((m) => b.rows.filter((r) => withinTolerance(r.members.map((n) => inkOf(set, keyOf(m, n))), t)).length).join('/')} (all three ${b.rows.filter((r) => MASTER_LIST.every((m) => withinTolerance(r.members.map((n) => inkOf(set, keyOf(m, n))), t))).length})`);
  console.log(`  the count against the tolerance, at 24/20/16 (all three): ${sweep.join(' · ')} — it does not move between 0.01 and 0.05`);
  console.log(`  by kind of run (marks = every member declares keyline: mark; silhouette or agreed box = none does): ${Object.entries(tl.byKind).map(([k, v]) => `${k} ${v.runs} runs — A ${v.A} · B ${v.B}`).join(' ; ')}`);
  console.log(`  of the B ${tl.one.length}: ${Object.entries(tl.oneKinds).map(([k, n]) => `${n} ${k}`).join(' · ')}`);
  console.log(`  of the ${b.one.length}: ${Object.entries(b.oneKinds).map(([k, n]) => `${n} ${k}`).join(' · ')}; on a named keyline: ${Object.entries(b.keylines).map(([k, n]) => `${k} ${n}`).join(' · ')}; filled twin breaks the box in: ${b.filledDiffers.length ? list(b.filledDiffers) : 'none'}`);
  console.log(`  of the ${b.some.length + b.none.length} that do not: none-at-all ${Object.entries(b.noneKinds).map(([k, n]) => `${n} ${k}`).join(' · ')}; some-masters ${Object.entries(b.someKinds).map(([k, n]) => `${n} ${k}`).join(' · ')}`);
  console.log(`  of those, hold ONE dimension at every master (A): width ${b.heldW.length} (${list(b.heldW)}) · height ${b.heldH.length} (${list(b.heldH)}) · neither ${b.heldNeither.length}`);
  console.log(`  under B, of the ${tl.held.rest} that do not, hold ONE dimension at every master (within 0.01): width ${tl.held.W.length} (${list(tl.held.W)}) · height ${tl.held.H.length} (${list(tl.held.H)}) · neither ${tl.held.neither.length}`);
  console.log(`  one box: ${list(b.one.map((r) => `${r.stem}(${r.members.length},${r.keyline ?? r.box24})`))}`);
  console.log(`  some masters: ${list(b.some.map((r) => `${r.stem}(${r.members.length}) ${r.outline.join('/')}`))}`);
  console.log(`  none: ${list(b.none.map((r) => `${r.stem}(${r.members.length})`))}`);
  const sortNames = set.names.filter((n) => /^sort(-|$)/.test(n)), sortBoxes = new Map();
  for (const n of sortNames) {
    const k = MASTER_LIST.map((m) => { const x = inkOf(set, keyOf(m, n)); return `${r2(x.w)}×${r2(x.h)}`; }).join(' · ');
    if (!sortBoxes.has(k)) sortBoxes.set(k, []);
    sortBoxes.get(k).push(n);
  }
  console.log(`  every sort* name (the plan's sort family, ${sortNames.length}): ${sortBoxes.size} distinct boxes at 24 · 20 · 16 — ${[...sortBoxes].map(([k, ns]) => `${k}: ${ns.length > 3 ? `${ns.length} (${ns.slice(0, 2).join(', ')}…)` : ns.join(', ')}`).join(' ; ')}`);
  for (const [label, opts] of [['the grammar card\'s folded partition', {}], ['this card\'s partition (circles unfolded)', { unfoldCircles: true }]]) {
    const pb = partitionBoxes(set, set.names, opts);
    console.log(`  over ${label}: ${pb.families} families of two or more — A: all three ${pb.one.length} · some ${pb.some.length} · none ${pb.none.length}, at 24 alone ${pb.at24}; B: all three ${pb.tolerant.one.length} · some ${pb.tolerant.some.length} · none ${pb.tolerant.none.length}, at 24 alone ${pb.tolerant.at24}`);
  }
  const published = set.pin && existsSync(join(set.pin, 'dist/metrics.json')) ? JSON.parse(readFileSync(join(set.pin, 'dist/metrics.json'), 'utf8')) : null;
  if (published) {
    const per = (m, r) => uniq(r.members.map((n) => `${published[m][n].ink.w}×${published[m][n].ink.h}`)).length;
    const tolPub = (m, r) => withinTolerance(r.members.map((n) => published[m][n].ink));
    console.log(`  the same runs on the published boxes (dist/metrics.json, 2 dp, sampled) — A: at 24 alone ${b.rows.filter((r) => per(24, r) === 1).length}, at 20 alone ${b.rows.filter((r) => per(20, r) === 1).length}, at 16 alone ${b.rows.filter((r) => per(16, r) === 1).length}, at all three ${b.rows.filter((r) => MASTER_LIST.every((m) => per(m, r) === 1)).length}; B: at 24 alone ${b.rows.filter((r) => tolPub(24, r)).length}, at 20 alone ${b.rows.filter((r) => tolPub(20, r)).length}, at 16 alone ${b.rows.filter((r) => tolPub(16, r)).length}, at all three ${b.rows.filter((r) => MASTER_LIST.every((m) => tolPub(m, r))).length}`);
  }
  const named = ['menu', 'chevron-up', 'list-bullet', 'arrow-up', 'sort'].map((n) => b.rows.find((r) => r.stem === n));
  console.log(`  the plan's named families (plans/sort-family.md:9): ${named.map((r) => `${r.stem} ${r.kind} (${r.outline.join('/')})`).join(' · ')}`);
  console.log(`\nsize families: marks that keep one box ${0} of ${s.marks.length} (C8 asks for a step); containers that keep the container ${containerReport(set, s).filter((f) => f.rows.every((r) => r.outline.containerSame && r.filled.containerSame)).length} of ${s.containers.length} (C18 asks for it)`);
  const lv = levelReport(set, set.names, 'volume');
  console.log(`level family volume: ${uniq(MASTER_LIST.map((m) => uniq(lv.map((r) => { const c = r.cells.find((x) => x.master === m && x.style === 'outline'); return `${r2(c.w)}×${r2(c.h)}`; })).length)).join('/')} distinct boxes per master across ${lv.length} members (C28 asks for inside the full member's, sharing an edge)`);
  const rows = b.rows.filter((r) => /^layout-/.test(r.stem));
  console.log(`layout families: ${rows.filter((r) => r.kind === 'one').length} of ${rows.length} keep one box (${uniq(rows.map((r) => r.box24)).join(', ')})`);
}

export const SECTIONS = {
  census: printCensus, runs: printRuns, identity: printIdentity, tags: printTags, travel: printTravel, sizes: printSizes,
  containers: printContainers, lintcmp: printLint, grid: printGrid, sheet: printSheet, figures: printFigures, levels: printLevels, boxes: printBoxes,
};

async function main(argv) {
  const args = argv.filter((a) => !a.startsWith('--'));
  const pin = resolve(args[0] ?? '');
  const wanted = args.slice(1);
  if (!args[0] || !existsSync(join(pin, 'src/icons/24'))) { console.error('usage: families.mjs <pin-dir with src/icons> [section …]\nsections: ' + Object.keys(SECTIONS).join(' ')); process.exit(2); }
  const bad = wanted.filter((w) => !SECTIONS[w]);
  if (bad.length) { console.error(`unknown section ${bad.join(', ')}; sections: ${Object.keys(SECTIONS).join(' ')}`); process.exit(2); }
  const set = loadSet(pin);
  set.spec = await loadSpec(pin);
  for (const s of wanted.length ? wanted : Object.keys(SECTIONS)) await SECTIONS[s](set);
}
let entry = false;
try { entry = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { entry = false; }
if (entry) await main(process.argv.slice(2));
