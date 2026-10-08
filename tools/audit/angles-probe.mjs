#!/usr/bin/env node
// angles-probe — every measured figure in docs/audit/findings-angles.md (card 1.3, every deviation
// from 0/45/90), printed again from the pin, section by section, in the document's own rounding.
//
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing.
//
// Usage:
//   P=<scratch>/pin; git archive 5933041 | tar -x -C $P
//   node tools/audit/angles-probe.mjs $P [section …] [--full]
// No section = all. `--full` prints every row of §5.1's chevron table (120), not just the rows the
// document quotes. Reads only `$P/src/icons/{24,20,16}` — no `dist/`, no `research/references/`.
//
// Sections → document:
//   head   header block: "17,091 straight segments", the verification table, the coverage gap
//   s1     §1 Totals, §1.1 deviation histogram, §1.2 per master (and the legal-band 1.95x)
//   s2     §2 the three populations, §2.1 population A, §2.2 population B, §2.3 by name kind
//   s3.1   §3.1 recurring off-axis angles (dev > 2) by fromHorizontal
//   s3.2   §3.2 run-over-rise: on-grid shares, the 232 small whole-number ratios
//   s3.3   §3.3 the 20/70 convention (and how many of its segments sit within the claimed 0.08), 15/75, 8.5 off upright
//   s3.4   §3.4 30 and 60 degrees
//   s4     §4 trash taper and code slash
//   s5     §5 outline against filled (the 1,407 pairs)
//   s5.1   §5.1 the chevron family
//   s5.2   §5.2 the concepts off axis in the filled file only, found set-wide (not named), and 24/search read from source
//   s6     §6 declared against silent (90 / 34; 193 of 485; the three spellings)
//   s6.1   §6.1 off axis by more than 2 and silent (34)
//   s6.2   §6.2 bare defaults more than 2 off, by ink drift (29)
//   s6a    §6a the full 163-concept roll-up, in the document's table format
//   s7     §7 figures new in the judged list (A-1's three candidate counts, A-3, A-5, A-14, A-16..A-21)
//   s9     §9 the two wave-0 figures that do not reproduce (851; 0.068 / 0.049)
// §7a and §8 restate figures from the sections above; they have no section of their own.
//
// Instruments: `tools/audit/angles.mjs` (`listIcons`, `anglesOf` — the same calls the card's dump
// made, `anglesOf(f, { tolerance: 0.5, minLength })`) and `tools/masters.mjs` (`gridOf`). The card's
// tables came from a dump that rounded every field (dev and offset to 1e-5, angles, lengths and
// run/rise to 1e-4, endpoints to 1e-3); its scripts then read either that dump or an unrounded
// re-run. This probe keeps both copies of each segment (`toRow`: rounded fields at the top level,
// unrounded under `.raw`) and each section reads whichever copy its original script read.
// Where `node tools/audit/angles.mjs` already prints a figure (17,091 · 2,613 · 163 · the
// nearest-angle tallies) it must be run from the pin's root, `(cd $P && node <repo>/tools/audit/angles.mjs)`:
// its `listIcons()` reads `src/icons` relative to the working directory.
//
// Known instrument defects: none of the plan's list touches this probe (no raster, no bbox, no
// congruence, no Figma). One quirk found while mapping: `angles.mjs`'s CLI "by angle, commonest
// first" list is not commonest-first for whole-degree angles — `Object.fromEntries` puts
// integer-like keys ("6", "15", "20") ahead of the rest in numeric order. The probe does not use
// `census().byAngle`; §3.1 tallies the dump itself, as the card did.
//
// Where the document abridges, the probe prints the whole list so a reader can find each quoted
// value: §3.1 the 20 commonest angles (the document shows 16 of the first 17), §3.2 every ratio (the
// document's table is a3.mjs's top 14, cut inside a tie), §3.3 every distinct angle per master,
// §5.1 the rows the document quotes (`--full` for all 120). §6.1 prints one row per concept where
// the document groups siblings into one row. Rounding follows the document: §2's mean offsets 3 dp
// (4 below 0.01), §2.3's whole share "100%", §1.2's legal band 5 dp fixed, §3.3's ranges 1 dp fixed,
// §6.2 2 dp rounded half up from a4.mjs's printed values (2.355 → 2.36, as the document did).
//
// Run time on this machine (2026-10-08): loading the 2,910 drawings 0.24 s; then head 32 ms ·
// s1 8 · s2 9 · s3.1 2 · s3.2 4 · s3.3 7 · s3.4 4 · s4 1 · s5 15 · s5.1 6 · s5.2 2 · s6 30 ·
// s6.1 6 · s6.2 5 · s6a 3 · s7 19 · s9 5 ms. A full run takes about 0.5 s of wall time.

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { listIcons, anglesOf } from './angles.mjs';
import { gridOf } from '../masters.mjs';

// ── parameters the card chose (recovered from its scripts; each is a choice, not a figure) ─────
export const TOLERANCE = 0.5;     // dump-angles.mjs: anglesOf(f, { tolerance: 0.5, … })
export const MIN_LENGTH = 0.1;    // dump-angles.mjs: minLength 0.1 — shorter segments are "dropped"
export const ZERO = 1e-9;         // angtab-build.mjs: "on axis" = dev <= 1e-9 on the dump's dev
export const NEAR_MAX = 0.5;      // population A = 0 < dev <= 0.5 (the tolerance)
export const GIVE_MAX = 2;        // population B = 0.5 < dev <= 2; C = dev > 2
export const EDGES = [0, 0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 15, 22.5];   // §1.1's buckets
export const GRID_TOL = 1e-6;     // a2.mjs: v/step within 1e-6 of a whole number
export const RATIO_MAX = 8;       // a3.mjs: p:q with p, q <= 8 …
export const RATIO_TOL = 1e-4;    // … and |run/rise - p/q| < 1e-4
export const WINDOW_3060 = 0.5;   // angtab-build.mjs T6: "within 0.5 of 30 or 60"
export const PAIR_WINDOW = 0.25;  // angtab-build.mjs T7: filled partner within 25% of the length
export const PAIR_CAP = 10;       // T7c-cap: the document's right column sets aside partners > 10
export const THRESHOLDS = [0.1, 0.5, 1, 2];
export const RECURRING_ROWS = 20; // §3.1 prints the 20 commonest angles (the document shows 16 of the first 17)
// The conventions §3.3 names, as fromHorizontal targets; a concept belongs when every one of its
// dev > 2 segments sits within CONVENTION_TOL of a target and it reaches every target. a3.mjs
// filtered at 1.5; 0.5 and 1.5 print byte-identical §3.3 output on the pin (checked by the reviewer).
export const CONVENTIONS = [['20/70', [20, 70]], ['15/75', [15, 75]], ['8.5 off upright', [81.5]]];
export const CONVENTION_TOL = 0.5;
export const HELD_TO = 0.08;      // §3.3 / A-1's claim "held to within 0.08 degrees" — tested, not tuned
// docs/07 C30 as quoted by §4 (a claim the document checks, not a figure it measures)
export const C30_STATED = { 24: { fh: 73.14, rr: '5x16.5' }, 20: { fh: 72.26, rr: '4x12.5' }, 16: { fh: 73.18, rr: '3.25x10.75' } };
export const C22_TAPER = 4;       // docs/07 C22: trash walls taper 4 degrees (from the vertical)

const MASTERS = [24, 20, 16];

// ── formatting: the card's own helpers ─────────────────────────────────────────────────────────
/** q.mjs `r`: Math.round at k places (a2–a6 printed with this). */
export const rnd = (x, k = 3) => Math.round(x * 10 ** k) / 10 ** k;
/** angtab-build.mjs `f`: toFixed, minus sign dropped from a zero. */
export const fx = (x, dp) => { const s = Number(x).toFixed(dp); return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s; };
/** angtab-build.mjs `trim`: toFixed then shortest form (5, 16.5, 0.494). */
export const trim = (x, dp = 3) => String(Number(Number(x).toFixed(dp)));
const pct = (n, d, dp = 2) => (d === 0 ? '-' : `${fx((100 * n) / d, dp)}%`);
/** §2's mean offsets as the document writes them: 3 dp, or 4 dp below 0.01 (0.0094 · 0.058 · 0.965). */
export const meanOffsetText = (x) => (x < 0.01 ? fx(rnd(x, 4), 4) : fx(rnd(x, 4), 3));
/** §2.3's shares: 2 dp, but a whole share is "100%". */
const share = (n, d) => (d > 0 && n === d ? '100%' : pct(n, d));
const num = (n) => n.toLocaleString('en-US');
const uniq = (a) => [...new Set(a)];
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => (a.length ? sum(a) / a.length : NaN);
const maxOf = (a) => Math.max(...a);
const minOf = (a) => Math.min(...a);
const byCount = (m) => [...m].sort((a, b) => b[1] - a[1]);           // stable: ties keep first-seen order
const tally = (xs, f) => { const m = new Map(); for (const x of xs) { const k = f(x); m.set(k, (m.get(k) ?? 0) + 1); } return byCount(m); };
const groupBy = (xs, f) => { const m = new Map(); for (const x of xs) { const k = f(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); } return m; };

// ── one segment, as the dump wrote it and as the instrument measured it ───────────────────────
/** dump-angles.mjs, field for field, plus `.raw` — the unrounded instrument values. */
export function toRow(s) {
  const R = (v, k) => Math.round(v * 10 ** k) / 10 ** k;
  return {
    name: s.name, concept: s.name.replace(/-filled$/, ''), master: s.master, filled: /-filled$/.test(s.name),
    pstyle: s.style, path: s.path, sub: s.sub, closing: s.closing,
    dx: R(s.dx, 4), dy: R(s.dy, 4), length: R(s.length, 4), angle: R(s.angle, 4),
    fromHorizontal: R(s.fromHorizontal, 4), fromVertical: R(s.fromVertical, 4), nearest: s.nearest,
    dev: R(s.dev, 5), offset: R(s.offset, 5),
    from: s.from.map((v) => R(v, 3)), to: s.to.map((v) => R(v, 3)),
    raw: { dx: s.dx, dy: s.dy, length: s.length, angle: s.angle, fromHorizontal: s.fromHorizontal,
           dev: s.dev, offset: s.offset, from: s.from, to: s.to },
  };
}

export const isOn = (r) => r.dev <= ZERO;
export const isNear = (r) => r.dev > ZERO && r.dev <= NEAR_MAX;
export const isOff = (r) => r.dev > NEAR_MAX;
/** 'on' · 'A' (near-miss) · 'B' (the 16 give) · 'C' (genuinely off). */
export const population = (r) => (isOn(r) ? 'on' : isNear(r) ? 'A' : r.dev <= GIVE_MAX ? 'B' : 'C');
/** §1.1's bucket index: 0 is "== 0", then (EDGES[i-1], EDGES[i]], last is "> 22.5". */
export const bucketOf = (d) => { if (d <= ZERO) return 0; for (let i = 1; i < EDGES.length; i++) if (d <= EDGES[i]) return i; return EDGES.length; };
export const BUCKET_LABELS = ['== 0', ...EDGES.slice(1).map((e, i) => `(${EDGES[i]}, ${e}]`), `> ${EDGES.at(-1)}`];

/** angtab-build.mjs `kindOf`: numbered = any dash-token all digits (§2.3). */
export const kindByToken = (c) => {
  const numbered = c.split('-').some((t) => /^\d+$/.test(t));
  const size = /-(small|large)$/.test(c);
  return numbered ? (size ? 'num+size' : 'num') : (size ? 'size' : 'bare');
};
/** a4.mjs / a6.mjs: numbered = a number at the end, or before -small/-large (§6.1, §6.2, §6a). */
export const kindByTail = (c) => {
  const sz = /-(small|large)$/.test(c), nm = /-\d+(-small|-large)?$/.test(c);
  return nm && sz ? 'num+size' : nm ? 'num' : sz ? 'size' : 'bare';
};
export const isVariant = (c) => /-\d+(-small|-large)?$/.test(c);       // a4.mjs

/** Run x rise as angtab-build.mjs wrote it (toFixed) and as a3.mjs wrote it (Math.round). */
export const rrFixed = (r) => `${trim(Math.abs(r.dx))}x${trim(Math.abs(r.dy))}`;
export const rrRound = (r) => `${rnd(Math.abs(r.dx), 3)}x${rnd(Math.abs(r.dy), 3)}`;

/** a2.mjs: is v a whole number of grid steps? */
const onStep = (v, st) => Math.abs(v / st - Math.round(v / st)) < GRID_TOL;
export const runRiseOnGrid = (r) => { const st = gridOf(r.master); return onStep(Math.abs(r.dx), st) && onStep(Math.abs(r.dy), st); };
export const endpointsOnGrid = (r) => { const st = gridOf(r.master); return [r.from, r.to].filter(([x, y]) => onStep(x, st) && onStep(y, st)).length; };
/** angtab-build.mjs T9g: | |dx| - |dy| | on the unrounded run and rise, at 3 dp. */
export const imbalance = (r) => Math.abs(Math.abs(r.raw.dx) - Math.abs(r.raw.dy)).toFixed(3);
/** angtab-build.mjs T9h: decimals needed to write the largest of the four unrounded coordinates. */
export const decimalsNeeded = (r) => {
  const dec = (v) => { const s = String(Number(v.toFixed(9))); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  return maxOf([...r.raw.from, ...r.raw.to].map(dec));
};
/** a3.mjs: the smallest p:q (p, q <= RATIO_MAX, p first) that run:rise equals, or null. */
export function smallRatio(dx, dy, max = RATIO_MAX, tol = RATIO_TOL) {
  const a = Math.abs(dx), b = Math.abs(dy);
  if (a < 1e-9 || b < 1e-9) return null;
  for (let p = 1; p <= max; p++) for (let q = 1; q <= max; q++) if (Math.abs(a / b - p / q) < tol) return `${p}:${q}`;
  return null;
}

// ── what a 24 outline file says about itself ─────────────────────────────────────────────────
/** a4.mjs / a6.mjs: does the file state any degree figure, in any of the three spellings? (whole file) */
export const DECLARES = /[0-9][0-9.]*\s*(°|deg\b|degrees\b)/;
export const declares = (src) => (src == null ? null : DECLARES.test(src));
/** The four `grep -l` patterns §6 counted with (BSD grep, line by line). */
export const GREP = {
  any: /[0-9][0-9.]*\s*(°|deg\b|degrees\b)/,   // grep -lE '[0-9][0-9.]*[[:space:]]*(°|deg\b|degrees\b)'
  sign: /[0-9]°/,                               // grep -l '[0-9]°'
  deg: /[0-9][0-9.]*\s+deg\b/,                  // grep -lE '[0-9][0-9.]*[[:space:]]+deg\b'
  degrees: /[0-9][0-9.]*\s+degrees\b/,          // grep -lE '[0-9][0-9.]*[[:space:]]+degrees\b'
  first: /[0-9]°|[0-9] degrees/,                // grep -l "[0-9]°\|[0-9] degrees" — the first count (A-14's 183)
};
export const grepL = (src, re) => src.split('\n').some((l) => re.test(l));
/** Every degree figure a file states, `grep -o`-style, distinct, in numeric order: ['20°', '73.2 deg', …]. */
export function declaredTokens(src, units = ['°', 'deg', 'degrees']) {
  if (src == null) return [];
  const out = [];
  for (const line of src.split('\n'))
    for (const m of line.matchAll(/([0-9][0-9.]*)(°|\s+deg\b|\s+degrees\b)/g)) {
      const unit = m[2].trim();
      if (units.includes(unit)) out.push(unit === '°' ? `${m[1]}°` : `${m[1]} ${unit}`);
    }
  return uniq(out).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
}

// ── the pairings (§5 and §5.1) ────────────────────────────────────────────────────────────────
const circ = (a, b) => { const d = Math.abs(a - b) % 180; return Math.min(d, 180 - d); };
const pairKey = (s) => `${s.concept}@${s.master}`;
function splitStyles(rows) {
  const out = new Map(), fil = new Map();
  for (const s of rows) { const m = s.filled ? fil : out; if (!m.has(pairKey(s))) m.set(pairKey(s), []); m.get(pairKey(s)).push(s); }
  return { out, fil };
}
/**
 * angtab-build.mjs T7: each outline segment's partner is the filled segment (same concept and
 * master) of closest undirected angle among those within `window` of its length (ties: closer
 * length). Unrounded angles and lengths. Returns per (concept, master) the pairs and the worst.
 */
export function pairStyles(rows, { window = PAIR_WINDOW, inclusive = true } = {}) {
  const { out, fil } = splitStyles(rows);
  const results = [], onlyOut = [], onlyFil = [];
  for (const k of uniq([...out.keys(), ...fil.keys()])) {
    const O = out.get(k), F = fil.get(k);
    if (!O) { onlyFil.push(k); continue; }
    if (!F) { onlyOut.push(k); continue; }
    const [concept, master] = k.split('@');
    const per = O.map((o) => {
      const ol = o.raw.length;
      const cands = F.filter((x) => (inclusive ? Math.abs(x.raw.length - ol) <= window * ol + 1e-12 : Math.abs(x.raw.length - ol) < window * ol - 1e-12));
      if (!cands.length) return { o, f: null, d: null };
      let best = null;
      for (const x of cands) {
        const d = circ(o.raw.angle, x.raw.angle), dl = Math.abs(x.raw.length - ol);
        if (!best || d < best.d - 1e-12 || (Math.abs(d - best.d) <= 1e-12 && dl < best.dl)) best = { f: x, d, dl };
      }
      return { o, f: best.f, d: best.d };
    });
    const matched = per.filter((p) => p.f);
    results.push({ concept, master: Number(master), per, nMatched: matched.length,
                   worst: matched.length ? matched.reduce((a, b) => (b.d > a.d ? b : a)) : null });
  }
  return { results, onlyOut, onlyFil };
}
/** T7c-cap: the worst pair, counting only partners within `cap` degrees. */
export const worstWithin = (res, cap) => { const m = res.per.filter((p) => p.f && p.d <= cap); return m.length ? m.reduce((a, b) => (b.d > a.d ? b : a)) : null; };

/** angtab-build.mjs T7g: every chevron* (concept, master); each outline leg paired with the filled
 *  leg of closest undirected angle, no length window; fromHorizontal at 3 dp, unrounded. */
export function chevronLegs(rows) {
  const { out, fil } = splitStyles(rows);
  const concepts = uniq(rows.map((r) => r.concept)).filter((c) => c.startsWith('chevron')).sort();
  const lines = [];
  for (const c of concepts) for (const m of MASTERS) {
    const O = out.get(`${c}@${m}`) ?? [], F = fil.get(`${c}@${m}`) ?? [];
    const per = O.map((o) => {
      let best = null;
      for (const x of F) { const d = circ(o.raw.angle, x.raw.angle); if (!best || d < best.d) best = { f: x, d }; }
      return { o, f: best?.f ?? null, d: best?.d ?? null };
    });
    const paired = per.filter((p) => p.f);
    lines.push({ c, m, nO: O.length, nF: F.length,
      oFh: uniq(O.map((s) => fx(s.raw.fromHorizontal, 3))).join(' / '), fFh: uniq(F.map((s) => fx(s.raw.fromHorizontal, 3))).join(' / '),
      oL: uniq(O.map((s) => s.raw.length)), fL: uniq(F.map((s) => s.raw.length)),
      dd: uniq(paired.map((p) => fx(p.f.raw.fromHorizontal - p.o.raw.fromHorizontal, 3))).join(' / '),
      maxd: paired.length ? maxOf(paired.map((p) => p.d)) : null });
  }
  return lines.sort((a, b) => (b.maxd ?? -1) - (a.maxd ?? -1) || a.c.localeCompare(b.c) || b.m - a.m);
}

/** a6.mjs: the per-concept roll-up of every concept with a segment dev > 0.5. */
export function rollup(rows, src24) {
  const off = rows.filter((s) => s.dev > NEAR_MAX);
  return [...groupBy(off, (s) => s.concept)].map(([k, v]) => {
    const st = uniq(v.map((s) => (s.filled ? 'F' : 'O'))).sort().join('');
    return { k, n: v.length, maxDev: rnd(maxOf(v.map((s) => s.dev)), 2), maxOff: rnd(maxOf(v.map((s) => s.offset)), 3),
      m: uniq(v.map((s) => s.master)).sort((a, b) => b - a).join(' '),
      style: st === 'FO' ? 'both' : st === 'F' ? 'filled' : 'outline',
      kind: kindByTail(k), d: declares(src24(k)),
      ang: uniq(v.map((s) => rnd(s.fromHorizontal, 1))).sort((a, b) => a - b).join(' ') };
  }).sort((a, b) => b.maxDev - a.maxDev || a.k.localeCompare(b.k, 'en-US'));
}

/** §3.3: concepts whose every dev > 2 segment sits within `tol` of one of `targets`, reaching each. */
export function convention(rows, targets, tol = CONVENTION_TOL) {
  const near = (s) => targets.find((t) => Math.abs(s.fromHorizontal - t) <= tol);
  const by = groupBy(rows.filter((s) => s.dev > GIVE_MAX), (s) => s.concept);
  return [...by].filter(([, v]) => v.every((s) => near(s) !== undefined) && targets.every((t) => v.some((s) => near(s) === t)))
    .map(([c, v]) => ({ c, segs: v })).sort((a, b) => a.c.localeCompare(b.c));
}

/** How many segments sit within `tol` of one of `targets` (§3.3's "held to 0.08"). */
export const heldTo = (segs, targets, tol = HELD_TO) => segs.filter((s) => targets.some((t) => Math.abs(s.fromHorizontal - t) <= tol + 1e-9)).length;

/** §5.2: concepts whose off-axis (dev > 0.5) segments all sit in the filled file. */
export function filledOnly(rows) {
  const by = groupBy(rows.filter(isOff), (s) => s.concept);
  return [...by].filter(([, v]) => v.every((s) => s.filled)).map(([c]) => c).sort();
}

// ── loading the pin ────────────────────────────────────────────────────────────────────────────
/** Every straight segment in every drawing under `<pin>/src/icons`, split at MIN_LENGTH. */
export function load(pin) {
  const root = join(pin, 'src/icons');
  const rows = [], tiny = [], fileList = [], noSeg = [];
  for (const f of listIcons(root)) {
    const a = anglesOf(f, { tolerance: TOLERANCE, minLength: 1e-6 });
    fileList.push({ master: a.master, name: a.name });
    if (!a.segments.length) noSeg.push({ master: a.master, name: a.name });
    for (const s of a.segments) (s.length >= MIN_LENGTH ? rows : tiny).push(toRow(s));
  }
  const cache = new Map();
  const src24 = (concept) => {
    if (!cache.has(concept)) { const p = join(root, '24', `${concept}.svg`); cache.set(concept, existsSync(p) ? readFileSync(p, 'utf8') : null); }
    return cache.get(concept);
  };
  return { pin, root, rows, tiny, fileList, noSeg, src24 };
}

// ── sections ───────────────────────────────────────────────────────────────────────────────────
const fileOf = (r) => `${r.master}/${r.name}.svg`;
const mastersLine = (set) => MASTERS.map((m) => `${m}:${set.filter((s) => s.master === m).length}`).join(' · ');

function secHead(c) {
  const L = ['## §0 Header — what was read, the verification table, the coverage gap'];
  const concepts = uniq(c.fileList.map((x) => x.name.replace(/-filled$/, '')));
  L.push(`drawings ${num(c.fileList.length)} · concepts ${concepts.length} · straight segments ${num(c.rows.length)} (dump filter minLength ${MIN_LENGTH})`);
  L.push('', '| Claim | Instrument |', '|---|---|');
  const legs = chevronLegs(c.rows);
  const cd = MASTERS.map((m) => legs.find((x) => x.c === 'chevron-down' && x.m === m)).map((x) => (x ? `${x.oFh} / ${x.fFh}` : '-'));
  L.push(`| Classic \`chevron-down\` leg, outline vs filled | ${cd.join(' · ')} |`);
  const walls = c.rows.filter((r) => /^trash(-5)?$/.test(r.concept) && !r.filled && r.dev > ZERO).map((r) => 90 - r.raw.fromHorizontal);
  L.push(`| \`trash\` wall taper from vertical, outline | ${fx(minOf(walls), 3)} - ${fx(maxOf(walls), 3)} (${walls.length} segments) |`);
  const exact = (t) => c.rows.filter((s) => Math.abs(s.fromHorizontal - t) < 1e-6).length;
  const close = (t, raw) => minOf(c.rows.map((s) => Math.abs((raw ? s.raw.fromHorizontal : s.fromHorizontal) - t)));
  L.push(`| Segments at exactly 30 or 60 degrees | ${exact(30)} / ${exact(60)}; closest ${rnd(close(30, false), 5)} / ${rnd(close(60, false), 5)} (dump) · ${fx(close(30, true), 5)} / ${fx(close(60, true), 5)} (unrounded) |`);
  for (const n of ['trash', 'trash-5']) {
    const per = MASTERS.map((m) => c.rows.find((r) => r.concept === n && r.master === m && !r.filled && r.dev > ZERO)).map((r) => (r ? fx(90 - r.raw.fromHorizontal, 3) : '-'));
    L.push(`  \`${n}\` outline wall from vertical, 24 / 20 / 16: ${per.join(' / ')}`);
  }
  L.push('', `Coverage gap: ${c.noSeg.length} of ${num(c.fileList.length)} drawings have no straight segment at all — ` +
    MASTERS.map((m) => `${m}: ${c.noSeg.filter((x) => x.master === m && !/-filled$/.test(x.name)).length} outline + ${c.noSeg.filter((x) => x.master === m && /-filled$/.test(x.name)).length} filled`).join(' · '));
  const read = uniq(c.rows.map((r) => r.concept));
  L.push(`concepts with no reading on this axis: ${concepts.length - read.length} of ${concepts.length}`);
  const tinyOff = c.tiny.filter((r) => r.dev > NEAR_MAX);
  L.push(`segments the minLength ${MIN_LENGTH} filter drops: ${c.tiny.length}; with dev > ${NEAR_MAX}: ${tinyOff.length}` +
    (tinyOff.length ? ` (${tinyOff.map((r) => `${r.master}/${r.name}, dev ${fx(r.raw.dev, 1)}`).join('; ')})` : ''));
  return L;
}

function secTotals(c) {
  const R = c.rows, N = R.length, L = ['## §1 Totals', '', '| Split | segments | exactly on 0/45/90 | % |', '|---|---|---|---|'];
  const row = (label, s, onAxis = true) => L.push(`| ${label} | ${num(s.length)} | ${onAxis ? num(s.filter(isOn).length) : '—'} | ${onAxis ? pct(s.filter(isOn).length, s.length) : '—'} |`);
  row('All', R);
  for (const m of MASTERS) row(String(m), R.filter((r) => r.master === m));
  row('stroked paths', R.filter((r) => r.pstyle === 'stroke'), false);
  row('filled area paths', R.filter((r) => r.pstyle === 'area'), false);
  row('outline files', R.filter((r) => !r.filled), false);
  row('filled files', R.filter((r) => r.filled), false);
  L.push('', '### §1.1 Deviation histogram', '', '| dev (degrees) | segments | % | cumulative % |', '|---|---|---|---|');
  const h = new Array(BUCKET_LABELS.length).fill(0);
  for (const r of R) h[bucketOf(r.dev)]++;
  let cum = 0;
  BUCKET_LABELS.forEach((l, i) => { cum += h[i]; L.push(`| ${l} | ${num(h[i])} | ${pct(h[i], N)} | ${pct(cum, N)} |`); });
  L.push('', '### §1.2 Per master', '', '| master | mean dev, all | mean offset, all | segments with dev > 0 | mean dev of those | mean offset of those |', '|---|---|---|---|---|---|');
  for (const m of MASTERS) {
    const s = R.filter((r) => r.master === m), nz = s.filter((r) => r.dev > ZERO);
    L.push(`| ${m} | ${fx(mean(s.map((r) => r.dev)), 4)} | ${fx(mean(s.map((r) => r.offset)), 4)} | ${num(nz.length)} | ${fx(mean(nz.map((r) => r.dev)), 2)} | ${fx(mean(nz.map((r) => r.offset)), 4)} |`);
  }
  // a5.mjs, second loop: the legal band includes the on-axis segments (dev <= 0.5)
  const legal = Object.fromEntries(MASTERS.map((m) => { const s = R.filter((r) => r.master === m && r.dev <= NEAR_MAX); return [m, { dev: mean(s.map((r) => r.dev)), off: mean(s.map((r) => r.offset)) }]; }));
  L.push('', `legal band (dev <= ${NEAR_MAX}), 24 / 20 / 16: mean dev ${MASTERS.map((m) => fx(legal[m].dev, 5)).join(' / ')} · mean offset ${MASTERS.map((m) => fx(legal[m].off, 5)).join(' / ')}`);
  L.push(`16's legal-band ink drift against 24's: ${fx(rnd(legal[16].off, 5) / rnd(legal[24].off, 5), 2)}x on the 5 dp means (${fx(legal[16].off / legal[24].off, 2)}x unrounded)`);
  return L;
}

function secPopulations(c) {
  const R = c.rows, L = ['## §2 Three populations', '', '| Population | segments | concepts | masters | max offset | mean offset |', '|---|---|---|---|---|---|'];
  const P = { A: R.filter((r) => population(r) === 'A'), B: R.filter((r) => population(r) === 'B'), C: R.filter((r) => population(r) === 'C') };
  const label = { A: `A. Near-miss 0 < dev <= ${NEAR_MAX}`, B: `B. The 16 give ${NEAR_MAX} < dev <= ${GIVE_MAX}`, C: `C. Genuinely off axis dev > ${GIVE_MAX}` };
  for (const k of ['A', 'B', 'C']) {
    const p = P[k];   // a2.mjs: r(max, 3), r(mean, 4) on the dump's offsets
    L.push(`| ${label[k]} | ${num(p.length)} | ${uniq(p.map((s) => s.concept)).length} | ${mastersLine(p)} | ${rnd(maxOf(p.map((s) => s.offset)), 3)} | ${meanOffsetText(mean(p.map((s) => s.offset)))} |`);
  }
  L.push('', `A + B + C = ${num(P.A.length + P.B.length + P.C.length)} · B + C = ${num(P.B.length + P.C.length)}`);

  const A = P.A;
  L.push('', '### §2.1 Population A', '', '| Test | Result |', '|---|---|');
  L.push(`| Nearest legal angle | ${tally(A, (s) => s.nearest).map(([k, n]) => `${k}: ${n}`).join(' · ')} (of ${A.length}) |`);
  L.push(`| Run and rise both on this master's grid | ${A.filter(runRiseOnGrid).length} of ${A.length} |`);
  const ep = A.map(endpointsOnGrid);
  L.push(`| Endpoints on this master's grid | both ${ep.filter((x) => x === 2).length} · one ${ep.filter((x) => x === 1).length} · neither ${ep.filter((x) => x === 0).length} |`);
  const imb = A.map(imbalance);
  L.push(`| Run minus rise exactly 0.010 | ${imb.filter((x) => x === '0.010').length} of ${A.length} |`);
  L.push(`| Run minus rise 0.001-0.002 | ${imb.filter((x) => x === '0.001' || x === '0.002').length} of ${A.length} |`);
  const dp = (m, k) => A.filter((s) => s.master === m && decimalsNeeded(s) === k).length;
  L.push(`| Decimals needed to write the coordinates | 2 dp at 24: ${dp(24, 2)} of ${A.filter((s) => s.master === 24).length} · at 20: ${dp(20, 2)} of ${A.filter((s) => s.master === 20).length} (together ${dp(24, 2) + dp(20, 2)}) · at 16: 3 dp ${dp(16, 3)} of ${A.filter((s) => s.master === 16).length} |`);
  const topA = [...A].sort((a, b) => b.raw.offset - a.raw.offset || b.raw.dev - a.raw.dev)[0];
  L.push(`| Max offset | ${topA ? `${fx(topA.raw.offset, 3)} units (${fileOf(topA)})` : '-'} |`);

  const B = P.B;
  L.push('', '### §2.2 Population B', '');
  L.push(`at 16: ${B.filter((s) => s.master === 16).length} of ${B.length}; 16 outline: ${B.filter((s) => s.master === 16 && !s.filled).length}`);
  L.push(`by master and style: ${tally(B, (s) => `${s.master}${s.filled ? 'f' : 'o'}`).map(([k, n]) => `${k} ${n}`).join(' · ')}`);
  const bc = uniq(B.map((s) => s.concept)).sort();
  L.push(`concepts (${bc.length}): ${bc.join(' ')}`);
  L.push('', '| concept | max dev in B | segments in B | masters |', '|---|---|---|---|');
  const bRows = [...groupBy(B, (s) => s.concept)].map(([k, v]) => ({ k, d: maxOf(v.map((s) => s.dev)), n: v.length, m: uniq(v.map((s) => s.master)).join(' ') }))
    .sort((a, b) => b.d - a.d || a.k.localeCompare(b.k, 'en-US'));
  for (const x of bRows) L.push(`| \`${x.k}\` | ${fx(x.d, 2)} | ${x.n} | ${x.m} |`);
  const top = [...B].sort((a, b) => b.dev - a.dev)[0];
  L.push('', `largest dev in B: ${top ? `${fx(top.dev, 2)} (${uniq(B.filter((s) => fx(s.dev, 2) === fx(top.dev, 2)).map((s) => `${s.master}/${s.name}`)).join(', ')})` : '-'}`);
  L.push(`max offset in B: ${rnd(maxOf(B.map((s) => s.offset)), 3)} · at 16 only: ${rnd(maxOf(B.filter((s) => s.master === 16).map((s) => s.offset)), 3)}`);
  const wr = R.filter((s) => /^wrench(-[23])?$/.test(s.concept) && s.dev > NEAR_MAX);
  if (wr.length) L.push(`\`wrench\` / \`-2\` / \`-3\` taper (dev > ${NEAR_MAX}): ${rnd(minOf(wr.map((s) => s.dev)), 1)}-${rnd(maxOf(wr.map((s) => s.dev)), 1)} degrees at masters ${uniq(wr.map((s) => s.master)).join(' ')}`);

  // §2.3 — angtab-build.mjs T5a (token kind)
  L.push('', '### §2.3 By name kind', '', '| Kind | concepts with a straight segment | with any dev > 0.5 | % | segments off axis |', '|---|---|---|---|---|');
  const all = uniq(R.map((s) => s.concept)).sort(), offBy = groupBy(R.filter(isOff), (s) => s.concept);
  const line = (label, pred) => {
    const cs = all.filter((x) => pred(kindByToken(x))), off = cs.filter((x) => offBy.has(x));
    L.push(`| ${label} | ${cs.length} | ${off.length} | ${share(off.length, cs.length)} | ${num(sum(off.map((x) => offBy.get(x).length)))} |`);
  };
  line('bare default', (k) => k === 'bare'); line('`-small` / `-large` only', (k) => k === 'size');
  line('numbered', (k) => k === 'num'); line('numbered + size', (k) => k === 'num+size');
  line('numbered in total', (k) => k.startsWith('num')); line('not numbered', (k) => !k.startsWith('num'));
  line('all', () => true);
  const over2 = groupBy(R.filter((s) => s.dev > GIVE_MAX), (s) => s.concept);
  L.push('', `bare defaults more than ${GIVE_MAX} off: ${[...over2.keys()].filter((k) => !isVariant(k)).length} (a4's test: no number at the end) · ${[...over2.keys()].filter((k) => kindByToken(k) === 'bare').length} (token kind)`);
  return L;
}

function secRecurring(c) {
  const p3 = c.rows.filter((s) => s.dev > GIVE_MAX);
  const L = [`## §3.1 Recurring off-axis angles (dev > ${GIVE_MAX}), by fromHorizontal at 1 dp — the ${RECURRING_ROWS} commonest`, '', '| angle | segments | concepts |', '|---|---|---|'];
  for (const [a, n] of tally(p3, (s) => rnd(s.fromHorizontal, 1)).slice(0, RECURRING_ROWS)) {
    const cs = uniq(p3.filter((s) => rnd(s.fromHorizontal, 1) === a).map((s) => s.concept)).sort();
    L.push(`| ${a} | ${n} | ${cs.length} — ${cs.map((x) => `\`${x}\``).join(' ')} |`);
  }
  return L;
}

function secRatios(c) {
  const R = c.rows, L = ['## §3.2 Decision or accident — the run-over-rise test', '', "| Population | run and rise both on this master's grid |", '|---|---|'];
  const bands = [['dev == 0', isOn], [`0 < dev <= ${NEAR_MAX}`, isNear], [`${NEAR_MAX} < dev <= ${GIVE_MAX}`, (s) => s.dev > NEAR_MAX && s.dev <= GIVE_MAX], [`dev > ${GIVE_MAX}`, (s) => s.dev > GIVE_MAX]];
  for (const [l, p] of bands) {
    const g = R.filter(p), og = g.filter(runRiseOnGrid).length;
    L.push(`| ${l} (${num(g.length)}) | ${num(og)} (${rnd((100 * og) / g.length, 1)}%) |`);
  }
  const p3 = R.filter((s) => s.dev > GIVE_MAX).map((s) => ({ ...s, rr: smallRatio(s.dx, s.dy) }));
  const withR = p3.filter((s) => s.rr);
  L.push('', `dev > ${GIVE_MAX} on a small whole-number run:rise (p:q, p, q <= ${RATIO_MAX}): ${withR.length} of ${num(p3.length)} (${rnd((100 * withR.length) / p3.length, 1)}%); not on one: ${num(p3.length - withR.length)}`);
  L.push('', '| run : rise | from horizontal | segments | concepts |', '|---|---|---|---|');
  for (const [k, n] of tally(withR, (s) => s.rr)) {
    const [p, q] = k.split(':').map(Number);
    const cs = uniq(withR.filter((s) => s.rr === k).map((s) => s.concept)).sort();
    L.push(`| ${k} | ${rnd((Math.atan(q / p) * 180) / Math.PI, 2)} | ${n} | ${cs.map((x) => `\`${x}\``).join(' ')} |`);
  }
  L.push('');
  for (const n of ['thumbs-up', 'package-2']) L.push(`\`${n}\` declares: ${declaredTokens(c.src24(n)).join(' ') || '(none)'}`);
  return L;
}

function secConventions(c) {
  const R = c.rows, L = ['## §3.3 The 20 / 70 convention, 15 / 75 and 8.5 off upright'];
  const offsetTop = [...groupBy(R, (s) => s.concept)].map(([k, v]) => [k, maxOf(v.map((s) => s.offset))]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  for (const [title, targets] of CONVENTIONS) {
    const members = convention(R, targets);
    const segs = members.flatMap((x) => x.segs);
    const far = maxOf(segs.map((s) => minOf(targets.map((t) => Math.abs(s.fromHorizontal - t)))));
    const farAt = segs.filter((s) => fx(minOf(targets.map((t) => Math.abs(s.fromHorizontal - t))), 2) === fx(far, 2)).map((s) => `${s.master}/${s.concept}`);
    L.push('', `### ${title} — ${members.length} concepts, ${segs.length} segments off axis by more than ${GIVE_MAX}; farthest from the targets ${fx(far, 2)} (${uniq(farAt).join(', ')})`);
    L.push('', '| Concept | 24 | 20 | 16 | run x rise (a3) | segments | max offset | declares |', '|---|---|---|---|---|---|---|---|');
    for (const { c: k, segs: v } of members) {
      const at = (m) => uniq(v.filter((s) => s.master === m).map((s) => fx(s.fromHorizontal, 2))).join(' / ') || '-';
      const rr = MASTERS.map((m) => `${m}: ${uniq(v.filter((s) => s.master === m).map(rrRound)).join(' ')}`).join(' · ');
      L.push(`| \`${k}\` | ${at(24)} | ${at(20)} | ${at(16)} | ${rr} | ${v.length} | ${rnd(maxOf(v.map((s) => s.offset)), 3)} | ${declaredTokens(c.src24(k)).join(' ') || '**none**'} |`);
    }
    if (targets.length === 1) {
      const fv = segs.map((s) => 90 - s.fromHorizontal);
      L.push('', `fromHorizontal ${fx(minOf(segs.map((s) => s.fromHorizontal)), 1)}-${fx(maxOf(segs.map((s) => s.fromHorizontal)), 1)}, i.e. ${fx(minOf(fv), 1)}-${fx(maxOf(fv), 1)} from the vertical; ` +
        `segments off by more than ${NEAR_MAX} per concept: ${members.map((x) => `${x.c} ${R.filter((s) => s.concept === x.c && s.dev > NEAR_MAX).length}`).join(' · ')}`);
    } else {
      L.push('', `fromHorizontal range over the members: ${targets.map((t) => { const s = segs.filter((x) => Math.abs(x.fromHorizontal - t) <= CONVENTION_TOL).map((x) => x.fromHorizontal); return `${fx(minOf(s), 1)}-${fx(maxOf(s), 1)}`; }).join(' and ')}`);
      L.push(`segments within ${HELD_TO} of a target: ${heldTo(segs, targets)} of ${segs.length}`);
    }
  }
  L.push('', `largest max offset in the set: ${offsetTop.slice(0, 3).map(([k, v]) => `\`${k}\` ${rnd(v, 2)}`).join(' · ')}`);
  return L;
}

function secThirty(c) {
  const R = c.rows, L = ['## §3.4 30 and 60 degrees', '', '| | Result |', '|---|---|'];
  const exact = (t) => R.filter((s) => Math.abs(s.fromHorizontal - t) < 1e-6).length;
  L.push(`| Segments exactly at 30.000 | ${exact(30)} of ${num(R.length)} |`, `| Segments exactly at 60.000 | ${exact(60)} of ${num(R.length)} |`);
  const close = (t) => minOf(R.map((s) => Math.abs(s.fromHorizontal - t)));
  L.push(`| Closest any segment gets to 30 | ${rnd(close(30), 5)} degrees off |`, `| Closest any segment gets to 60 | ${rnd(close(60), 5)} degrees off |`);
  const w30 = (s) => Math.abs(s.fromHorizontal - 30) <= WINDOW_3060, w60 = (s) => Math.abs(s.fromHorizontal - 60) <= WINDOW_3060;
  const W = R.filter((s) => w30(s) || w60(s));
  const wc = uniq(W.map((s) => s.concept)).sort();
  L.push(`| Segments within ${WINDOW_3060} of 30 or 60 | ${W.length}, in ${wc.length} concepts (${R.filter(w30).length} near 30, ${R.filter(w60).length} near 60); by master ${MASTERS.map((m) => W.filter((s) => s.master === m).length).join(' / ')} |`);
  const bare = wc.filter((x) => kindByToken(x) === 'bare');
  L.push(`| Of those ${wc.length} concepts, bare defaults | ${bare.length} — ${bare.map((x) => `\`${x}\``).join(' ')} |`);
  L.push('', '| concept | near 30 | near 60 | fromHorizontal (2 dp) | run : rise of those |', '|---|---|---|---|---|');
  for (const x of wc) {
    const v = W.filter((s) => s.concept === x);
    L.push(`| \`${x}\` | ${v.filter(w30).length} | ${v.filter(w60).length} | ${uniq(v.map((s) => s.fromHorizontal.toFixed(2))).sort((a, b) => a - b).join(' ')} | ${uniq(v.map((s) => smallRatio(s.dx, s.dy) ?? 'none')).join(' ')} |`);
  }
  return L;
}

function secExceptions(c) {
  const R = c.rows, L = ['## §4 The licensed exceptions, verified'];
  const tr = R.filter((r) => /^trash(-5)?$/.test(r.concept) && r.dev > ZERO);
  const fv = (r) => 90 - r.raw.fromHorizontal;
  const o = tr.filter((r) => !r.filled), f = tr.filter((r) => r.filled);
  L.push('', `trash / trash-5 outline walls: ${o.length} segments, ${fx(minOf(o.map(fv)), 3)} - ${fx(maxOf(o.map(fv)), 3)} from vertical; round to ${C22_TAPER}: ${o.filter((r) => Math.round(fv(r)) === C22_TAPER).length} of ${o.length}`);
  for (const n of ['trash', 'trash-5'])
    L.push(`  \`${n}\` outline 24 / 20 / 16: ${MASTERS.map((m) => fx(fv(o.find((r) => r.concept === n && r.master === m)), 3)).join(' / ')}`);
  L.push(`trash / trash-5 filled walls: ${f.length} segments, ${fx(minOf(f.map(fv)), 4)} - ${fx(maxOf(f.map(fv)), 4)}; round to ${C22_TAPER}: ${f.filter((r) => Math.round(fv(r)) === C22_TAPER).length} of ${f.length}`);
  const worst = [...f].sort((a, b) => fv(b) - fv(a))[0];
  L.push(`  steepest filled wall: ${fileOf(worst)} ${fx(fv(worst), 4)} (run x rise ${rrFixed(worst).replace('x', ' x ')}), ${fx(fv(worst) - C22_TAPER, 2)} past ${C22_TAPER}`);
  const notFour = uniq(f.filter((r) => Math.round(fv(r)) !== C22_TAPER).map(fileOf));
  L.push(`  filled files whose walls do not round to ${C22_TAPER}: ${notFour.length} of ${uniq(f.map(fileOf)).length} (${notFour.join(', ')})`);
  L.push('', '| `code` slash | 24 | 20 | 16 | run x rise | matches C30 (2 dp / run x rise) |', '|---|---|---|---|---|---|');
  const cd = R.filter((r) => r.concept === 'code' && r.dev > ZERO);
  const slash = (m, filled) => cd.find((r) => r.master === m && r.filled === filled);
  for (const filled of [false, true]) {
    const s = MASTERS.map((m) => slash(m, filled));
    const okFh = s.filter((r) => Number(r.raw.fromHorizontal.toFixed(2)) === C30_STATED[r.master].fh).length;
    const okRr = s.filter((r) => rrFixed(r) === C30_STATED[r.master].rr).length;
    L.push(`| ${filled ? 'filled' : 'outline'} | ${s.map((r) => fx(r.raw.fromHorizontal, 4)).join(' | ')} | ${s.map(rrFixed).join(' / ')} | ${okFh} of 3 / ${okRr} of 3 |`);
  }
  L.push(`filled minus outline, 24 / 20 / 16: ${MASTERS.map((m) => fx(slash(m, true).raw.fromHorizontal - slash(m, false).raw.fromHorizontal, 2)).join(' / ')}`);
  return L;
}

function secPairs(c) {
  const { results, onlyFil } = pairStyles(c.rows);
  const per = results.flatMap((r) => r.per), matched = per.filter((p) => p.f);
  const L = ['## §5 Outline against filled', ''];
  L.push(`(concept, master) pairs compared: ${num(results.length)} across ${uniq(results.map((r) => r.concept)).length} concepts (filled-only, nothing to compare: ${onlyFil.length})`);
  L.push(`outline segments: ${num(per.length)} of ${num(c.rows.filter((r) => !r.filled).length)}; found a partner ${num(matched.length)}; did not ${num(per.length - matched.length)}`);
  const at = (t) => matched.filter((p) => p.d > t - 0.001 && p.d <= t + 0.001).length;
  L.push(`spurious partners at exactly 90 and 45 (±0.001): ${at(90)} and ${at(45)}`);
  L.push('', `| worst difference exceeds | pairs (concepts), literal | pairs (concepts), partners within ${PAIR_CAP} deg |`, '|---|---|---|');
  const cell = (t, cap) => { const s = results.filter((r) => { const w = worstWithin(r, cap); return w && w.d > t; }); return `${s.length} (${uniq(s.map((r) => r.concept)).length})`; };
  for (const t of THRESHOLDS) L.push(`| ${t} degrees | ${cell(t, Infinity)} | ${cell(t, PAIR_CAP)} |`);
  return L;
}

function secChevrons(c, flags) {
  const lines = chevronLegs(c.rows), L = ['## §5.1 The chevron family'];
  const n = (t) => lines.filter((x) => x.maxd !== null && x.maxd > t).length;
  L.push('', `${lines.length} rows (${uniq(lines.map((x) => x.c)).length} chevron concepts x ${MASTERS.length} masters). Rows whose worst leg difference exceeds ${THRESHOLDS.join(' / ')} degrees: ${THRESHOLDS.map(n).join(' / ')}`);
  L.push('', '| Concept | master | outline leg | filled leg | difference | filled - outline, per leg |', '|---|---|---|---|---|---|');
  const show = flags.full ? lines : lines.filter((x) => (x.maxd ?? 0) > 1 || x.c === 'chevron-down');
  for (const x of show) L.push(`| \`${x.c}\` | ${x.m} | ${x.oFh} | ${x.fFh} | ${x.maxd === null ? '-' : fx(x.maxd, 3)} | ${x.dd} |`);
  const flat = lines.filter((x) => /^chevron-(down|up|left|right)-2(-small|-large)?$/.test(x.c));
  L.push('', `flat chevron (\`chevron-*-2\`, with -small / -large), worst difference 24 / 20 / 16: ${MASTERS.map((m) => fx(maxOf(flat.filter((x) => x.m === m).map((x) => x.maxd)), 3)).join(' / ')}`);
  L.push(`\`chevron-down-2-small\` declares: ${declaredTokens(c.src24('chevron-down-2-small')).join(' ')}`);
  return L;
}

function secSearch(c) {
  const R = c.rows, fo = filledOnly(R);
  const L = ['## §5.2 Filled-only off axis', '', `concepts off axis (dev > ${NEAR_MAX}) in the filled file only, set-wide: ${fo.length} — ${fo.map((x) => `\`${x}\``).join(' ')}`,
    '', '| concept | outline: off > 0.5 | filled: off > 0.5 | filled max dev | filled max offset |', '|---|---|---|---|---|'];
  for (const k of fo) {
    const o = R.filter((s) => s.concept === k && !s.filled && isOff(s)), f = R.filter((s) => s.concept === k && s.filled && isOff(s));
    L.push(`| \`${k}\` | ${o.length} | ${f.length} | ${rnd(maxOf(f.map((s) => s.dev)), 2)} | ${rnd(maxOf(f.map((s) => s.offset)), 3)} |`);
  }
  L.push('', '24 source, every straight segment of length >= 1:');
  for (const name of ['search', 'search-filled'])
    for (const s of R.filter((r) => r.master === 24 && r.name === name && r.raw.length >= 1))
      L.push(`  ${name}: ${s.from.join(',')} -> ${s.to.join(',')}  dx ${fx(Math.abs(s.raw.dx), 2)} dy ${fx(Math.abs(s.raw.dy), 2)}  ${fx(s.raw.fromHorizontal, 2)} degrees from horizontal, ${fx(Math.abs(s.raw.fromHorizontal - 45), 2)} from 45`);
  return L;
}

function secDeclared(c) {
  const R = c.rows, L = ['## §6 Declared against silent', ''];
  const p3 = R.filter((s) => s.dev > GIVE_MAX), cs = uniq(p3.map((s) => s.concept)).sort();
  const d = cs.map((k) => declares(c.src24(k)));
  L.push(`concepts off axis by more than ${GIVE_MAX}: ${cs.length}; the 24 outline file states a degree figure: ${d.filter((x) => x === true).length} · states none: ${d.filter((x) => x === false).length} · no 24 file: ${d.filter((x) => x === null).length}`);
  const outl = c.fileList.filter((x) => x.master === 24 && !/-filled$/.test(x.name)).map((x) => x.name);
  const count = (re) => outl.filter((n) => grepL(c.src24(n), re)).length;
  L.push(`set-wide, 24 outline files stating a degree figure (any of three spellings): ${count(GREP.any)} of ${outl.length}`);
  L.push(`by spelling: "63.43°" ${count(GREP.sign)} · "4 degrees" ${count(GREP.degrees)} · "73.2 deg" ${count(GREP.deg)}`);
  L.push(`(the first, two-spelling count — "°" or " degrees" — ${count(GREP.first)})`);
  L.push(`(a4's whole-file test over all ${outl.length}: ${outl.filter((n) => declares(c.src24(n))).length})`);
  const many = outl.map((n) => [n, declaredTokens(c.src24(n), ['°'])]).filter(([, t]) => t.length >= 6).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  L.push('', 'files stating six or more distinct "°" figures:');
  for (const [n, t] of many) L.push(`  \`${n}\` ${t.length}: ${t.join(' ')}`);
  return L;
}

/** a4.mjs's rows: every concept with a segment dev > 2. */
function offAxisRows(c) {
  const p3 = c.rows.filter((s) => s.dev > GIVE_MAX);
  return uniq(p3.map((s) => s.concept)).sort().map((k) => {
    const v = p3.filter((s) => s.concept === k);
    const st = uniq(v.map((s) => (s.filled ? 'F' : 'O'))).sort().join('');
    return { k, decl: declares(c.src24(k)), variant: isVariant(k), n: v.length, style: st === 'FO' ? 'both' : st === 'F' ? 'filled only' : 'outline only',
      maxDev: rnd(maxOf(v.map((s) => s.dev)), 2), maxOff: rnd(maxOf(v.map((s) => s.offset)), 3) };
  });
}

function secSilent(c) {
  const rows = offAxisRows(c).filter((x) => x.decl === false).sort((a, b) => b.maxDev - a.maxDev);
  const L = [`## §6.1 Off axis by more than ${GIVE_MAX} degrees and silent — ${rows.length} concepts`, '', '| Concept | max dev | max offset | n | kind | style | base declares |', '|---|---|---|---|---|---|---|'];
  for (const x of rows) {
    const base = x.k.replace(/-\d+(?=(-small|-large)?$)/, '');
    const bt = base !== x.k ? declaredTokens(c.src24(base)) : [];
    L.push(`| \`${x.k}\` | ${x.maxDev} | ${x.maxOff} | ${x.n} | ${x.variant ? 'variant' : 'DEFAULT'} | ${x.style} | ${base !== x.k ? `\`${base}\`: ${bt.join(' ') || 'none'}` : ''} |`);
  }
  return L;
}

function secBareDefaults(c) {
  const rows = offAxisRows(c).filter((x) => !x.variant).sort((a, b) => b.maxOff - a.maxOff);
  const L = [`## §6.2 The ${rows.length} bare defaults more than ${GIVE_MAX} degrees off axis, by ink drift`, '', '| Concept | max dev | max offset (px at its master) | declares? |', '|---|---|---|---|'];
  // The document wrote 2 dp by rounding a4.mjs's printed values (dev 2 dp, offset 3 dp) half up: 2.355 → 2.36.
  const half2 = (v3) => fx(Math.round(v3 * 100 + 1e-6) / 100, 2);
  for (const x of rows) L.push(`| \`${x.k}\` | ${fx(x.maxDev, 2)} | ${half2(x.maxOff)} | ${x.decl ? `yes (${declaredTokens(c.src24(x.k)).join(' ')})` : '**no**'} |`);
  return L;
}

function secRollup(c) {
  const rows = rollup(c.rows, c.src24);
  const L = [`## §6a The full roll-up — every concept with a segment more than ${NEAR_MAX} degrees off axis`, '', `${rows.length} concepts.`, ''];
  L.push('| concept | max dev | max offset | n | masters | style | kind | declares? | distinct fromHorizontal |', '|---|---|---|---|---|---|---|---|---|');
  for (const x of rows) L.push(`| \`${x.k}\` | ${x.maxDev} | ${x.maxOff} | ${x.n} | ${x.m} | ${x.style} | ${x.kind} | ${x.d ? 'yes' : '**no**'} | ${x.ang} |`);
  return L;
}

function secJudged(c) {
  const R = c.rows, L = ['## §7 Figures new in the judged list'];
  const p3 = R.filter((s) => s.dev > GIVE_MAX);
  const bin = (a) => p3.filter((s) => rnd(s.fromHorizontal, 1) === a).length;
  const seven = convention(R, [20, 70]), sevenSegs = seven.flatMap((x) => x.segs), inSeven = (s) => seven.some((x) => x.c === s.concept);
  L.push('', `A-1: the ${seven.length} 20/70 concepts' segments off axis by more than ${GIVE_MAX}: ${sevenSegs.length}; of those in §3.1's 20 and 70 bins: ${p3.filter((s) => inSeven(s) && [20, 70].includes(rnd(s.fromHorizontal, 1))).length}; within ${HELD_TO} of 20 or 70: ${heldTo(sevenSegs, [20, 70])}`);
  L.push(`A-1: the 20 and 70 bins over all concepts: ${bin(20)} + ${bin(70)} = ${bin(20) + bin(70)} (other concepts in them: ${uniq(p3.filter((s) => [20, 70].includes(rnd(s.fromHorizontal, 1)) && !inSeven(s)).map((s) => s.concept)).join(' ') || 'none'})`);
  const legs = chevronLegs(R).find((x) => x.c === 'chevron-down' && x.m === 16 && x.maxd !== null);
  if (legs) L.push(`A-3: classic chevron-down at 16, ${fx(legs.maxd, 3)} degrees apart; over the outline leg (${fx(legs.oL[0], 3)}) that moves the end ${fx(legs.oL[0] * Math.sin((legs.maxd * Math.PI) / 180), 3)}, over the filled leg (${fx(legs.fL[0], 3)}) ${fx(legs.fL[0] * Math.sin((legs.maxd * Math.PI) / 180), 3)}`);
  const t5 = R.find((r) => r.master === 20 && r.name === 'trash-5-filled' && r.dev > ZERO);
  if (t5) {
    const ex = 90 - t5.raw.fromHorizontal - C22_TAPER;
    L.push(`A-5: trash-5-filled at 20: ${fx(90 - t5.raw.fromHorizontal, 3)} degrees, ${fx(ex, 2)} past ${C22_TAPER}; over its ${fx(t5.raw.length, 3)}-unit wall that moves the end ${fx(t5.raw.length * Math.sin((ex * Math.PI) / 180), 3)}`);
  }
  const outl = c.fileList.filter((x) => x.master === 24 && !/-filled$/.test(x.name)).map((x) => x.name);
  L.push(`A-14: concepts declaring a degree figure: ${outl.filter((n) => grepL(c.src24(n), GREP.first)).length} by the first two-spelling grep, ${outl.filter((n) => grepL(c.src24(n), GREP.any)).length} by all three spellings`);
  const it = R.filter((s) => s.concept === 'italic' && isOff(s));
  if (it.length) L.push(`A-16: \`italic\` leans ${uniq(it.map((s) => rnd(s.fromHorizontal, 1))).sort((a, b) => a - b).join(' ')} (fromHorizontal, 1 dp), max offset ${rnd(maxOf(it.map((s) => s.offset)), 2)}; declares ${declaredTokens(c.src24('italic')).join(' ')}`);
  const drift = [...groupBy(R, (s) => s.concept)].map(([k, v]) => [k, rnd(maxOf(v.map((s) => s.offset)), 3)]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const rankOf = (list) => 1 + list.findIndex(([k]) => k === 'italic');
  if (rankOf(drift)) L.push(`A-16: \`italic\`'s max offset ranks ${rankOf(drift)} of ${drift.length} concepts (${drift.slice(0, rankOf(drift)).map(([k, v]) => `${k} ${v}`).join(', ')}); ` +
    `${rankOf(drift.filter(([k]) => !isVariant(k)))} among the bare defaults; ${1 + uniq(drift.map(([, v]) => v)).indexOf(drift[rankOf(drift) - 1][1])} by distinct value`);
  const nz = R.filter((s) => !isOn(s)).length;
  L.push(`A-17: on axis ${pct(R.filter(isOn).length, R.length)}, off ${pct(nz, R.length)}; dev > ${GIVE_MAX}: ${num(p3.length)} = ${pct(p3.length, nz)} of the ${num(nz)} off axis (${pct(p3.length, R.filter(isOff).length)} of the ${num(R.filter(isOff).length)} beyond ${NEAR_MAX})`);
  const rat = p3.filter((s) => smallRatio(s.dx, s.dy)).length;
  L.push(`A-18: ${rat} of ${num(p3.length)} on a small whole-number run:rise (${rnd((100 * rat) / p3.length, 1)}%); ${num(p3.length - rat)} not`);
  for (const n of ['play', 'play-2', 'play-3']) {
    const t = declaredTokens(c.src24(n), ['°']).map(parseFloat);
    L.push(`A-19: \`${n}\` declares ${t.join(' ')} (${t.length ? `${fx(minOf(t), 1)}-${fx(maxOf(t), 1)}` : 'none'})`);
  }
  const roll = rollup(R, c.src24);
  for (const n of ['megaphone', 'megaphone-2', 'megaphone-3']) L.push(`A-19: \`${n}\` measures ${roll.find((x) => x.k === n)?.ang ?? '-'}`);
  const sp = ['sparkle', 'sparkle-2', 'sparkle-3', 'sparkle-4'];
  L.push(`A-20: declared ${sp.map((n) => `\`${n}\` ${declaredTokens(c.src24(n), ['°']).join(' ')}`).join(' · ')}`);
  const spr = uniq(p3.filter((s) => sp.includes(s.concept)).map((s) => smallRatio(s.dx, s.dy)).filter(Boolean)).sort();
  L.push(`A-20: distinct small run:rise ratios among their dev > ${GIVE_MAX} segments: ${spr.length} (${spr.join(' ')})`);
  const mo = (m) => mean(R.filter((s) => s.master === m).map((s) => s.offset));
  L.push(`A-21: mean offset over all segments, 24 vs 16: ${fx(mo(24), 3)} vs ${fx(mo(16), 3)}`);
  return L;
}

function secNotReproduced(c) {
  const R = c.rows, L = ['## §9 Wave-0 figures this card could not reproduce'];
  L.push('', `segments with 0.001 < dev <= 0.5: ${R.filter((s) => s.dev > 0.001 && s.dev <= NEAR_MAX).length}; with 0 < dev <= 0.5: ${R.filter(isNear).length} ` +
    `(= ${num(R.length)} - ${num(R.filter(isOn).length)} - ${num(R.filter(isOff).length)}); the wave-0 figure was 851`);
  L.push('', 'mean dev per master, by band (the wave-0 figure was 0.068 at 16 against 0.049 at 24):', '', '| band | 24 | 20 | 16 |', '|---|---|---|---|');
  const bands = [['all segments', () => true], [`dev <= ${NEAR_MAX}`, (s) => s.dev <= NEAR_MAX], [`0 < dev <= ${NEAR_MAX}`, isNear], ['dev > 0', (s) => !isOn(s)], [`dev > ${NEAR_MAX}`, isOff]];
  for (const [l, p] of bands) L.push(`| ${l} | ${MASTERS.map((m) => fx(mean(R.filter((s) => s.master === m && p(s)).map((s) => s.dev)), 4)).join(' | ')} |`);
  return L;
}

export const SECTIONS = {
  head: secHead, s1: secTotals, s2: secPopulations, 's3.1': secRecurring, 's3.2': secRatios, 's3.3': secConventions,
  's3.4': secThirty, s4: secExceptions, s5: secPairs, 's5.1': secChevrons, 's5.2': secSearch, s6: secDeclared,
  's6.1': secSilent, 's6.2': secBareDefaults, s6a: secRollup, s7: secJudged, s9: secNotReproduced,
};

/** Run the named sections against a loaded pin; returns the printed text. */
export function report(ctx, sections = Object.keys(SECTIONS), flags = {}) {
  return sections.map((s) => SECTIONS[s](ctx, flags).join('\n')).join('\n\n');
}

function main(argv) {
  const usage = 'usage: node tools/audit/angles-probe.mjs <pin-dir> [section …] [--full]\n' +
    `sections: ${Object.keys(SECTIONS).join(' ')}`;
  const flags = { full: argv.includes('--full') };
  const pos = argv.filter((a) => !a.startsWith('--'));
  const pin = pos[0] ? resolve(pos[0]) : null;
  if (!pin || !existsSync(join(pin, 'src/icons/24'))) { console.error(usage); process.exit(2); }
  const wanted = pos.slice(1);
  const unknown = wanted.filter((s) => !(s in SECTIONS));
  if (unknown.length) { console.error(`unknown section: ${unknown.join(' ')}\n${usage}`); process.exit(2); }
  console.log(report(load(pin), wanted.length ? wanted : Object.keys(SECTIONS), flags));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2));
