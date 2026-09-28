// Repair, not a redesign: the filled 16's doormat slot is 1.25 of air (the line weight) where 24 and 20 cut it at 1.5; F widens that one slot to 1.5, top edge kept on whole pixel y 10 as calendar-filled's 16 does. Every other master and style is S's, path for path.
//
// Measured with facingGap (tools/geometry.mjs, working tree): S filled 16 reads 1.25 across the
// cut; F reads 1.5. Outline 24 · 20 · 16 and filled 24 · 20 are the same constants below in both
// candidates. F's outline note gains one sentence recording the 16-only slot; nothing else in it moves.

const OUTLINE = {
  24: ['M11.1 4.05A1.5 1.5 0 0 1 12.9 4.05L19.65 9.11A1.5 1.5 0 0 1 20.25 10.31L20.25 17.75A2.5 2.5 0 0 1 17.75 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 10.31A1.5 1.5 0 0 1 4.35 9.11Z', 'M9.75 16.5H14.25'],
  20: ['M9.25 4A1.25 1.25 0 0 1 10.75 4L15.75 7.75A1.25 1.25 0 0 1 16.25 8.75L16.25 14.25A2 2 0 0 1 14.25 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 8.75A1.25 1.25 0 0 1 4.25 7.75Z', 'M8.25 12.75H11.75'],
  16: ['M7.4 2.825A1 1 0 0 1 8.6 2.825L12.975 6.106A1 1 0 0 1 13.375 6.906L13.375 11.875A1.5 1.5 0 0 1 11.875 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 6.906A1 1 0 0 1 3.025 6.106Z', 'M6.625 10.625H9.375'],
};
const F24 = { fill: ['M10.65 3.45A2.25 2.25 0 0 1 13.35 3.45L20.1 8.51A2.25 2.25 0 0 1 21 10.31L21 17.75A3.25 3.25 0 0 1 17.75 21L6.25 21A3.25 3.25 0 0 1 3 17.75L3 10.31A2.25 2.25 0 0 1 3.9 8.51ZM9.75 15.75H14.25A0.75 0.75 0 0 1 14.25 17.25H9.75A0.75 0.75 0 0 1 9.75 15.75Z'], stroke: [] };
const F20 = { fill: ['M8.8 3.4A2 2 0 0 1 11.2 3.4L16.2 7.15A2 2 0 0 1 17 8.75L17 14.25A2.75 2.75 0 0 1 14.25 17L5.75 17A2.75 2.75 0 0 1 3 14.25L3 8.75A2 2 0 0 1 3.8 7.15ZM8.25 12H11.75A0.75 0.75 0 0 1 11.75 13.5H8.25A0.75 0.75 0 0 1 8.25 12Z'], stroke: [] };
// Filled 16: the house is the same in both; only the second subpath (the doormat slot) differs.
const HOUSE16 = 'M7.025 2.325A1.625 1.625 0 0 1 8.975 2.325L13.35 5.606A1.625 1.625 0 0 1 14 6.906L14 11.875A2.125 2.125 0 0 1 11.875 14L4.125 14A2.125 2.125 0 0 1 2 11.875L2 6.906A1.625 1.625 0 0 1 2.65 5.606Z';
const SLOT16_S = 'M6.625 10H9.375A0.625 0.625 0 0 1 9.375 11.25H6.625A0.625 0.625 0 0 1 6.625 10Z';
// y 10 → 11.5: 1.5 tall (was 1.25), top edge unchanged on whole pixel 10, where the outline line's
// ink also starts, so the line's top renders sharp and lands in the same place in both styles.
// x 6 → 10 unchanged (ink 4 long); end radius 0.75 = half the new height, so 6.75 / 9.25 are the
// pill's straight-run ends. Floor below it 2.5 (was 2.75).
const SLOT16_F = 'M6.75 10H9.25A0.75 0.75 0 0 1 9.25 11.5H6.75A0.75 0.75 0 0 1 6.75 10Z';

const LABEL = 'Low roof, doormat line';
const NOTE_S = 'OUTSIDE THE ANGLE RULE (36.9 degrees). J with the short level line instead of the door. Roof is 36.46 · 36.61 · 36.72% of the height, walls 10.69 · 8.13 · 6.97 tall; line 6 · 5 · 4 long, 2.25 · 2 · 1.5 above the floor';
const NOTE_F = NOTE_S + '. Filled: the line knocked out as a slot 1.5 tall at every master. 16 only (2026-09-28): the slot is 1.5 where the outline line is 1.25, y 10 to 11.5 against the line\'s 10 to 11.25; the top edges coincide on a whole pixel, as calendar-filled';

export default {
  concept: 'home-3',
  set: { S: 'home-3', F: 'home-3' },
  tags: ['house', 'start', 'low roof'],
  question: 'Approve F (recommended): the filled 16 doormat slot widened from 1.25 to 1.5 of air (top edge kept on y 10), judged against S at 16?',
  candidates: [
    { id: 'S', label: LABEL, note: NOTE_S,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${HOUSE16}${SLOT16_S}`], stroke: [] } } },
    { id: 'F', label: LABEL, note: NOTE_F,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${HOUSE16}${SLOT16_F}`], stroke: [] } } },
  ],
};
