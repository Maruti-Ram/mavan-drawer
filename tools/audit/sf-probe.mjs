#!/usr/bin/env node
// tools/audit/sf-probe.mjs — the measured figures in docs/audit/references-sf.md (wave 2, card 2.2:
// SF Symbols, a closed vocabulary; drawn vs derived), printed again where they can be.
// AUDIT ONLY — imported by nothing; reads the pin, the card's reference records and Apple's own files,
// writes nothing (stdout only).
//
// Usage:
//   node tools/audit/sf-probe.mjs <pin-dir> [section …] [--refs <dir>] [--app <dir>] [--coreglyphs <dir>] [--no-font | --font-json <file>]
//   <pin-dir>      `git archive 5933041 | tar -x -C <dir>`; our side reads <pin-dir>/src/icons/24 (§4.2).
//   --refs         default: the repo's research/references — reads sfsymbols/names.json (name → code point,
//                  with confidence) and sfsymbols/basemap.json (`map`: Apple's base → derivatives), the wave-0
//                  records the card read.
//   --app          default: /Applications/SF Symbols.app/Contents/Resources — Metadata/*.plist|.strings|.json and
//                  the 26 loose badge templates (*.svg).
//   --coreglyphs   default: /System/Library/CoreServices/CoreGlyphs.bundle/Contents/Resources (binary plists,
//                  read with macOS `plutil -convert json`).
//   --no-font      skip the sections that read glyph outlines (they go through tools/audit/refs/sfsymbols.mjs
//                  glyphs(), python3 + fontTools on the app's SFSymbolsFallback.otf; nothing is written).
//   --font-json    read the outlines from a JSON stand-in instead of the font (see fakeFont; the tests use it).
//   No section = all. An unknown section, or a pin without src/icons, exits 2.
//
// Sections (the document § each one backs):
//   short    the short answer, items 1–10 (the figures that reprint)
//   sample   "Sample, and why this one", Units, Declared limits (contour reuse, 14 pairs)
//   checks   Instruments: check (a) [not reprintable], check (b) template side (the 26 badge templates)
//   s1       §1 what Apple declares as data (the file table and the three readings below it)
//   s2.1     §2.1 the shape of the relation
//   s2.2     §2.2 what the 58 tokens do
//   s2.3     §2.3 the grammar: coverage and stacking
//   s2.4     §2.4 suffix order
//   s2.5     §2.5 closed grammar, growing lexicon (release table)
//   s3.1     §3.1 the population census: n, ink box grows, layout width (the raster columns are not reprintable)
//   s3.2     §3.2 the container is one drawing (outer boxes, nine cells, exact bounds, left edges, advances)
//   s3.3-6   §3.3–3.6 and §3.8–3.9: the population counts that are data; every raster figure is listed not reprintable
//   s3.7     §3.7 the cut is a layer (the 26 templates)
//   s4.2     §4.2 what our names already say (the pin)
//   s5       §5 K5 (the pair count) — K1–K4, K6 cite raster figures
//   s8       §8 seen and not carried (pairing, numbered names, locale aliases, scale-glyph walls)
//   s9       §9 the figures the take/refuse list repeats (T2, T3, T4, R4, R6, R7, R8)
//
// Where the card's logic lived (research/references/sfsymbols/card-2.2/, gitignored; and transcript
// agent-a0b4f5321ca183e9c): sf_grammar.py (roles, signatures, precedence, token table, fill pairing) →
// roles()/signature()/grammar(); sf_containers.py, sf_containers2.py (outer box of the largest contour, cubic
// flattened to 6 / 4 pieces) → outerBoxes(); the inline BoundsPen / advance / release / alias / locale reads;
// sf_templates.py (1)(2)(4) → templateHalo(), the circle wall; sf_reuse.py → contourReuse(); sf_census.py's
// box and advance fields (cbox: cubic flattened to 8 pieces) → the §3.1 computable columns; the inline
// classification of our 485 names → ourParents().
//
// THE RASTER FIGURES (base in place / scaled / redrawn, silhouette overlap, the cut, slashes, badges, corner
// rank, the 26 deep pairs and the three-weight table) were measured by the card on Skia rasters of the font with
// scipy's distance transform and FFT boundary correlation (sf_pair.py, sf_meas.py, sf_census*.py, sf_cut.py,
// sf_corner.py, sf_deep.py; ~20 min on 8 processes). The card SAVED one record per pair under --refs
// (sfsymbols/card-2.2/sf2/*.jsonl, sf2/corner.json, sf/deep.json); the r3.* sections reprint the card's own
// aggregation over those records ("from the card's raster records; the raster itself not re-run"). The raster
// stage itself is not re-run by a committed tool: it needs python3 + skia-python / scipy (user-site installs on
// this machine) or a JS port of those scripts. Check (a) and the font side of check (b) have no saved records.
//   r3.1     §3.1 the three base-kept columns, 74 of 744        (regcensus.jsonl, sf_reg_an.py)
//   r3.4     §3.4 silhouettes, the cut                           (fill.jsonl, cut.jsonl, sf_cens2_an.py)
//   r3.5     §3.5 slashes                                        (slash.jsonl)
//   r3.6     §3.6 badges, corner rank                            (badge.jsonl, corner.json)
//   r3.deep  §3.3, §3.8, §3.9 the 26 deep pairs                  (deep.json, sf_final_tables.py)
//
// Instruments: tools/audit/refs/sfsymbols.mjs (glyphs(), FONT), tools/audit/refs/nucleo.mjs (bboxOf,
// normalisePath — exact cubic bounds, the svgpathtools/BoundsPen reading). Known instrument defects
// (plans/set-and-rules-audit.md): none of the listed ones is on this path (no raster.mjs, pixelgrid.mjs,
// figma.mjs, congruence.mjs, geometry.mjs bbox() or build.mjs boxes). geometry.mjs samplePath reads curves by their
// control points (closing check, 2026-10-09): not on this path either — curves go through nucleo.mjs bboxOf (exact),
// this probe's flatContours (curve evaluation at equal t) and samplePath (svgpathtools' sampling), and fontTools.
//
// Run time on this Mac (node 24, loaded machine): the data sections < 1 s; a full run 15–30 s (s3.1 and s3.2 read
// ~6,000 glyphs through python + fontTools).

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bboxOf, normalisePath } from './refs/nucleo.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');

// ═══════════════════════════════════════════════════════════════════════════
// number formatting (python's)
// ═══════════════════════════════════════════════════════════════════════════

export function rint(x) { const f = Math.floor(x), d = x - f; if (d > 0.5) return f + 1; if (d < 0.5) return f; return f % 2 === 0 ? f : f + 1; }
/** python round(x, dp): nearest by the binary value's exact decimal expansion, an exact tie to even (= fx). */
export const pyRound = (x, dp = 0) => Number(fx(x, dp));
export function fx(x, dp = 0) {
  if (x == null || !Number.isFinite(x)) return String(x);
  const exact = Math.abs(x).toFixed(Math.min(100, dp + 40));       // the binary value's exact decimal expansion
  const tail = exact.slice(exact.indexOf('.') + 1 + dp);
  if (!/^50*$/.test(tail)) return x.toFixed(dp);                    // not an exact tie: toFixed is correctly rounded
  const k = 10 ** dp, y = Math.abs(x) * k, lo = Math.floor(y), even = lo % 2 === 0 ? lo : lo + 1;
  return (Math.sign(x) * even / k).toFixed(dp);                    // an exact tie goes to even, as python's format does
}
const nf = (n) => Number(n).toLocaleString('en-US');
const pc1 = (x) => `${fx(100 * x, 1)}%`, pc0 = (x) => `${fx(100 * x, 0)}%`;
export function percentile(arr, p) { const a = [...arr].sort((x, y) => x - y); if (!a.length) return NaN; const i = ((a.length - 1) * p) / 100, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); }
const counter = (vals) => { const c = new Map(); for (const v of vals) c.set(v, (c.get(v) || 0) + 1); return c; };
/** most_common(): by count descending; ties keep first-seen order (python's Counter). */
const mostCommon = (c) => [...c].sort((a, b) => b[1] - a[1]);

// ═══════════════════════════════════════════════════════════════════════════
// Apple's files
// ═══════════════════════════════════════════════════════════════════════════

/** A plist (XML or binary) or a binary .strings, as JSON, through macOS plutil. */
export function readPlist(file) {
  const r = spawnSync('plutil', ['-convert', 'json', '-o', '-', file], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`plutil failed on ${file}: ${r.stderr}`);
  return JSON.parse(r.stdout);
}
/** A text .strings file ("key" = "value";), as the card's regex read it. */
export function readStrings(file) {
  const d = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = /^\s*"([^"]*)"\s*=\s*"([^"]*)"\s*;/.exec(line);
    if (m) d[m[1]] = m[2];
  }
  return d;
}
/** A .strings that may be binary (CoreGlyphs) or text (the app's Metadata). */
export function readAnyStrings(file) {
  const head = fs.readFileSync(file).subarray(0, 6).toString('latin1');
  return head.startsWith('bplist') ? readPlist(file) : readStrings(file);
}

export function loadData({ refs, app, coreglyphs }) {
  const memo = {};
  const once = (k, f) => (k in memo ? memo[k] : (memo[k] = f()));
  const meta = (f) => path.join(app, 'Metadata', f), cg = (f) => path.join(coreglyphs, f);
  return {
    paths: { meta, cg, app },
    names: () => once('names', () => JSON.parse(fs.readFileSync(path.join(refs, 'sfsymbols', 'names.json'), 'utf8')).names),
    namesMeta: () => once('namesMeta', () => { const j = JSON.parse(fs.readFileSync(path.join(refs, 'sfsymbols', 'names.json'), 'utf8')); return { appVersion: j.appVersion ?? null, coreGlyphsVersion: j.coreGlyphsVersion ?? null }; }),
    map: () => once('map', () => JSON.parse(fs.readFileSync(path.join(refs, 'sfsymbols', 'basemap.json'), 'utf8')).map),
    n2f: () => once('n2f', () => readAnyStrings(cg('nofill_to_fill.strings'))),
    aliases: () => once('aliases', () => readAnyStrings(cg('name_aliases.strings'))),
    legacy: () => once('legacy', () => readAnyStrings(meta('legacy_aliases.strings'))),
    avail: () => once('avail', () => readPlist(cg('name_availability.plist')).symbols),
    layerset: () => once('layerset', () => readPlist(meta('layerset_availability.plist')).symbols),
    symCats: () => once('symCats', () => readPlist(meta('symbol_categories.plist'))),
    cats: () => once('cats', () => readPlist(meta('categories.plist'))),
    search: () => once('search', () => readPlist(meta('symbol_search.plist'))),
    restrictions: () => once('restrictions', () => readAnyStrings(cg('symbol_restrictions.strings'))),
    semantic: () => once('semantic', () => readAnyStrings(cg('semantic_to_descriptive_name.strings'))),
    order: () => once('order', () => readPlist(cg('symbol_order.plist'))),
    flippable: () => once('flippable', () => readPlist(cg('legacy_flippable.plist'))),
    records: () => once('records', () => loadRecords(refs)),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// the grammar (sf_grammar.py)
// ═══════════════════════════════════════════════════════════════════════════

export const ENC = new Set(['circle', 'square', 'rectangle', 'capsule', 'diamond', 'triangle', 'hexagon', 'seal', 'shield', 'bubble', 'app', 'icloud', 'viewfinder']);
export const QUAL = new Set(['portrait', 'stack', 'on', 'crop', 'video']);
export const STYLE = new Set(['fill', 'dotted', 'inverse', 'half', 'filled']);
export const ROT = new Set(['arrow', 'trianglehead', 'clockwise', 'counterclockwise', 'rotate', '90', '2']);
/** The container endings §3.4 splits the fill pairs by (the card's list): a name ending in one is a container outline. */
export const ENC_ENDS = ['.circle', '.square', '.rectangle', '.diamond', '.capsule', '.shield', '.app', '.seal', '.hexagon', '.triangle', '.bubble'];
export const isContainerName = (x) => ENC_ENDS.some((e) => x.endsWith(e));
/** The card's 20 locale and direction suffixes (K5, the pair count). */
export const LOCALE_SUFFIXES = new Set(['ar', 'he', 'hi', 'ja', 'ko', 'th', 'zh', 'rtl', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'si', 'sat', 'mni']);
export const isLocaleVariant = (k) => LOCALE_SUFFIXES.has(k.split('.').pop());
/** §8's narrower test for an alias: a script or direction suffix (the card's regex). */
export const ALIAS_LOCALE = /\.(ar|he|hi|ja|ko|th|zh|rtl|ltr)$/;
/** Release tags are years with point releases (2021.6); a release's year is its whole part. The first year in the tables is 2019. */
export const releaseYear = (tag) => Math.floor(tag);
export const FIRST_YEAR = 2019;
export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

/** Each suffix token's role: BADGE, FILL, SLASH, GLYPH (a word after a badge), ENCL, QUAL, STYLE, ROT, OTHER. */
export function roles(suffix) {
  const out = []; let inBadge = false;
  for (const t of suffix.split('.')) {
    if (t === 'badge' || t === 'trianglebadge') { out.push(['BADGE', t]); inBadge = true; continue; }
    if (t === 'fill') { out.push(['FILL', t]); continue; }
    if (t === 'slash') { out.push(['SLASH', t]); inBadge = false; continue; }
    if (inBadge && !ENC.has(t) && !QUAL.has(t) && !STYLE.has(t)) { out.push(['GLYPH', t]); continue; }
    if (ENC.has(t)) out.push(['ENCL', t]);
    else if (QUAL.has(t)) out.push(['QUAL', t]);
    else if (STYLE.has(t)) out.push(['STYLE', t]);
    else if (ROT.has(t)) out.push(['ROT', t]);
    else out.push(['OTHER', t]);
  }
  return out;
}
/** The role pattern of a suffix, a badge's glyph words collapsed to one GLYPH. */
export function signature(r) {
  const out = [];
  for (const [role] of r) {
    if (role === 'GLYPH' && out.length && (out[out.length - 1] === 'BADGE' || out[out.length - 1] === 'GLYPH')) { if (out[out.length - 1] !== 'GLYPH') out.push('GLYPH'); continue; }
    out.push(role);
  }
  return out.join('.');
}
/** The base map as rows: every derivative spelled `<base>.<suffix>`, with its roles. */
export function grammar(M) {
  const der2base = new Map();
  for (const [b, ds] of Object.entries(M)) for (const d of ds) der2base.set(d, b);
  const rows = [];
  for (const [d, b] of der2base) if (d.startsWith(`${b}.`)) { const suf = d.slice(b.length + 1); rows.push({ b, d, suf, r: roles(suf) }); }
  return { bases: new Set(Object.keys(M)), der2base, rows };
}
/** §3.1's class of a pair (sf_reg_an.py). */
export function modifierClass(sig) {
  if (sig === 'FILL') return 'fill';
  if (sig === 'ENCL') return 'enclosure';
  if (sig === 'ENCL.FILL') return 'enclosure+fill';
  if (sig.startsWith('BADGE')) return `badge${sig.includes('FILL') ? '+fill' : ''}`;
  if (sig.startsWith('SLASH')) return `slash${sig.includes('FILL') ? '+fill' : ''}${sig.includes('ENCL') ? '+enclosure' : ''}`;
  if (sig.startsWith('FILL.BADGE')) return 'fill+badge';
  if (sig.startsWith('ROT')) return 'rotate-arrow';
  return `other:${sig}`;
}
const resolved = (names, n) => { const v = names[n]; return !!v && v.confidence !== 'doubtful'; };

// ═══════════════════════════════════════════════════════════════════════════
// geometry on glyph outlines (font units, y up) — exact where the card used BoundsPen / svgpathtools
// ═══════════════════════════════════════════════════════════════════════════

/** sf_font.contours: one polyline per contour, every cubic cut into n equal-t pieces. */
export function flatContours(ops, n) {
  const out = []; let cur = null, p = null;
  for (const o of ops) {
    if (o[0] === 'M') { if (cur?.length) out.push(cur); cur = [[o[1], o[2]]]; p = [o[1], o[2]]; }
    else if (o[0] === 'L') { cur.push([o[1], o[2]]); p = [o[1], o[2]]; }
    else if (o[0] === 'C') {
      for (let i = 1; i <= n; i++) {
        const t = i / n, u = 1 - t;
        cur.push([u ** 3 * p[0] + 3 * u * u * t * o[1] + 3 * u * t * t * o[3] + t ** 3 * o[5], u ** 3 * p[1] + 3 * u * u * t * o[2] + 3 * u * t * t * o[4] + t ** 3 * o[6]]);
      }
      p = [o[5], o[6]];
    } else if (o[0] === 'Q') { cur.push([o[1], o[2]], [o[3], o[4]]); p = [o[3], o[4]]; }
    else if (o[0] === 'Z') { if (cur?.length) out.push(cur); cur = null; }
  }
  if (cur?.length) out.push(cur);
  return out;
}
const boxOf = (pts) => pts.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [Infinity, Infinity, -Infinity, -Infinity]);
/** The box of the largest contour (by its box's area) — "the outer box of the largest contour". */
export function outerBox(ops, n = 6) {
  const boxes = flatContours(ops, n).map(boxOf);
  return boxes.reduce((a, b) => ((b[2] - b[0]) * (b[3] - b[1]) > (a[2] - a[0]) * (a[3] - a[1]) ? b : a));
}
/** The ink box over every contour (sf_pair.cbox: cubics in 8 pieces). */
export const cbox = (ops, n = 8) => boxOf(flatContours(ops, n).flat());
/** Exact bounds (fontTools BoundsPen = cubic extrema). */
export const exactBounds = (ops) => { const b = bboxOf(ops); return [b.x0, b.y0, b.x1, b.y1]; };
/** Contours as the font's own points (on- and off-curve), for the control-point reuse test (sf_reuse.raw_contours). */
export function rawContours(ops) {
  const out = []; let cur = null;
  for (const o of ops) {
    if (o[0] === 'M') { if (cur?.length) out.push(cur); cur = [[o[1], o[2]]]; }
    else if (o[0] === 'L') cur.push([o[1], o[2]]);
    else if (o[0] === 'C') cur.push([o[1], o[2]], [o[3], o[4]], [o[5], o[6]]);
    else if (o[0] === 'Q') cur.push([o[1], o[2]], [o[3], o[4]]);
    else if (o[0] === 'Z') { if (cur?.length) out.push(cur); cur = null; }
  }
  if (cur?.length) out.push(cur);
  return out;
}
const roll = (a, k) => a.slice(k).concat(a.slice(0, k));
/** b = a + t for one t, allowing a cyclic start shift and reversal, within `tol` units (sf_reuse.same_up_to_translation). */
export function sameUpToTranslation(a, b, tol = 0.75) {
  if (a.length !== b.length) return null;
  for (const rev of [false, true]) {
    const bb = rev ? [...b].reverse() : b;
    for (let k = 0; k < a.length; k++) {
      const bk = roll(bb, k), d = bk.map((q, i) => [q[0] - a[i][0], q[1] - a[i][1]]);
      const t = [d.reduce((s, v) => s + v[0], 0) / d.length, d.reduce((s, v) => s + v[1], 0) / d.length];
      if (Math.max(...d.map((v) => Math.max(Math.abs(v[0] - t[0]), Math.abs(v[1] - t[1])))) <= tol) return { t, rev, k };
    }
  }
  return null;
}
/** b = s·a + t (s > 0.05), cyclic shift and reversal, least squares, worst residual ≤ tol (sf_reuse.same_up_to_scale). */
export function sameUpToScale(a, b, tol = 1.0) {
  if (a.length !== b.length || a.length < 3) return null;
  const mean = (P) => [P.reduce((s, v) => s + v[0], 0) / P.length, P.reduce((s, v) => s + v[1], 0) / P.length];
  const ma = mean(a), ac = a.map((v) => [v[0] - ma[0], v[1] - ma[1]]), den = ac.reduce((s, v) => s + v[0] * v[0] + v[1] * v[1], 0);
  if (den < 1e-9) return null;
  let best = null;
  for (const rev of [false, true]) {
    const bb = rev ? [...b].reverse() : b;
    for (let k = 0; k < a.length; k++) {
      const bk = roll(bb, k), mb = mean(bk), bc = bk.map((v) => [v[0] - mb[0], v[1] - mb[1]]);
      const s = ac.reduce((acc, v, i) => acc + v[0] * bc[i][0] + v[1] * bc[i][1], 0) / den;
      if (s <= 0.05) continue;
      const t = [mb[0] - s * ma[0], mb[1] - s * ma[1]];
      const res = Math.max(...bk.map((q, i) => Math.max(Math.abs(q[0] - (s * a[i][0] + t[0])), Math.abs(q[1] - (s * a[i][1] + t[1])))));
      if (res <= tol && (!best || res < best.res)) best = { s, t, rev, res, k };
    }
  }
  return best;
}
/** sf_reuse.reuse_report: for each base contour, the first derivative contour it equals by translation, else by scale. */
export function contourReuse(baseOps, derOps) {
  const cb = rawContours(baseOps), cd = rawContours(derOps);
  return cb.map((a) => {
    for (const [j, b] of cd.entries()) if (sameUpToTranslation(a, b)) return { kind: 'T', j };
    for (const [j, b] of cd.entries()) { const r = sameUpToScale(a, b); if (r) return { kind: 'S', j, s: r.s }; }
    return null;
  });
}
/** The ring of a two-contour glyph (the `circle`): outer and inner exact widths, wall = their half difference. */
export function ringWall(ops) {
  const cons = []; let cur = null;
  for (const o of ops) { if (o[0] === 'M') { cur = [o]; cons.push(cur); } else if (cur) cur.push(o); }
  const ws = cons.map((c) => { const b = bboxOf(c); return b.x1 - b.x0; }).sort((a, b) => b - a);
  return { outer: ws[0], inner: ws[1], wall: (ws[0] - ws[1]) / 2 };
}

// ── the loose badge templates (sf_templates.py) ─────────────────────────────

/** A template master's layers: [class, d] from `id="<master>"` to the first `</g>` (the card's regex read). */
export function templateLayers(text, master) {
  const i = text.indexOf(`id="${master}"`);
  if (i < 0) return [];
  let seg = text.slice(i); seg = seg.slice(0, seg.indexOf('</g>'));
  return [...seg.matchAll(/<path class="([^"]*)" d="([^"]+)"/g)].map((m) => [m[1], m[2]]);
}
const cubicPt = (p0, c1, c2, p1, t) => { const u = 1 - t; return [u ** 3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * p1[0], u ** 3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * p1[1]]; };
const quadPt = (p0, c, p1, t) => { const u = 1 - t; return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]; };
/** svgpathtools' sampling of a `d`: per continuous sub-path, m = max(50, ⌊length / step⌋) points at T = i/m, T spread over the segments by length, bezier t within each. */
export function samplePath(d, step = 0.15) {
  const subs = []; let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  for (const s of normalisePath(d)) {
    if (s[0] === 'M') { cur = []; subs.push(cur); cx = sx = s[1]; cy = sy = s[2]; }
    else if (s[0] === 'L') { const x0 = cx, y0 = cy, x1 = s[1], y1 = s[2]; cur.push({ f: (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] }); cx = x1; cy = y1; }
    else if (s[0] === 'C') { const p0 = [cx, cy], c1 = [s[1], s[2]], c2 = [s[3], s[4]], p1 = [s[5], s[6]]; cur.push({ f: (t) => cubicPt(p0, c1, c2, p1, t) }); cx = s[5]; cy = s[6]; }
    else if (s[0] === 'Q') { const p0 = [cx, cy], c = [s[1], s[2]], p1 = [s[3], s[4]]; cur.push({ f: (t) => quadPt(p0, c, p1, t) }); cx = s[3]; cy = s[4]; }
    else if (s[0] === 'Z') { if (Math.hypot(cx - sx, cy - sy) > 0) { const x0 = cx, y0 = cy, x1 = sx, y1 = sy; cur.push({ f: (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] }); } cx = sx; cy = sy; }
  }
  const pts = [];
  for (const segs of subs) {
    if (!segs.length) continue;
    const lens = segs.map((g) => { let L = 0, q = g.f(0); for (let i = 1; i <= 400; i++) { const r = g.f(i / 400); L += Math.hypot(r[0] - q[0], r[1] - q[1]); q = r; } return L; });
    const tot = lens.reduce((a, b) => a + b, 0), fr = [0];
    for (const L of lens) fr.push(fr[fr.length - 1] + L / tot);
    const m = Math.max(50, Math.floor(tot / step));
    for (let i = 0; i < m; i++) {
      const T = i / m; let k = 0;
      while (k < segs.length - 1 && T >= fr[k + 1]) k++;
      const span = fr[k + 1] - fr[k];
      pts.push(segs[k].f(span > 0 ? (T - fr[k]) / span : 0));
    }
  }
  return pts;
}
/** Distances from every halo point to the nearest badge point → {median, min, max} (cKDTree query). */
export function haloOffset(haloD, badgeD) {
  const H = samplePath(haloD), B = samplePath(badgeD);
  const d = H.map(([x, y]) => { let m = Infinity; for (const [u, v] of B) { const e = (u - x) ** 2 + (v - y) ** 2; if (e < m) m = e; } return Math.sqrt(m); });
  return { median: percentile(d, 50), min: Math.min(...d), max: Math.max(...d) };
}

// ── our side: what each of our names says about its parent (C9, C8) ─────────

/** The card's classification of our 485 outline names: number, size, size+number, modifier (a shorter concept is a prefix), root. */
export function ourParents(names) {
  const S = new Set(names), kinds = new Map(), parent = new Map(), amb = [];
  for (const n of names) {
    const sm = /^(.*)-(small|large)$/.exec(n), core = sm ? sm[1] : n, size = sm ? sm[2] : null;
    const nm = /^(.*)-(\d+)$/.exec(core), core2 = nm ? nm[1] : core, num = nm ? nm[2] : null;
    const kind = [];
    if (size && S.has(core)) { kind.push('size'); parent.set(n, core); } else if (size) kind.push('size-orphan');
    if (num && !size) { if (S.has(core2)) { kind.push('number'); parent.set(n, core2); } else kind.push('number-orphan'); }
    if (size && num && S.has(core2)) kind.push('number');
    if (!kind.length) {
      const toks = core.split('-'); let par = null;
      for (let k = toks.length - 1; k > 0; k--) { const c = toks.slice(0, k).join('-'); if (S.has(c)) { par = c; break; } }
      if (par) { kind.push('modifier'); parent.set(n, par); } else kind.push('root');
    }
    kinds.set(n, kind.join('+'));
    const toks = core2.split('-'), c = [];
    for (let k = 1; k < toks.length; k++) { const cand = toks.slice(0, k).join('-'); if (S.has(cand)) c.push(cand); }
    if (c.length > 1) amb.push([n, c]);
  }
  return { kinds, parent, amb };
}

// ═══════════════════════════════════════════════════════════════════════════
// the font, through tools/audit/refs/sfsymbols.mjs (python3 + fontTools; writes nothing)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A stand-in for the font (`--font-json <file>`, for tests): {meta, strokes: {"wght|scale": units}, glyphs: [{cp, scale,
 * wght, advance, ops}]} answers the four calls the sections make, in the shape refs/sfsymbols.mjs returns them —
 * a code point absent from the file is missing, a code point present but not at a (scale, wght) is missing there.
 */
export function fakeFont(file) {
  const J = JSON.parse(fs.readFileSync(file, 'utf8'));
  const at = new Map(J.glyphs.map((g) => [`${g.cp}|${g.scale}|${g.wght}`, g])), cps = new Set(J.glyphs.map((g) => g.cp));
  return {
    fontMeta: () => J.meta,
    namedWeights: () => J.meta.instances.map((i) => ({ name: i.name.toLowerCase(), wght: i.coords.wght })),
    strokeOf: (wght, scale) => J.strokes[`${wght}|${scale}`] ?? null,
    glyphs: (list, weights, scales) => list.flatMap((cp) => (!cps.has(cp) ? [{ cp, missing: true }]
      : scales.flatMap((sc) => weights.map((w) => at.get(`${cp}|${sc}|${w.wght}`) ?? { cp, scale: sc, weight: w.name, wght: w.wght, missing: true })))),
  };
}
/** The font the sections read: the app's, through refs/sfsymbols.mjs, or the `--font-json` stand-in. */
export const fontApi = async (opt) => (opt.fontJson ? fakeFont(opt.fontJson) : import('./refs/sfsymbols.mjs'));
/** The scale glyphs §8 reads the plain circle's wall at, in the order the line prints them. */
export const WALL_SCALES = ['small', 'medium', 'large'];

const glyphMemo = new Map();
/** Outlines for names at (wght, scale): name → {ops, advance}. Missing / unresolved names map to null. */
async function outlines(opt, names, nameList, wght = 400, scale = 'medium') {
  const SF = opt.api;
  const want = [...new Set(nameList)].filter((n) => names[n] && !glyphMemo.has(`${n}|${wght}|${scale}`));
  const cps = [...new Set(want.map((n) => names[n].cp))];
  const byCp = new Map();
  for (const g of cps.length ? SF.glyphs(cps, [{ name: `w${wght}`, wght }], [scale]) : []) if (!g.missing) byCp.set(g.cp, { ops: g.ops, advance: g.advance });
  for (const n of want) glyphMemo.set(`${n}|${wght}|${scale}`, byCp.get(names[n].cp) ?? null);
  return (n) => glyphMemo.get(`${n}|${wght}|${scale}`) ?? null;
}

// ═══════════════════════════════════════════════════════════════════════════
// sections
// ═══════════════════════════════════════════════════════════════════════════

const out = (s = '') => console.log(s);
const head = (t) => out(`\n## ${t}`);
const NR = (what, needs = 'python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card\'s saved per-pair records reprints in the r3.* sections') => out(`[raster stage not re-run by a committed tool: ${what} — needs ${needs}]`);
const kb = (f) => { const n = fs.statSync(f).size; return n < 1024 ? '<1 KB' : `${fx(n / 1024, 0)} KB`; };

function pairsResolved(D) {
  const names = D.names(), M = D.map();
  const all = Object.entries(M).flatMap(([b, ds]) => ds.map((d) => [b, d]));
  const res = all.filter(([b, d]) => resolved(names, b) && resolved(names, d));
  return { all, res, prefixed: res.filter(([b, d]) => d.startsWith(`${b}.`)) };
}

async function secSample(D, opt) {
  head('Sample, and why this one');
  const names = D.names(), conf = counter(Object.values(names).map((v) => v.confidence));
  out(`Names: ${nf(Object.keys(names).length)} names resolved to glyphs — sure ${nf(conf.get('sure'))} · tied ${nf(conf.get('tied'))} · likely ${nf(conf.get('likely'))} · doubtful ${nf(conf.get('doubtful'))}`);
  const P = pairsResolved(D);
  out(`Pairs: the ${nf(P.all.length)} base→derivative pairs; ${nf(P.res.length)} have both names resolved (${pc1(P.res.length / P.all.length)}); ${nf(P.prefixed.length)} of those are spelled <base>.<suffix>`);
  out('(Deep sample: 26 hand-picked pairs, identified by eye on contact sheets — a pick, not a census.)');
  if (opt.font) {
    const { fontMeta, namedWeights, strokeOf } = opt.api;
    const m = fontMeta(), ax = m.axes[0], ul = namedWeights().find((w) => w.name === 'ultralight');
    out(`Font: ${nf(m.puaSymbols)} glyphs (symbol code points; ${nf(m.numGlyphs)} glyph outlines with the scale variants), weight axis ${ax.min}–${nf(ax.max)} (default ${ax.default}), ${m.upem} units per em; named Ultralight at wght ${pyRound(ul.wght, 2)}`);
    const w = Object.fromEntries([1, 400, 1000].map((wght) => [wght, strokeOf(wght, 'medium')]));
    out(`Units: at Regular and Medium the stroke (ring of the circle glyph) is ${pyRound(w[400], 2)} units = ${fx((100 * w[400]) / 2048, 1)}% of the em; at the lightest master ${pyRound(w[1], 2)}, at the heaviest ${pyRound(w[1000], 2)}`);
  }
  const P0 = path.resolve(opt.pin, 'src/icons');
  const conc = fs.readdirSync(path.join(P0, '24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).length;
  const files = [24, 20, 16].reduce((s, m) => s + fs.readdirSync(path.join(P0, String(m))).filter((f) => f.endsWith('.svg')).length, 0);
  out(`Our side: ${conc} concepts × 3 masters × 2 styles = ${nf(files)} drawings`);
  out('');
  out('Declared limits:');
  if (opt.font) {
    const pairs = [['bell', 'bell.fill'], ['bell', 'bell.badge'], ['bell', 'bell.slash'], ['plus', 'plus.circle'], ['plus', 'plus.square'], ['checkmark', 'checkmark.circle'], ['person', 'person.badge.plus'], ['person', 'person.fill'], ['person', 'person.circle'], ['lock', 'lock.fill'], ['lock', 'lock.slash'], ['lock', 'lock.badge.clock'], ['xmark', 'xmark.circle'], ['heart', 'heart.fill']];
    const g = await outlines(opt, names, pairs.flat());
    let tot = 0, hit = 0;
    for (const [b, d] of pairs) { const r = contourReuse(g(b).ops, g(d).ops); tot += r.length; hit += r.filter(Boolean).length; }
    out(`- for ${pairs.length} base→derivative pairs, ${hit} of ${tot} base contours matched a derivative contour (control points, within 0.75 units by translation or 1 unit by scale)`);
  }
  out('- base map *use* by the app: [needs measuring — closed-source] (the document says so)');
}

async function secChecks(D) {
  head('Instruments — two checks that the method reads true');
  NR('(a) the slash bar read by the ridge method against a perpendicular profile, on bell.slash and the five slashes, at three weights');
  const f = path.join(D.paths.app, 'badge.plus.svg'), text = fs.readFileSync(f, 'utf8');
  const ring = (master) => {
    const L = templateLayers(text, master);
    const halo = bboxOf(normalisePath(L[0][1])), disc = bboxOf(normalisePath(L[1][1]));
    const hw = halo.x1 - halo.x0, hh = halo.y1 - halo.y0, dw = disc.x1 - disc.x0, dh = disc.y1 - disc.y0;
    const off = haloOffset(L.find(([c]) => c.includes('monochrome-0'))[1], L.find(([c]) => c.includes('monochrome-1'))[1]);
    return { off: off.median, across: (hw - dw) / 2, down: (hh - dh) / 2, discW: dw, discH: dh, rHalo: hh / 2, rDisc: dh / 2 };
  };
  const R = ring('Regular-S'), B = ring('Black-S'), U = ring('Ultralight-S');
  out(`(b) badge.plus template, Regular small: clear ring ${fx(R.down, 3)} per 100 em (${fx(R.across, 3)} across, ${fx(R.down, 3)} down; the median outline-to-outline offset is ${fx(R.off, 3)}); disc ${fx(R.discH, 2)} (${fx(R.discW, 2)} across); first-layer radius ${fx(R.rHalo, 2)} − badge radius ${fx(R.rDisc, 2)} = ${fx(R.rHalo - R.rDisc, 3)}`);
  out(`    Black: template ${fx(B.down, 3)} (disc ${fx(B.discH, 2)}); Ultralight: template ${fx(U.down, 3)} (disc ${fx(U.discH, 2)})`);
  NR('(b) the font side — the same ring and disc read from the font by the card\'s raster method on person.badge.plus and four more badge pairs, at Regular, Black and the named Ultralight');
}

async function secS1(D) {
  head('§1 What Apple declares as data');
  const { meta, cg } = D.paths, M = D.map(), names = D.names();
  const bases = Object.keys(M), ders = bases.flatMap((b) => M[b]);
  const all = new Set([...bases, ...ders]);
  const al = D.aliases(), alOld = Object.keys(al), alNew = Object.values(al);
  const inMap = alNew.filter((v) => all.has(v));
  const legacy = D.legacy(), fb = Object.values(legacy).filter((v) => /\.fill\.badge\./.test(v));
  const av = D.avail(), tags = counter(Object.values(av));
  const whole = [...tags].filter(([k]) => /^\d{4}$/.test(k)).sort((a, b) => a[0] - b[0]);
  const sc = D.symCats(), cats = D.cats(), ss = D.search();
  const per = (o) => Object.values(o).reduce((s, v) => s + v.length, 0) / Object.keys(o).length;
  out('| File | Size | Holds | Declares (the measured part) |');
  out(`| Metadata/base_symbols_map.json | ${kb(meta('base_symbols_map.json'))} | ${nf(bases.length)} bases → ${nf(ders.length)} derivatives | |`);
  out(`| CoreGlyphs/nofill_to_fill.strings | ${kb(cg('nofill_to_fill.strings'))} | ${nf(Object.keys(D.n2f()).length)} pairs | |`);
  out(`| CoreGlyphs/name_aliases.strings | ${kb(cg('name_aliases.strings'))} | ${nf(alOld.length)} entries | ${alOld.filter((k) => all.has(k)).length} of the ${nf(alOld.length)} old names in the current map; ${nf(inMap.length)} entries point at a name that is (${nf(new Set(inMap).size)} distinct) |`);
  out(`| Metadata/legacy_aliases.strings | ${kb(meta('legacy_aliases.strings'))} | ${Object.keys(legacy).length} entries | ${fb.length} move \`fill\` before a badge |`);
  out(`| CoreGlyphs/name_availability.plist | ${kb(cg('name_availability.plist'))} | ${nf(Object.keys(av).length)} symbols, ${tags.size} release tags | whole-year tags: ${whole.map(([k, v]) => `${k} ${nf(v)}`).join(' · ')} |`);
  out(`| Metadata/layerset_availability.plist | ${kb(meta('layerset_availability.plist'))} | ${nf(Object.keys(D.layerset()).length)} symbols | |`);
  out(`| Metadata/symbol_categories.plist + categories.plist | ${kb(meta('symbol_categories.plist'))} | ${nf(Object.keys(sc).length)} symbols · ${cats.length} categories · ${fx(per(sc), 2)} per symbol | |`);
  out(`| Metadata/symbol_search.plist | ${kb(meta('symbol_search.plist'))} | ${nf(Object.keys(ss).length)} symbols · ${fx(per(ss), 2)} terms | |`);
  out(`| CoreGlyphs/symbol_restrictions.strings | ${kb(cg('symbol_restrictions.strings'))} | ${nf(Object.keys(D.restrictions()).length)} symbols | |`);
  const sem = D.semantic();
  out(`| CoreGlyphs/semantic_to_descriptive_name.strings | ${kb(cg('semantic_to_descriptive_name.strings'))} | **${Object.keys(sem).length}** entries | ${['add', 'organize', 'search'].filter((k) => sem[k]).map((k) => `${k}→${sem[k]}`).join(', ')} |`);
  out(`| CoreGlyphs/symbol_order.plist | ${kb(cg('symbol_order.plist'))} | ${nf(D.order().length)} symbols | |`);
  out(`| CoreGlyphs/legacy_flippable.plist | ${kb(cg('legacy_flippable.plist'))} | ${nf(D.flippable().length)} symbols | |`);
  // the three readings
  const { bases: B, der2base } = grammar(M);
  const rel = counter(Object.entries(D.n2f()).map(([x, xf]) => {
    const bx = B.has(x) ? x : der2base.get(x), bf = B.has(xf) ? xf : der2base.get(xf);
    if (B.has(x) && (M[x] || []).includes(xf)) return 'own';
    if (bx != null && bx === bf && !B.has(x)) return 'siblings';
    if (B.has(x) && B.has(xf)) return 'two bases';
    if (bx == null || bf == null) return 'not in map';
    return 'other';
  }));
  out(`Of the ${nf(Object.keys(D.n2f()).length)} declared pairs, ${nf(rel.get('own') || 0)} are X with its own X.fill; ${nf(rel.get('siblings') || 0)} are two derivatives of the same base; ${nf(rel.get('not in map') || 0)} involve a name not in the map${rel.get('two bases') ? `; ${rel.get('two bases')} are two separate bases` : ''}${rel.get('other') ? `; ${rel.get('other')} other` : ''}`);
  out(`The use-name table: ${Object.keys(sem).length} entries`);
  const reorder = Object.entries(al).filter(([o, n]) => o.split('.').sort().join('.') === n.split('.').sort().join('.')).length;
  out(`Renames: ${nf(alOld.length)} old names still resolve, ${reorder} of them pure reorders of the same words`);
  const tpl = fs.readdirSync(D.paths.app).filter((f) => /^(badge|trianglebadge).*\.svg$/.test(f)).sort();
  const nl = counter(tpl.map((f) => templateLayers(fs.readFileSync(path.join(D.paths.app, f), 'utf8'), 'Regular-S').length));
  out(`Templates: ${tpl.length} loose badge templates; ${Math.min(...nl.keys())} to ${Math.max(...nl.keys())} layers at Regular-S (${[...nl].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} with ${k}`).join(', ')})`);
}

function secS21(D) {
  head('§2.1 The shape of the relation');
  const M = D.map(), bases = Object.keys(M), n = bases.length, { rows, der2base, bases: B } = grammar(M);
  const ders = bases.flatMap((b) => M[b]);
  const dist = new Set(ders).size;
  out(`${nf(n)} bases · ${nf(ders.length)} derivatives · ${ders.length - dist} under two parents · ${ders.filter((d) => B.has(d)).length} derivatives that are themselves bases · mean ${fx(ders.length / n, 2)} per base, max ${Math.max(...bases.map((b) => M[b].length))} (${bases.reduce((a, b) => (M[b].length > M[a].length ? b : a))})`);
  const bin = (k) => (k === 1 ? '1' : k === 2 ? '2' : k === 3 ? '3' : k <= 9 ? '4–9' : '10+');
  const h = counter(bases.map((b) => bin(M[b].length)));
  out('| derivatives per base | 1 | 2 | 3 | 4–9 | 10+ |');
  out(`| bases | ${['1', '2', '3', '4–9', '10+'].map((k) => `${nf(h.get(k) || 0)} (${pc1((h.get(k) || 0) / n)})`).join(' | ')} |`);
  const single = bases.filter((b) => M[b].length === 1);
  out(`${nf(single.filter((b) => M[b][0] === `${b}.fill`).length)} of the ${nf(single.length)} single-derivative bases have <base>.fill as their only derivative; ${nf(bases.filter((b) => M[b].includes(`${b}.fill`)).length)} bases have a <base>.fill`);
  const bt = (role) => new Set(rows.filter((x) => x.r.some(([r]) => r === role)).map((x) => x.b));
  const fillAny = bases.filter((b) => M[b].some((d) => /(^|\.)fill(\.|$)/.test(d))).length, fillB = bt('FILL');
  out(`${nf(fillAny)} (${pc1(fillAny / n)}) have some derivative with a fill token; ${n - fillAny} have none (a fill token anywhere in the derivative's name; ${nf(fillB.size)} counting <base>.<suffix> suffixes only)`);
  out(`${nf(rows.length)} of ${nf(ders.length)} derivatives (${pc1(rows.length / ders.length)}) are named <base>.<suffix>; ${ders.length - rows.length} are not`);
  const circ = new Set(rows.filter((x) => x.r.some(([r, t]) => r === 'ENCL' && t === 'circle')).map((x) => x.b));
  const e = bt('ENCL'), bd = bt('BADGE'), sl = bt('SLASH');
  out(`${nf(e.size)} of ${nf(n)} bases (${pc1(e.size / n)}) take any container, ${nf(circ.size)} (${pc1(circ.size / n)}) take circle, ${bd.size} (${pc1(bd.size / n)}) a badge, ${sl.size} (${pc1(sl.size / n)}) a slash`);
  void der2base;
}

function secS22(D) {
  head('§2.2 What the 58 tokens do');
  const { rows } = grammar(D.map());
  const tok = new Map();
  for (const x of rows) for (const [role, t] of x.r) { if (!tok.has(role)) tok.set(role, new Map()); tok.get(role).set(t, (tok.get(role).get(t) || 0) + 1); }
  const sum = (m) => [...m.values()].reduce((a, b) => a + b, 0);
  const list = (m, k = 40) => mostCommon(m).slice(0, k).map(([t, n]) => `${t} ${nf(n)}`).join(' · ');
  out(`${nf(rows.length)} base-prefixed derivatives`);
  const label = { FILL: 'style — fill', ENCL: 'enclosure shape', QUAL: 'enclosure qualifier', BADGE: 'badge', GLYPH: 'badge glyph', SLASH: 'negation — slash', ROT: 'rotation compound', STYLE: 'style words (rare)', OTHER: 'other' };
  out('| Role | Tokens | Uses |');
  let distinct = 0;
  for (const role of ['FILL', 'ENCL', 'QUAL', 'BADGE', 'GLYPH', 'SLASH', 'ROT', 'STYLE', 'OTHER']) {
    const m = tok.get(role) || new Map(); distinct += m.size;
    const extra = role === 'ROT' ? ` uses in ${rows.filter((x) => x.r.some(([r]) => r === 'ROT')).length} names` : '';
    out(`| ${label[role]} | ${m.size}: ${list(m)} | ${nf(sum(m))}${extra} |`);
  }
  const twoRoles = [...new Set([...tok.values()].flatMap((m) => [...m.keys()]))].filter((t) => [...tok.values()].filter((m) => m.has(t)).length > 1);
  out(`total distinct tokens ${distinct} (a token in two roles: ${twoRoles.join(', ')}); distinct token strings ${distinct - twoRoles.length}`);
  const dirInGlyph = [...(tok.get('GLYPH') || new Map())].filter(([t]) => ['up', 'down', 'forward'].includes(t)).reduce((s, [, n]) => s + n, 0);
  out(`direction words inside badge glyphs (up, down, forward): ${dirInGlyph} uses`);
}

function secS23(D) {
  head('§2.3 The grammar — coverage and stacking');
  const { rows } = grammar(D.map());
  const sigs = counter(rows.map((x) => signature(x.r)));
  out(`Role patterns in the ${nf(rows.length)} names: ${sigs.size}`);
  const lab = (s) => ({ ROT: 'rotation compound', OTHER: 'other' }[s.split('.')[0]] ? (s.startsWith('ROT') ? `rotation compound (${s.split('.').length} words)` : s === 'OTHER' ? 'other (`ring`)' : s.toLowerCase()) : s.toLowerCase().replace('encl', 'enclosure'));
  const top = mostCommon(sigs);
  out('| Pattern | Names |');
  for (const [s, n] of top.slice(0, 10)) out(`| ${lab(s)} | ${nf(n)} |`);
  const cov = (k) => top.slice(0, k).reduce((a, [, n]) => a + n, 0);
  out(`Five patterns cover ${nf(cov(5))} of ${nf(rows.length)} (${pc1(cov(5) / rows.length)}); ten cover ${nf(cov(10))} (${pc1(cov(10) / rows.length)})`);
  const kinds = counter(rows.map((x) => new Set(x.r.filter(([r]) => ['ENCL', 'BADGE', 'SLASH', 'ROT'].includes(r)).map(([r]) => r)).size));
  out(`Operator kinds per name: none ${nf(kinds.get(0) || 0)} (${pc1((kinds.get(0) || 0) / rows.length)}), one ${nf(kinds.get(1) || 0)} (${pc1((kinds.get(1) || 0) / rows.length)}), two ${kinds.get(2) || 0} (${pc1((kinds.get(2) || 0) / rows.length)}), three ${kinds.get(3) || 0}`);
  const tl = counter(rows.map((x) => Math.min(x.suf.split('.').length, 7)));
  const g = (k) => tl.get(k) || 0, four = [4, 5, 6, 7].reduce((s, k) => s + g(k), 0);
  out(`Tokens per suffix: 1 in ${nf(g(1))} (${pc1(g(1) / rows.length)}), 2 in ${nf(g(2))} (${pc1(g(2) / rows.length)}), 3 in ${g(3)} (${pc1(g(3) / rows.length)}), 4–6 in ${four}`);
  out(`One operator and a style: ${pc1(1 - (kinds.get(2) || 0) / rows.length - (kinds.get(3) || 0) / rows.length)} of the vocabulary`);
}

/** §3.1's "layout width unchanged": the two advances within 1 unit (sf_reg_an.same_adv). */
export const sameAdvance = (a, b) => Math.abs(b - a) <= 1;
/** A share at 1 dp, written "100%" when it is all of them (as the document writes the full share). */
export const pcDoc = (x) => (x === 1 ? '100%' : `${fx(100 * x, 1)}%`);
/** §3.2: per container token, how many uses sit on that token's commonest outer box → {tot, onTop, rows}. */
export function onTopTally(byToken) {
  let tot = 0, onTop = 0; const rows = [];
  for (const [tok, L] of byToken) {
    const c = mostCommon(counter(L.map((x) => `${nf(x.w)} × ${nf(x.h)}`)));
    tot += L.length; onTop += c[0][1];
    rows.push({ tok, n: L.length, distinct: c.length, box: c[0][0], share: c[0][1] / L.length });
  }
  return { tot, onTop, rows };
}
/** §3.1's "ink box grows": the derivative's box (w, h, 1 dp) wider or taller than the base's by more than 2 units (sf_reg_an.bigger_box). */
export function boxGrows(B, Dd) { return Dd[0] > B[0] + 2 || Dd[1] > B[1] + 2; }

/** §2.4: how often role A's first occurrence precedes role B's, per name (sf_grammar.py `prec`). */
export function precedence(rows) {
  const prec = new Map();
  for (const x of rows) {
    const seq = [];
    for (const [role] of x.r) { if (role === 'GLYPH') continue; if (!seq.includes(role)) seq.push(role); }
    for (let i = 0; i < seq.length; i++) for (let j = i + 1; j < seq.length; j++) { const k = `${seq[i]}<${seq[j]}`; prec.set(k, (prec.get(k) || 0) + 1); }
  }
  return (a, b) => prec.get(`${a}<${b}`) || 0;
}
function secS24(D) {
  head('§2.4 Is the suffix order fixed?');
  const { rows } = grammar(D.map()), p = precedence(rows);
  out('| Pair | A before B | B before A |');
  for (const [lab, a, b] of [['enclosure → fill', 'ENCL', 'FILL'], ['slash → fill', 'SLASH', 'FILL'], ['slash → enclosure', 'SLASH', 'ENCL'], ['enclosure → qualifier', 'ENCL', 'QUAL'], ['badge → fill', 'BADGE', 'FILL'], ['enclosure vs badge', 'ENCL', 'BADGE']]) out(`| ${lab} | ${nf(p(a, b))} | ${nf(p(b, a))} |`);
  const legacy = D.legacy();
  out(`${Object.values(legacy).filter((v) => /\.fill\.badge\./.test(v)).length} of Apple's ${Object.keys(legacy).length} legacy renames moved fill in front of the badge`);
}

function secS25(D) {
  head('§2.5 Closed grammar, growing lexicon');
  const M = D.map(), { rows, der2base, bases } = grammar(M), av = D.avail();
  const yr = (n) => (av[n] == null ? null : Number(av[n]));
  const first = new Map();
  for (const x of rows) { const y = yr(x.d); if (y == null) continue; for (const [, t] of x.r) if (!first.has(t) || y < first.get(t).y) first.set(t, { y, d: x.d }); }
  const years = YEARS;
  const tf = counter([...first.values()].map((v) => releaseYear(v.y)));
  const bf = counter([...bases].filter((b) => yr(b) != null).map((b) => releaseYear(yr(b))));
  out(`| Release | ${years.join(' | ')} |`);
  out(`| tokens first seen | ${years.map((y) => tf.get(y) || 0).join(' | ')} |`);
  out(`| bases first shipped | ${years.map((y) => bf.get(y) || 0).join(' | ')} |`);
  const roleOf = (t, d) => roles(d.slice(der2base.get(d).length + 1)).find(([, tt]) => tt === t)?.[0];
  const byRole = new Map();
  for (const [t, { y, d }] of first) { const r = roleOf(t, d); if (!byRole.has(r)) byRole.set(r, []); byRole.get(r).push([releaseYear(y), t]); }
  const fmtRole = (r) => (byRole.get(r) || []).sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1)).map(([y, t]) => `${t} ${y}`).join(', ');
  out(`${FIRST_YEAR} enclosure shapes: ${(byRole.get('ENCL') || []).filter(([y]) => y === FIRST_YEAR).length} of ${(byRole.get('ENCL') || []).length}; later: ${(byRole.get('ENCL') || []).filter(([y]) => y > FIRST_YEAR).map(([y, t]) => `${t} ${y}`).join(', ')}`);
  out(`badge: ${fmtRole('BADGE')}; slash: ${fmtRole('SLASH')}; fill: ${fmtRole('FILL')}`);
  const gl = counter((byRole.get('GLYPH') || []).map(([y]) => y));
  out(`badge glyph words first seen: ${years.filter((y) => gl.get(y)).map((y) => `${y} ${gl.get(y)}`).join(' · ')}`);
  out(`minor words: ${[...(byRole.get('QUAL') || []).filter(([y]) => y > FIRST_YEAR), ...(byRole.get('STYLE') || []).filter(([y]) => y > FIRST_YEAR), ...(byRole.get('OTHER') || [])].map(([y, t]) => `${t} ${y}`).join(', ')}; rotation compound: ${fmtRole('ROT')}`);
  let later = 0, both = 0, laterY = 0;
  for (const [d, b] of der2base) { const a = yr(d), c = yr(b); if (a == null || c == null) continue; both++; if (a > c) later++; if (releaseYear(a) > releaseYear(c)) laterY++; }
  out(`${nf(later)} of ${nf(both)} derivatives (${pc0(later / both)}) arrived in a later release than their base (${nf(laterY)} by whole year)`);
}

async function secS31(D, opt) {
  head('§3.1 The population answer: is the base kept, scaled, or redrawn?');
  const names = D.names(), P = pairsResolved(D);
  out(`${nf(P.prefixed.length)} base→derivative pairs (of ${nf(P.res.length)} with both names resolved), regular weight, medium scale`);
  if (!opt.font) { out('(--no-font: the box and layout columns need the outlines)'); }
  const g = opt.font ? await outlines(opt, names, P.prefixed.flat()) : null;
  const cls = new Map();
  for (const [b, d] of P.prefixed) {
    const c = modifierClass(signature(roles(d.slice(b.length + 1))));
    if (!cls.has(c)) cls.set(c, []);
    cls.get(c).push([b, d]);
  }
  const box = (n) => { const bb = cbox(g(n).ops); return [pyRound(bb[2] - bb[0], 1), pyRound(bb[3] - bb[1], 1)]; };
  const rows = [['badge', 'badge'], ['badge + fill', 'badge+fill'], ['slash', 'slash'], ['slash + fill', 'slash+fill'], ['fill', 'fill'], ['enclosure', 'enclosure'], ['enclosure + fill', 'enclosure+fill'], ['rotation compound', 'rotate-arrow'], ['fill + badge', 'fill+badge']];
  out('| Modifier | n | Base in place | Scaled copy | Redrawn | Ink box grows | Layout width unchanged |');
  let named = 0;
  for (const [lab, k] of rows) {
    const L = cls.get(k) || []; named += L.length;
    let grow = '—', same = '—';
    if (g) {
      const gr = L.filter(([b, d]) => boxGrows(box(b), box(d))).length;
      const sa = L.filter(([b, d]) => sameAdvance(g(b).advance, g(d).advance)).length;
      grow = pcDoc(gr / L.length); same = pcDoc(sa / L.length);
    }
    out(`| ${lab} | ${nf(L.length)} | (r3.1) | (r3.1) | (r3.1) | ${grow} | ${same} |`);
  }
  out(`| other combinations | ${P.prefixed.length - named} | — | — | — | — | — |`);
  NR('base in place / scaled copy / redrawn (boundary correlation, ≥80% of ink within 8 units; scaled at ≥75% boundary match)');
}

async function secS32(D, opt) {
  head('§3.2 The container is one drawing');
  if (!opt.font) { out('(--no-font: needs the outlines)'); return; }
  const names = D.names(), M = D.map(), { rows } = grammar(M);
  const pure = rows.filter((x) => ['ENCL', 'ENCL.FILL'].includes(signature(x.r)) && resolved(names, x.d)).map((x) => ({ d: x.d, tok: x.r.find(([r]) => r === 'ENCL')[1] }));
  const g = await outlines(opt, names, pure.map((x) => x.d));
  const by = new Map();
  for (const x of pure) { const o = g(x.d); if (!o) continue; const b = outerBox(o.ops, 6); if (!by.has(x.tok)) by.set(x.tok, []); by.get(x.tok).push({ ...x, w: rint(b[2] - b[0]), h: rint(b[3] - b[1]), adv: o.advance, ops: o.ops }); }
  out('| Container | Uses | Distinct outer boxes | Commonest box | Share on it |');
  const order = [...by].sort((a, b) => b[1].length - a[1].length);
  const { tot, onTop, rows: T } = onTopTally(order);
  for (const r of T) out(`| ${r.tok} | ${nf(r.n)} | ${r.distinct} | ${r.box} | ${pc0(r.share)} |`);
  out(`${nf(onTop)} of ${nf(tot)} container derivatives (${pc1(onTop / tot)}) sit on their token's commonest outer box`);
  // nine cells, circle and square (contours in 4 pieces)
  const cs = pure.filter((x) => x.tok === 'circle' || x.tok === 'square');
  const SF = opt.api;
  const cps = [...new Set(cs.map((x) => names[x.d].cp))];
  const res = SF.glyphs(cps, [1, 400, 1000].map((w) => ({ name: `w${w}`, wght: w })), ['small', 'medium', 'large']);
  const usesOfCp = new Map();                       // a code point can carry several names (tied drawings): count every name
  for (const x of cs) { const cp = names[x.d].cp; if (!usesOfCp.has(cp)) usesOfCp.set(cp, []); usesOfCp.get(cp).push(x.tok); }
  const cell = new Map();
  for (const r of res) {
    if (r.missing) continue;
    const k = `${r.scale} ${r.wght}`, b = outerBox(r.ops, 4), box = `${rint(b[2] - b[0])}×${rint(b[3] - b[1])}`;
    if (!cell.has(k)) cell.set(k, { circle: [], square: [] });
    for (const t of usesOfCp.get(r.cp)) cell.get(k)[t].push(box);
  }
  out('Nine cells (three weight masters × three scale glyphs), distinct outer boxes of the circle (and the square):');
  for (const [k, v] of [...cell].sort()) { const c = counter(v.circle), q = counter(v.square); out(`  ${k}: circle ${v.circle.length} uses, ${c.size} box${c.size > 1 ? 'es' : ''} (${[...c].map(([b, n]) => `${b} ${n}`).join(', ')}); square ${q.size} (${[...q].map(([b, n]) => `${b} ${n}`).join(', ')})`); }
  // exact bounds (BoundsPen), left edges, advances
  const circles = by.get('circle') || [], squares = by.get('square') || [];
  const exact = (L) => counter(L.map((x) => { const b = exactBounds(x.ops); return `${fx(b[2] - b[0], 0)} × ${fx(b[3] - b[1], 0)}`; }));
  out(`Exact bounds: circles ${[...exact(circles)].map(([k, n]) => `${k} in ${nf(n)}`).join(', ')}; squares ${[...exact(squares)].map(([k, n]) => `${k} in ${nf(n)}`).join(', ')}`);
  const left = mostCommon(counter(circles.map((x) => rint(exactBounds(x.ops)[0])))), adv = mostCommon(counter(circles.map((x) => x.adv)));
  out(`Circle left edge x: ${left.map(([k, n]) => `${k} in ${nf(n)}`).join(', ')} (offsets from the common edge: ${left.slice(1).map(([k]) => `+${k - left[0][0]}`).join(', ')}); layout width: ${adv.map(([k, n]) => `${k} in ${nf(n)}`).join(', ')}`);
  out(`Layout width per container (distinct values): ${order.map(([tok, L]) => `${tok} ${mostCommon(counter(L.map((x) => x.adv))).map(([a, n]) => `${a}×${n}`).join('/')}`).join('; ')}`);
  out('Our side: cited from findings-primitives.md §2.1 (card 1.1) — 40 outline and 40 filled concepts, one ring per master.');
}

async function secS33(D, opt) {
  head('§3.3 – 3.6, 3.8, 3.9 — the counts that are data; the rest needs the raster');
  const names = D.names(), M = D.map(), { rows } = grammar(M);
  const res = rows.filter((x) => resolved(names, x.b) && resolved(names, x.d));
  const circlePairs = [];
  for (const [b, ds] of Object.entries(M)) for (const d of ds) if (d === `${b}.circle` && ds.includes(`${b}.circle.fill`) && resolved(names, d) && resolved(names, `${d}.fill`)) circlePairs.push(d);
  NR('§3.3 the six enclosure pairs (container wall, mark long side and thickness against the standalone mark and the ring wall, air to the wall), the scaled-copy count among the enclosures, the solid-content count among the X.circle pairs');
  const pin24 = path.join(opt.pin, 'src/icons/24');
  const markW = (f, pick) => { const t = fs.readFileSync(path.join(pin24, `${f}.svg`), 'utf8'); const ps = [...t.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]); const d = pick(ps); const b = bboxOf(normalisePath(d)); const w = Number(/stroke-width="([\d.]+)"/.exec(t)?.[1] ?? 1.5); return b.x1 - b.x0 + w; };
  if (fs.existsSync(path.join(pin24, 'check-circle.svg'))) out(`§3.3 our side: check-circle's check is ${fx(markW('check-circle', (ps) => ps[ps.length - 1]), 2)} wide against the free check's ${fx(markW('check', (ps) => ps[0]), 2)} (ink box of the mark path at 24, stroke included)`);
  const fillJobs = Object.entries(D.n2f()).filter(([x, xf]) => resolved(names, x) && resolved(names, xf));
  const enc = fillJobs.filter(([x]) => isContainerName(x));
  out(`§3.4: declared pairs with both names resolved ${nf(fillJobs.length)} — container outline → container fill ${nf(enc.length)}, every other pair ${nf(fillJobs.length - enc.length)}; X.circle ↔ X.circle.fill pairs that exist: ${circlePairs.length}`);
  NR('§3.4 silhouette overlap by class, the smaller / larger / same-box shares, the deep-pair overlaps, the line-like mark count and the knockout-to-mark ratio with its percentiles, the three marks\' cut widths');
  const slashJobs = res.filter((x) => x.r.some(([r]) => r === 'SLASH'));
  out(`§3.5: slash derivatives with both names resolved: ${slashJobs.length}`);
  NR('§3.5 slashes found, direction and angle, bar weight and its two values, length, air, base ink removed');
  const badgeJobs = res.filter((x) => x.r.some(([r, t]) => r === 'BADGE' && t === 'badge'));
  out(`§3.6: badge derivatives with both names resolved: ${badgeJobs.length}`);
  NR('§3.6 round badges found and registered, disc sizes, centre and corner shares, distances from the corner, box growth, emptiest-corner rank, air, ink removed, glyph size');
  NR('§3.8 the three-weight table (except the stroke row: see `sample`) and §3.9 the 20 deep pairs at Regular');
}

/** The card's band for "the same clear offset" (sf_templates.py: 5.69 ≤ median ≤ 5.72 per 100 em) — a parameter it chose. */
export const HALO_BAND = [5.69, 5.72];
/** A template's median clear offset inside the card's band, both ends included. */
export const inHaloBand = (m) => m >= HALO_BAND[0] && m <= HALO_BAND[1];
function secS37(D) {
  head('§3.7 The cut is a layer — the 26 templates');
  const dir = D.paths.app, tpl = fs.readdirSync(dir).filter((f) => /^badge.*\.svg$/.test(f)).sort().concat(fs.readdirSync(dir).filter((f) => /^trianglebadge.*\.svg$/.test(f)).sort());
  const rowsT = [];
  for (const f of tpl) {
    const L = templateLayers(fs.readFileSync(path.join(dir, f), 'utf8'), 'Regular-S');
    const halo = L.filter(([c]) => c.includes('monochrome-0')), badge = L.filter(([c]) => c.includes('monochrome-1'));
    if (!halo.length || !badge.length) { rowsT.push({ f, n: L.length, missing: true }); continue; }
    rowsT.push({ f, n: L.length, ...haloOffset(halo[0][1], badge[0][1]) });
  }
  const same = rowsT.filter((r) => !r.missing && inHaloBand(r.median));
  out(`${rowsT.length} templates at Regular-S; ${same.length} with the same clear offset, median ${fx(Math.min(...same.map((r) => r.median)), 2)} – ${fx(Math.max(...same.map((r) => r.median)), 2)} per 100 em`);
  for (const r of rowsT.filter((x) => !same.includes(x))) out(`  differs: ${r.f.replace('.svg', '')} ${r.missing ? '(no monochrome-0 / -1 pair)' : `median ${fx(r.median, 2)}, ${fx(r.min, 1)} – ${fx(r.max, 1)}`}`);
  const nl = counter(rowsT.map((r) => r.n));
  out(`layers: ${[...nl].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} have ${k}`).join(', ')}`);
}

function secS42(D, opt) {
  head('§4.2 What our names already say');
  const names = fs.readdirSync(path.join(opt.pin, 'src/icons/24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.slice(0, -4)).sort();
  const { kinds, amb } = ourParents(names);
  const c = counter([...kinds.values()]);
  out('| | Concepts |');
  out(`| numbered shape variants (-2 …) | ${c.get('number') || 0} |`);
  out(`| sized variants (-small, -large), with and without a number | ${(c.get('size') || 0) + (c.get('size+number') || 0)} (${c.get('size') || 0} + ${c.get('size+number') || 0}) |`);
  out(`| roots (no shorter concept is a prefix) | ${c.get('root') || 0} |`);
  out(`| modifier-style names (a shorter concept is a prefix) | **${c.get('modifier') || 0}** |`);
  const mod = names.filter((n) => kinds.get(n) === 'modifier');
  out(`the ${mod.length}: ${mod.join(', ')}`);
  out(`names with two candidate prefixes: ${amb.length} (${amb.map(([n]) => n).join(', ')})`);
  const cert = (c.get('number') || 0) + (c.get('size') || 0) + (c.get('size+number') || 0);
  out(`parent certain from the name: ${cert} of ${names.length} (${pc0(cert / names.length)}); a note in each file: ${mod.length} × 6 = ${mod.length * 6} (three masters × two styles)`);
}

function secS5(D) {
  head('§5 Findings — K5, the pair count');
  const n2f = D.n2f(), loc = LOCALE_SUFFIXES;
  const n = Object.keys(n2f).length, v = Object.keys(n2f).filter(isLocaleVariant).length;
  const named = ['ar', 'hi', 'rtl'];
  out(`nofill_to_fill.strings (SF Symbols ${D.namesMeta().appVersion ?? '?'}) declares ${nf(n)} pairs, or ${nf(n - v)} once the ${v} locale and direction variants (${named.map((x) => `.${x}`).join(', ')} and ${loc.size - named.length} more suffixes) are set aside`);
  out('(K1 – K4 and K6 rest on §3\'s raster figures: [not reprintable] there.)');
}

function secS8(D, opt) {
  head('§8 Seen and not carried');
  const M = D.map(), all = new Set([...Object.keys(M), ...Object.values(M).flat()]), n2f = D.n2f();
  const fills = new Set(Object.values(n2f)), nofill = new Set(Object.keys(n2f)), hasFill = (n) => /(^|\.)fill(\.|$)/.test(n);
  const nonfill = [...all].filter((n) => !fills.has(n) && !hasFill(n)), twin = nonfill.filter((n) => nofill.has(n)).length;
  out(`of the ${nf(nonfill.length)} names in the base map that carry no fill token, ${pc1(twin / nonfill.length)} (${nf(twin)}) have a declared fill twin and ${nf(nonfill.length - twin)} do not`);
  const names = Object.keys(D.names());
  const num = names.filter((n) => n.split('.').some((t) => /^\d+$/.test(t)));
  out(`numbered names (a pure-digit token): ${nf(num.length)} (the 40 commonest contexts were read by eye — a judgement)`);
  const loc = Object.keys(D.aliases()).filter((k) => ALIAS_LOCALE.test(k)).length;
  out(`${loc} of the ${nf(Object.keys(D.aliases()).length)} aliases carry a locale or direction suffix; in the base map: ${Object.keys(D.aliases()).filter((k) => ALIAS_LOCALE.test(k) && all.has(k)).length}`);
  if (opt.wall) out(`the plain circle's wall: ${opt.wall.map((w) => fx(w.wall, 1)).join(' · ')} units at ${WALL_SCALES.join(' · ')} (Regular), ${opt.wall.map((w) => fx((100 * w.wall) / w.outer, 1)).join(' · ')}% of its own width of ${opt.wall.map((w) => nf(rint(w.outer))).join(' · ')}`);
}

/** The plain circle's ring at Regular, one reading per scale glyph in WALL_SCALES order. */
export function circleWalls(D, api) {
  const cp = D.names().circle.cp;
  return WALL_SCALES.map((sc) => ringWall(api.glyphs([cp], [{ name: 'regular', wght: 400 }], [sc])[0].ops));
}

async function secS9(D, opt) {
  head('§9 Take / refuse — the figures it repeats');
  const M = D.map(), { rows } = grammar(M), ders = Object.values(M).flat();
  const pinNames = fs.readdirSync(path.join(opt.pin, 'src/icons/24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.slice(0, -4));
  const { kinds } = ourParents(pinNames), c = counter([...kinds.values()]);
  const cert = (c.get('number') || 0) + (c.get('size') || 0) + (c.get('size+number') || 0);
  out(`T2: Apple ${pc1(rows.length / ders.length)} by name; ours ${pc0(cert / pinNames.length)} by C9 and C8, ${c.get('modifier') || 0} judgments for the rest`);
  const p = precedence(rows);
  out(`R6: X.fill.badge.G vs X.badge.G.fill ${p('FILL', 'BADGE')} : ${p('BADGE', 'FILL')}; ${rows.filter((x) => new Set(x.r.filter(([r]) => ['ENCL', 'BADGE', 'SLASH', 'ROT'].includes(r)).map(([r]) => r)).size === 2).length} names stack two operators`);
  const all = new Set([...Object.keys(M), ...ders]), n2f = D.n2f(), fills = new Set(Object.values(n2f)), nofill = new Set(Object.keys(n2f));
  const nonfill = [...all].filter((n) => !fills.has(n) && !/(^|\.)fill(\.|$)/.test(n)), no = nonfill.filter((n) => !nofill.has(n)).length;
  out(`R7: ${pc1(no / nonfill.length)} of the base map's non-fill names (${no} of ${nf(nonfill.length)}) have no declared fill twin`);
  out(`R8: ${nf(Object.keys(D.aliases()).length)} aliases`);
  out('(T3, T4, R4 repeat §3.2, §3.7 and §8; T5 – T7, R1 – R3, R5 repeat raster figures.)');
}

async function secShort(D, opt) {
  head('The short answer — the figures that reprint');
  const M = D.map(), bases = Object.keys(M), ders = bases.flatMap((b) => M[b]), { rows } = grammar(M);
  out(`1. ${nf(bases.length)} bases → ${nf(ders.length)} derivatives; ${nf(Object.keys(D.n2f()).length)} outline → filled pairs; ${nf(Object.keys(D.aliases()).length)} aliases`);
  const single = bases.filter((b) => M[b].length === 1 && M[b][0] === `${b}.fill`).length;
  out(`2. ${ders.length - new Set(ders).size} of ${nf(ders.length)} under two parents; ${pc1(rows.length / ders.length)} spelled <base>.<suffix>; ${pc0(single / bases.length)} of the bases (${nf(single)} of ${nf(bases.length)}) have exactly one derivative, their .fill`);
  const sigs = mostCommon(counter(rows.map((x) => signature(x.r)))), cov = (k) => sigs.slice(0, k).reduce((a, [, n]) => a + n, 0);
  out(`3. ${sigs.length} role patterns in ${nf(rows.length)} names; five cover ${pc1(cov(5) / rows.length)}, ten ${pc1(cov(10) / rows.length)}`);
  const av = D.avail(), first = new Map();
  for (const x of rows) { const y = av[x.d] == null ? null : Number(av[x.d]); if (y == null) continue; for (const [, t] of x.r) if (!first.has(t) || y < first.get(t)) first.set(t, y); }
  const bf = bases.filter((b) => av[b] != null);
  out(`4. ${[...first.values()].filter((y) => releaseYear(y) === FIRST_YEAR).length} of the ${first.size} tokens already in ${FIRST_YEAR}; bases ${nf(bf.filter((b) => releaseYear(Number(av[b])) === FIRST_YEAR).length)} (${FIRST_YEAR}) → ${nf(bases.length)}`);
  const p = precedence(rows);
  out(`7. order: enclosure→fill ${p('ENCL', 'FILL')}:${p('FILL', 'ENCL')}, slash→fill ${p('SLASH', 'FILL')}:${p('FILL', 'SLASH')}, slash→enclosure ${p('SLASH', 'ENCL')}:${p('ENCL', 'SLASH')}, fill vs badge ${p('BADGE', 'FILL')}:${p('FILL', 'BADGE')}, enclosure vs badge ${p('ENCL', 'BADGE')}:${p('BADGE', 'ENCL')}; ${Object.values(D.legacy()).filter((v) => /\.fill\.badge\./.test(v)).length} of ${Object.keys(D.legacy()).length} legacy renames moved fill`);
  out('5 – 6. the container boxes reprint in s3.2; the halo in s3.7; the badge, slash and base-kept figures are raster: [not reprintable]');
  const pinNames = fs.readdirSync(path.join(opt.pin, 'src/icons/24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.slice(0, -4));
  const c = counter([...ourParents(pinNames).kinds.values()]);
  out(`8. of our ${pinNames.length} concepts, ${(c.get('number') || 0) + (c.get('size') || 0) + (c.get('size+number') || 0)} have a parent the filename states (${c.get('number') || 0} numbered, ${(c.get('size') || 0) + (c.get('size+number') || 0)} sized), ${c.get('root') || 0} are roots, ${c.get('modifier') || 0} are modifier-style names; ${(c.get('modifier') || 0) * 6} notes`);
}

// ═══════════════════════════════════════════════════════════════════════════
// §3 from the card's raster records — the arithmetic reprinted, the raster itself NOT re-run.
// The card saved one JSON record per pair under research/references/sfsymbols/card-2.2/ (sf2/regcensus.jsonl,
// badge.jsonl, slash.jsonl, fill.jsonl, cut.jsonl, corner.json; sf/deep.json); these sections apply the card's own
// aggregation (sf_reg_an.py, sf_cens2_an.py, sf_final_tables.py, the inline cut read) to them.
// ═══════════════════════════════════════════════════════════════════════════

/** The stroke at Regular, medium — the circle glyph's ring, 170 units (sf_cut.py / sf_cens2_an.py STROKE; `sample` prints it from the font). */
export const REGULAR_STROKE = 170;
const REC_NOTE = 'from the card\'s raster records (research/references/sfsymbols/card-2.2); the raster itself not re-run';
const jsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
export function loadRecords(refs) {
  const dir = path.join(refs, 'sfsymbols', 'card-2.2');
  const r = (f) => (fs.existsSync(path.join(dir, f)) ? f.endsWith('.jsonl') ? jsonl(path.join(dir, f)) : JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) : null);
  return { reg: r('sf2/regcensus.jsonl'), badge: r('sf2/badge.jsonl'), slash: r('sf2/slash.jsonl'), fill: r('sf2/fill.jsonl'), cut: r('sf2/cut.jsonl'), corner: r('sf2/corner.json'), deep: r('sf/deep.json') };
}
/** sf_reg_an.py: in place = ≥80% of the base kept within 8 units; scaled = a scale fit ≥0.75 that is not 1 (±0.04), and not in place. */
export const inPlace = (r) => r.kept >= 0.80 && Math.abs(r.dx) <= 8 && Math.abs(r.dy) <= 8;
export const scaledCopy = (r) => !!r.scaled_best && r.scaled_best.f >= 0.75 && Math.abs(r.scaled_best.s - 1) > 0.04;
export function placeShares(L) {
  const ip = L.filter(inPlace).length / L.length, sc = L.filter((r) => scaledCopy(r) && !inPlace(r)).length / L.length;
  return { n: L.length, inPlace: ip, scaled: sc, redrawn: 1 - ip - sc, scaledN: L.filter((r) => scaledCopy(r) && !inPlace(r)).length };
}
const q3 = (a, p) => pyRound(percentile(a, p), 3);

function needRecords(R, keys) { const miss = keys.filter((k) => !R[k]); if (miss.length) { out(`[records missing under --refs: ${miss.join(', ')}]`); return false; } return true; }

async function recS31(D) {
  head(`§3.1 base in place / scaled / redrawn — ${REC_NOTE}`);
  const R = D.records(); if (!needRecords(R, ['reg'])) return;
  const reg = R.reg.filter((r) => !r.error && r.der.startsWith(`${r.base}.`));
  const cls = new Map();
  for (const r of reg) { const c = modifierClass(signature(roles(r.der.slice(r.base.length + 1)))); if (!cls.has(c)) cls.set(c, []); cls.get(c).push(r); }
  out(`${nf(R.reg.length)} registration records, ${R.reg.filter((r) => r.error).length} errors; ${nf(reg.length)} spelled <base>.<suffix>`);
  out('| Modifier | n | Base in place | Scaled copy | Redrawn |');
  for (const [lab, k] of [['badge', 'badge'], ['badge + fill', 'badge+fill'], ['slash', 'slash'], ['slash + fill', 'slash+fill'], ['fill', 'fill'], ['enclosure', 'enclosure'], ['enclosure + fill', 'enclosure+fill'], ['rotation compound', 'rotate-arrow'], ['fill + badge', 'fill+badge']]) {
    const s = placeShares(cls.get(k) || []);
    out(`| ${lab} | ${nf(s.n)} | ${pc1(s.inPlace)} | ${s.scaled ? pc1(s.scaled) : '0'} | ${pc1(s.redrawn)} |`);
  }
  const e = placeShares(cls.get('enclosure'));
  out(`scaled copies among the enclosures: ${e.scaledN} of ${e.n} (${pc1(e.scaled)})`);
}

async function recS34(D) {
  head(`§3.4 fill: the outer edge and the cut — ${REC_NOTE}`);
  const R = D.records(); if (!needRecords(R, ['fill', 'cut'])) return;
  const F = R.fill.filter((x) => !x.error), enc = F.filter((x) => isContainerName(x.x)), oth = F.filter((x) => !isContainerName(x.x));
  const sh = (L, f) => L.filter(f).length / L.length;
  out('| Pairs | n | Overlap ≥ 0.99 | Overlap ≥ 0.95 |');
  out(`| container outline → container fill | ${nf(enc.length)} | ${pc1(sh(enc, (x) => x.iou >= 0.99))} | ${pc1(sh(enc, (x) => x.iou >= 0.95))} |`);
  out(`| every other pair | ${nf(oth.length)} | ${pc1(sh(oth, (x) => x.iou >= 0.99))} | ${pc1(sh(oth, (x) => x.iou >= 0.95))} |`);
  out(`| all | ${nf(F.length)} | ${pc1(sh(F, (x) => x.iou >= 0.99))} | ${pc1(sh(F, (x) => x.iou >= 0.95))} |`);
  const bx = F.filter((x) => x.same_box);
  out(`filled twin smaller than the outline's silhouette by more than 3% in ${pc1(sh(F, (x) => x.area_ratio < 0.97))}, larger in ${pc1(sh(F, (x) => x.area_ratio > 1.03))}; ink box identical to within 2 units in ${pc0(sh(bx, (x) => Math.abs(x.same_box[0]) <= 2 && Math.abs(x.same_box[1]) <= 2))}`);
  const C = R.cut.filter((x) => x.ratio != null), line = C.filter((x) => x.in_strokes <= 1.3), rat = line.map((x) => x.ratio);
  out(`the cut: ${R.cut.length} X.circle ↔ X.circle.fill pairs; ${C.length} measurable; ${line.length} line-like (thickness ≤ 1.3 ring walls), ${C.length - line.length} solid`);
  out(`| knockout ÷ the mark's outline width | ${[5, 25, 50, 75, 95].map((p) => `p${p} ${fx(q3(rat, p), 3)}`).join(' | ')} |`);
  const groups = new Map(); for (const x of line) { const k = x.x.split('.')[0]; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(x.ratio); }
  const big = [...groups].filter(([, v]) => v.length >= 5).sort((a, b) => b[1].length - a[1].length);
  out(`by the first word of the name (groups of 5 or more; a reading of "figure, arrow, chevron …"): ${big.map(([k, v]) => `${k} ${v.length} (median ${fx(percentile(v, 50), 2)})`).join(', ')}`);
  const mk = (n) => C.find((x) => x.x === `${n}.circle`);
  const three = ['checkmark', 'plus', 'xmark'].map(mk).filter(Boolean);
  out(`checkmark, plus, xmark cut at ${three.map((x) => fx(x.t_hole, 1)).join(' · ')} units against outline marks of ${three.map((x) => fx(x.t_in, 1)).join(' · ')} (ratios ${three.map((x) => fx(x.ratio, 2)).join(' · ')})`);
}

async function recS35(D) {
  head(`§3.5 slash — ${REC_NOTE}`);
  const R = D.records(); if (!needRecords(R, ['slash'])) return;
  const S = R.slash.filter((x) => !x.error), sf = S.filter((x) => x.direction);
  const dir = counter(sf.map((x) => x.direction));
  out(`${sf.length} slashes found in the ${S.length} slash derivatives; direction ${[...dir].map(([k, v]) => `${k} in ${v}`).join(', ')}; within 0.5° of 45: ${sf.filter((x) => Math.abs(x.angle_from_horizontal - 45) <= 0.5).length}`);
  const th = sf.map((x) => x.slash_thick), a = sf.filter((x) => x.slash_thick >= 154 && x.slash_thick <= 156), b = sf.filter((x) => x.slash_thick >= 90 && x.slash_thick <= 102);
  out(`weight: 154 – 156 units in ${a.length} of ${sf.length} (${pc0(a.length / sf.length)}), ${fx(percentile(a.map((x) => x.slash_thick_strokes), 50), 2)} stroke; 90 – 102 in ${b.length}, of which inside a container: ${b.filter((x) => (x.sig || '').includes('ENCL')).length}; median ${fx(percentile(th, 50), 1)}`);
  const ln = sf.map((x) => x.slash_len_over_base_diag);
  out(`length ÷ base diagonal: median ${fx(q3(ln, 50), 2)} (p10 – p90 ${fx(q3(ln, 10), 2)} – ${fx(q3(ln, 90), 2)})`);
  const tm = sf.filter((x) => x.trim_min).map((x) => x.trim_min);
  out(`air: median ${fx(q3(tm, 50), 1)} units (p25 – p75 ${fx(q3(tm, 25), 1)} – ${fx(q3(tm, 75), 1)}; ${fx(q3(tm.map((v) => v / REGULAR_STROKE), 50), 2)} stroke; ${fx((100 * percentile(tm, 50)) / 2048, 1)}% em)`);
  const rm = sf.map((x) => x.base_removed);
  out(`base ink removed: ${pc1(q3(rm, 50))} median (p10 – p90 ${pc1(q3(rm, 10))} – ${pc1(q3(rm, 90))})`);
}

/** The badge's centre measured from the nearest side of the base's box, in badge radii (a reading: (1 − u) or u across, (1 − v) or v down). */
export function cornerOffsets(x) {
  const r = x.badge_d / 2, w = x.base_box[0], h = x.base_box[1];
  return { across: (x.centre_u >= 0.5 ? 1 - x.centre_u : x.centre_u) * w / r, down: (x.centre_v >= 0.5 ? 1 - x.centre_v : x.centre_v) * h / r };
}
async function recS36(D) {
  head(`§3.6 badge — ${REC_NOTE}`);
  const R = D.records(); if (!needRecords(R, ['badge', 'corner'])) return;
  const B = R.badge.filter((x) => !x.error), found = B.filter((x) => x.badge_d), ok = found.filter((x) => x.reg_f >= 0.5);
  const withg = ok.filter((x) => x.glyph_box), nog = ok.filter((x) => !x.glyph_box);
  const r10 = (v) => rint(v / 10) * 10;                 // python's round(): half to even, as the card's 10-unit bins
  const top = (L) => mostCommon(counter(L.map((x) => r10(x.badge_d))))[0];
  out(`${B.length} badge derivatives; ${found.length} with a round badge found; ${ok.length} registered against their base`);
  const tg = top(withg), tn = top(nog);
  out(`with a glyph: ${tg[1]} of ${withg.length} at ${tg[0]} (10-unit), median ${fx(percentile(withg.map((x) => x.badge_d), 50), 0)} units = ${fx(percentile(withg.map((x) => x.badge_d_em), 50), 3)} em = ${fx(percentile(withg.map((x) => x.badge_d_strokes), 50), 2)} strokes; plain dot: ${tn[1]} of ${nog.length} at ${tn[0]} (median ${fx(percentile(nog.map((x) => x.badge_d), 50), 0)}, ${fx(percentile(nog.map((x) => x.badge_d_em), 50), 3)} em)`);
  const big = ok.filter((x) => r10(x.badge_d) === tg[0]).length, small = ok.filter((x) => r10(x.badge_d) === 690 || r10(x.badge_d) === 700).length;
  out(`by diameter alone: ${tg[0]} in ${big} of ${ok.length}, 690 – 700 in ${small}; together ${big + small} (${pc1((big + small) / ok.length)})`);
  const dl = ok.map((x) => x.badge_d_over_base_long);
  out(`disc ÷ base long side: p10 – p90 ${fx(q3(dl, 10), 2)} – ${fx(q3(dl, 90), 2)}, median ${fx(q3(dl, 50), 2)}`);
  const quad = counter(ok.map((x) => (x.centre_u >= 0.5 ? 'R' : 'L') + (x.centre_v >= 0.5 ? 'B' : 'T')));
  out(`| Centre of the badge in the base's box | ${['RB', 'LB', 'RT', 'LT'].join(' | ')} |`);
  out(`| share of ${ok.length} | ${['RB', 'LB', 'RT', 'LT'].map((k) => `${pc1((quad.get(k) || 0) / ok.length)} (${quad.get(k) || 0})`).join(' | ')} |`);
  const off = (k) => ok.filter((x) => (x.centre_u >= 0.5 ? 'R' : 'L') + (x.centre_v >= 0.5 ? 'B' : 'T') === k).map(cornerOffsets);
  out(`from the nearest corner, in badge radii (a reading): RB across ${fx(percentile(off('RB').map((o) => o.across), 50), 2)}, down ${fx(percentile(off('RB').map((o) => o.down), 50), 2)}; LB across ${fx(percentile(off('LB').map((o) => o.across), 50), 2)}, down ${fx(percentile(off('LB').map((o) => o.down), 50), 2)}`);
  out(`centre inside the base's box in ${pc1(ok.filter((x) => x.centre_u >= 0 && x.centre_u <= 1 && x.centre_v >= 0 && x.centre_v <= 1).length / ok.length)}`);
  const gx = ok.map((x) => x.union_growth[0]), gy = ok.map((x) => x.union_growth[1]);
  out(`ink box grows in ${pc1(ok.filter((x) => x.union_growth[0] > 0.01 || x.union_growth[1] > 0.01).length / ok.length)} (median +${pc1(q3(gx, 50))} wide, +${pc1(q3(gy, 50))} tall)`);
  const rk = counter(R.corner.map((c) => c.rank));
  out(`the chosen corner ranks (1 = emptiest) ${[1, 2, 3, 4].map((k) => `${k}: ${pc1((rk.get(k) || 0) / R.corner.length)}`).join(', ')} of ${R.corner.length}`);
  const tm = ok.map((x) => x.trim_min), r5 = tm.map((v) => rint(v / 5) * 5);
  out(`air: median ${fx(q3(tm, 50), 1)} units, p5 – p95 ${fx(q3(tm, 5), 1)} – ${fx(q3(tm, 95), 1)} (${fx(q3(ok.map((x) => x.trim_min_strokes), 50), 2)} stroke, ${fx((100 * percentile(tm, 50)) / 2048, 1)}% em); rounded to 5, ${r5.filter((v) => v === 135).length} of ${ok.length} (${pc0(r5.filter((v) => v === 135).length / ok.length)}) are 135 and ${r5.filter((v) => v >= 130 && v <= 140).length} (${pc1(r5.filter((v) => v >= 130 && v <= 140).length / ok.length)}) are 130 – 140`);
  const rm = ok.map((x) => x.base_removed);
  out(`base ink removed: median ${pc1(q3(rm, 50))}, p10 – p90 ${pc1(q3(rm, 10))} – ${pc1(q3(rm, 90))}`);
  const ge = withg.map((x) => x.glyph_ext_over_d), gt = withg.filter((x) => x.glyph_thick_strokes != null).map((x) => x.glyph_thick_strokes);
  out(`glyph: ${fx(q3(ge, 10), 2)} – ${fx(q3(ge, 90), 2)} (median ${fx(q3(ge, 50), 2)}) of the disc, ${fx(q3(gt, 50), 2)} stroke thick at the median`);
}

async function recDeep(D) {
  head(`§3.3, §3.8, §3.9 the 26 deep pairs — ${REC_NOTE}`);
  const R = D.records(); if (!needRecords(R, ['deep'])) return;
  const sel = (k, w) => R.deep.filter((x) => x.kind === k && x.wght === w);
  out('§3.3 enclosures at Regular: | pair | wall | mark long side ÷ standalone | thickness ÷ standalone | ÷ ring wall | air (strokes) |');
  for (const x of sel('enclosure', 400)) {
    const long = x.mark_box && x.base_box ? Math.max(...x.mark_box) / Math.max(...x.base_box) : null;
    const solid = x.mark_thick != null && x.container_wall && x.mark_thick / x.container_wall > 1.3;     // the card's line-like test: ≤ 1.3 ring walls
    out(`| ${x.base} → ${x.der} | ${x.container_wall ?? '—'} = ${x.wall_over_stroke != null ? fx(x.wall_over_stroke, 2) : '—'} stroke | ${long != null ? fx(long, 2) : '—'} | ${solid ? 'solid' : fx(x.thick_ratio, 2)} | ${solid ? 'solid' : fx(x.mark_thick / x.container_wall, 2)} | ${x.air_mark_to_wall_strokes != null ? fx(x.air_mark_to_wall_strokes, 2) : '—'} |`);
  }
  out('§3.8 across the three weights:');
  for (const w of [1, 400, 1000]) {
    const bd = sel('badge', w).filter((x) => x.trim_min), sl = sel('slash', w).filter((x) => x.trim_min), en = sel('enclosure', w);
    const st = (bd[0] || sl[0] || en[0])?.stroke;
    const disc = bd.filter((x) => x.badge_d_em > 0.4);
    const bm = percentile(bd.map((x) => x.trim_min), 50), sm = percentile(sl.map((x) => x.trim_min), 50);       // the table's "air, min" is the median over pairs of each pair's minimum air
    out(`  wght ${w} (stroke ${st}): badge air ${fx(bm, 1)} · ${fx(bm / st, 2)} · ${fx(bm / 2048, 3)} (units · strokes · em); slash air ${fx(sm, 1)} · ${fx(sm / st, 2)}; slash bar ${fx(Math.min(...sel('slash', w).map((x) => x.slash_thick)), 1)} – ${fx(Math.max(...sel('slash', w).map((x) => x.slash_thick)), 1)}; disc ${fx(percentile(disc.map((x) => x.badge_d), 50), 0)} (${fx(percentile(disc.map((x) => x.badge_d_em), 50), 3)} em); mark ÷ ring wall ${['checkmark', 'plus', 'xmark'].map((m) => { const x = en.find((e) => e.der === `${m}.circle`); return x && x.mark_thick ? fx(x.mark_thick / x.container_wall, 2) : '—'; }).join(' · ')}`);
  }
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const per = (w) => { const bd = sel('badge', w).filter((x) => x.trim_min), sb = sel('slash', w).map((x) => x.slash_thick), st = sel('slash', w)[0].stroke;
    return { st, air: percentile(bd.map((x) => x.trim_min), 50), bar: percentile(sb, 50), barMean: avg(sb), barS: [Math.min(...sb) / st, Math.max(...sb) / st], disc: percentile(bd.filter((x) => x.badge_d_em > 0.4).map((x) => x.badge_d), 50) }; };
  const W1 = per(1), W4 = per(400), WB = per(1000);
  out(`  slash bar in strokes: ${[W1, W4, WB].map((v) => `${fx(v.barS[0], 2)} – ${fx(v.barS[1], 2)}`).join(' → ')}`);
  out(`  lightest → heaviest: the stroke ×${fx(WB.st / W1.st, 1)}, the badge air ×${fx(WB.air / W1.air, 1)}, the slash bar ×${fx(WB.bar / W1.bar, 1)} on median bars (×${fx(WB.barMean / W1.barMean, 1)} on mean bars), the badge disc ×${fx(WB.disc / W1.disc, 2)}`);
  out('§3.9 fills at Regular: | pair | overlap | area ratio | edge deviation p95 (strokes) | holes |');
  for (const x of sel('fill', 400)) out(`| ${x.base} → ${x.der} | ${fx(x.sil_iou, 3)} | ${fx(x.sil_area_ratio, 3)} | ${fx(x.sil_edge_dev_p95_strokes, 2)} | ${x.holes} |`);
  out('§3.9 slashes at Regular: | pair | base kept | direction · angle | bar | bar ÷ base diagonal | air | removed |');
  for (const x of sel('slash', 400)) out(`| ${x.base} → ${x.der} | ${fx(x.reg_f, 2)} | ${x.direction} · ${fx(x.angle_from_horizontal, 1)}° | ${fx(x.slash_thick, 0)} = ${fx(x.slash_thick_strokes, 2)} stroke | ${fx(x.slash_len_over_base_diag, 2)} | ${x.trim_min == null ? '—' : `${fx(x.trim_min, 0)} = ${fx(x.trim_min_strokes, 2)} stroke`} | ${fx(100 * x.base_removed, 0)}% |`);
  out('§3.9 badges at Regular: | pair | base kept | disc | centre (across, down) | box grows (wide · tall) | air | removed |');
  for (const x of sel('badge', 400)) out(`| ${x.base} → ${x.der} | ${fx(x.reg_f, 2)} | ${fx(x.badge_d_strokes, 2)} strokes = ${fx(x.badge_d_em, 3)} em | (${fx(x.centre_u, 2)}, ${fx(x.centre_v, 2)}) | +${fx(100 * x.union_growth[0], 0)}% · +${fx(100 * x.union_growth[1], 0)}% | ${x.trim_min == null ? '—' : `${fx(x.trim_min, 0)} = ${fx(x.trim_min_strokes, 2)} stroke`} | ${fx(100 * x.base_removed, 0)}% |`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════

export const SECTIONS = {
  short: secShort, sample: secSample, checks: secChecks, s1: secS1, 's2.1': secS21, 's2.2': secS22, 's2.3': secS23, 's2.4': secS24, 's2.5': secS25,
  's3.1': secS31, 'r3.1': recS31, 's3.2': secS32, 's3.3-6': secS33, 'r3.4': recS34, 'r3.5': recS35, 'r3.6': recS36, 'r3.deep': recDeep,
  's3.7': secS37, 's4.2': secS42, s5: secS5, s8: secS8, s9: secS9,
};
const USAGE = `usage: node tools/audit/sf-probe.mjs <pin-dir> [section …] [--refs <dir>] [--app <dir>] [--coreglyphs <dir>] [--no-font | --font-json <file>]
  sections: ${Object.keys(SECTIONS).join(' ')}`;

export async function main(argv) {
  const valued = new Set(['--refs', '--app', '--coreglyphs', '--font-json']);
  const pos = [], o = {};
  for (let i = 0; i < argv.length; i++) { if (valued.has(argv[i])) o[argv[i].slice(2)] = argv[++i]; else if (argv[i].startsWith('--')) o[argv[i].slice(2)] = true; else pos.push(argv[i]); }
  const pin = pos[0] ? path.resolve(pos[0]) : null;
  if (!pin || !fs.existsSync(path.join(pin, 'src/icons/24'))) { console.error(USAGE); return 2; }
  const wanted = pos.slice(1), bad = wanted.filter((s) => !SECTIONS[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${USAGE}`); return 2; }
  const D = loadData({
    refs: path.resolve(o.refs ?? path.join(REPO, 'research', 'references')),
    app: path.resolve(o.app ?? '/Applications/SF Symbols.app/Contents/Resources'),
    coreglyphs: path.resolve(o.coreglyphs ?? '/System/Library/CoreServices/CoreGlyphs.bundle/Contents/Resources'),
  });
  const opt = { pin, font: !o['no-font'], fontJson: o['font-json'] ? path.resolve(o['font-json']) : null };
  if (opt.font) opt.api = await fontApi(opt);
  const list = wanted.length ? wanted : Object.keys(SECTIONS);
  if (opt.font && list.includes('s8')) opt.wall = circleWalls(D, opt.api);
  console.log(`# sf-probe — docs/audit/references-sf.md (card 2.2) · pin ${pin}`);
  for (const s of list) await SECTIONS[s](D, opt);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(e.stack || e); process.exit(1); });
}
