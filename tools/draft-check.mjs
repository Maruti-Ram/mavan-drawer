#!/usr/bin/env node
// Lint a draft before it is shown, without writing anything into the repo.
//
//   node tools/draft-check.mjs lab/drafts/current.js            every candidate
//   node tools/draft-check.mjs lab/drafts/batch/user.js B D     just these
//   node tools/draft-check.mjs lab/drafts/batch/user.js B=user-small
//
// For each candidate it builds the same six files `queue.mjs approve` would
// write (24 · 20 · 16 × outline · filled, with the keyline / box / tags / glyph
// / optical notes), puts them in a temp directory and runs the whole of
// `npm run check`'s lint over them — including the filled-weight root check,
// the filled-vs-outline ink-box pair comparison (C10/C12) and the C8 size
// family check, which reads the shipped default out of src/icons when the
// candidate is a `-large` / `-small`.
//
// A level family (C28): a candidate declaring `anchor: 'volume'` is held to its full
// member, so the full member's six files are linted beside it. It is found, in order, as
// the candidate this run names explicitly `=volume`, the candidate the draft's `set` ships
// as `volume`, or the shipped src/icons/<m>/volume*.svg — a candidate that merely fell back
// to the concept name never stands in. With `--approve` (what `queue.mjs approve --dry-run`
// passes) the `set` step is skipped: an approval writes only its own plan, so the anchor must
// be in that plan or already shipped, exactly as the real approve will find it. A bare id is
// named by the draft's `set` when it lists that id (`set: { V2: 'volume', V1: 'volume-low' }`),
// else by the concept — so `draft-check volume.js` checks each member under the name it ships as.
// A C33 composite declaring `base: 'password'` is found and held the same way: its base's six
// files are linted beside it, from the same three places, and `--approve` skips `set` the same.
//
// Nothing in the repo is touched, so it is safe while an icon is on the board.
// Exits 1 if any candidate has an error.
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sizeBase, sizeOf } from './masters.mjs';
import { lintSource, checkPairs, checkFamilies, checkAnchors, checkBases } from './lint.mjs';
import { candidateFiles, masters, planArg } from './draft-svg.mjs';

const G = '\x1b[32m', Y = '\x1b[33m', R = '\x1b[31m', D = '\x1b[2m', B = '\x1b[1m', X = '\x1b[0m';
const r3 = (n) => Math.round(n * 1000) / 1000;
const die = (msg) => { console.error(msg); process.exit(1); };
const dims = (b) => (b ? `${r3(b.x1 - b.x0)}×${r3(b.y1 - b.y0)} at ${r3(b.x0)},${r3(b.y0)}` : 'no ink');

const argv = process.argv.slice(2);
const approveMode = argv.includes('--approve');
const [draftPath, ...ids] = argv.filter((a) => a !== '--approve');
if (!draftPath) die('node tools/draft-check.mjs <draft.js> [candidateId[=<file-name>]…]');
if (!existsSync(draftPath)) die(`No draft at ${draftPath}.`);

const d = (await import(`${pathToFileURL(resolve(draftPath)).href}?t=${Date.now()}`)).default;
if (!d?.candidates?.length) die(`${draftPath} has no candidates.`);

// Same shape as `approve`: bare id → the name the draft's `set` gives it, else the concept's
// own name; id=file → a variant.
const plan = (ids.length ? ids : d.candidates.map((c) => c.id)).map((a) => {
  const { id, file, from } = planArg(d, a);
  const c = d.candidates.find((x) => x.id === id)
    ?? die(`No candidate "${id}" in ${draftPath} (have: ${d.candidates.map((x) => x.id).join(', ')}).`);
  return { c, file, from };
});

const tmp = mkdtempSync(join(tmpdir(), 'mavan-draft-'));
let failed = 0, warned = 0;
console.log(`${B}${draftPath}${X} · concept ${d.concept} · ${plan.length} candidate(s) → ${D}${tmp}${X}\n`);

for (const { c, file } of plan) {
  let out;
  try { out = candidateFiles(d, c, file); }
  catch (e) { console.log(`${R}✗${X} ${B}${c.id}${X} ${file} — ${R}${e.message}${X}\n`); failed++; continue; }

  // One candidate is judged on its own: a map of just its six files, plus — when it is a
  // size variant — the shipped default, so checkFamilies has something to measure against.
  const results = new Map();
  for (const { master, file: f, src } of out) {
    mkdirSync(join(tmp, c.id, String(master)), { recursive: true });
    writeFileSync(join(tmp, c.id, String(master), f), src);
    results.set(`${master}/${f}`, lintSource(master, f, src));
  }
  const mine = new Set(results.keys());
  if (sizeOf(file)) for (const m of masters) for (const f of [`${sizeBase(file)}.svg`, `${sizeBase(file)}-filled.svg`]) {
    const p = join('src/icons', String(m), f);
    if (existsSync(p)) results.set(`${m}/${f}`, lintSource(m, f, readFileSync(p, 'utf8')));
  }
  // An anchored member (C28) is held to its full member, and a C33 composite that declares a base
  // to that base: lint those six files beside it. A file declares at most one of the two.
  const refs = [];   // [{ kind, name, from }] — printed under the candidate's headline
  for (const [kind, name] of [['anchor', [...results.values()].find((r) => r.anchor)?.anchor.name],
    ['base', [...results.values()].find((r) => r.base)?.base.name]]) {
    if (!name || name === file) continue;
    let from = null;
    const inPlan = plan.find((p) => p.file === name && p.from === 'explicit')?.c;
    const inSet = approveMode ? null : d.candidates.find((x) => d.set?.[x.id] === name);
    const byName = inPlan ?? inSet;
    let src = null;
    if (byName) {
      try { src = candidateFiles(d, byName, name); from = `candidate ${byName.id} of this draft${inPlan ? '' : ' (its `set` name)'}`; }
      catch (e) { from = `candidate ${byName.id} cannot ship (${e.message}); `; }
    }
    if (!src) {
      src = masters.flatMap((m) => [`${name}.svg`, `${name}-filled.svg`].map((f) => ({ master: m, file: f, p: join('src/icons', String(m), f) })))
        .filter(({ p }) => existsSync(p)).map(({ master, file: f, p }) => ({ master, file: f, src: readFileSync(p, 'utf8') }));
      from = (from ?? '') + (src.length ? 'shipped src/icons' : `not in ${approveMode ? 'this approval' : 'this run or the draft\'s set'}, not shipped`);
    }
    for (const { master, file: f, src: text } of src) {
      if (results.has(`${master}/${f}`)) continue;
      mkdirSync(join(tmp, c.id, String(master)), { recursive: true });
      writeFileSync(join(tmp, c.id, String(master), f), text);
      results.set(`${master}/${f}`, lintSource(master, f, text));
    }
    refs.push({ kind, name, from });
  }
  checkFamilies(results);
  checkPairs(results);
  checkAnchors(results);
  checkBases(results);

  const errs = [...mine].reduce((n, k) => n + results.get(k).errors.length, 0);
  const warns = [...mine].reduce((n, k) => n + results.get(k).warnings.length, 0);
  const mark = errs ? `${R}✗${X}` : warns ? `${Y}!${X}` : `${G}✓${X}`;
  console.log(`${mark} ${B}${c.id}${X} → ${file}${c.label ? ` ${D}(${c.label})${X}` : ''}`);
  for (const { kind, name, from } of refs) console.log(`  ${D}${kind} ${name}: ${from}${X}`);
  for (const m of masters) {
    const o = results.get(`${m}/${file}.svg`), f = results.get(`${m}/${file}-filled.svg`);
    console.log(`  ${String(m).padStart(2)}  outline ${dims(o?.ink).padEnd(26)} filled ${dims(f?.ink)}`);
    for (const [style, r] of [['outline', o], ['filled', f]]) {
      r?.notes.forEach((n) => console.log(`      ${D}· ${style} ${n}${X}`));
      r?.warnings.forEach((w) => console.log(`      ${Y}warn  ${style} ${w}${X}`));
      r?.errors.forEach((e) => console.log(`      ${R}error ${style} ${e}${X}`));
    }
  }
  console.log('');
  if (errs) failed++; else if (warns) warned++;
}

console.log(`${plan.length} candidate(s) · ${G}${plan.length - failed - warned} clean${X} · ${Y}${warned} warned${X} · ${R}${failed} failed${X}`);
if (!process.env.MAVAN_KEEP_TMP) rmSync(tmp, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
