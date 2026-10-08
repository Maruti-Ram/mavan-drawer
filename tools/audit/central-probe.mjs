#!/usr/bin/env node
// tools/audit/central-probe.mjs — reprints the figures of docs/audit/references-central.md (card 2.5)
// that the committed command does not print, and the document's "our set" figures from the PIN.
//
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing (stdout only).
//
// WHY A PROBE BESIDE THE COMMITTED COMMAND. `node tools/audit/refs/central-axes.mjs --png --ours` prints
// most of the document (verified line by line on 2026-10-08: its stdout equals the saved
// `analysis/report.txt` byte for byte apart from the timestamps). Two gaps remain:
//   1. reference-side figures it never prints: the category-frame count, the unreadable set's error and the
//      bridge calls (§1); the card brief's earlier 26-icon sample (334 of 390), the list of icons whose every
//      outline/filled pair breaks and the cross family inside it, and cross-large's 15 of 15 (§7); the names
//      that repeat inside one group (§11);
//   2. its "our set" half (`untitled-ours.mjs` `radiusRelation`) reads the LIVE `src/icons`, which the
//      drawing session keeps changing. This probe reads the pin instead (§5's table about us, §9 Kind 1).
// `central-axes.mjs` cannot be imported (no CLI guard: importing it runs it and writes under research/).
//
// USAGE
//   node tools/audit/central-probe.mjs <pin-dir> [section …] [--refs <dir>]
//   <pin-dir>  `git archive 5933041` (+ its own build) — needs src/icons/{24,20,16}
//   --refs     the reference records; default the repo's research/references (gitignored, present on
//              the audit machine): reads <refs>/central/figma/{catalogue.json,*.json,raw/*.json}
//
// SECTIONS (default: all, in this order)                                          document §
//   s1   the page, its category frames, the unreadable set, the bridge calls          §1
//   s5   Central's radius relation applied to our shape-filled pairs (the pin)        §5 ("Applied to our…")
//   s7   the earlier 26-icon sample; the icons whose every verified outline/filled pair  §7
//        breaks; the cross family inside that list
//   s9   Kind 1 findings 1–4 (the same measurement, by finding; the 16 offset is the     §9
//        commonest one measured, not the document's 0.125)
//   s11  names that repeat inside one group                                           §11
//
// INSTRUMENTS. tools/audit/refs/pairgeom.mjs (boxOf, renderBox, sideDiff, maxAbs, endsCensus — the same calls
// central-axes.mjs makes); tools/audit/angles.mjs (readIcon); tools/audit/radii.mjs (cornersOf).
//
// KNOWN DEFECTS AND HOW THEY ARE MET (plan, "Known instrument defects"):
//   · figma.mjs `measure.ink` (Figma's render bounds) is wrong on rotated or flipped nodes (1,032 Central
//     drawings). s7 uses `pairgeom.boxOf`, exactly as central-axes.mjs §6 does: the box is computed from the
//     PATH with node rounding put back; the render bounds serve only as a check, and a pair enters only when
//     both boxes are 'verified' (path box = render bounds to 0.01, node not flagged rotated). A flipped node
//     not flagged rotated fails that check and is left out as 'disputed'. So the s7 list depends on the render
//     bounds only through which pairs are admitted. The one exception is s7's "earlier 26-icon sample" line, which
//     reprints the card brief's 334 of 390 the way it was first measured — on the render bounds — and prints the
//     verified-path figure beside it.
//   · Central's `cornerRadius` can live only as a node property while `d` stays sharp. `boxOf` puts it
//     back (`roundSharp`), and `endsCensus` reads the stroke-2 radius-0 drawing, where the property is 0.
//     A path whose radius is per-vertex ('mixed') cannot be rebuilt; its drawings are 'disputed', left out.
//   · Concept names are not unique: every concept is keyed by group, name and file order (as central-axes.mjs
//     does), and s11 lists the repeats.
//   · s5/s9 read our drawings only; no reference geometry, no render bounds.
//
// RUN TIME on the audit Mac (2026-10-08): s1 0.3 s · s5 0.6 s · s7 2.9 s · s9 0.6 s · s11 0.05 s · all 3.6–4.8 s
// (s7 reads all 57,780 Central drawings; no raster, so it is far quicker than central-axes.mjs's 51 s).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { boxOf, renderBox, sideDiff, maxAbs, endsCensus } from './refs/pairgeom.mjs';
import { readIcon } from './angles.mjs';
import { cornersOf } from './radii.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
export const SECTIONS = ['s1', 's5', 's7', 's9', 's11'];
export const MASTERS = [24, 20, 16];
const SKIP = new Set(['index.json', 'catalogue.json', 'calibration.json']);

// Parameters the card chose (central-axes.mjs §6, untitled-ours.mjs radiusRelation), named here, not tuned.
export const PAIR_TOL = 0.01;          // an outline/filled pair "holds" when every side is equal to 0.01
export const COMBOS = [['0', 'square'], ['0', 'round'], ['1', 'round'], ['2', 'round'], ['3', 'round']];
export const STROKES = ['2', '1.5', '1'];
export const REL_TOL = 0.02;           // radius relation: consistent when the filled radius is either offset to 0.02
export const MATCH_TURN = 2;           // … matched by place: same turn within 2 degrees …
export const MATCH_DIST = 0.08;        // … and the filled corner within 0.08 of h / cos(turn/2) from the outline's vertex
export const CURVE_FIT = 0.08;         // §5/§9: an off-by under 0.08 is "the size of a curve fit, not a finding"

// ── formatting ─────────────────────────────────────────────────────────────
export const n0 = (v) => Number(v).toLocaleString('en-US');
export const pct = (n, d) => (d ? (100 * n / d).toFixed(1) + '%' : 'n/a');
const r3 = (v) => Math.round(v * 1000) / 1000;
const fx = (v, d) => Number(v).toFixed(d);
const sgn = (v, d) => (v >= 0 ? '+' : '−') + fx(Math.abs(v), d);
const head = (t) => console.log(`\n## ${t}`);
const say = (s = '') => console.log(s);

// ── reading the reference records ──────────────────────────────────────────

/** Every ingested concept, keyed as central-axes.mjs keys it (group/name#order: names repeat). */
export function loadConcepts(refsDir) {
  const dir = path.join(refsDir, 'central', 'figma');
  const key = (r) => `${r.variant.filled}|${r.variant.stroke}|${r.variant.radius}|${r.variant.join}`;
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !SKIP.has(f)).sort().map((f, i) => {
    const c = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    return { id: `${c.group}/${c.name}#${i}`, name: c.name, group: c.group, by: new Map(c.records.map((r) => [key(r), r])) };
  });
}

export function readCatalogue(refsDir) {
  return JSON.parse(fs.readFileSync(path.join(refsDir, 'central', 'figma', 'catalogue.json'), 'utf8'));
}

/** The raw bridge dumps: one file per `figma_execute` call. A full read picks every enumerated concept. */
export function rawDumps(refsDir, source) {
  const dir = path.join(refsDir, source, 'figma', 'raw');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const picked = r.picked || [];
    return { file: f, from: r.from, to: r.to, enumerated: r.enumerated, picked, full: picked.length === r.enumerated, page: r.page, errors: r.errors || [] };
  });
}

/** Names that occur more than once inside one group of the catalogue. */
export function repeatedNames(rows) {
  const by = new Map();
  for (const r of rows) { const k = `${r[0]}/${r[1]}`; if (!by.has(k)) by.set(k, []); by.get(k).push(r[r.length - 1]); }
  return [...by.entries()].filter(([, ids]) => ids.length > 1).map(([k, ids]) => ({ key: k, ids })).sort((a, b) => a.key.localeCompare(b.key));
}

/** What the outline's open ends look like, read on stroke 2, radius 0, round (central-axes.mjs `kindOf`). */
export function endKind(rec) {
  const e = endsCensus(rec);
  return e.ends.some((x) => x.kind === 'diag') ? 'diagonal-ended' : e.ends.length ? 'axis-ended only' : 'no open ends';
}

/** Per concept: every outline/filled pair (same stroke, radius, join) with both boxes verified, and whether it holds. */
export function pairCensus(concepts) {
  const out = [];
  for (const c of concepts) {
    const pairs = [];
    for (const s of STROKES) for (const [rad, j] of COMBOS) {
      const o = c.by.get(`off|${s}|${rad}|${j}`), f = c.by.get(`on|${s}|${rad}|${j}`);
      if (!o || !f) continue;
      const bo = boxOf(o), bf = boxOf(f);
      if (bo.status !== 'verified' || bf.status !== 'verified') continue;
      const d = sideDiff(bo.box, bf.box);
      pairs.push({ s, rad, j, d, m: maxAbs(d) });
    }
    if (!pairs.length) continue;
    const r0 = c.by.get('off|2|0|round');
    out.push({ id: c.id, name: c.name, group: c.group, kind: r0 ? endKind(r0) : '?', pairs, bad: pairs.filter((p) => p.m > PAIR_TOL).length, worst: Math.max(...pairs.map((p) => p.m)) });
  }
  return out;
}

/** Category frames: the distinct groups among the catalogued sets. */
export const frameCount = (rows) => new Set(rows.map((r) => r[0])).size;

/** The icons whose EVERY verified outline/filled pair breaks (not merely some), worst side first. */
export function alwaysBreaking(C) {
  const every = C.filter((c) => c.bad === c.pairs.length);
  return every.sort((a, b) => b.worst - a.worst || a.name.localeCompare(b.name));
}

/**
 * The earlier sample (the raw dumps that pick fewer than all sets): its outline/filled pairs compared on Figma's
 * render bounds — x, y, width and height to PAIR_TOL, the way figma.mjs `summary` compares — and, for contrast,
 * on the verified path boxes this card trusts. The render-bounds figure is the one the card brief quoted.
 */
export function sampleBoxes(concepts, picked) {
  const want = new Set(picked), seen = new Set();
  const T = { concepts: 0, pairs: 0, render: 0, verifiedPairs: 0, verified: 0 };
  for (const c of concepts) {
    const k = `${c.group}|${c.name}`;
    if (!want.has(k) || seen.has(k)) continue;
    seen.add(k); T.concepts++;
    for (const s of STROKES) for (const [rad, j] of COMBOS) {
      const o = c.by.get(`off|${s}|${rad}|${j}`), f = c.by.get(`on|${s}|${rad}|${j}`);
      if (!o || !f) continue;
      T.pairs++;
      const ro = renderBox(o), rf = renderBox(f);
      if (ro && rf) { const d = sideDiff(ro, rf); if (Math.max(Math.abs(d.left), Math.abs(d.top), Math.abs(d.right - d.left), Math.abs(d.bottom - d.top)) <= PAIR_TOL) T.render++; }
      const bo = boxOf(o), bf = boxOf(f);
      if (bo.status === 'verified' && bf.status === 'verified') { T.verifiedPairs++; if (maxAbs(sideDiff(bo.box, bf.box)) <= PAIR_TOL) T.verified++; }
    }
  }
  return T;
}

// ── our set, from the pin (untitled-ours.mjs `radiusRelation` with the icon root as a parameter) ──────

/**
 * Central's relation on our shape-filled pairs at one master: every outline corner with a radius, matched by
 * place to a filled area corner; consistent when filled radius = outline radius + h (outer contour) or
 * max(0, outline radius − h) (a punched line), to REL_TOL. Returns the counts and every corner that is off.
 */
export function radiusRelation(pinDir, m) {
  const root = path.join(pinDir, 'src', 'icons');
  const names = fs.readdirSync(path.join(root, '24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.replace(/\.svg$/, '')).sort();
  let pairs = 0, corners = 0, matched = 0, ok = 0; const off = [];
  for (const n of names) {
    const fo = path.join(root, String(m), `${n}.svg`), ff = path.join(root, String(m), `${n}-filled.svg`);
    if (!fs.existsSync(fo) || !fs.existsSync(ff)) continue;
    const o = readIcon(fo), f = readIcon(ff);
    if (!f.hasAreas) continue;
    pairs++;
    const h = o.stroke / 2;
    const oc = o.paths.filter((p) => p.style === 'stroke').flatMap((p) => cornersOf(p.d)).filter((c) => c.kind === 'arc' || c.kind === 'bezier');
    const fc = f.paths.filter((p) => p.style === 'area').flatMap((p) => cornersOf(p.d));
    const used = new Set();
    for (const x of oc) {
      corners++;
      const dExp = h / Math.cos((Math.abs(x.turn) / 2) * Math.PI / 180);
      let best = null;
      fc.forEach((y, i) => { if (used.has(i) || Math.abs(y.turn - x.turn) > MATCH_TURN) return; const e = Math.abs(Math.hypot(y.at[0] - x.at[0], y.at[1] - x.at[1]) - dExp); if (e <= MATCH_DIST && (!best || e < best.e)) best = { i, e, y }; });
      if (!best) continue;
      used.add(best.i); matched++;
      const expO = x.radius + h, expI = Math.max(0, x.radius - h);
      const dO = best.y.radius - expO, dI = best.y.radius - expI;
      const outer = Math.abs(dO) <= Math.abs(dI), d = outer ? dO : dI;
      if (Math.abs(d) <= REL_TOL) ok++;
      else off.push({ n, d: r3(d), outline: r3(x.radius), filled: r3(best.y.radius), expected: r3(outer ? expO : expI) });
    }
  }
  return { m, pairs, corners, matched, ok, off };
}

/** The commonest off-by among one master's off corners: {d, n}; a tie goes to the smaller |d|, then the positive one. */
export function modalOffset(off) {
  const n = new Map();
  for (const x of off) n.set(x.d, (n.get(x.d) || 0) + 1);
  const best = [...n.entries()].sort((a, b) => b[1] - a[1] || Math.abs(a[0]) - Math.abs(b[0]) || b[0] - a[0])[0];
  return best ? { d: best[0], n: best[1] } : null;
}

/** Group the off corners of one master by concept, in name order. */
export function offByConcept(off) {
  const by = new Map();
  for (const x of off) { if (!by.has(x.n)) by.set(x.n, []); by.get(x.n).push(x); }
  return [...by.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

// ── sections ────────────────────────────────────────────────────────────────
function makeContext(pinDir, refsDir) {
  const memo = {};
  const once = (k, f) => (k in memo ? memo[k] : (memo[k] = f()));
  return {
    pinDir, refsDir,
    catalogue: () => once('cat', () => readCatalogue(refsDir)),
    dumps: () => once('d', () => rawDumps(refsDir, 'central')),
    concepts: () => once('c', () => loadConcepts(refsDir)),
    census: (ctx) => once('pc', () => pairCensus(ctx.concepts())),
    rel: () => once('rel', () => MASTERS.map((m) => radiusRelation(pinDir, m))),
  };
}

const RUN = {
  s1(ctx) {
    head('§1 Sample, and why this one — and how far to trust the read');
    const cat = ctx.catalogue(), dumps = ctx.dumps();
    say(`| Source | Figma page \`${cat.page && cat.page.name}\` (\`${cat.page && cat.page.id}\`): ${frameCount(cat.rows)} category frames of component sets (distinct groups among the ${n0(cat.rows.length)} catalogued sets) |`);
    const errs = dumps.flatMap((d) => d.errors.map((e) => ({ ...e, file: d.file })));
    say(`| Read | ${n0(cat.rows.length)} sets catalogued; unreadable at extraction: ${errs.length ? errs.map((e) => `\`${e.name}\` — Figma raised "${e.error}" (raw dump ${e.file})`).join('; ') : 'none'} |`);
    const full = dumps.filter((d) => d.full);
    say(`| Why the whole set | reading it cost ${full.length} bridge calls (raw dumps that pick all ${full.length ? n0(full[0].enumerated) : '?'} sets: ${full.sort((a, b) => a.from - b.from).map((d) => `${d.from}–${d.to}`).join(', ')}); ${dumps.length - full.length} more dump(s) hold an earlier sample |`);
  },

  s5(ctx) {
    head('§5 Filled corner radius against the outline\'s — applied to our shape-filled pairs (the pin)');
    say('| master | shape-filled pairs | matched corners | consistent to 0.02 | off |');
    for (const R of ctx.rel()) {
      const cs = new Set(R.off.map((x) => x.n));
      say(`| ${R.m} | ${R.pairs} | ${n0(R.matched)} | ${n0(R.ok)} (${pct(R.ok, R.matched)}) | ${R.off.length} corners in ${cs.size} concepts |`);
    }
    const R16 = ctx.rel().find((r) => r.m === 16);
    const M16 = modalOffset(R16.off) || { d: NaN, n: 0 };
    const plus = R16.off.filter((x) => x.d === M16.d), others = R16.off.filter((x) => x.d !== M16.d);
    say(`At 16, ${plus.length} of the ${R16.off.length} are off by exactly ${sgn(M16.d, 3)} (the commonest offset), in ${[...new Set(plus.map((x) => x.n))].sort().map((n) => `\`${n}\``).join(', ')} (${new Set(plus.map((x) => x.n)).size} concepts). The other ${others.length}: ${others.map((x) => `${sgn(x.d, 3)} (\`${x.n}\`)`).join(', ')}.`);
    for (const R of ctx.rel().filter((r) => r.m !== 16)) {
      say(`At ${R.m} the off corners are: ${offByConcept(R.off).map(([n, xs]) => `\`${n}\` ${xs.map((x) => `${sgn(x.d, 3)} (filled ${x.filled} where ${x.expected} is expected)`).join(', ')}`).join('; ')}`);
    }
  },

  s7(ctx) {
    head('§7 Outline against filled — the earlier sample, and the icons where every verified pair breaks');
    const sample = ctx.dumps().filter((d) => !d.full);
    if (sample.length) {
      const T = sampleBoxes(ctx.concepts(), sample.flatMap((d) => d.picked));
      say(`the earlier ${T.concepts}-icon sample (raw dumps ${sample.map((d) => d.file).join(', ')}): outer box equal to 0.01 in ${T.render} of ${T.pairs} pairs (${pct(T.render, T.pairs)}) on Figma's render bounds (x, y, width, height); on the verified path boxes this card uses, ${T.verified} of ${T.verifiedPairs}`);
    }
    const C = ctx.census(ctx);
    const every = alwaysBreaking(C);
    const byKind = (k) => every.filter((c) => c.kind === k).length;
    say(`icons with at least one verified pair: ${n0(C.length)}; every pair breaks in ${every.length} — slanted-ended ${byKind('diagonal-ended')}, the other ${every.length - byKind('diagonal-ended')} have no slanted end (closed only ${byKind('no open ends')}, square-on ends only ${byKind('axis-ended only')})`);
    say(`the ${every.length}, worst side first: ${every.map((c) => `${c.name} ${fx(c.worst, 2)}${c.kind === 'diagonal-ended' ? '' : c.kind === 'no open ends' ? ' (closed)' : ' (square-on)'}`).join(', ')}`);
    for (const [label, re] of [['hands', /hand/], ['medals', /medal/], ['3D boxes', /^3d-/]]) say(`   ${label} in the list: ${every.filter((c) => re.test(c.name)).map((c) => c.name).join(', ') || 'none'}`);
    const inList = new Set(every.map((c) => c.name));
    const family = ['cross-large', 'cross-small', 'arrow-up-left', 'arrow-up-right', 'arrow-down-left', 'arrow-down-right', 'checkmark-2'];
    say(`the cross family in the always-breaking list: ${family.map((n) => `${n} ${inList.has(n) ? 'yes' : 'no'}`).join(' · ')}`);
    for (const c of C.filter((x) => x.name === 'cross-large')) {
      const at = (j) => Math.max(...c.pairs.filter((p) => p.j === j).map((p) => p.m));
      say(`cross-large: breaks in ${c.bad} of ${c.pairs.length} verified pairs, by up to ${fx(c.worst, 2)} a side (worst side at the round join ${fx(at('round'), 3)}, at the mitred one ${fx(at('square'), 3)})`);
    }
  },

  s9(ctx) {
    head('§9 Findings about us — Kind 1 (the pin)');
    const at = (m) => ctx.rel().find((r) => r.m === m);
    const R16 = at(16), M16 = modalOffset(R16.off) || { d: NaN, n: 0 }, plus = R16.off.filter((x) => x.d === M16.d);
    const cs16 = [...new Set(plus.map((x) => x.n))].sort();
    say(`#1 At 16, ${cs16.length} shape-filled twins have a corner radius ${r3(Math.abs(M16.d))} ${M16.d >= 0 ? 'larger' : 'smaller'} than the outline's outer corner (the commonest offset at 16): ${cs16.join(', ')} (${plus.length} corners)`);
    const byN = (m, re) => offByConcept(at(m).off).filter(([n]) => re.test(n));
    const show = (list, m) => list.map(([n, xs]) => `${n} ${[...new Set(xs.map((x) => `filled ${x.filled} (outline ${x.outline}) where ${x.expected} is expected`))].join(' / ')} at ${m}`).join('; ');
    say(`#2 ${show(byN(24, /^clipboard/), 24)}; ${show(byN(20, /^clipboard/), 20)}`);
    say(`#3 ${show(byN(24, /^copy/), 24)}; ${show(byN(20, /^copy/), 20)}`);
    // #4: the other off corners at 24 — not the clipboard and copy families named in #2/#3, and at least curve-fit size
    const rest24 = offByConcept(at(24).off).filter(([n, xs]) => !/^(clipboard|copy)/.test(n) && xs.every((x) => Math.abs(x.d) >= CURVE_FIT));
    const ds = [...new Set(rest24.flatMap(([, xs]) => xs.map((x) => x.d)))];
    say(`#4 ${ds.length === 1 ? `${r3(Math.abs(ds[0]))} ${ds[0] < 0 ? 'under' : 'over'} the relation` : 'off the relation by different amounts'} at 24: ${show(rest24, 24)}`);
    const small = MASTERS.flatMap((m) => at(m).off.filter((x) => Math.abs(x.d) < CURVE_FIT).map((x) => ({ ...x, m })));
    say(`#4 under ${CURVE_FIT} (curve-fit size): ${[...new Set(small.map((x) => x.n))].sort().join(', ')} — ${small.map((x) => `${x.n} ${sgn(x.d, 3)} at ${x.m}`).join(', ')}`);
  },

  s11(ctx) {
    head('§11 Instruments, data notes — names that repeat inside one group');
    const rep = repeatedNames(ctx.catalogue().rows);
    say(`names that occur more than once in one group (catalogue): ${rep.length ? rep.map((r) => `${r.key} ×${r.ids.length} (node ids ${r.ids.join(', ')})`).join('; ') : 'none'}`);
  },
};

export function main(argv = process.argv.slice(2)) {
  const usage = 'usage: node tools/audit/central-probe.mjs <pin-dir> [section …] [--refs <dir>]\n  sections: ' + SECTIONS.join(' ');
  const refsAt = argv.indexOf('--refs');
  const refsDir = path.resolve(refsAt >= 0 ? argv[refsAt + 1] || '' : path.join(REPO, 'research', 'references'));
  const pos = argv.filter((a, i) => !a.startsWith('--') && !(refsAt >= 0 && i === refsAt + 1));
  const unknownFlag = argv.find((a) => a.startsWith('--') && a !== '--refs');
  if (unknownFlag) { console.error(`unknown flag ${unknownFlag}\n${usage}`); return 2; }
  const pinDir = pos[0] ? path.resolve(pos[0]) : null;
  if (!pinDir || !MASTERS.every((m) => fs.existsSync(path.join(pinDir, 'src', 'icons', String(m))))) { console.error(usage); return 2; }
  const wanted = pos.slice(1);
  const bad = wanted.filter((s) => !SECTIONS.includes(s));
  if (bad.length) { console.error(`unknown section ${bad.join(', ')}\n${usage}`); return 2; }
  if (!fs.existsSync(path.join(refsDir, 'central', 'figma', 'catalogue.json'))) { console.error(`no Central records under ${refsDir}/central/figma\n${usage}`); return 2; }
  const ctx = makeContext(pinDir, refsDir);
  console.log(`# central-probe — docs/audit/references-central.md (card 2.5); pin ${pinDir}; refs ${refsDir}`);
  for (const s of SECTIONS.filter((x) => !wanted.length || wanted.includes(x))) RUN[s](ctx);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
