#!/usr/bin/env node
// REGISTER PROBE — every measured figure in docs/audit/rule-register.md (card 1.14), printed again
// from the pinned tree. AUDIT ONLY — imported by nothing in lint, build, queue or the lab; it reads
// the pin (and, read-only, this repo's git history and research/references) and writes nothing.
//
// This file is also the SHARED CORE of the four register probes of the "reprint" repair card:
// `enforcement-probe.mjs` (card 1.15), `stale-probe.mjs` (card 1.16) and `severity-probe.mjs`
// (card 3.5) import their measurements from here, so one figure is computed one way in all four.
//
// Usage:
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   node tools/audit/register-probe.mjs $P [section …] [--repo DIR] [--refs DIR]
// --repo  the git repository whose history the `frame` section reads (default: this repo). Read-only:
//         rev-list, ls-tree, cat-file. The pin itself has no .git.
// --refs  research/references (gitignored, on this machine); unused by this document, accepted so
//         the four probes share one command line.
//
// Sections, in the document's order (rule-register.md):
//   census   header L10-17   the note census: files / concepts per note, co-occurrence, the 212 / 273
//   frame    §"two facts"     the first commit, the composition table at four decision days, the stress batch
//   A        §A               three masters, 1,455 pairs, 0 missing twins
//   B        §B + conflicts   keyline classes, box / anchor / optical counts, C14's scaling test, centring bands
//   C        §C + conflicts   files at the outline weight, line-heavy vs light, the pair-box census
//   D        §D + conflicts   off-grid drawings and values, comments on every file
//   E        §E + conflicts   radius vocabulary (radii.mjs), the two container tests, angles (angles.mjs),
//                             the filled contour's angle on trash and code
//   F        §F + F1 + conflicts  the gap warnings, file-text-2, F3/F4 notes, parallel stacks, the punched cuts
//   G        §G + G7          files without tags, identical outlines
//   I        §I + "what this card adds"  the sort family's notes, the numeral what-if, docs/09 deltas, the sheet
//
// Instruments: tools/audit/notes.mjs (notes and off-grid, lint's own regexes), radii.mjs (corners),
// angles.mjs (segments), congruence.mjs (`canonical`), raster.mjs (pixel coverage); tools/geometry.mjs
// and tools/masters.mjs. LINT IS THE PIN'S OWN `tools/lint.mjs`, imported by path and run in memory:
// `lintSource` per file, then `checkFamilies` / `checkPairs` / `checkAnchors`, exactly as its `run()`
// does — so "what lint prints" is a fact about the pin's lint, and subsets (no 16 master, one file)
// can be run without writing a tree. Lint's import does nothing (its run() is guarded on argv[1]).
//
// Known defects worked around (plans/set-and-rules-audit.md, "Known instrument defects"):
//  · raster.mjs `classify` drops an area path's horizontal edges and reuses that list for its
//    box-uniformity shortcut, so `rasterise` can return 0.00 where the truth is 0.50. The punched-cut
//    pixel counts (F8) are on shape-filled files, so `clearPixels` replaces `classify` with one that
//    always answers "sample it" (`sampleEverything`); `covered()` itself reads every edge correctly.
//    The original card used `rasterise` unpatched; both readings are printed.
//  · congruence.mjs `congruentUpToTranslation` misreads a reversed ring; G7 uses `canonical().key`.
//  · geometry.mjs `bbox()` samples arcs; every box here is lint's own (the figure is lint's reading).
//  · build.mjs:43 rounds x and w separately; no published box edge is compared here.
//
// Run time, each section alone, wall clock (node 24.20, 2026-10-08, other agents loading the machine):
// census 19.7 s · frame 0.4 s · A 19.1 s · B 19.1 s · C 18.8 s · D 0.3 s · E 0.4 s · F 20.1 s · G 0.4 s ·
// I 50.7 s (a load spike; it does the same work as F). A section that reads lint pays the in-memory lint
// run of the 2,910 drawings once per process (≈ 19 s); all sections together 21.4 s.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { extractSet } from './notes.mjs';
import { census as radiusCensusOf, radiiOf } from './radii.mjs';
import { census as angleCensusOf, anglesOf, segmentsOf, piecesOf, iconFromSource } from './angles.mjs';
import { canonical } from './congruence.mjs';
import { regionOf, rasterise, iconFromText } from './raster.mjs';
import { samplePath, selfGap, facingGap } from '../geometry.mjs';
import { STROKES, FILLED_WEIGHT, strokeOf, weightOf } from '../masters.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, '..', '..');
export const PIN_COMMIT = '5933041';
export const MASTER_LIST = [24, 20, 16];

// ── formatting ─────────────────────────────────────────────────────────────

export const n = (x) => (typeof x === 'number' ? x.toLocaleString('en-US') : String(x));
export const r2 = (x) => Math.round(x * 100) / 100;
export const r3 = (x) => Math.round(x * 1000) / 1000;
export const pct = (a, b, dp = 1) => `${((100 * a) / b).toFixed(dp)}%`;
export const fmt = (x, dp = 2) => (Number.isFinite(x) ? String(Math.round(x * 10 ** dp) / 10 ** dp) : String(x));
export const fix = (x, dp = 2) => (Number.isFinite(x) ? x.toFixed(dp) : String(x));
/** A radius or length as the documents write it: at least one decimal (1.0, 0.75, 1.25). */
export const dec = (x) => { if (!Number.isFinite(x)) return String(x); const s = String(r3(x)); return s.includes('.') ? s : `${s}.0`; };
const uniq = (xs) => [...new Set(xs)];
const tick = (xs) => xs.map((x) => `\`${x}\``).join(', ');
const AREA = /<path fill="currentColor" fill-rule="evenodd" stroke="none" d="([^"]+)"\/>/g;   // lint.mjs:40

// ── the pin ────────────────────────────────────────────────────────────────

/** Every drawing under `<pin>/src/icons/<master>/`, masters largest first, files sorted — the
 *  order lint's run() walks them in. Reads text only. */
export function loadSet(pin, masters = MASTER_LIST) {
  const files = [];
  for (const m of masters) {
    const dir = join(pin, 'src/icons', String(m));
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()) {
      const name = file.slice(0, -4);
      files.push({ m, file, name, concept: name.replace(/-filled$/, ''), filled: /-filled$/.test(name),
        path: join(dir, file), src: readFileSync(join(dir, file), 'utf8') });
    }
  }
  const byKey = new Map(files.map((r) => [`${r.m}/${r.name}`, r]));
  const conceptsAt = (m) => uniq(files.filter((r) => r.m === m && !r.filled).map((r) => r.name)).sort();
  return { pin, files, byKey, concepts: conceptsAt(masters[0] ?? 24), conceptsAt };
}

/** Body paths as lint reads them (lint.mjs:207, 277-283): areas only from a -filled file. */
export function bodyOf(src, filled) {
  const areas = filled ? [...src.matchAll(AREA)].map((m) => m[1]) : [];
  const root = src.match(/<svg\b[^>]*>/);
  const body = (root ? src.slice(root.index + root[0].length) : src).replace(/<!--[\s\S]*?-->/g, '').replace(AREA, '');
  const ds = [...body.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  return { ds, areas };
}

export const rootWidth = (src) => Number(src.match(/<svg\b[^>]*>/)?.[0].match(/stroke-width="([^"]+)"/)?.[1]);

// ── the pin's own lint, in memory ──────────────────────────────────────────

const lintModules = new Map();
export async function lintModule(pin) {
  if (!lintModules.has(pin)) lintModules.set(pin, await import(pathToFileURL(join(pin, 'tools/lint.mjs')).href));
  return lintModules.get(pin);
}

const ANSI = { G: '\x1b[32m', Y: '\x1b[33m', R: '\x1b[31m', D: '\x1b[2m', X: '\x1b[0m' };

/** lint's run() (lint.mjs:622-652) on a list of jobs `{ m, file, src }`, in memory. `perFile` may
 *  hand in already-computed `lintSource` results (they do not depend on other files); they are
 *  cloned, because the directory checks write into them. Returns the results map, the lines the
 *  run would print (with its colour codes), the summary and the exit code it would return. */
export function runLint(L, jobs, perFile = null) {
  const results = new Map(jobs.map((j) => {
    const key = `${j.m}/${j.file}`;
    return [key, perFile?.has(key) ? structuredClone(perFile.get(key)) : L.lintSource(j.m, j.file, j.src)];
  }));
  L.checkFamilies(results); L.checkPairs(results); L.checkAnchors(results);
  const { G, Y, R, D, X } = ANSI;
  const lines = [];
  let bad = 0, warned = 0;
  for (const j of jobs) {
    const { errors, warnings, notes } = results.get(`${j.m}/${j.file}`);
    const mark = errors.length ? `${R}✗${X}` : warnings.length ? `${Y}!${X}` : `${G}✓${X}`;
    lines.push(`${mark} ${String(j.m).padStart(2)} ${j.file.replace('.svg', '').padEnd(16)} ${D}${notes[notes.length - 1] ?? ''}${X}`);
    notes.slice(0, -1).forEach((x) => lines.push(`    ${D}· ${x}${X}`));
    warnings.forEach((w) => lines.push(`    ${Y}warn  ${w}${X}`));
    errors.forEach((e) => lines.push(`    ${R}error ${e}${X}`));
    if (errors.length) bad++; else if (warnings.length) warned++;
  }
  lines.push(`\n${jobs.length} drawings · ${G}${jobs.length - bad - warned} clean${X} · ${Y}${warned} warned${X} · ${R}${bad} failed${X}`);
  const summary = { drawings: jobs.length, clean: jobs.length - bad - warned, warned, failed: bad };
  return { results, lines, summary, exit: bad ? 1 : 0,
    bytes: lines.reduce((s, l) => s + Buffer.byteLength(l, 'utf8') + 1, 0) };
}

export const summaryLine = (s) => `${n(s.drawings)} drawings · ${n(s.clean)} clean · ${n(s.warned)} warned · ${n(s.failed)} failed`;
export const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

/** The headline note a drawing's line carries (lint.mjs:337, 348, 353). */
export function parseHeadline(note) {
  const m = note?.match(/^(\S+)×(\S+)\s+(.*?)\s+centre (\S+),(\S+)$/);
  if (!m) return null;
  const [, w, h, what, cx, cy] = m;
  const kind = /^declared mark/.test(what) ? 'mark' : /^agreed box/.test(what) ? 'box'
    : /^anchored to/.test(what) ? 'anchored' : /^fits (\w+) keyline/.test(what) ? what.match(/^fits (\w+)/)[1]
      : /^no keyline match/.test(what) ? 'none' : 'other';
  return { w: Number(w), h: Number(h), kind, cx: Number(cx), cy: Number(cy), what };
}

/** Centring after the declared shift, as the original census read lint's headlines:
 *  d = max(|cx − mid|, |cy − mid|) on every drawing that is not anchored. */
export function centringBands(rows) {
  const ds = rows.filter((r) => r.kind !== 'anchored').map((r) => ({ ...r, d: Math.max(Math.abs(r.cx - r.mid), Math.abs(r.cy - r.mid)) }));
  return { total: ds.length, over001: ds.filter((r) => r.d > 0.01).length, over010: ds.filter((r) => r.d > 0.1).length,
    over025: ds.filter((r) => r.d > 0.25).length, at050: ds.filter((r) => r.d >= 0.5).length, over050: ds.filter((r) => r.d > 0.5).length,
    worst: ds.filter((r) => r.d >= 0.5) };
}

// ── memoised context: one pin, everything the sections share ───────────────

export class Ctx {
  constructor(pin, { repo = REPO, refs = join(REPO, 'research/references') } = {}) {
    this.pin = pin; this.repo = repo; this.refs = refs; this.memo = new Map();
  }
  once(key, fn) { if (!this.memo.has(key)) this.memo.set(key, fn()); return this.memo.get(key); }
  get set() { return this.once('set', () => loadSet(this.pin)); }
  get notes() { return this.once('notes', () => extractSet(join(this.pin, 'src/icons'))); }
  get metrics() { return this.once('metrics', () => JSON.parse(readFileSync(join(this.pin, 'dist/metrics.json'), 'utf8'))); }
  get manifest() { return this.once('manifest', () => JSON.parse(readFileSync(join(this.pin, 'lab/manifest.json'), 'utf8'))); }
  text(rel) { return readFileSync(join(this.pin, rel), 'utf8'); }
  has(rel) { return existsSync(join(this.pin, rel)); }
  git(args, { allowFail = false } = {}) {
    const r = spawnSync('git', ['-C', this.repo, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });
    if (r.status !== 0 && !allowFail) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
    return r.status === 0 ? r.stdout : null;
  }
  /** Many blobs in one `git cat-file --batch` process: specs are `<rev>:<path>`. */
  gitBlobs(specs) {
    if (!specs.length) return [];
    const r = spawnSync('git', ['-C', this.repo, 'cat-file', '--batch'], { input: specs.join('\n') + '\n', maxBuffer: 1 << 30 });
    const buf = r.stdout, out = [];
    let i = 0;
    for (let k = 0; k < specs.length; k++) {
      const nl = buf.indexOf(10, i);
      const head = buf.slice(i, nl).toString('utf8');   // "<sha> blob <size>" or "<spec> missing"
      if (/ missing$/.test(head)) { out.push(null); i = nl + 1; continue; }
      const size = Number(head.split(' ')[2]);
      out.push(buf.slice(nl + 1, nl + 1 + size).toString('utf8'));
      i = nl + 1 + size + 1;
    }
    return out;
  }
  /** The pin's lint over the whole set (the run every lint figure reads). */
  async lint() {
    return this.once('lint', async () => {
      const L = await lintModule(this.pin);
      const jobs = this.set.files.map((f) => ({ m: f.m, file: f.file, src: f.src }));
      const perFile = new Map(jobs.map((j) => [`${j.m}/${j.file}`, L.lintSource(j.m, j.file, j.src)]));
      const run = runLint(L, jobs, perFile);
      return { ...run, L, jobs, perFile };
    });
  }
  /** Lint's reading of every drawing: headline, warnings, notes, errors, ink. */
  async readings() {
    return this.once('readings', async () => {
      const { results } = await this.lint();
      return this.set.files.map((f) => {
        const r = results.get(`${f.m}/${f.file}`);
        const head = parseHeadline(r.notes[r.notes.length - 1]);
        return { ...f, r, head, kind: head?.kind ?? null, cx: head?.cx, cy: head?.cy, w: head?.w, h: head?.h, mid: f.m / 2 };
      });
    });
  }
}

// ── note census (notes.mjs, lint's own note regexes) ───────────────────────

const NOTE_ORDER = ['tags', 'keyline', 'box', 'optical', 'glyph', 'grows', 'anchor', 'gap'];

/** Per note key: files and concepts carrying it (lint reads the first note of each key). */
export function noteCensus(records) {
  const by = {};
  for (const k of NOTE_ORDER) {
    const has = records.filter((r) => r.notes[k] && (k !== 'keyline' || r.notes[k].parsed?.word === 'mark'));
    by[k] = { files: has.length, concepts: uniq(has.map((r) => r.concept)).length, list: uniq(has.map((r) => r.concept)).sort() };
  }
  const glyph = (kind) => records.filter((r) => r.notes.glyph?.value === kind);
  by.glyphDot = { files: glyph('dot').length, concepts: uniq(glyph('dot').map((r) => r.concept)).length };
  by.glyphNumeral = { files: glyph('numeral').length, conceptList: uniq(glyph('numeral').map((r) => r.concept)).sort() };
  const nonTag = (r) => (r.notes.keyline?.parsed?.word === 'mark') || ['box', 'anchor', 'optical', 'glyph', 'grows', 'gap'].some((k) => r.notes[k]);
  const concepts = uniq(records.map((r) => r.concept));
  const withNote = new Set(records.filter(nonTag).map((r) => r.concept));
  by.anyNonTag = { concepts: withNote.size, none: concepts.length - withNote.size, of: concepts.length };
  // co-occurrence on the SAME FILE, counted in concepts (d20's reading)
  const has = (r, k) => (k === 'mark' ? r.notes.keyline?.parsed?.word === 'mark' : k === 'dot' ? r.notes.glyph?.value === 'dot' : !!r.notes[k]);
  const co = (...ks) => uniq(records.filter((r) => ks.every((k) => has(r, k))).map((r) => r.concept));
  by.co = { markOptical: co('mark', 'optical'), markGrows: co('mark', 'grows'), boxOpticalDot: co('box', 'optical', 'dot'),
    boxGap: co('box', 'gap'), markBox: co('mark', 'box'), markAnchor: co('mark', 'anchor'), boxAnchor: co('box', 'anchor') };
  return by;
}

// ── the composition of the set on a given day (git, read-only) ─────────────

/** One day's 24 outline files → concepts, `keyline: mark`, `box:` and the rest (held to a keyline).
 *  The original: `case "$s" in *'keyline: mark'*)` and `*'<!-- box:'*`; held = concepts − mark − box. */
export function compositionOf(texts) {
  const mark = texts.filter((s) => s.includes('keyline: mark')).length;
  const box = texts.filter((s) => s.includes('<!-- box:')).length;
  return { concepts: texts.length, mark, box, held: texts.length - mark - box };
}

export function compositionAt(ctx, day, tip = PIN_COMMIT) {
  const c = ctx.git(['rev-list', '-1', `--before=${day} 23:59:59`, tip]).trim();
  if (!c) return { day, commit: null };
  const paths = ctx.git(['ls-tree', '-r', '--name-only', c, '--', 'src/icons/24']).split('\n')
    .filter((p) => p.endsWith('.svg') && !p.endsWith('-filled.svg'));
  const texts = ctx.gitBlobs(paths.map((p) => `${c}:${p}`));
  return { day, commit: c.slice(0, 7), ...compositionOf(texts) };
}

// ── radii (radii.mjs) ──────────────────────────────────────────────────────

/** Agent D's bucket (b5b.mjs): a radius within 0.02 of a quarter unit reads as that quarter. */
export const QUARTER_TOL = 0.02;
export function quarterOf(x, tol = QUARTER_TOL) { const q = Math.round(x * 4) / 4; return Math.abs(x - q) <= tol ? q : null; }
export const radiusKey = (c) => (c.kind === 'sharp' ? 0 : quarterOf(c.radius) ?? r3(c.radius));

/** The radius vocabulary of a set of stroke corners: counts per quarter bucket, off-quarter values. */
export function radiusVocabulary(corners) {
  const on = {}, off = {};
  for (const c of corners) {
    if (c.kind === 'sharp') { on[0] = (on[0] ?? 0) + 1; continue; }
    const q = quarterOf(c.radius);
    if (q !== null) on[q] = (on[q] ?? 0) + 1;
    else (off[c.radius.toFixed(3)] ??= []).push(c.name);
  }
  return { total: corners.length, on, off };
}

/** b5d.mjs, the strict container test: the largest closed subpath is 4 convex, axis-aligned ~90°
 *  corners covering at least 60% of the ink box on both axes. Radii in quarter buckets. */
export function strictContainer(rec) {
  const g = {};
  for (const c of rec.corners) (g[`${c.path}.${c.sub}`] ??= []).push(c);
  let best = null;
  for (const cs of Object.values(g)) {
    const si = cs[0].subInfo; if (!si.closed) continue;
    const a = (si.bbox.x1 - si.bbox.x0) * (si.bbox.y1 - si.bbox.y0);
    if (!best || a > best.a) best = { cs, a, si };
  }
  if (!best) return null;
  const { cs, si } = best;
  const inkW = rec.ink.x1 - rec.ink.x0, inkH = rec.ink.y1 - rec.ink.y0;
  const bigEnough = (si.bbox.x1 - si.bbox.x0) >= 0.6 * inkW && (si.bbox.y1 - si.bbox.y0) >= 0.6 * inkH;
  const four = cs.length === 4 && cs.every((c) => Math.abs(Math.abs(c.turn) - 90) < 1 && c.convex);
  if (!(bigEnough && four)) return null;
  const vs = cs.map((c) => c.at), xs = vs.map((v) => v[0]), ys = vs.map((v) => v[1]);
  const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  let a2 = 0; for (let i = 0; i < 4; i++) { const [x1, y1] = vs[i], [x2, y2] = vs[(i + 1) % 4]; a2 += x1 * y2 - x2 * y1; }
  if (Math.abs(Math.abs(a2 / 2) - bw * bh) >= 0.05) return null;
  return { name: rec.name, radii: cs.map((c) => (c.kind === 'sharp' ? 0 : quarterOf(c.radius) ?? r3(c.radius))) };
}

export function strictContainers(recs) {
  const rows = recs.map(strictContainer).filter(Boolean);
  const uniform = rows.filter((r) => new Set(r.radii).size === 1), mixed = rows.filter((r) => new Set(r.radii).size > 1);
  const byR = {};
  for (const r of uniform) (byR[r.radii[0]] ??= []).push(r.name);
  return { rows, uniform, mixed, byR };
}

/** b5e.mjs, the looser test: radii.mjs's own `container` role, corners within 6° of a right angle. */
export function looseContainers(recs) {
  const byR = {};
  for (const rec of recs) for (const c of rec.corners) {
    if (c.role !== 'container' || Math.abs(Math.abs(c.turn) - 90) > 6) continue;
    const k = c.kind === 'sharp' ? 0 : quarterOf(c.radius) ?? r3(c.radius);
    (byR[k] ??= { corners: 0, names: new Set() }); byR[k].corners++; byR[k].names.add(rec.name);
  }
  return byR;
}

/** b5g.mjs: concepts carrying a radius within 0.02 of `r`, with how many such corners each has. */
export function conceptsAtRadius(corners, r) {
  const s = {};
  for (const c of corners) if (c.kind !== 'sharp' && c.radius >= r - 0.02 && c.radius <= r + 0.02) s[c.name] = (s[c.name] ?? 0) + 1;
  return s;
}

/** The modal container radius (strict test's convex ~90° container corners) of one drawing. */
export function containerRadiusOf(rec, style = 'stroke') {
  const cs = rec.corners.filter((c) => c.role === 'container' && c.convex && c.kind === 'arc' && Math.abs(Math.abs(c.turn) - 90) < 6 && c.style === style);
  const f = {};
  for (const c of cs) { const k = r3(c.radius); f[k] = (f[k] ?? 0) + 1; }
  const e = Object.entries(f).sort((a, b) => b[1] - a[1]);
  return e.length ? Number(e[0][0]) : null;
}

// ── angles (angles.mjs) ────────────────────────────────────────────────────

/** b6.mjs: a default has no number and no size word. */
export const isDefault = (name) => !/-\d+(-|$)/.test(name) && !/-(large|small)$/.test(name);

/** The angle grants a default can lean on: a name in backticks on docs/07:77-78 (the exceptions list),
 *  plus docs/09:25's two named default exceptions, `trash` and `code` (cited). Hand-counted in the
 *  original ("roughly seventeen"); this is that count made mechanical. */
export function ungranted(docs07, names) {
  const grants = docs07.split('\n').slice(76, 78).join('\n');
  return names.filter((x) => !['trash', 'code'].includes(x) && !grants.includes(`\`${x}\``));
}

// ── parallel stacks (agent D's b7.mjs) ─────────────────────────────────────

export const STACK = { minLength: 2, angleTol: 2, distinct: 0.5 };
const circDiff = (a, b) => { const d = Math.abs(a - b) % 180; return Math.min(d, 180 - d); };

/** The largest stack of parallel straight segments one cross-section meets, in one outline drawing.
 *  Segments ≥ minLength, clustered within angleTol of a seed, deduplicated by perpendicular offset. */
export function parallelStack(icon, { minLength = STACK.minLength, angleTol = STACK.angleTol, distinct = STACK.distinct } = {}) {
  const segs = [];
  for (const p of icon.paths) {
    if (p.style !== 'stroke') continue;
    const { subs } = piecesOf(p.d);
    for (const s of segmentsOf(p.d, { minLength })) segs.push({ ...s, path: p.index, subClosed: subs[s.sub]?.closed ?? false });
  }
  segs.sort((a, b) => a.angle - b.angle);
  const clusters = [];
  for (const s of segs) {
    let c = clusters.find((c) => circDiff(c.seed, s.angle) <= angleTol);
    if (!c) { c = { seed: s.angle, segs: [] }; clusters.push(c); }
    c.segs.push(s);
  }
  let best = { n: 0, members: [], angle: null };
  for (const c of clusters) {
    if (c.segs.length < 4) { if (c.segs.length > best.n) best = { n: c.segs.length, members: c.segs, angle: c.seed }; continue; }
    const th = (c.seed * Math.PI) / 180, ux = Math.cos(th), uy = -Math.sin(th), nx = -uy, ny = ux;
    const items = c.segs.map((s) => {
      const a0 = s.from[0] * ux + s.from[1] * uy, a1 = s.to[0] * ux + s.to[1] * uy;
      return { lo: Math.min(a0, a1), hi: Math.max(a0, a1), perp: (s.from[0] * nx + s.from[1] * ny + s.to[0] * nx + s.to[1] * ny) / 2, s };
    });
    const pts = uniq(items.flatMap((i) => [i.lo, i.hi])).sort((a, b) => a - b);
    const probes = [];
    for (let i = 0; i < pts.length; i++) { probes.push(pts[i]); if (i + 1 < pts.length) probes.push((pts[i] + pts[i + 1]) / 2); }
    for (const x of probes) {
      const cover = items.filter((i) => i.lo - 1e-6 <= x && x <= i.hi + 1e-6).sort((a, b) => a.perp - b.perp);
      const kept = [];
      for (const i of cover) if (!kept.length || i.perp - kept.at(-1).perp >= distinct) kept.push(i);
      if (kept.length > best.n) best = { n: kept.length, members: kept.map((d) => d.s), angle: c.seed };
    }
  }
  const walls = best.members.filter((s) => s.subClosed).length;
  return { name: icon.name, max: best.n, walls, open: best.members.length - walls,
    subpaths: new Set(best.members.map((s) => `${s.path}.${s.sub}`)).size };
}

/** "Pure line run", read as rule-register.md:268 uses it (it puts chart-bar-3's L among the "open
 *  strokes"): the stack counted only over whole subpaths that are ONE straight segment (M then one
 *  L/H/V), at least `minLength` long. `parallelStack` with every other segment dropped. */
export function pureLineStack(icon, opts = {}) {
  const keep = icon.paths.filter((p) => p.style === 'stroke').flatMap((p) => p.d.split(/(?=[Mm])/).filter((s) => s.trim())
    .filter((sub) => (sub.match(/[A-Za-z]/g) ?? []).length === 2 && /^[Mm][^A-Za-z]*[LlHhVv][^A-Za-z]*$/.test(sub.trim())));
  return parallelStack({ ...icon, paths: keep.map((d, index) => ({ index, d, style: 'stroke' })) }, opts);
}

/** 34 / 6 / 3: two members from a closed shape = walls plus marks; none = open strokes; all = closed edges. */
export function stackKind(s) { return s.walls === 2 ? 'walls+marks' : s.walls === 0 ? 'open' : s.walls === s.max ? 'closed' : 'other'; }

// ── punched cuts and clear pixels (agent D's b9.mjs / b9c.mjs) ─────────────

/** raster.mjs's region with the uniformity shortcut switched off: every box is sampled. This is
 *  the workaround for the `classify` defect (horizontal area edges dropped from the straddle test). */
export const sampleEverything = (reg) => ({ ...reg, classify: () => null });

/** Width of the clear run through `p` along `dir` (both ways until ink), at 0.002 steps. */
export function clearRun(reg, p, dir, span = 3) {
  const step = 0.002, L = Math.hypot(dir[0], dir[1]), ux = dir[0] / L, uy = dir[1] / L;
  let a = 0; while (a < span && !reg.covered(p[0] + ux * a, p[1] + uy * a)) a += step;
  let b = 0; while (b < span && !reg.covered(p[0] - ux * b, p[1] - uy * b)) b += step;
  return Number((a + b).toFixed(3));
}

/** Pixels wholly inside the disc of radius `r` (centre m/2), rendered 1 device px per unit, whose
 *  ink coverage is at or under each threshold. */
export function clearPixels(reg, m, r, thresholds = [0, 0.05, 0.15], rate = 16) {
  const { cov } = rasterise(reg, { px: m, rate });
  const c = m / 2, counts = thresholds.map(() => 0);
  for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) {
    const fx = Math.max(Math.abs(i - c), Math.abs(i + 1 - c)), fy = Math.max(Math.abs(j - c), Math.abs(j + 1 - c));
    if (Math.hypot(fx, fy) > r) continue;
    const v = cov[j * m + i];
    thresholds.forEach((t, k) => { if (v <= t + 1e-12) counts[k]++; });
  }
  return counts;
}

/** The probe points and disc radii agent D took from the paths (b9.mjs, b9c.mjs as patched before
 *  its final run: plus-circle at m/2 − 0.1m, x-circle at m/2 + 0.125m). Parameters, not figures. */
export const CUT_PROBES = {
  disc: { 24: 10, 20: 8, 16: 7 },
  'check-circle': (m) => ({ p: { 24: [13.63, 11.89], 20: [10.75, 9.87], 16: [9.07, 7.9] }[m], dir: [1, 1] }),
  'x-circle': (m) => ({ p: [m / 2 + m * 0.125, m / 2 + m * 0.125], dir: [1, -1] }),
  'plus-circle': (m) => ({ p: [m / 2, m / 2 - m * 0.1], dir: [1, 0] }),
  'minus-circle': (m) => ({ p: [m / 2, m / 2], dir: [0, 1] }),
};
export const SWAP = ['check-circle', 'x-circle', 'plus-circle', 'minus-circle'];

export function cutReadings(ctx) {
  return ctx.once('cuts', () => {
    const out = {};
    for (const nme of SWAP) for (const m of MASTER_LIST) {
      const f = ctx.set.byKey.get(`${m}/${nme}-filled`);
      const reg = regionOf(iconFromText(f.src, `${m}/${f.file}`));
      const { p, dir } = CUT_PROBES[nme](m);
      out[`${nme}@${m}`] = {
        width: clearRun(reg, p, dir),
        fixed: clearPixels(sampleEverything(reg), m, CUT_PROBES.disc[m]),
        asShipped: clearPixels(reg, m, CUT_PROBES.disc[m]),
      };
    }
    return out;
  });
}

// ── identical drawings (agent D's b18.mjs, b18b.mjs) ───────────────────────

export const pathsText = (src) => (src.match(/<path\b[^>]*>/g) || []).map((s) => s.replace(/\s+/g, ' ').trim()).join('\n');
export const canonicalKey = (src) => [...src.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => canonical(m[1]).key).sort().join(' || ');

/** Groups of two or more concepts whose key agrees at every one of `masters`. */
export function identicalGroups(concepts, keyOf, masters = MASTER_LIST) {
  const g = {};
  for (const c of concepts) (g[masters.map((m) => keyOf(m, c)).join(' ## ')] ??= []).push(c);
  return Object.values(g).filter((v) => v.length > 1).map((v) => v.sort()).sort((a, b) => a[0].localeCompare(b[0]));
}

export function identity(ctx) {
  return ctx.once('identity', () => {
    const { concepts, byKey } = ctx.set;
    const src = (m, c, suffix = '') => byKey.get(`${m}/${c}${suffix}`).src;
    const textAll = identicalGroups(concepts, (m, c) => pathsText(src(m, c)));
    const canonAll = identicalGroups(concepts, (m, c) => canonicalKey(src(m, c)));
    const filledAll = identicalGroups(concepts, (m, c) => pathsText(src(m, c, '-filled')));
    const byteAll = identicalGroups(concepts, (m, c) => src(m, c));
    const at = (m) => identicalGroups(concepts, (mm, c) => pathsText(src(mm, c)), [m]);
    const inAll = new Set(textAll.flat());
    const only16 = at(16).filter((g) => !g.every((c) => inAll.has(c)));
    return { textAll, canonAll, filledAll, byteAll, only16 };
  });
}

// ── optical shifts (agent D's c14.mjs, c14b.mjs) ───────────────────────────

/** Every `optical:` note, with lint's ink box for the same file. */
export async function opticalRows(ctx) {
  const readings = await ctx.readings();
  return readings.filter((x) => /<!--\s*optical:/.test(x.src)).map((x) => {
    const [dx, dy] = x.src.match(/<!--\s*optical:\s*([^>]*?)\s*-->/)[1].trim().split(/\s+/).map(Number);
    const ink = x.r.ink;
    return { m: x.m, name: x.name, concept: x.concept, filled: x.filled, dx, dy, w: ink.x1 - ink.x0, h: ink.y1 - ink.y0 };
  });
}

/** C14's scaling: shift24 × (ink extent at the master ÷ ink extent at 24), width for dx, height for dy. */
export function scalingTest(rows) {
  const get = (c, m, filled) => rows.find((r) => r.concept === c && r.m === m && r.filled === filled);
  const out = [];
  for (const filled of [false, true]) for (const c of uniq(rows.map((r) => r.concept))) {
    const a = get(c, 24, filled); if (!a) continue;
    for (const m of [20, 16]) {
      const r = get(c, m, filled); if (!r) continue;
      const pdx = a.dx * (r.w / a.w), pdy = a.dy * (r.h / a.h);
      out.push({ concept: c, filled, m, err: Math.max(Math.abs(pdx - r.dx), Math.abs(pdy - r.dy)), pdx, pdy, dx: r.dx, dy: r.dy });
    }
  }
  return out;
}

// ── off-grid (notes.mjs) and the comment proxy (agent D's b8b.mjs) ─────────

/** b8b.mjs's keyword proxy for "the comment says why the values are off the grid". */
export const OFFGRID_WORDS = /off.?grid|off the (quarter|eighth)|tangent|by construction|rounded|rounding|round(ed)? to|optical|corrects?|snapp|arc-derived|\b2 ?dp\b|\b3 ?dp\b|decimal/i;

export function offGridFacts(records) {
  const off = records.filter((r) => r.offGrid.total > 0);
  const byM = Object.fromEntries(MASTER_LIST.map((m) => {
    const rs = off.filter((r) => r.master === m);
    return [m, { drawings: rs.length, values: rs.reduce((s, r) => s + r.offGrid.total, 0) }];
  }));
  const sum = (k) => off.reduce((s, r) => s + r.offGrid.byCommand[k], 0);
  const straightDrawings = off.filter((r) => r.offGrid.byCommand.straight > 0);
  const arcOnly = off.filter((r) => r.offGrid.byCommand.straight === 0 && r.offGrid.byCommand.curve === 0);
  const perFile = {};
  for (const r of off) perFile[r.file] = (perFile[r.file] ?? 0) + r.offGrid.byCommand.straight;
  const worst = Object.entries(perFile).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const withWord = off.filter((r) => r.text.some((t) => OFFGRID_WORDS.test(t.trim())));
  return { drawings: off.length, values: off.reduce((s, r) => s + r.offGrid.total, 0), byM,
    straight: sum('straight'), arc: sum('arcParam') + sum('arcEnd'), straightDrawings: straightDrawings.length,
    arcOnly: arcOnly.length, worst, withWord: withWord.length, undocumented: off.filter((r) => r.offGrid.lintPrints === 'undocumented').length };
}

export function commentFacts(records) {
  const comments = records.flatMap((r) => r.comments);
  const free = comments.filter((c) => c.kind === 'text').map((c) => c.raw.trim().length).sort((a, b) => a - b);
  return { files: records.length, withComment: records.filter((r) => r.comments.length).length,
    withFree: records.filter((r) => r.text.length).length, withTags: records.filter((r) => r.notes.tags).length,
    comments: comments.length, notes: comments.filter((c) => c.kind === 'note').length, free: free.length,
    median: free[Math.floor(free.length / 2)] };
}

// ── the pair: filled ink box against outline (agent D's b10.mjs, on lint's raw boxes) ──────

export const GROWTH_TOL = 0.01, NOTE_TOL = 0.011;
export const growthGroup = (c) => (/^menu/.test(c) ? 'menu' : /^more/.test(c) ? 'more' : /^minus/.test(c) ? 'minus' : 'other');

export function pairCensus(readings) {
  const by = new Map(readings.map((x) => [`${x.m}/${x.name}`, x]));
  const rows = [];
  for (const x of readings) {
    if (x.filled) continue;
    const f = by.get(`${x.m}/${x.name}-filled`);
    if (!f) { rows.push({ c: x.name, m: x.m, missing: true }); continue; }
    const o = x.r.ink, i = f.r.ink;
    const d = { l: o.x0 - i.x0, r: i.x1 - o.x1, t: o.y0 - i.y0, b: i.y1 - o.y1 };
    const g = f.r.grows && !f.r.grows.bad ? f.r.grows : null;
    rows.push({ c: x.name, m: x.m, d, diff: Object.values(d).some((v) => Math.abs(v) > GROWTH_TOL), grows: g,
      noteOff: g ? Math.max(...['l', 'r', 't', 'b'].map((k) => Math.abs(d[k] - g[k]))) : null });
  }
  const differing = rows.filter((r) => r.diff);
  const concepts = uniq(differing.map((r) => r.c)).sort();
  return { pairs: rows.length, missing: rows.filter((r) => r.missing).length, differing: differing.length, concepts,
    allNoted: differing.every((r) => r.grows), stale: rows.filter((r) => r.grows && !r.diff).length,
    disagree: rows.filter((r) => r.grows && r.diff && r.noteOff > NOTE_TOL).length,
    worstNote: Math.max(0, ...rows.filter((r) => r.grows).map((r) => r.noteOff)), rows };
}

// ── facts other sections share ─────────────────────────────────────────────

/** Line-heavy vs light, by the filled root's stroke-width at each master (agent D's a2.mjs). */
export function weightSplit(set) {
  const res = {};
  for (const c of set.concepts) {
    const k = MASTER_LIST.map((m) => {
      const w = rootWidth(set.byKey.get(`${m}/${c}-filled`).src);
      return w === FILLED_WEIGHT[m] ? 'heavy' : w === STROKES[m] ? 'light' : `other(${w})`;
    }).join('/');
    (res[k] ??= []).push(c);
  }
  const heavy = res['heavy/heavy/heavy'] ?? [], light = res['light/light/light'] ?? [];
  const atOutlineWeight = Object.fromEntries(MASTER_LIST.map((m) => [m, set.files.filter((f) => f.m === m && rootWidth(f.src) === STROKES[m]).length]));
  return { heavy, light, mixed: Object.entries(res).filter(([k]) => !['heavy/heavy/heavy', 'light/light/light'].includes(k)), atOutlineWeight };
}

/** Shape-filled drawings: area-only vs areas + strokes, per master. */
export function filledKinds(set) {
  const out = {};
  for (const m of MASTER_LIST) {
    let areasOnly = 0, mixed = 0, strokesOnly = 0;
    for (const f of set.files.filter((x) => x.m === m && x.filled)) {
      const { ds, areas } = bodyOf(f.src, true);
      if (areas.length && ds.length) mixed++; else if (areas.length) areasOnly++; else strokesOnly++;
    }
    out[m] = { areasOnly, mixed, strokesOnly, shapeFilled: areasOnly + mixed };
  }
  return out;
}

/** The sort family and its warnings, from the lint run. */
export async function warningFacts(ctx) {
  const rd = await ctx.readings();
  const warned = rd.filter((x) => x.r.warnings.length);
  const lines = warned.flatMap((x) => x.r.warnings.map((w) => ({ m: x.m, name: x.name, concept: x.concept, w })));
  const sort = warned.filter((x) => /^sort-(alpha|numeric)-/.test(x.concept));
  return { drawings: warned.length, lines, sortDrawings: sort.length, sortConcepts: uniq(sort.map((x) => x.concept)).sort(),
    sortLines: lines.filter((l) => /^sort-(alpha|numeric)-/.test(l.concept)).length,
    trash: warned.filter((x) => x.concept === 'trash'), citeS6: lines.filter((l) => /§6/.test(l.w)).length };
}

/** F1's print line from warningFacts. */
export const f1Line = (wf) => `F1 warning lines ${wf.lines.length} in ${wf.drawings} drawings; citing §6: ${wf.citeS6}; sort family ${wf.sortDrawings} drawings in ${wf.sortConcepts.length} concepts; trash ${wf.trash.map((x) => `@${x.m}`).join(' ')}`;

/** Lint's §5 pair warning: the edge gaps it prints. */
export const edgeGaps = (lines) => uniq(lines.map((l) => l.w.match(/edge gap (-?[\d.]+)/)?.[1]).filter(Boolean)).map(Number).sort((a, b) => a - b);

/** In memory, inject `<!-- glyph: numeral -->` into every sort-numeric-* file and re-lint it. */
export async function numeralWhatIf(ctx) {
  const L = await lintModule(ctx.pin);
  const rows = ctx.set.files.filter((f) => /^sort-numeric-/.test(f.name));
  let before = { outline: 0, filled: 0 }, after = { outline: 0, filled: 0 };
  for (const f of rows) {
    const style = f.filled ? 'filled' : 'outline';
    before[style] += L.lintSource(f.m, f.file, f.src).warnings.length;
    after[style] += L.lintSource(f.m, f.file, f.src.replace(/(<svg[^>]*>\n)/, '$1  <!-- glyph: numeral -->\n')).warnings.length;
  }
  return { before, after };
}

/** The parallel-stack census at one master (outline files). */
export function stacksAt(ctx, m, opts = {}) {
  return ctx.once(`stacks${m}${JSON.stringify(opts)}`, () => ctx.set.files.filter((f) => f.m === m && !f.filled)
    .map((f) => parallelStack(iconFromSource(f.src, { file: f.file, master: m }), opts)));
}

/** The pure-line stacks at one master (outline files). */
export function pureLinesAt(ctx, m) {
  return ctx.once(`pure${m}`, () => ctx.set.files.filter((f) => f.m === m && !f.filled)
    .map((f) => pureLineStack(iconFromSource(f.src, { file: f.file, master: m }))));
}

/** angles.mjs over one master's outline files. */
export function anglesAt(ctx, m, filled = false) {
  return ctx.once(`angles${m}${filled}`, () => angleCensusOf(ctx.set.files.filter((f) => f.m === m && f.filled === filled)
    .map((f) => iconFromSource(f.src, { file: f.file, master: m })), { tolerance: 0.5, minLength: 0.1 }));
}

/** radii.mjs over one master's files. */
export function radiiAt(ctx, m, filled = false) {
  return ctx.once(`radii${m}${filled}`, () => ctx.set.files.filter((f) => f.m === m && f.filled === filled)
    .map((f) => radiiOf(iconFromSource(f.src, { file: f.file, master: m }))));
}
export function radiusCensusAt(ctx, m) {
  return ctx.once(`rc${m}`, () => radiusCensusOf(ctx.set.files.filter((f) => f.m === m && !f.filled)
    .map((f) => iconFromSource(f.src, { file: f.file, master: m }))));
}

/** The filled contour's angle against the outline's, on the drawings C30 / C22 grant (b6b.mjs). */
export function grantAngles(ctx, name, axis) {
  const read = (m, filled) => {
    const f = ctx.set.byKey.get(`${m}/${name}${filled ? '-filled' : ''}`);
    const a = anglesOf(iconFromSource(f.src, { file: f.file, master: m }));
    const offs = a.off.map((s) => (axis === 'vertical' ? s.fromVertical : s.fromHorizontal));
    return offs.length ? offs : [NaN];
  };
  return MASTER_LIST.map((m) => ({ m, outline: read(m, false), filled: read(m, true) }));
}

/** The smallest edge gap between strokes in one drawing (agent D's b12.mjs, lint's pair rule). */
export function smallestGap(src, m, name) {
  const filled = /-filled$/.test(name);
  const { ds, areas } = bodyOf(src, filled);
  const STROKE = areas.length ? strokeOf(m) : weightOf(name, m);
  const sampled = ds.map((d) => samplePath(d));
  const gaps = [];
  const side = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  const crosses = (a, b) => { for (let i = 1; i < a.length; i++) for (let j = 1; j < b.length; j++) { const [p, q, r, s] = [a[i - 1], a[i], b[j - 1], b[j]]; if (side(p, q, r) * side(p, q, s) < 0 && side(r, s, p) * side(r, s, q) < 0) return true; } return false; };
  const polyGap = (a, b) => { let min = Infinity; for (const [px, py] of a) for (let k = 0; k < b.length; k++) { const [x1, y1] = b[k], [x2, y2] = b[k + 1] ?? b[k]; const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy; const t = L && L < 0.3 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0; min = Math.min(min, Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))); } return min; };
  for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
    if (crosses(sampled[i], sampled[j])) continue;
    const min = Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i]));
    if (min <= 0.1) continue;
    gaps.push(r3(min - STROKE));
  }
  for (const d of ds) { const s = selfGap(d, STROKE); if (s) gaps.push(s.gap); }
  const air = facingGap(ds, STROKE, areas);
  for (const a of [...air.self, ...air.area]) gaps.push(a.gap);
  return { strokeGaps: gaps, min: gaps.length ? Math.min(...gaps) : null, area: air.area };
}

/** agent D's c16c.mjs: outline convex ~90° corners matched to the filled contour's at the outer
 *  offset; filled radius minus outline outer radius, per master. */
export function cornerPairs16(ctx) {
  const HALF = { 24: 0.75, 20: 0.75, 16: 0.625 };
  const out = [];
  for (const m of [16, 20, 24]) {
    const rows = [];
    for (const c of ctx.set.concepts) {
      const ft = ctx.set.byKey.get(`${m}/${c}-filled`).src;
      if (!/stroke="none"/.test(ft)) continue;
      const o = radiiOf(iconFromSource(ctx.set.byKey.get(`${m}/${c}`).src, { file: `${c}.svg`, master: m }));
      const f = radiiOf(iconFromSource(ft, { file: `${c}-filled.svg`, master: m }));
      const oc = o.corners.filter((x) => x.kind === 'arc' && Math.abs(Math.abs(x.turn) - 90) < 6 && x.convex);
      const fc = f.corners.filter((x) => x.style === 'area' && x.kind === 'arc' && Math.abs(Math.abs(x.turn) - 90) < 6 && x.convex);
      const h = HALF[m];
      for (const a of oc) {
        let match = null;
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const b = fc.find((z) => Math.hypot(z.at[0] - (a.at[0] + sx * h), z.at[1] - (a.at[1] + sy * h)) < 0.02); if (b && !match) match = b; }
        if (match) rows.push({ c, diff: match.radius - (a.radius + h) });
      }
    }
    const plus = rows.filter((r) => Math.abs(r3(r.diff) - 0.125) < 1e-9);
    const exact = rows.filter((r) => r3(r.diff) === 0);
    out.push(`3b.11 at ${m}: ${rows.length} matched corner pairs; ${exact.length} match exactly; +0.125 on ${plus.length} pairs in ${uniq(plus.map((r) => r.c)).length} concepts${plus.length ? ` (${uniq(plus.map((r) => r.c)).join(', ')})` : ''}; printer and briefcase pairs at +0.125: ${plus.filter((r) => ['printer', 'briefcase'].includes(r.c)).length} (their pairs: ${rows.filter((r) => ['printer', 'briefcase'].includes(r.c)).length})`);
  }
  return out;
}

// ── the CLI ────────────────────────────────────────────────────────────────

/** Shared CLI for the four probes: `<pin> [section …] [--repo DIR] [--refs DIR]`. */
export async function cli(argv, sections, name) {
  const flags = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--repo' || a === '--refs') { flags[a.slice(2)] = argv[++i]; continue; }
    if (a.startsWith('--')) { const [k, v] = a.slice(2).split('='); flags[k] = v ?? true; continue; }
    pos.push(a);
  }
  const [pin, ...want] = pos;
  const usage = `usage: node tools/audit/${name} <pin-dir> [${Object.keys(sections).join(' | ')} …] [--repo DIR] [--refs DIR]`;
  if (!pin || !existsSync(join(pin, 'src/icons')) || !existsSync(join(pin, 'tools/lint.mjs')) || !statSync(pin).isDirectory()) {
    console.error(`${usage}\n  <pin-dir> must hold src/icons and tools/lint.mjs (git archive ${PIN_COMMIT}, then the pin's own node tools/build.mjs)`);
    return 2;
  }
  const unknown = want.filter((w) => !(w in sections));
  if (unknown.length) { console.error(`unknown section: ${unknown.join(', ')}\n${usage}`); return 2; }
  const ctx = new Ctx(resolve(pin), { repo: flags.repo ? resolve(flags.repo) : REPO, refs: flags.refs ? resolve(flags.refs) : join(REPO, 'research/references') });
  ctx.flags = flags;
  for (const key of want.length ? want : Object.keys(sections)) {
    const s = sections[key];
    console.log(`## ${s.title}`);
    for (const line of await s.run(ctx)) console.log(line);
    console.log('');
  }
  return 0;
}

// ── the document's sections ────────────────────────────────────────────────

export const SECTIONS = {
  census: { title: '§census (header) The note census at the pin', run: async (ctx) => {
    const c = noteCensus(ctx.notes.files);
    const out = [];
    out.push(`pin: ${n(ctx.set.concepts.length)} concepts · ${n(ctx.set.files.length)} drawings`);
    const { summary } = await ctx.lint();
    out.push(`lint at the pin: ${summaryLine(summary)}`);
    out.push(`\`tags:\` ${n(c.tags.files)} / ${c.tags.concepts} · \`keyline: mark\` ${c.keyline.files} / ${c.keyline.concepts} · \`box:\` ${c.box.files} / ${c.box.concepts} · \`optical:\` ${c.optical.files} / ${c.optical.concepts} · \`glyph:\` ${c.glyph.files} / ${c.glyph.concepts} (${c.glyphDot.files} files \`dot\` on ${c.glyphDot.concepts} concepts, ${c.glyphNumeral.files} files \`numeral\` on ${tick(c.glyphNumeral.conceptList)} alone) · \`grows:\` ${c.grows.files} / ${c.grows.concepts} · \`anchor:\` ${c.anchor.files} / ${c.anchor.concepts} · \`gap:\` ${c.gap.files} / ${c.gap.concepts}`);
    out.push(`${c.anyNonTag.concepts} of ${c.anyNonTag.of} concepts carry at least one note other than \`tags:\`; ${c.anyNonTag.none} carry none`);
    out.push(`the three keyline opt-outs on one file: mark+box ${c.co.markBox.length} · mark+anchor ${c.co.markAnchor.length} · box+anchor ${c.co.boxAnchor.length} concepts`);
    out.push(`\`keyline: mark\` + \`optical:\` on ${c.co.markOptical.length} concepts, + \`grows:\` on ${c.co.markGrows.length}, \`box:\` + \`optical:\` + \`glyph: dot\` on ${c.co.boxOpticalDot.length}, \`box:\` + \`gap:\` on ${c.co.boxGap.length}`);
    return out;
  } },

  frame: { title: '§frame The two facts that frame everything below', run: async (ctx) => {
    const out = [];
    const roots = ctx.git(['rev-list', '--max-parents=0', PIN_COMMIT]).trim().split('\n');
    for (const r of roots) out.push(`first commit: ${ctx.git(['log', '-1', '--format=%h %cs', r]).trim()}`);
    const before = ctx.git(['rev-list', '-1', '--before=2026-09-16 23:59:59', PIN_COMMIT]).trim();
    out.push(`git rev-list -1 --before="2026-09-16 23:59:59": ${before || '(nothing)'}`);
    out.push('| | concepts | `keyline: mark` | agreed `box:` | held to a silhouette keyline |');
    // The decision days are the document's parameters (C8–C18 on 2026-09-17, docs/09 on 09-19, C7 on 09-20, the pin).
    for (const day of ['2026-09-17', '2026-09-19', '2026-09-20', '2026-10-04']) {
      const c = compositionAt(ctx, day);
      out.push(`| ${day} (${c.commit}) | ${c.concepts} | ${c.mark} (${pct(c.mark, c.concepts, 0)}) | ${c.box} | ${c.held} |`);
    }
    const stress = ['calendar', 'user', 'gear', 'bell', 'lock', 'mail', 'image', 'home', 'eye', 'chart-bar'];   // docs/09's stress batch, cited
    out.push(`docs/09's stress batch with a file in src/icons/24: ${stress.filter((s) => ctx.set.byKey.has(`24/${s}`)).length} of ${stress.length}`);
    return out;
  } },

  A: { title: '§A The artefact: what a file is', run: async (ctx) => {
    const per = MASTER_LIST.map((m) => `${m}: ${ctx.set.conceptsAt(m).length}`).join(' · ');
    const pc = pairCensus(await ctx.readings());
    return [`A1 concepts approved at each master: ${per}`, `A9 ${n(pc.pairs)} pairs, ${pc.missing} missing twins`];
  } },

  B: { title: '§B Size, keyline and placement', run: async (ctx) => {
    const rd = await ctx.readings();
    const c = noteCensus(ctx.notes.files);
    const out = [];
    const atAll = (k) => uniq(rd.filter((x) => x.kind === k).map((x) => x.concept));
    const held = uniq(rd.filter((x) => x.m === 24 && !x.filled && !['mark', 'box', 'anchored'].includes(x.kind)).map((x) => x.concept));
    out.push(`B2 concepts held to a silhouette keyline (24 outline): ${held.length}; drawings fitting \`diagonal\`: ${rd.filter((x) => x.kind === 'diagonal').length}`);
    out.push(`B4 \`keyline: mark\` ${c.keyline.concepts} concepts / ${c.keyline.files} files`);
    out.push(`B5 \`box:\` ${c.box.concepts} concepts / ${c.box.files} files`);
    out.push(`B6 \`anchor:\` ${c.anchor.concepts} concepts / ${c.anchor.files} files`);
    const rows = await opticalRows(ctx);
    out.push(`B8 \`optical:\` ${uniq(rows.map((r) => r.concept)).length} concepts / ${rows.length} files, ${uniq(rows.map((r) => `${r.dx} ${r.dy}`)).length} distinct pairs`);
    const t = scalingTest(rows), ol = t.filter((x) => !x.filled);
    const chev = ol.filter((x) => /^chevron/.test(x.concept));
    out.push(`B8 scaling: ${ol.filter((x) => x.err <= 0.05).length} of ${ol.length} outline files at 20 and 16 within 0.05, ${ol.filter((x) => x.err <= 0.02).length} within 0.02; ${chev.length} chevron tests, worst ${fmt(Math.max(...chev.map((x) => x.err)), 3)}`);
    const miss = ol.filter((x) => x.err > 0.05);
    out.push(`B8 misses (${miss.length}): ${miss.map((x) => `${x.concept}@${x.m} declared ${x.dx},${x.dy} predicted ${fmt(x.pdx, 3)},${fmt(x.pdy, 3)} (err ${fmt(x.err, 3)})`).join(' · ')}`);
    const outl = rows.filter((r) => !r.filled);
    const same = outl.filter((r) => rows.some((f) => f.filled && f.concept === r.concept && f.m === r.m && f.dx === r.dx && f.dy === r.dy));
    out.push(`B8 filled twins repeating the outline's value: ${same.length} of ${outl.length}`);
    // B5's silence: box notes not on all six files of a concept
    const boxed = ctx.notes.files.filter((r) => r.notes.box);
    const partial = uniq(boxed.map((r) => r.concept)).filter((cpt) => boxed.filter((r) => r.concept === cpt).length !== 6);
    out.push(`B5 concepts whose \`box:\` is not on all six files: ${partial.map((p) => `${p} (${boxed.filter((r) => r.concept === p).map((r) => `${r.master}${r.style === 'filled' ? 'f' : ''}`).join(' ')})`).join(', ') || 'none'}`);
    const disagree = MASTER_LIST.flatMap((m) => ctx.set.concepts.filter((cpt) => {
      const a = ctx.notes.files.find((r) => r.master === m && r.name === cpt)?.notes.box?.value, b = ctx.notes.files.find((r) => r.master === m && r.name === `${cpt}-filled`)?.notes.box?.value;
      return a !== b;
    }));
    out.push(`B5 pair/master disagreements on the box note: ${disagree.length}`);
    const cb = centringBands(rd);
    out.push(`B7 centring (${n(cb.total)} non-anchored drawings, after the declared shift): >0.01 ${cb.over001} · >0.10 ${cb.over010} · >0.25 ${cb.over025} · at 0.50 ${cb.at050} (${uniq(cb.worst.map((x) => x.concept)).map((cpt) => `${cpt} ×${cb.worst.filter((x) => x.concept === cpt).length}${uniq(cb.worst.filter((x) => x.concept === cpt).map((x) => x.m)).length < 3 ? ` @${uniq(cb.worst.filter((x) => x.concept === cpt).map((x) => x.m)).join(',')}` : ''}`).join(', ')}) · >0.50 ${cb.over050}`);
    return out;
  } },

  C: { title: '§C The line', run: async (ctx) => {
    const w = weightSplit(ctx.set);
    const pc = pairCensus(await ctx.readings());
    const { results } = await ctx.lint();
    const notesAll = [...results.values()].flatMap((r) => r.notes);
    const warnAll = [...results.values()].flatMap((r) => r.warnings);
    const groups = {};
    for (const cpt of pc.concepts) (groups[growthGroup(cpt)] ??= []).push(cpt);
    return [
      `C-1 files per master at the outline weight: ${MASTER_LIST.map((m) => `${m}: ${w.atOutlineWeight[m]}`).join(' · ')} (outline files per master ${ctx.set.concepts.length})`,
      `C-2 ${w.heavy.length} concepts line-heavy, ${w.light.length} light, mixed across masters ${w.mixed.length}`,
      `C-5 ${n(pc.pairs)} pairs; ${pc.concepts.length} concepts / ${pc.differing} pairs differ; all declared: ${pc.allNoted}; stale notes ${pc.stale}; notes off the drawings by more than ${NOTE_TOL}: ${pc.disagree} (largest ${fmt(pc.worstNote, 3)})`,
      `C-5 lint prints ${notesAll.filter((x) => /^agreed growth/.test(x)).length} "agreed growth" notes, ${warnAll.filter((x) => /ink box differs/.test(x)).length} "ink box differs" warnings, ${warnAll.filter((x) => /twin/.test(x)).length} missing twins`,
      `C-5 groups: ${Object.entries(groups).map(([g, v]) => `${g} ${v.length}`).join(' · ')}; outside menu / more / minus: ${tick(groups.other ?? [])}`,
    ];
  } },

  D: { title: '§D The grid', run: async (ctx) => {
    const og = offGridFacts(ctx.notes.files), cf = commentFacts(ctx.notes.files);
    return [
      `D1 ${n(og.drawings)} of ${n(ctx.notes.files.length)} drawings (${pct(og.drawings, ctx.notes.files.length)}) hold an off-grid coordinate — ${n(og.values)} occurrences; lint "undocumented": ${og.undocumented}`,
      `D6 files with a free-text comment: ${n(cf.withFree)} of ${n(cf.files)}; with \`tags:\`: ${n(cf.withTags)}`,
      `D conflicts: drawings since docs/09's 684 (cited): ${n(ctx.notes.files.length - 684)}`,
    ];
  } },

  E: { title: '§E Corners, radii and angles', run: async (ctx) => {
    const out = [];
    const rc = radiusCensusAt(ctx, 24);
    const stroke = rc.all.filter((c) => c.style === 'stroke');
    const voc = radiusVocabulary(stroke);
    const three = (voc.on[0] ?? 0) + (voc.on[1.5] ?? 0) + (voc.on[2.5] ?? 0);
    out.push(`E1 radii.mjs over the ${rc.drawings} outline files at 24: ${n(rc.corners)} corners; radii 0, 1.5 and 2.5 account for ${three} (${pct(three, voc.total)}); adding 0.75 makes ${n(three + (voc.on[0.75] ?? 0))} (${pct(three + (voc.on[0.75] ?? 0), voc.total)})`);
    const fam = (s) => uniq(Object.keys(s).map((x) => x.replace(/-\d+.*$/, '').replace(/-(large|small)$/, ''))).sort();
    const at1 = conceptsAtRadius(stroke, 1), at125 = conceptsAtRadius(stroke, 1.25), at2 = conceptsAtRadius(stroke, 2);
    out.push(`E1 ${dec(1)} on ${Object.keys(at1).length} concepts (families ${fam(at1).join(', ')}); ${dec(1.25)} on families ${fam(at125).join(', ')}; ${dec(2)} on ${Object.values(at2).reduce((a, b) => a + b, 0)} corners`);
    out.push(`E1 off-quarter values (${Object.keys(voc.off).length}): ${Object.entries(voc.off).sort((a, b) => Number(a[0]) - Number(b[0])).map(([k, v]) => `${k} (${uniq(v).join(', ')})`).join(' · ')}`);
    const sc = strictContainers(radiiAt(ctx, 24));
    out.push(`E1 strict test: ${sc.rows.length} concepts at 24: ${Object.entries(sc.byR).map(([k, v]) => `${v.length} at ${k}${v.length <= 6 ? ` (${v.join(', ')})` : ''}`).join(', ')}; ${sc.mixed.length} mixed (${sc.mixed.map((r) => `${r.name} [${r.radii.join(', ')}]`).join('; ')})`);
    const lc = looseContainers(radiiAt(ctx, 24));
    out.push(`E1 looser test: ${lc[2.5]?.names.size ?? 0} concepts at 2.5 against ${lc[1.5]?.names.size ?? 0} at 1.5`);
    const trash = MASTER_LIST.map((m) => containerRadiusOf(radiiOf(iconFromSource(ctx.set.byKey.get(`${m}/trash`).src, { file: 'trash.svg', master: m }))));
    const fams = MASTER_LIST.map((m) => { const s = strictContainers(radiiAt(ctx, m)); return Object.entries(s.byR).sort((a, b) => b[1].length - a[1].length)[0][0]; });
    out.push(`E1 trash container radius ${trash.map(dec).join(' · ')}; the strict test's commonest container radius per master ${fams.map(Number).map(dec).join(' · ')}`);
    const a24 = anglesAt(ctx, 24), a20 = anglesAt(ctx, 20), a16 = anglesAt(ctx, 16);
    out.push(`E4 angles.mjs: ${n(a24.segments)} straight segments at 24 (tolerance 0.5°): ${a24.offConcepts.length} concepts carry a segment outside it (${a24.off.length} segments), ${a20.offConcepts.length} at 20, ${a16.offConcepts.length} at 16`);
    // b6d.mjs: concepts off-angle at 20 or 16 and not at 24, read by their worst segment at 20/16
    const extra = uniq([...a20.offConcepts, ...a16.offConcepts]).filter((x) => !a24.offConcepts.includes(x));
    const worstOf = (cpt) => Math.max(...[a20, a16].flatMap((a) => (a.byConcept[cpt] ?? []).map((s) => s.dev)));
    const extraDev = extra.map(worstOf);
    out.push(`E4 off-angle at 20 or 16 only: ${extra.length} concepts, worst segment ${fix(Math.min(...extraDev), 2)}–${fix(Math.max(...extraDev), 2)}° (${extraDev.filter((d) => d <= 1).length} within 1°, ${extraDev.filter((d) => d > 1 && d <= 2).length} within 2°); at 16 and not at 24: ${a16.offConcepts.filter((x) => !a24.offConcepts.includes(x)).length}`);
    const defaults = a24.offConcepts.filter(isDefault);
    out.push(`E4 defaults among them: ${defaults.length} — ${tick(defaults)}`);
    const none = ungranted(ctx.text('docs/07-character.md'), defaults);
    out.push(`E4 defaults with no grant on docs/07:77-78: ${none.length} — ${tick(none)}`);
    const angle = (name, axis) => grantAngles(ctx, name, axis).map((x) => ({ m: x.m, o: x.outline, f: x.filled }));
    const fmtA = (rows, key, pick) => rows.map((x) => fix(pick(x[key]), 2)).join(' / ');
    const trashA = angle('trash', 'vertical'), codeA = angle('code', 'horizontal');
    out.push(`E conflicts: trash taper filled ${fmtA(trashA, 'f', (v) => Math.max(...v))}° against outline ${fmtA(trashA, 'o', (v) => Math.max(...v))}°; code slash filled ${fmtA(codeA, 'f', (v) => Math.max(...v))}° against outline ${fmtA(codeA, 'o', (v) => Math.max(...v))}°`);
    return out;
  } },

  F: { title: '§F Negative space', run: async (ctx) => {
    const out = [];
    const wf = await warningFacts(ctx);
    out.push(f1Line(wf));
    const ft = smallestGap(ctx.set.byKey.get('16/file-text-2').src, 16, 'file-text-2');
    out.push(`F1 file-text-2 at 16, smallest edge gap between strokes: ${fmt(Math.min(...ft.strokeGaps), 3)}`);
    out.push(`F1 the scan's share of the set (92 icons, cited): ${pct(92, ctx.set.concepts.length, 0)}`);
    const c = noteCensus(ctx.notes.files);
    const gaps = ctx.notes.files.filter((r) => r.notes.gap).map((r) => r.notes.gap.parsed.n);
    out.push(`F3 \`glyph:\` ${c.glyph.concepts} concepts / ${c.glyph.files} files · F4 \`gap:\` ${c.gap.files} files / ${c.gap.concepts} concepts, lowest ${Math.min(...gaps)} (${ctx.notes.files.filter((r) => r.notes.gap?.parsed.n === Math.min(...gaps)).map((r) => `${r.name} at ${r.master}`).join(', ')})`);
    for (const m of MASTER_LIST) {
      const st = stacksAt(ctx, m), big = st.filter((s) => s.max >= 4);
      const hist = {}; big.forEach((s) => { hist[s.max] = (hist[s.max] ?? 0) + 1; });
      const kinds = {}; big.forEach((s) => (kinds[stackKind(s)] ??= []).push(s.name));
      const line = m === 24
        ? `F6 at 24: ${big.length} concepts hold a stack of 4 or more (${Object.entries(hist).map(([k, v]) => `${v} at ${k}`).join(', ')}; five: ${big.filter((s) => s.max === 5).map((s) => s.name).join(', ')}); walls+marks ${kinds['walls+marks']?.length ?? 0}; open strokes ${(kinds.open ?? []).join(', ')}; closed edges ${(kinds.closed ?? []).join(', ')}${kinds.other ? `; other ${kinds.other.join(', ')}` : ''}`
        : `F6 at ${m}: ${big.length}`;
      out.push(line);
    }
    const st24 = stacksAt(ctx, 24);
    const pure = st24.filter((s) => s.walls === 0 && s.subpaths === s.max);
    const top = Math.max(...pure.map((s) => s.max));
    out.push(`F6 largest stack of separate open strokes (one subpath each, any shape) at 24: ${top} (${pure.filter((s) => s.max === top).map((s) => s.name).join(', ')})`);
    const pl = pureLinesAt(ctx, 24), plTop = Math.max(...pl.map((s) => s.max));
    out.push(`F6 largest pure line run (whole subpaths that are one straight segment) at 24: ${plTop}, in ${pl.filter((s) => s.max === plTop).length} concepts (incl. menu ${pl.find((s) => s.name === 'menu')?.max}, list-bullet ${pl.find((s) => s.name === 'list-bullet')?.max})`);
    out.push(...cornerPairs16(ctx).map((x) => x.replace(/^3b\.11/, 'F silences, the 16 filled corners')));
    const cuts = cutReadings(ctx);
    out.push(`F8 cut widths 24 / 20 / 16: ${['check-circle', 'plus-circle', 'x-circle', 'minus-circle'].map((x) => `\`${x}\` ${MASTER_LIST.map((m) => fix(cuts[`${x}@${m}`].width, 2)).join(' / ')}`).join(' · ')}`);
    for (const label of ['fixed', 'asShipped']) {
      out.push(`F8 fully clear pixels (${label === 'fixed' ? 'raster defect bypassed' : 'raster.mjs as shipped'}), coverage 0 · ≤0.05: ${MASTER_LIST.map((m) => `${m}: ${SWAP.map((x) => `${x.replace('-circle', '')} ${cuts[`${x}@${m}`][label][0]}·${cuts[`${x}@${m}`][label][1]}`).join(', ')}`).join(' | ')}`);
    }
    return out;
  } },

  G: { title: '§G Naming and families', run: async (ctx) => {
    const noTags = ctx.notes.files.filter((r) => !r.notes.tags);
    const id = identity(ctx);
    const conc = (gs) => gs.reduce((s, g) => s + g.length, 0);
    return [
      `G2 ${noTags.length} files carry no \`tags:\` note — ${uniq(noTags.map((r) => r.concept)).length} concepts: ${tick(uniq(noTags.map((r) => r.concept)).sort())}`,
      `G7 identical outline <path> text at all three masters: ${id.textAll.length} groups, ${conc(id.textAll)} concepts — ${id.textAll.map((g) => g.join(' = ')).join(' · ')}`,
      `G7 the same by canonical(): ${id.canonAll.length} groups, ${conc(id.canonAll)} concepts`,
      `G7 byte-identical outline files: ${id.byteAll.length}`,
      `G7 identical in the filled twin too: ${id.filledAll.map((g) => g.join(' = ')).join(' · ')}`,
      `G7 identical outlines at 16 only: ${id.only16.map((g) => g.join(' / ')).join(' · ')}`,
    ];
  } },

  I: { title: '§I Process, and what this card adds to docs/09', run: async (ctx) => {
    const out = [];
    const sortFiles = ctx.notes.files.filter((r) => /^sort-(alpha|numeric)-/.test(r.concept));
    out.push(`I3 sort-alpha/-numeric files: ${sortFiles.length}; carrying a \`gap:\` or \`glyph:\` note: ${sortFiles.filter((r) => r.notes.gap || r.notes.glyph).length}`);
    const wf = await warningFacts(ctx);
    const wi = await numeralWhatIf(ctx);
    out.push(`I3 sort warning lines ${wf.sortLines}; with \`glyph: numeral\` injected in memory the sort-numeric outline lines go ${wi.before.outline} → ${wi.after.outline} (filled ${wi.before.filled} → ${wi.after.filled}), so ${wf.sortLines} → ${wf.sortLines - (wi.before.outline - wi.after.outline) - (wi.before.filled - wi.after.filled)}`);
    out.push(`I3 sort edge gaps: ${edgeGaps(wf.lines.filter((l) => /^sort-/.test(l.concept))).join(', ')}; trash edge gaps ${wf.trash.map((x) => `${x.r.warnings[0].match(/edge gap (-?[\d.]+)/)?.[1]} at ${x.m}`).join(', ')}`);
    out.push(`I8 concepts since docs/09's 114 (cited): ${ctx.set.concepts.length - 114}; now ${n(ctx.set.concepts.length)} names / ${n(ctx.set.files.length)} files`);
    const rows = ctx.text('research/queue.md').split('\n').filter((l) => /^- \[[ x~]\] \d+\. `/.test(l));
    out.push(`research/queue.md rows: ${rows.length}`);
    return out;
  } },
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await cli(process.argv.slice(2), SECTIONS, 'register-probe.mjs');
}
