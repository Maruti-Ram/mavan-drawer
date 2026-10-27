// Card 3.1 (plans/shipping.md): install the box as a customer and look at every icon in a real browser engine.
//   node plans/proof-install/run.mjs                 all four steps
//   node plans/proof-install/run.mjs shoot compare   only those steps (setup · shoot · compare · pinhole · others), in this order
//   PROOF_RASTER=gpu node plans/proof-install/run.mjs shoot compare pinhole    the same under Chromium's GPU rasterisation (SwiftShader)
// `npm run release` (no flags) must have run first: this proof starts from dist/release/mavan-drawer-<v>.zip.
import { setup } from './setup.mjs';
import { shoot } from './shoot.mjs';
import { compare } from './compare.mjs';
import { pinhole } from './pinhole.mjs';
import { others } from './others.mjs';

const steps = { setup, shoot, compare, pinhole, others };
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(steps);
for (const s of want) {
  if (!steps[s]) throw new Error(`unknown step ${s}; steps are ${Object.keys(steps).join(' · ')}`);
  const t = performance.now();
  await steps[s]();
  console.log(`${s}: done in ${((performance.now() - t) / 1000).toFixed(0)} s`);
}
console.log('results: plans/proof-install/out/{setup,shoot,compare,pinhole,others}.json, console.json, per-icon-react-vs-lab.tsv; crops in out/diffs/ and out/pinhole/');
