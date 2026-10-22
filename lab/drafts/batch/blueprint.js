// blueprint: a plan, an architecture design, a template or a spec. Round 2 (Maruti's review): the
// drafting tools (round 1's D, E) are out; A–C are polished, F–J are five more familiar pictures. The
// picture decides whether the icon says "a drawn plan" or "a design document"; Development & Infra reads
// it as a system design doc. Generated from hand-set numbers; off-grid values explained per candidate.
export default {
  concept: 'blueprint',
  question: 'Which of eight symbols reads as blueprint?',
  candidates: [
    // A: every value on the quarter grid at 24/20 and the eighth grid at 16; no corrective decimals.
    {
      "id": "A",
      "label": "Floor plan",
      "tags": [
        "floor plan",
        "plan",
        "architecture",
        "rooms",
        "spec",
        "design"
      ],
      "note": "Before → after: a front door in the bottom wall, under the inside door at 24 (12.25–16.25 · 10–13.5 · 7.875–11.125), so the frame is open and no wall runs edge to edge, which a layout never does. The inside wall moves left to make room for it: 10.25 → 9.75 · 8.75 → 8.25 · 6.625 → 6.375 (rooms 6 | 10.5 · 4.5 | 8 · 3.75 | 7 on the centrelines). All three doors are the same 2.5 · 2 · 2 of air, the same as B and C. Frame 18 · 14 · 12, corners 2.5 · 2 · 1.5; ink 18×18 · 14×14 · 12×12, box-centred. Filled before → after: walls were white cuts floating 1.5 short of the edge with a sharp inside corner; now walls that meet the frame are 1.5 bands that reach the edge, as in layout-sidebar-filled. Every corner where a band meets an edge, and the L's inside corner, is rounded 0.5, as in layout-*-filled. The front door is a notch as wide as the door (2.5 · 2 · 2) and as deep as the wall (1.5 · 1.5 · 1.25). The narrowest dark part at 16 is 1.5, beside the notch. Nucleo's `blueprint` is this picture (18 and 12 grids, in the refs file)",
      "masters": {
        "16": [
          "M11.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H7.875",
          "M6.375 2.625V6.125",
          "M10.125 9.375H6.375V13.375"
        ],
        "20": [
          "M13.5 16.25H14.25A2 2 0 0 0 16.25 14.25V5.75A2 2 0 0 0 14.25 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H10",
          "M8.25 3.75V7.75",
          "M12.75 11.25H8.25V16.25"
        ],
        "24": [
          "M16.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H12.25",
          "M9.75 3.75V9.75",
          "M16.25 13.75H9.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.125 2H5.125A0.5 0.5 0 0 1 5.625 2.5V6.125A0.75 0.75 0 0 0 7.125 6.125V2.5A0.5 0.5 0 0 1 7.625 2H11.875A2.125 2.125 0 0 1 14 4.125V11.875A2.125 2.125 0 0 1 11.875 14H10.875A0.5 0.5 0 0 1 10.375 13.5V13.25A0.5 0.5 0 0 0 9.875 12.75H9.125A0.5 0.5 0 0 0 8.625 13.25V13.5A0.5 0.5 0 0 1 8.125 14H7.625A0.5 0.5 0 0 1 7.125 13.5V10.625A0.5 0.5 0 0 1 7.625 10.125H10.125A0.75 0.75 0 0 0 10.125 8.625H6.375A0.75 0.75 0 0 0 5.625 9.375V13.5A0.5 0.5 0 0 1 5.125 14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M5.75 3H7A0.5 0.5 0 0 1 7.5 3.5V7.75A0.75 0.75 0 0 0 9 7.75V3.5A0.5 0.5 0 0 1 9.5 3H14.25A2.75 2.75 0 0 1 17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H13.25A0.5 0.5 0 0 1 12.75 16.5V16A0.5 0.5 0 0 0 12.25 15.5H11.25A0.5 0.5 0 0 0 10.75 16V16.5A0.5 0.5 0 0 1 10.25 17H9.5A0.5 0.5 0 0 1 9 16.5V12.5A0.5 0.5 0 0 1 9.5 12H12.75A0.75 0.75 0 0 0 12.75 10.5H8.25A0.75 0.75 0 0 0 7.5 11.25V16.5A0.5 0.5 0 0 1 7 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 3H8.5A0.5 0.5 0 0 1 9 3.5V9.75A0.75 0.75 0 0 0 10.5 9.75V3.5A0.5 0.5 0 0 1 11 3H17.75A3.25 3.25 0 0 1 21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H16A0.5 0.5 0 0 1 15.5 20.5V20A0.5 0.5 0 0 0 15 19.5H13.5A0.5 0.5 0 0 0 13 20V20.5A0.5 0.5 0 0 1 12.5 21H11A0.5 0.5 0 0 1 10.5 20.5V15A0.5 0.5 0 0 1 11 14.5H16.25A0.75 0.75 0 0 0 16.25 13H9.75A0.75 0.75 0 0 0 9 13.75V20.5A0.5 0.5 0 0 1 8.5 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3Z"
          ],
          "stroke": []
        }
      }
    },
    // B: the filled roll at 16 is a rounded rect of radius 1.25, not a full 1.3125 round end, to keep 3 dp (its width, 2.625, is set by the band on the roll's line).
    {
      "id": "B",
      "label": "Rolled plan",
      "tags": [
        "roll",
        "rolled plan",
        "plan",
        "architecture",
        "spec",
        "template",
        "design"
      ],
      "note": "Before → after: doors 2 · 1.75 · 1.5 → 2.5 · 2 · 2, the same as A and C. The plan moves left to fit them: wall 13.25 → 12.75 · 10.75 → 10.5 · 8.625 → 8.375; arm end 16.75 → 16.25 · 13 → 12.75 · 10.625 → 10.125. Roll 4.5 · 3.5 · 2.75 wide (ink 6 · 5 · 4), full height, round both ends; sheet 12×12 · 9×9 · 8×7.25, the roll standing 2.25 · 1.75 · 1.75 proud of it top and bottom. Ink 18×18 · 14×14 · 12×12, box-centred. Filled before → after: the roll edge was a white seam floating inside one solid; now it is a 1.5 band on the roll's own line (layout-sidebar-filled), so the roll is a pill 4.5 · 3.5 · 2.625 wide and the sheet its own tile. The walls are bands to the sheet's edges with 0.5 fillets. At 16 the filled twin keeps the top wall now; round 1 dropped it. Phosphor's `Blueprint` draws a roll with a plan on its sheet (from memory, not captured). The only one of the eight with a silhouette nothing shipped has (recommended)",
      "masters": {
        "16": [
          "M4 2.625A1.375 1.375 0 0 1 5.375 4V12A1.375 1.375 0 0 1 4 13.375A1.375 1.375 0 0 1 2.625 12V4A1.375 1.375 0 0 1 4 2.625Z",
          "M5.375 4.375H11.875A1.5 1.5 0 0 1 13.375 5.875V10.125A1.5 1.5 0 0 1 11.875 11.625H5.375",
          "M8.375 4.375V5.375",
          "M10.125 8.625H8.375V11.625"
        ],
        "20": [
          "M5.5 3.75A1.75 1.75 0 0 1 7.25 5.5V14.5A1.75 1.75 0 0 1 5.5 16.25A1.75 1.75 0 0 1 3.75 14.5V5.5A1.75 1.75 0 0 1 5.5 3.75Z",
          "M7.25 5.5H14.25A2 2 0 0 1 16.25 7.5V12.5A2 2 0 0 1 14.25 14.5H7.25",
          "M10.5 5.5V7.5",
          "M12.75 11H10.5V14.5"
        ],
        "24": [
          "M6 3.75A2.25 2.25 0 0 1 8.25 6V18A2.25 2.25 0 0 1 6 20.25A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75Z",
          "M8.25 6H17.75A2.5 2.5 0 0 1 20.25 8.5V15.5A2.5 2.5 0 0 1 17.75 18H8.25",
          "M12.75 6V9.25",
          "M16.25 13.25H12.75V18"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 2H3.375A1.25 1.25 0 0 1 4.625 3.25V12.75A1.25 1.25 0 0 1 3.375 14H3.25A1.25 1.25 0 0 1 2 12.75V3.25A1.25 1.25 0 0 1 3.25 2Z",
            "M6.625 3.75H7.125A0.5 0.5 0 0 1 7.625 4.25V5.375A0.75 0.75 0 0 0 9.125 5.375V4.25A0.5 0.5 0 0 1 9.625 3.75H11.875A2.125 2.125 0 0 1 14 5.875V10.125A2.125 2.125 0 0 1 11.875 12.25H9.625A0.5 0.5 0 0 1 9.125 11.75V9.875A0.5 0.5 0 0 1 9.625 9.375H10.125A0.75 0.75 0 0 0 10.125 7.875H8.375A0.75 0.75 0 0 0 7.625 8.625V11.75A0.5 0.5 0 0 1 7.125 12.25H6.625A0.5 0.5 0 0 1 6.125 11.75V4.25A0.5 0.5 0 0 1 6.625 3.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 3H4.75A1.75 1.75 0 0 1 6.5 4.75V15.25A1.75 1.75 0 0 1 4.75 17H4.75A1.75 1.75 0 0 1 3 15.25V4.75A1.75 1.75 0 0 1 4.75 3Z",
            "M8.5 4.75H9.25A0.5 0.5 0 0 1 9.75 5.25V7.5A0.75 0.75 0 0 0 11.25 7.5V5.25A0.5 0.5 0 0 1 11.75 4.75H14.25A2.75 2.75 0 0 1 17 7.5V12.5A2.75 2.75 0 0 1 14.25 15.25H11.75A0.5 0.5 0 0 1 11.25 14.75V12.25A0.5 0.5 0 0 1 11.75 11.75H12.75A0.75 0.75 0 0 0 12.75 10.25H10.5A0.75 0.75 0 0 0 9.75 11V14.75A0.5 0.5 0 0 1 9.25 15.25H8.5A0.5 0.5 0 0 1 8 14.75V5.25A0.5 0.5 0 0 1 8.5 4.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 3H5.25A2.25 2.25 0 0 1 7.5 5.25V18.75A2.25 2.25 0 0 1 5.25 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25A2.25 2.25 0 0 1 5.25 3Z",
            "M9.5 5.25H11.5A0.5 0.5 0 0 1 12 5.75V9.25A0.75 0.75 0 0 0 13.5 9.25V5.75A0.5 0.5 0 0 1 14 5.25H17.75A3.25 3.25 0 0 1 21 8.5V15.5A3.25 3.25 0 0 1 17.75 18.75H14A0.5 0.5 0 0 1 13.5 18.25V14.5A0.5 0.5 0 0 1 14 14H16.25A0.75 0.75 0 0 0 16.25 12.5H12.75A0.75 0.75 0 0 0 12 13.25V18.25A0.5 0.5 0 0 1 11.5 18.75H9.5A0.5 0.5 0 0 1 9 18.25V5.75A0.5 0.5 0 0 1 9.5 5.25Z"
          ],
          "stroke": []
        }
      }
    },
    // C: 3.04 / 18.96 / 19.13 / 7.57 / 14.43 / 2.87 (and the 20/16 twins) are file-filled's flap, copied verbatim; the walls sit on the grid.
    {
      "id": "C",
      "label": "Document with a plan",
      "tags": [
        "document",
        "file",
        "plan",
        "spec",
        "design doc",
        "architecture"
      ],
      "note": "Before → after: round 1 had a stub from the left wall, a door and an L, three pieces that crowded 16 (a 2.5 stub, a 0.875 cut in the filled twin). Now it is one wall in from the right edge that stops a door short of the left edge (2.5 · 2 · 2, as A and B), and one wall down from it to the foot, a T. Wall at 14.75 · 12.25 · 9.625; the foot wall at 13.25 · 11 · 8.625, leaving rooms 8.5 | 6 · 6.25 | 4.25 · 5 | 3.75. The shipped `file` is unchanged (fold, chamfer, radii). Ink 16×20 · 12×16 · 10×14 on file's portrait keyline. Filled before → after: floating cuts → bands that reach the edge; the closed bottom-right room becomes its own tile (table-filled's cells); 0.5 fillets at every band corner. The page-with-a-picture pattern most sets use for document variants (from memory)",
      "masters": {
        "16": [
          "M5.125 1.625H8.25L12.375 5.75V12.875A1.5 1.5 0 0 1 10.875 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V3.125A1.5 1.5 0 0 1 5.125 1.625Z",
          "M8.25 1.625V4.75A1 1 0 0 0 9.25 5.75H12.375",
          "M12.375 9.625H6.875",
          "M8.625 9.625V14.375"
        ],
        "20": [
          "M6.75 2.75H10.25L15.25 7.75V15.25A2 2 0 0 1 13.25 17.25H6.75A2 2 0 0 1 4.75 15.25V4.75A2 2 0 0 1 6.75 2.75Z",
          "M10.25 2.75V6.5A1.25 1.25 0 0 0 11.5 7.75H15.25",
          "M15.25 12.25H8.25",
          "M11 12.25V17.25"
        ],
        "24": [
          "M7.25 2.75H13.25L19.25 8.75V18.75A2.5 2.5 0 0 1 16.75 21.25H7.25A2.5 2.5 0 0 1 4.75 18.75V5.25A2.5 2.5 0 0 1 7.25 2.75Z",
          "M13.25 2.75V7.25A1.5 1.5 0 0 0 14.75 8.75H19.25",
          "M19.25 14.75H8.75",
          "M13.25 14.75V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.25 1H7A0.5 0.5 0 0 1 7.5 1.5V4.75A1.75 1.75 0 0 0 9.25 6.5H12.5A0.5 0.5 0 0 1 13 7V8.375A0.5 0.5 0 0 1 12.5 8.875H6.875A0.75 0.75 0 0 0 6.875 10.375H7.375A0.5 0.5 0 0 1 7.875 10.875V14.5A0.5 0.5 0 0 1 7.375 15H5.25A2.25 2.25 0 0 1 3 12.75V3.25A2.25 2.25 0 0 1 5.25 1Z",
            "M9.875 10.375H12.5A0.5 0.5 0 0 1 13 10.875V12.75A2.25 2.25 0 0 1 10.75 15H9.875A0.5 0.5 0 0 1 9.375 14.5V10.875A0.5 0.5 0 0 1 9.875 10.375Z",
            "M9 2.04V4.75A0.25 0.25 0 0 0 9.25 5H11.96A0.25 0.25 0 0 0 12.13 4.57L9.43 1.87A0.25 0.25 0 0 0 9 2.04Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6.75 2H9A0.5 0.5 0 0 1 9.5 2.5V6.5A2 2 0 0 0 11.5 8.5H15.5A0.5 0.5 0 0 1 16 9V11A0.5 0.5 0 0 1 15.5 11.5H8.25A0.75 0.75 0 0 0 8.25 13H9.75A0.5 0.5 0 0 1 10.25 13.5V17.5A0.5 0.5 0 0 1 9.75 18H6.75A2.75 2.75 0 0 1 4 15.25V4.75A2.75 2.75 0 0 1 6.75 2Z",
            "M12.25 13H15.5A0.5 0.5 0 0 1 16 13.5V15.25A2.75 2.75 0 0 1 13.25 18H12.25A0.5 0.5 0 0 1 11.75 17.5V13.5A0.5 0.5 0 0 1 12.25 13Z",
            "M11 3.04V6.5A0.5 0.5 0 0 0 11.5 7H14.96A0.25 0.25 0 0 0 15.13 6.57L11.43 2.87A0.25 0.25 0 0 0 11 3.04Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M7.25 2H12A0.5 0.5 0 0 1 12.5 2.5V7.25A2.25 2.25 0 0 0 14.75 9.5H19.5A0.5 0.5 0 0 1 20 10V13.5A0.5 0.5 0 0 1 19.5 14H8.75A0.75 0.75 0 0 0 8.75 15.5H12A0.5 0.5 0 0 1 12.5 16V21.5A0.5 0.5 0 0 1 12 22H7.25A3.25 3.25 0 0 1 4 18.75V5.25A3.25 3.25 0 0 1 7.25 2Z",
            "M14.5 15.5H19.5A0.5 0.5 0 0 1 20 16V18.75A3.25 3.25 0 0 1 16.75 22H14.5A0.5 0.5 0 0 1 14 21.5V16A0.5 0.5 0 0 1 14.5 15.5Z",
            "M14 3.04V7.25A0.75 0.75 0 0 0 14.75 8H18.96A0.25 0.25 0 0 0 19.13 7.57L14.43 2.87A0.25 0.25 0 0 0 14 3.04Z"
          ],
          "stroke": []
        }
      }
    },
    // F: the filled top layer's diagonal points (e.g. 3.44 8.18 and 11.69 3.07 at 24) are the outline's round joins taken 0.75 · 0.75 · 0.625 out from each vertex along the edge normals; the outline itself is on the grid.
    {
      "id": "F",
      "label": "Layer stack",
      "tags": [
        "layers",
        "stack",
        "architecture",
        "tiers",
        "system design"
      ],
      "note": "A flat diamond with two chevrons under it, each a repeat of the diamond's lower edges one pitch down. Pitch 4.5 · 3.5 · 3.125, so 2.6 · 1.7 · 1.58 of air between parallel edges. Diamond 16.5×7.5 · 12.5×5.5 · 10.75×5 on the centreline, edges at 24.4° · 23.7° · 24.9°. Ink 18×18 · 14×14 · 12×12.5 (the 16 sits 0.5 tall to keep 1.5 of air; lint takes it as the square keyline). Filled: the top layer solid, chevrons stay 1.5 · 1.5 · 1.25. Lucide `layers`, Material `layers`, Tabler `stack-2`, Phosphor `Stack` (from memory): the stack of tiers in an architecture diagram. Two catches: it says \"architecture layers\" more than \"plan\", and the sheet lists `layers` under Design Tools, which this drawing would pre-empt",
      "masters": {
        "16": [
          "M2.625 4.875L8 2.375L13.375 4.875L8 7.375Z",
          "M2.625 8L8 10.5L13.375 8",
          "M2.625 11.125L8 13.625L13.375 11.125"
        ],
        "20": [
          "M3.75 6.5L10 3.75L16.25 6.5L10 9.25Z",
          "M3.75 10L10 12.75L16.25 10",
          "M3.75 13.5L10 16.25L16.25 13.5"
        ],
        "24": [
          "M3.75 7.5L12 3.75L20.25 7.5L12 11.25Z",
          "M3.75 12L12 15.75L20.25 12",
          "M3.75 16.5L12 20.25L20.25 16.5"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2.361 5.442A0.625 0.625 0 0 1 2.361 4.308L7.736 1.808A0.625 0.625 0 0 1 8.264 1.808L13.639 4.308A0.625 0.625 0 0 1 13.639 5.442L8.264 7.942A0.625 0.625 0 0 1 7.736 7.942L2.361 5.442Z"
          ],
          "stroke": [
            "M2.625 8L8 10.5L13.375 8",
            "M2.625 11.125L8 13.625L13.375 11.125"
          ]
        },
        "20": {
          "fill": [
            "M3.45 7.19A0.75 0.75 0 0 1 3.45 5.81L9.7 3.06A0.75 0.75 0 0 1 10.3 3.06L16.55 5.81A0.75 0.75 0 0 1 16.55 7.19L10.3 9.94A0.75 0.75 0 0 1 9.7 9.94L3.45 7.19Z"
          ],
          "stroke": [
            "M3.75 10L10 12.75L16.25 10",
            "M3.75 13.5L10 16.25L16.25 13.5"
          ]
        },
        "24": {
          "fill": [
            "M3.44 8.18A0.75 0.75 0 0 1 3.44 6.82L11.69 3.07A0.75 0.75 0 0 1 12.31 3.07L20.56 6.82A0.75 0.75 0 0 1 20.56 8.18L12.31 11.93A0.75 0.75 0 0 1 11.69 11.93L3.44 8.18Z"
          ],
          "stroke": [
            "M3.75 12L12 15.75L20.25 12",
            "M3.75 16.5L12 20.25L20.25 16.5"
          ]
        }
      }
    },
    // G: clipboard and clipboard-filled are copied verbatim; the walls sit on the grid.
    {
      "id": "G",
      "label": "Clipboard with a plan",
      "tags": [
        "clipboard",
        "plan",
        "spec",
        "checklist",
        "architecture"
      ],
      "note": "The shipped `clipboard` unchanged, with C's plan mirrored on it: one wall in from the left edge that stops a door short of the right edge (2.5 · 2 · 2, as A–C), and one wall down to the foot. Wall at 14.25 · 11.75 · 9.875, clear of the clip by 5.25 · 3.25 · 2.625 of air; the foot wall at 10.75 · 9 · 6.875. Ink 16×20 · 12×16 · 10×14, clipboard's own. Filled: clipboard-filled with the walls as bands to the edge, the closed bottom-left room its own tile, 0.5 fillets; the clip stays a line. The clipboard-with-content pattern: Material `assignment`, Tabler `clipboard-*` (from memory). It is C on another container; at 16 the filled twin reads a little like a 9",
      "masters": {
        "16": [
          "M9.875 2.625H10.875A1.5 1.5 0 0 1 12.375 4.125V12.875A1.5 1.5 0 0 1 10.875 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V4.125A1.5 1.5 0 0 1 5.125 2.625H6.125",
          "M7.125 1.625H8.875A1 1 0 0 1 9.875 2.625V4.375A1 1 0 0 1 8.875 5.375H7.125A1 1 0 0 1 6.125 4.375V2.625A1 1 0 0 1 7.125 1.625Z",
          "M3.625 9.875H9.125",
          "M6.875 9.875V14.375"
        ],
        "20": [
          "M12.25 4.25H13.25A2 2 0 0 1 15.25 6.25V15.25A2 2 0 0 1 13.25 17.25H6.75A2 2 0 0 1 4.75 15.25V6.25A2 2 0 0 1 6.75 4.25H7.75",
          "M9 2.75H11A1.25 1.25 0 0 1 12.25 4V5A1.25 1.25 0 0 1 11 6.25H9A1.25 1.25 0 0 1 7.75 5V4A1.25 1.25 0 0 1 9 2.75Z",
          "M4.75 11.75H11.75",
          "M9 11.75V17.25"
        ],
        "24": [
          "M15.25 4.25H16.75A2.5 2.5 0 0 1 19.25 6.75V18.75A2.5 2.5 0 0 1 16.75 21.25H7.25A2.5 2.5 0 0 1 4.75 18.75V6.75A2.5 2.5 0 0 1 7.25 4.25H8.75",
          "M10.25 2.75H13.75A1.5 1.5 0 0 1 15.25 4.25V5.25A1.5 1.5 0 0 1 13.75 6.75H10.25A1.5 1.5 0 0 1 8.75 5.25V4.25A1.5 1.5 0 0 1 10.25 2.75Z",
          "M4.75 14.25H15.25",
          "M10.75 14.25V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.125 2H6.75V4.375A0.375 0.375 0 0 0 7.125 4.75H8.875A0.375 0.375 0 0 0 9.25 4.375V2H10.875A2.125 2.125 0 0 1 13 4.125V12.875A2.125 2.125 0 0 1 10.875 15H8.125A0.5 0.5 0 0 1 7.625 14.5V11.125A0.5 0.5 0 0 1 8.125 10.625H9.125A0.75 0.75 0 0 0 9.125 9.125H3.5A0.5 0.5 0 0 1 3 8.625V4.125A2.125 2.125 0 0 1 5.125 2Z",
            "M3.5 10.625H5.625A0.5 0.5 0 0 1 6.125 11.125V14.5A0.5 0.5 0 0 1 5.625 15H5.125A2.125 2.125 0 0 1 3 12.875V11.125A0.5 0.5 0 0 1 3.5 10.625Z"
          ],
          "stroke": [
            "M7.125 1.625H8.875A1 1 0 0 1 9.875 2.625V4.375A1 1 0 0 1 8.875 5.375H7.125A1 1 0 0 1 6.125 4.375V2.625A1 1 0 0 1 7.125 1.625Z"
          ]
        },
        "20": {
          "fill": [
            "M6.75 3.5H8.5V5A0.5 0.5 0 0 0 9 5.5H11A0.5 0.5 0 0 0 11.5 5V3.5H13.25A2.75 2.75 0 0 1 16 6.25V15.25A2.75 2.75 0 0 1 13.25 18H10.25A0.5 0.5 0 0 1 9.75 17.5V13A0.5 0.5 0 0 1 10.25 12.5H11.75A0.75 0.75 0 0 0 11.75 11H4.5A0.5 0.5 0 0 1 4 10.5V6.25A2.75 2.75 0 0 1 6.75 3.5Z",
            "M4.5 12.5H7.75A0.5 0.5 0 0 1 8.25 13V17.5A0.5 0.5 0 0 1 7.75 18H6.75A2.75 2.75 0 0 1 4 15.25V13A0.5 0.5 0 0 1 4.5 12.5Z"
          ],
          "stroke": [
            "M9 2.75H11A1.25 1.25 0 0 1 12.25 4V5A1.25 1.25 0 0 1 11 6.25H9A1.25 1.25 0 0 1 7.75 5V4A1.25 1.25 0 0 1 9 2.75Z"
          ]
        },
        "24": {
          "fill": [
            "M7.25 3.5H9.5V5.25A0.75 0.75 0 0 0 10.25 6H13.75A0.75 0.75 0 0 0 14.5 5.25V3.5H16.75A3.25 3.25 0 0 1 20 6.75V18.75A3.25 3.25 0 0 1 16.75 22H12A0.5 0.5 0 0 1 11.5 21.5V15.5A0.5 0.5 0 0 1 12 15H15.25A0.75 0.75 0 0 0 15.25 13.5H4.5A0.5 0.5 0 0 1 4 13V6.75A3.25 3.25 0 0 1 7.25 3.5Z",
            "M4.5 15H9.5A0.5 0.5 0 0 1 10 15.5V21.5A0.5 0.5 0 0 1 9.5 22H7.25A3.25 3.25 0 0 1 4 18.75V15.5A0.5 0.5 0 0 1 4.5 15Z"
          ],
          "stroke": [
            "M10.25 2.75H13.75A1.5 1.5 0 0 1 15.25 4.25V5.25A1.5 1.5 0 0 1 13.75 6.75H10.25A1.5 1.5 0 0 1 8.75 5.25V4.25A1.5 1.5 0 0 1 10.25 2.75Z"
          ]
        }
      }
    },
    // H: every value on the quarter grid at 24/20 and the eighth grid at 16.
    {
      "id": "H",
      "label": "Dimensioned part",
      "tags": [
        "dimensions",
        "technical drawing",
        "measure",
        "spec",
        "drawing"
      ],
      "note": "A part (rounded square, 11 · 8 · 6.75, corners 2.5 · 2 · 1.5) bottom-left. A dimension line runs along its top and another along its right side, each closed by end ticks 2 · 1.5 · 1.25 long (the architect's |—|). Part to tick air 2 · 1.5 · 1.5. Ink 18×18 · 14×14 · 12×12, box-centred. Filled: the part solid, dimension lines stay 1.5 · 1.5 · 1.25. Tabler `dimensions` draws the same with arrowheads (from memory); CAD apps use it for drawings. Catch: at 16 the right dimension reads as a letter I, so the icon reads \"OI\"",
      "masters": {
        "16": [
          "M4.125 6.625H7.875A1.5 1.5 0 0 1 9.375 8.125V11.875A1.5 1.5 0 0 1 7.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V8.125A1.5 1.5 0 0 1 4.125 6.625Z",
          "M2.625 3.25H9.375",
          "M2.625 2.625V3.875",
          "M9.375 2.625V3.875",
          "M12.75 6.625V13.375",
          "M12.125 6.625H13.375",
          "M12.125 13.375H13.375"
        ],
        "20": [
          "M5.75 8.25H9.75A2 2 0 0 1 11.75 10.25V14.25A2 2 0 0 1 9.75 16.25H5.75A2 2 0 0 1 3.75 14.25V10.25A2 2 0 0 1 5.75 8.25Z",
          "M3.75 4.5H11.75",
          "M3.75 3.75V5.25",
          "M11.75 3.75V5.25",
          "M15.5 8.25V16.25",
          "M14.75 8.25H16.25",
          "M14.75 16.25H16.25"
        ],
        "24": [
          "M6.25 9.25H12.25A2.5 2.5 0 0 1 14.75 11.75V17.75A2.5 2.5 0 0 1 12.25 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V11.75A2.5 2.5 0 0 1 6.25 9.25Z",
          "M3.75 4.75H14.75",
          "M3.75 3.75V5.75",
          "M14.75 3.75V5.75",
          "M19.25 9.25V20.25",
          "M18.25 9.25H20.25",
          "M18.25 20.25H20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.125 6H7.875A2.125 2.125 0 0 1 10 8.125V11.875A2.125 2.125 0 0 1 7.875 14H4.125A2.125 2.125 0 0 1 2 11.875V8.125A2.125 2.125 0 0 1 4.125 6Z"
          ],
          "stroke": [
            "M2.625 3.25H9.375",
            "M2.625 2.625V3.875",
            "M9.375 2.625V3.875",
            "M12.75 6.625V13.375",
            "M12.125 6.625H13.375",
            "M12.125 13.375H13.375"
          ]
        },
        "20": {
          "fill": [
            "M5.75 7.5H9.75A2.75 2.75 0 0 1 12.5 10.25V14.25A2.75 2.75 0 0 1 9.75 17H5.75A2.75 2.75 0 0 1 3 14.25V10.25A2.75 2.75 0 0 1 5.75 7.5Z"
          ],
          "stroke": [
            "M3.75 4.5H11.75",
            "M3.75 3.75V5.25",
            "M11.75 3.75V5.25",
            "M15.5 8.25V16.25",
            "M14.75 8.25H16.25",
            "M14.75 16.25H16.25"
          ]
        },
        "24": {
          "fill": [
            "M6.25 8.5H12.25A3.25 3.25 0 0 1 15.5 11.75V17.75A3.25 3.25 0 0 1 12.25 21H6.25A3.25 3.25 0 0 1 3 17.75V11.75A3.25 3.25 0 0 1 6.25 8.5Z"
          ],
          "stroke": [
            "M3.75 4.75H14.75",
            "M3.75 3.75V5.75",
            "M14.75 3.75V5.75",
            "M19.25 9.25V20.25",
            "M18.25 9.25H20.25",
            "M18.25 20.25H20.25"
          ]
        }
      }
    },
    // I: the outline sits on the grid; the filled diamonds' points are the round joins taken out 0.75 · 0.75 · 0.625 along the edge normals.
    {
      "id": "I",
      "label": "Component",
      "tags": [
        "component",
        "template",
        "master",
        "reusable",
        "design system"
      ],
      "note": "Four diamonds round a centre on the diagonal keyline (20 · 16 · 14). Diamonds 7 · 5 · 4.25 across on the centreline; air between neighbours 1.68 · 1.68 · 1.75; white inside each 3.45 · 2.04 · 1.75 across. Ink 20×20 · 16×16 · 14×14, box-centred. Filled: four solid diamonds. Figma's component mark and Lucide `component` (from memory): the reusable master a design is built from. Catch: it says \"template / component\" more than \"plan\"",
      "masters": {
        "16": [
          "M1.625 8L3.75 5.875L5.875 8L3.75 10.125L1.625 8Z",
          "M5.875 3.75L8 1.625L10.125 3.75L8 5.875L5.875 3.75Z",
          "M10.125 8L12.25 5.875L14.375 8L12.25 10.125L10.125 8Z",
          "M5.875 12.25L8 10.125L10.125 12.25L8 14.375L5.875 12.25Z"
        ],
        "20": [
          "M2.75 10L5.25 7.5L7.75 10L5.25 12.5L2.75 10Z",
          "M7.5 5.25L10 2.75L12.5 5.25L10 7.75L7.5 5.25Z",
          "M12.25 10L14.75 7.5L17.25 10L14.75 12.5L12.25 10Z",
          "M7.5 14.75L10 12.25L12.5 14.75L10 17.25L7.5 14.75Z"
        ],
        "24": [
          "M2.75 12L6.25 8.5L9.75 12L6.25 15.5L2.75 12Z",
          "M8.5 6.25L12 2.75L15.5 6.25L12 9.75L8.5 6.25Z",
          "M14.25 12L17.75 8.5L21.25 12L17.75 15.5L14.25 12Z",
          "M8.5 17.75L12 14.25L15.5 17.75L12 21.25L8.5 17.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1.183 8.442A0.625 0.625 0 0 1 1.183 7.558L3.308 5.433A0.625 0.625 0 0 1 4.192 5.433L6.317 7.558A0.625 0.625 0 0 1 6.317 8.442L4.192 10.567A0.625 0.625 0 0 1 3.308 10.567L1.183 8.442Z",
            "M5.433 4.192A0.625 0.625 0 0 1 5.433 3.308L7.558 1.183A0.625 0.625 0 0 1 8.442 1.183L10.567 3.308A0.625 0.625 0 0 1 10.567 4.192L8.442 6.317A0.625 0.625 0 0 1 7.558 6.317L5.433 4.192Z",
            "M9.683 8.442A0.625 0.625 0 0 1 9.683 7.558L11.808 5.433A0.625 0.625 0 0 1 12.692 5.433L14.817 7.558A0.625 0.625 0 0 1 14.817 8.442L12.692 10.567A0.625 0.625 0 0 1 11.808 10.567L9.683 8.442Z",
            "M5.433 12.692A0.625 0.625 0 0 1 5.433 11.808L7.558 9.683A0.625 0.625 0 0 1 8.442 9.683L10.567 11.808A0.625 0.625 0 0 1 10.567 12.692L8.442 14.817A0.625 0.625 0 0 1 7.558 14.817L5.433 12.692Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2.22 10.53A0.75 0.75 0 0 1 2.22 9.47L4.72 6.97A0.75 0.75 0 0 1 5.78 6.97L8.28 9.47A0.75 0.75 0 0 1 8.28 10.53L5.78 13.03A0.75 0.75 0 0 1 4.72 13.03L2.22 10.53Z",
            "M6.97 5.78A0.75 0.75 0 0 1 6.97 4.72L9.47 2.22A0.75 0.75 0 0 1 10.53 2.22L13.03 4.72A0.75 0.75 0 0 1 13.03 5.78L10.53 8.28A0.75 0.75 0 0 1 9.47 8.28L6.97 5.78Z",
            "M11.72 10.53A0.75 0.75 0 0 1 11.72 9.47L14.22 6.97A0.75 0.75 0 0 1 15.28 6.97L17.78 9.47A0.75 0.75 0 0 1 17.78 10.53L15.28 13.03A0.75 0.75 0 0 1 14.22 13.03L11.72 10.53Z",
            "M6.97 15.28A0.75 0.75 0 0 1 6.97 14.22L9.47 11.72A0.75 0.75 0 0 1 10.53 11.72L13.03 14.22A0.75 0.75 0 0 1 13.03 15.28L10.53 17.78A0.75 0.75 0 0 1 9.47 17.78L6.97 15.28Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2.22 12.53A0.75 0.75 0 0 1 2.22 11.47L5.72 7.97A0.75 0.75 0 0 1 6.78 7.97L10.28 11.47A0.75 0.75 0 0 1 10.28 12.53L6.78 16.03A0.75 0.75 0 0 1 5.72 16.03L2.22 12.53Z",
            "M7.97 6.78A0.75 0.75 0 0 1 7.97 5.72L11.47 2.22A0.75 0.75 0 0 1 12.53 2.22L16.03 5.72A0.75 0.75 0 0 1 16.03 6.78L12.53 10.28A0.75 0.75 0 0 1 11.47 10.28L7.97 6.78Z",
            "M13.72 12.53A0.75 0.75 0 0 1 13.72 11.47L17.22 7.97A0.75 0.75 0 0 1 18.28 7.97L21.78 11.47A0.75 0.75 0 0 1 21.78 12.53L18.28 16.03A0.75 0.75 0 0 1 17.22 16.03L13.72 12.53Z",
            "M7.97 18.28A0.75 0.75 0 0 1 7.97 17.22L11.47 13.72A0.75 0.75 0 0 1 12.53 13.72L16.03 17.22A0.75 0.75 0 0 1 16.03 18.28L12.53 21.78A0.75 0.75 0 0 1 11.47 21.78L7.97 18.28Z"
          ],
          "stroke": []
        }
      }
    },
    // J: 10.94 3.19 / 13.06 3.19 (24), 9.12 3.12 / 10.88 3.12 (20), 7.293 1.918 / 8.707 1.918 (16) are the apex arc's tangent points, as in the shipped home; the eaves at 9.38 · 7.48 · 5.586 sit 45 degrees down from a virtual apex placed so the rounded apex's ink starts on the box top.
    {
      "id": "J",
      "label": "House elevation",
      "tags": [
        "house",
        "elevation",
        "architecture",
        "plan",
        "dimensions"
      ],
      "note": "A house front (home's 45° roof and apex radius, 1.5 · 1.25 · 1; base corners 2.5 · 2 · 1.5), 14.5 · 10.5 · 8.75 wide. Under it is one dimension line the house's width, with end ticks 2 · 1.5 · 1.5 long, 1.5 of air below the house. Ink 16×20 · 12×16 · 10×14 on the portrait keyline (19.999 and 15.992 tall at 24 and 20, from rounding the apex to 2 dp). Filled: the house solid, the dimension line stays a line. The stock architecture \"house plan\" picture (Streamline, Icons8; from memory). Catch, seen in real pixels: at 16 a pentagon over a bar reads as eject (⏏), outline and filled. A door would turn it into `home`. Shown so Maruti can see it; not a contender",
      "masters": {
        "16": [
          "M7.293 1.918A1 1 0 0 1 8.707 1.918L12.375 5.586L12.375 8.625A1.5 1.5 0 0 1 10.875 10.125L5.125 10.125A1.5 1.5 0 0 1 3.625 8.625L3.625 5.586L7.293 1.918Z",
          "M3.625 13.625H12.375",
          "M3.625 12.875V14.375",
          "M12.375 12.875V14.375"
        ],
        "20": [
          "M9.12 3.12A1.25 1.25 0 0 1 10.88 3.12L15.25 7.48L15.25 10.75A2 2 0 0 1 13.25 12.75L6.75 12.75A2 2 0 0 1 4.75 10.75L4.75 7.48L9.12 3.12Z",
          "M4.75 16.5H15.25",
          "M4.75 15.75V17.25",
          "M15.25 15.75V17.25"
        ],
        "24": [
          "M10.94 3.19A1.5 1.5 0 0 1 13.06 3.19L19.25 9.38L19.25 13.75A2.5 2.5 0 0 1 16.75 16.25L7.25 16.25A2.5 2.5 0 0 1 4.75 13.75L4.75 9.38L10.94 3.19Z",
          "M4.75 20.25H19.25",
          "M4.75 19.25V21.25",
          "M19.25 19.25V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.851 1.476A1.625 1.625 0 0 1 9.149 1.476L12.817 5.144A0.625 0.625 0 0 1 13 5.586L13 8.625A2.125 2.125 0 0 1 10.875 10.75L5.125 10.75A2.125 2.125 0 0 1 3 8.625L3 5.586A0.625 0.625 0 0 1 3.183 5.144L6.851 1.476Z"
          ],
          "stroke": [
            "M3.625 13.625H12.375",
            "M3.625 12.875V14.375",
            "M12.375 12.875V14.375"
          ]
        },
        "20": {
          "fill": [
            "M8.59 2.59A2 2 0 0 1 11.41 2.59L15.78 6.95A0.75 0.75 0 0 1 16 7.48L16 10.75A2.75 2.75 0 0 1 13.25 13.5L6.75 13.5A2.75 2.75 0 0 1 4 10.75L4 7.48A0.75 0.75 0 0 1 4.22 6.95L8.59 2.59Z"
          ],
          "stroke": [
            "M4.75 16.5H15.25",
            "M4.75 15.75V17.25",
            "M15.25 15.75V17.25"
          ]
        },
        "24": {
          "fill": [
            "M10.41 2.66A2.25 2.25 0 0 1 13.59 2.66L19.78 8.85A0.75 0.75 0 0 1 20 9.38L20 13.75A3.25 3.25 0 0 1 16.75 17L7.25 17A3.25 3.25 0 0 1 4 13.75L4 9.38A0.75 0.75 0 0 1 4.22 8.85L10.41 2.66Z"
          ],
          "stroke": [
            "M4.75 20.25H19.25",
            "M4.75 19.25V21.25",
            "M19.25 19.25V21.25"
          ]
        }
      }
    }
  ],
};
