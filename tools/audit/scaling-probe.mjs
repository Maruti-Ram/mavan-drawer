#!/usr/bin/env node
// SCALING PROBE — reprints every measured figure in docs/audit/findings-scaling.md (card 1.4 of
// plans/set-and-rules-audit.md: F6, how a drawing behaves from 24 to 20 to 16, and the F11 detail census
// in its §6). AUDIT ONLY — imported by nothing; reads the pin, writes nothing.
//
// Usage:
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   node tools/audit/scaling-probe.mjs $P [section …]
// No section = all. An unknown section, or a pin with no src/icons/{24,20,16}, exits 2.
// This document reads no reference set, so there is no --refs flag.
//
// SECTIONS — one per section of the document, printed in the document's order and format:
//   s0        header        the pin census (485 concepts × 3 × 2 = 2,910) and the three known instrument defects:
//                           which figures each one can reach, measured (see DEFECTS below)
//   s1        §1            the two headline tables ("What is held", "What gives")
//   s2        §2            the margin, the keyline table against proportion, the two curves, 280 of 287 on their
//                           own curve and the 7 that are not, square : circle, trajectory shapes, régime medians
//   s3        §3            is 20 a master: whole-drawing scale fits, the grid census (57,126 coordinates), ink-box
//                           ratios, the 16 exact matches and their factors, the reconnaissance correction
//   s4        §4            the mark inside its container: 121 true containers, lint's cruder 319, docs/08's six,
//                           drift bands, the inset table and its three policies, plus-circle's arithmetic
//   s5        §5            the marks (C8): 136 marks, plus/x shares, the size step 102 of 120, the eight contrary marks
//   s6        §6            the detail budget (F11: 453 / 30 / 2, the 30 shedders, set totals) and apparent darkness
//   s7        §7            radii by role, the 2.5 / 2 / 1.5 tier (89 of 89), the three commonest triples
//   s8        §8            angles: on-grid segments and the 45° legs, beyond-0.5° counts, the biggest growths
//   s9        §9            outline against filled: 481 of 485 and the four that differ
//   s10       §10           the classes, régime stability, family spreads, `box:` aspect drift
//   s11       §11           the judged list's own figures (S1–S5, D1–D2, E1–E4), recomputed
//   s12       §12           the figures the eye questions restate
//   appendix  Appendix      the 485-row table, row for row
//
// MEASURES (as the document's header states them; the parameters were recovered from the card's own scratch
// code, s14_an1…7 / s14_table / core / massrun / scalepairs of the 2026-10-04 session, agent aefb405581d210846):
//   ink box     lint's definition (tools/lint.mjs:306-316): a stroked centreline's geometry.bbox grown by half
//               the file's weight, an area path as drawn; w and h rounded to 2 dp from the unrounded edges.
//   share       the larger ink dimension ÷ canvas, rounded to 3 dp before any ratio is taken (as the card did).
//   régime      `keyline: mark` → mark; else `box:` → box; else `anchor:` → anchor; else a keyline within ±0.5
//               (lint.mjs:352, KEYLINE_SLACK) → keyline.
//   ink area    tools/audit/mass.mjs `density` at rate 32 (MASS_RATE); area kept to 4 dp, ofCanvas to 5 dp.
//   angles      tools/audit/angles.mjs `anglesOf` at tolerance 0.5°, minimum segment length 0.1.
//   radii       tools/audit/radii.mjs `radiiOf`, radius to 3 dp by role.
//   scale fit   tools/audit/congruence.mjs `congruentUpToScale` on all of a file's `d` joined, tol 0.005, near 1e9.
//   container   a TRUE container: the first stroked path's ink box spans ≥ 60% of the file's ink box on both axes
//               (radii.mjs bigFrac) and the other paths' ink box sits inside it; inset = the smallest gap between
//               the two boxes. (Once the rest sits inside the first path, the first path's box IS the file's box,
//               so the 60% clause never binds; it is kept because the card's definition states it. A deliberate
//               break of it is the one mutation the tests cannot see — see the card-reprint map.)
//
// INSTRUMENTS: tools/geometry.mjs, tools/masters.mjs (the repo's copies; `git diff 5933041 HEAD` on them is
// empty), tools/audit/{angles,radii,congruence,mass,raster,metrics-check}.mjs. Never edited.
//
// DEFECTS (plans/set-and-rules-audit.md, "Known instrument defects") and how this probe meets each one:
//   raster.mjs:257 `classify` drops an area path's horizontal edges, so `inkArea` / `density` can be wrong on a
//     file with an area path. Exposed here: §6's "filled, median" row only (outline files have no area path).
//     s6 prints the figure as the card measured it (the committed instrument) AND with a bypass inside this probe
//     (`bypassRegion`: a horizontal area edge that straddles a box sends it to sampling, then the committed
//     classify decides) — the fix the plan describes, applied without editing the instrument.
//   congruence.mjs: a ring written the other way round (or from another vertex) fails `tagMulti` and is called
//     "different segment structure". Exposed here: §3's "structurally incomparable" row and anything that rests
//     on a fit. s3 prints the card's figures, then counts the pairs whose canonical tag multisets agree and re-fits
//     them with the multiset check satisfied (`refitAcrossDirection`).
//   geometry.mjs `bbox()` samples arcs at 64 points and can sit up to 0.0056 inside the true edge. The document
//     states lint's box on purpose; s0 counts the drawings whose 2 dp w or h would differ on
//     metrics-check.mjs's solved box, so wave 5 can see what depends on it.
//
// RUN TIME on this machine (pin 5933041): loading and measuring the 2,910 drawings ≈ 1 s; s0's solved boxes
// and s3's 2,910 scale fits ≈ 1 s each; the outline ink areas (first used by s1; shared with s6 s11 appendix)
// ≈ 25 s; s6's filled ink areas, measured twice (committed and bypassed) ≈ 55 s alone, up to 2.5 min when the
// machine is busy; every other section < 1 s. All sections: 1 min 20 s (measured 2026-10-08), up to 3 min busy.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { bbox, subpathsOf, numbersIn } from '../geometry.mjs';
import { MASTERS, STROKES, FILLED_WEIGHT, SIZE_STEP, MIN_GAP, strokeOf, weightOf } from '../masters.mjs';
import { anglesOf, iconFromSource } from './angles.mjs';
import { radiiOf } from './radii.mjs';
import { congruentUpToScale, scaleTrivial, prepare, canonical } from './congruence.mjs';
import { inkArea as massInkArea } from './mass.mjs';
import { readIcon as rasterIcon, regionOf, flatten } from './raster.mjs';
import { readSvg, inkBoxOf as solvedInkBox } from './metrics-check.mjs';

// ── parameters (chosen by the card, recovered from its code; never tuned) ───────────────────────────────
export const MASTER_LIST = [24, 20, 16];
export const PAIRS = [[24, 20], [24, 16], [20, 16]];
export const KEYLINE_SLACK = 0.5;     // lint.mjs:352 — a keyline matches within ±0.5 on each side
export const EXACT = 0.005;           // "exact": a keyline fit, a size step (s14_an5 Q, S)
export const ANGLE_TOL = 0.5;         // anglesOf tolerance, degrees (the document's header)
export const ANGLE_MIN_LEN = 0.1;     // anglesOf minimum segment length
export const MASS_RATE = 32;          // mass.density rate (the document's header)
export const BIG_FRAC = 0.6;          // radii.mjs bigFrac: a container spans ≥ 60% of the file's ink box
export const CONTAIN_EPS = 1e-6;      // the mark's box may touch the container's box
export const INSET_NONZERO = 0.01;    // s14_an4: "a non-zero inset at all three masters"
export const HELD_SHARE = 0.02;       // a progression "holds" its share / aspect within 2% (s14_an4 N, s14_table)
export const HELD_MARK = 0.03;        // the mark / container ratio "holds" within 3% (s14_an3, s14_table)
export const SHAPE_FLAT = 0.005;      // a share change within ±0.5% is "flat" (s14_an6 U)
export const OWN_CURVE = 0.01;        // on its own keyline's curve within 1 percentage point (transcript, toolu_01LFuz…)
export const SCALE_TOL = 0.005;       // a whole-drawing fit within 0.005 is "exact" (scalepairs.mjs)
export const SCALE_NEAR = 0.05;       // "within a twentieth of a unit"
export const SCALE_EIGHTH = 0.125;    // "genuinely one shape at two sizes"
export const INSET_ABSOLUTE = 0.08;   // inset ratio 1 ± 8% = held absolutely (s14_an4 K)
export const INSET_PROPORTIONAL = 0.05; // inset ratio 2/3 ± 5% = held proportionally
export const DRIFT_BANDS = [[-9, -0.15], [-0.15, -0.08], [-0.08, -0.03], [-0.03, 0.03], [0.03, 0.08], [0.08, 0.15], [0.15, 9]];
export const BOX_ESCAPE = 0.12;       // docs/01:127-130's keyline aspect drift that `box:` escapes (s14_an6 W)
export const FILLED_DIVERGES = 0.01;  // filled 24→16 share change differs from the outline's by > 1pp (s14_table)
export const RADIUS_TOP = { container: 3, bend: 2, detail: 3 };   // how many commonest values §7's table shows
export const DOCS08_SIX = ['plus-circle', 'minus-circle', 'x-circle', 'check-circle', 'info', 'help'];
export const DOCS08_BY_HEIGHT = new Set(['info', 'help']);         // docs/08 measured these two by height
export const MARK_TABLE = ['plus-large', 'plus', 'plus-small', 'x-small'];  // §5's table, in its order

// ── small helpers ───────────────────────────────────────────────────────────────────────────────────────
export const r2 = (n) => Math.round(n * 100) / 100;
export const r3 = (n) => Math.round(n * 1000) / 1000;
export const r4 = (n) => (n == null ? null : Math.round(n * 1e4) / 1e4);
const f = (n, d = 3) => (n == null || !Number.isFinite(n) ? '—' : (Math.abs(n) < 5e-12 ? 0 : n).toFixed(d));
const sgn = (n, d = 1) => (n == null || !Number.isFinite(n) ? '—' : `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(d)}`);
const pct = (x, d = 1) => sgn(x * 100, d);
const comma = (n) => n.toLocaleString('en-US');
const sortNum = (a, b) => a - b;
/** The card's quantile: the p-th order statistic, no interpolation (`xs[floor(p·(n−1))]`, s14_an1 `stat`). */
export function quantile(xs, p) {
  const a = xs.filter((x) => x != null && Number.isFinite(x)).sort(sortNum);
  return a.length ? a[Math.floor(p * (a.length - 1))] : null;
}
/** The card's other median: `xs[floor(n/2)]` of the sorted list (s14_an3, s14_an5 R, s14_an6 U). */
export function medianUpper(xs) {
  const a = xs.filter((x) => x != null && Number.isFinite(x)).sort(sortNum);
  return a.length ? a[Math.floor(a.length / 2)] : null;
}
const mean = (xs) => { const a = xs.filter((x) => x != null && Number.isFinite(x)); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const tally = (xs) => xs.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});
/** Round a figure already held to 3 dp to 2 dp, half up on the decimal digits (15.945 → 15.95), not on its binary value. */
export const half2 = (x) => Math.floor(Math.round(x * 1000) / 10 + 0.5) / 100;
/** The same for a figure held to 4 dp, shown to 3 (0.4875 → 0.488). */
export const half3 = (x) => Math.floor(Math.round(x * 1e4) / 10 + 0.5) / 1000;
const head = (t) => console.log(`\n## ${t}`);
const line = (s = '') => console.log(s);

// ── one drawing (core.mjs of the card) ──────────────────────────────────────────────────────────────────
const AREA = /<path\b(?=[^>]*\bstroke="none")(?=[^>]*\bfill="currentColor")[^>]*\bd="([^"]+)"[^>]*\/>/g;

/** lint.mjs:306-316's ink box, unrounded: centrelines grown by half the weight, area paths as drawn. */
export function lintInkBox(ds, areas, stroke) {
  const half = stroke / 2, boxes = [];
  if (ds.length) { const b = bbox(ds); boxes.push([b.x0 - half, b.y0 - half, b.x1 + half, b.y1 + half]); }
  if (areas.length) { const b = bbox(areas); boxes.push([b.x0, b.y0, b.x1, b.y1]); }
  if (!boxes.length) return null;
  return { x0: Math.min(...boxes.map((b) => b[0])), y0: Math.min(...boxes.map((b) => b[1])),
           x1: Math.max(...boxes.map((b) => b[2])), y1: Math.max(...boxes.map((b) => b[3])) };
}

/** The keyline a w×h ink box falls on within lint's slack, in tools/masters.mjs's order, or null. */
export function keylineOf(w, h, master, masters = MASTERS) {
  const k = Object.entries(masters[master].keylines).find(([, [kw, kh]]) => Math.abs(w - kw) <= KEYLINE_SLACK && Math.abs(h - kh) <= KEYLINE_SLACK);
  return k ? k[0] : null;
}

/** Every number the card took from one file. `src` is the SVG text; `file` its name; `master` its folder. */
export function drawingOf(src, { master, file, masters = MASTERS }) {
  const name = file.replace(/\.svg$/, '');
  const concept = name.replace(/-filled$/, '');
  const filled = /-filled$/.test(name);
  const areas = filled ? [...src.matchAll(AREA)].map((m) => m[1]) : [];
  const body = src.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg\b[^>]*>/, '').replace(AREA, '');
  const ds = [...body.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  const stroke = areas.length ? strokeOf(master) : weightOf(name, master);
  const ink = lintInkBox(ds, areas, stroke);
  const w = r2(ink.x1 - ink.x0), h = r2(ink.y1 - ink.y0), size = Math.max(w, h);

  const declaredKeyline = src.match(/<!--\s*keyline:\s*(\w+)\s*-->/)?.[1] ?? null;
  const isMark = declaredKeyline === 'mark';
  const boxM = src.match(/<!--\s*box:\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*-->/);
  const anchorNote = src.match(/<!--\s*anchor:\s*([\w-]+)\s*-->/)?.[1] ?? null;
  const growsNote = src.match(/<!--\s*grows:\s*([-\d.\s]+?)\s*-->/)?.[1] ?? null;
  const keyline = keylineOf(w, h, master, masters);
  const regime = isMark ? 'mark' : boxM ? 'box' : anchorNote ? 'anchor' : keyline ? 'keyline' : 'none';

  // lint.mjs:345-348's cruder container: first stroked path against the rest, outline files only, no containment.
  let lintContainer = null, lintInner = null;
  if (!isMark && !areas.length && ds.length > 1) {
    const b0 = bbox([ds[0]]);
    lintContainer = r2(Math.max(b0.x1 - b0.x0, b0.y1 - b0.y0) + stroke);
    const b = bbox(ds.slice(1));
    lintInner = r2(Math.max(b.x1 - b.x0, b.y1 - b.y0) + stroke);
  }

  const strokeSubpaths = ds.reduce((n, d) => n + subpathsOf(d).length, 0);
  const areaSubpaths = areas.reduce((n, d) => n + subpathsOf(d).length, 0);
  const cmds = [...ds, ...areas].reduce((n, d) => n + (d.match(/[A-Za-z]/g) ?? []).length, 0);

  const icon = iconFromSource(src, { file, master });
  const ang = anglesOf(icon, { tolerance: ANGLE_TOL, minLength: ANGLE_MIN_LEN });
  const devs = ang.segments.map((s) => s.dev);
  const rr = radiiOf(icon);
  const byRole = { container: [], bend: [], detail: [], ambiguous: [] };
  for (const c of rr.corners) if (c.kind !== 'sharp') byRole[c.role].push(r3(c.radius));
  for (const v of Object.values(byRole)) v.sort(sortNum);

  return {
    master, file, name, concept, filled, stroke, ink, w, h, size,
    sizeOfCanvas: r3(size / master), wOfCanvas: r3(w / master), hOfCanvas: r3(h / master),
    regime, keyline, declaredKeyline, boxNote: boxM ? `${boxM[1]}x${boxM[2]}` : null, anchorNote, growsNote,
    paths: ds.length, areaPaths: areas.length, strokeSubpaths, areaSubpaths, subpaths: strokeSubpaths + areaSubpaths, cmds,
    lintContainer, lintInner, lintMarkRatio: lintContainer && lintInner ? r3(lintInner / lintContainer) : null,
    angle: { segments: ang.segments.length, off: ang.off.length,
              meanDev: devs.length ? r3(devs.reduce((a, b) => a + b, 0) / devs.length) : null,
              maxDev: devs.length ? r3(Math.max(...devs)) : null,
              segs: ang.segments.map((s) => ({ dev: s.dev, nearest: s.nearest })) },
    radii: byRole, ds, areas, src,
  };
}

/** A TRUE container (s14_an3/an4/table): the first stroked path holds the rest and is the body of the drawing. */
export function containerOf(row) {
  if (!row || row.declaredKeyline === 'mark' || row.areaPaths || row.paths < 2) return null;
  const half = row.stroke / 2;
  const b0 = bbox([row.ds[0]]);
  const C = { x0: b0.x0 - half, y0: b0.y0 - half, x1: b0.x1 + half, y1: b0.y1 + half };
  const b1 = bbox(row.ds.slice(1));
  const M = { x0: b1.x0 - half, y0: b1.y0 - half, x1: b1.x1 + half, y1: b1.y1 + half };
  const cw = C.x1 - C.x0, ch = C.y1 - C.y0, mw = M.x1 - M.x0, mh = M.y1 - M.y0;
  if (cw < BIG_FRAC * (row.ink.x1 - row.ink.x0) || ch < BIG_FRAC * (row.ink.y1 - row.ink.y0)) return null;
  const E = CONTAIN_EPS;
  if (M.x0 < C.x0 - E || M.y0 < C.y0 - E || M.x1 > C.x1 + E || M.y1 > C.y1 + E) return null;
  return { cw, ch, mw, mh, cSize: Math.max(cw, ch), mSize: Math.max(mw, mh),
           ratio: Math.max(mw, mh) / Math.max(cw, ch),
           clear: Math.min(M.x0 - C.x0, M.y0 - C.y0, C.x1 - M.x1, C.y1 - M.y1) };
}

// ── the set ─────────────────────────────────────────────────────────────────────────────────────────────
export function isPin(pin) { return MASTER_LIST.every((m) => existsSync(join(pin, 'src/icons', String(m)))); }

/** Every drawing of the pin, in the card's order (master 24, 20, 16; files in default sort order). */
export function loadSet(pin) {
  const rows = [];
  for (const master of MASTER_LIST) {
    const dir = join(pin, 'src/icons', String(master));
    for (const file of readdirSync(dir).sort()) {
      if (!file.endsWith('.svg')) continue;
      rows.push({ ...drawingOf(readFileSync(join(dir, file), 'utf8'), { master, file }), path: join(dir, file) });
    }
  }
  const byConcept = new Map();
  for (const r of rows) {
    if (!byConcept.has(r.concept)) byConcept.set(r.concept, { outline: {}, filled: {} });
    byConcept.get(r.concept)[r.filled ? 'filled' : 'outline'][r.master] = r;
  }
  const concepts = [...byConcept.keys()].sort();
  const tri = (c, style = 'outline') => MASTER_LIST.map((m) => byConcept.get(c)?.[style][m]);
  const full = concepts.filter((c) => tri(c).every(Boolean));
  return { pin, rows, byConcept, concepts, tri, full };
}

// ── progressions ────────────────────────────────────────────────────────────────────────────────────────
/** The share's change from 24: [Δ20, Δ16] as fractions, on the 3 dp shares. */
export const shareChange = (o) => { const s = o.map((r) => r.sizeOfCanvas); return [s[1] / s[0] - 1, s[2] / s[0] - 1]; };

/** s14_an6 U: the shape of a share trajectory. */
export function shapeOf(a, b, flat = SHAPE_FLAT) {
  if (Math.abs(a) <= flat && Math.abs(b) <= flat) return 'flat';
  if (a < -flat && b > flat) return 'dip-then-rise';
  if (a < -flat && b <= flat && b >= -flat) return 'dip-then-back';
  if (a <= flat && b < -flat) return 'falls';
  if (a > flat && b > flat) return 'rises';
  if (a >= -flat && a <= flat && b > flat) return 'flat-then-rise';
  if (a > flat && b < -flat) return 'rise-then-fall';
  return 'other';
}

/** The curve of a keyline: its larger side over the canvas at each master, and the two changes from 24. */
export function keylineCurve(name, masters = MASTERS) {
  const s = MASTER_LIST.map((m) => Math.max(...masters[m].keylines[name]) / m);
  return { share: s, a: s[1] / s[0] - 1, b: s[2] / s[0] - 1 };
}

/** Is a keyline-held concept on its own keyline's curve within `tol` (fractions of itself) at 20 and 16? */
export function onOwnCurve(o, masters = MASTERS, tol = OWN_CURVE) {
  const k = keylineCurve(o[0].keyline, masters);
  const [a, b] = shareChange(o);
  return Math.abs(a - k.a) <= tol && Math.abs(b - k.b) <= tol;
}

const aspectSpread = (o) => { const a = o.map((r) => (r.h ? r.w / r.h : null)); return a.every(Boolean) ? Math.max(...a) / Math.min(...a) - 1 : null; };
const keyHeld = (o) => o[0].regime === 'keyline' && new Set(o.map((r) => r.keyline)).size === 1;

/** The appendix's `holds` (s14_table): K keyline, A aspect within 2%, D detail count, M mark/container within 3%. */
export function holdsOf(o) {
  const t = o.map(containerOf);
  const h = [];
  if (keyHeld(o)) h.push('K');
  const sp = aspectSpread(o);
  if (sp != null && sp <= HELD_SHARE) h.push('A');
  if (new Set(o.map((r) => r.subpaths)).size === 1) h.push('D');
  if (t.every(Boolean) && Math.abs(t[2].ratio / t[0].ratio - 1) <= HELD_MARK) h.push('M');
  return h.join('');
}

/** §10's eight classes from the holds string: K/A/D decide, M splits K A D into classes 1 and 2. */
export function classOf(holds) {
  const K = holds.includes('K'), A = holds.includes('A'), D = holds.includes('D'), M = holds.includes('M');
  if (K && A && D) return M ? 2 : 1;
  if (K && !A && D) return 3;
  if (!K && !A && D) return 4;
  if (!K && A && D) return 5;
  if (K && !D) return 6;
  if (!K && A && !D) return 7;
  return 8;
}

/** s14_an4 K: how the inset moved from 24 to 16. */
export function insetPolicy(r) {
  if (Math.abs(r - 1) <= INSET_ABSOLUTE) return 'absolute';
  if (Math.abs(r - 2 / 3) <= INSET_PROPORTIONAL) return 'proportional';
  if (r > 2 / 3 && r < 1) return 'between';
  return 'other';
}

/** s14_an7: a family is the name with -large / -small and then a trailing -<n> taken off. */
export const familyOf = (c) => c.replace(/-(large|small)$/, '').replace(/-\d+$/, '');

// ── §3: whole-drawing scale fits (scalepairs.mjs of the card) ───────────────────────────────────────────
export function partsOf(src) {
  const areas = [...src.matchAll(AREA)].map((m) => m[1]);
  const body = src.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg\b[^>]*>/, '').replace(AREA, '');
  const ds = [...body.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  return [...ds, ...areas];
}

/** One file at master `a` against the same file at `b`, up to translation and one uniform scale. */
export function scalePair(srcA, srcB, a, b) {
  const A = partsOf(srcA), B = partsOf(srcB);
  const row = { from: a, to: b, pathsA: A.length, pathsB: B.length };
  if (A.length !== B.length) return { ...row, verdict: 'structure', reason: 'path count differs' };
  const dA = A.join(' '), dB = B.join(' ');
  try {
    const res = congruentUpToScale(dA, dB, { tol: SCALE_TOL, near: 1e9 });
    return judgeFit({ ...row, dA, dB, trivial: scaleTrivial(dA) }, res, a);
  } catch (e) {
    return { ...row, verdict: 'unsupported', reason: e.reason ?? String(e.message).slice(0, 120) };
  }
}
function judgeFit(row, res, a) {
  const out = { ...row, same: res.same, scale: res.scale == null ? null : r4(res.scale),
    resid: res.maxDeviation === Infinity ? null : r4(res.maxDeviation), reason: res.reason ?? null };
  out.verdict = res.maxDeviation === Infinity ? 'structure' : res.maxDeviation <= SCALE_TOL ? 'exact'
    : res.maxDeviation <= SCALE_NEAR ? 'near' : 'redrawn';
  out.residOfCanvas = out.resid == null ? null : r4(res.maxDeviation / a);
  return out;
}

/** The congruence defect's bypass: when only the as-written tag multiset differs and the canonical (direction-
 *  and start-free) one agrees, re-run the same fit with the multiset check satisfied. Null when not exposed. */
export function refitAcrossDirection(row) {
  if (row.verdict !== 'structure' || row.reason !== 'different segment structure') return null;
  const canonTags = (d) => canonical(d).subpaths.map((s) => s.tagKey).sort().join(' / ');
  if (canonTags(row.dA) !== canonTags(row.dB)) return null;
  const pA = prepare(row.dA), pB = prepare(row.dB);
  pB.tagMulti = pA.tagMulti;
  return judgeFit({ ...row }, congruentUpToScale(pA, pB, { tol: SCALE_TOL, near: 1e9 }), row.from);
}

export function scalePairs(set) {
  const out = [];
  const files = readdirSync(join(set.pin, 'src/icons/24')).filter((x) => x.endsWith('.svg')).sort();
  const src = (m, file) => readFileSync(join(set.pin, 'src/icons', String(m), file), 'utf8');
  for (const file of files) {
    const name = file.replace(/\.svg$/, '');
    for (const [a, b] of PAIRS) {
      if (!existsSync(join(set.pin, 'src/icons', String(b), file))) continue;
      out.push({ file, name, filled: /-filled$/.test(name), ...scalePair(src(a, file), src(b, file), a, b) });
    }
  }
  return out;
}

/** §3: what share of the 24 coordinates lands on the 20 quarter grid at 20/24 and the 16 eighth grid at 16/24. */
export function gridLanding(numbers) {
  let tot = 0, ok20 = 0, ok16 = 0;
  for (const n of numbers) {
    tot++;
    const v20 = n * (20 / 24), v16 = n * (16 / 24);
    if (Math.abs(v20 * 4 - Math.round(v20 * 4)) < 1e-9) ok20++;
    if (Math.abs(v16 * 8 - Math.round(v16 * 8)) < 1e-9) ok16++;
  }
  return { tot, ok20, ok16 };
}

// ── ink area (massrun.mjs of the card) and the raster defect's bypass ───────────────────────────────────
/** raster.mjs's region with one change: a horizontal area edge straddling a box makes it mixed (sampled). */
export function bypassRegion(icon) {
  const reg = regionOf(icon);
  const flats = [];
  for (const p of icon.paths) {
    if (p.kind !== 'area') continue;
    for (const { pts } of flatten(p.d, { tol: reg.tol })) {
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
        if (ay === by && ax !== bx) flats.push([Math.min(ax, bx), Math.max(ax, bx), ay]);
      }
    }
  }
  if (!flats.length) return reg;
  const classify = (bx0, by0, bx1, by1) => {
    for (const [xa, xb, y] of flats) if (y > by0 && y < by1 && xa < bx1 && xb > bx0) return null;
    return reg.classify(bx0, by0, bx1, by1);
  };
  return { ...reg, classify };
}

/** Ink area (4 dp) and ink ÷ canvas² (5 dp) of one file, as the card rounded them. mass.mjs `inkArea` is the
 *  area `density` itself takes (mass.mjs:107-112) — `density` also walks the ink box, which no figure here uses,
 *  so it is skipped. `bypass` measures on bypassRegion. */
export function inkOf(path, { bypass = false } = {}) {
  const icon = rasterIcon(path);
  const { area } = massInkArea(bypass ? { icon, region: bypassRegion(icon) } : icon, { rate: MASS_RATE });
  return { area: Math.round(area * 1e4) / 1e4, ofCanvas: Math.round((area / icon.canvas ** 2) * 1e5) / 1e5 };
}
function attachMass(set, { filled = false, bypass = false } = {}) {
  const key = bypass ? 'massFixed' : 'mass';
  for (const r of set.rows) {
    if (r.filled !== filled || r[key]) continue;
    if (bypass && !r.areaPaths) { r.massFixed = r.mass ?? inkOf(r.path); continue; }
    r[key] = inkOf(r.path, { bypass });
  }
}

// ── the printing ────────────────────────────────────────────────────────────────────────────────────────
export function ctx(set) {
  const { byConcept, concepts, tri, full } = set;
  const T = new Map();
  for (const c of full) { const o = tri(c).map(containerOf); if (o.every(Boolean)) T.set(c, o); }
  const T66 = new Map([...T].filter(([, o]) => o.every((x) => x.clear > INSET_NONZERO)));
  const traj = full.map((c) => {
    const o = tri(c); const [a, b] = shareChange(o);
    return { c, o, regime: o[0].regime, keyline: o[0].keyline, s: o.map((r) => r.sizeOfCanvas), a, b, ar: r4(a), br: r4(b), shape: shapeOf(a, b) };
  });
  return { ...set, T, T66, traj, trajOf: new Map(traj.map((x) => [x.c, x])) };
}

// s0 — the header ---------------------------------------------------------------------------------------
function s0(C) {
  head('§0 header — the pin, and the instrument defects');
  const n = (m, filled) => C.rows.filter((r) => r.master === m && r.filled === filled).length;
  line(`concepts ${C.concepts.length} · drawings ${comma(C.rows.length)} = ${MASTER_LIST.map((m) => `${m}: ${n(m, false)} + ${n(m, true)}`).join(' · ')}`);
  line(`${C.concepts.length} concepts × ${MASTER_LIST.length} masters × 2 styles = ${comma(C.concepts.length * 6)} files`);
  line('lint result (the document\'s first paragraph): run `node tools/lint.mjs` in the pin; this probe does not re-run lint');
  line(`parameters: ink area at rate ${MASS_RATE}; angles at tolerance ${ANGLE_TOL}° (minimum segment ${ANGLE_MIN_LEN}); keyline slack ±${KEYLINE_SLACK}`);
  // geometry.bbox against the solved box (metrics-check.mjs)
  let diff = 0; const names = [];
  for (const r of C.rows) {
    const b = solvedInkBox(readSvg(r.src, r.file));
    if (r2(b.x1 - b.x0) !== r.w || r2(b.y1 - b.y0) !== r.h) { diff++; if (names.length < 20) names.push(`${r.master}/${r.name} ${r.w}×${r.h} → ${r2(b.x1 - b.x0)}×${r2(b.y1 - b.y0)}`); }
  }
  line(`geometry.bbox defect: ${diff} of ${comma(C.rows.length)} drawings have a 2 dp w or h that the solved box (metrics-check.mjs) reads differently${diff ? ` — ${names.join(' · ')}${diff > names.length ? ' …' : ''}` : ''}`);
  const area = C.rows.filter((r) => r.areaPaths).length;
  line(`raster.mjs classify defect: ${area} drawings carry an area path; the only figure here measured on them is §6's "filled, median" row — s6 prints it both ways`);
  line('congruence.mjs ring-direction defect: s3 counts the exposed pairs and prints the figures with and without the bypass');
}

// s1 — the answer -----------------------------------------------------------------------------------------
function s1(C) {
  head('§1 The answer, in one page');
  const keyHeldC = C.traj.filter((x) => x.regime === 'keyline');
  const own = keyHeldC.filter((x) => onOwnCurve(x.o)).length;
  const exact3 = keylineExactness(C).all3, exact3Solved = keylineExactness(C, solvedDims).all3;
  const ex24 = exactShare(C, 24);
  const detail = detailCensus(C, 'outline');
  const aspect = C.traj.filter((x) => { const s = aspectSpread(x.o); return s != null && s <= HELD_SHARE; }).length;
  const rt = radiusTriples(C);
  const canon = rt.rows.filter((r) => r.v[0] === 2.5);
  const canonOk = canon.filter((r) => r.v[1] === 2 && r.v[2] === 1.5).length;
  const div = filledDivergence(C);
  line('What is held:');
  line(`| Its keyline, exactly | ${own} of ${keyHeldC.length} keyline-held concepts on their own keyline's curve within ${OWN_CURVE * 100}pp (all three masters exact within ${EXACT}: ${exact3} on lint's box, ${exact3Solved} on the solved box); ${f(ex24.share * 100, 1)}% of keyline-held drawings exact at 24 | 3 |`);
  line(`| The detail count | ${detail.same} of ${C.full.length} outline concepts keep the same subpath count; ${detail.lose.length} shed, ${detail.gain.length} gain | 6 |`);
  line(`| The aspect ratio | ${aspect} of ${C.full.length} hold w/h within ${HELD_SHARE * 100}% | 10 |`);
  line(`| The radius tier | ${canonOk} of ${canon.length} concepts at container radius 2.5 go 2 at 20 and 1.5 at 16. Exceptions: ${canon.length - canonOk} | 7 |`);
  line(`| The outline↔filled pair | ${div.both - div.rows.length} of ${div.both} concepts have identical progressions in both styles | 9 |`);
  line('What gives:');
  const spread = C.traj.map((x) => r4(Math.max(...x.s) / Math.min(...x.s) - 1));
  line(`| The share of the canvas | ${spread.filter((s) => s <= 0.02).length} of ${C.full.length} hold it within 2%. ${spread.filter((s) => s <= 0.05).length} within 5%. ${spread.filter((s) => s > 0.10).length} spread more than 10% | 2 |`);
  const sc = squareCircle();
  line(`| The proportion between two keylines | a square icon beside a circle icon reads ${f(sc[0], 3)} : 1 at 24, ${f(sc[1], 3)} at 20, ${f(sc[2], 3)} at 16 — a ${f((sc[0] / sc[2] - 1) * 100, 1)}% swing | 2 |`);
  const drift = markDrift(C);
  line(`| The mark inside its container | mean ${sgn(mean(drift.map((x) => x.d)) * 100, 1)}% 24→16 over ${drift.length} container concepts; worst ${pct(drift[0].d)}% (\`${drift[0].c}\`) | 4 |`);
  const marks = C.traj.filter((x) => x.regime === 'mark');
  const worstMark = marks.slice().sort((p, q) => q.b - p.b)[0];
  line(`| A mark's share of its canvas | median ${sgn(medianUpper(marks.map((x) => x.br)) * 100, 1)}% 24→16 over ${marks.length} mark concepts; worst ${pct(worstMark.b)}% (\`${worstMark.c}\`) | 5 |`);
  const L = onGridAngles(C, 'outline');
  line(`| The angle of an intended 45° leg | mean deviation ${f(L[24].mean45, 3)}° at 24 → ${f(L[16].mean45, 3)}° at 16, and ${L[24].n45 - L[16].n45} fewer legs stay inside half a degree | 8 |`);
  attachMass(C, { filled: false });
  const dr = densityRatios(C, 'outline');
  line(`| The apparent darkness | ink per unit of canvas rises ${pct(dr['24-16'] - 1)}% median from 24 to 16 (outline) | 6 |`);
}

// s2 — the margin and the keyline table -----------------------------------------------------------------
export function squareCircle(masters = MASTERS) { return MASTER_LIST.map((m) => masters[m].keylines.square[0] / masters[m].keylines.circle[0]); }
function s2(C) {
  head('§2 The root cause: the margin, and therefore the keyline table');
  line(`drawing bound: ${MASTER_LIST.map((m) => `[${MASTERS[m].bound.join(', ')}] at ${m}`).join(', ')}`);
  line('| | 24 | 20 | 16 |');
  line(`| margin, units | ${MASTER_LIST.map((m) => MASTERS[m].bound[0]).join(' | ')} |`);
  line(`| margin ÷ canvas | ${MASTER_LIST.map((m) => `${f(MASTERS[m].bound[0] / m * 100, 2)}%`).join(' | ')} |`);
  line(`| drawing bound ÷ canvas | ${MASTER_LIST.map((m) => `${f((MASTERS[m].bound[1] - MASTERS[m].bound[0]) / m * 100, 1)}%`).join(' | ')} |`);
  line('| Keyline | 24 | 20 | 16 | 24→20 | vs prop. | 24→16 | vs prop. | 20→16 | vs prop. |');
  const dims = (k, m) => MASTERS[m].keylines[k];
  const vs = (r, a, b) => r / (b / a) - 1;
  for (const k of ['circle', 'square', 'portrait', 'landscape']) {
    const cells = MASTER_LIST.map((m) => (k === 'circle' ? `⌀${dims(k, m)[0]}` : k === 'square' ? `${dims(k, m)[0]}` : `${dims(k, m)[0]}×${dims(k, m)[1]}`));
    const part = PAIRS.map(([a, b]) => {
      const [wa, ha] = dims(k, a), [wb, hb] = dims(k, b);
      if (wa === ha) return `${f(wb / wa, 3)} | ${pct(vs(wb / wa, a, b))}`;
      return `w ${f(wb / wa, 3)} / h ${f(hb / ha, 3)} | w ${pct(vs(wb / wa, a, b))} / h ${pct(vs(hb / ha, a, b))}`;
    });
    line(`| ${k} | ${cells.join(' | ')} | ${part.join(' | ')} |`);
  }
  line(`| Mark ceiling | ${MASTER_LIST.map((m) => MASTERS[m].mark).join(' | ')} | ${PAIRS.map(([a, b]) => `${f(MASTERS[b].mark / MASTERS[a].mark, 3)} | ${pct(vs(MASTERS[b].mark / MASTERS[a].mark, a, b))}`).join(' | ')} |`);
  line('two curves (largest ink dimension ÷ canvas):');
  const groups = new Map();
  for (const k of Object.keys(MASTERS[24].keylines)) { const c = keylineCurve(k); const key = c.share.map((x) => f(x, 3)).join(' → '); if (!groups.has(key)) groups.set(key, { c, ks: [] }); groups.get(key).ks.push(k); }
  const mc = MASTER_LIST.map((m) => MASTERS[m].mark / m);
  const mk = mc.map((x) => f(x, 3)).join(' → ');
  if (!groups.has(mk)) groups.set(mk, { c: { share: mc, a: mc[1] / mc[0] - 1, b: mc[2] / mc[0] - 1 }, ks: [] });
  groups.get(mk).ks.push('mark ceiling');
  for (const [key, g] of groups) line(`- ${g.ks.join(' · ')}: ${key} = ${pct(g.c.a)}% then ${pct(g.c.b)}%`);
  const kh = C.traj.filter((x) => x.regime === 'keyline');
  const off = kh.filter((x) => !onOwnCurve(x.o));
  line(`keyline-held outline concepts on their own curve within ${OWN_CURVE * 100}pp: ${kh.length - off.length} of ${kh.length}; the other ${off.length}:`);
  for (const x of off) line(`  ${x.c} (${x.keyline}, ${x.o.map((r) => `${r.w}x${r.h}`).join('/')}, ${pct(x.a)}%/${pct(x.b)}%)`);
  const sc = squareCircle();
  line('| | 24 | 20 | 16 |');
  line(`| square : circle | ${MASTER_LIST.map((m, i) => `${MASTERS[m].keylines.square[0]}:${MASTERS[m].keylines.circle[0]} = ${f(sc[i], 3)}`).join(' | ')} |`);
  const byK = tally(kh.map((x) => x.keyline));
  line(`keyline-held concepts by keyline: ${Object.entries(byK).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  line(`a square icon is ${f((1 - sc[0]) * 100, 1)}% smaller than a circle icon at 24, ${f((1 - sc[2]) * 100, 1)}% at 16; swing ${f((sc[0] / sc[2] - 1) * 100, 1)}%`);
  line(`trajectory shape of the share of canvas, all ${C.traj.length} outline concepts:`);
  const shapes = tally(C.traj.map((x) => x.shape));
  for (const s of ['dip-then-rise', 'dip-then-back', 'rises', 'falls', 'flat-then-rise', 'flat']) line(`| ${s} | ${shapes[s] ?? 0} |`);
  line('median share change by régime:');
  for (const rg of ['keyline', 'box', 'anchor', 'mark']) {
    const s = C.traj.filter((x) => x.regime === rg);
    line(`| ${rg} | ${s.length} | ${sgn(r4(medianUpper(s.map((x) => x.ar)) * 100), 2)}% | ${sgn(r4(medianUpper(s.map((x) => x.br)) * 100), 2)}% |`);
  }
  line('each keyline against a straight proportional reduction from 24, in units (= px at that master):');
  for (const k of ['circle', 'square']) line(`  ${k}: ${MASTER_LIST.slice(1).map((m) => `${sgn(MASTERS[m].keylines[k][0] - MASTERS[24].keylines[k][0] * m / 24, 2)} at ${m}`).join(' · ')}`);
}

// s3 — is 20 a master ---------------------------------------------------------------------------------------
function s3(C) {
  head('§3 Is 20 a master or a scale?');
  const sp = scalePairs(C);
  const g = (rows, a, b) => rows.filter((r) => r.from === a && r.to === b);
  const table = (rows, label) => {
    line(label);
    line('| | 24→20 | 24→16 | 20→16 |');
    const cell = (fn) => PAIRS.map(([a, b]) => fn(g(rows, a, b))).join(' | ');
    line(`| whole drawing is the other resized (residual ≤ ${SCALE_TOL}, non-trivial) | ${cell((s) => `${s.filter((r) => r.verdict === 'exact' && !r.trivial).length} of ${s.length} — ${f(100 * s.filter((r) => r.verdict === 'exact' && !r.trivial).length / s.length, 1)}%`)} |`);
    line(`| within a twentieth of a unit (residual ≤ ${SCALE_NEAR}) | ${cell((s) => { const n = s.filter((r) => r.resid != null && r.resid <= SCALE_NEAR).length; return `${n} — ${f(100 * n / s.length, 1)}%`; })} |`);
    line(`| different path count | ${cell((s) => s.filter((r) => r.verdict === 'structure' && r.reason === 'path count differs').length)} |`);
    line(`| structurally incomparable at all | ${cell((s) => s.filter((r) => r.verdict === 'structure').length)} |`);
    line(`| median residual, units of the source canvas | ${cell((s) => f(r4(medianUpper(s.filter((r) => r.resid != null).map((r) => r.resid))), 3))} |`);
  };
  table(sp, 'as the card measured it (congruence.mjs as committed):');
  const pts = [];
  for (const file of readdirSync(join(C.pin, 'src/icons/24')).filter((x) => x.endsWith('.svg')).sort()) {
    const src = readFileSync(join(C.pin, 'src/icons/24', file), 'utf8');
    for (const m of src.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<path[^>]*\bd="([^"]+)"/g)) pts.push(...numbersIn(m[1]));
  }
  const gl = gridLanding(pts);
  line(`grid: of the ${comma(gl.tot)} coordinates in the 24 master's files (outline and filled, every number in every d), ${f(100 * gl.ok20 / gl.tot, 1)}% land on the 20 master's quarter grid at ×0.8333 and ${f(100 * gl.ok16 / gl.tot, 1)}% on the 16 master's eighth grid at ×0.6667`);
  const outlinePts = [];
  for (const c of C.concepts) { const r = C.byConcept.get(c).outline[24]; if (r) for (const d of r.ds) outlinePts.push(...numbersIn(d)); }
  const go = gridLanding(outlinePts);
  line(`  (outline files only: ${comma(go.tot)} coordinates, ${f(100 * go.ok20 / go.tot, 1)}% and ${f(100 * go.ok16 / go.tot, 1)}%)`);
  const wr = (a, b) => quantile(C.full.map((c) => C.byConcept.get(c).outline[b].w / C.byConcept.get(c).outline[a].w), 0.5);
  line(`ink box, median w ratio (outline): ${PAIRS.map(([a, b]) => `${a}→${b} ${f(r4(wr(a, b)), 3)} against nominal ${f(b / a, 4)}`).join('; ')}`);
  line('the non-trivial exact matches at 24→20 and the factor each took:');
  const ex = g(sp, 24, 20).filter((r) => r.verdict === 'exact' && !r.trivial);
  line(`  ${ex.map((r) => `${r.name} ${f(r.scale, 4)}`).join(' · ')}`);
  line(`  factors: ${f(Math.min(...ex.map((r) => r.scale)), 4)} to ${f(Math.max(...ex.map((r) => r.scale)), 4)}; centreline ratio of the circle keyline 24→20 = (${MASTERS[20].keylines.circle[0]}−${STROKES[20]}) ÷ (${MASTERS[24].keylines.circle[0]}−${STROKES[24]}) = ${f((MASTERS[20].keylines.circle[0] - STROKES[20]) / (MASTERS[24].keylines.circle[0] - STROKES[24]), 4)}`);
  for (const m of [24, 20]) {
    const r = C.byConcept.get('x-small')?.filled[m];
    if (r) line(`  x-small-filled at ${m}: ${r.ds.join(' ')}`);
  }
  const fam = ex.filter((r) => /^(plus|minus|x)(-large|-small)?(-filled)?$/.test(r.name));
  const ringRatio = (MASTERS[20].keylines.circle[0] - STROKES[20]) / (MASTERS[24].keylines.circle[0] - STROKES[24]);
  const ring = ex.filter((r) => Math.abs(r.scale - ringRatio) < 0.0005);
  line(`  at the circle keyline's centreline ratio (${f(ringRatio, 4)}, within 0.0005): ${ring.map((r) => r.name).join(', ')}; plus / minus / x size families: ${fam.length}, factors ${f(Math.min(...fam.map((r) => r.scale)), 3)} to ${f(Math.max(...fam.map((r) => r.scale)), 3)}; neither: ${ex.filter((r) => !fam.includes(r) && !ring.includes(r)).map((r) => `${r.name} ${f(r.scale, 4)}`).join(', ') || 'none'}`);
  line(`fitted factor of the non-trivial pairs with residual ≤ an eighth (${SCALE_EIGHTH}) (median):`);
  line(`  ${PAIRS.map(([a, b]) => `${a}→${b} ${f(r4(medianOfScales(g(sp, a, b))), 3)} (nominal ${f(b / a, 3)})`).join(' · ')}`);
  const cl = (m) => MASTERS[m].keylines.circle[0] - STROKES[m];
  line(`reconnaissance correction — the circle keyline's centreline diameters: ${MASTER_LIST.map((m) => `${cl(m)} at ${m}`).join(', ')}; ${cl(20)}/${cl(24)} = ${f(cl(20) / cl(24), 4)} (${pct(cl(20) / cl(24) / (20 / 24) - 1)}% against proportional), ${cl(16)}/${cl(24)} = ${f(cl(16) / cl(24), 4)} (${pct(cl(16) / cl(24) / (16 / 24) - 1)}%); on ink ${f(MASTERS[20].keylines.circle[0] / MASTERS[24].keylines.circle[0], 3)} and ${f(MASTERS[16].keylines.circle[0] / MASTERS[24].keylines.circle[0], 3)}, i.e. ${pct(MASTERS[20].keylines.circle[0] / MASTERS[24].keylines.circle[0] / (20 / 24) - 1)}% and ${pct(MASTERS[16].keylines.circle[0] / MASTERS[24].keylines.circle[0] / (16 / 24) - 1)}%`);
  // the defect
  const fixed = sp.map((r) => refitAcrossDirection(r) ?? r);
  const exposed = sp.filter((r) => refitAcrossDirection(r)).length;
  line(`congruence defect: ${exposed} of ${sp.filter((r) => r.verdict === 'structure').length} "structural" pairs differ only in the direction or start of a ring; re-fitted:`);
  table(fixed, 'with the bypass (refitAcrossDirection):');
  const fx = g(fixed, 24, 20).filter((r) => r.verdict === 'exact' && !r.trivial).map((r) => r.name);
  line(`  non-trivial exact at 24→20 with the bypass: ${fx.length}${fx.length !== ex.length ? ` (${fx.filter((n) => !ex.some((r) => r.name === n)).join(', ')} added)` : ''}`);
}
function medianOfScales(rows) { return quantile(rows.filter((r) => r.resid != null && r.resid <= SCALE_EIGHTH && !r.trivial).map((r) => r.scale), 0.5); }

// s4 — the mark inside its container ------------------------------------------------------------------------
/** s14_an3's drift: 24→16 change of the r4 mark/container ratio, sorted from the worst shrink. */
export function markDrift(C) {
  return [...C.T].map(([c, o]) => ({ c, o, rr: o.map((x) => r4(x.ratio)), d: r4(o[2].ratio) / r4(o[0].ratio) - 1 })).sort((a, b) => a.d - b.d);
}
function s4(C) {
  head('§4 The mark inside its container — docs/08 §6.1 re-measured at 485');
  line(`true containers at all three masters (first path ≥ ${BIG_FRAC * 100}% of the ink box on both axes, the rest inside it): ${C.T.size} of ${C.full.length} concepts`);
  const lintC = C.full.filter((c) => C.tri(c).every((r) => r.lintMarkRatio != null));
  line(`lint's cruder test (first path = container, no containment): accepts ${lintC.length}; users-3-level at 24 = ${C.byConcept.get('users-3-level')?.outline[24]?.lintMarkRatio ?? '—'}`);
  line('docs/08\'s six, with its own measure (mark ink width ÷ container ink diameter; info and help by height):');
  line('| icon | 24 | 20 | 16 | measured now |');
  for (const c of DOCS08_SIX) {
    const o = C.T.get(c);
    if (!o) { line(`| \`${c}\` | not a true container |`); continue; }
    const v = o.map((x) => (DOCS08_BY_HEIGHT.has(c) ? r4(r4(x.mh) / r4(x.ch)) : r4(r4(x.mw) / r4(x.cw))));
    line(`| \`${c}\`${DOCS08_BY_HEIGHT.has(c) ? ' (height)' : ''} | ${v.map((x) => f(half3(x), 3)).join(' | ')} | ${sgn((v[2] / v[0] - 1) * 100, 1)}% |`);
  }
  const drift = markDrift(C);
  line('| 24→16 drift band | concepts | share |');
  const labels = ['worse than −15%', '−15% to −8%', '−8% to −3%', '−3% to +3% (held)', '+3% to +8%', '+8% to +15%', 'better than +15%'];
  DRIFT_BANDS.forEach(([lo, hi], i) => { const n = drift.filter((x) => x.d > lo && x.d <= hi).length; line(`| ${labels[i]} | ${n} | ${f(100 * n / drift.length, 1)}% |`); });
  const rr = (c) => drift.find((x) => x.c === c).rr;
  const down = drift.filter((x) => x.rr[0] > x.rr[1] + 1e-9 && x.rr[1] > x.rr[2] + 1e-9).length;
  const up = drift.filter((x) => x.rr[0] < x.rr[1] - 1e-9 && x.rr[1] < x.rr[2] - 1e-9).length;
  const held = drift.filter((x) => Math.abs(x.d) <= HELD_MARK).length;
  line(`mean ${sgn(r4(mean(drift.map((x) => x.d)) * 100), 1)}%, median ${sgn(r4(drift[Math.floor(drift.length / 2)].d * 100), 1)}%; monotonic shrink ${down}, monotonic growth ${up}, held within 3% ${held}`);
  line(`worst: ${drift.slice(0, 2).map((x) => `${x.c} ${pct(x.d)}% (${rr(x.c).join(' / ')})`).join(' · ')}`);
  // the inset
  const cs = [...C.T66.keys()];
  const clear = (m) => cs.map((c) => C.T66.get(c)[MASTER_LIST.indexOf(m)].clear);
  const ratio = (a, b) => cs.map((c) => C.T66.get(c)[MASTER_LIST.indexOf(b)].clear / C.T66.get(c)[MASTER_LIST.indexOf(a)].clear);
  line(`the inset, over the ${cs.length} container concepts with a non-zero inset at all three masters:`);
  line('| | 24 | 20 | 16 |');
  line(`| inset, units (median) | ${MASTER_LIST.map((m) => f(r4(quantile(clear(m), 0.5)), 2)).join(' | ')} |`);
  line(`| inset ÷ canvas (median) | ${MASTER_LIST.map((m) => f(quantile(clear(m), 0.5) / m, 3)).join(' | ')} |`);
  line(`| inset ratio from 24 (median) | — | ${f(r4(quantile(ratio(24, 20), 0.5)), 3)} (prop. ${f(20 / 24, 3)}) | ${f(r4(quantile(ratio(24, 16), 0.5)), 3)} (prop. ${f(16 / 24, 3)}) |`);
  line(`| vs proportional (median) | — | ${pct(r4(quantile(ratio(24, 20).map((x) => x / (20 / 24)), 0.5)) - 1)}% | ${pct(r4(quantile(ratio(24, 16).map((x) => x / (16 / 24)), 0.5)) - 1)}% |`);
  line(`at 16, mean vs proportional ${pct(r4(mean(ratio(24, 16).map((x) => x / (16 / 24)))) - 1)}%`);
  const pc = C.T.get('plus-circle');
  if (pc) line(`plus-circle: container ${pc.map((x) => r2(x.cw)).join(' / ')}, inset ${pc.map((x) => f(x.clear, 2)).join(' / ')} where proportion asks ${[20, 16].map((m) => f(pc[0].clear * m / 24, 2)).join(' / ')}, mark ${pc.map((x) => f(x.mw, 1)).join(' / ')} where proportion asks ${[20, 16].map((m) => f(pc[0].mw * m / 24, 2)).join(' / ')}`);
  const pol = { absolute: [], proportional: [], between: [], other: [] };
  for (const c of cs) pol[insetPolicy(C.T66.get(c)[2].clear / C.T66.get(c)[0].clear)].push(c);
  line(`policy 24→16 (of ${cs.length}): ${pol.absolute.length} hold the inset absolutely (ratio 1 ±${INSET_ABSOLUTE * 100}% — ${pol.absolute.join(', ')}), ${pol.proportional.length} hold it proportionally (${pol.proportional.join(', ')}), ${pol.between.length} sit between, ${pol.other.length} outside both`);
  const med16 = quantile(clear(16), 0.5);
  line(`median inset at 16 = ${f(med16, 1)} units = ${f(med16 / MIN_GAP, 1)} × MIN_GAP (${MIN_GAP})`);
}

// s5 — the marks ---------------------------------------------------------------------------------------------
export function sizeSteps(C) {
  let checked = 0, ok = 0; const off = [];
  for (const base of C.concepts) {
    if (!C.concepts.includes(`${base}-large`) && !C.concepts.includes(`${base}-small`)) continue;
    for (const m of MASTER_LIST) {
      const d = C.byConcept.get(base)?.outline[m];
      for (const [lab, sign] of [['large', 1], ['small', -1]]) {
        const o = C.byConcept.get(`${base}-${lab}`)?.outline[m];
        if (!d || !o) continue;
        checked++;
        const got = Math.max(o.w, o.h) - Math.max(d.w, d.h);
        if (Math.abs(got - sign * SIZE_STEP[m]) < EXACT) ok++; else off.push({ name: `${base}-${lab}`, m, got: r4(got) });
      }
    }
  }
  return { checked, ok, off };
}
function s5(C) {
  head('§5 The marks are a separate system, pointing the other way');
  const marks = C.traj.filter((x) => x.regime === 'mark');
  line(`concepts declaring keyline: mark (at 24): ${C.rows.filter((r) => r.master === 24 && !r.filled && r.regime === 'mark').length}; outline mark-régime concepts at all three: ${marks.length}`);
  line(`C8 step (tools/masters.mjs SIZE_STEP): ${MASTER_LIST.map((m) => SIZE_STEP[m]).join(' · ')}`);
  line(`median share change: ${sgn(r4(medianUpper(marks.map((x) => x.ar)) * 100), 2)}% at 20, ${sgn(r4(medianUpper(marks.map((x) => x.br)) * 100), 2)}% at 16; keyline population ${sgn(r4(medianUpper(C.traj.filter((x) => x.regime === 'keyline').map((x) => x.ar)) * 100), 2)}% then ${sgn(r4(medianUpper(C.traj.filter((x) => x.regime === 'keyline').map((x) => x.br)) * 100), 2)}%`);
  const t = (c) => C.trajOf.get(c);
  const plus = t('plus'), pl = t('plus-large'), ps = t('plus-small');
  if (plus) line(`plus ships at ${plus.o.map((r) => r.size).join(' / ')} units of ink — shares ${plus.s.map((x) => f(x, 3)).join(' / ')}`);
  if (plus && pl) line(`at 16: plus ${plus.o[2].size} against the mark ceiling ${MASTERS[16].mark}; plus-large ${pl.o[2].size} against the drawing bound ${MASTERS[16].bound[1] - MASTERS[16].bound[0]}; at 24 plus-small / plus / plus-large are ${[ps, plus, pl].map((x) => x?.o[0].size).join(' / ')} inside a ${MASTERS[24].bound[1] - MASTERS[24].bound[0]}-unit bound`);
  line('| name | 24 | 20 | 16 | share 24→16 |');
  for (const c of MARK_TABLE) { const x = t(c); if (x) line(`| \`${c}\` | ${x.o.map((r) => r.size).join(' | ')} | ${pct(x.b)}% |`); }
  if (ps && pl) line(`plus-small is ${f(100 * ps.o[0].size / pl.o[0].size, 0)}% of plus-large at 24 and ${f(100 * ps.o[2].size / pl.o[2].size, 0)}% at 16`);
  const st = sizeSteps(C);
  const offFam = [...new Set(st.off.map((o) => o.name))];
  line(`size steps: ${st.ok} of ${st.checked} exact to ${EXACT}; the ${st.off.length} that are not: ${offFam.join(', ')} (at ${[...new Set(st.off.map((o) => o.m))].join(', ')}; step ${[...new Set(st.off.map((o) => o.got))].join(', ')})`);
  line('(the C8 step and C18 containers are also printed, on the solved box, by `node tools/audit/families.mjs $P sizes containers`)');
  const fall = marks.filter((x) => x.b < 0).sort((p, q) => p.b - q.b), rise = marks.filter((x) => x.b >= 0);
  line(`marks whose share falls 24→16: ${fall.length}, against ${rise.length} that rise — ${fall.map((x) => `${x.c} ${pct(x.b)}%`).join(' · ')}`);
  const play = t('play');
  if (play) line(`play at 20 is ${f(100 * play.o[1].w / play.o[0].w, 0)}% × ${f(100 * play.o[1].h / play.o[0].h, 0)}% of its 24 drawing (nominal ${f(100 * 20 / 24, 0)}%); ink ${play.o.map((r) => `${r.w}×${r.h}`).join(' / ')}`);
  const note = C.byConcept.get('play')?.outline[24]?.src.match(/Ink [\dx ·]+; point angle [\d.° ·]+/)?.[0];
  if (note) line(`play's own file comment (cited, not measured): "${note}"`);
}

// s6 — detail and darkness --------------------------------------------------------------------------------------
export function detailCensus(C, style) {
  const same = [], lose = [], gain = [], mixed = [];
  for (const c of C.concepts) {
    const o = C.tri(c, style); if (!o.every(Boolean)) continue;
    const [a, b, d] = o.map((r) => r.subpaths);
    if (a === b && b === d) same.push(c);
    else if (a >= b && b >= d && a > d) lose.push({ c, v: [a, b, d] });
    else if (a <= b && b <= d && a < d) gain.push({ c, v: [a, b, d], paths: o.map((r) => r.paths + r.areaPaths) });
    else mixed.push(c);
  }
  return { same: same.length, lose, gain, mixed };
}
export function densityRatios(C, style, key = 'mass') {
  const out = {};
  for (const [a, b] of PAIRS) out[`${a}-${b}`] = quantile(C.concepts.map((c) => { const A = C.byConcept.get(c)[style][a], B = C.byConcept.get(c)[style][b]; return A?.[key] && B?.[key] && A[key].ofCanvas ? B[key].ofCanvas / A[key].ofCanvas : null; }), 0.5);
  return out;
}
function s6(C) {
  head('§6 Detail budget, and apparent darkness');
  const d = detailCensus(C, 'outline');
  line(`outline: ${d.same} of ${C.full.length} keep their subpath count; ${d.lose.length} shed (non-monotonic ${d.mixed.length}), ${d.gain.length} gain`);
  line(d.lose.map((x) => `\`${x.c}\` ${x.v.join('/')}`).join(' · '));
  line(`gain: ${d.gain.map((x) => `\`${x.c}\` ${x.v.join('/')} (${[...new Set(x.paths)].join('/')} paths throughout)`).join(' · ')}`);
  const tot = (style, m, k) => C.concepts.reduce((s, c) => s + (C.byConcept.get(c)[style][m]?.[k] ?? 0), 0);
  line(`set totals, outline: ${MASTER_LIST.map((m) => comma(tot('outline', m, 'subpaths'))).join(' → ')} subpaths; ${MASTER_LIST.map((m) => comma(tot('outline', m, 'cmds'))).join(' → ')} path commands`);
  line(`detail budget 24→16: ${pct(tot('outline', 16, 'subpaths') / tot('outline', 24, 'subpaths') - 1)}%`);
  const sub = (m) => C.full.map((c) => C.byConcept.get(c).outline[m].subpaths);
  const mx = (m) => { const v = Math.max(...sub(m)); return `${v} (${C.full.filter((c) => C.byConcept.get(c).outline[m].subpaths === v).join(', ')})`; };
  line(`median subpaths ${MASTER_LIST.map((m) => quantile(sub(m), 0.5)).join(' / ')}; maximum ${MASTER_LIST.map(mx).join(' → ')}`);
  const fd = detailCensus(C, 'filled');
  line(`filled: ${MASTER_LIST.map((m) => comma(tot('filled', m, 'subpaths'))).join(' → ')} subpaths, ${fd.lose.length} shedders`);
  attachMass(C, { filled: false });
  attachMass(C, { filled: true });
  attachMass(C, { filled: true, bypass: true });
  const col = (style, m, key = 'mass') => C.concepts.map((c) => C.byConcept.get(c)[style][m]?.[key]?.ofCanvas);
  line('darkness — true ink area over canvas² (mass.density, rate 32):');
  line('| | 24 | 20 | 16 |');
  line(`| outline, median | ${MASTER_LIST.map((m) => f(r4(quantile(col('outline', m), 0.5)), 4)).join(' | ')} |`);
  line(`| outline, mean | ${MASTER_LIST.map((m) => f(r4(mean(col('outline', m))), 4)).join(' | ')} |`);
  line(`| filled, median (raster.mjs as committed — EXPOSED to the classify defect) | ${MASTER_LIST.map((m) => f(r4(quantile(col('filled', m), 0.5)), 4)).join(' | ')} |`);
  line(`| filled, median (horizontal-edge bypass) | ${MASTER_LIST.map((m) => f(r4(quantile(col('filled', m, 'massFixed'), 0.5)), 4)).join(' | ')} |`);
  const moved = C.rows.filter((r) => r.filled && r.areaPaths && r.mass.ofCanvas !== r.massFixed.ofCanvas);
  line(`  filled drawings whose ink ÷ canvas² the bypass changes: ${moved.length} of ${C.rows.filter((r) => r.filled && r.areaPaths).length} with an area path; largest change ${moved.length ? f(Math.max(...moved.map((r) => Math.abs(r.mass.ofCanvas - r.massFixed.ofCanvas))), 5) : 0}`);
  const dr = densityRatios(C, 'outline');
  line(`median ratio, outline: ${PAIRS.map(([a, b]) => `${a}→${b} ${f(r4(dr[`${a}-${b}`]), 3)}`).join(', ')}`);
  const sc = MASTER_LIST.map((m) => STROKES[m] / m);
  const sr = PAIRS.map(([a, b]) => STROKES[b] / b / (STROKES[a] / a));
  line(`stroke ÷ canvas ${sc.map((x) => f(x, 4)).join(' / ')}, ratios ${sr.map((x) => f(x, 3)).join(' / ')}`);
  const geo = PAIRS.map(([a, b], i) => dr[`${a}-${b}`] / sr[i]);
  line(`geometric contribution (density ratio ÷ stroke ratio): ${geo.map((x) => f(x, 3)).join(' / ')} — path length per unit of canvas ${pct(geo[0] - 1)}% at 20`);
}

// s7 — radii ---------------------------------------------------------------------------------------------------
export function radiusTriples(C) {
  const rows = [];
  for (const c of C.concepts) {
    const v = MASTER_LIST.map((m) => { const vals = C.byConcept.get(c).outline[m]?.radii.container ?? []; return vals.length ? Math.max(...vals) : null; });
    if (v.every((x) => x != null)) rows.push({ c, v });
  }
  const tiers = {};
  for (const r of rows) { const k = r.v.join('/'); tiers[k] = (tiers[k] ?? 0) + 1; }
  return { rows, triples: Object.entries(tiers).sort((x, y) => y[1] - x[1]) };
}
function s7(C) {
  head('§7 Radii — the one tier table that is obeyed, and the three laws inside it');
  const allRad = { 24: {}, 20: {}, 16: {} }, fromFilled = { 24: {}, 20: {}, 16: {} };
  for (const r of C.rows) for (const [role, vals] of Object.entries(r.radii)) for (const v of vals) {
    const k = `${role}|${v}`; allRad[r.master][k] = (allRad[r.master][k] ?? 0) + 1;
    if (r.filled) fromFilled[r.master][k] = (fromFilled[r.master][k] ?? 0) + 1;
  }
  line('| role | 24 | 20 | 16 |');
  const second = {};
  for (const role of ['container', 'bend', 'detail']) {
    const cells = MASTER_LIST.map((m) => {
      const e = Object.entries(allRad[m]).filter(([k]) => k.startsWith(`${role}|`)).map(([k, v]) => [Number(k.split('|')[1]), v]).sort((a, b) => b[1] - a[1]);
      if (role === 'container') second[m] = e[1];
      return e.slice(0, RADIUS_TOP[role]).map(([v, n]) => `${v} ×${n}`).join(' · ');
    });
    line(`| ${role} | ${cells.join(' | ')} |`);
  }
  line(`the second container value at each master, and how many of its corners are in filled files: ${MASTER_LIST.map((m) => `${second[m][0]} — ${fromFilled[m][`container|${second[m][0]}`] ?? 0} of ${second[m][1]} (= ${r3(second[m][0] - STROKES[m] / 2)} + ${STROKES[m] / 2})`).join(' · ')}`);
  const rt = radiusTriples(C);
  const canon = rt.rows.filter((r) => r.v[0] === 2.5);
  line(`${rt.rows.length} concepts have a container-role radius at all three masters; commonest triples ${rt.triples.slice(0, 3).map(([k, v]) => `${k} ×${v}`).join(' · ')}`);
  line(`concepts whose 24 container radius is 2.5: ${canon.length}; their 20/16: ${Object.entries(tally(canon.map((r) => `${r.v[1]}/${r.v[2]}`))).map(([k, v]) => `${k} ×${v}`).join(' · ')}`);
  line(`median ratios ${PAIRS.map(([a, b]) => f(r4(quantile(rt.rows.map((r) => r.v[MASTER_LIST.indexOf(b)] / r.v[MASTER_LIST.indexOf(a)]), 0.5)), 3)).join(' / ')}`);
  line(`against it, the ink box at 16 (the circle keyline's curve): ${pct(keylineCurve('circle').b)}% of its 24 share`);
  line('the three commonest triples, as tiers (the document names them container · detail · bend):');
  line('| triple | n | 24 | 20 | 16 | 24→20 | 24→16 | vs proportional |');
  for (const [k, n] of rt.triples.slice(0, 3)) {
    const v = k.split('/').map(Number);
    line(`| ${k} | ${n} | ${v.join(' | ')} | ${f(v[1] / v[0], 3)} | ${f(v[2] / v[0], 3)} | ${pct(v[1] / v[0] / (20 / 24) - 1)}%, ${pct(v[2] / v[0] / (16 / 24) - 1)}% |`);
  }
}

// s8 — angles ---------------------------------------------------------------------------------------------------
function onGridAngles(C, style) {
  const out = {};
  for (const m of MASTER_LIST) {
    let n = 0, s = 0, n45 = 0, s45 = 0;
    for (const c of C.concepts) {
      const r = C.byConcept.get(c)[style][m]; if (!r) continue;
      for (const seg of r.angle.segs) {
        if (seg.dev > ANGLE_TOL) continue;
        n++; s += seg.dev;
        if (seg.nearest === 45 || seg.nearest === 135 || seg.nearest === -45) { n45++; s45 += seg.dev; }
      }
    }
    out[m] = { n, mean: r4(s / n), n45, mean45: n45 ? r4(s45 / n45) : null };
  }
  return out;
}
function s8(C) {
  head('§8 Angles — what the eighth grid costs, and where');
  line('| | on-grid segments | mean deviation | of which 45°: n | 45° mean deviation |');
  const L = { outline: onGridAngles(C, 'outline'), filled: onGridAngles(C, 'filled') };
  for (const style of ['outline', 'filled']) for (const m of MASTER_LIST) { const x = L[style][m]; line(`| ${style} ${m} | ${comma(x.n)} | ${f(x.mean, 4)}° | ${x.n45} | ${f(x.mean45, 3)}° |`); }
  const o = L.outline;
  line(`the tax: ${f(o[16].mean / o[24].mean, 1)}× on the mean, ${f(o[16].mean45 / o[24].mean45, 1)}× on the 45s; intended-45° legs ${o[24].n45} at 24 against ${o[16].n45} at 16 — ${o[24].n45 - o[16].n45} fewer`);
  const off = MASTER_LIST.map((m) => { const rows = C.concepts.map((c) => C.byConcept.get(c).outline[m]).filter(Boolean); const segs = rows.reduce((a, r) => a + r.angle.segments, 0), offs = rows.reduce((a, r) => a + r.angle.off, 0); return `${offs} at ${m} (${f(100 * offs / segs, 1)}%)`; });
  line(`outline segments beyond ${ANGLE_TOL}°: ${off.join(', ')}`);
  const cells = MASTER_LIST.flatMap((m) => ['outline', 'filled'].map((s) => ({ s, m, v: L[s][m].mean })));
  const low = cells.sort((a, b) => a.v - b.v)[0];
  line(`lowest on-grid mean of the six cells: ${low.s} ${low.m} (${f(low.v, 4)}°); weights at 16: outline ${STROKES[16]}, line-heavy filled ${FILLED_WEIGHT[16]} (half-stroke ${FILLED_WEIGHT[16] / 2})`);
  const ad = C.full.map((c) => { const A = C.byConcept.get(c).outline[24], Z = C.byConcept.get(c).outline[16]; return A.angle.maxDev == null || Z.angle.maxDev == null ? null : { c, a: A.angle.maxDev, z: Z.angle.maxDev, d: Z.angle.maxDev - A.angle.maxDev }; }).filter(Boolean).sort((x, y) => y.d - x.d);
  line(`biggest growths of the worst angle 24→16: ${ad.slice(0, 5).map((x) => `\`${x.c}\` ${f(half2(x.a), 2)}° → ${f(half2(x.z), 2)}°`).join(' · ')}`);
}

// s9 — outline against filled -------------------------------------------------------------------------------------
export function filledDivergence(C) {
  const rows = []; let both = 0;
  for (const c of C.full) {
    const o = C.tri(c), fl = C.tri(c, 'filled');
    if (!fl.every(Boolean)) continue;
    both++;
    const dOut = shareChange(o)[1], dFil = shareChange(fl)[1];
    if (Math.abs(dFil - dOut) > FILLED_DIVERGES) rows.push({ c, o, fl, dOut, dFil, grows: fl.map((r) => r.growsNote) });
  }
  return { both, rows: rows.sort((a, b) => Math.abs(b.dFil - b.dOut) - Math.abs(a.dFil - a.dOut) || (a.c < b.c ? -1 : 1)) };
}
function s9(C) {
  head('§9 The filled style inherits the policy and decides nothing');
  const d = filledDivergence(C);
  line(`${d.both - d.rows.length} of ${d.both} concepts have an identical 24→16 share progression in both styles (within ${FILLED_DIVERGES * 100}pp); ${d.rows.length} differ — every one with a grows: note: ${d.rows.every((x) => x.grows.every(Boolean))}`);
  line('| concept | outline | filled | outline Δ24→16 | filled Δ24→16 |');
  for (const x of d.rows) line(`| \`${x.c}\` | ${x.o.map((r) => `${r.w}×${r.h}`).join(' / ')} | ${x.fl.map((r) => `${r.w}×${r.h}`).join(' / ')} | ${pct(x.dOut)}% | ${pct(x.dFil)}% |`);
}

// s10 — classes, families, box: ---------------------------------------------------------------------------------
export function familySpreads(C) {
  const fams = new Map();
  for (const x of C.traj) { const k = familyOf(x.c); if (!fams.has(k)) fams.set(k, []); fams.get(k).push(x); }
  const rows = [];
  for (const [fam, members] of fams) {
    if (members.length < 2) continue;
    const bs = members.map((m) => m.b);
    rows.push({ fam, members, spread: Math.max(...bs) - Math.min(...bs), regimes: [...new Set(members.map((m) => m.regime))] });
  }
  return rows.sort((a, b) => b.spread - a.spread);
}
export function boxDrift(C) {
  const out = [];
  for (const c of C.full) {
    const o = C.tri(c); if (!o.every((r) => r.boxNote)) continue;
    const asp = o.map((r) => r.w / r.h);
    out.push({ c, o, asp, d: Math.max(...asp) / Math.min(...asp) - 1 });
  }
  return out.sort((a, b) => b.d - a.d);
}
function s10(C) {
  head('§10 The classes, with populations');
  const holds = C.traj.map((x) => ({ c: x.c, h: holdsOf(x.o) }));
  line(`outline concepts classified: ${holds.length}`);
  const cls = tally(holds.map((x) => classOf(x.h)));
  const names = { 1: 'Keyline-locked, whole (K A D)', 2: 'Keyline-locked, mark held too (K A D M)', 3: 'Keyline-locked, mark drifts (K D)', 4: 'Free mark (D)', 5: 'Proportion-first (A D)', 6: 'Keyline-locked, detail sheds (K A / K)', 7: 'Aspect only (A)', 8: 'Nothing measurable (—)' };
  line('| Class | n | members (classes 6–8) |');
  for (let k = 1; k <= 8; k++) line(`| ${k}. ${names[k]} | ${cls[k] ?? 0} |${k >= 6 ? ` ${holds.filter((x) => classOf(x.h) === k).map((x) => x.c).join(', ')}` : ''}`);
  const raw = C.traj.map((x) => { const h = []; if (keyHeld(x.o)) h.push('K'); const sp = aspectSpread(x.o); if (sp != null && sp <= HELD_SHARE) h.push('A'); if (new Set(x.o.map((r) => r.subpaths)).size === 1) h.push('D'); return h.join('') || 'nothing'; });
  line(`raw holds tally (no M): ${Object.entries(tally(raw)).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  line(`appendix holds (with M): ${Object.entries(tally(holds.map((x) => x.h || '—'))).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  const rc = C.traj.filter((x) => new Set(x.o.map((r) => r.regime)).size > 1);
  line(`régime changes between masters: ${rc.length} — ${rc.map((x) => `${x.c} ${x.o.map((r) => r.regime).join('/')} (box note at 24: ${x.o[0].boxNote ?? '—'})`).join(' · ')}`);
  const kc = C.traj.filter((x) => new Set(x.o.map((r) => r.keyline)).size > 1);
  line(`concepts whose matched keyline changes between masters: ${kc.length}; of them mark or box at 24: ${kc.filter((x) => x.regime === 'mark' || x.regime === 'box').length}`);
  const fs = familySpreads(C);
  line(`families with two or more members: ${fs.length}; 24→16 share change agrees within 1pp in ${fs.filter((r) => r.spread <= 0.01).length}, within 3pp in ${fs.filter((r) => r.spread <= 0.03).length}, differs by more than 5pp in ${fs.filter((r) => r.spread > 0.05).length} and by more than 10pp in ${fs.filter((r) => r.spread > 0.10).length}; more than one régime: ${fs.filter((r) => r.regimes.length > 1).length}`);
  const mk = C.traj.filter((x) => x.regime === 'mark');
  line(`(marks whose share rises 24→16: ${mk.filter((x) => x.b >= 0).length} of ${mk.length}, median ${sgn(r4(medianUpper(mk.map((x) => x.br)) * 100), 1)}%)`);
  line('the widest spreads (top 16):');
  line('| family | spread | the split |');
  for (const r of fs.slice(0, 16)) line(`| \`${r.fam}\` | ${f(r.spread * 100, 1)}pp | ${r.members.slice().sort((x, y) => x.b - y.b).map((m) => `${m.c} ${m.regime} ${m.o.map((q) => `${q.w}×${q.h}`).join(' / ')} (${pct(m.b)}%)`).join('; ')} |`);
  const bd = boxDrift(C);
  line(`box: at all three masters: ${bd.length}; aspect held within 2%: ${bd.filter((x) => x.d <= HELD_SHARE).length}; median spread ${f(r4(bd[Math.floor(bd.length / 2)].d * 100), 1)}%; drifting more than ${BOX_ESCAPE * 100}%: ${bd.filter((x) => x.d > BOX_ESCAPE).length}`);
  line('| concept | boxes | aspect | spread |');
  for (const x of bd.filter((y) => y.d > BOX_ESCAPE)) line(`| \`${x.c}\` | ${x.o.map((r) => r.boxNote.replace('x', '×')).join(' / ')} | ${x.asp.map((a) => f(a, 3)).join(' / ')} | ${f(x.d * 100, 1)}% |`);
  for (const k of ['portrait', 'landscape']) { const a = MASTER_LIST.map((m) => MASTERS[m].keylines[k][0] / MASTERS[m].keylines[k][1]); line(`keyline ${k}: aspect ${a.map((x) => f(x, 3)).join(' / ')}, spread ${f((Math.max(...a) / Math.min(...a) - 1) * 100, 1)}%`); }
}

// s11 — the judged list ------------------------------------------------------------------------------------------
function s11(C) {
  head('§11 The judged list — its figures, recomputed');
  const kh = C.traj.filter((x) => x.regime === 'keyline');
  const sc = squareCircle();
  const byK = tally(kh.map((x) => x.keyline));
  const spread = C.traj.map((x) => r4(Math.max(...x.s) / Math.min(...x.s) - 1));
  line(`S1: bound ÷ canvas ${MASTER_LIST.map((m) => `${f((MASTERS[m].bound[1] - MASTERS[m].bound[0]) / m * 100, 1)}%`).join(' / ')}; circle curve ${pct(keylineCurve('circle').a)}%/${pct(keylineCurve('circle').b)}%, square ${pct(keylineCurve('square').a)}%/${pct(keylineCurve('square').b)}%; ${spread.filter((s) => s <= HELD_SHARE).length} of ${C.full.length} hold their share within 2%; ${kh.filter((x) => onOwnCurve(x.o)).length} of ${kh.length} on their keyline's curve; square : circle ${sc.map((x) => f(x, 3)).join(' / ')}, swing ${f((sc[0] / sc[2] - 1) * 100, 1)}%, across ${byK.square} and ${byK.circle} concepts`);
  line(`S1: against proportion — square ${MASTER_LIST.slice(1).map((m) => `${sgn(MASTERS[m].keylines.square[0] - MASTERS[24].keylines.square[0] * m / 24, 2)} px at ${m}`).join(', ')}; circle ${MASTER_LIST.slice(1).map((m) => `${sgn(MASTERS[m].keylines.circle[0] - MASTERS[24].keylines.circle[0] * m / 24, 2)} px at ${m}`).join(', ')}`);
  const rt = radiusTriples(C); const canon = rt.rows.filter((r) => r.v[0] === 2.5);
  line(`S3: container 2.5/2/1.5 against proportion at 16 ${pct(1.5 / 2.5 / (16 / 24) - 1)}%; obeyed ${canon.filter((r) => r.v[1] === 2 && r.v[2] === 1.5).length} of ${canon.length}`);
  const marks = C.traj.filter((x) => x.regime === 'mark');
  const st = sizeSteps(C);
  const pl = C.trajOf.get('plus-large'), ps = C.trajOf.get('plus-small');
  line(`S4: ${marks.length} mark concepts, median ${sgn(r4(medianUpper(marks.map((x) => x.br)) * 100), 1)}%, worst ${pct(Math.max(...marks.map((x) => x.b)))}%; keyline population ${sgn(r4(medianUpper(kh.map((x) => x.br)) * 100), 1)}%; steps ${st.ok} of ${st.checked}; sizes converge ${f(100 * ps.o[0].size / pl.o[0].size, 0)}% → ${f(100 * ps.o[2].size / pl.o[2].size, 0)}%`);
  const bd = boxDrift(C);
  line(`S5: ${bd.filter((x) => x.d > BOX_ESCAPE).length} of ${bd.length} box: concepts drift more than ${BOX_ESCAPE * 100}%, worst ${f(bd[0].d * 100, 1)}% (\`${bd[0].c}\`); ${bd.filter((x) => x.d <= HELD_SHARE).length} hold within 2%`);
  const mic = C.trajOf.get('microphone-5');
  if (mic) line(`D1: microphone-5 régime ${mic.o.map((r) => r.regime).join('/')}; box note at 24 "${mic.o[0].boxNote}"; ink ${mic.o.map((r) => `${r.w}×${r.h}`).join(' / ')}`);
  const mp = C.trajOf.get('map-pin'), drift = markDrift(C);
  for (const [label, dims] of [['lint\'s box', lintDims], ['the solved box', solvedDims]]) {
    const ex = MASTER_LIST.map((m) => exactShare(C, m, dims));
    line(`D2 (${label}): keyline-held drawings exact within ${EXACT}: ${ex.map((e, i) => `${e.exact} of ${e.n} (${f(e.share * 100, 1)}%) at ${MASTER_LIST[i]}`).join(', ')}; pooled ${f(100 * ex.reduce((a, e) => a + e.exact, 0) / ex.reduce((a, e) => a + e.n, 0), 1)}%; keyline-held concepts that use any of the slack at some master: ${keylineExactness(C, dims).slack}`);
  }
  if (mp) line(`D2: map-pin ink ${mp.o.map((r) => `${r.w}×${r.h}`).join(' / ')} against portrait ${MASTER_LIST.map((m) => MASTERS[m].keylines.portrait.join('×')).join(' / ')}; mark/container ${pct(drift.find((x) => x.c === 'map-pin').d)}%; off their own curve ${kh.filter((x) => !onOwnCurve(x.o)).length} of ${kh.length}; exact at 24 ${f(exactShare(C, 24).share * 100, 1)}%`);
  const t = (c) => C.trajOf.get(c);
  const others = marks.filter((x) => !x.c.startsWith('play')).filter((x) => x.b >= 0);
  line(`E1: play-3 ${pct(t('play-3').b)}%, play ${pct(t('play').b)}%, play-2 ${pct(t('play-2').b)}%; the ${others.length} rising marks' median ${sgn(r4(medianUpper(others.map((x) => x.br)) * 100), 1)}% (all ${marks.length} marks: ${sgn(r4(medianUpper(marks.map((x) => x.br)) * 100), 1)}%); play ink ${t('play').o.map((r) => `${r.w}×${r.h}`).join(' / ')}; chevron-right ${pct(t('chevron-right').b)}%, arrow-right ${pct(t('arrow-right').b)}%`);
  attachMass(C, { filled: false });
  const col = (m) => C.concepts.map((c) => C.byConcept.get(c).outline[m]?.mass?.ofCanvas);
  const dr = densityRatios(C, 'outline');
  line(`E2: outline ink ÷ canvas² median ${MASTER_LIST.map((m) => f(quantile(col(m), 0.5), 3)).join(' / ')}; 24→16 ${f(r4(dr['24-16']), 3)}; stroke ${f(STROKES[16] / 16 / (STROKES[24] / 24), 2)}, geometry ${f(dr['24-16'] / (STROKES[16] / 16 / (STROKES[24] / 24)), 3)}`);
  const fsp = familySpreads(C).filter((r) => ['filter', 'text', 'grid'].includes(r.fam));
  line(`E3: ${fsp.map((r) => `${r.fam} ${f(r.spread * 100, 1)}pp`).join(' · ')}`);
  line(`E4: ${['keyboard', 'keyboard-2', 'watch'].map((c) => { const x = t(c); return `${c} ${x.regime} aspect spread ${f(aspectSpread(x.o) * 100, 1)}% subpaths ${x.o.map((r) => r.subpaths).join('/')}`; }).join(' · ')}`);
}
/** w and h on lint's box (the document's definition) … */
export const lintDims = (r) => [r.w, r.h];
/** … and on metrics-check.mjs's solved box (arc extremes solved, not sampled at 64 points), to 2 dp. Cached on the row. */
export function solvedDims(r) {
  if (!r.solved) { const b = solvedInkBox(readSvg(r.src, r.file)); r.solved = [r2(b.x1 - b.x0), r2(b.y1 - b.y0)]; }
  return r.solved;
}
/** A keyline-held drawing sits exactly on its keyline: both sides within EXACT (s14_an5 Q). */
export function onKeylineExactly(r, dims = lintDims) {
  const [kw, kh] = MASTERS[r.master].keylines[r.keyline];
  const [w, h] = dims(r);
  return Math.abs(w - kw) < EXACT && Math.abs(h - kh) < EXACT;
}
export function exactShare(C, m, dims = lintDims) {
  const rows = C.concepts.map((c) => C.byConcept.get(c).outline[m]).filter((r) => r && r.regime === 'keyline');
  const exact = rows.filter((r) => onKeylineExactly(r, dims)).length;
  return { n: rows.length, exact, share: exact / rows.length };
}
/** Concepts keyline-held at 24: how many sit exactly on their keyline at all three masters, how many spend slack somewhere. */
export function keylineExactness(C, dims = lintDims) {
  const kh = C.full.map((c) => C.tri(c)).filter((o) => o[0].regime === 'keyline');
  const all3 = kh.filter((o) => o.every((r) => onKeylineExactly(r, dims))).length;
  return { n: kh.length, all3, slack: kh.length - all3 };
}

// s12 — the eye questions' figures ---------------------------------------------------------------------------------
function s12(C) {
  head('§12 What only Maruti\'s eye can settle — the figures it restates');
  const pol = { absolute: 0, proportional: 0, between: 0, other: 0 };
  for (const [, o] of C.T66) pol[insetPolicy(o[2].clear / o[0].clear)]++;
  line(`inset: ${pol.absolute} absolute, ${pol.proportional} proportional, ${pol.between} between; true containers ${C.T.size}`);
  const rt = radiusTriples(C);
  line(`radius-2.5 concepts: ${rt.rows.filter((r) => r.v[0] === 2.5).length}; container tier at 16 against proportion ${pct(1.5 / 2.5 / (16 / 24) - 1)}%`);
  const marks = C.traj.filter((x) => x.regime === 'mark');
  line(`marks grow ${sgn(r4(medianUpper(marks.map((x) => x.br)) * 100), 0)}% into the 16 master; keyline curve ${pct(keylineCurve('circle').b, 0)}% at 16 and ${pct(keylineCurve('circle').a, 0)}% at 20`);
}

// appendix — the full table ----------------------------------------------------------------------------------------
const n2 = (x) => (x == null ? '' : Number(x).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1'));
const n3 = (x) => (x == null ? '' : Number(x).toFixed(3));
const pp = (x) => (x == null ? '' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}`);
/** One appendix row, in s14_table.mjs's exact format. */
export function appendixRow(c, o) {
  const s = o.map((r) => r.sizeOfCanvas);
  const t = o.map(containerOf);
  return `| \`${c}\` | ${o[0].regime} | ${o[0].keyline ?? '—'} | ${o[0].w}×${o[0].h} | ${o[1].w}×${o[1].h} | ${o[2].w}×${o[2].h} | ${s.map(n3).join(' / ')} | ${pp(s[1] / s[0] - 1)} | ${pp(s[2] / s[0] - 1)} | ${o.map((r) => r.subpaths).join('/')} | ${o.map((r) => n2(r.mass?.area)).join(' / ')} | ${o.map((r) => n3(r.mass?.ofCanvas)).join(' / ')} | ${t.every(Boolean) ? t.map((x) => n3(x.ratio)).join(' / ') : '—'} | ${t.every(Boolean) ? t.map((x) => n2(x.clear)).join(' / ') : '—'} | ${o.map((r) => n3(r.angle.meanDev)).join(' / ')} | ${holdsOf(o) || '—'} |`;
}
function appendix(C) {
  head('Appendix — the full table, 485 concepts');
  attachMass(C, { filled: false });
  line('| concept | régime | keyline | ink 24 | ink 20 | ink 16 | share 24/20/16 | Δ20 | Δ16 | subpaths | ink area 24/20/16 | density 24/20/16 | mark/cont 24/20/16 | inset 24/20/16 | mean ∠dev 24/20/16 | holds |');
  line('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const c of C.full) line(appendixRow(c, C.tri(c)));
}

export const SECTIONS = { s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, appendix };

export async function main(argv = process.argv.slice(2)) {
  const pinArg = argv.find((a) => !a.startsWith('--'));
  const wanted = argv.filter((a) => !a.startsWith('--') && a !== pinArg);
  const usage = 'usage: node tools/audit/scaling-probe.mjs <pin-dir with src/icons/{24,20,16}> [section …]\n  sections: ' + Object.keys(SECTIONS).join(' ');
  if (!pinArg || !isPin(resolve(pinArg))) { console.error(usage); process.exitCode = 2; return; }
  const bad = wanted.filter((s) => !SECTIONS[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${usage}`); process.exitCode = 2; return; }
  const C = ctx(loadSet(resolve(pinArg)));
  console.log(`# findings-scaling.md reprinted from ${resolve(pinArg)}`);
  for (const s of wanted.length ? wanted : Object.keys(SECTIONS)) SECTIONS[s](C);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
