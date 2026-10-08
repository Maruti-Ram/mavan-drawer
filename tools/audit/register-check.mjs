#!/usr/bin/env node
// register-check.mjs — holds `docs/audit/findings-register.md` to its own sources.
//
// The register is a synthesis: every row restates a number some audit document measured and
// cites where that document holds it. This tool stops a restated number from drifting. For every
// table in the register that carries a `sources` column it:
//
//   1. parses each row's citations and checks each one resolves. Two forms:
//        `docs/audit/findings-air.md:212` or a range `:212-215` — a line in the file;
//        `plans/set-and-rules-audit.md "Pinned tree"` — an *anchor*: the one line that contains the
//        quoted text. An anchor survives lines being added above it; it fails if the text is gone
//        or appears on more than one line. Several citations per row, separated by ` · `;
//   2. extracts every number the row *states* (in its measured cells: everything except the id,
//      the kind, the scope, the sources and the proposals) and requires each to appear, exactly,
//      on a cited line or within three lines of it, in at least one of the row's citations.
//      Identifiers are not numbers, on either side: code spans in the row; and in both the row and
//      the source, rule and proposal ids (C14, F7, R-F7-03, OC-1), section marks (§4c), dates,
//      commit hashes, path:line tokens, kind labels ("kind (1)") and the number on the end of an
//      icon name (`check-circle-3`). "1,455" and "1455", "0.75" and "0.750", "61.8%" and "61.8"
//      are the same number; 1.957 and 1.96 are not;
//   3. where the table has a `kind` column, requires every row's kind to be one of (1) (2) (3),
//      to equal the others in that table, and to match the nearest heading above it that names a
//      kind — so a table can never hold two kinds, which the plan forbids in one line;
//   4. requires every `id` cell to match `R-F<axis>-<nn>` or `R-X-<nn>` and to be unique;
//   5. where the table has a `drawings` column, requires each cell to be a count of drawings
//      (`1,967 drawings`, a sum `31 + 18 drawings`, a ⇄ pair, or a number word the source used),
//      `every drawing (…)` for a row about the whole set by construction, `see R-…` for the second
//      row of one finding (ranked once, under the row named), `[needs measuring]`, or `none (…)`;
//      and where
//      it has a `reach` column, requires a count (a digit, or a number word the source used, which
//      is not source-checked), an enumeration of icons, `[needs measuring]` or `none (…)` — never
//      a phrase like "the swap partners" that no source can hold;
//   6. reads the proposal index (the table headed `| id | made by | answers |`) and requires it
//      to be the exact inverse of the rows' `proposals` cells: every row a proposal answers names
//      that proposal in its own cell, and every proposal a cell names is indexed with that row.
//
// It prints every failure with the register line it sits on, then a summary — rows, citations,
// failures, the row counts by kind and by axis section, the rows ranked by their `drawings` cell
// (ties in document order; the register's opening quotes the top five) and the rows marked
// `every drawing` — and exits 1 on any failure.
//
//   node tools/audit/register-check.mjs docs/audit/findings-register.md [--root <dir>] [--at <rev>] [--rank <n>] [--json]
//
// `--root` is the directory citations resolve against (default: the current directory). `--at`
// reads every cited file as it stood at a git revision (`git show <rev>:<path>`) instead of from
// the working tree, so the check can be repeated after the cited documents move on. Nothing is
// written. Nothing in lint, build or the lab imports this.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const WINDOW = 3;
export const ID_RE = /^R-(F\d{1,2}|X)-\d{2}$/;
const KIND_RE = /\((\d)\)/;
const CITE_RE = /^([\w][\w./-]*\.[a-z]+):(\d+)(?:[-–](\d+))?$/;
const ANCHOR_RE = /^([\w][\w./-]*\.[a-z]+)\s+"([^"]+)"$/;

// --- numbers ---------------------------------------------------------------------------------

// A number may not continue into a word or into another decimal part: "16.2px" is 16.2 once the
// unit is split off, never 16; "0.0.1" is a version, not two numbers.
const NUMBER_TOKEN = /(?<![\w.\-])(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(?!\w|\.\d)/g;

/** Identifier classes shared by both sides: none of these is a measured number. */
function stripIdentifiers(text) {
  return String(text)
    .replace(/\b[\w][\w./-]*\.(?:md|mjs|js|svg|json|html|txt|strings)(?::[\d,\- –]+)?/g, ' ') // path:line
    .replace(/\bdocs\/0\d(?::[\d,\- –]+)?/g, ' ')                // docs/07:49
    .replace(/\bcards?\s+\d\.\d+(?:\s*(?:,|and|\/|·)\s*\d\.\d+)*/gi, ' ') // card 1.8, cards 1.1 and 1.4
    .replace(/\bkinds?\s*\(\d\)(?:\s*(?:·|and|,|or)\s*\(\d\))*/gi, ' ') // kind (1), kinds (2) · (3)
    .replace(/\d{4}-\d{2}-\d{2}(?:T[\d:]+Z?)?/g, ' ')          // dates
    .replace(/§\s?[\w.]+(?:[-–][\w.]+)?/g, ' ')                // section marks
    .replace(/\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,40}\b/g, ' ') // commit hashes
    .replace(/\b[A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*-\d+[a-z]?\b(?!\.\d)/g, ' ') // check-circle-3, R-F7-03, OC-1
    .replace(/\b[A-Z]{1,3}\d+[a-z]?\b(?!\.\d)/g, ' ')            // C14, F7, D23 — not A2.25
    .replace(/(?<![\w.])\d+[a-z]\.\d+\b/g, ' ');                // 3b.2
}

/** Every number a register cell states, with identifiers removed first. */
export function extractRowNumbers(text) {
  const cleaned = stripIdentifiers(
    String(text)
      .replace(/`[^`]*`/g, ' ')                                 // code spans are identifiers
      .replace(/\[needs [a-z]+\]/g, ' ')
      .replace(/(\d)(px|dp|deg|u)\b/g, '$1 $2'),                // "16.2px" → "16.2 px"
  );
  const out = [];
  for (const m of cleaned.matchAll(NUMBER_TOKEN)) out.push(toNumber(m[0]));
  return out;
}

/**
 * Every number a source line holds. Looser than a row in one way only: a figure may sit inside a
 * code span or against a letter (`A2.25`, `r1.625`, `box: 14x20`, `×3`), because sources write
 * figures that way. It is never read out of an identifier: `check-circle-3` holds no 3, `C14` no
 * 14, `docs/07:49` no 49.
 */
export function extractSourceNumbers(text) {
  const cleaned = stripIdentifiers(String(text).replace(/`/g, ' '));
  const out = [];
  for (const m of cleaned.matchAll(/(?<![\d.])(\d{1,3}(?:,\d{3})+(?!\d)|\d+)(\.\d+)?/g)) out.push(toNumber(m[0]));
  return out;
}

export function toNumber(token) {
  return Number(String(token).replace(/,/g, ''));
}

/** Exact: a register states the source's figure, not a rounding of it. */
export function sameNumber(a, b) {
  return Math.abs(a - b) < 1e-9;
}

// --- citations -------------------------------------------------------------------------------

/**
 * `docs/audit/x.md:12` → { path, from, to }; `:12-15` → a range;
 * `plans/x.md "some text"` → { path, anchor }. Returns null if unreadable.
 */
export function parseCitation(token) {
  const t = String(token).trim().replace(/^`|`$/g, '');
  const a = ANCHOR_RE.exec(t);
  if (a) return { path: a[1], anchor: a[2], text: t };
  const m = CITE_RE.exec(t);
  if (!m) return null;
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  if (to < from) return null;
  return { path: m[1], from, to, text: t };
}

/** Splits a sources cell on ` · ` (or `; `), never inside an anchor's quotes. */
export function splitCitations(cell) {
  const out = [];
  let cur = '';
  let quoted = false;
  const s = String(cell);
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"') quoted = !quoted;
    if (!quoted && (s.startsWith(' · ', i) || s.startsWith('; ', i))) {
      out.push(cur);
      cur = '';
      i += s.startsWith(' · ', i) ? 2 : 1;
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}

// --- tables ----------------------------------------------------------------------------------

function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split(/(?<!\\)\|/).map((c) => c.trim());
}

function isSeparator(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line.trim());
}

/**
 * Parses the register into tables that carry a `sources` column, each with its heading kind, and
 * the proposal index (header `id | made by | answers`).
 */
export function parseRegister(text) {
  const lines = String(text).split('\n');
  const tables = [];
  const index = [];
  let headingKind = null;
  let headingText = '';
  let section = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,6}\s/.test(line)) {
      headingText = line.replace(/^#+\s*/, '');
      const k = /kind\s*\((\d)\)/i.exec(headingText);
      headingKind = k ? Number(k[1]) : null;
      const sec = /^#{2}\s+(F\d{1,2}|X)\b/.exec(line) || /^#{2}\s+.*?\b(F\d{1,2})\b/.exec(line);
      if (/^#{2}\s/.test(line)) section = sec ? sec[1] : headingText;
      continue;
    }
    if (!line.trim().startsWith('|')) continue;
    if (i + 1 >= lines.length || !isSeparator(lines[i + 1])) continue;
    const header = splitRow(line).map((c) => c.toLowerCase().replace(/\*/g, ''));
    const col = (name, alt) => {
      let idx = header.findIndex((h) => h === name);
      if (idx < 0 && alt) idx = header.findIndex((h) => alt.test(h));
      return idx;
    };
    let j = i + 2;
    if (header.length === 3 && header[0] === 'id' && header[1] === 'made by' && header[2] === 'answers') {
      for (; j < lines.length && lines[j].trim().startsWith('|'); j++) {
        const cells = splitRow(lines[j]);
        index.push({ line: j + 1, id: cells[0] ?? '', answers: cells[2] ?? '' });
      }
      i = j - 1;
      continue;
    }
    const cols = {
      id: col('id'),
      kind: col('kind'),
      scope: col('scope'),
      sources: col('sources', /^source/),
      proposals: col('proposals', /^proposal/),
      drawings: col('drawings'),
      reach: col('reach', /^reach/),
    };
    if (cols.sources < 0) continue;
    const skip = new Set([cols.id, cols.kind, cols.scope, cols.sources, cols.proposals]);
    const table = { line: i + 1, heading: headingText, headingKind, section, header, cols, rows: [] };
    for (; j < lines.length && lines[j].trim().startsWith('|'); j++) {
      const cells = splitRow(lines[j]);
      const measured = cells.filter((_, idx) => !skip.has(idx));
      const kindCell = cols.kind >= 0 ? cells[cols.kind] ?? '' : null;
      const km = kindCell == null ? null : KIND_RE.exec(kindCell);
      table.rows.push({
        line: j + 1,
        cells,
        id: cols.id >= 0 ? cells[cols.id] ?? '' : null,
        kind: km ? Number(km[1]) : kindCell == null ? null : NaN,
        measured: measured.join(' | '),
        sources: cells[cols.sources] ?? '',
        proposals: cols.proposals >= 0 ? cells[cols.proposals] ?? '' : null,
        drawings: cols.drawings >= 0 ? cells[cols.drawings] ?? '' : null,
        reach: cols.reach >= 0 ? cells[cols.reach] ?? '' : null,
      });
    }
    tables.push(table);
    i = j - 1;
  }
  return { tables, index };
}

// --- the drawings and reach cells --------------------------------------------------------------

const COUNT = String.raw`(\d{1,3}(?:,\d{3})+|\d+)`;

/**
 * A `drawings` cell: `N drawings`; a sum `A + B drawings` (two populations the card counted
 * apart); two counts joined by ⇄ (each may carry a parenthesis naming its card); a count the
 * source wrote in words (`ten drawings` — ranked, not source-checked); `every drawing (…)` for a
 * row about the whole set by construction (listed, never ranked against measured reaches);
 * `see R-…` for the second row of one finding (ranked once, under the row it names);
 * `[needs measuring]`; or `none (…)`. Returns { ok, counts, whole, see } — counts empty when the
 * cell holds no count to rank.
 */
export function parseDrawingsCell(cell) {
  const c = String(cell).trim();
  if (c === '[needs measuring]' || /^none\b/.test(c)) return { ok: true, counts: [], whole: false };
  if (/^every drawing(?:\s*\([^)]*\))?$/.test(c)) return { ok: true, counts: [], whole: true };
  const see = /^see (R-(?:F\d{1,2}|X)-\d{2})(?:\s*\([^)]*\))?$/.exec(c);
  if (see) return { ok: true, counts: [], whole: false, see: see[1] };
  const parts = c.split(/\s*⇄\s*/);
  const counts = [];
  const term = String.raw`(?:${COUNT}|${WORDS})`;
  const re = new RegExp(`^(${term}(?:\\s*\\+\\s*${term})*)\\s+drawings?\\b(?:\\s*\\([^)]*\\))?$`, 'i');
  for (const p of parts) {
    const m = re.exec(p.trim());
    if (!m) return { ok: false, counts: [], whole: false };
    counts.push(m[1].split(/\s*\+\s*/).reduce((sum, t) => sum + countOf(t), 0));
  }
  return { ok: counts.length >= 1 && counts.length <= 2, counts, whole: false };
}

const WORD_VALUES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const WORDS = String.raw`(?:${WORD_VALUES.join('|')})`;
function countOf(token) {
  const w = WORD_VALUES.indexOf(String(token).toLowerCase());
  return w >= 0 ? w : toNumber(token);
}

// A count the source wrote in words ("eleven concepts"). Allowed in a reach cell; never source-checked.
const NUMBER_WORD = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/i;

/**
 * A `reach` cell must hold a count (a digit outside code, or a number word the source used — not
 * checked against it), or name its icons and nothing else
 * (`map-pin` · `map-pin-2` — an enumeration is a count), or say `[needs measuring]`, or start `none`.
 */
export function reachCellOk(cell) {
  const c = String(cell).trim();
  if (c === '[needs measuring]' || /^none\b/.test(c)) return true;
  const prose = c.replace(/`[^`]*`/g, ' ');
  if (/\d/.test(prose) || NUMBER_WORD.test(prose)) return true;
  return /`/.test(c) && prose.replace(/×\s?\d+|[,·]|\band\b|\s/g, '') === '';
}

// --- the proposal index ------------------------------------------------------------------------

// Every proposal-id form the register uses, in its canonical spelling.
const PROPOSAL_ALTS = [
  String.raw`metrics F\d+`,
  String.raw`sev §7-\d+[a-z]?`,
  String.raw`sev §\d+(?:\.\d+)?[a-z]?(?: row \d+)?`,
  String.raw`angles §7a-\d+`,
  String.raw`corners §11a-\d+`,
  String.raw`primitives item \d+`,
  String.raw`primitive-drift check \d+[a-z]?`,
  String.raw`scaling S\d+`,
  String.raw`Fluent T\d+`,
  String.raw`SF T\d+`,
  String.raw`Nucleo T\d+`,
  String.raw`mass M-\d+`,
  String.raw`grid G-\d+`,
  String.raw`(?:Central|Untitled) take`,
  String.raw`(?:OC|FM|PL|FD)-\d+`,
  String.raw`R-\d+`,
  String.raw`P\d+`,
];
const PROPOSAL_RE = new RegExp(`(?<![\\w§.-])(?:${PROPOSAL_ALTS.join('|')})(?![\\w.]|-\\d)`, 'g');

/** The proposal ids a `proposals` cell names, canonical and de-duplicated. */
export function proposalIds(cell) {
  return [...new Set([...String(cell).matchAll(PROPOSAL_RE)].map((m) => m[0]))];
}

function rowIdsIn(text) {
  return [...String(text).matchAll(/\bR-(?:F\d{1,2}|X)-\d{2}\b/g)].map((m) => m[0]);
}

// --- reading sources ---------------------------------------------------------------------------

/** Reads a cited file from the working tree under `root`, or from git at `at`. Null if absent. */
export function sourceReader({ root = process.cwd(), at = null, readFile = defaultRead } = {}) {
  return (path) => {
    if (at) {
      const r = spawnSync('git', ['-C', root, 'show', `${at}:${path}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      return r.status === 0 ? r.stdout : null;
    }
    const abs = resolve(root, path);
    return existsSync(abs) ? readFile(abs) : null;
  };
}

// --- the check -------------------------------------------------------------------------------

/**
 * Checks a register text. `root` is where citations resolve, `at` an optional git revision;
 * `readFile` can be injected for tests. Returns { rows, citations, failures, byKind, bySection,
 * ranking }.
 */
export function checkRegister(text, { root = process.cwd(), at = null, readFile = defaultRead } = {}) {
  const { tables, index } = parseRegister(text);
  const read = sourceReader({ root, at, readFile });
  const failures = [];
  const seenIds = new Map();
  const fileCache = new Map();
  const rowsById = new Map();
  const ranking = [];
  const wholeSet = [];
  const seeRefs = [];
  let rows = 0;
  let kindRows = 0;
  let kindTables = 0;
  let citations = 0;
  const byKind = { 1: 0, 2: 0, 3: 0 };
  const bySection = new Map();

  const linesOf = (path) => {
    if (!fileCache.has(path)) {
      const t = read(path);
      fileCache.set(path, t == null ? null : t.split('\n'));
    }
    return fileCache.get(path);
  };

  for (const table of tables) {
    const kinds = new Set();
    if (table.cols.kind >= 0) { kindTables++; kindRows += table.rows.length; }
    for (const row of table.rows) {
      rows++;
      const fail = (message) => failures.push({ line: row.line, id: row.id, message });

      if (row.id != null) {
        if (!ID_RE.test(row.id)) fail(`id "${row.id}" is not R-F<axis>-<nn> or R-X-<nn>`);
        else if (seenIds.has(row.id)) fail(`id "${row.id}" repeats line ${seenIds.get(row.id)}`);
        else { seenIds.set(row.id, row.line); rowsById.set(row.id, row); }
      }

      if (row.kind !== null) {
        if (![1, 2, 3].includes(row.kind)) fail(`kind cell "${row.cells[table.cols.kind]}" is not (1), (2) or (3)`);
        else {
          kinds.add(row.kind);
          byKind[row.kind]++;
          if (table.headingKind == null) fail(`table at line ${table.line} sits under no "Kind (n)" heading`);
          else if (table.headingKind !== row.kind) fail(`kind (${row.kind}) under a "Kind (${table.headingKind})" heading`);
        }
      }
      bySection.set(table.section, (bySection.get(table.section) ?? 0) + 1);

      if (row.drawings != null) {
        const d = parseDrawingsCell(row.drawings);
        if (!d.ok) fail(`drawings cell "${row.drawings}" is not "N drawings", "every drawing", "see R-…", "[needs measuring]" or "none (…)"`);
        else if (d.whole && row.id) wholeSet.push(row.id);
        else if (d.see) seeRefs.push({ line: row.line, id: row.id, see: d.see });
        else if (d.counts.length && row.id) ranking.push({ id: row.id, line: row.line, counts: d.counts, rank: Math.min(...d.counts) });
      }
      if (row.reach != null && !reachCellOk(row.reach)) fail(`reach cell "${row.reach}" holds no count; write the source's count or [needs measuring]`);

      const tokens = splitCitations(row.sources);
      if (!tokens.length) fail('no source cited');
      const windows = [];
      for (const token of tokens) {
        const cite = parseCitation(token);
        if (!cite) { fail(`unreadable citation "${token}"`); continue; }
        citations++;
        const lines = linesOf(cite.path);
        if (!lines) { fail(`${cite.path}: file not found${at ? ` at ${at}` : ''}`); continue; }
        let from = cite.from;
        let to = cite.to;
        if (cite.anchor != null) {
          const hits = [];
          lines.forEach((l, k) => { if (l.includes(cite.anchor)) hits.push(k + 1); });
          if (hits.length !== 1) { fail(`${cite.text}: anchor matches ${hits.length} lines, needs exactly 1`); continue; }
          from = to = hits[0];
        }
        if (to > lines.length) { fail(`${cite.text}: line ${to} is past the end (${lines.length} lines)`); continue; }
        const a = Math.max(1, from - WINDOW);
        const b = Math.min(lines.length, to + WINDOW);
        windows.push(...lines.slice(a - 1, b));
      }
      if (!windows.length) continue;
      const available = extractSourceNumbers(windows.join('\n'));
      const missing = [];
      for (const n of extractRowNumbers(row.measured)) {
        if (!available.some((m) => sameNumber(m, n))) missing.push(n);
      }
      for (const n of [...new Set(missing)]) fail(`number ${n} is not within ${WINDOW} lines of any cited line`);
    }
    if (kinds.size > 1) failures.push({ line: table.line, id: null, message: `table mixes kinds (${[...kinds].sort().join(', ')})` });
  }

  // A drawings cell that says "see R-…" points at the row that carries the count, so one finding
  // filed under two kinds is ranked once; the row it names must exist and carry a count.
  for (const ref of seeRefs) {
    const target = rowsById.get(ref.see);
    const counted = target && target.drawings != null && parseDrawingsCell(target.drawings).counts.length > 0;
    if (!counted) failures.push({ line: ref.line, id: ref.id, message: `drawings cell points at ${ref.see}, which ${target ? 'carries no count' : 'is no row'}` });
  }

  // The proposal index must be the exact inverse of the rows' proposals cells.
  if (index.length) {
    const indexed = new Map();
    for (const entry of index) {
      const id = entry.id.replace(/`/g, '').trim();
      if (indexed.has(id)) { failures.push({ line: entry.line, id: null, message: `index: "${id}" is listed twice` }); continue; }
      const answers = new Set(rowIdsIn(entry.answers));
      indexed.set(id, answers);
      for (const rid of answers) {
        const row = rowsById.get(rid);
        if (!row) failures.push({ line: entry.line, id: null, message: `index: ${id} answers ${rid}, which is no row` });
        else if (row.proposals != null && !proposalIds(row.proposals).includes(id)) {
          failures.push({ line: entry.line, id: rid, message: `index: ${id} answers ${rid}, whose proposals cell does not name it` });
        }
      }
    }
    for (const [rid, row] of rowsById) {
      if (row.proposals == null) continue;
      for (const pid of proposalIds(row.proposals)) {
        if (!indexed.has(pid)) failures.push({ line: row.line, id: rid, message: `proposal ${pid} is not in the index` });
        else if (!indexed.get(pid).has(rid)) failures.push({ line: row.line, id: rid, message: `proposal ${pid}: the index does not list this row` });
      }
    }
  }

  ranking.sort((x, y) => y.rank - x.rank || x.line - y.line);
  return {
    rows, kindRows, kindTables, citations, failures, byKind,
    bySection: Object.fromEntries(bySection), ranking, wholeSet, indexed: index.length,
  };
}

function defaultRead(abs) {
  return readFileSync(abs, 'utf8');
}

// --- CLI -------------------------------------------------------------------------------------

export function main(argv = process.argv.slice(2)) {
  const args = [...argv];
  let root = process.cwd();
  let at = null;
  let json = false;
  let top = 5;
  let bad = false;
  const files = [];
  const value = () => { const v = args.shift(); if (v == null || v.startsWith('--')) bad = true; return v; };
  while (args.length) {
    const a = args.shift();
    if (a === '--root') root = resolve(value() ?? '.');
    else if (a === '--at') at = value() ?? null;
    else if (a === '--rank') top = Number(value());
    else if (a === '--json') json = true;
    else files.push(a);
  }
  if (bad || files.length !== 1 || !Number.isFinite(top)) {
    console.error('usage: node tools/audit/register-check.mjs <register.md> [--root <dir>] [--at <rev>] [--rank <n>] [--json]');
    return 2;
  }
  const file = resolve(files[0]);
  if (!existsSync(file)) { console.error(`${files[0]}: not found`); return 2; }
  const result = checkRegister(readFileSync(file, 'utf8'), { root, at });
  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    for (const f of result.failures) console.log(`FAIL  line ${f.line}${f.id ? ` · ${f.id}` : ''} · ${f.message}`);
    const kinds = `(1) ${result.byKind[1]} · (2) ${result.byKind[2]} · (3) ${result.byKind[3]}`;
    const sections = Object.entries(result.bySection).map(([s, n]) => `${s} ${n}`).join(' · ');
    console.log(`rows ${result.rows} (${result.kindRows} in ${result.kindTables} kind tables, ${result.rows - result.kindRows} elsewhere) · citations ${result.citations} · index ${result.indexed} · failures ${result.failures.length}${at ? ` · sources at ${at}` : ''}`);
    console.log(`by kind: ${kinds}`);
    console.log(`by section: ${sections}`);
    const ranked = result.ranking.slice(0, top).map((r) => `${r.id} ${r.counts.map((n) => n.toLocaleString('en-US')).join(' ⇄ ')}`);
    console.log(`by drawings (top ${top} of ${result.ranking.length} counted; ties in document order): ${ranked.join(' · ')}`);
    console.log(`every drawing, by construction (not ranked): ${result.wholeSet.join(' · ') || '—'}`);
  }
  return result.failures.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
