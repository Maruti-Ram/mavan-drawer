// Each approach: { name, init(), convert(src) -> { d, rule } }.
// src = { size, strokes: [{ d, w }], areas: [{ d, rule }] }
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const skia = (precision = 1) => {
  let ck;
  return {
    name: precision === 1 ? 'skia' : `skia-p${precision}`,
    async init() { ck = await require('canvaskit-wasm')(); },
    convert(src) {
      let acc = null;
      const add = (p) => { if (!acc) { acc = p; return; } const r = ck.Path.MakeFromOp(acc, p, ck.PathOp.Union); acc.delete(); p.delete(); acc = r; };
      for (const a of src.areas) { const p = ck.Path.MakeFromSVGString(a.d); p.setFillType(a.rule === 'evenodd' ? ck.FillType.EvenOdd : ck.FillType.Winding); add(p); }
      for (const s of src.strokes) {
        const p = ck.Path.MakeFromSVGString(s.d);
        const q = p.makeStroked({ width: s.w, cap: ck.StrokeCap.Round, join: ck.StrokeJoin.Round, precision });
        p.delete(); add(q);
      }
      if (src.areas.length + src.strokes.length === 1) { const e = new ck.Path(); const r = ck.Path.MakeFromOp(acc, e, ck.PathOp.Union); e.delete(); acc.delete(); acc = r; }
      const rule = acc.getFillType() === ck.FillType.EvenOdd ? 'evenodd' : 'nonzero';
      const d = acc.toSVGString(); acc.delete();
      return { d, rule };
    },
  };
};

export const paperOffset = () => {
  let paper, PO;
  return {
    name: 'paper+offset',
    async init() { paper = require('paper'); paper.setup(new paper.Size(24, 24)); PO = require('paperjs-offset').PaperOffset; },
    convert(src) {
      let acc = null;
      const add = (p) => { if (!acc) { acc = p; return; } const r = acc.unite(p, { insert: false }); acc.remove(); p.remove(); acc = r; };
      for (const a of src.areas) { const p = paper.PathItem.create(a.d); p.fillRule = a.rule === 'evenodd' ? 'evenodd' : 'nonzero'; p.remove(); add(p); }
      for (const s of src.strokes) {
        const p = paper.PathItem.create(s.d); p.remove();
        const o = PO.offsetStroke(p, s.w / 2, { cap: 'round', join: 'round', insert: false });
        add(o);
      }
      if (src.areas.length + src.strokes.length === 1) { const r = acc.unite(acc, { insert: false }); acc = r; }
      return { d: acc.pathData, rule: acc.fillRule === 'evenodd' ? 'evenodd' : 'nonzero' };
    },
  };
};

export const maker = () => {
  let m;
  return {
    name: 'makerjs',
    async init() { m = require('makerjs'); },
    convert(src) {
      let acc = null;
      const add = (md) => { if (!acc) { acc = md; return; } acc = m.model.combineUnion(acc, md); };
      for (const a of src.areas) add(m.importer.fromSVGPathData(a.d));
      for (const s of src.strokes) add(m.model.expandPaths(m.importer.fromSVGPathData(s.d), s.w / 2, 0));
      const d = m.exporter.toSVGPathData(acc, { origin: [0, 0], byLayers: false, fillRule: 'evenodd' });
      return { d, rule: 'evenodd' };
    },
  };
};

// skia-exact: build each segment's exact Minkowski sum with the pen disc ourselves (a line → rectangle + two discs,
// a circular arc → annular sector (inner radius max(r−h,0)) + two discs), union with Skia PathOps (which keeps circular
// arcs as exact conics), then write each conic back as an SVG arc. Elliptical arcs and curves fall back to Skia's stroker.
import { normalise, arcPts } from './pathkit.mjs';
export const skiaExact = () => {
  let ck;
  const disc = (x, y, h) => `M${x - h} ${y}A${h} ${h} 0 1 0 ${x + h} ${y}A${h} ${h} 0 1 0 ${x - h} ${y}Z`;
  function pieces(d, w) {
    const h = w / 2, out = [], fallback = [];
    for (const { segs } of normalise(d)) {
      if (!segs.length) continue;
      for (const s of segs) {
        const [x0, y0] = s.p[0], [x1, y1] = s.p[s.p.length - 1];
        out.push(disc(x0, y0, h), disc(x1, y1, h));
        if (s.t === 'L') {
          const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1e-9) continue;
          const nx = -(y1 - y0) / L * h, ny = (x1 - x0) / L * h;
          out.push(`M${x0 + nx} ${y0 + ny}L${x1 + nx} ${y1 + ny}L${x1 - nx} ${y1 - ny}L${x0 - nx} ${y0 - ny}Z`);
        } else if (s.t === 'A') {
          const k = {}; arcPts(x0, y0, s.rx, s.ry, s.rot, s.fa, s.fs, x1, y1, 90, k);
          if (Math.abs(k.rx - k.ry) > 1e-9) { fallback.push(s); continue; }
          const r = k.rx, R = r + h, ri = Math.max(r - h, 0), n = Math.max(1, Math.ceil(Math.abs(k.dt) / (Math.PI / 2)));
          const at = (t, rr) => [k.cx + Math.cos(t) * rr, k.cy + Math.sin(t) * rr];
          const fs = k.dt > 0 ? 1 : 0, bs = 1 - fs;
          let p = `M${at(k.t1, R).join(' ')}`;
          for (let q = 1; q <= n; q++) p += `A${R} ${R} 0 0 ${fs} ${at(k.t1 + k.dt * q / n, R).join(' ')}`;
          if (ri > 0) { p += `L${at(k.t1 + k.dt, ri).join(' ')}`; for (let q = n - 1; q >= 0; q--) p += `A${ri} ${ri} 0 0 ${bs} ${at(k.t1 + k.dt * q / n, ri).join(' ')}`; }
          else p += `L${k.cx} ${k.cy}`;
          out.push(p + 'Z');
        } else fallback.push(s);
      }
    }
    return { out, fallback };
  }
  const segD = (s) => { const [a] = s.p; if (s.t === 'A') return `M${a.join(' ')}A${s.rx} ${s.ry} ${s.rot} ${s.fa} ${s.fs} ${s.p[1].join(' ')}`; if (s.t === 'C') return `M${a.join(' ')}C${s.p.slice(1).flat().join(' ')}`; return `M${a.join(' ')}Q${s.p.slice(1).flat().join(' ')}`; };
  function toSVG(cmds) {
    let o = '', cx = 0, cy = 0; const f = (v) => +v.toFixed(6);
    for (let i = 0; i < cmds.length;) {
      const v = cmds[i++];
      if (v === ck.MOVE_VERB) { cx = cmds[i++]; cy = cmds[i++]; o += `M${f(cx)} ${f(cy)}`; }
      else if (v === ck.LINE_VERB) { cx = cmds[i++]; cy = cmds[i++]; o += `L${f(cx)} ${f(cy)}`; }
      else if (v === ck.QUAD_VERB) { const q = [cmds[i++], cmds[i++], cmds[i++], cmds[i++]]; o += `Q${q.map(f).join(' ')}`; [cx, cy] = q.slice(2); }
      else if (v === ck.CUBIC_VERB) { const q = cmds.slice(i, i + 6); i += 6; o += `C${Array.from(q).map(f).join(' ')}`; [cx, cy] = [q[4], q[5]]; }
      else if (v === ck.CONIC_VERB) {
        const [px, py, ex, ey, w] = [cmds[i++], cmds[i++], cmds[i++], cmds[i++], cmds[i++]];
        const l0 = Math.hypot(px - cx, py - cy), l1 = Math.hypot(ex - px, ey - py);
        if (Math.abs(l0 - l1) > 1e-4 * Math.max(l0, l1, 1)) { // not a circle: sample to quads
          let [sx, sy] = [cx, cy]; const N = 16, P = (t) => { const u = 1 - t, den = u * u + 2 * w * u * t + t * t; return [(u * u * cx + 2 * w * u * t * px + t * t * ex) / den, (u * u * cy + 2 * w * u * t * py + t * t * ey) / den]; };
          for (let k = 1; k <= N; k++) { const [mx, my] = P((k - 0.5) / N), [qx, qy] = P(k / N); const c = [2 * mx - (sx + qx) / 2, 2 * my - (sy + qy) / 2]; o += `Q${f(c[0])} ${f(c[1])} ${f(qx)} ${f(qy)}`; [sx, sy] = [qx, qy]; }
        } else {
          // circle tangent to (p−start) at start and to (end−p) at end: centre on both normals
          const ax = -(py - cy), ay = px - cx, bx = -(ey - py), by = ex - px; // normals
          const den = ax * by - ay * bx; const t = ((ex - cx) * by - (ey - cy) * bx) / den;
          const ccx = cx + ax * t, ccy = cy + ay * t, r = Math.hypot(cx - ccx, cy - ccy);
          const cross = (px - cx) * (ey - py) - (py - cy) * (ex - px);
          o += `A${f(r)} ${f(r)} 0 0 ${cross > 0 ? 1 : 0} ${f(ex)} ${f(ey)}`;
        }
        cx = ex; cy = ey;
      } else if (v === ck.CLOSE_VERB) o += 'Z';
    }
    return o;
  }
  return {
    name: 'skia-exact',
    async init() { ck = await require('canvaskit-wasm')(); },
    convert(src) {
      let acc = new ck.Path();
      const add = (p) => { const r = ck.Path.MakeFromOp(acc, p, ck.PathOp.Union); acc.delete(); p.delete(); acc = r; };
      for (const a of src.areas) { const p = ck.Path.MakeFromSVGString(a.d); p.setFillType(a.rule === 'evenodd' ? ck.FillType.EvenOdd : ck.FillType.Winding); add(p); }
      for (const s of src.strokes) {
        const { out, fallback } = pieces(s.d, s.w);
        for (const d of out) add(ck.Path.MakeFromSVGString(d));
        for (const seg of fallback) { const p = ck.Path.MakeFromSVGString(segD(seg)); add(p.makeStroked({ width: s.w, cap: ck.StrokeCap.Round, join: ck.StrokeJoin.Round, precision: 16 })); p.delete(); }
      }
      const rule = acc.getFillType() === ck.FillType.EvenOdd ? 'evenodd' : 'nonzero';
      const d = toSVG(acc.toCmds()); acc.delete();
      return { d, rule };
    },
  };
};
