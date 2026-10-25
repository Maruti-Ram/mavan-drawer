// The three drawn masters. One source of truth for lint, build and the lab.
// All sizes are OUTER ink dimensions — they include the stroke. See
// docs/01-foundations.md §2 and §4.

// Outline stroke, PER MASTER. C7 (amended 2026-09-20): the 16 master draws at
// 1.25 — a lighter line beside 16px text (6.3% · 7.5% · 7.8% of the canvas) —
// and 24 and 20 stay at 1.5. The grid, the decimal allowance, C10's bend
// minimum, lint's root check and queue.mjs's writer are all derived from this
// table. The gap floor is not (below). Conversion record: plans/stroke-16.md.
export const STROKES = { 24: 1.5, 20: 1.5, 16: 1.25 };
export const strokeOf = (master) => STROKES[master];

// Filled style of a LINE-HEAVY icon (plus, check, arrows: nothing encloses an
// area) shows weight by a heavier stroke, never a background. Locked 2026-09-17.
// Heavier at 24, where 1.5 is lightest (6.3%), so every master lands near
// 10–12.5% of its canvas. Steps of +0.5 keep pulled-in ends on the quarter grid.
// 16 stays at 2 when its outline goes to 1.25 (Maruti, 2026-09-20): the contrast
// becomes 1.6×, matching 24's 1.67×, and no filled line file has to be redrawn.
// Every other icon fills its shapes and keeps the outline stroke for any line.
// C32 (2026-10-17): a numeral inside a line-heavy icon keeps the OUTLINE weight in the
// filled file (`<!-- glyph: numeral -->`, its path carrying `stroke-width`; lint §2b); so
// does a letter since 2026-10-20 (`<!-- glyph: letter -->`, translate's A and 文), and a currency sign
// since 2026-10-22 (the same note, first currency-convert's $).
// C33 (2026-10-19): so does a LINE badge on a line-heavy base (`<!-- badge: line -->`,
// first passkey-2's key on fingerprint's print), its air to the base floored at MIN_GAP.
export const FILLED_WEIGHT = { 24: 2.5, 20: 2, 16: 2 };
export const isFilled = (file) => /-filled(\.svg)?$/.test(file);
export const weightOf = (file, master) => (isFilled(file) ? FILLED_WEIGHT[master] : strokeOf(master));

// C1 (Maruti, 2026-10-24): every corner of a FILLED cut-out's white rounds at no less than the
// outline's inside-corner radius (a container's centreline radius less half the stroke) — what the
// set's filled cut-outs already use (home's door, printer's tray, save's shutter). Lint §5k warns
// below it; slits, a declared glyph's counters and corners against a line-weight wall are exempt.
export const CUT_CORNER = { 24: 0.75, 20: 0.5, 16: 0.375 };

// C10: a bent mark's corner is an arc of radius half the weight it is drawn at —
// the tightest bend whose inner corner still reads as even width. It follows the
// weight, so it is per master AND per style: 0.75 for an outline at 24 and 20
// (0.625 at 16), 1.25 · 1 · 1 for a line-heavy filled file.
export const bendMin = (weight) => weight / 2;

export const MASTERS = {
  24: {
    bound: [2, 22],                       // margin edge — nothing crosses it; a -large mark (C8) and a modifier badge (C33) may reach it
    keylines: { square: [18, 18], circle: [20, 20], portrait: [16, 20], landscape: [20, 16], diagonal: [20, 20] },
    mark: 18,                             // ceiling for directional marks
  },
  20: {
    bound: [2, 18],
    keylines: { square: [14, 14], circle: [16, 16], portrait: [12, 16], landscape: [16, 12], diagonal: [16, 16] },
    mark: 14,
  },
  16: {
    bound: [1, 15],
    keylines: { square: [12, 12], circle: [14, 14], portrait: [10, 14], landscape: [14, 10], diagonal: [14, 14] },
    mark: 12,
  },
};

// Size variants (C8): `<name>-large` and `<name>-small` beside the default.
// Each size is 12.5% of the canvas longer than the next one down, at every
// master, so the family reads as three sizes at 24, 20 and 16 alike. A -large
// mark may run to the margin edge; every other mark stays under `mark`.
export const SIZE_STEP = { 24: 3, 20: 2.5, 16: 2 };
export const SIZES = ['small', null, 'large'];
export const sizeOf = (name) => name.match(/-(large|small)(?=-filled$|$)/)?.[1] ?? null;
export const sizeBase = (name) => name.replace(/-(large|small)(?=-filled$|$)/, '');
export const markMax = (name, master) =>
  sizeOf(name) === 'large' ? MASTERS[master].bound[1] - MASTERS[master].bound[0] : MASTERS[master].mark;

// A PLAIN SHAPE's -small (C8, Maruti 2026-10-24: circle-small, square-small, triangle-small,
// hexagon-small, octagon-small) is the whole shape at HALF its default's width, not one SIZE_STEP
// down: the stepped ones read barely smaller ("i was expecting much smaller"). A plain shape has
// no inner mark to shrink, so a container's rule (C18: keep the container) does not reach it
// either. Width, not the longer side: a hexagon's points and a triangle's height follow the shape.
// At 16 the half rounds DOWN to a whole multiple of PLAIN_SMALL_SNAP — an even number of pixels,
// so a centred shape's sides land on whole pixels (circle 14 → 6, not 7). At 24 and 20 it is the
// exact half (square 18 → 9, 14 → 7). Lint's size-family check (`checkFamilies`) warns off it; a
// plain shape's `-large` has no ruling yet.
export const PLAIN_SMALL = 0.5;
export const PLAIN_SMALL_SNAP = { 24: 0, 20: 0, 16: 2 };   // 0 = the exact half
export const plainSmallWidth = (width, master) => {
  const half = width * PLAIN_SMALL, snap = PLAIN_SMALL_SNAP[master];
  // the quotient is read to 3 dp before it is floored, so an ink width of 11.9999 still halves to 6
  return snap ? Math.floor(Math.round((half / snap) * 1000) / 1000) * snap : half;
};

// State twins (C34, 2026-10-19), twin → base: the other state of a toggle is drawn for every
// numbered shape of its base (`unlock-3` for `lock-3`). Lint warns on a missing twin (§9).
// A later twin is one entry: `'eye-off': 'eye'`. `toggle-off` joined 2026-10-20.
export const STATE_TWINS = { unlock: 'lock', 'toggle-off': 'toggle-on', 'cloud-off': 'cloud', 'bug-off': 'bug', 'shield-off': 'shield', 'bell-off': 'bell', 'keyboard-off': 'keyboard', 'video-off': 'video', 'map-pin-off': 'map-pin', 'microphone-off': 'microphone', 'camera-off': 'camera', 'wifi-off': 'wifi', 'phone-off': 'phone', 'eye-off': 'eye', 'bookmark-off': 'bookmark', 'clipboard-off': 'clipboard' };
// Numbered shapes whose state twin Maruti declined (C34 dated note, 2026-10-25): the base ships
// without its `-off`, and lint does not ask for one. Declining is per shape, never per base.
export const NO_TWIN = new Set(['video-2', 'video-4']);

// Minimum gap between any two stroke edges: 1.5 units, at every master and in
// both styles. A LITERAL, deliberately not `strokeOf(master)` — the floor is what
// survives a 16px render, not a fraction of the line. The 16 master's 1.25
// line keeps the 1.5 floor; a thinner line simply leaves more air
// (plans/stroke-16.md: file-text-2's short gap at 16 opened and its warning went).
export const MIN_GAP = 1.5;

// The drawing grid and the decimal ceiling, DERIVED from the master's stroke so
// they flip with it. A container's outer edge lands on a whole pixel only when
// its centreline sits at edge ∓ stroke/2. At stroke 1.5 that half is 0.75, which
// is already on the quarter grid, so 24 and 20 draw on quarters with 2 decimals.
// At 1.25 the half is 0.625: centrelines move to x.375 / x.625, which needs the
// eighth grid and a third decimal.
//
// The allowance is per MASTER, not per file. Two reasons. A quarter is always an
// eighth and 2 dp is always within 3, so every filled file at that master (weight
// 2, untouched by the flip) keeps passing exactly as it does today — the check
// only widens, never tightens. And a shape-filled file whose cut-outs follow a
// 1.25 outline needs eighth-grid values of its own, so splitting the allowance by
// style would fail the very files the conversion has to re-cut.
export const gridFor = (stroke) => (Number.isInteger((stroke / 2) * 4) ? 0.25 : 0.125);
export const decimalsFor = (stroke) => String(gridFor(stroke)).split('.')[1].length;
export const gridNameFor = (stroke) => ({ 0.25: 'quarter', 0.125: 'eighth' })[gridFor(stroke)];
export const gridOf = (master) => gridFor(strokeOf(master));
export const decimalsOf = (master) => decimalsFor(strokeOf(master));
export const gridName = (master) => gridNameFor(strokeOf(master));

// C19. One exception: a glyph mark's detached dot (info-circle's i, help-circle's ?, alert's !)
// is one character, not two elements, so the space between dot and body is a
// counter, not clearance. It floors at GLYPH_GAP — one whole unit, which is one
// pixel at every master's own size, the smallest gap that still holds a clear
// pixel row. Declared per file as `<!-- glyph: dot -->`; it never applies to the
// dot's clearance to a container, and everything else keeps MIN_GAP.
// Extended 2026-09-18: it also floors a glyph's own OPENING - the mouth of a `?`,
// where the hook starts and ends without closing - which `selfGap` measures. Same
// reason: that space is the inside of one character, not clearance between two
// elements. All four question marks measure 1.33-1.45 there at the 16 master.
// Extended 2026-09-20 to the filled twin: what a glyph's knockout leaves standing
// between two parts of the same character (the mouth of a filled `?`, info-3's
// flag-to-bar strip, 1.25 at 16) is that same space seen from the other side, and
// floors here too. Lint measures it on the filled drawing (`materialGap`).
// Extended 2026-09-26 to NUMERALS drawn inside an icon (list-ordered's 1 and 2),
// declared `<!-- glyph: numeral -->`: a numeral's own opening - the mouth of a 2,
// between its entry terminal and its neck - floors here (numeral to numeral and
// numeral to line keep MIN_GAP). Extended 2026-10-20 to a numeral's own HOLE, outline
// or filled, in every check (§5f cuts and rings, §5i), so a 0's or 9's counter floors
// here too. The note covers the whole file: any hole or cut in it floors at 1, so a
// file declares `numeral` only when its holes are the numerals' own. At 16 a 2 is
// about four strokes tall; holding its mouth at 1.5 laid the diagonal down to
// 25-30 degrees (40 at 24), and the 2 read slanted and crooked.
// Extended 2026-10-20 to a character's own CROSSING ARMS (the tip air lint §5 reads with
// `armTipGap`, docs/01 §6): under `glyph: dot` any two paths but the silhouette, under
// `glyph: numeral` one path crossing itself only.
// Not letters or currency signs: `<!-- glyph: letter -->` (C32, 2026-10-20) keeps a letter's weight and nothing
// else; a letter's openings and crossing arms keep MIN_GAP, or the file's gap note (there is no ruling on them,
// and translate's hold 1.5).
export const GLYPH_GAP = 1;

// The air between an arrowhead's leg and the shaft that runs into its point (C37; Maruti, 2026-10-24;
// lint §5l, `headAir`; plans/lint-head-air.md): ONE unit, at every master and in both styles — white
// inside one mark, as GLYPH_GAP's is. At 1 a head still reads as an arrowhead at 16 px, solid when
// filled and open in outline, and the classic head every composite uses sits on it filled at 16
// (1.25 · 1.5 · 1); under it an outline head blots at 16 px, and a shut one turns into a knob at 32.
// A file's `gap` note lowers it where the note is lower, never raises it.
export const HEAD_GAP = 1;
