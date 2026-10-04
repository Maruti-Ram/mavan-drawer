#!/usr/bin/env node
// tools/audit/refs/untitled-pairs.mjs — Untitled UI, outline against solid, isolated (plan card 2.4).
//
// WHY THIS PAIR. Untitled UI draws one size (24), two parallel styles (Line Icons, Solid Icons), and
// nothing else varies — so it is the cleanest available test of the one rule our two styles rest on:
// the filled drawing's outer ink edge equals the outline's. Every other reference mixes in a second
// variable (Fluent: sizes; Central: stroke and radius).
//
// AUDIT ONLY. Reads what `figma.mjs ingest` wrote under research/references/untitled/figma/ and (with
// --ours) our own src/icons read-only. Writes only under research/references/untitled/figma/analysis/.
// Third-party geometry: gitignored, internal comparison, never shipped, never copied into a tracked file.
//
// RUN  node tools/audit/refs/untitled-pairs.mjs [--ours] [--png]      (about 30 s; --ours adds the same questions asked of src/icons, read-only; --png writes the contact sheets)
//
// WHAT IT MEASURES, per pair (one outline drawing, one solid drawing of the same concept):
//   box        outer ink box, per side. Computed from the path and the stroke (independent of Figma),
//              and checked against Figma's own render bounds on every drawing (section 0).
//   class      A identical (solid ink == outline ink, IoU >= 0.999: the solid IS the outlined stroke),
//              B near-identical (0.90 <= IoU < 0.999), C redrawn (< 0.90). Rasterised at 32 px/unit.
//   ends       whether the outline has an open stroke whose end runs diagonally (> 1 degree off
//              horizontal/vertical) — the marks whose ink-box side is held by a round cap on a slant.
//   definers   for each of the four sides, what holds that side in the OUTLINE: a diagonal-ended cap,
//              an axis-ended cap, or something else (a curve, an edge, a bend).
//   bands      for every outline stroke path: is its centreline still ink in the solid (retained) or not
//              (knocked out)? A retained path's nearest background is half the stroke away when the
//              solid's outer edge sits on the outline's outer edge; a knocked-out path's air is as wide
//              as the cut the solid made.
//   corners    every rounded corner of the outline pushed out by half the stroke (the derived expectation)
//              and looked for in the solid by place: radius found vs radius expected.

import fs from 'node:fs';
import path from 'node:path';
import {
  conceptsOf, parsePath, flatten, analyticBox, renderBox, sideDiff, maxAbs, rasterise, iou, areaOf, distanceTo,
  cornerRuns, offsetVertex, sheetPng, closedSilhouette, REF_ROOT, r2, r3, segmentsOf,
} from './pairgeom.mjs';

const argv = process.argv.slice(2);
const OURS = argv.includes('--ours');
const PNG = argv.includes('--png');
const OUT = path.join(REF_ROOT, 'untitled', 'figma', 'analysis');
fs.mkdirSync(OUT, { recursive: true });
const lines = [];
const say = (...a) => { const s = a.join(' '); lines.push(s); console.log(s); };
const pct = (n, d) => (d ? (100 * n / d).toFixed(1) + '%' : 'n/a');
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len = (v) => Math.hypot(v[0], v[1]);
const fromAxis = (v) => { const a = (Math.atan2(v[1], v[0]) * 180) / Math.PI; const m = ((a % 90) + 90) % 90; return Math.min(m, 90 - m); };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const SCALE = 32;
const TOL_BOX = 0.01;
const SIDES_ORDER = ['left', 'top', 'right', 'bottom'];
function hist(arr, bs) { const h = {}; for (const v of arr) { const b = bs.find((x) => v <= x); const k = b === undefined ? '>' + bs.at(-1) : '<=' + b; h[k] = (h[k] || 0) + 1; } return h; }

// ── ends of open strokes ─────────────────────────────────────────────────
function startTan(s) {
  if (s.t === 'L') return sub(s.b, s.a);
  const c1 = sub(s.c1, s.a); if (len(c1) > 1e-6) return c1;
  if (s.t === 'C') { const c2 = sub(s.c2, s.a); if (len(c2) > 1e-6) return c2; }
  return sub(s.b, s.a);
}
function endTan(s) {
  if (s.t === 'L') return sub(s.b, s.a);
  if (s.t === 'C') { const t = sub(s.b, s.c2); if (len(t) > 1e-6) return t; const t2 = sub(s.b, s.c1); if (len(t2) > 1e-6) return t2; return sub(s.b, s.a); }
  const t = sub(s.b, s.c1); if (len(t) > 1e-6) return t; return sub(s.b, s.a);
}
/** Open ends of every stroked subpath: [{point, tan, dev, kind}], plus counts of closed subpaths and dots. */
function openEnds(rec) {
  const ends = []; let closed = 0, dots = 0;
  for (const p of rec.paths) {
    if (!(p.paint === 'stroke' || p.paint === 'both')) continue;
    const segs = segmentsOf(parsePath(p.d));
    const bySp = new Map();
    for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
    for (const list of bySp.values()) {
      if (list[0].closed) { closed++; continue; }
      if (list.reduce((a, s) => a + len(sub(s.b, s.a)), 0) < 1e-6) { dots++; continue; }
      for (const [pt, tan] of [[list[0].a, startTan(list[0])], [list[list.length - 1].b, endTan(list[list.length - 1])]]) {
        if (len(tan) < 1e-9) continue;
        const dev = fromAxis(tan);
        ends.push({ point: pt, tan, dev, kind: dev > 1 ? 'diag' : 'axis', weight: p.stroke.weight });
      }
    }
  }
  return { ends, closed, dots };
}

/** Which kinds of element hold each side of the outline's ink box (within 0.006). */
function sideDefiners(rec, box) {
  const sides = { left: new Set(), top: new Set(), right: new Set(), bottom: new Set() };
  const TOL = 0.006;
  for (const p of rec.paths) {
    if (p.paint !== 'stroke') continue;
    const h = p.stroke.weight / 2;
    const cmds = parsePath(p.d);
    const subs = flatten(cmds, 40);
    const segs = segmentsOf(cmds);
    const bySp = new Map();
    for (const s of segs) { if (!bySp.has(s.sp)) bySp.set(s.sp, []); bySp.get(s.sp).push(s); }
    subs.forEach((sp, si) => {
      const list = bySp.get(si) || [];
      let endKinds = [null, null];
      if (!sp.closed && list.length) {
        const total = list.reduce((a, s) => a + len(sub(s.b, s.a)), 0);
        if (total < 1e-6) endKinds = ['dot', 'dot'];
        else endKinds = [fromAxis(startTan(list[0])) > 1 ? 'diagCap' : 'axisCap', fromAxis(endTan(list[list.length - 1])) > 1 ? 'diagCap' : 'axisCap'];
      }
      const n = sp.pts.length;
      sp.pts.forEach((q, i) => {
        const kind = !sp.closed && (i === 0 || i === n - 1) ? endKinds[i === 0 ? 0 : 1] : 'curve';
        if (Math.abs(q[0] - h - box.x0) < TOL) sides.left.add(kind);
        if (Math.abs(q[0] + h - box.x1) < TOL) sides.right.add(kind);
        if (Math.abs(q[1] - h - box.y0) < TOL) sides.top.add(kind);
        if (Math.abs(q[1] + h - box.y1) < TOL) sides.bottom.add(kind);
      });
    });
  }
  const pick = (s) => (s.has('diagCap') ? 'diagCap' : s.has('axisCap') ? 'axisCap' : s.has('dot') ? 'dot' : s.size ? 'curve/edge' : 'none');
  return Object.fromEntries(Object.entries(sides).map(([k, v]) => [k, pick(v)]));
}

function sample(pts, closed, step, trim) {
  const out = [];
  const P = closed ? [...pts, pts[0]] : pts;
  let total = 0; const cum = [0];
  for (let i = 1; i < P.length; i++) { total += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); cum.push(total); }
  if (total < 1e-6) return out;
  const lo = closed ? 0 : trim, hi = closed ? total : total - trim;
  for (let s = lo; s <= hi; s += step) {
    let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
    const t = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]);
    out.push([P[i - 1][0] + t * (P[i][0] - P[i - 1][0]), P[i - 1][1] + t * (P[i][1] - P[i - 1][1])]);
  }
  return out;
}

// ── main ─────────────────────────────────────────────────────────────────
const T0 = Date.now();
const pairs = [];
let nRec = 0, nBoxAgree = 0, nBoxMax = 0, recOnly = [], solidOnly = [], multi = [];
const instrumentWorst = [];
for (const c of conceptsOf('untitled')) {
  for (const r of c.records) {
    const a = analyticBox(r), b = renderBox(r);
    nRec++;
    const m = maxAbs(sideDiff(a, b));
    if (m <= TOL_BOX) nBoxAgree++; else instrumentWorst.push([m, c.group + '/' + c.name, r.style]);
    nBoxMax = Math.max(nBoxMax, m);
  }
  const o = c.records.filter((r) => r.style === 'outline'), s = c.records.filter((r) => r.style === 'filled');
  const key = c.group + '/' + c.name;
  if (o.length === 1 && s.length === 1) pairs.push({ key, group: c.group, name: c.name, o: o[0], s: s[0] });
  else if (o.length === 0) solidOnly.push(key);
  else if (s.length === 0) recOnly.push(key);
  else multi.push(key);
}
say('# untitled-pairs — Untitled UI, outline against solid');
say(`run ${new Date().toISOString()}; ${nRec} drawings read; raster ${SCALE} px/unit`);
say('');
say('## 0. The instrument: my ink box against Figma\'s render bounds');
say(`  ${nBoxAgree} of ${nRec} drawings agree within ${TOL_BOX} on all four sides (worst ${r4(nBoxMax)}).`);
if (instrumentWorst.length) say('  disagreeing:', JSON.stringify(instrumentWorst.slice(0, 10)));
say('');
say('## 1. Who pairs with whom');
say(`  concepts with exactly one outline and one solid: ${pairs.length}`);
say(`  solid only (no line twin): ${solidOnly.length} — ${solidOnly.join(', ')}`);
say(`  outline only (no solid twin): ${recOnly.length} — ${recOnly.join(', ')}`);
say(`  duplicated name (more than one drawing of a style; set aside): ${multi.length} — ${multi.join(', ')}`);
function r4(v) { return Math.round(v * 10000) / 10000; }

const rows = [];
for (const P of pairs) {
  const A = analyticBox(P.o), B = analyticBox(P.s);
  const d = sideDiff(A, B);
  const mo = rasterise(P.o, { scale: SCALE }), ms = rasterise(P.s, { scale: SCALE });
  const inkIoU = iou(mo, ms);
  const cls = inkIoU >= 0.999 ? 'A' : inkIoU >= 0.9 ? 'B' : 'C';
  const E = openEnds(P.o);
  const def = sideDefiners(P.o, A);
  // bands
  const inv = new Uint8Array(ms.data.length); for (let i = 0; i < inv.length; i++) inv[i] = ms.data[i] ? 0 : 1;
  const dInk = distanceTo(ms.data, ms.w, ms.h, SCALE), dBg = distanceTo(inv, ms.w, ms.h, SCALE);
  const bands = [];
  for (const p of P.o.paths) {
    if (p.paint !== 'stroke') continue;
    const air = [], kept = [];
    for (const sp of flatten(parsePath(p.d), 40)) for (const q of sample(sp.pts, sp.closed, 0.1, 1.25)) {
      const i = Math.min(ms.w - 1, Math.max(0, Math.floor(q[0] * SCALE))), j = Math.min(ms.h - 1, Math.max(0, Math.floor(q[1] * SCALE)));
      const k = j * ms.w + i;
      if (ms.data[k]) kept.push(2 * dBg[k]); else air.push(2 * dInk[k]);
    }
    bands.push({ nAir: air.length, nKept: kept.length, airMed: med(air), keptMed: med(kept) });
  }
  // corners: outline centreline corners, pushed out by half the stroke, looked for in the solid
  const solidCorners = P.s.paths.filter((p) => p.paint === 'fill' || p.paint === 'both').flatMap((p) => cornerRuns(parsePath(p.d)).filter((c) => c.kind === 'corner'));
  const corners = [];
  for (const p of P.o.paths) {
    if (p.paint !== 'stroke') continue;
    const h = p.stroke.weight / 2;
    for (const c of cornerRuns(parsePath(p.d))) {
      if (c.kind !== 'corner') continue;
      const rec = { r: c.r, smooth: c.smooth, turn: c.turn, outer: null, inner: null };
      const tryMatch = (off, wantR) => {
        const V = offsetVertex(c, off);
        let best = null;
        for (const s of solidCorners) {
          if (Math.abs(s.turn - c.turn) > 2) continue;
          const dd = Math.hypot(s.V[0] - V[0], s.V[1] - V[1]);
          if (dd <= 0.15 && (!best || dd < best.dd)) best = { dd, r: s.r, smooth: s.smooth };
        }
        return best ? { found: best.r, expected: wantR, diff: best.r - wantR, dd: best.dd, smooth: best.smooth } : null;
      };
      rec.outer = tryMatch(+h, c.r + h);
      if (c.r - h > 0.2) rec.inner = tryMatch(-h, c.r - h);
      corners.push(rec);
    }
  }
  rows.push({
    key: P.key, d, box: maxAbs(d), inkIoU, cls, ends: E, def, bands, corners,
    areaO: areaOf(mo), areaS: areaOf(ms), weights: [...new Set(P.o.paths.filter((p) => p.stroke).map((p) => p.stroke.weight))],
  });
}
say('');
say(`## 2. The box record (${rows.length} clean pairs, tolerance ${TOL_BOX} on every side)`);
const hold = rows.filter((r) => r.box <= TOL_BOX);
say(`  hold on all four sides: ${hold.length} of ${rows.length} (${pct(hold.length, rows.length)}); break: ${rows.length - hold.length}`);
const bins = [0.0005, 0.001, 0.01, 0.05, 0.25, 0.5, 1.001, 2.001, 99];
const hb = {}; for (const r of rows) { const b = bins.find((x) => r.box <= x); hb[b] = (hb[b] || 0) + 1; }
say('  worst side, histogram (<= bound):', JSON.stringify(hb));
const sidesAll = rows.length * 4;
const sideHold = rows.reduce((n, r) => n + Object.values(r.d).filter((v) => Math.abs(v) <= TOL_BOX).length, 0);
say(`  sides: ${sideHold} of ${sidesAll} hold (${pct(sideHold, sidesAll)})`);
{
  const T = { left: { n: 0, out: 0 }, top: { n: 0, out: 0 }, right: { n: 0, out: 0 }, bottom: { n: 0, out: 0 } };
  for (const r of rows) for (const [k, v] of Object.entries(r.d)) { if (Math.abs(v) <= TOL_BOX) continue; T[k].n++; if ((k === 'left' || k === 'top') ? v < 0 : v > 0) T[k].out++; }
  const tot = Object.values(T).reduce((a, t) => a + t.n, 0), out = Object.values(T).reduce((a, t) => a + t.out, 0);
  say(`  the ${tot} failing sides, by side: ${SIDES_ORDER.map((k) => `${k} ${T[k].n} (solid further out ${T[k].out}, further in ${T[k].n - T[k].out})`).join(' · ')}; overall the solid reaches further out on ${out} (${pct(out, tot)})`);
}
say(`  every pair: stroke weights in the outline: ${JSON.stringify([...new Set(rows.flatMap((r) => r.weights))])}`);
const brk = rows.filter((r) => r.box > TOL_BOX).sort((a, b) => b.box - a.box);
say('  the breaks (worst side, per-side signed solid-minus-outline):');
for (const r of brk) say('    ' + r.box.toFixed(3).padStart(6), r.key.padEnd(40), JSON.stringify(Object.fromEntries(Object.entries(r.d).map(([k, v]) => [k[0], +v.toFixed(3)]))), r.cls);
// Taxonomy. 'badge' = a base drawing carrying a small modifier (plus, check, x, lock, heart, arrow...), tagged by NAME after looking at the
// 83 pairs on the contact sheets (--png): in each, the solid draws the modifier as a disc with the mark cut out, or shifts it, where the
// outline draws the bare mark. It is an eye-read tag, not a measurement — the sheets are written to analysis/breaks.png.
const BADGE = /^(credit-card-(download|upload|lock|search|shield|refresh|edit)|file-(heart|lock|attachment|plus|check|download|x)-\d+|file-code-02|calendar-(minus|plus|check|heart)-02|clock-plus|package-(minus|plus|search|check|x)|pen-tool-(minus|plus)|download-cloud-0\d|upload-cloud-0\d|chart-breakout-(square|circle)|check-square-broken)$/;
const nameOf = (k) => k.split('/').slice(1).join('/');
const bs = (lo, hi) => brk.filter((r) => r.box > lo && r.box <= hi);
say(`  by size of the worst side: over 0.9 ${bs(0.9, 99).length} · 0.1 to 0.9 ${bs(0.1, 0.9).length} · 0.01 to 0.1 ${bs(0.01, 0.1).length}`);
const badge = brk.filter((r) => BADGE.test(nameOf(r.key)));
say(`  tagged modifier-badge (by name, eye-read from the contact sheets): ${badge.length} of ${brk.length}; their worst sides: ${JSON.stringify(hist(badge.map((r) => r.box), [0.5, 1.001, 2.001, 99]))}`);
say(`  not tagged: ${brk.length - badge.length}; of those over 0.9: ${brk.filter((r) => !BADGE.test(nameOf(r.key)) && r.box > 0.9).length}`);
const VERTEX = /^(package|container|cube-0\d|diamond-0\d|shield-03)$/;
const BARS = /^(bar-chart-1[0-2]|horizontal-bar-chart-0\d|coins-stacked-03|pie-chart-0\d)$/;
const rest = brk.filter((r) => !BADGE.test(nameOf(r.key)) && !VERTEX.test(nameOf(r.key)) && !BARS.test(nameOf(r.key)));
say(`  of the not-tagged: 3D-box / gem / shield vertex (name pattern VERTEX) ${brk.filter((r) => VERTEX.test(nameOf(r.key))).length} (sizes ${brk.filter((r) => VERTEX.test(nameOf(r.key))).map((r) => r.box.toFixed(2)).join(' ')}); bars and pies (BARS) ${brk.filter((r) => BARS.test(nameOf(r.key))).length}; the rest ${rest.length} (worst ${rest.length ? rest[0].box.toFixed(2) : '-'}; over 0.1: ${rest.filter((r) => r.box > 0.1).length}; under 0.1: ${rest.filter((r) => r.box <= 0.1).length})`);
say(`  the 'rest' group, by name and worst side: ${rest.map((r) => `${nameOf(r.key)} ${r.box.toFixed(2)}`).join('; ')}`);

say('');
say('## 3. How alike are the two inks (IoU of the ink masks)');
const cl = { A: rows.filter((r) => r.cls === 'A'), B: rows.filter((r) => r.cls === 'B'), C: rows.filter((r) => r.cls === 'C') };
for (const k of 'ABC') say(`  class ${k}: ${cl[k].length} pairs (${pct(cl[k].length, rows.length)}); box holds in ${cl[k].filter((r) => r.box <= TOL_BOX).length}`);
say('  (A: solid ink == outline ink, IoU >= 0.999 — the solid is the outlined stroke; B: 0.90 to 0.999; C: below 0.90 — redrawn)');
{
  // silhouette congruence: both drawings with gaps up to 3.2 closed, enclosed areas filled, compared (16 px/unit)
  const closedIoU = new Map();
  for (const c of conceptsOf('untitled')) {
    const o = c.records.filter((r) => r.style === 'outline'), s2 = c.records.filter((r) => r.style === 'filled');
    if (o.length !== 1 || s2.length !== 1) continue;
    closedIoU.set(c.group + '/' + c.name, iou(closedSilhouette(rasterise(o[0], { scale: 16 }), 1.6), closedSilhouette(rasterise(s2[0], { scale: 16 }), 1.6)));
  }
  const bins2 = [0.9, 0.95, 0.99, 0.999, 1.0001];
  const lab = (v) => (v > 0.999 ? '>0.999' : v > 0.99 ? '0.99-0.999' : v > 0.95 ? '0.95-0.99' : v > 0.9 ? '0.90-0.95' : '<=0.90');
  const byC = { A: {}, B: {}, C: {}, all: {} };
  for (const r of rows) { const v = closedIoU.get(r.key); for (const k of [r.cls, 'all']) byC[k][lab(v)] = (byC[k][lab(v)] || 0) + 1; r.silhouetteIoU = v; }
  say('  silhouette congruence (rasterised at 16 px/unit; gaps up to 3.2 closed, enclosed areas filled, both drawings; IoU of the two silhouettes):');
  for (const k of ['A', 'B', 'C', 'all']) say(`     ${k.padEnd(4)} ${JSON.stringify(byC[k])}`);
  const lows = rows.filter((r) => r.silhouetteIoU <= 0.9).sort((a, b) => a.silhouetteIoU - b.silhouetteIoU);
  const boxHoldLow = lows.filter((r) => r.box <= TOL_BOX).length;
  say(`     under 0.90: ${lows.length} pairs, ${boxHoldLow} of them with the box held; first ten: ${lows.slice(0, 10).map((r) => `${r.key} ${r.silhouetteIoU.toFixed(2)}`).join(', ')}`);
  say(`     (a person bust, an open arc or a cup is an OPEN outline: its line drawing encloses nothing, so there is no silhouette to match; the ink box is the stricter outer-edge test)`);
}
say(`  ink area, solid over outline: A median ${r3(med(cl.A.map((r) => r.areaS / r.areaO)))} · B ${r3(med(cl.B.map((r) => r.areaS / r.areaO)))} · C ${r3(med(cl.C.map((r) => r.areaS / r.areaO)))}`);

say('');
say('## 4. Diagonal-ended strokes in the outline');
const kindOf = (r) => (r.ends.ends.some((e) => e.kind === 'diag') ? 'diag-ended' : r.ends.ends.length ? 'axis-ended only' : 'no open ends');
const tab = {};
for (const r of rows) { const k = kindOf(r); tab[k] = tab[k] || { n: 0, A: 0, B: 0, C: 0, holdC: 0 }; tab[k].n++; tab[k][r.cls]++; if (r.cls === 'C' && r.box <= TOL_BOX) tab[k].holdC++; }
for (const k of Object.keys(tab)) { const t = tab[k]; say(`  ${k.padEnd(16)} ${String(t.n).padStart(4)} pairs (${pct(t.n, rows.length)}) · identical A ${t.A} · near B ${t.B} · redrawn C ${t.C} (box holds in ${t.holdC} = ${pct(t.holdC, t.C)})`); }
const nEnds = rows.reduce((n, r) => n + r.ends.ends.length, 0), nDiag = rows.reduce((n, r) => n + r.ends.ends.filter((e) => e.kind === 'diag').length, 0);
say(`  open stroke ends in all outlines: ${nEnds}; diagonal (>1 degree off axis): ${nDiag} (${pct(nDiag, nEnds)})`);
say('  what holds each ink-box side of the outline, and whether the solid keeps it (all 4 sides of all pairs):');
const dt = {};
for (const r of rows) for (const side of ['left', 'top', 'right', 'bottom']) {
  const k = r.cls + ' | ' + r.def[side]; dt[k] = dt[k] || { n: 0, hold: 0 };
  dt[k].n++; if (Math.abs(r.d[side]) <= TOL_BOX) dt[k].hold++;
}
for (const k of Object.keys(dt).sort()) say(`    ${k.padEnd(22)} ${String(dt[k].n).padStart(5)} sides · hold ${String(dt[k].hold).padStart(5)} (${pct(dt[k].hold, dt[k].n)})`);
{
  const slanted = Object.entries(dt).filter(([k]) => k.endsWith('diagCap')), n = slanted.reduce((a, [, v]) => a + v.n, 0), h = slanted.reduce((a, [, v]) => a + v.hold, 0);
  say(`  sides held by a slanted end, all classes: ${n} of ${sidesAll} (${pct(n, sidesAll)}); equal to 0.01 in ${h} (${pct(h, n)}); of those in identical or near pairs (A, B): ${dt['A | diagCap'].n + dt['B | diagCap'].n} (${pct(dt['A | diagCap'].n + dt['B | diagCap'].n, n)})`);
}
const dc = {};
for (const r of rows) if (r.cls !== 'A' && r.cls !== 'B') for (const side of ['left', 'top', 'right', 'bottom']) {
  const k = r.def[side]; dc[k] = dc[k] || { n: 0, hold: 0 }; dc[k].n++; if (Math.abs(r.d[side]) <= TOL_BOX) dc[k].hold++;
}
say('  redrawn pairs (class C) only:');
for (const k of Object.keys(dc).sort()) say(`    ${k.padEnd(14)} ${String(dc[k].n).padStart(5)} sides · hold ${String(dc[k].hold).padStart(5)} (${pct(dc[k].hold, dc[k].n)})`);
const diagBreak = [];
for (const r of rows) if (r.cls === 'C') for (const side of ['left', 'top', 'right', 'bottom']) if (r.def[side] === 'diagCap' && Math.abs(r.d[side]) > TOL_BOX) diagBreak.push(`${r.key} ${side} ${r.d[side] >= 0 ? '+' : ''}${r.d[side].toFixed(3)}`);
say(`  diagonal-cap sides that break (${diagBreak.length}): ${diagBreak.join('; ')}`);

say('');
say('## 5. Strokes in the solid: kept, and cut');
const bandBins = [0.5, 1, 1.5, 1.9, 2.1, 2.5, 3, 4, 6, 100];
for (const k of 'ABC') {
  const kept = [], air = [];
  for (const r of cl[k]) for (const p of r.bands) {
    if (p.nKept >= 5 && p.nKept >= 3 * p.nAir) kept.push(p.keptMed);
    if (p.nAir >= 5 && p.nAir >= 3 * p.nKept) air.push(p.airMed);
  }
  const two = (a) => a.filter((v) => Math.abs(v - 2) <= 0.1).length;
  say(`  class ${k}: ${kept.length} paths mostly kept — ${two(kept)} (${pct(two(kept), kept.length)}) have background 1.0 away (2x = 2.0 +-0.1); ${air.length} mostly cut — ${two(air)} (${pct(two(air), air.length)}) are cut 2.0 wide +-0.1`);
  say(`     kept hist ${JSON.stringify(hist(kept, bandBins))}  cut hist ${JSON.stringify(hist(air, bandBins))}`);
}

say('');
say('## 6. Corners: outline centreline radius + half the stroke, looked for in the solid');
{
  const T = { outline: { corner: 0, smooth: 0 }, filled: { corner: 0, smooth: 0 } };
  for (const c of conceptsOf('untitled')) for (const r of c.records) for (const q of r.measure.radii) { if (q.kind !== 'corner') continue; const t = T[r.style]; t.corner++; if (q.smooth) t.smooth++; }
  say(`  corners flagged smooth by the harness (not a circular arc; radius reported as the equivalent circle, tangent length / tan(turn/2)): outline centrelines ${T.outline.smooth} of ${T.outline.corner} (${pct(T.outline.smooth, T.outline.corner)}); solid contours ${T.filled.smooth} of ${T.filled.corner} (${pct(T.filled.smooth, T.filled.corner)})`);
}
for (const k of ['A', 'B', 'C']) {
  const cs = cl[k].flatMap((r) => r.corners);
  const out = cs.filter((c) => c.outer);
  const diffs = out.map((c) => c.outer.diff);
  const close = (v, t) => Math.abs(v) <= t;
  say(`  class ${k}: ${cs.length} outline corners; ${out.length} found in the solid at the pushed-out vertex (${pct(out.length, cs.length)});`
    + ` radius found - expected: within 0.05 for ${diffs.filter((v) => close(v, 0.05)).length}, within 0.15 for ${diffs.filter((v) => close(v, 0.15)).length}, within 0.5 for ${diffs.filter((v) => close(v, 0.5)).length}, beyond 0.5 for ${diffs.filter((v) => !close(v, 0.5)).length}`);
  if (diffs.length) say(`     found-minus-expected: median ${r3(med(diffs))}, min ${r3(Math.min(...diffs))}, max ${r3(Math.max(...diffs))}`);
}
{
  const all = cl.C.flatMap((r) => r.corners.map((c) => ({ ...c, key: r.key })));
  const is90 = (c) => Math.abs(c.turn - 90) < 2;
  const stat = (arr) => ({ n: arr.length, found: arr.filter((c) => c.outer).length, ok: arr.filter((c) => c.outer && Math.abs(c.outer.diff) <= 0.05).length });
  const a90 = stat(all.filter(is90)), aOther = stat(all.filter((c) => !is90(c)));
  say(`  class C, 90-degree corners: ${a90.n} outline corners, ${a90.found} found (${pct(a90.found, a90.n)}), radius right to 0.05 in ${a90.ok} (${pct(a90.ok, a90.found)} of found); other turns: ${aOther.n}, found ${aOther.found}, right to 0.05 in ${aOther.ok} (${pct(aOther.ok, aOther.found)})`);
  const sq = all.filter((c) => is90(c) && c.outer && c.r > 4.6 && c.r < 5.0);
  const sq416 = sq.filter((c) => Math.abs(c.outer.found - 4.16) < 0.03);
  say(`  outline corners of centreline radius about 4.8 (90 degrees, found in the solid): ${sq.length}; the solid's corner there is 4.16 (not 5.8) in ${sq416.length} (${pct(sq416.length, sq.length)}), across ${new Set(sq416.map((c) => c.key)).size} icons; ${new Set(sq416.filter((c) => /square/.test(c.key)).map((c) => c.key)).size} of them have 'square' in the name`);
  const sq58 = sq.filter((c) => Math.abs(c.outer.diff) <= 0.05);
  say(`  and in ${sq58.length} of those ${sq.length} (${pct(sq58.length, sq.length)}) the solid's corner is outline + half stroke to 0.05; the remaining ${sq.length - sq58.length - sq416.length} are something else`);
  {
    const keys416 = new Set(sq416.map((c) => c.key));
    const inBand = (lo, hi) => rows.filter((r) => keys416.has(r.key) && r.silhouetteIoU > lo && r.silhouetteIoU <= hi).length;
    say(`  those ${keys416.size} icons by silhouette overlap: over 0.999 ${inBand(0.999, 9)}, 0.99-0.999 ${inBand(0.99, 0.999)}, 0.95-0.99 ${inBand(0.95, 0.99)}, 0.90-0.95 ${inBand(0.9, 0.95)}, 0.90 or below ${inBand(-1, 0.9)}`);
  }
  const r32 = all.filter((c) => is90(c) && c.outer && c.r > 3.0 && c.r < 3.4);
  say(`  outline corners of centreline radius about 3.2 (90 degrees, found): ${r32.length}; the solid's corner is 4.2 (= 3.2 + 1) to 0.05 in ${r32.filter((c) => Math.abs(c.outer.diff) <= 0.05).length} (${pct(r32.filter((c) => Math.abs(c.outer.diff) <= 0.05).length, r32.length)})`);
}
const byR = {};
for (const r of rows) for (const c of r.corners) if (c.outer) { const k = r2(c.r); byR[k] = byR[k] || []; byR[k].push(c.outer.found); }
say('  by outline centreline radius (rounded 2 dp): n, median solid radius found');
for (const k of Object.keys(byR).sort((a, b) => b.length - a.length || a - b).slice(0, 10)) say(`     r_outline ${k}: n=${byR[k].length}, solid median ${r3(med(byR[k]))}, expected ${r3(Number(k) + 1)}`);

{
  say('');
  say('## 8. Why an earlier 26-concept sample looked perfect');
  const rawDir = path.join(REF_ROOT, 'untitled', 'figma', 'raw');
  const f26 = fs.existsSync(rawDir) ? fs.readdirSync(rawDir).find((f) => /extract-0-26-/.test(f)) : null;
  if (f26) {
    const raw = JSON.parse(fs.readFileSync(path.join(rawDir, f26), 'utf8'));
    const picked = new Set((raw.picked || []).map((x) => x.replace('|', '/')));
    const sel = rows.filter((r) => picked.has(r.key));
    say(`  the 26: ${sel.length} found as clean pairs; classes A ${sel.filter((r) => r.cls === 'A').length} · B ${sel.filter((r) => r.cls === 'B').length} · C ${sel.filter((r) => r.cls === 'C').length}; box holds in ${sel.filter((r) => r.box <= TOL_BOX).length}; modifier-badge icons among them: ${sel.filter((r) => BADGE.test(nameOf(r.key))).length}`);
    let ok = 0; const trials = 100000, holds = rows.map((r) => r.box <= TOL_BOX);
    let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    for (let t = 0; t < trials; t++) { let all = true; const used = new Set(); while (used.size < 26) { const i = Math.floor(rnd() * rows.length); if (used.has(i)) continue; used.add(i); if (!holds[i]) { all = false; break; } } if (all) ok++; }
    say(`  a random 26 of the ${rows.length} pairs would all hold in ${(100 * ok / trials).toFixed(1)}% of ${trials} draws (seeded) — so the 26 were the commonest concepts (plus, check, folder, user...), not a random 26, and none of them carries a modifier`);
  } else say('  (raw dump of the first 26 not found)');
}

if (PNG) {
  const sheetOf = (list, file) => {
    const want = new Map(list.map((b, i) => [b.key, i]));
    const cells = new Array(list.length);
    for (const c of conceptsOf('untitled')) {
      const key = c.group + '/' + c.name;
      if (!want.has(key)) continue;
      cells[want.get(key)] = { a: rasterise(c.records.find((r) => r.style === 'outline'), { scale: 12 }), b: rasterise(c.records.find((r) => r.style === 'filled'), { scale: 12 }) };
    }
    fs.writeFileSync(path.join(OUT, file), sheetPng(cells, { cols: 7, cell: 136 }));
  };
  sheetOf(brk.slice(0, 42), 'breaks-1.png');          // the 42 largest
  sheetOf(brk.slice(42), 'breaks-2.png');             // the rest
  say('  contact sheets of all the breaks (outline blue, solid red, both dark): analysis/breaks-1.png (42 largest, in order) and breaks-2.png (the rest)');
}

if (OURS) await import('./untitled-ours.mjs').then((m) => m.run(say, { pct, med, r3, r2 }));

say('');
say(`done in ${((Date.now() - T0) / 1000).toFixed(1)} s`);
fs.writeFileSync(path.join(OUT, 'pairs.json'), JSON.stringify(rows));   // after every field is set
fs.writeFileSync(path.join(OUT, 'report.txt'), lines.join('\n') + '\n');
