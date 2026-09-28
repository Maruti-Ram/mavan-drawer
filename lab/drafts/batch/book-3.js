// Repair, not a redesign: the filled 16's title-label slot is 1.25 of air (the line weight) where 24 and 20 cut it at 1.5; F widens that one slot to 1.5, top edge kept on whole pixel y 4 as calendar-filled's 16 does. Every other master and style is S's, path for path.
//
// Measured with facingGap (tools/geometry.mjs, working tree): S filled 16 reads 1.25 across the
// cut; F reads 1.5. Outline 24 · 20 · 16 and filled 24 · 20 are the same constants below in both
// candidates. The outline note text changes only where it stated the old 1.25 (a stale number).

const OUTLINE = {
  24: ['M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.75A2 2 0 0 1 4.75 19.25V4.25A1.5 1.5 0 0 1 6.25 2.75Z', 'M19.25 17.25H6.75A2 2 0 0 0 4.75 19.25', 'M8.75 7.25H15.25'],
  20: ['M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4A1.25 1.25 0 0 1 6 2.75Z', 'M15.25 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5', 'M7.75 6.25H12.25'],
  16: ['M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V2.625A1 1 0 0 1 4.625 1.625Z', 'M12.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875', 'M6.625 4.625H9.375'],
};
const F24 = { fill: ['M6.25 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.75A2.75 2.75 0 0 1 4 19.25V4.25A2.25 2.25 0 0 1 6.25 2ZM6.75 18H18A0.5 0.5 0 0 1 18.5 18.5V19.75A0.75 0.75 0 0 1 17.75 20.5H6.75A1.25 1.25 0 0 1 5.5 19.25A1.25 1.25 0 0 1 6.75 18ZM8.75 6.5H15.25A0.75 0.75 0 0 1 16 7.25A0.75 0.75 0 0 1 15.25 8H8.75A0.75 0.75 0 0 1 8 7.25A0.75 0.75 0 0 1 8.75 6.5Z'], stroke: [] };
const F20 = { fill: ['M6 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6.5A2.5 2.5 0 0 1 4 15.5V4A2 2 0 0 1 6 2ZM6.5 14.5H14A0.5 0.5 0 0 1 14.5 15V16A0.5 0.5 0 0 1 14 16.5H6.5A1 1 0 0 1 5.5 15.5A1 1 0 0 1 6.5 14.5ZM7.75 5.5H12.25A0.75 0.75 0 0 1 13 6.25A0.75 0.75 0 0 1 12.25 7H7.75A0.75 0.75 0 0 1 7 6.25A0.75 0.75 0 0 1 7.75 5.5Z'], stroke: [] };
// Filled 16: cover and page band are the same in both; only the third subpath (the label slot) differs.
const COVER16 = 'M4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V13.375A0.375 0.375 0 0 1 11.375 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12Z';
const SLOT16_S = 'M6.625 4H9.375A0.625 0.625 0 0 1 10 4.625A0.625 0.625 0 0 1 9.375 5.25H6.625A0.625 0.625 0 0 1 6 4.625A0.625 0.625 0 0 1 6.625 4Z';
// y 4 → 5.5: 1.5 tall (was 1.25), top edge unchanged on whole pixel 4, where the outline label's
// ink also starts, so the label's top renders sharp and lands in the same place in both styles.
// x 6 → 10 unchanged (ink 4 long); end radius 0.75 = half the new height, so 6.75 / 9.25 / 4.75
// are the pill's straight-run ends and centre.
const SLOT16_F = 'M6.75 4H9.25A0.75 0.75 0 0 1 10 4.75A0.75 0.75 0 0 1 9.25 5.5H6.75A0.75 0.75 0 0 1 6 4.75A0.75 0.75 0 0 1 6.75 4Z';

const LABEL = 'Page curl, title';
const NOTE_S = "Page curl and a title label. D's cover with one short title line across the upper front, centred: 6.5 · 4.5 · 2.75 long on its centreline (ink 8 · 6 · 4) at y 7.25 · 6.25 · 4.625, 3 · 2 · 1.75 clear under the top edge. Curl radius 2 · 1.75 · 1.5, page band clear 2.5 · 2 · 1.75. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: cover solid, the label knocked out as a slot at its ink size (1.5 · 1.5 · 1.25 tall), page band knocked out at its clear size. The label gives the cover a face at 16 that D lacks, but a line on a portrait box is also file-text's";
const NOTE_F = "Page curl and a title label. D's cover with one short title line across the upper front, centred: 6.5 · 4.5 · 2.75 long on its centreline (ink 8 · 6 · 4) at y 7.25 · 6.25 · 4.625, 3 · 2 · 1.75 clear under the top edge. Curl radius 2 · 1.75 · 1.5, page band clear 2.5 · 2 · 1.75. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: cover solid, the label knocked out as a slot 1.5 tall at every master (8 · 6 · 4 long), page band knocked out at its clear size. 16 only (2026-09-28): the slot is 1.5 where the outline's label line is 1.25, y 4 to 5.5 against the line's 4 to 5.25; the top edges coincide on a whole pixel, as calendar-filled. The label gives the cover a face at 16 that D lacks, but a line on a portrait box is also file-text's";

export default {
  concept: 'book-3',
  set: { S: 'book-3', F: 'book-3' },
  tags: ['pages', 'read', 'library', 'curl', 'title', 'label'],
  question: 'Approve F (recommended): the filled 16 title slot widened from 1.25 to 1.5 of air (top edge kept on y 4), judged against S at 16?',
  candidates: [
    { id: 'S', label: LABEL, note: NOTE_S,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${COVER16}${SLOT16_S}`], stroke: [] } } },
    { id: 'F', label: LABEL, note: NOTE_F,
      masters: OUTLINE,
      filled: { 24: F24, 20: F20, 16: { fill: [`${COVER16}${SLOT16_F}`], stroke: [] } } },
  ],
};
