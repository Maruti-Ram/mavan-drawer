#!/usr/bin/env node
// PRIMITIVE SHEETS — data for lab/audit-primitives.html (card 4.2 of the set-and-rules audit).
//
// AUDIT ONLY. Nothing in lint, build, queue or the lab's other pages imports this. It reads the
// pinned tree's src/icons and writes ONE file, lab/audit-data/primitives.json, which the page fetches.
//
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P
//   node tools/audit/primitives-data.mjs $P            # writes lab/audit-data/primitives.json
//   node tools/audit/primitives-data.mjs $P --print    # prints every panel against the cards, writes nothing
//   node tools/audit/primitives-data.mjs $P --out <file>
//
// WHAT IT BUILDS. One panel per shared primitive the audit's cards named — card 1.1's vocabulary
// (docs/audit/findings-primitives.md: ring, square, dot, plus, bar, x, slash, chevron, arrowhead,
// badge), card 1.9's nine parts that are one drawing at some masters and drift at another
// (findings-grammar.md §2.3; the check in a box and a ring is also card 1.10's §1.4), and card 1.1
// §3.4's outlines shared by several fills. For every panel, at 24 · 20 · 16, outline and filled:
//   instances  each occurrence of the part: its subpath(s) as drawn in its own file, how it is drawn
//              (stroke at the file's own weight, or area), and the transform that puts it on the
//              panel's common anchor for the overlay
//   classes    congruence classes (or the card's parameter classes) with their representative
//   readout    per instance, the measure the card itself used: a congruence residual against the
//              row's reference (best-fit offset first — congruence.mjs's own reading), a diameter, a
//              leg, a turn — in drawing units, with px at a 16 px render beside it
//   against    the card's own figures beside this tool's, one line each, so a difference is shown
//              rather than chosen
//
// MEASURES. Shapes go through congruence.mjs `canonical` before any comparison: its
// `congruentUpToTranslation` reads a ring walked the other way as "different segment structure"
// (plans/set-and-rules-audit.md, Known instrument defects), and re-emitting both through
// `canonical().d` first is the stated workaround. Classes come from `classify` (translation, tol
// 0.01), which buckets on `canonical().shape`. Boxes are metrics-check.mjs's solved boxes, never
// geometry.mjs bbox() (which can sit 0.0056 inside an arc). congruence.mjs is imported, never edited.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonical, classify, congruentUpToTranslation, normalise, subpathsOfPath } from './congruence.mjs';
import { centrelineBox, parseD, readSvg } from './metrics-check.mjs';
import { MASTERS as SPEC } from '../masters.mjs';

export const MASTER_LIST = [24, 20, 16];
export const STYLES = ['outline', 'filled'];
export const PIN = '5933041';
const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, '..', '..');
export const OUT = join(REPO, 'lab', 'audit-data', 'primitives.json');

/** What one drawing unit becomes when the master is rendered 16 px wide (findings-primitives.md:31-35). */
export const pxAt16 = (units, master) => (units == null ? null : (units * 16) / master);
const r3 = (n) => (n == null || !Number.isFinite(n) ? null : Math.round(n * 1000) / 1000 + 0);
const r2 = (n) => Math.round(n * 100) / 100 + 0;
const EPS = 1e-6;

// ── reading the pin ──────────────────────────────────────────────────────────────────────────

/** One SVG text → its parts: every subpath of every painted path, with how it is painted. */
export function partsOf(text, label = '<svg>') {
  const icon = readSvg(text, label);
  const parts = [];
  const add = (p, kind, pi) => subpathsOfPath(p.d).forEach((d, si) => {
    const box = centrelineBox(parseD(d));
    const w = kind === 'stroke' ? p.width : 0;
    parts.push({ kind, pi, si, d, w, box, ink: grow(box, w / 2), circle: circleOf(d, box) });
  });
  icon.strokes.forEach((p, i) => add(p, 'stroke', i));
  icon.areas.forEach((p, i) => add(p, 'area', i));
  return parts;
}

/** Every drawing of the pin: set[master][fileName] = { name, filled, parts }. */
export function readSet(pinDir) {
  const set = {};
  for (const m of MASTER_LIST) {
    set[m] = {};
    const dir = join(pinDir, 'src', 'icons', String(m));
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) {
      const name = f.slice(0, -4);
      set[m][name] = { name, filled: name.endsWith('-filled'), parts: partsOf(readFileSync(join(dir, f), 'utf8'), `${m}/${f}`) };
    }
  }
  return set;
}

/** sha256 over the sorted icon files — identifies the tree the JSON was built from. */
export function digestOf(pinDir) {
  const h = createHash('sha256');
  for (const m of MASTER_LIST) {
    const dir = join(pinDir, 'src', 'icons', String(m));
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) h.update(`${m}/${f}\n`).update(readFileSync(join(dir, f)));
  }
  return h.digest('hex');
}

// ── geometry helpers ─────────────────────────────────────────────────────────────────────────

const grow = (b, h) => ({ x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h });
const union = (a, b) => (a ? { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) } : { ...b });
const centreOf = (b) => [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
const sizeOf = (b) => [b.x1 - b.x0, b.y1 - b.y0];
const boxDist = (a, b) => Math.abs(a.x0 - b.x0) + Math.abs(a.y0 - b.y0) + Math.abs(a.x1 - b.x1) + Math.abs(a.y1 - b.y1);

/** A full circle, as congruence.mjs normalises one (two arcs, top to bottom, one way round), whose
 *  box is 2r — which keeps a two-arc lens (paintbrush-5's handle) out (findings-primitives.md:55-61). */
export function circleOf(d, box = centrelineBox(parseD(d))) {
  let s;
  try { s = normalise(d).subpaths; } catch { return null; }
  if (s.length !== 1) return null;
  const [sub] = s;
  if (!sub.ring || sub.segs.length !== 2) return null;
  if (!sub.segs.every((g) => g.cmd === 'A' && g.fa === 1 && g.fs === 1 && Math.abs(g.r[0] - g.r[1]) < EPS)) return null;
  const r = sub.segs[0].r[0];
  const [w, h] = sizeOf(box);
  if (Math.abs(w - 2 * r) > EPS || Math.abs(h - 2 * r) > EPS) return null;
  return { r, cx: (box.x0 + box.x1) / 2, cy: (box.y0 + box.y1) / 2 };
}

/** The affine maps the overlay uses, as [a, b, c, d, e, f] (SVG's matrix order). */
export const IDENTITY = [1, 0, 0, 1, 0, 0];
const snap = (n) => (Math.abs(n - Math.round(n)) < 1e-12 ? Math.round(n) : n);
export const translate = (dx, dy) => [1, 0, 0, 1, dx, dy];
/** Rotate by `deg` about (cx, cy). Quarter turns come out exact (cos and sin snapped to 0 / ±1). */
export function rotateAbout(deg, cx, cy) {
  const t = (deg * Math.PI) / 180, c = snap(Math.cos(t)), s = snap(Math.sin(t));
  return [c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy].map((v) => v + 0);
}
/** a ∘ b: first b, then a. */
export const compose = (a, b) => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
];
const apply = (M, [x, y]) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
const isIdentity = (M) => M.every((v, i) => Math.abs(v - IDENTITY[i]) < 1e-12);

const fmt = (n) => String(Math.round(n * 1e6) / 1e6 + 0);
/** Apply a rigid map (rotation, mirror, translation — no resize) to a `d`. A mirror flips each
 *  arc's sweep. Output is absolute M / L / A / C / Q / Z. */
export function transformD(d, M) {
  if (isIdentity(M)) return d;
  const det = M[0] * M[3] - M[1] * M[2];
  if (Math.abs(Math.abs(det) - 1) > 1e-9) throw new Error('transformD: only rigid maps are supported');
  const rot = (Math.atan2(M[1], M[0]) * 180) / Math.PI;
  const P = (p) => apply(M, p).map(fmt).join(' ');
  let out = '';
  for (const sub of normalise(d).subpaths) {
    out += `M${P(sub.start)}`;
    for (const s of sub.segs) {
      if (s.cmd === 'L') out += `L${P(s.to)}`;
      else if (s.cmd === 'A') out += `A${fmt(s.r[0])} ${fmt(s.r[1])} ${fmt(det < 0 ? -s.rot + rot : s.rot + rot)} ${s.fa} ${det < 0 ? 1 - s.fs : s.fs} ${P(s.to)}`;
      else if (s.cmd === 'C') out += `C${P(s.c[0])} ${P(s.c[1])} ${P(s.to)}`;
      else out += `Q${P(s.c[0])} ${P(s.to)}`;
    }
    if (sub.closed) out += 'Z';
  }
  return out;
}

const boxOfD = (d) => centrelineBox(parseD(d));

/** Arc centre (SVG 1.1 F.6.5), for a circular arc. */
function arcCentre(from, to, r, fa, fs) {
  const dx = (from[0] - to[0]) / 2, dy = (from[1] - to[1]) / 2;
  let rr = r;
  const lam = (dx * dx + dy * dy) / (rr * rr);
  if (lam > 1) rr *= Math.sqrt(lam);
  const num = rr * rr * rr * rr - rr * rr * dy * dy - rr * rr * dx * dx;
  const den = rr * rr * dy * dy + rr * rr * dx * dx;
  const co = (fa !== fs ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  return [co * dy + (from[0] + to[0]) / 2, -co * dx + (from[1] + to[1]) / 2];
}

/**
 * A bent mark: one open subpath of leg · arc · leg (an arrowhead, a chevron, a fold). Card 1.1
 * §2.6–2.7 classify these by (leg, bend radius, turn); `turn` is read the way its tables print it —
 * the acute angle between the two legs' lines, so a 90° V and a 41.3° bracket both read as drawn and a
 * U (two parallel legs) reads 0 and is left out by the `turn ≥ 10°` filter. `apex` is the arc's
 * midpoint; `dir` points from the midpoint of the two leg ends to the apex — where the mark points.
 */
export function bendOf(d) {
  let subs;
  try { subs = normalise(d).subpaths; } catch { return null; }
  if (subs.length !== 1) return null;
  const [s] = subs;
  if (s.ring || s.segs.length !== 3) return null;
  const [a, b, c] = s.segs;
  if (a.cmd !== 'L' || b.cmd !== 'A' || c.cmd !== 'L' || Math.abs(b.r[0] - b.r[1]) > EPS) return null;
  const P0 = s.start, P1 = a.to, P2 = b.to, P3 = c.to;
  const v1 = [P1[0] - P0[0], P1[1] - P0[1]], v2 = [P3[0] - P2[0], P3[1] - P2[1]];
  const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
  const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (l1 * l2);
  const turn = (Math.acos(Math.min(1, Math.abs(cos))) * 180) / Math.PI;
  const R = b.r[0];
  const C = arcCentre(P1, P2, R, b.fa, b.fs);
  const a1 = Math.atan2(P1[1] - C[1], P1[0] - C[0]);
  let dt = Math.atan2(P2[1] - C[1], P2[0] - C[0]) - a1;
  if (b.fs) { while (dt <= 0) dt += 2 * Math.PI; } else { while (dt >= 0) dt -= 2 * Math.PI; }
  const apex = [C[0] + R * Math.cos(a1 + dt / 2), C[1] + R * Math.sin(a1 + dt / 2)];
  const mid = [(P0[0] + P3[0]) / 2, (P0[1] + P3[1]) / 2];
  const dir = [apex[0] - mid[0], apex[1] - mid[1]];
  return { l1, l2, leg: (l1 + l2) / 2, R, turn, apex, dir };
}

/** Rotate a bend about its apex so it points along `want` (deg: 90 = down, -90 = up), then put the
 *  apex on `at`. Card 1.1 compares bends ignoring direction; this is the overlay's version of that. */
export function bendAnchor(bend, wantDeg, at) {
  const have = (Math.atan2(bend.dir[1], bend.dir[0]) * 180) / Math.PI;
  let turn = wantDeg - have;
  // Snap to a quarter turn when the mark already sits on an axis (every chevron does): the rotation is then exact.
  const q = Math.round(turn / 90) * 90;
  if (Math.abs(turn - q) < 1e-6) turn = q;
  const R = rotateAbout(turn, bend.apex[0], bend.apex[1]);
  return compose(translate(at[0] - bend.apex[0], at[1] - bend.apex[1]), R);
}

// ── comparing ───────────────────────────────────────────────────────────────────────────────

const canonD = (d) => canonical(d).d;
/** The card's residual: congruentUpToTranslation on canonical spellings (the workaround for the
 *  ring-direction defect), with the pairing bound opened so a far miss still reports a number. */
export function residual(dA, dB) {
  let r;
  try { r = congruentUpToTranslation(canonD(dA), canonD(dB), { near: 1e3, pairBound: 1e3 }); } catch { return { dev: null, offset: null, why: 'unsupported' }; }
  if (!Number.isFinite(r.maxDeviation)) return { dev: null, offset: null, why: r.reason };
  return { dev: r.maxDeviation, offset: r.offset, why: null };
}
/** The best-fit offset that puts B on A — the anchor congruentUpToTranslation itself uses. */
function fitOffset(dRef, d) {
  // congruentUpToTranslation(A, B) reports B ≈ A + offset: A is this instance, B the anchor.
  return residual(d, dRef).offset;
}

// ── pickers: which subpaths of a drawing are the primitive ──────────────────────────────────

const CONTAINER = (m) => SPEC[m].keylines.circle[0];
const SQUARE = (m) => SPEC[m].keylines.square[0];
/** Card 1.1 §2.3 counts "full circles below the container threshold" without stating the threshold.
 *  Its outline counts (158 · 135 · 137 dots, 13 · 12 · 15 diameters) come back exactly with ink ⌀
 *  below 0.575 of the container ring's (11.5 · 9.2 · 8.05); that is the rule here, and `--print`
 *  lists the filled counts it does not reproduce. */
export const DOT_SHARE = 0.575;
const isRing = (p, m) => p.circle && Math.abs(2 * p.circle.r + p.w - CONTAINER(m)) < EPS
  && Math.abs(p.circle.cx - m / 2) < EPS && Math.abs(p.circle.cy - m / 2) < EPS;
const isDot = (p, m) => p.circle && !isRing(p, m) && 2 * p.circle.r + p.w < DOT_SHARE * CONTAINER(m) - EPS;
/** A rounded square on the square keyline (18 · 14 · 12), centred: four sides, four equal corners. */
function isRoundedSquare(p, m) {
  if (p.circle) return false;
  const [w, h] = sizeOf(p.ink), [cx, cy] = centreOf(p.ink);
  if (Math.abs(w - SQUARE(m)) > 0.005 || Math.abs(h - SQUARE(m)) > 0.005 || Math.abs(cx - m / 2) > EPS || Math.abs(cy - m / 2) > EPS) return false;
  let s; try { s = normalise(p.d).subpaths; } catch { return false; }
  if (s.length !== 1 || !s[0].ring || s[0].segs.length !== 8) return false;
  const arcs = s[0].segs.filter((g) => g.cmd === 'A'), lines = s[0].segs.filter((g) => g.cmd === 'L');
  let at = s[0].start;
  const square = s[0].segs.every((g) => { const ok = g.cmd !== 'L' || Math.abs(g.to[0] - at[0]) < EPS || Math.abs(g.to[1] - at[1]) < EPS; at = g.to; return ok; });
  return square && arcs.length === 4 && lines.length === 4 && arcs.every((g) => Math.abs(g.r[0] - arcs[0].r[0]) < EPS && Math.abs(g.r[0] - g.r[1]) < EPS);
}
const isLine = (p) => { try { const s = normalise(p.d).subpaths; return s.length === 1 && !s[0].ring && s[0].segs.length === 1 && s[0].segs[0].cmd === 'L'; } catch { return false; } };
const lineOf = (p) => { const s = normalise(p.d).subpaths[0]; return { a: s.start, b: s.segs[0].to }; };
const horiz = (p) => isLine(p) && Math.abs(lineOf(p).a[1] - lineOf(p).b[1]) < EPS;
const vert = (p) => isLine(p) && Math.abs(lineOf(p).a[0] - lineOf(p).b[0]) < EPS;
const diag = (p) => { if (!isLine(p)) return false; const { a, b } = lineOf(p); return Math.abs(Math.abs(a[0] - b[0]) - Math.abs(a[1] - b[1])) < 0.02; };
const midOf = (p) => { const { a, b } = lineOf(p); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
const same = (a, b, t = 0.01) => Math.abs(a[0] - b[0]) < t && Math.abs(a[1] - b[1]) < t;
const one = (p) => ({ d: p.d, kind: p.kind, w: p.w, parts: [p] });
const join2 = (ps) => ({ d: ps.map((p) => p.d).join(''), kind: ps[0].kind, w: ps[0].w, parts: ps });

/** Two straight lines crossing at their midpoints: a plus (one horizontal, one vertical) or an x. */
function crossing(ic, kind) {
  const L = ic.parts.filter((p) => isLine(p));
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
    const a = L[i], b = L[j];
    if (a.w !== b.w || !same(midOf(a), midOf(b))) continue;
    if (kind === 'plus' && ((horiz(a) && vert(b)) || (vert(a) && horiz(b)))) return [horiz(a) ? a : b, horiz(a) ? b : a];
    if (kind === 'x' && diag(a) && diag(b) && !horiz(a) && !horiz(b)) return [a, b];
  }
  return null;
}

/** In a filled twin, the part is the subpath standing where the outline's part stands: the nearest
 *  ink box (C12 keeps the filled outer edge on the outline's). Used when a filled file builds the part
 *  another way (a cut, a solid) so no shape match is possible. */
function nearestBox(ic, target, exclude = () => false, limit = 6) {
  let best = null;
  for (const p of ic.parts) {
    if (exclude(p)) continue;
    const dd = boxDist(p.ink, target);
    if (!best || dd < best.dd) best = { p, dd };
  }
  return best && best.dd < limit ? [one(best.p)] : [];
}

/** The subpath of `ic` that is most nearly `refD` (same structure, smallest residual). */
function bestMatch(ic, refD, kind) {
  let best = null;
  for (const p of ic.parts) {
    if (kind && p.kind !== kind) continue;
    const r = residual(refD, p.d);
    if (r.dev == null) continue;
    if (!best || r.dev < best.dev) best = { p, dev: r.dev };
  }
  return best;
}

// ── the panels ──────────────────────────────────────────────────────────────────────────────
// `rows` lists the concepts, in the order the page shows them (never re-ordered by a toggle).
// `partner` names the row's reference when it is not the panel's. Every figure a card states is in
// `against`, which --print checks and the page shows beside the measured value.

export const PANELS = [
  // ── card 1.1: the vocabulary ──
  {
    id: 'ring', group: 'vocabulary', title: 'Container ring', kind: 'residual', ref: 'plus-circle',
    question: 'Is the circle in every -circle icon the same circle?',
    source: 'findings-primitives.md:154-192',
    anchor: 'none — every ring already sits on the canvas centre',
    rows: 'auto', pick: (ic, m) => ic.parts.filter((p) => isRing(p, m)).map(one),
  },
  {
    id: 'square', group: 'vocabulary', title: 'Rounded square', kind: 'residual', ref: 'checkbox',
    question: 'Is the 18 · 14 · 12 square one drawing wherever it is a container?',
    source: 'findings-primitives.md:194-213; findings-grammar.md:457',
    anchor: 'none — every square already sits on the canvas centre',
    rows: 'auto', pick: (ic, m) => ic.parts.filter((p) => isRoundedSquare(p, m)).map(one),
  },
  {
    id: 'dot', group: 'vocabulary', title: 'Dot', kind: 'diameter',
    question: 'How many dot sizes does the set use, and does the glyph dot stay its own size at 20 and 16?',
    source: 'findings-primitives.md:215-273',
    anchor: 'each dot\'s centre on the canvas centre, so the sizes read as rings',
    rows: 'auto', pick: (ic, m) => ic.parts.filter((p) => isDot(p, m)).map(one),
  },
  {
    id: 'plus', fillByBox: true, group: 'vocabulary', title: 'Plus — one or six?', kind: 'residual',
    question: 'The plus is drawn at six sizes at 24. Is that one plus at six sizes, or six pluses?',
    source: 'findings-grammar.md:334-363; findings-primitives.md:275-301',
    anchor: 'the crossing of the two bars, on the canvas centre',
    rows: ['plus-large', 'plus', 'plus-small', 'plus-circle', 'plus-circle-small', 'volume-plus'].map((name) => ({ name, partner: name })),
    pick: (ic) => { const c = crossing(ic, 'plus'); return c ? [join2(c)] : []; },
    centre: (inst) => midOf(inst.parts[0]),
  },
  {
    id: 'bar', fillByBox: true, group: 'vocabulary', title: 'The bar — minus is the plus\'s', kind: 'residual',
    question: 'Is every minus literally its plus\'s horizontal bar?',
    source: 'findings-primitives.md:289-301',
    anchor: 'best-fit offset onto the row\'s plus bar (congruence.mjs)',
    rows: [
      ['plus-large'], ['minus-large', 'plus-large'], ['plus'], ['minus', 'plus'], ['plus-small'], ['minus-small', 'plus-small'],
      ['plus-circle'], ['minus-circle', 'plus-circle'], ['plus-circle-small'], ['minus-circle-small', 'plus-circle-small'],
    ].map(([name, partner]) => ({ name, partner: partner ?? name })),
    pick: (ic) => { const c = crossing(ic, 'plus'); if (c) return [one(c[0])]; const h = ic.parts.filter(horiz); return h.length === 1 ? [one(h[0])] : []; },
  },
  {
    id: 'x', fillByBox: true, group: 'vocabulary', title: 'The x', kind: 'residual',
    question: 'Is volume-x\'s x the small ring\'s x, and does C8\'s step hold on the x?',
    source: 'findings-primitives.md:303-322',
    anchor: 'the crossing of the two arms, on the canvas centre',
    rows: [['x-large'], ['x'], ['x-small'], ['x-circle'], ['x-circle-small'], ['volume-x', 'x-circle-small']].map(([name, partner]) => ({ name, partner: partner ?? name })),
    pick: (ic) => { const c = crossing(ic, 'x'); return c ? [join2(c)] : []; },
    centre: (inst) => midOf(inst.parts[0]),
  },
  {
    id: 'slash', fillByBox: true, group: 'vocabulary', title: 'The slash (C21 bar)', kind: 'residual', ref: 'ban',
    question: 'Is the slash of ban one drawing in every ban, and how does it sit against the ring?',
    source: 'findings-primitives.md:318-333; findings-grammar.md:352',
    anchor: 'best-fit offset onto ban\'s slash',
    rows: [{ name: 'ban' }, { name: 'ban-2' }, { name: 'ban-3' }, { name: 'volume-off' }],
    pick: (ic) => ic.parts.filter((p) => diag(p) && !horiz(p)).map(one),
  },
  {
    id: 'chevron', group: 'vocabulary', title: 'Chevron', kind: 'bend', point: 90,
    question: 'Do the four directions share one drawing, and does the filled chevron-2 read as its outline now that the 2× cap moved the angle?',
    source: 'findings-primitives.md:335-401',
    anchor: 'each chevron turned about the canvas centre to point down (quarter turns, exact), so every chevron stays where its own file draws it and a filled twin sits on its outline as it would in use',
    turnAboutCanvas: true,
    rows: 'auto', only: (name) => /^chevron-(up|down|left|right)(-\d)?(-small|-large)?$/.test(name),
    pick: (ic) => ic.parts.map((p) => ({ p, b: bendOf(p.d) })).filter(({ b }) => b && b.turn >= 10).map(({ p }) => one(p)),
  },
  {
    id: 'arrowhead', group: 'vocabulary', title: 'Arrowhead', kind: 'bend', point: -90,
    question: 'Is the arrowhead one drawing, and where does it split into near-twins?',
    source: 'findings-primitives.md:403-468; findings-grammar.md:356-363',
    anchor: 'each head turned to point up with its apex on one point',
    rows: 'auto', only: (name) => !/^chevron/.test(name),
    pick: (ic) => ic.parts.map((p) => ({ p, b: bendOf(p.d) }))
      .filter(({ b }) => b && b.turn >= 10 && Math.abs(b.l1 - b.l2) <= 0.02).map(({ p }) => one(p)),
  },
  {
    id: 'badge', group: 'vocabulary', title: 'Badge', kind: 'empty',
    question: 'May a modifier badge cross 22? — the set has no badge to look at.',
    source: 'findings-primitives.md:470-481; findings-grammar.md:253-292',
    anchor: '—', rows: [], pick: () => [],
  },

  // ── card 1.9 §2.3: shared parts that break at one master ──
  {
    id: 'check', group: 'parts', title: 'Check — box and ring', kind: 'residual',
    question: 'Is checkbox\'s tick the ring\'s tick at every master, and does each number name the same tick?',
    source: 'findings-primitives.md:595-614; findings-grammar.md:427; findings-families.md:190-219',
    anchor: 'best-fit offset onto the row\'s check-circle tick',
    rows: [['check-circle'], ['checkbox', 'check-circle'], ['check-circle-3'], ['checkbox-2', 'check-circle-3'],
      ['check-circle-4'], ['checkbox-3', 'check-circle-4'], ['check-circle-small'], ['checkbox-4', 'check-circle-small']]
      .map(([name, partner]) => ({ name, partner: partner ?? name })),
    refPart: (ic) => ic.parts.find((p) => bendOf(p.d)),
  },
  part('door', 'Door', 'home', ['home', 'home-2', 'store', 'store-2', 'building', 'building-2'],
    'Is the arched door one drawing in home, store and building?', 'findings-grammar.md:425', (ic) => ic.parts[1]),
  part('star', 'Companion star', 'sparkle-3', ['sparkle-3', 'sparkle-2', 'wand'],
    'Do the three companion stars read as one star?', 'findings-grammar.md:426, 591', (ic) => ic.parts[1]),
  part('knob', 'Slider knob', 'sliders', ['sliders', 'sliders-3', 'sliders-5'],
    'Is the slider knob one ring?', 'findings-grammar.md:428, 401', (ic) => ic.parts[2]),
  part('hook', 'Cart hook and post', 'cart', ['cart', 'cart-3'],
    'Are cart and cart-3 one hook and post?', 'findings-grammar.md:429, 400', (ic) => ic.parts[0]),
  part('cradle', 'Microphone cradle', 'microphone', ['microphone', 'microphone-2', 'microphone-5'],
    'Is the cradle under the capsule one drawing?', 'findings-grammar.md:430, 402', (ic) => ic.parts[1]),
  part('shackle', 'Lock shackle', 'lock-3', ['lock-3', 'lock-5'],
    'Is the round lock\'s shackle one drawing?', 'findings-grammar.md:431', (ic) => ic.parts[1]),
  part('diagonal', 'Diagonal arrowhead', 'arrow-up-right', ['arrow-up-right', 'external-link', 'external-link-2', 'refresh-3'],
    'Is the diagonal head one drawing where it recurs?', 'findings-grammar.md:432; findings-primitives.md:780', (ic) => ic.parts[0]),
  part('landscape', 'Landscape container 20×16', 'mail',
    ['mail', 'mail-2', 'credit-card', 'credit-card-2', 'credit-card-3', 'desktop-5', 'image-3', 'wallet-2', 'presentation-2', 'keyboard', 'keyboard-2', 'briefcase'],
    'Is the 20×16 container one drawing, and who joins it as the master shrinks?', 'findings-grammar.md:433, 458', (ic) => ic.parts[0]),

  // ── card 1.1 §3.4: one outline, several fills ──
  {
    id: 'layout', group: 'fills', title: 'Layout — one outline, three fills', kind: 'residual', whole: true, ref: 'layout-footer',
    question: 'Are layout-footer, -2 and -3 three icons, or one icon with three fills?',
    source: 'findings-primitives.md:616-646, 1021; findings-families.md:233-236',
    anchor: 'header, sidebar and sidebar-right turned back onto the footer (C29: mirrored, a quarter turn, reflected); footers as drawn',
    rows: ['footer', 'header', 'sidebar', 'sidebar-right'].flatMap((r) => ['', '-2', '-3', '-4'].map((n) => ({ name: `layout-${r}${n}`, partner: `layout-footer${n}`, region: r }))),
  },
  {
    id: 'twins', group: 'fills', title: 'Other shared outlines', kind: 'residual', whole: true,
    question: 'Which other numbers share one outline — and which are a second name for one drawing?',
    source: 'findings-primitives.md:616-646',
    anchor: 'none — whole drawings as they sit in the canvas',
    rows: [['ban'], ['ban-2', 'ban'], ['building-3'], ['building-4', 'building-3'], ['compass'], ['compass-3', 'compass'],
      ['globe'], ['language-2', 'globe'], ['globe-2'], ['language-3', 'globe-2']].map(([name, partner]) => ({ name, partner: partner ?? name })),
  },
];

function part(id, title, ref, names, question, source, refPart) {
  return {
    id, group: 'parts', title, kind: 'residual', ref, question, source: `${source}`,
    anchor: `best-fit offset onto ${ref}'s ${title.toLowerCase()} (congruence.mjs)`,
    rows: names.map((name) => ({ name })), refPart,
  };
}

/** C29: header = footer mirrored top to bottom, sidebar = footer turned a quarter, sidebar-right =
 *  the sidebar reflected (docs/07-character.md:69). The inverse maps bring each region back onto the footer. */
function regionToFooter(region, m) {
  const c = m / 2;
  if (region === 'header') return [1, 0, 0, -1, 0, m];                          // y → m − y
  if (region === 'sidebar') return rotateAbout(-90, c, c);
  if (region === 'sidebar-right') return compose(rotateAbout(-90, c, c), [-1, 0, 0, 1, m, 0]);
  return IDENTITY;
}

// ── building one panel ──────────────────────────────────────────────────────────────────────

const fileOf = (name, style) => (style === 'filled' ? `${name}-filled` : name);

/** Rows a picker finds across the set, for panels whose concept list is measured, not written down. */
function autoRows(spec, set) {
  const names = new Set();
  for (const m of MASTER_LIST) for (const ic of Object.values(set[m])) {
    const base = ic.name.replace(/-filled$/, '');
    if (spec.only && !spec.only(base)) continue;
    if (spec.pick(ic, m).length) names.add(base);
  }
  return [...names].sort().map((name) => ({ name }));
}

function instancesFor(spec, set, rows, m, style, outlineByRow) {
  const out = [];
  rows.forEach((row, ri) => {
    const ic = set[m][fileOf(row.name, style)];
    if (!ic) return;
    let found;
    if (spec.whole) found = ic.parts.length ? [join2(ic.parts)] : [];
    else if (spec.refPart) {
      // A card 1.9 part: in the outline, the subpath most nearly the reference's part (same structure,
      // smallest residual); in a filled twin, the subpath standing where the outline's part stands.
      if (style === 'outline') {
        const refIc = set[m][row.partner ?? spec.ref ?? row.name];
        const rp = refIc && spec.refPart(refIc);
        const b = rp && bestMatch(ic, rp.d, rp.kind);
        found = b ? [one(b.p)] : [];
      } else {
        const o = outlineByRow.get(ri);
        found = o ? nearestBox(ic, o[0].ink) : [];
      }
    } else {
      found = spec.pick(ic, m);
      // A filled mark built as a cut (plus-circle-filled's plus is a hole in the disc) has no line to
      // find: take the subpath where the outline's mark stands.
      if (!found.length && style === 'filled' && outlineByRow.get(ri) && spec.fillByBox) {
        found = nearestBox(ic, outlineByRow.get(ri)[0].ink, (p) => isRing(p, m));
      }
    }
    for (const f of found) {
      const ink = f.parts.reduce((bx, p) => union(bx, p.ink), null);
      out.push({ r: ri, d: f.d, k: f.kind === 'area' ? 'a' : 's', w: f.w, parts: f.parts, ink });
    }
  });
  if (style === 'outline') {
    for (const it of out) { if (!outlineByRow.has(it.r)) outlineByRow.set(it.r, []); outlineByRow.get(it.r).push(it); }
  }
  return out;
}

const comparable = (a, b) => a && b && a.k === b.k && a.w === b.w;

/** Where each instance goes in the overlay, and what it is measured against. */
function placeAndMeasure(spec, rows, m, inst) {
  const byRow = new Map();
  for (const it of inst) { if (!byRow.has(it.r)) byRow.set(it.r, []); byRow.get(it.r).push(it); }
  const rowIndex = (name) => rows.findIndex((r) => r.name === name);
  const refRow = spec.ref ? rowIndex(spec.ref) : -1;
  // The row each instance is read against: its partner, else the panel's reference, else itself.
  const targetRow = (row, ri) => (row.partner ? rowIndex(row.partner) : refRow >= 0 ? refRow : ri);

  // 1. where it goes. Anchors are placed before the rows that hang on them, so a row fitted onto a
  //    partner that has itself been moved lands where the partner was drawn in the overlay.
  const place = (it) => {
    if (it.m) return;
    const row = rows[it.r];
    if (spec.kind === 'bend') {
      it.bend = bendOf(it.d);
      if (spec.turnAboutCanvas) {
        const have = (Math.atan2(it.bend.dir[1], it.bend.dir[0]) * 180) / Math.PI;
        it.m = rotateAbout(Math.round((spec.point - have) / 90) * 90, m / 2, m / 2); it.a = 'turn';
      } else { it.m = bendAnchor(it.bend, spec.point, [m / 2, m / 2]); it.a = 'apex'; }
    }
    else if (spec.kind === 'diameter') { const c = it.parts[0].circle; it.m = translate(m / 2 - c.cx, m / 2 - c.cy); it.a = 'centre'; }
    else if (spec.whole && row.region) { it.m = regionToFooter(row.region, m); it.a = row.region === 'footer' ? 'none' : 'turn'; }
    else if (spec.centre) {
      const [cx, cy] = it.k === 's' && it.parts.length === 2 ? spec.centre(it) : centreOf(it.ink);
      it.m = translate(m / 2 - cx, m / 2 - cy); it.a = 'centre';
    } else {
      const tr = targetRow(row, it.r);
      const anchor = tr === it.r ? null : byRow.get(tr)?.[0];
      if (!anchor) { it.m = IDENTITY; it.a = 'none'; }
      else {
        place(anchor);
        const off = comparable(anchor, it) ? fitOffset(anchor.d, it.d) : null;
        if (off) { it.m = compose(anchor.m, translate(off[0], off[1])); it.a = 'fit'; }
        else { const [ax, ay] = centreOf(anchor.ink), [cx, cy] = centreOf(it.ink); it.m = compose(anchor.m, translate(ax - cx, ay - cy)); it.a = 'box'; }
      }
    }
    it.td = transformD(it.d, it.m);
  };
  inst.forEach(place);

  // 2. the measure the card used
  for (const it of inst) {
    const row = rows[it.r];
    if (spec.kind === 'diameter') { it.v = r3(2 * it.parts[0].circle.r + it.w); continue; }
    if (spec.kind === 'bend') { it.v = r3(it.bend.leg); continue; }
    const tr = targetRow(row, it.r);
    const target = byRow.get(tr)?.[0];
    if (tr === it.r) { it.v = 0; it.self = true; continue; }
    if (!target) { it.v = null; it.why = 'its reference has no such part here'; continue; }
    if (!comparable(target, it)) { it.v = null; it.why = 'drawn another way'; continue; }
    const res = residual(target.td, it.td);
    it.v = res.dev == null ? null : r3(res.dev);
    if (res.dev == null) it.why = 'a different structure';
  }
}

/** Classes: congruence (translation, tol 0.01) on the overlaid spelling, per way of drawing — or the
 *  card's parameter for diameters and bends. Labelled A, B, C … biggest first. */
function classesOf(spec, inst) {
  const groups = new Map();
  if (spec.kind === 'diameter' || spec.kind === 'bend') {
    for (const it of inst) {
      const key = spec.kind === 'diameter' ? `⌀${r3(2 * it.parts[0].circle.r + it.w)}`
        : `leg ${r3(it.bend.leg)} · R ${r2(it.bend.R)} · ${(Math.round(it.bend.turn * 10) / 10).toFixed(1)}°`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
  } else {
    const byWay = new Map();
    inst.forEach((it, i) => { const w = `${it.k}${it.w}`; if (!byWay.has(w)) byWay.set(w, []); byWay.get(w).push({ id: i, d: it.td }); });
    for (const items of byWay.values()) {
      const res = classify(items, { mode: 'translation', tol: 0.01 });
      for (const g of res.groups) groups.set(`${g.key}#${items[0].id}`, g.members.map((id) => inst[id]));
    }
  }
  const firstRow = (g) => Math.min(...g.members.map((it) => it.r));
  const list = [...groups.entries()].map(([key, members]) => ({ key, members }))
    .sort((a, b) => (spec.kind === 'diameter' ? parseFloat(a.key.slice(1)) - parseFloat(b.key.slice(1))
      : b.members.length - a.members.length || firstRow(a) - firstRow(b)));
  const letters = (i) => (i < 26 ? String.fromCharCode(65 + i) : `${String.fromCharCode(65 + Math.floor(i / 26) - 1)}${String.fromCharCode(65 + (i % 26))}`);
  return list.map((g, i) => {
    const rep = g.members[0];
    const box = g.members.reduce((b, it) => b ?? boxOfInk(it), null);
    const [w, h] = sizeOf(box);
    for (const it of g.members) it.c = i;
    return {
      label: spec.kind === 'diameter' ? g.key : letters(i),
      key: spec.kind === 'residual' ? null : g.key,
      size: `${r2(w)}×${r2(h)}`,
      n: g.members.length,
      rows: new Set(g.members.map((it) => it.r)).size,
      rep: rep.r,
    };
  });
}
const boxOfInk = (it) => grow(boxOfD(it.td), it.w / 2);

/** One panel, every master and style. Rows a picker found are ordered by their class at 24 outline
 *  (the order the cards' tables use) and carry that class as a group label. */
export function buildPanel(spec, set) {
  if (spec.rows !== 'auto') return buildRows(spec, set, spec.rows.map((r) => ({ ...r })));
  const first = buildRows(spec, set, autoRows(spec, set));
  const at24 = first.data[24].outline;
  const key = (ri) => { const it = at24.instances.find((i) => i.r === ri); return it ? it.c : Infinity; };
  const order = first.rows.map((r, ri) => ({ r, k: key(ri) })).sort((a, b) => a.k - b.k || a.r.name.localeCompare(b.r.name));
  const rows = order.map(({ r, k }) => ({ ...r, group: Number.isFinite(k) ? at24.classes[k].label : null }));
  return buildRows(spec, set, rows);
}
function buildRows(spec, set, rows) {
  const data = {};
  for (const m of MASTER_LIST) {
    data[m] = {};
    const outlineByRow = new Map();
    let frame = null;
    for (const style of STYLES) {
      if (spec.kind === 'empty') { data[m][style] = { instances: [], classes: [] }; continue; }
      const inst = instancesFor(spec, set, rows, m, style, outlineByRow);
      placeAndMeasure(spec, rows, m, inst);
      const classes = classesOf(spec, inst);
      for (const it of inst) frame = union(frame, boxOfInk(it));
      data[m][style] = { instances: inst, classes };
    }
    // One frame per master for both styles, so the overlay never rescales when the style changes.
    data[m].frame = frame ? squareFrame(frame, m) : [0, 0, m, m];
  }
  return { spec, rows, data };
}
function squareFrame(b, m) {
  const pad = m / 24;
  const [cx, cy] = centreOf(b), s = Math.max(...sizeOf(b)) + 2 * pad;
  return [cx - s / 2, cy - s / 2, s, s].map((n) => Math.round(n * 1000) / 1000);
}

// ── what the cards say, beside what this measures ──────────────────────────────────────────
// Each line: the panel, a reading taken from the built data, the card's figure and where it says it.

const conceptsWith = (P, m, style, cls) => new Set(P.data[m][style].instances.filter((i) => cls == null || i.c === cls).map((i) => P.rows[i.r].name)).size;
const rowV = (P, name, m, style = 'outline') => P.data[m][style].instances.find((i) => P.rows[i.r].name === name)?.v ?? null;
const rowSize = (P, name, m, style = 'outline') => { const it = P.data[m][style].instances.find((i) => P.rows[i.r].name === name); return it ? sizeOf(boxOfInk(it)).map(r2).join('×') : null; };
const classCount = (P, m, style) => P.data[m][style].classes.length;
const dotStats = (P, m, style) => `${P.data[m][style].instances.length} dots · ${P.data[m][style].classes.length} diameters`;

// Each line: [reader, what the card says — its own words or figures only, where it says it, `expect`,
// this page's note]. `expect` is the measured string that would mean "the same as the card"; null where
// the card gives no comparable figure (the line is then a note, never a pass). The note is this page's
// gloss, kept out of the card's column. A line that differs stays on the page.
export const AGAINST = {
  ring: [
    [(P) => MASTER_LIST.map((m) => conceptsWith(P, m, 'outline')).join(' · '), '40 · 40 · 40 outline concepts', 'findings-primitives.md:160-165', '40 · 40 · 40'],
    [(P) => MASTER_LIST.map((m) => P.data[m].filled.instances.filter((i) => i.k === 'a').length).join(' · '), '37 · 37 · 37 filled concepts', 'findings-primitives.md:161-165', '37 · 37 · 37', 'ban-filled and compass-2-filled draw the ring as a stroke and are listed separately (findings-primitives.md:173-180)'],
    [(P) => MASTER_LIST.map((m) => Math.max(...P.data[m].outline.instances.map((i) => i.v ?? 0))).join(' · '), 'residual 0, offset [0, 0], in all 21 comparisons', 'findings-primitives.md:167-169', '0 · 0 · 0'],
    [(P) => MASTER_LIST.map((m) => conceptsWith(P, m, 'outline')).join(' · '), '"41 outline and 40 filled concepts, one circle"', 'findings-primitives.md:986', '41 · 41 · 41', 'the card\'s own §2.1 table says 40 outline (findings-primitives.md:160)'],
  ],
  square: [
    [(P) => MASTER_LIST.map((m) => conceptsWith(P, m, 'outline', 0)).join(' · '), 'card 1.1: 26 outline concepts at 24 · 20 · 16', 'findings-primitives.md:198-200', '26 · 26 · 26', 'card 1.9 counts 24 (next line); the plan\'s wave-5 list carries both'],
    [(P) => MASTER_LIST.map((m) => conceptsWith(P, m, 'outline', 0)).join(' · '), 'card 1.9: "24 concepts in one classify class" at 24', 'findings-grammar.md:457, 682', '24 · 24 · 24'],
    [(P) => MASTER_LIST.map((m) => conceptsWith(P, m, 'filled', 0)).join(' · '), '5 · 5 · 5 filled concepts', 'findings-primitives.md:201-203', '5 · 5 · 5'],
  ],
  dot: [
    [(P) => MASTER_LIST.map((m) => dotStats(P, m, 'outline')).join(' | '), 'outline: 158 dots · 13 diameters, 135 · 12, 137 · 15', 'findings-primitives.md:221-225', '158 dots · 13 diameters | 135 dots · 12 diameters | 137 dots · 15 diameters', `dots are full circles with ink ⌀ under ${DOT_SHARE} of the container ring's; the card states no threshold, and this one reproduces its outline counts`],
    [(P) => MASTER_LIST.map((m) => dotStats(P, m, 'filled')).join(' | '), 'filled: 168 dots · 16 diameters, 144 · 14, 148 · 17', 'findings-primitives.md:222-226', '168 dots · 16 diameters | 144 dots · 14 diameters | 148 dots · 17 diameters', 'the threshold that reproduces the outline counts does not reproduce these'],
    [(P) => MASTER_LIST.map((m) => rowDots(P, 'info', m)).join(' · '), 'glyph dot ⌀2.5 at 24, ⌀2 at 20 and at 16', 'findings-primitives.md:233, 246-251', '⌀2.5 · ⌀2 · ⌀2'],
    [(P) => MASTER_LIST.map((m) => rowDots(P, 'building', m)).join(' · '), 'detail dot ⌀2 · 2 · "1.5 / 1.75 / 2 — splits three ways"', 'findings-primitives.md:232', '⌀2 · ⌀2 · ⌀1.5', 'building is the 1.5 of the three'],
    [(P) => groupAt(P, 2.5, 20), 'the ⌀2.5 row at 24 (13 concepts): ⌀ at 20 "2 — merges with the ⌀2 group"', 'findings-primitives.md:233', '13 at ⌀2', 'the eleven glyph concepts do; sparkle-4 and wand keep ⌀2.5'],
    [(P) => MASTER_LIST.map((m) => rowDots(P, 'more-horizontal', m)).join(' · '), 'C17 dot ⌀3 → ⌀2.7 → ⌀2.4 of ink', 'findings-primitives.md:267-270', '⌀3 · ⌀2.7 · ⌀2.4'],
  ],
  plus: [
    [(P) => P.rows.map((r) => rowSize(P, r.name, 24)?.split('×')[0]).join(' · '), '"Six plus sizes at 24 (18, 15, 12, 10.5, 9, 8)"', 'findings-grammar.md:341, 356', '18 · 15 · 12 · 10.5 · 9 · 8'],
    [(P) => ['plus-large', 'plus', 'plus-small'].map((n) => MASTER_LIST.map((m) => rowSize(P, n, m)?.split('×')[0]).join('/')).join(' · '), 'plus-large 18 · 16 · 14, plus 15 · 13.5 · 12, plus-small 12 · 11 · 10', 'findings-primitives.md:281-283', '18/16/14 · 15/13.5/12 · 12/11/10'],
    [(P) => ['plus-circle', 'plus-circle-small', 'volume-plus'].map((n) => MASTER_LIST.map((m) => rowSize(P, n, m)?.split('×')[0]).join('/')).join(' · '), 'inside a ring 10.5 / 9, 8 / 7, 6.5 / 5.5; beside an object 8, 6, 5', 'findings-grammar.md:341-343', '10.5/8/6.5 · 9/7/5.5 · 8/6/5'],
  ],
  bar: [
    [(P) => `${P.rows.filter((r) => r.partner !== r.name).map((r) => MASTER_LIST.map((m) => (rowV(P, r.name, m) === 0 ? 1 : 0))).flat().reduce((a, b) => a + b, 0)} of 15 outline, ${MASTER_LIST.map((m) => (rowV(P, 'minus', m, 'filled') === 0 ? 1 : 0)).reduce((a, b) => a + b, 0)} of 3 filled identical`, '"Eighteen of eighteen identical, residual 0"', 'findings-primitives.md:289-301', '15 of 15 outline, 3 of 3 filled identical', 'five pairs × three masters in outline, and minus filled × three'],
  ],
  x: [
    [(P) => ['x-large', 'x', 'x-small'].map((n) => MASTER_LIST.map((m) => rowSize(P, n, m)?.split('×')[0]).join('/')).join(' · '), 'x-large 16 · 14.5 · 12.5, x 13 · 12 · 10.5, x-small 10 · 9.5 · 8.5', 'findings-primitives.md:309-311', '16/14.5/12.5 · 13/12/10.5 · 10/9.5/8.5'],
    [(P) => MASTER_LIST.map((m) => rowV(P, 'volume-x', m)).join(' · '), 'volume-x\'s arm vs x-circle-small\'s: IDENTICAL · IDENTICAL · IDENTICAL', 'findings-primitives.md:321', '0 · 0 · 0'],
  ],
  slash: [
    [(P) => MASTER_LIST.map((m) => rowV(P, 'ban-2', m)).join(' · '), 'ban\'s slash vs ban-2\'s: IDENTICAL · IDENTICAL · IDENTICAL', 'findings-primitives.md:320', '0 · 0 · 0'],
    [(P) => MASTER_LIST.map((m) => rowSize(P, 'ban', m)).join(' · '), 'the C21 bar, ink square: ban 14.58 · 11.76 · 10.26', 'findings-grammar.md:352', '14.58×14.58 · 11.76×11.76 · 10.26×10.26'],
    [(P) => MASTER_LIST.map((m) => rowSize(P, 'ban-3', m)).join(' · '), 'ban-3 9.98 · 7.34 · 5.92', 'findings-grammar.md:352', '9.98×9.98 · 7.34×7.34 · 5.92×5.92'],
    [(P) => MASTER_LIST.map((m) => rowSize(P, 'volume-off', m)).join(' · '), 'volume-off 18 · 14 · 12', 'findings-grammar.md:352', '18×18 · 14×14 · 12×12'],
  ],
  chevron: [
    [(P) => MASTER_LIST.map((m) => `${classCount(P, m, 'outline')}/${classCount(P, m, 'filled')}`).join(' · '), '"the 36 collapse to 9 shapes at every master in both styles"; and, the card\'s claim: "at 20 and 16 filled the raw count reads 10 … the shapes are mirrors, 0.009 units apart in leg length"', 'findings-primitives.md:337-341', '9/9 · 9/9 · 9/9', 'here every chevron-*-2 at 20 filled reads leg 5.558 and at 16 filled 4.661, legs equal: the card\'s tenth class does not appear in this page\'s data'],
    [(P) => MASTER_LIST.map((m) => [...new Set(P.data[m].outline.instances.map((i) => r3(i.bend.R)))].join('/')).join(' · '), '"Outline bend radius: 0.75 / 0.75 / 0.625 on all 36"', 'findings-primitives.md:343-344', '0.75 · 0.75 · 0.625'],
    [(P) => MASTER_LIST.map((m) => `${turnOf(P, 'chevron-down-2', m, 'outline')}→${turnOf(P, 'chevron-down-2', m, 'filled')}`).join(' · '), 'chevron-down-2, outline → filled turn: 69.260° → 65.052° · 67.380° → 66.066° · 69.590° → 65.744°', 'findings-primitives.md:354, 363, 372', '69.26→65.05 · 67.38→66.07 · 69.59→65.74', 'compared at 2 dp: the card\'s figures equal each leg\'s angle rounded to 3 dp and doubled; this page measures the angle between the legs directly; the two differ by at most 0.001°'],
    [(P) => ['chevron-down-small', 'chevron-down', 'chevron-down-large'].map((n) => turnOf(P, n, 16, 'outline')).join(' · '), 'classic at 16, small · default · large: 88.698° · 89.008° · 89.198°', 'findings-primitives.md:368-370', '88.70 · 89.01 · 89.20', 'compared at 2 dp, as above'],
  ],
  arrowhead: [
    [(P) => `${P.data[24].outline.instances.length} heads · ${classCount(P, 24, 'outline')} classes`, '"106 heads in 25 distinct drawings" at 24 outline', 'findings-primitives.md:405-406', '106 heads · 25 classes'],
    [(P) => `${P.data[20].outline.instances.length} heads · ${classCount(P, 20, 'outline')} classes`, '"20 outline: 106 heads, 28 classes"', 'findings-primitives.md:436', '106 heads · 28 classes'],
    [(P) => `${P.data[24].filled.instances.length} heads · ${classCount(P, 24, 'filled')} classes`, '"24 filled: 85 heads, 25 classes"', 'findings-primitives.md:437', '85 heads · 25 classes'],
    [(P) => headClass(P, 24, 'outline', 'arrow-down'), 'leg 5.261, R 0.75, 90°: 24 files, 21 concepts', 'findings-primitives.md:410', 'leg 5.261 · R 0.75 · 90.0°: 24 files, 21 concepts'],
    [(P) => ['refresh', 'rotate-ccw-5', 'rotate-ccw-6'].map((n) => rowV(P, n, 24)).join(' · '), 'the rotate family\'s legs at 24: 4.250 · 4.257 · 3.507', 'findings-primitives.md:455-459', '4.25 · 4.257 · 3.507'],
    [(P) => `${P.data[16].outline.instances.length} heads · ${classCount(P, 16, 'outline')} classes`, '—', '—', null, 'the card gives no count at 16; this page\'s reading'],
  ],
  badge: [[() => '0 instances', '"The set contains no corner-badge icon at all"', 'findings-primitives.md:474', '0 instances']],
  check: [
    [(P) => MASTER_LIST.map((m) => rowV(P, 'checkbox', m)).join(' · '), 'checkbox vs check-circle: IDENTICAL · IDENTICAL · off 0.106 u', 'findings-primitives.md:599', '0 · 0 · 0.106'],
    [(P) => MASTER_LIST.map((m) => rowV(P, 'checkbox-2', m)).join(' · '), 'checkbox-2 vs check-circle-3: IDENTICAL · IDENTICAL · off 0.172 u', 'findings-primitives.md:600', '0 · 0 · 0.172'],
    [(P) => MASTER_LIST.map((m) => rowV(P, 'checkbox-3', m)).join(' · '), 'checkbox-3 vs check-circle-4: IDENTICAL · IDENTICAL · off 0.258 u', 'findings-primitives.md:601', '0 · 0 · 0.258'],
    [(P) => MASTER_LIST.map((m) => rowV(P, 'checkbox-4', m)).join(' · '), 'checkbox-4 vs check-circle-small: IDENTICAL · IDENTICAL · IDENTICAL', 'findings-primitives.md:602', '0 · 0 · 0'],
    [(P) => MASTER_LIST.map((m) => rowV(P, 'checkbox', m, 'filled')).join(' · '), '—', '—', null, 'checkbox against check-circle, filled: no card measured the cut; this page\'s reading'],
  ],
  door: partAgainst([['building', '0.5 · 0.167 · 0'], ['building-2', '0 · 0.167 · 0'], ['store', '0 · 0 · 0.167'], ['store-2', '0 · 0 · 0.167'], ['home-2', '0 · 0 · 0']], 'findings-grammar.md:425'),
  star: partAgainst([['sparkle-2', '0 · 0.278 · 0'], ['wand', '0 · 0 · 0.278']], 'findings-grammar.md:426'),
  knob: partAgainst([['sliders-3', '0 · 0.333 · 0'], ['sliders-5', '0 · 0 · 0']], 'findings-grammar.md:428'),
  hook: partAgainst([['cart-3', '0 · 0.208 · 0']], 'findings-grammar.md:429'),
  cradle: partAgainst([['microphone-2', '0.25 · 0.125 · 0'], ['microphone-5', null, '"microphone-5\'s joins at 20 and 16"', 'no figure at 24; 1.008 is this page\'s reading']], 'findings-grammar.md:430'),
  shackle: partAgainst([['lock-5', '0.625 · 0 · 0.125']], 'findings-grammar.md:431'),
  diagonal: [
    ...partAgainst([['refresh-3', null, '"refresh-3 = arrow-up-right" at 24 · "—" at 20 · "refresh-3\'s is its own" at 16', '0.395 and 0.593 are this page\'s readings']], 'findings-grammar.md:432'),
    ...partAgainst([['external-link', null, 'diagonal head 6 × 6 shared by arrow-up-right, external-link, external-link-2 (a size at 24)', '20 and 16 are this page\'s readings'], ['external-link-2', null, 'as external-link', 'as external-link']], 'findings-primitives.md:780'),
  ],
  landscape: [
    [(P) => MASTER_LIST.map((m) => P.data[m].outline.instances.filter((i) => i.v === 0).length).join(' · '), 'one drawing in 8 concepts · 9 · 11', 'findings-grammar.md:433', '8 · 9 · 11'],
    ...partAgainst([['presentation-2', '0.556 · 0 · 0'], ['keyboard', null, '"keyboard, keyboard-2 0.556 off" at 20; they join at 16', 'no figure at 24; 2.222 is this page\'s reading'], ['keyboard-2', null, 'as keyboard', 'as keyboard'], ['briefcase', '0.556 · 0.556 · 0.417']], 'findings-grammar.md:433'),
  ],
  layout: [
    [(P) => MASTER_LIST.map((m) => STYLES.map((st) => P.data[m][st].instances.filter((i) => !i.self && i.v === 0).length).reduce((x, y) => x + y, 0)).join(' + '), '"72 of 72 comparisons … are the same drawing — largest distance 0.000"', 'findings-families.md:233-236', '24 + 24 + 24', 'per master here: 4 numbers × 2 styles × 3 regions'],
    [(P) => MASTER_LIST.map((m) => P.data[m].outline.classes.map((c) => c.n).join('+')).join(' · '), '"layout-footer = -2 = -3", outline only (and the same for header, sidebar, sidebar-right)', 'findings-primitives.md:627-630', '12+4 · 12+4 · 12+4', '-4, the detached band, is its own outline'],
    [(P) => MASTER_LIST.map((m) => P.data[m].filled.classes.map((c) => c.n).join('+')).join(' · '), '"filled: divider cut / solid footer / solid page"', 'findings-primitives.md:627', '4+4+4+4 · 4+4+4+4 · 4+4+4+4', 'and -4\'s band: four fills, each the same in all four regions'],
  ],
  twins: [
    [(P) => ['ban-2', 'building-4', 'compass-3', 'language-2', 'language-3'].map((n) => MASTER_LIST.map((m) => rowV(P, n, m)).join('/')).join(' · '), 'outline identical at all three masters: ban = ban-2, building-3 = building-4, compass = compass-3, globe = language-2, globe-2 = language-3', 'findings-primitives.md:620-630', '0/0/0 · 0/0/0 · 0/0/0 · 0/0/0 · 0/0/0'],
    [(P) => ['language-2', 'language-3'].map((n) => MASTER_LIST.map((m) => rowV(P, n, m, 'filled')).join('/')).join(' · '), 'globe = language-2 and globe-2 = language-3 in outline and filled', 'findings-primitives.md:622-623', '0/0/0 · 0/0/0'],
  ],
};
function partAgainst(pairs, cite) {
  return pairs.map(([name, expect, said, note]) => [(P) => MASTER_LIST.map((m) => { const v = rowV(P, name, m); return v == null ? '—' : v; }).join(' · '),
    `${name}: ${expect ?? said}`, cite, expect, note]);
}
/** Where the concepts that carry a ⌀`d` dot at 24 outline land at master `m`, counted by diameter. */
function groupAt(P, d, m) {
  const rows = new Set(P.data[24].outline.instances.filter((i) => i.v === d).map((i) => i.r));
  const by = new Map();
  for (const r of rows) {
    const ds = [...new Set(P.data[m].outline.instances.filter((i) => i.r === r).map((i) => i.v))].join('/');
    if (!by.has(ds)) by.set(ds, []);
    by.get(ds).push(P.rows[r].name);
  }
  return [...by].map(([ds, names]) => `${names.length} at ⌀${ds}${names.length <= 3 ? ` (${names.join(', ')})` : ''}`).join(', ');
}
function rowDots(P, name, m) {
  const ri = P.rows.findIndex((r) => r.name === name);
  const ds = [...new Set(P.data[m].outline.instances.filter((i) => i.r === ri).map((i) => i.v))];
  return ds.length ? `⌀${ds.join('/')}` : '—';
}
function turnOf(P, name, m, style) {
  const it = P.data[m][style].instances.find((i) => P.rows[i.r].name === name);
  return it ? it.bend.turn.toFixed(2) : '—';
}
function headClass(P, m, style, name) {
  const it = P.data[m][style].instances.find((i) => P.rows[i.r].name === name);
  if (!it) return '—';
  const members = P.data[m][style].instances.filter((i) => i.c === it.c);
  return `${P.data[m][style].classes[it.c].key}: ${members.length} files, ${new Set(members.map((i) => i.r)).size} concepts`;
}

// ── the JSON the page reads ─────────────────────────────────────────────────────────────────

const roundM = (M) => M.map((v) => Math.round(v * 1e6) / 1e6 + 0);
function serialise(P) {
  const { spec, rows, data } = P;
  const out = {
    id: spec.id, group: spec.group, title: spec.title, kind: spec.kind, question: spec.question,
    source: spec.source, anchor: spec.anchor, ref: spec.ref ?? null,
    rows: rows.map((r) => ({ name: r.name, partner: r.partner && r.partner !== r.name ? r.partner : null, ...(r.region ? { region: r.region } : {}), ...(r.group !== undefined ? { group: r.group } : {}) })),
    masters: {},
    against: (AGAINST[spec.id] ?? []).map(([read, doc, cite, expect, note]) => { const measured = String(read(P)); return { measured, card: doc, cite, agrees: expect == null ? null : measured === expect, ...(note ? { note } : {}) }; }),
  };
  for (const m of MASTER_LIST) {
    out.masters[m] = { frame: data[m].frame };
    for (const style of STYLES) {
      const { instances, classes } = data[m][style];
      out.masters[m][style] = {
        classes,
        instances: instances.map((it) => ({
          r: it.r, d: it.d, k: it.k, w: it.w, m: roundM(it.m), a: it.a, c: it.c,
          v: it.v, ...(it.why ? { why: it.why } : {}), ...(it.self ? { self: true } : {}),
          ...(it.bend ? { leg: r3(it.bend.leg), R: r3(it.bend.R), turn: r3(it.bend.turn) } : {}),
          // A stroked dot whose weight is wider than its diameter: the browser's stroker leaves a pinhole at
          // the centre when such a circle is drawn large. What ships is the outlined fill, a solid disc, so
          // the overlay draws that disc [cx, cy, r of ink] in the instance's own coordinates.
          ...(it.k === 's' && it.parts.length === 1 && it.parts[0].circle && it.w >= 2 * it.parts[0].circle.r
            ? { disc: [it.parts[0].circle.cx, it.parts[0].circle.cy, it.parts[0].circle.r + it.w / 2].map((n) => Math.round(n * 1000) / 1000) } : {}),
        })),
      };
    }
  }
  return out;
}

export function build(pinDir, { commit = PIN } = {}) {
  const set = readSet(pinDir);
  const panels = PANELS.map((spec) => buildPanel(spec, set));
  return {
    what: 'Primitive sheets — card 4.2 of plans/set-and-rules-audit.md. Read by lab/audit-primitives.html.',
    pin: commit,
    iconsDigest: digestOf(pinDir),
    generator: 'P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P; node tools/audit/primitives-data.mjs $P',
    units: 'drawing units of the master; px = units × 16 / master (a 16 px render)',
    dotShare: DOT_SHARE,
    panels: panels.map(serialise),
  };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────

function cli(argv) {
  const pin = argv.find((a) => !a.startsWith('--'));
  if (!pin) { console.error('usage: node tools/audit/primitives-data.mjs <pin-dir> [--print] [--out <file>] [--commit <sha>]'); process.exitCode = 2; return; }
  const flag = (n) => { const i = argv.indexOf(`--${n}`); return i < 0 ? null : argv[i + 1]; };
  const data = build(resolve(pin), { commit: flag('commit') ?? PIN });
  if (argv.includes('--print')) {
    for (const p of data.panels) {
      console.log(`\n${p.title}  (${p.id}; ${p.rows.length} rows)  ${p.source}`);
      for (const m of MASTER_LIST) {
        console.log(`  ${m}: ${STYLES.map((s) => `${s} ${p.masters[m][s].instances.length} inst / ${p.masters[m][s].classes.length} classes`).join(' · ')}`);
      }
      for (const a of p.against) console.log(`  ${a.agrees == null ? '·' : a.agrees ? '=' : '≠'} measured ${a.measured}\n      card     ${a.card}  [${a.cite}]`);
    }
    return;
  }
  const out = resolve(flag('out') ?? OUT);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(data)}\n`);
  console.log(`wrote ${out} — ${data.panels.length} panels, icons digest ${data.iconsDigest.slice(0, 12)}`);
}

let entry = false;
try { entry = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { entry = false; }
if (entry) cli(process.argv.slice(2));
