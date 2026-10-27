// Card 3.1, steps 2 and 6: be the customer. Unzips the release's download into out/download/, makes a throwaway app
// in out/app/ that installs both tarballs from the unzipped folder (plus react, react-dom, esbuild), and runs the
// README's own install lines as written in two more throwaway folders. Writes out/setup.json and out/logs/.
//   node plans/proof-install/setup.mjs
import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync, copyFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, OUT, DOWNLOAD, APP, version, downloadDir, ensure } from './lib.mjs';

const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 28, ...opts });
const LOGS = join(OUT, 'logs');
const PEERS = ['react@19.3.0', 'react-dom@19.3.0', 'esbuild@0.28.2'];

export function setup() {
  const v = version(), zip = join(REPO, `dist/release/mavan-drawer-${v}.zip`), folder = join(REPO, `dist/release/mavan-drawer-${v}`);
  if (!existsSync(zip)) throw new Error(`${zip} is missing: run \`npm run release\` first (no flags)`);
  ensure(LOGS);
  const res = { version: v, zip, steps: [] };
  for (const d of [DOWNLOAD, APP, join(OUT, 'readme-app'), join(OUT, 'react-only-app')]) rmSync(d, { recursive: true, force: true });

  // 2a. the download, as a customer unzips it
  ensure(DOWNLOAD);
  sh('unzip', ['-q', zip, '-d', DOWNLOAD]);
  const dl = downloadDir();
  if (!existsSync(join(dl, 'README.md'))) throw new Error(`the zip did not unpack to ${dl}`);
  // the unzipped folder is the release folder, byte for byte
  const same = sh('diff', ['-rq', folder, dl]).trim();
  res.unzippedEqualsReleaseFolder = same === '';
  res.steps.push(`unzipped ${zip} → ${dl}; diff -rq against dist/release/mavan-drawer-${v}/: ${same === '' ? 'identical' : same}`);

  // 2b. the app, one install of both tarballs from the unzipped folder
  const tgzIcons = join(dl, `mavan-icons-${v}.tgz`), tgzReact = join(dl, `mavan-icons-react-${v}.tgz`);
  ensure(APP);
  writeFileSync(join(APP, 'package.json'), `${JSON.stringify({ name: 'customer-app', version: '0.0.0', private: true, type: 'module' }, null, 2)}\n`);
  const t0 = Date.now();
  const log = sh('npm', ['install', '--no-audit', '--no-fund', tgzIcons, tgzReact, ...PEERS], { cwd: APP, stdio: ['ignore', 'pipe', 'pipe'] });
  writeFileSync(join(LOGS, 'npm-install-app.log'), log);
  const pkg = JSON.parse(readFileSync(join(APP, 'package.json'), 'utf8'));
  const ver = (n) => JSON.parse(readFileSync(join(APP, 'node_modules', n, 'package.json'), 'utf8')).version;
  res.app = { npmSeconds: +((Date.now() - t0) / 1000).toFixed(1), dependencies: pkg.dependencies, installed: { '@mavan/icons': ver('@mavan/icons'), '@mavan/icons-react': ver('@mavan/icons-react'), react: ver('react'), 'react-dom': ver('react-dom'), esbuild: ver('esbuild') } };
  res.steps.push(`npm install <tarballs from the unzipped folder> ${PEERS.join(' ')} in out/app/: ${JSON.stringify(res.app.installed)}`);

  // the installed package is the tarball: its svg/ equals the download's svg/
  const svgSame = sh('diff', ['-rq', join(dl, 'svg'), join(APP, 'node_modules/@mavan/icons/svg')]).trim();
  res.installedSvgEqualsDownload = svgSame === '';
  res.steps.push(`installed @mavan/icons/svg against the download's svg/: ${svgSame === '' ? 'identical' : svgSame}`);

  // the README's "Use in React" lines, as written, rendered to markup in the app
  res.readmeReact = JSON.parse(sh('node', ['--input-type=module', '-e', `
    import { renderToStaticMarkup as r } from 'react-dom/server'; import { createElement as h } from 'react';
    import { Check, CheckFilled, Icon } from '@mavan/icons-react';
    const m = (el) => r(el), view = (s) => s.match(/viewBox="([^"]*)"/)?.[1], size = (s) => s.match(/width="([^"]*)"/)?.[1];
    const a = m(h(Check, { size: 16 })), b = m(h(CheckFilled, { size: 20 })), c = m(h(Icon, { name: 'check', size: 24 })), d = m(h(Icon, { name: 'check-filled', size: 24 })), e = m(h(Check, { size: 16, optical: true })), f = m(h(Check, { size: 16, title: 'Done' }));
    console.log(JSON.stringify({
      check16: { viewBox: view(a), width: size(a), hidden: a.includes('aria-hidden="true"'), focusable: a.includes('focusable="false"'), currentColor: a.includes('currentColor') },
      checkFilled20: { viewBox: view(b) }, iconByName24: { viewBox: view(c) },
      iconCheckFilledEqualsCheckFilled: d === m(h(CheckFilled, { size: 24 })),
      optical: { hasMargin: /margin/.test(e) }, title: { role: f.includes('role="img"'), titleElement: f.includes('<title>Done</title>'), notHidden: !f.includes('aria-hidden') },
    }));`], { cwd: APP }));
  res.steps.push(`README's React lines in out/app: ${JSON.stringify(res.readmeReact)}`);

  // 6. the README's install lines, as written, with the .tgz files beside the code
  const lines = (dir, cmds) => {
    ensure(dir);
    writeFileSync(join(dir, 'package.json'), `${JSON.stringify({ name: 'readme-app', version: '0.0.0', private: true, type: 'module' }, null, 2)}\n`);
    copyFileSync(tgzIcons, join(dir, `mavan-icons-${v}.tgz`));
    copyFileSync(tgzReact, join(dir, `mavan-icons-react-${v}.tgz`));
    return cmds.map((c) => {
      const out = sh('npm', ['install', '--no-audit', '--no-fund', c], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });
      return `npm install ${c}: ${out.trim().split('\n').pop()}`;
    });
  };
  const readmeText = readFileSync(join(dl, 'README.md'), 'utf8');
  const wanted = [`npm install ./mavan-icons-${v}.tgz`, `npm install ./mavan-icons-react-${v}.tgz`];
  res.readmeHasInstallLines = wanted.every((w) => readmeText.includes(w));
  res.readmeLines = lines(join(OUT, 'readme-app'), [`./mavan-icons-${v}.tgz`, `./mavan-icons-react-${v}.tgz`]);
  res.reactOnly = lines(join(OUT, 'react-only-app'), [`./mavan-icons-react-${v}.tgz`]);

  // both resolve and load, with nothing else installed by hand (react arrives as the peer)
  const probe = (dir, code) => sh('node', ['--input-type=module', '-e', code], { cwd: dir }).trim();
  res.readmeAppProbe = probe(join(OUT, 'readme-app'), `
    import { createRequire } from 'node:module'; import { readFileSync } from 'node:fs';
    const require = createRequire(process.cwd() + '/x.js');
    const svg = require.resolve('@mavan/icons/svg/24/check.svg'); const react = await import('@mavan/icons-react');
    console.log(JSON.stringify({ svgResolves: svg.endsWith('svg/24/check.svg'), svgIsOutlined: !/stroke/.test(readFileSync(svg, 'utf8')), checkType: typeof react.Check + (react.Check?.$$typeof ? ' (' + String(react.Check.$$typeof) + ')' : ''), exports: Object.keys(react).length, reactPeer: require('react/package.json').version }));`);
  res.reactOnlyProbe = probe(join(OUT, 'react-only-app'), `
        import { createRequire } from 'node:module';
    const require = createRequire(process.cwd() + '/x.js'); const react = await import('@mavan/icons-react');
    let iconsInstalled = true; try { require.resolve('@mavan/icons/package.json'); } catch { iconsInstalled = false; }
    console.log(JSON.stringify({ checkType: typeof react.Check + (react.Check?.$$typeof ? ' (' + String(react.Check.$$typeof) + ')' : ''), exports: Object.keys(react).length, reactPeer: require('react/package.json').version, iconsInstalled }));`);
  res.steps.push(...res.readmeLines, ...res.reactOnly, `probe readme-app: ${res.readmeAppProbe}`, `probe react-only-app: ${res.reactOnlyProbe}`);

  writeFileSync(join(OUT, 'setup.json'), `${JSON.stringify(res, null, 2)}\n`);
  return res;
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(setup(), null, 2));
