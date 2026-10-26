// node run.mjs [approach…] — the 16-file sample, every approach; writes out/<approach>/<master>/<name>.svg and out/results.json
import fs from 'node:fs'; import path from 'node:path';
import { HERE, readSource, measure } from './measure.mjs';
import * as A from './approaches.mjs'; import { exactStroke, exactCapsules, exactClean } from './exact.mjs';
import { SAMPLE } from './sample.mjs';
const which = process.argv.slice(2);
const approaches = [A.skia(1), A.skia(16), A.paperOffset(), A.maker(), exactStroke(), exactClean()].filter(a => !which.length || which.includes(a.name));
const results = {};
for (const ap of approaches) {
  await ap.init(); results[ap.name] = {};
  for (const rel of SAMPLE) {
    const src = readSource(rel); let r;
    try {
      const t0 = performance.now(); let out; for (let i = 0; i < 5; i++) out = ap.convert(src); const ms = (performance.now() - t0) / 5;
      const m = measure(rel, src, out); r = { ...m.r, ms: +ms.toFixed(2) };
      const [master, name] = rel.split('/'); fs.mkdirSync(path.join(HERE, 'out', ap.name, master), { recursive: true });
      fs.writeFileSync(path.join(HERE, 'out', ap.name, master, name + '.svg'), m.svg);
    } catch (e) { r = { error: String(e.message || e).slice(0, 160) }; }
    results[ap.name][rel] = r;
    console.log(ap.name.padEnd(12), rel.padEnd(27), r.error ? 'ERROR ' + r.error : `ink±${r.inkVsIdeal} ${r.inkMatch2dp ? '✓' : '✗'}${r.idealMatch2dp ? '' : '(ideal✗)'} geo ${r.geoErr} sub ${r.subpaths} ${JSON.stringify(r.cmds)} pts ${r.points}/${r.srcPoints} B ${r.bytes}/${r.srcBytes} dp ${r.maxDecimals} px24 ${r.px24.max}/${r.px24.gross} px96 ${r.px96.max}/${r.px96.gross} ${r.ms}ms`);
  }
}
fs.writeFileSync(path.join(HERE, 'out/results.json'), JSON.stringify(results, null, 1));
