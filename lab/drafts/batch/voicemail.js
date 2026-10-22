// voicemail: the tape-reel glyph is the one picture every set agrees on, so this decides whether ours stands bare as a wide mark (toggle-off's agreed box) or sits in a container that costs the reels their holes at 20 and 16.
export default {
  "concept": "voicemail",
  "question": "Which picture says voicemail: the bare tape reels (A), the reels framed in a box (B) or a circle (C), a whole cassette (D), or the reels joined along the top (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Tape reels",
      "tags": [
        "tape",
        "reels",
        "answering machine",
        "message"
      ],
      "note": "Rhythm: two identical rings ⌀9 · 7 · 6 of ink (centreline r 3.75 · 2.75 · 2.375), 2 · 2 · 2 of air between them, centre pitch 11 · 9 · 8; the tape runs centre to centre along the rings' bottoms, its ink flush with theirs, so the box is the rings' own height. Hole 6 · 4 · 3.5 (holds 1.5 at 16 with 2 to spare). Ink 20×9 · 16×7 · 14×6, agreed box: a wide two-part mark like toggle-off, which settled on an agreed box of the same widths (20×12 · 16×10 · 14×8) instead of `keyline: mark` (mark ≤ 18 · 14 · 12 would shrink the rings to ⌀8 · 6 · 5); box-centred, symmetric left–right. At 24 and 20 the top and bottom edges fall on half pixels (7.5–16.5, 6.5–13.5), the price of keeping the group centred; 16 sits on whole pixels. Filled: the rings fill to discs ⌀9 · 7 · 6 with a hub hole ⌀3 · 3 · 2 (material 3 · 2 · 2, film-reel's ⌀3 holes), the tape stays 1.5 · 1.5 · 1.25; ink box identical. Who: Lucide voicemail, Material voicemail, SF Symbols recordingtape, Phosphor Voicemail, Tabler voicemail, Hugeicons, Carbon, IconPark, Font Awesome, Bootstrap, Nucleo, Mage. (recommended) — it is the picture nearly every set and phone uses for voicemail, and the only one here whose reels keep a real hole at every size without a gap note.",
      "box": {
        "16": [
          14,
          6
        ],
        "20": [
          16,
          7
        ],
        "24": [
          20,
          9
        ]
      },
      "masters": {
        "16": [
          "M1.625 8A2.375 2.375 0 1 0 6.375 8A2.375 2.375 0 1 0 1.625 8Z",
          "M9.625 8A2.375 2.375 0 1 0 14.375 8A2.375 2.375 0 1 0 9.625 8Z",
          "M4 10.375H12"
        ],
        "20": [
          "M2.75 10A2.75 2.75 0 1 0 8.25 10A2.75 2.75 0 1 0 2.75 10Z",
          "M11.75 10A2.75 2.75 0 1 0 17.25 10A2.75 2.75 0 1 0 11.75 10Z",
          "M5.5 12.75H14.5"
        ],
        "24": [
          "M2.75 12A3.75 3.75 0 1 0 10.25 12A3.75 3.75 0 1 0 2.75 12Z",
          "M13.75 12A3.75 3.75 0 1 0 21.25 12A3.75 3.75 0 1 0 13.75 12Z",
          "M6.5 15.75H17.5"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A3 3 0 1 0 7 8A3 3 0 1 0 1 8ZM3 8A1 1 0 1 0 5 8A1 1 0 1 0 3 8ZM9 8A3 3 0 1 0 15 8A3 3 0 1 0 9 8ZM11 8A1 1 0 1 0 13 8A1 1 0 1 0 11 8Z"
          ],
          "stroke": [
            "M4 10.375H12"
          ]
        },
        "20": {
          "fill": [
            "M2 10A3.5 3.5 0 1 0 9 10A3.5 3.5 0 1 0 2 10ZM4 10A1.5 1.5 0 1 0 7 10A1.5 1.5 0 1 0 4 10ZM11 10A3.5 3.5 0 1 0 18 10A3.5 3.5 0 1 0 11 10ZM13 10A1.5 1.5 0 1 0 16 10A1.5 1.5 0 1 0 13 10Z"
          ],
          "stroke": [
            "M5.5 12.75H14.5"
          ]
        },
        "24": {
          "fill": [
            "M2 12A4.5 4.5 0 1 0 11 12A4.5 4.5 0 1 0 2 12ZM5 12A1.5 1.5 0 1 0 8 12A1.5 1.5 0 1 0 5 12ZM13 12A4.5 4.5 0 1 0 22 12A4.5 4.5 0 1 0 13 12ZM16 12A1.5 1.5 0 1 0 19 12A1.5 1.5 0 1 0 16 12Z"
          ],
          "stroke": [
            "M6.5 15.75H17.5"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Reels in a box",
      "tags": [
        "tape",
        "reels",
        "answering machine",
        "inbox",
        "box"
      ],
      "note": "Rhythm: mail's landscape frame 20×16 · 16×12 · 14×10, r2.5 · 2 · 1.5, with the reels centred inside: reels ⌀5.5 · 4 · 3.5 of ink, 2 · 1.5 · 1.5 of air between them, 2 · 1.75 · 1.5 to the side walls and 3.75 · 2.5 · 2 to the top and bottom walls. The frame leaves no room at 20 and 16 for a 1.5 hole (two reels with 1.5 holes and 1.5 of air need 13.5 inside a 13 wide frame at 20), so the holes are 1 there, declared `gap: 1` (outline, 20 and 16 only); dropping the holes instead made solid dots that read as a dash — a face — at 16. Ink 20×16 · 16×12 · 14×10 on the landscape keyline. Filled: frame solid, the reels and tape cut out in 1.5 white (C22, 1.5 at 16 too); at 24 each reel is a white ring round a solid hub ⌀2.5, at 20 and 16 the hub would be 1 · 0.5 across, so the reels are cut as white discs ⌀4 · 3.5 with 1.5 of material between them. Who: Material Symbols voicemail_2, Fluent voicemail (Teams), Unicons voicemail-rectangle, css.gg voicemail-r. Reads as an answering machine's window; at 16 the reels are small.",
      "gap": {
        "outline": {
          "16": 1,
          "20": 1
        }
      },
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M4.375 8A1.125 1.125 0 1 0 6.625 8A1.125 1.125 0 1 0 4.375 8Z",
          "M9.375 8A1.125 1.125 0 1 0 11.625 8A1.125 1.125 0 1 0 9.375 8Z",
          "M5.5 9.125H10.5"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M6 10A1.25 1.25 0 1 0 8.5 10A1.25 1.25 0 1 0 6 10Z",
          "M11.5 10A1.25 1.25 0 1 0 14 10A1.25 1.25 0 1 0 11.5 10Z",
          "M7.25 11.25H12.75"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M6.25 12A2 2 0 1 0 10.25 12A2 2 0 1 0 6.25 12Z",
          "M13.75 12A2 2 0 1 0 17.75 12A2 2 0 1 0 13.75 12Z",
          "M8.25 14H15.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM5.5 9.75A1.75 1.75 0 1 1 7.232 8.25H8.768A1.75 1.75 0 1 1 10.5 9.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM7.25 12A2 2 0 1 1 9.19 10.5H10.81A2 2 0 1 1 12.75 12Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM8.25 14.75A2.75 2.75 0 1 1 10.7 13.25H13.3A2.75 2.75 0 1 1 15.75 14.75ZM7 12A1.25 1.25 0 1 0 9.5 12A1.25 1.25 0 1 0 7 12ZM14.5 12A1.25 1.25 0 1 0 17 12A1.25 1.25 0 1 0 14.5 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Reels in a circle",
      "tags": [
        "tape",
        "reels",
        "circle",
        "badge"
      ],
      "note": "Rhythm: the circle keyline ring ⌀20 · 16 · 14 with B's reels centred inside: reels ⌀5.5 · 4 · 3.5, 2 · 1.5 · 1.5 apart; the reels' farthest point clears the ring by 2 · 1.75 · 1.5. Same hole limit as B: 1 at 20 and 16, declared `gap: 1` (outline only); a ⌀4.5 reel with a 1.5 hole leaves 1.25 to the ring at 20. Ink 20×20 · 16×16 · 14×14, circle keyline, box-centred. Filled: disc solid, glyph cut out in 1.5 white, hub ⌀2.5 at 24 only, solid white reels ⌀4 · 3.5 at 20 and 16. Who: SF Symbols recordingtape.circle, css.gg voicemail-o. At 16 the circle and the low tape lean toward a face.",
      "gap": {
        "outline": {
          "16": 1,
          "20": 1
        }
      },
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M4.375 8A1.125 1.125 0 1 0 6.625 8A1.125 1.125 0 1 0 4.375 8Z",
          "M9.375 8A1.125 1.125 0 1 0 11.625 8A1.125 1.125 0 1 0 9.375 8Z",
          "M5.5 9.125H10.5"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M6 10A1.25 1.25 0 1 0 8.5 10A1.25 1.25 0 1 0 6 10Z",
          "M11.5 10A1.25 1.25 0 1 0 14 10A1.25 1.25 0 1 0 11.5 10Z",
          "M7.25 11.25H12.75"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M6.25 12A2 2 0 1 0 10.25 12A2 2 0 1 0 6.25 12Z",
          "M13.75 12A2 2 0 1 0 17.75 12A2 2 0 1 0 13.75 12Z",
          "M8.25 14H15.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM5.5 9.75A1.75 1.75 0 1 1 7.232 8.25H8.768A1.75 1.75 0 1 1 10.5 9.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM7.25 12A2 2 0 1 1 9.19 10.5H10.81A2 2 0 1 1 12.75 12Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM8.25 14.75A2.75 2.75 0 1 1 10.7 13.25H13.3A2.75 2.75 0 1 1 15.75 14.75ZM7 12A1.25 1.25 0 1 0 9.5 12A1.25 1.25 0 1 0 7 12ZM14.5 12A1.25 1.25 0 1 0 17 12A1.25 1.25 0 1 0 14.5 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Cassette tape",
      "tags": [
        "cassette",
        "tape",
        "recording",
        "answering machine"
      ],
      "note": "Rhythm: a cassette body 20×18 · 16×14 · 14×12 (camera's agreed box), r2.5 · 2 · 1.5; three equal-ish bands of air down the inside — top wall to reels 2.5 · 1.75 · 1.5, reels to the head window 2.5 · 1.75 · 1.5, window to the bottom wall 3 · 2 · 1.75. Reels as B (⌀5.5 · 4 · 3.5, 2 · 1.5 · 1.5 apart, holes 2.5 · 1 · 1, `gap: 1` at 20 and 16 for the same reason). The head window is a trapezoid on the bottom wall with 45° sides (the grid's angles), top 3 · 2.5 · 3 long, bends r0.75 · 0.75 · 0.625 (C10), legs landing at 6 / 18 · 5.25 / 14.75 · 3.5 / 12.5, clear of the corner arcs. Ink 20×18 · 16×14 · 14×12. Filled: body solid, reels cut as B, the window cut as a trapezoid down to the wall's inner edge, leaving 1.5 · 1.5 · 1.25 of wall under it. Who: Lucide cassette-tape, Phosphor CassetteTape, Tabler device-audio-tape — they mean tape and recording, not voicemail. Two reels over a trapezoid read as a frowning face, at 16 most.",
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
      "gap": {
        "outline": {
          "16": 1,
          "20": 1
        }
      },
      "masters": {
        "16": [
          "M3.125 2.625H12.875A1.5 1.5 0 0 1 14.375 4.125V11.875A1.5 1.5 0 0 1 12.875 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V4.125A1.5 1.5 0 0 1 3.125 2.625Z",
          "M4.375 6.5A1.125 1.125 0 1 0 6.625 6.5A1.125 1.125 0 1 0 4.375 6.5Z",
          "M9.375 6.5A1.125 1.125 0 1 0 11.625 6.5A1.125 1.125 0 1 0 9.375 6.5Z",
          "M5.5 7.625H10.5",
          "M3.5 13.375L6.317 10.558A0.625 0.625 0 0 1 6.759 10.375H9.241A0.625 0.625 0 0 1 9.683 10.558L12.5 13.375"
        ],
        "20": [
          "M4.75 3.75H15.25A2 2 0 0 1 17.25 5.75V14.25A2 2 0 0 1 15.25 16.25H4.75A2 2 0 0 1 2.75 14.25V5.75A2 2 0 0 1 4.75 3.75Z",
          "M6 8.25A1.25 1.25 0 1 0 8.5 8.25A1.25 1.25 0 1 0 6 8.25Z",
          "M11.5 8.25A1.25 1.25 0 1 0 14 8.25A1.25 1.25 0 1 0 11.5 8.25Z",
          "M7.25 9.5H12.75",
          "M5.25 16.25L8.53 12.97A0.75 0.75 0 0 1 9.06 12.75H10.94A0.75 0.75 0 0 1 11.47 12.97L14.75 16.25"
        ],
        "24": [
          "M5.25 3.75H18.75A2.5 2.5 0 0 1 21.25 6.25V17.75A2.5 2.5 0 0 1 18.75 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V6.25A2.5 2.5 0 0 1 5.25 3.75Z",
          "M6.25 9.75A2 2 0 1 0 10.25 9.75A2 2 0 1 0 6.25 9.75Z",
          "M13.75 9.75A2 2 0 1 0 17.75 9.75A2 2 0 1 0 13.75 9.75Z",
          "M8.25 11.75H15.75",
          "M6 20.25L10.28 15.97A0.75 0.75 0 0 1 10.81 15.75H13.19A0.75 0.75 0 0 1 13.72 15.97L18 20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 2H12.875A2.125 2.125 0 0 1 15 4.125V11.875A2.125 2.125 0 0 1 12.875 14H3.125A2.125 2.125 0 0 1 1 11.875V4.125A2.125 2.125 0 0 1 3.125 2ZM5.5 8.25A1.75 1.75 0 1 1 7.232 6.75H8.768A1.75 1.75 0 1 1 10.5 8.25ZM4.125 12.75L6.317 10.558A0.625 0.625 0 0 1 6.759 10.375H9.241A0.625 0.625 0 0 1 9.683 10.558L11.875 12.75Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 3H15.25A2.75 2.75 0 0 1 18 5.75V14.25A2.75 2.75 0 0 1 15.25 17H4.75A2.75 2.75 0 0 1 2 14.25V5.75A2.75 2.75 0 0 1 4.75 3ZM7.25 10.25A2 2 0 1 1 9.19 8.75H10.81A2 2 0 1 1 12.75 10.25ZM6 15.5L8.53 12.97A0.75 0.75 0 0 1 9.06 12.75H10.94A0.75 0.75 0 0 1 11.47 12.97L14 15.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 3H18.75A3.25 3.25 0 0 1 22 6.25V17.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75V6.25A3.25 3.25 0 0 1 5.25 3ZM8.25 12.5A2.75 2.75 0 1 1 10.7 11H13.3A2.75 2.75 0 1 1 15.75 12.5ZM7 9.75A1.25 1.25 0 1 0 9.5 9.75A1.25 1.25 0 1 0 7 9.75ZM14.5 9.75A1.25 1.25 0 1 0 17 9.75A1.25 1.25 0 1 0 14.5 9.75ZM6.75 19.5L10.28 15.97A0.75 0.75 0 0 1 10.81 15.75H13.19A0.75 0.75 0 0 1 13.72 15.97L17.25 19.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Reels joined on top",
      "tags": [
        "tape",
        "reels",
        "answering machine",
        "message"
      ],
      "note": "Rhythm: A's rings exactly — ⌀9 · 7 · 6, 2 · 2 · 2 apart, pitch 11 · 9 · 8, hole 6 · 4 · 3.5 — with the tape along the tops instead of the bottoms; ink 20×9 · 16×7 · 14×6, the same agreed box, box-centred. Filled: A's discs and hub holes, the tape on top at 1.5 · 1.5 · 1.25. Who: Fluent voicemail joins its reels along the top (y 9 on its 24 grid). A clearly different construction of the main picture, not a fifth metaphor: a speech bubble or a handset carrying the reels appears in none of the 36 sets on Iconify that draw voicemail. Reads closer to spectacles than to tape.",
      "box": {
        "16": [
          14,
          6
        ],
        "20": [
          16,
          7
        ],
        "24": [
          20,
          9
        ]
      },
      "masters": {
        "16": [
          "M1.625 8A2.375 2.375 0 1 0 6.375 8A2.375 2.375 0 1 0 1.625 8Z",
          "M9.625 8A2.375 2.375 0 1 0 14.375 8A2.375 2.375 0 1 0 9.625 8Z",
          "M4 5.625H12"
        ],
        "20": [
          "M2.75 10A2.75 2.75 0 1 0 8.25 10A2.75 2.75 0 1 0 2.75 10Z",
          "M11.75 10A2.75 2.75 0 1 0 17.25 10A2.75 2.75 0 1 0 11.75 10Z",
          "M5.5 7.25H14.5"
        ],
        "24": [
          "M2.75 12A3.75 3.75 0 1 0 10.25 12A3.75 3.75 0 1 0 2.75 12Z",
          "M13.75 12A3.75 3.75 0 1 0 21.25 12A3.75 3.75 0 1 0 13.75 12Z",
          "M6.5 8.25H17.5"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A3 3 0 1 0 7 8A3 3 0 1 0 1 8ZM3 8A1 1 0 1 0 5 8A1 1 0 1 0 3 8ZM9 8A3 3 0 1 0 15 8A3 3 0 1 0 9 8ZM11 8A1 1 0 1 0 13 8A1 1 0 1 0 11 8Z"
          ],
          "stroke": [
            "M4 5.625H12"
          ]
        },
        "20": {
          "fill": [
            "M2 10A3.5 3.5 0 1 0 9 10A3.5 3.5 0 1 0 2 10ZM4 10A1.5 1.5 0 1 0 7 10A1.5 1.5 0 1 0 4 10ZM11 10A3.5 3.5 0 1 0 18 10A3.5 3.5 0 1 0 11 10ZM13 10A1.5 1.5 0 1 0 16 10A1.5 1.5 0 1 0 13 10Z"
          ],
          "stroke": [
            "M5.5 7.25H14.5"
          ]
        },
        "24": {
          "fill": [
            "M2 12A4.5 4.5 0 1 0 11 12A4.5 4.5 0 1 0 2 12ZM5 12A1.5 1.5 0 1 0 8 12A1.5 1.5 0 1 0 5 12ZM13 12A4.5 4.5 0 1 0 22 12A4.5 4.5 0 1 0 13 12ZM16 12A1.5 1.5 0 1 0 19 12A1.5 1.5 0 1 0 16 12Z"
          ],
          "stroke": [
            "M6.5 8.25H17.5"
          ]
        }
      }
    }
  ]
};
