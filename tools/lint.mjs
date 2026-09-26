#!/usr/bin/env node
// Mechanically enforces docs/01-foundations.md. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { numbersIn, samplePath, bbox, parsePath, isDot, selfGap, materialGap } from './geometry.mjs';
import { GLYPH_GAP, MASTERS, MIN_GAP, SIZE_STEP, SIZES, bendMin, decimalsOf, gridName, gridOf, isFilled, markMax, sizeBase, sizeOf, strokeOf, weightOf } from './masters.mjs';

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
// 3 dp, so an eighth-grid difference at 16 prints as 0.125 and not as a rounded 0.13.
const r3 = (n) => Math.round(n * 1000) / 1000;

// true when two sampled polylines properly intersect (sampling can miss the exact crossing point)
const side = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
const crosses = (a, b) => {
  for (let i = 1; i < a.length; i++) for (let j = 1; j < b.length; j++) {
    const [p, q, r, s] = [a[i - 1], a[i], b[j - 1], b[j]];
    if (side(p, q, r) * side(p, q, s) < 0 && side(r, s, p) * side(r, s, q) < 0) return true;
  }
  return false;
};

// An icon may declare its own agreed ink size: `<!-- box: 20x18 -->`, that master's
// units, width × height. It is a per-icon decision (folder, 2026-09-20), not a new
// keyline — so lint stops asking the drawing to match a keyline and holds it to the
// declared size instead, to 0.01. The note may never hide a mistake: a drawing that
// does not measure what it declares is an ERROR, not a warning.
// Returns null (no note), {w, h, raw}, or {raw, bad: true} for a note that is not a size.
export function parseBoxNote(src) {
  const m = src.match(/<!--\s*box:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  const v = m[1].match(/^(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)$/);
  return v ? { w: +v[1], h: +v[2], raw: m[1] } : { raw: m[1], bad: true };
}

// --- the pair: a filled drawing's ink box is its outline twin's -------------
// Settled ("Exact placement", C10/C12): the two styles of one icon at one master occupy
// exactly the same ink box, to 2 dp. Every check above reads one file alone, so nothing
// has ever compared the pair (docs/09 §2). These two do.
//
// A filled drawing may declare an agreed difference: `<!-- grows: L R T B -->`, four
// signed numbers in that master's units saying how far the filled ink stands PROUD of
// the outline's on the left, right, top and bottom — negative means pulled inside.
// Three agreed cases exist today: C17's repeated elements (dots, menu lines) thicken in
// place, and a lone bar (`minus`) cannot thicken without growing. Same spirit as
// `box:` — the note only silences the warning while the drawings measure what it says,
// so it can never hide a mistake.
// Returns null (no note), {l, r, t, b, raw}, or {raw, bad: true}.
export function parseGrowsNote(src) {
  const m = src.match(/<!--\s*grows:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  const parts = m[1].split(/\s+/).filter(Boolean);
  return parts.length === 4 && parts.every((p) => /^[+-]?\d+(?:\.\d+)?$/.test(p))
    ? { l: +parts[0], r: +parts[1], t: +parts[2], b: +parts[3], raw: m[1] }
    : { raw: m[1], bad: true };
}

// An icon may declare its own agreed minimum gap: `<!-- gap: N -->`, that master's
// units, between any two stroke edges in THIS file. It replaces §6's MIN_GAP for the
// two proximity checks below (path-vs-path in §5, path-vs-itself in §5b) and for that
// file alone; C19's glyph pairs keep GLYPH_GAP, and the knockout check keeps MIN_GAP.
// Agreed by eye at approval (attachment-4-filled, 2026-09-20: the filled clip keeps all
// four legs, so the path passes within 1.04 of itself at 24 and 1.0 at 20).
// Same spirit as `box:` and `grows:` — a declared deviation is held to its own number
// instead of leaving a warning that buries real ones, and it can never hide a mistake:
// a note lint cannot read, one that is not below MIN_GAP, and one the drawing does not
// need are all ERRORS.
// Returns null (no note), {n, raw}, or {raw, bad: true}.
export function parseGapNote(src) {
  const m = src.match(/<!--\s*gap:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  const v = m[1].match(/^\d+(?:\.\d+)?$/);
  return v && +m[1] > 0 ? { n: +m[1], raw: m[1] } : { raw: m[1], bad: true };
}

// A member of a level family (C28) declares `<!-- anchor: NAME -->`: NAME is the family's
// full member (`volume`), and this file keeps that member's canvas position instead of being
// centred on a keyline — the body never moves, so the fewer waves, the more it leans toward
// the body. The note names the outline; a filled file is held to `NAME-filled.svg`. Checked in
// `checkAnchors` below, which reads the whole map because a file cannot see its anchor. Same
// spirit as `box:`, `grows:` and `gap:` — it can never hide a mistake: a note lint cannot read,
// one naming its own file, one whose anchor is missing, inkless or itself anchored, ink outside
// the anchor's box, and ink that shares neither its left nor its right edge (the body moved)
// are all ERRORS. Unlike those notes it is a declaration of membership, not a
// licence, so lint never asks for it to be removed.
// Returns null (no note), {name, raw}, or {raw, bad: true}.
export function parseAnchorNote(src) {
  const m = src.match(/<!--\s*anchor:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m[1]) && !/-filled$/.test(m[1])
    ? { name: m[1], raw: m[1] } : { raw: m[1], bad: true };
}

// Path text compared as written, bar whitespace (runs collapse; none is kept beside a command
// letter or a comma): "identical" means the same drawing, not the same shape reached another way.
const normPath = (d) => d.replace(/\s*([A-Za-z,])\s*/g, '$1').replace(/\s+/g, ' ').trim();

const SIDES = { l: 'left', r: 'right', t: 'top', b: 'bottom' };
const growsText = (g) => `${g.l} ${g.r} ${g.t} ${g.b}`;
const signed = (n) => (n > 0 ? `+${r3(n)}` : `${r3(n)}`);

// Pure: two raw ink boxes ({x0, y0, x1, y1}) as §4 measures them, plus the filled file's
// `grows` note if it has one. No filesystem, so tools/geometry.test.mjs can hand it numbers.
export function comparePair(filled, outline, grows = null) {
  const d = {
    l: outline.x0 - filled.x0,   // outward on every side: + is filled ink standing proud
    r: filled.x1 - outline.x1,
    t: outline.y0 - filled.y0,
    b: filled.y1 - outline.y1,
  };
  const keys = Object.keys(SIDES);
  const dims = (b) => `${r3(b.x1 - b.x0)}×${r3(b.y1 - b.y0)}`;
  const measured = keys.map((k) => `${SIDES[k]} ${signed(d[k])}`).join(' · ');
  const off = keys.filter((k) => Math.abs(d[k] - (grows ? grows[k] : 0)) > 0.01);
  if (!off.length) return { errors: [], warnings: [], notes: grows ? [`agreed growth ${growsText(grows)}`] : [] };
  if (grows) return { errors: [`declares growth ${growsText(grows)} but the filled ink measures ${measured} — the agreed growth and the drawings disagree`], warnings: [], notes: [] };
  return { errors: [], warnings: [`ink box differs from the outline's: ${measured} (filled ${dims(filled)} vs outline ${dims(outline)}) — Settled: filled box = outline box`], notes: [] };
}

// The directory-level half. A file cannot see its twin, so this runs over the whole
// map of results — `${master}/${file}.svg` → what `lintSource` returned — and adds to
// them in place. Takes a plain Map, so a test can build one without a drawing on disk.
export function checkPairs(results) {
  for (const [key, r] of results) {
    const [m, f] = key.split('/'), name = f.replace('.svg', '');
    const filled = isFilled(name);
    const twinName = filled ? name.replace(/-filled$/, '') : `${name}-filled`;
    const twin = results.get(`${m}/${twinName}.svg`);
    if (!twin) {
      r.warnings.push(`no ${filled ? 'outline' : 'filled'} twin \`${twinName}.svg\` at ${m} — an icon ships as a pair`);
      continue;
    }
    // Judged once per pair, on the filled file: it is the one that may declare `grows`.
    if (!filled || !r.ink || !twin.ink) continue;
    const pair = comparePair(r.ink, twin.ink, r.grows);
    r.errors.push(...pair.errors);
    r.warnings.push(...pair.warnings);
    r.notes.splice(-1, 0, ...pair.notes);   // the headline note stays last (run prints it inline)
  }
  return results;
}

function lint(canvas, file) {
  return lintSource(canvas, file, readFileSync(join('src/icons', String(canvas), file), 'utf8'));
}

export function lintSource(canvas, file, src) {
  const { bound: BOUND, keylines } = MASTERS[canvas];
  const MARK_MAX = markMax(file.replace('.svg', ''), canvas);
  const KEYLINES = Object.entries(keylines).map(([k, [w, h]]) => [k, w, h]);
  const isFilledFile = file.endsWith('-filled.svg');
  const areas = isFilledFile ? [...src.matchAll(AREA)].map((m) => m[1]) : [];
  // The weight this file's strokes are drawn at, per master and per style. A
  // shape-filled file paints its areas and keeps the master's outline stroke for
  // the lines it has left, so it is the presence of areas that decides, not the name.
  const STROKE = areas.length ? strokeOf(canvas) : weightOf(file.replace('.svg', ''), canvas);
  const REQUIRED = required(canvas, STROKE);
  const mid = canvas / 2;
  const errors = [], warnings = [], notes = [];
  let size = null, inner = null, isMark = false, ink = null;
  const hasComment = /<!--/.test(src);

  // --- 0. the agreed-growth note (checked against the twin in run()) ------
  // Read here so a note lint cannot parse, or one sitting in the wrong file, is an error
  // even when the twin is missing — it must never be able to pass unseen.
  let grows = parseGrowsNote(src);
  if (grows && !isFilledFile) {
    errors.push('only a `-filled` file may declare `grows:` — it says how the filled ink differs from its outline twin');
    grows = null;
  } else if (grows?.bad) {
    errors.push(`grows note "${grows.raw}" is not four numbers — write <!-- grows: L R T B -->, e.g. <!-- grows: 0 0 0.25 0.25 -->`);
    grows = null;
  }

  // --- 0b. the agreed-gap note (§5 / §5b read it; checked against the drawing below) ---
  let gap = parseGapNote(src);
  if (gap?.bad) {
    errors.push(`gap note "${gap.raw}" is not a distance — write <!-- gap: N -->, e.g. <!-- gap: 1 -->`);
    gap = null;
  } else if (gap && gap.n >= MIN_GAP) {
    errors.push(`declares gap ${gap.n}, which is not below §6's ${MIN_GAP} — the note only ever lowers the floor for one file; delete it`);
    gap = null;
  }
  const GAP = gap ? gap.n : MIN_GAP;
  const measured = [];   // every edge gap the note governs, for the "is it still needed" check

  // --- 0c. the anchor note (C28; held to its anchor in checkAnchors) --------
  // A note that is not usable is an error and is then ignored, so §4 asks the drawing to be
  // centred on a keyline exactly as it would without it.
  let anchor = parseAnchorNote(src);
  const selfName = file.replace(/\.svg$/, '').replace(/-filled$/, '');
  if (anchor?.bad) {
    errors.push(`anchor note "${anchor.raw}" is not an icon name — write <!-- anchor: NAME --> with the full member's outline name, e.g. <!-- anchor: volume -->`);
    anchor = null;
  } else if (anchor && anchor.name === selfName) {
    errors.push(`declares itself as its anchor — the full member of a level family is centred like any icon and carries no note; only the other members declare <!-- anchor: ${selfName} --> (C28)`);
    anchor = null;
  }

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
    // Kept unrounded for the pair comparison: at 16 a filled edge can land on x.625, and
    // rounding it to 2 dp would invent 0.005 of difference the drawing does not have.
    ink = { x0: Math.min(...boxes.map((b) => b[0])), y0: Math.min(...boxes.map((b) => b[1])),
      x1: Math.max(...boxes.map((b) => b[2])), y1: Math.max(...boxes.map((b) => b[3])) };
    const o = { x0: r2(ink.x0), y0: r2(ink.y0), x1: r2(ink.x1), y1: r2(ink.y1) };
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
    const box = parseBoxNote(src);
    if (box?.bad) errors.push(`box note "${box.raw}" is not a size — write <!-- box: WxH -->, e.g. <!-- box: 20x18 -->`);
    if (box && isMark) errors.push('declares both `keyline: mark` and `box:` — a mark is held to the mark ceiling, an agreed box to its own size; pick one');
    if (anchor && (isMark || box)) {
      errors.push(`declares both \`anchor:\` and \`${isMark ? 'keyline: mark' : 'box:'}\` — an anchored member is held to its full member's box (C28), ${isMark ? 'a mark to the mark ceiling' : 'an agreed box to its own size'}; pick one`);
      anchor = null;
    }
    // A container's first path is the container; the rest is its inner mark (measured on the outline file).
    if (!isMark && !areas.length && ds.length > 1) {
      const b = bbox(ds.slice(1));
      inner = r2(Math.max(b.x1 - b.x0, b.y1 - b.y0) + STROKE);
    }
    if (isMark) {
      notes.push(`${w}×${h}  declared mark  centre ${cx},${cy}`);
      if (w > MARK_MAX || h > MARK_MAX) warnings.push(`mark is ${w}×${h} — exceeds ${MARK_MAX}×${MARK_MAX} (§2)`);
    } else if (box && !box.bad) {
      notes.push(`${w}×${h}  agreed box  centre ${cx},${cy}`);
      if (Math.abs(w - box.w) > 0.01 || Math.abs(h - box.h) > 0.01)
        errors.push(`declares box ${box.w}x${box.h} but the ink is ${w}×${h} — the agreed size and the drawing disagree`);
    } else {
      const key = KEYLINES.find(([, kw, kh]) => Math.abs(w - kw) <= 0.5 && Math.abs(h - kh) <= 0.5);
      notes.push(`${w}×${h}  ${anchor ? `anchored to ${anchor.name}` : key ? `fits ${key[0]} keyline` : 'no keyline match'}  centre ${cx},${cy}`);
      // An anchored member keeps its full member's position (C28), so this warning and the
      // off-centre one below are held back, not dropped: checkAnchors puts them back if the
      // anchor cannot be found, and reads an empty list as "it would pass without the note".
      // (A usable anchor only ever reaches this branch: with a mark or a box it was cleared.)
      if (anchor) anchor.held = [];
      if (!key) (anchor?.held ?? warnings).push(`${w}×${h} matches no keyline (§2) — if this is a directional mark, declare <!-- keyline: mark -->`);
    }
    if (Math.abs(cx - mid) > 0.5 || Math.abs(cy - mid) > 0.5) (anchor?.held ?? warnings).push(`off-centre at ${cx},${cy}`);
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
    const floor = glyphPair ? GLYPH_GAP : GAP;
    const need = floor + STROKE; // centreline distance that leaves `floor` between the two edges
    // Point-to-SEGMENT, both ways: point-to-point read a stem standing on a bar as 0.13
    // apart whenever the bar's samples straddled the stem (info-3 at 16, on the eighth grid).
    const min = Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i]));
    if (min <= 0.1) continue;
    if (!glyphPair) measured.push(r2(min - STROKE));
    if (min < need - 0.01)
      warnings.push(`paths ${i + 1}/${j + 1} are ${r2(min)} apart — ${glyphPair ? 'C19 glyph gap' : gap ? `agreed gap ${gap.n}` : '§6'} needs ${need} (edge gap ${r2(min - STROKE)} < ${floor})`);
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
    const floor = inGlyph ? GLYPH_GAP : GAP;
    if (!inGlyph) measured.push(self.gap);
    if (self.gap < floor - 0.01)
      warnings.push(`path ${i + 1} comes within ${self.gap} of itself at ${self.at.join(',')} — ${inGlyph ? 'C19 glyph gap' : gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor} (it turns ${self.span}°)`);
  }

  // --- 5c. advisory: a knockout that leaves too little standing ---------------
  // A shape-filled file cuts its mark OUT of a solid shape, at C18's per-mark width -
  // heavier than the master's outline stroke. Every gap inside the mark therefore loses
  // (cut - stroke) when it is knocked out: the mouth of a `?` stops being air and
  // becomes a neck of material, and it is that neck which has to survive 16 px.
  // `areas` are not in the pair loop and were not in the self-gap loop either
  // (docs/08 §6.5).
  //
  // Measured on the filled drawing itself (`materialGap`: the narrowest filled span
  // between two parts of one hole). Until 2026-09-20 this recovered the cut's width
  // from the OUTLINE twin's centreline and subtracted it from the outline's counter,
  // which assumed the cut was centred on the outline. The 16 master's move to stroke
  // 1.25 shifted the outlines 0.125 under cut-outs that were deliberately left as
  // approved, and an unchanged `help-4-filled` began to warn. The floor is the one the
  // outline's own mouth gets in 5b: GLYPH_GAP inside a declared glyph, else MIN_GAP.
  if (areas.length && ds.length === 0) {
    const left = materialGap(areas);
    const floor = isGlyph ? GLYPH_GAP : MIN_GAP;
    // Printed whenever there is a reading, so a drawing that stops being measured (the
    // measure returns null when no cut faces itself) shows up as a line that went missing.
    if (left) notes.splice(-1, 0, `knockout leaves ${left.gap} at ${left.at.join(',')}`);
    if (left && left.gap < floor - 0.01)
      warnings.push(`the knockout leaves ${left.gap} of material between two parts of itself at ${left.at.join(',')} — ${isGlyph ? 'C19 glyph gap' : '§6'} needs ${floor}: a knockout may not be cut wider than the counter it sits in`);
  }

  // --- 5d. is the agreed gap still doing anything? ------------------------
  // The note lowers the floor, so it has to earn its place: if nothing the two checks
  // above measure comes closer than §6's own floor, the drawing no longer needs it and
  // the note is stale — an ERROR, so it is deleted rather than left to excuse a future
  // change nobody agreed. Otherwise it is in force, and says so the way `grows` does.
  if (gap) {
    const smallest = measured.length ? Math.min(...measured) : Infinity;
    if (smallest >= MIN_GAP - 0.01)
      errors.push(`declares gap ${gap.n} but nothing in this drawing comes within §6's ${MIN_GAP}${Number.isFinite(smallest) ? ` (smallest measured ${smallest})` : ''} — the note is not needed; delete it`);
    else if (smallest >= gap.n - 0.01)
      notes.splice(-1, 0, `agreed gap ${gap.n} — smallest measured ${smallest}`);
  }

  // `paths` (whitespace-normalised) lets checkAnchors count what a member shares with its anchor.
  const paths = [...ds, ...areas].map(normPath);
  return { file, errors, warnings, notes, size, inner, isMark, ink, grows, gap, anchor, paths };
}

// --- 6. size families (C8): a mark's large and small sit one SIZE_STEP from the default;
// a container's keep the container and change only the inner mark (outline file measures it).
// Like `checkPairs`, it reads the whole map — `${master}/${file}.svg` → what `lintSource`
// returned — and adds to the results in place, so a draft can be checked the same way
// without a drawing on disk (tools/draft-check.mjs).
export function checkFamilies(results) {
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
  return results;
}

// --- 8. level families (C28): an anchored member stays inside its full member's box ---
// Like `checkPairs`, it reads the whole map — `${master}/${file}.svg` → what `lintSource`
// returned — so the anchor is looked up in whatever set of files is being linted: src/icons
// for `npm run check`, the candidate plus its anchor for tools/draft-check.mjs. Same master,
// same style: `volume-low.svg` is held to `volume.svg`, `volume-low-filled.svg` to
// `volume-filled.svg`. Adds to the results in place.
const fmtBox = (b) => `${r3(b.x0)},${r3(b.y0)} → ${r3(b.x1)},${r3(b.y1)}`;
export function checkAnchors(results) {
  for (const [key, r] of results) {
    if (!r.anchor) continue;
    const [m, f] = key.split('/');
    const { name, held = [] } = r.anchor;
    const anchorFile = `${name}${f.endsWith('-filled.svg') ? '-filled' : ''}.svg`;
    const a = results.get(`${m}/${anchorFile}`);
    if (!a) {
      r.errors.push(`anchored to ${name}, but there is no \`${anchorFile}\` at ${m} to hold it to — the full member ships before its levels, or with them (C28)`);
      r.warnings.push(...held);   // unanchored after all: it answers to §2 and the centre like any icon
      continue;
    }
    if (a.anchor) {
      r.errors.push(`anchored to ${name}, which is itself anchored to ${a.anchor.name} — anchor every member to the full member (C28)`);
      r.warnings.push(...held);
      continue;
    }
    if (!a.ink) {
      r.errors.push(`anchored to ${name}, but \`${anchorFile}\` at ${m} has no ink to hold it to (C28)`);
      r.warnings.push(...held);
      continue;
    }
    if (!r.ink) { r.warnings.push(...held); continue; }   // lintSource has already said "no <path> found"
    const out = {   // outward on every side: + is member ink standing outside the anchor's box
      l: a.ink.x0 - r.ink.x0, r: r.ink.x1 - a.ink.x1, t: a.ink.y0 - r.ink.y0, b: r.ink.y1 - a.ink.y1 };
    const over = Object.keys(SIDES).filter((k) => out[k] > 0.01);
    if (over.length) {
      r.errors.push(`ink ${fmtBox(r.ink)} runs outside ${name}'s ${fmtBox(a.ink)} on the ${over.map((k) => `${SIDES[k]} by ${r3(out[k])}`).join(', ')} — a level family's members stay inside the full member's box (C28)`);
      continue;
    }
    // Inside the box is not enough: a member re-centred inside it has moved its body. The body
    // (the speaker) runs to one side of the full member's ink and stays there, so the member
    // shares that side exactly. Not path identity: `volume-off`'s C21 bar may cut the speaker
    // and share no path, yet its speaker still starts at volume's left edge.
    if (Math.abs(r.ink.x0 - a.ink.x0) > 0.01 && Math.abs(r.ink.x1 - a.ink.x1) > 0.01) {
      r.errors.push(`ink x ${r3(r.ink.x0)} → ${r3(r.ink.x1)} shares neither side of ${name}'s ${r3(a.ink.x0)} → ${r3(a.ink.x1)} — the body moves; a level family keeps it in place (C28)`);
      continue;
    }
    // The note declares family membership (C28: every member but the full one carries it),
    // not a licence for a deviation — so unlike `gap`, a member that happens to fill the full
    // member's own box (a × in the waves' place) is never told to drop it.
    const own = Object.values(out).every((v) => Math.abs(v) <= 0.01);
    const mine = new Set(a.paths ?? []);
    const same = (r.paths ?? []).filter((d) => mine.has(d)).length;
    r.notes.splice(-1, 0, own ? `anchored to ${name}: ink is ${name}'s own box (${fmtBox(r.ink)})` : `anchored to ${name}: ink ${fmtBox(r.ink)} inside ${fmtBox(a.ink)}`,
      `${same} of ${r.paths?.length ?? 0} paths identical to ${name}'s`);
  }
  return results;
}

// --- the run over src/icons ---------------------------------------------
// Everything below is the command; `lintSource` above is the whole check, so a test
// can hand it one file's text without a drawing on disk (tools/geometry.test.mjs).
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) run();

function run() {
const jobs = Object.keys(MASTERS).map(Number).sort((a, b) => b - a).flatMap((m) => {
  const dir = join('src/icons', String(m));
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => [m, f]) : [];
});
let bad = 0, warned = 0;
const G = '\x1b[32m', Y = '\x1b[33m', R = '\x1b[31m', D = '\x1b[2m', X = '\x1b[0m';

const results = new Map(jobs.map(([m, f]) => [`${m}/${f}`, lint(m, f)]));

// --- 6. size families (C8) ---
checkFamilies(results);

// --- 7. the pair: every icon ships as outline + filled, in the same ink box ---
checkPairs(results);

// --- 8. level families (C28): anchored members inside the full member's box ---
checkAnchors(results);

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
}
