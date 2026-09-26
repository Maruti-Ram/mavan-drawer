// layout-sidebar - layout-footer's five approved constructions turned a quarter so the band is a left sidebar (Maruti,
// 2026-09-26: "use the same layouts/variants/iterations for header and sidebar"). Ids are the footer's letters and `set`
// ships each under the footer's number (A -> layout-sidebar ... J -> layout-sidebar-5). The turn (x, y) -> (size - y, x)
// is exact at every master: the divider lands on x 9.75 · 8.5 · 6.625, grid-6's divider, so A is grid-6 without its row
// line and its filled sidebar piece is grid-6's to the hundredth; at 16 x.375 goes to x.625 and whole pixels stay whole,
// and the footer's two 1.75s (J) are kept. F's two links turn with it and run down the sidebar (a line across it would
// be a dot - see F). Nothing was redrawn by hand; every path was generated from the footer draft by a throwaway script
// (scratchpad/layouts/gen.mjs), checked against the shipped footer files point by point (scratchpad/layouts/verify.mjs),
// and passes tools/draft-check.mjs with no warnings.

export default {
  "concept": "layout-sidebar",
  "context": "Page layout, sidebar, left panel, navigation",
  "family": [
    "layout-footer",
    "layout-footer-2",
    "layout-footer-3",
    "layout-footer-4",
    "layout-footer-5",
    "grid-6"
  ],
  "set": {
    "A": "layout-sidebar",
    "E": "layout-sidebar-2",
    "F": "layout-sidebar-3",
    "I": "layout-sidebar-4",
    "J": "layout-sidebar-5"
  },
  "question": "Do these read as the same five constructions as layout-footer, at 16 beside it and grid-6?",
  "candidates": [
    {
      "id": "A",
      "label": "Third, wall to wall",
      "tags": [
        "sidebar",
        "page",
        "panel left",
        "navigation",
        "layout"
      ],
      "note": "layout-footer turned a quarter so the band is on the left - grid-6 without its row line. Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. One divider wall to wall at x 9.75 · 8.5 · 6.625, grid-6's divider to the hundredth: sidebar counter 4.5 · 3.25 · 2.75, page counter 9 · 6.25 · 5.5 (33 · 34 · 33%). 16 master at stroke 1.25: frame centreline 2.625 / 13.375 (outer edge on pixels 2 and 14); the divider on x.625 so its left edge lands on whole pixel 6, as grid-6's does. Rasterised at 16 (row 8): the frame's left column 2, two clear columns (4, 5), the divider one solid column (6). Filled: grid-6's cut - two solids split by a 1.5 cut at 9-10.5 · 7.75-9.25 · 6-7.5; the sidebar piece is grid-6's sidebar piece exactly (6 · 4.75 · 4 wide), the page piece is grid-6's two row pieces joined, 10.5 · 7.75 · 6.5 wide (recommended: the footer's recommended construction, and grid-6's own sidebar)",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M6.625 2.625V13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M8.5 3.75V16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M9.75 3.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M14 4.125V11.875A2.125 2.125 0 0 1 11.875 14H8A0.5 0.5 0 0 1 7.5 13.5V2.5A0.5 0.5 0 0 1 8 2H11.875A2.125 2.125 0 0 1 14 4.125Z",
            "M6 2.5V13.5A0.5 0.5 0 0 1 5.5 14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2H5.5A0.5 0.5 0 0 1 6 2.5Z"
          ]
        },
        "20": {
          "fill": [
            "M17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H9.75A0.5 0.5 0 0 1 9.25 16.5V3.5A0.5 0.5 0 0 1 9.75 3H14.25A2.75 2.75 0 0 1 17 5.75Z",
            "M7.75 3.5V16.5A0.5 0.5 0 0 1 7.25 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3H7.25A0.5 0.5 0 0 1 7.75 3.5Z"
          ]
        },
        "24": {
          "fill": [
            "M21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H11A0.5 0.5 0 0 1 10.5 20.5V3.5A0.5 0.5 0 0 1 11 3H17.75A3.25 3.25 0 0 1 21 6.25Z",
            "M9 3.5V20.5A0.5 0.5 0 0 1 8.5 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3H8.5A0.5 0.5 0 0 1 9 3.5Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Third, solid sidebar",
      "tags": [
        "sidebar",
        "page",
        "panel left",
        "navigation",
        "layout",
        "highlight"
      ],
      "note": "layout-footer-2 turned. Outline is A's (divider x 9.75 · 8.5 · 6.625, sidebar counter 4.5 · 3.25 · 2.75). Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. Filled: the sidebar region solid and the page left as a line - sidebar and divider one band from the frame's outer left (3 · 3 · 2) to the divider's right edge (10.5 · 9.25 · 7.25), 7.5 · 6.25 · 5.25 wide, left corners on the outline's (3.25 · 2.75 · 2.125); the page is a line at 1.5 · 1.5 · 1.25 whose ends tuck 0.75 · 0.75 · 0.625 into the band",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M6.625 2.625V13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M8.5 3.75V16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M9.75 3.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.25 2V14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2H7.25Z"
          ],
          "stroke": [
            "M6.625 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H6.625"
          ]
        },
        "20": {
          "fill": [
            "M9.25 3V17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3H9.25Z"
          ],
          "stroke": [
            "M8.5 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H8.5"
          ]
        },
        "24": {
          "fill": [
            "M10.5 3V21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3H10.5Z"
          ],
          "stroke": [
            "M9.75 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H9.75"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Third, solid sidebar, two links at 24",
      "tags": [
        "sidebar",
        "page",
        "links",
        "navigation",
        "layout",
        "highlight"
      ],
      "note": "layout-footer-3 turned: E with two short lines in the sidebar at 24 only: x 6.75, y 7.75→9.75 and 14.25→16.25 (3.5 of ink each, 3 apart - menu's gap, C17 - and 2.5 off the top and bottom walls), 1.5 to the frame's left wall and 1.5 to the divider, both on the gap rule's floor. They run down the sidebar, not across it: across, a 4.5-wide sidebar with 1.5 clear each side leaves 1.5 of ink, a dot, not a line. At 20 (counter 3.25) and 16 (2.75) the lines go, as in the footer, and F is E there. Filled: the two lines knocked out of the band at 1.5, 3 of material each side. Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on.",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M6.625 2.625V13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M8.5 3.75V16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M9.75 3.75V20.25",
          "M6.75 7.75V9.75",
          "M6.75 14.25V16.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.25 2V14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2H7.25Z"
          ],
          "stroke": [
            "M6.625 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H6.625"
          ]
        },
        "20": {
          "fill": [
            "M9.25 3V17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3H9.25Z"
          ],
          "stroke": [
            "M8.5 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H8.5"
          ]
        },
        "24": {
          "fill": [
            "M10.5 3V21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3H10.5ZM7.5 7.75V9.75A0.75 0.75 0 0 1 6 9.75V7.75A0.75 0.75 0 0 1 7.5 7.75ZM7.5 14.25V16.25A0.75 0.75 0 0 1 6 16.25V14.25A0.75 0.75 0 0 1 7.5 14.25Z"
          ],
          "stroke": [
            "M9.75 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H9.75"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Third, solid page",
      "tags": [
        "sidebar",
        "page",
        "layout",
        "content"
      ],
      "note": "layout-footer-4 turned. Outline is A's. Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. Filled: the reverse of E - page and divider one solid from the divider's left edge (9 · 7.75 · 6) to the frame's outer right (21 · 17 · 14), 12 · 9.25 · 8 wide, right corners on the outline's; the sidebar stays an open line at 1.5 · 1.5 · 1.25, its ends tucked 0.75 · 0.75 · 0.625 into the solid",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M6.625 2.625V13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M8.5 3.75V16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M9.75 3.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M14 4.125V11.875A2.125 2.125 0 0 1 11.875 14H6V2H11.875A2.125 2.125 0 0 1 14 4.125Z"
          ],
          "stroke": [
            "M6.625 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H6.625"
          ]
        },
        "20": {
          "fill": [
            "M17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H7.75V3H14.25A2.75 2.75 0 0 1 17 5.75Z"
          ],
          "stroke": [
            "M8.5 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H8.5"
          ]
        },
        "24": {
          "fill": [
            "M21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H9V3H17.75A3.25 3.25 0 0 1 21 6.25Z"
          ],
          "stroke": [
            "M9.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H9.75"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Detached sidebar box",
      "tags": [
        "sidebar",
        "page",
        "layout",
        "detached",
        "section"
      ],
      "note": "layout-footer-5 turned: the page's top and bottom walls stop 1.5 · 1.5 · 1.75 short of a closed sidebar box. Box centreline x 3.75-8.25 · 3.75-7.25 · 2.625-5.625, ink 6 · 5 · 4.25 wide, counter 3 · 2 · 1.75; its left corners take the container radius 2.5 · 2 · 1.5 and its right corners the detail radius 1.5 · 1.25 · 1, so the silhouette is still checkbox's. Page walls start at x 11.25 · 10.25 · 8.625. At 16 the footer's 1.75 (not 1.5) carries over turned: the box counter keeps one clear column (4) and the break in the walls is one clear column (7). Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. Filled: the box solid (outer corners 3.25 · 2.75 · 2.125 left, 2.25 · 2 · 1.625 right), the page stays a line at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M8.625 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H8.625",
          "M5.625 3.625V12.375A1 1 0 0 1 4.625 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625H4.625A1 1 0 0 1 5.625 3.625Z"
        ],
        "20": [
          "M10.25 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H10.25",
          "M7.25 5V15A1.25 1.25 0 0 1 6 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75H6A1.25 1.25 0 0 1 7.25 5Z"
        ],
        "24": [
          "M11.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H11.25",
          "M8.25 5.25V18.75A1.5 1.5 0 0 1 6.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75H6.75A1.5 1.5 0 0 1 8.25 5.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.25 3.625V12.375A1.625 1.625 0 0 1 4.625 14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2H4.625A1.625 1.625 0 0 1 6.25 3.625Z"
          ],
          "stroke": [
            "M8.625 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H8.625"
          ]
        },
        "20": {
          "fill": [
            "M8 5V15A2 2 0 0 1 6 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3H6A2 2 0 0 1 8 5Z"
          ],
          "stroke": [
            "M10.25 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H10.25"
          ]
        },
        "24": {
          "fill": [
            "M9 5.25V18.75A2.25 2.25 0 0 1 6.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3H6.75A2.25 2.25 0 0 1 9 5.25Z"
          ],
          "stroke": [
            "M11.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H11.25"
          ]
        }
      }
    }
  ]
};
