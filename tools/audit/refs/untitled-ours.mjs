// tools/audit/refs/untitled-ours.mjs — OUR set, measured the same way as Untitled UI (read-only).
// Loaded by `untitled-pairs.mjs --ours`. Reads src/icons/{24,20,16}; writes nothing.
//
// Same three questions as for Untitled, asked of the shipped set:
//   · does the filled drawing's outer ink box equal the outline's, side by side? (our rule: to 0.01)
//   · how many drawings have an open stroke ending diagonally, and how many of those are line-heavy
//     (the ones whose filled style is a HEAVIER stroke, 2.5 · 2 · 2, rather than a filled shape)?
//   · for the chevrons, how far does the leg angle move between the two styles?

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readIcon, piecesOf, tangentOf, samplesOf, segmentsOf as lineSegs } from '../angles.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'src', 'icons');
const MASTERS = [24, 20, 16];
const fromAxis = (v) => { const a = (Math.atan2(v[1], v[0]) * 180) / Math.PI; const m = ((a % 90) + 90) % 90; return Math.min(m, 90 - m); };

function pieceExtremes(piece) {
  const pts = [piece.from, piece.to];
  if (piece.type === 'arc') {
    const a = piece.arc;   // centre form: centre, rx, ry, phi, theta1, dtheta
    for (const k of [0, 1, 2, 3]) {
      let th = (k * Math.PI) / 2;
      // is th inside the sweep [theta1, theta1 + dtheta] modulo 2*pi?
      const lo = Math.min(a.theta1, a.theta1 + a.dtheta), hi = Math.max(a.theta1, a.theta1 + a.dtheta);
      for (const t of [th - 4 * Math.PI, th - 2 * Math.PI, th, th + 2 * Math.PI, th + 4 * Math.PI]) {
        if (t >= lo - 1e-12 && t <= hi + 1e-12) {
          const px = Math.cos(t) * a.rx, py = Math.sin(t) * a.ry;
          const c = Math.cos(a.phi), s = Math.sin(a.phi);
          pts.push([c * px - s * py + a.cx, s * px + c * py + a.cy]);
        }
      }
    }
  } else if (piece.type === 'cubic' || piece.type === 'quad') {
    pts.push(...piece.ctrl);   // conservative; this set has none (raster.mjs census: zero Bezier curves)
  }
  return pts;
}

/** Exact ink box of one of our drawings: stroked paths grow by half the root weight (round caps and joins), area paths do not. */
export function inkBoxOf(icon) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of icon.paths) {
    const h = p.style === 'stroke' ? icon.stroke / 2 : 0;
    const { pieces, subs } = piecesOf(p.d);
    const pts = pieces.flatMap(pieceExtremes);
    for (const s of subs) if (!s.pieces.length) pts.push(s.start);
    for (const [x, y] of pts) { x0 = Math.min(x0, x - h); y0 = Math.min(y0, y - h); x1 = Math.max(x1, x + h); y1 = Math.max(y1, y + h); }
  }
  return { x0, y0, x1, y1 };
}

function diagEnds(icon) {
  let diag = 0, axis = 0;
  for (const p of icon.paths) {
    if (p.style !== 'stroke') continue;
    const { pieces, subs } = piecesOf(p.d);
    for (const s of subs) {
      if (s.closed || !s.pieces.length) continue;
      const first = pieces[s.pieces[0]], last = pieces[s.pieces[s.pieces.length - 1]];
      for (const t of [tangentOf(first, 0), tangentOf(last, 1)]) {
        if (!t[0] && !t[1]) continue;
        if (fromAxis(t) > 1) diag++; else axis++;
      }
    }
  }
  return { diag, axis };
}


/** What holds each side of OUR outline's ink box: 'capDiag' / 'capAxis' (end of an open stroke, slanted / square-on) or 'curve/edge' (anything else). */
export function sideDefinersOurs(icon, box, tol = 0.006) {
  const out = { left: new Set(), top: new Set(), right: new Set(), bottom: new Set() };
  const h = icon.stroke / 2;
  for (const p of icon.paths) {
    if (p.style !== 'stroke') continue;
    const { pieces, subs } = piecesOf(p.d);
    for (const s of subs) {
      const mine = s.pieces.map((i) => pieces[i]);
      if (!mine.length) continue;
      const endKind = [null, null];
      if (!s.closed) {
        const t0 = tangentOf(mine[0], 0), t1 = tangentOf(mine[mine.length - 1], 1);
        endKind[0] = fromAxis(t0) > 1 ? 'capDiag' : 'capAxis'; endKind[1] = fromAxis(t1) > 1 ? 'capDiag' : 'capAxis';
      }
      mine.forEach((pc, pi) => {
        const pts = samplesOf(pc, 96);
        pts.forEach((q, k) => {
          let kind = 'curve/edge';
          if (!s.closed && pi === 0 && k === 0) kind = endKind[0];
          if (!s.closed && pi === mine.length - 1 && k === pts.length - 1) kind = endKind[1];
          if (Math.abs(q[0] - h - box.x0) < tol) out.left.add(kind);
          if (Math.abs(q[0] + h - box.x1) < tol) out.right.add(kind);
          if (Math.abs(q[1] - h - box.y0) < tol) out.top.add(kind);
          if (Math.abs(q[1] + h - box.y1) < tol) out.bottom.add(kind);
        });
      });
    }
  }
  const pick = (set) => (set.has('capDiag') ? 'capDiag' : set.has('capAxis') ? 'capAxis' : set.size ? 'curve/edge' : 'none');
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, pick(v)]));
}

export function run(say, { pct, med, r3 }) {
  say('');
  say('## 7. OUR set, measured the same way (src/icons, read-only)');
  const names = fs.readdirSync(path.join(ROOT, '24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.replace(/\.svg$/, '')).sort();
  say(`  concepts at 24: ${names.length}`);
  const rows = [];
  for (const m of MASTERS) for (const n of names) {
    const fo = path.join(ROOT, String(m), `${n}.svg`), ff = path.join(ROOT, String(m), `${n}-filled.svg`);
    if (!fs.existsSync(fo) || !fs.existsSync(ff)) { say(`  missing pair: ${m}/${n}`); continue; }
    const o = readIcon(fo), f = readIcon(ff);
    const bo = inkBoxOf(o), bf = inkBoxOf(f);
    const d = { left: bf.x0 - bo.x0, top: bf.y0 - bo.y0, right: bf.x1 - bo.x1, bottom: bf.y1 - bo.y1 };
    const e = diagEnds(o);
    rows.push({ m, n, d, box: Math.max(...Object.values(d).map(Math.abs)), lineHeavy: !f.hasAreas, diag: e.diag, axis: e.axis, wO: o.stroke, wF: f.stroke, def: sideDefinersOurs(o, bo) });
  }
  const at = (m) => rows.filter((r) => r.m === m);
  for (const m of MASTERS) {
    const R = at(m);
    const hold = R.filter((r) => r.box <= 0.01);
    say(`  box, master ${m}: ${hold.length} of ${R.length} pairs hold on all four sides to 0.01 (${pct(hold.length, R.length)}); worst ${r3(Math.max(...R.map((r) => r.box)))}`);
    const bad = R.filter((r) => r.box > 0.01).sort((a, b) => b.box - a.box);
    if (bad.length) say(`    over 0.01 (${bad.length}): ` + bad.map((r) => `${r.n} ${r3(r.box)}`).join('; '));
  }
  const all = rows.filter((r) => r.box > 0.01);
  say(`  all masters: ${rows.length - all.length} of ${rows.length} pairs hold to 0.01`);
  // the pairs that do not: do they carry a declared \`grows:\` note in the filled file?
  const declared = (r) => /<!--\s*grows:/.test(fs.readFileSync(path.join(ROOT, String(r.m), `${r.n}-filled.svg`), 'utf8'));
  const undeclared = all.filter((r) => !declared(r));
  const noted = rows.filter(declared);
  {
    const byConcept = {};
    for (const r of all) (byConcept[r.n] = byConcept[r.n] || {})[r.m] = r.box;
    say(`  the ${Object.keys(byConcept).length} concepts that differ at some master, with the largest side difference at 24 · 20 · 16: ` + Object.entries(byConcept).sort().map(([n, v]) => `${n} ${[24, 20, 16].map((m) => (v[m] === undefined ? '-' : r3(v[m]))).join('/')}`).join('; '));
  }
  say(`  of those ${all.length}: ${all.length - undeclared.length} carry a \`grows:\` note in the filled file (${new Set(all.filter(declared).map((r) => r.n)).size} concepts); undeclared: ${undeclared.length}${undeclared.length ? ' — ' + undeclared.slice(0, 10).map((r) => `${r.m}/${r.n} ${r3(r.box)}`).join('; ') : ''}; files with a note that nevertheless hold: ${noted.filter((r) => r.box <= 0.01).length}`);
  say(`  weights seen: outline ${JSON.stringify([...new Set(rows.map((r) => `${r.m}:${r.wO}`))])} filled ${JSON.stringify([...new Set(rows.map((r) => `${r.m}:${r.wF}:${r.lineHeavy ? 'line-heavy' : 'shape'}`))])}`);
  say('  line-heavy (the filled file draws no area, only a heavier stroke) vs diagonal-ended outline, master 24:');
  const R24 = at(24);
  const cell = (lh, dg) => R24.filter((r) => r.lineHeavy === lh && (r.diag > 0) === dg).length;
  say(`    line-heavy: ${R24.filter((r) => r.lineHeavy).length} concepts — diagonal-ended ${cell(true, true)}, axis-ended / no open ends ${cell(true, false)}`);
  say(`    shape-filled: ${R24.filter((r) => !r.lineHeavy).length} concepts — diagonal-ended ${cell(false, true)}, axis-ended / no open ends ${cell(false, false)}`);
  say(`    all: diagonal-ended ${R24.filter((r) => r.diag > 0).length} of ${R24.length} (${pct(R24.filter((r) => r.diag > 0).length, R24.length)})`);
  const lh = R24.filter((r) => r.lineHeavy);
  say(`    line-heavy pairs that hold the box to 0.01: ${lh.filter((r) => r.box <= 0.01).length} of ${lh.length} at 24`);
  const lhAll = rows.filter((r) => r.lineHeavy);
  say(`    line-heavy pairs, all three masters: ${lhAll.filter((r) => r.box <= 0.01).length} of ${lhAll.length} hold to 0.01`);
  const dt = {};
  for (const r of rows) for (const side of ['left', 'top', 'right', 'bottom']) {
    const k = (r.lineHeavy ? 'line-heavy' : 'shape-filled') + ' | ' + r.def[side];
    dt[k] = dt[k] || { n: 0, hold: 0 }; dt[k].n++; if (Math.abs(r.d[side]) <= 0.01) dt[k].hold++;
  }
  say('  OUR sides, by what holds the side in the outline (all three masters; same table as the Untitled one in section 4):');
  for (const k of Object.keys(dt).sort()) say(`    ${k.padEnd(28)} ${String(dt[k].n).padStart(5)} sides · equal to 0.01 ${String(dt[k].hold).padStart(5)} (${pct(dt[k].hold, dt[k].n)})`);
  const nSides = rows.length * 4, nSlanted = rows.reduce((n, r) => n + Object.values(r.def).filter((v) => v === 'capDiag').length, 0);
  say(`    sides held by a slanted end: ${nSlanted} of ${nSides} (${pct(nSlanted, nSides)}) — Untitled: see section 4 of its report (573 of 4680)`);
  const lhDiag = rows.filter((r) => r.lineHeavy && Object.values(r.def).includes('capDiag'));
  say(`    line-heavy pairs with at least one side held by a slanted cap: ${lhDiag.length} (of ${lhAll.length}); of those, box equal to 0.01 on all four sides: ${lhDiag.filter((r) => r.box <= 0.01).length}`);

  // chevrons: leg angle outline vs filled
  const chev = names.filter((n) => /^chevron/.test(n));
  const famOf = (n) => /^chevrons-/.test(n) ? 'chevrons-up-down' : /-2(-large|-small)?$/.test(n) ? 'flat (-2)' : /-3(-large|-small)?$/.test(n) ? 'steep (-3)' : 'classic';
  const cr = [];
  for (const m of MASTERS) for (const n of chev) {
    const o = readIcon(path.join(ROOT, String(m), `${n}.svg`)), f = readIcon(path.join(ROOT, String(m), `${n}-filled.svg`));
    const legs = (ic) => ic.paths.flatMap((p) => lineSegs(p.d, { minLength: 0.5 })).filter((s) => s.fromHorizontal > 5 && s.fromHorizontal < 85).map((s) => s.fromHorizontal);
    const lo = legs(o), lf = legs(f);
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    cr.push({ m, n, fam: famOf(n), d: Math.abs(mean(lo) - mean(lf)) });
  }
  say(`  chevrons: ${chev.length} concepts x 3 masters = ${cr.length} pairs; leg angle (mean of the slanted legs) moves more than 0.5 degrees in ${cr.filter((r) => r.d > 0.5).length}, more than 1 in ${cr.filter((r) => r.d > 1).length}, more than 2 in ${cr.filter((r) => r.d > 2).length}; max ${r3(Math.max(...cr.map((r) => r.d)))}`);
  const fm = {};
  for (const r of cr) { const k = `${r.fam} @${r.m}`; fm[k] = fm[k] || { n: 0, over: 0, max: 0, min: 1e9, over1: 0 }; fm[k].n++; if (r.d > 0.5) fm[k].over++; if (r.d > 1) fm[k].over1++; fm[k].max = Math.max(fm[k].max, r.d); fm[k].min = Math.min(fm[k].min, r.d); }
  for (const k of Object.keys(fm).sort()) say(`    ${k.padEnd(22)} pairs ${String(fm[k].n).padStart(3)} · over 0.5 degree: ${String(fm[k].over).padStart(2)} · over 1: ${String(fm[k].over1).padStart(2)} · smallest ${r3(fm[k].min)} · largest ${r3(fm[k].max)}`);
  {
    const bySize = {};
    for (const r of cr.filter((x) => x.fam === 'flat (-2)' && x.m === 16)) { const k = /-large$/.test(r.n) ? 'large' : /-small$/.test(r.n) ? 'small' : 'plain'; (bySize[k] = bySize[k] || new Set()).add(r3(r.d)); }
    say(`    flat (-2) at 16, by size (degrees the filled legs are flatter than the outline's): ${Object.entries(bySize).map(([k, v]) => `${k} ${[...v].join('/')}`).join(' · ')}`);
  }
}

/**
 * Central's invariant, tested on OUR shape-filled pairs: a filled corner's radius is the outline's centreline radius
 * plus half the outline stroke (outer contour) or minus it (the contour of a punched line). Matched by place with
 * the repo's own corner reader (`radii.mjs cornersOf`): the filled corner must sit h / cos(turn/2) from the outline's
 * vertex, with the same turn. A match is "consistent" when the filled radius is either offset to 0.02.
 */
export async function radiusRelation(say, { pct, r3 }) {
  const { cornersOf } = await import('../radii.mjs');
  say('');
  say('## 9. Central\'s radius relation tested on OUR shape-filled pairs (src/icons, read-only)');
  const names = fs.readdirSync(path.join(ROOT, '24')).filter((f) => f.endsWith('.svg') && !f.endsWith('-filled.svg')).map((f) => f.replace(/\.svg$/, '')).sort();
  for (const m of MASTERS) {
    let pairs = 0, corners = 0, matched = 0, ok = 0; const off = {}, diffs = {};
    for (const n of names) {
      const o = readIcon(path.join(ROOT, String(m), `${n}.svg`)), f = readIcon(path.join(ROOT, String(m), `${n}-filled.svg`));
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
        fc.forEach((y, i) => { if (used.has(i) || Math.abs(y.turn - x.turn) > 2) return; const e = Math.abs(Math.hypot(y.at[0] - x.at[0], y.at[1] - x.at[1]) - dExp); if (e <= 0.08 && (!best || e < best.e)) best = { i, e, y }; });
        if (!best) continue;
        used.add(best.i); matched++;
        const dO = best.y.radius - (x.radius + h), dI = best.y.radius - Math.max(0, x.radius - h);
        const d = Math.abs(dO) <= Math.abs(dI) ? dO : dI;
        if (Math.abs(d) <= 0.02) ok++; else { (off[n] = off[n] || []).push(`${r3(d)} (outline ${r3(x.radius)}, filled ${r3(best.y.radius)})`); const k = r3(d).toString(); diffs[k] = (diffs[k] || 0) + 1; }
      }
    }
    const nOff = Object.values(diffs).reduce((a, b) => a + b, 0);
    say(`  master ${m}: ${pairs} shape-filled pairs · ${corners} outline corners with a radius · matched ${matched} (${pct(matched, corners)}) · consistent to 0.02: ${ok} (${pct(ok, matched)}) · off: ${nOff} corners in ${Object.keys(off).length} concepts`);
    if (nOff) say(`     off by (corners): ${JSON.stringify(Object.fromEntries(Object.entries(diffs).sort((a, b) => b[1] - a[1]).slice(0, 6)))}; concepts and the amounts: ${Object.entries(off).map(([n, v]) => `${n} [${v.join(' ')}]`).join('; ')}`);
  }
}
