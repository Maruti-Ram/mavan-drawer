// Card 3.1, steps 3 and 5: compares the pages shoot.mjs saved, pixel for pixel, as the 1.1 raster gate does — a pixel is
// "different" when its colour differs by more than 127 of 255 (more than half of full coverage). Also counts the
// smaller differences, so antialiasing is told apart from a real bit of ink; runs the controls (a kind drawn twice
// must give 0); lists every icon with a difference; classifies each as a pinhole (every different pixel is lighter in the
// source and lies where Skia's inverted inner stroke edge leaves its hole: in the middle of a dot the source draws as a
// stroked circle under half its stroke, or inside a thin loop narrower than its pen) or something else; and writes the
// enlarged source · box · difference crops and the summary sheet diffs.png.
//   node plans/proof-install/compare.mjs
import { readFileSync, writeFileSync, existsSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { HERE, OUT, SHOTS, SUFFIX, LAUNCH, outFile, MASTERS, SCALES, KINDS, COLS, cell, ensure, readPng, writePng, sideBySide, thinCensus, fileNames } from './lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
// [box side, reference side, what it is]. The headline is the first: the React component the customer installed
// against the stroked source as the lab draws it.
const ALL_PAIRS = [
  ['react', 'lab', 'headline: React component vs the lab'],
  ['svg', 'lab', 'installed .svg inlined vs the lab'],
  ['img', 'lab', 'installed .svg as <img> vs the lab'],
  ['react', 'svg', 'control: React component vs the installed .svg inlined'],
  ['svg', 'img', 'control: installed .svg inlined vs as <img>'],
  ['lab', 'lab2', 'control: the lab drawn twice'],
  ['react', 'react2', 'control: React drawn twice'],
];
export const PAIRS = ALL_PAIRS.filter(([a, b]) => KINDS.includes(a) && KINDS.includes(b));
const HEADLINE = 'react|lab';

/** Compares two same-size grids cell by cell. Returns totals and, per file, its histogram. */
function compareGrids(a, b, files, S, scale, dotsOf, keep) {
  if (a.width !== b.width || a.height !== b.height) throw new Error(`grids differ in size: ${a.width}×${a.height} vs ${b.width}×${b.height}`);
  const P = cell(S) * scale, ch = a.channels, tot = { cells: files.length, pixels: 0, hist: [0, 0, 0, 0], max: 0, iconsAny: 0, icons127: 0 }, list = [], per = [];
  files.forEach((f, i) => {
    const cx0 = (i % COLS) * P, cy0 = Math.floor(i / COLS) * P, dots = dotsOf(f);
    const h = [0, 0, 0, 0]; let max = 0, near = 0, far = 0, hard = 0, worst = null;
    for (let y = 0; y < P; y++) {
      const ro = ((cy0 + y) * a.width + cx0) * ch, len = P * ch;
      if (a.data.compare(b.data, ro, ro + len, ro, ro + len) === 0) { h[0] += P; continue; }
      for (let x = 0; x < P; x++) {
        const o = ro + x * ch;
        const d = Math.max(Math.abs(a.data[o] - b.data[o]), Math.abs(a.data[o + 1] - b.data[o + 1]), Math.abs(a.data[o + 2] - b.data[o + 2]));
        if (d === 0) h[0]++;
        else {
          if (d > max) { max = d; worst = { x: +((x + 0.5) / scale - 4).toFixed(2), y: +((y + 0.5) / scale - 4).toFixed(2), box: a.data[o], ref: b.data[o] }; }
          if (d <= 32) h[1]++; else if (d <= 127) h[2]++;
          else {
            h[3]++;
            if (Math.min(a.data[o], b.data[o]) <= 32 && Math.max(a.data[o], b.data[o]) >= 224) hard++;     // ink on one side, almost none on the other
            // a pinhole pixel: the stroked source is the lighter side, and the pixel lies where Skia's inverted inner edge
            // of a too-thin stroke leaves its hole — within (half the stroke − radius) + 0.75 of a dot's centre, or inside
            // a thin loop's ink box (master units from the icon's origin)
            const ux = (x + 0.5) / scale - 4, uy = (y + 0.5) / scale - 4, lighter = b.data[o] > a.data[o];
            if (lighter && dots.some((q) => (q.kind === 'dot' ? Math.hypot(ux - q.cx, uy - q.cy) <= q.w / 2 - q.r + 0.75 : ux >= q.box[0] && ux <= q.box[2] && uy >= q.box[1] && uy <= q.box[3]))) near++; else far++;
          }
        }
      }
    }
    tot.pixels += P * P; for (let k = 0; k < 4; k++) tot.hist[k] += h[k];
    tot.max = Math.max(tot.max, max);
    if (h[1] + h[2] + h[3]) tot.iconsAny++;
    if (h[3]) { tot.icons127++; list.push({ name: f, over127: h[3], mid: h[2], small: h[1], max, inkVsNone: hard, worst, pinholeOnly: far === 0, nearDots: near, farFromDots: far, cell: [cx0, cy0, P] }); }
    if (keep) per.push([f, h[1] + h[2] + h[3], h[1], h[2], h[3], max]);
  });
  return { tot, list, per };
}

/** Ink per cell: is the cell blank, and is there ink outside the icon's own S×S square (in the slot's 4 px margin)? */
function inkOf(png, files, S, scale) {
  const P = cell(S) * scale, m = 4 * scale, ch = png.channels;
  let blank = 0, outside = 0; const blankList = [], outsideList = [];
  files.forEach((f, i) => {
    const cx0 = (i % COLS) * P, cy0 = Math.floor(i / COLS) * P;
    let ink = false, out = false;
    for (let y = 0; y < P; y++) for (let x = 0; x < P; x++) {
      const o = ((cy0 + y) * png.width + cx0 + x) * ch;
      if (png.data[o] === 255 && png.data[o + 1] === 255 && png.data[o + 2] === 255) continue;
      ink = true;
      if (x < m || y < m || x >= P - m || y >= P - m) out = true;
    }
    if (!ink) { blank++; blankList.push(f); }
    if (out) { outside++; outsideList.push(f); }
  });
  return { blank, blankList: blankList.slice(0, 20), outsideItsBox: outside, outsideList: outsideList.slice(0, 20) };
}

export async function compare() {
  const { files } = fileNames(), census = thinCensus(), byFile = new Map();
  for (const d of census) { const k = `${d.master}/${d.name}`; if (!byFile.has(k)) byFile.set(k, []); byFile.get(k).push(d); }
  rmSync(join(OUT, `diffs${SUFFIX}`), { recursive: true, force: true });
  const res = { names: files.length / 2, files: files.length, pairs: {}, byScaleMaster: {}, ink: {}, differences: [], notes: [] };
  const tsv = ['scale\tmaster\tname\tdifferent_nonzero\tdiff_1_32\tdiff_33_127\tdiff_over_127\tmax'];
  const crops = [];
  for (const [bx, rf] of PAIRS) res.pairs[`${bx}|${rf}`] = { what: PAIRS.find((p) => p[0] === bx && p[1] === rf)[2], pixels: 0, hist: [0, 0, 0, 0], max: 0, iconCells: 0, iconCellsAny: 0, iconCellsOver127: 0, bySize: {} };

  for (const scale of SCALES) for (const S of MASTERS) {
    const png = {};
    for (const k of KINDS) {
      const f = join(SHOTS, `${scale}x`, `${S}-${k}.png`);
      if (existsSync(f)) png[k] = readPng(readFileSync(f));
    }
    const dotsOf = (f) => byFile.get(`${S}/${f}`) ?? [];
    res.ink[`${scale}x ${S}`] = { lab: inkOf(png.lab, files, S, scale), react: inkOf(png.react, files, S, scale) };
    for (const [bx, rf] of PAIRS) {
      const key = `${bx}|${rf}`, headline = key === HEADLINE;
      const r = compareGrids(png[bx], png[rf], files, S, scale, dotsOf, headline);
      const P = res.pairs[key];
      P.pixels += r.tot.pixels; for (let k = 0; k < 4; k++) P.hist[k] += r.tot.hist[k];
      P.max = Math.max(P.max, r.tot.max); P.iconCells += r.tot.cells; P.iconCellsAny += r.tot.iconsAny; P.iconCellsOver127 += r.tot.icons127;
      P.bySize[`${scale}x ${S}`] = { cells: r.tot.cells, pixels: r.tot.pixels, hist: r.tot.hist, max: r.tot.max, iconsAnyDifference: r.tot.iconsAny, iconsOver127: r.tot.icons127 };
      if (headline) {
        for (const p of r.per) tsv.push([`${scale}x`, S, ...p].join('\t'));
        // enlarged source · box · difference crops of every icon with a pixel over 127
        const dir = ensure(join(OUT, `diffs${SUFFIX}`, `${scale}x`));
        for (const d of r.list) {
          const [cx0, cy0, Pd] = d.cell, f = Math.max(4, Math.floor(288 / Pd));
          const sbs = sideBySide(png.lab, png.react, cx0, cy0, Pd, Pd, f);
          const file = join(dir, `${S}-${d.name}.png`);
          writeFileSync(file, writePng(sbs.width, sbs.height, sbs.rgba));
          d.crop = `out/diffs${SUFFIX}/${scale}x/${S}-${d.name}.png`;
          crops.push({ ...d, scale, master: S, file });
        }
      }
      for (const d of r.list) res.differences.push({ pair: key, scale, master: S, ...d });
    }
    console.error(`compared ${scale}x ${S}`);
  }
  writeFileSync(outFile('per-icon-react-vs-lab', 'tsv'), `${tsv.join('\n')}\n`);
  res.crops = crops.length;

  // the summary sheet of the worst: only if there is something over 127 to show
  const headlineList = res.differences.filter((d) => d.pair === HEADLINE).sort((a, b) => b.over127 - a.over127 || b.max - a.max);
  res.headlineIconCells = headlineList.length;
  res.headlineIcons = new Set(headlineList.map((d) => d.name)).size;
  // the sheet shows what is not a pinhole first (worst first), then the worst pinholes
  const others = headlineList.filter((d) => !d.pinholeOnly).sort((a, b) => b.inkVsNone - a.inkVsNone || b.max - a.max), pins = headlineList.filter((d) => d.pinholeOnly);
  if (headlineList.length) res.sheet = await sheet([...others.slice(0, 12), ...pins].slice(0, 24));
  // the totals the report quotes
  const hp = res.pairs[HEADLINE], pinCells = headlineList.filter((d) => d.pinholeOnly), othCells = headlineList.filter((d) => !d.pinholeOnly);
  const sum = (a, k) => a.reduce((s, d) => s + d[k], 0), files_ = (a) => new Set(a.map((d) => `${d.master}/${d.name}`)).size;
  res.summary = {
    iconRenderingsPerKind: files.length * MASTERS.length * SCALES.length, names: files.length / 2, filesPerMaster: files.length, masters: MASTERS, scales: SCALES,
    pixelsPerComparison: hp.pixels,
    headline: {
      what: hp.what, equal: hp.hist[0], differ1to32: hp.hist[1], differ33to127: hp.hist[2], differOver127: hp.hist[3], largest: hp.max,
      iconRenderingsWithAnyDifference: hp.iconCellsAny, iconRenderingsOver127: hp.iconCellsOver127, distinctFilesOver127: files_(headlineList),
      pinhole: { iconRenderings: pinCells.length, files: files_(pinCells), pixels: sum(pinCells, 'over127'), inkOnOneSideNoneOnTheOther: pinCells.filter((d) => d.inkVsNone > 0).length },
      other: { iconRenderings: othCells.length, files: files_(othCells), pixels: sum(othCells, 'over127'), largest: Math.max(0, ...othCells.map((d) => d.max)), withInkVsNone: othCells.filter((d) => d.inkVsNone > 0).length },
    },
    controls: Object.fromEntries(Object.entries(res.pairs).filter(([k]) => k !== HEADLINE && !/\|lab$/.test(k)).map(([k, v]) => [k, { differentPixels: v.hist[1] + v.hist[2] + v.hist[3], over127: v.hist[3] }])),
    installedFileVsLab: Object.fromEntries(Object.entries(res.pairs).filter(([k]) => /\|lab$/.test(k) && k !== HEADLINE).map(([k, v]) => [k, { sameAsHeadline: JSON.stringify(v.hist) === JSON.stringify(hp.hist) && v.iconCellsOver127 === hp.iconCellsOver127 }])),
  };
  res.notes.push(`tsv: out/per-icon-react-vs-lab${SUFFIX}.tsv (${tsv.length - 1} rows)`);
  writeFileSync(outFile('compare'), `${JSON.stringify(res, null, 2)}\n`);
  return res;
}

/** diffs.png: the worst crops, labelled, as one image under 1 MB (committed). Drops crops until it fits. */
async function sheet(worst) {
  const browser = await chromium.launch(LAUNCH);
  try {
    for (let n = worst.length; n >= 4; n -= 4) {
      const items = worst.slice(0, n).map((d) => {
        const b64 = readFileSync(join(OUT, d.crop.replace(/^out\//, ''))).toString('base64');
        return `<figure><img src="data:image/png;base64,${b64}"><figcaption><b>${d.name}</b> · ${d.master} · ${d.scale}× · ${d.over127} px over 127, largest ${d.max}${d.pinholeOnly ? ' · pinhole' : d.inkVsNone ? ' · ink vs none' : ' · one edge or junction pixel, not a pinhole'}</figcaption></figure>`;
      }).join('');
      const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:12px;background:#fff;font:12px/1.3 system-ui,sans-serif;color:#111}h1{font-size:14px;margin:0 0 8px}
        .g{display:grid;grid-template-columns:repeat(3,auto);gap:10px;justify-content:start}figure{margin:0}img{image-rendering:pixelated;display:block;max-width:560px;height:auto}figcaption{margin-top:2px}</style>
        <h1>Icons with a pixel over 127 of 255 — stroked source as the lab draws it · installed box · difference (red)</h1><div class="g">${items}</div>`;
      const page = await browser.newPage({ viewport: { width: 1760, height: 400 } });
      await page.setContent(html);
      await page.waitForLoadState('load');
      const buf = await page.screenshot({ fullPage: true });
      await page.close();
      if (buf.length < 1_000_000) { const file = SUFFIX ? join(OUT, `diffs${SUFFIX}.png`) : join(HERE, 'diffs.png'); writeFileSync(file, buf); return { file: SUFFIX ? `plans/proof-install/out/diffs${SUFFIX}.png` : 'plans/proof-install/diffs.png', bytes: buf.length, crops: n }; }
    }
    return { file: null, note: 'no sheet under 1 MB' };
  } finally { await browser.close(); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await compare();
  const show = Object.fromEntries(Object.entries(r.pairs).map(([k, v]) => [k, { pixels: v.pixels, hist: v.hist, max: v.max, iconCells: v.iconCells, iconCellsAny: v.iconCellsAny, iconCellsOver127: v.iconCellsOver127 }]));
  console.log(JSON.stringify({ names: r.names, files: r.files, pairs: show, headlineIconCells: r.headlineIconCells, headlineIcons: r.headlineIcons, crops: r.crops, sheet: r.sheet }, null, 2));
}
