// The one place a draft candidate turns into shipped SVG text.
//
// `queue.mjs approve` writes these strings to src/icons; `draft-check.mjs`
// lints the same strings in a temp directory without touching the repo. They
// must never drift, so neither one builds the text itself.
//
// The comment notes a file may carry:
//   keyline: mark   the icon is a directional mark, held to the mark ceiling, not a keyline
//   tags:           search words kept beside the name (check-4 → "long sweep"); build.mjs reads them
//   box: WxH        the agreed ink size for this master when the icon keeps a box of its own
//   glyph: dot      one character with a detached dot (i, ?, !); its dot-to-body gap floors at
//                   GLYPH_GAP rather than MIN_GAP (C19)
//   glyph: numeral  numerals drawn inside the icon (list-ordered's 1, 2); each numeral's own
//                   opening (the mouth of a 2) floors at GLYPH_GAP, every gap between separate
//                   paths keeps MIN_GAP (C19, 2026-09-26). A candidate or the board writes
//                   `glyph: 'numeral'`, written into all six files; where no opening falls under
//                   1.5 (usually at 24) lint says the note is not in use, as an info line.
//                   It also lets a numeral keep the OUTLINE weight in a line-heavy filled
//                   drawing (C32, 2026-10-17): a filled entry's `glyph: [d…]` is written as
//                   `<path stroke-width="<outline weight>" d="…"/>` beside the rails at
//                   FILLED_WEIGHT — with a C32 letter or currency sign and a C33 line badge (below), the only
//                   paths that may carry their own weight
//   glyph: letter   FILLED FILES ONLY — letters drawn inside a LINE-HEAVY icon (translate's A and
//                   文, 2026-10-20) keep the OUTLINE weight in the filled drawing, as a C32 numeral
//                   does: a filled entry's `glyph: [d…]` is written the same way, with
//                   `glyph: 'letter'` on the candidate or the board. C32's weight and nothing else:
//                   a letter's openings get no GLYPH_GAP, so with no opening floor to keep it in
//                   use the note is written only into the filled files whose letters carry their
//                   own weight, as `badge: line` is (a letter note elsewhere declares nothing).
//                   A CURRENCY SIGN inside a line-heavy icon is written the same way, with
//                   `glyph: 'letter'` (2026-10-22, first currency-convert's $)
//   badge: line     FILLED FILES ONLY — a C33 line badge (a key, a loop, a plus) on a LINE-HEAVY
//                   base keeps the OUTLINE weight while the base goes to FILLED_WEIGHT (2026-10-19,
//                   first passkey-2: the key on fingerprint's bold print). A filled entry's
//                   `badge: [d…]` is written like a C32 numeral, `<path stroke-width="<outline
//                   weight>" d="…"/>`, verbatim from the outline (not pulled in), and only with
//                   `badge: 'line'` on the candidate or the board. The note is written into the
//                   filled files that carry such paths and nowhere else: elsewhere a line badge
//                   is at the outline weight already, so the note would declare nothing
//   optical: dx dy  the ink is deliberately moved off the box centre (C14)
//   grows: L R T B  FILLED FILES ONLY — how far the filled ink is agreed to stand proud of its
//                   outline twin's box on each side, in that master's units. C17's repeated
//                   elements (menu lines, dots) thicken in place and cannot keep the box
//   gap: N          the agreed minimum gap between stroke edges for THIS file, in that master's
//                   units; it replaces §6's MIN_GAP in this file's proximity checks (C19 glyph
//                   pairs are untouched). A candidate writes `gap: { 24: 1, 20: 1 }` for both
//                   files, or `gap: { filled: { 24: 1, 20: 1 } }` to scope it to one style
//   anchor: NAME    a member of a level family (C28) keeps the full member NAME's canvas position
//                   instead of being centred on a keyline; lint holds its ink inside NAME's box
//                   (NAME-filled's for the filled file). A candidate writes `anchor: 'volume'`,
//                   written into both files; the full member has no anchor. A candidate's
//                   `anchor: null` opts out of a board-level one
//   base: NAME      a C33 composite keeps its base NAME's drawing and canvas position under the
//                   badge instead of being centred (2026-10-20, first password-lock on password);
//                   lint holds its ink to hold NAME's box and share one of its corners (NAME-filled's
//                   for the filled file). A candidate writes `base: 'password'`, written into both
//                   files, every master; a candidate's `base: null` opts out of a board-level one
// Lint reads all of them; a note the drawing does not measure is an error, not a warning
// (bar `glyph: numeral`, which is written for every master and so says "not in use" instead;
// `glyph: letter` is not: it is written only where it draws, and a stale one is an error).
import { MASTERS, strokeOf } from './masters.mjs';

export const masters = Object.keys(MASTERS).map(Number).sort((a, b) => b - a);

// `gap` is scoped like nothing else here, because it is the one note that can belong to
// either style: `{ 24: 1 }` gives both files the same agreed gap (like `box`), and
// `{ filled: { 24: 1 } }` / `{ outline: { … } }` names one style (like `grows`, which is
// filled-only). A style key present anywhere switches the whole note to the scoped form.
export const gapFor = (gap, m, filled) => {
  if (!gap) return null;
  const scoped = gap.filled !== undefined || gap.outline !== undefined;
  return (scoped ? gap[filled ? 'filled' : 'outline'] : gap)?.[m] ?? null;
};

export const svg = (m, weight, keyline, note, fill, stroke, tags = [], optical = null, glyph = null, box = null, grows = null, gap = null, anchor = null, glyphs = [], badge = null, badges = [], base = null) => [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">`,
  ...(keyline ? [`  <!-- keyline: ${keyline} -->`] : []),
  ...(tags.length ? [`  <!-- tags: ${tags.join(', ')} -->`] : []),
  ...(box ? [`  <!-- box: ${box[0]}x${box[1]} -->`] : []),
  ...(anchor ? [`  <!-- anchor: ${anchor} -->`] : []),
  ...(base ? [`  <!-- base: ${base} -->`] : []),
  ...(grows ? [`  <!-- grows: ${grows.join(' ')} -->`] : []),
  ...(gap ? [`  <!-- gap: ${gap} -->`] : []),
  ...(glyph ? [`  <!-- glyph: ${glyph} -->`] : []),
  ...(badge ? [`  <!-- badge: ${badge} -->`] : []),
  ...(optical ? [`  <!-- optical: ${optical.join(' ')} -->`] : []),
  ...(note ? [`  <!-- ${note.replace(/--/g, '—')} -->`] : []),
  ...fill.map((d) => `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`),
  ...stroke.map((d) => `  <path d="${d}"/>`),
  // C32: a numeral, a letter or a currency sign in a line-heavy filled drawing keeps the master's outline weight
  ...glyphs.map((d) => `  <path stroke-width="${strokeOf(m)}" d="${d}"/>`),
  // C33: so does a line badge on a line-heavy base
  ...badges.map((d) => `  <path stroke-width="${strokeOf(m)}" d="${d}"/>`),
  '</svg>', '',
].join('\n');

// One command-line argument → which candidate, shipped under which name. Shared by
// `queue.mjs approve` and `draft-check.mjs` so the two can never name a file differently:
// `B=user-small` names it outright; a bare `B` takes the name the draft's `set` gives it
// (`set: { V2: 'volume', V1: 'volume-low' }`, C28's level families), else the concept's.
// `from` says which: 'explicit' · 'set' · 'concept' — draft-check only lets a name that was
// asked for (explicit) stand in as an anchor, never one a candidate fell back to.
export function planArg(draft, arg) {
  const [id, file] = arg.split('=');
  if (file) return { id, file, from: 'explicit' };
  return draft.set?.[id] ? { id, file: draft.set[id], from: 'set' } : { id, file: draft.concept, from: 'concept' };
}

// One candidate → the six files it ships as, newest master first:
//   { master, name, file, filled, src }   file is `<name>.svg` / `<name>-filled.svg`
// `draft` supplies the defaults a candidate may override (keyline, tags, glyph, badge, box, anchor, base).
// Throws on a candidate that cannot ship; the caller decides how to report it.
export function candidateFiles(draft, c, name) {
  const keyline = c.keyline ?? draft.keyline ?? null;
  const tags = c.tags ?? draft.tags ?? [];
  const glyph = c.glyph ?? draft.glyph ?? null;
  const badge = c.badge ?? draft.badge ?? null;        // 'line' — written only where filled.badge draws
  if (badge && badge !== 'line') throw new Error(`${c.id}: badge: '${badge}' is not a kind — a line badge is badge: 'line'; a shape badge fills like any shape and needs no flag (C33).`);
  const box = c.box ?? draft.box ?? null;              // { 24: [w, h], 20: […], 16: […] }
  const grows = c.grows ?? draft.grows ?? null;        // { 24: [l, r, t, b], … } — filled files only
  const gap = c.gap ?? draft.gap ?? null;              // { 24: n, … } or { filled: { 24: n, … }, outline: … }
  const anchor = c.anchor !== undefined ? c.anchor : draft.anchor ?? null;   // 'volume' — both files, every master
  const base = c.base !== undefined ? c.base : draft.base ?? null;           // 'password' — both files, every master (C33)
  const out = [];
  for (const m of masters) {
    const o = c.masters?.[m];
    if (!o) throw new Error(`${c.id} has no ${m} master.`);
    const f = c.filled?.[m];
    if (c.filled === 'outline' || !f) throw new Error(`${c.id} has no filled drawing at ${m} (filled: 'outline' is retired — give it a weight or fill).`);
    const note = [c.label, c.note].filter(Boolean).join(': ');
    // The outline stroke is the master's own (masters.mjs): 1.5 at 24 and 20,
    // and whatever STROKES says at 16. A filled drawing declares its weight;
    // a shape-filled one has none, and its leftover lines keep the outline stroke.
    const sw = strokeOf(m);
    const fw = f.weight ?? sw;
    // C32: `filled.glyph` holds the numeral(s), letter(s) or currency sign(s) of a LINE-HEAVY filled drawing, which
    // keep the outline weight while the rails in `stroke` go to `weight`. Only there: a shape-filled
    // drawing's lines already stay at the outline weight (list-ordered's numerals sit in its
    // `stroke`), and without a heavier weight there is nothing to keep the numeral out of.
    const glyphs = f.glyph ?? [];
    const kind = glyph === 'letter' ? 'letter' : 'numeral';
    if (glyphs.length) {
      if (glyph !== 'numeral' && glyph !== 'letter') throw new Error(`${c.id} at ${m}: filled.glyph keeps a numeral, a letter or a currency sign at the outline weight, which needs glyph: 'numeral' or glyph: 'letter' on the candidate or the board (C32).`);
      if (f.fill?.length) throw new Error(`${c.id} at ${m}: filled.glyph is for a line-heavy filled drawing; this one fills shapes, so its ${kind}'s lines already stay at ${sw} — put them in filled.stroke (C32).`);
      if (fw === sw) throw new Error(`${c.id} at ${m}: filled.glyph needs a filled weight heavier than ${sw} (filled.weight); at the outline weight the ${kind} belongs in filled.stroke (C32).`);
    }
    // `glyph: letter` is C32's weight alone, so it is written only where a letter keeps its own
    // weight; `dot` and `numeral` carry C19's floor and go into every file.
    const glyphNote = (here) => (glyph === 'letter' && !here ? null : glyph);
    // C33 (2026-10-19): `filled.badge` holds a LINE badge on a LINE-HEAVY base (passkey-2's key on
    // fingerprint's print), drawn as the outline draws it while the base in `stroke` goes to
    // `weight`. Same three refusals as `filled.glyph`, for the same reasons: a shape-filled
    // drawing's badge already sits in `stroke` at the outline weight (calendar-repeat's loop).
    const badges = f.badge ?? [];
    if (badges.length) {
      if (badge !== 'line') throw new Error(`${c.id} at ${m}: filled.badge keeps a line badge at the outline weight, which needs badge: 'line' on the candidate or the board (C33).`);
      if (f.fill?.length) throw new Error(`${c.id} at ${m}: filled.badge is for a line-heavy filled drawing; this one fills shapes, so a line badge already stays at ${sw} — put it in filled.stroke (C33).`);
      if (fw === sw) throw new Error(`${c.id} at ${m}: filled.badge needs a filled weight heavier than ${sw} (filled.weight); at the outline weight the badge belongs in filled.stroke (C33).`);
    }
    out.push({ master: m, name, file: `${name}.svg`, filled: false,
      src: svg(m, sw, keyline, note, [], o, tags, c.optical?.[m], glyphNote(false), box?.[m], null, gapFor(gap, m, false), anchor, [], null, [], base) });
    out.push({ master: m, name: `${name}-filled`, file: `${name}-filled.svg`, filled: true,
      src: svg(m, fw, keyline,
        `${c.label}, filled` + (f.fill?.length ? `: shapes filled${f.stroke?.length ? `, lines stay ${sw}` : ''}` : `: weight ${fw}, ends pulled in ${(fw - sw) / 2} so the ink box matches the outline${glyphs.length ? `, ${kind} stays at ${sw}` : ''}${badges.length ? `, badge stays at ${sw}` : ''}`),
        f.fill ?? [], f.stroke ?? [], tags, c.optical?.[m], glyphNote(glyphs.length > 0), box?.[m], grows?.[m], gapFor(gap, m, true), anchor, glyphs,
        badges.length ? badge : null, badges, base) });
  }
  return out;
}
