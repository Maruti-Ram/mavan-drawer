// glyph-0-15 — the locked zero re-solved for the sort family's box (plans/sort-family.md, card 3).
//
// WHAT CHANGED, AND WHY ONLY ONE MASTER MOVED. The letterform study (lab/drafts/archive/glyph-0.js)
// was drawn to a slot of 8.25 · 6.25 · 5.25 of ink and candidate D — "Oval 0.75", locked by Maruti
// on 2026-10-03 — actually shipped 8 · 6 · 5.25, because a circular bowl's radius is half its
// centreline height and the quarter grid at 24 and 20 would not take the odd number. The family box
// (18×15 · 16×13.5 · 14×12) with two numerals and 1.5 of air between them asks for
// 6.75 · 6.0 · 5.25. Compared with what D already draws: 20 is 6.0 and 16 is 5.25 ALREADY, so both
// of those masters are the locked drawing byte for byte, untouched. Only 24 comes down, 8 → 6.75.
//
// WHAT HAD TO SURVIVE. D's answer to the board's question — what keeps a zero from reading as a
// capital O — is proportion and nothing else: a narrow bowl, width over height 0.77 · 0.78 · 0.75
// on the centreline. No slash, no dot, no bar, no flattened flank; those five devices all died on
// that board because 1.5 of white will not fit twice inside a 2.75-tall counter. So the re-solve is
// a proportion problem: hold 0.77-ish at a centreline height of 5.25 instead of 6.5.
//
// THE ARITHMETIC AT 24. Ink 6.75 means a centreline box 5.25 tall. The bowl is an upright stadium —
// two arcs of radius half the WIDTH, top and bottom, joined by straight flanks — so the radius is
// half the centreline width and the width must be a multiple of 0.5 for the radius to stay on the
// quarter grid. 4.0 gives 0.762; the next step either way is 3.5 (0.667, past the board's counter
// floor) or 4.5 (0.857, which is C's proportion, not D's). 4.0 it is: radius 2, flanks 1.25 long.
//
// Every curve is a circular arc with rx == ry, as on the locked board, and the filled twin is the
// same boundary offset by half the stroke — radius ± 0.75 at 24, centres untouched — so the outer
// edge is the outline's outer edge point for point and the counter is cut as a hole with evenodd.
// Ink 6.75 cannot be centred on 12 at 24 (half of it is 3.375, three decimals), so the box sits
// 0.125 high, at centre 11.875 — inside lint's half-unit tolerance and the same 0.125 the locked
// glyph-9 board sat at.
//
// Every number below was measured from these drawings this session.
export default {
  concept: 'glyph-0',
  keyline: 'mark',
  tags: ['numeral', 'zero', 'glyph study', 'sort', 'alphanumeric', 'family box'],
  question: 'Does D\'s narrow proportion — the one thing that stops the 0 reading as a capital O — survive a centreline height of 5.25 at 24?',
  candidates: [
    {
      id: 'A', label: 'Oval 0.76 — D re-solved for the family box', tags: ['proportion'],
      note: 'The locked zero at the family\'s height. In plain words: it is the same drawing — an upright stadium, two circular arcs joined by straight flanks, narrow enough that nobody reads it as a capital O — with the 24 master brought down to the height the sort box allows, and 20 and 16 left exactly as Maruti locked them. The eye should see no change at all at 20 and 16, and at 24 a zero that is very slightly rounder than before, because the bowl lost height faster than the grid would let it lose width. Ink 5.5×6.75 at 24, 5×6 at 20, 4.25×5.25 at 16; the filled twin measures the same box at every master, to 2 dp. Width over height on the centreline 0.762 · 0.778 · 0.75, against the locked drawing\'s 0.769 · 0.778 · 0.75 — the 24 moved by 0.007, and it now sits between its own 16 and its own 20 instead of above both. On the ink box it is 0.815 · 0.833 · 0.81 against 0.813 · 0.833 · 0.81. The counter, measured as the inner boundary of the filled drawing (outer radius minus the stroke, which is what the eye sees as the hole): 2.5 wide × 3.75 tall at 24, 2×3 at 20, 1.75×2.75 at 16 — the 24 counter narrowed from 3.5 to 2.5 and is still a whole unit clear of §6\'s 1.5. The smallest gap anywhere in the drawing is that counter width: 2.5 · 2 · 1.75, so nothing in this file is near the floor and lint reports no proximity warning. Construction, for the record: centreline box 4×5.25 · 3.5×4.5 · 3×4, arc radius 2 · 1.75 · 1.5 (half the width at every master), straight flanks 1.25 · 1 · 1 long, every arc rx == ry so the D-slot test reads 1.00. The 24 box is centred at 11.875 rather than 12 because 6.75 of ink cannot be halved on the quarter grid; 20 and 16 are centred exactly.',
      masters: {
        24: ['M14 11.25L14 12.5A2 2 0 0 1 12 14.5A2 2 0 0 1 10 12.5L10 11.25A2 2 0 0 1 12 9.25A2 2 0 0 1 14 11.25Z'],
        20: ['M11.75 9.5L11.75 10.5A1.75 1.75 0 0 1 10 12.25A1.75 1.75 0 0 1 8.25 10.5L8.25 9.5A1.75 1.75 0 0 1 10 7.75A1.75 1.75 0 0 1 11.75 9.5Z'],
        16: ['M9.5 7.5L9.5 8.5A1.5 1.5 0 0 1 8 10A1.5 1.5 0 0 1 6.5 8.5L6.5 7.5A1.5 1.5 0 0 1 8 6A1.5 1.5 0 0 1 9.5 7.5Z'],
      },
      filled: {
        24: { fill: ['M14.75 11.25L14.75 12.5A2.75 2.75 0 0 1 12 15.25A2.75 2.75 0 0 1 9.25 12.5L9.25 11.25A2.75 2.75 0 0 1 12 8.5A2.75 2.75 0 0 1 14.75 11.25Z M13.25 11.25L13.25 12.5A1.25 1.25 0 0 1 12 13.75A1.25 1.25 0 0 1 10.75 12.5L10.75 11.25A1.25 1.25 0 0 1 12 10A1.25 1.25 0 0 1 13.25 11.25Z'] },
        20: { fill: ['M12.5 9.5L12.5 10.5A2.5 2.5 0 0 1 10 13A2.5 2.5 0 0 1 7.5 10.5L7.5 9.5A2.5 2.5 0 0 1 10 7A2.5 2.5 0 0 1 12.5 9.5Z M11 9.5L11 10.5A1 1 0 0 1 10 11.5A1 1 0 0 1 9 10.5L9 9.5A1 1 0 0 1 10 8.5A1 1 0 0 1 11 9.5Z'] },
        16: { fill: ['M10.125 7.5L10.125 8.5A2.125 2.125 0 0 1 8 10.625A2.125 2.125 0 0 1 5.875 8.5L5.875 7.5A2.125 2.125 0 0 1 8 5.375A2.125 2.125 0 0 1 10.125 7.5Z M8.875 7.5L8.875 8.5A0.875 0.875 0 0 1 8 9.375A0.875 0.875 0 0 1 7.125 8.5L7.125 7.5A0.875 0.875 0 0 1 8 6.625A0.875 0.875 0 0 1 8.875 7.5Z'] },
      },
    },
  ],
};
