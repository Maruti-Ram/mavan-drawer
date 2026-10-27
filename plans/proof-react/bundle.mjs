// Step 5 of the card 2.2 proof: an app bundles only what it imports. esbuild minifies two apps against
// apps/19.3.0/ — one importing only Check, one using Icon by name — with React bundled and with it left out (the
// package's own share), and reads which of the box's drawings each bundle carries. Returns the bundle texts for
// bytes.mjs's search for the stroked source.
import { gzipSync } from 'node:zlib';
import * as esbuild from 'esbuild';
import { appDir, release, box, MASTERS } from './lib.mjs';

const APPS = {
  'only-check': "import { Check } from '@mavan/icons-react';\nimport { createRoot } from 'react-dom/client';\ncreateRoot(document.getElementById('root')).render(<Check size={16} />);\n",
  'icon-by-name': "import { Icon } from '@mavan/icons-react';\nimport { createRoot } from 'react-dom/client';\ncreateRoot(document.getElementById('root')).render(<Icon name={location.hash.slice(1) || 'check'} size={16} />);\n",
};

export async function main() {
  const B = box(release().folder);
  const out = {}, texts = {};
  for (const [name, contents] of Object.entries(APPS)) {
    for (const withReact of [true, false]) {
      const r = await esbuild.build({
        stdin: { contents, resolveDir: appDir('19.3.0'), loader: 'jsx', sourcefile: `${name}.jsx` },
        bundle: true, minify: true, write: false, metafile: true, format: 'esm', platform: 'browser', jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"production"' }, external: withReact ? [] : ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'], logLevel: 'silent',
      });
      const text = r.outputFiles[0].text, key = `${name}${withReact ? '' : ' (react external)'}`;
      texts[key] = text;
      // which drawings: every (master, name) whose d is in the bundle
      const found = [];
      for (const m of MASTERS) for (const f of B.files) if (text.includes(B.d[m][f])) found.push(`${m}/${f}`);
      const ours = Object.entries(r.metafile.outputs)[0][1].inputs;
      const pkgInputs = Object.entries(ours).filter(([p]) => p.includes('@mavan/icons-react')).map(([p, v]) => [p.replace(/.*@mavan\/icons-react\//, ''), v.bytesInOutput]);
      out[key] = {
        bytes: Buffer.byteLength(text), gzip: gzipSync(text).length, drawings: found.length,
        names: [...new Set(found.map((x) => x.split('/')[1]))].length, sample: found.slice(0, 6),
        packageModules: pkgInputs.length, packageModulesWithBytes: pkgInputs.filter(([, b]) => b > 0).length,
        packageInputs: pkgInputs.length <= 6 ? pkgInputs : undefined, stroke: (text.match(/stroke/gi) || []).length,
      };
    }
  }
  return { out, texts };
}
