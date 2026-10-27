// Step 2 of the card 2.2 proof: server-render every component at every size, through the ESM and the CJS entry,
// against the box's files. Run by run.mjs in a child process whose working directory is apps/<react version>/, so
// '@mavan/icons-react', 'react' and 'react-dom/server' resolve the way that app resolves them:
//   cd apps/19.3.0 && node --input-type=module -e "import * as esm from '@mavan/icons-react'; …s.main(esm, url)"
// (the eval's imports resolve from the working directory; this module's own would resolve from plans/proof-react/)
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { box, release, ruleMaster, pascal, MASTERS } from './lib.mjs';

const SIZES = [12, 15, 16, 17, 19, 20, 21, 23, 24, 25, 32, 48];
const WANT_MASTER = { 12: 16, 15: 16, 16: 16, 17: 16, 19: 16, 20: 20, 21: 20, 23: 20, 24: 24, 25: 24, 32: 24, 48: 24 };

export async function main(esm, esmUrl) {
  const cwd = process.cwd();
  const require = createRequire(join(cwd, 'x.js'));
  const React = require('react'), server = require('react-dom/server');
  const cjs = require('@mavan/icons-react');
  const where = { esm: esmUrl, cjs: require.resolve('@mavan/icons-react') };
  const B = box(release().folder);
  const issues = [], warnings = [];
  const orig = { error: console.error, warn: console.warn };
  console.error = (...a) => warnings.push(`error: ${a.join(' ').slice(0, 300)}`);
  console.warn = (...a) => warnings.push(`warn: ${a.join(' ').slice(0, 300)}`);
  const result = { react: React.version, entries: {} };
  try {
    for (const [entry, lib] of [['esm', esm], ['cjs', cjs]]) {
      const t0 = performance.now();
      let renders = 0, exact = 0, stroke = 0, optical = 0, worstOptical = 0, titled = 0, byName = 0;
      const bad = (s) => { if (issues.length < 40) issues.push(`${entry}: ${s}`); };
      const html = (C, p) => { renders++; return server.renderToStaticMarkup(React.createElement(C, p)); };

      // the exports: every component, and Icon, nothing else
      const want = [...B.files.map(pascal), 'Icon'].sort(), got = Object.keys(lib).filter((k) => k !== 'default' && k !== '__esModule').sort();
      if (want.join() !== got.join()) bad(`exports ${got.length}, want ${want.length}: ${want.filter((k) => !got.includes(k)).slice(0, 5)} missing, ${got.filter((k) => !want.includes(k)).slice(0, 5)} extra`);

      for (const f of B.files) {
        const C = lib[pascal(f)];
        if (!C) { bad(`${f}: no component ${pascal(f)}`); continue; }
        for (const s of SIZES) {
          const m = ruleMaster(s);
          if (m !== WANT_MASTER[s]) bad(`the proof's own rule picks ${m} at ${s}`);
          const plain = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${m} ${m}" fill="currentColor" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="${B.d[m][f]}"></path></svg>`;
          const a = html(C, { size: s });
          if (/stroke/i.test(a)) stroke++;
          if (a === plain) exact++; else bad(`${f} at ${s}: ${a.slice(0, 200)}`);
          // optical: the same markup with style="margin: …", each value minus the bearing × s ÷ m
          const o = B.metrics.icons[m][f].optical, k = s / m;
          const b = html(C, { size: s, optical: true });
          const mm = /^<svg ([^>]*) style="margin:([^"]*)"><path/.exec(b);
          const vals = mm ? mm[2].split(' ').map((v) => parseFloat(v)) : [];
          const exactM = [o.top, o.right, o.bottom, o.left].map((v) => -v * k);
          if (!mm || vals.length !== 4 || b.replace(/ style="[^"]*"/, '') !== plain) { bad(`${f} at ${s} optical: ${b.slice(0, 200)}`); continue; }
          const off = Math.max(...vals.map((v, i) => Math.abs(v - exactM[i])));
          worstOptical = Math.max(worstOptical, off);
          if (off > 0.005 + 1e-9) bad(`${f} at ${s} optical: ${mm[2]} vs exact ${exactM.map((v) => v.toFixed(4)).join(' ')}`); else optical++;
        }
        // title: role="img" and a <title> first, no aria-hidden
        const t = html(C, { title: `Label ${f}` });
        const tw = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img" focusable="false"><title>Label ${f}</title><path fill-rule="evenodd" d="${B.d[24][f]}"></path></svg>`;
        if (t === tw) titled++; else bad(`${f} titled: ${t.slice(0, 200)}`);
        // Icon by name renders the component's markup
        for (const s of [16, 20, 24]) {
          if (html(lib.Icon, { name: f, size: s }) === html(C, { size: s })) byName++; else bad(`<Icon name="${f}" size={${s}}> differs from ${pascal(f)}`);
        }
      }
      // the other props reach the <svg>; a caller's margin wins over optical's; width/height/viewBox follow size
      const C = lib.Check;
      const cases = [
        [{ className: 'x', 'data-k': 'v', id: 'i', onClick: () => {} }, / class="x"/, / data-k="v"/, / id="i"/],
        [{ optical: true, style: { margin: 0 } }, / style="margin:0"/],
        [{ optical: true, style: { marginLeft: 3, color: 'red' } }, / style="margin:-7.41px -4.95px -7.34px -4.4px;margin-left:3px;color:red"/],
        [{ size: 20, width: 99, height: 99, viewBox: '0 0 1 1' }, / width="20" height="20" viewBox="0 0 20 20"/],
        [{ 'aria-label': 'Done', 'aria-hidden': undefined, role: 'img' }, / role="img"/, / aria-label="Done"/],
      ];
      for (const [p, ...res] of cases) { const h = html(C, p); for (const re of res) if (!re.test(h)) bad(`props ${JSON.stringify(p)}: ${h.slice(0, 220)} lacks ${re}`); }
      if (html(lib.Icon, { name: 'no-such-icon' }) !== '') bad('an unknown name renders something');

      result.entries[entry] = { renders, exact, of: B.files.length * SIZES.length, stroke, optical, worstOptical: +worstOptical.toFixed(6), titled, byName, ms: Math.round(performance.now() - t0) };
    }
  } finally { Object.assign(console, orig); }
  result.nodeGlobals = Object.keys(esm).filter((k) => k in globalThis);
  result.esmEntry = where.esm.replace(/.*node_modules\//, '');
  result.cjsEntry = where.cjs.replace(/.*node_modules\//, '');
  result.sample = server.renderToStaticMarkup(React.createElement(cjs.Check, { size: 16 }));
  result.issues = issues; result.warnings = warnings.slice(0, 20); result.warningCount = warnings.length;
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
