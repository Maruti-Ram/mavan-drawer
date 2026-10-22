// wifi: the base every wifi-* icon inherits (wifi-off's C21 bar first), and it sits beside live, podcast, radio-tower and rss, which already speak in arcs — so this picks how Wi-Fi is told apart from them at 16 and what its filled twin can be.
export default {
  "concept": "wifi",
  "question": "Which picture says Wi-Fi: arcs over a dot (A three, B two), arcs over a wedge (C), the fan (D), or a router sending it (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Three arcs over a dot",
      "tags": [
        "wireless",
        "internet",
        "three arcs",
        "dot"
      ],
      "note": "Rhythm: live's dot and radii with one more arc — dot ⌀3 · 2.5 · 2, arcs r5 / 9.25 / 13.5 · 3.75 / 7 / 10.25 · 3.125 / 5.875 / 8.625, pitch 4.25 · 3.25 · 2.75, and the air is the same everywhere it occurs: dot to arc and arc to arc 2.75 · 1.75 · 1.5 (24 is live's 2.75 exactly; 16 sits on the 1.5 floor, so three arcs hold without squeezing and none is dropped). All three arcs end on one radial line, the outer cap landing on the keyline's sides: 46.8 · 45.0 · 42.3° above level. Ink 20×15.75 · 16×12.25 · 14×10.25, landscape keyline, box centre 0.125 below the canvas centre at every master. Balance: a fan is heavy at the top — ink mass sits 2.0 · 1.46 · 1.17 above the canvas centre; by C14's solid-triangle measure (half the mass offset, toward the point) a 1.0 · 0.73 · 0.58 shift down would be the starting point for an optical-sheet pass once the picture is chosen; not shifted here. Filled: as live — the dot thickens in place to ⌀4 · 3 · 2 (air 2.25 · 1.5 · 1.5) and the arcs stay lines at 1.5 · 1.5 · 1.25. The dot is the bottom edge, so it grows the box 0.5 · 0.25 · 0 at the bottom (declared `grows`). A heavier-line twin (rss's way) cannot exist: three arcs at weight 2 with 1.5 of air need 12.5 of height at 20 and 16 inside 12 · 10. At 16 the filled twin is the outline drawing — the dot has no room to grow — so it reads lighter than its filled neighbours there. Who: Lucide, Heroicons, Phosphor (regular), Fluent wifi_1, Carbon, Polaris, Tabler. wifi-off: the C21 `\\` bar crosses the three arcs and passes the dot; room on both sides. (recommended) — the picture nearly every set draws for Wi-Fi, built on live's own radii and air, so it sits in the set as one family with live, podcast and radio-tower.",
      "grows": {
        "20": [
          0,
          0,
          0,
          0.25
        ],
        "24": [
          0,
          0,
          0,
          0.5
        ]
      },
      "masters": {
        "16": [
          "M7.625 12.25A0.375 0.375 0 1 0 8.375 12.25A0.375 0.375 0 1 0 7.625 12.25Z",
          "M5.69 10.145A3.125 3.125 0 0 1 10.31 10.145",
          "M3.658 8.293A5.875 5.875 0 0 1 12.342 8.293",
          "M1.625 6.441A8.625 8.625 0 0 1 14.375 6.441"
        ],
        "20": [
          "M9.5 15A0.5 0.5 0 1 0 10.5 15A0.5 0.5 0 1 0 9.5 15Z",
          "M7.35 12.35A3.75 3.75 0 0 1 12.65 12.35",
          "M5.05 10.05A7 7 0 0 1 14.95 10.05",
          "M2.75 7.75A10.25 10.25 0 0 1 17.25 7.75"
        ],
        "24": [
          "M11.25 18.5A0.75 0.75 0 1 0 12.75 18.5A0.75 0.75 0 1 0 11.25 18.5Z",
          "M8.57 14.86A5 5 0 0 1 15.43 14.86",
          "M5.66 11.76A9.25 9.25 0 0 1 18.34 11.76",
          "M2.75 8.67A13.5 13.5 0 0 1 21.25 8.67"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7 12.25A1 1 0 1 0 9 12.25A1 1 0 1 0 7 12.25Z"
          ],
          "stroke": [
            "M5.69 10.145A3.125 3.125 0 0 1 10.31 10.145",
            "M3.658 8.293A5.875 5.875 0 0 1 12.342 8.293",
            "M1.625 6.441A8.625 8.625 0 0 1 14.375 6.441"
          ]
        },
        "20": {
          "fill": [
            "M8.5 15A1.5 1.5 0 1 0 11.5 15A1.5 1.5 0 1 0 8.5 15Z"
          ],
          "stroke": [
            "M7.35 12.35A3.75 3.75 0 0 1 12.65 12.35",
            "M5.05 10.05A7 7 0 0 1 14.95 10.05",
            "M2.75 7.75A10.25 10.25 0 0 1 17.25 7.75"
          ]
        },
        "24": {
          "fill": [
            "M10 18.5A2 2 0 1 0 14 18.5A2 2 0 1 0 10 18.5Z"
          ],
          "stroke": [
            "M8.57 14.86A5 5 0 0 1 15.43 14.86",
            "M5.66 11.76A9.25 9.25 0 0 1 18.34 11.76",
            "M2.75 8.67A13.5 13.5 0 0 1 21.25 8.67"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Two arcs over a dot",
      "tags": [
        "wireless",
        "two arcs",
        "dot"
      ],
      "note": "Rhythm: one arc fewer than A, so the air opens to rss's measure — dot ⌀3 · 2.5 · 2, arcs r7.25 / 13.75 · 5.25 / 10 · 4.375 / 8.375, air dot to arc = arc to arc 5 · 3.25 · 2.75 (pitch 6.5 · 4.75 · 4; rss: 5.94 / 5.75 · 3.94 / 3.75 · 3.37 / 3.38). Ends on one radial line, outer cap on the keyline's sides: 47.7 · 43.5 · 40.4° above level. Ink 20×16 · 16×12 · 14×10, landscape keyline exactly, box-centred; at 16 the dot sits on whole pixels (7–9, 11–13). Balance: ink mass 2.55 · 1.8 · 1.48 above the canvas centre (the two long arcs carry it); not shifted. Filled: line-heavy, rss's way — weight 2.5 · 2 · 2, dot ⌀4 · 3.5 · 2.5, arcs r6.75 / 12.75 · 5 / 9.25 · 4 / 7.75 about a centre lifted 0.5 · 0.5 · 0.25 so the dot keeps the bottom edge and the outer arc the top; air 3.5 · 2.25 · 1.75 everywhere; ends 46.7 · 40.8 · 39.3° above level. Ink box identical in both styles. The only fan here whose filled twin is visibly heavier at every master, 16 included. Who: Nucleo wifi (18 and 12 grids; Nucleo draws its dot as a ring at 18). A clearly different construction of A's picture rather than a new metaphor. wifi-off: the bar has the most room here.",
      "masters": {
        "16": [
          "M7.625 12A0.375 0.375 0 1 0 8.375 12A0.375 0.375 0 1 0 7.625 12Z",
          "M4.67 9.163A4.375 4.375 0 0 1 11.33 9.163",
          "M1.625 6.569A8.375 8.375 0 0 1 14.375 6.569"
        ],
        "20": [
          "M9.5 14.75A0.5 0.5 0 1 0 10.5 14.75A0.5 0.5 0 1 0 9.5 14.75Z",
          "M6.19 11.13A5.25 5.25 0 0 1 13.81 11.13",
          "M2.75 7.86A10 10 0 0 1 17.25 7.86"
        ],
        "24": [
          "M11.25 18.5A0.75 0.75 0 1 0 12.75 18.5A0.75 0.75 0 1 0 11.25 18.5Z",
          "M7.12 13.14A7.25 7.25 0 0 1 16.88 13.14",
          "M2.75 8.33A13.75 13.75 0 0 1 21.25 8.33"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M7.75 11.75A0.25 0.25 0 1 0 8.25 11.75A0.25 0.25 0 1 0 7.75 11.75Z",
            "M4.903 9.218A4 4 0 0 1 11.097 9.218",
            "M2 6.845A7.75 7.75 0 0 1 14 6.845"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M9.25 14.25A0.75 0.75 0 1 0 10.75 14.25A0.75 0.75 0 1 0 9.25 14.25Z",
            "M6.22 10.98A5 5 0 0 1 13.78 10.98",
            "M3 8.2A9.25 9.25 0 0 1 17 8.2"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M11.25 18A0.75 0.75 0 1 0 12.75 18A0.75 0.75 0 1 0 11.25 18Z",
            "M7.37 13.09A6.75 6.75 0 0 1 16.63 13.09",
            "M3.25 8.73A12.75 12.75 0 0 1 20.75 8.73"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Two arcs over a wedge",
      "tags": [
        "wireless",
        "wedge",
        "two arcs"
      ],
      "note": "Rhythm: the dot becomes the first band, as on iPhone and Android — a wedge on the arcs' own centre, then two arcs, wedge to arc = arc to arc 2.75 · 1.75 · 1.75 (A's and live's air at 24 and 20, live's at 16), pitch 4.25 · 3.25 · 3. Wedge r6 · 4.5 · 3.5 (its ink reaches 6.75 · 5.25 · 4.125 from the point, 1.6 · 1.6 · 1.4 pitches, near Material’s 1.5), arcs r10.25 / 14.5 · 7.75 / 11 · 6.5 / 9.5. Wedge sides and arc ends share one radial line, 50.4 · 48.8 · 47.8° above level; corners bent at half the weight (C10). White inside the outline wedge: a ⌀3.17 · 2.08 · 1.56 circle fits (lint §5i floor 1.5). Ink 20×15.58 · 16×12.11 · 14×10.44, landscape keyline, box centre within 0.06 of the canvas centre. Balance: mass 1.42 · 1.03 · 0.96 above centre outline, 0.77 · 0.74 · 0.74 filled — the solid wedge pulls it down, the best-balanced fan filled. Filled: the wedge goes solid (its outline's outer edge), arcs stay 1.5 · 1.5 · 1.25 — a real outline/filled pair at every master with the air unchanged. Who: SF Symbols wifi, Material wifi, Remix wifi, Heroicons (a tiny wedge for its dot). SF and Material draw the wedge solid in both styles; ours outlines it in the outline style because every shape in this set is outlined there, and at 24 the hollow wedge reads a little like a guitar pick. wifi-off: the bar crosses the arcs and the wedge.",
      "masters": {
        "16": [
          "M6.117 10.794A0.625 0.625 0 0 1 6.272 9.832A3.5 3.5 0 0 1 9.728 9.832A0.625 0.625 0 0 1 9.883 10.794L8.463 12.363A0.625 0.625 0 0 1 7.537 12.363Z",
          "M3.638 8.056A6.5 6.5 0 0 1 12.362 8.056",
          "M1.625 5.832A9.5 9.5 0 0 1 14.375 5.832"
        ],
        "20": [
          "M7.58 12.99A0.75 0.75 0 0 1 7.77 11.84A4.5 4.5 0 0 1 12.23 11.84A0.75 0.75 0 0 1 12.42 12.99L10.56 15.11A0.75 0.75 0 0 1 9.44 15.11Z",
          "M4.89 9.92A7.75 7.75 0 0 1 15.11 9.92",
          "M2.75 7.48A11 11 0 0 1 17.25 7.48"
        ],
        "24": [
          "M8.69 15.5A0.75 0.75 0 0 1 8.87 14.38A6 6 0 0 1 15.13 14.38A0.75 0.75 0 0 1 15.31 15.5L12.58 18.8A0.75 0.75 0 0 1 11.42 18.8Z",
          "M5.46 11.61A10.25 10.25 0 0 1 18.54 11.61",
          "M2.75 8.33A14.5 14.5 0 0 1 21.25 8.33"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.653 11.214A1.25 1.25 0 0 1 5.963 9.288A4.125 4.125 0 0 1 10.037 9.288A1.25 1.25 0 0 1 10.347 11.214L8.927 12.782A1.25 1.25 0 0 1 7.073 12.782Z"
          ],
          "stroke": [
            "M3.638 8.056A6.5 6.5 0 0 1 12.362 8.056",
            "M1.625 5.832A9.5 9.5 0 0 1 14.375 5.832"
          ]
        },
        "20": {
          "fill": [
            "M7.01 13.48A1.5 1.5 0 0 1 7.4 11.19A5.25 5.25 0 0 1 12.6 11.19A1.5 1.5 0 0 1 12.99 13.48L11.13 15.6A1.5 1.5 0 0 1 8.87 15.6Z"
          ],
          "stroke": [
            "M4.89 9.92A7.75 7.75 0 0 1 15.11 9.92",
            "M2.75 7.48A11 11 0 0 1 17.25 7.48"
          ]
        },
        "24": {
          "fill": [
            "M8.11 15.98A1.5 1.5 0 0 1 8.48 13.74A6.75 6.75 0 0 1 15.52 13.74A1.5 1.5 0 0 1 15.89 15.98L13.16 19.28A1.5 1.5 0 0 1 10.84 19.28Z"
          ],
          "stroke": [
            "M5.46 11.61A10.25 10.25 0 0 1 18.54 11.61",
            "M2.75 8.33A14.5 14.5 0 0 1 21.25 8.33"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "The fan",
      "tags": [
        "wireless",
        "fan",
        "signal"
      ],
      "note": "Rhythm: one shape, no repeats — a fan sector on the keyline, apex r1.5 · 1.25 · 1 and top corners the same (the detail radius), r15.25 · 11 · 9 about its point; sides 49.5 · 44.7 · 40.6° above level, set by the keyline's own proportion (20×16 is squarer than 14×10, so the fan opens wider as the master shrinks). Ink 19.98×15.94 · 16×11.99 · 14×9.93, landscape keyline, centred within 0.03. Balance: mass 1.33 · 0.85 · 0.67 above centre, outline and filled alike. Filled: the solid fan — the strongest filled wifi on the board, Android's status-bar picture. Outline: the empty fan, which in Material means \"Wi-Fi, no bars\" (signal_wifi_0_bar), and at 16 the hollow fan reads close to a gem or a down-pointing shield. Who: Material signal_wifi_4_bar / signal_wifi_0_bar, Phosphor wifi-high-fill (Phosphor's filled style draws A's arcs as this solid fan). Opens a future level family (fan with an inner solid fan, C28) if signal strength is ever wanted. wifi-off: the bar crosses the fan as ban's crosses its disc (C21's filled question returns).",
      "masters": {
        "16": [
          "M1.974 7.459A1 1 0 0 1 1.953 5.959A9 9 0 0 1 14.047 5.959A1 1 0 0 1 14.026 7.459L8.651 12.067A1 1 0 0 1 7.349 12.067Z"
        ],
        "20": [
          "M3.12 8.95A1.25 1.25 0 0 1 3.23 7.08A11 11 0 0 1 16.77 7.08A1.25 1.25 0 0 1 16.88 8.95L10.88 14.88A1.25 1.25 0 0 1 9.12 14.88Z"
        ],
        "24": [
          "M3.12 9.61A1.5 1.5 0 0 1 3.42 7.39A15.25 15.25 0 0 1 20.58 7.39A1.5 1.5 0 0 1 20.88 9.61L13.14 18.66A1.5 1.5 0 0 1 10.86 18.66Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1.568 7.933A1.625 1.625 0 0 1 1.534 5.496A9.625 9.625 0 0 1 14.466 5.496A1.625 1.625 0 0 1 14.432 7.933L9.058 12.541A1.625 1.625 0 0 1 6.942 12.541Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2.59 9.49A2 2 0 0 1 2.77 6.49A11.75 11.75 0 0 1 17.23 6.49A2 2 0 0 1 17.41 9.49L11.41 15.42A2 2 0 0 1 8.59 15.42Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2.55 10.09A2.25 2.25 0 0 1 3 6.77A16 16 0 0 1 21 6.77A2.25 2.25 0 0 1 21.45 10.09L13.71 19.15A2.25 2.25 0 0 1 10.29 19.15Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Router with waves",
      "tags": [
        "wireless",
        "router",
        "antenna"
      ],
      "note": "Rhythm: the router's lights and walls share one air — LEDs ⌀2 · 2 · 1.5 (radio's knob at 20) at pitch 3.5 · 3.5 · 3, 1.5 of air to the top, bottom and left wall and between the two at every master. Box 20×8 · 16×8 · 14×7 ink, corners r2.5 · 2 · 1.5 (the container radius). Antenna 3.5 · 1.5 · 1.5 long from the box's top centreline, on the right like Lucide's and Tabler's; two arcs about its tip, r4.25 / 8.5 · 3.25 / 6.5 · 2.75 / 5.5, tip to arc = arc to arc 2.75 · 1.75 · 1.5 (A's air), ends 45.1 · 43.0 · 43.3° above level, the outer cap on the right edge and the top. Ink 20×20 · 16×16 · 14×14, circle keyline, box-centred. Balance: mass 0.92 right and 1.84 low at 24 (the box is the heavy part), 1.07 low at 20, 0.95 low at 16; filled 3.45 · 2.13 · 1.99 low. Filled: the box solid with the LEDs cut out white at the same size, 1.5 of material between them and 3 · 3 · 2.75 to the box edge; antenna and arcs stay 1.5 · 1.5 · 1.25. Who: Lucide router, Tabler router, Material router, SF wifi.router. It says \"router\" more than \"Wi-Fi\": if Maruti likes it, it likely ships as `router` (not on the sheet yet) and wifi takes another pick. At 16 the LEDs are the first thing to go grey.",
      "masters": {
        "16": [
          "M3.125 8.625H12.875A1.5 1.5 0 0 1 14.375 10.125V12.875A1.5 1.5 0 0 1 12.875 14.375H3.125A1.5 1.5 0 0 1 1.625 12.875V10.125A1.5 1.5 0 0 1 3.125 8.625Z",
          "M4.375 11.5A0.125 0.125 0 1 0 4.625 11.5A0.125 0.125 0 1 0 4.375 11.5Z",
          "M7.375 11.5A0.125 0.125 0 1 0 7.625 11.5A0.125 0.125 0 1 0 7.375 11.5Z",
          "M10.375 7.125V8.625",
          "M8.375 5.238A2.75 2.75 0 0 1 12.375 5.238",
          "M6.375 3.35A5.5 5.5 0 0 1 14.375 3.35"
        ],
        "20": [
          "M4.75 10.75H15.25A2 2 0 0 1 17.25 12.75V15.25A2 2 0 0 1 15.25 17.25H4.75A2 2 0 0 1 2.75 15.25V12.75A2 2 0 0 1 4.75 10.75Z",
          "M5.75 14A0.25 0.25 0 1 0 6.25 14A0.25 0.25 0 1 0 5.75 14Z",
          "M9.25 14A0.25 0.25 0 1 0 9.75 14A0.25 0.25 0 1 0 9.25 14Z",
          "M12.5 9.25V10.75",
          "M10.13 7.03A3.25 3.25 0 0 1 14.88 7.03",
          "M7.75 4.81A6.5 6.5 0 0 1 17.25 4.81"
        ],
        "24": [
          "M5.25 14.75H18.75A2.5 2.5 0 0 1 21.25 17.25V18.75A2.5 2.5 0 0 1 18.75 21.25H5.25A2.5 2.5 0 0 1 2.75 18.75V17.25A2.5 2.5 0 0 1 5.25 14.75Z",
          "M5.75 18A0.25 0.25 0 1 0 6.25 18A0.25 0.25 0 1 0 5.75 18Z",
          "M9.25 18A0.25 0.25 0 1 0 9.75 18A0.25 0.25 0 1 0 9.25 18Z",
          "M15.25 11.25V14.75",
          "M12.25 8.24A4.25 4.25 0 0 1 18.25 8.24",
          "M9.25 5.23A8.5 8.5 0 0 1 21.25 5.23"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 8H12.875A2.125 2.125 0 0 1 15 10.125V12.875A2.125 2.125 0 0 1 12.875 15H3.125A2.125 2.125 0 0 1 1 12.875V10.125A2.125 2.125 0 0 1 3.125 8ZM3.75 11.5A0.75 0.75 0 1 0 5.25 11.5A0.75 0.75 0 1 0 3.75 11.5ZM6.75 11.5A0.75 0.75 0 1 0 8.25 11.5A0.75 0.75 0 1 0 6.75 11.5Z"
          ],
          "stroke": [
            "M10.375 7.125V8.625",
            "M8.375 5.238A2.75 2.75 0 0 1 12.375 5.238",
            "M6.375 3.35A5.5 5.5 0 0 1 14.375 3.35"
          ]
        },
        "20": {
          "fill": [
            "M4.75 10H15.25A2.75 2.75 0 0 1 18 12.75V15.25A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25V12.75A2.75 2.75 0 0 1 4.75 10ZM5 14A1 1 0 1 0 7 14A1 1 0 1 0 5 14ZM8.5 14A1 1 0 1 0 10.5 14A1 1 0 1 0 8.5 14Z"
          ],
          "stroke": [
            "M12.5 9.25V10.75",
            "M10.13 7.03A3.25 3.25 0 0 1 14.88 7.03",
            "M7.75 4.81A6.5 6.5 0 0 1 17.25 4.81"
          ]
        },
        "24": {
          "fill": [
            "M5.25 14H18.75A3.25 3.25 0 0 1 22 17.25V18.75A3.25 3.25 0 0 1 18.75 22H5.25A3.25 3.25 0 0 1 2 18.75V17.25A3.25 3.25 0 0 1 5.25 14ZM5 18A1 1 0 1 0 7 18A1 1 0 1 0 5 18ZM8.5 18A1 1 0 1 0 10.5 18A1 1 0 1 0 8.5 18Z"
          ],
          "stroke": [
            "M15.25 11.25V14.75",
            "M12.25 8.24A4.25 4.25 0 0 1 18.25 8.24",
            "M9.25 5.23A8.5 8.5 0 0 1 21.25 5.23"
          ]
        }
      }
    }
  ]
};
