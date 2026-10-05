#!/usr/bin/env node
// OPTICAL CORRECTION AS A SYSTEM — audit card 1.11. Every figure in
// docs/audit/findings-optical.md prints from here.
//
// AUDIT ONLY: imported by nothing in lint, build or the lab. Reads an archived pin and writes
// nothing in the repo. One section, `sheet`, runs the PIN's own tools/optical-sheet.mjs inside
// the pin directory, which rewrites that copy's lab/drafts/current.js; it refuses any directory
// that holds a .git, so it cannot be pointed at the repo.
//
// Usage:
//   P=/tmp/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   node tools/audit/optical-probe.mjs $P [section …]
// Sections (default: all but `sheet`, which spawns a process):
//   census       every `optical:` note at the pin, and each against C15's measure        (§1)
//   sheet        proves `triangleOffset` here equals the sheet's on all single-bend concepts (§1)
//   offcentre    the drawings that publish shift [0,0] with their ink off centre, by cause  (§2)
//   should       C15's measure on every drawing it is defined on, declared or not          (§3)
//   screen       the mass screen for everything C15 does not cover — a screen, not a rule  (§3)
//   consistency  siblings: turned, mirrored, sized, filled                                 (§4)
//   alpha        what the published optical bearings do at other values of `alpha`         (§5)
//   r10          volume-off at 16 and watch-2, measured                                    (§6)
//   reconcile    the counts other cards took, recomputed under their own definitions
//
// WHAT IT MEASURES, and with whose instrument:
//  · The C15 recommendation is tools/optical-sheet.mjs's `triangleOffset` (the triangle through a
//    single-bend mark's two ends and its bend apex, its centre's offset from the ink-box centre,
//    × K = 0.5, rounded to 0.05), restated here line for line. The sheet itself cannot be
//    imported — it is a CLI that writes the board when it loads — so the `sheet` section runs it
//    in the pin and compares. Its `mirrors` test (which axes a shape is lopsided on) is restated
//    the same way.
//  · Ink boxes are the pin's own build's (dist/icons.json), 2 dp, arc-sampled — so the other
//    cards' counts reproduce exactly. bbox() can sit up to 0.0056 inside a true arc edge (plan,
//    "Known instrument defects"), which is why the off-centre bands start at 0.005.
//  · The mass screen is the stroke centreline weighted by its length, outline files only. It is
//    a SCREEN for shapes lopsided by mass, not C15's measure (C15: "ink or line mass is not the
//    measure"), and it never uses raster.mjs (its `classify` defect on area paths).
//  · The alpha figures call the pin's own tools/optical.mjs with its `alpha` argument.

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { samplePath, bbox } from '../geometry.mjs';
import { sizeBase, sizeOf, gridOf, MASTERS } from '../masters.mjs';
import { readSvg, inkBoxOf } from './metrics-check.mjs';   // card 1.12's solved ink box, for the reconciliation only

export const K = 0.5;                                   // C15: move against the end triangle's offset by half of it
export const MASTER_LIST = [24, 20, 16];
export const r2 = (v) => Math.round(v * 100) / 100 || 0;
export const r05 = (v) => Math.round(v * 20) / 20 || 0;
const r3 = (v) => Math.round(v * 1000) / 1000 || 0;
const f = (v, d = 2) => (v == null || !Number.isFinite(v) ? String(v) : v.toFixed(d));
const sgn = (v, d = 2) => (v > 0 ? '+' : '') + f(v, d);
const NOTE_KEYS = /^(keyline|tags|optical|box|glyph|anchor|grows|gap):/;

// ── reading the pin ────────────────────────────────────────────────────────

/** The notes a file declares, and its free prose (every comment that is not a keyed note). */
export function readNotes(src) {
  const keyed = [...src.matchAll(/<!--\s*(keyline|tags|optical|box|glyph|anchor|grows|gap):\s*([^>]*?)\s*-->/g)];
  const get = (k) => keyed.find((x) => x[1] === k)?.[2] ?? null;
  const opt = get('optical');
  const prose = [...src.matchAll(/<!--\s*([\s\S]*?)\s*-->/g)].map((x) => x[1].trim()).filter((t) => !NOTE_KEYS.test(t)).join(' ');
  return { optical: opt ? opt.split(/\s+/).map(Number) : null, anchor: get('anchor'), box: get('box'), keyline: get('keyline'), glyph: get('glyph'), prose };
}

/** Every drawing at the pin: the build's own paths, areas, ink box and shift, plus the file's notes. */
export function readPin(pin) {
  const icons = JSON.parse(readFileSync(join(pin, 'dist/icons.json'), 'utf8'));
  const all = [];
  for (const m of MASTER_LIST) for (const [name, i] of Object.entries(icons[m])) {
    const src = readFileSync(join(pin, 'src/icons', String(m), `${name}.svg`), 'utf8');
    all.push({ master: m, name, concept: name.replace(/-filled$/, ''), style: /-filled$/.test(name) ? 'filled' : 'outline',
      paths: i.paths, areas: i.areas, stroke: i.stroke, ink: i.ink, shift: i.shift, tags: i.tags ?? [], ...readNotes(src) });
  }
  return all;
}

// ── C15's measure, as the sheet computes it ────────────────────────────────

/** tools/optical-sheet.mjs `triangleOffset`, line for line: the triangle through a single-bend
 *  mark's two ends and its bend apex, its centre's offset from the ink-box centre. null unless the
 *  drawing is one open bend (one path, M L A L). The `areas` test is this file's addition: it only
 *  excludes shape-filled files, which the sheet never measures. */
export function triangleOffset(i) {
  if (i.paths.length !== 1 || i.areas?.length) return null;
  const n = i.paths[0].match(/[A-Za-z]|-?[\d.]+/g);
  if (n.join('').replace(/[-\d.]/g, '') !== 'MLAL') return null;
  const v = n.filter((x) => !/[A-Za-z]/.test(x)).map(Number);
  const S = [v[0], v[1]], P1 = [v[2], v[3]], r = v[4], P2 = [v[9], v[10]], E = [v[11], v[12]];
  const M = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2];
  const half = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]) / 2;
  const sag = r - Math.sqrt(Math.max(r * r - half * half, 0));
  const inward = [(S[0] + E[0]) / 2 - M[0], (S[1] + E[1]) / 2 - M[1]];
  const len = Math.hypot(...inward) || 1;
  const A = [M[0] - sag * inward[0] / len, M[1] - sag * inward[1] / len];
  const box = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];
  return [(S[0] + A[0] + E[0]) / 3 - box[0], (S[1] + A[1] + E[1]) / 3 - box[1]];
}

/** The sheet's recommendation from a triangle offset: −K × offset, to 0.05, per axis. */
export const recommend = (tri) => tri.map((v) => r05(-K * v));

/** The bend's geometry, with two apexes: the sheet's (the chord midpoint pushed by the arc's sag
 *  along the line toward the ends' midpoint — the arc's midpoint only when the two legs are equal)
 *  and the true one (the arc's midpoint: geometry.mjs samples 64 points per arc, so sample 32 is
 *  the half-sweep point). null unless the drawing is one open bend. */
export function bendGeometry(i) {
  if (i.paths.length !== 1 || i.areas?.length) return null;
  const n = i.paths[0].match(/[A-Za-z]|-?[\d.]+/g);
  if (n.join('').replace(/[-\d.]/g, '') !== 'MLAL') return null;
  const v = n.filter((x) => !/[A-Za-z]/.test(x)).map(Number);
  const S = [v[0], v[1]], P1 = [v[2], v[3]], r = v[4], fA = v[7], fS = v[8], P2 = [v[9], v[10]], E = [v[11], v[12]];
  const M = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2];
  const half = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]) / 2;
  const sag = r - Math.sqrt(Math.max(r * r - half * half, 0));
  const inward = [(S[0] + E[0]) / 2 - M[0], (S[1] + E[1]) / 2 - M[1]];
  const len = Math.hypot(...inward) || 1;
  const apexSheet = [M[0] - sag * inward[0] / len, M[1] - sag * inward[1] / len];
  const apexTrue = samplePath(`M${P1[0]} ${P1[1]}A${r} ${r} 0 ${fA} ${fS} ${P2[0]} ${P2[1]}`)[32];
  const toM = Math.hypot(M[0] - apexTrue[0], M[1] - apexTrue[1]) || 1;
  const centre = [apexTrue[0] + r * (M[0] - apexTrue[0]) / toM, apexTrue[1] + r * (M[1] - apexTrue[1]) / toM];
  const legs = [Math.hypot(S[0] - P1[0], S[1] - P1[1]), Math.hypot(E[0] - P2[0], E[1] - P2[1])];
  return { S, E, apexSheet, apexTrue, apexGap: Math.hypot(apexTrue[0] - apexSheet[0], apexTrue[1] - apexSheet[1]),
    offArc: Math.abs(Math.hypot(apexSheet[0] - centre[0], apexSheet[1] - centre[1]) - r), legRatio: Math.max(...legs) / Math.min(...legs) };
}

/** C15's end triangle with the TRUE apex (the arc's midpoint), the same offset otherwise. */
export function triangleOffsetTrue(i) {
  const g = bendGeometry(i);
  if (!g) return null;
  const box = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];
  return [(g.S[0] + g.apexTrue[0] + g.E[0]) / 3 - box[0], (g.S[1] + g.apexTrue[1] + g.E[1]) / 3 - box[1]];
}

/** tools/optical-sheet.mjs `mirrors`: does the drawing mirror onto itself across its ink box's
 *  vertical / horizontal centre line (every sampled point has a partner within 0.2)? Same test,
 *  with a spatial hash so it can run over the whole set. */
export function mirrors(i) {
  const pts = [...i.paths, ...(i.areas ?? [])].flatMap((d) => samplePath(d));
  const [cx, cy] = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];
  const cell = 0.2, key = (x, y) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
  const grid = new Map();
  for (const [x, y] of pts) { const k = key(x, y); (grid.get(k) ?? grid.set(k, []).get(k)).push([x, y]); }
  const has = (x, y) => {
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const bucket = grid.get(`${Math.floor(x / cell) + dx},${Math.floor(y / cell) + dy}`);
      if (bucket && bucket.some((q) => Math.hypot(q[0] - x, q[1] - y) < 0.2)) return true;
    }
    return false;
  };
  return [pts.every(([x, y]) => has(2 * cx - x, y)), pts.every(([x, y]) => has(x, 2 * cy - y))];
}

// ── placement measures ─────────────────────────────────────────────────────

/** The ink-box centre's offset from the canvas centre, [dx, dy]. */
export const centreOffset = (ink, canvas) => [r3(ink.x + ink.w / 2 - canvas / 2), r3(ink.y + ink.h / 2 - canvas / 2)];

/** Would an exactly centred box put its edges off the master's grid? If so, and the drawing sits
 *  within half a grid step of centre, the offset is what rounding to the grid costs. */
export function gridRounding(ink, canvas, grid, off) {
  const out = [];
  for (const a of [0, 1]) {
    const w = a ? ink.h : ink.w, edge = a ? ink.y : ink.x;
    const centred = (canvas - w) / 2;
    const onGrid = (v) => Math.abs(v / grid - Math.round(v / grid)) < 1e-6;
    out.push({ centredEdgeOnGrid: onGrid(centred), edgeOnGrid: onGrid(edge), extentOnGrid: onGrid(w),
      rounding: !onGrid(centred) && Math.abs(off[a]) > 0.005 && Math.abs(off[a]) <= grid / 2 + 1e-6 });
  }
  return out;
}

/** The drawing's parts — each stroke path grown by half its stroke, each area subpath as it is —
 *  with their ink boxes. */
export function partsOf(i) {
  const h = i.stroke / 2, parts = [];
  i.paths.forEach((d, k) => { const b = bbox([d]); parts.push({ kind: 'stroke', index: k, d, box: [b.x0 - h, b.y0 - h, b.x1 + h, b.y1 + h] }); });
  (i.areas ?? []).forEach((d, k) => d.split(/(?=M)/).filter((s) => s.trim()).forEach((sub, j) => {
    const b = bbox([sub]); parts.push({ kind: 'area', index: `${k}.${j}`, d: sub, box: [b.x0, b.y0, b.x1, b.y1] });
  }));
  return parts;
}

const union = (boxes) => [0, 1, 2, 3].map((k) => (k < 2 ? Math.min : Math.max)(...boxes.map((b) => b[k])));

/** Does one part stand proud? True when removing exactly one part leaves the rest centred on the
 *  axis the whole drawing is off on (within `tol`). Returns that part and how far it stands past
 *  the rest, or null. */
export function partProud(i, canvas, off, tol = 0.01) {
  const parts = partsOf(i);
  if (parts.length < 2) return null;
  for (const a of [0, 1]) {
    if (Math.abs(off[a]) <= 0.005) continue;
    for (let k = 0; k < parts.length; k++) {
      const rest = union(parts.filter((_, j) => j !== k).map((p) => p.box));
      const c = a ? (rest[1] + rest[3]) / 2 : (rest[0] + rest[2]) / 2;
      if (Math.abs(c - canvas / 2) > tol) continue;
      const whole = union(parts.map((p) => p.box));
      const past = a ? Math.max(rest[1] - whole[1], whole[3] - rest[3]) : Math.max(rest[0] - whole[0], whole[2] - rest[2]);
      return { axis: a ? 'y' : 'x', part: parts[k], past: r3(past), restCentre: r3(c) };
    }
  }
  return null;
}

/** Is the drawing's body — its largest part by box area — centred on the axis the whole is off on,
 *  while smaller parts (legs, a needle, teeth) set the box? Returns the body and how many other
 *  parts there are, or null. */
export function bodyCentred(i, canvas, off, tol = 0.01) {
  const parts = partsOf(i);
  if (parts.length < 2) return null;
  const area = (b) => (b[2] - b[0]) * (b[3] - b[1]);
  const body = parts.reduce((a, b) => (area(b.box) > area(a.box) ? b : a));
  for (const a of [0, 1]) {
    if (Math.abs(off[a]) <= 0.005) continue;
    const c = a ? (body.box[1] + body.box[3]) / 2 : (body.box[0] + body.box[2]) / 2;
    if (Math.abs(c - canvas / 2) > tol) return null;
  }
  return { body, others: parts.length - 1 };
}

/** How close an edge must be to a keyline edge to count as on it: the build's box is 2 dp, so an
 *  edge computed as x + w carries two roundings (≤ 0.01) plus float noise (list-bullet at 16:
 *  2.38 + 11.63 = 14.010000000000002). */
export const EDGE_TOL = 0.0151;

/** Does one edge of the ink sit on a keyline edge of its master (square, circle, portrait,
 *  landscape, or the mark ceiling) while the opposite edge falls short of that keyline? A
 *  DESCRIPTION of how the box came to be off centre — the keyline check is satisfied by one edge
 *  — not a reason the far side fell short. */
export function keylineEdgeHeld(i, canvas, off) {
  const K = MASTERS[canvas];
  for (const a of [0, 1]) {
    if (Math.abs(off[a]) <= 0.005) continue;
    const lo = a ? i.ink.y : i.ink.x, hi = lo + (a ? i.ink.h : i.ink.w);
    const extents = [...new Set([...Object.values(K.keylines).map((k) => k[a]), K.mark])];
    for (const e of extents) {
      const kLo = (canvas - e) / 2, kHi = (canvas + e) / 2;
      if (off[a] < 0 && Math.abs(lo - kLo) < EDGE_TOL && hi < kHi - 0.005) return { axis: 'xy'[a], keyline: e, held: a ? 'top' : 'left', short: r3(kHi - hi) };
      if (off[a] > 0 && Math.abs(hi - kHi) < EDGE_TOL && lo > kLo + 0.005) return { axis: 'xy'[a], keyline: e, held: a ? 'bottom' : 'right', short: r3(lo - kLo) };
    }
  }
  return null;
}

/** Does ANY edge of the ink sit on a keyline edge of its master (either side, either axis)? The
 *  geometry alone, for the whole set, to show how common it is. */
export function onKeylineEdge(i, canvas) {
  const K = MASTERS[canvas];
  for (const a of [0, 1]) {
    const lo = a ? i.ink.y : i.ink.x, hi = lo + (a ? i.ink.h : i.ink.w);
    for (const e of new Set([...Object.values(K.keylines).map((k) => k[a]), K.mark])) {
      if (Math.abs(lo - (canvas - e) / 2) < EDGE_TOL || Math.abs(hi - (canvas + e) / 2) < EDGE_TOL) return true;
    }
  }
  return false;
}

/** Files whose prose states a REASON for the off-centre placement — read by hand from the `prose`
 *  section's output (2026-10-05, re-read after review). THE READING: a reason is stated when the
 *  file's own prose names a constraint the placement serves — edges on whole pixels, a keyline edge
 *  or its tolerance, a part's job, C17's one-sided growth, a tooth on top. Recording the offset
 *  ("Box 0.25 right of centre … as B", attachment-2), saying "centred" of a box that is not (bug,
 *  the rotate-ccw family, wand, megaphone), or pointing at a sibling ("same box … as A", map-pin-2)
 *  does not count. The tool counts the population entries the list covers. */
export const STATED_REASON = [
  { concept: 'volume-off', masters: [16], reason: 'an odd 7-wide speaker cannot be centred without half-pixel edges; moved 3 not 3.5, judged balanced at real size' },
  { concept: 'map-pin-4', masters: [24, 20, 16], reason: 'the head centre sits on a whole pixel (ring and sides crisp)' },
  { concept: 'list-bullet', masters: [24, 20, 16], reason: 'C17: the filled twin fills the mark box centred; the outline sits right by half the dot\'s one-sided growth' },
  { concept: 'list-bullet-2', masters: [24, 20, 16], reason: 'the same C17 placement, stated in its own file' },
  { concept: 'gear-3', masters: [24, 16], reason: 'odd tooth counts: a tooth on top, a valley at the bottom' },
  { concept: 'map-pin', masters: [20, 16], reason: 'the keyline\'s 0.5 tolerance on height, so the pin does not grow pointier; the head keeps the keyline top' },
  { concept: 'watch-2', masters: [24, 20, 16], reason: 'the crown separates a watch from a phone; agreed box 0.5 off the case centre' },
  { concept: 'pin-4', masters: [24, 16], reason: 'flat edges moved until their outer edges sit on whole pixels' },
  { concept: 'pin-5', masters: [24, 20, 16], reason: 'taper and skirt edges on whole pixels at every master; flat edges moved until their outer edges sit on whole pixels' },
  { concept: 'pin-6', masters: [24, 20, 16], reason: 'skirt edges on whole pixels at every master; flat edges moved until their outer edges sit on whole pixels' },
];
export const statedReason = (i) => STATED_REASON.find((s) => s.concept === i.concept && s.masters.includes(i.master)) ?? null;

/** Placement words in a file's prose — a text screen for a shift that was drawn in and written
 *  about but never declared. Returns the matched snippets. */
export function proseHints(prose) {
  const re = /(optical(?:ly)?|shift(?:ed|s)?|lift(?:ed|s)?|raised|standing [^.]{0,30}high|moved? (?:left|right|up|down)|moves (?:left|right|up|down)|were moved|moved until|off[- ]centre|off the [^.]{0,20}centre|(?:left|right|above|below) of (?:the )?(?:canvas )?centre|(?:above|below) the canvas centre|whole pixels?|half[- ]pixels?|mass centre|centre of (?:area|mass)|reads balanced|read(?:s)? (?:high|low|left|right)|centre x [\d.]+)/gi;
  const out = [];
  for (const m of prose.matchAll(re)) out.push(prose.slice(Math.max(0, m.index - 45), m.index + m[0].length + 45).replace(/\s+/g, ' '));
  return out;
}

/** Mass screen: the stroke centreline's centroid, weighted by length, over every subpath. For a
 *  stroke of even width this is its ink's mass centre up to the caps. Returns [x, y, length]. */
export function centrelineCentroid(paths) {
  let L = 0, sx = 0, sy = 0;
  for (const d of paths) for (const sub of d.split(/(?=M)/).filter((s) => s.trim())) {
    const pts = samplePath(sub);
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1], [x1, y1] = pts[k], len = Math.hypot(x1 - x0, y1 - y0);
      if (!len) continue;
      L += len; sx += len * (x0 + x1) / 2; sy += len * (y0 + y1) / 2;
    }
  }
  return L ? [sx / L, sy / L, L] : null;
}

/** A closed shape's area centroid (shoelace on the sampled centreline polygon). */
export function polygonCentroid(d) {
  const pts = samplePath(d);
  let A = 0, cx = 0, cy = 0;
  for (let k = 0; k < pts.length; k++) {
    const [x0, y0] = pts[k], [x1, y1] = pts[(k + 1) % pts.length], c = x0 * y1 - x1 * y0;
    A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c;
  }
  if (Math.abs(A) < 1e-9) return null;
  return [cx / (3 * A), cy / (3 * A), Math.abs(A) / 2];
}

/** One closed path of three straight sides, each corner rounded by a pair of arcs — the build
 *  play and alert-triangle share (M AA L AA L AA Z). */
export function isClosedTriangle(d) {
  return d.match(/[A-Za-z]/g).join('') === 'MAALAALAAZ';
}

/** How a shape's shift is recorded, from its geometry. */
export function shapeClass(i) {
  if (triangleOffset(i)) return 'single bend';
  if (i.paths.length && isClosedTriangle(i.paths[0])) return 'closed triangle';
  if (i.areas?.length && isClosedTriangle(i.areas[0].split(/(?=M)/)[0])) return 'closed triangle';
  return 'other';
}

// ── the sheet, run in the pin ──────────────────────────────────────────────

/** Runs the pin's own tools/optical-sheet.mjs on `names` and returns what it printed for each:
 *  the triangle offset and the measured recommendation. Refuses a directory with a .git. */
export function sheetRun(pin, names) {
  if (existsSync(join(pin, '.git'))) throw new Error(`${pin} holds a .git: the sheet writes lab/drafts/current.js, so it only runs in an archived pin`);
  if (resolve(pin) === resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')) throw new Error('refusing to run the sheet in the repo');
  const out = execFileSync(process.execPath, ['tools/optical-sheet.mjs', ...names], { cwd: pin, encoding: 'utf8' });
  const rows = {};
  for (const line of out.split('\n')) {
    const m = line.match(/^(\S+)\s+(.*?) · triangle (-?[\d.]+), (-?[\d.]+) → measured (-?[\d.]+), (-?[\d.]+) · recommended (-?[\d.]+), (-?[\d.]+) · shipped (-?[\d.]+), (-?[\d.]+)/);
    if (m) rows[m[1]] = { axes: m[2], tri: [+m[3], +m[4]], measured: [+m[5], +m[6]], recommended: [+m[7], +m[8]], shipped: [+m[9], +m[10]] };
  }
  return rows;
}

// ── helpers ────────────────────────────────────────────────────────────────
const head = (t) => console.log(`\n## ${t}`);
const px16 = (u, m) => u * 16 / m;                       // a unit of this master, rendered at 16 px
const q = (arr, p) => { const a = [...arr].sort((x, y) => x - y); if (!a.length) return NaN; const i = (a.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); };
const byName = (a, b) => a.name.localeCompare(b.name) || a.master - b.master;
const extent = (i, a) => (a ? i.ink.h : i.ink.w);
const DIRS = ['down', 'up', 'left', 'right'];

// ── census (§1) ────────────────────────────────────────────────────────────
function census(all) {
  head('census (§1) — every optical: note at the pin');
  const noted = all.filter((i) => i.optical);
  const concepts = [...new Set(noted.map((i) => i.concept))].sort();
  const pairs = new Set(noted.map((i) => i.optical.join(' ')));
  const axis = (s) => (s[0] && s[1] ? 'both' : s[0] ? 'x' : s[1] ? 'y' : 'zero');
  const axes = {}; for (const i of noted) axes[axis(i.optical)] = (axes[axis(i.optical)] ?? 0) + 1;
  console.log(`files with a note: ${noted.length} · concepts: ${concepts.length} · distinct dx dy pairs: ${pairs.size} · by axis: ${JSON.stringify(axes)}`);
  const styles = { same: 0, differ: 0 };
  for (const o of noted.filter((i) => i.style === 'outline')) {
    const t = all.find((j) => j.master === o.master && j.name === `${o.name}-filled`);
    styles[t && t.optical && t.optical.join() === o.optical.join() ? 'same' : 'differ']++;
  }
  console.log(`outline note == filled twin's note: ${styles.same} of ${styles.same + styles.differ} concept-masters`);
  const classes = {}; for (const c of concepts) { const o = all.find((i) => i.master === 24 && i.name === c); classes[shapeClass(o)] = (classes[shapeClass(o)] ?? 0) + 1; }
  console.log(`shape classes (at 24): ${JSON.stringify(classes)}`);
  console.log(`\nshift declared ≠ shift the build published (dist shift field): ${noted.filter((i) => i.optical.join() !== i.shift.join()).length}`);
  // A note records the CENTRE; the drawing's coordinates are what the grid rule binds. Are the declared files' ink-box edges on their master's grid?
  const onGrid = (v, g) => Math.abs(v / g - Math.round(v / g)) < 1e-6;
  for (const m of MASTER_LIST) {
    const files = noted.filter((i) => i.master === m), g = gridOf(m);
    const edges = files.filter((i) => [i.ink.x, i.ink.y, i.ink.x + i.ink.w, i.ink.y + i.ink.h].every((v) => onGrid(v, g)));
    const vals = files.filter((i) => i.optical.every((v) => onGrid(v, g)));
    console.log(`@${m}: declared files ${files.length} · ink-box edges all on the ${g} grid: ${edges.length} · declared value itself on that grid: ${vals.length} (a centre of an on-grid box sits on half that grid)`);
  }

  console.log('\nconcept | class | declared 24 · 20 · 16 | C15 measure on this drawing (its own triangle × 0.5, to 0.05) 24 · 20 · 16 | declared − measured | sheet convention (default at 24, scaled by ink extent) 24 · 20 · 16');
  for (const c of concepts) {
    const rows = MASTER_LIST.map((m) => all.find((i) => i.master === m && i.name === c));
    const cls = shapeClass(rows[0]);
    const decl = rows.map((i) => i.optical.join(' '));
    const a = rows[0].optical[0] ? 0 : 1;                       // the declared axis
    let own = '—', diff = '—', conv = '—';
    if (cls === 'single bend') {
      const recs = rows.map((i) => recommend(triangleOffset(i)));
      own = recs.map((r) => f(r[a])).join(' · ');
      diff = rows.map((i, k) => sgn(i.optical[a] - recs[k][a])).join(' · ');
      const def24 = all.find((i) => i.master === 24 && i.name === sizeBase(c));
      const rec24 = recommend(triangleOffset(def24))[a];
      conv = rows.map((i) => f(rec24 * extent(i, a) / extent(def24, a))).join(' · ');
    } else if (cls === 'closed triangle') {
      // The triangle's own centroid against the ink-box centre is shift-invariant (both move with the drawing).
      const raw = rows.map((i) => { const pc = polygonCentroid(i.paths[0]); return -K * (pc[a] - (a ? i.ink.y + i.ink.h / 2 : i.ink.x + i.ink.w / 2)); });
      const cents = raw.map(r05);
      own = `no C15 measure; screen: the triangle's centroid × 0.5 → ${cents.map((v) => f(v)).join(' · ')} (raw ${raw.map((v) => f(v, 3)).join(' · ')})`;
      diff = rows.map((i, k) => sgn(i.optical[a] - cents[k])).join(' · ');
    } else {
      own = 'C15 undefined (a glyph inside a ring; C18 records the derivation)';
    }
    console.log(`${c} | ${cls} | ${decl.join(' · ')} | ${own} | ${diff} | ${conv}`);
  }

  // info-2 / info-3: the mark's mass against the ring's centre, after the declared shift (C18's stated intent).
  console.log('\ninfo family — centreline mass centre of the mark (paths after the ring) against the canvas centre, as shipped (C18: "moved left … so its mass is centred"; info-3 "mass sits 0.94 low box-centred, the lift brings that to 0.59"):');
  for (const c of ['info', 'info-2', 'info-3']) for (const m of MASTER_LIST) {
    const i = all.find((j) => j.master === m && j.name === c); if (!i) continue;
    const mc = centrelineCentroid(i.paths.slice(1));
    console.log(`  ${c} @${m}: declared ${i.optical ? i.optical.join(' ') : 'none'} · mark mass centre ${f(mc[0])}, ${f(mc[1])} → off canvas centre ${sgn(mc[0] - m / 2)}, ${sgn(mc[1] - m / 2)}`);
  }
}

// ── sheet (§1) ─────────────────────────────────────────────────────────────
function sheet(all, pin) {
  head('sheet (§1) — tools/optical-sheet.mjs run in the pin against this file\'s triangleOffset');
  const names = [...new Set(all.filter((i) => i.master === 24 && i.style === 'outline' && triangleOffset(i)).map((i) => i.name))].sort();
  const rows = sheetRun(pin, names);
  let agree = 0, seen = 0;
  for (const n of names) {
    const i = all.find((j) => j.master === 24 && j.name === n), s = rows[n];
    if (!s) { console.log(`  ${n}: the sheet printed no measure`); continue; }
    seen++;
    // The sheet measures the FAMILY DEFAULT's triangle for a size variant; compare like with like.
    const def = all.find((j) => j.master === 24 && j.name === sizeBase(n));
    const tri = triangleOffset(def).map(r2), rec = recommend(triangleOffset(def));
    const ok = tri.every((v, a) => Math.abs(v - s.tri[a]) < 0.006) && rec.every((v, a) => Math.abs(v - s.measured[a]) < 1e-9);
    if (ok) agree++; else console.log(`  DISAGREE ${n}: sheet triangle ${s.tri} measured ${s.measured} · here ${tri} ${rec}`);
    if (n === sizeBase(n)) console.log(`  ${n.padEnd(18)} ${s.axes.padEnd(42)} triangle ${s.tri.map((v) => f(v)).join(', ')} → measured ${s.measured.join(', ')} · shipped ${s.shipped.join(', ')}`);
  }
  console.log(`agree on ${agree} of ${seen} single-bend concepts (triangle to 0.005, recommendation exactly)`);
}

// ── offcentre (§2) ─────────────────────────────────────────────────────────
/** The drawings that publish shift [0,0] with their ink centre more than 0.005 off the canvas
 *  centre (card 1.12 §4's definition, on the build's own 2 dp ink box), each with a cause:
 *  anchor (C28) · a part standing proud · grid rounding · a placement described in the file's
 *  prose (the filled twin inherits its outline's prose; the pair is drawn together) · none. */
export function classifyOffcentre(all) {
  const pop = all.filter((i) => !i.shift[0] && !i.shift[1]).map((i) => ({ i, off: centreOffset(i.ink, i.master) }))
    .filter(({ off }) => Math.max(Math.abs(off[0]), Math.abs(off[1])) > 0.005);
  const anchored = pop.filter(({ i }) => i.anchor), rest = pop.filter(({ i }) => !i.anchor);
  const classed = rest.map((e) => {
    const { i, off } = e;
    const proud = partProud(i, i.master, off);
    const body = proud ? null : bodyCentred(i, i.master, off);
    const geometry = keylineEdgeHeld(i, i.master, off);          // the keyline-edge geometry, whatever else holds
    const held = proud || body ? null : geometry;
    const grid = gridRounding(i.ink, i.master, gridOf(i.master), off);
    const twin = i.style === 'filled' ? all.find((j) => j.master === i.master && j.name === i.concept) : null;
    const own = proseHints(i.prose), hints = own.length ? own : twin ? proseHints(twin.prose) : [];
    const mag = Math.max(Math.abs(off[0]), Math.abs(off[1]));
    const underStep = grid.some((g) => g.rounding) && mag <= gridOf(i.master) / 2 + 1e-6;   // both axes within half a step
    const cause = proud ? 'part standing proud' : body ? 'body centred, parts set the box' : held ? 'one edge on the keyline, the other side short'
      : underStep ? 'under half a grid step' : hints.length ? 'placement in prose' : 'no visible reason';
    // The offset from the unrounded box (the build rounds x and w separately, which can add up to 0.0075).
    const tb = union(partsOf(i).map((p) => p.box)), r4 = (v) => Math.round(v * 10000) / 10000 || 0;
    const offTrue = [r4((tb[0] + tb[2]) / 2 - i.master / 2), r4((tb[1] + tb[3]) / 2 - i.master / 2)];
    return { ...e, proud, body, held, geometry, grid, hints, inherited: !own.length && hints.length > 0, mag, cause, offTrue, reason: statedReason(i) };
  });
  const groups = {};
  for (const c of classed) (groups[c.cause] ??= []).push(c);
  return { pop, anchored, rest, classed, groups };
}

function offcentre(all) {
  head('offcentre (§2) — shift [0,0] published, ink centre > 0.005 off the canvas centre (card 1.12 §4\'s definition)');
  const { pop, anchored, rest, classed, groups } = classifyOffcentre(all);
  console.log(`entries: ${pop.length} · anchored (C28): ${anchored.length} · not anchored: ${rest.length}`);
  const bands = (list) => `≤0.1: ${list.filter((c) => c.mag <= 0.1).length} · (0.1,0.25]: ${list.filter((c) => c.mag > 0.1 && c.mag <= 0.25).length} · (0.25,0.5]: ${list.filter((c) => c.mag > 0.25 && c.mag <= 0.5).length} · >0.5: ${list.filter((c) => c.mag > 0.5).length}`;
  console.log(`\nbands over the ${rest.length}: ${bands(classed)}`);
  console.log(`by master: ${MASTER_LIST.map((m) => `${m}: ${classed.filter((c) => c.i.master === m).length}`).join(' · ')} · by style: outline ${classed.filter((c) => c.i.style === 'outline').length}, filled ${classed.filter((c) => c.i.style === 'filled').length}`);
  console.log(`concepts touched: ${new Set(classed.map((c) => c.i.concept)).size}`);
  console.log('\ncause | entries | concepts | offset range (units) | as px at the master\'s own size | as px rendered at 16 | ≤ 0.125 | prose overlap');
  for (const [cause, list] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) {
    const mags = list.map((c) => c.mag), p16 = list.map((c) => px16(c.mag, c.i.master));
    console.log(`${cause} | ${list.length} | ${new Set(list.map((c) => c.i.concept)).size} (${[...new Set(list.map((c) => c.i.concept))].sort().join(', ')}) | ${f(Math.min(...mags), 3)} – ${f(Math.max(...mags), 3)} | ${f(Math.min(...mags), 2)} – ${f(Math.max(...mags), 2)} | ${f(Math.min(...p16), 2)} – ${f(Math.max(...p16), 2)} | ${list.filter((c) => c.mag <= 0.125 + 1e-6).length} | ${list.filter((c) => c.hints.length).length}`);
  }
  const g = groups['under half a grid step'] ?? [];
  const snapped = g.filter((c) => c.grid.some((x) => x.rounding && x.edgeOnGrid));
  console.log(`under half a grid step, split by what the drawer did: an edge snapped to the grid (rounding) ${snapped.length} · neither edge on the grid, the extent set by an arc or tangent extreme ${g.length - snapped.length} (of which extent off the grid: ${g.filter((c) => !snapped.includes(c) && c.grid.some((x) => x.rounding && !x.extentOnGrid)).length})`);
  console.log(`by largest offset: ${MASTER_LIST.map((m) => { const at = classed.filter((c) => c.i.master === m); return `@${m} max ${f(Math.max(...at.map((c) => c.mag)), 3)} (${at.filter((c) => c.mag >= 0.25).length} ≥ 0.25)`; }).join(' · ')}`);
  const within = classed.filter((c) => c.mag <= gridOf(c.i.master) / 2 + 1e-6), beyond = classed.filter((c) => c.mag > gridOf(c.i.master) / 2 + 1e-6);
  console.log(`within half a grid step of centre (0.125 at 24 and 20, 0.0625 at 16): ${within.length} of ${rest.length} · beyond it: ${beyond.length} (${new Set(beyond.map((c) => c.i.concept)).size} concepts: ${[...new Set(beyond.map((c) => c.i.concept))].sort().join(', ')})`);
  console.log(`  the ${beyond.length} beyond, by cause: ${Object.entries(beyond.reduce((o, c) => ((o[c.cause] = (o[c.cause] ?? 0) + 1), o), {})).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  console.log(`more than 0.01 off centre: ${classed.filter((c) => c.mag > 0.01 + 1e-9).length} of ${rest.length} (at exactly 0.010: ${classed.filter((c) => Math.abs(c.mag - 0.01) < 1e-9).map((c) => `${c.i.name}@${c.i.master}`).join(', ') || 'none'})`);
  // Description against reason. The keyline-edge geometry is how the keyline check is satisfied, not why the far side fell short.
  const geom = classed.filter((c) => c.geometry);
  const matched = all.filter((i) => i.keyline !== 'mark' && !i.box && !i.anchor);
  console.log(`\nkeyline-edge geometry, independent of bucket order: holds on ${geom.length} of ${rest.length} · over the whole keyline-matched population (no mark, box or anchor note): an edge on a keyline edge on ${matched.filter((i) => onKeylineEdge(i, i.master)).length} of ${matched.length} files`);
  const kb = groups['one edge on the keyline, the other side short'] ?? [];
  console.log(`keyline bucket: ${kb.length} entries · with no prose hint at all: ${kb.filter((c) => !c.hints.length).length} · with a stated reason: ${kb.filter((c) => c.reason).length}`);
  const reasoned = classed.filter((c) => c.reason);
  console.log(`stated reason in the prose (STATED_REASON, read by hand): ${reasoned.length} of ${rest.length} entries, ${new Set(reasoned.map((c) => c.i.concept)).size} concepts — ${Object.entries(reasoned.reduce((o, c) => ((o[c.i.concept] = (o[c.i.concept] ?? 0) + 1), o), {})).sort().map(([k, v]) => `${k} ×${v}`).join(', ')} · the rest, a description and no judgement on record: ${rest.length - reasoned.length}`);
  console.log(`  by bucket: ${Object.entries(groups).map(([k, v]) => `${k} ${v.filter((c) => c.reason).length}/${v.length}`).join(' · ')}`);
  const drift = classed.filter((c) => Math.max(Math.abs(c.offTrue[0] - c.off[0]), Math.abs(c.offTrue[1] - c.off[1])) >= 0.005);
  console.log(`published (2 dp box) offset differs from the unrounded box's by ≥ 0.005: ${drift.length} — ${drift.map((c) => `${c.i.name}@${c.i.master} ${sgn(c.off[0], 3)},${sgn(c.off[1], 3)} → true ${sgn(c.offTrue[0], 4)},${sgn(c.offTrue[1], 4)}`).join(' · ') || 'none'}`);
  for (const [cause, list] of Object.entries(groups)) {
    console.log(`\n### ${cause} (${list.length})`);
    for (const c of list.sort((a, b) => b.mag - a.mag || byName(a.i, b.i))) {
      const where = c.proud ? `${c.proud.part.kind} ${c.proud.part.index} stands ${f(c.proud.past)} past the rest on ${c.proud.axis}; rest centred at ${c.proud.restCentre}`
        : c.body ? `body (${c.body.body.kind} ${c.body.body.index}, ${f(c.body.body.box[2] - c.body.body.box[0], 2)}×${f(c.body.body.box[3] - c.body.body.box[1], 2)}) centred; ${c.body.others} other parts set the box${c.hints.length ? ` · prose: "${c.hints[0].trim()}"` : ''}`
        : c.held ? `${c.held.held} edge on the ${c.held.keyline} keyline, the other side ${f(c.held.short)} short${c.hints.length ? ` · prose: "${c.hints[0].trim()}"` : ''}`
        : c.cause === 'under half a grid step' ? `centred edge off the ${gridOf(c.i.master)} grid on ${c.grid.map((g, a) => (g.rounding ? 'xy'[a] : '')).join('')}; drawn edge on grid: ${c.grid.map((g) => (g.edgeOnGrid ? 'yes' : 'no')).join('/')}`
        : c.hints.length ? `prose${c.inherited ? ' (the outline twin\'s)' : ''}: "${c.hints[0].trim()}"${c.hints.length > 1 ? ` (+${c.hints.length - 1})` : ''}` : '';
      const tru = Math.max(Math.abs(c.offTrue[0] - c.off[0]), Math.abs(c.offTrue[1] - c.off[1])) >= 0.005 ? ` [unrounded ${sgn(c.offTrue[0], 4)}, ${sgn(c.offTrue[1], 4)}]` : '';
      console.log(`  ${c.i.name}@${c.i.master}: off ${sgn(c.off[0], 3)}, ${sgn(c.off[1], 3)}${tru} (${f(px16(c.mag, c.i.master), 2)} px at 16) · ${where}${c.reason ? ' · REASON STATED' : ''}`);
    }
  }
  console.log(`\n### anchored (${anchored.length}) — C28 level members`);
  for (const { i, off } of anchored.sort((a, b) => byName(a.i, b.i))) console.log(`  ${i.name}@${i.master}: off ${sgn(off[0], 3)}, ${sgn(off[1], 3)} · anchor ${i.anchor}`);
}

// ── prose (§2) ─────────────────────────────────────────────────────────────
/** The full comment of every concept whose off-centre ink has no mechanical cause (not anchored,
 *  not a proud part, not grid rounding), so the reader can judge the text screen for themselves. */
function prose(all) {
  head('prose (§2) — the whole comment of every concept in the off-centre population, to judge STATED_REASON against');
  const { classed: list } = classifyOffcentre(all);
  const concepts = [...new Set(list.map((c) => c.i.concept))].sort();
  for (const c of concepts) {
    const where = list.filter((x) => x.i.concept === c).map((x) => `${x.i.style === 'filled' ? 'filled ' : ''}@${x.i.master} ${sgn(x.off[0], 3)}, ${sgn(x.off[1], 3)}`).join(' · ');
    const i = all.find((j) => j.name === c && j.master === 24);
    const r = STATED_REASON.find((s) => s.concept === c);
    console.log(`\n### ${c} — off at ${where}\n[stated reason: ${r ? `${r.reason} (masters ${r.masters.join(', ')})` : 'none read'}]\n${i.prose}`);
    for (const m of [20, 16]) { const k = all.find((j) => j.name === c && j.master === m); if (k.prose !== i.prose) console.log(`[@${m} differs] ${k.prose}`); }
  }
}

// ── should (§3) ────────────────────────────────────────────────────────────
function should(all) {
  head('should (§3) — C15\'s measure on every drawing it is defined on (one open bend, M L A L)');
  const rows = [];
  for (const i of all) {
    const tri = triangleOffset(i); if (!tri) continue;
    const sym = mirrors(i), judged = sym.map((m) => !m);
    const rec = recommend(tri).map((v, a) => (judged[a] ? v : 0));
    const recTrue = recommend(triangleOffsetTrue(i)).map((v, a) => (judged[a] ? v : 0));
    rows.push({ i, tri, judged, rec, recTrue, geo: bendGeometry(i), decl: i.optical ?? [0, 0] });
  }
  const concepts = new Set(rows.map((r) => r.i.concept));
  console.log(`drawings: ${rows.length} · concepts: ${concepts.size} · with a note: ${rows.filter((r) => r.i.optical).length} · without: ${rows.filter((r) => !r.i.optical).length}`);
  // The sheet's apex is the arc's midpoint only for equal legs (optical-sheet.mjs:135-137); the checks' legs are not equal.
  const differs = (r) => r.rec.some((v, a) => Math.abs(v - r.recTrue[a]) > 1e-9);
  const checks = rows.filter((r) => /^check/.test(r.i.concept)), chev = rows.filter((r) => /^chevron/.test(r.i.concept));
  console.log(`the sheet's apex against the true arc midpoint — recommendation changes by a 0.05 step: checks ${checks.filter(differs).length} of ${checks.length} · chevrons ${chev.filter(differs).length} of ${chev.length} · checks' apex off the true midpoint by ${f(Math.min(...checks.map((r) => r.geo.apexGap)), 3)} – ${f(Math.max(...checks.map((r) => r.geo.apexGap)), 3)} (off the arc itself by up to ${f(Math.max(...checks.map((r) => r.geo.offArc)), 3)}; leg ratio ${f(Math.min(...checks.map((r) => r.geo.legRatio)))} – ${f(Math.max(...checks.map((r) => r.geo.legRatio)))}) · chevrons' apex off by up to ${f(Math.max(...chev.map((r) => r.geo.apexGap)), 4)}`);
  const noNote = rows.filter((r) => !r.i.optical);
  console.log(`\nno note — concept | master | style | judged axes | triangle (x, y) | C15 recommendation, sheet apex (x, y) | true apex (x, y) | px at 16 | C14 record`);
  for (const r of noNote.sort((a, b) => byName(a.i, b.i))) {
    const mag = Math.max(...r.rec.map(Math.abs));
    const record = /^check/.test(r.i.concept) ? 'checks stay box-centred on both axes (docs/07:54, user decision 2026-09-17)' : 'none';
    console.log(`${r.i.concept} | ${r.i.master} | ${r.i.style} | ${r.judged.map((j, a) => (j ? 'xy'[a] : '')).join('') || 'none'} | ${r.tri.map((v) => sgn(v)).join(', ')} | ${r.rec.map((v) => sgn(v)).join(', ')} | ${r.recTrue.map((v) => sgn(v)).join(', ')}${differs(r) ? ' ≠' : ''} | ${f(px16(mag, r.i.master))} | ${record}`);
  }
  const vis = (t, key = 'rec') => noNote.filter((r) => Math.max(...r[key].map(Math.abs)) >= t);
  console.log(`\nno note and the method would move it ≥ 0.25 units: ${vis(0.25).length} drawings, ${new Set(vis(0.25).map((r) => r.i.concept)).size} concepts · ≥ 0.5: ${vis(0.5).length} drawings, ${new Set(vis(0.5).map((r) => r.i.concept)).size} concepts · outside the C14 record: ${vis(0.25).filter((r) => !/^check/.test(r.i.concept)).length}`);
  console.log(`  with the true apex: ≥ 0.25: ${vis(0.25, 'recTrue').length} · ≥ 0.5: ${vis(0.5, 'recTrue').length} (${vis(0.5, 'recTrue').map((r) => `${r.i.name}@${r.i.master}`).join(', ')})`);
  console.log(`  range over the 48, true apex: x ${sgn(Math.min(...noNote.map((r) => r.recTrue[0])))} … ${sgn(Math.max(...noNote.map((r) => r.recTrue[0])))} · y ${sgn(Math.min(...noNote.map((r) => r.recTrue[1])))} … ${sgn(Math.max(...noNote.map((r) => r.recTrue[1])))}`);

  console.log(`\nwith a note — declared against the measure, by family at 24 (outline):`);
  for (const r of rows.filter((x) => x.i.optical && x.i.master === 24 && x.i.style === 'outline').sort((a, b) => byName(a.i, b.i))) {
    const a = r.judged[0] ? 0 : 1;
    console.log(`  ${r.i.name.padEnd(24)} judged ${'xy'[a]} · measured ${sgn(r.rec[a])} · declared ${sgn(r.decl[a])} · eye correction ${sgn(r.decl[a] - r.rec[a])}`);
  }

  head('should (§3) — the closed triangles: no C15 measure; screen = area centroid of the closed line × 0.5');
  for (const i of all.filter((j) => j.style === 'outline' && j.paths.length && isClosedTriangle(j.paths[0])).sort(byName)) {
    const pc = polygonCentroid(i.paths[0]), box = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];
    const sym = mirrors(i);
    const lop = [pc[0] - box[0], pc[1] - box[1]];                  // of the drawing as shipped: shift-invariant
    const scr = lop.map((v, a) => (sym[a] ? 0 : r05(-K * v)));
    const stroke = centrelineCentroid([i.paths[0]]), lopS = [stroke[0] - box[0], stroke[1] - box[1]];
    console.log(`  ${i.name.padEnd(18)}@${i.master} declared ${i.optical ? i.optical.join(' ') : 'none'} · mirrors LR/TB ${sym.map((s) => (s ? 'y' : 'n')).join('/')} · area centroid − box centre ${sgn(lop[0])}, ${sgn(lop[1])} → × 0.5 = ${scr.map((v) => sgn(v)).join(', ')} · perimeter centroid − box ${sgn(lopS[0])}, ${sgn(lopS[1])} · ink ${i.ink.w}×${i.ink.h}`);
  }
}

// ── screen (§3) ────────────────────────────────────────────────────────────
function screen(all) {
  head('screen (§3) — mass screen: centreline mass centre against the ink-box centre, outline files, every master');
  console.log('A SCREEN, not C15\'s measure (C15: "ink or line mass is not the measure"). + is right / down. "corrected" is the box centre\'s offset from the canvas centre, i.e. the shift actually drawn.');
  const rows = [];
  for (const i of all.filter((j) => j.style === 'outline')) {
    const mc = centrelineCentroid(i.paths);
    if (!mc) continue;
    const box = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];
    const sym = mirrors(i);
    const lop = [mc[0] - box[0], mc[1] - box[1]].map((v, a) => (sym[a] ? 0 : v));
    rows.push({ i, lop, sym, mag: Math.max(...lop.map(Math.abs)), corrected: centreOffset(i.ink, i.master) });
  }
  for (const m of MASTER_LIST) {
    const at = rows.filter((r) => r.i.master === m), mags = at.map((r) => r.mag);
    console.log(`\n@${m}: ${at.length} outlines · lopsided on no axis (mirrors both ways): ${at.filter((r) => r.sym[0] && r.sym[1]).length} · |mass − box| median ${f(q(mags, 0.5))} · p90 ${f(q(mags, 0.9))} · max ${f(Math.max(...mags))} · ≥ 0.5: ${at.filter((r) => r.mag >= 0.5).length} · ≥ 1: ${at.filter((r) => r.mag >= 1).length}`);
  }
  const at24 = rows.filter((r) => r.i.master === 24).sort((a, b) => b.mag - a.mag);
  console.log('\ntop 30 at 24 by |mass − box|, with what was drawn — concept | mirrors LR/TB | mass − box (x, y) | corrected (x, y) | note');
  for (const r of at24.slice(0, 30)) console.log(`  ${r.i.name.padEnd(22)} ${r.sym.map((s) => (s ? 'y' : 'n')).join('/')} | ${sgn(r.lop[0])}, ${sgn(r.lop[1])} | ${sgn(r.corrected[0])}, ${sgn(r.corrected[1])} | ${r.i.optical ? `optical ${r.i.optical.join(' ')}` : r.i.anchor ? `anchor ${r.i.anchor}` : '—'}`);
  const familyOf = (n) => n.replace(/-\d+$/, '').replace(/-(small|large)$/, '');
  const fams = {};
  for (const r of at24.filter((x) => x.mag >= 0.5)) (fams[familyOf(r.i.name)] ??= []).push(r);
  console.log(`\nfamilies with |mass − box| ≥ 0.5 at 24 (${Object.keys(fams).length}): ${Object.entries(fams).sort((a, b) => b[1].length - a[1].length).map(([k, v]) => `${k} ×${v.length}`).join(', ')}`);
  const OBJECTS = ['bell', 'user', 'megaphone', 'map-pin', 'pin', 'flag', 'cursor', 'send', 'lightbulb', 'heart', 'key', 'lock', 'home', 'login', 'logout', 'paintbrush', 'wand', 'arrow-up', 'arrow-right', 'check'];
  console.log('\nnamed object and mark families at 24 — concept: mass − box (x, y) · corrected (x, y) [note] — the objects are handed to the eye; arrows and checks were judged by it (docs/07:54):');
  for (const fam of OBJECTS) {
    const rows = at24.filter((r) => familyOf(r.i.name) === fam).sort((a, b) => a.i.name.localeCompare(b.i.name));
    if (rows.length) console.log(`  ${fam}: ${rows.map((r) => `${r.i.name} ${sgn(r.lop[0])}, ${sgn(r.lop[1])} · ${sgn(r.corrected[0])}, ${sgn(r.corrected[1])}${r.i.optical ? ` [optical ${r.i.optical.join(' ')}]` : r.i.anchor ? ` [anchor]` : ''}`).join(' | ')}`);
  }
  const declared = at24.filter((r) => r.i.optical);
  console.log(`\nthe declared 45 at 24 on this screen: |mass − box| median ${f(q(declared.map((r) => r.mag), 0.5))} · max ${f(Math.max(...declared.map((r) => r.mag)))} · top five: ${declared.slice(0, 5).map((r) => `${r.i.name} ${f(r.mag)}`).join(' · ')} (the chevrons' mass sits near 0 — the screen cannot see what C15 corrects)`);
}

// ── consistency (§4) ───────────────────────────────────────────────────────
function consistency(all) {
  head('consistency (§4) — siblings');
  const at = (m, n) => all.find((i) => i.master === m && i.name === n);
  console.log('chevrons — |shift| by direction, shape × size × master (down · up · left · right):');
  for (const shape of ['', '-2', '-3']) for (const size of ['-small', '', '-large']) {
    const line = MASTER_LIST.map((m) => {
      const vals = DIRS.map((d) => { const i = at(m, `chevron-${d}${shape}${size}`); return Math.abs(i.optical[0] || i.optical[1]); });
      const same = vals.every((v) => v === vals[0]);
      return `@${m} ${vals.map((v) => f(v)).join(' · ')}${same ? '' : ' ≠'}`;
    });
    console.log(`  chevron${shape || ' (classic)'}${size || ' (default)'}: ${line.join('  |  ')}`);
  }
  console.log('\nsize variants — declared against default × (variant ink extent ÷ default ink extent), same master (the sheet\'s convention, 2 dp):');
  let ok = 0, n = 0;
  for (const i of all.filter((j) => j.optical && j.style === 'outline' && sizeOf(j.name))) {
    const d = at(i.master, sizeBase(i.name)), a = i.optical[0] ? 0 : 1;
    const want = r2(d.optical[a] * extent(i, a) / extent(d, a)), got = i.optical[a];
    n++; if (Math.abs(want - got) <= 0.0101) ok++; else console.log(`  ${i.name}@${i.master}: declared ${got}, scaled default ${want} (Δ ${sgn(got - want)})`);
  }
  console.log(`  within 0.01: ${ok} of ${n} size-variant files (outline)`);
  console.log('\nmirror and turn siblings at 24 (the same drawing flipped or turned; C14 picks):');
  for (const shape of ['', '-2', '-3']) console.log(`  chevron${shape || ''}: ${DIRS.map((d) => `${d} ${Math.abs(at(24, `chevron-${d}${shape}`).optical[0] || at(24, `chevron-${d}${shape}`).optical[1])}`).join(' · ')}`);
  console.log('\nother families:');
  for (const c of ['alert-triangle', 'alert-triangle-2', 'alert-triangle-3', 'alert-triangle-4', 'play', 'play-2', 'play-3', 'info-2', 'info-3']) {
    const rows = MASTER_LIST.map((m) => at(m, c));
    const a = rows[0].optical[0] ? 0 : 1;
    const ratio = rows.map((i) => f(i.optical[a] / rows[0].optical[a], 3)), ext = rows.map((i) => f(extent(i, a) / extent(rows[0], a), 3));
    console.log(`  ${c.padEnd(18)} ${rows.map((i) => i.optical.join(' ')).join(' · ')} · shift ratio to 24: ${ratio.join(' · ')} · ink-extent ratio: ${ext.join(' · ')} · ink ${rows.map((i) => `${i.ink.w}×${i.ink.h}`).join(' · ')}`);
  }
  const m24 = all.filter((i) => i.optical).filter((i) => i.style === 'outline');
  let twins = 0; for (const o of m24) { const t = at(o.master, `${o.name}-filled`); if (t?.optical?.join() === o.optical.join()) twins++; }
  console.log(`\noutline and filled twin declare the same shift: ${twins} of ${m24.length} concept-masters`);
  // The filled twin repeats the outline's value; its own triangle (a heavier line, so a different ink box and bend) would say:
  const diffs = [];
  for (const o of m24) {
    const t = at(o.master, `${o.name}-filled`), to = triangleOffset(o), tt = t && triangleOffset(t);
    if (!to || !tt) continue;
    const a = o.optical[0] ? 0 : 1, ro = recommend(to)[a], rt = recommend(tt)[a];
    diffs.push({ name: o.name, master: o.master, ro, rt, d: r2(rt - ro) });
  }
  const moved = diffs.filter((d) => Math.abs(d.d) >= 0.05);
  console.log(`single-bend pairs where the filled twin's OWN C15 measure differs from the outline's by ≥ 0.05 (one sheet step): ${moved.length} of ${diffs.length} · largest ${f(Math.max(...diffs.map((d) => Math.abs(d.d))))} (${diffs.filter((d) => Math.abs(d.d) === Math.max(...diffs.map((x) => Math.abs(x.d)))).map((d) => `${d.name}@${d.master} outline ${sgn(d.ro)} filled ${sgn(d.rt)}`).join(', ')})`);
}

// ── alpha (§5) ─────────────────────────────────────────────────────────────
async function alpha(all, pin) {
  head('alpha (§5) — the published optical bearings at other values of alpha (tools/optical.mjs, the pin\'s own)');
  const { opticalBearings } = await import(pathToFileURL(join(pin, 'tools/optical.mjs')).href);
  const metrics = JSON.parse(readFileSync(join(pin, 'dist/metrics.json'), 'utf8'));
  const ALPHAS = [0.5, 0.625, 0.875, 1];
  const rows = [];
  let mismatch = 0;
  for (const i of all.filter((j) => j.paths.length && !j.areas?.length)) {
    const ob = opticalBearings(i.paths, i.stroke, i.master, 0.75);
    const rec = ob && Object.fromEntries(['left', 'right', 'top', 'bottom'].map((s) => [s, ob[s].recession]));
    const pub = metrics[i.master][i.name].optical;
    if (!rec || Object.values(rec).some((v) => !Number.isFinite(v)) || Object.values(pub).some((s) => s.geometric == null)) { rows.push({ i, rec: null }); continue; }   // paintbrush-4 at 24 and 20: a zero-length arc, bearings published null (card 1.12 §3.2)
    for (const s of Object.keys(rec)) if (Math.abs(rec[s] - (metrics[i.master][i.name].optical[s]?.recession ?? NaN)) > 1e-9) mismatch++;
    rows.push({ i, rec, max: Math.max(...Object.values(rec)) });
  }
  const live = rows.filter((r) => r.rec);
  console.log(`stroke-only drawings (optical computed by the build): ${rows.length} · unusable (null or NaN, the zero-length arc of card 1.12 §3.2): ${rows.length - live.length} — ${rows.filter((r) => !r.rec).map((r) => `${r.i.name}@${r.i.master}`).join(', ') || 'none'} · recession here ≠ published: ${mismatch} sides`);
  console.log(`a side's bearing moves by |alpha − 0.75| × its recession; recession per side as published (2 dp). Shape-filled entries publish recession 0 and do not move (card 1.12 §3.1).`);
  const maxes = live.map((r) => r.max);
  console.log(`largest recession per drawing: median ${f(q(maxes, 0.5))} · p90 ${f(q(maxes, 0.9))} · max ${f(Math.max(...maxes))}`);
  for (const A of ALPHAS) {
    const thr = 0.1 / Math.abs(A - 0.75);
    const moved = live.filter((r) => r.max > thr + 1e-9);
    console.log(`\nalpha ${A}: a side moves > 0.1 when its recession > ${f(thr, 3)} → ${moved.length} drawings (${new Set(moved.map((r) => r.i.concept)).size} concepts; ${MASTER_LIST.map((m) => `@${m} ${moved.filter((r) => r.i.master === m).length}`).join(', ')}) · sides moving > 0.1: ${moved.reduce((s, r) => s + Object.values(r.rec).filter((v) => v > thr + 1e-9).length, 0)} · largest move ${f(Math.abs(A - 0.75) * Math.max(...maxes))} units`);
  }
  const list = (thr) => [...new Set(live.filter((r) => r.max > thr + 1e-9).map((r) => r.i.concept))].sort();
  console.log(`\nconcepts that move > 0.1 at alpha 0.5 or 1 (recession > 0.4 on some side, any master or style): ${list(0.4).length}\n  ${list(0.4).join(', ')}`);
  console.log(`\nconcepts that move > 0.1 at alpha 0.625 or 0.875 (recession > 0.8): ${list(0.8).length}\n  ${list(0.8).join(', ')}`);
  console.log('\ntop 20 drawings by largest recession — name@master: side recession → bearing at alpha 0.5 / 0.75 / 1');
  for (const r of live.sort((a, b) => b.max - a.max).slice(0, 20)) {
    const side = Object.entries(r.rec).sort((a, b) => b[1] - a[1])[0];
    const geo = metrics[r.i.master][r.i.name].optical[side[0]].geometric;
    console.log(`  ${r.i.name}@${r.i.master}: ${side[0]} ${f(side[1])} → ${f(geo + 0.5 * side[1])} / ${f(geo + 0.75 * side[1])} / ${f(geo + side[1])}`);
  }
}

// ── r10 (§6) ───────────────────────────────────────────────────────────────
function r10(all) {
  head('r10 (§6) — volume-off at 16 and watch-2, measured');
  const at = (m, n) => all.find((i) => i.master === m && i.name === n);
  const show = (i) => {
    const off = centreOffset(i.ink, i.master), proud = partProud(i, i.master, off), grid = gridRounding(i.ink, i.master, gridOf(i.master), off);
    const mc = i.style === 'outline' ? centrelineCentroid(i.paths) : null;
    console.log(`  ${i.name}@${i.master}: ink ${i.ink.x},${i.ink.y} ${i.ink.w}×${i.ink.h} · centre off ${sgn(off[0], 3)}, ${sgn(off[1], 3)} · notes: ${[i.box && `box ${i.box}`, i.anchor && `anchor ${i.anchor}`, i.optical && `optical ${i.optical.join(' ')}`].filter(Boolean).join(', ') || 'none'}`);
    console.log(`      part standing proud: ${proud ? `${proud.part.kind} ${proud.part.index} "${proud.part.d.slice(0, 40)}" stands ${f(proud.past)} past the rest on ${proud.axis}; the rest is centred at ${proud.restCentre}` : 'no'}`);
    console.log(`      grid: centred edge on grid x/y ${grid.map((g) => (g.centredEdgeOnGrid ? 'yes' : 'no')).join('/')} · rounding explains it: ${grid.some((g) => g.rounding) ? 'yes' : 'no'}`);
    if (mc) console.log(`      centreline mass centre ${f(mc[0])}, ${f(mc[1])} (off canvas centre ${sgn(mc[0] - i.master / 2)}, ${sgn(mc[1] - i.master / 2)})`);
    const hints = proseHints(i.prose); if (hints.length) console.log(`      prose: "${hints[0].trim()}"${hints.length > 1 ? ` (+${hints.length - 1} more)` : ''}`);
  };
  for (const n of ['volume-off', 'volume-off-filled']) for (const m of MASTER_LIST) show(at(m, n));
  console.log('  — the speaker alone (path 0) in volume-off, each master: its ink box and the whole-pixel test on its edges');
  for (const m of MASTER_LIST) { const i = at(m, 'volume-off'); const p = partsOf(i)[0]; console.log(`  volume-off@${m} speaker ink x ${f(p.box[0], 3)} → ${f(p.box[2], 3)} (${f(p.box[2] - p.box[0], 3)} wide; edges on whole pixels: ${Number.isInteger(r3(p.box[0])) && Number.isInteger(r3(p.box[2])) ? 'yes' : 'no'}); centred would put them at ${f((m - (p.box[2] - p.box[0])) / 2, 3)} → ${f((m + (p.box[2] - p.box[0])) / 2, 3)}`); }
  for (const n of ['watch-2', 'watch-2-filled']) for (const m of MASTER_LIST) show(at(m, n));
}

// ── reconcile ──────────────────────────────────────────────────────────────
function reconcile(all, pin) {
  head('reconcile — counts other cards took, under their own definitions');
  const noted = all.filter((i) => i.optical);
  console.log(`plan recon / ledger §2.5: concepts with optical: ${new Set(noted.map((i) => i.concept)).size} · files ${noted.length} · distinct pairs ${new Set(noted.map((i) => i.optical.join(' '))).size}`);
  const mag = (o) => Math.max(Math.abs(o[0]), Math.abs(o[1]));
  const pop = all.filter((i) => !i.shift[0] && !i.shift[1]).map((i) => ({ i, off: centreOffset(i.ink, i.master) })).filter(({ off }) => mag(off) > 0.005);
  console.log(`this card, on the build's 2 dp ink box: shift [0,0] and ink centre > 0.005 off: ${pop.length} · anchored ${pop.filter((e) => e.i.anchor).length} · others ${pop.filter((e) => !e.i.anchor).length} · others in (0.1, 0.5]: ${pop.filter((e) => !e.i.anchor && mag(e.off) > 0.1 && mag(e.off) <= 0.5).length}`);
  // card 1.12 §4 measured the same population on metrics-check.mjs's solved ink box (arcs solved, not
  // sampled; no rounding), thresholding the UNROUNDED offset — as a distance √(dx² + dy²)
  // (metrics-probe.mjs:375,380). Both are reproduced here unrounded; a 3 dp rounding before the
  // threshold (this card's first run) is shown for the record.
  const dist = (o) => Math.hypot(o[0], o[1]);
  const exactAll = all.filter((i) => !i.shift[0] && !i.shift[1]).map((i) => {
    const b = inkBoxOf(readSvg(readFileSync(join(pin, 'src/icons', String(i.master), `${i.name}.svg`), 'utf8'), i.name));
    return { i, off: [(b.x0 + b.x1) / 2 - i.master / 2, (b.y0 + b.y1) / 2 - i.master / 2] };
  });
  const exact = exactAll.filter((e) => mag(e.off) > 0.005);
  const byDist = exactAll.filter((e) => dist(e.off) > 0.005);
  const r3d = exactAll.filter((e) => mag(e.off.map(r3)) > 0.005);
  console.log(`card 1.12 §4, solved box, unrounded, per axis > 0.005: ${exact.length} · anchored ${exact.filter((e) => e.i.anchor).length} · others ${exact.filter((e) => !e.i.anchor).length} · others in (0.1, 0.5]: ${exact.filter((e) => !e.i.anchor && mag(e.off) > 0.1 && mag(e.off) <= 0.5).length}`);
  console.log(`card 1.12 §4, solved box, unrounded, as a DISTANCE > 0.005: ${byDist.length} · others ${byDist.filter((e) => !e.i.anchor).length} · others with distance in (0.1, 0.5]: ${byDist.filter((e) => !e.i.anchor && dist(e.off) > 0.1 && dist(e.off) <= 0.5).length}`);
  const key = (e) => `${e.i.name}@${e.i.master}`, inPub = new Set(pop.map(key)), inExact = new Set(exact.map(key)), inDist = new Set(byDist.map(key));
  console.log(`  distance against per-axis, same box: in one and not the other: ${byDist.filter((e) => !inExact.has(key(e))).length + exact.filter((e) => !inDist.has(key(e))).length}`);
  console.log(`  the solved offset rounded to 3 dp before the threshold (this card's first run): ${r3d.length}`);
  const pubOff = new Map(pop.map((e) => [key(e), e.off]));
  const onlyExact = exact.filter((e) => !inPub.has(key(e))), onlyPub = pop.filter((e) => !inExact.has(key(e)));
  console.log(`  in the solved-box count and not in the 2 dp-box count (${onlyExact.length}): ${onlyExact.map((e) => `${key(e)} solved ${sgn(e.off[0], 5)},${sgn(e.off[1], 5)}`).join(' · ')}`);
  console.log(`  in the 2 dp-box count and not in the solved-box count (${onlyPub.length}): ${onlyPub.map((e) => `${key(e)} published ${sgn(e.off[0], 3)},${sgn(e.off[1], 3)}`).join(' · ') || 'none'}`);
  const bandDiff = byDist.filter((e) => !e.i.anchor && dist(e.off) > 0.1 && dist(e.off) <= 0.5 && !(mag(e.off) > 0.1));
  console.log(`  in the (0.1, 0.5] band by distance but not per axis (${bandDiff.length}): ${bandDiff.map((e) => `${key(e)} ${sgn(e.off[0], 3)},${sgn(e.off[1], 3)}`).join(' · ')}`);
  const pubBand = pop.filter((e) => !e.i.anchor && mag(e.off) > 0.1 && mag(e.off) <= 0.5).length, exactBand = exact.filter((e) => !e.i.anchor && mag(e.off) > 0.1 && mag(e.off) <= 0.5).length;
  console.log(`  the (0.1, 0.5] band, per axis: 2 dp box ${pubBand} · solved box ${exactBand} · entries that cross 0.1 between the two boxes: ${pop.filter((e) => !e.i.anchor && mag(e.off) > 0.1 && mag(e.off) <= 0.5 && !(mag(exactAll.find((x) => key(x) === key(e))?.off ?? [0, 0]) > 0.1)).map(key).join(', ') || 'none'} / ${exact.filter((e) => !e.i.anchor && mag(e.off) > 0.1 && mag(e.off) <= 0.5 && !(mag(pubOff.get(key(e)) ?? [0, 0]) > 0.1)).map((e) => `${key(e)} solved ${sgn(e.off[0], 4)},${sgn(e.off[1], 4)} published ${(pubOff.get(key(e)) ?? ['—', '—']).map((v) => (typeof v === 'number' ? sgn(v, 3) : v)).join(',')}`).join(' · ') || 'none'}`);
  // enforcement-gap §2.2: lint's own reading — 2 dp edges, centre minus the declared shift, non-anchored drawings
  const lintish = all.filter((i) => !i.anchor).map((i) => {
    const o = { x0: r2(i.ink.x), y0: r2(i.ink.y), x1: r2(i.ink.x + i.ink.w), y1: r2(i.ink.y + i.ink.h) };
    const cx = r2((o.x0 + o.x1) / 2 - i.shift[0]), cy = r2((o.y0 + o.y1) / 2 - i.shift[1]);
    return Math.max(Math.abs(cx - i.master / 2), Math.abs(cy - i.master / 2));
  });
  console.log(`enforcement-gap §2.2 (centre after the declared shift, 2 dp, ${lintish.length} non-anchored drawings): > 0.01: ${lintish.filter((v) => v > 0.01).length} · > 0.10: ${lintish.filter((v) => v > 0.1).length} · > 0.25: ${lintish.filter((v) => v > 0.25).length} · = 0.50: ${lintish.filter((v) => Math.abs(v - 0.5) < 1e-9).length} · > 0.50: ${lintish.filter((v) => v > 0.5).length}`);
}

// ── main ───────────────────────────────────────────────────────────────────
const SECTIONS = { census, sheet, offcentre, prose, should, screen, consistency, alpha, r10, reconcile };
async function main() {
  const args = process.argv.slice(2);
  const pin = resolve(args.find((a) => !a.startsWith('--')) ?? '');
  const wanted = args.slice(1).filter((a) => !a.startsWith('--'));
  if (!existsSync(join(pin, 'dist/icons.json'))) { console.error('usage: optical-probe.mjs <pin-dir with dist/icons.json, built from git archive> [section …]'); process.exit(2); }
  const all = readPin(pin);
  console.log(`pin ${pin} · ${all.length} drawings · ${new Set(all.map((i) => i.concept)).size} concepts`);
  for (const s of wanted.length ? wanted : Object.keys(SECTIONS).filter((k) => k !== 'sheet')) {
    if (!SECTIONS[s]) { console.error(`no section ${s}; sections: ${Object.keys(SECTIONS).join(' ')}`); process.exit(2); }
    await SECTIONS[s](all, pin);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
