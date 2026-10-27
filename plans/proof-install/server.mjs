// A local server for the proof's pages, and the customer's bundle. The page (entry.jsx) is bundled with the throwaway
// app's own esbuild against the installed packages; the installed @mavan/icons .svg files and the lab's drawing of the
// stroked source are served as data. Nothing is read from the repo's own dist/ or packages/: the customer's view is
// what npm unpacked into out/app/node_modules.
import { createServer } from 'node:http';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HERE, APP, MASTERS, installedIcons, fileNames, labDrawer, bodyOf, REPO } from './lib.mjs';

/** The page bundle, built by the app's esbuild. */
export async function bundle() {
  const esbuild = await import(pathToFileURL(join(APP, 'node_modules/esbuild/lib/main.js')).href);
  const r = await esbuild.build({
    stdin: { contents: readFileSync(join(HERE, 'entry.jsx'), 'utf8'), resolveDir: APP, loader: 'jsx', sourcefile: 'entry.jsx' },
    bundle: true, write: false, format: 'esm', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' }, logLevel: 'silent',
  });
  return { code: r.outputFiles[0].contents, esbuild: esbuild.version };
}

/** What the lab draws (the stroked source) and what the customer installed, per master, plus the checks that they
 *  are about the same set of names and that lab/manifest.json is as fresh as src/icons/. */
export function data() {
  const { files } = fileNames();
  const lab = labDrawer(), out = { files, lab: {}, svg: {}, checks: { manifestStale: [], missingInManifest: 0, srcOnly: 0, manifestOnly: 0, labTemplate: lab.template, labCss: lab.css } };
  for (const m of MASTERS) {
    out.lab[m] = {}; out.svg[m] = {};
    const dir = join(installedIcons(), 'svg', String(m)), src = join(REPO, 'src/icons', String(m));
    const have = new Set(readdirSync(dir).map((f) => f.replace(/\.svg$/, '')));
    const srcNames = new Set(readdirSync(src).filter((f) => f.endsWith('.svg')).map((f) => f.replace(/\.svg$/, '')));
    const manNames = new Set(Object.keys(lab.man.masters[m].icons));
    for (const f of files) {
      if (!have.has(f)) throw new Error(`@mavan/icons/svg/${m}/${f}.svg is not installed`);
      if (!srcNames.has(f)) out.checks.srcOnly++;
      if (!manNames.has(f)) { out.checks.missingInManifest++; continue; }
      out.lab[m][f] = lab.draw(m, m, f);
      out.svg[m][f] = readFileSync(join(dir, `${f}.svg`), 'utf8');
      // the manifest must hold the body the source file gives, or the lab would be drawing a stale icon
      if (lab.man.masters[m].icons[f].body !== bodyOf(readFileSync(join(src, `${f}.svg`), 'utf8'))) out.checks.manifestStale.push(`${m}/${f}`);
    }
    out.checks.manifestOnly += [...manNames].filter((f) => !srcNames.has(f)).length;
    if (have.size !== files.length || srcNames.size !== files.length || manNames.size !== files.length) throw new Error(`master ${m}: installed ${have.size}, src ${srcNames.size}, manifest ${manNames.size}, names ${files.length}`);
  }
  return { ...out, drawer: lab };
}

const SHELL = `<!doctype html><html><head><meta charset="utf-8"><title>proof-install</title><style>
html,body{margin:0;background:#fff;color:#000}
.cell{position:absolute}
/* lab/library.html: svg{display:block;overflow:visible} */
.lab svg{display:block;overflow:visible}
/* the customer: the file has a viewBox and no width or height; the README says to set the size in markup or CSS */
.cust svg,.cust img{display:block}
.cust svg{width:var(--s);height:var(--s)}
</style></head><body><div id="root"></div><script type="module" src="/bundle.js"></script></body></html>`;

export async function startServer() {
  const { code, esbuild } = await bundle();
  const d = data();
  const server = createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const send = (type, body) => { res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
    let mm;
    if (u.pathname === '/') return send('text/html', SHELL);
    if (u.pathname === '/bundle.js') return send('text/javascript', code);
    if (u.pathname === '/files.json') return send('application/json', JSON.stringify({ files: d.files }));
    if ((mm = /^\/data\/(\d+)\/(lab|svg)\.json$/.exec(u.pathname)) && d[mm[2]][mm[1]]) return send('application/json', JSON.stringify(d[mm[2]][mm[1]]));
    if ((mm = /^\/data\/(\d+)\/lab-at\.json$/.exec(u.pathname)) && d.lab[mm[1]]) return send('application/json', JSON.stringify({ markup: d.drawer.draw(Number(mm[1]), Number(u.searchParams.get('px')), u.searchParams.get('file')) }));
    if (u.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close(), data: d, esbuild, bundleBytes: code.length };
}
