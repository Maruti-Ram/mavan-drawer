import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { flatten, inkOf, cmdCounts, pointCount, maxDecimals, polyDist } from './pathkit.mjs';
const require = createRequire(import.meta.url); const { Resvg } = require('@resvg/resvg-js');
export const HERE = path.dirname(fileURLToPath(import.meta.url)), REPO = path.resolve(HERE, '../..');
export const ICONS = JSON.parse(fs.readFileSync(path.join(REPO, 'dist/icons.json'), 'utf8'));
const attr = (tag, k) => (tag.match(new RegExp(`\\s${k}="([^"]*)"`)) || [])[1];
export function readSource(rel) {
  const text = fs.readFileSync(path.join(REPO, 'src/icons', rel + '.svg'), 'utf8');
  const root = text.match(/<svg[^>]*>/)[0], size = Number(attr(root, 'viewBox').split(' ')[2]);
  const rootW = Number(attr(root, 'stroke-width')); const strokes = [], areas = [];
  for (const tag of text.match(/<path\b[^>]*>/g) || []) {
    const d = attr(tag, 'd');
    if (attr(tag, 'stroke') === 'none') areas.push({ d, rule: attr(tag, 'fill-rule') || 'nonzero' });
    else strokes.push({ d, w: Number(attr(tag, 'stroke-width') || rootW) });
  }
  return { text, size, strokes, areas };
}
/** Exact ink of the stroked source: a round-capped, round-joined stroke is the centreline ⊕ a disc, so its box is the centreline's box ± w/2. */
export function idealInk(src) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const take = (polys, r) => { for (const { pts } of polys) for (const [x, y] of pts) { x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r); } };
  for (const s of src.strokes) take(flatten(s.d, { stepDeg: 0.01, curveSteps: 20000 }), s.w / 2);
  for (const a of src.areas) take(flatten(a.d, { stepDeg: 0.01, curveSteps: 20000 }), 0);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
export function geoError(src, d) {
  const cl = src.strokes.map(s => ({ w: s.w, polys: flatten(s.d, { stepDeg: 0.05, curveSteps: 2000 }) }));
  const ar = src.areas.map(a => flatten(a.d, { stepDeg: 0.05, curveSteps: 2000 }));
  let max = 0;
  for (const { pts } of flatten(d, { stepDeg: 0.5, curveSteps: 24, lineStep: 0.05 })) for (const [x, y] of pts) {
    let e = Infinity;
    for (const c of cl) e = Math.min(e, Math.abs(polyDist(x, y, c.polys) - c.w / 2));
    for (const p of ar) e = Math.min(e, polyDist(x, y, p));
    if (e > max) max = e;
  }
  return max;
}
export let SS = 8; export const setSS = (v) => { SS = v; };
const png = (svg, px) => new Resvg(svg.replaceAll('currentColor', '#000'), { fitTo: { mode: 'width', value: px }, background: 'rgba(0,0,0,0)', font: { loadSystemFonts: false } }).render().pixels;
/** Render source (stroked) and output (filled) at px and at 8×px box-filtered back down; returns max alpha diff and gross pixels (diff > 128 = a hole filled or a part lost). */
export function raster(srcText, outSvg, size, px) {
  const s = Math.round(px * size / 24), S = s * SS;
  const down = (buf) => { const o = new Float64Array(s * s); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) o[Math.floor(y / SS) * s + Math.floor(x / SS)] += buf[(y * S + x) * 4 + 3] / (SS * SS); return o; };
  const a = down(png(srcText, S)), b = down(png(outSvg, S));
  let max = 0, gross = 0; for (let i = 0; i < a.length; i++) { const v = Math.abs(a[i] - b[i]); if (v > max) max = v; if (v > 128) gross++; }
  return { max: Math.round(max), gross };
}
export function measure(rel, src, out, { geo = true } = {}) {
  const [master, name] = rel.split('/'); const r = {};
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${src.size} ${src.size}" fill="currentColor"><path fill-rule="${out.rule}" d="${out.d}"/></svg>\n`;
  const ink = inkOf(flatten(out.d)), ideal = idealInk(src), want = ICONS[master]?.[name]?.ink;
  r.inkVsIdeal = +Math.max(...['x', 'y', 'w', 'h'].map(k => Math.abs(ink[k] - ideal[k]))).toFixed(5);
  if (want) { r.inkMatch2dp = ['x', 'y', 'w', 'h'].every(k => Math.abs(+ink[k].toFixed(2) - want[k]) < 1e-9); r.idealMatch2dp = ['x', 'y', 'w', 'h'].every(k => Math.abs(+ideal[k].toFixed(2) - want[k]) < 1e-9); }
  r.subpaths = (out.d.match(/[Mm]/g) || []).length; r.cmds = cmdCounts(out.d); r.points = pointCount(out.d); r.bytes = out.d.length;
  r.srcBytes = [...src.strokes, ...src.areas].reduce((n, p) => n + p.d.length, 0); r.srcPoints = [...src.strokes, ...src.areas].reduce((n, p) => n + pointCount(p.d), 0);
  r.maxDecimals = maxDecimals(out.d);
  if (geo) r.geoErr = +geoError(src, out.d).toFixed(5);
  r.px24 = raster(src.text, svg, src.size, 24); r.px96 = raster(src.text, svg, src.size, 96);
  return { r, svg };
}
