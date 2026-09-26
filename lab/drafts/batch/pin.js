// pin - the pushpin that pins an item to the top of a list (UI & Layout). It sits in the same toolbars as
// map-pin and flag, so it must read as a pushpin, never as a location marker: map-pin is a teardrop,
// map-pin-5 a ball head on a ground ellipse; every candidate here is a cap-waist-plate body on a needle.
// Ten finished candidates, any of them shippable: A-E stand upright, F-J are the same five bodies leaning 45.
// Across the five: cap tapered at 45 or stepped, flare as a 45 skirt, a curve or a square shoulder, capless, and
// a long needle. All pass tools/draft-check.mjs with no warnings. Generated from a spec by a throwaway script
// (session scratchpad, pin/gen.mjs): fillets from corner points, the filled silhouette as the exact outward
// offset of the outline (same arc centres, radius +half the stroke), the leaning ones turned from a frame whose
// lengths are multiples of sqrt2 x the grid so every corner lands on the grid.
export default {
  "concept": "pin",
  "context": "Pin an item to the top of a list; pushpin, thumbtack, keep",
  "family": [
    "map-pin",
    "map-pin-5",
    "flag",
    "bell"
  ],
  "question": "Which of these reads as a pushpin - \"pinned to the top\" - at 16 in the set, clearly apart from map-pin?",
  "candidates": [
    {
      "id": "A",
      "label": "Upright, cap and flare",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "upright",
        "skirt"
      ],
      "note": "Cap, 45 taper, waist, 45 skirt to the plate edge. Cap 10 · 8 · 6 wide and 4 · 3.5 · 3 tall before it tapers in at 45 to a waist 6 · 6 · 4 wide (clear inside 3 · 3 · 1.5 - the 16 waist sits exactly on the 1.5 gap floor); the skirt runs 45 out 5 · 3 · 3 to the plate, 16 · 12 · 10 wide (the keyline); body 15 · 12 · 10 tall, needle 5 · 4 · 4 below the plate. The cap and skirt mirror each other, so it reads as an hourglass on a needle. Upright, in the portrait keyline (ink 16x20 · 12x16 · 10x14, centred). Every vertical wall and every flat edge (top, cap step, shoulder, plate bottom) has its outer edge on a whole pixel at all three masters - at 16 the centrelines sit on x.375 / x.625. The body is one closed stroke; the needle is its own line from the plate's bottom centreline to ink 22 · 18 · 15 on the centre line (x 12 · 10 · 8; at 16 a 1.25 line on x 8 spans two pixel columns, as map-pin-5's needle and plus's stem do). Outer corners r1 · 1 · 0.75. Filled: the body is one solid on the outline's outer edge (outer corners 1.75 · 1.75 · 1.375; inside corners at the C10 bend 0.75 · 0.75 · 0.625 come out sharp, as flag's filled notch), the needle stays a line at 1.5 · 1.5 · 1.25. Off-grid decimals are fillet tangent points on the 45 edges (r x tan 22.5 back along each edge).",
      "masters": {
        "16": [
          "M10.375 2.375L10.375 3.064A0.75 0.75 0 0 1 10.155 3.595L9.558 4.192A0.625 0.625 0 0 0 9.375 4.634L9.375 5.866A0.625 0.625 0 0 0 9.558 6.308L12.155 8.905A0.75 0.75 0 0 1 12.375 9.436L12.375 9.625A0.75 0.75 0 0 1 11.625 10.375L4.375 10.375A0.75 0.75 0 0 1 3.625 9.625L3.625 9.436A0.75 0.75 0 0 1 3.845 8.905L6.442 6.308A0.625 0.625 0 0 0 6.625 5.866L6.625 4.634A0.625 0.625 0 0 0 6.442 4.192L5.845 3.595A0.75 0.75 0 0 1 5.625 3.064L5.625 2.375A0.75 0.75 0 0 1 6.375 1.625L9.625 1.625A0.75 0.75 0 0 1 10.375 2.375Z",
          "M8 10.375L8 14.375"
        ],
        "20": [
          "M13.25 3.75L13.25 4.34A1 1 0 0 1 12.96 5.04L12.47 5.53A0.75 0.75 0 0 0 12.25 6.06L12.25 8.44A0.75 0.75 0 0 0 12.47 8.97L14.96 11.46A1 1 0 0 1 15.25 12.16L15.25 12.25A1 1 0 0 1 14.25 13.25L5.75 13.25A1 1 0 0 1 4.75 12.25L4.75 12.16A1 1 0 0 1 5.04 11.46L7.53 8.97A0.75 0.75 0 0 0 7.75 8.44L7.75 6.06A0.75 0.75 0 0 0 7.53 5.53L7.04 5.04A1 1 0 0 1 6.75 4.34L6.75 3.75A1 1 0 0 1 7.75 2.75L12.25 2.75A1 1 0 0 1 13.25 3.75Z",
          "M10 13.25L10 17.25"
        ],
        "24": [
          "M16.25 3.75L16.25 4.84A1 1 0 0 1 15.96 5.54L14.47 7.03A0.75 0.75 0 0 0 14.25 7.56L14.25 9.44A0.75 0.75 0 0 0 14.47 9.97L18.96 14.46A1 1 0 0 1 19.25 15.16L19.25 15.25A1 1 0 0 1 18.25 16.25L5.75 16.25A1 1 0 0 1 4.75 15.25L4.75 15.16A1 1 0 0 1 5.04 14.46L9.53 9.97A0.75 0.75 0 0 0 9.75 9.44L9.75 7.56A0.75 0.75 0 0 0 9.53 7.03L8.04 5.54A1 1 0 0 1 7.75 4.84L7.75 3.75A1 1 0 0 1 8.75 2.75L15.25 2.75A1 1 0 0 1 16.25 3.75Z",
          "M12 16.25L12 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M11 2.375L11 3.064A1.375 1.375 0 0 1 10.597 4.037L10 4.634L10 5.866L12.597 8.463A1.375 1.375 0 0 1 13 9.436L13 9.625A1.375 1.375 0 0 1 11.625 11L4.375 11A1.375 1.375 0 0 1 3 9.625L3 9.436A1.375 1.375 0 0 1 3.403 8.463L6 5.866L6 4.634L5.403 4.037A1.375 1.375 0 0 1 5 3.064L5 2.375A1.375 1.375 0 0 1 6.375 1L9.625 1A1.375 1.375 0 0 1 11 2.375Z"
          ],
          "stroke": [
            "M8 10.375L8 14.375"
          ]
        },
        "20": {
          "fill": [
            "M14 3.75L14 4.34A1.75 1.75 0 0 1 13.49 5.57L13 6.06L13 8.44L15.49 10.93A1.75 1.75 0 0 1 16 12.16L16 12.25A1.75 1.75 0 0 1 14.25 14L5.75 14A1.75 1.75 0 0 1 4 12.25L4 12.16A1.75 1.75 0 0 1 4.51 10.93L7 8.44L7 6.06L6.51 5.57A1.75 1.75 0 0 1 6 4.34L6 3.75A1.75 1.75 0 0 1 7.75 2L12.25 2A1.75 1.75 0 0 1 14 3.75Z"
          ],
          "stroke": [
            "M10 13.25L10 17.25"
          ]
        },
        "24": {
          "fill": [
            "M17 3.75L17 4.84A1.75 1.75 0 0 1 16.49 6.07L15 7.56L15 9.44L19.49 13.93A1.75 1.75 0 0 1 20 15.16L20 15.25A1.75 1.75 0 0 1 18.25 17L5.75 17A1.75 1.75 0 0 1 4 15.25L4 15.16A1.75 1.75 0 0 1 4.51 13.93L9 9.44L9 7.56L7.51 6.07A1.75 1.75 0 0 1 7 4.84L7 3.75A1.75 1.75 0 0 1 8.75 2L15.25 2A1.75 1.75 0 0 1 17 3.75Z"
          ],
          "stroke": [
            "M12 16.25L12 21.25"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Upright tack, no cap",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "upright",
        "tack",
        "capless"
      ],
      "note": "No cap: a rounded post (top corners r1.5 · 1.25 · 1, Nucleo's pin-tack construction) 8 · 6 · 6 wide, then a 45 skirt 4 · 3 · 2 out to the plate edge 16 · 12 · 10; body 15 · 12 · 10, needle 5 · 4 · 4. The plainest silhouette - and at 16 filled the nearest to a bell (post, skirt, clapper-like needle): check it beside bell. Upright, in the portrait keyline (ink 16x20 · 12x16 · 10x14, centred). Every vertical wall and every flat edge (top, cap step, shoulder, plate bottom) has its outer edge on a whole pixel at all three masters - at 16 the centrelines sit on x.375 / x.625. The body is one closed stroke; the needle is its own line from the plate's bottom centreline to ink 22 · 18 · 15 on the centre line (x 12 · 10 · 8; at 16 a 1.25 line on x 8 spans two pixel columns, as map-pin-5's needle and plus's stem do). Outer corners r1 · 1 · 0.75. Filled: the body is one solid on the outline's outer edge (outer corners 1.75 · 1.75 · 1.375; inside corners at the C10 bend 0.75 · 0.75 · 0.625 come out sharp, as flag's filled notch), the needle stays a line at 1.5 · 1.5 · 1.25. Off-grid decimals are fillet tangent points on the 45 edges (r x tan 22.5 back along each edge).",
      "masters": {
        "16": [
          "M10.375 2.625L10.375 6.866A0.625 0.625 0 0 0 10.558 7.308L12.155 8.905A0.75 0.75 0 0 1 12.375 9.436L12.375 9.625A0.75 0.75 0 0 1 11.625 10.375L4.375 10.375A0.75 0.75 0 0 1 3.625 9.625L3.625 9.436A0.75 0.75 0 0 1 3.845 8.905L5.442 7.308A0.625 0.625 0 0 0 5.625 6.866L5.625 2.625A1 1 0 0 1 6.625 1.625L9.375 1.625A1 1 0 0 1 10.375 2.625Z",
          "M8 10.375L8 14.375"
        ],
        "20": [
          "M12.25 4L12.25 8.44A0.75 0.75 0 0 0 12.47 8.97L14.96 11.46A1 1 0 0 1 15.25 12.16L15.25 12.25A1 1 0 0 1 14.25 13.25L5.75 13.25A1 1 0 0 1 4.75 12.25L4.75 12.16A1 1 0 0 1 5.04 11.46L7.53 8.97A0.75 0.75 0 0 0 7.75 8.44L7.75 4A1.25 1.25 0 0 1 9 2.75L11 2.75A1.25 1.25 0 0 1 12.25 4Z",
          "M10 13.25L10 17.25"
        ],
        "24": [
          "M15.25 4.25L15.25 10.44A0.75 0.75 0 0 0 15.47 10.97L18.96 14.46A1 1 0 0 1 19.25 15.16L19.25 15.25A1 1 0 0 1 18.25 16.25L5.75 16.25A1 1 0 0 1 4.75 15.25L4.75 15.16A1 1 0 0 1 5.04 14.46L8.53 10.97A0.75 0.75 0 0 0 8.75 10.44L8.75 4.25A1.5 1.5 0 0 1 10.25 2.75L13.75 2.75A1.5 1.5 0 0 1 15.25 4.25Z",
          "M12 16.25L12 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M11 2.625L11 6.866L12.597 8.463A1.375 1.375 0 0 1 13 9.436L13 9.625A1.375 1.375 0 0 1 11.625 11L4.375 11A1.375 1.375 0 0 1 3 9.625L3 9.436A1.375 1.375 0 0 1 3.403 8.463L5 6.866L5 2.625A1.625 1.625 0 0 1 6.625 1L9.375 1A1.625 1.625 0 0 1 11 2.625Z"
          ],
          "stroke": [
            "M8 10.375L8 14.375"
          ]
        },
        "20": {
          "fill": [
            "M13 4L13 8.44L15.49 10.93A1.75 1.75 0 0 1 16 12.16L16 12.25A1.75 1.75 0 0 1 14.25 14L5.75 14A1.75 1.75 0 0 1 4 12.25L4 12.16A1.75 1.75 0 0 1 4.51 10.93L7 8.44L7 4A2 2 0 0 1 9 2L11 2A2 2 0 0 1 13 4Z"
          ],
          "stroke": [
            "M10 13.25L10 17.25"
          ]
        },
        "24": {
          "fill": [
            "M16 4.25L16 10.44L19.49 13.93A1.75 1.75 0 0 1 20 15.16L20 15.25A1.75 1.75 0 0 1 18.25 17L5.75 17A1.75 1.75 0 0 1 4 15.25L4 15.16A1.75 1.75 0 0 1 4.51 13.93L8 10.44L8 4.25A2.25 2.25 0 0 1 10.25 2L13.75 2A2.25 2.25 0 0 1 16 4.25Z"
          ],
          "stroke": [
            "M12 16.25L12 21.25"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Upright, curved flare",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "upright",
        "curved"
      ],
      "note": "Stepped cap, straight waist, curved flare - the Lucide and Polaris construction. A flat cap 10 · 10 · 8 wide and 5 · 5 · 4 tall steps in (2 · 2 · 2 each side) to a waist 6 · 6 · 4 (clear 3 · 3 · 1.5), which curves out through one arc (r6 · 4 · 2.5, cut back at 20 and 16 so the filled twin's arc, r minus half the stroke, still fits the waist) into a 45 run to the plate edge 16 · 12 · 10; body 15 · 12 · 10, needle 5 · 4 · 4. The step's inner corner is drawn without an arc (the round join closes it); the filled twin keeps it sharp. The cap's top and step need 3 · 3 · 2.75 between centrelines to keep 1.5 clear inside; 24 and 20 take the next whole-pixel step, 3.5. Reads as a real pushpin head with a soft collar, and nothing like map-pin's teardrop or map-pin-5's ball on the ground (recommended: the most familiar pushpin at 16 in both styles, every flat edge crisp, and the curve echoes map-pin-2's curved sides).",
      "masters": {
        "16": [
          "M11.375 2.375L11.375 3.625A0.75 0.75 0 0 1 10.625 4.375L9.375 4.375L9.375 5.089A2.5 2.5 0 0 0 10.107 6.857L12.155 8.905A0.75 0.75 0 0 1 12.375 9.436L12.375 9.625A0.75 0.75 0 0 1 11.625 10.375L4.375 10.375A0.75 0.75 0 0 1 3.625 9.625L3.625 9.436A0.75 0.75 0 0 1 3.845 8.905L5.893 6.857A2.5 2.5 0 0 0 6.625 5.089L6.625 4.375L5.375 4.375A0.75 0.75 0 0 1 4.625 3.625L4.625 2.375A0.75 0.75 0 0 1 5.375 1.625L10.625 1.625A0.75 0.75 0 0 1 11.375 2.375Z",
          "M8 10.375L8 14.375"
        ],
        "20": [
          "M14.25 3.75L14.25 5.25A1 1 0 0 1 13.25 6.25L12.25 6.25L12.25 7.09A4 4 0 0 0 13.42 9.92L14.96 11.46A1 1 0 0 1 15.25 12.16L15.25 12.25A1 1 0 0 1 14.25 13.25L5.75 13.25A1 1 0 0 1 4.75 12.25L4.75 12.16A1 1 0 0 1 5.04 11.46L6.58 9.92A4 4 0 0 0 7.75 7.09L7.75 6.25L6.75 6.25A1 1 0 0 1 5.75 5.25L5.75 3.75A1 1 0 0 1 6.75 2.75L13.25 2.75A1 1 0 0 1 14.25 3.75Z",
          "M10 13.25L10 17.25"
        ],
        "24": [
          "M16.25 3.75L16.25 5.25A1 1 0 0 1 15.25 6.25L14.25 6.25L14.25 7.26A6 6 0 0 0 16.01 11.51L18.96 14.46A1 1 0 0 1 19.25 15.16L19.25 15.25A1 1 0 0 1 18.25 16.25L5.75 16.25A1 1 0 0 1 4.75 15.25L4.75 15.16A1 1 0 0 1 5.04 14.46L7.99 11.51A6 6 0 0 0 9.75 7.26L9.75 6.25L8.75 6.25A1 1 0 0 1 7.75 5.25L7.75 3.75A1 1 0 0 1 8.75 2.75L15.25 2.75A1 1 0 0 1 16.25 3.75Z",
          "M12 16.25L12 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M12 2.375L12 3.625A1.375 1.375 0 0 1 10.625 5L10 5L10 5.089A1.875 1.875 0 0 0 10.549 6.415L12.597 8.463A1.375 1.375 0 0 1 13 9.436L13 9.625A1.375 1.375 0 0 1 11.625 11L4.375 11A1.375 1.375 0 0 1 3 9.625L3 9.436A1.375 1.375 0 0 1 3.403 8.463L5.451 6.415A1.875 1.875 0 0 0 6 5.089L6 5L5.375 5A1.375 1.375 0 0 1 4 3.625L4 2.375A1.375 1.375 0 0 1 5.375 1L10.625 1A1.375 1.375 0 0 1 12 2.375Z"
          ],
          "stroke": [
            "M8 10.375L8 14.375"
          ]
        },
        "20": {
          "fill": [
            "M15 3.75L15 5.25A1.75 1.75 0 0 1 13.25 7L13 7L13 7.09A3.25 3.25 0 0 0 13.95 9.39L15.49 10.93A1.75 1.75 0 0 1 16 12.16L16 12.25A1.75 1.75 0 0 1 14.25 14L5.75 14A1.75 1.75 0 0 1 4 12.25L4 12.16A1.75 1.75 0 0 1 4.51 10.93L6.05 9.39A3.25 3.25 0 0 0 7 7.09L7 7L6.75 7A1.75 1.75 0 0 1 5 5.25L5 3.75A1.75 1.75 0 0 1 6.75 2L13.25 2A1.75 1.75 0 0 1 15 3.75Z"
          ],
          "stroke": [
            "M10 13.25L10 17.25"
          ]
        },
        "24": {
          "fill": [
            "M17 3.75L17 5.25A1.75 1.75 0 0 1 15.25 7L15 7L15 7.26A5.25 5.25 0 0 0 16.54 10.98L19.49 13.93A1.75 1.75 0 0 1 20 15.16L20 15.25A1.75 1.75 0 0 1 18.25 17L5.75 17A1.75 1.75 0 0 1 4 15.25L4 15.16A1.75 1.75 0 0 1 4.51 13.93L7.46 10.98A5.25 5.25 0 0 0 9 7.26L9 7L8.75 7A1.75 1.75 0 0 1 7 5.25L7 3.75A1.75 1.75 0 0 1 8.75 2L15.25 2A1.75 1.75 0 0 1 17 3.75Z"
          ],
          "stroke": [
            "M12 16.25L12 21.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Upright, straight plate",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "upright",
        "plate"
      ],
      "note": "Stepped cap, straight waist, square shoulder, deep plate - Material's push_pin construction. Cap 10 · 10 · 8 wide, 5 · 5 · 4 tall; waist 6 · 6 · 4 (clear 3 · 3 · 1.5); a flat shoulder steps out to a plate 16 · 12 · 10 wide and 5 · 5 · 4 tall (3.5 · 3.5 · 2.75 between centrelines: 16 sits on the 1.5 inside floor, 24 and 20 take the next whole pixel); body 15 · 12 · 10, needle 5 · 4 · 4. Most mechanical of the five: a spool on a needle.",
      "masters": {
        "16": [
          "M11.375 2.375L11.375 3.625A0.75 0.75 0 0 1 10.625 4.375L9.375 4.375L9.375 7A0.625 0.625 0 0 0 10 7.625L11.625 7.625A0.75 0.75 0 0 1 12.375 8.375L12.375 9.625A0.75 0.75 0 0 1 11.625 10.375L4.375 10.375A0.75 0.75 0 0 1 3.625 9.625L3.625 8.375A0.75 0.75 0 0 1 4.375 7.625L6 7.625A0.625 0.625 0 0 0 6.625 7L6.625 4.375L5.375 4.375A0.75 0.75 0 0 1 4.625 3.625L4.625 2.375A0.75 0.75 0 0 1 5.375 1.625L10.625 1.625A0.75 0.75 0 0 1 11.375 2.375Z",
          "M8 10.375L8 14.375"
        ],
        "20": [
          "M14.25 3.75L14.25 5.25A1 1 0 0 1 13.25 6.25L12.25 6.25L12.25 9A0.75 0.75 0 0 0 13 9.75L14.25 9.75A1 1 0 0 1 15.25 10.75L15.25 12.25A1 1 0 0 1 14.25 13.25L5.75 13.25A1 1 0 0 1 4.75 12.25L4.75 10.75A1 1 0 0 1 5.75 9.75L7 9.75A0.75 0.75 0 0 0 7.75 9L7.75 6.25L6.75 6.25A1 1 0 0 1 5.75 5.25L5.75 3.75A1 1 0 0 1 6.75 2.75L13.25 2.75A1 1 0 0 1 14.25 3.75Z",
          "M10 13.25L10 17.25"
        ],
        "24": [
          "M16.25 3.75L16.25 5.25A1 1 0 0 1 15.25 6.25L14.25 6.25L14.25 12A0.75 0.75 0 0 0 15 12.75L18.25 12.75A1 1 0 0 1 19.25 13.75L19.25 15.25A1 1 0 0 1 18.25 16.25L5.75 16.25A1 1 0 0 1 4.75 15.25L4.75 13.75A1 1 0 0 1 5.75 12.75L9 12.75A0.75 0.75 0 0 0 9.75 12L9.75 6.25L8.75 6.25A1 1 0 0 1 7.75 5.25L7.75 3.75A1 1 0 0 1 8.75 2.75L15.25 2.75A1 1 0 0 1 16.25 3.75Z",
          "M12 16.25L12 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M12 2.375L12 3.625A1.375 1.375 0 0 1 10.625 5L10 5L10 7L11.625 7A1.375 1.375 0 0 1 13 8.375L13 9.625A1.375 1.375 0 0 1 11.625 11L4.375 11A1.375 1.375 0 0 1 3 9.625L3 8.375A1.375 1.375 0 0 1 4.375 7L6 7L6 5L5.375 5A1.375 1.375 0 0 1 4 3.625L4 2.375A1.375 1.375 0 0 1 5.375 1L10.625 1A1.375 1.375 0 0 1 12 2.375Z"
          ],
          "stroke": [
            "M8 10.375L8 14.375"
          ]
        },
        "20": {
          "fill": [
            "M15 3.75L15 5.25A1.75 1.75 0 0 1 13.25 7L13 7L13 9L14.25 9A1.75 1.75 0 0 1 16 10.75L16 12.25A1.75 1.75 0 0 1 14.25 14L5.75 14A1.75 1.75 0 0 1 4 12.25L4 10.75A1.75 1.75 0 0 1 5.75 9L7 9L7 7L6.75 7A1.75 1.75 0 0 1 5 5.25L5 3.75A1.75 1.75 0 0 1 6.75 2L13.25 2A1.75 1.75 0 0 1 15 3.75Z"
          ],
          "stroke": [
            "M10 13.25L10 17.25"
          ]
        },
        "24": {
          "fill": [
            "M17 3.75L17 5.25A1.75 1.75 0 0 1 15.25 7L15 7L15 12L18.25 12A1.75 1.75 0 0 1 20 13.75L20 15.25A1.75 1.75 0 0 1 18.25 17L5.75 17A1.75 1.75 0 0 1 4 15.25L4 13.75A1.75 1.75 0 0 1 5.75 12L9 12L9 7L8.75 7A1.75 1.75 0 0 1 7 5.25L7 3.75A1.75 1.75 0 0 1 8.75 2L15.25 2A1.75 1.75 0 0 1 17 3.75Z"
          ],
          "stroke": [
            "M12 16.25L12 21.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Upright, long needle",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "upright",
        "long needle"
      ],
      "note": "A's construction with a longer needle: the body shrinks to 13 · 10 · 9 tall (cap 10 · 8 · 6 wide, 3.5 · 3 · 2.75 tall; waist 6 · 6 · 4; skirt 5 · 3 · 3) so the needle runs 7 · 6 · 5 below the plate. Corners at 16 on the plate r0.625 so the short plate edge still holds both arcs. More needle reads more \"pinned in\", less \"object\".",
      "masters": {
        "16": [
          "M10.375 2.375L10.375 2.814A0.75 0.75 0 0 1 10.155 3.345L9.558 3.942A0.625 0.625 0 0 0 9.375 4.384L9.375 4.991A0.625 0.625 0 0 0 9.558 5.433L12.192 8.067A0.625 0.625 0 0 1 12.375 8.509L12.375 8.75A0.625 0.625 0 0 1 11.75 9.375L4.25 9.375A0.625 0.625 0 0 1 3.625 8.75L3.625 8.509A0.625 0.625 0 0 1 3.808 8.067L6.442 5.433A0.625 0.625 0 0 0 6.625 4.991L6.625 4.384A0.625 0.625 0 0 0 6.442 3.942L5.845 3.345A0.75 0.75 0 0 1 5.625 2.814L5.625 2.375A0.75 0.75 0 0 1 6.375 1.625L9.625 1.625A0.75 0.75 0 0 1 10.375 2.375Z",
          "M8 9.375L8 14.375"
        ],
        "20": [
          "M13.25 3.75L13.25 3.84A1 1 0 0 1 12.96 4.54L12.47 5.03A0.75 0.75 0 0 0 12.25 5.56L12.25 6.44A0.75 0.75 0 0 0 12.47 6.97L14.96 9.46A1 1 0 0 1 15.25 10.16L15.25 10.25A1 1 0 0 1 14.25 11.25L5.75 11.25A1 1 0 0 1 4.75 10.25L4.75 10.16A1 1 0 0 1 5.04 9.46L7.53 6.97A0.75 0.75 0 0 0 7.75 6.44L7.75 5.56A0.75 0.75 0 0 0 7.53 5.03L7.04 4.54A1 1 0 0 1 6.75 3.84L6.75 3.75A1 1 0 0 1 7.75 2.75L12.25 2.75A1 1 0 0 1 13.25 3.75Z",
          "M10 11.25L10 17.25"
        ],
        "24": [
          "M16.25 3.75L16.25 4.34A1 1 0 0 1 15.96 5.04L14.47 6.53A0.75 0.75 0 0 0 14.25 7.06L14.25 7.44A0.75 0.75 0 0 0 14.47 7.97L18.96 12.46A1 1 0 0 1 19.25 13.16L19.25 13.25A1 1 0 0 1 18.25 14.25L5.75 14.25A1 1 0 0 1 4.75 13.25L4.75 13.16A1 1 0 0 1 5.04 12.46L9.53 7.97A0.75 0.75 0 0 0 9.75 7.44L9.75 7.06A0.75 0.75 0 0 0 9.53 6.53L8.04 5.04A1 1 0 0 1 7.75 4.34L7.75 3.75A1 1 0 0 1 8.75 2.75L15.25 2.75A1 1 0 0 1 16.25 3.75Z",
          "M12 14.25L12 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M11 2.375L11 2.814A1.375 1.375 0 0 1 10.597 3.787L10 4.384L10 4.991L12.634 7.625A1.25 1.25 0 0 1 13 8.509L13 8.75A1.25 1.25 0 0 1 11.75 10L4.25 10A1.25 1.25 0 0 1 3 8.75L3 8.509A1.25 1.25 0 0 1 3.366 7.625L6 4.991L6 4.384L5.403 3.787A1.375 1.375 0 0 1 5 2.814L5 2.375A1.375 1.375 0 0 1 6.375 1L9.625 1A1.375 1.375 0 0 1 11 2.375Z"
          ],
          "stroke": [
            "M8 9.375L8 14.375"
          ]
        },
        "20": {
          "fill": [
            "M14 3.75L14 3.84A1.75 1.75 0 0 1 13.49 5.07L13 5.56L13 6.44L15.49 8.93A1.75 1.75 0 0 1 16 10.16L16 10.25A1.75 1.75 0 0 1 14.25 12L5.75 12A1.75 1.75 0 0 1 4 10.25L4 10.16A1.75 1.75 0 0 1 4.51 8.93L7 6.44L7 5.56L6.51 5.07A1.75 1.75 0 0 1 6 3.84L6 3.75A1.75 1.75 0 0 1 7.75 2L12.25 2A1.75 1.75 0 0 1 14 3.75Z"
          ],
          "stroke": [
            "M10 11.25L10 17.25"
          ]
        },
        "24": {
          "fill": [
            "M17 3.75L17 4.34A1.75 1.75 0 0 1 16.49 5.57L15 7.06L15 7.44L19.49 11.93A1.75 1.75 0 0 1 20 13.16L20 13.25A1.75 1.75 0 0 1 18.25 15L5.75 15A1.75 1.75 0 0 1 4 13.25L4 13.16A1.75 1.75 0 0 1 4.51 11.93L9 7.44L9 7.06L7.51 5.57A1.75 1.75 0 0 1 7 4.34L7 3.75A1.75 1.75 0 0 1 8.75 2L15.25 2A1.75 1.75 0 0 1 17 3.75Z"
          ],
          "stroke": [
            "M12 14.25L12 21.25"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Leaning, cap and flare",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "leaning",
        "skirt"
      ],
      "note": "A turned 45: cap 9.28 · 7.86 · 6.2 across, waist 6.45 · 5.04 · 4.08 (clear 3.45 · 2.04 · 1.58), 45 skirt to a plate 14.94 · 12.11 · 10.09 across; body 15.29 · 11.75 · 10.44 along its axis, needle 4.95 · 3.89 · 3.36. The taper and skirt become flat edges: all four on whole pixels at every master; needle's round end lands on whole pixels at 24. Leaning 45, head top-right, needle to bottom-left, in the square keyline (ink 17.6-17.9 · 13.9-14.2 · 11.9-12.1 across the five). Drawn upright in its own frame with every length a whole multiple of sqrt2 x the grid (0.354 · 0.354 · 0.177), so every corner lands on the grid after the turn, and the 45 edges of the upright body (flare, cap taper) turn into flat horizontal and vertical edges. Those flat edges were moved (a shift of at most 0.25 and a step of the flare or taper along the axis) until their outer edges sit on whole pixels. Radii as the upright ones (corners 1 · 1 · 0.75, inside 0.75 · 0.75 · 0.625). Filled: body one solid on the outline's outer edge, needle a line at 1.5 · 1.5 · 1.25. Off-grid decimals: fillet tangent points and arc ends along the diagonal edges, and the ink box edges, which land on the round corners (irrational by construction).",
      "masters": {
        "16": [
          "M13.095 6.405L12.345 7.155A0.75 0.75 0 0 1 11.814 7.375L10.884 7.375A0.625 0.625 0 0 0 10.442 7.558L9.558 8.442A0.625 0.625 0 0 0 9.375 8.884L9.375 12.564A0.75 0.75 0 0 1 9.155 13.095L9.03 13.22A0.75 0.75 0 0 1 7.97 13.22L2.78 8.03A0.75 0.75 0 0 1 2.78 6.97L2.905 6.845A0.75 0.75 0 0 1 3.436 6.625L7.116 6.625A0.625 0.625 0 0 0 7.558 6.442L8.442 5.558A0.625 0.625 0 0 0 8.625 5.116L8.625 4.186A0.75 0.75 0 0 1 8.845 3.655L9.595 2.905A0.75 0.75 0 0 1 10.655 2.905L13.095 5.345A0.75 0.75 0 0 1 13.095 6.405Z",
          "M5.375 10.625L3 13"
        ],
        "20": [
          "M16.04 8.46L15.54 8.96A1 1 0 0 1 14.84 9.25L13.56 9.25A0.75 0.75 0 0 0 13.03 9.47L12.47 10.03A0.75 0.75 0 0 0 12.25 10.56L12.25 14.84A1 1 0 0 1 11.96 15.54L11.71 15.79A1 1 0 0 1 10.29 15.79L4.21 9.71A1 1 0 0 1 4.21 8.29L4.46 8.04A1 1 0 0 1 5.16 7.75L9.44 7.75A0.75 0.75 0 0 0 9.97 7.53L10.53 6.97A0.75 0.75 0 0 0 10.75 6.44L10.75 5.16A1 1 0 0 1 11.04 4.46L11.54 3.96A1 1 0 0 1 12.96 3.96L16.04 7.04A1 1 0 0 1 16.04 8.46Z",
          "M7.25 12.75L4.5 15.5"
        ],
        "24": [
          "M20.04 9.46L19.54 9.96A1 1 0 0 1 18.84 10.25L17.56 10.25A0.75 0.75 0 0 0 17.03 10.47L14.47 13.03A0.75 0.75 0 0 0 14.25 13.56L14.25 18.84A1 1 0 0 1 13.96 19.54L13.71 19.79A1 1 0 0 1 12.29 19.79L4.21 11.71A1 1 0 0 1 4.21 10.29L4.46 10.04A1 1 0 0 1 5.16 9.75L10.44 9.75A0.75 0.75 0 0 0 10.97 9.53L13.53 6.97A0.75 0.75 0 0 0 13.75 6.44L13.75 5.16A1 1 0 0 1 14.04 4.46L14.54 3.96A1 1 0 0 1 15.96 3.96L20.04 8.04A1 1 0 0 1 20.04 9.46Z",
          "M8.25 15.75L4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M13.537 6.847L12.787 7.597A1.375 1.375 0 0 1 11.814 8L10.884 8L10 8.884L10 12.564A1.375 1.375 0 0 1 9.597 13.537L9.472 13.662A1.375 1.375 0 0 1 7.528 13.662L2.338 8.472A1.375 1.375 0 0 1 2.338 6.528L2.463 6.403A1.375 1.375 0 0 1 3.436 6L7.116 6L8 5.116L8 4.186A1.375 1.375 0 0 1 8.403 3.213L9.153 2.463A1.375 1.375 0 0 1 11.097 2.463L13.537 4.903A1.375 1.375 0 0 1 13.537 6.847Z"
          ],
          "stroke": [
            "M5.375 10.625L3 13"
          ]
        },
        "20": {
          "fill": [
            "M16.57 8.99L16.07 9.49A1.75 1.75 0 0 1 14.84 10L13.56 10L13 10.56L13 14.84A1.75 1.75 0 0 1 12.49 16.07L12.24 16.32A1.75 1.75 0 0 1 9.76 16.32L3.68 10.24A1.75 1.75 0 0 1 3.68 7.76L3.93 7.51A1.75 1.75 0 0 1 5.16 7L9.44 7L10 6.44L10 5.16A1.75 1.75 0 0 1 10.51 3.93L11.01 3.43A1.75 1.75 0 0 1 13.49 3.43L16.57 6.51A1.75 1.75 0 0 1 16.57 8.99Z"
          ],
          "stroke": [
            "M7.25 12.75L4.5 15.5"
          ]
        },
        "24": {
          "fill": [
            "M20.57 9.99L20.07 10.49A1.75 1.75 0 0 1 18.84 11L17.56 11L15 13.56L15 18.84A1.75 1.75 0 0 1 14.49 20.07L14.24 20.32A1.75 1.75 0 0 1 11.76 20.32L3.68 12.24A1.75 1.75 0 0 1 3.68 9.76L3.93 9.51A1.75 1.75 0 0 1 5.16 9L10.44 9L13 6.44L13 5.16A1.75 1.75 0 0 1 13.51 3.93L14.01 3.43A1.75 1.75 0 0 1 16.49 3.43L20.57 7.51A1.75 1.75 0 0 1 20.57 9.99Z"
          ],
          "stroke": [
            "M8.25 15.75L4.75 19.25"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "Leaning, curved flare",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "leaning",
        "curved"
      ],
      "note": "C turned 45: stepped cap 9.99 · 8.57 · 6.91 across and 4.68 · 4.68 · 4.08 deep, waist 6.45 · 5.04 · 4.08 (clear 3.45 · 2.04 · 1.58), curved flare (r5 · 3.25 · 2.5) into a plate 14.94 · 12.11 · 10.09; body 14.94 · 11.75 · 10.09, needle 4.95 · 3.89 · 3.36; the needle's round end on whole pixels at 24. The flare's flat run is on whole pixels at 24 and 16, a half pixel off at 20 (no shift within 0.36 of the centre fixed it). Leaning 45, head top-right, needle to bottom-left, in the square keyline (ink 17.6-17.9 · 13.9-14.2 · 11.9-12.1 across the five). Drawn upright in its own frame with every length a whole multiple of sqrt2 x the grid (0.354 · 0.354 · 0.177), so every corner lands on the grid after the turn, and the 45 edges of the upright body (flare, cap taper) turn into flat horizontal and vertical edges. Those flat edges were moved (a shift of at most 0.25 and a step of the flare or taper along the axis) until their outer edges sit on whole pixels. Radii as the upright ones (corners 1 · 1 · 0.75, inside 0.75 · 0.75 · 0.625). Filled: body one solid on the outline's outer edge, needle a line at 1.5 · 1.5 · 1.25. Off-grid decimals: fillet tangent points and arc ends along the diagonal edges, and the ink box edges, which land on the round corners (irrational by construction).",
      "masters": {
        "16": [
          "M13.095 6.905L12.155 7.845A0.75 0.75 0 0 1 11.095 7.845L10.625 7.375L10.107 7.893A2.5 2.5 0 0 0 9.375 9.661L9.375 12.564A0.75 0.75 0 0 1 9.155 13.095L9.03 13.22A0.75 0.75 0 0 1 7.97 13.22L2.78 8.03A0.75 0.75 0 0 1 2.78 6.97L2.905 6.845A0.75 0.75 0 0 1 3.436 6.625L6.339 6.625A2.5 2.5 0 0 0 8.107 5.893L8.625 5.375L8.155 4.905A0.75 0.75 0 0 1 8.155 3.845L9.095 2.905A0.75 0.75 0 0 1 10.155 2.905L13.095 5.845A0.75 0.75 0 0 1 13.095 6.905Z",
          "M5.375 10.625L3 13"
        ],
        "20": [
          "M16.04 8.96L15.21 9.79A1 1 0 0 1 13.79 9.79L13.25 9.25L12.7 9.8A3.25 3.25 0 0 0 11.75 12.1L11.75 15.34A1 1 0 0 1 11.46 16.04A1 1 0 0 1 10.04 16.04L3.96 9.96A1 1 0 0 1 3.96 8.54A1 1 0 0 1 4.66 8.25L7.9 8.25A3.25 3.25 0 0 0 10.2 7.3L10.75 6.75L10.21 6.21A1 1 0 0 1 10.21 4.79L11.04 3.96A1 1 0 0 1 12.46 3.96L16.04 7.54A1 1 0 0 1 16.04 8.96Z",
          "M7 13L4.25 15.75"
        ],
        "24": [
          "M20.04 9.96L19.21 10.79A1 1 0 0 1 17.79 10.79L17.25 10.25L15.71 11.79A5 5 0 0 0 14.25 15.32L14.25 18.84A1 1 0 0 1 13.96 19.54L13.71 19.79A1 1 0 0 1 12.29 19.79L4.21 11.71A1 1 0 0 1 4.21 10.29L4.46 10.04A1 1 0 0 1 5.16 9.75L8.68 9.75A5 5 0 0 0 12.21 8.29L13.75 6.75L13.21 6.21A1 1 0 0 1 13.21 4.79L14.04 3.96A1 1 0 0 1 15.46 3.96L20.04 8.54A1 1 0 0 1 20.04 9.96Z",
          "M8.25 15.75L4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M13.537 7.347L12.597 8.287A1.375 1.375 0 0 1 10.653 8.287L10.625 8.259L10.549 8.335A1.875 1.875 0 0 0 10 9.661L10 12.564A1.375 1.375 0 0 1 9.597 13.537L9.472 13.662A1.375 1.375 0 0 1 7.528 13.662L2.338 8.472A1.375 1.375 0 0 1 2.338 6.528L2.463 6.403A1.375 1.375 0 0 1 3.436 6L6.339 6A1.875 1.875 0 0 0 7.665 5.451L7.741 5.375L7.713 5.347A1.375 1.375 0 0 1 7.713 3.403L8.653 2.463A1.375 1.375 0 0 1 10.597 2.463L13.537 5.403A1.375 1.375 0 0 1 13.537 7.347Z"
          ],
          "stroke": [
            "M5.375 10.625L3 13"
          ]
        },
        "20": {
          "fill": [
            "M16.57 9.49L15.74 10.32A1.75 1.75 0 0 1 13.26 10.32L13.25 10.31L13.23 10.33A2.5 2.5 0 0 0 12.5 12.1L12.5 15.34A1.75 1.75 0 0 1 11.99 16.57A1.75 1.75 0 0 1 9.51 16.57L3.43 10.49A1.75 1.75 0 0 1 3.43 8.01A1.75 1.75 0 0 1 4.66 7.5L7.9 7.5A2.5 2.5 0 0 0 9.67 6.77L9.69 6.75L9.68 6.74A1.75 1.75 0 0 1 9.68 4.26L10.51 3.43A1.75 1.75 0 0 1 12.99 3.43L16.57 7.01A1.75 1.75 0 0 1 16.57 9.49Z"
          ],
          "stroke": [
            "M7 13L4.25 15.75"
          ]
        },
        "24": {
          "fill": [
            "M20.57 10.49L19.74 11.32A1.75 1.75 0 0 1 17.26 11.32L17.25 11.31L16.24 12.32A4.25 4.25 0 0 0 15 15.32L15 18.84A1.75 1.75 0 0 1 14.49 20.07L14.24 20.32A1.75 1.75 0 0 1 11.76 20.32L3.68 12.24A1.75 1.75 0 0 1 3.68 9.76L3.93 9.51A1.75 1.75 0 0 1 5.16 9L8.68 9A4.25 4.25 0 0 0 11.68 7.76L12.69 6.75L12.68 6.74A1.75 1.75 0 0 1 12.68 4.26L13.51 3.43A1.75 1.75 0 0 1 15.99 3.43L20.57 8.01A1.75 1.75 0 0 1 20.57 10.49Z"
          ],
          "stroke": [
            "M8.25 15.75L4.75 19.25"
          ]
        }
      }
    },
    {
      "id": "H",
      "label": "Leaning, straight plate",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "leaning",
        "plate"
      ],
      "note": "D turned 45: stepped cap 9.99 · 8.57 · 6.91 across, waist 6.45 · 5.04 · 4.08, square shoulder to a plate 14.94 · 12.11 · 10.09 across and 4.68 · 4.68 · 4.08 deep; needle 4.95 · 3.89 · 3.36. Every edge is diagonal, so nothing snaps to the pixel grid; at 16 the cap and plate read as two crossed bars. Leaning 45, head top-right, needle to bottom-left, in the square keyline (ink 17.6-17.9 · 13.9-14.2 · 11.9-12.1 across the five). Drawn upright in its own frame with every length a whole multiple of sqrt2 x the grid (0.354 · 0.354 · 0.177), so every corner lands on the grid after the turn, and the 45 edges of the upright body (flare, cap taper) turn into flat horizontal and vertical edges. Those flat edges were moved (a shift of at most 0.25 and a step of the flare or taper along the axis) until their outer edges sit on whole pixels. Radii as the upright ones (corners 1 · 1 · 0.75, inside 0.75 · 0.75 · 0.625). Filled: body one solid on the outline's outer edge, needle a line at 1.5 · 1.5 · 1.25. Off-grid decimals: fillet tangent points and arc ends along the diagonal edges, and the ink box edges, which land on the round corners (irrational by construction).",
      "masters": {
        "16": [
          "M13.22 6.905L12.28 7.845A0.75 0.75 0 0 1 11.22 7.845L10.75 7.375L8.942 9.183A0.625 0.625 0 0 0 8.942 10.067L10.095 11.22A0.75 0.75 0 0 1 10.095 12.28L9.155 13.22A0.75 0.75 0 0 1 8.095 13.22L2.905 8.03A0.75 0.75 0 0 1 2.905 6.97L3.845 6.03A0.75 0.75 0 0 1 4.905 6.03L6.058 7.183A0.625 0.625 0 0 0 6.942 7.183L8.75 5.375L8.28 4.905A0.75 0.75 0 0 1 8.28 3.845L9.22 2.905A0.75 0.75 0 0 1 10.28 2.905L13.22 5.845A0.75 0.75 0 0 1 13.22 6.905Z",
          "M5.5 10.625L3.125 13"
        ],
        "20": [
          "M16.04 8.96L15.21 9.79A1 1 0 0 1 13.79 9.79L13.25 9.25L11.03 11.47A0.75 0.75 0 0 0 11.03 12.53L12.29 13.79A1 1 0 0 1 12.29 15.21L11.46 16.04A1 1 0 0 1 10.04 16.04L3.96 9.96A1 1 0 0 1 3.96 8.54L4.79 7.71A1 1 0 0 1 6.21 7.71L7.47 8.97A0.75 0.75 0 0 0 8.53 8.97L10.75 6.75L10.21 6.21A1 1 0 0 1 10.21 4.79L11.04 3.96A1 1 0 0 1 12.46 3.96L16.04 7.54A1 1 0 0 1 16.04 8.96Z",
          "M7 13L4.25 15.75"
        ],
        "24": [
          "M20.04 9.96L19.21 10.79A1 1 0 0 1 17.79 10.79L17.25 10.25L12.78 14.72A0.75 0.75 0 0 0 12.78 15.78L14.54 17.54A1 1 0 0 1 14.54 18.96L13.71 19.79A1 1 0 0 1 12.29 19.79L4.21 11.71A1 1 0 0 1 4.21 10.29L5.04 9.46A1 1 0 0 1 6.46 9.46L8.22 11.22A0.75 0.75 0 0 0 9.28 11.22L13.75 6.75L13.21 6.21A1 1 0 0 1 13.21 4.79L14.04 3.96A1 1 0 0 1 15.46 3.96L20.04 8.54A1 1 0 0 1 20.04 9.96Z",
          "M8.25 15.75L4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M13.662 7.347L12.722 8.287A1.375 1.375 0 0 1 10.778 8.287L10.75 8.259L9.384 9.625L10.537 10.778A1.375 1.375 0 0 1 10.537 12.722L9.597 13.662A1.375 1.375 0 0 1 7.653 13.662L2.463 8.472A1.375 1.375 0 0 1 2.463 6.528L3.403 5.588A1.375 1.375 0 0 1 5.347 5.588L6.5 6.741L7.866 5.375L7.838 5.347A1.375 1.375 0 0 1 7.838 3.403L8.778 2.463A1.375 1.375 0 0 1 10.722 2.463L13.662 5.403A1.375 1.375 0 0 1 13.662 7.347Z"
          ],
          "stroke": [
            "M5.5 10.625L3.125 13"
          ]
        },
        "20": {
          "fill": [
            "M16.57 9.49L15.74 10.32A1.75 1.75 0 0 1 13.26 10.32L13.25 10.31L11.56 12L12.82 13.26A1.75 1.75 0 0 1 12.82 15.74L11.99 16.57A1.75 1.75 0 0 1 9.51 16.57L3.43 10.49A1.75 1.75 0 0 1 3.43 8.01L4.26 7.18A1.75 1.75 0 0 1 6.74 7.18L8 8.44L9.69 6.75L9.68 6.74A1.75 1.75 0 0 1 9.68 4.26L10.51 3.43A1.75 1.75 0 0 1 12.99 3.43L16.57 7.01A1.75 1.75 0 0 1 16.57 9.49Z"
          ],
          "stroke": [
            "M7 13L4.25 15.75"
          ]
        },
        "24": {
          "fill": [
            "M20.57 10.49L19.74 11.32A1.75 1.75 0 0 1 17.26 11.32L17.25 11.31L13.31 15.25L15.07 17.01A1.75 1.75 0 0 1 15.07 19.49L14.24 20.32A1.75 1.75 0 0 1 11.76 20.32L3.68 12.24A1.75 1.75 0 0 1 3.68 9.76L4.51 8.93A1.75 1.75 0 0 1 6.99 8.93L8.75 10.69L12.69 6.75L12.68 6.74A1.75 1.75 0 0 1 12.68 4.26L13.51 3.43A1.75 1.75 0 0 1 15.99 3.43L20.57 8.01A1.75 1.75 0 0 1 20.57 10.49Z"
          ],
          "stroke": [
            "M8.25 15.75L4.75 19.25"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Leaning, long needle",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "leaning",
        "long needle"
      ],
      "note": "The leaning pin with a long needle: a smaller body (cap 8.57 · 7.16 · 5.85 across, waist 5.74 · 5.04 · 4.08, plate 13.52 · 10.69 · 9.03; body 12.81 · 9.99 · 8.67 along the axis) and a needle of 8.49 · 7.07 · 6.01, which sets the ink box's bottom-left corner. Taper and skirt edges on whole pixels at every master; the needle's round end on whole pixels at 20 and 16. The diagonal needle is what says \"pin\" at 16. Leaning 45, head top-right, needle to bottom-left, in the square keyline (ink 17.6-17.9 · 13.9-14.2 · 11.9-12.1 across the five). Drawn upright in its own frame with every length a whole multiple of sqrt2 x the grid (0.354 · 0.354 · 0.177), so every corner lands on the grid after the turn, and the 45 edges of the upright body (flare, cap taper) turn into flat horizontal and vertical edges. Those flat edges were moved (a shift of at most 0.25 and a step of the flare or taper along the axis) until their outer edges sit on whole pixels. Radii as the upright ones (corners 1 · 1 · 0.75, inside 0.75 · 0.75 · 0.625). Filled: body one solid on the outline's outer edge, needle a line at 1.5 · 1.5 · 1.25. Off-grid decimals: fillet tangent points and arc ends along the diagonal edges, and the ink box edges, which land on the round corners (irrational by construction).",
      "masters": {
        "16": [
          "M13.22 6.03L13.095 6.155A0.75 0.75 0 0 1 12.564 6.375L11.884 6.375A0.625 0.625 0 0 0 11.442 6.558L10.558 7.442A0.625 0.625 0 0 0 10.375 7.884L10.375 10.814A0.75 0.75 0 0 1 10.155 11.345A0.75 0.75 0 0 1 9.095 11.345L4.655 6.905A0.75 0.75 0 0 1 4.655 5.845A0.75 0.75 0 0 1 5.186 5.625L8.116 5.625A0.625 0.625 0 0 0 8.558 5.442L9.442 4.558A0.625 0.625 0 0 0 9.625 4.116L9.625 3.436A0.75 0.75 0 0 1 9.845 2.905L9.97 2.78A0.75 0.75 0 0 1 11.03 2.78L13.22 4.97A0.75 0.75 0 0 1 13.22 6.03Z",
          "M6.875 9.125L2.625 13.375"
        ],
        "20": [
          "M16.04 7.96A1 1 0 0 1 15.34 8.25L14.56 8.25A0.75 0.75 0 0 0 14.03 8.47L13.47 9.03A0.75 0.75 0 0 0 13.25 9.56L13.25 12.84A1 1 0 0 1 12.96 13.54L12.71 13.79A1 1 0 0 1 11.29 13.79L6.21 8.71A1 1 0 0 1 6.21 7.29L6.46 7.04A1 1 0 0 1 7.16 6.75L10.44 6.75A0.75 0.75 0 0 0 10.97 6.53L11.53 5.97A0.75 0.75 0 0 0 11.75 5.44L11.75 4.66A1 1 0 0 1 12.04 3.96A1 1 0 0 1 13.46 3.96L16.04 6.54A1 1 0 0 1 16.04 7.96Z",
          "M8.75 11.25L3.75 16.25"
        ],
        "24": [
          "M19.79 9.21L19.04 9.96A1 1 0 0 1 18.34 10.25L17.06 10.25A0.75 0.75 0 0 0 16.53 10.47L15.47 11.53A0.75 0.75 0 0 0 15.25 12.06L15.25 16.84A1 1 0 0 1 14.96 17.54A1 1 0 0 1 13.54 17.54L6.46 10.46A1 1 0 0 1 6.46 9.04A1 1 0 0 1 7.16 8.75L11.94 8.75A0.75 0.75 0 0 0 12.47 8.53L13.53 7.47A0.75 0.75 0 0 0 13.75 6.94L13.75 5.66A1 1 0 0 1 14.04 4.96L14.79 4.21A1 1 0 0 1 16.21 4.21L19.79 7.79A1 1 0 0 1 19.79 9.21Z",
          "M10 14L4 20"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M13.662 6.472L13.537 6.597A1.375 1.375 0 0 1 12.564 7L11.884 7L11 7.884L11 10.814A1.375 1.375 0 0 1 10.597 11.787A1.375 1.375 0 0 1 8.653 11.787L4.213 7.347A1.375 1.375 0 0 1 4.213 5.403A1.375 1.375 0 0 1 5.186 5L8.116 5L9 4.116L9 3.436A1.375 1.375 0 0 1 9.403 2.463L9.528 2.338A1.375 1.375 0 0 1 11.472 2.338L13.662 4.528A1.375 1.375 0 0 1 13.662 6.472Z"
          ],
          "stroke": [
            "M6.875 9.125L2.625 13.375"
          ]
        },
        "20": {
          "fill": [
            "M16.57 8.49A1.75 1.75 0 0 1 15.34 9L14.56 9L14 9.56L14 12.84A1.75 1.75 0 0 1 13.49 14.07L13.24 14.32A1.75 1.75 0 0 1 10.76 14.32L5.68 9.24A1.75 1.75 0 0 1 5.68 6.76L5.93 6.51A1.75 1.75 0 0 1 7.16 6L10.44 6L11 5.44L11 4.66A1.75 1.75 0 0 1 11.51 3.43A1.75 1.75 0 0 1 13.99 3.43L16.57 6.01A1.75 1.75 0 0 1 16.57 8.49Z"
          ],
          "stroke": [
            "M8.75 11.25L3.75 16.25"
          ]
        },
        "24": {
          "fill": [
            "M20.32 9.74L19.57 10.49A1.75 1.75 0 0 1 18.34 11L17.06 11L16 12.06L16 16.84A1.75 1.75 0 0 1 15.49 18.07A1.75 1.75 0 0 1 13.01 18.07L5.93 10.99A1.75 1.75 0 0 1 5.93 8.51A1.75 1.75 0 0 1 7.16 8L11.94 8L13 6.94L13 5.66A1.75 1.75 0 0 1 13.51 4.43L14.26 3.68A1.75 1.75 0 0 1 16.74 3.68L20.32 7.26A1.75 1.75 0 0 1 20.32 9.74Z"
          ],
          "stroke": [
            "M10 14L4 20"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Leaning tack, no cap",
      "tags": [
        "pushpin",
        "thumbtack",
        "keep",
        "leaning",
        "tack",
        "capless"
      ],
      "note": "B turned 45: no cap, a rounded post 7.86 · 6.45 · 5.49 across (top corners r1.5 · 1.25 · 1), 45 skirt to a plate 14.94 · 12.11 · 10.09; body 16 · 12.81 · 10.8, needle 4.95 · 3.89 · 3.36. Skirt edges on whole pixels at every master. Reads like a pen nib or shuttlecock as much as a pin. Leaning 45, head top-right, needle to bottom-left, in the square keyline (ink 17.6-17.9 · 13.9-14.2 · 11.9-12.1 across the five). Drawn upright in its own frame with every length a whole multiple of sqrt2 x the grid (0.354 · 0.354 · 0.177), so every corner lands on the grid after the turn, and the 45 edges of the upright body (flare, cap taper) turn into flat horizontal and vertical edges. Those flat edges were moved (a shift of at most 0.25 and a step of the flare or taper along the axis) until their outer edges sit on whole pixels. Radii as the upright ones (corners 1 · 1 · 0.75, inside 0.75 · 0.75 · 0.625). Filled: body one solid on the outline's outer edge, needle a line at 1.5 · 1.5 · 1.25. Off-grid decimals: fillet tangent points and arc ends along the diagonal edges, and the ink box edges, which land on the round corners (irrational by construction).",
      "masters": {
        "16": [
          "M13.043 5.957L9.558 9.442A0.625 0.625 0 0 0 9.375 9.884L9.375 12.564A0.75 0.75 0 0 1 9.155 13.095A0.75 0.75 0 0 1 8.095 13.095L2.905 7.905A0.75 0.75 0 0 1 2.905 6.845A0.75 0.75 0 0 1 3.436 6.625L6.116 6.625A0.625 0.625 0 0 0 6.558 6.442L10.043 2.957A1 1 0 0 1 11.457 2.957L13.043 4.543A1 1 0 0 1 13.043 5.957Z",
          "M5.5 10.5L3.125 12.875"
        ],
        "20": [
          "M15.87 7.63L12.47 11.03A0.75 0.75 0 0 0 12.25 11.56L12.25 14.84A1 1 0 0 1 11.96 15.54L11.46 16.04A1 1 0 0 1 10.04 16.04L3.96 9.96A1 1 0 0 1 3.96 8.54L4.46 8.04A1 1 0 0 1 5.16 7.75L8.44 7.75A0.75 0.75 0 0 0 8.97 7.53L12.37 4.13A1.25 1.25 0 0 1 14.13 4.13L15.87 5.87A1.25 1.25 0 0 1 15.87 7.63Z",
          "M7 13L4.25 15.75"
        ],
        "24": [
          "M19.69 8.81L14.47 14.03A0.75 0.75 0 0 0 14.25 14.56L14.25 18.84A1 1 0 0 1 13.96 19.54L13.71 19.79A1 1 0 0 1 12.29 19.79L4.21 11.71A1 1 0 0 1 4.21 10.29L4.46 10.04A1 1 0 0 1 5.16 9.75L9.44 9.75A0.75 0.75 0 0 0 9.97 9.53L15.19 4.31A1.5 1.5 0 0 1 17.31 4.31L19.69 6.69A1.5 1.5 0 0 1 19.69 8.81Z",
          "M8.25 15.75L4.75 19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M13.485 6.399L10 9.884L10 12.564A1.375 1.375 0 0 1 9.597 13.537A1.375 1.375 0 0 1 7.653 13.537L2.463 8.347A1.375 1.375 0 0 1 2.463 6.403A1.375 1.375 0 0 1 3.436 6L6.116 6L9.601 2.515A1.625 1.625 0 0 1 11.899 2.515L13.485 4.101A1.625 1.625 0 0 1 13.485 6.399Z"
          ],
          "stroke": [
            "M5.5 10.5L3.125 12.875"
          ]
        },
        "20": {
          "fill": [
            "M16.4 8.16L13 11.56L13 14.84A1.75 1.75 0 0 1 12.49 16.07L11.99 16.57A1.75 1.75 0 0 1 9.51 16.57L3.43 10.49A1.75 1.75 0 0 1 3.43 8.01L3.93 7.51A1.75 1.75 0 0 1 5.16 7L8.44 7L11.84 3.6A2 2 0 0 1 14.66 3.6L16.4 5.34A2 2 0 0 1 16.4 8.16Z"
          ],
          "stroke": [
            "M7 13L4.25 15.75"
          ]
        },
        "24": {
          "fill": [
            "M20.22 9.34L15 14.56L15 18.84A1.75 1.75 0 0 1 14.49 20.07L14.24 20.32A1.75 1.75 0 0 1 11.76 20.32L3.68 12.24A1.75 1.75 0 0 1 3.68 9.76L3.93 9.51A1.75 1.75 0 0 1 5.16 9L9.44 9L14.66 3.78A2.25 2.25 0 0 1 17.84 3.78L20.22 6.16A2.25 2.25 0 0 1 20.22 9.34Z"
          ],
          "stroke": [
            "M8.25 15.75L4.75 19.25"
          ]
        }
      }
    }
  ]
};
