#!/usr/bin/env node
// Every measured figure in docs/audit/findings-corners.md (card 1.2, axis F2 — corners and
// radii), printed again from the pinned drawings.
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing.
//
// Usage:
//   P=<scratch>/pin; git archive 5933041 | tar -x -C $P
//   node tools/audit/corners-probe.mjs $P [section …]
// No section = all of them. An unknown section, or a pin without src/icons/{24,20,16},
// prints usage and exits 2. This document quotes no reference set, so there is no --refs.
//
// Sections, and the document section each one backs:
//   s0     header block ("What the instrument sees") — corner totals, ambiguous share
//   s1.1   §1.1 tier table (outline files, stroked paths, container role) — also the wave-5
//          reconcile figure "container-radius share 61.8 · 61.4 · 58.6%", with its definition
//   s1.2   §1.2 commonest fourteen radii per master (see the note in that section on its label)
//   s1.3   §1.3 typed `A` literals; Bezier count; elliptical arcs; 8,547 literal corners;
//          117 / 165 arcs too short for their chord (plan Corrections: `moon` is not a one-off);
//          `link` / `attachment-3`; the 31 concepts; 7 zero-length arcs
//   s2     §2 tier arithmetic — canvas share, stroke multiple, the two counterfactuals
//          (plan Corrections: "the tiers scale cleanly" → three different laws)
//   s3     §3 comment census at 24 ("container radius", "detail radius", …)
//   s3.1   §3.1 tier against role and part size
//   s3.2   §3.2 the three jobs and the tier-signature table (167 concepts at 24)
//   s3.3   §3.3 sharp corners
//   s4     §4 off-tier container corners (38 · 36 · 37), §4.1 body curves, §4.2 values
//   s5     §5 behaviour from 24 to 16 (363 · 286 · 74 · 3), the named rows, and every concept
//          that gains radii at 16 (computed population, then the seven the document names)
//   s6     §6 nested radii (12 of 1,107; 146 pairs in 37 concepts; the table)
//   s7     §7 the four pairings, and "what survives as a set-wide figure"
//   s7.1   §7.1 the C7 left-behind corner at 16 (129 · 27 · 12 · 15)
//   s7.2   §7.2 what each pairing statistic flags (and all three together); the typed literals of
//          the document's hand-picked nine, outline against filled
//   s7.3   §7.3 one `d` published as both an area and a stroke (15 files, 5 concepts)
//   s8.1   §8.1 composite corners (649 · 32 under bendMin)
//   s8.2   §8.2 C10's floor (1,094 · 0 · 681)
//   s8.3   §8.3 fillets that are not quite fillets (357 · 158 · 46 · 582)
//   s9.1   §9.1 numbered siblings with different radius values (16 families)
//   s9.2   §9.2 size variants (31 concepts, all r0.75 at 24)
//   s10    §10 the pixel table and what one tier step is worth
//   s10a   §10a the full roll-up, 170 rows, in the document's row format
//   s11    §11 / §11a figures not already printed above (`rotate-ccw-9`'s square at 16;
//          distinct typed rx across all outline files)
// §2's reference calibration (IBM / Salesforce / Material), §6's Fluent 1.5 + 2.5 = 4, §12 and
// §13 are cited or eye questions, not measurements.
//
// Instruments: `tools/audit/radii.mjs` (`radiiOf`, `listIcons`, `iconFromSource`), which takes its
// path pieces from `tools/audit/angles.mjs`; `tools/geometry.mjs` `parsePath` / `bbox`;
// `tools/masters.mjs` (`STROKES`, `MASTERS` keylines). None is edited.
//
// Recovered from: the card-1.2 author transcript (agent a88cac81f3530bb21, 2026-10-04) — its
// `dump-corners.mjs` / `dump2.mjs` dumps of `radiiOf()` over `listIcons()` and the query scripts
// c1–c18, the inline literal checks (`litpair`, the chord check); and its fresh reviewer (agent
// aaeba6425e82dbb49) — the SVG F.6.6 Λ count (117) and the literal-corner match (7.8e-16).
// Parameters are the ones those scripts used, named below. The dumps rounded a radius to 4 dp
// and part sizes / vertices to 3 dp, and a tangent error to 2 dp; this probe rounds the same way
// before counting, because the counts were taken on the rounded values.
//
// Known instrument defects (plans/set-and-rules-audit.md) — none of them touches these figures:
// `raster.mjs` / `pixelgrid.mjs` are not used. `geometry.bbox` samples arcs (up to 0.0056 inside)
// — used here only for the ink box `radiiOf` builds its roles from (as the card did) and for
// `rotate-ccw-9`'s square, whose arcs are quarter turns between grid points. `radii.mjs` reads the
// five `arrow-*-4` filled triangles as 0.75 (its own §7.3 finding): s7.3 prints that, it does not
// correct it, because every other figure was taken on the instrument as it is.
//
// Run time on this machine (node 24, 2026-10-08, other agents running): whole probe 0.9–2.1 s.
// The corner table (`radiiOf` over 2,910 drawings) is built once and shared, ≈ 0.6–1.2 s. Run
// alone, a section that needs it takes 1.4–1.8 s (s1.3 the slowest: it also re-reads every arc);
// s2, s3, s7.1, s7.2, s10 and s11 do not need it and take ≈ 0.2 s.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { radiiOf, iconFromSource } from './radii.mjs';
import { parsePath, bbox } from '../geometry.mjs';
import { STROKES, MASTERS } from '../masters.mjs';

// ── parameters (chosen by the card, not measured) ──────────────────────────
/** The three tiers the card classified against (c2–c18 `TIER`). s1.1 prints the census's own
 *  top three values beside them, so a drift would show. */
export const TIERS = { 24: [2.5, 1.5, 0.75], 20: [2, 1.25, 0.75], 16: [1.5, 1, 0.625] };
/** Snap a measured radius to the nearest sixteenth when within this (composite-fit noise).
 *  c3–c18 used 0.025, the value the document states. */
export const SNAP_TOL = 0.025;
/** …but c2.mjs, which produced §1.1's table and §4's off-tier lists, used 0.02. It matters at
 *  one place: `heart`'s composite 0.7724 at 24 is 0.0224 from 0.75 — off-tier at 0.02 (as §1.1
 *  and §4.2 report it), tier 3 at 0.025 (as §3.2 and §10a report it). s1.1 prints both. */
export const SNAP_TOL_C2 = 0.02;
/** Half the OUTLINE stroke — what a filled outer contour adds to a centreline radius (C23). */
export const HALF = Object.fromEntries(Object.entries(STROKES).map(([m, s]) => [m, s / 2]));
export const MASTER_LIST = [24, 20, 16];
/** §7 c6/c9: a filled radius "equals" outline + half within this. §7 litpair: 0.011. */
export const PAIR_TOL = 0.01;
export const LITPAIR_TOL = 0.011;
/** §7 c7: vertex pairing radius. */
export const VERTEX_TOL = 0.3;
/** §8.1 / §8.2: a fillet is "under its file's bendMin" when below it by more than this
 *  (radii.mjs `census`, which the card's scripts copied). */
export const BEND_MARGIN = 0.005;
/** §6 c10/c11: a subpath is "strictly inside" another by more than this on all four sides. */
export const INSIDE_MARGIN = 0.05;

// ── small helpers, as the card's q.mjs had them ────────────────────────────
export const r = (n, k = 3) => Math.round(n * 10 ** k) / 10 ** k;
export const tally = (xs, f) => { const m = new Map(); for (const x of xs) { const k = f(x); m.set(k, (m.get(k) ?? 0) + 1); } return [...m].sort((a, b) => b[1] - a[1]); };
export const groupBy = (xs, f) => { const m = new Map(); for (const x of xs) { const k = f(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); } return m; };
export const uniq = (xs) => [...new Set(xs)];
const pct = (n, d, k = 1) => (d ? (100 * n / d).toFixed(k) : '—');
const num = (a, b) => a - b;
const head = (t) => console.log(`\n## ${t}`);

/** Snap to the nearest 1/16 when within `tol` (c3: `Math.abs(s-v) <= 0.025`). */
export const snap = (v, tol = SNAP_TOL) => { const s = Math.round(v * 16) / 16; return Math.abs(s - v) <= tol ? s : v; };
/** 1, 2 or 3 when a (snapped) radius is on that master's tier, else 0 (off-tier). */
export const tierOf = (master, radius, tiers = TIERS, tol = SNAP_TOL) => {
  const v = snap(radius, tol); const i = tiers[master].findIndex((t) => Math.abs(v - t) < 1e-9); return i + 1;
};
/** c14 / c18 tier name: t1 / t2 / t3, 'sharp' for 0, else the value. */
export const tierName = (master, v, tiers = TIERS) => {
  if (v === 0) return 'sharp'; const i = tiers[master].indexOf(v); return i >= 0 ? `t${i + 1}` : String(v);
};
/** c13 / c14 / c18: the family a numbered or sized name belongs to. */
export const famOf = (c) => c.replace(/-(small|large)$/, '').replace(/-\d+$/, '');

// ── reading the pin ────────────────────────────────────────────────────────

/** Every drawing in a pin, in `listIcons` order (masters 24, 20, 16; names sorted). */
export function pinFiles(pin) {
  const out = [];
  for (const m of MASTER_LIST) {
    const dir = join(pin, 'src/icons', String(m));
    let names; try { names = readdirSync(dir); } catch { continue; }
    for (const f of names.sort()) if (f.endsWith('.svg')) out.push({ master: m, file: f, path: join(dir, f) });
  }
  return out;
}

/** The icon record `radii.mjs` measures, built from source (no filesystem in tests). */
export const iconOf = (src, file, master) => iconFromSource(src, { file, master });

/**
 * One row per corner — the card's `dump-corners.mjs` + `dump2.mjs` fields, rounded the same way
 * (radius 4 dp, part box and vertex 3 dp, tangent error 2 dp, unevenness 4 dp).
 */
export function cornerRowsOf(icon) {
  const res = radiiOf(icon);
  const rows = [];
  for (const c of res.corners) {
    const b = c.subInfo.bbox;
    rows.push({
      name: c.name, concept: c.name.replace(/-filled$/, ''), master: c.master, style: res.style,
      pstyle: c.style, role: c.role, kind: c.kind,
      radius: r(c.radius, 4), turn: r(c.turn, 2), interior: r(c.interior, 3), convex: c.convex,
      subW: r(b.x1 - b.x0, 3), subH: r(b.y1 - b.y0, 3),
      subX0: r(b.x0, 3), subY0: r(b.y0, 3), subX1: r(b.x1, 3), subY1: r(b.y1, 3),
      closed: c.subInfo.closed, sub: c.sub, path: c.path,
      at: c.at.map((v) => r(v, 3)), tangentError: r(c.tangentError, 2), reflex: c.reflex,
      bendMin: c.bendMin, literal: c.literal ? c.literal.map((v) => r(v, 4)) : null,
      literalMismatch: c.literalMismatch, exact: c.exact, elliptical: c.elliptical,
      tangentUneven: c.tangentUneven === null ? null : r(c.tangentUneven, 4),
    });
  }
  return rows;
}

/** A set of drawings: `{ master, file, src }`, read once and shared by every section. */
export function loadPin(pin) {
  return pinFiles(pin).map((f) => ({ ...f, src: readFileSync(f.path, 'utf8') }));
}

export function buildRows(drawings) {
  const rows = [];
  for (const d of drawings) rows.push(...cornerRowsOf(iconOf(d.src, d.file, d.master)));
  return rows;
}

// ── typed arcs, read off the source ────────────────────────────────────────

/**
 * Every `A` command in one `d`, with the point it starts from — relative commands and implicit
 * repeats handled (parsePath tokenizes; this tracks the pen). Degenerate arcs are KEPT (the
 * instruments drop them), because §1.3 counts them.
 */
export function arcsOf(d) {
  const out = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const { cmd, args } of parsePath(d)) {
    const up = cmd.toUpperCase(), rel = cmd !== up;
    if (up === 'Z') { cx = sx; cy = sy; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }[up];
    if (!step) continue;
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      const pt = (i) => (rel ? [cx + a[i], cy + a[i + 1]] : [a[i], a[i + 1]]);
      if (up === 'H') { cx = rel ? cx + a[0] : a[0]; continue; }
      if (up === 'V') { cy = rel ? cy + a[0] : a[0]; continue; }
      const endAt = { M: 0, L: 0, T: 0, C: 4, S: 2, Q: 2, A: 5 }[up];
      const [x, y] = pt(endAt);
      if (up === 'A') out.push({ rx: Math.abs(a[0]), ry: Math.abs(a[1]), rot: a[2], large: a[3], sweep: a[4], x1: cx, y1: cy, x2: x, y2: y });
      if (up === 'M' && k === 0) { sx = x; sy = y; }
      cx = x; cy = y;
    }
  }
  return out;
}

/** How many Bezier commands (C/S/Q/T, either case) a `d` carries. */
export const bezierCount = (d) => parsePath(d).filter(({ cmd }) => /[CcSsQqTt]/.test(cmd)).length;

/** SVG F.6.6 Λ: above 1, the renderer scales the radii up because they cannot span the ends. */
export function lambdaOf(a) {
  if (!a.rx || !a.ry) return 0;
  const phi = (a.rot * Math.PI) / 180, dx = (a.x1 - a.x2) / 2, dy = (a.y1 - a.y2) / 2;
  const xp = Math.cos(phi) * dx + Math.sin(phi) * dy, yp = -Math.sin(phi) * dx + Math.cos(phi) * dy;
  return (xp * xp) / (a.rx * a.rx) + (yp * yp) / (a.ry * a.ry);
}
/** The author's own check: half the chord, against the typed rx (circular reading). */
export const chordShortfall = (a) => Math.hypot(a.x2 - a.x1, a.y2 - a.y1) / 2 - a.rx;
export const isZeroLength = (a) => Math.hypot(a.x2 - a.x1, a.y2 - a.y1) < 1e-9;

/** Paths of one drawing with style, and their arcs. */
export function pathsOf(d) {
  const icon = iconOf(d.src, d.file, d.master);
  return icon.paths.map((p) => ({ ...p, arcs: arcsOf(p.d) }));
}

// ── computations, one per document section (pure, over rows / drawings) ────

const outlineStrokeContainerFillets = (rows, m) =>
  rows.filter((c) => c.role === 'container' && c.pstyle === 'stroke' && c.style === 'outline' && c.kind !== 'sharp' && (m == null || c.master === m));

/** §1.1 (c2): per master, the snapped histogram of outline stroked container fillets. */
export function tierTable(rows, tiers = TIERS, tol = SNAP_TOL_C2) {
  return MASTER_LIST.map((m) => {
    const s = outlineStrokeContainerFillets(rows, m);
    const t = tally(s, (c) => snap(c.radius, tol));
    const onTier = s.filter((c) => tierOf(m, c.radius, tiers, tol) > 0).length;
    const byTier = tiers[m].map((v) => s.filter((c) => Math.abs(snap(c.radius, tol) - v) < 1e-9).length);
    return { master: m, n: s.length, byTier, onTier, distinct: uniq(s.map((c) => snap(c.radius, tol))).length, top: t };
  });
}

/** §3.2 / c3: tier signature per concept at one master (container, outline, stroke, fillets). */
export function signatures(rows, m = 24) {
  const s = outlineStrokeContainerFillets(rows, m);
  const out = new Map();
  for (const [k, v] of groupBy(s, (c) => c.concept)) out.set(k, uniq(v.map((c) => tierOf(m, c.radius))).sort().join('+'));
  return out;
}

/** §5 / c17: per concept, the sorted distinct snapped radii of every outline stroked fillet. */
export function crossMaster(rows, tiers = TIERS) {
  const per = new Map();
  for (const m of MASTER_LIST) {
    const s = rows.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.kind !== 'sharp');
    for (const [k, v] of groupBy(s, (c) => c.concept)) {
      if (!per.has(k)) per.set(k, {});
      per.get(k)[m] = uniq(v.map((c) => snap(c.radius))).sort(num);
    }
  }
  const tmap = (m, v) => { const i = tiers[m].indexOf(v); return i >= 0 ? `t${i + 1}` : `r${v}`; };
  let clean = 0; const changes = [], missing = [];
  for (const [k, g] of per) {
    if (!g[24] || !g[20] || !g[16]) { missing.push(k); continue; }
    const sig = MASTER_LIST.map((m) => g[m].map((v) => tmap(m, v)).join('+'));
    if (sig[0] === sig[1] && sig[1] === sig[2]) clean++; else changes.push({ concept: k, g, sig });
  }
  return { per, clean, changes, missing: missing.sort() };
}

/** §6 / c11: closed subpaths ("shapes") with their fillet radii. */
function shapesOf(rows) {
  const shapes = new Map();
  for (const c of rows) {
    const k = `${c.name}|${c.master}|${c.path}|${c.sub}`;
    if (!shapes.has(k)) shapes.set(k, { name: c.name, concept: c.concept, master: c.master, style: c.style, pstyle: c.pstyle,
      path: c.path, sub: c.sub, closed: c.closed, x0: c.subX0, y0: c.subY0, x1: c.subX1, y1: c.subY1, radii: [] });
    if (c.kind !== 'sharp') shapes.get(k).radii.push(snap(c.radius));
  }
  return [...shapes.values()];
}
const inside = (a, b, mg = INSIDE_MARGIN) => { const dL = b.x0 - a.x0, dR = a.x1 - b.x1, dT = b.y0 - a.y0, dB = a.y1 - b.y1; return dL > mg && dR > mg && dT > mg && dB > mg; };

export function nesting(rows) {
  const all = shapesOf(rows);
  const outFiles = groupBy(all.filter((s) => s.style === 'outline' && s.pstyle === 'stroke'), (s) => `${s.name}|${s.master}`);
  const multi = []; let nested = 0;
  for (const [k, ss] of outFiles) {
    const rr = ss.filter((s) => s.closed && s.radii.length);
    if (rr.length >= 2) multi.push(k);
    for (const a of rr) for (const b of rr) if (a !== b && inside(a, b)) nested++;
  }
  const filFiles = groupBy(all.filter((s) => s.style === 'filled' && s.pstyle === 'area'), (s) => `${s.name}|${s.master}`);
  const pairs = [];
  for (const [, ss] of filFiles) for (const a of ss) for (const b of ss) {
    if (a === b || !(a.closed && b.closed) || !a.radii.length || !b.radii.length || !inside(a, b)) continue;
    const outer = Math.max(...a.radii), inner = Math.max(...b.radii);
    pairs.push({ concept: a.concept, master: a.master, outer, inner, diff: r(outer - inner, 3) });
  }
  return { outlineDrawings: outFiles.size, multi, nested, pairs };
}

/** §7 (c6): nearest-value pairing, per concept × master with container corners in both styles. */
export function pairNearest(rows) {
  const out = [];
  for (const m of MASTER_LIST) {
    const o = groupBy(rows.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.role === 'container' && c.kind !== 'sharp'), (c) => c.concept);
    const f = groupBy(rows.filter((c) => c.master === m && c.style === 'filled' && c.pstyle === 'area' && c.role === 'container' && c.kind !== 'sharp'), (c) => c.concept);
    for (const [k, v] of o) {
      const fv = f.get(k); if (!fv) continue;
      const oR = uniq(v.map((c) => snap(c.radius))).sort(num), fR = uniq(fv.map((c) => snap(c.radius))).sort(num);
      const diffs = oR.map((x) => { const t = x + HALF[m]; const near = fR.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), fR[0]); return r(near - t, 4); });
      const worst = diffs.reduce((a, b) => (Math.abs(b) > Math.abs(a) ? b : a), 0);
      out.push({ m, concept: k, worst });
    }
  }
  return { pairs: out.length, agree: out.filter((x) => Math.abs(x.worst) <= PAIR_TOL).length, rows: out };
}

/** §7 (c15): modal container radius per style. */
export function pairModal(rows) {
  const mode = (xs) => tally(xs, (x) => x)[0]?.[0];
  const out = [];
  for (const m of MASTER_LIST) {
    const o = groupBy(rows.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.role === 'container' && c.kind !== 'sharp'), (c) => c.concept);
    const f = groupBy(rows.filter((c) => c.master === m && c.style === 'filled' && c.pstyle === 'area' && c.role === 'container' && c.kind !== 'sharp'), (c) => c.concept);
    for (const [k, v] of o) {
      const fv = f.get(k); if (!fv) continue;
      const ov = Number(mode(v.map((c) => snap(c.radius)))), fm = Number(mode(fv.map((c) => snap(c.radius))));
      out.push({ m, concept: k, grow: r(fm - ov, 4) });
    }
  }
  return { pairs: out.length, agree: out.filter((x) => Math.abs(x.grow - HALF[x.m]) <= 1e-9).length, rows: out };
}

/** §7 (c7): pair each outline convex fillet with the filled convex fillet at the same vertex. */
export function pairVertex(rows) {
  const pairs = [];
  for (const m of MASTER_LIST) {
    const o = groupBy(rows.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.kind !== 'sharp' && c.convex), (c) => c.concept);
    const f = groupBy(rows.filter((c) => c.master === m && c.style === 'filled' && c.pstyle === 'area' && c.kind !== 'sharp' && c.convex), (c) => c.concept);
    for (const [k, v] of o) {
      const fv = f.get(k); if (!fv) continue;
      for (const oc of v) {
        let best = null, bd = Infinity;
        for (const x of fv) { const d = Math.hypot(x.at[0] - oc.at[0], x.at[1] - oc.at[1]); if (d < bd) { bd = d; best = x; } }
        if (!best || bd > VERTEX_TOL) continue;
        pairs.push({ m, concept: k, off: r(best.radius - (oc.radius + HALF[m]), 4) });
      }
    }
  }
  return { pairs: pairs.length, agree: pairs.filter((p) => Math.abs(p.off) <= PAIR_TOL).length, rows: pairs };
}

/** §7 (c9): containment of outline convex fillets in the filled twin; the leftovers are easings. */
export function containment(rows) {
  let ok = 0, total = 0; const extras = [];
  for (const m of MASTER_LIST) {
    const o = groupBy(rows.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.kind !== 'sharp' && c.convex), (c) => c.concept);
    const f = groupBy(rows.filter((c) => c.master === m && c.style === 'filled' && c.pstyle === 'area' && c.kind !== 'sharp' && c.convex), (c) => c.concept);
    for (const [k, v] of o) {
      const fv = f.get(k); if (!fv) continue;
      const pool = fv.map((c) => snap(c.radius)), used = pool.map(() => false);
      for (const oc of v) {
        total++;
        const want = snap(oc.radius) + HALF[m];
        const hit = pool.findIndex((p, i) => !used[i] && Math.abs(p - want) <= PAIR_TOL);
        if (hit >= 0) { used[hit] = true; ok++; }
      }
      pool.forEach((p, i) => { if (!used[i]) extras.push({ m, concept: k, r: p }); });
    }
  }
  return { total, ok, extras };
}

/** §7 (litpair) and §7.1 (c16): typed literals, outline against the filled twin's area paths. */
export function literalPairing(drawings) {
  const by = new Map(drawings.map((d) => [`${d.master}/${d.file}`, d]));
  const lits = (d, areaOnly) => pathsOf(d).filter((p) => !areaOnly || p.style === 'area').flatMap((p) => p.arcs.map((a) => a.rx));
  const pairs = [], modern = [], legacy = [];
  for (const d of drawings) {
    if (/-filled\.svg$/.test(d.file)) continue;
    const fd = by.get(`${d.master}/${d.file.replace(/\.svg$/, '-filled.svg')}`); if (!fd) continue;
    const fl = lits(fd, true); if (!fl.length) continue;
    const name = d.file.replace(/\.svg$/, '');
    // litpair: distinct outline literals (4 dp), filled area literals within 0.011
    const o = uniq(lits(d, false).map((v) => r(v, 4)));
    const have = uniq(fl.map((v) => r(v, 4)));
    const notFound = o.map((v) => r(v + HALF[d.master], 4)).filter((w) => !have.some((h) => Math.abs(w - h) <= LITPAIR_TOL));
    pairs.push({ m: d.master, name, total: o.length, missing: notFound.length });
    // c16 (16 only): is outline + 0.625 present, or outline + 0.75 and not + 0.625?
    if (d.master === 16) {
      const oSet = uniq(lits(d, false).map((v) => r(v, 3))), fSet = new Set(fl.map((v) => r(v, 3)));
      for (const ov of oSet) {
        const a = fSet.has(r(ov + 0.625, 3)), b = fSet.has(r(ov + 0.75, 3));
        if (b && !a) legacy.push({ name, o: ov }); else if (a) modern.push({ name, o: ov });
      }
    }
  }
  return { pairs, modern, legacy };
}

/** §7.3: a `d` drawn as both an area and a stroke in one filled file. */
export function doubledPaths(drawings) {
  const out = [];
  for (const d of drawings) {
    if (!/-filled\.svg$/.test(d.file)) continue;
    const ps = iconOf(d.src, d.file, d.master).paths;
    const area = new Set(ps.filter((p) => p.style === 'area').map((p) => p.d));
    const both = uniq(ps.filter((p) => p.style === 'stroke' && area.has(p.d)).map((p) => p.d));
    if (both.length) out.push({ master: d.master, file: d.file, n: both.length });
  }
  return out;
}

/** §9.1 (c14): families whose members use different sets of container radius values at 24. */
export function familySplits(rows, m = 24) {
  const sigs = new Map();
  for (const mm of MASTER_LIST)
    for (const [k, v] of groupBy(rows.filter((c) => c.master === mm && c.style === 'outline' && c.pstyle === 'stroke' && c.role === 'container'), (c) => c.concept)) {
      const set = uniq(v.map((c) => (c.kind === 'sharp' ? 0 : snap(c.radius)))).sort(num);
      if (!sigs.has(k)) sigs.set(k, {}); sigs.get(k)[mm] = set;
    }
  const out = [];
  for (const [f, ms] of [...groupBy([...sigs.keys()], famOf)].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (ms.length < 2) continue;
    const g = groupBy(ms, (k) => (sigs.get(k)[m] ?? []).map((v) => tierName(m, v)).join('+') || 'none');
    if (g.size < 2) continue;
    out.push({ family: f, groups: [...g].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([s, mm]) => [s, mm.sort()]) });
  }
  return out;
}

/** One concept's distinct snapped container radii (outline, stroked, fillets) per master. */
export function rollupCells(rows, concept) {
  const out = {};
  for (const m of MASTER_LIST) {
    const v = outlineStrokeContainerFillets(rows, m).filter((c) => c.concept === concept);
    if (v.length) out[m] = uniq(v.map((c) => snap(c.radius))).sort(num);
  }
  return out;
}

/** §1.2 (c1): one master's histogram of CONTAINER-role fillets, any style, on the 4-dp radius. */
export const containerHistogram = (rows, m) => tally(rows.filter((c) => c.role === 'container' && c.master === m && c.kind !== 'sharp'), (c) => c.radius);

/** §3: files (case-sensitive, either case) and occurrences (either case) of a phrase in sources. */
export function phraseCounts(srcs, phrase) {
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { filesCs: srcs.filter((t) => new RegExp(esc).test(t)).length,
           filesCi: srcs.filter((t) => new RegExp(esc, 'i').test(t)).length,
           occ: srcs.reduce((n, t) => n + (t.match(new RegExp(esc, 'gi')) ?? []).length, 0) };
}

/** §8.1 (c12): composite fillets (not one exact arc) under their file's bendMin by more than 0.005. */
export const isUnderBendMin = (c) => c.kind !== 'sharp' && c.radius < c.bendMin - BEND_MARGIN;
export const underBendMin = (rows) => rows.filter((c) => !c.exact && isUnderBendMin(c)).sort((a, b) => a.radius - b.radius);
/** §8.1: corners in roles other than `bend` under their file's bendMin (radii.mjs's "913"). */
export const otherRolesUnderBendMin = (rows) => rows.filter((c) => c.role !== 'bend' && isUnderBendMin(c));
/** §8.2: C10's floor on mark bends — how many, how many under, how many exactly on it. */
export function bendFloor(rows) {
  const b = rows.filter((c) => c.role === 'bend' && c.kind !== 'sharp');
  return { bends: b.length, under: b.filter(isUnderBendMin).length, on: b.filter((c) => Math.abs(c.radius - c.bendMin) < 1e-9).length };
}

/** §8.3 (c12): fillets off tangent, lopsided, reflex — reflex counted by drawing name and by concept. */
export function filletQuality(rows) {
  const notTangent = rows.filter((c) => c.kind !== 'sharp' && c.tangentError > 1).sort((a, b) => b.tangentError - a.tangentError);
  const lopsided = rows.filter((c) => c.tangentUneven !== null && c.tangentUneven > 0.01).sort((a, b) => b.tangentUneven - a.tangentUneven);
  const reflex = rows.filter((c) => c.reflex);
  return { notTangent, lopsided, reflex, reflexNames: uniq(reflex.map((c) => c.name)), reflexConcepts: uniq(reflex.map((c) => c.concept)),
           ambiguous: rows.filter((c) => c.role === 'ambiguous').length };
}

/** §5: concepts with more distinct radii at 16 than at 24 (every outline stroked fillet). */
export const gainsAt16 = (per) => [...per].filter(([, g]) => g[16] && g[24] && g[16].length > g[24].length).map(([k]) => k).sort();

/** §10 arithmetic: a 90° corner of radius r eats r off each leg; its arc sits r(√2 − 1) in. */
export const arcDepth = (rad) => rad * (Math.SQRT2 - 1);

/** §10a (c18): the roll-up rows, in family-then-name order, formatted as the document does. */
export function rollup(rows, tiers = TIERS) {
  const per = new Map();
  for (const m of MASTER_LIST)
    for (const [k, v] of groupBy(rows.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.role === 'container'), (c) => c.concept)) {
      if (!per.has(k)) per.set(k, {});
      per.get(k)[m] = { fil: uniq(v.filter((c) => c.kind !== 'sharp').map((c) => snap(c.radius))).sort(num), sh: v.filter((c) => c.kind === 'sharp').length };
    }
  const tn = (m, v) => { const i = tiers[m].indexOf(v); return i >= 0 ? `t${i + 1}` : String(v); };
  const sig = (g, m) => g[m].fil.map((v) => tn(m, v)).join();
  const fmt = (g, m) => { if (!g[m]) return '—'; const a = g[m].fil.length ? g[m].fil.join(' / ') : ''; const s = g[m].sh ? `${a ? ' + ' : ''}${g[m].sh}x sharp` : ''; return (a + s) || '—'; };
  return [...per].map(([k, g]) => ({
    concept: k,
    cells: MASTER_LIST.map((m) => fmt(g, m)),
    sig24: g[24] ? g[24].fil.map((v) => tn(24, v)).join('+') + (g[24].sh ? '+sharp' : '') : '-',
    stable: !!(g[24] && g[20] && g[16] && sig(g, 24) === sig(g, 20) && sig(g, 20) === sig(g, 16)),
  })).sort((a, b) => famOf(a.concept).localeCompare(famOf(b.concept)) || a.concept.localeCompare(b.concept));
}

// ── the sections ───────────────────────────────────────────────────────────

const fmtTop = (t, n) => t.slice(0, n).map(([v, k]) => `${v}x${k}`).join(' · ');
const names = (xs) => xs.map((x) => `\`${x}\``).join(' ');

export function makeSections(drawings) {
  let rowsCache = null;
  const rows = () => (rowsCache ??= buildRows(drawings));
  const fillets = () => rows().filter((c) => c.kind !== 'sharp');
  const outlineFiles = (m) => drawings.filter((d) => d.master === m && !/-filled\.svg$/.test(d.file));
  const allArcs = () => drawings.flatMap((d) => pathsOf(d).flatMap((p) => p.arcs.map((a) => ({ ...a, d, filled: /-filled\.svg$/.test(d.file) }))));
  const conceptOf = (d) => d.file.replace(/\.svg$/, '').replace(/-filled$/, '');

  return {
    s0() {
      head('§0 What the instrument sees');
      const C = rows();
      const kinds = Object.fromEntries(tally(C, (c) => c.kind)), ps = Object.fromEntries(tally(C, (c) => c.pstyle));
      console.log(`${drawings.length} drawings · ${C.length} corners: ${kinds.arc ?? 0} fillets and ${kinds.sharp ?? 0} sharp. ${ps.stroke ?? 0} on stroked centrelines, ${ps.area ?? 0} on filled area contours.`);
      const amb = C.filter((c) => c.role === 'ambiguous').length;
      console.log(`classed ambiguous: ${amb} (${pct(amb, C.length)}%)`);
      console.log(`roles: ${tally(C, (c) => c.role).map(([k, n]) => `${k} ${n}`).join(' · ')}`);
    },

    's1.1'() {
      head('§1.1 Outline files, stroked centrelines, container role');
      console.log('definition: corners with role container, on stroked paths of outline files, fillets only, radius snapped to 1/16 within 0.02 (c2.mjs; the document says 0.025); share = that tier\'s count / the master\'s column');
      const T = tierTable(rows());
      console.log('| Master | corners | tier 1 | tier 2 | tier 3 | on one of the three | distinct values |');
      for (const t of T)
        console.log(`| ${t.master} | ${t.n} | ${TIERS[t.master].map((v, i) => `**${v}** x ${t.byTier[i]} (${pct(t.byTier[i], t.n)}%)`).join(' | ')} | ${t.onTier} (${pct(t.onTier, t.n)}%) | ${t.distinct} |`);
      console.log(`corners in all: ${T.reduce((a, t) => a + t.n, 0)}`);
      const shares = T.map((t) => t.byTier.map((n) => 100 * n / t.n));
      console.log(`largest spread of one tier's share across the masters: ${[0, 1, 2].map((i) => `tier ${i + 1} ${r(Math.max(...shares.map((s) => s[i])) - Math.min(...shares.map((s) => s[i])), 2)} points`).join(' · ')}`);
      console.log(`the census's own three commonest values = the TIERS parameter: ${T.map((t) => `${t.master}: ${t.top.slice(0, 3).map(([v]) => v).join('/')} ${t.top.slice(0, 3).every(([v], i) => v === TIERS[t.master][i]) ? 'yes' : 'NO'}`).join(' · ')}`);
      const T25 = tierTable(rows(), TIERS, SNAP_TOL);
      console.log(`with the stated 0.025 instead: ${T25.map((t) => `${t.master}: tier 3 ${t.byTier[2]}, on a tier ${t.onTier} (${pct(t.onTier, t.n)}%), ${t.distinct} distinct`).join(' · ')}`);
      console.log(`wave-5 reconcile — container-radius share (this card's definition, tier 1 / outline stroked container fillets): ${T.map((t) => `${pct(t.byTier[0], t.n)}%`).join(' · ')}`);
    },

    's1.2'() {
      head('§1.2 Commonest fourteen measured radii');
      console.log('definition (c1.mjs, recovered): corners with role CONTAINER, any style, any path, fillets, tallied on the radius at 4 dp (not snapped), that number shown at 3 dp — the document\'s heading says "all roles"; the figures are the container role');
      for (const m of MASTER_LIST) {
        // tallied on the 4-dp radius (as c1.mjs did); shown as that 4-dp number correctly rounded to
        // 3 dp (toFixed, i.e. on its exact binary value), which is how the document wrote them:
        // 2.5015 → 2.502 but 2.1245 → 2.124, because the double 2.1245 is 2.12449999…
        console.log(`| ${m} | ${containerHistogram(rows(), m).slice(0, 14).map(([v, k]) => `${Number(v.toFixed(3))}x${k}`).join(' · ')} |`);
      }
      for (const m of MASTER_LIST) {
        const s = rows().filter((c) => c.master === m && c.kind !== 'sharp');
        console.log(`under the heading's own words (every role): ${m}: ${tally(s, (c) => c.radius).slice(0, 5).map(([v, k]) => `${Number(v.toFixed(3))}x${k}`).join(' · ')} …`);
      }
      const sec = MASTER_LIST.map((m) => containerHistogram(rows(), m)[1]?.[0]);
      console.log(`second-commonest value = tier 1 + half the outline stroke: ${MASTER_LIST.map((m, i) => `${m}: ${sec[i] ?? '—'} vs ${TIERS[m][0] + HALF[m]} ${sec[i] != null && Math.abs(sec[i] - (TIERS[m][0] + HALF[m])) < 1e-9 ? 'yes' : 'NO'}`).join(' · ')}`);
    },

    's1.3'() {
      head('§1.3 The typed literals');
      console.log('| Master | arcs in outline files | distinct `rx` | commonest |');
      let bez = 0;
      for (const d of drawings) for (const p of iconOf(d.src, d.file, d.master).paths) bez += bezierCount(p.d);
      const ell = {};
      for (const m of MASTER_LIST) {
        const arcs = outlineFiles(m).flatMap((d) => pathsOf(d).flatMap((p) => p.arcs));
        const byVal = tally(arcs, (a) => a.rx).sort((a, b) => a[0] - b[0]).sort((a, b) => b[1] - a[1]);
        ell[m] = arcs.filter((a) => Math.abs(a.rx - a.ry) > 1e-9).length;
        console.log(`| ${m} | ${arcs.length} | ${byVal.length} | ${fmtTop(byVal, 5)} |`);
      }
      console.log(`Bezier commands in all ${drawings.length} files: ${bez}. Elliptical arcs (rx != ry) in outline files: ${MASTER_LIST.map((m) => `${m}: ${ell[m]}`).join(' · ')}`);
      const lit = rows().filter((c) => c.literal !== null);
      const mm = lit.length ? Math.max(...lit.map((c) => c.literalMismatch)) : 0;
      console.log(`single-arc corners with a typed rx: ${lit.length} · matching the radius drawn: ${lit.filter((c) => c.literalMismatch <= 1e-6).length} · largest discrepancy ${mm.toExponential(1)}`);
      const A = allArcs();
      const lam = A.filter((a) => lambdaOf(a) > 1 + 1e-9);
      const lamC = uniq(lam.map((a) => conceptOf(a.d)));
      console.log(`arcs a renderer enlarges, SVG F.6.6 Λ > 1 (the reviewer's count): ${lam.length} arcs in ${uniq(lam.map((a) => `${a.d.master}/${a.d.file}`)).length} files, ${lamC.length} concepts (outline ${lam.filter((a) => !a.filled).length} · filled ${lam.filter((a) => a.filled).length})`);
      const ch = A.filter((a) => a.rx > 0 && chordShortfall(a) > 1e-9);
      const chC = uniq(ch.map((a) => conceptOf(a.d))).sort();
      console.log(`arcs whose typed rx is under half the chord (this card's check): ${ch.length} arcs in ${uniq(ch.map((a) => `${a.d.master}/${a.d.file}`)).length} files, ${chC.length} concepts (outline ${ch.filter((a) => !a.filled).length} · filled ${ch.filter((a) => a.filled).length}; largest shortfall ${ch.length ? r(Math.max(...ch.map(chordShortfall)), 5) : 0})`);
      console.log(`  concepts: ${names(chC)}`);
      for (const [f, rx] of [['link.svg', 4.24], ['attachment-3.svg', 2.29]]) {
        const d = drawings.find((x) => x.master === 24 && x.file === f);
        const a = d && pathsOf(d).flatMap((p) => p.arcs).find((x) => x.rx === rx && chordShortfall(x) > 1e-9);
        if (a) { const need = Math.hypot(a.x2 - a.x1, a.y2 - a.y1) / 2; console.log(`  24/${f}: A${a.rx} ${a.ry} across a chord of ${r(2 * need, 4)}, needs ${r(need, 5)} — short by ${r(need - a.rx, 5)} units, a scale-up of x${r(need / a.rx, 4)}`); }
        else console.log(`  24/${f}: no short arc of rx ${rx} found`);
      }
      const z = A.filter(isZeroLength);
      console.log(`zero-length arcs: ${z.length} — ${z.map((a) => `${a.d.master}/${a.d.file.replace(/\.svg$/, '')}`).join(', ')}`);
    },

    s2() {
      head('§2 The three tiers are locked to three different things');
      console.log('| Tier | 24 | 20 | 16 | share of canvas | multiple of that master\'s stroke |');
      for (let i = 0; i < 3; i++) {
        const v = MASTER_LIST.map((m) => TIERS[m][i]);
        console.log(`| ${i + 1} | ${v.join(' | ')} | ${MASTER_LIST.map((m, j) => `${r(100 * v[j] / m, 3)}%`).join(' · ')} | ${MASTER_LIST.map((m, j) => `${r(v[j] / STROKES[m], 3)}x`).join(' · ')} |`);
      }
      const [a24, a16] = [TIERS[24][0] / 24, TIERS[16][0] / 16], [s24, s16] = [TIERS[24][0] / STROKES[24], TIERS[16][0] / STROKES[16]];
      console.log(`tier 1 from 24 to 16: canvas share falls ${pct(a24 - a16, a24)}% · stroke multiple falls ${pct(s24 - s16, s24)}%`);
      console.log(`tier 1 canvas-locked would be ${r(TIERS[24][0] * 20 / 24, 3)} at 20 and ${r(TIERS[24][0] * 16 / 24, 3)} at 16; stroke-locked ${r(s24 * STROKES[20], 3)} at 20 and ${r(s24 * STROKES[16], 3)} at 16; drawn ${TIERS[20][0]} and ${TIERS[16][0]}`);
      console.log(`tier 2 = 1/16 of the canvas at every master: ${MASTER_LIST.every((m) => TIERS[m][1] * 16 === m) ? 'yes' : 'no'} · tier 3 = half the stroke at every master: ${MASTER_LIST.every((m) => TIERS[m][2] === STROKES[m] / 2) ? 'yes' : 'no'}`);
    },

    s3() {
      head('§3 The drawings already name the tiers (24 masters, every file, comments included)');
      const files = drawings.filter((d) => d.master === 24);
      for (const label of ['container radius', 'detail radius', 'bend radius', "C10's minimum"]) {
        const { filesCs, filesCi, occ } = phraseCounts(files.map((d) => d.src), label);
        console.log(`"${label}": ${filesCs} files (case-sensitive) · ${filesCi} files (either case) · ${occ} occurrences (either case)`);
      }
      // c-grep: "[Cc]ontainer radius[^.;,)]*" — a decimal point is kept when a digit follows it
      const valuesAfter = (word) => files.flatMap((d) => [...d.src.matchAll(new RegExp(`[${word[0].toUpperCase()}${word[0]}]${word.slice(1)} radius((?:[^.;,)\\n]|\\.(?=\\d))*)`, 'g'))].map((m) => m[1].match(/\d+(?:\.\d+)?(?:\s*·\s*\d+(?:\.\d+)?)*/)?.[0] ?? null)).filter(Boolean);
      const cv = valuesAfter('container');
      console.log(`"container radius" followed by a value: ${cv.length} occurrences · first value 2.5 (tier 1): ${cv.filter((v) => /^2\.5\b/.test(v)).length} · others: ${cv.filter((v) => !/^2\.5\b/.test(v)).join(', ')}`);
      const dv = valuesAfter('detail');
      console.log(`"detail radius" followed by a value: ${dv.length} occurrences · values: ${tally(dv, (v) => v.replace(/\s*·\s*/g, ' · ')).map(([v, n]) => `${v} x${n}`).join('; ')}`);
    },

    's3.1'() {
      head('§3.1 Structural evidence — role and part size');
      console.log('definition: outline files, stroked paths, all roles, fillets on a tier; part min-dim = smaller side of the subpath bbox; quartiles = sorted[floor(n·p)]');
      console.log('| Master | tier | n | role mix | part min-dim: p25 / median / p75 |');
      const C = rows();
      for (const m of MASTER_LIST) {
        const s = C.filter((c) => c.master === m && c.style === 'outline' && c.pstyle === 'stroke' && c.kind !== 'sharp' && tierOf(m, c.radius) > 0);
        for (const t of [1, 2, 3]) {
          const g = s.filter((c) => tierOf(m, c.radius) === t);
          const dims = g.map((c) => Math.min(c.subW, c.subH)).sort(num);
          const q = (p) => (dims.length ? r(dims[Math.floor(dims.length * p)], 2) : '—');
          console.log(`| ${m} | ${t} (${TIERS[m][t - 1]}) | ${g.length} | ${tally(g, (c) => c.role).map(([k, n]) => `${k} ${n}`).join(' · ')} | ${q(0.25)} / **${q(0.5)}** / ${q(0.75)} |`);
        }
      }
      const t1 = C.filter((c) => c.master === 24 && c.style === 'outline' && c.pstyle === 'stroke' && c.kind !== 'sharp' && tierOf(24, c.radius) === 1);
      console.log(`tier 1 at 24 is container: ${pct(t1.filter((c) => c.role === 'container').length, t1.length, 0)}%`);
    },

    's3.2'() {
      head('§3.2 The three jobs — tier signature at 24');
      const sig = signatures(rows(), 24);
      const by = groupBy([...sig], ([, s]) => s);
      const list = (s) => (by.get(s) ?? []).map(([k]) => k).sort();
      console.log(`concepts with a rounded container corner at 24: ${sig.size}`);
      for (const [label, keys] of [['tier 1 only', ['1']], ['tier 3 only', ['3']], ['tier 2 only', ['2']], ['tier 1 + 2', ['1+2']], ['tier 2 + 3', ['2+3']], ['tier 1 + 3', ['1+3']], ['all three', ['1+2+3']], ['off-tier only', ['0']], ['off-tier + a tier', ['0+1', '0+2', '0+3']]]) {
        const ns = keys.flatMap(list).sort();
        console.log(`| ${label} | ${ns.length} | ${names(ns)} |`);
      }
      const only25 = list('1').length;
      console.log(`use only tier 1 (2.5): ${only25} of ${sig.size} (${pct(only25, sig.size)}%); something other than 2.5 somewhere: ${sig.size - only25} (${pct(sig.size - only25, sig.size)}%)`);
    },

    's3.3'() {
      head('§3.3 Sharp corners');
      const sh = rows().filter((c) => c.kind === 'sharp');
      const ps = Object.fromEntries(tally(sh, (c) => c.pstyle));
      const os = sh.filter((c) => c.style === 'outline' && c.pstyle === 'stroke');
      const cont = os.filter((c) => c.role === 'container');
      console.log(`${sh.length} sharp corners · ${ps.area ?? 0} on filled area paths · ${ps.stroke ?? 0} on stroked paths · ${os.length} of those in outline files, across ${uniq(os.map((c) => c.concept)).length} concepts`);
      console.log(`container-role sharp corners in outline files: ${cont.length} in ${uniq(cont.map((c) => c.concept)).length} concepts`);
      for (const [k, v] of [...groupBy(cont, (c) => c.concept)].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])))
        console.log(`| \`${k}\` | ${v.length} | masters ${uniq(v.map((c) => c.master)).join('/')} |`);
    },

    s4() {
      head('§4 Off-tier values (outline files, stroked paths, container role, snapped within 0.02 as c2.mjs did)');
      const off = {};
      for (const m of MASTER_LIST) {
        off[m] = outlineStrokeContainerFillets(rows(), m).filter((c) => tierOf(m, c.radius, TIERS, SNAP_TOL_C2) === 0);
        const byC = groupBy(off[m], (c) => c.concept);
        console.log(`${m}: ${off[m].length} corners in ${byC.size} concepts`);
        for (const [k, v] of [...byC].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])))
          console.log(`    ${k.padEnd(20)} ${v.map((c) => `r${r(snap(c.radius, SNAP_TOL_C2), 4)}`).join(' ')}`);
      }
      console.log('§4.1 body curves — corners of the concepts the document names (shield, shield-2, message-7, lock-6, plug-6) whose off-tier radius is above tier 1:');
      const BODY = ['shield', 'shield-2', 'message-7', 'lock-6', 'plug-6'];
      console.log(`    ${MASTER_LIST.map((m) => `${m}: ${off[m].filter((c) => BODY.includes(c.concept) && snap(c.radius, SNAP_TOL_C2) > TIERS[m][0]).length}`).join(' · ')}`);
      const tu = rollupCells(rows(), 'thumbs-up');
      const tip = MASTER_LIST.map((m) => { const v = (tu[m] ?? []).filter((x) => x !== TIERS[m][0]); return v.length ? Math.max(...v) : null; });
      console.log(`§4.2 thumbs-up tip (its container radius other than tier 1): ${tip.map((v) => v ?? '—').join(' · ')} — canvas share ${tip.map((v, i) => (v == null ? '—' : `${r(100 * v / MASTER_LIST[i], 2)}%`)).join(' · ')}`);
      const cm = crossMaster(rows()).per;
      console.log('§4.1 / §4.2 the same values outside the container role (every outline stroked fillet, distinct, 24 | 20 | 16):');
      for (const k of ['chart-pie', 'lightbulb', 'map-pin', 'message', 'user-3', 'bug', 'bug-2', 'files', 'files-2', 'files-3', 'files-5', 'grid', 'grid-5', 'grid-7', 'maximize-5', 'wallet', 'wallet-3', 'users-behind', 'cart', 'cart-3', 'cart-4', 'cart-5'])
        console.log(`    ${k.padEnd(14)} ${MASTER_LIST.map((m) => (cm.get(k)?.[m] ?? ['—']).join(' ')).join(' | ')}`);
    },

    s5() {
      head('§5 Behaviour from 24 to 16 (outline files, stroked paths, all roles, fillets)');
      const X = crossMaster(rows());
      console.log(`| Concepts with at least one fillet | ${X.per.size} |`);
      console.log(`| Tier signature identical at 24, 20 and 16 | ${X.clean} (${pct(X.clean, X.per.size)}%) |`);
      console.log(`| Signature changes | ${X.changes.length} |`);
      console.log(`| A master has no fillet at all | ${X.missing.length} — ${names(X.missing)} |`);
      console.log('every concept whose signature changes (distinct radii 24 | 20 | 16):');
      for (const c of X.changes.sort((a, b) => a.concept.localeCompare(b.concept)))
        console.log(`    ${c.concept.padEnd(18)} ${MASTER_LIST.map((m) => c.g[m].join(' ')).join(' | ')}   ${c.sig.join(' → ')}`);
      const all = gainsAt16(X.per);
      console.log(`concepts with more distinct radii at 16 than at 24: ${all.length} — ${names(all)}`);
      const GAIN = ['camera-3', 'camera-4', 'clipboard-2', 'cart', 'cart-3', 'cart-4', 'cart-5'];
      console.log(`of the ${GAIN.length} the document names: ${GAIN.filter((k) => all.includes(k)).length} are among them`);
      const d16 = drawings.find((d) => d.master === 16 && d.file === 'rotate-ccw-9.svg');
      if (d16) console.log(`16/rotate-ccw-9 path 0 (the square) typed arcs: ${tally(pathsOf(d16)[0].arcs, (a) => `A${a.rx} ${a.ry}`).map(([k, n]) => `${k} x${n}`).join(', ')}`);
    },

    s6() {
      head('§6 Nested radii');
      const N = nesting(rows());
      console.log(`| Outline drawings with two or more closed, rounded subpaths | ${N.multi.length} of ${N.outlineDrawings} — ${names(uniq(N.multi.map((k) => k.split('|')[0])).sort())} |`);
      console.log(`| Of those, nested (one strictly inside the other) | ${N.nested} |`);
      console.log(`filled drawings, a rounded hole inside a rounded solid: ${N.pairs.length} pairs in ${uniq(N.pairs.map((p) => p.concept)).length} concepts`);
      const diffs = tally(N.pairs, (p) => p.diff);
      console.log(`solid − hole: ${diffs.length} distinct values, ${diffs.length ? `${Math.min(...diffs.map(([v]) => v))} to ${Math.max(...diffs.map(([v]) => v))}` : '—'} (${diffs.map(([v, n]) => `${v}x${n}`).join(' · ')})`);
      console.log('| Concept | master | solid r | hole r | difference |');
      for (const k of ['file', 'file-text', 'file-text-2', 'files', 'files-2', 'files-3', 'files-5', 'book', 'book-2', 'book-3', 'checkbox', 'checkbox-2', 'checkbox-3', 'checkbox-4', 'compose', 'alert-triangle-2', 'alert-triangle-4']) {
        const ps = N.pairs.filter((p) => p.concept === k);
        const first = MASTER_LIST.map((m) => ps.find((p) => p.master === m));
        console.log(`| \`${k}\` | 24 / 20 / 16 | ${first.map((p) => p?.outer ?? '—').join(' / ')} | ${first.map((p) => p?.inner ?? '—').join(' / ')} | ${first.map((p) => p?.diff ?? '—').join(' / ')} |`);
      }
      const cb = MASTER_LIST.map((m) => N.pairs.find((p) => p.concept === 'checkbox' && p.master === m));
      console.log(`checkbox hole as a share of the solid's corner: ${cb.map((p, i) => `${MASTER_LIST[i]}: ${p ? `${pct(p.inner, p.outer, 0)}%` : '—'}`).join(' · ')}`);
    },

    s7() {
      head('§7 Filled against outline — the four pairings');
      const a = pairNearest(rows()), b = pairModal(rows()), v = pairVertex(rows());
      console.log(`| Nearest filled radius to each outline radius | ${a.agree} of ${a.pairs} concept x master pairs agree |`);
      console.log(`| Modal container-role radius per style | ${b.agree} of ${b.pairs} (${pct(b.agree, b.pairs)}%) |`);
      const L = literalPairing(drawings);
      const tot = L.pairs.reduce((s, p) => s + p.total, 0), bad = L.pairs.reduce((s, p) => s + p.missing, 0);
      console.log(`| Multiset containment of typed literals, whole file | ${tot - bad} of ${tot} outline arc literals have their + half-stroke counterpart (${pct(tot - bad, tot)}%); ${bad} do not, in ${uniq(L.pairs.filter((p) => p.missing).map((p) => p.name)).length} concepts (${L.pairs.length} concept x master pairs with area paths) |`);
      console.log(`| Vertex pairing on the corner's apex | ${v.pairs} pairs matched (${v.agree} agree) |`);
      console.log('what survives as a set-wide figure:');
      console.log(`| Outline rx values at 16 whose filled twin carries rx + 0.625 | ${L.modern.length} |`);
      const K = containment(rows());
      console.log(`| Filled-only convex fillets with no outline counterpart (cut-mouth easings) | ${K.extras.length} — commonest ${fmtTop(tally(K.extras, (e) => e.r), 3)} |`);
      console.log(`   (containment itself: ${K.ok} of ${K.total} outline convex fillets matched)`);
      const f16 = drawings.filter((d) => d.master === 16 && /-filled\.svg$/.test(d.file));
      const has = (d, v) => pathsOf(d).some((p) => p.arcs.some((x) => x.rx === v && x.ry === v));
      console.log(`| 16-master filled files carrying 2.125 | ${f16.filter((d) => has(d, 2.125)).length} |`);
    },

    's7.1'() {
      head('§7.1 The C7 left-behind corner at 16');
      const f16 = drawings.filter((d) => d.master === 16 && /-filled\.svg$/.test(d.file));
      const has = (d, v) => pathsOf(d).some((p) => p.arcs.some((x) => x.rx === v && x.ry === v));
      const with2125 = f16.filter((d) => has(d, 2.125)), with225 = f16.filter((d) => has(d, 2.25));
      console.log(`filled files at 16 carrying rx 2.125: ${with2125.length} · carrying rx 2.25: ${with225.length}`);
      const L = literalPairing(drawings);
      const legacy15 = uniq(L.legacy.filter((x) => x.o === 1.5).map((x) => x.name)).sort();
      const the27 = with225.map((d) => d.file.replace(/-filled\.svg$/, '')).sort();
      console.log(`of the ${the27.length}, outline body corner 1.5 with 2.25 and no 2.125 in the filled area paths: ${the27.filter((n) => legacy15.includes(n)).length} — ${names(the27.filter((n) => legacy15.includes(n)))}`);
      const rest = the27.filter((n) => !legacy15.includes(n));
      console.log(`the remaining ${rest.length}: ${names(rest)}`);
    },

    's7.2'() {
      head('§7.2 The flagged concepts, read off the typed literals (outline file | filled file, every path, as `grep A…` read them | each outline rx + half found among the filled AREA arcs)');
      const H = { 24: 0.75, 20: 0.75, 16: 0.625 };
      const fN = new Set(pairNearest(rows()).rows.filter((x) => Math.abs(x.worst) > PAIR_TOL).map((x) => x.concept));
      const fM = new Set(pairModal(rows()).rows.filter((x) => Math.abs(x.grow - H[x.m]) > 1e-9).map((x) => x.concept));
      const fL = new Set(literalPairing(drawings).pairs.filter((p) => p.missing).map((p) => p.name));
      const inAll = [...fN].filter((k) => fM.has(k) && fL.has(k)).sort();
      console.log(`flagged by nearest ${fN.size} · by modal ${fM.size} · by literal containment ${fL.size} concepts; by all three: ${inAll.length} — ${names(inAll)}`);
      for (const k of ['watch-3', 'watch-2', 'pencil', 'pencil-3', 'pencil-4', 'mail', 'store', 'save', 'archive', 'layout-footer-4', 'maximize-5']) {
        const parts = [];
        for (const m of MASTER_LIST) {
          const o = drawings.find((d) => d.master === m && d.file === `${k}.svg`), f = drawings.find((d) => d.master === m && d.file === `${k}-filled.svg`);
          if (!o || !f) continue;
          const ol = pathsOf(o).flatMap((p) => p.arcs.map((a) => a.rx)), fl = pathsOf(f).filter((p) => p.style === 'area').flatMap((p) => p.arcs.map((a) => a.rx));
          const fs = tally(pathsOf(f).flatMap((p) => p.arcs.map((a) => a.rx)), (x) => x).sort((a, b) => b[0] - a[0]), os = tally(ol, (x) => x).sort((a, b) => b[0] - a[0]);
          const grown = uniq(ol).sort((a, b) => b - a).map((x) => `${x}→${fl.some((y) => Math.abs(y - (x + HALF[m])) < 1e-9) ? x + HALF[m] : 'absent'}`);
          parts.push(`${m}: ${os.map(([v, n]) => `${v} x${n}`).join(', ')} | ${fs.map(([v, n]) => `${v} x${n}`).join(', ')} | +half: ${grown.join(' ')}`);
        }
        console.log(`\`${k}\`\n    ${parts.join('\n    ')}`);
      }
      const m5 = drawings.find((d) => d.master === 24 && d.file === 'maximize-5-filled.svg');
      if (m5) console.log(`24/maximize-5-filled: ${pathsOf(m5).filter((p) => p.style === 'stroke').length} stroked paths, ${pathsOf(m5).filter((p) => p.style === 'area').length} area path(s); stroked path rx: ${uniq(pathsOf(m5).filter((p) => p.style === 'stroke').flatMap((p) => p.arcs.map((a) => a.rx))).join(', ')}`);
    },

    's7.3'() {
      head('§7.3 One `d` published as both an area and a stroke');
      const D = doubledPaths(drawings);
      const cs = uniq(D.map((x) => x.file.replace(/-filled\.svg$/, ''))).sort();
      console.log(`${D.length} files, ${cs.length} concepts: ${names(cs)} at masters ${uniq(D.map((x) => x.master)).join('/')}`);
      const C = rows().filter((c) => cs.includes(c.concept) && c.style === 'filled' && c.pstyle === 'area' && c.kind !== 'sharp');
      console.log(`radii.mjs reads their area corners as: ${MASTER_LIST.map((m) => `${m}: ${uniq(C.filter((c) => c.master === m).map((c) => c.radius)).join('/')}`).join(' · ')}`);
    },

    's8.1'() {
      head('§8.1 Composite corners');
      const F = fillets(), comp = F.filter((c) => !c.exact);
      console.log(`${comp.length} of ${F.length} fillets (${pct(comp.length, F.length)}%) · ${MASTER_LIST.map((m) => `${comp.filter((c) => c.master === m).length} at ${m}`).join(' · ')} · ${comp.filter((c) => c.style === 'filled').length} filled, ${comp.filter((c) => c.style === 'outline').length} outline · ${uniq(comp.map((c) => c.concept)).length} concepts`);
      console.log(`within 0.1 of one of the three tiers: ${comp.filter((c) => TIERS[c.master].some((t) => Math.abs(c.radius - t) < 0.1)).length}`);
      const under = underBendMin(rows());
      console.log(`composite fits under their file's bendMin: ${under.length} corners in ${uniq(under.map((c) => c.concept)).length} concepts — ${names(uniq(under.map((c) => c.concept)).sort())}`);
      for (const [k, v] of groupBy(under, (c) => c.concept))
        console.log(`    ${k.padEnd(10)} ${uniq(v.map((c) => `${c.master}/${c.style[0]} r${c.radius} (${c.role}, bendMin ${c.bendMin})`)).join(' · ')}`);
      const sh = outlineStrokeContainerFillets(rows(), 24).filter((c) => c.concept === 'shield' && !c.exact);
      if (sh.length) console.log(`shield at 24, composite tip: snapped ${snap(sh[0].radius)} = ${pct(snap(sh[0].radius) - 0.75, 0.75, 1)}% over r0.75`);
      const other = otherRolesUnderBendMin(rows());
      console.log(`corners in other roles under their file's bendMin: ${other.length} (${JSON.stringify(Object.fromEntries(tally(other, (c) => c.pstyle)))})`);
    },

    's8.2'() {
      head("§8.2 C10's floor (also printed by `node tools/audit/radii.mjs`, last lines)");
      const F = bendFloor(rows());
      console.log(`${F.bends} mark bends · ${F.under} under half the stroke · ${F.on} exactly on it`);
    },

    's8.3'() {
      head('§8.3 Fillets that are not quite fillets');
      const C = rows();
      const Q = filletQuality(C), nt = Q.notTangent, lop = Q.lopsided, rf = Q.reflex, amb = Q.ambiguous;
      const w = nt[0], l = lop[0];
      console.log(`| Meets a leg more than 1 degree off tangent | ${nt.length} | ${uniq(nt.map((c) => c.concept)).length} | ${w ? `\`${w.concept}\` at ${w.tangentError} degrees (${uniq(nt.filter((c) => c.tangentError === w.tangentError).map((c) => `${c.master}/${c.name}`)).join(', ')})` : '—'} |`);
      console.log(`| Lopsided — tangent lengths differ by more than 0.01 | ${lop.length} | ${uniq(lop.map((c) => c.concept)).length} | ${l ? `\`${l.name}\` at ${l.master}, ${r(l.tangentUneven, 3)} units apart on an r${r(l.radius, 3)} corner` : '—'} |`);
      console.log(`| Reflex — the fillet goes the long way round | ${rf.length} | ${Q.reflexNames.length} drawing names, ${Q.reflexConcepts.length} concepts | ${names(Q.reflexNames)} |`);
      console.log(`| Classed ambiguous | ${amb} (${pct(amb, C.length)}%) |`);
      console.log(`worst 12 lopsided: ${lop.slice(0, 12).map((c) => `${c.master}/${c.name} ${r(c.tangentUneven, 3)}`).join(' · ')}`);
    },

    's9.1'() {
      head('§9.1 Numbered siblings that use different radius values (container corners, outline, 24)');
      const F = familySplits(rows(), 24);
      for (const f of F) console.log(`| \`${f.family}\` | ${f.groups.map(([s, ms]) => `${s} = {${ms.join(', ')}}`).join('   |   ')} |`);
      console.log(`${F.length} families`);
    },

    's9.2'() {
      head('§9.2 Size variants');
      const C = rows();
      const sized = uniq(C.filter((c) => /-(small|large)$/.test(c.concept) && c.kind !== 'sharp').map((c) => c.concept)).sort();
      const at24 = (k) => uniq(C.filter((x) => x.concept === k && x.master === 24 && x.style === 'outline' && x.pstyle === 'stroke' && x.kind !== 'sharp').map((x) => snap(x.radius))).sort(num).join('/');
      const same = sized.filter((k) => at24(k) === at24(k.replace(/-(small|large)$/, '')));
      console.log(`size-variant concepts with a fillet: ${sized.length} (${sized.filter((k) => k.startsWith('check')).length} check*, ${sized.filter((k) => k.startsWith('chevron')).length} chevron*) · same radius set as their base at 24: ${same.length} · values: ${uniq(sized.map(at24)).join(', ')}`);
    },

    s10() {
      head('§10 In pixels (1 master unit = 1 px at the master\'s own size; square keyline side)');
      console.log('| Master | side | tier | r | eats | arc depth | straight run left | r / stroke |');
      for (const m of MASTER_LIST) {
        const side = MASTERS[m].keylines.square[0];
        TIERS[m].forEach((rad, i) => console.log(`| ${m} | ${side} | ${i + 1} | ${rad} | ${rad} px | ${r(arcDepth(rad), 3)} px | ${side - 2 * rad} of ${side} (${r(100 * (side - 2 * rad) / side, 1)}%) | ${r(rad / STROKES[m], 3)}x |`));
      }
      console.log('| Master | tier 1 to tier 2 | tier 2 to tier 3 |');
      for (const m of MASTER_LIST) {
        const [a, b, c] = TIERS[m];
        console.log(`| ${m} | ${r(a - b, 3)} px, ${r(arcDepth(a - b), 3)} px | ${r(b - c, 3)} px, ${r(arcDepth(b - c), 3)} px |`);
      }
      const [a, , c] = TIERS[16];
      console.log(`three-tier spread at 16: ${r(a - c, 3)} px of tangent and ${r(arcDepth(a - c), 2)} px of arc depth · tier 1 at 24 eats ${pct(2 * TIERS[24][0], MASTERS[24].keylines.square[0])}% of an 18-unit side`);
    },

    s10a() {
      head('§10a The full roll-up — every concept with a container-role corner');
      const R = rollup(rows());
      console.log('| concept | 24 | 20 | 16 | tier signature at 24 | same tiers at all three? |');
      for (const x of R) console.log(`| \`${x.concept}\` | ${x.cells.join(' | ')} | ${x.sig24} | ${x.stable ? 'yes' : '**no**'} |`);
      const at24 = new Set(outlineStrokeContainerFillets(rows(), 24).map((c) => c.concept));
      console.log(`${R.length} concepts · not in §1.1's count (no fillet container corner at 24): ${names(R.map((x) => x.concept).filter((k) => !at24.has(k)))}`);
    },

    s11() {
      head('§11 / §11a figures not printed above');
      const d16 = drawings.find((d) => d.master === 16 && d.file === 'rotate-ccw-9.svg');
      if (d16) { const b = bbox([pathsOf(d16)[0].d]); console.log(`16/rotate-ccw-9 square (path 0) centreline width: ${r(b.x1 - b.x0, 3)} units`); }
      const all = MASTER_LIST.flatMap((m) => outlineFiles(m).flatMap((d) => pathsOf(d).flatMap((p) => p.arcs.map((a) => a.rx))));
      console.log(`distinct typed rx across all outline files, three masters together: ${uniq(all).length}`);
    },
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────

export const SECTION_ORDER = ['s0', 's1.1', 's1.2', 's1.3', 's2', 's3', 's3.1', 's3.2', 's3.3', 's4', 's5', 's6', 's7', 's7.1', 's7.2', 's7.3', 's8.1', 's8.2', 's8.3', 's9.1', 's9.2', 's10', 's10a', 's11'];
const USAGE = 'usage: node tools/audit/corners-probe.mjs <pin-dir with src/icons/{24,20,16}> [section …]\nsections: ' + SECTION_ORDER.join(' ');

export function main(argv = process.argv.slice(2)) {
  const pos = argv.filter((a) => !a.startsWith('--'));
  const pin = pos[0] ? resolve(pos[0]) : null;
  if (!pin || !MASTER_LIST.every((m) => existsSync(join(pin, 'src/icons', String(m))))) { console.error(USAGE); return 2; }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !SECTION_ORDER.includes(s));
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${USAGE}`); return 2; }
  const S = makeSections(loadPin(pin));
  console.log(`# corners-probe — docs/audit/findings-corners.md, reprinted from ${basename(pin)} (${pin})`);
  for (const s of wanted.length ? wanted : SECTION_ORDER) S[s]();
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
