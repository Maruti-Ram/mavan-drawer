#!/usr/bin/env node
// Optical placement (C14, C15) as a comparison sheet. A mark must read optically balanced in its
// square canvas (24 · 20 · 16) against all four edges at once — top, bottom, left and right — so
// both axes are judged together. This writes the board with every shape at a grid of (x, y)
// positions around its recommendation; lab/optical-shift.html lays them out: one group per shape,
// one row per position, the mark in its canvas outline at each master, then in a menu row, inline
// text and icon buttons.
//
//   node tools/optical-sheet.mjs <shape>…
//        [--rec <shape>=<x>:<y>,…]         recommended position (default: measured, below)
//        [--xs -0.1,0,0.1] [--ys -0.1,0,0.1]
//                                          offsets around the recommendation on each axis
//        [--ids <id>,…]                    one id per shape (default: its tag's initial)
//        [--context "Mark as done"]        the verb in the menu row and inline text
//
//   e.g. node tools/optical-sheet.mjs check check-small check-2 check-2-small --ids C,Cs,W,Ws
//
// Units: a position (x, y) is in units of the family default at 24, SVG signs (x + right,
// y + down). Each master and size variant moves by x × (its ink width ÷ the default's) and
// y × (its ink height ÷ the default's). Row ids read <id><x><y> in hundredths with r/l and d/u,
// e.g. C r45 u20 → "Cr45u20"; a centred axis is left out ("C0" is box-centred).
//
// Measured recommendation (single-bend marks): the eye reads a bent mark's centre as the centre
// of the triangle through its two ends and its bend, so the mark moves against that triangle's
// offset from the box centre, by K of it, on each axis. K = 0.5 is calibrated on the chevron
// picks (classic 0.50 · steep 0.47 · flat 0.70 of their vertical offsets). An axis the file has
// already been placed on keeps its shipped value as the recommendation. The shipped position,
// the box centre and every grid position are rows; the eye makes the pick.
import { readFileSync, writeFileSync } from 'node:fs';
import { sizeBase } from './masters.mjs';

const MASTERS = [24, 20, 16];
const K = 0.5;
const r2 = (v) => Math.round(v * 100) / 100 || 0;
const r05 = (v) => Math.round(v * 20) / 20 || 0;
const die = (msg) => { console.error(msg); process.exit(1); };

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args.splice(i, 2)[1]; };
if (args.includes('--dir')) die('--dir is retired: placement is judged on both axes at once (C15). Use --rec x:y, --xs, --ys.');
const list = (s) => s.split(',').map(Number);
const xs = list(opt('xs', '-0.1,0,0.1'));
const ys = list(opt('ys', '-0.1,0,0.1'));
const rec = Object.fromEntries(opt('rec', '').split(',').filter(Boolean)
  .map((p) => p.split('=')).map(([k, v]) => [k, v.split(':').map(Number)]));
const ids = opt('ids', '').split(',').filter(Boolean);
const context = opt('context', null);
const shapes = args;
if (!shapes.length) die('Name at least one shape, e.g. check check-2');

const man = JSON.parse(readFileSync('lab/manifest.json', 'utf8')).masters;
const at = (m, n) => man[m]?.icons[n] ?? die(`${n} is not in the ${m} master (run npm run build?)`);

// Move an SVG path by (dx, dy). Absolute commands move every coordinate; relative ones only
// need their opening `m` moved.
function move(d, dx, dy) {
  let first = true;
  return d.replace(/([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g, (_, c, a) => {
    const n = a.trim() ? a.trim().split(/[\s,]+|(?=-)/).map(Number) : [];
    const rel = c === c.toLowerCase() && !(c === 'm' && first);
    first = false;
    if (!rel) {
      const C = c.toUpperCase();
      if (C === 'H') for (let i = 0; i < n.length; i++) n[i] += dx;
      else if (C === 'V') for (let i = 0; i < n.length; i++) n[i] += dy;
      else if (C === 'A') for (let i = 0; i < n.length; i += 7) { n[i + 5] += dx; n[i + 6] += dy; }
      else for (let i = 0; i < n.length; i += 2) { n[i] += dx; n[i + 1] += dy; }
    }
    return c + n.map(r2).join(' ');
  });
}

// Triangle through a single-bend mark's ends and bend apex; its centre's offset from the ink box
// centre, measured on the box-centred drawing. null when the mark isn't one open bend.
function triangleOffset(i) {
  if (i.paths.length !== 1) return null;
  const n = i.paths[0].match(/[A-Za-z]|-?[\d.]+/g);
  if (n.join('').replace(/[-\d.]/g, '') !== 'MLAL') return null;
  const v = n.filter((x) => !/[A-Za-z]/.test(x)).map(Number);
  const S = [v[0], v[1]], P1 = [v[2], v[3]], r = v[4], P2 = [v[9], v[10]], E = [v[11], v[12]];
  const M = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2];
  const half = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]) / 2;
  const sag = r - Math.sqrt(Math.max(r * r - half * half, 0));          // arc bulge past its chord
  const inward = [(S[0] + E[0]) / 2 - M[0], (S[1] + E[1]) / 2 - M[1]];
  const len = Math.hypot(...inward) || 1;
  const A = [M[0] - sag * inward[0] / len, M[1] - sag * inward[1] / len];
  const box = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];          // both move with the shift
  return [(S[0] + A[0] + E[0]) / 3 - box[0], (S[1] + A[1] + E[1]) / 3 - box[1]];
}

const code = (v, pos, neg) => (v ? `${v > 0 ? pos : neg}${Math.round(Math.abs(v) * 100)}` : '');
const arrow = ([x, y]) => [x ? `${x > 0 ? '→' : '←'} ${Math.abs(x)}` : '', y ? `${y > 0 ? '↓' : '↑'} ${Math.abs(y)}` : '']
  .filter(Boolean).join('  ') || 'centred';

const used = new Set();
const candidates = [];
shapes.forEach((name, k) => {
  const base = at(24, name);
  const ref = at(24, sizeBase(name));                          // the family default sets the units
  const tag = base.tags?.[0] ?? name;
  const said = [...readFileSync(`src/icons/24/${name}.svg`, 'utf8').matchAll(/<!--\s*(.*?)\s*-->/g)]
    .map((x) => x[1]).filter((x) => !/^(keyline|tags|optical):/.test(x)).pop() ?? `${name} · ${tag}`;
  const own = said.split(': ')[0];
  const detail = said.split(': ').slice(1).join(': ').replace(/ · optical .*\(C1[45]\)/, '');
  const id = ids[k] ?? [...tag.toUpperCase()].find((ch) => /[A-Z]/.test(ch) && !used.has(ch)) ?? String(k + 1);
  used.add(id);

  // Everything in family-default units: x by width, y by height.
  const unit = [base.ink.w / ref.ink.w, base.ink.h / ref.ink.h];
  const shipped = base.shift.map((v, a) => r2(v / unit[a]));
  const tri = triangleOffset(ref);
  const measured = tri && tri.map((v) => r05(-K * v));
  const fam = rec[sizeBase(name)];
  const refShift = ref.shift;                                  // the default's placed axes
  const want = rec[name] ?? fam ?? [0, 1].map((a) => (refShift[a] ? r2(refShift[a]) : measured?.[a] ?? 0));
  // Size variants store 2 dp at their own scale, so their shipped value reads back ±0.01 off.
  const same = (p, q) => p.every((v, a) => Math.abs(v - q[a]) < 0.015);
  const ship = same(shipped, want) ? want : shipped;

  const seen = new Set();
  const positions = [[0, 0], ship, ...xs.flatMap((dx) => ys.map((dy) => [r2(want[0] + dx), r2(want[1] + dy)]))]
    .filter((p) => { const key = p.join(); return !seen.has(key) && seen.add(key); })
    .sort((p, q) => p[1] - q[1] || p[0] - q[0]);
  console.log(`${name.padEnd(16)} ${tri ? `triangle ${tri.map(r2).join(', ')} → measured ${measured.join(', ')}` : 'no measure'}` +
    ` · recommended ${want.join(', ')} · shipped ${ship.join(', ')} · ${positions.length} rows`);

  for (const pos of positions) {
    const c = { id: `${id}${code(pos[0], 'r', 'l')}${code(pos[1], 'd', 'u')}` || id, label: own, tags: base.tags ?? [],
      group: `${name} · ${tag}`, pos, shipped: same(pos, ship), recommended: same(pos, want),
      optical: {}, masters: {}, filled: {} };
    if (c.id === id) c.id = `${id}0`;
    const by = [];
    for (const m of MASTERS) {
      const o = at(m, name), f = at(m, `${name}-filled`);
      const [dx, dy] = [r2(pos[0] * o.ink.w / ref.ink.w), r2(pos[1] * o.ink.h / ref.ink.h)];
      by.push(arrow([dx, dy]));
      c.optical[m] = [dx, dy];
      c.masters[m] = o.paths.map((d) => move(d, dx - o.shift[0], dy - o.shift[1]));
      const back = (d) => move(d, dx - f.shift[0], dy - f.shift[1]);
      c.filled[m] = f.areas.length
        ? { fill: f.areas.map(back), stroke: f.paths.map(back) }
        : { weight: f.stroke, stroke: f.paths.map(back) };
    }
    c.at = arrow(pos);
    c.by = by;
    c.note = [detail, pos[0] || pos[1] ? `optical ${by.join(' / ')} at 24 / 20 / 16 (C14, C15)` : ''].filter(Boolean).join(' · ');
    candidates.push(c);
  }
});

const concept = sizeBase(shapes[0]);
writeFileSync('lab/drafts/current.js',
  `// ${concept} — optical placement sheet, written by tools/optical-sheet.mjs. Each row is an (x, y)\n` +
  `// position in family-default units at 24; judge the balance in the canvas against all four edges.\n` +
  `export default ${JSON.stringify({
    concept, keyline: 'mark', ...(context ? { context } : {}),
    question: 'Optical placement (C15): which position reads balanced in the canvas — top, bottom, left and right — for each shape? Open /lab/optical-shift.html.',
    candidates,
  }, null, 2)};\n`);
console.log(`${candidates.length} rows · ${shapes.length} shapes → lab/drafts/current.js · open /lab/optical-shift.html`);
