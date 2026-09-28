// wallet - stored funds, balance, payment methods (Commerce & Payments). It sits in the same menus as credit-card
// (card + full-width stripe + bar) and cash (back-note line + note + centred dot), all on the same landscape body, so
// the clasp is the only thing that can make it read as a wallet at 16 - and it must not be a stripe or a floating
// top line. Every candidate keeps credit-card's body: landscape keyline 20x16 · 16x12 · 14x10, corners r2.5 · 2 · 1.5
// (filled outer 3.25 · 2.75 · 2.125), strokes 1.5 · 1.5 · 1.25, dots at credit-card-3's sizes (3 · 2.5 · 1.5 across).
// Ten constructions across the real choices: a side tab (standing proud of the wall, flush in it, square-ended, or
// carrying a snap), a nub in the silhouette, a back panel joined by a roll or a raised corner, a card peeking out, a
// strap from the top. A snap dot inside a tab needs 8.5 · 7 of tab height at 20 · 16 and the body gives 9 · 7.5, so
// wherever it cannot keep 1.5 of air the dot goes, not the gap. Filled: shapes solid; a tab's inside is knocked out
// at its own size (home's door rule), dots knocked out, back edges and a peeking card stay lines at the outline weight
// (cash's rule). Generated from a spec per master by a throwaway script (scratchpad wallet/gen.mjs).
// Checked with tools/draft-check.mjs: 10 clean, no warnings.
export default {
  "concept": "wallet",
  "context": "Wallet, balance, stored funds, payment methods, top up",
  "family": [
    "credit-card",
    "credit-card-2",
    "credit-card-3",
    "cash"
  ],
  "question": "Which clasp makes wallet read at 16 beside credit-card and cash - a side tab (proud, flush, square or with a snap), a nub, a back panel, a peeking card or a strap?",
  "candidates": [
    {
      "id": "A",
      "label": "Proud tab",
      "tags": [
        "tab",
        "pocket",
        "proud"
      ],
      "note": "A round-ended tab on the right that stands 1 proud of the body, the wall broken where it passes, so the silhouette itself steps out: nothing else in the set has that edge, and there is no stripe and no top line. Body right wall at x 20.25 · 16.25 · 13.375 (outer edges on whole units), tab ink 7.5x6 · 6.5x5.5 · 5.5x4, air inside 3 · 2.5 · 1.5 tall, 3.5 · 1.75 · 1.75 clear of the top and bottom walls; tab corners r1 · 1 · 0.875, round end r2.25 · 2 · 1.375. Filled: body solid, the tab's inside knocked out as a slot 3 · 2.5 · 1.5 tall. (recommended) - the only construction whose 16 differs from credit-card and cash in outline, filled and silhouette at once, and it holds the same drawing at all three masters",
      "masters": {
        "16": [
          "M13.375 6.625V5.125A1.5 1.5 0 0 0 11.875 3.625H3.125A1.5 1.5 0 0 0 1.625 5.125V10.875A1.5 1.5 0 0 0 3.125 12.375H11.875A1.5 1.5 0 0 0 13.375 10.875V9.375",
          "M11.5 6.625H13.5A0.875 0.875 0 0 1 14.375 7.5V8.5A0.875 0.875 0 0 1 13.5 9.375H11.5A1.375 1.375 0 0 1 11.5 6.625Z"
        ],
        "20": [
          "M16.25 8V6.75A2 2 0 0 0 14.25 4.75H4.75A2 2 0 0 0 2.75 6.75V13.25A2 2 0 0 0 4.75 15.25H14.25A2 2 0 0 0 16.25 13.25V12",
          "M14.25 8H16.25A1 1 0 0 1 17.25 9V11A1 1 0 0 1 16.25 12H14.25A2 2 0 0 1 14.25 8Z"
        ],
        "24": [
          "M20.25 9.75V7.25A2.5 2.5 0 0 0 17.75 4.75H5.25A2.5 2.5 0 0 0 2.75 7.25V16.75A2.5 2.5 0 0 0 5.25 19.25H17.75A2.5 2.5 0 0 0 20.25 16.75V14.25",
          "M17.5 9.75H20.25A1 1 0 0 1 21.25 10.75V13.25A1 1 0 0 1 20.25 14.25H17.5A2.25 2.25 0 0 1 17.5 9.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H11.875A2.125 2.125 0 0 1 14 5.125V10.875A2.125 2.125 0 0 1 11.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM11.5 7.25H13.5A0.25 0.25 0 0 1 13.75 7.5V8.5A0.25 0.25 0 0 1 13.5 8.75H11.5A0.75 0.75 0 0 1 11.5 7.25Z",
            "M11.5 6H13.5A1.5 1.5 0 0 1 15 7.5V8.5A1.5 1.5 0 0 1 13.5 10H11.5A2 2 0 0 1 11.5 6ZM11.5 7.25H13.5A0.25 0.25 0 0 1 13.75 7.5V8.5A0.25 0.25 0 0 1 13.5 8.75H11.5A0.75 0.75 0 0 1 11.5 7.25Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H14.25A2.75 2.75 0 0 1 17 6.75V13.25A2.75 2.75 0 0 1 14.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM14.25 8.75H16.25A0.25 0.25 0 0 1 16.5 9V11A0.25 0.25 0 0 1 16.25 11.25H14.25A1.25 1.25 0 0 1 14.25 8.75Z",
            "M14.25 7.25H16.25A1.75 1.75 0 0 1 18 9V11A1.75 1.75 0 0 1 16.25 12.75H14.25A2.75 2.75 0 0 1 14.25 7.25ZM14.25 8.75H16.25A0.25 0.25 0 0 1 16.5 9V11A0.25 0.25 0 0 1 16.25 11.25H14.25A1.25 1.25 0 0 1 14.25 8.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H17.75A3.25 3.25 0 0 1 21 7.25V16.75A3.25 3.25 0 0 1 17.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM17.5 10.5H20.25A0.25 0.25 0 0 1 20.5 10.75V13.25A0.25 0.25 0 0 1 20.25 13.5H17.5A1.5 1.5 0 0 1 17.5 10.5Z",
            "M17.5 9H20.25A1.75 1.75 0 0 1 22 10.75V13.25A1.75 1.75 0 0 1 20.25 15H17.5A3 3 0 0 1 17.5 9ZM17.5 10.5H20.25A0.25 0.25 0 0 1 20.5 10.75V13.25A0.25 0.25 0 0 1 20.25 13.5H17.5A1.5 1.5 0 0 1 17.5 10.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "Flush tab",
      "tags": [
        "tab",
        "pocket",
        "flush"
      ],
      "note": "The same tab as A drawn inside the body as a D whose right side is the wall itself, so the card silhouette is untouched. Same heights and gaps as A (air 3 · 2.5 · 1.5, 3.5 · 1.75 · 1.75 to the walls), round end r2.25 · 2 · 1.375, reaching 6 · 5 · 4.25 in from the wall's centreline. Filled: card solid, the D knocked out, its corners at the wall r0.5 (credit-card's cut corners). Quieter than A; at 16 it keeps credit-card's outline exactly, so the small D alone has to say wallet",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M14.375 6.625H11.5A1.375 1.375 0 0 0 11.5 9.375H14.375"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M17.25 8H14.25A2 2 0 0 0 14.25 12H17.25"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M21.25 9.75H17.5A2.25 2.25 0 0 0 17.5 14.25H21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM11.5 7.25H13.25A0.5 0.5 0 0 1 13.75 7.75V8.25A0.5 0.5 0 0 1 13.25 8.75H11.5A0.75 0.75 0 0 1 11.5 7.25Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM14.25 8.75H16A0.5 0.5 0 0 1 16.5 9.25V10.75A0.5 0.5 0 0 1 16 11.25H14.25A1.25 1.25 0 0 1 14.25 8.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM17.5 10.5H20A0.5 0.5 0 0 1 20.5 11V13A0.5 0.5 0 0 1 20 13.5H17.5A1.5 1.5 0 0 1 17.5 10.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "C",
      "label": "Proud tab, square end",
      "tags": [
        "tab",
        "square",
        "proud"
      ],
      "note": "A's proud tab with a square end: a small rounded box, corners r1 · 1 · 0.875 all round, instead of the pill's round end. Same box as A (ink 7.5x6 · 6.5x5.5 · 5.5x4, air 3 · 2.5 · 1.5 tall, stands 1 proud). Tighter radii, closer to a stitched leather pocket; the round end in A reads softer. Filled: body solid, the box's inside knocked out with corners r0.25",
      "masters": {
        "16": [
          "M13.375 6.625V5.125A1.5 1.5 0 0 0 11.875 3.625H3.125A1.5 1.5 0 0 0 1.625 5.125V10.875A1.5 1.5 0 0 0 3.125 12.375H11.875A1.5 1.5 0 0 0 13.375 10.875V9.375",
          "M11 6.625H13.5A0.875 0.875 0 0 1 14.375 7.5V8.5A0.875 0.875 0 0 1 13.5 9.375H11A0.875 0.875 0 0 1 10.125 8.5V7.5A0.875 0.875 0 0 1 11 6.625Z"
        ],
        "20": [
          "M16.25 8V6.75A2 2 0 0 0 14.25 4.75H4.75A2 2 0 0 0 2.75 6.75V13.25A2 2 0 0 0 4.75 15.25H14.25A2 2 0 0 0 16.25 13.25V12",
          "M13.25 8H16.25A1 1 0 0 1 17.25 9V11A1 1 0 0 1 16.25 12H13.25A1 1 0 0 1 12.25 11V9A1 1 0 0 1 13.25 8Z"
        ],
        "24": [
          "M20.25 9.75V7.25A2.5 2.5 0 0 0 17.75 4.75H5.25A2.5 2.5 0 0 0 2.75 7.25V16.75A2.5 2.5 0 0 0 5.25 19.25H17.75A2.5 2.5 0 0 0 20.25 16.75V14.25",
          "M16.25 9.75H20.25A1 1 0 0 1 21.25 10.75V13.25A1 1 0 0 1 20.25 14.25H16.25A1 1 0 0 1 15.25 13.25V10.75A1 1 0 0 1 16.25 9.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H11.875A2.125 2.125 0 0 1 14 5.125V10.875A2.125 2.125 0 0 1 11.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM11 7.25H13.5A0.25 0.25 0 0 1 13.75 7.5V8.5A0.25 0.25 0 0 1 13.5 8.75H11A0.25 0.25 0 0 1 10.75 8.5V7.5A0.25 0.25 0 0 1 11 7.25Z",
            "M11 6H13.5A1.5 1.5 0 0 1 15 7.5V8.5A1.5 1.5 0 0 1 13.5 10H11A1.5 1.5 0 0 1 9.5 8.5V7.5A1.5 1.5 0 0 1 11 6ZM11 7.25H13.5A0.25 0.25 0 0 1 13.75 7.5V8.5A0.25 0.25 0 0 1 13.5 8.75H11A0.25 0.25 0 0 1 10.75 8.5V7.5A0.25 0.25 0 0 1 11 7.25Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H14.25A2.75 2.75 0 0 1 17 6.75V13.25A2.75 2.75 0 0 1 14.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM13.25 8.75H16.25A0.25 0.25 0 0 1 16.5 9V11A0.25 0.25 0 0 1 16.25 11.25H13.25A0.25 0.25 0 0 1 13 11V9A0.25 0.25 0 0 1 13.25 8.75Z",
            "M13.25 7.25H16.25A1.75 1.75 0 0 1 18 9V11A1.75 1.75 0 0 1 16.25 12.75H13.25A1.75 1.75 0 0 1 11.5 11V9A1.75 1.75 0 0 1 13.25 7.25ZM13.25 8.75H16.25A0.25 0.25 0 0 1 16.5 9V11A0.25 0.25 0 0 1 16.25 11.25H13.25A0.25 0.25 0 0 1 13 11V9A0.25 0.25 0 0 1 13.25 8.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H17.75A3.25 3.25 0 0 1 21 7.25V16.75A3.25 3.25 0 0 1 17.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM16.25 10.5H20.25A0.25 0.25 0 0 1 20.5 10.75V13.25A0.25 0.25 0 0 1 20.25 13.5H16.25A0.25 0.25 0 0 1 16 13.25V10.75A0.25 0.25 0 0 1 16.25 10.5Z",
            "M16.25 9H20.25A1.75 1.75 0 0 1 22 10.75V13.25A1.75 1.75 0 0 1 20.25 15H16.25A1.75 1.75 0 0 1 14.5 13.25V10.75A1.75 1.75 0 0 1 16.25 9ZM16.25 10.5H20.25A0.25 0.25 0 0 1 20.5 10.75V13.25A0.25 0.25 0 0 1 20.25 13.5H16.25A0.25 0.25 0 0 1 16 13.25V10.75A0.25 0.25 0 0 1 16.25 10.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Snap tab",
      "tags": [
        "tab",
        "snap",
        "flush"
      ],
      "note": "The classic tab with a snap - at 24 only. 24: a flush D tab 9 tall (ink 7.5 to 16.5, 2 clear of each wall), its round end r3.75 centred on a dot 3 across, 1.5 of air all round the dot and 1.5 from the dot to the wall. At 20 and 16 the dot cannot fit: tab + dot need 8.5 · 7 of height and the body gives 9 · 7.5, 0.25 a side, so the dot goes and the tab is B's. Filled 24: the D knocked out with the dot left standing in it as a 3-across island; 20 and 16 as B",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M14.375 6.625H11.5A1.375 1.375 0 0 0 11.5 9.375H14.375"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M17.25 8H14.25A2 2 0 0 0 14.25 12H17.25"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M21.25 8.25H17.5A3.75 3.75 0 0 0 17.5 15.75H21.25",
          "M16.75 12A0.75 0.75 0 1 0 18.25 12A0.75 0.75 0 1 0 16.75 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM11.5 7.25H13.25A0.5 0.5 0 0 1 13.75 7.75V8.25A0.5 0.5 0 0 1 13.25 8.75H11.5A0.75 0.75 0 0 1 11.5 7.25Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM14.25 8.75H16A0.5 0.5 0 0 1 16.5 9.25V10.75A0.5 0.5 0 0 1 16 11.25H14.25A1.25 1.25 0 0 1 14.25 8.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM17.5 9H20A0.5 0.5 0 0 1 20.5 9.5V14.5A0.5 0.5 0 0 1 20 15H17.5A3 3 0 0 1 17.5 9ZM16 12A1.5 1.5 0 1 0 19 12A1.5 1.5 0 1 0 16 12Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "E",
      "label": "Nub and snap",
      "tags": [
        "nub",
        "snap"
      ],
      "note": "No tab lines at all: one continuous outline whose right wall steps out 1 for 5.5 · 4 · 3 of its height (centreline, corners r1), and a snap dot 3 · 2.5 · 1.5 across just inside it at x 17.5 · 13.25 · 10.875, at least 1.5 clear of the step's corners and 1.5 · 2 · 2.125 from its inside edge. The lightest drawing here. Risk: a nub on the middle of the right side is also a battery's terminal - the dot is what keeps it a wallet. Filled: silhouette solid, dot knocked out",
      "masters": {
        "16": [
          "M3.125 3.625H11.875A1.5 1.5 0 0 1 13.375 5.125V6.5A1 1 0 0 1 14.375 7.5V8.5A1 1 0 0 1 13.375 9.5V10.875A1.5 1.5 0 0 1 11.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M10.75 8A0.125 0.125 0 1 0 11 8A0.125 0.125 0 1 0 10.75 8Z"
        ],
        "20": [
          "M4.75 4.75H14.25A2 2 0 0 1 16.25 6.75V8A1 1 0 0 1 17.25 9V11A1 1 0 0 1 16.25 12V13.25A2 2 0 0 1 14.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M12.75 10A0.5 0.5 0 1 0 13.75 10A0.5 0.5 0 1 0 12.75 10Z"
        ],
        "24": [
          "M5.25 4.75H17.75A2.5 2.5 0 0 1 20.25 7.25V9.25A1 1 0 0 1 21.25 10.25V13.75A1 1 0 0 1 20.25 14.75V16.75A2.5 2.5 0 0 1 17.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M16.75 12A0.75 0.75 0 1 0 18.25 12A0.75 0.75 0 1 0 16.75 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H11.875A2.125 2.125 0 0 1 14 5.125V10.875A2.125 2.125 0 0 1 11.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM10.125 8A0.75 0.75 0 1 0 11.625 8A0.75 0.75 0 1 0 10.125 8Z",
            "M13.375 5.875A1.625 1.625 0 0 1 15 7.5V8.5A1.625 1.625 0 0 1 13.375 10.125Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H14.25A2.75 2.75 0 0 1 17 6.75V13.25A2.75 2.75 0 0 1 14.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM12 10A1.25 1.25 0 1 0 14.5 10A1.25 1.25 0 1 0 12 10Z",
            "M16.25 7.25A1.75 1.75 0 0 1 18 9V11A1.75 1.75 0 0 1 16.25 12.75Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H17.75A3.25 3.25 0 0 1 21 7.25V16.75A3.25 3.25 0 0 1 17.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM16 12A1.5 1.5 0 1 0 19 12A1.5 1.5 0 1 0 16 12Z",
            "M20.25 8.5A1.75 1.75 0 0 1 22 10.25V13.75A1.75 1.75 0 0 1 20.25 15.5Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "F",
      "label": "Back panel, slot",
      "tags": [
        "back",
        "roll",
        "slot"
      ],
      "note": "The back panel shows as a top edge (y 4.75 · 4.75 · 3.625) joined to the left wall by a half-round roll r2 · 1.5 · 1.375, stopping 3 · 3 · 2.75 short of the right side. Front top 4 · 3 · 2.75 below it (air 2.5 · 1.5 · 1.5). A slot tab runs in from the right wall at mid-front, 5 · 4 · 3.5 long from the wall's centreline, 3.75 · 2.25 · 1.75 clear of the front's top and bottom. Filled: front solid with the slot cut through the right edge (corners r0.5), back edge stays a line 1.5 · 1.5 · 1.25 as in cash. At 16 the front is cash's note exactly (14x7.25); the roll and the slot are what separate them",
      "masters": {
        "16": [
          "M3 6.375H12.875A1.5 1.5 0 0 1 14.375 7.875V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5A1.375 1.375 0 0 0 3 6.375Z",
          "M1.625 5A1.375 1.375 0 0 1 3 3.625H11.625",
          "M14.375 9.375H10.875"
        ],
        "20": [
          "M4.25 7.75H15.25A2 2 0 0 1 17.25 9.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.25A1.5 1.5 0 0 0 4.25 7.75Z",
          "M2.75 6.25A1.5 1.5 0 0 1 4.25 4.75H14.25",
          "M17.25 11.5H13.25"
        ],
        "24": [
          "M4.75 8.75H18.75A2.5 2.5 0 0 1 21.25 11.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V6.75A2 2 0 0 0 4.75 8.75Z",
          "M2.75 6.75A2 2 0 0 1 4.75 4.75H18.25",
          "M21.25 14H16.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3 5.75H12.875A2.125 2.125 0 0 1 15 7.875V8.25A0.5 0.5 0 0 1 14.5 8.75H10.875A0.625 0.625 0 0 0 10.875 10H14.5A0.5 0.5 0 0 1 15 10.5V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5H2.25A0.75 0.75 0 0 0 3 5.75Z"
          ],
          "stroke": [
            "M1.625 5A1.375 1.375 0 0 1 3 3.625H11.625"
          ]
        },
        "20": {
          "fill": [
            "M4.25 7H15.25A2.75 2.75 0 0 1 18 9.75V10.25A0.5 0.5 0 0 1 17.5 10.75H13.25A0.75 0.75 0 0 0 13.25 12.25H17.5A0.5 0.5 0 0 1 18 12.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.25H3.5A0.75 0.75 0 0 0 4.25 7Z"
          ],
          "stroke": [
            "M2.75 6.25A1.5 1.5 0 0 1 4.25 4.75H14.25"
          ]
        },
        "24": {
          "fill": [
            "M4.75 8H18.75A3.25 3.25 0 0 1 22 11.25V12.75A0.5 0.5 0 0 1 21.5 13.25H16.25A0.75 0.75 0 0 0 16.25 14.75H21.5A0.5 0.5 0 0 1 22 15.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V6.75H3.5A1.25 1.25 0 0 0 4.75 8Z"
          ],
          "stroke": [
            "M2.75 6.75A2 2 0 0 1 4.75 4.75H18.25"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "Back panel, snap",
      "tags": [
        "back",
        "roll",
        "snap"
      ],
      "note": "F's back panel and roll with a snap dot instead of the slot: dot 3 · 2.5 · 1.5 across on the right of the front, 1.5 clear of the right wall, 3 · 1.75 · 1.625 clear of the front's top and bottom. Filled: front solid, dot knocked out, back edge a line. The closest to cash of the ten: at 16 both are a top line, a 14x7.25 note and a dot - here the line joins the wall through the roll and the dot sits right, not centred",
      "masters": {
        "16": [
          "M3 6.375H12.875A1.5 1.5 0 0 1 14.375 7.875V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5A1.375 1.375 0 0 0 3 6.375Z",
          "M1.625 5A1.375 1.375 0 0 1 3 3.625H11.625",
          "M11.375 9.375A0.125 0.125 0 1 0 11.625 9.375A0.125 0.125 0 1 0 11.375 9.375Z"
        ],
        "20": [
          "M4.25 7.75H15.25A2 2 0 0 1 17.25 9.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.25A1.5 1.5 0 0 0 4.25 7.75Z",
          "M2.75 6.25A1.5 1.5 0 0 1 4.25 4.75H14.25",
          "M13.25 11.5A0.5 0.5 0 1 0 14.25 11.5A0.5 0.5 0 1 0 13.25 11.5Z"
        ],
        "24": [
          "M4.75 8.75H18.75A2.5 2.5 0 0 1 21.25 11.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V6.75A2 2 0 0 0 4.75 8.75Z",
          "M2.75 6.75A2 2 0 0 1 4.75 4.75H18.25",
          "M16.75 14A0.75 0.75 0 1 0 18.25 14A0.75 0.75 0 1 0 16.75 14Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3 5.75H12.875A2.125 2.125 0 0 1 15 7.875V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5H2.25A0.75 0.75 0 0 0 3 5.75ZM10.75 9.375A0.75 0.75 0 1 0 12.25 9.375A0.75 0.75 0 1 0 10.75 9.375Z"
          ],
          "stroke": [
            "M1.625 5A1.375 1.375 0 0 1 3 3.625H11.625"
          ]
        },
        "20": {
          "fill": [
            "M4.25 7H15.25A2.75 2.75 0 0 1 18 9.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.25H3.5A0.75 0.75 0 0 0 4.25 7ZM12.5 11.5A1.25 1.25 0 1 0 15 11.5A1.25 1.25 0 1 0 12.5 11.5Z"
          ],
          "stroke": [
            "M2.75 6.25A1.5 1.5 0 0 1 4.25 4.75H14.25"
          ]
        },
        "24": {
          "fill": [
            "M4.75 8H18.75A3.25 3.25 0 0 1 22 11.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V6.75H3.5A1.25 1.25 0 0 0 4.75 8ZM16 14A1.5 1.5 0 1 0 19 14A1.5 1.5 0 1 0 16 14Z"
          ],
          "stroke": [
            "M2.75 6.75A2 2 0 0 1 4.75 4.75H18.25"
          ]
        }
      }
    },
    {
      "id": "H",
      "label": "Raised back, open corner",
      "tags": [
        "back",
        "open",
        "snap"
      ],
      "note": "No roll: the left wall rises straight to the back edge with an ordinary corner r2.5 · 2 · 1.5, and the front's top line starts free, 3 · 2.25 · 1.75 clear of the left wall, so the back and front read as two layers. Back and front 4 · 3 · 2.75 apart (air 2.5 · 1.5 · 1.5), back edge stopping 3 · 3 · 2.75 short of the right side. Snap dot as G. Filled: front solid (square top-left under the rising wall), wall and back edge stay a line, dot knocked out. Also near cash at 16",
      "masters": {
        "16": [
          "M4.625 6.375H12.875A1.5 1.5 0 0 1 14.375 7.875V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625H11.625",
          "M11.375 9.375A0.125 0.125 0 1 0 11.625 9.375A0.125 0.125 0 1 0 11.375 9.375Z"
        ],
        "20": [
          "M6.5 7.75H15.25A2 2 0 0 1 17.25 9.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75H14.25",
          "M13.25 11.5A0.5 0.5 0 1 0 14.25 11.5A0.5 0.5 0 1 0 13.25 11.5Z"
        ],
        "24": [
          "M7.25 8.75H18.75A2.5 2.5 0 0 1 21.25 11.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75H18.25",
          "M16.75 14A0.75 0.75 0 1 0 18.25 14A0.75 0.75 0 1 0 16.75 14Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 5.75H12.875A2.125 2.125 0 0 1 15 7.875V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875ZM10.75 9.375A0.75 0.75 0 1 0 12.25 9.375A0.75 0.75 0 1 0 10.75 9.375Z"
          ],
          "stroke": [
            "M1.625 6.375V5.125A1.5 1.5 0 0 1 3.125 3.625H11.625"
          ]
        },
        "20": {
          "fill": [
            "M2 7H15.25A2.75 2.75 0 0 1 18 9.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25ZM12.5 11.5A1.25 1.25 0 1 0 15 11.5A1.25 1.25 0 1 0 12.5 11.5Z"
          ],
          "stroke": [
            "M2.75 7.75V6.75A2 2 0 0 1 4.75 4.75H14.25"
          ]
        },
        "24": {
          "fill": [
            "M2 8H18.75A3.25 3.25 0 0 1 22 11.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75ZM16 14A1.5 1.5 0 1 0 19 14A1.5 1.5 0 1 0 16 14Z"
          ],
          "stroke": [
            "M2.75 8.75V7.25A2.5 2.5 0 0 1 5.25 4.75H18.25"
          ]
        }
      }
    },
    {
      "id": "I",
      "label": "Card peeking, snap",
      "tags": [
        "card",
        "pocket",
        "snap"
      ],
      "note": "A card sticks up out of the pocket, left of centre: pocket top at y 9.75 · 8.25 · 6.625, card ink 10 · 8 · 7 wide, corners r1.5 · 1.25 · 1, air inside the visible part 3.5 · 2 · 1.75 tall; a snap dot 3 · 2.5 · 1.5 on the pocket's right, 1.5 clear of the wall and of the pocket's top and bottom at 20 and 16. Filled: pocket solid, dot knocked out, card stays a line (cash's back note rule). Risk: a bump on the top edge is briefcase's handle - at 16 it reads as a bag",
      "masters": {
        "16": [
          "M3.125 6.625H12.875A1.5 1.5 0 0 1 14.375 8.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V8.125A1.5 1.5 0 0 1 3.125 6.625Z",
          "M3.625 6.625V4.625A1 1 0 0 1 4.625 3.625H8.375A1 1 0 0 1 9.375 4.625V6.625",
          "M11.375 9.5A0.125 0.125 0 1 0 11.625 9.5A0.125 0.125 0 1 0 11.375 9.5Z"
        ],
        "20": [
          "M4.75 8.25H15.25A2 2 0 0 1 17.25 10.25V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V10.25A2 2 0 0 1 4.75 8.25Z",
          "M5.75 8.25V6A1.25 1.25 0 0 1 7 4.75H11A1.25 1.25 0 0 1 12.25 6V8.25",
          "M13.25 11.75A0.5 0.5 0 1 0 14.25 11.75A0.5 0.5 0 1 0 13.25 11.75Z"
        ],
        "24": [
          "M5.25 9.75H18.75A2.5 2.5 0 0 1 21.25 12.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V12.25A2.5 2.5 0 0 1 5.25 9.75Z",
          "M5.75 9.75V6.25A1.5 1.5 0 0 1 7.25 4.75H12.75A1.5 1.5 0 0 1 14.25 6.25V9.75",
          "M16.75 14.5A0.75 0.75 0 1 0 18.25 14.5A0.75 0.75 0 1 0 16.75 14.5Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 6H12.875A2.125 2.125 0 0 1 15 8.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V8.125A2.125 2.125 0 0 1 3.125 6ZM10.75 9.5A0.75 0.75 0 1 0 12.25 9.5A0.75 0.75 0 1 0 10.75 9.5Z"
          ],
          "stroke": [
            "M3.625 6.625V4.625A1 1 0 0 1 4.625 3.625H8.375A1 1 0 0 1 9.375 4.625V6.625"
          ]
        },
        "20": {
          "fill": [
            "M4.75 7.5H15.25A2.75 2.75 0 0 1 18 10.25V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V10.25A2.75 2.75 0 0 1 4.75 7.5ZM12.5 11.75A1.25 1.25 0 1 0 15 11.75A1.25 1.25 0 1 0 12.5 11.75Z"
          ],
          "stroke": [
            "M5.75 8.25V6A1.25 1.25 0 0 1 7 4.75H11A1.25 1.25 0 0 1 12.25 6V8.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 9H18.75A3.25 3.25 0 0 1 22 12.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V12.25A3.25 3.25 0 0 1 5.25 9ZM16 14.5A1.5 1.5 0 1 0 19 14.5A1.5 1.5 0 1 0 16 14.5Z"
          ],
          "stroke": [
            "M5.75 9.75V6.25A1.5 1.5 0 0 1 7.25 4.75H12.75A1.5 1.5 0 0 1 14.25 6.25V9.75"
          ]
        }
      }
    },
    {
      "id": "J",
      "label": "Strap from the top",
      "tags": [
        "strap",
        "flap"
      ],
      "note": "A U-shaped strap hangs from the top edge on the right, 3.5 · 3 · 2.75 wide (air inside 2 · 1.5 · 1.5), its round end reaching y 13.25 · 11.25 · 8.75 (about 60% of the inside), right leg 2 · 1.5 · 1.75 clear of the right wall. No dot: a strap holding one would be 8.5 · 7 wide at 20 · 16, over half the body. Filled: card solid, the strap's inside knocked out, corners at the top edge r0.5. The weakest read: at 16 it is a box with a slot, not a wallet",
      "masters": {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M8.625 3.625V6.75A1.375 1.375 0 0 0 11.375 6.75V3.625"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M11.25 4.75V9A1.5 1.5 0 0 0 14.25 9V4.75"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M14.25 4.75V10.75A1.75 1.75 0 0 0 17.75 10.75V4.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM9.75 4.25H10.25A0.5 0.5 0 0 1 10.75 4.75V6.75A0.75 0.75 0 0 1 9.25 6.75V4.75A0.5 0.5 0 0 1 9.75 4.25Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM12.5 5.5H13A0.5 0.5 0 0 1 13.5 6V9A0.75 0.75 0 0 1 12 9V6A0.5 0.5 0 0 1 12.5 5.5Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM15.5 5.5H16.5A0.5 0.5 0 0 1 17 6V10.75A1 1 0 0 1 15 10.75V6A0.5 0.5 0 0 1 15.5 5.5Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
