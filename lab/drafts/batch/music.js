// music: the picture chosen here becomes the set's word for music in every player, playlist and audio setting, so it has to read at 16 beside headphones and volume, which already own the device pictures.
export default {
  "concept": "music",
  "concepts": ["music", "piano", "waveform"],
  "question": "Which picture says music: the beamed pair, the flagged eighth note, the quarter note, piano keys or a waveform? Five familiar pictures that hold 1.5 at 16; a treble clef and a guitar were left out because their loops and strings cannot keep 1.5 of air at 16.",
  "candidates": [
    {
      "id": "A",
      "label": "Beamed pair, one slanted beam",
      "tags": [
        "beamed",
        "eighths",
        "slanted",
        "single beam"
      ],
      "note": "Rhythm and balance: two heads of one size, outer diameter 7 · 5.5 · 5 (ring r 2.75 · 2 · 1.875, hole 4 · 2.5 · 2.5, open at 16); stem pitch 11 · 8.5 · 7; air from the left stem to the right head 4 · 3 · 2. The right head sits higher by exactly the beam's rise (2.75 · 2 · 1.75 across a 1:4 beam, 14.04 degrees; at 20 the rise is 2.125 and the head step 2, so the right stem is 0.125 longer), so the heads share a baseline parallel to the beam and both stems read 11.2 · 8 · 7.2 long. Each stem stands on its head's right side, touching it (tangent), not through its centre. Corners where the stems meet the beam are r 0.75 · 0.75 · 0.625 (C10). Ink 18x18 · 14x14 · 12x12, square keyline, moved 0.5 · 0.5 · 0.375 left of the box centre (declared optical shift, C14). The same drawing at every master, nothing dropped. Why the shift: box-centred, the measured mass sat right of centre (+1.23 · +0.92 · +0.80 outline), because the stems and beam are on the right; half of that, on the grid, is 0.5 · 0.5 · 0.375, which leaves +0.73 · +0.42 · +0.42. It costs crispness: at 16 the stems now sit at 6 and 13, so they straddle pixels (play's 0.59 shift at 16 is the precedent). Up-down is left at 0: the outline wants 0.17 up and the filled twin 0.57 up, so the optical sheet should settle it. The 14-degree beam is outside the 0/45/90 angle rule, as every slanted beam is (Lucide 16.3, Iconoir 10.3, Font Awesome 16.7 degrees). Who draws it: Lucide music, Iconoir music-double-note, Font Awesome music (solid). Filled: heads solid (outer edge = the ring's), stems and beam stay at 1.5 · 1.5 · 1.25. Off-grid decimals are the tangent points where the corner arcs meet the slanted line; arc centres, stem lines, head centres and radii sit on the grid. (recommended): the picture most people know as music, it holds the most air at 16 (2 between stem and head, at least 3 under the beam) and keeps every part at all three sizes.",
      "optical": {
        "16": [
          -0.375,
          0
        ],
        "20": [
          -0.5,
          0
        ],
        "24": [
          -0.5,
          0
        ]
      },
      "masters": {
        "16": [
          "M6 11.5V4.688A0.625 0.625 0 0 1 6.473 4.081L12.223 2.644A0.625 0.625 0 0 1 13 3.25V9.75",
          "M2.25 11.5A1.875 1.875 0 1 1 6 11.5A1.875 1.875 0 1 1 2.25 11.5Z",
          "M9.25 9.75A1.875 1.875 0 1 1 13 9.75A1.875 1.875 0 1 1 9.25 9.75Z"
        ],
        "20": [
          "M7.25 14.25V6.25A0.75 0.75 0 0 1 7.82 5.52L14.82 3.77A0.75 0.75 0 0 1 15.75 4.5V12.25",
          "M3.25 14.25A2 2 0 1 1 7.25 14.25A2 2 0 1 1 3.25 14.25Z",
          "M11.75 12.25A2 2 0 1 1 15.75 12.25A2 2 0 1 1 11.75 12.25Z"
        ],
        "24": [
          "M8.75 17.5V6.88A0.75 0.75 0 0 1 9.32 6.15L18.82 3.77A0.75 0.75 0 0 1 19.75 4.5V14.75",
          "M3.25 17.5A2.75 2.75 0 1 1 8.75 17.5A2.75 2.75 0 1 1 3.25 17.5Z",
          "M14.25 14.75A2.75 2.75 0 1 1 19.75 14.75A2.75 2.75 0 1 1 14.25 14.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1.625 11.5A2.5 2.5 0 1 1 6.625 11.5A2.5 2.5 0 1 1 1.625 11.5Z",
            "M8.625 9.75A2.5 2.5 0 1 1 13.625 9.75A2.5 2.5 0 1 1 8.625 9.75Z"
          ],
          "stroke": [
            "M6 11.5V4.688A0.625 0.625 0 0 1 6.473 4.081L12.223 2.644A0.625 0.625 0 0 1 13 3.25V9.75"
          ]
        },
        "20": {
          "fill": [
            "M2.5 14.25A2.75 2.75 0 1 1 8 14.25A2.75 2.75 0 1 1 2.5 14.25Z",
            "M11 12.25A2.75 2.75 0 1 1 16.5 12.25A2.75 2.75 0 1 1 11 12.25Z"
          ],
          "stroke": [
            "M7.25 14.25V6.25A0.75 0.75 0 0 1 7.82 5.52L14.82 3.77A0.75 0.75 0 0 1 15.75 4.5V12.25"
          ]
        },
        "24": {
          "fill": [
            "M2.5 17.5A3.5 3.5 0 1 1 9.5 17.5A3.5 3.5 0 1 1 2.5 17.5Z",
            "M13.5 14.75A3.5 3.5 0 1 1 20.5 14.75A3.5 3.5 0 1 1 13.5 14.75Z"
          ],
          "stroke": [
            "M8.75 17.5V6.88A0.75 0.75 0 0 1 9.32 6.15L18.82 3.77A0.75 0.75 0 0 1 19.75 4.5V14.75"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Eighth note with a flag",
      "tags": [
        "single",
        "eighth",
        "flag"
      ],
      "note": "Rhythm and balance: one head, outer diameter 8 · 6 · 5 (ring r 3.25 · 2.25 · 1.875, hole 5 · 3 · 2.5), a stem touching its right side and a straight flag leaving the stem top at 45 degrees, running 5 · 4 · 3 to the right (28 · 29 · 25% of the height). Corner at the stem top r 0.75 · 0.75 · 0.625 (C10). Ink 13x18 · 10x14 · 8x12, declared as an agreed box (a narrow note matches no keyline), box-centred. Measured mass sits low and left (outline -0.44, +0.76 · -0.40, +0.47 · -0.24, +0.48; filled -0.97, +1.84 at 24), so the optical sheet should try it a little right and up. Who draws it: SF Symbols music.note, Material music_note (block flag), Lucide music-2 (sloped flag), Phosphor MusicNote. Filled: head solid, stem and flag stay lines. Off-grid decimals are the tangent points where the corner arcs meet the 45-degree flag; arc centres, stem lines, head centres and radii sit on the grid.",
      "box": {
        "16": [
          8,
          12
        ],
        "20": [
          10,
          14
        ],
        "24": [
          13,
          18
        ]
      },
      "masters": {
        "16": [
          "M8.375 11.5V3.25A0.625 0.625 0 0 1 9.442 2.808L11.375 4.741",
          "M4.625 11.5A1.875 1.875 0 1 1 8.375 11.5A1.875 1.875 0 1 1 4.625 11.5Z"
        ],
        "20": [
          "M10.25 14V4.5A0.75 0.75 0 0 1 11.53 3.97L14.25 6.69",
          "M5.75 14A2.25 2.25 0 1 1 10.25 14A2.25 2.25 0 1 1 5.75 14Z"
        ],
        "24": [
          "M12.75 17V4.5A0.75 0.75 0 0 1 14.03 3.97L17.75 7.69",
          "M6.25 17A3.25 3.25 0 1 1 12.75 17A3.25 3.25 0 1 1 6.25 17Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4 11.5A2.5 2.5 0 1 1 9 11.5A2.5 2.5 0 1 1 4 11.5Z"
          ],
          "stroke": [
            "M8.375 11.5V3.25A0.625 0.625 0 0 1 9.442 2.808L11.375 4.741"
          ]
        },
        "20": {
          "fill": [
            "M5 14A3 3 0 1 1 11 14A3 3 0 1 1 5 14Z"
          ],
          "stroke": [
            "M10.25 14V4.5A0.75 0.75 0 0 1 11.53 3.97L14.25 6.69"
          ]
        },
        "24": {
          "fill": [
            "M5.5 17A4 4 0 1 1 13.5 17A4 4 0 1 1 5.5 17Z"
          ],
          "stroke": [
            "M12.75 17V4.5A0.75 0.75 0 0 1 14.03 3.97L17.75 7.69"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Piano keys",
      "tags": [
        "piano",
        "keys",
        "instrument"
      ],
      "note": "Rhythm and balance: three white keys of equal width 4 · 2.75/2.5/2.75 · 2.375/2.25/2.375 (whole widths are not on the grid at 20 and 16) between dividers at the outline weight, under two solid black keys 3 · 3 · 2.5 wide and 10.5 · 8.25 · 7 long, about 60% of the inside height. Each black key is one closed path no wider than the line, so it reads solid (a key, like calculator's tall key). That gives 2× · 2× · 2× the divider's width, which is what makes them read as black keys and not as more lines at 16. Air between the black keys 2.5 · 1.5 · 1.5; black key to the frame 3.25 · 1.75 · 1.5. At 20 and 16 the black keys sit 0.25 outward from their dividers, as a real piano's do (C sharp leans left, D sharp right), so the white keys can stay equal. Container: the square keyline 18 · 14 · 12, corner r 2.5 · 2 · 1.5, keyboard's container radius. Box-centred; symmetric, so no shift. Filled: keyboard-filled's build, a solid square with the keys cut out as white (key slots 3 · 3 · 2.5, divider cuts 1.5 at every master, C22); the material between the two key slots is 2.5 · 1.5 · 1.5. The cost: the filled twin shows the black keys as white, so it reads as inverted, and at 16 its two white slots come close to a pause in a box. Who draws it: SF Symbols pianokeys, Material piano (solid black keys, frame, dividers: our outline), Phosphor PianoKeys (fill: knockout). Not a row on the sheet; keyboard is the computer keyboard.",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M5.375 2.625V8.375H6.625V2.625Z",
          "M6.25 8.375V13.375",
          "M9.375 2.625V8.375H10.625V2.625Z",
          "M9.75 8.375V13.375"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M7 3.75V10.5H8.5V3.75Z",
          "M8 10.5V16.25",
          "M11.5 3.75V10.5H13V3.75Z",
          "M12 10.5V16.25"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M8.5 3.75V12.75H10V3.75Z",
          "M9.25 12.75V20.25",
          "M14 3.75V12.75H15.5V3.75Z",
          "M14.75 12.75V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.125 2H11.875A2.125 2.125 0 0 1 14 4.125V11.875A2.125 2.125 0 0 1 11.875 14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2ZM4.75 3.25H7.25V8.75A0.25 0.25 0 0 1 7 9H7V12A0.75 0.75 0 0 1 5.5 12V9H5A0.25 0.25 0 0 1 4.75 8.75ZM8.75 3.25H11.25V8.75A0.25 0.25 0 0 1 11 9H10.5V12A0.75 0.75 0 0 1 9 12V9H9A0.25 0.25 0 0 1 8.75 8.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M5.75 3H14.25A2.75 2.75 0 0 1 17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3ZM6.25 4.5H9.25V10.75A0.5 0.5 0 0 1 8.75 11.25H8.75V14.75A0.75 0.75 0 0 1 7.25 14.75V11.25H6.75A0.5 0.5 0 0 1 6.25 10.75ZM10.75 4.5H13.75V10.75A0.5 0.5 0 0 1 13.25 11.25H12.75V14.75A0.75 0.75 0 0 1 11.25 14.75V11.25H11.25A0.5 0.5 0 0 1 10.75 10.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 3H17.75A3.25 3.25 0 0 1 21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3ZM7.75 4.5H10.75V12.75A0.75 0.75 0 0 1 10 13.5H10V18.75A0.75 0.75 0 0 1 8.5 18.75V13.5H8.5A0.75 0.75 0 0 1 7.75 12.75ZM13.25 4.5H16.25V12.75A0.75 0.75 0 0 1 15.5 13.5H15.5V18.75A0.75 0.75 0 0 1 14 18.75V13.5H14A0.75 0.75 0 0 1 13.25 12.75Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Waveform",
      "tags": [
        "waveform",
        "audio",
        "bars"
      ],
      "note": "Rhythm and balance: four bars on one even pitch, 5.5 · 4 · 3.5 (air 4 · 2.5 · 2.25 outline, 3 · 2 · 1.5 filled), centred on the middle line, ink heights 8, 18, 12, 6 · 6, 14, 9, 4.5 · 5.5, 12, 8, 4: the same 0.44 / 1 / 0.67 / 0.33 profile at every master. Four bars, not Lucide's six: at 20 and 16 the filled bars (2 wide) need 3.5 of pitch to keep 1.5 of air, and five or six bars do not fit the box at that pitch. Line-heavy, so the filled twin is the same bars at 2.5 · 2 · 2 with ends pulled in 0.5 · 0.25 · 0.375; the bars thicken in place (C17), declared as growth of 0.5 · 0.25 · 0.375 left and right. Ink 18x18 · 13.5x14 · 11.75x12 as an agreed box. Symmetric up and down; the tall bar sits left of the middle, so mass is 0.77 · 0.59 · 0.52 left of centre, to be checked on the optical sheet. The cost: at 16 no bar lands on whole pixels (centres 2.75 · 6.25 · 9.75 · 13.25), so the filled bars render grey-edged. Honest limit: this reads as audio or voice as much as music. Who draws it: Lucide audio-lines, SF Symbols waveform, Material graphic_eq, Phosphor Waveform. Not a row on the sheet.",
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
      "masters": {
        "16": [
          "M2.75 5.875V10.125",
          "M6.25 2.625V13.375",
          "M9.75 4.625V11.375",
          "M13.25 6.625V9.375"
        ],
        "20": [
          "M4 7.75V12.25",
          "M8 3.75V16.25",
          "M12 6.25V13.75",
          "M16 8.5V11.5"
        ],
        "24": [
          "M3.75 8.75V15.25",
          "M9.25 3.75V20.25",
          "M14.75 6.75V17.25",
          "M20.25 9.75V14.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.75 6.25V9.75",
            "M6.25 3V13",
            "M9.75 5V11",
            "M13.25 7V9"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 8V12",
            "M8 4V16",
            "M12 6.5V13.5",
            "M16 8.75V11.25"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 9.25V14.75",
            "M9.25 4.25V19.75",
            "M14.75 7.25V16.75",
            "M20.25 10.25V13.75"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Quarter note",
      "tags": [
        "single",
        "quarter",
        "plain"
      ],
      "note": "Rhythm and balance: a larger head than B's, outer diameter 9 · 7 · 6 (ring r 3.75 · 2.75 · 2.375, hole 6 · 4 · 3.5), half the note's height at every master, the stem touching its right side and rising to the top edge. Ink 9x18 · 7x14 · 6x12, agreed box, box-centred; at 16 the head's edges and the stem land on whole pixels. Made larger after review: the first draft was 5 px wide at 16 and the lightest mark on the board. Ink now 52 · 38 · 28 square units outline (A has 95 · 70 · 52), 80 · 51 · 37 filled, so it is still the lightest picture; a single note is a light mark in every set (Lucide music-3's head is 0.45 of its height; this one is 0.5). Mass low (+2.01 · +1.50 · +1.29 below centre) and right (+1.21 · +0.91 · +0.78), so the optical sheet should try it a little up and left. Who draws it: Lucide music-3. Filled: head solid, stem a line.",
      "box": {
        "16": [
          6,
          12
        ],
        "20": [
          7,
          14
        ],
        "24": [
          9,
          18
        ]
      },
      "masters": {
        "16": [
          "M10.375 11V2.625",
          "M5.625 11A2.375 2.375 0 1 1 10.375 11A2.375 2.375 0 1 1 5.625 11Z"
        ],
        "20": [
          "M12.75 13.5V3.75",
          "M7.25 13.5A2.75 2.75 0 1 1 12.75 13.5A2.75 2.75 0 1 1 7.25 13.5Z"
        ],
        "24": [
          "M15.75 16.5V3.75",
          "M8.25 16.5A3.75 3.75 0 1 1 15.75 16.5A3.75 3.75 0 1 1 8.25 16.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5 11A3 3 0 1 1 11 11A3 3 0 1 1 5 11Z"
          ],
          "stroke": [
            "M10.375 11V2.625"
          ]
        },
        "20": {
          "fill": [
            "M6.5 13.5A3.5 3.5 0 1 1 13.5 13.5A3.5 3.5 0 1 1 6.5 13.5Z"
          ],
          "stroke": [
            "M12.75 13.5V3.75"
          ]
        },
        "24": {
          "fill": [
            "M7.5 16.5A4.5 4.5 0 1 1 16.5 16.5A4.5 4.5 0 1 1 7.5 16.5Z"
          ],
          "stroke": [
            "M15.75 16.5V3.75"
          ]
        }
      }
    }
  ]
};
