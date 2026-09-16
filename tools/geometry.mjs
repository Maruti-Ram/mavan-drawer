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
