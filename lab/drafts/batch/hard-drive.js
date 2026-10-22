// hard-drive: the set has database (a cylinder) for data but no storage device yet; this picks the picture of the drive itself, and the body chosen here is the one hard-drive-download / -upload, backup and a later server will build on — so it must never read as database, server, keyboard or speaker.
export default {
  "concept": "hard-drive",
  "question": "Which picture says hard drive: the drive box seen in perspective (A), its front face (B), an external slab with one light (C), or the disk inside it (D platter, E platter edge)?",
  "candidates": [
    {
      "id": "A",
      "label": "Perspective drive",
      "tags": [
        "storage",
        "disk",
        "hdd",
        "drive",
        "perspective",
        "lid"
      ],
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
          16
        ]
      },
      "note": "Rhythm: one 1.5 of air round the lights at every master — light to divider, light to floor, light to light and light to the right wall all 1.5 · 1.5 · 1.5; lights ⌀2 · 2 · 1.5 (calculator's dots), pitch 3.5 · 3.5 · 3. Band 6.5 · 6.5 · 5.75 tall on the centrelines (the least that holds the light with 1.5 each side), lid 8 · 6 · 5 above it. Ink 20×16 · 16×14 · 14×12, box-centred (the 20 and 16 boxes are radio's and desktop's). Body the full width, bottom corners r2.5 · 2 · 1.5 (container), lid corners r1.5 · 1.25 · 1 (detail radius). The lid's sides run at 2 down for 1 across (63.4°) at every master, so the top edge is 57 · 59 · 61% of the body — an angle off 0/45/90 on purpose, as radio's strap: a 45° lid (Material's) is too shallow to read as a lid at 16. The divider meets the walls where the lid starts, joined sharp under round joins (save's chamfer). Off-grid values are the lid corners' tangent points. Filled: lid and band are two solids with a 1.5 cut where the divider was (archive's), cut corners eased 0.5; lights white holes ⌀2 · 2 · 1.5 with 1.5 of material to the cut. Who: Lucide hard-drive, Nucleo hard-drive, Iconoir hard-drive, Fluent HardDrive, Boxicons hdd, Remix hard-drive-3, Material hard_drive (45° version). (recommended) — it is the hard drive most sets draw, and the sloped lid is what tells it apart from a keyboard, a server unit or any other box, even at 16.",
      "masters": {
        "16": [
          "M4.743 2.625H11.257A1 1 0 0 1 12.151 3.178L14.375 7.625V11.875A1.5 1.5 0 0 1 12.875 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V7.625L3.849 3.178A1 1 0 0 1 4.743 2.625Z",
          "M1.625 7.625H14.375",
          "M8.375 10.5A0.125 0.125 0 1 0 8.625 10.5A0.125 0.125 0 1 0 8.375 10.5Z",
          "M11.375 10.5A0.125 0.125 0 1 0 11.625 10.5A0.125 0.125 0 1 0 11.375 10.5Z"
        ],
        "20": [
          "M6.52 3.75H13.48A1.25 1.25 0 0 1 14.6 4.44L17.25 9.75V14.25A2 2 0 0 1 15.25 16.25H4.75A2 2 0 0 1 2.75 14.25V9.75L5.4 4.44A1.25 1.25 0 0 1 6.52 3.75Z",
          "M2.75 9.75H17.25",
          "M10.25 13A0.25 0.25 0 1 0 10.75 13A0.25 0.25 0 1 0 10.25 13Z",
          "M13.75 13A0.25 0.25 0 1 0 14.25 13A0.25 0.25 0 1 0 13.75 13Z"
        ],
        "24": [
          "M7.68 4.75H16.32A1.5 1.5 0 0 1 17.66 5.58L21.25 12.75V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V12.75L6.34 5.58A1.5 1.5 0 0 1 7.68 4.75Z",
          "M2.75 12.75H21.25",
          "M14.25 16A0.25 0.25 0 1 0 14.75 16A0.25 0.25 0 1 0 14.25 16Z",
          "M17.75 16A0.25 0.25 0 1 0 18.25 16A0.25 0.25 0 1 0 17.75 16Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.743 2H11.257A1.625 1.625 0 0 1 12.71 2.898L14.337 6.151A0.5 0.5 0 0 1 13.89 6.875H2.11A0.5 0.5 0 0 1 1.663 6.151L3.29 2.898A1.625 1.625 0 0 1 4.743 2Z",
            "M15 8.875V11.875A2.125 2.125 0 0 1 12.875 14H3.125A2.125 2.125 0 0 1 1 11.875V8.875A0.5 0.5 0 0 1 1.5 8.375H14.5A0.5 0.5 0 0 1 15 8.875ZM7.75 10.5A0.75 0.75 0 1 0 9.25 10.5A0.75 0.75 0 1 0 7.75 10.5ZM10.75 10.5A0.75 0.75 0 1 0 12.25 10.5A0.75 0.75 0 1 0 10.75 10.5Z"
          ]
        },
        "20": {
          "fill": [
            "M6.52 3H13.48A2 2 0 0 1 15.27 4.11L17.35 8.28A0.5 0.5 0 0 1 16.9 9H3.1A0.5 0.5 0 0 1 2.65 8.28L4.73 4.11A2 2 0 0 1 6.52 3Z",
            "M18 11V14.25A2.75 2.75 0 0 1 15.25 17H4.75A2.75 2.75 0 0 1 2 14.25V11A0.5 0.5 0 0 1 2.5 10.5H17.5A0.5 0.5 0 0 1 18 11ZM9.5 13A1 1 0 1 0 11.5 13A1 1 0 1 0 9.5 13ZM13 13A1 1 0 1 0 15 13A1 1 0 1 0 13 13Z"
          ]
        },
        "24": {
          "fill": [
            "M7.68 4H16.32A2.25 2.25 0 0 1 18.34 5.24L21.35 11.28A0.5 0.5 0 0 1 20.9 12H3.1A0.5 0.5 0 0 1 2.65 11.28L5.66 5.24A2.25 2.25 0 0 1 7.68 4Z",
            "M22 14V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V14A0.5 0.5 0 0 1 2.5 13.5H21.5A0.5 0.5 0 0 1 22 14ZM13.5 16A1 1 0 1 0 15.5 16A1 1 0 1 0 13.5 16ZM17 16A1 1 0 1 0 19 16A1 1 0 1 0 17 16Z"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Drive face",
      "tags": [
        "storage",
        "disk",
        "hdd",
        "drive",
        "front",
        "face"
      ],
      "box": {
        "24": [
          20,
          18
        ]
      },
      "note": "Rhythm: the lights keep A's 1.5 everywhere — to the divider, the floor, each other and the right wall, at 24 · 20 · 16; lights ⌀2 · 2 · 1.5, pitch 3.5 · 3.5 · 3. Band 6.5 · 6.5 · 5.75 on the centrelines, face 10 · 8 · 7 above it, so the band is 40 · 45 · 46% of the ink height. Ink 20×18 · 16×16 · 14×14 (radio's box at 24, the circle keyline at 20 and 16 — the band cannot shrink below the light, so the smaller masters stand taller to keep the face above it); corners r2.5 · 2 · 1.5 (container), divider wall to wall. Filled: face and band two solids with a 1.5 cut, eased 0.5 at the walls; lights white holes, 1.5 of material to the cut. Who: Font Awesome hard-drive, Material hard_drive_2, Remix hard-drive-2. The drive head-on, no lid: the plainest drive, but without the lid it leans toward a window or a panel at 16.",
      "masters": {
        "16": [
          "M3.125 1.625H12.875A1.5 1.5 0 0 1 14.375 3.125V12.875A1.5 1.5 0 0 1 12.875 14.375H3.125A1.5 1.5 0 0 1 1.625 12.875V3.125A1.5 1.5 0 0 1 3.125 1.625Z",
          "M1.625 8.625H14.375",
          "M8.375 11.5A0.125 0.125 0 1 0 8.625 11.5A0.125 0.125 0 1 0 8.375 11.5Z",
          "M11.375 11.5A0.125 0.125 0 1 0 11.625 11.5A0.125 0.125 0 1 0 11.375 11.5Z"
        ],
        "20": [
          "M4.75 2.75H15.25A2 2 0 0 1 17.25 4.75V15.25A2 2 0 0 1 15.25 17.25H4.75A2 2 0 0 1 2.75 15.25V4.75A2 2 0 0 1 4.75 2.75Z",
          "M2.75 10.75H17.25",
          "M10.25 14A0.25 0.25 0 1 0 10.75 14A0.25 0.25 0 1 0 10.25 14Z",
          "M13.75 14A0.25 0.25 0 1 0 14.25 14A0.25 0.25 0 1 0 13.75 14Z"
        ],
        "24": [
          "M5.25 3.75H18.75A2.5 2.5 0 0 1 21.25 6.25V17.75A2.5 2.5 0 0 1 18.75 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V6.25A2.5 2.5 0 0 1 5.25 3.75Z",
          "M2.75 13.75H21.25",
          "M14.25 17A0.25 0.25 0 1 0 14.75 17A0.25 0.25 0 1 0 14.25 17Z",
          "M17.75 17A0.25 0.25 0 1 0 18.25 17A0.25 0.25 0 1 0 17.75 17Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 1H12.875A2.125 2.125 0 0 1 15 3.125V7.375A0.5 0.5 0 0 1 14.5 7.875H1.5A0.5 0.5 0 0 1 1 7.375V3.125A2.125 2.125 0 0 1 3.125 1Z",
            "M15 9.875V12.875A2.125 2.125 0 0 1 12.875 15H3.125A2.125 2.125 0 0 1 1 12.875V9.875A0.5 0.5 0 0 1 1.5 9.375H14.5A0.5 0.5 0 0 1 15 9.875ZM7.75 11.5A0.75 0.75 0 1 0 9.25 11.5A0.75 0.75 0 1 0 7.75 11.5ZM10.75 11.5A0.75 0.75 0 1 0 12.25 11.5A0.75 0.75 0 1 0 10.75 11.5Z"
          ]
        },
        "20": {
          "fill": [
            "M4.75 2H15.25A2.75 2.75 0 0 1 18 4.75V9.5A0.5 0.5 0 0 1 17.5 10H2.5A0.5 0.5 0 0 1 2 9.5V4.75A2.75 2.75 0 0 1 4.75 2Z",
            "M18 12V15.25A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25V12A0.5 0.5 0 0 1 2.5 11.5H17.5A0.5 0.5 0 0 1 18 12ZM9.5 14A1 1 0 1 0 11.5 14A1 1 0 1 0 9.5 14ZM13 14A1 1 0 1 0 15 14A1 1 0 1 0 13 14Z"
          ]
        },
        "24": {
          "fill": [
            "M5.25 3H18.75A3.25 3.25 0 0 1 22 6.25V12.5A0.5 0.5 0 0 1 21.5 13H2.5A0.5 0.5 0 0 1 2 12.5V6.25A3.25 3.25 0 0 1 5.25 3Z",
            "M22 15V17.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75V15A0.5 0.5 0 0 1 2.5 14.5H21.5A0.5 0.5 0 0 1 22 15ZM13.5 17A1 1 0 1 0 15.5 17A1 1 0 1 0 13.5 17ZM17 17A1 1 0 1 0 19 17A1 1 0 1 0 17 17Z"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "External slab",
      "tags": [
        "storage",
        "disk",
        "hdd",
        "external",
        "portable",
        "slab"
      ],
      "box": {
        "16": [
          14,
          10
        ],
        "20": [
          16,
          11
        ],
        "24": [
          20,
          12
        ]
      },
      "note": "Rhythm: one light with equal air on its three near sides — above, below and to the right wall 3.5 · 3 · 3 — so it sits as a dot set into the corner, not floating. Light ⌀2 · 2 · 1.5. Body is keyboard's exactly: ink 20×12 · 16×11 · 14×10, corners r2.5 · 2 · 1.5, inside 17×9 · 13×8 · 11.5×7.5. Filled: the slab solid, the light a white hole ⌀2 · 2 · 1.5. Who: Phosphor HardDrive (its HardDrives stacks two). The portable drive on a desk; the quietest of the five, and at 16 a slab with one dot can pass for a button or a card.",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M9.875 8A0.125 0.125 0 1 0 10.125 8A0.125 0.125 0 1 0 9.875 8Z"
        ],
        "20": [
          "M4.75 5.25H15.25A2 2 0 0 1 17.25 7.25V12.75A2 2 0 0 1 15.25 14.75H4.75A2 2 0 0 1 2.75 12.75V7.25A2 2 0 0 1 4.75 5.25Z",
          "M12.25 10A0.25 0.25 0 1 0 12.75 10A0.25 0.25 0 1 0 12.25 10Z"
        ],
        "24": [
          "M5.25 6.75H18.75A2.5 2.5 0 0 1 21.25 9.25V14.75A2.5 2.5 0 0 1 18.75 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M15.75 12A0.25 0.25 0 1 0 16.25 12A0.25 0.25 0 1 0 15.75 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM9.25 8A0.75 0.75 0 1 0 10.75 8A0.75 0.75 0 1 0 9.25 8Z"
          ]
        },
        "20": {
          "fill": [
            "M4.75 4.5H15.25A2.75 2.75 0 0 1 18 7.25V12.75A2.75 2.75 0 0 1 15.25 15.5H4.75A2.75 2.75 0 0 1 2 12.75V7.25A2.75 2.75 0 0 1 4.75 4.5ZM11.5 10A1 1 0 1 0 13.5 10A1 1 0 1 0 11.5 10Z"
          ]
        },
        "24": {
          "fill": [
            "M5.25 6H18.75A3.25 3.25 0 0 1 22 9.25V14.75A3.25 3.25 0 0 1 18.75 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM15 12A1 1 0 1 0 17 12A1 1 0 1 0 15 12Z"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Platter inside",
      "tags": [
        "storage",
        "disk",
        "hdd",
        "platter",
        "internal",
        "disc"
      ],
      "note": "Rhythm: the platter keeps 1.5 to the top and both walls, and the air below it splits evenly — platter to bar and bar to floor 2 · 2 · 2.125; the bar is as long as the platter is wide (10 · 6 · 4.5). Ink 16×20 · 12×16 · 10×14 (portrait keyline; a 3.5-inch drive is portrait), corners r2.5 · 2 · 1.5. Platter ring ⌀10 · 6 · 4.5 on the ink. The hub (⌀2, 2.5 of air in the ring) is drawn at 24 only: the hole is 3 at 20 and 2 at 16, and a ⌀2 or ⌀1.5 hub cannot keep 1.5 of air in it — dropped, not squeezed. Filled: body solid, platter a 1.5 white band round a solid core ⌀7 · 3 · 1.5 (radio's ring), hub a ⌀2 hole at 24, bar a 1.5 slot. Who: Material hard_disk. The only one that shows what is inside the drive, but it shares speaker's body (16×20, a ring and a mark): speaker's ring sits low, this one high, and at 16 without the hub the two are close. A read arm across the platter was tried and dropped: from the bottom-right corner it reads as search's magnifier, and with the hub there is no room for it to reach the disk with 1.5 of air.",
      "masters": {
        "16": [
          "M5.125 1.625H10.875A1.5 1.5 0 0 1 12.375 3.125V12.875A1.5 1.5 0 0 1 10.875 14.375H5.125A1.5 1.5 0 0 1 3.625 12.875V3.125A1.5 1.5 0 0 1 5.125 1.625Z",
          "M6.375 6A1.625 1.625 0 1 0 9.625 6A1.625 1.625 0 1 0 6.375 6Z",
          "M6.375 11H9.625"
        ],
        "20": [
          "M6.75 2.75H13.25A2 2 0 0 1 15.25 4.75V15.25A2 2 0 0 1 13.25 17.25H6.75A2 2 0 0 1 4.75 15.25V4.75A2 2 0 0 1 6.75 2.75Z",
          "M7.75 8A2.25 2.25 0 1 0 12.25 8A2.25 2.25 0 1 0 7.75 8Z",
          "M7.75 13.75H12.25"
        ],
        "24": [
          "M7.25 2.75H16.75A2.5 2.5 0 0 1 19.25 5.25V18.75A2.5 2.5 0 0 1 16.75 21.25H7.25A2.5 2.5 0 0 1 4.75 18.75V5.25A2.5 2.5 0 0 1 7.25 2.75Z",
          "M7.75 10A4.25 4.25 0 1 0 16.25 10A4.25 4.25 0 1 0 7.75 10Z",
          "M11.75 10A0.25 0.25 0 1 0 12.25 10A0.25 0.25 0 1 0 11.75 10Z",
          "M7.75 17.75H16.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.125 1H10.875A2.125 2.125 0 0 1 13 3.125V12.875A2.125 2.125 0 0 1 10.875 15H5.125A2.125 2.125 0 0 1 3 12.875V3.125A2.125 2.125 0 0 1 5.125 1ZM5.75 6A2.25 2.25 0 1 0 10.25 6A2.25 2.25 0 1 0 5.75 6ZM7.25 6A0.75 0.75 0 1 0 8.75 6A0.75 0.75 0 1 0 7.25 6ZM6.375 10.25H9.625A0.75 0.75 0 0 1 9.625 11.75H6.375A0.75 0.75 0 0 1 6.375 10.25Z"
          ]
        },
        "20": {
          "fill": [
            "M6.75 2H13.25A2.75 2.75 0 0 1 16 4.75V15.25A2.75 2.75 0 0 1 13.25 18H6.75A2.75 2.75 0 0 1 4 15.25V4.75A2.75 2.75 0 0 1 6.75 2ZM7 8A3 3 0 1 0 13 8A3 3 0 1 0 7 8ZM8.5 8A1.5 1.5 0 1 0 11.5 8A1.5 1.5 0 1 0 8.5 8ZM7.75 13H12.25A0.75 0.75 0 0 1 12.25 14.5H7.75A0.75 0.75 0 0 1 7.75 13Z"
          ]
        },
        "24": {
          "fill": [
            "M7.25 2H16.75A3.25 3.25 0 0 1 20 5.25V18.75A3.25 3.25 0 0 1 16.75 22H7.25A3.25 3.25 0 0 1 4 18.75V5.25A3.25 3.25 0 0 1 7.25 2ZM7 10A5 5 0 1 0 17 10A5 5 0 1 0 7 10ZM8.5 10A3.5 3.5 0 1 0 15.5 10A3.5 3.5 0 1 0 8.5 10ZM11 10A1 1 0 1 0 13 10A1 1 0 1 0 11 10ZM7.75 17H16.25A0.75 0.75 0 0 1 16.25 18.5H7.75A0.75 0.75 0 0 1 7.75 17Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Platter edge",
      "tags": [
        "storage",
        "disk",
        "hdd",
        "platter",
        "internal",
        "arc"
      ],
      "note": "Rhythm: the platter's edge is a quarter circle centred on the box's top-left corner point, meeting the top and left walls square-on at their midpoints (radius 8.25 · 6.25 · 5.375, half the box), so the two pieces it makes balance across the diagonal; one light in the far corner with 1.5 to both walls at every master, ⌀2 · 2 · 1.5. Ink 18×18 · 14×14 · 12×12 (square keyline), corners r2.5 · 2 · 1.5. Filled: two solids split by a 1.5 arc cut, eased 0.5 where it meets the edge; the light a white hole. Off-grid values are those eases' tangent points. Who: Remix hard-drive. A second construction of D's metaphor (the disk inside), not a fifth picture — sets show the drive four ways; this is the strongest other drawing of the disk, and at 16 the arc can read as a page corner.",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M8 2.625A5.375 5.375 0 0 1 2.625 8",
          "M10.375 10.5A0.125 0.125 0 1 0 10.625 10.5A0.125 0.125 0 1 0 10.375 10.5Z"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M10 3.75A6.25 6.25 0 0 1 3.75 10",
          "M12.75 13A0.25 0.25 0 1 0 13.25 13A0.25 0.25 0 1 0 12.75 13Z"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M12 3.75A8.25 8.25 0 0 1 3.75 12",
          "M16.75 17A0.25 0.25 0 1 0 17.25 17A0.25 0.25 0 1 0 16.75 17Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.748 2H4.125A2.125 2.125 0 0 0 2 4.125V6.748A0.5 0.5 0 0 0 2.485 7.248A4.625 4.625 0 0 0 7.248 2.485A0.5 0.5 0 0 0 6.748 2Z",
            "M9.249 2H11.875A2.125 2.125 0 0 1 14 4.125V11.875A2.125 2.125 0 0 1 11.875 14H4.125A2.125 2.125 0 0 1 2 11.875V9.249A0.5 0.5 0 0 1 2.509 8.749A6.125 6.125 0 0 0 8.749 2.509A0.5 0.5 0 0 1 9.249 2ZM9.75 10.5A0.75 0.75 0 1 0 11.25 10.5A0.75 0.75 0 1 0 9.75 10.5Z"
          ]
        },
        "20": {
          "fill": [
            "M8.74 3H5.75A2.75 2.75 0 0 0 3 5.75V8.74A0.5 0.5 0 0 0 3.48 9.24A5.5 5.5 0 0 0 9.24 3.48A0.5 0.5 0 0 0 8.74 3Z",
            "M11.25 3H14.25A2.75 2.75 0 0 1 17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H5.75A2.75 2.75 0 0 1 3 14.25V11.25A0.5 0.5 0 0 1 3.52 10.75A7 7 0 0 0 10.75 3.52A0.5 0.5 0 0 1 11.25 3ZM12 13A1 1 0 1 0 14 13A1 1 0 1 0 12 13Z"
          ]
        },
        "24": {
          "fill": [
            "M10.75 3H6.25A3.25 3.25 0 0 0 3 6.25V10.75A0.5 0.5 0 0 0 3.48 11.25A7.5 7.5 0 0 0 11.25 3.48A0.5 0.5 0 0 0 10.75 3Z",
            "M13.25 3H17.75A3.25 3.25 0 0 1 21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V13.25A0.5 0.5 0 0 1 3.51 12.75A9 9 0 0 0 12.75 3.51A0.5 0.5 0 0 1 13.25 3ZM16 17A1 1 0 1 0 18 17A1 1 0 1 0 16 17Z"
          ]
        }
      }
    }
  ]
};
