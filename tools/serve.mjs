#!/usr/bin/env node
// Static server for the lab. The only reason this exists instead of
// `python3 -m http.server`: that sends no Cache-Control, so browsers hold on to
// `tools/*.mjs` across edits and the board silently runs stale code. Everything
// here is served no-store.
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.argv[2] ?? 4174);
const root = resolve('.');
const TYPES = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.css': 'text/css; charset=utf-8', '.png': 'image/png',
  '.woff2': 'font/woff2', '.map': 'application/json; charset=utf-8' };

// The two write routes (plan-view 2.1). Each runs a queue.mjs command — argument array, no shell —
// then rebuilds lab/manifest.json. LAB_QUEUE / LAB_BUILD swap the scripts out for tests.
const repo = fileURLToPath(new URL('..', import.meta.url));
const QUEUE = process.env.LAB_QUEUE ?? 'tools/queue.mjs', BUILD = process.env.LAB_BUILD ?? 'tools/build.mjs';
const ROUTES = {
  '/api/queue/add': (b) => [b.name],                                                    // add <name>
  '/api/queue/mvp': (b) => typeof b.on === 'boolean' && [b.name, b.on ? 'on' : 'off'], // mvp <name> on|off
};
const run = (script, args) => spawnSync(process.execPath, [script, ...args], { cwd: repo, encoding: 'utf8' });
const reply = (res, code, obj, more) => res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store', ...more }).end(JSON.stringify(obj));

function api(req, res, route) {
  let body = '', size = 0;
  req.setEncoding('utf8');
  req.on('data', (c) => {
    if ((size += Buffer.byteLength(c)) <= 10240) { body += c; return; }
    if (res.headersSent) return;
    reply(res, 413, { ok: false, error: 'body over 10 KB' }, { Connection: 'close' });
    res.on('finish', () => req.destroy());
  });
  req.on('end', () => {
    if (size > 10240) return;
    let b;
    try { b = JSON.parse(body); } catch { return reply(res, 400, { ok: false, error: 'body is not JSON' }); }
    if (typeof b?.name !== 'string' || !/^[a-z0-9-]+$/.test(b.name)) return reply(res, 400, { ok: false, error: 'bad name' });
    const args = ROUTES[route](b);
    if (!args) return reply(res, 400, { ok: false, error: 'on must be true or false' });
    const q = run(QUEUE, [route.split('/').pop(), ...args]);
    if (q.status === 0) run(BUILD, []);
    reply(res, q.status === 0 ? 200 : 422, { ok: q.status === 0, stdout: q.stdout, stderr: q.stderr });
  });
}

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && ROUTES[url]) return api(req, res, url);
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
