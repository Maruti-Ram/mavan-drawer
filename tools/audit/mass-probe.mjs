#!/usr/bin/env node
// APPARENT WEIGHT, REPRINTED — every measured figure in docs/audit/findings-mass.md (audit card 1.5,
// axis F1 apparent weight + F10 silhouette legibility), printed again from the pin.
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing (unless the user names --cache).
//
// Usage:
//   P=/tmp/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P
//   node tools/audit/mass-probe.mjs $P [section …] [--refs <dir>] [--jobs <n>] [--cache <dir>]
//     --refs   reference library root (default: the repo's research/references, gitignored and
//              present on the audit machine). Only research/references/lucide is read.
//     --jobs   worker threads for the per-drawing census (default: CPUs − 1). --jobs 1 = no workers.
//     --cache  a directory YOU name: the per-drawing census is saved there and reused while the
//              pin's 2,910 drawings are byte-identical. There is no default cache path.
//
// Sections (default: all), each printed under "## §<n> <title>", in the document's order and format:
//   intro     front matter and the method paragraph (doc lines 3–11)                    (head, method)
//   s0        the short version                                                          (§0)
//   s1        what was measured: the definitions' own figures, the reproduced wave-0 set (§1)
//   s1.1      the raster.mjs bug: closed forms, scope, what it moved, the wave-0 table   (§1.1)
//   s1.1r64   §1.1 "Stable to the sampling rate": the census at rate 64 (the slow part)  (§1.1)
//   s2.1 s2.2 s2.3 s2.4                                                                  (§2.1–§2.4)
//   s3.1 s3.2 s3.3 s3.4 s3.5 s3.6                                                        (§3.1–§3.6)
//   s4        across the three masters                                                   (§4)
//   s5        the judged list's figures (M-1 … M-8)                                      (§5)
//   s6        F10 seed pairs                                                             (§6)
//   s7        noticed in passing: identical drawings, filled lighter than outline, zero arcs (§7)
//   appA      appendix A, one row per concept                                            (App. A)
//   appB      appendix B, the 97 concepts matched to Lucide                              (App. B)
//   appC      appendix C's own claim (the bypass equals inkArea on every stroke-only file) (App. C)
// Not here, by design: the crispness figures the document repeats from card 1.6 (312 judgeable,
// floor 0.189, median 0.285, max 0.750, the 0.70–0.75 band, blurScore 5e-5, the diagonalShare
// defect) — they are F7 figures and print from tools/audit/grid-probe.mjs.
//
// INSTRUMENTS. tools/audit/raster.mjs (readIcon, regionOf, region, flatten, region.covered,
// region.bbox, rasterise and inkBox only where a figure compares against them), tools/geometry.mjs
// parsePath, tools/masters.mjs (stroke and keyline constants for the arithmetic in §2.4 and §4).
// The repo's copies have gained code since the pin, but parsePath and the STROKES, MIN_GAP and MASTERS
// values this probe reaches are unchanged (checked 2026-10-20 against the pin's own copies: identical output on all 2,910 pin drawings, values deep-equal); raster.mjs is not in the pin and is imported from the
// repo.
//
// KNOWN DEFECT WORKED AROUND. raster.mjs:257 `classify` drops an area path's horizontal edges and
// reuses that list for its box-uniformity test, so `rasterise` / `inkArea` / `density` can score a
// pixel that straddles a filled shape's horizontal edge 0 or 1 where the truth is between. Every ink
// figure here is taken with the document's bypass (appendix C, `bfRasterise` below): every sample
// point goes through `region.covered()`, `classify` is never called. raster.mjs is not edited.
// `rasterise` (the classify path) is called only by §1.1, intro, s0, s1 and appC, which state what the
// bug did, and by the §1.1 closed-form table.
//
// PARAMETERS the card chose (recovered from its scratch scripts in the 2026-10-04 session; they are
// choices, not figures): rate 32 (64 for the convergence check), squint σ 1.5 px with 5 taps either
// side, seed pairs σ 1.0 with 4 taps, the band edges 0.5 · 0.75 · 1.25 · 1.5 × the row median, the
// "changed" thresholds (0.05 px², 0.01 per pixel, 5e-4 on 4-dp statistics), the crowded and knot
// thresholds (0.90, 0.85), the hand-written Lucide alias maps. Values are rounded to 4 dp (5 dp for
// shares) before they are ranked, as the card's saved census was, so ties break the same way.
//
// RUN TIME on this machine (14 cores, --jobs 13, measured 2026-10-08): the per-drawing census —
// bypass at rate 32, the stroke/area split, the classify comparison — 28 s; with the rate-64 pass
// that intro and s1.1r64 need, 108–115 s. Lucide (s0 s1 s3.2–s3.5 s5 appB) 13–18 s. Each section's
// own printing: s1 1.5 s (inkBox on its 30-drawing sample), s6 0.4 s, every other < 0.1 s. A full
// run is 2 min 10–20 s (820–870 s of CPU, so about 15 min with --jobs 1). With --cache the census is read
// back in about 1 s and only Lucide and the printing remain.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { availableParallelism } from 'node:os';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { readIcon, regionOf, region, flatten, rasterise, inkBox, areaRegion, strokeRegion } from './raster.mjs';
import { parsePath } from '../geometry.mjs';
import { STROKES, MIN_GAP, MASTERS as SPEC } from '../masters.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
export const MASTER_LIST = [24, 20, 16];

// ── parameters (choices the card made; see the header) ─────────────────────
export const RATE = 32;
export const RATE_CHECK = 64;
export const PARTIAL = 0.995;                         // a pixel is half-tone when 0 < c < 0.995
export const SQUINT = { sigma: 1.5, rad: 5 };          // §1 "Squint peak": σ 1.5 px, 11 taps
export const SEED = { sigma: 1.0, rad: 4 };            // §6 seed pairs (pairs_bf.mjs): σ 1.0, 9 taps
export const SIGMAS = [1, 1.5, 2, 2.5];                // §2.4 sweep: ceil(3σ) taps either side
export const BANDS = [['Hairline', 0, 0.5], ['Light', 0.5, 0.75], ['Level', 0.75, 1.25], ['Full', 1.25, 1.5], ['Dense', 1.5, 99]];
export const BAND_EDGES = [0.5, 0.75, 1.25, 1.5];
export const CHANGED = 0.05, CHANGED_BIG = 0.5;        // §1.1 file changed by > 0.05 (> 0.5) px²
export const PX_DIFF = 0.01;                           // §1.1 a pixel mis-scored by > 0.01
export const STAT_DIFF = 5e-4;                         // §1.1 a 4-dp statistic that moved
export const CROWDED = 0.9, KNOT = 0.9, KNOT_NEAR = 0.85;
export const IDENTICAL_COS = 0.9999;
export const WITHIN = [0.25, 1 / 3, 0.5];              // §2.2 "how wide Level should be"
export const CHROMIUM_SAMPLE = { every: 24, offset: 5 };   // appendix C: every 24th file from offset 5
export const BOX_SAMPLE_EVERY = 97;                    // §1 bbox vs inkBox: every 97th file (30 drawings)
export const VARIANTS = ['target', 'package-3', 'puzzle-4', 'files-4'];   // §3.2's "heavier numbered variant" verdict (judgement)
export const NUDGES = ['globe-2', 'book-2', 'presentation-2'];             // §3.2's "mildly the drawing" verdict (judgement)

// Hand-written concept pairings with Lucide (scratch gen_mass_tables.mjs, keyed by stem, default
// size only — the §3.2/§3.3 evidence columns) and gen_mass_appx.mjs (keyed by exact concept — §3.5
// and appendix B). Kept verbatim; they are the card's alias decisions, not measurements.
export const LUCIDE_BY_STEM = { globe: 'globe', language: null, table: 'table', printer: 'printer', target: 'target', bug: 'bug', package: 'package', book: 'book', presentation: 'presentation', store: 'store', puzzle: 'puzzle', files: 'files', briefcase: 'briefcase', database: 'database', save: 'save', building: 'building', grid: 'layout-grid', gear: 'cog', desktop: 'monitor', compass: 'compass', 'at-sign': 'at-sign', camera: 'camera', 'chart-pie': 'chart-pie', keyboard: 'keyboard', 'credit-card': 'credit-card', wand: 'wand-sparkles', minus: 'minus', check: 'check', plus: 'plus', chevron: 'chevron-down', more: 'ellipsis', paintbrush: 'paintbrush', volume: 'volume-1', presentation2: null };
export const LUCIDE_BY_CONCEPT = { globe: 'globe', table: 'table', printer: 'printer', target: 'target', bug: 'bug', package: 'package', book: 'book', 'book-open': 'book-open', presentation: 'presentation', store: 'store', puzzle: 'puzzle', files: 'files', briefcase: 'briefcase', database: 'database', save: 'save', building: 'building', grid: 'layout-grid', gear: 'cog', desktop: 'monitor', compass: 'compass', 'at-sign': 'at-sign', camera: 'camera', 'chart-pie': 'chart-pie', keyboard: 'keyboard', 'credit-card': 'credit-card', minus: 'minus', check: 'check', plus: 'plus', 'chevron-down': 'chevron-down', 'more-horizontal': 'ellipsis', 'more-vertical': 'ellipsis-vertical', menu: 'menu', x: 'x', 'arrow-down': 'arrow-down', 'arrow-up-right': 'arrow-up-right', bell: 'bell', calendar: 'calendar', clock: 'clock', copy: 'copy', eye: 'eye', file: 'file', 'file-text': 'file-text', folder: 'folder', heart: 'heart', home: 'house', image: 'image', info: 'info', key: 'key', link: 'link', lock: 'lock', mail: 'mail', 'map-pin': 'map-pin', moon: 'moon', search: 'search', star: 'star', sun: 'sun', trash: 'trash', user: 'user', users: 'users', wallet: 'wallet', pencil: 'pencil', phone: 'phone', send: 'send', shield: 'shield', flag: 'flag', 'thumbs-up': 'thumbs-up', 'thumbs-down': 'thumbs-down', upload: 'upload', play: 'play', 'refresh-cw': 'refresh-cw', 'rotate-ccw': 'rotate-ccw', 'message-circle': 'message-circle', megaphone: 'megaphone', lightbulb: 'lightbulb', italic: 'italic', bold: 'bold', hash: 'hash', gauge: 'gauge', funnel: 'funnel', 'external-link': 'external-link', 'alert-triangle': 'triangle-alert', 'alert-circle': 'circle-alert', 'plus-circle': 'circle-plus', 'minus-circle': 'circle-minus', 'x-circle': 'circle-x', 'check-circle': 'circle-check', help: 'circle-question-mark', ban: 'ban', archive: 'archive', paperclip: 'paperclip', pin: 'pin', plug: 'plug', clipboard: 'clipboard', sliders: 'sliders-horizontal', wrench: 'wrench', watch: 'watch', volume: 'volume-1', wand: 'wand-sparkles', 'list-ordered': 'list-ordered', microphone: 'mic', sparkle: 'sparkle', sheet: 'sheet', settings: 'settings', 'log-in': 'log-in', 'log-out': 'log-out', list: 'list', toggle: 'toggle-right', type: 'type', refresh: 'refresh-cw' };
// The disc-with-a-glyph families of §3.6 (scratch movers.mjs; `ban` excluded there).
export const DISC = /^(alert-circle|info|check-circle|minus-circle|plus-circle|x-circle|help|clock|face-neutral|face-sad)(-\d+)?(-small)?$/;

// ── small helpers ──────────────────────────────────────────────────────────
const rnd = (n, k) => Math.round(n * 10 ** k) / 10 ** k;
export const r4 = (n) => rnd(n, 4), r5 = (n) => rnd(n, 5);
const sum = (a) => { let s = 0; for (const v of a) s += v; return s; };
const f1 = (v) => v.toFixed(1), f2 = (v) => v.toFixed(2), f3 = (v) => v.toFixed(3), pc = (v) => (v * 100).toFixed(1);
const min = (a) => a.reduce((x, y) => Math.min(x, y), Infinity), max = (a) => a.reduce((x, y) => Math.max(x, y), -Infinity);
const tick = (s) => '`' + s + '`';
/** Quantile with linear interpolation between order statistics (the card's `q`). */
export const q = (a, p) => { const s = [...a].sort((x, y) => x - y); const i = p * (s.length - 1), lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
/** Ranks with ties averaged (the card's `rankA`, used for §3.1 and §4). */
export function rankAvg(a) {
  const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = new Array(a.length);
  let i = 0; while (i < idx.length) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1; i = j + 1; }
  return r;
}
/** Ranks with ties broken by input order (the card's plain `rank`, used for §2.4 and §3.5). */
export function rankStable(a) { const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = new Array(a.length); idx.forEach(([, i], k) => { r[i] = k + 1; }); return r; }
export function pearson(x, y) {
  const n = x.length, mx = sum(x) / n, my = sum(y) / n; let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return sxy / Math.sqrt(sxx * syy);
}
export const spearman = (x, y) => pearson(rankAvg(x), rankAvg(y));
export const spearmanStable = (x, y) => pearson(rankStable(x), rankStable(y));
const table = (head, body, aligns) => [`| ${head.join(' | ')} |`, `|${aligns.map((a) => (a === 'l' ? '---' : '---:')).join('|')}|`, ...body.map((r) => `| ${r.join(' | ')} |`)].join('\n');
export const bandOf = (v, med) => BANDS.find(([, lo, hi]) => v / med >= lo && v / med < hi)[0];
export const bandIndex = (v, med) => BAND_EDGES.filter((e) => v / med >= e).length;
export const stemOf = (c) => c.replace(/-(small|large)$/, '').replace(/-\d+$/, '');
export const sizeOf = (c) => (/-(small|large)$/.exec(c) || [null, 'default'])[1];

// ── the bypass (appendix C, verbatim in behaviour) ─────────────────────────
/** Coverage of every pixel, every sample through `covered()`; never calls `classify`. */
export function bfRasterise(reg, { px, rate, canvas = reg.canvas }) {
  const unit = canvas / px, r = rate / unit;            // samples per canvas unit
  const cov = new Float64Array(px * px), { x0, y0, x1, y1 } = reg.bbox;
  for (let j = 0; j < px; j++) {
    const by0 = j * unit, by1 = (j + 1) * unit;
    if (by1 < y0 - 1e-9 || by0 > y1 + 1e-9) continue;   // pixel row outside the ink box
    const j0 = Math.ceil(by0 * r - 0.5), j1 = Math.ceil(by1 * r - 0.5);
    for (let i = 0; i < px; i++) {
      const bx0 = i * unit, bx1 = (i + 1) * unit;
      if (bx1 < x0 - 1e-9 || bx0 > x1 + 1e-9) continue;
      const i0 = Math.ceil(bx0 * r - 0.5), i1 = Math.ceil(bx1 * r - 0.5);
      let hit = 0, n = 0;
      for (let b = j0; b < j1; b++) { const y = (b + 0.5) / r; for (let a = i0; a < i1; a++) { n++; if (reg.covered((a + 0.5) / r, y)) hit++; } }
      cov[j * px + i] = n ? hit / n : 0;
    }
  }
  return { cov, px, rate, canvas };
}
/** Ink area in square units = the sum of the bypass coverage at one pixel per unit. */
export const bfInkArea = (reg, { rate = RATE, canvas = reg.canvas } = {}) => sum(bfRasterise(reg, { px: canvas, rate, canvas }).cov);

// ── local darkness ─────────────────────────────────────────────────────────
export function gaussKernel(sigma, rad) { const k = []; let s = 0; for (let i = -rad; i <= rad; i++) { const v = Math.exp(-(i * i) / (2 * sigma * sigma)); k.push(v); s += v; } return k.map((v) => v / s); }
/** Separable blur, white (zero) outside the tile. */
export function blur(cov, px, ker) {
  const rad = (ker.length - 1) / 2, t = new Float64Array(px * px), o = new Float64Array(px * px);
  for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) { let s = 0; for (let k = -rad; k <= rad; k++) { const xx = x + k; if (xx >= 0 && xx < px) s += cov[y * px + xx] * ker[k + rad]; } t[y * px + x] = s; }
  for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) { let s = 0; for (let k = -rad; k <= rad; k++) { const yy = y + k; if (yy >= 0 && yy < px) s += t[yy * px + x] * ker[k + rad]; } o[y * px + x] = s; }
  return o;
}
export const squintPeak = (cov, px, { sigma, rad } = SQUINT) => max(blur(cov, px, gaussKernel(sigma, rad)));
/** Densest 3×3 window: the largest mean coverage over every 3×3 block of pixels. */
export function densest3x3(cov, px) {
  let best = 0;
  for (let y = 0; y + 3 <= px; y++) for (let x = 0; x + 3 <= px; x++) { let s = 0; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s += cov[(y + j) * px + x + i]; if (s / 9 > best) best = s / 9; }
  return best;
}
export function cosine(a, b) { let d = 0, na = 0, nb = 0; for (let k = 0; k < a.length; k++) { d += a[k] * b[k]; na += a[k] * a[k]; nb += b[k] * b[k]; } return d / Math.sqrt(na * nb); }

// ── geometry read straight from the drawing ────────────────────────────────
/** Centreline length of stroked paths (L), weighted by stroke (Lw), outline length of filled ones (P). */
export function lineLengths(icon) {
  let L = 0, Lw = 0, P = 0, nSub = 0;
  for (const p of icon.paths) {
    for (const sp of flatten(p.d)) {
      nSub++; const pts = sp.pts; let len = 0;
      for (let i = 0; i + 1 < pts.length; i++) len += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      if (sp.closed || p.kind === 'area') len += Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]);
      if (p.kind === 'stroke') { L += len; Lw += len * p.weight; } else P += len;
    }
  }
  return { L, Lw, P, nSub };
}
/** §1 "Kind": read from the outline file's own note. */
export const kindOf = (text) => (/<!--\s*keyline:\s*mark\s*-->/.test(text) ? 'mark' : /<!--\s*box:/.test(text) ? 'box' : /<!--\s*anchor:/.test(text) ? 'anchor' : 'silhouette');
export const pathDs = (text) => [...text.matchAll(/<path\b[^>]*?\sd="([^"]+)"/g)].map((m) => m[1]);
/** Path data with whitespace normalised, joined — two files with equal signatures draw the same thing. */
export const pathSignature = (text) => [...text.matchAll(/<path\b[^>]*?\sd="([^"]+)"[^>]*\/>/g)].map((m) => m[1].replace(/\s+/g, ' ').trim()).join('|');

/** Walk a path's absolute positions. `on(kind, from, to, cmdArgs)` for each straight piece, arc and close. */
function walk(d, on) {
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    if (up === 'Z') { on('Z', [cx, cy], [sx, sy]); cx = sx; cy = sy; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; if (k === 0) { sx = x; sy = y; } cx = x; cy = y; } else if (up === 'L') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; on('L', [cx, cy], [x, y]); cx = x; cy = y; } else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; on('H', [cx, cy], [x, cy]); cx = x; } else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; on('V', [cx, cy], [cx, y]); cy = y; } else { const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]]; on('A', [cx, cy], [ex, ey], a); cx = ex; cy = ey; }
    }
  }
}
/** §1.1 "the trigger": a straight horizontal edge at a non-integer y in an area path (bug_scope.mjs). */
export function horizontalEdges(d) {
  const out = [];
  walk(d, (k, [ax, ay], [bx, by]) => {
    if (k === 'H') out.push([ay, Math.abs(bx - ax)]);
    else if ((k === 'L' || k === 'Z') && by === ay && bx !== ax) out.push([ay, Math.abs(bx - ax)]);
  });
  return out;
}
export const hasTrigger = (areaDs) => areaDs.flatMap(horizontalEdges).some(([y]) => Math.abs(y - Math.round(y)) > 1e-9);
/** §3.4 a lens drawn as two arcs between two tips: its widest centreline span, across the tip-to-tip line. */
export function lensWidth(d) {
  const pts = flatten(d).flatMap((sp) => sp.pts), [ax, ay] = pts[0];
  let far = pts[0], best = -1; for (const p of pts) { const dd = Math.hypot(p[0] - ax, p[1] - ay); if (dd > best) { best = dd; far = p; } }
  const ux = (far[0] - ax) / best, uy = (far[1] - ay) / best, side = pts.map(([x, y]) => (x - ax) * uy - (y - ay) * ux);
  return max(side) - min(side);
}
/** §7 an arc whose end point is its start point (zeroarc.mjs). */
export function zeroLengthArcs(d) { const out = []; walk(d, (k, [ax, ay], [bx, by], a) => { if (k === 'A' && Math.abs(bx - ax) < 1e-9 && Math.abs(by - ay) < 1e-9) out.push(`A${a.slice(0, 5).join(' ')} ${bx} ${by}`); }); return out; }

// ── the pin ────────────────────────────────────────────────────────────────
export function listFiles(pin) {
  const out = [];
  for (const master of MASTER_LIST) {
    const dir = join(pin, 'src/icons', String(master));
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) {
      const base = f.replace(/\.svg$/, ''), filled = base.endsWith('-filled');
      out.push({ master, file: join(dir, f), base, key: `${master}/${base}`, concept: filled ? base.slice(0, -7) : base, style: filled ? 'filled' : 'outline' });
    }
  }
  return out;
}

/** One drawing, measured. `classify` adds the raster.mjs (classify-path) numbers the bug is judged by. */
export function measureFile(f, { rate = RATE, classify = false, r64 = false } = {}) {
  const icon = readIcon(f.file), reg = regionOf(icon);
  const own = bfRasterise(reg, { px: icon.canvas, rate }).cov;
  let tot = 0, part = 0; for (const c of own) { tot += c; if (c > 0 && c < PARTIAL) part += c; }
  const sp = icon.paths.filter((p) => p.kind === 'stroke'), ap = icon.paths.filter((p) => p.kind === 'area');
  // a stroke-only (area-only) drawing's split region IS its whole region: identical geometry, identical samples
  const split = (paths, other) => (!paths.length ? 0 : !other.length ? tot : sum(bfRasterise({ ...region(paths, { label: f.file }), canvas: icon.canvas }, { px: icon.canvas, rate }).cov));
  const len = lineLengths(icon), bb = reg.bbox;
  const row = {
    key: f.key, master: f.master, name: f.base, concept: f.concept, style: f.style, canvas: icon.canvas,
    nPaths: icon.paths.length, nStroke: sp.length, nArea: ap.length, nSub: len.nSub, hasArea: ap.length > 0,
    weights: [...new Set(sp.map((p) => p.weight))],
    area: r4(tot), strokeInk: r4(split(sp, ap)), areaInk: r4(split(ap, sp)),
    L: r4(len.L), Lw: r4(len.Lw), P: r4(len.P),
    box: { x0: r4(bb.x0), y0: r4(bb.y0), w: r4(bb.x1 - bb.x0), h: r4(bb.y1 - bb.y0) },
    halfTone: r4(tot > 0 ? part / tot : 0), trigger: hasTrigger(ap.map((p) => p.d)),
  };
  if (f.master === 16) row.cov = Array.from(own, r4);
  if (classify) {
    const { cov } = rasterise(reg, { px: icon.canvas, rate });
    let ct = 0, cp = 0; for (const c of cov) { ct += c; if (c > 0 && c < PARTIAL) cp += c; }
    row.c = { area: r4(ct), halfTone: r4(ct > 0 ? cp / ct : 0) };
    if (f.master === 16) row.c.cov = Array.from(cov);
  }
  if (r64) row.area64 = r4(sum(bfRasterise(reg, { px: icon.canvas, rate: RATE_CHECK }).cov));
  return row;
}

function fingerprint(files) { const h = createHash('sha1'); for (const f of files) { h.update(f.key); h.update(readFileSync(f.file)); } return h.digest('hex'); }

/** Every drawing, measured — in worker threads, optionally through a cache directory the user named. */
export async function measureAll(files, { classify = false, r64 = false, jobs = Math.max(1, availableParallelism() - 1), cache = null, log = () => {} } = {}) {
  const fp = cache ? fingerprint(files) : null, cfile = cache ? join(cache, 'mass-probe-census.json') : null;
  let have = null;
  if (cfile && existsSync(cfile)) { try { const j = JSON.parse(readFileSync(cfile, 'utf8')); if (j.fingerprint === fp && j.rate === RATE) have = j; } catch { have = null; } }
  const okRow = (r) => (!classify || r.c) && (!r64 || r.area64 != null);
  if (have && have.rows.length === files.length && have.rows.every(okRow)) { log(`census: ${files.length} drawings from the cache`); return have.rows; }
  const opts = { rate: RATE, classify: classify || !!have?.rows?.[0]?.c, r64: r64 || have?.rows?.[0]?.area64 != null };
  const t0 = Date.now();
  let rows;
  if (jobs <= 1) rows = files.map((f) => measureFile(f, opts));
  else {
    const shards = Array.from({ length: Math.min(jobs, files.length) }, () => []);
    files.forEach((f, i) => shards[i % shards.length].push(f));
    const parts = await Promise.all(shards.map((shard) => new Promise((res, rej) => {
      const w = new Worker(new URL(import.meta.url), { workerData: { massProbe: true, files: shard, opts } });
      w.once('message', res); w.once('error', rej);
      w.once('exit', (code) => { if (code !== 0) rej(new Error(`worker exited ${code}`)); });
    })));
    const byKey = new Map(parts.flat().map((r) => [r.key, r]));
    rows = files.map((f) => byKey.get(f.key));
  }
  log(`census: ${files.length} drawings measured in ${((Date.now() - t0) / 1000).toFixed(0)} s (${jobs} job${jobs === 1 ? '' : 's'})`);
  if (cfile) { mkdirSync(cache, { recursive: true }); writeFileSync(cfile, JSON.stringify({ fingerprint: fp, rate: RATE, rows })); }
  return rows;
}

// ── Lucide (one reference, compared by line length) ────────────────────────
function bez(p0, p1, p2, p3, n = 32) { const out = []; for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return out; }
function quad(p0, p1, p2, n = 32) { const out = []; for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]); } return out; }
/** Any path `d` → an absolute M L A Z path; Bézier commands become 32 chords each. */
export function simplify(d) {
  let out = '', cx = 0, cy = 0, sx = 0, sy = 0, pc = null, pq = null;
  const L = (x, y) => { out += `L${x} ${y}`; cx = x; cy = y; };
  const chords = (pts) => { for (const [x, y] of pts) out += `L${r5(x)} ${r5(y)}`; };
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    if (up === 'Z') { out += 'Z'; cx = sx; cy = sy; pc = pq = null; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7, C: 6, S: 4, Q: 4, T: 2 }[up];
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step), ox = rel ? cx : 0, oy = rel ? cy : 0;
      if (up === 'M') { const x = a[0] + ox, y = a[1] + oy; if (k === 0) { out += `M${x} ${y}`; sx = x; sy = y; cx = x; cy = y; } else L(x, y); pc = pq = null; } else if (up === 'L') { L(a[0] + ox, a[1] + oy); pc = pq = null; } else if (up === 'H') { L(rel ? cx + a[0] : a[0], cy); pc = pq = null; } else if (up === 'V') { L(cx, rel ? cy + a[0] : a[0]); pc = pq = null; } else if (up === 'A') { const x = a[5] + ox, y = a[6] + oy; out += `A${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${x} ${y}`; cx = x; cy = y; pc = pq = null; } else if (up === 'C') { const p1 = [a[0] + ox, a[1] + oy], p2 = [a[2] + ox, a[3] + oy], p3 = [a[4] + ox, a[5] + oy]; chords(bez([cx, cy], p1, p2, p3)); cx = p3[0]; cy = p3[1]; pc = p2; pq = null; } else if (up === 'S') { const p1 = pc ? [2 * cx - pc[0], 2 * cy - pc[1]] : [cx, cy], p2 = [a[0] + ox, a[1] + oy], p3 = [a[2] + ox, a[3] + oy]; chords(bez([cx, cy], p1, p2, p3)); cx = p3[0]; cy = p3[1]; pc = p2; pq = null; } else if (up === 'Q') { const p1 = [a[0] + ox, a[1] + oy], p2 = [a[2] + ox, a[3] + oy]; chords(quad([cx, cy], p1, p2)); cx = p2[0]; cy = p2[1]; pq = p1; pc = null; } else if (up === 'T') { const p1 = pq ? [2 * cx - pq[0], 2 * cy - pq[1]] : [cx, cy], p2 = [a[0] + ox, a[1] + oy]; chords(quad([cx, cy], p1, p2)); cx = p2[0]; cy = p2[1]; pq = p1; pc = null; }
    }
  }
  return out;
}
const attr = (s, k, dflt = 0) => { const m = new RegExp(`\\b${k}="([^"]+)"`).exec(s); return m ? Number(m[1]) : dflt; };
/** A Lucide SVG → `d` strings (circles, rects, lines, polylines as arcs and lines); null if anything is filled. */
export function lucideShapes(svg) {
  const ds = [];
  for (const m of svg.matchAll(/<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*?)\/?>/g)) {
    const [, tag, a] = m;
    if (/\bfill="(?!none)/.test(a)) return null;
    if (tag === 'path') ds.push(simplify(/\bd="([^"]+)"/.exec(a)[1]));
    else if (tag === 'circle' || tag === 'ellipse') { const cx = attr(a, 'cx'), cy = attr(a, 'cy'), rx = attr(a, tag === 'circle' ? 'r' : 'rx'), ry = tag === 'circle' ? rx : attr(a, 'ry'); ds.push(`M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`); } else if (tag === 'rect') {
      const x = attr(a, 'x'), y = attr(a, 'y'), w = attr(a, 'width'), h = attr(a, 'height'); let rx = attr(a, 'rx', null), ry = attr(a, 'ry', null);
      if (rx == null && ry != null) rx = ry; if (ry == null && rx != null) ry = rx; rx ??= 0; ry ??= 0; rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
      ds.push(rx || ry ? `M${x + rx} ${y}L${x + w - rx} ${y}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}L${x + w} ${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}L${x + rx} ${y + h}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}L${x} ${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z` : `M${x} ${y}L${x + w} ${y}L${x + w} ${y + h}L${x} ${y + h}Z`);
    } else if (tag === 'line') ds.push(`M${attr(a, 'x1')} ${attr(a, 'y1')}L${attr(a, 'x2')} ${attr(a, 'y2')}`);
    else { const pts = /points="([^"]+)"/.exec(a)[1].trim().split(/[\s,]+/).map(Number); let d = ''; for (let i = 0; i + 1 < pts.length; i += 2) d += `${i ? 'L' : 'M'}${pts[i]} ${pts[i + 1]}`; ds.push(d + (tag === 'polygon' ? 'Z' : '')); }
  }
  return ds;
}
/** One Lucide drawing at its own stroke 2 on the 24 grid: bypass ink at rate 32 and centreline length. */
export function lucideMeasure(svg, name, { weight = 2, canvas = 24 } = {}) {
  const ds = lucideShapes(svg); if (!ds) return null;
  const icon = { label: name, canvas, paths: ds.map((d) => ({ d, kind: 'stroke', weight })) };
  const reg = regionOf(icon), area = bfInkArea(reg, { rate: RATE });
  let L = 0; for (const p of icon.paths) for (const sp of flatten(p.d)) { const pts = sp.pts; for (let i = 0; i + 1 < pts.length; i++) L += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); if (sp.closed) L += Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]); }
  const bb = reg.bbox;
  return { name, area: r4(area), L: r4(L), ofCanvas: r5(area / canvas ** 2), ofBbox: r5(area / ((bb.x1 - bb.x0) * (bb.y1 - bb.y0))) };
}
export function loadLucide(refs) {
  const dir = join(refs, 'lucide');
  if (!existsSync(dir)) throw new Error(`no Lucide library at ${dir} (pass --refs <research/references>)`);
  const names = readdirSync(dir).filter((x) => x.endsWith('.svg')).sort(), rows = [], skipped = [];
  const bezier = { cubic: 0, quadratic: 0 }, bezierAll = { cubic: 0, quadratic: 0 };
  for (const f of names) {
    const svg = readFileSync(join(dir, f), 'utf8'), ds = [...svg.matchAll(/\sd="([^"]*)"/g)].map((m) => m[1]);
    const n = { cubic: sum(ds.map((d) => (d.match(/[CcSs]/g) || []).length)), quadratic: sum(ds.map((d) => (d.match(/[QqTt]/g) || []).length)) };
    const r = lucideMeasure(svg, f.replace(/\.svg$/, ''));
    for (const k of Object.keys(n)) { bezierAll[k] += n[k]; if (r) bezier[k] += n[k]; }
    if (r) rows.push(r); else skipped.push(f);
  }
  return { rows, skipped, files: names.length, bezier, bezierAll };
}

// ── the context every section reads ────────────────────────────────────────
export function buildContext(files, rows) {
  const texts = new Map(files.map((f) => [f.key, readFileSync(f.file, 'utf8')]));
  for (const x of rows) { x.ofCanvas = r5(x.area / x.canvas ** 2); x.ofBbox = r5(x.area / (x.box.w * x.box.h)); }
  const M = [...rows].sort((a, b) => b.master - a.master || a.name.localeCompare(b.name, 'en'));   // the saved census' order
  const byMS = (m, s) => M.filter((x) => x.master === m && x.style === s);
  const concepts = [...new Set(rows.map((r) => r.concept))].sort();
  const at = new Map(rows.map((r) => [`${r.concept}|${r.master}|${r.style}`, r]));
  const get = (c, m, s) => at.get(`${c}|${m}|${s}`);
  const kinds = {}; for (const f of files) if (f.style === 'outline') (kinds[f.concept] ??= {})[f.master] = kindOf(texts.get(f.key));
  const patch = new Map(); for (const r of rows) if (r.master === 16) patch.set(r.name, { patch3: r4(densest3x3(r.cov, 16)), squint: r4(squintPeak(r.cov, 16, SQUINT)) });
  const sig = new Map(); for (const f of files) { const k = `${f.master}|${f.style}|${pathSignature(texts.get(f.key))}`; (sig.get(k) ?? sig.set(k, []).get(k)).push(f.concept); }
  const twins = (c, m, s) => { for (const [k, v] of sig) if (k.startsWith(`${m}|${s}|`) && v.includes(c)) return v.filter((x) => x !== c); return []; };
  const med = {}; for (const s of ['outline', 'filled']) for (const m of MASTER_LIST) med[`${m}${s}`] = q(byMS(m, s).map((x) => x.area), 0.5);
  return { files, rows, M, byMS, concepts, get, kinds, patch, sig, twins, med, texts };
}

// ── shared derivations (several sections print the same quantity) ──────────
export function lucideIndex(L) { return Object.fromEntries(L.rows.map((r) => [r.name, r])); }
/** §3.2 / §3.3 evidence: siblings, Lucide line ratio, line overlap, densest patch. */
export function evidence(X, luc, c) {
  const o16 = X.byMS(16, 'outline'), r = o16.find((x) => x.concept === c);
  const sibs = o16.filter((x) => stemOf(x.concept) === stemOf(c) && sizeOf(x.concept) === sizeOf(c) && x !== r && !X.twins(c, 16, 'outline').includes(x.concept));
  const la = LUCIDE_BY_STEM[stemOf(c)] && sizeOf(c) === 'default' ? luc[LUCIDE_BY_STEM[stemOf(c)]] : null;
  const a24 = X.get(c, 24, 'outline');
  return { r, sibs, sibRatio: sibs.length ? r.area / q(sibs.map((x) => x.area), 0.5) : null, la, lucRatio: la ? a24.L / la.L : null, weld: r.strokeInk / r.Lw, patch3: X.patch.get(c).patch3 };
}
export function denseRows(X, luc) {
  const md0 = X.med['16outline'], o16 = X.byMS(16, 'outline');
  const dense = o16.filter((x) => x.area / md0 >= 1.5).sort((a, b) => b.area - a.area);
  const seen = new Set(), out = [];
  for (const d of dense) {
    if (seen.has(d.concept)) continue; const tw = X.twins(d.concept, 16, 'outline'); tw.forEach((t) => seen.add(t)); seen.add(d.concept);
    out.push({ d, tw, e: evidence(X, luc, d.concept) });
  }
  return { dense, out };
}
export function hairRows(X, luc) {
  const md0 = X.med['16outline'], hair = X.byMS(16, 'outline').filter((x) => x.area / md0 < 0.5).sort((a, b) => a.area - b.area);
  const dl = (c) => c.replace(/-(up|down|left|right)(?=-|$)/, '-dir').replace(/more-(horizontal|vertical)/, 'more-dir');
  const used = new Set(), out = [];
  for (const d of hair) {
    if (used.has(d.concept)) continue;
    const grp = hair.filter((x) => !used.has(x.concept) && dl(x.concept) === dl(d.concept) && Math.abs(x.area - d.area) <= 0.06); grp.forEach((x) => used.add(x.concept));
    out.push({ d, grp, e: evidence(X, luc, d.concept) });
  }
  return { hair, out };
}
export function crowdedRows(X) {
  const o16 = X.byMS(16, 'outline'), w = o16.filter((x) => x.strokeInk / x.Lw < CROWDED).sort((a, b) => a.strokeInk / a.Lw - b.strokeInk / b.Lw);
  const k = o16.filter((x) => X.patch.get(x.concept).patch3 >= KNOT_NEAR).sort((a, b) => X.patch.get(b.concept).patch3 - X.patch.get(a.concept).patch3);
  const names = new Map(); for (const x of [...w, ...k.filter((y) => X.patch.get(y.concept).patch3 >= KNOT)]) names.set(x.concept, x);
  const weld = (c, m) => { const y = X.get(c, m, 'outline'); return y.strokeInk / y.Lw; };
  const body = [...names.values()].map((x) => ({ c: x.concept, area: x.area, w16: weld(x.concept, 16), w20: weld(x.concept, 20), w24: weld(x.concept, 24), ...X.patch.get(x.concept) }))
    .sort((a, b) => Number(f2(a.w16)) - Number(f2(b.w16)));
  return { body, near: k.filter((y) => X.patch.get(y.concept).patch3 < KNOT) };
}
export function matchedLucide(X, luc) {
  const out = [];
  for (const c of X.concepts) { const a = LUCIDE_BY_CONCEPT[c]; if (!a || !luc[a]) continue; const o24 = X.get(c, 24, 'outline'), o16 = X.get(c, 16, 'outline'); out.push({ c, a, r24: (o24.L / 24) / (luc[a].L / 24), r16: (o16.L / 16) / (luc[a].L / 24), o24: o24.L / 24, o16: o16.L / 16, l: luc[a].L / 24 }); }
  return out.sort((x, y) => y.r24 - x.r24);
}
export function filledFamilies(X) {
  const f16 = X.byMS(16, 'filled').sort((a, b) => b.area - a.area), groups = new Map();
  for (const r of f16) { const k = stemOf(r.concept); (groups.get(k) ?? groups.set(k, []).get(k)).push(r); }
  return [...groups.entries()].map(([k, v]) => ({ k, top: [...v].sort((a, b) => b.area - a.area)[0], n: v.length, lo: min(v.map((x) => x.area)), hi: max(v.map((x) => x.area)) })).sort((a, b) => b.top.area - a.top.area);
}
export function ratioRows(X) {
  return MASTER_LIST.map((m) => { const d = X.concepts.map((c) => { const f = X.get(c, m, 'filled'), o = X.get(c, m, 'outline'); return { r: f.area / o.area, lh: f.nArea === 0 }; }); return { m, lh: d.filter((x) => x.lh).map((x) => x.r), sh: d.filter((x) => !x.lh).map((x) => x.r) }; });
}
export function driftOf(X, s) { return X.concepts.map((c) => ({ c, r20: X.get(c, 20, s).ofCanvas / X.get(c, 24, s).ofCanvas, r16: X.get(c, 16, s).ofCanvas / X.get(c, 24, s).ofCanvas, a: X.get(c, 24, s), b: X.get(c, 16, s) })); }
export function bandMoves(X, s) {
  const a24 = X.concepts.map((c) => X.get(c, 24, s)), a20 = X.concepts.map((c) => X.get(c, 20, s)), a16 = X.concepts.map((c) => X.get(c, 16, s));
  const dd = (A, B, mA, mB) => A.map((x, i) => Math.abs(bandIndex(x.area, mA) - bandIndex(B[i].area, mB)));
  return { a24, a20, a16, d20: dd(a24, a20, X.med[`24${s}`], X.med[`20${s}`]), d16: dd(a24, a16, X.med[`24${s}`], X.med[`16${s}`]) };
}
export function threeWays(X, s) {
  const r = X.byMS(16, s);
  return { r, ink: r.map((x) => x.area), sq: r.map((x) => X.patch.get(x.name).squint), p3: r.map((x) => X.patch.get(x.name).patch3), w: r.map((x) => x.weights) };
}
export function sigmaSweep(X) {
  const res = {};
  for (const sigma of SIGMAS) {
    const ker = gaussKernel(sigma, Math.ceil(3 * sigma));
    for (const st of ['outline', 'filled']) {
      const r = X.rows.filter((x) => x.master === 16 && x.style === st), v = r.map((x) => max(blur(x.cov, 16, ker)));
      (res[sigma] ??= {})[st] = { spread: max(v) / min(v), p9010: q(v, 0.9) / q(v, 0.1), rho: spearmanStable(v, r.map((x) => x.area)) };
    }
  }
  return res;
}
export function varianceSplit(X, m, s) {
  const r = X.byMS(m, s), lc = r.map((x) => Math.log(x.ofCanvas)), lb = r.map((x) => Math.log(x.box.w * x.box.h / m ** 2)), lp = r.map((x) => Math.log(x.ofBbox));
  const mean = (a) => sum(a) / a.length, cov = (a, b) => { const ma = mean(a), mb = mean(b); return mean(a.map((x, i) => (x - ma) * (b[i] - mb))); }, V = cov(lc, lc);
  return { foot: cov(lc, lb) / V, pack: cov(lc, lp) / V };
}
export function weldStats(X, m) { const r = X.byMS(m, 'outline'), w = r.map((x) => x.strokeInk / x.Lw); return { w, below: r.filter((x) => x.strokeInk / x.Lw < CROWDED).length }; }
export function kindRows(X, s, m, k) { return X.byMS(m, s).filter((x) => X.kinds[x.concept][m] === k); }
export function seedPairs(X, style) {
  const ker = gaussKernel(SEED.sigma, SEED.rad);
  const items = X.rows.filter((r) => r.master === 16 && r.style === style).map((r) => { const b = blur(r.cov, 16, ker); return { concept: r.concept, v: b, n: Math.hypot(...b), raw: r.cov }; });
  const stemP = (c) => c.replace(/-(small|large)$/, '').replace(/-\d+$/, '').replace(/-(left|right|up|down)$/, '');
  const pairs = []; let identical = 0, total = 0;
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    total++; let d = 0; for (let k = 0; k < 256; k++) d += items[i].v[k] * items[j].v[k];
    pairs.push([d / (items[i].n * items[j].n), items[i].concept, items[j].concept]);
    if (cosine(items[i].raw, items[j].raw) >= IDENTICAL_COS) identical++;
  }
  pairs.sort((a, b) => b[0] - a[0]);
  const cross = pairs.filter(([s, a, b]) => stemP(a) !== stemP(b) && s < IDENTICAL_COS).slice(0, 40).map(([s, a, b]) => [r4(s), a, b]);
  const pick = (n) => { const seen = new Set(), out = []; for (const [s, a, b] of cross) { const k = [stemP(a), stemP(b)].sort().join('|'); if (seen.has(k)) continue; seen.add(k); out.push([s, a, b]); if (out.length === n) break; } return out; };
  return { pick, identical, total };
}
export function duplicates(X) {
  const g = new Map();
  for (const f of X.files) { const k = `${f.master}|${f.style}|${pathSignature(X.texts.get(f.key))}`; (g.get(k) ?? g.set(k, []).get(k)).push(f.concept); }
  const sets = new Map(); let groups = 0, inGroups = 0;
  for (const [k, v] of g) if (v.length > 1) { groups++; inGroups += v.length; const [m, s] = k.split('|'); const name = [...v].sort().join(' = '); const e = sets.get(name) ?? { outline: [], filled: [] }; e[s].push(+m); sets.set(name, e); }
  return { groups, inGroups, sets: [...sets.entries()].sort() };
}
export function bugScope(X) {
  const shape = X.rows.filter((r) => r.hasArea), d = (r) => r.area - r.c.area;
  const grp = (label, rs) => { const ad = rs.map((r) => Math.abs(d(r))); return { label, n: rs.length, area: rs.some((r) => r.hasArea), changed: rs.filter((r) => Math.abs(d(r)) > CHANGED).length, big: rs.filter((r) => Math.abs(d(r)) > CHANGED_BIG).length, maxd: rs.length ? max(ad) : 0 }; };
  const groups = [grp('outline (stroke only)', X.rows.filter((r) => r.style === 'outline' && !r.hasArea)), grp('filled, line-heavy (stroke only)', X.rows.filter((r) => r.style === 'filled' && !r.hasArea)), grp('filled, shape (has area paths)', shape)];
  const outlineWithArea = X.rows.filter((r) => r.style === 'outline' && r.hasArea).length;
  const maxd = max(shape.map((r) => Math.abs(d(r)))), top = shape.filter((r) => Math.abs(d(r)) > maxd - 0.005);
  const rel = [...shape].sort((a, b) => Math.abs(d(b)) / b.area - Math.abs(d(a)) / a.area)[0];
  const trig = shape.filter((r) => r.trigger), changed = (r) => Math.abs(d(r)) > CHANGED;
  const byMaster = MASTER_LIST.map((m) => ({ m, trig: trig.filter((r) => r.master === m).length, changed: shape.filter((r) => r.master === m && changed(r)).length }));
  let pxFiles = 0, pxTotal = 0, pxMax = 0; const s16 = shape.filter((r) => r.master === 16);
  for (const r of s16) { let n = 0; for (let i = 0; i < 256; i++) { const e = Math.abs(r.c.cov[i] - r.cov[i]); if (e > PX_DIFF) n++; if (e > pxMax) pxMax = e; } if (n) pxFiles++; pxTotal += n; }
  const most = [...shape].sort((a, b) => Math.abs(d(b)) - Math.abs(d(a))).slice(0, 24);
  return { groups, outlineWithArea, maxd, top, rel, relShare: Math.abs(d(rel)) / rel.area, trig, trigChanged: trig.filter(changed).length, trigSame: trig.filter((r) => !changed(r)).length, noTrigChanged: shape.filter((r) => !r.trigger && changed(r)).length, shapeN: shape.length, byMaster, pxFiles, pxTotal, pxMax, s16: s16.length, most };
}
export function classifyPatch(X) {
  let sq = 0, sqMax = 0, p3 = 0, p3Max = 0, n = 0;
  for (const r of X.rows.filter((x) => x.master === 16)) {
    n++; const now = X.patch.get(r.name), was = { patch3: r4(densest3x3(r.c.cov, 16)), squint: r4(squintPeak(r.c.cov, 16, SQUINT)) };
    const ds = Math.abs(now.squint - was.squint), dp = Math.abs(now.patch3 - was.patch3);
    if (ds > STAT_DIFF) sq++; if (dp > STAT_DIFF) p3++; sqMax = Math.max(sqMax, ds); p3Max = Math.max(p3Max, dp);
  }
  const ht = X.rows.map((r) => ({ r, d: Math.abs(r.halfTone - r.c.halfTone) })), htChanged = ht.filter((x) => x.d > STAT_DIFF);
  return { n, sq, sqMax, p3, p3Max, ht: htChanged.length, htMax: max(ht.map((x) => x.d)), htAllShape: htChanged.every((x) => x.r.hasArea) };
}
const classifyMedian16Filled = (X) => q(X.byMS(16, 'filled').map((x) => x.c.area), 0.5);
const pooled = (vals) => ({ lo: min(vals), med: q(vals, 0.5), hi: max(vals) });

// ── printing ───────────────────────────────────────────────────────────────
const out = (...l) => console.log(...l);
const head = (t) => out(`\n## ${t}`);
const fig = (label, value) => out(`- ${label}: ${value}`);

function wave0(X) {
  const all = X.M.map((x) => x.ofCanvas), lo = X.M.reduce((a, b) => (b.ofCanvas < a.ofCanvas ? b : a)), hi = X.M.reduce((a, b) => (b.ofCanvas > a.ofCanvas ? b : a));
  const o16 = [...X.byMS(16, 'outline')].sort((a, b) => a.area - b.area), f16 = [...X.byMS(16, 'filled')].sort((a, b) => a.area - b.area);
  const at = (c) => X.get(c, 16, 'outline');
  return { all, lo, hi, o16, f16, at };
}

const SECTIONS = {
  intro: { need: { rows: 1, classify: 1, r64: 1 }, run(X) {
    head('Front matter and method paragraph (doc lines 3–11)');
    const nc = X.concepts.length;
    fig('concepts × masters × styles = drawings', `${nc} × ${MASTER_LIST.length} × 2 = ${X.rows.length.toLocaleString('en-US')}`);
    const d = X.rows.map((r) => Math.abs(r.area64 - r.area));
    fig(`rate ${RATE_CHECK} against rate ${RATE}, all ${X.rows.length.toLocaleString('en-US')} drawings: mean |Δ| px² · max |Δ| px²`, `${f2(sum(d) / d.length)} · ${f2(max(d))}`);
    const b = bugScope(X);
    fig('filled drawings whose ink the classify bug changes (> 0.05 px²)', b.groups[2].changed);
    fig('outline figures identical either way (outline files changed)', b.groups[0].changed);
    const sample = X.files.filter((_, i) => i % CHROMIUM_SAMPLE.every === CHROMIUM_SAMPLE.offset);
    fig('Chromium sample (every 24th file from offset 5): drawings · at 16 · at 20 · at 24', `${sample.length} · ${sample.filter((f) => f.master === 16).length} · ${sample.filter((f) => f.master === 20).length} · ${sample.filter((f) => f.master === 24).length}`);
    const h = X.get('help', 24, 'outline');
    fig('`help` 24 scaled to 16 (24-master ink × (16/24)²), px²', f1(h.area * (16 / 24) ** 2));
    out('- (not reprinted: the Chromium medians/percentiles — a browser render; `globe-2` 102.14 — the reviewer\'s own numpy rasteriser)');
  } },

  s0: { need: { rows: 1, classify: 1, lucide: 1 }, run(X, L) {
    head('§0 The short version');
    const { w } = weldStats(X, 16);
    fig('ink ÷ (line × stroke), 16 outline: median · drawings below 0.90 (of 485)', `${f2(q(w, 0.5))} · ${weldStats(X, 16).below} of ${w.length}`);
    const o = [...X.byMS(16, 'outline')].sort((a, b) => a.area - b.area), top = o.filter((x) => x.area === o.at(-1).area);
    fig('16 outline row: lightest', `${f1(o[0].area)} px² (${tick(o[0].name)}, ${pc(o[0].ofCanvas)}%)`);
    fig('16 outline row: heaviest', `${f1(o.at(-1).area)} px² (${top.map((x) => tick(x.name)).join(' ≡ ')}, ${pc(o.at(-1).ofCanvas)}%)`);
    fig('16 outline row: heaviest ÷ lightest', `${f1(o.at(-1).area / o[0].area)}×`);
    const all = X.M.map((x) => x.ofCanvas);
    fig('pooled, all 2,910: lightest % · heaviest % · ratio', `${pc(min(all))}% · ${pc(max(all))}% · ${f1(max(all) / min(all))}×`);
    const t = threeWays(X, 'outline'), sig = sigmaSweep(X);
    fig('16 outline, squint peak p90 ÷ p10 · total ink p90 ÷ p10', `${f1(q(t.sq, 0.9) / q(t.sq, 0.1))}× · ${f1(q(t.ink, 0.9) / q(t.ink, 0.1))}×`);
    fig('squint more level than ink at every σ in 1.0–2.5', SIGMAS.every((s) => sig[s].outline.p9010 < q(t.ink, 0.9) / q(t.ink, 0.1)) ? 'yes' : 'no');
    const mk = kindRows(X, 'outline', 16, 'mark'), si = kindRows(X, 'outline', 16, 'silhouette');
    const within = (r, f) => r.filter((x) => Math.abs(x.area / q(r.map((y) => y.area), 0.5) - 1) <= f).length;
    fig('16 outline marks: n · median % of canvas', `${mk.length} · ${f1(q(mk.map((x) => x.ofCanvas * 100), 0.5))}%`);
    fig('16 outline silhouette objects: n · median % · within ±25% of own median', `${si.length} · ${f1(q(si.map((x) => x.ofCanvas * 100), 0.5))}% · ${Math.round(100 * within(si, 0.25) / si.length)}%`);
    const vs = varianceSplit(X, 16, 'outline');
    fig('variance of 16 outline ink share: footprint · packing', `${Math.round(100 * vs.foot)}% · ${Math.round(100 * vs.pack)}%`);
    const r16 = X.byMS(16, 'outline');
    fig('rank correlation of ink, 16 outline: with line length · with path count', `${f2(spearman(r16.map((x) => x.area), r16.map((x) => x.L + x.P)))} · ${f2(spearman(r16.map((x) => x.area), r16.map((x) => x.nPaths)))}`);
    const luc = lucideIndex(L), dn = denseRows(X, luc), lr = dn.out.map((x) => x.e.lucRatio).filter((v) => v != null);
    fig('Dense band, 16 outline: drawings · distinct', `${dn.dense.length} · ${dn.out.length}`);
    fig('Dense distinct drawings: our line ÷ Lucide\'s (min–max)', `${f2(min(lr))}–${f2(max(lr))}× (${lr.length} of ${dn.out.length} with a Lucide match)`);
    const mt = matchedLucide(X, luc);
    fig('matched Lucide concepts · median our line ÷ Lucide\'s (24) · rank correlation (24)', `${mt.length} · ${f2(q(mt.map((m) => m.r24), 0.5))}× · ${f2(spearmanStable(mt.map((m) => m.o24), mt.map((m) => m.l)))}`);
    const cr = crowdedRows(X).body;
    fig('crowded at 16 (ink ÷ line·stroke < 0.90, or a 3×3 ≥ 0.90)', cr.map((x) => tick(x.c)).join(', '));
    fig('share of their line lying on other line (1 − ink ÷ line·stroke, 16)', `${Math.round(100 * (1 - max(cr.map((x) => x.w16))))}–${Math.round(100 * (1 - min(cr.map((x) => x.w16))))}%`);
    const k3 = [...X.byMS(16, 'outline')].sort((a, b) => X.patch.get(b.name).patch3 - X.patch.get(a.name).patch3).slice(0, 3);
    fig('darkest local patch (densest 3×3) in the 16 outline set, top three', k3.map((x) => `${tick(x.name)} ${f2(X.patch.get(x.name).patch3)}`).join(', '));
    const sm = bandMoves(X, 'outline');
    fig('rank correlation 24→16 (outline ink share)', f3(spearman(sm.a24.map((x) => x.ofCanvas), sm.a16.map((x) => x.ofCanvas))));
    const dr = driftOf(X, 'outline');
    fig('median ink share 16 ÷ 24 · 20 ÷ 24 (outline)', `${f2(q(dr.map((x) => x.r16), 0.5))} · ${f2(q(dr.map((x) => x.r20), 0.5))}`);
    fig('outline concepts moving two or more bands, 24→16 · 24→20', `${sm.d16.filter((v) => v >= 2).length} · ${sm.d20.filter((v) => v >= 2).length}`);
    const f16 = X.byMS(16, 'filled'), md = X.med['16filled'], lv = f16.filter((x) => bandOf(x.area, md) === 'Level'), de = f16.filter((x) => bandOf(x.area, md) === 'Dense').sort((a, b) => a.area - b.area);
    fig('16 filled row: Level share · Dense share', `${Math.round(100 * lv.length / f16.length)}% · ${Math.round(100 * de.length / f16.length)}%`);
    fig('16 filled Dense: px² range · % of canvas', `${f1(de[0].area)}–${f1(de.at(-1).area)} px² · ${pc(de[0].ofCanvas)}–${pc(de.at(-1).ofCanvas)}%`);
    fig('16 filled Dense: largest ink ÷ own outline', `${f2(max(de.map((x) => x.area / X.get(x.concept, 16, 'outline').area)))}×`);
    const b = bugScope(X);
    fig('bug: shape-filled drawings changed (of all shape-filled) · largest change px² · largest share of the true ink', `${b.groups[2].changed} of ${b.shapeN.toLocaleString('en-US')} · ${f1(b.maxd)} · ${pc(b.relShare)}%`);
    fig('bug: outline and line-heavy filled drawings changed', b.groups[0].changed + b.groups[1].changed);
  } },

  s1: { need: { rows: 1, classify: 1, lucide: 1 }, run(X, L) {
    head('§1 What was measured, exactly');
    const so = X.rows.filter((r) => !r.hasArea), eq = so.filter((r) => Math.abs(r.area - r.c.area) < 1e-3);
    fig('bypass ink equals density().area (classify path) on stroke-only files', `${eq.length} of ${so.length}`);
    fig('shape-filled files where they differ by > 0.05 px²', bugScope(X).groups[2].changed);
    const sample = X.files.filter((_, i) => i % BOX_SAMPLE_EVERY === 0); let worst = 0, worstKey = '';
    for (const f of sample) { const reg = regionOf(readIcon(f.file)), bb = reg.bbox, ib = inkBox(reg, { rate: RATE }); const dd = Math.max(Math.abs(bb.x0 - ib.x0), Math.abs(bb.y0 - ib.y0), Math.abs(bb.x1 - ib.x1), Math.abs(bb.y1 - ib.y1)); if (dd > worst) { worst = dd; worstKey = f.key; } }
    fig(`ink box (polyline bbox ± half stroke) against grid-walked inkBox, ${sample.length}-drawing sample: max |Δ|`, `${f3(worst)} (${tick(worstKey)}; sample step 1/${RATE} = ${1 / RATE})`);
    const top = [...X.M].sort((a, b) => b.ofBbox - a.ofBbox).slice(0, 3), minus = MASTER_LIST.map((m) => X.get('minus', m, 'outline'));
    fig('packing (ink ÷ ink box): highest three in the set', top.map((x) => `${tick(`${x.master}/${x.name}`)} ${pc(x.ofBbox)}%`).join(', '));
    fig('packing of `minus` at 24 · 20 · 16', minus.map((x) => `${Math.round(100 * x.ofBbox)}%`).join(' · '));
    fig('Lucide: measured of local files · skipped (a fill)', `${L.rows.length} of ${L.files} · ${L.skipped.join(', ')}`);
    fig('Lucide: Bézier command letters flattened, measured files (cubic + quadratic)', `${L.bezier.cubic + L.bezier.quadratic} (${L.bezier.cubic} + ${L.bezier.quadratic}); all ${L.files} files ${L.bezierAll.cubic + L.bezierAll.quadratic}`);
    const w = wave0(X);
    fig('reproduced: pooled min · median · max % of canvas', `${(100 * min(w.all)).toFixed(2)}% · ${(100 * q(w.all, 0.5)).toFixed(2)}% · ${(100 * max(w.all)).toFixed(2)}% (${tick(`${w.lo.master}/${w.lo.name}`)}, ${tick(`${w.hi.master}/${w.hi.name}`)}), ${f1(max(w.all) / min(w.all))}×`);
    const heavy = [...w.o16].reverse().slice(0, 8);
    fig('reproduced: 16 outline lightest', `${tick(w.o16[0].name)} ${f2(w.o16[0].area)} px²`);
    fig('reproduced: 16 outline heaviest eight', heavy.map((x) => `${tick(x.name)} ${f2(x.area)}`).join(', '));
    const h24 = X.get('help', 24, 'outline'), h16 = X.get('help', 16, 'outline');
    fig('`help` 24 scaled to 16 · `help` 16 at its own stroke, px²', `${f2(h24.area * (16 / 24) ** 2)} · ${f2(h16.area)}`);
  } },

  's1.1': { need: { rows: 1, classify: 1 }, run(X) {
    head('§1.1 A bug in raster.mjs, and what it did to these numbers');
    out('Closed forms against rasterise/inkArea (classify path) and the bypass — 16 px, rate 32, column 8:');
    out(table(['Case', 'Closed form', '`rasterise` / `inkArea`', 'Bypass'], bugCases().map((c) => [c.label, c.closed, c.classify, c.bypass]), ['l', 'l', 'l', 'l']));
    const b = bugScope(X);
    out('\nScope across the set (bypass − classify, rate 32):');
    const rowFor = (g, last) => [g.label, g.n.toLocaleString('en-US'), g.area ? 'yes' : 'no', `**${g.changed}**`, g.big, last];
    const big = `${f1(b.maxd)} px² (${b.top.map((r) => `${tick(r.key)}, ${f2(r.c.area)} → ${f2(r.area)}`).join('; ')}); ${pc(b.relShare)}% of the true ink (${tick(b.rel.key)}, ${f2(b.rel.c.area)} → ${f2(b.rel.area)})`;
    out(table(['Drawings', 'Files', 'Area paths?', 'Ink changed by > 0.05 px²', 'by > 0.5 px²', 'Largest change'], [rowFor(b.groups[0], f3(b.groups[0].maxd)), rowFor(b.groups[1], f3(b.groups[1].maxd)), rowFor(b.groups[2], big)], ['l', 'r', 'l', 'r', 'r', 'l']));
    fig('outline files with an area path', b.outlineWithArea);
    fig('shape-filled files with the trigger (straight horizontal edge at a non-integer y) · of those changed · unchanged · changed without it', `${b.trig.length} of ${b.shapeN.toLocaleString('en-US')} · ${b.trigChanged} · ${b.trigSame} · ${b.noTrigChanged}`);
    fig('changed by master: 24 · 20 · 16', b.byMaster.map((x) => x.changed).join(' · '));
    fig(`at 16, rasterise pixels off by > ${PX_DIFF} · files · of shape-filled 16 files · largest single-pixel error`, `${b.pxTotal} · ${b.pxFiles} · ${b.s16} · ${f3(b.pxMax)}`);
    const most = b.most.map((r) => Math.abs(r.area - r.c.area));
    fig(`the ${b.most.length} shape-filled files the bug moves most: change range px²`, `${f1(min(most))}–${f1(max(most))}`);
    const sample = X.files.filter((_, i) => i % CHROMIUM_SAMPLE.every === CHROMIUM_SAMPLE.offset), byKey = new Map(X.rows.map((r) => [r.key, r]));
    fig('Chromium sample: drawings with area paths', `${sample.filter((f) => byKey.get(f.key).hasArea).length} of ${sample.length}`);
    fig('raster.mjs as imported here: md5 (the document read it as `cf73aa36…`; = `git show 6293f80:tools/audit/raster.mjs | md5`)', createHash('md5').update(readFileSync(join(HERE, 'raster.mjs'))).digest('hex'));
    const cp = classifyPatch(X);
    fig(`what it touched — squint peak changed (of ${cp.n} 16-master drawings) · largest change`, `${cp.sq} · ${f3(cp.sqMax)}`);
    fig('what it touched — densest 3×3 changed · largest change', `${cp.p3} · ${f3(cp.p3Max)}`);
    fig('what it touched — half-tone share changed (files) · largest change · all shape-filled', `${cp.ht} · ${f3(cp.htMax)} · ${cp.htAllShape ? 'yes' : 'no'}`);
    const w = wave0(X), at = w.at;
    out('\nWave-0 figures, measured (bypass, rate 32):');
    fig('density range min · median · max', `${(100 * min(w.all)).toFixed(2)}% (${tick(`${w.lo.master}/${w.lo.name}`)}, ${f2(w.lo.area)} px²) · ${(100 * q(w.all, 0.5)).toFixed(2)}% · ${(100 * max(w.all)).toFixed(2)}% (${tick(`${w.hi.master}/${w.hi.name}`)}, ${f2(w.hi.area)} px²)`);
    fig('pooled spread', `${f2(max(w.all) / min(w.all))}×`);
    fig('16 outline row spread', `${f2(w.o16.at(-1).area / w.o16[0].area)}×`);
    fig('`minus-small`', `${f2(at('minus-small').area)} / ${(100 * at('minus-small').ofCanvas).toFixed(2)}%`);
    fig('`language-3`, `globe-2`', `${f2(at('language-3').area)} / ${(100 * at('language-3').ofCanvas).toFixed(2)}%; ${f2(at('globe-2').area)}`);
    fig('`language-2`, `globe`; `table`; `printer`; `target`; `bug-2`', ['language-2', 'table', 'printer', 'target', 'bug-2'].map((c) => f2(at(c).area)).join('; ') + `; globe ${f2(at('globe').area)}`);
    fig('next lightest: `more-horizontal` / `more-vertical`; the four `chevron-*-small`', `${f2(at('more-horizontal').area)} / ${f2(at('more-vertical').area)}; ${['down', 'left', 'right', 'up'].map((d) => f2(at(`chevron-${d}-small`).area)).join(' / ')}`);
    fig('16 filled heaviest; spread', `${tick(w.f16.at(-1).name)} ${(100 * w.f16.at(-1).ofCanvas).toFixed(2)}%; ${f2(w.f16.at(-1).area / w.f16[0].area)}×`);
    out('- (crispness rows — 312 · 0.189 · 0.285 · 0.750 and the 0.70–0.75 band — are F7 figures: tools/audit/grid-probe.mjs)');
    const f16 = X.byMS(16, 'filled'), oldMed = classifyMedian16Filled(X), newMed = X.med['16filled'];
    fig('16 filled median px², classify → bypass', `${f2(oldMed)} → ${f2(newMed)}`);
    fig('16 filled Dense count, classify → bypass', `${f16.filter((x) => x.c.area / oldMed >= 1.5).length} → ${f16.filter((x) => x.area / newMed >= 1.5).length}`);
  } },

  's1.1r64': { need: { rows: 1, r64: 1 }, run(X) {
    head(`§1.1 Stable to the sampling rate (rate ${RATE_CHECK})`);
    const f16 = X.byMS(16, 'filled'), m64 = q(f16.map((x) => x.area64), 0.5), m32 = X.med['16filled'];
    fig(`16 filled median px², rate ${RATE_CHECK} (rate ${RATE})`, `${f2(m64)} (${f2(m32)})`);
    fig(`16 filled band counts, rate ${RATE_CHECK} · rate ${RATE}`, `${BANDS.map(([n]) => f16.filter((x) => bandOf(x.area64, m64) === n).length).join(' · ')} — ${BANDS.map(([n]) => f16.filter((x) => bandOf(x.area, m32) === n).length).join(' · ')}`);
    const p64 = pooled(X.rows.map((x) => 100 * x.area64 / x.canvas ** 2)), p32 = pooled(X.rows.map((x) => 100 * x.area / x.canvas ** 2));
    fig(`pooled min · median · max %, rate ${RATE_CHECK} (rate ${RATE})`, `${f3(p64.lo)} · ${f3(p64.med)} · ${f3(p64.hi)} (${f3(p32.lo)} · ${f3(p32.med)} · ${f3(p32.hi)})`);
    const d = X.rows.map((r) => Math.abs(r.area64 - r.area));
    fig(`rate ${RATE_CHECK} − rate ${RATE} over all ${X.rows.length.toLocaleString('en-US')}: mean |Δ| · max |Δ| px²`, `${f2(sum(d) / d.length)} · ${f2(max(d))}`);
  } },

  's2.1': { need: { rows: 1 }, run(X) {
    head('§2.1 Ink by master and style');
    const body = [];
    for (const s of ['outline', 'filled']) for (const m of MASTER_LIST) {
      const r = [...X.byMS(m, s)].sort((a, b) => a.area - b.area), a = r.map((x) => x.area), c = r.map((x) => x.ofCanvas * 100);
      body.push([m, s, `${f1(c[0])} (${tick(r[0].name)})`, f1(q(c, 0.05)), f1(q(c, 0.25)), `**${f1(q(c, 0.5))}** (${f1(q(a, 0.5))} px²)`, f1(q(c, 0.75)), f1(q(c, 0.95)), `${f1(c.at(-1))} (${tick(r.at(-1).name)})`, `${f1(a.at(-1) / a[0])}×`, `${f2(q(a, 0.9) / q(a, 0.1))}×`]);
    }
    out(table(['Master', 'Style', 'Lightest, % of canvas', 'p5', 'p25', 'Median (ink in px²)', 'p75', 'p95', 'Heaviest', 'Heaviest ÷ lightest', 'p90 ÷ p10'], body, ['l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'l', 'r', 'r']));
    const all = X.M.map((x) => x.ofCanvas), lo = X.M.reduce((a, b) => (b.ofCanvas < a.ofCanvas ? b : a)), hi = X.M.reduce((a, b) => (b.ofCanvas > a.ofCanvas ? b : a));
    out(`\n*Pooled:* all ${X.M.length.toLocaleString('en-US')} drawings together: lightest ${pc(min(all))}% (${tick(`${lo.master}/${lo.name}`)}), median ${pc(q(all, 0.5))}%, heaviest ${pc(max(all))}% (${tick(`${hi.master}/${hi.name}`)}), ${f1(max(all) / min(all))}×.`);
  } },

  's2.2': { need: { rows: 1 }, run(X) {
    head('§2.2 The bands');
    const hdr = BANDS.map(([n, lo, hi]) => (lo === 0 ? `${n} (<${hi}×)` : hi === 99 ? `${n} (≥${lo}×)` : `${n} (≥${lo} to <${hi}×)`));
    const body = [];
    for (const s of ['outline', 'filled']) for (const m of MASTER_LIST) {
      const r = X.byMS(m, s), md0 = X.med[`${m}${s}`];
      body.push([m, s, `${f1(md0)} px² (${f1(100 * md0 / m ** 2)}%)`, ...BANDS.map(([n]) => { const k = r.filter((x) => bandOf(x.area, md0) === n).length; return `${k} (${Math.round(100 * k / r.length)}%)`; })]);
    }
    out(table(['Master', 'Style', 'Row median', ...hdr], body, ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r']));
    const prof = [];
    for (const s of ['outline', 'filled']) {
      const r = [...X.byMS(16, s)].sort((a, b) => a.area - b.area), md0 = X.med[`16${s}`];
      for (const [n, lo, hi] of BANDS) {
        const x = r.filter((y) => bandOf(y.area, md0) === n); if (!x.length) continue;
        const kc = (k) => x.filter((y) => X.kinds[y.concept][16] === k).length;
        const uniq = []; for (const y of x) if (!uniq.length || Math.abs(uniq.at(-1).area - y.area) > 0.05) uniq.push(y);
        const ex = [0, 0.25, 0.5, 0.75, 1].map((p) => uniq[Math.min(uniq.length - 1, Math.round(p * (uniq.length - 1)))]);
        prof.push([s, n, (hi === 99 ? `${f1(lo * md0)}+` : `${f1(lo * md0)}–${f1(hi * md0)}`), `${f1(x[0].area)}–${f1(x.at(-1).area)} px² (${pc(x[0].ofCanvas)}–${pc(x.at(-1).ofCanvas)}%)`, x.length, `${kc('mark')} / ${kc('silhouette')} / ${kc('box')} / ${kc('anchor')}`, [...new Set(ex.map((y) => tick(y.concept)))].join(', ')]);
      }
    }
    out('');
    out(table(['Style', 'Band', 'Edges (px²)', 'Actual range at 16', 'n', 'mark / silhouette / box / anchor', 'Spread through the band'], prof, ['l', 'l', 'r', 'l', 'r', 'r', 'l']));
    const o = X.byMS(16, 'outline'), md = X.med['16outline'], inBand = (n) => o.filter((x) => bandOf(x.area, md) === n), marks = (a) => a.filter((x) => X.kinds[x.concept][16] === 'mark').length;
    out('');
    fig('outline Hairline: drawings · marks', `${inBand('Hairline').length} · ${marks(inBand('Hairline'))}`);
    fig('outline Light: drawings · marks', `${inBand('Light').length} · ${marks(inBand('Light'))}`);
    fig('outline Level: drawings · share of the row', `${inBand('Level').length} · ${Math.round(100 * inBand('Level').length / o.length)}%`);
    fig('outline Full · Dense: drawings', `${inBand('Full').length} · ${inBand('Dense').length}`);
    const within = (r, f) => { const m0 = q(r.map((x) => x.area), 0.5); return r.filter((x) => Math.abs(x.area / m0 - 1) <= f).length; };
    fig('16 outline row within ±25% · ±33% · ±50% of its median', WITHIN.map((f) => `${Math.round(100 * within(o, f) / o.length)}%`).join(' · '));
    const si = o.filter((x) => X.kinds[x.concept][16] === 'silhouette');
    fig(`the ${si.length} silhouette-keyline objects, same three widths`, WITHIN.map((f) => `${Math.round(100 * within(si, f) / si.length)}%`).join(' · '));
  } },

  's2.3': { need: { rows: 1 }, run(X) {
    head('§2.3 Two populations: marks and objects');
    const body = [];
    for (const s of ['outline', 'filled']) for (const m of [16, 20, 24]) for (const k of ['mark', 'silhouette', 'box', 'anchor']) {
      const r = kindRows(X, s, m, k); if (!r.length) continue; const c = r.map((x) => x.ofCanvas * 100);
      const within = r.filter((x) => Math.abs(x.area / q(r.map((y) => y.area), 0.5) - 1) <= 0.25).length;
      body.push([s, m, k, r.length, f1(q(c, 0.1)), f1(q(c, 0.25)), `**${f1(q(c, 0.5))}**`, f1(q(c, 0.75)), f1(q(c, 0.9)), `${f2(q(c, 0.9) / q(c, 0.1))}×`, `${Math.round(100 * within / r.length)}%`]);
    }
    out(table(['Style', 'Master', 'Kind', 'n', 'p10', 'p25', 'median', 'p75', 'p90', 'p90 ÷ p10', 'within ±25% of own median'], body, ['l', 'r', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const box = (c) => { const b = X.get(c, 16, 'outline').box; return `${+f2(b.w)} × ${+f2(b.h)}`; };
    out('');
    fig('`chevron-down` at 16, ink box · mark cap', `${box('chevron-down')} · ${SPEC[16].mark} × ${SPEC[16].mark}`);
    fig('`minus` at 16, ink box', box('minus'));
    const med = (s, k) => q(kindRows(X, s, 16, k).map((x) => x.ofCanvas * 100), 0.5);
    fig('16 outline: marks median · objects (silhouette) median · ratio', `${f1(med('outline', 'mark'))}% · ${f1(med('outline', 'silhouette'))}% · ${f1(med('outline', 'silhouette') / med('outline', 'mark'))}×`);
    fig('16 filled: marks median · objects median · ratio', `${f1(med('filled', 'mark'))}% · ${f1(med('filled', 'silhouette'))}% · ${f1(med('filled', 'silhouette') / med('filled', 'mark'))}×`);
  } },

  's2.4': { need: { rows: 1 }, run(X) {
    head('§2.4 Three ways to say "weight", and which one is level');
    const body = [];
    for (const s of ['outline', 'filled']) {
      const t = threeWays(X, s);
      const row = (label, v, dd) => body.push([s, label, min(v).toFixed(dd), q(v, 0.1).toFixed(dd), q(v, 0.5).toFixed(dd), q(v, 0.9).toFixed(dd), max(v).toFixed(dd), `${(max(v) / min(v)).toFixed(2)}×`, `${(q(v, 0.9) / q(v, 0.1)).toFixed(2)}×`]);
      const wts = t.w.filter((x) => x.length === 1).map((x) => x[0]);
      if (s === 'outline' && wts.length === t.w.length) row('stroke weight (px, from the file)', wts, 2); else body.push([s, 'stroke weight (px, from the file)', '—', '—', '—', '—', '—', '—', '—']);
      row('darkest patch at a squint (σ 1.5 px)', t.sq, 3); row('densest 3×3 patch', t.p3, 2); row('total ink, px²', t.ink, 1);
    }
    out(table(['Style', 'What is being compared at 16', 'min', 'p10', 'median', 'p90', 'max', 'max ÷ min', 'p90 ÷ p10'], body, ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    out('');
    fig('parallel strokes at the gap floor: stroke ÷ (stroke + gap) at 16', `${STROKES[16]} ÷ (${STROKES[16]} + ${MIN_GAP}) = ${Math.round(100 * STROKES[16] / (STROKES[16] + MIN_GAP))}%`);
    const S = sigmaSweep(X), b = (k, t) => (k === 1.5 ? `**${t}**` : t);
    out('');
    out(table(['Blur σ (px)', 'Kernel taps', 'outline: max ÷ min', 'outline: p90 ÷ p10', 'outline: rank corr. with ink', 'filled: max ÷ min', 'filled: p90 ÷ p10'],
      SIGMAS.map((k) => { const o = S[k].outline, f = S[k].filled; return [b(k, String(k)), b(k, `${Math.ceil(3 * k)} either side`), b(k, `${o.spread.toFixed(2)}×`), b(k, `${o.p9010.toFixed(2)}×`), b(k, o.rho.toFixed(2)), b(k, `${f.spread.toFixed(2)}×`), b(k, `${f.p9010.toFixed(2)}×`)]; }), ['r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const ink = threeWays(X, 'outline').ink;
    out('');
    fig('outline squint p90 ÷ p10 below total ink p90 ÷ p10 at every σ up to 2.5', `${SIGMAS.every((k) => S[k].outline.p9010 < q(ink, 0.9) / q(ink, 0.1)) ? 'yes' : 'no'} (ink ${f2(q(ink, 0.9) / q(ink, 0.1))}×)`);
  } },

  's3.1': { need: { rows: 1 }, run(X) {
    head('§3.1 Footprint, line, packing — and not parts');
    out(table(['Style', 'Master', 'carried by footprint (ink-box area ÷ canvas)', 'carried by packing (ink ÷ ink-box area)'],
      ['outline', 'filled'].flatMap((s) => MASTER_LIST.map((m) => { const v = varianceSplit(X, m, s); return [s, m, `${Math.round(100 * v.foot)}%`, `${Math.round(100 * v.pack)}%`]; })), ['l', 'r', 'r', 'r']));
    const mb = X.get('minus', 16, 'outline').box, ck = SPEC[16].keylines.circle;
    out('');
    fig('a `minus` at 16 claims (ink box ÷ canvas)', `${+f2(mb.w)} × ${+f2(mb.h)} → ${Math.round(100 * mb.w * mb.h / 256)}%`);
    fig('a container on the 16 circle keyline claims', `${ck[0]} × ${ck[1]} → ${Math.round(100 * ck[0] * ck[1] / 256)}%`);
    out('');
    out(table(['Style', 'Master', 'ink vs path count', 'ink vs subpath count', 'ink vs line length (centreline + outline of fills)', 'ink vs ink-box area', 'packing (ink ÷ box) vs path count'],
      ['outline', 'filled'].flatMap((s) => MASTER_LIST.map((m) => { const r = X.byMS(m, s), ink = r.map((x) => x.area); return [s, m, f2(spearman(ink, r.map((x) => x.nPaths))), f2(spearman(ink, r.map((x) => x.nSub))), f2(spearman(ink, r.map((x) => x.L + x.P))), f2(spearman(ink, r.map((x) => x.box.w * x.box.h))), f2(spearman(r.map((x) => x.ofBbox), r.map((x) => x.nPaths)))]; })), ['l', 'r', 'r', 'r', 'r', 'r', 'r']));
    const buck = (n) => (n <= 1 ? '1' : n === 2 ? '2' : n === 3 ? '3' : n === 4 ? '4' : n <= 6 ? '5–6' : n <= 9 ? '7–9' : '10+');
    const b2 = [];
    for (const s of ['outline', 'filled']) { const r = X.byMS(16, s); for (const b of ['1', '2', '3', '4', '5–6', '7–9', '10+']) { const x = r.filter((y) => buck(y.nPaths) === b).map((y) => y.area); if (x.length) b2.push([s, b, x.length, f1(q(x, 0.1)), `**${f1(q(x, 0.5))}**`, f1(q(x, 0.9)), f1(min(x)), f1(max(x))]); } }
    out('');
    out(table(['Style', 'Paths in the file', 'n', 'p10', 'median', 'p90', 'min', 'max'], b2, ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r']));
    out('');
    out(table(['Master', 'min', 'p10', 'median', 'p90', 'max', 'drawings below 0.90'], MASTER_LIST.map((m) => { const { w, below } = weldStats(X, m); return [m, f2(min(w)), f2(q(w, 0.1)), f2(q(w, 0.5)), f2(q(w, 0.9)), f2(max(w)), below]; }), ['r', 'r', 'r', 'r', 'r', 'r', 'r']));
  } },

  's3.2': { need: { rows: 1, lucide: 1 }, run(X, L) {
    head('§3.2 The heaviest: the Dense drawings');
    const luc = lucideIndex(L), { dense, out: rows } = denseRows(X, luc);
    fig('16 outline Dense threshold (1.5 × row median) px² · drawings · distinct', `${f1(1.5 * X.med['16outline'])} · ${dense.length} · ${rows.length}`);
    out('(verdict column omitted: judgement)');
    out(table(['Drawing (≡ identical path data)', 'Ink px² (% canvas)', 'Ink box', 'Paths', 'Line length', 'Siblings: n, ink vs their median', 'Our line ÷ Lucide’s, 24 (Lucide file)', 'Ink ÷ (line × stroke)', 'Densest 3×3'],
      rows.map(({ d, tw, e }) => [`${tick(d.concept)}${tw.length ? ' ≡ ' + tw.map(tick).join(', ') : ''}`, `${f1(d.area)} (${pc(d.ofCanvas)}%)`, `${d.box.w.toFixed(0)}×${d.box.h.toFixed(0)}`, d.nPaths, f1(d.L), e.sibs.length ? `${e.sibs.length}: ×${f2(e.sibRatio)}` : '—', e.la ? `${e.la.name}: ×${f2(e.lucRatio)}` : '—', f2(e.weld), f2(e.patch3)]), ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const lr = rows.map((x) => x.e.lucRatio).filter((v) => v != null);
    out('');
    fig('all distinct Dense drawings: our line ÷ Lucide\'s', `${f2(min(lr))}–${f2(max(lr))}×`);
    const v = rows.filter((x) => VARIANTS.includes(x.d.concept));
    fig(`the numbered variants named in the verdicts (${VARIANTS.join(', ')}): ink vs siblings · line vs Lucide`, `${f2(min(v.map((x) => x.e.sibRatio)))}–${f2(max(v.map((x) => x.e.sibRatio)))}× · ${f2(min(v.map((x) => x.e.lucRatio)))}–${f2(max(v.map((x) => x.e.lucRatio)))}×`);
    const g = luc.globe;
    fig('Lucide `globe`: ink ÷ (line × 2)', f2(g.area / (g.L * 2)));
    for (const c of NUDGES) { const x = rows.find((y) => y.d.concept === c); fig(`${tick(c)}: line ÷ Lucide · ink ÷ siblings`, `${f2(x.e.lucRatio)}× · ${f2(x.e.sibRatio)}×`); }
    const bc = rows.find((y) => y.d.concept === 'briefcase');
    fig('`briefcase`: siblings · line ÷ Lucide', `${bc.e.sibs.length} · ${f2(bc.e.lucRatio)}×`);
  } },

  's3.3': { need: { rows: 1, lucide: 1 }, run(X, L) {
    head('§3.3 The lightest: the Hairline drawings');
    const luc = lucideIndex(L), { hair, out: rows } = hairRows(X, luc);
    fig('16 outline Hairline: drawings · distinct · all `keyline: mark`', `${hair.length} · ${rows.length} · ${hair.every((x) => X.kinds[x.concept][16] === 'mark') ? 'yes' : 'no'}`);
    out(table(['Drawing (same ink = same drawing, flipped or turned)', 'Ink px² (% canvas)', 'Kind', 'Siblings: n, ink vs their median', 'Our line ÷ Lucide’s, 24 (Lucide file)'],
      rows.map(({ d, grp, e }) => [grp.map((x) => tick(x.concept)).join(', '), `${f1(d.area)} (${pc(d.ofCanvas)}%)`, X.kinds[d.concept][16], e.sibs.length ? `${e.sibs.length}: ×${f2(e.sibRatio)}` : '—', e.la ? `${e.la.name}: ×${f2(e.lucRatio)}` : '—']), ['l', 'r', 'l', 'r', 'r']));
    const sr = rows.map((x) => x.e.sibRatio).filter((v) => v != null);
    out('');
    fig('siblings agree within', `×${f2(min(sr))}–${f2(max(sr))}`);
    fig('where Lucide has the mark at default size', rows.filter((x) => x.e.la).map((x) => `${tick(x.d.concept)} ×${f2(x.e.lucRatio)}`).join(', '));
  } },

  's3.4': { need: { rows: 1, lucide: 1 }, run(X, L) {
    head('§3.4 Where the drawing is the cause: crowded line');
    const { body, near } = crowdedRows(X);
    out(table(['Drawing', 'Ink px² at 16', 'Ink ÷ (line × stroke), 16', '20', '24', 'Densest 3×3 patch, 16', 'Squint peak, 16'], body.map((x) => [tick(x.c), f1(x.area), f2(x.w16), f2(x.w20), f2(x.w24), f2(x.patch3), f2(x.squint)]), ['l', 'r', 'r', 'r', 'r', 'r', 'r']));
    const luc = lucideIndex(L), g = luc.globe;
    out('');
    fig('Lucide `globe`: ink ÷ (line × 2)', f2(g.area / (g.L * 2)));
    const knot = X.byMS(16, 'outline').filter((x) => X.patch.get(x.name).patch3 >= KNOT);
    fig(`16 outline drawings with a densest 3×3 ≥ ${KNOT}`, knot.map((x) => `${tick(x.name)} ${f2(X.patch.get(x.name).patch3)}`).join(', '));
    const sq = [...X.byMS(16, 'outline')].sort((a, b) => X.patch.get(b.name).squint - X.patch.get(a.name).squint).slice(0, 3);
    fig('darkest three at a squint, whole 16 outline set', sq.map((x) => `${tick(x.name)} ${f2(X.patch.get(x.name).squint)}`).join(', '));
    const w24 = X.get('wand', 24, 'outline').L;
    fig('`wand` line at 24 ÷ Lucide `wand-sparkles` · ÷ Lucide `wand`', `${f2(w24 / luc['wand-sparkles'].L)}× · ${f2(w24 / luc.wand.L)}×`);
    const pb = X.get('paintbrush-5', 16, 'outline'), lens = pathDs(X.texts.get('16/paintbrush-5')).find((d) => /^M[^A]*A[^A]*A[^A]*Z$/.test(d));
    if (pb && lens) { const w = lensWidth(lens); fig('`paintbrush-5` at 16: the handle lens at its widest, centreline + stroke = ink', `${f2(w)} + ${pb.weights[0]} = ${f2(w + pb.weights[0])}`); }
    const nv = near.map((x) => X.patch.get(x.concept).patch3);
    fig(`other drawings with a densest 3×3 of ${KNOT_NEAR}–${KNOT}: count · range`, `${near.length} · ${f2(min(nv))}–${f2(max(nv))}`);
    fig('  they are', near.map((x) => tick(x.concept)).sort().join(', '));
  } },

  's3.5': { need: { rows: 1, lucide: 1 }, run(X, L) {
    head('§3.5 The baseline: is 8.4× a lot?');
    const Ls = L.rows;
    fig('Lucide heaviest twelve (ink)', [...Ls].sort((a, b) => b.area - a.area).slice(0, 12).map((x) => x.name).join(', '));
    fig('Lucide lightest eight (ink)', [...Ls].sort((a, b) => a.area - b.area).slice(0, 8).map((x) => x.name).join(', '));
    const row = (label, v, extra) => [label, v.length, f1(min(v)), f1(q(v, 0.1)), f1(q(v, 0.5)), f1(q(v, 0.9)), f1(max(v)), `${f1(max(v) / min(v))}×`, `${f2(q(v, 0.9) / q(v, 0.1))}×`, extra];
    const mine = (m) => X.byMS(m, 'outline').map((x) => x.ofCanvas * 100), st = (m, c) => `${STROKES[m]} on ${c} (${f1(100 * STROKES[m] / c)}%)`;
    out(table(['Set', 'n', 'lightest %', 'p10', 'median', 'p90', 'heaviest %', 'heaviest ÷ lightest', 'p90 ÷ p10', 'stroke'],
      [row(`Lucide (${Ls.length} local files, 24 grid)`, Ls.map((x) => x.ofCanvas * 100), `2 on 24 (${f1(100 * 2 / 24)}%)`), row('ours, 24 outline', mine(24), st(24, 24)), row('ours, 16 outline', mine(16), st(16, 16))], ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l']));
    const mt = matchedLucide(X, lucideIndex(L));
    const srow = (label, a) => [label, f2(min(a)), f2(q(a, 0.5)), f2(max(a)), `${f2(max(a) / min(a))}×`, `${f2(q(a, 0.9) / q(a, 0.1))}×`];
    out('');
    out(table([`On the ${mt.length} matched concepts`, 'lightest', 'median', 'heaviest', 'max ÷ min', 'p90 ÷ p10'], [srow('ours, 24 master', mt.map((x) => x.o24)), srow('ours, 16 master', mt.map((x) => x.o16)), srow('Lucide, 24 grid', mt.map((x) => x.l))], ['l', 'r', 'r', 'r', 'r', 'r']));
    const r24 = mt.map((x) => x.r24);
    out('');
    fig('rank correlation by line needed: 24 master · 16 master', `${f2(spearmanStable(mt.map((x) => x.o24), mt.map((x) => x.l)))} · ${f2(spearmanStable(mt.map((x) => x.o16), mt.map((x) => x.l)))}`);
    fig('our line ÷ Lucide\'s at 24: median (p10–p90)', `${f2(q(r24, 0.5))} (${f2(q(r24, 0.1))}–${f2(q(r24, 0.9))})`);
    fig('within ±15% of 1.00 · lighter · heavier (of matched)', `${r24.filter((v) => v >= 0.85 && v <= 1.15).length} · ${r24.filter((v) => v < 0.85).length} · ${r24.filter((v) => v > 1.15).length} (of ${mt.length})`);
    fig('the heavier ones', mt.filter((x) => x.r24 > 1.15).map((x) => `${tick(x.c)} ${f2(x.r24)}`).join(', '));
  } },

  's3.6': { need: { rows: 1 }, run(X) {
    head('§3.6 The filled row');
    const fam = filledFamilies(X).slice(0, 22);
    out(table(['Family (drawings in it)', 'Heaviest member', 'Ink px² (% canvas)', 'Range across the family, px²', 'Share of ink that is fill', 'vs its outline twin', 'Kind', 'Verdict'],
      fam.map((s) => { const o = X.get(s.top.concept, 16, 'outline'), spread = (s.hi - s.lo) / s.hi; const verdict = s.n === 1 ? 'Concept: one drawing, a solid shape' : spread <= 0.2 ? `Concept: a solid shape; the ${s.n} members agree within ${Math.max(1, Math.round(100 * spread))}%` : `Variant: the solid member of a family spanning ${f1(s.lo)}–${f1(s.hi)} px²`; return [`${tick(s.k)} (${s.n})`, tick(s.top.concept), `${f1(s.top.area)} (${pc(s.top.ofCanvas)}%)`, `${f1(s.lo)}–${f1(s.hi)}`, `${Math.round(100 * s.top.areaInk / s.top.area)}%`, `×${f2(s.top.area / o.area)}`, X.kinds[s.top.concept][16], verdict]; }), ['l', 'l', 'r', 'r', 'r', 'r', 'l', 'l']));
    out('(verdict column: the card\'s rule — one member; range within 20% of the top → concept; else variant)');
    const f16 = X.byMS(16, 'filled'), md = X.med['16filled'], dense = f16.filter((x) => bandOf(x.area, md) === 'Dense');
    out('');
    fig('16 filled Dense: drawings (share)', `${dense.length} (${Math.round(100 * dense.length / f16.length)}%)`);
    const disc = f16.filter((x) => DISC.test(x.concept));
    fig('disc-with-a-glyph families: drawings · px² range · % of canvas', `${disc.length} · ${f1(min(disc.map((x) => x.area)))}–${f1(max(disc.map((x) => x.area)))} · ${pc(min(disc.map((x) => x.ofCanvas)))}–${pc(max(disc.map((x) => x.ofCanvas)))}%`);
    const dia = SPEC[16].keylines.circle[0];
    fig(`a solid disc on the 16 circle keyline (⌀${dia}), px²`, f1(Math.PI * (dia / 2) ** 2));
    const hair = f16.filter((x) => bandOf(x.area, md) === 'Hairline'), nonMark = hair.filter((x) => X.kinds[x.concept][16] !== 'mark');
    fig('16 filled Hairline: drawings · marks · the others', `${hair.length} · ${hair.length - nonMark.length} · ${nonMark.map((x) => tick(x.name)).join(', ')}`);
    const tw = fam.map((s) => s.top.area / X.get(s.top.concept, 16, 'outline').area);
    fig('the 22 heaviest families\' heaviest members: ink ÷ own outline', `${f1(min(tw))}–${f1(max(tw))}×`);
    out('');
    out(table(['Master', 'line-heavy filled (n)', 'min', 'median', 'max', 'shape-filled (n)', 'min', 'median', 'max'], ratioRows(X).map(({ m, lh, sh }) => [m, `${lh.length}`, f2(min(lh)), f2(q(lh, 0.5)), f2(max(lh)), `${sh.length}`, f2(min(sh)), f2(q(sh, 0.5)), f2(max(sh))]), ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const a = X.get('alert-circle', 16, 'filled'), mn = X.get('minus', 16, 'filled');
    out('');
    fig('`alert-circle-filled` against `minus-filled` at 16', `${f1(a.area)} against ${f1(mn.area)} px² — ${f1(a.area / mn.area)}×`);
    const r16 = ratioRows(X).find((x) => x.m === 16);
    fig('filled ÷ outline at 16: line-heavy min–max (median) · shape-filled', `${f2(min(r16.lh))}–${f2(max(r16.lh))} (${f2(q(r16.lh, 0.5))}) · ${f2(min(r16.sh))}–${f2(max(r16.sh))} (${f2(q(r16.sh, 0.5))})`);
  } },

  s4: { need: { rows: 1 }, run(X) {
    head('§4 Across the three masters');
    const body = [];
    for (const s of ['outline', 'filled']) {
      const d = driftOf(X, s), r20 = d.map((x) => x.r20), r16 = d.map((x) => x.r16), m16 = q(r16, 0.5);
      body.push([s, '20 ÷ 24', f2(min(r20)), f2(q(r20, 0.05)), f2(q(r20, 0.25)), `**${f2(q(r20, 0.5))}**`, f2(q(r20, 0.75)), f2(q(r20, 0.95)), f2(max(r20)), `${r20.filter((v) => Math.abs(v / q(r20, 0.5) - 1) <= 0.2).length}`]);
      body.push([s, '16 ÷ 24', f2(min(r16)), f2(q(r16, 0.05)), f2(q(r16, 0.25)), `**${f2(q(r16, 0.5))}**`, f2(q(r16, 0.75)), f2(q(r16, 0.95)), f2(max(r16)), `${r16.filter((v) => Math.abs(v / m16 - 1) <= 0.2).length}`]);
    }
    out(table(['Style', 'Ratio of ink share', 'min', 'p5', 'p25', 'median', 'p75', 'p95', 'max', `concepts within ±20% of the median (of ${X.concepts.length})`], body, ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']));
    const d = driftOf(X, 'outline'), m16 = q(d.map((x) => x.r16), 0.5);
    out('');
    fig('16 outline median ratio (3 dp) · within ±20% of it', `${f3(m16)} · ${d.filter((x) => Math.abs(x.r16 / m16 - 1) <= 0.2).length} of ${d.length}`);
    const sc = (m) => STROKES[m] / m;
    fig('stroke ÷ canvas at 24 · 20 · 16 · and the 20 and 16 against 24', `${MASTER_LIST.map((m) => `${(100 * sc(m)).toFixed(2)}%`).join(' · ')} · ${f2(sc(20) / sc(24))}× and ${f2(sc(16) / sc(24))}×`);
    fig('square keyline ÷ canvas at 24 · 20 · 16', MASTER_LIST.map((m) => `${Math.round(100 * SPEC[m].keylines.square[0] / m)}%`).join(' · '));
    const st = [];
    for (const s of ['outline', 'filled']) { const b = bandMoves(X, s); st.push([s, f3(spearman(b.a24.map((x) => x.ofCanvas), b.a20.map((x) => x.ofCanvas))), f3(spearman(b.a24.map((x) => x.ofCanvas), b.a16.map((x) => x.ofCanvas))), `${b.d20.filter((v) => v === 0).length} / ${b.d20.filter((v) => v === 1).length} / ${b.d20.filter((v) => v >= 2).length}`, `${b.d16.filter((v) => v === 0).length} / ${b.d16.filter((v) => v === 1).length} / ${b.d16.filter((v) => v >= 2).length}`]); }
    out('');
    out(table(['Style', 'Rank correlation 24 vs 20', 'Rank correlation 24 vs 16', 'Band, 24 → 20: same / one step / two or more', 'Band, 24 → 16: same / one step / two or more'], st, ['l', 'r', 'r', 'r', 'r']));
    const fb = bandMoves(X, 'filled');
    out('');
    fig('filled concepts moving two bands, 24→16', X.concepts.filter((_, i) => fb.d16[i] >= 2).map(tick).join(', '));
    const sorted = [...d].sort((x, y) => x.r16 - y.r16), fmt = (x) => `${tick(x.c)} ×${f2(x.r16)} (${pc(x.a.ofCanvas)}→${pc(x.b.ofCanvas)}%, ${x.a.nPaths}→${x.b.nPaths} paths)`;
    fig('heavier at 16', sorted.slice(-8).reverse().map(fmt).join('; '));
    fig('lighter or level at 16', sorted.slice(0, 8).map(fmt).join('; '));
    fig('lowest outline ratio 16 ÷ 24 in the set', f2(sorted[0].r16));
  } },

  s5: { need: { rows: 1, lucide: 1 }, run(X, L) {
    head('§5 Judged list — the figures it states');
    const g = X.get('globe-2', 16, 'outline'), ck = X.get('check', 16, 'outline'), mt = matchedLucide(X, lucideIndex(L));
    fig('M-1 `globe-2` against `check` at 16: ink px² · ratio', `${f1(g.area)} against ${f1(ck.area)} (${f1(g.area / ck.area)}×)`);
    fig('M-1 line length at 16: `globe-2` · `check` · ratio', `${f1(g.L)} against ${f1(ck.L)} units (${f1(g.L / ck.L)}×)`);
    const sp = (a) => max(a) / min(a);
    fig('M-1 line-per-canvas spread on the matched concepts: Lucide · ours (24) · rank correlation', `${f1(sp(mt.map((x) => x.l)))}× · ${f1(sp(mt.map((x) => x.o24)))}× · ${f2(spearmanStable(mt.map((x) => x.o24), mt.map((x) => x.l)))}`);
    const med = (s, k) => q(kindRows(X, s, 16, k).map((x) => x.ofCanvas * 100), 0.5);
    fig('M-2 marks · objects at 16 outline (ratio); filled ratio', `${f1(med('outline', 'mark'))}% · ${f1(med('outline', 'silhouette'))}% (${f1(med('outline', 'silhouette') / med('outline', 'mark'))}×); ${f1(med('filled', 'silhouette') / med('filled', 'mark'))}×`);
    fig('M-3 crowded drawings', crowdedRows(X).body.length);
    const r = (s, m) => { const x = X.byMS(m, s); return [spearman(x.map((y) => y.area), x.map((y) => y.nPaths)), spearman(x.map((y) => y.area), x.map((y) => y.L + y.P))]; };
    fig('M-4 rank correlation of ink with path count (outline · filled, 16) · with line length (outline · filled)', `${f2(r('outline', 16)[0])} · ${f2(r('filled', 16)[0])} · ${f2(r('outline', 16)[1])} / ${f2(r('filled', 16)[1])}`);
    const f16 = X.byMS(16, 'filled'), md = X.med['16filled'], share = (n) => Math.round(100 * f16.filter((x) => bandOf(x.area, md) === n).length / f16.length);
    const top22 = filledFamilies(X).slice(0, 22).map((s) => s.top.ofCanvas);
    const disc = f16.filter((x) => DISC.test(x.concept)), heaviest = [...f16].sort((a, b) => b.area - a.area)[0];
    fig('M-5 filled 16: Level · Dense · discs (lowest) to the heaviest card/bubble, % of canvas · marks median', `${share('Level')}% · ${share('Dense')}% · ${pc(min(disc.map((x) => x.ofCanvas)))}% to ${pc(heaviest.ofCanvas)}% (${tick(heaviest.name)}) · ${f1(med('filled', 'mark'))}%`);
    fig('M-5 (for reference) the 22 heaviest families\' heaviest members, % of canvas', `${pc(min(top22))}–${pc(max(top22))}%`);
    const d = driftOf(X, 'outline'), b = bandMoves(X, 'outline'), at = (c) => f2(d.find((x) => x.c === c).r16);
    fig('M-6 median 16 ÷ 24 · 20 ÷ 24 · rank correlation 24→16 · concepts more than one band away', `${f2(q(d.map((x) => x.r16), 0.5))} · ${f2(q(d.map((x) => x.r20), 0.5))} · ${f3(spearman(b.a24.map((x) => x.ofCanvas), b.a16.map((x) => x.ofCanvas)))} · ${b.d16.filter((v) => v >= 2).length}`);
    fig('M-6 outliers', ['x-small', 'minus-small', 'plus-small', 'x', 'grid-4'].map((c) => `${tick(c)} ×${at(c)}`).join(', '));
    const mx = [...X.M].sort((a1, b1) => b1.ofBbox - a1.ofBbox)[0];
    fig('M-7 highest packing (ink ÷ ink box) in the set', `${tick(`${mx.master}/${mx.name}`)} ${Math.round(100 * mx.ofBbox)}%`);
    const du = duplicates(X);
    fig('M-8 name-sets with identical path data · of them at 16 only (both styles)', `${du.sets.length} · ${du.sets.filter(([, e]) => e.outline.join() === '16' && e.filled.join() === '16').length}`);
  } },

  s6: { need: { rows: 1 }, run(X) {
    head('§6 F10 — seed pairs (σ 1.0 blur, cosine, cross-stem)');
    const o = seedPairs(X, 'outline'), f = seedPairs(X, 'filled');
    out(table(['Cosine', 'Pair (outline, 16)'], o.pick(10).map(([s, a, b]) => [s.toFixed(4), `${tick(a)} / ${tick(b)}`]), ['r', 'l']));
    out('');
    fig('filled, top six', f.pick(6).map(([s, a, b]) => `${tick(a)} / ${tick(b)} ${s.toFixed(4)}`).join(', '));
    fig(`pairs that are the same drawing at 16 (raw cosine ≥ ${IDENTICAL_COS}): outline · filled`, `${o.identical} · ${f.identical}`);
    fig('pairs per style', o.total.toLocaleString('en-US'));
  } },

  s7: { need: { rows: 1 }, run(X) {
    head('§7 Noticed in passing');
    const du = duplicates(X);
    fig('name-sets with identical path data · master×style groups · files in them', `${du.sets.length} · ${du.groups} · ${du.inGroups}`);
    const cat = (e) => (e.outline.join() === '24,20,16' && e.filled.join() === '24,20,16' ? 'pure aliases at every master and style' : e.outline.join() === '24,20,16' && !e.filled.length ? 'outline only, all masters' : e.outline.join() === '16' && e.filled.join() === '16' ? 'both styles, at 16 only' : `outline ${e.outline.join(',') || '-'} | filled ${e.filled.join(',') || '-'}`);
    const groups = new Map(); for (const [n, e] of du.sets) (groups.get(cat(e)) ?? groups.set(cat(e), []).get(cat(e))).push(n);
    for (const [k, v] of groups) fig(`  ${k}`, v.map((n) => n.split(' = ').map(tick).join(' ≡ ')).join(', '));
    const named = ['globe-2', 'language-3', 'globe', 'language-2'].filter((c) => X.get(c, 16, 'filled'));
    if (named.length) fig(`filled ÷ outline ink at 16: ${named.map(tick).join(' · ')}`, named.map((c) => f2(X.get(c, 16, 'filled').area / X.get(c, 16, 'outline').area)).join(' · '));
    const z = []; for (const f of X.files) for (const m of X.texts.get(f.key).matchAll(/<path\b[^>]*?\sd="([^"]+)"/g)) for (const a of zeroLengthArcs(m[1])) z.push(`${tick(f.key)} ${a}`);
    fig('files with a zero-length arc', `${z.length}`);
    for (const x of z) out(`  ${x}`);
  } },

  appA: { need: { rows: 1 }, run(X) {
    head('Appendix A. The full census — one row per concept');
    const band = (v, m0) => { const r = v / m0; for (const [n, hi] of [['H', 0.5], ['L', 0.75], ['Lv', 1.25], ['F', 1.5]]) if (r < hi) return n; return 'D'; };
    const sig16 = new Map(); for (const f of X.files) { const k = `${f.master}|${pathSignature(X.texts.get(f.key))}|${f.style}`; (sig16.get(k) ?? sig16.set(k, []).get(k)).push(f.concept); }
    const twin16 = (c, s) => { for (const [k, v] of sig16) if (k.startsWith('16|') && k.endsWith('|' + s) && v.includes(c) && v.length > 1) return v.filter((x) => x !== c).join(' '); return ''; };
    fig('row medians used for the bands (16 outline · 16 filled), px²', `${f1(X.med['16outline'])} · ${f1(X.med['16filled'])}`);
    out('| concept | kind | O24 | O20 | O16 | O16 px² | F24 | F20 | F16 | F16 px² | O16÷O24 | band O16 | band F16 | squint O16 | squint F16 | O16 = (same path data) |');
    out('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---:|---:|---|');
    for (const c of X.concepts) {
      const o = MASTER_LIST.map((m) => X.get(c, m, 'outline')), f = MASTER_LIST.map((m) => X.get(c, m, 'filled'));
      out(`| ${tick(c)} | ${X.kinds[c][16]} | ${pc(o[0].ofCanvas)} | ${pc(o[1].ofCanvas)} | ${pc(o[2].ofCanvas)} | ${f1(o[2].area)} | ${pc(f[0].ofCanvas)} | ${pc(f[1].ofCanvas)} | ${pc(f[2].ofCanvas)} | ${f1(f[2].area)} | ${f2(o[2].ofCanvas / o[0].ofCanvas)} | ${band(o[2].area, X.med['16outline'])} | ${band(f[2].area, X.med['16filled'])} | ${f2(X.patch.get(c).squint)} | ${f2(X.patch.get(c + '-filled').squint)} | ${twin16(c, 'outline')} |`);
    }
  } },

  appB: { need: { rows: 1, lucide: 1 }, run(X, L) {
    head('Appendix B. The concepts matched to Lucide');
    const mt = matchedLucide(X, lucideIndex(L));
    fig('matched concepts', mt.length);
    out('| our concept | Lucide file | our line ÷ canvas (24) | Lucide line ÷ canvas | ours ÷ Lucide | our line ÷ canvas (16) | ours(16) ÷ Lucide |');
    out('|---|---|---:|---:|---:|---:|---:|');
    for (const m of mt) out(`| ${tick(m.c)} | ${m.a} | ${f2(m.o24)} | ${f2(m.l)} | ${f2(m.r24)} | ${f2(m.o16)} | ${f2(m.r16)} |`);
  } },

  appC: { need: { rows: 1, classify: 1 }, run(X) {
    head('Appendix C. Reproducing this');
    const so = X.rows.filter((r) => !r.hasArea), eq = so.filter((r) => Math.abs(r.area - r.c.area) < 1e-3);
    fig(`bypass equals inkArea at rate ${RATE} on files with no area path`, `${eq.length} of ${so.length}`);
    const cs = bugCases(), ok = cs.every((c) => c.bypassMatchesClosed);
    fig('bypass reproduces every closed form of §1.1', ok ? 'yes' : 'no');
    out('- (the test count "115" is the suite at the time of writing — a process fact, not reprinted)');
  } },
};

/** §1.1's closed-form cases: each drawn as a region, rasterised both ways at 16 px, rate 32. */
export function bugCases({ px = 16, rate = RATE, col = 8 } = {}) {
  const rectRow = (y0, y1, j) => Math.max(0, Math.min(y1, j + 1) - Math.max(y0, j));
  const cases = [
    { label: 'filled rectangle, y 2.375 → 13.625', d: 'M2 2.375H14V13.625H2Z', y: [2.375, 13.625], rows: [2, 13], area: 12 * 11.25 },
    { label: 'filled rectangle, y 2.375 → 13.375', d: 'M2 2.375H14V13.375H2Z', y: [2.375, 13.375], rows: [2, 13], area: 12 * 11 },
    { label: 'filled rectangle, y 2.5 → 13.5', d: 'M2 2.5H14V13.5H2Z', y: [2.5, 13.5], rows: [2, 13], area: 12 * 11 },
    { label: 'filled rectangle, y 2 → 14 (edges on pixel lines)', d: 'M2 2H14V14H2Z', y: [2, 14], rows: [2, 13], area: 12 * 12 },
    { label: 'a 1.25 stroke at y 8.375 (control)', stroke: 'M2 8.375H14', weight: 1.25, y: [8.375 - 0.625, 8.375 + 0.625], rows: [7, 8], area: 12 * 1.25 + Math.PI * 0.625 ** 2 },
    { label: 'rounded rectangle, top edge y 2.375', d: 'M4 2.375H12A2 2 0 0 1 14 4.375V11.625A2 2 0 0 1 12 13.625H4A2 2 0 0 1 2 11.625V4.375A2 2 0 0 1 4 2.375Z', y: [2.375, 13.625], rows: [2], area: 12 * 11.25 - (4 - Math.PI) * 4 },
  ];
  return cases.map((c) => {
    const reg = { ...(c.stroke ? strokeRegion([c.stroke], c.weight) : areaRegion([c.d])), canvas: px };
    const cl = rasterise(reg, { px, rate, canvas: px }).cov, bf = bfRasterise(reg, { px, rate, canvas: px }).cov;
    const closed = c.rows.map((j) => rectRow(c.y[0], c.y[1], j));
    const fmt = (vals, area) => `rows ${c.rows.join(', ')} = ${vals.map(f3).join(', ')}; area ${f3(area)}`;
    const clv = c.rows.map((j) => cl[j * px + col]), bfv = c.rows.map((j) => bf[j * px + col]);
    return { label: c.label, closed: fmt(closed, c.area), classify: fmt(clv, sum(cl)), bypass: fmt(bfv, sum(bf)), closedVals: closed, classifyVals: clv, bypassVals: bfv, closedArea: c.area, classifyArea: sum(cl), bypassArea: sum(bf), bypassMatchesClosed: bfv.every((v, i) => Math.abs(v - closed[i]) < 1e-9) };
  });
}

export const SECTION_NAMES = Object.keys(SECTIONS);

async function main() {
  const args = process.argv.slice(2), flags = new Map(), pos = [];
  for (let i = 0; i < args.length; i++) { if (args[i].startsWith('--')) flags.set(args[i], args[i + 1]), i++; else pos.push(args[i]); }
  const usage = 'usage: node tools/audit/mass-probe.mjs <pin-dir> [section …] [--refs <dir>] [--jobs <n>] [--cache <dir>]\n  sections: ' + SECTION_NAMES.join(' ');
  const pin = pos[0] ? resolve(pos[0]) : null;
  if (!pin || !MASTER_LIST.every((m) => existsSync(join(pin, 'src/icons', String(m))) && statSync(join(pin, 'src/icons', String(m))).isDirectory())) { console.error(usage); process.exit(2); }
  const wanted = pos.slice(1).length ? pos.slice(1) : SECTION_NAMES;
  for (const s of wanted) if (!SECTIONS[s]) { console.error(`unknown section "${s}"\n${usage}`); process.exit(2); }
  for (const k of flags.keys()) if (!['--refs', '--jobs', '--cache'].includes(k)) { console.error(`unknown flag "${k}"\n${usage}`); process.exit(2); }
  const need = { rows: 0, classify: 0, r64: 0, lucide: 0 }; for (const s of wanted) for (const k of Object.keys(SECTIONS[s].need)) need[k] = 1;
  const log = (m) => console.error(`[mass-probe] ${m}`);
  const files = listFiles(pin);
  out(`# findings-mass.md, reprinted — pin ${pin} (${files.length} drawings), rate ${RATE}`);
  let X = null, L = null;
  if (need.rows) {
    const rows = await measureAll(files, { classify: !!need.classify, r64: !!need.r64, jobs: flags.has('--jobs') ? Number(flags.get('--jobs')) : undefined, cache: flags.get('--cache') ?? null, log });
    X = buildContext(files, rows);
  }
  if (need.lucide) { const t0 = Date.now(); L = loadLucide(resolve(flags.get('--refs') ?? join(REPO, 'research/references'))); log(`Lucide: ${L.rows.length} drawings in ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  for (const s of wanted) { const t0 = Date.now(); await SECTIONS[s].run(X, L); log(`${s}: ${Date.now() - t0} ms`); }
}

if (!isMainThread && workerData?.massProbe) {
  parentPort.postMessage(workerData.files.map((f) => measureFile(f, workerData.opts)));
} else if (isMainThread && process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
