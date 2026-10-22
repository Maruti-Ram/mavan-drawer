// disc: a disc is a ring inside a circle, the same outline as target and a donut, so this decides which detail says "a CD or a record" before the set gets a second round mark people could misread.
export default {
  "concept": "disc",
  "question": "Which picture says disc: a CD with two sheen glints (A), a plain CD with its hole (B), a CD with a light wedge (C), a record under a tonearm (D) or a disc drawn out of its sleeve (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "CD with sheen",
      "tags": [
        "cd",
        "dvd",
        "optical",
        "sheen",
        "album",
        "music"
      ],
      "note": "Rhythm: the rim, two glints and the spindle sit at equal air at every master: spindle to glint 2.75 · 2 · 1.75, glint to rim 2.75 · 2 · 1.75 (24 · 20 · 16). Rim ⌀20 · 16 · 14 (the circle keyline, as target and film-reel), glints are 70° arcs at r 5 · 3.75 · 3.375 (0.54 · 0.52 · 0.53 of the rim) centred on the diagonals, top-left and bottom-right, so the disc is point-symmetric and box-centred; spindle dot ⌀3 · 2 · 2. Ink 20×20 · 16×16 · 14×14. The glints are open arcs, not target's full inner ring, and cover a third of a circle, not half (quarter arcs read as a broken target beside it at 16). Filled: the disc solid, the spindle a white hole the size of the dot (⌀3 · 2 · 2), each glint a 1.5 white band at the same radius; material hole to glint 2.75 · 2 · 1.62, glint to edge 4.25 · 3.5 · 2.88. Glint ends sit off the quarter grid (diagonal arcs). Who: Tabler disc, Lucide disc-3, Untitled UI disc-02, Phosphor vinyl-record. Only three of the five are separate pictures — the CD (A, B, C), the record player (D) and the album sleeve (E); A, B and C are the three CD constructions real sets use. (recommended) — the glints are what make a ring read as a shiny disc rather than a target or a donut, they keep 1.75 of air at 16, and the filled twin still reads as a CD.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M7.625 8A0.375 0.375 0 1 0 8.375 8A0.375 0.375 0 1 0 7.625 8Z",
          "M4.676 7.414A3.375 3.375 0 0 1 7.414 4.676",
          "M11.324 8.586A3.375 3.375 0 0 1 8.586 11.324"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M9.75 10A0.25 0.25 0 1 0 10.25 10A0.25 0.25 0 1 0 9.75 10Z",
          "M6.31 9.35A3.75 3.75 0 0 1 9.35 6.31",
          "M13.69 10.65A3.75 3.75 0 0 1 10.65 13.69"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M11.25 12A0.75 0.75 0 1 0 12.75 12A0.75 0.75 0 1 0 11.25 12Z",
          "M7.08 11.13A5 5 0 0 1 11.13 7.08",
          "M16.92 12.87A5 5 0 0 1 12.87 16.92"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 8A1 1 0 1 0 9 8A1 1 0 1 0 7 8ZM3.938 7.284A4.125 4.125 0 0 1 7.284 3.938A0.75 0.75 0 0 1 7.544 5.415A2.625 2.625 0 0 0 5.415 7.544A0.75 0.75 0 0 1 3.938 7.284ZM12.062 8.716A4.125 4.125 0 0 1 8.716 12.062A0.75 0.75 0 0 1 8.456 10.585A2.625 2.625 0 0 0 10.585 8.456A0.75 0.75 0 0 1 12.062 8.716Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9 10A1 1 0 1 0 11 10A1 1 0 1 0 9 10ZM5.57 9.22A4.5 4.5 0 0 1 9.22 5.57A0.75 0.75 0 0 1 9.48 7.05A3 3 0 0 0 7.05 9.48A0.75 0.75 0 0 1 5.57 9.22ZM14.43 10.78A4.5 4.5 0 0 1 10.78 14.43A0.75 0.75 0 0 1 10.52 12.95A3 3 0 0 0 12.95 10.52A0.75 0.75 0 0 1 14.43 10.78Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.5 12A1.5 1.5 0 1 0 13.5 12A1.5 1.5 0 1 0 10.5 12ZM6.34 11A5.75 5.75 0 0 1 11 6.34A0.75 0.75 0 0 1 11.26 7.81A4.25 4.25 0 0 0 7.81 11.26A0.75 0.75 0 0 1 6.34 11ZM17.66 13A5.75 5.75 0 0 1 13 17.66A0.75 0.75 0 0 1 12.74 16.19A4.25 4.25 0 0 0 16.19 12.74A0.75 0.75 0 0 1 17.66 13Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "CD with hole",
      "tags": [
        "cd",
        "dvd",
        "optical",
        "hole",
        "album",
        "music"
      ],
      "note": "Rhythm: one ring inside another, nothing else. Rim ⌀20 · 16 · 14; hole ring r 2.5 · 2 · 1.625, so its ink is ⌀6.5 · 5.5 · 4.5 (0.33 · 0.34 · 0.32 of the rim) and its hole ⌀3.5 · 2.5 · 2; air ring to rim 5.25 · 3.75 · 3.5. Ink 20×20 · 16×16 · 14×14, box-centred. Filled: the disc solid with the hole cut at the ring's centreline, ⌀5 · 4 · 3.25 — the plain picture has nothing else to cut, so the filled twin is a donut, and at 16 the outline sits one ring away from target. Who: Lucide disc, Feather disc, Untitled UI disc-01, Remix album.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.375 8A1.625 1.625 0 1 0 9.625 8A1.625 1.625 0 1 0 6.375 8Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8 10A2 2 0 1 0 12 10A2 2 0 1 0 8 10Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.5 12A2.5 2.5 0 1 0 14.5 12A2.5 2.5 0 1 0 9.5 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM6.375 8A1.625 1.625 0 1 0 9.625 8A1.625 1.625 0 1 0 6.375 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM8 10A2 2 0 1 0 12 10A2 2 0 1 0 8 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM9.5 12A2.5 2.5 0 1 0 14.5 12A2.5 2.5 0 1 0 9.5 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "CD with light wedge",
      "tags": [
        "cd",
        "dvd",
        "optical",
        "wedge",
        "album",
        "music"
      ],
      "note": "Rhythm: B's disc and hole ring (r 2.5 · 2 · 1.625) with two radial lines 45° apart, at 3 o'clock and half past one, joined to the rim; their inner ends keep 1.75 / 1.66 · 1.75 / 1.8 · 1.5 / 1.54 of air to the hole ring (horizontal / diagonal), and the lines show 3.5 · 2 · 2 of length inside the rim. Ink 20×20 · 16×16 · 14×14. The diagonal's rim end sits off the grid, on the rim's centreline. Filled: the disc solid, hole ⌀3.5 · 2.5 · 2 (the ring's white), the lines cut as 1.5 white slots from r 4 · 4 · 3.625 to 7.75 · 5.75 · 5, so 1.5 · 1.5 · 1.25 of disc stays outside them; slot to slot 1.5 · 1.56 · 1.27. At 16 the slots are short white dashes and the outline reads close to a gauge. Who: Phosphor disc.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.375 8A1.625 1.625 0 1 0 9.625 8A1.625 1.625 0 1 0 6.375 8Z",
          "M12.375 8L14.375 8",
          "M11.125 4.875L12.508 3.492"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8 10A2 2 0 1 0 12 10A2 2 0 1 0 8 10Z",
          "M15.25 10L17.25 10",
          "M13.75 6.25L15.13 4.87"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.5 12A2.5 2.5 0 1 0 14.5 12A2.5 2.5 0 1 0 9.5 12Z",
          "M17.75 12L21.25 12",
          "M16 8L18.54 5.46"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 8A1 1 0 1 0 9 8A1 1 0 1 0 7 8ZM11.625 8.75L13 8.75A0.75 0.75 0 0 0 13.75 8A0.75 0.75 0 0 0 13 7.25L11.625 7.25A0.75 0.75 0 0 0 10.875 8A0.75 0.75 0 0 0 11.625 8.75ZM11.094 5.967L12.066 4.995A0.75 0.75 0 0 0 12.286 4.464A0.75 0.75 0 0 0 11.536 3.714A0.75 0.75 0 0 0 11.005 3.934L10.033 4.906A0.75 0.75 0 0 0 9.813 5.437A0.75 0.75 0 0 0 10.563 6.187A0.75 0.75 0 0 0 11.094 5.967Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM8.75 10A1.25 1.25 0 1 0 11.25 10A1.25 1.25 0 1 0 8.75 10ZM14 10.75L15.75 10.75A0.75 0.75 0 0 0 16.5 10A0.75 0.75 0 0 0 15.75 9.25L14 9.25A0.75 0.75 0 0 0 13.25 10A0.75 0.75 0 0 0 14 10.75ZM13.36 7.7L14.6 6.46A0.75 0.75 0 0 0 14.82 5.93A0.75 0.75 0 0 0 14.07 5.18A0.75 0.75 0 0 0 13.54 5.4L12.3 6.64A0.75 0.75 0 0 0 12.08 7.17A0.75 0.75 0 0 0 12.83 7.92A0.75 0.75 0 0 0 13.36 7.7Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.25 12A1.75 1.75 0 1 0 13.75 12A1.75 1.75 0 1 0 10.25 12ZM16 12.75L19.75 12.75A0.75 0.75 0 0 0 20.5 12A0.75 0.75 0 0 0 19.75 11.25L16 11.25A0.75 0.75 0 0 0 15.25 12A0.75 0.75 0 0 0 16 12.75ZM15.36 9.7L18.01 7.05A0.75 0.75 0 0 0 18.23 6.52A0.75 0.75 0 0 0 17.48 5.77A0.75 0.75 0 0 0 16.95 5.99L14.3 8.64A0.75 0.75 0 0 0 14.08 9.17A0.75 0.75 0 0 0 14.83 9.92A0.75 0.75 0 0 0 15.36 9.7Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Record and tonearm",
      "tags": [
        "vinyl",
        "record",
        "lp",
        "turntable",
        "tonearm",
        "music"
      ],
      "note": "Rhythm: the rim opens from -66.5° to -4° (24), -70.5° to -5.3° (20), -72.7° to -5.9° (16) — exactly as far as 1.5 of air from the arm and the pivot asks (measured 1.51 · 1.51 · 1.51 arm to rim, 1.52 · 1.52 · 1.5 pivot to rim), and it still reaches 3 o'clock, so the ink box stays 20×20 · 16×16 · 14×14 and box-centred. The arm runs pivot → elbow (9.37 · 7.52 · 6.56 long, about one rim radius at each master) → a 45° head (2.83 · 2.12 · 1.41); pivot dot ⌀3 · 2 · 2. Spindle dot ⌀3 at 24 only (3.23 of air to the arm): at 20 and 16 the filled twin cannot fit the arm's white channel between the spindle hole and the disc's edge, so the spindle is dropped there, in both styles. Filled: the disc solid less a 1.5 white channel round the arm and its pivot (the channel tapers from the pivot's air to the arm's), the gap cut where the outline's rim stops, every outside corner rounded at the stroke's half (0.75 · 0.75 · 0.625); arm and pivot stay lines at 1.5 · 1.5 · 1.25. The rim ends and the filled cuts sit off the grid (they are where the air runs out). Who: Tabler vinyl; Lucide turntable draws the whole deck.",
      "masters": {
        "16": [
          "M14.341 7.341A6.375 6.375 0 0 1 14.375 8A6.375 6.375 0 0 1 8 14.375A6.375 6.375 0 0 1 1.625 8A6.375 6.375 0 0 1 8 1.625A6.375 6.375 0 0 1 9.898 1.914",
          "M12.5 2.875A0.375 0.375 0 1 0 13.25 2.875A0.375 0.375 0 1 0 12.5 2.875Z",
          "M12.875 2.875L10.875 9.125L9.875 10.125"
        ],
        "20": [
          "M17.22 9.33A7.25 7.25 0 0 1 17.25 10A7.25 7.25 0 0 1 10 17.25A7.25 7.25 0 0 1 2.75 10A7.25 7.25 0 0 1 10 2.75A7.25 7.25 0 0 1 12.42 3.16",
          "M15.25 4.25A0.25 0.25 0 1 0 15.75 4.25A0.25 0.25 0 1 0 15.25 4.25Z",
          "M15.5 4.25L13.5 11.5L12 13"
        ],
        "24": [
          "M21.23 11.35A9.25 9.25 0 0 1 21.25 12A9.25 9.25 0 0 1 12 21.25A9.25 9.25 0 0 1 2.75 12A9.25 9.25 0 0 1 12 2.75A9.25 9.25 0 0 1 15.69 3.52",
          "M11.25 12A0.75 0.75 0 1 0 12.75 12A0.75 0.75 0 1 0 11.25 12Z",
          "M18.5 4.75A0.75 0.75 0 1 0 20 4.75A0.75 0.75 0 1 0 18.5 4.75Z",
          "M19.25 4.75L17.75 14L15.75 16"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M15 7.963A7 7 0 0 1 15 8A7 7 0 0 1 8 15A7 7 0 0 1 1 8A7 7 0 0 1 8 1A7 7 0 0 1 10.087 1.318A0.625 0.625 0 0 1 10.526 1.915A0.625 0.625 0 0 1 10.496 2.107A2.5 2.5 0 0 0 10.454 2.25L9.005 7.867A0.625 0.625 0 0 1 8.842 8.153L8.372 8.622A2.125 2.125 0 0 0 7.75 10.125A2.125 2.125 0 0 0 9.875 12.25A2.125 2.125 0 0 0 11.378 11.628L12.377 10.628A2.125 2.125 0 0 0 12.859 9.887L13.679 7.754A0.625 0.625 0 0 1 14.197 7.356L14.31 7.344A0.625 0.625 0 0 1 14.375 7.341A0.625 0.625 0 0 1 15 7.963Z"
          ],
          "stroke": [
            "M12.5 2.875A0.375 0.375 0 1 0 13.25 2.875A0.375 0.375 0 1 0 12.5 2.875Z",
            "M12.875 2.875L10.875 9.125L9.875 10.125"
          ]
        },
        "20": {
          "fill": [
            "M18 10.09A8 8 0 0 1 10 18A8 8 0 0 1 2 10A8 8 0 0 1 10 2A8 8 0 0 1 12.69 2.46A0.75 0.75 0 0 1 13.18 3.17A0.75 0.75 0 0 1 13.14 3.42A2.5 2.5 0 0 0 13.07 3.67L11.51 10.15A0.75 0.75 0 0 1 11.31 10.51L10.41 11.41A2.25 2.25 0 0 0 9.75 13A2.25 2.25 0 0 0 12 15.25A2.25 2.25 0 0 0 13.59 14.59L15.09 13.09A2.25 2.25 0 0 0 15.65 12.17L16.36 9.88A0.75 0.75 0 0 1 17.01 9.35L17.18 9.34A0.75 0.75 0 0 1 17.25 9.33A0.75 0.75 0 0 1 18 10.08A0.75 0.75 0 0 1 18 10.09Z"
          ],
          "stroke": [
            "M15.25 4.25A0.25 0.25 0 1 0 15.75 4.25A0.25 0.25 0 1 0 15.25 4.25Z",
            "M15.5 4.25L13.5 11.5L12 13"
          ]
        },
        "24": {
          "fill": [
            "M22 12.11A10 10 0 0 1 12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2A10 10 0 0 1 16.01 2.84A0.75 0.75 0 0 1 16.46 3.52A0.75 0.75 0 0 1 16.41 3.77A3 3 0 0 0 16.26 4.51L15.6 12.72A0.75 0.75 0 0 1 15.38 13.19L14.16 14.41A2.25 2.25 0 0 0 13.5 16A2.25 2.25 0 0 0 15.75 18.25A2.25 2.25 0 0 0 17.34 17.59L19.34 15.59A2.25 2.25 0 0 0 19.94 14.54L20.58 11.92A0.75 0.75 0 0 1 21.25 11.35L21.2 11.36A0.75 0.75 0 0 1 21.25 11.36A0.75 0.75 0 0 1 22 12.11A0.75 0.75 0 0 1 22 12.11ZM13.5 12A1.5 1.5 0 1 1 10.5 12A1.5 1.5 0 1 1 13.5 12Z"
          ],
          "stroke": [
            "M18.5 4.75A0.75 0.75 0 1 0 20 4.75A0.75 0.75 0 1 0 18.5 4.75Z",
            "M19.25 4.75L17.75 14L15.75 16"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Disc and sleeve",
      "tags": [
        "album",
        "sleeve",
        "record",
        "vinyl",
        "lp",
        "cd",
        "music"
      ],
      "note": "Rhythm: the sleeve and the disc are one size — 14 · 11 · 10 across — and the disc is drawn out of the sleeve diagonally by 6 · 5 · 4 on both axes (they overlap 0.57 · 0.55 · 0.6 of their width), so the pair sits on the box centre and fills the circle keyline box 20×20 · 16×16 · 14×14. Sleeve radius 2.5 · 2 · 1.5 (the container radius); it is cut back to 1.5 of air from the disc's ink (measured 1.51 · 1.51 · 1.5), which leaves its top and left edges and three corners. Disc ring r 6.25 · 4.75 · 4.375 with a hole ring r 2 · 1.5 · 1.375 (0.32 · 0.32 · 0.31), air hole to rim 2.75 · 1.75 · 1.75. Filled: the sleeve solid with a 1.5 white bite round the disc, the bite's corners rounded at 0.75 · 0.75 · 0.625; the disc solid with its hole cut at the ring's centreline, ⌀4 · 3 · 2.75. The trimmed corner ends sit off the grid. Who: Lucide disc-album (sleeve and disc), Iconoir album (sleeve).",
      "masters": {
        "16": [
          "M2.884 10.355A1.5 1.5 0 0 1 1.625 8.875L1.625 3.125A1.5 1.5 0 0 1 3.125 1.625L8.875 1.625A1.5 1.5 0 0 1 10.355 2.884",
          "M5.625 10A4.375 4.375 0 1 0 14.375 10A4.375 4.375 0 1 0 5.625 10Z",
          "M8.625 10A1.375 1.375 0 1 0 11.375 10A1.375 1.375 0 1 0 8.625 10Z"
        ],
        "20": [
          "M4.75 12.25A2 2 0 0 1 2.75 10.25L2.75 4.75A2 2 0 0 1 4.75 2.75L10.25 2.75A2 2 0 0 1 12.25 4.75",
          "M7.75 12.5A4.75 4.75 0 1 0 17.25 12.5A4.75 4.75 0 1 0 7.75 12.5Z",
          "M11 12.5A1.5 1.5 0 1 0 14 12.5A1.5 1.5 0 1 0 11 12.5Z"
        ],
        "24": [
          "M5.75 15.25L5.25 15.25A2.5 2.5 0 0 1 2.75 12.75L2.75 5.25A2.5 2.5 0 0 1 5.25 2.75L12.75 2.75A2.5 2.5 0 0 1 15.25 5.25L15.25 5.75",
          "M8.75 15A6.25 6.25 0 1 0 21.25 15A6.25 6.25 0 1 0 8.75 15Z",
          "M13 15A2 2 0 1 0 17 15A2 2 0 1 0 13 15Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 1L8.875 1A2.125 2.125 0 0 1 11 3.125L11 2.885A0.625 0.625 0 0 1 10.375 3.51A0.625 0.625 0 0 1 10.342 3.509A6.5 6.5 0 0 0 10 3.5A6.5 6.5 0 0 0 3.5 10A6.5 6.5 0 0 0 3.509 10.342A0.625 0.625 0 0 1 3.51 10.375A0.625 0.625 0 0 1 2.885 11L3.125 11A2.125 2.125 0 0 1 1 8.875L1 3.125A2.125 2.125 0 0 1 3.125 1ZM5 10A5 5 0 1 0 15 10A5 5 0 1 0 5 10ZM8.625 10A1.375 1.375 0 1 0 11.375 10A1.375 1.375 0 1 0 8.625 10Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 2L10.25 2A2.75 2.75 0 0 1 13 4.75L13 4.75A0.75 0.75 0 0 1 12.27 5.5A7 7 0 0 0 5.5 12.27A0.75 0.75 0 0 1 4.75 13L4.75 13A2.75 2.75 0 0 1 2 10.25L2 4.75A2.75 2.75 0 0 1 4.75 2ZM7 12.5A5.5 5.5 0 1 0 18 12.5A5.5 5.5 0 1 0 7 12.5ZM11 12.5A1.5 1.5 0 1 0 14 12.5A1.5 1.5 0 1 0 11 12.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 2L12.75 2A3.25 3.25 0 0 1 16 5.25L16 5.75A0.75 0.75 0 0 1 15.25 6.5A0.75 0.75 0 0 1 15.23 6.5A8.5 8.5 0 0 0 15 6.5A8.5 8.5 0 0 0 6.5 15A8.5 8.5 0 0 0 6.5 15.23A0.75 0.75 0 0 1 6.5 15.25A0.75 0.75 0 0 1 5.75 16L5.25 16A3.25 3.25 0 0 1 2 12.75L2 5.25A3.25 3.25 0 0 1 5.25 2ZM8 15A7 7 0 1 0 22 15A7 7 0 1 0 8 15ZM13 15A2 2 0 1 0 17 15A2 2 0 1 0 13 15Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
