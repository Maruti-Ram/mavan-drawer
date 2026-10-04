#!/usr/bin/env node
// tools/audit/refs/central-axes.mjs — Central Icons, what a parameter change costs (plan card 2.5).
//
// WHY CENTRAL. It is the only reference that draws the SAME icon at several strokes and several radii:
// 1,927 component sets, each with 30 variants on four axes — filled off/on · stroke 2/1.5/1 ·
// radius 0/1/2/3 · join square/round (radius 0 has both joins, radius 1-3 only round: 5 of 8 pairs).
// Change one number, redraw by hand, keep the rest: a free experiment in what varies when you change one
// free number. That is what strand C (the parameter map) needs.
//
// AUDIT ONLY. Reads research/references/central/figma/ (written by `figma.mjs ingest`); writes only under
// research/references/central/figma/analysis/. Third-party geometry: gitignored, internal comparison,
// never shipped, never copied into a tracked file.
//
// RUN  node tools/audit/refs/central-axes.mjs [--png] [--ours]   (about two minutes: the knock-out section rasterises; --ours also tests the radius relation on src/icons, read-only)
//
// SAMPLE. The whole readable set: 1,926 concepts (the 1,927th, `burger`, is unreadable — Figma raised
// "Network: invalid loop" reading its vector network), 57,780 drawings. A sample would only add sampling error to
// a read that costs 28 bridge calls; the eye check (--png) uses a fixed even spread of 64 (every 30th concept
// in catalogue order from the 16th) because looking at 1,926 is not a thing a person does.
//
// WHAT IS TRUSTED, AND WHY (measured in section 0):
//   · boxes. Figma's render bounds are wrong on rotated / flipped nodes and a hair tight on some rounded vectors;
//     `d` alone misses rounding that is a node PROPERTY. So the box used is mine, from the path with node rounding
//     put back (`roundSharp`), and a drawing counts as 'verified' only when it agrees with Figma's render bounds
//     to 0.01. Rotated drawings are kept apart; disputed ones are left out of every hold/give figure and counted.
//   · tolerance 0.02 for "held" (Figma rounds to 4 decimals, so 0.02 is 200 times the rounding noise and well under the 0.25 grid designers draw on).

import fs from 'node:fs';
import path from 'node:path';
import {
  conceptsOf, parsePath, REF_ROOT, boxOf, skeletonBox, sideDiff, maxAbs, allRoundCentre, sideKinds, sideLabel,
  straightPieces, effectiveCmds, cornersOfRecord, offsetVertex, extremeKinds, endsCensus, flatten, rasterise, iou,
  distanceTo, analyticBox, renderBox, sheetPng,
} from './pairgeom.mjs';

const PNG = process.argv.includes('--png');
const OURS = process.argv.includes('--ours');
const OUT = path.join(REF_ROOT, 'central', 'figma', 'analysis');
fs.mkdirSync(OUT, { recursive: true });
const lines = [];
const say = (...a) => { const s = a.join(' '); lines.push(s); console.log(s); };
const pct = (n, d) => (d ? (100 * n / d).toFixed(1) + '%' : 'n/a');
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(p * (s.length - 1))] : null; };
const TOL = 0.02;
const COMBOS = [['0', 'square'], ['0', 'round'], ['1', 'round'], ['2', 'round'], ['3', 'round']];
const SIDES = ['left', 'top', 'right', 'bottom'];
const key = (r) => `${r.variant.filled}|${r.variant.stroke}|${r.variant.radius}|${r.variant.join}`;
const T0 = Date.now();

// ── load once, keep only what the sections need ─────────────────────────
const concepts = [];
let _i = 0;
for (const c of conceptsOf('central')) concepts.push({ id: `${c.group}/${c.name}#${_i++}`, name: c.name, group: c.group, by: new Map(c.records.map((r) => [key(r), r])), n: c.records.length });   // names repeat (two `images-4` in one group); ids do not
const kindOf = new Map();   // what the outline's open ends look like, classified on stroke 2, radius 0, round
for (const c of concepts) { const r = c.by.get('off|2|0|round'); if (!r) continue; const e = endsCensus(r); kindOf.set(c.id, e.ends.some((x) => x.kind === 'diag') ? 'diagonal-ended' : e.ends.length ? 'axis-ended only' : 'no open ends'); }
const cat = JSON.parse(fs.readFileSync(path.join(REF_ROOT, 'central', 'figma', 'catalogue.json'), 'utf8'));
const have = new Set(concepts.map((c) => c.group + '|' + c.name));
const missing = cat.rows.filter((r) => !have.has(r[0] + '|' + r[1])).map((r) => r[0] + '/' + r[1]);

say('# central-axes — Central Icons, what a parameter change costs');
say(`run ${new Date().toISOString()}`);
say('');
say('## 0. What was read, and how far to trust it');
say(`  catalogue: ${cat.rows.length} component sets; read: ${concepts.length} concepts, ${concepts.reduce((n, c) => n + c.n, 0)} drawings; unreadable: ${missing.join(', ') || 'none'}`);
const nv = {}; for (const c of concepts) nv[c.n] = (nv[c.n] || 0) + 1;
say(`  variants per concept: ${JSON.stringify(nv)}`);
const comboSet = new Set(); for (const c of concepts) for (const k of c.by.keys()) { const p = k.split('|'); comboSet.add(`${p[2]}/${p[3]}`); }
say(`  radius/join pairs present: ${[...comboSet].sort().join(' ')}`);

// instrument: my box (with node rounding) against Figma's render bounds
const bs = { verified: 0, rotated: 0, disputed: 0, none: 0 };
const dispCause = {};
for (const c of concepts) for (const r of c.by.values()) {
  const b = boxOf(r); bs[b.status]++;
  if (b.status === 'disputed') {
    const mixedCr = r.paths.some((p) => p.cornerRadiusProp === 'mixed');
    const k = mixedCr ? 'per-vertex corner radius (cornerRadius = mixed)' : !b.a.exact ? 'caps/joins differ along the path (mixed)' : b.gap > 5 ? 'render box off by more than 5 (flip / transform)' : 'other / small (<5)';
    dispCause[k] = (dispCause[k] || 0) + 1;
  }
}
const nAll = Object.values(bs).reduce((a, b) => a + b, 0);
say(`  ink box, mine vs Figma render bounds: verified ${bs.verified} (${pct(bs.verified, nAll)}) · rotated/flipped ${bs.rotated} (render bounds unreliable; mine stands alone) · disputed ${bs.disputed} (${pct(bs.disputed, nAll)}) · none ${bs.none}`);
say(`  disputed, by cause: ${JSON.stringify(dispCause)}`);
// node-level rounding
let propDriven = 0, radiusDrawings = 0;
for (const c of concepts) for (const r of c.by.values()) {
  if (r.variant.filled !== 'off' || r.variant.radius === '0') continue;
  radiusDrawings++;
  if (r.paths.some((p) => typeof p.cornerRadiusProp === 'number' && p.cornerRadiusProp > 0 && p.node && ['VECTOR', 'STAR', 'POLYGON'].includes(p.node.type) && !/[CQ]/.test(p.d))) propDriven++;
}
say(`  radius 1-3 outline drawings where a path is a bare polyline with a cornerRadius PROPERTY (rounding exists only as a property; vectorPaths shows it sharp): ${propDriven} of ${radiusDrawings} (${pct(propDriven, radiusDrawings)})`);
// does putting node rounding back reproduce Figma's render bounds?
{
  let n = 0, raw = 0, rebuilt = 0;
  for (const c of concepts) for (const r of c.by.values()) {
    if (r.meta.flags && r.meta.flags.rotated) continue;
    if (!r.paths.some((p) => typeof p.cornerRadiusProp === 'number' && p.cornerRadiusProp > 0 && p.node && ['VECTOR', 'STAR', 'POLYGON'].includes(p.node.type))) continue;
    const b = renderBox(r); if (!b) continue;
    n++;
    const a0 = analyticBox(r), a1 = analyticBox(r, { rounded: true, cap: 0.5 });
    if (maxAbs(sideDiff({ x0: a0.x0, y0: a0.y0, x1: a0.x1, y1: a0.y1 }, b)) <= 0.01) raw++;
    if (maxAbs(sideDiff({ x0: a1.x0, y0: a1.y0, x1: a1.x1, y1: a1.y1 }, b)) <= 0.01) rebuilt++;
  }
  say(`  non-rotated drawings carrying a numeric cornerRadius on a VECTOR/STAR/POLYGON path: ${n}; my box agrees with Figma's render bounds to 0.01 for ${raw} (${pct(raw, n)}) from the path alone and ${rebuilt} (${pct(rebuilt, n)}) with the rounding put back`);
}
// painted weights vs the axis
let wMatch = 0, wMis = 0;
for (const c of concepts) for (const r of c.by.values()) {
  if (r.variant.filled !== 'off') continue;
  const ws = r.paths.filter((p) => (p.paint === 'stroke' || p.paint === 'both') && p.stroke).map((p) => p.stroke.weight);
  if (!ws.length) continue;
  if (ws.every((w) => Math.abs(w - Number(r.variant.stroke)) < 0.01)) wMatch++; else wMis++;
}
say(`  outline drawings in which every stroke paints the axis weight: ${wMatch} of ${wMatch + wMis} (${pct(wMatch, wMatch + wMis)}); the rest keep a fixed-width detail or a different weight`);

// the worked examples the document quotes, so each is traceable
{
  const byName = (n) => concepts.find((c) => c.name === n);
  say('  examples quoted in the document:');
  const t1 = byName('chevron-triangle-down-medium');
  if (t1) {
    const row = ['0', '1', '2', '3'].map((rad) => { const r = t1.by.get(`off|2|${rad}|round`); const b = renderBox(r); const a = analyticBox(r); return `radius ${rad}: cornerRadius ${r.paths.map((p) => p.cornerRadiusProp).join('/')}, path "${r.paths[0].d}", Figma left edge ${(b.x0).toFixed(3)}, path-only left edge ${a.x0.toFixed(3)}`; });
    say(`     chevron-triangle-down-medium (outline, stroke 2, round): ${row.join(' | ')}`);
  }
  const t2 = byName('chevron-double-left');
  if (t2) { const r = t2.by.get('off|2|0|round'); const b = renderBox(r), a = analyticBox(r); say(`     chevron-double-left (outline, 2, r0, round): Figma render bounds x ${b.x0.toFixed(2)}..${b.x1.toFixed(2)}, from the path x ${a.x0.toFixed(2)}..${a.x1.toFixed(2)}; flagged rotated: ${!!(r.meta.flags && r.meta.flags.rotated)}`); }
  const t3 = byName('chevron-bottom');
  if (t3) say(`     chevron-bottom (outline, stroke 2, round) ink height at radius 0..3: ${['0', '1', '2', '3'].map((rad) => { const b = boxOf(t3.by.get(`off|2|${rad}|round`)).box; return (b.y1 - b.y0).toFixed(2); }).join(' > ')}`);
  const t4 = byName('cross-large');
  if (t4) say(`     cross-large (stroke 2, r0): ${['round', 'square'].map((j) => ['off', 'on'].map((f) => { const b = boxOf(t4.by.get(`${f}|2|0|${j}`)).box; return `${f === 'off' ? 'outline' : 'filled'} ${j} x ${b.x0.toFixed(3)}..${b.x1.toFixed(3)}`; }).join(', ')).join(' | ')}`);
  const wt = {};
  for (const c of concepts) for (const r of c.by.values()) { if (r.variant.filled !== 'off') continue; for (const p of r.paths) if ((p.paint === 'stroke' || p.paint === 'both') && p.stroke && Math.abs(p.stroke.weight - Number(r.variant.stroke)) > 0.01) { const k = (+p.stroke.weight.toFixed(2)).toString(); wt[k] = (wt[k] || 0) + 1; } }
  say(`     painted stroke weights that are not the axis value, by weight (paths): ${Object.entries(wt).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k} x${v}`).join(' · ')}`);
}

// ── 1. what the axes do to the path data ────────────────────────────────
function sameD(a, b, tol = 0.01) {
  if (a.paths.length !== b.paths.length) return false;
  for (let i = 0; i < a.paths.length; i++) {
    const A = parsePath(a.paths[i].d), B = parsePath(b.paths[i].d);
    if (A.length !== B.length) return false;
    for (let k = 0; k < A.length; k++) { if (A[k].c !== B[k].c) return false; for (let j = 0; j < A[k].p.length; j++) if (Math.abs(A[k].p[j] - B[k].p[j]) > tol) return false; }
  }
  return true;
}
const sameCr = (a, b) => a.paths.length === b.paths.length && a.paths.every((p, i) => { const x = p.cornerRadiusProp, y = b.paths[i].cornerRadiusProp; return x === y || (typeof x === 'number' && typeof y === 'number' && Math.abs(x - y) < 1e-6); });
const sameGeom = (a, b) => sameD(a, b) && sameCr(a, b);   // the path data AND the rounding property
say('');
say('## 1. What each axis does to the drawing (path data compared to 0.01, node cornerRadius included)');
const strokeSame = { off: {}, on: {} };
for (const c of concepts) for (const f of ['off', 'on']) {
  let n = 0;
  for (const [rad, j] of COMBOS) { const a = c.by.get(`${f}|2|${rad}|${j}`), b = c.by.get(`${f}|1.5|${rad}|${j}`), d = c.by.get(`${f}|1|${rad}|${j}`); if (a && b && d && sameD(a, b) && sameD(b, d)) n++; }
  strokeSame[f][n] = (strokeSame[f][n] || 0) + 1;
}
say(`  STROKE axis, outline: concepts by how many of the 5 radius/join pairs keep identical geometry at stroke 2, 1.5 and 1: ${JSON.stringify(strokeSame.off)}`);
say(`     -> redrawn at every pair: ${strokeSame.off[0]} of ${concepts.length} (${pct(strokeSame.off[0], concepts.length)}); identical for all 5: ${strokeSame.off[5] || 0}`);
say(`  STROKE axis, filled: ${JSON.stringify(strokeSame.on)}`);
const radCls = { off: {}, on: {} };
for (const c of concepts) for (const f of ['off', 'on']) {
  const rs = ['0', '1', '2', '3'].map((r) => c.by.get(`${f}|2|${r}|round`));
  const cl = []; for (const r of rs) { const k = cl.find((x) => sameD(x[0], r)); if (k) k.push(r); else cl.push([r]); }
  const crDiff = rs.some((r) => !sameCr(r, rs[0]));
  const k = cl.length === 1 ? (crDiff ? 'path identical, cornerRadius property differs' : 'nothing changes') : `${cl.length} distinct paths${crDiff ? ' (+ property)' : ''}`;
  radCls[f][k] = (radCls[f][k] || 0) + 1;
}
const rsum = (o) => { const t = Object.values(o).reduce((a, b) => a + b, 0); return Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v} (${pct(v, t)})`).join(' · '); };
say(`  RADIUS axis, outline (stroke 2, round, r = 0..3): ${rsum(radCls.off)}`);
say(`  RADIUS axis, filled: ${rsum(radCls.on)}`);
const dist30 = [], dist15o = [], dist15f = [];
for (const c of concepts) {
  const cnt = (recs) => { const cl = []; for (const r of recs) { if (!cl.some((x) => sameGeom(x, r))) cl.push(r); } return cl.length; };
  const all = [...c.by.values()];
  dist30.push(cnt(all)); dist15o.push(cnt(all.filter((r) => r.variant.filled === 'off'))); dist15f.push(cnt(all.filter((r) => r.variant.filled === 'on')));
}
say(`  distinct geometries among a concept's 30 variants: median ${med(dist30)}, 30 of 30 distinct in ${dist30.filter((v) => v === 30).length} concepts, 27+ in ${dist30.filter((v) => v >= 27).length}, fewer than 10 in ${dist30.filter((v) => v < 10).length}; of the 15 outline variants median ${med(dist15o)}, of the 15 filled median ${med(dist15f)}`);

// ── 2. stroke axis: hold the outer edge? ────────────────────────────────
say('');
say(`## 2. Stroke axis: does the outer edge hold while the centreline moves? (tolerance ${TOL}; stroke 2 is the reference)`);
const trip = { 'edge held, centreline moved': 0, 'centreline held, edge shrinks': 0, 'both unchanged': 0, 'neither (mixed)': 0 };
let nTrip = 0, nTripSkipped = 0;
const tripByCombo = {}, tripByKind = {}, tripRaw = [];
for (const c of concepts) for (const [rad, j] of COMBOS) {
  const recs = ['2', '1.5', '1'].map((s) => c.by.get(`off|${s}|${rad}|${j}`));
  if (recs.some((r) => !r)) continue;
  const bx = recs.map(boxOf);
  if (!bx.every((b) => b.status === 'verified')) { nTripSkipped++; continue; }
  nTrip++;
  const sk = recs.map(skeletonBox);
  const dB = [1, 2].map((i) => sideDiff(bx[0].box, bx[i].box)), dC = [1, 2].map((i) => sideDiff(sk[0], sk[i]));
  tripRaw.push({ dB: dB.map(maxAbs), dC: dC.map(maxAbs) });
  const bh = dB.every((d) => maxAbs(d) <= TOL), ch = dC.every((d) => maxAbs(d) <= TOL);
  const k = bh && ch ? 'both unchanged' : bh ? 'edge held, centreline moved' : ch ? 'centreline held, edge shrinks' : 'neither (mixed)';
  trip[k]++;
  const kk = `r${rad}/${j}`; tripByCombo[kk] = tripByCombo[kk] || {}; tripByCombo[kk][k] = (tripByCombo[kk][k] || 0) + 1;
  const kd = kindOf.get(c.id) || '?'; tripByKind[kd] = tripByKind[kd] || {}; tripByKind[kd][k] = (tripByKind[kd][k] || 0) + 1;
}
say(`  (concept x radius/join) triples with all three boxes verified: ${nTrip}; left out (a box disputed or rotated): ${nTripSkipped}`);
for (const [k, v] of Object.entries(trip)) say(`     ${k.padEnd(34)} ${String(v).padStart(5)}  ${pct(v, nTrip)}`);
for (const [k, v] of Object.entries(tripByCombo)) say(`       ${k.padEnd(10)} ${JSON.stringify(v)}`);
{
  const parts = [0.005, 0.01, 0.02, 0.05, 0.1].map((t) => {
    let e = 0, ce = 0, bo = 0, ne = 0;
    for (const r of tripRaw) { const bh = r.dB.every((d) => d <= t), ch = r.dC.every((d) => d <= t); if (bh && ch) bo++; else if (bh) e++; else if (ch) ce++; else ne++; }
    return `${t}: edge ${pct(e, tripRaw.length)} · centreline ${pct(ce, tripRaw.length)} · neither ${pct(ne, tripRaw.length)}`;
  });
  say(`  sensitivity to the hold tolerance — ${parts.join(' | ')}`);
}
say('  by the concept\'s open ends (a closed-only drawing is the nearest thing to a container; a diagonal-ended one the nearest to a mark):');
for (const [k, v] of Object.entries(tripByKind)) { const tot = Object.values(v).reduce((a, b) => a + b, 0); say(`     ${k.padEnd(16)} triples ${String(tot).padStart(5)} · edge held, centreline moved ${pct(v['edge held, centreline moved'] || 0, tot).padStart(6)} · centreline held ${pct(v['centreline held, edge shrinks'] || 0, tot).padStart(5)} · both unchanged ${pct(v['both unchanged'] || 0, tot).padStart(5)} · neither ${pct(v['neither (mixed)'] || 0, tot).padStart(6)}`); }

say('  side by side — the same question per SIDE of the box, by what holds the side at stroke 2 (round caps and joins only, so "centreline point +- half the weight" is the ink):');
const sideTab = {}; let nSideTrip = 0, nSkipStroke = 0;
for (const c of concepts) for (const [rad, j] of COMBOS.filter((x) => x[1] === 'round')) {
  const recs = ['2', '1.5', '1'].map((s) => c.by.get(`off|${s}|${rad}|${j}`));
  if (recs.some((r) => !r)) continue;
  if (!recs.every(allRoundCentre)) { nSkipStroke++; continue; }
  const bx = recs.map(boxOf);
  if (!bx.every((b) => b.status === 'verified')) continue;
  nSideTrip++;
  const kinds = sideKinds(recs[0], bx[0].box);
  for (const side of SIDES) {
    const lab = sideLabel(kinds[side]);
    const get = (b) => (side === 'left' ? b.box.x0 : side === 'top' ? b.box.y0 : side === 'right' ? b.box.x1 : b.box.y1);
    const sg = side === 'left' || side === 'top' ? 1 : -1;
    const shrink = [1, 2].map((i) => sg * (get(bx[i]) - get(bx[0])));
    const hold = shrink.every((v) => Math.abs(v) <= TOL), centre = shrink.every((v, i) => Math.abs(v - [0.25, 0.5][i]) <= TOL);
    const t = sideTab[lab] = sideTab[lab] || { n: 0, hold: 0, centre: 0, other: 0, grow: 0 };
    t.n++; if (hold) t.hold++; else if (centre) t.centre++; else { t.other++; if (shrink[1] < -TOL) t.grow++; }
  }
}
say(`     triples used ${nSideTrip}; left out for strokes that are not CENTER-aligned round-capped round-joined ${nSkipStroke}`);
for (const [k, v] of Object.entries(sideTab).sort((a, b) => b[1].n - a[1].n)) say(`     ${k.padEnd(9)} sides ${String(v.n).padStart(6)} · edge HELD ${pct(v.hold, v.n).padStart(6)} · centreline held (edge shrinks by half the change) ${pct(v.centre, v.n).padStart(6)} · other ${pct(v.other, v.n).padStart(6)} (of which the edge GROWS as the line thins: ${v.grow})`);
say('     (closed = a closed contour; capAxis = end of an open stroke square-on to the side; capDiag = end of an open stroke running slanted; open = interior of an open stroke; fill = a filled shape)');

// named exemplars (radius 0, round join, outline): the ink box at stroke 2 / 1.5 / 1
{
  const EX = ['folder-1', 'heart', 'bell', 'plus-large', 'cross-large', 'chevron-bottom', 'chevron-triangle-down-small', 'arrow-path-left', 'magic-wand', 'draft-simple'];
  say('  exemplars (outline, radius 0, round; ink box x0,y0,x1,y1 at stroke 2 | 1.5 | 1):');
  for (const name of EX) {
    const c = concepts.find((k) => k.name === name); if (!c) continue;
    const bs3 = ['2', '1.5', '1'].map((st) => c.by.get(`off|${st}|0|round`)).map(boxOf);
    const f = (b) => (b.box ? [b.box.x0, b.box.y0, b.box.x1, b.box.y1].map((v) => +v.toFixed(2)).join(',') : 'n/a') + (b.status === 'verified' ? '' : '*');
    say(`     ${name.padEnd(28)} ${bs3.map(f).join('  |  ')}`);
  }
  say('     (* = box not verified against Figma)');
}
// which coordinates move, stroke 2 -> 1, same command structure
say('');
say('  on-curve points, stroke 2 -> 1, drawings whose command structure is identical at both (x and y counted separately; units: canvas units; the change in half-stroke is 0.5):');
const rawTopo = (r) => r.paths.map((p) => parsePath(p.d).map((c) => c.c).join('')).join('|');
for (const rad of ['0', '2']) {
  const H = {}; let nc = 0;
  for (const c of concepts) {
    const a = c.by.get(`off|2|${rad}|round`), b = c.by.get(`off|1|${rad}|round`);
    if (!a || !b || (a.meta.flags && a.meta.flags.rotated) || rawTopo(a) !== rawTopo(b)) continue;
    nc++;
    for (let i = 0; i < a.paths.length; i++) {
      const A = parsePath(a.paths[i].d), B = parsePath(b.paths[i].d);
      for (let k = 0; k < A.length; k++) { const pa = A[k].p, pb = B[k].p; if (!pa.length) continue; const n = pa.length; for (const ax of [0, 1]) { const d = Math.abs(pa[n - 2 + ax] - pb[n - 2 + ax]); const kk = d <= 0.02 ? 'held' : Math.abs(d - 0.5) <= 0.02 ? 'moves 0.5' : Math.abs(d - 0.25) <= 0.02 ? 'moves 0.25' : d < 0.5 ? 'other < 0.5' : 'other > 0.5'; H[kk] = (H[kk] || 0) + 1; } }
    }
  }
  const tot = Object.values(H).reduce((a, b) => a + b, 0);
  say(`     radius ${rad}, round: ${nc} concepts, ${tot} coordinates — ${Object.entries(H).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v, tot)}`).join(' · ')}`);
}

// ── 3. stroke axis: hold the angle, move the point? ────────────────────
say('');
say('## 3. Stroke axis: do slanted pieces keep their angle while their ends move?');
const mid = (s) => [(s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2];
const ang = { diag: 0, matched: 0, still: 0, moved: 0, h005: 0, h05: 0, h1: 0 };
const angDelta = [], angByCls = {};
for (const c of concepts) for (const [rad, j] of COMBOS) {
  const a2 = c.by.get(`off|2|${rad}|${j}`), a1 = c.by.get(`off|1|${rad}|${j}`);
  if (!a2 || !a1 || (a2.meta.flags && a2.meta.flags.rotated) || (a1.meta.flags && a1.meta.flags.rotated)) continue;
  const A = straightPieces(a2), B = straightPieces(a1);
  const used = new Set();
  // is the outer edge held in this triple? (for splitting the angle result)
  const ba = boxOf(a2), bb = boxOf(a1);
  const edge = ba.status === 'verified' && bb.status === 'verified' ? (maxAbs(sideDiff(ba.box, bb.box)) <= TOL ? 'edge held' : 'edge not held') : 'box unverified';
  for (const s0 of A) {
    if (Math.min(s0.angle, 90 - s0.angle) <= 1) continue;
    ang.diag++;
    let best = null; const m0 = mid(s0);
    B.forEach((s1, i) => { if (used.has(i)) return; const m1 = mid(s1); const dm = Math.hypot(m1[0] - m0[0], m1[1] - m0[1]); if (dm > 0.8 || Math.abs(s1.len - s0.len) > 1.5) return; if (!best || dm < best.dm) best = { i, dm, s1 }; });
    if (!best) continue;
    used.add(best.i); ang.matched++;
    const s1 = best.s1;
    const d1 = Math.hypot(s1.a[0] - s0.a[0], s1.a[1] - s0.a[1]) + Math.hypot(s1.b[0] - s0.b[0], s1.b[1] - s0.b[1]);
    const d2 = Math.hypot(s1.a[0] - s0.b[0], s1.a[1] - s0.b[1]) + Math.hypot(s1.b[0] - s0.a[0], s1.b[1] - s0.a[1]);
    if (Math.min(d1, d2) <= 0.04) { ang.still++; continue; }
    ang.moved++;
    const dA = Math.abs(s0.angle - s1.angle);
    angDelta.push(dA);
    const t = angByCls[edge] = angByCls[edge] || { moved: 0, h005: 0, h05: 0 };
    t.moved++; if (dA <= 0.05) { ang.h005++; t.h005++; } if (dA <= 0.5) { ang.h05++; t.h05++; } if (dA <= 1) ang.h1++;
  }
}
say(`  slanted straight pieces (more than 1 degree off horizontal/vertical) at stroke 2, non-rotated: ${ang.diag}; matched to a piece at stroke 1 by position: ${ang.matched}; did not move: ${ang.still}; moved: ${ang.moved}`);
say(`  of the ${ang.moved} that moved: angle kept to 0.05 degrees in ${ang.h005} (${pct(ang.h005, ang.moved)}), to 0.5 in ${ang.h05} (${pct(ang.h05, ang.moved)}), to 1 degree in ${ang.h1} (${pct(ang.h1, ang.moved)})`);
say(`  size of the change, over ALL ${ang.moved} moved pieces (61% of them changed by under 0.05, which is why the median is tiny): median ${q(angDelta, 0.5).toFixed(3)}, p75 ${q(angDelta, 0.75).toFixed(2)}, p90 ${q(angDelta, 0.9).toFixed(2)}, p99 ${q(angDelta, 0.99).toFixed(2)} degrees`);
{
  const notKept = angDelta.filter((d) => d > 0.05), within1 = notKept.filter((d) => d <= 1).length;
  say(`  of the ${notKept.length} moved pieces that did NOT keep the angle to 0.05 degrees: within 1 degree ${within1} (${pct(within1, notKept.length)}), over 1 degree ${notKept.length - within1} (${pct(notKept.length - within1, notKept.length)}); median change of those ${q(notKept, 0.5).toFixed(2)}, p90 ${q(notKept, 0.9).toFixed(2)}`);
}
for (const [k, v] of Object.entries(angByCls)) say(`     ${k.padEnd(16)} moved ${String(v.moved).padStart(5)} · kept to 0.05 ${pct(v.h005, v.moved)} · kept to 0.5 ${pct(v.h05, v.moved)}`);

// ── 4. filled radius ────────────────────────────────────────────────────
say('');
say('## 4. Filled corner radius = outline centreline radius + half the stroke?');
say('  every corner of the outline (rounded, or a sharp vertex) pushed out by half the stroke; the filled twin at the same stroke/radius/join searched for a corner at that place with the same turn');
const radTab = {}, radRows = [];
for (const c of concepts) for (const s of ['2', '1.5', '1']) for (const [rad, j] of COMBOS) {
  const o = c.by.get(`off|${s}|${rad}|${j}`), f = c.by.get(`on|${s}|${rad}|${j}`);
  if (!o || !f) continue;
  const oc = cornersOfRecord(o).filter((x) => x.stroke && x.stroke.align === 'CENTER' && x.paint === 'stroke');
  if (!oc.length) continue;
  const fc = cornersOfRecord(f);
  const kk = `r${rad}/${j}`;
  const t = radTab[kk] = radTab[kk] || { n: 0, matched: 0, d005: 0, d05: 0, rounded: { n: 0, ok: 0 }, sharp: { n: 0, ok: 0 } };
  for (const x of oc) {
    t.n++;
    const h = x.stroke.weight / 2;
    const rExp = x.kind === 'sharp' ? (x.stroke.join === 'ROUND' ? h : 0) : x.r + h;
    const V = offsetVertex(x, h);
    let best = null;
    for (const y of fc) { if (Math.abs(y.turn - x.turn) > 2) continue; const dd = Math.hypot(y.V[0] - V[0], y.V[1] - V[1]); if (dd <= 0.15 && (!best || dd < best.dd)) best = { dd, y }; }
    if (!best) continue;
    t.matched++;
    const diff = best.y.r - rExp;
    const ok = Math.abs(diff) <= 0.05;
    if (ok) t.d005++; if (Math.abs(diff) <= 0.5) t.d05++;
    const sub = x.kind === 'sharp' ? t.sharp : t.rounded; sub.n++; if (ok) sub.ok++;
    radRows.push({ name: c.id, ok, diff, found: best.y.r, centre: x.r, h, kind: x.kind });
  }
}
let tN = 0, tM = 0, tOk = 0;
for (const [k, v] of Object.entries(radTab)) { tN += v.n; tM += v.matched; tOk += v.d005; say(`     ${k.padEnd(10)} corners ${String(v.n).padStart(6)} · found in the filled twin ${pct(v.matched, v.n).padStart(6)} · of those, radius = centreline + half stroke to 0.05: ${pct(v.d005, v.matched).padStart(6)} (rounded corners ${pct(v.rounded.ok, v.rounded.n)} of ${v.rounded.n}; sharp vertices ${pct(v.sharp.ok, v.sharp.n)} of ${v.sharp.n})`); }
say(`     all: corners ${tN}, found ${tM} (${pct(tM, tN)}), relation holds to 0.05 in ${tOk} (${pct(tOk, tM)})`);
const byC = new Map(); for (const r of radRows) { const e = byC.get(r.name) || { n: 0, bad: 0 }; e.n++; if (!r.ok) e.bad++; byC.set(r.name, e); }
const cv = [...byC.values()];
say(`     by concept: ${cv.length} concepts with at least one matched corner; relation holds at every matched corner in ${cv.filter((e) => e.bad === 0).length} (${pct(cv.filter((e) => e.bad === 0).length, cv.length)}); fails somewhere in ${cv.filter((e) => e.bad > 0).length}; fails in over half of its corners in ${cv.filter((e) => e.bad / e.n > 0.5).length}`);
const off = radRows.filter((r) => !r.ok);
say(`     where it fails (${off.length} corners): filled radius smaller than expected ${off.filter((r) => r.diff < 0).length}, larger ${off.filter((r) => r.diff > 0).length}; filled radius equals the outline CENTRELINE radius (half stroke not added) in ${off.filter((r) => r.kind === 'corner' && Math.abs(r.found - r.centre) <= 0.05).length}`);
// does the answer depend on how strictly corners are matched? (strokes 2 and 1 only)
{
  const R = {};
  for (const c of concepts) for (const st of ['2', '1']) for (const [rad, j] of COMBOS) {
    const o = c.by.get(`off|${st}|${rad}|${j}`), f = c.by.get(`on|${st}|${rad}|${j}`);
    if (!o || !f) continue;
    const oc = cornersOfRecord(o).filter((x) => x.stroke && x.stroke.align === 'CENTER' && x.paint === 'stroke');
    if (!oc.length) continue;
    const fc = cornersOfRecord(f);
    for (const vt of [0.08, 0.15, 0.3]) for (const tt of [1, 2, 4]) {
      const t = R[`vertex<=${vt} turn<=${tt}`] = R[`vertex<=${vt} turn<=${tt}`] || { n: 0, m: 0, ok: 0 };
      for (const x of oc) {
        t.n++;
        const h = x.stroke.weight / 2, rExp = x.kind === 'sharp' ? (x.stroke.join === 'ROUND' ? h : 0) : x.r + h, V = offsetVertex(x, h);
        let best = null;
        for (const y of fc) { if (Math.abs(y.turn - x.turn) > tt) continue; const dd = Math.hypot(y.V[0] - V[0], y.V[1] - V[1]); if (dd <= vt && (!best || dd < best.dd)) best = { dd, y }; }
        if (!best) continue;
        t.m++; if (Math.abs(best.y.r - rExp) <= 0.05) t.ok++;
      }
    }
  }
  const pcts = Object.values(R).map((t) => [100 * t.m / t.n, 100 * t.ok / t.m]);
  say(`     sensitivity (strokes 2 and 1; vertex tolerance 0.08 / 0.15 / 0.3 x turn tolerance 1 / 2 / 4 degrees, nine runs): found ${Math.min(...pcts.map((p) => p[0])).toFixed(1)}-${Math.max(...pcts.map((p) => p[0])).toFixed(1)}%, relation holds ${Math.min(...pcts.map((p) => p[1])).toFixed(1)}-${Math.max(...pcts.map((p) => p[1])).toFixed(1)}% of those`);
}
// what the radius axis value is
const rh = {};
for (const c of concepts) for (const rr of c.by.values()) {
  if (rr.variant.filled !== 'off' || rr.variant.join !== 'round' || rr.variant.radius === '0') continue;
  const k = `r${rr.variant.radius} s${rr.variant.stroke}`;
  for (const x of cornersOfRecord(rr, { sharp: false })) { if (x.kind !== 'corner' || x.paint !== 'stroke' || x.turn < 80 || x.turn > 100) continue; const v = (Math.round(x.r * 20) / 20).toFixed(2); (rh[k] = rh[k] || {})[v] = (rh[k][v] || 0) + 1; }
}
for (const [k, H] of Object.entries(rh).sort()) { const tot = Object.values(H).reduce((a, b) => a + b, 0); say(`     outline 90-degree corner centreline radius at axis ${k}: ${Object.entries(H).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([v, n]) => `${v} ${pct(n, tot)}`).join(' · ')} (n=${tot})`); }

// ── 5. radius axis: does the box change? ───────────────────────────────
say('');
say('## 5. Radius axis: does it ever change the ink box? (reference: radius 0, round join; same stroke, same fill state)');
for (const f of ['off', 'on']) {
  let sets = 0, held = 0; const mags = []; const kt = {};
  for (const c of concepts) for (const s of ['2', '1.5', '1']) {
    const recs = ['0', '1', '2', '3'].map((r) => c.by.get(`${f}|${s}|${r}|round`));
    if (recs.some((r) => !r)) continue;
    const bx = recs.map(boxOf);
    if (!bx.every((b) => b.status === 'verified')) continue;
    sets++;
    const d = [1, 2, 3].map((i) => sideDiff(bx[0].box, bx[i].box));
    const worst = Math.max(...d.map(maxAbs));
    if (worst <= TOL) held++; else mags.push(worst);
    const sk = skeletonBox(recs[0]); const ek = extremeKinds(recs[0], sk);
    for (const side of SIDES) { const ch = Math.max(...d.map((x) => Math.abs(x[side]))); const k = ek[side]; const t = kt[k] = kt[k] || { n: 0, held: 0, m: [] }; t.n++; if (ch <= TOL) t.held++; else t.m.push(ch); }
  }
  say(`  ${f === 'off' ? 'outline' : 'filled '} — of all the sides that change, by what held them at radius 0: ${Object.entries(kt).map(([k, t]) => `${k} ${t.m.length}`).join(' · ')} (total ${Object.values(kt).reduce((a, t) => a + t.m.length, 0)})`);
  say(`  ${f === 'off' ? 'outline' : 'filled '}: ${sets} (concept x stroke) sets with verified boxes; box never changes in ${held} (${pct(held, sets)}); changes at some radius in ${sets - held}; when it does, worst side moves median ${med(mags).toFixed(2)}, p90 ${q(mags, 0.9).toFixed(2)}, max ${Math.max(...mags).toFixed(2)}`);
  for (const [k, t] of Object.entries(kt).sort((a, b) => b[1].n - a[1].n)) say(`       side held (at r=0) by ${k.padEnd(6)}: sides ${String(t.n).padStart(6)} · box never changes ${pct(t.held, t.n).padStart(6)}${t.m.length ? ` · when it changes: median ${med(t.m).toFixed(2)}, max ${Math.max(...t.m).toFixed(2)}` : ''}`);
}
say('       (flat = a straight edge square-on to the side; apex = a sharp vertex that rounding will cut back; smooth = a ring or an arc already)');

// ── 6. outline against filled ──────────────────────────────────────────
say('');
say('## 6. Outline against filled, same stroke/radius/join: is the outer box held?');
let pairs = 0, pHold = 0, pUnver = 0; const pRows = [], defTab = {};
for (const c of concepts) for (const s of ['2', '1.5', '1']) for (const [rad, j] of COMBOS) {
  const o = c.by.get(`off|${s}|${rad}|${j}`), f = c.by.get(`on|${s}|${rad}|${j}`);
  if (!o || !f) continue;
  const bo = boxOf(o), bf = boxOf(f);
  if (bo.status !== 'verified' || bf.status !== 'verified') { pUnver++; continue; }
  pairs++;
  const d = sideDiff(bo.box, bf.box), m = maxAbs(d);
  if (m <= 0.01) pHold++;
  pRows.push({ name: c.id, m });
  if (allRoundCentre(o)) { const kinds = sideKinds(o, bo.box); for (const side of SIDES) { const lab = sideLabel(kinds[side]); const t = defTab[lab] = defTab[lab] || { n: 0, hold: 0, off: [] }; t.n++; if (Math.abs(d[side]) <= 0.01) t.hold++; else t.off.push(Math.abs(d[side])); } }
}
say(`  pairs with both boxes verified: ${pairs} (left out: ${pUnver}); outer box equal on all four sides to 0.01: ${pHold} (${pct(pHold, pairs)})`);
say('  per side, by what holds the side in the OUTLINE (round-capped outlines only):');
for (const [k, t] of Object.entries(defTab).sort((a, b) => b[1].n - a[1].n)) say(`     ${k.padEnd(9)} sides ${String(t.n).padStart(6)} · equal ${pct(t.hold, t.n).padStart(6)}${t.off.length ? ` · when not: median ${med(t.off).toFixed(2)}, max ${Math.max(...t.off).toFixed(2)}` : ''}`);
const cC = new Map(); for (const r of pRows) { const e = cC.get(r.name) || { n: 0, bad: 0 }; e.n++; if (r.m > 0.01) e.bad++; cC.set(r.name, e); }
const kt = {};
for (const [name, v] of cC) { const k = kindOf.get(name) || '?'; const t = kt[k] = kt[k] || { n: 0, allHold: 0, everyBreaks: 0, pairs: 0, bad: 0 }; t.n++; t.pairs += v.n; t.bad += v.bad; if (v.bad === 0) t.allHold++; else if (v.bad === v.n) t.everyBreaks++; }
say('  by the outline\'s open ends (classified on stroke 2, radius 0, round):');
for (const [k, t] of Object.entries(kt)) say(`     ${k.padEnd(16)} concepts ${String(t.n).padStart(4)} · pairs equal ${pct(t.pairs - t.bad, t.pairs).padStart(6)} · every pair breaks in ${t.everyBreaks} (${pct(t.everyBreaks, t.n)}) · all pairs hold in ${t.allHold} (${pct(t.allHold, t.n)})`);
say(`  (icons in the three rows above: ${Object.values(kt).reduce((a, t) => a + t.n, 0)} — those with at least one verified pair; the share below counts every icon)`);
const nDiag = [...kindOf.values()].filter((v) => v === 'diagonal-ended').length;
say(`  share of concepts with a diagonal-ended outline: ${nDiag} of ${kindOf.size} (${pct(nDiag, kindOf.size)})`);

// ── 7. the knock-out and the line-only marks (rasterised) ──────────────
say('');
say('## 7. What the filled twin keeps and cuts (radius 0, round join; outlines with round caps; rasterised at 24 px/unit)');
const SC = 24;
function sampleLine(pts, closed, step, trim) {
  const out = []; const P = closed ? [...pts, pts[0]] : pts;
  let total = 0; const cum = [0];
  for (let i = 1; i < P.length; i++) { total += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); cum.push(total); }
  if (total < 1e-6) return out;
  const lo = closed ? 0 : trim, hi = closed ? total : total - trim;
  for (let s = lo; s <= hi; s += step) { let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const t = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]); out.push([P[i - 1][0] + t * (P[i][0] - P[i - 1][0]), P[i - 1][1] + t * (P[i][1] - P[i - 1][1])]); }
  return out;
}
const cls = { A: 0, B: 0, C: 0 }, cut = { '2': [], '1.5': [], '1': [] }, kept = { '2': [], '1.5': [], '1': [] };
let skippedRound = 0, skippedFill = 0;
for (const c of concepts) for (const s of ['2', '1.5', '1']) {
  const o = c.by.get(`off|${s}|0|round`), f = c.by.get(`on|${s}|0|round`);
  if (!o || !f) continue;
  if (!allRoundCentre(o) || (o.meta.flags && (o.meta.flags.rotated || o.meta.flags.dashed))) { if (s === '2') skippedRound++; continue; }
  if (f.paths.some((p) => p.paint !== 'fill') || (f.meta.flags && f.meta.flags.rotated)) { if (s === '2') skippedFill++; continue; }
  let mo, mf; try { mo = rasterise(o, { scale: SC, rounded: true }); mf = rasterise(f, { scale: SC, rounded: true }); } catch { continue; }
  if (s === '2') { const v = iou(mo, mf); cls[v >= 0.999 ? 'A' : v >= 0.9 ? 'B' : 'C']++; }
  const inv = new Uint8Array(mf.data.length); for (let i = 0; i < inv.length; i++) inv[i] = mf.data[i] ? 0 : 1;
  const dInk = distanceTo(mf.data, mf.w, mf.h, SC), dBg = distanceTo(inv, mf.w, mf.h, SC);
  for (const p of o.paths) {
    if (p.paint !== 'stroke') continue;
    const air = [], keep = [];
    for (const sp of flatten(effectiveCmds(p, { cap: 0.5 }), 30)) for (const pt of sampleLine(sp.pts, sp.closed, 0.15, 1.2)) {
      const i = Math.min(mf.w - 1, Math.max(0, Math.floor(pt[0] * SC))), j = Math.min(mf.h - 1, Math.max(0, Math.floor(pt[1] * SC))), k = j * mf.w + i;
      if (mf.data[k]) keep.push(2 * dBg[k]); else air.push(2 * dInk[k]);
    }
    if (air.length >= 5 && air.length >= 3 * keep.length) cut[s].push(med(air) / Number(s));
    if (keep.length >= 5 && keep.length >= 3 * air.length) kept[s].push(med(keep) / Number(s));
  }
}
const nCls = cls.A + cls.B + cls.C;
say(`  filled ink against outline ink at stroke 2 (${nCls} concepts; ${skippedRound} left out for non-round or rotated or dashed outlines, ${skippedFill} for filled twins that still carry a stroke): identical (IoU >= 0.999) ${cls.A} (${pct(cls.A, nCls)}) · near (0.90 to 0.999) ${cls.B} (${pct(cls.B, nCls)}) · redrawn ${cls.C} (${pct(cls.C, nCls)})`);
const within = (a, lo, hi) => a.filter((v) => v > lo && v <= hi).length;
for (const s of ['2', '1.5', '1']) say(`  stroke ${s}: ${cut[s].length} outline strokes are mostly cut away in the filled twin; the cut is within 10% of ONE stroke wide in ${within(cut[s], 0.9, 1.1)} (${pct(within(cut[s], 0.9, 1.1), cut[s].length)}), narrower than 0.9 stroke in ${within(cut[s], 0, 0.9)}, wider than 1.1 in ${within(cut[s], 1.1, 1e9)}; ${kept[s].length} are kept, of which twice the distance to the nearest background is within 10% of one stroke in ${within(kept[s], 0.9, 1.1)} (${pct(within(kept[s], 0.9, 1.1), kept[s].length)}) — the filled edge sits where the outline's outer edge is`);
say('     (cut width / stroke: 1.0 means the cut is the outline\'s own band; if the cut were a fixed width the ratio would grow as the stroke thins)');

// ── 8. eye check ───────────────────────────────────────────────────────
if (PNG) {
  const STEP = 30, OFFSET = 15; const cells = [], names = [], nested = []; let i = 0;
  for (const c of conceptsOf('central')) {
    if (i++ < OFFSET || (i - 1 - OFFSET) % STEP !== 0) continue;
    const g = (f, s) => c.records.find((r) => r.variant.filled === f && r.variant.stroke === s && r.variant.radius === '0' && r.variant.join === 'round');
    const a = g('off', '2'), b = g('off', '1'); if (!a || !b) continue;
    const A = rasterise(a, { scale: 10, loose: true }), B = rasterise(b, { scale: 10, loose: true });
    cells.push({ a: A, b: B }); names.push(c.name);
    let inB = 0, out = 0; for (let k = 0; k < A.data.length; k++) { if (B.data[k]) { inB++; if (!A.data[k]) out++; } }
    nested.push({ name: c.name, out: inB ? out / inB : 0 });
  }
  fs.writeFileSync(path.join(OUT, 'sample64-stroke2-vs-1.png'), sheetPng(cells, { cols: 8, cell: 118, pad: 3 }));
  const outAt = (t) => nested.filter((n) => n.out > t).length;
  say(`\n## 8. Eye check (loose raster, every stroke drawn round): of ${nested.length} concepts, the share of the stroke-1 ink that lies OUTSIDE the stroke-2 ink is over 1% in ${outAt(0.01)}, over 5% in ${outAt(0.05)}, over 10% in ${outAt(0.10)} (${nested.filter((n) => n.out > 0.10).map((n) => `${n.name} ${(100 * n.out).toFixed(0)}%`).join(', ')}); a thinner copy of the same shape would be 0%`);
  say(`## 8. Eye check: ${cells.length} concepts (every ${STEP}th from the ${OFFSET + 1}th), stroke 2 (blue) over stroke 1 (red), dark where both -> analysis/sample64-stroke2-vs-1.png`);
}
if (OURS) await import('./untitled-ours.mjs').then((m) => m.radiusRelation(say, { pct, r3: (v) => Math.round(v * 1000) / 1000 }));
say('');
say(`done in ${((Date.now() - T0) / 1000).toFixed(0)} s`);
fs.writeFileSync(path.join(OUT, 'report.txt'), lines.join('\n') + '\n');
