#!/usr/bin/env node
// plans/stroke-16.md, card 4 — the scripted batch. Moves the 16 master's OUTLINE drawings from a
// 1.5 stroke to 1.25 while every icon keeps the ink box it has today.
//
//   node tools/convert-16.mjs [--out <dir>] [--src <dir>] [--hand <paths.json>] [--hand-notes <notes.json>] [--apply]
//
// Without --apply it never writes into src/icons: the results go to --out (default:
// dist/convert-16/) together with report.json and report.md —
//   <out>/*.svg         the scripted batch (outlines)
//   <out>/hand/*.svg    the hand batch, written from --hand { "<name>": ["<d>", …] } (same comments,
//                       root 1.25, path d's replaced in order; --hand-notes { "<name>": "text" } optional)
//   <out>/filled/*.svg  shape-filled twins with NO stroked path: root stroke-width 1.5 -> 1.25 and
//                       nothing else (lint reads the root; nothing in them is drawn with it)
// --apply then copies all three into --src (src/icons/16). It refuses if anything failed to convert.
//
// The four construction rules (the plan's), as this script applies them:
//   1. an OUTER EDGE keeps its pixel      -> its centreline moves out 0.125 (rings, lenses, and a
//                                            straight line whose SIDE is the icon's ink edge: menu)
//   2. an OPEN STROKE keeps its ink end   -> the endpoint moves out 0.125 on every axis the stroke
//                                            runs along (both axes for a diagonal, so the round cap
//                                            keeps both of its outward extremes)
//   3. corner radii keep their centreline value; a MARK BEND takes C10's weight / 2 = 0.625, and
//      its vertex is SOLVED along the bend's axis so the bend's outer edge stays where it was —
//      the ink box is held and the leg angle gives (the plan's amendment to the proof)
//   4. interior centrelines stay put, so every gap gains 0.25
//   · a dot drawn as a tiny stroked circle gets r + 0.125: same ink, same centre
//   · an end that sits ON a ring's centreline (ban's slash, search's handle, globe's equator and
//     poles) follows the ring to its new radius on the same bearing — it is a joint, not an ink end
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { parsePath, bbox as sampledBbox } from './geometry.mjs';

const OLD = 1.5, NEW = 1.25, D = (OLD - NEW) / 2;      // 0.125
const BEND_OLD = OLD / 2, BEND_NEW = NEW / 2;          // C10
const MIN_GAP = 1.5, GLYPH_GAP = 1;
const FAIL = 0.005;
const DEFAULT_OUT = 'dist/convert-16/';   // dist/ is gitignored
const NOTE_BASE = '16 master at stroke 1.25 (C7, 2026-09-20): centrelines on the eighth grid so every ink edge stays where the 1.5 line had it';
const TOKEN = '@@CONVERT16-NOTE@@';
/** the ONE added comment: why the third decimals, plus whatever this file's prose says about 16 that is no longer true */
function noteLine(facts = [], extra = '') {
  const tail = (facts.length ? `. Measured at 16 now: ${facts.join(', ')} — supersedes the 16 figures above` : '') + (extra ? `. ${extra}` : '');
  if (tail.includes('--')) throw new Error('a comment may not contain "--"');
  return `<!-- ${NOTE_BASE}${tail} -->`;
}

const argv = process.argv.slice(2);
const arg = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const SRC = resolve(arg('--src', 'src/icons/16'));
const OUT = resolve(arg('--out', DEFAULT_OUT));
const HAND_FILE = arg('--hand', null), HAND_NOTES = arg('--hand-notes', null), APPLY = argv.includes('--apply');
if ((OUT + sep).includes(`${sep}src${sep}icons${sep}`)) { console.error('refusing to write inside src/icons'); process.exit(2); }
const SNAP = existsSync('plans/stroke-16.inkbox.json') ? JSON.parse(readFileSync('plans/stroke-16.inkbox.json', 'utf8')) : {};

// ── groups (the plan's census) ───────────────────────────────────────────────
const HAND = new Set(['help', 'help-2', 'help-3', 'help-4', 'info-2', 'info-3', 'alert-circle-2', 'alert-circle-4',
  'globe-2', 'search-3', 'arrow-up-4', 'arrow-down-4', 'arrow-left-4', 'arrow-right-4',
  'file', 'file-text', 'file-text-2', 'trash', 'trash-5']);
const GROUPS = [
  ['straight', /^(plus|minus|x)(-large|-small)?$|^menu(-[234])?$/],
  ['dots', /^more-(horizontal|vertical)$/],
  ['bend', /^chevron-(up|down|left|right)(-[23])?(-large|-small)?$|^check(-[234])?(-small)?$/],
  ['shaft+head', /^arrow-(up|down|left|right)(-[23])?$|^menu-arrow-(left|right)$/],
  ['ring+straight', /^(plus|minus|x)-circle(-small)?$|^clock$|^ban(-[23])?$|^alert-circle-3$|^search(-2)?$/],
  ['ring+check', /^check-circle(-[34])?(-small)?$/],
  ['ring+dot+stem', /^info$|^alert-circle$|^globe$/],
];
const groupOf = (n) => (HAND.has(n) ? 'hand' : (GROUPS.find(([, re]) => re.test(n)) || [null])[0]);

// ── numbers ──────────────────────────────────────────────────────────────────
const r3 = (n) => { const v = Math.round(n * 1000) / 1000; return Object.is(v, -0) ? 0 : v; };
const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;
const fmt = (n) => String(r3(n));
const deg = (rad) => (rad * 180) / Math.PI;

// ── path <-> absolute segments ───────────────────────────────────────────────
function toSegs(d) {
  const segs = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase(), up = cmd.toUpperCase();
    const step = { M: 2, L: 2, H: 1, V: 1, A: 7, Z: 0 }[up];
    if (step === undefined) throw new Error(`unsupported command ${cmd}`);
    if (up === 'Z') { segs.push({ c: 'Z', src: cmd }); cx = sx; cy = sy; continue; }
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M' || up === 'L') {
        const x = rel ? cx + a[0] : a[0], y = rel ? cy + a[1] : a[1];
        const first = up === 'M' && k === 0;
        segs.push({ c: first ? 'M' : 'L', x, y, src: first ? cmd : (up === 'M' ? (rel ? 'l' : 'L') : cmd) });
        if (first) { sx = x; sy = y; }
        cx = x; cy = y;
      } else if (up === 'H') { cx = rel ? cx + a[0] : a[0]; segs.push({ c: 'L', x: cx, y: cy, src: cmd }); }
      else if (up === 'V') { cy = rel ? cy + a[0] : a[0]; segs.push({ c: 'L', x: cx, y: cy, src: cmd }); }
      else if (up === 'A') {
        const x = rel ? cx + a[5] : a[5], y = rel ? cy + a[6] : a[6];
        segs.push({ c: 'A', rx: a[0], ry: a[1], rot: a[2], fa: a[3], fs: a[4], x, y, src: cmd });
        cx = x; cy = y;
      }
    }
  }
  return segs;
}

/** Re-emit with the source's own command letters (relative stays relative). */
function emit(segs) {
  let out = '', cx = 0, cy = 0, sx = 0, sy = 0;
  for (const s of segs) {
    if (s.c === 'Z') { out += s.src; cx = sx; cy = sy; continue; }
    const x = r3(s.x), y = r3(s.y), rel = s.src === s.src.toLowerCase(), up = s.src.toUpperCase();
    const px = rel && s.c !== 'M' ? r3(x - cx) : x, py = rel && s.c !== 'M' ? r3(y - cy) : y;
    if (s.c === 'M') { out += `${s.src}${fmt(x)} ${fmt(y)}`; sx = x; sy = y; }
    else if (s.c === 'A') out += `${s.src}${fmt(s.rx)} ${fmt(s.ry)} ${s.rot} ${s.fa} ${s.fs} ${fmt(px)} ${fmt(py)}`;
    else if (up === 'H' && y === cy) out += `${s.src}${fmt(px)}`;
    else if (up === 'V' && x === cx) out += `${s.src}${fmt(py)}`;
    else out += `${up === 'H' || up === 'V' ? 'L' : s.src}${fmt(up === 'H' || up === 'V' ? x : px)} ${fmt(up === 'H' || up === 'V' ? y : py)}`;
    cx = x; cy = y;
  }
  return out;
}

// ── exact geometry ───────────────────────────────────────────────────────────
const TAU = Math.PI * 2;
function arcParam(x1, y1, rx, ry, rot, fa, fs, x2, y2) {
  if (rot) throw new Error('rotated arc');
  rx = Math.abs(rx); ry = Math.abs(ry);
  const x1p = (x1 - x2) / 2, y1p = (y1 - y2) / 2;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fa !== fs ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cxp + (x1 + x2) / 2, cy = cyp + (y1 + y2) / 2;
  const t1 = Math.atan2((y1 - cy) / ry, (x1 - cx) / rx), t2 = Math.atan2((y2 - cy) / ry, (x2 - cx) / rx);
  let dt = t2 - t1;
  if (fs && dt < 0) dt += TAU;
  if (!fs && dt > 0) dt -= TAU;
  return { cx, cy, rx, ry, t1, dt };
}
const inSweep = (t, t1, dt) => { let a = ((t - t1) * Math.sign(dt || 1)) % TAU; if (a < -1e-12) a += TAU; return a <= Math.abs(dt) + 1e-9; };
const CARD = [[1, 0, 0], [0, 1, Math.PI / 2], [-1, 0, Math.PI], [0, -1, -Math.PI / 2]];   // y grows downward

function prims(segs) {
  const out = []; let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const s of segs) {
    if (s.c === 'M') { cx = sx = s.x; cy = sy = s.y; continue; }
    if (s.c === 'Z') { if (Math.hypot(cx - sx, cy - sy) > 1e-9) out.push({ t: 'line', a: [cx, cy], b: [sx, sy] }); cx = sx; cy = sy; continue; }
    if (s.c === 'L') out.push({ t: 'line', a: [cx, cy], b: [s.x, s.y] });
    else out.push({ t: 'arc', a: [cx, cy], b: [s.x, s.y], ...arcParam(cx, cy, s.rx, s.ry, s.rot, s.fa, s.fs, s.x, s.y) });
    cx = s.x; cy = s.y;
  }
  return out;
}
/** Exact centreline box: line ends, arc ends, and every cardinal extreme inside an arc's sweep. */
function exactBox(segList) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (const segs of segList) {
    const m = segs.find((s) => s.c === 'M'); if (m) add(m.x, m.y);
    for (const p of prims(segs)) {
      add(...p.a); add(...p.b);
      if (p.t === 'arc') for (const [ux, uy, t] of CARD) if (inSweep(t, p.t1, p.dt)) add(p.cx + ux * p.rx, p.cy + uy * p.ry);
    }
  }
  return { x0, y0, x1, y1 };
}
const grow = (b, h) => ({ x0: b.x0 - h, y0: b.y0 - h, x1: b.x1 + h, y1: b.y1 + h });
const EDGES = ['x0', 'y0', 'x1', 'y1'];

function pointAt(p, u) {                 // u in 0..1
  if (p.t === 'line') return [p.a[0] + (p.b[0] - p.a[0]) * u, p.a[1] + (p.b[1] - p.a[1]) * u];
  const t = p.t1 + p.dt * u; return [p.cx + Math.cos(t) * p.rx, p.cy + Math.sin(t) * p.ry];
}
const primLen = (p) => (p.t === 'line' ? Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1]) : Math.abs(p.dt) * Math.max(p.rx, p.ry));
function sample(ps, step = 0.004) {
  const pts = [];
  for (const p of ps) { const n = Math.max(1, Math.ceil(primLen(p) / step)); for (let i = 0; i <= n; i++) pts.push(pointAt(p, i / n)); }
  return pts;
}
function distSeg(q, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy;
  const u = L ? Math.max(0, Math.min(1, ((q[0] - a[0]) * vx + (q[1] - a[1]) * vy) / L)) : 0;
  return Math.hypot(q[0] - a[0] - vx * u, q[1] - a[1] - vy * u);
}
function distPrim(q, p) {
  if (p.t === 'line') return distSeg(q, p.a, p.b);
  if (Math.abs(p.rx - p.ry) < 1e-9) {
    const t = Math.atan2(q[1] - p.cy, q[0] - p.cx);
    if (inSweep(t, p.t1, p.dt)) return Math.abs(Math.hypot(q[0] - p.cx, q[1] - p.cy) - p.rx);
    return Math.min(Math.hypot(q[0] - p.a[0], q[1] - p.a[1]), Math.hypot(q[0] - p.b[0], q[1] - p.b[1]));
  }
  p.poly ??= Array.from({ length: 2049 }, (_, i) => pointAt(p, i / 2048));      // an ellipse: fine polyline
  let m = Infinity; for (let i = 1; i < p.poly.length; i++) m = Math.min(m, distSeg(q, p.poly[i - 1], p.poly[i]));
  return m;
}
const distToPath = (q, ps) => ps.reduce((m, p) => Math.min(m, distPrim(q, p)), Infinity);
/** Nearest approach of two centrelines (both directions sampled, the other side exact). */
function pathDist(A, B) {
  let m = Infinity;
  for (const q of sample(A)) m = Math.min(m, distToPath(q, B));
  for (const q of sample(B)) m = Math.min(m, distToPath(q, A));
  return m;
}

// ── classification of one path ───────────────────────────────────────────────
function kindOf(segs) {
  const sig = segs.map((s) => s.c).join('');
  if (sig === 'MAAZ') {
    const [, a1, a2] = segs;
    if (a1.rx === a2.rx && a1.ry === a2.ry) return a1.rx === a1.ry ? 'circle' : 'ellipse';
  }
  if (sig === 'MLAL') return 'bend';
  if (/^ML+$/.test(sig)) return 'poly';
  return 'other';
}
const circleOf = (segs) => ({ cx: (segs[0].x + segs[1].x) / 2, cy: (segs[0].y + segs[1].y) / 2, r: segs[1].rx, ry: segs[1].ry });

// ── the routines ─────────────────────────────────────────────────────────────
/** rule 1 for a closed circle (ring, lens) and the dot rule: r + 0.125 about the same centre. */
function growCircle(segs, dRx = D, dRy = D) {
  const { cx, cy } = circleOf(segs);
  return segs.map((s) => {
    if (s.c === 'Z') return { ...s };
    const o = { ...s };
    if (s.c === 'A') { o.rx = s.rx + dRx; o.ry = s.ry + dRy; }
    // the two anchor points sit on one axis through the centre; push them out along it
    const vx = s.x - cx, vy = s.y - cy, L = Math.hypot(vx, vy);
    const dr = Math.abs(vx) > Math.abs(vy) ? dRx : dRy;
    o.x = cx + (vx / L) * (L + dr); o.y = cy + (vy / L) * (L + dr);
    return o;
  });
}

/** rule 2: move an end out 0.125 on every axis the stroke runs along. */
function extendEnd(end, next) {
  const vx = end.x - next.x, vy = end.y - next.y, L = Math.hypot(vx, vy);
  return { x: end.x + (Math.abs(vx) / L > 0.05 ? Math.sign(vx) * D : 0), y: end.y + (Math.abs(vy) / L > 0.05 ? Math.sign(vy) * D : 0) };
}
/** an end sitting on a ring's centreline is a joint: same bearing, the ring's new radius, never past it */
function onRing(pt, rings) {
  return rings.find((r) => Math.abs(Math.hypot(pt.x - r.cx, pt.y - r.cy) - r.r) < 0.011);
}
function followRing(pt, ring) {
  const vx = pt.x - ring.cx, vy = pt.y - ring.cy, L = Math.hypot(vx, vy), R = ring.r + D;
  const inward = (v, c) => { const k = Math.round(v * 1e6) / 1e6; return (v < c ? Math.ceil(k * 1000 - 1e-6) : Math.floor(k * 1000 + 1e-6)) / 1000; };
  return { x: inward(ring.cx + (vx / L) * R, ring.cx), y: inward(ring.cy + (vy / L) * R, ring.cy) };
}

function convertPoly(segs, rings, notes) {
  const out = segs.map((s) => ({ ...s }));
  const ends = [[0, 1], [out.length - 1, out.length - 2]];
  for (const [i, j] of ends) {
    const ring = onRing(segs[i], rings);
    if (ring) { Object.assign(out[i], followRing(segs[i], ring)); notes.push(`end ${segs[i].x},${segs[i].y} sits on the ring's centreline: follows the ring to r ${ring.r + D} on the same bearing (a joint, not an ink end)`); }
    else Object.assign(out[i], extendEnd(segs[i], segs[j]));
  }
  return out;
}

/** a leg's angle off the line square to the bend's axis, so a left chevron reads like a down one */
const legAngle = (a, b, horizontalAxis) => (horizontalAxis ? deg(Math.atan2(Math.abs(b.x - a.x), Math.abs(b.y - a.y))) : deg(Math.atan2(Math.abs(b.y - a.y), Math.abs(b.x - a.x))));
function intersect(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  const a = p1.x * p2.y - p1.y * p2.x, b = p3.x * p4.y - p3.y * p4.x;
  return { x: (a * (p3.x - p4.x) - (p1.x - p2.x) * b) / d, y: (a * (p3.y - p4.y) - (p1.y - p2.y) * b) / d };
}
function bendGeometry(E1, E2, V, r) {
  const u = (E) => { const L = Math.hypot(E.x - V.x, E.y - V.y); return { x: (E.x - V.x) / L, y: (E.y - V.y) / L, L }; };
  const u1 = u(E1), u2 = u(E2);
  const theta = Math.acos(Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y)));
  const bl = Math.hypot(u1.x + u2.x, u1.y + u2.y), b = { x: (u1.x + u2.x) / bl, y: (u1.y + u2.y) / bl };
  const t = r / Math.tan(theta / 2), h = r / Math.sin(theta / 2);
  return { theta, b, t, u1, u2, C: { x: V.x + b.x * h, y: V.y + b.y * h },
    T1: { x: V.x + u1.x * t, y: V.y + u1.y * t }, T2: { x: V.x + u2.x * t, y: V.y + u2.y * t } };
}

/** the bend routine: sharp skeleton back from the shipped path, ends by rule 2, bend re-cut at 0.625,
 *  vertex solved along the bend's axis so the bend's outer ink edge does not move. */
function convertBend(segs, notes) {
  const [M, L1, A, L2] = segs;
  const E1 = M, T1 = L1, T2 = A, E2 = L2;
  if (Math.abs(A.rx - BEND_OLD) > 1e-9 || A.rx !== A.ry) notes.push(`shipped bend radius is ${A.rx}, not C10's ${BEND_OLD}`);
  const V = intersect(E1, T1, E2, T2);
  const arc = arcParam(T1.x, T1.y, A.rx, A.ry, A.rot, A.fa, A.fs, T2.x, T2.y);
  const cards = CARD.filter(([, , t]) => inSweep(t, arc.t1, arc.dt) && !(Math.abs(((t - arc.t1) % TAU)) < 1e-9));
  if (cards.length !== 1) throw new Error(`bend spans ${cards.length} cardinal directions — cannot pick one axis`);
  const [cxu, cyu] = cards[0];
  const oldExt = (arc.cx + cxu * arc.rx) * cxu + (arc.cy + cyu * arc.ry) * cyu;   // signed position on the axis
  const target = oldExt + D;                                                       // ink edge = ext + w/2 held
  const N1 = extendEnd(E1, T1), N2 = extendEnd(E2, T2);
  const ext = (dl) => { const g = bendGeometry(N1, N2, { x: V.x + cxu * dl, y: V.y + cyu * dl }, BEND_NEW); return (g.C.x * cxu + g.C.y * cyu) + BEND_NEW; };
  let lo = -1, hi = 1;
  if (!(ext(lo) < target && ext(hi) > target)) throw new Error('bend solve out of range');
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (ext(mid) < target) lo = mid; else hi = mid; }
  const dl = (lo + hi) / 2, Vn = { x: V.x + cxu * dl, y: V.y + cyu * dl };
  const g = bendGeometry(N1, N2, Vn, BEND_NEW);
  // the axis must still fall inside the new arc, and the legs must be longer than the tangent length
  const off = Math.acos(Math.max(-1, Math.min(1, -(g.b.x * cxu + g.b.y * cyu))));
  if (off > (Math.PI - g.theta) / 2 + 1e-9) throw new Error('bend axis falls outside the new arc');
  if (g.t >= g.u1.L || g.t >= g.u2.L) throw new Error('leg shorter than the tangent length');
  const out = [{ ...M, ...N1 }, { ...L1, ...g.T1 }, { ...A, rx: BEND_NEW, ry: BEND_NEW, ...g.T2 }, { ...L2, ...N2 }];
  const w = out.map((s) => ({ x: r3(s.x), y: r3(s.y) }));                          // as written
  // a mark that was a mirror image of itself must still be one after rounding
  const k = cxu ? 'y' : 'x', sum = (a, b) => a[k] + b[k];
  if (Math.abs(sum(E1, E2) - sum(T1, T2)) < 1e-9 && Math.abs(sum(w[0], w[3]) - sum(w[1], w[2])) > 1e-9) notes.push('was mirror-symmetric, is not after rounding');
  const old0 = bendGeometry(E1, E2, V, A.rx);
  const legs = {
    axis: cxu ? (cxu > 0 ? 'right' : 'left') : (cyu > 0 ? 'down' : 'up'),
    vertexOld: [r4(V.x), r4(V.y)], vertexNew: [r4(Vn.x), r4(Vn.y)], vertexMoved: r4(dl),
    cornerOld: r2(deg(old0.theta)), cornerNew: r2(deg(g.theta)),
    leg1: { old: r2(legAngle(E1, T1, !!cxu)), new: r2(legAngle(w[0], w[1], !!cxu)) },
    leg2: { old: r2(legAngle(E2, T2, !!cxu)), new: r2(legAngle(w[3], w[2], !!cxu)) },
  };
  legs.leg1.change = r2(legs.leg1.new - legs.leg1.old); legs.leg2.change = r2(legs.leg2.new - legs.leg2.old);
  legs.maxChange = Math.max(Math.abs(legs.leg1.change), Math.abs(legs.leg2.change));
  return { out, legs };
}

// ── checks shared by the scripted and the hand batch ─────────────────────────
/** the guard's method: sampled bbox + half the root stroke, 2 dp, against the snapshot's x y w h */
function guardCheck(name, newDs) {
  const sb = sampledBbox(newDs), h = NEW / 2;
  const ink = { x: r2(sb.x0 - h), y: r2(sb.y0 - h), w: r2(sb.x1 - sb.x0 + NEW), h: r2(sb.y1 - sb.y0 + NEW) };
  const snapshot = SNAP[name] || null;
  const diff = snapshot ? Math.max(...['x', 'y', 'w', 'h'].map((k) => Math.abs(ink[k] - snapshot[k]))) : null;
  return { ink, snapshot, maxDiff: diff == null ? null : r4(diff), pass: diff == null ? null : diff <= 0.011 };
}
/** gaps, edge to edge, every pair of paths: old at 1.5, new at 1.25 */
function gapPairs(src, old, written) {
  const isGlyph = /<!--\s*glyph:\s*dot\s*-->/.test(src);
  const oP = old.map(prims), nP = written.map(prims), inkOld = grow(exactBox(old), OLD / 2);
  const shell = old.findIndex((s) => EDGES.every((e) => Math.abs(grow(exactBox([s]), OLD / 2)[e] - inkOld[e]) < 0.01));
  const dotLike = (i) => kindOf(old[i]) === 'circle' && circleOf(old[i]).r <= 1.5;
  const gaps = [];
  for (let i = 0; i < old.length; i++) for (let j = i + 1; j < old.length; j++) {
    const go = pathDist(oP[i], oP[j]) - OLD, gn = pathDist(nP[i], nP[j]) - NEW;
    const glyphPair = isGlyph && dotLike(i) !== dotLike(j) && i !== shell && j !== shell;
    const floor = glyphPair ? GLYPH_GAP : MIN_GAP;
    const joined = go <= 0.001;
    const flag = joined ? null : (gn < floor - 1e-6 ? (go < floor - 1e-6 ? 'below floor (already was)' : 'BELOW FLOOR') : (gn < go - 1e-6 ? 'SHRANK' : null));
    gaps.push({ paths: [i + 1, j + 1], old: r4(go), new: r4(gn), floor, joined, glyphPair, flag });
  }
  return gaps;
}
const plainPaths = (src) => {
  const ds = [...src.matchAll(/<path d="([^"]+)"\/>/g)].map((m) => m[1]);
  if (ds.length !== (src.match(/<path /g) || []).length) throw new Error('a <path> is not a plain stroked d="…" element');
  if (!/<svg[^>]* stroke-width="1\.5"/.test(src)) throw new Error('root stroke-width is not 1.5');
  return ds;
};
/** root weight, new d's in order, the one comment line before the first path — nothing else changes */
function rewrite(src, newDs, comment) {
  let body = src.replace(/(<svg[^>]* stroke-width=")1\.5(")/, `$1${NEW}$2`);
  let k = 0; body = body.replace(/<path d="[^"]+"\/>/g, () => `<path d="${newDs[k++]}"/>`);
  const lines = body.split('\n'), firstPath = lines.findIndex((l) => l.includes('<path '));
  lines.splice(firstPath, 0, `  ${comment}`);
  return lines.join('\n');
}

// ── one file ─────────────────────────────────────────────────────────────────
function convertFile(name, src) {
  const notes = [];
  const ds = plainPaths(src);
  const old = ds.map(toSegs);
  old.forEach((s, i) => { if (emit(s) !== ds[i]) notes.push(`path ${i + 1}: re-emitting the source unchanged gives "${emit(s)}", not byte-identical`); });
  const kinds = old.map(kindOf);
  const rings = old.filter((_, i) => kinds[i] === 'circle').map(circleOf).filter((c) => c.r > 1.5);
  let legs = null;
  let neu = old.map((segs, i) => {
    const k = kinds[i];
    if (k === 'circle') return growCircle(segs);
    if (k === 'ellipse') {
      const e = circleOf(segs), ring = rings.find((r) => Math.abs(r.cx - e.cx) < 1e-9 && Math.abs(r.cy - e.cy) < 1e-9);
      const polesY = ring && Math.abs(e.ry - ring.r) < 1e-9, polesX = ring && Math.abs(e.r - ring.r) < 1e-9;
      if (!polesX && !polesY) throw new Error(`path ${i + 1}: an ellipse that does not reach the ring — hand batch`);
      notes.push(`path ${i + 1}: meridian ellipse — the radius that reaches the ring follows it (+${D}); the interior radius ${polesY ? e.r : e.ry} stays (rule 4)`);
      return growCircle(segs, polesX ? D : 0, polesY ? D : 0);
    }
    if (k === 'poly') return convertPoly(segs, rings, notes);
    if (k === 'bend') { const r = convertBend(segs, notes); (legs ??= []).push({ path: i + 1, ...r.legs }); return r.out; }
    throw new Error(`path ${i + 1}: shape "${segs.map((s) => s.c).join('')}" fits no routine`);
  });

  // rule 1 for straight lines: where a stroke's SIDE is the icon's ink edge (menu's top and bottom
  // line), thinning pulls the edge in — move that line out 0.125. If one line sets both opposite
  // edges (minus) nothing can hold them: the ink is the line's own thickness.
  const inkOld = grow(exactBox(old), OLD / 2);
  const round = (segs) => segs.map((s) => (s.c === 'Z' ? s : { ...s, x: r3(s.x), y: r3(s.y) }));
  const unfixable = [], translated = new Set();
  for (const e of EDGES) {
    const dev = grow(exactBox(neu.map(round)), NEW / 2)[e] - inkOld[e];
    if (Math.abs(dev) <= FAIL) continue;
    const opp = { x0: 'x1', x1: 'x0', y0: 'y1', y1: 'y0' }[e], ax = e[0];
    const setters = old.map((s, i) => [i, grow(exactBox([s]), OLD / 2)]).filter(([, b]) => Math.abs(b[e] - inkOld[e]) < 1e-9);
    for (const [i, b] of setters) {
      if (kinds[i] !== 'poly') continue;
      if (Math.abs(b[opp] - inkOld[opp]) < 1e-9 && Math.abs((b[opp] - b[e]) * Math.sign(b[opp] - b[e]) - OLD) < 1e-9) { unfixable.push(e); continue; }
      neu[i] = neu[i].map((s) => (s.c === 'Z' ? s : { ...s, [ax]: s[ax] - dev }));
      translated.add(i);
      notes.push(`path ${i + 1}: its SIDE is the icon's ${e} ink edge, so rule 1 applies — moved ${r3(-dev)} on ${ax} to keep that edge`);
    }
  }
  if (unfixable.length) notes.push(`ink edge(s) ${unfixable.join(', ')} are the two sides of ONE line: the ink there is the line's own thickness (${OLD} -> ${NEW}); no construction can hold it`);

  const newDs = neu.map(emit);
  const written = newDs.map(toSegs);

  // ── verification ──
  const inkNew = grow(exactBox(written), NEW / 2);
  const dev = Object.fromEntries(EDGES.map((e) => [e, r4(inkNew[e] - inkOld[e])]));
  const maxDev = Math.max(...EDGES.map((e) => Math.abs(inkNew[e] - inkOld[e])));

  // per path: every ink edge either holds or (a stroke's side) comes in by exactly 0.125
  const perPath = old.map((s, i) => {
    const a = grow(exactBox([s]), OLD / 2), b = grow(exactBox([written[i]]), NEW / 2);
    return Object.fromEntries(EDGES.map((e) => [e, r4((b[e] - a[e]) * (e[1] === '0' ? 1 : -1))]));   // + = inward
  });
  perPath.forEach((pp, i) => EDGES.forEach((e) => {
    if (Math.abs(pp[e]) > 0.0015 && Math.abs(pp[e] - D) > 0.0015 && !(translated.has(i) && Math.abs(pp[e] - 2 * D) < 0.0015) && !(kinds[i] === 'poly' && (onRing(old[i][0], rings) || onRing(old[i].at(-1), rings))))
      notes.push(`path ${i + 1}: ink edge ${e} moved ${pp[e]} inward — neither held nor a plain side`);
  }));

  const oP = old.map(prims), nP = written.map(prims);
  const gaps = gapPairs(src, old, written);

  // how far did the old centreline end up from the new one (old -> new, so an end EXTENSION counts 0)
  const interior = old.map((s, i) => {
    const buried = (q) => kinds[i] !== 'circle' && rings.some((r) => Math.abs(Math.hypot(q[0] - r.cx, q[1] - r.cy) - r.r) < OLD / 2 + D);   // inside the ring's ink
    let m = 0, n = 0;
    for (const q of sample(oP[i], 0.01)) if (!buried(q)) m = Math.max(m, distToPath(q, nP[i]));
    for (const q of sample(nP[i], 0.01)) if (!buried(q)) n = Math.max(n, distToPath(q, oP[i]));
    // oldToNew: how far the old line is from the new one (an end extension counts 0; a bend's apex
    // counts 0.125 because its outer edge is held, like a ring). newToOld: how far the new line
    // strays from the old (a diagonal end extension is 0.177; new ink stays inside old ink up to 0.125).
    return { path: i + 1, kind: kinds[i], oldToNew: r4(m), newToOld: r4(n) };
  });

  // numbers off the eighth grid, and whether the shipped number in the same place was off-grid too
  // numbers off the eighth grid, by where they come from: a bend's tangent points (off-grid by
  // construction, C10), a number whose shipped value was already off the quarter grid (that value
  // +/- 0.125), or anything else (a joint on a ring, the dot radius)
  const numsOf = (d, kind) => toSegs(d).flatMap((s, j) => (s.c === 'Z' ? [] : (s.c === 'A' ? [s.rx, s.ry, s.x, s.y] : [s.x, s.y]).map((v) => [v, kind === 'bend' && (j === 1 || j === 2)])));
  const on = (v, g) => Math.abs(v / g - Math.round(v / g)) < 1e-9;
  const offGrid = { numbers: 0, total: 0, tangent: 0, inherited: 0, other: 0 };
  ds.forEach((d, i) => { const a = numsOf(d, kinds[i]), b = numsOf(newDs[i], kinds[i]); b.forEach(([v, tan], k) => { offGrid.numbers++; if (on(v, 0.125)) return; offGrid.total++; if (tan) offGrid.tangent++; else if (!on(a[k][0], 0.25)) offGrid.inherited++; else offGrid.other++; }); });

  const body = rewrite(src, newDs, TOKEN);      // the comment is filled in once the file's stale figures are measured

  return { body, kinds, paths: { old: ds, new: newDs }, ink: { old: boxOut(inkOld), new: boxOut(inkNew) }, dev, maxDev: r4(maxDev),
    status: maxDev > FAIL ? 'FAIL' : 'ok', guard: guardCheck(name, newDs),
    legs, offGrid, perPathInkEdgeMovedInward: perPath, gaps, interior, notes };
}
const boxOut = (b) => ({ x0: r4(b.x0), y0: r4(b.y0), x1: r4(b.x1), y1: r4(b.y1), w: r4(b.x1 - b.x0), h: r4(b.y1 - b.y0) });

// ── comments that state a 16-master number the conversion makes false ────────
/** an exact constructed value prints as it is (6.375); a measured one at 2 dp */
const fact = (v) => (Math.abs(v * 8 - Math.round(v * 8)) < 1e-9 ? String(r3(v)) : v.toFixed(2));
/** an angle at 1 dp, or 2 dp when the change is under 0.1 deg and would otherwise vanish */
const ang = (l) => `${Math.abs(l.change) < 0.1 ? l.new.toFixed(2) : l.new.toFixed(1)}°`;
const segLen = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

/** `report`: prose for report.md. `facts`: what goes into the file's one added comment line —
 *  only figures the file's own comments state and the conversion changed, all measured here. */
function staleComments(name, src, r) {
  const text = [...src.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1]).filter((c) => !/^\s*(tags|glyph|keyline|optical):/.test(c)).join(' ');
  const report = [], facts = [];
  const add = (rep, f) => { report.push(rep); facts.push(f); };
  const gap = (i, j) => r.gaps.find((g) => g.paths[0] === i && g.paths[1] === j);
  const N = r.paths.new.map(toSegs);
  if (r.legs && /(\d+)° legs|legs? ~?(\d+)°|leg ~?(\d+)°/.test(text)) {
    const l = r.legs[0], same = l.leg1.new === l.leg2.new;
    add(`states a leg angle ("${text.match(/(\d+° legs|short leg \d+°, long leg ~\d+°|legs? ~?\d+°)/)[0]}") — at 16 the legs now measure ${l.leg1.new}° / ${l.leg2.new}° (were ${l.leg1.old}° / ${l.leg2.old}° as shipped)`,
      same ? `legs ${ang(l.leg1)}` : `legs ${ang(l.leg1)} / ${ang(l.leg2)}`);
  }
  if (/reach \.75 past each endpoint/.test(text)) add('"round caps reach .75 past each endpoint" — at 16 they now reach 0.625', `caps reach ${fact(NEW / 2)} past each endpoint`);
  if (/^menu(-[234])?$/.test(name)) { const m = text.match(/gap (\d+(\.\d+)?)/); const g = gap(1, 2); if (m && g && Math.abs(g.new - Number(m[1])) > 0.001) add(`"gap ${m[1]}" — the ink gap between lines at 16 measured ${g.old}, now ${g.new} (C17's fixed menu gap is stated for every master)`, `line gap ${fact(g.new)}`); }
  if (/^check-circle/.test(name)) { const m = text.match(/([\d.]+) · ([\d.]+) · ([\d.]+) clear/); const g = gap(1, 2); if (m && g) add(`"${m[0]}" — the 16 figure (${m[3]}): check-to-ring edge gap measured ${g.old} at 1.5, now ${g.new}`, `check-to-ring clearance ${fact(g.new)}`); }
  if (name === 'ban-3' && /half-length/.test(text)) { const h = segLen(N[1][0], N[1][1]) / 2; add(`"half-length 6 / 4.125 / 3.125" — the 16 bar's centreline half-length is now ${r4(h)}`, `bar half-length ${fact(h)}`); }
  if (name === 'clock' && /Hands/.test(text)) { const a = segLen(N[1][0], N[1][1]), b = segLen(N[1][1], N[1][2]); add(`"Hands … 3.25 / 2.12" — at 16 now ${r4(a)} / ${r4(b)}; and "corner radius is stroke / 2 = 0.75" is 0.625 at 16`, `hands ${fact(a)} / ${fact(b)}, join radius ${fact(NEW / 2)}`); }
  if (name === 'info' && /stem grows to/.test(text)) { const l = segLen(N[2][0], N[2][1]); add(`"the stem grows to 6.5 · 4.5 · 3" — the 16 stem centreline is now ${r4(l)} (ink 4.5 unchanged)`, `stem ${fact(l)} (ink unchanged)`); }
  if (name === 'globe' && /r 9\.25 · 7\.25 · 6\.25/.test(text)) add(`"r 9.25 · 7.25 · 6.25" — the 16 circle is now r ${N[0][1].rx} (rx 2.5 still true)`, `circle r ${fact(N[0][1].rx)}`);
  if (/^search(-2)?$/.test(name) && /Lens r/.test(text)) add(`"${text.match(/Lens r [\d.]+ · [\d.]+ · [\d.]+/)[0]}" — the 16 lens is now r ${N[0][1].rx}`, `lens r ${fact(N[0][1].rx)}`);
  return { report, facts };
}

// ── run ──────────────────────────────────────────────────────────────────────
const files = readdirSync(SRC).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).sort();
if (!files.some((f) => /<svg[^>]* stroke-width="1\.5"/.test(readFileSync(join(SRC, f), 'utf8')))) {
  console.error(`no outline in ${SRC} is still at stroke 1.5 — already converted? Nothing written.`); process.exit(3);
}
mkdirSync(OUT, { recursive: true });
const report = {}, noGroup = [];
for (const f of files) {
  const name = f.replace('.svg', ''), group = groupOf(name);
  const src = readFileSync(join(SRC, f), 'utf8');
  const twin = existsSync(join(SRC, `${name}-filled.svg`)) ? readFileSync(join(SRC, `${name}-filled.svg`), 'utf8') : null;
  const filled = twin == null ? 'none' : (/<path[^>]* fill="currentColor"/.test(twin) ? 'shape' : 'line');
  if (!group) { noGroup.push(name); report[name] = { group: null, status: 'no group', filled }; continue; }
  if (group === 'hand') { report[name] = { group, status: 'skipped (hand batch)', filled }; continue; }
  try {
    const r = convertFile(name, src);
    const stale = staleComments(name, src, r), comment = noteLine(stale.facts);
    writeFileSync(join(OUT, f), r.body.replace(TOKEN, comment));
    const { body, ...rest } = r;
    report[name] = { group, filled, ...rest, staleComments: stale.report, addedComment: comment };
  } catch (e) { report[name] = { group, status: 'unconverted', filled, notes: [e.message] }; }
}

// ── the hand batch: drawn elsewhere, written and checked here ────────────────
const handErrors = [];
if (HAND_FILE) {
  const drawn = JSON.parse(readFileSync(HAND_FILE, 'utf8'));
  const handNotes = HAND_NOTES && existsSync(HAND_NOTES) ? JSON.parse(readFileSync(HAND_NOTES, 'utf8')) : {};
  mkdirSync(join(OUT, 'hand'), { recursive: true });
  for (const [name, newDs] of Object.entries(drawn)) {
    const prev = report[name] || {};
    try {
      if (groupOf(name) !== 'hand') throw new Error('not in the hand batch — the scripted batch owns this file');
      const src = readFileSync(join(SRC, `${name}.svg`), 'utf8'), ds = plainPaths(src);
      if (!Array.isArray(newDs) || newDs.length !== ds.length) throw new Error(`path count: the file has ${ds.length}, --hand gives ${Array.isArray(newDs) ? newDs.length : 'no list'}`);
      newDs.forEach((d, i) => { if (typeof d !== 'string' || !/^M/.test(d.trim()) || /["<>]/.test(d)) throw new Error(`path ${i + 1} is not a path string`); });
      const rec = { group: 'hand', filled: prev.filled, paths: { old: ds, new: newDs }, guard: guardCheck(name, newDs), notes: [] };
      try {          // exact box and gaps where the paths are lines and unrotated arcs; the guard's method always
        const old = ds.map(toSegs), written = newDs.map(toSegs);
        const a = grow(exactBox(old), OLD / 2), b = grow(exactBox(written), NEW / 2);
        rec.ink = { old: boxOut(a), new: boxOut(b) };
        rec.dev = Object.fromEntries(EDGES.map((e) => [e, r4(b[e] - a[e])]));
        rec.maxDev = r4(Math.max(...EDGES.map((e) => Math.abs(b[e] - a[e]))));
        rec.gaps = gapPairs(src, old, written);
        const off = newDs.flatMap((d) => toSegs(d).flatMap((s) => (s.c === 'Z' ? [] : s.c === 'A' ? [s.rx, s.ry, s.x, s.y] : [s.x, s.y]))).filter((v) => Math.abs(v * 8 - Math.round(v * 8)) > 1e-9);
        rec.offEighthGrid = [...new Set(off)];
      } catch (e) { rec.notes.push(`exact measure skipped (${e.message}); judged by the guard's method only`); }
      const bad = (rec.maxDev ?? 0) > FAIL || rec.guard.pass === false;
      rec.status = bad ? 'hand FAIL' : 'hand ok';
      rec.addedComment = noteLine([], handNotes[name] || '');
      writeFileSync(join(OUT, 'hand', `${name}.svg`), rewrite(src, newDs, rec.addedComment));
      report[name] = rec;
    } catch (e) { handErrors.push(`${name}: ${e.message}`); report[name] = { ...prev, group: 'hand', status: 'hand ERROR', notes: [e.message] }; }
  }
}

// ── shape-filled twins: the root weight only ─────────────────────────────────
// Lint reads the root stroke-width of every file at 16. A shape-filled file whose paths are all
// fill=… stroke="none" draws nothing with it, so the root flips and not one other byte changes.
// A file with a stroked path (arrow-*-4-filled) is hand work and is listed, not written.
const filledRoots = { written: [], skippedStroked: [], untouchedWeight2: 0 };
mkdirSync(join(OUT, 'filled'), { recursive: true });
for (const f of readdirSync(SRC).filter((x) => x.endsWith('-filled.svg')).sort()) {
  const src = readFileSync(join(SRC, f), 'utf8');
  if (!/<svg[^>]* stroke-width="1\.5"/.test(src)) { filledRoots.untouchedWeight2++; continue; }
  const paths = src.match(/<path [^>]*>/g) || [], other = (src.match(/<(rect|circle|ellipse|line|polyline|polygon) /g) || []).length;
  const stroked = paths.filter((p) => !(/ fill="[^"]+"/.test(p) && / stroke="none"/.test(p))).length + other;
  if (stroked || !paths.length) { filledRoots.skippedStroked.push({ file: f, strokedPaths: stroked }); continue; }
  const out = src.replace(/(<svg[^>]* stroke-width=")1\.5(")/, `$1${NEW}$2`);
  if (out.length !== src.length + 1 || out.replace(/stroke-width="1\.25"/, 'stroke-width="1.5"') !== src) throw new Error(`${f}: more than the root attribute changed`);
  writeFileSync(join(OUT, 'filled', f), out);
  filledRoots.written.push(f);
}

// ── report.md ────────────────────────────────────────────────────────────────
const E = Object.entries(report);
const conv = E.filter(([, r]) => r.status === 'ok' || r.status === 'FAIL');
const md = [];
md.push('# convert-16 — scripted batch, stroke 1.5 → 1.25 at the 16 master', '');
md.push(`Source \`${SRC}\` · ${files.length} outline files · written ${conv.length} · output \`${OUT}\``, '');
md.push('## Totals per group', '', '| group | files | converted | ink box held | FAIL | skipped / unconverted |', '|---|--:|--:|--:|--:|--:|');
for (const g of [...GROUPS.map(([n]) => n), 'hand', null]) {
  const rows = E.filter(([, r]) => r.group === g); if (!rows.length) continue;
  const c = rows.filter(([, r]) => /^(hand )?(ok|FAIL)$/.test(r.status));
  md.push(`| ${g ?? 'no group'} | ${rows.length} | ${c.length} | ${c.filter(([, r]) => /ok$/.test(r.status)).length} | ${c.filter(([, r]) => /FAIL$/.test(r.status)).length} | ${rows.length - c.length} |`);
}
const worst = conv.filter(([, r]) => r.status === 'ok').sort((a, b) => b[1].maxDev - a[1].maxDev)[0];
const gBad = conv.filter(([, r]) => r.guard.pass === false);
md.push('', `Worst exact ink-box deviation among held files: **${worst?.[1].maxDev}** (${worst?.[0]}). `
  + `Guard method (sampled box + 0.625, 2 dp, vs plans/stroke-16.inkbox.json x/y/w/h): worst among held files ${Math.max(...conv.filter(([, r]) => r.status === 'ok').map(([, r]) => r.guard.maxDiff ?? 0))}; `
  + `${gBad.length} file(s) over the guard's 0.011${gBad.length ? ` — ${gBad.map(([n, r]) => `${n} (${r.guard.maxDiff})`).join(', ')}` : ''}. `
  + `Files with no snapshot entry: ${conv.filter(([, r]) => !r.guard.snapshot).map(([n]) => n).join(', ') || 'none'}.`);
const og = conv.reduce((a, [, r]) => { for (const k of Object.keys(a)) a[k] += r.offGrid[k]; return a; }, { numbers: 0, total: 0, tangent: 0, inherited: 0, other: 0 });
md.push('', `Numbers written: ${og.numbers}; off the eighth grid: ${og.total} — ${og.tangent} are bend tangent points (off-grid by construction, C10), ${og.inherited} replace a shipped 2-dp value that was itself off the quarter grid (bent-mark ends moved by 0.125, the dot radius 0.45 -> 0.575, a joint on a ring such as ban's 3.58 -> 3.493), ${og.other} are anything else. `
  + `Files with at least one: ${conv.filter(([, r]) => r.offGrid.total).length} of ${conv.length}.`);
const fails = conv.filter(([, r]) => r.status === 'FAIL');
md.push('', '## FAIL — ink box not held (> 0.005 on an edge)', '');
if (!fails.length) md.push('none');
for (const [n, r] of fails) md.push(`- **${n}**: ${EDGES.filter((e) => Math.abs(r.dev[e]) > FAIL).map((e) => `${e} ${r.dev[e] > 0 ? '+' : ''}${r.dev[e]}`).join(' · ')} — ${r.notes.at(-1)}`);
md.push('', '## Leg-angle changes (bent marks), largest first', '', '| file | axis | leg 1 old → new | leg 2 old → new | max change | corner old → new | vertex moved |', '|---|---|---|---|--:|---|--:|');
const bent = conv.filter(([, r]) => r.legs).flatMap(([n, r]) => r.legs.map((l) => [n, l])).sort((a, b) => b[1].maxChange - a[1].maxChange);
for (const [n, l] of bent) md.push(`| ${n} | ${l.axis} | ${l.leg1.old}° → ${l.leg1.new}° (${l.leg1.change >= 0 ? '+' : ''}${l.leg1.change}) | ${l.leg2.old}° → ${l.leg2.new}° (${l.leg2.change >= 0 ? '+' : ''}${l.leg2.change}) | ${l.maxChange}° | ${l.cornerOld}° → ${l.cornerNew}° | ${l.vertexMoved} |`);
md.push('', '## Gaps', '');
const flagged = conv.flatMap(([n, r]) => r.gaps.filter((g) => g.flag).map((g) => `- ${n} paths ${g.paths.join('/')}: ${g.old} → ${g.new} (floor ${g.floor}) — ${g.flag}`));
md.push(flagged.length ? flagged.join('\n') : 'No detached pair is below its floor and none shrank.');
const same = conv.flatMap(([n, r]) => r.gaps.filter((g) => !g.joined && Math.abs(g.new - g.old) < 1e-4).map((g) => `${n} ${g.paths.join('/')} (${g.new})`));
if (same.length) md.push('', `Unchanged rather than grown (both sides are held ink ends): ${same.join(', ')}.`);
md.push('', '## Not converted', '');
for (const [n, r] of E.filter(([, r]) => r.status === 'unconverted' || r.status === 'no group')) md.push(`- **${n}** (${r.group ?? 'no group'}): ${(r.notes || ['fits no group in the plan']).join('; ')}`);
const handLeft = E.filter(([, r]) => r.group === 'hand' && !/^hand (ok|FAIL)$/.test(r.status));
md.push(`- hand batch not written by this run (${handLeft.length})${handLeft.length ? `: ${handLeft.map(([n, r]) => `${n}${r.status === 'hand ERROR' ? ` — ERROR ${r.notes[0]}` : ''}`).join(', ')}` : ''}`);
const handDone = E.filter(([, r]) => /^hand (ok|FAIL)$/.test(r.status));
md.push('', '## Hand batch (--hand)', '');
if (!HAND_FILE) md.push('not given on this run.');
else {
  md.push(`${handDone.length} written to \`hand/\` from \`${HAND_FILE}\` · ink box held ${handDone.filter(([, r]) => r.status === 'hand ok').length} · FAIL ${handDone.filter(([, r]) => r.status === 'hand FAIL').length} · errors ${handErrors.length}`, '');
  md.push('| file | exact max dev | guard diff vs snapshot | gap flags | status |', '|---|--:|--:|---|---|');
  for (const [n, r] of handDone) md.push(`| ${n} | ${r.maxDev ?? 'n/a'} | ${r.guard.maxDiff} | ${(r.gaps || []).filter((g) => g.flag).map((g) => `${g.paths.join('/')}: ${g.old} → ${g.new} ${g.flag}`).join('; ') || '—'} | ${r.status} |`);
  for (const e of handErrors) md.push(`- ERROR ${e}`);
}
md.push('', '## Shape-filled roots (filled/)', '');
md.push(`${filledRoots.written.length} shape-filled files with no stroked path: root stroke-width 1.5 → 1.25, byte-identical otherwise (checked per file). `
  + `Skipped because a path is stroked — hand work (${filledRoots.skippedStroked.length}): ${filledRoots.skippedStroked.map((x) => x.file).join(', ') || 'none'}. Weight-2 line files left alone: ${filledRoots.untouchedWeight2}.`);
md.push('', '## Comments that state a 16 number the conversion changes', '');
const angleNotes = conv.filter(([, r]) => r.staleComments.some((s) => s.startsWith('states a leg angle')));
md.push(`- ${angleNotes.length} bent-mark files state a leg angle in prose ("45° legs", "legs ~34°", "legs ~52°"…) that is now off by the amount in the angle table above: ${angleNotes.map(([n]) => n).join(', ')}`);
for (const [n, r] of conv) for (const s of r.staleComments) if (!s.startsWith('states a leg angle')) md.push(`- ${n}: ${s}`);
md.push('', '## Shape-filled twins whose outline interior moved by more than an end extension (0.125)', '');
// Two measures, rings and dots left out (their ink is held by construction):
//   oldToNew > 0.13   the line itself moved sideways by more than a held outer edge moves (0.125)
//   newToOld > 0.18   the new line strays further from the old than a diagonal end extension (0.177)
const LIM_A = 0.13, LIM_B = 0.18;
const recut = conv.filter(([, r]) => r.filled === 'shape').map(([n, r]) => {
  const p = r.interior.filter((q) => q.kind !== 'circle');
  return [n, Math.max(0, ...p.map((q) => q.oldToNew)), Math.max(0, ...p.map((q) => q.newToOld))];
}).sort((a, b) => b[1] - a[1] || b[2] - a[2]);
const over = recut.filter(([, a, b]) => a > LIM_A || b > LIM_B);
md.push(`Shape-filled twins of converted files: ${recut.length}. Over the limits (old→new > ${LIM_A}, or new→old > ${LIM_B}): ${over.length ? '' : '**none**'}`);
for (const [n, a, b] of over) md.push(`- **${n}-filled**: old→new ${a}, new→old ${b}`);
md.push('', 'Largest moves among them (old→new · new→old). A bend\'s apex reads 0.125 by construction — its outer edge is held, exactly like a ring; a diagonal end extension reads 0.177 on new→old:', '');
for (const [n, a, b] of recut.filter(([, a, b]) => a > 0.0005 || b > D + 0.001)) md.push(`- ${n}: ${a} · ${b}`);
md.push('', '## Notes per file', '');
for (const [n, r] of conv) if (r.notes.length) md.push(`- ${n}: ${r.notes.join(' · ')}`);
md.push('');

report._filledRoots = filledRoots;
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 1));
writeFileSync(join(OUT, 'report.md'), md.join('\n'));
console.log(`${files.length} outline files · ${conv.length} written to ${OUT}`);
console.log(`held ${conv.filter(([, r]) => r.status === 'ok').length} · FAIL ${fails.length}${fails.length ? ` (${fails.map(([n]) => n).join(', ')})` : ''} · hand ${E.filter(([, r]) => r.group === 'hand').length} · unconverted ${E.filter(([, r]) => r.status === 'unconverted').length} · no group ${noGroup.length}`);
console.log(`worst held deviation ${worst?.[1].maxDev} (${worst?.[0]}) · gap flags ${flagged.length}`);
console.log(`hand: ${HAND_FILE ? `${handDone.length} written · held ${handDone.filter(([, r]) => r.status === 'hand ok').length} · FAIL ${handDone.filter(([, r]) => r.status === 'hand FAIL').map(([n]) => n).join(', ') || 0} · errors ${handErrors.length}` : 'not given'}`);
console.log(`filled roots: ${filledRoots.written.length} written · ${filledRoots.skippedStroked.length} skipped (stroked: ${filledRoots.skippedStroked.map((x) => x.file).join(', ') || '—'}) · ${filledRoots.untouchedWeight2} weight-2 files untouched`);
for (const e of handErrors) console.error(`HAND ERROR — ${e}`);

// ── --apply: the only path that writes into the tree ─────────────────────────
const broken = E.filter(([, r]) => r.status === 'unconverted' || r.status === 'no group').map(([n]) => n);
if (APPLY) {
  if (broken.length || handErrors.length) { console.error(`--apply refused: ${[...broken, ...handErrors].join('; ')}`); process.exit(1); }
  let n = 0;
  for (const dir of [OUT, join(OUT, 'hand'), join(OUT, 'filled')]) {
    if (!existsSync(dir)) continue;
    const fresh = new Set([...conv.map(([k]) => `${k}.svg`), ...handDone.map(([k]) => `${k}.svg`), ...filledRoots.written]);
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.svg') && fresh.has(x))) { writeFileSync(join(SRC, f), readFileSync(join(dir, f))); n++; }
  }
  console.log(`--apply: ${n} files copied into ${SRC}`);
}
if (handErrors.length) process.exit(1);
