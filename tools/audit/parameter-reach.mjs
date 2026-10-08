#!/usr/bin/env node
// PARAMETER REACH — for each free number in tools/masters.mjs (and the two numeric rules that
// live only in the docs), which drawings at a pin actually USE it. Audit only: nothing in lint,
// build or the lab imports this; it writes nothing.
//
//   node tools/audit/parameter-reach.mjs <pin-dir> [section…] [--json] [--cap N] [--band N] [--names N]
//
// <pin-dir> is a tree holding src/icons/{24,20,16} (the audit's pin copy, built from
// `git archive 5933041`). Sections, any order, default all:
//   stroke    STROKES — files drawn at the master's outline weight; what the weight drags with
//             it: open ends (cap insets), dots (radius = (d − stroke)/2), and at 16 the eighth-grid
//             coordinates that exist only because the stroke is 1.25
//   filled    FILLED_WEIGHT — line-heavy filled twins at the heavier weight, against the
//             shape-filled twins that keep the outline weight
//   bend      bendMin = weight / 2 — corners measured AT it (radii.mjs), by role and style
//   radius    the container-radius vocabulary (docs/01 §5: 2.5 · 1.5 · 0 at 24; "set per icon"
//             at 20 and 16) — container and detail corners by measured radius, per master, and
//             how many drawings sit on each de-facto tier
//   gap       MIN_GAP — every edge gap lint's four measures read (§5 pair, §5b self, §5c
//             knockout, §5f facing), in bands around the floor, so "how many drawings bind at
//             1.5" and "what a floor of 1.25 / 1.75 / 2 would change" are counts, not guesses
//   glyph     GLYPH_GAP — declared glyph files, and how many of their dot-to-body / own-opening
//             readings sit between 1 and 1.5, i.e. depend on the carve-out
//   keyline   MASTERS[m].keylines / bound / mark — files whose ink matches each keyline (to 0.01,
//             and to lint's ±0.5), the three opt-outs, ink that reaches the margin bound, marks
//             that reach the mark ceiling
//   size      SIZE_STEP — the -small / -large families, mark-stepped (C8) and container (C18)
//   grid      gridOf / decimalsOf — on-grid, off-grid and over-precision coordinates per master
//
// HOW EACH REACH IS MEASURED — and on which instrument.
//   · The ink box is lint's (§4): a stroked path's centreline box grown by half the file's
//     weight, an area as drawn (geometry.bbox). `bbox` samples arcs at 64 points and can sit up to
//     0.0056 inside the true edge (plans/set-and-rules-audit.md, known defects), so every
//     "reaches / matches" test here uses 0.01, never tighter.
//   · Corners come from tools/audit/radii.mjs (`census`, `radiiOf`), roles and all. Its
//     `ambiguous` role is reported, never folded into another.
//   · Notes come from tools/audit/notes.mjs (`extractFile`), so "declares keyline: mark" means
//     what lint reads, regex for regex.
//   · Gaps: §5's pair measure is lint's point-to-segment `polyGap` and its `crosses` test, copied
//     here because lint does not export them (lint.mjs:9-20, 49-57); §5b is geometry.selfGap;
//     §5c is geometry.materialGap; §5f is geometry.facingGap with its `cap` raised from lint's
//     1.75 — the defects list says no air census can be built on it without that — so readings up
//     to --cap (default 2.5) are collected. Lint's own exclusions are kept: crossing pairs are
//     skipped, pairs within 0.1 are joined, dots are solid, a single open subpath is §5b's not
//     §5f's, a neck §5b read is not read twice by §5f. A glyph pair / glyph opening (C19) is
//     classed `glyph`, never counted against MIN_GAP; a file's own `gap: N` note is recorded on
//     each reading so the caller can see which binding gaps are already declared.
//   · "Binding" = a drawing's smallest MIN_GAP-governed reading lies in [MIN_GAP − 0.01,
//     MIN_GAP + band), band default 0.25. "Under" = below MIN_GAP − 0.01 (lint's warning line).
//
// Everything is a count with its definition beside it. No reading is rounded before it is binned.

import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { bbox, samplePath, isDot, selfGap, materialGap, facingGap, subpathsOf, numbersIn, parsePath } from '../geometry.mjs';
import { STROKES, FILLED_WEIGHT, MASTERS, MIN_GAP, GLYPH_GAP, SIZE_STEP, bendMin, strokeOf, weightOf, gridOf, decimalsOf, markMax, sizeOf, sizeBase, isFilled } from '../masters.mjs';
import { census as radiiCensus } from './radii.mjs';
import { listIcons, readIcon } from './angles.mjs';
import { extractFile } from './notes.mjs';

export const SECTIONS = ['stroke', 'filled', 'bend', 'radius', 'gap', 'glyph', 'keyline', 'size', 'grid'];
const MASTER_LIST = Object.keys(MASTERS).map(Number).sort((a, b) => b - a);
const TOL = 0.01;                                   // bbox's arc sampling can sit 0.0056 inside the edge
const r3 = (n) => Math.round(n * 1000) / 1000;
const dp = (n) => { const s = String(n); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };

// ── lint's two unexported helpers, copied (lint.mjs:9-20, 49-57) ─────────────────────────

/** Smallest distance from any sample of `a` to the polyline through `b`'s samples. */
export function polyGap(a, b) {
  let min = Infinity;
  for (const [px, py] of a) for (let k = 0; k < b.length; k++) {
    const [x1, y1] = b[k], [x2, y2] = b[k + 1] ?? b[k];
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    const t = L && L < 0.3 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
    min = Math.min(min, Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)));
  }
  return min;
}
const side = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
export function crosses(a, b) {
  for (let i = 1; i < a.length; i++) for (let j = 1; j < b.length; j++) {
    const [p, q, r, s] = [a[i - 1], a[i], b[j - 1], b[j]];
    if (side(p, q, r) * side(p, q, s) < 0 && side(r, s, p) * side(r, s, q) < 0) return true;
  }
  return false;
}

/**
 * A dot in C17's sense: lint's `isDot` form (one closed circle drawn as two arcs) whose radius is
 * at most half the stroke, so it closes into a solid disc — radius = (d − stroke) / 2. `isDot`
 * alone also matches a ring drawn as two arcs (a container), which is not a dot.
 */
export function isSolidDot(d, stroke) {
  if (!isDot(d)) return false;
  const arc = parsePath(d).find(({ cmd }) => cmd.toUpperCase() === 'A');
  return !!arc && Math.min(arc.args[0], arc.args[1]) <= stroke / 2 + 0.005;
}

// ── one drawing, read once ─────────────────────────────────────────────────────────────────

/**
 * Everything the sections need from one file: the angles.mjs icon record, the notes record,
 * lint's ink box and the stroke/area split. `src` may be given to avoid a second read.
 */
export function drawingOf(p, src = readFileSync(p, 'utf8')) {
  const icon = readIcon(p);
  const master = icon.master;
  const notes = extractFile(src, master, basename(p));
  const ds = icon.paths.filter((x) => x.style === 'stroke').map((x) => x.d);
  const areas = icon.paths.filter((x) => x.style === 'area').map((x) => x.d);
  const half = icon.stroke / 2, boxes = [];
  if (ds.length) { const b = bbox(ds); boxes.push([b.x0 - half, b.y0 - half, b.x1 + half, b.y1 + half]); }
  if (areas.length) { const b = bbox(areas); boxes.push([b.x0, b.y0, b.x1, b.y1]); }
  const ink = boxes.length ? {
    x0: Math.min(...boxes.map((b) => b[0])), y0: Math.min(...boxes.map((b) => b[1])),
    x1: Math.max(...boxes.map((b) => b[2])), y1: Math.max(...boxes.map((b) => b[3])) } : null;
  const concept = icon.name.replace(/-filled$/, '');
  return { path: p, file: basename(p), name: icon.name, concept, master, filled: icon.filled,
           stroke: icon.stroke, ds, areas, lineHeavy: icon.filled && !areas.length, ink, notes, icon, src };
}

/** Every drawing under `root/src/icons/<m>/`. */
export function loadPin(root, masters = MASTER_LIST) {
  const files = listIcons(join(root, 'src/icons'), { masters });
  return files.map((p) => drawingOf(p));
}

// ── the gap census: lint's four measures, every reading kept ──────────────────────────────

const AIR_KINDS = ['cut', 'notch', 'separation', 'line'];

/**
 * Every edge-gap reading lint's §5 / §5b / §5c / §5f would take on one drawing, with the floor
 * each is governed by (`minGap` or `glyph`), the measure that read it and where. Readings wider
 * than `cap` are not looked for by §5f (facingGap) and not kept for the others, so the census is
 * honest about its own window.
 */
export function gapReadings(d, { cap = 2.5 } = {}) {
  const { ds, areas, stroke: STROKE, notes } = d;
  const glyph = notes.notes.glyph?.parsed?.kind ?? null;
  const isGlyph = glyph === 'dot', isNumeral = glyph === 'numeral';
  const declared = notes.notes.gap?.parsed?.n ?? null;
  const out = [];
  const push = (measure, gap, floor, at, extra = {}) => { if (gap <= cap) out.push({ measure, gap, floor, at, declared, ...extra }); };

  const sampled = ds.map((x) => samplePath(x));
  const spans = ds.map((x) => bbox([x]));
  const whole = ds.length ? bbox(ds) : null;
  const isShell = (b) => whole && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(b[k] - whole[k]) < 0.01);

  // §5 — separate stroked paths (lint.mjs:389-405)
  for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
    if (crosses(sampled[i], sampled[j])) continue;
    const glyphPair = isGlyph && isDot(ds[i]) !== isDot(ds[j]) && !isShell(spans[i]) && !isShell(spans[j]);
    const min = Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i]));
    if (min <= 0.1) continue;
    push('pair', min - STROKE, glyphPair ? 'glyph' : 'minGap', [i, j]);
  }
  // §5b — a path against itself (lint.mjs:429-440)
  const read5b = [];
  for (let i = 0; i < ds.length; i++) {
    if (isDot(ds[i])) continue;
    const self = selfGap(ds[i], STROKE);
    read5b[i] = self;
    if (!self) continue;
    const inGlyph = (isGlyph && !isShell(spans[i])) || isNumeral;
    push('self', self.gap, inGlyph ? 'glyph' : 'minGap', [i], { span: self.span });
  }
  // §5c — what a knockout leaves standing (lint.mjs:459-467); material, floored like air
  if (areas.length && ds.length === 0) {
    const left = materialGap(areas);
    if (left) push('material', left.gap, isGlyph ? 'glyph' : 'minGap', left.at);
  }
  // §5f — walls facing across air (lint.mjs:483-502)
  const air = facingGap(ds, STROKE, areas, { cap });
  const shut = (sub) => { const p = samplePath(sub); return p.length > 2 && Math.hypot(p.at(-1)[0] - p[0][0], p.at(-1)[1] - p[0][1]) < 0.01; };
  for (const { path, gap: g, at } of air.self) {
    const x = ds[path], subs = subpathsOf(x);
    if (isDot(x) || (subs.length === 1 && !shut(subs[0]))) continue;
    if (read5b[path] && read5b[path].gap <= g + 0.02) continue;
    const inGlyph = (isGlyph && !isShell(spans[path])) || isNumeral;
    push('facing-self', g, inGlyph ? 'glyph' : 'minGap', at, { pathIndex: path });
  }
  for (const { kind, gap: g, at } of air.area) push(`facing-${kind}`, g, 'minGap', at, { airKind: kind });
  return out;
}

/** Bin a set of readings around a floor. Bands are half-open, lint's −0.01 warning line kept. */
export function bands(readings, floor, band = 0.25) {
  const b = { under: 0, binding: 0, near: 0, clear: 0, total: readings.length };
  for (const r of readings) {
    if (r.gap < floor - 0.01) b.under++;
    else if (r.gap < floor + band) b.binding++;
    else if (r.gap < floor + 2 * band) b.near++;
    else b.clear++;
  }
  return b;
}

// ── sections ───────────────────────────────────────────────────────────────────────────────

const byMaster = (init) => Object.fromEntries(MASTER_LIST.map((m) => [m, typeof init === 'function' ? init() : structuredClone(init)]));
const names = (list, n) => [...new Set(list)].sort().slice(0, n);

export function sectionStroke(drawings, { namesN = 8 } = {}) {
  const out = byMaster(() => ({ stroke: 0, files: 0, outline: 0, shapeFilled: 0, openEnds: 0, openEndFiles: 0, dots: 0, dotFiles: 0,
                                 eighthOnly: 0, eighthOnlyFiles: 0, sampleEighthOnly: [] }));
  for (const d of drawings) {
    const o = out[d.master];
    o.stroke = strokeOf(d.master);
    // coordinates on the eighth grid and NOT on the quarter grid: they exist because 1.25 / 2 = 0.625.
    // Counted in EVERY file of the master — a line-heavy filled twin at weight 2 inherits them too,
    // because its ends pull in from the outline's by (2 − 1.25) / 2 = 0.375.
    let e = 0;
    for (const x of [...d.ds, ...d.areas]) for (const n of numbersIn(x)) if (Number.isInteger(n * 8) && !Number.isInteger(n * 4)) e++;
    o.eighthOnly += e; if (e) { o.eighthOnlyFiles++; o.sampleEighthOnly.push(d.name); }
    if (d.stroke !== strokeOf(d.master)) continue;          // line-heavy filled twins are FILLED_WEIGHT's
    o.files++;
    if (d.filled) o.shapeFilled++; else o.outline++;
    // open ends: subpaths of a stroked path that do not close — each has two caps that sit weight/2 inside the ink
    let ends = 0, dots = 0;
    for (const x of d.ds) {
      if (isSolidDot(x, d.stroke)) { dots++; continue; }
      if (isDot(x)) continue;                              // a ring drawn as two arcs: closed, no ends
      for (const sub of subpathsOf(x)) {
        const p = samplePath(sub);
        if (p.length > 1 && Math.hypot(p.at(-1)[0] - p[0][0], p.at(-1)[1] - p[0][1]) >= 0.01) ends += 2;
      }
    }
    o.openEnds += ends; if (ends) o.openEndFiles++;
    o.dots += dots; if (dots) o.dotFiles++;
  }
  for (const m of MASTER_LIST) out[m].sampleEighthOnly = names(out[m].sampleEighthOnly, namesN);
  return out;
}

export function sectionFilled(drawings, { namesN = 8 } = {}) {
  const out = byMaster(() => ({ weight: 0, lineHeavy: 0, shapeFilled: 0, outline: 0, lineHeavyConcepts: [], shapeFilledConcepts: [], mixedShape: 0 }));
  for (const d of drawings) {
    const o = out[d.master];
    o.weight = FILLED_WEIGHT[d.master];
    if (!d.filled) { o.outline++; continue; }
    if (d.lineHeavy) { o.lineHeavy++; o.lineHeavyConcepts.push(d.concept); }
    else { o.shapeFilled++; o.shapeFilledConcepts.push(d.concept); if (d.ds.length) o.mixedShape++; }
  }
  for (const m of MASTER_LIST) {
    out[m].lineHeavyConceptCount = new Set(out[m].lineHeavyConcepts).size;
    out[m].shapeFilledConceptCount = new Set(out[m].shapeFilledConcepts).size;
    out[m].lineHeavyConcepts = names(out[m].lineHeavyConcepts, namesN);
    out[m].shapeFilledConcepts = names(out[m].shapeFilledConcepts, namesN);
  }
  return out;
}

/**
 * radii.mjs census over the drawings, grouped the way the radius questions ask.
 *
 * `bend` reads STROKE paths only — C10 is about a stroked mark's corner and lint.mjs:372 reads
 * stroke paths only — on the measured radius, ±0.005. `radius` reads every corner but on its
 * CENTRELINE-equivalent radius (radii.mjs `centreline`: an area contour's radius less half the
 * outline stroke), so a filled twin's 3.25 outer corner at 24 sits on the same 2.5 as its outline;
 * tier membership uses card 1.2's snap — nearest sixteenth, within `snap` (0.025) — so the two
 * censuses can be read side by side (`findings-corners.md:44-45`).
 */
export function sectionRadii(drawings, { namesN = 8, tiers = { 24: 2.5, 20: 2, 16: 1.5 }, detail = { 24: 1.5, 20: 1.25, 16: 1 }, snap = 0.025 } = {}) {
  // Two counts of "a corner at bendMin", because two instruments read the set differently:
  //   atBendMin        radii.mjs's FILLETS — an arc joining two straight runs on tangent — measured
  //                    radius within 0.005 of this file's bendMin;
  //   typedAtBendMin   lint's reading (lint.mjs:372-376): every typed `A` radius in a non-dot stroke
  //                    path within 0.005 of bendMin, straight legs or not — `gear`'s teeth, `star`'s
  //                    points, a ferrule's shoulder are arcs a stroke change re-cuts that radii.mjs
  //                    does not call corners. `typedAtBendMinOutlineWeight` restricts it to files
  //                    drawn at the master's outline stroke.
  const out = { bend: byMaster(() => ({ bendMin: {}, atBendMin: 0, atBendMinFiles: 0, roleBendAtMin: 0, bends: 0, underBendMin: 0, byFile: { outline: 0, filled: 0 }, sample: [],
                                        typedAtBendMin: 0, typedAtBendMinFiles: 0, typedAtBendMinOutlineWeight: 0, typedAtBendMinOutlineWeightFiles: 0 })),
                radius: byMaster(() => ({ tier: tiers[24], snap,
                                          container: { corners: 0, histogram: {}, byFile: { outline: 0, filled: 0 }, onTierByFile: { outline: 0, filled: 0 },
                                                       drawingsOnTier: 0, drawingsOffTier: 0, drawingsMixed: 0,
                                                       concepts: 0, conceptsOnTier: [], conceptsOffTier: [], conceptsMixed: [] },
                                          detail: { corners: 0, histogram: {}, atDetail: 0 }, ambiguous: 0, sharp: 0 })) };
  const sixteenth = (x) => Math.round(x * 16) / 16;
  const onTier = (x, t) => Math.abs(x - t) <= snap;
  for (const m of MASTER_LIST) {
    const mine = drawings.filter((d) => d.master === m);
    if (!mine.length) continue;
    const c = radiiCensus(mine.map((d) => d.path));
    const b = out.bend[m], r = out.radius[m];
    r.tier = tiers[m];
    const tol = 0.005;
    for (const d of mine) {
      let typed = 0;
      for (const x of d.ds) {
        if (isDot(x)) continue;                                   // lint.mjs:372 skips a dot
        for (const { cmd, args } of parsePath(x)) {
          if (cmd.toUpperCase() !== 'A') continue;
          for (let k = 0; k + 7 <= args.length; k += 7)
            if (Math.abs(Math.min(args[k], args[k + 1]) - bendMin(d.stroke)) <= tol) typed++;
        }
      }
      if (!typed) continue;
      b.typedAtBendMin += typed; b.typedAtBendMinFiles++;
      if (d.stroke === strokeOf(m)) { b.typedAtBendMinOutlineWeight += typed; b.typedAtBendMinOutlineWeightFiles++; }
    }
    for (const corner of c.all) {
      if (corner.kind === 'sharp') { r.sharp++; continue; }
      if (corner.style === 'stroke') {
        if (Math.abs(corner.radius - corner.bendMin) <= tol) {
          b.atBendMin++; b.byFile[isFilled(corner.file) ? 'filled' : 'outline']++; b.sample.push(corner.name);
          b.bendMin[String(corner.bendMin)] = (b.bendMin[String(corner.bendMin)] ?? 0) + 1;
          if (corner.role === 'bend') b.roleBendAtMin++;
        }
        if (corner.role === 'bend') { b.bends++; if (corner.radius < corner.bendMin - tol) b.underBendMin++; }
      }
      if (corner.role === 'ambiguous') r.ambiguous++;
      const rc = corner.centreline;                       // stroke: the radius; area: radius − outline half
      const fileStyle = isFilled(corner.file) ? 'filled' : 'outline';
      if (corner.role === 'container') {
        r.container.corners++; r.container.byFile[fileStyle]++;
        if (onTier(rc, tiers[m])) r.container.onTierByFile[fileStyle]++;
        const k = String(sixteenth(rc)); r.container.histogram[k] = (r.container.histogram[k] ?? 0) + 1;
      }
      if (corner.role === 'detail') {
        r.detail.corners++;
        const k = String(sixteenth(rc)); r.detail.histogram[k] = (r.detail.histogram[k] ?? 0) + 1;
        if (onTier(rc, detail[m])) r.detail.atDetail++;
      }
    }
    // per drawing and per concept: are the container corners all on the tier, all off it, or mixed?
    // OUTLINE files only — the population card 1.2 counted, and the one the rule speaks about. A
    // filled twin's punched inner contour has no `centreline` conversion (radii.mjs header: the
    // offset is assumed AWAY from the arc centre, true for an outer contour), so it is kept out.
    const perConcept = new Map();
    for (const per of c.per) {
      if (per.style === 'filled') continue;
      const cc = per.corners.filter((x) => x.role === 'container' && x.kind !== 'sharp');
      if (!cc.length) continue;
      const on = cc.filter((x) => onTier(x.centreline, tiers[m])).length;
      const concept = per.name.replace(/-filled$/, '');
      const e = perConcept.get(concept) ?? { on: 0, total: 0 }; e.on += on; e.total += cc.length; perConcept.set(concept, e);
      if (on === cc.length) r.container.drawingsOnTier++;
      else if (on === 0) r.container.drawingsOffTier++;
      else r.container.drawingsMixed++;
    }
    for (const [concept, e] of perConcept) {
      if (e.on === e.total) r.container.conceptsOnTier.push(concept);
      else if (e.on === 0) r.container.conceptsOffTier.push(concept);
      else r.container.conceptsMixed.push(concept);
    }
    r.container.concepts = perConcept.size;
    b.atBendMinFiles = new Set(b.sample).size; b.sample = names(b.sample, namesN);
    for (const k of ['conceptsOnTier', 'conceptsOffTier', 'conceptsMixed']) {
      r.container[`${k}Count`] = r.container[k].length; r.container[k] = names(r.container[k], namesN);
    }
    r.container.histogram = Object.fromEntries(Object.entries(r.container.histogram).sort((x, y) => y[1] - x[1]));
    r.detail.histogram = Object.fromEntries(Object.entries(r.detail.histogram).sort((x, y) => y[1] - x[1]));
  }
  return out;
}

export function sectionGap(drawings, { cap = 2.5, band = 0.25, namesN = 8 } = {}) {
  const out = byMaster(() => ({ floor: MIN_GAP, cap, band, drawings: 0, measured: 0, readings: { under: 0, binding: 0, near: 0, clear: 0, total: 0 },
                                 atFloor: { readings: 0, drawings: 0, tightest: 0, concepts: [] },
                                 byMeasure: {}, drawingsBy: { under: 0, binding: 0, near: 0, clear: 0, none: 0 },
                                 bindingUndeclared: 0, bindingDeclared: 0, underDeclared: 0, underUndeclared: 0, underReadingsUndeclared: 0,
                                 whatIf: { floor1: 0, floor1_25: 0, floor1_75: 0, floor2: 0 }, sampleBinding: [], sampleUnder: [] }));
  const glyphOut = byMaster(() => ({ floor: GLYPH_GAP, files: 0, concepts: [], readings: 0, between1and1_5: 0, under1: 0, atOrOver1_5: 0, sample: [] }));
  for (const d of drawings) {
    const o = out[d.master], g = glyphOut[d.master];
    o.drawings++;
    const rs = gapReadings(d, { cap });
    const mine = rs.filter((r) => r.floor === 'minGap'), gl = rs.filter((r) => r.floor === 'glyph');
    if (d.notes.notes.glyph?.lint?.reads) { g.files++; g.concepts.push(d.concept); }
    for (const r of gl) { g.readings++; if (r.gap < GLYPH_GAP - 0.01) g.under1++; else if (r.gap < MIN_GAP - 0.01) { g.between1and1_5++; g.sample.push(d.name); } else g.atOrOver1_5++; }
    if (!mine.length) { o.drawingsBy.none++; continue; }
    o.measured++;
    const b = bands(mine, MIN_GAP, band);
    for (const k of Object.keys(b)) o.readings[k] += b[k];
    for (const r of mine) {
      const key = r.measure; o.byMeasure[key] ??= { under: 0, binding: 0, near: 0, clear: 0, total: 0 };
      const bb = bands([r], MIN_GAP, band); for (const k of Object.keys(bb)) o.byMeasure[key][k] += bb[k];
      // what a different floor would do to THIS reading (lint's −0.01 line kept)
      if (r.gap < 1 - 0.01) o.whatIf.floor1++;
      if (r.gap < 1.25 - 0.01) o.whatIf.floor1_25++;
      if (r.gap < 1.75 - 0.01) o.whatIf.floor1_75++;
      if (r.gap < 2 - 0.01) o.whatIf.floor2++;
    }
    // drawn AT the floor: a reading within 0.01 of MIN_GAP (lint's own tolerance) — the drawings
    // whose air a different floor would move first
    const at = mine.filter((r) => Math.abs(r.gap - MIN_GAP) <= 0.01).length;
    if (at) { o.atFloor.readings += at; o.atFloor.drawings++; o.atFloor.concepts.push(d.concept); }
    const smallest = Math.min(...mine.map((r) => r.gap));
    if (Math.abs(smallest - MIN_GAP) <= 0.01) o.atFloor.tightest++;
    const declared = mine[0].declared !== null;
    if (!declared) o.underReadingsUndeclared += mine.filter((r) => r.gap < MIN_GAP - 0.01).length;
    if (smallest < MIN_GAP - 0.01) { o.drawingsBy.under++; o.sampleUnder.push(d.name); if (declared) o.underDeclared++; else o.underUndeclared++; }
    else if (smallest < MIN_GAP + band) { o.drawingsBy.binding++; o.sampleBinding.push(d.name); if (declared) o.bindingDeclared++; else o.bindingUndeclared++; }
    else if (smallest < MIN_GAP + 2 * band) o.drawingsBy.near++;
    else o.drawingsBy.clear++;
  }
  for (const m of MASTER_LIST) {
    out[m].atFloor.conceptCount = new Set(out[m].atFloor.concepts).size; delete out[m].atFloor.concepts;
    out[m].sampleBinding = names(out[m].sampleBinding, namesN); out[m].sampleUnder = names(out[m].sampleUnder, namesN);
    glyphOut[m].conceptCount = new Set(glyphOut[m].concepts).size; glyphOut[m].concepts = names(glyphOut[m].concepts, namesN);
    glyphOut[m].sample = names(glyphOut[m].sample, namesN);
  }
  return { gap: out, glyph: glyphOut };
}

export function sectionKeyline(drawings, { namesN = 8 } = {}) {
  const out = byMaster(() => ({ bound: null, mark: null, drawings: 0, optOut: { mark: 0, box: 0, anchor: 0 }, held: 0,
                                 exact: {}, lint: {}, noMatchLint: 0, noMatchSample: [], reachesBound: 0, reachesBoundSample: [], marksAtCeiling: 0, marksAtCeilingSample: [], largeAtBound: 0 }));
  for (const d of drawings) {
    const o = out[d.master], { bound, keylines, mark } = MASTERS[d.master];
    o.bound = bound; o.mark = mark; o.drawings++;
    if (!d.ink) continue;
    const w = d.ink.x1 - d.ink.x0, h = d.ink.y1 - d.ink.y0;
    const n = d.notes.notes;
    const isMark = n.keyline?.parsed?.word === 'mark', hasBox = !!n.box?.lint?.reads, hasAnchor = !!n.anchor?.lint?.reads;
    if (d.ink.x0 <= bound[0] + TOL || d.ink.y0 <= bound[0] + TOL || d.ink.x1 >= bound[1] - TOL || d.ink.y1 >= bound[1] - TOL) {
      o.reachesBound++; o.reachesBoundSample.push(d.name);
      if (sizeOf(d.name) === 'large') o.largeAtBound++;
    }
    if (isMark) {
      o.optOut.mark++;
      if (Math.abs(Math.max(w, h) - markMax(d.name, d.master)) <= TOL) { o.marksAtCeiling++; o.marksAtCeilingSample.push(d.name); }
      continue;
    }
    if (hasBox) { o.optOut.box++; continue; }
    if (hasAnchor) { o.optOut.anchor++; continue; }
    o.held++;
    // Lint matches on the 2 dp-rounded box (lint.mjs:312-316, 352); so does this, so the two agree.
    const rw = Math.round(w * 100) / 100, rh = Math.round(h * 100) / 100;
    let anyLint = false;
    for (const [k, [kw, kh]] of Object.entries(keylines)) {
      // `diagonal` has the circle's dimensions at every master (masters.mjs:33, 38, 43), so every
      // circle match is a diagonal match too; it is reported for completeness and said so in the print.
      if (Math.abs(w - kw) <= TOL && Math.abs(h - kh) <= TOL) o.exact[k] = (o.exact[k] ?? 0) + 1;
      if (Math.abs(rw - kw) <= 0.5 && Math.abs(rh - kh) <= 0.5) { o.lint[k] = (o.lint[k] ?? 0) + 1; anyLint = true; }
    }
    if (!anyLint) { o.noMatchLint++; o.noMatchSample.push(`${d.name} ${r3(w)}×${r3(h)}`); }
  }
  for (const m of MASTER_LIST) { out[m].reachesBoundSample = names(out[m].reachesBoundSample, namesN); out[m].marksAtCeilingSample = names(out[m].marksAtCeilingSample, namesN); out[m].noMatchSample = names(out[m].noMatchSample, namesN); }
  return out;
}

export function sectionSize(drawings, { namesN = 12 } = {}) {
  const out = byMaster(() => ({ step: 0, sized: 0, small: 0, large: 0, markFamilies: [], containerFamilies: [], noDefault: [] }));
  const index = new Map(drawings.map((d) => [`${d.master}/${d.name}`, d]));
  for (const d of drawings) {
    const o = out[d.master]; o.step = SIZE_STEP[d.master];
    const s = sizeOf(d.name); if (!s) continue;
    o.sized++; o[s]++;
    const base = index.get(`${d.master}/${sizeBase(d.name)}`);
    if (!base) { o.noDefault.push(d.name); continue; }
    const isMark = d.notes.notes.keyline?.parsed?.word === 'mark';
    (isMark ? o.markFamilies : o.containerFamilies).push(sizeBase(d.concept));
  }
  for (const m of MASTER_LIST) {
    for (const k of ['markFamilies', 'containerFamilies']) { out[m][`${k}Count`] = new Set(out[m][k]).size; out[m][k] = names(out[m][k], namesN); }
    out[m].noDefault = names(out[m].noDefault, namesN);
  }
  return out;
}

export function sectionGrid(drawings) {
  const out = byMaster(() => ({ grid: 0, decimals: 0, drawings: 0, coordinates: 0, onGrid: 0, offGrid: 0, offGridDrawings: 0, overPrecision: 0,
                                 onQuarter: 0, eighthOnly: 0, lintPrints: { documented: 0, undocumented: 0 } }));
  for (const d of drawings) {
    const o = out[d.master]; o.grid = gridOf(d.master); o.decimals = decimalsOf(d.master); o.drawings++;
    const PER = Math.round(1 / o.grid);
    for (const x of [...d.ds, ...d.areas]) for (const n of numbersIn(x)) {
      o.coordinates++;
      if (dp(n) > o.decimals) { o.overPrecision++; continue; }
      if (Number.isInteger(n * PER)) o.onGrid++; else o.offGrid++;
      if (Number.isInteger(n * 4)) o.onQuarter++; else if (Number.isInteger(n * 8)) o.eighthOnly++;
    }
    if (d.notes.offGrid.total) { o.offGridDrawings++; o.lintPrints[d.notes.offGrid.lintPrints === 'documented exception' ? 'documented' : 'undocumented']++; }
  }
  return out;
}

// ── the run ────────────────────────────────────────────────────────────────────────────────

/** Run the named sections over a pin. Returns { pin, drawings, concepts, sections: {…} }. */
export function reach(root, sections = SECTIONS, opts = {}) {
  const drawings = loadPin(root, opts.masters);
  const want = new Set(sections.length ? sections : SECTIONS);
  const out = { root, drawings: drawings.length, concepts: new Set(drawings.map((d) => d.concept)).size, sections: {} };
  if (want.has('stroke')) out.sections.stroke = sectionStroke(drawings, opts);
  if (want.has('filled')) out.sections.filled = sectionFilled(drawings, opts);
  if (want.has('bend') || want.has('radius')) {
    const r = sectionRadii(drawings, opts);
    if (want.has('bend')) out.sections.bend = r.bend;
    if (want.has('radius')) out.sections.radius = r.radius;
  }
  if (want.has('gap') || want.has('glyph')) {
    const g = sectionGap(drawings, opts);
    if (want.has('gap')) out.sections.gap = g.gap;
    if (want.has('glyph')) out.sections.glyph = g.glyph;
  }
  if (want.has('keyline')) out.sections.keyline = sectionKeyline(drawings, opts);
  if (want.has('size')) out.sections.size = sectionSize(drawings, opts);
  if (want.has('grid')) out.sections.grid = sectionGrid(drawings);
  return out;
}

// ── printing ───────────────────────────────────────────────────────────────────────────────

const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : '—');
const hist = (h, n = 8) => Object.entries(h).slice(0, n).map(([k, v]) => `${k}×${v}`).join(' · ') || '—';

export function report(res) {
  const L = [];
  L.push(`pin ${res.root} · ${res.drawings} drawings · ${res.concepts} concepts`);
  const S = res.sections;
  if (S.stroke) {
    L.push('\n== stroke — STROKES (masters.mjs:10): files drawn at the master\'s outline weight, and what the weight drags with it');
    for (const m of MASTER_LIST) { const o = S.stroke[m];
      L.push(`  ${m}: stroke ${o.stroke} · ${o.files} files (${o.outline} outline + ${o.shapeFilled} shape-filled) · open ends ${o.openEnds} in ${o.openEndFiles} files · dots ${o.dots} in ${o.dotFiles} files · eighth-only coordinates ${o.eighthOnly} in ${o.eighthOnlyFiles} files${o.sampleEighthOnly.length ? ` (${o.sampleEighthOnly.join(', ')}…)` : ''}`); }
  }
  if (S.filled) {
    L.push('\n== filled — FILLED_WEIGHT (masters.mjs:20): line-heavy filled twins at the heavier weight');
    for (const m of MASTER_LIST) { const o = S.filled[m];
      L.push(`  ${m}: weight ${o.weight} · ${o.lineHeavy} line-heavy files / ${o.lineHeavyConceptCount} concepts · ${o.shapeFilled} shape-filled files / ${o.shapeFilledConceptCount} concepts (${o.mixedShape} also carry strokes at the outline weight) · ${o.outline} outline files`); }
  }
  if (S.bend) {
    L.push('\n== bend — bendMin = weight / 2 (masters.mjs:28): stroked corners measured at it (radii.mjs, ±0.005)');
    for (const m of MASTER_LIST) { const o = S.bend[m];
      L.push(`  ${m}: ${o.atBendMin} stroked fillets at bendMin (${hist(o.bendMin)}) in ${o.atBendMinFiles} files (in outline files ${o.byFile.outline} · in filled files ${o.byFile.filled}); ${o.roleBendAtMin} of them in role bend · role bend: ${o.bends} fillets, ${o.underBendMin} under the floor`);
      L.push(`      typed A radii at bendMin, lint's reading (non-dot stroke paths, legs or not): ${o.typedAtBendMin} in ${o.typedAtBendMinFiles} files · in files at the outline weight ${o.typedAtBendMinOutlineWeight} in ${o.typedAtBendMinOutlineWeightFiles} files`); }
  }
  if (S.radius) {
    L.push(`\n== radius — the container-radius vocabulary (docs/01:310-318): radii.mjs roles, centreline-equivalent radius snapped to a sixteenth, on-tier within ${S.radius[MASTER_LIST[0]].snap}`);
    for (const m of MASTER_LIST) { const o = S.radius[m], c = o.container;
      L.push(`  ${m}: tier ${o.tier} · container corners ${c.corners} (outline files ${c.byFile.outline}, filled ${c.byFile.filled}; on the tier ${c.onTierByFile.outline} + ${c.onTierByFile.filled}): ${hist(c.histogram)}`);
      L.push(`      outline drawings with a rounded container corner ${c.drawingsOnTier + c.drawingsOffTier + c.drawingsMixed} (= concepts ${c.concepts}): every corner on the tier ${c.conceptsOnTierCount} · none ${c.conceptsOffTierCount} (${c.conceptsOffTier.join(', ')}${c.conceptsOffTierCount > c.conceptsOffTier.length ? '…' : ''}) · mixed ${c.conceptsMixedCount} (${c.conceptsMixed.join(', ')}${c.conceptsMixedCount > c.conceptsMixed.length ? '…' : ''}) — filled twins counted in the corner total only (a punched inner contour has no centreline conversion)`);
      L.push(`      detail corners ${o.detail.corners}: ${hist(o.detail.histogram)} · sharp ${o.sharp} · ambiguous ${o.ambiguous}`); }
  }
  if (S.gap) {
    L.push(`\n== gap — MIN_GAP ${MIN_GAP} (masters.mjs:64): every edge gap lint's four measures read, under cap ${S.gap[MASTER_LIST[0]].cap}, band ${S.gap[MASTER_LIST[0]].band}`);
    for (const m of MASTER_LIST) { const o = S.gap[m], r = o.readings, d = o.drawingsBy, a = o.atFloor;
      L.push(`  ${m}: ${o.measured} of ${o.drawings} drawings have a reading under the cap · readings ${r.total}: under ${r.under} · binding [1.49, ${MIN_GAP + o.band}) ${r.binding} · near ${r.near} · clear ${r.clear}`);
      L.push(`      drawn AT the floor (within 0.01 of ${MIN_GAP}): ${a.readings} readings in ${a.drawings} drawings / ${a.conceptCount} concepts; tightest reading at the floor in ${a.tightest} drawings`);
      L.push(`      by smallest reading: under ${d.under} drawings (${o.underDeclared} with a gap: note, ${o.underUndeclared} without — ${o.underReadingsUndeclared} undeclared readings, lint's warnings) · binding ${d.binding} (${o.bindingDeclared} declared, ${o.bindingUndeclared} not) · near ${d.near} · clear ${d.clear} · no reading ${d.none}`);
      L.push(`      by measure: ${Object.entries(o.byMeasure).map(([k, v]) => `${k} ${v.total} (under ${v.under}, binding ${v.binding})`).join(' · ')}`);
      L.push(`      what a floor of 1 / 1.25 / 1.75 / 2 would warn on: ${o.whatIf.floor1} / ${o.whatIf.floor1_25} / ${o.whatIf.floor1_75} / ${o.whatIf.floor2} readings (today ${r.under})`);
      L.push(`      binding e.g. ${o.sampleBinding.join(', ')} · under e.g. ${o.sampleUnder.join(', ')}`); }
  }
  if (S.glyph) {
    L.push(`\n== glyph — GLYPH_GAP ${GLYPH_GAP} (masters.mjs:106): declared glyph files and the readings that need the carve-out`);
    for (const m of MASTER_LIST) { const o = S.glyph[m];
      L.push(`  ${m}: ${o.files} files / ${o.conceptCount} concepts declare glyph: · ${o.readings} glyph-floored readings: under 1 ${o.under1} · in [1, 1.49) ${o.between1and1_5} · at or over 1.5 ${o.atOrOver1_5}${o.sample.length ? ` · e.g. ${o.sample.join(', ')}` : ''}`); }
  }
  if (S.keyline) {
    L.push('\n== keyline — MASTERS[m] keylines / bound / mark (masters.mjs:30-46): ink matching each keyline, to 0.01 and to lint\'s ±0.5');
    for (const m of MASTER_LIST) { const o = S.keyline[m];
      L.push(`  ${m}: ${o.drawings} drawings · opt-outs mark ${o.optOut.mark} · box ${o.optOut.box} · anchor ${o.optOut.anchor} · held to a keyline ${o.held}`);
      L.push(`      exact (0.01): ${hist(o.exact)} · lint (±0.5 on the 2 dp box): ${hist(o.lint)} · no match at ±0.5: ${o.noMatchLint}${o.noMatchSample.length ? ` (${o.noMatchSample.join(', ')})` : ''} — diagonal has the circle's dimensions, so its count repeats the circle's`);
      L.push(`      ink reaching the bound ${o.bound.join('..')}: ${o.reachesBound} (${o.largeAtBound} are -large) e.g. ${o.reachesBoundSample.join(', ')} · marks at the ${o.mark} ceiling: ${o.marksAtCeiling}`); }
  }
  if (S.size) {
    L.push('\n== size — SIZE_STEP (masters.mjs:52): -small / -large families');
    for (const m of MASTER_LIST) { const o = S.size[m];
      L.push(`  ${m}: step ${o.step} · ${o.sized} sized files (${o.small} small, ${o.large} large) · mark families ${o.markFamiliesCount} (${o.markFamilies.join(', ')}) · container families ${o.containerFamiliesCount} (${o.containerFamilies.join(', ')})${o.noDefault.length ? ` · no default: ${o.noDefault.join(', ')}` : ''}`); }
  }
  if (S.grid) {
    L.push('\n== grid — gridOf / decimalsOf (masters.mjs:79-84): coordinates per master');
    for (const m of MASTER_LIST) { const o = S.grid[m];
      L.push(`  ${m}: grid ${o.grid} · ${o.decimals} dp · ${o.coordinates} coordinates: on grid ${o.onGrid} (${pct(o.onGrid, o.coordinates)}) · off ${o.offGrid} in ${o.offGridDrawings} drawings (lint prints documented ${o.lintPrints.documented}, undocumented ${o.lintPrints.undocumented}) · over precision ${o.overPrecision} · on the quarter grid ${o.onQuarter} · eighth-only ${o.eighthOnly}`); }
  }
  return L.join('\n');
}

// ── CLI ────────────────────────────────────────────────────────────────────────────────────

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const opts = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') opts.json = true;
    else if (args[i] === '--cap') opts.cap = Number(args[++i]);
    else if (args[i] === '--band') opts.band = Number(args[++i]);
    else if (args[i] === '--names') opts.namesN = Number(args[++i]);
    else if (args[i].startsWith('--')) { console.error(`unknown option ${args[i]}`); process.exit(2); }
    else positional.push(args[i]);
  }
  const [root, ...sections] = positional;
  if (!root) { console.error('usage: node tools/audit/parameter-reach.mjs <pin-dir> [section…] [--json] [--cap N] [--band N] [--names N]'); process.exit(2); }
  const bad = sections.filter((s) => !SECTIONS.includes(s));
  if (bad.length) { console.error(`unknown section(s) ${bad.join(', ')} — one of ${SECTIONS.join(', ')}`); process.exit(2); }
  const res = reach(root, sections, opts);
  if (opts.json) console.log(JSON.stringify(res, null, 1));
  else console.log(report(res));
}
