// Shared by the card 3.1 proof scripts (plans/shipping.md): where things are, the PNG reader and writer, the
// stroked source as the lab draws it, the census of dots that Skia may leave a pinhole in.
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync, deflateSync, crc32 } from 'node:zlib';
import { bbox } from '../../tools/geometry.mjs';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = join(HERE, '../..');
export const OUT = join(HERE, 'out');
export const DOWNLOAD = join(OUT, 'download');
export const APP = join(OUT, 'app');
// Two rasterisers. The default is Chromium's CPU one (what headless Chromium on this machine uses). PROOF_RASTER=gpu
// turns on Chromium's GPU rasterisation over ANGLE with the SwiftShader software Vulkan (there is no GPU here): the
// same code path a desktop Chrome with GPU rasterisation takes, run in software. Its outputs carry the suffix -gpu.
export const RASTER = process.env.PROOF_RASTER === 'gpu' ? 'gpu' : 'software';
export const SUFFIX = RASTER === 'gpu' ? '-gpu' : '';
export const LAUNCH = RASTER === 'gpu' ? { args: ['--use-angle=swiftshader', '--enable-gpu-rasterization', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] } : {};
export const SHOTS = join(OUT, `shots${SUFFIX}`);
export const outFile = (name, ext = 'json') => join(OUT, `${name}${SUFFIX}.${ext}`);
export const MASTERS = [24, 20, 16];
export const SCALES = process.env.PROOF_SCALES ? process.env.PROOF_SCALES.split(',').map(Number) : [1, 2];   // PROOF_SCALES=1 for a quick look while working on the scripts
export const COLS = 64;
/** What one page draws: the stroked source as the lab does, the same again (control), the React component, the
 *  same again (control), the installed .svg inlined, the installed .svg as an <img>. */
export const KINDS = RASTER === 'gpu' ? ['lab', 'lab2', 'react', 'react2', 'svg'] : ['lab', 'lab2', 'react', 'react2', 'svg', 'img'];   // the <img> kind is slow and was identical to the inlined file; the GPU run skips it

export const version = () => JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version;
export const ensure = (d) => { mkdirSync(d, { recursive: true }); return d; };
export const pascal = (f) => f.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
export const cell = (S) => S + 8;                       // the slot of one icon on the grid, in CSS px
export const rowsOf = (n) => Math.ceil(n / COLS);

/** The unzipped download folder: <out>/download/mavan-drawer-<v>/ */
export const downloadDir = () => join(DOWNLOAD, `mavan-drawer-${version()}`);
export const installedIcons = () => join(APP, 'node_modules/@mavan/icons');

/** The names of the box, from the installed @mavan/icons meta.json, and every file name (outline + -filled), sorted. */
export function fileNames() {
  const meta = JSON.parse(readFileSync(join(installedIcons(), 'meta.json'), 'utf8'));
  const names = meta.icons.map((i) => i.name);
  return { names, files: names.flatMap((n) => [n, `${n}-filled`]).sort() };
}

/** The lab's own way of putting a stroked icon on the page: lab/library.html's `svg` template, read out of the page
 *  (not copied), fed with the `body` and `stroke` that tools/build.mjs wrote to lab/manifest.json. */
export function labDrawer() {
  const html = readFileSync(join(REPO, 'lab/library.html'), 'utf8');
  const line = html.split('\n').find((l) => l.startsWith('const svg = (m, px, rec) =>'));
  if (!line) throw new Error('lab/library.html: the `const svg = (m, px, rec) =>` line is gone');
  const fn = new Function(`return ${line.replace(/^const svg = /, '').replace(/;\s*$/, '')}`)();
  const css = 'svg{display:block;overflow:visible}';
  if (!html.includes(css)) throw new Error(`lab/library.html: the rule ${css} is gone`);
  const man = JSON.parse(readFileSync(join(REPO, 'lab/manifest.json'), 'utf8'));
  return { template: line, css, draw: (m, px, name) => { const rec = man.masters[m].icons[name]; if (!rec) throw new Error(`lab/manifest.json: no ${m}/${name}`); return fn(m, px, rec); }, man };
}

/** The same body build.mjs derives, from the source file itself — to prove the manifest is as fresh as src/icons/. */
export function bodyOf(src) {
  const clean = src.replace(/<!--[\s\S]*?-->/g, '');
  return clean.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------------------------------------------
// PNG
/** A PNG as { width, height, channels, data } — 8-bit RGB or RGBA, not interlaced (what Chromium writes). */
export function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let p = 8, width, height, depth, type, inter;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), kind = buf.toString('latin1', p + 4, p + 8), body = buf.subarray(p + 8, p + 8 + len);
    if (kind === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); depth = body[8]; type = body[9]; inter = body[12]; }
    if (kind === 'IDAT') idat.push(body);
    p += 12 + len;
  }
  if (depth !== 8 || inter !== 0 || (type !== 2 && type !== 6)) throw new Error(`PNG depth ${depth} type ${type} interlace ${inter} not read`);
  const ch = type === 6 ? 4 : 3, stride = width * ch, raw = inflateSync(Buffer.concat(idat));
  const data = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), row = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? data[row + x - ch] : 0, b = y ? data[row - stride + x] : 0, c = x >= ch && y ? data[row - stride + x - ch] : 0;
      let v = src[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      data[row + x] = v & 255;
    }
  }
  return { width, height, channels: ch, data };
}

/** An RGBA buffer (width × height × 4) as PNG bytes. */
export function writePng(width, height, rgba) {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  const chunk = (type, body) => {
    const head = Buffer.alloc(8); head.writeUInt32BE(body.length, 0); head.write(type, 4, 'latin1');
    const tail = Buffer.alloc(4); tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])) >>> 0, 0);
    return Buffer.concat([head, body, tail]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/** The pixel at (x, y), as a grey value: the darkest channel. */
export const grey = (png, x, y) => { const o = (y * png.width + x) * png.channels; return Math.min(png.data[o], png.data[o + 1], png.data[o + 2]); };

/** Three enlarged panels side by side — a, b, and where they differ — of the region (x0, y0, w, h) of two same-size
 *  PNGs, each pixel f × f, nearest neighbour, a one-pixel rule between. The difference is red: the stronger the
 *  difference the deeper the red; a pixel over 127 is drawn full red with a dark core. */
export function sideBySide(a, b, x0, y0, w, h, f) {
  const gap = 4, W = (w * f) * 3 + gap * 2, H = h * f, out = Buffer.alloc(W * H * 4, 255);
  const put = (px, py, r, g, bl) => { const o = (py * W + px) * 4; out[o] = r; out[o + 1] = g; out[o + 2] = bl; out[o + 3] = 255; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const oa = ((y0 + y) * a.width + x0 + x) * a.channels, ob = ((y0 + y) * b.width + x0 + x) * b.channels;
    const d = Math.max(Math.abs(a.data[oa] - b.data[ob]), Math.abs(a.data[oa + 1] - b.data[ob + 1]), Math.abs(a.data[oa + 2] - b.data[ob + 2]));
    for (let j = 0; j < f; j++) for (let i = 0; i < f; i++) {
      put(x * f + i, y * f + j, a.data[oa], a.data[oa + 1], a.data[oa + 2]);
      put(w * f + gap + x * f + i, y * f + j, b.data[ob], b.data[ob + 1], b.data[ob + 2]);
      const px = 2 * (w * f + gap) + x * f + i, py = y * f + j;
      if (!d) put(px, py, 255, 255, 255);
      else if (d > 127) put(px, py, i > 0 && i < f - 1 && j > 0 && j < f - 1 ? 150 : 215, 0, 0);
      else put(px, py, 255, 255 - Math.min(200, d * 2), 255 - Math.min(200, d * 2));
    }
  }
  for (const gx of [w * f, 2 * w * f + gap]) for (let y = 0; y < H; y++) for (let i = 0; i < gap; i++) put(gx + i, y, 120, 120, 120);
  return { width: W, height: H, rgba: out };
}

// ---------------------------------------------------------------------------------------------------------------
// The dots a stroked circle makes when its radius is under half its stroke (the pinhole question)
const num = '(-?[\\d.]+)';
const DOT = new RegExp(`M${num}[ ,]${num}A${num}[ ,]${num} 0 [01] [01] ${num}[ ,]${num}A\\3[ ,]\\4 0 [01] [01] \\1[ ,]\\2Z?`, 'g');

/** The shapes a stroke draws as a solid "narrower than its pen": a closed circle (M…A…A…Z, two arcs of one radius) with
 *  radius under half its stroke — a dot — and any other stroked path with an arc under half its stroke, which in the
 *  source is a thin closed loop (a capsule: `calculator`'s key slit, `headphones-3` and `-5`'s cord). Skia's stroker
 *  inverts the inner edge of such a stroke. Read off src/icons/. Each: { kind, name, master, r, w, box } where box is
 *  the ink's [x0, y0, x1, y1] in the master's units; a dot also has cx, cy and R = r + w/2, the ink's outer radius. */
export function thinCensus() {
  const items = [];
  for (const m of MASTERS) {
    const dir = join(REPO, 'src/icons', String(m));
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) {
      const t = readFileSync(join(dir, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
      const root = Number(t.match(/<svg\b[^>]*\bstroke-width="([\d.]+)"/)?.[1]);
      const name = f.replace(/\.svg$/, '');
      for (const p of t.matchAll(/<path\b([^>]*?)\/?>/g)) {
        if (/\bfill="currentColor"/.test(p[1])) continue;           // a filled area, not a stroke
        const d = p[1].match(/\bd="([^"]*)"/)?.[1] ?? '';
        const w = Number(p[1].match(/\bstroke-width="([\d.]+)"/)?.[1] ?? root);
        for (const c of d.matchAll(DOT)) {
          const r = Number(c[3]);
          if (!(Number(c[4]) === r && 2 * r < w)) continue;
          const cx = (Number(c[1]) + Number(c[5])) / 2, cy = (Number(c[2]) + Number(c[6])) / 2, R = r + w / 2;
          items.push({ kind: 'dot', name, master: m, cx, cy, r, w, R, box: [cx - R, cy - R, cx + R, cy + R] });
        }
        const rest = d.replace(DOT, '');
        if ([...rest.matchAll(/[Aa]\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/g)].some((a) => Number(a[1]) * 2 < w && Number(a[2]) * 2 < w)) {
          const b = bbox([d]);
          items.push({ kind: 'capsule', name, master: m, r: null, w, box: [b.x0 - w / 2, b.y0 - w / 2, b.x1 + w / 2, b.y1 + w / 2] });
        }
      }
    }
  }
  return items;
}
export const dotCensus = () => thinCensus().filter((x) => x.kind === 'dot');

export const mean = (a) => a.reduce((s, v) => s + v, 0) / (a.length || 1);
