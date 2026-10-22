// mobile: this phone body is the one `devices` will reuse and it sits beside phone-contactless and cast-mobile, so its proportion (12×20) and its one detail decide how every phone in the set reads. Honestly, A–E are five details on one body, as every real set does it: Tabler, Phosphor, Material, Lucide and Fluent differ only by a bar, a dot, bands or a button.
export default {
  "concept": "mobile",
  "box": {
    "16": [
      8,
      14
    ],
    "20": [
      10,
      16
    ],
    "24": [
      12,
      20
    ]
  },
  "question": "Which one detail says \"mobile phone\": a gesture bar at the foot (A), a camera dot at the head (B), a speaker slit and home button (C), screen bezels top and bottom (D) or a side button (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Gesture bar",
      "tags": [
        "phone",
        "smartphone",
        "mobile",
        "device",
        "home bar",
        "gesture bar"
      ],
      "note": "Rhythm: one bar on the centre line, its air to the floor 1.5 at every master (phone-contactless keeps the same 1.5); bar ink 4 · 3 · 2.5 long (a third of the body: 33 · 30 · 31%), 1.5 · 1.5 · 1.25 thick, air to each side wall 2.5 · 2 · 1.5 — equal both sides. Body: ink 12×20 · 10×16 · 8×14 (0.60 · 0.63 · 0.57 wide-to-tall; Fluent phone is 12×20, Material 0.61, Phosphor 0.64), centred on the canvas, container radius 2.5 · 2 · 1.5 and walls 1.5 · 1.5 · 1.25 as cast-mobile, phone-contactless and calculator; inside 9×17 · 7×13 · 5.5×11.5; every edge on a whole unit at 16. Filled: body solid (outer radius 3.25 · 2.75 · 2.125), the bar cut out at its outline ink; at 16 the cut is 1.5 tall, not 1.25 (C22), and keeps the outline bar's lower edge, so it grows 0.25 up; 3 · 3 · 2.75 of solid below it. Pairs with tablet A. Who: Fluent phone (bar), Material phone_android (bar), Polaris Mobile and Heroicons device-phone-mobile (bar under a notch). (recommended) — it is today's phone in one stroke, the same home bar phone-contactless already ships, and the body stays clean enough to reuse in devices at 16.",
      "masters": {
        "16": [
          "M6.125 1.625H9.875A1.5 1.5 0 0 1 11.375 3.125V12.875A1.5 1.5 0 0 1 9.875 14.375H6.125A1.5 1.5 0 0 1 4.625 12.875V3.125A1.5 1.5 0 0 1 6.125 1.625Z",
          "M7.375 11.625H8.625"
        ],
        "20": [
          "M7.75 2.75H12.25A2 2 0 0 1 14.25 4.75V15.25A2 2 0 0 1 12.25 17.25H7.75A2 2 0 0 1 5.75 15.25V4.75A2 2 0 0 1 7.75 2.75Z",
          "M9.25 14.25H10.75"
        ],
        "24": [
          "M9.25 2.75H14.75A2.5 2.5 0 0 1 17.25 5.25V18.75A2.5 2.5 0 0 1 14.75 21.25H9.25A2.5 2.5 0 0 1 6.75 18.75V5.25A2.5 2.5 0 0 1 9.25 2.75Z",
          "M10.75 18.25H13.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.125 1H9.875A2.125 2.125 0 0 1 12 3.125V12.875A2.125 2.125 0 0 1 9.875 15H6.125A2.125 2.125 0 0 1 4 12.875V3.125A2.125 2.125 0 0 1 6.125 1ZM7.5 10.75H8.5A0.75 0.75 0 0 1 8.5 12.25H7.5A0.75 0.75 0 0 1 7.5 10.75Z"
          ]
        },
        "20": {
          "fill": [
            "M7.75 2H12.25A2.75 2.75 0 0 1 15 4.75V15.25A2.75 2.75 0 0 1 12.25 18H7.75A2.75 2.75 0 0 1 5 15.25V4.75A2.75 2.75 0 0 1 7.75 2ZM9.25 13.5H10.75A0.75 0.75 0 0 1 10.75 15H9.25A0.75 0.75 0 0 1 9.25 13.5Z"
          ]
        },
        "24": {
          "fill": [
            "M9.25 2H14.75A3.25 3.25 0 0 1 18 5.25V18.75A3.25 3.25 0 0 1 14.75 22H9.25A3.25 3.25 0 0 1 6 18.75V5.25A3.25 3.25 0 0 1 9.25 2ZM10.75 17.5H13.25A0.75 0.75 0 0 1 13.25 19H10.75A0.75 0.75 0 0 1 10.75 17.5Z"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Camera dot",
      "tags": [
        "phone",
        "smartphone",
        "mobile",
        "device",
        "camera"
      ],
      "note": "Rhythm: one dot on the centre line, ⌀2 · 2 · 1.5 (calculator's dots), its air to the ceiling 1.5 at every master — the same air A keeps to the floor, so B is A's detail moved to the head as a camera; centre y 6 · 6 · 4.5; air to each side wall 3.5 · 2.5 · 2. Body: ink 12×20 · 10×16 · 8×14 (0.60 · 0.63 · 0.57 wide-to-tall; Fluent phone is 12×20, Material 0.61, Phosphor 0.64), centred on the canvas, container radius 2.5 · 2 · 1.5 and walls 1.5 · 1.5 · 1.25 as cast-mobile, phone-contactless and calculator; inside 9×17 · 7×13 · 5.5×11.5; every edge on a whole unit at 16. Filled: body solid, the dot a hole of the same ⌀ (1.5 at 16, the white floor), 3 · 3 · 2.75 of solid above it. Pairs with tablet B. Who: Phosphor DeviceMobileCamera, Material Symbols mobile (dot at the head, with a side button).",
      "masters": {
        "16": [
          "M6.125 1.625H9.875A1.5 1.5 0 0 1 11.375 3.125V12.875A1.5 1.5 0 0 1 9.875 14.375H6.125A1.5 1.5 0 0 1 4.625 12.875V3.125A1.5 1.5 0 0 1 6.125 1.625Z",
          "M7.875 4.5A0.125 0.125 0 1 0 8.125 4.5A0.125 0.125 0 1 0 7.875 4.5Z"
        ],
        "20": [
          "M7.75 2.75H12.25A2 2 0 0 1 14.25 4.75V15.25A2 2 0 0 1 12.25 17.25H7.75A2 2 0 0 1 5.75 15.25V4.75A2 2 0 0 1 7.75 2.75Z",
          "M9.75 6A0.25 0.25 0 1 0 10.25 6A0.25 0.25 0 1 0 9.75 6Z"
        ],
        "24": [
          "M9.25 2.75H14.75A2.5 2.5 0 0 1 17.25 5.25V18.75A2.5 2.5 0 0 1 14.75 21.25H9.25A2.5 2.5 0 0 1 6.75 18.75V5.25A2.5 2.5 0 0 1 9.25 2.75Z",
          "M11.75 6A0.25 0.25 0 1 0 12.25 6A0.25 0.25 0 1 0 11.75 6Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.125 1H9.875A2.125 2.125 0 0 1 12 3.125V12.875A2.125 2.125 0 0 1 9.875 15H6.125A2.125 2.125 0 0 1 4 12.875V3.125A2.125 2.125 0 0 1 6.125 1ZM7.25 4.5A0.75 0.75 0 1 0 8.75 4.5A0.75 0.75 0 1 0 7.25 4.5Z"
          ]
        },
        "20": {
          "fill": [
            "M7.75 2H12.25A2.75 2.75 0 0 1 15 4.75V15.25A2.75 2.75 0 0 1 12.25 18H7.75A2.75 2.75 0 0 1 5 15.25V4.75A2.75 2.75 0 0 1 7.75 2ZM9 6A1 1 0 1 0 11 6A1 1 0 1 0 9 6Z"
          ]
        },
        "24": {
          "fill": [
            "M9.25 2H14.75A3.25 3.25 0 0 1 18 5.25V18.75A3.25 3.25 0 0 1 14.75 22H9.25A3.25 3.25 0 0 1 6 18.75V5.25A3.25 3.25 0 0 1 9.25 2ZM11 6A1 1 0 1 0 13 6A1 1 0 1 0 11 6Z"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Slit and home button",
      "tags": [
        "phone",
        "smartphone",
        "mobile",
        "device",
        "home button",
        "speaker",
        "classic"
      ],
      "note": "Rhythm: slit and button mirror each other — slit 1.5 below the ceiling, button 1.5 above the floor at every master; slit ink 4 · 3 · 2.5 long (A's bar), button ⌀2 · 2 · 1.5 (B's dot); slit centre y 5.75 · 5.75 · 4.375, button 18 · 14 · 11.5; side air to the slit 2.5 · 2 · 1.5. Body: ink 12×20 · 10×16 · 8×14 (0.60 · 0.63 · 0.57 wide-to-tall; Fluent phone is 12×20, Material 0.61, Phosphor 0.64), centred on the canvas, container radius 2.5 · 2 · 1.5 and walls 1.5 · 1.5 · 1.25 as cast-mobile, phone-contactless and calculator; inside 9×17 · 7×13 · 5.5×11.5; every edge on a whole unit at 16. Filled: body solid, slit and button cut at their outline ink (slit 1.5 tall at 16, grows 0.25 down); solid between the two cuts 10.5 · 6.5 · 5.5. Pairs with tablet C (the tablet keeps the button only; an iPad never had the slit). Who: Tabler device-mobile (slit + dot); the button alone: Lucide smartphone, Bootstrap phone, Remix smartphone, iconoir smartphone-device, Material phone_iphone.",
      "masters": {
        "16": [
          "M6.125 1.625H9.875A1.5 1.5 0 0 1 11.375 3.125V12.875A1.5 1.5 0 0 1 9.875 14.375H6.125A1.5 1.5 0 0 1 4.625 12.875V3.125A1.5 1.5 0 0 1 6.125 1.625Z",
          "M7.375 4.375H8.625",
          "M7.875 11.5A0.125 0.125 0 1 0 8.125 11.5A0.125 0.125 0 1 0 7.875 11.5Z"
        ],
        "20": [
          "M7.75 2.75H12.25A2 2 0 0 1 14.25 4.75V15.25A2 2 0 0 1 12.25 17.25H7.75A2 2 0 0 1 5.75 15.25V4.75A2 2 0 0 1 7.75 2.75Z",
          "M9.25 5.75H10.75",
          "M9.75 14A0.25 0.25 0 1 0 10.25 14A0.25 0.25 0 1 0 9.75 14Z"
        ],
        "24": [
          "M9.25 2.75H14.75A2.5 2.5 0 0 1 17.25 5.25V18.75A2.5 2.5 0 0 1 14.75 21.25H9.25A2.5 2.5 0 0 1 6.75 18.75V5.25A2.5 2.5 0 0 1 9.25 2.75Z",
          "M10.75 5.75H13.25",
          "M11.75 18A0.25 0.25 0 1 0 12.25 18A0.25 0.25 0 1 0 11.75 18Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.125 1H9.875A2.125 2.125 0 0 1 12 3.125V12.875A2.125 2.125 0 0 1 9.875 15H6.125A2.125 2.125 0 0 1 4 12.875V3.125A2.125 2.125 0 0 1 6.125 1ZM7.5 3.75H8.5A0.75 0.75 0 0 1 8.5 5.25H7.5A0.75 0.75 0 0 1 7.5 3.75ZM7.25 11.5A0.75 0.75 0 1 0 8.75 11.5A0.75 0.75 0 1 0 7.25 11.5Z"
          ]
        },
        "20": {
          "fill": [
            "M7.75 2H12.25A2.75 2.75 0 0 1 15 4.75V15.25A2.75 2.75 0 0 1 12.25 18H7.75A2.75 2.75 0 0 1 5 15.25V4.75A2.75 2.75 0 0 1 7.75 2ZM9.25 5H10.75A0.75 0.75 0 0 1 10.75 6.5H9.25A0.75 0.75 0 0 1 9.25 5ZM9 14A1 1 0 1 0 11 14A1 1 0 1 0 9 14Z"
          ]
        },
        "24": {
          "fill": [
            "M9.25 2H14.75A3.25 3.25 0 0 1 18 5.25V18.75A3.25 3.25 0 0 1 14.75 22H9.25A3.25 3.25 0 0 1 6 18.75V5.25A3.25 3.25 0 0 1 9.25 2ZM10.75 5H13.25A0.75 0.75 0 0 1 13.25 6.5H10.75A0.75 0.75 0 0 1 10.75 5ZM11 18A1 1 0 1 0 13 18A1 1 0 1 0 11 18Z"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Screen bezels",
      "tags": [
        "phone",
        "smartphone",
        "mobile",
        "device",
        "screen",
        "bezel"
      ],
      "note": "Rhythm: two bands wall to wall, each 1.5 from its end wall at every master, so the head and the chin are equal: band centre y 5.75 / 18.25 · 5.75 / 14.25 · 4.375 / 11.625 (desktop-3 draws its chin the same way, a line wall to wall). Screen between them 9×11 · 7×7 · 5.5×6. Body: ink 12×20 · 10×16 · 8×14 (0.60 · 0.63 · 0.57 wide-to-tall; Fluent phone is 12×20, Material 0.61, Phosphor 0.64), centred on the canvas, container radius 2.5 · 2 · 1.5 and walls 1.5 · 1.5 · 1.25 as cast-mobile, phone-contactless and calculator; inside 9×17 · 7×13 · 5.5×11.5; every edge on a whole unit at 16. Filled: head and chin solid, the screen left white between the walls (Material's filled smartphone) — two white slits read as a drawer, so they were not used. Cost: the 1.5 floor makes the bands heavy at small sizes; the screen is square at 20 and 5.5×6 at 16, so the phone reads more as a frame than as a slim slab. Pairs with tablet D. Who: Phosphor DeviceMobile, Material smartphone and stay_current_portrait, Carbon mobile (head band only).",
      "masters": {
        "16": [
          "M6.125 1.625H9.875A1.5 1.5 0 0 1 11.375 3.125V12.875A1.5 1.5 0 0 1 9.875 14.375H6.125A1.5 1.5 0 0 1 4.625 12.875V3.125A1.5 1.5 0 0 1 6.125 1.625Z",
          "M4.625 4.375H11.375",
          "M4.625 11.625H11.375"
        ],
        "20": [
          "M7.75 2.75H12.25A2 2 0 0 1 14.25 4.75V15.25A2 2 0 0 1 12.25 17.25H7.75A2 2 0 0 1 5.75 15.25V4.75A2 2 0 0 1 7.75 2.75Z",
          "M5.75 5.75H14.25",
          "M5.75 14.25H14.25"
        ],
        "24": [
          "M9.25 2.75H14.75A2.5 2.5 0 0 1 17.25 5.25V18.75A2.5 2.5 0 0 1 14.75 21.25H9.25A2.5 2.5 0 0 1 6.75 18.75V5.25A2.5 2.5 0 0 1 9.25 2.75Z",
          "M6.75 5.75H17.25",
          "M6.75 18.25H17.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.125 1H9.875A2.125 2.125 0 0 1 12 3.125V12.875A2.125 2.125 0 0 1 9.875 15H6.125A2.125 2.125 0 0 1 4 12.875V3.125A2.125 2.125 0 0 1 6.125 1ZM5.25 5H10.75V11H5.25Z"
          ]
        },
        "20": {
          "fill": [
            "M7.75 2H12.25A2.75 2.75 0 0 1 15 4.75V15.25A2.75 2.75 0 0 1 12.25 18H7.75A2.75 2.75 0 0 1 5 15.25V4.75A2.75 2.75 0 0 1 7.75 2ZM6.5 6.5H13.5V13.5H6.5Z"
          ]
        },
        "24": {
          "fill": [
            "M9.25 2H14.75A3.25 3.25 0 0 1 18 5.25V18.75A3.25 3.25 0 0 1 14.75 22H9.25A3.25 3.25 0 0 1 6 18.75V5.25A3.25 3.25 0 0 1 9.25 2ZM7.5 6.5H16.5V17.5H7.5Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Side button",
      "tags": [
        "phone",
        "smartphone",
        "mobile",
        "device",
        "side button",
        "power button"
      ],
      "note": "Rhythm: the face is left clean; one button stands 1 proud of the right wall, ink 3.5 · 3 · 2.5 long, its top 3.75 · 2.75 · 2.75 below the body's top — just under the corner arc, in the upper third, where Material puts it. The button is a closed stub that merges with the wall (no white inside it). Body: ink 12×20 · 10×16 · 8×14 (0.60 · 0.63 · 0.57 wide-to-tall; Fluent phone is 12×20, Material 0.61, Phosphor 0.64), centred on the canvas, container radius 2.5 · 2 · 1.5 and walls 1.5 · 1.5 · 1.25 as cast-mobile, phone-contactless and calculator; inside 9×17 · 7×13 · 5.5×11.5; every edge on a whole unit at 16. Balance: the body stays on the canvas centre (same place as A–D, so devices can swap them); the button makes the ink 13×20 · 11×16 · 9×14, declared as box with optical 0.5 0, since a 1-unit nub does not move the eye. Filled: body solid, the button stays at the outline weight. Risk: an empty face with one nub can read as a battery at a glance; adding B's camera dot is Material's full version. No tablet twin. Who: Material Symbols mobile, mobile_2, mobile_3 (button on the right wall).",
      "masters": {
        "16": [
          "M6.125 1.625H9.875A1.5 1.5 0 0 1 11.375 3.125V12.875A1.5 1.5 0 0 1 9.875 14.375H6.125A1.5 1.5 0 0 1 4.625 12.875V3.125A1.5 1.5 0 0 1 6.125 1.625Z",
          "M11.375 4.375H12.375V5.625H11.375Z"
        ],
        "20": [
          "M7.75 2.75H12.25A2 2 0 0 1 14.25 4.75V15.25A2 2 0 0 1 12.25 17.25H7.75A2 2 0 0 1 5.75 15.25V4.75A2 2 0 0 1 7.75 2.75Z",
          "M14.25 5.5H15.25V7H14.25Z"
        ],
        "24": [
          "M9.25 2.75H14.75A2.5 2.5 0 0 1 17.25 5.25V18.75A2.5 2.5 0 0 1 14.75 21.25H9.25A2.5 2.5 0 0 1 6.75 18.75V5.25A2.5 2.5 0 0 1 9.25 2.75Z",
          "M17.25 6.5H18.25V8.5H17.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.125 1H9.875A2.125 2.125 0 0 1 12 3.125V12.875A2.125 2.125 0 0 1 9.875 15H6.125A2.125 2.125 0 0 1 4 12.875V3.125A2.125 2.125 0 0 1 6.125 1Z"
          ],
          "stroke": [
            "M11.375 4.375H12.375V5.625H11.375Z"
          ]
        },
        "20": {
          "fill": [
            "M7.75 2H12.25A2.75 2.75 0 0 1 15 4.75V15.25A2.75 2.75 0 0 1 12.25 18H7.75A2.75 2.75 0 0 1 5 15.25V4.75A2.75 2.75 0 0 1 7.75 2Z"
          ],
          "stroke": [
            "M14.25 5.5H15.25V7H14.25Z"
          ]
        },
        "24": {
          "fill": [
            "M9.25 2H14.75A3.25 3.25 0 0 1 18 5.25V18.75A3.25 3.25 0 0 1 14.75 22H9.25A3.25 3.25 0 0 1 6 18.75V5.25A3.25 3.25 0 0 1 9.25 2Z"
          ],
          "stroke": [
            "M17.25 6.5H18.25V8.5H17.25Z"
          ]
        }
      },
      "box": {
        "16": [
          9,
          14
        ],
        "20": [
          11,
          16
        ],
        "24": [
          13,
          20
        ]
      },
      "optical": {
        "16": [
          0.5,
          0
        ],
        "20": [
          0.5,
          0
        ],
        "24": [
          0.5,
          0
        ]
      }
    }
  ]
};
