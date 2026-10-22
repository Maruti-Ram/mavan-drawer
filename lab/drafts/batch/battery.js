// battery: the body chosen here is the one battery-charging and the level family (-low, -full; C28) will be drawn on, so it decides whether three charge cells can ever fit at 20 and 16.
export default {
  "concept": "battery",
  "question": "Which picture says battery: the plain horizontal cell (A), the cell showing its charge as three cells (B) or as a filled level (C), the vertical cell (D), or the car battery (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Horizontal, empty",
      "tags": [
        "horizontal",
        "empty",
        "cell",
        "power",
        "charge",
        "energy"
      ],
      "box": {
        "16": [
          14,
          8
        ],
        "20": [
          16,
          9
        ],
        "24": [
          20,
          12
        ]
      },
      "note": "Rhythm: one clean container, nothing inside. Body 18.5×12 · 14.5×9 · 12.75×8, container radius 2.5 · 2 · 1.5 on the line (keyboard's and credit-card's; filled outer 3.25 · 2.75 · 2.125). Nub solid and joined to the wall, one line past it (1.5 · 1.5 · 1.25) and half the body's height (6 · 4.5 · 4), centred on the body; it is drawn as a closed bar on the wall's centreline so no white is left inside it. Off-grid values 20.49 · 16.45 · 13.746 in the filled files are where the corner arc meets the nub's edge (computed). Ink 20×12 · 16×9 · 14×8, box-centred, so the body sits 0.75 · 0.75 · 0.625 left of the canvas centre. Inside white 15.5×9 · 11.5×6 · 10.25×5.5. The nub is joined, not floating 1.5 off the wall as Lucide's is: with a floating nub the body shrinks to 17 · 13 · 11.25 wide, and three charge cells would keep only 2.375 · 1.375 · 1.25 of air, under 1.5 at 20 and 16, so the level family could not be drawn at all; joined, they keep 2.75 · 1.75 · 1.625 (B). A shipped bolt (16×20 · 12×16 · 10×14) cannot sit inside with 1.5 of air, since the room is 6 · 3 · 2.5 tall, so battery-charging will need the bolt crossing the wall (Lucide) or a C33 badge. Filled: one solid shape, the nub included. Lint clean at every master in both styles. Who: Lucide battery, Tabler battery, Phosphor BatteryEmpty, Central battery-empty, Untitled battery-empty, SF battery.0percent. (recommended) — it is the battery every set ships as the plain word, and its body is the one battery-charging and every level member can share unchanged.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "Three charge cells",
      "tags": [
        "horizontal",
        "full",
        "cells",
        "bars",
        "level",
        "charge"
      ],
      "box": {
        "16": [
          14,
          8
        ],
        "20": [
          16,
          9
        ],
        "24": [
          20,
          12
        ]
      },
      "note": "Rhythm: three bars on one even pitch, 4.25 · 3.25 · 2.875, with the same air between bars as from the end bars to the walls, 2.75 · 1.75 · 1.625, all four gaps equal at every master. The bars are line-wide (1.5 · 1.5 · 1.25) and 5 · 3 · 2.5 of ink tall, with 2 · 1.5 · 1.5 of air above and below. Body and nub are A's, unchanged: this is battery-full in A's level family (C28: one body, identical and in place), so -low and -medium drop bars from the right and keep the rest at their coordinates. Body 18.5×12 · 14.5×9 · 12.75×8, container radius 2.5 · 2 · 1.5 on the line (keyboard's and credit-card's; filled outer 3.25 · 2.75 · 2.125). Nub solid and joined to the wall, one line past it (1.5 · 1.5 · 1.25) and half the body's height (6 · 4.5 · 4), centred on the body; it is drawn as a closed bar on the wall's centreline so no white is left inside it. Off-grid values 20.49 · 16.45 · 13.746 in the filled files are where the corner arc meets the nub's edge (computed). Ink 20×12 · 16×9 · 14×8, box-centred, so the body sits 0.75 · 0.75 · 0.625 left of the canvas centre. Inside white 15.5×9 · 11.5×6 · 10.25×5.5. Filled: the body solid, the bars cut as white slots 1.5 wide at every master (at 16 wider than the 1.25 line, C22) at the outline bars' length, leaving 2.75 · 1.75 · 1.375 of material between slots (floor 1.25 at 16). Lint clean. Who: Lucide battery-full, Central battery-full, Untitled battery-full, Tabler battery-1…4, Phosphor BatteryHigh, Nucleo battery-high. At 16 at real size the three bars run together into one grey band; the outline still reads as a battery.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M4.5 7.375V8.625",
          "M7.375 7.375V8.625",
          "M10.25 7.375V8.625"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M6 9.25V10.75",
          "M9.25 9.25V10.75",
          "M12.5 9.25V10.75"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M7 10.25V13.75",
          "M11.25 10.25V13.75",
          "M15.5 10.25V13.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM3.75 7.5A0.75 0.75 0 0 1 5.25 7.5V8.5A0.75 0.75 0 0 1 3.75 8.5ZM6.625 7.5A0.75 0.75 0 0 1 8.125 7.5V8.5A0.75 0.75 0 0 1 6.625 8.5ZM9.5 7.5A0.75 0.75 0 0 1 11 7.5V8.5A0.75 0.75 0 0 1 9.5 8.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5.25 9.25A0.75 0.75 0 0 1 6.75 9.25V10.75A0.75 0.75 0 0 1 5.25 10.75ZM8.5 9.25A0.75 0.75 0 0 1 10 9.25V10.75A0.75 0.75 0 0 1 8.5 10.75ZM11.75 9.25A0.75 0.75 0 0 1 13.25 9.25V10.75A0.75 0.75 0 0 1 11.75 10.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM6.25 10.25A0.75 0.75 0 0 1 7.75 10.25V13.75A0.75 0.75 0 0 1 6.25 13.75ZM10.5 10.25A0.75 0.75 0 0 1 12 10.25V13.75A0.75 0.75 0 0 1 10.5 13.75ZM14.75 10.25A0.75 0.75 0 0 1 16.25 10.25V13.75A0.75 0.75 0 0 1 14.75 13.75Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Filled charge level",
      "tags": [
        "horizontal",
        "level",
        "charge",
        "half",
        "gauge"
      ],
      "box": {
        "16": [
          14,
          8
        ],
        "20": [
          16,
          9
        ],
        "24": [
          20,
          12
        ]
      },
      "note": "Rhythm: one divider splits the inside 2 : 1, charged white 9.25 · 6.75 · 6 to empty white 4.75 · 3.25 · 3 (1.95 · 2.08 · 2.0), the divider a line wide and joined to the top and bottom walls. Built as layout-sidebar-2 is: in the outline a divider, in the filled twin the charged part solid to the walls and the empty part left as a white cell (inner corners r1.75 · 1.25 · 0.875, the wall's own inner radius). Body and nub are A's. Body 18.5×12 · 14.5×9 · 12.75×8, container radius 2.5 · 2 · 1.5 on the line (keyboard's and credit-card's; filled outer 3.25 · 2.75 · 2.125). Nub solid and joined to the wall, one line past it (1.5 · 1.5 · 1.25) and half the body's height (6 · 4.5 · 4), centred on the body; it is drawn as a closed bar on the wall's centreline so no white is left inside it. Off-grid values 20.49 · 16.45 · 13.746 in the filled files are where the corner arc meets the nub's edge (computed). Ink 20×12 · 16×9 · 14×8, box-centred, so the body sits 0.75 · 0.75 · 0.625 left of the canvas centre. Inside white 15.5×9 · 11.5×6 · 10.25×5.5. Lint clean. Who: Material battery_horiz_050/075 and battery_1…6_bar, SF battery.25/.50/.75percent, Fluent Battery 1–9, the iOS status bar (all of these draw the level as a solid block). Our outline style cannot draw a solid block inside a line, so the outline shows only the divider, and at 16 it reads as a box split in two. The filled twin carries the picture; and it says \"partly charged\", closer to battery-medium than plain battery.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M8.875 4.625V11.375"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M11 6.25V13.75"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M13.5 6.75V17.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM9.5 5.25H11.625A0.875 0.875 0 0 1 12.5 6.125V9.875A0.875 0.875 0 0 1 11.625 10.75H9.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM11.75 7H13.75A1.25 1.25 0 0 1 15 8.25V11.75A1.25 1.25 0 0 1 13.75 13H11.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM14.25 7.5H17.25A1.75 1.75 0 0 1 19 9.25V14.75A1.75 1.75 0 0 1 17.25 16.5H14.25Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Vertical cell",
      "tags": [
        "vertical",
        "upright",
        "cell",
        "phone",
        "power"
      ],
      "box": {
        "16": [
          8,
          14
        ],
        "20": [
          9,
          16
        ],
        "24": [
          12,
          20
        ]
      },
      "note": "Rhythm: A's body turned a quarter, nub up: the same lengths and radii, so the wall, corner and nub match A to the hundredth (body 12×18.5 · 9×14.5 · 8×12.75, radius 2.5 · 2 · 1.5, nub 6 · 4.5 · 4 wide and 1.5 · 1.5 · 1.25 tall, centred). Ink 12×20 · 9×16 · 8×14, box-centred; it fills the portrait keyline's height and is narrower than plug (16×20 · 12×16 · 10×14). Off-grid values 3.51 · 3.55 · 2.254 in the filled files are the corner arc meeting the nub (computed). Filled: one solid shape, Material's filled battery_full. Lint clean. Who: Material battery_full / battery_std, Tabler battery-vertical, Phosphor BatteryVertical (Empty to Full). Next to plug and desktop it reads as a phone or a tube more than a battery at 16, because the nub is the only clue and it is 4 wide.",
      "masters": {
        "16": [
          "M4.625 12.875V4.375A1.5 1.5 0 0 1 6.125 2.875H9.875A1.5 1.5 0 0 1 11.375 4.375V12.875A1.5 1.5 0 0 1 9.875 14.375H6.125A1.5 1.5 0 0 1 4.625 12.875Z",
          "M6.625 2.875V1.625H9.375V2.875Z"
        ],
        "20": [
          "M6.25 15.25V6.25A2 2 0 0 1 8.25 4.25H11.75A2 2 0 0 1 13.75 6.25V15.25A2 2 0 0 1 11.75 17.25H8.25A2 2 0 0 1 6.25 15.25Z",
          "M8.5 4.25V2.75H11.5V4.25Z"
        ],
        "24": [
          "M6.75 18.75V6.75A2.5 2.5 0 0 1 9.25 4.25H14.75A2.5 2.5 0 0 1 17.25 6.75V18.75A2.5 2.5 0 0 1 14.75 21.25H9.25A2.5 2.5 0 0 1 6.75 18.75Z",
          "M9.75 4.25V2.75H14.25V4.25Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4 12.875V4.375A2.125 2.125 0 0 1 6 2.254V1.625A0.625 0.625 0 0 1 6.625 1H9.375A0.625 0.625 0 0 1 10 1.625V2.254A2.125 2.125 0 0 1 12 4.375V12.875A2.125 2.125 0 0 1 9.875 15H6.125A2.125 2.125 0 0 1 4 12.875Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M5.5 15.25V6.25A2.75 2.75 0 0 1 7.75 3.55V2.75A0.75 0.75 0 0 1 8.5 2H11.5A0.75 0.75 0 0 1 12.25 2.75V3.55A2.75 2.75 0 0 1 14.5 6.25V15.25A2.75 2.75 0 0 1 11.75 18H8.25A2.75 2.75 0 0 1 5.5 15.25Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6 18.75V6.75A3.25 3.25 0 0 1 9 3.51V2.75A0.75 0.75 0 0 1 9.75 2H14.25A0.75 0.75 0 0 1 15 2.75V3.51A3.25 3.25 0 0 1 18 6.75V18.75A3.25 3.25 0 0 1 14.75 22H9.25A3.25 3.25 0 0 1 6 18.75Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Car battery",
      "tags": [
        "car",
        "automotive",
        "accumulator",
        "terminals",
        "plus minus",
        "vehicle"
      ],
      "box": {
        "16": [
          14,
          10
        ],
        "20": [
          16,
          12
        ],
        "24": [
          20,
          16
        ]
      },
      "note": "Rhythm: the minus and plus are the same size, 4 · 3.5 · 3.25 square, with equal air wall to sign to sign to wall, 3 / 3 / 3 · 2 / 2 / 2 · 1.625 / 1.75 / 1.625 (at 16 the eighth grid puts the extra 0.125 in the middle), and 3.75 · 2 · 1.5 of air above and below. Two solid terminals stand one line (1.5 · 1.5 · 1.25) above the top wall, 3 · 3 · 2.5 wide and centred over the signs (centres 8.5 / 15.5 · 7.25 / 12.75 · 5.5 / 10.5), drawn as A's nub is. Body 20×14.5 · 16×10.5 · 14×8.75, container radius 2.5 · 2 · 1.5. Ink 20×16 · 16×12 · 14×10, box-centred. Minus left, plus right. Filled: body and terminals solid, the signs cut as 1.5-wide white lines at the outline signs' length (the plus as one cross-shaped cut), 3 · 2 · 1.75 of material between the cuts. Lint clean. At 16 the filled plus is 3.25 across with a 1.5 cut, so its arms stand only 0.875 past the centre and it reads as a rounded blob. Who: Lucide car-battery, Tabler battery-automotive, Font Awesome car-battery. This is a different object (a vehicle battery) and suits a battery-car or accumulator icon better than the plain word.",
      "masters": {
        "16": [
          "M3.125 4.875H12.875A1.5 1.5 0 0 1 14.375 6.375V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V6.375A1.5 1.5 0 0 1 3.125 4.875Z",
          "M4.875 4.875V3.625H6.125V4.875Z",
          "M9.875 4.875V3.625H11.125V4.875Z",
          "M4.5 8.625H6.5",
          "M9.5 8.625H11.5",
          "M10.5 7.625V9.625"
        ],
        "20": [
          "M4.75 6.25H15.25A2 2 0 0 1 17.25 8.25V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V8.25A2 2 0 0 1 4.75 6.25Z",
          "M6.5 6.25V4.75H8V6.25Z",
          "M12 6.25V4.75H13.5V6.25Z",
          "M6.25 10.75H8.25",
          "M11.75 10.75H13.75",
          "M12.75 9.75V11.75"
        ],
        "24": [
          "M5.25 6.25H18.75A2.5 2.5 0 0 1 21.25 8.75V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V8.75A2.5 2.5 0 0 1 5.25 6.25Z",
          "M7.75 6.25V4.75H9.25V6.25Z",
          "M14.75 6.25V4.75H16.25V6.25Z",
          "M7.25 12.75H9.75",
          "M14.25 12.75H16.75",
          "M15.5 11.5V14"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4.25H4.25V3.625A0.625 0.625 0 0 1 4.875 3H6.125A0.625 0.625 0 0 1 6.75 3.625V4.25H9.25V3.625A0.625 0.625 0 0 1 9.875 3H11.125A0.625 0.625 0 0 1 11.75 3.625V4.25H12.875A2.125 2.125 0 0 1 15 6.375V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V6.375A2.125 2.125 0 0 1 3.125 4.25ZM4.625 7.875H6.375A0.75 0.75 0 0 1 6.375 9.375H4.625A0.75 0.75 0 0 1 4.625 7.875ZM9.75 7.875V7.75A0.75 0.75 0 0 1 11.25 7.75V7.875H11.375A0.75 0.75 0 0 1 11.375 9.375H11.25V9.5A0.75 0.75 0 0 1 9.75 9.5V9.375H9.625A0.75 0.75 0 0 1 9.625 7.875Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H5.75V4.75A0.75 0.75 0 0 1 6.5 4H8A0.75 0.75 0 0 1 8.75 4.75V5.5H11.25V4.75A0.75 0.75 0 0 1 12 4H13.5A0.75 0.75 0 0 1 14.25 4.75V5.5H15.25A2.75 2.75 0 0 1 18 8.25V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V8.25A2.75 2.75 0 0 1 4.75 5.5ZM6.25 10H8.25A0.75 0.75 0 0 1 8.25 11.5H6.25A0.75 0.75 0 0 1 6.25 10ZM12 10V9.75A0.75 0.75 0 0 1 13.5 9.75V10H13.75A0.75 0.75 0 0 1 13.75 11.5H13.5V11.75A0.75 0.75 0 0 1 12 11.75V11.5H11.75A0.75 0.75 0 0 1 11.75 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 5.5H7V4.75A0.75 0.75 0 0 1 7.75 4H9.25A0.75 0.75 0 0 1 10 4.75V5.5H14V4.75A0.75 0.75 0 0 1 14.75 4H16.25A0.75 0.75 0 0 1 17 4.75V5.5H18.75A3.25 3.25 0 0 1 22 8.75V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V8.75A3.25 3.25 0 0 1 5.25 5.5ZM7.25 12H9.75A0.75 0.75 0 0 1 9.75 13.5H7.25A0.75 0.75 0 0 1 7.25 12ZM14.75 12V11.5A0.75 0.75 0 0 1 16.25 11.5V12H16.75A0.75 0.75 0 0 1 16.75 13.5H16.25V14A0.75 0.75 0 0 1 14.75 14V13.5H14.25A0.75 0.75 0 0 1 14.25 12Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
