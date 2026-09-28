// Repair, not a redesign: the filled 16's two window slots are 1.25 of air (the line weight) where 24 and 20 cut them at 1.5; F widens each to 1.5 with its top edge on a whole pixel (y 4, 7), which keeps a solid pixel row between the two windows. Every other master and style is S's, path for path.
//
// Measured with facingGap (tools/geometry.mjs, working tree): S filled 16 reads 1.25 across each
// window; F reads 1.5. Outline 24 · 20 · 16 and filled 24 · 20 are the same constants below in
// every candidate. calendar's whole-pixel edge does not transfer here: the outline dashes sit on
// y 4.5 / 7.5, so their ink edges (3.875 / 5.125) are not whole pixels to share. F puts the slots'
// top edges on whole pixels instead, moving each slot's centre 0.25 below its outline dash's row.
// F2 keeps them centred on the rows, but then the 1.5 of solid between the windows (5.25 to 6.75)
// straddles two pixel rows and renders as two grey rows: at 16 the windows smear into one column.

const OUTLINE = {
  24: ['M4.75 19.75V4.25A1.5 1.5 0 0 1 6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.25A1.5 1.5 0 0 1 4.75 19.75Z', 'M9.75 21.25V17A1.5 1.5 0 0 1 11.25 15.5H12.75A1.5 1.5 0 0 1 14.25 17V21.25', 'M8.5 6H10', 'M14 6H15.5', 'M8.5 9H10', 'M14 9H15.5', 'M8.5 12H10', 'M14 12H15.5'],
  20: ['M4.75 16V4A1.25 1.25 0 0 1 6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6A1.25 1.25 0 0 1 4.75 16Z', 'M8.25 17.25V14A1.25 1.25 0 0 1 9.5 12.75H10.5A1.25 1.25 0 0 1 11.75 14V17.25', 'M7.75 6H8.5', 'M11.5 6H12.25', 'M7.75 9.25H8.5', 'M11.5 9.25H12.25'],
  16: ['M3.625 13.375V2.625A1 1 0 0 1 4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H4.625A1 1 0 0 1 3.625 13.375Z', 'M6.625 14.375V11.375A1 1 0 0 1 7.625 10.375H8.375A1 1 0 0 1 9.375 11.375V14.375', 'M7.125 4.5H8.875', 'M7.125 7.5H8.875'],
};
const F24 = { fill: ['M4 19.75V4.25A2.25 2.25 0 0 1 6.25 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.25A2.25 2.25 0 0 1 4 19.75ZM10.5 22V17A0.75 0.75 0 0 1 11.25 16.25H12.75A0.75 0.75 0 0 1 13.5 17V22ZM8.5 5.25H10A0.75 0.75 0 0 1 10 6.75H8.5A0.75 0.75 0 0 1 8.5 5.25ZM14 5.25H15.5A0.75 0.75 0 0 1 15.5 6.75H14A0.75 0.75 0 0 1 14 5.25ZM8.5 8.25H10A0.75 0.75 0 0 1 10 9.75H8.5A0.75 0.75 0 0 1 8.5 8.25ZM14 8.25H15.5A0.75 0.75 0 0 1 15.5 9.75H14A0.75 0.75 0 0 1 14 8.25ZM8.5 11.25H10A0.75 0.75 0 0 1 10 12.75H8.5A0.75 0.75 0 0 1 8.5 11.25ZM14 11.25H15.5A0.75 0.75 0 0 1 15.5 12.75H14A0.75 0.75 0 0 1 14 11.25Z'], stroke: [] };
const F20 = { fill: ['M4 16V4A2 2 0 0 1 6 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6A2 2 0 0 1 4 16ZM9 18V14A0.5 0.5 0 0 1 9.5 13.5H10.5A0.5 0.5 0 0 1 11 14V18ZM7.75 5.25H8.5A0.75 0.75 0 0 1 8.5 6.75H7.75A0.75 0.75 0 0 1 7.75 5.25ZM11.5 5.25H12.25A0.75 0.75 0 0 1 12.25 6.75H11.5A0.75 0.75 0 0 1 11.5 5.25ZM7.75 8.5H8.5A0.75 0.75 0 0 1 8.5 10H7.75A0.75 0.75 0 0 1 7.75 8.5ZM11.5 8.5H12.25A0.75 0.75 0 0 1 12.25 10H11.5A0.75 0.75 0 0 1 11.5 8.5Z'], stroke: [] };
// Filled 16: tower and door are the same in every candidate; only the two window subpaths differ.
const TOWER16 = 'M3 13.375V2.625A1.625 1.625 0 0 1 4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H4.625A1.625 1.625 0 0 1 3 13.375ZM7.25 15V11.375A0.375 0.375 0 0 1 7.625 11H8.375A0.375 0.375 0 0 1 8.75 11.375V15Z';
const WIN16_S = 'M7.125 3.875H8.875A0.625 0.625 0 0 1 8.875 5.125H7.125A0.625 0.625 0 0 1 7.125 3.875ZM7.125 6.875H8.875A0.625 0.625 0 0 1 8.875 8.125H7.125A0.625 0.625 0 0 1 7.125 6.875Z';
// F2: y 3.75 → 5.25 and 6.75 → 8.25, 1.5 tall (was 1.25), each centred on its outline dash's row
// (4.5, 7.5), so each edge moves 0.125 out. x 6.5 → 9.5 unchanged (ink 3 wide); end radius 0.75 =
// half the new height, so 7.25 / 8.75 are the pill's straight-run ends. Roof to window 2.75, window
// to window 1.5 of solid, window to door 2.75 (was 2.875 · 1.75 · 2.875).
const WIN16_F2 = 'M7.25 3.75H8.75A0.75 0.75 0 0 1 8.75 5.25H7.25A0.75 0.75 0 0 1 7.25 3.75ZM7.25 6.75H8.75A0.75 0.75 0 0 1 8.75 8.25H7.25A0.75 0.75 0 0 1 7.25 6.75Z';
// F: y 4 → 5.5 and 7 → 8.5, top edges on whole pixels 4 and 7 (sharp tops at 16), rows 0.25 below
// the outline's. Roof to window 3, window to window 1.5, window to door 2.5.
const WIN16_F = 'M7.25 4H8.75A0.75 0.75 0 0 1 8.75 5.5H7.25A0.75 0.75 0 0 1 7.25 4ZM7.25 7H8.75A0.75 0.75 0 0 1 8.75 8.5H7.25A0.75 0.75 0 0 1 7.25 7Z';

const LABEL = 'Tower, dash windows, door';
const NOTE_S = "Tower on the portrait keyline (16x20 · 12x16 · 10x14), flat roof, corners r1.5 · 1.25 · 1 (trash's bottom corners; filled outer 2.25 · 2 · 1.625), interior 13x17 · 9x13 · 7.5x11.5. 16 master at stroke 1.25: walls on x.625 / y.625 so the outer edges are whole pixels. Windows as short dashes in pairs (Polaris' construction), ink 3x1.5 · 2.25x1.5 at 24 · 20: 24 three rows on y 6 / 9 / 12, pairs centred on x 9.25 / 14.75 (2.25 off the walls, 2.5 between, 1.5 between rows, 1.75 under the roof, 2 over the door); 20 two rows on y 6 / 9.25 (1.5 across everywhere, 1.75 down). 16: a pair does not fit (7.5 of interior less three 1.5 gaps leaves 1.5 per dash, which is a dot), so one centred dash per row, ink 3x1.25, rows 4.5 / 7.5 (1.625 · 1.75 · 1.625 down). home's door, same width and radius (clear 3 · 2 · 1.5 wide, top corners r1.5 · 1.25 · 1), clear 4.25 · 3 · 2.75 tall. Filled: the silhouette solid (evenodd), each window knocked out at its own ink size and the door at its clear opening, as home-filled";
const FILLED_S = 'Filled: the silhouette solid (evenodd), each window knocked out at its own ink size and the door at its clear opening, as home-filled';
const NOTE_F2 = NOTE_S.replace(FILLED_S, "Filled: the silhouette solid (evenodd), each window knocked out at its own ink size (3x1.5 at 16, where the outline dash is 3x1.25: 16 only, 2026-09-28, the slot holds the 1.5 gap floor, centred on the dash's row, y 3.75 to 5.25 and 6.75 to 8.25) and the door at its clear opening, as home-filled");
const NOTE_F = NOTE_S.replace(FILLED_S, "Filled: the silhouette solid (evenodd), each window knocked out at its own ink size (3x1.5 at 16, where the outline dash is 3x1.25: 16 only, 2026-09-28, the slot holds the 1.5 gap floor, top edge on a whole pixel, y 4 to 5.5 and 7 to 8.5) and the door at its clear opening, as home-filled");

export default {
  concept: 'building-2',
  set: { S: 'building-2', F: 'building-2', F2: 'building-2' },
  tags: ['office', 'company', 'organization', 'business', 'tower', 'dashes', 'door'],
  question: 'Approve F (recommended): the filled 16 window slots widened from 1.25 to 1.5 of air, tops on whole pixels (rows 0.25 lower than the outline dashes), judged against S at 16? (F2: same width centred on the rows; the windows smear together at 16)',
  candidates: [
    { id: 'S', label: LABEL, note: NOTE_S,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${TOWER16}${WIN16_S}`], stroke: [] } } },
    { id: 'F', label: LABEL, note: NOTE_F,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${TOWER16}${WIN16_F}`], stroke: [] } } },
    { id: 'F2', label: LABEL, note: NOTE_F2,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${TOWER16}${WIN16_F2}`], stroke: [] } } },
  ],
};
