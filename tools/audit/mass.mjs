// APPARENT WEIGHT — how much ink is actually in a drawing. Audit only (F1).
//
// THE QUESTION IT ANSWERS. `dist/metrics.json` records the BOX a drawing fills
// and its bearings; nothing anywhere records how much of that box is ink. So
// "does every icon read with the same darkness in a 16px row" has never been
// answerable, and the only mass measure in the project (`lab/icon.html`, the
// Inspect panel) returns a mass CENTRE and no quantity. Two icons can pass every
// rule we have — same keyline, same ink box, same centring — and one be twice as
// dark as the other. `density` is the number that question needs.
//
// WHAT "DENSITY" MEANS HERE, and why there are two of them:
//   · ofBbox   ink area / its own ink box. "How dark is this drawing where it is."
//              A `minus` is a single bar: its box is thin, so it scores high and
//              that is correct — within the box it occupies, it is solid.
//   · ofCanvas ink area / the whole canvas. "How dark is this icon in a row."
//              This is the one the 16px-row question wants, because a row gives
//              every icon the same square and does not care how much of it the
//              drawing chose to use.
// They disagree hardest on exactly the icons worth looking at, so neither is
// folded into the other.
//
// Every figure carries the supersampling `rate` it was taken at. See
// `raster.mjs` for the coverage rule and the convergence discipline.

import { readIcon, regionOf, inkArea as regionInkArea, inkBox, rasterise, DEFAULT_RATE, sum } from './raster.mjs';

/**
 * Thresholds for banding a rendered pixel. The first two reproduce the project's
 * own two hand-rolled instruments so figures can be compared with what is on
 * record, and they are NOT the same definition:
 *   · solid (`lab/refs/stroke16.html:88`, `stroke16-proof.html:58`) counts a
 *     pixel inked over 0.85 — background is not counted at all.
 *   · px16 (`lab/refs/px16.html:44`) calls a pixel "solid" when it is under 0.15
 *     OR over 0.85 — i.e. it counts CLEAR pixels as solid too — and "half-tone"
 *     is everything between, over the whole 256-pixel tile. That is the
 *     definition behind the 79 / 80 / 80 figures in docs/08 §3.1.
 * `full` is this tool's own: indistinguishable from fully covered at this rate.
 */
export const BANDS = {
  full: 0.995,          // >= this reads as a filled pixel
  solid: 0.85,          // stroke16.html's `solid`
  px16Low: 0.15,        // px16.html's lower edge
  px16High: 0.85,       // px16.html's upper edge
};

const ICON_DIR = 'src/icons';

/** Accepts a path, an already-read icon, or `{ icon, region }`. */
function load(file, opts = {}) {
  if (file && file.region) return file;
  const icon = typeof file === 'string' ? readIcon(file) : file;
  return { icon, region: regionOf(icon, opts) };
}

/**
 * True ink area in that master's square units — NOT the bounding box.
 * At a master rendered one device pixel per unit (16 at 16x16, 24 at 24x24) this
 * number is also the drawing's "px of ink", which is what the project's own
 * sheets mean by `ink`.
 */
export function inkArea(file, { rate = DEFAULT_RATE, ...opts } = {}) {
  const { icon, region } = load(file, opts);
  const { area, cells, flatten } = regionInkArea(region, { rate });
  return {
    name: icon.name, master: icon.master, canvas: icon.canvas,
    area, rate, flatten, cells,
    unit: `square units of the ${icon.canvas} canvas`,
  };
}

/**
 * Rendered at `px` x `px`: the summed coverage, and how the pixels band.
 * `coverage` is the sum of per-pixel coverage in [0,1] — the same quantity as
 * the ink area when px equals the canvas, and the quantity the project's sheets
 * called `ink`. The band counts come with their thresholds attached so no figure
 * from here can be quoted without the definition that produced it.
 */
export function inkPixels(file, px, { rate = DEFAULT_RATE, bands = BANDS, ...opts } = {}) {
  const { icon, region } = load(file, opts);
  const { cov, unit, flatten } = rasterise(region, { px, rate });
  let coverage = 0, full = 0, partial = 0, inked = 0, clear = 0;
  let solidOver85 = 0, px16Solid = 0, px16HalfTone = 0, peak = 0;
  for (const c of cov) {
    coverage += c;
    if (c > peak) peak = c;
    if (c <= 0) { clear++; } else if (c >= bands.full) { full++; inked++; } else { partial++; inked++; }
    if (c > bands.solid) solidOver85++;
    if (c < bands.px16Low || c > bands.px16High) px16Solid++; else px16HalfTone++;
  }
  return {
    name: icon.name, master: icon.master, canvas: icon.canvas,
    px, rate, flatten, devicePxPerUnit: 1 / unit,
    coverage, peak,
    full, partial, inked, clear, tile: cov.length,
    solidOver85, px16Solid, px16HalfTone,
    thresholds: {
      full: `coverage >= ${bands.full} (this tool: indistinguishable from full at rate ${rate})`,
      partial: `0 < coverage < ${bands.full} — the half-tone pixels, what reads as blur`,
      solidOver85: `coverage > ${bands.solid} — lab/refs/stroke16.html:88's "solid"`,
      px16HalfTone: `${bands.px16Low} <= coverage <= ${bands.px16High} over the whole ${cov.length}-pixel tile — lab/refs/px16.html:44's "half-tone"`,
      px16Solid: `coverage < ${bands.px16Low} OR > ${bands.px16High} — px16.html's "solid", which counts CLEAR pixels as solid`,
    },
  };
}

/** Ink area over its own ink box, and over the whole canvas. The "same darkness" number. */
export function density(file, { rate = DEFAULT_RATE, ...opts } = {}) {
  const { icon, region } = load(file, opts);
  const { area, flatten } = regionInkArea(region, { rate });
  const box = inkBox(region, { rate });
  const bboxArea = box.w * box.h;
  const canvasArea = icon.canvas ** 2;
  return {
    name: icon.name, master: icon.master, canvas: icon.canvas, filled: icon.filled,
    area, bboxArea, canvasArea,
    ofBbox: bboxArea > 0 ? area / bboxArea : null,
    ofCanvas: area / canvasArea,
    box, rate, flatten,
  };
}

/**
 * The distribution across many files, so the lightest and the heaviest in the
 * set can be named. `rate` is reported on the result and applies to every row —
 * a census at one rate is comparable within itself even where the absolute
 * figure would want a higher one.
 */
export function census(files, { rate = DEFAULT_RATE, key = 'ofCanvas', onError = 'throw', ...opts } = {}) {
  const rows = [], failed = [];
  for (const f of files) {
    try { rows.push(density(f, { rate, ...opts })); }
    catch (e) { if (onError === 'throw') throw e; failed.push({ file: String(f), error: e.message }); }
  }
  rows.sort((a, b) => a[key] - b[key]);
  const vals = rows.map((r) => r[key]).filter((v) => v != null);
  const q = (p) => (vals.length ? vals[Math.min(vals.length - 1, Math.floor(p * (vals.length - 1)))] : null);
  return {
    rate, key, n: rows.length, failed,
    rows,
    stats: {
      min: vals[0] ?? null,
      p25: q(0.25), median: q(0.5), p75: q(0.75),
      max: vals.at(-1) ?? null,
      mean: vals.length ? sum(vals) / vals.length : null,
      spread: vals.length ? vals.at(-1) / vals[0] : null,
    },
    lightest: rows.slice(0, 10),
    heaviest: rows.slice(-10).reverse(),
  };
}

/** Every drawing of one master, as paths. Convenience for a census run. */
export async function filesOfMaster(master, { root = '.', style = 'all' } = {}) {
  const { readdir } = await import('node:fs/promises');
  const dir = `${root}/${ICON_DIR}/${master}`;
  const names = (await readdir(dir)).filter((f) => f.endsWith('.svg'));
  const keep = style === 'outline' ? names.filter((f) => !/-filled\.svg$/.test(f))
    : style === 'filled' ? names.filter((f) => /-filled\.svg$/.test(f))
      : names;
  return keep.sort().map((f) => `${dir}/${f}`);
}
