// book - a closed book: docs, guide, manual, knowledge base, library (Files & Folders, #110). Why it matters: a plain
// portrait rectangle is already file, clipboard, save, mobile and tablet, and a rectangle with one line in it is
// layout-sidebar - so whatever says "book" has to survive 16, where there is room for about one detail. The ten try the
// real signals one at a time and in pairs: the page block at the base (Lucide's curl, a straight band, an open fore-edge),
// the spine band, a bookmark ribbon (hung inside, or cut into the top edge), and a title label. All sit on the portrait
// keyline (16x20 · 12x16 · 10x14, like file and clipboard) at book-open's detail corners 1.5 · 1.25 · 1 (H tries the
// file family's 2.5 · 2 · 1.5), stroke 1.5 · 1.5 · 1.25; the 16 master is drawn on its own eighth grid (edges on x.625 /
// x.375, so the outer edges are whole pixels). Every gap between stroke edges is at least 1.5 at every master; where 16
// cannot hold a detail with that air it goes (J's label). Filled: shape icon - the cover solid, the page band knocked out
// at its clear size, the spine a 1.5 cut (book-open-filled cuts its spine too), ribbon and label knocked out at their ink
// size; filled outer edge = outline outer edge, so the ink boxes match exactly. Note: `book-bookmark` (#419) is queued as
// a variant of book - B and G would pre-empt it. Generated from a spec per master by a throwaway script (scratchpad
// book/gen.mjs). Checked with tools/draft-check.mjs: 10 clean, 0 warnings.
export default {
  "concept": "book",
  "context": "Book, docs, guide, manual, knowledge base, library, reading",
  "family": [
    "book-open",
    "book-open-2",
    "file",
    "clipboard",
    "save",
    "layout-sidebar"
  ],
  "question": "What makes the closed book read as a book - not a file, a phone or a sidebar - at 16: the page block at the base, the spine band, a bookmark ribbon, or a pair of them?",
  "candidates": [
    {
      "id": "A",
      "label": "Page curl, spine",
      "tags": [
        "pages",
        "read",
        "library",
        "curl",
        "spine"
      ],
      "note": "Page curl and spine together. The cover's bottom-left corner rolls round into the page block (Lucide's curl): the page line runs from the right edge, curls down into the spine and becomes the back cover. A spine line drops from the top edge and stops on the page line. At 16 in real pixels this is the one that still says book: the spine stopping on the page band turns the bottom bar into pages, where the curl alone melts into the corner and reads as a tablet's home bar (see D). Ink box 16x20 · 12x16 · 10x14, filled identical. Corners 1.5 · 1.25 · 1 (book-open's). Curl radius 2 · 1.75 · 1.5; page band clear 2.5 · 2 · 1.75. Spine on x 7.75 · 7.75 · 6.375, spine band clear 1.5 at every master (the floor); front panel clear 10 · 6 · 4.75 wide. Filled: cover solid, page band knocked out at its clear size (2.5 · 2 · 1.75 tall, a back-cover strip 1.5 · 1.5 · 1.25 thick under it), spine cut 1.5 wide from the top edge that stops 1.5 above the band, leaving a spine strip 3 · 3 · 2.625 wide. Inside every rule, no exceptions, and the strongest 16 of the ten in both styles (recommended)",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V2.625A1 1 0 0 1 4.625 1.625Z",
          "M12.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875",
          "M6.375 1.625V11.375"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4A1.25 1.25 0 0 1 6 2.75Z",
          "M15.25 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5",
          "M7.75 2.75V13.75"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.75A2 2 0 0 1 4.75 19.25V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M19.25 17.25H6.75A2 2 0 0 0 4.75 19.25",
          "M7.75 2.75V17.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H5.125A0.5 0.5 0 0 1 5.625 1.5V9.75A0.75 0.75 0 0 0 6.375 10.5A0.75 0.75 0 0 0 7.125 9.75V1.5A0.5 0.5 0 0 1 7.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V13.375A0.375 0.375 0 0 1 11.375 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H6.5A0.5 0.5 0 0 1 7 2.5V12.25A0.75 0.75 0 0 0 7.75 13A0.75 0.75 0 0 0 8.5 12.25V2.5A0.5 0.5 0 0 1 9 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6.5A2.5 2.5 0 0 1 4 15.5V4A2 2 0 0 1 6 2ZM6.5 14.5H14A0.5 0.5 0 0 1 14.5 15V16A0.5 0.5 0 0 1 14 16.5H6.5A1 1 0 0 1 5.5 15.5A1 1 0 0 1 6.5 14.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H6.5A0.5 0.5 0 0 1 7 2.5V15.75A0.75 0.75 0 0 0 7.75 16.5A0.75 0.75 0 0 0 8.5 15.75V2.5A0.5 0.5 0 0 1 9 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.75A2.75 2.75 0 0 1 4 19.25V4.25A2.25 2.25 0 0 1 6.25 2ZM6.75 18H18A0.5 0.5 0 0 1 18.5 18.5V19.75A0.75 0.75 0 0 1 17.75 20.5H6.75A1.25 1.25 0 0 1 5.5 19.25A1.25 1.25 0 0 1 6.75 18Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "Page curl, ribbon",
      "tags": [
        "pages",
        "read",
        "library",
        "curl",
        "bookmark",
        "ribbon"
      ],
      "note": "Page curl and a bookmark ribbon. D's cover with a forked ribbon hanging from the top edge near the fore-edge; the fork is cut at 45 degrees. Ribbon 3 · 3 · 2.75 wide on its centreline (1.5 clear inside), 1.5 clear of the right edge, tails at y 10.75 · 9.25 · 7.625, fork 1.5 · 1.5 · 1.375 deep. Ink box 16x20 · 12x16 · 10x14, filled identical; curl radius 2 · 1.75 · 1.5, page band clear 2.5 · 2 · 1.75. Filled: the ribbon knocked out at its ink width (4.5 · 4.5 · 4) under a top strip 1.5 · 1.5 · 1.25 thick, fork tooth rounded 0.5 · 0.5 · 0.375; the fork's slanted edges are off the quarter grid (lint's documented exception for filled cut-outs). What it costs: at 16 filled the fork does not resolve and the ribbon reads as a window over a bottom band - the save (floppy) icon. And `book-bookmark` (#419) is queued as its own variant; this would take its idea",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V2.625A1 1 0 0 1 4.625 1.625Z",
          "M12.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875",
          "M6.875 1.625V7.625L8.25 6.25L9.625 7.625V1.625"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4A1.25 1.25 0 0 1 6 2.75Z",
          "M15.25 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5",
          "M9.25 2.75V9.25L10.75 7.75L12.25 9.25V2.75"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.75A2 2 0 0 1 4.75 19.25V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M19.25 17.25H6.75A2 2 0 0 0 4.75 19.25",
          "M13.25 2.75V10.75L14.75 9.25L16.25 10.75V2.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V13.375A0.375 0.375 0 0 1 11.375 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12ZM6.625 2.25H9.875A0.375 0.375 0 0 1 10.25 2.625V7.625A0.625 0.625 0 0 1 9.183 8.067L8.515 7.399A0.375 0.375 0 0 0 7.985 7.399L7.317 8.067A0.625 0.625 0 0 1 6.25 7.625V2.625A0.375 0.375 0 0 1 6.625 2.25Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6.5A2.5 2.5 0 0 1 4 15.5V4A2 2 0 0 1 6 2ZM6.5 14.5H14A0.5 0.5 0 0 1 14.5 15V16A0.5 0.5 0 0 1 14 16.5H6.5A1 1 0 0 1 5.5 15.5A1 1 0 0 1 6.5 14.5ZM9 3.5H12.5A0.5 0.5 0 0 1 13 4V9.25A0.75 0.75 0 0 1 11.72 9.78L11.1 9.16A0.5 0.5 0 0 0 10.4 9.16L9.78 9.78A0.75 0.75 0 0 1 8.5 9.25V4A0.5 0.5 0 0 1 9 3.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.75A2.75 2.75 0 0 1 4 19.25V4.25A2.25 2.25 0 0 1 6.25 2ZM6.75 18H18A0.5 0.5 0 0 1 18.5 18.5V19.75A0.75 0.75 0 0 1 17.75 20.5H6.75A1.25 1.25 0 0 1 5.5 19.25A1.25 1.25 0 0 1 6.75 18ZM13 3.5H16.5A0.5 0.5 0 0 1 17 4V10.75A0.75 0.75 0 0 1 15.72 11.28L15.1 10.66A0.5 0.5 0 0 0 14.4 10.66L13.78 11.28A0.75 0.75 0 0 1 12.5 10.75V4A0.5 0.5 0 0 1 13 3.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Spine and page block",
      "tags": [
        "pages",
        "read",
        "library",
        "spine",
        "hardcover"
      ],
      "note": "Spine and a straight page block. A plain cover with a spine line top to bottom and a page line from the spine to the fore-edge, so the pages sit as a band at the base inside the covers; no curl. Spine on x 7.75 · 7.75 · 6.375 (band clear 1.5), page line 4 · 3.5 · 3 above the bottom edge (band clear 2.5 · 2 · 1.75); the small cell left of the spine under the page line is 1.5 wide. Ink box 16x20 · 12x16 · 10x14, filled identical; corners 1.5 · 1.25 · 1. Filled: the spine strip solid top to bottom, cut 1.5 from the front cover; the front cover wraps the page band, which opens into the cut, and its bottom strip is 1.5 · 1.5 · 1.25 thick. Reads as a hardcover at 16; its risk is a layout icon (a sidebar plus a footer)",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H4.625A1 1 0 0 1 3.625 13.375V2.625A1 1 0 0 1 4.625 1.625Z",
          "M6.375 1.625V14.375",
          "M6.375 11.375H12.375"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6A1.25 1.25 0 0 1 4.75 16V4A1.25 1.25 0 0 1 6 2.75Z",
          "M7.75 2.75V17.25",
          "M7.75 13.75H15.25"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.25A1.5 1.5 0 0 1 4.75 19.75V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M7.75 2.75V21.25",
          "M7.75 17.25H19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H5.125A0.5 0.5 0 0 1 5.625 1.5V14.5A0.5 0.5 0 0 1 5.125 15H4.625A1.625 1.625 0 0 1 3 13.375V2.625A1.625 1.625 0 0 1 4.625 1Z",
            "M7.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H7.625A0.5 0.5 0 0 1 7.125 14.5V14.25A0.5 0.5 0 0 1 7.625 13.75H11.375A0.375 0.375 0 0 0 11.75 13.375V12.375A0.375 0.375 0 0 0 11.375 12H7.625A0.5 0.5 0 0 1 7.125 11.5V1.5A0.5 0.5 0 0 1 7.625 1Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H6.5A0.5 0.5 0 0 1 7 2.5V17.5A0.5 0.5 0 0 1 6.5 18H6A2 2 0 0 1 4 16V4A2 2 0 0 1 6 2Z",
            "M9 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H9A0.5 0.5 0 0 1 8.5 17.5V17A0.5 0.5 0 0 1 9 16.5H14A0.5 0.5 0 0 0 14.5 16V15A0.5 0.5 0 0 0 14 14.5H9A0.5 0.5 0 0 1 8.5 14V2.5A0.5 0.5 0 0 1 9 2Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H6.5A0.5 0.5 0 0 1 7 2.5V21.5A0.5 0.5 0 0 1 6.5 22H6.25A2.25 2.25 0 0 1 4 19.75V4.25A2.25 2.25 0 0 1 6.25 2Z",
            "M9 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H9A0.5 0.5 0 0 1 8.5 21.5V21A0.5 0.5 0 0 1 9 20.5H17.75A0.75 0.75 0 0 0 18.5 19.75V18.75A0.75 0.75 0 0 0 17.75 18H9A0.5 0.5 0 0 1 8.5 17.5V2.5A0.5 0.5 0 0 1 9 2Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Page curl",
      "tags": [
        "pages",
        "read",
        "docs",
        "guide",
        "library",
        "curl"
      ],
      "note": "Page curl alone - Lucide's book. The cover's bottom-left corner is the lower half of the curl; the page line runs from the right edge and curls down into it, so the page block is a band at the base closed by the fore-edge. Curl radius 2 · 1.75 · 1.5; page band clear 2.5 · 2 · 1.75; the other corners 1.5 · 1.25 · 1. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: cover solid, page band knocked out at its clear size over a back-cover strip 1.5 · 1.5 · 1.25 thick. Cleanest at 24, but at 16 the curl (outer radius 2.125) sits beside a corner of 1.625 and the eye cannot tell them apart: it reads as a tablet or phone with a home bar",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V2.625A1 1 0 0 1 4.625 1.625Z",
          "M12.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4A1.25 1.25 0 0 1 6 2.75Z",
          "M15.25 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.75A2 2 0 0 1 4.75 19.25V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M19.25 17.25H6.75A2 2 0 0 0 4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V13.375A0.375 0.375 0 0 1 11.375 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6.5A2.5 2.5 0 0 1 4 15.5V4A2 2 0 0 1 6 2ZM6.5 14.5H14A0.5 0.5 0 0 1 14.5 15V16A0.5 0.5 0 0 1 14 16.5H6.5A1 1 0 0 1 5.5 15.5A1 1 0 0 1 6.5 14.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.75A2.75 2.75 0 0 1 4 19.25V4.25A2.25 2.25 0 0 1 6.25 2ZM6.75 18H18A0.5 0.5 0 0 1 18.5 18.5V19.75A0.75 0.75 0 0 1 17.75 20.5H6.75A1.25 1.25 0 0 1 5.5 19.25A1.25 1.25 0 0 1 6.75 18Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Open page block",
      "tags": [
        "pages",
        "read",
        "library",
        "curl",
        "open"
      ],
      "note": "Open page block. The front cover is a rounded box that ends at the page line; the back cover runs under it, rolls up round the curl into the spine and stops at the fore-edge with a round cap, so the page block is open on the right like a book seen slightly from below. Curl radius 2 · 1.75 · 1.5, band clear 2.5 · 2 · 1.75, front cover bottom-right corner 1.5 · 1.25 · 1. Ink box 16x20 · 12x16 · 10x14, filled identical (the cap reaches the right edge). Filled: one solid with an inlet 2.5 · 2 · 1.75 tall under the front cover, back cover strip 1.5 · 1.5 · 1.25 thick ending in a round cap. Lighter than D and unlike any container in the set, but at 16 the back cover reads as an underline under a box",
      "masters": {
        "16": [
          "M12.375 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V2.625A1 1 0 0 1 4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V10.375A1 1 0 0 1 11.375 11.375",
          "M11.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875"
        ],
        "20": [
          "M15.25 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4A1.25 1.25 0 0 1 6 2.75H14A1.25 1.25 0 0 1 15.25 4V12.5A1.25 1.25 0 0 1 14 13.75",
          "M14 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5"
        ],
        "24": [
          "M19.25 21.25H6.75A2 2 0 0 1 4.75 19.25V4.25A1.5 1.5 0 0 1 6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V15.75A1.5 1.5 0 0 1 17.75 17.25",
          "M17.75 17.25H6.75A2 2 0 0 0 4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V10.375A1.625 1.625 0 0 1 11.375 12H5.125A0.875 0.875 0 0 0 4.25 12.875A0.875 0.875 0 0 0 5.125 13.75H12.375A0.625 0.625 0 0 1 13 14.375A0.625 0.625 0 0 1 12.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H14A2 2 0 0 1 16 4V12.5A2 2 0 0 1 14 14.5H6.5A1 1 0 0 0 5.5 15.5A1 1 0 0 0 6.5 16.5H15.25A0.75 0.75 0 0 1 16 17.25A0.75 0.75 0 0 1 15.25 18H6.5A2.5 2.5 0 0 1 4 15.5V4A2 2 0 0 1 6 2Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H17.75A2.25 2.25 0 0 1 20 4.25V15.75A2.25 2.25 0 0 1 17.75 18H6.75A1.25 1.25 0 0 0 5.5 19.25A1.25 1.25 0 0 0 6.75 20.5H19.25A0.75 0.75 0 0 1 20 21.25A0.75 0.75 0 0 1 19.25 22H6.75A2.75 2.75 0 0 1 4 19.25V4.25A2.25 2.25 0 0 1 6.25 2Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "F",
      "label": "Page curl, title",
      "tags": [
        "pages",
        "read",
        "library",
        "curl",
        "title",
        "label"
      ],
      "note": "Page curl and a title label. D's cover with one short title line across the upper front, centred: 6.5 · 4.5 · 2.75 long on its centreline (ink 8 · 6 · 4) at y 7.25 · 6.25 · 4.625, 3 · 2 · 1.75 clear under the top edge. Curl radius 2 · 1.75 · 1.5, page band clear 2.5 · 2 · 1.75. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: cover solid, the label knocked out as a slot at its ink size (1.5 · 1.5 · 1.25 tall), page band knocked out at its clear size. The label gives the cover a face at 16 that D lacks, but a line on a portrait box is also file-text's",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V2.625A1 1 0 0 1 4.625 1.625Z",
          "M12.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875",
          "M6.625 4.625H9.375"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4A1.25 1.25 0 0 1 6 2.75Z",
          "M15.25 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5",
          "M7.75 6.25H12.25"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.75A2 2 0 0 1 4.75 19.25V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M19.25 17.25H6.75A2 2 0 0 0 4.75 19.25",
          "M8.75 7.25H15.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H5.125A2.125 2.125 0 0 1 3 12.875V2.625A1.625 1.625 0 0 1 4.625 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V13.375A0.375 0.375 0 0 1 11.375 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12ZM6.625 4H9.375A0.625 0.625 0 0 1 10 4.625A0.625 0.625 0 0 1 9.375 5.25H6.625A0.625 0.625 0 0 1 6 4.625A0.625 0.625 0 0 1 6.625 4Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6.5A2.5 2.5 0 0 1 4 15.5V4A2 2 0 0 1 6 2ZM6.5 14.5H14A0.5 0.5 0 0 1 14.5 15V16A0.5 0.5 0 0 1 14 16.5H6.5A1 1 0 0 1 5.5 15.5A1 1 0 0 1 6.5 14.5ZM7.75 5.5H12.25A0.75 0.75 0 0 1 13 6.25A0.75 0.75 0 0 1 12.25 7H7.75A0.75 0.75 0 0 1 7 6.25A0.75 0.75 0 0 1 7.75 5.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.75A2.75 2.75 0 0 1 4 19.25V4.25A2.25 2.25 0 0 1 6.25 2ZM6.75 18H18A0.5 0.5 0 0 1 18.5 18.5V19.75A0.75 0.75 0 0 1 17.75 20.5H6.75A1.25 1.25 0 0 1 5.5 19.25A1.25 1.25 0 0 1 6.75 18ZM8.75 6.5H15.25A0.75 0.75 0 0 1 16 7.25A0.75 0.75 0 0 1 15.25 8H8.75A0.75 0.75 0 0 1 8 7.25A0.75 0.75 0 0 1 8.75 6.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "G",
      "label": "Ribbon notch",
      "tags": [
        "read",
        "library",
        "bookmark",
        "ribbon",
        "notch"
      ],
      "note": "Ribbon notch, no pages. A plain cover whose top edge dips into a forked bookmark notch (the ribbon is cut into the silhouette, Material's book). Notch 4 · 4 · 3.25 wide on its centreline (2.5 · 2.5 · 2 of air between its sides), fork 2 · 2 · 1.625 deep at 45 degrees, tails at y 9.75 · 8.5 · 6.625; the top edge turns into the notch on bends of 0.75 · 0.75 · 0.625 (C10's minimum); corners 1.5 · 1.25 · 1. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: one solid with the notch as its air (2.5 · 2.5 · 2 wide); the notch tips and fork are off the quarter grid (lint's documented exception for filled cut-outs). A strong silhouette at 16, but it says bookmark more than book, and `book-bookmark` (#419) is queued separately",
      "masters": {
        "16": [
          "M4.625 1.625H5.75A0.625 0.625 0 0 1 6.375 2.25V6.625L8 5L9.625 6.625V2.25A0.625 0.625 0 0 1 10.25 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H4.625A1 1 0 0 1 3.625 13.375V2.625A1 1 0 0 1 4.625 1.625Z"
        ],
        "20": [
          "M6 2.75H7.5A0.75 0.75 0 0 1 8.25 3.5V8.5L10.25 6.5L12.25 8.5V3.5A0.75 0.75 0 0 1 13 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6A1.25 1.25 0 0 1 4.75 16V4A1.25 1.25 0 0 1 6 2.75Z"
        ],
        "24": [
          "M6.25 2.75H11.5A0.75 0.75 0 0 1 12.25 3.5V9.75L14.25 7.75L16.25 9.75V3.5A0.75 0.75 0 0 1 17 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.25A1.5 1.5 0 0 1 4.75 19.75V4.25A1.5 1.5 0 0 1 6.25 2.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H5.75A1.25 1.25 0 0 1 7 2.25V5.116L7.558 4.558A0.625 0.625 0 0 1 8.442 4.558L9 5.116V2.25A1.25 1.25 0 0 1 10.25 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H4.625A1.625 1.625 0 0 1 3 13.375V2.625A1.625 1.625 0 0 1 4.625 1Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H7.5A1.5 1.5 0 0 1 9 3.5V6.69L9.72 5.97A0.75 0.75 0 0 1 10.78 5.97L11.5 6.69V3.5A1.5 1.5 0 0 1 13 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H6A2 2 0 0 1 4 16V4A2 2 0 0 1 6 2Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H11.5A1.5 1.5 0 0 1 13 3.5V7.94L13.72 7.22A0.75 0.75 0 0 1 14.78 7.22L15.5 7.94V3.5A1.5 1.5 0 0 1 17 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H6.25A2.25 2.25 0 0 1 4 19.75V4.25A2.25 2.25 0 0 1 6.25 2Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "H",
      "label": "Page curl, soft corners",
      "tags": [
        "pages",
        "read",
        "library",
        "curl",
        "soft"
      ],
      "note": "D with the file family's corners. The same curl and page band as D, but the cover's corners are the container radius 2.5 · 2 · 1.5 that file and clipboard use, so the book matches the documents beside it rather than book-open. Curl radius 2 · 1.75 · 1.5, page band clear 2.5 · 2 · 1.75. Ink box 16x20 · 12x16 · 10x14, filled identical; filled outer corners 3.25 · 2.75 · 2.125, band hole's inner corner 1.75 · 1.25 · 0.875. Softer than D; at 16 the top corners and the curl are then almost the same size, so it reads even more like a phone",
      "masters": {
        "16": [
          "M5.125 1.625H10.875A1.5 1.5 0 0 1 12.375 3.125V12.875A1.5 1.5 0 0 1 10.875 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V3.125A1.5 1.5 0 0 1 5.125 1.625Z",
          "M12.375 11.375H5.125A1.5 1.5 0 0 0 3.625 12.875"
        ],
        "20": [
          "M6.75 2.75H13.25A2 2 0 0 1 15.25 4.75V15.25A2 2 0 0 1 13.25 17.25H6.5A1.75 1.75 0 0 1 4.75 15.5V4.75A2 2 0 0 1 6.75 2.75Z",
          "M15.25 13.75H6.5A1.75 1.75 0 0 0 4.75 15.5"
        ],
        "24": [
          "M7.25 2.75H16.75A2.5 2.5 0 0 1 19.25 5.25V18.75A2.5 2.5 0 0 1 16.75 21.25H6.75A2 2 0 0 1 4.75 19.25V5.25A2.5 2.5 0 0 1 7.25 2.75Z",
          "M19.25 17.25H6.75A2 2 0 0 0 4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.125 1H10.875A2.125 2.125 0 0 1 13 3.125V12.875A2.125 2.125 0 0 1 10.875 15H5.125A2.125 2.125 0 0 1 3 12.875V3.125A2.125 2.125 0 0 1 5.125 1ZM5.125 12H11.375A0.375 0.375 0 0 1 11.75 12.375V12.875A0.875 0.875 0 0 1 10.875 13.75H5.125A0.875 0.875 0 0 1 4.25 12.875A0.875 0.875 0 0 1 5.125 12Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6.75 2H13.25A2.75 2.75 0 0 1 16 4.75V15.25A2.75 2.75 0 0 1 13.25 18H6.5A2.5 2.5 0 0 1 4 15.5V4.75A2.75 2.75 0 0 1 6.75 2ZM6.5 14.5H14A0.5 0.5 0 0 1 14.5 15V15.25A1.25 1.25 0 0 1 13.25 16.5H6.5A1 1 0 0 1 5.5 15.5A1 1 0 0 1 6.5 14.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M7.25 2H16.75A3.25 3.25 0 0 1 20 5.25V18.75A3.25 3.25 0 0 1 16.75 22H6.75A2.75 2.75 0 0 1 4 19.25V5.25A3.25 3.25 0 0 1 7.25 2ZM6.75 18H18A0.5 0.5 0 0 1 18.5 18.5V18.75A1.75 1.75 0 0 1 16.75 20.5H6.75A1.25 1.25 0 0 1 5.5 19.25A1.25 1.25 0 0 1 6.75 18Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "I",
      "label": "Spine band",
      "tags": [
        "read",
        "library",
        "spine",
        "hardcover"
      ],
      "note": "Spine band alone. A plain cover with one spine line top to bottom, SF Symbols' closed book. Spine on x 7.75 · 7.75 · 6.375: spine band clear 1.5 at every master, front panel clear 10 · 6 · 4.75. Corners 1.5 · 1.25 · 1. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: two solids, the spine strip (3 · 3 · 2.625 wide) and the front cover, split by a cut 1.5 wide, their corners at the cut rounded 0.5. The quietest of the ten; its risk is layout-sidebar, which is the same box and line (square, line at x 9.75)",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H4.625A1 1 0 0 1 3.625 13.375V2.625A1 1 0 0 1 4.625 1.625Z",
          "M6.375 1.625V14.375"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6A1.25 1.25 0 0 1 4.75 16V4A1.25 1.25 0 0 1 6 2.75Z",
          "M7.75 2.75V17.25"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.25A1.5 1.5 0 0 1 4.75 19.75V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M7.75 2.75V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H5.125A0.5 0.5 0 0 1 5.625 1.5V14.5A0.5 0.5 0 0 1 5.125 15H4.625A1.625 1.625 0 0 1 3 13.375V2.625A1.625 1.625 0 0 1 4.625 1Z",
            "M7.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H7.625A0.5 0.5 0 0 1 7.125 14.5V1.5A0.5 0.5 0 0 1 7.625 1Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H6.5A0.5 0.5 0 0 1 7 2.5V17.5A0.5 0.5 0 0 1 6.5 18H6A2 2 0 0 1 4 16V4A2 2 0 0 1 6 2Z",
            "M9 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H9A0.5 0.5 0 0 1 8.5 17.5V2.5A0.5 0.5 0 0 1 9 2Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H6.5A0.5 0.5 0 0 1 7 2.5V21.5A0.5 0.5 0 0 1 6.5 22H6.25A2.25 2.25 0 0 1 4 19.75V4.25A2.25 2.25 0 0 1 6.25 2Z",
            "M9 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H9A0.5 0.5 0 0 1 8.5 21.5V2.5A0.5 0.5 0 0 1 9 2Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "J",
      "label": "Spine band, title",
      "tags": [
        "read",
        "library",
        "spine",
        "hardcover",
        "title",
        "label"
      ],
      "note": "Spine band and a title label. I's cover with a title line on the front panel: 5.5 · 1.5 long on its centreline (ink 7 · 3) at y 7.25 · 6.25, 1.5 clear of the spine and of the fore-edge. At 16 the front panel is 4.75 clear, so a label with 1.5 of air either side would be 0.5 long - a speck - and it is dropped: J's 16 is I's. Ink box 16x20 · 12x16 · 10x14, filled identical. Filled: spine strip and front cover split by a 1.5 cut, the label knocked out as a slot at its ink size. Nucleo's construction; the label keeps it off layout-sidebar at 24 and 20 only",
      "masters": {
        "16": [
          "M4.625 1.625H11.375A1 1 0 0 1 12.375 2.625V13.375A1 1 0 0 1 11.375 14.375H4.625A1 1 0 0 1 3.625 13.375V2.625A1 1 0 0 1 4.625 1.625Z",
          "M6.375 1.625V14.375"
        ],
        "20": [
          "M6 2.75H14A1.25 1.25 0 0 1 15.25 4V16A1.25 1.25 0 0 1 14 17.25H6A1.25 1.25 0 0 1 4.75 16V4A1.25 1.25 0 0 1 6 2.75Z",
          "M7.75 2.75V17.25",
          "M10.75 6.25H12.25"
        ],
        "24": [
          "M6.25 2.75H17.75A1.5 1.5 0 0 1 19.25 4.25V19.75A1.5 1.5 0 0 1 17.75 21.25H6.25A1.5 1.5 0 0 1 4.75 19.75V4.25A1.5 1.5 0 0 1 6.25 2.75Z",
          "M7.75 2.75V21.25",
          "M10.75 7.25H16.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.625 1H5.125A0.5 0.5 0 0 1 5.625 1.5V14.5A0.5 0.5 0 0 1 5.125 15H4.625A1.625 1.625 0 0 1 3 13.375V2.625A1.625 1.625 0 0 1 4.625 1Z",
            "M7.625 1H11.375A1.625 1.625 0 0 1 13 2.625V13.375A1.625 1.625 0 0 1 11.375 15H7.625A0.5 0.5 0 0 1 7.125 14.5V1.5A0.5 0.5 0 0 1 7.625 1Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H6.5A0.5 0.5 0 0 1 7 2.5V17.5A0.5 0.5 0 0 1 6.5 18H6A2 2 0 0 1 4 16V4A2 2 0 0 1 6 2Z",
            "M9 2H14A2 2 0 0 1 16 4V16A2 2 0 0 1 14 18H9A0.5 0.5 0 0 1 8.5 17.5V2.5A0.5 0.5 0 0 1 9 2ZM10.75 5.5H12.25A0.75 0.75 0 0 1 13 6.25A0.75 0.75 0 0 1 12.25 7H10.75A0.75 0.75 0 0 1 10 6.25A0.75 0.75 0 0 1 10.75 5.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 2H6.5A0.5 0.5 0 0 1 7 2.5V21.5A0.5 0.5 0 0 1 6.5 22H6.25A2.25 2.25 0 0 1 4 19.75V4.25A2.25 2.25 0 0 1 6.25 2Z",
            "M9 2H17.75A2.25 2.25 0 0 1 20 4.25V19.75A2.25 2.25 0 0 1 17.75 22H9A0.5 0.5 0 0 1 8.5 21.5V2.5A0.5 0.5 0 0 1 9 2ZM10.75 6.5H16.25A0.75 0.75 0 0 1 17 7.25A0.75 0.75 0 0 1 16.25 8H10.75A0.75 0.75 0 0 1 10 7.25A0.75 0.75 0 0 1 10.75 6.5Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
