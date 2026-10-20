#!/usr/bin/env node
// Every measured figure in docs/audit/findings-primitives.md (audit card 1.1, axes F4 closed
// vocabulary and F3 armature), printed again from the pinned drawings.
// AUDIT ONLY — imported by nothing; reads the pin, writes nothing.
//
// Usage:
//   P=<scratch>/pin; git archive 5933041 | tar -x -C $P
//   node tools/audit/primitives-probe.mjs $P [section …]
// No section = all. A section prints `## §<n> <title>` and then the figures in the document's
// order, rounding and units, so the output can be laid beside the document line against line.
// It reads only $P/src/icons/{24,20,16}/*.svg (no dist/, no research/references).
//
// Sections → the document section each backs. Run time on this machine: the whole run ~4 s; one
// section alone ~0.35 s (the load of the set, ~0.3 s, included) unless marked. Sections share one
// load and one cache, so a full run costs less than the sum.
//   s0     §0  the pin's counts; the lens correction to the circle-radius count
//   s1.1   §1.1 distinct parts per master and style, pooled, whole set, path level  (~1.5 s)
//   s1.2   §1.2 the sixteen largest whole-set classes  (~1.4 s)
//   s1.3   §1.3 shapes drawn at the same absolute size at more than one master
//   s1.4   §1.4 is 20 a master or a resize — part-by-part scale congruence  (~1.3 s)
//   s2.1   §2.1 the container ring
//   s2.2   §2.2 the rounded square
//   s2.3   §2.3 the dot: diameters, the 24 → 20 → 16 table, off-grid radii
//   s2.4   §2.4 plus and minus: spans, C8 step, the 18 bar comparisons
//   s2.5   §2.5 x and slash: spans, C8 step, slash pairs, `ban-3`'s note
//   s2.6   §2.6 the chevron: classes, the outline/filled table, chevrons-up-down
//   s2.7   §2.7 the arrowhead census, near-duplicate pairs, rotate-ccw
//   s2.8   §2.8 the badge: the two-object name census
//   s2.9   §2.9 bend radius across the set; bendMin's third case
//   s2.10  §2.10 C17 repeated elements: gap ÷ thickness
//   s3.1   §3.1 the shared container (the §2.1 comparisons, counted)
//   s3.2   §3.2 mark in the ring vs the free mark; check leg ratios
//   s3.3   §3.3 checkbox's check vs check-circle's
//   s3.4   §3.4 concepts with identical outline geometry at all three masters  (~0.6 s)
//   s4.1   §4.1 the folder
//   s4.2   §4.2 the document / page
//   s4.3   §4.3 the person: head ink diameters, shared heads
//   s4.4   §4.4 the arrow: classes, parts, doors
//   s5     §5  near misses with the band held at one share of canvas  (~1.8 s)
//   s6     §6  the judged list's figures (restated from the sections above)
//   s7     §7  the eye questions' figures
//   s8     §8  the linter checks' counts, incl. a set-wide shared-part persistence census  (~1.1 s)
//
// Instruments: tools/audit/congruence.mjs (canonical, subpathsOfPath, classify,
// congruentUpToTranslation, congruentUpToScale, prepare, scaleTrivial), tools/geometry.mjs
// (bbox) and tools/masters.mjs (STROKES, FILLED_WEIGHT, gridOf) — the repo's copies. Both have
// gained code since the pin, but bbox, parsePath (through congruence.mjs) and these three values
// are unchanged (checked 2026-10-20 against the pin's own copies: identical output on all 2,910 pin drawings, values deep-equal).
// None is modified. The part classifier below is the card's own (its scratch `parts.mjs`),
// folded in: a subpath is a circle, lens, line, polyline, bend (L A L), arc, rrect-ish
// (closed, one arc radius) or other, measured on its canonical spelling.
//
// Known instrument defects, and how this probe works around them (plans/set-and-rules-audit.md,
// "Known instrument defects"):
//   · congruence.mjs `congruentUpToTranslation` / `congruentUpToScale` report "different segment
//     structure" for one ring traversed the other way round. Every PAIRWISE comparison here goes
//     through `comparePart`, which compares the two paths as written AND in their canonical
//     spelling (`canonical(d).d`, blind to direction and start) and keeps the better. Where that
//     changes a count against the card's raw call, the section prints both (s1.4 does).
//     `classify` and `canonical().shape` are sound and are used as they are.
//   · `congruence.mjs` `ring` calls a closed run of equal-radius arcs a ring, so a two-arc lens
//     reads as a circle. The card's correction is kept: a circle must also have a box of 2r
//     (±0.011); otherwise it is a lens (s0).
//   · `classify`'s `near` band is in drawing units, so a fixed band is 1.5× wider at 16 than at
//     24 as a share of canvas. s5 scales it by master / 24, as the card did; it also prints the
//     fixed-band counts wave 0 quoted.
//   · `geometry.mjs` `bbox` samples arcs (≤ 0.0056 inside the true edge). The card measured
//     every box with it, so this probe does too. Of 8,305 subpaths, 134 have a 3-dp width or height
//     that differs from metrics-check's solved box; that touches one printed size (§1.3's
//     6.542 × 4.67, solved 6.543) and no document figure (review, card "reprint").
// Formatting: every printed decimal goes through `hu` (half-up on the decimal value), so a value
// such as 10.28 / 16 = 0.6425 prints 0.643 as the document rounds it, not toFixed's 0.642.
// Hand-chosen families (PAGE, ARROW, PERSON_RE, RING_PAIRS, CHEV, DOC_ROWS, the §2.8 regex) are the
// card's own choices; their sizes print as "(as the card chose)".
// The raster defects (raster.mjs classify, pixelgrid blurScore/diagonalShare) do not touch this
// card: it never rasterises.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  canonical, subpathsOfPath, classify, congruentUpToTranslation, congruentUpToScale,
  prepare, scaleTrivial, NEAR,
} from './congruence.mjs';
import { bbox } from '../geometry.mjs';
import { STROKES, FILLED_WEIGHT, gridOf } from '../masters.mjs';

export const MASTERS = [24, 20, 16];
export const STYLES = ['outline', 'filled'];

// ── numbers ────────────────────────────────────────────────────────────────
/** Half-up rounding of the DECIMAL value: `toFixed` rounds the binary float, so 10.28 / 16 = 0.6425
 *  prints 0.642 with it and 0.643 here, as the document (and r3) round it. */
export const hu = (n, d) => {
  if (!Number.isFinite(n)) return String(n);
  const v = Math.round(Number((Math.abs(n) * 10 ** d).toPrecision(12))) / 10 ** d;
  return (n < 0 && v !== 0 ? '-' : '') + v.toFixed(d);
};
export const r3 = (n) => Math.round(n * 1000) / 1000;
/** At least one decimal, as the document writes a radius: 2 → "2.0", 2.5 → "2.5", 2.125 → "2.125". */
export const oneDp = (n) => (Number.isInteger(n) ? hu(n, 1) : String(n));
/** The chevron table's filled radius: 2 dp, or 1 dp on a half unit (1.30, 1.97, 2.5, 2.0). */
export const chevR = (n) => (Number.isInteger(n * 2) ? hu(n, 1) : hu(n, 2));
export const r2 = (n) => Math.round(n * 100) / 100;
const fx = (n, d) => (Number.isFinite(n) ? hu(n, d) : '∞');
const comma = (n) => n.toLocaleString('en-US');
const pct = (a, b, d = 1) => `${hu((100 * a / b), d)}%`;
const px16 = (u, m) => u * 16 / m;             // a distance in units of master m, in px at a 16 px render
const uniq = (a) => [...new Set(a)];
const byNum = (a, b) => a - b;

// ── 1. loading the set ─────────────────────────────────────────────────────

function parsePaths(src) {
  const out = [];
  const re = /<path\b([^>]*?)\/>/gs;
  let m;
  while ((m = re.exec(src))) {
    const a = m[1];
    const d = /\bd="([^"]*)"/.exec(a);
    if (!d) continue;
    out.push({
      d: d[1].trim(),
      fill: /\bfill="([^"]*)"/.exec(a)?.[1] ?? null,
      fillRule: /\bfill-rule="([^"]*)"/.exec(a)?.[1] ?? null,
      strokeAttr: /\bstroke="([^"]*)"/.exec(a)?.[1] ?? null,
    });
  }
  return out;
}

/** One record per SVG: master, style, concept, the root stroke-width, notes, paths. */
export function loadSet(pin) {
  const files = [];
  for (const master of MASTERS) {
    const dir = join(pin, 'src/icons', String(master));
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()) {
      const src = readFileSync(join(dir, name), 'utf8');
      const base = name.replace(/\.svg$/, '');
      const filled = base.endsWith('-filled');
      files.push({
        file: `${master}/${name}`, base, master, src,
        concept: filled ? base.slice(0, -'-filled'.length) : base,
        style: filled ? 'filled' : 'outline',
        sw: Number(/<svg[^>]*\bstroke-width="([^"]*)"/.exec(src)?.[1]),
        notes: [...src.matchAll(/<!--\s*(.*?)\s*-->/gs)].map((x) => x[1]),
        paths: parsePaths(src),
      });
    }
  }
  return files;
}

/** A filled shape path: painted, not stroked. Stroked paths carry neither attribute. */
export const isShapeFill = (p) => p.fill === 'currentColor' && p.strokeAttr === 'none';

// ── 2. the part classifier (the card's parts.mjs) ──────────────────────────

/** The segments of one canonical subpath `d` (canonical emits absolute M/L/A/C/Q/Z only). */
function segsOf(d) {
  const toks = d.match(/[MLACQZ][^MLACQZ]*/g) || [];
  const segs = [];
  let cur = null;
  for (const t of toks) {
    const cmd = t[0];
    const ns = (t.slice(1).match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
    if (cmd === 'M') { cur = [ns[0], ns[1]]; segs.push({ cmd, to: cur }); }
    else if (cmd === 'L') { segs.push({ cmd, from: cur, to: [ns[0], ns[1]] }); cur = [ns[0], ns[1]]; }
    else if (cmd === 'A') { segs.push({ cmd, from: cur, rx: ns[0], ry: ns[1], to: [ns[5], ns[6]] }); cur = [ns[5], ns[6]]; }
    else if (cmd === 'C') { segs.push({ cmd, from: cur, to: [ns[4], ns[5]] }); cur = [ns[4], ns[5]]; }
    else if (cmd === 'Q') { segs.push({ cmd, from: cur, to: [ns[2], ns[3]] }); cur = [ns[2], ns[3]]; }
    else if (cmd === 'Z') segs.push({ cmd });
  }
  return segs;
}

/** A line's direction folded to [0°, 180°): a line has no direction. */
export const lineAngle = (a, b) => {
  const t = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  return r3(((t % 180) + 180) % 180);
};
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/**
 * What one subpath is, and its parameters.
 *   circle   a closed ring of one radius whose box is 2r      → r, cx, cy
 *   lens     a closed ring of one radius whose box is not 2r  (paintbrush-5's handle)
 *   line     one straight segment                             → length, angle
 *   polyline open, straight segments only
 *   bend     open L A L — one rounded corner                  → legs, bendR, turn, angles
 *   arc      open, one arc
 *   rrect-ish closed, arcs all of one radius                  → r
 *   other    anything else                                    → radii
 * `turn` is the angle between the two legs' lines, folded to ≤ 90°.
 */
export function classifySub(d) {
  const c = canonical(d);
  const s = c.subpaths[0];
  const segs = segsOf(s.d);
  const body = segs.filter((x) => x.cmd !== 'M' && x.cmd !== 'Z');
  const arcs = body.filter((x) => x.cmd === 'A');
  const lines = body.filter((x) => x.cmd === 'L');
  const curves = body.filter((x) => x.cmd === 'C' || x.cmd === 'Q');
  const b = bbox([d]);
  const base = {
    d, tagKey: s.tagKey, closed: s.closed, ring: s.ring,
    box: [r3(b.x0), r3(b.y0), r3(b.x1), r3(b.y1)],
    w: r3(b.x1 - b.x0), h: r3(b.y1 - b.y0),
    shape: c.shape, key: c.key,
  };
  const radii = uniq(arcs.flatMap((a) => [r3(a.rx), r3(a.ry)]));
  if (s.ring && !lines.length && !curves.length && radii.length === 1) {
    const r = radii[0];
    const full = Math.abs(base.w - 2 * r) < 0.011 && Math.abs(base.h - 2 * r) < 0.011;
    if (full) return { ...base, kind: 'circle', r, cx: r3((b.x0 + b.x1) / 2), cy: r3((b.y0 + b.y1) / 2) };
    return { ...base, kind: 'lens', r };
  }
  if (!s.closed && body.length === 1 && lines.length === 1) {
    return { ...base, kind: 'line', length: r3(len(lines[0].from, lines[0].to)), angle: lineAngle(lines[0].from, lines[0].to), ends: [lines[0].from, lines[0].to] };
  }
  if (!s.closed && !arcs.length && !curves.length && lines.length > 1) return { ...base, kind: 'polyline' };
  if (!s.closed && body.length === 3 && arcs.length === 1 && lines.length === 2
      && body[0].cmd === 'L' && body[1].cmd === 'A' && body[2].cmd === 'L') {
    const [l1, a1, l2] = body;
    const a = lineAngle(l1.from, l1.to), bb = lineAngle(l2.from, l2.to);
    let turn = Math.abs(a - bb); if (turn > 90) turn = 180 - turn;
    return { ...base, kind: 'bend', legs: [r3(len(l1.from, l1.to)), r3(len(l2.from, l2.to))],
      bendR: r3(a1.rx), turn: r3(turn), angles: [a, bb] };
  }
  if (!s.closed && arcs.length === 1 && !lines.length && !curves.length) return { ...base, kind: 'arc', radii };
  if (s.closed && !curves.length && arcs.length && radii.length === 1) return { ...base, kind: 'rrect-ish', r: radii[0] };
  return { ...base, kind: 'other', radii };
}

/** Every subpath in the set, classified, tagged with where it came from. */
export function allSubpaths(files) {
  const cache = new Map();
  const out = [];
  for (const f of files) {
    f.paths.forEach((p, pi) => {
      const subs = subpathsOfPath(p.d);
      subs.forEach((d, si) => {
        if (!cache.has(d)) cache.set(d, classifySub(d));
        out.push({
          ...cache.get(d),
          id: `${f.base}@${f.master}#${pi}.${si}`,
          concept: f.concept, base: f.base, master: f.master, style: f.style, sw: f.sw,
          ink: isShapeFill(p) ? 'fill' : 'stroke', pathIndex: pi, subIndex: si,
        });
      });
    });
  }
  return out;
}

/** A part's outer ink edge: a stroked part grows by half its file's stroke; a shape does not. */
export const outerR = (s) => r3(s.r + (s.ink === 'fill' ? 0 : s.sw / 2));
export const outerDiameter = (s) => r3(2 * outerR(s));

/** The family a concept belongs to, for the near-miss split (the card's `stem`). */
export const stemOf = (c) => c.replace(/-filled$/, '').replace(/-(small|large)$/, '').replace(/-\d+$/, '')
  .replace(/-(behind|wide|level)$/, '').replace(/-\d+$/, '');

/**
 * Is part B part A, moved (or moved and resized)? Works around congruence.mjs's known defect —
 * a ring traversed the other way reads as "different segment structure" — by also comparing the
 * two canonical spellings, which are blind to direction and start, and keeping the better result.
 * `raw` is the instrument's answer on the paths as written (what the card called).
 */
export function comparePart(a, b, mode = 'translation') {
  const fn = mode === 'scale' ? congruentUpToScale : congruentUpToTranslation;
  const run = (x, y) => {
    try { return fn(x, y); } catch (e) { return { same: false, maxDeviation: Infinity, reason: e.reason ?? String(e) }; }
  };
  const raw = run(a, b);
  let best = raw;
  if (!raw.same) {
    const canon = run(canonical(a).d, canonical(b).d);
    if (canon.same || canon.maxDeviation < raw.maxDeviation) best = canon;
  }
  return { ...best, raw };
}

// ── 3. the context: load once, index once, measure lazily ──────────────────

export function makeContext(pin) {
  const files = loadSet(pin);
  const subs = allSubpaths(files);
  const idx = new Map();
  for (const s of subs) {
    const k = `${s.concept}|${s.master}|${s.style}`;
    if (!idx.has(k)) idx.set(k, []);
    idx.get(k).push(s);
  }
  const fileIdx = new Map(files.map((f) => [`${f.concept}|${f.master}|${f.style}`, f]));
  const memo = new Map();
  const once = (k, fn) => { if (!memo.has(k)) memo.set(k, fn()); return memo.get(k); };
  const concepts = uniq(files.map((f) => f.concept)).sort();
  return {
    pin, files, subs, concepts, once,
    get: (c, m, st = 'outline', kinds = null) => (idx.get(`${c}|${m}|${st}`) ?? []).filter((s) => !kinds || kinds.includes(s.kind)),
    file: (c, m, st = 'outline') => fileIdx.get(`${c}|${m}|${st}`),
  };
}

// ── 4. measurements shared by several sections ─────────────────────────────

/** classify one bucket of subpaths, translation mode. */
export function classifyBucket(subs, opts = {}) {
  return classify(subs.map((s) => ({ id: s.id, d: s.d })), { mode: 'translation', ...opts });
}

const bucket = (ctx, m, st) => ctx.subs.filter((s) => s.master === m && (!st || s.style === st));

function vocab(ctx) {
  return ctx.once('vocab', () => {
    const rows = [];
    for (const m of MASTERS) for (const st of STYLES) {
      const b = bucket(ctx, m, st);
      const r = classifyBucket(b);
      rows.push({ m, st, n: b.length, classes: r.stats.groups, single: r.stats.singletons, near: r.nearMisses.length });
    }
    const pooled = MASTERS.map((m) => {
      const b = bucket(ctx, m);
      const r = classifyBucket(b);
      return { m, n: b.length, classes: r.stats.groups, single: r.stats.singletons };
    });
    const whole = classifyBucket(ctx.subs);
    return { rows, pooled, whole };
  });
}

/** Distinct circle radii per master (all circles, both styles). */
function circleRadii(ctx, kinds = ['circle']) {
  return MASTERS.map((m) => {
    const c = ctx.subs.filter((s) => s.master === m && kinds.includes(s.kind));
    const count = new Map();
    for (const s of c) count.set(s.r, (count.get(s.r) || 0) + 1);
    const radii = [...count.keys()].sort(byNum);
    return { m, n: c.length, radii, once: radii.filter((r) => count.get(r) === 1) };
  });
}

/** The container ring per master and style: the most common (radius, centre) among big circles. */
const BIG = { 24: 5, 20: 4, 16: 3.5 };            // the card's container threshold (ring.mjs)
export function ringClass(subs, m, st) {
  const big = subs.filter((s) => s.kind === 'circle' && s.master === m && s.style === st && s.r >= BIG[m]);
  const by = new Map();
  for (const s of big) { const k = `${s.r}@${s.cx},${s.cy}`; if (!by.has(k)) by.set(k, []); by.get(k).push(s); }
  const [, members] = [...by].sort((a, b) => b[1].length - a[1].length)[0];
  return members;
}

/** Symmetric V bends outside the chevron concepts (arrowhead.mjs), grouped by (leg, R, turn). */
export function arrowheadClasses(subs) {
  const V = subs.filter((s) => s.kind === 'bend' && s.turn >= 30 && s.turn <= 100
    && Math.abs(s.legs[0] - s.legs[1]) <= 0.02 * Math.max(...s.legs) && !/^chevron/.test(s.concept));
  const by = new Map();
  for (const s of V) {
    const k = `${r3(s.legs[0])}|${s.bendR}|${s.turn}`;
    if (!by.has(k)) by.set(k, { leg: r3(s.legs[0]), R: s.bendR, turn: s.turn, heads: [] });
    by.get(k).heads.push(s);
  }
  const rows = [...by.values()].map((g) => ({ ...g, n: g.heads.length, concepts: uniq(g.heads.map((h) => h.concept)).sort() }));
  // Biggest first; ties as the card printed them — insertion order, which is file order.
  return { heads: V.length, rows: rows.sort((a, b) => b.n - a.n) };
}

/** A concept family's subpaths classified together (objects.mjs). */
function familyClasses(ctx, names, m, st = 'outline') {
  const items = ctx.subs.filter((s) => names.includes(s.concept) && s.master === m && s.style === st);
  const r = classifyBucket(items, { near: bandFor(m) });
  const conceptOfId = (id) => id.split('@')[0];
  const shared = r.groups.filter((g) => uniq(g.members.map(conceptOfId)).length > 1)
    .sort((a, b) => b.size - a.size)
    .map((g) => ({ ...g, rep: items.find((s) => s.id === g.representative), concepts: uniq(g.members.map(conceptOfId)).sort() }));
  const near = r.nearMisses.filter((n) => conceptOfId(n.a) !== conceptOfId(n.b));
  return { n: items.length, classes: r.stats.groups, shared, near, groups: r.groups, items };
}

/** The outer ink span (x extent) of a mark's parts, a container ring (circle r > 3) excluded
 *  (the card's verify.mjs): centreline extent + the file's stroke. */
export function spanOf(parts, sw) {
  const xs = [];
  for (const s of parts) { if (s.kind === 'circle' && s.r > 3) continue; xs.push(s.box[0], s.box[2]); }
  return r3(Math.max(...xs) - Math.min(...xs) + sw);
}
const inkSpan = (ctx, c, m, st = 'outline') => spanOf(ctx.get(c, m, st), ctx.file(c, m, st).sw);

/** Circles whose radius is off their master's drawing grid (tools/masters.mjs gridOf). */
export const offGridCircles = (subs) => subs.filter((s) => s.kind === 'circle'
  && Math.abs(s.r / gridOf(s.master) - Math.round(s.r / gridOf(s.master))) > 1e-9);

/** Bends whose legs actually turn (≥ 10°), the card's bend-radius population. */
export const turningBends = (subs) => subs.filter((s) => s.kind === 'bend' && s.turn >= 10);
/** Bends tighter than half their own file's stroke (the minimum for the weight they are drawn at). */
export const belowOwnStroke = (bends) => bends.filter((s) => s.bendR < s.sw / 2 - 1e-9);

/** Spacing of a repeated element (C17): dots by centre distance, lines by centreline pitch. */
export function repeatedSpacing(parts, sw) {
  const cs = parts.filter((s) => s.kind === 'circle').map((s) => [s.cx, s.cy, s.r]);
  if (cs.length > 1) {
    cs.sort((a, c) => a[0] - c[0] || a[1] - c[1]);
    const d = r3(Math.hypot(cs[1][0] - cs[0][0], cs[1][1] - cs[0][1]));
    return { el: 'dot', th: r3(2 * cs[0][2] + sw), gap: r3(d - 2 * cs[0][2] - sw) };
  }
  const ys = uniq(parts.filter((s) => s.kind === 'line').map((s) => s.box[1])).sort(byNum);
  return { el: 'line', th: sw, gap: r3(ys[1] - ys[0] - sw) };
}

/** Shapes (translation classes) that occur at more than one master. */
export function shapesAcrossMasters(subs) {
  const by = new Map();
  for (const s of subs) { if (!by.has(s.shape)) by.set(s.shape, []); by.get(s.shape).push(s); }
  return [...by.values()].filter((g) => uniq(g.map((s) => s.master)).length > 1);
}

/** §1.4: each subpath at 24 against the subpath at the same path index at master m, scale mode,
 *  scale-trivial pairs stripped. `fixed` uses comparePart's workaround, `raw` the instrument as
 *  the card called it. */
export function scalePairs(subs, m) {
  const key = (s) => `${s.base}#${s.pathIndex}.${s.subIndex}`;
  const by = new Map();
  for (const s of subs) { const k = key(s); if (!by.has(k)) by.set(k, {}); by.get(k)[s.master] = s; }
  let n = 0, trivial = 0;
  const res = { fixed: { same: 0, diff: 0, scales: [] }, raw: { same: 0, diff: 0, scales: [] } };
  for (const [, g] of [...by].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (!g[24] || !g[m]) continue;
    n++;
    let pa, pb;
    try { pa = prepare(g[24].d); pb = prepare(g[m].d); } catch { continue; }
    if (scaleTrivial(pa) || scaleTrivial(pb)) { trivial++; continue; }
    const r = comparePart(g[24].d, g[m].d, 'scale');
    for (const [which, rr] of [['fixed', r], ['raw', r.raw]]) {
      if (rr.same) { res[which].same++; res[which].scales.push(r3(rr.scale)); } else res[which].diff++;
    }
  }
  return { n, trivial, ...res };
}

/** Near-miss census for one bucket with the band given; split by family. */
function nearMissCensus(ctx, m, st, near) {
  return ctx.once(`nm|${m}|${st}|${near}`, () => {
    const b = bucket(ctx, m, st);
    const r = classifyBucket(b, { near });
    const stem = new Map(b.map((s) => [s.id, stemOf(s.concept)]));
    const fam = r.nearMisses.filter((n) => stem.get(n.a) === stem.get(n.b));
    return { n: b.length, total: r.nearMisses.length, fam, cross: r.nearMisses.length - fam.length };
  });
}

// ── 5. sections ────────────────────────────────────────────────────────────

const out = [];
const say = (...a) => out.push(a.join(' '));
const head = (t) => say(`\n## ${t}`);
const tableRow = (cells) => say(`| ${cells.join(' | ')} |`);

const SECTIONS = {};

SECTIONS['s0'] = (ctx) => {
  head('§0 Method — the pin, the unit, the lens correction');
  const nPaths = ctx.files.reduce((n, f) => n + f.paths.length, 0);
  say(`concepts ${ctx.concepts.length} · files ${comma(ctx.files.length)} (${ctx.concepts.length} × 3 masters × 2 styles = ${comma(ctx.concepts.length * 6)}) · <path> elements ${comma(nPaths)} · subpaths ${comma(ctx.subs.length)}`);
  const lens = ctx.subs.filter((s) => s.kind === 'lens');
  const chord = (s) => { const v = s.d.match(/-?\d*\.?\d+/g).map(Number); return Math.hypot(v[v.length - 2] - v[0], v[v.length - 1] - v[1]) || Math.hypot(s.w, s.h); };
  const l24 = lens.find((s) => s.master === 24);
  say(`lens subpaths (closed, one radius, box ≠ 2r): ${lens.length} in ${uniq(lens.map((s) => s.concept)).join(', ')} — radii ${MASTERS.map((m) => uniq(lens.filter((s) => s.master === m).map((s) => s.r)).join('/') + ` @${m}`).join(' · ')}; chord at 24 ${l24 ? hu(Math.hypot(l24.w, l24.h), 2) + ' (box diagonal ' + l24.w + ' × ' + l24.h + ')' : '—'}`);
  const fixed = circleRadii(ctx), loose = circleRadii(ctx, ['circle', 'lens']);
  say(`distinct circle radii, lens excluded (the card's correction): ${fixed.map((x) => x.radii.length).join(' / ')}`);
  say(`distinct circle radii, lens counted as a circle (ring flag alone): ${loose.map((x) => x.radii.length).join(' / ')}   (wave 0's own counts are cited by the document, not re-measured here)`);
  say(`1 unit at a 16 px render: ${MASTERS.map((m) => `${m} → ${hu(px16(1, m), 3)} px`).join(' · ')}`);
  say(`0.25 unit at 24 = ${hu(px16(0.25, 24), 2)} px; at 16 = ${hu(px16(0.25, 16), 2)} px`);
};

SECTIONS['s1.1'] = (ctx) => {
  head('§1.1 Distinct parts, per master and style');
  const v = vocab(ctx);
  say('| master | style | subpaths | distinct parts | used once | reuse |');
  for (const r of v.rows) tableRow([r.m, r.st, comma(r.n), r.classes, r.single, pct(r.n - r.classes, r.n)]);
  say('Pooled across both styles:');
  say('| master | subpaths | distinct parts | used once | reuse |');
  for (const r of v.pooled) tableRow([r.m, comma(r.n), comma(r.classes), r.single, pct(r.n - r.classes, r.n)]);
  say(`Whole set, all masters and styles pooled: ${comma(ctx.subs.length)} subpaths → ${comma(v.whole.stats.groups)} classes, ${comma(v.whole.stats.singletons)} used once`);
  const pairs = new Set(), shapes = new Set();
  let n = 0;
  for (const f of ctx.files) for (const p of f.paths) { const c = canonical(p.d); pairs.add(`${f.master}|${c.shape}`); shapes.add(c.shape); n++; }
  say(`<path> level: ${comma(n)} paths carry ${comma(pairs.size)} distinct (shape, master) pairs — ${comma(n - pairs.size)} paths, ${pct(n - pairs.size, n, 0)}, redraw something the set already contains`);
  say(`pooling masters as well: ${comma(shapes.size)} distinct shapes, so ${pairs.size - shapes.size} (shape, master) pairs collapse`);
};

SECTIONS['s1.2'] = (ctx) => {
  head('§1.2 The reuse is real, and it is concentrated');
  const g = vocab(ctx).whole.groups.slice(0, 16);
  const sizes = g.map((x) => x.size);
  const total = sizes.reduce((a, b) => a + b, 0);
  const conceptsOf = (x) => uniq(x.members.map((id) => id.split('@')[0].replace(/-filled$/, '')));
  const cc = g.map((x) => conceptsOf(x).length);
  say(`sixteen largest classes: ${total} of ${comma(ctx.subs.length)} subpaths (${pct(total, ctx.subs.length)}), sized ${sizes.join(' · ')} members, each drawn by ${Math.min(...cc)}–${Math.max(...cc)} different concepts`);
  const byId = new Map(ctx.subs.map((s) => [s.id, s]));
  for (const x of g) {
    const rep = byId.get(x.representative);
    const where = uniq(x.members.map((id) => { const s = byId.get(id); return `${s.master} ${s.style}`; }));
    say(`   ×${x.size}  ${conceptsOf(x).length} concepts  ${rep.kind} ${rep.w}×${rep.h}${rep.kind === 'circle' ? ` r ${rep.r}` : ''}${rep.kind === 'bend' ? ` leg ${rep.legs.join('/')} R ${rep.bendR}` : ''}  in ${where.join(', ')}`);
  }
  // The two the document names: the 24 filled container ring, the 16 outline arrowhead.
  const ring24 = ringClass(ctx.subs, 24, 'filled')[0];
  const ringG = vocab(ctx).whole.groups.find((x) => x.members.includes(ring24.id));
  say(`the class holding the 24 filled container ring (r ${ring24.r}): ${ringG.size} members, ${conceptsOf(ringG).length} concepts`);
  const ah = arrowheadClasses(bucket(ctx, 16, 'outline')).rows[0].heads[0];
  const ahG = vocab(ctx).whole.groups.find((x) => x.members.includes(ah.id));
  say(`the class holding the 16 outline arrowhead (leg ${ah.legs[0]}): ${ahG.size} members, ${conceptsOf(ahG).length} concepts`);
};

SECTIONS['s1.3'] = (ctx) => {
  head('§1.3 Shapes drawn at identical absolute size at more than one master');
  const multi = shapesAcrossMasters(ctx.subs);
  const mkey = (g) => uniq(g.map((s) => s.master)).sort((a, b) => b - a).join(' + ');
  say(`${multi.length} shapes`);
  say('| masters | shapes |');
  const byM = new Map(); for (const g of multi) byM.set(mkey(g), (byM.get(mkey(g)) || 0) + 1);
  for (const k of ['24 + 20', '20 + 16', '24 + 16', '24 + 20 + 16']) tableRow([k, byM.get(k) ?? 0]);
  const byK = new Map(); for (const g of multi) byK.set(g[0].kind, (byK.get(g[0].kind) || 0) + 1);
  say(`By kind: ${[...byK].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} ${k}`).join(' · ')}`);
  const rows = multi.filter((g) => !['line', 'circle'].includes(g[0].kind))
    .map((g) => ({ g, kind: g[0].kind, size: `${g[0].w} × ${g[0].h}`, masters: mkey(g), n: g.length, concepts: uniq(g.map((s) => s.concept)) }))
    .sort((a, b) => b.n - a.n);
  say(`non-line, non-circle cases: ${rows.length}`);
  for (const r of rows) {
    const perM = MASTERS.filter((m) => r.g.some((s) => s.master === m))
      .map((m) => `@${m}: ${uniq(r.g.filter((s) => s.master === m).map((s) => s.concept)).sort().join(' ')}`);
    const kept = r.concepts.filter((c) => uniq(r.g.filter((s) => s.concept === c).map((s) => s.master)).length > 1);
    if (r.kind === 'bend') r.size += ` leg ${uniq(r.g[0].legs).join('/')}`;
    say(`   ${r.kind.padEnd(9)} ${r.size.padEnd(16)} ${r.masters.padEnd(13)} ×${String(r.n).padEnd(3)} ${r.concepts.length} concepts, ${uniq(r.g.map((s) => s.base + '@' + s.master)).length} files, ${uniq(r.g.map((s) => s.style)).join('+')}, one concept at 2+ masters: ${kept.join(' ') || 'none'}  ${perM.join('  ')}`);
  }
};

SECTIONS['s1.4'] = (ctx) => {
  head('§1.4 Is 20 a master or a resize? — part by part');
  say('| comparison | pairs | scale-trivial (stripped) | non-trivial | the smaller part IS the larger resized | a different drawing | distinct scale factors |');
  const after = [];
  for (const m of [20, 16]) {
    const { n, trivial, ...res } = scalePairs(ctx.subs, m);
    const row = (x) => {
      const nt = x.same + x.diff, sc = uniq(x.scales).sort(byNum);
      return [comma(n), comma(trivial), comma(nt), `${x.same} (${pct(x.same, nt)})`, `${comma(x.diff)} (${pct(x.diff, nt)})`,
        `${sc.length}, from ${hu(sc[0], 3)} to ${hu(sc[sc.length - 1], 3)}`];
    };
    tableRow([`24 → ${m}`, ...row(res.fixed)]);
    const same = JSON.stringify(row(res.fixed)) === JSON.stringify(row(res.raw));
    after.push(`   24 → ${m}, the instrument as the card called it (paths as written, no ring-direction workaround): ${same ? 'identical' : row(res.raw).join(' | ')}`);
  }
  for (const l of after) say(l);
  say(`a pure resize would be ×${hu((20 / 24), 3)} to 20 and ×${hu((16 / 24), 3)} to 16`);
};

// ── §2 primitives ──

/** §2.2 (square.mjs): the most common rounded square — closed, one corner radius, ≥ 55% of the
 *  canvas each way, near square — keyed on outer ink size, radius AND position. */
export function squareClass(subs, m, st) {
  const S = subs.filter((s) => s.master === m && s.style === st && s.closed && s.kind === 'rrect-ish'
    && s.w >= 0.55 * m && s.h >= 0.55 * m && Math.abs(s.w - s.h) < 0.6);
  const by = new Map();
  for (const s of S) {
    const k = `${r3(s.w + (s.ink === 'fill' ? 0 : s.sw))} × ${r3(s.h + (s.ink === 'fill' ? 0 : s.sw))}|${s.r}|${s.box.join(',')}`;
    if (!by.has(k)) by.set(k, []); by.get(k).push(s);
  }
  const top = [...by].sort((a, b) => b[1].length - a[1].length)[0];
  return top ? { ink: top[0].split('|')[0], members: top[1] } : { ink: null, members: [] };
}

/** §2.3 (dots.mjs): full circles below the container threshold, at one master and style. */
export const dotsOf = (subs, m, st) => subs.filter((s) => s.kind === 'circle' && s.master === m && s.style === st && s.r < BIG[m]);

/** §5: the card's near-miss band — classify's default at 24, held at one share of canvas. */
export const bandFor = (m) => NEAR * m / 24;

const STEM_LIST = (names) => {
  const st = (c) => (/^face-/.test(c) ? 'face-*' : c.replace(/-small$/, '').replace(/-\d+$/, '').replace(/-small$/, '').replace(/-\d+$/, ''));
  const by = new Map();
  for (const c of names) { if (!by.has(st(c))) by.set(st(c), []); by.get(st(c)).push(c); }
  return [...by].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, cs]) => (cs.length > 1 ? `${k} ×${cs.length}` : cs[0])).join(', ');
};

function ringCompare(ctx, other) {
  return MASTERS.map((m) => {
    const a = ctx.get(other, m, 'outline', ['circle'])[0], b = ctx.get('plus-circle', m, 'outline', ['circle'])[0];
    return comparePart(a.d, b.d, 'translation');
  });
}
const RING_PAIRS = ['check-circle', 'x-circle', 'ban', 'info', 'clock', 'globe', 'target'];   // the card's named set

SECTIONS['s2.1'] = (ctx) => {
  head('§2.1 The container ring — one drawing, zero drift');
  say('| master | style | concepts | centreline r | centre | outer ink edge | residual to representative |');
  const cls = {};
  for (const m of MASTERS) for (const st of STYLES) {
    const mem = ringClass(ctx.subs, m, st);
    cls[`${m}${st}`] = mem;
    const rep = mem.find((s) => s.concept === 'plus-circle') ?? mem[0];
    let worst = 0;
    for (const s of mem) { const r = comparePart(rep.d, s.d); if (r.maxDeviation > worst) worst = r.maxDeviation; }
    tableRow([m, st, uniq(mem.map((s) => s.concept)).length, mem[0].r, `${mem[0].cx}, ${mem[0].cy}`, outerR(mem[0]), r3(worst)]);
  }
  const comps = RING_PAIRS.flatMap((c) => ringCompare(ctx, c));
  const ident = comps.filter((r) => r.same && r.maxDeviation === 0 && r.offset[0] === 0 && r.offset[1] === 0);
  say(`exact congruence against plus-circle's ring (${RING_PAIRS.join(', ')}): ${ident.length} of ${comps.length} IDENTICAL, residual 0, offset [0, 0]`);
  const scale = RING_PAIRS.flatMap((c) => MASTERS.map((m) => comparePart(ctx.get(c, m, 'outline', ['circle'])[0].d, ctx.get('plus-circle', m, 'outline', ['circle'])[0].d, 'scale')));
  say(`   scale mode: ${scale.filter((r) => r.same && r.scale === 1).length} of ${scale.length} at ×1`);
  const out24 = uniq(cls['24outline'].map((s) => s.concept)).sort();
  say(`the outline class carries ${STEM_LIST(out24)}`);
  const fil = new Set(cls['24filled'].map((s) => s.concept));
  const outside = out24.filter((c) => !fil.has(c));
  say(`concepts in the outline class, outside the filled class (${outside.length}):`);
  say('| concept | filled construction | centreline r @24 | outer edge 24 / 20 / 16 |');
  for (const c of outside) {
    const sws = MASTERS.map((m) => ctx.file(c, m, 'filled').sw);
    const heavy = MASTERS.some((m, i) => sws[i] > STROKES[m]);
    const shapes = MASTERS.some((m) => ctx.file(c, m, 'filled').paths.some(isShapeFill));
    const ring = (m) => ctx.get(c, m, 'filled', ['circle']).filter((s) => s.cx === m / 2 && s.cy === m / 2).sort((a, b) => b.r - a.r)[0];
    const edges = MASTERS.map((m) => {
      const r = ring(m);
      if (r) return outerR(r);
      const b = bbox(ctx.file(c, m, 'filled').paths.filter(isShapeFill).map((p) => p.d));
      return r3((b.x1 - b.x0) / 2);
    });
    const kind = ring(24) ? `${heavy ? 'line-heavy' : 'light'} (${sws.join(' / ')}), ring stays a stroke` : `shape-filled${shapes ? '' : '?'}, no ring circle`;
    tableRow([`\`${c}-filled\``, kind, ring(24)?.r ?? '—', edges.join(' / ')]);
  }
  const nOut = out24.length, nFil = fil.size + outside.length;
  say(`=> ${nOut} outline concepts and ${nFil} filled concepts (${fil.size} + ${outside.length}) carry the ring at the outer ink edge ${MASTERS.map((m) => outerR(cls[`${m}outline`][0])).join(' / ')}`);
  say(`ring's share of canvas: ${MASTERS.map((m) => pct(2 * outerR(cls[`${m}outline`][0]), m)).join(' → ')}`);
  // Raw-text cross-check (the card's grep): files carrying plus-circle's ring path string verbatim.
  const grepCount = (m, st) => {
    const d = (st === 'outline' ? ctx.file('plus-circle', m) : ctx.file('plus-circle', m, 'filled')).paths[0].d;
    const target = st === 'outline' ? d : d.split('Z')[0] + 'Z';
    return ctx.files.filter((f) => f.master === m && f.style === st && f.src.includes(target)).length;
  };
  say(`raw text: outline files carrying plus-circle's ring path verbatim ${MASTERS.map((m) => grepCount(m, 'outline')).join(' / ')}; filled files carrying its disc ${grepCount(24, 'filled')} at 24`);
};

SECTIONS['s2.2'] = (ctx) => {
  head('§2.2 The rounded square — a second clean container');
  say('| master | style | concepts | outer ink box | corner radius |');
  const top = {};
  for (const st of STYLES) for (const m of MASTERS) {
    const { ink, members: mem } = squareClass(ctx.subs, m, st);
    top[`${m}${st}`] = mem;
    tableRow([m, st, uniq(mem.map((s) => s.concept)).length, ink, oneDp(mem[0].r)]);
  }
  say(`members at 24 outline: ${STEM_LIST(uniq(top['24outline'].map((s) => s.concept)).sort())} — ${uniq(top['24outline'].map((s) => s.concept)).sort().join(', ')}`);
  // The class above is the card's: same outer ink box, corner radius and position. Whether its
  // members are one PATH is a congruence question — a chamfered corner keeps box and radius.
  for (const m of MASTERS) {
    const g = top[`${m}outline`];
    const r = classifyBucket(g);
    const big = r.groups[0];
    const out = uniq(g.filter((x) => !big.members.includes(x.id)).map((x) => x.concept));
    say(`@${m} outline: ${uniq(big.members.map((id) => id.split('@')[0])).length} of ${uniq(g.map((x) => x.concept)).length} concepts on one path (residual ${big.maxDeviation}); same box and radius, a different path: ${out.join(', ') || 'none'}`);
  }
  for (const m of MASTERS) {
    const o = top[`${m}outline`][0], f = top[`${m}filled`][0];
    say(`filled radius @${m}: centreline ${o.r} + half the stroke ${o.sw / 2} = ${r3(o.r + o.sw / 2)}; filled class draws ${f.r} ${r3(o.r + o.sw / 2) === f.r ? '✓' : '✗'}`);
  }
  const nO = uniq(top['24outline'].map((s) => s.concept)).length, nF = uniq(top['24filled'].map((s) => s.concept)).length;
  say(`${nF} concepts reach the filled class; the other ${nO - nF} fill their square differently`);
};

function dotPairs(ctx) {
  return ctx.once('dotpairs', () => {
    const key = (s) => `${s.base}#${s.pathIndex}.${s.subIndex}`;
    const by = new Map();
    for (const s of ctx.subs) if (s.style === 'outline') by.set(`${key(s)}@${s.master}`, s);
    return (s, m) => by.get(`${key(s)}@${m}`);
  });
}

SECTIONS['s2.3'] = (ctx) => {
  head('§2.3 The dot — the loosest primitive in the set');
  say('| master | style | dots | distinct ⌀ |');
  const dots = (m, st) => dotsOf(ctx.subs, m, st);
  for (const m of MASTERS) for (const st of STYLES) {
    const b = dots(m, st);
    tableRow([m, st, b.length, uniq(b.map(outerDiameter)).length]);
  }
  say('Outline, by outer ink diameter, 24 → 20 → 16 (the same subpath followed to 20 and 16; sets by frequency):');
  say('| ⌀ @24 | concepts at 24 | ⌀ @20 | ⌀ @16 |');
  const at = dotPairs(ctx);
  const d24 = dots(24, 'outline');
  const byD = new Map();
  for (const s of d24) { const k = outerDiameter(s); if (!byD.has(k)) byD.set(k, []); byD.get(k).push(s); }
  const follow = (g, m) => {
    const c = new Map();
    for (const s of g) { const t = at(s, m); if (t && t.kind === 'circle') c.set(outerDiameter(t), (c.get(outerDiameter(t)) || 0) + 1); }
    return [...c].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([d]) => d).join(' / ') || '—';
  };
  for (const k of [...byD.keys()].sort(byNum)) {
    const g = byD.get(k), names = uniq(g.map((s) => s.concept)).sort();
    tableRow([k, `${names.length}${names.length <= 13 ? ' — ' + names.join(', ') : ''}`, follow(g, 20), follow(g, 16)]);
  }
  // (a) the glyph dot: the dots of the concepts that declare C19's `glyph: dot`, followed to 20 and 16
  const declared = (s) => ctx.file(s.concept, 24).notes.some((n) => /^glyph:\s*dot\b/.test(n));
  const glyph = d24.filter(declared);
  const gd24 = uniq(glyph.map(outerDiameter));
  const g24 = gd24.length === 1 ? byD.get(gd24[0]) : [];
  const others = g24.filter((s) => !declared(s));
  say(`(a) the glyph dot (concepts declaring \`glyph: dot\` with a dot at 24 outline: ${uniq(glyph.map((s) => s.concept)).length}): ⌀${gd24.join('/')} at 24, ⌀${follow(glyph, 20)} at 20, ⌀${follow(glyph, 16)} at 16; share of canvas ${[gd24[0], Number(follow(glyph, 20)), Number(follow(glyph, 16))].map((d, i) => pct(d, MASTERS[i])).join(' → ')}`);
  say(`   its ⌀${gd24.join('/')} group at 24 holds ${uniq(g24.map((s) => s.concept)).length} concepts; the others (${uniq(others.map((s) => s.concept)).join(', ') || 'none'}) go to ⌀${follow(others, 20)} at 20`);
  const gd20 = Number(follow(glyph, 20));
  const meets = [...byD.keys()].filter((k) => !gd24.includes(k) && follow(byD.get(k), 20).split(' / ').map(Number).includes(gd20));
  say(`   at 20 the glyph dot (⌀${gd20}) is the same circle as the ⌀${meets.join(', ⌀')} group at 24 (${meets.map((k) => uniq(byD.get(k).map((s) => s.concept)).join(', ')).join('; ')}), which goes to ⌀${meets.map((k) => follow(byD.get(k), 16)).join('; ')} at 16`);
  // (b) cash
  const cash = MASTERS.map((m) => ctx.get('cash', m, 'outline', ['circle']).map(outerDiameter)[0]);
  say(`(b) cash's mark: ${MASTERS.map((m, i) => `⌀${cash[i]} (${pct(cash[i], m)})`).join(' · ')}; moves ${hu((100 * (cash[0] / 24 - cash[2] / 16)), 1)} points of canvas share`);
  // (c) off-grid radii
  say('(c) circle radii off their master\'s grid:');
  say('| master | grid | off-grid radii (circles, files) | concepts |');
  let allC = 0; const allF = new Set(), allK = new Set();
  for (const m of MASTERS) {
    const step = gridOf(m);
    const bad = offGridCircles(ctx.subs).filter((s) => s.master === m);
    const byR = new Map(); for (const s of bad) { if (!byR.has(s.r)) byR.set(s.r, []); byR.get(s.r).push(s); }
    allC += bad.length; bad.forEach((s) => { allF.add(s.base + '@' + m); allK.add(s.concept); });
    tableRow([m, step, [...byR].sort((a, b) => a[0] - b[0]).map(([r, g]) => `${r} (${g.length}, ${uniq(g.map((s) => s.base)).length} files${g.every((s) => s.style === 'filled') ? ', filled' : ''})`).join(', ') || 'none',
      uniq(bad.map((s) => s.concept)).sort().join(', ') || '—']);
  }
  say(`   in all: ${allC} circles in ${allF.size} files, ${allK.size} concepts`);
  const mh = MASTERS.map((m) => ctx.get('more-horizontal', m, 'outline', ['circle']));
  say(`   the C17 dot, more-horizontal outline ink ⌀: ${mh.map((g) => outerDiameter(g[0])).join(' → ')}; centreline r ${mh.map((g) => g[0].r).join(' / ')} at stroke ${MASTERS.map((m) => STROKES[m]).join(' / ')}`);
  say(`   more-horizontal dot centres: @20 ${mh[1].map((s) => s.cx).sort(byNum).join(' / ')}; @16 ${mh[2].map((s) => s.cx).sort(byNum).join(' / ')}`);
  const cr = circleRadii(ctx);
  say(`distinct circle radii, all circles, per master: ${cr.map((x) => `${x.radii.length} at ${x.m}`).join(' · ')}, with ${cr.map((x) => x.once.length).join(' / ')} radii used exactly once`);
};

function spanTable(ctx, fam) {
  say(`| concept | 24 | 20 | 16 | step @24 | step @20 | step @16 |`);
  const v = Object.fromEntries(fam.map((c) => [c, MASTERS.map((m) => inkSpan(ctx, c, m))]));
  const step = { 24: 3, 20: 2.5, 16: 2 };        // C8's step (CLAUDE.md, Settled: Sizes) — the rule under test
  const [small, def, large, ...rest] = fam;
  const ok = (a, b, m) => (r3(a - b) === step[m] ? `${r3(a - b)} ✓` : `${r3(a - b)} ✗`);
  tableRow([small, ...v[small].map((x) => hu(x, 1)), '', '', '']);
  tableRow([def, ...v[def].map((x) => hu(x, 1)), ...MASTERS.map((m, i) => ok(v[def][i], v[small][i], m))]);
  tableRow([large, ...v[large].map((x) => hu(x, 1)), ...MASTERS.map((m, i) => ok(v[large][i], v[def][i], m))]);
  for (const c of rest) tableRow([c, ...v[c].map((x) => hu(x, 1)), '', '', '']);
  return v;
}

/** A residual as the document writes it: under 0.1 u to 4 dp with px@16 to 3 dp; under 1 u both to
 *  3 dp; from 1 u, u to 3 dp and px to 2 dp. */
export const residualCell = (dev, m) => (dev < 0.1 ? `${hu(dev, 4)} u = ${hu(px16(dev, m), 3)} px@16`
  : dev < 1 ? `${hu(dev, 3)} u = ${hu(px16(dev, m), 3)} px` : `${hu(dev, 3)} u = ${hu(px16(dev, m), 2)} px`);

function pairTable(ctx, rows) {
  let n = 0, same = 0, worst = 0;
  for (const [label, aC, bC, kinds, st, ai, bi] of rows) {
    const cells = MASTERS.map((m) => {
      const a = ctx.get(aC, m, st, kinds)[ai], b = ctx.get(bC, m, st, kinds)[bi];
      if (!a || !b) return 'missing';
      const r = comparePart(a.d, b.d);
      n++;
      if (r.same) { same++; worst = Math.max(worst, r.maxDeviation); return 'IDENTICAL'; }
      return Number.isFinite(r.maxDeviation) ? `off ${residualCell(r.maxDeviation, m)}` : `different (${r.reason})`;
    });
    tableRow([label, ...cells]);
  }
  say(`   ${same} of ${n} identical; largest residual among them ${worst}`);
}

SECTIONS['s2.4'] = (ctx) => {
  head('§2.4 The plus and the minus — one bar, exactly, everywhere');
  spanTable(ctx, ['plus-small', 'plus', 'plus-large', 'plus-circle', 'plus-circle-small']);
  say('minus, the same way:');
  spanTable(ctx, ['minus-small', 'minus', 'minus-large']);
  say('| pair | 24 | 20 | 16 |');
  pairTable(ctx, [
    ['`minus` vs `plus`\'s horizontal', 'minus', 'plus', ['line'], 'outline', 0, 1],
    ['`minus-small` vs `plus-small`\'s', 'minus-small', 'plus-small', ['line'], 'outline', 0, 1],
    ['`minus-large` vs `plus-large`\'s', 'minus-large', 'plus-large', ['line'], 'outline', 0, 1],
    ['`minus-circle` vs `plus-circle`\'s', 'minus-circle', 'plus-circle', ['line'], 'outline', 0, 1],
    ['`minus-circle-small` vs `plus-circle-small`\'s', 'minus-circle-small', 'plus-circle-small', ['line'], 'outline', 0, 1],
    ['`minus` vs `plus`\'s horizontal, filled', 'minus', 'plus', ['line'], 'filled', 0, 1],
  ]);
};

/** Half the length of a concept's one slash, and its distance from the canvas centre. */
function slashHalf(ctx, c, m) {
  const s = ctx.get(c, m, 'outline', ['line'])[0];
  return len(s.ends[0], s.ends[1]) / 2;
}

SECTIONS['s2.5'] = (ctx) => {
  head('§2.5 The x and the slash');
  const v = spanTable(ctx, ['x-small', 'x', 'x-large', 'x-circle', 'x-circle-small']);
  const plus = MASTERS.map((m) => inkSpan(ctx, 'plus', m));
  say(`x sits inside the plus box by ${MASTERS.map((m, i) => hu((plus[i] - v.x[i]), 1)).join(' / ')} (x's own note says "about 1.5")`);
  say('| pair | 24 | 20 | 16 |');
  pairTable(ctx, [
    ['`ban`\'s slash vs `ban-2`\'s', 'ban', 'ban-2', ['line'], 'outline', 0, 0],
    ['`volume-x`\'s arm vs `x-circle-small`\'s', 'volume-x', 'x-circle-small', ['line'], 'outline', 0, 0],
    ['`ban-3`\'s slash vs `x-small`\'s arm', 'ban-3', 'x-small', ['line'], 'outline', 0, 0],
  ]);
  const half = MASTERS.map((m) => slashHalf(ctx, 'ban-3', m));
  const note = ctx.file('ban-3', 24).notes.join(' ').match(/half-length ([\d.]+) \/ ([\d.]+) \/ ([\d.]+)/);
  const said = note ? note.slice(1).map(Number) : [];
  say(`ban-3's slash half-length, measured: ${half.map((x) => hu(x, 4)).join(' / ')}; its note says ${said.join(' / ') || '(no note)'}; off by ${half.map((x, i) => hu(Math.abs(x - said[i]), 4)).join(' / ')} (px@16 ${half.map((x, i) => hu(px16(Math.abs(x - said[i]), MASTERS[i]), 3)).join(' / ')})`);
  const banH = slashHalf(ctx, 'ban', 24), banR = ctx.get('ban', 24, 'outline', ['circle'])[0].r;
  say(`ban's slash half-length ${hu(banH, 3)} against a ring centreline radius of ${banR}`);
};

const CHEV = { vars: ['', '-2', '-3'], sizes: ['-small', '', '-large'], dirs: ['down', 'up', 'left', 'right'] };
const BEND_MIN_FILLED = Object.fromEntries(MASTERS.map((m) => [m, FILLED_WEIGHT[m] / 2]));   // C10: weight / 2
const BEND_MIN_OUTLINE = Object.fromEntries(MASTERS.map((m) => [m, STROKES[m] / 2]));

SECTIONS['s2.6'] = (ctx) => {
  head('§2.6 The chevron');
  const names = ctx.concepts.filter((c) => /^chevron-(down|up|left|right)/.test(c));
  say(`${names.length} chevron concepts`);
  const counts = [], merged = [];
  for (const m of MASTERS) for (const st of STYLES) {
    const rows = names.map((c) => ctx.get(c, m, st)).filter((b) => b.length === 1 && b[0].kind === 'bend').map((b) => b[0]);
    counts.push(`${m} ${st} ${uniq(rows.map((s) => `${s.legs.join('/')}|${s.bendR}|${s.turn}`)).length}`);
    merged.push(uniq(rows.map((s) => `${[...s.legs].sort(byNum).join('/')}|${s.bendR}|${s.turn}`)).length);
  }
  say(`classes by (legs, bend radius, turn): ${counts.join(' · ')}`);
  say(`the same with the legs unordered (a mirror is one shape): ${merged.join(' · ')}`);
  for (const m of [20, 16]) {
    const g = names.map((c) => ctx.get(c, m, 'filled')[0]).filter((s) => s.legs[0] !== s.legs[1]);
    if (g.length) say(`   ${m} filled: unequal-leg members ${uniq(g.map((s) => s.concept.replace(/^chevron-(down|up|left|right)/, 'chevron-*'))).join(', ')} — legs ${uniq(g.map((s) => [...s.legs].sort(byNum).join(' / '))).join(', ')}, ${hu(r3(Math.max(...g.map((s) => Math.abs(s.legs[0] - s.legs[1])))), 3)} apart`);
  }
  const oR = MASTERS.map((m) => uniq(names.map((c) => ctx.get(c, m, 'outline')[0].bendR)));
  say(`outline bend radius on all ${names.length} at each master: ${oR.map((x) => x.join(',')).join(' / ')} across ${names.length * 3} drawings (bendMin ${MASTERS.map((m) => BEND_MIN_OUTLINE[m]).join(' / ')})`);
  say('| master | variant | size | outline turn | filled turn | Δ turn | filled R | R ÷ filled `bendMin` |');
  const rows = [];
  for (const m of MASTERS) for (const v of CHEV.vars) for (const z of CHEV.sizes) {
    const c = `chevron-down${v}${z}`;
    const o = ctx.get(c, m)[0], f = ctx.get(c, m, 'filled')[0];
    const d = r3(f.turn - o.turn), q = f.bendR / BEND_MIN_FILLED[m];
    rows.push({ m, v, z, o, f, d, q });
    tableRow([m, v.replace('-', '') || '1', (z || 'default').replace('-', ''), `${hu(o.turn, 3)}°`, `${hu(f.turn, 3)}°`, d > 0 ? `+${hu(d, 3)}` : d === 0 ? '0' : hu(d, 3), chevR(f.bendR), `${hu(q, 2)}×${Math.abs(q - 2) < 1e-9 ? ' cap' : ''}`]);
  }
  const v13 = rows.filter((r) => r.v !== '-2'), v2 = rows.filter((r) => r.v === '-2');
  say(`variants 1 and 3: filled R ${Math.min(...v13.map((r) => r.f.bendR))}–${Math.max(...v13.map((r) => r.f.bendR))}; largest |Δ turn| ${MASTERS.map((m) => `${hu(Math.max(...v13.filter((r) => r.m === m).map((r) => Math.abs(r.d))), 3)}° @${m}`).join(', ')}`);
  say(`variant 3's filled R @24: ${v13.filter((r) => r.v === '-3' && r.m === 24).map((r) => hu(r.f.bendR, 2)).join(' / ')}`);
  say(`variant 2: filled R = 2 × filled bendMin at every master: ${v2.every((r) => Math.abs(r.q - 2) < 1e-9)}; largest |Δ turn| ${hu(Math.max(...v2.map((r) => Math.abs(r.d))), 3)}°`);
  const worst = v2.reduce((a, b) => (Math.abs(b.d) > Math.abs(a.d) ? b : a));
  const tip = worst.o.legs[0] * (Math.abs(worst.d) / 2) * Math.PI / 180;
  say(`   on its ${worst.o.legs[0]}-unit outline leg (${worst.m}, size ${(worst.z || 'default').replace('-', '')}) the tip moves ${hu(tip, 2)} units = ${hu(px16(tip, worst.m), 2)} px@16`);
  say(`   variant 2: ${names.filter((c) => /^chevron-\w+-2(-|$)/.test(c)).length} of ${names.length} chevron concepts, ${names.filter((c) => /^chevron-\w+-2(-|$)/.test(c)).length * 3} filled drawings`);
  const classic = (m) => CHEV.sizes.map((z) => hu(ctx.get(`chevron-down${z}`, m)[0].turn, 3));
  say(`classic chevron outline turn by size (small / default / large): @16 ${classic(16).join(' / ')} · @24 ${classic(24).join(' / ')} · @20 ${classic(20).join(' / ')}`);
  say(`   largest per-leg departure at 16: (90 − ${Math.min(...classic(16).map(Number))}) / 2 = ${hu(((90 - Math.min(...classic(16).map(Number))) / 2), 3)}°`);
  // chevrons-up-down
  const cud = ctx.concepts.filter((c) => /^chevrons-up-down/.test(c));
  const a = ctx.get('chevrons-up-down', 24)[0], up = ctx.get('chevron-up', 24)[0];
  say(`chevrons-up-down's chevron @24 ${a.w} × ${a.h} (bend R ${a.bendR}); chevron-up ${up.w} × ${up.h}`);
  const shapeOwner = (s) => names.filter((c) => ctx.get(c, s.master, s.style)[0]?.shape === s.shape);
  for (const st of STYLES) for (const m of MASTERS) {
    const parts = cud.flatMap((c) => ctx.get(c, m, st, ['bend']));
    const inFam = parts.filter((s) => shapeOwner(s).length);
    say(`   ${m} ${st}: ${parts.length} chevron subpaths in ${cud.length} concepts; ${inFam.length} share a chevron concept's shape exactly — ${cud.map((c) => `${c} → ${uniq(ctx.get(c, m, st, ['bend']).flatMap(shapeOwner).map((x) => x.replace(/^chevron-(down|up)/, 'chevron-$1'))).join('/') || 'none'}`).join('; ')}`);
  }
};

SECTIONS['s2.7'] = (ctx) => {
  head('§2.7 The arrowhead');
  const a24 = arrowheadClasses(bucket(ctx, 24, 'outline'));
  say(`24 outline: ${a24.heads} heads in ${a24.rows.length} distinct drawings`);
  say('| leg | R | turn | files | concepts | who |');
  for (const r of a24.rows) tableRow([hu(r.leg, 3), hu(r.R, 2), r.turn === 90 ? '90°' : `${hu(r.turn, 1)}°`, r.n, r.concepts.length, r.concepts.join(', ')]);
  say(`   (the 'files' column counts heads, as the card did; distinct files per row: ${a24.rows.map((r) => uniq(r.heads.map((h) => h.base)).length).join(' · ')})`);
  for (const [m, st] of [[20, 'outline'], [24, 'filled']]) {
    const a = arrowheadClasses(bucket(ctx, m, st));
    const t = a.rows[0];
    say(`${m} ${st}: ${a.heads} heads, ${a.rows.length} classes, the big one at leg ${t.leg} / R ${t.R} in ${t.concepts.length} concepts (${t.n} heads)`);
  }
  // The pairs the document names — its own selection, made here by the concept each class holds
  // (the axis-aligned arrow vs the diagonal one; rotate-ccw's unturned head vs its turned one).
  // The legs and the distances are measured.
  say('| pair | master | Δ leg | px@16 |');
  const PAIRS = [[24, 'arrow-up', 'external-link'], [24, 'rotate-ccw', 'rotate-ccw-5'], [20, 'arrow-up', 'external-link'], [20, 'rotate-ccw', 'rotate-ccw-5']];
  const classOf = (rows, c) => rows.find((r) => r.concepts.includes(c) && r.turn === 90);
  for (const [m, x, y] of PAIRS) {
    const rows = arrowheadClasses(bucket(ctx, m, 'outline')).rows;
    const A = classOf(rows, x), B = classOf(rows, y);
    if (!A || !B) { tableRow([`${x} vs ${y}`, m, 'class missing', '']); continue; }
    const d = Math.abs(A.leg - B.leg);
    tableRow([`${hu(A.leg, 3)} (${A.concepts.length} concepts, ${x}'s) vs ${hu(B.leg, 3)} (${B.concepts.length} concepts: ${B.concepts.join(', ')})`, m, hu(d, 3), hu(px16(d, m), 3)]);
  }
  const axis = classOf(a24.rows, 'arrow-up').leg;
  say(`the axis-aligned head: ${axis} = ${hu((axis / Math.SQRT2), 3)} × √2; the diagonal head ${classOf(a24.rows, 'external-link').leg}`);
  const rot = ctx.concepts.filter((c) => /^rotate-ccw(-\d+)?$/.test(c));
  say(`rotate-ccw family: ${rot.length} concepts`);
  say('| concepts | leg | leg angles |');
  const heads = ctx.subs.filter((s) => s.kind === 'bend' && s.master === 24 && s.style === 'outline' && /^(rotate-ccw|refresh)(-\d+)?$/.test(s.concept)
    && s.turn > 80 && s.legs[0] === s.legs[1] && s.legs[0] < 5);
  const g = new Map();
  for (const h of heads) { const k = `${h.legs[0]}|${[...h.angles].sort((a, b) => b - a).join('° / ')}°`; if (!g.has(k)) g.set(k, []); g.get(k).push(h.concept); }
  for (const [k, cs] of [...g].sort((a, b) => b[1].length - a[1].length)) { const [leg, ang] = k.split('|'); tableRow([uniq(cs).sort().join(', '), hu(Number(leg), 3), ang]); }
  const A = ctx.get('rotate-ccw', 24, 'outline', ['bend'])[0], B = ctx.get('rotate-ccw-5', 24, 'outline', ['bend']).find((s) => s.legs[0] === s.legs[1]);
  const r = comparePart(A.d, B.d);
  say(`rotate-ccw's head vs rotate-ccw-5's: ${r.same ? 'IDENTICAL' : `not the same, residual ${fx(r.maxDeviation, 3)} (${r.raw.reason ?? r.reason ?? 'near'})`}; ${A.legs[0]} vs ${B.legs[0]}, Δ ${hu((B.legs[0] - A.legs[0]), 3)} = ${hu(px16(B.legs[0] - A.legs[0], 24), 3)} px@16`);
};

SECTIONS['s2.8'] = (ctx) => {
  head('§2.8 The badge — zero instances');
  // The card's name census: an object word after the first, as a modifier.
  const re = /-(plus|minus|check|x|ban|clock|arrow|star|lock|heart|slash|off)(-|$)/;
  const hits = ctx.concepts.filter((c) => re.test(c));
  say(`concepts whose name carries a second object word (${re.source}): ${hits.length} — ${hits.join(', ')}`);
  say(`(which of these are badges is the document's reading: volume-off is a state; the rest set the second element beside the first)`);
  const r = MASTERS.map((m) => comparePart(ctx.get('volume-x', m, 'outline', ['line'])[0].d, ctx.get('x-circle-small', m, 'outline', ['line'])[0].d).same);
  say(`volume-x's arm vs x-circle-small's: ${r.map((x) => (x ? 'IDENTICAL' : 'different')).join(' / ')}`);
};

SECTIONS['s2.9'] = (ctx) => {
  head('§2.9 Bend radius across the whole set');
  const B = turningBends(ctx.subs);
  say('| master | style | bends | distinct radii | radii (count) |');
  for (const m of MASTERS) for (const st of STYLES) {
    const b = B.filter((s) => s.master === m && s.style === st);
    const c = new Map(); for (const s of b) c.set(s.bendR, (c.get(s.bendR) || 0) + 1);
    const ks = [...c.keys()].sort(byNum);
    tableRow([m, st, b.length, ks.length, ks.map((k) => (c.get(k) > 1 ? `${k} (${c.get(k)})` : `${k}`)).join(', ')]);
  }
  const o24 = B.filter((s) => s.master === 24 && s.style === 'outline');
  say(`${o24.filter((s) => s.bendR === BEND_MIN_OUTLINE[24]).length} of ${o24.length} outline bends at 24 sit exactly on bendMin`);
  const below = belowOwnStroke(B);
  say(`bends below half their own file's stroke (each file's real stroke): ${below.length}`);
  const twoCase = B.filter((s) => s.bendR < (s.style === 'filled' ? BEND_MIN_FILLED : BEND_MIN_OUTLINE)[s.master] - 1e-9);
  say(`bends below C10's two-case statement (filled = ${MASTERS.map((m) => BEND_MIN_FILLED[m]).join(' · ')}): ${twoCase.length} bends in ${uniq(twoCase.map((s) => s.base + '@' + s.master)).length} drawings, ${uniq(twoCase.map((s) => s.concept)).length} concepts; per master ${MASTERS.map((m) => twoCase.filter((s) => s.master === m).length).join(' / ')}; radii ${MASTERS.map((m) => uniq(twoCase.filter((s) => s.master === m).map((s) => s.bendR)).join(',')).join(' / ')}`);
  say(`   ${uniq(twoCase.map((s) => s.concept)).sort().join(', ')}`);
  const filled = ctx.files.filter((f) => f.style === 'filled');
  const heavy = new Set(), light = new Set();
  for (const f of filled) (f.sw > STROKES[f.master] ? heavy : light).add(f.concept);
  const noShape = filled.filter((f) => !f.paths.some(isShapeFill)).length;
  say(`line-heavy concepts ${heavy.size} · light ${light.size} · mixed across masters ${[...heavy].filter((c) => light.has(c)).length}; filled files with no shape-filled path ${noShape} of ${comma(filled.length)} (${heavy.size} × 3 = ${heavy.size * 3})`);
  if (ctx.concepts.includes('maximize')) {
    const mx = MASTERS.map((m) => `${ctx.get('maximize', m, 'outline', ['bend'])[0].bendR} → ${ctx.get('maximize', m, 'filled', ['bend'])[0].bendR} at ${m}`);
    say(`maximize's corner bracket radius, outline → filled: ${mx.join(', ')}`);
  }
};

SECTIONS['s2.10'] = (ctx) => {
  head('§2.10 C17\'s repeated elements');
  say('| concept | master | element | ink thickness | edge gap | gap ÷ thickness |');
  const ratios = [];
  for (const n of ['more-horizontal', 'more-vertical', 'grid-3', 'list-bullet-2', 'list-bullet', 'list-bullet-3', 'menu', 'menu-2', 'menu-3', 'menu-4']) {
    for (const m of MASTERS) {
      const { el, th, gap } = repeatedSpacing(ctx.get(n, m), ctx.file(n, m).sw);
      ratios.push({ n, m, q: gap / th, el, th, gap });
      tableRow([`\`${n}\``, m, el, th, gap, hu((gap / th), 2)]);
    }
  }
  say('the same, one row per concept (24 / 20 / 16):');
  for (const n of uniq(ratios.map((r) => r.n))) {
    const rs = ratios.filter((r) => r.n === n);
    tableRow([`\`${n}\``, MASTERS.join(' / '), rs[0].el, rs.map((r) => r.th).join(' / '), rs.map((r) => r.gap).join(' / '), rs.map((r) => hu(r.q, 2)).join(' / ')]);
  }
  const qs = ratios.map((r) => r.q);
  say(`ratio across the family: ${hu(Math.min(...qs), 2)} to ${hu(Math.max(...qs), 2)}; exactly 1 for ${uniq(ratios.filter((r) => Math.abs(r.q - 1) < 1e-9).map((r) => r.n)).join(', ')} at ${uniq(ratios.filter((r) => Math.abs(r.q - 1) < 1e-9).map((r) => r.m)).join(' and ')}`);
};

// ── §3 assemblies ──

SECTIONS['s3.1'] = (ctx) => {
  head('§3.1 The container is shared, exactly');
  const comps = RING_PAIRS.flatMap((c) => ringCompare(ctx, c));
  say(`${comps.filter((r) => r.same && r.maxDeviation === 0).length} of ${comps.length} comparisons IDENTICAL at all three masters, residual 0`);
};

SECTIONS['s3.2'] = (ctx) => {
  head('§3.2 The mark in the ring vs the free mark');
  say('| mark | free @24 | in ring @24 | ratio | free @20 | in ring @20 | ratio | free @16 | in ring @16 | ratio |');
  const q = {};
  for (const [free, ring] of [['plus', 'plus-circle'], ['x', 'x-circle']]) {
    const cells = MASTERS.flatMap((m) => { const f = inkSpan(ctx, free, m), r = inkSpan(ctx, ring, m); return [hu(f, 1), hu(r, 1), hu((r / f), 3)]; });
    q[free] = MASTERS.map((m) => inkSpan(ctx, ring, m) / inkSpan(ctx, free, m));
    tableRow([free, ...cells]);
  }
  const ck = (c, m) => { const s = ctx.get(c, m, 'outline', ['bend'])[0]; return r3(s.w + ctx.file(c, m).sw); };
  tableRow(['check (ink width)', ...[24, 20].flatMap((m) => [hu(ck('check', m), 1), String(ck('check-circle', m)), hu((ck('check-circle', m) / ck('check', m)), 3)]), '—', '—', '—']);
  for (const k of ['plus', 'x']) say(`${k}: the ratio falls by ${hu((q[k][0] - q[k][2]), 2)} from 24 to 16, a ${hu((100 * (q[k][0] - q[k][2]) / q[k][0]), 0)}% relative shrink`);
  const triv = ['plus', 'x'].map((k) => `${k}: ${MASTERS.map((m) => { const s = ctx.get(k, m, 'outline', ['line'])[0]; return scaleTrivial(s.d); }).every(Boolean) ? 'scale-trivial (straight lines)' : 'not trivial'}`);
  say(triv.join('; '));
  const cc = MASTERS.map((m) => {
    const a = ctx.get('check-circle', m, 'outline', ['bend'])[0], b = ctx.get('check', m, 'outline', ['bend'])[0];
    const t = comparePart(a.d, b.d), s = comparePart(a.d, b.d, 'scale');
    return `@${m} ${t.same ? 'IDENTICAL' : 'different'}${s.same ? ` | scaled ×${s.scale}` : ' | not a scale either'}`;
  });
  say(`check-circle's check vs check: ${cc.join('   ')}`);
  say('leg ratio (long : short):');
  say('| concept | 24 outline | 20 outline | 24 filled |');
  const ratio = (c, m, st) => { const s = ctx.get(c, m, st, ['bend'])[0]; return s ? r3(Math.max(...s.legs) / Math.min(...s.legs)) : null; };
  const DOC_ROWS = ['check', 'check-small', 'check-circle', 'check-circle-small', 'check-2', 'check-2-small', 'check-3', 'check-4'];
  for (const c of DOC_ROWS) tableRow([`\`${c}\``, hu(ratio(c, 24, 'outline'), 3), hu(ratio(c, 20, 'outline'), 3), (ratio(c, 24, 'filled') == null ? undefined : hu(ratio(c, 24, 'filled'), 3)) ?? `(filled has no bend: ${ctx.get(c, 24, 'filled').map((s) => s.kind).join('+')})`]);
  const pairs = ['check', 'check-2', 'check-3', 'check-4'].map((c) => {
    const d = ratio(c, 24, 'outline'), s = ratio(`${c}-small`, 24, 'outline');
    return { c, q: Math.abs(d - s) / Math.min(d, s), d, s };
  });
  const top = pairs.reduce((a, b) => (b.q > a.q ? b : a));
  say(`default vs small within one variant, 24 outline: ${pairs.map((p) => `${p.c} ${hu((100 * p.q), 1)}%`).join(', ')} — largest ${top.c} ${top.d} vs ${top.s}`);
  const up = (list) => list.map((c) => ({ c, o: ratio(c, 24, 'outline'), f: ratio(c, 24, 'filled') })).filter((x) => x.f != null)
    .map((x) => ({ ...x, q: (x.f - x.o) / x.o }));
  for (const [label, list] of [['the document\'s rows', DOC_ROWS], ['every check concept with a filled bend', ctx.concepts.filter((c) => /^check(-|$)/.test(c) && !/^check-circle/.test(c))]]) {
    const u = up(list), w = u.reduce((a, b) => (b.q > a.q ? b : a));
    say(`filled vs outline leg ratio at 24, ${label}: always more asymmetric ${u.every((x) => x.q > 0)}; worst +${hu((100 * w.q), 1)}% on ${w.c} (${w.o} → ${w.f}); ${u.map((x) => `${x.c} +${hu((100 * x.q), 1)}%`).join(', ')}`);
  }
};

SECTIONS['s3.3'] = (ctx) => {
  head('§3.3 The checkbox\'s check was the ring\'s check — until 16');
  say('| pair | 24 | 20 | 16 |');
  const PAIRS = [['checkbox', 'check-circle'], ['checkbox-2', 'check-circle-3'], ['checkbox-3', 'check-circle-4'], ['checkbox-4', 'check-circle-small']];
  pairTable(ctx, PAIRS.map(([a, b]) => [`\`${a}\` vs \`${b}\``, a, b, ['bend'], 'outline', 0, 0]));
  const raw = (c, m) => ctx.file(c, m).paths.map((p) => p.d).find((d) => /A/.test(d) && !/Z/.test(d));
  say(`24 byte-identical: ${raw('checkbox', 24) === raw('check-circle', 24)} — ${raw('checkbox', 24)}`);
  for (const c of ['checkbox', 'check-circle']) {
    const s = ctx.get(c, 16, 'outline', ['bend'])[0];
    const nums = raw(c, 16).match(/-?\d*\.?\d+/g).map(Number);
    const on8 = (n) => Math.abs(n * 8 - Math.round(n * 8)) < 1e-9;
    const ends = [nums[0], nums[1], nums[nums.length - 2], nums[nums.length - 1]];
    say(`16/${c}.svg  ${raw(c, 16)}   width ${hu(s.w, 2)}; end points (${ends[0]}, ${ends[1]}) (${ends[2]}, ${ends[3]}): x on the eighth grid ${on8(ends[0]) && on8(ends[2])}, y ${on8(ends[1]) && on8(ends[3])}; every number ${nums.every(on8)}`);
  }
  const broken = PAIRS.filter(([a, b]) => !comparePart(ctx.get(a, 16, 'outline', ['bend'])[0].d, ctx.get(b, 16, 'outline', ['bend'])[0].d).same).length;
  say(`pairs identical at 24 and 20 and split at 16: ${broken} of ${PAIRS.length}`);
};

SECTIONS['s3.4'] = (ctx) => {
  head('§3.4 Groups of concepts with identical outline geometry at all three masters');
  const sig = (c, st) => MASTERS.map((m) => ctx.file(c, m, st).paths.map((p) => canonical(p.d).key).sort().join('||')).join('@@');
  const groups = {};
  for (const st of STYLES) {
    const by = new Map();
    for (const c of ctx.concepts) { const s = sig(c, st); if (!by.has(s)) by.set(s, []); by.get(s).push(c); }
    groups[st] = [...by.values()].filter((v) => v.length > 1);
  }
  const O = groups.outline, F = new Set(groups.filled.map((g) => g.join('|')));
  const nC = O.reduce((n, g) => n + g.length, 0);
  say(`${nC} concepts, ${O.length} distinct outline drawings — ${nC - O.length} redundant outline drawings`);
  say('| group | styles identical |');
  for (const g of O) tableRow([g.map((c) => `\`${c}\``).join(' = '), F.has(g.join('|')) ? 'outline and filled' : 'outline only']);
  const fv = O.filter((g) => !F.has(g.join('|')));
  say(`filled-style variants (outline only): ${fv.length} groups, ${fv.reduce((n, g) => n + g.length, 0)} concepts sharing ${fv.length} outline drawings`);
  const alias = O.filter((g) => F.has(g.join('|')));
  const aliasFiles = alias.reduce((n, g) => n + (g.length - 1) * 6, 0);
  const bytes = alias.map((g) => MASTERS.every((m) => STYLES.every((st) => {
    const ds = g.map((c) => ctx.file(c, m, st).paths.map((p) => p.d).join('|'));
    return ds.every((d) => d === ds[0]);
  })));
  say(`identical in both styles: ${alias.length} groups (${alias.map((g) => g.join(' = ')).join('; ')}), ${aliasFiles} files of ${comma(ctx.files.length)}, ${alias.reduce((n, g) => n + g.length - 1, 0)} of ${ctx.concepts.length} concept slots; path text byte-identical: ${bytes.join(', ')}`);
  const same = [];
  for (const c of ctx.concepts) for (const m of MASTERS) {
    const ko = ctx.file(c, m).paths.map((p) => canonical(p.d).key).sort().join('||');
    const kf = ctx.file(c, m, 'filled').paths.map((p) => canonical(p.d).key).sort().join('||');
    if (ko === kf) same.push(`${c}@${m}`);
  }
  say(`filled files whose geometry is identical to their own outline twin: ${same.length} — ${same.join(' ')}`);
};

// ── §4 objects ──

SECTIONS['s4.1'] = (ctx) => {
  head('§4.1 The folder');
  say('| master | body box, all three folders | folder vs folder-2 | folder vs folder-3 | folder-2 vs folder-3 |');
  for (const m of MASTERS) {
    const body = (c) => ctx.get(c, m)[0];
    const ink = (s) => { const w = s.sw / 2; return `${s.w} × ${s.h}, box[${s.box.join(', ')}] (centreline; outer ink ${r3(s.w + s.sw)} × ${r3(s.h + s.sw)})`; };
    const boxes = uniq(['folder', 'folder-2', 'folder-3'].map((c) => ink(body(c))));
    const v = (a, b) => (comparePart(body(a).d, body(b).d).same ? 'IDENTICAL' : 'different');
    tableRow([m, boxes.join(' ≠ '), v('folder', 'folder-2'), v('folder', 'folder-3'), v('folder-2', 'folder-3')]);
  }
  say('| master | `folder-2` tab | `folder-3` tab | tab lengths on the master\'s grid |');
  for (const m of MASTERS) {
    const tab = (c) => ctx.get(c, m, 'outline', ['bend'])[0];
    const t2 = tab('folder-2'), t3 = tab('folder-3');
    const on = (x) => Math.abs(x / gridOf(m) - Math.round(x / gridOf(m))) < 1e-6;
    tableRow([m, `${t2.w} × ${t2.h}`, `${t3.w} × ${t3.h}`, `${on(t2.w) && on(t3.w)}`]);
  }
};

const PAGE = ['file', 'file-text', 'file-text-2', 'files', 'files-2', 'files-3', 'files-4', 'files-5', 'clipboard', 'clipboard-2', 'clipboard-3', 'clipboard-4', 'copy', 'copy-2', 'copy-3', 'save', 'archive', 'presentation', 'presentation-2'];
const PERSON_RE = /^users?(-\d+)?(-(behind|wide|level))?$/;
const ARROW = ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up-right', 'login', 'login-2', 'login-3', 'login-4', 'logout', 'logout-2', 'logout-3', 'logout-4', 'upload', 'upload-2', 'upload-3', 'export', 'external-link', 'external-link-2', 'send', 'sort', 'sort-2', 'sort-3', 'sort-ascending', 'sort-descending'];

function printFamily(ctx, names, ms = MASTERS) {
  say('| master | subpaths | classes | classes shared by 2+ concepts |');
  const res = {};
  for (const m of ms) { res[m] = familyClasses(ctx, names, m); tableRow([`${m} outline`, res[m].n, res[m].classes, res[m].shared.length]); }
  for (const m of ms) {
    say(`  shared @${m}:`);
    for (const g of res[m].shared) say(`    ×${g.size}  ${g.rep.kind} ${g.rep.w} × ${g.rep.h}  residual ${g.maxDeviation}  ${g.concepts.join(' ')}`);
    say(`  near misses between different concepts @${m} (${res[m].near.length}): ${res[m].near.map((n) => `${n.a.split('@')[0]} vs ${n.b.split('@')[0]} ${hu(n.maxDeviation, 4)} u = ${hu(px16(n.maxDeviation, m), 3)} px`).join('; ') || '—'}`);
  }
  return res;
}

SECTIONS['s4.2'] = (ctx) => {
  head('§4.2 The document / page');
  say(`${PAGE.length} concepts (as the card chose)`);
  printFamily(ctx, PAGE);
  for (const m of MASTERS) {
    const b = (c) => { const s = ctx.get(c, m)[0]; return `${s.w} × ${s.h} box[${s.box.join(', ')}]`; };
    say(`clipboard body @${m}: ${b('clipboard')} · clipboard-2 body: ${b('clipboard-2')} · same box ${b('clipboard') === b('clipboard-2')}; bodies ${comparePart(ctx.get('clipboard', m)[0].d, ctx.get('clipboard-2', m)[0].d).same ? 'identical' : 'different paths'}`);
  }
  say(`clipboard-4's clip vs clipboard's: ${MASTERS.map((m) => { const a = ctx.get('clipboard', m)[1], b = ctx.get('clipboard-4', m)[1]; return `${comparePart(a.d, b.d).same ? 'IDENTICAL' : 'different'} (${a.w} × ${a.h})`; }).join(' / ')}`);
  // The two page drawings: the sheet class (rrect-ish) and its fold notch (bend), per family.
  for (const [label, who] of [['full', 'file'], ['small', 'files']]) {
    const part = (m, kind) => familyClasses(ctx, PAGE, m).shared.find((g) => g.rep.kind === kind && g.concepts.includes(who) && g.concepts.length >= 4);
    const fmt = (kind) => [24, 16].map((m) => { const g = part(m, kind); return g ? `${g.rep.w} × ${g.rep.h} @${m}` : `— @${m}`; }).join(' · ');
    const all3 = MASTERS.every((m) => part(m, 'rrect-ish')?.maxDeviation === 0 && part(m, 'bend')?.maxDeviation === 0);
    tableRow([label, fmt('rrect-ish'), `bend ${fmt('bend')}`, (part(24, 'rrect-ish')?.concepts ?? []).join(', '), `residual 0 at every master: ${all3}`]);
  }
  const back = [24, 16].map((m) => familyClasses(ctx, PAGE, m).shared.find((g) => g.rep.kind === 'bend' && g.concepts.join() === 'files,files-5'));
  say(`files / files-5 back sheet: bend ${back.map((g, i) => `${g.rep.w} × ${g.rep.h} @${[24, 16][i]}`).join(', ')}`);
  say('| pair | 24 | 16 |');
  for (const [a, b] of [['clipboard', 'clipboard-2'], ['archive', 'files-5']]) {
    const cell = (m) => {
      const n = familyClasses(ctx, PAGE, m).near.find((x) => [x.a, x.b].map((id) => id.split('@')[0]).sort().join() === [a, b].sort().join());
      return n ? `off ${hu(n.maxDeviation, 3)} u = ${hu(px16(n.maxDeviation, m), 3)} px` : '—';
    };
    tableRow([`${a} vs ${b}`, cell(24), cell(16)]);
  }
  const copyShared = MASTERS.map((m) => familyClasses(ctx, PAGE, m).shared.filter((g) => g.concepts.some((c) => /^copy/.test(c))).length);
  say(`shared classes that include a copy concept: ${copyShared.join(' / ')}`);
};

SECTIONS['s4.3'] = (ctx) => {
  head('§4.3 The person — head ink diameter');
  const fam = ctx.concepts.filter((c) => PERSON_RE.test(c));
  say(`figure-family concepts: ${fam.length}`);
  say('| concept | 24 | 20 | 16 |');
  const TABLE = ['user', 'user-2', 'user-3', 'user-4', 'users', 'users-2', 'users-3', 'users-4', 'users-behind', 'users-2-behind', 'users-wide', 'users-2-wide', 'users-level', 'users-2-level'];
  const head24 = new Map();
  const sizes = Object.fromEntries(MASTERS.map((m) => [m, new Map()]));
  for (const c of TABLE) {
    const v = MASTERS.map((m) => uniq(ctx.get(c, m, 'outline', ['circle']).map(outerDiameter)));
    MASTERS.forEach((m, i) => v[i].forEach((d) => { if (!sizes[m].has(d)) sizes[m].set(d, []); sizes[m].get(d).push(c); }));
    head24.set(c, v[0]);
    tableRow([`\`${c}\``, ...v.map((x) => x.join(' / '))]);
  }
  say(`head sizes at 24 across these ${TABLE.length}: ${sizes[24].size} (${[...sizes[24].keys()].sort(byNum).join(', ')})`);
  say(`sizes one concept alone uses: ${MASTERS.map((m) => `@${m} ${[...sizes[m]].filter(([, cs]) => cs.length === 1).map(([d, cs]) => `⌀${d} ${cs[0]}`).join(', ') || 'none'}`).join(' · ')}`);
  for (const m of [24, 16]) {
    const f = familyClasses(ctx, fam, m);
    const heads = f.shared.filter((g) => g.rep.kind === 'circle');
    say(`shared head classes @${m}: ${heads.map((g) => `⌀${r3(2 * g.rep.r)} centreline (⌀${outerDiameter({ ...g.rep, sw: STROKES[m], ink: 'stroke' })} ink): ${g.size} subpaths, ${g.concepts.length} concepts — ${g.concepts.join(' ')}`).join(' | ')}`);
    say(`within-family near misses @${m} (${f.near.length}): ${f.near.map((n) => `${n.a.split('@')[0]} vs ${n.b.split('@')[0]} ${hu(n.maxDeviation, 4)} u = ${hu(px16(n.maxDeviation, m), 3)} px`).join('; ')}`);
  }
};

SECTIONS['s4.4'] = (ctx) => {
  head('§4.4 The arrow');
  say(`${ARROW.length} concepts (as the card chose)`);
  const res = printFamily(ctx, ARROW);
  say(`doors (closed 'other' parts shared exactly) @24: ${res[24].shared.filter((g) => g.rep.kind === 'other' && g.rep.h > g.rep.w).map((g) => `${g.rep.w} × ${g.rep.h}: ${g.concepts.join(' and ')}`).join(' · ')}`);
};

// ── §5 ──

SECTIONS['s5'] = (ctx) => {
  head('§5 What rises at 16 — and what does not');
  say(`wave 0's fixed band (classify's default, ${NEAR} units at every master), outline: ${MASTERS.map((m) => nearMissCensus(ctx, m, 'outline', NEAR).total).join(' → ')}`);
  say('| master | style | subpaths | band | near misses | same family | across families | per 100 subpaths |');
  for (const m of MASTERS) for (const st of STYLES) {
    const near = bandFor(m);                    // the card's band: classify's 0.5 at 24, held at one share of canvas
    const r = nearMissCensus(ctx, m, st, near);
    tableRow([m, st, comma(r.n), hu(near, 3), r.total, r.fam.length, r.cross, hu((100 * r.total / r.n), 1)]);
  }
  say(`band share of canvas: ${pct(NEAR, 24, 2)}`);
  say(`distinct parts per master (pooled): ${vocab(ctx).pooled.map((r) => comma(r.classes)).join(' / ')}`);
  const cr = circleRadii(ctx);
  const legal = cr.map((x) => Math.round(Math.max(...x.radii) / gridOf(x.m)));
  say(`circle radius vocabulary: ${cr.map((x) => x.radii.length).join(' · ')}, used once ${cr.map((x) => x.once.length).join(' / ')}; legal values up to the largest radius on the master's grid ${legal.join(' / ')}; used ${cr.map((x, i) => `${x.radii.length} of ${legal[i]} (${pct(x.radii.length, legal[i], 0)})`).join(', ')}`);
  for (const [m, st] of [[16, 'outline'], [16, 'filled']]) {
    const r = nearMissCensus(ctx, m, st, bandFor(m));
    say(`within-family drift list, ${m} ${st} — ${r.fam.length} pairs, nearest first:`);
    say('| residual | px@16 | pair |');
    const rows = [...r.fam].sort((a, b) => a.maxDeviation - b.maxDeviation);
    const by = new Map();
    for (const n of rows) {
      const k = hu(n.maxDeviation, 4);
      if (!by.has(k)) by.set(k, { dev: n.maxDeviation, ps: [] });
      by.get(k).ps.push(`${n.a.split('@')[0]} vs ${n.b.split('@')[0]}`);
    }
    for (const [k, { dev, ps }] of by) {
      const c = new Map(); for (const p of ps) c.set(p, (c.get(p) || 0) + 1);
      tableRow([k, hu(px16(dev, m), 3), [...c].map(([p, n]) => (n > 1 ? `${p} ×${n}` : p)).join('; ')]);
    }
  }
  const g3 = nearMissCensus(ctx, 16, 'outline', bandFor(16)).fam.filter((n) => n.a.startsWith('gear-3@') && n.b.startsWith('gear-3@'));
  say(`gear-3 against itself at 16: ${g3.length} pairs, ${hu(Math.min(...g3.map((n) => n.maxDeviation)), 4)}–${hu(Math.max(...g3.map((n) => n.maxDeviation)), 4)} u`);
};

// ── §6–§8: the figures the closing sections restate, and the linter counts ──

SECTIONS['s6'] = (ctx) => {
  head('§6 Judged list — the figures it restates (each computed again here)');
  const ring = (st) => uniq(ringClass(ctx.subs, 24, st).map((s) => s.concept)).length;
  const outside = uniq(ringClass(ctx.subs, 24, 'outline').map((s) => s.concept)).filter((c) => !ringClass(ctx.subs, 24, 'filled').some((s) => s.concept === c)).length;
  say(`container ring: ${ring('outline')} outline concepts, ${ring('filled') + outside} filled (§2.1)`);
  const B = turningBends(ctx.subs).filter((s) => s.master === 24 && s.style === 'outline');
  say(`outline bends on bendMin at 24: ${B.filter((s) => s.bendR === BEND_MIN_OUTLINE[24]).length} of ${B.length}; bends below their own stroke's minimum: ${belowOwnStroke(turningBends(ctx.subs)).length} (§2.9)`);
  const chev = ctx.concepts.filter((c) => /^chevron-(down|up|left|right)/.test(c)).length;
  say(`chevron concepts ${chev} (§2.6)`);
  const big = (m, st) => { const t = arrowheadClasses(bucket(ctx, m, st)).rows[0]; return `${t.concepts.length} concepts at ${m} ${st}`; };
  say(`the arrowhead's big class: ${big(24, 'outline')}, ${big(20, 'outline')}, ${big(24, 'filled')} (§2.7)`);
  say(`arrow shared classes: ${[24, 16].map((m) => { const f = familyClasses(ctx, ARROW, m); return `${f.shared.length} of ${f.classes} at ${m}`; }).join(', ')} (§4.4)`);
  say('(the rest of §6 restates §1.4, §2.3, §2.5, §2.10, §3.2–§3.4 and §4.1–§4.3 figure for figure; run those sections)');
};

SECTIONS['s7'] = (ctx) => {
  head('§7 What only Maruti\'s eye can settle — the figures in the questions');
  const v2 = MASTERS.flatMap((m) => CHEV.sizes.map((z) => { const c = `chevron-down-2${z}`; return Math.abs(ctx.get(c, m, 'filled')[0].turn - ctx.get(c, m)[0].turn); }));
  say(`the cap moved the variant-2 angle by up to ${hu(Math.max(...v2), 1)}°`);
  const q = (m) => inkSpan(ctx, 'plus-circle', m) / inkSpan(ctx, 'plus', m);
  const qx = (m) => inkSpan(ctx, 'x-circle', m) / inkSpan(ctx, 'x', m);
  say(`mark in ring ÷ free mark: plus ${hu(q(16), 2)} at 16 against ${hu(q(24), 2)} at 24; x ${hu(qx(16), 2)} at 16`);
  // The document's proposed on-grid dot sizes (its §2.3c / §6 item 6 / §7 proposal) — input under test.
  for (const [d, m] of [[2.5, 20], [2.375, 16]]) {
    const r = (d - STROKES[m]) / 2, step = gridOf(m);
    say(`an outline dot of ink ⌀${d} at ${m} needs centreline r ${r} — on the ${step} grid: ${Math.abs(r / step - Math.round(r / step)) < 1e-9}`);
  }
};

/** Shared-part persistence (§8 check 1), concept by concept: two concepts that share a part
 *  exactly — the same canonical key, so the same shape in the same place — at one master. The
 *  proposed rule says they must share it at all three, so a pair is flagged when the number of
 *  parts they share is not the same at 24, 20 and 16. Counting per concept pair (not per subpath
 *  index) keeps a drawing that reorders its paths between masters from reading as a split.
 *  `lost` = the pairs where two masters agree on the larger count and the third has fewer. */
export function persistenceCensus(subs) {
  const res = {};
  for (const st of STYLES) {
    const keys = new Map();                     // concept → master → key → count
    for (const s of subs) if (s.style === st) {
      if (!keys.has(s.concept)) keys.set(s.concept, Object.fromEntries(MASTERS.map((m) => [m, new Map()])));
      const mm = keys.get(s.concept)[s.master];
      mm.set(s.key, (mm.get(s.key) || 0) + 1);
    }
    const pairs = new Map();
    for (const m of MASTERS) {
      const owners = new Map();
      for (const [c, v] of keys) for (const k of v[m].keys()) { if (!owners.has(k)) owners.set(k, []); owners.get(k).push(c); }
      for (const [k, cs] of owners) for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
        const id = [cs[i], cs[j]].sort().join(' + ');
        if (!pairs.has(id)) pairs.set(id, Object.fromEntries(MASTERS.map((x) => [x, 0])));
        pairs.get(id)[m] += Math.min(keys.get(cs[i])[m].get(k), keys.get(cs[j])[m].get(k));
      }
    }
    const all = [...pairs].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([id, c]) => ({ id, c: MASTERS.map((m) => c[m]) }));
    const varying = all.filter((x) => !(x.c[0] === x.c[1] && x.c[1] === x.c[2]));
    const lost = varying.filter((x) => { const mx = Math.max(...x.c); return x.c.filter((v) => v === mx).length === 2; });
    const notAll = all.filter((x) => Math.min(...x.c) === 0);   // shares at some master, not at every one
    res[st] = { all, varying, lost, notAll };
  }
  return res;
}

SECTIONS['s8'] = (ctx) => {
  head('§8 Handover — the counts behind the proposed linter checks');
  const p = persistenceCensus(ctx.subs);
  say('check 1, shared-part persistence — concept pairs sharing a part exactly (same shape, same place):');
  say('| style | pairs sharing ≥ 1 part at some master | share count the same at 24, 20, 16 | not the same | two masters agree, the third has fewer |');
  for (const st of STYLES) tableRow([st, p[st].all.length, p[st].all.length - p[st].varying.length, p[st].varying.length, p[st].lost.length]);
  // The document's sentence: "Two files that share a subpath exactly at one master must share it at
  // all three". Two readings, both printed; the sentence is about a PART, so (i) is the one it states.
  say(`   the document's rule, read per part ("share it at all three": a shared part missing at another master),`);
  say(`     counted as the number of shared parts differing between masters: ${STYLES.map((st) => `${st} ${p[st].varying.length}`).join(', ')} — the reading the sentence states`);
  say(`   read per pair (shares something at one master, nothing at another): ${STYLES.map((st) => `${st} ${p[st].notAll.length}`).join(', ')} — a stricter subset`);
  const cb = p.outline.lost.filter((x) => /checkbox/.test(x.id) && /check-circle/.test(x.id));
  say(`   checkbox / check-circle pairs among them (outline): ${cb.length} — ${cb.map((x) => `${x.id} ${x.c.join('/')}`).join('; ')}`);
  say(`   outline, two masters agree and the third has fewer (shared parts at 24 / 20 / 16): ${p.outline.lost.map((x) => `${x.id} ${x.c.join('/')}`).join('; ')}`);
  let tot = 0; const list = [];
  for (const m of MASTERS) for (const st of STYLES) {
    const r = nearMissCensus(ctx, m, st, 0.05);     // the document's proposed warning band for check 2
    tot += r.fam.length;
    for (const n of r.fam) list.push(`${m} ${st} ${hu(n.maxDeviation, 3)} u ${n.a.split('@')[0]} vs ${n.b.split('@')[0]}`);
  }
  say(`check 2, within-family near miss within 0.05 units: ${tot} pairs — ${list.join('; ')}`);
  let wide = 0;
  for (const m of MASTERS) for (const st of STYLES) wide += nearMissCensus(ctx, m, st, bandFor(m)).fam.length;
  say(`   with the band at 2% of canvas: ${wide} pairs across the six buckets, ${nearMissCensus(ctx, 16, 'outline', bandFor(16)).fam.length} of them at 16 outline`);
  const off = offGridCircles(ctx.subs);
  say(`check 4, off-grid radius: ${off.length} circles in ${uniq(off.map((s) => s.base + '@' + s.master)).length} files, ${uniq(off.map((s) => s.concept)).length} concepts`);
};

// ── 6. CLI ─────────────────────────────────────────────────────────────────

export const SECTION_NAMES = Object.keys(SECTIONS);

/** Run sections on a context and return the printed lines (the CLI prints them). */
export function runSections(ctx, names = SECTION_NAMES) {
  out.length = 0;
  for (const n of names) SECTIONS[n](ctx);
  return out.splice(0);
}

const USAGE = `usage: node tools/audit/primitives-probe.mjs <pin-dir> [section …]
  <pin-dir>   a tree with src/icons/{24,20,16}/*.svg (git archive 5933041)
  sections    ${SECTION_NAMES.join(' ')}`;

function main() {
  const args = process.argv.slice(2);
  const pin = args.find((a) => !a.startsWith('--'));
  if (!pin || !existsSync(join(resolve(pin), 'src/icons/24')) || !statSync(join(resolve(pin), 'src/icons/24')).isDirectory()) {
    console.error(USAGE); process.exit(2);
  }
  const wanted = args.filter((a) => !a.startsWith('--') && a !== pin);
  const bad = wanted.filter((s) => !SECTIONS[s]);
  if (bad.length) { console.error(`unknown section: ${bad.join(', ')}\n${USAGE}`); process.exit(2); }
  const ctx = makeContext(resolve(pin));
  for (const line of runSections(ctx, wanted.length ? wanted : SECTION_NAMES)) console.log(line);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
