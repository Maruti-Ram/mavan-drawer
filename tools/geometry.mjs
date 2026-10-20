// Path parsing + accurate bounding box, including true arc extents.
// Shared by lint.mjs and build.mjs.

const CMD = /([MmLlHhVvCcSsQqTtAaZz])/;

/** Tokenize `d` into [{cmd, args:[Number]}], arc-flag aware. */
export function parsePath(d) {
  const out = [];
  const parts = d.split(CMD).map((s) => s.trim()).filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    if (!CMD.test(parts[i]) || parts[i].length !== 1) continue;
    const cmd = parts[i];
    const body = parts[i + 1] && !CMD.test(parts[i + 1]) ? parts[i + 1] : '';
    out.push({ cmd, args: scanArgs(cmd, body) });
  }
  return out;
}

function scanArgs(cmd, s) {
  const isArc = cmd === 'A' || cmd === 'a';
  const args = [];
  let i = 0, n = 0;
  const num = /^[+-]?(\d*\.\d+|\d+\.?)([eE][+-]?\d+)?/;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (i >= s.length) break;
    // arc flags (params 4 and 5 of each 7-tuple) are single characters
    if (isArc && (n % 7 === 3 || n % 7 === 4)) { args.push(Number(s[i])); i++; n++; continue; }
    const m = num.exec(s.slice(i));
    if (!m) { i++; continue; }
    args.push(Number(m[0]));
    i += m[0].length;
    n++;
  }
  return args;
}

/** Every number literal in `d`, for precision checking. */
export function numbersIn(d) {
  return (d.match(/[+-]?(\d*\.\d+|\d+\.?)([eE][+-]?\d+)?/g) || []).map(Number);
}

const SAMPLES = 64;    // points per arc
const STEP = 0.25;     // sampling interval along straight segments

/** Sample points along the path. Arcs are sampled exactly; Bezier curves use
 *  control points (conservative — the true curve is inside the hull). `arcStep`
 *  (degrees) asks for at least one sample per that much of every arc's sweep, on
 *  top of the fixed SAMPLES — `facingGap` needs its walls' normals within a degree.
 *  An options object, not a number, so `ds.map(samplePath)` cannot pass an index in. */
export function samplePath(d, { arcStep = 0 } = {}) {
  const pts = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  const push = (x, y) => pts.push([x, y]);
  // Straight runs must be sampled along their length, not just at their
  // endpoints — otherwise proximity checks miss a stroke that passes close
  // to the *middle* of another one.
  const line = (x, y) => {
    const n = Math.max(1, Math.ceil(Math.hypot(x - cx, y - cy) / STEP));
    for (let i = 1; i <= n; i++) push(cx + ((x - cx) * i) / n, cy + ((y - cy) * i) / n);
  };

  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase();
    const up = cmd.toUpperCase();
    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }[up];
    if (up === 'Z') { line(sx, sy); cx = sx; cy = sy; continue; }

    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M' || up === 'L' || up === 'T') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : a;
        if (up === 'M' && k === 0) { sx = x; sy = y; cx = x; cy = y; push(x, y); continue; }
        line(x, y); cx = x; cy = y;
      } else if (up === 'H') {
        const x = rel ? cx + a[0] : a[0]; line(x, cy); cx = x;
      } else if (up === 'V') {
        const y = rel ? cy + a[0] : a[0]; line(cx, y); cy = y;
      } else if (up === 'C' || up === 'S' || up === 'Q') {
        for (let j = 0; j < a.length; j += 2) {
          const [x, y] = rel ? [cx + a[j], cy + a[j + 1]] : [a[j], a[j + 1]];
          push(x, y);
        }
        const [ex, ey] = rel ? [cx + a[a.length - 2], cy + a[a.length - 1]]
                             : [a[a.length - 2], a[a.length - 1]];
        cx = ex; cy = ey;
      } else if (up === 'A') {
        const [rx, ry, rot, fa, fs] = a;
        const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]];
        sampleArc(cx, cy, rx, ry, rot, fa, fs, ex, ey, arcStep).forEach(([x, y]) => push(x, y));
        cx = ex; cy = ey;
      }
    }
  }
  return pts;
}

/** Endpoint -> centre parameterization (SVG spec F.6.5), then sample. */
function sampleArc(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2, arcStep = 0) {
  if (!rx || !ry) return [[x2, y2]];
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = (rotDeg * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;

  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }

  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;

  const ang = (ux, uy, vx, vy) => {
    const d = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    const t = Math.acos(Math.min(1, Math.max(-1, d)));
    return ux * vy - uy * vx < 0 ? -t : t;
  };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  let t1 = ang(1, 0, ux, uy), dt = ang(ux, uy, vx, vy);
  if (!fS && dt > 0) dt -= 2 * Math.PI;
  if (fS && dt < 0) dt += 2 * Math.PI;

  const pts = [], n = arcStep ? Math.max(SAMPLES, Math.ceil(Math.abs(dt) * 180 / Math.PI / arcStep)) : SAMPLES;
  for (let i = 1; i <= n; i++) {
    const t = t1 + (dt * i) / n;
    const px = Math.cos(t) * rx, py = Math.sin(t) * ry;
    pts.push([cos * px - sin * py + cx, sin * px + cos * py + cy]);
  }
  return pts;
}

/** Centreline bbox across many `d` strings. */
export function bbox(ds) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const d of ds) for (const [x, y] of samplePath(d)) {
    if (x < x0) x0 = x; if (y < y0) y0 = y;
    if (x > x1) x1 = x; if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

// ── anatomy ────────────────────────────────────────────────────────────────
// What a drawing is made of, so lint, build and the lab all read one measure
// instead of each re-deriving it (and getting it wrong differently).

/** A CLOSED path drawn as two arcs: a dot, a ring, an ellipse, a crescent. An open two-arc
 *  path is a bend. The name is older than the measure: this is the SHAPE, and it does not say
 *  whether the stroke fills it — `isSolidDot` and `ringHole` do, at the path's own weight. */
export const isDot = (d) => /^M[^A-Za-z]+A[^A-Za-z]+A[^A-Za-z]+Z$/.test(d.trim());

/** A ring: a closed two-arc CIRCLE whose radius is over half its stroke, so the stroke leaves
 *  a hole 2r − w across inside it — a key's bow, a ring badge, a keyhole, a `-circle` ring.
 *  Returns { hole, r, at } (the hole's width, the radius, its centre), or null for a dot and
 *  for a closed two-arc path that is not one circle (an ellipse, a crescent, a lens: their air
 *  is read by `facingGap` like any closed path's). A circle at exactly half its stroke closes
 *  its hole to a point and draws solid, so it is a dot (97 in the set, 2026-10-20). */
export function ringHole(d, w) {
  if (!isDot(d)) return null;
  const arcs = parsePath(d).filter(({ cmd }) => cmd === 'A').map(({ args }) => args);
  const r = arcs[0]?.[0];
  // a malformed arc (a zero radius, a number short) is no ring, and must not stop lint
  if (!(r > 0) || arcs.length !== 2 || !arcs.every((a) => a.length === 7 && a[0] === r && a[1] === r)) return null;
  // one circle, as written: the centre through the start and two samples on the first arc,
  // and every sample of both arcs r from it (an arc SVG had to scale up fails here)
  const pts = samplePath(d);
  if (pts.length <= SAMPLES * 2) return null;
  const [[ax, ay], [bx, by], [qx, qy]] = [pts[0], pts[(SAMPLES >> 1)], pts[SAMPLES]];
  const k = 2 * (ax * (by - qy) + bx * (qy - ay) + qx * (ay - by));
  if (!k) return null;
  const A = ax * ax + ay * ay, B = bx * bx + by * by, Q = qx * qx + qy * qy;
  const cx = (A * (by - qy) + B * (qy - ay) + Q * (ay - by)) / k, cy = (A * (qx - bx) + B * (ax - qx) + Q * (bx - ax)) / k;
  if (!pts.every(([x, y]) => Math.abs(Math.hypot(x - cx, y - cy) - r) < 0.005)) return null;
  // and all the way round: a semicircle traced out and back has no hole, and its box is 2r × r
  // (a loose test, since the samples can cut a corner of the true box on a split at an odd angle)
  const b = bbox([d]);
  if (b.x1 - b.x0 < 1.5 * r || b.y1 - b.y0 < 1.5 * r) return null;
  const hole = Math.round((2 * r - w) * 1000) / 1000;
  return hole > 0 ? { hole, r, at: [r2(cx), r2(cy)] } : null;
}

/** A dot draws SOLID: a closed two-arc path the stroke fills, with no hole left inside —
 *  a circle of radius at most half the stroke. C19's detached dot is one; a ring is not. */
export const isSolidDot = (d, w) => isDot(d) && isSolidStroke(d, w);

/** A solid key: a CLOSED path whose centreline is no wider than its stroke on its short side,
 *  so the stroke fills it with no counter left inside — a capsule key (calculator's tall key,
 *  2026-10-19) is a dot drawn long. Its arcs are the key's round ends, not bends. */
export const isSolidStroke = (d, w) => {
  if (!/[Zz]\s*$/.test(d.trim())) return false;
  const b = bbox([d]);
  return Math.min(b.x1 - b.x0, b.y1 - b.y0) <= w + 1e-9;
};

const grow = (b, h) => ({ x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h });
const same = (a, b) => ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(a[k] - b[k]) < 0.01);
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Split a stroked drawing into its silhouette and its mark, and measure the two
 * ratios absolute numbers hide:
 *
 *   ratio  the mark's ink box as a fraction of the container's ink diameter.
 *          A container icon reads wrong when this drifts from its family, however
 *          correct its own ink box is.
 *   gap    for a mark with one detached dot (an i, a ?, a !), the space between
 *          dot and body, and that space over the dot's own size. This is what
 *          "a hollow middle" measures; 1.5 units next to a 2-unit dot is 0.75 of it.
 *          The dot is a SOLID one (`isSolidDot`, at `stroke`): a ring, an ellipse or a
 *          crescent in the mark is body, not a dot (2026-10-20; until then globe's
 *          meridian read as a dot, and camera's lens as a second one).
 *
 * `shell` is the path whose ink box is the whole drawing's — the ring of a
 * `-circle` icon. A bare mark has none, and then there is no ratio to take.
 */
export function anatomy(paths, stroke) {
  if (!paths || paths.length < 2) return { shell: null, container: null, mark: null, ratio: null, gap: null };
  const h = stroke / 2;
  const boxes = paths.map((d) => grow(bbox([d]), h));
  const whole = grow(bbox(paths), h);
  const shell = boxes.findIndex((b) => same(b, whole));
  const rest = paths.filter((_, i) => i !== shell);
  if (shell < 0 || !rest.length) return { shell: null, container: null, mark: null, ratio: null, gap: null };

  const sb = boxes[shell], mb = grow(bbox(rest), h);
  const container = r2(Math.max(sb.x1 - sb.x0, sb.y1 - sb.y0));
  const mark = { w: r2(mb.x1 - mb.x0), h: r2(mb.y1 - mb.y0) };
  const ratio = { w: r2(mark.w / container), h: r2(mark.h / container) };

  // one detached dot, and the nearest approach from it to everything else
  let gap = null;
  const solid = (d) => isSolidDot(d, stroke);
  const di = rest.findIndex(solid);
  if (di >= 0 && rest.length > 1 && rest.filter(solid).length === 1) {
    const dot = rest[di], body = rest.filter((_, i) => i !== di);
    const db = grow(bbox([dot]), h);
    const dp = samplePath(dot), bp = body.flatMap(samplePath);
    let min = Infinity;
    for (const [ax, ay] of dp) for (const [bx, by] of bp) min = Math.min(min, Math.hypot(ax - bx, ay - by));
    const part = r2(db.y1 - db.y0), size = r2(min - stroke);
    gap = { size, part, ratio: r2(size / part) };
  }
  return { shell, container, mark, ratio, gap };
}

// ── selfGap ────────────────────────────────────────────────────────────────
// How close a path comes to ITSELF. This is the measure `docs/01-foundations.md`
// §6 has always implied ("no enclosed shape smaller than 1.5 units across") and
// `docs/08-refinement.md` §6.4 calls the hard one, and it is what the pair loop
// in lint can never see: both ends of one stroke, and a counter drawn by one
// curling path.
//
// The trap: a path is *supposed* to come close to itself at a bend. A C10 corner
// of radius 0.75 brings its own tangent points 1.06 apart — legal, and identical
// on a ruler to a counter that is too tight. Arc length does not separate the two
// either: a 90 deg corner and a closing bowl can span the same length of path.
//
// What separates them is TURN. A bend turns 45, 90, at most 135 degrees and then
// leaves. A path only comes back alongside itself after it has turned past half a
// revolution. So a pair of points is judged only once the path between them has
// turned more than `turn` degrees (180 by default, i.e. it has doubled back);
// everything inside a single bend is below that and is never judged.
//
// Turn is accumulated SIGNED, so an S — a bowl into a reverse tuck — unwinds as it
// should: reversing curvature moves the path away from itself, not alongside it.
//
// The gate is 170, not 180. A half-circle bowl is the archetype this measure exists
// for, and it can never reach 180 on our grid: its ends sit on a 45 deg diagonal, so
// the 2 dp rule rounds 1.0607 to 1.06 and the sweep comes out at 175.96 — under a 180
// gate the whole mark goes unjudged, which is how `help-3`'s proposed 16 first passed
// clean. 170 keeps a 35 deg margin over the widest legal bend (C10 tops out at 135)
// and 6 under the tightest half-bowl. Judging a pair 170 apart reads their chord
// rather than the full diameter, so a counter can read ~0.01 tight; lint's tolerance
// already allows for that.
const TAU = Math.PI * 2;
// two points closer than this ALONG the path are neighbours, not a pair to judge
const NEIGHBOUR = 0.5;

/** Sample points with the signed turn and the arc length accumulated along the path. */
function sampleWithTurn(d) {
  const pts = samplePath(d).filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-9);
  const out = [];
  let turn = 0, prev = null;
  for (let i = 0; i < pts.length; i++) {
    const nxt = pts[i + 1] ?? pts[i - 1];
    if (!nxt) continue;
    const dir = i + 1 < pts.length
      ? Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])
      : Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
    if (prev !== null) {
      let dt = dir - prev;
      while (dt > Math.PI) dt -= TAU;
      while (dt < -Math.PI) dt += TAU;
      turn += dt;
    }
    prev = dir;
    const run = i === 0 ? 0 : out.at(-1)[3] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    out.push([pts[i][0], pts[i][1], (turn * 180) / Math.PI, run]);
  }
  // A polyline's chord directions are the true tangents rotated by half a segment's
  // turn, and the last sample has no segment after it, so a half turn is lost at each
  // end. Give each end its half back, or every measured sweep reads a few degrees
  // short of what was drawn.
  // A closed path is exempt either way: going the short way round, no two of its
  // points are more than half a revolution apart, so a ring's hole reads as a
  // radius and not a counter. Correcting its ends would make antipodes land on
  // exactly 180 and start judging every circle in the set against itself.
  const shut = out.length > 3 && Math.hypot(out.at(-1)[0] - out[0][0], out.at(-1)[1] - out[0][1]) < 0.01;
  if (out.length > 3 && !shut) {
    out[0][2] -= (out[1][2] - out[0][2]) / 2;
    out.at(-1)[2] += (out.at(-2)[2] - out.at(-3)[2]) / 2;
  }
  return out;
}

/**
 * The narrowest the path comes to itself, measured between stroke EDGES
 * (subtract `stroke`; pass 0 for a filled area's boundary, which has no stroke).
 * Only pairs separated by more than `turn` degrees of turning are judged.
 * Returns null when the path never turns that far — a straight or singly-bent
 * mark has no counter and nothing to check.
 */
export function selfGap(d, stroke = 0, turn = 170) {
  // A `d` holding several subpaths (an evenodd area) is not one path: measure each
  // on its own, or a shape reads as touching the shape beside it inside the same d.
  const subs = d.trim().split(/(?=[Mm])/).filter((x) => x.trim());
  if (subs.length > 1) {
    const each = subs.map((x) => selfGap(x, stroke, turn)).filter(Boolean);
    return each.length ? each.reduce((a, b) => (b.gap < a.gap ? b : a)) : null;
  }
  const pts = sampleWithTurn(d);
  if (pts.length < 3) return null;
  // A closed path ends where it started, so its first and last samples are the same
  // point: without this the wrap reads as a zero gap on every circle in the set.
  const total = pts.at(-1)[3];
  const closed = Math.hypot(pts.at(-1)[0] - pts[0][0], pts.at(-1)[1] - pts[0][1]) < 0.01;
  // A closed path is not judged against itself at all. Going the short way round, no
  // two of its points are more than half a revolution apart, so the widest pair on a
  // ring is its own diameter — a radius, not a counter. That was true by accident
  // while the gate sat at 180 and sampling read 178; with the gate at 170 it has to
  // be said out loud, or every circle in the set reports its own hole.
  if (closed) return null;
  const whole = Math.abs(pts.at(-1)[2] - pts[0][2]);
  let min = Infinity, at = null;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      // On a closed path the short way round is the real separation: two points
      // 357 deg apart are 3 deg apart, and the ring must not read as touching itself.
      const raw = Math.abs(pts[j][2] - pts[i][2]);
      const between = closed ? Math.min(raw, whole - raw) : raw;
      if (between < turn - 0.5) continue;
      const run = pts[j][3] - pts[i][3];
      if (run < NEIGHBOUR || (closed && total - run < NEIGHBOUR)) continue;
      const dist = Math.hypot(pts[j][0] - pts[i][0], pts[j][1] - pts[i][1]);
      if (dist < min) { min = dist; at = [r2((pts[i][0] + pts[j][0]) / 2), r2((pts[i][1] + pts[j][1]) / 2)]; }
    }
  }
  if (!isFinite(min)) return null;
  return { gap: r2(min - stroke), at, span: r2(Math.abs(pts.at(-1)[2] - pts[0][2])) };
}

// ── materialGap ────────────────────────────────────────────────────────────
// What a knockout leaves standing. A shape-filled drawing cuts its mark OUT of a
// solid, so the thing that closes up at 16 px is no longer the air inside the mark
// but the MATERIAL the cut leaves between two parts of itself: the mouth of a `?`,
// the flag-to-bar of a serif `i`, an island a ring-shaped cut leaves in its middle.
// `selfGap` cannot see it — a knockout's boundary is a
// closed path, and a closed path is never judged against itself there.
//
// It is measured on the filled drawing alone. The first version recovered the cut's
// width from the outline twin's centreline and subtracted it from the outline's
// counter, which is only true while the cut is centred on the outline; when the 16
// master went to stroke 1.25 the outlines moved 0.125 under cut-outs that were
// deliberately left as approved, and `help-4-filled` read 0.91 for a mouth that had
// not changed.
//
// A span counts when it is a real neck of material, which takes three things:
//   · both ends on the SAME boundary — one hole, or one island inside a hole (two
//     different holes are a pair, not a counter, and are not this measure's business;
//     nor is the outermost shape, whose thickness is a drawing decision, not a cut);
//   · it leaves one wall and arrives at the other square-on, within FACING degrees.
//     Where two smooth walls come closest the span is perpendicular to both; asking
//     for that is what keeps a bend from flagging — across the inside of a 90 deg
//     corner every chord sits 45 deg off both walls, and shrinks to nothing at the
//     apex. It is the same line `selfGap` draws with its 170 deg turn gate, and it
//     has the same blind side: a tongue that TAPERS is read only while its walls are
//     within 2 x FACING of parallel (chords across it sit half the taper off each
//     wall). A sharper wedge of material is a bend's inside and is not judged;
//   · every point of it lies in material, and just past each end there is none — so
//     the cut's own width, which joins the same two walls the short way through the
//     hole, is never read as a gap, and neither is a wall another area has painted over.
// At a corner that points into the material the wall has no single normal, so any
// direction between its two edges' normals counts as square-on there.
//
// Two ends closer than NEIGHBOUR along the boundary are not judged, as in `selfGap`.
// A neck of width w needs at least w * pi / 2 of boundary to get round its tip, so
// this only blinds the measure to tongues under a third of a unit — and what it does
// remove is real: an offset outline leaves hairline loops where an inner fillet has
// collapsed (`help-filled` at 20 carries an arc of radius 0.02), which evenodd paints
// as a sliver of material that reads 0.00.
//
// Walls are walked every FINE units, not at `samplePath`'s 0.25: on a tapering neck
// the reading is taken up to one step short of the tip, and at 0.25 a 16 deg taper
// read 0.07 wide — enough to pass a 0.95 neck at a floor of 1.
//
// Subpaths must start with an absolute M (as in `selfGap`): every area in the set does.
const FACING = 10;
const FINE = 0.05;

export const subpathsOf = (d) => d.trim().split(/(?=[Mm])/).filter((x) => x.trim());

/** `ring` with extra points along its edges so that none is longer than `step`. */
const refine = (ring, step) => ring.flatMap(([x, y], i) => {
  const [bx, by] = ring[(i + 1) % ring.length], m = Math.max(1, Math.ceil(Math.hypot(bx - x, by - y) / step));
  return Array.from({ length: m }, (_, j) => [x + ((bx - x) * j) / m, y + ((by - y) * j) / m]);
});

/** A subpath as a closed ring of distinct points (no repeated closing point). */
function ringOf(d, opts) {
  const pts = samplePath(d, opts).filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-9);
  if (pts.length > 1 && Math.hypot(pts.at(-1)[0] - pts[0][0], pts.at(-1)[1] - pts[0][1]) < 1e-9) pts.pop();
  return pts;
}

function inside(ring, x, y) {
  let odd = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
  }
  return odd;
}

/**
 * The narrowest filled span between two parts of one boundary, across every hole (and
 * every island inside a hole) of the given evenodd area(s). `areas` is one `d` or a
 * list of them (a file's areas are painted together, so material is whatever any of
 * them fills). Returns { gap, at, area, sub } — `sub` is the subpath's index within
 * `areas[area]` — or null when no cut faces itself across material (a dot, a bar, a
 * single bend).
 */
export function materialGap(areas) {
  const list = (Array.isArray(areas) ? areas : [areas]).map((d) => subpathsOf(d).map(ringOf));
  const filled = (x, y) => list.some((rings) => rings.filter((r) => r.length > 2 && inside(r, x, y)).length % 2 === 1);
  const COS = Math.cos((FACING * Math.PI) / 180);
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  let min = Infinity, found = null;

  list.forEach((rings, ai) => rings.forEach((coarse, s) => {
    if (coarse.length < 3) return;
    // How many of its d's other subpaths it sits inside. 0 is the shape itself and is
    // not judged; odd is a hole (material outside it); even is an island (material inside).
    const depth = rings.filter((o) => o !== coarse && o.length > 2 && inside(o, coarse[0][0], coarse[0][1])).length;
    if (!depth) return;
    const ring = refine(coarse, FINE), n = ring.length;
    let area = 0;
    for (let i = 0; i < n; i++) area += cross(ring[i], ring[(i + 1) % n]);
    if (depth % 2 === 0) area = -area; // an island is a hole inside out
    // edge k runs ring[k] → ring[k+1]; its normal points into material
    const tan = [], nor = [], run = [0];
    for (let k = 0; k < n; k++) {
      const [ax, ay] = ring[k], [bx, by] = ring[(k + 1) % n], L = Math.hypot(bx - ax, by - ay);
      const t = [(bx - ax) / L, (by - ay) / L];
      run.push(run[k] + L); // run[k] = boundary length up to ring[k]; run[n] = all the way round
      tan.push(t);
      nor.push(area > 0 ? [t[1], -t[0]] : [-t[1], t[0]]);
    }
    // Is `dir` square-on to the wall at vertex v? Within FACING of either edge that meets
    // there, or - at a corner pointing into the material - anywhere between the two.
    const squareOn = (v, dir) => {
      const ka = (v - 1 + n) % n, na = nor[ka], nb = nor[v], fan = cross(na, nb);
      return dot(dir, na) >= COS || dot(dir, nb) >= COS
        || (cross(tan[ka], tan[v]) * area > 0 && cross(na, dir) * fan >= 0 && cross(dir, nb) * fan >= 0);
    };
    // the way out of the material from vertex v (between its two edges, so it holds at a
    // point too), and whether it really is empty a hair's breadth that way
    const into = (v) => {
      const na = nor[(v - 1 + n) % n], nb = nor[v], L = Math.hypot(na[0] + nb[0], na[1] + nb[1]) || 1;
      return [-(na[0] + nb[0]) / L, -(na[1] + nb[1]) / L];
    };
    const open = (pt, way) => !filled(pt[0] + way[0] * 0.02, pt[1] + way[1] * 0.02);
    for (let i = 0; i < n; i++) {
      const p = ring[i];
      for (let k = 0; k < n; k++) {
        if (k === (i - 1 + n) % n || k === i) continue;
        const a = ring[k], b = ring[(k + 1) % n];
        const ex = b[0] - a[0], ey = b[1] - a[1];
        const u = Math.max(0, Math.min(1, ((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / (ex * ex + ey * ey)));
        const q = [a[0] + u * ex, a[1] + u * ey];
        const dist = Math.hypot(q[0] - p[0], q[1] - p[1]);
        if (dist < 1e-6 || dist >= min) continue;
        const along = Math.abs(run[k] + u * (run[k + 1] - run[k]) - run[i]);
        if (Math.min(along, run[n] - along) < NEIGHBOUR) continue;
        const dir = [(q[0] - p[0]) / dist, (q[1] - p[1]) / dist], back = [-dir[0], -dir[1]];
        // the far end is the foot of a perpendicular, or one of the edge's own corners
        const arrives = u > 0 && u < 1 ? dot(back, nor[k]) >= COS : squareOn(u === 0 ? k : (k + 1) % n, back);
        if (!arrives || !squareOn(i, dir)) continue;
        const steps = Math.max(5, Math.ceil(dist / 0.1));
        let solid = true;
        for (let m = 1; m < steps && solid; m++) solid = filled(p[0] + (dir[0] * dist * m) / steps, p[1] + (dir[1] * dist * m) / steps);
        // both ends must be a real edge of the ink: another area painted over the hole
        // (a file's areas are drawn together) turns its wall into the middle of a solid
        if (!solid || !open(p, into(i)) || !open(q, u > 0 && u < 1 ? [-nor[k][0], -nor[k][1]] : into(u === 0 ? k : (k + 1) % n))) continue;
        min = dist; found = { at: [r2((p[0] + q[0]) / 2), r2((p[1] + q[1]) / 2)], area: ai, sub: s };
      }
    }
  }));
  return found ? { gap: r2(min), ...found } : null;
}

// ── facingGap ──────────────────────────────────────────────────────────────
// The air between two ink edges that FACE each other, wherever the rest of lint
// cannot see it (docs/08 §6.5). Two holes remain after `selfGap` and `materialGap`:
//   · a CLOSED stroked path is never judged against itself (`selfGap` bows out, since
//     its turn gate reads a ring's diameter as a counter), so the inside of a collar,
//     the neck of a jigsaw knob or a pinched waist can close up unseen — `paintbrush`
//     shipped 1.22 of air inside its collar at 16;
//   · a shape-filled drawing's AIR — the width of a cut, a notch in the outer edge,
//     the space between a shape and the line beside it — is not measured at all
//     (`materialGap` reads only the material a cut leaves standing).
//
// It works on the ink's edges, not the centrelines: every stroke is offset half its
// width to both sides (with its round joins and round caps), every area contributes
// its boundary, and each piece of edge carries the direction that leads into air. From
// every piece a ray goes straight out into air, and from every SHARP corner of a shape a
// fan of rays (no piece of wall faces anything square-on at a point); the first wall a
// ray meets that faces back within ARRIVE degrees ends the span. Square-on at both ends
// is what makes a span a neck:
//   · a bend is never read: across the inside of a 90 deg corner every ray arrives
//     side-on, and the inner edge of a C10 bend at the minimum radius is a single point;
//   · a ring's hole reads at its full diameter, and a rounded end over a flat at its true
//     height — a span taken at an angle cuts the corner and reads short (users-wide 16's
//     1.5 counter read 1.48 at 10 deg), which would warn on a set drawn AT the floor;
//   · a dot, whose hole is ink, has no inner edge to measure.
// No turn gate is needed, so a closed path is judged like any other. The span must be
// air all the way across: a stroke or a shape lying between two walls makes two gaps, not
// one. Two ends on one shape's boundary closer than NEIGHBOUR along it are not read, as in
// `materialGap` (an offset's collapsed fillet leaves self-crossing hairline loops).
//
// Two rounds that BULGE into the air toward each other (the feet of a jigsaw knob, the
// rounded corners of two shapes) are the one place ARRIVE is too strict. The rays leave a
// round 1 deg apart, and a ray that leaves it d off the line joining the two rounds' centres
// meets the far one about d x (1 + (r1 + gap) / r2) off square-on: two corners of radius
// 0.25 across 1.6 of air turn half a degree into 4, and the neck between them was never read
// (found 2026-09-28). Between two bulges a ray may arrive as far off square-on as that
// cutting can put it (x 1.5, never past BULGE); everywhere else ARRIVE holds. That only
// nominates the pair: the reading is then taken exactly, between the two rounds' circles on
// the line joining their centres, and kept only where both ends of that line land on a wall
// of the drawing square-on (`exact`). So it cannot read a bend short: a wedge where two
// shapes cross puts the far end on a flat, side-on; a sliver where two bulges meet side by
// side (paintbrush-4's ferrule, whose two strokes touch and then curve apart) arrives far
// more side-on than the cutting allows; and a piece beside a sharp corner is flat, not a
// bulge (the corner's turn is a JOIN, not curve).
//
// Blind sides: a wedge of air whose walls open by more than about 2 x ARRIVE is read as the
// inside of a corner, so a triangular counter (C23) is still the drawer's to measure by its
// largest inscribed circle; two sharp corners pointing straight at each other are not read
// (a sharp corner facing a round or a flat is: its fan of rays finds it, and a round is read
// exactly as above); air under 0.02 across is ignored.
//
// Pairs between two DIFFERENT stroked paths are not reported: lint §5 already measures
// them by plain distance. What comes back is, per stroked path, the narrowest air
// between two edges of that path (subpaths of one `d` count as one path — the pair
// loop compares `d`s, so two subpaths inside one were checked by nothing); and, when
// the drawing has areas, the narrowest air with a shape's edge on at least one side,
// once per kind (`airKind`), so a ruling on one kind cannot hide another.
// Only readings under `cap` are looked for; anything wider is not a gap question.
const WALL = 0.1;          // edge sampling step
const JOIN = 5;            // a vertex turning more than this (deg) gets a round-join fan
const ARRIVE = 3;          // deg: how far off square-on a span may meet its far wall
const BULGE = FACING;      // deg: the most it may be, between two bulges (see above)

const r3 = (n) => Math.round(n * 1000) / 1000;   // a span's two ends, for boards that draw it
const dist2 = (a, b) => (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
/** An open polyline with extra points so that no step is longer than `step`. */
const refineOpen = (pts, step) => [...refine(pts, step).slice(0, -Math.max(1, Math.ceil(Math.hypot(
  pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) / step))), pts.at(-1)];

export function facingGap(ds, stroke, areas = [], { cap = 1.75 } = {}) {
  // `stroke` is one weight for every path, or an array with one per path: in a line-heavy
  // filled drawing a numeral or a letter keeps the outline weight beside heavier rails (C32), and each
  // path's edge is offset by its own half. `half` is the widest, for the spatial hash.
  const halves = ds.map((_, i) => (Array.isArray(stroke) ? stroke[i] : stroke) / 2);
  const half = Math.max(0, ...halves), key = (i, j) => (i + 512) * 1024 + j + 512;
  // centreline segments of every stroked path, for "is this point ink?"
  const segs = [];
  const lines = ds.map((d, owner) => subpathsOf(d).map((sub) => {
    let pts = samplePath(sub, { arcStep: 1 }).filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-9);
    const closed = pts.length > 2 && Math.hypot(pts.at(-1)[0] - pts[0][0], pts.at(-1)[1] - pts[0][1]) < 0.01;
    if (closed) pts.pop();
    if (pts.length > 1) pts = closed ? refine(pts, WALL) : refineOpen(pts, WALL);
    const m = closed ? pts.length : pts.length - 1;
    // each segment carries its own path's pen radius, squared, for `nearLine`
    const R2 = (halves[owner] - 1e-4) ** 2;
    for (let k = 0; k < m; k++) segs.push([pts[k], pts[(k + 1) % pts.length], R2]);
    if (pts.length === 1) segs.push([pts[0], pts[0], R2]);
    return { pts, closed };
  }));

  // spatial hash of the centreline segments (cells of 1 unit)
  const segGrid = new Map();
  segs.forEach(([a, b], s) => {
    for (let i = Math.floor(Math.min(a[0], b[0]) - half); i <= Math.floor(Math.max(a[0], b[0]) + half); i++)
      for (let j = Math.floor(Math.min(a[1], b[1]) - half); j <= Math.floor(Math.max(a[1], b[1]) + half); j++) {
        const k = key(i, j); if (!segGrid.has(k)) segGrid.set(k, []); segGrid.get(k).push(s);
      }
  });
  const nearLine = (x, y) => {
    const list = segGrid.get(key(Math.floor(x), Math.floor(y)));
    if (list) for (const s of list) {
      const [a, b] = segs[s], ex = b[0] - a[0], ey = b[1] - a[1], L = ex * ex + ey * ey;
      const u = L ? Math.max(0, Math.min(1, ((x - a[0]) * ex + (y - a[1]) * ey) / L)) : 0;
      const fx = x - a[0] - u * ex, fy = y - a[1] - u * ey;
      if (fx * fx + fy * fy < segs[s][2]) return true;
    }
    return false;
  };
  const rings = areas.map((d) => subpathsOf(d).map((sub) => ringOf(sub, { arcStep: 1 })));
  // evenodd per area, so a point is paint when a ray from it crosses an area's edges an odd
  // number of times (all its subpaths together); the edges are filed by height in bands of
  // BAND, so a test only walks the few that span it — the same answer as `inside`, faster
  const BAND = 0.25;
  const banded = rings.map((rs) => {
    const bands = new Map();
    for (const r of rs) if (r.length > 2) r.forEach((a, i) => {
      const b = r[(i + 1) % r.length];
      for (let k = Math.floor(Math.min(a[1], b[1]) / BAND); k <= Math.floor(Math.max(a[1], b[1]) / BAND); k++) {
        if (!bands.has(k)) bands.set(k, []); bands.get(k).push([a[0], a[1], b[0], b[1]]);
      }
    });
    return bands;
  });
  const inArea = (x, y) => banded.some((bands) => {
    let odd = false;
    for (const [xi, yi, xj, yj] of bands.get(Math.floor(y / BAND)) ?? [])
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
    return odd;
  });
  const ink = (x, y) => nearLine(x, y) || inArea(x, y);
  // how many of its own area's other subpaths each ring sits inside: 0 the shape's outer
  // edge, odd a cut-out (a hole), even an island inside a hole
  const depth = rings.map((rs) => rs.map((r) => r.length > 2
    ? rs.filter((o) => o !== r && o.length > 2 && inside(o, r[0][0], r[0][1])).length : 0));

  // walls: short straight pieces of the ink's edge, [ax, ay, bx, by, nx, ny, tag], (nx, ny)
  // the way into air; kept only where a hair past the middle really is air
  const walls = [];
  // (a shape's walls also carry where they sit along their ring and the ring's length, so
  // two ends closer than NEIGHBOUR along one boundary are not read, as in `materialGap`)
  // `bend`: on a piece of a round that bulges into the air, how far the edge turns at each of
  // its two ends (radians); stored as [curvature, the larger turn, length] for BULGE below
  // (`fx, fy`: where its ray starts, when not its middle)
  const wall = (ax, ay, bx, by, nx, ny, tag, run = -1, round = 0, ta = -1, tb = -1, fx = NaN, fy = NaN) => {
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    if (ink(mx + nx * 0.02, my + ny * 0.02)) return;
    const L = ta < 0 ? 0 : Math.hypot(bx - ax, by - ay);
    const bulge = L > 1e-9 ? [(ta + tb) / 2 / L, Math.max(ta, tb), L] : null;
    walls.push([ax, ay, bx, by, nx, ny, tag, run, round, bulge, fx === fx ? fx : mx, fy === fy ? fy : my]);
  };
  // a round join or cap: an arc of the pen's circle about (cx, cy), in pieces of 1 deg; the
  // pen's circle always bulges into the air
  const fan = (cx, cy, a0, sweep, tag, h) => {
    const n = Math.max(1, Math.ceil(Math.abs(sweep) / (Math.PI / 180)));
    for (let i = 0; i < n; i++) {
      const s = a0 + (sweep * i) / n, e = a0 + (sweep * (i + 1)) / n, m = (s + e) / 2;
      wall(cx + Math.cos(s) * h, cy + Math.sin(s) * h, cx + Math.cos(e) * h, cy + Math.sin(e) * h, Math.cos(m), Math.sin(m), tag, -1, 0, Math.abs(sweep) / n, Math.abs(sweep) / n);
    }
  };
  // How a boundary turns at each vertex (signed, radians; 0 at an open end).
  const turnsOf = (dir, closed) => dir.map((_, k) => {
    if (!closed && k === 0) return 0;
    const a = dir[(k - 1 + dir.length) % dir.length], b = dir[k];
    if (a === null || b === null) return 0;
    let dt = b - a; while (dt > Math.PI) dt -= TAU; while (dt < -Math.PI) dt += TAU;
    return dt;
  });
  // Does the piece between vertices k and k+1 bulge toward side `s` (+1 left of travel)? Yes
  // when the boundary turns away from that side at one of its ends and toward it at neither.
  // Its walls then carry how far it turns at each end.
  // A turn of JOIN or more is a corner, not curve: it says nothing about the pieces either
  // side of it, which are flat (a notch's mouth read 0.38 as two "bulges" of radius 0.001).
  const EPS = (0.05 * Math.PI) / 180, soft = (t) => Math.abs(t ?? 0) < (JOIN * Math.PI) / 180 ? (t ?? 0) : 0;
  const bulges = (turn, k, s) => {
    const a = -s * soft(turn[k]), b = -s * soft(turn[(k + 1) % turn.length]);
    return (a > EPS || b > EPS) && a > -EPS && b > -EPS;
  };
  const turnAt = (turn, k, s) => Math.max(0, -s * soft(turn[k % turn.length]));
  lines.forEach((subs, owner) => subs.forEach(({ pts, closed }) => {
    const tag = `p${owner}`, half = halves[owner];   // this path's own pen (C32)
    if (pts.length === 1) { fan(pts[0][0], pts[0][1], 0, TAU, tag, half); return; }
    const m = closed ? pts.length : pts.length - 1, dir = [], nor = [];
    for (let k = 0; k < m; k++) {
      const a = pts[k], b = pts[(k + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      nor.push([-(b[1] - a[1]) / L, (b[0] - a[0]) / L]);
      dir.push(Math.atan2(b[1] - a[1], b[0] - a[0]));
    }
    // turn[k]: at vertex k, from segment k-1 into segment k (an open path's last vertex is
    // pushed on the end, with no turn)
    const turn = turnsOf(dir, closed);
    if (!closed) turn.push(0);
    const sharp = (v) => Math.abs(turn[v]) >= (JOIN * Math.PI) / 180;
    // Where the edge of one segment meets the next. At a sharp vertex a round join's fan
    // bridges the two, so each keeps its own offset. Anywhere else the two offsets meet on
    // the bisector (the mitre, at most 0.1% longer than half a stroke under JOIN): offset
    // square to each segment, the outside of a curve leaves a slit of half a stroke x its
    // turn between every two pieces (0.013 on a 1 deg piece at 24), wider than the pieces'
    // own slack, and a ray aimed through it met nothing - `puzzle` at 24 read no neck
    // between its two knob feet (2026-09-29).
    // the mitre at each vertex (left side; the right is its negative), or null where a fan
    // bridges the two offsets or the path ends
    const mitre = pts.map((p, v) => {
      if ((!closed && (v === 0 || v === m)) || sharp(v)) return null;
      const na = nor[(v - 1 + m) % m], nb = nor[v % m], bx = na[0] + nb[0], by = na[1] + nb[1];
      const c = (bx * nb[0] + by * nb[1]) || 1;   // |bisector| x cos(half the turn)
      return [(bx * half) / c, (by * half) / c];
    });
    for (let k = 0; k < m; k++) {
      const v1 = closed ? (k + 1) % m : k + 1, a = pts[k], b = pts[v1 % pts.length];
      const ox = nor[k][0] * half, oy = nor[k][1] * half, ma = mitre[k], mb = mitre[v1];
      const oax = ma ? ma[0] : ox, oay = ma ? ma[1] : oy, obx = mb ? mb[0] : ox, oby = mb ? mb[1] : oy;
      for (let s = 1; s >= -1; s -= 2) {
        const ax = a[0] + s * oax, ay = a[1] + s * oay, bx = b[0] + s * obx, by = b[1] + s * oby;
        // inside a curve tighter than the pen the mitred piece shrinks to a point and turns
        // back on itself: that edge is swallowed by the ink and is no wall
        if ((bx - ax) * (b[0] - a[0]) + (by - ay) * (b[1] - a[1]) <= 1e-12) continue;
        // the ray leaves from the middle of the segment's own offset, square to it, whatever
        // the mitres did to the piece's ends
        const bend = bulges(turn, k, s);
        wall(ax, ay, bx, by, s * nor[k][0], s * nor[k][1], tag, -1, 0, bend ? turnAt(turn, k, s) : -1, bend ? turnAt(turn, k + 1, s) : -1,
          (a[0] + b[0]) / 2 + s * ox, (a[1] + b[1]) / 2 + s * oy);
      }
    }
    // round joins: a fan on both sides of a sharp vertex (the inner one is ink and drops out)
    for (let k = closed ? 0 : 1; k < m; k++) {
      const a0 = dir[(k - 1 + m) % m], dt = turn[k];
      if (!sharp(k)) continue;
      fan(pts[k][0], pts[k][1], a0 + Math.PI / 2, dt, tag, half);
      fan(pts[k][0], pts[k][1], a0 - Math.PI / 2, dt, tag, half);
    }
    // round caps at the open ends
    if (!closed) {
      fan(pts[0][0], pts[0][1], dir[0] + Math.PI / 2, Math.PI, tag, half);
      fan(pts.at(-1)[0], pts.at(-1)[1], dir.at(-1) - Math.PI / 2, Math.PI, tag, half);
    }
  }));
  const corners = [];        // [x, y, nx, ny, tag]: rays out of a shape's sharp corners
  rings.forEach((rs, ai) => rs.forEach((coarse, s) => {
    if (coarse.length < 3) return;
    const ring = refine(coarse, WALL), n = ring.length, tag = `a${ai}.${s}`;
    const len = (r) => r.reduce((t, a, k) => t + Math.hypot(r[(k + 1) % r.length][0] - a[0], r[(k + 1) % r.length][1] - a[1]), 0);
    const round = len(coarse);
    const turn = turnsOf(ring.map((a, k) => {
      const b = ring[(k + 1) % n];
      return Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-9 ? null : Math.atan2(b[1] - a[1], b[0] - a[0]);
    }), true);
    for (let k = 0, run = 0; k < n; k++) {
      const a = ring[k], b = ring[(k + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 1e-9) continue;
      const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      // the side with no paint is the way into air; a wall painted on both sides is no wall
      const side = inArea(mx - nx * 0.02, my - ny * 0.02) ? 1 : inArea(mx + nx * 0.02, my + ny * 0.02) ? -1 : 0;
      if (side) {
        const bend = bulges(turn, k, side);
        wall(a[0], a[1], b[0], b[1], side * nx, side * ny, tag, run + L / 2, round, bend ? turnAt(turn, k, side) : -1, bend ? turnAt(turn, k + 1, side) : -1);
      }
      run += L;
    }
    // A sharp corner of a shape has no wall that faces anything square-on, so rays are also
    // cast out of the corner itself, fanned 1 deg apart between its two edges' normals —
    // a stroke's corners are round (its joins and caps are fans already). Found by review,
    // 2026-09-28: a fillet overshooting into puzzle-4-filled's seam leaves a spur 0.84 from
    // the other piece at 16, and nothing read it.
    // A corner is where the outline itself turns sharply (not where the paint test flips: an
    // edge half-covered by another area is no corner — desktop-6-filled's stand, 2026-09-28).
    // Its fan runs from the incoming edge's way into air through the same turn. Which side is
    // air comes from the ring's winding and depth, not a paint test, so it holds on a sliver
    // thinner than the test's reach (puzzle-4-filled's spur is a hair wide at its tip).
    const m = coarse.length, dirs = [];
    for (let k = 0; k < m; k++) {
      const a = coarse[k], b = coarse[(k + 1) % m];
      dirs.push(Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-9 ? null : Math.atan2(b[1] - a[1], b[0] - a[0]));
    }
    // the side a ring's inside lies on (left of travel = +1), read off its longest edge
    let longest = 0;
    for (let k = 1; k < m; k++) if (dist2(coarse[k], coarse[(k + 1) % m]) > dist2(coarse[longest], coarse[(longest + 1) % m])) longest = k;
    const [la, lb] = [coarse[longest], coarse[(longest + 1) % m]], lL = Math.sqrt(dist2(la, lb));
    const inLeft = inside(coarse, (la[0] + lb[0]) / 2 - ((lb[1] - la[1]) / lL) * 1e-3, (la[1] + lb[1]) / 2 + ((lb[0] - la[0]) / lL) * 1e-3) ? 1 : -1;
    // air is outside a shape or an island (even depth) and inside a hole (odd)
    const airLeft = depth[ai][s] % 2 === 1 ? inLeft : -inLeft;
    const airs = dirs.map((d) => d === null ? null : d + (airLeft * Math.PI) / 2);
    for (let k = 0, run = 0; k < m; k++) {
      const p = (k - 1 + m) % m, [x, y] = coarse[k];
      if (k) run += Math.hypot(x - coarse[k - 1][0], y - coarse[k - 1][1]);
      if (dirs[p] === null || dirs[k] === null || airs[p] === null) continue;
      let dt = dirs[k] - dirs[p]; while (dt > Math.PI) dt -= TAU; while (dt < -Math.PI) dt += TAU;
      if (Math.abs(dt) < (JOIN * Math.PI) / 180) continue;
      const n = Math.ceil(Math.abs(dt) / (Math.PI / 180));
      for (let j = 0; j <= n; j++) {
        const t = airs[p] + (dt * j) / n, nx = Math.cos(t), ny = Math.sin(t);
        if (!ink(x + nx * 0.02, y + ny * 0.02)) corners.push([x, y, nx, ny, tag, run, round, [Infinity, Math.abs(dt) / n, 0]]);
      }
    }
  }));

  // filed by place (cells of `cap`) and by the way they face (bins of 10 deg): a wall only
  // ever meets walls facing back at it, so it looks in the three bins opposite its own
  const BINS = 36, bin = (nx, ny) => ((Math.round((Math.atan2(ny, nx) / TAU) * BINS) % BINS) + BINS) % BINS;
  const grid = new Map();   // cell -> BINS lists of wall indices
  walls.forEach((w, i) => {
    const k = key(Math.floor((w[0] + w[2]) / 2 / cap), Math.floor((w[1] + w[3]) / 2 / cap));
    if (!grid.has(k)) grid.set(k, Array.from({ length: BINS }, () => []));
    grid.get(k)[bin(w[4], w[5])].push(i);
  });
  const best = new Map();   // "p<i>" for a stroked path against itself, "area" for any span touching a shape
  // air all the way across, walked in steps of 0.1 from the middle out (whatever blocks a
  // span is usually a stroke lying between the walls, and no stroke is narrower than 1.25)
  const clear = (p, q, dist) => {
    const steps = Math.max(2, Math.ceil(dist / 0.1));
    const at = (m) => ink(p[0] + ((q[0] - p[0]) * m) / steps, p[1] + ((q[1] - p[1]) * m) / steps);
    for (let o = 0; o < steps / 2; o++) {
      const lo = Math.floor(steps / 2) - o, hi = Math.ceil(steps / 2) + o;
      if ((lo > 0 && at(lo)) || (hi < steps && at(hi))) return false;
    }
    return true;
  };
  // From the middle of every wall, straight out along its normal: the first wall it meets
  // that faces back, within ARRIVE, ends the span. Square-on at both ends is what makes it a
  // neck: a ring's hole reads at its full diameter and a rounded end over a flat at its true
  // height, where a span taken at an angle cuts the corner and reads short (users-wide 16's
  // body read 1.48 inside a 1.5 counter at 10 deg). It is also what keeps the inside of a
  // bend out: every ray across a 90 deg corner arrives side-on. The walls are cut at 1 deg
  // of curve so that two round caps facing each other always have a pair within ARRIVE, and
  // between two bulges the cutting's own error is allowed for (see the note at the top).
  const ARRIVE_RAD = (ARRIVE * Math.PI) / 180, COS_IN = Math.cos(ARRIVE_RAD), COS_BULGE = Math.cos((BULGE * Math.PI) / 180);
  // the rays: one from the middle of every wall, and the corner fans, filed by cell so the
  // nine cells round each are looked up once
  const rays = new Map();
  const ray = (px, py, nx, ny, tag, run = -1, round = 0, bulge = null) => {
    const k = key(Math.floor(px / cap), Math.floor(py / cap));
    if (!rays.has(k)) rays.set(k, []); rays.get(k).push([px, py, nx, ny, tag, run, round, bulge]);
  };
  for (const w of walls) ray(w[10], w[11], w[4], w[5], w[6], w[7], w[8], w[9]);
  // Is there a wall of `tag` through (x, y), square-on (within ARRIVE) to (ux, uy)?
  const faces = (x, y, ux, uy, tag) => {
    const ci = Math.floor(x / cap), cj = Math.floor(y / cap), b = bin(ux, uy);
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      const c = grid.get(key(ci + di, cj + dj));
      if (c) for (let db = -1; db <= 1; db++) for (const j of c[(b + db + BINS) % BINS]) {
        const w = walls[j];
        if (w[6] !== tag || w[4] * ux + w[5] * uy < COS_IN) continue;
        const ex = w[2] - w[0], ey = w[3] - w[1], L = ex * ex + ey * ey;
        const t = L ? Math.max(0, Math.min(1, ((x - w[0]) * ex + (y - w[1]) * ey) / L)) : 0;
        if (Math.hypot(x - w[0] - t * ex, y - w[1] - t * ey) < 0.01) return true;
      }
    }
    return false;
  };
  // A pair of bulges nominated past ARRIVE is read exactly: each piece stands for its round
  // (the circle through it at its own curvature; a shape's sharp corner is a round of radius
  // 0), and two rounds come closest on the line joining their centres. The reading counts
  // only if both of those points are on the drawing - a wall of the same edge lies there,
  // square-on to that line. Where two shapes cross in a narrow wedge, the far round's
  // closest point falls past its end, on the flat that forms the wedge, which faces the
  // line side-on (two rounded squares crossing at 6 deg read 0.1 without this).
  const exact = (px, py, nx, ny, tag, bulge, v) => {
    const r1 = Number.isFinite(bulge[0]) ? 1 / bulge[0] : 0, rf = 1 / v[9][0];
    const c1 = [px - nx * r1, py - ny * r1];
    const c2 = [(v[0] + v[2]) / 2 - v[4] * rf, (v[1] + v[3]) / 2 - v[5] * rf];
    const d = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]), gap = d - r1 - rf;
    if (!(gap > 0.02)) return null;
    const ux = (c2[0] - c1[0]) / d, uy = (c2[1] - c1[1]) / d;
    const p = [c1[0] + ux * r1, c1[1] + uy * r1], q = [c2[0] - ux * rf, c2[1] - uy * rf];
    // a corner has no wall: the line must leave it inside its fan (within one ray's step)
    const near = r1 ? faces(p[0], p[1], ux, uy, tag) : ux * nx + uy * ny >= Math.cos(bulge[1] + 1e-9);
    return near && faces(q[0], q[1], -ux, -uy, v[6]) ? [p, q, gap] : null;
  };
  for (const c of corners) ray(...c);
  for (const [k, here] of rays) {
    const ci = Math.floor(k / 1024) - 512, cj = (k % 1024) - 512, around = [];
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const c = grid.get(key(ci + di, cj + dj)); if (c) around.push(c); }
    for (const [px, py, nx, ny, tag, run, round, bulge] of here) {
      const pl = tag[0] === 'p', back = bin(-nx, -ny);
      let hit = Infinity, by = null, loose = false;
      for (const c of around) for (let db = -1; db <= 1; db++) for (const j of c[(back + db + BINS) % BINS]) {
        const v = walls[j];
        const cosA = -(v[4] * nx + v[5] * ny);
        if (cosA < COS_IN && (cosA < COS_BULGE || !bulge || !v[9])) continue;
        // ray (px, py) + t (nx, ny) against the segment v, with a hair of slack at its ends
        // so a ray cannot slip between two pieces of one wall
        const ex = v[2] - v[0], ey = v[3] - v[1], den = nx * ey - ny * ex;
        if (Math.abs(den) < 1e-12) continue;
        const ax = v[0] - px, ay = v[1] - py, t = (ax * ey - ay * ex) / den, u = (ax * ny - ay * nx) / den;
        if (!(t > 0.02 && t < hit && u >= -0.01 && u <= 1.01)) continue;
        if (cosA < COS_IN) {
          // past ARRIVE: only from one bulge into another, and only as far off square-on as
          // cutting the two rounds into pieces can put it (see BULGE) - which only nominates
          // the pair; `exact` below takes the reading or throws it out
          const rf = 1 / v[9][0], miss = (bulge[2] + (t + rf) * bulge[1]) / 2;
          const slack = 1.5 * (Math.asin(Math.min(1, miss / rf)) + v[9][1] / 2);
          if (Math.acos(Math.min(1, cosA)) > Math.max(ARRIVE_RAD, slack)) continue;
        }
        hit = t; by = v; loose = cosA < COS_IN;
      }
      if (!by) continue;
      let P = [px, py], Q = [px + nx * hit, py + ny * hit], len = hit;
      if (loose) {
        const e = exact(px, py, nx, ny, tag, bulge, by);
        if (!e) continue;
        [P, Q, len] = e;
      }
      if (len >= cap) continue;
      if (run >= 0 && by[6] === tag) {
        const along = Math.abs(by[7] - run);
        if (Math.min(along, round - along) < NEIGHBOUR) continue;
      }
      const ql = by[6][0] === 'p';
      if (pl && ql && tag !== by[6]) continue;   // two stroked paths: lint §5's business
      const kind = pl && ql ? tag : airKind(tag, by[6], depth);
      if (len >= (best.get(kind)?.raw ?? Infinity)) continue;
      if (!clear(P, Q, len)) continue;
      best.set(kind, { raw: len, gap: r2(len), at: [r2((P[0] + Q[0]) / 2), r2((P[1] + Q[1]) / 2)], span: [P, Q].map(([x, y]) => [r3(x), r3(y)]) });
    }
  }
  const self = [], area = [];
  for (const [k, v] of best) {
    if (k[0] === 'p') self.push({ path: Number(k.slice(1)), gap: v.gap, at: v.at, span: v.span });
    else area.push({ kind: k, gap: v.gap, at: v.at, span: v.span });
  }
  self.sort((a, b) => a.path - b.path);
  area.sort((a, b) => a.gap - b.gap);
  return { self, area };
}

// What a span of air touching a shape runs across, from the tags of its two walls:
//   cut         both walls are one cut-out's — the width of a punched line or counter (C22)
//   notch       both walls are one shape's outer edge (or one island's) — a bay in its outline
//   separation  two different edges — the band between a hole and the island it leaves,
//               or between two filled parts (C23's flap)
//   line        a shape's edge and a stroked line
const airKind = (a, b, depth) => {
  if (a[0] === 'p' || b[0] === 'p') return 'line';
  if (a !== b) return 'separation';
  const [ai, s] = a.slice(1).split('.').map(Number);
  return depth[ai][s] % 2 === 1 ? 'cut' : 'notch';
};
