// layout-header - layout-footer's five approved constructions mirrored top to bottom (Maruti, 2026-09-26: "use the
// same layouts/variants/iterations for header and sidebar"). Ids are the footer's letters and `set` ships each under
// the footer's number (A -> layout-header ... J -> layout-header-5), so layout-header-N is layout-footer-N upside down.
// The mirror is exact at every master: y -> 24 - y, 20 - y, 16 - y maps the quarter grid to itself and, at 16, y.375 to
// y.625 and whole pixels to whole pixels, so every whole-pixel edge the footer had lands on a whole pixel here (the
// divider's band-side edge: footer 10, header 6 - grid-6's own divider numbers 9.75 · 8.5 · 6.625), and the footer's two
// 1.75s at 16 (J's counter and wall break) are kept. Nothing was redrawn by hand; every path was generated from the
// footer draft by a throwaway script (scratchpad/layouts/gen.mjs), checked against the shipped footer files point by point
// (scratchpad/layouts/verify.mjs), and passes tools/draft-check.mjs with no warnings.

export default {
  "concept": "layout-header",
  "context": "Page layout, header, top bar",
  "family": [
    "layout-footer",
    "layout-footer-2",
    "layout-footer-3",
    "layout-footer-4",
    "layout-footer-5",
    "grid-6"
  ],
  "set": {
    "A": "layout-header",
    "E": "layout-header-2",
    "F": "layout-header-3",
    "I": "layout-header-4",
    "J": "layout-header-5"
  },
  "question": "Do these read as the same five constructions as layout-footer, at 16 beside it and grid-6?",
  "candidates": [
    {
      "id": "A",
      "label": "Third, wall to wall",
      "tags": [
        "header",
        "page",
        "panel top",
        "top bar",
        "layout"
      ],
      "note": "layout-footer mirrored top to bottom, nothing redrawn. Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. One divider wall to wall at y 9.75 · 8.5 · 6.625 - grid-6's own divider numbers (x 9.75 · 8.5 · 6.625), now across: header counter 4.5 · 3.25 · 2.75, page counter 9 · 6.25 · 5.5 (33 · 34 · 33%, the footer's and grid-6's share). 16 master at stroke 1.25: frame centreline 2.625 / 13.375 (outer edge on pixels 2 and 14); the divider on y.625 so its upper edge lands on whole pixel 6 - the footer's divider owns its lower edge (10), the header takes the mirrored edge, grid-6's divider owns its left edge (6). Rasterised at 16 (column 8): the frame's top row 2, two clear rows (4, 5), the divider one solid row (6). Filled: grid-6's cut - two solids split by a 1.5 cut at 9-10.5 · 7.75-9.25 · 6-7.5, the same numbers as grid-6's vertical cut at every master; outer corners on the outline's (3.25 · 2.75 · 2.125), cut corners eased 0.5; header piece 6 · 4.75 · 4 tall over a page piece 10.5 · 7.75 · 6.5 (recommended: the footer's recommended construction, and the plainest header at 16)",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M2.625 6.625H13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M3.75 8.5H16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M3.75 9.75H20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.125 14H11.875A2.125 2.125 0 0 0 14 11.875V8A0.5 0.5 0 0 0 13.5 7.5H2.5A0.5 0.5 0 0 0 2 8V11.875A2.125 2.125 0 0 0 4.125 14Z",
            "M2.5 6H13.5A0.5 0.5 0 0 0 14 5.5V4.125A2.125 2.125 0 0 0 11.875 2H4.125A2.125 2.125 0 0 0 2 4.125V5.5A0.5 0.5 0 0 0 2.5 6Z"
          ]
        },
        "20": {
          "fill": [
            "M5.75 17H14.25A2.75 2.75 0 0 0 17 14.25V9.75A0.5 0.5 0 0 0 16.5 9.25H3.5A0.5 0.5 0 0 0 3 9.75V14.25A2.75 2.75 0 0 0 5.75 17Z",
            "M3.5 7.75H16.5A0.5 0.5 0 0 0 17 7.25V5.75A2.75 2.75 0 0 0 14.25 3H5.75A2.75 2.75 0 0 0 3 5.75V7.25A0.5 0.5 0 0 0 3.5 7.75Z"
          ]
        },
        "24": {
          "fill": [
            "M6.25 21H17.75A3.25 3.25 0 0 0 21 17.75V11A0.5 0.5 0 0 0 20.5 10.5H3.5A0.5 0.5 0 0 0 3 11V17.75A3.25 3.25 0 0 0 6.25 21Z",
            "M3.5 9H20.5A0.5 0.5 0 0 0 21 8.5V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25V8.5A0.5 0.5 0 0 0 3.5 9Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Third, solid header",
      "tags": [
        "header",
        "page",
        "panel top",
        "top bar",
        "layout",
        "highlight"
      ],
      "note": "layout-footer-2 mirrored. Outline is A's (divider y 9.75 · 8.5 · 6.625, header counter 4.5 · 3.25 · 2.75). Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. Filled: the header region solid and the page left as a line - header and divider one band from the frame's outer top (3 · 3 · 2) to the divider's lower edge (10.5 · 9.25 · 7.25), 7.5 · 6.25 · 5.25 tall, top corners on the outline's (3.25 · 2.75 · 2.125); the page is a line at 1.5 · 1.5 · 1.25 whose ends tuck 0.75 · 0.75 · 0.625 into the band",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M2.625 6.625H13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M3.75 8.5H16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M3.75 9.75H20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 7.25H14V4.125A2.125 2.125 0 0 0 11.875 2H4.125A2.125 2.125 0 0 0 2 4.125V7.25Z"
          ],
          "stroke": [
            "M2.625 6.625V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V6.625"
          ]
        },
        "20": {
          "fill": [
            "M3 9.25H17V5.75A2.75 2.75 0 0 0 14.25 3H5.75A2.75 2.75 0 0 0 3 5.75V9.25Z"
          ],
          "stroke": [
            "M3.75 8.5V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V8.5"
          ]
        },
        "24": {
          "fill": [
            "M3 10.5H21V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25V10.5Z"
          ],
          "stroke": [
            "M3.75 9.75V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V9.75"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Third, solid header, two links at 24",
      "tags": [
        "header",
        "page",
        "links",
        "top bar",
        "layout",
        "highlight"
      ],
      "note": "layout-footer-3 mirrored: E with two short lines in the header at 24 only: y 6.75, 7.75→9.75 and 14.25→16.25 (3.5 of ink each, 3 apart - menu's gap, C17 - and 2.5 off each wall), 1.5 to the frame's top and 1.5 to the divider, both on the gap rule's floor. As in the footer, 20 (counter 3.25) and 16 (2.75) cannot hold a 1.5 line with 1.5 each side (4.5 needed), so the lines go there and F is E at 20 and 16. Filled: the two lines knocked out of the band at 1.5, 3 of material above and below. Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on.",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M2.625 6.625H13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M3.75 8.5H16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M3.75 9.75H20.25",
          "M7.75 6.75H9.75",
          "M14.25 6.75H16.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 7.25H14V4.125A2.125 2.125 0 0 0 11.875 2H4.125A2.125 2.125 0 0 0 2 4.125V7.25Z"
          ],
          "stroke": [
            "M2.625 6.625V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V6.625"
          ]
        },
        "20": {
          "fill": [
            "M3 9.25H17V5.75A2.75 2.75 0 0 0 14.25 3H5.75A2.75 2.75 0 0 0 3 5.75V9.25Z"
          ],
          "stroke": [
            "M3.75 8.5V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V8.5"
          ]
        },
        "24": {
          "fill": [
            "M3 10.5H21V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25V10.5ZM7.75 7.5H9.75A0.75 0.75 0 0 0 9.75 6H7.75A0.75 0.75 0 0 0 7.75 7.5ZM14.25 7.5H16.25A0.75 0.75 0 0 0 16.25 6H14.25A0.75 0.75 0 0 0 14.25 7.5Z"
          ],
          "stroke": [
            "M3.75 9.75V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V9.75"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Third, solid page",
      "tags": [
        "header",
        "page",
        "layout",
        "content"
      ],
      "note": "layout-footer-4 mirrored. Outline is A's. Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. Filled: the reverse of E - page and divider one solid from the divider's upper edge (9 · 7.75 · 6) down to the frame's outer bottom (21 · 17 · 14), 12 · 9.25 · 8 tall, bottom corners on the outline's; the header stays an open line at 1.5 · 1.5 · 1.25, its ends tucked 0.75 · 0.75 · 0.625 into the solid",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M2.625 6.625H13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M3.75 8.5H16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M3.75 9.75H20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.125 14H11.875A2.125 2.125 0 0 0 14 11.875V6H2V11.875A2.125 2.125 0 0 0 4.125 14Z"
          ],
          "stroke": [
            "M2.625 6.625V4.125A1.5 1.5 0 0 1 4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V6.625"
          ]
        },
        "20": {
          "fill": [
            "M5.75 17H14.25A2.75 2.75 0 0 0 17 14.25V7.75H3V14.25A2.75 2.75 0 0 0 5.75 17Z"
          ],
          "stroke": [
            "M3.75 8.5V5.75A2 2 0 0 1 5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V8.5"
          ]
        },
        "24": {
          "fill": [
            "M6.25 21H17.75A3.25 3.25 0 0 0 21 17.75V9H3V17.75A3.25 3.25 0 0 0 6.25 21Z"
          ],
          "stroke": [
            "M3.75 9.75V6.25A2.5 2.5 0 0 1 6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V9.75"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Detached header box",
      "tags": [
        "header",
        "page",
        "layout",
        "detached",
        "section"
      ],
      "note": "layout-footer-5 mirrored: the page's walls start 1.5 · 1.5 · 1.75 below a closed header box. Box centreline 3.75-8.25 · 3.75-7.25 · 2.625-5.625, ink 6 · 5 · 4.25 tall, counter 3 · 2 · 1.75; its top corners take the container radius 2.5 · 2 · 1.5 and its bottom corners the detail radius 1.5 · 1.25 · 1, so the silhouette is still checkbox's. Page walls start at y 11.25 · 10.25 · 8.625. At 16 the footer's 1.75 (not 1.5) carries over mirrored: the box counter keeps one clear row (4) and the break in the wall is one clear row (7). Frame is checkbox's square (18 · 14 · 12, container radius 2.5 · 2 · 1.5, outer 3.25 · 2.75 · 2.125), the frame grid-2, grid-6 and layout-footer ship on. Filled: the box solid (outer corners 3.25 · 2.75 · 2.125 top, 2.25 · 2 · 1.625 bottom), the page stays a line at 1.5 · 1.5 · 1.25",
      "masters": {
        "16": [
          "M2.625 8.625V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V8.625",
          "M3.625 5.625H12.375A1 1 0 0 0 13.375 4.625V4.125A1.5 1.5 0 0 0 11.875 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V4.625A1 1 0 0 0 3.625 5.625Z"
        ],
        "20": [
          "M3.75 10.25V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V10.25",
          "M5 7.25H15A1.25 1.25 0 0 0 16.25 6V5.75A2 2 0 0 0 14.25 3.75H5.75A2 2 0 0 0 3.75 5.75V6A1.25 1.25 0 0 0 5 7.25Z"
        ],
        "24": [
          "M3.75 11.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V11.25",
          "M5.25 8.25H18.75A1.5 1.5 0 0 0 20.25 6.75V6.25A2.5 2.5 0 0 0 17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V6.75A1.5 1.5 0 0 0 5.25 8.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.625 6.25H12.375A1.625 1.625 0 0 0 14 4.625V4.125A2.125 2.125 0 0 0 11.875 2H4.125A2.125 2.125 0 0 0 2 4.125V4.625A1.625 1.625 0 0 0 3.625 6.25Z"
          ],
          "stroke": [
            "M2.625 8.625V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V8.625"
          ]
        },
        "20": {
          "fill": [
            "M5 8H15A2 2 0 0 0 17 6V5.75A2.75 2.75 0 0 0 14.25 3H5.75A2.75 2.75 0 0 0 3 5.75V6A2 2 0 0 0 5 8Z"
          ],
          "stroke": [
            "M3.75 10.25V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V10.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 9H18.75A2.25 2.25 0 0 0 21 6.75V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25V6.75A2.25 2.25 0 0 0 5.25 9Z"
          ],
          "stroke": [
            "M3.75 11.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V11.25"
          ]
        }
      }
    }
  ]
};
