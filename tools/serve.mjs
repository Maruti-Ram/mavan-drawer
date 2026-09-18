#!/usr/bin/env node
// Static server for the lab. The only reason this exists instead of
// `python3 -m http.server`: that sends no Cache-Control, so browsers hold on to
// `tools/*.mjs` across edits and the board silently runs stale code. Everything
// here is served no-store.
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.argv[2] ?? 4174);
const root = resolve('.');
const TYPES = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.css': 'text/css; charset=utf-8', '.png': 'image/png',
  '.woff2': 'font/woff2', '.map': 'application/json; charset=utf-8' };

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let p = resolve(join(root, normalize(url)));
  if (!p.startsWith(root)) { res.writeHead(403).end('forbidden'); return; }
  let st;
  try { st = statSync(p); } catch { res.writeHead(404).end('not found'); return; }
  if (st.isDirectory()) {
    for (const i of ['index.html', 'library.html']) {
      try { statSync(join(p, i)); p = join(p, i); st = statSync(p); break; } catch {}
    }
    if (st.isDirectory()) { res.writeHead(404).end('no index'); return; }
  }
  res.writeHead(200, {
    'Content-Type': TYPES[extname(p)] ?? 'application/octet-stream',
    'Content-Length': st.size,
    'Cache-Control': 'no-store, must-revalidate',
  });
  createReadStream(p).pipe(res);
}).listen(port, () => console.log(`lab on http://localhost:${port}/lab/ (no-store)`));
