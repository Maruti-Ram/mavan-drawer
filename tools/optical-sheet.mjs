#!/usr/bin/env node
// Optical placement (C14) as a comparison sheet. Writes the board with every shape of a family
// at a range of shifts, then lab/optical-shift.html lays them out: one group per shape, one row
// per shift, in a menu row, inline text and icon buttons at 24 · 20 · 16.
//
//   node tools/optical-sheet.mjs <shape>… --dir up|down|left|right
//        [--shifts 0,0.25,0.5,0.75,1]      shifts at each shape's default 24, in units
//        [--rec <shape>=<n>,…]             the row to mark "recommended" per shape
//        [--ids <id>,…]                    one id letter per shape (default: its tag's initial)
//        [--context "Mark as done"]        the verb in the menu row and inline text
//
//   e.g. node tools/optical-sheet.mjs check check-2 check-3 check-4 --dir up --rec check=0.5,check-2=0.5
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
const shifts = opt('shifts', '0,0.25,0.5,0.75,1').split(',').map(Number);
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

const used = new Set();
const candidates = [];
shapes.forEach((name, k) => {
  const at = (m, n) => man[m]?.icons[n] ?? die(`${n} is not in the ${m} master (run npm run build?)`);
  const base = at(24, name);
  const tag = base.tags?.[0] ?? name;
  let id = ids[k] ?? [...tag.toUpperCase()].find((ch) => /[A-Z]/.test(ch) && !used.has(ch)) ?? String(k + 1);
  used.add(id);
  const shipped = r2(base.shift[0] * dir[0] + base.shift[1] * dir[1]);   // along the chosen direction
  const list = [...new Set([...shifts, ...(shipped ? [shipped] : []), ...(name in rec ? [rec[name]] : [])])].sort((a, b) => a - b);
  for (const s of list) {
    const c = { id: `${id}${Math.round(s * 100)}`, label: `${name} · ${tag} · ${dirName} ${s}`, tags: base.tags ?? [],
      group: `${name} · ${tag}`, shift: s, shipped: s === shipped, recommended: rec[name] === s,
      optical: {}, masters: {}, filled: {} };
    const by = [];
    for (const m of MASTERS) {
      const o = at(m, name), f = at(m, `${name}-filled`);
      const amt = r2(s * o.ink.h / base.ink.h);
      const [dx, dy] = [r2(dir[0] * amt), r2(dir[1] * amt)];
      by.push(amt);
      c.optical[m] = [dx, dy];
      c.masters[m] = o.paths.map((d) => move(d, dx - o.shift[0], dy - o.shift[1]));
      const back = (d) => move(d, dx - f.shift[0], dy - f.shift[1]);
      c.filled[m] = f.areas.length
        ? { fill: f.areas.map(back), stroke: f.paths.map(back) }
        : { weight: f.stroke, stroke: f.paths.map(back) };
    }
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
