// Path normaliser + flattener for any SVG path data (abs/rel, M L H V C S Q T A Z),
// used to measure converter outputs. Arcs are flattened at 0.1° steps, curves at 400 steps.
const CMD = /([MmLlHhVvCcSsQqTtAaZz])/;
const NUM = /[+-]?(\d*\.\d+|\d+\.?)([eE][+-]?\d+)?/y;
function tokens(d) {
  const out = [];
  for (const part of d.split(CMD).map(s => s.trim()).filter(Boolean)) {
    if (CMD.test(part) && part.length === 1) { out.push({ cmd: part, args: [] }); continue; }
    const cur = out[out.length - 1], isArc = /[Aa]/.test(cur.cmd);
    let i = 0, n = 0;
    while (i < part.length) {
      while (i < part.length && /[\s,]/.test(part[i])) i++;
      if (i >= part.length) break;
      if (isArc && (n % 7 === 3 || n % 7 === 4)) { cur.args.push(Number(part[i])); i++; n++; continue; }
      NUM.lastIndex = i; const m = NUM.exec(part); if (!m) { i++; continue; }
      cur.args.push(Number(m[0])); i += m[0].length; n++;
    }
  }
  return out;
}
/** -> array of subpaths, each {segs:[...], closed} with absolute segments. */
export function normalise(d) {
  const subs = []; let sub = null, cx = 0, cy = 0, sx = 0, sy = 0, lc = null, lq = null;
  for (const { cmd, args } of tokens(d)) {
    const rel = cmd !== cmd.toUpperCase(), up = cmd.toUpperCase();
    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }[up];
    if (up === 'Z') { if (sub) { if (cx !== sx || cy !== sy) sub.segs.push({ t: 'L', p: [[cx, cy], [sx, sy]] }); sub.closed = true; } cx = sx; cy = sy; lc = lq = null; continue; }
    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      const X = (v) => rel ? cx + v : v, Y = (v) => rel ? cy + v : v;
      if (up === 'M' && k === 0) { cx = X(a[0]); cy = Y(a[1]); sx = cx; sy = cy; sub = { segs: [], closed: false }; subs.push(sub); lc = lq = null; continue; }
      if (up === 'M' || up === 'L' || up === 'H' || up === 'V') {
        const x = up === 'V' ? cx : X(a[0]), y = up === 'H' ? cy : up === 'V' ? Y(a[0]) : Y(a[1]);
        sub.segs.push({ t: 'L', p: [[cx, cy], [x, y]] }); cx = x; cy = y; lc = lq = null;
      } else if (up === 'C' || up === 'S') {
        let c1, c2, e;
        if (up === 'C') { c1 = [X(a[0]), Y(a[1])]; c2 = [X(a[2]), Y(a[3])]; e = [X(a[4]), Y(a[5])]; }
        else { c1 = lc ? [2 * cx - lc[0], 2 * cy - lc[1]] : [cx, cy]; c2 = [X(a[0]), Y(a[1])]; e = [X(a[2]), Y(a[3])]; }
        sub.segs.push({ t: 'C', p: [[cx, cy], c1, c2, e] }); lc = c2; lq = null; [cx, cy] = e;
      } else if (up === 'Q' || up === 'T') {
        let c, e;
        if (up === 'Q') { c = [X(a[0]), Y(a[1])]; e = [X(a[2]), Y(a[3])]; }
        else { c = lq ? [2 * cx - lq[0], 2 * cy - lq[1]] : [cx, cy]; e = [X(a[0]), Y(a[1])]; }
        sub.segs.push({ t: 'Q', p: [[cx, cy], c, e] }); lq = c; lc = null; [cx, cy] = e;
      } else if (up === 'A') {
        const e = [X(a[5]), Y(a[6])];
        sub.segs.push({ t: 'A', p: [[cx, cy], e], rx: a[0], ry: a[1], rot: a[2], fa: a[3], fs: a[4] }); [cx, cy] = e; lc = lq = null;
      }
    }
  }
  return subs;
}
export function arcPts(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2, stepDeg, info) {
  if (!rx || !ry) return [[x2, y2]];
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = rotDeg * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  const lam = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = co * rx * y1p / ry, cyp = -co * ry * x1p / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => { const d = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy)); const t = Math.acos(Math.min(1, Math.max(-1, d))); return ux * vy - uy * vx < 0 ? -t : t; };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry, vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  let t1 = ang(1, 0, ux, uy), dt = ang(ux, uy, vx, vy);
  if (!fS && dt > 0) dt -= 2 * Math.PI; if (fS && dt < 0) dt += 2 * Math.PI;
  if (info) Object.assign(info, { cx, cy, rx, ry, t1, dt, cos, sin });
  const n = Math.max(8, Math.ceil(Math.abs(dt) * 180 / Math.PI / stepDeg)), pts = [];
  for (let i = 1; i <= n; i++) { const t = t1 + dt * i / n, px = Math.cos(t) * rx, py = Math.sin(t) * ry; pts.push([cos * px - sin * py + cx, sin * px + cos * py + cy]); }
  return pts;
}
/** Flatten a path into polylines (one per subpath). */
export function flatten(d, { stepDeg = 0.1, curveSteps = 400, lineStep = 0 } = {}) {
  return normalise(d).map(({ segs, closed }) => {
    const pts = segs.length ? [segs[0].p[0]] : [];
    for (const s of segs) {
      if (s.t === 'L') {
        const [[x0, y0], [x1, y1]] = s.p;
        const n = lineStep ? Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / lineStep)) : 1;
        for (let i = 1; i <= n; i++) pts.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
      } else if (s.t === 'C') {
        const [p0, p1, p2, p3] = s.p;
        for (let i = 1; i <= curveSteps; i++) { const t = i / curveSteps, u = 1 - t; pts.push([0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])); }
      } else if (s.t === 'Q') {
        const [p0, p1, p2] = s.p;
        for (let i = 1; i <= curveSteps; i++) { const t = i / curveSteps, u = 1 - t; pts.push([0, 1].map(k => u * u * p0[k] + 2 * u * t * p1[k] + t * t * p2[k])); }
      } else if (s.t === 'A') {
        pts.push(...arcPts(s.p[0][0], s.p[0][1], s.rx, s.ry, s.rot, s.fa, s.fs, s.p[1][0], s.p[1][1], stepDeg));
      }
    }
    return { pts, closed };
  });
}
export function inkOf(polys) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const { pts } of polys) for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
export function cmdCounts(d) {
  const c = {}; for (const { cmd } of tokens(d)) { const u = cmd.toUpperCase(); c[u] = (c[u] || 0) + 1; } return c;
}
export function pointCount(d) { // coordinate pairs (arc = its end point)
  let n = 0; for (const { cmd, args } of tokens(d)) { const u = cmd.toUpperCase(); n += { M: args.length / 2, L: args.length / 2, H: args.length, V: args.length, C: args.length / 2, S: args.length / 2, Q: args.length / 2, T: args.length / 2, A: args.length / 7, Z: 0 }[u]; } return n;
}
export function maxDecimals(d) {
  return Math.max(0, ...(d.match(/\d*\.\d+|\d+/g) || []).map(s => (s.split('.')[1] || '').length));
}
export function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
  let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
export function polyDist(px, py, polys) {
  let m = Infinity;
  for (const { pts, closed } of polys) {
    for (let i = 1; i < pts.length; i++) { const v = segDist(px, py, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]); if (v < m) m = v; }
    if (pts.length === 1) m = Math.min(m, Math.hypot(px - pts[0][0], py - pts[0][1]));
    if (closed && pts.length > 1) { const a = pts[pts.length - 1], b = pts[0]; const v = segDist(px, py, a[0], a[1], b[0], b[1]); if (v < m) m = v; }
  }
  return m;
}
