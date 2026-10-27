#!/usr/bin/env node
// The React package (plans/shipping.md card 2.2): `node tools/gen-react.mjs` turns the box, packages/icons/, into
// `@mavan/icons-react` in packages/icons-react/. `npm run release` runs it from the repo root with no arguments once
// the box is complete and gated, then packs the folder into the download (tools/release.mjs, stage 7).
//
// INPUT is the box and nothing else: svg/<m>/<name>[-filled].svg (each one evenodd `d`, taken byte for byte),
// metrics.json (the optical bearings), meta.json (the names), package.json (the version), README.md, LICENSE.md.
// It never opens src/icons/ or dist/, so the stroked source cannot reach the package.
//
// OUTPUT (each run first clears its previous output, all but package.template.json; the same box gives the same
// bytes — names in code-point order, no dates):
//   package.json           package.template.json plus the box's version (the box's is the root's: one source)
//   README.md  LICENSE.md  the box's, byte for byte
//   esm/index.mjs          `export { default as Check } from './icons/check.mjs'` for every name, and Icon
//   esm/icons/<name>.mjs   one module per name: its three masters' `d` and its twelve optical bearings, so a
//                          bundler keeps only what an app imports ("sideEffects": false, and /*#__PURE__*/)
//   esm/create-icon.mjs    the one renderer every component shares: the size rule, `optical`, `title`
//   esm/icon.mjs           Icon: every name by string — it imports the whole set
//   esm/index.d.mts        the types: IconName, IconProps, every component, Icon
//   cjs/…                  the same as CommonJS (.js, index.d.ts) for Jest and older tooling; the index requires
//                          each component lazily, on first use
//
// THE API is packages/templates/README.md's "Use in React": <Check size optical title …svg props />, <Icon name … />.
// The size rule (docs/01 §9): the master at or below the size, scaled up — 24 at and above 24, 20 for 20 to 23,
// 16 below 20 (below 16 the 16 master scaled down). `optical` sets margin to minus each optical bearing × size ÷
// master, to 0.01 px; the caller's own `style` is spread after it, so their margin wins. currentColor, no stroke.
//
// REFUSES (exit 1, nothing written): a box that is missing or incomplete — a master whose svg/ does not hold exactly
// meta.json's names × 2 files, a file not in the shipped form (one evenodd path under the exact root), a name
// without four optical bearings at a master — a component name that is not an identifier, collides with another or
// with a name the package exports itself (RESERVED), a template that carries a version, or generated code that
// contains the word "stroke".
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MASTERS = [24, 20, 16];
export const STYLES = ['', '-filled'];
/** Names the package exports beside the components; no component may take one. */
export const RESERVED = ['Icon', 'IconName', 'IconProps'];

// ── what ships verbatim in create-icon (Function#toString below), so the test runs the shipped code ─────────────

/** The size rule, docs/01 §9: the master at or below the size, scaled up; below 16 the 16 master scaled down. */
export function master(size) {
  return size >= 24 ? 24 : size >= 20 ? 20 : 16;
}

/** `optical`: CSS margin (top right bottom left) of minus each optical bearing [left, top, right, bottom], given in
 *  the master's units, × size ÷ master, rounded to 0.01 px: at most 0.005 px off, under a third of the 1/64 px
 *  Chromium lays out in (it then cuts each margin toward zero onto that grid: plans/proof-react measures both). */
export function opticalMargin(bearing, size, m) {
  var k = size / m;
  function px(v) { return -Math.round(v * k * 100) / 100 + 'px'; }
  return px(bearing[1]) + ' ' + px(bearing[2]) + ' ' + px(bearing[3]) + ' ' + px(bearing[0]);
}

// ── names ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** kebab-case file name → PascalCase component: `check-2-small-filled` → `Check2SmallFilled`. */
export function componentName(file) {
  return file.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

const byCode = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const SHIPPED = (m) => new RegExp(`^<svg xmlns="http://www\\.w3\\.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="currentColor"><path fill-rule="evenodd" d="([MLHVACQZ0-9 .-]+)"/></svg>\\n$`);

class Refusal extends Error {}
function refuse(msg, lines = []) {
  throw new Refusal([msg, ...lines.slice(0, 20).map((l) => `  ${l}`)].join('\n'));
}

/** Read and check the box: { version, files (sorted), d: {m: {file: d}}, optical: {file: [[l,t,r,b] × 3]}, docs }. */
export function readBox(box) {
  if (!existsSync(box) || !statSync(box).isDirectory()) refuse(`${box} does not exist: run \`npm run release\` first`);
  const need = ['package.json', 'meta.json', 'metrics.json', 'README.md', 'LICENSE.md', ...MASTERS.map((m) => `svg/${m}`)];
  const missing = need.filter((p) => !existsSync(join(box, p)));
  if (missing.length) refuse(`${box} is incomplete: ${missing.join(', ')} missing`);
  const pkg = JSON.parse(readFileSync(join(box, 'package.json'), 'utf8'));
  const version = pkg.version;
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(String(version))) refuse(`${box}/package.json has no semver version (${version})`);
  const meta = JSON.parse(readFileSync(join(box, 'meta.json'), 'utf8'));
  const names = (meta.icons ?? []).map((i) => i.name);
  if (!names.length || new Set(names).size !== names.length) refuse(`${box}/meta.json: ${names.length} names, ${names.length - new Set(names).size} repeated`);
  const files = names.flatMap((n) => STYLES.map((s) => `${n}${s}`)).sort(byCode);

  const d = {};
  for (const m of MASTERS) {
    const dir = join(box, 'svg', String(m));
    const got = readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4)).sort(byCode);
    const want = new Set(files), have = new Set(got);
    if (got.length !== files.length || got.some((f) => !want.has(f))) {
      refuse(`svg/${m}/ holds ${got.length} files, meta.json's ${names.length} names × 2 = ${files.length}`,
        [...files.filter((f) => !have.has(f)).map((f) => `missing ${f}.svg`), ...got.filter((f) => !want.has(f)).map((f) => `extra ${f}.svg`)]);
    }
    const re = SHIPPED(m), bad = [];
    d[m] = {};
    for (const f of files) {
      const x = re.exec(readFileSync(join(dir, `${f}.svg`), 'utf8'));
      if (x) d[m][f] = x[1]; else bad.push(`svg/${m}/${f}.svg`);
    }
    if (bad.length) refuse(`${bad.length} file(s) not in the shipped form (one <path fill-rule="evenodd" d> under the exact root):`, bad);
  }

  const metrics = JSON.parse(readFileSync(join(box, 'metrics.json'), 'utf8'));
  const optical = {}, bad = [];
  for (const f of files) {
    optical[f] = MASTERS.map((m) => {
      const o = metrics.icons?.[m]?.[f]?.optical;
      const v = o && [o.left, o.top, o.right, o.bottom];
      if (!v || !v.every(Number.isFinite)) { bad.push(`${m}/${f}`); return null; }
      return v;
    });
  }
  if (bad.length) refuse(`metrics.json lacks four optical bearings for ${bad.length} file(s):`, bad);

  const docs = Object.fromEntries(['README.md', 'LICENSE.md'].map((f) => [f, readFileSync(join(box, f))]));
  return { version, names, files, d, optical, docs };
}

// ── the code ────────────────────────────────────────────────────────────────────────────────────────────────────

/** The first line of every code file. It names the package and the box it was made from, never a repo path: nothing
 *  a customer receives names src/, tools/ or any other folder of this repo (card 2.1's standard). */
const head = (version) => `// @mavan/icons-react ${version}, generated from @mavan/icons ${version}. Do not edit.\n`;

/** create-icon: the renderer every component shares. Plain ES2017 (no spread, no ?.) so old toolchains parse it. */
function runtime(version, cjs) {
  return `${head(version)}${cjs ? "'use strict';\nvar React = require('react');" : "import React from 'react';"}

var has = Object.prototype.hasOwnProperty;
/** Props the component reads itself; every other prop goes to the <svg>. */
var OWN = { size: 1, optical: 1, title: 1, children: 1, width: 1, height: 1, viewBox: 1 };

${master.toString()}

${opticalMargin.toString()}

/** One component: paths and bearings are per master, 24 · 20 · 16; bearings are [left, top, right, bottom]. */
function createIcon(displayName, paths, bearings) {
  var Component = React.forwardRef(function (props, ref) {
    var size = props.size == null ? 24 : props.size;
    var m = master(size), i = m === 24 ? 0 : m === 20 ? 1 : 2;
    var title = props.title;
    var attrs = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 ' + m + ' ' + m, fill: 'currentColor' };
    if (title) attrs.role = 'img'; else attrs['aria-hidden'] = 'true';
    attrs.focusable = 'false';
    for (var k in props) if (has.call(props, k) && !has.call(OWN, k)) attrs[k] = props[k];
    if (props.optical) attrs.style = Object.assign({ margin: opticalMargin(bearings[i], size, m) }, props.style);
    attrs.ref = ref;
    return React.createElement('svg', attrs,
      title ? React.createElement('title', null, title) : null,
      React.createElement('path', { fillRule: 'evenodd', d: paths[i] }));
  });
  Component.displayName = displayName;
  return Component;
}

${cjs ? 'module.exports = createIcon;' : 'export default createIcon;'}
`;
}

function iconModule(f, box, cjs) {
  const paths = JSON.stringify(MASTERS.map((m) => box.d[m][f]));
  const bearings = JSON.stringify(box.optical[f]);
  const call = `/*#__PURE__*/ createIcon(${JSON.stringify(componentName(f))}, ${paths}, ${bearings})`;
  return cjs
    ? `'use strict';\nvar createIcon = require('../create-icon.js');\nmodule.exports = ${call};\n`
    : `import createIcon from '../create-icon.mjs';\nexport default ${call};\n`;
}

function registry(version, files, cjs) {
  const keys = files.map((f, i) => `  ${JSON.stringify(f)}: ${cjs ? `require('./icons/${f}.js')` : `i${i}`}`).join(',\n');
  return `${head(version)}${cjs ? "'use strict';\nvar React = require('react');" : `import React from 'react';\n${files.map((f, i) => `import i${i} from './icons/${f}.mjs';`).join('\n')}`}

/** Every name, outline and -filled. Using Icon bundles all of them. */
var icons = {
${keys}
};
var has = Object.prototype.hasOwnProperty;

/** <Icon name="check" … />: any name by string, the same props as its component; an unknown name renders nothing. */
var Icon = React.forwardRef(function (props, ref) {
  var C = has.call(icons, props.name) ? icons[props.name] : null;
  if (!C) return null;
  var p = {};
  for (var k in props) if (has.call(props, k) && k !== 'name') p[k] = props[k];
  p.ref = ref;
  return React.createElement(C, p);
});
Icon.displayName = 'Icon';

${cjs ? 'module.exports = Icon;' : 'export default Icon;'}
`;
}

function index(version, files, cjs) {
  if (!cjs) {
    return `${head(version)}export { default as Icon } from './icon.mjs';\n${files.map((f) => `export { default as ${componentName(f)} } from './icons/${f}.mjs';`).join('\n')}\n`;
  }
  const lazy = (n, p) => `Object.defineProperty(exports, ${JSON.stringify(n)}, { enumerable: true, get: function () { return require(${JSON.stringify(p)}); } });`;
  return `${head(version)}'use strict';\n${[lazy('Icon', './icon.js'), ...files.map((f) => lazy(componentName(f), `./icons/${f}.js`))].join('\n')}\n`;
}

function types(version, files) {
  return `${head(version)}import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

/** Every name in the set, outline and \`-filled\`: what \`<Icon name>\` takes. */
export type IconName =
${files.map((f) => `  | ${JSON.stringify(f)}`).join('\n')};

/** The props every icon component takes. Every <svg> prop not listed here (className, style, handlers) goes to the
 *  <svg>; width, height and viewBox follow \`size\`. \`name\` is Icon's alone. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'children' | 'width' | 'height' | 'viewBox' | 'size' | 'title' | 'name'> {
  /** Size in pixels, default 24. Picks the master: 16 for 16 to 19 px, 20 for 20 to 23, 24 at and above 24; below
   *  16 the 16 master is scaled down. */
  size?: number;
  /** Default false. Negative margins from metrics.json's optical bearings, so padding and gap are true to the ink. */
  optical?: boolean;
  /** A label: the icon becomes role="img" with a <title>. Without it the icon is aria-hidden. */
  title?: string;
}

type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

/** Any icon by name, as a string. It pulls in the whole set: import the component wherever the name is known. */
export declare const Icon: ForwardRefExoticComponent<IconProps & { name: IconName } & RefAttributes<SVGSVGElement>>;

${files.map((f) => `/** \`${f}\` */\nexport declare const ${componentName(f)}: IconComponent;`).join('\n')}

export {};
`;
}

/** Write the package from `boxDir` into `outDir`. Returns { version, names, files, written, bytes }. */
export function generate({ boxDir, outDir }) {
  const template = join(outDir, 'package.template.json');
  if (!existsSync(template)) refuse(`${template} is missing`);
  const tpl = JSON.parse(readFileSync(template, 'utf8'));
  if ('version' in tpl) refuse(`${template} carries a version; the box's package.json is the one source`);
  if (tpl.name !== '@mavan/icons-react') refuse(`${template} names ${tpl.name}, not @mavan/icons-react`);

  const box = readBox(boxDir);
  const comps = box.files.map(componentName);
  const badIds = comps.filter((c) => !/^[A-Z][A-Za-z0-9]*$/.test(c));
  if (badIds.length) refuse(`${badIds.length} component name(s) are not identifiers:`, badIds);
  const seen = new Map(), clash = [];
  box.files.forEach((f, i) => { const c = comps[i]; if (seen.has(c)) clash.push(`${seen.get(c)} and ${f} → ${c}`); seen.set(c, f); });
  for (const r of RESERVED) if (seen.has(r)) clash.push(`${seen.get(r)} → ${r}, which the package exports itself`);
  if (clash.length) refuse(`${clash.length} component name collision(s):`, clash);

  const out = new Map();
  const { name, ...rest } = tpl;
  out.set('package.json', `${JSON.stringify({ name, version: box.version, ...rest }, null, 2)}\n`);
  for (const [f, buf] of Object.entries(box.docs)) out.set(f, buf);
  for (const cjs of [false, true]) {
    const dir = cjs ? 'cjs' : 'esm', ext = cjs ? 'js' : 'mjs';
    out.set(`${dir}/create-icon.${ext}`, runtime(box.version, cjs));
    out.set(`${dir}/icon.${ext}`, registry(box.version, box.files, cjs));
    out.set(`${dir}/index.${ext}`, index(box.version, box.files, cjs));
    out.set(`${dir}/index.d.${cjs ? 'ts' : 'mts'}`, types(box.version, box.files));
    for (const f of box.files) out.set(`${dir}/icons/${f}.${ext}`, iconModule(f, box, cjs));
  }
  const stroked = [...out].filter(([p, t]) => !p.endsWith('.md') && /stroke/i.test(String(t))).map(([p]) => p);
  if (stroked.length) refuse(`generated code contains "stroke":`, stroked);

  // clear the previous output, then write
  if (existsSync(outDir)) for (const e of readdirSync(outDir)) if (e !== 'package.template.json') rmSync(join(outDir, e), { recursive: true, force: true });
  let bytes = 0;
  for (const [p, t] of [...out].sort(([a], [b]) => byCode(a, b))) {
    mkdirSync(dirname(join(outDir, p)), { recursive: true });
    writeFileSync(join(outDir, p), t);
    bytes += Buffer.byteLength(t);
  }
  return { version: box.version, names: box.names.length, files: box.files.length, written: out.size, bytes };
}

async function main(argv) {
  if (argv.length) { console.error('usage: node tools/gen-react.mjs   (no arguments: packages/icons/ → packages/icons-react/)'); process.exit(2); }
  const t0 = performance.now();
  try {
    const boxDir = join(ROOT, 'packages/icons'), outDir = join(ROOT, 'packages/icons-react');
    const r = generate({ boxDir, outDir });
    console.log(`  gen-react  @mavan/icons-react ${r.version}: ${r.files} components (${r.names} names × 2) + Icon, ESM and CJS,`
      + ` ${r.written} files, ${(r.bytes / 1e6).toFixed(1)} MB → ${relative(ROOT, outDir)}/ in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  } catch (e) {
    console.error(e instanceof Refusal ? `gen-react refused: ${e.message}` : e.stack);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
