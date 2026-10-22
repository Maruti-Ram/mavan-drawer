// devices: the "multiple devices" mark is a composite of the set's own parts (shipped desktop; the laptop, tablet and mobile drafts in this batch), so the pairing chosen here decides which device stands for "the big screen" across the set and how a phone sits in front of anything at 16.
export default {
  "concept": "devices",
  "question": "Which pair says \"multiple devices\": a monitor with a phone in front (A), a laptop with a phone (B), a tablet with a phone (C), a tablet and a phone standing apart (D), or A with the phone on the left (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Monitor and phone",
      "tags": [
        "devices",
        "responsive",
        "cross-device",
        "desktop",
        "monitor",
        "phone",
        "mobile",
        "screens"
      ],
      "note": "Rhythm: the phone stands in front at the bottom right, 1.5 of air from the monitor all round it (1.75 above it at 16); the monitor's bottom line and its foot both stop at that same 1.5, so their ends line up at every master. Monitor: desktop's screen and stand, narrowed — ink 16×12 · 13×9.5 · 11×8 (1.33 · 1.37 · 1.38 : 1; desktop 1.43 · 1.45 · 1.56), radius 2.5 · 2 · 1.5; neck on the monitor's own centre (x 10 · 8.5 · 6.5) with desktop's 2.5 · 1.5 · 1.75 showing; foot 5 · 5 · 4 of ink (31 · 38 · 36% of the screen; desktop 45%) — it can be no longer, because it stops 1.5 from the phone. Depth: the phone's floor sits 2 · 1.5 · 1 below the foot, so it reads as standing nearer. Ink 20×18 · 16×14 · 14×12, desktop's agreed box, centred both ways. Phone: mobile A's body scaled down, same walls 1.5 · 1.5 · 1.25 and radius 2.5 · 2 · 1.5; ink 8×12.5 · 5.5×9 · 5×7.5 (0.64 · 0.61 · 0.67; mobile A 0.60 · 0.63 · 0.57). Its mark is one chin line wall to wall with 1.5 of white above the floor (mobile D's chin; desktop-3 and laptop E draw the same line), at every master; in the filled twin it is a slot between the walls, 5 · 2.5 · 2.5 wide and 1.5 tall, with 3 · 3 · 2.75 of solid below it — mobile A's filled bar in the same place. Why not mobile A's bar or mobile B's dot: the white inside the phone is 5 · 2.5 · 2.5 wide; with 1.5 to each wall mobile B's dot needs 5 · 5 · 4.5 and mobile A's bar 7 · 6 · 5.5, so only the dot fits, and only at 24 — the chin is the one mark that holds at every master, so the phone is the same drawing at every size. The phone cannot grow: in front of a monitor its width is capped by the stand (a 6-wide phone at 16 leaves a 2.75 foot) and its height by the 1.5 under the back device's top-right corner (12.5 · 9 · 7.75 at most), so a wider phone turns square. Cut-back (C33 practice): the back device stops 1.5 short of the phone's ink — its bottom line's cap and its right wall's cap both 1.5 away at 24 and 20, 1.5 at the side and 1.75 at the top at 16 (a 0.25 wall left past the corner was removed, not kept as a stub); its top-right corner stays whole above the phone. Filled: the back device solid with a notch that keeps the same 1.5 of white round the phone (notch corner r4.75 · 3.25 · 2.875, its ends rounded like the outline's caps), the phone solid; neck and foot stay lines at 1.5 · 1.5 · 1.25. Who: Lucide monitor-smartphone, Phosphor Devices (a foot only, phone front-right), Material important_devices, Tabler devices-2 (phone beside), Fluent phone_desktop (phone on the left — E). (recommended) — desktop is already shipped and its stand keeps the back device a monitor at 16, and a phone in front at the bottom right is the picture Lucide, Phosphor and Material share.",
      "masters": {
        "16": [
          "M7.875 9.375H3.125A1.5 1.5 0 0 1 1.625 7.875V4.125A1.5 1.5 0 0 1 3.125 2.625H9.875A1.5 1.5 0 0 1 11.375 4.125",
          "M12.125 7.125H12.875A1.5 1.5 0 0 1 14.375 8.625V11.875A1.5 1.5 0 0 1 12.875 13.375H12.125A1.5 1.5 0 0 1 10.625 11.875V8.625A1.5 1.5 0 0 1 12.125 7.125Z",
          "M10.625 10.625H14.375",
          "M6.5 9.375V12.375",
          "M5.125 12.375H7.875"
        ],
        "20": [
          "M10.25 11.75H4.75A2 2 0 0 1 2.75 9.75V5.75A2 2 0 0 1 4.75 3.75H12.25A2 2 0 0 1 14.25 5.75",
          "M15.25 8.75H15.25A2 2 0 0 1 17.25 10.75V14.25A2 2 0 0 1 15.25 16.25H15.25A2 2 0 0 1 13.25 14.25V10.75A2 2 0 0 1 15.25 8.75Z",
          "M13.25 13.25H17.25",
          "M8.5 11.75V14.75",
          "M6.75 14.75H10.25"
        ],
        "24": [
          "M11.75 14.25H5.25A2.5 2.5 0 0 1 2.75 11.75V6.25A2.5 2.5 0 0 1 5.25 3.75H14.75A2.5 2.5 0 0 1 17.25 6.25",
          "M17.25 9.25H18.75A2.5 2.5 0 0 1 21.25 11.75V17.75A2.5 2.5 0 0 1 18.75 20.25H17.25A2.5 2.5 0 0 1 14.75 17.75V11.75A2.5 2.5 0 0 1 17.25 9.25Z",
          "M14.75 17.25H21.25",
          "M10 14.25V18.25",
          "M8.25 18.25H11.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.875 10H3.125A2.125 2.125 0 0 1 1 7.875V4.125A2.125 2.125 0 0 1 3.125 2H9.875A2.125 2.125 0 0 1 12 4.125A0.625 0.625 0 0 1 11.375 4.75A2.875 2.875 0 0 0 8.5 7.625V9.375A0.625 0.625 0 0 1 7.875 10Z",
            "M12.125 6.5H12.875A2.125 2.125 0 0 1 15 8.625V11.875A2.125 2.125 0 0 1 12.875 14H12.125A2.125 2.125 0 0 1 10 11.875V8.625A2.125 2.125 0 0 1 12.125 6.5ZM12 9.75H13A0.75 0.75 0 0 1 13 11.25H12A0.75 0.75 0 0 1 12 9.75Z"
          ],
          "stroke": [
            "M6.5 9.375V12.375",
            "M5.125 12.375H7.875"
          ]
        },
        "20": {
          "fill": [
            "M10.25 12.5H4.75A2.75 2.75 0 0 1 2 9.75V5.75A2.75 2.75 0 0 1 4.75 3H12.25A2.75 2.75 0 0 1 15 5.75A0.75 0.75 0 0 1 14.25 6.5A3.25 3.25 0 0 0 11 9.75V11.75A0.75 0.75 0 0 1 10.25 12.5Z",
            "M15.25 8H15.25A2.75 2.75 0 0 1 18 10.75V14.25A2.75 2.75 0 0 1 15.25 17H15.25A2.75 2.75 0 0 1 12.5 14.25V10.75A2.75 2.75 0 0 1 15.25 8ZM14.75 12.5H15.75A0.75 0.75 0 0 1 15.75 14H14.75A0.75 0.75 0 0 1 14.75 12.5Z"
          ],
          "stroke": [
            "M8.5 11.75V14.75",
            "M6.75 14.75H10.25"
          ]
        },
        "24": {
          "fill": [
            "M11.75 15H5.25A3.25 3.25 0 0 1 2 11.75V6.25A3.25 3.25 0 0 1 5.25 3H14.75A3.25 3.25 0 0 1 18 6.25A0.75 0.75 0 0 1 17.25 7A4.75 4.75 0 0 0 12.5 11.75V14.25A0.75 0.75 0 0 1 11.75 15Z",
            "M17.25 8.5H18.75A3.25 3.25 0 0 1 22 11.75V17.75A3.25 3.25 0 0 1 18.75 21H17.25A3.25 3.25 0 0 1 14 17.75V11.75A3.25 3.25 0 0 1 17.25 8.5ZM16.25 16.5H19.75A0.75 0.75 0 0 1 19.75 18H16.25A0.75 0.75 0 0 1 16.25 16.5Z"
          ],
          "stroke": [
            "M10 14.25V18.25",
            "M8.25 18.25H11.75"
          ]
        }
      },
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
      }
    },
    {
      "id": "B",
      "label": "Laptop and phone",
      "tags": [
        "devices",
        "responsive",
        "cross-device",
        "laptop",
        "phone",
        "mobile",
        "screens"
      ],
      "note": "Rhythm: laptop A from the laptop board (its recommended pick) with the phone in front at the bottom right; the screen's bottom line and the base line both stop 1.5 from the phone, so their ends line up. Laptop: screen ink 16×11.5 · 13×9 · 12×8 (laptop A's own screen at every master), radius 2.5 · 2 · 1.5; base line under it with laptop A's 2 · 1.5 · 1.5 of air, running 2 · 1.5 · 1.5 past the screen on the left as in laptop A; the base shows 10.5 · 9 · 7.5 of ink. Depth: the phone's floor sits 3 · 2 · 1.25 below the base. Ink 20×18 · 16×14 · 14×12, centred both ways. Phone: mobile A's body scaled down, same walls 1.5 · 1.5 · 1.25 and radius 2.5 · 2 · 1.5; ink 8×12.5 · 5.5×9 · 5×7.5 (0.64 · 0.61 · 0.67; mobile A 0.60 · 0.63 · 0.57). Its mark is one chin line wall to wall with 1.5 of white above the floor (mobile D's chin; desktop-3 and laptop E draw the same line), at every master; in the filled twin it is a slot between the walls, 5 · 2.5 · 2.5 wide and 1.5 tall, with 3 · 3 · 2.75 of solid below it — mobile A's filled bar in the same place. Why not mobile A's bar or mobile B's dot: the white inside the phone is 5 · 2.5 · 2.5 wide; with 1.5 to each wall mobile B's dot needs 5 · 5 · 4.5 and mobile A's bar 7 · 6 · 5.5, so only the dot fits, and only at 24 — the chin is the one mark that holds at every master, so the phone is the same drawing at every size. The phone cannot grow: in front of a monitor its width is capped by the stand (a 6-wide phone at 16 leaves a 2.75 foot) and its height by the 1.5 under the back device's top-right corner (12.5 · 9 · 7.75 at most), so a wider phone turns square. Cut-back (C33 practice): the back device stops 1.5 short of the phone's ink — its bottom line's cap and its right wall's cap both 1.5 away at 24 and 20, 1.5 at the side and 1.75 at the top at 16 (a 0.25 wall left past the corner was removed, not kept as a stub); its top-right corner stays whole above the phone. Filled: the back device solid with a notch that keeps the same 1.5 of white round the phone (notch corner r4.75 · 4.25 · 3.625, its ends rounded like the outline's caps), the phone solid; the base stays a line at 1.5 · 1.5 · 1.25. Re-sync if Maruti picks a laptop other than A. Cost: at 16 the half-hidden laptop is a screen corner over a short line, and it reads less surely than A's stand. Who: Material devices (screen on a base, phone at the right), Nucleo laptop-mobile, Fluent phone_laptop (phone on the left).",
      "masters": {
        "16": [
          "M7.875 9.375H4.625A1.5 1.5 0 0 1 3.125 7.875V4.125A1.5 1.5 0 0 1 4.625 2.625H11.375A1.5 1.5 0 0 1 12.875 4.125",
          "M12.125 7.125H12.875A1.5 1.5 0 0 1 14.375 8.625V11.875A1.5 1.5 0 0 1 12.875 13.375H12.125A1.5 1.5 0 0 1 10.625 11.875V8.625A1.5 1.5 0 0 1 12.125 7.125Z",
          "M10.625 10.625H14.375",
          "M1.625 12.125H7.875"
        ],
        "20": [
          "M10.25 11.25H6.25A2 2 0 0 1 4.25 9.25V5.75A2 2 0 0 1 6.25 3.75H13.75A2 2 0 0 1 15.75 5.75",
          "M15.25 8.75H15.25A2 2 0 0 1 17.25 10.75V14.25A2 2 0 0 1 15.25 16.25H15.25A2 2 0 0 1 13.25 14.25V10.75A2 2 0 0 1 15.25 8.75Z",
          "M13.25 13.25H17.25",
          "M2.75 14.25H10.25"
        ],
        "24": [
          "M11.75 13.75H7.25A2.5 2.5 0 0 1 4.75 11.25V6.25A2.5 2.5 0 0 1 7.25 3.75H16.75A2.5 2.5 0 0 1 19.25 6.25",
          "M17.25 9.25H18.75A2.5 2.5 0 0 1 21.25 11.75V17.75A2.5 2.5 0 0 1 18.75 20.25H17.25A2.5 2.5 0 0 1 14.75 17.75V11.75A2.5 2.5 0 0 1 17.25 9.25Z",
          "M14.75 17.25H21.25",
          "M2.75 17.25H11.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.875 10H4.625A2.125 2.125 0 0 1 2.5 7.875V4.125A2.125 2.125 0 0 1 4.625 2H11.375A2.125 2.125 0 0 1 13.5 4.125A0.625 0.625 0 0 1 12.875 4.75H12.125A3.625 3.625 0 0 0 8.5 8.375V9.375A0.625 0.625 0 0 1 7.875 10Z",
            "M12.125 6.5H12.875A2.125 2.125 0 0 1 15 8.625V11.875A2.125 2.125 0 0 1 12.875 14H12.125A2.125 2.125 0 0 1 10 11.875V8.625A2.125 2.125 0 0 1 12.125 6.5ZM12 9.75H13A0.75 0.75 0 0 1 13 11.25H12A0.75 0.75 0 0 1 12 9.75Z"
          ],
          "stroke": [
            "M1.625 12.125H7.875"
          ]
        },
        "20": {
          "fill": [
            "M10.25 12H6.25A2.75 2.75 0 0 1 3.5 9.25V5.75A2.75 2.75 0 0 1 6.25 3H13.75A2.75 2.75 0 0 1 16.5 5.75A0.75 0.75 0 0 1 15.75 6.5H15.25A4.25 4.25 0 0 0 11 10.75V11.25A0.75 0.75 0 0 1 10.25 12Z",
            "M15.25 8H15.25A2.75 2.75 0 0 1 18 10.75V14.25A2.75 2.75 0 0 1 15.25 17H15.25A2.75 2.75 0 0 1 12.5 14.25V10.75A2.75 2.75 0 0 1 15.25 8ZM14.75 12.5H15.75A0.75 0.75 0 0 1 15.75 14H14.75A0.75 0.75 0 0 1 14.75 12.5Z"
          ],
          "stroke": [
            "M2.75 14.25H10.25"
          ]
        },
        "24": {
          "fill": [
            "M11.75 14.5H7.25A3.25 3.25 0 0 1 4 11.25V6.25A3.25 3.25 0 0 1 7.25 3H16.75A3.25 3.25 0 0 1 20 6.25A0.75 0.75 0 0 1 19.25 7H17.25A4.75 4.75 0 0 0 12.5 11.75V13.75A0.75 0.75 0 0 1 11.75 14.5Z",
            "M17.25 8.5H18.75A3.25 3.25 0 0 1 22 11.75V17.75A3.25 3.25 0 0 1 18.75 21H17.25A3.25 3.25 0 0 1 14 17.75V11.75A3.25 3.25 0 0 1 17.25 8.5ZM16.25 16.5H19.75A0.75 0.75 0 0 1 19.75 18H16.25A0.75 0.75 0 0 1 16.25 16.5Z"
          ],
          "stroke": [
            "M2.75 17.25H11.75"
          ]
        }
      },
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
      }
    },
    {
      "id": "C",
      "label": "Tablet and phone",
      "tags": [
        "devices",
        "responsive",
        "cross-device",
        "tablet",
        "phone",
        "mobile",
        "screens"
      ],
      "note": "Rhythm: tablet and phone share one floor; the phone covers the tablet's bottom-right corner with 1.5 of air all round, and the tablet's right wall comes 2 · 2 · 1.75 down past its corner before it stops. Tablet: tablet A's body exactly — ink 16×20 · 14×16 · 12×14 (0.80 · 0.88 · 0.86); its right wall runs behind the phone's middle (2.5 · 2 · 1.75 right of the phone's left wall), so the two walls never line up. No tablet bar: centred on the tablet it falls 0.5 from the cut in the filled twin, so the phone carries the only mark. Phone ink 8×12.5 · 5.5×9 · 5×8 at the bottom right. Ink 20×20 · 16×16 · 14×14 (the circle keyline), centred. Phone: mobile A's body scaled down, same walls 1.5 · 1.5 · 1.25 and radius 2.5 · 2 · 1.5; ink 8×12.5 · 5.5×9 · 5×8 here (0.64 · 0.61 · 0.63; mobile A 0.60 · 0.63 · 0.57). Its mark is one chin line wall to wall with 1.5 of white above the floor (mobile D's chin; desktop-3 and laptop E draw the same line), at every master; in the filled twin it is a slot between the walls, 5 · 2.5 · 2.5 wide and 1.5 tall, with 3 · 3 · 2.75 of solid below it — mobile A's filled bar in the same place. Why not mobile A's bar or mobile B's dot: the white inside the phone is 5 · 2.5 · 2.5 wide; with 1.5 to each wall mobile B's dot needs 5 · 5 · 4.5 and mobile A's bar 7 · 6 · 5.5, so only the dot fits, and only at 24 — the chin is the one mark that holds at every master, so the phone is the same drawing at every size. The phone cannot grow: in front of a monitor its width is capped by the stand (a 6-wide phone at 16 leaves a 2.75 foot) and its height by the 1.5 under the back device's top-right corner (12.5 · 9 · 7.75 at most), so a wider phone turns square. Cut-back (C33 practice): the back device stops 1.5 short of the phone's ink — its bottom line's cap and its right wall's cap both 1.5 away at 24 and 20, 1.5 at 16 as well. Filled: the back device solid with a notch that keeps the same 1.5 of white round the phone (notch corner r4.75 · 4.25 · 3.625, its ends rounded like the outline's caps), the phone solid. Cost: the biggest outline here — a plain slab of 16×20 — so at 16 it is the heaviest of the five. Who: Lucide tablet-smartphone (phone front-left), Tabler devices (screen behind phone, front-right), Fluent phone_tablet (landscape tablet).",
      "masters": {
        "16": [
          "M7.875 14.375H3.125A1.5 1.5 0 0 1 1.625 12.875V3.125A1.5 1.5 0 0 1 3.125 1.625H10.875A1.5 1.5 0 0 1 12.375 3.125V4.875",
          "M12.125 7.625H12.875A1.5 1.5 0 0 1 14.375 9.125V12.875A1.5 1.5 0 0 1 12.875 14.375H12.125A1.5 1.5 0 0 1 10.625 12.875V9.125A1.5 1.5 0 0 1 12.125 7.625Z",
          "M10.625 11.625H14.375"
        ],
        "20": [
          "M10.25 17.25H4.75A2 2 0 0 1 2.75 15.25V4.75A2 2 0 0 1 4.75 2.75H13.25A2 2 0 0 1 15.25 4.75V6.75",
          "M15.25 9.75H15.25A2 2 0 0 1 17.25 11.75V15.25A2 2 0 0 1 15.25 17.25H15.25A2 2 0 0 1 13.25 15.25V11.75A2 2 0 0 1 15.25 9.75Z",
          "M13.25 14.25H17.25"
        ],
        "24": [
          "M11.75 21.25H5.25A2.5 2.5 0 0 1 2.75 18.75V5.25A2.5 2.5 0 0 1 5.25 2.75H14.75A2.5 2.5 0 0 1 17.25 5.25V7.25",
          "M17.25 10.25H18.75A2.5 2.5 0 0 1 21.25 12.75V18.75A2.5 2.5 0 0 1 18.75 21.25H17.25A2.5 2.5 0 0 1 14.75 18.75V12.75A2.5 2.5 0 0 1 17.25 10.25Z",
          "M14.75 18.25H21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M7.875 15H3.125A2.125 2.125 0 0 1 1 12.875V3.125A2.125 2.125 0 0 1 3.125 1H10.875A2.125 2.125 0 0 1 13 3.125V4.875A0.625 0.625 0 0 1 12.375 5.5H12.125A3.625 3.625 0 0 0 8.5 9.125V14.375A0.625 0.625 0 0 1 7.875 15Z",
            "M12.125 7H12.875A2.125 2.125 0 0 1 15 9.125V12.875A2.125 2.125 0 0 1 12.875 15H12.125A2.125 2.125 0 0 1 10 12.875V9.125A2.125 2.125 0 0 1 12.125 7ZM12 10.75H13A0.75 0.75 0 0 1 13 12.25H12A0.75 0.75 0 0 1 12 10.75Z"
          ]
        },
        "20": {
          "fill": [
            "M10.25 18H4.75A2.75 2.75 0 0 1 2 15.25V4.75A2.75 2.75 0 0 1 4.75 2H13.25A2.75 2.75 0 0 1 16 4.75V6.75A0.75 0.75 0 0 1 15.25 7.5A4.25 4.25 0 0 0 11 11.75V17.25A0.75 0.75 0 0 1 10.25 18Z",
            "M15.25 9H15.25A2.75 2.75 0 0 1 18 11.75V15.25A2.75 2.75 0 0 1 15.25 18H15.25A2.75 2.75 0 0 1 12.5 15.25V11.75A2.75 2.75 0 0 1 15.25 9ZM14.75 13.5H15.75A0.75 0.75 0 0 1 15.75 15H14.75A0.75 0.75 0 0 1 14.75 13.5Z"
          ]
        },
        "24": {
          "fill": [
            "M11.75 22H5.25A3.25 3.25 0 0 1 2 18.75V5.25A3.25 3.25 0 0 1 5.25 2H14.75A3.25 3.25 0 0 1 18 5.25V7.25A0.75 0.75 0 0 1 17.25 8A4.75 4.75 0 0 0 12.5 12.75V21.25A0.75 0.75 0 0 1 11.75 22Z",
            "M17.25 9.5H18.75A3.25 3.25 0 0 1 22 12.75V18.75A3.25 3.25 0 0 1 18.75 22H17.25A3.25 3.25 0 0 1 14 18.75V12.75A3.25 3.25 0 0 1 17.25 9.5ZM16.25 17.5H19.75A0.75 0.75 0 0 1 19.75 19H16.25A0.75 0.75 0 0 1 16.25 17.5Z"
          ]
        }
      },
      "box": {
        "16": [
          14,
          14
        ],
        "20": [
          16,
          16
        ],
        "24": [
          20,
          20
        ]
      }
    },
    {
      "id": "D",
      "label": "Tablet and phone apart",
      "tags": [
        "devices",
        "responsive",
        "cross-device",
        "tablet",
        "phone",
        "mobile"
      ],
      "note": "Rhythm: two whole devices on one floor, 1.5 of air between them at every master, nothing hidden and nothing cut; each carries one mark 1.5 above its floor. Tablet ink 12×15 · 9.5×12 · 8×10 (0.80 · 0.79 · 0.80, tablet A's 0.80 at 24), with tablet A's bar 4 · 3 · 2.5 long, 2.5 · 1.75 · 1.5 from the walls. Phone ink 6.5×11 · 5×8.5 · 4.5×8 (0.59 · 0.59 · 0.56) with the chin line of A's phone (white inside 3.5 · 2 · 2 wide, too narrow for a bar or dot with 1.5 to each wall). Radius 2.5 · 2 · 1.5, walls 1.5 · 1.5 · 1.25. Ink 20×15 · 16×12 · 14×10, centred. Filled: both solid, the tablet's bar and the phone's chin cut out as slots (1.5 tall; at 16 the slots keep the line's lower edge and grow 0.25 up). Cost: at 16 still the weakest silhouette — two slabs side by side, which filled sit close to pause. A construction, not a fifth type: the nearest references (Tabler devices-2, Material devices_other) stand the phone beside the screen but still hide part of it; this draws both whole.",
      "masters": {
        "16": [
          "M3.125 3.625H6.875A1.5 1.5 0 0 1 8.375 5.125V10.875A1.5 1.5 0 0 1 6.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M12.625 5.625H12.875A1.5 1.5 0 0 1 14.375 7.125V10.875A1.5 1.5 0 0 1 12.875 12.375H12.625A1.5 1.5 0 0 1 11.125 10.875V7.125A1.5 1.5 0 0 1 12.625 5.625Z",
          "M4.375 9.625H5.625",
          "M11.125 9.625H14.375"
        ],
        "20": [
          "M4.75 4.75H8.75A2 2 0 0 1 10.75 6.75V13.25A2 2 0 0 1 8.75 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M15.75 8.25H15.25A2 2 0 0 1 17.25 10.25V13.25A2 2 0 0 1 15.25 15.25H15.75A2 2 0 0 1 13.75 13.25V10.25A2 2 0 0 1 15.75 8.25Z",
          "M6 12.25H7.5",
          "M13.75 12.25H17.25"
        ],
        "24": [
          "M5.25 5.25H10.75A2.5 2.5 0 0 1 13.25 7.75V16.25A2.5 2.5 0 0 1 10.75 18.75H5.25A2.5 2.5 0 0 1 2.75 16.25V7.75A2.5 2.5 0 0 1 5.25 5.25Z",
          "M18.75 9.25H18.75A2.5 2.5 0 0 1 21.25 11.75V16.25A2.5 2.5 0 0 1 18.75 18.75H18.75A2.5 2.5 0 0 1 16.25 16.25V11.75A2.5 2.5 0 0 1 18.75 9.25Z",
          "M6.75 15.75H9.25",
          "M16.25 15.75H21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H6.875A2.125 2.125 0 0 1 9 5.125V10.875A2.125 2.125 0 0 1 6.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM4.375 8.75H5.625A0.75 0.75 0 0 1 5.625 10.25H4.375A0.75 0.75 0 0 1 4.375 8.75Z",
            "M12.625 5H12.875A2.125 2.125 0 0 1 15 7.125V10.875A2.125 2.125 0 0 1 12.875 13H12.625A2.125 2.125 0 0 1 10.5 10.875V7.125A2.125 2.125 0 0 1 12.625 5ZM12.5 8.75H13A0.75 0.75 0 0 1 13 10.25H12.5A0.75 0.75 0 0 1 12.5 8.75Z"
          ]
        },
        "20": {
          "fill": [
            "M4.75 4H8.75A2.75 2.75 0 0 1 11.5 6.75V13.25A2.75 2.75 0 0 1 8.75 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM6 11.5H7.5A0.75 0.75 0 0 1 7.5 13H6A0.75 0.75 0 0 1 6 11.5Z",
            "M15.75 7.5H15.25A2.75 2.75 0 0 1 18 10.25V13.25A2.75 2.75 0 0 1 15.25 16H15.75A2.75 2.75 0 0 1 13 13.25V10.25A2.75 2.75 0 0 1 15.75 7.5ZM15.25 11.5H15.75A0.75 0.75 0 0 1 15.75 13H15.25A0.75 0.75 0 0 1 15.25 11.5Z"
          ]
        },
        "24": {
          "fill": [
            "M5.25 4.5H10.75A3.25 3.25 0 0 1 14 7.75V16.25A3.25 3.25 0 0 1 10.75 19.5H5.25A3.25 3.25 0 0 1 2 16.25V7.75A3.25 3.25 0 0 1 5.25 4.5ZM6.75 15H9.25A0.75 0.75 0 0 1 9.25 16.5H6.75A0.75 0.75 0 0 1 6.75 15Z",
            "M18.75 8.5H18.75A3.25 3.25 0 0 1 22 11.75V16.25A3.25 3.25 0 0 1 18.75 19.5H18.75A3.25 3.25 0 0 1 15.5 16.25V11.75A3.25 3.25 0 0 1 18.75 8.5ZM17.75 15H19.75A0.75 0.75 0 0 1 19.75 16.5H17.75A0.75 0.75 0 0 1 17.75 15Z"
          ]
        }
      },
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
          15
        ]
      }
    },
    {
      "id": "E",
      "label": "Phone on the left",
      "tags": [
        "devices",
        "responsive",
        "cross-device",
        "desktop",
        "monitor",
        "phone",
        "mobile",
        "screens"
      ],
      "note": "Rhythm: A turned left to right — every length, gap and cut is A's (1.5 of air round the phone, 1.75 above it at 16; foot 5 · 5 · 4, neck 2.5 · 1.5 · 1.75 showing; monitor 16×12 · 13×9.5 · 11×8; phone 8×12.5 · 5.5×9 · 5×7.5; depth 2 · 1.5 · 1). Ink 20×18 · 16×14 · 14×12, centred. Filled as A. A construction, not a fifth type: Fluent sets the phone on the left in phone_desktop, phone_laptop and phone_tablet, and Lucide tablet-smartphone does too, so which side the phone stands on is a real choice whichever pair wins. Not drawn (surveyed): the three-device \"responsive\" picture (Noun Project and stock sets) needs more than 14 units at 16 for three sets of walls and air; phone + watch (Material devices_wearables) leaves the phone cut into stubs round the watch's straps at 16; tower + monitor (Tabler devices-pc) means a PC, not several devices. Who: Fluent phone_desktop.",
      "masters": {
        "16": [
          "M8.125 9.375H12.875A1.5 1.5 0 0 0 14.375 7.875V4.125A1.5 1.5 0 0 0 12.875 2.625H6.125A1.5 1.5 0 0 0 4.625 4.125",
          "M3.875 7.125H3.125A1.5 1.5 0 0 0 1.625 8.625V11.875A1.5 1.5 0 0 0 3.125 13.375H3.875A1.5 1.5 0 0 0 5.375 11.875V8.625A1.5 1.5 0 0 0 3.875 7.125Z",
          "M5.375 10.625H1.625",
          "M9.5 9.375V12.375",
          "M10.875 12.375H8.125"
        ],
        "20": [
          "M9.75 11.75H15.25A2 2 0 0 0 17.25 9.75V5.75A2 2 0 0 0 15.25 3.75H7.75A2 2 0 0 0 5.75 5.75",
          "M4.75 8.75H4.75A2 2 0 0 0 2.75 10.75V14.25A2 2 0 0 0 4.75 16.25H4.75A2 2 0 0 0 6.75 14.25V10.75A2 2 0 0 0 4.75 8.75Z",
          "M6.75 13.25H2.75",
          "M11.5 11.75V14.75",
          "M13.25 14.75H9.75"
        ],
        "24": [
          "M12.25 14.25H18.75A2.5 2.5 0 0 0 21.25 11.75V6.25A2.5 2.5 0 0 0 18.75 3.75H9.25A2.5 2.5 0 0 0 6.75 6.25",
          "M6.75 9.25H5.25A2.5 2.5 0 0 0 2.75 11.75V17.75A2.5 2.5 0 0 0 5.25 20.25H6.75A2.5 2.5 0 0 0 9.25 17.75V11.75A2.5 2.5 0 0 0 6.75 9.25Z",
          "M9.25 17.25H2.75",
          "M14 14.25V18.25",
          "M15.75 18.25H12.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M8.125 10H12.875A2.125 2.125 0 0 0 15 7.875V4.125A2.125 2.125 0 0 0 12.875 2H6.125A2.125 2.125 0 0 0 4 4.125A0.625 0.625 0 0 0 4.625 4.75A2.875 2.875 0 0 1 7.5 7.625V9.375A0.625 0.625 0 0 0 8.125 10Z",
            "M3.875 6.5H3.125A2.125 2.125 0 0 0 1 8.625V11.875A2.125 2.125 0 0 0 3.125 14H3.875A2.125 2.125 0 0 0 6 11.875V8.625A2.125 2.125 0 0 0 3.875 6.5ZM4 9.75H3A0.75 0.75 0 0 0 3 11.25H4A0.75 0.75 0 0 0 4 9.75Z"
          ],
          "stroke": [
            "M9.5 9.375V12.375",
            "M10.875 12.375H8.125"
          ]
        },
        "20": {
          "fill": [
            "M9.75 12.5H15.25A2.75 2.75 0 0 0 18 9.75V5.75A2.75 2.75 0 0 0 15.25 3H7.75A2.75 2.75 0 0 0 5 5.75A0.75 0.75 0 0 0 5.75 6.5A3.25 3.25 0 0 1 9 9.75V11.75A0.75 0.75 0 0 0 9.75 12.5Z",
            "M4.75 8H4.75A2.75 2.75 0 0 0 2 10.75V14.25A2.75 2.75 0 0 0 4.75 17H4.75A2.75 2.75 0 0 0 7.5 14.25V10.75A2.75 2.75 0 0 0 4.75 8ZM5.25 12.5H4.25A0.75 0.75 0 0 0 4.25 14H5.25A0.75 0.75 0 0 0 5.25 12.5Z"
          ],
          "stroke": [
            "M11.5 11.75V14.75",
            "M13.25 14.75H9.75"
          ]
        },
        "24": {
          "fill": [
            "M12.25 15H18.75A3.25 3.25 0 0 0 22 11.75V6.25A3.25 3.25 0 0 0 18.75 3H9.25A3.25 3.25 0 0 0 6 6.25A0.75 0.75 0 0 0 6.75 7A4.75 4.75 0 0 1 11.5 11.75V14.25A0.75 0.75 0 0 0 12.25 15Z",
            "M6.75 8.5H5.25A3.25 3.25 0 0 0 2 11.75V17.75A3.25 3.25 0 0 0 5.25 21H6.75A3.25 3.25 0 0 0 10 17.75V11.75A3.25 3.25 0 0 0 6.75 8.5ZM7.75 16.5H4.25A0.75 0.75 0 0 0 4.25 18H7.75A0.75 0.75 0 0 0 7.75 16.5Z"
          ],
          "stroke": [
            "M14 14.25V18.25",
            "M15.75 18.25H12.25"
          ]
        }
      },
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
      }
    }
  ]
};
