// Radii — the corner radius of a DRAWN corner, measured from the geometry.
//
// WHY THIS EXISTS. `tools/lint.mjs:372-377` reads the `rx`/`ry` literals typed
// into an `A` command and checks them as a lower bound only (C10's bend floor).
// It therefore cannot see:
//   · a corner drawn any other way (a Bezier fillet, or an arc whose literal
//     radii the SVG spec scales up because they cannot span the endpoints);
//   · a corner's radius as an upper bound, or against a vocabulary;
//   · the corners of FILLED area paths, which are a third of every filled file
//     and carry the icon's outer contour — lint's `AREA` paths are stripped
//     before the bend loop ever runs.
// So `docs/01-foundations.md` §5's radius vocabulary (container 2.5 ·
// bend/detail 1.5 · hard 0, at 24) is stated and unenforced, and
// `docs/09-rule-audit.md:23` records one known breach measured by hand.
//
// AUDIT ONLY. Never imported by lint or build. Writes nothing. The path
// tokenizer is `parsePath` (via `./angles.mjs`), reused rather than rewritten.
//
// ── HOW A RADIUS IS MEASURED ───────────────────────────────────────────────
//
// A corner is where two STRAIGHT runs meet — directly (sharp, radius 0) or
// through a fillet. Three independent numbers are reported for every fillet,
// and they are meant to be compared:
//
//   `radius`            measured from the curve itself. For circular arcs it is
//                       the radius of the centre-form parameterization (SVG
//                       F.6.5), which is the arc's TRUE radius — it already
//                       includes the spec's radii-too-small scaling, so it
//                       diverges from the literal exactly when the literal lies.
//                       For a Bezier or a mixed group it is a least-squares
//                       circle fit through 48 samples per piece.
//   `radiusByTangent`   from the two straight legs alone, touching no curve:
//                       extend them to their vertex V, take the mean distance
//                       from V to the two tangent points, and divide by
//                       tan(turn / 2). This is C23's `r / tan 22.5°` relation
//                       read backwards, and it is what catches a "fillet" that
//                       is not actually tangent to its legs.
//   `literal`           the `rx`, `ry` as typed, or null for a Bezier. Reported
//                       so the two can be compared, never used as the answer.
//
// Plus `fitError` (how circular the curve really is), `tangentError` (how far
// off tangent the fillet meets its legs, in degrees) and `tangentUneven`
// (|t1 − t2|, how lopsided it is).
//
// `tangentError` is what stops the tool inventing corners. Two straights with a
// curve between them are not always a rounded corner: `gear-3`'s tooth flanks
// are joined by the gear's own outer rim, an r8.25 arc that meets them 85° off
// tangent. `turn` only reads the two legs' directions, so it cannot by itself
// tell a 90° corner from a 270° reflex one — `reflex` (tangentError > 90) does
// that: the fillet leaves its leg backwards and goes the long way round, which
// is how `wallet-3`'s flap tucks behind its body and how `camera-5`'s top plate
// overlaps its hump. A corner whose fillet is more than `tangentMax` (5°) off
// tangent keeps its measured radius and is given the role `ambiguous`.
//
// A shape with no straight runs has NO corners: a ring, a dot, a lens, a bowl.
// That is deliberate and it is `docs/09:23`'s own distinction — "rings, lenses,
// bowls and dots are shapes, not corners". A full circle returns [].
//
// ── STROKE VS AREA, AND THE CENTRELINE ─────────────────────────────────────
//
// A stroked path's `d` IS the centreline, so `radius` is the centreline radius
// the rule speaks about. A filled file's area path is the icon's OUTER contour,
// so its corner radius is bigger by half a stroke. `centreline` reports
// `radius − (outline weight at this master) / 2` for area paths, which is the
// relation C23 states ("container radius 2.5 … outer 3.25" at 24, where half
// the 1.5 outline is 0.75). It assumes the contour is the centreline offset
// AWAY from the arc centre — true for a silhouette's outer corner and for the
// ink side of a punched line, which is every case in this set, but it is an
// assumption and it is named here rather than hidden. A `centreline` at or
// below 0 means the corner has no stroke counterpart at all: it is a rounding
// belonging to the filled shape alone, like the 0.5 nick where `file`'s notch
// meets its top edge.
//
// ── ROLE ───────────────────────────────────────────────────────────────────
//
// Each corner is classified structurally — never by its radius, or the census
// would be circular. All four tests are measured, and the thresholds are
// parameters:
//
//   big      the subpath's bbox covers >= `bigFrac` (0.60) of the file's ink
//            box on BOTH axes — it is a body, not a part.
//   encloses `fill` >= `enclMin` (0.70), or the subpath is closed. `fill` is
//            how much of its OWN bounding box the subpath encloses: the area of
//            the polygon you get by joining its two ends, over the bbox area.
//            On the real set this separates with nothing near the threshold — a
//            chevron scores 0.50 and `file`'s fold 0.50, while `trash`'s
//            three-sided can scores 0.95 and any closed body 0.98-1.00. (Path
//            length over bbox perimeter was tried first and rejected: it put
//            the can at 0.696 against a 0.70 line, a knife-edge.)
//   convex   the corner turns the same way as the subpath's overall
//            orientation — ink on the outside, not a notch cut inward.
//   legsLong both straight legs >= canvas / 24 units (1 at 24, 0.83 at 20,
//            0.67 at 16). Below that the "corner" is mostly fillet.
//
//   container  big && encloses && convex && legsLong
//   bend       !encloses && !closed && (<= 3 corners on that subpath)
//              — a corner in an open line. `spansIcon` says whether that line
//                is the whole mark (a chevron) or a part inside a composite
//                (`code`'s bracket).
//   detail     a small closed part, or a concave corner cut into the body
//   ambiguous  anything that fits none of them, or more than one
//
// `ambiguous` is used rather than guessed at. Its commonest cause is a corner
// whose legs are shorter than the fillet it joins.

import { pathToFileURL } from 'node:url';
import { bbox } from '../geometry.mjs';
import { bendMin } from '../masters.mjs';
import { piecesOf, samplesOf, tangentOf, readIcon, listIcons, iconFromSource } from './angles.mjs';

// Re-exported so a caller can run a census without also importing `angles.mjs`.
export { readIcon, listIcons, iconFromSource };

const DEG = 180 / Math.PI;
const r3 = (n) => Math.round(n * 1000) / 1000;
const toIcon = (x) => (typeof x === 'string' ? readIcon(x) : x);

// ── small geometry helpers ─────────────────────────────────────────────────

const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const norm = (v) => { const m = Math.hypot(v[0], v[1]); return m < 1e-12 ? [0, 0] : [v[0] / m, v[1] / m]; };
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Signed turn from direction `a` to direction `b`, degrees, as a designer
 *  reads the drawing (y up, so positive = the path turns anticlockwise). */
function turnBetween(a, b) {
  const cross = a[0] * b[1] - a[1] * b[0];     // in SVG's y-down frame
  const dot = a[0] * b[0] + a[1] * b[1];
  return -Math.atan2(cross, dot) * DEG;        // flipped to the y-up reading
}

/** Intersection of two infinite lines, or null when they are parallel. */
function intersect(p1, d1, p2, d2) {
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(den) < 1e-9) return null;
  const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + d1[0] * t, p1[1] + d1[1] * t];
}

/** Algebraic (Kasa) least-squares circle through points. */
export function fitCircle(pts) {
  let Sx = 0, Sy = 0, Sxx = 0, Syy = 0, Sxy = 0, Sz = 0, Sxz = 0, Syz = 0;
  const n = pts.length;
  if (n < 3) return null;
  for (const [x, y] of pts) {
    const z = x * x + y * y;
    Sx += x; Sy += y; Sxx += x * x; Syy += y * y; Sxy += x * y;
    Sz += z; Sxz += x * z; Syz += y * z;
  }
  const M = [[Sxx, Sxy, Sx], [Sxy, Syy, Sy], [Sx, Sy, n]];
  const V = [-Sxz, -Syz, -Sz];
  const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
                   - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                   + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D0 = det(M);
  if (Math.abs(D0) < 1e-12) return null;
  const col = (i) => M.map((row, k) => row.map((v, j) => (j === i ? V[k] : v)));
  const [D, E, F] = [0, 1, 2].map((i) => det(col(i)) / D0);
  const cx = -D / 2, cy = -E / 2;
  const rr = cx * cx + cy * cy - F;
  if (rr <= 0) return null;
  const radius = Math.sqrt(rr);
  let error = 0;
  for (const p of pts) error = Math.max(error, Math.abs(dist(p, [cx, cy]) - radius));
  return { cx, cy, radius, error };
}

// ── elements: straight runs and curve groups ───────────────────────────────

/**
 * Collapse a subpath's pieces into alternating elements: a `run` (one or more
 * collinear straight pieces, merged) and a `curves` group (one or more
 * consecutive curve pieces). Corners live between them.
 */
function elementsOf(pieces, closed, collinearTol) {
  const els = [];
  for (const p of pieces) {
    if (p.type === 'line') {
      const dir = norm(sub2(p.to, p.from));
      const last = els.at(-1);
      if (last?.kind === 'run' && Math.abs(turnBetween(last.dir, dir)) <= collinearTol) {
        last.to = p.to; last.length += dist(p.from, p.to);
      } else els.push({ kind: 'run', from: p.from, to: p.to, dir, length: dist(p.from, p.to) });
    } else {
      const last = els.at(-1);
      if (last?.kind === 'curves') last.pieces.push(p);
      else els.push({ kind: 'curves', pieces: [p] });
    }
  }
  // A closed subpath can begin and end in the same straight run (the `Z` line
  // continuing the first command). Merge the wrap so it is one run, not a
  // phantom 0-degree corner.
  if (closed && els.length > 1) {
    const a = els[0], z = els.at(-1);
    if (a.kind === 'run' && z.kind === 'run' && Math.abs(turnBetween(z.dir, a.dir)) <= collinearTol) {
      a.from = z.from; a.length += z.length; a.dir = norm(sub2(a.to, a.from));
      els.pop();
    }
  }
  return els;
}

// ── corners ────────────────────────────────────────────────────────────────

/**
 * Every corner in one `d`.
 *
 * Each entry: `{ at, radius, kind, turn }` plus everything the header lists.
 * `kind` is `'arc'` (fillet drawn by `A`), `'bezier'` (`C`/`S`/`Q`/`T`) or
 * `'sharp'` (two runs meeting, radius 0).
 */
export function cornersOf(d, { collinearTol = 0.1, minTurn = 0.5, maxTurn = 175,
                               samplesPerPiece = 48, circleTol = 0.02 } = {}) {
  const { pieces, subs } = piecesOf(d);
  const out = [];

  for (const s of subs) {
    const mine = s.pieces.map((i) => pieces[i]);
    if (!mine.length) continue;
    const els = elementsOf(mine, s.closed, collinearTol);

    // Subpath-level facts the role test needs, all measured here.
    const pts = mine.flatMap((p) => samplesOf(p, samplesPerPiece));
    let length = 0;
    for (const p of mine) {
      const sp = samplesOf(p, samplesPerPiece);
      for (let i = 1; i < sp.length; i++) length += dist(sp[i - 1], sp[i]);
    }
    const box = { x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])),
                  y0: Math.min(...pts.map((p) => p[1])), y1: Math.max(...pts.map((p) => p[1])) };
    // Shoelace over the subpath's samples with its two ends joined. The SIGN
    // gives the traversal direction, so a corner can be called convex or
    // concave; the MAGNITUDE over the bbox area gives `fill` — how much of its
    // own box the subpath encloses, which is what tells a body from a bent line.
    let area2 = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
      area2 += x1 * y2 - x2 * y1;
    }
    const boxArea = (box.x1 - box.x0) * (box.y1 - box.y0);
    const subInfo = { index: s.index, closed: s.closed, length, bbox: box,
                      fill: boxArea > 1e-9 ? Math.abs(area2 / 2) / boxArea : 0,
                      orient: Math.sign(area2) || 1, corners: 0 };

    const n = els.length;
    const at = (i) => (s.closed ? els[((i % n) + n) % n] : els[i]);

    for (let i = 0; i < n; i++) {
      const a = at(i);
      if (!a || a.kind !== 'run') continue;
      if (!s.closed && i + 1 >= n) continue;
      const b = at(i + 1);
      if (!b) continue;

      let kind = null, group = null, startPt = null, endPt = null, c = null;
      if (b.kind === 'run') { kind = 'sharp'; c = b; startPt = a.to; endPt = b.from; }
      else {
        if (!s.closed && i + 2 >= n) continue;
        c = at(i + 2);
        if (!c || c.kind !== 'run') continue;        // curve ends the path: not a corner
        group = b.pieces;
        kind = group.every((p) => p.type === 'arc') ? 'arc'
             : group.every((p) => p.type !== 'arc') ? 'bezier' : 'mixed';
        startPt = group[0].from; endPt = group.at(-1).to;
      }

      const turn = turnBetween(a.dir, c.dir);
      if (Math.abs(turn) < minTurn || Math.abs(turn) > maxTurn) continue;   // not a corner

      // the vertex the fillet replaces
      const V = kind === 'sharp' ? a.to : intersect(a.to, a.dir, c.from, c.dir);
      const t1 = V ? dist(V, startPt) : null, t2 = V ? dist(V, endPt) : null;
      const half = Math.tan((Math.abs(turn) / 2) * (Math.PI / 180));
      const radiusByTangent = kind === 'sharp' ? 0
        : (V && half > 1e-9 ? ((t1 + t2) / 2) / half : null);

      // radius, measured from the curve
      let radius = 0, fit = null, exact = false, literal = null, elliptical = false, sweepDeg = 0;
      if (kind !== 'sharp') {
        const cpts = group.flatMap((p) => samplesOf(p, samplesPerPiece));
        fit = fitCircle(cpts);
        const arcs = group.filter((p) => p.type === 'arc').map((p) => p.arc);
        sweepDeg = arcs.reduce((t, x) => t + x.sweepDeg, 0);
        elliptical = arcs.some((x) => !x.circular);
        const oneCircle = arcs.length === group.length && arcs.every((x) => x.circular)
          && arcs.every((x) => Math.abs(x.rx - arcs[0].rx) < 1e-6
                            && Math.abs(x.cx - arcs[0].cx) < 1e-6
                            && Math.abs(x.cy - arcs[0].cy) < 1e-6);
        if (oneCircle) { radius = arcs[0].rx; exact = true; }
        else if (fit) radius = fit.radius;
        if (group.length === 1 && group[0].literal) literal = group[0].literal;
        // Not a corner at all: the group is neither one circular arc nor close
        // enough to a circle — a bowl, an S, the edge of a lens.
        if (!exact && (!fit || fit.error > circleTol)) continue;
      }

      const tangentError = kind === 'sharp' ? 0 : Math.max(
        Math.abs(turnBetween(a.dir, tangentOf(group[0], 0))),
        Math.abs(turnBetween(tangentOf(group.at(-1), 1), c.dir)));

      subInfo.corners++;
      out.push({
        at: V ?? a.to, radius, kind, turn,
        interior: 180 - Math.abs(turn),
        convex: Math.sign(-turn) === subInfo.orient,   // turn is y-up, orient is y-down
        literal, radiusFit: fit?.radius ?? null, fitError: fit?.error ?? 0,
        radiusByTangent, tangentLengths: V ? [t1, t2] : null,
        tangentUneven: V ? Math.abs(t1 - t2) : null,
        tangentError, reflex: tangentError > 90, exact, elliptical, sweepDeg,
        legs: [a.length, c.length], sub: s.index, subInfo,
        pieces: kind === 'sharp' ? [] : group.map((p) => p.type),
      });
    }
  }
  return out;
}

// ── per-file ───────────────────────────────────────────────────────────────

function roleOf(c, ink, { bigFrac, enclMin, minLeg, tangentMax }) {
  const s = c.subInfo, b = s.bbox;
  const big = (b.x1 - b.x0) >= bigFrac * (ink.x1 - ink.x0)
           && (b.y1 - b.y0) >= bigFrac * (ink.y1 - ink.y0);
  const encloses = s.closed || s.fill >= enclMin;
  const legsLong = Math.min(...c.legs) >= minLeg;
  let role = 'ambiguous';
  // A curve that does not meet its legs on tangent is not a corner rounding at
  // all, whatever its radius measures: `gear-3`'s rim between two tooth flanks,
  // or a reflex tuck that goes the long way round. Measured, not classified.
  if (c.tangentError > tangentMax) role = 'ambiguous';
  else if (big && encloses && c.convex && legsLong) role = 'container';
  else if (!encloses && !s.closed && s.corners <= 3) role = 'bend';
  else if ((!big && encloses) || (big && encloses && !c.convex)) role = 'detail';
  return { role, big, encloses, legsLong, spansIcon: big, fill: s.fill };
}

/**
 * Every corner in one drawing — stroked paths AND filled area paths.
 *
 * The area paths are the ones lint cannot see; they are measured the same way
 * and labelled `style: 'area'`, with `centreline` giving the stroke radius they
 * correspond to (see the header).
 */
export function radiiOf(file, opts = {}) {
  const icon = toIcon(file);
  const o = { bigFrac: 0.6, enclMin: 0.7, minLeg: icon.master / 24, tangentMax: 5, ...opts };

  // The file's ink box: a stroked centreline grown by half its weight, an area
  // contour as drawn. Reuses `geometry.bbox`, which measures arcs exactly.
  let ink = null;
  for (const p of icon.paths) {
    const b = bbox([p.d]);
    const h = p.style === 'stroke' ? icon.halfStroke : 0;
    const g = { x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h };
    ink = ink ? { x0: Math.min(ink.x0, g.x0), y0: Math.min(ink.y0, g.y0),
                  x1: Math.max(ink.x1, g.x1), y1: Math.max(ink.y1, g.y1) } : g;
  }

  const corners = [];
  for (const p of icon.paths) {
    for (const c of cornersOf(p.d, o)) {
      const { role, big, encloses, legsLong, spansIcon, fill } = roleOf(c, ink, o);
      const centreline = p.style === 'area' ? c.radius - icon.outlineHalf : c.radius;
      corners.push({
        ...c, path: p.index, style: p.style,
        file: icon.file, name: icon.name, master: icon.master,
        role, big, encloses, legsLong, spansIcon, fill,
        centreline,
        offsetBy: p.style === 'area' ? icon.outlineHalf : 0,
        literalMismatch: c.literal ? Math.abs(Math.min(...c.literal) - c.radius) : null,
        bendMin: bendMin(icon.stroke),
        bendRatio: c.kind === 'sharp' ? null : c.radius / bendMin(icon.stroke),
      });
    }
  }
  const byRole = corners.reduce((m, c) => ((m[c.role] = (m[c.role] ?? 0) + 1), m), {});
  return { file: icon.file, name: icon.name, master: icon.master, style: icon.filled ? 'filled' : 'outline',
           stroke: icon.stroke, ink, corners, byRole };
}

// ── set-wide ───────────────────────────────────────────────────────────────

/**
 * The distribution of radii across many drawings, grouped by value, so a caller
 * can ask "is every container radius 2.5?". Groups on the MEASURED radius at
 * 3 dp; `centrelineGroups` does the same on the centreline-equivalent, which is
 * the one scale on which a stroked corner and a filled contour corner compare.
 */
export function census(files, opts = {}) {
  const per = files.map((f) => radiiOf(f, opts));
  const all = per.flatMap((p) => p.corners);

  const group = (key) => {
    const g = {};
    for (const c of all) {
      const k = String(r3(c[key]));
      (g[k] ??= { value: r3(c[key]), count: 0, roles: {}, masters: {}, styles: {}, kinds: {}, files: new Set() });
      const e = g[k];
      e.count++;
      e.roles[c.role] = (e.roles[c.role] ?? 0) + 1;
      e.masters[c.master] = (e.masters[c.master] ?? 0) + 1;
      e.styles[c.style] = (e.styles[c.style] ?? 0) + 1;
      e.kinds[c.kind] = (e.kinds[c.kind] ?? 0) + 1;
      e.files.add(`${c.master}/${c.file}`);
    }
    return Object.fromEntries(Object.entries(g)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([k, v]) => [k, { ...v, files: [...v.files].sort() }]));
  };

  const byRole = {};
  for (const c of all) {
    const e = (byRole[c.role] ??= { count: 0, radii: {}, byMaster: {} });
    e.count++;
    const k = String(r3(c.radius));
    e.radii[k] = (e.radii[k] ?? 0) + 1;
    const m = (e.byMaster[c.master] ??= {});
    m[k] = (m[k] ?? 0) + 1;
  }

  return {
    files: files.length, drawings: per.length, corners: all.length,
    kinds: all.reduce((m, c) => ((m[c.kind] = (m[c.kind] ?? 0) + 1), m), {}),
    byRadius: group('radius'),
    centrelineGroups: group('centreline'),
    byRole,
    byStyle: all.reduce((m, c) => ((m[c.style] = (m[c.style] ?? 0) + 1), m), {}),
    sharp: all.filter((c) => c.kind === 'sharp').length,
    literalLies: all.filter((c) => c.literalMismatch !== null && c.literalMismatch > 1e-6)
      .sort((a, b) => b.literalMismatch - a.literalMismatch),
    notTangent: all.filter((c) => c.kind !== 'sharp' && c.tangentError > 1)
      .sort((a, b) => b.tangentError - a.tangentError),
    lopsided: all.filter((c) => c.tangentUneven !== null && c.tangentUneven > 0.01)
      .sort((a, b) => b.tangentUneven - a.tangentUneven),
    // C10's floor is about MARK BENDS. Scoped to them here, with everything
    // else kept apart — a 0.5 rounding on a filled contour is a shape detail,
    // not a bend, and holding it to half the stroke would be a category error.
    // lint.mjs:372-377 makes no such distinction; it simply cannot see most of
    // these, because they are on area paths it strips first.
    underBend: all.filter((c) => c.role === 'bend' && c.kind !== 'sharp' && c.radius < c.bendMin - 0.005),
    underBendAnyRole: all.filter((c) => c.kind !== 'sharp' && c.radius < c.bendMin - 0.005),
    bends: all.filter((c) => c.role === 'bend' && c.kind !== 'sharp'),
    reflex: all.filter((c) => c.reflex),
    all, per,
  };
}

// ── CLI (reporting only; writes nothing) ───────────────────────────────────

// `pathToFileURL`, not a template: this repo's path contains a space, which
// `import.meta.url` percent-encodes and a hand-built `file://` string does not.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const files = args.filter((a) => !a.startsWith('--'));
  const list = files.length ? files : listIcons();
  const c = census(list);
  if (args.includes('--json')) console.log(JSON.stringify(c, (k, v) => (k === 'subInfo' || k === 'per' ? undefined : v), 2));
  else report(c);
}

function report(c) {
  console.log(`${c.drawings} drawings · ${c.corners} corners · kinds ${JSON.stringify(c.kinds)} · styles ${JSON.stringify(c.byStyle)}`);
  console.log(`\nby measured radius (as drawn):`);
  console.log('   radius  count  roles                                     masters          styles');
  for (const [k, v] of Object.entries(c.byRadius))
    console.log(`  ${k.padStart(7)}  ${String(v.count).padStart(5)}  ${JSON.stringify(v.roles).padEnd(40)}  ${JSON.stringify(v.masters).padEnd(15)}  ${JSON.stringify(v.styles)}`);
  console.log(`\nby role, radius histogram per master:`);
  for (const [role, v] of Object.entries(c.byRole)) {
    console.log(`  ${role} (${v.count})`);
    for (const m of [24, 20, 16])
      if (v.byMaster[m]) console.log(`    ${m}: ${Object.entries(v.byMaster[m]).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r}×${n}`).join(' · ')}`);
  }
  if (c.literalLies.length) {
    console.log(`\n${c.literalLies.length} corners whose typed rx/ry is not the radius drawn (worst 15):`);
    for (const x of c.literalLies.slice(0, 15))
      console.log(`  ${x.master}/${x.file} p${x.path} literal ${x.literal.join(',')} → drawn ${r3(x.radius)} (off ${r3(x.literalMismatch)})`);
  }
  if (c.notTangent.length) {
    console.log(`\n${c.notTangent.length} fillets meeting a leg more than 1° off tangent (worst 15):`);
    for (const x of c.notTangent.slice(0, 15))
      console.log(`  ${x.master}/${x.file} p${x.path} r${r3(x.radius)} tangentError ${r3(x.tangentError)}° role ${x.role}`);
  }
  console.log(`\nC10's bend floor: ${c.bends.length} mark bends · ${c.underBend.length} under half the stroke · ${c.bends.filter((x) => Math.abs(x.radius - x.bendMin) < 1e-9).length} exactly on it.`);
  const other = c.underBendAnyRole.filter((x) => x.role !== 'bend');
  console.log(`${other.length} corners in other roles sit under their file's bendMin (${JSON.stringify(other.reduce((m, x) => ((m[x.style] = (m[x.style] ?? 0) + 1), m), {}))}) — not C10's case.`);
  if (c.reflex.length) console.log(`${c.reflex.length} reflex corners (the fillet goes the long way round): ${[...new Set(c.reflex.map((x) => x.name))].join(', ')}`);
}
