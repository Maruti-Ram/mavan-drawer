#!/usr/bin/env node
// Every figure in docs/audit/findings-metrics.md, printed from metrics-check.mjs.
// AUDIT ONLY — imported by nothing; reads an archived pin, writes nothing.
//
// Usage:
//   git archive 5933041 | tar -x -C /tmp/pin && (cd /tmp/pin && node tools/build.mjs)
//   node tools/audit/metrics-probe.mjs /tmp/pin [section …] [--rows report.json]
// Sections (default: all): census faithful fields boxes optical edges knife mirror
//   twins shift container gap padding exposure examples
// `examples` prints the worked examples the document quotes; it reads the published
// metrics and the drawings directly and skips the full check, so it runs in seconds.
// `--rows` reuses a report written by `metrics-check.mjs … --out`, saving ~15 s.
// `faithful`, `edges` and `padding` import the PIN's own tools/geometry.mjs and
// tools/optical.mjs on purpose: they ask what the build itself computes.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  readSvg, checkAll, summarize, sideProfiles, inkSlice, modelRecession, opticalOf, inkBoxOf, centrelineBox,
  shellOf, tokens, SIDES, STEP, ALPHA, TIE_WIDE, r2,
} from './metrics-check.mjs';

const args = process.argv.slice(2);
const PIN = resolve(args.find((a) => !a.startsWith('--')) ?? '');
const rowsAt = args.indexOf('--rows');
const wanted = args.filter((a, i) => !a.startsWith('--') && i > 0 && args[i - 1] !== '--rows');
const ALL = ['census', 'faithful', 'fields', 'boxes', 'optical', 'edges', 'knife', 'mirror', 'twins', 'shift', 'container', 'gap', 'padding', 'exposure', 'examples'];
const sections = wanted.length ? wanted : ALL;
if (!existsSync(join(PIN, 'dist/metrics.json'))) { console.error('usage: metrics-probe.mjs <pin-dir with dist/metrics.json> [section …] [--rows report.json]'); process.exit(2); }

const ICONS = join(PIN, 'src/icons');
const metrics = JSON.parse(readFileSync(join(PIN, 'dist/metrics.json'), 'utf8'));
const needsRows = sections.some((s) => s !== 'examples');
const rows = !needsRows ? [] : rowsAt > 0 ? JSON.parse(readFileSync(args[rowsAt + 1], 'utf8')) : checkAll(ICONS, metrics);
const by = new Map(rows.map((r) => [`${r.master} ${r.name}`, r]));
const twinOf = (r) => by.get(`${r.master} ${r.name.replace(/-filled$/, '')}`);
const icons = new Map();
const iconOf = (m, n) => {
  const k = `${m} ${n}`;
  if (!icons.has(k)) icons.set(k, readSvg(readFileSync(join(ICONS, String(m), `${n}.svg`), 'utf8'), k));
  return icons.get(k);
};

// ── helpers ────────────────────────────────────────────────────────────────
const f = (n, d = 2) => (n == null || !Number.isFinite(n) ? String(n) : n.toFixed(d));
/** Quantile with linear interpolation between order statistics (R's type 7). */
const q = (arr, p) => { const a = [...arr].sort((x, y) => x - y); if (!a.length) return NaN; const i = (a.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); };
const sum = (a) => a.reduce((x, y) => x + y, 0);
const hyp = (x, y) => Math.hypot(x, y);
const range = (r, s) => r.stability[s].hi - r.stability[s].lo;
const masters = [24, 20, 16];
const styles = ['outline', 'line-filled', 'shape-filled'];
const head = (t) => console.log(`\n## ${t}`);
const anchored = (r) => !!r.notes.anchor;
let build = null;                            // the pin's own geometry / optical, loaded on demand
const pinTools = async () => (build ??= {
  geo: await import(pathToFileURL(join(PIN, 'tools/geometry.mjs')).href),
  opt: await import(pathToFileURL(join(PIN, 'tools/optical.mjs')).href),
});

/** optical.mjs:21-39 and :70-93, restated on the build's own samples, keeping each
 *  scanline's position. tol 0 and strict `d > r`, exactly as the code does. */
function buildProfiles(pts, sw) {
  const r = sw / 2, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const box = { x0: Math.min(...xs) - r, x1: Math.max(...xs) + r, y0: Math.min(...ys) - r, y1: Math.max(...ys) + r };
  const out = { box };
  for (const side of SIDES) {
    const vertical = side === 'left' || side === 'right', want = side === 'right' || side === 'bottom' ? 1 : -1;
    const lo = vertical ? box.y0 : box.x0, hi = vertical ? box.y1 : box.x1, prof = [], at = [], all = [];
    for (let s = lo; s <= hi + 1e-9; s += STEP) {            // the build accumulates, so does this
      let best = -Infinity;
      for (const [px, py] of pts) {
        const al = vertical ? py : px, ac = vertical ? px : py, d = Math.abs(al - s);
        if (d > r) continue;
        const e = want * (ac + want * Math.sqrt(r * r - d * d)); if (e > best) best = e;
      }
      all.push([s, best > -Infinity ? want * best : null]);
      if (best > -Infinity) { prof.push(want * best); at.push(s); }
    }
    out[side] = { prof, at, all };
  }
  return out;
}
const farOf = (prof, side) => (side === 'left' || side === 'top' ? Math.min(...prof) : Math.max(...prof));

// ── census ─────────────────────────────────────────────────────────────────
function census() {
  head('census (§0)');
  let files = 0, paths = 0, areas = 0, strokes = 0, own = 0, transforms = 0, arcs = 0, ell = 0, bez = 0, omitted = 0;
  const cmds = {}, rootForms = {}, areaForms = {};
  for (const m of masters) for (const fn of readdirSync(join(ICONS, String(m))).filter((x) => x.endsWith('.svg'))) {
    files++;
    const text = readFileSync(join(ICONS, String(m), fn), 'utf8'), clean = text.replace(/<!--[\s\S]*?-->/g, '');
    const root = clean.match(/<svg\b([^>]*)>/)[1];
    const rf = ['fill', 'stroke', 'stroke-linecap', 'stroke-linejoin'].map((k) => `${k}=${root.match(new RegExp(`\\b${k}="([^"]*)"`))?.[1]}`).join(' ');
    rootForms[rf] = (rootForms[rf] ?? 0) + 1;
    for (const e of clean.matchAll(/<path\b([^>]*?)\/?>/g)) {
      paths++;
      const attrs = e[1].replace(/\bd="[^"]*"/, '').trim();
      if (/\bfill="(?!none)/.test(e[1])) { areas++; areaForms[attrs] = (areaForms[attrs] ?? 0) + 1; } else strokes++;
      if (/stroke-width=/.test(e[1])) own++;
      if (/transform=/.test(e[1])) transforms++;
      for (const c of e[1].match(/\bd="([^"]*)"/)[1].match(/[A-Za-z]/g)) cmds[c] = (cmds[c] ?? 0) + 1;
    }
    const icon = iconOf(m, fn.replace('.svg', ''));
    for (const p of [...icon.strokes, ...icon.areas]) {
      omitted += p.omitted; ell += p.elliptical;
      for (const sp of p.subpaths) for (const g of sp.segs) { if (g.k === 'A') arcs++; if (g.k === 'C' || g.k === 'Q') bez++; }
    }
  }
  console.log(`files ${files} · <path>s ${paths} (area ${areas}, stroke ${strokes}) · per-path stroke-width ${own} · transforms ${transforms}`);
  console.log('commands', JSON.stringify(cmds));
  console.log(`arcs kept ${arcs} + omitted (identical endpoints) ${omitted} = ${arcs + omitted}; elliptical (rx ≠ ry) ${ell}; Béziers ${bez}`);
  console.log('root paint forms', JSON.stringify(rootForms));
  console.log('area path attribute forms', JSON.stringify(areaForms));
  for (const s of styles) console.log(`${s}: ${rows.filter((r) => r.style === s).length} files`);
  console.log(`shape-filled files that also carry strokes: ${masters.map((m) => rows.filter((r) => r.master === m && r.style === 'shape-filled' && iconOf(m, r.name).strokes.length).length).join(' · ')}`);
}

// ── faithful ───────────────────────────────────────────────────────────────
async function faithful() {
  head('faithfulness (§0): the restated model on the build\'s own samples');
  const { geo } = await pinTools();
  let nonNull = 0, same = 0, nullSides = 0, nullZero = 0;
  const miss = [];
  for (const r of rows.filter((x) => x.style !== 'shape-filled')) {
    const icon = iconOf(r.master, r.name);
    const pts = icon.strokes.flatMap((p) => geo.samplePath(p.d));
    const bp = buildProfiles(pts, icon.rootWidth);
    for (const s of SIDES) {
      const p = r.pub.optical[s];
      if (p.optical == null) { nullSides++; if (p.recession === 0) nullZero++; continue; }
      nonNull++;
      const prof = bp[s].prof, rec = r2(modelRecession(prof, farOf(prof, s), icon.rootWidth, { tol: 0 }));
      if (rec === p.recession) same++; else miss.push(`${r.master} ${r.name} ${s} pub ${p.recession} restated ${rec}`);
    }
  }
  console.log(`non-null stroke-only sides ${nonNull}: published recession reproduced on ${same}; misses ${miss.length}`, miss.slice(0, 5));
  console.log(`null sides ${nullSides} (all publish recession 0: ${nullZero === nullSides})`);
}

// ── fields ─────────────────────────────────────────────────────────────────
function fields() {
  head('§1 every field — the summary and the per-master table');
  console.log(JSON.stringify(summarize(rows), null, 1));
  console.log('master | style | entries | ink/bearing max err | optical understated median/max | stroke misread >0.01 sides/entries max | knife-edge >0.05 sides/entries widest | shift declared≠drawn / undeclared off-centre (max) | container pub/false/missing | gap pub/non-glyph/false dot/declared-null');
  for (const m of masters) for (const st of styles) {
    const rs = rows.filter((r) => r.master === m && r.style === st);
    const err = Math.max(...rs.map((r) => Math.max(r.diff.ink, r.diff.bearing)));
    const under = st === 'shape-filled' ? rs.flatMap((r) => SIDES.map((s) => -r.diff.optical[s].optical)) : [];
    const mis = st !== 'shape-filled' ? rs.flatMap((r) => SIDES.map((s) => r.diff.optical[s].optical).filter((d) => d != null && Math.abs(d) > 0.01)) : [];
    const misE = rs.filter((r) => st !== 'shape-filled' && SIDES.some((s) => { const d = r.diff.optical[s].optical; return d != null && Math.abs(d) > 0.01; })).length;
    const rg = rs.flatMap((r) => SIDES.map((s) => range(r, s)));
    const unE = rs.filter((r) => SIDES.some((s) => range(r, s) > 0.05)).length;
    const sd = rs.filter((r) => r.notes.optical && hyp(r.diff.shift.dx, r.diff.shift.dy) > 0.01).length;
    const su = rs.filter((r) => !r.notes.optical && hyp(r.centre.dx, r.centre.dy) > 0.005).map((r) => hyp(r.centre.dx, r.centre.dy));
    const cp = rs.filter((r) => r.pub.container != null).length, cf = rs.filter((r) => r.pub.container != null && !r.shell.encloses).length;
    const cm = rs.filter((r) => r.style === 'shape-filled' && r.pub.container == null && twinOf(r)?.shell.encloses).length;
    const gp = rs.filter((r) => r.pub.gap != null);
    console.log(`${m} | ${st} | ${rs.length} | ${f(err, 4)} | ${under.length ? `${f(q(under, 0.5))} / ${f(Math.max(...under))}` : '—'} | ${mis.length} / ${misE}${mis.length ? `, ${f(Math.max(...mis.map(Math.abs)))}` : ''} | ${rg.filter((v) => v > 0.05).length} / ${unE}, ${f(Math.max(...rg))} | ${sd} / ${su.length} (${f(Math.max(0, ...su))}) | ${cp} / ${cf} / ${cm} | ${gp.length} / ${gp.filter((r) => r.notes.glyph !== 'dot').length} / ${gp.filter((r) => r.gap && !r.gap.realDot).length} / ${rs.filter((r) => r.notes.glyph === 'dot' && r.pub.gap == null).length}`);
  }
}

// ── boxes ──────────────────────────────────────────────────────────────────
async function boxes() {
  head('§2 §7 §11.3 boxes, bearings and rounding');
  const S = summarize(rows);
  const inkOff = rows.filter((r) => ['x', 'y', 'w', 'h'].some((k) => r.pub.ink[k] !== r2(r.ink[k])));
  const bearOff = rows.filter((r) => SIDES.some((s) => r.pub.bearing[s] !== r2(r.bearing[s])));
  console.log(`max |published − exact| over ink and bearing ${f(S.inkMaxErr, 4)}; not one correct 2-dp rounding: ${S.notOneRounding} entries (ink ${inkOff.length}, bearing ${bearOff.length})`);
  const rc = by.get('24 rotate-ccw');
  console.log(`rotate-ccw@24 published w ${rc.pub.ink.w} h ${rc.pub.ink.h}; exact w ${f(rc.ink.w, 4)} h ${f(rc.ink.h, 4)} (x0 ${f(rc.ink.x, 4)}, x1 ${f(rc.ink.x + rc.ink.w, 4)})`);
  const asym = rows.filter((r) => (Math.abs(r.bearing.left - r.bearing.right) < 1e-6 && r.pub.bearing.left !== r.pub.bearing.right) || (Math.abs(r.bearing.top - r.bearing.bottom) < 1e-6 && r.pub.bearing.top !== r.pub.bearing.bottom));
  console.log(`symmetric drawings (exact sides equal to 1e-6) published asymmetric: ${asym.length}`, asym.slice(0, 3).map((r) => `${r.master} ${r.name}`));
  const tg = rows.flatMap((r) => SIDES.filter((s) => r.pub.optical[s].geometric != null && r.pub.optical[s].geometric !== r.pub.bearing[s]).map((s) => ({ r, s })));
  console.log(`optical.*.geometric ≠ bearing.*: ${tg.length} sides on ${new Set(tg.map((x) => x.r.master + x.r.name)).size} entries (max ${f(Math.max(...tg.map((x) => Math.abs(x.r.pub.optical[x.s].geometric - x.r.pub.bearing[x.s]))), 4)}); null on ${rows.reduce((t, r) => t + SIDES.filter((s) => r.pub.optical[s].geometric == null).length, 0)} more sides`);
  const ex = tg.find((x) => x.r.master === 24 && x.r.name === 'attachment-4-filled' && x.s === 'bottom') ?? tg[0];
  console.log(`  e.g. ${ex.r.master} ${ex.r.name} ${ex.s}: bearing ${ex.r.pub.bearing[ex.s]}, optical.geometric ${ex.r.pub.optical[ex.s].geometric}, exact ${f(ex.r.bearing[ex.s], 4)}`);
  // §2 twins' geometric bearings
  const pairs = rows.filter((r) => /-filled$/.test(r.name)).map((fl) => [twinOf(fl), fl]);
  const apart = (t) => pairs.filter(([o, fl]) => SIDES.some((s) => Math.abs(o.pub.bearing[s] - fl.pub.bearing[s]) > t));
  const a2 = apart(0.015), a1 = apart(0.01);
  console.log(`outline/filled pairs ${pairs.length}: bearings 0.02 or more apart ${a2.length} (without grows: ${a2.filter(([, fl]) => !fl.notes.grows).length}); a strict "> 0.01" on 2-dp values: ${a1.length} (without grows: ${a1.filter(([, fl]) => !fl.notes.grows).length})`);
  // §11.3 twin ink-box equality, two definitions
  const tupleOK = (o, fl, t) => ['x', 'y', 'w', 'h'].every((k) => Math.abs(o.ink[k] - fl.ink[k]) <= t);
  const edgeOK = (o, fl, t) => SIDES.every((s) => Math.abs(o.bearing[s] - fl.bearing[s]) <= t);
  for (const t of [1e-6, 0.001, 0.005, 0.0101]) console.log(`  exact boxes equal within ${t}: as (x, y, w, h) ${pairs.filter(([o, fl]) => tupleOK(o, fl, t)).length} · edge by edge ${pairs.filter(([o, fl]) => edgeOK(o, fl, t)).length}`);
  console.log(`  published 2-dp ink identical ${pairs.filter(([o, fl]) => ['x', 'y', 'w', 'h'].every((k) => o.pub.ink[k] === fl.pub.ink[k])).length}; published bearings within 0.01 (i.e. < 0.015) ${pairs.length - a2.length}`);
  // geometry.mjs bbox() against the exact centreline box
  const { geo } = await pinTools();
  let mx = 0, at = '';
  for (const r of rows) { const icon = iconOf(r.master, r.name); for (const p of [...icon.strokes, ...icon.areas]) { const b = geo.bbox([p.d]), e = centrelineBox(p); for (const k of ['x0', 'y0', 'x1', 'y1']) if (Number.isFinite(b[k]) && Math.abs(b[k] - e[k]) > mx) { mx = Math.abs(b[k] - e[k]); at = `${r.master} ${r.name} ${k} bbox ${f(b[k], 4)} exact ${f(e[k], 4)}`; } } }
  console.log(`geometry.mjs bbox() vs the exact centreline box: max ${f(mx, 4)} (${at})`);
}

// ── optical (shape-filled, twins, paintbrush-4) ────────────────────────────
function optical() {
  head('§3.1 §3.2 shape-filled drawings and the null entries');
  const sf = rows.filter((r) => r.style === 'shape-filled');
  const sides = sf.flatMap((r) => SIDES.map((s) => ({ r, s, d: -r.diff.optical[s].optical })));
  const flat = sides.filter((x) => x.d <= 0.01);
  console.log(`shape-filled sides ${sides.length}; understated by > 0.01: ${sides.length - flat.length}; the rest recede ${f(Math.min(...flat.map((x) => x.r.optical[x.s].recession)), 3)}–${f(Math.max(...flat.map((x) => x.r.optical[x.s].recession)), 3)} at masters ${[...new Set(flat.map((x) => x.r.master))]}`);
  for (const m of masters) {
    const d = sides.filter((x) => x.r.master === m).map((x) => x.d), w = sides.filter((x) => x.r.master === m).reduce((a, b) => (b.d > a.d ? b : a));
    console.log(`  ${m}: median ${f(q(d, 0.5), 3)} p90 ${f(q(d, 0.9), 3)} max ${f(w.d, 3)} (${w.r.name} ${w.s}) over 0.5: ${d.filter((x) => x > 0.5).length}`);
  }
  // twins: same geometric bearing, non-null twin
  let total = 0, nullTwin = 0, geoDiff = 0;
  const td = { 24: [], 20: [], 16: [] };
  for (const { r, s, d } of sides) {
    if (d <= 0.01) continue; total++;
    const t = twinOf(r);
    if (t.pub.optical[s].optical == null) { nullTwin++; continue; }
    if (Math.abs(t.pub.bearing[s] - r.pub.bearing[s]) > 0.015) { geoDiff++; continue; }
    td[r.master].push(t.pub.optical[s].optical - r.pub.optical[s].optical);
  }
  console.log(`understated sides ${total}: twin publishes null ${nullTwin}; twin geometric bearing differs ${geoDiff}; compared ${total - nullTwin - geoDiff}`);
  for (const m of masters) console.log(`  ${m}: outline − filled published optical: median ${f(q(td[m], 0.5), 2)} max ${f(Math.max(...td[m]), 2)}`);
  for (const k of ['24 plus-circle', '24 plus-circle-filled', '24 key-3', '24 key-3-filled', '16 home', '16 home-filled']) { const r = by.get(k); console.log(`  ${k}: published ${SIDES.map((s) => r.pub.optical[s].optical).join(' / ')} · exact ${SIDES.map((s) => f(r.optical[s].optical, 3)).join(' / ')}`); }
  for (const m of masters) { const r = by.get(`${m} paintbrush-4`); console.log(`  paintbrush-4@${m}: published ${SIDES.map((s) => r.pub.optical[s].optical).join(' / ')} · exact ${SIDES.map((s) => f(r.optical[s].optical, 2)).join(' / ')} · stability ${SIDES.map((s) => f(range(r, s), 3)).join(' / ')}`); }
  console.log(`  entries with an omitted (identical-endpoint) arc: ${rows.filter((r) => r.omittedArcs).map((r) => `${r.master} ${r.name}`).join(', ')}`);
}

// ── edges (§3.3) ───────────────────────────────────────────────────────────
async function edges() {
  head('§3.3 stroke drawings: the build\'s reading against the edge');
  const so = rows.filter((r) => r.style !== 'shape-filled');
  for (const [label, key] of [['exact model, ties to 1e-6', 'optical'], [`ties to ${TIE_WIDE} (the first version)`, 'opticalWide']]) {
    const off = so.flatMap((r) => SIDES.map((s) => ({ r, s, d: r.diff.optical[s][key] }))).filter((x) => x.d != null);
    const o1 = off.filter((x) => Math.abs(x.d) > 0.01), o5 = off.filter((x) => Math.abs(x.d) > 0.05);
    console.log(`${label}: > 0.01 on ${o1.length} sides (${new Set(o1.map((x) => x.r.master + x.r.name)).size} entries); > 0.05 on ${o5.length} sides (${new Set(o5.map((x) => x.r.master + x.r.name)).size} entries)`);
    if (key === 'optical') {
      for (const m of masters) { const a = o1.filter((x) => x.r.master === m), b = o5.filter((x) => x.r.master === m); console.log(`  ${m}: > 0.01 ${a.length} / ${new Set(a.map((x) => x.r.name)).size}, max ${f(Math.max(0, ...a.map((x) => Math.abs(x.d))), 3)}; > 0.05: ${[...new Set(b.map((x) => x.r.name))].join(', ') || 'none'}`); }
      let inside = 0, near = 0; const outside = [];
      for (const { r, s } of o5) { const p = r.pub.optical[s].optical, st = r.stability[s]; if (p >= st.lo - 1e-9 && p <= st.hi + 1e-9) inside++; else if (p >= st.lo - 0.01 && p <= st.hi + 0.01) near++; else outside.push(`${r.master} ${r.name} ${s} ${f(p - (p < st.lo ? st.lo : st.hi), 3)}`); }
      console.log(`  of the > 0.05: published inside the stability range ${inside}, within 0.01 of it ${near}, further ${outside.length}`, outside);
      const stable = so.flatMap((r) => SIDES.filter((s) => r.diff.optical[s].optical != null && range(r, s) <= 0.05).map((s) => Math.abs(r.diff.optical[s].optical)));
      console.log(`  stable sides ${stable.length}: within 0.01 ${stable.filter((d) => d <= 0.01).length}, max ${f(Math.max(...stable), 3)}`);
    }
  }
  // the build's own grid against the exact one, and the edge read at identical positions
  const { geo } = await pinTools();
  let readings = 0, over013 = 0, over05 = 0, oneSided = 0, maxDev = 0, disp = 0, dispMax = 0, dispAt = '', either = 0, either6 = 0, eitherMax = 0, eitherAt = '';
  const oneSidedFiles = new Set(), hist = {};
  const explained = { byGrid: 0, rest: 0, bigByGrid: 0, bigRest: 0, total: 0, grid: 0, reading: 0, list: [] };
  for (const r of so) {
    const icon = iconOf(r.master, r.name);
    const pts = icon.strokes.flatMap((p) => geo.samplePath(p.d)).filter(([x]) => Number.isFinite(x));
    const bp = buildProfiles(pts, icon.rootWidth);
    for (const s of SIDES) {
      const vertical = s === 'left' || s === 'right', hiSide = s === 'right' || s === 'bottom';
      const dlo = vertical ? bp.box.y0 - r.ink.y : bp.box.x0 - r.ink.x;
      if ((s === 'left' || s === 'top') && Math.abs(dlo) > 1e-9) disp++;
      if (Math.abs(dlo) > dispMax) { dispMax = Math.abs(dlo); dispAt = `${r.master} ${r.name} ${vertical ? 'y' : 'x'}`; }
      if (s === 'left' || s === 'top') {                 // the far end decides whether the last tangent scanline exists
        const dhi = vertical ? r.ink.y + r.ink.h - bp.box.y1 : r.ink.x + r.ink.w - bp.box.x1;
        if (Math.abs(dlo) > 1e-9 || Math.abs(dhi) > 1e-9) either++;
        if (Math.abs(dlo) > 1e-6 || Math.abs(dhi) > 1e-6) either6++;
        const w = Math.max(Math.abs(dlo), Math.abs(dhi));
        if (w > eitherMax) { eitherMax = w; eitherAt = `${r.master} ${r.name} ${vertical ? 'y' : 'x'}${Math.abs(dhi) > Math.abs(dlo) ? '1' : '0'}`; }
      }
      const trueAt = [];
      for (const [pos, b] of bp[s].all) {
        const e = inkSlice(icon, pos, vertical), t = e ? (hiSide ? e[1] : e[0]) : null;
        if (b == null && t == null) continue;
        readings++;
        if ((b == null) !== (t == null)) { oneSided++; oneSidedFiles.add(`${r.master} ${r.name}`); if (t != null) trueAt.push(t); continue; }
        if (b == null) continue;
        trueAt.push(t);
        const dv = Math.abs(b - t); maxDev = Math.max(maxDev, dv);
        if (dv > 0.013) over013++; if (dv > 0.05) over05++;
        const k = dv <= 0.001 ? 'a ≤0.001' : dv <= 0.005 ? 'b ≤0.005' : dv <= 0.013 ? 'c ≤0.013' : dv <= 0.05 ? 'd ≤0.05' : 'e >0.05'; hist[k] = (hist[k] ?? 0) + 1;
      }
      // J1: the true edge read on the build's own grid
      const d = r.diff.optical[s].optical;
      if (d != null && Math.abs(d) > 0.01) {
        const geoB = { left: bp.box.x0, top: bp.box.y0, right: r.master - bp.box.x1, bottom: r.master - bp.box.y1 }[s];
        const onBuildGrid = geoB + ALPHA * modelRecession(trueAt, farOf(trueAt, s), icon.rootWidth);
        const pub = r.pub.optical[s].optical, ex = r.optical[s].optical;
        explained.total += Math.abs(pub - ex); explained.grid += Math.abs(onBuildGrid - ex); explained.reading += Math.abs(pub - onBuildGrid);
        const big = Math.abs(d) > 0.05;
        if (Math.abs(pub - onBuildGrid) <= 0.01) { explained.byGrid++; if (big) explained.bigByGrid++; } else { explained.rest++; if (big) explained.bigRest++; explained.list.push(`${r.master} ${r.name} ${s}`); }
      }
    }
  }
  console.log(`build grid vs exact grid: its near end (where the grid starts) displaced on ${disp} of ${so.length * 2} drawing-axes, by up to ${f(dispMax, 4)} (${dispAt}); either end displaced on ${either} (by more than 1e-9; ${either6} by more than 1e-6), by up to ${f(eitherMax, 4)} (${eitherAt})`);
  console.log(`scanline readings at the build's own positions: ${readings}; off by > 0.013: ${over013} (${f((100 * over013) / readings, 1)}%); > 0.05: ${over05}; inked in one and empty in the other: ${oneSided} on ${oneSidedFiles.size} drawings; histogram ${JSON.stringify(hist)}; max ${f(maxDev, 3)}`);
  console.log(`of the > 0.01 disagreements, the true edge read on the build's own grid reproduces the published value (to 0.01) on ${explained.byGrid} (of the > 0.05: ${explained.bigByGrid}); not on ${explained.rest} (of the > 0.05: ${explained.bigRest})`);
  console.log(`  Σ |published − exact| ${f(explained.total, 2)} = grid part Σ |exact on build grid − exact| ${f(explained.grid, 2)} + reading part Σ |published − exact on build grid| ${f(explained.reading, 2)} (parts can overlap or cancel)`);
}

// ── knife (§3.4) ───────────────────────────────────────────────────────────
function knife() {
  head('§3.4 the knife-edge');
  const all = rows.flatMap((r) => SIDES.map((s) => ({ r, s, v: range(r, s) })));
  const un = all.filter((x) => x.v > 0.05), w = un.reduce((a, b) => (b.v > a.v ? b : a));
  console.log(`stability range > 0.05: ${un.length} of ${all.length} sides, ${new Set(un.map((x) => x.r.master + x.r.name)).size} of ${rows.length} entries; widest ${f(w.v, 3)} (${w.r.master} ${w.r.name} ${w.s}, ${f(w.r.stability[w.s].lo, 3)}–${f(w.r.stability[w.s].hi, 3)}, published ${w.r.pub.optical[w.s].optical})`);
  for (const m of masters) {
    const um = un.filter((x) => x.r.master === m), wm = um.reduce((a, b) => (b.v > a.v ? b : a));
    console.log(`  ${m}: ${um.length} sides / ${new Set(um.map((x) => x.r.name)).size} entries, widest ${f(wm.v, 3)} ${wm.r.name} ${wm.s} (${f(wm.r.stability[wm.s].lo, 2)}–${f(wm.r.stability[wm.s].hi, 2)}, published ${wm.r.pub.optical[wm.s].optical}); by style ${styles.map((st) => { const l = um.filter((x) => x.r.style === st); return `${st} ${l.length}/${new Set(l.map((x) => x.r.name)).size}`; }).join(', ')}`);
  }
  for (const [k, lab] of [['bySlide', 'the scanline grid slid by 0.002 (either way)'], ['byStart', 'the run started at another extreme within 0.02'], ['byTie', 'a step of exactly one stroke read as breaking']]) {
    const l = all.filter((x) => x.r.stability[x.s][k] > 0.05), wk = l.reduce((a, b) => (b.r.stability[b.s][k] > a.r.stability[a.s][k] ? b : a));
    console.log(`  alone, ${lab}: ${l.length} sides, ${new Set(l.map((x) => x.r.master + x.r.name)).size} entries, worst ${f(wk.r.stability[wk.s][k], 3)} (${wk.r.master} ${wk.r.name} ${wk.s})`);
  }
  for (const k of ['24 hash-2', '24 menu-arrow-left', '24 menu-arrow-right', '20 italic-filled', '24 filter-2-filled']) { const r = by.get(k); console.log(`  ${k}: published ${SIDES.map((s) => r.pub.optical[s].optical).join('/')} · exact ${SIDES.map((s) => f(r.optical[s].optical, 3)).join('/')} · range ${SIDES.map((s) => `${f(r.stability[s].lo, 2)}–${f(r.stability[s].hi, 2)}`).join(' ')}`); }
}

// ── mirror (§3.4) ──────────────────────────────────────────────────────────
function mirror() {
  head('§3.4 mirror images');
  for (const [how, swap] of [['lr', { left: 'right', right: 'left', top: 'top', bottom: 'bottom' }], ['tb', { left: 'left', right: 'right', top: 'bottom', bottom: 'top' }]]) {
    const pairs = [];
    for (const m of masters) {
      const idx = new Map();
      for (const r of rows.filter((x) => x.master === m)) { const k = r.mirrorKeys.self; if (!idx.has(k)) idx.set(k, []); idx.get(k).push(r); }
      for (const r of rows.filter((x) => x.master === m)) for (const o of idx.get(r.mirrorKeys[how]) ?? []) if (o.name > r.name && o.mirrorKeys.self !== r.mirrorKeys.self) pairs.push([r, o]);
    }
    const names = new Set(pairs.map(([a, b]) => `${a.name}|${b.name}`));
    const bad = pairs.filter(([a, b]) => SIDES.some((s) => a.pub.optical[s].optical != null && b.pub.optical[swap[s]].optical != null && Math.abs(a.pub.optical[s].optical - b.pub.optical[swap[s]].optical) > 0.05));
    console.log(`exact ${how === 'lr' ? 'left–right' : 'top–bottom'} mirror pairs: ${names.size} name pairs, ${pairs.length} entry pairs (${pairs.filter(([a]) => a.style !== 'shape-filled').length} stroke-only); published optical > 0.05 apart: ${bad.map(([a, b]) => `${a.master} ${a.name}/${b.name}`).join(', ') || 'none'}`);
  }
  const own = rows.filter((r) => SIDES.some((s) => Math.abs(r.mirror[s].total) > 0.05));
  const order = rows.filter((r) => SIDES.some((s) => Math.abs(r.mirror[s].order) > 0.05));
  const grid = rows.filter((r) => SIDES.some((s) => Math.abs(r.mirror[s].grid) > 0.05));
  const mx = rows.flatMap((r) => SIDES.map((s) => ({ r, s, v: Math.abs(r.mirror[s].total) }))).reduce((a, b) => (b.v > a.v ? b : a));
  console.log(`drawings that read > 0.05 differently from their own mirror image: ${own.length} (max ${f(mx.v, 3)}, ${mx.r.master} ${mx.r.name} ${mx.s}); from scan order alone (same grid read backwards) ${order.length}; from the grid re-anchoring alone ${grid.length}`);
  const so = (l) => l.filter((r) => r.style !== 'shape-filled').length;
  console.log(`  of them stroke-only: ${so(own)}; scan order alone ${so(order)}; grid alone ${so(grid)}`);
  const direct = rows.filter((r) => SIDES.some((s) => Math.abs(r.mirror[s].gridDirect) > 0.05));
  console.log(`  the grid re-anchored at the far edge and read forwards, against the original (the re-anchoring measured directly): ${direct.length} (stroke-only ${so(direct)})`);
}

// ── twins (§3.5) ───────────────────────────────────────────────────────────
function twins() {
  head('§3.5 line-heavy twins');
  const lf = rows.filter((r) => r.style === 'line-filled');
  const st = { 24: [], 20: [], 16: [] }, over = [];
  for (const r of lf) {
    const o = twinOf(r);
    for (const s of SIDES) {
      if (range(r, s) > 0.05 || range(o, s) > 0.05) continue;
      const d = Math.abs(r.pub.optical[s].optical - o.pub.optical[s].optical);
      st[r.master].push(d); if (d > 0.25) over.push({ r, s, d });
    }
  }
  const w = over.reduce((a, b) => (b.d > a.d ? b : a));
  console.log(`stable twin sides differing > 0.25: ${over.length} (concepts ${masters.map((m) => new Set(over.filter((x) => x.r.master === m).map((x) => x.r.name)).size).join(' / ')}); max ${f(w.d, 2)} ${w.r.master} ${w.r.name} ${w.s}; Σ ${f(sum(over.map((x) => x.d)), 1)}`);
  for (const m of masters) console.log(`  ${m}: stable sides ${st[m].length}, median ${f(q(st[m], 0.5), 2)} p90 ${f(q(st[m], 0.9), 2)} max ${f(Math.max(...st[m]), 2)}`);
  for (const k of ['italic', 'rotate-ccw-7']) { const a = by.get(`24 ${k}`), b = by.get(`24 ${k}-filled`); console.log(`  24 ${k}: outline ${SIDES.map((s) => `${a.pub.optical[s].optical} (rec ${a.pub.optical[s].recession})`).join(' ')} · filled ${SIDES.map((s) => `${b.pub.optical[s].optical} (rec ${b.pub.optical[s].recession})`).join(' ')}`); }
  // the alternative: judge the filled drawing at its master's outline stroke
  const OUT = { 24: 1.5, 20: 1.5, 16: 1.25 };
  for (const m of masters) {
    let changed = 0; const before = [], after = [];
    for (const r of lf.filter((x) => x.master === m)) {
      const icon = iconOf(m, r.name), o = twinOf(r);
      const alt = opticalOf(icon, { stroke: OUT[m] });
      if (SIDES.some((s) => Math.abs(r2(alt[s].optical) - r.pub.optical[s].optical) > 0.01)) changed++;
      for (const s of SIDES) { if (range(r, s) > 0.05 || range(o, s) > 0.05) continue; before.push(Math.abs(r.optical[s].optical - o.optical[s].optical)); after.push(Math.abs(alt[s].optical - o.optical[s].optical)); }
    }
    console.log(`  alternative at ${m} (stable sides; changed = moves the published value by > 0.01): entries changed ${changed}; |filled − outline| exact model median/p90/max ${f(q(before, 0.5))}/${f(q(before, 0.9))}/${f(Math.max(...before))} → ${f(q(after, 0.5))}/${f(q(after, 0.9))}/${f(Math.max(...after))}`);
  }
}

// ── shift (§4) ─────────────────────────────────────────────────────────────
function shift() {
  head('§4 shift (offsets measured as a distance, √(dx² + dy²))');
  const decl = rows.filter((r) => r.notes.optical);
  const dd = decl.map((r) => ({ r, d: hyp(r.diff.shift.dx, r.diff.shift.dy) }));
  const note = decl.filter((r) => r.pub.shift[0] !== r.notes.optical[0] || r.pub.shift[1] !== r.notes.optical[1]);
  const band = dd.filter((x) => x.d > 0.005 && x.d <= 0.01);
  console.log(`declared ${decl.length}; published shift ≠ its note ${note.length}; drawn within 0.005 ${dd.filter((x) => x.d <= 0.005).length}; 0.005–0.01 ${band.length} (${f(Math.min(...band.map((x) => x.d)), 4)}–${f(Math.max(...band.map((x) => x.d)), 4)}): ${[...new Set(band.map((x) => `${x.r.master} ${x.r.name}`))].filter((k) => !/chevron/.test(k)).join(', ')} + ${band.filter((x) => /chevron/.test(x.r.name)).length} chevron entries (${band.filter((x) => /chevron/.test(x.r.name) && x.r.style === 'line-filled').length} filled); > 0.01 ${dd.filter((x) => x.d > 0.01).length}`);
  for (const { r } of dd.filter((x) => x.d > 0.01)) console.log(`  ${r.master} ${r.name}: published ${r.pub.shift} drawn ${f(r.centre.dx, 3)},${f(r.centre.dy, 3)}`);
  const und = rows.filter((r) => !r.notes.optical && hyp(r.centre.dx, r.centre.dy) > 0.005).map((r) => ({ r, d: hyp(r.centre.dx, r.centre.dy) }));
  const na = und.filter((x) => !anchored(x.r));
  console.log(`undeclared, off-centre > 0.005: ${und.length}; anchored ${und.length - na.length}; others ${na.length}, of them 0.1–0.5: ${na.filter((x) => x.d >= 0.1 && x.d <= 0.5).length}, max ${f(Math.max(...na.map((x) => x.d)), 3)}`);
  const edge = na.filter((x) => Math.abs(x.d - 0.1) < 0.002 || Math.abs(x.d - 0.5) < 0.002);
  console.log(`  at the band's edges (within 0.002 of 0.1 or 0.5): ${edge.map((x) => `${x.r.master} ${x.r.name} ${x.d.toFixed(6)}`).join(', ')}`);
  for (const m of masters) console.log(`  ${m}: ${styles.map((st) => { const l = und.filter((x) => x.r.master === m && x.r.style === st); return `${st} ${l.length} (max ${f(Math.max(0, ...l.map((x) => x.d)), 2)})`; }).join(', ')}`);
  for (const k of ['24 volume-low', '20 volume-low', '16 volume-low', '24 volume-none', '20 volume-none', '16 volume-none', '24 watch-2', '16 volume-off', '24 map-pin-4']) { const r = by.get(k); console.log(`  ${k}: drawn ${f(r.centre.dx, 3)}, ${f(r.centre.dy, 3)} · published ${r.pub.shift}`); }
}

// ── container (§5) ─────────────────────────────────────────────────────────
function container() {
  head('§5 container and ratio');
  const pubd = rows.filter((r) => r.pub.container != null);
  const open = [...new Set(pubd.filter((r) => !r.shell.closed).map((r) => r.name))];
  const leaky = [...new Set(pubd.filter((r) => r.shell.closed && !r.shell.encloses).map((r) => r.name))];
  console.log(`published ${pubd.length}; not a container ${pubd.filter((r) => !r.shell.encloses).length}: open shell (${open.length} names) ${open.join(' ')}; closed with ink outside (${leaky.length}) ${leaky.join(' ')}`);
  const genuine = pubd.filter((r) => r.shell.encloses);
  console.log(`genuine ${genuine.length}: container max diff ${f(Math.max(...genuine.map((r) => Math.abs(r.pub.container - r.shell.container))), 4)}, ratio max diff ${f(Math.max(...genuine.flatMap((r) => [Math.abs(r.pub.ratio.w - r.shell.mark.w / r.shell.container), Math.abs(r.pub.ratio.h - r.shell.mark.h / r.shell.container)])), 4)}`);
  const ratio1 = pubd.filter((r) => r.pub.ratio.w >= 0.99 && r.pub.ratio.h >= 0.99);
  console.log(`ratio ≥ 0.99 on both axes (enforcement-gap.md:370's test): ${ratio1.length} entries, ${new Set(ratio1.map((r) => r.name)).size} names`);
  const filledNull = rows.filter((r) => /-filled$/.test(r.name) && r.pub.container == null);
  const anyTwin = filledNull.filter((r) => twinOf(r)?.pub.container != null);
  const trueTwin = filledNull.filter((r) => r.style === 'shape-filled' && twinOf(r)?.shell.encloses);
  console.log(`filled entries publishing null with a twin that publishes a number: ${anyTwin.length}; shape-filled with a genuine-container twin: ${trueTwin.length}`);
  const alone = trueTwin.filter((r) => r.filled?.alone);
  console.log(`  one shape with nothing inside it: ${alone.length} (${[...new Set(alone.map((r) => r.name))].join(' ')})`);
  for (const k of ['box', 'ring', 'strict']) { const ok = trueTwin.filter((r) => r.filled?.encloses?.[k] && !r.filled.alone); console.log(`  enclosure read as ${k}: ${ok.length} have one outer shape around the other parts, ${trueTwin.length - ok.length - alone.length} are split`); }
  const ok = trueTwin.filter((r) => r.filled?.encloses?.ring && !r.filled.alone);
  console.log(`  (ring) container vs twin max diff ${f(Math.max(...ok.map((r) => Math.abs(r.filled.container - twinOf(r).pub.container))), 4)}`);
  let single = 0, ringInOne = 0;
  for (const r of rows.filter((x) => x.style !== 'shape-filled')) {
    const icon = iconOf(r.master, r.name); if (icon.strokes.length !== 1) continue; single++;
    const subs = icon.strokes[0].subpaths.filter((s) => s.segs.length); if (subs.length < 2) continue;
    const sh = shellOf({ ...icon, strokes: subs.map((s) => ({ ...icon.strokes[0], subpaths: [s] })) });
    if (sh.shell >= 0 && sh.encloses) ringInOne++;
  }
  console.log(`single-path stroke drawings ${single}; of them holding a ring and a mark in one d: ${ringInOne}`);
}

// ── gap (§6) ───────────────────────────────────────────────────────────────
function gap() {
  head('§6 gap');
  const g = rows.filter((r) => r.pub.gap != null);
  const glyph = g.filter((r) => r.notes.glyph === 'dot');
  console.log(`published ${g.length}; on declared glyphs ${glyph.length}, max |published − exact| ${f(Math.max(...glyph.flatMap((r) => ['size', 'part', 'ratio'].map((k) => Math.abs(r.pub.gap[k] - r.gap[k])))), 4)}`);
  const worst = g.map((r) => ({ r, d: Math.abs(r.pub.gap.size - r.gap.size) })).sort((a, b) => b.d - a.d).slice(0, 6);
  console.log('  largest size errors:', worst.map((x) => `${x.r.master} ${x.r.name} pub ${x.r.pub.gap.size} exact ${f(x.r.gap.size, 3)}`).join('; '));
  const fd = g.filter((r) => !r.gap.realDot), ng = g.filter((r) => r.notes.glyph !== 'dot');
  console.log(`false dot ${fd.length} (${[...new Set(fd.map((r) => r.name))].join(' ')}), all among the non-glyph ${ng.length} (${[...new Set(ng.map((r) => r.name))].length} names: ${[...new Set(ng.map((r) => r.name))].join(' ')})`);
  for (const r of fd) console.log(`  ${r.master} ${r.name}: published ${JSON.stringify(r.pub.gap)} exact size ${f(r.gap.size, 3)}`);
  const dn = rows.filter((r) => r.notes.glyph === 'dot' && r.pub.gap == null);
  console.log(`declared glyph: dot, published null: ${dn.length} (shape-filled ${dn.filter((r) => r.style === 'shape-filled').length}; others ${[...new Set(dn.filter((r) => r.style !== 'shape-filled').map((r) => r.name))].join(' ')})`);
}

// ── padding (§8) ───────────────────────────────────────────────────────────
async function padding() {
  head('§8 12 px of padding + the optical bearing, at the master\'s own size');
  for (const m of masters) {
    const rs = rows.filter((r) => r.master === m);
    const pub = rs.flatMap((r) => SIDES.map((s) => r.pub.optical[s].optical)).filter((v) => v != null);
    const ex = rs.flatMap((r) => SIDES.map((s) => r.optical[s].optical));
    const noA = rs.filter((r) => !anchored(r)).flatMap((r) => SIDES.map((s) => r.pub.optical[s].optical)).filter((v) => v != null);
    const lrP = rs.flatMap((r) => ['left', 'right'].map((s) => r.pub.optical[s].optical)).filter((v) => v != null);
    const lrE = rs.flatMap((r) => ['left', 'right'].map((s) => r.optical[s].optical));
    console.log(`${m}: published ${f(12 + Math.min(...pub))}–${f(12 + Math.max(...pub))} · exact ${f(12 + Math.min(...ex))}–${f(12 + Math.max(...ex))} · published without anchored levels ${f(12 + Math.min(...noA))}–${f(12 + Math.max(...noA))} · left/right middle 90%: published ${f(12 + q(lrP, 0.05))}–${f(12 + q(lrP, 0.95))} (median ${f(12 + q(lrP, 0.5))}), exact ${f(12 + q(lrE, 0.05))}–${f(12 + q(lrE, 0.95))} (median ${f(12 + q(lrE, 0.5))}) · gap 8 px: ${f(8 + Math.min(...pub))}–${f(8 + Math.max(...pub))} · min geometric ${Math.min(...rs.flatMap((r) => SIDES.map((s) => r.pub.bearing[s])))}`);
  }
  const { opt } = await pinTools();
  const dir = join(PIN, 'src/_legacy-stroke-2');
  if (existsSync(dir)) {
    const lr = [];
    for (const fn of readdirSync(dir).filter((x) => x.endsWith('.svg'))) {
      const src = readFileSync(join(dir, fn), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
      const sw = Number(src.match(/<svg\b[^>]*stroke-width="([\d.]+)"/)[1]);
      const o = opt.opticalBearings([...src.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((x) => x[1]), sw, 24);
      lr.push(o.left.optical, o.right.optical);
    }
    console.log(`legacy stroke-2 drawings (${lr.length / 2}) under the pin's optical.mjs, left/right: 12 + ${f(Math.min(...lr))}–${f(Math.max(...lr))} = ${f(12 + Math.min(...lr), 1)}–${f(12 + Math.max(...lr), 1)} px`);
  }
}

// ── exposure (§10) ─────────────────────────────────────────────────────────
function exposure() {
  head('§10 exposure — Σ, over the sides or fields in Reach, of the error in master units');
  const sf = rows.filter((r) => r.style === 'shape-filled').flatMap((r) => SIDES.map((s) => -r.diff.optical[s].optical)).filter((d) => d > 0.01);
  console.log(`1 shape-filled: Σ (exact − published) over ${sf.length} understated sides = ${f(sum(sf), 1)}`);
  const un = rows.flatMap((r) => SIDES.map((s) => range(r, s))).filter((v) => v > 0.05);
  console.log(`2 knife-edge: Σ (highest − lowest reading) over ${un.length} sides = ${f(sum(un), 1)}`);
  const nul = rows.flatMap((r) => SIDES.filter((s) => r.pub.optical[s].optical == null).map((s) => r.optical[s].optical));
  console.log(`4 null: Σ exact optical bearing over ${nul.length} null sides = ${f(sum(nul), 1)}`);
  const mis = rows.filter((r) => r.style !== 'shape-filled').flatMap((r) => SIDES.map((s) => r.diff.optical[s].optical)).filter((d) => d != null && Math.abs(d) > 0.01).map(Math.abs);
  console.log(`5 misread: Σ |published − exact| over ${mis.length} sides = ${f(sum(mis), 1)}`);
  const und = rows.filter((r) => !r.notes.optical && hyp(r.centre.dx, r.centre.dy) > 0.005).map((r) => hyp(r.centre.dx, r.centre.dy));
  const decl = rows.filter((r) => r.notes.optical && hyp(r.diff.shift.dx, r.diff.shift.dy) > 0.01).map((r) => hyp(r.diff.shift.dx, r.diff.shift.dy));
  console.log(`6 shift: Σ drawn offset over ${und.length} undeclared = ${f(sum(und), 1)}; 6b Σ |declared − drawn| over ${decl.length} = ${f(sum(decl), 1)}`);
  let rnd = 0, rndN = 0, rndVsRound = 0;
  for (const r of rows) {
    for (const k of ['x', 'y', 'w', 'h']) if (r.pub.ink[k] !== r2(r.ink[k])) { rnd += Math.abs(r.pub.ink[k] - r.ink[k]); rndVsRound += Math.abs(r.pub.ink[k] - r2(r.ink[k])); rndN++; }
    for (const s of SIDES) if (r.pub.bearing[s] !== r2(r.bearing[s])) { rnd += Math.abs(r.pub.bearing[s] - r.bearing[s]); rndVsRound += Math.abs(r.pub.bearing[s] - r2(r.bearing[s])); rndN++; }
  }
  console.log(`7 rounding: ${rndN} fields not their correct rounding; Σ |published − exact| = ${f(rnd, 2)}; Σ |published − correct rounding| = ${f(rndVsRound, 2)}`);
  const tg = rows.flatMap((r) => SIDES.filter((s) => r.pub.optical[s].geometric != null && r.pub.optical[s].geometric !== r.pub.bearing[s]).map((s) => Math.abs(r.pub.optical[s].geometric - r.pub.bearing[s])));
  console.log(`7b two geometrics: Σ |optical.geometric − bearing| over ${tg.length} sides = ${f(sum(tg), 2)}`);
}

// ── examples ───────────────────────────────────────────────────────────────

/** `d` with its zero-length arcs (identical endpoints) taken out — SVG 1.1 F.6.2
 *  omits them, so the drawing is unchanged. Handles the commands the set uses. */
function dropZeroArcs(d) {
  const t = tokens(d), ARITY = { M: 2, L: 2, H: 1, V: 1, A: 7 }, out = [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, dropped = 0;
  while (i < t.length) {
    const c = t[i++], up = c.toUpperCase(), rel = c !== up;
    if (up === 'Z') { out.push(c); cx = sx; cy = sy; continue; }
    if (!ARITY[up]) throw new Error(`dropZeroArcs: ${c} is not handled`);
    let first = true;
    do {
      const a = t.slice(i, i + ARITY[up]); i += ARITY[up];
      if (up === 'M') { const [x, y] = rel ? [cx + a[0], cy + a[1]] : a; if (first) { sx = x; sy = y; } cx = x; cy = y; out.push(`${first ? c : rel ? 'l' : 'L'}${a.join(' ')}`); }
      else if (up === 'L') { [cx, cy] = rel ? [cx + a[0], cy + a[1]] : a; out.push(`${c}${a.join(' ')}`); }
      else if (up === 'H') { cx = rel ? cx + a[0] : a[0]; out.push(`${c}${a[0]}`); }
      else if (up === 'V') { cy = rel ? cy + a[0] : a[0]; out.push(`${c}${a[0]}`); }
      else { const [x, y] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]]; if (x === cx && y === cy) dropped++; else out.push(`${c}${a.join(' ')}`); cx = x; cy = y; }
      first = false;
    } while (i < t.length && typeof t[i] === 'number');
  }
  return { d: out.join(''), dropped };
}

async function examples() {
  head('worked examples the document quotes, each labelled with the section it backs');
  const P = (m, n) => metrics[m][n];
  const ar = P(24, 'arrow-right'), pl = P(24, 'plus'), pll = P(24, 'plus-large'), cd = P(24, 'chevron-down');
  console.log(`§2 README examples at 24: arrow-right recession ${ar.optical.left.recession} at the shaft end (left), ${ar.optical.right.recession} at the head (right); plus recession ${SIDES.map((s) => pl.optical[s].recession).join(' / ')}; geometric bearing plus ${pl.bearing.left}, plus-large ${pll.bearing.left}, chevron-down ${cd.bearing.left} / ${cd.bearing.right} left/right and ${cd.bearing.top} / ${cd.bearing.bottom} top/bottom`);
  const { geo, opt } = await pinTools();
  const pb = iconOf(24, 'paintbrush-4');
  const kept = pb.strokes.map((p) => dropZeroArcs(p.d));
  const o = opt.opticalBearings(kept.map((k) => k.d), pb.rootWidth, 24);
  console.log(`§3.2 paintbrush-4@24 read by the pin's own optical.mjs with the zero-length arc removed (${kept.reduce((n, k) => n + k.dropped, 0)} arc): ${SIDES.map((s) => o[s].optical).join(' / ')}`);
  const read = (m, n, side, at) => {
    const icon = iconOf(m, n);
    const bp = buildProfiles(icon.strokes.flatMap((p) => geo.samplePath(p.d)).filter(([x]) => Number.isFinite(x)), icon.rootWidth);
    const hit = bp[side].all.reduce((a, b) => (Math.abs(b[0] - at) < Math.abs(a[0] - at) ? b : a));
    const e = inkSlice(icon, hit[0], side === 'left' || side === 'right');
    return { pos: hit[0], build: hit[1], truth: side === 'right' || side === 'bottom' ? e[1] : e[0] };
  };
  const cw = read(16, 'compose-4', 'right', 10), pv = read(16, 'paintbrush-5', 'left', 9);
  console.log(`§3.3 compose-4@16 frame wall, right side at y = ${cw.pos.toFixed(4)} (the build's own scanline): the build reads ${cw.build.toFixed(3)} for ${cw.truth.toFixed(3)}`);
  console.log(`§3.3 paintbrush-5@16 left side at y = ${pv.pos.toFixed(4)} (the build's own scanline): the build reads ${pv.build.toFixed(2)} where the ink reaches ${pv.truth.toFixed(2)}`);
  const ma = iconOf(24, 'menu-arrow-left');
  const arc = ma.strokes[0].subpaths[0].segs.find((g) => g.k === 'A');
  const x0 = inkBoxOf(ma).x0;
  console.log(`§3.4 menu-arrow-left@24: the bend's tangent point is written ${arc.a[0]} for ${(6 - 0.75 * Math.SQRT1_2).toFixed(4)} (6 − 0.75·cos 45°); the arc's centre lands at x ${arc.cx.toFixed(4)} and the ink's left edge at ${x0.toFixed(4)}, ${(x0 - Math.round(x0 * 4) / 4).toFixed(4)} off the quarter grid`);
  const xs = ['x', 'x-large', 'x-small'];
  console.log(`§5 bare x at 24: container ${xs.map((n) => `${n} ${P(24, n).container}`).join(' · ')}, ratio ${xs.map((n) => `${P(24, n).ratio.w}×${P(24, n).ratio.h}`).join(' · ')}`);
  console.log(`§6 gap on drawings with no glyph note, at 24: ${['image', 'wallet-2', 'wand'].map((n) => `${n} ${P(24, n).gap.size}`).join(' · ')}`);
  const bf = P(24, 'bell-filled'), bb = inkBoxOf(iconOf(24, 'bell-filled'));
  console.log(`§7 bell-filled@24 bearing left ${bf.bearing.left} / right ${bf.bearing.right}; exact ${bb.x0.toFixed(4)} / ${(24 - bb.x1).toFixed(4)}`);
  const A = new Map(), B = new Map();
  for (const m of masters) for (const [n, e] of Object.entries(metrics[m])) {
    if (e.container == null) continue;
    if (e.ratio.w >= 0.99 && e.ratio.h >= 0.99) A.set(`${m} ${n}`, n);
    if (!shellOf(iconOf(m, n)).encloses) B.set(`${m} ${n}`, n);
  }
  const an = new Set(A.values()), bn = new Set(B.values());
  const both = [...an].filter((n) => bn.has(n)), onlyA = [...an].filter((n) => !bn.has(n)), onlyB = [...bn].filter((n) => !an.has(n));
  console.log(`§11.1 container criteria: ratio ≥ 0.99 on both axes ${A.size} entries / ${an.size} names; not a closed path enclosing the rest ${B.size} / ${bn.size}; names in both ${both.length} (${both.join(' ')}); only in the first ${onlyA.length} (${onlyA.join(' ')}); only in the second ${onlyB.length}`);
}

const SECTIONS = { census, faithful, fields, boxes, optical, edges, knife, mirror, twins, shift, container, gap, padding, exposure, examples };
console.log(`metrics-probe · ${Object.values(metrics).reduce((t, m) => t + Object.keys(m).length, 0)} entries · pin ${PIN}`);
for (const s of sections) { if (!SECTIONS[s]) { console.error(`unknown section ${s}`); process.exit(2); } await SECTIONS[s](); }
