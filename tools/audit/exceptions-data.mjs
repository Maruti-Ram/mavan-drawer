#!/usr/bin/env node
// EXCEPTIONS DATA — the data behind `lab/audit-exceptions.html` (audit card 4.3). Audit only:
// lint, build and the lab's other pages never import this, and nothing here changes a drawing.
//
// THE QUESTION THE SHEET PUTS TO MARUTI. Card 1.13 (`docs/audit/exceptions-ledger.md`) sorted
// every way a drawing gets past a rule into 20 groups and judged each one: a genuine agreed
// exception, or a missing rule wearing a note? This file gathers, from the pinned tree, every
// note and comment in every drawing (with `notes.mjs`, which reads them with lint's own note
// patterns), puts each into exactly one of the ledger's groups, measures the escapes that leave
// no mark in a file, and recomputes every count the ledger states so the sheet can show the two
// side by side — a mismatch shown, not hidden.
//
// THE GROUPING RULE — every comment lands in exactly one group, or in the visible "ungrouped"
// bucket. Applied in this order to each comment `notes.mjs` returns:
//   1. a note whose value contains ">"            → 20 (lint's note patterns stop at the first ">"
//                                                    and silently read no note at all)
//   2. a second note of a key the file already declared → ungrouped (lint reads the first only; a
//      note skipped by rule 1 does not count as declared, since lint's pattern runs on to the next)
//   3. a note lint rejects or ignores: a value it cannot parse (an error), a `keyline:` word other
//      than `mark` (a silent no-op), `grows:` in an outline file, `gap:` at or over 1.5, an
//      `anchor:` naming its own file                → ungrouped
//   4. any other note, by key: keyline → 2 · box → 3 · optical → 4 · glyph → 5 · grows → 6 ·
//      anchor → 7 · gap → 8 · tags → 9
//   5. a free-text comment                          → 1
// Groups 10–19 hold no notes. They are the escapes the ledger lists that leave no mark in the
// file; each lists drawings, measured as its own entry below says.
//
// HOW THE ESCAPES ARE MEASURED. The pin's own `tools/lint.mjs` is imported (its run() fires only
// when lint itself is the entry point) and run over the pin exactly as `run()` does: lintSource
// per file, then checkFamilies, checkPairs, checkAnchors. That run gives every lint line the
// sheet prints, the warnings of groups 10 and 11, and the centre readings of group 16. It is then
// run a SECOND time from a temporary copy of lint.mjs (with the pin's geometry.mjs and
// masters.mjs beside it) changed in two ways, each of which must match exactly or this stops:
//   - the five gap comparisons (`< need - 0.01)`, `< floor - 0.01)` ×3, `< GAP - 0.01)`;
//     lint.mjs:403, 438, 465, 493, 499) lose their 0.01: every warning that appears only then is
//     one reading in the slack band (group 19);
//   - the two `continue`s that skip a pair of paths that cross (lint.mjs:394) or come within 0.1
//     (lint.mjs:401) report the pair before skipping it (group 18).
// So lint measures its own escapes; nothing here re-implements a gap check.
//
// CLI:  node tools/audit/exceptions-data.mjs <pin-dir> [--commit 5933041] [--out FILE]
//   <pin-dir> is an extracted, built copy of the pinned tree:
//     P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   --out defaults to lab/audit-data/exceptions.json in this repo (refused anywhere under src/).
//   The commit is recorded, not checked (an archive carries no history); the digest of the pin's
//   src/icons is recorded beside it so two runs can be compared.

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { extractSet } from './notes.mjs';

export const SCHEMA = 'mdx-exceptions/1';
export const DEFAULT_COMMIT = '5933041';
const LEDGER = 'docs/audit/exceptions-ledger.md';
const REPO = fileURLToPath(new URL('../../', import.meta.url));

// --- the ledger's groups, in its own order (§1 table, rows 85–104) -------------------------------
// `tags` colour the sheet's verdict marks; `verdict` is the ledger's own wording.
export const GROUPS = [
  { id: 'text', n: 1, title: 'The free-text comment', sub: 'the off-grid hatch', section: '2.1', line: 118, row: 85,
    verdict: 'stale rule · missing rule (the tangent-vertex exception)', tags: ['stale', 'missing'], kind: '(2) · (3)', axis: 'F7, F3', proposals: ['R-1'],
    lintDoes: 'nothing — any comment turns the off-grid warning into a note (lint.mjs:216, :299)',
    agreed: 'docs/01:184-185, 376-377 · CLAUDE.md:272 · docs/02:101 — per decimal; docs/09:28 says drop it' },
  { id: 'keyline', n: 2, title: 'keyline: mark', sub: 'a category that works, and a size nobody set', section: '2.2', line: 186, row: 86,
    verdict: 'agreed as a category · missing rule for the size inside it', tags: ['agreed', 'missing'], kind: '(3)', axis: 'F2, F4', proposals: ['R-2', 'R-3'],
    lintDoes: 'longest side ≤ the file\'s ceiling, warning (lint.mjs:338); centre ±0.5, warning (:361)',
    agreed: 'docs/01:105-114 (the 77 marks of day one); C8 for -large' },
  { id: 'box', n: 3, title: 'box: WxH', sub: 'three keylines wearing a note', section: '2.3', line: 255, row: 87,
    verdict: 'missing rule — three shared boxes are keylines in all but name', tags: ['missing'], kind: '(3) · (2)', axis: 'F2, F6', proposals: ['R-4'],
    lintDoes: 'ink = declared size to 0.01, error (lint.mjs:349-350)',
    agreed: 'docs/01:116-131 — per icon, by eye; first used by folder' },
  { id: 'optical', n: 4, title: 'optical: dx dy', sub: 'on trust', section: '2.5', line: 333, row: 88,
    verdict: 'unverified · stale (info-3, by C18\'s own words)', tags: ['unverified', 'stale'], kind: '(2)', axis: 'F2, F7', proposals: ['R-6'],
    lintDoes: 'nothing — the centring target moves by the declared amount (lint.mjs:319-321, :361)',
    agreed: 'C14, C15, C18; 7 concepts only in their own file' },
  { id: 'glyph', n: 5, title: 'glyph: dot / numeral', sub: 'the carve-out, applied where it was written', section: '2.8', line: 501, row: 89,
    verdict: 'agreed; 6 numeral concepts are missing the note', tags: ['agreed'], kind: '(1)', axis: 'F8', proposals: [],
    other: 'No R-proposal. The missing note is severity-proposal.md §6b, already recommended (ledger L-11).',
    lintDoes: 'the carve-out is applied and warned at GLYPH_GAP (lint.mjs:395-396, :434-439, :461-466, :490-494, :522-525)',
    agreed: 'C19' },
  { id: 'grows', n: 6, title: 'grows: L R T B', sub: 'the model note', section: '2.6', line: 385, row: 90,
    verdict: 'agreed', tags: ['agreed'], kind: '—', axis: 'F13', proposals: [],
    other: 'No proposal: the ledger holds this up as the model the other notes should follow.',
    lintDoes: 'the filled box stands proud by exactly this, to 0.01, error (lint.mjs:159-172)',
    agreed: 'C17; docs/01:243-251' },
  { id: 'anchor', n: 7, title: 'anchor: NAME', sub: 'exact, verified, two members short of the record', section: '2.4', line: 314, row: 91,
    verdict: 'agreed; 2 members in no doc', tags: ['agreed'], kind: '(2)', axis: 'F3', proposals: [],
    other: 'No R-proposal. volume-minus / volume-plus into C28\'s list is a doc edit for Maruti\'s list (ledger L-12).',
    lintDoes: 'ink inside the anchor\'s box and on one of its x edges, errors (lint.mjs:567-615)',
    agreed: 'C28 for 3 of the 5; the sheet for all 5 (research/queue.md:852-853, 2026-09-26)' },
  { id: 'gap', n: 8, title: 'gap: N', sub: 'six concepts, three stories', section: '2.7', line: 413, row: 92,
    verdict: 'agreed (8 files) · unverified (2 files, sort) · missing rule (the 2 dp tolerance)', tags: ['agreed', 'unverified', 'missing'], kind: '(2) · (3)', axis: 'F8', proposals: ['R-5', 'R-9'],
    lintDoes: 'only that something in the file is under 1.5 (lint.mjs:509-515); the number itself is not held',
    agreed: 'docs/07:79 for 3 concepts; plans/facing-gap.md:9-12 (Maruti, 2026-09-28) for 2; the board alone for sort' },
  { id: 'tags', n: 9, title: 'tags:', sub: 'not an escape', section: '2.9', line: 531, row: 93,
    verdict: 'not an escape; 17 concepts (102 files) lack it', tags: ['none'], kind: '(1)', axis: '—', proposals: [],
    other: 'No proposal. The missing tags are enforcement-gap.md §4 row G7.',
    lintDoes: 'nothing; build.mjs:27 reads it for the Library\'s search',
    agreed: 'C9' },
  { id: 'sort', n: 10, title: 'The sort family warnings', sub: 'sixty warnings nobody can declare', section: '2.10', line: 541, row: 94,
    verdict: 'agreed, undeclared — no vocabulary can express it', tags: ['agreed', 'missing'], kind: '(1) · (3)', axis: 'F8, F11', proposals: ['R-7'],
    lintDoes: 'warns 72 times (12 · 30 · 30) and blocks nothing (lint.mjs:648-652)',
    agreed: 'plans/sort-family.md:25-28 (Maruti, 2026-10-03, in a plan headed WITHDRAWN); no note, no C-row' },
  { id: 'trash', n: 11, title: 'trash at 20 and 16', sub: 'lint is measuring a covered junction', section: '2.11', line: 575, row: 95,
    verdict: 'agreed, lint vs rule', tags: ['agreed'], kind: '(2)', axis: 'F8', proposals: [],
    other: 'No R-proposal: fix the measure (covered junction), or settle which document is right (ledger L-13).',
    lintDoes: 'warns twice', agreed: 'C22 (docs/07:62), docs/09:31 — "lint is wrong"; findings-air.md:568-570 disagrees' },
  { id: 'identical', n: 12, title: 'The eight byte-identical filled files', sub: 'not an escape', section: '2.12', line: 589, row: 96,
    verdict: 'not an escape — C17 working', tags: ['none'], kind: '—', axis: 'F13', proposals: [],
    other: 'Nothing to decide.', lintDoes: 'pair box: declared grows:, confirmed', agreed: 'C17' },
  { id: 'angles', n: 13, title: 'Angle grants held by prose', sub: 'agreed, written down, invisible to lint', section: '2.13', line: 602, row: 97,
    verdict: 'unverified', tags: ['unverified'], kind: '(3)', axis: 'angles', proposals: ['R-8'],
    lintDoes: 'nothing (docs/01:201, C30)', agreed: 'docs/07:78, C11, C12, C22, C25, C30' },
  { id: 'radii', n: 14, title: 'Radius exceptions held by prose', sub: 'agreed, written down, invisible to lint', section: '2.13', line: 602, row: 98,
    verdict: 'unverified', tags: ['unverified'], kind: '(3)', axis: 'F2', proposals: [],
    other: 'No R-proposal: the vocabulary to declare against is the open container-radius ruling (docs/09 §6).',
    lintDoes: 'nothing', agreed: 'C26' },
  { id: 'cuts', n: 15, title: 'Filled-cut and pair choices held by prose', sub: 'agreed, written down, invisible to lint', section: '2.13', line: 602, row: 99,
    verdict: 'unverified', tags: ['unverified'], kind: '(3)', axis: 'F13', proposals: [],
    other: 'No R-proposal: the census that owns it is card 1.8 (findings-filled.md).',
    lintDoes: 'nothing (enforcement-gap.md §4 F9)', agreed: 'the C-rows: C18, C20, C21, C22, C23, C24' },
  { id: 'centre', n: 16, title: 'The silent ±0.5 tolerances', sub: 'numbers the code chose', section: '2.14', line: 633, row: 100,
    verdict: 'missing rule, code vs C10/C12 · one agreed deviation riding on it with no note', tags: ['missing', 'agreed'], kind: '(2) · (1)', axis: 'F2', proposals: ['R-10'],
    lintDoes: 'keyline match ±0.5 (lint.mjs:352), centre ±0.5 (:361) — numbers no document chose',
    agreed: 'nowhere; volume-off\'s 0.5 at 16 is agreed in its own prose only, against C28' },
  { id: 'knockout', n: 17, title: 'The knockout check that does not run', sub: 'a check narrower than its rule', section: '2.15', line: 662, row: 101,
    verdict: 'missing check — the code is narrower than the rule', tags: ['missing'], kind: '(2)', axis: 'F8, F13', proposals: ['R-9'],
    lintDoes: '§5c runs only if (areas.length && ds.length === 0) (lint.mjs:459): a shape-filled file that keeps one stroke is never knockout-checked',
    agreed: 'nowhere; the rule (C22, docs/01:332-336) names every filled drawing' },
  { id: 'contact', n: 18, title: 'Paths that touch or cross are exempt', sub: 'no contact grammar', section: '2.15', line: 662, row: 102,
    verdict: 'missing rule — no contact grammar exists', tags: ['missing'], kind: '(3)', axis: 'F9', proposals: [],
    other: 'No R-proposal: axis F9; the contact census (card 1.7) is where to decide what a join is (ledger L-2).',
    lintDoes: 'a pair within 0.1 is read as joined and skipped (lint.mjs:401); a crossing pair is skipped for its whole length (:394)',
    agreed: 'nowhere (enforcement-gap.md §5 rows 5–6)' },
  { id: 'slack', n: 19, title: 'The 0.01 slack', sub: 'an undeclared tolerance', section: '2.15', line: 662, row: 103,
    verdict: 'missing rule — an undeclared tolerance', tags: ['missing'], kind: '(2)', axis: 'F8', proposals: ['R-9'],
    lintDoes: 'every gap check tests < floor − 0.01 (lint.mjs:403, :438, :465, :493, :499), so 1.49 passes a floor of 1.5',
    agreed: 'nowhere; §6 says "a literal 1.5"' },
  { id: 'gt', n: 20, title: 'A ">" inside a note value', sub: 'a hole, empty today', section: '2.15', line: 662, row: 104,
    verdict: 'a hole in the vocabulary, empty today', tags: ['none'], kind: '(3)', axis: '—', proposals: [],
    other: 'Nothing to decide while it is empty.',
    lintDoes: 'every note regex stops at the first ">", so lint silently reads no note; no error, no warning', agreed: '—' },
];

/** The ledger's eye questions (§6, lines 768–785), on the group each belongs to; `show` names the icons it names. */
export const EYE = {
  keyline: [
    { line: 773, q: 'Does grid-3 read smaller than grid, filter-2 than filter, chart-bar than chart-bar-2?', where: 'the wall (card 4.1), one row per family', show: ['grid', 'grid-3', 'filter', 'filter-2', 'chart-bar', 'chart-bar-2'] },
    { line: 775, q: 'Is a mark whose longest side is 18 a mark at all?', where: 'beside the 18 square keyline on the wall', show: ['cursor', 'send', 'maximize', 'text'] }],
  box: [{ line: 770, q: 'Does a 20 × 18 box read as the same size as the 18 square and the 20 × 16 landscape?', where: 'the wall (card 4.1), one row', show: ['folder', 'camera', 'desktop', 'briefcase', 'heart', 'calendar', 'mail'] }],
  gap: [{ line: 777, q: 'Does volume-off-filled\'s bar read as broken at 16? 0.39 of white at each junction, two junctions; the raster reads the junction pixel at 0.637 — neither ink nor air (findings-air.md:454).', where: 'this sheet, real pixels 1× and 2× — "the first thing that sheet should show"', show: ['volume-off'], filled: true }],
  optical: [{ line: 782, q: 'Should the 16 shifts be rounded to the eighth grid, as C18 did for info-3 alone? 39 of 45 are not.', where: 'the optical sheet at real 16 px (card 1.11 decides whether to ask)', show: ['info-3'] }],
  contact: [{ line: 784, q: 'Where may ink touch ink? 985 drawings have a join lint skips.', where: 'the contact census (card 1.7)', show: [] }],
};

/** The ledger's proposals (§4, lines 730–739), in its own words — the bold lead of each row. */
export const PROPOSALS = {
  'R-1': [730, 'docs/01 §3 gains a third exception: a vertex computed as a tangent point or an intersection may sit off the grid at the master\'s decimal ceiling; lint\'s hatch then narrows from any comment to a declared note'],
  'R-2': [731, 'A mark\'s longest side is a whole number of units at 24, and 18 or 15 unless a C-row gives the family its own ladder'],
  'R-3': [732, 'Numbered variants of one object share one keyline class (mark, square, circle, portrait, landscape, or an agreed box) — eye-only, settled on the wall'],
  'R-4': [733, 'Two shared boxes become named keylines: 20 × 18 · 16 × 14 · 14 × 12 and 18 × 15 · 16 × 13.5 · 14 × 12; box: stays for genuine one-offs'],
  'R-5': [734, 'gap: N is held to the drawing to 0.01, like grows: and box:, and may name the air it covers (gap: 1.25 separation)'],
  'R-6': [735, 'optical: is bounded against C15\'s measure for that shape, by a decided margin; alert-triangle\'s and play\'s values are recorded in doc 07'],
  'R-7': [736, 'A note kind for deliberate overlap (two strokes sharing space), plus a C-row for the sort family'],
  'R-8': [737, 'A declared form for an angle grant — run and rise, C30\'s own form — so the 193 comments that state a degree figure can be read'],
  'R-9': [738, 'The 0.01 slack is either stated in §6 as the tolerance for an arc-derived edge, or removed — and §5c\'s gate at lint.mjs:459 is lifted so a shape-filled file with a stroke is knockout-checked too'],
  'R-10': [739, 'volume-off at 16 declares its half-unit placement instead of passing on the slack — as optical: -0.5 0, or as a new note for a whole-pixel placement; either way the centring check would have to hold the declared value rather than ±0.5 around it'],
};

/** Which note key goes to which group (rule 4). */
export const KEY_GROUP = { keyline: 'keyline', box: 'box', optical: 'optical', glyph: 'glyph', grows: 'grows', anchor: 'anchor', gap: 'gap', tags: 'tags' };

/**
 * One comment (a notes.mjs Comment) → its group id, or 'ungrouped'. `seen` is the set of keys
 * the file has already declared, in file order; the caller adds this comment's key after.
 */
export function groupOfComment(c, seen = new Set()) {
  if (c.kind !== 'note') return 'text';
  if (String(c.value).includes('>')) return 'gt';
  if (seen.has(c.key)) return 'ungrouped';
  const p = c.parsed ?? {};
  if (p.bad || p.unread) return 'ungrouped';
  if (c.key === 'keyline' && p.word !== 'mark') return 'ungrouped';
  return KEY_GROUP[c.key] ?? 'ungrouped';
}

/** FNV-1a, 32 bit, over UTF-16 code units — the page computes the same on the live manifest. */
export function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

// --- the instrumented lint ------------------------------------------------------------------------
export const SLACK = /(<\s*(?:need|floor|GAP))\s*-\s*0\.01\)/g;
export const CROSS = 'if (crosses(sampled[i], sampled[j])) continue;';
export const TOUCH = 'if (min <= 0.1) continue;';
/**
 * lint.mjs's source → the same source with the five gap slacks removed and the two pair skips
 * reported to `globalThis.__mdxPair(i, j, kind, min)`. Throws unless every anchor matches exactly
 * as often as stated, so a lint that has moved is never measured by a patch that half-applied.
 */
export function patchLint(src) {
  const slack = [...src.matchAll(SLACK)].length;
  if (slack !== 5) throw new Error(`patchLint: expected 5 gap comparisons with a 0.01 slack, found ${slack}`);
  for (const [name, s] of [['CROSS', CROSS], ['TOUCH', TOUCH]]) {
    const k = src.split(s).length - 1;
    if (k !== 1) throw new Error(`patchLint: expected the ${name} skip once, found ${k}`);
  }
  return src.replace(SLACK, '$1)')
    .replace(CROSS, 'if (crosses(sampled[i], sampled[j])) { globalThis.__mdxPair?.(i, j, "cross", null); continue; }')
    .replace(TOUCH, 'if (min <= 0.1) { globalThis.__mdxPair?.(i, j, "touch", min); continue; }');
}

/**
 * One gap warning's text (lint.mjs §5, §5b, §5c, §5f) → what it measured. `check` is the lint
 * section, `reading` the gap it printed (the edge gap for §5), `floor` the floor it held it to,
 * `floorKind` §6 / glyph / numeral / agreed, `at` the point it names, `paths` the 1-based paths.
 * Returns null for a warning that is not a gap reading.
 */
export function classifyWarning(w) {
  const at = w.match(/ at (-?[\d.]+),(-?[\d.]+)/);
  const floorKind = /C19 glyph gap/.test(w) ? 'glyph' : /C19 numeral gap/.test(w) ? 'numeral' : /agreed gap/.test(w) ? 'agreed' : '§6';
  const base = { at: at ? [+at[1], +at[2]] : null, floorKind };
  let m;
  if ((m = w.match(/^paths (\d+)\/(\d+) are ([-\d.]+) apart — .* needs [-\d.]+ \(edge gap ([-\d.]+) < ([-\d.]+)\)/)))
    return { ...base, check: '§5', kind: 'pair', reading: +m[4], floor: +m[5], paths: [+m[1], +m[2]] };
  if ((m = w.match(/^path (\d+) comes within ([-\d.]+) of itself .* needs ([-\d.]+)/)))
    return { ...base, check: '§5b', kind: 'opening', reading: +m[2], floor: +m[3], paths: [+m[1]] };
  if ((m = w.match(/^the knockout leaves ([-\d.]+) of material .* needs ([-\d.]+)/)))
    return { ...base, check: '§5c', kind: 'knockout', reading: +m[1], floor: +m[2], paths: [] };
  if ((m = w.match(/^path (\d+) faces itself across ([-\d.]+) of air .* needs ([-\d.]+)/)))
    return { ...base, check: '§5f', kind: 'self', reading: +m[2], floor: +m[3], paths: [+m[1]] };
  if ((m = w.match(/^([-\d.]+) of air (across one cut-out|in a notch of the outer edge|between two filled edges|between a shape and a line) .* needs ([-\d.]+)/))) {
    const kind = { 'across one cut-out': 'cut', 'in a notch of the outer edge': 'notch', 'between two filled edges': 'separation', 'between a shape and a line': 'line' }[m[2]];
    return { ...base, check: '§5f', kind, reading: +m[1], floor: +m[3], paths: [] };
  }
  return null;
}

/** The centre lint prints in a drawing's headline (`centre 7.5,8`), as offsets from `mid`. */
export function centreOf(headline, mid) {
  const m = headline?.match(/centre (-?[\d.]+|NaN),(-?[\d.]+|NaN)/);
  if (!m) return null;
  const cx = +m[1], cy = +m[2];
  const dx = Math.round((cx - mid) * 1000) / 1000, dy = Math.round((cy - mid) * 1000) / 1000;
  return { cx, cy, dx, dy, off: Math.max(Math.abs(dx), Math.abs(dy)) };
}

/** Removes one occurrence of each of `a`'s items from a copy of `b`; returns what is left of b. */
export function extra(a, b) {
  const left = [...b];
  for (const x of a) { const i = left.indexOf(x); if (i >= 0) left.splice(i, 1); }
  return left;
}

/** The comments of one file's text with their exact spelling, in file order (as notes.mjs indexes them). */
export const exactComments = (src) => [...src.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[0]);

// --- running lint over the pin ------------------------------------------------------------------
async function runLint(lintUrl, jobs, onFile) {
  const L = await import(lintUrl);
  const results = new Map();
  for (const j of jobs) { onFile?.(j); results.set(`${j.m}/${j.f}`, L.lintSource(j.m, j.f, j.src)); }
  onFile?.(null);
  L.checkFamilies(results); L.checkPairs(results); L.checkAnchors(results);   // run()'s order, lint.mjs:633-640
  return results;
}

/** The patched copy of the pin's lint, in a fresh temporary directory beside its two imports. */
function patchedCopy(pin) {
  const dir = mkdtempSync(join(tmpdir(), 'mdx-exceptions-'));
  for (const f of ['geometry.mjs', 'masters.mjs']) copyFileSync(join(pin, 'tools', f), join(dir, f));
  writeFileSync(join(dir, 'lint.mjs'), patchLint(readFileSync(join(pin, 'tools', 'lint.mjs'), 'utf8')));
  return dir;
}

// --- prose groups: the names the ledger cites, never measured here ---------------------------------
// Each list is copied from the document it cites; the sheet shows the drawings, and the counts
// beside them stay the cited documents' own.
export const PROSE = {
  angles: [
    { cite: 'docs/07-character.md:78', why: 'granted by name in doc 07\'s angle row',
      names: ['home-2', 'home-3', 'gear', 'gear-2', 'alert-triangle', 'alert-triangle-2', 'alert-triangle-3', 'alert-triangle-4', 'map-pin', 'map-pin-3', 'package-2', 'package-3', 'lightbulb', 'lightbulb-3', 'lightbulb-4', 'watch', 'watch-3', 'pencil', 'compose-3', 'language', 'megaphone', 'megaphone-2', 'megaphone-3', 'sparkle', 'sparkle-2', 'sparkle-3', 'sparkle-4'] },
    { cite: 'docs/07-character.md:62 (C22)', why: 'trash\'s 4° taper', names: ['trash'] },
    { cite: 'docs/07-character.md:70 (C30)', why: 'code\'s 73° slash, declared as run and rise', names: ['code'] },
  ],
  radii: [
    { cite: 'docs/07-character.md:66 (C26)', why: 'leaves the container radius on purpose; lint does not check container radii', names: ['message-6', 'message-7'] },
    { cite: 'docs/audit/findings-corners.md:221-232 (§4.2)', why: 'named in the off-tier table (judged there: decision, drift or artifact)',
      names: ['book', 'book-2', 'book-3', 'wrench', 'wrench-2', 'wrench-3', 'pin-2', 'pin-4', 'pin-5', 'wand', 'wand-2', 'thumbs-up', 'thumbs-up-2', 'alert-triangle', 'alert-triangle-2', 'alert-triangle-3', 'alert-triangle-4', 'heart', 'shield', 'shield-2'] },
    { cite: 'docs/audit/findings-corners.md:263', why: 'its own comment says "Maruti to confirm"', names: ['rotate-ccw-9'] },
  ],
  cuts: [
    { cite: 'docs/07-character.md:58 (C18)', why: 'cut weights: medium 2 · 1.75 · 1.75 on plus-circle and x-circle, heavy on minus-circle, 1.5 on the checks', names: ['plus-circle', 'x-circle', 'minus-circle', 'check-circle'] },
    { cite: 'docs/07-character.md:60 (C20)', why: 'the filled grip tapers where the outline stays monoline', names: ['search'] },
    { cite: 'docs/07-character.md:61 (C21)', why: 'outline bar and filled cut are different lengths, "against C18"', names: ['ban-2'] },
    { cite: 'docs/07-character.md:62 (C22)', why: 'the true-size counter', names: ['trash'] },
    { cite: 'docs/07-character.md:63-64 (C23, C24)', why: 'a counter measured by its largest circle; repeated lines punched at 1.5', names: ['file', 'file-text'] },
  ],
};

// A degree figure as card 1.11's angles probe reads one (tools/audit/angles-probe.mjs:165, `DECLARES`):
// a number, then °, deg or degrees — the plural only. Run over the whole 24 outline file it reprints
// findings-angles.md:372's 193. `DEGREE_SINGULAR` admits "45 degree" too; `SPELLING` is the probe's
// line-by-line `grep -l` per spelling (angles-probe.mjs GREP), which reprints findings-angles.md:377.
export const DEGREE = /[0-9][0-9.]*\s*(°|deg\b|degrees\b)/;
export const DEGREE_SINGULAR = /[0-9][0-9.]*\s*(°|deg\b|degrees?\b)/;
export const SPELLING = { sign: /[0-9]°/, degrees: /[0-9][0-9.]*\s+degrees\b/, deg: /[0-9][0-9.]*\s+deg\b/ };
const grepL = (text, re) => text.split('\n').some((l) => re.test(l));

/** A slack reading is in the band when the reading lint prints sits under its floor; 1.5 against 1.5 is not. */
export const inBand = (c) => !!c && c.reading < c.floor;
/** The twelve names group 10 is about (ledger §2.10): sort-alpha-* and sort-numeric-*, not sort or sort-2. */
export const isSortFamily = (concept) => /^sort-(alpha|numeric)-/.test(concept);
/** Group 17: a shape-filled file that keeps a stroke, which §5c's gate (lint.mjs:459) skips. */
export const skipsKnockout = (f) => f.s === 'f' && f.ar > 0 && f.sk > 0;
/** Group 16 reads non-anchored drawings only: an anchored member's centring is held back by lint (C28). */
export const isAnchored = (headline) => /anchored to /.test(headline ?? '');

// --- counts: the ledger's figure beside the data's ----------------------------------------------------
const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('en-US') : String(v));
/** One line of a group's count table: the ledger's figure beside this data's; `match` null when not compared. */
export const countRow = (label, ledger, cite, data, note = '') => ({
  label, ledger: fmt(ledger), cite, data: data == null ? null : fmt(data),
  match: data == null || ledger === '—' || /^\[needs/.test(String(ledger)) ? null : fmt(ledger) === fmt(data), note,
});
const row = countRow;
export const by3 = (list, key = (x) => x.m) => [24, 20, 16].map((m) => fmt(list.filter((x) => key(x) === m).length)).join(' · ');
const byStyle = (list) => ['outline', 'filled'].map((s) => fmt(list.filter((x) => x.style === s).length)).join(' · ');
const uniq = (list) => new Set(list).size;

export async function build(pinArg, { commit = DEFAULT_COMMIT, log = () => {} } = {}) {
  const pin = resolve(pinArg);
  for (const p of ['src/icons/24', 'src/icons/20', 'src/icons/16', 'tools/lint.mjs', 'lab/manifest.json'])
    if (!existsSync(join(pin, p))) throw new Error(`${pinArg} is not a built pin: ${p} is missing — (cd <pin> && node tools/build.mjs)`);

  // 1. Every comment, read with lint's own note patterns.
  const set = extractSet(join(pin, 'src/icons'));
  const srcOf = (r) => readFileSync(join(pin, 'src/icons', String(r.master), r.file), 'utf8');
  const digest = createHash('sha1');
  const jobs = set.files.map((r) => { const src = srcOf(r); digest.update(`${r.master}/${r.file}\n${src}`); return { m: r.master, f: r.file, src, r }; });
  log(`notes: ${set.files.length} files`);

  // 2. The pin's lint, as `npm run check` runs it.
  const A = await runLint(pathToFileURL(join(pin, 'tools/lint.mjs')).href, jobs);
  log('lint: pinned run done');

  // 3. The same lint without its slack, reporting the pairs it skips.
  const tmp = patchedCopy(pin);
  const pairs = new Map();
  let cur = null;
  globalThis.__mdxPair = (i, j, kind, min) => { const k = `${cur.m}/${cur.f}`; if (!pairs.has(k)) pairs.set(k, []); pairs.get(k).push([i + 1, j + 1, kind === 'cross' ? 'x' : 't', min == null ? null : Math.round(min * 1000) / 1000]); };
  let B;
  try { B = await runLint(pathToFileURL(join(tmp, 'lint.mjs')).href, jobs, (j) => { cur = j; }); }
  finally { delete globalThis.__mdxPair; rmSync(tmp, { recursive: true, force: true }); }
  log('lint: instrumented run done');

  // 4. The pin's manifest — the bodies the live sheet is compared against.
  const pinMan = JSON.parse(readFileSync(join(pin, 'lab/manifest.json'), 'utf8'));

  // 5. One record per file.
  const whys = [], whyIx = new Map();
  const why = (s) => { if (s == null) return null; if (!whyIx.has(s)) { whyIx.set(s, whys.length); whys.push(s); } return whyIx.get(s); };
  const groups = Object.fromEntries([...GROUPS.map((g) => g.id), 'ungrouped'].map((id) => [id, []]));
  const files = jobs.map(({ m, f, src, r }, fi) => {
    const key = `${m}/${f}`, a = A.get(key), b = B.get(key);
    const exact = exactComments(src);
    const seen = new Set();
    const comments = r.comments.map((c, ci) => {
      const g = groupOfComment(c, seen);
      // A note lint cannot match (a ">" in it) does not count as declared: lint's regex runs on and
      // reads the next note of that key instead.
      if (c.kind === 'note' && !String(c.value).includes('>')) seen.add(c.key);
      groups[g].push([fi, ci]);
      return c.kind === 'note' ? { x: exact[ci], t: 'n', k: c.key, v: c.value, r: c.lint.reads ? 1 : 0, w: why(c.lint.why), g } : { x: exact[ci], t: 't', g };
    });
    const pm = pinMan.masters?.[m]?.icons?.[r.name];
    const og = r.offGrid;
    return {
      m, n: r.name, c: r.concept, s: r.style === 'filled' ? 'f' : 'o',
      h: pm ? fnv(`${pm.stroke}|${pm.body}`) : null,
      k: comments,
      og: og.total ? { t: og.total, d: og.distinct.join(' '), st: og.byCommand.straight, ap: og.byCommand.arcParam, ae: og.byCommand.arcEnd, nm: og.namedInText, kw: og.keywordInText ? 1 : 0 } : null,
      sk: r.body.strokes, ar: r.body.areas,
      L: { h: a.notes.at(-1) ?? '', n: a.notes.slice(0, -1), w: a.warnings, e: a.errors },
      _slack: extra(a.warnings, b.warnings), _lost: extra(b.warnings, a.warnings), _pairs: pairs.get(key) ?? [],
    };
  });
  const lost = files.filter((f) => f._lost.length);
  if (lost.length) throw new Error(`removing the slack took a warning away from ${lost.length} files — the patch is not what it claims`);
  const F = (i) => files[i];
  const conceptsOf = (refs) => uniq(refs.map((x) => (typeof x === 'number' ? F(x) : x).c));

  // 6. The escapes — groups 10 to 19 — as drawings.
  const warned = files.map((f, i) => [f, i]).filter(([f]) => f.L.w.length && !f.L.e.length);
  const isSort = (f) => isSortFamily(f.c);
  const isTrash = (f) => f.c === 'trash' && f.s === 'o' && (f.m === 20 || f.m === 16);
  groups.sort = warned.filter(([f]) => isSort(f)).map(([, i]) => ({ f: i }));
  groups.trash = warned.filter(([f]) => isTrash(f)).map(([, i]) => ({ f: i }));
  const otherWarned = warned.filter(([f]) => !isSort(f) && !isTrash(f)).map(([, i]) => i);

  const bodyOf = (f) => { const src = jobs[files.indexOf(f)].src; const root = src.match(/<svg\b[^>]*>/); return src.slice(root.index + root[0].length).replace(/<!--[\s\S]*?-->/g, '').trim(); };
  const byKey = new Map(files.map((f, i) => [`${f.m}/${f.n}`, i]));
  groups.identical = files.map((f, i) => [f, i]).filter(([f]) => f.s === 'f')
    .filter(([f]) => { const o = byKey.get(`${f.m}/${f.c}`); return o != null && bodyOf(F(o)) === bodyOf(f); })
    .map(([, i]) => ({ f: i, o: byKey.get(`${F(i).m}/${F(i).c}`) }));

  const pinConcepts = new Set(files.map((f) => f.c));
  for (const id of ['angles', 'radii', 'cuts'])
    groups[id] = PROSE[id].flatMap((p) => p.names.map((c) => ({ c, cite: p.cite, why: p.why, present: pinConcepts.has(c) })));

  const anchored = (f) => isAnchored(f.L.h);
  groups.centre = files.map((f, i) => [f, i]).filter(([f]) => !anchored(f))
    .map(([f, i]) => ({ f: i, ...centreOf(f.L.h, f.m / 2) })).filter((x) => x.off > 0.01);

  groups.knockout = files.map((f, i) => [f, i]).filter(([f]) => skipsKnockout(f)).map(([, i]) => ({ f: i }));
  groups.contact = files.map((f, i) => [f, i]).filter(([f]) => f._pairs.length).map(([f, i]) => ({ f: i, p: f._pairs }));
  // `band`: the reading as lint prints it (2 dp) sits under the floor. A §5 reading that prints 1.5
  // against 1.5 is under it by less than the printed precision — floating point and the chord error
  // of a sampled arc — not air anyone could see.
  groups.slack = files.flatMap((f, i) => f._slack.map((w) => { const c = classifyWarning(w); return { f: i, w, ...c, band: inBand(c) }; }));

  // 7. The counts, the ledger's beside the data's. `cite` is the ledger line unless it says otherwise.
  const L = (n) => `${LEDGER}:${n}`;
  const notesIn = (id) => groups[id].map(([fi, ci]) => ({ ...F(fi), style: F(fi).s === 'f' ? 'filled' : 'outline', comment: F(fi).k[ci] }));
  const filesOf = (list) => [...new Map(list.map((x) => [`${x.m}/${x.n}`, x])).values()];
  const noteStats = (id, ledger, line) => {
    const fl = filesOf(notesIn(id));
    return [row('files', ledger[0], L(line), fl.length), row('concepts', ledger[1], L(line), uniq(fl.map((x) => x.c))),
      row('files by master, 24 · 20 · 16', ledger[2], L(line), by3(fl)), row('files by style, outline · filled', ledger[3], L(line), byStyle(fl))];
  };
  const C = {};
  {
    const og = files.filter((f) => f.og);
    const text = notesIn('text');
    const perFile = files.map((f) => f.k.filter((c) => c.t === 't').length);
    const worst = og.reduce((w, f) => (f.og.t > w.og.t ? f : w), og[0]);
    const declared = (f) => f.k.some((c) => c.t === 'n' && c.k !== 'tags');
    C.text = [
      row('files carrying a free-text comment', 2910, L(85), files.filter((f) => f.k.some((c) => c.t === 't')).length),
      row('free-text comments', 3035, L(122), text.length),
      row('free-text comments per file, min – max', '1 – 2', L(139), `${Math.min(...perFile)} – ${Math.max(...perFile)}`),
      row('drawings with an off-grid value (the hatch at work)', 1967, L(130), og.length),
      row('  by master, 24 · 20 · 16', '646 · 662 · 659', L(130), by3(og)),
      row('concepts with an off-grid drawing', 351, L(130), uniq(og.map((f) => f.c))),
      row('off-grid values', 27029, L(131), og.reduce((s, f) => s + f.og.t, 0)),
      row('  on a straight command', 12744, L(132), og.reduce((s, f) => s + f.og.st, 0)),
      row('  on an arc\'s end point', 12339, L(133), og.reduce((s, f) => s + f.og.ae, 0)),
      row('  an arc\'s own parameters', 1946, L(134), og.reduce((s, f) => s + f.og.ap, 0)),
      row('drawings with a straight-command value off the grid', 1888, `${L(162)} (severity-proposal.md:117)`, og.filter((f) => f.og.st > 0).length),
      row('drawings whose off-grid values are arc-derived only', 79, L(135), og.filter((f) => f.og.st === 0).length),
      row('drawings whose off-grid values are straight only', 126, L(136), og.filter((f) => f.og.ap + f.og.ae === 0).length),
      row('lint prints "undocumented"', 0, L(138), files.filter((f) => f.L.n.some((n) => /undocumented/.test(n)) || f.L.w.some((w) => /undocumented/.test(w))).length),
      row('proxy: a comment names one of its values verbatim', 98, L(148), og.filter((f) => f.og.nm > 0).length),
      row('proxy: a comment uses a construction word', 621, L(149), og.filter((f) => f.og.kw).length),
      row('proxy: either', 653, L(150), og.filter((f) => f.og.nm > 0 || f.og.kw).length),
      row('no proxy and no declared note but tags:', 684, L(152), og.filter((f) => !(f.og.nm > 0 || f.og.kw) && !declared(f)).length),
      row('worst file', 'gear-3-filled at 24: 165', L(157), `${worst.n} at ${worst.m}: ${worst.og.t}`),
    ];
  }
  {
    const n = notesIn('keyline');
    const outl = files.filter((f) => f.s === 'o' && f.k.some((c) => c.g === 'keyline'));
    const size = (f) => f.L.h.match(/^([\d.]+)×([\d.]+)/)?.slice(1).map(Number) ?? null;
    const distinct = [24, 20, 16].map((m) => uniq(outl.filter((f) => f.m === m).map((f) => size(f)?.join('×')))).join(' · ');
    const at24 = outl.filter((f) => f.m === 24).map(size).filter(Boolean);
    C.keyline = [...noteStats('keyline', [816, 136, '272 · 272 · 272', '408 · 408'], 86),
      row('distinct outline mark sizes (W×H), 24 · 20 · 16', '67 · 70 · 65', L(210), distinct),
      row('24: longest side on a whole unit', 124, L(214), at24.filter(([w, h]) => Number.isInteger(Math.max(w, h))).length),
      row('24: longest side 18 or 15', 69, L(214), at24.filter(([w, h]) => [18, 15].includes(Math.max(w, h))).length)];
    void n;
  }
  {
    const n = notesIn('box');
    const outl = n.filter((x) => x.s === 'o');
    const val = (c, m) => outl.find((x) => x.c === c && x.m === m)?.comment.v ?? null;
    const concepts = [...new Set(outl.map((x) => x.c))];
    const shared = concepts.filter((c) => ['20x18', '18x15', '20x19'].includes(val(c, 24)));
    C.box = [...noteStats('box', [338, 57, '114 · 112 · 112', '169 · 169'], 87),
      row('distinct box strings, all masters together', 59, L(756), uniq(outl.map((x) => x.comment.v))),
      row('  per master, 24 · 20 · 16', '20 · 20 · 20', L(275), [24, 20, 16].map((m) => uniq(outl.filter((x) => x.m === m).map((x) => x.comment.v))).join(' · ')),
      row('concepts declaring a box at all three masters', 56, L(270), concepts.filter((c) => [24, 20, 16].every((m) => val(c, m))).length),
      row('the folder box: 20x18 at 24 · 16x14 at 20', '18 · 17', L(280), `${concepts.filter((c) => val(c, 24) === '20x18').length} · ${concepts.filter((c) => val(c, 20) === '16x14').length}`),
      row('the sort box: 18x15 · 16x13.5 · 14x12', 13, L(281), concepts.filter((c) => val(c, 24) === '18x15' && val(c, 20) === '16x13.5' && val(c, 16) === '14x12').length),
      row('concepts declaring 14x12 at 16', 30, L(285), concepts.filter((c) => val(c, 16) === '14x12').length),
      row('on one of the three shared boxes (by the 24 box: 20x18, 18x15, 20x19)', '35 concepts · 210 files', L(286), `${shared.length} concepts · ${n.filter((x) => shared.includes(x.c)).length} files`)];
  }
  {
    const n = notesIn('optical');
    const pairs = n.map((x) => x.comment.v);
    const both = n.filter((x) => { const [dx, dy] = x.comment.v.split(/\s+/).map(Number); return dx !== 0 && dy !== 0; });
    const zero = n.filter((x) => x.comment.v.split(/\s+/).map(Number).every((v) => v === 0));
    const slots = [...new Set(n.map((x) => `${x.m}/${x.c}`))];
    const same = slots.filter((s) => { const v = n.filter((x) => `${x.m}/${x.c}` === s).map((x) => x.comment.v); return v.length === 2 && v[0] === v[1]; });
    const off = (m, per) => n.filter((x) => x.m === m && x.s === 'o' && x.comment.v.split(/\s+/).map(Number).some((v) => !Number.isInteger(v * per))).length;
    C.optical = [...noteStats('optical', [270, 45, '90 · 90 · 90', '135 · 135'], 88),
      row('distinct dx dy pairs', 94, L(343), uniq(pairs)),
      row('pairs moving on both axes', 0, L(344), both.length),
      row('notes declaring 0 0', 0, L(109), zero.length),
      row('concept-masters where outline and filled declare the same', '135 of 135', L(344), `${same.length} of ${slots.length}`),
      row('16: shifts off the eighth grid', '39 of 45', L(355), `${off(16, 8)} of ${n.filter((x) => x.m === 16 && x.s === 'o').length}`),
      row('24 and 20: shifts off the quarter grid', '78 of 90', L(356), `${off(24, 4) + off(20, 4)} of ${n.filter((x) => x.m !== 16 && x.s === 'o').length}`)];
  }
  {
    const n = notesIn('glyph');
    const dot = filesOf(n.filter((x) => x.comment.v === 'dot')), num = filesOf(n.filter((x) => x.comment.v === 'numeral'));
    const numericNoNote = files.filter((f) => /^sort-numeric-/.test(f.c) && !f.k.some((c) => c.g === 'glyph'));
    C.glyph = [
      row('glyph: dot — files · concepts', '90 · 15', L(89), `${dot.length} · ${uniq(dot.map((x) => x.c))}`),
      row('glyph: dot — 24 · 20 · 16 / outline · filled', '30 · 30 · 30 / 45 · 45', L(89), `${by3(dot)} / ${byStyle(dot)}`),
      row('glyph: numeral — files · concepts', '6 · 1', L(89), `${num.length} · ${uniq(num.map((x) => x.c))}`),
      row('glyph: numeral — 24 · 20 · 16 / outline · filled', '2 · 2 · 2 / 3 · 3', L(89), `${by3(num)} / ${byStyle(num)}`),
      row('sort-numeric-* drawing numerals without the note — concepts · files', '6 · 36', L(523), `${uniq(numericNoNote.map((f) => f.c))} · ${numericNoNote.length}`)];
  }
  {
    const n = notesIn('grows');
    const at16 = n.filter((x) => x.m === 16).map((x) => Math.max(...x.comment.v.split(/\s+/).map(Number)));
    C.grows = [...noteStats('grows', [54, 18, '18 · 18 · 18', '0 · 54'], 90),
      row('16: concepts declaring 0.375 · 0.25', '13 · 5', L(400), `${at16.filter((v) => v === 0.375).length} · ${at16.filter((v) => v === 0.25).length}`),
      row('undeclared filled-vs-outline box differences', 0, L(390), files.filter((f) => f.L.w.some((w) => /^ink box differs/.test(w))).length)];
  }
  C.anchor = noteStats('anchor', [30, 5, '10 · 10 · 10', '15 · 15'], 91);
  {
    const lintSays = (m, n) => files.find((f) => f.m === m && f.n === n)?.L.n.map((s) => s.match(/agreed gap [\d.]+ — smallest measured ([\d.]+)/)?.[1]).find(Boolean) ?? '—';
    C.gap = [...noteStats('gap', [10, 6, '3 · 2 · 5', '3 · 7'], 92),
      ...[[430, 24, 'attachment-4-filled', '1.04'], [431, 20, 'attachment-4-filled', '1.00'], [432, 16, 'alert-triangle-2', '1.28'], [433, 16, 'alert-triangle-4', '1.28'],
        [434, 16, 'sort-filled', '1.00'], [436, 24, 'database-2-filled', '1.48'], [437, 24, 'volume-off-filled', '0.72'], [438, 20, 'volume-off-filled', '0.80'], [439, 16, 'volume-off-filled', '0.39']]
        .map(([line, m, n, v]) => row(`lint's smallest measured, ${m}/${n}`, v, L(line), lintSays(m, n), 'printed by lint at 2 dp; the ledger writes 1.00 and 0.80')),
      row('lint\'s smallest measured, 16/sort (outline)', '1.38', L(435), (() => { const f = files.find((x) => x.m === 16 && x.n === 'sort'); return f?.L.n.map((s) => s.match(/smallest measured ([\d.]+)/)?.[1]).find(Boolean) ?? '—'; })())];
    for (const r of C.gap) if (r.note && r.data != null) r.match = Number(r.ledger) === Number(r.data);
  }
  {
    const fl = filesOf(notesIn('tags'));
    const lacking = files.filter((f) => !f.k.some((c) => c.g === 'tags'));
    C.tags = [...noteStats('tags', [2808, 468, '936 · 936 · 936', '1,404 · 1,404'], 93),
      row('without tags: concepts · files', '17 · 102', L(535), `${uniq(lacking.map((f) => f.c))} · ${lacking.length}`)];
    void fl;
  }
  {
    const sf = groups.sort.map((x) => F(x.f));
    const lines = sf.flatMap((f) => f.L.w);
    const kindOf = (w) => { const c = classifyWarning(w); return c?.check === '§5' && c.reading < 0 ? 'overlap' : c?.kind; };
    const k = (name) => lines.filter((w) => kindOf(w) === name).length;
    C.sort = [
      row('files · concepts', '60 · 12', L(94), `${sf.length} · ${uniq(sf.map((f) => f.c))}`),
      row('files by master, 24 · 20 · 16', '12 · 24 · 24', L(94), by3(sf)),
      row('files by style, outline · filled', '30 · 30', L(94), byStyle(sf.map((f) => ({ style: f.s === 'f' ? 'filled' : 'outline' })))),
      row('warning lines, 24 · 20 · 16', '12 · 30 · 30', L(546), [24, 20, 16].map((m) => sf.filter((f) => f.m === m).reduce((s, f) => s + f.L.w.length, 0)).join(' · ')),
      row('by kind: air across one cut-out · paths overlap · shape to a line · faces itself', '30 · 18 · 12 · 12', L(547), `${k('cut')} · ${k('overlap')} · ${k('line')} · ${k('self')}`),
      row('warned drawings in the whole set (the 62 of the gate)', 62, L(543), warned.length),
      row('warned drawings no group claims', 0, 'this sheet', otherWarned.length, 'any other warned drawing would sit in the ungrouped bucket')];
    groups.sortOther = otherWarned;
  }
  {
    const tf = groups.trash.map((x) => F(x.f));
    C.trash = [row('files · 20 · 16', '2 · 1 · 1', L(95), `${tf.length} · ${tf.filter((f) => f.m === 20).length} · ${tf.filter((f) => f.m === 16).length}`),
      row('20: tab leg to body wall', 'paths 2/3 · edge gap 0.99', L(577), (() => { const f = tf.find((x) => x.m === 20); const c = f && classifyWarning(f.L.w[0]); return c ? `paths ${c.paths.join('/')} · edge gap ${c.reading}` : '—'; })()),
      row('16: tab leg to body wall', 'paths 2/3 · edge gap 0.75', L(577), (() => { const f = tf.find((x) => x.m === 16); const c = f && classifyWarning(f.L.w[0]); return c ? `paths ${c.paths.join('/')} · edge gap ${c.reading}` : '—'; })())];
  }
  {
    const fl = groups.identical.map((x) => F(x.f));
    C.identical = [row('files · concepts', '8 · 4', L(96), `${fl.length} · ${uniq(fl.map((f) => f.c))}`), row('by master, 24 · 20 · 16', '4 · 4 · 0', L(96), by3(fl))];
  }
  {
    const named = groups.angles.filter((x) => x.cite.endsWith(':78'));
    // The comments are the whole file's text that can hold words (paths carry none).
    const o24 = files.filter((f) => f.m === 24 && f.s === 'o');
    const whole = (f) => f.k.map((c) => c.x).join('\n'), free = (f) => f.k.filter((c) => c.t === 't').map((c) => c.x).join('\n');
    const states = o24.filter((f) => DEGREE.test(whole(f)));
    const freeOnly = o24.filter((f) => DEGREE.test(free(f)));
    const missedByFree = states.filter((f) => !freeOnly.includes(f)).map((f) => f.c);
    const singular = o24.filter((f) => DEGREE_SINGULAR.test(whole(f)) && !states.includes(f)).map((f) => f.c);
    const spelt = (re) => o24.filter((f) => grepL(whole(f), re)).length;
    C.angles = [
      row('icons granted by name in docs/07:78, present in the pin', 27, L(608), named.filter((x) => x.present).length),
      row('concepts whose 24 outline file states a degree figure', 193, `${L(612)} (findings-angles.md:372)`, states.length, 'read with the angles probe\'s own pattern (angles-probe.mjs:165), over the whole file'),
      row('  in free-text comments only', '—', 'this sheet', freeOnly.length, `not a ledger figure: the free text misses ${missedByFree.join(', ') || 'none'} — its figure sits in a declared note`),
      row('  counting the singular "45 degree" too', '—', 'this sheet', `${states.length + singular.length} (+${singular.length})`, `not a ledger figure: ${singular.join(', ')}`),
      row('  spelt "63.43°"', 131, 'findings-angles.md:377', spelt(SPELLING.sign)),
      row('  spelt "4 degrees"', 53, 'findings-angles.md:377', spelt(SPELLING.degrees)),
      row('  spelt "73.2 deg"', 11, 'findings-angles.md:377', spelt(SPELLING.deg)),
      row('off-axis concepts (>2°) that state none', 34, L(614), null, 'measured by tools/audit/angles.mjs, not here')];
  }
  C.radii = [row('variants leaving the container radius on purpose (C26)', 2, L(98), groups.radii.filter((x) => x.cite.includes('C26') && x.present).length),
    row('concepts with genuine off-tier corners', 11, `${L(98)} (findings-corners.md:221)`, null, 'measured by tools/audit/radii.mjs, not here; the drawings that section names are shown below')];
  C.cuts = [row('filled files by cut weight', '[needs measuring]', L(630), null, 'the ledger leaves it to card 1.8\'s census (findings-filled.md)')];
  {
    const c = groups.centre;
    const at = (x) => x.off;
    const exact = c.filter((x) => Math.abs(at(x) - 0.5) < 1e-9);
    C.centre = [
      row('non-anchored drawings read (the headline\'s centre, after the declared shift)', 2880, 'enforcement-gap.md:106', files.filter((f) => !anchored(f)).length),
      row('more than 0.01 off centre', 164, L(638), c.length),
      row('more than 0.10', 80, L(638), c.filter((x) => at(x) > 0.1 + 1e-9).length),
      row('more than 0.25', 20, L(638), c.filter((x) => at(x) > 0.25 + 1e-9).length),
      row('exactly 0.50', 8, L(639), exact.length),
      row('  who', 'watch-2 ×6, volume-off at 16 ×2', L(100), Object.entries(exact.reduce((o, x) => { const f = F(x.f); const k = f.c === 'watch-2' ? 'watch-2' : `${f.c} at ${f.m}`; o[k] = (o[k] ?? 0) + 1; return o; }, {})).map(([k, v]) => `${k} ×${v}`).join(', '))];
  }
  {
    const fl = groups.knockout.map((x) => F(x.f));
    C.knockout = [
      row('shape-filled drawings', 1026, L(669), files.filter((f) => f.s === 'f' && f.ar > 0).length),
      row('of which keep a stroked line — never knockout-checked', 414, L(670), fl.length),
      row('concepts', 138, L(670), uniq(fl.map((f) => f.c))),
      row('by master, 24 · 20 · 16', '138 · 138 · 138', L(101), by3(fl))];
  }
  {
    const all = files.reduce((s, f) => s + (f.sk * (f.sk - 1)) / 2, 0);
    const touch = groups.contact.filter((x) => x.p.some((p) => p[2] === 't'));
    const cross = groups.contact.filter((x) => x.p.some((p) => p[2] === 'x'));
    C.contact = [
      row('stroke-path pairs in the set', 7554, L(678), all),
      row('pairs within 0.1, read as joined and skipped', 1544, L(678), groups.contact.reduce((s, x) => s + x.p.filter((p) => p[2] === 't').length, 0)),
      row('  in files · concepts', '985 · 257', L(678), `${touch.length} · ${uniq(touch.map((x) => F(x.f).c))}`),
      row('  files by master, 24 · 20 · 16', '335 · 326 · 324', L(679), by3(touch.map((x) => F(x.f)))),
      row('pairs that cross, skipped for their whole length', 199, L(679), groups.contact.reduce((s, x) => s + x.p.filter((p) => p[2] === 'x').length, 0)),
      row('  in files · concepts', '128 · 66', L(679), `${cross.length} · ${uniq(cross.map((x) => F(x.f).c))}`)];
  }
  {
    const glyphFile = (f) => f.k.some((c) => c.g === 'glyph');
    const s = groups.slack.filter((x) => x.band && !glyphFile(F(x.f)) && x.floorKind === '§6' && x.floor === 1.5);
    const noise = groups.slack.filter((x) => !x.band);
    const band = groups.slack.filter((x) => x.band);
    const outside = band.filter((x) => !s.includes(x));
    const sf = filesOf(s.map((x) => F(x.f)).map((f) => ({ ...f, style: f.s === 'f' ? 'filled' : 'outline' })));
    const n = (pred) => s.filter(pred).length;
    C.slack = [
      row('readings in [1.49, 1.50) against §6\'s 1.5, glyph files left out', 44, L(462), s.length),
      row('  files · concepts', '43 · 32', L(462), `${sf.length} · ${uniq(sf.map((f) => f.c))}`),
      row('  files by master, 24 · 20 · 16', '9 · 17 · 17', L(468), by3(sf)),
      row('  files by style, outline · filled', '20 · 23', L(469), byStyle(sf)),
      row('  by check: §5b · §5f · §5', '24 · 19 · 1', L(464), `${n((x) => x.check === '§5b')} · ${n((x) => x.check === '§5f')} · ${n((x) => x.check === '§5')}`),
      row('  §5f: separations · cuts · self', '10 · 7 · 2', L(466), `${n((x) => x.kind === 'separation')} · ${n((x) => x.kind === 'cut')} · ${n((x) => x.kind === 'self')}`),
      row('readings in the band at any floor — readings · files · concepts', '—', 'this sheet', `${band.length} · ${uniq(band.map((x) => x.f))} · ${uniq(band.map((x) => F(x.f).c))}`, `not a ledger figure. ${outside.length} sit outside the 44: ${outside.map((x) => `${F(x.f).m}/${F(x.f).n} paths ${x.paths?.join('/')} at ${x.reading}`).join(', ')} — the ledger left glyph files out "since their floor is 1", but in the pair check C19's 1 holds only the dot-to-body pair, never the shell (lint.mjs:395); path 1 here is the shell, so lint holds this pair to §6's 1.5`),
      row('readings the slack also passes that print 1.5 against 1.5 — readings · files · concepts', '—', 'this sheet', `${noise.length} · ${uniq(noise.map((x) => x.f))} · ${uniq(noise.map((x) => F(x.f).c))}`, 'not a ledger figure: under 1.5 by less than lint prints (rounding and arc sampling, not air). Removing the slack outright — R-9\'s second option — would turn these into warnings')];
  }
  C.gt = [row('notes whose value contains ">"', 0, L(692), groups.gt.length)];

  // 8. Out.
  const pinNames = Object.fromEntries([24, 20, 16].map((m) => [m, pinMan.masters?.[m]?.names?.length ?? 0]));
  const lintLine = (() => { const bad = files.filter((f) => f.L.e.length).length, w = files.filter((f) => !f.L.e.length && f.L.w.length).length; return `${files.length} drawings · ${files.length - bad - w} clean · ${w} warned · ${bad} failed`; })();
  for (const f of files) { delete f._slack; delete f._lost; delete f._pairs; }
  const sortOther = groups.sortOther; delete groups.sortOther;
  return {
    schema: SCHEMA,
    pin: { commit, concepts: pinConcepts.size, drawings: files.length, digest: digest.digest('hex'), manifestNames: pinNames, lint: lintLine },
    generator: 'tools/audit/exceptions-data.mjs',
    command: `node tools/audit/exceptions-data.mjs <pin-dir> --commit ${commit}`,
    recipe: `P=<scratch>/pin; mkdir -p $P && git archive ${commit} | tar -x -C $P && (cd $P && node tools/build.mjs); node tools/audit/exceptions-data.mjs $P --commit ${commit}`,
    notesSchema: set.schema,
    ledger: LEDGER,
    groupingRule: [
      'A note whose value contains ">" → group 20 (lint\'s note patterns stop at the first ">" and read no note).',
      'A second note of a key the file already declared → ungrouped (lint reads the first only).',
      'A note lint rejects or ignores — a value it cannot parse, a keyline word other than mark, grows in an outline file, gap at or over 1.5, an anchor naming its own file → ungrouped.',
      'Any other note goes to its key\'s group: keyline 2 · box 3 · optical 4 · glyph 5 · grows 6 · anchor 7 · gap 8 · tags 9.',
      'A free-text comment → group 1.',
      'Groups 10–19 hold no notes: they are escapes that leave no mark in a file, and list drawings, measured as each panel says.',
    ],
    groups: GROUPS.map((g) => ({ ...g, eye: EYE[g.id] ?? [], proposals: g.proposals.map((id) => ({ id, line: PROPOSALS[id][0], text: PROPOSALS[id][1] })), counts: C[g.id] ?? [], refs: groups[g.id] })),
    ungrouped: groups.ungrouped,
    ungroupedWarned: sortOther,
    whys,
    files,
  };
}

// --- the command ------------------------------------------------------------------------------
async function main(argv) {
  const opt = { pin: null, commit: DEFAULT_COMMIT, out: join(REPO, 'lab/audit-data/exceptions.json') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--commit') opt.commit = argv[++i];
    else if (argv[i] === '--out') opt.out = argv[++i];
    else if (!opt.pin && !argv[i].startsWith('--')) opt.pin = argv[i];
    else { console.error(`unknown argument ${argv[i]}`); process.exit(2); }
  }
  if (!opt.pin) { console.error('usage: node tools/audit/exceptions-data.mjs <pin-dir> [--commit 5933041] [--out FILE]'); process.exit(2); }
  const target = resolve(opt.out);
  if (target.startsWith(resolve(REPO, 'src') + sep)) { console.error(`refusing to write under src/: ${opt.out}`); process.exit(2); }
  const data = await build(opt.pin, { commit: opt.commit, log: (s) => console.error(s) });
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(data));
  const off = data.groups.flatMap((g) => g.counts.filter((c) => c.match === false).map((c) => `  §${g.section} ${g.title}: ${c.label} — ledger ${c.ledger}, data ${c.data}`));
  console.log(`${data.pin.drawings} drawings · ${data.pin.concepts} concepts at ${data.pin.commit} · lint ${data.pin.lint}`);
  for (const g of data.groups) console.log(`${String(g.n).padStart(2)} ${g.title.padEnd(44)} ${String(g.refs.length).padStart(5)} refs · ${g.counts.filter((c) => c.match === true).length}/${g.counts.filter((c) => c.match !== null).length} counts match`);
  console.log(`ungrouped notes: ${data.ungrouped.length} · warned drawings no group claims: ${data.ungroupedWarned.length}`);
  console.log(off.length ? `counts that differ from the ledger:\n${off.join('\n')}` : 'every measured count matches the ledger');
  console.error(`wrote ${opt.out}`);
}

let entry = false;
try { entry = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { entry = false; }
if (entry) main(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exit(1); });
