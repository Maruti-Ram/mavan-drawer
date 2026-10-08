#!/usr/bin/env node
// tools/audit/untitled-probe.mjs — reprints the figures of docs/audit/references-untitled.md (card 2.4)
// that the committed command does not print, and the document's "our set" figures from the PIN.
//
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing (stdout only).
//
// WHY A PROBE BESIDE THE COMMITTED COMMAND. `node tools/audit/refs/untitled-pairs.mjs --ours --png` prints
// most of the document (and was verified line by line on 2026-10-08: its stdout equals the saved
// `analysis/report.txt` byte for byte apart from the timestamps). Two gaps remain:
//   1. a handful of reference-side figures it never prints (the first 26's names, the page census, the
//      bridge-call count, the NaN path, the badge split of §4c, the 0.007 box-test example);
//   2. its "our set" half (`untitled-ours.mjs`) reads the LIVE `src/icons`, which the drawing session
//      keeps changing. This probe reads the pin instead, so §4a/§4b/§8/§9's figures about us stay
//      reprintable after the tree moves.
// `untitled-pairs.mjs` cannot be imported (it has no CLI guard: importing it runs it and writes under
// research/). Its `sideDefiners` is therefore ported verbatim below, and its BADGE name pattern is read
// out of its source text at run time, so the tag has one home.
//
// USAGE
//   node tools/audit/untitled-probe.mjs <pin-dir> [section …] [--refs <dir>]
//   <pin-dir>  `git archive 5933041` (+ its own build) — needs src/icons/{24,20,16}
//   --refs     the reference records; default the repo's research/references (gitignored, present on
//              the audit machine): reads <refs>/untitled/figma/*.json and <refs>/untitled/figma/raw/*.json
//
// SECTIONS (default: all, in this order)                                          document §
//   answer  the first 26 sampled concepts; our headline figures                     The short answer
//   s1      page, canvas, stroke census, corner smoothing, bridge calls, NaN path    §1 (+ last Refuse row)
//   s4      §4a/§4b our rows; §4c the slanted-end sides that break, badge split      §4
//   s8      our set measured the same way, and the chevron leg angles               §8
//   s9      the findings about us                                                   §9
//   s11     the two box tests (sides vs x/y/width/height) and where they disagree   §11
//
// INSTRUMENTS. tools/audit/refs/pairgeom.mjs (parsePath, flatten, segmentsOf, analyticBox, renderBox,
// sideDiff, maxAbs); tools/audit/refs/untitled-ours.mjs (inkBoxOf, sideDefinersOurs); tools/audit/angles.mjs
// (readIcon, piecesOf, tangentOf, segmentsOf). Every function here is a re-statement of the committed
// card-2.4 logic with the icon root as a parameter.
//
// KNOWN DEFECTS. None of the plan's known instrument defects touches these sections: no raster
// (`raster.mjs` classify), no `pixelgrid`, no `congruence`. `figma.mjs` `measure.ink` (Figma's render
// bounds) is used only in s11, which is ABOUT the render bounds. On Untitled the render bounds agree with the
// path box (no node rounding put back) on 2,359 of 2,359 drawings (committed report §0), the one drawing flagged
// rotated included, so neither the render-bounds defect nor a corner radius held only as a node property (1,408
// paths carry cornerRadius 'mixed', 68 a number) moves any box this probe or the committed command reads.
//
// RUN TIME on the audit Mac (2026-10-08): answer 0.3 s · s1 0.1 s · s4 0.4 s · s8 0.3 s · s9 0.3 s ·
// s11 0.2 s · all 0.5–0.7 s (no raster; the pin's pairs are read once per run).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parsePath, flatten, segmentsOf, analyticBox, renderBox, sideDiff, maxAbs } from './refs/pairgeom.mjs';
import { inkBoxOf, sideDefinersOurs } from './refs/untitled-ours.mjs';
import { readIcon, piecesOf, tangentOf, segmentsOf as lineSegs } from './angles.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
export const SECTIONS = ['answer', 's1', 's4', 's8', 's9', 's11'];
export const MASTERS = [24, 20, 16];
const SIDES = ['left', 'top', 'right', 'bottom'];
const SKIP = new Set(['index.json', 'catalogue.json', 'calibration.json']);

// Parameters the card chose (untitled-pairs.mjs / untitled-ours.mjs), named here, not tuned.
export const TOL_BOX = 0.01;          // "held": our lint's tolerance for the pair
export const SLANT_DEG = 1;           // an end is slanted when it runs more than 1 degree off horizontal/vertical
export const SIDE_REACH = 0.006;      // sideDefiners: a point holds a side when within 0.006 of it
export const CHEVRON_LEG = [5, 85];   // a chevron leg is a straight piece 5..85 degrees from horizontal …
export const CHEVRON_MIN_LEN = 0.5;   // … at least 0.5 long

// ── formatting ─────────────────────────────────────────────────────────────
export const n0 = (v) => Number(v).toLocaleString('en-US');
export const pct = (n, d) => (d ? (100 * n / d).toFixed(1) + '%' : 'n/a');
const r3 = (v) => Math.round(v * 1000) / 1000;
const fx = (v, d) => Number(v).toFixed(d);
const head = (t) => console.log(`\n## ${t}`);
const say = (s = '') => console.log(s);

// ── reading the reference records ──────────────────────────────────────────

/** Every ingested concept of a source under <refs>/<source>/figma/, in file-name order (as pairgeom.conceptsOf). */
export function loadConcepts(refsDir, source) {
  const dir = path.join(refsDir, source, 'figma');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !SKIP.has(f)).sort()
    .map((f) => ({ ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), file: f }));
}

/** Pair each concept's outline with its solid exactly as untitled-pairs.mjs does. */
export function pairsOf(concepts) {
  const pairs = [], solidOnly = [], outlineOnly = [], multi = [];
  for (const c of concepts) {
    const o = c.records.filter((r) => r.style === 'outline'), s = c.records.filter((r) => r.style === 'filled');
    const key = c.group + '/' + c.name;
    if (o.length === 1 && s.length === 1) pairs.push({ key, name: c.name, o: o[0], s: s[0] });
    else if (o.length === 0) solidOnly.push(key);
    else if (s.length === 0) outlineOnly.push(key);
    else multi.push({ key, outlines: o.length, solids: s.length });
  }
  return { pairs, solidOnly, outlineOnly, multi };
}

/** The raw bridge dumps: one file per `figma_execute` call. A full read picks every enumerated concept. */
export function rawDumps(refsDir, source) {
  const dir = path.join(refsDir, source, 'figma', 'raw');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const picked = r.picked || [];
    return { file: f, from: r.from, to: r.to, enumerated: r.enumerated, picked, full: picked.length === r.enumerated,
      page: r.page, errors: r.errors || [], concepts: r.concepts || [] };
  });
}

/** Paths in the raw dumps whose `d` carries a NaN, with the drawing's raw path count and the ingested record's. */
export function nanPaths(dumps, concepts) {
  const out = [];
  for (const dump of dumps) for (const c of dump.concepts) for (const it of c.items || []) for (const dr of it.drawings || []) {
    const ds = (dr.nodes || []).flatMap((n) => (n.paths || []).map((p) => p.d));
    const bad = ds.filter((d) => /NaN/.test(d));
    if (!bad.length) continue;
    const ing = concepts.find((k) => k.group === c.group && k.name === c.name);
    const rec = ing && ing.records.find((r) => r.style === it.style);
    out.push({ dump: dump.file, key: `${c.group}/${c.name}`, style: it.style, bad, raw: ds.length, ingested: rec ? rec.paths.length : null });
  }
  return out;
}

/** What the page is made of: canvases, every stroke-painted path's weight, cap, join and alignment, corner smoothing. */
export function recordCensus(concepts) {
  const T = { drawings: 0, canvas: {}, page: {}, weight: {}, cap: {}, join: {}, align: {}, strokeDrawings: 0, strokePaths: 0, smoothing: {}, paths: 0 };
  const inc = (o, k) => { o[k] = (o[k] || 0) + 1; };
  for (const c of concepts) for (const r of c.records) {
    T.drawings++;
    inc(T.canvas, (r.canvas || []).join('x'));
    inc(T.page, r.meta && r.meta.pageId);
    let stroked = false;
    for (const p of r.paths) {
      T.paths++;
      inc(T.smoothing, String(p.cornerSmoothingProp));
      if (!(p.paint === 'stroke' || p.paint === 'both') || !p.stroke) continue;
      stroked = true; T.strokePaths++;
      inc(T.weight, String(p.stroke.weight)); inc(T.cap, p.stroke.cap); inc(T.join, p.stroke.join); inc(T.align, p.stroke.align);
    }
    if (stroked) T.strokeDrawings++;
  }
  return T;
}

/** BADGE, read out of untitled-pairs.mjs's source so the eye-read tag has one home. */
export function badgePattern(src) {
  const m = src.match(/const BADGE = \/(.+)\/;\s*$/m);
  if (!m) throw new Error('untitled-pairs.mjs: no `const BADGE = /…/;` line found');
  return new RegExp(m[1]);
}

// ── sideDefiners: ported verbatim from untitled-pairs.mjs (not importable: it runs on import) ──────
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len = (v) => Math.hypot(v[0], v[1]);
export const fromAxis = (v) => { const a = (Math.atan2(v[1], v[0]) * 180) / Math.PI; const m = ((a % 90) + 90) % 90; return Math.min(m, 90 - m); };
function startTan(s) {
  if (s.t === 'L') return sub(s.b, s.a);
  const c1 = sub(s.c1, s.a); if (len(c1) > 1e-6) return c1;
  if (s.t === 'C') { const c2 = sub(s.c2, s.a); if (len(c2) > 1e-6) return c2; }
  return sub(s.b, s.a);
}
function endTan(s) {
  if (s.t === 'L') return sub(s.b, s.a);
  if (s.t === 'C') { const t = sub(s.b, s.c2); if (len(t) > 1e-6) return t; const t2 = sub(s.b, s.c1); if (len(t2) > 1e-6) return t2; return sub(s.b, s.a); }
  const t = sub(s.b, s.c1); if (len(t) > 1e-6) return t; return sub(s.b, s.a);
}
/** Which kind of element holds each side of an outline record's ink box: diagCap · axisCap · dot · curve/edge · none. */
export function sideDefiners(rec, box) {
  const sides = { left: new Set(), top: new Set(), right: new Set(), bottom: new Set() };
  for (const p of rec.paths) {
    if (p.paint !== 'stroke') continue;
    const h = p.stroke.weight / 2;
    const cmds = parsePath(p.d);
    const subs = flatten(cmds, 40);
    const segs = segmentsOf(cmds);
    const bySp = new Map();
    for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
    subs.forEach((sp, si) => {
      const list = bySp.get(si) || [];
      let endKinds = [null, null];
      if (!sp.closed && list.length) {
        const total = list.reduce((a, s) => a + len(sub(s.b, s.a)), 0);
        if (total < 1e-6) endKinds = ['dot', 'dot'];
        else endKinds = [fromAxis(startTan(list[0])) > SLANT_DEG ? 'diagCap' : 'axisCap', fromAxis(endTan(list[list.length - 1])) > SLANT_DEG ? 'diagCap' : 'axisCap'];
      }
      const n = sp.pts.length;
      sp.pts.forEach((q, i) => {
        const kind = !sp.closed && (i === 0 || i === n - 1) ? endKinds[i === 0 ? 0 : 1] : 'curve';
        if (Math.abs(q[0] - h - box.x0) < SIDE_REACH) sides.left.add(kind);
        if (Math.abs(q[0] + h - box.x1) < SIDE_REACH) sides.right.add(kind);
        if (Math.abs(q[1] - h - box.y0) < SIDE_REACH) sides.top.add(kind);
        if (Math.abs(q[1] + h - box.y1) < SIDE_REACH) sides.bottom.add(kind);
      });
    });
  }
  const pick = (s) => (s.has('diagCap') ? 'diagCap' : s.has('axisCap') ? 'axisCap' : s.has('dot') ? 'dot' : s.size ? 'curve/edge' : 'none');
  return Object.fromEntries(Object.entries(sides).map(([k, v]) => [k, pick(v)]));
}

/** Every side held by a slanted end in the outline whose solid does not keep it to TOL_BOX. */
export function slantedBreaks(pairs) {
  const out = [];
  for (const P of pairs) {
    const A = analyticBox(P.o), B = analyticBox(P.s);
    const d = sideDiff(A, B), def = sideDefiners(P.o, A);
    for (const side of SIDES) if (def[side] === 'diagCap' && Math.abs(d[side]) > TOL_BOX) out.push({ key: P.key, name: P.name, side, d: d[side] });
  }
  return out.sort((a, b) => a.key.localeCompare(b.key) || SIDES.indexOf(a.side) - SIDES.indexOf(b.side));
}

/** The two ways a pair's box can be compared: four sides, or x / y / width / height (figma.mjs summary's way). */
export function boxTests(a, b, tol = TOL_BOX) {
  const d = sideDiff(a, b);
  const xywh = Math.max(Math.abs(d.left), Math.abs(d.top), Math.abs(d.right - d.left), Math.abs(d.bottom - d.top));
  return { d, sides: maxAbs(d) <= tol, xywh: xywh <= tol };
}

// ── our set, from the pin (untitled-ours.mjs `run` with the icon root as a parameter) ─────────────────

/** Open ends of an icon's stroked subpaths: slanted (> 1 degree off axis) or square-on. */
export function diagEnds(icon) {
  let diag = 0, axis = 0;
  for (const p of icon.paths) {
    if (p.style !== 'stroke') continue;
    const { pieces, subs } = piecesOf(p.d);
    for (const s of subs) {
      if (s.closed || !s.pieces.length) continue;
      const first = pieces[s.pieces[0]], last = pieces[s.pieces[s.pieces.length - 1]];
      for (const t of [tangentOf(first, 0), tangentOf(last, 1)]) {
        if (!t[0] && !t[1]) continue;
        if (fromAxis(t) > SLANT_DEG) diag++; else axis++;
      }
    }
  }
  return { diag, axis };
}

/** Every outline/filled pair at every master of the pin: box difference, line-heavy or not, slanted ends, side holders, `grows:` note. */
export function oursPairs(pinDir) {
  const root = path.join(pinDir, 'src', 'icons');
  const names = fs.readdirSync(path.join(root, '24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.replace(/\.svg$/, '')).sort();
  const rows = [], missing = [];
  for (const m of MASTERS) for (const n of names) {
    const fo = path.join(root, String(m), `${n}.svg`), ff = path.join(root, String(m), `${n}-filled.svg`);
    if (!fs.existsSync(fo) || !fs.existsSync(ff)) { missing.push(`${m}/${n}`); continue; }
    const o = readIcon(fo), f = readIcon(ff);
    const bo = inkBoxOf(o), bf = inkBoxOf(f);
    const d = { left: bf.x0 - bo.x0, top: bf.y0 - bo.y0, right: bf.x1 - bo.x1, bottom: bf.y1 - bo.y1 };
    rows.push({ m, n, d, box: Math.max(...Object.values(d).map(Math.abs)), lineHeavy: !f.hasAreas, diag: diagEnds(o).diag,
      def: sideDefinersOurs(o, bo), grows: /<!--\s*grows:/.test(f.src) });
  }
  return { names, rows, missing };
}

/** The chevron family by name (C12): `chevrons-*` · flat `-2` · steep `-3` · classic; each in small · plain · large. */
export const famOf = (n) => (/^chevrons-/.test(n) ? 'chevrons-up-down' : /-2(-large|-small)?$/.test(n) ? 'flat' : /-3(-large|-small)?$/.test(n) ? 'steep' : 'classic');
export const sizeOf = (n) => (/-large$/.test(n) ? 'large' : /-small$/.test(n) ? 'small' : 'plain');

/** The leg angles of a drawing: straight pieces at least 0.5 long, 5..85 degrees from horizontal. */
export const legAngles = (ic) => ic.paths.flatMap((p) => lineSegs(p.d, { minLength: CHEVRON_MIN_LEN }))
  .filter((s) => s.fromHorizontal > CHEVRON_LEG[0] && s.fromHorizontal < CHEVRON_LEG[1]).map((s) => s.fromHorizontal);

/** Chevron leg angle, outline against filled: |mean leg angle (outline) − mean leg angle (filled)| per pair. */
export function chevronRows(pinDir, names) {
  const root = path.join(pinDir, 'src', 'icons');
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const out = [];
  for (const m of MASTERS) for (const n of names.filter((x) => /^chevron/.test(x))) {
    const o = readIcon(path.join(root, String(m), `${n}.svg`)), f = readIcon(path.join(root, String(m), `${n}-filled.svg`));
    out.push({ m, n, fam: famOf(n), size: sizeOf(n), d: Math.abs(mean(legAngles(o)) - mean(legAngles(f))) });
  }
  return out;
}

/** The flat chevrons at 16, by size: the degrees their filled legs move, as printed in §9 Kind 1 #1. */
export function flatBySize(cr) {
  const f16 = cr.filter((r) => r.fam === 'flat' && r.m === 16);
  const by = (sz) => [...new Set(f16.filter((r) => r.size === sz).map((r) => fx(r.d, 2)))].join('/');
  return { n: f16.length, large: by('large'), small: by('small'), plain: by('plain') };
}

/** The pairs whose box differs (> 0.01), those without a `grows:` note, and the concepts they belong to. */
export function boxBreaks(rows) {
  const all = rows.filter((r) => r.box > TOL_BOX), undeclared = all.filter((r) => !r.grows);
  return { all, undeclared, concepts: new Set(all.map((r) => r.n)) };
}

/** §4a's row for us: concepts at 24 whose outline has at least one slanted open end. */
export function slantedAt24(rows) {
  const R24 = rows.filter((r) => r.m === 24), diag24 = R24.filter((r) => r.diag > 0).length;
  return { R24, diag24 };
}

/** §4c: the concepts BADGE tags a badge, and the rest. */
export function badgeSplit(concepts, BADGE) {
  const badge = concepts.filter((n) => BADGE.test(n)), not = concepts.filter((n) => !BADGE.test(n));
  return { badge, not };
}

/** figma.mjs summary's way: every outline against its concept's one solid (a name with two outlines counts twice), x/y/w/h on the render bounds. */
export function harnessCount(concepts) {
  let n = 0, hold = 0;
  for (const c of concepts) {
    const o = c.records.filter((r) => r.style === 'outline'), s = c.records.filter((r) => r.style === 'filled');
    if (s.length !== 1) continue;
    for (const oo of o) { n++; if (boxTests(renderBox(oo), renderBox(s[0])).xywh) hold++; }
  }
  return { n, hold };
}

/** The side-holder table of §4b/§8: { 'line-heavy | capDiag': {n, hold}, … }. */
export function sideTable(rows) {
  const dt = {};
  for (const r of rows) for (const side of SIDES) {
    const k = (r.lineHeavy ? 'line-heavy' : 'shape-filled') + ' | ' + r.def[side];
    dt[k] = dt[k] || { n: 0, hold: 0 }; dt[k].n++; if (Math.abs(r.d[side]) <= TOL_BOX) dt[k].hold++;
  }
  return dt;
}

// ── sections ────────────────────────────────────────────────────────────────
function makeContext(pinDir, refsDir) {
  const memo = {};
  const once = (k, f) => (k in memo ? memo[k] : (memo[k] = f()));
  return {
    pinDir, refsDir,
    concepts: () => once('c', () => loadConcepts(refsDir, 'untitled')),
    paired: (ctx) => once('p', () => pairsOf(ctx.concepts())),
    dumps: () => once('d', () => rawDumps(refsDir, 'untitled')),
    ours: () => once('o', () => oursPairs(pinDir)),
    chev: (ctx) => once('ch', () => chevronRows(pinDir, ctx.ours().names)),
  };
}

function oursHeadline(ctx) {
  const { names, rows } = ctx.ours();
  const { all, undeclared, concepts } = boxBreaks(rows);
  const { R24, diag24 } = slantedAt24(rows);
  const dt = sideTable(rows), slanted = (dt['line-heavy | capDiag'] || { n: 0, hold: 0 }), slantedS = (dt['shape-filled | capDiag'] || { n: 0, hold: 0 });
  const cr = ctx.chev(ctx), over = (t) => cr.filter((r) => r.d > t).length;
  return { names, rows, all, undeclared, concepts, R24, diag24, dt, slanted, slantedS, cr, over };
}

const RUN = {
  answer(ctx) {
    head('§0 The short answer');
    const sample = ctx.dumps().filter((d) => !d.full);
    for (const d of sample) say(`the first sample (${d.file}): ${d.picked.length} concepts — ${d.picked.map((k) => k.split('|')[1]).join(', ')}`);
    if (!sample.length) say('the first sample: no partial raw dump found');
    const H = oursHeadline(ctx);
    say(`Ours: ${H.diag24} of ${H.R24.length} (${pct(H.diag24, H.R24.length)}) concepts at 24 have an outline with at least one stroke ending on a slant`);
    const sl = H.slanted.n + H.slantedS.n, slh = H.slanted.hold + H.slantedS.hold;
    say(`Ours keep [the sides held by a slanted end] in ${n0(slh)} of ${n0(sl)}`);
    say(`${n0(H.rows.length - H.all.length)} of our ${n0(H.rows.length)} pairs hold to 0.01 on all four sides, and the other ${H.all.length} are the ${H.concepts.size} concepts that declare a \`grows:\` note (${H.undeclared.length} undeclared)`);
    say(`${H.over(0.5)} of our ${H.cr.length} chevron pairs move more than half a degree, up to ${fx(Math.max(...H.cr.map((r) => r.d)), 2)}°`);
  },

  s1(ctx) {
    head('§1 Sample, and why this one');
    const T = recordCensus(ctx.concepts()), dumps = ctx.dumps(), P = ctx.paired(ctx);
    const page = dumps.length ? dumps[0].page : null;
    say(`| Source | Figma page \`${page ? page.name : '?'}\` (\`${page ? page.id : '?'}\`) — every record's pageId: ${JSON.stringify(T.page)} |`);
    const cv = Object.entries(T.canvas).map(([k, v]) => `${k.replace('x', '×')} ×${n0(v)}`).join(' · ');
    say(`| Read | ${n0(ctx.concepts().length)} concepts, ${n0(T.drawings)} drawings, canvas ${cv}; stroke-painted paths ${n0(T.strokePaths)} in ${n0(T.strokeDrawings)} drawings — weight ${JSON.stringify(T.weight)}, caps ${JSON.stringify(T.cap)}, joins ${JSON.stringify(T.join)}, aligned ${JSON.stringify(T.align)} |`);
    say(`| Pairs | ${n0(P.pairs.length)} concepts with exactly one outline and one solid. Set aside: ${P.solidOnly.length} solid-only (${P.solidOnly.map((k) => k.split('/')[1]).join(', ')}), ${P.outlineOnly.length} outline-only (${P.outlineOnly.map((k) => k.split('/')[1]).join(', ')}), ${P.multi.length} duplicated name (${P.multi.map((m) => `${m.key.split('/')[1]}: ${m.outlines} outlines for ${m.solids} solid`).join(', ')}) |`);
    for (const x of nanPaths(dumps, ctx.concepts())) say(`|   NaN | ${x.key}: its ${x.style} drawing in the raw dump ${x.dump} carries ${x.bad.length} of ${x.raw} paths with NaN (${x.bad.map((d) => `"${d}"`).join(', ')}); ingested: ${x.ingested === null ? `no ${x.style} record (the ingest cut it)` : `${x.ingested} paths`} |`);
    const full = dumps.filter((d) => d.full);
    say(`| Why all of it | the whole page was read in ${full.length} bridge calls (raw dumps that pick all ${full.length ? full[0].enumerated : '?'} concepts: ${full.map((d) => `${d.from}–${d.to}`).join(', ')}); ${dumps.length - full.length} more dump(s) hold the first sample |`);
    const sm = Object.entries(T.smoothing).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ×${n0(v)}`).join(' · ');
    say(`corner smoothing on record paths (cornerSmoothingProp; the last Refuse row's "60% smoothing"): ${sm} (of ${n0(T.paths)} paths)`);
  },

  s4(ctx) {
    head('§4 Slanted ends — our rows of 4a and 4b, and 4c');
    const H = oursHeadline(ctx);
    const lh24 = H.R24.filter((r) => r.lineHeavy), lhDiag = lh24.filter((r) => r.diag > 0).length;
    say(`4a | Ours (concepts, 24) | ${H.diag24} | ${H.R24.length} | ${pct(H.diag24, H.R24.length)} |`);
    say(`4a Among ours, ${lhDiag} of the ${lh24.length} line-heavy concepts are slanted-ended (${pct(lhDiag, lh24.length)}).`);
    const all = { n: H.slanted.n + H.slantedS.n, hold: H.slanted.hold + H.slantedS.hold };
    say(`4b | Ours — line-heavy pairs | ${n0(H.slanted.n)} | ${n0(H.slanted.hold)} (${pct(H.slanted.hold, H.slanted.n).replace('.0%', '%')}) |`);
    say(`4b | Ours — shape-filled pairs | ${n0(H.slantedS.n)} | ${n0(H.slantedS.hold)} (${pct(H.slantedS.hold, H.slantedS.n).replace('.0%', '%')}) |`);
    say(`4b | Ours — all | ${n0(all.n)} | ${n0(all.hold)} (${pct(all.hold, all.n).replace('.0%', '%')}) |`);
    say(`4b slanted-end sides are … ${n0(all.n)} of our ${n0(H.rows.length * 4)} (${pct(all.n, H.rows.length * 4)})`);
    const P = ctx.paired(ctx), br = slantedBreaks(P.pairs);
    const BADGE = badgePattern(fs.readFileSync(path.join(REPO, 'tools', 'audit', 'refs', 'untitled-pairs.mjs'), 'utf8'));
    const concepts = [...new Set(br.map((b) => b.name))];
    const { badge, not } = badgeSplit(concepts, BADGE);
    say(`4c The ${br.length} slanted-end sides that break (pairs of every class), in ${concepts.length} concepts:`);
    say(`   ${br.map((b) => `${b.name} ${b.side} ${b.d >= 0 ? '+' : ''}${fx(b.d, 3)}`).join('; ')}`);
    say(`4c tagged a badge by BADGE (untitled-pairs.mjs): ${badge.length} concepts — ${badge.join(', ')}`);
    say(`4c not a badge: ${not.length} — ${not.join(', ')}`);
  },

  s8(ctx) {
    head('§8 Our set, the same questions (from the pin)');
    const H = oursHeadline(ctx);
    const per = MASTERS.map((m) => { const R = H.rows.filter((r) => r.m === m); return { m, n: R.length, hold: R.filter((r) => r.box <= TOL_BOX).length }; });
    const same = per.every((p) => p.hold === per[0].hold && p.n === per[0].n);
    say(`| Pairs holding the outer box to 0.01 | ${n0(H.rows.length - H.all.length)} of ${n0(H.rows.length)} (${pct(H.rows.length - H.all.length, H.rows.length)}) — ${same ? `${per[0].hold} of ${per[0].n} at each of 24, 20, 16` : per.map((p) => `${p.hold} of ${p.n} at ${p.m}`).join(', ')} |`);
    const byC = {}; for (const r of H.all) (byC[r.n] = byC[r.n] || {})[r.m] = r.box;
    const atAll = Object.values(byC).filter((v) => MASTERS.every((m) => v[m] !== undefined)).length;
    const sizes = MASTERS.map((m) => `${[...new Set(H.all.filter((r) => r.m === m).map((r) => r3(r.box)))].sort((a, b) => a - b).join(' or ')} at ${m}`).join(', ');
    say(`| The other ${H.all.length} | ${H.concepts.size} concepts, ${atAll} of them differing at all three masters (${sizes}); files carrying a \`<!-- grows: -->\` note in the filled file: ${H.all.length - H.undeclared.length} of ${H.all.length}; undeclared breaks: ${H.undeclared.length}. They are: ${[...H.concepts].sort().join(', ')} |`);
    const lh = H.rows.filter((r) => r.lineHeavy);
    say(`| Line-heavy concepts (filled = a heavier stroke, no area) | ${H.R24.filter((r) => r.lineHeavy).length} at 24, ${lh.length} pairs across the three masters |`);
    const ax = H.dt['line-heavy | capAxis'] || { n: 0, hold: 0 }, cu = H.dt['line-heavy | curve/edge'] || { n: 0, hold: 0 };
    say(`| Slanted-end sides in line-heavy pairs | ${n0(H.slanted.hold)} of ${n0(H.slanted.n)} equal to 0.01 (axis-end sides ${n0(ax.hold)} of ${n0(ax.n)} and contour sides ${n0(cu.hold)} of ${n0(cu.n)}) |`);
    const cr = H.cr, chevN = new Set(cr.map((r) => r.n)).size;
    say(`chevrons: ${chevN} chevron concepts × 3 masters = ${cr.length} pairs. The mean angle of the slanted legs moves more than 0.5° in ${H.over(0.5)}, more than 1° in ${H.over(1)}, more than 2° in ${H.over(2)}, at most ${fx(Math.max(...cr.map((r) => r.d)), 3)}°:`);
    say('| family | 24 | 20 | 16 |   (each cell: pairs over 0.5° of the family\'s pairs, smallest–largest change)');
    for (const [fam, label] of [['classic', 'classic 45° (`chevron-*`)'], ['flat', 'flat ~34° (`chevron-*-2`)'], ['steep', 'steep ~52° (`chevron-*-3`)'], ['chevrons-up-down', '`chevrons-up-down*`']]) {
      const cells = MASTERS.map((m) => { const R = cr.filter((r) => r.fam === fam && r.m === m); const ds = R.map((r) => r.d); return R.length ? `${R.filter((r) => r.d > 0.5).length} of ${R.length}, ${fx(Math.min(...ds), 2)}–${fx(Math.max(...ds), 2)}°` : 'none'; });
      say(`| ${label} | ${cells.join(' | ')} |`);
    }
    say(`${cr.filter((r) => r.fam === 'flat' && r.d > 0.5).length} of the ${H.over(0.5)} are the flat family.`);
  },

  s9(ctx) {
    head('§9 Findings about us');
    const H = oursHeadline(ctx);
    const B = flatBySize(H.cr);
    say(`Kind 1 #1: the ${B.n} flat chevrons at 16 have filled legs flatter than their outlines by ${B.large}° (\`-2-large\`), ${B.small}° (\`-2-small\`) and ${B.plain}° (plain)`);
    const flat = H.cr.filter((r) => r.fam === 'flat');
    say(`Kind 2 #1: the flat family: ${flat.filter((r) => r.d > 0.5).length} of its ${flat.length} pairs move more than 0.5°`);
  },

  s11(ctx) {
    head('§11 Instruments, data notes — two ways to test a box');
    const H = harnessCount(ctx.concepts());
    say(`the harness's way (x, y, width, height on Figma's render bounds; every outline against its concept's one solid, so a name with two outlines counts twice): ${n0(H.n)} pairs, ${n0(H.hold)} hold to 0.01`);
    const P = ctx.paired(ctx);
    const T = { sA: 0, sR: 0, wA: 0, wR: 0 }, dis = [];
    for (const p of P.pairs) {
      const a = boxTests(analyticBox(p.o), analyticBox(p.s)), r = boxTests(renderBox(p.o), renderBox(p.s));
      T.sA += a.sides; T.sR += r.sides; T.wA += a.xywh; T.wR += r.xywh;
      if (a.sides !== a.xywh || r.sides !== r.xywh) dis.push({ p, a, r });
    }
    say(`the ${n0(P.pairs.length)} clean pairs: four sides to 0.01 — from the path ${n0(T.sA)}, from the render bounds ${n0(T.sR)}; x/y/width/height to 0.01 — from the path ${n0(T.wA)}, from the render bounds ${n0(T.wR)}`);
    const sd = (d) => SIDES.map((k) => `${k} ${d[k] >= 0 ? '+' : ''}${fx(d[k], 4)}`).join(' ');
    for (const { p, a, r } of dis.sort((x, y) => x.p.key.localeCompare(y.p.key))) say(`   the two tests disagree: ${p.name} — path: ${sd(a.d)} (sides ${a.sides ? 'hold' : 'break'}, x/y/w/h ${a.xywh ? 'hold' : 'break'}) | render: ${sd(r.d)} (sides ${r.sides ? 'hold' : 'break'}, x/y/w/h ${r.xywh ? 'hold' : 'break'})`);
  },
};

export function main(argv = process.argv.slice(2)) {
  const usage = 'usage: node tools/audit/untitled-probe.mjs <pin-dir> [section …] [--refs <dir>]\n  sections: ' + SECTIONS.join(' ');
  const refsAt = argv.indexOf('--refs');
  const refsDir = path.resolve(refsAt >= 0 ? argv[refsAt + 1] || '' : path.join(REPO, 'research', 'references'));
  const pos = argv.filter((a, i) => !a.startsWith('--') && !(refsAt >= 0 && i === refsAt + 1));
  const unknownFlag = argv.find((a, i) => a.startsWith('--') && a !== '--refs');
  if (unknownFlag) { console.error(`unknown flag ${unknownFlag}\n${usage}`); return 2; }
  const pinDir = pos[0] ? path.resolve(pos[0]) : null;
  if (!pinDir || !MASTERS.every((m) => fs.existsSync(path.join(pinDir, 'src', 'icons', String(m))))) { console.error(usage); return 2; }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !SECTIONS.includes(s));
  if (bad.length) { console.error(`unknown section ${bad.join(', ')}\n${usage}`); return 2; }
  if (!fs.existsSync(path.join(refsDir, 'untitled', 'figma'))) { console.error(`no Untitled records under ${refsDir}/untitled/figma\n${usage}`); return 2; }
  const ctx = makeContext(pinDir, refsDir);
  console.log(`# untitled-probe — docs/audit/references-untitled.md (card 2.4); pin ${pinDir}; refs ${refsDir}`);
  for (const s of SECTIONS.filter((x) => !wanted.length || wanted.includes(x))) RUN[s](ctx);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
