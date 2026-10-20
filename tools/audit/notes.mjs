#!/usr/bin/env node
// NOTES — every HTML comment in every drawing, as one JSON record per file. Audit only:
// `tools/lint.mjs` never imports this, nothing here reads lint's output, and nothing here
// changes a drawing.
//
// THE QUESTION IT ANSWERS. A drawing can escape a rule in three ways: it declares a note
// lint reads (`<!-- box: 20x18 -->`), it carries a free-text comment — which, through
// `lint.mjs:216` (`hasComment = /<!--/.test(src)`), is what turns the off-grid warning into a
// silent "documented exception" — or it just warns and a plan somewhere calls the warning
// expected. The first two live in the files and nothing lists them. This does, so that the
// exceptions ledger (`docs/audit/exceptions-ledger.md`, card 1.13) and the wave-4 exceptions
// sheet (`lab/audit-exceptions.html`) read one census instead of grepping twice.
//
// HOW IT READS A NOTE. Exactly as lint and the build do, regex for regex, so "lint reads this"
// is a fact about lint and not an opinion:
//   keyline  lint.mjs:322-323  `(\w+)`; only the word `mark` does anything — any other word is a silent no-op
//   box      lint.mjs:65-70    parseBoxNote     WxH, else `bad` (an error, :325)
//   grows    lint.mjs:85-92    parseGrowsNote   four signed numbers, else `bad` (:226); an error in an outline file (:222-224)
//   gap      lint.mjs:106-111  parseGapNote     a positive number, else `bad` (:233); an error at or above MIN_GAP (:235-238)
//   glyph    lint.mjs:142-147  parseGlyphNote   `dot`, `numeral` or `letter` (2026-10-20), else `bad` (:245)
//   anchor   lint.mjs:124-129  parseAnchorNote  an icon name not ending `-filled`, else `bad` (:257); an error naming itself (:259-262)
//   optical  lint.mjs:319      `([-\d.]+)\s+([-\d.]+)`, Number()ed and never validated — `- .` parses to NaN
//   tags     never read by lint; build.mjs:27 splits it on commas for the Library's search
// Lint's `src.match` sees the FIRST note of each key; `notes` holds that one and `duplicateKeys`
// names any key declared twice. Every one of lint's note regexes stops at the first `>`, so a
// value that contains one (`<!-- box: 20x18 > -->`) matches nothing and lint SILENTLY reads no
// note; the mirror reports that as `reads: false` with the reason instead of throwing. A comment
// whose first word is not one of those eight keys is FREE TEXT, whatever it says; `looksLikeNote`
// records the lowercase `word:` such a comment opens with, so a misspelt key (`opticl:`) is
// visible instead of silently ignored.
//
// OFF-GRID. The census mirrors lint.mjs:291-300 number for number: every literal in every
// stroke path (plus the AREA paths of a `-filled` file) that is not on the master's grid and
// not over its decimal ceiling. Each is also classified by the command it sits in (parsePath):
// `straight` (M L H V and their relatives), `arcParam` (rx ry rotation), `arcEnd` (an arc's end
// point) or `curve` (any argument of C S Q T — none in the set today) — docs/01 §3 permits
// arc-derived decimals and commented optical corrections, and nothing else. `namedInText`
// counts the distinct off-grid values that appear verbatim in a
// free-text comment of the same file; `keywordInText` says whether any free-text comment uses
// one of the words in KEYWORDS. Both are proxies for "the comment says what it corrects", are
// reported as such, and are not a judgement.
//
// OUTPUT — schema `mdx-notes/1`. Fields are only ever added, never renamed or removed.
//   { schema, root, masters, files: FileRecord[], summary }
//   FileRecord {
//     master, file, name, concept, style: 'outline' | 'filled',
//     comments: Comment[]        in file order
//     notes: { [key]: { value, parsed, lint } }   the first note of each key — the one lint sees
//     duplicateKeys: string[]    keys declared more than once (lint reads the first only)
//     text: string[]             the free-text comments, verbatim
//     body: { strokes, areas, areaFormInOutline }
//     offGrid: { grid, decimals, total, distinct: string[], byCommand: { straight, arcParam, arcEnd, curve, mismatch },
//                overPrecision, namedInText, keywordInText, lintPrints: 'documented exception' | 'undocumented' | null }
//   }
//   Comment { i, raw, kind: 'note' | 'text', key, value, parsed, lint: { reads, why }, looksLikeNote, chars }
//   summary = inventory(files)  — per key: comments, files, concepts, conceptList, byMaster, byStyle,
//             lintReads, lintIgnores, values (not for tags); plus looksLikeNote and the off-grid totals.
//   consistency(files) — one row per concept × key: which of the six master/style slots carry it.
//
// CLI:  node tools/audit/notes.mjs [--root src/icons] [--json] [--out FILE] [--consistency]
//   default prints the per-key summary; --json prints the whole record set to stdout; --out
//   writes it (refused anywhere under src/); --consistency lists every concept whose note sits
//   on some of its six files and not the others.

import { existsSync, readFileSync, readdirSync, realpathSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { numbersIn, parsePath } from '../geometry.mjs';
import { MASTERS, MIN_GAP, decimalsOf, gridOf, isFilled } from '../masters.mjs';

export const SCHEMA = 'mdx-notes/1';

/** The eight keys lint or the build read, in the order `draft-svg.mjs:49-56` writes them. */
export const NOTE_KEYS = ['keyline', 'tags', 'box', 'anchor', 'grows', 'gap', 'glyph', 'optical'];

/** Words a free-text comment uses when it is explaining an off-grid value. A proxy, named so. */
export const KEYWORDS = /off[- ]grid|off the (quarter|eighth) grid|tangent|optical|decimal|intersect|chamfer|taper|round(ed|s|ing)? (to|up|down|off)|√|sqrt|\bsin\b|\bcos\b|\btan\b|eighth|quarter|centred? (to|on)/i;

const AREA = /<path fill="currentColor" fill-rule="evenodd" stroke="none" d="([^"]+)"\/>/g;   // lint.mjs:40
const dp = (n) => { const s = String(n); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; }; // lint.mjs:44
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ok = (parsed, why) => ({ parsed, lint: { reads: true, why } });
const no = (parsed, why) => ({ parsed, lint: { reads: false, why } });
// Every lint regex ends in `[^>]*?\s*-->` (or a narrower class), so a value holding `>` matches
// nothing at all: lint then behaves exactly as if the note were absent. 0 such files at the pin.
const unread = (line) => no({ unread: true }, `lint.mjs:${line} does not match it — the value contains ">" — so lint silently reads no note at all`);

// One mirror per key. Each takes the comment rebuilt as `<!-- key: value -->` and the file's
// context, and returns what lint would make of it. `reads` means lint accepts the note and acts
// on it — not an error, not a no-op.
const MIRROR = {
  keyline(c) {
    const word = c.match(/<!--\s*keyline:\s*(\w+)\s*-->/)?.[1] ?? null;        // lint.mjs:322
    if (word === null) return unread('322');
    return word === 'mark'
      ? ok({ word }, 'lint.mjs:322-323: the file is a mark — held to the mark ceiling and the centre, no keyline match (§4)')
      : no({ word }, `lint.mjs:322-323 reads only the word "mark"; "${word}" is a silent no-op`);
  },
  box(c) {
    const m = c.match(/<!--\s*box:\s*([^>]*?)\s*-->/);                           // lint.mjs:66
    if (!m) return unread('66');
    const v = m[1].match(/^(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)$/);         // lint.mjs:68
    return v
      ? ok({ w: +v[1], h: +v[2] }, 'lint.mjs:339-350: the ink is held to this size to 0.01, as an error, instead of a keyline')
      : no({ bad: true }, 'lint.mjs:65-70 cannot read it as WxH — an error (:325)');
  },
  grows(c, ctx) {
    const m = c.match(/<!--\s*grows:\s*([^>]*?)\s*-->/);                         // lint.mjs:86
    if (!m) return unread('86');
    const parts = m[1].split(/\s+/).filter(Boolean);                             // lint.mjs:88
    const good = parts.length === 4 && parts.every((p) => /^[+-]?\d+(?:\.\d+)?$/.test(p));
    if (ctx.style !== 'filled') return no({ bad: true }, 'lint.mjs:222-224: only a -filled file may declare grows — an error');
    return good
      ? ok({ l: +parts[0], r: +parts[1], t: +parts[2], b: +parts[3] }, 'lint.mjs:159-172 (comparePair): the filled box must stand proud of the outline by exactly this, to 0.01, as an error')
      : no({ bad: true }, 'lint.mjs:85-92 cannot read it as four numbers — an error (:226)');
  },
  gap(c) {
    const m = c.match(/<!--\s*gap:\s*([^>]*?)\s*-->/);                           // lint.mjs:107
    if (!m) return unread('107');
    const v = m[1].match(/^\d+(?:\.\d+)?$/);                                     // lint.mjs:109
    if (!(v && +m[1] > 0)) return no({ bad: true }, 'lint.mjs:106-111 cannot read it as a distance — an error (:233)');
    const n = +m[1];
    if (n >= MIN_GAP) return no({ n, bad: true }, `lint.mjs:235-238: ${n} is not below MIN_GAP ${MIN_GAP} — an error`);
    return ok({ n }, `lint.mjs:239: replaces MIN_GAP ${MIN_GAP} for §5, §5b and §5f in this file; :509-515 errors only if nothing in the file is under ${MIN_GAP}`);
  },
  glyph(c) {
    const m = c.match(/<!--\s*glyph:\s*([^>]*?)\s*-->/);                         // lint.mjs:144
    if (!m) return unread('144');
    return ['dot', 'numeral', 'letter'].includes(m[1])                           // lint.mjs GLYPH_KINDS
      ? ok({ kind: m[1] }, m[1] === 'dot'
        ? 'lint.mjs:248, 395-396, 434-435, 461: the dot-to-body pair, the character\'s own opening and the knockout it leaves floor at GLYPH_GAP'
        : m[1] === 'numeral'
          ? 'lint.mjs:249, 434-437, 522-525: each path\'s own opening floors at GLYPH_GAP; an info line says when nothing is under MIN_GAP'
          : 'lint.mjs §2b (C32, 2026-10-20): a letter\'s path may keep the outline weight in a line-heavy filled file; no GLYPH_GAP — an error when no path carries its own weight')
      : no({ bad: true }, 'lint.mjs:143-147: not a kind lint knows — an error (:245)');
  },
  anchor(c, ctx) {
    const m = c.match(/<!--\s*anchor:\s*([^>]*?)\s*-->/);                        // lint.mjs:125
    if (!m) return unread('125');
    const good = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m[1]) && !/-filled$/.test(m[1]);   // lint.mjs:127
    if (!good) return no({ bad: true }, 'lint.mjs:124-129 cannot read it as an icon name — an error (:257)');
    if (m[1] === ctx.concept) return no({ name: m[1], bad: true }, 'lint.mjs:259-262: a file may not anchor itself — an error');
    return ok({ name: m[1] }, 'lint.mjs:567-615 (checkAnchors): ink inside the anchor\'s box and on its left or right edge, as errors; no keyline or centre check');
  },
  optical(c) {
    const m = c.match(/<!--\s*optical:\s*([-\d.]+)\s+([-\d.]+)\s*-->/);          // lint.mjs:319, build.mjs:26
    if (!m) return no({ bad: true }, `lint.mjs:319 does not match it${c.includes('>', 4) && c.indexOf('>') < c.length - 3 ? ' (the value contains ">")' : ''} — the shift is silently 0, 0`);
    const [dx, dy] = m.slice(1).map(Number);
    const valid = Number.isFinite(dx) && Number.isFinite(dy);
    return { parsed: { dx, dy, valid }, lint: { reads: true, why: valid
      ? 'lint.mjs:319-321, 361: the centring target moves by this amount; the value itself is never checked'
      : 'lint.mjs:319 parses it to NaN, and Math.abs(NaN - mid) > 0.5 is false — the centring check is switched off (:361)' } };
  },
  tags(c) {
    const m = c.match(/<!--\s*tags:\s*([^>]*?)\s*-->/);                          // build.mjs:27
    if (!m) return no({ list: [], unread: true }, 'lint.mjs never reads tags:; build.mjs:27 does not match it either (the value contains ">"), so the Library gets no search words');
    const list = m[1].split(',').map((t) => t.trim()).filter(Boolean);
    return no({ list }, 'lint.mjs never reads tags:; build.mjs:27 does, for the Library\'s search');
  },
};

/**
 * One comment's inner text → what it is. `raw` is the text between `<!--` and `-->`, trimmed.
 * ctx = { master, style, concept } is what the mirrors need (grows is filled-only, anchor may
 * not name its own file).
 */
export function parseComment(raw, ctx = {}, i = 0) {
  const text = raw.trim();
  const m = text.match(/^([a-z]+):\s*([\s\S]*)$/);
  if (m && NOTE_KEYS.includes(m[1])) {
    const key = m[1], value = m[2].trim();
    const { parsed, lint } = MIRROR[key](`<!-- ${key}: ${value} -->`, ctx);
    return { i, raw: text, kind: 'note', key, value, parsed, lint, looksLikeNote: null, chars: text.length };
  }
  return { i, raw: text, kind: 'text', key: null, value: null, parsed: null, lint: null, looksLikeNote: m ? m[1] : null, chars: text.length };
}

/** The off-grid census of one file, mirroring lint.mjs:291-300, plus the by-command split and the two text proxies. */
function offGridOf(paths, master, text, hasComment) {
  const GRID = gridOf(master), MAX_DP = decimalsOf(master), PER_UNIT = Math.round(1 / GRID);
  const values = [];                                   // every off-grid value, as lint prints it, in lint's order
  let overPrecision = 0;
  for (const d of paths) for (const n of numbersIn(d)) {
    if (dp(n) > MAX_DP) overPrecision++;               // lint.mjs:294 — an error, not off-grid
    else if (!Number.isInteger(n * PER_UNIT)) values.push(String(n));   // lint.mjs:295
  }
  const byCommand = { straight: 0, arcParam: 0, arcEnd: 0, curve: 0 };
  for (const d of paths) for (const { cmd, args } of parsePath(d)) {
    const arc = cmd === 'A' || cmd === 'a', curve = /[CSQTcsqt]/.test(cmd);
    args.forEach((n, k) => {
      if (dp(n) > MAX_DP || Number.isInteger(n * PER_UNIT)) return;
      if (arc) { const r = k % 7; if (r <= 2) byCommand.arcParam++; else if (r >= 5) byCommand.arcEnd++; }
      else if (curve) byCommand.curve++;
      else byCommand.straight++;                     // M L H V and their relatives (Z carries no argument)
    });
  }
  const total = values.length;
  byCommand.mismatch = byCommand.straight + byCommand.arcParam + byCommand.arcEnd + byCommand.curve !== total;
  const distinct = [...new Set(values)];
  const joined = text.join('\n');
  const namedInText = distinct.filter((s) => new RegExp(`(?<![\\d.])${esc(s)}(?![\\d])`).test(joined)).length;
  return {
    grid: GRID, decimals: MAX_DP, total, distinct, byCommand, overPrecision,
    namedInText, keywordInText: KEYWORDS.test(joined),
    lintPrints: total ? (hasComment ? 'documented exception' : 'undocumented') : null,   // lint.mjs:216, 299
  };
}

/** One file's text → its FileRecord. `master` is a number (24, 20, 16); `file` the basename with .svg. */
export function extractFile(src, master, file) {
  const name = file.replace(/\.svg$/, '');
  const style = isFilled(name) ? 'filled' : 'outline';
  const concept = name.replace(/-filled$/, '');
  const ctx = { master, style, concept };
  const comments = [...src.matchAll(/<!--([\s\S]*?)-->/g)].map((m, i) => parseComment(m[1], ctx, i));
  const notes = {}, duplicateKeys = [];
  for (const c of comments) {
    if (c.kind !== 'note') continue;
    if (c.key in notes) { if (!duplicateKeys.includes(c.key)) duplicateKeys.push(c.key); continue; }
    notes[c.key] = { value: c.value, parsed: c.parsed, lint: c.lint };
  }
  const text = comments.filter((c) => c.kind === 'text').map((c) => c.raw);
  // The body as lint reads it: areas only from a -filled file (lint.mjs:207), the AREA form
  // stripped from everything before the stroke paths are collected (:277-283).
  const root = src.match(/<svg\b([^>]*)>/);
  const bodySrc = root ? src.slice(root.index + root[0].length).replace(/<\/svg>\s*$/, '') : src;
  const areas = style === 'filled' ? [...src.matchAll(AREA)].map((m) => m[1]) : [];
  const areaFormInOutline = style === 'outline' ? [...src.matchAll(AREA)].length : 0;
  const stripped = bodySrc.replace(/<!--[\s\S]*?-->/g, '').replace(AREA, '');
  const ds = [...stripped.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  return {
    master, file, name, concept, style, comments, notes, duplicateKeys, text,
    body: { strokes: ds.length, areas: areas.length, areaFormInOutline },
    offGrid: offGridOf([...ds, ...areas], master, text, comments.length > 0),
  };
}

/** Every drawing under `root/<master>/*.svg`, masters taken from masters.mjs, largest first. */
export function extractSet(root = 'src/icons') {
  const masters = Object.keys(MASTERS).map(Number).sort((a, b) => b - a);
  const files = [];
  for (const m of masters) {
    const dir = join(root, String(m));
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.svg')).sort())
      files.push(extractFile(readFileSync(join(dir, f), 'utf8'), m, f));
  }
  return { schema: SCHEMA, root, masters, files, summary: inventory(files) };
}

/** Per-key totals over a set of FileRecords. `concepts` counts, `conceptList` names. */
export function inventory(files) {
  const byKey = {}, looksLikeNote = {};
  let notes = 0, text = 0;
  for (const f of files) for (const c of f.comments) {
    if (c.kind === 'text') {
      text++;
      if (c.looksLikeNote) looksLikeNote[c.looksLikeNote] = (looksLikeNote[c.looksLikeNote] ?? 0) + 1;
      continue;
    }
    notes++;
    const k = byKey[c.key] ??= { comments: 0, files: 0, concepts: new Set(), byMaster: {}, byStyle: { outline: 0, filled: 0 }, lintReads: 0, lintIgnores: 0, values: {} };
    k.comments++;
    k.concepts.add(f.concept);
    k.byMaster[f.master] = (k.byMaster[f.master] ?? 0) + 1;
    k.byStyle[f.style]++;
    if (c.lint.reads) k.lintReads++; else k.lintIgnores++;
    if (c.key !== 'tags') k.values[c.value] = (k.values[c.value] ?? 0) + 1;
  }
  for (const f of files) for (const key of Object.keys(f.notes)) byKey[key].files++;
  for (const k of Object.values(byKey)) { k.conceptList = [...k.concepts].sort(); k.concepts = k.conceptList.length; }
  const og = files.filter((f) => f.offGrid.total > 0);
  const byMaster = {};
  for (const f of og) {
    const m = byMaster[f.master] ??= { files: 0, values: 0 };
    m.files++; m.values += f.offGrid.total;
  }
  const add = (k) => og.reduce((s, f) => s + (f.offGrid.byCommand[k] ?? 0), 0);
  return {
    files: files.length,
    concepts: new Set(files.map((f) => f.concept)).size,
    comments: { total: notes + text, notes, text, filesWithout: files.filter((f) => !f.comments.length).length },
    byKey, looksLikeNote,
    duplicateKeys: files.filter((f) => f.duplicateKeys.length).map((f) => `${f.master}/${f.name}: ${f.duplicateKeys.join(', ')}`),
    offGrid: {
      files: og.length,
      values: og.reduce((s, f) => s + f.offGrid.total, 0),
      byMaster,
      byCommand: { straight: add('straight'), arcParam: add('arcParam'), arcEnd: add('arcEnd'), curve: add('curve'), mismatch: og.filter((f) => f.offGrid.byCommand.mismatch).length },
      arcOnly: og.filter((f) => f.offGrid.byCommand.straight === 0).length,
      namedInText: og.filter((f) => f.offGrid.namedInText > 0).length,
      keywordInText: og.filter((f) => f.offGrid.keywordInText).length,
      namedOrKeyword: og.filter((f) => f.offGrid.namedInText > 0 || f.offGrid.keywordInText).length,
      noFreeText: og.filter((f) => f.text.length === 0).length,
      undocumented: og.filter((f) => f.offGrid.lintPrints === 'undocumented').length,
      overPrecision: files.reduce((s, f) => s + f.offGrid.overPrecision, 0),
    },
  };
}

/** The six slots an icon ships in, largest master first, outline before filled. */
export const SLOTS = Object.keys(MASTERS).map(Number).sort((a, b) => b - a).flatMap((m) => [`${m}/outline`, `${m}/filled`]);

/**
 * One row per concept × key: which slots carry the note (`have`), which exist and do not
 * (`missing`), and the value in each. `partial` is true when both lists are non-empty. The
 * caller judges: `grows` is filled-only by rule and `gap` is per file by rule, so partial
 * coverage is expected for those two and a finding for the others.
 */
export function consistency(files) {
  const byConcept = new Map();
  for (const f of files) {
    const slots = byConcept.get(f.concept) ?? new Map();
    slots.set(`${f.master}/${f.style}`, f);
    byConcept.set(f.concept, slots);
  }
  const out = [];
  for (const [concept, slots] of byConcept) {
    const keys = new Set();
    for (const f of slots.values()) for (const k of Object.keys(f.notes)) keys.add(k);
    for (const key of [...keys].sort()) {
      const have = SLOTS.filter((s) => slots.get(s)?.notes[key]);
      const missing = SLOTS.filter((s) => slots.has(s) && !slots.get(s).notes[key]);
      const values = Object.fromEntries(have.map((s) => [s, slots.get(s).notes[key].value]));
      out.push({ concept, key, have, missing, values, partial: have.length > 0 && missing.length > 0 });
    }
  }
  return out;
}

// --- the command -------------------------------------------------------------------------
function main(argv) {
  const opt = { root: 'src/icons', json: false, out: null, consistency: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') opt.root = argv[++i];
    else if (argv[i] === '--out') opt.out = argv[++i];
    else if (argv[i] === '--json') opt.json = true;
    else if (argv[i] === '--consistency') opt.consistency = true;
    else { console.error(`unknown argument ${argv[i]}`); process.exit(2); }
  }
  const set = extractSet(opt.root);
  if (opt.out) {
    const target = resolve(opt.out);
    if (target.startsWith(resolve('src') + sep)) { console.error(`refusing to write under src/: ${opt.out}`); process.exit(2); }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, JSON.stringify(set, null, 1));
    console.error(`wrote ${set.files.length} records to ${opt.out}`);
  }
  if (opt.json) { process.stdout.write(JSON.stringify(set)); return; }
  const s = set.summary;
  console.log(`${s.files} drawings · ${s.concepts} concepts · ${s.comments.total} comments (${s.comments.notes} notes, ${s.comments.text} free text, ${s.comments.filesWithout} files without any)`);
  console.log('\nkey        comments  files  concepts  24/20/16          outline/filled  lint reads  values');
  for (const key of NOTE_KEYS) {
    const k = s.byKey[key];
    if (!k) { console.log(`${key.padEnd(10)} —`); continue; }
    const vals = key === 'tags' ? '' : Object.entries(k.values).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([v, n]) => `${v}×${n}`).join('  ') + (Object.keys(k.values).length > 6 ? ` … (${Object.keys(k.values).length} distinct)` : '');
    console.log(`${key.padEnd(10)} ${String(k.comments).padStart(8)}  ${String(k.files).padStart(5)}  ${String(k.concepts).padStart(8)}  ${set.masters.map((m) => String(k.byMaster[m] ?? 0).padStart(4)).join('/').padEnd(17)} ${String(k.byStyle.outline).padStart(7)}/${String(k.byStyle.filled).padEnd(7)} ${String(k.lintReads).padStart(5)}/${String(k.lintIgnores).padEnd(5)} ${vals}`);
  }
  const lln = Object.entries(s.looksLikeNote);
  console.log(`\nfree-text comments opening with a lowercase word and a colon (not a key lint knows): ${lln.length ? lln.map(([w, n]) => `${w}: ×${n}`).join('  ') : 'none'}`);
  if (s.duplicateKeys.length) console.log(`keys declared twice in one file: ${s.duplicateKeys.join('; ')}`);
  const o = s.offGrid;
  console.log(`\noff-grid: ${o.files} drawings · ${o.values} values (${set.masters.map((m) => `${m}: ${o.byMaster[m]?.files ?? 0} / ${o.byMaster[m]?.values ?? 0}`).join(' · ')})`);
  console.log(`  by command: straight ${o.byCommand.straight} · arc params ${o.byCommand.arcParam} · arc ends ${o.byCommand.arcEnd} · curves ${o.byCommand.curve}${o.byCommand.mismatch ? ` · ${o.byCommand.mismatch} files where the two counts disagree` : ''}; arc-only drawings ${o.arcOnly}`);
  console.log(`  a free-text comment names at least one of the values: ${o.namedInText} drawings · uses a construction word: ${o.keywordInText} · either: ${o.namedOrKeyword} · no free text at all: ${o.noFreeText}`);
  console.log(`  lint prints "undocumented": ${o.undocumented} · over the decimal ceiling (an error): ${o.overPrecision}`);
  if (opt.consistency) {
    const rows = consistency(set.files).filter((r) => r.partial);
    console.log(`\nnotes on some of a concept's files and not others: ${rows.length}`);
    for (const r of rows) console.log(`  ${r.concept.padEnd(24)} ${r.key.padEnd(8)} on ${r.have.join(', ')}  —  not on ${r.missing.join(', ')}`);
  }
}

let entry = false;
try { entry = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { entry = false; }
if (entry) main(process.argv.slice(2));
