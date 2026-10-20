#!/usr/bin/env node
// Mechanically enforces docs/01-foundations.md. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { numbersIn, samplePath, bbox, parsePath, isDot, isSolidDot, isSolidStroke, ringHole, selfGap, materialGap, facingGap, armTipGap, insideAir, encloses, subpathsOf } from './geometry.mjs';
import { GLYPH_GAP, MASTERS, MIN_GAP, SIZE_STEP, SIZES, STATE_TWINS, bendMin, decimalsOf, gridName, gridOf, isFilled, markMax, sizeBase, sizeOf, strokeOf, weightOf } from './masters.mjs';

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
// One exception to "one weight per file" (C32, 2026-10-17): in a line-heavy `-filled` file
// that declares `<!-- glyph: numeral -->`, a numeral's path carries its own
// `stroke-width` at the master's OUTLINE weight, so a 1 inside 2.5 rails does not thicken
// into a blob. Every measure below reads each path at its own weight. Widened 2026-10-20 to
// letters, declared `<!-- glyph: letter -->` (translate's A and 文). A second (C33,
// 2026-10-19): in one that declares `<!-- badge: line -->`, a line badge's paths do the same,
// so passkey-2's key keeps its ring beside fingerprint's bold print.
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
// proximity checks below (path-vs-path in §5 and the tips of arms that cross there,
// path-vs-itself in §5b, facing walls in §5f, the tips of arms traced as one filled shape in
// §5h, the inside air of one closed shape in §5i) and for that file alone; C19's glyph pairs and a character's own arms keep GLYPH_GAP,
// a C33 badge keeps MIN_GAP, and the knockout check keeps MIN_GAP.
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

// A C33 composite declares `<!-- base: NAME -->` (2026-10-20): NAME is the icon whose drawing and
// canvas position it keeps, with a badge on NAME's corner. C33 keeps the base where NAME has it, so
// on a short base the badge pulls the whole icon off the canvas centre (first `password-lock`:
// password's 20×10 field, 2.5 · 2 · 1.5 low). The note names the outline; a filled file is held to
// `NAME-filled.svg`. Checked in `checkBases` below, which reads the whole map. It lifts only the
// centring: the ink must hold NAME's box and share its left and top edges (the corner away
// from C33's bottom-right badge), and `box:` stays allowed beside it, since C33 composites declare their box. Same
// spirit as `anchor:` — a note lint cannot read, one naming its own file, a missing or inkless base,
// ink that does not hold the base's box or moves off its top-left corner, and `base` with `anchor` or
// `keyline: mark` are all ERRORS. Like `anchor` it states how the drawing was built, so a composite
// that happens to sit on the centre keeps it (the info line says "on centre").
// Returns null (no note), {name, raw}, or {raw, bad: true}.
export function parseBaseNote(src) {
  const m = src.match(/<!--\s*base:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m[1]) && !/-filled$/.test(m[1])
    ? { name: m[1], raw: m[1] } : { raw: m[1], bad: true };
}

// C19 is declared per file as `<!-- glyph: KIND -->`. Three kinds:
//   dot      one character with a detached dot (info-circle's i, help-circle's ?, alert's !): the {dot, body}
//            pair and the character's own opening floor at GLYPH_GAP (§5, §5b), and so does
//            what a knockout leaves between two parts of itself (§5c); since 2026-10-20 so do
//            the tips of the character's own crossing arms, between any paths but the
//            silhouette (§5) and in any shape but the silhouette's notches (§5h), and the inside
//            air of a closed path or a hole that is not the silhouette's (§5i)
//   numeral  numerals drawn inside an icon (list-ordered's 1 and 2, 2026-09-26): a numeral's
//            own opening - the mouth of a 2 between its entry terminal and its neck - floors at
//            GLYPH_GAP (§5b), and since 2026-10-20 so do the tips of arms where one path
//            crosses itself (§5), a filled shape's notches (§5h), the inside air of a
//            closed path or a hole (§5i), and a numeral's own hole — outline or filled — in
//            every check, §5f's width across a cut-out included (Maruti, 2026-10-20); nothing
//            else does: numeral-to-numeral and numeral-to-line keep MIN_GAP
//   letter   letters drawn inside a LINE-HEAVY icon (translate's A and 文, 2026-10-20): C32's
//            weight and nothing else — a letter's path keeps the outline weight in the filled
//            file (§2b), as a numeral's does, but its openings get no GLYPH_GAP: they keep §6, or
//            the file's `gap` note, like any path. Written only into the filled files whose
//            letters carry their own weight, so a letter note with no such path is an ERROR
//            (stale), as `badge: line` is.
// Until 2026-09-26 any other value was silently read as no note at all; now it is an ERROR,
// like the other notes, so a misspelt kind can never leave a drawing held to the wrong floor.
// Returns null (no note), {kind, raw}, or {raw, bad: true}.
export const GLYPH_KINDS = ['dot', 'numeral', 'letter'];
export function parseGlyphNote(src) {
  const m = src.match(/<!--\s*glyph:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  return GLYPH_KINDS.includes(m[1]) ? { kind: m[1], raw: m[1] } : { raw: m[1], bad: true };
}

// C33's badge is declared per filled file as `<!-- badge: KIND -->` (2026-10-19). One kind:
//   line     a line badge (a key, a loop, a plus) on a LINE-HEAVY base: its paths carry
//            `stroke-width` at the master's outline weight while the base draws at FILLED_WEIGHT
//            (§2b), and its air to the base floors at MIN_GAP whatever the file's `gap` note says
//            (§5) — the note was agreed for the base. First passkey-2: the key on fingerprint.
// A shape badge (map-pinned's pin) fills like any shape, and a line badge on a shape-filled base
// already draws at the outline weight (calendar-repeat's loop), so neither has a note to write.
// Named for what C33 calls it, and shaped like `glyph:` so a file reads the same way: the
// note says what kind of thing keeps its own weight. Like the other notes it can never hide a
// mistake: a kind lint cannot read, and a note no path draws under, are ERRORS.
// Returns null (no note), {kind, raw}, or {raw, bad: true}.
export const BADGE_KINDS = ['line'];
export function parseBadgeNote(src) {
  const m = src.match(/<!--\s*badge:\s*([^>]*?)\s*-->/);
  if (!m) return null;
  return BADGE_KINDS.includes(m[1]) ? { kind: m[1], raw: m[1] } : { raw: m[1], bad: true };
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

  // --- 0b'. the glyph note (C19; §5, §5b and §5c read it) -------------------
  let glyph = parseGlyphNote(src);
  if (glyph?.bad) {
    errors.push(`glyph note "${glyph.raw}" is not a kind lint knows — write <!-- glyph: dot --> (a character with a detached dot), <!-- glyph: numeral --> (numerals inside the icon) (C19) or <!-- glyph: letter --> (letters kept at the outline weight in a line-heavy filled drawing) (C32)`);
    glyph = null;
  }
  const isGlyph = glyph?.kind === 'dot';
  const isNumeral = glyph?.kind === 'numeral';   // C19's opening floor (§5, §5b, §5f, §5h, §5i; said in 5e) and C32's weight (§2b)
  const isLetter = glyph?.kind === 'letter';     // C32's weight (§2b) only — never C19's floor
  const keepsWeight = isNumeral || isLetter;     // the glyph notes that let a path keep the outline weight
  // the tightest reading the numeral note floors at GLYPH_GAP — every check that lowers the floor
  // for it feeds this (§5, §5b, §5f, §5h, §5i), so 5e never calls a note in use "not in use"
  let numeralMin = Infinity;

  // --- 0b''. the badge note (C33; §2b, §5, §5b and §5f read it) ---------------
  // Both notes let a path carry the outline weight, and a path says nothing about which it is,
  // so one file declares one of them; until an icon needs both, the pair is an ERROR and the
  // file is read as the numeral (or letter) note alone.
  let badge = parseBadgeNote(src);
  if (badge?.bad) {
    errors.push(`badge note "${badge.raw}" is not a kind lint knows — write <!-- badge: line --> (a line badge kept at the outline weight on a line-heavy filled base) (C33)`);
    badge = null;
  } else if (badge && keepsWeight) {
    errors.push(`declares both <!-- glyph: ${glyph.kind} --> and <!-- badge: line --> — each lets a path keep the outline weight, and lint cannot tell a ${glyph.kind}'s path from the badge's (C32, C33)`);
    badge = null;
  }
  const isBadge = !!badge;

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

  // --- 0c'. the base note (C33; held to its base in checkBases) ---------------
  // Same handling: a note that is not usable is an error and is then ignored, so §4 asks the
  // drawing to be centred as it would without it. A composite keeps its base's place, a level
  // member its full member's; one file cannot be held to both, so the pair drops the base.
  let base = parseBaseNote(src);
  if (base?.bad) {
    errors.push(`base note "${base.raw}" is not an icon name — write <!-- base: NAME --> with the base's outline name, e.g. <!-- base: password -->`);
    base = null;
  } else if (base && base.name === selfName) {
    errors.push(`declares itself as its base — a C33 composite names the icon under its badge, whose place it keeps (password-lock: <!-- base: password -->); the base itself is centred like any icon and carries no note (C33)`);
    base = null;
  } else if (base && anchor) {
    errors.push(`declares both \`anchor:\` and \`base:\` — a level member keeps its full member's place (C28), a composite its base's (C33); pick one`);
    base = null;
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

  const ds = [...stripped.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  if (!ds.length && !areas.length) errors.push('no <path> found');

  // --- 2b. a path's own weight (C32) -----------------------------------------
  // Every stroke attribute belongs on the root, bar one: in a file that declares
  // `<!-- glyph: numeral -->`, a numeral's path may carry `stroke-width` at this master's
  // OUTLINE weight (masters.mjs STROKES) — which only differs from the root in a line-heavy
  // filled file (root FILLED_WEIGHT). So a per-path weight is an ERROR, naming the path, in a
  // file without the note, at any other value, or where it only repeats the root. `W[i]` is
  // path i's weight; §4, §4b, §5, §5b and §5f read it, never one weight for the file.
  // Only the ONE accepted form is taken out — a single, double-quoted `stroke-width="…"` at the
  // outline weight, in a file with the note — and HEAD's blanket test then runs on what is left,
  // so any other stroke attribute, any quoting, a repeat or a path lint cannot read still fails.
  // C32 widened (2026-10-20): `<!-- glyph: letter -->` grants the same, on the same terms, to a
  // letter's paths (translate's A and 文), and nothing else — §5b and §5f read them as any path.
  // C33 (2026-10-19): `<!-- badge: line -->` grants the same, on the same terms, to a line
  // badge's paths; `inBadge[i]` marks them for §5, §5b and §5f.
  const OUTLINE = strokeOf(canvas);
  const W = [], glyphed = [], badged = [], inBadge = [];
  const [who, rule] = isBadge ? ['a line badge', 'C33'] : [isLetter ? 'a letter' : 'a numeral', 'C32'];
  let rest = stripped;   // the body with each accepted per-path weight removed
  let owned = 0;         // paths that carry a readable weight of their own, accepted or not
  [...stripped.matchAll(/<path([^>]*)\bd="[^"]+"([^>]*)>/g)].forEach((m, i) => {
    W[i] = STROKE;
    const tag = `${m[1]} ${m[2]}`;
    const widths = [...tag.matchAll(/\sstroke-width\b/g)].length;
    if (widths > 1) { errors.push(`path ${i + 1} carries stroke-width more than once (${rule})`); return; }
    const own = tag.match(/\sstroke-width="([^"]*)"/);
    if (!own) return;   // none, or not double-quoted: the blanket test below decides
    const v = own[1];
    owned++;
    if (!keepsWeight && !isBadge)
      errors.push(`path ${i + 1} carries its own stroke-width="${v}" — only a numeral or a letter may, in a file that declares <!-- glyph: numeral --> or <!-- glyph: letter --> (C32), or a line badge, in one that declares <!-- badge: line --> (C33); everything else draws at the root's ${STROKE}`);
    else if (v !== String(OUTLINE))
      errors.push(`path ${i + 1} carries stroke-width="${v}" — ${who} keeps this master's outline weight, "${OUTLINE}" (${rule})`);
    else if (OUTLINE === STROKE)
      errors.push(`path ${i + 1} carries stroke-width="${v}", which is the root's own — only ${isBadge ? 'a line badge on a line-heavy filled base' : `${who} inside a line-heavy filled drawing`} needs its own weight (${rule}); delete it`);
    else {
      W[i] = OUTLINE;
      if (isBadge) { badged.push(i + 1); inBadge[i] = true; } else glyphed.push(i + 1);
      rest = rest.replace(m[0], m[0].replace(own[0], ''));
    }
  });
  if (/<path[^>]*\sstroke/.test(rest)) errors.push('stroke attribute on a <path> — belongs on the root');
  if (glyphed.length)
    notes.push(`path${glyphed.length > 1 ? 's' : ''} ${glyphed.join(', ')} ${glyphed.length > 1 ? `are ${glyph.kind}s` : `is ${who}`} at ${OUTLINE} (C32)`);
  if (badged.length)
    notes.push(`path${badged.length > 1 ? 's' : ''} ${badged.join(', ')} ${badged.length > 1 ? 'are' : 'is'} the line badge at ${OUTLINE} (C33)`);
  // The note has one job, so a file that declares it with no path drawn under it is stale. (A path
  // whose weight is wrong already has its own error above; this is for a note with nothing at all.)
  if (isBadge && !owned)
    errors.push(`declares <!-- badge: line --> but no path carries its own weight — the note keeps a line badge at the outline weight on a line-heavy filled base (C33); anywhere else the badge draws at the root's ${STROKE} already; delete it`);
  // So does `glyph: letter`: its one job is the weight (no opening floor to keep it in use, as
  // `glyph: numeral` has), and the board writes it only where a letter carries its own weight.
  if (isLetter && !owned)
    errors.push(`declares <!-- glyph: letter --> but no path carries its own weight — the note keeps a letter at the outline weight in a line-heavy filled drawing (C32); anywhere else a letter draws at the root's ${STROKE} already; delete it`);

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
    // A line grows its centreline box by half its own stroke (C32: a numeral's or a letter's is
    // thinner than the rails'); a filled area is its own box.
    const boxes = ds.map((d, i) => { const b = bbox([d]), h = W[i] / 2; return [b.x0 - h, b.y0 - h, b.x1 + h, b.y1 + h]; });
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
    if (base && isMark) {
      errors.push('declares both `base:` and `keyline: mark` — a C33 composite keeps its base\'s place and declares its box, a mark is held to the mark ceiling and the centre; pick one');
      base = null;
    }
    // A composite keeps its base's place (C33), so the off-centre warning below is held back, not
    // dropped: checkBases puts it back if the base cannot be found, and prints the offset instead.
    // Measured on the unrounded ink, less any optical shift, so 16's eighths print exactly.
    if (base) {
      base.held = [];
      base.off = [r3((ink.x0 + ink.x1) / 2 - sx - mid), r3((ink.y0 + ink.y1) / 2 - sy - mid)];
    }
    // A container's first path is the container; the rest is its inner mark (measured on the outline file).
    if (!isMark && !areas.length && ds.length > 1) {
      if (W.every((w) => w === STROKE)) {
        const b = bbox(ds.slice(1));
        inner = r2(Math.max(b.x1 - b.x0, b.y1 - b.y0) + STROKE);
      } else {   // a C32 numeral or letter is thinner than the lines beside it: grow each path by its own half
        const bs = ds.slice(1).map((d, i) => { const b = bbox([d]), h = W[i + 1] / 2; return [b.x0 - h, b.y0 - h, b.x1 + h, b.y1 + h]; });
        inner = r2(Math.max(Math.max(...bs.map((b) => b[2])) - Math.min(...bs.map((b) => b[0])), Math.max(...bs.map((b) => b[3])) - Math.min(...bs.map((b) => b[1]))));
      }
    }
    if (isMark) {
      notes.push(`${w}×${h}  declared mark  centre ${cx},${cy}`);
      if (w > MARK_MAX || h > MARK_MAX) warnings.push(`mark is ${w}×${h} — exceeds ${MARK_MAX}×${MARK_MAX} (§2)`);
    } else if (box && !box.bad) {
      // A filled file that also declares `grows` is held to the box PLUS that growth. `box:` is
      // the agreed size of the OUTLINE; `grows:` says how far the filled ink is allowed to stand
      // proud of it, which is the only honest way to describe a C17 repeated element — menu
      // lines, dots, these sort bars — since those thicken in place and cannot keep the box.
      // Checking the raw box against the filled file would leave such a pair undeclarable.
      const gw = grows && !grows.bad ? r2(box.w + grows.l + grows.r) : box.w;
      const gh = grows && !grows.bad ? r2(box.h + grows.t + grows.b) : box.h;
      const withGrowth = grows && !grows.bad && (gw !== box.w || gh !== box.h);
      notes.push(`${w}×${h}  agreed box${withGrowth ? ` + growth ${growsText(grows)}` : ''}  centre ${cx},${cy}`);
      if (Math.abs(w - gw) > 0.01 || Math.abs(h - gh) > 0.01)
        errors.push(`declares box ${box.w}x${box.h}${withGrowth ? ` + growth ${growsText(grows)}` : ''} but the ink is ${w}×${h} — the agreed size and the drawing disagree`);
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
    if (Math.abs(cx - mid) > 0.5 || Math.abs(cy - mid) > 0.5) (anchor?.held ?? base?.held ?? warnings).push(`off-centre at ${cx},${cy}`);
  }

  // --- 4b. advisory: bends tighter than half the stroke (C10) --------------
  // Below R = weight / 2 the inner corner stays a notch and the corner reads heavier.
  // `bendMin` takes THIS file's weight, so the floor is per master and per style:
  // 0.75 for an outline at 1.5, 0.625 at 1.25, 1.25 for a filled line icon at 24.
  // A dot (one CLOSED circle drawn as two arcs) is not a bend: under half the stroke it is a
  // solid disc. Every closed two-arc path is skipped, rings included: a ring's radius is over half
  // its stroke, so its arcs could never reach the floor anyway (its hole is 5f's). `isDot` lives in geometry.mjs so lint, build and the lab share one test — an
  // open two-arc path is a bend (a bowl running into a tuck), checked like any other, and in a
  // glyph mark it is the body, not the dot (C19). A solid key — a closed path no wider than its
  // stroke, so the stroke leaves no counter (calculator's tall key) — is a dot drawn long: its
  // arcs are round ends, not bends (`isSolidStroke`, 2026-10-19).
  ds.forEach((d, i) => { if (!isDot(d) && !isSolidStroke(d, W[i])) for (const { cmd, args } of parsePath(d)) {
    if (cmd.toUpperCase() !== 'A') continue;
    for (let k = 0; k + 7 <= args.length; k += 7)
      if (Math.min(args[k], args[k + 1]) < bendMin(W[i]) - 0.005)
        warnings.push(`bend radius ${args[k]} is under half the stroke (${bendMin(W[i])}) — the corner reads uneven (C10)`);
  } });

  // --- 5. advisory: near-collisions between separate paths ---------------
  // §6 asks MIN_GAP (1.5 units) between any two stroke edges, at every master —
  // the floor does not thin with the line, so a lighter master just leaves more
  // air. Only the conversion from centreline distance to edge gap is per master:
  // it subtracts half of each path's own weight (one weight per file, bar a C32 numeral or letter).
  // C19 carves out one case:
  // in a file that declares `<!-- glyph: dot -->`, the pair {dot, body} is the inside
  // of one character and floors at GLYPH_GAP instead. The dot's clearance to the
  // silhouette (the path spanning the whole ink box) is not that pair, and keeps MIN_GAP.
  // The dot is a SOLID one (`isSolidDot`, at its own weight): a ring is not a character's dot.
  // (`glyph: numeral` does not reach this loop: a numeral's clearance to the next numeral and
  // to its list line is between separate paths, and keeps MIN_GAP. Nor does `glyph: letter`.)
  // C33 (`<!-- badge: line -->`, 2026-10-19): the base is cut back by hand with 1.5 of air from
  // the badge's own ink, so a badge-to-base pair floors at MIN_GAP, each side at its own weight,
  // and the file's `gap` note — agreed for the base's own runs — never reaches it; the badge's
  // own paths keep MIN_GAP too. A badge that touches or crosses its base has no air at all, so
  // it warns instead of passing as a join. The tightest badge-to-base air is printed (5g).
  // ARMS THAT CROSS (2026-10-20, docs/01 §6): two paths that cross join by design, but where
  // two neighbouring arms meet at under 86 degrees, tip to tip, the wedge between them fills
  // in at 16 when the arms are short (password-3 shipped 0.62 of air at 16). `armTipGap`
  // measures the tip air at equal reach: the shorter arm's cap centre, r from the crossing,
  // to the point r along its neighbour, less half of each weight. A character's own arms floor
  // at GLYPH_GAP (C19, 2026-10-20): under `glyph: dot` any two paths but the silhouette, as the
  // pair above reads the glyph; under `glyph: numeral` one path crossing itself only, since a
  // numeral's clearance to the next numeral and to its line is between separate paths and keeps
  // MIN_GAP. Everything else floors at this file's agreed gap, else MIN_GAP; a C33 badge's own
  // arms keep MIN_GAP (a badge crossing its base already warns that they meet). Right-angle crossings, arrowheads, single-path
  // bends and T-joins are not judged, and nor is a short overhang whose cap sits inside its
  // neighbour's ink (store at 16). One reading per pair of paths, the tightest: judged in the
  // crossing branch below, and after the loop for a path that crosses itself. WARNINGS.
  const sampled = ds.map(samplePath);
  const spans = ds.map((d) => bbox([d]));
  const whole = ds.length ? bbox(ds) : null;
  const isShell = (b) => whole && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(b[k] - whole[k]) < 0.01);
  let badgeAir = Infinity;   // the tightest air between the badge and its base, for 5g
  const tips = armTipGap(ds, W, areas, { weight: STROKE });   // each path at its own weight (C32, C33)
  const armsAt = new Map(tips.cross.map((t) => [t.paths.join('/'), t]));
  const judgeArms = ({ paths: [i, j], angle, gap: g, at }) => {
    if (!!inBadge[i] !== !!inBadge[j]) return;   // badge on base: it already warns that they meet
    const onBadge = !!inBadge[i];
    const inGlyph = !onBadge && (isGlyph ? !isShell(spans[i]) && !isShell(spans[j]) : isNumeral && i === j);
    const floor = onBadge ? MIN_GAP : inGlyph ? GLYPH_GAP : GAP;
    if (!inGlyph && !onBadge) measured.push(r2(g));
    if (inGlyph && isNumeral) numeralMin = Math.min(numeralMin, r2(g));
    if (g < floor - 0.01)
      warnings.push(`${i === j ? `path ${i + 1} crosses itself` : `paths ${i + 1}/${j + 1} cross`} at ${Math.round(angle)}° with ${r2(g)} of air at the arm tips at ${at.join(',')} — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : !onBadge && gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
  };
  const crossed = (i, j) => { const t = armsAt.get(`${i}/${j}`); if (t) { armsAt.delete(`${i}/${j}`); judgeArms(t); } };
  for (let i = 0; i < sampled.length; i++) for (let j = i + 1; j < sampled.length; j++) {
    const onBadge = !!inBadge[i] || !!inBadge[j], toBase = !!inBadge[i] !== !!inBadge[j];
    const met = `paths ${i + 1}/${j + 1} meet — C33 cuts the base back with ${MIN_GAP} of air from the badge's ink`;
    if (crosses(sampled[i], sampled[j])) { if (toBase) warnings.push(met); else crossed(i, j); continue; } // paths that cross (x, plus) join by design; their arms' tips are judged
    // the badge is read first, so no badge path ever takes the glyph's floor of 1 (and a ring
    // badge beside `glyph: dot` is not the glyph's dot either way: it is not solid)
    const glyphPair = !onBadge && isGlyph && isSolidDot(ds[i], W[i]) !== isSolidDot(ds[j], W[j]) && !isShell(spans[i]) && !isShell(spans[j]);
    const floor = onBadge ? MIN_GAP : glyphPair ? GLYPH_GAP : GAP;
    const pen = (W[i] + W[j]) / 2;   // half of each path's own weight (C32, C33)
    const need = floor + pen; // centreline distance that leaves `floor` between the two edges
    // Point-to-SEGMENT, both ways: point-to-point read a stem standing on a bar as 0.13
    // apart whenever the bar's samples straddled the stem (info-3 at 16, on the eighth grid).
    const min = Math.min(polyGap(sampled[i], sampled[j]), polyGap(sampled[j], sampled[i]));
    if (min <= 0.1) { if (toBase) warnings.push(met); continue; }
    if (toBase) badgeAir = Math.min(badgeAir, r2(min - pen));
    if (!glyphPair && !onBadge) measured.push(r2(min - pen));
    if (min < need - 0.01)
      warnings.push(`paths ${i + 1}/${j + 1} are ${r2(min)} apart — ${glyphPair ? 'C19 glyph gap' : toBase ? 'C33 badge air' : !onBadge && gap ? `agreed gap ${gap.n}` : '§6'} needs ${need} (edge gap ${r2(min - pen)} < ${floor})`);
  }
  // a path crossing itself, and any crossing the sampled test above did not see
  for (const t of armsAt.values()) judgeArms(t);

  // --- 5b. advisory: a path coming too close to ITSELF ---------------------
  // §6's corollary "no enclosed shape smaller than 1.5 units across" was not in code
  // before this loop (2026-09-18), and the pair loop above cannot see it: both ends of one stroke, and a
  // counter drawn by one curling path, belong to a single `d`. `selfGap` judges a
  // pair of points only once the path between them has turned past 180 degrees, so a
  // C10 bend — which legitimately brings its own tangent points 1.06 apart — is never
  // flagged, while a mouth that has closed up is. A closed path has no mouth (`selfGap` returns
  // null for it), so a closed two-arc path is not even read here: a dot is solid, and a ring's
  // hole is measured in 5f, with the inside of every other closed path (its necks in 5f, its
  // widest circle in 5i).
  // Caught by eye and not by lint before this existed: help-4's 16 shipped a 0.30 mouth.
  // C19 extends here: in a file that declares `<!-- glyph: dot -->`, a mark's own
  // opening - the mouth of a `?`, of an `!`, of an `i` - is the inside of one
  // character and floors at GLYPH_GAP, for the same reason its dot gap does. §6's
  // one-stroke floor was written for parallel runs and repeated elements; applied
  // inside a letter it hollows it out. The container ring is not part of the
  // character and keeps MIN_GAP (it is a closed circle, so it has no mouth anyway).
  // Extended 2026-09-26 to `<!-- glyph: numeral -->`: a numeral's own opening (the mouth of
  // a 2 between its entry terminal and its neck) floors at GLYPH_GAP too. At 16 a 2 is about
  // four strokes tall, and holding that mouth at 1.5 laid its diagonal down to 25-30 degrees.
  // Every path in the file is read this way, the silhouette included - a numeral drawn on its
  // own IS the silhouette, and the lines beside one are straight, so they have no opening.
  // `selfGap` is handed the path's own stroke, so it reads edge-to-edge at any master.
  // A C33 line badge's own openings (the mouth of an open path) keep MIN_GAP: the file's `gap`
  // note is the base's. The inside of a key's bow is closed, so it is 5f's, not this loop's.
  // `glyph: letter` (C32, 2026-10-20) is NOT read as a glyph here or in 5f: it carries the weight
  // and nothing else, so a letter's openings keep §6, or the file's `gap` note, like any path.
  const read5b = [];           // what 5b measured per path, so 5f does not warn on the same neck twice
  for (let i = 0; i < ds.length; i++) {
    if (isDot(ds[i])) continue;
    const self = selfGap(ds[i], W[i]);
    read5b[i] = self;
    if (!self) continue;
    const inGlyph = !inBadge[i] && ((isGlyph && !isShell(spans[i])) || isNumeral);   // the badge first, as in §5
    const floor = inBadge[i] ? MIN_GAP : inGlyph ? GLYPH_GAP : GAP;
    if (!inGlyph && !inBadge[i]) measured.push(self.gap);
    if (isNumeral) numeralMin = Math.min(numeralMin, self.gap);
    if (self.gap < floor - 0.01)
      warnings.push(`path ${i + 1} comes within ${self.gap} of itself at ${self.at.join(',')} — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : !inBadge[i] && gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor} (it turns ${self.span}°)`);
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
  // `glyph: numeral` does not reach here: a numeral stroked in the filled twin has its
  // openings read by 5b, and one painted as a shape (sort-numeric's 0 and 9) has its hole
  // read as air in 5f and 5i; no numeral has been knocked out of a shape yet.
  if (areas.length && ds.length === 0) {
    const left = materialGap(areas);
    const floor = isGlyph ? GLYPH_GAP : MIN_GAP;
    // Printed whenever there is a reading, so a drawing that stops being measured (the
    // measure returns null when no cut faces itself) shows up as a line that went missing.
    if (left) notes.splice(-1, 0, `knockout leaves ${left.gap} at ${left.at.join(',')}`);
    if (left && left.gap < floor - 0.01)
      warnings.push(`the knockout leaves ${left.gap} of material between two parts of itself at ${left.at.join(',')} — ${isGlyph ? 'C19 glyph gap' : '§6'} needs ${floor}: a knockout may not be cut wider than the counter it sits in`);
  }

  // --- 5f. advisory: walls facing each other across air, where 5–5c cannot see ---
  // (docs/08 §6.5; plans/facing-gap.md.) Two holes were left. A CLOSED stroked path is not
  // judged against itself by 5b (its turn gate would read a ring's diameter as a counter),
  // so the inside of a collar or a knob's neck could close up unseen — `paintbrush` shipped
  // 1.22 of air inside its collar at 16. And a shape-filled drawing's AIR — a cut's own
  // width, a notch, the band between a hole and its island, a shape to a line — was not
  // measured at all (5c reads only the material a cut leaves). `facingGap` reads both on
  // the ink's edges: a span counts when it is square-on to both walls, which is what keeps
  // a bend's inside from reading as a gap. An open single stroke stays 5b's (a path that
  // ends where it starts is closed, Z or not); two different stroked paths stay §5's; a neck
  // 5b already read inside a path of several subpaths is not warned twice. A path's own air
  // floors as in 5b: GLYPH_GAP inside a declared glyph, else this file's agreed gap, else
  // MIN_GAP. Air touching a shape floors at the agreed gap, else MIN_GAP: a filled glyph's
  // own openings are material, not air, and 5c reads them. WARNINGS (plan, 2026-09-28).
  // A NUMERAL'S OWN HOLE (C19, Maruti 2026-10-20): a numeral painted as a shape (sort-numeric's
  // filled 0 and 9) is the paint, so the hole in it is its own opening, not a line punched out.
  // Under `glyph: numeral` a `cut` — both walls one hole of one shape — floors at GLYPH_GAP, as
  // §5i floors the same hole, and is the note's reading (5e), not the agreed gap's (5d). A notch,
  // a separation and a shape-to-line span keep this file's agreed gap, else MIN_GAP: numeral to
  // numeral and numeral to line are clearances, not the inside of one character. Under
  // `glyph: dot` a cut keeps them too: a dot glyph is knocked out of its silhouette, so its cut is
  // the character's own line (C22's 1.5), and its openings are the material 5c floors at 1.
  // A C33 line badge's own air keeps MIN_GAP, as in 5b.
  // A RING (2026-10-20) — a closed two-arc circle wider than half its stroke: a key's bow, a ring
  // badge, a keyhole, a `-circle` ring — is measured exactly, its hole 2r − w across (`ringHole`).
  // Until then every closed two-arc path was skipped here as a dot, so a hole under 1.5 passed
  // silently and closed up at 16 (passkey-2's first filled key: its bow went solid). It floors at
  // this file's agreed gap, else MIN_GAP, and a badge's at MIN_GAP — not at C19's 1: a ring is
  // not a character's opening, and C19 keeps the pairs it names. Bar a numeral's (2026-10-20):
  // under `glyph: numeral` a ring is the numeral's own hole (a round 0, a 9's bowl closed with Z)
  // and floors at GLYPH_GAP, as the same bowl left open does here and in 5i — whether the drawer
  // closed it with Z must not move its floor. A solid dot has no air at all.
  // (`ringHole` reads the absolute `M…A…A…Z` form every ring in the set is written in; a ring
  // written with `a` or `z`, or with an arc SVG has to scale up, falls to `facingGap` below,
  // which reads the same hole but, in a glyph file, floors it as a character's opening.)
  // Any other closed two-arc path (globe's meridians, database's lid, the moon) is read by
  // `facingGap` below like any closed path.
  // What 5f warned on, and where, so 5i does not warn a second time on the same white.
  const warned5f = { ring: new Set(), self: [], area: [] };
  {
    const air = facingGap(ds, W, areas);   // each path at its own weight (C32, C33)
    const shut = (sub) => { const p = samplePath(sub); return p.length > 2 && Math.hypot(p.at(-1)[0] - p[0][0], p.at(-1)[1] - p[0][1]) < 0.01; };
    const rings = ds.map((d, i) => ringHole(d, W[i]));   // each path at its own weight
    rings.forEach((ring, i) => {
      if (!ring) return;
      const own = isNumeral && !inBadge[i];   // a numeral's own hole (see above)
      const floor = inBadge[i] ? MIN_GAP : own ? GLYPH_GAP : GAP;
      if (own) numeralMin = Math.min(numeralMin, ring.hole); else if (!inBadge[i]) measured.push(ring.hole);
      if (ring.hole < floor - 0.01) {
        warned5f.ring.add(i);
        warnings.push(`path ${i + 1} is a ring with a hole ${ring.hole} across at ${ring.at.join(',')} — ${own ? 'C19 numeral gap' : !inBadge[i] && gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor} (radius ${ring.r} at stroke ${W[i]})`);
      }
    });
    for (const { path, gap: g, at } of air.self) {
      const d = ds[path], subs = subpathsOf(d);
      if (rings[path] || isSolidDot(d, W[path])) continue;              // read exactly above; a dot has no air
      if (subs.length === 1 && !shut(subs[0])) continue;                // 5b reads it
      if (read5b[path] && read5b[path].gap <= g + 0.02) continue;        // 5b read this neck
      const inGlyph = !inBadge[path] && ((isGlyph && !isShell(spans[path])) || isNumeral);   // the badge first, as in §5
      const floor = inBadge[path] ? MIN_GAP : inGlyph ? GLYPH_GAP : GAP;
      if (!inGlyph && !inBadge[path]) measured.push(g);
      if (inGlyph && isNumeral) numeralMin = Math.min(numeralMin, g);   // a 9's bowl left open (no Z) is read here
      if (g < floor - 0.01) {
        warned5f.self.push({ path, at });
        warnings.push(`path ${path + 1} faces itself across ${g} of air at ${at.join(',')} — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : !inBadge[path] && gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
      }
    }
    const AIR = { cut: 'across one cut-out', notch: 'in a notch of the outer edge', separation: 'between two filled edges', line: 'between a shape and a line' };
    for (const { kind, gap: g, at } of air.area) {
      const own = isNumeral && kind === 'cut';   // a numeral's own hole (see above)
      const floor = own ? GLYPH_GAP : GAP;
      if (own) numeralMin = Math.min(numeralMin, g); else measured.push(g);
      if (g < floor - 0.01) {
        warned5f.area.push(at);
        warnings.push(`${g} of air ${AIR[kind]} at ${at.join(',')} — ${own ? 'C19 numeral gap' : gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
      }
    }
  }

  // --- 5h. advisory: arms traced as one filled shape --------------------------
  // A filled twin that traces its outline's crossing arms as one evenodd shape (password-2-filled,
  // 2026-10-20) has no centrelines to cross, so §5 cannot read it and 5f cannot either (a notch's
  // walls meet at an angle, never square-on). `armTipGap` rebuilds a white notch under 86 degrees
  // whose two walls both end in a round tip into two arms, and reads the same tip air the
  // outline's crossing gives, against the floors §5 gives crossing arms: a character's own arms
  // take GLYPH_GAP — under `glyph: dot` any shape but the silhouette (the one spanning the whole
  // ink box), under `glyph: numeral` any notch, since a notch is always within one shape — and
  // everything else this file's agreed gap, else MIN_GAP. No notch can be a C33 badge's: a line
  // badge is drawn as strokes at its own weight, which only a line-heavy file (no shapes) allows,
  // so a badge's arms are §5's and keep MIN_GAP there. Any other notch (a cut-out corner, a
  // sliver with no tips) is not read. WARNINGS.
  for (const { area, angle, gap: g, at } of tips.notch) {
    const own = bbox([areas[area]]);
    const silhouette = ink && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(own[k] - ink[k]) < 0.01);
    const inGlyph = isGlyph ? !silhouette : isNumeral;
    const floor = inGlyph ? GLYPH_GAP : GAP;
    if (!inGlyph) measured.push(r2(g));
    if (inGlyph && isNumeral) numeralMin = Math.min(numeralMin, r2(g));
    if (g < floor - 0.01)
      warnings.push(`a filled shape's arms meet at ${Math.round(angle)}° with ${r2(g)} of air at the arm tips at ${at.join(',')} — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
  }

  // --- 5i. advisory: the inside air of one closed shape ------------------------
  // docs/01 §6's corollary "no enclosed shape smaller than 1.5 units across", measured as Maruti
  // agreed it (2026-10-20): the diameter of the widest circle that fits in the white ONE closed
  // shape leaves inside itself (`insideAir`) — a closed stroked subpath, less its own path's ink and
  // anything a shape paints there (outline files, and line-weight paths in filled ones), and a hole
  // in a filled file, less any island. It is taken over the whole interior, so a long sliver reads
  // its width and a triangle's sharp inner corners never decide it: its incircle does. 5f reads a
  // neck square-on, and inside a wedge or a small triangle it reads nothing (`rewind-2`'s trailing
  // triangle held 1.07 at 16 and 20, `video-3`'s play 1.13 at 20, and lint was silent); this reads
  // the room. White closed in by SEVERAL strokes (a dog-ear, an outline A's counter) is not read:
  // Maruti deferred it to its own census. Floors: a path's air as 5b and 5f floor it (GLYPH_GAP
  // inside a declared glyph, a C33 badge's MIN_GAP, else this file's agreed gap, else MIN_GAP); a
  // hole as §5h floors a filled shape's notch (GLYPH_GAP for a character's own shape — under `glyph:
  // dot` any shape but the silhouette, under `glyph: numeral` any — else the agreed gap, else
  // MIN_GAP). One line per interior: where 5f already warns on the same white — this path's ring
  // (`ringHole` reads its hole exactly, 2r − w, which is what this reads), this path facing itself,
  // or air touching a shape — with its reading inside this shape, nothing is added. No floor is over
  // MIN_GAP, so a shape proven to hold MIN_GAP − 0.01 is not searched further (`cap`). WARNINGS.
  {
    const inside = insideAir(ds, W, areas, { cap: MIN_GAP - 0.01 });   // each path at its own weight (C32, C33)
    const here = (sub) => (p) => encloses(sub, p);
    for (const { path, sub, air, at } of inside.paths) {
      const subs = subpathsOf(ds[path]), mine = here(subs[sub]);
      if (warned5f.ring.has(path) || warned5f.self.some((w) => w.path === path && mine(w.at)) || warned5f.area.some(mine)) continue;
      const inGlyph = !inBadge[path] && ((isGlyph && !isShell(spans[path])) || isNumeral);   // the badge first, as in §5
      const floor = inBadge[path] ? MIN_GAP : inGlyph ? GLYPH_GAP : GAP;
      if (!inGlyph && !inBadge[path]) measured.push(r2(air));
      if (inGlyph && isNumeral) numeralMin = Math.min(numeralMin, r2(air));
      if (air < floor - 0.01)
        warnings.push(`path ${path + 1}${subs.length > 1 ? ` (subpath ${sub + 1})` : ''} leaves ${r2(air)} of air inside itself at ${at.join(',')} (the widest circle that fits) — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : !inBadge[path] && gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
    }
    for (const { area, sub, air, at } of inside.holes) {
      if (warned5f.area.some(here(subpathsOf(areas[area])[sub]))) continue;
      const own = bbox([areas[area]]);
      const silhouette = ink && ['x0', 'y0', 'x1', 'y1'].every((k) => Math.abs(own[k] - ink[k]) < 0.01);
      const inGlyph = isGlyph ? !silhouette : isNumeral;
      const floor = inGlyph ? GLYPH_GAP : GAP;
      if (!inGlyph) measured.push(r2(air));
      if (inGlyph && isNumeral) numeralMin = Math.min(numeralMin, r2(air));
      if (air < floor - 0.01)
        warnings.push(`a cut-out leaves ${r2(air)} of air inside it at ${at.join(',')} (the widest circle that fits) — ${inGlyph ? `C19 ${isNumeral ? 'numeral' : 'glyph'} gap` : gap ? `agreed gap ${gap.n}` : '§6'} needs ${floor}`);
    }
  }

  // --- 5d. is the agreed gap still doing anything? ------------------------
  // The note lowers the floor, so it has to earn its place: if nothing the checks above
  // measure under it (§5 with its crossing arms, §5b, §5f, §5h and §5i) comes closer than §6's own floor, the drawing no longer needs it and
  // the note is stale — an ERROR, so it is deleted rather than left to excuse a future
  // change nobody agreed. Otherwise it is in force, and says so the way `grows` does.
  if (gap) {
    const smallest = measured.length ? Math.min(...measured) : Infinity;
    if (smallest >= MIN_GAP - 0.01)
      errors.push(`declares gap ${gap.n} but nothing in this drawing comes within §6's ${MIN_GAP}${Number.isFinite(smallest) ? ` (smallest measured ${smallest})` : ''} — the note is not needed; delete it`);
    else if (smallest >= gap.n - 0.01)
      notes.splice(-1, 0, `agreed gap ${gap.n} — smallest measured ${smallest}`);
  }

  // --- 5e. is the numeral note doing anything here? --------------------------
  // `glyph: numeral` is written by the board into all six files of an icon, and at 24 a
  // numeral's opening usually clears §6 on its own, so a note with nothing under 1.5 is
  // not an error the way a stale `gap` is: it says so in an info line, and is in force
  // (with its reading) wherever an opening does fall below §6. Where a path carries the
  // outline weight (C32), the note is in use for that, and the line says so. The reading is
  // the tightest of every check that floors at GLYPH_GAP under the note — a path's own
  // opening (5b), its own air and a numeral's hole (5f), the widest circle inside one closed
  // shape (5i), and a numeral's own crossing arms (5, 5h) — not 5b's alone (2026-10-20: a
  // 9's bowl left open, read in 5f, and a filled 0's hole printed "not in use").
  if (isNumeral)
    notes.splice(-1, 0, numeralMin < MIN_GAP - 0.01
      ? `C19 numeral opening ${numeralMin} — floor ${GLYPH_GAP}, not §6's ${MIN_GAP}`
      : `glyph: numeral — ${glyphed.length ? 'its opening floor is ' : ''}not in use here (${Number.isFinite(numeralMin) ? `smallest opening ${numeralMin}` : 'no opening measured'}, §6's ${MIN_GAP} already holds)${glyphed.length ? '; the note is in use for the numeral\'s weight (C32)' : ''}`);

  // --- 5g. the badge's air, said ----------------------------------------------
  // C33's cut-back is done by hand, so the number it was cut to is printed beside the drawing,
  // the way an agreed gap is: each side at its own weight, measured as §5 measures it.
  if (badged.length)
    notes.splice(-1, 0, Number.isFinite(badgeAir)
      ? `line badge to base: tightest air ${badgeAir} (C33, floor ${MIN_GAP})`
      : 'line badge to base: no base path clear of it to measure (C33)');

  // `paths` (whitespace-normalised) lets checkAnchors count what a member shares with its anchor.
  const paths = [...ds, ...areas].map(normPath);
  return { file, errors, warnings, notes, size, inner, isMark, ink, grows, gap, anchor, base, paths };
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

// --- 8b. C33 composites: a declared base keeps its place under the badge ---------------
// Like `checkAnchors`, it reads the whole map, so the base is looked up in whatever set of files
// is being linted: src/icons for `npm run check`, the candidate plus its base for draft-check.
// Same master, same style: `password-lock.svg` is held to `password.svg`, `-filled` to `-filled`.
// One file cannot tell its base's ink from its badge's, so the corner is read from the boxes: the
// badge stands out from the base on its own corner (bottom-right, C33) and leaves the base's box
// edges on the far side untouched, so the composite's ink must HOLD the base's box and share its
// LEFT and TOP edges. Two adjacent edges pin the base on both axes; any other corner could be the
// badge's own (a composite moved up by exactly the badge's overhang shares the bottom corners).
// Adds to the results in place.
const EDGES = ['l', 't', 'r', 'b'];
// The corner away from the badge. C33 fixes the badge on the bottom-right, so the base's left and
// top edges must stay exactly where they are; any other shared corner could be the badge's own
// (a whole composite moved up by the badge's overhang still shares the bottom corners: review, 2026-10-20).
const BASE_CORNER = ['l', 't'];
const listed = (ks) => ks.map((k) => SIDES[k]).join(', ').replace(/, ([a-z]+)$/, ' and $1');
// "2.5 below centre", "1 right of centre", "2.5 below and 1 right of centre", "on centre"
export const offsetText = ([dx, dy]) => {
  const parts = [];
  if (Math.abs(dy) > 0.005) parts.push(`${r3(Math.abs(dy))} ${dy > 0 ? 'below' : 'above'}`);
  if (Math.abs(dx) > 0.005) parts.push(`${r3(Math.abs(dx))} ${dx > 0 ? 'right of' : 'left of'}`);
  return parts.length ? `${parts.join(' and ')} centre` : 'on centre';
};
export function checkBases(results) {
  for (const [key, r] of results) {
    if (!r.base) continue;
    const [m, f] = key.split('/');
    const { name, held = [], off = [0, 0] } = r.base;
    const baseFile = `${name}${f.endsWith('-filled.svg') ? '-filled' : ''}.svg`;
    const a = results.get(`${m}/${baseFile}`);
    if (!a) {
      r.errors.push(`keeps ${name}'s place, but there is no \`${baseFile}\` at ${m} to hold it to — the base ships before its composites, or with them (C33)`);
      r.warnings.push(...held);   // no base after all: it answers to the centre like any icon
      continue;
    }
    if (!a.ink) {
      r.errors.push(`keeps ${name}'s place, but \`${baseFile}\` at ${m} has no ink to hold it to (C33)`);
      r.warnings.push(...held);
      continue;
    }
    if (!r.ink) { r.warnings.push(...held); continue; }   // lintSource has already said "no <path> found"
    const out = {   // outward on every side: + is composite ink standing past the base's box
      l: a.ink.x0 - r.ink.x0, r: r.ink.x1 - a.ink.x1, t: a.ink.y0 - r.ink.y0, b: r.ink.y1 - a.ink.y1 };
    const short = Object.keys(SIDES).filter((k) => out[k] < -0.01);
    if (short.length) {
      r.errors.push(`ink ${fmtBox(r.ink)} does not hold ${name}'s ${fmtBox(a.ink)}: it stops short on the ${short.map((k) => `${SIDES[k]} by ${r3(-out[k])}`).join(', ')} — the base keeps its drawing and its place under the badge (C33)`);
      continue;
    }
    const shared = EDGES.filter((k) => Math.abs(out[k]) <= 0.01);
    if (!BASE_CORNER.every((k) => shared.includes(k))) {
      r.errors.push(`ink ${fmtBox(r.ink)} does not keep ${name}'s top-left corner ${fmtBox(a.ink)} (${shared.length ? `shares only its ${listed(shared)} edge${shared.length > 1 ? 's' : ''}` : 'shares no edge at all'}) — the base has moved; C33 puts the badge bottom-right and keeps the base in place, so its left and top edges stay on ${name}'s`);
      continue;
    }
    r.notes.splice(-1, 0, `keeps ${name}'s place: ${listed(shared)} edges shared, ${offsetText(off)} (C33)`);
  }
  return results;
}

// --- 9. state twins (C34): the other state is drawn for every numbered shape of its base ---
// Which side of a state-twin pair (masters.mjs STATE_TWINS) a name is a numbered shape of, and
// the name across from it: `lock-3` ↔ `unlock-3`, `lock` ↔ `unlock`. The number names the shape
// (C9); a word after it (`unlock-swung`, a later `unlock-3-swung`) is a second picture of the
// state, not a shape, and is never asked for. A size (C8) and a filled twin are not shapes either.
// Returns null, or {twin, base, side: 'twin' | 'base', counterpart}.
export function stateShape(name, twins = STATE_TWINS) {
  if (isFilled(name) || sizeOf(name)) return null;
  for (const [twin, base] of Object.entries(twins)) for (const [side, other] of [[twin, base], [base, twin]]) {
    const m = name.match(new RegExp(`^${side}(-\\d+)?$`));
    if (m) return { twin, base, side: side === twin ? 'twin' : 'base', counterpart: other + (m[1] ?? '') };
  }
  return null;
}

// Like `checkPairs`, it reads the whole map and adds to the results in place, per master. A base
// is only asked for its twin once the twin has been started (any of its shapes at any master), so
// `lock` alone is clean; a twin always needs its base. Read on outline files only: a filled twin
// is `checkPairs`' to find, so a missing icon warns once per master, not twice. WARNINGS.
export function checkTwins(results, twins = STATE_TWINS) {
  const started = new Set();
  for (const key of results.keys()) {
    const s = stateShape(key.split('/')[1].replace('.svg', ''), twins);
    if (s?.side === 'twin') started.add(s.twin);
  }
  for (const [key, r] of results) {
    const [m, f] = key.split('/'), name = f.replace('.svg', '');
    const s = stateShape(name, twins);
    if (!s || (s.side === 'base' && !started.has(s.twin)) || results.has(`${m}/${s.counterpart}.svg`)) continue;
    r.warnings.push(s.side === 'base'
      ? `no state twin \`${s.counterpart}.svg\` at ${m} — \`${s.twin}\` is drawn for every numbered shape of \`${s.base}\`, so \`${name}\` needs \`${s.counterpart}\` (C34)`
      : `no base shape \`${s.counterpart}.svg\` at ${m} — a state twin is drawn on its base's body, so \`${name}\` needs \`${s.counterpart}\` (C34)`);
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

// --- 8b. C33 composites: a declared base keeps its place under the badge ---
checkBases(results);

// --- 9. state twins (C34): every numbered shape of a base has its twin, and back ---
checkTwins(results);

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
