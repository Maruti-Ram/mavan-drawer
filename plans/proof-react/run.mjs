// The card 2.2 proof (plans/shipping.md): `@mavan/icons-react` as a customer's app meets it, from the tarball the
// release put in the download. Run after `npm run release -- --allow-dirty --skip-check` (or a real release):
//   node plans/proof-react/run.mjs [--no-install]
// 1. installs the tarball (npm install --no-save) into apps/18.0.0, 18.3.1, 19.0.0 and 19.3.0
// 2. ssr.mjs: every component at 12 sizes, ESM and CJS entries, on all four Reacts, against the box's files
// 3. browser.mjs: Chromium, React 19.3 and 18.3 — pixels, currentColor, title / aria-hidden, refs, optical, sheets
// 4. bytes.mjs: the installed bytes are the box's outlined fills, and no stroked centreline is in them
// 5. bundle.mjs: an app importing Check carries check alone; Icon by name carries the set
// 6. types.mjs: tsc --noEmit on check.tsx in five resolutions
// Writes out/report.json; prints a verdict per check; exits 1 when any fails.
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HERE, OUT, APPS, BROWSER_APPS, appDir, pkgDir, release, box, kb, mb } from './lib.mjs';

const t0 = performance.now();
const secs = (t) => `${((performance.now() - t) / 1000).toFixed(1)} s`;
const rel = release(), B = box(rel.folder), N = B.files.length;
/** The README's names for components that shadow a global, read from the installed package: the backticked names
 *  before "among them" in the line that speaks of globals. "Among them" makes the list partial, so each name on it
 *  must be a global in the browser or in Node, and a global it leaves out is no difference. null: no such list. */
const readmeGlobals = (text) => {
  const line = text.split('\n').find((l) => /global/.test(l) && /among them/.test(l));
  const x = line && /((?:`[A-Za-z0-9]+`(?:, | and ))*`[A-Za-z0-9]+`) among them/.exec(line);
  return x ? [...x[1].matchAll(/`([A-Za-z0-9]+)`/g)].map((m) => m[1]) : null;
};
mkdirSync(OUT, { recursive: true });
const report = { version: rel.version, tarball: rel.tgz.replace(/.*dist\//, 'dist/'), names: B.names.length, files: N, timing: {} };
const verdicts = [];
const verdict = (ok, what) => { verdicts.push([ok, what]); console.log(`${ok ? 'pass' : 'FAIL'}  ${what}`); };
/** What the README (card 2.3's, committed) says against what was measured: listed, not a failure of the package. */
const notes = [];
const note = (ok, what) => { notes.push(`${ok ? 'README holds' : 'README differs'}: ${what}`); console.log(`${ok ? 'note' : 'NOTE'}  README: ${what}`); };

// 1. install the tarball
if (!process.argv.includes('--no-install')) {
  const t = performance.now();
  for (const v of APPS) {
    const r = spawnSync('npm', ['install', '--no-save', '--no-audit', '--no-fund', rel.tgz], { cwd: appDir(v), encoding: 'utf8' });
    if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); }
  }
  report.timing.install = secs(t);
}

// 2. server rendering, in each app's own resolution
report.ssr = {};
{
  const t = performance.now();
  const code = `import * as esm from '@mavan/icons-react'; const s = await import(${JSON.stringify(pathToFileURL(join(HERE, 'ssr.mjs')).href)}); await s.main(esm, import.meta.resolve('@mavan/icons-react'));`;
  for (const v of APPS) {
    const r = spawnSync('node', ['--input-type=module', '-e', code], { cwd: appDir(v), encoding: 'utf8', maxBuffer: 1 << 26 });
    if (r.status !== 0) { verdict(false, `SSR on React ${v}: exit ${r.status} ${r.stderr.slice(0, 500)}`); continue; }
    const s = report.ssr[v] = JSON.parse(r.stdout.trim().split('\n').pop());
    const e = s.entries;
    const ok = ['esm', 'cjs'].every((k) => e[k].exact === e[k].of && e[k].optical === e[k].of && e[k].titled === N && e[k].byName === 3 * N && e[k].stroke === 0)
      && !s.issues.length && !s.warningCount && s.esmEntry === '@mavan/icons-react/esm/index.mjs' && s.cjsEntry === '@mavan/icons-react/cjs/index.js' && s.react.split('-')[0] === v;
    verdict(ok, `SSR React ${s.react}: ESM ${e.esm.exact}/${e.esm.of} and CJS ${e.cjs.exact}/${e.cjs.of} renders exact (12 sizes × ${N}), optical ${e.esm.optical} + ${e.cjs.optical} within 0.005 px (worst ${e.esm.worstOptical}),`
      + ` titled ${e.esm.titled}, Icon-by-name ${e.esm.byName}; ${e.esm.renders + e.cjs.renders} renders in ${e.esm.ms + e.cjs.ms} ms; ${s.warningCount} React warnings; ${s.issues.length} issues${s.issues.length ? `: ${s.issues.slice(0, 3).join(' | ')}` : ''}`);
  }
  report.timing.ssr = secs(t);
}

// 3. the browser
{
  const t = performance.now();
  const { main } = await import('./browser.mjs');
  const b = report.browser = await main();
  for (const v of BROWSER_APPS) {
    const r = b.apps[v];
    verdict(!r.console.length, `Chromium ${b.chromium}, React ${v}: console clean (${r.console.length} errors or warnings${r.console.length ? `: ${r.console.slice(0, 3).join(' | ')}` : ''})`);
    for (const S of [16, 20, 24]) {
      const p = r.pixels[S];
      const ok = p.inked === N && !p.imgFail && !p.img.icons && !p.inline.icons && !p.react2.icons;
      verdict(ok, `pixels React ${v} at ${S}: ${N} icons, ${p.pixelsCompared.toLocaleString('en')} pixels each — vs the box's .svg as <img>: ${p.img.pixels} differ (${p.img.icons} icons);`
        + ` vs the box's .svg inlined: ${p.inline.pixels} (${p.inline.icons}); control (React twice): ${p.react2.pixels}${ok ? '' : ` — ${[...p.img.list, ...p.inline.list].slice(0, 6).join(', ')}`}`);
    }
    const c = r.color;
    verdict(!c.computed.badCount && !c.worstOpaque && !c.outsideBound && c.opaque > 0,
      `currentColor React ${v}: ${c.computed.checked} svg and path elements compute fill rgb(214, 40, 110); ${c.opaque.toLocaleString('en')} opaque pixels all exactly that colour,`
      + ` ${c.partial.toLocaleString('en')} edge pixels within 8-bit premultiplied rounding (${c.outsideBound} outside; worst ${c.worstAlphaAtLeastHalf} at alpha ≥ 128)`);
    const a = r.a11y;
    verdict(!a.decoBad && !a.titledBad && a.deco === N && a.titled === N && !a.decoTreeImgs && a.titledTreeImgs === N && a.rolesImg === N && a.rolesImgNamedCheck === 1
      && a.headTitles.join() === 'proof' && !a.titlesOutsideSvg, `title / aria React ${v}: ${a.deco} without title aria-hidden + focusable=false, none in the accessibility tree;`
      + ` ${a.titled} with title role=img + <title> first, ${a.titledTreeImgs} named images in the tree; <title> stays in the <svg> (head titles: ${a.headTitles.join(', ')})`);
    verdict(!a.byNameBadCount && a.byName === 3 * N, `Icon by name React ${v}: ${a.byName} renders identical to the component's DOM`);
    verdict(a.refs.every(Boolean), `ref React ${v}: reaches the <svg> through a component and through Icon (${a.refs})`);
    for (const S of [16, 20, 24]) {
      const o = r.optical[S];
      verdict(o.layoutExplained === o.icons && o.worstVsExact <= 0.01 + 2 / 64 + 1e-9 && !o.opticalOffNotSize,
        `optical React ${v} at ${S}: ${o.icons} laid-out boxes = size − (left + right) × size ÷ master within ${o.worstVsExact} px (${o.worstCase});`
        + ` all ${o.layoutExplained} exactly the 0.01 px margins on Chromium's 1/64 px layout grid; optical off: ${o.icons - o.opticalOffNotSize} exactly size × size`);
    }
    if (a.globals) {
      const listed = readmeGlobals(readFileSync(join(pkgDir(v), 'README.md'), 'utf8')), node = report.ssr[v]?.nodeGlobals;
      if (!listed) note(false, 'no "… among them" list of the component names that shadow a global');
      else if (!node) note(false, `its ${listed.length} names that shadow a global not checked: no Node globals from SSR on React ${v}`);
      else {
        const any = new Set([...a.globals, ...node]);
        const neither = listed.filter((g) => !any.has(g)), more = [...any].filter((g) => !listed.includes(g)).sort();
        note(!neither.length, `it lists ${listed.length} component names that shadow a global, "among them" (${listed.join(', ')}): ${listed.length - neither.length} do —`
          + ` in Chromium ${b.chromium} ${a.globals.length} (${a.globals.join(', ')}), in Node ${process.version} ${node.length} (${node.join(', ')})`
          + `${neither.length ? `; ${neither.join(', ')} a global in neither` : ''}${more.length ? `; not listed, as a partial list allows: ${more.join(', ')}` : ''}`);
      }
    }
  }
  for (const k of ['contact1x', 'contact2x']) if (b.apps[BROWSER_APPS[0]][k]) console.log(`      ${b.apps[BROWSER_APPS[0]][k].file} (${b.apps[BROWSER_APPS[0]][k].width} × ${b.apps[BROWSER_APPS[0]][k].height})`);
  report.timing.browser = secs(t);
}

// 4 and 5. the bundles, then the bytes
{
  const t = performance.now();
  const bundle = await import('./bundle.mjs');
  const { out, texts } = await bundle.main();
  report.bundles = out;
  const oc = out['only-check'], ocx = out['only-check (react external)'], ib = out['icon-by-name'], ibx = out['icon-by-name (react external)'];
  verdict(oc.drawings === 3 && oc.sample.join() === '24/check,20/check,16/check' && ocx.drawings === 3,
    `bundle importing only Check: ${oc.bytes.toLocaleString('en')} B (${oc.gzip.toLocaleString('en')} gzip) with React; the package's share ${ocx.bytes.toLocaleString('en')} B (${ocx.gzip.toLocaleString('en')} gzip):`
    + ` ${oc.drawings} drawings, ${oc.sample.join(', ')}, from ${ocx.packageModulesWithBytes} modules (${(ocx.packageInputs || []).map(([p, n]) => `${p} ${n} B`).join(', ')})`);
  verdict(ib.drawings === 3 * N && ibx.drawings === 3 * N,
    `bundle using Icon by name: ${ib.bytes.toLocaleString('en')} B (${ib.gzip.toLocaleString('en')} gzip) with React; the package's share ${ibx.bytes.toLocaleString('en')} B (${ibx.gzip.toLocaleString('en')} gzip): ${ib.drawings} drawings, ${ib.names} names`);
  const bytes = await import('./bytes.mjs');
  const y = report.bytes = bytes.main(texts);
  verdict(y.sameInEveryApp && !y.issues.length, `installed package = the tarball's ${y.files} files, identical in all four apps; ${y.files} files, ${mb(y.unpacked)} unpacked, tarball ${mb(y.tarball)}`);
  verdict(!y.strokeInCode.length, `"stroke" in the package's code: ${y.strokeInCode.length} files (README.md says it ${y.strokeInProse['README.md']} times, in prose: "do not set stroke")`);
  verdict(y.modulesExact === 2 * N && !y.pathStringsNotInBox && !y.pathStringsOutsideIcons,
    `every module's three d equal its box files byte for byte, bearings equal metrics.json: ${y.modulesExact}/${2 * N} (ESM + CJS); ${y.pathStrings} path strings in the code, ${y.pathStringsNotInBox} not a box d, ${y.pathStringsOutsideIcons} outside icons/`);
  const sb = Object.entries(y.stroked.bundles);
  verdict(!y.stroked.wholeInPackage && sb.every(([, v]) => !v.whole),
    `stroked source: of dist/icons.json's ${y.stroked.centrelines} centrelines, ${y.stroked.wholeInPackage} appear whole in the package, ${sb.map(([k, v]) => `${v.whole} in ${k}`).join(', ')};`
    + ` ${y.stroked.prefixOnly} match only as the first commands of a longer outlined path; controls: ${y.stroked.control}, ${y.stroked.planted}`);
  console.log(`      modules: ESM ${y.esmModules.count} × ${kb(y.esmModules.min)}–${kb(y.esmModules.max)} (median ${kb(y.esmModules.median)}), CJS median ${kb(y.cjsModules.median)};`
    + ` shared: ${Object.entries(y.shared).filter(([f]) => !f.endsWith('.md') && f !== 'package.json').map(([f, n]) => `${f} ${kb(n)}`).join(', ')}`);
  report.timing.bundlesAndBytes = secs(t);
}

// 6. types
{
  const t = performance.now();
  const types = await import('./types.mjs');
  const ty = report.types = types.main();
  const expected = (readFileSync(join(HERE, 'check.tsx'), 'utf8').match(/^\s*(?:\/\/|\{\/\*) @ts-expect-error/gm) || []).length;
  for (const r of ty.runs) {
    const want = /cjs|node10/.test(r.resolution) ? 'cjs/index.d.ts' : 'esm/index.d.mts';
    verdict(r.exit === 0 && r.read.join() === want, `tsc ${ty.tsc.replace('Version ', '')} --noEmit, React ${r.react} types, ${r.resolution}: exit ${r.exit}, read ${r.read.join(', ')}; the ${expected} @ts-expect-error lines are errors${r.errors.length ? ` — ${r.errors.slice(0, 3).join(' | ')}` : ''}`);
  }
  report.timing.types = secs(t);
}

report.timing.total = secs(t0);
report.verdicts = verdicts.map(([ok, what]) => `${ok ? 'pass' : 'FAIL'}  ${what}`);
report.notes = notes;
writeFileSync(join(OUT, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
const failed = verdicts.filter(([ok]) => !ok).length;
console.log(`\n${verdicts.length - failed} pass, ${failed} fail, ${notes.filter((n) => n.startsWith('README differs')).length} README note(s) · ${Object.entries(report.timing).map(([k, v]) => `${k} ${v}`).join(' · ')} → plans/proof-react/out/report.json`);
process.exit(failed ? 1 : 0);
