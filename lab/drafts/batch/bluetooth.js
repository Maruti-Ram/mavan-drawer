// bluetooth: the rune is the only picture people know, so this decides how it is presented — bare, held in a circle or the badge, or carrying a state (connected, searching) — and which of those ships as plain `bluetooth`.
export default {
  "concept": "bluetooth",
  "question": "Which presentation of the Bluetooth rune is our bluetooth: the bare rune (A), the rune held in a circle (B) or in the badge (C), or the rune carrying a state — connected dots (D) or searching waves (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Bare rune",
      "tags": [
        "rune",
        "wireless",
        "pairing",
        "bluetooth"
      ],
      "note": "Rhythm: the rune drawn as two closed loops and one V of arms through the crossing, so the stem runs unbroken and each loop is a real closed shape; both loops share one crossing on the stem's centre and mirror each other exactly. Ink 12×18 · 9.5×14 · 8×12 — the mark ceiling's height, width 2:3 (Tabler's rune measures 12×18 of ink, Central's 13.1×19.8); slope 38.4 · 38.3 · 39° (Tabler 38.7°, Central 39.3°; Lucide and Material use 45°, which narrows the loops). Loop tips reach 5.71 · 4.46 · 3.74 right of the stem, arms 5.25 · 4 · 3.375 left — the arms stop 0.46 · 0.46 · 0.37 short because the loops' rounded tips pull their ink in and the arms' round caps do not, which puts the ink box exactly on the stem (centre 12,12 · 10,10 · 8,8). Air inside each loop 2.88 · 1.92 · 1.64 (widest circle, §5i), arm-to-stem tip air 4.33 · 2.94 · 2.49 (§6). Corners are C10 arcs 0.75 · 0.75 · 0.625; every off-grid decimal is a tangent point or an arm end on the 38–39° line. Filled: the loops are closed triangles, so the shape rule fills them — each filled inside its centreline and traced at the outline weight, arrow-down-4's closed head construction — and the arms stay 1.5 · 1.5 · 1.25; ink box identical to the last digit. The line-heavy alternative (2.5 · 2 · 2) was measured and fails: loop air 1.89 · 1.42 · 0.91 and arm tips 1.32 at 16. Who: Lucide bluetooth, Tabler bluetooth, Material bluetooth, Central bluetooth — every set's base mark. (recommended) — it is the mark every set ships, it holds every gap at 16 without a note, and D and E grow from it unchanged.",
      "keyline": "mark",
      "masters": {
        "16": [
          "M8 8L8 3.25A0.625 0.625 0 0 1 9.018 2.764L11.143 4.484A0.625 0.625 0 0 1 11.143 5.456Z",
          "M8 8L11.143 10.544A0.625 0.625 0 0 1 11.143 11.516L9.018 13.236A0.625 0.625 0 0 1 8 12.75Z",
          "M4.625 5.268L8 8L4.625 10.732"
        ],
        "20": [
          "M10 10L10 4.5A0.75 0.75 0 0 1 11.21 3.91L13.72 5.89A0.75 0.75 0 0 1 13.72 7.06Z",
          "M10 10L13.72 12.94A0.75 0.75 0 0 1 13.72 14.11L11.21 16.09A0.75 0.75 0 0 1 10 15.5Z",
          "M6 6.84L10 10L6 13.16"
        ],
        "24": [
          "M12 12L12 4.51A0.75 0.75 0 0 1 13.22 3.92L16.97 6.89A0.75 0.75 0 0 1 16.97 8.06Z",
          "M12 12L16.97 15.94A0.75 0.75 0 0 1 16.97 17.11L13.22 20.08A0.75 0.75 0 0 1 12 19.5Z",
          "M6.75 7.84L12 12L6.75 16.16"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M8 8L8 3.25A0.625 0.625 0 0 1 9.018 2.764L11.143 4.484A0.625 0.625 0 0 1 11.143 5.456Z",
            "M8 8L11.143 10.544A0.625 0.625 0 0 1 11.143 11.516L9.018 13.236A0.625 0.625 0 0 1 8 12.75Z"
          ],
          "stroke": [
            "M8 8L8 3.25A0.625 0.625 0 0 1 9.018 2.764L11.143 4.484A0.625 0.625 0 0 1 11.143 5.456Z",
            "M8 8L11.143 10.544A0.625 0.625 0 0 1 11.143 11.516L9.018 13.236A0.625 0.625 0 0 1 8 12.75Z",
            "M4.625 5.268L8 8L4.625 10.732"
          ]
        },
        "20": {
          "fill": [
            "M10 10L10 4.5A0.75 0.75 0 0 1 11.21 3.91L13.72 5.89A0.75 0.75 0 0 1 13.72 7.06Z",
            "M10 10L13.72 12.94A0.75 0.75 0 0 1 13.72 14.11L11.21 16.09A0.75 0.75 0 0 1 10 15.5Z"
          ],
          "stroke": [
            "M10 10L10 4.5A0.75 0.75 0 0 1 11.21 3.91L13.72 5.89A0.75 0.75 0 0 1 13.72 7.06Z",
            "M10 10L13.72 12.94A0.75 0.75 0 0 1 13.72 14.11L11.21 16.09A0.75 0.75 0 0 1 10 15.5Z",
            "M6 6.84L10 10L6 13.16"
          ]
        },
        "24": {
          "fill": [
            "M12 12L12 4.51A0.75 0.75 0 0 1 13.22 3.92L16.97 6.89A0.75 0.75 0 0 1 16.97 8.06Z",
            "M12 12L16.97 15.94A0.75 0.75 0 0 1 16.97 17.11L13.22 20.08A0.75 0.75 0 0 1 12 19.5Z"
          ],
          "stroke": [
            "M12 12L12 4.51A0.75 0.75 0 0 1 13.22 3.92L16.97 6.89A0.75 0.75 0 0 1 16.97 8.06Z",
            "M12 12L16.97 15.94A0.75 0.75 0 0 1 16.97 17.11L13.22 20.08A0.75 0.75 0 0 1 12 19.5Z",
            "M6.75 7.84L12 12L6.75 16.16"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Rune in a circle",
      "tags": [
        "circle",
        "rune",
        "wireless",
        "toggle"
      ],
      "note": "Rhythm: x-circle's ring (⌀20 · 16 · 14 ink) with the same rune as A, as tall as the ring allows — 13.75 · 9.75 · 8.25 of ink, dollar-circle's glyph height rounded down until the rune's rounded head clears the ring's inner edge by 1.57 · 1.54 · 1.56 (its nearest point; the sides have more). Rune ink 9.32×13.76 · 6.82×9.74 · 5.68×8.24, box-centred, slope 38.4 · 38.3 · 39°. The loops cannot keep their air inside a ring: 1.85 · 0.89 · 0.75 at 24 · 20 · 16 — even the roomiest triangle that fits inside the ring with 1.5 to spare, at any angle, would leave at most about 1.05 · 0.93 — so the outline declares gap 0.88 at 20 and 0.74 at 16 (bitcoin-circle ships 1.2 and 1); arm-to-stem tip air 2.85 · 1.45 · 1.21. Filled: disc ⌀20 · 16 · 14 with the rune cut out at 1.5 (check-circle's cut); the loops keep their islands at 24 (1.85 of material) and are cut solid at 20 and 16, where the islands would be 0.89 · 0.50 (under the 1.5 · 1.25 floor). Who: the Bluetooth toggle in iOS Control Center and Android Quick Settings (UI, not an icon set); none of Lucide, Tabler, Material or Central ships it.",
      "gap": {
        "outline": {
          "16": 0.74,
          "20": 0.88
        }
      },
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M8 8L8 5.125A0.625 0.625 0 0 1 9.018 4.639L9.985 5.422A0.625 0.625 0 0 1 9.985 6.393Z",
          "M8 8L9.985 9.607A0.625 0.625 0 0 1 9.985 10.578L9.018 11.361A0.625 0.625 0 0 1 8 10.875Z",
          "M5.783 6.206L8 8L5.783 9.794"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M10 10L10 6.62A0.75 0.75 0 0 1 11.21 6.04L12.37 6.95A0.75 0.75 0 0 1 12.37 8.13Z",
          "M10 10L12.37 11.87A0.75 0.75 0 0 1 12.37 13.05L11.21 13.96A0.75 0.75 0 0 1 10 13.38Z",
          "M7.34 7.9L10 10L7.34 12.1"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M12 12L12 6.62A0.75 0.75 0 0 1 13.22 6.04L15.63 7.95A0.75 0.75 0 0 1 15.63 9.12Z",
          "M12 12L15.63 14.88A0.75 0.75 0 0 1 15.63 16.05L13.22 17.96A0.75 0.75 0 0 1 12 17.38Z",
          "M8.09 8.9L12 12L8.09 15.1"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7.25 6.428L7.25 5.125A1.375 1.375 0 0 1 9.49 4.056L10.457 4.839A1.375 1.375 0 0 1 10.457 6.976L9.192 8L10.457 9.024A1.375 1.375 0 0 1 10.457 11.161L9.49 11.944A1.375 1.375 0 0 1 7.25 10.875L7.25 9.572L6.255 10.377A0.75 0.75 0 0 1 5.311 9.211L6.808 8L5.311 6.789A0.75 0.75 0 0 1 6.255 5.623Z"
          ]
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM9.25 8.45L9.25 6.62A1.5 1.5 0 0 1 11.68 5.45L12.84 6.36A1.5 1.5 0 0 1 12.84 8.72L11.21 10L12.84 11.28A1.5 1.5 0 0 1 12.84 13.64L11.68 14.55A1.5 1.5 0 0 1 9.25 13.38L9.25 11.55L7.81 12.69A0.75 0.75 0 0 1 6.88 11.51L8.79 10L6.88 8.49A0.75 0.75 0 0 1 7.81 7.31Z"
          ]
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM11.25 10.45L11.25 6.62A1.5 1.5 0 0 1 13.68 5.45L16.1 7.36A1.5 1.5 0 0 1 16.1 9.71L13.21 12L16.1 14.29A1.5 1.5 0 0 1 16.1 16.64L13.68 18.55A1.5 1.5 0 0 1 11.25 17.38L11.25 13.55L8.55 15.69A0.75 0.75 0 0 1 7.62 14.51L10.79 12L7.62 9.49A0.75 0.75 0 0 1 8.55 8.31ZM12.75 10.45L12.75 6.62L15.16 8.54ZM12.75 13.55L15.16 15.46L12.75 17.38Z"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Rune in the badge",
      "tags": [
        "badge",
        "capsule",
        "logo",
        "rune",
        "wireless"
      ],
      "note": "Rhythm: a vertical capsule — the Bluetooth logo's own badge — with the same rune as B. Capsule 16×20 at 24 (the portrait keyline); 14×16 at 20 and 12×14 at 16, wider than the keyline's 12 and 10, because at those widths the walls force the rune down to loop air 0.52 and 0.27; this way the rune is B's rune exactly and clears the walls by 1.51 · 1.51 · 1.52. Rune ink 9.32×13.76 · 6.82×9.74 · 5.68×8.24, box-centred. Same loop air as B — 1.85 · 0.89 · 0.75 — so the outline declares gap 0.88 at 20 and 0.74 at 16; arm-to-stem tip air 2.85 · 1.45 · 1.21. Filled: the solid badge with the rune knocked out at 1.5, islands kept at 24 only (as B). The badge is the Bluetooth SIG's trademark shape, so this one reads as the brand rather than the function. Who: the Bluetooth SIG logo, Font Awesome bluetooth (brands).",
      "box": {
        "16": [
          12,
          14
        ],
        "20": [
          14,
          16
        ],
        "24": [
          16,
          20
        ]
      },
      "gap": {
        "outline": {
          "16": 0.74,
          "20": 0.88
        }
      },
      "masters": {
        "16": [
          "M2.625 7A5.375 5.375 0 0 1 13.375 7L13.375 9A5.375 5.375 0 0 1 2.625 9Z",
          "M8 8L8 5.125A0.625 0.625 0 0 1 9.018 4.639L9.985 5.422A0.625 0.625 0 0 1 9.985 6.393Z",
          "M8 8L9.985 9.607A0.625 0.625 0 0 1 9.985 10.578L9.018 11.361A0.625 0.625 0 0 1 8 10.875Z",
          "M5.783 6.206L8 8L5.783 9.794"
        ],
        "20": [
          "M3.75 9A6.25 6.25 0 0 1 16.25 9L16.25 11A6.25 6.25 0 0 1 3.75 11Z",
          "M10 10L10 6.62A0.75 0.75 0 0 1 11.21 6.04L12.37 6.95A0.75 0.75 0 0 1 12.37 8.13Z",
          "M10 10L12.37 11.87A0.75 0.75 0 0 1 12.37 13.05L11.21 13.96A0.75 0.75 0 0 1 10 13.38Z",
          "M7.34 7.9L10 10L7.34 12.1"
        ],
        "24": [
          "M4.75 10A7.25 7.25 0 0 1 19.25 10L19.25 14A7.25 7.25 0 0 1 4.75 14Z",
          "M12 12L12 6.62A0.75 0.75 0 0 1 13.22 6.04L15.63 7.95A0.75 0.75 0 0 1 15.63 9.12Z",
          "M12 12L15.63 14.88A0.75 0.75 0 0 1 15.63 16.05L13.22 17.96A0.75 0.75 0 0 1 12 17.38Z",
          "M8.09 8.9L12 12L8.09 15.1"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 7A6 6 0 0 1 14 7L14 9A6 6 0 0 1 2 9ZM7.25 6.428L7.25 5.125A1.375 1.375 0 0 1 9.49 4.056L10.457 4.839A1.375 1.375 0 0 1 10.457 6.976L9.192 8L10.457 9.024A1.375 1.375 0 0 1 10.457 11.161L9.49 11.944A1.375 1.375 0 0 1 7.25 10.875L7.25 9.572L6.255 10.377A0.75 0.75 0 0 1 5.311 9.211L6.808 8L5.311 6.789A0.75 0.75 0 0 1 6.255 5.623Z"
          ]
        },
        "20": {
          "fill": [
            "M3 9A7 7 0 0 1 17 9L17 11A7 7 0 0 1 3 11ZM9.25 8.45L9.25 6.62A1.5 1.5 0 0 1 11.68 5.45L12.84 6.36A1.5 1.5 0 0 1 12.84 8.72L11.21 10L12.84 11.28A1.5 1.5 0 0 1 12.84 13.64L11.68 14.55A1.5 1.5 0 0 1 9.25 13.38L9.25 11.55L7.81 12.69A0.75 0.75 0 0 1 6.88 11.51L8.79 10L6.88 8.49A0.75 0.75 0 0 1 7.81 7.31Z"
          ]
        },
        "24": {
          "fill": [
            "M4 10A8 8 0 0 1 20 10L20 14A8 8 0 0 1 4 14ZM11.25 10.45L11.25 6.62A1.5 1.5 0 0 1 13.68 5.45L16.1 7.36A1.5 1.5 0 0 1 16.1 9.71L13.21 12L16.1 14.29A1.5 1.5 0 0 1 16.1 16.64L13.68 18.55A1.5 1.5 0 0 1 11.25 17.38L11.25 13.55L8.55 15.69A0.75 0.75 0 0 1 7.62 14.51L10.79 12L7.62 9.49A0.75 0.75 0 0 1 8.55 8.31ZM12.75 10.45L12.75 6.62L15.16 8.54ZM12.75 13.55L15.16 15.46L12.75 17.38Z"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Connected, two dots",
      "tags": [
        "connected",
        "paired",
        "dots",
        "rune",
        "wireless"
      ],
      "note": "Rhythm: A's rune unchanged, a dot on each side on the crossing's level, the same distance from the stem — 6.25 · 5.75 · 5 — so the air to the arms (left) and to the loops (right) is equal, 1.63 · 1.56 · 1.52 at 24 · 20 · 16 (the arms and the loops' long edges are the same two lines through the crossing). Dots are live's: ink ⌀3 · 2.5 · 2. Ink 15.5×18 · 14×14 · 12×12, the mark ceiling's full width at 20 and 16, centred on the stem. Filled: A's solid loops and arms, the dots unchanged; ink box identical. Who: Material bluetooth_connected (dots), Tabler bluetooth-connected and Lucide bluetooth-connected (short dashes in the same place).",
      "keyline": "mark",
      "masters": {
        "16": [
          "M8 8L8 3.25A0.625 0.625 0 0 1 9.018 2.764L11.143 4.484A0.625 0.625 0 0 1 11.143 5.456Z",
          "M8 8L11.143 10.544A0.625 0.625 0 0 1 11.143 11.516L9.018 13.236A0.625 0.625 0 0 1 8 12.75Z",
          "M4.625 5.268L8 8L4.625 10.732",
          "M2.625 8A0.375 0.375 0 1 0 3.375 8A0.375 0.375 0 1 0 2.625 8Z",
          "M12.625 8A0.375 0.375 0 1 0 13.375 8A0.375 0.375 0 1 0 12.625 8Z"
        ],
        "20": [
          "M10 10L10 4.5A0.75 0.75 0 0 1 11.21 3.91L13.72 5.89A0.75 0.75 0 0 1 13.72 7.06Z",
          "M10 10L13.72 12.94A0.75 0.75 0 0 1 13.72 14.11L11.21 16.09A0.75 0.75 0 0 1 10 15.5Z",
          "M6 6.84L10 10L6 13.16",
          "M3.75 10A0.5 0.5 0 1 0 4.75 10A0.5 0.5 0 1 0 3.75 10Z",
          "M15.25 10A0.5 0.5 0 1 0 16.25 10A0.5 0.5 0 1 0 15.25 10Z"
        ],
        "24": [
          "M12 12L12 4.51A0.75 0.75 0 0 1 13.22 3.92L16.97 6.89A0.75 0.75 0 0 1 16.97 8.06Z",
          "M12 12L16.97 15.94A0.75 0.75 0 0 1 16.97 17.11L13.22 20.08A0.75 0.75 0 0 1 12 19.5Z",
          "M6.75 7.84L12 12L6.75 16.16",
          "M5 12A0.75 0.75 0 1 0 6.5 12A0.75 0.75 0 1 0 5 12Z",
          "M17.5 12A0.75 0.75 0 1 0 19 12A0.75 0.75 0 1 0 17.5 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M8 8L8 3.25A0.625 0.625 0 0 1 9.018 2.764L11.143 4.484A0.625 0.625 0 0 1 11.143 5.456Z",
            "M8 8L11.143 10.544A0.625 0.625 0 0 1 11.143 11.516L9.018 13.236A0.625 0.625 0 0 1 8 12.75Z"
          ],
          "stroke": [
            "M8 8L8 3.25A0.625 0.625 0 0 1 9.018 2.764L11.143 4.484A0.625 0.625 0 0 1 11.143 5.456Z",
            "M8 8L11.143 10.544A0.625 0.625 0 0 1 11.143 11.516L9.018 13.236A0.625 0.625 0 0 1 8 12.75Z",
            "M4.625 5.268L8 8L4.625 10.732",
            "M2.625 8A0.375 0.375 0 1 0 3.375 8A0.375 0.375 0 1 0 2.625 8Z",
            "M12.625 8A0.375 0.375 0 1 0 13.375 8A0.375 0.375 0 1 0 12.625 8Z"
          ]
        },
        "20": {
          "fill": [
            "M10 10L10 4.5A0.75 0.75 0 0 1 11.21 3.91L13.72 5.89A0.75 0.75 0 0 1 13.72 7.06Z",
            "M10 10L13.72 12.94A0.75 0.75 0 0 1 13.72 14.11L11.21 16.09A0.75 0.75 0 0 1 10 15.5Z"
          ],
          "stroke": [
            "M10 10L10 4.5A0.75 0.75 0 0 1 11.21 3.91L13.72 5.89A0.75 0.75 0 0 1 13.72 7.06Z",
            "M10 10L13.72 12.94A0.75 0.75 0 0 1 13.72 14.11L11.21 16.09A0.75 0.75 0 0 1 10 15.5Z",
            "M6 6.84L10 10L6 13.16",
            "M3.75 10A0.5 0.5 0 1 0 4.75 10A0.5 0.5 0 1 0 3.75 10Z",
            "M15.25 10A0.5 0.5 0 1 0 16.25 10A0.5 0.5 0 1 0 15.25 10Z"
          ]
        },
        "24": {
          "fill": [
            "M12 12L12 4.51A0.75 0.75 0 0 1 13.22 3.92L16.97 6.89A0.75 0.75 0 0 1 16.97 8.06Z",
            "M12 12L16.97 15.94A0.75 0.75 0 0 1 16.97 17.11L13.22 20.08A0.75 0.75 0 0 1 12 19.5Z"
          ],
          "stroke": [
            "M12 12L12 4.51A0.75 0.75 0 0 1 13.22 3.92L16.97 6.89A0.75 0.75 0 0 1 16.97 8.06Z",
            "M12 12L16.97 15.94A0.75 0.75 0 0 1 16.97 17.11L13.22 20.08A0.75 0.75 0 0 1 12 19.5Z",
            "M6.75 7.84L12 12L6.75 16.16",
            "M5 12A0.75 0.75 0 1 0 6.5 12A0.75 0.75 0 1 0 5 12Z",
            "M17.5 12A0.75 0.75 0 1 0 19 12A0.75 0.75 0 1 0 17.5 12Z"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Searching, two waves",
      "tags": [
        "searching",
        "pairing",
        "waves",
        "scan",
        "rune",
        "wireless"
      ],
      "note": "Rhythm: A's rune moved left (stem at 9.5 · 7.25 · 5.375) with two waves centred on its crossing, on the loops' side: radii 7.25/10.25 · 6.5/9.5 · 5.875/8.625, pitch 3 · 3 · 2.75 so wave-to-wave air is 1.5 · 1.5 · 1.5, and the inner wave sits 1.5 · 1.54 · 1.55 from the loops — one even beat. Half-spans 14°/28° · 12°/24° · 13°/26° (the inner wave nests in the mouth between the loops; the outer clears the tips by 2.31 · 3.19 · 3.18). Ink 17×18 · 15×14 · 13.24×12, box-centred; declared as a box because at 20 and 16 it is wider than the mark ceiling (14, 12) — the waves need 5 · 5.5 · 5.25 beside the rune and the rune cannot shrink without closing its loops. Filled: A's solid loops and arms, waves stay 1.5 · 1.5 · 1.25. Who: Material bluetooth_searching (two waves), Lucide bluetooth-searching (one wave and a dot).",
      "box": {
        "16": [
          13.25,
          12
        ],
        "20": [
          15,
          14
        ],
        "24": [
          17,
          18
        ]
      },
      "masters": {
        "16": [
          "M5.375 8L5.375 3.25A0.625 0.625 0 0 1 6.393 2.764L8.518 4.484A0.625 0.625 0 0 1 8.518 5.456Z",
          "M5.375 8L8.518 10.544A0.625 0.625 0 0 1 8.518 11.516L6.393 13.236A0.625 0.625 0 0 1 5.375 12.75Z",
          "M2 5.268L5.375 8L2 10.732",
          "M11.099 6.678A5.875 5.875 0 0 1 11.099 9.322",
          "M13.127 4.219A8.625 8.625 0 0 1 13.127 11.781"
        ],
        "20": [
          "M7.25 10L7.25 4.5A0.75 0.75 0 0 1 8.46 3.91L10.97 5.89A0.75 0.75 0 0 1 10.97 7.06Z",
          "M7.25 10L10.97 12.94A0.75 0.75 0 0 1 10.97 14.11L8.46 16.09A0.75 0.75 0 0 1 7.25 15.5Z",
          "M3.25 6.84L7.25 10L3.25 13.16",
          "M13.61 8.65A6.5 6.5 0 0 1 13.61 11.35",
          "M15.93 6.14A9.5 9.5 0 0 1 15.93 13.86"
        ],
        "24": [
          "M9.5 12L9.5 4.51A0.75 0.75 0 0 1 10.72 3.92L14.47 6.89A0.75 0.75 0 0 1 14.47 8.06Z",
          "M9.5 12L14.47 15.94A0.75 0.75 0 0 1 14.47 17.11L10.72 20.08A0.75 0.75 0 0 1 9.5 19.5Z",
          "M4.25 7.84L9.5 12L4.25 16.16",
          "M16.53 10.25A7.25 7.25 0 0 1 16.53 13.75",
          "M18.55 7.19A10.25 10.25 0 0 1 18.55 16.81"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.375 8L5.375 3.25A0.625 0.625 0 0 1 6.393 2.764L8.518 4.484A0.625 0.625 0 0 1 8.518 5.456Z",
            "M5.375 8L8.518 10.544A0.625 0.625 0 0 1 8.518 11.516L6.393 13.236A0.625 0.625 0 0 1 5.375 12.75Z"
          ],
          "stroke": [
            "M5.375 8L5.375 3.25A0.625 0.625 0 0 1 6.393 2.764L8.518 4.484A0.625 0.625 0 0 1 8.518 5.456Z",
            "M5.375 8L8.518 10.544A0.625 0.625 0 0 1 8.518 11.516L6.393 13.236A0.625 0.625 0 0 1 5.375 12.75Z",
            "M2 5.268L5.375 8L2 10.732",
            "M11.099 6.678A5.875 5.875 0 0 1 11.099 9.322",
            "M13.127 4.219A8.625 8.625 0 0 1 13.127 11.781"
          ]
        },
        "20": {
          "fill": [
            "M7.25 10L7.25 4.5A0.75 0.75 0 0 1 8.46 3.91L10.97 5.89A0.75 0.75 0 0 1 10.97 7.06Z",
            "M7.25 10L10.97 12.94A0.75 0.75 0 0 1 10.97 14.11L8.46 16.09A0.75 0.75 0 0 1 7.25 15.5Z"
          ],
          "stroke": [
            "M7.25 10L7.25 4.5A0.75 0.75 0 0 1 8.46 3.91L10.97 5.89A0.75 0.75 0 0 1 10.97 7.06Z",
            "M7.25 10L10.97 12.94A0.75 0.75 0 0 1 10.97 14.11L8.46 16.09A0.75 0.75 0 0 1 7.25 15.5Z",
            "M3.25 6.84L7.25 10L3.25 13.16",
            "M13.61 8.65A6.5 6.5 0 0 1 13.61 11.35",
            "M15.93 6.14A9.5 9.5 0 0 1 15.93 13.86"
          ]
        },
        "24": {
          "fill": [
            "M9.5 12L9.5 4.51A0.75 0.75 0 0 1 10.72 3.92L14.47 6.89A0.75 0.75 0 0 1 14.47 8.06Z",
            "M9.5 12L14.47 15.94A0.75 0.75 0 0 1 14.47 17.11L10.72 20.08A0.75 0.75 0 0 1 9.5 19.5Z"
          ],
          "stroke": [
            "M9.5 12L9.5 4.51A0.75 0.75 0 0 1 10.72 3.92L14.47 6.89A0.75 0.75 0 0 1 14.47 8.06Z",
            "M9.5 12L14.47 15.94A0.75 0.75 0 0 1 14.47 17.11L10.72 20.08A0.75 0.75 0 0 1 9.5 19.5Z",
            "M4.25 7.84L9.5 12L4.25 16.16",
            "M16.53 10.25A7.25 7.25 0 0 1 16.53 13.75",
            "M18.55 7.19A10.25 10.25 0 0 1 18.55 16.81"
          ]
        }
      }
    }
  ]
};
