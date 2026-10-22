// microscope: research and inspection. Round 2 — Maruti kept A (upright tube, Lucide's construction) and B (tilted tube, Tabler's) and asked for both refined; C, D, E dropped.
export default {
  "concept": "microscope",
  "question": "Which of two symbols reads as microscope?",
  "candidates": [
    {
      "id": "A",
      "label": "Upright tube, arm behind",
      "tags": [
        "microscope",
        "research",
        "science",
        "lab",
        "inspect",
        "analyse",
        "debug"
      ],
      "note": "Changed in round 2. Air down the stack (cap, tube, stage, base) is now one gap per master: 1.5 / 2 / 2 → 2 / 2 / 2 at 24; 1.5 / 1.75 / 1.75 → 1.5 / 1.5 / 1.5 at 20; 1.5 / 1.5 / 1.5 → 1.75 / 1.75 / 1.75 at 16. That is about a tenth of the ink height at every master (10% · 9.4% · 12.5%). At 16, 1.75 instead of 1.5 is what lets every line land with a whole-pixel edge. With 1.5 the tube's bottom wall fell on x.875 and greyed the row, closing the tube's hole in Chrome at 1x. Tube 7x10 → 7x9.5 · 6x6.5 → 5.5x7 · 5x5.75 → 4.5x5 outer: its width stays 35% · 34% · 32% of the ink, and at 16 its walls move from x.125/x.875 (half-pixel blur) onto x.375/x.625. Eyepiece cap 2.5 · 2 · 1.5 → 4 · 2.5 · 2 long, now exactly the tube's centreline width, so its ends sit over the walls (at 16 the old cap read as a dot). Stage now overhangs the tube by 1.5 each side at every master (it was 1.5 · 1 · 0.875). Arm leaves the tube one gap below its top at every master (was 1.5 · 1.5 · 1.25) on radius 7 · 5 · 4.375 → 6.5 · 5 · 4, so its diameter stays 1.8–1.9 times the tube's width. Kept: ink 20x20 · 16x16 · 14x14 on the circle keyline, centred exactly; arm tangent on the base, its right side on the box edge; every value on the quarter / eighth grid. Measured: tightest air 2 · 1.5 · 1.75; mass centre 12.11,14.06 · 9.94,11.73 · 8.19,9.73 (the low centre is the base, as with terminal and puzzle); ink 20.5% · 22.4% · 23.8% of the canvas (bug 24.4%, wrench 16.3% at 24). Filled: the tube fills, the lines stay 1.5 · 1.5 · 1.25; ink 24.9% at 24, beside wrench-filled 25.0% and search-filled 20.8% (bug-filled 36.3%: its body is one shape). Lucide, Phosphor, Font Awesome, Fluent (recommended)",
      "masters": {
        "16": [
          "M5.375 4.625L6.625 4.625A1 1 0 0 1 7.625 5.625L7.625 7.375A1 1 0 0 1 6.625 8.375L5.375 8.375A1 1 0 0 1 4.375 7.375L4.375 5.625A1 1 0 0 1 5.375 4.625Z",
          "M5 1.625H7",
          "M7.625 6.375H10.375A4 4 0 0 1 10.375 14.375",
          "M2.875 11.375H9.125",
          "M1.625 14.375H14.375"
        ],
        "20": [
          "M6.5 5.75L8 5.75A1.25 1.25 0 0 1 9.25 7L9.25 10A1.25 1.25 0 0 1 8 11.25L6.5 11.25A1.25 1.25 0 0 1 5.25 10L5.25 7A1.25 1.25 0 0 1 6.5 5.75Z",
          "M6 2.75H8.5",
          "M9.25 7.25H12.25A5 5 0 0 1 12.25 17.25",
          "M3.75 14.25H10.75",
          "M2.75 17.25H17.25"
        ],
        "24": [
          "M7.75 6.25L10.25 6.25A1.5 1.5 0 0 1 11.75 7.75L11.75 12.75A1.5 1.5 0 0 1 10.25 14.25L7.75 14.25A1.5 1.5 0 0 1 6.25 12.75L6.25 7.75A1.5 1.5 0 0 1 7.75 6.25Z",
          "M7 2.75H11",
          "M11.75 8.25H14.75A6.5 6.5 0 0 1 14.75 21.25",
          "M4.75 17.75H13.25",
          "M2.75 21.25H21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.375 4L6.625 4A1.625 1.625 0 0 1 8.25 5.625L8.25 7.375A1.625 1.625 0 0 1 6.625 9L5.375 9A1.625 1.625 0 0 1 3.75 7.375L3.75 5.625A1.625 1.625 0 0 1 5.375 4Z"
          ],
          "stroke": [
            "M5 1.625H7",
            "M7.625 6.375H10.375A4 4 0 0 1 10.375 14.375",
            "M2.875 11.375H9.125",
            "M1.625 14.375H14.375"
          ]
        },
        "20": {
          "fill": [
            "M6.5 5L8 5A2 2 0 0 1 10 7L10 10A2 2 0 0 1 8 12L6.5 12A2 2 0 0 1 4.5 10L4.5 7A2 2 0 0 1 6.5 5Z"
          ],
          "stroke": [
            "M6 2.75H8.5",
            "M9.25 7.25H12.25A5 5 0 0 1 12.25 17.25",
            "M3.75 14.25H10.75",
            "M2.75 17.25H17.25"
          ]
        },
        "24": {
          "fill": [
            "M7.75 5.5L10.25 5.5A2.25 2.25 0 0 1 12.5 7.75L12.5 12.75A2.25 2.25 0 0 1 10.25 15L7.75 15A2.25 2.25 0 0 1 5.5 12.75L5.5 7.75A2.25 2.25 0 0 1 7.75 5.5Z"
          ],
          "stroke": [
            "M7 2.75H11",
            "M11.75 8.25H14.75A6.5 6.5 0 0 1 14.75 21.25",
            "M4.75 17.75H13.25",
            "M2.75 21.25H21.25"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Tilted tube, arm behind",
      "tags": [
        "microscope",
        "research",
        "science",
        "lab",
        "inspect",
        "analyse",
        "debug",
        "tilted"
      ],
      "note": "Changed in round 2. One gap along the tilted stack (cap to tube, objective tip to stage bar, bar to base): 1.68 / 2.5 / 2.5 → 2 / 2 / 2 at 24; 1.68 / ≥1.5 / 1.5 → 1.5 / 1.5 / 1.5 at 20; 1.58 / ≥1.5 / 1.5 → 1.5 / 1.5 / 1.5 at 16. Balance: the mass centre sat 2.4 · 2 · 1.8 right of the canvas centre, because the tube and arm are both on the right. The figure moved left 3 · 2.75 · 2.5 on the full-width base, and the mass centre is now 12.15 · 9.98 · 8.01 (canvas 12 · 10 · 8). The base now runs on 1.5 · 1 · 1.25 past the stage bar and 3 · 2.75 · 2.5 past the arm. Tube 5.74 · 5.04 · 4.43 → 7.16 · 5.39 · 4.43 across outside, the same widths as A's tube. Its length is now 1.43–1.46 times its width at every master (it was 1.74 · 1.46 · 1.48), so it reads as one shape shrinking. Eyepiece cap 2.83 · 2.12 · 1.77 → 4.16 · 2.39 · 1.93 long, again the tube's centreline width. Its right end now sits plumb over the arm's outer edge (ink x 19 · 15.25 · 12.5). The objective stub, drawn at 24 only in round 1, is back at every master (1.92 · 1.57 · 1.31 long), because the one-gap stack leaves room for it. The stage post moves onto a whole-pixel edge at 16 (x 4.625). Arm: I tried meeting the tube at the middle of its face (a smaller arc tangent to the base, inside both the old box and a 16-wide one). The arm shrank to a hook under a long tube, and the arm crossed the tube at 48–50°, so it read worse; that is not offered. The arm stays a big C from the base, radius 6 · 4.75 · 4 → 5.75 · 4.75 · 4.25. It now lands a quarter of the way down the face at every master, crossing the tube at 68 · 70 · 71°. Kept: ink 20x20 · 16x16 · 14x14 on the circle keyline, centred exactly. The tube's corner points, cap, objective and the arm's landing point fall off the quarter / eighth grid: they are where the 45-degree edges meet the corner radius and where the arm's circle meets the tube face. Measured: tightest air 2 · 1.5 · 1.5; ink 19.1% · 20.6% · 23.1%. Filled: the tube fills, the lines stay 1.5 · 1.5 · 1.25; ink 24.2% at 24. Tabler, Carbon, Remix",
      "masters": {
        "16": [
          "M5.967 8.368L5.132 7.533A1 1 0 0 1 5.132 6.118L7.415 3.835A1 1 0 0 1 8.83 3.835L9.665 4.67A1 1 0 0 1 9.665 6.085L7.382 8.368A1 1 0 0 1 5.967 8.368Z",
          "M10.509 1.625L11.875 2.991",
          "M5.549 7.951L4.625 8.875",
          "M7.625 14.375A4.25 4.25 0 0 0 9.459 6.291",
          "M2.875 11.625H6.375",
          "M4.625 11.625V14.375",
          "M1.625 14.375H14.375"
        ],
        "20": [
          "M7.6 10.63L6.62 9.65A1.25 1.25 0 0 1 6.62 7.88L9.28 5.22A1.25 1.25 0 0 1 11.04 5.22L12.03 6.21A1.25 1.25 0 0 1 12.03 7.97L9.37 10.63A1.25 1.25 0 0 1 7.6 10.63Z",
          "M12.81 2.75L14.5 4.44",
          "M7.11 10.14L6 11.25",
          "M9.75 17.25A4.75 4.75 0 0 0 11.79 8.21",
          "M3.75 14.25H7.75",
          "M5.75 14.25V17.25",
          "M2.75 17.25H17.25"
        ],
        "24": [
          "M9.05 13.83L7.17 11.95A1.5 1.5 0 0 1 7.17 9.83L11.24 5.76A1.5 1.5 0 0 1 13.37 5.76L15.24 7.63A1.5 1.5 0 0 1 15.24 9.76L11.17 13.83A1.5 1.5 0 0 1 9.05 13.83Z",
          "M15.31 2.75L18.25 5.69",
          "M8.11 12.89L6.75 14.25",
          "M12.5 21.25A5.75 5.75 0 0 0 14.78 10.22",
          "M4.25 17.75H9.25",
          "M6.75 17.75V21.25",
          "M2.75 21.25H21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.525 8.81L4.69 7.975A1.625 1.625 0 0 1 4.69 5.676L6.973 3.393A1.625 1.625 0 0 1 9.271 3.393L10.107 4.229A1.625 1.625 0 0 1 10.107 6.527L7.824 8.81A1.625 1.625 0 0 1 5.525 8.81Z"
          ],
          "stroke": [
            "M10.509 1.625L11.875 2.991",
            "M5.549 7.951L4.625 8.875",
            "M7.625 14.375A4.25 4.25 0 0 0 9.459 6.291",
            "M2.875 11.625H6.375",
            "M4.625 11.625V14.375",
            "M1.625 14.375H14.375"
          ]
        },
        "20": {
          "fill": [
            "M7.07 11.16L6.09 10.18A2 2 0 0 1 6.09 7.35L8.74 4.69A2 2 0 0 1 11.57 4.69L12.56 5.68A2 2 0 0 1 12.56 8.51L9.9 11.16A2 2 0 0 1 7.07 11.16Z"
          ],
          "stroke": [
            "M12.81 2.75L14.5 4.44",
            "M7.11 10.14L6 11.25",
            "M9.75 17.25A4.75 4.75 0 0 0 11.79 8.21",
            "M3.75 14.25H7.75",
            "M5.75 14.25V17.25",
            "M2.75 17.25H17.25"
          ]
        },
        "24": {
          "fill": [
            "M8.52 14.36L6.64 12.48A2.25 2.25 0 0 1 6.64 9.3L10.71 5.22A2.25 2.25 0 0 1 13.9 5.22L15.78 7.1A2.25 2.25 0 0 1 15.78 10.29L11.7 14.36A2.25 2.25 0 0 1 8.52 14.36Z"
          ],
          "stroke": [
            "M15.31 2.75L18.25 5.69",
            "M8.11 12.89L6.75 14.25",
            "M12.5 21.25A5.75 5.75 0 0 0 14.78 10.22",
            "M4.25 17.75H9.25",
            "M6.75 17.75V21.25",
            "M2.75 21.25H21.25"
          ]
        }
      }
    }
  ]
};
