// cash - a banknote / cash payment (Commerce & Payments). The one thing it has to do is not be credit-card:
// same landscape keyline and the same frame where it is a single note (20x16 · 16x12 · 14x10, corners 2.5 · 2 · 1.5),
// so what tells them apart is the inside (a centre ring or oval where the card has a stripe and a bar), the corners,
// a second note behind, or a coin in front. Currency-neutral throughout: no $ candidate, because an S needs three bars
// and two 1.5 gaps (6.75 tall at 16) and the note's interior at 16 is 7.5 with 1.5 of air owed to each wall - it cannot
// hold §6. Polaris's six references are all a coin with a currency glyph; Lucide's banknote is a note with a ring and
// two dots; Nucleo a note with a stack of coins. Every path was generated from a few construction numbers per master by
// a throwaway script (scratchpad/cash/gen.mjs), so the ten share one construction. Checked with tools/draft-check.mjs.

export default {
  "concept": "cash",
  "context": "Cash payment, banknote, pay in cash, cash on delivery, cash drawer",
  "family": [
    "credit-card",
    "credit-card-3",
    "target",
    "mail",
    "briefcase"
  ],
  "question": "Which drawing reads as cash, and never as a credit card, at 16 beside credit-card and target?",
  "candidates": [
    {
      "id": "A",
      "label": "Note, ring",
      "tags": [
        "banknote",
        "ring"
      ],
      "note": "credit-card's frame exactly (ink 20x16 · 16x12 · 14x10, corners 2.5 · 2 · 1.5) with a centre ring instead of the stripe. Ring centreline r 3 · 2.25 · 1.625: ink ⌀ 7.5 · 6 · 4.5 (47 · 50 · 45% of the note's height), counter ⌀ 4.5 · 3 · 2. Air to the top and bottom walls 2.75 · 1.5 · 1.5, to the side walls 4.75 · 3.5 · 3.5; at 16 the ring is the largest that keeps 1.5 to both walls. Filled: solid note, the ring cut as a 1.5 slot on its centreline (target's cut), leaving a centre disc ⌀ 4.5 · 3 · 1.75 and 4.25 · 3 · 2.63 of note between the slot and the outer edge. Box-centred (recommended: the ring is the one mark a card never carries, it keeps its full 1.5 air at every master and still reads as a ring at 16 - it is the only construction here that holds the same drawing at all three masters with nothing removed)",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M6.375 8A1.625 1.625 0 1 0 9.625 8A1.625 1.625 0 1 0 6.375 8Z"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M7.75 10A2.25 2.25 0 1 0 12.25 10A2.25 2.25 0 1 0 7.75 10Z"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM5.625 8A2.375 2.375 0 1 0 10.375 8A2.375 2.375 0 1 0 5.625 8ZM7.125 8A0.875 0.875 0 1 0 8.875 8A0.875 0.875 0 1 0 7.125 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM7 10A3 3 0 1 0 13 10A3 3 0 1 0 7 10ZM8.5 10A1.5 1.5 0 1 0 11.5 10A1.5 1.5 0 1 0 8.5 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM8.25 12A3.75 3.75 0 1 0 15.75 12A3.75 3.75 0 1 0 8.25 12ZM9.75 12A2.25 2.25 0 1 0 14.25 12A2.25 2.25 0 1 0 9.75 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "Note, ring, corner dots",
      "tags": [
        "banknote",
        "ring",
        "dots"
      ],
      "note": "A plus two dots in opposite corners at 24: ⌀ 2 (r 0.25) at 6,8 and 18,16, 1.5 off both walls, 2.46 clear of the ring. At 20 and 16 the dots cannot stay: a dot 1.5 off both walls sits 4.47 · 3.81 from the centre, and even the smallest ring (⌀ 4.5 · 4, counter 1.5) needs 4.75 · 4.25, so they are removed and B is A at 20 and 16. Filled 24: the dots are holes ⌀ 2. Offered to show whether the dots are worth having at 24 alone",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M6.375 8A1.625 1.625 0 1 0 9.625 8A1.625 1.625 0 1 0 6.375 8Z"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M7.75 10A2.25 2.25 0 1 0 12.25 10A2.25 2.25 0 1 0 7.75 10Z"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12Z",
          "M5.75 8A0.25 0.25 0 1 0 6.25 8A0.25 0.25 0 1 0 5.75 8Z",
          "M17.75 16A0.25 0.25 0 1 0 18.25 16A0.25 0.25 0 1 0 17.75 16Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM5.625 8A2.375 2.375 0 1 0 10.375 8A2.375 2.375 0 1 0 5.625 8ZM7.125 8A0.875 0.875 0 1 0 8.875 8A0.875 0.875 0 1 0 7.125 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM7 10A3 3 0 1 0 13 10A3 3 0 1 0 7 10ZM8.5 10A1.5 1.5 0 1 0 11.5 10A1.5 1.5 0 1 0 8.5 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM8.25 12A3.75 3.75 0 1 0 15.75 12A3.75 3.75 0 1 0 8.25 12ZM9.75 12A2.25 2.25 0 1 0 14.25 12A2.25 2.25 0 1 0 9.75 12ZM5 8A1 1 0 1 0 7 8A1 1 0 1 0 5 8ZM17 16A1 1 0 1 0 19 16A1 1 0 1 0 17 16Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Note, ring, tight corners",
      "tags": [
        "banknote",
        "ring",
        "square corners"
      ],
      "note": "A with paper corners instead of the card's: centreline radius 1.5 · 1.25 · 1 (the proposed bend/detail radius; filled outer 2.25 · 2 · 1.625) against credit-card's 2.5 · 2 · 1.5. Same ring, same air as A. A note is paper and a card is moulded plastic; this puts that difference in the silhouette, not only the inside",
      "masters": {
        "16": [
          "M2.625 3.625H13.375A1 1 0 0 1 14.375 4.625V11.375A1 1 0 0 1 13.375 12.375H2.625A1 1 0 0 1 1.625 11.375V4.625A1 1 0 0 1 2.625 3.625Z",
          "M6.375 8A1.625 1.625 0 1 0 9.625 8A1.625 1.625 0 1 0 6.375 8Z"
        ],
        "20": [
          "M4 4.75H16A1.25 1.25 0 0 1 17.25 6V14A1.25 1.25 0 0 1 16 15.25H4A1.25 1.25 0 0 1 2.75 14V6A1.25 1.25 0 0 1 4 4.75Z",
          "M7.75 10A2.25 2.25 0 1 0 12.25 10A2.25 2.25 0 1 0 7.75 10Z"
        ],
        "24": [
          "M4.25 4.75H19.75A1.5 1.5 0 0 1 21.25 6.25V17.75A1.5 1.5 0 0 1 19.75 19.25H4.25A1.5 1.5 0 0 1 2.75 17.75V6.25A1.5 1.5 0 0 1 4.25 4.75Z",
          "M9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2.625 3H13.375A1.625 1.625 0 0 1 15 4.625V11.375A1.625 1.625 0 0 1 13.375 13H2.625A1.625 1.625 0 0 1 1 11.375V4.625A1.625 1.625 0 0 1 2.625 3ZM5.625 8A2.375 2.375 0 1 0 10.375 8A2.375 2.375 0 1 0 5.625 8ZM7.125 8A0.875 0.875 0 1 0 8.875 8A0.875 0.875 0 1 0 7.125 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4 4H16A2 2 0 0 1 18 6V14A2 2 0 0 1 16 16H4A2 2 0 0 1 2 14V6A2 2 0 0 1 4 4ZM7 10A3 3 0 1 0 13 10A3 3 0 1 0 7 10ZM8.5 10A1.5 1.5 0 1 0 11.5 10A1.5 1.5 0 1 0 8.5 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M4.25 4H19.75A2.25 2.25 0 0 1 22 6.25V17.75A2.25 2.25 0 0 1 19.75 20H4.25A2.25 2.25 0 0 1 2 17.75V6.25A2.25 2.25 0 0 1 4.25 4ZM8.25 12A3.75 3.75 0 1 0 15.75 12A3.75 3.75 0 1 0 8.25 12ZM9.75 12A2.25 2.25 0 1 0 14.25 12A2.25 2.25 0 1 0 9.75 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Note, oval",
      "tags": [
        "banknote",
        "oval"
      ],
      "note": "The banknote's portrait oval instead of a ring. Oval ink 10x7.5 · 8x6 · 6.5x4.5 (rx 4.25 · 3.25 · 2.625, ry 3 · 2.25 · 1.625), counter 7x4.5 · 5x3 · 4x2. Air to top and bottom 2.75 · 1.5 · 1.5, to the sides 3.5 · 2.5 · 2.5. Frame as A. Filled: 1.5 slot on the oval's centreline, centre oval 7x4.5 · 5x3 · 3.75x1.75 left solid. Wider than the ring, so it fills the landscape interior more evenly; nearer an engraved note, further from a coin",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M5.375 8A2.625 1.625 0 1 0 10.625 8A2.625 1.625 0 1 0 5.375 8Z"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M6.75 10A3.25 2.25 0 1 0 13.25 10A3.25 2.25 0 1 0 6.75 10Z"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M7.75 12A4.25 3 0 1 0 16.25 12A4.25 3 0 1 0 7.75 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM4.625 8A3.375 2.375 0 1 0 11.375 8A3.375 2.375 0 1 0 4.625 8ZM6.125 8A1.875 0.875 0 1 0 9.875 8A1.875 0.875 0 1 0 6.125 8Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM6 10A4 3 0 1 0 14 10A4 3 0 1 0 6 10ZM7.5 10A2.5 1.5 0 1 0 12.5 10A2.5 1.5 0 1 0 7.5 10Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM7 12A5 3.75 0 1 0 17 12A5 3.75 0 1 0 7 12ZM8.5 12A3.5 2.25 0 1 0 15.5 12A3.5 2.25 0 1 0 8.5 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Stacked, back edge",
      "tags": [
        "stack",
        "banknote"
      ],
      "note": "A second note behind, shown only as its straight top edge: a line on y 4.75 · 4.75 · 3.625 running between that note's corner tangents (ink 15 · 12 · 11 long), 1.5 above the front note. Front note ink 20x13 · 16x9 · 14x7.25, card corners. Its mark: a ring r 2.75 (ink ⌀ 7, 1.5 air above and below) at 24; at 20 and 16 the interior is only 6 · 4.75 tall and a ring with a 1.5 counter needs 7.5 · 7, so the mark becomes a solid disc ⌀ 3 · 1.75 (credit-card-3's dot is 2.5 · 1.5), 1.5 clear of the walls. Filled: front note solid, the mark cut as a slot at 24 and a hole at 20 and 16; the back edge stays a line at 1.5 · 1.5 · 1.25. Says 'more than one' - payouts, cash drawer - but the 16 carries only a dot",
      "masters": {
        "16": [
          "M3.125 6.375H12.875A1.5 1.5 0 0 1 14.375 7.875V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V7.875A1.5 1.5 0 0 1 3.125 6.375Z",
          "M3.125 3.625H12.875",
          "M7.75 9.375A0.25 0.25 0 1 0 8.25 9.375A0.25 0.25 0 1 0 7.75 9.375Z"
        ],
        "20": [
          "M4.75 7.75H15.25A2 2 0 0 1 17.25 9.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V9.75A2 2 0 0 1 4.75 7.75Z",
          "M4.75 4.75H15.25",
          "M9.25 11.5A0.75 0.75 0 1 0 10.75 11.5A0.75 0.75 0 1 0 9.25 11.5Z"
        ],
        "24": [
          "M5.25 7.75H18.75A2.5 2.5 0 0 1 21.25 10.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V10.25A2.5 2.5 0 0 1 5.25 7.75Z",
          "M5.25 4.75H18.75",
          "M9.25 13.5A2.75 2.75 0 1 0 14.75 13.5A2.75 2.75 0 1 0 9.25 13.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 5.75H12.875A2.125 2.125 0 0 1 15 7.875V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V7.875A2.125 2.125 0 0 1 3.125 5.75ZM7.125 9.375A0.875 0.875 0 1 0 8.875 9.375A0.875 0.875 0 1 0 7.125 9.375Z"
          ],
          "stroke": [
            "M3.125 3.625H12.875"
          ]
        },
        "20": {
          "fill": [
            "M4.75 7H15.25A2.75 2.75 0 0 1 18 9.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V9.75A2.75 2.75 0 0 1 4.75 7ZM8.5 11.5A1.5 1.5 0 1 0 11.5 11.5A1.5 1.5 0 1 0 8.5 11.5Z"
          ],
          "stroke": [
            "M4.75 4.75H15.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 7H18.75A3.25 3.25 0 0 1 22 10.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V10.25A3.25 3.25 0 0 1 5.25 7ZM8.5 13.5A3.5 3.5 0 1 0 15.5 13.5A3.5 3.5 0 1 0 8.5 13.5ZM10 13.5A2 2 0 1 0 14 13.5A2 2 0 1 0 10 13.5Z"
          ],
          "stroke": [
            "M5.25 4.75H18.75"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Stacked, offset note",
      "tags": [
        "stack",
        "offset"
      ],
      "note": "A second note behind, offset up and left by one stroke plus the gap (3 · 3 · 2.75): only its top edge and left wall show, as an L with its one corner (card radius), both ends stopping at the corner tangents where it would otherwise run into the front note; 1.5 clear of it on both sides. Front note ink 17x13 · 13x9 · 11.25x7.25. Mark as E: ring r 2.75 at 24, disc ⌀ 3 · 1.75 at 20 · 16. Filled: front note solid with the mark cut, the L a line at the outline weight. At 16 the two offset frames read close to copy / duplicate - look at it in the At 16 strip",
      "masters": {
        "16": [
          "M5.875 6.375H12.875A1.5 1.5 0 0 1 14.375 7.875V10.875A1.5 1.5 0 0 1 12.875 12.375H5.875A1.5 1.5 0 0 1 4.375 10.875V7.875A1.5 1.5 0 0 1 5.875 6.375Z",
          "M1.625 8.125V5.125A1.5 1.5 0 0 1 3.125 3.625H10.125",
          "M9.125 9.375A0.25 0.25 0 1 0 9.625 9.375A0.25 0.25 0 1 0 9.125 9.375Z"
        ],
        "20": [
          "M7.75 7.75H15.25A2 2 0 0 1 17.25 9.75V13.25A2 2 0 0 1 15.25 15.25H7.75A2 2 0 0 1 5.75 13.25V9.75A2 2 0 0 1 7.75 7.75Z",
          "M2.75 10.25V6.75A2 2 0 0 1 4.75 4.75H12.25",
          "M10.75 11.5A0.75 0.75 0 1 0 12.25 11.5A0.75 0.75 0 1 0 10.75 11.5Z"
        ],
        "24": [
          "M8.25 7.75H18.75A2.5 2.5 0 0 1 21.25 10.25V16.75A2.5 2.5 0 0 1 18.75 19.25H8.25A2.5 2.5 0 0 1 5.75 16.75V10.25A2.5 2.5 0 0 1 8.25 7.75Z",
          "M2.75 13.75V7.25A2.5 2.5 0 0 1 5.25 4.75H15.75",
          "M10.75 13.5A2.75 2.75 0 1 0 16.25 13.5A2.75 2.75 0 1 0 10.75 13.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.875 5.75H12.875A2.125 2.125 0 0 1 15 7.875V10.875A2.125 2.125 0 0 1 12.875 13H5.875A2.125 2.125 0 0 1 3.75 10.875V7.875A2.125 2.125 0 0 1 5.875 5.75ZM8.5 9.375A0.875 0.875 0 1 0 10.25 9.375A0.875 0.875 0 1 0 8.5 9.375Z"
          ],
          "stroke": [
            "M1.625 8.125V5.125A1.5 1.5 0 0 1 3.125 3.625H10.125"
          ]
        },
        "20": {
          "fill": [
            "M7.75 7H15.25A2.75 2.75 0 0 1 18 9.75V13.25A2.75 2.75 0 0 1 15.25 16H7.75A2.75 2.75 0 0 1 5 13.25V9.75A2.75 2.75 0 0 1 7.75 7ZM10 11.5A1.5 1.5 0 1 0 13 11.5A1.5 1.5 0 1 0 10 11.5Z"
          ],
          "stroke": [
            "M2.75 10.25V6.75A2 2 0 0 1 4.75 4.75H12.25"
          ]
        },
        "24": {
          "fill": [
            "M8.25 7H18.75A3.25 3.25 0 0 1 22 10.25V16.75A3.25 3.25 0 0 1 18.75 20H8.25A3.25 3.25 0 0 1 5 16.75V10.25A3.25 3.25 0 0 1 8.25 7ZM10 13.5A3.5 3.5 0 1 0 17 13.5A3.5 3.5 0 1 0 10 13.5ZM11.5 13.5A2 2 0 1 0 15.5 13.5A2 2 0 1 0 11.5 13.5Z"
          ],
          "stroke": [
            "M2.75 13.75V7.25A2.5 2.5 0 0 1 5.25 4.75H15.75"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "Coin in front, corner",
      "tags": [
        "coin",
        "banknote"
      ],
      "note": "A plain note top-left (ink 17x12 · 13x9 · 11x7, card corners) with a coin over its bottom-right corner: coin ink ⌀ 9 · 6 · 5 (centreline r 3.75 · 2.25 · 1.875, counter 6 · 3 · 2.5), sitting in the box's bottom-right. The note's walls stop where their round caps are 1.5 clear of the coin (measured 1.54 / 1.50 · 1.55 / 1.55 · 1.51 / 1.51), so the note reads as behind. Filled: the coin a solid disc, the note solid and cut back by a circle 1.5 outside the coin's edge; that arc's ends are the circle's own intersections with the note's edges, so they sit off the grid (9.69, 11.52 at 24; 8.5, 10.5 at 20; 6.531, 8.531 at 16). Note and coin together say cash without a currency sign",
      "masters": {
        "16": [
          "M8 9.375H3.125A1.5 1.5 0 0 1 1.625 7.875V5.125A1.5 1.5 0 0 1 3.125 3.625H9.875A1.5 1.5 0 0 1 11.375 5.125V6",
          "M10.625 10.5A1.875 1.875 0 1 0 14.375 10.5A1.875 1.875 0 1 0 10.625 10.5Z"
        ],
        "20": [
          "M9.75 12.25H4.75A2 2 0 0 1 2.75 10.25V6.75A2 2 0 0 1 4.75 4.75H12.25A2 2 0 0 1 14.25 6.75V7.75",
          "M12.75 13A2.25 2.25 0 1 0 17.25 13A2.25 2.25 0 1 0 12.75 13Z"
        ],
        "24": [
          "M10.75 15.25H5.25A2.5 2.5 0 0 1 2.75 12.75V7.25A2.5 2.5 0 0 1 5.25 4.75H15.75A2.5 2.5 0 0 1 18.25 7.25V8.75",
          "M13.75 15.5A3.75 3.75 0 1 0 21.25 15.5A3.75 3.75 0 1 0 13.75 15.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M8.531 10H3.125A2.125 2.125 0 0 1 1 7.875V5.125A2.125 2.125 0 0 1 3.125 3H9.875A2.125 2.125 0 0 1 12 5.125V6.531A4 4 0 0 0 8.531 10Z",
            "M10 10.5A2.5 2.5 0 1 0 15 10.5A2.5 2.5 0 1 0 10 10.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M10.5 13H4.75A2.75 2.75 0 0 1 2 10.25V6.75A2.75 2.75 0 0 1 4.75 4H12.25A2.75 2.75 0 0 1 15 6.75V8.5A4.5 4.5 0 0 0 10.5 13Z",
            "M12 13A3 3 0 1 0 18 13A3 3 0 1 0 12 13Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M11.52 16H5.25A3.25 3.25 0 0 1 2 12.75V7.25A3.25 3.25 0 0 1 5.25 4H15.75A3.25 3.25 0 0 1 19 7.25V9.69A6 6 0 0 0 11.52 16Z",
            "M13 15.5A4.5 4.5 0 1 0 22 15.5A4.5 4.5 0 1 0 13 15.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "H",
      "label": "Coin in front, wide note",
      "tags": [
        "coin",
        "wide"
      ],
      "note": "G with the note running the full width (ink 20x11.5 · 16x8.5 · 14x7) and the coin (same ⌀ 9 · 6 · 5) tucked under its right end, flush with the box's right edge, so more of the note shows and its top-right corner stays whole. Wall ends 1.61 / 1.54 · 1.51 / 1.65 · 1.52 / 1.51 clear of the coin. Filled as G (arc ends 11.53, 11.5 · 9.65, 10.53 · 7.378, 8.531, off grid for the same reason). A lower, wider note than G - nearer a banknote's proportion",
      "masters": {
        "16": [
          "M8 9.375H3.125A1.5 1.5 0 0 1 1.625 7.875V5.125A1.5 1.5 0 0 1 3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V6.25",
          "M10.625 10.5A1.875 1.875 0 1 0 14.375 10.5A1.875 1.875 0 1 0 10.625 10.5Z"
        ],
        "20": [
          "M9.75 11.75H4.75A2 2 0 0 1 2.75 9.75V6.75A2 2 0 0 1 4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V8.25",
          "M12.75 13A2.25 2.25 0 1 0 17.25 13A2.25 2.25 0 1 0 12.75 13Z"
        ],
        "24": [
          "M10.75 14.75H5.25A2.5 2.5 0 0 1 2.75 12.25V7.25A2.5 2.5 0 0 1 5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V9.75",
          "M13.75 15.5A3.75 3.75 0 1 0 21.25 15.5A3.75 3.75 0 1 0 13.75 15.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M8.531 10H3.125A2.125 2.125 0 0 1 1 7.875V5.125A2.125 2.125 0 0 1 3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V7.378A4 4 0 0 0 8.531 10Z",
            "M10 10.5A2.5 2.5 0 1 0 15 10.5A2.5 2.5 0 1 0 10 10.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M10.53 12.5H4.75A2.75 2.75 0 0 1 2 9.75V6.75A2.75 2.75 0 0 1 4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V9.65A4.5 4.5 0 0 0 10.53 12.5Z",
            "M12 13A3 3 0 1 0 18 13A3 3 0 1 0 12 13Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M11.5 15.5H5.25A3.25 3.25 0 0 1 2 12.25V7.25A3.25 3.25 0 0 1 5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V11.53A6 6 0 0 0 11.5 15.5Z",
            "M13 15.5A4.5 4.5 0 1 0 22 15.5A4.5 4.5 0 1 0 13 15.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "I",
      "label": "Note, corner dots",
      "tags": [
        "banknote",
        "dots"
      ],
      "note": "credit-card's frame with only two dots in opposite corners, no centre mark: dots ⌀ 2 · 2 · 1.5 at 6,8 / 18,16 · 6,8 / 14,12 · 4.5,6.5 / 11.5,9.5, each 1.5 off both walls. Filled: dots as holes of the same size. The corner-dots answer to 'what is on a note', kept for comparison; with nothing in the middle it reads closest to a card or a screen at 16",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M4.375 6.5A0.125 0.125 0 1 0 4.625 6.5A0.125 0.125 0 1 0 4.375 6.5Z",
          "M11.375 9.5A0.125 0.125 0 1 0 11.625 9.5A0.125 0.125 0 1 0 11.375 9.5Z"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M5.75 8A0.25 0.25 0 1 0 6.25 8A0.25 0.25 0 1 0 5.75 8Z",
          "M13.75 12A0.25 0.25 0 1 0 14.25 12A0.25 0.25 0 1 0 13.75 12Z"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M5.75 8A0.25 0.25 0 1 0 6.25 8A0.25 0.25 0 1 0 5.75 8Z",
          "M17.75 16A0.25 0.25 0 1 0 18.25 16A0.25 0.25 0 1 0 17.75 16Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM3.75 6.5A0.75 0.75 0 1 0 5.25 6.5A0.75 0.75 0 1 0 3.75 6.5ZM10.75 9.5A0.75 0.75 0 1 0 12.25 9.5A0.75 0.75 0 1 0 10.75 9.5Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM5 8A1 1 0 1 0 7 8A1 1 0 1 0 5 8ZM13 12A1 1 0 1 0 15 12A1 1 0 1 0 13 12Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM5 8A1 1 0 1 0 7 8A1 1 0 1 0 5 8ZM17 16A1 1 0 1 0 19 16A1 1 0 1 0 17 16Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "J",
      "label": "Banded bundle",
      "tags": [
        "bundle",
        "band",
        "stack"
      ],
      "note": "E's back edge and front note (ink 20x13 · 16x9 · 14x7.25) with a paper band round the middle instead of a mark: two lines from wall to wall, centrelines 4.5 · 3 · 2.75 apart (air between them 3 · 1.5 · 1.5). Filled: the band's two lines cut as 1.5 slots between the walls' inner edges, corners 0.5 (credit-card's slot corner); the back edge stays a line. A bundle of notes, cash in quantity; at 16 the outline can read as columns and the filled as a pause sign",
      "masters": {
        "16": [
          "M3.125 3.625H12.875",
          "M3.125 6.375H12.875A1.5 1.5 0 0 1 14.375 7.875V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V7.875A1.5 1.5 0 0 1 3.125 6.375Z",
          "M6.625 6.375V12.375",
          "M9.375 6.375V12.375"
        ],
        "20": [
          "M4.75 4.75H15.25",
          "M4.75 7.75H15.25A2 2 0 0 1 17.25 9.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V9.75A2 2 0 0 1 4.75 7.75Z",
          "M8.5 7.75V15.25",
          "M11.5 7.75V15.25"
        ],
        "24": [
          "M5.25 4.75H18.75",
          "M5.25 7.75H18.75A2.5 2.5 0 0 1 21.25 10.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V10.25A2.5 2.5 0 0 1 5.25 7.75Z",
          "M9.75 7.75V19.25",
          "M14.25 7.75V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 5.75H12.875A2.125 2.125 0 0 1 15 7.875V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V7.875A2.125 2.125 0 0 1 3.125 5.75ZM5.875 7.5A0.5 0.5 0 0 1 6.375 7H6.875A0.5 0.5 0 0 1 7.375 7.5V11.25A0.5 0.5 0 0 1 6.875 11.75H6.375A0.5 0.5 0 0 1 5.875 11.25ZM8.625 7.5A0.5 0.5 0 0 1 9.125 7H9.625A0.5 0.5 0 0 1 10.125 7.5V11.25A0.5 0.5 0 0 1 9.625 11.75H9.125A0.5 0.5 0 0 1 8.625 11.25Z"
          ],
          "stroke": [
            "M3.125 3.625H12.875"
          ]
        },
        "20": {
          "fill": [
            "M4.75 7H15.25A2.75 2.75 0 0 1 18 9.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V9.75A2.75 2.75 0 0 1 4.75 7ZM7.75 9A0.5 0.5 0 0 1 8.25 8.5H8.75A0.5 0.5 0 0 1 9.25 9V14A0.5 0.5 0 0 1 8.75 14.5H8.25A0.5 0.5 0 0 1 7.75 14ZM10.75 9A0.5 0.5 0 0 1 11.25 8.5H11.75A0.5 0.5 0 0 1 12.25 9V14A0.5 0.5 0 0 1 11.75 14.5H11.25A0.5 0.5 0 0 1 10.75 14Z"
          ],
          "stroke": [
            "M4.75 4.75H15.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 7H18.75A3.25 3.25 0 0 1 22 10.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V10.25A3.25 3.25 0 0 1 5.25 7ZM9 9A0.5 0.5 0 0 1 9.5 8.5H10A0.5 0.5 0 0 1 10.5 9V18A0.5 0.5 0 0 1 10 18.5H9.5A0.5 0.5 0 0 1 9 18ZM13.5 9A0.5 0.5 0 0 1 14 8.5H14.5A0.5 0.5 0 0 1 15 9V18A0.5 0.5 0 0 1 14.5 18.5H14A0.5 0.5 0 0 1 13.5 18Z"
          ],
          "stroke": [
            "M5.25 4.75H18.75"
          ]
        }
      }
    }
  ]
};
