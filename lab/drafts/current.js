// info family — re-cut onto the C19 glyph gap. C18 set the dot 2 · 1.75 · 1.75 above the stem,
// "more than the 1.5 minimum, so the dot reads as a dot". Measured, that void is 0.8–0.91 of the
// dot's own size, against help's 0.41–0.54 — two conventions in one section of the library.
// These sit the dot 1 above the body (C19). The dot, the body's foot and every ink box are
// untouched, so all three optical declarations stay exactly as approved; only the void closes.
export default {
  "concept": "info",
  "context": "More information",
  "family": [
    "help",
    "plus-circle",
    "minus-circle"
  ],
  "question": "Re-cut the info family onto the C19 glyph gap (1.0), to match help.",
  "glyph": "dot",
  "candidates": [
    {
      "id": "I",
      "label": "Airy",
      "tags": [
        "plain"
      ],
      "glyph": "dot",
      "note": "plain i on the C19 glyph gap: dot 2.5 · 2 · 2 floating 1 above the stem (was 2 · 1.75 · 1.75), so the stem grows to 6.5 · 4.5 · 3 and the void reads half the dot instead of nine tenths of it. Dot, stem foot and ink box unchanged; filled cut medium 2 · 1.75 · 1.75 (C18)",
      "masters": {
        "16": [
          "M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z",
          "M7.75 5.25A0.25 0.25 0 1 0 8.25 5.25A0.25 0.25 0 1 0 7.75 5.25Z",
          "M8 8V11"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M9.75 6.5A0.25 0.25 0 1 0 10.25 6.5A0.25 0.25 0 1 0 9.75 6.5Z",
          "M10 9.25V13.75"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M11.5 7.5A0.5 0.5 0 1 0 12.5 7.5A0.5 0.5 0 1 0 11.5 7.5Z",
          "M12 10.5V17"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 5.13A1 1 0 1 0 9 5.13A1 1 0 1 0 7 5.13ZM7.13 8A0.88 0.88 0 0 1 8.88 8L8.88 11A0.88 0.88 0 0 1 7.13 11Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9 6.38A1 1 0 1 0 11 6.38A1 1 0 1 0 9 6.38ZM9.13 9.25A0.88 0.88 0 0 1 10.88 9.25L10.88 13.75A0.88 0.88 0 0 1 9.13 13.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.75 7.25A1.25 1.25 0 1 0 13.25 7.25A1.25 1.25 0 1 0 10.75 7.25ZM11 10.5A1 1 0 0 1 13 10.5L13 17A1 1 0 0 1 11 17Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "I2",
      "label": "Flag",
      "tags": [
        "flag"
      ],
      "glyph": "dot",
      "note": "flag i on the C19 glyph gap: the flag rises 1 · 0.75 · 0.75 to sit 1 below the dot; flag length, C10 bend, stem foot, ink box and the -0.45 · -0.39 · -0.39 shift all unchanged",
      "masters": {
        "16": [
          "M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z",
          "M8.11 5.25A0.25 0.25 0 1 0 8.61 5.25A0.25 0.25 0 1 0 8.11 5.25Z",
          "M6.61 8H7.61A0.75 0.75 0 0 1 8.36 8.75V11"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M10.11 6.5A0.25 0.25 0 1 0 10.61 6.5A0.25 0.25 0 1 0 10.11 6.5Z",
          "M8.61 9.25H9.61A0.75 0.75 0 0 1 10.36 10V13.75"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M11.8 7.5A0.5 0.5 0 1 0 12.8 7.5A0.5 0.5 0 1 0 11.8 7.5Z",
          "M10.3 10.5H11.55A0.75 0.75 0 0 1 12.3 11.25V17"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7.36 5.13A1 1 0 1 0 9.36 5.13A1 1 0 1 0 7.36 5.13ZM6.61 7.13H7.49A1.75 1.75 0 0 1 9.24 8.88V11A0.88 0.88 0 0 1 7.49 11V8.88H6.61A0.88 0.88 0 0 1 6.61 7.13Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9.36 6.38A1 1 0 1 0 11.36 6.38A1 1 0 1 0 9.36 6.38ZM8.61 8.38H9.49A1.75 1.75 0 0 1 11.24 10.13V13.75A0.88 0.88 0 0 1 9.49 13.75V10.13H8.61A0.88 0.88 0 0 1 8.61 8.38Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM11.05 7.25A1.25 1.25 0 1 0 13.55 7.25A1.25 1.25 0 1 0 11.05 7.25ZM10.3 9.5H11.3A2 2 0 0 1 13.3 11.5V17A1 1 0 0 1 11.3 17V11.5H10.3A1 1 0 0 1 10.3 9.5Z"
          ],
          "stroke": []
        }
      },
      "optical": {
        "24": [
          -0.45,
          0
        ],
        "20": [
          -0.39,
          0
        ],
        "16": [
          -0.39,
          0
        ]
      }
    },
    {
      "id": "I3",
      "label": "Serif",
      "tags": [
        "serif"
      ],
      "glyph": "dot",
      "note": "serif i on the C19 glyph gap: the flag rises 1 · 0.75 · 0.5, base bar and dot unchanged. At 16 this also lifts the flag off the bar, so the 1 flag-to-bar gap C18 allowed as an exception returns to 1.5",
      "masters": {
        "16": [
          "M1.75 8A6.25 6.25 0 1 0 14.25 8A6.25 6.25 0 1 0 1.75 8Z",
          "M7.75 5A0.25 0.25 0 1 0 8.25 5A0.25 0.25 0 1 0 7.75 5Z",
          "M6.75 7.75H7.25A0.75 0.75 0 0 1 8 8.5V10.75",
          "M6.75 10.75H9.25"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M10 6.23A0.25 0.25 0 1 0 10.5 6.23A0.25 0.25 0 1 0 10 6.23Z",
          "M8.5 8.98H9.5A0.75 0.75 0 0 1 10.25 9.73V13.48",
          "M9 13.48H11.5"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M11.75 7.15A0.5 0.5 0 1 0 12.75 7.15A0.5 0.5 0 1 0 11.75 7.15Z",
          "M10.25 10.15H11.5A0.75 0.75 0 0 1 12.25 10.9V16.65",
          "M10.75 16.65H13.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 4.88A1 1 0 1 0 9 4.88A1 1 0 1 0 7 4.88ZM6.75 6.88H7.13A1.75 1.75 0 0 1 8.88 8.63V9.88H9.25A0.88 0.88 0 0 1 9.25 11.63H6.75A0.88 0.88 0 0 1 6.75 9.88H7.13V8.63H6.75A0.88 0.88 0 0 1 6.75 6.88Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9.25 6.11A1 1 0 1 0 11.25 6.11A1 1 0 1 0 9.25 6.11ZM8.5 8.11H9.38A1.75 1.75 0 0 1 11.13 9.86V12.61H11.5A0.88 0.88 0 0 1 11.5 14.36H9A0.88 0.88 0 0 1 9 12.61H9.38V9.86H8.5A0.88 0.88 0 0 1 8.5 8.11Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM11 6.9A1.25 1.25 0 1 0 13.5 6.9A1.25 1.25 0 1 0 11 6.9ZM10.25 9.15H11.25A2 2 0 0 1 13.25 11.15V15.65H13.75A1 1 0 0 1 13.75 17.65H10.75A1 1 0 0 1 10.75 15.65H11.25V11.15H10.25A1 1 0 0 1 10.25 9.15Z"
          ],
          "stroke": []
        }
      },
      "optical": {
        "24": [
          0,
          -0.35
        ],
        "20": [
          0,
          -0.27
        ],
        "16": [
          0,
          -0.25
        ]
      }
    }
  ]
};
