// tv: desktop already ships six monitors and video-3 is the screen with a play, so this decides which one feature makes a screen read as a television at 16 — antenna, knobs, legs, a curved stand or a long bar.
export default {
  "concept": "tv",
  "question": "Which feature makes this screen a TV and never a desktop: rabbit ears (A), a retro set with knobs (B), splayed legs (C), a curved stand (D) or a long soundbar (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Rabbit-ear antenna",
      "tags": [
        "antenna",
        "rabbit ears",
        "television",
        "broadcast"
      ],
      "note": "Rhythm: one screen and one antenna proportion at every master — the antenna rises a third of the screen's height (4.5 · 3.5 · 3 over 13.5 · 10.5 · 9 of screen ink) and spans 45% · 44% · 43% of its width on centrelines (9 · 7 · 6), desktop's foot proportion; arms at 45° from one apex on the top wall's centreline, tips at y 3.75 · 3.75 · 2.625 so the ink starts on the box's top edge. Screen ink 20×13.5 · 16×10.5 · 14×9 (1.48 · 1.52 · 1.56 : 1), radius 2.5 · 2 · 1.5 (desktop's), walls on the box's sides. Ink 20×18 · 16×14 · 14×12 (desktop's agreed box), box-centred; the 16 master on whole pixels (screen 1..15 × 5..14). Filled: screen solid, outer radius 3.25 · 2.75 · 2.125 as desktop-filled; antenna stays 1.5 · 1.5 · 1.25. Who: Lucide tv, Tabler device-tv, Phosphor TelevisionSimple, Remix tv-line, Iconoir tv. (recommended) — the antenna is the one feature no monitor has, it reads as a TV at 16 in both styles, and it sits in desktop's box with desktop's screen corners.",
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
      "masters": {
        "16": [
          "M3.125 5.625H12.875A1.5 1.5 0 0 1 14.375 7.125V11.875A1.5 1.5 0 0 1 12.875 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V7.125A1.5 1.5 0 0 1 3.125 5.625Z",
          "M5 2.625L8 5.625L11 2.625"
        ],
        "20": [
          "M4.75 7.25H15.25A2 2 0 0 1 17.25 9.25V14.25A2 2 0 0 1 15.25 16.25H4.75A2 2 0 0 1 2.75 14.25V9.25A2 2 0 0 1 4.75 7.25Z",
          "M6.5 3.75L10 7.25L13.5 3.75"
        ],
        "24": [
          "M5.25 8.25H18.75A2.5 2.5 0 0 1 21.25 10.75V17.75A2.5 2.5 0 0 1 18.75 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V10.75A2.5 2.5 0 0 1 5.25 8.25Z",
          "M7.5 3.75L12 8.25L16.5 3.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 5H12.875A2.125 2.125 0 0 1 15 7.125V11.875A2.125 2.125 0 0 1 12.875 14H3.125A2.125 2.125 0 0 1 1 11.875V7.125A2.125 2.125 0 0 1 3.125 5Z"
          ],
          "stroke": [
            "M5 2.625L8 5.625L11 2.625"
          ]
        },
        "20": {
          "fill": [
            "M4.75 6.5H15.25A2.75 2.75 0 0 1 18 9.25V14.25A2.75 2.75 0 0 1 15.25 17H4.75A2.75 2.75 0 0 1 2 14.25V9.25A2.75 2.75 0 0 1 4.75 6.5Z"
          ],
          "stroke": [
            "M6.5 3.75L10 7.25L13.5 3.75"
          ]
        },
        "24": {
          "fill": [
            "M5.25 7.5H18.75A3.25 3.25 0 0 1 22 10.75V17.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75V10.75A3.25 3.25 0 0 1 5.25 7.5Z"
          ],
          "stroke": [
            "M7.5 3.75L12 8.25L16.5 3.75"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Retro set with knobs",
      "tags": [
        "retro",
        "vintage",
        "knobs",
        "antenna",
        "television",
        "crt"
      ],
      "note": "Rhythm: one air of 1.5 everywhere in the knob panel — wall to knob, knob to knob, knob to divider; the panel is 6 · 5 · 4.5 wide inside (knob ⌀3 · 2 · 1.5, live's and radio's knob sizes). Two knobs at 24 (centres y 12 and 16.5, pitch 4.5, 1.5 above, between and below); one at 20 and 16, centred (2.75 · 2.5 above and below) — two need 8.5 · 7.5 of inside height and the antenna leaves 7.5 · 6.5, so a knob is dropped rather than squeezed. Body = A's screen at every master (20×13.5 · 16×10.5 · 14×9 of ink, r2.5 · 2 · 1.5); divider at x 13.75 · 10.75 · 8.625, screen compartment 9.5×10.5 · 6.5×7.5 · 5.75×6.5 inside. Antenna as A's (45°, rise 4.5 · 3.5 · 3) but standing over the screen compartment (apex x 8.25 · 6.5 · 4.625, its centre 8.25 · 6.75 · 5.125), because centred (x 12 at 24) its right arm ran into the divider's top; arm to divider top 2.39 · 1.5 · 1.58 of air. Ink 20×18 · 16×14 · 14×12, box-centred. Filled: body solid, divider a 1.5 white band at every master (wider than the 1.25 line at 16, C22), knobs white dots ⌀3 · 2 · 1.5; material knob to knob 1.5, knob to band 1.5 · 1.5 · 1.38 (line-weight floor 1.25 at 16). Who: Tabler device-tv-old, Phosphor Television. The clearest 'television set'; busiest at 16, and the single knob there reads more as a slot than a dial.",
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
      "masters": {
        "16": [
          "M3.125 5.625H12.875A1.5 1.5 0 0 1 14.375 7.125V11.875A1.5 1.5 0 0 1 12.875 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V7.125A1.5 1.5 0 0 1 3.125 5.625Z",
          "M1.625 2.625L4.625 5.625L7.625 2.625",
          "M8.625 5.625V13.375",
          "M11.375 9.5A0.125 0.125 0 1 0 11.625 9.5A0.125 0.125 0 1 0 11.375 9.5Z"
        ],
        "20": [
          "M4.75 7.25H15.25A2 2 0 0 1 17.25 9.25V14.25A2 2 0 0 1 15.25 16.25H4.75A2 2 0 0 1 2.75 14.25V9.25A2 2 0 0 1 4.75 7.25Z",
          "M3 3.75L6.5 7.25L10 3.75",
          "M10.75 7.25V16.25",
          "M13.75 11.75A0.25 0.25 0 1 0 14.25 11.75A0.25 0.25 0 1 0 13.75 11.75Z"
        ],
        "24": [
          "M5.25 8.25H18.75A2.5 2.5 0 0 1 21.25 10.75V17.75A2.5 2.5 0 0 1 18.75 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V10.75A2.5 2.5 0 0 1 5.25 8.25Z",
          "M3.75 3.75L8.25 8.25L12.75 3.75",
          "M13.75 8.25V20.25",
          "M16.75 12A0.75 0.75 0 1 0 18.25 12A0.75 0.75 0 1 0 16.75 12Z",
          "M16.75 16.5A0.75 0.75 0 1 0 18.25 16.5A0.75 0.75 0 1 0 16.75 16.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 5H12.875A2.125 2.125 0 0 1 15 7.125V11.875A2.125 2.125 0 0 1 12.875 14H3.125A2.125 2.125 0 0 1 1 11.875V7.125A2.125 2.125 0 0 1 3.125 5ZM7.875 6.25H9.375V12.75H7.875ZM10.75 9.5A0.75 0.75 0 1 0 12.25 9.5A0.75 0.75 0 1 0 10.75 9.5Z"
          ],
          "stroke": [
            "M1.625 2.625L4.625 5.625L7.625 2.625"
          ]
        },
        "20": {
          "fill": [
            "M4.75 6.5H15.25A2.75 2.75 0 0 1 18 9.25V14.25A2.75 2.75 0 0 1 15.25 17H4.75A2.75 2.75 0 0 1 2 14.25V9.25A2.75 2.75 0 0 1 4.75 6.5ZM10 8H11.5V15.5H10ZM13 11.75A1 1 0 1 0 15 11.75A1 1 0 1 0 13 11.75Z"
          ],
          "stroke": [
            "M3 3.75L6.5 7.25L10 3.75"
          ]
        },
        "24": {
          "fill": [
            "M5.25 7.5H18.75A3.25 3.25 0 0 1 22 10.75V17.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75V10.75A3.25 3.25 0 0 1 5.25 7.5ZM13 9H14.5V19.5H13ZM16 12A1.5 1.5 0 1 0 19 12A1.5 1.5 0 1 0 16 12ZM16 16.5A1.5 1.5 0 1 0 19 16.5A1.5 1.5 0 1 0 16 16.5Z"
          ],
          "stroke": [
            "M3.75 3.75L8.25 8.25L12.75 3.75"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Screen on splayed legs",
      "tags": [
        "legs",
        "retro",
        "television",
        "wide"
      ],
      "note": "Rhythm: two legs at 45°, mirrored, rooted on the straight part of the bottom wall 1.75 · 1.75 · 2.5 in from where the corner arc ends, each dropping 3 · 2 · 2 (3 · 2 · 2 of leg showing below the screen's ink); feet 16 · 11 · 8.75 apart on centre, their ink spanning 88% · 78% · 71% of the screen. Screen ink 20×13 · 16×10 · 14×8 (1.54 · 1.6 · 1.75 : 1), radius 2.5 · 2 · 1.5. Ink 20×16 · 16×12 · 14×10 (landscape keyline, as desktop-4 and film), box-centred; 16 screen edges on whole pixels (1..15 × 3..11), legs ending at ink y 13. Filled: screen solid, outer radius 3.25 · 2.75 · 2.125; legs stay 1.5 · 1.5 · 1.25. Who: Material Symbols tv_gen. Reads as a set standing on furniture legs; nothing under the centre, which is what desktop always has. At 16 the legs are short (2 px) and could read as a bench or a sofa back.",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V8.875A1.5 1.5 0 0 1 12.875 10.375H3.125A1.5 1.5 0 0 1 1.625 8.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M5.625 10.375L3.625 12.375",
          "M10.375 10.375L12.375 12.375"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V11.25A2 2 0 0 1 15.25 13.25H4.75A2 2 0 0 1 2.75 11.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M6.5 13.25L4.5 15.25",
          "M13.5 13.25L15.5 15.25"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V13.75A2.5 2.5 0 0 1 18.75 16.25H5.25A2.5 2.5 0 0 1 2.75 13.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M7 16.25L4 19.25",
          "M17 16.25L20 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V8.875A2.125 2.125 0 0 1 12.875 11H3.125A2.125 2.125 0 0 1 1 8.875V5.125A2.125 2.125 0 0 1 3.125 3Z"
          ],
          "stroke": [
            "M5.625 10.375L3.625 12.375",
            "M10.375 10.375L12.375 12.375"
          ]
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V11.25A2.75 2.75 0 0 1 15.25 14H4.75A2.75 2.75 0 0 1 2 11.25V6.75A2.75 2.75 0 0 1 4.75 4Z"
          ],
          "stroke": [
            "M6.5 13.25L4.5 15.25",
            "M13.5 13.25L15.5 15.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V13.75A3.25 3.25 0 0 1 18.75 17H5.25A3.25 3.25 0 0 1 2 13.75V7.25A3.25 3.25 0 0 1 5.25 4Z"
          ],
          "stroke": [
            "M7 16.25L4 19.25",
            "M17 16.25L20 19.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Curved stand",
      "tags": [
        "stand",
        "pedestal",
        "television",
        "flat screen"
      ],
      "note": "Rhythm: the stand is one shallow arch, chord 12 · 10 · 8 (60% · 62.5% · 57% of the screen), rising 1.5 · 1 · 1 (an eighth of its chord at 24 and 16, a tenth at 20; R 12.75 · 13 · 8.5), its crown 1.5 · 1.5 · 1.75 under the screen's ink and its ends on the box's floor. Screen ink 20×13.5 · 16×10 · 14×8 (1.48 · 1.6 · 1.75 : 1), radius 2.5 · 2 · 1.5. Ink 20×18 · 16×14 · 14×12 (desktop's agreed box), box-centred; 16 screen on whole pixels (1..15 × 2..10). Filled: screen solid, outer radius 3.25 · 2.75 · 2.125; the arch stays 1.5 · 1.5 · 1.25. Who: Nucleo tv (the arch under the screen). A modern set on a curved pedestal, no neck. Risk: at 16 the arch reads as a frown under the screen, and it is the candidate nearest desktop-2.",
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
      "masters": {
        "16": [
          "M3.125 2.625H12.875A1.5 1.5 0 0 1 14.375 4.125V7.875A1.5 1.5 0 0 1 12.875 9.375H3.125A1.5 1.5 0 0 1 1.625 7.875V4.125A1.5 1.5 0 0 1 3.125 2.625Z",
          "M4 13.375A8.5 8.5 0 0 1 12 13.375"
        ],
        "20": [
          "M4.75 3.75H15.25A2 2 0 0 1 17.25 5.75V10.25A2 2 0 0 1 15.25 12.25H4.75A2 2 0 0 1 2.75 10.25V5.75A2 2 0 0 1 4.75 3.75Z",
          "M5 16.25A13 13 0 0 1 15 16.25"
        ],
        "24": [
          "M5.25 3.75H18.75A2.5 2.5 0 0 1 21.25 6.25V13.25A2.5 2.5 0 0 1 18.75 15.75H5.25A2.5 2.5 0 0 1 2.75 13.25V6.25A2.5 2.5 0 0 1 5.25 3.75Z",
          "M6 20.25A12.75 12.75 0 0 1 18 20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 2H12.875A2.125 2.125 0 0 1 15 4.125V7.875A2.125 2.125 0 0 1 12.875 10H3.125A2.125 2.125 0 0 1 1 7.875V4.125A2.125 2.125 0 0 1 3.125 2Z"
          ],
          "stroke": [
            "M4 13.375A8.5 8.5 0 0 1 12 13.375"
          ]
        },
        "20": {
          "fill": [
            "M4.75 3H15.25A2.75 2.75 0 0 1 18 5.75V10.25A2.75 2.75 0 0 1 15.25 13H4.75A2.75 2.75 0 0 1 2 10.25V5.75A2.75 2.75 0 0 1 4.75 3Z"
          ],
          "stroke": [
            "M5 16.25A13 13 0 0 1 15 16.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 3H18.75A3.25 3.25 0 0 1 22 6.25V13.25A3.25 3.25 0 0 1 18.75 16.5H5.25A3.25 3.25 0 0 1 2 13.25V6.25A3.25 3.25 0 0 1 5.25 3Z"
          ],
          "stroke": [
            "M6 20.25A12.75 12.75 0 0 1 18 20.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Screen over a soundbar",
      "tags": [
        "flat screen",
        "soundbar",
        "television",
        "wide",
        "smart tv"
      ],
      "note": "Rhythm: a bar 70% · 69% · 71% of the screen's width (ink 14 · 11 · 10), floating 2.5 · 1.5 · 1.75 under it — desktop-2's air, so only the length differs (desktop-2's foot is 45% · 44% · 43%). Screen ink 20×12 · 16×9 · 14×7 (1.67 · 1.78 · 2 : 1, desktop-4's wide screen), radius 2.5 · 2 · 1.5. Ink 20×16 · 16×12 · 14×10 (landscape keyline), box-centred; 16 screen and bar on whole pixels (screen 1..15 × 3..10, bar 3..13 × 11.75..13). Filled: screen solid, outer radius 3.25 · 2.75 · 2.125; bar stays 1.5 · 1.5 · 1.25. Who: Lucide tv-minimal, Fluent Tv, Remix tv-2-line. The commonest modern TV in UI sets, but it is desktop-2 with a longer bar: next to desktop at 16 the difference is 4 px of bar.",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V7.875A1.5 1.5 0 0 1 12.875 9.375H3.125A1.5 1.5 0 0 1 1.625 7.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M3.625 12.375H12.375"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V10.25A2 2 0 0 1 15.25 12.25H4.75A2 2 0 0 1 2.75 10.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M5.25 15.25H14.75"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V12.75A2.5 2.5 0 0 1 18.75 15.25H5.25A2.5 2.5 0 0 1 2.75 12.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M5.75 19.25H18.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V7.875A2.125 2.125 0 0 1 12.875 10H3.125A2.125 2.125 0 0 1 1 7.875V5.125A2.125 2.125 0 0 1 3.125 3Z"
          ],
          "stroke": [
            "M3.625 12.375H12.375"
          ]
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V10.25A2.75 2.75 0 0 1 15.25 13H4.75A2.75 2.75 0 0 1 2 10.25V6.75A2.75 2.75 0 0 1 4.75 4Z"
          ],
          "stroke": [
            "M5.25 15.25H14.75"
          ]
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V12.75A3.25 3.25 0 0 1 18.75 16H5.25A3.25 3.25 0 0 1 2 12.75V7.25A3.25 3.25 0 0 1 5.25 4Z"
          ],
          "stroke": [
            "M5.75 19.25H18.25"
          ]
        }
      }
    }
  ]
};
