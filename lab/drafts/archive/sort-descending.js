// sort-descending, second board (sheet #358). The arrow version has shipped - three bars stepping
// long to short with arrow-down's full-height arrow - so everything here ships as sort-descending-2
// onward, EXCEPT the alphabetic ones, which may instead take the name the sheet already reserves at
// row 433: sort-alpha-descending. Say which at approval.
//
// TEN DRAWINGS OF ONE SYMBOL, not ten metaphors. Maruti: "if we want to inherit the symbol but draw
// to our spec that's allowed to an extent", and "the 'A','Z','0','9' - the drawings are weird bad,
// not well balanced. focus on those more." So the symbol is settled - Z over A, or 9 over 1, beside
// bars, which is what Ant Design and Font Awesome ship - and the ten differ only in how the
// characters are drawn: the apex, the splay, the crossbar's height, the Z's diagonal, the letters'
// share against the bars, the box's height, and whether the bars rag (repeating the direction) or
// run even (the letters carrying it alone).
//
// NO FLAT APEX ANYWHERE. Maruti, mid-round, on the previous board's A: "This type of A - NOPE.
// reject." A flat, truncated apex over splayed legs reads as a triangle with its top cut off. Every
// A here comes either to a true point or to C10's own bend - an arc of radius half the weight,
// 0.75 · 0.75 · 0.625 on the centreline - and nothing in between.
//
// THE FILLED STYLE IS SOLVED, AND IT IS WHY THE BARS ARE THERE. A letter alone has nothing to fill,
// so it would be line-heavy and thicken to 2.5 · 2 · 2 - and a counter loses the WHOLE of the added
// weight, which is what killed round one (the A's filled counter went to 0.08 at 16). Beside a shape
// that can be filled, a letter keeps the outline stroke. That is the set's standard filled rule and
// list-ordered-filled ships exactly it: its bars are filled shapes and its 1 and 2 are byte-identical
// to the outline's. Every candidate here does the same - filled bars (rounded rectangles at
// 2.5 · 2 · 2), characters untouched at 1.5 · 1.5 · 1.25. So every counter and clearance quoted below
// is the SAME NUMBER in both styles; there is no filled column because there is nothing to report.
//
// WHY NO ARROW BESIDE THE LETTERS, measured. arrow-down's head is 10 · 9 · 8 of ink across - 67% of
// the mark at every master. After §6's 1.5 that leaves 6.5 · 3.5 · 2.5 for the characters, and 2.5 at
// 16 is not a letter. The arrow is also unfillable on its own, so a letters-and-arrow drawing has no
// partner to fill and the letters thicken again. Both reasons point the same way: the bars ARE the
// companion, and they are the shipped icon's own, on menu's own rows.
//
// EVERY CURVE IS A CIRCULAR ARC, radius exactly half the bowl height, never an ellipse. The 9's bowl
// is built that way by construction, so its D-slot ratio (rx - stroke/2)/(ry - stroke/2) is 1.00 at
// 24, 20 and 16 - the only curve on this board. The A and the Z have none.
//
// THE 9 SURVIVED, AND IT IS 9 OVER 1, NOT 9 OVER 0. Round one's 9 read as a q because holding §6's
// 1.5 of counter forced the bowl to 77-83% of the letter. Holding it at C19's numeral floor instead -
// what list-ordered's 2 already does - puts the bowl back at 59 · 63 · 62% (H), and in the taller box
// at 52 · 52 · 50% (I), which is dead centre of a real 9's 55-60. The pair is 9-1 because the set's
// own numerals start at 1, Font Awesome names its icons arrow-down-9-1, and a 0 beside a 9 is two
// round shoulders - no contrast at 16, where a 1 is a clean vertical stroke.
//
// SIDE BY SIDE WAS MEASURED AND DROPPED. Two characters side by side at 16 need 5.25 + 1.5 + 5.25 of
// width, which leaves nothing for the bars; put the bars underneath instead and the filled rows need
// 2 + 1.5 + 2 of height, so one bar fits and it stops reading as a list. Stacked is also what says
// "order". The Z's typeset longer lower arm was drawn too: it costs 0.24 of the diagonal's clearance
// at 16 (1.81 to 1.57) for a difference the eye cannot find at that size, so it is not on the board.
//
// LINT CANNOT SEE ANY OF THIS. A crossbar landing on the legs is a junction and §5b's turn gate never
// reaches an apex, so a clean draft-check proves nothing here. Every candidate was rasterised at
// exactly 16x16 and looked at; where a note says how something reads at 16 px, that is the pixels.

export default {
  concept: 'sort-descending',
  context: 'UI & Layout - sheet row #358. The arrow version has shipped; these are the alphabetic and numeric sort symbols, shipping as sort-descending-2 onward, or under the reserved name sort-alpha-descending (sheet row 433) for the letters.',
  family: ['sort-descending', 'sort-ascending', 'sort', 'list-ordered', 'menu', 'filter-2', 'bold'],
  question: 'Which drawing of the characters do you want - and should the alphabetic one take the reserved name sort-alpha-descending?',
  candidates: [
    {
      id: 'A', label: "Pointed apex",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "The plain drawing, and the one everything else is measured against: a true point at the apex, the crossbar as low as it can sit and still leave a leg beneath it, and a Z with equal arms whose diagonal lands exactly on their ends. Bars 7.5/5.5/3.5 at 24, 5.5/4/2.5 at 20, 4.5/3.25/2 at 16, on menu's own rows; characters 9 · 7 · 6 wide. A: legs 29.05 · 30.07 · 30.7° off vertical, crossbar 5 · 3.5 · 3 below the apex with 1.75 · 1.25 · 1 of leg under it, counter 2.71 · 1.25 · 1.15 tall and 3.01 · 1.45 · 1.37 across at the crossbar. Z: diagonal 41.99 · 40.82 · 40.1° off horizontal, arms 7.5 · 5.5 · 4.75, the diagonal clears the far arm end by 3.52 · 2.09 · 1.81. The point is what costs it. Two inner edges meeting at an angle meet BELOW the apex - 1.22 below it at 16 - so the counter starts late and measures 1.15, above C19's glyph floor of 1 but under §6's 1.5. Rasterised at 16x16: the A reads as a solid triangle with a grey middle, not a letter with a hole.",
      masters: {
        24: ['M3.75 7.5H9.75', 'M3.75 12H7.75', 'M3.75 16.5H5.75', 'M12.75 3.75H20.25L12.75 10.5H20.25', 'M12.75 20.25L16.5 13.5L20.25 20.25', 'M13.72 18.5H19.28'],
        20: ['M3.75 5.5H7.75', 'M3.75 10H6.25', 'M3.75 14.5H4.75', 'M10.75 3.75H16.25L10.75 8.5H16.25', 'M10.75 16.25L13.5 11.5L16.25 16.25', 'M11.47 15H15.53'],
        16: ['M2.625 3.5H5.875', 'M2.625 8H4.625', 'M2.625 12.5H3.375', 'M8.625 2.625H13.375L8.625 6.625H13.375', 'M8.625 13.375L11 9.375L13.375 13.375', 'M9.219 12.375H12.781'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H9.25A1.25 1.25 0 0 1 9.25 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H7.25A1.25 1.25 0 0 1 7.25 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M12.75 3.75H20.25L12.75 10.5H20.25', 'M12.75 20.25L16.5 13.5L20.25 20.25', 'M13.72 18.5H19.28'],
        },
        20: {
          fill: ['M4 4.5H7.5A1 1 0 0 1 7.5 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H6A1 1 0 0 1 6 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M10.75 3.75H16.25L10.75 8.5H16.25', 'M10.75 16.25L13.5 11.5L16.25 16.25', 'M11.47 15H15.53'],
        },
        16: {
          fill: ['M3 2.5H5.5A1 1 0 0 1 5.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H4.25A1 1 0 0 1 4.25 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M8.625 2.625H13.375L8.625 6.625H13.375', 'M8.625 13.375L11 9.375L13.375 13.375', 'M9.219 12.375H12.781'],
        },
      },
    },
    {
      id: 'B', label: "Softened apex",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "A's letters with the apex drawn as C10's own bend - an arc of radius half the weight, 0.75 · 0.75 · 0.625, the same corner every bent mark in the set already turns - with the vertex raised so the outer ink still reaches the top of the box. Bars 7.5/5.5/3.5 at 24, 5.5/4/2.5 at 20, 4.5/3.25/2 at 16, on menu's own rows; characters 9 · 7 · 6 wide. A: legs 25.92 · 25.62 · 26.42° off vertical, crossbar 5 · 3.5 · 3 below the apex with 1.75 · 1.25 · 1 of leg under it, counter 3.5 · 2 · 1.75 tall and 3.4 · 1.92 · 1.74 across at the crossbar. Z: diagonal 41.99 · 40.82 · 40.1° off horizontal, arms 7.5 · 5.5 · 4.75, the diagonal clears the far arm end by 3.52 · 2.09 · 1.81. Two things fall out of that arc, and they are the whole argument for this candidate. The inner edge of an arc of radius half the weight has radius zero, so the counter now begins at the arc's own centre rather than 1.22 lower down: counter 3.5 · 2 · 1.75, which clears §6's 1.5 at every master - and because the letters keep the outline stroke in the filled twin, that is the number in BOTH styles. And holding the ink to the same box with a rounded apex stands the legs up: 25.92 · 25.62 · 26.42° against A's 29-31°, which reads like type rather than a road sign. At 16 px the counter is a visible notch. (recommended)",
      masters: {
        24: ['M3.75 7.5H9.75', 'M3.75 12H7.75', 'M3.75 16.5H5.75', 'M12.75 3.75H20.25L12.75 10.5H20.25', 'M12.75 20.25L15.83 13.92A0.75 0.75 0 0 1 17.17 13.92L20.25 20.25', 'M13.6 18.5H19.4'],
        20: ['M3.75 5.5H7.75', 'M3.75 10H6.25', 'M3.75 14.5H4.75', 'M10.75 3.75H16.25L10.75 8.5H16.25', 'M10.75 16.25L12.82 11.93A0.75 0.75 0 0 1 14.18 11.93L16.25 16.25', 'M11.35 15H15.65'],
        16: ['M2.625 3.5H5.875', 'M2.625 8H4.625', 'M2.625 12.5H3.375', 'M8.625 2.625H13.375L8.625 6.625H13.375', 'M8.625 13.375L10.44 9.722A0.625 0.625 0 0 1 11.56 9.722L13.375 13.375', 'M9.122 12.375H12.878'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H9.25A1.25 1.25 0 0 1 9.25 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H7.25A1.25 1.25 0 0 1 7.25 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M12.75 3.75H20.25L12.75 10.5H20.25', 'M12.75 20.25L15.83 13.92A0.75 0.75 0 0 1 17.17 13.92L20.25 20.25', 'M13.6 18.5H19.4'],
        },
        20: {
          fill: ['M4 4.5H7.5A1 1 0 0 1 7.5 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H6A1 1 0 0 1 6 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M10.75 3.75H16.25L10.75 8.5H16.25', 'M10.75 16.25L12.82 11.93A0.75 0.75 0 0 1 14.18 11.93L16.25 16.25', 'M11.35 15H15.65'],
        },
        16: {
          fill: ['M3 2.5H5.5A1 1 0 0 1 5.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H4.25A1 1 0 0 1 4.25 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M8.625 2.625H13.375L8.625 6.625H13.375', 'M8.625 13.375L10.44 9.722A0.625 0.625 0 0 1 11.56 9.722L13.375 13.375', 'M9.122 12.375H12.878'],
        },
      },
    },
    {
      id: 'C', label: "Wide splay, pointed",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "A's pointed apex with the letters widened until the splay opens the counter - width bought from the arm, never from a bulge. Bars 6/4.75/3.5 at 24, 4.25/3.5/2.5 at 20, 3.5/2.75/2 at 16, on menu's own rows; characters 10.5 · 8.25 · 7 wide. A: legs 33.69 · 35.39 · 35.71° off vertical, crossbar 5 · 3.5 · 3 below the apex with 1.75 · 1.25 · 1 of leg under it, counter 2.9 · 1.46 · 1.3 tall and 3.86 · 2.07 · 1.87 across at the crossbar. Z: diagonal 36.87 · 35.13 · 34.82° off horizontal, arms 9 · 6.75 · 5.75, the diagonal clears the far arm end by 3.9 · 2.38 · 2.03. Widening does two things at once: the legs splay to 33-36°, which lifts the counter from 1.15 to 1.3 at 16, and it lays the Z's diagonal down from 42° to 35-37°, which lifts the Z's own clearance from 1.81 to 2.03. It is paid for out of the bars - the letters take 58% of the width, so the rag runs 3.5 · 2.75 · 2 at 16 and its shortest bar is a 2-unit stub - and out of the letter, which at 1.33 wide for every 1 tall is a display A rather than a text one.",
      masters: {
        24: ['M3.75 7.5H8.25', 'M3.75 12H7', 'M3.75 16.5H5.75', 'M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.75 13.5L20.25 20.25', 'M12.42 18.5H19.08'],
        20: ['M3.75 5.5H6.5', 'M3.75 10H5.75', 'M3.75 14.5H4.75', 'M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.88 11.5L16.25 16.25', 'M10.39 15H15.36'],
        16: ['M2.625 3.5H4.875', 'M2.625 8H4.125', 'M2.625 12.5H3.375', 'M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L10.5 9.375L13.375 13.375', 'M8.344 12.375H12.656'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H7.75A1.25 1.25 0 0 1 7.75 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H6.5A1.25 1.25 0 0 1 6.5 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.75 13.5L20.25 20.25', 'M12.42 18.5H19.08'],
        },
        20: {
          fill: ['M4 4.5H6.25A1 1 0 0 1 6.25 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H5.5A1 1 0 0 1 5.5 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.88 11.5L16.25 16.25', 'M10.39 15H15.36'],
        },
        16: {
          fill: ['M3 2.5H4.5A1 1 0 0 1 4.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H3.75A1 1 0 0 1 3.75 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L10.5 9.375L13.375 13.375', 'M8.344 12.375H12.656'],
        },
      },
    },
    {
      id: 'D', label: "Wide splay, softened",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "C's wide letters with B's softened apex: the widest splay on the board and the biggest counter. Bars 6/4.75/3.5 at 24, 4.25/3.5/2.5 at 20, 3.5/2.75/2 at 16, on menu's own rows; characters 10.5 · 8.25 · 7 wide. A: legs 31.13 · 31.92 · 32.32° off vertical, crossbar 5 · 3.5 · 3 below the apex with 1.75 · 1.25 · 1 of leg under it, counter 3.5 · 2 · 1.75 tall and 4.23 · 2.49 · 2.21 across at the crossbar. Z: diagonal 36.87 · 35.13 · 34.82° off horizontal, arms 9 · 6.75 · 5.75, the diagonal clears the far arm end by 3.9 · 2.38 · 2.03. Counter 3.5 · 2 · 1.75, the same as B's, because the arc's radius and the crossbar's depth fix it and the width does not - what the width buys here is the counter's WIDTH, 4.23 · 2.49 · 2.21 against B's 3.4 · 1.92 · 1.74. It is the most legible A at 16 px on the board. Against it: the same two costs as C - a rag of stubs and a letter that is wider than it is tall at 24.",
      masters: {
        24: ['M3.75 7.5H8.25', 'M3.75 12H7', 'M3.75 16.5H5.75', 'M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.11 13.86A0.75 0.75 0 0 1 16.39 13.86L20.25 20.25', 'M12.31 18.5H19.19'],
        20: ['M3.75 5.5H6.5', 'M3.75 10H5.75', 'M3.75 14.5H4.75', 'M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.24 11.85A0.75 0.75 0 0 1 13.51 11.85L16.25 16.25', 'M10.28 15H15.47'],
        16: ['M2.625 3.5H4.875', 'M2.625 8H4.125', 'M2.625 12.5H3.375', 'M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L9.972 9.666A0.625 0.625 0 0 1 11.028 9.666L13.375 13.375', 'M8.258 12.375H12.742'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H7.75A1.25 1.25 0 0 1 7.75 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H6.5A1.25 1.25 0 0 1 6.5 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.11 13.86A0.75 0.75 0 0 1 16.39 13.86L20.25 20.25', 'M12.31 18.5H19.19'],
        },
        20: {
          fill: ['M4 4.5H6.25A1 1 0 0 1 6.25 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H5.5A1 1 0 0 1 5.5 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.24 11.85A0.75 0.75 0 0 1 13.51 11.85L16.25 16.25', 'M10.28 15H15.47'],
        },
        16: {
          fill: ['M3 2.5H4.5A1 1 0 0 1 4.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H3.75A1 1 0 0 1 3.75 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L9.972 9.666A0.625 0.625 0 0 1 11.028 9.666L13.375 13.375', 'M8.258 12.375H12.742'],
        },
      },
    },
    {
      id: 'E', label: "Small letters, long rag",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "The other end of the trade: small letters, long rag, so the icon reads as a sorted list first and an alphabet second. Bars 8.25/6/3.5 at 24, 6/4.25/2.5 at 20, 5/3.5/2 at 16, on menu's own rows; characters 8.25 · 6.5 · 5.5 wide. A: legs 26.57 · 27.76 · 27.98° off vertical, crossbar 5 · 3.5 · 3 below the apex with 1.75 · 1.25 · 1 of leg under it, counter 2.57 · 1.14 · 1.04 tall and 2.57 · 1.2 · 1.11 across at the crossbar. Z: diagonal 45 · 43.53 · 43.26° off horizontal, arms 6.75 · 5 · 4.25, the diagonal clears the far arm end by 3.27 · 1.94 · 1.66. The bars now run 8.25 · 6 · 5 at their longest against C's 6 · 4.25 · 3.5, and they carry the descending message on their own. The letters pay: with a pointed apex and only 5.5 of width at 16 the A's counter is 1.04 - it holds C19's floor of 1 and nothing more - and the Z's diagonal, now at 43-45°, clears the far arm by 1.66. Use this one if the eye wants the left half to read as a list.",
      masters: {
        24: ['M3.75 7.5H10.5', 'M3.75 12H8.25', 'M3.75 16.5H5.75', 'M13.5 3.75H20.25L13.5 10.5H20.25', 'M13.5 20.25L16.88 13.5L20.25 20.25', 'M14.38 18.5H19.38'],
        20: ['M3.75 5.5H8.25', 'M3.75 10H6.5', 'M3.75 14.5H4.75', 'M11.25 3.75H16.25L11.25 8.5H16.25', 'M11.25 16.25L13.75 11.5L16.25 16.25', 'M11.91 15H15.59'],
        16: ['M2.625 3.5H6.375', 'M2.625 8H4.875', 'M2.625 12.5H3.375', 'M9.125 2.625H13.375L9.125 6.625H13.375', 'M9.125 13.375L11.25 9.375L13.375 13.375', 'M9.656 12.375H12.844'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H10A1.25 1.25 0 0 1 10 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H7.75A1.25 1.25 0 0 1 7.75 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M13.5 3.75H20.25L13.5 10.5H20.25', 'M13.5 20.25L16.88 13.5L20.25 20.25', 'M14.38 18.5H19.38'],
        },
        20: {
          fill: ['M4 4.5H8A1 1 0 0 1 8 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H6.25A1 1 0 0 1 6.25 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M11.25 3.75H16.25L11.25 8.5H16.25', 'M11.25 16.25L13.75 11.5L16.25 16.25', 'M11.91 15H15.59'],
        },
        16: {
          fill: ['M3 2.5H6A1 1 0 0 1 6 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H4.5A1 1 0 0 1 4.5 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M9.125 2.625H13.375L9.125 6.625H13.375', 'M9.125 13.375L11.25 9.375L13.375 13.375', 'M9.656 12.375H12.844'],
        },
      },
    },
    {
      id: 'F', label: "Crossbar up",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "C's letters with the crossbar where type puts it rather than where the counter wants it: 31-32% up from the baseline instead of 25%. Bars 6/4.75/3.5 at 24, 4.25/3.5/2.5 at 20, 3.5/2.75/2 at 16, on menu's own rows; characters 10.5 · 8.25 · 7 wide. A: legs 33.69 · 35.39 · 35.71° off vertical, crossbar 4.5 · 3.25 · 2.75 below the apex with 2.25 · 1.5 · 1.25 of leg under it, counter 2.4 · 1.21 · 1.05 tall and 3.2 · 1.71 · 1.52 across at the crossbar. Z: diagonal 36.87 · 35.13 · 34.82° off horizontal, arms 9 · 6.75 · 5.75, the diagonal clears the far arm end by 3.9 · 2.38 · 2.03. This is the crossbar-height question on its own. Raising it by a quarter unit at 16 gives the legs a proper 1.25 beneath the bar instead of 1.0, so the A stands rather than squats - and takes the counter from 1.3 down to 1.05, because the counter is a taper and closes faster than the arithmetic suggests. Both ends of that trade are visible at 24; at 16 px only the counter is.",
      masters: {
        24: ['M3.75 7.5H8.25', 'M3.75 12H7', 'M3.75 16.5H5.75', 'M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.75 13.5L20.25 20.25', 'M12.75 18H18.75'],
        20: ['M3.75 5.5H6.5', 'M3.75 10H5.75', 'M3.75 14.5H4.75', 'M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.88 11.5L16.25 16.25', 'M10.57 14.75H15.18'],
        16: ['M2.625 3.5H4.875', 'M2.625 8H4.125', 'M2.625 12.5H3.375', 'M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L10.5 9.375L13.375 13.375', 'M8.523 12.125H12.477'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H7.75A1.25 1.25 0 0 1 7.75 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H6.5A1.25 1.25 0 0 1 6.5 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.75 13.5L20.25 20.25', 'M12.75 18H18.75'],
        },
        20: {
          fill: ['M4 4.5H6.25A1 1 0 0 1 6.25 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H5.5A1 1 0 0 1 5.5 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.88 11.5L16.25 16.25', 'M10.57 14.75H15.18'],
        },
        16: {
          fill: ['M3 2.5H4.5A1 1 0 0 1 4.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H3.75A1 1 0 0 1 3.75 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L10.5 9.375L13.375 13.375', 'M8.523 12.125H12.477'],
        },
      },
    },
    {
      id: 'G', label: "Even rows",
      keyline: 'mark',
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "C's letters beside three EQUAL rows instead of a rag, so the direction is carried by Z-over-A alone - which is what the reference sets actually do: the lines say \"a list\", the mark says \"Z to A\". Bars 6/6/6 at 24, 4.25/4.25/4.25 at 20, 3.5/3.5/3.5 at 16, on menu's own rows; characters 10.5 · 8.25 · 7 wide. A: legs 33.69 · 35.39 · 35.71° off vertical, crossbar 5 · 3.5 · 3 below the apex with 1.75 · 1.25 · 1 of leg under it, counter 2.9 · 1.46 · 1.3 tall and 3.86 · 2.07 · 1.87 across at the crossbar. Z: diagonal 36.87 · 35.13 · 34.82° off horizontal, arms 9 · 6.75 · 5.75, the diagonal clears the far arm end by 3.9 · 2.38 · 2.03. Equal rows read as a block of text at 16 px where a rag of the same width reads as three loose dashes, so this has the best-reading left half here. Against it: nothing in the drawing repeats the direction, and the rows sit on menu's own pixel rows, so at 16 the left half is menu's texture.",
      masters: {
        24: ['M3.75 7.5H8.25', 'M3.75 12H8.25', 'M3.75 16.5H8.25', 'M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.75 13.5L20.25 20.25', 'M12.42 18.5H19.08'],
        20: ['M3.75 5.5H6.5', 'M3.75 10H6.5', 'M3.75 14.5H6.5', 'M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.88 11.5L16.25 16.25', 'M10.39 15H15.36'],
        16: ['M2.625 3.5H4.875', 'M2.625 8H4.875', 'M2.625 12.5H4.875', 'M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L10.5 9.375L13.375 13.375', 'M8.344 12.375H12.656'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H7.75A1.25 1.25 0 0 1 7.75 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H7.75A1.25 1.25 0 0 1 7.75 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H7.75A1.25 1.25 0 0 1 7.75 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M11.25 3.75H20.25L11.25 10.5H20.25', 'M11.25 20.25L15.75 13.5L20.25 20.25', 'M12.42 18.5H19.08'],
        },
        20: {
          fill: ['M4 4.5H6.25A1 1 0 0 1 6.25 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H6.25A1 1 0 0 1 6.25 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H6.25A1 1 0 0 1 6.25 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M9.5 3.75H16.25L9.5 8.5H16.25', 'M9.5 16.25L12.88 11.5L16.25 16.25', 'M10.39 15H15.36'],
        },
        16: {
          fill: ['M3 2.5H4.5A1 1 0 0 1 4.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H4.5A1 1 0 0 1 4.5 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H4.5A1 1 0 0 1 4.5 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M7.625 2.625H13.375L7.625 6.625H13.375', 'M7.625 13.375L10.5 9.375L13.375 13.375', 'M8.344 12.375H12.656'],
        },
      },
    },
    {
      id: 'H', label: "9 over 1",
      keyline: 'mark',
      glyph: 'numeral',
      tags: ["sort","descending","order","high to low","sort by","numeric","numerals","9 to 1","glyph"],
      note: "The numeric symbol: 9 over 1, which is the pairing Font Awesome encodes in its own names (arrow-down-9-1) and the one our set's numeral precedent starts from - list-ordered ships a 1 and a 2. Bars 11/7.25/3.5 at 24, 8/5.25/2.5 at 20, 6.75/4.375/2 at 16, on menu's own rows; characters 5.5 · 4.5 · 3.75 wide. 9: the bowl is a circular arc, radius exactly half the bowl height, so the D-slot ratio (rx - stroke/2)/(ry - stroke/2) is 1.00 at every master; bowl 59.26 · 63.16 · 62.5% of the centreline height, counter 2.5 · 1.5 · 1.25, tail 2.75 · 1.75 · 1.5 with a 1 · 0.75 · 0.63 curl left at the foot. 1: list-ordered's own drawing, a flag and a stem, with no counter to lose. Round one could not draw a 9: chasing §6's 1.5 of counter pushed its bowl to 77-83% of the letter and it read as a q. Holding the counter at C19's numeral floor instead - exactly what list-ordered's 2 already does, declared glyph: numeral - brings the bowl back to 59.26 · 63.16 · 62.5%, which is a real 9's proportion, and the curl at the foot is the thing a q does not have. 9 over 0 was drawn and dropped: a 0 and a 9 are both round-shouldered, which is no contrast at all at 16, where a 1 is a clean vertical. Honest verdict at 16 px: the 1 is the crispest character on this board and the 9 is the softest - its 1.25 counter fills to grey, the same way list-ordered's 2 does today.",
      masters: {
        24: ['M3.75 7.5H13.25', 'M3.75 12H9.5', 'M3.75 16.5H5.75', 'M20.25 5.75A2 2 0 0 1 16.25 5.75A2 2 0 0 1 20.25 5.75Z', 'M20.25 5.75V9.5A1 1 0 0 0 19.25 10.5', 'M17.25 14.5L18.25 13.5V20.25'],
        20: ['M3.75 5.5H10.25', 'M3.75 10H7.5', 'M3.75 14.5H4.75', 'M16.25 5.25A1.5 1.5 0 0 1 13.25 5.25A1.5 1.5 0 0 1 16.25 5.25Z', 'M16.25 5.25V7.75A0.75 0.75 0 0 0 15.5 8.5', 'M13.75 12.5L14.75 11.5V16.25'],
        16: ['M2.625 3.5H8.125', 'M2.625 8H5.75', 'M2.625 12.5H3.375', 'M13.375 3.875A1.25 1.25 0 0 1 10.875 3.875A1.25 1.25 0 0 1 13.375 3.875Z', 'M13.375 3.875V6A0.625 0.625 0 0 0 12.75 6.625', 'M11.125 10.375L12.125 9.375V13.375'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H12.75A1.25 1.25 0 0 1 12.75 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H9A1.25 1.25 0 0 1 9 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M20.25 5.75A2 2 0 0 1 16.25 5.75A2 2 0 0 1 20.25 5.75Z', 'M20.25 5.75V9.5A1 1 0 0 0 19.25 10.5', 'M17.25 14.5L18.25 13.5V20.25'],
        },
        20: {
          fill: ['M4 4.5H10A1 1 0 0 1 10 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H7.25A1 1 0 0 1 7.25 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M16.25 5.25A1.5 1.5 0 0 1 13.25 5.25A1.5 1.5 0 0 1 16.25 5.25Z', 'M16.25 5.25V7.75A0.75 0.75 0 0 0 15.5 8.5', 'M13.75 12.5L14.75 11.5V16.25'],
        },
        16: {
          fill: ['M3 2.5H7.75A1 1 0 0 1 7.75 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H5.375A1 1 0 0 1 5.375 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M13.375 3.875A1.25 1.25 0 0 1 10.875 3.875A1.25 1.25 0 0 1 13.375 3.875Z', 'M13.375 3.875V6A0.625 0.625 0 0 0 12.75 6.625', 'M11.125 10.375L12.125 9.375V13.375'],
        },
      },
    },
    {
      id: 'I', label: "9 over 1, tall box",
      box: { 24: [18, 20], 20: [14, 16], 16: [12, 14] },
      glyph: 'numeral',
      tags: ["sort","descending","order","high to low","sort by","numeric","numerals","9 to 1","glyph"],
      note: "H's numerals in a taller box - the icon stands as tall as a circle icon, 20 · 16 · 14 instead of 18 · 14 · 12, declared as an agreed ink box (18x20 · 14x16 · 12x14) - which is what a 9 actually needs. Bars 11/7.25/3.5 at 24, 8/5.25/2.5 at 20, 6.75/4.375/2 at 16, on menu's own rows; characters 5.5 · 4.5 · 3.75 wide. 9: the bowl is a circular arc, radius exactly half the bowl height, so the D-slot ratio (rx - stroke/2)/(ry - stroke/2) is 1.00 at every master; bowl 51.61 · 52.17 · 50% of the centreline height, counter 2.5 · 1.5 · 1.25, tail 3.75 · 2.75 · 2.5 with a 1 · 0.75 · 0.63 curl left at the foot. That is the whole point: the same counter of 2.5 · 1.5 · 1.25 now takes only 51.61 · 52.17 · 50% of the letter instead of 59 · 63 · 62%, which is dead centre of a real 9's 55-60, and the tail grows to 3.75 · 2.75 · 2.5. The q reading goes away entirely. The cost is scope, not drawing: the icon is 2 units taller than menu, filter-2 and the shipped sort-descending, so in a toolbar it will not sit on their rows.",
      masters: {
        24: ['M3.75 7.5H13.25', 'M3.75 12H9.5', 'M3.75 16.5H5.75', 'M20.25 4.75A2 2 0 0 1 16.25 4.75A2 2 0 0 1 20.25 4.75Z', 'M20.25 4.75V9.5A1 1 0 0 0 19.25 10.5', 'M17.25 14.5L18.25 13.5V21.25'],
        20: ['M3.75 5.5H10.25', 'M3.75 10H7.5', 'M3.75 14.5H4.75', 'M16.25 4.25A1.5 1.5 0 0 1 13.25 4.25A1.5 1.5 0 0 1 16.25 4.25Z', 'M16.25 4.25V7.75A0.75 0.75 0 0 0 15.5 8.5', 'M13.75 12.5L14.75 11.5V17.25'],
        16: ['M2.625 3.5H8.125', 'M2.625 8H5.75', 'M2.625 12.5H3.375', 'M13.375 2.875A1.25 1.25 0 0 1 10.875 2.875A1.25 1.25 0 0 1 13.375 2.875Z', 'M13.375 2.875V6A0.625 0.625 0 0 0 12.75 6.625', 'M11.125 10.375L12.125 9.375V14.375'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H12.75A1.25 1.25 0 0 1 12.75 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H9A1.25 1.25 0 0 1 9 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M20.25 4.75A2 2 0 0 1 16.25 4.75A2 2 0 0 1 20.25 4.75Z', 'M20.25 4.75V9.5A1 1 0 0 0 19.25 10.5', 'M17.25 14.5L18.25 13.5V21.25'],
        },
        20: {
          fill: ['M4 4.5H10A1 1 0 0 1 10 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H7.25A1 1 0 0 1 7.25 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M16.25 4.25A1.5 1.5 0 0 1 13.25 4.25A1.5 1.5 0 0 1 16.25 4.25Z', 'M16.25 4.25V7.75A0.75 0.75 0 0 0 15.5 8.5', 'M13.75 12.5L14.75 11.5V17.25'],
        },
        16: {
          fill: ['M3 2.5H7.75A1 1 0 0 1 7.75 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H5.375A1 1 0 0 1 5.375 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M13.375 2.875A1.25 1.25 0 0 1 10.875 2.875A1.25 1.25 0 0 1 13.375 2.875Z', 'M13.375 2.875V6A0.625 0.625 0 0 0 12.75 6.625', 'M11.125 10.375L12.125 9.375V14.375'],
        },
      },
    },
    {
      id: 'J', label: "Tall box",
      box: { 24: [18, 20], 20: [14, 16], 16: [12, 14] },
      tags: ["sort","descending","order","high to low","sort by","alphabetical","z to a","letters","glyph"],
      note: "The alphabetic version of I: the same taller box (18x20 · 14x16 · 12x14, declared), pointed apex, ordinary letter widths. Bars 7.5/5.5/3.5 at 24, 5.5/4/2.5 at 20, 4.5/3.25/2 at 16, on menu's own rows; characters 9 · 7 · 6 wide. A: legs 25.82 · 25.56 · 25.41° off vertical, crossbar 5.75 · 4.25 · 3.75 below the apex with 2 · 1.5 · 1.25 of leg under it, counter 3.28 · 1.76 · 1.67 tall and 3.17 · 1.69 · 1.58 across at the crossbar. Z: diagonal 45.94 · 46.27 · 46.47° off horizontal, arms 7.5 · 5.5 · 4.75, the diagonal clears the far arm end by 3.89 · 2.47 · 2.19. A quarter more height per capital does what widening cannot - it stands the legs up to 25.82 · 25.56 · 25.41° AND opens the counter to 3.28 · 1.76 · 1.67, clear of §6's 1.5 at every master, with a plain point at the apex and no arc. If the tall box is acceptable, this is the most conventional letterform on the board. Same cost as I: 2 units taller than its neighbours.",
      masters: {
        24: ['M3.75 7.5H9.75', 'M3.75 12H7.75', 'M3.75 16.5H5.75', 'M12.75 2.75H20.25L12.75 10.5H20.25', 'M12.75 21.25L16.5 13.5L20.25 21.25', 'M13.72 19.25H19.28'],
        20: ['M3.75 5.5H7.75', 'M3.75 10H6.25', 'M3.75 14.5H4.75', 'M10.75 2.75H16.25L10.75 8.5H16.25', 'M10.75 17.25L13.5 11.5L16.25 17.25', 'M11.47 15.75H15.53'],
        16: ['M2.625 3.5H5.875', 'M2.625 8H4.625', 'M2.625 12.5H3.375', 'M8.625 1.625H13.375L8.625 6.625H13.375', 'M8.625 14.375L11 9.375L13.375 14.375', 'M9.219 13.125H12.781'],
      },
      filled: {
        24: {
          fill: ['M4.25 6.25H9.25A1.25 1.25 0 0 1 9.25 8.75H4.25A1.25 1.25 0 0 1 4.25 6.25Z', 'M4.25 10.75H7.25A1.25 1.25 0 0 1 7.25 13.25H4.25A1.25 1.25 0 0 1 4.25 10.75Z', 'M4.25 15.25H5.25A1.25 1.25 0 0 1 5.25 17.75H4.25A1.25 1.25 0 0 1 4.25 15.25Z'],
          stroke: ['M12.75 2.75H20.25L12.75 10.5H20.25', 'M12.75 21.25L16.5 13.5L20.25 21.25', 'M13.72 19.25H19.28'],
        },
        20: {
          fill: ['M4 4.5H7.5A1 1 0 0 1 7.5 6.5H4A1 1 0 0 1 4 4.5Z', 'M4 9H6A1 1 0 0 1 6 11H4A1 1 0 0 1 4 9Z', 'M4 13.5H4.5A1 1 0 0 1 4.5 15.5H4A1 1 0 0 1 4 13.5Z'],
          stroke: ['M10.75 2.75H16.25L10.75 8.5H16.25', 'M10.75 17.25L13.5 11.5L16.25 17.25', 'M11.47 15.75H15.53'],
        },
        16: {
          fill: ['M3 2.5H5.5A1 1 0 0 1 5.5 4.5H3A1 1 0 0 1 3 2.5Z', 'M3 7H4.25A1 1 0 0 1 4.25 9H3A1 1 0 0 1 3 7Z', 'M3 11.5H3A1 1 0 0 1 3 13.5H3A1 1 0 0 1 3 11.5Z'],
          stroke: ['M8.625 1.625H13.375L8.625 6.625H13.375', 'M8.625 14.375L11 9.375L13.375 14.375', 'M9.219 13.125H12.781'],
        },
      },
    },
  ],
};
