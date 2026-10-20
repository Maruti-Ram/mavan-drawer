// sort-numeric-ascending — round 3 of the 9 under the 0. Rounds 1 and 2 are in lab/drafts/archive
// (sort-numeric-9.js, sort-numeric-9-round2.js). Maruti picked D2 in round 2 and saw one problem only:
// the tail makes the 9 look slanted and crooked. This board asks one thing: which tail stands the 9
// upright? Every E keeps D2's bowl byte for byte (outline path and filled ring) and changes the tail
// only. A (shipped) and D2 (unchanged) stay as references.
//
// THE MEASURE. "Lean" is the angle off vertical of the long axis of the 9's outline ink (bowl and tail,
// sampled at 0.02); plus means the top leans right, as italics do. The 0 measures 0.0°. D2 leans
// +11.9 · +12.8 · +13.3 (24 · 20 · 16); the shipped 9, which nobody called crooked, +2.0 · +3.6 · +3.0.
// What sets it is how far left the tail's foot ends: D2's ends 1.75 · 1.5 · 1.375 left of the bowl's
// centre, out under the bowl's left edge. With a level end the 9 stands upright when the foot stops
// about 1 · 0.75 · 0.75 left of the centre (E1); one grid step further out is the shipped lean (E2).
//
// Settled (Maruti): the 0 and the arrow are the shipped paths, byte for byte. The 9 keeps D2's height
// and place — 6.75 · 6 · 5.25 tall, 1.5 under the 0 (1.50 measured on every candidate) — and the box
// stays 18×15 · 16×13.5 · 14×12, centred. Its own openings may close to 1 (C19, glyph: 'numeral').
//
// SAME PIXELS. At 16 and at 20, E1, E2 and E3 render to the same pixels (no pixel more than 29 of 255
// apart; at 16 E2 and E3 differ by 56 in one pixel), and E4 nearly so (one or two pixels, 49 to 67 of
// 255: its right side stays dark one row lower). Every E differs from D2 at 16 in the foot's last
// pixel on the left, which goes from 198 of 255 to 43 to 72. So at 16 and 20 the choice is D2 or an E;
// between the Es the difference shows at 24 and up.
//
// WHAT IT COSTS. A foot that ends further in tucks under the bowl, so the white between the tail's tip
// and the bowl ("tail-end air") narrows from D2's 1.10 · 0.79 · 0.77 to 0.84–0.93 · 0.57–0.63 ·
// 0.56–0.61. Round 1's height limit still holds (at 20 and 16 there is 0.5 under the bowl), and lint
// does not see this air, as before. A shorter tail is also lighter: E1–E3 carry 91–96 per cent of the
// 0's ink against D2's 96–99. E4 keeps D2's weight.
//
// THE FILLED TWIN is D2's: the 9's bowl is D2's oval ring and the tail stays a line at the outline
// weight; it renders within 2 of 255 of the outline in every pixel, on every candidate.
//
// How to read the numbers in each note (24 · 20 · 16): "lean" as above; "tail-end air" is the white
// between the tail's tip and the bowl; "ink" is the 9's inked area as a share of the 0's (outline,
// sampled at 0.02); "mass" is how far the 9's centre of mass sits right or left of the 0's. All
// measured on these drawings this session; real pixels checked at 1 unit = 1 px, outline and filled.
export default {
  concept: 'sort-numeric-ascending',
  glyph: 'numeral',
  box: { 24: [18, 15], 20: [16, 13.5], 16: [14, 12] },
  tags: ['sort', 'order', 'arrange', 'numeric', 'ascending', 'table header'],
  question: 'Which tail stands the 9 upright?',
  candidates: [
    {
      id: 'A', label: 'Shipped',
      note: 'The 9 as it ships, kept as the reference for a lean nobody called crooked. What the eye sees: a 9 a size smaller than the 0, hung on its left edge, with a straight diagonal tail. Lean +2.0 · +3.6 · +3.0. Tail-end air 0.77 · 0.53 · 0.52. Ink 79 · 77 · 79 per cent of the 0\'s. Mass 0.50 · 0.52 · 0.39 left. Paths verbatim from src/icons; the off-grid tail ends are the shipped, tangent-derived ones. This branch\'s lint warns on its filled file at 20 and 16 ("1 of air between a shape and a line" at the bowl): the shipped drawing, unchanged here.',
      masters: {
        24: ['M7.75 7.25L7.75 8.5A2 2 0 0 1 5.75 10.5A2 2 0 0 1 3.75 8.5L3.75 7.25A2 2 0 0 1 5.75 5.25A2 2 0 0 1 7.75 7.25Z', 'M6.75 15A1.5 1.5 0 1 1 3.75 15A1.5 1.5 0 1 1 6.75 15', 'M6.55 15.75L4.82 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'],
        20: ['M6.25 5.75L6.25 6.75A1.75 1.75 0 0 1 4.5 8.5A1.75 1.75 0 0 1 2.75 6.75L2.75 5.75A1.75 1.75 0 0 1 4.5 4A1.75 1.75 0 0 1 6.25 5.75Z', 'M5.25 12.75A1.25 1.25 0 1 1 2.75 12.75A1.25 1.25 0 1 1 5.25 12.75', 'M5.08 13.38L3.57 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'],
        16: ['M4.625 4.125L4.625 5.125A1.5 1.5 0 0 1 3.125 6.625A1.5 1.5 0 0 1 1.625 5.125L1.625 4.125A1.5 1.5 0 0 1 3.125 2.625A1.5 1.5 0 0 1 4.625 4.125Z', 'M3.875 10.5A1.125 1.125 0 1 1 1.625 10.5A1.125 1.125 0 1 1 3.875 10.5', 'M3.724 11.063L2.389 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'],
      },
      filled: {
        24: { fill: ['M8.5 7.25L8.5 8.5A2.75 2.75 0 0 1 5.75 11.25A2.75 2.75 0 0 1 3 8.5L3 7.25A2.75 2.75 0 0 1 5.75 4.5A2.75 2.75 0 0 1 8.5 7.25ZM7 7.25L7 8.5A1.25 1.25 0 0 1 5.75 9.75A1.25 1.25 0 0 1 4.5 8.5L4.5 7.25A1.25 1.25 0 0 1 5.75 6A1.25 1.25 0 0 1 7 7.25Z', 'M7.5 15A2.25 2.25 0 1 1 3 15A2.25 2.25 0 1 1 7.5 15ZM6 15A0.75 0.75 0 1 1 4.5 15A0.75 0.75 0 1 1 6 15Z'], stroke: ['M6.55 15.75L4.82 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'] },
        20: { fill: ['M7 5.75L7 6.75A2.5 2.5 0 0 1 4.5 9.25A2.5 2.5 0 0 1 2 6.75L2 5.75A2.5 2.5 0 0 1 4.5 3.25A2.5 2.5 0 0 1 7 5.75ZM5.5 5.75L5.5 6.75A1 1 0 0 1 4.5 7.75A1 1 0 0 1 3.5 6.75L3.5 5.75A1 1 0 0 1 4.5 4.75A1 1 0 0 1 5.5 5.75Z', 'M6 12.75A2 2 0 1 1 2 12.75A2 2 0 1 1 6 12.75ZM4.5 12.75A0.5 0.5 0 1 1 3.5 12.75A0.5 0.5 0 1 1 4.5 12.75Z'], stroke: ['M5.08 13.38L3.57 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'] },
        16: { fill: ['M5.25 4.125L5.25 5.125A2.125 2.125 0 0 1 3.125 7.25A2.125 2.125 0 0 1 1 5.125L1 4.125A2.125 2.125 0 0 1 3.125 2A2.125 2.125 0 0 1 5.25 4.125ZM4 4.125L4 5.125A0.875 0.875 0 0 1 3.125 6A0.875 0.875 0 0 1 2.25 5.125L2.25 4.125A0.875 0.875 0 0 1 3.125 3.25A0.875 0.875 0 0 1 4 4.125Z', 'M4.5 10.5A1.75 1.75 0 1 1 1 10.5A1.75 1.75 0 1 1 4.5 10.5ZM3.25 10.5A0.5 0.5 0 1 1 2.25 10.5A0.5 0.5 0 1 1 3.25 10.5Z'], stroke: ['M3.724 11.063L2.389 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'] },
      },
    },
    {
      id: 'D2', label: 'Round-2 pick',
      note: 'Maruti\'s pick in round 2, unchanged: the bowl every E keeps. What the eye sees: the tail sweeps out to the lower left and ends level under the bowl\'s left edge, so the whole 9 leans like italics, the slant Maruti saw. Lean +11.9 · +12.8 · +13.3. Tail-end air 1.10 · 0.79 · 0.77. Ink 97 · 96 · 99 per cent. Mass 0.06 · 0.06 · 0.06 left. Construction: bowl centreline radii 1.75 × 1.5 · 1.5 × 1.25 · 1.375 × 1.125, centred at (5.75, 15) · (4.5, 12.75) · (3.125, 10.5); tail a quarter ellipse 3.5 × 3.75 · 3 × 3.25 · 2.75 × 2.875 from the bowl\'s 3 o\'clock, foot at x 4 · 3 · 1.75 (1.75 · 1.5 · 1.375 left of the bowl\'s centre). Every value on the master\'s grid. At 16 it differs from every E in the foot\'s last pixel on the left.',
      masters: {
        24: ['M7.75 7.25L7.75 8.5A2 2 0 0 1 5.75 10.5A2 2 0 0 1 3.75 8.5L3.75 7.25A2 2 0 0 1 5.75 5.25A2 2 0 0 1 7.75 7.25Z', 'M7.5 15A1.75 1.5 0 1 1 4 15A1.75 1.5 0 1 1 7.5 15', 'M7.5 15A3.5 3.75 0 0 1 4 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'],
        20: ['M6.25 5.75L6.25 6.75A1.75 1.75 0 0 1 4.5 8.5A1.75 1.75 0 0 1 2.75 6.75L2.75 5.75A1.75 1.75 0 0 1 4.5 4A1.75 1.75 0 0 1 6.25 5.75Z', 'M6 12.75A1.5 1.25 0 1 1 3 12.75A1.5 1.25 0 1 1 6 12.75', 'M6 12.75A3 3.25 0 0 1 3 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'],
        16: ['M4.625 4.125L4.625 5.125A1.5 1.5 0 0 1 3.125 6.625A1.5 1.5 0 0 1 1.625 5.125L1.625 4.125A1.5 1.5 0 0 1 3.125 2.625A1.5 1.5 0 0 1 4.625 4.125Z', 'M4.5 10.5A1.375 1.125 0 1 1 1.75 10.5A1.375 1.125 0 1 1 4.5 10.5', 'M4.5 10.5A2.75 2.875 0 0 1 1.75 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'],
      },
      filled: {
        24: { fill: ['M8.5 7.25L8.5 8.5A2.75 2.75 0 0 1 5.75 11.25A2.75 2.75 0 0 1 3 8.5L3 7.25A2.75 2.75 0 0 1 5.75 4.5A2.75 2.75 0 0 1 8.5 7.25ZM7 7.25L7 8.5A1.25 1.25 0 0 1 5.75 9.75A1.25 1.25 0 0 1 4.5 8.5L4.5 7.25A1.25 1.25 0 0 1 5.75 6A1.25 1.25 0 0 1 7 7.25Z', 'M8.25 15A2.5 2.25 0 1 1 3.25 15A2.5 2.25 0 1 1 8.25 15ZM6.75 15A1 0.75 0 1 1 4.75 15A1 0.75 0 1 1 6.75 15Z'], stroke: ['M7.5 15A3.5 3.75 0 0 1 4 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'] },
        20: { fill: ['M7 5.75L7 6.75A2.5 2.5 0 0 1 4.5 9.25A2.5 2.5 0 0 1 2 6.75L2 5.75A2.5 2.5 0 0 1 4.5 3.25A2.5 2.5 0 0 1 7 5.75ZM5.5 5.75L5.5 6.75A1 1 0 0 1 4.5 7.75A1 1 0 0 1 3.5 6.75L3.5 5.75A1 1 0 0 1 4.5 4.75A1 1 0 0 1 5.5 5.75Z', 'M6.75 12.75A2.25 2 0 1 1 2.25 12.75A2.25 2 0 1 1 6.75 12.75ZM5.25 12.75A0.75 0.5 0 1 1 3.75 12.75A0.75 0.5 0 1 1 5.25 12.75Z'], stroke: ['M6 12.75A3 3.25 0 0 1 3 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'] },
        16: { fill: ['M5.25 4.125L5.25 5.125A2.125 2.125 0 0 1 3.125 7.25A2.125 2.125 0 0 1 1 5.125L1 4.125A2.125 2.125 0 0 1 3.125 2A2.125 2.125 0 0 1 5.25 4.125ZM4 4.125L4 5.125A0.875 0.875 0 0 1 3.125 6A0.875 0.875 0 0 1 2.25 5.125L2.25 4.125A0.875 0.875 0 0 1 3.125 3.25A0.875 0.875 0 0 1 4 4.125Z', 'M5.125 10.5A2 1.75 0 1 1 1.125 10.5A2 1.75 0 1 1 5.125 10.5ZM3.875 10.5A0.75 0.5 0 1 1 2.375 10.5A0.75 0.5 0 1 1 3.875 10.5Z'], stroke: ['M4.5 10.5A2.75 2.875 0 0 1 1.75 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'] },
      },
    },
    {
      id: 'E1', label: 'Level end, upright',
      note: 'D2\'s tail pulled in: it still leaves the bowl\'s 3 o\'clock heading straight down and still ends level, but its foot stops 1 · 0.75 · 0.75 left of the bowl\'s centre instead of 1.75 · 1.5 · 1.375, so the turn is narrower and taller. What the eye sees: the 9 stops leaning; the tail becomes a compact hook whose foot ends under the bowl\'s left half instead of past it. Its right side starts curving straight away, so just below the bowl it still slopes a little. Lean +0.2 · −0.8 · +0.1. Tail-end air 0.87 · 0.57 · 0.58. Ink 94 · 92 · 96 per cent: a shorter tail, lighter than D2. Mass 0.08 · 0.07 · 0.06 right. Same pixels at 16 and 20 as E2 and E3. Construction: tail a quarter ellipse 2.75 × 3.75 · 2.25 × 3.25 · 2.125 × 2.875, foot at x 4.75 · 3.75 · 2.375. Every value on the master\'s grid. Filled: D2\'s ring, the tail a line at the outline weight; ink box identical.',
      masters: {
        24: ['M7.75 7.25L7.75 8.5A2 2 0 0 1 5.75 10.5A2 2 0 0 1 3.75 8.5L3.75 7.25A2 2 0 0 1 5.75 5.25A2 2 0 0 1 7.75 7.25Z', 'M7.5 15A1.75 1.5 0 1 1 4 15A1.75 1.5 0 1 1 7.5 15', 'M7.5 15A2.75 3.75 0 0 1 4.75 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'],
        20: ['M6.25 5.75L6.25 6.75A1.75 1.75 0 0 1 4.5 8.5A1.75 1.75 0 0 1 2.75 6.75L2.75 5.75A1.75 1.75 0 0 1 4.5 4A1.75 1.75 0 0 1 6.25 5.75Z', 'M6 12.75A1.5 1.25 0 1 1 3 12.75A1.5 1.25 0 1 1 6 12.75', 'M6 12.75A2.25 3.25 0 0 1 3.75 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'],
        16: ['M4.625 4.125L4.625 5.125A1.5 1.5 0 0 1 3.125 6.625A1.5 1.5 0 0 1 1.625 5.125L1.625 4.125A1.5 1.5 0 0 1 3.125 2.625A1.5 1.5 0 0 1 4.625 4.125Z', 'M4.5 10.5A1.375 1.125 0 1 1 1.75 10.5A1.375 1.125 0 1 1 4.5 10.5', 'M4.5 10.5A2.125 2.875 0 0 1 2.375 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'],
      },
      filled: {
        24: { fill: ['M8.5 7.25L8.5 8.5A2.75 2.75 0 0 1 5.75 11.25A2.75 2.75 0 0 1 3 8.5L3 7.25A2.75 2.75 0 0 1 5.75 4.5A2.75 2.75 0 0 1 8.5 7.25ZM7 7.25L7 8.5A1.25 1.25 0 0 1 5.75 9.75A1.25 1.25 0 0 1 4.5 8.5L4.5 7.25A1.25 1.25 0 0 1 5.75 6A1.25 1.25 0 0 1 7 7.25Z', 'M8.25 15A2.5 2.25 0 1 1 3.25 15A2.5 2.25 0 1 1 8.25 15ZM6.75 15A1 0.75 0 1 1 4.75 15A1 0.75 0 1 1 6.75 15Z'], stroke: ['M7.5 15A2.75 3.75 0 0 1 4.75 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'] },
        20: { fill: ['M7 5.75L7 6.75A2.5 2.5 0 0 1 4.5 9.25A2.5 2.5 0 0 1 2 6.75L2 5.75A2.5 2.5 0 0 1 4.5 3.25A2.5 2.5 0 0 1 7 5.75ZM5.5 5.75L5.5 6.75A1 1 0 0 1 4.5 7.75A1 1 0 0 1 3.5 6.75L3.5 5.75A1 1 0 0 1 4.5 4.75A1 1 0 0 1 5.5 5.75Z', 'M6.75 12.75A2.25 2 0 1 1 2.25 12.75A2.25 2 0 1 1 6.75 12.75ZM5.25 12.75A0.75 0.5 0 1 1 3.75 12.75A0.75 0.5 0 1 1 5.25 12.75Z'], stroke: ['M6 12.75A2.25 3.25 0 0 1 3.75 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'] },
        16: { fill: ['M5.25 4.125L5.25 5.125A2.125 2.125 0 0 1 3.125 7.25A2.125 2.125 0 0 1 1 5.125L1 4.125A2.125 2.125 0 0 1 3.125 2A2.125 2.125 0 0 1 5.25 4.125ZM4 4.125L4 5.125A0.875 0.875 0 0 1 3.125 6A0.875 0.875 0 0 1 2.25 5.125L2.25 4.125A0.875 0.875 0 0 1 3.125 3.25A0.875 0.875 0 0 1 4 4.125Z', 'M5.125 10.5A2 1.75 0 1 1 1.125 10.5A2 1.75 0 1 1 5.125 10.5ZM3.875 10.5A0.75 0.5 0 1 1 2.375 10.5A0.75 0.5 0 1 1 3.875 10.5Z'], stroke: ['M4.5 10.5A2.125 2.875 0 0 1 2.375 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'] },
      },
    },
    {
      id: 'E2', label: 'Level end, the shipped lean',
      note: 'As E1, with the foot one grid step further out (1.25 · 1 · 0.875 left of the bowl\'s centre), tuned to the lean the shipped 9 has. What the eye sees: halfway between D2 and E1 — the faint forward lean of the shipped 9, with D2\'s curved tail and level end. Lean +4.2 · +3.8 · +2.8 against a target of about +3: at 24 the quarter grid offers +4.2 or E1\'s +0.2, and +4.2 is nearer. Tail-end air 0.93 · 0.63 · 0.61. Ink 95 · 93 · 96 per cent. Mass 0.03 · 0.03 · 0.04 right. Same pixels at 16 and 20 as E1 and E3 (at 16 one pixel 56 of 255 from E3), so the lean it keeps shows only at 24 and up. Construction: tail a quarter ellipse 3 × 3.75 · 2.5 × 3.25 · 2.25 × 2.875, foot at x 4.5 · 3.5 · 2.25. Every value on the master\'s grid. Filled: D2\'s ring; ink box identical.',
      masters: {
        24: ['M7.75 7.25L7.75 8.5A2 2 0 0 1 5.75 10.5A2 2 0 0 1 3.75 8.5L3.75 7.25A2 2 0 0 1 5.75 5.25A2 2 0 0 1 7.75 7.25Z', 'M7.5 15A1.75 1.5 0 1 1 4 15A1.75 1.5 0 1 1 7.5 15', 'M7.5 15A3 3.75 0 0 1 4.5 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'],
        20: ['M6.25 5.75L6.25 6.75A1.75 1.75 0 0 1 4.5 8.5A1.75 1.75 0 0 1 2.75 6.75L2.75 5.75A1.75 1.75 0 0 1 4.5 4A1.75 1.75 0 0 1 6.25 5.75Z', 'M6 12.75A1.5 1.25 0 1 1 3 12.75A1.5 1.25 0 1 1 6 12.75', 'M6 12.75A2.5 3.25 0 0 1 3.5 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'],
        16: ['M4.625 4.125L4.625 5.125A1.5 1.5 0 0 1 3.125 6.625A1.5 1.5 0 0 1 1.625 5.125L1.625 4.125A1.5 1.5 0 0 1 3.125 2.625A1.5 1.5 0 0 1 4.625 4.125Z', 'M4.5 10.5A1.375 1.125 0 1 1 1.75 10.5A1.375 1.125 0 1 1 4.5 10.5', 'M4.5 10.5A2.25 2.875 0 0 1 2.25 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'],
      },
      filled: {
        24: { fill: ['M8.5 7.25L8.5 8.5A2.75 2.75 0 0 1 5.75 11.25A2.75 2.75 0 0 1 3 8.5L3 7.25A2.75 2.75 0 0 1 5.75 4.5A2.75 2.75 0 0 1 8.5 7.25ZM7 7.25L7 8.5A1.25 1.25 0 0 1 5.75 9.75A1.25 1.25 0 0 1 4.5 8.5L4.5 7.25A1.25 1.25 0 0 1 5.75 6A1.25 1.25 0 0 1 7 7.25Z', 'M8.25 15A2.5 2.25 0 1 1 3.25 15A2.5 2.25 0 1 1 8.25 15ZM6.75 15A1 0.75 0 1 1 4.75 15A1 0.75 0 1 1 6.75 15Z'], stroke: ['M7.5 15A3 3.75 0 0 1 4.5 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'] },
        20: { fill: ['M7 5.75L7 6.75A2.5 2.5 0 0 1 4.5 9.25A2.5 2.5 0 0 1 2 6.75L2 5.75A2.5 2.5 0 0 1 4.5 3.25A2.5 2.5 0 0 1 7 5.75ZM5.5 5.75L5.5 6.75A1 1 0 0 1 4.5 7.75A1 1 0 0 1 3.5 6.75L3.5 5.75A1 1 0 0 1 4.5 4.75A1 1 0 0 1 5.5 5.75Z', 'M6.75 12.75A2.25 2 0 1 1 2.25 12.75A2.25 2 0 1 1 6.75 12.75ZM5.25 12.75A0.75 0.5 0 1 1 3.75 12.75A0.75 0.5 0 1 1 5.25 12.75Z'], stroke: ['M6 12.75A2.5 3.25 0 0 1 3.5 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'] },
        16: { fill: ['M5.25 4.125L5.25 5.125A2.125 2.125 0 0 1 3.125 7.25A2.125 2.125 0 0 1 1 5.125L1 4.125A2.125 2.125 0 0 1 3.125 2A2.125 2.125 0 0 1 5.25 4.125ZM4 4.125L4 5.125A0.875 0.875 0 0 1 3.125 6A0.875 0.875 0 0 1 2.25 5.125L2.25 4.125A0.875 0.875 0 0 1 3.125 3.25A0.875 0.875 0 0 1 4 4.125Z', 'M5.125 10.5A2 1.75 0 1 1 1.125 10.5A2 1.75 0 1 1 5.125 10.5ZM3.875 10.5A0.75 0.5 0 1 1 2.375 10.5A0.75 0.5 0 1 1 3.875 10.5Z'], stroke: ['M4.5 10.5A2.25 2.875 0 0 1 2.25 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'] },
      },
    },
    {
      id: 'E3', label: 'Angled end, upright',
      note: 'The tail turns 75 degrees instead of a quarter and ends heading down-left, 15 degrees below level, halfway between D2\'s level end and D4\'s 28. Its foot stops 0.87 · 0.75 · 0.625 left of the bowl\'s centre, tuned upright. What the eye sees: E1\'s upright hook with a foot that points down into the baseline instead of along it, so the tail looks a little quicker and lighter. Lean +0.1 · +1.0 · −0.7. End 14.9 · 15.0 · 15.0 degrees below level. Tail-end air 0.84 · 0.57 · 0.56. Ink 92 · 91 · 94 per cent, the lightest E. Mass 0.07 · 0.05 · 0.06 right. Same pixels at 16 and 20 as E1 (and as E2, one pixel 56 of 255 apart at 16), so the angled end shows only at 24 and up. Construction: one elliptical arc from the bowl\'s 3 o\'clock heading straight down (rounding tilts its start 0.04 degree at most), radii 3.4 × 3.85 · 2.91 × 3.34 · 2.594 × 2.954, foot at x 4.88 · 3.75 · 2.5. Off grid: the radii at every master, solved for the 15-degree end and rounded to the master\'s decimals; and the foot at 24, 4.88, because on the quarter grid it leans +2.3 (4.75) or −2.0 (5). Filled: D2\'s ring; ink box identical.',
      masters: {
        24: ['M7.75 7.25L7.75 8.5A2 2 0 0 1 5.75 10.5A2 2 0 0 1 3.75 8.5L3.75 7.25A2 2 0 0 1 5.75 5.25A2 2 0 0 1 7.75 7.25Z', 'M7.5 15A1.75 1.5 0 1 1 4 15A1.75 1.5 0 1 1 7.5 15', 'M7.5 15A3.4 3.85 0 0 1 4.88 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'],
        20: ['M6.25 5.75L6.25 6.75A1.75 1.75 0 0 1 4.5 8.5A1.75 1.75 0 0 1 2.75 6.75L2.75 5.75A1.75 1.75 0 0 1 4.5 4A1.75 1.75 0 0 1 6.25 5.75Z', 'M6 12.75A1.5 1.25 0 1 1 3 12.75A1.5 1.25 0 1 1 6 12.75', 'M6 12.75A2.91 3.34 0 0 1 3.75 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'],
        16: ['M4.625 4.125L4.625 5.125A1.5 1.5 0 0 1 3.125 6.625A1.5 1.5 0 0 1 1.625 5.125L1.625 4.125A1.5 1.5 0 0 1 3.125 2.625A1.5 1.5 0 0 1 4.625 4.125Z', 'M4.5 10.5A1.375 1.125 0 1 1 1.75 10.5A1.375 1.125 0 1 1 4.5 10.5', 'M4.5 10.5A2.594 2.954 0 0 1 2.5 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'],
      },
      filled: {
        24: { fill: ['M8.5 7.25L8.5 8.5A2.75 2.75 0 0 1 5.75 11.25A2.75 2.75 0 0 1 3 8.5L3 7.25A2.75 2.75 0 0 1 5.75 4.5A2.75 2.75 0 0 1 8.5 7.25ZM7 7.25L7 8.5A1.25 1.25 0 0 1 5.75 9.75A1.25 1.25 0 0 1 4.5 8.5L4.5 7.25A1.25 1.25 0 0 1 5.75 6A1.25 1.25 0 0 1 7 7.25Z', 'M8.25 15A2.5 2.25 0 1 1 3.25 15A2.5 2.25 0 1 1 8.25 15ZM6.75 15A1 0.75 0 1 1 4.75 15A1 0.75 0 1 1 6.75 15Z'], stroke: ['M7.5 15A3.4 3.85 0 0 1 4.88 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'] },
        20: { fill: ['M7 5.75L7 6.75A2.5 2.5 0 0 1 4.5 9.25A2.5 2.5 0 0 1 2 6.75L2 5.75A2.5 2.5 0 0 1 4.5 3.25A2.5 2.5 0 0 1 7 5.75ZM5.5 5.75L5.5 6.75A1 1 0 0 1 4.5 7.75A1 1 0 0 1 3.5 6.75L3.5 5.75A1 1 0 0 1 4.5 4.75A1 1 0 0 1 5.5 5.75Z', 'M6.75 12.75A2.25 2 0 1 1 2.25 12.75A2.25 2 0 1 1 6.75 12.75ZM5.25 12.75A0.75 0.5 0 1 1 3.75 12.75A0.75 0.5 0 1 1 5.25 12.75Z'], stroke: ['M6 12.75A2.91 3.34 0 0 1 3.75 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'] },
        16: { fill: ['M5.25 4.125L5.25 5.125A2.125 2.125 0 0 1 3.125 7.25A2.125 2.125 0 0 1 1 5.125L1 4.125A2.125 2.125 0 0 1 3.125 2A2.125 2.125 0 0 1 5.25 4.125ZM4 4.125L4 5.125A0.875 0.875 0 0 1 3.125 6A0.875 0.875 0 0 1 2.25 5.125L2.25 4.125A0.875 0.875 0 0 1 3.125 3.25A0.875 0.875 0 0 1 4 4.125Z', 'M5.125 10.5A2 1.75 0 1 1 1.125 10.5A2 1.75 0 1 1 5.125 10.5ZM3.875 10.5A0.75 0.5 0 1 1 2.375 10.5A0.75 0.5 0 1 1 3.875 10.5Z'], stroke: ['M4.5 10.5A2.594 2.954 0 0 1 2.5 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'] },
      },
    },
    {
      id: 'E4', label: 'Straight side, then the turn',
      note: 'The tail drops straight down from the bowl\'s 3 o\'clock for 1.25 · 1 · 0.875, so the 9\'s right side runs vertical as the 0\'s does, and only then turns, a quarter ellipse ending level. What the eye sees: the most upright of the four. The straight right side carries the eye down like a stem, the bottom is one round turn, and the foot ends under the bowl\'s left half, as far out as E2\'s. E1 to E3 stand up by shortening the foot; E4 stands up by keeping the right side straight, so it keeps D2\'s weight. Lean +0.3 · +0.3 · −0.9. Tail-end air 0.93 · 0.63 · 0.61, E2\'s (the same foot). Ink 99 · 96 · 99 per cent, as D2. Mass 0.11 · 0.09 · 0.09 right. Nearly E1\'s pixels at 16 (one pixel 54 of 255 apart) and at 20 (49): the straight side shows as the right-hand pixel staying dark one row lower. Construction: drop to y 16.25 · 13.75 · 11.375, then a quarter ellipse 3 × 2.5 · 2.5 × 2.25 · 2.25 × 2, foot at x 4.5 · 3.5 · 2.25. Every value on the master\'s grid. Filled: D2\'s ring; ink box identical. (recommended)',
      masters: {
        24: ['M7.75 7.25L7.75 8.5A2 2 0 0 1 5.75 10.5A2 2 0 0 1 3.75 8.5L3.75 7.25A2 2 0 0 1 5.75 5.25A2 2 0 0 1 7.75 7.25Z', 'M7.5 15A1.75 1.5 0 1 1 4 15A1.75 1.5 0 1 1 7.5 15', 'M7.5 15V16.25A3 2.5 0 0 1 4.5 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'],
        20: ['M6.25 5.75L6.25 6.75A1.75 1.75 0 0 1 4.5 8.5A1.75 1.75 0 0 1 2.75 6.75L2.75 5.75A1.75 1.75 0 0 1 4.5 4A1.75 1.75 0 0 1 6.25 5.75Z', 'M6 12.75A1.5 1.25 0 1 1 3 12.75A1.5 1.25 0 1 1 6 12.75', 'M6 12.75V13.75A2.5 2.25 0 0 1 3.5 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'],
        16: ['M4.625 4.125L4.625 5.125A1.5 1.5 0 0 1 3.125 6.625A1.5 1.5 0 0 1 1.625 5.125L1.625 4.125A1.5 1.5 0 0 1 3.125 2.625A1.5 1.5 0 0 1 4.625 4.125Z', 'M4.5 10.5A1.375 1.125 0 1 1 1.75 10.5A1.375 1.125 0 1 1 4.5 10.5', 'M4.5 10.5V11.375A2.25 2 0 0 1 2.25 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'],
      },
      filled: {
        24: { fill: ['M8.5 7.25L8.5 8.5A2.75 2.75 0 0 1 5.75 11.25A2.75 2.75 0 0 1 3 8.5L3 7.25A2.75 2.75 0 0 1 5.75 4.5A2.75 2.75 0 0 1 8.5 7.25ZM7 7.25L7 8.5A1.25 1.25 0 0 1 5.75 9.75A1.25 1.25 0 0 1 4.5 8.5L4.5 7.25A1.25 1.25 0 0 1 5.75 6A1.25 1.25 0 0 1 7 7.25Z', 'M8.25 15A2.5 2.25 0 1 1 3.25 15A2.5 2.25 0 1 1 8.25 15ZM6.75 15A1 0.75 0 1 1 4.75 15A1 0.75 0 1 1 6.75 15Z'], stroke: ['M7.5 15V16.25A3 2.5 0 0 1 4.5 18.75', 'M13.75 8.19L16.47 5.47A0.75 0.75 0 0 1 17.53 5.47L20.25 8.19', 'M17 5.25V18.75'] },
        20: { fill: ['M7 5.75L7 6.75A2.5 2.5 0 0 1 4.5 9.25A2.5 2.5 0 0 1 2 6.75L2 5.75A2.5 2.5 0 0 1 4.5 3.25A2.5 2.5 0 0 1 7 5.75ZM5.5 5.75L5.5 6.75A1 1 0 0 1 4.5 7.75A1 1 0 0 1 3.5 6.75L3.5 5.75A1 1 0 0 1 4.5 4.75A1 1 0 0 1 5.5 5.75Z', 'M6.75 12.75A2.25 2 0 1 1 2.25 12.75A2.25 2 0 1 1 6.75 12.75ZM5.25 12.75A0.75 0.5 0 1 1 3.75 12.75A0.75 0.5 0 1 1 5.25 12.75Z'], stroke: ['M6 12.75V13.75A2.5 2.25 0 0 1 3.5 16', 'M11.75 6.44L13.97 4.22A0.75 0.75 0 0 1 15.03 4.22L17.25 6.44', 'M14.5 4V16'] },
        16: { fill: ['M5.25 4.125L5.25 5.125A2.125 2.125 0 0 1 3.125 7.25A2.125 2.125 0 0 1 1 5.125L1 4.125A2.125 2.125 0 0 1 3.125 2A2.125 2.125 0 0 1 5.25 4.125ZM4 4.125L4 5.125A0.875 0.875 0 0 1 3.125 6A0.875 0.875 0 0 1 2.25 5.125L2.25 4.125A0.875 0.875 0 0 1 3.125 3.25A0.875 0.875 0 0 1 4 4.125Z', 'M5.125 10.5A2 1.75 0 1 1 1.125 10.5A2 1.75 0 1 1 5.125 10.5ZM3.875 10.5A0.75 0.5 0 1 1 2.375 10.5A0.75 0.5 0 1 1 3.875 10.5Z'], stroke: ['M4.5 10.5V11.375A2.25 2 0 0 1 2.25 13.375', 'M9.625 4.775L11.554 2.812A0.625 0.625 0 0 1 12.446 2.812L14.375 4.775', 'M12 2.625V13.375'] },
      },
    },
  ],
};
