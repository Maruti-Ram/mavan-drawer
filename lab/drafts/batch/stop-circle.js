// stop-circle: the first ringed transport glyph. Its square sets the size and corner that stop, play-circle and pause-circle will follow, so the choice reaches three icons not yet drawn.
export default {
  "concept": "stop-circle",
  "family": [
    "plus-circle",
    "minus-circle",
    "x-circle",
    "check-circle"
  ],
  "question": "Stop is a fixed glyph — a square in a ring, the ring in the name (C9) — so these five are the square sizes and corners established sets use. Which square goes in the ring (and later, unringed, becomes stop)?",
  "candidates": [
    {
      "id": "A",
      "label": "Rounded square",
      "tags": [
        "media",
        "end",
        "halt",
        "square"
      ],
      "note": "Rhythm: square 8 · 6 · 5 — 0.76 · 0.75 · 0.77 of plus-circle's plus (10.5 · 8 · 6.5) at every master, so it shrinks from 24 to 16 exactly as the family's marks do (0.40 · 0.38 · 0.36 of the ring). Ring-to-square air 4.5 · 3.5 · 3.25 on the axes, 3.78 · 3.09 · 2.89 at the corners; inside white 5 · 3 · 2.5. Corners are play's own, 1.5 · 1.25 · 1 on the line (2.25 · 2 · 1.625 outer): the set keeps a mark's radius when the mark goes into a ring (check-circle keeps check's bend), so a plain stop drawn at play's width with these corners, and play-circle's triangle in this same ring, are one family. Weight in the family (rasterised ink against plus-circle at 24 · 20 · 16): outline 1.06 · 1.03 · 1.04, filled 0.92 · 0.95 · 0.97 — the shipped circles span 0.89–1.04 outline and 0.98–1.07 filled. Ring: plus-circle's, ⌀20 · 16 · 14 outer (r 9.25 · 7.25 · 6.375 on the line). Filled: the disc (⌀20 · 16 · 14) with the square cut out on the outline square's outer edge — white square, same box, as Fluent, Central, Material and Untitled fill theirs. Who: Lucide circle-stop (square 8 of a 22 ring at stroke 2, rx 1 — measured), Polaris StopCircle (5.5 of 14 — measured), Fluent Record Stop (solid 6 of 16 at 20 — measured), Feather and Phosphor (public). Crispness: at 24 and 20 every square edge sits on a whole pixel (8–16, 7–13); at 16 the 5 square sits on half pixels (5.5–10.5) — the cost of keeping the family's 24→16 drift; a 6 square would be crisp but 0.43 of the ring. (recommended): the size the references agree on, reduced with the set's own marks, and play's corners, so stop, play and pause can share one corner",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M7.125 6.125H8.875A1 1 0 0 1 9.875 7.125V8.875A1 1 0 0 1 8.875 9.875H7.125A1 1 0 0 1 6.125 8.875V7.125A1 1 0 0 1 7.125 6.125Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M9 7.75H11A1.25 1.25 0 0 1 12.25 9V11A1.25 1.25 0 0 1 11 12.25H9A1.25 1.25 0 0 1 7.75 11V9A1.25 1.25 0 0 1 9 7.75Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M10.25 8.75H13.75A1.5 1.5 0 0 1 15.25 10.25V13.75A1.5 1.5 0 0 1 13.75 15.25H10.25A1.5 1.5 0 0 1 8.75 13.75V10.25A1.5 1.5 0 0 1 10.25 8.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7.125 5.5H8.875A1.625 1.625 0 0 1 10.5 7.125V8.875A1.625 1.625 0 0 1 8.875 10.5H7.125A1.625 1.625 0 0 1 5.5 8.875V7.125A1.625 1.625 0 0 1 7.125 5.5Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9 7H11A2 2 0 0 1 13 9V11A2 2 0 0 1 11 13H9A2 2 0 0 1 7 11V9A2 2 0 0 1 9 7Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.25 8H13.75A2.25 2.25 0 0 1 16 10.25V13.75A2.25 2.25 0 0 1 13.75 16H10.25A2.25 2.25 0 0 1 8 13.75V10.25A2.25 2.25 0 0 1 10.25 8Z"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Large square",
      "tags": [
        "media",
        "end",
        "halt",
        "square",
        "large"
      ],
      "note": "Rhythm: square 9 · 7 · 6 — a steady 0.45 · 0.44 · 0.43 of the ring, no drift from 24 to 16 (0.86 · 0.88 · 0.92 of plus-circle's plus). Ring-to-square air 4 · 3 · 2.75 on the axes, 3.07 · 2.38 · 2.18 at the corners; inside white 6 · 4 · 3.5. Corners play's, 1.5 · 1.25 · 1 on the line. Weight in the family (rasterised ink against plus-circle at 24 · 20 · 16): outline 1.11 · 1.10 · 1.12, filled 0.86 · 0.88 · 0.89 — the shipped circles span 0.89–1.04 outline and 0.98–1.07 filled. Ring: plus-circle's, ⌀20 · 16 · 14 outer (r 9.25 · 7.25 · 6.375 on the line). Filled: the disc (⌀20 · 16 · 14) with the square cut out on the outline square's outer edge — white square, same box, as Fluent, Central, Material and Untitled fill theirs. Who: Untitled UI stop-circle (square 10 of a 22 ring at stroke 2, 0.45 — measured). The square reads as the subject and the ring as its frame; at 16 the corner air (2.18) is the tightest of the standard sizes. Crispness: 24 and 20 edges on half pixels (7.5–16.5, 6.5–13.5); 16 on whole pixels (5–11)",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.625 5.625H9.375A1 1 0 0 1 10.375 6.625V9.375A1 1 0 0 1 9.375 10.375H6.625A1 1 0 0 1 5.625 9.375V6.625A1 1 0 0 1 6.625 5.625Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8.5 7.25H11.5A1.25 1.25 0 0 1 12.75 8.5V11.5A1.25 1.25 0 0 1 11.5 12.75H8.5A1.25 1.25 0 0 1 7.25 11.5V8.5A1.25 1.25 0 0 1 8.5 7.25Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.75 8.25H14.25A1.5 1.5 0 0 1 15.75 9.75V14.25A1.5 1.5 0 0 1 14.25 15.75H9.75A1.5 1.5 0 0 1 8.25 14.25V9.75A1.5 1.5 0 0 1 9.75 8.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM6.625 5H9.375A1.625 1.625 0 0 1 11 6.625V9.375A1.625 1.625 0 0 1 9.375 11H6.625A1.625 1.625 0 0 1 5 9.375V6.625A1.625 1.625 0 0 1 6.625 5Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM8.5 6.5H11.5A2 2 0 0 1 13.5 8.5V11.5A2 2 0 0 1 11.5 13.5H8.5A2 2 0 0 1 6.5 11.5V8.5A2 2 0 0 1 8.5 6.5Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM9.75 7.5H14.25A2.25 2.25 0 0 1 16.5 9.75V14.25A2.25 2.25 0 0 1 14.25 16.5H9.75A2.25 2.25 0 0 1 7.5 14.25V9.75A2.25 2.25 0 0 1 9.75 7.5Z"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Small square",
      "tags": [
        "media",
        "end",
        "halt",
        "square",
        "small"
      ],
      "note": "Rhythm: square 5 · 4.5 · 4 — 0.25 · 0.28 · 0.29 of the ring, the size Central gives its solid square (5 of 20 — measured). Ring-to-square air 6 · 4.25 · 3.75 on the axes, 5.59 · 3.94 · 3.44 at the corners — the most air of the five. Inside white 2 · 1.5 · 1.5, the minimum at 20 and 16 (lint's inside-air floor), so the outline square reads nearly solid, the way Central, Fluent Regular and Material draw a solid square inside an outline ring (outline files here draw lines only, so the square itself cannot be solid). It cannot get smaller at 16 without closing up, which is why its share of the ring rises from 0.25 to 0.29. Corners tight, play-3's 0.75 · 0.75 · 0.625 on the line (1.5 · 1.5 · 1.25 outer) — play's 1.5 would round a 5 square into a blob. Weight in the family (rasterised ink against plus-circle at 24 · 20 · 16): outline 0.92 · 0.95 · 0.97, filled 1.06 · 1.03 · 1.03 — the shipped circles span 0.89–1.04 outline and 0.98–1.07 filled. Ring: plus-circle's, ⌀20 · 16 · 14 outer (r 9.25 · 7.25 · 6.375 on the line). Filled: the disc (⌀20 · 16 · 14) with the square cut out on the outline square's outer edge — white square, same box, as Fluent, Central, Material and Untitled fill theirs. The small white square in the filled twin reads as a button at a glance but sits close to a record or target. Crispness: 24 edges on half pixels (9.5–14.5); 20 on quarters; 16 on whole pixels (6–10)",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M7.25 6.625H8.75A0.625 0.625 0 0 1 9.375 7.25V8.75A0.625 0.625 0 0 1 8.75 9.375H7.25A0.625 0.625 0 0 1 6.625 8.75V7.25A0.625 0.625 0 0 1 7.25 6.625Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M9.25 8.5H10.75A0.75 0.75 0 0 1 11.5 9.25V10.75A0.75 0.75 0 0 1 10.75 11.5H9.25A0.75 0.75 0 0 1 8.5 10.75V9.25A0.75 0.75 0 0 1 9.25 8.5Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M11 10.25H13A0.75 0.75 0 0 1 13.75 11V13A0.75 0.75 0 0 1 13 13.75H11A0.75 0.75 0 0 1 10.25 13V11A0.75 0.75 0 0 1 11 10.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7.25 6H8.75A1.25 1.25 0 0 1 10 7.25V8.75A1.25 1.25 0 0 1 8.75 10H7.25A1.25 1.25 0 0 1 6 8.75V7.25A1.25 1.25 0 0 1 7.25 6Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9.25 7.75H10.75A1.5 1.5 0 0 1 12.25 9.25V10.75A1.5 1.5 0 0 1 10.75 12.25H9.25A1.5 1.5 0 0 1 7.75 10.75V9.25A1.5 1.5 0 0 1 9.25 7.75Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM11 9.5H13A1.5 1.5 0 0 1 14.5 11V13A1.5 1.5 0 0 1 13 14.5H11A1.5 1.5 0 0 1 9.5 13V11A1.5 1.5 0 0 1 11 9.5Z"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Ring kept, solid square",
      "tags": [
        "media",
        "end",
        "halt",
        "square",
        "solid"
      ],
      "note": "Rhythm: A's square, 8 · 6 · 5 (0.76 of plus-circle's plus at every master; ring-to-square air 4.5 · 3.5 · 3.25 on the axes, 3.78 · 3.09 · 2.89 at the corners), but the filled twin keeps the ring as a line (1.5 · 1.5 · 1.25) and fills the square solid instead of filling the disc. This is the treatment most sets draw: Fluent Record Stop Regular (solid 6 in a 16 ring at 20 — measured), Central stop-circle (solid 5 in 20 — measured), Material stop_circle and SF Symbols stop.circle (public). The outline is A's line for line, so D only asks a filled question: disc with a white square (A, the circle family's way), or ring with a solid square. At 16 the filled twin is a ring with a solid 5 square and 3.25 of white between — a different picture from every disc-filled candidate. It breaks the circle family's filled treatment (plus-, minus-, x-, check-circle all fill the disc), so choosing it is a rule question for the ring family, not one icon. Replaces the crisp-corner square, which drew pixel-identical to A at 16. Weight in the family (rasterised ink against plus-circle at 24 · 20 · 16): outline 1.06 · 1.03 · 1.04, filled 0.53 · 0.57 · 0.54 (about half: a ring and a solid square carry far less ink than a disc) — the shipped circles span 0.89–1.04 outline and 0.98–1.07 filled.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M7.125 6.125H8.875A1 1 0 0 1 9.875 7.125V8.875A1 1 0 0 1 8.875 9.875H7.125A1 1 0 0 1 6.125 8.875V7.125A1 1 0 0 1 7.125 6.125Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M9 7.75H11A1.25 1.25 0 0 1 12.25 9V11A1.25 1.25 0 0 1 11 12.25H9A1.25 1.25 0 0 1 7.75 11V9A1.25 1.25 0 0 1 9 7.75Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M10.25 8.75H13.75A1.5 1.5 0 0 1 15.25 10.25V13.75A1.5 1.5 0 0 1 13.75 15.25H10.25A1.5 1.5 0 0 1 8.75 13.75V10.25A1.5 1.5 0 0 1 10.25 8.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.125 5.5H8.875A1.625 1.625 0 0 1 10.5 7.125V8.875A1.625 1.625 0 0 1 8.875 10.5H7.125A1.625 1.625 0 0 1 5.5 8.875V7.125A1.625 1.625 0 0 1 7.125 5.5Z"
          ],
          "stroke": [
            "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z"
          ]
        },
        "20": {
          "fill": [
            "M9 7H11A2 2 0 0 1 13 9V11A2 2 0 0 1 11 13H9A2 2 0 0 1 7 11V9A2 2 0 0 1 9 7Z"
          ],
          "stroke": [
            "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z"
          ]
        },
        "24": {
          "fill": [
            "M10.25 8H13.75A2.25 2.25 0 0 1 16 10.25V13.75A2.25 2.25 0 0 1 13.75 16H10.25A2.25 2.25 0 0 1 8 13.75V10.25A2.25 2.25 0 0 1 10.25 8Z"
          ],
          "stroke": [
            "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Square at the plus's width",
      "tags": [
        "media",
        "end",
        "halt",
        "square",
        "wide"
      ],
      "note": "Rhythm: square 10.5 · 8 · 6.5 — exactly plus-circle's plus (C18's reading: the inner mark as wide as the family's marks), 0.53 · 0.50 · 0.46 of the ring. Ring-to-square air 3.25 · 2.5 · 2.5 on the axes and only 2.01 · 1.67 · 1.83 at the corners — the corners come within a stroke of the ring at 20. Inside white 7.5 · 5 · 4. Corners play's, 1.5 · 1.25 · 1 on the line. Weight in the family (rasterised ink against plus-circle at 24 · 20 · 16): outline 1.19 · 1.17 · 1.16, filled 0.75 · 0.79 · 0.84 — the shipped circles span 0.89–1.04 outline and 0.98–1.07 filled. Ring: plus-circle's, ⌀20 · 16 · 14 outer (r 9.25 · 7.25 · 6.375 on the line). Filled: the disc (⌀20 · 16 · 14) with the square cut out on the outline square's outer edge — white square, same box, as Fluent, Central, Material and Untitled fill theirs. Who: no reference goes this big — the nearest is Untitled UI at 0.45 (B); this is the set's own rule taken literally, and it shows why a square, which is all mass, needs to sit smaller than a plus of the same width. Crispness: edges on quarters at 24 and 16, whole pixels at 20 (6–14)",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.375 5.375H9.625A1 1 0 0 1 10.625 6.375V9.625A1 1 0 0 1 9.625 10.625H6.375A1 1 0 0 1 5.375 9.625V6.375A1 1 0 0 1 6.375 5.375Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8 6.75H12A1.25 1.25 0 0 1 13.25 8V12A1.25 1.25 0 0 1 12 13.25H8A1.25 1.25 0 0 1 6.75 12V8A1.25 1.25 0 0 1 8 6.75Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9 7.5H15A1.5 1.5 0 0 1 16.5 9V15A1.5 1.5 0 0 1 15 16.5H9A1.5 1.5 0 0 1 7.5 15V9A1.5 1.5 0 0 1 9 7.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM6.375 4.75H9.625A1.625 1.625 0 0 1 11.25 6.375V9.625A1.625 1.625 0 0 1 9.625 11.25H6.375A1.625 1.625 0 0 1 4.75 9.625V6.375A1.625 1.625 0 0 1 6.375 4.75Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM8 6H12A2 2 0 0 1 14 8V12A2 2 0 0 1 12 14H8A2 2 0 0 1 6 12V8A2 2 0 0 1 8 6Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM9 6.75H15A2.25 2.25 0 0 1 17.25 9V15A2.25 2.25 0 0 1 15 17.25H9A2.25 2.25 0 0 1 6.75 15V9A2.25 2.25 0 0 1 9 6.75Z"
          ]
        }
      }
    }
  ]
};
