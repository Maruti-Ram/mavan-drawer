// battery: the body chosen here is the one battery-charging and the level family (-low, -full; C28) will be drawn on, so it decides whether three charge cells can ever fit at 20 and 16.
export default {
  "concept": "battery",
  "question": "Do the levels read as one battery losing charge: A's bar stepping 1/3 · 2/3 · full (battery-low, -medium, -full), and B's cells dropping right to left (battery-2-low, -medium)? E ships as car-battery.",
  "set": {
    "A": "battery",
    "A1": "battery-low",
    "A2": "battery-medium",
    "A3": "battery-full",
    "B": "battery-2",
    "B2": "battery-2-medium",
    "B1": "battery-2-low",
    "E": "car-battery"
  },
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
      "id": "A1",
      "label": "Charge bar, low",
      "tags": [
        "horizontal",
        "level",
        "low",
        "charge",
        "bar"
      ],
      "anchor": "battery",
      "note": "Rhythm: one third of the full charge bar. Equal steps: the bar's ink is 4 · 8 · 12 long at 24, 2.75 · 5.5 · 8.25 at 20, 2.375 · 4.75 · 7.125 at 16 (a third of the full bar each step), 6 · 3 · 2.5 tall, corner radius 0.75 · 0.75 · 0.625, starting 1.5 from the left wall with 1.5 of air above and below; the full bar leaves 2.5 · 1.75 · 1.625 to the right wall, the longest bar that splits into three equal steps on the grid (12.5 · 8.5 · 7.25 would be the 1.5-air bar, which does not). Outline: the bar is a solid shape drawn with the pen: a closed path whose runs sit one line apart (4 runs at 24, 1 rectangle at 20 and 16), so no white is left inside it; the outline format has no fills. Filled: A's solid body with a 1.5 white band cut round the bar (outer corners r2.25 · 2.25 · 2.125) and the bar solid inside it; to the right of the band the body stays solid, so the level reads as how far the white band reaches. Body, nub and ink box are battery's exactly; `anchor: battery` (C28) holds them there. Lint clean. Who: Lucide battery-low, SF battery.25percent, Material battery_horiz_025, Central battery-low.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M4.375 7.375H5.5V8.625H4.375Z"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M5.75 9.25H7V10.75H5.75Z"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M5.75 9.75H8.25V11.25H5.75V12.75H8.25V14.25H5.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM4.375 5.25H5.5A2.125 2.125 0 0 1 7.625 7.375V8.625A2.125 2.125 0 0 1 5.5 10.75H4.375A2.125 2.125 0 0 1 2.25 8.625V7.375A2.125 2.125 0 0 1 4.375 5.25ZM4.375 6.75H5.5A0.625 0.625 0 0 1 6.125 7.375V8.625A0.625 0.625 0 0 1 5.5 9.25H4.375A0.625 0.625 0 0 1 3.75 8.625V7.375A0.625 0.625 0 0 1 4.375 6.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5.75 7H7A2.25 2.25 0 0 1 9.25 9.25V10.75A2.25 2.25 0 0 1 7 13H5.75A2.25 2.25 0 0 1 3.5 10.75V9.25A2.25 2.25 0 0 1 5.75 7ZM5.75 8.5H7A0.75 0.75 0 0 1 7.75 9.25V10.75A0.75 0.75 0 0 1 7 11.5H5.75A0.75 0.75 0 0 1 5 10.75V9.25A0.75 0.75 0 0 1 5.75 8.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM5.75 7.5H8.25A2.25 2.25 0 0 1 10.5 9.75V14.25A2.25 2.25 0 0 1 8.25 16.5H5.75A2.25 2.25 0 0 1 3.5 14.25V9.75A2.25 2.25 0 0 1 5.75 7.5ZM5.75 9H8.25A0.75 0.75 0 0 1 9 9.75V14.25A0.75 0.75 0 0 1 8.25 15H5.75A0.75 0.75 0 0 1 5 14.25V9.75A0.75 0.75 0 0 1 5.75 9Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "A2",
      "label": "Charge bar, medium",
      "tags": [
        "horizontal",
        "level",
        "medium",
        "charge",
        "bar"
      ],
      "anchor": "battery",
      "note": "Rhythm: two thirds of the full charge bar. Equal steps: the bar's ink is 4 · 8 · 12 long at 24, 2.75 · 5.5 · 8.25 at 20, 2.375 · 4.75 · 7.125 at 16 (a third of the full bar each step), 6 · 3 · 2.5 tall, corner radius 0.75 · 0.75 · 0.625, starting 1.5 from the left wall with 1.5 of air above and below; the full bar leaves 2.5 · 1.75 · 1.625 to the right wall, the longest bar that splits into three equal steps on the grid (12.5 · 8.5 · 7.25 would be the 1.5-air bar, which does not). Outline: the bar is a solid shape drawn with the pen: a closed path whose runs sit one line apart (4 runs at 24, 1 rectangle at 20 and 16), so no white is left inside it; the outline format has no fills. Filled: A's solid body with a 1.5 white band cut round the bar (outer corners r2.25 · 2.25 · 2.125) and the bar solid inside it; to the right of the band the body stays solid, so the level reads as how far the white band reaches. Body, nub and ink box are battery's exactly; `anchor: battery` (C28) holds them there. Lint clean. Who: Lucide battery-medium, SF battery.50percent, Material battery_horiz_050, Central battery-medium.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M4.375 7.375H7.875V8.625H4.375Z"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M5.75 9.25H9.75V10.75H5.75Z"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M5.75 9.75H12.25V11.25H5.75V12.75H12.25V14.25H5.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM4.375 5.25H7.875A2.125 2.125 0 0 1 10 7.375V8.625A2.125 2.125 0 0 1 7.875 10.75H4.375A2.125 2.125 0 0 1 2.25 8.625V7.375A2.125 2.125 0 0 1 4.375 5.25ZM4.375 6.75H7.875A0.625 0.625 0 0 1 8.5 7.375V8.625A0.625 0.625 0 0 1 7.875 9.25H4.375A0.625 0.625 0 0 1 3.75 8.625V7.375A0.625 0.625 0 0 1 4.375 6.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5.75 7H9.75A2.25 2.25 0 0 1 12 9.25V10.75A2.25 2.25 0 0 1 9.75 13H5.75A2.25 2.25 0 0 1 3.5 10.75V9.25A2.25 2.25 0 0 1 5.75 7ZM5.75 8.5H9.75A0.75 0.75 0 0 1 10.5 9.25V10.75A0.75 0.75 0 0 1 9.75 11.5H5.75A0.75 0.75 0 0 1 5 10.75V9.25A0.75 0.75 0 0 1 5.75 8.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM5.75 7.5H12.25A2.25 2.25 0 0 1 14.5 9.75V14.25A2.25 2.25 0 0 1 12.25 16.5H5.75A2.25 2.25 0 0 1 3.5 14.25V9.75A2.25 2.25 0 0 1 5.75 7.5ZM5.75 9H12.25A0.75 0.75 0 0 1 13 9.75V14.25A0.75 0.75 0 0 1 12.25 15H5.75A0.75 0.75 0 0 1 5 14.25V9.75A0.75 0.75 0 0 1 5.75 9Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "A3",
      "label": "Charge bar, full",
      "tags": [
        "horizontal",
        "level",
        "full",
        "charge",
        "bar"
      ],
      "anchor": "battery",
      "note": "Rhythm: all of the full charge bar. Equal steps: the bar's ink is 4 · 8 · 12 long at 24, 2.75 · 5.5 · 8.25 at 20, 2.375 · 4.75 · 7.125 at 16 (a third of the full bar each step), 6 · 3 · 2.5 tall, corner radius 0.75 · 0.75 · 0.625, starting 1.5 from the left wall with 1.5 of air above and below; the full bar leaves 2.5 · 1.75 · 1.625 to the right wall, the longest bar that splits into three equal steps on the grid (12.5 · 8.5 · 7.25 would be the 1.5-air bar, which does not). Outline: the bar is a solid shape drawn with the pen: a closed path whose runs sit one line apart (4 runs at 24, 1 rectangle at 20 and 16), so no white is left inside it; the outline format has no fills. Filled: A's solid body with a 1.5 white band cut round the bar (outer corners r2.25 · 2.25 · 2.125) and the bar solid inside it; to the right of the band the body stays solid, so the level reads as how far the white band reaches. Body, nub and ink box are battery's exactly; `anchor: battery` (C28) holds them there. Lint clean. Who: Lucide battery-full, SF battery.100percent, Material battery_horiz_100, Central battery-full.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M4.375 7.375H10.25V8.625H4.375Z"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M5.75 9.25H12.5V10.75H5.75Z"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M5.75 9.75H16.25V11.25H5.75V12.75H16.25V14.25H5.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM4.375 5.25H10.25A2.125 2.125 0 0 1 12.375 7.375V8.625A2.125 2.125 0 0 1 10.25 10.75H4.375A2.125 2.125 0 0 1 2.25 8.625V7.375A2.125 2.125 0 0 1 4.375 5.25ZM4.375 6.75H10.25A0.625 0.625 0 0 1 10.875 7.375V8.625A0.625 0.625 0 0 1 10.25 9.25H4.375A0.625 0.625 0 0 1 3.75 8.625V7.375A0.625 0.625 0 0 1 4.375 6.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5.75 7H12.5A2.25 2.25 0 0 1 14.75 9.25V10.75A2.25 2.25 0 0 1 12.5 13H5.75A2.25 2.25 0 0 1 3.5 10.75V9.25A2.25 2.25 0 0 1 5.75 7ZM5.75 8.5H12.5A0.75 0.75 0 0 1 13.25 9.25V10.75A0.75 0.75 0 0 1 12.5 11.5H5.75A0.75 0.75 0 0 1 5 10.75V9.25A0.75 0.75 0 0 1 5.75 8.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM5.75 7.5H16.25A2.25 2.25 0 0 1 18.5 9.75V14.25A2.25 2.25 0 0 1 16.25 16.5H5.75A2.25 2.25 0 0 1 3.5 14.25V9.75A2.25 2.25 0 0 1 5.75 7.5ZM5.75 9H16.25A0.75 0.75 0 0 1 17 9.75V14.25A0.75 0.75 0 0 1 16.25 15H5.75A0.75 0.75 0 0 1 5 14.25V9.75A0.75 0.75 0 0 1 5.75 9Z"
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
      "note": "Rhythm: three bars on one even pitch, 4.25 · 3.25 · 2.875, with the same air between bars as from the end bars to the walls, 2.75 · 1.75 · 1.625, all four gaps equal at every master. The bars are line-wide (1.5 · 1.5 · 1.25) and 5 · 3 · 2.5 of ink tall, with 2 · 1.5 · 1.5 of air above and below. Body and nub are battery's, unchanged; ships as battery-2 (the full member), with -medium and -low below (C28). Body 18.5×12 · 14.5×9 · 12.75×8, container radius 2.5 · 2 · 1.5 on the line (keyboard's and credit-card's; filled outer 3.25 · 2.75 · 2.125). Nub solid and joined to the wall, one line past it (1.5 · 1.5 · 1.25) and half the body's height (6 · 4.5 · 4), centred on the body; it is drawn as a closed bar on the wall's centreline so no white is left inside it. Off-grid values 20.49 · 16.45 · 13.746 in the filled files are where the corner arc meets the nub's edge (computed). Ink 20×12 · 16×9 · 14×8, box-centred, so the body sits 0.75 · 0.75 · 0.625 left of the canvas centre. Inside white 15.5×9 · 11.5×6 · 10.25×5.5. Filled: the body solid, the bars cut as white slots 1.5 wide at every master (at 16 wider than the 1.25 line, C22) at the outline bars' length, leaving 2.75 · 1.75 · 1.375 of material between slots (floor 1.25 at 16). Lint clean. Who: Lucide battery-full, Central battery-full, Untitled battery-full, Tabler battery-1…4, Phosphor BatteryHigh, Nucleo battery-high. At 16 at real size the three bars run together into one grey band; the outline still reads as a battery.",
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
      "id": "B2",
      "label": "Two cells, medium",
      "tags": [
        "horizontal",
        "cells",
        "bars",
        "level",
        "medium",
        "charge"
      ],
      "anchor": "battery-2",
      "note": "Rhythm: two of battery-2's three cells. Cells drop right to left; the cells that stay keep battery-2's coordinates (bar centres 7 · 11.25 at 24, 6 · 9.25 at 20, 4.5 · 7.375 at 16), so the pitch 4.25 · 3.25 · 2.875 and the 2.75 · 1.75 · 1.625 of air from the left wall do not change. Filled: battery-2-filled with the dropped slots left solid. Body, nub and ink box are battery-2's exactly; `anchor: battery-2` (C28). Lint clean. Who: Lucide battery-medium, Central battery-medium, Untitled battery-mid, Tabler battery-2.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M4.5 7.375V8.625",
          "M7.375 7.375V8.625"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M6 9.25V10.75",
          "M9.25 9.25V10.75"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M7 10.25V13.75",
          "M11.25 10.25V13.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM3.75 7.5A0.75 0.75 0 0 1 5.25 7.5V8.5A0.75 0.75 0 0 1 3.75 8.5ZM6.625 7.5A0.75 0.75 0 0 1 8.125 7.5V8.5A0.75 0.75 0 0 1 6.625 8.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5.25 9.25A0.75 0.75 0 0 1 6.75 9.25V10.75A0.75 0.75 0 0 1 5.25 10.75ZM8.5 9.25A0.75 0.75 0 0 1 10 9.25V10.75A0.75 0.75 0 0 1 8.5 10.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM6.25 10.25A0.75 0.75 0 0 1 7.75 10.25V13.75A0.75 0.75 0 0 1 6.25 13.75ZM10.5 10.25A0.75 0.75 0 0 1 12 10.25V13.75A0.75 0.75 0 0 1 10.5 13.75Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B1",
      "label": "One cell, low",
      "tags": [
        "horizontal",
        "cells",
        "bars",
        "level",
        "low",
        "charge"
      ],
      "anchor": "battery-2",
      "note": "Rhythm: one of battery-2's three cells. Cells drop right to left; the cells that stay keep battery-2's coordinates (bar centres 7 · 11.25 at 24, 6 · 9.25 at 20, 4.5 · 7.375 at 16), so the pitch 4.25 · 3.25 · 2.875 and the 2.75 · 1.75 · 1.625 of air from the left wall do not change. Filled: battery-2-filled with the dropped slots left solid. Body, nub and ink box are battery-2's exactly; `anchor: battery-2` (C28). Lint clean. Who: Lucide battery-low, Central battery-low, Untitled battery-low, Tabler battery-1.",
      "masters": {
        "16": [
          "M3.125 4.625H11.625A1.5 1.5 0 0 1 13.125 6.125V9.875A1.5 1.5 0 0 1 11.625 11.375H3.125A1.5 1.5 0 0 1 1.625 9.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M13.125 6.625H14.375V9.375H13.125Z",
          "M4.5 7.375V8.625"
        ],
        "20": [
          "M4.75 6.25H13.75A2 2 0 0 1 15.75 8.25V11.75A2 2 0 0 1 13.75 13.75H4.75A2 2 0 0 1 2.75 11.75V8.25A2 2 0 0 1 4.75 6.25Z",
          "M15.75 8.5H17.25V11.5H15.75Z",
          "M6 9.25V10.75"
        ],
        "24": [
          "M5.25 6.75H17.25A2.5 2.5 0 0 1 19.75 9.25V14.75A2.5 2.5 0 0 1 17.25 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V9.25A2.5 2.5 0 0 1 5.25 6.75Z",
          "M19.75 9.75H21.25V14.25H19.75Z",
          "M7 10.25V13.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H11.625A2.125 2.125 0 0 1 13.746 6H14.375A0.625 0.625 0 0 1 15 6.625V9.375A0.625 0.625 0 0 1 14.375 10H13.746A2.125 2.125 0 0 1 11.625 12H3.125A2.125 2.125 0 0 1 1 9.875V6.125A2.125 2.125 0 0 1 3.125 4ZM3.75 7.5A0.75 0.75 0 0 1 5.25 7.5V8.5A0.75 0.75 0 0 1 3.75 8.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 5.5H13.75A2.75 2.75 0 0 1 16.45 7.75H17.25A0.75 0.75 0 0 1 18 8.5V11.5A0.75 0.75 0 0 1 17.25 12.25H16.45A2.75 2.75 0 0 1 13.75 14.5H4.75A2.75 2.75 0 0 1 2 11.75V8.25A2.75 2.75 0 0 1 4.75 5.5ZM5.25 9.25A0.75 0.75 0 0 1 6.75 9.25V10.75A0.75 0.75 0 0 1 5.25 10.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 6H17.25A3.25 3.25 0 0 1 20.49 9H21.25A0.75 0.75 0 0 1 22 9.75V14.25A0.75 0.75 0 0 1 21.25 15H20.49A3.25 3.25 0 0 1 17.25 18H5.25A3.25 3.25 0 0 1 2 14.75V9.25A3.25 3.25 0 0 1 5.25 6ZM6.25 10.25A0.75 0.75 0 0 1 7.75 10.25V13.75A0.75 0.75 0 0 1 6.25 13.75Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Car battery",
      "anchor": null,
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
      "note": "Rhythm: the minus and plus are the same size, 4 · 3.5 · 3.25 square, with equal air wall to sign to sign to wall, 3 / 3 / 3 · 2 / 2 / 2 · 1.625 / 1.75 / 1.625 (at 16 the eighth grid puts the extra 0.125 in the middle), and 3.75 · 2 · 1.5 of air above and below. Two solid terminals stand one line (1.5 · 1.5 · 1.25) above the top wall, 3 · 3 · 2.5 wide and centred over the signs (centres 8.5 / 15.5 · 7.25 / 12.75 · 5.5 / 10.5), drawn as A's nub is. Body 20×14.5 · 16×10.5 · 14×8.75, container radius 2.5 · 2 · 1.5. Ink 20×16 · 16×12 · 14×10, box-centred. Minus left, plus right. Filled: body and terminals solid, the signs cut as 1.5-wide white lines at the outline signs' length (the plus as one cross-shaped cut), 3 · 2 · 1.75 of material between the cuts. Lint clean. At 16 the filled plus is 3.25 across with a 1.5 cut, so its arms stand only 0.875 past the centre and it reads as a rounded blob. Who: Lucide car-battery, Tabler battery-automotive, Font Awesome car-battery. Ships as car-battery, its own object, not a battery level.",
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
