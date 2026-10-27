// Card 3.1, step 3 (the browser half): draws every icon of the customer's install and of the lab's stroked source in
// Chromium, one page per kind, master and device scale, all at the same grid positions, and saves each page as a PNG
// in out/shots/<scale>x/<master>-<kind>.png. compare.mjs reads them. The console of every page is kept in
// out/console.json: it must be empty.
//   node plans/proof-install/shoot.mjs
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { OUT, SHOTS, LAUNCH, RASTER, outFile, MASTERS, SCALES, KINDS, COLS, cell, rowsOf, ensure } from './lib.mjs';
import { startServer } from './server.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');

/** A page on `ctx` with its console, page errors, failed requests and HTTP errors collected into `log`. */
export async function openPage(ctx, origin, query, log) {
  const page = await ctx.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) log.push(`${query} ${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => log.push(`${query} pageerror: ${e.message}`));
  page.on('requestfailed', (r) => log.push(`${query} requestfailed: ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) log.push(`${query} HTTP ${r.status()}: ${r.url()}`); });
  await page.goto(`${origin}/?${query}`);
  await page.waitForFunction(() => window.__ready === true || window.__error, null, { timeout: 240000 });
  const err = await page.evaluate(() => window.__error || null);
  if (err) throw new Error(`${query}: ${err}`);
  return page;
}

export async function shoot() {
  const srv = await startServer();
  const n = srv.data.files.length, log = [], timing = [];
  const browser = await chromium.launch(LAUNCH);
  const out = { raster: RASTER, chromiumArgs: LAUNCH.args ?? [], chromium: browser.version(), esbuild: srv.esbuild, bundleBytes: srv.bundleBytes, names: n / 2, files: n, checks: srv.data.checks, shots: [], imgFail: {} };
  try {
    for (const scale of SCALES) {
      ensure(join(SHOTS, `${scale}x`));
      for (const m of MASTERS) {
        const P = cell(m), width = COLS * P, height = rowsOf(n) * P;
        const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
        for (const kind of KINDS) {
          const t = performance.now();
          const q = `mode=grid&kind=${kind}&size=${m}`;
          const page = await openPage(ctx, srv.origin, q, log);
          const png = await page.screenshot({ timeout: 120000 });
          const file = join(SHOTS, `${scale}x`, `${m}-${kind}.png`);
          writeFileSync(file, png);
          const fail = await page.evaluate(() => window.__imgFail || 0);
          if (fail) out.imgFail[`${scale}x ${m} ${kind}`] = fail;
          out.shots.push({ scale, master: m, kind, file: `out/${SHOTS.split('/').pop()}/${scale}x/${m}-${kind}.png`, bytes: png.length });
          await page.close();
          timing.push(`${scale}x ${m} ${kind} ${((performance.now() - t) / 1000).toFixed(1)} s`);
        }
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
    srv.close();
  }
  out.console = log;
  out.timing = timing;
  writeFileSync(outFile('console'), `${JSON.stringify({ pages: out.shots.length, messages: log }, null, 2)}\n`);
  writeFileSync(outFile('shoot'), `${JSON.stringify(out, null, 2)}\n`);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await shoot();
  console.log(JSON.stringify({ chromium: r.chromium, esbuild: r.esbuild, bundleBytes: r.bundleBytes, files: r.files, shots: r.shots.length, imgFail: r.imgFail, consoleMessages: r.console.length, checks: { ...r.checks, labTemplate: undefined }, firstTimings: r.timing.slice(0, 8) }, null, 2));
  if (r.console.length) { console.error(r.console.slice(0, 20).join('\n')); process.exitCode = 1; }
}
