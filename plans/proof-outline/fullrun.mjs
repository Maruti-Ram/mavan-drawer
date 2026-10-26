// node fullrun.mjs <approach> <shard> <shards> <geoEvery> — every file in src/icons/{24,20,16}; writes out/full/<approach>.<shard>.json
import fs from 'node:fs'; import path from 'node:path';
import { HERE, REPO, readSource, measure, setSS } from './measure.mjs'; setSS(4);
import * as A from './approaches.mjs'; import { exactStroke, exactCapsules, exactClean } from './exact.mjs';
const [name, shard, shards, geoEvery] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5]];
const ap = { 'exact+clean': exactClean(), 'exact-capsules': exactCapsules(), 'exact-stroke': exactStroke(), 'skia-p16': A.skia(16), 'paper+offset': A.paperOffset(), makerjs: A.maker() }[name];
await ap.init();
const files = ['24', '20', '16'].flatMap(m => fs.readdirSync(path.join(REPO, 'src/icons', m)).filter(f => f.endsWith('.svg')).sort().map(f => `${m}/${f.slice(0, -4)}`));
const res = {};
fs.mkdirSync(path.join(HERE, 'out/full'), { recursive: true }); fs.writeFileSync(path.join(HERE, `out/full/${name}.${shard}.log`), '');
files.forEach((rel, i) => {
  if (i % shards !== shard) return;
  const src = readSource(rel); let r;
  fs.appendFileSync(path.join(HERE, `out/full/${name}.${shard}.log`), rel + '\n');
  try {
    const t0 = performance.now(); const out = ap.convert(src); const ms = performance.now() - t0;
    const t1 = performance.now(); r = { ...measure(rel, src, out, { geo: (i >> 3) % geoEvery === 0 }).r, ms: +ms.toFixed(2) }; r.measureMs = Math.round(performance.now() - t1);
    fs.appendFileSync(path.join(HERE, `out/full/${name}.${shard}.log`), `  conv ${ms.toFixed(1)}ms measure ${r.measureMs}ms\n`);
  } catch (e) { r = { error: String(e.message || e).slice(0, 160) }; }
  res[rel] = r;
});
fs.mkdirSync(path.join(HERE, 'out/full'), { recursive: true });
fs.writeFileSync(path.join(HERE, `out/full/${name}.${shard}.json`), JSON.stringify(res));
console.log(name, shard, Object.keys(res).length);
