// pencil — the edit pencil, drawn as a batch of ten. A 45° body with a point at the lower-left and, usually, one band
// near the top; three masters, outline and filled, every number computed by a throwaway script and measured there.
// Why it matters: this body is a part. pencil-ruler, pen-tool, pen-sparkle, message-pen and the edit composites all carry
// a pencil into a corner at 16, so what is chosen here — the width of the body, the form of the point, whether a cap band
// survives at 16, and the corner radius at the end — is inherited by every one of them. The width is the load-bearing
// number: two 45° lines have to hold 1.5 of air at 16, which puts the floor at 2.75 on the centreline; A sits at 2.83
// (air 1.58) and its 24 and 20 keep the same third-of-the-box proportion. The point is a 90° corner with its edges on
// 0° and 90° (Material's and Tabler's construction), bent at C10's half-weight like cursor, so the tip lands on the
// box corner as two crisp pixel edges at 16. The ten: A classic with the band (recommended); B the band dropped at 16;
// C no band (a pen); D a half-round end; E a second line at the tip (Nucleo); F a wider body; G a 60° point (angle
// exception); H on the diagonal keyline 20 · 16 · 14; I with a baseline beside the point (pencil-line); J with C10 end
// corners. All but H fill the square keyline 18 · 14 · 12. Filled: the body offset half a stroke, one evenodd shape,
// bands cut as 1.5 slots of air (file-text-filled's), any baseline a stroke at the outline weight. The tip wedge as a
// separate closed shape was measured and dropped: a 3-unit wedge with C10 corners leaves a 0.31 counter at 24 —
// solid ink. A pen nib was not drawn: a slit and a hole cannot hold 1.5 in a 2.83-wide body at 16.

export default {
  "concept": "pencil",
  "context": "Edit",
  "family": [
    "cursor",
    "key",
    "link",
    "x",
    "file-text"
  ],
  "question": "Which pencil reads as edit at 16 beside cursor and key, outline and filled — square point with a cap band (A), band dropped at 16 (B), no band (C), round end (D), two bands (E), wider (F), sharp (G), on the diagonal keyline (H), with a baseline (I) or crisp corners (J) — and which body becomes the part that pencil-ruler, pen-sparkle and message-pen carry?",
  "candidates": [
    {
      "id": "A",
      "label": "Classic, band kept",
      "tags": [
        "edit",
        "write",
        "classic",
        "eraser",
        "square tip"
      ],
      "note": "The pencil every toolbar uses: a 45° body with a square-cut point at the lower-left and one band near the top for the eraser. Body 4.24 · 3.18 · 2.83 wide on the line (ink 5.74 · 4.68 · 4.08, air between the sides 2.74 · 1.68 · 1.58 — floor 1.5), tip vertex to end 22.09 · 16.82 · 14.37 on the centreline, ink 23.28 · 18.01 · 15.37 along the axis. Tip a 90° point with its edges on 0° and 90°, bent at C10's 0.75 · 0.75 · 0.625 (cursor's corners), so the ink corner sits at the box corner exactly, as x's diagonal ends do at 16 (endpoint 0.625 in on both axes). The cone from the sides to the point is 2.12 · 1.59 · 1.41 long along the axis. Eraser band 3.25 · 3.25 · 2.875 from the end (line to line), cell inside 1.75 · 1.75 · 1.63: 0.25 · 0.25 · 0.125 over the 1.5 floor. At 16 the band's cell is 1.625 of air and still reads as a cap. End corners at the detail radius 1.5 · 1.25 · 1 — file's fold radius. Filled: the body is one shape offset half a stroke outward (tip arc 1.5 · 1.5 · 1.25 like cursor-filled, end corners 2.25 · 2 · 1.625), and the band becomes a 1.5 · 1.5 · 1.5 cut of air straight across — file-text-filled's slot width, 0.25 wider than the 16 line so the two pieces keep §6's floor — leaving a solid cap 3.25 · 3.25 · 2.75 deep. Filled ink box == outline ink box (18×18 · 14×14 · 12×12), computed from the rounded paths with lint's own bbox. Ink box 18×18 · 14×14 · 12×12, on whole pixels, centred (the diagonal is lopsided on both axes; the box, not the ink mass, sits on the centre). Reusable: the 24 and 20 bodies carry the band into pencil-ruler and message-pen; at 16 a corner pencil must drop it (see C) (recommended)",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L11.082 2.918A1 1 0 0 1 12.496 2.918L13.082 3.504A1 1 0 0 1 13.082 4.918L4.625 13.375Z",
          "M9.756 4.244L11.756 6.244"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.63 4.12A1.25 1.25 0 0 1 15.4 4.12L15.88 4.6A1.25 1.25 0 0 1 15.88 6.37L6 16.25Z",
          "M12.22 5.53L14.47 7.78"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07A1.5 1.5 0 0 1 19.81 7.19L6.75 20.25Z",
          "M15.57 5.43L18.57 8.43"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L8.784 4.332L11.668 7.216L4.884 14ZM9.845 3.271L10.64 2.476A1.625 1.625 0 0 1 12.938 2.476L13.524 3.062A1.625 1.625 0 0 1 13.524 5.36L12.729 6.155Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L11.16 5.53L14.47 8.84L6.31 17ZM12.22 4.47L13.1 3.59A2 2 0 0 1 15.93 3.59L16.41 4.07A2 2 0 0 1 16.41 6.9L15.53 7.78Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L14.51 5.43L18.57 9.49L7.06 21ZM15.57 4.37L16.28 3.66A2.25 2.25 0 0 1 19.46 3.66L20.34 4.54A2.25 2.25 0 0 1 20.34 7.72L19.63 8.43Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "Classic, band dropped at 16",
      "tags": [
        "edit",
        "write",
        "classic",
        "eraser",
        "plain at 16"
      ],
      "note": "A at 24 and 20; at 16 the band goes and the pencil is the plain body (2.83 wide on the line, ink 4.08, 14.37 long). The rule's own answer to a 1.625 cell on a 4-unit-wide body: the detail goes, not the gap. Filled at 16 is one solid shape, no cut. Everything else as A, ink box 18×18 · 14×14 · 12×12. Look at it beside A in the 16 strip — the question is whether a cap band at 16 is information or noise",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L11.082 2.918A1 1 0 0 1 12.496 2.918L13.082 3.504A1 1 0 0 1 13.082 4.918L4.625 13.375Z"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.63 4.12A1.25 1.25 0 0 1 15.4 4.12L15.88 4.6A1.25 1.25 0 0 1 15.88 6.37L6 16.25Z",
          "M12.22 5.53L14.47 7.78"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07A1.5 1.5 0 0 1 19.81 7.19L6.75 20.25Z",
          "M15.57 5.43L18.57 8.43"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L10.64 2.476A1.625 1.625 0 0 1 12.938 2.476L13.524 3.062A1.625 1.625 0 0 1 13.524 5.36L4.884 14Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L11.16 5.53L14.47 8.84L6.31 17ZM12.22 4.47L13.1 3.59A2 2 0 0 1 15.93 3.59L16.41 4.07A2 2 0 0 1 16.41 6.9L15.53 7.78Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L14.51 5.43L18.57 9.49L7.06 21ZM15.57 4.37L16.28 3.66A2.25 2.25 0 0 1 19.46 3.66L20.34 4.54A2.25 2.25 0 0 1 20.34 7.72L19.63 8.43Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Pen, no band",
      "tags": [
        "edit",
        "pen",
        "plain",
        "minimal"
      ],
      "note": "The same body with no band at any master (Lucide's pen): one closed outline, 4.24 · 3.18 · 2.83 wide on the line, 22.09 · 16.82 · 14.37 long, the 90° point. Reads as edit before it reads as pencil. Filled: one solid shape, no cut. Ink box 18×18 · 14×14 · 12×12. This is the part that goes into composites — at 16 it is a 4.08-wide, 15.4-long rod that still reads at a third of the size",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L11.082 2.918A1 1 0 0 1 12.496 2.918L13.082 3.504A1 1 0 0 1 13.082 4.918L4.625 13.375Z"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.63 4.12A1.25 1.25 0 0 1 15.4 4.12L15.88 4.6A1.25 1.25 0 0 1 15.88 6.37L6 16.25Z"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07A1.5 1.5 0 0 1 19.81 7.19L6.75 20.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L10.64 2.476A1.625 1.625 0 0 1 12.938 2.476L13.524 3.062A1.625 1.625 0 0 1 13.524 5.36L4.884 14Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L13.1 3.59A2 2 0 0 1 15.93 3.59L16.41 4.07A2 2 0 0 1 16.41 6.9L6.31 17Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L16.28 3.66A2.25 2.25 0 0 1 19.46 3.66L20.34 4.54A2.25 2.25 0 0 1 20.34 7.72L7.06 21Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Round end",
      "tags": [
        "edit",
        "write",
        "round cap",
        "soft",
        "eraser"
      ],
      "note": "A's body with a half-round end instead of corners (radius w/2 = 2.12 · 1.59 · 1.42 on the line, 2.87 · 2.34 · 2.04 outer): Lucide's and Tabler's cap. Body 4.24 · 3.18 · 2.83 wide, 22.46 · 17.02 · 14.62 to the end on the centreline (0.37 · 0.2 · 0.25 longer than A because the round end reaches the box later). Band 3.25 · 3.25 · 2.875 from the end; at 16 the band's ends land on the semicircle's tangent points (band 2.875 from the end, radius 1.41), so the cell is a half-disc with a flat bottom — 1.625 tall on the axis. Filled as A, the cap piece a solid half-round. Ink box 18×18 · 14×14 · 12×12. Softer; the round end is the one thing that could read as a pen barrel rather than a pencil",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L10.961 3.039A1.414 1.414 0 0 1 12.961 3.039A1.414 1.414 0 0 1 12.961 5.039L4.625 13.375Z",
          "M9.928 4.072L11.928 6.072"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.53 4.22A1.59 1.59 0 0 1 15.78 4.22A1.59 1.59 0 0 1 15.78 6.47L6 16.25Z",
          "M12.36 5.39L14.61 7.64"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L16.63 4.37A2.12 2.12 0 0 1 19.63 4.37A2.12 2.12 0 0 1 19.63 7.37L6.75 20.25Z",
          "M15.83 5.17L18.83 8.17"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L8.956 4.161L11.839 7.044L4.884 14ZM10.016 3.1L10.519 2.597A2.039 2.039 0 0 1 13.403 2.597A2.039 2.039 0 0 1 13.403 5.481L12.9 5.984Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L11.3 5.39L14.61 8.7L6.31 17ZM12.36 4.33L13 3.69A2.34 2.34 0 0 1 16.31 3.69A2.34 2.34 0 0 1 16.31 7L15.67 7.64Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L14.77 5.17L18.83 9.23L7.06 21ZM15.83 4.11L16.1 3.84A2.87 2.87 0 0 1 20.16 3.84A2.87 2.87 0 0 1 20.16 7.9L19.89 8.17Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Ferrule at the tip",
      "tags": [
        "edit",
        "write",
        "pencil",
        "wood",
        "two bands"
      ],
      "note": "A plus a second line across the body 3.75 · 3.75 · 3.375 from the point (Nucleo's pencil): the wood cone read as a section. The counter it leaves at the tip holds a circle of 1.61 · 1.61 · 1.55 (floor 1.5, C23) — the line cannot come closer than 3.62 · 3.62 · 3.32 to the point, which is 1.6 · 2.2 · 2.0 past where the cone meets the sides, so the wood section is longer than the cone. Between the two lines 13.59 · 8.32 · 6.87 of body. Filled: two cuts, three solid pieces — tip 3.44 · 3.44 · 2.99 long along the axis, cap 3.25 · 3.25 · 2.75. Ink box 18×18 · 14×14 · 12×12. At 16 three pieces in 15.4 of length is the busiest drawing on the board; look at it in the strip before choosing it",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L11.082 2.918A1 1 0 0 1 12.496 2.918L13.082 3.504A1 1 0 0 1 13.082 4.918L4.625 13.375Z",
          "M9.756 4.244L11.756 6.244",
          "M4.011 9.989L6.011 11.989"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.63 4.12A1.25 1.25 0 0 1 15.4 4.12L15.88 4.6A1.25 1.25 0 0 1 15.88 6.37L6 16.25Z",
          "M12.22 5.53L14.47 7.78",
          "M5.28 12.47L7.53 14.72"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07A1.5 1.5 0 0 1 19.81 7.19L6.75 20.25Z",
          "M15.57 5.43L18.57 8.43",
          "M4.9 16.1L7.9 19.1"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L3.039 10.077L5.923 12.961L4.884 14ZM4.1 9.016L8.784 4.332L11.668 7.216L6.984 11.9ZM9.845 3.271L10.64 2.476A1.625 1.625 0 0 1 12.938 2.476L13.524 3.062A1.625 1.625 0 0 1 13.524 5.36L12.729 6.155Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L4.22 12.47L7.53 15.78L6.31 17ZM5.28 11.41L11.16 5.53L14.47 8.84L8.59 14.72ZM12.22 4.47L13.1 3.59A2 2 0 0 1 15.93 3.59L16.41 4.07A2 2 0 0 1 16.41 6.9L15.53 7.78Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L3.84 16.1L7.9 20.16L7.06 21ZM4.9 15.04L14.51 5.43L18.57 9.49L8.96 19.1ZM15.57 4.37L16.28 3.66A2.25 2.25 0 0 1 19.46 3.66L20.34 4.54A2.25 2.25 0 0 1 20.34 7.72L19.63 8.43Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "F",
      "label": "Wide body",
      "tags": [
        "edit",
        "write",
        "wide",
        "heavy",
        "eraser"
      ],
      "note": "A with a wider body: 4.95 · 3.54 · 3.18 on the line (ink 6.45 · 5.04 · 4.43 = 36% · 36% · 37% of the box against A's 32% · 33% · 34%), air 3.45 · 2.04 · 1.93. Cone 2.47 · 1.77 · 1.59, so the point is blunter; body 21.74 · 16.64 · 14.2 long. Band and corners as A, cell 1.75 · 1.75 · 1.63. Filled as A; the cap piece is 6.45 · 5.04 · 4.43 wide. Ink box 18×18 · 14×14 · 12×12. More pencil, less pen — heavier beside cursor and key",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.125L10.832 2.918A1 1 0 0 1 12.246 2.918L13.082 3.754A1 1 0 0 1 13.082 5.168L4.875 13.375Z",
          "M9.506 4.244L11.756 6.494"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 13.75L13.38 4.12A1.25 1.25 0 0 1 15.15 4.12L15.88 4.85A1.25 1.25 0 0 1 15.88 6.62L6.25 16.25Z",
          "M11.97 5.53L14.47 8.03"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 16.75L16.31 4.19A1.5 1.5 0 0 1 18.43 4.19L19.81 5.57A1.5 1.5 0 0 1 19.81 7.69L7.25 20.25Z",
          "M15.07 5.43L18.57 8.93"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 10.866L8.534 4.332L11.668 7.466L5.134 14ZM9.595 3.271L10.39 2.476A1.625 1.625 0 0 1 12.688 2.476L13.524 3.312A1.625 1.625 0 0 1 13.524 5.61L12.729 6.405Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.44L10.91 5.53L14.47 9.09L6.56 17ZM11.97 4.47L12.85 3.59A2 2 0 0 1 15.68 3.59L16.41 4.32A2 2 0 0 1 16.41 7.15L15.53 8.03Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.44L14.01 5.43L18.57 9.99L7.56 21ZM15.07 4.37L15.78 3.66A2.25 2.25 0 0 1 18.96 3.66L20.34 5.04A2.25 2.25 0 0 1 20.34 8.22L19.63 8.93Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "G",
      "label": "Sharp tip (60°)",
      "tags": [
        "edit",
        "write",
        "sharp",
        "pointed",
        "angle exception"
      ],
      "note": "A's body with a 60° point: the tip edges leave 0/45/90 and run at 15° and 75° (Nucleo's, Lucide's and Polaris's pencils all sharpen to 55–60°) — an angle exception, scoped to this candidate. Cone 3.67 · 2.76 · 2.45 long against A's 2.12 · 1.59 · 1.41; the C10 arc at the point (0.75 · 0.75 · 0.625) sits 1.5 · 1.5 · 1.25 up the axis, so the ink tip is 0.44 · 0.44 · 0.37 inside the box corner and the vertex is placed at 3.44,20.56 · 3.44,16.56 · 2.37,13.63 to bring the ink to the box. At 24 and 20 the outline's tip is nudged 0.01 so lint's arc centre lands the box on whole pixels; the filled twin needed none. Body 22.54 · 17.27 · 14.74 on the centreline. Band, corners and filled as A. Ink box 18×18 · 14×14 · 12×12. Sharper, and the only one whose tip is not two crisp pixel edges at 16",
      "masters": {
        "16": [
          "M3.412 13.354A0.625 0.625 0 0 1 2.646 12.588L3.098 10.902L11.082 2.918A1 1 0 0 1 12.496 2.918L13.082 3.504A1 1 0 0 1 13.082 4.918L5.098 12.902Z",
          "M9.756 4.244L11.756 6.244"
        ],
        "20": [
          "M4.68 16.23A0.75 0.75 0 0 1 3.77 15.32L4.25 13.5L13.63 4.12A1.25 1.25 0 0 1 15.4 4.12L15.88 4.6A1.25 1.25 0 0 1 15.88 6.37L6.5 15.75Z",
          "M12.22 5.53L14.47 7.78"
        ],
        "24": [
          "M4.68 20.23A0.75 0.75 0 0 1 3.77 19.32L4.53 16.47L16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07A1.5 1.5 0 0 1 19.81 7.19L7.53 19.47Z",
          "M15.57 5.43L18.57 8.43"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.574 13.957A1.25 1.25 0 0 1 2.043 12.426L2.538 10.578L8.784 4.332L11.668 7.216L5.422 13.462ZM9.845 3.271L10.64 2.476A1.625 1.625 0 0 1 12.938 2.476L13.524 3.062A1.625 1.625 0 0 1 13.524 5.36L12.729 6.155Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.89 16.95A1.5 1.5 0 0 1 3.05 15.11L3.59 13.1L11.16 5.53L14.47 8.84L6.9 16.41ZM12.22 4.47L13.1 3.59A2 2 0 0 1 15.93 3.59L16.41 4.07A2 2 0 0 1 16.41 6.9L15.53 7.78Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.89 20.95A1.5 1.5 0 0 1 3.05 19.11L3.86 16.07L14.51 5.43L18.57 9.49L7.93 20.14ZM15.57 4.37L16.28 3.66A2.25 2.25 0 0 1 19.46 3.66L20.34 4.54A2.25 2.25 0 0 1 20.34 7.72L19.63 8.43Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "H",
      "label": "Diagonal keyline (20)",
      "tags": [
        "edit",
        "write",
        "large",
        "diagonal keyline",
        "eraser"
      ],
      "note": "A carried to the diagonal keyline 20 · 16 · 14 (the bound edge at every master, like a -large mark): body 4.6 · 3.54 · 3.18 on the line (ink 6.1 · 5.04 · 4.43 = 30.5% · 31.5% · 31.6% of its box — A's proportion), 24.74 · 19.47 · 17.03 long, tip at 2.75,21.25 · 2.75,17.25 · 1.63,14.38. Band, corners and filled as A, cell 1.75 · 1.75 · 1.63. Ink box 20×20 · 16×16 · 14×14. The case for it: a 45° rod at 18 carries less mass than x or cursor, and Lucide draws its pencil at 20 of 24 for that reason; the case against: it is the only silhouette in the set on the bound",
      "masters": {
        "16": [
          "M2.25 14.375A0.625 0.625 0 0 1 1.625 13.75L1.625 12.125L11.832 1.918A1 1 0 0 1 13.246 1.918L14.082 2.754A1 1 0 0 1 14.082 4.168L3.875 14.375Z",
          "M10.506 3.244L12.756 5.494"
        ],
        "20": [
          "M3.5 17.25A0.75 0.75 0 0 1 2.75 16.5L2.75 14.75L14.38 3.12A1.25 1.25 0 0 1 16.15 3.12L16.88 3.85A1.25 1.25 0 0 1 16.88 5.62L5.25 17.25Z",
          "M12.97 4.53L15.47 7.03"
        ],
        "24": [
          "M3.5 21.25A0.75 0.75 0 0 1 2.75 20.5L2.75 18L17.56 3.19A1.5 1.5 0 0 1 19.68 3.19L20.81 4.32A1.5 1.5 0 0 1 20.81 6.44L6 21.25Z",
          "M16.32 4.43L19.57 7.68"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2.25 15A1.25 1.25 0 0 1 1 13.75L1 11.866L9.534 3.332L12.668 6.466L4.134 15ZM10.595 2.271L11.39 1.476A1.625 1.625 0 0 1 13.688 1.476L14.524 2.312A1.625 1.625 0 0 1 14.524 4.61L13.729 5.405Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M3.5 18A1.5 1.5 0 0 1 2 16.5L2 14.44L11.91 4.53L15.47 8.09L5.56 18ZM12.97 3.47L13.85 2.59A2 2 0 0 1 16.68 2.59L17.41 3.32A2 2 0 0 1 17.41 6.15L16.53 7.03Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M3.5 22A1.5 1.5 0 0 1 2 20.5L2 17.69L15.26 4.43L19.57 8.74L6.31 22ZM16.32 3.37L17.03 2.66A2.25 2.25 0 0 1 20.21 2.66L21.34 3.79A2.25 2.25 0 0 1 21.34 6.97L20.63 7.68Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "I",
      "label": "Pencil-line (write)",
      "tags": [
        "write",
        "edit",
        "compose",
        "baseline",
        "eraser"
      ],
      "note": "A unchanged, plus a short baseline to the right of the point at the tip's own level: y 20.25 · 16.25 · 13.38, from x 11.25 · 10.5 · 8.625 to the box edge — 10.5 · 7.25 · 6 of ink — with 1.68 · 1.68 · 1.58 of air to the body's lower side (floor 1.5). Nucleo's pen-writing; Lucide's pencil-line puts the line under the whole box. Filled: A's fill and the line stays a stroke at 1.5 · 1.5 · 1.25, as key's shank does. Ink box 18×18 · 14×14 · 12×12. Shows the part reused in place; if it ships it is pencil-line, not pencil",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L11.082 2.918A1 1 0 0 1 12.496 2.918L13.082 3.504A1 1 0 0 1 13.082 4.918L4.625 13.375Z",
          "M9.756 4.244L11.756 6.244"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.63 4.12A1.25 1.25 0 0 1 15.4 4.12L15.88 4.6A1.25 1.25 0 0 1 15.88 6.37L6 16.25Z",
          "M12.22 5.53L14.47 7.78"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07A1.5 1.5 0 0 1 19.81 7.19L6.75 20.25Z",
          "M15.57 5.43L18.57 8.43"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L8.784 4.332L11.668 7.216L4.884 14ZM9.845 3.271L10.64 2.476A1.625 1.625 0 0 1 12.938 2.476L13.524 3.062A1.625 1.625 0 0 1 13.524 5.36L12.729 6.155Z"
          ],
          "stroke": [
            "M8.625 13.375H13.375"
          ]
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L11.16 5.53L14.47 8.84L6.31 17ZM12.22 4.47L13.1 3.59A2 2 0 0 1 15.93 3.59L16.41 4.07A2 2 0 0 1 16.41 6.9L15.53 7.78Z"
          ],
          "stroke": [
            "M10.5 16.25H16.25"
          ]
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L14.51 5.43L18.57 9.49L7.06 21ZM15.57 4.37L16.28 3.66A2.25 2.25 0 0 1 19.46 3.66L20.34 4.54A2.25 2.25 0 0 1 20.34 7.72L19.63 8.43Z"
          ],
          "stroke": [
            "M11.25 20.25H20.25"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Crisp end (C10 corners)",
      "tags": [
        "edit",
        "write",
        "crisp",
        "mark corners",
        "eraser"
      ],
      "note": "A with the end corners at the mark bend 0.75 · 0.75 · 0.625 (C10) instead of the detail radius — the corners cursor uses, so the whole silhouette is one family of bends. Body 21.65 · 16.53 · 14.15 long (0.44 · 0.29 · 0.22 shorter than A: a tighter corner reaches the box sooner). Cell 1.75 · 1.75 · 1.63 with square inner corners. Filled corners 1.5 · 1.5 · 1.25, cursor-filled's. Ink box 18×18 · 14×14 · 12×12. Crisper at 24; at 16 the difference from A is a quarter pixel on each corner",
      "masters": {
        "16": [
          "M3.25 13.375A0.625 0.625 0 0 1 2.625 12.75L2.625 11.375L11.192 2.808A0.625 0.625 0 0 1 12.076 2.808L13.192 3.924A0.625 0.625 0 0 1 13.192 4.808L4.625 13.375Z",
          "M9.601 4.399L11.601 6.399"
        ],
        "20": [
          "M4.5 16.25A0.75 0.75 0 0 1 3.75 15.5L3.75 14L13.78 3.97A0.75 0.75 0 0 1 14.84 3.97L16.03 5.16A0.75 0.75 0 0 1 16.03 6.22L6 16.25Z",
          "M12.01 5.74L14.26 7.99"
        ],
        "24": [
          "M4.5 20.25A0.75 0.75 0 0 1 3.75 19.5L3.75 17.25L17.03 3.97A0.75 0.75 0 0 1 18.09 3.97L20.03 5.91A0.75 0.75 0 0 1 20.03 6.97L6.75 20.25Z",
          "M15.26 5.74L18.26 8.74"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.25 14A1.25 1.25 0 0 1 2 12.75L2 11.116L8.629 4.487L11.513 7.371L4.884 14ZM9.689 3.427L10.75 2.366A1.25 1.25 0 0 1 12.518 2.366L13.634 3.482A1.25 1.25 0 0 1 13.634 5.25L12.573 6.311Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.5 17A1.5 1.5 0 0 1 3 15.5L3 13.69L10.95 5.74L14.26 9.05L6.31 17ZM12.01 4.68L13.25 3.44A1.5 1.5 0 0 1 15.37 3.44L16.56 4.63A1.5 1.5 0 0 1 16.56 6.75L15.32 7.99Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.5 21A1.5 1.5 0 0 1 3 19.5L3 16.94L14.2 5.74L18.26 9.8L7.06 21ZM15.26 4.68L16.5 3.44A1.5 1.5 0 0 1 18.62 3.44L20.56 5.38A1.5 1.5 0 0 1 20.56 7.5L19.32 8.74Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
