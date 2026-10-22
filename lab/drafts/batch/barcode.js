// barcode: the bars are the whole icon, so this decides whether our barcode is the code itself (bars alone or with UPC guards), the code being scanned (viewfinder, scanner gun) or the printed label — and whether a later scan-barcode composite gets its own picture.
export default {
  "concept": "barcode",
  "question": "Which picture says barcode: the bars alone (A), the bars inside the viewfinder corners (B), the bars with UPC guard bars (C), a barcode label (D) or the handheld scanner (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Bars, mixed width",
      "tags": [
        "bars",
        "upc",
        "ean",
        "product code",
        "sku"
      ],
      "note": "Rhythm: four bars — thin, thick, thin, thin — with one equal air between every pair: 3.5 · 2.5 · 2.25 (filled 2.5 · 2 · 1.5, floor 1.5). Thin bars 1.5 · 1.5 · 1.25 (the line weight), the thick bar exactly two lines wide, 3 · 3 · 2.5, drawn as a block whose corners are the join radius 0.75 · 0.75 · 0.625 (C10's half-weight bend), so its top is flat where the thin bars are round — the flat top is what reads as print, not as a pill. Same four bars at every master: five filled bars of 2 across the 14 a 16 master allows leave 1 of air, so five fit nowhere at 16. Ink 18×14 · 15×11.5 · 13×10 (declared box, ≈1.3:1 landscape at each master), box-centred; the thick bar second puts the mass 0.35 · 0.25 · 0.23 left of centre, left as drawn. Filled: C17 repeated elements, as chart-bar and menu — weight 2.5 · 2 · 2, every bar thickens in place (thick bar 4 · 3.5 · 3.25), ends held, so the filled ink is 19×14 · 15.5×11.5 · 13.75×10, declared grows 0.5 · 0.25 · 0.375 left and right. Who: SF Symbols barcode, Material Symbols barcode, Font Awesome barcode, MDI barcode, Remix barcode, Carbon barcode, Bootstrap upc, Lucide barcode (equal bars), Nucleo barcode. (recommended) — it is the barcode itself, the picture most sets use, and at 16 the one thick bar among thin ones is what tells it apart from chart-bar and menu.",
      "masters": {
        "16": [
          "M2.125 3.625V12.375",
          "M5.625 3.625H6.875V12.375H5.625Z",
          "M10.375 3.625V12.375",
          "M13.875 3.625V12.375"
        ],
        "20": [
          "M3.25 5V15",
          "M7.25 5H8.75V15H7.25Z",
          "M12.75 5V15",
          "M16.75 5V15"
        ],
        "24": [
          "M3.75 5.75V18.25",
          "M8.75 5.75H10.25V18.25H8.75Z",
          "M15.25 5.75V18.25",
          "M20.25 5.75V18.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.125 4V12",
            "M5.625 4H6.875V12H5.625Z",
            "M10.375 4V12",
            "M13.875 4V12"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3.25 5.25V14.75",
            "M7.25 5.25H8.75V14.75H7.25Z",
            "M12.75 5.25V14.75",
            "M16.75 5.25V14.75"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 6.25V17.75",
            "M8.75 6.25H10.25V17.75H8.75Z",
            "M15.25 6.25V17.75",
            "M20.25 6.25V17.75"
          ]
        }
      },
      "box": {
        "16": [
          13,
          10
        ],
        "20": [
          15,
          11.5
        ],
        "24": [
          18,
          14
        ]
      },
      "grows": {
        "16": [
          0.375,
          0.375,
          0,
          0
        ],
        "20": [
          0.25,
          0.25,
          0,
          0
        ],
        "24": [
          0.5,
          0.5,
          0,
          0
        ]
      }
    },
    {
      "id": "B",
      "label": "Bars in viewfinder",
      "tags": [
        "scan",
        "viewfinder",
        "scan barcode",
        "corners",
        "brackets"
      ],
      "note": "Rhythm: maximize's corners exactly — spread 18 · 14 · 12, radius 2.5 · 2 · 1.5, arms 6 · 4.75 · 4 of ink — as scan and qr-code draw them, so the three sit as one family. Inside, a thick + thin pair (3/1.5 · 3/1.5 · 2.5/1.25, the thick bar a flat-topped block as A's) with air 3 · 2 · 2 between them; the pair is half the corners' inner width, 7.5×9 · 6.5×7 · 5.75×6.5, centred, with 3.75 · 2.25 · 1.875 of air to the corners at the sides and 3 · 2 · 1.5 at top and bottom. Two bars, not three: inside maximize's corners the room is 12 · 8 · 6.5, and three bars at 16 need 6.75 in the outline, three filled bars at 20 need 9. Ink 18×18 · 14×14 · 12×12 (square keyline), outline and filled. Filled: maximize-5's precedent — the corners stay at the line weight 1.5 · 1.5 · 1.25, the bars fill in place, widened 0.5 · 0.25 · 0.25 a side (thick 4 · 3.5 · 3, thin 2.5 · 2 · 1.75), air between 2 · 1.5 · 1.5, to the corners 3.25 · 2 · 1.625; at 16 the thin bar stops at 1.75, as 2 would leave the pair 1.25 apart. Who: Lucide scan-barcode, Phosphor barcode, Tabler barcode, Polaris barcode, Fluent barcode-scanner, Material Symbols barcode_scanner, MDI barcode-scan, Bootstrap upc-scan, SF Symbols barcode.viewfinder. Reads as scan-barcode as much as barcode; worth keeping for that composite beside scan.",
      "masters": {
        "16": [
          "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
          "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
          "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
          "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625",
          "M5.75 5.375H7V10.625H5.75Z",
          "M10.25 5.375V10.625"
        ],
        "20": [
          "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
          "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
          "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
          "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13",
          "M7.5 7.25H9V12.75H7.5Z",
          "M12.5 7.25V12.75"
        ],
        "24": [
          "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
          "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
          "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
          "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75",
          "M9 8.25H10.5V15.75H9Z",
          "M15 8.25V15.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.75 4.75H7A0.875 0.875 0 0 1 7.875 5.625V10.375A0.875 0.875 0 0 1 7 11.25H5.75A0.875 0.875 0 0 1 4.875 10.375V5.625A0.875 0.875 0 0 1 5.75 4.75Z",
            "M10.25 4.75H10.25A0.875 0.875 0 0 1 11.125 5.625V10.375A0.875 0.875 0 0 1 10.25 11.25H10.25A0.875 0.875 0 0 1 9.375 10.375V5.625A0.875 0.875 0 0 1 10.25 4.75Z"
          ],
          "stroke": [
            "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
            "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
            "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
            "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625"
          ]
        },
        "20": {
          "fill": [
            "M7.5 6.5H9A1 1 0 0 1 10 7.5V12.5A1 1 0 0 1 9 13.5H7.5A1 1 0 0 1 6.5 12.5V7.5A1 1 0 0 1 7.5 6.5Z",
            "M12.5 6.5H12.5A1 1 0 0 1 13.5 7.5V12.5A1 1 0 0 1 12.5 13.5H12.5A1 1 0 0 1 11.5 12.5V7.5A1 1 0 0 1 12.5 6.5Z"
          ],
          "stroke": [
            "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
            "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
            "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
            "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13"
          ]
        },
        "24": {
          "fill": [
            "M9 7.5H10.5A1.25 1.25 0 0 1 11.75 8.75V15.25A1.25 1.25 0 0 1 10.5 16.5H9A1.25 1.25 0 0 1 7.75 15.25V8.75A1.25 1.25 0 0 1 9 7.5Z",
            "M15 7.5H15A1.25 1.25 0 0 1 16.25 8.75V15.25A1.25 1.25 0 0 1 15 16.5H15A1.25 1.25 0 0 1 13.75 15.25V8.75A1.25 1.25 0 0 1 15 7.5Z"
          ],
          "stroke": [
            "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
            "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
            "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
            "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Bars with UPC guards",
      "tags": [
        "upc",
        "ean",
        "guard bars",
        "product code"
      ],
      "note": "Rhythm: A's four bars on A's pitch (air 3.5 · 2.5 · 2.25, filled 2.5 · 2 · 1.5), tops level; the outer two are the guard bars and run full height, the inner thick and thin bars stop short by 3.5 · 2.75 · 2.5 (25 · 24 · 25% of the height), the step real UPC and EAN codes have where the digits sit. Ink 18×14 · 15×11.5 · 13×10 (declared box, A's), box-centred. Filled: C17, as A — weight 2.5 · 2 · 2, bars thicken in place, ends held, grows 0.5 · 0.25 · 0.375 left and right. A clearly different construction of A's metaphor rather than a separate picture: a digit row under the short bars was drawn and dropped — two dashes under two bars read as \"!!\" at 16, and one line read as a cup. Who: Nucleo barcode (12 grid, long and short bars), Hugeicons barcode (long guards, short data bars over digit dots), Ant Design barcode (bars over digits).",
      "masters": {
        "16": [
          "M2.125 3.625V12.375",
          "M5.625 3.625H6.875V9.875H5.625Z",
          "M10.375 3.625V9.875",
          "M13.875 3.625V12.375"
        ],
        "20": [
          "M3.25 5V15",
          "M7.25 5H8.75V12.25H7.25Z",
          "M12.75 5V12.25",
          "M16.75 5V15"
        ],
        "24": [
          "M3.75 5.75V18.25",
          "M8.75 5.75H10.25V14.75H8.75Z",
          "M15.25 5.75V14.75",
          "M20.25 5.75V18.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.125 4V12",
            "M5.625 4H6.875V9.5H5.625Z",
            "M10.375 4V9.5",
            "M13.875 4V12"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3.25 5.25V14.75",
            "M7.25 5.25H8.75V12H7.25Z",
            "M12.75 5.25V12",
            "M16.75 5.25V14.75"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 6.25V17.75",
            "M8.75 6.25H10.25V14.25H8.75Z",
            "M15.25 6.25V14.25",
            "M20.25 6.25V17.75"
          ]
        }
      },
      "box": {
        "16": [
          13,
          10
        ],
        "20": [
          15,
          11.5
        ],
        "24": [
          18,
          14
        ]
      },
      "grows": {
        "16": [
          0.375,
          0.375,
          0,
          0
        ],
        "20": [
          0.25,
          0.25,
          0,
          0
        ],
        "24": [
          0.5,
          0.5,
          0,
          0
        ]
      }
    },
    {
      "id": "D",
      "label": "Barcode label",
      "tags": [
        "label",
        "sticker",
        "price label",
        "box"
      ],
      "note": "Rhythm: keyboard's body exactly, 20×12 · 16×11 · 14×10, corner radius 2.5 · 2 · 1.5, holding three bars — thin, thick, thin (1.5/3/1.5 · 1.5/3/1.5 · 1.25/2.5/1.25) — with equal air between bars 3 · 2 · 1.75. The bars stand 6 · 5 · 4.5 tall with 1.5 of air to the top and bottom walls at every master; side air 2.5 · 1.5 · 1.5 — at 24 four bars would fit, but three keep the count at 20 and 16, so 24 is left 1 wider at the sides than at the top. Ink 20×12 · 16×11 · 14×10 (declared box, keyboard's), box-centred. Filled: the label fills and the bars are cut out in white, round-ended as the outline's bars, 1.5/3/1.5 · 1.5/3/1.5 · 1.5/2.75/1.5 wide (white at least 1.5, so the 16 cuts are 0.125 wider each side than the 1.25 bars); label left between cuts 3 · 2 · 1.5, the lint floor at 16 is 1.25. Who: Remix barcode-box, Mingcute barcode, Streamline barcode, Tabler file-barcode (on a sheet).",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M4.375 6.375V9.625",
          "M7.375 6.375H8.625V9.625H7.375Z",
          "M11.625 6.375V9.625"
        ],
        "20": [
          "M4.75 5.25H15.25A2 2 0 0 1 17.25 7.25V12.75A2 2 0 0 1 15.25 14.75H4.75A2 2 0 0 1 2.75 12.75V7.25A2 2 0 0 1 4.75 5.25Z",
          "M5.75 8.25V11.75",
          "M9.25 8.25H10.75V11.75H9.25Z",
          "M14.25 8.25V11.75"
        ],
        "24": [
          "M5.25 6.75H18.75A2.5 2.5 0 0 1 21.25 9.25V14.75A2.5 2.5 0 0 1 18.75 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M6.75 9.75V14.25",
          "M11.25 9.75H12.75V14.25H11.25Z",
          "M17.25 9.75V14.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM4.375 5.75H4.375A0.75 0.75 0 0 1 5.125 6.5V9.5A0.75 0.75 0 0 1 4.375 10.25H4.375A0.75 0.75 0 0 1 3.625 9.5V6.5A0.75 0.75 0 0 1 4.375 5.75ZM7.375 5.75H8.625A0.75 0.75 0 0 1 9.375 6.5V9.5A0.75 0.75 0 0 1 8.625 10.25H7.375A0.75 0.75 0 0 1 6.625 9.5V6.5A0.75 0.75 0 0 1 7.375 5.75ZM11.625 5.75H11.625A0.75 0.75 0 0 1 12.375 6.5V9.5A0.75 0.75 0 0 1 11.625 10.25H11.625A0.75 0.75 0 0 1 10.875 9.5V6.5A0.75 0.75 0 0 1 11.625 5.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4.5H15.25A2.75 2.75 0 0 1 18 7.25V12.75A2.75 2.75 0 0 1 15.25 15.5H4.75A2.75 2.75 0 0 1 2 12.75V7.25A2.75 2.75 0 0 1 4.75 4.5ZM5.75 7.5H5.75A0.75 0.75 0 0 1 6.5 8.25V11.75A0.75 0.75 0 0 1 5.75 12.5H5.75A0.75 0.75 0 0 1 5 11.75V8.25A0.75 0.75 0 0 1 5.75 7.5ZM9.25 7.5H10.75A0.75 0.75 0 0 1 11.5 8.25V11.75A0.75 0.75 0 0 1 10.75 12.5H9.25A0.75 0.75 0 0 1 8.5 11.75V8.25A0.75 0.75 0 0 1 9.25 7.5ZM14.25 7.5H14.25A0.75 0.75 0 0 1 15 8.25V11.75A0.75 0.75 0 0 1 14.25 12.5H14.25A0.75 0.75 0 0 1 13.5 11.75V8.25A0.75 0.75 0 0 1 14.25 7.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H18.75A3.25 3.25 0 0 1 22 9.25V14.75A3.25 3.25 0 0 1 18.75 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM6.75 9H6.75A0.75 0.75 0 0 1 7.5 9.75V14.25A0.75 0.75 0 0 1 6.75 15H6.75A0.75 0.75 0 0 1 6 14.25V9.75A0.75 0.75 0 0 1 6.75 9ZM11.25 9H12.75A0.75 0.75 0 0 1 13.5 9.75V14.25A0.75 0.75 0 0 1 12.75 15H11.25A0.75 0.75 0 0 1 10.5 14.25V9.75A0.75 0.75 0 0 1 11.25 9ZM17.25 9H17.25A0.75 0.75 0 0 1 18 9.75V14.25A0.75 0.75 0 0 1 17.25 15H17.25A0.75 0.75 0 0 1 16.5 14.25V9.75A0.75 0.75 0 0 1 17.25 9Z"
          ],
          "stroke": []
        }
      },
      "box": {
        "16": [
          14,
          10
        ],
        "20": [
          16,
          11
        ],
        "24": [
          20,
          12
        ]
      }
    },
    {
      "id": "E",
      "label": "Handheld scanner",
      "tags": [
        "scanner",
        "barcode reader",
        "scanner gun",
        "point of sale",
        "device"
      ],
      "note": "Rhythm: three rays fan from the scanner's nose with equal air between their inner ends, 1.5 at every master (pitch 3 · 3 · 2.75), 1.5 clear of the head, slopes 0.42 · 0.5 · 0.5 so they spread from inside the head. Head a rounded block 14×8 · 11.5×7 · 10×6 of ink, container radius 2.5 · 2 · 1.5; handle hung from the head's back half, raked back 15.3° · 15.7° · 15°, inside air 2.6 · 2.35 · 1.89, its bottom corners rounded at the detail radius 1.5 · 1.25 · 1 (the fillet tangent points are off the quarter and eighth grid — 2 and 3 dp — because the handle is raked). Ink 20×20 · 16×16 · 14×14 (circle keyline), box-centred. Filled: a shape icon — head and handle fill as one silhouette whose outer edge is the outline's, the rays stay at the line weight 1.5 · 1.5 · 1.25. Who: Material Symbols barcode_reader (the only major set that draws the gun). It says \"barcode scanner\" more than \"barcode\" — a device, and a candidate name of its own (barcode-scanner).",
      "masters": {
        "16": [
          "M3.125 2.625H8.875A1.5 1.5 0 0 1 10.375 4.125V5.875A1.5 1.5 0 0 1 8.875 7.375H3.125A1.5 1.5 0 0 1 1.625 5.875V4.125A1.5 1.5 0 0 1 3.125 2.625Z",
          "M4.125 7.375L2.587 13.116A1 1 0 0 0 3.553 14.375H4.733A1 1 0 0 0 5.699 13.634L7.375 7.375",
          "M13.125 2.25L14.375 1.625",
          "M13.125 5L14.375 5",
          "M13.125 7.75L14.375 8.375"
        ],
        "20": [
          "M4.75 3.75H10.75A2 2 0 0 1 12.75 5.75V7.25A2 2 0 0 1 10.75 9.25H4.75A2 2 0 0 1 2.75 7.25V5.75A2 2 0 0 1 4.75 3.75Z",
          "M6 9.25L4.2 15.66A1.25 1.25 0 0 0 5.4 17.25H6.8A1.25 1.25 0 0 0 8.01 16.34L10 9.25",
          "M15.75 3.5L17.25 2.75",
          "M15.75 6.5L17.25 6.5",
          "M15.75 9.5L17.25 10.25"
        ],
        "24": [
          "M5.25 3.75H12.75A2.5 2.5 0 0 1 15.25 6.25V7.75A2.5 2.5 0 0 1 12.75 10.25H5.25A2.5 2.5 0 0 1 2.75 7.75V6.25A2.5 2.5 0 0 1 5.25 3.75Z",
          "M6.5 10.25L4.02 19.36A1.5 1.5 0 0 0 5.46 21.25H6.6A1.5 1.5 0 0 0 8.05 20.14L10.75 10.25",
          "M18.25 4L21.25 2.75",
          "M18.25 7L21.25 7",
          "M18.25 10L21.25 11.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 2H8.875A2.125 2.125 0 0 1 11 4.125V5.875A2.125 2.125 0 0 1 8.875 8H7.855L6.302 13.795A1.625 1.625 0 0 1 4.733 15H3.553A1.625 1.625 0 0 1 1.983 12.955L3.311 8H3.125A2.125 2.125 0 0 1 1 5.875V4.125A2.125 2.125 0 0 1 3.125 2Z"
          ],
          "stroke": [
            "M13.125 2.25L14.375 1.625",
            "M13.125 5L14.375 5",
            "M13.125 7.75L14.375 8.375"
          ]
        },
        "20": {
          "fill": [
            "M4.75 3H10.75A2.75 2.75 0 0 1 13.5 5.75V7.25A2.75 2.75 0 0 1 10.75 10H10.57L8.73 16.54A2 2 0 0 1 6.8 18H5.4A2 2 0 0 1 3.47 15.46L5.01 10H4.75A2.75 2.75 0 0 1 2 7.25V5.75A2.75 2.75 0 0 1 4.75 3Z"
          ],
          "stroke": [
            "M15.75 3.5L17.25 2.75",
            "M15.75 6.5L17.25 6.5",
            "M15.75 9.5L17.25 10.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 3H12.75A3.25 3.25 0 0 1 16 6.25V7.75A3.25 3.25 0 0 1 12.75 11H11.32L8.78 20.34A2.25 2.25 0 0 1 6.6 22H5.46A2.25 2.25 0 0 1 3.29 19.16L5.52 11H5.25A3.25 3.25 0 0 1 2 7.75V6.25A3.25 3.25 0 0 1 5.25 3Z"
          ],
          "stroke": [
            "M18.25 4L21.25 2.75",
            "M18.25 7L21.25 7",
            "M18.25 10L21.25 11.25"
          ]
        }
      }
    }
  ]
};
