#!/usr/bin/env node
// Mechanically enforces docs/01-foundations.md. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { numbersIn, samplePath, bbox, parsePath, isDot, selfGap } from './geometry.mjs';
import { GLYPH_GAP, MASTERS, MIN_GAP, SIZE_STEP, SIZES, bendMin, decimalsOf, gridName, gridOf, markMax, sizeBase, sizeOf, strokeOf, weightOf } from './masters.mjs';

// Smallest distance from any sample of `a` to the polyline through `b`'s samples.
function polyGap(a, b) {
  let min = Infinity;
  for (const [px, py] of a) for (let k = 0; k < b.length; k++) {
    const [x1, y1] = b[k], [x2, y2] = b[k + 1] ?? b[k];
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    // samples sit STEP apart along a path; a longer hop is a jump between subpaths, not ink
    const t = L && L < 0.3 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
    min = Math.min(min, Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)));
  }
  return min;
}

// Directional marks (chevron, caret, minus) are deliberately smaller than any
// silhouette keyline. A file opts in with `<!-- keyline: mark -->`; it then only
// has to stay inside the master's mark ceiling and stay centred. A `-large`
// mark may run to the margin edge (C8).
// Outline files stroke at their master's weight (`strokeOf`); `-filled` files of
// line-heavy icons at the master's filled weight (masters.mjs). A shape-filled
// `-filled` file draws its areas as `<path fill="currentColor" fill-rule="evenodd"
// stroke="none" d…>` (the one path form allowed to carry paint) and keeps the
// master's outline stroke for whatever lines are left.
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
  // The weight this file's strokes are drawn at, per master and per style. A
  // shape-filled file paints its areas and keeps the master's outline stroke for
  // the lines it has left, so it is the presence of areas that decides, not the name.
  const STROKE = areas.length ? strokeOf(canvas) : weightOf(file.replace('.svg', ''), canvas);
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
  // The grid follows the master's stroke (masters.mjs): a 1.5 stroke centred on
  // x.25/x.75 has integer edges, so 24 and 20 work in quarter units with 2
  // decimals; a 1.25 stroke needs x.375/x.625, so that master works in eighths
  // with 3. Anything off its master's grid needs a comment saying why.
  const GRID = gridOf(canvas), MAX_DP = decimalsOf(canvas), PER_UNIT = Math.round(1 / GRID);
  const offGrid = [];
  for (const d of [...ds, ...areas]) for (const n of numbersIn(d)) {
    if (dp(n) > MAX_DP) errors.push(`${n} exceeds ${MAX_DP} decimal places`);
    else if (!Number.isInteger(n * PER_UNIT)) offGrid.push(n);
  }
  if (offGrid.length) {
    const msg = `${offGrid.length} off-${gridName(canvas)}-grid value(s): ${[...new Set(offGrid)].join(', ')}`;
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
  // `bendMin` takes THIS file's weight, so the floor is per master and per style:
  // 0.75 for an outline at 1.5, 0.625 at 1.25, 1.25 for a filled line icon at 24.
  // A dot (one CLOSED circle drawn as two arcs) is not a bend: under half the stroke it is a
  // solid disc. `isDot` lives in geometry.mjs so lint, build and the lab share one test — an
  // open two-arc path is a bend (a bowl running into a tuck), checked like any other, and in a
  // glyph mark it is the body, not the dot (C19).
  for (const d of ds) if (!isDot(d)) for (const { cmd, args } of parsePath(d)) {
    if (cmd.toUpperCase() !== 'A') continue;
    for (let k = 0; k + 7 <= args.length; k += 7)
      if (Math.min(args[k], args[k + 1]) < bendMin(STROKE) - 0.005)
        warnings.push(`bend radius ${args[k]} is under half the stroke (${bendMin(STROKE)}) — the corner reads uneven (C10)`);
  }

  // --- 5. advisory: near-collisions between separate paths ---------------
  // §6 asks MIN_GAP (1.5 units) between any two stroke edges, at every master —
  // the floor does not thin with the line, so a lighter master just leaves more
  // air. Only the conversion from centreline distance to edge gap is per master:
  // it subtracts this file's own stroke. C19 carves out one case:
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
    const need = floor + STROKE; // centreline distance that leaves `floor` between the two edges
    // Point-to-SEGMENT, both ways: point-to-point read a stem standing on a bar as 0.13
    // apart whenever the bar's samples straddled the stem (info-3 at 16, on the eighth grid).
    const min = Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i]));
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
  // C19 extends here: in a file that declares `<!-- glyph: dot -->`, a mark's own
  // opening - the mouth of a `?`, of an `!`, of an `i` - is the inside of one
  // character and floors at GLYPH_GAP, for the same reason its dot gap does. §6's
  // one-stroke floor was written for parallel runs and repeated elements; applied
  // inside a letter it hollows it out. The container ring is not part of the
  // character and keeps MIN_GAP (it is a closed circle, so it has no mouth anyway).
  // `selfGap` is handed this file's own stroke, so it reads edge-to-edge at any master.
  for (let i = 0; i < ds.length; i++) {
    if (isDot(ds[i])) continue;
    const self = selfGap(ds[i], STROKE);
    if (!self) continue;
    const inGlyph = isGlyph && !isShell(spans[i]);
    const floor = inGlyph ? GLYPH_GAP : MIN_GAP;
    if (self.gap < floor - 0.01)
      warnings.push(`path ${i + 1} comes within ${self.gap} of itself at ${self.at.join(',')} — ${inGlyph ? 'C19 glyph gap' : '§6'} needs ${floor} (it turns ${self.span}°)`);
  }

  // --- 5c. advisory: a knockout cut wider than the counter it sits in --------
  // A shape-filled file cuts its mark OUT of a solid shape, at C18's per-mark width -
  // heavier than the master's outline stroke. Every gap inside the mark therefore loses
  // (cut - stroke) when it is knocked out, and nothing has ever checked what that
  // leaves. `areas` are not in the pair loop and were not in the self-gap loop either,
  // so all 66 shape-filled files had no gap check of any kind (docs/08 §6.5).
  //
  // No declaration is needed: the outline and the filled file are a pair, so every
  // point of the knockout's boundary sits exactly cut/2 from the outline's centreline.
  // The furthest one recovers the cut width to within 0.03.
  if (areas.length && ds.length === 0) {
    const pair = file.replace('-filled.svg', '.svg');
    const outline = existsSync(join('src/icons', String(canvas), pair))
      ? readFileSync(join('src/icons', String(canvas), pair), 'utf8') : null;
    if (outline) {
      const ods = [...outline.matchAll(/<path d="([^"]+)"\/>/g)].map((m) => m[1]);
      const line = ods.flatMap(samplePath);
      let cut = 0;
      for (const d of areas[0].split(/(?=M)/).filter(Boolean)) {
        let far = 0;
        for (const [x, y] of samplePath(d)) {
          let near = Infinity;
          for (const [u, v] of line) near = Math.min(near, Math.hypot(x - u, y - v));
          far = Math.max(far, near);
        }
        cut = Math.max(cut, far * 2);
      }
      const glyph = /<!--\s*glyph:\s*dot\s*-->/.test(outline);
      for (let i = 0; i < ods.length; i++) {
        if (isDot(ods[i])) continue;
        const self = selfGap(ods[i], STROKE);
        if (!self) continue;
        const floor = glyph ? GLYPH_GAP : MIN_GAP;
        const left = r2(self.gap + STROKE - cut);
        if (left < floor - 0.05)
          warnings.push(`the ${r2(cut)} cut leaves ${left} inside path ${i + 1} (counter ${self.gap}) — needs ${floor}: a knockout may not be cut wider than the counter it sits in`);
      }
    }
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
