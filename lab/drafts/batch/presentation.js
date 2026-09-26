// presentation - a board on a stand (Charts & Data). The one thing it has to do is not be desktop: same
// screen language (container radius 2.5 · 2 · 1.5, the frame widths desktop and chart-bar-5 ship), but a stand and a
// rail that say "board you present from", not "monitor". Ten constructions: rail vs plain board, V legs vs tripod vs
// single post vs pull tab, empty vs bars vs trend line vs donut, three proportions (desktop's 20x18 box, the circle
// keyline 20x20 for a chart inside, the landscape keyline 20x16). Every path was generated from a few construction
// numbers per master by a throwaway script (scratchpad/presentation/gen.mjs) so the ten share one construction; all
// angles are 0/45/90. Checked with tools/draft-check.mjs: 10 clean, no warnings.

export default {
  "concept": "presentation",
  "context": "Presentation, slides, pitch, board, easel",
  "family": [
    "desktop",
    "desktop-4",
    "desktop-5",
    "chart-bar-5",
    "clipboard"
  ],
  "question": "Which construction reads as a presentation board, not a monitor, at 16 beside desktop and chart-bar-5?",
  "candidates": [
    {
      "id": "A",
      "label": "Rail, easel legs",
      "tags": [
        "board",
        "easel",
        "slides",
        "screen",
        "pitch"
      ],
      "box": {
        "16": [
          14,
          12
        ],
        "20": [
          16,
          14
        ],
        "24": [
          20,
          18
        ]
      },
      "note": "Desktop's box (20x18 · 16x14 · 14x12, declared), empty board. Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Board 18x13 · 14x10 · 12x9 of ink with the rail (1.38 · 1.4 · 1.33 : 1; desktop's screen 1.43 · 1.45 · 1.56), bottom centreline 15.25 · 12.25 · 10.375; legs at 45° from the board's bottom centre, both ends on the grid; the feet's round caps set the ink bottom: drop 5 · 4 · 3, feet at x 7/17 · 6/14 · 5/11, spread 11.5 · 9.5 · 7.25 of ink (64 · 68 · 60% of the board). Interior 15x10 · 11x7 · 9.5x6.5. The plainest board: the rail's 1-unit lip and the V legs are all that separate it from desktop. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 2.625H14.375",
          "M2.625 2.625V8.875A1.5 1.5 0 0 0 4.125 10.375H11.875A1.5 1.5 0 0 0 13.375 8.875V2.625",
          "M8 10.375L5 13.375",
          "M8 10.375L11 13.375"
        ],
        "20": [
          "M2.75 3.75H17.25",
          "M3.75 3.75V10.25A2 2 0 0 0 5.75 12.25H14.25A2 2 0 0 0 16.25 10.25V3.75",
          "M10 12.25L6 16.25",
          "M10 12.25L14 16.25"
        ],
        "24": [
          "M2.75 3.75H21.25",
          "M3.75 3.75V12.75A2.5 2.5 0 0 0 6.25 15.25H17.75A2.5 2.5 0 0 0 20.25 12.75V3.75",
          "M12 15.25L7 20.25",
          "M12 15.25L17 20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 2.625H14V8.875A2.125 2.125 0 0 1 11.875 11H4.125A2.125 2.125 0 0 1 2 8.875Z"
          ],
          "stroke": [
            "M1.625 2.625H14.375",
            "M8 10.375L5 13.375",
            "M8 10.375L11 13.375"
          ]
        },
        "20": {
          "fill": [
            "M3 3.75H17V10.25A2.75 2.75 0 0 1 14.25 13H5.75A2.75 2.75 0 0 1 3 10.25Z"
          ],
          "stroke": [
            "M2.75 3.75H17.25",
            "M10 12.25L6 16.25",
            "M10 12.25L14 16.25"
          ]
        },
        "24": {
          "fill": [
            "M3 3.75H21V12.75A3.25 3.25 0 0 1 17.75 16H6.25A3.25 3.25 0 0 1 3 12.75Z"
          ],
          "stroke": [
            "M2.75 3.75H21.25",
            "M12 15.25L7 20.25",
            "M12 15.25L17 20.25"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Rail, easel legs, bars",
      "tags": [
        "board",
        "easel",
        "chart",
        "bars",
        "report",
        "slides",
        "pitch"
      ],
      "note": "Circle keyline (20x20 · 16x16 · 14x14), so the board is tall enough to carry a chart. Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Board 18x15 · 14x12 · 12x10 with the rail (1.2 · 1.17 · 1.2 : 1), bottom centreline 16.25 · 13.25 · 10.375; legs at 45° from the board's bottom centre, both ends on the grid; the feet's round caps set the ink bottom: drop 5 · 4 · 4, feet at x 7/17 · 6/14 · 4/12. Bars: chart-bar-5's x at 24 and 20 (7 · 12 · 17 and 7 · 10 · 13), low · tall · middle, ends 10.25 / 6.25 / 8.25 → 13 at 24 and 8.5 / 5.75 / 7.25 → 10.25 at 20; at 16 three bars of 1.25 with 1.5 each side need 9.75 of interior and the board gives 9.5, so it keeps two, low and tall, at x 6.375 / 9.625 (eighth grid, one edge of each on a whole pixel), 6.125 / 4.375 → 7.625. Gaps: bar to rail 2 · 1.5 · 1.5, to floor 1.75 · 1.5 · 1.5, between bars 3.5 · 1.5 · 2, to walls 1.75 · 1.75 · 2.5 - the 20 sits on the 1.5 floor, as chart-bar-5's does. Filled cuts the bars as round-ended slots 1.5 wide at every master with the outline's ink ends (chart-bar-5-filled); 3.5 · 1.5 · 1.75 of board left between cuts, 2.75 or more above and below. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25 (recommended: the rail and 45° legs are what no monitor has, and the bars are chart-bar-5's own - same positions, same 16 reduction to two - so it belongs to Charts & Data at a glance; every gap holds 1.5 at all three masters and nothing had to be special-cased)",
      "masters": {
        "16": [
          "M1.625 1.625H14.375",
          "M2.625 1.625V8.875A1.5 1.5 0 0 0 4.125 10.375H11.875A1.5 1.5 0 0 0 13.375 8.875V1.625",
          "M6.375 6.125V7.625",
          "M9.625 4.375V7.625",
          "M8 10.375L4 14.375",
          "M8 10.375L12 14.375"
        ],
        "20": [
          "M2.75 2.75H17.25",
          "M3.75 2.75V11.25A2 2 0 0 0 5.75 13.25H14.25A2 2 0 0 0 16.25 11.25V2.75",
          "M7 8.5V10.25",
          "M10 5.75V10.25",
          "M13 7.25V10.25",
          "M10 13.25L6 17.25",
          "M10 13.25L14 17.25"
        ],
        "24": [
          "M2.75 2.75H21.25",
          "M3.75 2.75V13.75A2.5 2.5 0 0 0 6.25 16.25H17.75A2.5 2.5 0 0 0 20.25 13.75V2.75",
          "M7 10.25V13",
          "M12 6.25V13",
          "M17 8.25V13",
          "M12 16.25L7 21.25",
          "M12 16.25L17 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 1.625H14V8.875A2.125 2.125 0 0 1 11.875 11H4.125A2.125 2.125 0 0 1 2 8.875ZM5.625 6.25A0.75 0.75 0 0 1 7.125 6.25V7.5A0.75 0.75 0 0 1 5.625 7.5ZM8.875 4.5A0.75 0.75 0 0 1 10.375 4.5V7.5A0.75 0.75 0 0 1 8.875 7.5Z"
          ],
          "stroke": [
            "M1.625 1.625H14.375",
            "M8 10.375L4 14.375",
            "M8 10.375L12 14.375"
          ]
        },
        "20": {
          "fill": [
            "M3 2.75H17V11.25A2.75 2.75 0 0 1 14.25 14H5.75A2.75 2.75 0 0 1 3 11.25ZM6.25 8.5A0.75 0.75 0 0 1 7.75 8.5V10.25A0.75 0.75 0 0 1 6.25 10.25ZM9.25 5.75A0.75 0.75 0 0 1 10.75 5.75V10.25A0.75 0.75 0 0 1 9.25 10.25ZM12.25 7.25A0.75 0.75 0 0 1 13.75 7.25V10.25A0.75 0.75 0 0 1 12.25 10.25Z"
          ],
          "stroke": [
            "M2.75 2.75H17.25",
            "M10 13.25L6 17.25",
            "M10 13.25L14 17.25"
          ]
        },
        "24": {
          "fill": [
            "M3 2.75H21V13.75A3.25 3.25 0 0 1 17.75 17H6.25A3.25 3.25 0 0 1 3 13.75ZM6.25 10.25A0.75 0.75 0 0 1 7.75 10.25V13A0.75 0.75 0 0 1 6.25 13ZM11.25 6.25A0.75 0.75 0 0 1 12.75 6.25V13A0.75 0.75 0 0 1 11.25 13ZM16.25 8.25A0.75 0.75 0 0 1 17.75 8.25V13A0.75 0.75 0 0 1 16.25 13Z"
          ],
          "stroke": [
            "M2.75 2.75H21.25",
            "M12 16.25L7 21.25",
            "M12 16.25L17 21.25"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Rail, tripod",
      "tags": [
        "board",
        "tripod",
        "easel",
        "slides",
        "screen"
      ],
      "box": {
        "16": [
          14,
          12
        ],
        "20": [
          16,
          14
        ],
        "24": [
          20,
          18
        ]
      },
      "note": "A with a centre post: three lines from the board's bottom centre, the post straight down and the legs at 45°, all ending on the same floor (ink bottom 21 · 17 · 14). Feet 5 · 4 · 3 apart centre to centre (air 3.5 · 2.5 · 1.75, floor 1.5). Desktop's box (20x18 · 16x14 · 14x12, declared). Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Board 18x13 · 14x10 · 12x9. Reads as a projector screen on a tripod; at 16 the three lines meet in a small dark knot under the board. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 2.625H14.375",
          "M2.625 2.625V8.875A1.5 1.5 0 0 0 4.125 10.375H11.875A1.5 1.5 0 0 0 13.375 8.875V2.625",
          "M8 10.375V13.375",
          "M8 10.375L5 13.375",
          "M8 10.375L11 13.375"
        ],
        "20": [
          "M2.75 3.75H17.25",
          "M3.75 3.75V10.25A2 2 0 0 0 5.75 12.25H14.25A2 2 0 0 0 16.25 10.25V3.75",
          "M10 12.25V16.25",
          "M10 12.25L6 16.25",
          "M10 12.25L14 16.25"
        ],
        "24": [
          "M2.75 3.75H21.25",
          "M3.75 3.75V12.75A2.5 2.5 0 0 0 6.25 15.25H17.75A2.5 2.5 0 0 0 20.25 12.75V3.75",
          "M12 15.25V20.25",
          "M12 15.25L7 20.25",
          "M12 15.25L17 20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 2.625H14V8.875A2.125 2.125 0 0 1 11.875 11H4.125A2.125 2.125 0 0 1 2 8.875Z"
          ],
          "stroke": [
            "M1.625 2.625H14.375",
            "M8 10.375V13.375",
            "M8 10.375L5 13.375",
            "M8 10.375L11 13.375"
          ]
        },
        "20": {
          "fill": [
            "M3 3.75H17V10.25A2.75 2.75 0 0 1 14.25 13H5.75A2.75 2.75 0 0 1 3 10.25Z"
          ],
          "stroke": [
            "M2.75 3.75H17.25",
            "M10 12.25V16.25",
            "M10 12.25L6 16.25",
            "M10 12.25L14 16.25"
          ]
        },
        "24": {
          "fill": [
            "M3 3.75H21V12.75A3.25 3.25 0 0 1 17.75 16H6.25A3.25 3.25 0 0 1 3 12.75Z"
          ],
          "stroke": [
            "M2.75 3.75H21.25",
            "M12 15.25V20.25",
            "M12 15.25L7 20.25",
            "M12 15.25L17 20.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Rail, single post, bars",
      "tags": [
        "board",
        "stand",
        "chart",
        "bars",
        "report",
        "slides"
      ],
      "note": "B's board and bars on one centre post (5 · 4 · 4 long, no foot), circle keyline 20x20 · 16x16 · 14x14. Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Bars: chart-bar-5's x at 24 and 20 (7 · 12 · 17 and 7 · 10 · 13), low · tall · middle, ends 10.25 / 6.25 / 8.25 → 13 at 24 and 8.5 / 5.75 / 7.25 → 10.25 at 20; at 16 three bars of 1.25 with 1.5 each side need 9.75 of interior and the board gives 9.5, so it keeps two, low and tall, at x 6.375 / 9.625 (eighth grid, one edge of each on a whole pixel), 6.125 / 4.375 → 7.625. Gaps: bar to rail 2 · 1.5 · 1.5, to floor 1.75 · 1.5 · 1.5, between bars 3.5 · 1.5 · 2, to walls 1.75 · 1.75 · 2.5 - the 20 sits on the 1.5 floor, as chart-bar-5's does. Filled cuts the bars as round-ended slots 1.5 wide at every master with the outline's ink ends (chart-bar-5-filled); 3.5 · 1.5 · 1.75 of board left between cuts, 2.75 or more above and below. The lightest stand: reads as a sign or a flip chart on a pole; without a foot it cannot be mistaken for desktop, but it also stands on nothing. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 1.625H14.375",
          "M2.625 1.625V8.875A1.5 1.5 0 0 0 4.125 10.375H11.875A1.5 1.5 0 0 0 13.375 8.875V1.625",
          "M6.375 6.125V7.625",
          "M9.625 4.375V7.625",
          "M8 10.375V14.375"
        ],
        "20": [
          "M2.75 2.75H17.25",
          "M3.75 2.75V11.25A2 2 0 0 0 5.75 13.25H14.25A2 2 0 0 0 16.25 11.25V2.75",
          "M7 8.5V10.25",
          "M10 5.75V10.25",
          "M13 7.25V10.25",
          "M10 13.25V17.25"
        ],
        "24": [
          "M2.75 2.75H21.25",
          "M3.75 2.75V13.75A2.5 2.5 0 0 0 6.25 16.25H17.75A2.5 2.5 0 0 0 20.25 13.75V2.75",
          "M7 10.25V13",
          "M12 6.25V13",
          "M17 8.25V13",
          "M12 16.25V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 1.625H14V8.875A2.125 2.125 0 0 1 11.875 11H4.125A2.125 2.125 0 0 1 2 8.875ZM5.625 6.25A0.75 0.75 0 0 1 7.125 6.25V7.5A0.75 0.75 0 0 1 5.625 7.5ZM8.875 4.5A0.75 0.75 0 0 1 10.375 4.5V7.5A0.75 0.75 0 0 1 8.875 7.5Z"
          ],
          "stroke": [
            "M1.625 1.625H14.375",
            "M8 10.375V14.375"
          ]
        },
        "20": {
          "fill": [
            "M3 2.75H17V11.25A2.75 2.75 0 0 1 14.25 14H5.75A2.75 2.75 0 0 1 3 11.25ZM6.25 8.5A0.75 0.75 0 0 1 7.75 8.5V10.25A0.75 0.75 0 0 1 6.25 10.25ZM9.25 5.75A0.75 0.75 0 0 1 10.75 5.75V10.25A0.75 0.75 0 0 1 9.25 10.25ZM12.25 7.25A0.75 0.75 0 0 1 13.75 7.25V10.25A0.75 0.75 0 0 1 12.25 10.25Z"
          ],
          "stroke": [
            "M2.75 2.75H17.25",
            "M10 13.25V17.25"
          ]
        },
        "24": {
          "fill": [
            "M3 2.75H21V13.75A3.25 3.25 0 0 1 17.75 17H6.25A3.25 3.25 0 0 1 3 13.75ZM6.25 10.25A0.75 0.75 0 0 1 7.75 10.25V13A0.75 0.75 0 0 1 6.25 13ZM11.25 6.25A0.75 0.75 0 0 1 12.75 6.25V13A0.75 0.75 0 0 1 11.25 13ZM16.25 8.25A0.75 0.75 0 0 1 17.75 8.25V13A0.75 0.75 0 0 1 16.25 13Z"
          ],
          "stroke": [
            "M2.75 2.75H21.25",
            "M12 16.25V21.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Hung screen, easel legs",
      "tags": [
        "screen",
        "projector",
        "easel",
        "slides"
      ],
      "note": "No rail: desktop's closed screen, the full 20 · 16 · 14 width and all four corners 2.5 · 2 · 1.5, hanging from a short hanger on the centre line (ink 2 → 4 · 2 → 4 · 1 → 3, 2 of it showing), on B's legs (drop 5 · 4 · 4). Circle keyline 20x20 · 16x16 · 14x14. Screen 20x13 · 16x10 · 14x8 of ink (1.54 · 1.6 · 1.75 : 1), top centreline 4.75 · 4.75 · 3.625 so its outer edge is on a whole pixel. Empty. The hanger is Nucleo's projector-screen idea; the risk is a TV with an aerial. Filled: screen solid, outer corners 3.25 · 2.75 · 2.125 (desktop-filled's), hanger and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V8.875A1.5 1.5 0 0 1 12.875 10.375H3.125A1.5 1.5 0 0 1 1.625 8.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M8 3.625V1.625",
          "M8 10.375L4 14.375",
          "M8 10.375L12 14.375"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V11.25A2 2 0 0 1 15.25 13.25H4.75A2 2 0 0 1 2.75 11.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M10 4.75V2.75",
          "M10 13.25L6 17.25",
          "M10 13.25L14 17.25"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V13.75A2.5 2.5 0 0 1 18.75 16.25H5.25A2.5 2.5 0 0 1 2.75 13.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M12 4.75V2.75",
          "M12 16.25L7 21.25",
          "M12 16.25L17 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V8.875A2.125 2.125 0 0 1 12.875 11H3.125A2.125 2.125 0 0 1 1 8.875V5.125A2.125 2.125 0 0 1 3.125 3Z"
          ],
          "stroke": [
            "M8 3.625V1.625",
            "M8 10.375L4 14.375",
            "M8 10.375L12 14.375"
          ]
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V11.25A2.75 2.75 0 0 1 15.25 14H4.75A2.75 2.75 0 0 1 2 11.25V6.75A2.75 2.75 0 0 1 4.75 4Z"
          ],
          "stroke": [
            "M10 4.75V2.75",
            "M10 13.25L6 17.25",
            "M10 13.25L14 17.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V13.75A3.25 3.25 0 0 1 18.75 17H5.25A3.25 3.25 0 0 1 2 13.75V7.25A3.25 3.25 0 0 1 5.25 4Z"
          ],
          "stroke": [
            "M12 4.75V2.75",
            "M12 16.25L7 21.25",
            "M12 16.25L17 21.25"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Screen, easel legs, trend line",
      "tags": [
        "board",
        "easel",
        "chart",
        "line",
        "trend",
        "growth",
        "report"
      ],
      "note": "Circle keyline 20x20 · 16x16 · 14x14. No rail: desktop's closed screen at the full width (20x15 · 16x12 · 14x10 of ink, corners 2.5 · 2 · 1.5), because the line needs the width - with a rail the 16 has 5.25 of run and cannot fit up-down-up with 1.5 between its parallel runs. B's legs (drop 5 · 4 · 4). Trend line up, down, up at 45°: runs 3.5 · 2.5 · 5 / 2.5 · 2.25 · 3.75 / 2 · 2.25 · 3; C10 bends at half the stroke (0.75 · 0.75 · 0.625), so the tangent points sit 0.53 · 0.53 · 0.442 off each corner along both axes - off the grid by construction (like check's), rounded to 2 · 2 · 3 dp. Parallel runs 3.54 · 3.18 · 3.18 apart centre to centre (edge 2.04 · 1.68 · 1.93); line box-centred in the screen's interior, 2.25 · 1.5 · 1.5 clear of the walls (x) and 2.25 · 1.75 · 1.75 of top and floor. Filled: screen solid (outer corners 3.25 · 2.75 · 2.125) with the line cut 1.5 wide, its bends at 0.75 (the cut's own half-width, so the inner corner closes to the bend's centre and the outer edge is an arc of 1.5); 2.04 · 1.68 · 1.68 of screen left between the parallel runs. Legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M3.125 1.625H12.875A1.5 1.5 0 0 1 14.375 3.125V8.875A1.5 1.5 0 0 1 12.875 10.375H3.125A1.5 1.5 0 0 1 1.625 8.875V3.125A1.5 1.5 0 0 1 3.125 1.625Z",
          "M4.375 7.375L5.933 5.817A0.625 0.625 0 0 1 6.817 5.817L8.183 7.183A0.625 0.625 0 0 0 9.067 7.183L11.625 4.625",
          "M8 10.375L4 14.375",
          "M8 10.375L12 14.375"
        ],
        "20": [
          "M4.75 2.75H15.25A2 2 0 0 1 17.25 4.75V11.25A2 2 0 0 1 15.25 13.25H4.75A2 2 0 0 1 2.75 11.25V4.75A2 2 0 0 1 4.75 2.75Z",
          "M5.75 10L7.72 8.03A0.75 0.75 0 0 1 8.78 8.03L9.97 9.22A0.75 0.75 0 0 0 11.03 9.22L14.25 6",
          "M10 13.25L6 17.25",
          "M10 13.25L14 17.25"
        ],
        "24": [
          "M5.25 2.75H18.75A2.5 2.5 0 0 1 21.25 5.25V13.75A2.5 2.5 0 0 1 18.75 16.25H5.25A2.5 2.5 0 0 1 2.75 13.75V5.25A2.5 2.5 0 0 1 5.25 2.75Z",
          "M6.5 12.5L9.47 9.53A0.75 0.75 0 0 1 10.53 9.53L11.97 10.97A0.75 0.75 0 0 0 13.03 10.97L17.5 6.5",
          "M12 16.25L7 21.25",
          "M12 16.25L17 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 1H12.875A2.125 2.125 0 0 1 15 3.125V8.875A2.125 2.125 0 0 1 12.875 11H3.125A2.125 2.125 0 0 1 1 8.875V3.125A2.125 2.125 0 0 1 3.125 1ZM3.845 6.845L5.314 5.375A1.5 1.5 0 0 1 7.436 5.375L8.625 6.564L11.095 4.095A0.75 0.75 0 0 1 12.155 5.155L9.686 7.625A1.5 1.5 0 0 1 7.564 7.625L6.375 6.436L4.905 7.905A0.75 0.75 0 0 1 3.845 6.845Z"
          ],
          "stroke": [
            "M8 10.375L4 14.375",
            "M8 10.375L12 14.375"
          ]
        },
        "20": {
          "fill": [
            "M4.75 2H15.25A2.75 2.75 0 0 1 18 4.75V11.25A2.75 2.75 0 0 1 15.25 14H4.75A2.75 2.75 0 0 1 2 11.25V4.75A2.75 2.75 0 0 1 4.75 2ZM5.22 9.47L7.19 7.5A1.5 1.5 0 0 1 9.31 7.5L10.5 8.69L13.72 5.47A0.75 0.75 0 0 1 14.78 6.53L11.56 9.75A1.5 1.5 0 0 1 9.44 9.75L8.25 8.56L6.28 10.53A0.75 0.75 0 0 1 5.22 9.47Z"
          ],
          "stroke": [
            "M10 13.25L6 17.25",
            "M10 13.25L14 17.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 2H18.75A3.25 3.25 0 0 1 22 5.25V13.75A3.25 3.25 0 0 1 18.75 17H5.25A3.25 3.25 0 0 1 2 13.75V5.25A3.25 3.25 0 0 1 5.25 2ZM5.97 11.97L8.94 9A1.5 1.5 0 0 1 11.06 9L12.5 10.44L16.97 5.97A0.75 0.75 0 0 1 18.03 7.03L13.56 11.5A1.5 1.5 0 0 1 11.44 11.5L10 10.06L7.03 13.03A0.75 0.75 0 0 1 5.97 11.97Z"
          ],
          "stroke": [
            "M12 16.25L7 21.25",
            "M12 16.25L17 21.25"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "Rail, easel legs, donut",
      "tags": [
        "board",
        "easel",
        "chart",
        "donut",
        "pie",
        "report"
      ],
      "note": "B's construction with a donut chart: a 270° ring, the top-right quarter open, centreline radius 3.75 · 2.25 · 2.125, box-centred in the interior with 1.5 to rail and floor at every master. At 16 the legs drop 3, not 4 (board bottom 11.375, ink 12), to give the ring room; a full pie (ring plus two radii) was ruled out - at 20 and 16 the radii leave counters under 1.5. The ring's ends are 5.3 · 3.18 · 3.0 apart centre to centre (air 3.8 · 1.68 · 1.75). Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Filled cuts the ring 1.5 wide with round ends; the solid hole it leaves is 6 · 3 · 2.75 across and 3.8 · 1.68 · 1.5 of board stays across the open quarter. Risk: at 16 an open ring reads as a C or a refresh arrow. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 1.625H14.375",
          "M2.625 1.625V9.875A1.5 1.5 0 0 0 4.125 11.375H11.875A1.5 1.5 0 0 0 13.375 9.875V1.625",
          "M8 4.375A2.125 2.125 0 1 0 10.125 6.5",
          "M8 11.375L5 14.375",
          "M8 11.375L11 14.375"
        ],
        "20": [
          "M2.75 2.75H17.25",
          "M3.75 2.75V11.25A2 2 0 0 0 5.75 13.25H14.25A2 2 0 0 0 16.25 11.25V2.75",
          "M10 5.75A2.25 2.25 0 1 0 12.25 8",
          "M10 13.25L6 17.25",
          "M10 13.25L14 17.25"
        ],
        "24": [
          "M2.75 2.75H21.25",
          "M3.75 2.75V13.75A2.5 2.5 0 0 0 6.25 16.25H17.75A2.5 2.5 0 0 0 20.25 13.75V2.75",
          "M12 5.75A3.75 3.75 0 1 0 15.75 9.5",
          "M12 16.25L7 21.25",
          "M12 16.25L17 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 1.625H14V9.875A2.125 2.125 0 0 1 11.875 12H4.125A2.125 2.125 0 0 1 2 9.875ZM8 3.625A2.875 2.875 0 1 0 10.875 6.5A0.75 0.75 0 0 0 9.375 6.5A1.375 1.375 0 1 1 8 5.125A0.75 0.75 0 0 0 8 3.625Z"
          ],
          "stroke": [
            "M1.625 1.625H14.375",
            "M8 11.375L5 14.375",
            "M8 11.375L11 14.375"
          ]
        },
        "20": {
          "fill": [
            "M3 2.75H17V11.25A2.75 2.75 0 0 1 14.25 14H5.75A2.75 2.75 0 0 1 3 11.25ZM10 5A3 3 0 1 0 13 8A0.75 0.75 0 0 0 11.5 8A1.5 1.5 0 1 1 10 6.5A0.75 0.75 0 0 0 10 5Z"
          ],
          "stroke": [
            "M2.75 2.75H17.25",
            "M10 13.25L6 17.25",
            "M10 13.25L14 17.25"
          ]
        },
        "24": {
          "fill": [
            "M3 2.75H21V13.75A3.25 3.25 0 0 1 17.75 17H6.25A3.25 3.25 0 0 1 3 13.75ZM12 5A4.5 4.5 0 1 0 16.5 9.5A0.75 0.75 0 0 0 15 9.5A3 3 0 1 1 12 6.5A0.75 0.75 0 0 0 12 5Z"
          ],
          "stroke": [
            "M2.75 2.75H21.25",
            "M12 16.25L7 21.25",
            "M12 16.25L17 21.25"
          ]
        }
      }
    },
    {
      "id": "H",
      "label": "Wide board, easel legs",
      "tags": [
        "board",
        "easel",
        "wide",
        "slides",
        "screen"
      ],
      "note": "Landscape keyline (20x16 · 16x12 · 14x10), desktop-4's proportion. Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Board 18x12 · 14x9 · 12x7 with the rail (1.5 · 1.56 · 1.71 : 1), rail at y 4.75 · 4.75 · 3.625, bottom centreline 15.25 · 12.25 · 9.375; legs at 45° from the board's bottom centre, both ends on the grid; the feet's round caps set the ink bottom: drop 4 · 3 · 3, feet at x 8/16 · 7/13 · 5/11. Empty: at 20 the interior is 6 tall, so a chart would be bars of 1.5 - it is the slide itself, not a chart. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 3.625H14.375",
          "M2.625 3.625V7.875A1.5 1.5 0 0 0 4.125 9.375H11.875A1.5 1.5 0 0 0 13.375 7.875V3.625",
          "M8 9.375L5 12.375",
          "M8 9.375L11 12.375"
        ],
        "20": [
          "M2.75 4.75H17.25",
          "M3.75 4.75V10.25A2 2 0 0 0 5.75 12.25H14.25A2 2 0 0 0 16.25 10.25V4.75",
          "M10 12.25L7 15.25",
          "M10 12.25L13 15.25"
        ],
        "24": [
          "M2.75 4.75H21.25",
          "M3.75 4.75V12.75A2.5 2.5 0 0 0 6.25 15.25H17.75A2.5 2.5 0 0 0 20.25 12.75V4.75",
          "M12 15.25L8 19.25",
          "M12 15.25L16 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 3.625H14V7.875A2.125 2.125 0 0 1 11.875 10H4.125A2.125 2.125 0 0 1 2 7.875Z"
          ],
          "stroke": [
            "M1.625 3.625H14.375",
            "M8 9.375L5 12.375",
            "M8 9.375L11 12.375"
          ]
        },
        "20": {
          "fill": [
            "M3 4.75H17V10.25A2.75 2.75 0 0 1 14.25 13H5.75A2.75 2.75 0 0 1 3 10.25Z"
          ],
          "stroke": [
            "M2.75 4.75H17.25",
            "M10 12.25L7 15.25",
            "M10 12.25L13 15.25"
          ]
        },
        "24": {
          "fill": [
            "M3 4.75H21V12.75A3.25 3.25 0 0 1 17.75 16H6.25A3.25 3.25 0 0 1 3 12.75Z"
          ],
          "stroke": [
            "M2.75 4.75H21.25",
            "M12 15.25L8 19.25",
            "M12 15.25L16 19.25"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Rail, tripod, bars",
      "tags": [
        "board",
        "tripod",
        "chart",
        "bars",
        "report",
        "slides"
      ],
      "note": "B with C's centre post: the bars board on a tripod, circle keyline 20x20 · 16x16 · 14x14. Post and legs from one point, drop 5 · 4 · 4, feet 5 · 4 · 4 apart (air 3.5 · 2.5 · 2.75). Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Bars: chart-bar-5's x at 24 and 20 (7 · 12 · 17 and 7 · 10 · 13), low · tall · middle, ends 10.25 / 6.25 / 8.25 → 13 at 24 and 8.5 / 5.75 / 7.25 → 10.25 at 20; at 16 three bars of 1.25 with 1.5 each side need 9.75 of interior and the board gives 9.5, so it keeps two, low and tall, at x 6.375 / 9.625 (eighth grid, one edge of each on a whole pixel), 6.125 / 4.375 → 7.625. Gaps: bar to rail 2 · 1.5 · 1.5, to floor 1.75 · 1.5 · 1.5, between bars 3.5 · 1.5 · 2, to walls 1.75 · 1.75 · 2.5 - the 20 sits on the 1.5 floor, as chart-bar-5's does. Filled cuts the bars as round-ended slots 1.5 wide at every master with the outline's ink ends (chart-bar-5-filled); 3.5 · 1.5 · 1.75 of board left between cuts, 2.75 or more above and below. The most literal and the busiest at 16. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 1.625H14.375",
          "M2.625 1.625V8.875A1.5 1.5 0 0 0 4.125 10.375H11.875A1.5 1.5 0 0 0 13.375 8.875V1.625",
          "M6.375 6.125V7.625",
          "M9.625 4.375V7.625",
          "M8 10.375V14.375",
          "M8 10.375L4 14.375",
          "M8 10.375L12 14.375"
        ],
        "20": [
          "M2.75 2.75H17.25",
          "M3.75 2.75V11.25A2 2 0 0 0 5.75 13.25H14.25A2 2 0 0 0 16.25 11.25V2.75",
          "M7 8.5V10.25",
          "M10 5.75V10.25",
          "M13 7.25V10.25",
          "M10 13.25V17.25",
          "M10 13.25L6 17.25",
          "M10 13.25L14 17.25"
        ],
        "24": [
          "M2.75 2.75H21.25",
          "M3.75 2.75V13.75A2.5 2.5 0 0 0 6.25 16.25H17.75A2.5 2.5 0 0 0 20.25 13.75V2.75",
          "M7 10.25V13",
          "M12 6.25V13",
          "M17 8.25V13",
          "M12 16.25V21.25",
          "M12 16.25L7 21.25",
          "M12 16.25L17 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 1.625H14V8.875A2.125 2.125 0 0 1 11.875 11H4.125A2.125 2.125 0 0 1 2 8.875ZM5.625 6.25A0.75 0.75 0 0 1 7.125 6.25V7.5A0.75 0.75 0 0 1 5.625 7.5ZM8.875 4.5A0.75 0.75 0 0 1 10.375 4.5V7.5A0.75 0.75 0 0 1 8.875 7.5Z"
          ],
          "stroke": [
            "M1.625 1.625H14.375",
            "M8 10.375V14.375",
            "M8 10.375L4 14.375",
            "M8 10.375L12 14.375"
          ]
        },
        "20": {
          "fill": [
            "M3 2.75H17V11.25A2.75 2.75 0 0 1 14.25 14H5.75A2.75 2.75 0 0 1 3 11.25ZM6.25 8.5A0.75 0.75 0 0 1 7.75 8.5V10.25A0.75 0.75 0 0 1 6.25 10.25ZM9.25 5.75A0.75 0.75 0 0 1 10.75 5.75V10.25A0.75 0.75 0 0 1 9.25 10.25ZM12.25 7.25A0.75 0.75 0 0 1 13.75 7.25V10.25A0.75 0.75 0 0 1 12.25 10.25Z"
          ],
          "stroke": [
            "M2.75 2.75H17.25",
            "M10 13.25V17.25",
            "M10 13.25L6 17.25",
            "M10 13.25L14 17.25"
          ]
        },
        "24": {
          "fill": [
            "M3 2.75H21V13.75A3.25 3.25 0 0 1 17.75 17H6.25A3.25 3.25 0 0 1 3 13.75ZM6.25 10.25A0.75 0.75 0 0 1 7.75 10.25V13A0.75 0.75 0 0 1 6.25 13ZM11.25 6.25A0.75 0.75 0 0 1 12.75 6.25V13A0.75 0.75 0 0 1 11.25 13ZM16.25 8.25A0.75 0.75 0 0 1 17.75 8.25V13A0.75 0.75 0 0 1 16.25 13Z"
          ],
          "stroke": [
            "M2.75 2.75H21.25",
            "M12 16.25V21.25",
            "M12 16.25L7 21.25",
            "M12 16.25L17 21.25"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Pull-down screen",
      "tags": [
        "screen",
        "projector",
        "pull-down",
        "slides"
      ],
      "note": "No legs: a wall screen hanging from its roller, with the pull tab on the centre line (3 · 2 · 2 of it below the board; ink bottom 20 · 16 · 13). Landscape keyline 20x16 · 16x12 · 14x10. Rail the full ink width (20 · 16 · 14), the board's walls hanging from it 1 inside each end (board 18 · 14 · 12 wide, chart-bar-5's frame width), bottom corners the container radius 2.5 · 2 · 1.5 (filled outer 3.25 · 2.75 · 2.125, desktop's). 16 master at stroke 1.25: rail and walls on x.625 / y.625 so the rail's top, the walls' outer edges and the board's bottom land on whole pixels. Board 18x13 · 14x10 · 12x8 with the rail (1.38 · 1.4 · 1.5 : 1), rail at y 4.75 · 4.75 · 3.625, bottom centreline 16.25 · 13.25 · 10.375. Quietest silhouette; the tab is desktop's neck without a foot, so it leans toward desktop more than any other. Filled: board solid (evenodd), top edge under the rail, bottom corners on the outline's; rail and legs stay lines at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M1.625 3.625H14.375",
          "M2.625 3.625V8.875A1.5 1.5 0 0 0 4.125 10.375H11.875A1.5 1.5 0 0 0 13.375 8.875V3.625",
          "M8 10.375V12.375"
        ],
        "20": [
          "M2.75 4.75H17.25",
          "M3.75 4.75V11.25A2 2 0 0 0 5.75 13.25H14.25A2 2 0 0 0 16.25 11.25V4.75",
          "M10 13.25V15.25"
        ],
        "24": [
          "M2.75 4.75H21.25",
          "M3.75 4.75V13.75A2.5 2.5 0 0 0 6.25 16.25H17.75A2.5 2.5 0 0 0 20.25 13.75V4.75",
          "M12 16.25V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 3.625H14V8.875A2.125 2.125 0 0 1 11.875 11H4.125A2.125 2.125 0 0 1 2 8.875Z"
          ],
          "stroke": [
            "M1.625 3.625H14.375",
            "M8 10.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M3 4.75H17V11.25A2.75 2.75 0 0 1 14.25 14H5.75A2.75 2.75 0 0 1 3 11.25Z"
          ],
          "stroke": [
            "M2.75 4.75H17.25",
            "M10 13.25V15.25"
          ]
        },
        "24": {
          "fill": [
            "M3 4.75H21V13.75A3.25 3.25 0 0 1 17.75 17H6.25A3.25 3.25 0 0 1 3 13.75Z"
          ],
          "stroke": [
            "M2.75 4.75H21.25",
            "M12 16.25V19.25"
          ]
        }
      }
    }
  ]
};
