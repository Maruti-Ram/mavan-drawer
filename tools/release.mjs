#!/usr/bin/env node
// The box (plans/shipping.md card 2.1): `npm run release` builds `@mavan/icons`, the folder and the zip the customer
// downloads, from the sheet's approved rows. The stroked source in src/icons/ never leaves the repo: every shipped
// SVG is the outliner's output (tools/outline.mjs), and icons.json is built from those outlined files, never copied
// from dist/icons.json (which holds the stroked source).
//
//   npm run release                      the release: refuses a dirty tree, a failing check, unfilled templates and,
//                                        at 1.0.0 or later, a sheet whose names differ from packages/names.lock
//   npm run release -- --gate            also the raster gate on every file (outline.mjs `check`, all cores; slow)
//   npm run release -- --lock            write or extend packages/names.lock from the sheet's approved names under
//                                        the current version, then stop (1.0.0 or later only; commit it, then release)
//
//   dev flags, for iterating on this tool; a run with any of them is a DEV BUILD — its folder and zip carry `-dev`
//   in their names and the summary says so:
//     --allow-dirty                      run on a tree with uncommitted changes
//     --skip-check                       skip `npm run check` (dist/ is rebuilt with tools/build.mjs instead)
//     --templates <dir>                  take README.md and LICENSE.md from <dir> instead of packages/templates/
//
// WHAT IT WRITES (each run first clears its own previous output: packages/icons/ but its template, the version's
// folder and zip, so a retired icon cannot ride along)
//
//   packages/icons/                      the npm package, gitignored but for package.template.json
//     package.json                       package.template.json plus the root package.json's version (the one source)
//     svg/24|20|16/<name>.svg            the outlined outline drawing; <name>-filled.svg its filled twin
//     icons.json                         { name, version, fillRule, viewBox: {24: "0 0 24 24", …},
//                                          icons: { "24": { "check": "M…", "check-filled": "M…" }, … } } — each value
//                                          the one evenodd `d` of the shipped file
//     metrics.json                       { name, version, units, icons: { "24": { "check": { ink, bearing, optical } } } }
//                                          from dist/metrics.json, trimmed to the customer's contract
//     meta.json                          tools/package-meta.mjs's, less each icon's `section` (`shipMeta`): the sheet's
//                                          drawing order ("D · The rest, by audit rank") is how the set was drawn, not
//                                          what an icon is, and `category` is the customer's grouping (Maruti,
//                                          2026-10-27: "Leave section out"); dist/meta.json keeps it for our own use.
//                                          Every other key in its own order, byte for byte as package-meta.mjs writes it
//     README.md, LICENSE.md              packages/templates/ with {{version}}, {{icons}}, {{names}} filled
//     CHANGELOG.md                       from meta.json's approval dates and packages/names.lock
//   dist/release/mavan-drawer-<v>/       the download: svg/, the three JSON files, README, LICENSE, CHANGELOG and
//                                        the tarballs (mavan-icons-<v>.tgz; mavan-icons-react-<v>.tgz once card 2.2's
//                                        tools/gen-react.mjs exists)
//   dist/release/mavan-drawer-<v>.zip    that folder, entries sorted, every time stamp the CHANGELOG's date
//   dist/release/mavan-drawer-<v>.check.log   the full output of `npm run check`
//
// THE GATES — over every shipped file, on every run; any failure is exit 1 and no zip:
//   a  no strokes: no "stroke" anywhere in the text, no comment, the root exactly <svg xmlns viewBox
//      fill="currentColor">, one <path fill-rule="evenodd" d> and nothing else, absolute M L H V A C Q Z at 3 dp; and
//      read by SVG's own rule (a path is stroked when it or an ancestor names a stroke paint; the initial value is
//      none) zero paths are stroked and zero attributes are stroke attributes. (The source's readers — build.mjs,
//      lint, parseSource — cannot judge a shipped file: they take every path without its own fill="currentColor" for
//      a line stroked by the root, so they would read the shipped path, filled from its root, as a line.)
//   b  each file's ink box equals its source's exact ink to 2 dp (outline.mjs `sourceBox` / `outlinedBox`)
//   c  2 × 3 × the sheet's approved rows files, and the shipped names are the approved names exactly
//   d  metrics.json and icons.json hold exactly the shipped names at every master; metrics.json's ink box is the
//      exact ink rounded to 2 dp; meta.json, read back as written, carries no `section` key anywhere (`privateKeys`;
//      a key, not the word: the layout `-4` icons carry the tag "section", and it ships)
//   e  the tarball and the zip hold exactly the expected entries; the zip passes `unzip -t`; the README and LICENSE
//      name no tarball the download lacks (`unbuiltTarballs`: a run without tools/gen-react.mjs is refused while the
//      README names mavan-icons-react-<v>.tgz), dev runs included
//   with --gate, the raster gate: 0 wrong pixels against the exact reference in every file
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, copyFileSync, utimesSync, openSync, closeSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { isMainThread, parentPort, workerData, Worker } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import { outline, parseSource, sourceBox, outlinedBox, check, load } from './outline.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = (...p) => join(ROOT, ...p);

export const MASTERS = [24, 20, 16];
export const STYLES = ['', '-filled'];
const PKG = 'packages/icons';
const TEMPLATE = `${PKG}/package.template.json`;
const LOCK = 'packages/names.lock';
const TEMPLATES = 'packages/templates';
const OUT = 'dist/release';
/** The placeholders card 2.3's templates may carry; anything else left in {{…}} is a refusal. */
export const KNOWN = ['version', 'icons', 'names'];
/** The files at the package root beside svg/; the download folder holds the same but package.json. */
export const PACKAGE_DOCS = ['CHANGELOG.md', 'LICENSE.md', 'README.md', 'icons.json', 'meta.json', 'metrics.json'];

// ── versions ────────────────────────────────────────────────────────────────────────────────────────────────────

/** x.y.z or x.y.z-pre, as semver writes it. */
export function parseVersion(v) {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(String(v));
  if (!m) throw new Error(`version "${v}" is not semver x.y.z`);
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ? m[4].split('.') : [] };
}
/** Semver precedence: a prerelease sorts before its release (1.0.0-rc.1 < 1.0.0). */
export function compareVersions(a, b) {
  const x = parseVersion(a), y = parseVersion(b);
  for (const k of ['major', 'minor', 'patch']) if (x[k] !== y[k]) return x[k] < y[k] ? -1 : 1;
  if (!x.pre.length || !y.pre.length) return x.pre.length === y.pre.length ? 0 : x.pre.length ? -1 : 1;
  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i++) {
    const p = x.pre[i], q = y.pre[i];
    if (p === undefined || q === undefined) return p === undefined ? -1 : 1;
    if (p === q) continue;
    const pn = /^\d+$/.test(p), qn = /^\d+$/.test(q);
    if (pn && qn) return +p < +q ? -1 : 1;
    if (pn !== qn) return pn ? -1 : 1;
    return p < q ? -1 : 1;
  }
  return 0;
}
/** From 1.0.0 the names are frozen (C9): the lock is required and must match the sheet. */
export const frozen = (v) => compareVersions(v, '1.0.0') >= 0;

// ── templates ───────────────────────────────────────────────────────────────────────────────────────────────────

/** Every {{…}} in the text, in order. */
export const placeholders = (text) => [...text.matchAll(/\{\{([^{}]*)\}\}/g)].map((m) => m[1]);
/** Substitute exactly {{key}} for each key given; anything else is left for `placeholders` to find. */
export const fillTemplate = (text, vars) => text.replace(/\{\{([^{}]*)\}\}/g, (all, k) => (Object.hasOwn(vars, k) ? String(vars[k]) : all));
/** Maruti's open placeholders in a draft licence: each `[Maruti` is one. */
export const marutiMarks = (text) => (text.match(/\[Maruti/g) || []).length;
/** How a count reads in the README: 1,310. */
export const count = (n) => n.toLocaleString('en-US');
/** A tarball's file name as a text writes it (`./mavan-icons-0.0.1.tgz` names mavan-icons-0.0.1.tgz); a bare `.tgz`
 *  names none. */
const TGZ = /[A-Za-z0-9][\w.+-]*\.tgz\b/g;
/** The tarballs a filled README or LICENSE names that are not among `built`, each with the lines naming it: the box
 *  must never contradict its README (a release without card 2.2's tool would still find mavan-icons-react-<v>.tgz
 *  in the download layout and the install line). [{ tarball, lines }], in the order the text first names them. */
export function unbuiltTarballs(text, built) {
  const have = new Set(built), out = new Map();
  text.split('\n').forEach((l, i) => {
    for (const t of l.match(TGZ) ?? []) if (!have.has(t)) { if (!out.has(t)) out.set(t, []); if (out.get(t).at(-1) !== i + 1) out.get(t).push(i + 1); }
  });
  return [...out].map(([tarball, lines]) => ({ tarball, lines }));
}

// ── the lock ────────────────────────────────────────────────────────────────────────────────────────────────────
// packages/names.lock is the ledger of every name the box has shipped from 1.0.0 on: one section per release that
// added names, oldest first, each `## <version> — <date>` followed by its names, one a line. `--lock` writes it;
// nobody edits it by hand. A name never leaves it (C9: once shipped, `check-2` is `check-2` for ever).

const LOCK_HEAD = [
  '# packages/names.lock: every icon name the box has shipped since 1.0.0, never edited by hand.',
  '# `npm run release -- --lock` adds the sheet\'s new approved names under the current version; once a name is',
  '# here it ships in every later release (C9: a name never changes). Sections run oldest first.',
];
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** { sections: [{ version, date, names }], names: Map(name → version), problems } */
export function parseLock(text) {
  const sections = [], names = new Map(), problems = [];
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (!line || (line.startsWith('#') && !line.startsWith('## '))) return;
    const h = line.match(/^## (\S+) — (\d{4}-\d{2}-\d{2})$/);
    if (h) {
      try { parseVersion(h[1]); } catch { problems.push(`line ${i + 1}: "${h[1]}" is not a version`); }
      sections.push({ version: h[1], date: h[2], names: [] }); return;
    }
    if (!NAME.test(line)) { problems.push(`line ${i + 1}: "${line}" is not a name or a "## <version> — <date>" heading`); return; }
    if (!sections.length) { problems.push(`line ${i + 1}: ${line} sits before any "## <version> — <date>" heading`); return; }
    if (names.has(line)) { problems.push(`line ${i + 1}: ${line} is locked twice (first under ${names.get(line)})`); return; }
    names.set(line, sections.at(-1).version); sections.at(-1).names.push(line);
  });
  for (let k = 1; k < sections.length; k++) {
    try { if (compareVersions(sections[k - 1].version, sections[k].version) >= 0) problems.push(`section ${sections[k].version} follows ${sections[k - 1].version}: versions must rise`); } catch { /* reported above */ }
  }
  return { sections, names, problems };
}
export const formatLock = (sections) => `${[...LOCK_HEAD, ...sections.flatMap((s) => ['', `## ${s.version} — ${s.date}`, ...s.names])].join('\n')}\n`;

/** What the lock and the sheet disagree on: locked names gone from the sheet, approved names not yet locked. */
export function lockProblems(lock, approved) {
  const on = new Set(approved);
  return { gone: [...lock.names.keys()].filter((n) => !on.has(n)), unlocked: approved.filter((n) => !lock.names.has(n)) };
}
/** The lock extended by the approved names it lacks, under `version` (dated `date` when the section is new). Throws
 *  on a locked name gone from the sheet and on a version lower than the lock's newest section. */
export function extendLock(lock, approved, version, date) {
  const { gone, unlocked } = lockProblems(lock, approved);
  if (gone.length) throw new Error(`${gone.length} locked name(s) are gone from the sheet (C9: a shipped name never changes): ${gone.join(', ')}`);
  const sections = lock.sections.map((s) => ({ ...s, names: [...s.names] }));
  if (!unlocked.length) return { sections, added: [] };
  const last = sections.at(-1);
  if (last && compareVersions(version, last.version) < 0) throw new Error(`version ${version} is below the lock's newest section, ${last.version}`);
  if (last && last.version === version) last.names.push(...unlocked);
  else sections.push({ version, date, names: unlocked });
  return { sections, added: unlocked };
}

// ── the changelog ───────────────────────────────────────────────────────────────────────────────────────────────

/** The names grouped by their own category (alphabetical, "Uncategorised" last), one line per family in sheet order. */
function byCategory(names, meta) {
  const info = new Map(meta.icons.map((i, k) => [i.name, { ...i, k }]));
  const cats = new Map();
  for (const n of names) {
    const i = info.get(n), c = i?.category ?? 'Uncategorised';
    if (!cats.has(c)) cats.set(c, []);
    cats.get(c).push(i ?? { name: n, family: n, variantOf: null, k: Infinity });
  }
  const order = [...cats.keys()].sort((a, b) => (a === 'Uncategorised') - (b === 'Uncategorised') || (a < b ? -1 : a > b ? 1 : 0));
  const out = [];
  for (const c of order) {
    const list = cats.get(c).sort((a, b) => a.k - b.k), fams = new Map();
    for (const i of list) { const f = i.family ?? i.name; if (!fams.has(f)) fams.set(f, []); fams.get(f).push(i.name); }
    const icons = list.filter((i) => !i.variantOf).length;
    out.push('', `### ${c} — ${plural(icons, 'icon')}, ${plural(list.length, 'name')}`, '');
    for (const f of fams.values()) out.push(`- ${f.map((n) => `\`${n}\``).join(' · ')}`);
  }
  return out;
}
const plural = (n, word) => `${count(n)} ${word}${n === 1 ? '' : 's'}`;
const newest = (dates) => dates.filter(Boolean).sort().at(-1) ?? null;

/** CHANGELOG.md: newest release first. Below 1.0.0, with no lock, the one section is the first build, every name
 *  new. From 1.0.0 the lock's sections are the releases: each lists the names it added — the names not yet in the
 *  lock before it — and the newest also the names already shipped whose approval date is later than the release
 *  before it (redrawn). A release that added no names gets a section of its own at the top, dated by the newest
 *  approval. Deterministic for the same sheet and lock: no clock is read. */
export function changelog(meta, lock, version) {
  const files = (n) => count(n * MASTERS.length * STYLES.length);
  const dates = meta.icons.map((i) => i.approved).filter(Boolean).sort();
  const sections = (lock?.sections ?? []).filter((s) => compareVersions(s.version, version) <= 0);
  const out = ['# Changelog', '', `\`@mavan/icons\`, newest release first. Every name ships as an outline and a filled SVG at 24, 20 and 16.`];
  const counts = (names) => { const base = names.filter((n) => !meta.icons.find((i) => i.name === n)?.variantOf).length; return `${plural(base, 'icon')} and ${plural(names.length, 'name')} (${files(names.length)} SVG files)`; };
  if (!sections.length) {
    const all = meta.icons.map((i) => i.name), undated = meta.icons.length - dates.length;
    out.push('', `## ${version} — ${dates.at(-1) ?? 'undated'}`, '',
      'The first build. There is no earlier release to compare it with, so every name below is new.', '',
      `- ${counts(all)}; a name is an icon or one of its variants (\`check-2\`, \`check-small\`).`,
      `- Approved between ${dates[0] ?? '—'} and ${dates.at(-1) ?? '—'}; the section is dated by the newest approval.${undated ? ` ${plural(undated, 'name')} carry no approval date.` : ''}`,
      ...byCategory(all, meta));
    return `${out.join('\n')}\n`;
  }
  const releases = sections.slice().reverse();
  if (releases[0].version !== version) releases.unshift({ version, date: null, names: [] });
  releases.forEach((r, k) => {
    const prev = releases[k + 1];
    const date = r.date ?? newest([...dates, prev?.date]);
    out.push('', `## ${r.version} — ${date}`, '');
    if (!prev) out.push('The first release with frozen names: from here on a name, once shipped, never changes.', '');
    out.push(r.names.length ? `- New: ${counts(r.names)}.` : '- No new names.');
    if (k === 0 && prev) {
      const earlier = new Set(sections.filter((s) => compareVersions(s.version, r.version) < 0).flatMap((s) => s.names));
      const redrawn = meta.icons.filter((i) => earlier.has(i.name) && i.approved && i.approved > prev.date).map((i) => i.name);
      out.push(redrawn.length ? `- Redrawn since ${prev.version} (approved after ${prev.date}): ${redrawn.map((n) => `\`${n}\``).join(' · ')}.` : `- Nothing redrawn since ${prev.version}.`);
    }
    out.push(...byCategory(r.names, meta));
  });
  return `${out.join('\n')}\n`;
}

// ── meta.json ───────────────────────────────────────────────────────────────────────────────────────────────────

/** The keys of tools/package-meta.mjs's meta.json that stay in the repo (dist/meta.json keeps them). `section` is
 *  the sheet's drawing order ("D · The rest, by audit rank", "E · Added on request"): how the set was drawn, not
 *  what an icon is; `category` already ships as the customer's grouping (Maruti, 2026-10-27: "Leave section out"). */
export const PRIVATE_META = ['section'];
/** The box's meta.json: package-meta.mjs's object with the private keys taken off every icon entry, every other key
 *  and its order as it was, so `JSON.stringify(…, null, 2)` writes package-meta.mjs's bytes less those lines. The
 *  object given is not changed. */
export const shipMeta = (meta) => ({
  ...meta,
  icons: meta.icons.map((i) => Object.fromEntries(Object.entries(i).filter(([k]) => !PRIVATE_META.includes(k)))),
});
/** Gate d's meta.json side: where a private key sits anywhere in a JSON value (`icons[12].section`), [] when none.
 *  Keys only: a tag that reads "section" is a value and ships. */
export function privateKeys(value, path = '') {
  if (Array.isArray(value)) return value.flatMap((v, k) => privateKeys(v, `${path}[${k}]`));
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([k, v]) => {
    const here = path ? `${path}.${k}` : k;
    return [...(PRIVATE_META.includes(k) ? [here] : []), ...privateKeys(v, here)];
  });
}

// ── the shipped file ────────────────────────────────────────────────────────────────────────────────────────────

/** The exact root every shipped file opens with. */
export const shippedRoot = (m) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="currentColor">`;

/** Every element and attribute of an SVG text, read by SVG's own paint rule: a path is stroked when it, or an
 *  element around it, names a `stroke` other than none (the initial value is none), and filled unless `fill` is
 *  none (the initial value is black). { elements, strokeAttrs, paths, stroked, filled, styled } */
export function paint(text) {
  const stack = [], elements = new Set();
  let strokeAttrs = 0, paths = 0, stroked = 0, filled = 0, styled = 0;
  for (const m of text.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(\/?)([A-Za-z][\w:.-]*)([^>]*)>/g)) {
    const [, close, el, inner] = m;
    if (close) { stack.pop(); continue; }
    const self = /\/\s*$/.test(inner), rawAttrs = inner.replace(/\/\s*$/, '');
    elements.add(el);
    const attrs = Object.fromEntries([...rawAttrs.matchAll(/([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map((a) => [a[1], a[2] ?? a[3] ?? a[4]]));
    for (const k of Object.keys(attrs)) { if (/^stroke/i.test(k)) strokeAttrs++; if (k === 'style' || k === 'class') styled++; }
    const up = stack.at(-1) ?? { stroke: 'none', fill: 'black' };
    const here = { stroke: attrs.stroke ?? up.stroke, fill: attrs.fill ?? up.fill };
    if (el === 'path') { paths++; if (here.stroke !== 'none') stroked++; if (here.fill !== 'none') filled++; }
    if (!self) stack.push(here);
  }
  return { elements: [...elements].sort(), strokeAttrs, paths, stroked, filled, styled };
}

/** Gate a on one shipped file: [] when it is one evenodd outlined fill and nothing else, else what is wrong. */
export function shippedProblems(text, m) {
  const p = [], root = shippedRoot(m), tail = '</svg>\n';
  if (!text.startsWith(root)) p.push(`the root is not exactly ${root}`);
  if (!text.endsWith(tail)) p.push('it does not end with </svg> and a newline');
  if (/stroke/i.test(text)) p.push('the word "stroke" appears in it');
  if (/<!--/.test(text)) p.push('it carries a comment');
  const body = text.startsWith(root) && text.endsWith(tail) ? text.slice(root.length, -tail.length) : '';
  const ds = [...body.matchAll(/<path fill-rule="evenodd" d="([^"]*)"\/>/g)].map((x) => x[1]);
  if (body.replace(/<path fill-rule="evenodd" d="[^"]*"\/>/g, '') !== '') p.push('its body holds something other than <path fill-rule="evenodd" d="…"/>');
  if (ds.length !== 1) p.push(`${ds.length} paths where the box ships one`);
  for (const d of ds) {
    if (!/^M[MLHVACQZ\d .-]*$/.test(d)) p.push('path data with a command or character other than absolute M L H V A C Q Z');
    if (/\d\.\d{4}/.test(d)) p.push('a number over 3 dp');
  }
  const r = paint(text);
  if (r.stroked) p.push(`${r.stroked} stroked path(s) by SVG's paint rule`);
  if (r.strokeAttrs) p.push(`${r.strokeAttrs} stroke attribute(s)`);
  if (r.styled) p.push('a style or class attribute');
  if (r.paths !== r.filled) p.push(`${r.paths - r.filled} path(s) with no fill`);
  if (r.elements.join() !== 'path,svg') p.push(`elements other than <svg> and <path>: ${r.elements.join(', ')}`);
  return p;
}

/** The file names the box ships for these names, per master: <name>.svg then <name>-filled.svg, names sorted. */
export const shippedFiles = (names) => names.slice().sort(byCode).flatMap((n) => STYLES.map((s) => `${n}${s}`));
const byCode = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** metrics.json for the customer: per master and shipped name, the ink box, the geometric bearings (where the ink
 *  stops) and the optical ones (where it reads as stopping), in that master's units. Throws on a name it lacks. */
export function trimMetrics(dist, files, version) {
  const side = ['left', 'top', 'right', 'bottom'];
  const icons = {};
  for (const m of MASTERS) {
    icons[m] = {};
    for (const f of files) {
      const e = dist[m]?.[f];
      if (!e) throw new Error(`dist/metrics.json has no ${m}/${f}`);
      icons[m][f] = {
        ink: { x: e.ink.x, y: e.ink.y, w: e.ink.w, h: e.ink.h },
        bearing: Object.fromEntries(side.map((k) => [k, e.bearing[k]])),
        optical: Object.fromEntries(side.map((k) => [k, e.optical[k].optical])),
      };
    }
  }
  return {
    name: '@mavan/icons', version,
    units: 'Each master\'s numbers are in its own units (its viewBox is 24, 20 or 16 wide); at a rendered size S, multiply by S ÷ that master.',
    icons,
  };
}

// ── the outliner on every core ──────────────────────────────────────────────────────────────────────────────────

/** One source file through the outliner and gate b (and, with `raster`, the raster gate). */
async function convert({ m, file }, raster) {
  const rel = `${m}/${file}`;
  try {
    const text = readFileSync(at('src/icons', String(m), `${file}.svg`), 'utf8');
    const out = await outline(text, { master: m });
    const r = { rel, out, source: sourceBox(parseSource(text)), result: outlinedBox(out) };
    if (raster) { const g = await check(text, out, { master: m }); r.wrong = g.wrong; r.max = g.max; }
    return r;
  } catch (e) { return { rel, error: e.message }; }
}

/** Every job through `convert` on every core, a chunk at a time, so slow files spread themselves out. */
async function convertAll(jobs, raster, onProgress) {
  const n = Math.max(1, Math.min(availableParallelism(), Math.ceil(jobs.length / 8)));
  const queue = jobs.slice(), results = [];
  const CHUNK = raster ? 4 : 24;
  await Promise.all(Array.from({ length: n }, () => new Promise((resolve, reject) => {
    // `releaseJobs`, never `files`: outline.mjs's own --check worker answers to workerData.files
    const w = new Worker(new URL(import.meta.url), { workerData: { releaseJobs: true, raster } });
    const feed = () => w.postMessage(queue.splice(0, CHUNK));
    w.on('message', (rs) => { results.push(...rs); onProgress?.(results.length); feed(); });
    w.on('error', reject);
    w.on('exit', (c) => (c ? reject(new Error(`an outliner worker exited ${c}`)) : resolve()));
    feed();
  })));
  return { results, workers: n };
}

if (!isMainThread && workerData?.releaseJobs) {
  await load();
  parentPort.on('message', async (chunk) => {
    if (!chunk.length) process.exit(0);
    const out = [];
    for (const j of chunk) out.push(await convert(j, workerData.raster));
    parentPort.postMessage(out);
  });
}

// ── the CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────

const ANSI = /\x1b\[[0-9;]*m/g;
const sh = (cmd, argv, opts = {}) => spawnSync(cmd, argv, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28, ...opts });
const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;
const secs = (ms) => `${(ms / 1000).toFixed(1)} s`;
const today = () => new Date().toLocaleDateString('en-CA');
function sizeOf(path) {
  const s = statSync(path);
  return s.isDirectory() ? readdirSync(path).reduce((a, f) => a + sizeOf(join(path, f)), 0) : s.size;
}
/** Every entry under dir, relative, directories with a trailing slash, sorted by code unit. */
function walk(dir, base = '') {
  const out = [];
  for (const f of readdirSync(join(dir, base)).sort(byCode)) {
    const rel = base ? `${base}/${f}` : f;
    if (statSync(join(dir, rel)).isDirectory()) out.push(`${rel}/`, ...walk(dir, rel)); else out.push(rel);
  }
  return out;
}
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
function listDiff(want, got) {
  const g = new Set(got), w = new Set(want);
  return [...want.filter((x) => !g.has(x)).map((x) => `missing ${x}`), ...got.filter((x) => !w.has(x)).map((x) => `extra ${x}`)];
}

async function main(argv) {
  const flags = new Set(), opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--templates') { opt.templates = argv[++i]; if (!opt.templates) usage('--templates needs a directory'); flags.add(a); }
    else if (['--gate', '--lock', '--allow-dirty', '--skip-check'].includes(a)) flags.add(a);
    else if (a === '--help' || a === '-h') usage();
    else usage(`unknown argument ${a}`);
  }
  const DEV = ['--allow-dirty', '--skip-check', '--templates'].filter((f) => flags.has(f));
  const t0 = performance.now(), timing = [];
  const stage = async (name, fn) => { const t = performance.now(); const r = await fn(); timing.push([name, performance.now() - t]); return r; };

  const version = JSON.parse(readFileSync(at('package.json'), 'utf8')).version;
  try { parseVersion(version); } catch (e) { refuse(e.message); }
  const { parseSheet } = await import('./queue.mjs');
  const rows = parseSheet(readFileSync(at('research/queue.md'), 'utf8')).rows.filter((r) => r.status === 'done');
  const approved = rows.map((r) => r.name);
  const dupes = [...new Set(approved.filter((n, k) => approved.indexOf(n) !== k))];
  if (dupes.length) refuse(`names on the sheet more than once: ${dupes.join(', ')}`);
  const lockText = existsSync(at(LOCK)) ? readFileSync(at(LOCK), 'utf8') : null;
  const lock = lockText === null ? null : parseLock(lockText);
  if (lock?.problems.length) refuse(`${LOCK} cannot be read:`, lock.problems);

  // --lock: write the ledger and stop
  if (flags.has('--lock')) {
    if (!frozen(version)) refuse(`--lock freezes names from 1.0.0 on; the version is ${version}. Raise it in package.json first (card 3.3).`);
    let next;
    try { next = extendLock(lock ?? { sections: [], names: new Map() }, approved, version, today()); } catch (e) { refuse(e.message); }
    if (!next.added.length) { console.log(`${LOCK}: every approved name is already locked (${count(approved.length)}); nothing written`); return; }
    mkdirSync(dirname(at(LOCK)), { recursive: true });
    writeFileSync(at(LOCK), formatLock(next.sections));
    console.log(`${LOCK}: ${count(next.added.length)} name(s) locked under ${version} (${count(approved.length)} in all). Commit it, then run the release.`);
    return;
  }

  // the cheap refusals, before anything is cleared or built
  const git = sh('git', ['status', '--porcelain', '--untracked-files=all']);
  if (git.status !== 0) refuse(`git status failed: ${git.stderr.trim()}`);
  const dirty = git.stdout.split('\n').filter(Boolean);
  if (dirty.length && !flags.has('--allow-dirty')) refuse(`the tree is dirty (${dirty.length} path(s)); commit first, so the box is built from a commit:`, dirty.slice(0, 20));
  const head = sh('git', ['rev-parse', '--short', 'HEAD']).stdout.trim() || 'no commit';

  const tplDir = opt.templates ? resolve(process.cwd(), opt.templates) : at(TEMPLATES);
  const docs = {};
  for (const f of ['README.md', 'LICENSE.md']) {
    const p = join(tplDir, f);
    if (!existsSync(p)) refuse(`no ${f} in ${relative(ROOT, tplDir) || tplDir} (card 2.3's templates)`);
    docs[f] = readFileSync(p, 'utf8');
    const unknown = placeholders(docs[f]).filter((k) => !KNOWN.includes(k));
    if (unknown.length) refuse(`${f} carries placeholder(s) the release does not fill: ${unknown.map((k) => `{{${k}}}`).join(', ')} (it fills ${KNOWN.map((k) => `{{${k}}}`).join(', ')})`);
  }
  const marks = Object.fromEntries(Object.entries(docs).map(([f, t]) => [f, marutiMarks(t)]));
  const markCount = marks['README.md'] + marks['LICENSE.md'];
  if (markCount && frozen(version)) refuse(`${markCount} [Maruti] placeholder(s) are still open (LICENSE.md ${marks['LICENSE.md']}, README.md ${marks['README.md']}); at ${version} the licence must be settled`);

  if (frozen(version)) {
    if (!lock) refuse(`at ${version} the names are frozen and ${LOCK} does not exist: run \`npm run release -- --lock\`, commit it, then release`);
    const { gone, unlocked } = lockProblems(lock, approved);
    if (gone.length) refuse(`${gone.length} locked name(s) are gone from the sheet (C9: a shipped name never changes, it is deprecated):`, gone);
    if (unlocked.length) refuse(`${unlocked.length} approved name(s) are not in ${LOCK} yet: run \`npm run release -- --lock\` and commit it:`, unlocked.slice(0, 40));
  }

  const base = `mavan-drawer-${version}${DEV.length ? '-dev' : ''}`;
  const folder = at(OUT, base), zip = at(OUT, `${base}.zip`), log = at(OUT, `${base}.check.log`);
  // clear this version's previous output first, so a failure below leaves nothing that looks like a release
  mkdirSync(at(PKG), { recursive: true });
  for (const f of readdirSync(at(PKG))) if (f !== 'package.template.json') rmSync(at(PKG, f), { recursive: true, force: true });
  rmSync(folder, { recursive: true, force: true }); rmSync(zip, { force: true }); rmSync(log, { force: true });
  mkdirSync(at(OUT), { recursive: true });
  const failWith = (msg, lines) => { rmSync(folder, { recursive: true, force: true }); rmSync(zip, { force: true }); refuse(msg, lines); };

  console.log(`@mavan/icons ${version}${DEV.length ? `  — DEV BUILD (${DEV.join(', ')}): ${base}, not for customers` : ''}`);
  console.log(`  from ${head}${dirty.length ? ` with ${dirty.length} uncommitted path(s)` : ''}; ${count(approved.length)} approved rows`);

  // 1. the check (or, skipped, the build that writes dist/metrics.json)
  let checkLine;
  await stage(flags.has('--skip-check') ? 'build' : 'check', async () => {
    if (flags.has('--skip-check')) {
      const b = sh('node', ['tools/build.mjs']);
      if (b.status !== 0) failWith(`tools/build.mjs failed (exit ${b.status}):`, (b.stderr || b.stdout).trim().split('\n').slice(-10));
      checkLine = 'skipped (--skip-check); dist/ rebuilt by tools/build.mjs';
      return;
    }
    // Straight into the log file, not a pipe: lint ends a failing run with process.exit(1), and Node drops what it
    // has not yet written to a pipe — the summary line among it — whereas a file is written as it goes.
    const fd = openSync(log, 'w');
    const c = sh('npm', ['run', 'check'], { stdio: ['ignore', fd, fd] });
    closeSync(fd);
    const text = readFileSync(log, 'utf8').replace(ANSI, '');
    writeFileSync(log, text);
    checkLine = text.split('\n').filter((l) => /drawings ·/.test(l)).at(-1)?.trim() ?? '(no summary line)';
    if (c.status !== 0) failWith(`npm run check failed (exit ${c.status}): ${checkLine} — see ${relative(ROOT, log)}`);
    if (!flags.has('--allow-dirty')) {
      const after = sh('git', ['status', '--porcelain', '--untracked-files=all']).stdout.split('\n').filter(Boolean);
      if (after.length) failWith('the check left the tree dirty (a committed build output was stale): commit it first:', after.slice(0, 20));
    }
  });
  console.log(`  check      ${checkLine}`);

  // 2. meta.json: tools/package-meta.mjs's, written again without the keys that stay in the repo (`section`), in
  //    package-meta.mjs's own format; gate d reads the file back
  const meta = await stage('meta', async () => {
    const r = sh('node', ['tools/package-meta.mjs', '--out', `${PKG}/meta.json`]);
    if (r.status !== 0) failWith('tools/package-meta.mjs refused:', `${r.stdout}${r.stderr}`.trim().split('\n'));
    const out = shipMeta(JSON.parse(readFileSync(at(PKG, 'meta.json'), 'utf8')));
    writeFileSync(at(PKG, 'meta.json'), `${JSON.stringify(out, null, 2)}\n`);
    const names = out.icons.map((i) => i.name);
    if (!sameList(names, approved)) failWith('meta.json does not list the approved rows in sheet order:', listDiff(approved, names).slice(0, 20));
    const untagged = (r.stdout.match(/carries no tags \((\d+)\)/) || [])[1];
    console.log(`  meta       ${count(out.counts.icons)} names, ${count(out.counts.concepts)} icons (base concepts), ${count(out.counts.variants)} variants${untagged && untagged !== '0' ? `; ${untagged} icons untagged` : ''}`);
    return out;
  });

  // 3. every approved file through the outliner, on every core; gates a and b on the bytes written
  const files = shippedFiles(approved);
  const jobs = MASTERS.flatMap((m) => files.map((file) => ({ m, file })));
  const missingSrc = jobs.filter((j) => !existsSync(at('src/icons', String(j.m), `${j.file}.svg`))).map((j) => `${j.m}/${j.file}.svg`);
  if (missingSrc.length) failWith(`${missingSrc.length} approved drawing(s) missing from src/icons/:`, missingSrc.slice(0, 20));
  const shipping = new Set(files);
  const stray = MASTERS.flatMap((m) => readdirSync(at('src/icons', String(m))).filter((f) => f.endsWith('.svg') && !shipping.has(f.slice(0, -4))).map((f) => `${m}/${f}`));
  const raster = flags.has('--gate');
  const gates = { a: [], b: [], raster: [], errors: [] };
  let worstBox = 0, worstPixel = 0, workers = 0;
  const icons = Object.fromEntries(MASTERS.map((m) => [m, {}]));
  const exact = Object.fromEntries(MASTERS.map((m) => [m, {}]));
  await stage(raster ? 'outline + raster gate' : 'outline', async () => {
    let shown = 0;
    const { results, workers: n } = await convertAll(jobs, raster, (k) => {
      if (process.stdout.isTTY && k - shown >= 200) { shown = k; process.stdout.write(`\r  outline    ${k} of ${jobs.length}`); }
    });
    workers = n;
    if (process.stdout.isTTY && shown) process.stdout.write('\r\x1b[K');
    for (const m of MASTERS) mkdirSync(at(PKG, 'svg', String(m)), { recursive: true });
    for (const r of results.sort((x, y) => byCode(x.rel, y.rel))) {
      if (r.error) { gates.errors.push(`${r.rel}: ${r.error}`); continue; }
      const [m, file] = r.rel.split('/');
      writeFileSync(at(PKG, 'svg', m, `${file}.svg`), r.out);
      const text = readFileSync(at(PKG, 'svg', m, `${file}.svg`), 'utf8');
      const p = shippedProblems(text, Number(m));
      if (p.length) gates.a.push(`${r.rel}: ${p.join('; ')}`);
      const off = Math.max(...['x', 'y', 'w', 'h'].map((k) => Math.abs(r.source[k] - r.result[k])));
      worstBox = Math.max(worstBox, off);
      if (!(off < 0.005 + 1e-9)) gates.b.push(`${r.rel}: exact ink ${fmtBox(r.source)}, shipped ${fmtBox(r.result)} (off ${off.toFixed(4)})`);
      if (raster) { worstPixel = Math.max(worstPixel, r.max); if (r.wrong) gates.raster.push(`${r.rel}: ${r.wrong} wrong pixel(s), largest difference ${r.max}/255`); }
      icons[m][file] = text.match(/ d="([^"]*)"/)?.[1] ?? '';
      exact[m][file] = r.source;
    }
  });
  const perMaster = MASTERS.map((m) => readdirSync(at(PKG, 'svg', String(m))).length);
  console.log(`  outline    ${count(perMaster.reduce((a, b) => a + b, 0))} files (${MASTERS.map((m, k) => `${m}: ${count(perMaster[k])}`).join(' · ')}) on ${workers} workers${stray.length ? `; ${stray.length} drawing(s) in src/icons/ are not approved rows and stay out` : ''}`);
  if (gates.errors.length) failWith(`the outliner failed on ${gates.errors.length} file(s):`, gates.errors.slice(0, 20));
  if (gates.a.length) failWith(`gate a (no strokes) failed in ${gates.a.length} file(s):`, gates.a.slice(0, 20));
  if (gates.b.length) failWith(`gate b (ink box equals the source's exact ink to 2 dp) failed in ${gates.b.length} file(s):`, gates.b.slice(0, 20));
  if (gates.raster.length) failWith(`the raster gate failed in ${gates.raster.length} file(s):`, gates.raster.slice(0, 20));

  // 4. icons.json from the outlined files, metrics.json from dist/metrics.json
  let worstMetric = 0;
  await stage('json', async () => {
    writeFileSync(at(PKG, 'icons.json'), `${JSON.stringify({
      name: '@mavan/icons', version, fillRule: 'evenodd',
      viewBox: Object.fromEntries(MASTERS.map((m) => [m, `0 0 ${m} ${m}`])),
      icons: Object.fromEntries(MASTERS.map((m) => [m, Object.fromEntries(files.map((f) => [f, icons[m][f]]))])),
    })}\n`);
    let metrics;
    try { metrics = trimMetrics(JSON.parse(readFileSync(at('dist/metrics.json'), 'utf8')), files, version); } catch (e) { failWith(`metrics.json: ${e.message}`); }
    writeFileSync(at(PKG, 'metrics.json'), `${JSON.stringify(metrics)}\n`);
    // gate d, on the files as written
    const back = { icons: JSON.parse(readFileSync(at(PKG, 'icons.json'), 'utf8')), metrics: JSON.parse(readFileSync(at(PKG, 'metrics.json'), 'utf8')) };
    const d = [];
    for (const m of MASTERS) for (const [k, j] of Object.entries(back)) {
      const keys = Object.keys(j.icons[m] ?? {});
      if (!sameList(keys, files)) d.push(`${k}.json at ${m}: ${listDiff(files, keys).slice(0, 5).join(', ')}`);
    }
    for (const m of MASTERS) for (const f of files) {
      const i = back.icons.icons[m][f], e = back.metrics.icons[m][f];
      if (!i) d.push(`icons.json ${m}/${f}: no path data`);
      const nums = [...Object.values(e.ink), ...Object.values(e.bearing), ...Object.values(e.optical)];
      if (nums.length !== 12 || !nums.every(Number.isFinite)) d.push(`metrics.json ${m}/${f}: not twelve numbers`);
      const off = Math.max(...['x', 'y', 'w', 'h'].map((k) => Math.abs(e.ink[k] - exact[m][f][k])));
      worstMetric = Math.max(worstMetric, off);
      if (!(off <= 0.005 + 1e-6)) d.push(`metrics.json ${m}/${f}: ink ${fmtBox(e.ink)} is not the exact ink ${fmtBox(exact[m][f])} rounded to 2 dp`);
    }
    const leaked = privateKeys(JSON.parse(readFileSync(at(PKG, 'meta.json'), 'utf8')));
    if (leaked.length) d.push(`meta.json carries ${leaked.length} key(s) that stay in the repo (${PRIVATE_META.join(', ')}): ${leaked.slice(0, 5).join(', ')}${leaked.length > 5 ? ', …' : ''}`);
    if (d.length) failWith(`gate d (the JSON files hold the shipped names, and meta.json none of the repo's own keys) failed:`, d.slice(0, 20));
  });

  // 5. README and LICENSE from the templates, CHANGELOG from meta.json and the lock
  const vars = { version, icons: count(meta.counts.concepts), names: count(meta.counts.icons) };
  let changelogDate;
  await stage('docs', async () => {
    for (const [f, t] of Object.entries(docs)) {
      const filled = fillTemplate(t, vars), left = placeholders(filled);
      if (left.length) failWith(`${f}: ${left.map((k) => `{{${k}}}`).join(', ')} left unfilled`);
      writeFileSync(at(PKG, f), filled);
    }
    const text = changelog(meta, lock && frozen(version) ? lock : null, version);
    changelogDate = text.match(/^## \S+ — (\d{4}-\d{2}-\d{2})/m)?.[1];
    writeFileSync(at(PKG, 'CHANGELOG.md'), text);
  });
  if (markCount) console.log(`  warning    ${markCount} [Maruti] placeholder(s) still open (LICENSE.md ${marks['LICENSE.md']}, README.md ${marks['README.md']}); fine below 1.0.0, refused from it`);
  if (lock && !frozen(version)) {
    const { gone, unlocked } = lockProblems(lock, approved);
    console.log(`  warning    ${LOCK} exists below 1.0.0 and is not enforced${gone.length || unlocked.length ? ` (${gone.length} locked name(s) gone, ${unlocked.length} unlocked)` : ''}`);
  }

  // 6. package.json: the template plus the one version
  const tpl = JSON.parse(readFileSync(at(TEMPLATE), 'utf8'));
  if ('version' in tpl) failWith(`${TEMPLATE} carries a version; the root package.json is the one source, so delete it there`);
  const { name: pkgName, ...rest } = tpl;
  writeFileSync(at(PKG, 'package.json'), `${JSON.stringify({ name: pkgName, version, ...rest }, null, 2)}\n`);

  // gate c: the package folder holds exactly what ships
  const svgList = MASTERS.flatMap((m) => files.map((f) => `svg/${m}/${f}.svg`));
  const want = [...PACKAGE_DOCS, 'package.json', ...svgList].sort(byCode);
  const got = walk(at(PKG)).filter((p) => !p.endsWith('/') && p !== 'package.template.json').sort(byCode);
  const total = svgList.length, expected = MASTERS.length * STYLES.length * rows.length;
  if (total !== expected || !sameList(got, want)) failWith(`gate c (2 × 3 × ${rows.length} approved rows = ${expected} files) failed: ${total} files`, listDiff(want, got).slice(0, 20));
  for (const t of Object.values(tpl.exports ?? {})) if (!existsSync(at(PKG, String(t).replace(/^\.\//, '').replace(/\*$/, '')))) failWith(`package.json exports ${t}, which is not in the package`);

  // 7. npm pack, and card 2.2's React package when it exists
  mkdirSync(folder, { recursive: true });
  const tarballs = [];
  await stage('pack', async () => {
    tarballs.push(pack(PKG, folder, ['package.json', ...want.filter((p) => p !== 'package.json')], failWith));
    // ── card 2.2's hook (the React package) ───────────────────────────────────────────────────────────────────
    // When tools/gen-react.mjs exists it runs here, from the repo root with no arguments, once packages/icons/ is
    // complete and gated: it reads packages/icons/ (svg/<m>/<name>[-filled].svg, metrics.json, and package.json for
    // the version) and writes packages/icons-react/ with its own package.json. The release then packs that folder
    // into the download beside the icons tarball. Its contents are card 2.2's to gate; this only requires exit 0.
    const GEN_REACT = 'tools/gen-react.mjs', REACT = 'packages/icons-react';
    if (!existsSync(at(GEN_REACT))) { console.log(`  react      skipped: ${GEN_REACT} does not exist yet (card 2.2)`); return; }
    const g = sh('node', [GEN_REACT], { stdio: ['ignore', 'pipe', 'pipe'] });
    if (g.status !== 0) failWith(`${GEN_REACT} failed (exit ${g.status}):`, `${g.stdout}${g.stderr}`.trim().split('\n').slice(-20));
    tarballs.push(pack(REACT, folder, null, failWith));
  });
  // gate e, the README's side: the README and LICENSE as written name only tarballs the download folder holds, so a
  // run that skipped one (no tools/gen-react.mjs) refuses instead of shipping a README that installs a missing file
  const built = readdirSync(folder).filter((f) => f.endsWith('.tgz')).sort(byCode);
  const unbuilt = ['README.md', 'LICENSE.md'].flatMap((f) => unbuiltTarballs(readFileSync(at(PKG, f), 'utf8'), built)
    .map((u) => `${f} names ${u.tarball} (line${u.lines.length > 1 ? 's' : ''} ${u.lines.join(', ')})`));
  if (unbuilt.length) failWith(`the box would contradict its README: ${unbuilt.length === 1 ? 'a tarball it names is' : `${unbuilt.length} tarballs it names are`} not in the download (built: ${built.join(', ') || 'none'}); build it, or take it out of the template:`, unbuilt);

  // 8. the download folder and the zip
  let zipEntries = 0;
  await stage('zip', async () => {
    for (const p of [...PACKAGE_DOCS, ...svgList]) { mkdirSync(dirname(join(folder, p)), { recursive: true }); copyFileSync(at(PKG, p), join(folder, p)); }
    const entries = [`${base}/`, ...walk(folder).map((p) => `${base}/${p}`)].sort(byCode);
    const wantZip = [`${base}/`, ...[...PACKAGE_DOCS, ...svgList, ...tarballs.map((t) => t.file), 'svg/', ...MASTERS.map((m) => `svg/${m}/`)].sort(byCode).map((p) => `${base}/${p}`)].sort(byCode);
    if (!sameList(entries, wantZip)) failWith('the download folder does not hold what it should:', listDiff(wantZip, entries).slice(0, 20));
    // one time stamp for every entry, the CHANGELOG's date at noon UTC, so the same sheet zips to the same bytes
    const stamp = new Date(`${changelogDate ?? '1980-01-01'}T12:00:00Z`);
    for (const e of entries) utimesSync(at(OUT, e), stamp, stamp);
    // System zip (Info-ZIP, on every Mac and here): no zip writer of our own to prove. -X drops uid/gid and extra
    // stamps; the sorted list on stdin fixes the entry order.
    const z = sh('zip', ['-X', '-9', '-q', '-@', relative(at(OUT), zip)], { cwd: at(OUT), input: `${entries.join('\n')}\n`, env: { ...process.env, TZ: 'UTC' } });
    if (z.status !== 0) failWith(`zip failed (exit ${z.status}): ${(z.stderr || z.error?.message || '').trim()}`);
    const t = sh('unzip', ['-tq', zip]);
    if (t.status !== 0) failWith(`unzip -t failed: ${t.stdout.trim()} ${t.stderr.trim()}`);
    const listed = sh('unzip', ['-Z1', zip]).stdout.split('\n').filter(Boolean);
    if (!sameList(listed, entries)) failWith('gate e: the zip does not list the expected entries:', listDiff(entries, listed).slice(0, 20));
    zipEntries = listed.length;
  });

  const total0 = performance.now() - t0;
  console.log(`  gates      a no strokes: ${count(total)} files, 0 stroked paths, 0 stroke attributes · b ink box = exact to 2 dp: worst ${worstBox.toFixed(4)}`
    + ` · c ${count(total)} = 2 × 3 × ${count(rows.length)} · d JSON: every name at every master, metrics ink worst ${worstMetric.toFixed(4)} off exact, meta.json without ${PRIVATE_META.join(', ')}`
    + ` · e tarball ${tarballs.map((t) => `${t.file} ${count(t.entries)} entries`).join(', ')}, README and LICENSE name no other, zip ${count(zipEntries)} entries, unzip -t clean`
    + (raster ? ` · raster 0 wrong pixels, largest difference ${worstPixel}/255` : ' · raster gate not run (--gate)'));
  console.log(`  sizes      folder ${mb(sizeOf(folder))} (svg ${mb(sizeOf(join(folder, 'svg')))}, icons.json ${mb(sizeOf(join(folder, 'icons.json')))}, metrics.json ${mb(sizeOf(join(folder, 'metrics.json')))}, meta.json ${mb(sizeOf(join(folder, 'meta.json')))})`
    + ` · ${tarballs.map((t) => `${t.file} ${mb(t.size)}`).join(' · ')} · zip ${mb(statSync(zip).size)}`);
  console.log(`  time       ${timing.map(([n, ms]) => `${n} ${secs(ms)}`).join(' · ')} · total ${secs(total0)}`);
  console.log(`  → ${relative(ROOT, folder)}/`);
  console.log(`  → ${relative(ROOT, zip)}`);
  if (DEV.length) console.log(`\nDEV BUILD (${DEV.join(', ')}): not a release. Commit, then run \`npm run release\` with no dev flag.`);
}

/** `npm pack` one package folder into `dest`; with `want`, gate e: the tarball lists exactly those files. */
function pack(dir, dest, want, failWith) {
  const r = sh('npm', ['pack', `./${dir}`, '--pack-destination', dest, '--json', '--silent']);
  if (r.status !== 0) failWith(`npm pack ${dir} failed (exit ${r.status}):`, r.stderr.trim().split('\n').slice(-10));
  const [info] = JSON.parse(r.stdout);
  const file = info.filename.replace(/^@/, '').replace(/\//g, '-');
  const path = join(dest, file);
  if (!existsSync(path)) failWith(`npm pack wrote no ${file}`);
  const listed = sh('tar', ['-tzf', path]).stdout.split('\n').filter(Boolean);
  if (want) {
    const expect = want.map((p) => `package/${p}`).sort(byCode), got = listed.slice().sort(byCode);
    if (!sameList(expect, got)) failWith(`gate e: ${file} does not list the expected entries:`, listDiff(expect, got).slice(0, 20));
  }
  return { file, entries: listed.length, size: statSync(path).size };
}

const fmtBox = (b) => `${+b.x.toFixed(3)},${+b.y.toFixed(3)} ${+b.w.toFixed(3)}×${+b.h.toFixed(3)}`;
function refuse(msg, lines = []) {
  console.error(`release refused: ${msg}`);
  for (const l of lines) console.error(`  ${l}`);
  process.exit(1);
}
function usage(msg) {
  if (msg) console.error(msg);
  console.error('usage: npm run release [-- --gate] | -- --lock   (dev: --allow-dirty --skip-check --templates <dir>)');
  process.exit(msg ? 2 : 0);
}

if (isMainThread && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
