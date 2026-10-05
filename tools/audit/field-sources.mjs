#!/usr/bin/env node
// Card 2.6 — the field. Every figure in docs/audit/references-field.md reprints from here.
// AUDIT ONLY — imported by nothing in lint or build; writes only where it is told, never in the repo.
//
// The two field reports were written on 2026-10-04 by two agents of session
// 07852967-7543-4b42-af82-b9afcfb57d4e. They exist in that session's transcripts as the `message`
// of each agent's final SubagentHandback call. This tool:
//
//   extract <out-dir> [--projects <dir>] [--session <id>] [--no-hash]
//       re-extracts both reports from the transcripts and verifies their sha256 against the
//       values recorded below. <out-dir> may not be inside this repository.
//   check <doc> <sources-dir> [--evidence <dir>] [--no-hash]
//       verifies every `[praise …]` / `[construction …]` anchor the document cites exists in the
//       reports; that every "quoted string" in the document appears verbatim in a report or in
//       the saved evidence; prints every count the document takes from the reports (and, with
//       --evidence, recounts the failure-mode tally from the survey's own tally3.py); and checks
//       the transcription behind the normalised calibration table.
//   normalise
//       prints the calibration table — each published number as a share of its canvas and as a
//       multiple of its own stroke — from the rows embedded below, each tagged with its report
//       section.
//
// Anchor grammar. Praise report: `A`, `A.3` (numbered item 3 under A), `B`, `B:Atlassian` (the
// bold-led entry for that set under B), `C1`, `C1.4`, `C2`, `C2.3`, `C3`, `C4`, `C4.2`, `D`.
// Construction report: `§1`, `§1.6` (headline item 6), `§2.5` (a per-system table),
// `§2.5 Stroke at 12` (that table's row), `§3.2`, `§4.5`, `§5`, `§6`. Several anchors in one
// bracket are separated by `;`.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, '../..');

// ── the two reports, as recovered 2026-10-05 ────────────────────────────────────────────────
export const SESSION = '07852967-7543-4b42-af82-b9afcfb57d4e';
export const REPORTS = [
  { file: 'field-survey-praise.md', agent: 'ac6f17b540b15b43e', title: 'Field survey of praised icon sets',
    sha256: 'ffc497c2ea7544ef261d067f7e8895a6346d2ce25cd06a4adcc895506eb02823', kind: 'praise' },
  { file: 'field-construction-systems.md', agent: 'a365eba20e75eadb3', title: 'Published construction systems',
    sha256: '2e307a292cbb130c8f99ec59e9c8e3982e74c40d26920889a86245cb74f329a8', kind: 'construction' },
];

export const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/** Claude Code keeps a project's transcripts under ~/.claude/projects/<slug>, slug = cwd with every
 *  non-alphanumeric character turned into '-'. */
export const projectSlug = (dir) => dir.replace(/[^A-Za-z0-9]/g, '-');
export const defaultProjectsDir = () => join(homedir(), '.claude', 'projects', projectSlug(REPO));

// ── extract ─────────────────────────────────────────────────────────────────────────────────
/** The `message` of the LAST SubagentHandback tool_use in one agent's JSONL transcript. Lines that
 *  are not JSON, or not that agent/session, or not a tool_use of that name, are ignored. */
export function handbackMessage(jsonl, { agent, session } = {}) {
  let found = null;
  let n = 0;
  for (const line of jsonl.split('\n')) {
    if (!line.trim()) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; }
    if (agent && o.agentId && o.agentId !== agent) continue;
    if (session && o.sessionId && o.sessionId !== session) continue;
    const content = o.message?.content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (part?.type === 'tool_use' && part.name === 'SubagentHandback' && typeof part.input?.message === 'string') {
        found = part.input.message;
        n += 1;
      }
    }
  }
  if (found == null) throw new Error('no SubagentHandback call in the transcript');
  return { message: found, calls: n };
}

export const isInside = (child, parent) => {
  const c = resolve(child), p = resolve(parent);
  return c === p || c.startsWith(p.endsWith('/') ? p : p + '/');
};

/** The real path of `p` even when `p` does not exist yet: real-path its deepest existing ancestor
 *  and append the rest (a temp dir under /var on macOS is really under /private/var). */
export function realPath(p) {
  let base = resolve(p);
  const rest = [];
  while (!existsSync(base)) { rest.unshift(basename(base)); const up = dirname(base); if (up === base) break; base = up; }
  let real = base;
  try { real = realpathSync(base); } catch {}
  return rest.length ? join(real, ...rest) : real;
}

/** Re-extract every report; verify each hash unless `verifyHash` is false. Returns the results;
 *  throws on a missing transcript, a missing call, a hash mismatch, or an out-dir inside the repo. */
export function extractReports({ outDir, projectsDir = defaultProjectsDir(), session = SESSION, reports = REPORTS, verifyHash = true, repo = REPO }) {
  const out = resolve(outDir);
  if (isInside(realPath(out), realPath(repo))) throw new Error(`refusing to write inside the repository: ${out}`);
  mkdirSync(out, { recursive: true });
  const results = [];
  for (const r of reports) {
    const path = join(projectsDir, session, 'subagents', `agent-${r.agent}.jsonl`);
    if (!existsSync(path)) throw new Error(`transcript not found: ${path}`);
    const { message, calls } = handbackMessage(readFileSync(path, 'utf8'), { agent: r.agent, session });
    const hash = sha256(message);
    const ok = hash === r.sha256;
    if (verifyHash && !ok) throw new Error(`${r.file}: sha256 ${hash} does not match the recorded ${r.sha256} (${message.length} chars)`);
    writeFileSync(join(out, r.file), message);
    results.push({ file: r.file, agent: r.agent, chars: message.length, calls, sha256: hash, verified: verifyHash ? ok : null });
  }
  return results;
}

// ── report structure: the anchors a document may cite ───────────────────────────────────────
const stripBold = (s) => s.replace(/\*\*/g, '').trim();
const leadName = (s) => stripBold(s).replace(/[.:]\s*$/, '').trim();

/** Anchors of the praise report: sections A–D, C1–C4, numbered items under them, and the bold-led
 *  entries under B (`B:<name>`). Returns Map anchor → text of that unit. */
export function praiseAnchors(text) {
  const anchors = new Map();
  let section = null;
  let buf = [];
  const flush = () => { if (section) anchors.set(section, (anchors.get(section) ?? '') + buf.join('\n')); buf = []; };
  for (const line of text.split('\n')) {
    let m;
    if ((m = line.match(/^##\s+([A-D])\.\s/))) { flush(); section = m[1]; buf = [line]; continue; }
    if ((m = line.match(/^###\s+(C\d)\.\s/))) { flush(); section = m[1]; buf = [line]; continue; }
    buf.push(line);
    if (!section) continue;
    if (section === 'B' && (m = line.match(/^(?:-\s+)?\*\*([^*]+?)\*\*/))) anchors.set(`B:${leadName(m[1])}`, (anchors.get(`B:${leadName(m[1])}`) ?? '') + line + '\n');
  }
  flush();
  // a numbered item (`3. …`, bold or not) runs to the next numbered item or heading
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\d+)\.\s+\S/);
    if (!m) continue;
    const sec = sectionAt(text, i, /^##\s+([A-D])\.\s|^###\s+(C\d)\.\s/);
    if (!sec) continue;
    let j = i + 1;
    while (j < lines.length && !/^\d+\.\s+\S|^##/.test(lines[j])) j++;
    anchors.set(`${sec}.${m[1]}`, lines.slice(i, j).join('\n'));
  }
  return anchors;
}

function sectionAt(text, index, re) {
  const lines = text.split('\n');
  for (let i = index; i >= 0; i--) { const m = lines[i].match(re); if (m) return m[1] ?? m[2]; }
  return null;
}

/** Anchors of the construction report: `§n` for `## n.`, `§n.m` for `### n.m`, `§1.k` for headline
 *  item k, and `§n.m <Row>` for the first cell of a table row inside that section. */
export function constructionAnchors(text) {
  const anchors = new Map();
  const lines = text.split('\n');
  let section = null;
  let buf = [];
  const flush = () => { if (section) anchors.set(section, buf.join('\n')); buf = []; };
  for (const line of lines) {
    let m;
    if ((m = line.match(/^##\s+(\d+)\.\s/))) { flush(); section = `§${m[1]}`; buf = [line]; continue; }
    if ((m = line.match(/^###\s+(\d+\.\d+)\s/))) { flush(); section = `§${m[1]}`; buf = [line]; continue; }
    if (/^##\s/.test(line)) { flush(); section = null; buf = []; continue; }
    buf.push(line);
    if (!section) continue;
    if (section === '§1' && (m = line.match(/^(\d+)\.\s+\*\*/))) anchors.set(`§1.${m[1]}`, line);
    if ((m = line.match(/^\|\s*([^|]+?)\s*\|/)) && !/^\|\s*-+/.test(line) && !/^\|\s*Dimension\s*\|/.test(line)) {
      const row = leadName(m[1]);
      anchors.set(`${section} ${row}`, line);
    }
  }
  flush();
  // headline items run to the next numbered item
  let i = lines.findIndex((l) => /^##\s+1\.\s/.test(l));
  if (i >= 0) {
    for (let k = i + 1; k < lines.length && !/^##\s/.test(lines[k]); k++) {
      const m = lines[k].match(/^(\d+)\.\s+\*\*/);
      if (!m) continue;
      let j = k + 1;
      while (j < lines.length && !/^\d+\.\s+\*\*|^##/.test(lines[j])) j++;
      anchors.set(`§1.${m[1]}`, lines.slice(k, j).join('\n'));
    }
  }
  return anchors;
}

/** Code spans are syntax, not citations or quotations: a `[praise …]` inside backticks names the grammar. */
export const withoutCode = (doc) => doc.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');

/** Every `[praise …]` / `[construction …]` citation in a document, split on `;`. A citation does not
 *  run past the end of its line. */
export function citedAnchors(doc) {
  const out = [];
  for (const m of withoutCode(doc).matchAll(/\[(praise|construction)\s+([^\]\n]+)\]/g)) {
    let report = m[1];
    for (const part of m[2].split(';')) {
      const named = part.trim().match(/^(praise|construction)\s+(.+)$/);
      if (named) report = named[1];
      const a = (named ? named[2] : part).trim();
      if (a) out.push({ report, anchor: a, raw: m[0] });
    }
  }
  return out;
}

// ── quotes ──────────────────────────────────────────────────────────────────────────────────
const unsmart = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').replace(/\s+/g, ' ');
const unescapeHtml = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Every double-quoted span in the document, with inline code removed first (a `"x"` inside
 *  backticks is syntax, not a quotation). Curly and straight quotes both count. A paragraph's
 *  line breaks are joined first, so a quotation wrapped across two lines is still one quotation. */
export function quotedStrings(doc) {
  const out = [];
  const joined = withoutCode(doc).replace(/\n(?!\n)/g, ' ');
  for (const m of joined.matchAll(/[“"]([^“”"]{1,400}?)[”"]/g)) out.push(m[1].replace(/\s+/g, ' ').trim());
  return out;
}

/** The quoted spans inside the reports themselves — what the reports cite from third parties. */
export function reportQuotedSpans(reports) {
  const spans = [];
  for (const r of reports) for (const q of quotedStrings(r.text)) spans.push(unsmart(q).toLowerCase());
  return spans;
}

/** A quotation is third-party when a report wraps it in quotes (it is something the report cites,
 *  not something the report says) or when it is found only in the saved evidence. */
export function isThirdParty(quote, foundIn, reportSpans) {
  const q = unsmart(quote).toLowerCase();
  if (reportSpans.some((s) => s.includes(q))) return true;
  return !!foundIn && !/^field-(survey-praise|construction-systems)\.md$/.test(basename(foundIn));
}

export const QUOTE_WORD_CAP = 7;   // a third-party quotation of this many words or more is flagged

export const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;

export function textFilesUnder(dir, exts = ['.md', '.txt', '.json'], acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) textFilesUnder(p, exts, acc);
    else if (exts.some((e) => name.endsWith(e))) acc.push(p);
  }
  return acc;
}

/** Where a quote appears verbatim: in a report, else in the evidence. Comparison normalises curly
 *  quotes, ellipses and whitespace, and tries the HTML-unescaped form of each evidence file. */
export function findQuote(quote, reports, evidenceFiles = [], cache = new Map()) {
  const q = unsmart(quote).toLowerCase();
  for (const r of reports) if (unsmart(r.text).toLowerCase().includes(q)) return r.file;
  for (const f of evidenceFiles) {
    if (!cache.has(f)) { let t = ''; try { t = readFileSync(f, 'utf8'); } catch {} cache.set(f, unsmart(unescapeHtml(t)).toLowerCase()); }
    if (cache.get(f).includes(q)) return f;
  }
  return null;
}

// ── counts the document takes from the reports ──────────────────────────────────────────────
/** The praise report's ranked failure modes (C2): `N. **label**: count [HN h, designers d]`. */
export function failureModes(praiseText) {
  const sec = praiseAnchors(praiseText).get('C2') ?? '';
  const out = [];
  for (const line of sec.split('\n')) {
    const rank = line.match(/^(\d+)\.\s/);
    if (!rank) continue;
    // one mode per bold label: `**label**: 12 [HN 8, designers 4]`, `**label** 7 (…)`, `**label** 5: …`
    for (const s of line.matchAll(/\*\*([^*]+?)\*\*:?\s+(\d+)(?:\s*\[HN\s*(\d+),\s*designers\s*(\d+)\])?/g)) {
      const mode = { rank: +rank[1], label: s[1], n: +s[2] };
      if (s[3] != null) { mode.hn = +s[3]; mode.designers = +s[4]; }
      out.push(mode);
    }
  }
  const nm = sec.match(/n=(\d+)\s*\(HN\s*(\d+);[^)]*?(\d+)\)/);
  return { total: nm ? { n: +nm[1], hn: +nm[2], designers: +nm[3] } : null, modes: out };
}

/** Recount the survey's own coding table (icon-reception/tally3.py): rows of
 *  ("id","P|V","set","url","CODE CODE"). Returns per-type counts per code. */
export function recountTally(pySource) {
  const rows = [];
  for (const m of pySource.matchAll(/\(\s*"([^"]*)"\s*,\s*"([PV])"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\)/g)) rows.push({ id: m[1], type: m[2], set: m[3], url: m[4], codes: m[5].split(/\s+/).filter(Boolean) });
  const count = (type) => {
    const c = new Map();
    for (const r of rows.filter((x) => x.type === type)) for (const code of r.codes) c.set(code, (c.get(code) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  };
  return { rows: rows.length, independent: rows.filter((r) => r.type === 'P').length, vendor: rows.filter((r) => r.type === 'V').length, P: count('P'), V: count('V') };
}

/** Counts read off the construction report's structure. */
export function constructionCounts(text) {
  const a = constructionAnchors(text);
  const systems = [...a.keys()].filter((k) => /^§2\.\d+$/.test(k)).length;
  const h2 = a.get('§1.2') ?? '';
  const strokes16 = {};
  for (const m of h2.matchAll(/-\s+(1\.0|1\.5):\s*([^\n]+)/g)) strokes16[m[1]] = m[2].split(/,\s*(?![^()]*\))/).map((s) => s.trim()).filter(Boolean).length;
  const policy = a.get('§3.5') ?? '';
  let oneDrawing = 0, oneWithAxes = 0, rows = 0;
  for (const line of policy.split('\n')) {
    const cells = line.split('|').map((s) => s.trim());
    if (cells.length < 5 || /^-+$/.test(cells[1]) || cells[1] === 'System') continue;
    rows += 1;
    if (cells[3] === 'one') oneDrawing += 1;
    else if (/^one,/.test(cells[3])) oneWithAxes += 1;
  }
  const live = a.get('§3.1') ?? '';
  const liveRows = live.split('\n').filter((l) => /^\|\s*[A-Z]/.test(l) && !/^\|\s*System/.test(l)).length;
  const contradictions = (a.get('§5') ?? '').split('\n').filter((l) => /^\|\s*[A-Z]/.test(l) && !/^\|\s*Topic/.test(l)).length;
  const fillTable = (a.get('§1.7') ?? '').split('\n').filter((l) => /^\s*\|\s*[A-Z]/.test(l) && !/System/.test(l)).length;
  return { systems, strokesAt16: strokes16, multiSizeRows: rows, oneDrawingPerConcept: oneDrawing, oneTopologyWithAxes: oneWithAxes, liveAreaRows: liveRows, contradictionTopics: contradictions, filledTwinSystems: fillTable };
}

// ── the calibration table ───────────────────────────────────────────────────────────────────
// Each number carries `say`, the exact words that state it, and `at`, where those words live: a
// section of the construction report (`§2.5`) or a line of a repo file (`references-fluent.md:118`
// under docs/audit, or a path from the repo root). `check` verifies that every `say` is in its
// source AND that the value is one of the numbers written in `say` (or, for a derived value, that
// `calc` — arithmetic on numbers written in `say` and the row's own stroke — gives it). A range is
// {lo, hi}. "n/s" = not stated. Columns: stroke · circle keyline (ink) · square keyline (ink) ·
// corner radius · gap (the air floor between strokes, or the measured separation) · cut (the width
// of a knocked-out line) · bound (the outer drawing bound: a stated live area, or the circle keyline
// where no live area is published; `kind` says which) — the margin is derived from the bound.
const D = (v, say, at, extra = {}) => ({ v, say, at, ...extra });
const FLUENT_CUT = '1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50';           // references-fluent.md:118, 12 … 48
const FLUENT_SEP = '1.00 · 0.95 · 1.00 · 1.00 · 1.50 · 1.50 · 2.46';           // references-fluent.md:122, 12 … 48
export const CALIBRATION = [
  { system: 'Material (Symbols, w400)', size: 24, canvas: 24, basis: 'S + F',
    stroke: D(2, '24 = 2.00', '§2.1'), circle: D(20, '24: 20 / 18 / 16×20 / 20×16', '§2.1'), square: D(18, '24: 20 / 18 / 16×20 / 20×16', '§2.1'),
    radius: D(2, 'Exterior radius 2dp in Outlined style', '§2.1'), gap: null, cut: null, bound: D(20, 'Live 20×20 in 24, 2dp padding per side', '§2.1', { kind: 'live' }) },
  { system: 'Material (Symbols, w400)', size: 20, canvas: 20, basis: 'S + F',
    stroke: D(1.5, 'opsz 20 = 1.50', '§2.1'), circle: D(16, '20dp: 16 / 14 / 12×16 / 16×12', '§2.1'), square: D(14, '20dp: 16 / 14 / 12×16 / 16×12', '§2.1'),
    radius: D(1.5, 'Outer radius = stroke at every optical size (1.5 / 2.0 / 2.78 / 3.0)', '§2.1'), gap: null, cut: null, bound: D(16, 'M1 gives 16×16 live with 2dp padding', '§2.1', { kind: 'live' }) },
  { system: 'Fluent (Regular)', size: 24, canvas: 24, basis: 'X, F; gap and cut measured by card 2.1',
    stroke: D(1.5, '24 = 1.5', '§2.3'), circle: D(20, '24: circle 20, square 18', '§2.3'), square: D(18, '24: circle 20, square 18', '§2.3'),
    radius: D(3.25, '24 = 3.25', '§2.3'), gap: D(1, FLUENT_SEP, 'references-fluent.md:122'), cut: D(1.5, FLUENT_CUT, 'references-fluent.md:118'),
    bound: D(20, 'Circle ink: 10/12, 14/16, 16/20, 20/24', '§2.3', { kind: 'keyline' }) },
  { system: 'Fluent (Regular)', size: 20, canvas: 20, basis: 'X, F; gap and cut measured by card 2.1',
    stroke: D(1, '20 = 1.0', '§2.3'), circle: D(16, '20: 16 / 14 / 12×16 / 16×12', '§2.3'), square: D(14, '20: 16 / 14 / 12×16 / 16×12', '§2.3'),
    radius: D(3, '20 = 3.0', '§2.3'), gap: D(1, FLUENT_SEP, 'references-fluent.md:122'), cut: D(1, FLUENT_CUT, 'references-fluent.md:118'),
    bound: D(16, 'Circle ink: 10/12, 14/16, 16/20, 20/24', '§2.3', { kind: 'keyline' }) },
  { system: 'Fluent (Regular)', size: 16, canvas: 16, basis: 'X, F; gap and cut measured by card 2.1',
    stroke: D(1, '16 = 1.0', '§2.3'), circle: D(14, '16: 14 / 12 / 10×14 / 14×10', '§2.3'), square: D(12, '16: 14 / 12 / 10×14 / 14×10', '§2.3'),
    radius: D(2.5, '16 = 2.5', '§2.3'), gap: D(0.95, FLUENT_SEP, 'references-fluent.md:122'), cut: D(1, FLUENT_CUT, 'references-fluent.md:118'),
    bound: D(14, 'Circle ink: 10/12, 14/16, 16/20, 20/24', '§2.3', { kind: 'keyline' }) },
  { system: 'IBM Carbon', size: 16, canvas: 16, basis: 'S',
    stroke: D(1, '16: 1 / 1 / 14 / 1', '§2.4'), circle: null, square: null,
    radius: D(1, '16: 1 / 1 / 14 / 1', '§2.4'), gap: null, cut: null, bound: D(14, '16: 1 / 1 / 14 / 1', '§2.4', { kind: 'live' }) },
  { system: 'IBM Carbon', size: 32, canvas: 32, basis: 'S',
    stroke: D(2, '32: stroke 2 / padding 2 / live 28 / radius 2', '§2.4'), circle: null, square: null,
    radius: D(2, '32: stroke 2 / padding 2 / live 28 / radius 2', '§2.4'), gap: null, cut: null, bound: D(28, '32: stroke 2 / padding 2 / live 28 / radius 2', '§2.4', { kind: 'live' }) },
  { system: 'Atlassian (core)', size: 16, canvas: 16, basis: 'S',
    stroke: D(1.5, '1.5px. Legacy set was 2px on a 24 canvas', '§2.5'), circle: null, square: null, radius: null, gap: null, cut: null, bound: null },
  { system: 'Atlassian (12 = CSS downscale)', size: 12, canvas: 12, basis: 'X',
    stroke: D(1.125, 'stroke becomes 1.125', '§2.5'), circle: null, square: null, radius: null, gap: null, cut: null, bound: null },
  { system: 'Polaris', size: 20, canvas: 20, basis: 'S',
    stroke: D(1.5, '1.5px outline', '§2.6'), circle: D(14, 'circle ⌀14', '§2.6'), square: D(13, 'square 13×13', '§2.6'),
    radius: D({ lo: 1, hi: 3 }, '1 to 3px depending on object roundness', '§2.6'), gap: D(1, '1px between strokes (outline and filled)', '§2.6'), cut: null,
    bound: D(16, '16×16 safe area (80%)', '§2.6', { kind: 'live' }) },
  { system: 'Spectrum 2 (web, primary)', size: 20, canvas: 20, basis: 'S',
    stroke: D(1.5, 'One stroke weight, 1.5px', '§2.7'), circle: null, square: null,
    radius: D(1.5, '1.5px rounding on all angles', '§2.7'), gap: null, cut: null, bound: D(18, '20 canvas with icon about 18', '§2.7', { kind: 'live' }) },
  { system: 'SLDS utility', size: 16, canvas: 16, basis: 'S',
    stroke: D(1, 'stroke 1, corner radius 1, negative space 1', '§2.8'), circle: D(16, 'circle ⌀24 or 16', '§2.8'), square: D(16, 'square 24×24 or 16×16', '§2.8'),
    radius: D(1, 'stroke 1, corner radius 1, negative space 1', '§2.8'), gap: D(1, 'stroke 1, corner radius 1, negative space 1', '§2.8'), cut: null,
    bound: D(16, 'circle ⌀24 or 16', '§2.8', { kind: 'keyline' }) },
  { system: 'SLDS utility', size: 24, canvas: 24, basis: 'S',
    stroke: D(2, 'stroke 2, radius 2, negative space 2', '§2.8'), circle: D(24, 'circle ⌀24 or 16', '§2.8'), square: D(24, 'square 24×24 or 16×16', '§2.8'),
    radius: D(2, 'stroke 2, radius 2, negative space 2', '§2.8'), gap: D(2, 'stroke 2, radius 2, negative space 2', '§2.8'), cut: null,
    bound: D(24, 'circle ⌀24 or 16', '§2.8', { kind: 'keyline' }) },
  { system: 'Phosphor regular (256 units = 16)', size: 16, canvas: 256, basis: 'F',
    stroke: D(16, 'Regular stroke 16 = 1px on the 16 grid', '§2.9'), circle: D(208, 'ink ⌀208', '§2.9'), square: D(192, 'ink 192', '§2.9'),
    radius: D(16, 'outer radius 16 = 6.25% of canvas', '§2.9'), gap: null, cut: null, bound: D(208, 'ink ⌀208', '§2.9', { kind: 'keyline' }) },
  { system: 'Lucide / Feather', size: 24, canvas: 24, basis: 'S; F',
    stroke: D(2, '2px, centred, round joins, round caps', '§2.10'), circle: D(22, 'circle r 10 on the centreline (ink ⌀22)', '§2.10'), square: D(20, 'square 18×18 at 3,3 with rx 2 (ink 20)', '§2.10'),
    radius: D(2, '2px for 90° corners', '§2.10'), gap: D(2, 'inner gaps at least 2px', '§2.10'), cut: null, bound: D(22, 'at most 22 of 24 (91.7%)', '§2.10', { kind: 'stated' }) },
  { system: 'Heroicons outline', size: 24, canvas: 24, basis: 'S; F',
    stroke: D(1.5, 'Outline 24×24 at 1.5px stroke', '§2.11'), circle: D(19.5, 'ink ⌀19.5', '§2.11'), square: null, radius: null, gap: null, cut: null, bound: D(19.5, 'ink ⌀19.5', '§2.11', { kind: 'keyline' }) },
  { system: 'Heroicons micro (solid)', size: 16, canvas: 16, basis: 'F',
    stroke: null, circle: D(14, 'micro: ⌀14 (87.5%)', '§2.11'), square: null, radius: null, gap: null, cut: null, bound: D(14, 'micro: ⌀14 (87.5%)', '§2.11', { kind: 'keyline' }) },
  { system: 'Radix', size: 15, canvas: 15, basis: 'F',
    stroke: D(1, 'Outlined fills with 1px lines', '§2.12'), circle: D(13.24, 'circle ink ⌀13.24', '§2.12'), square: D(13, 'Square 13×13', '§2.12'), radius: null, gap: null, cut: null,
    bound: D(13.24, 'circle ink ⌀13.24', '§2.12', { kind: 'keyline' }) },
  { system: 'Untitled UI (Line)', size: 24, canvas: 24, basis: 'M; F',
    stroke: D(2, '24×24 bounding box, 2px stroke', '§2.13'), circle: D(22, 'Circle r 10 on the centreline', '§2.13', { calc: '2*10+2' }), square: D(20, 'square 3 to 21 with radius 3', '§2.13', { calc: '(21-3)+2' }),
    radius: D(3, 'square 3 to 21 with radius 3', '§2.13'), gap: null, cut: null, bound: D(22, 'Circle r 10 on the centreline', '§2.13', { kind: 'keyline', calc: '2*10+2' }) },
  { system: 'Nucleo UI', size: 18, canvas: 18, basis: 'M',
    stroke: D(1.5, '18 grid, 16 live area (88.9%), 1.5px stroke', '§2.16'), circle: null, square: null, radius: null, gap: null, cut: null, bound: D(16, '18 grid, 16 live area (88.9%)', '§2.16', { kind: 'live' }) },
  { system: 'Nucleo Micro Bold', size: 20, canvas: 20, basis: 'M',
    stroke: D(2, '20 grid, 16 live area (80%), 2px stroke', '§2.16'), circle: null, square: null, radius: null, gap: null, cut: null, bound: D(16, '20 grid, 16 live area (80%)', '§2.16', { kind: 'live' }) },
  { system: 'Octicons', size: 16, canvas: 16, basis: 'S; F',
    stroke: D(1.5, '1.5px at both 16 and 24', '§2.17'), circle: D(16, '16: circles run full-bleed 16×16 (no margin)', '§2.17'), square: null,
    radius: D(1, '1px for corners', '§2.17'), gap: D(1, '1px between overlapping objects; 1.5px around modifier elements', '§2.17'), cut: null,
    bound: D(16, '16: circles run full-bleed 16×16 (no margin)', '§2.17', { kind: 'keyline' }) },
  { system: 'Octicons', size: 24, canvas: 24, basis: 'S; F',
    stroke: D(1.5, '1.5px at both 16 and 24', '§2.17'), circle: D(22, '24: circles 22 (1 to 23)', '§2.17'), square: null,
    radius: D(1, '1px for corners', '§2.17'), gap: D(1, '1px between overlapping objects; 1.5px around modifier elements', '§2.17'), cut: null,
    bound: D(22, '24: circles 22 (1 to 23)', '§2.17', { kind: 'keyline' }) },
  // ours (K): the masters file, the Settled table and the report's own K row for the proposed container radius
  { system: 'Mavan', size: 24, canvas: 24, basis: 'K',
    stroke: D(1.5, 'STROKES = { 24: 1.5, 20: 1.5, 16: 1.25 }', 'tools/masters.mjs:10'), circle: D(20, 'circle: [20, 20]', 'tools/masters.mjs:33'), square: D(18, 'square: [18, 18]', 'tools/masters.mjs:33'),
    radius: D(2.5, 'Mavan container (proposed) | 2.5/24 = 10.4%', '§3.4'), gap: D(1.5, 'MIN_GAP = 1.5', 'tools/masters.mjs:64'), cut: null, bound: D(20, 'circle: [20, 20]', 'tools/masters.mjs:33', { kind: 'keyline' }) },
  { system: 'Mavan', size: 20, canvas: 20, basis: 'K',
    stroke: D(1.5, 'STROKES = { 24: 1.5, 20: 1.5, 16: 1.25 }', 'tools/masters.mjs:10'), circle: D(16, 'circle: [16, 16]', 'tools/masters.mjs:38'), square: D(14, 'square: [14, 14]', 'tools/masters.mjs:38'),
    radius: null, gap: D(1.5, 'MIN_GAP = 1.5', 'tools/masters.mjs:64'), cut: null, bound: D(16, 'circle: [16, 16]', 'tools/masters.mjs:38', { kind: 'keyline' }) },
  { system: 'Mavan', size: 16, canvas: 16, basis: 'K',
    stroke: D(1.25, 'STROKES = { 24: 1.5, 20: 1.5, 16: 1.25 }', 'tools/masters.mjs:10'), circle: D(14, 'circle: [14, 14]', 'tools/masters.mjs:43'), square: D(12, 'square: [12, 12]', 'tools/masters.mjs:43'),
    radius: null, gap: D(1.5, 'MIN_GAP = 1.5', 'tools/masters.mjs:64'), cut: D(1.5, 'cut out of a filled shape holds 1.5 at 16', 'CLAUDE.md:93'), bound: D(14, 'circle: [14, 14]', 'tools/masters.mjs:43', { kind: 'keyline' }) },
];
export const CALIBRATION_KEYS = ['stroke', 'circle', 'square', 'radius', 'gap', 'cut', 'bound'];

export const share = (v, canvas) => (v == null ? null : (100 * v) / canvas);
export const strokes = (v, stroke) => (v == null || stroke == null ? null : v / stroke);
const pct = (x) => (x == null ? 'n/s' : `${x.toFixed(1)}%`);
const sw = (x) => (x == null ? 'n/s' : `${x.toFixed(2)}×`);
const isRange = (v) => v != null && typeof v === 'object' && 'lo' in v;

/** One normalised row: every length as a share of the canvas and as a multiple of the stroke; the
 *  margin is (canvas − bound) / 2. A range normalises end by end. */
export function normaliseRow(r) {
  const s = r.stroke?.v ?? null;
  const one = (v) => ({ v, share: share(v, r.canvas), strokes: strokes(v, s) });
  const cell = (d) => (d == null ? null : isRange(d.v) ? { range: [one(d.v.lo), one(d.v.hi)] } : one(d.v));
  const margin = r.bound == null ? null : one((r.canvas - r.bound.v) / 2);
  return { system: r.system, size: r.size, canvas: r.canvas, basis: r.basis, strokeShare: share(s, r.canvas),
    circle: cell(r.circle), square: cell(r.square), radius: cell(r.radius), gap: cell(r.gap), cut: cell(r.cut),
    bound: r.bound == null ? null : { ...one(r.bound.v), kind: r.bound.kind }, margin };
}

const fmtNum = (v) => (Number.isInteger(v) ? String(v) : String(+v.toFixed(3)));
const fmtCell = (c) => {
  if (c == null) return 'n/s';
  if (c.range) return `${fmtNum(c.range[0].v)}–${fmtNum(c.range[1].v)} (${pct(c.range[0].share)}–${pct(c.range[1].share)} · ${sw(c.range[0].strokes)}–${sw(c.range[1].strokes)})`;
  return `${fmtNum(c.v)} (${pct(c.share)} · ${sw(c.strokes)})`;
};

export const TABLE_HEADER = '| system | size | stroke ÷ canvas | circle keyline (share · strokes) | square keyline | corner radius | air floor | cut width | outer bound (kind; share · margin in strokes) | basis |';

export function normaliseTable(rows = CALIBRATION) {
  const lines = [TABLE_HEADER, '|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of rows) {
    const n = normaliseRow(r);
    const bound = n.bound == null ? 'n/s' : `${fmtNum(n.bound.v)} ${n.bound.kind} (${pct(n.bound.share)} · margin ${fmtNum(n.margin.v)} = ${sw(n.margin.strokes)})`;
    lines.push(`| ${n.system} | ${n.size} | ${n.strokeShare == null ? 'n/s' : pct(n.strokeShare)} | ${fmtCell(n.circle)} | ${fmtCell(n.square)} | ${fmtCell(n.radius)} | ${fmtCell(n.gap)} | ${fmtCell(n.cut)} | ${bound} | ${n.basis} |`);
  }
  return lines.join('\n');
}

const numbersIn = (s) => [...String(s).matchAll(/\d+(?:\.\d+)?/g)].map((m) => +m[0]);
const near = (a, b) => Math.abs(a - b) < 1e-9;

/** A value is backed by its snippet when it is one of the numbers written there, or when `calc`
 *  (arithmetic on those numbers and the row's own stroke) produces it. */
export function valueBacked(d, say, strokeV = null) {
  const nums = numbersIn(say);
  const ok = (v) => nums.some((n) => near(n, v));
  if (isRange(d.v)) return ok(d.v.lo) && ok(d.v.hi);
  if (d.calc != null) {
    if (!/^[\d+\-*/(). ]+$/.test(d.calc)) return false;
    const used = numbersIn(d.calc);
    if (!used.every((n) => ok(n) || (strokeV != null && near(n, strokeV)))) return false;
    let got; try { got = Function(`"use strict"; return (${d.calc});`)(); } catch { return false; }
    return near(got, d.v);
  }
  return ok(d.v);
}

/** The text a `say` must be found in: a construction-report section (`§2.5`) or a repo line
 *  (`references-fluent.md:118` — a bare name is looked up under docs/audit first, then from the
 *  repo root; a path with a slash from the repo root). */
export function sourceText(at, anchors, repo) {
  const m = at.match(/^([^:§]+):(\d+)$/);
  if (!m) return anchors.get(at) ?? null;
  const candidates = m[1].includes('/') ? [join(repo, m[1])] : [join(repo, 'docs', 'audit', m[1]), join(repo, m[1])];
  const p = candidates.find((c) => existsSync(c));
  if (!p) return null;
  return readFileSync(p, 'utf8').split('\n')[+m[2] - 1] ?? null;
}

/** Every `say` must be found in its source and every value must be backed by its `say`. */
export function checkTranscription(constructionText, rows = CALIBRATION, repo = REPO) {
  const a = constructionAnchors(constructionText);
  const bad = [];
  for (const r of rows) for (const key of CALIBRATION_KEYS) {
    const d = r[key];
    if (!d) continue;
    if (d.say == null) { bad.push(`${r.system} ${r.size} ${key}: no source snippet`); continue; }
    const src = sourceText(d.at, a, repo);
    if (!src || !unsmart(src).includes(unsmart(d.say))) bad.push(`${r.system} ${r.size} ${key}: "${d.say}" not found in ${d.at}`);
    if (!valueBacked(d, d.say, r.stroke?.v ?? null)) bad.push(`${r.system} ${r.size} ${key}: value ${JSON.stringify(d.v)} is not among the numbers in "${d.say}"`);
  }
  return bad;
}

// ── check ───────────────────────────────────────────────────────────────────────────────────
export function readReports(sourcesDir, { verifyHash = true } = {}) {
  const out = [];
  for (const r of REPORTS) {
    const p = join(sourcesDir, r.file);
    if (!existsSync(p)) throw new Error(`missing report: ${p}`);
    const text = readFileSync(p, 'utf8');
    const hash = sha256(text);
    if (verifyHash && hash !== r.sha256) throw new Error(`${r.file}: sha256 ${hash} is not the recorded ${r.sha256}`);
    out.push({ ...r, text, hash });
  }
  return out;
}

export function checkDocument({ doc, reports, evidenceDir = null, transcription = true }) {
  const praise = reports.find((r) => r.kind === 'praise');
  const construction = reports.find((r) => r.kind === 'construction');
  const anchors = { praise: praiseAnchors(praise.text), construction: constructionAnchors(construction.text) };
  const problems = [];
  const cited = citedAnchors(doc);
  const seen = new Set();
  for (const c of cited) {
    const key = `${c.report} ${c.anchor}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!anchors[c.report].has(c.anchor)) problems.push(`anchor not in the ${c.report} report: ${c.raw} (${c.anchor})`);
  }
  const evidenceFiles = evidenceDir ? textFilesUnder(evidenceDir) : [];
  const quotes = quotedStrings(doc);
  const spans = reportQuotedSpans(reports);
  const cache = new Map();
  const where = [];
  for (const q of quotes) {
    const words = wordCount(q);
    if (words > 15) problems.push(`quote over 15 words: "${q}"`);
    const f = findQuote(q, reports, evidenceFiles, cache);
    if (!f) { problems.push(`quote not found in the reports${evidenceDir ? ' or the evidence' : ''}: "${q}"`); continue; }
    const thirdParty = isThirdParty(q, f, spans);
    if (thirdParty && words >= QUOTE_WORD_CAP) problems.push(`third-party quotation of ${words} words (cap ${QUOTE_WORD_CAP - 1}; paraphrase it): "${q}"`);
    where.push({ quote: q, file: f, words, thirdParty });
  }
  const distinct = new Set(where.map((w) => unsmart(w.quote).toLowerCase()));
  const quoteStats = {
    total: where.length, distinct: distinct.size, thirdParty: where.filter((w) => w.thirdParty).length,
    atOrOverCap: where.filter((w) => w.words >= QUOTE_WORD_CAP).length, longest: where.reduce((m, w) => Math.max(m, w.words), 0),
  };
  // the calibration rows transcribe the recorded construction report; against any other text the
  // guard says nothing, so it runs only when the reports are the recorded ones
  const transcriptionProblems = transcription ? checkTranscription(construction.text) : null;
  if (transcriptionProblems) problems.push(...transcriptionProblems);
  return { problems, anchorsCited: seen.size, quotes: where, quoteStats, transcription: transcriptionProblems, counts: { praise: failureModes(praise.text), construction: constructionCounts(construction.text) } };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────
const flag = (args, name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

function main(argv) {
  const [cmd, ...rest] = argv;
  const args = rest.filter((a, i) => !(a.startsWith('--') || (i > 0 && rest[i - 1].startsWith('--') && rest[i - 1] !== '--no-hash')));
  const verifyHash = !rest.includes('--no-hash');
  if (cmd === 'extract') {
    const outDir = args[0];
    if (!outDir) { console.error('usage: field-sources.mjs extract <out-dir> [--projects <dir>] [--session <id>] [--no-hash]'); return 2; }
    const results = extractReports({ outDir, projectsDir: flag(rest, '--projects') ?? defaultProjectsDir(), session: flag(rest, '--session') ?? SESSION, verifyHash });
    for (const r of results) console.log(`${r.file}: ${r.chars} chars from agent ${r.agent} (${r.calls} handback call${r.calls === 1 ? '' : 's'}, the last taken) sha256 ${r.sha256}${r.verified === null ? '' : r.verified ? ' ✓ matches the recorded hash' : ' ✗'}`);
    return 0;
  }
  if (cmd === 'check') {
    const [docPath, sourcesDir] = args;
    if (!docPath || !sourcesDir) { console.error('usage: field-sources.mjs check <doc> <sources-dir> [--evidence <dir>] [--no-hash]'); return 2; }
    const reports = readReports(sourcesDir, { verifyHash });
    for (const r of reports) console.log(`${r.file}: ${r.text.length} chars, sha256 ${r.hash}${verifyHash ? ' ✓' : ' (hash not checked)'}`);
    const evidenceDir = flag(rest, '--evidence') ?? null;
    const res = checkDocument({ doc: readFileSync(docPath, 'utf8'), reports, evidenceDir, transcription: verifyHash });
    console.log(`\n## anchors: ${res.anchorsCited} distinct cited`);
    const qs = res.quoteStats;
    console.log(`## quotes: ${qs.total} found verbatim (${qs.distinct} distinct) · third-party ${qs.thirdParty} · ${QUOTE_WORD_CAP}+ words ${qs.atOrOverCap} · longest ${qs.longest} words`);
    for (const q of res.quotes) console.log(`  ${String(q.words).padStart(2)}w ${q.thirdParty ? 'third-party' : 'report     '} "${q.quote}" — ${basename(q.file)}`);
    const fm = res.counts.praise;
    console.log(`\n## praise C2, as the report states it: n=${fm.total?.n} (HN ${fm.total?.hn}; designers and trackers ${fm.total?.designers})`);
    for (const m of fm.modes) console.log(`  ${m.rank}. ${m.label}: ${m.n}${m.hn != null ? ` [HN ${m.hn}, designers ${m.designers}]` : ''}`);
    if (evidenceDir) {
      const py = textFilesUnder(evidenceDir, ['tally3.py']).find((f) => basename(f) === 'tally3.py');
      if (py) {
        const t = recountTally(readFileSync(py, 'utf8'));
        console.log(`\n## praise C2, recounted from ${py}: rows ${t.rows} = independent ${t.independent} + vendor ${t.vendor}`);
        console.log(`  independent: ${t.P.map(([c, n]) => `${c} ${n}`).join(' · ')}`);
        console.log(`  vendor:      ${t.V.map(([c, n]) => `${c} ${n}`).join(' · ')}`);
      } else console.log('\n## praise C2 recount: tally3.py not found under the evidence dir');
    }
    const cc = res.counts.construction;
    console.log(`\n## construction report counts: systems ${cc.systems} · stroke at 16 stated as 1.0 by ${cc.strokesAt16['1.0'] ?? 0}, as 1.5 by ${cc.strokesAt16['1.5'] ?? 0} · multi-size policy rows ${cc.multiSizeRows}, of which one drawing per concept ${cc.oneDrawingPerConcept} (plus ${cc.oneTopologyWithAxes} one topology with axes) · live-area rows ${cc.liveAreaRows} · contradiction topics ${cc.contradictionTopics} · filled-twin systems in the §1.7 table ${cc.filledTwinSystems}`);
    const cells = CALIBRATION.reduce((n, r) => n + CALIBRATION_KEYS.filter((k) => r[k]).length, 0);
    console.log('\n## calibration transcription: ' + (res.transcription === null ? 'skipped — the reports are not the recorded ones (--no-hash)' : res.transcription.length ? 'FAIL' : `every embedded value (${CALIBRATION.length} rows, ${cells} cells) is among the numbers of its snippet, and every snippet is in its source`));
    if (res.problems.length) { console.log('\n## PROBLEMS'); for (const p of res.problems) console.log('  ✗ ' + p); return 1; }
    console.log('\n## OK — every anchor exists and every quote is verbatim');
    return 0;
  }
  if (cmd === 'normalise') { console.log(normaliseTable()); return 0; }
  console.error('usage: field-sources.mjs extract <out-dir> | check <doc> <sources-dir> [--evidence <dir>] | normalise');
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exit(main(process.argv.slice(2))); } catch (e) { console.error('✗ ' + e.message); process.exit(1); }
}
