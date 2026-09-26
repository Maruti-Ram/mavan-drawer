// language — the language picker (and translate), #92 Communication. It sits in footers, settings and account menus
// beside globe, so what Maruti picks here is which sign says "language" rather than "world": the two scripts as a pair
// (A B C D — the convention: Lucide and Nucleo draw 文 top-left and A bottom-right, Polaris puts both in a bubble), the
// character alone (E F), a letter in a speech bubble (G), or the globe reused (H J) or joined by an A (I). What the rules
// forced, measured in scratchpad/language/gen.mjs: (1) the A's counter holds 1.5 (C23) at the filled weight too, so to
// keep 1 or more of leg under its filled crossbar the A is 11x9 · 9.5x7.7 · 9.25x7.5 (60°), and its filled crossbar sits
// low; (2) beside that A there is no room to hang the 文's legs from its bar (hung, the triangle under the bar holds 1.5
// only with the legs 3.3 or more from the middle, 7.9 of width at 16), so in the pairs the 撇 and 捺 start 1.5 below the
// bar — 亠 over 乂, all four strokes kept; the 文 alone (E F) keeps the true construction. Dropped: 文 in a bubble (at 16
// its 乂 is 3.4 tall and 4 wide and clogs in real pixels); each character in its own bubble (one A with its 1.5 counter
// fills message-5's whole ring at 16 with exactly 1.5 of air — G — so two bubbles cannot fit); A and 文 level on a
// baseline (at 16 the filled A alone is 9.25 of the 14 wide); an A with a translation arrow (C16's composite head is 8
// wide at 16); あ (not drawn — its loop and three crossings need more counters than 文's; [needs measuring]). Angles:
// 0/45/90 plus 60 for the A (foundations §3, justified in each note); C's 63.43° needs an exception. All ten are
// box-centred and pass tools/draft-check.mjs with no warnings.

export default {
  "concept": "language",
  "context": "Communication",
  "family": [
    "globe",
    "globe-2",
    "text",
    "message-5",
    "at-sign"
  ],
  "question": "Which sign says \"language\" at 16 beside globe and text: 文 and A as a pair — brush 文 (D, recommended), straight (A), mirrored with the A first (B) or with a steeper A that needs an angle exception (C); 文 alone (E straight, F brush); an A in a round bubble (G); the globe reused as it stands (H, J); or a globe with an A (I)?",
  "candidates": [
    {
      "id": "A",
      "label": "Wen and A",
      "tags": [
        "translate",
        "wen",
        "latin",
        "cjk",
        "diagonal"
      ],
      "note": "文 top-left, A bottom-right on the circle keyline (20x20 · 16x16 · 14x14), the arrangement Lucide and Nucleo share. The 文 is dot, bar and 乂: the dot stands on the bar (one path), the bar is 11.5 · 8 · 6.5 wide, the dot shows 2 · 1.75 · 1.75 above it; the 撇 and 捺 cross at 45° and start 1.5 below the bar instead of hanging from it (simplified: hung from the bar, the triangle between bar and crossing measures under 1.5 unless the legs start 3.3 or more from the middle, which makes the 文 7.9 wide at 16 and leaves no room for the A); upper arms 2 · 1.5 · 1, lower arms 4 · 2.75 · 1.75 on each axis (filled 1.75 · 1.25 · 0.75 and 3.25 · 2.25 · 2, the 捺 1.25 at 16 to clear the A). The A: legs at 60° (foundations §3 allows 60° when the subject needs it — a 45° A is twice as wide as tall and reads as a caret), C10 bend at the apex (0.75 · 0.75 · 0.625), ink 11x8.98 · 9.5x7.68 · 9.25x7.55; crossbar on the highest line that leaves the counter 1.5 across (1.65 · 1.62 · 1.54). Filled: line-heavy, 2.5 · 2 · 2; the A keeps its leg angle, its feet pull in by half the added weight so the box holds exactly, and its apex, which no edge of the box rests on, sits 0.37 · 0.17 · 0.27 lower; the crossbar drops to the highest line that keeps the counter at 1.5 (filled counter 1.57 · 1.66 · 1.52, crossbar-to-foot 1.25 · 1 · 1). Smallest gaps: bar to 乂 1.5 at every master, 文 to A 2.25 · 1.68 · 1.82 (filled 1.83 · 1.7 · 1.71). Angles 0/45/90 and 60. At 16 the 文 is 6.5x8.5 and its 乂 is the smallest thing in it: it reads in real pixels, filled it thickens toward a blot. Off-grid values: the apex bend's two tangent points and the crossbar's two ends, which sit on the sloping legs by construction.",
      "masters": {
        "16": [
          "M1.625 3.375H6.875M4.25 1.625V3.375",
          "M5.25 6.125L2.5 8.875",
          "M3.25 6.125L6 8.875",
          "M6.375 14.375L9.834 8.384A0.625 0.625 0 0 1 10.916 8.384L14.375 14.375",
          "M7.963 11.625H12.787"
        ],
        "20": [
          "M2.75 4.5H9.25M6 2.75V4.5",
          "M7.5 7.5L3.25 11.75",
          "M4.5 7.5L8.75 11.75",
          "M9.25 17.25L12.6 11.45A0.75 0.75 0 0 1 13.9 11.45L17.25 17.25",
          "M10.55 15H15.95"
        ],
        "24": [
          "M2.75 4.75H12.75M7.75 2.75V4.75",
          "M9.75 7.75L3.75 13.75",
          "M5.75 7.75L11.75 13.75",
          "M11.75 21.25L15.85 14.15A0.75 0.75 0 0 1 17.15 14.15L21.25 21.25",
          "M13.77 17.75H19.23"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2 3.25H6.5M4.25 2V3.25",
            "M5 6.75L2.25 9.5",
            "M3.5 6.75L5.5 8.75",
            "M6.75 14L9.509 9.221A1 1 0 0 1 11.241 9.221L14 14",
            "M7.327 13H13.423"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3 4.75H9M6 3V4.75",
            "M7.25 8.25L3.75 11.75",
            "M4.75 8.25L8.25 11.75",
            "M9.5 17L12.38 12A1 1 0 0 1 14.12 12L17 17",
            "M10.08 16H16.42"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.25 5.25H12.25M7.75 3.25V5.25",
            "M9.5 9.25L4.5 14.25",
            "M6 9.25L11 14.25",
            "M12.25 20.75L15.42 15.26A1.25 1.25 0 0 1 17.58 15.26L20.75 20.75",
            "M12.97 19.5H20.03"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "A and Wen",
      "tags": [
        "translate",
        "wen",
        "latin",
        "cjk",
        "diagonal"
      ],
      "note": "A's drawing mirrored as a layout: A bottom-left, 文 top-right, so a left-to-right reader meets the A first. The 文 itself is not mirrored (the 撇 still falls left); at 16 filled its 撇 is the short leg (1.25) and the 捺 the long one (2), which is closer to the printed character. Every number as A: ink 20x20 · 16x16 · 14x14, A at 60°, counters 1.65 · 1.62 · 1.54 (filled 1.57 · 1.66 · 1.52), 文 to A 2.25 · 1.68 · 1.82. The references all put 文 first; this reads less like the familiar translate sign. Angles 0/45/90 and 60. Off-grid values: the apex bend's two tangent points and the crossbar's two ends, which sit on the sloping legs by construction.",
      "masters": {
        "16": [
          "M9.125 3.375H14.375M11.75 1.625V3.375",
          "M12.75 6.125L10 8.875",
          "M10.75 6.125L13.5 8.875",
          "M1.625 14.375L5.084 8.384A0.625 0.625 0 0 1 6.166 8.384L9.625 14.375",
          "M3.213 11.625H8.037"
        ],
        "20": [
          "M10.75 4.5H17.25M14 2.75V4.5",
          "M15.5 7.5L11.25 11.75",
          "M12.5 7.5L16.75 11.75",
          "M2.75 17.25L6.1 11.45A0.75 0.75 0 0 1 7.4 11.45L10.75 17.25",
          "M4.05 15H9.45"
        ],
        "24": [
          "M11.25 4.75H21.25M16.25 2.75V4.75",
          "M18.25 7.75L12.25 13.75",
          "M14.25 7.75L20.25 13.75",
          "M2.75 21.25L6.85 14.15A0.75 0.75 0 0 1 8.15 14.15L12.25 21.25",
          "M4.77 17.75H10.23"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M9.5 3.25H14M11.75 2V3.25",
            "M12.5 6.75L10.5 8.75",
            "M11 6.75L13.75 9.5",
            "M2 14L4.759 9.221A1 1 0 0 1 6.491 9.221L9.25 14",
            "M2.577 13H8.673"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M11 4.75H17M14 3V4.75",
            "M15.25 8.25L11.75 11.75",
            "M12.75 8.25L16.25 11.75",
            "M3 17L5.88 12A1 1 0 0 1 7.62 12L10.5 17",
            "M3.58 16H9.92"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M11.75 5.25H20.75M16.25 3.25V5.25",
            "M18 9.25L13 14.25",
            "M14.5 9.25L19.5 14.25",
            "M3.25 20.75L6.42 15.26A1.25 1.25 0 0 1 8.58 15.26L11.75 20.75",
            "M3.97 19.5H11.03"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Steep A",
      "tags": [
        "translate",
        "wen",
        "latin",
        "cjk",
        "diagonal",
        "steep"
      ],
      "note": "As A with the A's legs at 63.43° (a 1:2 slope), the angle of Lucide's A: narrower (ink 10x9.07 · 8.5x7.57 · 8.75x7.98), so it reads as a Latin capital rather than a wide delta and the 文 gets the room (12 · 8.5 · 6.75 wide). NEEDS AN ANGLE EXCEPTION: 63.43° is neither 45 nor 60 (foundations §3) and is Maruti's to approve. Counters 1.59 · 1.59 · 1.53 (filled 1.52 · 1.55 · 1.55, crossbar-to-foot 1 · 0.75 · 1); 文 to A 2.19 · 1.74 · 1.88 (filled 1.86 · 1.8 · 1.8). The 文 is A's construction (dot on the bar, 乂 1.5 below it), 0.25 to 0.5 wider; at 16 its 捺 is 1.75 (filled 1.25) against the 撇's 2. Filled: line-heavy, the A keeps 63.43°. Angles 0/45/90 and 63.43. Off-grid values: the apex bend's two tangent points and the crossbar's two ends, which sit on the sloping legs by construction.",
      "masters": {
        "16": [
          "M1.625 3.375H7.125M4.375 1.625V3.375",
          "M5.375 6.125L2.375 9.125",
          "M3.375 6.125L6.125 8.875",
          "M6.875 14.375L10.066 7.993A0.625 0.625 0 0 1 11.184 7.993L14.375 14.375",
          "M8.375 11.375H12.875"
        ],
        "20": [
          "M2.75 4.5H9.75M6.25 2.75V4.5",
          "M7.75 7.5L3.25 12",
          "M4.75 7.5L9.25 12",
          "M10.25 17.25L13.08 11.59A0.75 0.75 0 0 1 14.42 11.59L17.25 17.25",
          "M11.25 15.25H16.25"
        ],
        "24": [
          "M2.75 4.75H13.25M8 2.75V4.75",
          "M10 7.75L3.75 14",
          "M6 7.75L12.25 14",
          "M12.75 21.25L16.33 14.09A0.75 0.75 0 0 1 17.67 14.09L21.25 21.25",
          "M14.5 17.75H19.5"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2 3.25H6.75M4.375 2V3.25",
            "M5.125 6.75L2.375 9.5",
            "M3.625 6.75L5.625 8.75",
            "M7.25 14L9.731 9.039A1 1 0 0 1 11.519 9.039L14 14",
            "M7.75 13H13.5"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3 4.75H9.5M6.25 3V4.75",
            "M7.5 8.25L3.75 12",
            "M5 8.25L8.75 12",
            "M10.5 17L12.86 12.29A1 1 0 0 1 14.64 12.29L17 17",
            "M10.88 16.25H16.63"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.25 5.25H12.75M8 3.25V5.25",
            "M9.75 9.25L4.5 14.5",
            "M6.25 9.25L11.5 14.5",
            "M13.25 20.75L15.88 15.49A1.25 1.25 0 0 1 18.12 15.49L20.75 20.75",
            "M13.75 19.75H20.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Brush Wen",
      "tags": [
        "translate",
        "wen",
        "latin",
        "cjk",
        "diagonal",
        "brush"
      ],
      "note": "As A with the 撇 and 捺 drawn as brush strokes: each is a shallow arc (sagitta 1 · 0.75 · 0.5), the 撇 bowing to the lower right and the 捺 to the lower left, so the legs start steep under the bar and flatten into the feet the way the written character does. Same ends, same crossing, same A (60°, counters 1.65 · 1.62 · 1.54, filled 1.57 · 1.66 · 1.52), same gaps (bar to 乂 1.5, 文 to A 2.25 · 1.68 · 1.82). Keeps the pair everyone reads as translate, and the curve is what makes the 文 a character rather than an x under a lid; at 16 it is as legible as A and no worse (recommended). The 文 is dot, bar and 乂: the dot stands on the bar (one path), the bar is 11.5 · 8 · 6.5 wide, the dot shows 2 · 1.75 · 1.75 above it; the 撇 and 捺 cross at 45° and start 1.5 below the bar instead of hanging from it (simplified: hung from the bar, the triangle between bar and crossing measures under 1.5 unless the legs start 3.3 or more from the middle, which makes the 文 7.9 wide at 16 and leaves no room for the A); upper arms 2 · 1.5 · 1, lower arms 4 · 2.75 · 1.75 on each axis (filled 1.75 · 1.25 · 0.75 and 3.25 · 2.25 · 2, the 捺 1.25 at 16 to clear the A). Filled: line-heavy, 2.5 · 2 · 2; the A keeps its leg angle, its feet pull in by half the added weight so the box holds exactly, and its apex, which no edge of the box rests on, sits 0.37 · 0.17 · 0.27 lower; the crossbar drops to the highest line that keeps the counter at 1.5 (filled counter 1.57 · 1.66 · 1.52, crossbar-to-foot 1.25 · 1 · 1). Angles 0/90, arcs, and the A at 60. Off-grid values: the arcs' radii (set by the sagitta) and the A's apex tangent points and crossbar ends on the 60° legs.",
      "masters": {
        "16": [
          "M1.625 3.375H6.875M4.25 1.625V3.375",
          "M5.25 6.125A4.031 4.031 0 0 1 2.5 8.875",
          "M3.25 6.125A4.031 4.031 0 0 0 6 8.875",
          "M6.375 14.375L9.834 8.384A0.625 0.625 0 0 1 10.916 8.384L14.375 14.375",
          "M7.963 11.625H12.787"
        ],
        "20": [
          "M2.75 4.5H9.25M6 2.75V4.5",
          "M7.5 7.5A6.4 6.4 0 0 1 3.25 11.75",
          "M4.5 7.5A6.4 6.4 0 0 0 8.75 11.75",
          "M9.25 17.25L12.6 11.45A0.75 0.75 0 0 1 13.9 11.45L17.25 17.25",
          "M10.55 15H15.95"
        ],
        "24": [
          "M2.75 4.75H12.75M7.75 2.75V4.75",
          "M9.75 7.75A9.5 9.5 0 0 1 3.75 13.75",
          "M5.75 7.75A9.5 9.5 0 0 0 11.75 13.75",
          "M11.75 21.25L15.85 14.15A0.75 0.75 0 0 1 17.15 14.15L21.25 21.25",
          "M13.77 17.75H19.23"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2 3.25H6.5M4.25 2V3.25",
            "M5 6.75A4.031 4.031 0 0 1 2.25 9.5",
            "M3.5 6.75A2.25 2.25 0 0 0 5.5 8.75",
            "M6.75 14L9.509 9.221A1 1 0 0 1 11.241 9.221L14 14",
            "M7.327 13H13.423"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3 4.75H9M6 3V4.75",
            "M7.25 8.25A4.46 4.46 0 0 1 3.75 11.75",
            "M4.75 8.25A4.46 4.46 0 0 0 8.25 11.75",
            "M9.5 17L12.38 12A1 1 0 0 1 14.12 12L17 17",
            "M10.08 16H16.42"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.25 5.25H12.25M7.75 3.25V5.25",
            "M9.5 9.25A6.75 6.75 0 0 1 4.5 14.25",
            "M6 9.25A6.75 6.75 0 0 0 11 14.25",
            "M12.25 20.75L15.42 15.26A1.25 1.25 0 0 1 17.58 15.26L20.75 20.75",
            "M12.97 19.5H20.03"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Wen alone",
      "tags": [
        "translate",
        "wen",
        "cjk",
        "character"
      ],
      "note": "文 alone, full size in the square keyline (18 · 14 · 12), built as the printed character is: the dot stands on the bar and both legs hang from the bar, here at 45°, crossing below it. The triangle between bar and crossing is a counter and holds 1.5 (3.26 · 2.02 · 1.55; filled 1.84 · 1.52 · 1.52), which is what sets how far from the middle the legs start (5.75 · 4.25 · 3.375, filled 5.25 · 4.25 · 4.25) — wider-shouldered than the printed character, whose legs start nearer the middle. Dot 2.5 · 2 · 2 above the bar; feet under the bar's ends. Filled: line-heavy, 2.5 · 2 · 2, box identical. The truest character of the ten and the strongest at 16, but one script only: to many readers it says Chinese text rather than language. Angles 0/45/90. No off-grid values.",
      "masters": {
        "16": [
          "M2.625 4.625H13.375M8 2.625V4.625",
          "M11.375 4.625L2.625 13.375",
          "M4.625 4.625L13.375 13.375"
        ],
        "20": [
          "M3.75 5.75H16.25M10 3.75V5.75",
          "M14.25 5.75L3.75 16.25",
          "M5.75 5.75L16.25 16.25"
        ],
        "24": [
          "M3.75 6.25H20.25M12 3.75V6.25",
          "M17.75 6.25L3.75 20.25",
          "M6.25 6.25L20.25 20.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M3 5H13M8 3V5",
            "M12.25 5L4.25 13",
            "M3.75 5L11.75 13"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 6H16M10 4V6",
            "M14.25 6L4.25 16",
            "M5.75 6L15.75 16"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M4.25 6.75H19.75M12 4.25V6.75",
            "M17.25 6.75L4.25 19.75",
            "M6.75 6.75L19.75 19.75"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Brush Wen alone",
      "tags": [
        "translate",
        "wen",
        "cjk",
        "character",
        "brush"
      ],
      "note": "E with brush legs: the 撇 and 捺 hang from the bar as shallow arcs (sagitta 1 · 0.75 · 0.75), and because the curve opens the counter under the bar (2.54 · 2.04 · 1.99; filled 1.51 · 1.57 · 1.56) the legs can start nearer the middle (3.5 · 3.25 · 3 from it), as in print. Same bar, dot, feet and square keyline as E (18 · 14 · 12). The best-drawn 文 of the ten; same caveat as E (one script). Filled: line-heavy, box identical. Angles 0/90 and arcs. Off-grid values: the arcs' radii.",
      "masters": {
        "16": [
          "M2.625 4.625H13.375M8 2.625V4.625",
          "M11 4.625A24.826 24.826 0 0 1 2.625 13.375",
          "M5 4.625A24.826 24.826 0 0 0 13.375 13.375"
        ],
        "20": [
          "M3.75 5.75H16.25M10 3.75V5.75",
          "M13.25 5.75A33.79 33.79 0 0 1 3.75 16.25",
          "M6.75 5.75A33.79 33.79 0 0 0 16.25 16.25"
        ],
        "24": [
          "M3.75 6.25H20.25M12 3.75V6.25",
          "M15.5 6.25A42.26 42.26 0 0 1 3.75 20.25",
          "M8.5 6.25A42.26 42.26 0 0 0 20.25 20.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M3 5H13M8 3V5",
            "M11 5A18.635 18.635 0 0 1 4.25 13",
            "M5 5A18.635 18.635 0 0 0 11.75 13"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4 6H16M10 4V6",
            "M13.25 6A30.54 30.54 0 0 1 4.25 16",
            "M6.75 6A30.54 30.54 0 0 0 15.75 16"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M4.25 6.75H19.75M12 4.25V6.75",
            "M15.5 6.75A37.45 37.45 0 0 1 4.25 19.75",
            "M8.5 6.75A37.45 37.45 0 0 0 19.75 19.75"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "A in a bubble",
      "tags": [
        "translate",
        "latin",
        "bubble",
        "speech"
      ],
      "note": "An A in message-5's round bubble (shipped path, unchanged): circle keyline, the A centred in the bubble's round part at 24 and 20 and fitted to the circle at 16, where a 60° A with a 1.5 counter only fits apex-up against the top of the ring (it sits 1.06 above centre). A ink 11x8.98 · 8x6.38 · 7.75x6.25; air to the ring 1.71 · 1.66 · 1.5. Filled: the bubble solid (message-5-filled), the A punched as a 1.5 slot (message-4's cut), its counter left standing as a solid triangle 1.65 · 1.59 · 1.5 across; material from the slot to the bubble's edge 3.21 · 3.16 · 2.63. Says spoken language, but has no second script, and an A in a ring can be read as the anarchy sign — the tail is the only thing that says bubble. Why not 文 in the bubble, or each character in its own bubble: see the header. Angles 60 and the bubble's arcs. Off-grid values: the A's apex tangent points and crossbar ends on the 60° legs, and the slot's corners.",
      "masters": {
        "16": [
          "M2.625 11.428A6.375 6.375 0 1 1 4.572 13.375L3.25 13.375A0.625 0.625 0 0 1 2.625 12.75Z",
          "M4.75 9.375L7.459 4.683A0.625 0.625 0 0 1 8.541 4.683L11.25 9.375",
          "M5.4 8.25H10.6"
        ],
        "20": [
          "M3.5 13.21A7.25 7.25 0 1 1 6.79 16.5L4.25 16.5A0.75 0.75 0 0 1 3.5 15.75Z",
          "M6.75 12.5L9.35 8A0.75 0.75 0 0 1 10.65 8L13.25 12.5",
          "M7.33 11.5H12.67"
        ],
        "24": [
          "M3.75 16.18A9.25 9.25 0 1 1 7.82 20.25L4.5 20.25A0.75 0.75 0 0 1 3.75 19.5Z",
          "M7.25 15.75L11.35 8.65A0.75 0.75 0 0 1 12.65 8.65L16.75 15.75",
          "M9.27 12.25H14.73"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 11.606A7 7 0 1 1 4.394 14L3.25 14A1.25 1.25 0 0 1 2 12.75ZM4.1 9L6.701 4.496A1.5 1.5 0 0 1 9.299 4.496L11.9 9A0.75 0.75 0 0 1 10.6 9.75L10.167 9H5.833L5.4 9.75A0.75 0.75 0 0 1 4.1 9ZM8 5.246L9.301 7.5H6.699Z"
          ]
        },
        "20": {
          "fill": [
            "M2.75 13.38A8 8 0 1 1 6.62 17.25L4.25 17.25A1.5 1.5 0 0 1 2.75 15.75ZM6.1 12.13L8.7 7.62A1.5 1.5 0 0 1 11.3 7.62L13.9 12.13A0.75 0.75 0 0 1 12.6 12.88L12.24 12.25H7.76L7.4 12.88A0.75 0.75 0 0 1 6.1 12.13ZM10 8.37L11.37 10.75H8.63Z"
          ]
        },
        "24": {
          "fill": [
            "M3 16.36A10 10 0 1 1 7.64 21L4.5 21A1.5 1.5 0 0 1 3 19.5ZM6.6 15.38L10.7 8.27A1.5 1.5 0 0 1 13.3 8.27L17.4 15.38A0.75 0.75 0 0 1 16.1 16.13L14.3 13H9.7L7.9 16.13A0.75 0.75 0 0 1 6.6 15.38ZM12 9.02L13.43 11.5H10.57Z"
          ]
        }
      }
    },
    {
      "id": "H",
      "label": "Globe",
      "tags": [
        "translate",
        "globe",
        "world",
        "international"
      ],
      "note": "The shipped globe (equator and meridian), reused as it stands — all six files identical to globe. The web's most common language picker. It would ship as a second name for the same drawing (a search alias), not a new icon: nothing in it says language rather than world or region.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M8 1.625A2.5 6.375 0 1 0 8 14.375A2.5 6.375 0 1 0 8 1.625Z",
          "M1.625 8L14.375 8"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M10 2.75A3 7.25 0 1 0 10 17.25A3 7.25 0 1 0 10 2.75Z",
          "M2.75 10L17.25 10"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M12 2.75A3.75 9.25 0 1 0 12 21.25A3.75 9.25 0 1 0 12 2.75Z",
          "M2.75 12L21.25 12"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM8 1A3.38 7 0 0 1 11.35 7.13L14.95 7.13A7 7 0 0 1 14.95 8.88L11.35 8.88A3.38 7 0 0 1 8 15A3.38 7 0 0 1 4.65 8.88L1.05 8.88A7 7 0 0 1 1.05 7.13L4.65 7.13A3.38 7 0 0 1 8 1ZM9.6 7.13A1.62 5.37 0 0 0 6.4 7.13ZM9.6 8.88A1.62 5.37 0 0 1 6.4 8.88Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM10 2A3.88 8 0 0 1 13.86 9.13L17.95 9.13A8 8 0 0 1 17.95 10.88L13.86 10.88A3.88 8 0 0 1 10 18A3.88 8 0 0 1 6.14 10.88L2.05 10.88A8 8 0 0 1 2.05 9.13L6.14 9.13A3.88 8 0 0 1 10 2ZM12.1 9.13A2.12 6.37 0 0 0 7.9 9.13ZM12.1 10.88A2.12 6.37 0 0 1 7.9 10.88Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM12 2A4.75 10 0 0 1 16.73 11L21.95 11A10 10 0 0 1 21.95 13L16.73 13A4.75 10 0 0 1 12 22A4.75 10 0 0 1 7.27 13L2.05 13A10 10 0 0 1 2.05 11L7.27 11A4.75 10 0 0 1 12 2ZM14.73 11A2.75 8.25 0 0 0 9.27 11ZM14.73 13A2.75 8.25 0 0 1 9.27 13Z"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Globe and A",
      "tags": [
        "translate",
        "globe",
        "latin",
        "world"
      ],
      "note": "A small globe top-left and an A bottom-right, circle keyline. The globe is globe's construction at the smallest size its own gaps allow (ring 6.25 · 4.5 · 4.125, 14 · 10.5 · 9.5 of ink; meridian 2.5 · 1.5 · 1.375, the 20 and 16 meridians hold exactly 1.5 inside and out); the A at 60° (ink 10x8.11 · 8.5x6.81 · 7.75x6.25, counters 1.57 · 1.54 · 1.5). At 24 and 20 they clear each other (1.74 · 1.72); at 16 they cannot, so the ring opens from the equator's end to 64.5° in the lower right, 1.5 clear of the A (the ring stops at the equator rather than leave a stub below it). Filled: the globe solid in globe-filled's construction, its rim cut back along a line 1.5 clear of the A's leg at 16, the A a line at the outline weight (1.5 · 1.5 · 1.25). The globe at 20 and 16 is small enough that its meridian reads as a bar. Angles 0/90, 60 and arcs. Off-grid values: the ring's cut ends, the filled rim's cut points, the band's rim points and the A's apex and crossbar points.",
      "masters": {
        "16": [
          "M7.526 9.473A4.125 4.125 0 1 1 9.875 5.75",
          "M5.75 1.625A1.375 4.125 0 1 0 5.75 9.875A1.375 4.125 0 1 0 5.75 1.625Z",
          "M1.625 5.75H9.875",
          "M7.875 14.375L10.584 9.683A0.625 0.625 0 0 1 11.666 9.683L14.375 14.375",
          "M8.741 12.875H13.509"
        ],
        "20": [
          "M2.75 7.25A4.5 4.5 0 1 0 11.75 7.25A4.5 4.5 0 1 0 2.75 7.25Z",
          "M7.25 2.75A1.5 4.5 0 1 0 7.25 11.75A1.5 4.5 0 1 0 7.25 2.75Z",
          "M2.75 7.25H11.75",
          "M10.25 17.25L13.1 12.31A0.75 0.75 0 0 1 14.4 12.31L17.25 17.25",
          "M11.12 15.75H16.38"
        ],
        "24": [
          "M2.75 9A6.25 6.25 0 1 0 15.25 9A6.25 6.25 0 1 0 2.75 9Z",
          "M9 2.75A2.5 6.25 0 1 0 9 15.25A2.5 6.25 0 1 0 9 2.75Z",
          "M2.75 9H15.25",
          "M12.75 21.25L16.35 15.01A0.75 0.75 0 0 1 17.65 15.01L21.25 21.25",
          "M14.34 18.5H19.66"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.971 9.949A4.75 4.75 0 1 1 10.459 6.375L10.203 7.404ZM5.75 1A2 4.75 0 0 1 7.733 5.125L10.459 5.125A4.75 4.75 0 0 1 10.459 6.375L7.733 6.375A2 4.75 0 0 1 5.75 10.5A2 4.75 0 0 1 3.767 6.375L1.041 6.375A4.75 4.75 0 0 1 1.041 5.125L3.767 5.125A2 4.75 0 0 1 5.75 1ZM6.488 5.125A0.75 3.5 0 0 0 5.012 5.125ZM6.488 6.375A0.75 3.5 0 0 1 5.012 6.375Z"
          ],
          "stroke": [
            "M7.875 14.375L10.584 9.683A0.625 0.625 0 0 1 11.666 9.683L14.375 14.375",
            "M8.741 12.875H13.509"
          ]
        },
        "20": {
          "fill": [
            "M2 7.25A5.25 5.25 0 1 0 12.5 7.25A5.25 5.25 0 1 0 2 7.25ZM7.25 2A2.25 5.25 0 0 1 9.48 6.5L12.45 6.5A5.25 5.25 0 0 1 12.45 8L9.48 8A2.25 5.25 0 0 1 7.25 12.5A2.25 5.25 0 0 1 5.02 8L2.05 8A5.25 5.25 0 0 1 2.05 6.5L5.02 6.5A2.25 5.25 0 0 1 7.25 2ZM7.98 6.5A0.75 3.75 0 0 0 6.52 6.5ZM7.98 8A0.75 3.75 0 0 1 6.52 8Z"
          ],
          "stroke": [
            "M10.25 17.25L13.1 12.31A0.75 0.75 0 0 1 14.4 12.31L17.25 17.25",
            "M11.12 15.75H16.38"
          ]
        },
        "24": {
          "fill": [
            "M2 9A7 7 0 1 0 16 9A7 7 0 1 0 2 9ZM9 2A3.25 7 0 0 1 12.23 8.25L15.96 8.25A7 7 0 0 1 15.96 9.75L12.23 9.75A3.25 7 0 0 1 9 16A3.25 7 0 0 1 5.77 9.75L2.04 9.75A7 7 0 0 1 2.04 8.25L5.77 8.25A3.25 7 0 0 1 9 2ZM10.73 8.25A1.75 5.5 0 0 0 7.27 8.25ZM10.73 9.75A1.75 5.5 0 0 1 7.27 9.75Z"
          ],
          "stroke": [
            "M12.75 21.25L16.35 15.01A0.75 0.75 0 0 1 17.65 15.01L21.25 21.25",
            "M14.34 18.5H19.66"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Tilted globe",
      "tags": [
        "translate",
        "globe",
        "world",
        "international",
        "tilted"
      ],
      "note": "The shipped tilted globe (globe-2), reused as it stands — all six files identical to globe-2. As H: a second name for an existing drawing, not a new icon.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M8 1.625A2.5 6.375 0 1 0 8 14.375A2.5 6.375 0 1 0 8 1.625Z",
          "M8 5.5A6.375 2.5 0 1 0 8 10.5A6.375 2.5 0 1 0 8 5.5Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M10 2.75A3 7.25 0 1 0 10 17.25A3 7.25 0 1 0 10 2.75Z",
          "M10 7A7.25 3 0 1 0 10 13A7.25 3 0 1 0 10 7Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M12 2.75A3.75 9.25 0 1 0 12 21.25A3.75 9.25 0 1 0 12 2.75Z",
          "M12 8.25A9.25 3.75 0 1 0 12 15.75A9.25 3.75 0 1 0 12 8.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM8 1A3.38 7 0 0 1 11.04 4.96A7 3.38 0 0 1 11.04 11.04A3.38 7 0 0 1 8 15A3.38 7 0 0 1 4.96 11.04A7 3.38 0 0 1 4.96 4.96A3.38 7 0 0 1 8 1ZM9.55 6.45A1.62 5.37 0 0 1 9.55 9.55A5.37 1.62 0 0 1 6.45 9.55A1.62 5.37 0 0 1 6.45 6.45A5.37 1.62 0 0 1 9.55 6.45ZM9.27 4.68A1.62 5.37 0 0 0 6.73 4.68A7 3.38 0 0 1 9.27 4.68ZM9.27 11.32A1.62 5.37 0 0 1 6.73 11.32A7 3.38 0 0 0 9.27 11.32ZM4.68 6.73A5.37 1.62 0 0 0 4.68 9.27A3.38 7 0 0 1 4.68 6.73ZM11.32 6.73A5.37 1.62 0 0 1 11.32 9.27A3.38 7 0 0 0 11.32 6.73Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM10 2A3.88 8 0 0 1 13.49 6.51A8 3.88 0 0 1 13.49 13.49A3.88 8 0 0 1 10 18A3.88 8 0 0 1 6.51 13.49A8 3.88 0 0 1 6.51 6.51A3.88 8 0 0 1 10 2ZM12.01 7.99A2.12 6.37 0 0 1 12.01 12.01A6.37 2.12 0 0 1 7.99 12.01A2.12 6.37 0 0 1 7.99 7.99A6.37 2.12 0 0 1 12.01 7.99ZM11.7 6.21A2.12 6.37 0 0 0 8.3 6.21A8 3.88 0 0 1 11.7 6.21ZM11.7 13.79A2.12 6.37 0 0 1 8.3 13.79A8 3.88 0 0 0 11.7 13.79ZM6.21 8.3A6.37 2.12 0 0 0 6.21 11.7A3.88 8 0 0 1 6.21 8.3ZM13.79 8.3A6.37 2.12 0 0 1 13.79 11.7A3.88 8 0 0 0 13.79 8.3Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM12 2A4.75 10 0 0 1 16.29 7.71A10 4.75 0 0 1 16.29 16.29A4.75 10 0 0 1 12 22A4.75 10 0 0 1 7.71 16.29A10 4.75 0 0 1 7.71 7.71A4.75 10 0 0 1 12 2ZM14.61 9.39A2.75 8.25 0 0 1 14.61 14.61A8.25 2.75 0 0 1 9.39 14.61A2.75 8.25 0 0 1 9.39 9.39A8.25 2.75 0 0 1 14.61 9.39ZM14.28 7.37A2.75 8.25 0 0 0 9.72 7.37A10 4.75 0 0 1 14.28 7.37ZM14.28 16.63A2.75 8.25 0 0 1 9.72 16.63A10 4.75 0 0 0 14.28 16.63ZM7.37 9.72A8.25 2.75 0 0 0 7.37 14.28A4.75 10 0 0 1 7.37 9.72ZM16.63 9.72A8.25 2.75 0 0 1 16.63 14.28A4.75 10 0 0 0 16.63 9.72Z"
          ]
        }
      }
    }
  ]
};
