#!/usr/bin/env node
// Optical placement (C14) as a comparison sheet. Writes the board with every shape of a family
// at a range of shifts, then lab/optical-shift.html lays them out: one group per shape, one row
// per shift, in a menu row, inline text and icon buttons at 24 · 20 · 16.
//
//   node tools/optical-sheet.mjs <shape>… --dir up|down|left|right
//        [--rec <shape>=<n>,…]             the row to mark "recommended" (default: measured, below)
//        [--spread 0.1]                    rows sit at rec ± 1 and 2 × spread, plus 0 and shipped
//        [--shifts 0,0.25,…]               fixed rows for every shape instead of the spread
//        [--ids <id>,…]                    one id letter per shape (default: its tag's initial)
//        [--context "Mark as done"]        the verb in the menu row and inline text
//
//   e.g. node tools/optical-sheet.mjs check check-2 check-3 check-4 --dir up
//
// The measured recommendation (single-bend marks): the eye reads a bent mark's centre as the
// centre of the triangle through its two ends and its bend, so the mark moves against that
// triangle's offset from the box centre, by K of it. K = 0.5 is calibrated on the chevron picks
// (classic 0.50 · steep 0.47 · flat 0.70 of their offsets). Rows are spread around each shape's
// own value, so shapes that need different amounts are judged on their own ranges.
//
// Shapes are read from the built manifest (run `npm run build` first). Each is taken back to its
// box centre (its declared shift removed), then moved by n × (ink height ÷ its default-24 ink
// height), so 20 and 16 and other sizes scale like C14 does. The row equal to the shipped shift is
// marked "shipped". Candidates carry `optical`, so `queue.mjs approve` can write a picked row.
import { readFileSync, writeFileSync } from 'node:fs';

const MASTERS = [24, 20, 16];
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const r2 = (v) => Math.round(v * 100) / 100 || 0;
const die = (msg) => { console.error(msg); process.exit(1); };

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args.splice(i, 2)[1]; };
const dirName = opt('dir', '');
const dir = DIRS[dirName] ?? die('--dir up|down|left|right is required');
const K = 0.5;
const fixed = opt('shifts', null)?.split(',').map(Number);
const spread = Number(opt('spread', '0.1'));
const rec = Object.fromEntries(opt('rec', '').split(',').filter(Boolean).map((p) => p.split('=')).map(([k, v]) => [k, Number(v)]));
const ids = opt('ids', '').split(',').filter(Boolean);
const context = opt('context', null);
const shapes = args;
if (!shapes.length) die('Name at least one shape, e.g. check check-2');

const man = JSON.parse(readFileSync('lab/manifest.json', 'utf8')).masters;

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
  const box = [i.ink.x + i.ink.w / 2 - i.shift[0], i.ink.y + i.ink.h / 2 - i.shift[1]];
  return [(S[0] + A[0] + E[0]) / 3 - i.shift[0] - box[0], (S[1] + A[1] + E[1]) / 3 - i.shift[1] - box[1]];
}
const r05 = (v) => Math.round(v * 20) / 20 || 0;

const used = new Set();
const candidates = [];
shapes.forEach((name, k) => {
  const at = (m, n) => man[m]?.icons[n] ?? die(`${n} is not in the ${m} master (run npm run build?)`);
  const base = at(24, name);
  const tag = base.tags?.[0] ?? name;
  let id = ids[k] ?? [...tag.toUpperCase()].find((ch) => /[A-Z]/.test(ch) && !used.has(ch)) ?? String(k + 1);
  used.add(id);
  const shipped = r2(base.shift[0] * dir[0] + base.shift[1] * dir[1]);   // along the chosen direction
  const tri = triangleOffset(base);
  const measured = tri && r05(-K * (tri[0] * dir[0] + tri[1] * dir[1]));
  if (!(name in rec) && measured != null) rec[name] = measured;
  const around = rec[name] ?? shipped;
  const rows = fixed ?? [-2, -1, 0, 1, 2].map((k) => r2(around + k * spread));
  const list = [...new Set([0, shipped, around, ...rows])].sort((a, b) => a - b);
  console.log(`${name.padEnd(16)} ${tri ? `triangle ${r2(tri[0])}, ${r2(tri[1])} → measured ${measured}` : 'no measure (not a single-bend mark)'}` +
    ` · recommended ${rec[name] ?? '—'} · shipped ${shipped} · rows ${list.join(' ')}`);
  for (const s of list) {
    const c = { id: `${id}${Math.round(s * 100)}`, label: `${name} · ${tag} · ${dirName} ${s}`, tags: base.tags ?? [],
      group: `${name} · ${tag}`, shift: s, shipped: s === shipped, recommended: rec[name] === s,
      optical: {}, masters: {}, filled: {} };
    const by = [];
    for (const m of MASTERS) {
      const o = at(m, name), f = at(m, `${name}-filled`);
      const amt = r2(s * o.ink.h / base.ink.h);   // signed: negative moves against --dir
      const [dx, dy] = [r2(dir[0] * amt), r2(dir[1] * amt)];
      by.push(amt);
      c.optical[m] = [dx, dy];
      c.masters[m] = o.paths.map((d) => move(d, dx - o.shift[0], dy - o.shift[1]));
      const back = (d) => move(d, dx - f.shift[0], dy - f.shift[1]);
      c.filled[m] = f.areas.length
        ? { fill: f.areas.map(back), stroke: f.paths.map(back) }
        : { weight: f.stroke, stroke: f.paths.map(back) };
    }
    c.by = by;
    c.note = `${by.join(' · ')} at 24 · 20 · 16` + (c.shipped ? ' · shipped' : '') + (c.recommended ? ' · recommended' : '');
    candidates.push(c);
  }
});

const concept = shapes[0];
const draft = {
  concept, keyline: 'mark', direction: dirName, ...(context ? { context } : {}),
  question: `Optical placement (C14): which row looks centred for each shape? Open /lab/optical-shift.html.`,
  candidates,
};
writeFileSync('lab/drafts/current.js',
  `// ${concept} — optical placement sheet, written by tools/optical-sheet.mjs. Each shape moves by the\n` +
  `// row's amount at its default 24; other masters scale by ink height. View: /lab/optical-shift.html\n` +
  `export default ${JSON.stringify(draft, null, 2)};\n`);
console.log(`${candidates.length} rows · ${shapes.length} shapes → lab/drafts/current.js · open /lab/optical-shift.html`);
