// Shape congruence — is this the same drawing, somewhere else?
//
// Audit-only (plans/set-and-rules-audit.md card 0.2). Never imported by lint,
// build or queue. Importing this file does nothing; it only exports functions.
//
// WHY IT EXISTS. The only shape comparison in the toolchain is
// `normPath` (tools/lint.mjs:151), whitespace-normalised string equality. It
// answers "is this the same text", which is not the question. The circle in
// `plus-circle` and the circle in `x-circle` may be the same circle in a
// different place, drawn from a different start point, in the other direction,
// and `normPath` calls all three "different". So the set's biggest open
// question — have the shared shapes drifted? (CLAUDE.md open item 5, axes F3/F4)
// — has had no instrument at all.
//
// WHAT IT ANSWERS
//   canonical(d)                    one shape, one spelling
//   congruentUpToTranslation(a, b)  is B just A, moved?
//   congruentUpToScale(a, b)        is B just A, moved and resized? (24 vs 16)
//   classify(items)                 congruence classes + the NEAR MISSES
//   scaleTrivial(d)                 warns when a scale match means nothing
//
// The near misses are the point. An exact match is agreement; a pair that is
// 0.03 apart is drift, and drift is the finding.
//
// WHAT "SAME SHAPE" MEANS HERE, exactly. Two paths are the same shape when
// their CENTRELINES are the same curve. The comparison is deliberately blind to
//   · absolute vs relative commands (`H16.5` and `h16.5` are one line)
//   · which vertex a ring starts at
//   · which way round a ring is traversed
//   · the order the subpaths are written in
//   · an open run written backwards
//   · runs of collinear line segments vs one line
//   · runs of arcs on one circle going one way vs one arc — so a full circle
//     is ONE circle however it was cut and whichever way it was walked. The
//     set needs this: of its 1,184 full circles it cuts 1,166 left/right and
//     18 top/bottom, and walks 1,123 one way and 61 the other (at 5933041)
//   · numeric noise, to a configurable precision
//   · an arc's rotation when its radii are equal (a circle has no rotation)
//   · a zero-length segment, and a `Z` whose closing line has no length
// and deliberately sensitive to
//   · position (that is what `congruentUpToTranslation` is for)
//   · size (that is what `congruentUpToScale` is for)
//   · MIRRORING and rotation. A mirrored copy is NOT congruent here, and it
//     must not be: in this set `chevron-left` is `chevron-right` flipped and
//     they are separate drawings with their own optical shifts (C14). A caller
//     who wants mirror classes flips one `d` itself and asks again.
//   · how a curve is cut up when the pieces are NOT on one circle. Two arcs
//     on circles 0.01 apart stay two arcs and stay a near miss — which is the
//     finding. Only exact co-circularity merges (CO = 1e-7).
//   · a rotated ellipse's subdivision: left alone rather than guessed at.
//   · whether a ring is closed with `Z` (relax with `closure: false`)
//
// It refuses rather than guesses. Any construct it cannot resolve throws
// `UnsupportedPathError`; `classify` catches those per item and lists them.
// Nothing here ever returns a wrong answer quietly.

import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePath, bbox } from '../geometry.mjs';

// ── defaults ───────────────────────────────────────────────────────────────
// TOL 0.01 is the house tolerance for "the same place": lint already compares
// ink boxes at 2 dp with no slack (C10/C12, CLAUDE.md Settled), and the drawing
// grid is 0.25 at 24/20 and 0.125 at 16, so 0.01 is far below anything a
// drawing decision could mean and far above float noise.
// NEAR 0.5 is the looser band a near miss must fall inside. Half a unit at 24
// is a third of a stroke — visible if you look, invisible if you do not. That
// is exactly the drift this instrument is for.
export const TOL = 0.01;
export const NEAR = 0.5;
// 3 dp is the finest the set is allowed to carry (eighth grid at 16,
// tools/masters.mjs:decimalsFor), so canonical rounding never discards a
// decision a drawing was allowed to make.
export const PRECISION = 3;

const EPS = 1e-9;

export class UnsupportedPathError extends Error {
  constructor(reason, d) {
    super(`${reason}  in: ${String(d).slice(0, 120)}`);
    this.name = 'UnsupportedPathError';
    this.reason = reason;
    this.d = d;
  }
}

const round = (n, p) => {
  const f = 10 ** p;
  // The nudge is float insurance only: 0.0049999999999 should round like 0.005.
  const v = Math.round(n * f + (n >= 0 ? 1e-9 : -1e-9)) / f;
  return Object.is(v, -0) ? 0 : v;
};
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const mean = (pts) => {
  let x = 0, y = 0;
  for (const p of pts) { x += p[0]; y += p[1]; }
  return [x / pts.length, y / pts.length];
};

// ── 1. normalise ───────────────────────────────────────────────────────────
// One `d` string → absolute subpaths of plain segments. Everything the SVG
// grammar lets you say two ways is said one way here.

const CMDS = new Set('MmLlHhVvCcSsQqTtAaZz'.split(''));
const STEP = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

const reflect = (p, about) => [2 * about[0] - p[0], 2 * about[1] - p[1]];

/** A straight segment, or nothing if it has no length. */
const lineSeg = (from, to) => (dist(from, to) <= EPS ? null : { cmd: 'L', to });

/** An arc, normalised the way a renderer sees it (SVG 1.1 appendix F.6). */
function arcSeg(from, rx, ry, rot, fa, fs, to) {
  // Coincident endpoints: the spec says the segment is omitted entirely.
  if (dist(from, to) <= EPS) return null;
  rx = Math.abs(rx); ry = Math.abs(ry);
  // Zero radius: the spec says it draws as a straight line.
  if (rx <= EPS || ry <= EPS) return { cmd: 'L', to };
  fa = fa ? 1 : 0; fs = fs ? 1 : 0;
  // F.6.6: radii too small to span the chord are grown until they fit. Two
  // files that differ only in an undersized radius render the same, so they
  // must canonicalise the same.
  const phi = (rot * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (from[0] - to[0]) / 2, dy = (from[1] - to[1]) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  // A circle has no rotation, and an ellipse turned 180° is the same ellipse.
  const circle = Math.abs(rx - ry) <= 1e-7;
  if (circle) ry = rx;
  const r = circle ? 0 : ((rot % 180) + 180) % 180;
  // At exactly half a turn the large-arc flag picks between two identical
  // arcs, so a semicircle has two spellings. Fix one. (Circular arcs only:
  // the chord is the diameter. An ellipse is left as written.)
  if (circle && Math.abs(dist(from, to) - 2 * rx) <= 1e-7) fa = 1;
  return { cmd: 'A', r: [rx, ry], rot: r, fa, fs, to };
}

// ── where an arc's circle actually is ──────────────────────────────────────
// SVG writes an arc as "end here, with these radii", not "centre here". Two
// arcs are on the same circle only if their computed centres agree, so the
// endpoint→centre conversion (SVG 1.1 F.6.5) has to be done. geometry.mjs does
// it inside its sampler and does not expose the centre, so it is repeated here
// — the centre only, not the sampling.

const CO = 1e-7;   // two arcs are on ONE circle only this close. Tight on
                   // purpose: looser, and the tool would weld a near-miss into
                   // a match and swallow the very finding it exists to report.

function arcCentre(from, seg) {
  let [rx, ry] = seg.r;
  const to = seg.to;
  const phi = (seg.rot * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (from[0] - to[0]) / 2, dy = (from[1] - to[1]) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (seg.fa !== seg.fs ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  return [cos * cxp - sin * cyp + (from[0] + to[0]) / 2, sin * cxp + cos * cyp + (from[1] + to[1]) / 2];
}

/** Signed sweep of a circular arc, in radians. Sweep flag 1 is the increasing
 *  direction; in SVG's y-down frame that is clockwise on screen. */
function arcSweep(from, seg, c) {
  const a1 = Math.atan2(from[1] - c[1], from[0] - c[0]);
  const a2 = Math.atan2(seg.to[1] - c[1], seg.to[0] - c[0]);
  let dt = a2 - a1;
  if (seg.fs) { while (dt <= 0) dt += 2 * Math.PI; } else { while (dt >= 0) dt -= 2 * Math.PI; }
  return dt;
}

/** Is this whole ring one circle? Every segment an arc, every radius the same,
 *  every sweep the same way round, every centre the same point — and it closes,
 *  so it must come to a full turn. */
function fullCircle(sub) {
  if (!sub.ring || !sub.segs.length) return null;
  const [f] = sub.segs;
  if (f.cmd !== 'A') return null;
  const r = f.r[0];
  if (!sub.segs.every((s) => s.cmd === 'A' && Math.abs(s.r[0] - s.r[1]) <= CO
      && Math.abs(s.r[0] - r) <= CO && s.fs === f.fs)) return null;
  let from = sub.start, c0 = null;
  for (const s of sub.segs) {
    const c = arcCentre(from, s);
    if (!c0) c0 = c; else if (dist(c, c0) > CO) return null;
    from = s.to;
  }
  return { c: c0, r };
}

// ── collapse what was written in more pieces than it needs ─────────────────
// A difference in the SOURCE that is not a difference in the DRAWING. The set
// needs this: of its 1,184 full circles it cuts 1,166 left/right and 18
// top/bottom (measured 2026-10-04 at 5933041). Without it the same dot would
// read as two different dots depending on where the pen started.

const mergeLines = (from, a, b) => {
  const ux = a.to[0] - from[0], uy = a.to[1] - from[1];
  const vx = b.to[0] - a.to[0], vy = b.to[1] - a.to[1];
  if (Math.abs(ux * vy - uy * vx) > CO) return null;   // not the same line
  if (ux * vx + uy * vy <= 0) return null;             // doubles back: a spike, not a run
  return { cmd: 'L', to: b.to };
};

/** Two arcs on one circle, going one way, become one arc. Circular arcs only —
 *  a rotated ellipse is left alone rather than guessed at. */
function mergeArcs(from, a, b) {
  if (a.fs !== b.fs) return null;
  if (Math.abs(a.r[0] - a.r[1]) > CO || Math.abs(b.r[0] - b.r[1]) > CO) return null;
  if (Math.abs(a.r[0] - b.r[0]) > CO) return null;
  const ca = arcCentre(from, a), cb = arcCentre(a.to, b);
  if (dist(ca, cb) > CO) return null;
  const dt = arcSweep(from, a, ca) + arcSweep(a.to, b, cb);
  if (Math.abs(dt) >= 2 * Math.PI - CO) return null;   // a whole turn — fullCircle's job
  // Half a turn takes fa = 1, matching what `arcSeg` does to a hand-written
  // semicircle, so merging and not merging agree.
  return { cmd: 'A', r: [a.r[0], a.r[0]], rot: 0, fa: Math.abs(dt) > Math.PI - CO ? 1 : 0, fs: a.fs, to: b.to };
}

const mergePair = (from, a, b) =>
  (a.cmd === 'L' && b.cmd === 'L') ? mergeLines(from, a, b)
    : (a.cmd === 'A' && b.cmd === 'A') ? mergeArcs(from, a, b) : null;

function mergeRuns(sub) {
  let start = sub.start, segs = sub.segs.slice();
  for (let guard = 0; guard < 64 && segs.length > 1; guard++) {
    let changed = false;
    const out = [];
    for (const s of segs) {
      const prev = out[out.length - 1];
      const prevFrom = out.length > 1 ? out[out.length - 2].to : start;
      const merged = prev ? mergePair(prevFrom, prev, s) : null;
      if (merged) { out[out.length - 1] = merged; changed = true; } else out.push(s);
    }
    segs = out;
    // A ring's run can straddle its start vertex. Merging there moves the
    // start one vertex on, which costs nothing: the start is canonicalised.
    if (!changed && sub.ring && segs.length > 2) {
      const n = segs.length;
      const merged = mergePair(segs[n - 2].to, segs[n - 1], segs[0]);
      if (merged) { start = segs[0].to; segs = [...segs.slice(1, n - 1), merged]; changed = true; }
    }
    if (!changed) break;
  }
  return { ...sub, start, segs };
}

/** One spelling for one shape: runs collapsed, and a full circle always cut
 *  top/bottom sweeping one way, wherever the file happened to cut it. */
function simplify(sub) {
  const s = mergeRuns(sub);
  const circ = fullCircle(s);
  if (!circ) return s;
  const [cx, cy] = circ.c, r = circ.r;
  return {
    closed: s.closed, ring: true, start: [cx, cy - r],
    segs: [
      { cmd: 'A', r: [r, r], rot: 0, fa: 1, fs: 1, to: [cx, cy + r] },
      { cmd: 'A', r: [r, r], rot: 0, fa: 1, fs: 1, to: [cx, cy - r] },
    ],
  };
}

/** `d` → `{ subpaths: [{ closed, ring, start, segs }] }`, all absolute. */
export function normalise(d) {
  if (typeof d !== 'string' || !d.trim()) throw new UnsupportedPathError('empty path', String(d));
  // Guard the grammar before trusting the tokenizer: `parsePath` quietly drops
  // a letter it does not know, which would silently change the shape.
  const letters = d.replace(/(\d|\.)[eE][+-]?\d/g, '$1 ').match(/[A-Za-z]/g) || [];
  for (const ch of letters) {
    if (!CMDS.has(ch)) throw new UnsupportedPathError(`unknown path command "${ch}"`, d);
  }
  const toks = parsePath(d);
  if (!toks.length) throw new UnsupportedPathError('no path commands', d);
  if (toks[0].cmd.toUpperCase() !== 'M') {
    throw new UnsupportedPathError(`path starts with "${toks[0].cmd}", not M`, d);
  }
  for (const { cmd, args } of toks) {
    const step = STEP[cmd.toUpperCase()];
    if (step === 0) continue;
    if (!args.length || args.length % step !== 0) {
      throw new UnsupportedPathError(`"${cmd}" has ${args.length} argument(s), not a multiple of ${step}`, d);
    }
  }

  const subs = [];
  let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  let prevCubic = null, prevQuad = null;
  const openSub = (x, y) => { cur = { closed: false, ring: false, start: [x, y], segs: [] }; subs.push(cur); };
  const add = (seg) => { if (seg) cur.segs.push(seg); };

  for (const { cmd, args } of toks) {
    const up = cmd.toUpperCase(), rel = cmd !== up, step = STEP[up];
    if (up === 'Z') {
      if (!cur) throw new UnsupportedPathError('Z with no open subpath', d);
      add(lineSeg([cx, cy], [sx, sy]));
      cur.closed = true;
      cx = sx; cy = sy;
      cur = null;                       // a drawing command after Z opens a new subpath here
      prevCubic = prevQuad = null;
      continue;
    }
    if (!cur && up !== 'M') openSub(cx, cy);

    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      const abs = (i) => (rel ? [cx + a[i], cy + a[i + 1]] : [a[i], a[i + 1]]);
      if (up === 'M') {
        const [x, y] = abs(0);
        // Only the first pair is a move; the rest of an `M`/`m` run are lines.
        if (k === 0) { openSub(x, y); sx = x; sy = y; } else add(lineSeg([cx, cy], [x, y]));
        cx = x; cy = y; prevCubic = prevQuad = null;
      } else if (up === 'L') {
        const [x, y] = abs(0); add(lineSeg([cx, cy], [x, y])); cx = x; cy = y; prevCubic = prevQuad = null;
      } else if (up === 'H') {
        const x = rel ? cx + a[0] : a[0]; add(lineSeg([cx, cy], [x, cy])); cx = x; prevCubic = prevQuad = null;
      } else if (up === 'V') {
        const y = rel ? cy + a[0] : a[0]; add(lineSeg([cx, cy], [cx, y])); cy = y; prevCubic = prevQuad = null;
      } else if (up === 'C' || up === 'S') {
        // S is C with its first control point mirrored from the previous curve.
        const c1 = up === 'C' ? abs(0) : (prevCubic ? reflect(prevCubic, [cx, cy]) : [cx, cy]);
        const c2 = up === 'C' ? abs(2) : abs(0);
        const to = up === 'C' ? abs(4) : abs(2);
        const flat = dist(to, [cx, cy]) <= EPS && dist(c1, [cx, cy]) <= EPS && dist(c2, [cx, cy]) <= EPS;
        if (!flat) add({ cmd: 'C', c: [c1, c2], to });
        cx = to[0]; cy = to[1]; prevCubic = c2; prevQuad = null;
      } else if (up === 'Q' || up === 'T') {
        const c1 = up === 'Q' ? abs(0) : (prevQuad ? reflect(prevQuad, [cx, cy]) : [cx, cy]);
        const to = up === 'Q' ? abs(2) : abs(0);
        const flat = dist(to, [cx, cy]) <= EPS && dist(c1, [cx, cy]) <= EPS;
        if (!flat) add({ cmd: 'Q', c: [c1], to });
        cx = to[0]; cy = to[1]; prevQuad = c1; prevCubic = null;
      } else if (up === 'A') {
        const [rx, ry, rot, fa, fs] = a;
        const to = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]];
        add(arcSeg([cx, cy], rx, ry, rot, fa, fs, to));
        cx = to[0]; cy = to[1]; prevCubic = prevQuad = null;
      }
    }
  }

  const out = subs.map((s) => {
    const last = s.segs.length ? s.segs[s.segs.length - 1].to : s.start;
    // `ring` is geometric closure — the pen came back. `closed` is whether the
    // file said `Z`. They differ when a ring is written with an explicit final
    // line instead of a closepath.
    return simplify({ ...s, ring: s.segs.length > 0 && dist(last, s.start) <= EPS });
  });
  return { subpaths: out };
}

// ── 2. the alignment set ───────────────────────────────────────────────────
// Every way one subpath could have been written. A ring of n segments has 2n
// spellings (n start vertices × 2 directions); an open run has 2.

const vertsOf = (sub) => [sub.start, ...sub.segs.map((s) => s.to)];

function reverseSub(sub) {
  const v = vertsOf(sub), n = sub.segs.length, segs = [];
  for (let i = n - 1; i >= 0; i--) {
    const s = sub.segs[i], to = v[i];
    if (s.cmd === 'L') segs.push({ cmd: 'L', to });
    // An arc run backwards sweeps the other way; large-arc and the radii hold.
    else if (s.cmd === 'A') segs.push({ cmd: 'A', r: s.r, rot: s.rot, fa: s.fa, fs: s.fs ? 0 : 1, to });
    else if (s.cmd === 'C') segs.push({ cmd: 'C', c: [s.c[1], s.c[0]], to });
    else segs.push({ cmd: 'Q', c: [s.c[0]], to });
  }
  return { closed: sub.closed, ring: sub.ring, start: v[n], segs };
}

function rotateSub(sub, k) {
  if (!sub.ring || k === 0) return sub;
  const v = vertsOf(sub);
  return { closed: sub.closed, ring: true, start: v[k], segs: [...sub.segs.slice(k), ...sub.segs.slice(0, k)] };
}

/** Every spelling of one subpath. */
export function alignmentsOf(sub) {
  const rev = reverseSub(sub);
  if (!sub.ring) return [sub, rev];
  const n = Math.max(1, sub.segs.length), out = [];
  for (let k = 0; k < n; k++) { out.push(rotateSub(sub, k)); out.push(rotateSub(rev, k)); }
  return out;
}

// ── 3. the comparable signature ────────────────────────────────────────────
// A spelling becomes three lists:
//   tags  — structure: what kind of segment, and the bits of an arc that no
//           move or resize can change (its rotation and its two flags)
//   pts   — every point, in order. Moves AND resizes.
//   rads  — every arc radius, in order. Resizes only, never moves.
// Two spellings can only correspond if their tags match exactly.

function sigOf(sub, closure = true) {
  const pts = [sub.start.slice()], rads = [], tags = [];
  for (const s of sub.segs) {
    if (s.cmd === 'L') tags.push('L');
    else if (s.cmd === 'A') { tags.push(`A${s.rot}:${s.fa}${s.fs}`); rads.push(s.r[0], s.r[1]); }
    else if (s.cmd === 'C') { tags.push('C'); pts.push(s.c[0].slice(), s.c[1].slice()); }
    else { tags.push('Q'); pts.push(s.c[0].slice()); }
    pts.push(s.to.slice());
  }
  const tagKey = (closure && sub.closed ? 'Z ' : '') + tags.join(' ');
  return { tags, tagKey, pts, rads, ring: sub.ring, closed: sub.closed, sub };
}

/** Coordinates relative to the subpath's own start, then the radii.
 *  Relative, so this vector does not change when the shape moves — and
 *  comparing it NUMERICALLY (never as text) also survives a resize, because
 *  multiplying every entry by a positive number cannot reorder two vectors. */
function numsOf(sig) {
  const [ox, oy] = sig.pts[0], out = [];
  for (let i = 1; i < sig.pts.length; i++) out.push(sig.pts[i][0] - ox, sig.pts[i][1] - oy);
  out.push(...sig.rads);
  return out;
}

const cmpNums = (a, b) => {
  for (let i = 0; i < a.length && i < b.length; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return a.length - b.length;
};
const cmpStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** The one spelling of a subpath we call canonical: smallest by structure,
 *  then smallest by relative coordinates. */
function canonSub(sub, precision, closure) {
  let best = null;
  for (const v of alignmentsOf(sub)) {
    const sig = sigOf(v, closure);
    const nums = numsOf(sig).map((n) => round(n, precision));
    const cand = { sig, nums, tagKey: sig.tagKey };
    if (!best || (cmpStr(cand.tagKey, best.tagKey) || cmpNums(cand.nums, best.nums)) < 0) best = cand;
  }
  return best;
}

const fmt = (n, p) => String(round(n, p));

function emitSub(sub, p) {
  let out = `M${fmt(sub.start[0], p)} ${fmt(sub.start[1], p)}`;
  for (const s of sub.segs) {
    if (s.cmd === 'L') out += `L${fmt(s.to[0], p)} ${fmt(s.to[1], p)}`;
    else if (s.cmd === 'A') out += `A${fmt(s.r[0], p)} ${fmt(s.r[1], p)} ${fmt(s.rot, p)} ${s.fa} ${s.fs} ${fmt(s.to[0], p)} ${fmt(s.to[1], p)}`;
    else if (s.cmd === 'C') out += `C${fmt(s.c[0][0], p)} ${fmt(s.c[0][1], p)} ${fmt(s.c[1][0], p)} ${fmt(s.c[1][1], p)} ${fmt(s.to[0], p)} ${fmt(s.to[1], p)}`;
    else out += `Q${fmt(s.c[0][0], p)} ${fmt(s.c[0][1], p)} ${fmt(s.to[0], p)} ${fmt(s.to[1], p)}`;
  }
  return out + (sub.closed ? 'Z' : '');
}

/**
 * One path's geometry, in one spelling.
 *
 * @returns {{ key, shape, start, d, precision, subpaths }}
 *   key    — the full canonical form, POSITION INCLUDED. Equal keys mean the
 *            same shape in the same place, to `precision`.
 *   shape  — the same thing with the position removed: translation-invariant.
 *            Equal shapes mean the same drawing, somewhere. This is what
 *            `classify` buckets on.
 *   start  — where the canonical first subpath begins.
 *   d      — a readable absolute `d` string in the canonical spelling.
 * @throws {UnsupportedPathError}
 */
export function canonical(d, { precision = PRECISION, closure = true } = {}) {
  const { subpaths } = normalise(d);
  const cs = subpaths.map((s) => canonSub(s, precision, closure));
  // Subpath order must not matter, so fix one: structure, then relative
  // coordinates, then position. Comparing the position numerically (not as
  // text) keeps the order the same when the whole path moves.
  cs.sort((a, b) => cmpStr(a.tagKey, b.tagKey) || cmpNums(a.nums, b.nums)
    || a.sig.pts[0][0] - b.sig.pts[0][0] || a.sig.pts[0][1] - b.sig.pts[0][1]);
  const o = cs[0].sig.pts[0];
  const shape = cs.map((c, i) => {
    const [x, y] = c.sig.pts[0];
    // Where each later subpath sits relative to the first one — part of the
    // shape, but not of its position.
    const at = i === 0 ? '' : `@${round(x - o[0], precision)},${round(y - o[1], precision)}`;
    return `${c.tagKey}${at}[${c.nums.join(' ')}]`;
  }).join(' | ');
  const start = [round(o[0], precision), round(o[1], precision)];
  return {
    key: `${start[0]},${start[1]} ${shape}`,
    shape,
    start,
    d: cs.map((c) => emitSub(c.sig.sub, precision)).join(''),
    precision,
    subpaths: cs.map((c) => ({ tagKey: c.tagKey, closed: c.sig.closed, ring: c.sig.ring, start: c.sig.pts[0].map((n) => round(n, precision)), d: emitSub(c.sig.sub, precision) })),
  };
}

/** Each subpath of `d` as its own absolute `d` string — the unit a shared-part
 *  census actually wants. Unlike a string split on `M`, this resolves relative
 *  commands that carry over from the previous subpath. */
export function subpathsOfPath(d, { precision = PRECISION } = {}) {
  return normalise(d).subpaths.map((s) => emitSub(s, precision));
}

// ── 4. preparing a path once ───────────────────────────────────────────────
// `classify` compares one path against many, so the expensive part — parsing
// and expanding every spelling of every subpath — is done once per path.

/** @returns a reusable prepared path. Pass it anywhere a `d` string is taken. */
export function prepare(d, { precision = PRECISION, closure = true } = {}) {
  const { subpaths } = normalise(d);
  const sigs = subpaths.map((s) => sigOf(s, closure));
  const aligns = subpaths.map((s) => alignmentsOf(s).map((v) => sigOf(v, closure)));
  const box = bbox([d]);
  return {
    __prepared: true, d, subpaths, sigs, aligns,
    canonical: canonical(d, { precision, closure }),
    box, w: box.x1 - box.x0, h: box.y1 - box.y0,
    nPts: sigs.reduce((n, s) => n + s.pts.length, 0),
    nRads: sigs.reduce((n, s) => n + s.rads.length, 0),
    // Structure only: what must match before any measuring is worth doing.
    tagMulti: sigs.map((s) => s.tagKey).sort().join(' / '),
  };
}

const asPrepared = (x, opts) => (x && x.__prepared ? x : prepare(x, opts));

/**
 * Has this shape anything left to vary, once you fix where it is and how big
 * it is? A straight run, a lone circle and a dot have not: every circle is a
 * scaled circle, and every horizontal line is a scaled horizontal line. So in
 * SCALE mode a class of them says "these are all circles", which is nothing,
 * not "these are all the same circle", which would be a finding.
 *
 * Measured on the real set this is not a corner case: at 5933041 the three
 * biggest scale-mode classes over the 24 and 16 outline subpaths hold 463,
 * 380 and 319 members, and all three are this — lines and bare circles.
 *
 * Every point on one line through them, and every radius the same, is the
 * test. Two parallel lines a gap apart are NOT trivial: the gap is a free
 * parameter against their length, and that ratio is exactly the kind of thing
 * worth comparing across masters.
 */
export function scaleTrivial(x, opts = {}) {
  const p = asPrepared(x, opts);
  const rads = p.sigs.flatMap((s) => s.rads);
  if (rads.length && Math.max(...rads) - Math.min(...rads) > 1e-9) return false;
  const pts = p.sigs.flatMap((s) => s.pts);
  if (pts.length <= 2) return true;
  const [o] = pts;
  let dir = null;
  for (const q of pts.slice(1)) {
    const vx = q[0] - o[0], vy = q[1] - o[1];
    if (Math.hypot(vx, vy) <= 1e-9) continue;
    if (!dir) { dir = [vx, vy]; continue; }
    if (Math.abs(dir[0] * vy - dir[1] * vx) > CO) return false;
  }
  return true;
}

// ── 5. fitting one transform ───────────────────────────────────────────────

/** Least-squares fit of `b ≈ s·a + t` with no rotation. `s` is 1 in
 *  translation mode. The offset is the one that minimises the sum of squared
 *  residuals — the standard "best fit" — which for an exact match is the exact
 *  offset. */
function fit(a, b, mode) {
  if (a.pts.length !== b.pts.length || a.rads.length !== b.rads.length) return null;
  const ca = mean(a.pts), cb = mean(b.pts);
  if (mode === 'translation') return { s: 1, t: [cb[0] - ca[0], cb[1] - ca[1]] };
  let num = 0, den = 0;
  for (let i = 0; i < a.pts.length; i++) {
    const ax = a.pts[i][0] - ca[0], ay = a.pts[i][1] - ca[1];
    const bx = b.pts[i][0] - cb[0], by = b.pts[i][1] - cb[1];
    num += ax * bx + ay * by; den += ax * ax + ay * ay;
  }
  let s;
  if (den > 1e-12) s = num / den;
  else if (a.rads.length) {
    // Every point sits on top of every other — a lone dot. The radii are the
    // only thing left that carries the size.
    const sa = a.rads.reduce((x, y) => x + y, 0), sb = b.rads.reduce((x, y) => x + y, 0);
    s = sa > 1e-12 ? sb / sa : 1;
  } else s = 1;
  // A negative factor is a half-turn, not a resize, and zero is a collapse.
  // Rejecting them is what keeps a mirrored or rotated copy out.
  if (!Number.isFinite(s) || s <= 1e-9) return null;
  return { s, t: [cb[0] - s * ca[0], cb[1] - s * ca[1]] };
}

/** Worst residual between two spellings under one transform, in drawing units. */
function devOf(a, b, { s, t }) {
  let point = 0, radius = 0;
  for (let i = 0; i < a.pts.length; i++) {
    const d = Math.hypot(s * a.pts[i][0] + t[0] - b.pts[i][0], s * a.pts[i][1] + t[1] - b.pts[i][1]);
    if (d > point) point = d;
  }
  for (let i = 0; i < a.rads.length; i++) {
    const d = Math.abs(s * a.rads[i] - b.rads[i]);
    if (d > radius) radius = d;
  }
  return { point, radius, max: Math.max(point, radius) };
}

/** Pair up every subpath of A with one of B under a hypothesised transform.
 *  Smallest residual first, so two copies of the same part cannot be swapped. */
function matchAll(sigsA, alignsB, T, bound) {
  const cands = [];
  for (let i = 0; i < sigsA.length; i++) {
    for (let j = 0; j < alignsB.length; j++) {
      for (const vb of alignsB[j]) {
        if (vb.tagKey !== sigsA[i].tagKey) continue;
        if (vb.pts.length !== sigsA[i].pts.length) continue;
        const dev = devOf(sigsA[i], vb, T);
        if (dev.max <= bound) cands.push({ i, j, vb, dev: dev.max });
      }
    }
  }
  cands.sort((x, y) => x.dev - y.dev);
  const usedA = new Set(), usedB = new Set(), pairs = [];
  for (const c of cands) {
    if (usedA.has(c.i) || usedB.has(c.j)) continue;
    usedA.add(c.i); usedB.add(c.j);
    pairs.push([sigsA[c.i], c.vb]);
  }
  return usedA.size === sigsA.length ? pairs : null;
}

/** Re-fit over every matched point at once, then report the worst residual. */
function refit(pairs, mode) {
  const a = { pts: [], rads: [] }, b = { pts: [], rads: [] };
  for (const [pa, pb] of pairs) {
    a.pts.push(...pa.pts); a.rads.push(...pa.rads);
    b.pts.push(...pb.pts); b.rads.push(...pb.rads);
  }
  return fit(a, b, mode);
}

function compare(A, B, mode, opts = {}) {
  const tol = opts.tol ?? TOL;
  const near = opts.near ?? NEAR;
  // Pairing has to be generous enough to let a NEAR miss pair up at all,
  // otherwise the drift findings never appear.
  const bound = opts.pairBound ?? Math.max(near, tol) * 4;
  const base = { mode, tolerance: tol, nearThreshold: near };
  const fail = (reason) => ({
    ...base, same: false, near: false, offset: null, scale: null,
    maxDeviation: Infinity, pointDeviation: Infinity, radiusDeviation: Infinity,
    subpaths: null, reason,
  });

  if (A.subpaths.length !== B.subpaths.length) return fail(`subpath count ${A.subpaths.length} vs ${B.subpaths.length}`);
  if (A.nPts !== B.nPts || A.nRads !== B.nRads) return fail(`point/radius count ${A.nPts}/${A.nRads} vs ${B.nPts}/${B.nRads}`);
  if (A.tagMulti !== B.tagMulti) return fail('different segment structure');

  const A0 = A.sigs[0];
  let best = null;
  // A's first subpath, as written, against every spelling of every subpath of
  // B. That covers every relative alignment of the two drawings.
  for (let j = 0; j < B.subpaths.length; j++) {
    for (const vb of B.aligns[j]) {
      if (vb.tagKey !== A0.tagKey || vb.pts.length !== A0.pts.length) continue;
      const t0 = fit(A0, vb, mode);
      if (!t0) continue;
      const pairs = matchAll(A.sigs, B.aligns, t0, bound);
      if (!pairs) continue;
      const t1 = refit(pairs, mode) ?? t0;
      const dev = devOf(
        { pts: pairs.flatMap(([a]) => a.pts), rads: pairs.flatMap(([a]) => a.rads) },
        { pts: pairs.flatMap(([, b]) => b.pts), rads: pairs.flatMap(([, b]) => b.rads) },
        t1);
      if (!best || dev.max < best.dev.max) best = { t: t1, dev, pairs };
    }
  }
  if (!best) return fail('no correspondence within the pairing bound');

  const { t, dev } = best;
  const same = dev.max <= tol;
  return {
    ...base,
    same,
    // In scale mode, say so when "same" carries no information: both shapes
    // are a line or a bare circle, so ANY two of their kind would match.
    ...(mode === 'scale' ? { trivial: scaleTrivial(A) && scaleTrivial(B) } : {}),
    near: !same && dev.max <= near,
    offset: [round(t.t[0], 6), round(t.t[1], 6)],
    scale: mode === 'scale' ? round(t.s, 9) : 1,
    maxDeviation: round(dev.max, 9),
    pointDeviation: round(dev.point, 9),
    radiusDeviation: round(dev.radius, 9),
    subpaths: best.pairs.length,
    reason: null,
  };
}

/**
 * Is B just A, moved?
 *
 * @param dA,dB  a `d` string, or a `prepare()`d path
 * @param opts   { tol = 0.01, near = 0.5, precision = 3, closure = true }
 * @returns {{ same, offset: [dx,dy], maxDeviation, ... }}
 *   offset          — B ≈ A + offset, the least-squares best fit
 *   maxDeviation    — the worst residual left over, in drawing units: the
 *                     larger of the worst point-to-point distance and the
 *                     worst arc-radius difference. This is how near a near
 *                     miss is. Infinity when the two are not even the same
 *                     structure, with `reason` saying why.
 *                     READ IT AS A RESIDUAL, NOT A DIFFERENCE. The offset is
 *                     the best fit, so it absorbs part of the error: a line
 *                     20.25 long against one 20.27 long is reported as 0.01,
 *                     not 0.02, because the best offset splits the 0.02
 *                     between the two ends. A residual of r means "no point
 *                     is more than r out of place once you have put the two
 *                     drawings on top of each other as well as they will go".
 *   near            — failed `tol` but inside `near`: a drift finding
 * @throws {UnsupportedPathError} on a construct it will not guess at
 */
export function congruentUpToTranslation(dA, dB, opts = {}) {
  return compare(asPrepared(dA, opts), asPrepared(dB, opts), 'translation', opts);
}

/**
 * Is B just A, moved and uniformly resized? This is the cross-master
 * question: a ring at 24 against the same ring at 16.
 *
 * `scale` is the factor from A to B (B ≈ scale·A + offset), fitted by least
 * squares over every corresponding point. Negative and zero factors are
 * rejected, so a half-turned copy is not congruent, and neither is a mirror.
 *
 * @returns {{ same, scale, offset, maxDeviation, ... }}
 * @throws {UnsupportedPathError}
 */
export function congruentUpToScale(dA, dB, opts = {}) {
  return compare(asPrepared(dA, opts), asPrepared(dB, opts), 'scale', opts);
}

/** Would these functions accept this `d`? */
export function supports(d) {
  try { normalise(d); return true; } catch { return false; }
}

// ── 6. classes over many paths ─────────────────────────────────────────────

/**
 * Congruence classes over many paths, plus the near misses.
 *
 * @param items  [{ id, d, ...anything else }] — `id` is carried through
 * @param opts   { mode: 'translation' | 'scale', tol, near, precision,
 *                 closure, maxPairs }
 * @returns {{ groups, nearMisses, unsupported, stats }}
 *   groups      — biggest first. Each: { key, representative, members: [id],
 *                 size, maxDeviation (representative to its worst member),
 *                 scales (scale mode) }
 *   nearMisses  — the findings. Each: { a, b, maxDeviation, offset, scale,
 *                 groupA, groupB } for a pair that failed `tol` but came
 *                 within `near`. Worst-first is not useful here, so they are
 *                 sorted NEAREST first: the tightest near miss is the one
 *                 most likely to be an accident rather than a decision.
 *   unsupported — items the instrument refused, with the reason
 *
 * Groups are single-linkage: congruence within a tolerance is not transitive,
 * so a group's `maxDeviation` is reported to make its looseness visible.
 */
export function classify(items, opts = {}) {
  const mode = opts.mode ?? 'translation';
  const tol = opts.tol ?? TOL;
  const near = opts.near ?? NEAR;
  const precision = opts.precision ?? PRECISION;
  const closure = opts.closure ?? true;
  const maxPairs = opts.maxPairs ?? 20e6;
  const popts = { precision, closure, tol, near, pairBound: opts.pairBound };

  const rows = [], unsupported = [];
  for (const it of items) {
    try { rows.push({ id: it.id, item: it, p: prepare(it.d, popts) }); }
    catch (e) {
      if (!(e instanceof UnsupportedPathError)) throw e;
      unsupported.push({ id: it.id, reason: e.reason });
    }
  }

  // Step 1 — exact buckets on the translation-invariant shape. Cheap, and it
  // collapses the overwhelming majority: everything that matches exactly at
  // `precision` lands together with no measuring at all.
  const buckets = new Map();
  for (const r of rows) {
    const k = r.p.canonical.shape;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(r);
  }
  const reps = [...buckets.values()].map((b) => b.reduce((a, x) => (String(x.id) < String(a.id) ? x : a)));

  // Step 2 — compare bucket representatives. Two jobs at once: merge buckets
  // that rounding split apart (or that only match after a resize), and find
  // the near misses. Only representatives are compared, so this stays small.
  const coarse = new Map();
  for (const r of reps) {
    const k = `${r.p.subpaths.length}|${r.p.nPts}|${r.p.nRads}|${r.p.tagMulti}`;
    if (!coarse.has(k)) coarse.set(k, []);
    coarse.get(k).push(r);
  }
  const parent = new Map(reps.map((r) => [r.id, r.id]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };

  const nearMisses = [];
  let pairsChecked = 0, capped = false;
  for (const group of coarse.values()) {
    // Sorting by size and only looking at neighbours keeps this near-linear.
    // In translation mode the window is exact: if every point moves by at most
    // `near`, neither bbox side can differ by more than 2·near.
    group.sort((a, b) => (mode === 'translation' ? a.p.w - b.p.w : (a.p.w / (a.p.h || 1)) - (b.p.w / (b.p.h || 1))));
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j];
        if (mode === 'translation') {
          if (b.p.w - a.p.w > 2 * near) break;             // sorted: nothing further can match
          if (Math.abs(a.p.h - b.p.h) > 2 * near) continue;
        }
        if (pairsChecked >= maxPairs) { capped = true; break; }
        pairsChecked++;
        const res = mode === 'scale'
          ? congruentUpToScale(a.p, b.p, popts)
          : congruentUpToTranslation(a.p, b.p, popts);
        if (res.same) union(a.id, b.id);
        else if (res.near) {
          nearMisses.push({
            a: a.id, b: b.id, maxDeviation: res.maxDeviation,
            pointDeviation: res.pointDeviation, radiusDeviation: res.radiusDeviation,
            offset: res.offset, scale: res.scale,
          });
        }
      }
      if (capped) break;
    }
    if (capped) break;
  }

  // Step 3 — collect the members, then measure each against its group's
  // representative so a loose group cannot hide behind an exact one.
  const byRoot = new Map();
  for (const r of reps) {
    const root = find(r.id);
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push(...buckets.get(r.p.canonical.shape));
  }
  const repOf = new Map();
  const groups = [];
  for (const [, members] of byRoot) {
    members.sort((a, b) => cmpStr(String(a.id), String(b.id)));
    const rep = members[0];
    let worst = 0;
    const scales = [];
    for (const m of members) {
      if (m === rep) { scales.push(1); continue; }
      const res = mode === 'scale'
        ? congruentUpToScale(rep.p, m.p, popts)
        : congruentUpToTranslation(rep.p, m.p, popts);
      if (Number.isFinite(res.maxDeviation) && res.maxDeviation > worst) worst = res.maxDeviation;
      scales.push(res.scale);
    }
    for (const m of members) repOf.set(m.id, rep.id);
    groups.push({
      key: rep.p.canonical.shape,
      representative: rep.id,
      members: members.map((m) => m.id),
      size: members.length,
      maxDeviation: round(worst, 9),
      ...(mode === 'scale' ? {
        scales: [...new Set(scales.map((s) => round(s, 6)))].sort((x, y) => x - y),
        // True when the class is vacuous: see scaleTrivial(). Read these
        // classes as "all circles" or "all horizontal lines", never as drift.
        trivial: scaleTrivial(rep.p),
      } : {}),
    });
  }
  groups.sort((a, b) => b.size - a.size || cmpStr(String(a.representative), String(b.representative)));

  for (const nm of nearMisses) { nm.groupA = repOf.get(nm.a) ?? nm.a; nm.groupB = repOf.get(nm.b) ?? nm.b; }
  // Dropped: a "near miss" between two paths that the merge then put in the
  // same group is not a finding, it is the same group.
  const findings = nearMisses.filter((nm) => nm.groupA !== nm.groupB)
    .sort((x, y) => x.maxDeviation - y.maxDeviation);

  return {
    mode, tolerance: tol, nearThreshold: near, precision,
    groups, nearMisses: findings, unsupported,
    stats: {
      items: items.length,
      classified: rows.length,
      exactBuckets: buckets.size,
      groups: groups.length,
      singletons: groups.filter((g) => g.size === 1).length,
      largest: groups.length ? groups[0].size : 0,
      pairsChecked, capped,
    },
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────
// A thin shell so a census can be run without writing a script. Guarded, so
// importing this module still does nothing.

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) cli();

function cli() {
  const argv = process.argv.slice(2);
  if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
    console.log(`Shape congruence over SVG files (audit only; writes nothing).

  node tools/audit/congruence.mjs <file.svg…> [options]
  node tools/audit/congruence.mjs --master 24 [--filter <regex>] [options]

  --mode translation|scale   default translation
  --subpaths                 classify each subpath on its own (the shared-part
                             census) instead of each whole file
  --tol N / --near N         default ${TOL} / ${NEAR}
  --top N                    how many groups and near misses to print (20)
  --json                     the whole result as JSON`);
    return;
  }
  const flag = (n, dflt) => { const i = argv.indexOf(`--${n}`); return i < 0 ? dflt : argv[i + 1]; };
  const has = (n) => argv.includes(`--${n}`);
  const mode = flag('mode', 'translation');
  const tol = Number(flag('tol', TOL)), near = Number(flag('near', NEAR));
  const top = Number(flag('top', 20));

  let files = argv.filter((a) => a.endsWith('.svg'));
  const master = flag('master', null);
  if (master) {
    const dir = join('src/icons', String(master));
    const re = flag('filter', null) ? new RegExp(flag('filter', null)) : null;
    files = readdirSync(dir).filter((f) => f.endsWith('.svg') && (!re || re.test(f))).sort()
      .map((f) => join(dir, f));
  }
  if (!files.length) { console.error('no files'); process.exitCode = 1; return; }

  const items = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const ds = [...src.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
    const name = basename(f, '.svg');
    const m = basename(dirname(f));
    ds.forEach((d, i) => {
      if (!has('subpaths')) { items.push({ id: `${m}/${name}#${i}`, d, file: f }); return; }
      subpathsOfPath(d).forEach((sd, k) => items.push({ id: `${m}/${name}#${i}.${k}`, d: sd, file: f }));
    });
  }

  const res = classify(items, { mode, tol, near });
  if (has('json')) { console.log(JSON.stringify(res, null, 2)); return; }
  const s = res.stats;
  console.log(`${s.items} paths · ${s.classified} read · ${res.unsupported.length} refused`);
  console.log(`${s.groups} congruence classes (${s.singletons} of them one-of-a-kind) · largest ${s.largest} · ${s.pairsChecked} pairs measured${s.capped ? ' (CAPPED)' : ''}`);
  console.log(`\nbiggest classes (${mode}, tolerance ${tol}):`);
  for (const g of res.groups.slice(0, top)) {
    console.log(`  ${String(g.size).padStart(4)}×  worst ${g.maxDeviation}  ${g.representative}${mode === 'scale' && g.scales.length > 1 ? `  scales ${g.scales.join(' ')}` : ''}`);
  }
  console.log(`\nnear misses (fail ${tol}, inside ${near}) — ${res.nearMisses.length}, nearest first:`);
  for (const n of res.nearMisses.slice(0, top)) {
    console.log(`  ${String(n.maxDeviation).padEnd(10)} ${n.a}  vs  ${n.b}${mode === 'scale' ? `  ×${n.scale}` : ''}`);
  }
  if (res.unsupported.length) {
    console.log('\nrefused:');
    for (const u of res.unsupported.slice(0, top)) console.log(`  ${u.id}: ${u.reason}`);
  }
}
