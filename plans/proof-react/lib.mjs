// Shared by the proof-react scripts (plans/shipping.md card 2.2): where things are, the box as the customer gets
// it, a tiny PNG reader, and the substring search for the stroked source. Nothing here imports the generator: the
// proof re-derives what it checks from the box and the README.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = join(HERE, '../..');
export const OUT = join(HERE, 'out');
export const APPS = ['18.0.0', '18.3.1', '19.0.0', '19.3.0'];
export const BROWSER_APPS = process.env.PROOF_BROWSER_APPS ? process.env.PROOF_BROWSER_APPS.split(',') : ['19.3.0', '18.3.1'];
export const appDir = (v) => join(HERE, 'apps', v);
export const pkgDir = (v) => join(appDir(v), 'node_modules/@mavan/icons-react');
export const MASTERS = [24, 20, 16];

/** The download folder and the React tarball in it: the newest dist/release/mavan-drawer-<v>[-dev]/. */
export function release() {
  const v = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version;
  const base = join(REPO, 'dist/release');
  const dirs = [`mavan-drawer-${v}`, `mavan-drawer-${v}-dev`].map((d) => join(base, d)).filter((d) => existsSync(d))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (!dirs.length) throw new Error(`no dist/release/mavan-drawer-${v}[-dev]/: run \`npm run release -- --allow-dirty --skip-check\``);
  const folder = dirs[0], tgz = join(folder, `mavan-icons-react-${v}.tgz`);
  if (!existsSync(tgz)) throw new Error(`${tgz} is missing: the release did not run tools/gen-react.mjs`);
  return { version: v, folder, tgz };
}

/** The README's rule, written again from its words: 16 for 16 to 19 px, 20 for 20 to 23, 24 at and above 24. */
export const ruleMaster = (s) => (s >= 24 ? 24 : s >= 20 ? 20 : 16);
/** The README's naming: kebab-case → PascalCase, -filled → Filled. */
export const pascal = (f) => f.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');

/** The box as shipped in the download folder: names, files, each file's text and d, metrics. */
export function box(folder) {
  const meta = JSON.parse(readFileSync(join(folder, 'meta.json'), 'utf8'));
  const metrics = JSON.parse(readFileSync(join(folder, 'metrics.json'), 'utf8'));
  const names = meta.icons.map((i) => i.name);
  const files = names.flatMap((n) => [n, `${n}-filled`]).sort();
  const text = {}, d = {};
  for (const m of MASTERS) {
    text[m] = {}; d[m] = {};
    const dir = join(folder, 'svg', String(m));
    if (readdirSync(dir).length !== files.length) throw new Error(`svg/${m}: ${readdirSync(dir).length} files, not ${files.length}`);
    for (const f of files) {
      const t = readFileSync(join(dir, `${f}.svg`), 'utf8');
      const ds = [...t.matchAll(/ d="([^"]*)"/g)].map((x) => x[1]);
      if (ds.length !== 1) throw new Error(`svg/${m}/${f}.svg holds ${ds.length} paths`);
      text[m][f] = t; d[m][f] = ds[0];
    }
  }
  return { names, files, text, d, metrics };
}

/** Every file under dir, relative, sorted. */
export function walk(dir, pre = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name), `${pre}${e.name}/`) : [`${pre}${e.name}`])).sort();
}

/** Which of `needles` occur in `hay`: every needle starts with "M", so only the positions of "M" are tried, against
 *  the needles of each length. With `whole`, only where the needle is a complete path — the next character ends a
 *  string or starts the next subpath — not the first commands of a longer one ("M5.75 9H18.25" inside
 *  "M5.75 9H18.25A0.75…", which is another line's outline). */
export function findAll(hay, needles, { whole = false } = {}) {
  const byLen = new Map();
  for (const n of needles) { if (!byLen.has(n.length)) byLen.set(n.length, new Set()); byLen.get(n.length).add(n); }
  const lens = [...byLen.keys()], hits = new Set();
  for (let p = hay.indexOf('M'); p !== -1; p = hay.indexOf('M', p + 1)) {
    for (const L of lens) {
      const s = hay.substr(p, L);
      if (s.length === L && byLen.get(L).has(s) && (!whole || p + L === hay.length || /["'`M\s<]/.test(hay[p + L]))) hits.add(s);
    }
  }
  return hits;
}

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

export const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
export const mb = (n) => `${(n / 1e6).toFixed(2)} MB`;
