// signal: rising bars are the phone status bar's own picture — chart-bar was drawn low-tall-middle so that signal could own the rising order. This settles how many bars signal draws, at what proportion, and whether Android's solid wedge joins the set. No candidate uses arcs, so none can be mistaken for wifi (a fan of arcs), radio-tower (a mast under arcs), live, podcast, rss or contactless.
export default {
  "concept": "signal",
  "question": "Which picture says cellular signal: four rising bars (A), Android's solid wedge (B), Lucide's dot then bars (C), three bars (D) or the wider status-bar proportion (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Four rising bars",
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
          12
        ],
        "20": [
          13.5,
          14
        ],
        "24": [
          18,
          18
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
      "note": "Rhythm: four upright bars on one even pitch, 5.5 · 4 · 3.5. That is waveform's pitch, and at 24 and 16 its centres too: 3.75 / 9.25 / 14.75 / 20.25 and 2.75 / 6.25 / 9.75 / 13.25. Air between bars 4 · 2.5 · 2.25, filled 3 · 2 · 1.5. The bars stand on one baseline (ink bottom 21 · 17 · 14) and rise in equal steps of 4.5 · 3.5 · 3, so the heights run 1 : 2 : 3 : 4 at every master — 4.5/9/13.5/18 · 3.5/7/10.5/14 · 3/6/9/12. Pitch to height 0.31 · 0.29 · 0.29. Ink 18×18 · 13.5×14 · 11.75×12, box-centred, declared as a box like waveform's. At 16 the centres sit on .75/.25, mirror images of each other, so all four bars render alike (the same trade waveform made). Filled: the repeated-elements case (C17), like chart-bar-filled: weight 2.5 · 2 · 2, ends pulled in 0.5 · 0.25 · 0.375 so heights and baseline hold, bars thicken in place, grows 0.5 · 0.25 · 0.375 left and right (19×18 · 14×14 · 12.5×12). Differs from chart-bar by its order and count: chart-bar is three bars low-tall-middle, which never rise. Who: Tabler antenna-bars-5 (four round-capped lines), Phosphor cell-signal-full (five round bars), Nucleo signal (four at 12, five at 18), Fluent cellular-data-1 (five), Bootstrap reception-4 (four), the phone status bar. (recommended) — this is the picture every phone shows; four bars still read as steps at 16, it shares waveform's rhythm, and dropping bars in place gives a ready level family (signal-low, -medium; C28).",
      "masters": {
        "16": [
          "M2.75 11.625V13.375",
          "M6.25 8.625V13.375",
          "M9.75 5.625V13.375",
          "M13.25 2.625V13.375"
        ],
        "20": [
          "M4 14.25V16.25",
          "M8 10.75V16.25",
          "M12 7.25V16.25",
          "M16 3.75V16.25"
        ],
        "24": [
          "M3.75 17.25V20.25",
          "M9.25 12.75V20.25",
          "M14.75 8.25V20.25",
          "M20.25 3.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 12V13",
            "M6.25 9V13",
            "M9.75 6V13",
            "M13.25 3V13"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 14.5V16",
            "M8 11V16",
            "M12 7.5V16",
            "M16 4V16"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 17.75V19.75",
            "M9.25 13.25V19.75",
            "M14.75 8.75V19.75",
            "M20.25 4.25V19.75"
          ]
        }
      }
    },
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
      "note": "Rhythm: one shape, so balance is the question. A right-angled wedge fills the square keyline: ink 18×18 · 14×14 · 12×12, box-centred, rising from bottom-left to the top-right corner at 45°. Corners: both 45° tips bend r 1 · 0.75 · 0.625 on the centreline (outer 1.75 · 1.5 · 1.25); the right angle bends r 1.75 · 1.25 · 1 (outer 2.5 · 2 · 1.625, the container radius at 24). Inside white holds a circle of ⌀ 9 · 6.4 · 5.6 (floor 1.5). The tangent points on the 45° side are irrational, so they round to 2 · 2 · 3 places (lint lists them as off-grid values); the ink box lands within 0.006 of 18 at 24. Filled: the wedge fills solid with the same outer edge, the same corner centres and radii grown by half the weight; ink box identical. Caveat: in Material's outlined style a hollow wedge (signal_cellular_0_bar) means NO signal and only the solid one means full, so our outline twin reads as 'empty' to Android users. The filled wedge is among the heaviest filled shapes in the set (a half square at 18). Who: Material Symbols signal_cellular_4_bar (solid wedge) and network_cell, the Android status bar.",
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
      "id": "C",
      "label": "Dot then bars",
      "tags": [
        "bars",
        "dot",
        "cellular",
        "reception",
        "strength"
      ],
      "box": {
        "16": [
          12.75,
          11.875
        ],
        "20": [
          13.75,
          14
        ],
        "24": [
          17.5,
          17
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
      "note": "Rhythm: a dot and three bars on one even pitch, 5.25 · 4 · 3.75. The pitch is wider than A's at 16 (3.75, not 3.5) because the filled dot (⌀2.5) needs 1.5 of air to the first bar. The dot is list-bullet's (outline ⌀ 2 · 2 · 1.75, filled 3 · 2.5 · 2.5) and stands for the zero level. The bars rise from it in equal steps of 5 · 4 · 3.375: heights 2 (dot) / 7 / 12 / 17 · 2 / 6 / 10 / 14 · 1.75 / 5.125 / 8.5 / 11.875, on one baseline. Air bar to bar 3.75 · 2.5 · 2.5 and dot to bar 3.5 · 2.25 · 2.25; filled 2.75 · 2 · 1.75 and 2.5 · 1.75 · 1.5. The dot is wider than a bar, so its air reads a quarter less at its widest point. Ink 17.5×17 · 13.75×14 · 12.75×11.875, declared as a box. At 20 the bars keep whole-number centres, which leaves the ink 0.125 left of centre, toward the light side. Filled: C17 like A, weight 2.5 · 2 · 2 with ends pulled in; the dot rises so its bottom stays on the baseline; grows 0.5 · 0.25 · 0.375 left and right. At 16 in real pixels the outline dot is a faint speck. Who: Lucide signal (a dot, then four bars; Lucide's signal-zero draws the dot alone).",
      "masters": {
        "16": [
          "M2.25 13A0.25 0.25 0 1 0 2.75 13A0.25 0.25 0 1 0 2.25 13Z",
          "M6.25 9.375V13.25",
          "M10 6V13.25",
          "M13.75 2.625V13.25"
        ],
        "20": [
          "M3.75 16A0.25 0.25 0 1 0 4.25 16A0.25 0.25 0 1 0 3.75 16Z",
          "M8 11.75V16.25",
          "M12 7.75V16.25",
          "M16 3.75V16.25"
        ],
        "24": [
          "M4 19.5A0.25 0.25 0 1 0 4.5 19.5A0.25 0.25 0 1 0 4 19.5Z",
          "M9.5 14.25V19.75",
          "M14.75 9.25V19.75",
          "M20 4.25V19.75"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.25 12.625A0.25 0.25 0 1 0 2.75 12.625A0.25 0.25 0 1 0 2.25 12.625Z",
            "M6.25 9.75V12.875",
            "M10 6.375V12.875",
            "M13.75 3V12.875"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3.75 15.75A0.25 0.25 0 1 0 4.25 15.75A0.25 0.25 0 1 0 3.75 15.75Z",
            "M8 12V16",
            "M12 8V16",
            "M16 4V16"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M4 19A0.25 0.25 0 1 0 4.5 19A0.25 0.25 0 1 0 4 19Z",
            "M9.5 14.75V19.25",
            "M14.75 9.75V19.25",
            "M20 4.75V19.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Three rising bars",
      "tags": [
        "bars",
        "cellular",
        "reception",
        "strength",
        "three"
      ],
      "keyline": "mark",
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
      "note": "Rhythm: three bars on chart-bar's pitch and centres, 6 · 5 · 4 (6 / 12 / 18 at 24). Air 4.5 · 3.5 · 2.75, filled 3.5 · 3 · 2. They rise in equal steps of 6 · 4.75 · 4 on one baseline: heights 6/12/18 · 4.5/9.25/14 · 4/8/12. Ink 13.5×18 · 11.5×14 · 9.25×12 — chart-bar's boxes exactly — declared a mark, box-centred. Filled: C17 like chart-bar-filled, weight 2.5 · 2 · 2, ends pulled in, grows 0.5 · 0.25 · 0.375 left and right. Caveat: this is chart-bar with its bars sorted, same bars and same pitch, so at 16 the two sit one glance apart. Choose it only if that kinship is wanted. Who: Material Symbols signal_cellular_alt (three rising bars, 1 : 1.8 : 2.7 tall).",
      "masters": {
        "16": [
          "M4 10.625V13.375",
          "M8 6.625V13.375",
          "M12 2.625V13.375"
        ],
        "20": [
          "M5 13.25V16.25",
          "M10 8.5V16.25",
          "M15 3.75V16.25"
        ],
        "24": [
          "M6 15.75V20.25",
          "M12 9.75V20.25",
          "M18 3.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M4 11V13",
            "M8 7V13",
            "M12 3V13"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M5 13.5V16",
            "M10 8.75V16",
            "M15 4V16"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M6 16.25V19.75",
            "M12 10.25V19.75",
            "M18 4.25V19.75"
          ]
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
      "note": "Rhythm: A's four bars on A's pitch (5.5 · 4 · 3.5, air 4 · 2.5 · 2.25, filled 3 · 2 · 1.5), but shorter, as a phone's status-bar glyph draws them. The box is wider than tall, about 4 : 3 at every master (18×13.5 · 13.5×10 · 11.75×9), and the shortest bar starts at a third of the tallest, not a quarter. Equal steps of 3 · 2.25 · 2: heights 4.5/7.5/10.5/13.5 · 3.25/5.5/7.75/10 · 3/5/7/9, one baseline, box-centred (baseline ink 18.75 · 15 · 12.5). Filled: C17 like A, grows 0.5 · 0.25 · 0.375 left and right. A clearly different construction of A's picture, not a sixth metaphor: no other familiar picture of cellular signal survives without duplicating a shipped icon. It reads lighter and smaller than the set at 24, about the weight of an inline glyph. Who: Bootstrap reception-4 (four bars in a 15×12 box), the phone status bar.",
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
    }
  ]
};
