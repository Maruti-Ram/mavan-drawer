// radio: "radio" in Lucide is live's own picture (a dot sending waves), so this decides whether our radio is a set you can hold or a signal — and keeps live from being drawn twice.
export default {
  "concept": "radio",
  "concepts": ["radio", "podcast"],
  "question": "Which picture says radio: a set (A portable, B tabletop on feet, D dial radio) or the signal it sends (C tower, E podcast arcs)?",
  "candidates": [
    {
      "id": "A",
      "label": "Portable radio",
      "tags": [
        "portable",
        "transistor",
        "antenna",
        "set"
      ],
      "note": "Rhythm: ring speaker and two knobs share one height — the knobs' top and bottom sit flush with the ring's ink at every master; ring-to-wall air 1.5 on three sides at 24 · 20 · 16; knob pitch 5 · 3.5 · 3 (air 2 · 1.5 · 1.5); ring to knob 2 · 2 · 1.5, knob to right wall 2.5 · 2 · 2.5 (knobs sit on whole-pixel centres, which cost the even split at 16). Body 20×14 · 16×11.5 · 14×10, corner r2.5 · 2 · 1.5 (the container radius); ring ⌀8 · 5.5 · 4.5, hole 5 · 2.5 · 2 (camera's ⌀8 lens at 24); knobs ⌀3 · 2 · 1.5 (live's dot at 24, calculator's dots at 20 and 16). Strap from the top-left corner's end at slope 2:5 (21.8°) at every master, tip ink at y 3 · 3 · 2; the narrow wedge it makes with the top edge is the construction SF Symbols, Material, Tabler and Central all use. Ink 20×18 · 16×14 · 14×12, camera's agreed box. Filled: body solid, ring a 1.5 white band round a solid core ⌀5 · 2.5 · 1.5, knobs white dots, strap stays 1.5 · 1.5 · 1.25; material between the knob holes 2 · 1.5 · 1.5. Who: SF radio, Material radio, Tabler radio, Central radio. (recommended) — the only picture that says \"a radio set\" without leaning on waves, and at 16 the strap and ring read before anything else; it sits with camera at the same box.",
      "box": {
        "16": [
          14,
          12
        ],
        "20": [
          16,
          14
        ],
        "24": [
          20,
          18
        ]
      },
      "masters": {
        "16": [
          "M3.125 4.625H12.875A1.5 1.5 0 0 1 14.375 6.125V11.875A1.5 1.5 0 0 1 12.875 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M3.125 4.625L8.125 2.625",
          "M4.375 9A1.625 1.625 0 1 0 7.625 9A1.625 1.625 0 1 0 4.375 9Z",
          "M10.375 7.5A0.125 0.125 0 1 0 10.625 7.5A0.125 0.125 0 1 0 10.375 7.5Z",
          "M10.375 10.5A0.125 0.125 0 1 0 10.625 10.5A0.125 0.125 0 1 0 10.375 10.5Z"
        ],
        "20": [
          "M4.75 6.25H15.25A2 2 0 0 1 17.25 8.25V14.25A2 2 0 0 1 15.25 16.25H4.75A2 2 0 0 1 2.75 14.25V8.25A2 2 0 0 1 4.75 6.25Z",
          "M4.75 6.25L11 3.75",
          "M5.75 11.25A2 2 0 1 0 9.75 11.25A2 2 0 1 0 5.75 11.25Z",
          "M13.25 9.5A0.25 0.25 0 1 0 13.75 9.5A0.25 0.25 0 1 0 13.25 9.5Z",
          "M13.25 13A0.25 0.25 0 1 0 13.75 13A0.25 0.25 0 1 0 13.25 13Z"
        ],
        "24": [
          "M5.25 7.75H18.75A2.5 2.5 0 0 1 21.25 10.25V17.75A2.5 2.5 0 0 1 18.75 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V10.25A2.5 2.5 0 0 1 5.25 7.75Z",
          "M5.25 7.75L15.25 3.75",
          "M5.75 14A3.25 3.25 0 1 0 12.25 14A3.25 3.25 0 1 0 5.75 14Z",
          "M15.75 11.5A0.75 0.75 0 1 0 17.25 11.5A0.75 0.75 0 1 0 15.75 11.5Z",
          "M15.75 16.5A0.75 0.75 0 1 0 17.25 16.5A0.75 0.75 0 1 0 15.75 16.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H12.875A2.125 2.125 0 0 1 15 6.125V11.875A2.125 2.125 0 0 1 12.875 14H3.125A2.125 2.125 0 0 1 1 11.875V6.125A2.125 2.125 0 0 1 3.125 4ZM3.75 9A2.25 2.25 0 1 0 8.25 9A2.25 2.25 0 1 0 3.75 9ZM5.25 9A0.75 0.75 0 1 0 6.75 9A0.75 0.75 0 1 0 5.25 9ZM9.75 7.5A0.75 0.75 0 1 0 11.25 7.5A0.75 0.75 0 1 0 9.75 7.5ZM9.75 10.5A0.75 0.75 0 1 0 11.25 10.5A0.75 0.75 0 1 0 9.75 10.5Z"
          ],
          "stroke": [
            "M3.125 4.625L8.125 2.625"
          ]
        },
        "20": {
          "fill": [
            "M4.75 5.5H15.25A2.75 2.75 0 0 1 18 8.25V14.25A2.75 2.75 0 0 1 15.25 17H4.75A2.75 2.75 0 0 1 2 14.25V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5 11.25A2.75 2.75 0 1 0 10.5 11.25A2.75 2.75 0 1 0 5 11.25ZM6.5 11.25A1.25 1.25 0 1 0 9 11.25A1.25 1.25 0 1 0 6.5 11.25ZM12.5 9.5A1 1 0 1 0 14.5 9.5A1 1 0 1 0 12.5 9.5ZM12.5 13A1 1 0 1 0 14.5 13A1 1 0 1 0 12.5 13Z"
          ],
          "stroke": [
            "M4.75 6.25L11 3.75"
          ]
        },
        "24": {
          "fill": [
            "M5.25 7H18.75A3.25 3.25 0 0 1 22 10.25V17.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75V10.25A3.25 3.25 0 0 1 5.25 7ZM5 14A4 4 0 1 0 13 14A4 4 0 1 0 5 14ZM6.5 14A2.5 2.5 0 1 0 11.5 14A2.5 2.5 0 1 0 6.5 14ZM15 11.5A1.5 1.5 0 1 0 18 11.5A1.5 1.5 0 1 0 15 11.5ZM15 16.5A1.5 1.5 0 1 0 18 16.5A1.5 1.5 0 1 0 15 16.5Z"
          ],
          "stroke": [
            "M5.25 7.75L15.25 3.75"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Tabletop receiver",
      "tags": [
        "receiver",
        "tabletop",
        "grille",
        "knob"
      ],
      "note": "Rhythm: one air everywhere inside the body — 1.5 from wall to grille, between grille lines, grille to knob and knob to wall at 24 and 20 (knob to wall 1.75 at 16, knob on whole pixels); grille pitch 3 · 3 · 2.75. Three grille lines at 24, two at 20 and 16: three need 10.5 of inside height at 1.5 air and 20 has 7.5, so a line is dropped rather than squeezed. Knob ⌀3 · 2.5 · 2 (live's dot sizes) on the grille's middle. Body 20×13.5 · 16×10.5 · 14×9.5, r2.5 · 2 · 1.5; two feet under the knob and mirrored, standing 2.5 · 1.5 · 1.5 below the body. Ink 20×16 · 16×12 (landscape keyline) · 14×11 (agreed box: 16's landscape keyline is 14×10 and the feet need one more). Filled: body solid, grille 1.5 white slots, knob a white dot, feet stay lines; material between slots 1.5 · 1.5 · 1.25. Who: Lucide radio-receiver (box on two feet with a knob), Central radio's knobs. Reads as a hi-fi tuner more than a radio; at 16 the feet are short.",
      "box": {
        "16": [
          14,
          11
        ]
      },
      "masters": {
        "16": [
          "M3.125 3.125H12.875A1.5 1.5 0 0 1 14.375 4.625V9.875A1.5 1.5 0 0 1 12.875 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V4.625A1.5 1.5 0 0 1 3.125 3.125Z",
          "M4.375 5.875H7.875",
          "M4.375 8.625H7.875",
          "M10.625 7A0.375 0.375 0 1 0 11.375 7A0.375 0.375 0 1 0 10.625 7Z",
          "M4.75 11.375V12.875",
          "M11.25 11.375V12.875"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V11.75A2 2 0 0 1 15.25 13.75H4.75A2 2 0 0 1 2.75 11.75V6.75A2 2 0 0 1 4.75 4.75Z",
          "M5.75 7.75H10.25",
          "M5.75 10.75H10.25",
          "M13.25 9.25A0.5 0.5 0 1 0 14.25 9.25A0.5 0.5 0 1 0 13.25 9.25Z",
          "M6.25 13.75V15.25",
          "M13.75 13.75V15.25"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V14.25A2.5 2.5 0 0 1 18.75 16.75H5.25A2.5 2.5 0 0 1 2.75 14.25V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M5.75 7.75H13.75",
          "M5.75 10.75H13.75",
          "M5.75 13.75H13.75",
          "M16.75 10.75A0.75 0.75 0 1 0 18.25 10.75A0.75 0.75 0 1 0 16.75 10.75Z",
          "M6.5 16.75V19.25",
          "M17.5 16.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 2.5H12.875A2.125 2.125 0 0 1 15 4.625V9.875A2.125 2.125 0 0 1 12.875 12H3.125A2.125 2.125 0 0 1 1 9.875V4.625A2.125 2.125 0 0 1 3.125 2.5ZM4.5 5.125H7.75A0.75 0.75 0 0 1 8.5 5.875V5.875A0.75 0.75 0 0 1 7.75 6.625H4.5A0.75 0.75 0 0 1 3.75 5.875V5.875A0.75 0.75 0 0 1 4.5 5.125ZM4.5 7.875H7.75A0.75 0.75 0 0 1 8.5 8.625V8.625A0.75 0.75 0 0 1 7.75 9.375H4.5A0.75 0.75 0 0 1 3.75 8.625V8.625A0.75 0.75 0 0 1 4.5 7.875ZM10 7A1 1 0 1 0 12 7A1 1 0 1 0 10 7Z"
          ],
          "stroke": [
            "M4.75 11.375V12.875",
            "M11.25 11.375V12.875"
          ]
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V11.75A2.75 2.75 0 0 1 15.25 14.5H4.75A2.75 2.75 0 0 1 2 11.75V6.75A2.75 2.75 0 0 1 4.75 4ZM5.75 7H10.25A0.75 0.75 0 0 1 11 7.75V7.75A0.75 0.75 0 0 1 10.25 8.5H5.75A0.75 0.75 0 0 1 5 7.75V7.75A0.75 0.75 0 0 1 5.75 7ZM5.75 10H10.25A0.75 0.75 0 0 1 11 10.75V10.75A0.75 0.75 0 0 1 10.25 11.5H5.75A0.75 0.75 0 0 1 5 10.75V10.75A0.75 0.75 0 0 1 5.75 10ZM12.5 9.25A1.25 1.25 0 1 0 15 9.25A1.25 1.25 0 1 0 12.5 9.25Z"
          ],
          "stroke": [
            "M6.25 13.75V15.25",
            "M13.75 13.75V15.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V14.25A3.25 3.25 0 0 1 18.75 17.5H5.25A3.25 3.25 0 0 1 2 14.25V7.25A3.25 3.25 0 0 1 5.25 4ZM5.75 7H13.75A0.75 0.75 0 0 1 14.5 7.75V7.75A0.75 0.75 0 0 1 13.75 8.5H5.75A0.75 0.75 0 0 1 5 7.75V7.75A0.75 0.75 0 0 1 5.75 7ZM5.75 10H13.75A0.75 0.75 0 0 1 14.5 10.75V10.75A0.75 0.75 0 0 1 13.75 11.5H5.75A0.75 0.75 0 0 1 5 10.75V10.75A0.75 0.75 0 0 1 5.75 10ZM5.75 13H13.75A0.75 0.75 0 0 1 14.5 13.75V13.75A0.75 0.75 0 0 1 13.75 14.5H5.75A0.75 0.75 0 0 1 5 13.75V13.75A0.75 0.75 0 0 1 5.75 13ZM16 10.75A1.5 1.5 0 1 0 19 10.75A1.5 1.5 0 1 0 16 10.75Z"
          ],
          "stroke": [
            "M6.5 16.75V19.25",
            "M17.5 16.75V19.25"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Radio tower",
      "tags": [
        "tower",
        "broadcast",
        "mast",
        "transmitter"
      ],
      "note": "Rhythm: live's dot and waves, unchanged in size — dot ⌀3 · 2.5 · 2, radii 5 / 9.25 · 4 / 7.25 · 3.375 / 6.375, air dot to wave 2.75 · 2 · 1.75 and wave to wave 2.75 · 1.75 · 1.75 — lifted to y 9.5 · 7.5 · 5.875 so a mast fits under it. Waves end where the outer cap meets the top margin, 46.9° · 40.9° · 41.8° from level (live: 51.6 · 46.4 · 43.3), inner on the same radial line. Mast: an upside-down V, apex bend r0.75 · 0.75 · 0.625 (C10), legs spreading 3.75 · 2.75 · 2.5 each side over 7.5 · 5.75 · 5.125 of drop; the apex sits 2 · 2 · 1.75 below the dot so the filled dot can grow; inner wave ends clear the legs by 1.83 · 1.82 · 1.51. No crossbar: the triangle under it keeps only 0.5 of white at 20, so it is left out at every master. Ink 20×20 · 16×16 · 14×14, circle keyline, box-centred. Filled: as live — the dot grows to ⌀4 · 3.5 · 2.5 (1.5 to the apex), waves and legs stay 1.5 · 1.5 · 1.25. Who: Lucide radio-tower, Material cell_tower, Central signal-tower, Tabler building-broadcast-tower. Says \"broadcast\" more than \"radio\".",
      "masters": {
        "16": [
          "M7.625 5.875A0.375 0.375 0 1 0 8.375 5.875A0.375 0.375 0 1 0 7.625 5.875Z",
          "M10.516 3.625A3.375 3.375 0 0 1 10.516 8.125",
          "M5.484 8.125A3.375 3.375 0 0 1 5.484 3.625",
          "M12.752 1.625A6.375 6.375 0 0 1 12.752 10.125",
          "M3.248 10.125A6.375 6.375 0 0 1 3.248 1.625",
          "M5.5 14.375L7.438 10.402A0.625 0.625 0 0 1 8.562 10.402L10.5 14.375"
        ],
        "20": [
          "M9.5 7.5A0.5 0.5 0 1 0 10.5 7.5A0.5 0.5 0 1 0 9.5 7.5Z",
          "M13.02 4.88A4 4 0 0 1 13.02 10.12",
          "M6.98 10.12A4 4 0 0 1 6.98 4.88",
          "M15.48 2.75A7.25 7.25 0 0 1 15.48 12.25",
          "M4.52 12.25A7.25 7.25 0 0 1 4.52 2.75",
          "M7.25 17.25L9.32 12.91A0.75 0.75 0 0 1 10.68 12.91L12.75 17.25"
        ],
        "24": [
          "M11.25 9.5A0.75 0.75 0 1 0 12.75 9.5A0.75 0.75 0 1 0 11.25 9.5Z",
          "M15.42 5.85A5 5 0 0 1 15.42 13.15",
          "M8.58 13.15A5 5 0 0 1 8.58 5.85",
          "M18.32 2.75A9.25 9.25 0 0 1 18.32 16.25",
          "M5.68 16.25A9.25 9.25 0 0 1 5.68 2.75",
          "M8.25 21.25L11.33 15.09A0.75 0.75 0 0 1 12.67 15.09L15.75 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.75 5.875A1.25 1.25 0 1 0 9.25 5.875A1.25 1.25 0 1 0 6.75 5.875Z"
          ],
          "stroke": [
            "M10.516 3.625A3.375 3.375 0 0 1 10.516 8.125",
            "M5.484 8.125A3.375 3.375 0 0 1 5.484 3.625",
            "M12.752 1.625A6.375 6.375 0 0 1 12.752 10.125",
            "M3.248 10.125A6.375 6.375 0 0 1 3.248 1.625",
            "M5.5 14.375L7.438 10.402A0.625 0.625 0 0 1 8.562 10.402L10.5 14.375"
          ]
        },
        "20": {
          "fill": [
            "M8.25 7.5A1.75 1.75 0 1 0 11.75 7.5A1.75 1.75 0 1 0 8.25 7.5Z"
          ],
          "stroke": [
            "M13.02 4.88A4 4 0 0 1 13.02 10.12",
            "M6.98 10.12A4 4 0 0 1 6.98 4.88",
            "M15.48 2.75A7.25 7.25 0 0 1 15.48 12.25",
            "M4.52 12.25A7.25 7.25 0 0 1 4.52 2.75",
            "M7.25 17.25L9.32 12.91A0.75 0.75 0 0 1 10.68 12.91L12.75 17.25"
          ]
        },
        "24": {
          "fill": [
            "M10 9.5A2 2 0 1 0 14 9.5A2 2 0 1 0 10 9.5Z"
          ],
          "stroke": [
            "M15.42 5.85A5 5 0 0 1 15.42 13.15",
            "M8.58 13.15A5 5 0 0 1 8.58 5.85",
            "M18.32 2.75A9.25 9.25 0 0 1 18.32 16.25",
            "M5.68 16.25A9.25 9.25 0 0 1 5.68 2.75",
            "M8.25 21.25L11.33 15.09A0.75 0.75 0 0 1 12.67 15.09L15.75 21.25"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Dial radio",
      "tags": [
        "dial",
        "tuner",
        "knobs",
        "vintage"
      ],
      "note": "Rhythm: a divider wall to wall splits the body into a dial window over a knob panel; the two knobs sit 2.5 · 1.75 · 1.75 from the side walls and 2.5 · 1.75 · 1.75 above and below them, so the panel is even all round; the needle stands on the divider at 39% of the width, its top 2 · 1.5 · 1.5 under the top wall (visible 3.5 · 2 · 1.25). Body 20×18 · 16×14 · 14×12 outer (camera's and A's box), r2.5 · 2 · 1.5; knobs ⌀3 · 2.5 · 2 (live's dot sizes) on whole pixels at 16; divider ink on a whole-pixel top edge at 16 (cl 6.625). Filled: body solid; divider and needle one white T, 1.5 wide at every master (built as two cuts that touch), knobs white dots; material knob hole to divider 2.5 · 1.75 · 1.63. Who: Central radio (divider, tuning tick, two knobs), Material radio's dial window. Replaces the antenna mast, which was live with a stick. At 16 it can read as a cabinet or case; the needle is short there.",
      "box": {
        "16": [
          14,
          12
        ],
        "20": [
          16,
          14
        ],
        "24": [
          20,
          18
        ]
      },
      "masters": {
        "16": [
          "M3.125 2.625H12.875A1.5 1.5 0 0 1 14.375 4.125V11.875A1.5 1.5 0 0 1 12.875 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V4.125A1.5 1.5 0 0 1 3.125 2.625Z",
          "M1.625 6.625H14.375",
          "M6.625 6.625V5.375",
          "M4.625 10A0.375 0.375 0 1 0 5.375 10A0.375 0.375 0 1 0 4.625 10Z",
          "M10.625 10A0.375 0.375 0 1 0 11.375 10A0.375 0.375 0 1 0 10.625 10Z"
        ],
        "20": [
          "M4.75 3.75H15.25A2 2 0 0 1 17.25 5.75V14.25A2 2 0 0 1 15.25 16.25H4.75A2 2 0 0 1 2.75 14.25V5.75A2 2 0 0 1 4.75 3.75Z",
          "M2.75 8.75H17.25",
          "M8.25 8.75V6.75",
          "M6 12.5A0.5 0.5 0 1 0 7 12.5A0.5 0.5 0 1 0 6 12.5Z",
          "M13 12.5A0.5 0.5 0 1 0 14 12.5A0.5 0.5 0 1 0 13 12.5Z"
        ],
        "24": [
          "M5.25 3.75H18.75A2.5 2.5 0 0 1 21.25 6.25V17.75A2.5 2.5 0 0 1 18.75 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V6.25A2.5 2.5 0 0 1 5.25 3.75Z",
          "M2.75 10.75H21.25",
          "M10 10.75V7.25",
          "M6.75 15.5A0.75 0.75 0 1 0 8.25 15.5A0.75 0.75 0 1 0 6.75 15.5Z",
          "M15.75 15.5A0.75 0.75 0 1 0 17.25 15.5A0.75 0.75 0 1 0 15.75 15.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 2H12.875A2.125 2.125 0 0 1 15 4.125V11.875A2.125 2.125 0 0 1 12.875 14H3.125A2.125 2.125 0 0 1 1 11.875V4.125A2.125 2.125 0 0 1 3.125 2ZM2.25 5.875H13.75V7.375H2.25ZM5.875 5.875V5.5A0.75 0.75 0 0 1 7.375 5.5V5.875ZM4 10A1 1 0 1 0 6 10A1 1 0 1 0 4 10ZM10 10A1 1 0 1 0 12 10A1 1 0 1 0 10 10Z"
          ]
        },
        "20": {
          "fill": [
            "M4.75 3H15.25A2.75 2.75 0 0 1 18 5.75V14.25A2.75 2.75 0 0 1 15.25 17H4.75A2.75 2.75 0 0 1 2 14.25V5.75A2.75 2.75 0 0 1 4.75 3ZM3.5 8H16.5V9.5H3.5ZM7.5 8V6.75A0.75 0.75 0 0 1 9 6.75V8ZM5.25 12.5A1.25 1.25 0 1 0 7.75 12.5A1.25 1.25 0 1 0 5.25 12.5ZM12.25 12.5A1.25 1.25 0 1 0 14.75 12.5A1.25 1.25 0 1 0 12.25 12.5Z"
          ]
        },
        "24": {
          "fill": [
            "M5.25 3H18.75A3.25 3.25 0 0 1 22 6.25V17.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75V6.25A3.25 3.25 0 0 1 5.25 3ZM3.5 10H20.5V11.5H3.5ZM9.25 10V7.25A0.75 0.75 0 0 1 10.75 7.25V10ZM6 15.5A1.5 1.5 0 1 0 9 15.5A1.5 1.5 0 1 0 6 15.5ZM15 15.5A1.5 1.5 0 1 0 18 15.5A1.5 1.5 0 1 0 15 15.5Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Podcast arcs",
      "tags": [
        "podcast",
        "broadcast",
        "arcs",
        "on air"
      ],
      "note": "Rhythm: live's dot and radii again (air dot to arc 2.75 · 2 · 1.75, arc to arc 2.75 · 1.75 · 1.75), but the arcs run unbroken over the top, 240° each, open 30° below level on both sides — a dome, not live's side waves. A stand under the dot, 5 · 3.25 · 3 long, with 2 · 2 · 1.75 of air to the dot so the filled dot still keeps 1.5. Ink 20×20 · 16×16 · 14×14, circle keyline, box-centred. Filled: dot ⌀4 · 3.5 · 2.5, arcs and stand at 1.5 · 1.5 · 1.25. At 16 the stand sits at x 7.625, 0.375 left of the axis, so it lands on whole pixels instead of two half-grey columns. Who: Lucide podcast, Material podcasts, Untitled podcast. Says \"podcast / on air\" more than \"radio\"; if a podcast icon is wanted later, this is it.",
      "masters": {
        "16": [
          "M7.625 8A0.375 0.375 0 1 0 8.375 8A0.375 0.375 0 1 0 7.625 8Z",
          "M5.077 9.688A3.375 3.375 0 1 1 10.923 9.688",
          "M2.479 11.188A6.375 6.375 0 1 1 13.521 11.188",
          "M7.625 11.375V14.375"
        ],
        "20": [
          "M9.5 10A0.5 0.5 0 1 0 10.5 10A0.5 0.5 0 1 0 9.5 10Z",
          "M6.54 12A4 4 0 1 1 13.46 12",
          "M3.72 13.63A7.25 7.25 0 1 1 16.28 13.63",
          "M10 14V17.25"
        ],
        "24": [
          "M11.25 12A0.75 0.75 0 1 0 12.75 12A0.75 0.75 0 1 0 11.25 12Z",
          "M7.67 14.5A5 5 0 1 1 16.33 14.5",
          "M3.99 16.63A9.25 9.25 0 1 1 20.01 16.63",
          "M12 16.25V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.75 8A1.25 1.25 0 1 0 9.25 8A1.25 1.25 0 1 0 6.75 8Z"
          ],
          "stroke": [
            "M5.077 9.688A3.375 3.375 0 1 1 10.923 9.688",
            "M2.479 11.188A6.375 6.375 0 1 1 13.521 11.188",
            "M7.625 11.375V14.375"
          ]
        },
        "20": {
          "fill": [
            "M8.25 10A1.75 1.75 0 1 0 11.75 10A1.75 1.75 0 1 0 8.25 10Z"
          ],
          "stroke": [
            "M6.54 12A4 4 0 1 1 13.46 12",
            "M3.72 13.63A7.25 7.25 0 1 1 16.28 13.63",
            "M10 14V17.25"
          ]
        },
        "24": {
          "fill": [
            "M10 12A2 2 0 1 0 14 12A2 2 0 1 0 10 12Z"
          ],
          "stroke": [
            "M7.67 14.5A5 5 0 1 1 16.33 14.5",
            "M3.99 16.63A9.25 9.25 0 1 1 20.01 16.63",
            "M12 16.25V21.25"
          ]
        }
      }
    }
  ]
};
