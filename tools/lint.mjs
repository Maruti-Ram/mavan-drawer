#!/usr/bin/env node
// Mechanically enforces docs/01-foundations.md. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { numbersIn, samplePath, bbox } from './geometry.mjs';
import { MASTERS, MIN_GAP, weightOf } from './masters.mjs';

const MAX_DP = 2;
// Directional marks (chevron, caret, minus) are deliberately smaller than any
// silhouette keyline. A file opts in with `<!-- keyline: mark -->`; it then only
// has to stay inside the master's mark ceiling and stay centred.
// Outline files stroke at 1.5; `-filled` files of line-heavy icons at the
// master's filled weight (masters.mjs). Shape-filled icons are not lintable yet.
const required = (canvas, weight) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: `0 0 ${canvas} ${canvas}`,
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': String(weight),
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
});
const BANNED_EL = /<(g|rect|circle|ellipse|line|polyline|polygon|use|defs|style)\b/;
const BANNED_ATTR = /\s(transform|id|class|style|fill-rule|clip-path|opacity)=/;

const dp = (n) => { const s = String(n); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
const r2 = (n) => Math.round(n * 100) / 100;

function lint(canvas, file) {
  const { bound: BOUND, keylines, mark: MARK_MAX } = MASTERS[canvas];
  const KEYLINES = Object.entries(keylines).map(([k, [w, h]]) => [k, w, h]);
  const STROKE = weightOf(file.replace('.svg', ''), canvas);
  const REQUIRED = required(canvas, STROKE);
  const mid = canvas / 2;
  const src = readFileSync(join('src/icons', String(canvas), file), 'utf8');
  const errors = [], warnings = [], notes = [];
  const hasComment = /<!--/.test(src);

  // --- 1. root attributes -------------------------------------------------
  const root = src.match(/<svg\b([^>]*)>/);
  if (!root) return { file, errors: ['no <svg> root'], warnings, notes };
  const attrs = Object.fromEntries([...root[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  for (const [k, v] of Object.entries(REQUIRED)) {
    if (attrs[k] === undefined) errors.push(`root missing ${k}="${v}"`);
    else if (attrs[k] !== v) errors.push(`root ${k}="${attrs[k]}" — must be "${v}"`);
  }
  for (const k of Object.keys(attrs)) {
    if (!(k in REQUIRED)) errors.push(`root has disallowed attribute ${k}="${attrs[k]}"`);
  }

  // --- 2. body: paths only, no decoration --------------------------------
  const body = src.slice(root.index + root[0].length).replace(/<\/svg>\s*$/, '');
  const stripped = body.replace(/<!--[\s\S]*?-->/g, '');
  if (BANNED_EL.test(stripped)) errors.push(`uses ${stripped.match(BANNED_EL)[1]} — normalise to <path>`);
  if (BANNED_ATTR.test(stripped)) errors.push(`uses disallowed attribute ${stripped.match(BANNED_ATTR)[1]}`);
  if (/<path[^>]*\sstroke/.test(stripped)) errors.push('stroke attribute on a <path> — belongs on the root');

  const ds = [...stripped.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  if (!ds.length) errors.push('no <path> found');

  // --- 3. precision + grid ------------------------------------------------
  // The grid is quarter units: a 1.5 stroke centred on x.25/x.75 has integer
  // edges. Anything off the quarter grid needs a comment saying why.
  const offGrid = [];
  for (const d of ds) for (const n of numbersIn(d)) {
    if (dp(n) > MAX_DP) errors.push(`${n} exceeds ${MAX_DP} decimal places`);
    else if (!Number.isInteger(n * 4)) offGrid.push(n);
  }
  if (offGrid.length) {
    const msg = `${offGrid.length} off-quarter-grid value(s): ${[...new Set(offGrid)].join(', ')}`;
    hasComment ? notes.push(`${msg} — documented exception`) : warnings.push(`${msg} — undocumented (§3 requires a comment)`);
  }

  // --- 4. trim, keyline, centring ----------------------------------------
  if (ds.length) {
    const b = bbox(ds), half = STROKE / 2;
    const o = { x0: r2(b.x0 - half), y0: r2(b.y0 - half), x1: r2(b.x1 + half), y1: r2(b.y1 + half) };
    if (o.x0 < BOUND[0] || o.y0 < BOUND[0] || o.x1 > BOUND[1] || o.y1 > BOUND[1])
      errors.push(`crosses the margin: outer box ${o.x0},${o.y0} → ${o.x1},${o.y1} (drawing bound is ${BOUND[0]}..${BOUND[1]})`);

    const w = r2(o.x1 - o.x0), h = r2(o.y1 - o.y0);
    const cx = r2((o.x0 + o.x1) / 2), cy = r2((o.y0 + o.y1) / 2);
    const declared = src.match(/<!--\s*keyline:\s*(\w+)\s*-->/)?.[1];
    if (declared === 'mark') {
      notes.push(`${w}×${h}  declared mark  centre ${cx},${cy}`);
      if (w > MARK_MAX || h > MARK_MAX) warnings.push(`mark is ${w}×${h} — exceeds ${MARK_MAX}×${MARK_MAX} (§2)`);
    } else {
      const key = KEYLINES.find(([, kw, kh]) => Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5);
      notes.push(`${w}×${h}  ${key ? `fits ${key[0]} keyline` : 'no keyline match'}  centre ${cx},${cy}`);
      if (!key) warnings.push(`${w}×${h} matches no keyline (§2) — if this is a directional mark, declare <!-- keyline: mark -->`);
    }
    if (Math.abs(cx - mid) > 0.5 || Math.abs(cy - mid) > 0.5) warnings.push(`off-centre at ${cx},${cy}`);
  }

  // --- 5. advisory: near-collisions between separate paths ---------------
  const sampled = ds.map(samplePath);
  const need = MIN_GAP + STROKE; // centreline distance for a one-stroke edge gap
  for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
    let min = Infinity;
    for (const [ax, ay] of sampled[i]) for (const [bx, by] of sampled[j])
      min = Math.min(min, Math.hypot(ax - bx, ay - by));
    if (min > 0.1 && min < need - 0.01)
      warnings.push(`paths ${i + 1}/${j + 1} are ${r2(min)} apart — §6 needs ${need} (edge gap ${r2(min - STROKE)} < ${MIN_GAP})`);
  }

  return { file, errors, warnings, notes };
}

const jobs = Object.keys(MASTERS).map(Number).sort((a, b) => b - a).flatMap((m) => {
  const dir = join('src/icons', String(m));
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => [m, f]) : [];
});
let bad = 0, warned = 0;
const G = '\x1b[32m', Y = '\x1b[33m', R = '\x1b[31m', D = '\x1b[2m', X = '\x1b[0m';

for (const [m, f] of jobs) {
  const { errors, warnings, notes } = lint(m, f);
  const mark = errors.length ? `${R}✗${X}` : warnings.length ? `${Y}!${X}` : `${G}✓${X}`;
  console.log(`${mark} ${String(m).padStart(2)} ${f.replace('.svg', '').padEnd(16)} ${D}${notes[notes.length - 1] ?? ''}${X}`);
  notes.slice(0, -1).forEach((n) => console.log(`    ${D}· ${n}${X}`));
  warnings.forEach((w) => console.log(`    ${Y}warn  ${w}${X}`));
  errors.forEach((e) => console.log(`    ${R}error ${e}${X}`));
  if (errors.length) bad++; else if (warnings.length) warned++;
}

console.log(`\n${jobs.length} drawings · ${G}${jobs.length - bad - warned} clean${X} · ${Y}${warned} warned${X} · ${R}${bad} failed${X}`);
process.exit(bad ? 1 : 0);
