#!/usr/bin/env node
// THE FILLED STYLE (F13) — audit card 1.8. Every measured figure in docs/audit/findings-filled.md
// prints from here, section by section, in the document's own units and rounding.
//
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing (stdout only).
//
// Usage:
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   node tools/audit/filled-probe.mjs $P [section …] [--cache <dir>]
// No section = all. An unknown section, or a pin without src/icons/{24,20,16}, exits 2.
// `--cache <dir>` (a directory YOU name; there is no default) keeps the five censuses as JSON there and
// reuses them on the next run; each file is stamped with a digest of the pin's src/icons (names and
// contents) and the probe refuses (exit 2) a cache made from another pin. Without it nothing is written.
// This document reads no reference set, so there is no `--refs` flag.
//
// Sections → the document's §:
//   s0    §0 and the header: the pin's population; the lattices; the slivers the enclosed census drops
//   s1    §1 the ink box: the box table, the `grows:` notes, the 0.0005–0.01 band lint cannot see
//   s2    §2 angles: filled straight edges matched to the outline centreline they offset
//   s2.1  §2.1 what the deviation costs in pixels (length × sin deviation)
//   s2.2  §2.2 the bent-mark leg angle (C10 / C12), chevrons by master and by shape variant, bend radii
//   s2.3  §2.3 filled straight edges with no outline counterpart
//   s3    §3 corner radii: the derived relation (filled = centreline ± half the outline stroke)
//   s3.1  §3.1 the 1.5-era offset left behind at 16
//   s3.2  §3.2 the rest of the corners that land on neither derived value
//   s3.3  §3.3 the filled-only corner vocabulary
//   s4.1  §4.1 facingGap on the filled drawings (what lint sees)
//   s4.2  §4.2 enclosed white regions by their largest inscribed circle (what lint cannot see)
//   s4.3  §4.3 the cut-weight census, as widths and as multiples of the line
//   s4.4  §4.4 filling closes air the outline had
//   s5    §5 the outer region (ink ∪ enclosed white): identical by class, the worst pairs
//   s5.1  §5.1 the filled closes the outline's open shape — the box on the concepts it names
//   s5.2  §5.2 silhouette pieces, and `table`'s construction read from its files
//   s5.3  §5.3 the two shape-filled constructions
//   s5.4  §5.4 a ring kept as a ring, thickened to FILLED_WEIGHT; `search`; `list-bullet-3`
//   s5.5  §5.5 ink area, filled over outline
//   s5.6  §5.6 `ban` and `ban-2`
//   s5.7  §5.7 path counts
//   s6    §6 the judgement — its restated figures, recomputed
//   s7    §7 the judged list — its restated figures, recomputed
//   s8    §8 what only Maruti's eye can settle — its restated figures, recomputed
//
// THE FIVE CENSUSES (each is the 2026-10-04 card's own scratch script, folded in; transcript
// agent-ae71d10e7c6ebe552 of session 07852967):
//   pairs   measure.mjs — per pair: the class, the ink box by lint's recipe (geometry.bbox grown by half
//           the stroke, unrounded), `grows:`, notes, matched straight edges (angles.segmentsOf), matched
//           corners (radii.radiiOf), geometry.facingGap(cap 4) on both styles. Rounded to 3 dp where the
//           original stored 3 dp, BEFORE any later comparison, exactly as the analyses read pairs.json.
//   cuts    cuts.mjs (after its two edits) — every ENCLOSED white region of a filled drawing, flood-filled
//           on a 1/16 lattice, width = the median over ≤ 60 ridge cells of the leashed coordinate-descent
//           maximum of the exact clearance; components under 16 cells and parity glitches dropped.
//   silh    silh.mjs — the outer region (ink ∪ enclosed white) of both styles on a 1/16 lattice.
//   pieces  pieces.mjs — 8-connected ink components on a 1/12 lattice, components under 9 cells dropped.
//   legs    an5.mjs — line-heavy pairs with the same segment structure, legs paired in document order.
//
// INSTRUMENTS: tools/geometry.mjs (bbox, facingGap), tools/masters.mjs, tools/audit/angles.mjs
// (segmentsOf), tools/audit/radii.mjs (radiiOf, iconFromSource), tools/audit/raster.mjs (iconFromText,
// regionOf().covered, flatten), tools/audit/metrics-check.mjs (readSvg, inkBoxOf — the solved box, for
// the defect cross-check in s1 and for reading arc radii in s5.4). All from the repo; geometry, masters
// and lint at HEAD equal the pin's (`git diff 5933041 HEAD -- tools/geometry.mjs tools/masters.mjs` is
// empty). The drawings are read from the pin.
//
// DEFINITIONS WAVE 5 RECONCILES (plan, "Wave 5 must reconcile, never pick") — this document's own:
//  · box equality "1,100 of 1,455 exact" (s1, s6): every side's filled-minus-outline difference rounds to
//    0 at 3 dp (|d| < 0.0005), boxes by lint's recipe on geometry.bbox(); s1 also prints the split on the
//    solved box. Not card 2.1's 96.3%, not findings-metrics.md §11.3's six readings.
//  · the 16 filled-corner offset "97 corners" (s3.1): 16-master area corners matched to an outline corner
//    whose radius sits +0.125, −0.125 or +0.25 off the derived value (outline radius ± 0.625), grouped by
//    signed delta as the original's inline command did.
//  · The flood fills here are card 1.8's own (cuts.mjs, silh.mjs, pieces.mjs) on raster.mjs's covered();
//    refs/pairgeom.mjs rasterises Figma reference records and is not this card's instrument.
//
// KNOWN INSTRUMENT DEFECTS (plans/set-and-rules-audit.md, "Known instrument defects"):
//  · raster.mjs:257 `classify` on area paths — NOT EXPOSED. Every raster figure here samples points with
//    `region().covered`, which tests area paths by an even-odd ray (horizontal edges correctly skipped);
//    `classify`, `rasterise`, `inkArea`, `inkPixels`, `census`, `halfToneShare` are never called. Ink
//    areas in s5.5 are lattice cell counts × cell area, exactly as the original measured them.
//  · geometry.mjs bbox() arc sampling (up to 0.0056 inside a true arc edge) — EXPOSED in s1's sub-0.01
//    band, which the original measured with bbox() (lint's own recipe). s1 prints the original's figures
//    on bbox() and then, on a separate labelled line, the same split on metrics-check.mjs's solved box,
//    so the band's sensitivity to the defect is visible. Every other s1 figure is above 0.01.
//  · build.mjs:43 2 dp rounding of x and w — NOT EXPOSED: nothing here reads dist/metrics.json.
//  · congruence.mjs, pixelgrid.mjs, figma.mjs — not used.
//
// RUN TIME on this machine (Apple silicon, node 24, 2026-10-08, the pin, other agents running alongside),
// each census measured alone with a fresh --cache: legs 0.2 s · pairs 12 s (s1, with its solved-box
// cross-check) · pieces 21 s · silh 51 s · cuts 100 s. A full run with no cache: 233 s (under 4 min;
// 585 s once while other heavy jobs shared the CPU);
// with a warm --cache: 0.3 s. The full output is byte-identical with and without the cache. Each section
// costs the censuses it reads:
//   s0 volume-off only · s1 pairs · s2 s2.1 s2.3 pairs · s2.2 legs · s3* pairs · s4.1 pairs · s4.2 s4.3 cuts+pairs ·
//   s4.4 pairs · s5 s5.1 silh+pairs · s5.2 pieces · s5.3 silh+pairs · s5.4 silh+pairs+cuts ·
//   s5.5 s5.6 silh+pairs+cuts · s5.7 pairs · s6 s7 s8 all five.

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as geom from '../geometry.mjs';
import * as M from '../masters.mjs';
import * as angles from './angles.mjs';
import * as radii from './radii.mjs';
import * as raster from './raster.mjs';
import { readSvg, inkBoxOf } from './metrics-check.mjs';

// ── parameters the original card chose (recovered from its scripts; never tuned) ───────────────
export const MASTER_LIST = [24, 20, 16];
export const SEG_ANG_TOL = 8;          // measure.mjs matchSegments: parallel within 8°
export const SEG_SLACK = 0.4;          // … midpoint within half a stroke + 0.4
export const SEG_MIN_LEN = 0.75;       // … segments ≥ 0.75 units at 24, scaled by master/24
export const LEG_MIN_LEN = 1.5;        // an5.mjs: a leg long enough to read, ≥ 1.5 at 24, scaled
export const RATE_CUTS = 16;           // cuts.mjs: 1/16 lattice
export const CUT_MIN_CELLS = 16;       // cuts.mjs: components under 16 cells are flattening noise
export const RIDGE_PICKS = 60;         // cuts.mjs: at most 60 ridge cells refined
export const RATE_SILH = 16;           // silh.mjs: 1/16 lattice
export const ENC_MIN_CELLS = 16;       // silh.mjs: enclosed white under 16 cells dropped
export const DIFF_MIN_CELLS = 8;       // silh.mjs: difference patches under 8 cells dropped
export const RATE_PIECES = 12;         // pieces.mjs: 1/12 lattice
export const PIECE_MIN_CELLS = 9;      // pieces.mjs: components under 9 cells dropped
export const SAME_OUTER = 0.02;        // an6.mjs: outer region "identical" under 0.02 sq units
export const OUTER_DIFF = 0.5;         // an6.mjs: "differ by ≥ 0.5 square units"
export const COUNTER_MIN = 4;          // inline (toolu_019D2YBm…): a counter ≥ 4 wide in both
export const COUNTER_TOL = 0.15;       // … shrink within 0.15 of 2 × (FILLED_WEIGHT − stroke)
export const CUT_MAX = 3;              // an2.mjs: ≤ 3 wide is a cut, wider a counter
export const UNDER_FLOOR = 1.49;       // an2.mjs: "under 1.5" is < 1.49 (lint's g < GAP − 0.01)
export const DERIVED_TOL = 0.01;       // an3/an4: lands on a derived value to 0.01
export const NAMED_CUTS = [1.5, 2, 2.5]; // docs/09:42's three named cut weights (cited, not measured)
// §4.3's ratio buckets, as the document names them (labels it chose to print; their counts are measured)
export const NAMED_RATIOS = { 24: [1, 1.33, 1.67, 2], 20: [1, 1.33, 1.17, 1.67], 16: [1.2, 1.4, 1.6, 2.2, 2.4] };

export const r3 = (n) => Math.round(n * 1000) / 1000;
export const r2 = (n) => Math.round(n * 100) / 100;
const fx = (n, d = 3) => (n == null || !Number.isFinite(n) ? String(n) : String(Number(n.toFixed(d))));
const fc = (n) => n.toLocaleString('en-US');
const pct = (a, b) => `${Math.round((a / b) * 100)}%`;
const tally = (xs) => xs.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});
const uniq = (xs) => [...new Set(xs)];
const nConcepts = (rows) => new Set(rows.map((r) => r.name)).size;
const sorted = (xs) => [...xs].sort();
const say = (...a) => console.log(...a);
const head = (s) => console.log(`\n## ${s}`);

// ── reading one drawing (measure.mjs readFile) ─────────────────────────────────────────────────
const AREA = /<path\b(?=[^>]*stroke="none")(?=[^>]*fill="currentColor")[^>]*\bd="([^"]+)"[^>]*\/>/g;
const STROKE_PATH = /<path\b(?![^>]*stroke="none")[^>]*\bd="([^"]+)"[^>]*\/>/g;

/** One drawing as card 1.8 read it: area paths, stroked paths, and lint's weight rule
 *  (lint.mjs:207-210 — the presence of areas decides the weight, not the name). */
export function parseDrawing(src, name, master) {
  const areas = [...src.matchAll(AREA)].map((m) => m[1]);
  const ds = [...src.matchAll(STROKE_PATH)].map((m) => m[1]);
  const stroke = areas.length ? M.strokeOf(master) : M.weightOf(name, master);
  return { src, name, master, areas, ds, stroke };
}

/** lint.mjs:303-312 — the ink box, unrounded: stroke centrelines grown by half the weight, areas as drawn. */
export function inkOf(f) {
  const half = f.stroke / 2, boxes = [];
  if (f.ds.length) { const b = geom.bbox(f.ds); boxes.push([b.x0 - half, b.y0 - half, b.x1 + half, b.y1 + half]); }
  if (f.areas.length) { const b = geom.bbox(f.areas); boxes.push([b.x0, b.y0, b.x1, b.y1]); }
  if (!boxes.length) return null;
  return { x0: Math.min(...boxes.map((b) => b[0])), y0: Math.min(...boxes.map((b) => b[1])),
           x1: Math.max(...boxes.map((b) => b[2])), y1: Math.max(...boxes.map((b) => b[3])) };
}

/** How far the filled ink stands proud of the outline's, per side (positive = filled is larger). */
export const boxDelta = (oi, fi) => ({ l: oi.x0 - fi.x0, r: fi.x1 - oi.x1, t: oi.y0 - fi.y0, b: fi.y1 - oi.y1 });

/** The `grows:` note, as lint's parseGrowsNote anchors it. */
export function growsOf(src) {
  const m = src.match(/<!--\s*grows:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  const n = m[1].trim().split(/\s+/).map(Number);
  if (n.length !== 4 || n.some(Number.isNaN)) return { bad: true, raw: m[1] };
  return { l: n[0], r: n[1], t: n[2], b: n[3], raw: m[1].trim() };
}

const note = (src, re) => src.match(re)?.slice(1) ?? null;
const normD = (s) => s.replace(/\s*([A-Za-z,])\s*/g, '$1').replace(/\s+/g, ' ').trim();

/** Every straight segment of both kinds of path, with its midpoint. */
function segsOf(f, minLength) {
  const all = [...f.ds.map((d) => ({ d, style: 'stroke' })), ...f.areas.map((d) => ({ d, style: 'area' }))];
  const out = [];
  for (const [pi, p] of all.entries())
    for (const s of angles.segmentsOf(p.d, { minLength }))
      out.push({ ...s, path: pi, style: p.style, mid: [(s.from[0] + s.to[0]) / 2, (s.from[1] + s.to[1]) / 2] });
  return out;
}

/** measure.mjs matchSegments: for every filled straight edge, the outline centreline it offsets —
 *  parallel within `angTol`, midpoint within half a stroke + `slack` of that line, projecting inside it. */
export function matchSegments(o, fl, { angTol = SEG_ANG_TOL, slack = SEG_SLACK, minLength } = {}) {
  const O = segsOf(o, minLength), F = segsOf(fl, minLength);
  const half = o.stroke / 2, rows = [];
  for (const f of F) {
    let best = null;
    for (const s of O) {
      const dAng = Math.min(Math.abs(f.angle - s.angle), 180 - Math.abs(f.angle - s.angle));
      if (dAng > angTol) continue;
      const ex = s.to[0] - s.from[0], ey = s.to[1] - s.from[1], L2 = ex * ex + ey * ey;
      if (!L2) continue;
      const u = ((f.mid[0] - s.from[0]) * ex + (f.mid[1] - s.from[1]) * ey) / L2;
      if (u < -0.15 || u > 1.15) continue;
      const px = s.from[0] + u * ex, py = s.from[1] + u * ey;
      const perp = Math.hypot(f.mid[0] - px, f.mid[1] - py);
      const err = Math.abs(perp - (f.style === 'area' ? half : 0));
      if (err > half + slack) continue;
      const cost = err + dAng * 0.25;
      if (!best || cost < best.cost) best = { cost, s, dAng };
    }
    rows.push(best
      ? { delta: r3(best.dAng), angOut: r3(best.s.angle), angFil: r3(f.angle), lenOut: r3(best.s.length), lenFil: r3(f.length), style: f.style }
      : { unmatched: true, angFil: r3(f.angle), lenFil: r3(f.length), style: f.style, mid: f.mid.map(r3) });
  }
  return rows;
}

/** measure.mjs cornerPairs: each filleted corner of the filled file paired with the nearest outline
 *  corner of the same turn direction (within 12° of turn, within half/sin(interior/2) + 0.6). */
export function cornerPairs(oIcon, flIcon, master) {
  const O = radii.radiiOf(oIcon), F = radii.radiiOf(flIcon);
  const half = M.strokeOf(master) / 2, rows = [];
  for (const c of F.corners) {
    if (c.kind === 'sharp') continue;
    const lim = half / Math.max(0.3, Math.sin((c.interior * Math.PI) / 360)) + 0.6;
    let best = null;
    for (const d of O.corners) {
      if (d.kind === 'sharp' || Math.sign(d.turn) !== Math.sign(c.turn)) continue;
      if (Math.abs(Math.abs(d.turn) - Math.abs(c.turn)) > 12) continue;
      const dist = Math.hypot(d.at[0] - c.at[0], d.at[1] - c.at[1]);
      if (dist > lim) continue;
      if (!best || dist < best.dist) best = { dist, d };
    }
    rows.push({ style: c.style, role: c.role, rFilled: r3(c.radius), rOutline: best ? r3(best.d.radius) : null });
  }
  return rows;
}

/** an4.mjs: which derived value a matched AREA corner lands on, on the 3-dp radii the census stored. */
export function derivedOf(rFilled, rOutline, master) {
  const h = M.strokeOf(master) / 2;
  const dOut = rFilled - (rOutline + h), dIn = rFilled - (rOutline - h);
  const side = Math.abs(dOut) <= Math.abs(dIn) ? 'outer' : 'inner';
  return { side, delta: r3(side === 'outer' ? dOut : dIn) };
}

/** One pair, as measure.mjs recorded it (the fields the analyses read). */
export function pairRecord(oSrc, flSrc, name, master) {
  const o = parseDrawing(oSrc, name, master), fl = parseDrawing(flSrc, `${name}-filled`, master);
  const oi = inkOf(o), fi = inkOf(fl), d = boxDelta(oi, fi);
  const grows = growsOf(flSrc);
  const klass = fl.areas.length ? (fl.ds.length ? 'shape+line' : 'shape-only') : 'line-heavy';
  const minLength = (master / 24) * SEG_MIN_LEN;
  let air = null, airOut = null;
  try { air = geom.facingGap(fl.ds, fl.stroke, fl.areas, { cap: 4 }); } catch { /* recorded as null, as the original did */ }
  try { airOut = geom.facingGap(o.ds, o.stroke, o.areas, { cap: 4 }); } catch { /* ignore */ }
  const oIcon = radii.iconFromSource(oSrc, { file: `${name}.svg` });
  const fIcon = radii.iconFromSource(flSrc, { file: `${name}-filled.svg` });
  let corners = null;
  try { corners = cornerPairs(oIcon, fIcon, master); } catch { /* corner error: none at the pin */ }
  return {
    name, master, klass,
    pathsOut: o.ds.length, pathsFilStroke: fl.ds.length, pathsFilArea: fl.areas.length,
    delta: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, r3(v)])),
    maxDelta: r3(Math.max(...Object.values(d).map(Math.abs))),
    grows, growsCovers: grows && !grows.bad ? ['l', 'r', 't', 'b'].every((k) => Math.abs(d[k] - grows[k]) <= 0.01) : null,
    gapFil: note(flSrc, /<!--\s*gap:\s*([\d.]+)\s*-->/)?.[0] ?? null,
    identical: normD(o.ds.join('|')) === normD(fl.ds.join('|')) && !fl.areas.length,
    segMatch: matchSegments(o, fl, { minLength }),
    corners,
    air: air ? { self: air.self.map((x) => ({ gap: r3(x.gap) })), area: air.area.map((x) => ({ kind: x.kind, gap: r3(x.gap) })) } : null,
    airOutlineSelf: airOut ? airOut.self.map((x) => ({ gap: r3(x.gap) })) : null,
  };
}

// ── the raster censuses (raster.region().covered only — see the defect note) ────────────────────

/** Ink mask on a 1/rate lattice with a one-cell apron, and the air that reaches the apron. */
export function lattice(icon, rate) {
  const reg = raster.regionOf(icon);
  const C = icon.canvas, n = Math.round(C * rate), W = n + 2, step = 1 / rate;
  const ink = new Uint8Array(W * W);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++)
    if (reg.covered((i + 0.5) * step, (j + 0.5) * step)) ink[(j + 1) * W + i + 1] = 1;
  const outside = new Uint8Array(W * W);
  const st = [0]; outside[0] = 1;
  while (st.length) {
    const k = st.pop(), x = k % W, y = (k - x) / W;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = x + dx, b = y + dy;
      if (a < 0 || b < 0 || a >= W || b >= W) continue;
      const t = b * W + a;
      if (ink[t] || outside[t]) continue;
      outside[t] = 1; st.push(t);
    }
  }
  return { reg, ink, outside, W, step, canvas: C };
}

/** 4-connected components of a mask: cell lists. */
function components(mask, W) {
  const seen = new Uint8Array(W * W), out = [];
  for (let k = 0; k < W * W; k++) {
    if (!mask[k] || seen[k]) continue;
    const cells = [], st = [k]; seen[k] = 1;
    while (st.length) {
      const c = st.pop(); cells.push(c);
      const x = c % W, y = (c - x) / W;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const a = x + dx, b = y + dy;
        if (a < 0 || b < 0 || a >= W || b >= W) continue;
        const t = b * W + a;
        if (!mask[t] || seen[t]) continue;
        seen[t] = 1; st.push(t);
      }
    }
    out.push(cells);
  }
  return out;
}

/** cuts.mjs inkGeometry: capsules for strokes (minus half their weight), edges for areas. */
export function inkGeometry(icon) {
  const caps = [], edges = [];
  for (const p of icon.paths) {
    const subs = raster.flatten(p.d, { label: icon.label });
    if (p.kind === 'stroke') {
      const h = p.weight / 2;
      for (const { pts, closed } of subs) {
        for (let i = 0; i + 1 < pts.length; i++) caps.push([...pts[i], ...pts[i + 1], h]);
        if (closed && pts.length > 2) caps.push([...pts.at(-1), ...pts[0], h]);
        if (pts.length === 1) caps.push([...pts[0], ...pts[0], h]);
      }
    } else {
      for (const { pts } of subs)
        for (let i = 0; i < pts.length; i++) edges.push([...pts[i], ...pts[(i + 1) % pts.length], 0]);
    }
  }
  return [...caps, ...edges];
}

/** Exact clearance: distance from (x, y) to the nearest ink, negative inside a stroke. */
export function clearance(x, y, geo) {
  let m = Infinity;
  for (const [ax, ay, bx, by, h] of geo) {
    const ex = bx - ax, ey = by - ay, L = ex * ex + ey * ey;
    const u = L ? Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / L)) : 0;
    const d = Math.hypot(x - ax - u * ex, y - ay - u * ey) - h;
    if (d < m) m = d;
  }
  return m;
}

/** cuts.mjs refine: coordinate descent to the continuous maximum, kept within `leash` of the start. */
export function refine(x, y, geo, step0, leash = Infinity) {
  let best = clearance(x, y, geo), bx = x, by = y;
  for (let step = step0; step > 0.002; step /= 2) {
    let moved = true;
    while (moved) {
      moved = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = bx + dx * step, ny = by + dy * step;
        if (Math.hypot(nx - x, ny - y) > leash) continue;
        const c = clearance(nx, ny, geo);
        if (c > best + 1e-9) { best = c; bx = nx; by = ny; moved = true; }
      }
    }
  }
  return { r: best, at: [bx, by] };
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

/** cuts.mjs cutsOf (after both edits): every enclosed white region, by C23's largest inscribed circle. */
export function enclosedOf(src, label, { rate = RATE_CUTS } = {}) {
  const icon = raster.iconFromText(src, label);
  const L = lattice(icon, rate), { ink, outside, W, step } = L;
  const geo = inkGeometry(icon);
  const white = new Uint8Array(W * W);
  for (let k = 0; k < W * W; k++) white[k] = !ink[k] && !outside[k] ? 1 : 0;
  const out = [];
  let droppedSmall = 0, droppedParity = 0;
  for (const cells of components(white, W)) {
    if (cells.length < CUT_MIN_CELLS) { droppedSmall++; continue; }            // flattening noise, not a cut
    const clear = new Map();
    let bestD = -Infinity, bx = 0, by = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const c of cells) {
      const i = (c % W) - 1, j = ((c - (c % W)) / W) - 1, x = (i + 0.5) * step, y = (j + 0.5) * step;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      const d = clearance(x, y, geo); clear.set(c, d);
      if (d > bestD) { bestD = d; bx = x; by = y; }
    }
    const w = x1 - x0 + step, h = y1 - y0 + step;
    if (2 * bestD > Math.hypot(w, h) + 4 * step) { droppedParity++; continue; }   // parity glitch
    const ridge = [];
    for (const c of cells) {
      const d = clear.get(c);
      let top = true;
      for (const o of [c + 1, c - 1, c + W, c - W]) { const e = clear.get(o); if (e !== undefined && e > d + 1e-12) { top = false; break; } }
      if (top) ridge.push(c);
    }
    const pick = ridge.length <= RIDGE_PICKS ? ridge
      : Array.from({ length: RIDGE_PICKS }, (_, k) => ridge[Math.floor((k * ridge.length) / RIDGE_PICKS)]);
    const widths = pick.map((c) => {
      const i = (c % W) - 1, j = ((c - (c % W)) / W) - 1;
      return 2 * refine((i + 0.5) * step, (j + 0.5) * step, geo, step / 2, step * 1.5).r;
    });
    out.push({ width: r3(median(widths)), widthMax: r3(2 * refine(bx, by, geo, step).r), cells: cells.length,
               bbox: [r3(w), r3(h)] });
  }
  return { regions: out.sort((a, b) => a.width - b.width), droppedSmall, droppedParity };
}

/** silh.mjs masks: the ink, and the outer region O = ink ∪ every white region the ink encloses. */
function masks(src, label, rate) {
  const icon = raster.iconFromText(src, label);
  const L = lattice(icon, rate);
  const O = new Uint8Array(L.W * L.W);
  for (let k = 0; k < O.length; k++) O[k] = L.ink[k] || !L.outside[k] ? 1 : 0;
  return { ...L, O, icon };
}

/** silh.mjs comps: components with area and bbox, largest first. */
function compsArea(mask, W, step) {
  return components(mask, W).map((cells) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const c of cells) { const x = c % W, y = (c - x) / W; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return { area: r3(cells.length * step * step), cells: cells.length,
             bbox: [r3((x1 - x0 + 1) * step), r3((y1 - y0 + 1) * step)] };
  }).sort((a, b) => b.area - a.area);
}

/** silh.mjs: one pair's outer regions, ink areas, enclosed white and duplicated area+stroke paths. */
export function silhouetteOf(oSrc, flSrc, label = '', { rate = RATE_SILH } = {}) {
  const A = masks(oSrc, `${label} outline`, rate), B = masks(flSrc, `${label} filled`, rate);
  const W = A.W, step = A.step, cell = step * step, N = W * W;
  const aOnly = new Uint8Array(N), bOnly = new Uint8Array(N);
  let ao = 0, bo = 0, both = 0, aA = 0, aB = 0, inkA = 0, inkB = 0;
  for (let k = 0; k < N; k++) {
    const a = A.O[k], b = B.O[k];
    if (a) aA++;
    if (b) aB++;
    if (a && b) both++; else if (a) { aOnly[k] = 1; ao++; } else if (b) { bOnly[k] = 1; bo++; }
    inkA += A.ink[k]; inkB += B.ink[k];
  }
  const enc = (X) => compsArea(Uint8Array.from(X.O, (v, k) => (v && !X.ink[k] ? 1 : 0)), W, step).filter((c) => c.cells >= ENC_MIN_CELLS);
  const encA = enc(A), encB = enc(B);
  const areaDs = B.icon.paths.filter((p) => p.kind === 'area').map((p) => normD(p.d));
  const strokeDs = B.icon.paths.filter((p) => p.kind === 'stroke').map((p) => normD(p.d));
  return {
    outlineOnly: r3(ao * cell), filledOnly: r3(bo * cell), iou: r3(both / (aA + aB - both)),
    diffOut: compsArea(aOnly, W, step).filter((c) => c.cells >= DIFF_MIN_CELLS).slice(0, 4),
    diffFil: compsArea(bOnly, W, step).filter((c) => c.cells >= DIFF_MIN_CELLS).slice(0, 4),
    inkOut: r3(inkA * cell), inkFil: r3(inkB * cell),
    encOutAreas: encA.map((c) => c.area), encFilAreas: encB.map((c) => c.area),
    dupPaths: areaDs.filter((d) => strokeDs.includes(d)).length,
  };
}

/** pieces.mjs: 8-connected ink components on a 1/12 lattice, ignoring any under 9 cells. */
export function piecesOf(src, label = '', { rate = RATE_PIECES } = {}) {
  const icon = raster.iconFromText(src, label);
  const reg = raster.regionOf(icon);
  const n = Math.round(icon.canvas * rate), W = n + 2, step = 1 / rate;
  const ink = new Uint8Array(W * W);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++)
    if (reg.covered((i + 0.5) * step, (j + 0.5) * step)) ink[(j + 1) * W + i + 1] = 1;
  const seen = new Uint8Array(W * W);
  let count = 0;
  for (let k = 0; k < W * W; k++) {
    if (!ink[k] || seen[k]) continue;
    const st = [k]; seen[k] = 1; let c = 0;
    while (st.length) {
      const q = st.pop(); c++;
      const x = q % W, y = (q - x) / W;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const a = x + dx, b = y + dy;
        if (a < 0 || b < 0 || a >= W || b >= W) continue;
        const t = b * W + a;
        if (!ink[t] || seen[t]) continue;
        seen[t] = 1; st.push(t);
      }
    }
    if (c >= PIECE_MIN_CELLS) count++;
  }
  return count;
}

/** an5.mjs: a line-heavy pair's legs, paired in document order (same segment structure only). */
export function legRow(oSrc, flSrc, name, master) {
  const O = radii.iconFromSource(oSrc, { file: `${name}.svg` }), F = radii.iconFromSource(flSrc, { file: `${name}-filled.svg` });
  if (F.hasAreas) return null;                                         // line-heavy only
  const osegs = O.paths.flatMap((p) => angles.segmentsOf(p.d));
  const fsegs = F.paths.flatMap((p) => angles.segmentsOf(p.d));
  if (osegs.length !== fsegs.length || !osegs.length) return null;    // same structure only
  const pairs = osegs.map((s, i) => ({ o: s, f: fsegs[i] })).filter((p) => Math.min(p.o.length, p.f.length) >= (master / 24) * LEG_MIN_LEN);
  if (!pairs.length) return null;
  const dev = pairs.map((p) => ({ dAng: r3(Math.min(Math.abs(p.o.angle - p.f.angle), 180 - Math.abs(p.o.angle - p.f.angle))), lf: r3(p.f.length) }));
  const fb = radii.radiiOf(F).corners.filter((c) => c.role === 'bend' && c.kind !== 'sharp');
  return { name, master, worst: Math.max(...dev.map((d) => d.dAng)), dev, fbend: fb.map((c) => r3(c.radius)),
           bendMinFil: M.bendMin(M.FILLED_WEIGHT[master]) };
}

// ── the pin and its censuses ───────────────────────────────────────────────────────────────────

export const CACHE_FORMAT = 'filled-probe/1';
/** A digest of the pin's drawings: every src/icons/{24,20,16} file name and its content. A cache is
 *  stamped with it and refused for any other pin. */
export function pinDigest(dir) {
  const h = createHash('sha256');
  for (const m of MASTER_LIST) for (const f of readdirSync(join(dir, String(m))).filter((x) => x.endsWith('.svg')).sort())
    h.update(`${m}/${f}\0`).update(readFileSync(join(dir, String(m), f))).update('\0');
  return h.digest('hex');
}

export function openPin(pin, { cache = null } = {}) {
  const dir = join(pin, 'src/icons');
  for (const m of MASTER_LIST) if (!existsSync(join(dir, String(m)))) throw new Error(`no ${join(dir, String(m))}`);
  const names = readdirSync(join(dir, '24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg'))
    .map((f) => f.replace(/\.svg$/, '')).sort();
  const text = (m, file) => readFileSync(join(dir, String(m), file), 'utf8');
  const memo = {};
  const digest = cache ? pinDigest(dir) : null;
  const lazy = (key, fn) => {
    if (memo[key]) return memo[key];
    const file = cache ? join(cache, `filled-probe-${key}.json`) : null;
    if (file && existsSync(file)) {
      const c = JSON.parse(readFileSync(file, 'utf8'));
      if (c?.format !== CACHE_FORMAT || c.pin !== digest)
        throw new Error(`cache ${file} was not made from this pin (or by this version of the probe); name an empty --cache directory`);
      return (memo[key] = c.data);
    }
    const v = fn();
    if (file) { mkdirSync(cache, { recursive: true }); writeFileSync(file, JSON.stringify({ format: CACHE_FORMAT, pin: digest, data: v })); }
    return (memo[key] = v);
  };
  const each = (fn) => { const out = []; for (const name of names) for (const m of MASTER_LIST) { const v = fn(name, m); if (v) out.push(v); } return out; };
  const P = {
    pin, dir, names, text,
    pairs: () => lazy('pairs', () => each((n, m) => pairRecord(text(m, `${n}.svg`), text(m, `${n}-filled.svg`), n, m))),
    cuts: () => lazy('cuts', () => each((n, m) => ({ name: n, master: m, stroke: M.strokeOf(m), ...enclosedOf(text(m, `${n}-filled.svg`), `${m}/${n}-filled`) }))),
    silh: () => lazy('silh', () => each((n, m) => ({ name: n, master: m, ...silhouetteOf(text(m, `${n}.svg`), text(m, `${n}-filled.svg`), `${m}/${n}`) }))),
    pieces: () => lazy('pieces', () => each((n, m) => ({ name: n, master: m, o: piecesOf(text(m, `${n}.svg`), `${m}/${n}`), f: piecesOf(text(m, `${n}-filled.svg`), `${m}/${n}-filled`) }))),
    legs: () => lazy('legs', () => each((n, m) => legRow(text(m, `${n}.svg`), text(m, `${n}-filled.svg`), n, m))),
  };
  P.klass = () => (memo.klassMap ??= new Map(P.pairs().map((d) => [`${d.master}/${d.name}`, d.klass])));
  return P;
}

// ── derived views shared by several sections ───────────────────────────────────────────────────

/** an4.mjs rows: matched AREA corners with the derived value they land on. */
export function areaCornersOf(pairs) {
  const rows = [];
  for (const d of pairs) if (d.corners) for (const c of d.corners)
    if (c.style === 'area' && c.rOutline !== null) rows.push({ ...c, name: d.name, master: d.master, ...derivedOf(c.rFilled, c.rOutline, d.master) });
  return rows;
}
const areaCorners = (P) => areaCornersOf(P.pairs());
/** Matched filled straight edges with their deviation and displacement (inline toolu_018XwHRZ…). */
function matchedEdges(P) {
  const rows = [];
  for (const d of P.pairs()) for (const s of d.segMatch) if (!s.unmatched)
    rows.push({ ...s, name: d.name, master: d.master, klass: d.klass, off: r3(s.lenFil * Math.sin((s.delta * Math.PI) / 180)) });
  return rows;
}
/** an2.mjs: every enclosed region with its pair's class and the outline stroke. */
function regions(P) {
  const kl = P.klass(), out = [];
  for (const c of P.cuts()) for (const g of c.regions) out.push({ ...g, name: c.name, master: c.master, stroke: c.stroke, klass: kl.get(`${c.master}/${c.name}`) });
  return out;
}
const bucket8 = (w) => Math.round(w * 8) / 8;
/** inline toolu_019D2YBm…: counters ≥ 4 wide in both whose diameter shrank by 2 × (FILLED_WEIGHT − stroke). */
export function ringRowsOf(silh, kl = new Map()) {
  const out = [];
  for (const r of silh) {
    if (!r.encOutAreas.length || !r.encFilAreas.length) continue;
    const dO = 2 * Math.sqrt(r.encOutAreas[0] / Math.PI), dF = 2 * Math.sqrt(r.encFilAreas[0] / Math.PI);
    if (dF < COUNTER_MIN) continue;
    const want = 2 * (M.FILLED_WEIGHT[r.master] - M.strokeOf(r.master));
    out.push({ name: r.name, master: r.master, dO: r3(dO), dF: r3(dF), shrink: r3(dO - dF), want, klass: kl.get(`${r.master}/${r.name}`),
               hit: Math.abs(dO - dF - want) < COUNTER_TOL });
  }
  return out;
}
const ringRows = (P) => ringRowsOf(P.silh(), P.klass());
const silhRows = (P) => { const kl = P.klass(); return P.silh().map((r) => ({ ...r, klass: kl.get(`${r.master}/${r.name}`) })); };
const narrowestAir = (d) => {
  const f = Math.min(...[...d.air.self.map((x) => x.gap), ...d.air.area.map((x) => x.gap)], Infinity);
  const o = Math.min(...d.airOutlineSelf.map((x) => x.gap), Infinity);
  return { f, o };
};
export function closesAirOf(pairs) {
  const out = [];
  for (const d of pairs) {
    if (!d.air || !d.airOutlineSelf) continue;
    const { f, o } = narrowestAir(d);
    if (Number.isFinite(f) && Number.isFinite(o) && f < o - 0.01) out.push({ name: d.name, master: d.master, filled: f, outline: o, klass: d.klass });
  }
  return out.sort((a, b) => (a.filled - a.outline) - (b.filled - b.outline));   // stable, as an2.mjs
}
const closesAir = (P) => closesAirOf(P.pairs());
/** §1's split of the pairs by the largest side difference (3 dp): exactly 0, the 0.0005–0.01 band lint
 *  cannot see, and over 0.01 (declared by `grows:` or not). */
export function boxBands(pairs) {
  const off = pairs.filter((d) => d.maxDelta > 0.01);
  return { exact: pairs.filter((d) => d.maxDelta <= 0.0005), tiny: pairs.filter((d) => d.maxDelta > 0.0005 && d.maxDelta <= 0.01),
           off, declared: off.filter((d) => d.grows), undeclared: off.filter((d) => !d.grows) };
}
/** an5.mjs `fam`: a chevron's shape variant from its name. */
export const chevronVariant = (n) => n.replace(/^chevrons?-(up-down|down-up|up|down|left|right)/, 'chevron')
  .replace(/^chevron/, '').replace(/-(small|large)$/, '') || '-1(classic)';
const weightStep = (m) => M.FILLED_WEIGHT[m] - M.strokeOf(m);

// ── sections ───────────────────────────────────────────────────────────────────────────────────

const S = {};

S.s0 = (P) => {
  head('§0 Method and resolution (and the header\'s population)');
  const n = P.names.length;
  say(`pin: ${fc(n)} concepts × 3 masters × 2 styles = ${fc(n * 6)} files, ${fc(n * 3)} pairs`);
  say(`lattices (parameters): outer region 1/${RATE_SILH} · enclosed census 1/${RATE_CUTS}, components under ${CUT_MIN_CELLS} cells dropped · pieces 1/${RATE_PIECES}, components under ${PIECE_MIN_CELLS} cells dropped`);
  const v = P.names.includes('volume-off') ? MASTER_LIST.map((m) => ({ master: m, ...enclosedOf(P.text(m, 'volume-off-filled.svg'), `${m}/volume-off-filled`) })) : [];
  for (const c of v) say(`volume-off-filled at ${c.master}: flattening slivers dropped by the enclosed census: ${c.droppedSmall + c.droppedParity} (under ${CUT_MIN_CELLS} cells ${c.droppedSmall}, wider than their own footprint ${c.droppedParity})`);
};

S.s1 = (P) => {
  head('§1 The ink box — the one thing already checked, and the band under it');
  const D = P.pairs(), off = D.filter((d) => d.maxDelta > 0.01);
  const g = D.filter((d) => d.grows), bad = g.filter((d) => !d.growsCovers);
  say('| | pairs | concepts |');
  say(`| Pairs measured | ${fc(D.length)} | ${fc(nConcepts(D))} |`);
  say(`| Any side differs by > 0.01 | ${off.length} | ${nConcepts(off)} |`);
  say(`| …carrying a \`grows:\` note | ${off.filter((d) => d.grows).length} | ${nConcepts(off.filter((d) => d.grows))} |`);
  say(`| …note matches the drawings to 0.01 | ${off.filter((d) => d.growsCovers).length} | ${nConcepts(off.filter((d) => d.growsCovers))} |`);
  say(`| Undeclared differences | ${off.filter((d) => !d.grows).length} | ${nConcepts(off.filter((d) => !d.grows))} |`);
  say(`| Notes that do not match the drawings | ${bad.length} | — |`);
  const keys = {};
  for (const d of g) (keys[`${d.master}|${d.grows.raw}`] ??= []).push(d.name);
  say(`\`grows:\` population: ${g.length} files on ${nConcepts(g)} concepts, ${Object.keys(keys).length} distinct note strings (per master)`);
  say('| Master | Note (L R T B) | n | Concepts |');
  const ordered = Object.entries(keys).sort((a, b) => Number(b[0].split('|')[0]) - Number(a[0].split('|')[0]) || a[0].localeCompare(b[0]));
  for (const [k, v] of ordered) { const [m, raw] = k.split('|'); say(`| ${m} | \`${raw}\` | ${v.length} | ${sorted(v).map((x) => `\`${x}\``).join(' ')} |`); }
  const half = Object.fromEntries(MASTER_LIST.map((m) => [m, weightStep(m) / 2]));
  const onHalf = g.filter((d) => ['l', 'r', 't', 'b'].every((s) => d.grows[s] === 0 || d.grows[s] === half[d.master]));
  say(`half the master's weight step: ${MASTER_LIST.map((m) => half[m]).join(' · ')} — notes whose every non-zero value equals it: ${onHalf.length} of ${g.length}` +
      ` (the others: ${sorted(uniq(g.filter((d) => !onHalf.includes(d)).map((d) => `${d.master}/${d.name}`))).join(' ')})`);
  // the grep the document reports
  let grep = 0, grepOutline = [];
  for (const m of MASTER_LIST) for (const f of readdirSync(join(P.dir, String(m)))) {
    if (!f.endsWith('.svg')) continue;
    if (P.text(m, f).includes('grows:')) { grep++; if (!f.endsWith('-filled.svg')) grepOutline.push(`${m}/${f.replace(/\.svg$/, '')}`); }
  }
  say(`a grep for \`grows:\` finds ${grep} files; outline files among them: ${grepOutline.length} (${sorted(grepOutline).join(' ')})`);
  // the band
  const { tiny, exact } = boxBands(D);
  const big = tiny.filter((d) => d.maxDelta >= 0.004);
  say(`the band lint cannot see (0.0005–0.01): ${tiny.length} pairs on ${nConcepts(tiny)} concepts; at or above 0.004: ${big.length}`);
  say(`  by master: ${MASTER_LIST.map((m) => `${tiny.filter((d) => d.master === m).length} at ${m}`).join(', ')}`);
  say(`  concepts at or above 0.004: ${sorted(uniq(big.map((d) => d.name))).join(' ')}`);
  const chev = uniq(big.map((d) => d.name)).filter((n) => /^chevron-/.test(n));
  const parts = (re) => uniq(chev.map((n) => n.match(re)?.[1] ?? '')).length;
  say(`  single chevrons among them: ${chev.length} = ${parts(/^chevron-\w+(-\d)?/)} shapes × ${parts(/^chevron-(\w+)/)} directions × ${parts(/(-small|-large)$/)} sizes (the default counted as one); chevrons-up-down: ${uniq(big.map((d) => d.name)).filter((n) => /^chevrons-/.test(n)).length}`);
  say('| Band | pairs |');
  say(`| exactly 0 on all four sides | ${fc(exact.length)} |`);
  say(`| 0.0005–0.01 (invisible to lint) | ${tiny.length} |`);
  say(`| > 0.01, declared | ${off.filter((d) => d.grows).length} |`);
  say(`| > 0.01, undeclared | ${off.filter((d) => !d.grows).length} |`);
  const top = Math.max(...tiny.map((d) => d.maxDelta), 0);
  say(`largest in the band: ${fx(top)} (${sorted(uniq(tiny.filter((d) => d.maxDelta === top).map((d) => `${d.master}/${d.name}`))).join(' ')}); share of the set in the band: ${pct(tiny.length, D.length)}`);
  // defect cross-check: the same split on metrics-check.mjs's solved box
  let e = 0, t = 0, o = 0;
  for (const d of D) {
    const a = inkBoxOf(readSvg(P.text(d.master, `${d.name}.svg`))), b = inkBoxOf(readSvg(P.text(d.master, `${d.name}-filled.svg`)));
    const mx = r3(Math.max(Math.abs(a.x0 - b.x0), Math.abs(b.x1 - a.x1), Math.abs(a.y0 - b.y0), Math.abs(b.y1 - a.y1)));
    if (mx <= 0.0005) e++; else if (mx <= 0.01) t++; else o++;
  }
  say(`[defect cross-check — NOT the document's figure] on metrics-check.mjs's solved box instead of bbox(): exactly 0 ${fc(e)} · 0.0005–0.01 ${t} · > 0.01 ${o}`);
};

S.s2 = (P) => {
  head('§2 Angles — the same line, drawn twice');
  const E = matchedEdges(P);
  say(`${fc(E.length)} filled straight edges matched to the outline centreline they offset.`);
  say('| Deviation | readings | pairs | concepts |');
  for (const t of [0.1, 0.5, 1, 2]) {
    const xs = E.filter((s) => s.delta > t);
    const pairs = uniq(xs.map((s) => `${s.master}/${s.name}`));
    say(`| > ${t}° | ${xs.length} | ${pairs.length} | ${nConcepts(xs)} |`);
  }
  const x1 = E.filter((s) => s.delta > 0.1), byK = tally(x1.map((s) => s.klass)), byM = tally(x1.map((s) => s.master));
  say(`By class (readings > 0.1°): line-heavy ${byK['line-heavy'] ?? 0} · shape-only ${byK['shape-only'] ?? 0} · shape+line ${byK['shape+line'] ?? 0}.`);
  say(`By master: ${MASTER_LIST.map((m) => `${m} → ${byM[m] ?? 0}`).join(' · ')}.`);
};

S['s2.1'] = (P) => {
  head('§2.1 What the deviation costs in pixels');
  const E = matchedEdges(P).filter((s) => s.delta > 0.1).sort((a, b) => b.off - a.off);   // stable: census order on ties, as the original
  const o5 = E.filter((s) => s.off > 0.5).length, o25 = E.filter((s) => s.off > 0.25).length;
  say('| Displacement | readings |');
  say(`| > 0.5 px | ${o5} |`);
  say(`| > 0.25 px | ${o25} |`);
  say(`| the other ${E.length - o25} | under 0.25 px |`);
  say('| px | master | concept | deviation | over |');
  const seen = new Set();
  for (const r of E) {
    const k = `${r.master}/${r.name}`;
    if (seen.has(k)) continue; seen.add(k);
    if (r.off < 0.2) continue;
    say(`| ${fx(r.off)} | ${r.master} | \`${r.name}\` | ${fx(r.delta)}° | ${fx(r.lenFil)} |`);
  }
};

S['s2.2'] = (P) => {
  head('§2.2 The bent-mark leg angle — C10 / C12, measured');
  const R = P.legs();
  const held = R.filter((r) => r.worst <= 0.01);
  const moved = R.filter((r) => r.worst > 0.01);
  say(`${R.length} line-heavy pairs have the same segment structure in both styles and a leg ≥ ${LEG_MIN_LEN} units (scaled). Held to 0.01° in ${held.length}; moves in ${moved.length} pairs on ${nConcepts(moved)} concepts.`);
  say('| threshold | pairs | concepts |');
  for (const t of [0.01, 0.1, 0.5, 1, 2]) { const xs = R.filter((r) => r.worst > t); say(`| > ${t}° | ${xs.length} | ${nConcepts(xs)} |`); }
  const ch = R.filter((r) => /^chevron/.test(r.name));
  say(`Chevrons (${nConcepts(ch)} concepts, ${ch.length} pairs):`);
  say('| master | held to 0.01° | worst | mean worst | filled weight step |');
  for (const m of MASTER_LIST) {
    const xs = ch.filter((r) => r.master === m);
    say(`| ${m} | ${xs.filter((r) => r.worst <= 0.01).length} / ${xs.length} | ${fx(Math.max(...xs.map((r) => r.worst)))}° | ${fx(r3(xs.reduce((s, r) => s + r.worst, 0) / xs.length))}° | +${weightStep(m)} |`);
  }
  say('By shape variant, maximum deviation:');
  say('| variant | 24 | 20 | 16 |');
  const vs = sorted(uniq(ch.map((r) => chevronVariant(r.name))));
  for (const v of vs) say(`| ${v} | ${MASTER_LIST.map((m) => `${fx(Math.max(...ch.filter((r) => r.master === m && chevronVariant(r.name) === v).map((r) => r.worst)))}°`).join(' | ')} |`);
  say('C12 filled bend radii by variant (radius ×readings):');
  for (const v of vs) say(`  ${v}: ${MASTER_LIST.map((m) => `${m} ${Object.entries(tally(ch.filter((r) => r.master === m && chevronVariant(r.name) === v).flatMap((r) => r.fbend))).sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([k, n]) => `${k}×${n}`).join(' ')}`).join(' · ')}`);
  const fb = R.filter((r) => r.fbend.length).flatMap((r) => r.fbend.map((v) => ({ v, m: r.master, name: r.name, min: r.bendMinFil })));
  say(`an5's tally of every line-heavy filled bend radius (master:radius ×readings, top 24): ${Object.entries(tally(fb.map((x) => `${x.m}:${x.v}`))).sort((a, b) => b[1] - a[1]).slice(0, 24).map(([k, n]) => `${k}×${n}`).join(' ')}`);
  say(`Filled bend radius against C10's floor (${fb.length} readings, line-heavy bends):`);
  say('| | n |');
  say(`| exactly at the filled minimum (FILLED_WEIGHT/2 = ${MASTER_LIST.map((m) => M.bendMin(M.FILLED_WEIGHT[m])).join(' · ')}) | ${fb.filter((x) => Math.abs(x.v - x.min) <= 0.01).length} |`);
  say(`| between the minimum and 2× it | ${fb.filter((x) => x.v > x.min + 0.01 && x.v <= 2 * x.min + 0.01).length} |`);
  const over = fb.filter((x) => x.v > 2 * x.min + 0.01);
  say(`| above the 2× cap | ${over.length} — ${uniq(over.map((x) => `${x.m}/${x.name} r${x.v}`)).join(' · ')} |`);
  say(`| below the minimum | ${fb.filter((x) => x.v < x.min - 0.01).length} |`);
};

S['s2.3'] = (P) => {
  head('§2.3 A filled edge with no outline counterpart');
  const un = [];
  for (const d of P.pairs()) for (const s of d.segMatch) if (s.unmatched && s.lenFil >= 1) un.push({ ...s, name: d.name, klass: d.klass });
  const k = tally(un.map((s) => s.klass));
  say(`${un.length} filled straight edges ≥ 1 unit long, on ${nConcepts(un)} concepts, are parallel to no outline centreline. By class: shape-only ${k['shape-only'] ?? 0} · shape+line ${k['shape+line'] ?? 0} · line-heavy ${k['line-heavy'] ?? 0}.`);
  say(sorted(uniq(un.map((s) => s.name))).map((n) => `\`${n}\``).join(' '));
};

S.s3 = (P) => {
  head('§3 Corner radii — the derived relation, and where it fails');
  const all = P.pairs().flatMap((d) => d.corners ?? []);
  const rows = areaCorners(P), ok = rows.filter((r) => Math.abs(r.delta) <= DERIVED_TOL), off = rows.filter((r) => Math.abs(r.delta) > DERIVED_TOL);
  say(`${fc(all.length)} filleted corners read in filled files — ${fc(all.filter((c) => c.style === 'area').length)} of them on area paths — ${fc(all.filter((c) => c.style === 'stroke').length)} on strokes. ${fc(rows.length)} area corners matched an outline corner.`);
  say('| | n | share |');
  say(`| Land on a derived value to 0.01 | ${fc(ok.length)} | ${pct(ok.length, rows.length)} |`);
  for (const m of MASTER_LIST) { const xs = rows.filter((r) => r.master === m); const k = xs.filter((r) => Math.abs(r.delta) <= DERIVED_TOL).length; say(`| ${m} | ${fc(k)} / ${fc(xs.length)} | ${pct(k, xs.length)} |`); }
  say(`| Land on neither | ${off.length} corners, ${nConcepts(off)} concepts | ${pct(off.length, rows.length)} |`);
  say(`Outer offset in ${fc(rows.filter((r) => r.side === 'outer').length)} cases, inner in ${rows.filter((r) => r.side === 'inner').length}.`);
};

/** The §3.1 groups: the document's three rows, at 16, by signed delta (the inline command grouped by delta, not side). */
const S31_ROWS = [{ label: '+0.125', delta: 0.125 }, { label: '−0.125', delta: -0.125 }, { label: '+0.25', delta: 0.25 }];
S['s3.1'] = (P) => {
  head('§3.1 The 1.5-era offset left behind at 16 — the biggest group');
  const at16 = areaCorners(P).filter((r) => r.master === 16 && Math.abs(r.delta) > DERIVED_TOL);
  say(`16 filled contour corners off a derived value: ${at16.length}`);
  say('| delta | corners | concepts | sides | names |');
  const inRows = [];
  for (const g of S31_ROWS) {
    const xs = at16.filter((r) => Math.abs(r.delta - g.delta) < 0.002);
    inRows.push(...xs);
    const sides = tally(xs.map((r) => r.side));
    say(`| ${g.label} | ${xs.length} | ${nConcepts(xs)} | outer ${sides.outer ?? 0} · inner ${sides.inner ?? 0} | ${sorted(uniq(xs.map((r) => r.name))).map((n) => `\`${n}\``).join(' ')} |`);
  }
  say(`the three rows together: ${inRows.length} corners on ${nConcepts(inRows)} concepts (16 master only)`);
  const h125 = inRows.filter((r) => Math.abs(Math.abs(r.delta) - 0.125) < 0.002);
  say(`  of which |delta| = 0.125 (a 0.75 offset instead of 0.625): ${h125.length} corners, ${nConcepts(h125)} concepts`);
  // an3.mjs's `derived` = (filled radius − half the outline stroke) − the outline radius: the OUTER relation only
  const loose = areaCorners(P).filter((r) => r3(r.rFilled - M.strokeOf(r.master) / 2 - r.rOutline) > 0.06);
  say(`[diagnostic — an3's line, a different definition] matched area corners LOOSER than the outer relation by > 0.06, all masters: ${loose.length} corners, ${nConcepts(loose)} concepts`);
};

/** The §3.2 rows, as the document defines them (master → delta), for corners off a derived value. */
const S32_ROWS = [
  { label: '−0.75 / −0.75 / −0.625 (24 / 20 / 16)', test: (r) => (r.master !== 16 && r.delta === -0.75) || (r.master === 16 && r.delta === -0.625) },
  { label: '−0.25 inner at 24', test: (r) => r.master === 24 && r.delta === -0.25 },
  { label: '−0.12 inner at 20', test: (r) => r.master === 20 && r.delta === -0.12 },
  { label: '−0.25 inner at 16', test: (r) => r.master === 16 && r.delta === -0.25 },
  { label: '+0.5 / +0.25 / +0.5 (24 / 20 / 16)', test: (r) => (r.master !== 20 && r.delta === 0.5) || (r.master === 20 && r.delta === 0.25) },
  { label: '+1.5 (24, 20, 16)', test: (r) => r.delta === 1.5 },
  { label: '−0.074 (24, 20)', test: (r) => r.delta === -0.074 },
  { label: 'free-curve residue, under 0.03 off', test: (r) => Math.abs(r.delta) < 0.03 },
];
S['s3.2'] = (P) => {
  head('§3.2 The rest of the corners on neither derived value');
  const off = areaCorners(P).filter((r) => Math.abs(r.delta) > DERIVED_TOL);
  const rest = off.filter((r) => !(r.master === 16 && S31_ROWS.some((g) => Math.abs(r.delta - g.delta) < 0.002)));
  say(`off a derived value: ${off.length}; outside §3.1's three rows: ${rest.length}`);
  say('| delta | corners | concepts | deltas seen | filled radii seen |');
  let used = 0;
  for (const g of S32_ROWS) {
    const xs = rest.filter(g.test); used += xs.length;
    say(`| ${g.label} | ${xs.length} | ${sorted(uniq(xs.map((r) => r.name))).map((n) => `\`${n}\``).join(' ')} (${nConcepts(xs)}) | ${uniq(xs.map((r) => `${r.master}:${r.delta}`)).sort().join(' ')} | ${uniq(xs.map((r) => `${r.master}:r${r.rFilled}`)).sort().join(' ')} |`);
  }
  say(`rows account for ${used} of ${rest.length}`);
};

S['s3.3'] = (P) => {
  head('§3.3 The corner vocabulary only the filled style has');
  const un = [];
  for (const d of P.pairs()) for (const c of d.corners ?? []) if (c.style === 'area' && c.rOutline === null && c.role !== 'ambiguous') un.push({ ...c, name: d.name, master: d.master });
  say(`${fc(un.length)} filled contour corners on ${nConcepts(un)} concepts have no outline counterpart at all.`);
  const t = tally(un.map((r) => `${r.master}:${r.rFilled}`));
  const at = (m, r) => t[`${m}:${r}`] ?? '—';
  say('| radius | n (24 · 20 · 16) |');
  for (const [l, rs] of [['0.5', [0.5, 0.5, 0.5]], ['0.625', [0.625, 0.625, 0.625]], ['0.75', [0.75, 0.75, 0.75]], ['0.25', [0.25, 0.25, 0.25]], ['2.25 / 2.75 / 2.125', [2.25, 2.75, 2.125]], ['3.25 / 1.5 / 1.625', [3.25, 1.5, 1.625]]])
    say(`| ${l} | ${MASTER_LIST.map((m, i) => at(m, rs[i])).join(' · ')} |`);
  say(`most frequent radius per master: ${MASTER_LIST.map((m) => { const e = Object.entries(t).filter(([k]) => k.startsWith(`${m}:`)).sort((a, b) => b[1] - a[1]).slice(0, 6); return `${m}: ${e.map(([k, n]) => `${k.split(':')[1]}×${n}`).join(' ')}`; }).join(' | ')}`);
  const cnt = tally(un.map((r) => r.name));
  say(`Heaviest users: ${Object.entries(cnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([k, v]) => `\`${k}\` ×${v}`).join(' · ')}`);
  say(`r0.5 used ${MASTER_LIST.reduce((s, m) => s + (t[`${m}:0.5`] ?? 0), 0)} times`);
};

S['s4.1'] = (P) => {
  head('§4.1 What lint sees — facingGap on the filled drawings');
  const air = [];
  for (const d of P.pairs()) if (d.air) for (const a of d.air.area) air.push({ ...a, name: d.name, master: d.master, gapNote: d.gapFil });
  say(`${fc(air.length)} exact readings, the narrowest span of each kind per file:`);
  say('| kind | n | distribution (1/8 buckets) |');
  for (const k of ['cut', 'separation', 'notch', 'line']) {
    const xs = air.filter((a) => a.kind === k), b = tally(xs.map((x) => bucket8(x.gap)));
    say(`| ${k} | ${xs.length} | ${Object.entries(b).sort((p, q) => p[0] - q[0]).map(([v, n]) => `${v}×${n}`).join(' · ')} |`);
  }
  const under = air.filter((x) => x.gap < UNDER_FLOOR).sort((a, b) => a.gap - b.gap || a.master - b.master || a.name.localeCompare(b.name));
  const noted = under.filter((x) => x.gapNote), bare = under.filter((x) => !x.gapNote);
  say(`readings under 1.5: ${under.length}; with a \`gap:\` note ${noted.length}: ${uniq(noted.map((x) => `${x.master}/${x.name} ${x.kind} ${x.gap} (gap: ${x.gapNote})`)).join(' · ')}`);
  say(`  without a note: ${bare.length} readings on ${nConcepts(bare)} concepts — ${sorted(uniq(bare.map((x) => x.name))).join(' ')}`);
  const vo = air.filter((x) => x.name === 'volume-off' && x.kind === 'line');
  say(`  volume-off (line): ${MASTER_LIST.map((m) => vo.filter((x) => x.master === m).map((x) => `${x.gap} at ${m}, gap: ${x.gapNote}`).join('')).join(' · ')}`);
  say(`  undeclared readings under 1.5 outside the sort-* family: ${bare.filter((x) => !/^sort-(alpha|numeric)-/.test(x.name)).length}`);
};

S['s4.2'] = (P) => {
  head('§4.2 What lint cannot see — enclosed counters under 1.5');
  const A = regions(P), byM = tally(A.map((a) => a.master));
  say(`${A.length} enclosed white regions in ${uniq(A.map((a) => `${a.master}/${a.name}`)).length} filled files across ${nConcepts(A)} concepts (${MASTER_LIST.map((m) => `${byM[m] ?? 0} at ${m}`).join(' · ')}); ${A.filter((a) => a.width <= CUT_MAX).length} are ${CUT_MAX} units or narrower, ${A.filter((a) => a.width > CUT_MAX).length} wider.`);
  const D = new Map(P.pairs().map((d) => [`${d.master}/${d.name}`, d]));
  const under = A.filter((a) => a.width <= CUT_MAX && a.width < UNDER_FLOOR);
  const groups = new Map();
  for (const a of under.sort((x, y) => x.width - y.width)) {   // stable, as an2.mjs
    const k = `${a.width}|${a.master}|${a.bbox.join('x')}|${D.get(`${a.master}/${a.name}`)?.gapFil ?? 'none'}`;
    if (!groups.has(k)) groups.set(k, []); groups.get(k).push(a.name);
  }
  say('| width | master | concept | footprint | `gap:` note |');
  for (const [k, v] of groups) {
    const [w, m, bb, gn] = k.split('|'), c = tally(v);
    say(`| ${w} | ${m} | ${Object.entries(c).map(([n, x]) => `\`${n}\`${x > 1 ? ` (×${x})` : ''}`).join(' ')} | ${bb.replace('x', ' × ')} | ${gn} |`);
  }
  const sortFam = (n) => /^sort-(alpha|numeric)-/.test(n);
  const cs = uniq(under.map((a) => a.name));
  say(`concepts with an enclosed region under 1.5: ${cs.length} — sort-* ${cs.filter(sortFam).length}, others ${cs.filter((n) => !sortFam(n)).length} (${sorted(cs.filter((n) => !sortFam(n))).join(' ')}); with a \`gap:\` note: ${uniq(under.filter((a) => D.get(`${a.master}/${a.name}`)?.gapFil).map((a) => a.name)).length}`);
};

S['s4.3'] = (P) => {
  head('§4.3 The cut-weight census — the population behind docs/09:42');
  const cuts = regions(P).filter((a) => a.width <= CUT_MAX);
  const distinct = {};
  for (const m of MASTER_LIST) distinct[m] = uniq(cuts.filter((c) => c.master === m).map((c) => bucket8(c.width))).length;
  say(`The set cuts at ${MASTER_LIST.map((m) => `${distinct[m]} distinct widths at ${m}`).join(', ')} (1/8 buckets).`);
  for (const m of MASTER_LIST) {
    const xs = cuts.filter((c) => c.master === m), b = new Map();
    for (const x of xs) { const k = bucket8(x.width); if (!b.has(k)) b.set(k, []); b.get(k).push(x); }
    say(`At ${m} (${uniq(xs.map((c) => c.name)).length} files with a cut, ${xs.length} readings):`);
    say('| width | readings | examples | files |');   // a file can hold several regions of one width
    for (const [w, ys] of [...b.entries()].sort((p, q) => p[0] - q[0])) {
      const ns = uniq(ys.map((y) => y.name)).sort();
      const cap = m === 24 ? Infinity : 14;     // the document's table is at 24: print every name there
      say(`| ${w} | ${ys.length} | ${ns.slice(0, cap).map((n) => `\`${n}\``).join(' ')}${ns.length > cap ? ' …' : ''} | ${ns.length} |`);
    }
  }
  for (const m of MASTER_LIST) {
    const xs = cuts.filter((c) => c.master === m), named = xs.filter((c) => NAMED_CUTS.includes(bucket8(c.width))).length;
    say(`at ${m}: the three named values (${NAMED_CUTS.join(', ')}) account for ${named} of ${xs.length} readings; between or beyond them: ${xs.length - named}`);
  }
  say('As a multiple of the line the cut replaces:');
  say('| master | ratios |');
  for (const m of MASTER_LIST) {
    const xs = cuts.filter((c) => c.master === m), t = tally(xs.map((x) => r2(x.width / x.stroke)));
    const top = NAMED_RATIOS[m].map((k) => [k, t[k] ?? 0]);
    const rest = xs.length - top.reduce((s, [, n]) => s + n, 0);
    say(`| ${m} | ${top.map(([k, n]) => `${k.toFixed(Number.isInteger(k * 10) ? 1 : 2)} ×${n}`).join(' · ')} · other ×${rest} |`);
  }
  for (const m of MASTER_LIST) {
    const t = tally(cuts.filter((c) => c.master === m).map((x) => r2(x.width / x.stroke)));
    say(`  every ratio at ${m}: ${Object.entries(t).sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([k, n]) => `${k}×${n}`).join(' ')}`);
  }
  const at16 = cuts.filter((c) => c.master === 16), thin = at16.filter((c) => r2(c.width / c.stroke) < 1.2);
  say(`at 16, cuts thinner than 1.2× the line: ${thin.length} (on ${sorted(uniq(thin.map((c) => c.name))).join(' ')})`);
  say('Reference values (enclosed-region widths, 1/8 buckets, per master 24 · 20 · 16):');
  const R = regions(P);
  const widthsOf = (n, m) => R.filter((r) => r.name === n && r.master === m).map((r) => bucket8(r.width)).sort((a, b) => a - b);
  const infoFam = sorted(P.names.filter((n) => /^info(-\d+)?$/.test(n)));
  for (const n of ['trash', 'plus-circle', 'x-circle', 'minus-circle', 'check-circle', ...infoFam])
    say(`  ${n}: ${MASTER_LIST.map((m) => `[${widthsOf(n, m).join(', ')}]`).join(' · ')}`);
  const fileSep = P.pairs().filter((d) => d.name === 'file').map((d) => (d.air?.area ?? []).filter((a) => a.kind === 'separation').map((a) => a.gap).join(','));
  say(`  file (facingGap separation): ${fileSep.join(' · ')}`);
};

S['s4.4'] = (P) => {
  head('§4.4 Filling closes air the outline had');
  const N = closesAir(P), D = P.pairs();
  say(`${N.length} of ${fc(D.length)} pairs (${pct(N.length, D.length)}) have a narrowest air reading in the filled drawing tighter than anything in their outline twin.`);
  say(`Extremes: ${N.slice(0, 12).map((x) => `${x.master}/${x.name} ${x.outline} → ${x.filled}`).join(' · ')}`);
  const u = D.find((d) => d.name === 'users' && d.master === 24);
  if (u) { const { f, o } = narrowestAir(u); say(`24/users: ${o} → ${f}`); }
};

S.s5 = (P) => {
  head('§5 Is the silhouette the same shape at all?');
  const rows = silhRows(P);
  say(`| class | pairs | outer region identical (< ${SAME_OUTER} sq units of difference) |`);
  for (const k of ['shape-only', 'shape+line', 'line-heavy']) {
    const xs = rows.filter((r) => r.klass === k), ex = xs.filter((r) => r.outlineOnly + r.filledOnly < SAME_OUTER);
    say(`| ${k} | ${xs.length} | ${ex.length} (${pct(ex.length, xs.length)}) |`);
  }
  const diff = rows.filter((r) => r.klass !== 'line-heavy' && r.outlineOnly + r.filledOnly >= OUTER_DIFF)
    .sort((a, b) => (b.outlineOnly + b.filledOnly) - (a.outlineOnly + a.filledOnly));   // stable, as an6.mjs
  say(`${diff.length} shape-filled pairs on ${nConcepts(diff)} concepts differ by ≥ ${OUTER_DIFF} square units. Worst, at 24:`);
  say('| sq units | concept | outline-only | filled-only | IoU | biggest patch |');
  for (const r of diff.filter((x) => x.master === 24).slice(0, 30))
    say(`| ${(r.outlineOnly + r.filledOnly).toFixed(1)} | \`${r.name}\` | ${fx(r.outlineOnly, 2)} | ${fx(r.filledOnly, 2)} | ${r.iou.toFixed(3)} | ${((r.diffFil[0] ?? r.diffOut[0])?.bbox ?? []).map((v) => fx(v, 2)).join(' × ')} |`);
};

/** The concepts §5.1 names (the document's own list; a reading of §5's table, not a census). */
const S51_NAMES = (names) => names.filter((n) => /^(users-.+|user-3|user-4|lightbulb-[34]|compose(-\d)?|external-link(-\d)?|export|trash-5)$/.test(n));
S['s5.1'] = (P) => {
  head('§5.1 The filled closes the outline\'s open shape (filledOnly)');
  const names = new Set(S51_NAMES(P.names));
  const D = P.pairs().filter((d) => names.has(d.name)), sil = new Map(P.silh().map((r) => [`${r.master}/${r.name}`, r]));
  const same = D.filter((d) => d.maxDelta <= 0.01);
  say(`the concepts it names: ${names.size}; pairs with the ink box identical to 0.01: ${same.length} of ${D.length}; pairs with filled-only area ≥ ${OUTER_DIFF}: ${D.filter((d) => sil.get(`${d.master}/${d.name}`).filledOnly >= OUTER_DIFF).length}`);
};

S['s5.2'] = (P) => {
  head('§5.2 The knockout breaks the silhouette into pieces (outlineOnly)');
  const R = P.pieces(), more = R.filter((r) => r.f > r.o), fewer = R.filter((r) => r.f < r.o), same = R.filter((r) => r.f === r.o);
  say('| | pairs | concepts |');
  say(`| filled in more pieces than the outline | ${more.length} | ${nConcepts(more)} |`);
  say(`| filled in fewer pieces | ${fewer.length} | ${nConcepts(fewer)} |`);
  say(`| same number | ${fc(same.length)} | — |`);
  say(`More pieces (${nConcepts(more)}): ${sorted(uniq(more.map((r) => r.name))).map((n) => `\`${n}\``).join(' ')}`);
  say(`Fewer pieces (${nConcepts(fewer)}): ${sorted(uniq(fewer.map((r) => r.name))).map((n) => `\`${n}\``).join(' ')}`);
  say(`Examples (24 · 20 · 16): ${['table', 'grid-2', 'globe', 'globe-2'].map((n) => `\`${n}\` ${MASTER_LIST.map((m) => { const r = R.find((x) => x.name === n && x.master === m); return r ? `${r.o} → ${r.f}` : 'absent'; }).join(' · ')}`).join(' | ')}`);
  if (P.names.includes('table')) {
    const o = readSvg(P.text(24, 'table.svg')), f = readSvg(P.text(24, 'table-filled.svg'));
    const ob = inkBoxOf(o), fb = inkBoxOf(f);
    const ring = o.strokes.find((p) => p.subpaths[0].closed), rules = o.strokes.filter((p) => !p.subpaths[0].closed);
    const rx = uniq(ring.subpaths[0].segs.filter((s) => s.k === 'A').map((s) => r3(s.rx)));
    say(`table outline at 24: one closed rounded rectangle ${fx(ob.x1 - ob.x0)} × ${fx(ob.y1 - ob.y0)} (centreline r${rx.join('/')} → ${rx.map((r) => r + o.rootWidth / 2).join('/')} outer) with ${rules.length} rules through it`);
    const fr = radii.radiiOf(radii.iconFromSource(P.text(24, 'table-filled.svg'), { file: 'table-filled.svg' })).corners.filter((c) => c.kind !== 'sharp');
    // the bands: gaps between the tiles' own boxes, along each axis
    const tiles = f.areas.map((p) => inkBoxOf({ strokes: [], areas: [p] }));
    const gaps = (lo, hi) => { const iv = uniq(tiles.map((t) => `${t[lo]}|${t[hi]}`)).map((k) => k.split('|').map(Number)).sort((a, b) => a[0] - b[0]);
      const out = []; for (let i = 1; i < iv.length; i++) if (iv[i][0] > iv[i - 1][1]) out.push(r3(iv[i][0] - iv[i - 1][1])); return out; };
    say(`table-filled at 24: ${f.areas.length} separate area paths, ink ${fx(fb.x0)} → ${fx(fb.x1)} × ${fx(fb.y0)} → ${fx(fb.y1)}; corner radii ${Object.entries(tally(fr.map((c) => r3(c.radius)))).map(([k, n]) => `r${k} ×${n}`).join(' · ')}; bands between tiles x ${gaps('x0', 'x1').join(', ')} · y ${gaps('y0', 'y1').join(', ')}`);
  }
};

S['s5.3'] = (P) => {
  head('§5.3 Two constructions for a shape-filled icon, both in the set');
  const rows = silhRows(P), dup = rows.filter((r) => r.dupPaths > 0);
  const shaped = P.pairs().filter((d) => d.klass !== 'line-heavy');
  const dupKeys = new Set(dup.map((r) => `${r.master}/${r.name}`));
  const contour = shaped.filter((d) => !dupKeys.has(`${d.master}/${d.name}`));
  say('| construction | files | concepts |');
  say(`| the area carries the outer contour (shape-filled files minus the second construction) | ${fc(contour.length)} | ${nConcepts(contour)} |`);
  say(`| the area is the inner fill and the shape is also stroked at the outline weight | ${dup.length} | ${nConcepts(dup)} — ${sorted(uniq(dup.map((r) => r.name))).map((n) => `\`${n}\``).join(' ')} |`);
  say(`shape-filled concepts in all: ${nConcepts(shaped)} (${fc(shaped.length)} files)`);
  const multi = P.pairs().filter((d) => d.pathsFilArea >= 2);
  say(`[the transcript's line the document's 330 / 110 / 115 were read from] filled files with ≥ 2 area paths: ${multi.length} · concepts ${nConcepts(multi)}; minus the second construction: ${multi.length - dup.length} · ${nConcepts(multi) - nConcepts(dup)}`);
};

/** Arc radii of a path's arcs, per subpath (metrics-check parseD). */
const arcRx = (p) => p.subpaths.map((sp) => sp.segs.filter((s) => s.k === 'A').map((s) => s.rx));
S['s5.4'] = (P) => {
  head('§5.4 A ring kept as a ring, thickened to the filled weight');
  const hits = ringRows(P).filter((x) => x.hit).sort((a, b) => a.name.localeCompare(b.name) || b.master - a.master);
  const cs = sorted(uniq(hits.map((x) => x.name)));
  say(`counters ≥ ${COUNTER_MIN} wide in both whose diameter shrank by 2 × (FILLED_WEIGHT − stroke), within ${COUNTER_TOL}: ${hits.length} pairs, ${cs.length} concepts`);
  say('| concept | 24 | 20 | 16 | class |');
  // 2 dp, rounded half-up from the census's 3-dp value (as the 3-dp figures were read off and rounded)
  const h2 = (v) => (Math.floor((Math.round(v * 1000) + 5) / 10) / 100).toFixed(2);
  for (const n of cs) say(`| \`${n}\` | ${MASTER_LIST.map((m) => { const x = hits.find((h) => h.name === n && h.master === m); return x ? `${h2(x.dO)} → ${h2(x.dF)}` : '—'; }).join(' | ')} | ${hits.find((h) => h.name === n).klass} |`);
  say(`  the same at 3 dp: ${hits.map((x) => `${x.master}/${x.name} ${x.dO} → ${x.dF}`).join(' · ')}`);
  const shapeHits = cs.filter((n) => hits.find((h) => h.name === n).klass !== 'line-heavy');
  say(`shape-filled among them: ${shapeHits.length} (${shapeHits.join(' ')}); line-heavy: ${cs.length - shapeHits.length}`);
  if (P.names.includes('search')) {
    const wall = [], c22 = [];
    for (const m of MASTER_LIST) {
      const f = readSvg(P.text(m, 'search-filled.svg')), o = readSvg(P.text(m, 'search.svg'));
      const rx = arcRx(f.areas[0]).map((s) => s[0]), outer = Math.max(...rx), inner = Math.min(...rx);
      const oR = arcRx(o.strokes[0])[0][0], half = M.strokeOf(m) / 2;
      wall.push(`${fx(outer - inner, 2)}`);
      c22.push(`${m}: outline inner radius ${fx(oR)} − ${half} = ${fx(oR - half)}; filled punches at ${fx(inner)} (${fx(oR - half - inner)} tighter); outer − FILLED_WEIGHT = ${fx(outer - M.FILLED_WEIGHT[m])}`);
    }
    say(`search-filled lens ring thickness: ${wall.join(' · ')} (the outline weight: ${MASTER_LIST.map((m) => M.strokeOf(m)).join(' · ')})`);
    for (const l of c22) say(`  C22 check ${l}`);
    const f24 = readSvg(P.text(24, 'search-filled.svg')), h = f24.areas[1].subpaths[0].segs.filter((s) => s.k === 'A');
    const small = h.reduce((a, s) => (s.rx < a.rx ? s : a)), big = Math.max(...h.map((s) => s.rx));
    const lensEnd = Math.hypot(small.b[0] - small.a[0], small.b[1] - small.a[1]), tip = 2 * big, line = M.strokeOf(24);
    say(`search-filled handle at 24: ${fx(lensEnd)} wide at the lens end (the r${fx(small.rx)} arc's chord ${small.a.map((v) => fx(v)).join(',')} → ${small.b.map((v) => fx(v)).join(',')}), ${fx(tip)} at the tip (r${fx(big)} end): ${fx(lensEnd / line, 2)}× to ${fx(tip / line, 2)}× the outline's ${line}`);
    const d24 = P.pairs().find((d) => d.name === 'search' && d.master === 24);
    say(`search at 24: ink box largest side difference ${fx(d24.maxDelta)}`);
  }
  if (P.names.includes('list-bullet-3')) {
    const lines = [];
    for (const m of MASTER_LIST) {
      const o = readSvg(P.text(m, 'list-bullet-3.svg')), f = readSvg(P.text(m, 'list-bullet-3-filled.svg'));
      const ring = o.strokes.filter((p) => p.subpaths[0].closed), disc = f.areas;
      const s = P.silh().find((r) => r.name === 'list-bullet-3' && r.master === m), d = P.pairs().find((r) => r.name === 'list-bullet-3' && r.master === m);
      lines.push(`${m}: outline rings ${ring.length} centreline r${uniq(ring.map((p) => fx(arcRx(p)[0][0]))).join('/')} outer ${uniq(ring.map((p) => fx(arcRx(p)[0][0] + o.rootWidth / 2))).join('/')} · counters [${s.encOutAreas.join(', ')}] · filled ${disc.length} solid disc(s) r${uniq(disc.map((p) => fx(arcRx(p)[0][0]))).join('/')} with ${disc.map((p) => p.subpaths.length - 1).reduce((a, b) => a + b, 0)} holes · box max side difference ${fx(d.maxDelta)} · IoU ${s.iou.toFixed(3)} · filled enclosed white ${s.encFilAreas.length}`);
    }
    say('list-bullet-3:'); for (const l of lines) say(`  ${l}`);
  }
};

S['s5.5'] = (P) => {
  head('§5.5 How much darker is the filled drawing?');
  const rows = silhRows(P);
  say('| master | class | n | min | median | max |');
  for (const m of MASTER_LIST) for (const k of ['shape-only', 'shape+line', 'line-heavy']) {
    const xs = rows.filter((r) => r.master === m && r.klass === k), rs = xs.map((r) => r.inkFil / r.inkOut).sort((a, b) => a - b);
    if (!xs.length) continue;
    say(`| ${m} | ${k} | ${xs.length} | ${r3(rs[0]).toFixed(3)} | ${r3(rs[Math.floor(rs.length / 2)]).toFixed(3)} | ${r3(rs.at(-1)).toFixed(3)} |`);
  }
  const lighter = rows.filter((r) => r.inkFil < r.inkOut - 0.01);
  say(`filled drawings with LESS ink than their outline twin: ${lighter.length} (${sorted(uniq(lighter.map((r) => `${r.master}/${r.name}`))).join(' ')})`);
  say('| concept | 24 | 20 | 16 |');
  for (const n of ['globe', 'globe-2', 'language-2', 'language-3'].filter((x) => P.names.includes(x)))
    say(`| \`${n}\` | ${MASTER_LIST.map((m) => { const r = rows.find((x) => x.name === n && x.master === m); return r3(r.inkFil / r.inkOut).toFixed(3); }).join(' | ')} |`);
  const g = rows.find((r) => r.name === 'globe-2' && r.master === 16);
  if (g) {
    const R = P.cuts().find((c) => c.name === 'globe-2' && c.master === 16);
    say(`globe-2 at 16: ${Math.round((1 - g.inkFil / g.inkOut) * 100)}% less ink than its outline; outline counters ${g.encOutAreas.length}, filled ${g.encFilAreas.length} (enclosed census ${R.regions.length}); filled pieces ${P.pieces().find((r) => r.name === 'globe-2' && r.master === 16).f}`);
  }
};

S['s5.6'] = (P) => {
  head('§5.6 `ban` and `ban-2`');
  if (!P.names.includes('ban') || !P.names.includes('ban-2')) return say('ban / ban-2 not in this pin');
  const ds = (m, n) => readSvg(P.text(m, `${n}.svg`)).strokes.map((p) => normD(p.d)).join('|');
  say(`24 outline drawings identical path for path: ${ds(24, 'ban') === ds(24, 'ban-2')} (20: ${ds(20, 'ban') === ds(20, 'ban-2')}, 16: ${ds(16, 'ban') === ds(16, 'ban-2')})`);
  const s = (n, m) => P.silh().find((r) => r.name === n && r.master === m);
  const w = (n) => MASTER_LIST.map((m) => readSvg(P.text(m, `${n}-filled.svg`)).rootWidth).join(' · ');
  const cutW = MASTER_LIST.map((m) => P.cuts().find((c) => c.name === 'ban-2' && c.master === m).regions.map((r) => bucket8(r.width)).join('/')).join(' · ');
  const kl = P.klass();
  say('| | `ban-filled` | `ban-2-filled` |');
  say(`| construction | ${kl.get('24/ban')}: root stroke ${w('ban')}, areas ${readSvg(P.text(24, 'ban-filled.svg')).areas.length} | ${kl.get('24/ban-2')}: slash punched at ${cutW} |`);
  const a = s('ban', 24), b = s('ban-2', 24);
  say(`| outline ink (24) | ${a.inkOut.toFixed(2)} | ${b.inkOut.toFixed(2)} |`);
  say(`| filled ink (24) | ${a.inkFil.toFixed(2)} (${(a.inkFil / a.inkOut).toFixed(3)}×) | ${b.inkFil.toFixed(2)} (${(b.inkFil / b.inkOut).toFixed(3)}×) |`);
  const encStr = (xs) => Object.entries(tally(xs.map((x) => x.toFixed(2)))).map(([k, n]) => (n > 1 ? `${k} ×${n}` : k)).join(', ');
  say(`| enclosed white (24) | ${encStr(a.encFilAreas)} | ${encStr(b.encFilAreas)} |`);
  say(`| outer region vs its outline | IoU ${a.iou.toFixed(3)} | IoU ${b.iou.toFixed(3)} |`);
  say(`filled twins apart in ink: ${Math.round((b.inkFil / a.inkFil - 1) * 100)}%`);
};

S['s5.7'] = (P) => {
  head('§5.7 Path counts');
  const D = P.pairs().map((d) => ({ ...d, nf: d.pathsFilStroke + d.pathsFilArea, dd: d.pathsFilStroke + d.pathsFilArea - d.pathsOut }));
  const t = tally(D.map((d) => d.dd));
  say('| filled minus outline | pairs |');
  for (const [k, n] of Object.entries(t).filter(([k]) => Number(k) > -5).sort((a, b) => b[1] - a[1])) say(`| ${Number(k) > 0 ? '+' : Number(k) < 0 ? '−' : ''}${Math.abs(k)} | ${n} |`);
  say(`| −5 or fewer | ${D.filter((d) => d.dd <= -5).length} |`);
  say(`${D.filter((d) => d.dd !== 0).length} of ${fc(D.length)} pairs have a different number of paths; the filled file gains at most ${Math.max(...D.map((d) => d.dd))} and loses up to ${-Math.min(...D.map((d) => d.dd))}.`);
  const fewer = D.filter((d) => d.dd < 0).sort((a, b) => a.dd - b.dd || a.master - b.master).slice(0, 8);
  say(`Extremes: ${fewer.map((d) => `${d.master}/${d.name} ${d.pathsOut} → ${d.pathsFilArea} area + ${d.pathsFilStroke} stroke`).join(' · ')}`);
  const same = P.pairs().filter((d) => d.identical);
  say(`${same.length} filled files are byte-identical in path data to their outline twin: ${same.map((d) => `${d.master}/${d.name}`).join(' ')}`);
};

// §6–§8 restate figures; each is recomputed here from the same censuses.
function chevronTable(P) {
  const ch = P.legs().filter((r) => /^chevron/.test(r.name));
  return MASTER_LIST.map((m) => { const xs = ch.filter((r) => r.master === m); return { m, step: weightStep(m), held: xs.filter((r) => r.worst <= 0.01).length, n: xs.length, worst: Math.max(...xs.map((r) => r.worst)) }; });
}
function flatChevronDisplacement(P) {
  const E = matchedEdges(P).filter((s) => /^chevron-(down|up|left|right)-2$/.test(s.name));
  return MASTER_LIST.map((m) => { const xs = E.filter((s) => s.master === m); return { m, off: Math.max(...xs.map((s) => s.off)), legs: uniq(xs.filter((s) => s.name === 'chevron-down-2').map((s) => s.off)).sort() }; });
}
S.s6 = (P) => {
  head('§6 The judgement — where does outer-edge equality cost the drawing?');
  const D = P.pairs(), off = D.filter((d) => d.maxDelta > 0.01);
  say(`Our box holds: ${fc(boxBands(D).exact.length)} of ${fc(D.length)} pairs exactly, ${off.filter((d) => d.grows).length} declared, ${off.filter((d) => !d.grows).length} undeclared.`);
  say('| master | weight step | chevrons holding the angle | worst |');
  for (const r of chevronTable(P).sort((a, b) => a.step - b.step)) say(`| ${r.m} | +${r.step} | ${r.held} / ${r.n} | ${fx(r.worst)}° |`);
  say(`flat chevron (chevron-{down,up,left,right}-2), largest displacement: ${flatChevronDisplacement(P).map((x) => `${fx(x.off)}px at ${x.m} (its matched edges: ${x.legs.join(', ')})`).join(' · ')}`);
  const E = matchedEdges(P).filter((s) => s.delta > 0.1 && s.off > 0.5).sort((a, b) => b.off - a.off);
  say(`readings over half a pixel: ${E.length} — ${Object.entries(tally(E.map((s) => `${s.master}/${s.name} ${fx(s.off)}`))).map(([k, n]) => `${k} ×${n}`).join(' · ')}`);
  const { tiny } = boxBands(D);
  say(`pairs using the 0.01 tolerance: ${tiny.length}`);
  const g = silhRows(P).find((r) => r.name === 'globe-2' && r.master === 16);
  if (g) say(`globe-2 at 16: ${Math.round((g.inkFil / g.inkOut - 1) * 100)}% ink against its outline`);
  const R = P.pieces(), more = R.filter((r) => r.f > r.o);
  say(`filled in more pieces than the outline: ${more.length} pairs on ${nConcepts(more)} concepts; table at 24 ${(R.find((r) => r.name === 'table' && r.master === 24) ?? {}).o} → ${(R.find((r) => r.name === 'table' && r.master === 24) ?? {}).f}`);
  const ringShape = uniq(ringRows(P).filter((x) => x.hit && x.klass !== 'line-heavy').map((x) => x.name));
  say(`shape-filled concepts that thicken a ring to FILLED_WEIGHT: ${ringShape.length} (search and ${ringShape.length - 1} others)`);
};

S.s7 = (P) => {
  head('§7 The judged list — its measured figures, recomputed');
  const ring = ringRows(P).filter((x) => x.hit), shape = sorted(uniq(ring.filter((x) => x.klass !== 'line-heavy').map((x) => x.name)));
  say(`1.1 shape-filled ring thickened: ${shape.join(' ')} (${shape.length})`);
  const E = matchedEdges(P).filter((s) => /^search(-3)?$/.test(s.name)).sort((a, b) => b.delta - a.delta);
  say(`1.2 search-family edges off their 45°: ${uniq(E.filter((s) => s.delta > 5).map((s) => `${s.master}/${s.name} ${fx(s.delta)}°`)).join(' · ')}`);
  const A = regions(P).filter((a) => a.width <= CUT_MAX && a.width < UNDER_FLOOR);
  const rng = (n) => { const w = A.filter((a) => a.name === n).map((a) => a.width); return w.length ? `${fx(Math.min(...w))}${Math.max(...w) !== Math.min(...w) ? `–${fx(Math.max(...w))}` : ''}` : 'none'; };
  say(`1.3 enclosed under 1.5: ${['watch', 'watch-2', 'language', 'megaphone-2', 'save', 'bold', 'sort-alpha-ascending'].map((n) => `${n} ${rng(n)}`).join(' · ')}; concepts ${nConcepts(A)}`);
  const over = P.legs().filter((r) => r.name === 'rotate-ccw-10');
  say(`1.4 rotate-ccw-10 largest filled bend: ${MASTER_LIST.map((m) => `r${Math.max(...(over.find((r) => r.master === m)?.fbend ?? [NaN]))}`).join(' · ')} against a cap of ${MASTER_LIST.map((m) => 2 * M.bendMin(M.FILLED_WEIGHT[m])).join(' · ')}`);
  const S5 = silhRows(P), ratio = (n, m) => { const r = S5.find((x) => x.name === n && x.master === m); return r ? r3(r.inkFil / r.inkOut).toFixed(3) : '—'; };
  say(`1.5 ink ratio globe-2 ${MASTER_LIST.map((m) => ratio('globe-2', m)).join(' · ')}; globe ${MASTER_LIST.map((m) => ratio('globe', m)).join(' · ')}`);
  const ct = chevronTable(P);
  say(`2.1 / 2.2 chevrons at 16: worst ${fx(ct.find((r) => r.m === 16).worst)}°; held ${ct.map((r) => `${r.held} of ${r.n} at ${r.m}`).join(', ')}`);
  const D = P.pairs(), { tiny } = boxBands(D);
  say(`2.4 band: ${tiny.length} pairs on ${nConcepts(tiny)} concepts, largest ${fx(Math.max(...tiny.map((d) => d.maxDelta)))}`);
  const R = P.pieces(), more = R.filter((r) => r.f > r.o), fewer = R.filter((r) => r.f < r.o);
  say(`2.5 more pieces ${more.length} / ${nConcepts(more)}, fewer ${fewer.length} / ${nConcepts(fewer)}`);
  const g = D.filter((d) => d.grows);
  say(`2.6 grows: ${g.length} files, ${nConcepts(g)} concepts, ${uniq(g.map((d) => `${d.master}|${d.grows.raw}`)).length} distinct strings, all matching: ${g.every((d) => d.growsCovers)}`);
  const cuts = regions(P).filter((a) => a.width <= CUT_MAX);
  say(`2.7 distinct cut widths: ${MASTER_LIST.map((m) => `${uniq(cuts.filter((c) => c.master === m).map((c) => bucket8(c.width))).length} at ${m}`).join(', ')}`);
  say(`2.8 modal ratio: ${MASTER_LIST.map((m) => { const t = tally(cuts.filter((c) => c.master === m).map((c) => r2(c.width / c.stroke))); return `${Object.entries(t).sort((a, b) => b[1] - a[1])[0][0]} at ${m}`; }).join(', ')}`);
  const un = []; for (const d of D) for (const c of d.corners ?? []) if (c.style === 'area' && c.rOutline === null && c.role !== 'ambiguous') un.push({ ...c, name: d.name });
  say(`2.9 filled-only corners ${fc(un.length)} on ${nConcepts(un)} concepts; r0.5 ${un.filter((c) => c.rFilled === 0.5).length}`);
  const dup = S5.filter((r) => r.dupPaths > 0);
  say(`2.10 fill-and-stroke construction: ${nConcepts(dup)} concepts / ${dup.length} files`);
  const a = S5.find((r) => r.name === 'ban' && r.master === 24), b = S5.find((r) => r.name === 'ban-2' && r.master === 24);
  if (a && b) say(`3.1 ban vs ban-2 filled ink at 24: ${a.inkFil.toFixed(2)} vs ${b.inkFil.toFixed(2)} (${Math.round((b.inkFil / a.inkFil - 1) * 100)}%), IoU ${a.iou.toFixed(3)} / ${b.iou.toFixed(3)}`);
  const g16 = S5.find((r) => r.name === 'globe-2' && r.master === 16);
  if (g16) say(`3.2 globe-2 at 16: ${Math.round((1 - g16.inkFil / g16.inkOut) * 100)}% less ink; enclosed white filled ${g16.encFilAreas.length}, outline ${g16.encOutAreas.length}`);
  const N = closesAir(P);
  say(`3.3 filling closes air: ${N.length} pairs (${pct(N.length, D.length)})`);
  const w = (n) => MASTER_LIST.map((m) => uniq(regions(P).filter((r) => r.name === n && r.master === m).map((r) => bucket8(r.width))).join('/')).join(' · ');
  say(`3.4 check-circle cut ${w('check-circle')}; x-circle ${w('x-circle')}`);
  const at16 = areaCorners(P).filter((r) => r.master === 16 && S31_ROWS.some((g) => Math.abs(r.delta - g.delta) < 0.002));
  say(`on record: 16 corners at the 1.5-era offset — ${at16.length} corners on ${nConcepts(at16)} concepts`);
};

S.s8 = (P) => {
  head('§8 What only Maruti\'s eye can settle — its figures, recomputed');
  const ct = chevronTable(P).find((r) => r.m === 24), fl = flatChevronDisplacement(P).find((x) => x.m === 24);
  say(`1. flat chevron at 24: leg angle up to ${fx(ct.worst)}° (all chevrons), flat chevron displacement ${fx(fl.off)}px; weight step ${MASTER_LIST.map((m) => `+${weightStep(m)} at ${m}`).join(', ')}`);
  if (P.names.includes('search')) {
    const f = readSvg(P.text(24, 'search-filled.svg')), h = f.areas[1].subpaths[0].segs.filter((s) => s.k === 'A');
    say(`2. search handle tip / outline line: ${fx((2 * Math.max(...h.map((s) => s.rx))) / M.strokeOf(24), 2)}×`);
  }
  const g = silhRows(P).find((r) => r.name === 'globe-2' && r.master === 16);
  if (g) say(`3. globe-2 at 16: ${Math.round((1 - g.inkFil / g.inkOut) * 100)}% lighter`);
  const a = P.silh().find((r) => r.name === 'ban' && r.master === 24), b = P.silh().find((r) => r.name === 'ban-2' && r.master === 24);
  if (a && b) say(`4. ban / ban-2 filled ink apart: ${Math.round((b.inkFil / a.inkFil - 1) * 100)}%`);
  const cuts = regions(P).filter((x) => x.width <= CUT_MAX && x.master === 24);
  say(`5. cut-width vocabulary at 24: ${uniq(cuts.map((c) => bucket8(c.width))).length} values`);
  const t = P.pieces().find((r) => r.name === 'table' && r.master === 24);
  if (t) say(`6. table: ${t.o} piece → ${t.f}`);
};

export const SECTIONS = Object.keys(S);

export function run(pin, sections = SECTIONS, opts = {}) {
  const P = openPin(pin, opts);
  for (const s of sections) S[s](P);
  return P;
}

function main() {
  const args = process.argv.slice(2);
  const ci = args.indexOf('--cache');
  const cache = ci >= 0 ? resolve(args[ci + 1] ?? '') : null;
  const pos = args.filter((a, i) => !a.startsWith('--') && !(ci >= 0 && i === ci + 1));
  const usage = 'usage: node tools/audit/filled-probe.mjs <pin-dir> [section …] [--cache <dir>]\n  sections: ' + SECTIONS.join(' ');
  const pin = pos[0] ? resolve(pos[0]) : null;
  if (!pin || !MASTER_LIST.every((m) => existsSync(join(pin, 'src/icons', String(m))) && statSync(join(pin, 'src/icons', String(m))).isDirectory())) {
    console.error(usage); process.exit(2);
  }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !S[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(' ')}\n${usage}`); process.exit(2); }
  if (ci >= 0 && !args[ci + 1]) { console.error(usage); process.exit(2); }
  console.log(`# findings-filled.md, reprinted from ${pin}`);
  try { run(pin, wanted.length ? wanted : SECTIONS, { cache }); }
  catch (e) { if (/^cache /.test(e.message)) { console.error(e.message); process.exit(2); } throw e; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
