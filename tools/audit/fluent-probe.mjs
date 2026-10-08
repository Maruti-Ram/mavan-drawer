#!/usr/bin/env node
// Every measured figure in docs/audit/references-fluent.md (card 2.1, "Fluent — what it holds and
// what it lets go, from 12 up to 48"), printed again from the pin and the ingested Fluent records.
// AUDIT ONLY — imported by nothing; reads the pin and research/references/, writes nothing.
//
// Usage:
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P
//   node tools/audit/fluent-probe.mjs $P [section …] [--refs <dir>]
// `--refs` is the references root (default: this repo's research/references, gitignored and present
// on Maruti's machine). Fluent is read from <refs>/fluent/figma/*.json — the records card 2.1
// ingested with tools/audit/refs/figma.mjs on 2026-10-04 from file rdI0uXVzp89fOZpYcQV6mo, page
// 1124:9833 "System icons". Nothing is extracted from Figma again. Our side is read from
// <pin>/src/icons/{24,20,16}.
//
// Sections (default: all), each backing one part of the document:
//   answer         "The short answer"                        1 s
//   sample         "Sample, and why this one" + provenance    2 s
//   sample-groups  the Sample §'s "< two points between the two groups" — NO ORIGINAL CODE: the
//                  probe's own reconstruction (see below)    ~2.5 min (needs the gap pass)
//   approx         "Instruments" → "Three approximations"     1.5 s
//   s1             §1 The stroke table, re-measured           1.5 s
//   s2             §2 The hold/give table                     ~2.5 min (gap pass)
//   s3             §3 The detail-death order                  2 s
//   s4             §4 Where the curve bends                   ~2.5 min (gap pass)
//   s5             §5 Us against them, normalised             ~2.5 min (gap pass)
//   s6             §6 Take / refuse / why                     ~2.5 min (gap pass)
//   s7             §7 What this card corrects                 ~2.5 min (gap pass)
//   s8             §8 What only Maruti's eye can settle       2 s
// The gap pass (facingGap + materialGap on 2,522 Fluent and 2,910 of our drawings) runs once per
// process and is shared, so a full run costs about the same as one gap section: 2 min 10 s to 3 min
// 20 s on this Mac (2026-10-08, three runs, other agents running); 7 min 10 s once under heavy load.
// §9 ("How to reproduce this") states no figure. Quoted guideline text (§2, §5, §6) came from the
// Figma Guidelines page and is not reprintable without Figma; the probe does not print it.
//
// Where the logic came from: the card's own scripts, kept beside the data at
// research/references/fluent/figma/card-2.1/ (measure.mjs, gaps.mjs, an1–an9.mjs) and the author's
// inline commands in transcript agent-a4eabd65d66f243ae (2026-10-04). Each function below names
// the script it replaces. Every parameter is the one those scripts used; none was tuned here.
//
// Instruments: tools/geometry.mjs (bbox, subpathsOf, facingGap, materialGap), tools/audit/angles.mjs
// (anglesOf, ranked by `dev`), tools/audit/radii.mjs (radiiOf), tools/masters.mjs (STROKES,
// FILLED_WEIGHT, MASTERS keylines). Not tools/audit/refs/figma.mjs: its records are read as data.
//
// "Identical box" (§6 R2's 96.3%, on the plan's wave-5 reconcile list against card 1.8's 1,100 of 1,455): per
// master, our outline and filled PATH boxes (geometry.bbox, 3 dp) whose width and height agree within 0.02,
// position ignored. R2 prints this definition beside the figure.
//
// Known instrument defects and how this probe stands with them:
// - geometry.mjs `samplePath` reads a C/S/Q curve by its CONTROL POINTS, not the curve (found by the closing check,
//   2026-10-09): `bbox` of M0 0 C0 10 10 10 10 0 is 10 tall where the curve is 7.5, and `facingGap` / `materialGap`
//   build their rings the same way. Our drawings carry no curves; Fluent is all cubics. So every Fluent box, margin,
//   keyline, gap and material figure is exposed (angles.mjs and radii.mjs read curves with their own pieces and are
//   not). The probe therefore runs every section twice — once as the instrument samples it (what the document
//   reported) and once on true geometry (each record's curves flattened by `flattenCurves` to points on the curve,
//   at most FLAT_STEP apart) — and prints a line twice, labelled, wherever the two readings differ. Our side is read
//   once and shared. geometry.mjs is not edited.
// - figma.mjs `measure.ink` (Figma render bounds) is wrong on rotated or flipped nodes. Every Fluent
//   box here is the PATH's box (geometry.bbox on each record's `d`), as card 2.1 did. ONE figure
//   used `measure.ink`: §4's "confirmed independently from the extractor's own render bounds". §4
//   prints that reading beside the path reading and counts where they disagree.
// - geometry.mjs `bbox` samples arcs (can sit up to 0.0056 inside the true edge). Card 2.1 used it
//   and compared boxes at 0.02, so the probe does too; no figure here is quoted finer than 0.01.
// - raster.mjs `classify`, pixelgrid.mjs, congruence.mjs, optical-sheet.mjs: not used.
// - Fluent's fills are NONZERO; facingGap/materialGap read even-odd (the card's approximation 1).
//
// sample-groups: the document says every hold/give figure "moves by less than two points between
// the two groups" (the 102 seven-size concepts against the even 100). No code for that comparison
// exists in the card's scripts or transcript. This section is the probe's reconstruction — the
// share-type rows of §2 per group, and the largest gap between groups in percentage points — and is
// labelled as such in its output. It is evidence for wave 5, not a reprint.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { bbox, subpathsOf, facingGap, materialGap, parsePath } from '../geometry.mjs';
import { STROKES, FILLED_WEIGHT, MASTERS } from '../masters.mjs';
import { anglesOf } from './angles.mjs';
import { radiiOf } from './radii.mjs';

// ── parameters (the card's own choices, recovered from its scripts) ───────────────────────────────
export const SIZES = [12, 16, 20, 24, 28, 32, 48];          // Fluent's seven canvases
export const OURS = [24, 20, 16];
export const TRI = [16, 20, 24];                             // the span we draw (an2 §1, §5)
export const RESERVED = new Set(['index.json', 'catalogue.json', 'calibration.json']);
export const SPREAD_N = 100;                                 // the even spread from the 3–6 band
export const CALIBRATION_GLYPH = 'Subtract';                 // gaps.mjs adds it to the sample
export const EQ = 0.02;                                      // box/margin/ink-floor equality (measure, an1–an6)
export const EQ_CUT = 0.03;                                  // knockout "exactly the stroke" (an6 7c)
export const ON_AXIS = 0.5;                                  // deg; angles tolerance and "on-axis" (an5 6c)
export const MATCH_MAX = 0.25;                               // part matcher: not the same part above this (an2 §4)
export const PLAUSIBLE = 6;                                  // a death under 6 strokes is plausible (an5 6e)
export const LOW_SEP = 0.35;                                 // "extreme low separation" (an6 7b)
export const BREACH = 1.49;                                  // ours: air under the 1.5 floor (an3)
export const FLAT_STEP = 0.1;                                // true geometry: curve points at most this far apart (sagitta ≤ 0.005 at r 0.25)
export const GROUP_MIN_N = 10;                               // sample-groups only (the probe's own choice, not the card's)
export const HAND_READ_MIN_SHARE = 0.05;                     // §5 'largest common corner' was read by eye; the probe's stated rule
export const PLAN_ASSUMED = 2;                               // the plan's ~2× (K3 quotes it), the divisor for 'share of the size assumed'
// Circle-container concepts. an4 5b's list (CIRC_AN4) is what the card read the keyline off; §4
// names eleven "genuine" ones (CIRC_GENUINE). Judgement lists, kept as the card wrote them.
export const CIRC_AN4 = ['Add Circle', 'Dismiss Circle', 'Subtract Circle', 'Question Circle', 'Chevron Circle',
  'Arrow Circle Down', 'Arrow Circle Up', 'Arrow Circle Left', 'Arrow Circle Right', 'Heart Circle',
  'Arrow Sync Circle', 'Number Circle 2', 'Circle', 'Record'];
export const CIRC_GENUINE = ['Add Circle', 'Dismiss Circle', 'Subtract Circle', 'Question Circle', 'Chevron Circle',
  'Arrow Circle Down', 'Arrow Circle Up', 'Arrow Circle Left', 'Arrow Circle Right', 'Number Circle 2', 'Record'];
export const CIRC_RENDER = ['Add Circle', 'Dismiss Circle', 'Subtract Circle', 'Question Circle', 'Chevron Circle', 'Record']; // an7 8c
export const LINE_GLYPHS = ['Add', 'Dismiss', 'Checkmark'];  // §1: capped line glyphs (an6 7a)
export const NAMED_DEATHS = [['Globe', '16->12'], ['Bot', '16->12'], ['Tooltip Quote', '16->12'], ['Guest', '16->12'],
  ['Globe Off', '20->16'], ['Emoji Meme', '20->16'], ['Archive Clock', '20->16']];
export const ZERO_AREA = [['Eye', '28->24'], ['Window Wrench', '24->20'], ['Hand', '24->20']];
export const OUR_RUN_NAMES = ['sliders-2', 'building', 'building-2', 'gear-3', 'trash', 'chart-bar-3', 'microphone',
  'book-4', 'keyboard', 'images', 'database', 'watch', 'compass'];
// R3's named badge-to-base readings: the document's (concept, size) pairs; the last five name no size in the text and
// take it from an6 7b's printed list. Fixed pairs, so both readings (instrument / true geometry) read the same drawings.
export const R3_PAIRS = [['Agents Add', 24], ['Archive Clock', 28], ['Comment Add', 28], ['Folder Add', 28], ['Cloud Sync', 28],
  ['Desktop Arrow Right', 24], ['Document Error', 24], ['Document Sync', 24], ['Clear Formatting', 24], ['Earth Leaf', 32]];

// ── small helpers (the card's own: round-half-up via Math.round, index quantile, no interpolation) ─
export const r3 = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 1000) / 1000 : v);
export const r2 = (v) => (v == null || !Number.isFinite(v) ? '—' : (Math.round(v * 100) / 100).toFixed(2));
export const pct = (v, dp = 1) => (v == null || !Number.isFinite(v) ? '—' : (v * 100).toFixed(dp) + '%');
export const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
export const qq = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y);
  return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };
/** pct, but a whole 100% or 0% loses its ".0" — where the document writes them that way. */
export const pctW = (v) => (v === 1 ? '100%' : v === 0 ? '0%' : pct(v));
/** pct at 2 dp when the value is exact there (6.25%), else 1 dp (8.3%) — §5's share row as the document writes it. */
export const pctX = (v) => { const h = v * 10000; return Math.abs(h - Math.round(h)) < 1e-6 && Math.round(h) % 10 !== 0 ? pct(v, 2) : pct(v); };
export const minMargin = (d) => Math.min(d.margin.l, d.margin.r, d.margin.t, d.margin.b);
const cmdCount = (d) => (String(d).match(/[A-Za-z]/g) || []).length;
const dot = (xs) => xs.join(' · ');
const range = (xs, f) => { const v = xs.filter((x) => x != null && Number.isFinite(x)); return `${f(Math.min(...v)).replace(/%$/, '')}–${f(Math.max(...v))}`; };

// ── true geometry (the geometry.mjs cubic-sampling defect) ──────────────────────────────────────
/** A point on a Bézier of any degree (de Casteljau). */
export function bezierAt(pts, t) {
  let q = pts.map((p) => [...p]);
  while (q.length > 1) q = q.slice(1).map((p, i) => [q[i][0] + (p[0] - q[i][0]) * t, q[i][1] + (p[1] - q[i][1]) * t]);
  return q[0];
}
/** `d` with every C/S/Q/T curve replaced by points ON the curve, at most `step` apart (at least 8 per curve), and
 *  every other command made absolute. geometry.mjs's samplePath reads a curve by its control points; the
 *  instruments read this one as the curve. M/L/H/V/A/Z keep their geometry exactly. */
export function flattenCurves(d, step = FLAT_STEP) {
  const out = [], f = (v) => String(Math.round(v * 1e6) / 1e6 || 0);
  let cx = 0, cy = 0, sx = 0, sy = 0, pc = null, pq = null;
  const L = (x, y) => out.push(`L${f(x)} ${f(y)}`);
  const curve = (pts) => {
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const n = Math.max(8, Math.ceil(len / step));
    for (let i = 1; i <= n; i++) { const [x, y] = bezierAt(pts, i / n); L(x, y); }
  };
  for (const { cmd, args } of parsePath(d)) {
    const up = cmd.toUpperCase(), rel = cmd !== up;
    if (up === 'Z') { out.push('Z'); cx = sx; cy = sy; pc = pq = null; continue; }
    const n = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }[up];
    for (let k = 0; k + n <= args.length; k += n) {
      const a = args.slice(k, k + n), ox = rel ? cx : 0, oy = rel ? cy : 0, P = (i) => [ox + a[i], oy + a[i + 1]];
      if (up === 'M') { [cx, cy] = P(0); if (k === 0) { sx = cx; sy = cy; out.push(`M${f(cx)} ${f(cy)}`); } else L(cx, cy); pc = pq = null; }
      else if (up === 'L') { [cx, cy] = P(0); L(cx, cy); pc = pq = null; }
      else if (up === 'H') { cx = ox + a[0]; L(cx, cy); pc = pq = null; }
      else if (up === 'V') { cy = oy + a[0]; L(cx, cy); pc = pq = null; }
      else if (up === 'C') { const c1 = P(0), c2 = P(2), e = P(4); curve([[cx, cy], c1, c2, e]); pc = c2; pq = null; [cx, cy] = e; }
      else if (up === 'S') { const c1 = pc ? [2 * cx - pc[0], 2 * cy - pc[1]] : [cx, cy], c2 = P(0), e = P(2); curve([[cx, cy], c1, c2, e]); pc = c2; pq = null; [cx, cy] = e; }
      else if (up === 'Q') { const c1 = P(0), e = P(2); curve([[cx, cy], c1, e]); pq = c1; pc = null; [cx, cy] = e; }
      else if (up === 'T') { const c1 = pq ? [2 * cx - pq[0], 2 * cy - pq[1]] : [cx, cy], e = P(0); curve([[cx, cy], c1, e]); pq = c1; pc = null; [cx, cy] = e; }
      else if (up === 'A') { const e = [ox + a[5], oy + a[6]]; out.push(`A${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${f(e[0])} ${f(e[1])}`); [cx, cy] = e; pc = pq = null; }
    }
  }
  return out.join('');
}

// ── reading ────────────────────────────────────────────────────────────────────────────────────────
/** Every ingested Fluent document under <refs>/fluent/figma, sorted by file name. */
export function readFluentDocs(refs, { flatten = false } = {}) {
  const dir = join(refs, 'fluent', 'figma');
  const out = [];
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith('.json') || RESERVED.has(f)) continue;
    const doc = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const page = typeof doc.page === 'string' ? doc.page : doc.page && doc.page.name;
    const records = doc.records || [];
    if (flatten) for (const r of records) for (const q of (r.paths || [])) q.g = flattenCurves(q.d);
    out.push({ file: f, page, name: doc.name, records });
  }
  return out;
}
export const readCatalogue = (refs) => JSON.parse(readFileSync(join(refs, 'fluent', 'figma', 'catalogue.json'), 'utf8'));

/** The card's sample, rebuilt from the catalogue (transcript a4eabd65, tool_use 01Q4epQmqYdUueatmJ46KYg5). */
export function sampleFromCatalogue(cat, n = SPREAD_N) {
  const nsize = (ax) => { const m = /Size:(\d+)/.exec(ax || ''); return m ? Number(m[1]) : 0; };
  const rows = cat.rows;
  const dist = {};
  for (const r of rows) dist[nsize(r[5])] = (dist[nsize(r[5])] || 0) + 1;
  const all7 = rows.filter((r) => nsize(r[5]) === 7).map((r) => r[1]);
  const band = rows.filter((r) => nsize(r[5]) >= 3 && nsize(r[5]) <= 6);
  const spread36 = Array.from({ length: n }, (_, k) => band[Math.floor(((k + 0.5) * band.length) / n)][1]);
  return { sets: rows.length, names: new Set(rows.map((r) => r[1])).size, dist, all7, band: band.length,
           spread36, sample: [...all7, ...spread36], page: cat.page, file: cat.file, at: cat.at };
}

// ── one drawing measured (measure.mjs `measureDrawing`, verbatim in behaviour) ─────────────────────
export function measureDrawing({ paths, canvas, stroke, label, filled }) {
  const icon = { file: label, name: label, master: canvas, filled: !!filled,
    paths: paths.map((p, i) => ({ index: i, d: p.d, style: p.style })),
    hasAreas: paths.some((p) => p.style === 'area'), stroke, halfStroke: stroke / 2, outlineHalf: stroke / 2 };
  // `g` (true geometry, curves flattened) feeds the boxes; the original `d` feeds the command count, angles and radii
  const geo = paths.map((p) => p.g ?? p.d);
  let ink = null;
  for (const [i, p] of icon.paths.entries()) {
    const b = bbox([geo[i]]);
    const h = p.style === 'stroke' ? icon.halfStroke : 0;
    const g = { x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h };
    ink = ink ? { x0: Math.min(ink.x0, g.x0), y0: Math.min(ink.y0, g.y0), x1: Math.max(ink.x1, g.x1), y1: Math.max(ink.y1, g.y1) } : g;
  }
  const subs = [];
  for (const [i, p] of icon.paths.entries()) for (const sd of subpathsOf(geo[i])) {
    const b = bbox([sd]);
    const h = p.style === 'stroke' ? icon.halfStroke : 0;
    subs.push({ x0: b.x0 - h, y0: b.y0 - h, w: b.x1 - b.x0 + 2 * h, h: b.y1 - b.y0 + 2 * h, cmds: cmdCount(sd) });
  }
  subs.sort((a, b) => (b.w * b.h) - (a.w * a.h));
  let angles;
  try {
    const a = anglesOf(icon, { tolerance: ON_AXIS, minLength: canvas / 48 });
    const devs = a.segments.map((s) => s.dev);
    angles = { n: a.segments.length, maxDev: devs.length ? r3(Math.max(...devs)) : null,
               gt1: devs.filter((d) => d > 1).length, gt5: devs.filter((d) => d > 5).length };
  } catch (e) { angles = { error: String(e.message).slice(0, 80) }; }
  let corners;
  try {
    const R = radiiOf(icon, { minLeg: canvas / 24 });
    corners = { radii: R.corners.filter((c) => c.kind !== 'sharp').map((c) => ({ r: r3(c.radius), role: c.role })) };
  } catch (e) { corners = { error: String(e.message).slice(0, 80) }; }
  return {
    canvas, stroke: r3(stroke),
    ink: { x: r3(ink.x0), y: r3(ink.y0), w: r3(ink.x1 - ink.x0), h: r3(ink.y1 - ink.y0) },
    margin: { l: r3(ink.x0), t: r3(ink.y0), r: r3(canvas - ink.x1), b: r3(canvas - ink.y1) },
    nPaths: icon.paths.length, nSubs: subs.length, nCmds: icon.paths.reduce((t, p) => t + cmdCount(p.d), 0),
    subs: subs.map((s) => ({ w: r3(s.w), h: r3(s.h), x: r3(s.x0), y: r3(s.y0) })), angles, corners,
  };
}

/** Fluent drawings of the sample (measure.mjs part 1). `ink` is the path box; `inkRender` is figma.mjs's measure.ink. */
export function fluentDrawings(docs, sampleNames) {
  const want = new Set(sampleNames), out = [];
  for (const doc of docs) {
    if (doc.page !== 'System icons' || !want.has(doc.name)) continue;
    for (const rec of doc.records) {
      if (!rec.paths || !rec.paths.length) continue;
      const sw = rec.strokeBasis && rec.strokeBasis.value;
      if (!sw) continue;
      const paths = rec.paths.map((p) => ({ d: p.d, g: p.g, style: p.paint === 'fill' ? 'area' : 'stroke' }));
      const m = measureDrawing({ paths, canvas: rec.canvas[0], stroke: sw, label: `${rec.name}@${rec.master}-${rec.style}`, filled: rec.style === 'filled' });
      const ri = rec.measure && rec.measure.ink;
      out.push({ src: 'fluent', concept: rec.name, size: rec.master, style: rec.style, theme: rec.variant && rec.variant.Theme,
                 sizesAvailable: (rec.meta && rec.meta.axes && rec.meta.axes.Size && rec.meta.axes.Size.values.length) || null,
                 inkRender: ri ? { w: r3(ri.w.abs), h: r3(ri.h.abs) } : null, inkSource: rec.measure && rec.measure.inkSource,
                 rotatedNodes: (rec.meta && rec.meta.flags && rec.meta.flags.rotated) || 0, ...m });
    }
  }
  return out;
}

/** One of our SVGs as the card read it: area = stroke="none" + fill="currentColor"; the root stroke-width. */
export function parseOurSvg(src, master) {
  const rootSW = Number((src.match(/<svg[^>]*stroke-width="([\d.]+)"/) || [])[1] || STROKES[master]);
  const paths = [];
  for (const mm of src.matchAll(/<path\b([^>]*)\/>/g)) {
    const d = (mm[1].match(/\sd="([^"]+)"/) || [])[1];
    if (!d) continue;
    paths.push({ d, style: /stroke="none"/.test(mm[1]) && /fill="currentColor"/.test(mm[1]) ? 'area' : 'stroke' });
  }
  const hasAreas = paths.some((p) => p.style === 'area');
  return { rootSW, paths, hasAreas, stroke: hasAreas ? STROKES[master] : rootSW };
}

/** Our drawings from the pin (measure.mjs part 2). */
export function ourDrawings(pin) {
  const out = [];
  for (const m of OURS) {
    const dir = join(pin, 'src', 'icons', String(m));
    for (const f of readdirSync(dir).sort()) {
      if (!f.endsWith('.svg')) continue;
      const name = f.replace(/\.svg$/, ''), filled = /-filled$/.test(name);
      const s = parseOurSvg(readFileSync(join(dir, f), 'utf8'), m);
      out.push({ src: 'ours', concept: name.replace(/-filled$/, ''), size: m, style: filled ? 'filled' : 'outline',
                 hasAreas: s.hasAreas, ...measureDrawing({ paths: s.paths, canvas: m, stroke: s.stroke, label: name, filled }) });
    }
  }
  return out;
}

// ── the gap pass (gaps.mjs) ────────────────────────────────────────────────────────────────────────
/** facingGap + materialGap with the card's cap: (canvas / 24) × 2.5, so a 48 is not read with a 24's window. */
export function gapsOf({ ds, areas, stroke, canvas, material = true }) {
  let fg = null, mg = null, err = null;
  try { fg = facingGap(ds, stroke || 0, areas, { cap: (canvas / 24) * 2.5 }); } catch (e) { err = 'fg:' + e.message.slice(0, 50); }
  try { mg = material && areas.length ? materialGap(areas) : null; } catch (e) { err = (err || '') + ' mg:' + e.message.slice(0, 50); }
  return { air: fg ? fg.area.map((a) => ({ kind: a.kind, gap: a.gap })) : null, selfAir: fg ? fg.self.map((a) => a.gap) : null,
           material: mg ? mg.gap : null, err };
}
export function fluentGapRows(docs, sampleNames) {
  const want = new Set([...sampleNames, CALIBRATION_GLYPH]), rows = [];
  for (const doc of docs) {
    if (doc.page !== 'System icons' || !want.has(doc.name)) continue;
    for (const rec of doc.records) {
      if (!rec.paths || !rec.paths.length) continue;
      const areas = rec.paths.filter((p) => p.paint === 'fill').map((p) => p.g ?? p.d);
      const ds = rec.paths.filter((p) => p.paint !== 'fill').map((p) => p.g ?? p.d);
      rows.push({ src: 'fluent', concept: rec.name, size: rec.master, style: rec.style, canvas: rec.canvas[0],
                  ...gapsOf({ ds, areas, stroke: rec.strokeBasis && rec.strokeBasis.value, canvas: rec.canvas[0] }) });
    }
  }
  return rows;
}
export function ourGapRows(pin) {
  const rows = [];
  for (const m of OURS) {
    const dir = join(pin, 'src', 'icons', String(m));
    for (const f of readdirSync(dir).sort()) {
      if (!f.endsWith('.svg')) continue;
      const name = f.replace(/\.svg$/, '');
      const s = parseOurSvg(readFileSync(join(dir, f), 'utf8'), m);
      rows.push({ src: 'ours', concept: name.replace(/-filled$/, ''), size: m, style: /-filled$/.test(name) ? 'filled' : 'outline',
                  canvas: m, hasAreas: s.hasAreas, ...gapsOf({ ds: s.paths.filter((p) => p.style !== 'area').map((p) => p.d),
                  areas: s.paths.filter((p) => p.style === 'area').map((p) => p.d), stroke: s.stroke, canvas: m }) });
    }
  }
  return rows;
}

// ── analyses (each names the card script it replaces) ──────────────────────────────────────────────
/** The line weight per size: the records' calibrated `strokeBasis` (an1 §0), and the bar glyph's own path (check). */
export function strokeLadder(fluent, docs) {
  const basis = {};
  for (const s of SIZES) basis[s] = [...new Set(fluent.filter((d) => d.size === s && d.style === 'outline').map((d) => d.stroke))];
  const bar = { outline: {}, filled: {} };
  const doc = docs.find((d) => d.page === 'System icons' && d.name === CALIBRATION_GLYPH);
  for (const rec of (doc ? doc.records : [])) {
    if (!rec.paths || rec.paths.length !== 1 || !bar[rec.style]) continue;
    const b = bbox([rec.paths[0].g ?? rec.paths[0].d]);
    bar[rec.style][rec.master] = r3(Math.min(b.x1 - b.x0, b.y1 - b.y0));
  }
  return { basis, bar };
}

/** Per-side growth of the filled box over the outline's on line glyphs (an6 7a): max(Δw, Δh) / 2, first record wins. */
export function lineGrowth(rows, concept, sizes) {
  return sizes.map((s) => {
    const o = rows.find((d) => d.concept === concept && d.size === s && d.style === 'outline');
    const f = rows.find((d) => d.concept === concept && d.size === s && d.style === 'filled');
    return o && f ? Math.max(f.ink.w - o.ink.w, f.ink.h - o.ink.h) / 2 : null;
  });
}

/** Concept → size → drawing, the LAST record winning (an4 5f, an5 6b–6d build their maps this way). */
const lastWins = (rows, style) => {
  const m = new Map();
  for (const d of rows) if (!style || d.style === style) { if (!m.has(d.concept)) m.set(d.concept, {}); m.get(d.concept)[d.size] = d; }
  return m;
};
/** Concept → its rows, in order (an2's `byC`; `find` then takes the FIRST record at a size). */
const byConcept = (rows) => { const m = new Map(); for (const d of rows) { if (!m.has(d.concept)) m.set(d.concept, []); m.get(d.concept).push(d); } return m; };

/** an2 §1: the 16/20/24 trio per concept — spreads of the canvas share and exact subpath / command counts. */
export function triHold(rows) {
  const sp = [], subs = [], cmds = [];
  for (const [, rr] of byConcept(rows)) {
    const r = TRI.map((s) => rr.find((d) => d.size === s)).filter(Boolean);
    if (r.length !== 3) continue;
    const mx = r.map((d) => Math.max(d.ink.w, d.ink.h) / d.size);
    sp.push(Math.max(...mx) - Math.min(...mx));
    subs.push(Math.max(...r.map((d) => d.nSubs)) - Math.min(...r.map((d) => d.nSubs)));
    cmds.push(Math.max(...r.map((d) => d.nCmds)) - Math.min(...r.map((d) => d.nCmds)));
  }
  return { n: sp.length, spreadMed: med(sp), spreadP90: qq(sp, 0.9),
           subsExact: subs.filter((x) => x === 0).length / subs.length, cmdsExact: cmds.filter((x) => x === 0).length / cmds.length };
}

/** an2 §3: per adjacent present step (big → small), how many concepts lost a subpath. */
export function lossLadder(rows, sizes) {
  const steps = new Map();
  for (const [, rr] of byConcept(rows)) {
    const present = sizes.filter((s) => rr.some((d) => d.size === s));
    for (let i = present.length - 1; i > 0; i--) {
      const big = rr.find((d) => d.size === present[i]), sm = rr.find((d) => d.size === present[i - 1]);
      const key = `${present[i]}->${present[i - 1]}`;
      if (!steps.has(key)) steps.set(key, { pairs: 0, lost: 0 });
      const e = steps.get(key);
      e.pairs++;
      if (sm.nSubs < big.nSubs) e.lost++;
    }
  }
  return steps;
}

/** an2 §4: match subpaths across one step on normalised centre + size; an unmatched big-master part has died. */
export function orphans(rows, sizes) {
  const died = [], kept = [];
  for (const [name, rr] of byConcept(rows)) {
    const present = sizes.filter((s) => rr.some((d) => d.size === s));
    for (let i = present.length - 1; i > 0; i--) {
      const big = rr.find((d) => d.size === present[i]), sm = rr.find((d) => d.size === present[i - 1]);
      const B = big.subs.map((x, k) => ({ k, cx: (x.x + x.w / 2) / big.size, cy: (x.y + x.h / 2) / big.size, w: x.w / big.size, h: x.h / big.size,
                                          absMin: Math.min(x.w, x.h), absMinSmall: (Math.min(x.w, x.h) * sm.size) / big.size }));
      const S = sm.subs.map((x, k) => ({ k, cx: (x.x + x.w / 2) / sm.size, cy: (x.y + x.h / 2) / sm.size, w: x.w / sm.size, h: x.h / sm.size }));
      const score = [];
      for (const b of B) for (const s of S) score.push([Math.hypot(b.cx - s.cx, b.cy - s.cy) + Math.abs(b.w - s.w) + Math.abs(b.h - s.h), b, s]);
      score.sort((a, b) => a[0] - b[0]);
      const pb = new Set(), ps = new Set();
      for (const [sc, b, s] of score) { if (pb.has(b.k) || ps.has(s.k) || sc > MATCH_MAX) continue; pb.add(b.k); ps.add(s.k); }
      for (const b of B) {
        const rec = { concept: name, step: `${present[i]}->${present[i - 1]}`, from: present[i], to: present[i - 1],
                      minSideBig: b.absMin, minSideAtSmallScale: b.absMinSmall, minSideCanvas: Math.min(b.w, b.h) };
        (pb.has(b.k) ? kept : died).push(rec);
      }
    }
  }
  return { died, kept };
}

/** an4 5f: is the small drawing a pure rescale of the big one (ink box within EQ of big × k)? */
export function rescale(rows, big, small) {
  const dw = [], dh = [];
  for (const [, e] of lastWins(rows, 'outline')) {
    if (!e[big] || !e[small]) continue;
    const k = small / big;
    dw.push(Math.abs(e[small].ink.w - e[big].ink.w * k));
    dh.push(Math.abs(e[small].ink.h - e[big].ink.h * k));
  }
  return { n: dw.length, exact: dw.filter((v, i) => v < EQ && dh[i] < EQ).length, errMed: med(dw) };
}

/** an5 6c: concepts on-axis (max dev ≤ ON_AXIS) at their biggest size — still on-axis at each size? */
export function angDrift(rows, sizes) {
  const byC = new Map();
  for (const d of rows) if (d.style === 'outline' && d.angles && !d.angles.error) {
    if (!byC.has(d.concept)) byC.set(d.concept, {}); byC.get(d.concept)[d.size] = d.angles.maxDev; }
  const on = [];
  for (const [, e] of byC) {
    const present = sizes.filter((s) => e[s] != null);
    if (present.length < 2) continue;
    if (e[present[present.length - 1]] > ON_AXIS) continue;
    on.push(e);
  }
  const at = {};
  for (const s of sizes) {
    const here = on.filter((e) => e[s] != null);
    if (!here.length) continue;
    const d = here.map((e) => e[s]);
    at[s] = { n: here.length, still: 1 - here.filter((e) => e[s] > ON_AXIS).length / here.length, p90: qq(d, 0.9), max: Math.max(...d) };
  }
  return { n: on.length, at };
}

/** an5 6b: filled ink box against its outline twin, last record winning per concept. */
export function pairBox(rows, s) {
  const o = new Map(), f = new Map();
  // as an5 did: every record that is not 'filled' (Regular, Light, themeless) lands in the outline map
  for (const d of rows) if (d.size === s) (d.style === 'filled' ? f : o).set(d.concept, d);
  let n = 0, same = 0, grow = 0, shrink = 0;
  const differ = [];
  for (const [k, a] of o) {
    const b = f.get(k); if (!b) continue;
    n++;
    if (Math.abs(b.ink.w - a.ink.w) < EQ && Math.abs(b.ink.h - a.ink.h) < EQ) same++;
    else { differ.push(k); if (b.ink.w >= a.ink.w - EQ && b.ink.h >= a.ink.h - EQ) grow++; else shrink++; }
  }
  return { n, same, grow, shrink, differ };
}

/** an4 5c: the mark's ink over the container's (biggest subpath = container; drop its inner contour). */
export function markRatio(rows, concept, s) {
  const r = rows.find((d) => d.concept === concept && d.size === s && d.style === 'outline');
  if (!r || r.subs.length < 2) return null;
  const outer = r.subs[0];
  const inner = r.subs.slice(1).filter((x) => !(x.w > outer.w * 0.6 && x.h > outer.h * 0.6));
  if (!inner.length) return null;
  const x0 = Math.min(...inner.map((x) => x.x)), y0 = Math.min(...inner.map((x) => x.y));
  const x1 = Math.max(...inner.map((x) => x.x + x.w)), y1 = Math.max(...inner.map((x) => x.y + x.h));
  return Math.max(x1 - x0, y1 - y0) / Math.max(outer.w, outer.h);
}

/** an7 8a: radius steps (rounded corners, caps and < 0.05 left out), quantised, commonest first. */
export function radiusSteps(rows, s, quantum) {
  const h = new Map(); let n = 0;
  for (const d of rows) if (d.size === s && d.style === 'outline' && d.corners && d.corners.radii) for (const c of d.corners.radii) {
    if (c.role === 'cap' || c.r < 0.05) continue;
    const k = Math.round(c.r * quantum) / quantum; h.set(k, (h.get(k) || 0) + 1); n++;
  }
  // ties keep first-seen order, as an7's Object.entries(...).sort did
  return { n, top: [...h.entries()].sort((a, b) => b[1] - a[1]).map(([r, c]) => ({ r, share: c / n })) };
}

/** an8 9a: which keyline does the drawing reach (max of w, h; outline; every record)? */
export function keylineLanding(rows, s, key) {
  const rr = rows.filter((d) => d.size === s && d.style === 'outline');
  const b = { past: 0, circle: 0, between: 0, square: 0, under: 0 };
  for (const d of rr) {
    const m = Math.max(d.ink.w, d.ink.h);
    if (m > key.circle + EQ) b.past++;
    else if (Math.abs(m - key.circle) <= EQ) b.circle++;
    else if (m > key.square + EQ) b.between++;
    else if (Math.abs(m - key.square) <= EQ) b.square++;
    else b.under++;
  }
  return { n: rr.length, ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v / rr.length])) };
}

/** Fluent keylines read off the drawings: circle = the commonest outline width of §4's genuine circle
 *  containers; square = the `Square` concept's filled width (an1 §1). Ours come from masters.mjs. */
export function fluentKeylines(fluent) {
  const key = {};
  for (const s of SIZES) {
    const w = CIRC_GENUINE.map((c) => fluent.find((d) => d.concept === c && d.size === s && d.style === 'outline')).filter(Boolean).map((d) => d.ink.w);
    const tally = new Map(); for (const v of w) tally.set(v, (tally.get(v) || 0) + 1);
    const circle = [...tally.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? null;
    const sq = fluent.find((d) => d.concept === 'Square' && d.size === s && d.style === 'filled');
    key[s] = { circle, square: sq ? sq.ink.w : null };
  }
  return key;
}
export const ourKeylines = () => Object.fromEntries(OURS.map((s) => [s, { circle: MASTERS[s].keylines.circle[0], square: MASTERS[s].keylines.square[0] }]));

/** an3: per size and style, the thinnest ink and the air by kind. */
export function floors(gapRows, s, style) {
  const rr = gapRows.filter((r) => r.size === s && r.style === style);
  const kinds = {};
  for (const r of rr) for (const a of (r.air || [])) (kinds[a.kind] ??= []).push(a.gap);
  for (const r of rr) for (const g of (r.selfAir || [])) (kinds.selfLine ??= []).push(g);
  return { n: rr.length, material: rr.map((r) => r.material).filter((v) => v != null), kinds };
}

/** The Regular weight per size: the first strokeBasis the outline records carry at that size (an1 §0). */
export function regularLadder(fluent) {
  const L = strokeLadder(fluent, []);
  return Object.fromEntries(SIZES.map((s) => [s, L.basis[s][0]]));
}
/** an5 6e: a death is plausible when its thin side, rescaled, is under PLAUSIBLE strokes of the size it died at. */
export const plausibleDeaths = (died, reg) => died.filter((x) => x.minSideAtSmallScale / reg[x.to] < PLAUSIBLE);
/** an5 6a: concepts whose ink reaches the canvas edge (min margin < EQ) at any of `sizes`, in the given style. */
export const edgeConcepts = (rows, sizes, style = 'outline') =>
  [...new Set(sizes.flatMap((s) => rows.filter((d) => d.size === s && (!style || d.style === style) && minMargin(d) < EQ).map((d) => d.concept)))].sort();
/** an6 7b: the pooled bottom decile (values at or under the index p10), with the p10 itself. */
export function bottomDecile(values) {
  const s = [...values].sort((x, y) => x - y), p10 = s[Math.round(0.1 * (s.length - 1))];
  return { p10, lo: s[0], hi: Math.max(...s.filter((v) => v <= p10)) };
}
/** §5: median min-margin as a share of canvas, theirs and ours, and ours ÷ theirs, per size in `order`. */
export function marginShares(F, O, order) {
  const m = (R, s) => med(R.filter((d) => d.size === s && d.style === 'outline').map(minMargin));
  const theirs = order.map((s) => m(F, s) / s), ours = order.map((s) => m(O, s) / s);
  return { theirs, ours, ratio: ours.map((v, i) => v / theirs[i]) };
}
/** an5 6b per size: identical / grows / shrinks as counts and shares. */
export const pairBoxTable = (rows, sizes) => sizes.map((s) => { const p = pairBox(rows, s); return { ...p, sameShare: p.same / p.n, growShare: p.grow / p.n, shrinkShare: p.shrink / p.n }; });
/** §2's filled-box line, from pairBoxTable rows. */
export const filledBoxLine = (P) => `Filled outer box = outline's: identical in ${P.map((p) => pct(p.sameShare)).join(' / ')}; grows in ${range(P.map((p) => p.growShare), (v) => pct(v))}; shrinks in ${range(P.map((p) => p.shrinkShare), (v) => pct(v))} (shrink counts ${P.map((p) => p.shrink).join(' · ')})`;
/** The definition card 2.1 used for "identical box" (R2's 96.3%; the plan's reconcile list sets it beside card 1.8's). */
export const BOX_EQUALITY = `per master, outline and filled path boxes (geometry.bbox, 3 dp) whose width and height agree within ${EQ}; position ignored`;

// ── context: everything measured once, on demand ───────────────────────────────────────────────────
export function context(pin, refs, { trueGeometry = false, share = null } = {}) {
  const memo = {};
  if (share) for (const k of ['cat', 'ours', 'gO', 'oo']) memo[k] = share[k]();   // our side has no curves: one reading
  const once = (k, f) => () => (k in memo ? memo[k] : (memo[k] = f()));
  const c = {};
  c.docs = once('docs', () => readFluentDocs(refs, { flatten: trueGeometry }));
  c.cat = once('cat', () => sampleFromCatalogue(readCatalogue(refs)));
  c.fluent = once('fluent', () => fluentDrawings(c.docs(), c.cat().sample));
  c.ours = once('ours', () => ourDrawings(pin));
  c.gF = once('gF', () => fluentGapRows(c.docs(), c.cat().sample));
  c.gO = once('gO', () => ourGapRows(pin));
  c.fo = once('fo', () => orphans(c.fluent().filter((d) => d.style === 'outline'), SIZES));
  c.oo = once('oo', () => orphans(c.ours().filter((d) => d.style === 'outline'), TRI));
  c.reg = once('reg', () => regularLadder(c.fluent()));
  c.cal = once('cal', () => { const f = join(refs, 'fluent', 'figma', 'calibration.json'); return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).table : {}; });
  c.fil = once('fil', () => { const L = strokeLadder(c.fluent(), c.docs()); return Object.fromEntries(SIZES.map((s) => [s, L.bar.filled[s] ?? c.cal()[s]?.filled?.value ?? null])); });
  c.key = once('key', () => fluentKeylines(c.fluent()));
  return c;
}

// The Filled weight is read off Subtract's filled path where Subtract exists. Subtract ships no 32;
// there it is figma.mjs's own path reading off `Add` (cross), stored in calibration.json at ingest.

// ── sections ───────────────────────────────────────────────────────────────────────────────────────
const head = (n, t) => console.log(`\n## §${n} ${t}`);
let SINK = (s) => console.log(s);
const out = (s = '') => SINK(s);
/** Run `f` and return the lines it printed. */
export function capture(f) { const lines = [], keep = SINK; SINK = (s) => lines.push(s); try { f(); } finally { SINK = keep; } return lines; }
export const LABEL_S = 'as the instrument samples it │ ', LABEL_T = 'true geometry                │ ';
/** Line against line: a line both readings print alike is printed once; a line they print differently is printed
 *  twice, the instrument's reading first, each labelled. */
export function mergeReadings(S, T) {
  if (S.length !== T.length) return [...S.map((l) => LABEL_S + l), ...T.map((l) => LABEL_T + l)];
  return S.flatMap((l, i) => (l === T[i] ? [l] : [LABEL_S + l, LABEL_T + T[i]]));
}

function secAnswer(c) {
  head('answer', 'The short answer');
  const ours = c.ours();
  const key = ourKeylines();
  const edge = ours.filter((d) => minMargin(d) < EQ).length;
  const past = ours.filter((d) => Math.max(d.ink.w, d.ink.h) > key[d.size].circle + EQ).length;
  out(`our drawings: ${ours.length} · reaching the canvas edge (min margin < ${EQ}): ${edge} · past the circle keyline: ${past}`);
  const a = angDrift(ours, TRI).at[16];
  out(`our on-axis concepts that tilt at 16: ${pct(1 - a.still)} · up to ${r2(a.max)}°`);
}

function secSample(c) {
  head('sample', 'Sample, and why this one');
  const S = c.cat();
  out(`catalogue: page ${S.page.id} "${S.page.name}", file ${S.file.key}, enumerated ${S.at}`);
  out(`component sets enumerated: ${S.sets.toLocaleString('en-US')} · distinct names: ${S.names.toLocaleString('en-US')}`);
  out(`sizes per concept: ${[1, 2, 3, 4, 5, 6, 7].map((k) => `${S.dist[k] || 0} at ${k}`).join(' · ')}`);
  out(`exist at three to six: ${S.band.toLocaleString('en-US')} · sample: ${S.all7.length} at all seven + an even spread of ${S.spread36.length} = ${S.sample.length}`);
  const keptAt = join(c.refsDir, 'fluent', 'figma', 'card-2.1', 'fluent-sample.json');
  if (existsSync(keptAt)) {
    const kept = JSON.parse(readFileSync(keptAt, 'utf8')).sample;
    out(`rebuilt sample equals card-2.1/fluent-sample.json: ${kept.length === S.sample.length && kept.every((x, i) => x === S.sample[i]) ? 'yes' : 'NO'}`);
  }
  const F = c.fluent();
  const th = {}; for (const d of F) { const k = d.theme ?? 'themeless'; th[k] = (th[k] || 0) + 1; }
  const concepts = new Map(); for (const d of F) { if (!concepts.has(d.concept)) concepts.set(d.concept, { sizes: new Set(), avail: d.sizesAvailable }); concepts.get(d.concept).sizes.add(d.size); }
  const short = [...concepts.values()].filter((e) => e.sizes.size !== e.avail).length;
  out(`measured: ${concepts.size} concepts · ${F.length.toLocaleString('en-US')} drawings — ${(th.Regular || 0).toLocaleString('en-US')} Regular, ${(th.Filled || 0).toLocaleString('en-US')} Filled, ${th.Light || 0} Light, ${th.themeless || 0} themeless · short of their own Size axis: ${short}`);
  const O = c.ours();
  out(`our side: ${new Set(O.map((d) => d.concept)).size} concepts × ${new Set(O.map((d) => d.size)).size} masters × ${new Set(O.map((d) => d.style)).size} styles = ${O.length.toLocaleString('en-US')} drawings`);
  out('provenance — the copy page 15711:27742 and its set and name counts (the document says they equal the figures above): [not reprintable: the copy\'s catalogue was overwritten at ingest; it survives only in the 2026-10-04 scratch folder, which a restart clears]');
}

/** sample-groups: the probe's reconstruction (no original code). Share-type §2 rows per group. */
export function groupShares(fluent, gF, names) {
  const want = new Set(names);
  const F = fluent.filter((d) => want.has(d.concept)), G = gF.filter((r) => want.has(r.concept));
  const reg = {}; for (const s of SIZES) reg[s] = F.find((d) => d.size === s && d.style === 'outline')?.stroke;
  const rows = {};
  const put = (label, s, v, n) => { (rows[label] ??= {})[s] = { v, n }; };
  const key = fluentKeylines(fluent);
  for (const s of SIZES) {
    const outl = F.filter((d) => d.size === s && d.style === 'outline');
    if (!outl.length) continue;
    const mat = G.filter((r) => r.size === s && r.style === 'outline' && r.material != null);
    if (mat.length) put('thinnest ink exactly on the stroke', s, mat.filter((r) => Math.abs(r.material - reg[s]) < EQ).length / mat.length, mat.length);
    const cuts = G.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap));
    if (cuts.length) put('knockout exactly the Regular stroke', s, cuts.filter((v) => Math.abs(v - reg[s]) < EQ_CUT).length / cuts.length, cuts.length);
    put('margin under 1 unit', s, outl.filter((d) => minMargin(d) < 1).length / outl.length, outl.length);
    const L = keylineLanding(F, s, key[s]);
    put('past the circle keyline', s, L.past, L.n); put('on the circle keyline', s, L.circle, L.n);
    put('median largest ink dimension / canvas', s, med(outl.map((d) => Math.max(d.ink.w, d.ink.h) / s)), outl.length);
    const P = pairBox(F, s); if (P.n) put('filled box identical to the outline', s, P.same / P.n, P.n);
  }
  const ad = angDrift(F, SIZES); for (const s of SIZES) if (ad.at[s]) put('on-axis concepts still on-axis', s, ad.at[s].still, ad.at[s].n);
  for (const [k, e] of lossLadder(F.filter((d) => d.style === 'outline'), SIZES)) put('a part lost per step', k, e.lost / e.pairs, e.pairs);
  return rows;
}

function secSampleGroups(c) {
  head('sample-groups', 'Sample § — "every hold/give figure moves by less than two points between the two groups"');
  out('NOT A REPRINT: card 2.1 left no code for this comparison. The probe\'s reconstruction: the share rows of §2,');
  out(`per group, and the largest gap in percentage points; a cell is skipped when either group has n < ${GROUP_MIN_N}.`);
  const S = c.cat();
  const A = groupShares(c.fluent(), c.gF(), S.all7), B = groupShares(c.fluent(), c.gF(), S.spread36);
  let worst = 0;
  for (const label of Object.keys(A)) {
    const keys = Object.keys(A[label]).filter((k) => B[label] && B[label][k] && A[label][k].n >= GROUP_MIN_N && B[label][k].n >= GROUP_MIN_N);
    if (!keys.length) continue;
    const gaps = keys.map((k) => Math.abs(A[label][k].v - B[label][k].v) * 100);
    const g = Math.max(...gaps); worst = Math.max(worst, g);
    const cell = (X, k) => `${k}:${pct(X[label][k].v)}(n=${X[label][k].n})`;
    out(`${label} — largest gap ${g.toFixed(1)} points (at ${keys[gaps.indexOf(g)]})`);
    out(`   all-seven ${keys.map((k) => cell(A, k)).join(' ')}`);
    out(`   spread    ${keys.map((k) => cell(B, k)).join(' ')}`);
  }
  out(`largest gap over every row: ${worst.toFixed(1)} points`);
}

function secApprox(c) {
  head('approx', 'Instruments — three approximations');
  const F = c.fluent();
  const per = SIZES.map((s) => { const o = new Set(F.filter((d) => d.size === s && d.style === 'outline').map((d) => d.stroke)); const f = new Set(F.filter((d) => d.size === s && d.style === 'filled').map((d) => d.stroke)); return `${s}: ${[...o].join('/')} | ${[...f].join('/')}`; });
  out(`2. one weight per size, Regular | Filled rows' strokeBasis: ${per.join(' · ')}`);
  const fo = c.fo(), reg = c.reg();
  const plaus = plausibleDeaths(fo.died, reg);
  out(`3. orphans: ${fo.died.length} · plausible (under ${PLAUSIBLE} strokes at the size it died at): ${plaus.length} · excluded: ${fo.died.length - plaus.length} of ${fo.died.length}`);
  for (const [cn, st] of ZERO_AREA) {
    const d = fo.died.filter((x) => x.concept === cn && x.step === st);
    out(`   ${cn} at ${st.split('->')[0]}: ${d.length} part(s) ${d.map((x) => r2(x.minSideBig)).join(', ')} thin · inside the plausible ${plaus.length}: ${plausibleDeaths(d, reg).length === d.length ? 'yes' : 'no'}`);
  }
}

function secS1(c) {
  head('1', 'The stroke table, re-measured');
  const F = c.fluent(), L = strokeLadder(F, c.docs()), reg = c.reg();
  out(`| | ${SIZES.join(' | ')} |`);
  out(`| Regular, calibrated (records' strokeBasis) | ${SIZES.map((s) => L.basis[s].join('/')).join(' | ')} |`);
  out(`| check: Subtract bar, outline path | ${SIZES.map((s) => L.bar.outline[s] ?? '—').join(' | ')} |`);
  out(`| as a share of canvas | ${SIZES.map((s) => pct(reg[s] / s, 2)).join(' | ')} |`);
  out(`| Filled − Regular, 2 × Add's per-side growth | ${lineGrowth(F, 'Add', SIZES).map((g) => (g == null ? '—' : '+' + (2 * g).toFixed(2).replace(/0$/, ''))).join(' | ')} |`);
  out(`| check: Subtract bar, filled path − Regular | ${SIZES.map((s) => (L.bar.filled[s] == null ? '—' : '+' + (L.bar.filled[s] - reg[s]).toFixed(2).replace(/0$/, ''))).join(' | ')} |`);
  const g = LINE_GLYPHS.flatMap((n) => lineGrowth(F, n, SIZES)).filter((v) => v != null);
  out(`filled box proud per side on ${LINE_GLYPHS.join(', ')} at every size: ${range(g, r2)} (n=${g.length})`);
  out(`ours: ${OURS.map((s) => STROKES[s]).join(' · ')} at ${OURS.join(' · ')} = ${OURS.map((s) => pct(STROKES[s] / s, 2)).join(' · ')} of canvas`);
  const at625 = SIZES.filter((s) => Math.abs(reg[s] / s - 0.0625) < 1e-9);
  const lighter = SIZES.filter((s) => reg[s] / s < 0.0625 - 1e-9);
  out(`sizes at exactly 6.25%: ${at625.join(', ')} · lighter: ${lighter.length} (${range(lighter.map((s) => reg[s] / s), (v) => pct(v, 2))}) · heavier: ${SIZES.filter((s) => reg[s] / s > 0.0625 + 1e-9).map((s) => `${s} (${pct(reg[s] / s, 2)})`).join(', ')}`);
  out(`distinct weights on the ladder: ${[...new Set(SIZES.map((s) => reg[s]))].join(' · ')}`);
}

function secS2(c) {
  head('2', 'The hold/give table');
  const F = c.fluent(), G = c.gF(), reg = c.reg(), fil = c.fil(), key = c.key();
  // thinnest ink (an3)
  const ink = SIZES.map((s) => floors(G, s, 'outline').material);
  const eq = SIZES.map((s, i) => ink[i].filter((v) => Math.abs(v - reg[s]) < EQ).length / ink[i].length);
  const th = SIZES.map((s, i) => ink[i].filter((v) => v < reg[s] - EQ).length / ink[i].length);
  out(`Thinnest ink (materialGap), median: ${dot(ink.map((v) => r2(med(v))))}`);
  out(`  in their own line: ${dot(SIZES.map((s, i) => r2(med(ink[i]) / reg[s]) + '×'))} · exactly on the stroke ${range(eq, (v) => (v * 100).toFixed(0))}% · thinner ${range(th, (v) => (v * 100).toFixed(0))}%`);
  // knockout (an6 7c)
  const cuts = SIZES.map((s) => G.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap)));
  out(`Knockout width (facingGap cut, Filled), median: ${dot(cuts.map((v) => r2(med(v))))}`);
  out(`  × Regular: ${dot(SIZES.map((s, i) => r2(med(cuts[i]) / reg[s]) + '×'))} · exactly on it ${range(SIZES.map((s, i) => cuts[i].filter((v) => Math.abs(v - reg[s]) < EQ_CUT).length / cuts[i].length), (v) => (v * 100).toFixed(0))}% · × Filled weight ${range(SIZES.map((s, i) => med(cuts[i]) / fil[s]), r2)}×  (Filled weight at 32 from calibration.json's Add cross)`);
  // angle (an5 6c)
  const A = angDrift(F, SIZES);
  out(`Angle: ${A.n} concepts on-axis (max dev ≤ ${ON_AXIS}°) at their biggest size; still on-axis ${SIZES.map((s) => A.at[s] ? pctW(A.at[s].still) : '—').join(' / ')}`);
  // mark inside a circle container (an4 5c)
  const mr = (cn, sz) => sz.map((s) => markRatio(F, cn, s)).filter((v) => v != null);
  out(`Mark inside a circle container: Add Circle ${dot(mr('Add Circle', SIZES).map((v) => pct(v, 2)))} · Subtract Circle ${dot(mr('Subtract Circle', SIZES).map((v) => pct(v, 2)))}`);
  out(`  Arrow Circle Down/Up at 16–48: ${range([...mr('Arrow Circle Down', SIZES.slice(1)), ...mr('Arrow Circle Up', SIZES.slice(1))], (v) => pct(v))} · Question Circle ${range(mr('Question Circle', SIZES), (v) => pct(v))} · Chevron Circle ${range(mr('Chevron Circle', SIZES), (v) => pct(v))}`);
  // circle keyline
  const full = CIRC_AN4.filter((cn) => SIZES.every((s) => { const d = F.find((x) => x.concept === cn && x.size === s && x.style === 'outline'); return d && Math.abs(d.ink.w - key[s].circle) < EQ; }));
  out(`Circle keyline (commonest outline width of §4's ${CIRC_GENUINE.length} circle containers): ${dot(SIZES.map((s) => key[s].circle))}`);
  out(`  concepts of an4's circle list that read it at all seven sizes: ${full.length} (${full.join(', ')})`);
  // separation (an3)
  const sep = SIZES.map((s) => floors(G, s, 'outline').kinds.separation || []);
  out(`Separation from a glyph edge (separation, Regular), median: ${dot(sep.map((v) => r2(med(v))))}`);
  out(`  in their own line: ${dot(SIZES.map((s, i) => r2(med(sep[i]) / reg[s]) + '×'))}`);
  // topology (an2 §3)
  const LL = lossLadder(F.filter((d) => d.style === 'outline'), SIZES);
  const stepOrder = ['48->32', '32->28', '28->24', '24->20', '20->16', '16->12'];
  out(`Topology: a part is lost in ${stepOrder.map((k) => pct(LL.get(k).lost / LL.get(k).pairs)).join(' / ')} of the steps ${stepOrder.map((k) => k.replace('->', '→')).join(', ')}`);
  // margin (an1 §4, an5 6a)
  const outl = (s) => F.filter((d) => d.size === s && d.style === 'outline');
  out(`Margin: median min-margin ${dot(SIZES.map((s) => Number(r2(med(outl(s).map(minMargin))))))}`);
  out(`  under 1 unit in ${SIZES.map((s) => pctW(outl(s).filter((d) => minMargin(d) < 1).length / outl(s).length)).join(' / ')} of drawings`);
  out(`  at the canvas edge (margin < ${EQ}): ${SIZES.map((s) => `${outl(s).filter((d) => minMargin(d) < EQ).length} at ${s}`).join(', ')}`);
  // keyline as a ceiling (an8 9a)
  const land = SIZES.map((s) => keylineLanding(F, s, key[s]));
  out(`Keyline as a ceiling: past the circle keyline ${range(land.map((l) => l.past), (v) => pct(v))} (${land.map((l) => pct(l.past)).join(' ')}) · exactly on it ${range(land.map((l) => l.circle), (v) => pct(v))}`);
  // ink box (an1 §2)
  out(`Ink box as a share of canvas: median largest dimension ${dot(SIZES.map((s) => pct(med(outl(s).map((d) => Math.max(d.ink.w, d.ink.h) / s)))).map((v) => v.replace('%', '')))}%`);
  // path structure (an4 5f, an2 §1)
  const steps = [[48, 32], [32, 28], [28, 24], [24, 20], [20, 16], [16, 12]].map(([b, s]) => ({ step: `${b}->${s}`, ...rescale(F, b, s) }));
  const ex = steps.filter((x) => x.exact);
  out(`Path structure: ${steps.reduce((t, x) => t + x.exact, 0)} of ${steps.reduce((t, x) => t + x.n, 0)} adjacent-size pairs is a pure rescale (ink box within ${EQ} of big × k), at ${ex.map((x) => x.step.replace('->', '→')).join(', ')}`);
  out(`  16/20/24 trios holding the exact command count: ${pct(triHold(F.filter((d) => d.style === 'outline')).cmdsExact)}`);
  // filled box (an5 6b)
  out(filledBoxLine(pairBoxTable(F, SIZES)));
}

function secS3(c) {
  head('3', 'The detail-death order');
  const F = c.fluent(), reg = c.reg();
  const outl = (s) => F.filter((d) => d.size === s && d.style === 'outline');
  const u1 = (s) => pct(outl(s).filter((d) => minMargin(d) < 1).length / outl(s).length);
  out(`1. margin: inside 1 unit in ${u1(28)} at 28, ${u1(16)} at 16, ${u1(12)} at 12 · touching the canvas edge at 16: ${outl(16).filter((d) => minMargin(d) < EQ).length}`);
  const steps = [[48, 32], [32, 28], [28, 24], [24, 20], [20, 16], [16, 12]].map(([b, s]) => rescale(F, b, s));
  out(`2. pure rescales: ${steps.reduce((t, x) => t + x.exact, 0)} in ${steps.reduce((t, x) => t + x.n, 0)} pairs`);
  const LL = lossLadder(F.filter((d) => d.style === 'outline'), SIZES);
  const hi = ['48->32', '32->28', '28->24'].map((k) => LL.get(k).lost / LL.get(k).pairs);
  out(`3. a part dropped: ${range(hi, (v) => pct(v))} of steps from 48 down to 24 · ${pct(LL.get('20->16').lost / LL.get('20->16').pairs)} at 20→16 · ${pct(LL.get('16->12').lost / LL.get('16->12').pairs)} at 16→12`);
  const fo = c.fo();
  const ratio = (x) => x.minSideAtSmallScale / reg[x.to];
  const plaus = plausibleDeaths(fo.died, reg);
  out(`Which part dies: ${plaus.length} plausible deaths · thinnest side at the size it would have lived at, median ${r2(med(plaus.map((x) => x.minSideAtSmallScale)))} units = ${r2(med(plaus.map(ratio)))} strokes · p25 ${r2(qq(plaus.map(ratio), 0.25))}`);
  const by = {}; for (const x of plaus) (by[x.to] ??= []).push(ratio(x));
  out(`  by the size it died at: ${Object.keys(by).map(Number).sort((a, b) => a - b).map((k) => `${r2(med(by[k]))}× at ${k} (n=${by[k].length})`).join(' · ')} · at 20 and above: ${plaus.filter((x) => x.to >= 20).length}`);
  const dU = fo.died.filter((x) => ratio(x) < 1).length / fo.died.length, kU = fo.kept.filter((x) => ratio(x) < 1).length / fo.kept.length;
  out(`  orphans under one stroke ${pct(dU)} against ${pct(kU)} of the parts that survived = ${(dU / kU).toFixed(2)}-fold`);
  out('| concept | step | parts lost, and their thin side | would have been |');
  for (const [cn, st] of NAMED_DEATHS) {
    const [b, s] = st.split('->').map(Number);
    const big = F.find((d) => d.concept === cn && d.size === b && d.style === 'outline'), sm = F.find((d) => d.concept === cn && d.size === s && d.style === 'outline');
    const d = fo.died.filter((x) => x.concept === cn && x.step === st).sort((p, q) => p.minSideBig - q.minSideBig);
    const groups = new Map(); for (const x of d) groups.set(r2(x.minSideBig), (groups.get(r2(x.minSideBig)) || 0) + 1);
    const thin = d[0];
    out(`| \`${cn}\` | ${b}→${s} | ${big.nSubs} → ${sm.nSubs}; ${d.length} unpaired: ${[...groups].map(([v, n]) => `${n} at ${v}`).join(', ')}; thinnest ${r2(thin.minSideBig)} (${pct(thin.minSideCanvas)}) | ${r2(thin.minSideAtSmallScale)} at ${s} = **${r2(ratio(thin))} strokes** |`);
  }
  const oo = c.oo();
  const oRatio = (x) => x.minSideAtSmallScale / STROKES[x.to];
  const at = (v) => oo.died.filter((x) => Math.abs(x.minSideBig - v) < EQ).length;
  out(`Ours: ${oo.died.length} deaths across ${[...lossLadder(c.ours().filter((d) => d.style === 'outline'), TRI).values()].reduce((t, e) => t + e.pairs, 0)} steps · exactly 1.50 thin in ${at(1.5)}, 2.00 in ${at(2)} — ${at(1.5) + at(2)} of ${oo.died.length}`);
  out(`  median ${r2(med(oo.died.map((x) => x.minSideAtSmallScale)))} units = ${r2(med(oo.died.map(oRatio)))} of the smaller master's stroke (p75 ${r2(qq(oo.died.map(oRatio), 0.75))})`);
  out(`  under 1.5 strokes: ${pct(oo.died.filter((x) => oRatio(x) < 1.5).length / oo.died.length)} of our dying parts against ${pct(oo.kept.filter((x) => oRatio(x) < 1.5).length / oo.kept.length)} of the parts that survived`);
  const ob = {}; for (const x of oo.died) (ob[x.to] ??= []).push(oRatio(x));
  out(`  we give up at ${Object.keys(ob).map(Number).sort((a, b) => a - b).map((k) => `${r2(med(ob[k]))} (at ${k})`).join(' · ')} strokes`);
  const per = new Map();
  for (const x of oo.died) { const k = x.concept; if (!per.has(k)) per.set(k, {}); per.get(k)[x.step] = (per.get(k)[x.step] || 0) + 1; }
  out(`  parts lost, named: ${OUR_RUN_NAMES.map((n) => `${n} ${Object.entries(per.get(n) || {}).map(([k, v]) => `${v} at ${k.replace('->', '→')}`).join(' + ') || '0'}`).join(' · ')}`);
  out(`  every concept that loses a part: ${[...per.keys()].sort().join(', ')}`);
  const one5 = oo.died.filter((x) => Math.abs(x.minSideBig - 1.5) < EQ).map((x) => x.minSideAtSmallScale);
  out(`  the 1.50-thin members would have been drawn at ${range(one5, r2)}`);
}

function secS4(c) {
  head('4', 'Where the curve bends');
  const F = c.fluent(), G = c.gF();
  const ink = SIZES.map((s) => med(floors(G, s, 'outline').material));
  const cut = SIZES.map((s) => med(G.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap))));
  out(`ink floor: ${dot(ink.map(r2))} · knockout: ${dot(cut.map(r2))}`);
  const mm = SIZES.map((s) => Number(r2(med(F.filter((d) => d.size === s && d.style === 'outline').map(minMargin)))));
  out(`margin ladder: ${dot(mm)} · changes at ${SIZES.slice(1).filter((s, i) => mm[i + 1] !== mm[i]).map((s) => `${SIZES[SIZES.indexOf(s) - 1]}→${s}`).join(', ')}`);
  out(`ink-box canvas share: ${dot(SIZES.map((s) => pct(med(F.filter((d) => d.size === s && d.style === 'outline').map((d) => Math.max(d.ink.w, d.ink.h) / s))).replace('%', '')))}%`);
  out(`separation: ${dot(SIZES.map((s) => r2(med(floors(G, s, 'outline').kinds.separation || []))))}`);
  const bare = F.find((d) => d.concept === 'Circle' && d.size === 16 && d.style === 'outline');
  out(`bare \`Circle\` at 16: ${r2(bare.ink.w)} (path box)`);
  const g16 = CIRC_GENUINE.map((cn) => F.find((d) => d.concept === cn && d.size === 16 && d.style === 'outline')).filter(Boolean);
  out(`genuine circle containers at 16 (path box): ${g16.map((d) => `${d.concept} ${r2(d.ink.w)}`).join(', ')}`);
  // the one figure that rests on figma.mjs measure.ink (an7 8c) — printed, with its exposure to the defect
  const R = {}; let dis = 0, n = 0, rot = 0;
  for (const d of F) if (CIRC_RENDER.includes(d.concept) && d.style === 'outline' && d.inkRender) {
    (R[d.size] ??= new Set()).add(Number(d.inkRender.w.toFixed(2))); n++;
    if (Math.abs(d.inkRender.w - d.ink.w) > EQ || Math.abs(d.inkRender.h - d.ink.h) > EQ) dis++;
    if (d.rotatedNodes) rot++;
  }
  out(`DEPENDS ON figma.mjs measure.ink (render bounds; defective on rotated/flipped nodes): circle keyline from ${CIRC_RENDER.join(', ')}: ${SIZES.map((s) => `${s}: ${[...(R[s] || [])].join(', ')}`).join(' · ')}`);
  out(`  exposure: ${dis} of ${n} of these drawings disagree with the path box by more than ${EQ}; ${rot} carry a rotated node`);
}

function secS5(c) {
  head('5', 'Us against them, normalised (24 · 20 · 16)');
  const F = c.fluent(), O = c.ours(), G = c.gF(), GO = c.gO(), reg = c.reg(), key = c.key(), okey = ourKeylines();
  const order = [24, 20, 16];
  const outl = (R, s) => R.filter((d) => d.size === s && d.style === 'outline');
  const fm = order.map((s) => med(outl(F, s).map(minMargin))), om = order.map((s) => med(outl(O, s).map(minMargin)));
  out(`keylines at 24 / 20 / 16 — theirs circle ${order.map((s) => key[s].circle).join(' / ')}, square ${order.map((s) => key[s].square).join(' / ')} · ours circle ${order.map((s) => okey[s].circle).join(' / ')}, square ${order.map((s) => okey[s].square).join(' / ')} · identical: ${order.every((s) => key[s].circle === okey[s].circle && key[s].square === okey[s].square) ? 'yes' : 'no'}`);
  out(`| median min-margin | ${dot(fm.map((v) => Number(r2(v))))} | ${dot(om.map((v) => Number(r2(v))))} | ours more by ${dot(om.map((v, i) => r2(v - fm[i])))} |`);
  const MS = marginShares(F, O, order);
  out(`| same, as canvas share | ${dot(MS.theirs.map(pctX))} | ${dot(MS.ours.map((v) => pct(v)))} | ours is ${range(MS.ratio, (v) => v.toFixed(2))}× theirs |`);
  out(`| drawings at the canvas edge | ${order.map((s) => `${outl(F, s).filter((d) => minMargin(d) < EQ).length} at ${s}`).join(', ')} | ${O.filter((d) => minMargin(d) < EQ).length} of ${O.length.toLocaleString('en-US')} |`);
  const fl = order.map((s) => keylineLanding(F, s, key[s])), ol = order.map((s) => keylineLanding(O, s, okey[s]));
  out(`| past the circle keyline | ${dot(fl.map((l) => pct(l.past)))} | ${dot(ol.map((l) => pct(l.past)))} |`);
  out(`| reaching neither keyline | ${dot(fl.map((l) => pct(l.under)))} | ${dot(ol.map((l) => pct(l.under)))} | ${range(ol.map((l, i) => l.under / fl[i].under), (v) => v.toFixed(1))}× as many of ours |`);
  const fx = order.map((s) => med(outl(F, s).map((d) => Math.max(d.ink.w, d.ink.h) / s))), ox = order.map((s) => med(outl(O, s).map((d) => Math.max(d.ink.w, d.ink.h) / s)));
  out(`| median largest ink dimension | ${dot(fx.map((v) => pct(v)))} | ${dot(ox.map((v) => pct(v)))} | theirs bigger by ${range(fx.map((v, i) => (v - ox[i]) * 100), (v) => v.toFixed(1))} points |`);
  const tf = triHold(F.filter((d) => d.style === 'outline')), to = triHold(O.filter((d) => d.style === 'outline'));
  out(`| ink-box canvas share, spread inside one concept | med ${pct(tf.spreadMed, 2)}, p90 ${pct(tf.spreadP90, 2)} | med ${pct(to.spreadMed, 2)}, p90 ${pct(to.spreadP90, 2)} | our tail ${(to.spreadP90 / tf.spreadP90).toFixed(2)}× wider |`);
  const rf = [rescale(F, 24, 20), rescale(F, 20, 16)], ro = [rescale(O, 24, 20), rescale(O, 20, 16)];
  out(`| pure rescales | ${rf[0].exact + rf[1].exact} of ${rf[0].n + rf[1].n} | ${ro[0].exact + ro[1].exact} of ${ro[0].n + ro[1].n} |`);
  out(`| exact command count across the trio | ${pct(tf.cmdsExact)} | ${pct(to.cmdsExact)} |`);
  const lf = lossLadder(F.filter((d) => d.style === 'outline'), SIZES), lo = lossLadder(O.filter((d) => d.style === 'outline'), TRI);
  const ls = (L, k) => pct(L.get(k).lost / L.get(k).pairs);
  out(`| a part dropped per step | ${ls(lf, '24->20')} (24→20) · ${ls(lf, '20->16')} (20→16) | ${ls(lo, '24->20')} · ${ls(lo, '20->16')} |`);
  const af = angDrift(F, SIZES), ao = angDrift(O, TRI);
  out(`| on-axis concepts still on-axis | ${dot(order.map((s) => pctW(af.at[s].still)))} | ${dot(order.map((s) => pctW(ao.at[s].still)))} | ours at 16: max ${r2(ao.at[16].max)}°, p90 ${r2(ao.at[16].p90)}° |`);
  // floors in their own line (an3; ours an4 5a with the right basis: shape-filled keeps the outline weight)
  const hasA = new Map(O.map((d) => [`${d.concept}|${d.size}|${d.style}`, d.hasAreas]));
  const oBasis = (r) => (r.style === 'outline' || hasA.get(`${r.concept}|${r.size}|filled`) ? STROKES[r.size] : FILLED_WEIGHT[r.size]);
  const fInk = order.map((s) => med(floors(G, s, 'outline').material) / reg[s]);
  const oInk = order.map((s) => { const rr = GO.filter((r) => r.size === s && r.style === 'filled' && r.material != null); return med(rr.map((r) => r.material / oBasis(r))); });
  out(`| thinnest ink, in its own line | ${dot(fInk.map((v) => r2(v) + '×'))} | filled ${dot(oInk.map((v) => r2(v) + '×'))} |`);
  const fCut = order.map((s) => med(G.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap))) / reg[s]);
  const oCut = order.map((s) => med(GO.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap / oBasis(r)))));
  out(`| knockout width, in its own line | ${dot(fCut.map((v) => r2(v) + '×'))} | ${dot(oCut.map((v) => r2(v) + '×'))} |`);
  const fSep = order.map((s) => med(floors(G, s, 'outline').kinds.separation || []));
  const oSep = order.map((s) => med(floors(GO, s, 'filled').kinds.separation || []));
  out(`| separation, absolute | ${dot(fSep.map(r2))} | ${dot(oSep.map(r2))} |`);
  const fSr = order.map((s, i) => fSep[i] / reg[s]), oSr = order.map((s, i) => oSep[i] / STROKES[s]);
  out(`| separation, in its own line | ${dot(fSr.map((v) => r2(v) + '×'))} | ${dot(oSr.map((v) => r2(v) + '×'))} | ${r2(oSr[2] / fSr[2])}× theirs at 16 |`);
  // corners (an7 8a/8b): Fluent's outline is an outlined fill → contour radius; ours is a centreline radius
  const fTop = order.map((s) => radiusSteps(F, s, 4).top), oTop = order.map((s) => radiusSteps(O, s, 8).top);
  const half = (s) => STROKES[s] / 2;
  const oSmall = order.map((s, i) => oTop[i].filter((t) => Math.abs(t.r - half(s)) < 1e-9)[0]);
  out(`| commonest contour corner | ${dot(fTop.map((t) => r2(t[0].r)))} | ${dot(order.map((s) => r2(2 * half(s))))} (centreline ${dot(order.map(half))} + half the line) | ours ${range(order.map((s, i) => (2 * half(s)) / fTop[i][0].r), (v) => v.toFixed(1))}× theirs |`);
  out(`  their commonest step's share: ${dot(fTop.map((t) => pct(t[0].share, 0)))} · our half-weight centreline corners: ${dot(oSmall.map((t) => pct(t.share, 0)))} of our corners`);
  out(`  their top-7 contour steps: ${order.map((s, i) => `${s}: ${fTop[i].slice(0, 7).map((t) => `${r2(t.r)}(${pct(t.share, 0)})`).join(' ')}`).join(' | ')}`);
  out(`  our top-7 centreline steps: ${order.map((s, i) => `${s}: ${oTop[i].slice(0, 7).map((t) => `${t.r}(${pct(t.share, 0)})`).join(' ')}`).join(' | ')}`);
  out(`| largest common contour corner (HAND-READ in the original; rule here: the largest step holding ≥ ${pct(HAND_READ_MIN_SHARE, 0)} of corners) | ${dot(fTop.map((t) => r2(Math.max(...t.filter((x) => x.share >= HAND_READ_MIN_SHARE).map((x) => x.r)))))} | ${dot(order.map((s, i) => String(Math.max(...oTop[i].filter((x) => x.share >= HAND_READ_MIN_SHARE).map((x) => x.r)) + half(s))))} |`);
  const three = (t) => t.slice(0, 3).map((x) => x.r).sort((a, b) => b - a);
  out(`| three commonest radius steps, ratio | ${order.map((s, i) => { const v = three(fTop[i]); return `1 : ${v.slice(1).map((x) => r2(x / v[0])).join(' : ')} (${s})`; }).join(' · ')} | 1 : ${three(oTop[0]).slice(1).map((x) => r2(x / three(oTop[0])[0])).join(' : ')} (${three(oTop[0]).join(' / ')} at 24) |`);
}

function secS6(c) {
  head('6', 'Take / refuse / why');
  const F = c.fluent(), O = c.ours(), G = c.gF(), GO = c.gO(), reg = c.reg(), key = c.key();
  const cuts = SIZES.map((s) => G.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap)));
  out(`T1 · thinnest ink in its own line at all seven: ${dot(SIZES.map((s) => r2(med(floors(G, s, 'outline').material) / reg[s]) + '×'))}`);
  const hasA = new Map(O.map((d) => [`${d.concept}|${d.size}|${d.style}`, d.hasAreas]));
  const oBasis = (r) => (hasA.get(`${r.concept}|${r.size}|filled`) ? STROKES[r.size] : FILLED_WEIGHT[r.size]);
  const oCut = OURS.map((s) => med(GO.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap / oBasis(r)))));
  out(`T2 · knockout × Regular ${dot(SIZES.map((s, i) => r2(med(cuts[i]) / reg[s]) + '×'))}, exactly ${range(SIZES.map((s, i) => cuts[i].filter((v) => Math.abs(v - reg[s]) < EQ_CUT).length / cuts[i].length), (v) => (v * 100).toFixed(0))}% · ours ${OURS.map((s, i) => `${r2(oCut[i])}× at ${s}`).join(', ')}`);
  const st = SIZES.map((s) => { const v = radiusSteps(F, s, 4).top.slice(0, 3).map((x) => x.r).sort((a, b) => b - a); return [v[1] / v[0], v[2] / v[0]]; });
  out(`T3 · three steps at 1 : ${range(st.map((x) => x[0]), r2)} : ${range(st.map((x) => x[1]), r2)} across the seven sizes`);
  const o24 = radiusSteps(O, 24, 8).top.slice(0, 3).map((x) => x.r).sort((a, b) => b - a);
  out(`     ours at 24: ${o24.join(' / ')} = 1 : ${o24.slice(1).map((x) => (x / o24[0]).toFixed(1)).join(' : ')}`);
  const zero = edgeConcepts(F, [16, 20, 24]);
  const zeroBoth = [...new Set([16, 20, 24].flatMap((s) => F.filter((d) => d.size === s && minMargin(d) < EQ).map((d) => d.concept)))].sort();
  out(`T5 · concepts whose outline margin falls to zero at 16, 20 or 24: ${zero.length} — ${zero.join(', ')}`);
  out(`     (either style: ${zeroBoth.length}${zeroBoth.length > zero.length ? ' — adds ' + zeroBoth.filter((x) => !zero.includes(x)).join(', ') : ''})`);
  const rf = [rescale(F, 24, 20), rescale(F, 20, 16)], ro = [rescale(O, 24, 20), rescale(O, 20, 16)];
  const errs = [[48, 32], [32, 28], [28, 24], [24, 20], [20, 16], [16, 12]].map(([b, s]) => rescale(F, b, s).errMed).concat(ro.map((x) => x.errMed));
  out(`T6 · pure rescales: ${rf[0].exact + rf[1].exact} of ${rf[0].n + rf[1].n} (theirs, 16/20/24) · ${ro[0].exact + ro[1].exact} of ${ro[0].n + ro[1].n} (ours) · median ink-box error ${range(errs, r2)} units`);
  const land = SIZES.map((s) => keylineLanding(F, s, key[s]).past);
  out(`R1 · past the circle keyline: ${range(land, (v) => (v * 100).toFixed(0))}% at every size`);
  const g = LINE_GLYPHS.flatMap((n) => lineGrowth(F, n, SIZES)).filter((v) => v != null);
  const P = pairBoxTable(F, SIZES), PO = pairBoxTable(O, OURS);
  out(`R2 · capped line glyphs grow ${range(g, r2)} per side · Fluent identical boxes ${range(P.map((p) => p.sameShare), (v) => (v * 100).toFixed(0))}% · ours ${PO.map((p) => pct(p.sameShare)).join(' · ')}`);
  out(`     "identical box" here means: ${BOX_EQUALITY} (card 1.8 measures it another way; the plan's reconcile list keeps both)`);
  out(`     added weight: theirs ${range(SIZES.map((s) => c.fil()[s] - c.reg()[s]), r2)} on a ${range(SIZES.map((s) => c.reg()[s]), (v) => v.toFixed(1))} base · ours ${OURS.map((s) => `+${r2(FILLED_WEIGHT[s] - STROKES[s])} at ${s}`).join(', ')} (masters.mjs)`);
  out(`     our exceptions: ${PO.map((p) => p.differ.length).join(' · ')} per master = ${PO.reduce((t, p) => t + p.differ.length, 0)} files · same names at every master: ${PO.every((p) => p.differ.join() === PO[0].differ.join()) ? 'yes' : 'no'} — ${PO[0].differ.sort().join(', ')}`);
  const sepAll = G.flatMap((r) => (r.air || []).filter((a) => a.kind === 'separation').map((a) => a.gap));
  const q = (a, p) => [...a].sort((x, y) => x - y)[Math.round(p * (a.length - 1))];
  const BD = bottomDecile(sepAll);
  out(`R3 · separation pooled (all sizes, both styles): n=${sepAll.length} median ${r2(med(sepAll))} · p25 ${r2(q(sepAll, 0.25))} · bottom decile ${r2(BD.lo)}–${r2(BD.hi)} · readings under ${LOW_SEP}: ${sepAll.filter((v) => v < LOW_SEP).length}`);
  const sepOf = (cn, s, style) => { const r = G.find((x) => x.concept === cn && x.size === s && x.style === style); const v = (r && r.air || []).filter((a) => a.kind === 'separation').map((a) => a.gap); return v.length ? Math.min(...v) : null; };
  let same = 0;
  const lines = [], outs = [];
  for (const [cn, s] of R3_PAIRS) {
    const o = sepOf(cn, s, 'outline'), f = sepOf(cn, s, 'filled');
    if (o != null && f != null && Math.abs(o - f) <= EQ) same++;
    if (o != null) outs.push(o);
    lines.push(`${cn} at ${s}: ${o == null ? '—' : r2(o)} | ${f == null ? '—' : r2(f)}`);
  }
  out(`     the named badge-to-base readings, outline | filled: ${lines.join(' · ')}`);
  out(`     outline and filled within ${EQ} of each other: ${same} of ${R3_PAIRS.length} · range over the named outline readings ${range(outs, r2)}`);
}

function secS7(c) {
  head('7', 'What this card corrects in our own documents');
  const G = c.gF(), GO = c.gO(), reg = c.reg(), fil = c.fil();
  out(`K1 · Fluent Regular: ${dot(SIZES.map((s) => reg[s]))} at ${dot(SIZES)} — 1.5 at ${SIZES.filter((s) => reg[s] === 1.5).length} of seven (${SIZES.filter((s) => reg[s] === 1.5).join(', ')}) · at 16: ${reg[16]} (${pct(reg[16] / 16, 2)}) against our ${STROKES[16]} (${pct(STROKES[16] / 16, 2)})`);
  out('     (the document states the corrected claim — see the plan\'s Corrections table, "Fluent uses 1.5 at 12–28"; the old claim appears in it only as the quoted docs/07:47)');
  const sR = SIZES.map((s) => med(floors(G, s, 'outline').kinds.separation || [])), sF = SIZES.map((s) => med(floors(G, s, 'filled').kinds.separation || []));
  const cut = SIZES.map((s) => med(G.filter((r) => r.size === s && r.style === 'filled').flatMap((r) => (r.air || []).filter((a) => a.kind === 'cut').map((a) => a.gap))));
  out(`K2 · separation (Regular): ${dot(sR.map(r2))} · Filled twins within ${r2(Math.max(...sR.map((v, i) => Math.abs(v - sF[i]))))} · punched-line width: ${dot(cut.map(r2))}`);
  const oSep16 = med(floors(GO, 16, 'filled').kinds.separation || []);
  const rows = [['Fluent Regular', sR[1], reg[16]], ['Fluent Filled', sF[1], fil[16]], ['ours, outline', oSep16, STROKES[16]]];
  out('K3 · | at 16 | separation | its own line | ratio |');
  for (const [l, v, w] of rows) out(`     | ${l} | ${r2(v)} | ${r2(w)} | ${r2(v / w)}× |`);
  const gen = (oSep16 / STROKES[16]) / (sR[1] / reg[16]);
  out(`     we are ${r2(gen)}× as generous relative to our own line · absolute ${r2(oSep16 / sR[1])}× at 16 (${r2(med(floors(GO, 24, 'filled').kinds.separation) / sR[3])}× at 24) · ${(gen / PLAN_ASSUMED * 100).toFixed(0)}% of the ~${PLAN_ASSUMED}× the plan assumed`);
  const S = c.cat();
  out(`K4 · authoritative page: ${S.sets.toLocaleString('en-US')} sets, ${S.names.toLocaleString('en-US')} names · the copy's: [not reprintable — see §sample]`);
  const hasA = new Map(c.ours().map((d) => [`${d.concept}|${d.size}|${d.style}`, d.hasAreas]));
  const oBasis = (r) => (hasA.get(`${r.concept}|${r.size}|filled`) ? STROKES[r.size] : FILLED_WEIGHT[r.size]);
  const mat = OURS.map((s) => GO.filter((r) => r.size === s && r.style === 'filled' && r.material != null));
  out(`K5 · materialGap on our filled files, median ${OURS.map((s, i) => `${r2(med(mat[i].map((r) => r.material)))} at ${s}`).join(', ')} · minimum ${r2(Math.min(...mat.flat().map((r) => r.material)))}`);
  out(`     against the shape-filled basis ${OURS.map((s) => STROKES[s]).join(' · ')}: ${dot(mat.map((rr) => r2(med(rr.map((r) => r.material / oBasis(r)))) + '×'))} · at 16, thinner than FILLED_WEIGHT ${FILLED_WEIGHT[16]}: ${mat[2].filter((r) => r.material < FILLED_WEIGHT[16] - EQ).length} of ${mat[2].length}`);
  const oo = c.oo();
  out(`K6 · ${oo.died.length} parts across ${[...lossLadder(c.ours().filter((d) => d.style === 'outline'), TRI).values()].reduce((t, e) => t + e.pairs, 0)} steps, in ${[...new Set(oo.died.map((x) => x.concept))].sort().join(', ')}`);
  const bad = [];
  for (const r of GO) { for (const a of (r.air || [])) if (a.gap < BREACH) bad.push([a.kind, r.concept]); for (const g of (r.selfAir || [])) if (g < BREACH) bad.push(['selfLine', r.concept]); }
  const kinds = {}; for (const [k] of bad) kinds[k] = (kinds[k] || 0) + 1;
  const names = [...new Set(bad.map((b) => b[1]))].sort();
  const sorts = names.filter((n) => /^sort-(alpha|numeric)-/.test(n));
  out(`Kind 1 · air readings below 1.5 on our set: ${bad.length} (${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(', ')}) · ${sorts.length} sort-alpha/sort-numeric concepts + ${names.filter((n) => !sorts.includes(n)).join(', ')}`);
}

function secS8(c) {
  head('8', 'What only Maruti\'s eye can settle');
  const F = c.fluent(), O = c.ours();
  const f16 = radiusSteps(F, 16, 4).top[0].r;
  out(`3 · their commonest contour corner at 16: ${r2(f16)} · ours (half-weight bend, contour): ${r2(STROKES[16])} · ${(STROKES[16] / f16).toFixed(1)}× rounder`);
  out(`4 · our worst on-axis tilt at 16: ${r2(angDrift(O, TRI).at[16].max)}°`);
  const mF = med(F.filter((d) => d.size === 16 && d.style === 'outline').map(minMargin)), mO = med(O.filter((d) => d.size === 16 && d.style === 'outline').map(minMargin));
  const xF = med(F.filter((d) => d.size === 16 && d.style === 'outline').map((d) => Math.max(d.ink.w, d.ink.h) / 16)), xO = med(O.filter((d) => d.size === 16 && d.style === 'outline').map((d) => Math.max(d.ink.w, d.ink.h) / 16));
  out(`2 · at 16, canvas less twice the median margin: ours ${Number(r2(16 - 2 * mO))}, theirs ${Number(r2(16 - 2 * mF))} · median largest ink dimension, theirs less ours: ${((xF - xO) * 100).toFixed(1)} points`);
}

export const SECTIONS = { answer: secAnswer, sample: secSample, 'sample-groups': secSampleGroups, approx: secApprox,
  s1: secS1, s2: secS2, s3: secS3, s4: secS4, s5: secS5, s6: secS6, s7: secS7, s8: secS8 };

const USAGE = 'usage: node tools/audit/fluent-probe.mjs <pin-dir with src/icons/{24,20,16}> [section …] [--refs <research/references dir>]\n'
  + `sections: ${Object.keys(SECTIONS).join(' ')}`;

export function main(argv = process.argv.slice(2)) {
  const at = argv.indexOf('--refs');
  const here = dirname(fileURLToPath(import.meta.url));
  const refs = resolve(at >= 0 ? argv[at + 1] ?? '' : join(here, '..', '..', 'research', 'references'));
  const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--refs'));
  const pin = pos[0] ? resolve(pos[0]) : null;
  if (!pin || !OURS.every((m) => existsSync(join(pin, 'src', 'icons', String(m))) && statSync(join(pin, 'src', 'icons', String(m))).isDirectory())) { console.error(USAGE); return 2; }
  if (!existsSync(join(refs, 'fluent', 'figma', 'catalogue.json'))) { console.error(`no Fluent records at ${join(refs, 'fluent', 'figma')}\n${USAGE}`); return 2; }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !SECTIONS[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${USAGE}`); return 2; }
  const c = context(pin, refs);
  c.refsDir = refs;
  const t = context(pin, refs, { trueGeometry: true, share: c });
  t.refsDir = refs;
  console.log(`# references-fluent.md — reprinted from pin ${pin} and ${join(refs, 'fluent', 'figma')}`);
  console.log(`# a line printed twice differs between "${LABEL_S.split(' │')[0]}" (geometry.mjs reads a curve by its control points — the document's reading) and "${LABEL_T.split(' │')[0]}" (curves flattened to points on the curve first)`);
  for (const s of (wanted.length ? wanted : Object.keys(SECTIONS))) {
    const S = capture(() => SECTIONS[s](c)), T = capture(() => SECTIONS[s](t));
    for (const l of mergeReadings(S, T)) console.log(l);
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
