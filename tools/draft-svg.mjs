// The one place a draft candidate turns into shipped SVG text.
//
// `queue.mjs approve` writes these strings to src/icons; `draft-check.mjs`
// lints the same strings in a temp directory without touching the repo. They
// must never drift, so neither one builds the text itself.
//
// The comment notes a file may carry:
//   keyline: mark   the icon is a directional mark, held to the mark ceiling, not a keyline
//   tags:           search words kept beside the name (check-2 → "long sweep"); build.mjs reads them
//   box: WxH        the agreed ink size for this master when the icon keeps a box of its own
//   glyph: dot      one character with a detached dot (i, ?, !); its dot-to-body gap floors at
//                   GLYPH_GAP rather than MIN_GAP (C19)
//   optical: dx dy  the ink is deliberately moved off the box centre (C14)
//   grows: L R T B  FILLED FILES ONLY — how far the filled ink is agreed to stand proud of its
//                   outline twin's box on each side, in that master's units. C17's repeated
//                   elements (menu lines, dots) thicken in place and cannot keep the box
// Lint reads all of them; a note the drawing does not measure is an error, not a warning.
import { MASTERS, strokeOf } from './masters.mjs';

export const masters = Object.keys(MASTERS).map(Number).sort((a, b) => b - a);

export const svg = (m, weight, keyline, note, fill, stroke, tags = [], optical = null, glyph = null, box = null, grows = null) => [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">`,
  ...(keyline ? [`  <!-- keyline: ${keyline} -->`] : []),
  ...(tags.length ? [`  <!-- tags: ${tags.join(', ')} -->`] : []),
  ...(box ? [`  <!-- box: ${box[0]}x${box[1]} -->`] : []),
  ...(grows ? [`  <!-- grows: ${grows.join(' ')} -->`] : []),
  ...(glyph ? [`  <!-- glyph: ${glyph} -->`] : []),
  ...(optical ? [`  <!-- optical: ${optical.join(' ')} -->`] : []),
  ...(note ? [`  <!-- ${note.replace(/--/g, '—')} -->`] : []),
  ...fill.map((d) => `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`),
  ...stroke.map((d) => `  <path d="${d}"/>`),
  '</svg>', '',
].join('\n');

// One candidate → the six files it ships as, newest master first:
//   { master, name, file, filled, src }   file is `<name>.svg` / `<name>-filled.svg`
// `draft` supplies the defaults a candidate may override (keyline, tags, glyph, box).
// Throws on a candidate that cannot ship; the caller decides how to report it.
export function candidateFiles(draft, c, name) {
  const keyline = c.keyline ?? draft.keyline ?? null;
  const tags = c.tags ?? draft.tags ?? [];
  const glyph = c.glyph ?? draft.glyph ?? null;
  const box = c.box ?? draft.box ?? null;              // { 24: [w, h], 20: […], 16: […] }
  const grows = c.grows ?? draft.grows ?? null;        // { 24: [l, r, t, b], … } — filled files only
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
    out.push({ master: m, name, file: `${name}.svg`, filled: false,
      src: svg(m, sw, keyline, note, [], o, tags, c.optical?.[m], glyph, box?.[m]) });
    out.push({ master: m, name: `${name}-filled`, file: `${name}-filled.svg`, filled: true,
      src: svg(m, fw, keyline,
        `${c.label}, filled` + (f.fill?.length ? `: shapes filled${f.stroke?.length ? `, lines stay ${sw}` : ''}` : `: weight ${fw}, ends pulled in ${(fw - sw) / 2} so the ink box matches the outline`),
        f.fill ?? [], f.stroke ?? [], tags, c.optical?.[m], glyph, box?.[m], grows?.[m]) });
  }
  return out;
}
