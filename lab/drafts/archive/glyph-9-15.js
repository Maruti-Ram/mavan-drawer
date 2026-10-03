// glyph-9-15 — the locked nine re-solved for the sort family's box (plans/sort-family.md, card 3).
//
// WHAT CHANGED. The letterform study (lab/drafts/archive/glyph-9.js) was drawn to a slot of
// 8.25 · 6.25 · 5.25 of ink and candidate C — "67 per cent bowl, lean 30", locked by Maruti on
// 2026-10-03 — shipped exactly that. The family box (18×15 · 16×13.5 · 14×12) with two numerals and
// 1.5 of air asks for 6.75 · 6.0 · 5.25. 16 is already 5.25, so the 16 master here is the locked
// drawing byte for byte, untouched. 24 comes down 8.25 → 6.75 and 20 comes down 6.25 → 6.0.
//
// WHAT HAD TO SURVIVE, AND WHAT IT COST. C's two defining numbers are the bowl's share of the
// letter's height (two thirds) and the tail's lean off vertical (30 degrees). Both are held exactly.
// The bowl share forces the radius: two thirds of 6.75 is 4.5 of bowl ink, which is a centreline
// diameter of 3 and a radius of 1.5 at 24 — on the quarter grid, so no compromise. At 20 two thirds
// of 6.0 is 4.0 of bowl ink, diameter 2.5, radius 1.25 — which is the locked bowl unchanged; only
// the tail shortens. The share at 20 therefore IMPROVES from the locked 64 per cent to 66.7, so all
// three masters now sit on the same two thirds for the first time.
//
// The price is at 24, and it is the counter. C's 24 bowl was 4 of centreline across, leaving a
// counter of 2.5; this one is 3 across, leaving 1.5 — §6's floor exactly, not under it. At 20 and 16
// the counter is 1.0, which is what the locked drawing already measured and what C19 allows a
// numeral's own opening (GLYPH_GAP, 1 unit); the board declares `glyph: 'numeral'` for that reason,
// as the locked board did. Round 3's finding stands: the counter is a fact about the drawing, not the
// verdict — the tail is what makes it read as a 9, and the field's own nines collapse to a pinhole at
// this size too.
//
// HOW THE TAIL IS BUILT. The only clean straight lean is the tangent one: a tail leaning t degrees
// leaves the bowl exactly t degrees past 3 o'clock, where the bowl's own tangent is already that
// angle, so the two merge with no corner and no overlap. 30 degrees therefore leaves at 4 o'clock.
// The round cap at the tail's start is a disc of radius half the stroke centred on a point of the
// bowl's centreline circle, so every point of it lies inside the bowl's own stroke band: the cap is
// swallowed whole and there is no edge meeting a round end at a corner — the defect found and fixed
// on the capital A (lab/drafts/archive/glyph-a.js, candidate S). Measured on these drawings after
// rounding to the master's decimals, the tail's direction differs from the bowl's tangent at the
// departure point by 0.01 degrees at 24, 0.30 at 20 and 0.03 at 16 — at 20 that is 0.008 of a unit
// of edge misalignment across a 1.5-wide stroke, a hundredth of a unit, and it is rounding, not
// construction.
//
// A lean of anything but 0 or 90 degrees puts the tail's endpoints off the master's grid; they are
// rounded to the master's decimal places and are the documented exception in each file, exactly as
// in the locked board. The filled twin draws the bowl as its own ring — outer radius r + half the
// stroke, inner radius r − half, evenodd — and keeps the tail as a line at the outline weight, so a
// numeral holds the outline weight in both styles, as list-ordered-filled does, and the two ink
// boxes are identical.
//
// Every number below was measured from these drawings this session.
export default {
  concept: 'glyph-9',
  glyph: 'numeral',
  tags: ['numeral', 'nine', 'letterform study', 'leaning tail', 'straight diagonal', 'sort-ascending', 'sort-descending', 'family box'],
  question: 'Does C\'s two-thirds bowl and 30 degree lean survive 6.75 of ink at 24, and what does the 24 counter come to?',
  candidates: [
    {
      id: 'A', label: '67 per cent bowl, lean 30 — C re-solved for the family box',
      box: { 24: [4.5, 6.75], 20: [4, 6], 16: [3.5, 5.25] },
      note: 'The locked nine at the family\'s height. In plain words: the same letter — a round bowl with a straight tail leaning away from it, which is the thing that makes it a 9 rather than a q — with the 24 and 20 masters brought down to the height the sort box allows and the 16 left exactly as Maruti locked it. At 20 only the tail is shorter; the bowl is untouched. At 24 the bowl is a quarter smaller, and what you will see first is the counter: it goes from a clear hole to a slot the width of the stroke. Ink 4.5×6.75 at 24, 4×6 at 20, 3.5×5.25 at 16; the filled twin measures the same box at every master, to 2 dp. Bowl share of the letter\'s height — bowl ink height over total ink height — 66.7 · 66.7 · 66.7 per cent, against the locked drawing\'s 66.7 · 64 · 66.7, so the three masters agree for the first time. Tail lean off vertical, measured from the drawn endpoints: 29.97 · 29.96 · 30.00 degrees, against 30 asked for; it leaves the bowl 29.98 · 30.26 · 30.03 degrees past 3 o\'clock, which is its own tangent, so the join carries no corner — the mismatch is 0.01 · 0.30 · 0.03 degrees, all of it rounding to the master\'s decimals. Ink below the bowl 33.3 · 33.3 · 33.3 per cent of the letter, inside the field\'s 24 to 33. The terminal lands 0.43 · 0.43 · 0.36 left of the bowl\'s own centre, so the tail still finishes under the bowl rather than hanging off its right. The counter, measured as the inner boundary of the filled drawing (bowl centreline diameter minus the stroke, which is the hole the eye sees): 1.5 round at 24, 1.0 at 20, 1.0 at 16, against the locked 2.5 · 1.0 · 1.0. The smallest gap anywhere in the drawing is that counter: 1.5 at 24 — §6\'s floor exactly, so lint is silent there — and 1.0 at 20 and 16, which is C19\'s GLYPH_GAP for a numeral\'s own opening and what the locked drawing already shipped; it is this study\'s own question, not a defect. Construction: bowl centreline circle radius 1.5 · 1.25 · 1.125 centred at 12,10.75 · 10,9 · 8,6.75, every arc rx == ry so the D-slot test reads 1.00; tail a straight line from the tangent point to the baseline, fall 3.0 · 2.62 · 2.31, run 1.73 · 1.51 · 1.34. The 24 box is centred at 11.875 rather than 12 because 6.75 of ink cannot be halved on the quarter grid; 20 and 16 are centred exactly.',
      masters: {
        24: ['M13.5 10.75A1.5 1.5 0 1 1 10.5 10.75A1.5 1.5 0 1 1 13.5 10.75', 'M13.3 11.5L11.57 14.5'],
        20: ['M11.25 9A1.25 1.25 0 1 1 8.75 9A1.25 1.25 0 1 1 11.25 9', 'M11.08 9.63L9.57 12.25'],
        16: ['M9.125 6.75A1.125 1.125 0 1 1 6.875 6.75A1.125 1.125 0 1 1 9.125 6.75', 'M8.974 7.313L7.639 9.625'],
      },
      filled: {
        24: { fill: ['M14.25 10.75A2.25 2.25 0 1 1 9.75 10.75A2.25 2.25 0 1 1 14.25 10.75ZM12.75 10.75A0.75 0.75 0 1 1 11.25 10.75A0.75 0.75 0 1 1 12.75 10.75Z'], stroke: ['M13.3 11.5L11.57 14.5'] },
        20: { fill: ['M12 9A2 2 0 1 1 8 9A2 2 0 1 1 12 9ZM10.5 9A0.5 0.5 0 1 1 9.5 9A0.5 0.5 0 1 1 10.5 9Z'], stroke: ['M11.08 9.63L9.57 12.25'] },
        16: { fill: ['M9.75 6.75A1.75 1.75 0 1 1 6.25 6.75A1.75 1.75 0 1 1 9.75 6.75ZM8.5 6.75A0.5 0.5 0 1 1 7.5 6.75A0.5 0.5 0 1 1 8.5 6.75Z'], stroke: ['M8.974 7.313L7.639 9.625'] },
      },
    },
  ],
};
