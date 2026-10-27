// Step 4 of the card 2.2 proof: the bytes the package ships are the box's outlined fills, not the stroked source.
// Reads the installed package (apps/19.3.0/node_modules/@mavan/icons-react, from the tarball): its files and sizes,
// the word "stroke", every path string in it against the box's files, and — read from the repo here, never by the
// generator — every stroked centreline in dist/icons.json, searched for in the package and in the bundles.
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { REPO, APPS, pkgDir, release, box, walk, findAll, pascal, MASTERS } from './lib.mjs';

export function main(bundleTexts = {}) {
  const rel = release(), B = box(rel.folder), dir = pkgDir('19.3.0');
  const files = walk(dir), text = Object.fromEntries(files.map((f) => [f, readFileSync(join(dir, f), 'utf8')]));
  const size = (f) => statSync(join(dir, f)).size;
  const r = { files: files.length, unpacked: files.reduce((a, f) => a + size(f), 0), tarball: statSync(rel.tgz).size, issues: [] };
  const bad = (s) => { if (r.issues.length < 40) r.issues.push(s); };

  // the installed package is the tarball, and the same in every app
  const listed = spawnSync('tar', ['-tzf', rel.tgz], { encoding: 'utf8' }).stdout.split('\n').filter(Boolean).map((p) => p.replace(/^package\//, '')).sort();
  if (listed.join() !== files.join()) bad(`installed files differ from the tarball's ${listed.length}`);
  const hash = (d) => createHash('sha256').update(walk(d).map((f) => `${f}\0${readFileSync(join(d, f), 'utf8')}`).join('\0')).digest('hex').slice(0, 16);
  r.sameInEveryApp = new Set(APPS.map((v) => hash(pkgDir(v)))).size === 1;
  r.layout = [...new Set(files.map((f) => f.replace(/icons\/[^/]+$/, 'icons/*')))];

  // module sizes
  for (const [k, re] of [['esm', /^esm\/icons\/.*\.mjs$/], ['cjs', /^cjs\/icons\/.*\.js$/]]) {
    const s = files.filter((f) => re.test(f)).map(size).sort((a, b) => a - b);
    r[`${k}Modules`] = { count: s.length, min: s[0], median: s[s.length >> 1], max: s[s.length - 1], mean: Math.round(s.reduce((a, b) => a + b, 0) / s.length), total: s.reduce((a, b) => a + b, 0) };
  }
  r.shared = Object.fromEntries(files.filter((f) => !/\/icons\//.test(f)).map((f) => [f, size(f)]));

  // "stroke": none in the code; the README and LICENSE are prose
  r.strokeInCode = files.filter((f) => !f.endsWith('.md') && /stroke/i.test(text[f]));
  r.strokeInProse = Object.fromEntries(files.filter((f) => f.endsWith('.md')).map((f) => [f, (text[f].match(/stroke/gi) || []).length]));

  // every module carries its name's three d, byte for byte, and its optical bearings
  let modulesExact = 0;
  for (const [ext, dirName] of [['mjs', 'esm'], ['js', 'cjs']]) {
    for (const f of B.files) {
      const t = text[`${dirName}/icons/${f}.${ext}`];
      const m = /createIcon\(("[A-Za-z0-9]+"), (\[[^\]]*\]), (\[\[[^\n]*\]\])\);\n$/.exec(t ?? '');
      if (!m) { bad(`${dirName}/icons/${f}.${ext}: no createIcon call`); continue; }
      const [name, paths, bearings] = [JSON.parse(m[1]), JSON.parse(m[2]), JSON.parse(m[3])];
      const wantB = MASTERS.map((M) => { const o = B.metrics.icons[M][f].optical; return [o.left, o.top, o.right, o.bottom]; });
      if (name === pascal(f) && paths.length === 3 && MASTERS.every((M, i) => paths[i] === B.d[M][f]) && JSON.stringify(bearings) === JSON.stringify(wantB)) modulesExact++;
      else bad(`${dirName}/icons/${f}.${ext}: name, d or bearings differ from the box`);
    }
  }
  r.modulesExact = modulesExact;

  // every path-like string anywhere in the code is a box file's d, and only the icon modules hold any
  const boxD = new Set(MASTERS.flatMap((M) => B.files.map((f) => B.d[M][f])));
  let pathStrings = 0, outsideIcons = 0, notBox = 0;
  for (const f of files.filter((x) => !x.endsWith('.md'))) {
    for (const m of text[f].matchAll(/"(M[0-9MLHVACQZ .-]*)"/g)) {
      pathStrings++;
      if (!/\/icons\//.test(f)) outsideIcons++;
      if (!boxD.has(m[1])) { notBox++; bad(`${f}: a path string that is no box file's d`); }
    }
  }
  Object.assign(r, { pathStrings, pathStringsOutsideIcons: outsideIcons, pathStringsNotInBox: notBox, boxDistinctD: boxD.size });

  // the stroked source: no centreline from dist/icons.json anywhere in the package or a bundle
  const src = JSON.parse(readFileSync(join(REPO, 'dist/icons.json'), 'utf8'));
  const stroked = new Set();
  for (const M of Object.keys(src)) for (const e of Object.values(src[M])) for (const p of e.paths ?? []) stroked.add(p);
  const everything = files.map((f) => text[f]).join('\n');
  const hits = findAll(everything, stroked, { whole: true }), prefixes = findAll(everything, stroked);
  // a control, so the negative is not vacuous: the same search finds the box's own d in the package
  const sample = [...boxD].filter((_, i) => i % 79 === 0);
  r.stroked = {
    centrelines: stroked.size, wholeInPackage: hits.size, hitList: [...hits].slice(0, 10),
    prefixOnly: prefixes.size, prefixSample: [...prefixes].slice(0, 3),
    control: `${findAll(everything, sample, { whole: true }).size} of ${sample.length} box d found whole`,
    planted: (() => { const p = [...stroked].filter((_, i) => i % 239 === 0); return `${findAll(`${everything}${p.map((x) => `"${x}"`).join(',')}`, stroked, { whole: true }).size} of ${p.length} planted centrelines found`; })(),
  };
  r.stroked.bundles = Object.fromEntries(Object.entries(bundleTexts).map(([k, t]) => [k, { whole: findAll(t, stroked, { whole: true }).size, prefixOnly: findAll(t, stroked).size }]));
  r.distIconsJson = { masters: Object.keys(src), entries: Object.values(src).reduce((a, x) => a + Object.keys(x).length, 0) };
  return r;
}
