// Step 3 of the card 2.2 proof, in Chromium (headless, Playwright): app.jsx bundled with esbuild against the
// installed package and client-rendered. Compares every rendered <svg> with the box's own .svg at 16 · 20 · 24
// pixel for pixel, proves currentColor, title / aria-hidden, refs and optical's laid-out box, and saves the
// contact sheets. `node browser.mjs` (run.mjs runs it); writes out/browser.json and out/contact-16-{1x,2x}.png.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import * as esbuild from 'esbuild';
import { HERE, OUT, BROWSER_APPS, appDir, release, box, readPng, MASTERS } from './lib.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const COLS = 64, COLOR = [214, 40, 110];

export async function main() {
  const rel = release(), B = box(rel.folder);
  mkdirSync(OUT, { recursive: true });
  const bundles = {};
  for (const v of BROWSER_APPS) {
    const r = await esbuild.build({
      stdin: { contents: readFileSync(join(HERE, 'app.jsx'), 'utf8'), resolveDir: appDir(v), loader: 'jsx', sourcefile: 'app.jsx' },
      bundle: true, write: false, format: 'esm', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' }, logLevel: 'silent',
    });
    bundles[v] = r.outputFiles[0].contents;
  }
  const texts = Object.fromEntries(MASTERS.map((m) => [m, JSON.stringify(B.text[m])]));
  const server = createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const send = (type, body) => { res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
    let mm;
    if ((mm = /^\/r\/([\d.]+)\/$/.exec(u.pathname))) return send('text/html', `<!doctype html><html><head><meta charset="utf-8"><title>proof</title><style>html,body{margin:0;background:${u.searchParams.get('mode') === 'color' ? 'transparent' : '#fff'}}.inl svg{display:block;width:100%;height:100%}</style></head><body><div id="root"></div><script type="module" src="/r/${mm[1]}/app.js"></script></body></html>`);
    if ((mm = /^\/r\/([\d.]+)\/app\.js$/.exec(u.pathname)) && bundles[mm[1]]) return send('text/javascript', bundles[mm[1]]);
    if (u.pathname === '/files.json') return send('application/json', JSON.stringify({ files: B.files }));
    if ((mm = /^\/box-text\/(\d+)\.json$/.exec(u.pathname))) return send('application/json', texts[mm[1]]);
    if ((mm = /^\/box\/svg\/(\d+)\/([a-z0-9-]+)\.svg$/.exec(u.pathname)) && B.text[mm[1]]?.[mm[2]]) return send('image/svg+xml', B.text[mm[1]][mm[2]]);
    if (u.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const out = { chromium: browser.version(), apps: {} }, imgShots = {};
  const t0 = performance.now();
  try {
    for (const v of BROWSER_APPS) {
      const console_ = [], timing = [], res = { console: console_, timing };
      const time = (what, t) => timing.push(`${what} ${((performance.now() - t) / 1000).toFixed(1)} s`);
      const ctx1 = await browser.newContext({ viewport: { width: 2100, height: 1400 }, deviceScaleFactor: 1 });
      const open = async (ctx, query) => {
        const page = await ctx.newPage();
        page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${query} ${m.type()}: ${m.text().slice(0, 300)}`); });
        page.on('pageerror', (e) => console_.push(`${query} pageerror: ${e.message}`));
        page.on('requestfailed', (r) => console_.push(`${query} requestfailed: ${r.url()}`));
        page.on('response', (r) => { if (r.status() >= 400) console_.push(`${query} ${r.status()}: ${r.url()}`); });
        await page.goto(`${origin}/r/${v}/?${query}`);
        await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
        return page;
      };

      // pixels: the component vs the box's file as <img> and inlined, each drawn alone at the same place, cell by
      // cell; a second React page is the control (what two identical draws give)
      res.pixels = {};
      for (const S of [16, 20, 24]) {
        const P = S + 8, shots = {};
        for (const kind of ['react', 'img', 'inline', 'react2']) {
          if (kind === 'img' && imgShots[S]) { shots.img = imgShots[S]; continue; }
          const t = performance.now();
          const page = await open(ctx1, `mode=pixels&size=${S}&kind=${kind.replace('2', '')}`);
          const png = readPng(await page.screenshot({ timeout: 120000 }));
          shots[kind] = { png, imgFail: await page.evaluate(() => window.__imgFail || 0), app: v };
          if (kind === 'img') imgShots[S] = shots.img;
          await page.close();
          time(`pixels ${S} ${kind}`, t);
        }
        const t = performance.now();
        const ref = shots.react.png, r = { cells: B.files.length, inked: 0, pixelsCompared: 0, imgFail: shots.img.imgFail, imgShotFrom: shots.img.app };
        for (const k of ['img', 'inline', 'react2']) { r[k] = { icons: 0, pixels: 0, worst: 0, list: [] }; if (shots[k].png.width !== ref.width) throw new Error(`${k} shot ${shots[k].png.width} wide`); }
        B.files.forEach((f, i) => {
          const cx = (i % COLS) * P, cy = Math.floor(i / COLS) * P, n = { img: 0, inline: 0, react2: 0 };
          let ink = false;
          for (let y = cy; y < cy + P; y++) for (let x = cx; x < cx + P; x++) {
            const o = (y * ref.width + x) * ref.channels;
            if (ref.data[o] !== 255 || ref.data[o + 1] !== 255 || ref.data[o + 2] !== 255) ink = true;
            for (const k of ['img', 'inline', 'react2']) {
              const d = shots[k].png.data;
              const dd = Math.max(Math.abs(ref.data[o] - d[o]), Math.abs(ref.data[o + 1] - d[o + 1]), Math.abs(ref.data[o + 2] - d[o + 2]));
              if (dd) { n[k]++; r[k].worst = Math.max(r[k].worst, dd); }
            }
            r.pixelsCompared++;
          }
          if (ink) r.inked++;
          for (const k of ['img', 'inline', 'react2']) if (n[k]) { r[k].icons++; r[k].pixels += n[k]; r[k].list.push(`${f} ${n[k]} px`); }
        });
        for (const k of ['img', 'inline', 'react2']) r[k].list = r[k].list.slice(0, 40);
        res.pixels[S] = r;
        time(`pixels ${S} compare`, t);
      }

      // currentColor: on a transparent page every inked pixel is the parent's colour
      {
        const t = performance.now();
        const page = await open(ctx1, 'mode=color');
        const computed = await page.evaluate(() => window.__result);
        const png = readPng(await page.locator('#color').screenshot({ omitBackground: true }));
        let opaque = 0, partial = 0, worstOpaque = 0, worstHalf = 0, worstAny = 0, outsideBound = 0;
        for (let o = 0; o < png.data.length; o += png.channels) {
          const a = png.channels === 4 ? png.data[o + 3] : 255;
          if (!a) continue;
          const dev = Math.max(...COLOR.map((c, j) => Math.abs(png.data[o + j] - c)));
          if (a === 255) { opaque++; worstOpaque = Math.max(worstOpaque, dev); } else partial++;
          if (a >= 128) worstHalf = Math.max(worstHalf, dev);
          // stored premultiplied in 8 bits, a channel c at alpha a comes back within (c + 255) / (2a): the rounding of
          // c·a and of a itself, each scaled up by 255 / a when the PNG is written unpremultiplied
          if (dev > Math.ceil((Math.max(...COLOR) + 255) / (2 * a)) + 1) outsideBound++;
          worstAny = Math.max(worstAny, dev);
        }
        res.color = { computed, channels: png.channels, opaque, partial, worstOpaque, worstAlphaAtLeastHalf: worstHalf, worstAny, outsideBound };
        await page.close();
        time('color', t);
      }

      // title / aria-hidden / Icon by name / refs, and the accessibility tree
      {
        const t = performance.now();
        const page = await open(ctx1, 'mode=a11y');
        res.a11y = await page.evaluate(() => window.__result);
        res.a11y.rolesImg = await page.getByRole('img').count();
        res.a11y.rolesImgNamedCheck = await page.getByRole('img', { name: 'Label check', exact: true }).count();
        const decoTree = await page.locator('#deco').ariaSnapshot();
        res.a11y.decoTreeImgs = (decoTree.match(/- img/g) || []).length;
        const titledTree = await page.locator('#titled').ariaSnapshot();
        res.a11y.titledTreeImgs = (titledTree.match(/- img "Label /g) || []).length;
        await page.close();
        time('a11y', t);
      }

      // optical: the laid-out box of each icon is size − (left + right) × size ÷ master, and the same vertically
      res.optical = {};
      for (const S of [16, 20, 24]) {
        const t = performance.now();
        const page = await open(ctx1, `mode=optical&size=${S}`);
        const { on, off } = await page.evaluate(() => window.__result);
        const m = S >= 24 ? 24 : S >= 20 ? 20 : 16, k = S / m, r2 = (v) => Math.round(v * k * 100) / 100;
        let worstExact = 0, worstRounded = 0, offBad = 0, worst = null, layoutExplained = 0;
        B.files.forEach((f, i) => {
          const o = B.metrics.icons[m][f].optical;
          const exact = [S - (o.left + o.right) * k, S - (o.top + o.bottom) * k];
          const rounded = [S - r2(o.left) - r2(o.right), S - r2(o.top) - r2(o.bottom)];
          for (const j of [0, 1]) {
            const e = Math.abs(on[i][j] - exact[j]);
            if (e > worstExact) { worstExact = e; worst = `${f} ${['w', 'h'][j]} ${on[i][j]} vs ${exact[j].toFixed(4)}`; }
            worstRounded = Math.max(worstRounded, Math.abs(on[i][j] - rounded[j]));
          }
          if (off[i][0] !== S || off[i][1] !== S) offBad++;
          // Chromium lays out in 1/64 px: each margin, as written (0.01 px), cut toward zero to 1/64
          const lu = (v) => Math.trunc(v * 64) / 64;
          const snapped = [S - lu(r2(o.left)) - lu(r2(o.right)), S - lu(r2(o.top)) - lu(r2(o.bottom))];
          if (on[i][0] === snapped[0] && on[i][1] === snapped[1]) layoutExplained++;
        });
        res.optical[S] = { icons: on.length, worstVsExact: +worstExact.toFixed(5), worstVsRounded: +worstRounded.toFixed(5), worstCase: worst, opticalOffNotSize: offBad, layoutExplained };
        await page.close();
        time(`optical ${S}`, t);
      }

      // the contact sheets: every outline icon at 16, real pixels at 1× and 2× (React 19 only)
      if (v === BROWSER_APPS[0]) {
        for (const dpr of [1, 2]) {
          const ctx = dpr === 1 ? ctx1 : await browser.newContext({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 2 });
          const page = await open(ctx, 'mode=contact');
          const file = join(OUT, `contact-16-${dpr}x.png`);
          writeFileSync(file, await page.locator('#sheet').screenshot());
          const png = readPng(readFileSync(file));
          res[`contact${dpr}x`] = { file: `plans/proof-react/out/contact-16-${dpr}x.png`, width: png.width, height: png.height };
          await page.close();
          if (dpr === 2) await ctx.close();
        }
      }
      await ctx1.close();
      out.apps[v] = res;
    }
  } finally {
    await browser.close();
    server.close();
  }
  out.ms = Math.round(performance.now() - t0);
  writeFileSync(join(OUT, 'browser.json'), `${JSON.stringify(out, null, 2)}\n`);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(await main(), null, 2));
