// Step 6 of the card 2.2 proof: `tsc --noEmit` on check.tsx against the installed package, in four module
// resolutions with React 19's types and in bundler resolution with React 18's. Each run is a folder in out/ whose
// node_modules is a link to the app's, so the package and @types/react resolve as that app resolves them; --listFiles
// shows which of the package's two declaration files was read.
import { mkdirSync, rmSync, writeFileSync, copyFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { HERE, OUT, appDir } from './lib.mjs';

const TSC = join(HERE, 'node_modules/typescript/bin/tsc');
const RUNS = [
  ['19.3.0', 'bundler', { module: 'esnext', moduleResolution: 'bundler' }, 'module'],
  ['19.3.0', 'nodenext-esm', { module: 'nodenext', moduleResolution: 'nodenext' }, 'module'],
  ['19.3.0', 'nodenext-cjs', { module: 'nodenext', moduleResolution: 'nodenext' }, 'commonjs'],
  ['19.3.0', 'node10', { module: 'commonjs', moduleResolution: 'node10' }, 'commonjs'],
  ['18.3.1', 'bundler', { module: 'esnext', moduleResolution: 'bundler' }, 'module'],
];

export function main() {
  const tsv = spawnSync('node', [TSC, '--version'], { encoding: 'utf8' }).stdout.trim();
  const out = { tsc: tsv, runs: [] };
  for (const [v, label, opts, type] of RUNS) {
    const dir = join(OUT, `ts-${v}-${label}`);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    symlinkSync(join(appDir(v), 'node_modules'), join(dir, 'node_modules'), 'dir');
    copyFileSync(join(HERE, 'check.tsx'), join(dir, 'check.tsx'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ private: true, type }));
    writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({
      compilerOptions: { ...opts, target: 'es2020', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: false, types: [] },
      files: ['check.tsx'],
    }, null, 2));
    const t0 = performance.now();
    const r = spawnSync('node', [TSC, '-p', dir, '--listFiles'], { encoding: 'utf8' });
    const listed = r.stdout.split('\n').filter((l) => l.includes('@mavan/icons-react'));
    const errors = r.stdout.split('\n').filter((l) => /error TS/.test(l));
    out.runs.push({ react: v, resolution: label, exit: r.status, errors, read: listed.map((l) => l.replace(/.*@mavan\/icons-react\//, '')), ms: Math.round(performance.now() - t0) });
  }
  return out;
}
