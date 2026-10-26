// node cleanup.mjs — makerjs output on the sample, then a cleanup pass (numbers to 3 dp, compact syntax); measures again.
import fs from 'node:fs'; import path from 'node:path';
import { HERE, readSource, measure } from './measure.mjs';
import { normalise, arcPts } from './pathkit.mjs';
import * as A from './approaches.mjs';
import { SAMPLE } from './sample.mjs';
const r3 = (v) => { const s = (Math.round(v * 1000) / 1000).toFixed(3).replace(/\.?0+$/, ''); return s === '-0' ? '0' : s; };
export function clean(d) {
  // Re-emit from the normalised segments: absolute M/L/A/Z (H/V where axis-aligned), 3 dp, no spaces where not needed.
  let o = '';
  const j = (...n) => n.map(r3).join(' ').replace(/ -/g, '-');
  for (const { segs, closed } of normalise(d)) {
    if (!segs.length) continue;
    o += 'M' + j(...segs[0].p[0]);
    segs.forEach((s, i) => {
      const last = closed && i === segs.length - 1 && s.t === 'L';
      if (last) return; // Z draws it
      const [x0, y0] = s.p[0], [x1, y1] = s.p[s.p.length - 1];
      if (s.t === 'L') o += r3(y0) === r3(y1) ? 'H' + r3(x1) : r3(x0) === r3(x1) ? 'V' + r3(y1) : 'L' + j(x1, y1);
      else if (s.t === 'A') {
        // A half-circle arc is ill-conditioned once its ends are rounded (the centre moves by √(2rε)); split every arc over 90° into ≤ 90° pieces.
        const k = {}; arcPts(x0, y0, s.rx, s.ry, s.rot, s.fa, s.fs, x1, y1, 90, k);
        const n = Math.max(1, Math.ceil(Math.abs(k.dt) / (Math.PI / 2) - 1e-9));
        for (let q = 1; q <= n; q++) {
          const t = k.t1 + k.dt * q / n, px = Math.cos(t) * k.rx, py = Math.sin(t) * k.ry;
          const ex = q === n ? x1 : k.cos * px - k.sin * py + k.cx, ey = q === n ? y1 : k.sin * px + k.cos * py + k.cy;
          o += 'A' + j(s.rx, s.ry, s.rot) + ` 0 ${s.fs} ` + j(ex, ey);
        }
      }
      else if (s.t === 'C') o += 'C' + j(...s.p[1], ...s.p[2], ...s.p[3]);
      else if (s.t === 'Q') o += 'Q' + j(...s.p[1], ...s.p[2]);
    });
    if (closed) o += 'Z';
  }
  return o;
}
import { pathToFileURL } from "node:url";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ap = A.maker(); await ap.init();
  for (const rel of SAMPLE) {
    const src = readSource(rel); const raw = ap.convert(src); const out = { d: clean(raw.d), rule: raw.rule };
    const { r, svg } = measure(rel, src, out);
    const [m, n] = rel.split('/'); fs.mkdirSync(path.join(HERE, 'out/makerjs-clean', m), { recursive: true }); fs.writeFileSync(path.join(HERE, 'out/makerjs-clean', m, n + '.svg'), svg);
    console.log(rel.padEnd(27), `ink±${r.inkVsIdeal} ${r.inkMatch2dp ? '✓' : '✗'} geo ${r.geoErr} sub ${r.subpaths} ${JSON.stringify(r.cmds)} pts ${r.points}/${r.srcPoints} B ${r.bytes}/${r.srcBytes} (raw ${raw.d.length}) dp ${r.maxDecimals} px96 ${r.px96.max}/${r.px96.gross}`);
  }
}
