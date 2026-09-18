#!/usr/bin/env node
// Mechanically enforces docs/01-foundations.md. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { numbersIn, samplePath, bbox, parsePath, isDot, selfGap } from './geometry.mjs';
import { GLYPH_GAP, MASTERS, MIN_GAP, STROKE as BASE_STROKE, SIZE_STEP, SIZES, markMax, sizeBase, sizeOf, weightOf } from './masters.mjs';

const MAX_DP = 2;
// Directional marks (chevron, caret, minus) are deliberately smaller than any
// silhouette keyline. A file opts in with `<!-- keyline: mark -->`; it then only
// has to stay inside the master's mark ceiling and stay centred. A `-large`
// mark may run to the margin edge (C8).
// Outline files stroke at 1.5; `-filled` files of line-heavy icons at the
// master's filled weight (masters.mjs). A shape-filled `-filled` file draws its
// areas as `<path fill="currentColor" fill-rule="evenodd" stroke="none" d…>`
// (the one path form allowed to carry paint) and keeps 1.5 for its lines.
const required = (canvas, weight) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: `0 0 ${canvas} ${canvas}`,
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': String(weight),
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
});
const AREA = /<path fill="currentColor" fill-rule="evenodd" stroke="none" d="([^"]+)"\/>/g;
const BANNED_EL = /<(g|rect|circle|ellipse|line|polyline|polygon|use|defs|style)\b/;
const BANNED_ATTR = /\s(transform|id|class|style|fill-rule|clip-path|opacity)=/;

const dp = (n) => { const s = String(n); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
const r2 = (n) => Math.round(n * 100) / 100;

// true when two sampled polylines properly intersect (sampling can miss the exact crossing point)
const side = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
const crosses = (a, b) => {
  for (let i = 1; i < a.length; i++) for (let j = 1; j < b.length; j++) {
    const [p, q, r, s] = [a[i - 1], a[i], b[j - 1], b[j]];
    if (side(p, q, r) * side(p, q, s) < 0 && side(r, s, p) * side(r, s, q) < 0) return true;
  }
  return false;
};

function lint(canvas, file) {
  const { bound: BOUND, keylines } = MASTERS[canvas];
  const MARK_MAX = markMax(file.replace('.svg', ''), canvas);
  const KEYLINES = Object.entries(keylines).map(([k, [w, h]]) => [k, w, h]);
  const src = readFileSync(join('src/icons', String(canvas), file), 'utf8');
  const isFilledFile = file.endsWith('-filled.svg');
  const areas = isFilledFile ? [...src.matchAll(AREA)].map((m) => m[1]) : [];
  const STROKE = areas.length ? BASE_STROKE : weightOf(file.replace('.svg', ''), canvas);
  const REQUIRED = required(canvas, STROKE);
  const mid = canvas / 2;
  const errors = [], warnings = [], notes = [];
  let size = null, inner = null, isMark = false;
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
  const stripped = body.replace(/<!--[\s\S]*?-->/g, '').replace(AREA, '');
  if (BANNED_EL.test(stripped)) errors.push(`uses ${stripped.match(BANNED_EL)[1]} — normalise to <path>`);
  if (BANNED_ATTR.test(stripped)) errors.push(`uses disallowed attribute ${stripped.match(BANNED_ATTR)[1]}`);
  if (/<path[^>]*\sstroke/.test(stripped)) errors.push('stroke attribute on a <path> — belongs on the root');

  const ds = [...stripped.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  if (!ds.length && !areas.length) errors.push('no <path> found');

  // --- 3. precision + grid ------------------------------------------------
  // The grid is quarter units: a 1.5 stroke centred on x.25/x.75 has integer
  // edges. Anything off the quarter grid needs a comment saying why.
  const offGrid = [];
  for (const d of [...ds, ...areas]) for (const n of numbersIn(d)) {
    if (dp(n) > MAX_DP) errors.push(`${n} exceeds ${MAX_DP} decimal places`);
    else if (!Number.isInteger(n * 4)) offGrid.push(n);
  }
  if (offGrid.length) {
    const msg = `${offGrid.length} off-quarter-grid value(s): ${[...new Set(offGrid)].join(', ')}`;
    hasComment ? notes.push(`${msg} — documented exception`) : warnings.push(`${msg} — undocumented (§3 requires a comment)`);
  }

  // --- 4. trim, keyline, centring ----------------------------------------
  if (ds.length || areas.length) {
    // A line grows its centreline box by half a stroke; a filled area is its own box.
    const half = STROKE / 2, boxes = [];
    if (ds.length) { const b = bbox(ds); boxes.push([b.x0 - half, b.y0 - half, b.x1 + half, b.y1 + half]); }
    if (areas.length) { const b = bbox(areas); boxes.push([b.x0, b.y0, b.x1, b.y1]); }
    const o = { x0: r2(Math.min(...boxes.map((b) => b[0]))), y0: r2(Math.min(...boxes.map((b) => b[1]))),
      x1: r2(Math.max(...boxes.map((b) => b[2]))), y1: r2(Math.max(...boxes.map((b) => b[3]))) };
    if (o.x0 < BOUND[0] || o.y0 < BOUND[0] || o.x1 > BOUND[1] || o.y1 > BOUND[1])
      errors.push(`crosses the margin: outer box ${o.x0},${o.y0} → ${o.x1},${o.y1} (drawing bound is ${BOUND[0]}..${BOUND[1]})`);

    const w = r2(o.x1 - o.x0), h = r2(o.y1 - o.y0);
    size = Math.max(w, h);
    // An optical shift (C14) is a declared, intended offset from the box centre: check against it.
    const [sx, sy] = (src.match(/<!--\s*optical:\s*([-\d.]+)\s+([-\d.]+)\s*-->/)?.slice(1) ?? [0, 0]).map(Number);
    const cx = r2((o.x0 + o.x1) / 2 - sx), cy = r2((o.y0 + o.y1) / 2 - sy);
    if (sx || sy) notes.push(`optical shift ${sx}, ${sy}`);
    const declared = src.match(/<!--\s*keyline:\s*(\w+)\s*-->/)?.[1];
    isMark = declared === 'mark';
    // A container's first path is the container; the rest is its inner mark (measured on the outline file).
    if (!isMark && !areas.length && ds.length > 1) {
      const b = bbox(ds.slice(1));
      inner = r2(Math.max(b.x1 - b.x0, b.y1 - b.y0) + STROKE);
    }
    if (isMark) {
      notes.push(`${w}×${h}  declared mark  centre ${cx},${cy}`);
      if (w > MARK_MAX || h > MARK_MAX) warnings.push(`mark is ${w}×${h} — exceeds ${MARK_MAX}×${MARK_MAX} (§2)`);
    } else {
      const key = KEYLINES.find(([, kw, kh]) => Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5);
      notes.push(`${w}×${h}  ${key ? `fits ${key[0]} keyline` : 'no keyline match'}  centre ${cx},${cy}`);
      if (!key) warnings.push(`${w}×${h} matches no keyline (§2) — if this is a directional mark, declare <!-- keyline: mark -->`);
    }
    if (Math.abs(cx - mid) > 0.5 || Math.abs(cy - mid) > 0.5) warnings.push(`off-centre at ${cx},${cy}`);
  }

  // --- 4b. advisory: bends tighter than half the stroke (C10) --------------
  // Below R = weight / 2 the inner corner stays a notch and the corner reads heavier.
  // A dot (one CLOSED circle drawn as two arcs) is not a bend: under half the stroke it is a
  // solid disc. `isDot` lives in geometry.mjs so lint, build and the lab share one test — an
  // open two-arc path is a bend (a bowl running into a tuck), checked like any other, and in a
  // glyph mark it is the body, not the dot (C19).
  for (const d of ds) if (!isDot(d)) for (const { cmd, args } of parsePath(d)) {
    if (cmd.toUpperCase() !== 'A') continue;
    for (let k = 0; k + 7 <= args.length; k += 7)
      if (Math.min(args[k], args[k + 1]) < STROKE / 2 - 0.005)
        warnings.push(`bend radius ${args[k]} is under half the stroke (${STROKE / 2}) — the corner reads uneven (C10)`);
  }

  // --- 5. advisory: near-collisions between separate paths ---------------
  // §6 asks one stroke width between any two stroke edges. C19 carves out one case:
  // in a file that declares `<!-- glyph: dot -->`, the pair {dot, body} is the inside
  // of one character and floors at GLYPH_GAP instead. The dot's clearance to the
  // silhouette (the path spanning the whole ink box) is not that pair, and keeps MIN_GAP.
  const sampled = ds.map(samplePath);
  const isGlyph = /<!--\s*glyph:\s*dot\s*-->/.test(src);
  const spans = ds.map((d) => bbox([d]));
  const whole = ds.length ? bbox(ds) : null;
  const isShell = (b) => whole && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(b[k] - whole[k]) < 0.01);
  for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
    if (crosses(sampled[i], sampled[j])) continue; // paths that cross (x, plus) join by design
    const glyphPair = isGlyph && isDot(ds[i]) !== isDot(ds[j]) && !isShell(spans[i]) && !isShell(spans[j]);
    const floor = glyphPair ? GLYPH_GAP : MIN_GAP;
    const need = floor + STROKE; // centreline distance for a one-stroke edge gap
    let min = Infinity;
    for (const [ax, ay] of sampled[i]) for (const [bx, by] of sampled[j])
      min = Math.min(min, Math.hypot(ax - bx, ay - by));
    if (min > 0.1 && min < need - 0.01)
      warnings.push(`paths ${i + 1}/${j + 1} are ${r2(min)} apart — ${glyphPair ? 'C19 glyph gap' : '§6'} needs ${need} (edge gap ${r2(min - STROKE)} < ${floor})`);
  }

  // --- 5b. advisory: a path coming too close to ITSELF ---------------------
  // §6's corollary "no enclosed shape smaller than 1.5 units across" has never been
  // in code, and the pair loop above cannot see it: both ends of one stroke, and a
  // counter drawn by one curling path, belong to a single `d`. `selfGap` judges a
  // pair of points only once the path between them has turned past 180 degrees, so a
  // C10 bend — which legitimately brings its own tangent points 1.06 apart — is never
  // flagged, while a mouth that has closed up is. A dot is a solid disc by design.
  // Caught by eye and not by lint before this existed: help-4's 16 shipped a 0.30 mouth.
  for (let i = 0; i < ds.length; i++) {
    if (isDot(ds[i])) continue;
    const self = selfGap(ds[i], STROKE);
    if (self && self.gap < MIN_GAP - 0.01)
      warnings.push(`path ${i + 1} comes within ${self.gap} of itself at ${self.at.join(',')} — §6 needs ${MIN_GAP} (it turns ${self.span}°)`);
  }

  return { file, errors, warnings, notes, size, inner, isMark };
}

const jobs = Object.keys(MASTERS).map(Number).sort((a, b) => b - a).flatMap((m) => {
  const dir = join('src/icons', String(m));
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => [m, f]) : [];
});
let bad = 0, warned = 0;
const G = '\x1b[32m', Y = '\x1b[33m', R = '\x1b[31m', D = '\x1b[2m', X = '\x1b[0m';

const results = new Map(jobs.map(([m, f]) => [`${m}/${f}`, lint(m, f)]));

// --- 6. size families (C8): a mark's large and small sit one SIZE_STEP from the default;
// a container's keep the container and change only the inner mark (outline file measures it)
for (const [key, r] of results) {
  const [m, f] = key.split('/'), name = f.replace('.svg', '');
  const size = sizeOf(name);
  if (!size || r.size == null) continue;
  const baseName = sizeBase(name);
  const base = results.get(`${m}/${baseName}.svg`);
  if (!base) { r.warnings.push(`${size} variant has no default \`${baseName}\` at ${m}`); continue; }
  if (!r.isMark && !base.isMark) {
    if (Math.abs(r.size - base.size) > 0.01)
      r.warnings.push(`${size} container is ${r.size} — C8 keeps the default's ${base.size}; only the inner mark changes`);
    const ob = results.get(`${m}/${baseName.replace(/-filled$/, '')}.svg`), ov = results.get(`${m}/${name.replace(/-filled$/, '')}.svg`);
    if (ob?.inner != null && ov?.inner != null && (size === 'small' ? ov.inner >= ob.inner : ov.inner <= ob.inner))
      r.warnings.push(`${size} inner mark is ${ov.inner} — must be ${size === 'small' ? 'smaller' : 'larger'} than the default's ${ob.inner} (C8)`);
    continue;
  }
  const want = base.size + (SIZES.indexOf(size) - 1) * SIZE_STEP[m];
  if (Math.abs(r.size - want) > 0.01)
    r.warnings.push(`${size} is ${r.size} — C8 wants ${want} (default ${base.size} ${size === 'large' ? '+' : '−'} ${SIZE_STEP[m]})`);
}

for (const [m, f] of jobs) {
  const { errors, warnings, notes } = results.get(`${m}/${f}`);
  const mark = errors.length ? `${R}✗${X}` : warnings.length ? `${Y}!${X}` : `${G}✓${X}`;
  console.log(`${mark} ${String(m).padStart(2)} ${f.replace('.svg', '').padEnd(16)} ${D}${notes[notes.length - 1] ?? ''}${X}`);
  notes.slice(0, -1).forEach((n) => console.log(`    ${D}· ${n}${X}`));
  warnings.forEach((w) => console.log(`    ${Y}warn  ${w}${X}`));
  errors.forEach((e) => console.log(`    ${R}error ${e}${X}`));
  if (errors.length) bad++; else if (warnings.length) warned++;
}

console.log(`\n${jobs.length} drawings · ${G}${jobs.length - bad - warned} clean${X} · ${Y}${warned} warned${X} · ${R}${bad} failed${X}`);
process.exit(bad ? 1 : 0);
