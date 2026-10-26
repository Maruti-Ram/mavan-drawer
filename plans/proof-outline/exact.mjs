// exact-stroke: our own stroker, Skia PathOps for the union.
// Each subpath of lines and circular arcs becomes one raw contour, drawn the way a pen of radius h = w/2 sweeps it:
// left offset (a line stays a line, an arc of radius r stays an arc, radius r ∓ h), a round join of radius h at every
// vertex on both sides, round caps — all as SVG arcs, which Skia holds exactly as conics. PathOps resolves the contour
// under the nonzero rule (Simplify), the paths are unioned, and each conic is written back as an exact SVG arc.
// A closed circle with r ≤ h is a dot: written as a disc of radius r + h. Elliptical arcs and curves: Skia's stroker (approximate).
import { createRequire } from 'node:module';
import { normalise, arcPts } from './pathkit.mjs';
const require = createRequire(import.meta.url);
const rot = (v) => [-v[1], v[0]], add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k], unit = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
const ang = (v) => Math.atan2(v[1], v[0]);
function toSegs(sub) {
  const out = [];
  for (const s of sub.segs) {
    const a = s.p[0], b = s.p[s.p.length - 1];
    if (s.t === 'L') { if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1e-9) out.push({ t: 'L', a, b }); continue; }
    if (s.t !== 'A') return null;
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-9) continue; // SVG omits an arc whose ends coincide
    const k = {}; arcPts(a[0], a[1], s.rx, s.ry, s.rot, s.fa, s.fs, b[0], b[1], 90, k);
    if (Math.abs(k.rx - k.ry) > 1e-9) return null;
    out.push({ t: 'A', c: [k.cx, k.cy], r: k.rx, t1: k.t1, dt: k.dt });
  }
  return out;
}
const tanStart = (s) => s.t === 'L' ? unit([s.b[0] - s.a[0], s.b[1] - s.a[1]]) : (q => [-Math.sin(s.t1) * q, Math.cos(s.t1) * q])(Math.sign(s.dt));
const tanEnd = (s) => s.t === 'L' ? tanStart(s) : (q => [-Math.sin(s.t1 + s.dt) * q, Math.cos(s.t1 + s.dt) * q])(Math.sign(s.dt));
const pStart = (s) => s.t === 'L' ? s.a : [s.c[0] + Math.cos(s.t1) * s.r, s.c[1] + Math.sin(s.t1) * s.r];
const pEnd = (s) => s.t === 'L' ? s.b : [s.c[0] + Math.cos(s.t1 + s.dt) * s.r, s.c[1] + Math.sin(s.t1 + s.dt) * s.r];
const rev = (s) => s.t === 'L' ? { t: 'L', a: s.b, b: s.a } : { t: 'A', c: s.c, r: s.r, t1: s.t1 + s.dt, dt: -s.dt };
const N = (v) => +v.toPrecision(15);
let TIDY = 1e-3; export const setTidy = (v) => { TIDY = v; };
let FALLBACK_PRECISION = 16; export const setFallbackPrecision = (v) => { FALLBACK_PRECISION = v; };
let PIVOT = true; export const setPivot = (v) => { PIVOT = v; };
const P = (p) => `${N(p[0])} ${N(p[1])}`;
/** arc of radius R around c from angle a0 turning by da (signed), in ≤ 90° pieces */
export const CIRCLES = [];
function arcTo(c, R, a0, da) {
  if (R < 1e-12) return `L${P(c)}`;
  CIRCLES.push([c[0], c[1], R]);
  const n = Math.max(1, Math.ceil(Math.abs(da) / (Math.PI / 2) - 1e-9)); let o = '';
  for (let q = 1; q <= n; q++) { const t = a0 + da * q / n; o += `A${N(R)} ${N(R)} 0 0 ${da > 0 ? 1 : 0} ${P([c[0] + Math.cos(t) * R, c[1] + Math.sin(t) * R])}`; }
  return o;
}
/** the left offset of one segment, drawn from its start offset point */
function offset(s, h) {
  if (s.t === 'L') { const n = rot(tanStart(s)); return `L${P(add(s.b, n, h))}`; }
  const rho = s.r - Math.sign(s.dt) * h; // left of travel: inside for a positive sweep
  // the inner offset collapses through the centre (r ≤ h): go through the centre instead, as a pivot.
  // Both edges lie inside the stroke (inside the end discs), so they add no ink and leave no hole.
  if (rho < 1e-12) return `L${P(s.c)}L${P(add(pEnd(s), rot(tanEnd(s)), h))}`;
  // c + ρ·u(t): for ρ < 0 this is c + |ρ|·u(t + π), same sweep
  return arcTo(s.c, Math.abs(rho), s.t1 + (rho < 0 ? Math.PI : 0), s.dt);
}
function join(p, tIn, tOut, h) { // round join on the left side, rotating the normal as the tangent turns
  let th = ang(tOut) - ang(tIn); while (th > Math.PI) th -= 2 * Math.PI; while (th < -Math.PI) th += 2 * Math.PI;
  if (Math.abs(th) < 1e-12) return '';
  if (PIVOT && th > 0) return th < 0.1 ? `L${P(add(p, rot(tOut), h))}` // a near-tangent inner turn: the chord, which lies inside the pen's disc
    : `L${P(p)}L${P(add(p, rot(tOut), h))}`; // inner side of the turn: through the vertex (Skia's inner join)
  return arcTo(p, h, ang(rot(tIn)), th);
}
function leftChain(segs, h, closed) {
  let o = '';
  segs.forEach((s, i) => {
    o += offset(s, h);
    const nx = segs[i + 1] || (closed ? segs[0] : null);
    if (nx) o += join(pEnd(s), tanEnd(s), tanStart(nx), h);
  });
  return o;
}
/** drop zero-length L/A steps (PathOps mis-resolves contours full of them) */
function tidy(d) {
  let cur = null, out = '';
  for (const m of d.matchAll(/([MLAZ])([^MLAZ]*)/g)) {
    const n = m[2].trim().split(/\s+/).filter(Boolean).map(Number);
    if (m[1] === 'Z') { out += 'Z'; continue; }
    const e = [n[n.length - 2], n[n.length - 1]];
    if (m[1] !== "M" && cur && Math.hypot(e[0] - cur[0], e[1] - cur[1]) < TIDY) continue;
    out += m[1] + m[2]; cur = e;
  }
  return out;
}
export function strokeContour(d, w) { const c = strokeContourRaw(d, w); return c === null ? null : tidy(c); }
/** one contour set per subpath, so subpaths of one path never cancel each other's winding */
export function strokeContours(d, w) {
  const subs = d.trim().split(/(?=[Mm])/).filter(x => x.trim()); if (/[a-z]/.test(d.replace(/e-?\d/g, ''))) return strokeContour(d, w) && [strokeContour(d, w)];
  const out = []; for (const sd of subs) { const c = strokeContour(sd, w); if (c === null) return null; if (c) out.push(c); } return out;
}
function strokeContourRaw(d, w) {
  const h = w / 2; let o = '';
  for (const sub of normalise(d)) {
    const segs = toSegs(sub); if (segs === null) return null;
    if (!segs.length) { const p = sub.segs[0]?.p[0] || null; if (p) o += `M${P([p[0] - h, p[1]])}` + arcTo(p, h, Math.PI, 2 * Math.PI) + 'Z'; continue; }
    // a dot: a closed circle no wider than its pen
    if (sub.closed && segs.every(s => s.t === 'A' && Math.hypot(s.c[0] - segs[0].c[0], s.c[1] - segs[0].c[1]) < 1e-6 && Math.abs(s.r - segs[0].r) < 1e-9) && segs[0].r <= h + 1e-9) {
      const c = segs[0].c, R = segs[0].r + h; o += `M${P([c[0] + R, c[1]])}` + arcTo(c, R, 0, 2 * Math.PI) + 'Z'; continue;
    }
    const closed = sub.closed && Math.hypot(pEnd(segs[segs.length - 1])[0] - pStart(segs[0])[0], pEnd(segs[segs.length - 1])[1] - pStart(segs[0])[1]) < 1e-9;
    const R = segs.slice().reverse().map(rev);
    if (closed) {
      o += `M${P(add(pStart(segs[0]), rot(tanStart(segs[0])), h))}` + leftChain(segs, h, true) + 'Z';
      o += `M${P(add(pStart(R[0]), rot(tanStart(R[0])), h))}` + leftChain(R, h, true) + 'Z';
    } else {
      const s0 = segs[0], e = segs[segs.length - 1], te = tanEnd(e), ts = tanStart(s0);
      o += `M${P(add(pStart(s0), rot(ts), h))}` + leftChain(segs, h, false);
      o += arcTo(pEnd(e), h, ang(rot(te)), -Math.PI);            // end cap, around the front
      o += leftChain(R, h, false);
      o += arcTo(pStart(s0), h, ang(rot([-ts[0], -ts[1]])), -Math.PI) + 'Z'; // start cap
    }
  }
  return o;
}
export const exactStroke = () => {
  let ck;
  // PathOps occasionally splits a conic at a point that is on no circle (seen on power-filled's caps, off by 0.18).
  // Every arc we drew lies on a circle we know, so an output conic whose ends are not both on one known circle is
  // merged with the next one until they are, and then written on that circle.
  function snap(cmds) {
    const onCircle = (a, b) => CIRCLES.find(([x, y, r]) => Math.abs(Math.hypot(a[0] - x, a[1] - y) - r) < 2e-4 && Math.abs(Math.hypot(b[0] - x, b[1] - y) - r) < 2e-4);
    const out = []; let cur = [0, 0]; const segs = [];
    for (let i = 0; i < cmds.length;) { const v = cmds[i++]; const n = { 0: 2, 1: 2, 2: 4, 3: 5, 4: 6, 5: 0 }[v]; segs.push([v, Array.from(cmds.slice(i, i + n))]); i += n; }
    for (let k = 0; k < segs.length; k++) {
      const [v, a] = segs[k];
      if (v !== 3 || !CIRCLES.length) { out.push([v, a]); if (n2(v)) cur = a.slice(-2); continue; }
      // a conic that is a circle we drew is fine as it is
      const own = conicCircle(cur, a);
      if (own && CIRCLES.some(([x, y, r]) => Math.hypot(own[0] - x, own[1] - y) < 2e-4 && Math.abs(own[2] - r) < 2e-4)) { out.push([v, a]); cur = [a[2], a[3]]; continue; }
      const start = cur; let j = k, end = [a[2], a[3]], mids = [conicMid(start, a)];
      const fits = () => CIRCLES.find(([x, y, r]) => [start, end].every(p => Math.abs(Math.hypot(p[0] - x, p[1] - y) - r) < 2e-4) && mids.every(p => Math.abs(Math.hypot(p[0] - x, p[1] - y) - r) < 0.3));
      let hit = fits();
      while (!hit && j + 1 < segs.length && segs[j + 1][0] === 3) { j++; mids.push(conicMid(end, segs[j][1])); end = [segs[j][1][2], segs[j][1][3]]; hit = fits(); }
      if (!hit) { out.push([v, a]); cur = [a[2], a[3]]; continue; }
      out.push(['arc', [hit, start, end, segs.slice(k, j + 1)]]); cur = end; k = j;
    }
    return out;
  }
  const conicMid = (p0, a) => { const w = a[4]; return [(p0[0] + 2 * w * a[0] + a[2]) / (2 + 2 * w), (p0[1] + 2 * w * a[1] + a[3]) / (2 + 2 * w)]; };
  const conicCircle = (p0, a) => { const [px, py, ex, ey] = a, ax = -(py - p0[1]), ay = px - p0[0], bx = -(ey - py), by = ex - px, den = ax * by - ay * bx; if (Math.abs(den) < 1e-12) return null; const t = ((ex - p0[0]) * by - (ey - p0[1]) * bx) / den; const c = [p0[0] + ax * t, p0[1] + ay * t]; const r0 = Math.hypot(p0[0] - c[0], p0[1] - c[1]), r1 = Math.hypot(ex - c[0], ey - c[1]); return Math.abs(r0 - r1) < 1e-4 * Math.max(1, r0) ? [c[0], c[1], r0] : null; };
  const n2 = (v) => v === 0 || v === 1 || v === 2 || v === 3 || v === 4;
  function toSVG(cmds) {
    let o = '', cx = 0, cy = 0; const f = (v) => +v.toFixed(6);
    const items = snap(cmds); const flat = [];
    for (const [v, a] of items) {
      if (v !== 'arc') { flat.push(v, ...a); continue; }
      const [[x, y, r], s0, e, parts] = a;
      // sweep: from the conics' own turning direction; split the span in ≤ 90° arcs on the known circle
      const p1 = parts[0][1]; const cross = (p1[0] - s0[0]) * (p1[3] - p1[1]) - (p1[1] - s0[1]) * (p1[2] - p1[0]);
      let a0 = Math.atan2(s0[1] - y, s0[0] - x), a1 = Math.atan2(e[1] - y, e[0] - x), da = a1 - a0;
      while (da > Math.PI) da -= 2 * Math.PI; while (da <= -Math.PI) da += 2 * Math.PI; // pieces we draw never span more than 90°, so the short way
      flat.push('A', r, da, e[0], e[1]);
    }
    for (let i = 0; i < flat.length;) {
      const v = flat[i++];
      if (v === 'A') { const r = flat[i++], da = flat[i++]; const ex = flat[i++], ey = flat[i++]; o += `A${f(r)} ${f(r)} 0 ${Math.abs(da) > Math.PI ? 1 : 0} ${da > 0 ? 1 : 0} ${f(ex)} ${f(ey)}`; cx = ex; cy = ey; continue; }
      if (v === ck.MOVE_VERB) { cx = flat[i++]; cy = flat[i++]; o += `M${f(cx)} ${f(cy)}`; }
      else if (v === ck.LINE_VERB) { cx = flat[i++]; cy = flat[i++]; o += `L${f(cx)} ${f(cy)}`; }
      else if (v === ck.QUAD_VERB) { const q = [flat[i++], flat[i++], flat[i++], flat[i++]]; o += `Q${q.map(f).join(' ')}`; [cx, cy] = q.slice(2); }
      else if (v === ck.CUBIC_VERB) { const q = Array.from(flat.slice(i, i + 6)); i += 6; o += `C${q.map(f).join(' ')}`; [cx, cy] = [q[4], q[5]]; }
      else if (v === ck.CONIC_VERB) {
        const [px, py, ex, ey, w] = [flat[i++], flat[i++], flat[i++], flat[i++], flat[i++]];
        const l0 = Math.hypot(px - cx, py - cy), l1 = Math.hypot(ex - px, ey - py);
        const ax = -(py - cy), ay = px - cx, bx = -(ey - py), by = ex - px, den = ax * by - ay * bx;
        const turn = Math.acos(Math.max(-1, Math.min(1, ((px - cx) * (ex - px) + (py - cy) * (ey - py)) / (l0 * l1 || 1))));
        if (Math.abs(l0 - l1) > 1e-4 * Math.max(l0, l1, 1) || Math.abs(den) < 1e-12 || Math.abs(w - Math.cos(turn / 2)) > 1e-4) { // not a circle: sample to quads
          let [sx, sy] = [cx, cy]; const n = 16, Pt = (t) => { const u = 1 - t, dd = u * u + 2 * w * u * t + t * t; return [(u * u * cx + 2 * w * u * t * px + t * t * ex) / dd, (u * u * cy + 2 * w * u * t * py + t * t * ey) / dd]; };
          for (let k = 1; k <= n; k++) { const [mx, my] = Pt((k - 0.5) / n), [qx, qy] = Pt(k / n); o += `Q${f(2 * mx - (sx + qx) / 2)} ${f(2 * my - (sy + qy) / 2)} ${f(qx)} ${f(qy)}`; [sx, sy] = [qx, qy]; }
        } else {
          const t = ((ex - cx) * by - (ey - cy) * bx) / den, r = Math.hypot(ax * t, ay * t);
          const cross = (px - cx) * (ey - py) - (py - cy) * (ex - px);
          o += `A${f(r)} ${f(r)} 0 0 ${cross > 0 ? 1 : 0} ${f(ex)} ${f(ey)}`;
        }
        cx = ex; cy = ey;
      } else if (v === ck.CLOSE_VERB) o += 'Z';
    }
    return o;
  }
  return {
    name: 'exact-stroke',
    async init() { ck = await require('canvaskit-wasm')(); },
    convert(src) {
      CIRCLES.length = 0;
      let acc = new ck.Path(); const stats = { fallback: 0 };
      const add = (p) => { const r = ck.Path.MakeFromOp(acc, p, ck.PathOp.Union); if (!r) throw new Error('PathOps union failed'); acc.delete(); p.delete(); acc = r; };
      for (const a of src.areas) { const p = ck.Path.MakeFromSVGString(a.d); p.setFillType(a.rule === 'evenodd' ? ck.FillType.EvenOdd : ck.FillType.Winding); add(p); }
      for (const s of src.strokes) {
        const c = strokeContours(s.d, s.w);
        if (c) for (const one of c) { const p = ck.Path.MakeFromSVGString(one); p.setFillType(ck.FillType.Winding); const q = ck.Path.MakeFromOp(new ck.Path(), p, ck.PathOp.Union); p.delete(); if (!q) throw new Error('PathOps simplify failed'); add(q); }
        else { stats.fallback++; const p = ck.Path.MakeFromSVGString(s.d); add(p.makeStroked({ width: s.w, cap: ck.StrokeCap.Round, join: ck.StrokeJoin.Round, precision: FALLBACK_PRECISION })); p.delete(); }
      }
      const rule = acc.getFillType() === ck.FillType.EvenOdd ? 'evenodd' : 'nonzero';
      const d = toSVG(acc.toCmds()); acc.delete(); CIRCLES.length = 0;
      return { d, rule, stats };
    },
  };
};

// exact-capsules: the same exact pieces, but one simple region per segment — a line's stadium, an arc's banana
// (annular sector with its two caps), and for an arc tighter than its pen (r < h) the wedge to its centre with its caps —
// unioned with PathOps. Every piece is a region of the true stroke on its own, so no winding rule can leave a hole.
export function capsules(d, w) {
  const h = w / 2, out = [];
  for (const sub of normalise(d)) {
    const segs = toSegs(sub); if (segs === null) return null;
    if (!segs.length) { const p = sub.segs[0]?.p[0]; if (p) out.push(`M${P([p[0] + h, p[1]])}` + arcTo(p, h, 0, 2 * Math.PI) + 'Z'); continue; }
    if (sub.closed && segs.every(s => s.t === 'A' && Math.hypot(s.c[0] - segs[0].c[0], s.c[1] - segs[0].c[1]) < 1e-6 && Math.abs(s.r - segs[0].r) < 1e-9) && segs[0].r <= h + 1e-9) {
      const c = segs[0].c, R = segs[0].r + h; out.push(`M${P([c[0] + R, c[1]])}` + arcTo(c, R, 0, 2 * Math.PI) + 'Z'); continue;
    }
    for (const s of segs) {
      const a = pStart(s), b = pEnd(s), ta = tanStart(s), tb = tanEnd(s);
      let o = `M${P(add(a, rot(ta), h))}`;
      if (s.t === 'L') o += `L${P(add(b, rot(tb), h))}`;
      else { const rho = s.r - Math.sign(s.dt) * h; if (rho > 1e-12) o += arcTo(s.c, rho, s.t1, s.dt); else o = `M${P(a)}L${P(s.c)}L${P(b)}`; }
      if (s.t === 'A' && s.r - Math.sign(s.dt) * h <= 1e-12) { // left side is the inside and it collapses: wedge to the centre, then the caps
        o += `L${P(add(b, rot(tb), -h))}`; // to the outer side at b
        const R = s.r + h; o += arcTo(s.c, R, s.t1 + s.dt + (Math.sign(s.dt) > 0 ? 0 : 0), 0); // no-op keeps the shape readable
        out.push(o + 'Z');
        // outer band and caps as their own simple pieces
        out.push(`M${P(add(b, rot(tb), -h))}` + arcTo(s.c, R, s.t1 + s.dt, -s.dt) + `L${P(s.c)}Z`);
        out.push(`M${P([a[0] + h, a[1]])}` + arcTo(a, h, 0, 2 * Math.PI) + 'Z', `M${P([b[0] + h, b[1]])}` + arcTo(b, h, 0, 2 * Math.PI) + 'Z');
        continue;
      }
      o += arcTo(b, h, ang(rot(tb)), -Math.PI);                    // end cap
      if (s.t === 'L') o += `L${P(add(a, rot(ta), -h))}`;
      else { const R = s.r + Math.sign(s.dt) * h; o += arcTo(s.c, R, s.t1 + s.dt, -s.dt); }
      o += arcTo(a, h, ang(rot([-ta[0], -ta[1]])), -Math.PI) + 'Z'; // start cap
      out.push(o);
    }
  }
  return out;
}
export const exactCapsules = () => {
  const base = exactStroke(); let ck;
  return {
    name: 'exact-capsules',
    async init() { await base.init(); ck = await require('canvaskit-wasm')(); },
    convert(src) {
      // reuse exactStroke's union + writer by handing it pre-built regions as areas
      const areas = [...src.areas]; const strokes = [];
      for (const s of src.strokes) { const c = capsules(s.d, s.w); if (c) areas.push(...c.map(d => ({ d, rule: 'nonzero' }))); else strokes.push(s); }
      return base.convert({ ...src, areas, strokes });
    },
  };
};

// exact-stroke followed by the cleanup pass: 3 dp, arcs over 90° split, H/V where axis-aligned, no spaces it does not need.
export const exactClean = () => {
  const base = exactStroke(); let clean;
  return {
    name: 'exact+clean',
    async init() { await base.init(); clean = (await import('./cleanup.mjs')).clean; },
    convert(src) { const o = base.convert(src); return { ...o, d: clean(o.d) }; },
  };
};
