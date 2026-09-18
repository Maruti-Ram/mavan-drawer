// help — final three, all on the C19 glyph gap (dot-to-body floors at 1, not 1.5).
// Shared: circle, glyph box 12 · 10 · 8, dot 2.5 · 2 · 2, terminal on the axis with the dot directly
// below, counter never under one stroke. They differ only in the tail.
// The 16 master is IDENTICAL in all three: with a one-stroke counter and the C19 gap there is no
// height left for a tail, so the bowl ends at its own foot. help-2 and help-3 ship 16 as a copy.
// Filled is the medium cut 2 · 1.75 · 1.75 (C18) — shapes filled, lines stay 1.5.
export default {
  "concept": "help",
  "context": "Help",
  "family": [
    "info",
    "plus-circle",
    "minus-circle"
  ],
  "question": "Final: help (Polaris bowl) · help-2 (coil) · help-3 (hook), all on the C19 glyph gap.",
  "glyph": "dot",
  "candidates": [
    {
      "id": "J",
      "file": "help",
      "label": "Polaris bowl",
      "tags": [
        "round",
        "bowl"
      ],
      "glyph": "dot",
      "note": "Polaris’ construction on the C19 glyph gap: the bowl wraps 249° from just past 9 o’clock (r 3 · 2.25 · 1.75), then a reverse tuck (1.14 · 0.86) turns the terminal onto the axis, dot directly below. Counter 4.5 · 3 · 2, void/dot 0.5. At 16 a legal tuck needs a 0.57 radius, under half the stroke (C10), so 16 ends at the bowl’s foot — the one drawing 16 allows, shared by all three",
      "masters": {
        "16": [
          "M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z",
          "M6.41 5.76A1.75 1.75 0 1 1 8 8.25",
          "M7.75 11A0.25 0.25 0 1 0 8.25 11A0.25 0.25 0 1 0 7.75 11Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M7.78 7.61A2.25 2.25 0 1 1 10.62 10.16A0.86 0.86 0 0 0 10 10.99",
          "M9.75 14A0.25 0.25 0 1 0 10.25 14A0.25 0.25 0 1 0 9.75 14Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.01 9.49A3 3 0 1 1 12.83 12.63A1.14 1.14 0 0 0 12 13.73",
          "M11.5 16.75A0.5 0.5 0 1 0 12.5 16.75A0.5 0.5 0 1 0 11.5 16.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 11A1 1 0 1 0 9 11A1 1 0 1 0 7 11ZM5.62 5.39A2.63 2.63 0 1 1 8 9.13A0.88 0.88 0 0 1 8 7.37A0.87 0.87 0 1 0 7.21 6.13A0.88 0.88 0 0 1 5.62 5.39Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9 14A1 1 0 1 0 11 14A1 1 0 1 0 9 14ZM6.92 7.46A3.13 3.13 0 1 1 10.86 11.01A-0.02 -0.02 0 0 0 10.88 10.99A0.88 0.88 0 0 1 9.12 10.99A1.74 1.74 0 0 1 10.38 9.32A1.37 1.37 0 1 0 8.65 7.76A0.88 0.88 0 0 1 6.92 7.46Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.75 16.75A1.25 1.25 0 1 0 13.25 16.75A1.25 1.25 0 1 0 10.75 16.75ZM8.02 9.4A4 4 0 1 1 13.1 13.6A0.14 0.14 0 0 0 13 13.73A1 1 0 0 1 11 13.73A2.14 2.14 0 0 1 12.55 11.67A2 2 0 1 0 10.01 9.58A1 1 0 0 1 8.02 9.4Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "L",
      "file": "help-2",
      "label": "Coil",
      "tags": [
        "coil",
        "curl"
      ],
      "glyph": "dot",
      "note": "Coil: the bowl runs on to 60° and a reverse arc of the same radius lands the terminal on the axis — the longest tail of the three, so the smallest bowl (counter 3.5 · 2.5 · 2). Same 16 as help",
      "masters": {
        "16": [
          "M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z",
          "M6.41 5.76A1.75 1.75 0 1 1 8 8.25",
          "M7.75 11A0.25 0.25 0 1 0 8.25 11A0.25 0.25 0 1 0 7.75 11Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8.01 7.58A2 2 0 1 1 11 9.48A2 2 0 0 0 10 11.21",
          "M9.75 14A0.25 0.25 0 1 0 10.25 14A0.25 0.25 0 1 0 9.75 14Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.5 9.25A2.5 2.5 0 1 1 13.25 11.42A2.5 2.5 0 0 0 12 13.58",
          "M11.5 16.75A0.5 0.5 0 1 0 12.5 16.75A0.5 0.5 0 1 0 11.5 16.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 11A1 1 0 1 0 9 11A1 1 0 1 0 7 11ZM5.62 5.39A2.63 2.63 0 1 1 8 9.13A0.88 0.88 0 0 1 8 7.37A0.87 0.87 0 1 0 7.21 6.13A0.88 0.88 0 0 1 5.62 5.39Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9 14A1 1 0 1 0 11 14A1 1 0 1 0 9 14ZM7.13 7.5A2.88 2.88 0 1 1 11.44 10.24A1.12 1.12 0 0 0 10.88 11.21A0.88 0.88 0 0 1 9.12 11.21A2.88 2.88 0 0 1 10.56 8.72A1.12 1.12 0 1 0 8.88 7.65A0.88 0.88 0 0 1 7.13 7.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.75 16.75A1.25 1.25 0 1 0 13.25 16.75A1.25 1.25 0 1 0 10.75 16.75ZM8.5 9.25A3.5 3.5 0 1 1 13.75 12.28A1.5 1.5 0 0 0 13 13.58A1 1 0 0 1 11 13.58A3.5 3.5 0 0 1 12.75 10.55A1.5 1.5 0 1 0 10.5 9.25A1 1 0 0 1 8.5 9.25Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "file": "help-3",
      "label": "Hook",
      "tags": [
        "hook",
        "angled"
      ],
      "glyph": "dot",
      "note": "Hook: the geometric reading — the same bowl into a straight 45° tail of the bowl’s own radius, joined on the tangent so there is no corner, terminal on the axis. Counter 4 · 3 · 2. Same 16 as help",
      "masters": {
        "16": [
          "M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z",
          "M6.41 5.76A1.75 1.75 0 1 1 8 8.25",
          "M7.75 11A0.25 0.25 0 1 0 8.25 11A0.25 0.25 0 1 0 7.75 11Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M7.83 7.42A2.25 2.25 0 1 1 11.59 9.59L10 11.18",
          "M9.75 14A0.25 0.25 0 1 0 10.25 14A0.25 0.25 0 1 0 9.75 14Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.29 9.02A2.75 2.75 0 1 1 13.94 11.44L12 13.39",
          "M11.5 16.75A0.5 0.5 0 1 0 12.5 16.75A0.5 0.5 0 1 0 11.5 16.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 11A1 1 0 1 0 9 11A1 1 0 1 0 7 11ZM5.62 5.39A2.63 2.63 0 1 1 8 9.13A0.88 0.88 0 0 1 8 7.37A0.87 0.87 0 1 0 7.21 6.13A0.88 0.88 0 0 1 5.62 5.39Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9 14A1 1 0 1 0 11 14A1 1 0 1 0 9 14ZM6.98 7.19A3.13 3.13 0 1 1 12.21 10.21L10.62 11.8A0.88 0.88 0 0 1 9.38 10.56L10.97 8.97A1.37 1.37 0 1 0 8.68 7.65A0.88 0.88 0 0 1 6.98 7.19Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.75 16.75A1.25 1.25 0 1 0 13.25 16.75A1.25 1.25 0 1 0 10.75 16.75ZM8.31 8.85A3.75 3.75 0 1 1 14.65 12.15L12.71 14.1A1 1 0 0 1 11.29 12.68L13.24 10.74A1.75 1.75 0 1 0 10.28 9.2A1 1 0 0 1 8.31 8.85Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
