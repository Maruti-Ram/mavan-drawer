// power: the standby sign is one of the few icons every product reads without a label, so this decides whether ours is the bare sign or the sign on a button — and whether the on/off and I/O signs are needed beside it.
export default {
  "concept": "power",
  "question": "Which picture says power: the bare standby sign (A), the sign on a round button (B) or a square key (C), the closed on/off sign (D), or the I and O switch marks (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Standby sign",
      "tags": [
        "standby",
        "on",
        "off",
        "shutdown",
        "iec"
      ],
      "note": "Rhythm: the ring is the circle keyline (outer ⌀20 · 16 · 14, r 9.25 · 7.25 · 6.375 on the line, check-circle's and ban's ring) opened ±53.13° from the top — the 3-4-5 angle, which puts both ring ends exactly on the grid (4.6/19.4, 6.45 · 4.2/15.8, 5.65 · 2.9/13.1, 4.175), so the outline and filled ink boxes match exactly; it is also B's opening, so power and a ring version would share one sign. The line runs from the top of the box (ink 2 · 2 · 1) to the ring's centre, ink 10.75 · 8.75 · 7.625 long, and stands 3.7 · 2.9 · 2.55 above the ring ends' caps. Air from the line to each ring end 5.9 · 4.3 · 3.85, equal both sides; ink 20×20 · 16×16 · 14×14, box-centred. Filled: line-heavy, 2.5 · 2 · 2 — ring r 8.75 · 7 · 6 (outer edge kept), ends at the same angle (5/19, 6.75 · 4.4/15.6, 5.8 · 3.2/12.8, 4.4), line ends pulled in so both ink ends stay put; air line to ring ends 4.5 · 3.6 · 2.8. Who: Lucide power (about ±50°), Material power_settings_new, SF Symbols power, Tabler power, Phosphor Power, Fluent Power, Heroicons power; Material and Tabler open about ±40° — the other exact angle, 36.87°, would give that tighter mouth if Maruti prefers it. (recommended) — the IEC standby sign is the picture every set and every device uses, and with nothing around it it stays the clearest of the five at 16.",
      "masters": {
        "16": [
          "M13.1 4.175A6.375 6.375 0 1 1 2.9 4.175",
          "M8 1.625V8"
        ],
        "20": [
          "M15.8 5.65A7.25 7.25 0 1 1 4.2 5.65",
          "M10 2.75V10"
        ],
        "24": [
          "M19.4 6.45A9.25 9.25 0 1 1 4.6 6.45",
          "M12 2.75V12"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M12.8 4.4A6 6 0 1 1 3.2 4.4",
            "M8 2V7.625"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M15.6 5.8A7 7 0 1 1 4.4 5.8",
            "M10 3V9.75"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M19 6.75A8.75 8.75 0 1 1 5 6.75",
            "M12 3.25V11.5"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Standby on a round button",
      "tags": [
        "circle",
        "button",
        "standby"
      ],
      "note": "Rhythm: the standby sign sits in check-circle's ring (⌀20 · 16 · 14) with one even air to the ring on all four sides — line top, both arc sides and arc bottom — 2.25 · 1.75 · 1.625. Sign: arc r 5.5 · 4 · 3.5 opened ±53.13° (A's angle, and Lucide circle-power's: ends on the grid), line from the arc's top to the centre; sign ink 12.5 · 9.5 · 8.25 square, 0.74 · 0.73 · 0.72 of the ring's white — no drift from 24 to 16. Air from the line to the arc ends 2.9 · 1.7 · 1.55; the opening cannot be narrower than about ±51° here, or that air drops under 1.5 at 16. Filled: the disc (⌀20 · 16 · 14) with the sign cut out 1.5 wide on the same centrelines, as check-circle-filled; material between the line cut and the arc cut 2.9 · 1.7 · 1.3 (floor 1.5 · 1.5 · 1.25), disc left round the sign 3.75 · 3.25 · 2.75. Who: SF Symbols power.circle and power.circle.fill, Lucide circle-power. The filled one is the strongest 'power button' of the five; at 16 the sign inside is 8.25 across and the arc's mouth is the tightest place.",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M10.8 5.9A3.5 3.5 0 1 1 5.2 5.9",
          "M8 4.5V8"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M13.2 7.6A4 4 0 1 1 6.8 7.6",
          "M10 6V10"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M16.4 8.7A5.5 5.5 0 1 1 7.6 8.7",
          "M12 6.5V12"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM11.4 5.45A4.25 4.25 0 1 1 4.6 5.45A0.75 0.75 0 0 1 5.8 6.35A2.75 2.75 0 1 0 10.2 6.35A0.75 0.75 0 0 1 11.4 5.45ZM7.25 4.5A0.75 0.75 0 0 1 8.75 4.5V8A0.75 0.75 0 0 1 7.25 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM13.8 7.15A4.75 4.75 0 1 1 6.2 7.15A0.75 0.75 0 0 1 7.4 8.05A3.25 3.25 0 1 0 12.6 8.05A0.75 0.75 0 0 1 13.8 7.15ZM9.25 6A0.75 0.75 0 0 1 10.75 6V10A0.75 0.75 0 0 1 9.25 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM17 8.25A6.25 6.25 0 1 1 7 8.25A0.75 0.75 0 0 1 8.2 9.15A4.75 4.75 0 1 0 15.8 9.15A0.75 0.75 0 0 1 17 8.25ZM11.25 6.5A0.75 0.75 0 0 1 12.75 6.5V12A0.75 0.75 0 0 1 11.25 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Standby on a square key",
      "tags": [
        "square",
        "key",
        "button",
        "standby"
      ],
      "note": "Rhythm: B's sign verbatim (arc r 5.5 · 4 · 3.5, ±53.13°, ink 12.5 · 9.5 · 8.25) in a rounded-square key with the same air to all four walls, 2.25 · 1.75 · 1.625. Key 20×20 · 16×16 · 14×14, corner r 4 · 3.25 · 2.75 on the line (outer 4.75 · 4 · 3.375). The key takes the circle's box, not checkbox's square (18 · 14 · 12): inside a 12 square at 16 the white is 9.5 across, and a sign that keeps 1.5 to the walls is at most 6.5 across — too small for the line to keep 1.5 from the arc ends at any opening. Cost: a square at the circle's size reads a step larger and heavier than check-circle and B beside it, and larger than the set's other squares. Filled: solid key with the sign cut out 1.5 wide; material between cut-outs 2.9 · 1.7 · 1.3. Who: Lucide square-power.",
      "masters": {
        "16": [
          "M4.375 1.625H11.625A2.75 2.75 0 0 1 14.375 4.375V11.625A2.75 2.75 0 0 1 11.625 14.375H4.375A2.75 2.75 0 0 1 1.625 11.625V4.375A2.75 2.75 0 0 1 4.375 1.625Z",
          "M10.8 5.9A3.5 3.5 0 1 1 5.2 5.9",
          "M8 4.5V8"
        ],
        "20": [
          "M6 2.75H14A3.25 3.25 0 0 1 17.25 6V14A3.25 3.25 0 0 1 14 17.25H6A3.25 3.25 0 0 1 2.75 14V6A3.25 3.25 0 0 1 6 2.75Z",
          "M13.2 7.6A4 4 0 1 1 6.8 7.6",
          "M10 6V10"
        ],
        "24": [
          "M6.75 2.75H17.25A4 4 0 0 1 21.25 6.75V17.25A4 4 0 0 1 17.25 21.25H6.75A4 4 0 0 1 2.75 17.25V6.75A4 4 0 0 1 6.75 2.75Z",
          "M16.4 8.7A5.5 5.5 0 1 1 7.6 8.7",
          "M12 6.5V12"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.375 1H11.625A3.375 3.375 0 0 1 15 4.375V11.625A3.375 3.375 0 0 1 11.625 15H4.375A3.375 3.375 0 0 1 1 11.625V4.375A3.375 3.375 0 0 1 4.375 1ZM11.4 5.45A4.25 4.25 0 1 1 4.6 5.45A0.75 0.75 0 0 1 5.8 6.35A2.75 2.75 0 1 0 10.2 6.35A0.75 0.75 0 0 1 11.4 5.45ZM7.25 4.5A0.75 0.75 0 0 1 8.75 4.5V8A0.75 0.75 0 0 1 7.25 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M6 2H14A4 4 0 0 1 18 6V14A4 4 0 0 1 14 18H6A4 4 0 0 1 2 14V6A4 4 0 0 1 6 2ZM13.8 7.15A4.75 4.75 0 1 1 6.2 7.15A0.75 0.75 0 0 1 7.4 8.05A3.25 3.25 0 1 0 12.6 8.05A0.75 0.75 0 0 1 13.8 7.15ZM9.25 6A0.75 0.75 0 0 1 10.75 6V10A0.75 0.75 0 0 1 9.25 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.75 2H17.25A4.75 4.75 0 0 1 22 6.75V17.25A4.75 4.75 0 0 1 17.25 22H6.75A4.75 4.75 0 0 1 2 17.25V6.75A4.75 4.75 0 0 1 6.75 2ZM17 8.25A6.25 6.25 0 1 1 7 8.25A0.75 0.75 0 0 1 8.2 9.15A4.75 4.75 0 1 0 15.8 9.15A0.75 0.75 0 0 1 17 8.25ZM11.25 6.5A0.75 0.75 0 0 1 12.75 6.5V12A0.75 0.75 0 0 1 11.25 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "On/off sign",
      "tags": [
        "on-off",
        "toggle",
        "iec"
      ],
      "note": "Rhythm: a closed ring with the line dropped through its top to the centre — the IEC push-on/push-off sign. Ring outer ⌀17 · 13.5 · 12 sits on the bottom of the box; the line's stub stands 3 · 2.5 · 2 above the ring (0.18 · 0.19 · 0.17 of the ring, steady), and its inner run is half the ring's white. The ring crosses the line square-on, so no narrow wedge. Ink 17×20 · 13.5×16 · 12×14, box-centred, agreed box (it is narrower than the circle keyline because the stub needs the height). Filled: line-heavy, 2.5 · 2 · 2 on the same outer edges, as ban-filled. Who: IEC 60417-5010, Unicode ⏼, SF Symbols togglepower. At 16 it sits between A and stopwatch: the stub through the ring is what separates it from stopwatch's crown, which floats above its ring.",
      "box": {
        "16": [
          12,
          14
        ],
        "20": [
          13.5,
          16
        ],
        "24": [
          17,
          20
        ]
      },
      "masters": {
        "16": [
          "M2.625 9A5.375 5.375 0 1 0 13.375 9A5.375 5.375 0 1 0 2.625 9Z",
          "M8 1.625V9"
        ],
        "20": [
          "M4 11.25A6 6 0 1 0 16 11.25A6 6 0 1 0 4 11.25Z",
          "M10 2.75V11.25"
        ],
        "24": [
          "M4.25 13.5A7.75 7.75 0 1 0 19.75 13.5A7.75 7.75 0 1 0 4.25 13.5Z",
          "M12 2.75V13.5"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M3 9A5 5 0 1 0 13 9A5 5 0 1 0 3 9Z",
            "M8 2V8.625"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M4.25 11.25A5.75 5.75 0 1 0 15.75 11.25A5.75 5.75 0 1 0 4.25 11.25Z",
            "M10 3V11"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M4.75 13.5A7.25 7.25 0 1 0 19.25 13.5A7.25 7.25 0 1 0 4.75 13.5Z",
            "M12 3.25V13"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "I and O marks",
      "tags": [
        "on",
        "off",
        "rocker",
        "switch",
        "io"
      ],
      "note": "Rhythm: the switch's two marks at one height — bar and ring both 12 · 10 · 8 tall — with 5.5 · 4.5 · 3.5 between them (0.46 · 0.45 · 0.44 of the height, steady), so they read as two marks, not a 10. Ring white 9 · 7 · 5.5. Ink 19×12 · 16×10 · 12.75×8, box-centred, agreed box. Filled: line-heavy, 2.5 · 2 · 2; both keep their outer edges, so the air between grows thinner by the bar's added half — 4.5 · 4 · 2.75 — and the ring's white is 7 · 6 · 4. Who: IEC 60417-5007 (on) and -5008 (off), printed on every rocker switch; SF Symbols poweron and poweroff; Unicode ⏽ and ⭘. No set I know ships the two joined as one icon, and at 16 it can read as 'IO' (input/output) or 10 — the weakest of the five for a button, shown because it is the switch's own wording.",
      "box": {
        "16": [
          12.75,
          8
        ],
        "20": [
          16,
          10
        ],
        "24": [
          19,
          12
        ]
      },
      "masters": {
        "16": [
          "M2.25 4.625V11.375",
          "M7 8A3.375 3.375 0 1 0 13.75 8A3.375 3.375 0 1 0 7 8Z"
        ],
        "20": [
          "M2.75 5.75V14.25",
          "M8.75 10A4.25 4.25 0 1 0 17.25 10A4.25 4.25 0 1 0 8.75 10Z"
        ],
        "24": [
          "M3.25 6.75V17.25",
          "M10.25 12A5.25 5.25 0 1 0 20.75 12A5.25 5.25 0 1 0 10.25 12Z"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M2.625 5V11",
            "M7.375 8A3 3 0 1 0 13.375 8A3 3 0 1 0 7.375 8Z"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M3 6V14",
            "M9 10A4 4 0 1 0 17 10A4 4 0 1 0 9 10Z"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M3.75 7.25V16.75",
            "M10.75 12A4.75 4.75 0 1 0 20.25 12A4.75 4.75 0 1 0 10.75 12Z"
          ]
        }
      }
    }
  ]
};
