// signal: Maruti picked the wedge (B → signal, hollow outline, solid filled) and the status-bar bars (E → signal-2, approved with its levels). The wedge's levels grow a solid inner wedge from the bottom-left: outline drawn with the pen as battery's charge bar is; filled as Material and the wifi fan's approved levels do.
export default {
  "concept": "signal",
  "question": "Do the wedge's filled levels (level solid and merged with the frame, the rest open) read as one family with the outline levels at 16?",
  "set": {
    "B": "signal",
    "B3": "signal-high",
    "B2": "signal-medium",
    "B1": "signal-low",
    "E": "signal-2",
    "E3": "signal-2-high",
    "E2": "signal-2-medium",
    "E1": "signal-2-low",
    "E0": "signal-2-none"
  },
  "candidates": [
    {
      "id": "B",
      "label": "Rising wedge",
      "tags": [
        "wedge",
        "triangle",
        "cellular",
        "android",
        "strength"
      ],
      "note": "Ships as signal. Rhythm: one shape, so balance is the question. A right-angled wedge fills the square keyline: ink 18×18 · 14×14 · 12×12, box-centred, rising from bottom-left to the top-right corner at 45°. Corners: both 45° tips bend r 1 · 0.75 · 0.625 on the centreline (outer 1.75 · 1.5 · 1.25); the right angle bends r 1.75 · 1.25 · 1 (outer 2.5 · 2 · 1.625, the container radius at 24). Inside white holds a circle of ⌀ 9 · 6.4 · 5.6 (floor 1.5). The tangent points on the 45° side are irrational, so they round to 2 · 2 · 3 places (lint lists them as off-grid values); the ink box lands within 0.006 of 18 at 24. Filled: the wedge fills solid with the same outer edge, the same corner centres and radii grown by half the weight; ink box identical. Caveat: in Material's outlined style a hollow wedge (signal_cellular_0_bar) means NO signal and only the solid one means full, so our outline twin reads as 'empty' to Android users. The filled wedge is among the heaviest filled shapes in the set (a half square at 18). Who: Material Symbols signal_cellular_4_bar (solid wedge) and network_cell, the Android status bar. Caveat: a hollow full wedge reads as 'none'. Material's outlined signal_cellular_0_bar is exactly this frame and means no signal. Maruti kept the hollow full wedge (2026-10-23), as for the wifi fan, so signal-none is left out: it would be this drawing.",
      "masters": {
        "16": [
          "M3.25 13.375L12.375 13.375A1 1 0 0 0 13.375 12.375L13.375 3.25A0.625 0.625 0 0 0 12.308 2.808L2.808 12.308A0.625 0.625 0 0 0 3.25 13.375Z"
        ],
        "20": [
          "M4.5 16.25L15 16.25A1.25 1.25 0 0 0 16.25 15L16.25 4.5A0.75 0.75 0 0 0 14.97 3.97L3.97 14.97A0.75 0.75 0 0 0 4.5 16.25Z"
        ],
        "24": [
          "M4.75 20.25L18.5 20.25A1.75 1.75 0 0 0 20.25 18.5L20.25 4.75A1 1 0 0 0 18.54 4.04L4.04 18.54A1 1 0 0 0 4.75 20.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14L12.375 14A1.625 1.625 0 0 0 14 12.375L14 3.25A1.25 1.25 0 0 0 11.866 2.366L2.366 11.866A1.25 1.25 0 0 0 3.25 14Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17L15 17A2 2 0 0 0 17 15L17 4.5A1.5 1.5 0 0 0 14.44 3.44L3.44 14.44A1.5 1.5 0 0 0 4.5 17Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.75 21L18.5 21A2.5 2.5 0 0 0 21 18.5L21 4.75A1.75 1.75 0 0 0 18.01 3.51L3.51 18.01A1.75 1.75 0 0 0 4.75 21Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Status-bar proportion",
      "tags": [
        "bars",
        "cellular",
        "reception",
        "strength",
        "status bar"
      ],
      "box": {
        "16": [
          11.75,
          9
        ],
        "20": [
          13.5,
          10
        ],
        "24": [
          18,
          13.5
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
      },
      "note": "Ships as signal-2, the full member of its level family (C28). Rhythm: four bars on one pitch (5.5 · 4 · 3.5, air 4 · 2.5 · 2.25, filled 3 · 2 · 1.5), but shorter, as a phone's status-bar glyph draws them. The box is wider than tall, about 4 : 3 at every master (18×13.5 · 13.5×10 · 11.75×9), and the shortest bar starts at a third of the tallest, not a quarter. Equal steps of 3 · 2.25 · 2: heights 4.5/7.5/10.5/13.5 · 3.25/5.5/7.75/10 · 3/5/7/9, one baseline, box-centred (baseline ink 18.75 · 15 · 12.5). Filled: C17 like A, grows 0.5 · 0.25 · 0.375 left and right. It reads lighter and smaller than the set at 24, about the weight of an inline glyph. Who: Bootstrap reception-4 (four bars in a 15×12 box), the phone status bar.",
      "masters": {
        "16": [
          "M2.75 10.125V11.875",
          "M6.25 8.125V11.875",
          "M9.75 6.125V11.875",
          "M13.25 4.125V11.875"
        ],
        "20": [
          "M4 12.5V14.25",
          "M8 10.25V14.25",
          "M12 8V14.25",
          "M16 5.75V14.25"
        ],
        "24": [
          "M3.75 15V18",
          "M9.25 12V18",
          "M14.75 9V18",
          "M20.25 6V18"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 10.5V11.5",
            "M6.25 8.5V11.5",
            "M9.75 6.5V11.5",
            "M13.25 4.5V11.5"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 12.75V14",
            "M8 10.5V14",
            "M12 8.25V14",
            "M16 6V14"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 15.5V17.5",
            "M9.25 12.5V17.5",
            "M14.75 9.5V17.5",
            "M20.25 6.5V17.5"
          ]
        }
      }
    },
    {
      "id": "B3",
      "label": "Wedge, three quarters",
      "tags": [
        "wedge",
        "cellular",
        "strength",
        "level",
        "high"
      ],
      "note": "Ships as signal-high. Level legs 8.98 · 5.13 · 3.75. Steps: equal in amount, not in length. Each level holds about a quarter more of the full level's ink: areas 0.26/0.50/0.77 · 0.24/0.49/0.76 · 0.26/0.51/0.73 at 24 · 20 · 16. Equal-length quarters (2.56 · 1.47 · 1.09) fall below the smallest wedge the pen can draw at 20 and 16 (legs 2.56 · 2.56 · 2.13). So do thirds (1.46 at 16). Legs of the level, low/medium/high/full: 5.23/7.23/8.98/10.23 · 2.88/4.13/5.13/5.88 · 2.25/3.13/3.75/4.38 (the room inside the frame after 1.5 of white has legs 10.23 · 5.88 · 4.38). Its right edge sits on x 13/15/16.75/18 · 11/12.25/13.25/14 · 9.125/10/10.625/11.25. Outline: the frame is B's, unchanged; the level is a solid right-angled wedge drawn with the pen as battery's charge bar is. It is one closed path, the level's outline plus runs one line apart (1.5 · 1.5 · 1.25), so no white is left inside, and its corners bend at weight/2. 1.5 of white separates it from the frame's bottom and its slope; the full level also leaves 1.5 to the right side. Filled: as Material and the wifi fan's approved levels. The frame stays at the outline weight; the level is solid and merged with it, with no white band, filling the frame to the level's right edge (x 13/15/16.75 · 11/12.25/13.25 · 9.125/10/10.625). The rest of the frame's inside is left open, its corners at the level's edge r0.5 · 0.5 · 0.375. Open part at its narrowest (high): 2.75 · 2.25 · 2.125 wide. anchor: signal — the frame is signal's own, so the ink box is signal's at every master (C28). Who: Material Symbols signal_cellular_1_bar…3_bar (frame kept, solid level merged with it from the bottom-left).",
      "anchor": "signal",
      "masters": {
        "16": [
          "M3.25 13.375L12.375 13.375A1 1 0 0 0 13.375 12.375L13.375 3.25A0.625 0.625 0 0 0 12.308 2.808L2.808 12.308A0.625 0.625 0 0 0 3.25 13.375Z",
          "M8.38 10.625L10 10.625L10 9.005L8.38 10.625L9.63 9.375L10 9.375L9.63 9.375L8.38 10.625Z"
        ],
        "20": [
          "M4.5 16.25L15 16.25A1.25 1.25 0 0 0 16.25 15L16.25 4.5A0.75 0.75 0 0 0 14.97 3.97L3.97 14.97A0.75 0.75 0 0 0 4.5 16.25Z",
          "M9.93 13.25L12.5 13.25L12.5 10.68L9.93 13.25L11.43 11.75L12.5 11.75L11.43 11.75L9.93 13.25Z"
        ],
        "24": [
          "M4.75 20.25L18.5 20.25A1.75 1.75 0 0 0 20.25 18.5L20.25 4.75A1 1 0 0 0 18.54 4.04L4.04 18.54A1 1 0 0 0 4.75 20.25Z",
          "M9.58 17.25L16 17.25L16 10.83L9.58 17.25L11.08 15.75L16 15.75L16 14.25L12.58 14.25L14.08 12.75L16 12.75L16 11.25L15.58 11.25L9.58 17.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14L12.375 14A1.625 1.625 0 0 0 14 12.375L14 3.25A1.25 1.25 0 0 0 11.866 2.366L2.366 11.866A1.25 1.25 0 0 0 3.25 14ZM11 12.75L12.375 12.75A0.375 0.375 0 0 0 12.75 12.375L12.75 3.25L10.735 5.265A0.375 0.375 0 0 0 10.625 5.53L10.625 12.375A0.375 0.375 0 0 0 11 12.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17L15 17A2 2 0 0 0 17 15L17 4.5A1.5 1.5 0 0 0 14.44 3.44L3.44 14.44A1.5 1.5 0 0 0 4.5 17ZM13.75 15.5L15 15.5A0.5 0.5 0 0 0 15.5 15L15.5 4.5L13.4 6.6A0.5 0.5 0 0 0 13.25 6.96L13.25 15A0.5 0.5 0 0 0 13.75 15.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.75 21L18.5 21A2.5 2.5 0 0 0 21 18.5L21 4.75A1.75 1.75 0 0 0 18.01 3.51L3.51 18.01A1.75 1.75 0 0 0 4.75 21ZM17.25 19.5L18.5 19.5A1 1 0 0 0 19.5 18.5L19.5 4.75A0.25 0.25 0 0 0 19.07 4.57L16.9 6.75A0.5 0.5 0 0 0 16.75 7.1L16.75 19A0.5 0.5 0 0 0 17.25 19.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B2",
      "label": "Wedge, half",
      "tags": [
        "wedge",
        "cellular",
        "strength",
        "level",
        "medium"
      ],
      "note": "Ships as signal-medium. Level legs 7.23 · 4.13 · 3.13. Steps: equal in amount, not in length. Each level holds about a quarter more of the full level's ink: areas 0.26/0.50/0.77 · 0.24/0.49/0.76 · 0.26/0.51/0.73 at 24 · 20 · 16. Equal-length quarters (2.56 · 1.47 · 1.09) fall below the smallest wedge the pen can draw at 20 and 16 (legs 2.56 · 2.56 · 2.13). So do thirds (1.46 at 16). Legs of the level, low/medium/high/full: 5.23/7.23/8.98/10.23 · 2.88/4.13/5.13/5.88 · 2.25/3.13/3.75/4.38 (the room inside the frame after 1.5 of white has legs 10.23 · 5.88 · 4.38). Its right edge sits on x 13/15/16.75/18 · 11/12.25/13.25/14 · 9.125/10/10.625/11.25. Outline: the frame is B's, unchanged; the level is a solid right-angled wedge drawn with the pen as battery's charge bar is. It is one closed path, the level's outline plus runs one line apart (1.5 · 1.5 · 1.25), so no white is left inside, and its corners bend at weight/2. 1.5 of white separates it from the frame's bottom and its slope; the full level also leaves 1.5 to the right side. Filled: as Material and the wifi fan's approved levels. The frame stays at the outline weight; the level is solid and merged with it, with no white band, filling the frame to the level's right edge (x 13/15/16.75 · 11/12.25/13.25 · 9.125/10/10.625). The rest of the frame's inside is left open, its corners at the level's edge r0.5 · 0.5 · 0.375. Open part at its narrowest (high): 2.75 · 2.25 · 2.125 wide. anchor: signal — the frame is signal's own, so the ink box is signal's at every master (C28). Who: Material Symbols signal_cellular_1_bar…3_bar (frame kept, solid level merged with it from the bottom-left).",
      "anchor": "signal",
      "masters": {
        "16": [
          "M3.25 13.375L12.375 13.375A1 1 0 0 0 13.375 12.375L13.375 3.25A0.625 0.625 0 0 0 12.308 2.808L2.808 12.308A0.625 0.625 0 0 0 3.25 13.375Z",
          "M8.38 10.625L9.375 10.625L9.375 9.63L8.38 10.625Z"
        ],
        "20": [
          "M4.5 16.25L15 16.25A1.25 1.25 0 0 0 16.25 15L16.25 4.5A0.75 0.75 0 0 0 14.97 3.97L3.97 14.97A0.75 0.75 0 0 0 4.5 16.25Z",
          "M9.93 13.25L11.5 13.25L11.5 11.68L9.93 13.25L11.43 11.75L11.5 11.75L11.43 11.75L9.93 13.25Z"
        ],
        "24": [
          "M4.75 20.25L18.5 20.25A1.75 1.75 0 0 0 20.25 18.5L20.25 4.75A1 1 0 0 0 18.54 4.04L4.04 18.54A1 1 0 0 0 4.75 20.25Z",
          "M9.58 17.25L14.25 17.25L14.25 12.58L9.58 17.25L11.08 15.75L14.25 15.75L14.25 14.25L12.58 14.25L14.08 12.75L14.25 12.75L14.08 12.75L9.58 17.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14L12.375 14A1.625 1.625 0 0 0 14 12.375L14 3.25A1.25 1.25 0 0 0 11.866 2.366L2.366 11.866A1.25 1.25 0 0 0 3.25 14ZM10.375 12.75L12.375 12.75A0.375 0.375 0 0 0 12.75 12.375L12.75 3.25L10.11 5.89A0.375 0.375 0 0 0 10 6.155L10 12.375A0.375 0.375 0 0 0 10.375 12.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17L15 17A2 2 0 0 0 17 15L17 4.5A1.5 1.5 0 0 0 14.44 3.44L3.44 14.44A1.5 1.5 0 0 0 4.5 17ZM12.75 15.5L15 15.5A0.5 0.5 0 0 0 15.5 15L15.5 4.5L12.4 7.6A0.5 0.5 0 0 0 12.25 7.96L12.25 15A0.5 0.5 0 0 0 12.75 15.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.75 21L18.5 21A2.5 2.5 0 0 0 21 18.5L21 4.75A1.75 1.75 0 0 0 18.01 3.51L3.51 18.01A1.75 1.75 0 0 0 4.75 21ZM15.5 19.5L18.5 19.5A1 1 0 0 0 19.5 18.5L19.5 4.75A0.25 0.25 0 0 0 19.07 4.57L15.15 8.5A0.5 0.5 0 0 0 15 8.85L15 19A0.5 0.5 0 0 0 15.5 19.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B1",
      "label": "Wedge, a quarter",
      "tags": [
        "wedge",
        "cellular",
        "strength",
        "level",
        "low"
      ],
      "note": "Ships as signal-low. Level legs 5.23 · 2.88 · 2.25. Steps: equal in amount, not in length. Each level holds about a quarter more of the full level's ink: areas 0.26/0.50/0.77 · 0.24/0.49/0.76 · 0.26/0.51/0.73 at 24 · 20 · 16. Equal-length quarters (2.56 · 1.47 · 1.09) fall below the smallest wedge the pen can draw at 20 and 16 (legs 2.56 · 2.56 · 2.13). So do thirds (1.46 at 16). Legs of the level, low/medium/high/full: 5.23/7.23/8.98/10.23 · 2.88/4.13/5.13/5.88 · 2.25/3.13/3.75/4.38 (the room inside the frame after 1.5 of white has legs 10.23 · 5.88 · 4.38). Its right edge sits on x 13/15/16.75/18 · 11/12.25/13.25/14 · 9.125/10/10.625/11.25. Outline: the frame is B's, unchanged; the level is a solid right-angled wedge drawn with the pen as battery's charge bar is. It is one closed path, the level's outline plus runs one line apart (1.5 · 1.5 · 1.25), so no white is left inside, and its corners bend at weight/2. 1.5 of white separates it from the frame's bottom and its slope; the full level also leaves 1.5 to the right side. Filled: as Material and the wifi fan's approved levels. The frame stays at the outline weight; the level is solid and merged with it, with no white band, filling the frame to the level's right edge (x 13/15/16.75 · 11/12.25/13.25 · 9.125/10/10.625). The rest of the frame's inside is left open, its corners at the level's edge r0.5 · 0.5 · 0.375. Open part at its narrowest (high): 2.75 · 2.25 · 2.125 wide. anchor: signal — the frame is signal's own, so the ink box is signal's at every master (C28). At 16 the low level is the smallest wedge the 1.25 pen draws cleanly, legs 2.25, area 0.26; in real pixels it is a dot in the corner. Who: Material Symbols signal_cellular_1_bar…3_bar (frame kept, solid level merged with it from the bottom-left).",
      "anchor": "signal",
      "masters": {
        "16": [
          "M3.25 13.375L12.375 13.375A1 1 0 0 0 13.375 12.375L13.375 3.25A0.625 0.625 0 0 0 12.308 2.808L2.808 12.308A0.625 0.625 0 0 0 3.25 13.375Z",
          "M8.38 10.625L8.5 10.625L8.5 10.505L8.38 10.625Z"
        ],
        "20": [
          "M4.5 16.25L15 16.25A1.25 1.25 0 0 0 16.25 15L16.25 4.5A0.75 0.75 0 0 0 14.97 3.97L3.97 14.97A0.75 0.75 0 0 0 4.5 16.25Z",
          "M9.93 13.25L10.25 13.25L10.25 12.93L9.93 13.25Z"
        ],
        "24": [
          "M4.75 20.25L18.5 20.25A1.75 1.75 0 0 0 20.25 18.5L20.25 4.75A1 1 0 0 0 18.54 4.04L4.04 18.54A1 1 0 0 0 4.75 20.25Z",
          "M9.58 17.25L12.25 17.25L12.25 14.58L9.58 17.25L11.08 15.75L12.25 15.75L11.08 15.75L9.58 17.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14L12.375 14A1.625 1.625 0 0 0 14 12.375L14 3.25A1.25 1.25 0 0 0 11.866 2.366L2.366 11.866A1.25 1.25 0 0 0 3.25 14ZM9.5 12.75L12.375 12.75A0.375 0.375 0 0 0 12.75 12.375L12.75 3.25L9.235 6.765A0.375 0.375 0 0 0 9.125 7.03L9.125 12.375A0.375 0.375 0 0 0 9.5 12.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17L15 17A2 2 0 0 0 17 15L17 4.5A1.5 1.5 0 0 0 14.44 3.44L3.44 14.44A1.5 1.5 0 0 0 4.5 17ZM11.5 15.5L15 15.5A0.5 0.5 0 0 0 15.5 15L15.5 4.5L11.15 8.85A0.5 0.5 0 0 0 11 9.21L11 15A0.5 0.5 0 0 0 11.5 15.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.75 21L18.5 21A2.5 2.5 0 0 0 21 18.5L21 4.75A1.75 1.75 0 0 0 18.01 3.51L3.51 18.01A1.75 1.75 0 0 0 4.75 21ZM13.5 19.5L18.5 19.5A1 1 0 0 0 19.5 18.5L19.5 4.75A0.25 0.25 0 0 0 19.07 4.57L13.15 10.5A0.5 0.5 0 0 0 13 10.85L13 19A0.5 0.5 0 0 0 13.5 19.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E3",
      "label": "Three of four bars",
      "tags": [
        "bars",
        "cellular",
        "reception",
        "strength",
        "level",
        "high"
      ],
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
      },
      "note": "Ships as signal-2-high. 3 of signal-2's four bars active, 1 kept as dots. Ink 18×10.5 · 13.5×7.75 · 11.75×7. Rhythm: signal-2 exactly — pitch 5.5 · 4 · 3.5, one baseline (ink 18.75 · 15 · 12.5), active bars at signal-2's heights 4.5/7.5/10.5/13.5 · 3.25/5.5/7.75/10 · 3/5/7/9. Each inactive bar stays in its place as a dot at the bar's foot: a zero-length line whose round cap is a disc exactly the bar's width, ⌀1.5 · 1.5 · 1.25 (filled 2.5 · 2 · 2). So the pitch, the air (4 · 2.5 · 2.25, filled 3 · 2 · 1.5) and the box width (18 · 13.5 · 11.75) hold, and the eye still counts four places. Dot against the lowest bar: 1.5 vs 4.5 · 1.5 vs 3.25 · 1.25 vs 3; filled 2.5 vs 4.5 · 2 vs 3.25 · 2 vs 3, the closest pair at 16 filled. anchor: signal-2 — the ink stays inside signal-2's box on its baseline and shares its left and right edges (C28). Filled: C17 like signal-2, weight 2.5 · 2 · 2, bars' ends pulled in, the dots grow in place on the baseline. Who: Tabler antenna-bars-1…4 (dots for empty bars), Bootstrap reception-0…3 (flat dashes). The zero-length line is new to the set; Tabler draws the same dot as a 0.01 line.",
      "anchor": "signal-2",
      "masters": {
        "16": [
          "M2.75 10.125V11.875",
          "M6.25 8.125V11.875",
          "M9.75 6.125V11.875",
          "M13.25 11.875V11.875"
        ],
        "20": [
          "M4 12.5V14.25",
          "M8 10.25V14.25",
          "M12 8V14.25",
          "M16 14.25V14.25"
        ],
        "24": [
          "M3.75 15V18",
          "M9.25 12V18",
          "M14.75 9V18",
          "M20.25 18V18"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 10.5V11.5",
            "M6.25 8.5V11.5",
            "M9.75 6.5V11.5",
            "M13.25 11.5V11.5"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 12.75V14",
            "M8 10.5V14",
            "M12 8.25V14",
            "M16 14V14"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 15.5V17.5",
            "M9.25 12.5V17.5",
            "M14.75 9.5V17.5",
            "M20.25 17.5V17.5"
          ]
        }
      }
    },
    {
      "id": "E2",
      "label": "Two of four bars",
      "tags": [
        "bars",
        "cellular",
        "reception",
        "strength",
        "level",
        "medium"
      ],
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
      },
      "note": "Ships as signal-2-medium. 2 of signal-2's four bars active, 2 kept as dots. Ink 18×7.5 · 13.5×5.5 · 11.75×5. Rhythm: signal-2 exactly — pitch 5.5 · 4 · 3.5, one baseline (ink 18.75 · 15 · 12.5), active bars at signal-2's heights 4.5/7.5/10.5/13.5 · 3.25/5.5/7.75/10 · 3/5/7/9. Each inactive bar stays in its place as a dot at the bar's foot: a zero-length line whose round cap is a disc exactly the bar's width, ⌀1.5 · 1.5 · 1.25 (filled 2.5 · 2 · 2). So the pitch, the air (4 · 2.5 · 2.25, filled 3 · 2 · 1.5) and the box width (18 · 13.5 · 11.75) hold, and the eye still counts four places. Dot against the lowest bar: 1.5 vs 4.5 · 1.5 vs 3.25 · 1.25 vs 3; filled 2.5 vs 4.5 · 2 vs 3.25 · 2 vs 3, the closest pair at 16 filled. anchor: signal-2 — the ink stays inside signal-2's box on its baseline and shares its left and right edges (C28). Filled: C17 like signal-2, weight 2.5 · 2 · 2, bars' ends pulled in, the dots grow in place on the baseline. Who: Tabler antenna-bars-1…4 (dots for empty bars), Bootstrap reception-0…3 (flat dashes). The zero-length line is new to the set; Tabler draws the same dot as a 0.01 line.",
      "anchor": "signal-2",
      "masters": {
        "16": [
          "M2.75 10.125V11.875",
          "M6.25 8.125V11.875",
          "M9.75 11.875V11.875",
          "M13.25 11.875V11.875"
        ],
        "20": [
          "M4 12.5V14.25",
          "M8 10.25V14.25",
          "M12 14.25V14.25",
          "M16 14.25V14.25"
        ],
        "24": [
          "M3.75 15V18",
          "M9.25 12V18",
          "M14.75 18V18",
          "M20.25 18V18"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 10.5V11.5",
            "M6.25 8.5V11.5",
            "M9.75 11.5V11.5",
            "M13.25 11.5V11.5"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 12.75V14",
            "M8 10.5V14",
            "M12 14V14",
            "M16 14V14"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 15.5V17.5",
            "M9.25 12.5V17.5",
            "M14.75 17.5V17.5",
            "M20.25 17.5V17.5"
          ]
        }
      }
    },
    {
      "id": "E1",
      "label": "One of four bars",
      "tags": [
        "bars",
        "cellular",
        "reception",
        "strength",
        "level",
        "low"
      ],
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
      },
      "note": "Ships as signal-2-low. 1 of signal-2's four bars active, 3 kept as dots. Ink 18×4.5 · 13.5×3.25 · 11.75×3. Rhythm: signal-2 exactly — pitch 5.5 · 4 · 3.5, one baseline (ink 18.75 · 15 · 12.5), active bars at signal-2's heights 4.5/7.5/10.5/13.5 · 3.25/5.5/7.75/10 · 3/5/7/9. Each inactive bar stays in its place as a dot at the bar's foot: a zero-length line whose round cap is a disc exactly the bar's width, ⌀1.5 · 1.5 · 1.25 (filled 2.5 · 2 · 2). So the pitch, the air (4 · 2.5 · 2.25, filled 3 · 2 · 1.5) and the box width (18 · 13.5 · 11.75) hold, and the eye still counts four places. Dot against the lowest bar: 1.5 vs 4.5 · 1.5 vs 3.25 · 1.25 vs 3; filled 2.5 vs 4.5 · 2 vs 3.25 · 2 vs 3, the closest pair at 16 filled. anchor: signal-2 — the ink stays inside signal-2's box on its baseline and shares its left and right edges (C28). Filled: C17 like signal-2, weight 2.5 · 2 · 2, bars' ends pulled in, the dots grow in place on the baseline. Who: Tabler antenna-bars-1…4 (dots for empty bars), Bootstrap reception-0…3 (flat dashes). The zero-length line is new to the set; Tabler draws the same dot as a 0.01 line.",
      "anchor": "signal-2",
      "masters": {
        "16": [
          "M2.75 10.125V11.875",
          "M6.25 11.875V11.875",
          "M9.75 11.875V11.875",
          "M13.25 11.875V11.875"
        ],
        "20": [
          "M4 12.5V14.25",
          "M8 14.25V14.25",
          "M12 14.25V14.25",
          "M16 14.25V14.25"
        ],
        "24": [
          "M3.75 15V18",
          "M9.25 18V18",
          "M14.75 18V18",
          "M20.25 18V18"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 10.5V11.5",
            "M6.25 11.5V11.5",
            "M9.75 11.5V11.5",
            "M13.25 11.5V11.5"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 12.75V14",
            "M8 14V14",
            "M12 14V14",
            "M16 14V14"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 15.5V17.5",
            "M9.25 17.5V17.5",
            "M14.75 17.5V17.5",
            "M20.25 17.5V17.5"
          ]
        }
      }
    },
    {
      "id": "E0",
      "label": "None of four bars",
      "tags": [
        "bars",
        "cellular",
        "reception",
        "strength",
        "level",
        "none"
      ],
      "grows": {
        "16": [
          0.375,
          0.375,
          0.75,
          0
        ],
        "20": [
          0.25,
          0.25,
          0.5,
          0
        ],
        "24": [
          0.5,
          0.5,
          1,
          0
        ]
      },
      "note": "Ships as signal-2-none. 0 of signal-2's four bars active, 4 kept as dots. Ink 18×1.5 · 13.5×1.5 · 11.75×1.25, four dots on the baseline; a row of dots alone can read as an ellipsis, which only the family context answers. Rhythm: signal-2 exactly — pitch 5.5 · 4 · 3.5, one baseline (ink 18.75 · 15 · 12.5), active bars at signal-2's heights 4.5/7.5/10.5/13.5 · 3.25/5.5/7.75/10 · 3/5/7/9. Each inactive bar stays in its place as a dot at the bar's foot: a zero-length line whose round cap is a disc exactly the bar's width, ⌀1.5 · 1.5 · 1.25 (filled 2.5 · 2 · 2). So the pitch, the air (4 · 2.5 · 2.25, filled 3 · 2 · 1.5) and the box width (18 · 13.5 · 11.75) hold, and the eye still counts four places. Dot against the lowest bar: 1.5 vs 4.5 · 1.5 vs 3.25 · 1.25 vs 3; filled 2.5 vs 4.5 · 2 vs 3.25 · 2 vs 3, the closest pair at 16 filled. anchor: signal-2 — the ink stays inside signal-2's box on its baseline and shares its left and right edges (C28). Filled: C17 like signal-2, weight 2.5 · 2 · 2, bars' ends pulled in, the dots grow in place on the baseline. Who: Tabler antenna-bars-1…4 (dots for empty bars), Bootstrap reception-0…3 (flat dashes). The zero-length line is new to the set; Tabler draws the same dot as a 0.01 line.",
      "anchor": "signal-2",
      "masters": {
        "16": [
          "M2.75 11.875V11.875",
          "M6.25 11.875V11.875",
          "M9.75 11.875V11.875",
          "M13.25 11.875V11.875"
        ],
        "20": [
          "M4 14.25V14.25",
          "M8 14.25V14.25",
          "M12 14.25V14.25",
          "M16 14.25V14.25"
        ],
        "24": [
          "M3.75 18V18",
          "M9.25 18V18",
          "M14.75 18V18",
          "M20.25 18V18"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 11.5V11.5",
            "M6.25 11.5V11.5",
            "M9.75 11.5V11.5",
            "M13.25 11.5V11.5"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 14V14",
            "M8 14V14",
            "M12 14V14",
            "M16 14V14"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 17.5V17.5",
            "M9.25 17.5V17.5",
            "M14.75 17.5V17.5",
            "M20.25 17.5V17.5"
          ]
        }
      }
    }
  ]
};
