// CRISPNESS — where an ink edge lands on a real pixel, and what grey that
// produces. Audit only (F7).
//
// THE QUESTION IT ANSWERS. `tools/lint.mjs` checks the coordinate LITERALS in a
// `d` against the master's grid (quarters at 24 and 20, eighths at 16). That is
// not the same question. A literal on the grid says where the CENTRELINE is; what
// a screen shows is where the ink EDGE is, which is the centreline plus or minus
// half the stroke — and whether THAT lands on a pixel boundary. The entire 16
// master rests on this: C7's whole construction is "outer edges stay on their
// pixel, so 16 centrelines sit on x.375 / x.625". Nothing in the project has ever
// measured whether they do.
//
// AN "INK EDGE" IS A STRAIGHT PIECE OF THE INK BOUNDARY THAT RUNS ALONG A PIXEL
// LINE. Two kinds, kept apart because they behave differently:
//   · a RUN   — an axis-aligned straight centreline segment. It offsets to two
//               parallel ink edges, each the length of the run. The whole length
//               is either crisp or not.
//   · an EXTREME — an arc's horizontal or vertical tangent point: the left side
//               of a ring, the top of a rounded corner. Its edge is crisp only at
//               the point itself and falls away as the curve turns, so it is
//               weighted by the length of it that stays within `tolDev` of the
//               extreme (a quarter device pixel by default) rather than by the
//               whole arc.
// Diagonals are not ink edges at all. A 45-degree edge cannot land on a pixel
// line anywhere along its length, which is C7's own recorded cost
// ("diagonals lose most": solid pixels on `chevron-down` 71 -> 38).
//
// EVERY NUMBER CARRIES ITS RENDER SIZE. An edge is not crisp or blurry in the
// abstract: 8.625 is a quarter pixel off at 16px, dead on at 32px, and a third of
// a pixel off at 24px. `px` is never defaulted.

import { parsePath } from '../geometry.mjs';
import {
  readIcon, regionOf, region, rasterise, strokeRegion, DEFAULT_RATE, sum,
} from './raster.mjs';

export const DEFAULT_TOL_DEV = 0.25; // how far from its extreme a curve still reads as that edge, in device px
export const DEFAULT_MIN_RUN = 0.5;  // a straight run shorter than this is not an edge, in canvas units

function load(file, opts = {}) {
  if (file && file.region) return file;
  const icon = typeof file === 'string' ? readIcon(file) : file;
  return { icon, region: regionOf(icon, opts) };
}

/** Distance in device pixels from `coord` (canvas units) to the nearest whole pixel line. */
const offsetOf = (coord, px, canvas) => {
  const dev = (coord * px) / canvas;
  return { dev, off: Math.abs(dev - Math.round(dev)) };
};

/**
 * Every axis-aligned ink edge in one `d`, with its centreline coordinate, the
 * length of ink along it, and which side of the stroke it is.
 *
 * `h` is half the stroke. A stroked path offsets each run by +h and -h; an arc's
 * extreme offsets to radius+h on the outside and radius-h on the inside, and the
 * inner one only exists while the stroke has not closed over the centre.
 * A filled area path has h = 0: its boundary IS the ink edge.
 */
function edgesOfPath(d, h, { tolDev, minRun, px, canvas }) {
  const out = [];
  const unit = canvas / px;                 // canvas units per device pixel
  const tol = tolDev * unit;                // the same tolerance, in canvas units
  let cx = 0, cy = 0, sx = 0, sy = 0;

  const run = (ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay;
    const L = Math.hypot(dx, dy);
    if (L < minRun) return;
    if (dy === 0) for (const s of (h ? [-1, 1] : [0])) out.push({ kind: 'run', axis: 'y', coord: ay + s * h, len: L, side: s });
    else if (dx === 0) for (const s of (h ? [-1, 1] : [0])) out.push({ kind: 'run', axis: 'x', coord: ax + s * h, len: L, side: s });
  };

  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase();
    const up = cmd.toUpperCase();
    if (up === 'Z') { run(cx, cy, sx, sy); cx = sx; cy = sy; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    if (!step) throw new Error(`pixelgrid: unsupported command "${cmd}"`);
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : a;
        if (k === 0) { sx = x; sy = y; } else run(cx, cy, x, y);
        cx = x; cy = y;
      } else if (up === 'L') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : a;
        run(cx, cy, x, y); cx = x; cy = y;
      } else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; run(cx, cy, x, cy); cx = x; }
      else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; run(cx, cy, cx, y); cy = y; }
      else {
        const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]];
        out.push(...arcExtremes(cx, cy, a[0], a[1], a[2], a[3], a[4], ex, ey, h, tol));
        cx = ex; cy = ey;
      }
    }
  }
  return out.map((e) => ({ ...e, ...offsetOf(e.coord, px, canvas), lenDev: (e.len * px) / canvas }));
}

/**
 * An arc's horizontal and vertical tangent points, as ink edges. Rotation is
 * always 0 in this set (18,133 arcs, 0 rotated), so the extremes sit at
 * theta = 0, pi/2, pi, 3pi/2 and only the ones inside the sweep count.
 *
 * The length credited to an extreme is how much of the curve stays within `tol`
 * of it: deviation = R(1 - cos t) for a circle of ink radius R, so the half-angle
 * is acos(1 - tol/R) and the length 2Rt, clipped to the sweep actually drawn. For
 * an ellipse R is the radius of curvature AT that extreme (ry^2/rx on the x
 * extreme, rx^2/ry on the y extreme), which is the right local answer.
 */
function arcExtremes(x1, y1, rx, ry, rot, fA, fS, x2, y2, h, tol) {
  if (!rx || !ry || rot !== 0) return [];
  rx = Math.abs(rx); ry = Math.abs(ry);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const lam = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx;
  const den = rx * rx * dy * dy + ry * ry * dx * dx;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cx = (co * rx * dy) / ry + (x1 + x2) / 2;
  const cy = (-co * ry * dx) / rx + (y1 + y2) / 2;

  const t1 = Math.atan2((y1 - cy) / ry, (x1 - cx) / rx);
  const t2 = Math.atan2((y2 - cy) / ry, (x2 - cx) / rx);
  let dt = t2 - t1;
  if (!fS && dt > 0) dt -= 2 * Math.PI;
  if (fS && dt < 0) dt += 2 * Math.PI;
  const within = (t) => {                       // is angle t inside the swept range?
    let u = (t - t1) % (2 * Math.PI);
    if (dt > 0 && u < 0) u += 2 * Math.PI;
    if (dt < 0 && u > 0) u -= 2 * Math.PI;
    return Math.abs(u) <= Math.abs(dt) + 1e-9;
  };

  const out = [];
  // theta, axis, the centre coord on that axis, the semi-axis along it, the curvature radius there
  const spots = [
    [0, 'x', cx, rx, (ry * ry) / rx, +1],
    [Math.PI, 'x', cx, rx, (ry * ry) / rx, -1],
    [Math.PI / 2, 'y', cy, ry, (rx * rx) / ry, +1],
    [-Math.PI / 2, 'y', cy, ry, (rx * rx) / ry, -1],
  ];
  // An extreme at the arc's own START or END only has curve on one side of it,
  // so it is credited half the length. The set draws every circle as two 180-degree
  // arcs meeting at the left and right extremes, so without this each of those
  // edges is counted twice over at full length and outweighs the top and bottom.
  const ends = (t) => [t1, t1 + dt].some((e) => Math.abs(Math.atan2(Math.sin(t - e), Math.cos(t - e))) < 1e-6);

  for (const [t, axis, c0, semi, kr, dir] of spots) {
    if (!within(t)) continue;
    const share = ends(t) ? 0.5 : 1;
    for (const s of (h ? [1, -1] : [0])) {
      const R = kr + s * h;                     // ink radius of curvature on this side
      if (R <= 0) continue;                     // the stroke has closed over the centre: no inner edge
      const edge = c0 + dir * (semi + s * h);
      const half = Math.acos(Math.max(-1, 1 - tol / R));
      const len = Math.min(2 * R * half, Math.abs(dt) * R) * share;
      out.push({ kind: 'extreme', axis, coord: edge, len, side: s, atEnd: share < 1 });
    }
  }
  return out;
}

/**
 * For each ink edge, how far it sits from the nearest whole-pixel boundary at
 * that render size. `off` is in device pixels and runs 0 (dead on a pixel line)
 * to 0.5 (dead on a pixel centre).
 */
export function edgeLanding(file, px, { tolDev = DEFAULT_TOL_DEV, minRun = DEFAULT_MIN_RUN, ...opts } = {}) {
  if (!px) throw new Error('edgeLanding: px is required — an edge is not crisp in the abstract');
  const { icon } = load(file, opts);
  const edges = [];
  for (const p of icon.paths) {
    const h = p.kind === 'stroke' ? p.weight / 2 : 0;
    for (const e of edgesOfPath(p.d, h, { tolDev, minRun, px, canvas: icon.canvas })) {
      edges.push({ ...e, from: p.kind, weight: p.weight ?? 0 });
    }
  }
  edges.sort((a, b) => b.off - a.off || b.lenDev - a.lenDev);
  return {
    name: icon.name, master: icon.master, canvas: icon.canvas, px,
    devicePxPerUnit: px / icon.canvas, tolDev, minRun,
    edges,
    runs: edges.filter((e) => e.kind === 'run').length,
    extremes: edges.filter((e) => e.kind === 'extreme').length,
    // two arcs meeting at an extreme record it twice, each at half length, so the
    // weighting is right but the count is not: this is the count of real edges
    distinct: new Set(edges.map((e) => `${e.axis}@${e.coord.toFixed(4)}`)).size,
    onPixel: edges.filter((e) => e.off < 0.01).length,
    onCentre: edges.filter((e) => e.off > 0.49).length,
  };
}

/**
 * HOW MUCH OF THE DRAWING LANDS BETWEEN PIXELS, IN ONE NUMBER.
 *
 * Definition, and it is the whole definition: the ink-length-weighted average of
 * how far the drawing's axis-aligned ink edges sit from the nearest whole-pixel
 * boundary, scaled so 0 means every edge lands exactly on a pixel boundary and 1
 * means every edge lands exactly on a pixel centre.
 *
 *     blur = SUM_i ( len_i * 2 * off_i ) / SUM_i len_i
 *
 * Why this and not something else. The obvious candidate — the share of rendered
 * coverage sitting in part-covered pixels — is useless here: at 16px every stroke
 * in the set is 1.25 device pixels wide, so almost every inked pixel is partial
 * for every icon and the measure pins near 1.0 and ranks nothing. It is reported
 * anyway, as `halfToneShare`, but SEPARATELY and never folded in: it answers a
 * different question (how much grey is there) from this one (is the grey
 * avoidable). `straightOnly` is the same measure over runs alone, so it is always
 * visible how much of the score a curve's extremes are carrying.
 *
 * It is silent about diagonals by construction, and that is honest rather than
 * convenient: a 45-degree edge has no landing to measure. `diagonalShare` reports
 * how much of the drawing's centreline length it had no opinion about, so a score
 * on a mostly-diagonal icon can be discounted on sight.
 */
export function blurScore(file, px, { tolDev = DEFAULT_TOL_DEV, minRun = DEFAULT_MIN_RUN, rate = DEFAULT_RATE, ...opts } = {}) {
  if (!px) throw new Error('blurScore: px is required');
  const ctx = load(file, opts);
  const { icon } = ctx;
  const land = edgeLanding(ctx, px, { tolDev, minRun });
  const score = (list) => {
    const w = sum(list.map((e) => e.lenDev));
    return w > 0 ? sum(list.map((e) => e.lenDev * 2 * e.off)) / w : null;
  };
  const runsOnly = land.edges.filter((e) => e.kind === 'run');

  // how much centreline is axis-aligned at all, so the score can be discounted
  let axial = 0, other = 0;
  for (const p of icon.paths) {
    for (const { pts, closed } of flattenRuns(p.d)) {
      const n = pts.length;
      for (let i = 0; i + 1 < n + (closed ? 1 : 0); i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n];
        const L = Math.hypot(bx - ax, by - ay);
        if (bx === ax || by === ay) axial += L; else other += L;
      }
    }
  }

  const { cov } = rasterise(ctx.region, { px, rate });
  let total = 0, inPartial = 0;
  for (const c of cov) { total += c; if (c > 0 && c < 0.995) inPartial += c; }

  return {
    name: icon.name, master: icon.master, canvas: icon.canvas, px, rate, tolDev, minRun,
    blur: score(land.edges),
    straightOnly: score(runsOnly),
    edgeCount: land.edges.length, runCount: runsOnly.length,
    diagonalShare: axial + other > 0 ? other / (axial + other) : null,
    halfToneShare: total > 0 ? inPartial / total : null,
    worst: land.edges.slice(0, 5),
    definition: '0 = every axis-aligned ink edge on a whole-pixel boundary; 1 = every one on a pixel centre; ink-length weighted',
  };
}

/** Segment runs with subpath structure, straight commands only (arcs give chords we do not want here). */
function flattenRuns(d) {
  const subs = [];
  let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  const open = (x, y) => { cur = { pts: [[x, y]], closed: false }; subs.push(cur); };
  const to = (x, y) => { if (!cur) open(cx, cy); cur.pts.push([x, y]); };
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    if (up === 'Z') { if (cur) cur.closed = true; cx = sx; cy = sy; cur = null; continue; }
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7 }[up];
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; if (k === 0) { sx = x; sy = y; open(x, y); } else to(x, y); cx = x; cy = y; }
      else if (up === 'L') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; to(x, y); cx = x; cy = y; }
      else if (up === 'H') { const x = rel ? cx + a[0] : a[0]; to(x, cy); cx = x; }
      else if (up === 'V') { const y = rel ? cy + a[0] : a[0]; to(cx, y); cy = y; }
      else { const [ex, ey] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]]; cur = null; cx = ex; cy = ey; } // arcs: not a run
    }
  }
  return subs.filter((s) => s.pts.length > 1);
}

/**
 * For a single line: the highest coverage any one pixel receives. This is the
 * figure C7 reasons about — "a line on the canvas centre peaks at 62.5% per pixel
 * on a 1x screen instead of 75%".
 */
export function peakCoverage(d, px, { weight = 1.25, canvas = 16, rate = DEFAULT_RATE } = {}) {
  if (!px) throw new Error('peakCoverage: px is required');
  const reg = strokeRegion([d], weight, { label: 'peakCoverage' });
  const { cov } = rasterise(reg, { px, rate, canvas });
  let peak = 0, at = null, full = 0;
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    const c = cov[j * px + i];
    if (c > peak) { peak = c; at = [i, j]; }
    if (c >= 0.995) full++;
  }
  return { d, px, canvas, weight, rate, peak, at, fullyInked: full, devicePxPerUnit: px / canvas };
}

/**
 * Per-row and per-column coverage at `px`. This is what answers "does the pixel
 * row separating these two strokes read as clear background" — docs/08 §3.4's
 * claim, which that sheet (`lab/refs/gap.html`) makes by eye off a magnified
 * bitmap and contains no measuring code at all.
 *
 * The question is LOCAL, so pass the window it is about. `window: [c0, c1]`
 * restricts `min`/`max`/`sum` to device-pixel columns c0..c1-1 (for rows) and
 * rows c0..c1-1 (for columns). Without a window the figures run the whole tile,
 * where `min` is 0 for almost every row of almost every icon simply because the
 * canvas has corners — true, and useless for judging a gap.
 */
export function rowProfile(file, px, { rate = DEFAULT_RATE, window: win = null, ...opts } = {}) {
  if (!px) throw new Error('rowProfile: px is required');
  const ctx = load(file, opts);
  const { cov } = rasterise(ctx.region, { px, rate });
  const [w0, w1] = win ?? [0, px];
  const scan = (get) => {
    let min = Infinity, max = -Infinity, s = 0;
    for (let k = w0; k < w1; k++) { const c = get(k); min = Math.min(min, c); max = Math.max(max, c); s += c; }
    return { min, max, sum: s, clear: max === 0, hasClearPixel: min === 0 };
  };
  const rows = [], cols = [];
  for (let j = 0; j < px; j++) rows.push({ row: j, ...scan((i) => cov[j * px + i]) });
  for (let i = 0; i < px; i++) cols.push({ col: i, ...scan((j) => cov[j * px + i]) });
  return {
    name: ctx.icon.name, master: ctx.icon.master, px, rate, window: [w0, w1], rows, cols, cov,
    note: 'clear = nothing inked anywhere in the window; hasClearPixel = at least one pixel in it is untouched',
  };
}

/** A region built straight from path specs — for a probe that is not a shipped file. */
export const probe = (paths, canvas, opts = {}) => ({
  icon: { name: opts.name ?? '<probe>', master: canvas, canvas, paths, label: opts.name ?? '<probe>' },
  region: { ...region(paths, opts), canvas },
});

/**
 * Which icons are blurriest at `px`, and why, ranked. `why` names the single
 * heaviest-weighted edge that is off a pixel line, so a row in the table points
 * straight at the coordinate to look at.
 */
export function census(files, px, { rate = DEFAULT_RATE, onError = 'throw', ...opts } = {}) {
  if (!px) throw new Error('census: px is required');
  const rows = [], failed = [];
  for (const f of files) {
    try {
      const b = blurScore(f, px, { rate, ...opts });
      const worst = b.worst.filter((e) => e.off > 0.05).sort((a, b2) => b2.lenDev * b2.off - a.lenDev * a.off)[0];
      rows.push({
        name: b.name, master: b.master, blur: b.blur, straightOnly: b.straightOnly,
        edges: b.edgeCount, runs: b.runCount, diagonalShare: b.diagonalShare, halfToneShare: b.halfToneShare,
        why: worst ? `${worst.kind} ${worst.axis}=${worst.coord} lands ${worst.off.toFixed(3)}px off, ${worst.lenDev.toFixed(2)}px of ink` : 'every edge on a pixel line',
      });
    } catch (e) { if (onError === 'throw') throw e; failed.push({ file: String(f), error: e.message }); }
  }
  const scored = rows.filter((r) => r.blur != null).sort((a, b) => b.blur - a.blur);
  const vals = scored.map((r) => r.blur);
  const q = (p) => (vals.length ? vals[Math.min(vals.length - 1, Math.floor(p * (vals.length - 1)))] : null);
  return {
    px, rate, n: rows.length, failed,
    unscored: rows.filter((r) => r.blur == null),
    rows: scored,
    blurriest: scored.slice(0, 20),
    crispest: scored.slice(-20).reverse(),
    stats: { max: vals[0] ?? null, p75: q(0.25), median: q(0.5), p25: q(0.75), min: vals.at(-1) ?? null, mean: vals.length ? sum(vals) / vals.length : null },
  };
}
