#!/usr/bin/env node
// GRAMMAR PROBE — reprints docs/audit/findings-grammar.md, audit card 1.9 (plans/set-and-rules-audit.md:430):
// axis F5 (a grammar for combination: a base plus a modifier) and axis F3 (the same object recurring as one
// drawing). AUDIT ONLY — imported by nothing; reads the pin, writes nothing.
//
//   P=<scratch>/pin; git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   node tools/audit/grammar-probe.mjs $P [section …]
//
// No section = all of them, in the document's order. An unknown section prints the list and exits 2; a missing
// or invalid pin directory prints the usage and exits 2. Output is stdout only, sorted where order is not the
// document's, and deterministic. The pin is read for src/icons/{24,20,16} and research/queue.md (the sheet at
// the pin — §1.5 and §1.6 count it). No reference data is read: §1.7 cites the reference cards and measures nothing.
//
// SECTIONS (each prints `## §<n> <title>` and then the figures as the document states them, rows in its order)
//   head  the headline (doc lines 28-40): the four kinds and their populations, the through kind's air, the
//         parts that break at one master
//   s0    §0   the px@16 scale, the drawing bound, the geometry-derived composite core (26), the kinds table
//              (25 · 18 · 4 · 31 · 0), the eight two-mark concepts, the instrument caveat and the 694 / 0 check
//   s1.1  §1.1 beside — the 25-concept table and its three readings
//   s1.2  §1.2 through — the 18-concept table, the air at 3 dp, the shrunken bases, the arrow lengths
//   s1.3  §1.3 strike — the C21 bar table, the bar direction, volume-off's centring
//   s1.4  §1.4 enclosure — the 31-concept table
//   s1.5  §1.5 corner badge — the near things by construction and by size, bell-2, the sheet census (349 · 38 · 19 · 21)
//   s1.6  §1.6 docs/05 against the set — the measured cells, and docs/05's entry test over the sheet (34 · 23 · 7 · 4)
//   s1.7  §1.7 the references — cited, nothing measured (prints that)
//   s1.8  §1.8 the mark sizes in play — the table, the six pluses, the two composite heads
//   s2.1  §2.1 families counted — 125 · 105 · 20 · 9 · 96 · 378 and the five body categories
//   s2.2  §2.2 bodies nearly shared — the 14 rows, with tags; the near misses the table leaves out
//   s2.3  §2.3 shared parts that break at one master — the nine parts, the residual ranking, the body pairs
//   s2.4  §2.4 cross-family reuse — the table, the 127 pairs, the cross-family class and near-miss counts
//   s2.5  §2.5 stacks — where the sheet behind sits, the air, the offset count (9 of 12)
//   s2.6  §2.6 the doors — the table and the canonical identities
//   s3    §3   the judged list — the counts each item carries, recomputed from the sections above
//   s4    §4   eye questions — the figures its questions quote (door arrow, stars, the two airs)
//   s5    §5   proposals — the sheet rows they cite (455, 456, 284, 434) and the counts they restate
//   s6    §6   for wave 5 — this card's column, recomputed
//   s7    §7   handover — the figures it hands on (volume-off's 0.01 and channel, 1.28, 38 / 19 / 21, 30, 20×16)
//
// INSTRUMENTS, imported read-only: tools/audit/congruence.mjs (canonical, subpathsOfPath, prepare, classify,
// congruentUpToTranslation, congruentUpToScale, scaleTrivial), tools/geometry.mjs (parsePath, samplePath, bbox,
// isDot), tools/masters.mjs (strokeOf, weightOf, MASTERS bounds and keylines). geometry.mjs and masters.mjs at
// HEAD are byte-identical to the pin's (git diff 5933041 HEAD is empty for both).
//
// MEASURES (as the document's §0 defines them; the code is card 1.9's scratch lib.mjs, composites.mjs,
// objects.mjs and its probes, folded in and re-run against the pin — the original scripts, pointed at the pin,
// reproduce their saved outputs byte for byte, and this probe reproduces them):
//   ink box    centreline bbox (geometry.mjs bbox) grown by half the file's stroke, or an area path's own edge
//   stroke     lint.mjs:206-211: a file with an area path keeps the master's outline stroke for its lines; any
//              other -filled file carries FILLED_WEIGHT (masters.mjs weightOf)
//   air        the tightest centreline-to-centreline distance between two groups of paths minus the stroke,
//              built as lint.mjs polyGap builds it: samples every 0.25 on straights and every degree on arcs
//              (samplePath arcStep 1), segments only between neighbouring samples (a hop of 0.3² or more is a
//              jump between subpaths, not ink). Against a solid: half a stroke subtracted.
//   to bound   how far the modifier's ink stays inside masters.mjs bound (2→22 · 2→18 · 1→15)
//   congruent  translation mode, tolerance 0.01; near band 0.5 · m/24 (0.5 · 0.417 · 0.333)
//
// KNOWN INSTRUMENT DEFECTS, and how this probe works around them (plans/set-and-rules-audit.md, RESUME HERE):
//   · congruence.mjs congruentUpToTranslation reports "different segment structure" for one ring traversed the
//     other way round. Every EXACT and MIRROR test here compares canonical().shape (as classify does). Every
//     NEAR test in a pairwise count (§2.4's pairs, §2.3's parts) is run on canonical().d, and §0 prints how many
//     near matches the raw compare would have missed (the card's "0 of 694"; 694 is every non-trivial part asked,
//     461 of them without an exact or mirror twin — the original counter ran before its exact test). classify's own near-miss lists
//     (§2.1-§2.4 census counts) are reported exactly as classify returns them — that is the figure the document
//     states — and its exact buckets are already canonical.
//   · geometry.mjs bbox samples arcs at 64 points (up to 0.0056 inside a true edge). Every box here is printed
//     to 2 dp, as the document prints it; no figure in this document is quoted finer than 0.01 from a box.
//   · raster.mjs classify (area paths), pixelgrid.mjs, figma.mjs: not used.
//
// A FIGURE THE DOCUMENT CHOSE is a named parameter below, never a measured figure: the kind each composite was
// placed in (COMPOSITES — so 78 · 25 · 18 · 4 · 31 and the drawings column are its size, printed as such), the pairs
// asked in §2.4 (PAIRS), the rows §2.2 lists (NEAR_ROWS), the part selectors of §2.3 (PARTS), and the
// card's grep words and its own selection of 38 badge rows (CARD_GREP_WORDS, CARD_BADGE_ROWS — the 38 is definitional,
// printed as the card's selection beside the 113 its grep finds: 19 strike · 21 enclosure · 73 other, 35 of those 73 left
// out of the selection). Every count is computed from them.
//
// WHERE THE PROBE AND THE DOCUMENT PART (the full list: the card-reprint map):
//   · §2.1's categories: the card's own code (verify.mjs order) gives 24 / 72 and 30 / 113; the document's 12 / 48 and
//     42 / 137 move its 12 two-member families by hand. Both splits are printed.
//   · the sheet: the pin's research/queue.md has 349 `[ ]` and no `[~]`; the document read the live working-tree sheet
//     (348 `[ ]` + thumbs-down `[~]`). The 349 holds; the split does not.
//   · §2.3's "30 concepts" is a hand sum; one rule over all nine parts (a concept counts when its part is one drawing
//     with another carrier's at one master and not at another) gives 38 — the landscape container's 11, not 3.
//   · §2.3's "largest 0.625": against each part's main drawing, microphone-5's cradle at 24 is 1.008 off (the document
//     does not count it at 24) and refresh-3's head is 0.395 · 0.593 off at 20 · 16 (the document calls it its own).
//   · a handful of 2-dp roundings: 9.24 (9.235 at 3 dp), 12.74 (12.748), sort-alpha-descending-3's 3.51 (3.505 outline;
//     3.508 filled), the volume-off channel 1.5 (1.513), ban-2's cut 2 (2.01 — C21's medium cut, cited).
//
// RUN TIME on this machine (whole run 2.9 s wall; each section alone 0.1-3.3 s, most of it the 0.2 s load of
// 2,910 files plus the shared tables a section needs: the composite table ~1.5 s, the cross-family classify at three
// masters ~0.5 s, the 127 pairs ~0.7 s). Per section, `/usr/bin/time -p` with other agents running: head 1.95 · s0 0.84
// · s1.1 1.68 · s1.2 3.33 · s1.3 2.39 · s1.4 1.93 · s1.5 1.87 · s1.6 2.14 · s1.7 0.11 · s1.8 1.68 · s2.1 0.29 · s2.2 0.32
// · s2.3 0.35 · s2.4 2.33 · s2.5 0.19 · s2.6 0.17 · s3 2.29 · s4 1.97 · s5 1.93 · s6 2.40 · s7 1.84 s. No cache is needed.
//
// FAITHFUL TO THE ORIGINAL: card 1.9's scratch scripts (1.9/lib.mjs, composites.mjs, objects.mjs), re-pointed at the
// pin, reproduce their saved outputs byte for byte; this probe's core reproduces their JSON exactly — 234 composite
// rows (box, centre, to bound, air, filled air, what the modifier is, openings, share), the cross-family classes and
// near misses at three masters, 105 families' body groups and near misses, 381 pair rows.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as G from '../geometry.mjs';
import * as C from './congruence.mjs';
import { strokeOf, weightOf, MASTERS as SPEC } from '../masters.mjs';

export const MASTERS = [24, 20, 16];
/** One unit at a 16 px render. */
export const PX16 = { 24: 16 / 24, 20: 16 / 20, 16: 1 };
export const r2 = (n) => Math.round(n * 100) / 100;
export const r3 = (n) => Math.round(n * 1000) / 1000;
const num = (n) => String(r2(n) === 0 ? 0 : r2(n));
const n3 = (n) => String(r3(n) === 0 ? 0 : r3(n));
const fix2 = (n) => r2(n).toFixed(2);
const trio = (vals, f = num) => vals.map(f).join(' · ');
const uniq = (a) => [...new Set(a)];
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const safe = (fn, dflt) => { try { return fn(); } catch { return dflt; } };
const tick = (s) => `\`${s}\``;

// ── reading the pin ──────────────────────────────────────────────────────────────────────────────────────────
const PATH_RE = /<path\b([^>]*)\/>/g;
const NOTE_RE = /^(tags|box|keyline|glyph|optical|anchor|gap|grows):\s*([\s\S]*)$/;

/** One SVG file as card 1.9's loader read it: its paths (area or stroke), the weight its lines carry (lint.mjs:206-211)
 *  and its notes. */
export function parseIcon(src, master, file) {
  const filled = /-filled\.svg$/.test(file);
  const name = file.replace(/-filled\.svg$|\.svg$/, '');
  const paths = [];
  for (const m of src.matchAll(PATH_RE)) {
    const attrs = m[1];
    const d = /\bd="([^"]+)"/.exec(attrs)?.[1];
    if (!d) continue;
    paths.push({ d, area: /fill="currentColor"/.test(attrs) });
  }
  const areas = paths.filter((p) => p.area).map((p) => p.d);
  const strokes = paths.filter((p) => !p.area).map((p) => p.d);
  const stroke = areas.length ? strokeOf(master) : weightOf(file.replace('.svg', ''), master);
  const comments = [...src.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].trim());
  const notes = {};
  for (const c of comments) { const k = NOTE_RE.exec(c); if (k) notes[k[1]] = k[2].trim(); }
  return { name, master, filled, file, stroke, paths, areas, strokes, comments, notes };
}

/** The set at a pin: every file of the three masters, keyed `<m>/<name>[-filled]`, and the concept list (outline 24). */
export function loadSet(pin) {
  const files = new Map();
  for (const m of MASTERS) {
    const dir = join(pin, 'src/icons', String(m));
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()) {
      const icon = parseIcon(readFileSync(join(dir, f), 'utf8'), m, f);
      files.set(`${m}/${icon.name}${icon.filled ? '-filled' : ''}`, icon);
    }
  }
  return setOf(files);
}
/** A set from already-parsed icons (what loadSet builds and what a test builds). */
export function setOf(files) {
  const names = uniq([...files.values()].filter((f) => !f.filled && f.master === 24).map((f) => f.name)).sort(cmp);
  return { files, names, get: (m, n, filled = false) => files.get(`${m}/${n}${filled ? '-filled' : ''}`) };
}

// ── measures (card 1.9's lib.mjs) ────────────────────────────────────────────────────────────────────────────
/** Outer ink box of one `d`: centreline bbox grown by half the stroke, or the area's own edge. */
export function inkBox(d, stroke, area = false) {
  const b = G.bbox([d]);
  const h = area ? 0 : stroke / 2;
  return { x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h, w: b.x1 - b.x0 + 2 * h, h: b.y1 - b.y0 + 2 * h };
}
export function union(boxes) {
  const o = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const b of boxes) { o.x0 = Math.min(o.x0, b.x0); o.y0 = Math.min(o.y0, b.y0); o.x1 = Math.max(o.x1, b.x1); o.y1 = Math.max(o.y1, b.y1); }
  o.w = o.x1 - o.x0; o.h = o.y1 - o.y0;
  return o;
}
export const samples = (d) => G.samplePath(d, { arcStep: 1 });
/** Smallest distance from any point of A to the polyline through B's samples — lint.mjs `polyGap`'s construction:
 *  a hop whose squared length is 0.3 or more is a jump between subpaths, not ink, and only its end point counts. */
export function polyDist(A, B) {
  let min = Infinity;
  for (const [px, py] of A) for (let k = 0; k < B.length; k++) {
    const [x1, y1] = B[k], [x2, y2] = B[k + 1] ?? B[k];
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    const t = L && L < 0.3 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
    const dd = Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    if (dd < min) min = dd;
  }
  return min;
}
/** Minimum centreline-to-centreline distance between two groups of paths. */
export function minDist(dsA, dsB) {
  const A = dsA.flatMap(samples), B = dsB.flatMap(samples);
  return Math.min(polyDist(A, B), polyDist(B, A));
}
/** Air between the ink edges of two groups of stroked paths at one weight. Negative = overlap. */
export const air = (dsA, dsB, stroke) => minDist(dsA, dsB) - stroke;
/** Air between a stroked group and an area's boundary. */
export const airToArea = (ds, areaDs, stroke) => minDist(ds, areaDs) - stroke / 2;
export const subs = (d) => C.subpathsOfPath(d);
export const shapeOf = (d) => safe(() => C.canonical(d).shape, null);
/** Same drawing, anywhere: canonical shapes equal (blind to start point and direction — the defect workaround). */
export const sameShape = (a, b) => { const x = shapeOf(a), y = shapeOf(b); return x !== null && x === y; };
/** Best-fit residual, run on canonical `d` so a ring walked the other way is not "different structure". */
export function residual(a, b) {
  if (sameShape(a, b)) return 0;
  const r = safe(() => C.congruentUpToTranslation(C.canonical(a).d, C.canonical(b).d), null);
  return r ? (r.same ? 0 : r.maxDeviation) : Infinity;
}
/** The same compare as card 1.9 ran it, on the raw `d` (kept to show what the defect hides). */
export function residualRaw(a, b) {
  const r = safe(() => C.congruentUpToTranslation(a, b), null);
  return r ? (r.same ? 0 : r.maxDeviation) : Infinity;
}
/** Re-emit a `d` with every coordinate mapped (from its canonical absolute spelling). `arc` maps an arc's sweep. */
function remap(d, fx, fy, flipSweep) {
  const abs = C.canonical(d, { closure: false }).d;
  const toks = abs.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  let out = '', cmd = null, i = 0;
  while (i < toks.length) {
    const t = toks[i];
    if (/[A-Za-z]/.test(t)) { cmd = t; out += t; i++; continue; }
    if (cmd === 'A') {
      const [rx, ry, rot, fa, fs, x, y] = toks.slice(i, i + 7).map(Number);
      out += `${rx} ${ry} ${rot} ${fa} ${flipSweep ? 1 - fs : fs} ${r3(fx(x, y))} ${r3(fy(x, y))}`;
      i += 7;
    } else { const x = Number(toks[i]), y = Number(toks[i + 1]); out += `${r3(fx(x, y))} ${r3(fy(x, y))}`; i += 2; }
    out += ' ';
  }
  return out.trim();
}
/** Mirror a `d` left-right about the canvas centre (card 1.9's mirrorX). */
export const mirrorX = (d, canvas) => remap(d, (x) => canvas - x, (x, y) => y, true);
/** Turn a `d` a quarter about the origin (x, y) → (y, −x); position is irrelevant to a shape compare. */
export const turn90 = (d) => remap(d, (x, y) => y, (x) => -x, false);
export const lineLength = (d) => { const b = G.bbox([d]); return Math.hypot(b.x1 - b.x0, b.y1 - b.y0); };
export const isStraight = (d) => { const p = G.parsePath(d); return p.length === 2 && !/A/.test(d); };
const arcRadii = (d) => uniq(G.parsePath(d).filter((c) => c.cmd === 'A').map((c) => r3(c.args[0])));

// ── families (card 1.9's object stems) ──────────────────────────────────────────────────────────────────────
/** Two-word objects the card kept whole; every other name's stem is its first word. */
export const COMPOUND = ['alert-circle', 'alert-triangle', 'check-circle', 'map-pin', 'credit-card', 'chart-bar', 'chart-pie',
  'at-sign', 'thumbs-up', 'toggle-on', 'book-open', 'list-bullet', 'list-ordered', 'more-horizontal', 'more-vertical',
  'rotate-ccw', 'external-link', 'file-text', 'layout-footer', 'layout-header', 'layout-sidebar-right', 'layout-sidebar',
  'sort-alpha', 'sort-numeric', 'cursor-click', 'menu-arrow', 'arrow-up-right', 'chevrons-up-down'];
export function stemOf(name) {
  for (const c of COMPOUND) if (name === c || name.startsWith(c + '-')) return c;
  return name.split('-')[0];
}
/** The mark families (the card's set; star, more-* never form a family of two at the pin). */
export const MARK_STEMS = new Set(['plus', 'minus', 'x', 'check', 'chevron', 'arrow', 'arrow-up-right', 'star', 'sparkle', 'more-horizontal', 'more-vertical', 'ban']);
export const endpoints = (d) => { const p = samples(d); return [p[0], p[p.length - 1]]; };
/** Turn between the two legs of a two-leg bent path (M L A L): the angle at the apex, degrees. */
export function legTurn(d) {
  const p = G.parsePath(d);
  if (p.length !== 4 || p[0].cmd !== 'M' || p[1].cmd !== 'L' || p[2].cmd !== 'A' || p[3].cmd !== 'L') return null;
  const a = p[0].args, b = p[1].args, c = p[2].args.slice(-2), e = p[3].args;
  const u = [a[0] - b[0], a[1] - b[1]], v = [e[0] - c[0], e[1] - c[1]];
  const cos = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
}
const isHead = (d) => /^MLAL$/.test(G.parsePath(d).map((c) => c.cmd).join('')) && ((t) => t !== null && t > 60 && t < 120)(legTurn(d));

// ── composites: which paths are the base and which the modifier (card 1.9's selectors) ──────────────────────
const idx = (f) => f.paths.map((_, i) => i);
export const SELECT = {
  firstBase: (f) => ({ base: [0], mod: idx(f).slice(1) }),
  lastBase: (f) => ({ base: [f.paths.length - 1], mod: idx(f).slice(0, -1) }),
  arcMod: (f) => { const mod = idx(f).filter((i) => /A/.test(f.paths[i].d)); return { mod, base: idx(f).filter((i) => !mod.includes(i)) }; },
  /** glyph beside lines: the list lines are the H runs sharing the commonest start x; the rest is the glyph */
  glyphLines: (f) => {
    const hs = f.paths.map((p, i) => { const m = /^M([\d.]+) [\d.]+H[\d.]+$/.exec(p.d.trim()); return m ? { i, x: m[1] } : null; }).filter(Boolean);
    const byX = {}; for (const h of hs) (byX[h.x] ??= []).push(h.i);
    const base = Object.values(byX).sort((a, b) => b.length - a.length)[0] ?? [];
    return { base, mod: idx(f).filter((i) => !base.includes(i)) };
  },
  /** an arrow = a head (bent, open, two legs, 60-120°) plus the straight shaft that lands on it */
  arrow: (f) => {
    const heads = idx(f).filter((i) => isHead(f.paths[i].d));
    const mod = [...heads];
    for (const h of heads) {
      const hp = samples(f.paths[h].d);
      for (const i of idx(f)) if (!mod.includes(i) && isStraight(f.paths[i].d)) {
        const sp = G.parsePath(f.paths[i].d); const a = sp[0].args, b = sp[1].args;
        const ends = [[a[0], a[1]], sp[1].cmd === 'V' ? [a[0], b[0]] : sp[1].cmd === 'H' ? [b[0], a[1]] : [b[0], b[1]]];
        if (ends.some((e) => polyDist([e], hp) < 0.35)) mod.push(i);
      }
    }
    return { mod: mod.sort((a, b) => a - b), base: idx(f).filter((i) => !mod.includes(i)) };
  },
};
const sortSel = (f) => (/sort-3$/.test(f.name) ? SELECT.arcMod(f) : /-[23]$/.test(f.name) ? SELECT.glyphLines(f) : SELECT.arrow(f));
const SORT_BESIDE = ['sort-ascending', 'sort-descending', 'sort-3', 'sort-alpha-ascending', 'sort-alpha-ascending-2', 'sort-alpha-ascending-3',
  'sort-alpha-descending', 'sort-alpha-descending-2', 'sort-alpha-descending-3', 'sort-numeric-ascending', 'sort-numeric-ascending-2',
  'sort-numeric-ascending-3', 'sort-numeric-descending', 'sort-numeric-descending-2', 'sort-numeric-descending-3'];
/** PARAMETER — the kind card 1.9 placed each composite in (composites.mjs SPEC), with its base/modifier selector.
 *  Geometry proposed the core (§0, `derivedComposites`); names added the rest; the kinds are the card's reading. */
export const COMPOSITES = [
  ...['volume-plus', 'volume-minus', 'volume-x'].map((n) => ({ n, kind: 'beside', sel: SELECT.firstBase })),
  { n: 'menu-arrow-left', kind: 'beside', sel: SELECT.arcMod }, { n: 'menu-arrow-right', kind: 'beside', sel: SELECT.arcMod },
  ...SORT_BESIDE.map((n) => ({ n, kind: 'beside', sel: sortSel })),
  ...['wand', 'wand-2', 'wand-3'].map((n) => ({ n, kind: 'beside', sel: SELECT.firstBase })),
  { n: 'cursor-click', kind: 'beside', sel: SELECT.firstBase },
  { n: 'code', kind: 'beside', sel: SELECT.lastBase },
  ...['login', 'login-2', 'login-3', 'login-4', 'logout', 'logout-2', 'logout-3', 'logout-4', 'upload', 'upload-2', 'upload-3', 'export',
    'external-link', 'external-link-2', 'compose', 'compose-2', 'compose-3', 'compose-4'].map((n) => ({ n, kind: 'through', sel: SELECT.firstBase })),
  ...['ban', 'ban-2', 'ban-3', 'volume-off'].map((n) => ({ n, kind: 'strike', sel: SELECT.firstBase })),
  ...['checkbox', 'checkbox-2', 'checkbox-3', 'checkbox-4', 'alert-triangle', 'alert-triangle-2', 'alert-triangle-3', 'alert-triangle-4',
    'alert-circle', 'alert-circle-2', 'alert-circle-3', 'alert-circle-4', 'help', 'help-2', 'help-3', 'help-4', 'info', 'info-2', 'info-3',
    'plus-circle', 'plus-circle-small', 'minus-circle', 'minus-circle-small', 'x-circle', 'x-circle-small',
    'check-circle', 'check-circle-small', 'check-circle-3', 'check-circle-3-small', 'check-circle-4', 'check-circle-4-small'].map((n) => ({ n, kind: 'enclosure', sel: SELECT.firstBase })),
];
export const KINDS = ['beside', 'through', 'strike', 'enclosure'];

/** Every standalone mark's subpaths (mark families plus pencil, cursor, menu, sparkle, star), to name a modifier. */
export function markLibrary(set) {
  const LIB = {};
  for (const m of MASTERS) {
    LIB[m] = [];
    for (const n of set.names) {
      const st = stemOf(n);
      if (!MARK_STEMS.has(st) && !['pencil', 'cursor', 'menu', 'sparkle', 'star'].includes(st)) continue;
      set.get(m, n).paths.forEach((p, pi) => subs(p.d).forEach((s) => {
        const shape = shapeOf(s); if (shape === null) return;
        LIB[m].push({ n, pi, d: s, prep: safe(() => C.prepare(s), null), shape });
      }));
    }
  }
  return LIB;
}
/** What a modifier subpath is: a trivial line or dot, another mark's exact part, a near one, a resized one, or its own. */
export function identify(d, m, self, LIB) {
  const shape = shapeOf(d);
  if (shape === null) return 'unsupported';
  if (safe(() => C.scaleTrivial(d), false)) {
    const b = G.bbox([d]); const w = r2(b.x1 - b.x0), h = r2(b.y1 - b.y0);
    return G.isDot(d) ? `dot r${r3(w / 2)}` : `line ${Math.max(w, h)}${w && h ? ' diag' : ''}`;
  }
  const by = uniq(LIB[m].filter((l) => l.shape === shape && l.n !== self).map((l) => l.n));
  if (by.length) return `= ${by.slice(0, 3).join(', ')}${by.length > 3 ? ` +${by.length - 3}` : ''}`;
  let best = null;
  for (const l of LIB[m]) {
    if (l.n === self || !l.prep) continue;
    const r = safe(() => C.congruentUpToTranslation(d, l.prep), null);
    if (r && r.maxDeviation < 0.5 && (!best || r.maxDeviation < best.r)) best = { r: r.maxDeviation, n: l.n };
  }
  if (best) return `≈ ${best.n} (off ${r3(best.r)})`;
  const p = C.prepare(d);
  if (!C.scaleTrivial(p)) for (const l of LIB[m]) {
    if (l.n === self || !l.prep || C.scaleTrivial(l.prep)) continue;
    const r = safe(() => C.congruentUpToScale(p, l.prep), null);
    if (r && r.same) return `× ${r3(1 / r.scale)} of ${l.n}`;
  }
  return 'own';
}

export const BOUND = Object.fromEntries(MASTERS.map((m) => [m, SPEC[m].bound]));
/** One composite at one master: where the modifier sits, how big, the air, the filled air, the opening it uses. */
export function measureComposite(set, spec, m, LIB) {
  const f = set.get(m, spec.n);
  if (!f) return { n: spec.n, kind: spec.kind, m, missing: true };
  const { base, mod } = spec.sel(f);
  const bd = base.map((i) => f.paths[i].d), md = mod.map((i) => f.paths[i].d);
  const mb = union(md.map((d) => inkBox(d, f.stroke))), bb = union(bd.map((d) => inkBox(d, f.stroke)));
  const mid = m / 2, [b0, b1] = BOUND[m];
  const toBound = Math.min(mb.x0 - b0, mb.y0 - b0, b1 - mb.x1, b1 - mb.y1);
  const a = air(md, bd, f.stroke);
  const ff = set.get(m, spec.n, true);
  let fa = null, fnote = '';
  if (ff) {
    if (!ff.areas.length && ff.paths.length === f.paths.length) {
      const s2 = spec.sel(ff);
      fa = air(s2.mod.map((i) => ff.paths[i].d), s2.base.map((i) => ff.paths[i].d), ff.stroke); fnote = 'line-heavy';
    } else if (ff.areas.length && ff.strokes.length) { fa = airToArea(ff.strokes, ff.areas, ff.stroke); fnote = 'line against solid'; }
    else fnote = 'cut';
  }
  const ids = LIB ? md.flatMap((d) => subs(d)).map((d) => identify(d, m, spec.n, LIB)) : [];
  // an opening in the base facing the modifier: an open base subpath whose ends bracket the modifier's centreline
  const openings = [];
  const modPts = md.flatMap(samples);
  for (const d of bd) for (const sub of subs(d)) {
    const [e1, e2] = endpoints(sub);
    const L = Math.hypot(e2[0] - e1[0], e2[1] - e1[1]);
    if (L < 0.01) continue;
    if (polyDist([[(e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2]], modPts) < 2.5) openings.push(L - f.stroke);
  }
  return {
    n: spec.n, kind: spec.kind, m, f, ff, base, mod, bd, md, modBox: mb, baseBox: bb, stroke: f.stroke,
    dx: (mb.x0 + mb.x1) / 2 - mid, dy: (mb.y0 + mb.y1) / 2 - mid, toBound, air: a, filledAir: fa, fnote, ids, openings,
    share: Math.max(mb.w, mb.h) / Math.max(bb.w, bb.h),
  };
}
/** The whole composite table: rows[name][master]. */
export function compositeTable(set, LIB = markLibrary(set)) {
  const rows = {};
  for (const s of COMPOSITES) { rows[s.n] = {}; for (const m of MASTERS) rows[s.n][m] = measureComposite(set, s, m, LIB); }
  return { rows, LIB };
}

// ── part A: parts shared across families (outline, per master) ──────────────────────────────────────────────
export function sharedParts(set) {
  const out = {};
  for (const m of MASTERS) {
    const items = [];
    for (const n of set.names) set.get(m, n).paths.forEach((p, pi) => subs(p.d).forEach((s, si) => items.push({ id: `${n}#${pi}.${si}`, d: s, concept: n, stem: stemOf(n) })));
    const res = C.classify(items, { mode: 'translation', tol: 0.01, near: 0.5 * m / 24 });
    const byId = new Map(items.map((i) => [i.id, i]));
    const trivial = (d) => safe(() => C.scaleTrivial(d), true);
    const classes = res.groups.map((g) => {
      const stems = uniq(g.members.map((id) => byId.get(id).stem)).sort(cmp);
      const rep = byId.get(g.representative ?? g.members[0]) ?? byId.get(g.members[0]);
      const b = G.bbox([rep.d]);
      return { size: g.size, stems, concepts: uniq(g.members.map((id) => byId.get(id).concept)).sort(cmp), members: g.members,
        w: r2(b.x1 - b.x0), h: r2(b.y1 - b.y0), rep: rep.id, repD: rep.d, trivial: trivial(rep.d), markStems: stems.filter((s) => MARK_STEMS.has(s)) };
    });
    const shared = classes.filter((c) => c.stems.length >= 2).sort((a, b) => b.size - a.size);
    const nearMisses = res.nearMisses.filter((nm) => byId.get(nm.a).stem !== byId.get(nm.b).stem && !trivial(byId.get(nm.a).d))
      .map((nm) => ({ a: nm.a, b: nm.b, r: nm.maxDeviation }));
    out[m] = { subpaths: items.length, classes, nClasses: res.groups.length, shared, nearMisses, byId };
  }
  return out;
}
/** Concepts outside the mark families that carry a non-trivial part of a mark family exactly (the geometry core). */
export function derivedComposites(partA) {
  const derived = {};
  for (const m of MASTERS) for (const g of partA[m].shared) if (g.markStems.length && !g.trivial) {
    for (const c of g.concepts) if (!MARK_STEMS.has(stemOf(c))) {
      ((derived[c] ??= {})[m] ??= []).push({ w: g.w, h: g.h, from: g.concepts.filter((x) => MARK_STEMS.has(stemOf(x))), stems: g.markStems });
    }
  }
  return derived;
}

// ── objects: within-family body census (card 1.9's objects.mjs A) ───────────────────────────────────────────
export const partsOf = (f) => { const out = []; f.paths.forEach((p, pi) => subs(p.d).forEach((s, si) => out.push({ id: `${f.name}#${pi}.${si}`, d: s, pi, si, box: inkBox(s, f.stroke, p.area) }))); return out; };
export const bodyOf = (f) => partsOf(f).reduce((a, x) => (!a || x.box.w * x.box.h > a.box.w * a.box.h ? x : a), null);
export function familiesOf(names) {
  const fams = new Map();
  for (const n of names) { const s = stemOf(n); if (!fams.has(s)) fams.set(s, []); fams.get(s).push(n); }
  return fams;
}
export function familyCensus(set) {
  const out = [];
  for (const [stem, members] of [...familiesOf(set.names)].sort((a, b) => cmp(a[0], b[0]))) {
    if (members.length < 2) continue;
    const fam = { stem, n: members.length, members, m: {} };
    for (const m of MASTERS) {
      const bodies = members.map((n) => ({ ...bodyOf(set.get(m, n)), n }));
      const res = C.classify(bodies.map((b) => ({ id: b.n, d: b.d })), { mode: 'translation', tol: 0.01, near: 0.5 * m / 24 });
      fam.m[m] = {
        groups: res.groups.map((g) => [...g.members].sort(cmp)),
        bodyNear: res.nearMisses.map((nm) => ({ a: nm.a, b: nm.b, r: nm.maxDeviation })),
        bodySize: Object.fromEntries(bodies.map((b) => [b.n, b.box])),
        bodyD: Object.fromEntries(bodies.map((b) => [b.n, b.d])),
      };
    }
    out.push(fam);
  }
  return out;
}
/** §2.1's body categories, in THE CARD'S ORDER (verify.mjs, toolu_01VJHFk2XMt5gDnBQMkfoLUf): a family goes in the first
 *  category it meets, and "all but one" is tested before "different in every member" — so a two-member family with two
 *  different bodies lands in "all but one" (the card's code prints 24 / 72 and 30 / 113). The document's table moved
 *  those 12 pairs by hand to "different in every member" (12 / 48 and 42 / 137); `pairsAsDifferent` reproduces that
 *  move, and §2.1 prints both splits. */
export function categorise(fam, { pairsAsDifferent = false } = {}) {
  const def = fam.members.includes(fam.stem) ? fam.stem : fam.members[0];
  const onDef = MASTERS.map((m) => fam.m[m].groups.find((g) => g.includes(def)).length);
  const k = MASTERS.map((m) => fam.m[m].groups.length);
  if (onDef.every((x) => x === fam.n)) return 'all';
  if (pairsAsDifferent && k.every((x) => x === fam.n)) return 'allDiff';
  if (onDef.every((x) => x === fam.n - 1)) return 'allButOne';
  if (k.every((x) => x === fam.n)) return 'allDiff';
  if (k.every((x) => x === 2) && fam.n >= 3 && onDef.every((x) => x >= 2 && x <= fam.n - 1)) return 'twoWays';
  return 'rest';
}
/** Two members whose bodies are one drawing at some masters and not at all three. */
export function bodyPairsAtSomeMasters(census) {
  const out = [];
  for (const fam of census) {
    if (MARK_STEMS.has(fam.stem)) continue;
    for (let i = 0; i < fam.members.length; i++) for (let j = i + 1; j < fam.members.length; j++) {
      const a = fam.members[i], b = fam.members[j];
      const at = MASTERS.filter((m) => fam.m[m].groups.some((g) => g.includes(a) && g.includes(b)));
      if (at.length && at.length < 3) out.push({ stem: fam.stem, a, b, at });
    }
  }
  return out.sort((x, y) => cmp(x.a, y.a) || cmp(x.b, y.b));
}

// ── objects B: cross-family pairs ───────────────────────────────────────────────────────────────────────────
/** PARAMETER — the 127 pairs card 1.9 asked (objects.mjs PAIRS), in its order. */
export const PAIRS = [
  ['compose', 'pencil-4'], ['compose-2', 'pencil-4'], ['compose-3', 'pencil'], ['compose-4', 'pencil-2'],
  ['cursor-click', 'cursor'], ['cursor-click', 'cursor-2'], ['cursor-click', 'cursor-3'],
  ['wand', 'sparkle-2'], ['wand', 'sparkle-4'], ['wand-2', 'sparkle-2'], ['wand-3', 'wand-2'], ['wand-2', 'wand'],
  ['images', 'image'], ['images-2', 'image'], ['images-3', 'image'], ['images-4', 'image'], ['images-2', 'images'], ['images-3', 'images'], ['images-4', 'images'],
  ['files', 'file'], ['files-4', 'file'], ['file-text', 'file'], ['file-text-2', 'file'], ['archive', 'file'],
  ['alert-triangle', 'alert-circle'], ['alert-triangle-2', 'alert-circle-2'], ['alert-triangle-3', 'alert-circle-3'], ['alert-triangle-4', 'alert-circle-4'],
  ['checkbox', 'check-circle'], ['checkbox-2', 'check-circle-3'], ['checkbox-3', 'check-circle-4'], ['checkbox-4', 'check-circle-small'],
  ['volume-x', 'volume'], ['volume-plus', 'volume'], ['volume-minus', 'volume'], ['volume-low', 'volume'], ['volume-none', 'volume'], ['volume-off', 'volume'],
  ['volume-x', 'x-circle-small'], ['volume-plus', 'plus-circle-small'], ['volume-plus', 'plus-small'],
  ['menu-arrow-left', 'menu'], ['menu-arrow-right', 'menu'], ['menu-arrow-left', 'chevron-left-small'], ['menu-arrow-left', 'chevron-left'],
  ['code', 'chevron-left-small'], ['code', 'chevron-left'], ['code-2', 'chevron-left'], ['code-2', 'arrow-left'], ['code', 'code-2'],
  ['sort-3', 'chevron-up-small'], ['sort-3', 'sort-ascending'], ['sort', 'arrow-up'], ['sort-2', 'arrow-up'], ['sort-ascending', 'arrow-up'], ['sort-descending', 'arrow-down'],
  ['sort-alpha-ascending', 'arrow-up'], ['sort-numeric-ascending', 'arrow-up'], ['sort-alpha-ascending-2', 'sort-alpha-ascending'], ['sort-numeric-ascending-2', 'sort-numeric-ascending'],
  ['sort-alpha-ascending', 'sort-alpha-descending'], ['sort-numeric-ascending', 'sort-numeric-descending'], ['list-ordered', 'sort-numeric-ascending'], ['sort-alpha-ascending', 'text'],
  ['export', 'arrow-up'], ['upload', 'arrow-up'], ['upload-2', 'arrow-up'], ['upload-3', 'arrow-up'], ['export', 'upload'], ['upload-2', 'upload'], ['upload-3', 'upload'],
  ['external-link', 'arrow-up-right'], ['external-link-2', 'arrow-up-right'], ['external-link-2', 'external-link'], ['maximize-4', 'arrow-up-right'], ['refresh-3', 'arrow-up-right'],
  ['login', 'arrow-right'], ['logout', 'arrow-right'], ['login-3', 'arrow-left'], ['login', 'logout'], ['login-3', 'logout-3'], ['login-2', 'logout-2'], ['login-4', 'logout-4'],
  ['login', 'login-3'], ['login-2', 'login-4'], ['logout', 'logout-3'], ['logout-2', 'logout-4'], ['login', 'logout-3'], ['login-3', 'logout'], ['login-2', 'logout-4'], ['login-4', 'logout-2'],
  ['users', 'user'], ['users-behind', 'user'], ['users-2', 'user-2'], ['users-3', 'user-3'], ['users-4', 'user-4'], ['users-wide', 'user'], ['users-level', 'user'],
  ['camera', 'folder'], ['briefcase', 'folder'], ['calendar', 'checkbox'], ['image', 'checkbox'], ['table', 'checkbox'], ['grid-2', 'checkbox'], ['mail-3', 'checkbox'],
  ['clock', 'plus-circle'], ['globe', 'plus-circle'], ['target', 'plus-circle'], ['compass', 'plus-circle'], ['face-smile', 'plus-circle'], ['ban-3', 'plus-circle'],
  ['camera', 'user'], ['map-pin', 'user'], ['cash', 'gear-2'], ['keyboard', 'file-text'], ['message-4', 'message-2'], ['book-open-2', 'book-open'],
  ['chevrons-up-down-2', 'chevron-down-small'], ['chevrons-up-down-3', 'chevron-down-2-small'], ['chevrons-up-down', 'chevron-down'],
  ['presentation', 'desktop'], ['presentation-2', 'desktop'], ['store', 'home'], ['package', 'archive'], ['clipboard', 'file'], ['copy', 'files'], ['copy', 'image'],
];
/** What A takes from B at one master: of A's non-trivial subpaths, how many are B's exactly, after a left-right flip,
 *  nearly (on canonical d — the defect workaround; `nearRawMissed` counts what the raw compare would have missed),
 *  or as a resized copy. */
export function pairReuse(set, a, b, m) {
  const fa = set.get(m, a), fb = set.get(m, b);
  if (!fa || !fb) return { a, b, m, missing: true };
  const A = partsOf(fa), B = partsOf(fb).map((q) => ({ ...q, shape: shapeOf(q.d), prep: safe(() => C.prepare(q.d), null), canon: safe(() => C.canonical(q.d).d, null) }));
  let exact = 0, mirror = 0, trivial = 0, unmatched = 0, nearRawMissed = 0; const near = [], resized = [];
  const band = 0.5 * m / 24;
  for (const p of A) {
    if (safe(() => C.scaleTrivial(p.d), true)) { trivial++; continue; }
    const shape = shapeOf(p.d);
    if (shape && B.some((q) => q.shape === shape)) { exact++; continue; }
    const ms = safe(() => shapeOf(mirrorX(p.d, m)), null);
    if (ms && B.some((q) => q.shape === ms)) { mirror++; continue; }
    unmatched++;
    const pc = safe(() => C.canonical(p.d).d, null);
    let best = null, rawAny = false;
    for (const q of B) {
      if (!q.prep) continue;
      const rc = pc && q.canon ? safe(() => C.congruentUpToTranslation(pc, q.canon), null) : null;
      if (rc && rc.maxDeviation < band && (!best || rc.maxDeviation < best.r)) best = { r: rc.maxDeviation, q: q.id };
      const rr = safe(() => C.congruentUpToTranslation(p.d, q.prep), null);
      if (rr && rr.maxDeviation < band) rawAny = true;
    }
    if (best) { if (!rawAny) nearRawMissed++; near.push({ part: `${p.pi}.${p.si}`, to: best.q.split('#')[1], r: best.r }); continue; }
    for (const q of B) {
      if (!q.prep || safe(() => C.scaleTrivial(q.prep), true)) continue;
      const r = safe(() => C.congruentUpToScale(q.prep, p.d), null);
      if (r && r.same && Math.abs(r.scale - 1) > 0.001) { resized.push({ part: `${p.pi}.${p.si}`, of: q.id.split('#')[1], scale: r.scale }); break; }
    }
  }
  return { a, b, m, parts: A.length, exact, mirror, near, resized, trivial, unmatched, nearRawMissed };
}

// ── objects C, D: stacks and doors ──────────────────────────────────────────────────────────────────────────
export const STACKS = ['images', 'images-2', 'images-3', 'images-4', 'files', 'files-2', 'files-3', 'files-4', 'files-5', 'copy', 'copy-2', 'copy-3'];
/** The front sheet (largest part) and the back (every part reaching outside the front's box); how far the back shows
 *  past the front on each side, and the air between them. */
export function stackOf(set, n, m) {
  const f = set.get(m, n); if (!f) return null;
  const parts = partsOf(f);
  const front = bodyOf(f);
  const back = parts.filter((p) => p !== front && (p.box.x0 < front.box.x0 - 0.01 || p.box.y1 > front.box.y1 + 0.01 || p.box.x1 > front.box.x1 + 0.01 || p.box.y0 < front.box.y0 - 0.01));
  if (!back.length) return { n, m, front: front.box, back: null };
  const bb = union(back.map((p) => p.box));
  const a = Math.min(...back.map((p) => polyDist(samples(p.d), samples(front.d)))) - f.stroke;
  const past = { left: front.box.x0 - bb.x0, right: bb.x1 - front.box.x1, top: front.box.y0 - bb.y0, bottom: bb.y1 - front.box.y1 };
  return { n, m, front: front.box, back: bb, past, air: a, tags: f.notes.tags ?? '' };
}
export const DOORS = ['login', 'logout', 'login-2', 'logout-2', 'login-3', 'logout-3', 'login-4', 'logout-4'];
export function doorOf(set, n, m) {
  const f = set.get(m, n);
  const door = f.paths[0].d, head = f.paths[1].d, shaft = f.paths[2].d;
  const db = inkBox(door, f.stroke), hb = inkBox(head, f.stroke), sb = inkBox(shaft, f.stroke);
  const [e1, e2] = endpoints(head); const hs = samples(head); const apex = hs[Math.floor(hs.length / 2)];
  const ab = union([hb, sb]);
  const airv = Math.min(polyDist(samples(head), samples(door)), polyDist(samples(shaft), samples(door))) - f.stroke;
  return { n, m, side: (db.x0 + db.x1) / 2 < m / 2 ? 'left' : 'right', door: db, depth: db.w, points: apex[0] > (e1[0] + e2[0]) / 2 ? '→' : '←',
    length: ab.w, head: hb.h, air: airv, doorD: door, wholeD: f.paths.map((p) => p.d).join('') };
}

// ── the sheet ────────────────────────────────────────────────────────────────────────────────────────────────
export function sheetRows(text) {
  return text.split('\n').map((l, i) => { const m = /^- \[([ x~])\] (\d+)\. `([a-z0-9-]+)`/.exec(l); return m && { line: i + 1, status: m[1], row: Number(m[2]), name: m[3] }; }).filter(Boolean);
}
/** PARAMETER — the card's grep (toolu_01E2ZDLTTYCmY6x4RssJ785J): the modifier words it read off a name's last word.
 *  It catches far more than badges; the card then picked the badge rows by hand. */
export const CARD_GREP_WORDS = ['plus', 'minus', 'x', 'check', 'off', 'clock', 'star', 'lock', 'arrow', 'slash', 'search', 'settings', 'cog',
  'dollar', 'heart', 'user', 'edit', 'key', 'question', 'alert', 'warning', 'add', 'remove', 'cancel', 'sync', 'share', 'download', 'upload',
  'badge', 'dot', 'notification', 'circle', 'square', 'up', 'down', 'left', 'right', 'in', 'out', 'open', 'closed', 'filled', 'list', 'text',
  'code', 'link', 'pin'];
export const STRIKE_WORDS = ['off', 'closed'];
export const ENCLOSURE_WORDS = ['circle', 'square'];
/** PARAMETER — DEFINITIONAL: the card's own selection of corner-badge rows, the 38 names findings-grammar.md lists at
 *  line 273 (the document: the census "was checked by hand, so the badge row is a floor"). What counts as a badge row is the
 *  card's definition, not a measure. The probe prints it as such, beside the 113 the card's own grep finds (19 strike ·
 *  21 enclosure · 73 other) and the 35 of the 73 the selection leaves out. */
export const CARD_BADGE_ROWS = ['bell-plus', 'calendar-check', 'calendar-clock', 'cart-minus', 'cart-plus', 'clipboard-check', 'code-plus',
  'credit-card-lock', 'credit-card-x', 'database-plus', 'desktop-download', 'eye-check', 'face-smile-plus', 'file-check', 'file-clock', 'file-down',
  'file-heart', 'file-minus', 'file-plus', 'file-up', 'folder-down', 'folder-minus', 'folder-plus', 'folder-up', 'grid-circle-plus', 'image-plus',
  'mail-follow-up', 'message-alert', 'message-user', 'note-plus', 'package-check', 'shield-check', 'user-check', 'user-lock', 'user-minus',
  'user-plus', 'user-search', 'user-x'];
/** PARAMETER — a modifier written as two words (the card's base count reads mail-follow-up's base as `mail`). */
export const TWO_WORD_MODIFIERS = ['follow-up'];
/** The modifier word a name ENDS with (only its last word, or a two-word modifier), from a word list; else null. */
export function wordOf(name, words) {
  const two = TWO_WORD_MODIFIERS.find((w) => name.endsWith(`-${w}`));
  if (two) return words.includes(two.split('-').pop()) || words.includes(two) ? two : null;
  const last = name.split('-').pop();
  return name.includes('-') && words.includes(last) ? last : null;
}
const baseOf = (name, word) => name.slice(0, -(word.length + 1));
export function sheetCensus(rows, shipped, hand = CARD_BADGE_ROWS) {
  const notApproved = rows.filter((r) => r.status !== 'x');
  const pending = uniq(notApproved.map((r) => r.name)).filter((n) => !shipped.has(n));
  const pick = (names, words) => names.filter((n) => wordOf(n, words)).map((n) => ({ name: n, word: wordOf(n, words), base: baseOf(n, wordOf(n, words)) }));
  const grep = pick(pending, CARD_GREP_WORDS);
  const strike = pick(pending, STRIKE_WORDS), enclosure = pick(pending, ENCLOSURE_WORDS);
  const other = grep.filter((r) => !strike.some((x) => x.name === r.name) && !enclosure.some((x) => x.name === r.name));
  const badge = pick(pending.filter((n) => hand.includes(n)), [...CARD_GREP_WORDS, ...TWO_WORD_MODIFIERS]);
  const dropped = other.filter((r) => !hand.includes(r.name));
  const perBase = {};
  for (const r of [...badge, ...strike]) (perBase[r.base] ??= []).push(r.name);
  return { rows: rows.length, notApproved: notApproved.length, open: notApproved.filter((r) => r.status === ' ').length, review: notApproved.filter((r) => r.status === '~'),
    pending, grep, other, badge, dropped, handMissing: hand.filter((n) => !pending.includes(n)), strike, enclosure, perBase };
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════
// The sections. A context object computes each shared table once, on first use.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════
function context(pin) {
  const set = loadSet(pin);
  const memo = {};
  const once = (k, fn) => () => (memo[k] ??= fn());
  const ctx = { pin, set };
  ctx.LIB = once('LIB', () => markLibrary(set));
  ctx.table = once('table', () => compositeTable(set, ctx.LIB()).rows);
  ctx.partA = once('partA', () => sharedParts(set));
  ctx.census = once('census', () => familyCensus(set));
  ctx.pairs = once('pairs', () => PAIRS.flatMap(([a, b]) => MASTERS.map((m) => pairReuse(set, a, b, m))));
  ctx.sheet = once('sheet', () => {
    const file = join(pin, 'research/queue.md');
    if (!existsSync(file)) return null;
    return sheetCensus(sheetRows(readFileSync(file, 'utf8')), new Set(set.names));
  });
  ctx.sheetRows = once('sheetRows', () => { const file = join(pin, 'research/queue.md'); return existsSync(file) ? sheetRows(readFileSync(file, 'utf8')) : []; });
  return ctx;
}
const out = (s = '') => console.log(s);
const row = (cells) => out(`| ${cells.join(' | ')} |`);
const ofKind = (ctx, kind) => COMPOSITES.filter((s) => s.kind === kind && ctx.set.get(24, s.n)).map((s) => s.n);
/** Per master, the members' values; one value where they agree, else joined " / " (the document's merged rows). */
function perMaster(members, fn, f = num, sep = ' / ') {
  return MASTERS.map((m) => {
    const v = members.map((n) => fn(n, m)).map((x) => (typeof x === 'number' ? f(x) : x));
    return uniq(v).join(sep);
  }).join(' · ');
}
/** Members then masters: "a · b · c / d · e · f" (the document's help/info/check-circle rows). */
const perMember = (members, fn, f = num) => members.map((n) => MASTERS.map((m) => { const x = fn(n, m); return typeof x === 'number' ? f(x) : x; }).join(' · ')).join(' / ');
const wh = (b) => `${num(b.w)}×${num(b.h)}`;
const signed = (n) => (r2(n) > 0 ? `+${num(n)}` : num(n));
/** ±a / ∓a when two members sit mirror-wise, else the members' values joined. */
function pm(vals) {
  const u = uniq(vals.map(num));
  if (u.length === 1) return signed(vals[0]);
  if (u.length === 2 && r2(vals[0]) === -r2(vals[1])) return `${vals[0] < 0 ? '∓' : '±'}${num(Math.abs(vals[0]))}`;
  return vals.map(signed).join(' / ');
}

// ── head ─────────────────────────────────────────────────────────────────────────────────────────────────────
/** The through kind's air at 3 dp, by master: exactly 1.500 at all three, just over (under 1.6) at all three, or off. */
export function airGroups(T, names) {
  const g = { exact: [], near: [], off: [] };
  for (const n of names) {
    const a = MASTERS.map((m) => r3(T[n][m].air));
    if (a.every((x) => x === 1.5)) g.exact.push({ n, a });
    else if (a.every((x) => x > 1.5 && x < 1.6)) g.near.push({ n, a });
    else g.off.push({ n, a });
  }
  return g;
}
const throughAirGroups = (ctx) => airGroups(ctx.table(), ofKind(ctx, 'through'));
function secHead(ctx) {
  out('## §head The headline, in plain words (doc lines 28-40)');
  const counts = Object.fromEntries(KINDS.map((k) => [k, ofKind(ctx, k).length]));
  const total = KINDS.reduce((s, k) => s + counts[k], 0);
  out(`composites of four kinds — PARAMETER CARDINALITY (the size of COMPOSITES, the card's classification; not a measure): ${total} — beside ${counts.beside} · through ${counts.through} · strike ${counts.strike} · enclosure ${counts.enclosure} (of card 1.4's containers — cited); corner badges 0 (a reading, §1.5 — not a measure)`);
  const g = throughAirGroups(ctx);
  out(`through kind, air where the modifier meets the base: exactly 1.500 at all three masters in ${g.exact.length} of ${counts.through}; ${uniq(g.near.map((x) => x.a.map((v) => v.toFixed(3)).join(' · '))).join(' / ')} in ${g.near.length} more; the other ${g.off.length} stand off`);
  const parts = sharedPartsBreaking(ctx);
  out(`parts one drawing at one master and not another (§2.3): ${parts.map((p) => p.label).join('; ')}`);
}

// ── §0 ───────────────────────────────────────────────────────────────────────────────────────────────────────
function secS0(ctx) {
  out('## §0 Method, and how to read a number');
  out('| master | 1 unit at a 16 px render |');
  for (const m of MASTERS) out(`| ${m} | ${(PX16[m]).toFixed(3)} px |`);
  out(`drawing bound (masters.mjs): ${MASTERS.map((m) => `${BOUND[m][0]}→${BOUND[m][1]}`).join(' · ')}`);
  const A = ctx.partA(), D = derivedComposites(A);
  const core = Object.keys(D).sort(cmp);
  out(`concepts outside the mark families carrying a non-trivial part of a mark family exactly: ${core.length} — ${groupNames(core)}`);
  const placed = new Set(COMPOSITES.map((s) => s.n));
  const twoMark = core.filter((n) => !placed.has(n) && n !== 'refresh-3');
  out(`  of them in a kind: ${core.filter((n) => placed.has(n)).length}; refresh-3 (a circular arrow, one object) placed in none; two marks sharing a canvas with no base: ${twoMark.length} — ${groupNames(twoMark)}`);
  out('the kinds table is the PARAMETER\'s cardinality (COMPOSITES, the card\'s classification) — counted, not measured; the drawings are its files at the pin');
  out('| kind | concepts | drawings |');
  for (const k of KINDS) { const ns = ofKind(ctx, k); row([k, `${ns.length} (parameter)`, `${drawingsOf(ctx, ns)} (its files)`]); }
  row(['corner badge', '0 (a reading of every assembly, §1.5 — not a measure)', '0']);
  // the instrument caveat
  const a = ctx.set.get(24, 'checkbox').paths[0].d, b = ctx.set.get(24, 'layout-sidebar-right').paths[0].d;
  const raw = C.congruentUpToTranslation(a, b), canon = C.congruentUpToTranslation(C.canonical(a).d, C.canonical(b).d);
  out(`instrument caveat — checkbox vs layout-sidebar-right @24: raw compare residual ${raw.maxDeviation === Infinity ? '∞' : n3(raw.maxDeviation)} (${raw.reason ?? 'same'}); canonical shapes identical: ${sameShape(a, b)}; compare on canonical d: ${n3(canon.maxDeviation)}`);
  const P = ctx.pairs();
  const sum = (k) => P.reduce((s, r) => s + (r[k] ?? 0), 0);
  out(`§2.4's ${PAIRS.length} pairs × 3 masters: non-trivial parts ${sum('exact') + sum('mirror') + sum('unmatched')} (an exact twin ${sum('exact')}, a mirror twin ${sum('mirror')}, neither ${sum('unmatched')}); near matches found on canonical d that the raw compare missed: ${sum('nearRawMissed')}`);
}
const drawingsOf = (ctx, names) => names.reduce((s, n) => s + MASTERS.reduce((t, m) => t + (ctx.set.get(m, n) ? 1 : 0) + (ctx.set.get(m, n, true) ? 1 : 0), 0), 0);
/** `login` ×4 style: names folded by their numbered stem, in name order. */
function groupNames(names) {
  const by = new Map();
  for (const n of [...names].sort(cmp)) { const k = n.replace(/-\d+$/, ''); if (!by.has(k)) by.set(k, []); by.get(k).push(n); }
  return [...by].map(([k, ns]) => (ns.length > 1 ? `${k} ×${ns.length}` : ns[0])).join(', ');
}

// ── §1.1 beside ─────────────────────────────────────────────────────────────────────────────────────────────
/** PARAMETER — the document's rows of §1.1, in its order (a merged row lists its members). */
const BESIDE_ROWS = [
  ['`volume-plus`', ['volume-plus']], ['`volume-minus`', ['volume-minus']], ['`volume-x`', ['volume-x']],
  ['`menu-arrow-left` / `-right`', ['menu-arrow-left', 'menu-arrow-right']],
  ['`sort-ascending`', ['sort-ascending']], ['`sort-descending`', ['sort-descending']], ['`sort-3`', ['sort-3']],
  ['`sort-alpha-ascending` / `-descending`', ['sort-alpha-ascending', 'sort-alpha-descending']],
  ['`sort-numeric-ascending` / `-descending`', ['sort-numeric-ascending', 'sort-numeric-descending']],
  ['`sort-alpha-*-2` / `-3` (4)', ['sort-alpha-ascending-2', 'sort-alpha-ascending-3', 'sort-alpha-descending-2', 'sort-alpha-descending-3']],
  ['`sort-numeric-*-2` / `-3` (4)', ['sort-numeric-ascending-2', 'sort-numeric-ascending-3', 'sort-numeric-descending-2', 'sort-numeric-descending-3']],
  ['`wand`', ['wand']], ['`wand-2`', ['wand-2']], ['`wand-3`', ['wand-3']], ['`cursor-click`', ['cursor-click']], ['`code`', ['code']],
];
const modD = (r) => r.md.join('');
const headOf = (r) => r.md.find((d) => isHead(d));
const inkLen = (set, n, m) => { const f = set.get(m, n); return union(f.paths.map((p) => inkBox(p.d, f.stroke))); };
function besideWhat(ctx, n) {
  const T = ctx.table(), set = ctx.set;
  const R = (m) => T[n][m];
  if (n === 'volume-plus') {
    const L = MASTERS.map((m) => R(m).md.map(lineLength));
    const others = plusSizes(ctx)[24].filter((x) => x.where !== 'volume-plus').map((x) => num(x.size));
    return `a plus of two ${trio(L.map((l) => l[0]))} lines (centreline); plus ink at 24 elsewhere ${uniq(others).join(', ')} — ${num(R(24).modBox.w)} found elsewhere: ${others.includes(num(R(24).modBox.w)) ? 'yes' : 'no'}`;
  }
  if (n === 'volume-minus') return `the plus's bar: = one of volume-plus's lines ${MASTERS.map((m) => (set.get(m, 'volume-plus') && R(m).md.some((d) => T['volume-plus'][m].md.some((e) => sameShape(d, e))) ? 'yes' : 'no')).join(' · ')}`;
  if (n === 'volume-x') return `= x-circle-small's x ${MASTERS.map((m) => (sameShape(modD(R(m)), set.get(m, 'x-circle-small').paths.slice(1).map((p) => p.d).join('')) ? 'yes' : 'no')).join(' · ')}`;
  if (n === 'menu-arrow-left') return `chevron: ${trio(MASTERS.map((m) => uniq(R(m).ids).join(', ')), (x) => x)} (no chevron in the set has it; its leg 2.871 is card 1.1 §2.7's — cited)`;
  if (n === 'sort-ascending' || n === 'sort-descending') {
    const free = n === 'sort-ascending' ? 'arrow-up' : 'arrow-down';
    return `= ${free}, head and shaft: ${MASTERS.map((m) => (sameShape(modD(R(m)), set.get(m, free).paths.map((p) => p.d).join('')) ? 'yes' : 'no')).join(' · ')}`;
  }
  if (n === 'sort-3') {
    const heads = (m) => ['sort-alpha-ascending', 'sort-alpha-descending', 'sort-numeric-ascending', 'sort-numeric-descending'].map((x) => headOf(T[x][m]));
    return `two chevrons, each = a sort-alpha/numeric arrowhead ${MASTERS.map((m) => (R(m).md.every((d) => heads(m).some((h) => sameShape(d, h))) ? 'yes' : 'no')).join(' · ')}; chevron ${trio(MASTERS.map((m) => inkBox(R(m).md[0], R(m).stroke).w))} wide (leg 3.847: card 1.1 §2.7 — cited)`;
  }
  if (n === 'sort-alpha-ascending' || n === 'sort-numeric-ascending') return `narrow head ${trio(MASTERS.map((m) => inkBox(headOf(R(m)), R(m).stroke).w))} wide`;
  if (n === 'wand') {
    const star = (m) => R(m).md.flatMap(subs).find((d) => !G.isDot(d));
    return `star ${trio(MASTERS.map((m) => inkBox(star(m), R(m).stroke).w))} (${MASTERS.map((m) => R(m).ids[0]).join(' · ')}); ${MASTERS.map((m) => R(m).ids.find((x) => /^dot/.test(x))).join(' · ')}; group ${trio(MASTERS.map((m) => R(m).modBox), wh)}`;
  }
  if (n === 'wand-2' || n === 'wand-3') return `star ${trio(MASTERS.map((m) => R(m).ids.find((x) => !/^dot/.test(x))), (x) => x)} with a ${trio(MASTERS.map((m) => R(m).ids.find((x) => /^dot/.test(x))), (x) => x)} hole`;
  if (n === 'cursor-click') {
    const ray = (m, diag) => R(m).md.filter((d) => { const b = G.bbox([d]); return diag === (b.x1 - b.x0 > 0.01 && b.y1 - b.y0 > 0.01); }).map(lineLength);
    const rays = MASTERS.map((m) => `${uniq(ray(m, false).map(num)).join('/')} straight, ${uniq(ray(m, true).map(num)).join('/')} diagonal`);
    const scale = MASTERS.map((m) => (safe(() => C.congruentUpToScale(set.get(m, 'cursor').paths[0].d, R(m).bd[0]).same, false) ? 'yes' : 'no'));
    return `three rays ${rays.join(' · ')} long (centreline); its cursor ${trio(MASTERS.map((m) => R(m).baseBox.w))} ink against cursor's ${trio(MASTERS.map((m) => inkLen(set, 'cursor', m).w))}; a resize of cursor: ${scale.join(' · ')}`;
  }
  if (n === 'code') return `two chevrons: ${trio(MASTERS.map((m) => uniq(R(m).ids).join(', ')), (x) => x)} (leg 4.554: card 1.1 §2.7 — cited)`;
  return trio(MASTERS.map((m) => uniq(R(m).ids).join(', ')), (x) => x);
}
function besideLoses(ctx, n) {
  const T = ctx.table();
  if (/^menu-arrow/.test(n)) {
    const menu = MASTERS.map((m) => inkLen(ctx.set, 'menu', m).w), base = MASTERS.map((m) => T[n][m].baseBox.w);
    return `menu lines ${MASTERS.map((m, i) => `${num(menu[i])} → ${num(base[i])}`).join(' · ')} (${trio(MASTERS.map((m, i) => Math.round((1 - base[i] / menu[i]) * 100)), String)}%)`;
  }
  if (n === 'cursor-click') return 'the cursor redrawn smaller (see the modifier column)';
  return '—';
}
function secS11(ctx) {
  const T = ctx.table();
  const names = ofKind(ctx, 'beside');
  out(`## §1.1 Beside — a mark next to the object (${names.length} concepts)`);
  out('| concept | modifier, and what it is | modifier ink w × h | share | centre dx, dy @24 | to bound | air (px@16) | filled air | what the base loses |');
  for (const [label, members] of BESIDE_ROWS) {
    const R = (n, m) => T[n][m];
    row([label, besideWhat(ctx, members[0]),
      perMaster(members, (n, m) => wh(R(n, m).modBox), String),
      uniq(members.map((n) => fix2(R(n, 24).share))).join(' / '),
      `${pm(members.map((n) => R(n, 24).dx))}, ${pm(members.map((n) => R(n, 24).dy))}`,
      perMaster(members, (n, m) => R(n, m).toBound),
      `${perMaster(members, (n, m) => R(n, m).air)} (${perMaster(members, (n, m) => R(n, m).air * PX16[m])})`,
      perMaster(members, (n, m) => (R(n, m).filledAir === null ? R(n, m).fnote : R(n, m).filledAir)),
      besideLoses(ctx, members[0])]);
  }
  // reading 1: where the marks sit; nothing crosses the bound
  const vol = ['volume-plus', 'volume-minus', 'volume-x'];
  out(`volume marks: centre dy ${uniq(vol.map((n) => num(T[n][24].dy))).join('/')} at 24; to bound ${perMaster(vol, (n, m) => T[n][m].toBound)}`);
  const bst = [...ofKind(ctx, 'beside'), ...ofKind(ctx, 'through'), ...ofKind(ctx, 'strike')];
  out(`smallest "to bound" over the ${bst.length} beside / through / strike composites: ${num(Math.min(...bst.flatMap((n) => MASTERS.map((m) => T[n][m].toBound))))}`);
  // reading 2: the beside air at 24
  const glyph = BESIDE_ROWS.slice(9, 11).flatMap((r) => r[1]);
  const rest = names.filter((n) => !glyph.includes(n));
  out(`beside air at 24 (distinct, rows other than glyph-beside-lines): ${uniq(rest.map((n) => r2(T[n][24].air))).sort((a, b) => a - b).map(num).join(', ')}`);
  const ga = glyph.map((n) => T[n][24].air);
  out(`glyph-beside-lines rows at 24: ${num(Math.min(...ga))}–${num(Math.max(...ga))}`);
  out(`chosen air: volume-* ${uniq(vol.map((n) => num(T[n][24].air))).join('/')} (note: ${noteHas(ctx, 'volume-x', 24, '2 · 2 · 2 clear') ? 'says "2 · 2 · 2 clear"' : 'phrase absent'}); menu-arrow-* ${num(T['menu-arrow-left'][24].air)}`);
  const sortArrows = ['sort-alpha-ascending', 'sort-alpha-descending', 'sort-numeric-ascending', 'sort-numeric-descending'];
  const sa = sortArrows.flatMap((n) => MASTERS.map((m) => T[n][m].air));
  out(`the sort family's arrow rows, all masters: ${Math.min(...sa).toFixed(1)}–${Math.max(...sa).toFixed(1)}`);
  // reading 3: sized to the object
  out(`volume-x's × against the speaker's height: ${MASTERS.map((m) => `${num(T['volume-x'][m].modBox.h)} of ${num(T['volume-x'][m].baseBox.h)}`).join(' · ')} — ratio ${trio(MASTERS.map((m) => T['volume-x'][m].modBox.h / T['volume-x'][m].baseBox.h))}`);
  out(`sort arrows' length ${trio(MASTERS.map((m) => T['sort-alpha-ascending'][m].modBox.h))} against the free arrow-up's ${trio(MASTERS.map((m) => inkLen(ctx.set, 'arrow-up', m).h))}`);
}
const noteHas = (ctx, n, m, phrase) => ctx.set.get(m, n).comments.some((c) => c.includes(phrase));

// ── §1.2 through ────────────────────────────────────────────────────────────────────────────────────────────
const THROUGH_ROWS = [
  ['`login`, `logout`, `login-3`, `logout-3`', ['login', 'logout', 'login-3', 'logout-3']],
  ['`login-2`, `logout-2`, `login-4`, `logout-4`', ['login-2', 'logout-2', 'login-4', 'logout-4']],
  ['`upload`, `upload-3`', ['upload', 'upload-3']], ['`upload-2`', ['upload-2']], ['`export`', ['export']],
  ['`external-link`', ['external-link']], ['`external-link-2`', ['external-link-2']], ['`compose`', ['compose']],
  ['`compose-2`, `-3`, `-4`', ['compose-2', 'compose-3', 'compose-4']],
];
const PENCIL_OF = { compose: 'pencil-4', 'compose-2': 'pencil-4', 'compose-3': 'pencil', 'compose-4': 'pencil-2' };
const freeArrowOf = (n) => (/^(login|logout)/.test(n) ? (/-(3|4)$/.test(n) ? 'arrow-left' : 'arrow-right') : /^(upload|export)/.test(n) ? 'arrow-up' : 'arrow-up-right');
const keySquare = (m) => SPEC[m].keylines.square[0];
/** An arrow's length along its own direction (a left/right arrow's width, an up/down arrow's height); its head's long side. */
const arrowLen = (r) => (/arrow-(left|right)$/.test(freeArrowOf(r.n)) ? r.modBox.w : r.modBox.h);
const headLong = (r) => { const b = inkBox(headOf(r), r.stroke); return Math.max(b.w, b.h); };
/** Longest common substring of two strings (the pencil tip-and-band check). */
export function longestCommon(a, b) {
  let best = '', prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) if (a[i - 1] === b[j - 1]) { cur[j] = prev[j - 1] + 1; if (cur[j] > best.length) best = a.slice(i - cur[j], i); }
    prev = cur;
  }
  return best;
}
/** The tip string all of a group's pencil bodies share: the longest common substring, folded across the group. */
export const PENCIL_GROUPS = [['pencil', 'pencil-4', 'compose', 'compose-2', 'compose-3'], ['pencil-2', 'compose-4']];
export function sharedTip(set, group, m) {
  const body = (n) => { const f = set.get(m, n); return (/^compose/.test(n) ? f.paths[1] : f.paths[0]).d; };
  let tip = body(group[0]);
  for (const n of group.slice(1)) tip = longestCommon(tip, body(n));
  return { tip, carriers: [...set.names].filter((n) => /^(pencil|compose)(-\d+)?$/.test(n) && set.get(m, n).paths.some((p) => p.d.includes(tip))) };
}
/** The pencil's tip and band in a compose file: the band path string-identical to the pencil's, and the longest
 *  coordinate string the two body paths share (the tip). */
function tipAndBand(ctx, n, m) {
  const c = ctx.set.get(m, n), p = ctx.set.get(m, PENCIL_OF[n]);
  const band = c.paths.slice(1).map((x) => x.d).filter((d) => isStraight(d) && p.paths.some((q) => q.d === d));
  const tip = longestCommon(c.paths[1].d, p.paths[0].d);
  return { band: band.length > 0, tip };
}
function throughWhat(ctx, members) {
  const T = ctx.table(), n = members[0], free = freeArrowOf(n);
  const R = (m) => T[n][m];
  const headSame = (nn, m) => sameShape(headOf(T[nn][m]), ctx.set.get(m, freeArrowOf(nn)).paths.find((p) => isHead(p.d)).d);
  if (/^compose/.test(n)) {
    const note = n === 'compose' ? ` (its note: the body ${['6.36', '4.95', '4.24'].every((v) => noteHas(ctx, 'compose', 24, v)) ? 'says 6.36 · 4.95 · 4.24 shorter' : 'does not say 6.36 · 4.95 · 4.24'} — not re-measured)` : '';
    return note + members.map((x) => `${x}: ${PENCIL_OF[x]}'s tip and band, band path identical ${MASTERS.map((m) => (tipAndBand(ctx, x, m).band ? 'yes' : 'no')).join(' · ')}, shared tip string ${MASTERS.map((m) => `"${tipAndBand(ctx, x, m).tip.slice(0, 36)}…" (${tipAndBand(ctx, x, m).tip.length} ch)`).join(' · ')}`).join('; ');
  }
  const freeLen = MASTERS.map((m) => Math.max(inkLen(ctx.set, free, m).w, inkLen(ctx.set, free, m).h));
  const heads = MASTERS.map((m) => (members.every((x) => headSame(x, m)) ? 'yes' : 'no')).join(' · ');
  const whole = MASTERS.map((m) => (members.every((x) => sameShape(modD(T[x][m]), ctx.set.get(m, freeArrowOf(x)).paths.map((p) => p.d).join(''))) ? 'yes' : 'no')).join(' · ');
  const shaft = (m) => R(m).md.find((d) => isStraight(d));
  if (free === 'arrow-up-right') return `head = arrow-up-right's ${heads};${n === 'external-link-2' ? ` ${num(lineLength(shaft(24)) - lineLength(T['external-link'][24].md.find((d) => isStraight(d))))} longer than external-link's at 24;` : ''} shaft along the diagonal ${trio(MASTERS.map((m) => lineLength(shaft(m))), n3)} (2 dp ${trio(MASTERS.map((m) => lineLength(shaft(m))), fix2)}); the free arrow's shaft ${trio(MASTERS.map((m) => lineLength(ctx.set.get(m, free).paths.find((p) => isStraight(p.d)).d)), n3)} (2 dp ${trio(MASTERS.map((m) => lineLength(ctx.set.get(m, free).paths.find((p) => isStraight(p.d)).d)), fix2)})`;
  const len = MASTERS.map((m) => arrowLen(R(m)));
  const extra = n === 'export' ? `; shaft ${trio(MASTERS.map((m) => lineLength(shaft(m))))} (centreline)` : '';
  return `head = ${uniq(members.map(freeArrowOf)).join(' / ')}'s ${heads}; whole arrow = the free arrow ${whole}; arrow ${trio(len)} against the free ${trio(freeLen)} — shorter by ${trio(freeLen.map((L, i) => L - len[i]))}${extra}`;
}
function throughBase(ctx, members) {
  const T = ctx.table(), n = members[0];
  const R = (m) => T[n][m];
  const box = perMaster(members, (x, m) => wh(T[x][m].baseBox), String);
  if (/^(login|logout)/.test(n)) return `door ${box}, returns ${perMaster(members, (x, m) => T[x][m].baseBox.w)}`;
  if (/^upload/.test(n)) {
    const door = (m) => ctx.set.get(m, 'login').paths[0].d;
    const turned = MASTERS.map((m) => ([0, 1, 2, 3].some((k) => { let d = door(m); for (let i = 0; i < k; i++) d = turn90(d); return sameShape(d, R(m).bd[0]); }) ? 'yes' : 'no'));
    return `tray ${box}; returns ${perMaster(members, (x, m) => T[x][m].baseBox.h)}; corners r ${trio(MASTERS.map((m) => arcRadii(R(m).bd[0]).join('/')), String)}; login's door ${trio(MASTERS.map((m) => inkBox(door(m), R(m).stroke)), wh)}, corners r ${trio(MASTERS.map((m) => arcRadii(door(m)).join('/')), String)}; = login's door turned a quarter: ${turned.join(' · ')}`;
  }
  if (n === 'export') return `a closed card ${box}`;
  const under = MASTERS.map((m) => keySquare(m) - R(m).baseBox.w);
  const corner = MASTERS.map((m) => (R(m).baseBox.x0 === (m - keySquare(m)) / 2 && R(m).baseBox.y1 === m - (m - keySquare(m)) / 2 ? 'bottom-left' : 'not cornered'));
  return `box ${box} — ${trio(under)} under the square keyline ${trio(MASTERS.map(keySquare))}; ${uniq(corner).join('/')}`;
}
function throughOpening(ctx, members) {
  const T = ctx.table(), n = members[0];
  const op = perMaster(members, (x, m) => Math.max(...T[x][m].openings));
  if (n === 'export') return `notch ${op} = air ${trio(MASTERS.map((m) => T[n][m].air))} + shaft ${trio(MASTERS.map((m) => T[n][m].stroke))} + air`;
  if (/^compose/.test(n)) {
    const across = MASTERS.map((m) => Math.max(...T[n][m].openings) - 2 * T[n][m].air);
    const perp = MASTERS.map((m) => { const pts = T[n][m].md.flatMap(samples).map(([x, y]) => (x + y) / Math.SQRT2); return Math.max(...pts) - Math.min(...pts) + T[n][m].stroke; });
    return `the corner, ${op} across = pencil ink ${trio(across)} + 2 × air ${trio(MASTERS.map((m) => T[n][m].air))} (pencil ink across its axis, measured: ${trio(perp)})`;
  }
  return op;
}
function throughLoses(ctx, members) {
  const T = ctx.table(), n = members[0];
  if (n === 'export') return `${perMaster(members, (x, m) => Math.max(...T[x][m].openings))} of its top line`;
  if (/^(external-link|compose)/.test(n)) return `its corner; ${trio(MASTERS.map((m) => keySquare(m) - T[n][m].baseBox.w))} of size`;
  return '—';
}
function secS12(ctx) {
  const T = ctx.table();
  const names = ofKind(ctx, 'through');
  out(`## §1.2 Through — an arrow or a tool crossing the object (${names.length} concepts)`);
  out('| concept | base, ink | modifier, and what it is | modifier ink | share | air (px@16) | filled air | opening | what the base loses |');
  for (const [label, members] of THROUGH_ROWS) {
    row([label, throughBase(ctx, members), throughWhat(ctx, members),
      perMaster(members, (x, m) => wh(T[x][m].modBox), String),
      perMaster(members, (x, m) => fix2(T[x][m].share), String),
      `${perMaster(members, (x, m) => T[x][m].air)} (${perMaster(members, (x, m) => T[x][m].air * PX16[m])})`,
      perMaster(members, (x, m) => (T[x][m].filledAir === null ? T[x][m].fnote : T[x][m].filledAir)),
      throughOpening(ctx, members), throughLoses(ctx, members)]);
  }
  const g = throughAirGroups(ctx);
  out(`air at 3 dp, exactly ${g.exact.length ? g.exact[0].a.map((v) => v.toFixed(3)).join(' · ') : '—'} in ${g.exact.length} (${g.exact.map((x) => x.n).join(', ')})`);
  out(`${uniq(g.near.map((x) => x.a.map((v) => v.toFixed(3)).join(' · '))).join(' / ')} in ${g.near.length} (${g.near.map((x) => x.n).join(', ')}); their notes at 24 say 1.51 and 1.58: ${g.near.every((x) => noteHas(ctx, x.n, 24, '1.51') && noteHas(ctx, x.n, 24, '1.58')) ? 'all' : g.near.filter((x) => noteHas(ctx, x.n, 24, '1.51') && noteHas(ctx, x.n, 24, '1.58')).map((x) => x.n).join(', ')}`);
  out(`the other ${g.off.length} stand off: ${g.off.map((x) => `${x.n} ${x.a.map((v) => v.toFixed(3)).join(' · ')}`).join('; ')}`);
  const small = names.filter((n) => Math.max(T[n][24].baseBox.w, T[n][24].baseBox.h) < keySquare(24));
  out(`bases drawn under the square keyline's long side at 24: ${small.length} — ${small.join(', ')}`);
  // arrow lengths in composites at 24
  const straight = uniq(names.filter((n) => !/^compose|^external/.test(n)).concat(['sort-ascending', 'sort-descending']).map((n) => r2(/^sort/.test(n) ? T[n][24].modBox.h : arrowLen(T[n][24])))).sort((a, b) => b - a);
  out(`straight arrows in composites at 24: ${straight.length} lengths — ${straight.map(num).join(', ')}; diagonal shafts ${['external-link', 'external-link-2'].map((n) => n3(lineLength(T[n][24].md.find((d) => isStraight(d))))).join(' / ')} against arrow-up-right's ${n3(lineLength(ctx.set.get(24, 'arrow-up-right').paths.find((p) => isStraight(p.d)).d))}`);
  const door16 = arrowLen(T.login[16]), free16 = inkLen(ctx.set, 'arrow-right', 16).w;
  out(`the door arrow: ${num(arrowLen(T.login[24]))} at 24 (free ${num(inkLen(ctx.set, 'arrow-right', 24).w)}), ${num(door16)} at 16 = ${fix2(door16 / free16)} of arrow-right's ${num(free16)}; note "the wall and its 1.5 of air take 2.75": ${noteHas(ctx, 'login', 16, 'take 2.75') || noteHas(ctx, 'login', 24, 'take 2.75') ? 'present' : 'absent'}`);
}

// ── §1.3 strike ─────────────────────────────────────────────────────────────────────────────────────────────
function secS13(ctx) {
  const T = ctx.table(), set = ctx.set;
  const names = ofKind(ctx, 'strike');
  out(`## §1.3 Strike — the C21 bar (${names.length} concepts)`);
  out('| concept | base | bar, ink square (centreline length) | to bound | air to base | filled | what the base loses |');
  const bar = (n, m) => T[n][m].md.find((d) => isStraight(d)) ?? T[n][m].md[0];
  const rows = [['`ban`, `ban-2`', ['ban', 'ban-2']], ['`ban-3`', ['ban-3']], ['`volume-off`', ['volume-off']]];
  for (const [label, members] of rows) {
    const n = members[0];
    let base = `the ring ${trio(MASTERS.map((m) => T[n][m].baseBox.w))}`;
    if (n === 'volume-off') {
      const off = MASTERS.map((m) => { const r = C.congruentUpToTranslation(set.get(m, 'volume').paths[0].d, set.get(m, n).paths[0].d); return { same: r.same, dx: r.offset?.[0] ?? NaN, dev: r.maxDeviation }; });
      base = `volume's speaker moved ${trio(off.map((o) => o.dx))} right, residual ${trio(off.map((o) => o.dev))}`;
    }
    const square = n === 'volume-off' ? ` — the square keyline ${trio(MASTERS.map(keySquare))}` : '';
    let filled;
    if (n === 'ban') {
      filled = `ban: filled weight ${trio(MASTERS.map((m) => set.get(m, 'ban', true).stroke))}, air ${trio(MASTERS.map((m) => T.ban[m].filledAir))}; ban-2 cuts the bar ${trio(MASTERS.map((m) => slotWidth(set.get(m, 'ban-2', true))))} wide (perpendicular, 2 dp; C21/C18 name it the medium cut 2 · 1.75 · 1.75 — cited), its tip reaches ${trio(MASTERS.map((m) => slotReach(set.get(m, 'ban-2', true))))} from the centre, ${trio(MASTERS.map((m) => T.ban[m].baseBox.w / 2 - slotReach(set.get(m, 'ban-2', true))))} inside the rim (C21: 1.5 — cited)`;
    } else if (n === 'volume-off') {
      filled = `the bar outside the solid: air ${trio(MASTERS.map((m) => T[n][m].filledAir))}; channel between the two solids ${trio(MASTERS.map((m) => channel(set.get(m, n, true))), n3)}; the file's gap: note ${trio(MASTERS.map((m) => set.get(m, n, true).notes.gap ?? '—'), String)}`;
    } else filled = T[n][24].fnote;
    row([label, base, `${trio(MASTERS.map((m) => T[n][m].modBox.w))}${square} (${trio(MASTERS.map((m) => lineLength(bar(n, m))))}; 3 dp ${trio(MASTERS.map((m) => lineLength(bar(n, m))), n3)})`,
      trio(MASTERS.map((m) => T[n][m].toBound)), trio(MASTERS.map((m) => T[n][m].air)), filled, '—']);
  }
  out(`direction of the bar: ${names.map((n) => `${n} ${MASTERS.map((m) => { const p = G.parsePath(bar(n, m)); const [x0, y0] = p[0].args, [x1, y1] = p[p.length - 1].args.slice(-2); return (x1 - x0) * (y1 - y0) > 0 ? '\\' : '/'; }).join('')}`).join('; ')}`);
  const vo = MASTERS.map((m) => union(set.get(m, 'volume-off').paths.map((p) => inkBox(p.d, set.get(m, 'volume-off').stroke))));
  out(`volume-off ink x: ${MASTERS.map((m, i) => `${num(vo[i].x0)} → ${num(vo[i].x1)} (centre ${num((vo[i].x0 + vo[i].x1) / 2)} against ${m / 2}, ${num((vo[i].x0 + vo[i].x1) / 2 - m / 2)})`).join(' · ')}; its speaker ${trio(MASTERS.map((m) => T['volume-off'][m].baseBox.w))} wide`);
}
/** Width of a straight slot cut out of a solid: the distance between its two long parallel edges. */
export function slotWidth(f) {
  const sub = f.areas.flatMap(subs).find((s) => G.parsePath(s).filter((c) => c.cmd === 'L').length >= 2 && !/A[^L]*A[^L]*Z?$/.test(s.replace(/L.*$/, '')) && G.parsePath(s).length < 8);
  // the slot is two parallel straight edges joined by end arcs: the distance from the second edge's end to the first edge's line
  const lines = []; const cmds = G.parsePath(sub);
  let cur = null;
  for (const c of cmds) { const to = c.args.slice(-2); if (c.cmd === 'L') lines.push([cur, to]); cur = to; }
  const [a, b] = lines[0], [c] = lines[1];
  const ux = b[0] - a[0], uy = b[1] - a[1], L = Math.hypot(ux, uy);
  return Math.abs((c[0] - a[0]) * uy - (c[1] - a[1]) * ux) / L;
}
/** How far from the canvas centre the slot reaches: its farthest sampled point (the tip of its end arc). */
function slotReach(f) {
  const sub = f.areas.flatMap(subs).find((s) => /L/.test(s));
  const c = f.master / 2;
  return Math.max(...samples(sub).map(([x, y]) => Math.hypot(x - c, y - c)));
}
/** The narrowest white between two solids of one file (volume-off's channel). */
export function channel(f) {
  const parts = f.areas.flatMap(subs);
  let best = Infinity;
  for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) best = Math.min(best, minDist([parts[i]], [parts[j]]));
  return best;
}

// ── §1.4 enclosure ──────────────────────────────────────────────────────────────────────────────────────────
const ENCLOSURE_ROWS = [
  ['`checkbox`', ['checkbox'], 'wh'], ['`checkbox-2`', ['checkbox-2'], 'wh'], ['`checkbox-3`', ['checkbox-3'], 'wh'], ['`checkbox-4`', ['checkbox-4'], 'wh'],
  ['`alert-triangle`', ['alert-triangle'], 'wh'], ['`alert-triangle-2`', ['alert-triangle-2'], 'wh'], ['`alert-triangle-3`', ['alert-triangle-3'], 'wh'], ['`alert-triangle-4`', ['alert-triangle-4'], 'wh'],
  ['`alert-circle` / `-2`', ['alert-circle', 'alert-circle-2'], 'wh'], ['`alert-circle-3` / `-4`', ['alert-circle-3', 'alert-circle-4'], 'wh'],
  ['`help` / `-2` / `-3` / `-4`', ['help', 'help-2', 'help-3', 'help-4'], 'member'], ['`info` / `-2` / `-3`', ['info', 'info-2', 'info-3'], 'member'],
  ['`plus-circle` / `-small`, `minus-circle` / `-small`', ['plus-circle', 'plus-circle-small', 'minus-circle', 'minus-circle-small'], 'width'],
  ['`x-circle` / `-small`', ['x-circle', 'x-circle-small'], 'width'],
  ['`check-circle` / `-small`', ['check-circle', 'check-circle-small'], 'member'], ['`check-circle-3` / `-3-small`', ['check-circle-3', 'check-circle-3-small'], 'member'],
  ['`check-circle-4` / `-4-small`', ['check-circle-4', 'check-circle-4-small'], 'member'],
];
/** The "!" bar's ink length (centreline + stroke) of a glyph: its longest straight subpath. */
const bangBar = (ctx, n, m) => { const r = ctx.table()[n]?.[m] ?? null; const f = ctx.set.get(m, n); const ds = (r ? r.md : f.paths.slice(1).map((p) => p.d)).flatMap(subs).filter((d) => isStraight(d)); return Math.max(...ds.map(lineLength)) + f.stroke; };
function secS14(ctx) {
  const T = ctx.table();
  const names = ofKind(ctx, 'enclosure');
  out(`## §1.4 Enclosure — a mark inside a container (${names.length} concepts)`);
  const ck = MASTERS.map((m) => ({ box: T.checkbox[m].modBox.w, ring: T['check-circle'][m].modBox.w, same: sameShape(T.checkbox[m].md[0], T['check-circle'][m].md[0]), r: residual(T.checkbox[m].md[0], T['check-circle'][m].md[0]) }));
  out(`checkbox's check against check-circle's: same path ${ck.map((x) => (x.same ? 'yes' : 'no')).join(' · ')}; residual ${trio(ck.map((x) => x.r), n3)}; width ${trio(ck.map((x) => x.box))} against ${trio(ck.map((x) => x.ring))}`);
  out('| concept | mark w × h | air to container |');
  for (const [label, members, mode] of ENCLOSURE_ROWS) {
    const R = (n, m) => T[n][m];
    let mark, airv;
    if (mode === 'wh') { mark = perMaster(members, (n, m) => wh(R(n, m).modBox), String); airv = perMaster(members, (n, m) => R(n, m).air); }
    else if (mode === 'member') { mark = perMember(members, (n, m) => wh(R(n, m).modBox), String); airv = perMember(members, (n, m) => R(n, m).air); }
    else {
      const pairs = [[members[0], members[1]], ...(members.length > 2 ? [[members[2], members[3]]] : [])];
      const same = pairs.length < 2 || MASTERS.every((m) => r2(R(pairs[0][0], m).modBox.w) === r2(R(pairs[1][0], m).modBox.w) && r2(R(pairs[0][1], m).modBox.w) === r2(R(pairs[1][1], m).modBox.w));
      mark = `${perMember(pairs[0], (n, m) => R(n, m).modBox.w)} wide${pairs.length > 1 ? ` (the minus pair ${same ? 'the same' : perMember(pairs[1], (n, m) => R(n, m).modBox.w)})` : ''}`;
      airv = perMember(pairs[0], (n, m) => R(n, m).air) + (pairs.length > 1 ? ` (minus: ${perMember(pairs[1], (n, m) => R(n, m).air)})` : '');
    }
    if (members[0] === 'alert-triangle') mark += ` — the bar ${trio(MASTERS.map((m) => bangBar(ctx, 'alert-triangle', m)), n3)} against alert-circle's ${trio(MASTERS.map((m) => bangBar(ctx, 'alert-circle', m)), n3)}: cut back ${trio(MASTERS.map((m) => bangBar(ctx, 'alert-circle', m) - bangBar(ctx, 'alert-triangle', m)), n3)}`;
    row([label, mark, airv]);
  }
}

// ── §1.5 corner badge ───────────────────────────────────────────────────────────────────────────────────────
function secS15(ctx) {
  const T = ctx.table(), set = ctx.set;
  out('## §1.5 Corner badge — zero, and what is waiting on it');
  out(`concepts in the set: ${set.names.length}; corner badges among the ${KINDS.reduce((s, k) => s + ofKind(ctx, k).length, 0)} composites: 0 (a reading of every assembly — not a measure)`);
  const near = ['compose', 'compose-2', 'compose-3', 'compose-4', 'external-link', 'external-link-2'];
  const L = near.map((n) => Math.max(T[n][24].modBox.w, T[n][24].modBox.h)), S = near.map((n) => T[n][24].share);
  const inside = near.map((n) => { const a = T[n][24].modBox, b = T[n][24].baseBox; return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0; });
  out(`nearest by construction (compose ×4, external-link ×2): modifier ${num(Math.min(...L))}–${num(Math.max(...L))} at 24, ${Math.round(Math.min(...S) * 100)}–${Math.round(Math.max(...S) * 100)}% of its base; modifier box enters the base's box: ${inside.every(Boolean) ? 'all six' : inside.filter(Boolean).length}`);
  const vol = ['volume-plus', 'volume-minus', 'volume-x'];
  out(`nearest by size and placement: the volume marks ${perMaster(['volume-x'], (n, m) => T[n][m].modBox.w)} (dx ${num(T['volume-x'][24].dx)}, dy ${num(T['volume-x'][24].dy)}), air ${perMaster(vol, (n, m) => T[n][m].air)}`);
  const bell = MASTERS.map((m) => {
    const b1 = set.get(m, 'bell'), b2 = set.get(m, 'bell-2');
    const dot = b2.paths.map((p) => p.d).find((d) => G.isDot(d)), db = inkBox(dot, b2.stroke);
    const others = b2.paths.map((p) => p.d).filter((d) => d !== dot);
    return { d: db.w, cx: (db.x0 + db.x1) / 2, air: air([dot], others, b2.stroke), same: sameShape(b1.paths[0].d, b2.paths[0].d), r: residual(b1.paths[0].d, b2.paths[0].d),
      rim: inkBox(b1.paths[0].d, b1.stroke).y1 - inkBox(b2.paths[0].d, b2.stroke).y1 };
  });
  out(`bell-2's clapper: ⌀${trio(bell.map((b) => b.d))}, centre x ${trio(bell.map((b) => b.cx))} (canvas ${trio(MASTERS.map((m) => m / 2))}), ${trio(bell.map((b) => b.air))} below the rim; body = bell's ${bell.map((b) => (b.same ? 'yes' : 'no')).join(' · ')} (residual ${trio(bell.map((b) => b.r), (x) => (x === Infinity ? '∞' : n3(x)))}); rim raised against bell's by ${trio(bell.map((b) => b.rim))}`);
  const S2 = ctx.sheet();
  if (!S2) { out('the pin has no research/queue.md — the sheet census is skipped'); return; }
  out(`the sheet at the pin: ${S2.rows} rows; not approved ${S2.notApproved} (${S2.open} \`[ ]\`, ${S2.review.length} \`[~]\`${S2.review.length ? `: ${S2.review.map((r) => r.name).join(', ')}` : ''}); distinct unshipped names ${S2.pending.length}`);
  out(`the card's own grep (last word in CARD_GREP_WORDS) over the unshipped names: ${S2.grep.length} = ${S2.strike.length} strike · ${S2.enclosure.length} enclosure · ${S2.other.length} other`);
  out(`the badge row is DEFINITIONAL — the card's own selection (CARD_BADGE_ROWS, doc line 273; not a measure): ${CARD_BADGE_ROWS.length} names, ${S2.badge.length} of them unshipped rows at the pin, ${S2.badge.filter((r) => S2.other.some((o) => o.name === r.name)).length} among the grep's ${S2.other.length} other${S2.handMissing.length ? ` (not on the sheet: ${S2.handMissing.join(', ')})` : ''}; the selection leaves out ${S2.dropped.length} of the ${S2.other.length}: ${S2.dropped.map((r) => r.name).sort(cmp).join(', ')}`);
  out('| kind | unshipped rows | names |');
  row(['**corner badge** (object + action glyph)', `**at least ${S2.badge.length}** (the card's selection — definitional)`, S2.badge.map((r) => tick(r.name)).sort(cmp).join(', ')]);
  row(['strike (`-off`, `-closed`)', S2.strike.length, S2.strike.map((r) => tick(r.name)).sort(cmp).join(', ')]);
  row(['enclosure (`-circle`, `-square`)', S2.enclosure.length, S2.enclosure.map((r) => tick(r.name)).sort(cmp).join(', ')]);
  const grp = (re) => S2.enclosure.filter((r) => re.test(r.name)).length;
  out(`of the enclosure rows: arrow-*-circle ${grp(/^arrow-.*-circle$/)}, chevron-*-circle ${grp(/^chevron-.*-circle$/)}`);
  out('the by-hand second list ("about twenty" objects used as a badge, "a dozen" side by side) is a reading — not reprinted');
  const us = ctx.sheetRows().find((r) => r.name === 'user-search');
  out(`user-search on the sheet: ${us ? `row ${us.row} (\`[${us.status}]\`)` : 'no'}`);
}

// ── §1.6 docs/05 against the set ────────────────────────────────────────────────────────────────────────────
function secS16(ctx) {
  const T = ctx.table();
  out('## §1.6 What `docs/05-modifiers.md` prescribes against what is drawn');
  out(`beside marks (volume): ${perMaster(['volume-plus', 'volume-x'], (n, m) => T[n][m].modBox.w)} ink — docs/05's glyph 8 at 24, 5.5 at 16 (cited)`);
  const ring = ['plus-circle', 'plus-circle-small', 'minus-circle', 'minus-circle-small'];
  out(`ring marks (plus/minus-circle, default and small): ${MASTERS.map((m) => { const v = ring.map((n) => T[n][m].modBox.w); return `${num(Math.min(...v))}–${num(Math.max(...v))}`; }).join(' · ')}`);
  const g = throughAirGroups(ctx);
  out(`clearance where a modifier meets its base, through kind: ${g.exact[0].a.map((v) => v.toFixed(3)).join(' · ')} (MIN_GAP literal; the 16 stroke is ${strokeOf(16)})`);
  out(`channels drawn: ban-2's filled cut ${trio(MASTERS.map((m) => slotWidth(ctx.set.get(m, 'ban-2', true))))} (C21/C18's medium cut 2 · 1.75 · 1.75 — cited); volume-off's ${trio(MASTERS.map((m) => channel(ctx.set.get(m, 'volume-off', true))), n3)}`);
  const shrunk = ofKind(ctx, 'through').filter((n) => Math.max(T[n][24].baseBox.w, T[n][24].baseBox.h) < keySquare(24));
  out(`bases shrunk and cornered (strategy C): ${shrunk.length} — ${shrunk.join(', ')}`);
  const AH = arrowheadCarriers(ctx);
  out(`concepts carrying an arrow-<dir> or arrow-up-right head exactly: ${AH.all.length} — less the sort family's ${AH.sortFam.length} and refresh-3 (one object): ${AH.composites.length}`);
  const S2 = ctx.sheet();
  if (!S2) return;
  const per = Object.entries(S2.perBase).sort((a, b) => cmp(a[0], b[0]));
  const one = per.filter(([, v]) => v.length === 1), two = per.filter(([, v]) => v.length === 2), more = per.filter(([, v]) => v.length >= 3);
  out(`docs/05's entry test over the ${S2.badge.length} selected + ${S2.strike.length} strike rows (built on the card's selection — definitional): ${per.length} bases; ${one.length} queued with exactly one (${one.map(([b]) => tick(b)).join(', ')}), ${two.length} with two (${two.map(([b]) => tick(b)).join(', ')}), ${more.length} pass — ${more.map(([b, v]) => `${tick(b)} ${v.length}`).join(', ')}`);
  const us = ctx.sheetRows().find((r) => r.name === 'user-search');
  out(`\`user-search\` on the sheet: ${us ? `row ${us.row}` : 'no'}`);
}

/** The composites whose arrowhead (or chevron) is none of the free arrows' heads (arrow-up/down/left/right, arrow-up-right)
 *  at any master: every bent two-leg part of a beside or through modifier compared by canonical shape. */
const FREE_ARROWS = ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up-right'];
export function narrowHeadCarriers(set, T, names, freeArrows = FREE_ARROWS) {
  const free = (m) => freeArrows.flatMap((n) => set.get(m, n).paths.filter((p) => isHead(p.d)).map((p) => p.d));
  // an arrow in a composite: a head with a straight shaft landing on it (the card's arrow selector)
  const arrows = names.filter((n) => MASTERS.every((m) => { const f = set.get(m, n); return SELECT.arrow(f).mod.some((i) => isStraight(f.paths[i].d)); }));
  const own = (n, m) => T[n][m].md.filter((d) => isHead(d)).filter((d) => !free(m).some((h) => sameShape(d, h)));
  const ownArrows = arrows.filter((n) => MASTERS.every((m) => own(n, m).length));
  // and a composite whose bent parts are those same heads (sort-3's chevrons)
  const heads = (m) => ownArrows.flatMap((n) => own(n, m));
  const alike = names.filter((n) => !ownArrows.includes(n) && MASTERS.every((m) => { const b = T[n][m].md.filter((d) => isHead(d)); return b.length && b.every((d) => heads(m).some((h) => sameShape(d, h))); }));
  return [...ownArrows, ...alike].sort(cmp);
}
/** Card 1.1 §2.7's arrowhead table: the refresh / rotate-ccw family's heads (legs 4.250 · 4.257 · 3.507) are carried by
 *  5 + 6 + 1 = 12 concepts. CITED from docs/audit/findings-primitives.md §2.7, not measured here. */
export const CITED_ROTATE_REFRESH = 12;
/** Concepts outside the arrow families carrying an arrow-<dir> or arrow-up-right head exactly at some master (from the
 *  cross-family classes), and the composites among them: less the sort family (its own grammar, §1.1) and refresh-3 (a
 *  circular arrow is one object, placed in no kind — the document's §0). */
function arrowheadCarriers(ctx) {
  const D = derivedComposites(ctx.partA());
  const all = Object.keys(D).filter((c) => MASTERS.some((m) => (D[c][m] ?? []).some((x) => x.stems.some((s) => s === 'arrow' || s === 'arrow-up-right')))).sort(cmp);
  const composites = all.filter((n) => stemOf(n) !== 'sort' && n !== 'refresh-3');
  return { D, all, sortFam: all.filter((n) => stemOf(n) === 'sort'), composites };
}
// ── §1.8 mark sizes ─────────────────────────────────────────────────────────────────────────────────────────
const inkLong = (ctx, n, m) => { const b = inkLen(ctx.set, n, m); return Math.max(b.w, b.h); };
function plusSizes(ctx) {
  const T = ctx.table();
  const o = {};
  for (const m of MASTERS) {
    o[m] = [...['plus-small', 'plus', 'plus-large'].map((n) => ({ where: n, size: inkLong(ctx, n, m) })),
      ...['plus-circle', 'plus-circle-small'].map((n) => ({ where: n, size: T[n][m].modBox.w })),
      { where: 'volume-plus', size: T['volume-plus'][m].modBox.w }];
  }
  return o;
}
function secS18(ctx) {
  const T = ctx.table(), set = ctx.set;
  out('## §1.8 The mark sizes in play — one plus, or six?');
  out('| mark | free (small · default · large) | inside a ring (default / small) | beside an object | through / in a box |');
  const free = (stem, m) => ['-small', '', '-large'].map((s) => inkLong(ctx, stem + s, m));
  for (const m of MASTERS) row([`plus @${m}`, trio(free('plus', m)), `${num(T['plus-circle'][m].modBox.w)} / ${num(T['plus-circle-small'][m].modBox.w)}`, `**${num(T['volume-plus'][m].modBox.w)}** (\`volume-plus\`)`, '—']);
  for (const m of MASTERS) {
    const xs = num(T['x-circle-small'][m].modBox.w), vx = num(T['volume-x'][m].modBox.w);
    row([`x @${m}`, trio(free('x', m).map((v, i) => (i === 1 ? inkLen(set, 'x', m).w : inkLen(set, ['x-small', 'x', 'x-large'][i], m).w))), `${num(T['x-circle'][m].modBox.w)} / ${xs}`, `${vx}${vx === xs ? ' = the small ring\'s' : ''}`, '—']);
  }
  const cw = (n, m) => inkLen(set, n, m).w;
  row(['check width @24 · 20 · 16', MASTERS.map((m) => `${num(cw('check-small', m))} · ${num(cw('check', m))}`).join(' / '),
    MASTERS.map((m) => `${num(T['check-circle'][m].modBox.w)} / ${num(T['check-circle-small'][m].modBox.w)}`).join(' · '), '—', `in \`checkbox\`: ${trio(MASTERS.map((m) => T.checkbox[m].modBox.w))}`]);
  const head = (n, m) => inkBox(headOf(T[n][m]), T[n][m].stroke).w;
  const freeHead = (n, m) => { const f = set.get(m, n); return inkBox(f.paths.find((p) => isHead(p.d)).d, f.stroke); };
  for (const m of MASTERS) {
    const aur = inkLen(set, 'arrow-up-right', m), aurShaft = lineLength(set.get(m, 'arrow-up-right').paths.find((p) => isStraight(p.d)).d);
    const throughLens = ['login', 'export', 'upload-2', 'login-2'].map((n) => num(arrowLen(T[n][m])));
    const headsThrough = uniq(['login', 'export', 'upload-2', 'login-2'].map((n) => num(headLong(T[n][m]))));
    row([`arrow length @${m} (head)`, `${num(inkLong(ctx, 'arrow-up', m))} (${num(freeHead('arrow-up', m).w)}); \`arrow-up-right\` box ${num(aur.w)} (head ${num(freeHead('arrow-up-right', m).w)}), shaft ${fix2(aurShaft)}`, '—',
      `\`sort*\` ${num(T['sort-ascending'][m].modBox.h)} (${num(head('sort-ascending', m))}); \`sort-alpha/numeric\` ${num(T['sort-alpha-ascending'][m].modBox.h)} (**${num(head('sort-alpha-ascending', m))}**)`,
      `door / tray, \`export\`, \`upload-2\`, deep door: ${throughLens.join(', ')} (head ${headsThrough.join('/')}); diagonal: \`external-link\` box ${num(T['external-link'][m].modBox.w)}, \`external-link-2\` ${num(T['external-link-2'][m].modBox.w)}, shafts ${['external-link', 'external-link-2'].map((n) => fix2(lineLength(T[n][m].md.find((d) => isStraight(d))))).join(' / ')} (3 dp ${['external-link', 'external-link-2'].map((n) => n3(lineLength(T[n][m].md.find((d) => isStraight(d))))).join(' / ')})`]);
  }
  const sideH = (n) => inkLen(set, n, 24).h;
  const code2 = set.get(24, 'code-2'); const c2h = Math.max(...code2.paths.filter((p) => isHead(p.d)).map((p) => inkBox(p.d, code2.stroke).h));
  const s3 = T['sort-3'][24].md.map((d) => inkBox(d, T['sort-3'][24].stroke));
  row(['chevron (height of a side chevron) @24', trio(['chevron-left-small', 'chevron-left', 'chevron-left-large'].map(sideH)), '—',
    `\`menu-arrow\` ${num(T['menu-arrow-left'][24].modBox.h)}, \`code\` ${num(Math.max(...T.code[24].md.map((d) => inkBox(d, T.code[24].stroke).h)))}, \`code-2\` ${num(c2h)} (= arrow head), \`sort-3\` ${uniq(s3.map((b) => `${num(b.w)}×${num(b.h)}`)).join(', ')}`, '—']);
  row(['the C21 bar, ink square @24 · 20 · 16', '—', `\`ban\` ${trio(MASTERS.map((m) => T.ban[m].modBox.w))}, \`ban-3\` ${trio(MASTERS.map((m) => T['ban-3'][m].modBox.w))}`, '—', `\`volume-off\` ${trio(MASTERS.map((m) => T['volume-off'][m].modBox.w))}`]);
  row(['the "!" bar @24 · 20 · 16', '—', `\`alert-circle\` ${trio(MASTERS.map((m) => bangBar(ctx, 'alert-circle', m)))}`, '—', `\`alert-triangle\` ${trio(MASTERS.map((m) => bangBar(ctx, 'alert-triangle', m)), n3)}`]);
  const star = (n, m) => { const f = set.get(m, n); return starPart(f)[0].box.w; };
  row(['the companion star', '—', '—', ['wand', 'sparkle-2', 'sparkle-3', 'sparkle-4'].map((n) => `\`${n}\` ${trio(MASTERS.map((m) => star(n, m)))}`).join('; '), '—']);
  const p24 = uniq(plusSizes(ctx)[24].map((x) => r2(x.size))).sort((a, b) => b - a);
  const own = plusSizes(ctx)[24].filter((x) => plusSizes(ctx)[24].filter((y) => r2(y.size) === r2(x.size)).length === 1).map((x) => x.where);
  out(`plus sizes at 24: ${p24.length} — ${p24.map(num).join(', ')}; a size only one icon draws: ${own.join(', ')}`);
  const medium = MASTERS.map((m) => headLong(T.login[m])), narrow = MASTERS.map((m) => head('sort-alpha-ascending', m));
  const narrowCarriers = narrowHeadCarriers(ctx.set, ctx.table(), [...ofKind(ctx, 'beside'), ...ofKind(ctx, 'through')]);
  out(`heads in composites: medium ${trio(medium)}, narrow ${trio(narrow)} in ${narrowCarriers.length} (${narrowCarriers.join(', ')}); the rotate/refresh family's legs (4.25 · 4.257 · 3.507) and its ${CITED_ROTATE_REFRESH} concepts are card 1.1 §2.7's — cited; C16 broken by ${narrowCarriers.length} measured + ${CITED_ROTATE_REFRESH} cited = ${narrowCarriers.length + CITED_ROTATE_REFRESH} concepts`);
}

// ── §2.1 families ───────────────────────────────────────────────────────────────────────────────────────────
const CATS = [['all', 'one drawing in every member at all three masters'], ['allButOne', 'one drawing in all but one member at all three masters'],
  ['twoWays', 'split two ways by design (two bodies, each shared)'], ['allDiff', 'a different drawing in every member at every master (C5 numbered variants)'],
  ['rest', 'partly shared — and the sharing changes with the master']];
function secS21(ctx) {
  const set = ctx.set, census = ctx.census();
  out('## §2.1 Families, counted');
  const fams = familiesOf(set.names);
  const multi = [...fams.values()].filter((v) => v.length >= 2), single = [...fams.values()].filter((v) => v.length === 1);
  const marks = census.filter((f) => MARK_STEMS.has(f.stem)), obj = census.filter((f) => !MARK_STEMS.has(f.stem));
  out(`${set.names.length} concepts → ${fams.size} object stems: ${multi.length} families of two or more and ${single.length} singletons; ${marks.length} mark families (${marks.map((f) => f.stem).join(', ')}); ${obj.length} object families, ${obj.reduce((s, f) => s + f.n, 0)} concepts`);
  out(`body classify: translation, tol ${0.01}, near band ${MASTERS.map((m) => r3(0.5 * m / 24)).join(' · ')}`);
  const table = (opts) => {
    out('| the body is… | families | concepts | who |');
    for (const [k, label] of CATS) {
      const list = obj.filter((f) => categorise(f, opts) === k);
      const pairs = list.filter((f) => f.n === 2).length;
      const split = (f) => uniq(MASTERS.map((m) => f.m[m].groups.map((g) => g.length).sort((a, b) => b - a).join(' + '))).join(' / ');
      row([label, list.length, list.reduce((s, f) => s + f.n, 0), `${list.map((f) => `\`${f.stem}\` ${k === 'twoWays' ? split(f) : f.n}`).join(', ')}${pairs ? ` — of them pairs: ${pairs}` : ''}`]);
    }
  };
  out('by the card\'s own code (verify.mjs order: "all but one" before "different in every member"):');
  table({});
  const moved = obj.filter((f) => categorise(f) !== categorise(f, { pairsAsDifferent: true }));
  out(`as the document's table has them — the ${moved.length} two-member families with two different bodies moved by hand to "different in every member":`);
  table({ pairsAsDifferent: true });
}

// ── §2.2 bodies nearly shared ───────────────────────────────────────────────────────────────────────────────
/** PARAMETER — the 14 rows §2.2 lists, as [a, b] in its order. */
export const NEAR_ROWS = [['cart-3', 'cart'], ['sliders-3', 'sliders'], ['microphone', 'microphone-2'], ['paintbrush-3', 'paintbrush-7'], ['paintbrush-2', 'paintbrush-3'],
  ['text-4', 'text'], ['clipboard', 'clipboard-2'], ['database', 'database-2'], ['grid', 'grid-7'], ['key-2', 'key-3'], ['pencil-3', 'pencil-4'], ['book', 'book-4'],
  ['list-bullet-2', 'list-bullet'], ['users-3', 'users-3-wide']];
function bodyNearAll(ctx) {
  const all = [];
  for (const f of ctx.census()) { if (MARK_STEMS.has(f.stem)) continue; for (const m of MASTERS) for (const x of f.m[m].bodyNear) all.push({ ...x, m, stem: f.stem }); }
  return all;
}
function secS22(ctx) {
  const set = ctx.set;
  out('## §2.2 Bodies that are nearly shared — intent or accident, by tag');
  out('| pair | master | residual (px@16) | what the tags say | bodies identical at |');
  const all = bodyNearAll(ctx);
  const key = (a, b) => [a, b].sort(cmp).join('~');
  for (const [a, b] of NEAR_ROWS) {
    const hits = all.filter((x) => key(x.a, x.b) === key(a, b));
    const famOf = ctx.census().find((f) => f.members.includes(a) && f.members.includes(b));
    const ident = famOf ? MASTERS.filter((m) => famOf.m[m].groups.some((g) => g.includes(a) && g.includes(b))) : [];
    let extra = '';
    if (a === 'paintbrush-2' && b === 'paintbrush-3') {
      const pb = set.get(16, 'paintbrush-2'), pb5 = set.get(16, 'paintbrush-5'), h2 = partsOf(pb), h5 = partsOf(pb5);
      extra = `; paintbrush-2 ~ paintbrush-5 @16 is handle to handle (subpath ${h2[0].pi}.${h2[0].si}, ${wh(h2[0].box)}): raw ${n3(residualRaw(h2[0].d, h5[0].d))}, canonical ${n3(residual(h2[0].d, h5[0].d))}; their ${wh(bodyOf(pb).box)} bodies: ${residual(bodyOf(pb).d, bodyOf(pb5).d) === Infinity ? 'no match' : n3(residual(bodyOf(pb).d, bodyOf(pb5).d))}`;
    }
    row([`\`${a}\` ~ \`${b}\``, hits.map((x) => x.m).join(' / ') || '—', hits.map((x) => `${n3(x.r)} (${n3(x.r * PX16[x.m])})`).join(' / ') || '—',
      `*${set.get(24, a).notes.tags ?? ''}* vs *${set.get(24, b).notes.tags ?? ''}*`, `${ident.join(', ') || '—'}${extra}`]);
  }
  const listed = new Set(NEAR_ROWS.map(([a, b]) => key(a, b)));
  const left = all.filter((x) => !listed.has(key(x.a, x.b)));
  out(`body near misses in the 96 families: ${all.length} at pair×master; those of pairs the table does not list: ${left.map((x) => `${x.a}~${x.b} @${x.m} ${n3(x.r)}`).join('; ') || 'none'}`);
  const census = ctx.census(), fam = (s) => census.find((f) => f.stem === s);
  const same = (s, a, b) => MASTERS.filter((m) => fam(s).m[m].groups.some((g) => g.includes(a) && g.includes(b)));
  out(`cart and cart-3 bodies identical at ${same('cart', 'cart', 'cart-3').join(', ')}; sliders' knob one drawing in ${['sliders', 'sliders-3', 'sliders-5'].length} concepts (sliders, -3, -5) at ${MASTERS.filter((m) => fam('sliders').m[m].groups.some((g) => ['sliders', 'sliders-3', 'sliders-5'].every((x) => g.includes(x)))).join(', ')}, at 20 ${wh(fam('sliders').m[20].bodySize['sliders-3'])} against ${wh(fam('sliders').m[20].bodySize.sliders)}`);
  const mic = MASTERS.map((m) => { const a = set.get(m, 'microphone'), b = set.get(m, 'microphone-2'); return { cradle: residual(bodyOf(a).d, bodyOf(b).d), capsule: residual(a.paths[0].d, b.paths[0].d) }; });
  out(`microphone ~ microphone-2: cradle ${trio(mic.map((x) => x.cradle), n3)}; capsule ${trio(mic.map((x) => x.capsule), n3)}`);
  const pb = set.get(16, 'paintbrush-2'), pb5 = set.get(16, 'paintbrush-5');
  const h2 = partsOf(pb), h5 = partsOf(pb5);
  out(`paintbrush-2 ~ paintbrush-5 @16: handle (subpath ${h2[0].pi}.${h2[0].si}, ${wh(h2[0].box)}) raw ${n3(residualRaw(h2[0].d, h5[0].d))}, canonical ${n3(residual(h2[0].d, h5[0].d))}; bodies ${wh(bodyOf(pb).box)}: ${residual(bodyOf(pb).d, bodyOf(pb5).d) === Infinity ? 'no match' : n3(residual(bodyOf(pb).d, bodyOf(pb5).d))}`);
  out(`paintbrush-3 ~ paintbrush-7 @24: ${n3(residual(bodyOf(set.get(24, 'paintbrush-3')).d, bodyOf(set.get(24, 'paintbrush-7')).d))}`);
  out(`database's cylinder, database-2's against database's height: ${MASTERS.map((m) => num(fam('database').m[m].bodySize.database.h - fam('database').m[m].bodySize['database-2'].h)).join(' · ')}`);
  out(`text-4 and text bodies identical at ${same('text', 'text', 'text-4').join(', ')}`);
}

// ── §2.3 shared parts that break ────────────────────────────────────────────────────────────────────────────
/** PARAMETER — the part selectors of §2.3 (card 1.9's probes): which subpath of which concepts is "the part". */
const doorPart = (f) => partsOf(f).filter((p) => /A/.test(p.d) && p.box.w <= 7 && p.box.h <= 8 && p.box.w >= 3);
/** The four-point star: a raw path spelled M + 7 L + Z (card 1.9's probe3 read the raw `d`; subpathsOfPath writes the
 *  closing L out, so the same star reads M + 8 L + Z there). The largest one (sparkle-3 carries two). */
const isStar = (d) => /^ML{7}Z$/.test(G.parsePath(d).map((c) => c.cmd).join(''));
const starPart = (f) => f.paths.map((p, pi) => ({ id: `${f.name}#${pi}`, d: p.d, pi, si: 0, box: inkBox(p.d, f.stroke) })).filter((p) => isStar(p.d)).sort((a, b) => b.box.w - a.box.w).slice(0, 1);
export const PARTS = [
  { label: 'the door', key: 'door', concepts: ['home', 'home-2', 'store', 'store-2', 'building', 'building-2'], pick: doorPart },
  { label: 'the companion star', key: 'star', concepts: ['sparkle-2', 'sparkle-3', 'wand'], pick: starPart },
  { label: 'the check in a box and in a ring', key: 'check', pairs: [['checkbox', 'check-circle'], ['checkbox-2', 'check-circle-3'], ['checkbox-3', 'check-circle-4'], ['checkbox-4', 'check-circle-small']], pick: (f) => partsOf(f).slice(1) },
  { label: 'the slider knob', key: 'knob', concepts: ['sliders', 'sliders-3', 'sliders-5'], pick: (f) => [bodyOf(f)] },
  { label: "the cart's hook and post", key: 'hook', concepts: ['cart', 'cart-3'], pick: (f) => [bodyOf(f)] },
  { label: 'the microphone cradle', key: 'cradle', concepts: ['microphone', 'microphone-2', 'microphone-5'], pick: (f) => [bodyOf(f)] },
  { label: 'the lock shackle', key: 'shackle', concepts: ['lock-3', 'lock-5'], pick: (f) => partsOf(f).filter((p) => p.pi === 1) },
  { label: 'the diagonal arrowhead', key: 'arrowhead', concepts: ['refresh-3', 'arrow-up-right'], pick: (f) => partsOf(f).filter((p) => isHead(p.d) || /^MLAL$/.test(G.parsePath(p.d).map((c) => c.cmd).join(''))) },
  { label: 'the landscape container', key: 'container', concepts: ['credit-card', 'credit-card-2', 'credit-card-3', 'desktop-5', 'image-3', 'mail', 'mail-2', 'wallet-2', 'presentation-2', 'keyboard', 'keyboard-2'], pick: (f) => [partsOf(f)[0]] },
];
/** For one part at one master: every carrier's part, and pairwise sameness / residual (canonical). */
function partAt(ctx, P, m) {
  const pairs = P.pairs ?? null;
  const concepts = pairs ? pairs.flat() : P.concepts;
  const part = Object.fromEntries(concepts.map((n) => { const f = ctx.set.get(m, n); return [n, f ? P.pick(f) : []]; }));
  const best = (a, b) => { let r = Infinity; for (const x of part[a]) for (const y of part[b]) r = Math.min(r, residual(x.d, y.d)); return r; };
  const groups = [];
  for (const n of concepts) { const g = groups.find((gr) => best(gr[0], n) === 0); if (g) g.push(n); else groups.push([n]); }
  return { part, best, groups, pairs };
}
/** A pair of carriers "breaks" when its part is one drawing at one master (residual 0) and not at another; the concepts
 *  counted are every concept in a broken pair (the probe's one rule for §2.3's count). */
export function brokenConcepts(pairs) {
  const broken = pairs.filter((p) => p.r.some((x) => x === 0) && p.r.some((x) => x !== 0));
  return { broken, involved: uniq(broken.flatMap((p) => [p.a, p.b])).sort(cmp) };
}
function sharedPartsBreaking(ctx) {
  const res = [];
  for (const P of PARTS) {
    const at = Object.fromEntries(MASTERS.map((m) => [m, partAt(ctx, P, m)]));
    const concepts = P.pairs ? P.pairs.flat() : P.concepts;
    const pairList = P.pairs ?? concepts.flatMap((a, i) => concepts.slice(i + 1).map((b) => [a, b]));
    const pr = pairList.map(([a, b]) => ({ a, b, r: MASTERS.map((m) => at[m].best(a, b)) }));
    const { broken, involved } = brokenConcepts(pr);
    // what the table's cells show: each off carrier against the master's main drawing (a check pair against its partner)
    const offs = MASTERS.flatMap((m) => {
      if (P.pairs) return P.pairs.map(([a, b]) => ({ r: at[m].best(a, b), m, a, b }));
      const main = [...at[m].groups].sort((x, y) => y.length - x.length)[0];
      return concepts.filter((n) => !main.includes(n)).map((n) => ({ r: at[m].best(main[0], n), m, a: main[0], b: n }));
    }).filter((x) => x.r !== 0 && x.r !== Infinity);
    res.push({ label: P.label, key: P.key, at, pr, broken, involved, offs });
  }
  return res;
}
function partCell(ctx, P, R, m) {
  const at = R.at[m];
  const size = (n) => (at.part[n][0] ? wh(at.part[n][0].box) : '—');
  if (P.pairs) {
    const r = P.pairs.map(([a, b]) => at.best(a, b));
    const off = r.filter((x) => x !== 0);
    return off.length ? `${off.length} of ${r.length} off: ${off.map(n3).join(', ')}` : `${r.length} of ${r.length} exact`;
  }
  const main = [...at.groups].sort((a, b) => b.length - a.length)[0];
  const fams = uniq(main.map(stemOf)).length;
  const others = P.concepts.filter((n) => !main.includes(n));
  const rest = others.map((n) => `${n} ${at.best(main[0], n) === Infinity ? 'no match' : `${n3(at.best(main[0], n))} off`} (${size(n)})`);
  return `one drawing in ${main.length} (${fams} famil${fams === 1 ? 'y' : 'ies'}): ${main.join(', ')} (${size(main[0])})${rest.length ? `; ${rest.join('; ')}` : ''}`;
}
function secS23(ctx) {
  out('## §2.3 Shared parts that break at one master — the finding this card adds');
  out('| the part | 24 | 20 | 16 |');
  const all = sharedPartsBreaking(ctx);
  for (const R of all) {
    const P = PARTS.find((p) => p.key === R.key);
    row([`**${R.label}**`, ...MASTERS.map((m) => partCell(ctx, P, R, m))]);
  }
  const brf = ctx.set.get(24, 'briefcase') ? MASTERS.map((m) => residual(bodyOf(ctx.set.get(m, 'briefcase')).d, ctx.set.get(m, 'credit-card').paths[0].d)) : [];
  out(`briefcase's body against the landscape frame: ${trio(brf, n3)} (stands off at every master — not counted)`);
  out(`parts: ${all.length}; concepts in a pair identical at one master and not at another: ${all.map((R) => `${R.key} ${R.involved.length}`).join(' + ')} = ${all.reduce((s, R) => s + R.involved.length, 0)}; agreeing at all three masters: ${all.filter((R) => !R.broken.length).length}`);
  const offs = all.flatMap((R) => R.offs.map((o) => ({ ...o, key: R.key })));
  const ranked = uniq(offs.map((o) => `${n3(o.r)}@${o.m}`)).map((k) => { const [r, m] = k.split('@').map(Number); return { r, m, who: uniq(offs.filter((o) => n3(o.r) === n3(r) && o.m === m).map((o) => o.key)) }; }).sort((a, b) => b.r - a.r);
  out(`residuals off against the master's main drawing, largest first (u @master → px@16, 2 dp): ${ranked.map((x) => `${n3(x.r)} @${x.m} → ${fix2(x.r * PX16[x.m])} (${x.who.join('/')})`).join('; ')}`);
  const bp = bodyPairsAtSomeMasters(ctx.census());
  out(`body pairs one drawing at some masters, not all three: ${bp.length} — ${bp.map((p) => `${p.a}/${p.b} @${p.at.join('+')}`).join(', ')}`);
}

// ── §2.4 cross-family reuse ─────────────────────────────────────────────────────────────────────────────────
function classOf(A, m, concept, pick) {
  const it = [...A[m].byId.values()].find((i) => i.concept === concept && pick(i));
  return it ? A[m].classes.find((c) => c.members.includes(it.id)) : null;
}
function secS24(ctx) {
  const set = ctx.set, A = ctx.partA(), T = ctx.table();
  out('## §2.4 Cross-family reuse — what one object takes from another');
  out('| object | where it recurs | one drawing? |');
  // the speaker
  const vol = ['volume', 'volume-low', 'volume-none', 'volume-x', 'volume-plus', 'volume-minus', 'volume-off'];
  const sp = MASTERS.map((m) => vol.map((n) => { const r = C.congruentUpToTranslation(set.get(m, 'volume').paths[0].d, set.get(m, n).paths[0].d); return { same: r.same, dx: r.offset?.[0] ?? 0, dev: r.maxDeviation }; }));
  row(['**the speaker**', vol.map(tick).join(', '), `${MASTERS.map((m, i) => `${sp[i].filter((x) => x.same).length} of ${vol.length}`).join(' · ')}, residual ${trio(MASTERS.map((m, i) => Math.max(...sp[i].map((x) => x.dev))))}; volume-off's translated ${trio(MASTERS.map((m, i) => sp[i][6].dx))}`]);
  // the pencil
  const pen = MASTERS.map((m) => Object.keys(PENCIL_OF).map((n) => `${n}←${PENCIL_OF[n]} ${tipAndBand(ctx, n, m).band && tipAndBand(ctx, n, m).tip.length >= 30 ? 'yes' : 'no'}`).join(', '));
  const tips = MASTERS.map((m) => PENCIL_GROUPS.map((g) => sharedTip(set, g, m)));
  const t1 = tips.map((t) => t[0].carriers.length), t2 = tips.map((t) => t[1].carriers.length);
  row(['**the pencil\'s tip and band**', 'pencil, pencil-4, compose, -2, -3; pencil-2, compose-4', `string-shared tip and identical band: ${pen.join(' | ')}; files carrying the group's common tip string ${MASTERS.map((m, i) => `${t1[i]} + ${t2[i]}`).join(' · ')} (${MASTERS.map((m, i) => `"${tips[i][0].tip.slice(0, 40)}…"`).join(' · ')}); whole pencil path the same: ${MASTERS.map((m) => (sameShape(set.get(m, 'compose').paths[1].d, set.get(m, 'pencil-4').paths[0].d) ? 'yes' : 'no')).join(' · ')}`]);
  // the arrowhead
  const { D, composites: sixteen } = arrowheadCarriers(ctx);
  row(['**the arrowhead**', `${sixteen.length} composites (${groupNames(sixteen)})`, `exact at ${MASTERS.map((m) => sixteen.filter((n) => (D[n][m] ?? []).length).length).join(' · ')} of ${sixteen.length}; the narrow head in the ${['sort-3', 'sort-alpha-ascending', 'sort-alpha-descending', 'sort-numeric-ascending', 'sort-numeric-descending'].length} sort arrows: ${MASTERS.map((m) => (sameShape(headOf(T['sort-alpha-ascending'][m]), set.get(m, 'arrow-up').paths.find((p) => isHead(p.d)).d) ? 'arrow-up\'s' : 'own')).join(' · ')}`]);
  // the square and the landscape container
  const sq = classOf(A, 24, 'checkbox', (i) => i.id === 'checkbox#0.0');
  const sqFams = sq ? uniq(sq.concepts.map(stemOf)) : [];
  const box = (n, m = 24) => { const f = set.get(m, n); return wh(bodyOf(f).box); };
  row(['**the square 18 · 14 · 12**', sq ? `${groupNames(sq.concepts)} (layout-*: ${sq.concepts.filter((c) => /^layout-/.test(c)).length})` : '—', `${sq ? sq.concepts.length : 0} concepts in ${sqFams.length} families at 24, exact; not in calendar (${box('calendar')}), images (${box('images')}), external-link (${num(T['external-link'][24].baseBox.w)} / ${num(T['external-link-2'][24].baseBox.w)}), compose (${num(T.compose[24].baseBox.w)})`]);
  const lc = MASTERS.map((m) => classOf(A, m, 'credit-card', (i) => i.id === 'credit-card#0.0'));
  const cc = set.get(24, 'credit-card').paths[0].d, ccb = G.bbox([cc]);
  row(['**the landscape container 20×16**', lc[0] ? groupNames(lc[0].concepts) : '—', `${MASTERS.map((m, i) => `${lc[i] ? lc[i].concepts.length : 0}`).join(' · ')} concepts (24 · 20 · 16), ${lc[0] ? uniq(lc[0].concepts.map(stemOf)).length : 0} families at 24; centreline ${num(ccb.x1 - ccb.x0)}×${num(ccb.y1 - ccb.y0)}, radius ${arcRadii(cc).join('/')}; joins as the master shrinks: ${MASTERS.slice(1).map((m, i) => `${m}: ${lc[i + 1].concepts.filter((c) => !lc[i].concepts.includes(c)).join(', ') || '—'}`).join('; ')}`]);
  // the page and its fold
  const pg = classOf(A, 24, 'file', (i) => i.id === 'file#0.0');
  const fp = ctx.pairs().find((r) => r.a === 'files' && r.b === 'file' && r.m === 24);
  const fold = (n, m, i) => { const f = set.get(m, n); return wh(inkBox(f.paths[i].d, f.stroke)); };
  const cl = (n, m) => { const b = G.bbox([set.get(m, n).paths[1].d]); return `${num(b.x1 - b.x0)}×${num(b.y1 - b.y0)}`; };
  row(['**the page and its fold**', pg ? pg.concepts.join(', ') : '—', `page one drawing in ${pg ? pg.concepts.length : 0}; files' parts resized from file @24: ${fp.resized.map((x) => `${x.part} ×${n3(x.scale)} of ${x.of}`).join('; ') || 'none'}; files' fold at 24 = file's fold at 20 exactly: ${sameShape(set.get(24, 'files').paths[1].d, set.get(20, 'file').paths[1].d) ? 'yes' : 'no'}; fold centreline ${cl('files', 24)} against file's ${cl('file', 24)} (ink ${fold('files', 24, 1)} against ${fold('file', 24, 1)})`]);
  // the figure, cursor, image frame, menu lines
  const fig = ctx.pairs().filter((r) => /^users/.test(r.a));
  const figPairs = uniq(fig.map((r) => `${r.a}|${r.b}`));
  row(['**the figure**', '`users*` from `user*`', `${figPairs.filter((k) => fig.filter((r) => `${r.a}|${r.b}` === k).some((r) => r.exact + r.mirror > 0)).length} of ${figPairs.length} pairs share a part`]);
  row(['**the cursor**', '`cursor-click` from `cursor`', `${trio(MASTERS.map((m) => T['cursor-click'][m].baseBox.w))} ink against ${trio(MASTERS.map((m) => inkLen(set, 'cursor', m).w))}; resize: ${MASTERS.map((m) => (safe(() => C.congruentUpToScale(set.get(m, 'cursor').paths[0].d, set.get(m, 'cursor-click').paths[0].d).same, false) ? 'yes' : 'no')).join(' · ')}`]);
  const imgF = (n, m) => bodyOf(set.get(m, n));
  row(['**the image frame**', '`images` ×3 from `image`', `${trio(MASTERS.map((m) => imgF('images', m).box.w))} against ${trio(MASTERS.map((m) => imgF('image', m).box.w))}; radius ${MASTERS.map((m) => arcRadii(imgF('images', m).d).join('/')).join(' · ')} against ${MASTERS.map((m) => arcRadii(imgF('image', m).d).join('/')).join(' · ')}; resize: ${MASTERS.map((m) => (safe(() => C.congruentUpToScale(imgF('image', m).d, imgF('images', m).d).same, false) ? 'yes' : 'no')).join(' · ')}`]);
  row(['**the menu lines**', '`menu-arrow-*` from `menu`', `${num(inkLen(set, 'menu', 24).w)} → ${num(T['menu-arrow-left'][24].baseBox.w)}`]);
  // the chevrons
  const cud = ['chevrons-up-down', 'chevrons-up-down-2', 'chevrons-up-down-3', 'chevrons-up-down-4'].map((n) => `${n} ${uniq(MASTERS.flatMap((m) => (D[n]?.[m] ?? []).flatMap((x) => x.from.filter((f) => /^chevron/.test(f))))).join('/')}`);
  row(['**the chevron**', '`code`, `menu-arrow`, `sort-3`', `${['code', 'menu-arrow-left', 'sort-3'].map((n) => `${n} ${uniq(MASTERS.flatMap((m) => T[n][m].ids)).join('/')}`).join('; ')}; code-2's pair: ${MASTERS.map((m) => (D['code-2']?.[m] ?? []).map((x) => x.from.join('/')).join(', ') || 'none').join(' · ')}; ${cud.join('; ')}`]);
  // the "!"
  const bang = MASTERS.map((m) => {
    const c = set.get(m, 'alert-circle'), t = set.get(m, 'alert-triangle');
    const cBar = c.paths.slice(1).map((p) => p.d).find((d) => isStraight(d)), tBar = t.paths.slice(1).map((p) => p.d).find((d) => isStraight(d));
    const cDot = c.paths.slice(1).map((p) => p.d).find((d) => G.isDot(d)), tDot = t.paths.slice(1).map((p) => p.d).find((d) => G.isDot(d));
    return { bar: sameShape(cBar, tBar), dot: sameShape(cDot, tDot), barLen: lineLength(cBar) + c.stroke, dotD: inkBox(cDot, c.stroke).w, gap: air([cDot], [cBar], c.stroke), cut: bangBar(ctx, 'alert-circle', m) - bangBar(ctx, 'alert-triangle', m) };
  });
  row(['**the "!"**', '`alert-triangle` ×4 from `alert-circle` ×4', `bar the same ${bang.map((b) => (b.bar ? 'yes' : 'no')).join(' · ')}, dot the same ${bang.map((b) => (b.dot ? 'yes' : 'no')).join(' · ')}; at 24 bar ${num(bang[0].barLen)}, dot ⌀${num(bang[0].dotD)}, gap ${num(bang[0].gap)}; the triangle's bar cut back ${trio(bang.map((b) => b.cut), n3)}`]);
  // the dots
  const dotClass = (r) => A[24].classes.find((c) => G.isDot(c.repD) && r2((c.w) / 2) === r);
  for (const [label, rr] of [['**the glyph dot r0.5**', 0.5], ['**the detail dot r0.75** (⌀3 · 2.5 · 2)', 0.75]]) {
    const c = dotClass(rr);
    row([label, c ? groupNames(c.concepts) : '—', c ? `${c.concepts.length} concepts in ${uniq(c.concepts.map(stemOf)).length} families, exact at 24 (the ${num(c.w)}×${num(c.h)} centreline class)` : '—']);
  }
  const dr = MASTERS.map((m) => doorIdentities(ctx, m));
  row(['**the door** (`login`/`logout`)', `${DOORS.length} concepts`, `distinct door shapes up to mirroring: ${dr.map((d) => d.distinct).join(' · ')} (depths ${dr.map((d) => d.depths.join('/')).join(' · ')})`]);
  const pairsN = PAIRS.length;
  out(`pairs asked: ${pairsN}`);
  out(`classes spanning two or more families: ${MASTERS.map((m) => `${A[m].shared.length} at ${m}`).join(', ')}; non-trivial at 24: ${A[24].shared.filter((g) => !g.trivial).length} (${A[24].shared.filter((g) => g.trivial).length} lines or bare circles)`);
  out(`cross-family near misses on non-trivial parts (band ${MASTERS.map((m) => r3(0.5 * m / 24)).join(' · ')}): ${MASTERS.map((m) => `${A[m].nearMisses.length} at ${m}`).join(', ')}`);
  const nm = (m, a, b) => A[m].nearMisses.filter((x) => (x.a.startsWith(a + '#') && x.b.startsWith(b + '#')) || (x.a.startsWith(b + '#') && x.b.startsWith(a + '#')));
  const nmMin = (m, a, b) => { const l = nm(m, a, b); return l.length ? n3(Math.min(...l.map((x) => x.r))) : '—'; };
  out(`code's chevron from menu-arrow's @16: ${nmMin(16, 'code', 'menu-arrow-left')} / ${nmMin(16, 'code', 'menu-arrow-right')}; briefcase from desktop @16: ${['desktop', 'desktop-2', 'desktop-3', 'desktop-4', 'desktop-5', 'desktop-6'].map((d) => nmMin(16, 'briefcase', d)).filter((x) => x !== '—').join(', ') || '—'}; arrow heads from chevron-*-small @16: ${['up', 'down', 'left', 'right'].map((d) => nmMin(16, `arrow-${d}`, `chevron-${d}-small`)).join(', ')}`);
}
function doorIdentities(ctx, m) {
  const D = Object.fromEntries(DOORS.map((n) => [n, doorOf(ctx.set, n, m)]));
  const shapes = [];
  for (const n of DOORS) { const s = shapeOf(D[n].doorD), ms = safe(() => shapeOf(mirrorX(D[n].doorD, m)), null); if (!shapes.some((x) => x === s || x === ms)) shapes.push(s); }
  return { D, distinct: shapes.length, depths: uniq(DOORS.map((n) => num(D[n].depth))) };
}

// ── §2.5 stacks ─────────────────────────────────────────────────────────────────────────────────────────────
const STACK_ROWS = [['`images`, `files`, `files-5`', ['images', 'files', 'files-5']], ['`images-2`, `files-2` (offset up-right)', ['images-2', 'files-2']],
  ['`images-3`, `files-3`, `copy-2`, `copy-3` (offset up-left)', ['images-3', 'files-3', 'copy-2', 'copy-3']], ['`copy`', ['copy']], ['`images-4`, `files-4` (a strip behind)', ['images-4', 'files-4']]];
function secS25(ctx) {
  out('## §2.5 Stacks — where the sheet behind sits');
  out('| stack | back sheet shows past the front (left, bottom; then right, top) 24 · 20 · 16 | front left/bottom edge to back\'s | air front ↔ back |');
  const S = Object.fromEntries(STACKS.map((n) => [n, Object.fromEntries(MASTERS.map((m) => [m, stackOf(ctx.set, n, m)]))]));
  for (const [label, members] of STACK_ROWS) {
    const past = perMaster(members, (n, m) => { const p = S[n][m].past; return ['left', 'bottom', 'right', 'top'].map((k) => (p[k] > 0.01 ? num(p[k]) : '·')).join(','); }, String);
    const edge = perMaster(members, (n, m) => { const p = S[n][m].past; return `${num(Math.abs(p.left))}, ${num(Math.abs(p.bottom))}`; }, String);
    row([label, past, edge, perMaster(members, (n, m) => S[n][m].air)]);
  }
  const offsetOf = (n, m) => Math.max(...Object.values(S[n][m].past));
  const three = STACKS.filter((n) => MASTERS.every((m) => r2(offsetOf(n, m)) === 3));
  out(`stacks whose back shows 3 past the front at every master: ${three.length} of ${STACKS.length} (${three.join(', ')})`);
  out(`copy: offset ${trio(MASTERS.map((m) => offsetOf('copy', m)))}, air ${trio(MASTERS.map((m) => S.copy[m].air))}; its tags: "${S.copy[24].tags}" (says offset 4: ${/offset 4/.test(S.copy[24].tags) ? 'yes' : 'no'})`);
  out(`images' note says "3 = 1.5 of air + one stroke": ${noteHas(ctx, 'images', 24, '3 = 1.5 of air + one stroke') ? 'present' : 'absent'}; the line is ${trio(MASTERS.map(strokeOf))}, so 3 − stroke = ${trio(MASTERS.map((m) => 3 - strokeOf(m)))}`);
}

// ── §2.6 doors ──────────────────────────────────────────────────────────────────────────────────────────────
function secS26(ctx) {
  out('## §2.6 The doors — facts for the second expiring decision');
  out('| concept | door side | returns (ink) 24 · 20 · 16 | arrow points | arrow length | door ↔ arrow air |');
  const D = Object.fromEntries(MASTERS.map((m) => [m, doorIdentities(ctx, m).D]));
  for (const n of DOORS) row([`\`${n}\``, D[24][n].side, trio(MASTERS.map((m) => D[m][n].depth)), D[24][n].points, trio(MASTERS.map((m) => D[m][n].length)), trio(MASTERS.map((m) => D[m][n].air))]);
  const id = (a, b, mir, whole = false) => MASTERS.map((m) => { const x = whole ? D[m][a].wholeD : D[m][a].doorD, y = whole ? D[m][b].wholeD : D[m][b].doorD; return safe(() => shapeOf(mir ? mirrorX(x, m) : x) === shapeOf(y), false) ? 'yes' : 'no'; }).join(' · ');
  out(`login's door is logout-3's: ${id('login', 'logout-3', false)}; login's door mirrored is logout's: ${id('login', 'logout', true)}`);
  out(`login-3 is login flipped whole: ${id('login', 'login-3', true, true)}; logout-3 is logout flipped whole: ${id('logout', 'logout-3', true, true)}; login-4 is login-2 flipped whole: ${id('login-2', 'login-4', true, true)}; logout-4 is logout-2 flipped whole: ${id('logout-2', 'logout-4', true, true)}`);
  out(`login-2's door is logout-4's: ${id('login-2', 'logout-4', false)}; mirrored is logout-2's: ${id('login-2', 'logout-2', true)}`);
  const dir = (p) => uniq(DOORS.filter((n) => D[24][n].points === p).map((n) => Number(n.match(/-(\d)$/)?.[1] ?? 1))).sort();
  out(`arrows point right for n = ${dir('→').join(', ')}; left for n = ${dir('←').join(', ')}; shallow door (${num(D[24].login.depth)}) for n = ${uniq(DOORS.filter((n) => r2(D[24][n].depth) === r2(D[24].login.depth)).map((n) => Number(n.match(/-(\d)$/)?.[1] ?? 1))).sort().join(', ')}`);
  const di = MASTERS.map((m) => doorIdentities(ctx, m));
  out(`doors in the set, up to mirroring: ${di.map((d) => d.distinct).join(' · ')}; depths ${di.map((d) => d.depths.join(' / ')).join(' · ')}`);
}

// ── §3, §4, §5, §6 — the figures they restate, recomputed from the same measures ────────────────────────────
/** Bases drawn smaller for their composite: the composite's base long side under the object's own (the square
 *  keyline for the boxes, image's frame, cursor's ink). */
function smallerBases(ctx) {
  const T = ctx.table(), set = ctx.set;
  const own = { external: keySquare(24), compose: keySquare(24), images: bodyOf(set.get(24, 'image')).box.w, cursor: inkLen(set, 'cursor', 24).w };
  const rows = [];
  for (const n of ['external-link', 'external-link-2', 'compose', 'compose-2', 'compose-3', 'compose-4']) rows.push({ n, size: T[n][24].baseBox.w, of: own.external });
  for (const n of set.names.filter((x) => /^images(-\d+)?$/.test(x))) rows.push({ n, size: bodyOf(set.get(24, n)).box.w, of: own.images });
  rows.push({ n: 'cursor-click', size: T['cursor-click'][24].baseBox.w, of: own.cursor });
  return rows.filter((r) => r2(r.size) < r2(r.of));
}
function simplyGood(ctx) {
  const T = ctx.table(), set = ctx.set;
  const vol = ['volume', 'volume-low', 'volume-none', 'volume-x', 'volume-plus', 'volume-minus', 'volume-off'];
  const sp = vol.filter((n) => MASTERS.every((m) => C.congruentUpToTranslation(set.get(m, 'volume').paths[0].d, set.get(m, n).paths[0].d).same));
  const tipFiles = MASTERS.map((m) => sharedTip(set, PENCIL_GROUPS[0], m).carriers.length);
  const tipFiles2 = MASTERS.map((m) => sharedTip(set, PENCIL_GROUPS[1], m).carriers.length);
  const S = Object.fromEntries(STACKS.map((n) => [n, MASTERS.map((m) => stackOf(set, n, m))]));
  const three = STACKS.filter((n) => S[n].every((x) => r2(Math.max(...Object.values(x.past))) === 3));
  const bst = [...ofKind(ctx, 'beside'), ...ofKind(ctx, 'through'), ...ofKind(ctx, 'strike')];
  return { sp: sp.length, vol: vol.length, tipFiles, tipFiles2, three: three.length, stacks: STACKS.length, bst: bst.length,
    minBound: Math.min(...bst.flatMap((n) => MASTERS.map((m) => T[n][m].toBound))),
    all19: ctx.census().filter((f) => !MARK_STEMS.has(f.stem) && categorise(f) === 'all').length };
}
function secS3(ctx) {
  const T = ctx.table(), S2 = ctx.sheet(), A = ctx.partA();
  out('## §3 Judged list — the counts each item carries (recomputed)');
  const k = Object.fromEntries(KINDS.map((x) => [x, ofKind(ctx, x).length]));
  out(`1. corner badge rows queued (the card's selection — definitional): at least ${S2 ? S2.badge.length : '—'}; corner badges shipped 0; beside/through/strike composites, none spending the margin: ${k.beside + k.through + k.strike}`);
  const parts = sharedPartsBreaking(ctx);
  const offs = parts.flatMap((R) => R.offs);
  const max = offs.reduce((a, o) => (o.r > a.r ? o : a), { r: 0 });
  out(`2. shared parts that break: ${parts.length} parts, ${parts.reduce((s, R) => s + R.involved.length, 0)} concepts (rule in §2.3); body pairs at some masters only ${bodyPairsAtSomeMasters(ctx.census()).length}; largest residual ${n3(max.r)} u @${max.m} (${fix2(max.r * PX16[max.m])} px); under 0.333: ${offs.filter((o) => o.r <= 0.3335).length} of ${offs.length}`);
  const g = throughAirGroups(ctx);
  const besAir = ofKind(ctx, 'beside').map((n) => T[n][24].air);
  out(`3. through + beside: ${k.through + k.beside} concepts; ${g.exact.length} of ${k.through} exactly ${g.exact[0].a.map((v) => v.toFixed(3)).join(' · ')}, ${g.near.length} more ${uniq(g.near.map((x) => x.a.map((v) => v.toFixed(3)).join(' · '))).join(' / ')}; the ${k.beside} beside composites at 24 ${num(Math.min(...besAir))}–${num(Math.max(...besAir))}`);
  const narrow = MASTERS.map((m) => inkBox(headOf(T['sort-alpha-ascending'][m]), T['sort-alpha-ascending'][m].stroke).w);
  const nc = narrowHeadCarriers(ctx.set, ctx.table(), [...ofKind(ctx, 'beside'), ...ofKind(ctx, 'through')]).length;
  out(`4. C16 broken by the sort family's ${nc} narrow-head arrows (${trio(narrow)}) + the rotate/refresh family's ${CITED_ROTATE_REFRESH} (card 1.1 §2.7 — cited) = ${nc + CITED_ROTATE_REFRESH}`);
  out(`5. smallest shipped plus at 24: ${num(Math.min(...plusSizes(ctx)[24].filter((x) => x.where !== 'volume-plus').map((x) => x.size)))}; volume-plus ${num(T['volume-plus'][24].modBox.w)}; the door arrow ${trio(MASTERS.map((m) => arrowLen(T.login[m])))}`);
  out(`6. channels drawn: ban-2's cut ${trio(MASTERS.map((m) => slotWidth(ctx.set.get(m, 'ban-2', true))))} (C21/C18's 2 · 1.75 · 1.75 — cited), volume-off's ${trio(MASTERS.map((m) => channel(ctx.set.get(m, 'volume-off', true))))}; drawings wrong 0 (a docs conflict)`);
  const hi = ctx.set.names.filter((n) => /^(help|info)(-\d+)?$/.test(n));
  out(`7. help and info concepts: ${hi.length}, files ${drawingsOf(ctx, hi)}; queued: ${(ctx.sheetRows().filter((r) => /^(help|info)-square$/.test(r.name)).map((r) => `${r.name} row ${r.row}`)).join(', ')}`);
  out(`8. login/logout concepts: ${DOORS.length}`);
  const sb = smallerBases(ctx);
  out(`9. bases redrawn smaller for their composite: ${sb.length} concepts — ${sb.map((r) => `${r.n} ${num(r.size)} (against ${num(r.of)})`).join(', ')}`);
  const ring = classOf(A, 24, 'check-circle', (i) => i.id === 'check-circle#0.0');
  const sq = classOf(A, 24, 'checkbox', (i) => i.id === 'checkbox#0.0'), lc = classOf(A, 24, 'credit-card', (i) => i.id === 'credit-card#0.0');
  const ccd = ctx.set.get(24, 'credit-card').paths[0].d;
  out(`10. one-drawing containers at 24: the ring ${ring ? ring.concepts.length : 0}, the square ${sq ? sq.concepts.length : 0}, the landscape box ${lc ? lc.concepts.length : 0} concepts (${wh(inkBox(ccd, strokeOf(24)))}, radius ${arcRadii(ccd).join('/')})`);
  const us = ctx.sheetRows().find((r) => r.name === 'user-search');
  out(`11. user-search: row ${us ? us.row : '—'}`);
  if (S2) { const per = Object.values(S2.perBase); out(`12. (on the card's selection — definitional) bases queued ${per.length}; with one or two variants ${per.filter((v) => v.length <= 2).length}, exactly one ${per.filter((v) => v.length === 1).length}`); }
  const G2 = simplyGood(ctx);
  out(`simply good: through exactly 1.500 in ${g.exact.length} of ${k.through}, ${uniq(g.near.map((x) => x.a.map((v) => v.toFixed(3)).join(' · '))).join(' / ')} in ${g.near.length}; the speaker ${G2.sp} of ${G2.vol}, residual 0; the pencil tip string in ${MASTERS.map((m, i) => `${G2.tipFiles[i]} + ${G2.tipFiles2[i]}`).join(' · ')} files per master; arrowhead in ${arrowheadCarriers(ctx).composites.length} composites (§2.4); ${G2.all19} families one body everywhere; stack offset 3 · 3 · 3 in ${G2.three} of ${G2.stacks}; ${G2.bst} composites, smallest "to bound" ${num(G2.minBound)}`);
}
function secS4(ctx) {
  const T = ctx.table();
  out('## §4 What only Maruti\'s eye can settle — the figures its questions quote');
  out(`door arrow at 16: ${num(arrowLen(T.login[16]))} = ${fix2(arrowLen(T.login[16]) / inkLen(ctx.set, 'arrow-right', 16).w)} of arrow-right`);
  const star = (n) => trio(MASTERS.map((m) => starPart(ctx.set.get(m, n))[0].box.w));
  out(`companion stars: wand ${star('wand')} against sparkle-2 ${star('sparkle-2')} and sparkle-3 ${star('sparkle-3')}`);
  out(`air beside (volume) ${uniq(['volume-x', 'volume-plus'].flatMap((n) => MASTERS.map((m) => num(T[n][m].air)))).join('/')} against the through kind's ${uniq(throughAirGroups(ctx).exact.flatMap((x) => x.a.map(num))).join('/')}`);
}
function secS5(ctx) {
  const T = ctx.table();
  out('## §5 Proposals — the figures they restate, and the sheet rows they cite');
  const rows = ctx.sheetRows();
  for (const n of ['help-square', 'info-square', 'alert-square', 'user-search', 'help-circle', 'info-circle']) { const r = rows.find((x) => x.name === n); out(`${n}: ${r ? `row ${r.row}` : 'not on the sheet'}`); }
  const S2 = ctx.sheet();
  const vol = ['volume-plus', 'volume-minus', 'volume-x'];
  out(`P1: badge rows (the card's selection — definitional) at least ${S2 ? S2.badge.length : '—'}; shipped icons that would change 0; the drawing bound's far edge ${trio(MASTERS.map((m) => BOUND[m][1]))}; start size ${perMaster(['volume-x'], (n, m) => T[n][m].modBox.w)} (the ${vol.length} volume marks); air ${uniq(throughAirGroups(ctx).exact.map((x) => x.a.map(num).join(' · '))).join('/')} (docs/05's 8 / 5.5 and Fluent's 45–56% — cited)`);
  const besAir = ofKind(ctx, 'beside').map((n) => T[n][24].air);
  out(`P2: beside concepts ${ofKind(ctx, 'beside').length}; chosen air ${num(T['volume-x'][24].air)}; left-over air ${num(Math.min(...besAir))}–${num(Math.max(...besAir))}; the volume marks ${vol.length} concepts in one family`);
  const sb = smallerBases(ctx);
  out(`P3: through concepts ${ofKind(ctx, 'through').length}, air ${uniq(throughAirGroups(ctx).exact.map((x) => x.a.map(num).join(' · '))).join('/')}; smaller bases ${uniq(sb.map((r) => `${r.n.replace(/-\d+$/, '')} ${num(r.size)}`)).join(', ')}`);
  out(`P4: ${narrowHeadCarriers(ctx.set, ctx.table(), [...ofKind(ctx, 'beside'), ...ofKind(ctx, 'through')]).length + CITED_ROTATE_REFRESH} concepts (§1.8, ${CITED_ROTATE_REFRESH} of them cited); narrow head ${trio(MASTERS.map((m) => inkBox(headOf(T['sort-alpha-ascending'][m]), T['sort-alpha-ascending'][m].stroke).w))}; the 4.25 / 4.257 split — card 1.1 item 7 (cited)`);
  const hi = ctx.set.names.filter((n) => /^(help|info)(-\d+)?$/.test(n));
  out(`P5: ${hi.length} concepts, ${drawingsOf(ctx, hi)} files; alert-triangle concepts ${ctx.set.names.filter((n) => /^alert-triangle(-\d+)?$/.test(n)).length}`);
  const parts = sharedPartsBreaking(ctx), offs = parts.flatMap((R) => R.offs);
  out(`P7: ${parts.length} parts, ${parts.reduce((s, R) => s + R.involved.length, 0)} concepts (rule in §2.3), residuals ${n3(Math.min(...offs.map((o) => o.r)))}–${n3(Math.max(...offs.map((o) => o.r)))}`);
  out(`P8: the literal ${uniq(throughAirGroups(ctx).exact.map((x) => num(x.a[0])))[0]}, the 16 stroke ${strokeOf(16)}`);
}
function secS6(ctx) {
  const T = ctx.table(), A = ctx.partA();
  out('## §6 For wave 5 to reconcile — this card\'s column (recomputed)');
  const k = KINDS.map((x) => ofKind(ctx, x).length);
  out(`composites ${k.reduce((a, b) => a + b, 0)} (${k.join(' · ')}) in ${ctx.set.names.length} concepts; the other side (card 1.1 §2.8's 5 two-object names) is cited`);
  const bp = bodyPairsAtSomeMasters(ctx.census());
  out(`body pairs one drawing at some masters only: ${bp.length} — ${bp.map((p) => `${p.a}/${p.b} @${p.at.join(' + ')}`).join(', ')} (rule-register G7's 5 whole-outline pairs — cited)`);
  const census = ctx.census(), fam = (s) => census.find((f) => f.stem === s);
  for (const [s, a, b] of [['files', 'files', 'files-5'], ['help', 'help', 'help-2']]) out(`${a}/${b} share their body at ${MASTERS.filter((m) => fam(s).m[m].groups.some((g) => g.includes(a) && g.includes(b))).join(', ')}`);
  out(`the checkbox/check-circle check at 16: ${num(T.checkbox[16].modBox.w)} against ${num(T['check-circle'][16].modBox.w)}, ${n3(T['check-circle'][16].modBox.w - T.checkbox[16].modBox.w)} narrower (the file's note: ${noteHas(ctx, 'checkbox', 16, '0.08 narrower') ? '"0.08 narrower"' : 'no such phrase'}); residual ${n3(residual(T.checkbox[16].md[0], T['check-circle'][16].md[0]))} (card 1.1's 0.106 — the same measure)`);
  const banBar = T.ban[24].md[0], ringR = T.ban[24].baseBox.w / 2 - strokeOf(24) / 2;
  out(`ban's slash against the ring: air ${trio(MASTERS.map((m) => T.ban[m].air))}; at 24 the bar's half-length ${n3(lineLength(banBar) / 2)} against the ring's centreline radius ${n3(ringR)}`);
  const sq = classOf(A, 24, 'checkbox', (i) => i.id === 'checkbox#0.0');
  out(`the square's carriers at 24: ${sq ? sq.concepts.length : 0} (card 1.1 §2.2's 26 — cited)`);
  const ch = MASTERS.map((m) => channel(ctx.set.get(m, 'volume-off', true)));
  out(`volume-off's gap: note ${trio(MASTERS.map((m) => ctx.set.get(m, 'volume-off', true).notes.gap ?? '—'), String)}; filled channel ${trio(ch, n3)} — under the 1.5 floor at ${MASTERS.filter((m, i) => r2(ch[i]) < 1.5).join(', ') || 'none'}`);
}
function secS17() { out('## §1.7 What the references do — cited from the reference cards, nothing measured here'); }
function secS7(ctx) {
  const T = ctx.table(), S2 = ctx.sheet();
  out('## §7 Handover — the figures it hands on (the card numbers it names are not figures)');
  out(`volume-off's filled bar against the solid: air ${trio(MASTERS.map((m) => T['volume-off'][m].filledAir))}; ban's bar against the ring ${trio(MASTERS.map((m) => T.ban[m].air))}`);
  out(`alert-triangle-2 / -4 air at 16: ${num(T['alert-triangle-2'][16].air)} / ${num(T['alert-triangle-4'][16].air)}; volume-off's filled channel at 16 ${n3(channel(ctx.set.get(16, 'volume-off', true)))}, its ink centre ${num(((b) => (b.x0 + b.x1) / 2 - 8)(union(ctx.set.get(16, 'volume-off').paths.map((p) => inkBox(p.d, strokeOf(16))))))} off the canvas centre at 16`);
  if (S2) { const per = Object.values(S2.perBase); out(`unshipped composites by kind (the badge row and the base count rest on the card's selection — definitional): at least ${S2.badge.length} / ${S2.strike.length} / ${S2.enclosure.length}; bases with one or two queued variants ${per.filter((v) => v.length <= 2).length}`); }
  out(`the landscape container: ${wh(inkBox(ctx.set.get(24, 'credit-card').paths[0].d, strokeOf(24)))}`);
}

export const SECTIONS = {
  head: secHead, s0: secS0, 's1.1': secS11, 's1.2': secS12, 's1.3': secS13, 's1.4': secS14, 's1.5': secS15, 's1.6': secS16, 's1.7': secS17,
  's1.8': secS18, 's2.1': secS21, 's2.2': secS22, 's2.3': secS23, 's2.4': secS24, 's2.5': secS25, 's2.6': secS26, s3: secS3, s4: secS4, s5: secS5, s6: secS6, s7: secS7,
};

function usage() {
  console.error('usage: node tools/audit/grammar-probe.mjs <pin-dir> [section …]');
  console.error(`  <pin-dir> holds src/icons/{24,20,16} (git archive 5933041); sections: ${Object.keys(SECTIONS).join(' ')}`);
}
export function main(argv = process.argv.slice(2)) {
  const [pin, ...wanted] = argv;
  if (!pin || !existsSync(pin) || !statSync(pin).isDirectory() || !existsSync(join(pin, 'src/icons/24'))) { usage(); return 2; }
  const bad = wanted.filter((s) => !SECTIONS[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}`); usage(); return 2; }
  const ctx = context(resolve(pin));
  out(`# grammar probe — docs/audit/findings-grammar.md (card 1.9), pin ${resolve(pin)}`);
  for (const s of wanted.length ? wanted : Object.keys(SECTIONS)) { out(); SECTIONS[s](ctx); }
  return 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
