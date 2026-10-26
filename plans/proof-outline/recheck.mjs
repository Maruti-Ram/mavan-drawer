// node recheck.mjs <approach> — re-judges every file the full run flagged (gross raster pixels or geo error > 0.001)
// against an independent exact reference: each 96 px pixel, 4×4 samples, is ink when a sample lies within w/2 of a
// stroke's centreline or inside an area path (even-odd). No stroker is involved, so renderer stroke quirks drop out.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { HERE, readSource } from './measure.mjs';
import { flatten, segDist } from './pathkit.mjs';
import * as A from './approaches.mjs'; import { exactStroke, exactCapsules, exactClean } from './exact.mjs';
const require = createRequire(import.meta.url); const { Resvg } = require('@resvg/resvg-js');
const name = process.argv[2];
const ap = { 'exact+clean': exactClean(), 'exact-capsules': exactCapsules(), 'exact-stroke': exactStroke(), 'skia-p16': A.skia(16), 'paper+offset': A.paperOffset(), makerjs: A.maker() }[name]; await ap.init();
const all = Object.assign({}, ...fs.readdirSync(path.join(HERE, 'out/full')).filter(f => f.startsWith(name + '.') && f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(HERE, 'out/full', f)))));
const only = process.argv.slice(3);
const flagged = only.length ? only : Object.entries(all).filter(([, r]) => r.error || r.px96?.gross > 0 || r.px24?.gross > 0 || r.geoErr > 0.001 || r.inkVsIdeal > 0.005).map(([k]) => k);
function ideal(src, px, SS) {
  const S = px * SS, k = src.size / S, cov = new Float64Array(px * px);
  const st = src.strokes.map(s => ({ h: s.w / 2, segs: flatten(s.d, { stepDeg: 0.25, curveSteps: 200 }).flatMap(({ pts, closed }) => { const o = []; for (let i = 1; i < pts.length; i++) o.push([...pts[i - 1], ...pts[i]]); if (pts.length === 1) o.push([...pts[0], ...pts[0]]); if (closed && pts.length > 1) o.push([...pts[pts.length - 1], ...pts[0]]); return o; }) }));
  const ar = src.areas.map(a => flatten(a.d, { stepDeg: 0.25, curveSteps: 200 }).map(p => p.pts));
  const inPoly = (x, y, rings) => { let c = false; for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  // bucket every centreline piece into 0.5-unit cells it can reach within its pen
  const C = 0.5, G = Math.ceil(src.size / C) + 1, cells = Array.from({ length: G * G }, () => []);
  for (const s of st) for (const g of s.segs) {
    const x0 = Math.max(0, Math.floor((Math.min(g[0], g[2]) - s.h) / C)), x1 = Math.min(G - 1, Math.floor((Math.max(g[0], g[2]) + s.h) / C));
    const y0 = Math.max(0, Math.floor((Math.min(g[1], g[3]) - s.h) / C)), y1 = Math.min(G - 1, Math.floor((Math.max(g[1], g[3]) + s.h) / C));
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) cells[cy * G + cx].push([g, s.h]);
  }
  for (let Y = 0; Y < S; Y++) for (let X = 0; X < S; X++) {
    const x = (X + 0.5) * k, y = (Y + 0.5) * k; let ink = false;
    for (const [g, h] of cells[Math.floor(y / C) * G + Math.floor(x / C)]) if (segDist(x, y, g[0], g[1], g[2], g[3]) <= h) { ink = true; break; }
    if (!ink) for (const r of ar) if (inPoly(x, y, r)) { ink = true; break; }
    if (ink) cov[Math.floor(Y / SS) * px + Math.floor(X / SS)] += 255 / (SS * SS);
  }
  return cov;
}
const bad = [];
for (const rel of flagged) {
  const src = readSource(rel); let out;
  try { out = ap.convert(src); } catch (e) { bad.push([rel, 'error ' + e.message]); continue; }
  const px = Math.round(96 * src.size / 24), SS = 4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${src.size} ${src.size}"><path fill-rule="${out.rule}" d="${out.d}"/></svg>`;
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: px * SS }, font: { loadSystemFonts: false } }).render().pixels;
  const o = new Float64Array(px * px); for (let Y = 0; Y < px * SS; Y++) for (let X = 0; X < px * SS; X++) o[Math.floor(Y / SS) * px + Math.floor(X / SS)] += img[(Y * px * SS + X) * 4 + 3] / (SS * SS);
  const ref = ideal(src, px, SS); let max = 0, gross = 0; for (let i = 0; i < o.length; i++) { const v = Math.abs(o[i] - ref[i]); max = Math.max(max, v); if (v > 128) gross++; }
  if (gross) bad.push([rel, `gross ${gross} max ${Math.round(max)} geo ${all[rel].geoErr ?? '-'}`]);
}
console.log(`${name}: ${flagged.length} flagged by the full run; against the exact reference ${bad.length} still wrong`);
bad.slice(0, 30).forEach(b => console.log('  ', b.join('  ')));
fs.writeFileSync(path.join(HERE, `out/recheck-${name}.json`), JSON.stringify({ flagged, bad }, null, 1));
