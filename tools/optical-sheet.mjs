#!/usr/bin/env node
// Optical placement (C14, C15) as a comparison sheet. A mark must read optically balanced in its
// square canvas (24 · 20 · 16) against all four edges at once — top, bottom, left and right. Each
// shape is judged on the axes it is lopsided on (both together when it is lopsided both ways).
// This writes the board with every shape at the positions around its recommendation; lab/optical-shift.html lays them out: one group per shape,
// one row per position, the mark in its canvas outline at each master, then in a menu row, inline
// text and icon buttons.
//
//   node tools/optical-sheet.mjs <shape>…
//        [--rec <shape>=<x>:<y>,…]         recommended position (default: measured, below)
//        [--axes x|y|xy]                   force the judged axes (default: the lopsided ones)
//        [--xs …] [--ys …]                 offsets around the recommendation on each axis
//                                          (default ±0.1 ±0.2 when one axis is judged, ±0.1 for both)
//        [--rows <shape>=<name>:<x>:<y>|…;…]
//                                          named rows instead of the grid (plus centred and shipped),
//                                          e.g. --rows "check=line weight:0:-0.94|triangle:0:-0.22"
//        [--ids <id>,…]                    one id per shape (default: its tag's initial)
//        [--context "Mark as done"]        the verb in the menu row and inline text
//        [--hold <n>]                      container icons (C18): the first n outline paths and the
//                                          first n subpaths of the fill stay put; only the mark moves,
//                                          and positions scale by the mark's ink, not the container's
//        [--draft <file>]                  read shapes not yet shipped from a board-format file
//                                          (candidate label "<name> · <tag>", optical = the drafted
//                                          position); their recommendation is always measured
//
//   e.g. node tools/optical-sheet.mjs check check-small check-2 check-2-small --ids C,Cs,W,Ws
//
// Which axes: only the ones the mark is lopsided on. A mark that mirrors onto itself across its
// vertical centre line (chevron-down) is balanced left–right by construction and is judged only
// up–down; one that mirrors top–bottom (play) is judged only left–right; one that mirrors both
// ways (plus, x) needs no sheet; a check mirrors neither way and is judged on both, together.
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
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { decimalsOf, sizeBase, strokeOf } from './masters.mjs';
import { samplePath, bbox } from './geometry.mjs';

const MASTERS = [24, 20, 16];
const K = 0.5;
const r2 = (v) => Math.round(v * 100) / 100 || 0;
const r05 = (v) => Math.round(v * 20) / 20 || 0;
const r3 = (v) => Math.round(v * 1000) / 1000 || 0;
const die = (msg) => { console.error(msg); process.exit(1); };

// Move an SVG path by (dx, dy). Absolute commands move every coordinate; relative ones only
// need their opening `m` moved. Kept to 3 dp (2026-10-21): 2 dp rounded the 16 master's eighths
// (x.375 → x.38) and bent its construction even at a zero shift.
export function move(d, dx, dy) {
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
    return c + n.map(r3).join(' ');
  });
}

// A shift at one master, rounded to that master's precision — the decimals lint holds its coordinates
// to (2 dp at 24 and 20, 3 at 16, masters.mjs) — so a moved drawing stays within its master's grid of
// decimals: 2 dp would round a 16 shift that the eighth-grid drawing can carry exactly.
export const snapShift = (v, m) => { const k = 10 ** decimalsOf(m); return Math.round(v * k) / k || 0; };

// The per-icon notes a board candidate carries (tools/draft-svg.mjs reads them): what lint holds a
// drawing to beyond the set's rules. Until 2026-10-21 the sheet dropped them, so an icon with an agreed
// gap or box linted differently on the sheet than on its own board. `keyline`, `anchor` and `base` are
// the sheet's own business: it moves the ink, which an anchored member or a composite's base may not.
const NOTE_KEYS = ['glyph', 'badge', 'box', 'grows', 'gap'];
export const draftNotes = (draft, c) => Object.fromEntries(NOTE_KEYS
  .map((k) => [k, c[k] ?? draft[k] ?? null]).filter(([, v]) => v != null));

// The same notes read off a shipped icon's six files: { [master]: { outline: src, filled: src } }.
export function fileNotes(files) {
  const out = {}, put = (k, m, v) => { (out[k] ??= {})[m] = v; };
  const note = (src, k) => src.match(new RegExp(`<!--\\s*${k}:\\s*([^>]*?)\\s*-->`))?.[1] ?? null;
  const gap = { outline: {}, filled: {} };
  for (const [m, { outline = '', filled = '' }] of Object.entries(files)) {
    out.glyph ??= note(outline, 'glyph') ?? note(filled, 'glyph') ?? undefined;
    out.badge ??= note(filled, 'badge') ?? undefined;
    const box = note(outline, 'box')?.match(/^([\d.]+)\s*[x×]\s*([\d.]+)$/);
    if (box) put('box', m, [+box[1], +box[2]]);
    const grows = note(filled, 'grows');
    if (grows) put('grows', m, grows.split(/\s+/).map(Number));
    for (const [style, src] of [['outline', outline], ['filled', filled]]) { const g = note(src, 'gap'); if (g) gap[style][m] = +g; }
  }
  if (Object.keys(gap.outline).length || Object.keys(gap.filled).length)
    out.gap = Object.fromEntries(Object.entries(gap).filter(([, v]) => Object.keys(v).length));
  for (const k of Object.keys(out)) if (out[k] == null) delete out[k];
  return Object.fromEntries(NOTE_KEYS.filter((k) => k in out).map((k) => [k, out[k]]));
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) await main();

async function main() {
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args.splice(i, 2)[1]; };
if (args.includes('--dir')) die('--dir is retired: the judged axes come from the shape\'s symmetry (C15). Use --axes, --rec x:y, --xs, --ys.');
const list = (s) => s.split(',').map(Number);
const xsOpt = opt('xs', null), ysOpt = opt('ys', null);
const forced = opt('axes', null);
const rec = Object.fromEntries(opt('rec', '').split(',').filter(Boolean)
  .map((p) => p.split('=')).map(([k, v]) => [k, v.split(':').map(Number)]));
const named = Object.fromEntries((opt('rows', '') || '').split(';').filter(Boolean).map((p) => {
  const [shape, rest] = p.split('=');
  return [shape.trim(), rest.split('|').map((r) => { const [n, x, y] = r.split(':'); return { name: n.trim(), pos: [Number(x), Number(y)] }; })];
}));
const ids = opt('ids', '').split(',').filter(Boolean);
const context = opt('context', null);
const hold = Number(opt('hold', 0));
const shapes = args;
if (!shapes.length) die('Name at least one shape, e.g. check check-2');

const man = JSON.parse(readFileSync('lab/manifest.json', 'utf8')).masters;

// --draft: shapes that are drawn but not shipped (a family turned or mirrored from a shipped one).
// Each is measured the way build.mjs measures a file, so the sheet treats it like a shipped icon.
const draftFile = opt('draft', null);
const drafted = {}, draftSaid = {}, draftNoted = {};
if (draftFile) {
  const measure = (paths, areas, stroke, shift, tags) => {
    const boxes = [];
    if (paths.length) { const b = bbox(paths); boxes.push([b.x0 - stroke / 2, b.y0 - stroke / 2, b.x1 + stroke / 2, b.y1 + stroke / 2]); }
    if (areas.length) { const b = bbox(areas); boxes.push([b.x0, b.y0, b.x1, b.y1]); }
    const [x0, y0, x1, y1] = [0, 1, 2, 3].map((i) => (i < 2 ? Math.min : Math.max)(...boxes.map((b) => b[i])));
    return { paths, areas, stroke, shift, tags, ink: { x: r2(x0), y: r2(y0), w: r2(x1 - x0), h: r2(y1 - y0) } };
  };
  const board = (await import(pathToFileURL(resolve(draftFile)).href)).default;
  for (const c of board.candidates) {
    const name = c.label.split(' · ')[0];
    draftSaid[name] = [c.label, c.note].filter(Boolean).join(': ');
    draftNoted[name] = draftNotes(board, c);
    for (const m of MASTERS) {
      const shift = c.optical?.[m] ?? [0, 0], f = c.filled[m];
      (drafted[m] ??= {})[name] = measure(c.masters[m], [], strokeOf(m), shift, c.tags ?? []);
      // a C32 numeral or letter and a C33 line badge keep the outline weight: carried, not measured
      // into the filled ink (the outline twin holds the same box)
      drafted[m][`${name}-filled`] = { ...measure(f.stroke ?? [], f.fill ?? [], f.weight ?? strokeOf(m), shift, c.tags ?? []),
        glyphs: f.glyph ?? [], badges: f.badge ?? [] };
    }
  }
}
// The mark's own ink (the container held still is left out), stroked at the
// weight the file itself declares — its master's, whatever that master is.
const markInk = (i) => {
  if (!hold) return i.ink;
  const b = bbox(i.paths.slice(hold)), h = i.stroke / 2;
  return { x: b.x0 - h, y: b.y0 - h, w: b.x1 - b.x0 + i.stroke, h: b.y1 - b.y0 + i.stroke };
};
const at = (m, n) => drafted[m]?.[n] ?? man[m]?.icons[n] ?? die(`${n} is not in the ${m} master (run npm run build?)`);
// The notes the sheet's rows carry: a draft's own, else the shipped files' (2026-10-21).
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const notesOf = (n) => draftNoted[n] ?? fileNotes(Object.fromEntries(MASTERS.map((m) =>
  [m, { outline: read(`src/icons/${m}/${n}.svg`), filled: read(`src/icons/${m}/${n}-filled.svg`) }])));

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

// Does the drawing mirror onto itself across its ink box's vertical / horizontal centre line?
function mirrors(i) {
  const pts = [...i.paths, ...i.areas].flatMap((d) => samplePath(d));
  const [cx, cy] = [i.ink.x + i.ink.w / 2, i.ink.y + i.ink.h / 2];
  const has = (x, y) => pts.some((q) => Math.hypot(q[0] - x, q[1] - y) < 0.2);
  return [pts.every(([x, y]) => has(2 * cx - x, y)), pts.every(([x, y]) => has(x, 2 * cy - y))];
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
  const said = draftSaid[name] ?? [...readFileSync(`src/icons/24/${name}.svg`, 'utf8').matchAll(/<!--\s*(.*?)\s*-->/g)]
    .map((x) => x[1]).filter((x) => !/^(keyline|tags|optical):/.test(x)).pop() ?? `${name} · ${tag}`;
  const own = said.split(': ')[0];
  const detail = said.split(': ').slice(1).join(': ').replace(/ · optical .*\(C1[45]\)/, '');
  const id = ids[k] ?? [...tag.toUpperCase()].find((ch) => /[A-Z]/.test(ch) && !used.has(ch)) ?? String(k + 1);
  used.add(id);

  // Everything in family-default units: x by width, y by height.
  const [bInk, rInk] = [markInk(base), markInk(ref)];
  const unit = [bInk.w / rInk.w, bInk.h / rInk.h];
  const shipped = base.shift.map((v, a) => r2(v / unit[a]));
  const sym = mirrors(ref);
  const judged = forced ? ['x', 'y'].map((a) => forced.includes(a)) : sym.map((m) => !m);
  if (!judged[0] && !judged[1]) {
    console.log(`${name.padEnd(16)} mirrors both ways: balanced by construction, no sheet (use --axes to force)`);
    return;
  }
  const one = judged[0] !== judged[1];
  const offs = [xsOpt, ysOpt].map((o, a) => (!judged[a] ? [0] : o ? list(o) : one ? [-0.2, -0.1, 0, 0.1, 0.2] : [-0.1, 0, 0.1]));
  const tri = triangleOffset(ref);
  const measured = tri && tri.map((v) => r05(-K * v));
  const fam = rec[sizeBase(name)];
  const refShift = drafted[24]?.[sizeBase(name)] ? [0, 0] : ref.shift;   // the default's placed axes (a draft's are only drafted)
  const want = (rec[name] ?? fam ?? [0, 1].map((a) => (refShift[a] ? r2(refShift[a]) : measured?.[a] ?? 0)))
    .map((v, a) => (judged[a] ? v : r2(shipped[a])));                 // an unjudged axis stays as shipped
  // Size variants store 2 dp at their own scale, so their shipped value reads back ±0.01 off.
  const same = (p, q) => p.every((v, a) => Math.abs(v - q[a]) < 0.015);
  const ship = same(shipped, want) ? want : shipped;

  const seen = new Set();
  const centre = [0, 1].map((a) => (judged[a] ? 0 : ship[a]));   // box centre on the judged axes only
  const names = new Map([[centre.join(), 'centred'], ...(named[name] ?? []).map((r) => [r.pos.map(r2).join(), r.name])]);
  const positions = (named[name] ? [centre, ship, ...named[name].map((r) => r.pos.map(r2))] : [centre, ship, ...offs[0].flatMap((dx) => offs[1].map((dy) => [r2(want[0] + dx), r2(want[1] + dy)]))])
    .filter((p) => { const key = p.join(); return !seen.has(key) && seen.add(key); })
    .filter((p) => named[name] || p.every((v, a) => judged[a] || v === ship[a] || v === 0));
  if (!named[name]) positions.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
  const why = (a) => (forced ? `${a === 0 ? 'up–down' : 'left–right'} locked` : `mirrors ${a === 0 ? 'top–bottom' : 'left–right'}`);
  const axesSaid = judged[0] && judged[1] ? 'both axes' : judged[0] ? `left–right only (${why(0)})` : `up–down only (${why(1)})`;
  console.log(`${name.padEnd(16)} ${axesSaid} · ${tri ? `triangle ${tri.map(r2).join(', ')} → measured ${measured.join(', ')}` : 'no measure'}` +
    ` · recommended ${want.join(', ')} · shipped ${ship.join(', ')} · ${positions.length} rows`);

  for (const pos of positions) {
    const c = { id: `${id}${code(pos[0], 'r', 'l')}${code(pos[1], 'd', 'u')}` || id, label: own, tags: base.tags ?? [],
      group: `${name} · ${tag}`, axes: axesSaid, pos, name: names.get(pos.join()), shipped: same(pos, ship), recommended: same(pos, want),
      ...notesOf(name), optical: {}, masters: {}, filled: {} };
    if (c.id === id) c.id = `${id}0`;
    const by = [];
    for (const m of MASTERS) {
      const o = at(m, name), f = at(m, `${name}-filled`);
      const oInk = markInk(o);
      const [dx, dy] = [snapShift(pos[0] * oInk.w / rInk.w, m), snapShift(pos[1] * oInk.h / rInk.h, m)];
      by.push(arrow([dx, dy]));
      c.optical[m] = [dx, dy];
      c.masters[m] = o.paths.map((d, j) => (j < hold ? d : move(d, dx - o.shift[0], dy - o.shift[1])));
      const back = (d) => move(d, dx - f.shift[0], dy - f.shift[1]);
      const backArea = (d, j) => (j || !hold ? back(d)                   // the container's subpaths stay, its holes move
        : d.match(/M[^M]*/g).map((sub, k) => (k < hold ? sub : back(sub))).join(''));
      c.filled[m] = f.areas.length
        ? { fill: f.areas.map(backArea), stroke: f.paths.map(back) }
        : { weight: f.stroke, stroke: f.paths.map(back) };
      if (f.glyphs?.length) c.filled[m].glyph = f.glyphs.map(back);   // C32: a draft's numeral or letter
      if (f.badges?.length) c.filled[m].badge = f.badges.map(back);   // C33: a draft's line badge
    }
    if (!c.optical[24][0] && !c.optical[24][1]) delete c.optical;   // centred: no optical comment
    c.at = arrow(pos);
    c.by = by;
    c.note = [detail, pos[0] || pos[1] ? `optical ${by.join(' / ')} at 24 / 20 / 16 (C14, C15)` : ''].filter(Boolean).join(' · ');
    candidates.push(c);
  }
});

// A mark keyline on the board would clash with a row's agreed box (lint: pick one), so where any row
// carries a box, the mark keyline goes on each row without one instead.
const boxed = candidates.some((c) => c.box);
if (boxed && !hold) for (const c of candidates) if (!c.box) c.keyline = 'mark';
const family = (n) => sizeBase(n).replace(/-\d+$/, '');
const concept = family(shapes[0]);
const concepts = [...new Set(shapes.map(family))];
writeFileSync('lab/drafts/current.js',
  `// ${concept} — optical placement sheet, written by tools/optical-sheet.mjs. Each row is an (x, y)\n` +
  `// position in family-default units at 24; judge the balance in the canvas against all four edges.\n` +
  `export default ${JSON.stringify({
    concept, ...(concepts.length > 1 ? { concepts } : {}), ...(draftFile ? { drafted: true } : {}), ...(hold || boxed ? {} : { keyline: 'mark' }),   // a held container is the silhouette, not a mark
    ...(context ? { context } : {}),
    question: 'Optical placement (C15): which position reads balanced in the canvas — top, bottom, left and right — for each shape? Open /lab/optical-shift.html.',
    candidates,
  }, null, 2)};\n`);
console.log(`${candidates.length} rows · ${shapes.length} shapes → lab/drafts/current.js · open /lab/optical-shift.html`);
}
