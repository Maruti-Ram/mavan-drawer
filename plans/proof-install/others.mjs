// Card 3.1, step 5 (the differences that are not pinholes): compare.mjs lists the icons whose different pixels are not
// a pinhole. For each, who is right? The pixel at 1× or 2× is drawn by two different geometries (a stroke, and the
// outlined fill that replaced it), each antialiased; this draws the icon again 16 times larger in Chromium, in both
// ways, and reads the same patch of the page there — a 16× render is accurate where the small one is rounded — so
// the patch's mean ink says what the pixel should be. Reads out/compare.json; writes out/others.json.
//   node plans/proof-install/others.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { OUT, LAUNCH, RASTER, outFile, readPng, grey } from './lib.mjs';
import { startServer } from './server.mjs';
import { openPage } from './shoot.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const K = 16;

export async function others() {
  // under the GPU rasteriser thousands of cells differ by a quantised edge step (and the control is not 0): not worth a page each
  if (RASTER === 'gpu') { const out = { skipped: 'not run under PROOF_RASTER=gpu: that mode differs on thousands of edge pixels and is not repeatable', cells: 0, rows: [], console: [] }; writeFileSync(outFile('others'), `${JSON.stringify(out, null, 2)}\n`); return out; }
  const cmp = JSON.parse(readFileSync(outFile('compare'), 'utf8'));
  const list = cmp.differences.filter((d) => d.pair === 'react|lab' && !d.pinholeOnly);
  const srv = await startServer(), browser = await chromium.launch(LAUNCH), log = [], rows = [];
  try {
    const cache = new Map();
    for (const d of list) {
      const key = `${d.master}/${d.name}`;
      if (!cache.has(key)) {
        const ctx = await browser.newContext({ viewport: { width: 2 * K * d.master + 60, height: 8 + K * d.master }, deviceScaleFactor: 1 });
        const page = await openPage(ctx, srv.origin, `mode=scaled&file=${d.name}&m=${d.master}&ks=${K}`, log);
        const rects = await page.evaluate(() => [...document.querySelectorAll('.cell')].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top]; }));
        cache.set(key, { png: readPng(await page.screenshot()), rects });
        await page.close(); await ctx.close();
      }
      const { png, rects } = cache.get(key), half = 0.5 / d.scale;
      // the patch of the icon the worst pixel covers, in master units, read at K× in each render
      const patch = ([ox, oy]) => {
        let sum = 0, n = 0;
        for (let y = Math.round(oy + (d.worst.y - half) * K); y < Math.round(oy + (d.worst.y + half) * K); y++) for (let x = Math.round(ox + (d.worst.x - half) * K); x < Math.round(ox + (d.worst.x + half) * K); x++) { sum += grey(png, x, y); n++; }
        return Math.round(sum / n);
      };
      rows.push({ scale: d.scale, master: d.master, name: d.name, at: [d.worst.x, d.worst.y], pixelInTheLab: d.worst.ref, pixelInTheBox: d.worst.box, sixteenTimesLab: patch(rects[0]), sixteenTimesBox: patch(rects[1]) });
    }
  } finally { await browser.close(); srv.close(); }
  for (const r of rows) {
    const lab = Math.abs(r.pixelInTheLab - r.sixteenTimesLab), box = Math.abs(r.pixelInTheBox - r.sixteenTimesBox), truth = r.sixteenTimesLab, boxTruth = r.sixteenTimesBox;
    r.truthLabVsBox16 = Math.abs(truth - boxTruth);          // do the two geometries agree when drawn accurately?
    r.nearerTheTruth = Math.abs(r.pixelInTheLab - truth) < Math.abs(r.pixelInTheBox - truth) ? 'lab' : Math.abs(r.pixelInTheLab - truth) > Math.abs(r.pixelInTheBox - truth) ? 'box' : 'tie';
    r.labPixelOffBy16x = lab; r.boxPixelOffBy16x = box;
  }
  const out = { K, cells: rows.length, rows, console: log };
  writeFileSync(outFile('others'), `${JSON.stringify(out, null, 2)}\n`);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await others();
  if (r.skipped) { console.log(r.skipped); process.exit(0); }
  console.log(JSON.stringify({ cells: r.cells, consoleMessages: r.console.length, nearer: Object.fromEntries(['lab', 'box', 'tie'].map((k) => [k, r.rows.filter((x) => x.nearerTheTruth === k).length])), geometriesAgreeAt16xWithin32: r.rows.filter((x) => x.truthLabVsBox16 <= 32).length }, null, 2));
  console.table(r.rows.map((x) => ({ s: `${x.scale}x`, m: x.master, name: x.name, lab: x.pixelInTheLab, box: x.pixelInTheBox, lab16: x.sixteenTimesLab, box16: x.sixteenTimesBox, nearer: x.nearerTheTruth })));
}
