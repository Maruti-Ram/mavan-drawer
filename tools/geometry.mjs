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
 *  control points (conservative — the true curve is inside the hull). */
export function samplePath(d) {
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
        sampleArc(cx, cy, rx, ry, rot, fa, fs, ex, ey).forEach(([x, y]) => push(x, y));
        cx = ex; cy = ey;
      }
    }
  }
  return pts;
}

/** Endpoint -> centre parameterization (SVG spec F.6.5), then sample. */
function sampleArc(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2) {
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

  const pts = [];
  for (let i = 1; i <= SAMPLES; i++) {
    const t = t1 + (dt * i) / SAMPLES;
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

/** A dot is a CLOSED circle drawn as two arcs. An open two-arc path is a bend. */
export const isDot = (d) => /^M[^A-Za-z]+A[^A-Za-z]+A[^A-Za-z]+Z$/.test(d.trim());

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
  const di = rest.findIndex(isDot);
  if (di >= 0 && rest.length > 1 && rest.filter(isDot).length === 1) {
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

const subpathsOf = (d) => d.trim().split(/(?=[Mm])/).filter((x) => x.trim());

/** `ring` with extra points along its edges so that none is longer than `step`. */
const refine = (ring, step) => ring.flatMap(([x, y], i) => {
  const [bx, by] = ring[(i + 1) % ring.length], m = Math.max(1, Math.ceil(Math.hypot(bx - x, by - y) / step));
  return Array.from({ length: m }, (_, j) => [x + ((bx - x) * j) / m, y + ((by - y) * j) / m]);
});

/** A subpath as a closed ring of distinct points (no repeated closing point). */
function ringOf(d) {
  const pts = samplePath(d).filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-9);
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
