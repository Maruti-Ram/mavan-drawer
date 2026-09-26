// megaphone - ten candidates, every one a finished drawing at 24 · 20 · 16, outline and filled.
// Why it matters: the megaphone sits in the same toolbar row as volume, whose speaker is already a
// box and a 45 degree cone. A megaphone that is only a longer speaker reads as "sound", not
// "announcement"; what separates it is a long, shallow flare and (in most candidates) a grip.
// Shared construction (all but D and E): tube + straight cone + upright mouth on the landscape keyline,
// 20x16 · 16x12 · 14x10, ink on whole pixels, centred. Radii follow volume's speaker: back corners
// 1.5 · 1.25 · 1 (detail radius), mouth corners and the concave tube-to-cone joints 0.75 · 0.75 · 0.625
// (C10). Mouth-corner arcs are centred at (mouth x - radius, 5.5 · 5.5 · 4.25) so the ink lands on
// whole pixels; the cone line is drawn tangent to them. Off-grid decimals are those tangent points
// (and, in E, every point: E is the same horn turned 45 degrees). The 1:2 flare runs at 26.6 degrees,
// off 0/45/90 - it needs an angle exception scoped to this icon, as home-2's 36.9 degree roof has.
// Filled: the body is one evenodd solid on the outline's outer edge (back corners 2.25 · 2 · 1.625,
// mouth corners 1.5 · 1.5 · 1.25, concave joints sharp, as volume-filled's speaker); grips, straps and
// the sound arc stay lines at 1.5 · 1.5 · 1.25. Built by a throwaway script from these numbers
// (scratchpad), checked with tools/draft-check.mjs.

export default {
  "concept": "megaphone",
  "context": "Announcement, marketing, broadcast; bullhorn, loudhailer",
  "family": [
    "volume",
    "bell",
    "flag",
    "send"
  ],
  "question": "Which megaphone reads as \"announcement\" at 16 beside volume and bell - and does it carry a grip?",
  "candidates": [
    {
      "id": "A",
      "label": "Horn and grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip"
      ],
      "note": "Tube + straight cone + upright mouth, grip under the tube. Flare 1:2 (26.6 degrees). Tube 7 · 5 · 4 of ink tall (inside 4 · 2 · 1.5, the gap floor at 16), mouth the full 16 · 12 · 10. Cone starts at x 11.32 · 9.32 · 7.6, so the tube is 9.3 · 7.3 · 6.6 of ink long and the cone 10.7 · 8.7 · 7.4 - about half and half, which keeps a clear tube without turning into volume's box. Grip: one upright line at x 6.75 · 5.75 · 4.625, 4.5 · 3.5 · 3 long from the tube's bottom centreline, its round cap on the bottom pixel row with the mouth's lower corner (20 · 16 · 13). Nothing comes within 1.5 of anything it does not touch. (recommended: the plainest silhouette that is plainly a megaphone at 16 - the grip is what separates it from volume's speaker, and every edge but the flare sits on 0/90)",
      "masters": {
        "16": [
          "M1.625 8.375V7.625A1 1 0 0 1 2.625 6.625H7.455A0.625 0.625 0 0 0 7.734 6.559L13.47 3.691A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.47 12.309L7.734 9.441A0.625 0.625 0 0 0 7.455 9.375H2.625A1 1 0 0 1 1.625 8.375Z",
          "M4.625 9.375V12.375"
        ],
        "20": [
          "M2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25H9.15A0.75 0.75 0 0 0 9.48 8.17L16.16 4.83A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.16 15.17L9.48 11.83A0.75 0.75 0 0 0 9.15 11.75H4A1.25 1.25 0 0 1 2.75 10.5Z",
          "M5.75 11.75V15.25"
        ],
        "24": [
          "M2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25H11.15A0.75 0.75 0 0 0 11.48 9.17L20.16 4.83A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.16 19.17L11.48 14.83A0.75 0.75 0 0 0 11.15 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25Z",
          "M6.75 14.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8.375V7.625A1.625 1.625 0 0 1 2.625 6H7.455L13.191 3.132A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.191 12.868L7.455 10H2.625A1.625 1.625 0 0 1 1 8.375Z"
          ],
          "stroke": [
            "M4.625 9.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10.5V9.5A2 2 0 0 1 4 7.5H9.15L15.83 4.16A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.83 15.84L9.15 12.5H4A2 2 0 0 1 2 10.5Z"
          ],
          "stroke": [
            "M5.75 11.75V15.25"
          ]
        },
        "24": {
          "fill": [
            "M2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5H11.15L19.83 4.16A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.83 19.84L11.15 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z"
          ],
          "stroke": [
            "M6.75 14.75V19.25"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Horn, no grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "plain"
      ],
      "note": "A without the grip: the same horn path for path. Flare 1:2 (26.6 degrees), tube 7 · 5 · 4 tall, mouth 16 · 12 · 10, cone from x 11.32 · 9.32 · 7.6. Quietest of the ten; closest to volume's speaker in the toolbar, told apart only by the long tube and shallow flare.",
      "masters": {
        "16": [
          "M1.625 8.375V7.625A1 1 0 0 1 2.625 6.625H7.455A0.625 0.625 0 0 0 7.734 6.559L13.47 3.691A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.47 12.309L7.734 9.441A0.625 0.625 0 0 0 7.455 9.375H2.625A1 1 0 0 1 1.625 8.375Z"
        ],
        "20": [
          "M2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25H9.15A0.75 0.75 0 0 0 9.48 8.17L16.16 4.83A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.16 15.17L9.48 11.83A0.75 0.75 0 0 0 9.15 11.75H4A1.25 1.25 0 0 1 2.75 10.5Z"
        ],
        "24": [
          "M2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25H11.15A0.75 0.75 0 0 0 11.48 9.17L20.16 4.83A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.16 19.17L11.48 14.83A0.75 0.75 0 0 0 11.15 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8.375V7.625A1.625 1.625 0 0 1 2.625 6H7.455L13.191 3.132A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.191 12.868L7.455 10H2.625A1.625 1.625 0 0 1 1 8.375Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10.5V9.5A2 2 0 0 1 4 7.5H9.15L15.83 4.16A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.83 15.84L9.15 12.5H4A2 2 0 0 1 2 10.5Z"
          ]
        },
        "24": {
          "fill": [
            "M2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5H11.15L19.83 4.16A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.83 19.84L11.15 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Long horn and grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "long flare"
      ],
      "note": "A with a longer, shallower flare: 1:3 (18.4 degrees). Same mouth and tube height; the cone now starts at x 6.88 · 5.88 · 4.65, so the tube is only 4.9 · 3.9 · 3.65 of ink long and the cone takes three quarters of the length. Grip at x 4.75 · 4.25 · 3.375, same length as A's. Reads as a cone more than a tube and cone.",
      "masters": {
        "16": [
          "M1.625 8.375V7.625A1 1 0 0 1 2.625 6.625H4.547A0.625 0.625 0 0 0 4.745 6.593L13.552 3.657A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.552 12.343L4.745 9.407A0.625 0.625 0 0 0 4.547 9.375H2.625A1 1 0 0 1 1.625 8.375Z",
          "M3.375 9.375V12.375"
        ],
        "20": [
          "M2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25H5.76A0.75 0.75 0 0 0 5.99 8.21L16.26 4.79A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.26 15.21L5.99 11.79A0.75 0.75 0 0 0 5.76 11.75H4A1.25 1.25 0 0 1 2.75 10.5Z",
          "M4.25 11.75V15.25"
        ],
        "24": [
          "M2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25H6.76A0.75 0.75 0 0 0 6.99 9.21L20.26 4.79A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.26 19.21L6.99 14.79A0.75 0.75 0 0 0 6.76 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25Z",
          "M4.75 14.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8.375V7.625A1.625 1.625 0 0 1 2.625 6H4.547L13.355 3.064A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.355 12.936L4.547 10H2.625A1.625 1.625 0 0 1 1 8.375Z"
          ],
          "stroke": [
            "M3.375 9.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10.5V9.5A2 2 0 0 1 4 7.5H5.76L16.03 4.08A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 16.03 15.92L5.76 12.5H4A2 2 0 0 1 2 10.5Z"
          ],
          "stroke": [
            "M4.25 11.75V15.25"
          ]
        },
        "24": {
          "fill": [
            "M2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5H6.76L20.03 4.08A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 20.03 19.92L6.76 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z"
          ],
          "stroke": [
            "M4.75 14.75V19.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Trumpet flare and grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "trumpet",
        "curved"
      ],
      "note": "The flare is one arc per side, tangent to the tube at x 8.75 · 7.25 · 5.625 and bending out to the mouth: radius 16.84 · 13.22 · 11.88, solved so the mouth corner (r 0.75 · 0.75 · 0.625) keeps A's centre and the ink stays on whole pixels. No straight line leaves 0/90, so no angle exception. Tube 7 · 5 · 4 tall; grip at x 5.75 · 5.25 · 3.875. Filled: the arcs shrink by half a stroke (16.09 · 12.47 · 11.25) about the same centres, joints smooth. The arc radii and their end points are the off-grid decimals.",
      "masters": {
        "16": [
          "M2.625 6.625H5.625A11.878 11.878 0 0 0 13.344 3.775A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.344 12.225A11.878 11.878 0 0 0 5.625 9.375H2.625A1 1 0 0 1 1.625 8.375V7.625A1 1 0 0 1 2.625 6.625Z",
          "M3.875 9.375V12.375"
        ],
        "20": [
          "M4 8.25H7.25A13.22 13.22 0 0 0 16 4.94A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16 15.06A13.22 13.22 0 0 0 7.25 11.75H4A1.25 1.25 0 0 1 2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25Z",
          "M5.25 11.75V15.25"
        ],
        "24": [
          "M4.25 9.25H8.75A16.84 16.84 0 0 0 20 4.94A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20 19.06A16.84 16.84 0 0 0 8.75 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25Z",
          "M5.75 14.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2.625 6H5.625A0.625 0.625 0 0 1 5.625 6A11.253 11.253 0 0 0 12.938 3.3A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 12.938 12.7A11.253 11.253 0 0 0 5.625 10A0.625 0.625 0 0 1 5.625 10H2.625A1.625 1.625 0 0 1 1 8.375V7.625A1.625 1.625 0 0 1 2.625 6Z"
          ],
          "stroke": [
            "M3.875 9.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M4 7.5H7.25A0.75 0.75 0 0 1 7.25 7.5A12.47 12.47 0 0 0 15.51 4.38A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.51 15.62A12.47 12.47 0 0 0 7.25 12.5A0.75 0.75 0 0 1 7.25 12.5H4A2 2 0 0 1 2 10.5V9.5A2 2 0 0 1 4 7.5Z"
          ],
          "stroke": [
            "M5.25 11.75V15.25"
          ]
        },
        "24": {
          "fill": [
            "M4.25 8.5H8.75A0.75 0.75 0 0 1 8.75 8.5A16.09 16.09 0 0 0 19.5 4.38A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.5 19.62A16.09 16.09 0 0 0 8.75 15.5A0.75 0.75 0 0 1 8.75 15.5H4.25A2.25 2.25 0 0 1 2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5Z"
          ],
          "stroke": [
            "M5.75 14.75V19.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Tilted and grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "tilted",
        "raised"
      ],
      "note": "A horn drawn along its own axis (tube 5 · 3.5 · 2.75 centreline tall, 1:2 flare, mouth 13.5 · 10 · 8.5 centreline) and turned 45 degrees to point up and right; the grip stays square to the tube (3.5 · 3.25 · 2.5 long), so it hangs down and right. Turned, the tube and mouth sit on 45 and the flare edges on 18.4 / 71.6 (the 1:3 and 3:1 lines). Square keyline: ink 17.75x18.37 · 13.78x14.47 · 11.71x12.3, centred within 0.1. Every coordinate is off-grid (a 45 degree turn of grid points), and its edges cannot land on whole pixels - softest of the ten at 16.",
      "masters": {
        "16": [
          "M3.64 12.64L3.11 12.11A1 1 0 0 1 3.11 10.696L5.657 8.148A0.625 0.625 0 0 0 5.808 7.904L7.475 2.905A0.625 0.625 0 0 1 8.509 2.66L13.09 7.241A0.625 0.625 0 0 1 12.845 8.275L7.846 9.942A0.625 0.625 0 0 0 7.602 10.093L5.054 12.64A1 1 0 0 1 3.64 12.64Z",
          "M5.938 11.756L7.706 13.524"
        ],
        "20": [
          "M4.85 15.35L4.15 14.65A1.25 1.25 0 0 1 4.15 12.88L7.2 9.82A0.75 0.75 0 0 0 7.38 9.53L9.24 3.95A0.75 0.75 0 0 1 10.48 3.66L15.84 9.02A0.75 0.75 0 0 1 15.55 10.26L9.97 12.12A0.75 0.75 0 0 0 9.68 12.3L6.62 15.35A1.25 1.25 0 0 1 4.85 15.35Z",
          "M7.86 14.12L10.16 16.41"
        ],
        "24": [
          "M5.71 19.46L4.29 18.04A1.5 1.5 0 0 1 4.29 15.92L8.06 12.16A0.75 0.75 0 0 0 8.24 11.86L10.8 4.17A0.75 0.75 0 0 1 12.05 3.87L19.88 11.7A0.75 0.75 0 0 1 19.58 12.95L11.89 15.51A0.75 0.75 0 0 0 11.59 15.69L7.83 19.46A1.5 1.5 0 0 1 5.71 19.46Z",
          "M9.24 18.04L11.72 20.52"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.198 13.082L2.668 12.552A1.625 1.625 0 0 1 2.668 10.254L5.215 7.706L6.882 2.707A1.25 1.25 0 0 1 8.951 2.218L13.532 6.799A1.25 1.25 0 0 1 13.043 8.868L8.044 10.535L5.496 13.082A1.625 1.625 0 0 1 3.198 13.082Z"
          ],
          "stroke": [
            "M5.938 11.756L7.706 13.524"
          ]
        },
        "20": {
          "fill": [
            "M4.32 15.88L3.62 15.18A2 2 0 0 1 3.62 12.35L6.67 9.29L8.53 3.72A1.5 1.5 0 0 1 11.01 3.13L16.37 8.49A1.5 1.5 0 0 1 15.78 10.97L10.21 12.83L7.15 15.88A2 2 0 0 1 4.32 15.88Z"
          ],
          "stroke": [
            "M7.86 14.12L10.16 16.41"
          ]
        },
        "24": {
          "fill": [
            "M5.18 19.99L3.76 18.57A2.25 2.25 0 0 1 3.76 15.39L7.53 11.63L10.09 3.93A1.5 1.5 0 0 1 12.58 3.34L20.41 11.17A1.5 1.5 0 0 1 19.82 13.66L12.12 16.22L8.36 19.99A2.25 2.25 0 0 1 5.18 19.99Z"
          ],
          "stroke": [
            "M9.24 18.04L11.72 20.52"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Horn and strap",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "strap",
        "handle"
      ],
      "note": "A's horn with a U-shaped strap under the tube instead of the grip: legs at x 4.75 / 9.25 · 4.25 / 7.75 · 2.875 / 5.625, bottom corners 1.5 · 1.25 · 1, bottom on the ink edge. The loop's opening is 3 x 3 · 2 x 2 · 1.5 x 1.75 - at 16 it is on the gap floor across and may close to a solid tab.",
      "masters": {
        "16": [
          "M1.625 8.375V7.625A1 1 0 0 1 2.625 6.625H7.455A0.625 0.625 0 0 0 7.734 6.559L13.47 3.691A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.47 12.309L7.734 9.441A0.625 0.625 0 0 0 7.455 9.375H2.625A1 1 0 0 1 1.625 8.375Z",
          "M2.875 9.375V11.375A1 1 0 0 0 3.875 12.375H4.625A1 1 0 0 0 5.625 11.375V9.375"
        ],
        "20": [
          "M2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25H9.15A0.75 0.75 0 0 0 9.48 8.17L16.16 4.83A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.16 15.17L9.48 11.83A0.75 0.75 0 0 0 9.15 11.75H4A1.25 1.25 0 0 1 2.75 10.5Z",
          "M4.25 11.75V14A1.25 1.25 0 0 0 5.5 15.25H6.5A1.25 1.25 0 0 0 7.75 14V11.75"
        ],
        "24": [
          "M2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25H11.15A0.75 0.75 0 0 0 11.48 9.17L20.16 4.83A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.16 19.17L11.48 14.83A0.75 0.75 0 0 0 11.15 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25Z",
          "M4.75 14.75V17.75A1.5 1.5 0 0 0 6.25 19.25H7.75A1.5 1.5 0 0 0 9.25 17.75V14.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8.375V7.625A1.625 1.625 0 0 1 2.625 6H7.455L13.191 3.132A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.191 12.868L7.455 10H2.625A1.625 1.625 0 0 1 1 8.375Z"
          ],
          "stroke": [
            "M2.875 9.375V11.375A1 1 0 0 0 3.875 12.375H4.625A1 1 0 0 0 5.625 11.375V9.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10.5V9.5A2 2 0 0 1 4 7.5H9.15L15.83 4.16A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.83 15.84L9.15 12.5H4A2 2 0 0 1 2 10.5Z"
          ],
          "stroke": [
            "M4.25 11.75V14A1.25 1.25 0 0 0 5.5 15.25H6.5A1.25 1.25 0 0 0 7.75 14V11.75"
          ]
        },
        "24": {
          "fill": [
            "M2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5H11.15L19.83 4.16A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.83 19.84L11.15 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z"
          ],
          "stroke": [
            "M4.75 14.75V17.75A1.5 1.5 0 0 0 6.25 19.25H7.75A1.5 1.5 0 0 0 9.25 17.75V14.75"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "Round back and grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "round"
      ],
      "note": "A with the tube's back a half-round (radius 2.75 · 1.75 · 1.375, half the tube; filled 3.5 · 2.5 · 2): a mouthpiece rather than a box end. Everything else is A's - flare 1:2, cone from x 11.32 · 9.32 · 7.6, grip at x 6.75 · 5.75 · 4.625.",
      "masters": {
        "16": [
          "M1.625 8A1.375 1.375 0 0 1 3 6.625H7.455A0.625 0.625 0 0 0 7.734 6.559L13.47 3.691A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.47 12.309L7.734 9.441A0.625 0.625 0 0 0 7.455 9.375H3A1.375 1.375 0 0 1 1.625 8Z",
          "M4.625 9.375V12.375"
        ],
        "20": [
          "M2.75 10A1.75 1.75 0 0 1 4.5 8.25H9.15A0.75 0.75 0 0 0 9.48 8.17L16.16 4.83A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.16 15.17L9.48 11.83A0.75 0.75 0 0 0 9.15 11.75H4.5A1.75 1.75 0 0 1 2.75 10Z",
          "M5.75 11.75V15.25"
        ],
        "24": [
          "M2.75 12A2.75 2.75 0 0 1 5.5 9.25H11.15A0.75 0.75 0 0 0 11.48 9.17L20.16 4.83A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.16 19.17L11.48 14.83A0.75 0.75 0 0 0 11.15 14.75H5.5A2.75 2.75 0 0 1 2.75 12Z",
          "M6.75 14.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A2 2 0 0 1 3 6H7.455L13.191 3.132A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.191 12.868L7.455 10H3A2 2 0 0 1 1 8Z"
          ],
          "stroke": [
            "M4.625 9.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10A2.5 2.5 0 0 1 4.5 7.5H9.15L15.83 4.16A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.83 15.84L9.15 12.5H4.5A2.5 2.5 0 0 1 2 10Z"
          ],
          "stroke": [
            "M5.75 11.75V15.25"
          ]
        },
        "24": {
          "fill": [
            "M2 12A3.5 3.5 0 0 1 5.5 8.5H11.15L19.83 4.16A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.83 19.84L11.15 15.5H5.5A3.5 3.5 0 0 1 2 12Z"
          ],
          "stroke": [
            "M6.75 14.75V19.25"
          ]
        }
      }
    },
    {
      "id": "H",
      "label": "Horn, grip and sound",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "sound",
        "wave"
      ],
      "note": "A shorter horn raised above a longer grip, with one sound arc in front of the mouth. Horn: tube 7 · 5 · 4 tall, mouth 14 · 10.25 · 8 of ink (top on the ink edge), mouth at x 17 · 13.25 · 10.375, flare 1:2. Arc: radius 4.25 · 4 · 4 on the mouth's centre, 80 degrees of sweep, its round cap on the right ink edge; 1.76 · 1.56 · 1.81 clear of the mouth (floor 1.5). Grip at x 6.25 · 5.25 · 3.875, 5.5 · 4 · 4 long. The arc is volume's wave language - says \"sound\" loudest, but also nearest to volume. The arc's end points are the extra off-grid decimals.",
      "masters": {
        "16": [
          "M1.625 7.375V6.625A1 1 0 0 1 2.625 5.625H5.455A0.625 0.625 0 0 0 5.734 5.559L9.47 3.691A0.625 0.625 0 0 1 10.375 4.25V9.75A0.625 0.625 0 0 1 9.47 10.309L5.734 8.441A0.625 0.625 0 0 0 5.455 8.375H2.625A1 1 0 0 1 1.625 7.375Z",
          "M13.439 4.429A4 4 0 0 1 13.439 9.571",
          "M3.875 8.375V12.375"
        ],
        "20": [
          "M2.75 10V9A1.25 1.25 0 0 1 4 7.75H6.15A0.75 0.75 0 0 0 6.48 7.67L12.16 4.83A0.75 0.75 0 0 1 13.25 5.5V13.5A0.75 0.75 0 0 1 12.16 14.17L6.48 11.33A0.75 0.75 0 0 0 6.15 11.25H4A1.25 1.25 0 0 1 2.75 10Z",
          "M16.31 6.93A4 4 0 0 1 16.31 12.07",
          "M5.25 11.25V15.25"
        ],
        "24": [
          "M2.75 12.25V9.75A1.5 1.5 0 0 1 4.25 8.25H8.9A0.75 0.75 0 0 0 9.23 8.17L15.91 4.83A0.75 0.75 0 0 1 17 5.5V16.5A0.75 0.75 0 0 1 15.91 17.17L9.23 13.83A0.75 0.75 0 0 0 8.9 13.75H4.25A1.5 1.5 0 0 1 2.75 12.25Z",
          "M20.26 8.27A4.25 4.25 0 0 1 20.26 13.73",
          "M6.25 13.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 7.375V6.625A1.625 1.625 0 0 1 2.625 5H5.455L9.191 3.132A1.25 1.25 0 0 1 11 4.25V9.75A1.25 1.25 0 0 1 9.191 10.868L5.455 9H2.625A1.625 1.625 0 0 1 1 7.375Z"
          ],
          "stroke": [
            "M13.439 4.429A4 4 0 0 1 13.439 9.571",
            "M3.875 8.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10V9A2 2 0 0 1 4 7H6.15L11.83 4.16A1.5 1.5 0 0 1 14 5.5V13.5A1.5 1.5 0 0 1 11.83 14.84L6.15 12H4A2 2 0 0 1 2 10Z"
          ],
          "stroke": [
            "M16.31 6.93A4 4 0 0 1 16.31 12.07",
            "M5.25 11.25V15.25"
          ]
        },
        "24": {
          "fill": [
            "M2 12.25V9.75A2.25 2.25 0 0 1 4.25 7.5H8.9L15.58 4.16A1.5 1.5 0 0 1 17.75 5.5V16.5A1.5 1.5 0 0 1 15.58 17.84L8.9 14.5H4.25A2.25 2.25 0 0 1 2 12.25Z"
          ],
          "stroke": [
            "M20.26 8.27A4.25 4.25 0 0 1 20.26 13.73",
            "M6.25 13.75V19.25"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Horn and raked grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "raked",
        "pistol grip"
      ],
      "note": "A's horn with the grip leaning back at 45 degrees, a pistol grip: from the tube's bottom at x 9.75 · 8.75 · 6.875 (just short of the cone joint) down to x 5.25 · 5.25 · 3.875 on the bottom ink row. 6.36 · 4.95 · 4.24 long on the diagonal. The tube and grip meet at 45 degrees, leaving a narrow wedge under the tube.",
      "masters": {
        "16": [
          "M1.625 8.375V7.625A1 1 0 0 1 2.625 6.625H7.455A0.625 0.625 0 0 0 7.734 6.559L13.47 3.691A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.47 12.309L7.734 9.441A0.625 0.625 0 0 0 7.455 9.375H2.625A1 1 0 0 1 1.625 8.375Z",
          "M6.875 9.375L3.875 12.375"
        ],
        "20": [
          "M2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25H9.15A0.75 0.75 0 0 0 9.48 8.17L16.16 4.83A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.16 15.17L9.48 11.83A0.75 0.75 0 0 0 9.15 11.75H4A1.25 1.25 0 0 1 2.75 10.5Z",
          "M8.75 11.75L5.25 15.25"
        ],
        "24": [
          "M2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25H11.15A0.75 0.75 0 0 0 11.48 9.17L20.16 4.83A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.16 19.17L11.48 14.83A0.75 0.75 0 0 0 11.15 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25Z",
          "M9.75 14.75L5.25 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8.375V7.625A1.625 1.625 0 0 1 2.625 6H7.455L13.191 3.132A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.191 12.868L7.455 10H2.625A1.625 1.625 0 0 1 1 8.375Z"
          ],
          "stroke": [
            "M6.875 9.375L3.875 12.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10.5V9.5A2 2 0 0 1 4 7.5H9.15L15.83 4.16A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.83 15.84L9.15 12.5H4A2 2 0 0 1 2 10.5Z"
          ],
          "stroke": [
            "M8.75 11.75L5.25 15.25"
          ]
        },
        "24": {
          "fill": [
            "M2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5H11.15L19.83 4.16A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.83 19.84L11.15 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z"
          ],
          "stroke": [
            "M9.75 14.75L5.25 19.25"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Body, horn and grip",
      "tags": [
        "announcement",
        "marketing",
        "bullhorn",
        "loudhailer",
        "broadcast",
        "promote",
        "grip",
        "body",
        "amplifier"
      ],
      "note": "A's horn with a divider at x 9.75 · 7.75 · 5.625, so the tube reads as a body with the horn on its front. Filled: two solids split by a 1.5 cut at 9-10.5 · 7-8.5 · 5-6.5 (grid-6's cut width at every master), cut corners eased 0.5. Grip under the body's middle at x 6.25 · 4.75 · 2.875, 3.5 · 3 · 2.75 from the divider (floor 3 · 3 · 2.75). At 16 the body is 5.25 x 4 of ink with a grip and a wall on it - the busiest drawing here.",
      "masters": {
        "16": [
          "M1.625 8.375V7.625A1 1 0 0 1 2.625 6.625H7.455A0.625 0.625 0 0 0 7.734 6.559L13.47 3.691A0.625 0.625 0 0 1 14.375 4.25V11.75A0.625 0.625 0 0 1 13.47 12.309L7.734 9.441A0.625 0.625 0 0 0 7.455 9.375H2.625A1 1 0 0 1 1.625 8.375Z",
          "M5.625 6.625V9.375",
          "M2.875 9.375V12.375"
        ],
        "20": [
          "M2.75 10.5V9.5A1.25 1.25 0 0 1 4 8.25H9.15A0.75 0.75 0 0 0 9.48 8.17L16.16 4.83A0.75 0.75 0 0 1 17.25 5.5V14.5A0.75 0.75 0 0 1 16.16 15.17L9.48 11.83A0.75 0.75 0 0 0 9.15 11.75H4A1.25 1.25 0 0 1 2.75 10.5Z",
          "M7.75 8.25V11.75",
          "M4.75 11.75V15.25"
        ],
        "24": [
          "M2.75 13.25V10.75A1.5 1.5 0 0 1 4.25 9.25H11.15A0.75 0.75 0 0 0 11.48 9.17L20.16 4.83A0.75 0.75 0 0 1 21.25 5.5V18.5A0.75 0.75 0 0 1 20.16 19.17L11.48 14.83A0.75 0.75 0 0 0 11.15 14.75H4.25A1.5 1.5 0 0 1 2.75 13.25Z",
          "M9.75 9.25V14.75",
          "M6.25 14.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8.375V7.625A1.625 1.625 0 0 1 2.625 6H4.5A0.5 0.5 0 0 1 5 6.5V9.5A0.5 0.5 0 0 1 4.5 10H2.625A1.625 1.625 0 0 1 1 8.375Z",
            "M6.5 9.5V6.5A0.5 0.5 0 0 1 7 6H7.455L13.191 3.132A1.25 1.25 0 0 1 15 4.25V11.75A1.25 1.25 0 0 1 13.191 12.868L7.455 10H7A0.5 0.5 0 0 1 6.5 9.5Z"
          ],
          "stroke": [
            "M2.875 9.375V12.375"
          ]
        },
        "20": {
          "fill": [
            "M2 10.5V9.5A2 2 0 0 1 4 7.5H6.5A0.5 0.5 0 0 1 7 8V12A0.5 0.5 0 0 1 6.5 12.5H4A2 2 0 0 1 2 10.5Z",
            "M8.5 12V8A0.5 0.5 0 0 1 9 7.5H9.15L15.83 4.16A1.5 1.5 0 0 1 18 5.5V14.5A1.5 1.5 0 0 1 15.83 15.84L9.15 12.5H9A0.5 0.5 0 0 1 8.5 12Z"
          ],
          "stroke": [
            "M4.75 11.75V15.25"
          ]
        },
        "24": {
          "fill": [
            "M2 13.25V10.75A2.25 2.25 0 0 1 4.25 8.5H8.5A0.5 0.5 0 0 1 9 9V15A0.5 0.5 0 0 1 8.5 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z",
            "M10.5 15V9A0.5 0.5 0 0 1 11 8.5H11.15L19.83 4.16A1.5 1.5 0 0 1 22 5.5V18.5A1.5 1.5 0 0 1 19.83 19.84L11.15 15.5H11A0.5 0.5 0 0 1 10.5 15Z"
          ],
          "stroke": [
            "M6.25 14.75V19.25"
          ]
        }
      }
    }
  ]
};
