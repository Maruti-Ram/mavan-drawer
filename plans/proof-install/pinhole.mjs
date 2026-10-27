// Card 3.1, step 4: the pinhole question, settled in Chromium at 1× and 2×.
// Skia leaves an empty pixel in the middle of a dot drawn as a stroked circle whose radius is under half its stroke.
// Does the stroked source, drawn the way the lab draws it, show it — and is the box (the outlined file) solid?
//   A. the census of such dots in src/icons/ (and of the thin loops narrower than their pen)
//   B. every dot of the census, measured in the grids shoot.mjs saved (the same pages compare.mjs reads): the value
//      of the pixel that holds the dot's centre and of the lightest pixel near it, for the stroked source as the lab
//      draws it, the React component and the .svg file (0 = full ink, 255 = white)
//   C. the four named files at k times their size (1, 2, 4, 8) — what the lab's bigger views also show
// Reads out/shots/; writes out/pinhole.json and enlarged crops in out/pinhole/.
//   node plans/proof-install/pinhole.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { OUT, SHOTS, SUFFIX, LAUNCH, KINDS as RUN_KINDS, outFile, MASTERS, SCALES, COLS, cell, ensure, readPng, writePng, sideBySide, grey, thinCensus, fileNames } from './lib.mjs';
import { startServer } from './server.mjs';
import { openPage } from './shoot.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const NAMED = ['more-horizontal-filled', 'drag-handle-filled', 'list-bullet-2-filled', 'calculator'];
const KINDS = ['lab', 'react', 'svg', 'img'].filter((k) => RUN_KINDS.includes(k));
const LIGHTER = 32;            // the source has a hole when its centre is at least this much lighter (of 255) than the box's

/** What a render shows of one dot; (cx, cy) the dot's centre and `reach` the pinhole's reach, both in device pixels of
 *  `png`. `centre` is the pixel that holds the centre point; `lightest` the lightest pixel whose own centre lies
 *  within max(0.75, reach) of it (0 = full ink, 255 = white): at 1× that is the pixel or the four around the centre. */
function measure(png, cx, cy, reach) {
  const rho = Math.max(0.75, reach), x0 = Math.floor(cx - rho) - 1, x1 = Math.ceil(cx + rho) + 1, y0 = Math.floor(cy - rho) - 1, y1 = Math.ceil(cy + rho) + 1;
  let lightest = 0, empty = 0;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) > rho) continue;
    const g = grey(png, x, y);
    lightest = Math.max(lightest, g);
    if (g >= 128) empty++;
  }
  return { centre: grey(png, Math.floor(cx), Math.floor(cy)), lightest, emptyPixels: empty };
}

const hist = (vals) => ({ '0': vals.filter((v) => v === 0).length, '1-32': vals.filter((v) => v >= 1 && v <= 32).length, '33-127': vals.filter((v) => v >= 33 && v <= 127).length, '128-254': vals.filter((v) => v >= 128 && v <= 254).length, '255': vals.filter((v) => v === 255).length });

/** Lab vs box over a list of { lab, box } measurements. */
function verdict(rows) {
  const delta = rows.map((r) => r.lab.lightest - r.box.lightest), centreDelta = rows.map((r) => r.lab.centre - r.box.centre);
  return {
    dots: rows.length,
    sourceCentreLighterByAtLeast32: delta.filter((d) => d >= LIGHTER).length,
    sourceCentreLighterByAtLeast128: delta.filter((d) => d >= 128).length,
    sourceCentreLighterThanBox: delta.filter((d) => d > 0).length,
    boxCentreLighterThanSourceBy32: delta.filter((d) => d <= -LIGHTER).length,
    sourceEmptyPixels: rows.reduce((s, r) => s + r.lab.emptyPixels, 0),
    boxEmptyPixels: rows.reduce((s, r) => s + r.box.emptyPixels, 0),
    largestLightening: Math.max(...delta),
    largestCentrePixelLightening: Math.max(...centreDelta),
    centrePixelSource: hist(rows.map((r) => r.lab.centre)),
    centrePixelBox: hist(rows.map((r) => r.box.centre)),
  };
}

export async function pinhole() {
  const { files } = fileNames(), index = new Map(files.map((f, i) => [f, i]));
  const census = thinCensus(), dots = census.filter((x) => x.kind === 'dot'), caps = census.filter((x) => x.kind === 'capsule');
  const res = {
    census: {
      dots: dots.length, dotFiles: new Set(dots.map((d) => `${d.master}/${d.name}`)).size, thinLoops: caps.length,
      files: new Set(census.map((d) => `${d.master}/${d.name}`)).size, names: new Set(census.map((d) => d.name)).size,
      byMaster: Object.fromEntries(MASTERS.map((m) => [m, { dots: dots.filter((d) => d.master === m).length, thinLoops: caps.filter((d) => d.master === m).length }])),
      outlineFiles: new Set(census.filter((d) => !d.name.endsWith('-filled')).map((d) => `${d.master}/${d.name}`)).size,
      filledFiles: new Set(census.filter((d) => d.name.endsWith('-filled')).map((d) => `${d.master}/${d.name}`)).size,
      radiusAndStroke: [...new Set(dots.map((d) => `${d.master}: r ${d.r}, stroke ${d.w}`))].sort(),
      thinLoopNames: [...new Set(caps.map((d) => d.name))],
    },
    grid: {}, named: {}, scaled: {},
  };
  const PDIR = ensure(join(OUT, `pinhole${SUFFIX}`));

  // ---- B. the grids
  for (const scale of SCALES) for (const S of MASTERS) {
    const png = {}, P = cell(S);
    for (const k of KINDS) png[k] = readPng(readFileSync(join(SHOTS, `${scale}x`, `${S}-${k}.png`)));
    const mine = dots.filter((d) => d.master === S), rows = [];
    for (const d of mine) {
      const i = index.get(d.name), ox = (i % COLS) * P + 4, oy = Math.floor(i / COLS) * P + 4, reach = (d.w / 2 - d.r) * scale;
      const m = Object.fromEntries(KINDS.map((k) => [k, measure(png[k], (ox + d.cx) * scale, (oy + d.cy) * scale, reach)]));
      rows.push({ d, lab: m.lab, box: m.react, svg: m.svg, img: m.img });
    }
    const outline = rows.filter((r) => !r.d.name.endsWith('-filled')), filled = rows.filter((r) => r.d.name.endsWith('-filled'));
    res.grid[`${scale}x ${S}`] = {
      all: verdict(rows), outlineFiles: verdict(outline), filledFiles: verdict(filled),
      // the control: the React component and the .svg file give the same centre values
      reactEqualsSvgFile: rows.every((r) => r.box.centre === r.svg.centre && r.box.lightest === r.svg.lightest),
      reactEqualsImg: KINDS.includes('img') ? rows.every((r) => r.box.centre === r.img.centre && r.box.lightest === r.img.lightest) : null,
    };

    // the named files, dot by dot, and crops: the whole icon and the first dot close up (source · box · difference)
    for (const name of NAMED) {
      const dd = rows.filter((r) => r.d.name === name);
      if (!dd.length) continue;
      res.named[`${scale}x ${S} ${name}`] = dd.map((r) => ({ cx: r.d.cx, cy: r.d.cy, r: r.d.r, stroke: r.d.w, pinholeReachUnits: +(r.d.w / 2 - r.d.r).toFixed(3), source: { centrePixel: r.lab.centre, lightestNearCentre: r.lab.lightest }, box: { centrePixel: r.box.centre, lightestNearCentre: r.box.lightest }, svgFile: { centrePixel: r.svg.centre } }));
      const i = index.get(name), ox = (i % COLS) * P * scale, oy = Math.floor(i / COLS) * P * scale, Pd = P * scale;
      const whole = sideBySide(png.lab, png.react, ox, oy, Pd, Pd, Math.max(6, Math.floor(300 / Pd)));
      writeFileSync(join(PDIR, `${scale}x-${S}-${name}.png`), writePng(whole.width, whole.height, whole.rgba));
      const d0 = dd[0].d, w = Math.ceil(2 * d0.R * scale) + 4, cx0 = Math.floor(ox + (4 + d0.cx) * scale - w / 2), cy0 = Math.floor(oy + (4 + d0.cy) * scale - w / 2);
      const close = sideBySide(png.lab, png.react, cx0, cy0, w, w, Math.max(8, Math.floor(200 / w)));
      writeFileSync(join(PDIR, `${scale}x-${S}-${name}-dot.png`), writePng(close.width, close.height, close.rgba));
    }
    console.error(`pinhole grid ${scale}x ${S}`);
  }

  // ---- C. the named files at k × size: the stroked source as the lab draws it beside the installed file
  const srv = await startServer(), browser = await chromium.launch(LAUNCH), log = [];
  try {
    const KS = [1, 2, 4, 8];
    for (const scale of SCALES) for (const name of NAMED) for (const m of [24, 16]) {
      const mine = dots.filter((d) => d.master === m && d.name === name);
      if (!mine.length) continue;
      const ctx = await browser.newContext({ viewport: { width: 1700, height: 8 + 8 * m }, deviceScaleFactor: scale });
      const page = await openPage(ctx, srv.origin, `mode=scaled&file=${name}&m=${m}&ks=${KS.join(',')}`, log);
      const rects = await page.evaluate(() => [...document.querySelectorAll('.cell')].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top]; }));
      const buf = await page.screenshot(), png = readPng(buf);
      writeFileSync(join(PDIR, `scaled-${scale}x-${m}-${name}.png`), buf);
      const byK = {};
      KS.forEach((k, ki) => {
        const [lx, ly] = rects[2 * ki], [bx, by] = rects[2 * ki + 1];
        const rows = mine.map((d) => {
          const reach = (d.w / 2 - d.r) * k * scale;
          return { lab: measure(png, (lx + d.cx * k) * scale, (ly + d.cy * k) * scale, reach), box: measure(png, (bx + d.cx * k) * scale, (by + d.cy * k) * scale, reach) };
        });
        const v = verdict(rows);
        byK[`${k}x`] = { px: k * m, dots: v.dots, sourceCentreLighterByAtLeast32: v.sourceCentreLighterByAtLeast32, sourceCentrePixels: rows.map((r) => r.lab.centre), boxCentrePixels: rows.map((r) => r.box.centre), sourceEmptyPixels: v.sourceEmptyPixels, boxEmptyPixels: v.boxEmptyPixels };
      });
      res.scaled[`${scale}x ${m} ${name}`] = byK;
      await page.close(); await ctx.close();
    }
  } finally { await browser.close(); srv.close(); }
  res.console = log;
  writeFileSync(outFile('pinhole'), `${JSON.stringify(res, null, 2)}\n`);
  return res;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await pinhole();
  const brief = Object.fromEntries(Object.entries(r.grid).map(([k, v]) => [k, { dots: v.all.dots, sourceHole32: v.all.sourceCentreLighterByAtLeast32, sourceHole128: v.all.sourceCentreLighterByAtLeast128, boxLighter32: v.all.boxCentreLighterThanSourceBy32, reactEqualsSvgFile: v.reactEqualsSvgFile }]));
  console.log(JSON.stringify({ census: r.census, grid: brief, consoleMessages: r.console.length }, null, 2));
}
