// store - a shop front (Commerce & Payments). It sits in menus beside building, home and cart, so the awning is
// the one detail that has to say "a place that sells" at 16: without it the drawing is building (a box with a door),
// with a peaked canopy it becomes a tent or a house. Ten answers across the two choices on the board - the awning
// (scalloped, striped, or a plain roof band) and whether a door shows - plus three silhouettes (awning over
// building's walls, flush with them, or a wide landscape front). Everything reuses the relatives: building's walls
// (x 4.75/19.25 · 4.75/15.25 · 3.625/12.375) and corner radii (r1.5 · 1.25 · 1), home's door, the square keyline home
// uses (18x18 · 14x14 · 12x12). Scallops are three at every master (four on the wide front) so 24, 20 and 16 are the
// same drawing. Generated from a spec per master by a throwaway script (scratchpad store/gen.mjs): the filled
// awning is the outline's exact outer edge (each scallop's arc grown by half the stroke, neighbours meeting where
// those arcs cross, rounded to 2 dp, 3 at 16 - the off-grid values lint lists), the body a solid block 1.5 under the
// awning's lowest ink, the door cut at its clear opening as home-filled cuts it.
// Checked with tools/draft-check.mjs: 10 clean, no warnings.
export default {
  "concept": "store",
  "context": "Store, shop, storefront, retail location, merchant, sales channel",
  "family": [
    "building",
    "building-3",
    "home",
    "cart",
    "credit-card",
    "cash"
  ],
  "question": "Which awning - scalloped, striped or a plain roof band - and with or without a door, makes store read as a shop at 16 beside building, home and cart, and not as a building or a tent?",
  "candidates": [
    {
      "id": "A",
      "label": "Scalloped awning over building's walls",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "merchant",
        "awning",
        "scalloped",
        "door"
      ],
      "note": "(recommended) The awning stands 1 proud of the walls on each side, so the silhouette is a canopy over a shop and cannot be read as building (flat box) or home (gable); it holds at 16 in both styles. Ink 18x18 · 14x14 · 12x12 (square keyline, as home); the body is building's tower exactly - walls x 4.75/19.25 · 4.75/15.25 · 3.625/12.375 (outer 16 · 12 · 10 wide), bottom corners r1.5 · 1.25 · 1 - and each wall starts where it crosses the end scallop (y 8.5 · 7.75 · 6.375). Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Door: home's door (clear 3 · 2 · 1.5 wide, top corners r1.5 · 1.25 · 1); home's height at 24 and 20 (top 14.5 · 11.5), at 16 its top drops 0.25 (9.625, home 9.375) so the filled body keeps 1.5 over the cut. Scallops to door, clear: 3.95 · 2.03 · 1.8. Filled: awning solid, the body a solid block from 1.5 under the awning (top 11.5 · 10.25 · 8.75), top corners r0.75 · 0.75 · 0.625 (half the stroke, as building-4 rounds its cut), door cut at its clear opening. Block as wide as the walls (16 · 12 · 10).",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M3.625 6.375V12.375A1 1 0 0 0 4.625 13.375H11.375A1 1 0 0 0 12.375 12.375V6.375",
          "M6.625 13.375V10.625A1 1 0 0 1 7.625 9.625H8.375A1 1 0 0 1 9.375 10.625V13.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M4.75 7.75V15A1.25 1.25 0 0 0 6 16.25H14A1.25 1.25 0 0 0 15.25 15V7.75",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M4.75 8.5V18.75A1.5 1.5 0 0 0 6.25 20.25H17.75A1.5 1.5 0 0 0 19.25 18.75V8.5",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 5.375V3.625A1.625 1.625 0 0 1 3.625 2H12.375A1.625 1.625 0 0 1 14 3.625V5.375A0.625 0.625 0 0 1 13.941 5.639A2.625 2.625 0 0 1 9.78 6.457A2.5 2.5 0 0 1 6.22 6.457A2.625 2.625 0 0 1 2.059 5.639A0.625 0.625 0 0 1 2 5.375Z",
            "M3 9.375A0.625 0.625 0 0 1 3.625 8.75H12.375A0.625 0.625 0 0 1 13 9.375V12.375A1.625 1.625 0 0 1 11.375 14H4.625A1.625 1.625 0 0 1 3 12.375ZM7.25 14V10.625A0.375 0.375 0 0 1 7.625 10.25H8.375A0.375 0.375 0 0 1 8.75 10.625V14Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M3 6.75V5A2 2 0 0 1 5 3H15A2 2 0 0 1 17 5V6.75A0.75 0.75 0 0 1 16.89 7.15A3.25 3.25 0 0 1 12.04 7.92A3 3 0 0 1 7.96 7.92A3.25 3.25 0 0 1 3.11 7.15A0.75 0.75 0 0 1 3 6.75Z",
            "M4 11A0.75 0.75 0 0 1 4.75 10.25H15.25A0.75 0.75 0 0 1 16 11V15A2 2 0 0 1 14 17H6A2 2 0 0 1 4 15ZM9 17V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V17Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M3 7.25V5.25A2.25 2.25 0 0 1 5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V7.25A0.75 0.75 0 0 1 20.94 7.55A3.75 3.75 0 0 1 14.75 8.6A3.75 3.75 0 0 1 9.25 8.6A3.75 3.75 0 0 1 3.06 7.55A0.75 0.75 0 0 1 3 7.25Z",
            "M4 12.25A0.75 0.75 0 0 1 4.75 11.5H19.25A0.75 0.75 0 0 1 20 12.25V18.75A2.25 2.25 0 0 1 17.75 21H6.25A2.25 2.25 0 0 1 4 18.75ZM10.5 21V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V21Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "B",
      "label": "Striped awning over building's walls",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "merchant",
        "awning",
        "striped",
        "scalloped",
        "door"
      ],
      "note": "A with the awning striped: a line from the top down to each point between scallops (x 9.25 / 14.75 · 8 / 12 · 6.25 / 9.75), so it reads as a canvas awning even where the scallops blur; three stripes, 5.5 · 4 · 3.5 apart (clear 4 · 2.5 · 2.25). Most \"shop\" at 24, busiest at 16. Ink 18x18 · 14x14 · 12x12; walls as A (building's), starting on the end scallop at y 8.5 · 7.75 · 6.375. Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Door: home's door (clear 3 · 2 · 1.5 wide, top corners r1.5 · 1.25 · 1); home's height at 24 and 20 (top 14.5 · 11.5), at 16 its top drops 0.25 (9.625, home 9.375) so the filled body keeps 1.5 over the cut. Scallops to door, clear: 3.95 · 2.03 · 1.8. Filled: the stripes would vanish in a solid awning, so the awning stays a line drawing at the outline weight (1.5 · 1.5 · 1.25) and the body below is solid from 1.5 under it (top 11.5 · 10.25 · 8.75), corners r0.75 · 0.75 · 0.625 on top, door cut at its clear opening.",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M3.625 6.375V12.375A1 1 0 0 0 4.625 13.375H11.375A1 1 0 0 0 12.375 12.375V6.375",
          "M6.625 13.375V10.625A1 1 0 0 1 7.625 9.625H8.375A1 1 0 0 1 9.375 10.625V13.375",
          "M6.25 2.625V5.375",
          "M9.75 2.625V5.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M4.75 7.75V15A1.25 1.25 0 0 0 6 16.25H14A1.25 1.25 0 0 0 15.25 15V7.75",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25",
          "M8 3.75V6.75",
          "M12 3.75V6.75"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M4.75 8.5V18.75A1.5 1.5 0 0 0 6.25 20.25H17.75A1.5 1.5 0 0 0 19.25 18.75V8.5",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25",
          "M9.25 3.75V7.25",
          "M14.75 3.75V7.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3 9.375A0.625 0.625 0 0 1 3.625 8.75H12.375A0.625 0.625 0 0 1 13 9.375V12.375A1.625 1.625 0 0 1 11.375 14H4.625A1.625 1.625 0 0 1 3 12.375ZM7.25 14V10.625A0.375 0.375 0 0 1 7.625 10.25H8.375A0.375 0.375 0 0 1 8.75 10.625V14Z"
          ],
          "stroke": [
            "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
            "M6.25 2.625V5.375",
            "M9.75 2.625V5.375"
          ]
        },
        "20": {
          "fill": [
            "M4 11A0.75 0.75 0 0 1 4.75 10.25H15.25A0.75 0.75 0 0 1 16 11V15A2 2 0 0 1 14 17H6A2 2 0 0 1 4 15ZM9 17V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V17Z"
          ],
          "stroke": [
            "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
            "M8 3.75V6.75",
            "M12 3.75V6.75"
          ]
        },
        "24": {
          "fill": [
            "M4 12.25A0.75 0.75 0 0 1 4.75 11.5H19.25A0.75 0.75 0 0 1 20 12.25V18.75A2.25 2.25 0 0 1 17.75 21H6.25A2.25 2.25 0 0 1 4 18.75ZM10.5 21V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V21Z"
          ],
          "stroke": [
            "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
            "M9.25 3.75V7.25",
            "M14.75 3.75V7.25"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Scalloped awning, flush walls",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "merchant",
        "awning",
        "scalloped",
        "door"
      ],
      "note": "One block: the walls run straight down from the awning's ends, so the silhouette is a rounded square and only the scallop line and the door say \"shop\". Quieter than A; at 16 the square outline sits closest to building. Ink 18x18 · 14x14 · 12x12, walls x 3.75/20.25 · 3.75/16.25 · 2.625/13.375, bottom corners r1.5 · 1.25 · 1. Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Door: home's door (clear 3 · 2 · 1.5 wide, top corners r1.5 · 1.25 · 1); home's height at 24 and 20 (top 14.5 · 11.5), at 16 its top drops 0.25 (9.625, home 9.375) so the filled body keeps 1.5 over the cut. Scallops to door, clear: 3.95 · 2.03 · 1.8. Filled: awning solid, the body a solid block from 1.5 under the awning (top 11.5 · 10.25 · 8.75), top corners r0.75 · 0.75 · 0.625 (half the stroke, as building-4 rounds its cut), door cut at its clear opening. Block the full width (18 · 14 · 12).",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M2.625 5.375V12.375A1 1 0 0 0 3.625 13.375H12.375A1 1 0 0 0 13.375 12.375V5.375",
          "M6.625 13.375V10.625A1 1 0 0 1 7.625 9.625H8.375A1 1 0 0 1 9.375 10.625V13.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M3.75 6.75V15A1.25 1.25 0 0 0 5 16.25H15A1.25 1.25 0 0 0 16.25 15V6.75",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M3.75 7.25V18.75A1.5 1.5 0 0 0 5.25 20.25H18.75A1.5 1.5 0 0 0 20.25 18.75V7.25",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 5.375V3.625A1.625 1.625 0 0 1 3.625 2H12.375A1.625 1.625 0 0 1 14 3.625V5.375A0.625 0.625 0 0 1 13.941 5.639A2.625 2.625 0 0 1 9.78 6.457A2.5 2.5 0 0 1 6.22 6.457A2.625 2.625 0 0 1 2.059 5.639A0.625 0.625 0 0 1 2 5.375Z",
            "M2 9.375A0.625 0.625 0 0 1 2.625 8.75H13.375A0.625 0.625 0 0 1 14 9.375V12.375A1.625 1.625 0 0 1 12.375 14H3.625A1.625 1.625 0 0 1 2 12.375ZM7.25 14V10.625A0.375 0.375 0 0 1 7.625 10.25H8.375A0.375 0.375 0 0 1 8.75 10.625V14Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M3 6.75V5A2 2 0 0 1 5 3H15A2 2 0 0 1 17 5V6.75A0.75 0.75 0 0 1 16.89 7.15A3.25 3.25 0 0 1 12.04 7.92A3 3 0 0 1 7.96 7.92A3.25 3.25 0 0 1 3.11 7.15A0.75 0.75 0 0 1 3 6.75Z",
            "M3 11A0.75 0.75 0 0 1 3.75 10.25H16.25A0.75 0.75 0 0 1 17 11V15A2 2 0 0 1 15 17H5A2 2 0 0 1 3 15ZM9 17V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V17Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M3 7.25V5.25A2.25 2.25 0 0 1 5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V7.25A0.75 0.75 0 0 1 20.94 7.55A3.75 3.75 0 0 1 14.75 8.6A3.75 3.75 0 0 1 9.25 8.6A3.75 3.75 0 0 1 3.06 7.55A0.75 0.75 0 0 1 3 7.25Z",
            "M3 12.25A0.75 0.75 0 0 1 3.75 11.5H20.25A0.75 0.75 0 0 1 21 12.25V18.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75ZM10.5 21V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V21Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "D",
      "label": "Striped awning, flush walls",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "merchant",
        "awning",
        "striped",
        "scalloped",
        "door"
      ],
      "note": "C with the awning striped (lines from the top to each scallop point, x 9.25 / 14.75 · 8 / 12 · 6.25 / 9.75, clear 4 · 2.5 · 2.25 between). The stripes do the work the overhang does in A. Ink 18x18 · 14x14 · 12x12, walls flush (x 3.75/20.25 · 3.75/16.25 · 2.625/13.375). Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Door: home's door (clear 3 · 2 · 1.5 wide, top corners r1.5 · 1.25 · 1); home's height at 24 and 20 (top 14.5 · 11.5), at 16 its top drops 0.25 (9.625, home 9.375) so the filled body keeps 1.5 over the cut. Scallops to door, clear: 3.95 · 2.03 · 1.8. Filled: awning kept as a line drawing (stripes would vanish in a solid), body solid from 1.5 under it (top 11.5 · 10.25 · 8.75), door cut at its clear opening.",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M2.625 5.375V12.375A1 1 0 0 0 3.625 13.375H12.375A1 1 0 0 0 13.375 12.375V5.375",
          "M6.625 13.375V10.625A1 1 0 0 1 7.625 9.625H8.375A1 1 0 0 1 9.375 10.625V13.375",
          "M6.25 2.625V5.375",
          "M9.75 2.625V5.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M3.75 6.75V15A1.25 1.25 0 0 0 5 16.25H15A1.25 1.25 0 0 0 16.25 15V6.75",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25",
          "M8 3.75V6.75",
          "M12 3.75V6.75"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M3.75 7.25V18.75A1.5 1.5 0 0 0 5.25 20.25H18.75A1.5 1.5 0 0 0 20.25 18.75V7.25",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25",
          "M9.25 3.75V7.25",
          "M14.75 3.75V7.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 9.375A0.625 0.625 0 0 1 2.625 8.75H13.375A0.625 0.625 0 0 1 14 9.375V12.375A1.625 1.625 0 0 1 12.375 14H3.625A1.625 1.625 0 0 1 2 12.375ZM7.25 14V10.625A0.375 0.375 0 0 1 7.625 10.25H8.375A0.375 0.375 0 0 1 8.75 10.625V14Z"
          ],
          "stroke": [
            "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
            "M6.25 2.625V5.375",
            "M9.75 2.625V5.375"
          ]
        },
        "20": {
          "fill": [
            "M3 11A0.75 0.75 0 0 1 3.75 10.25H16.25A0.75 0.75 0 0 1 17 11V15A2 2 0 0 1 15 17H5A2 2 0 0 1 3 15ZM9 17V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V17Z"
          ],
          "stroke": [
            "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
            "M8 3.75V6.75",
            "M12 3.75V6.75"
          ]
        },
        "24": {
          "fill": [
            "M3 12.25A0.75 0.75 0 0 1 3.75 11.5H20.25A0.75 0.75 0 0 1 21 12.25V18.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75ZM10.5 21V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V21Z"
          ],
          "stroke": [
            "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
            "M9.25 3.75V7.25",
            "M14.75 3.75V7.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Awning on a ground line",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "merchant",
        "awning",
        "scalloped",
        "door",
        "ground"
      ],
      "note": "A standing on building-3's ground line instead of a closed base: the line runs the awning's full width (x 3.75-20.25 · 3.75-16.25 · 2.625-13.375), the walls (building's, x 4.75/19.25 · 4.75/15.25 · 3.625/12.375) meet it square, 1 short of its ends. Pairs with building-3/-4 in a street of icons. Ink 18x18 · 14x14 · 12x12. Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Door: home's door (clear 3 · 2 · 1.5 wide, top corners r1.5 · 1.25 · 1); home's height at 24 and 20 (top 14.5 · 11.5), at 16 its top drops 0.25 (9.625, home 9.375) so the filled body keeps 1.5 over the cut. Scallops to door, clear: 3.95 · 2.03 · 1.8. Filled: awning solid, body solid from 1.5 under it (top 11.5 · 10.25 · 8.75) down into the ground line, as building-3 fills its tower; door cut to the line; the line stays a stroke at 1.5 · 1.5 · 1.25.",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M3.625 6.375V13.375",
          "M12.375 6.375V13.375",
          "M2.625 13.375H13.375",
          "M6.625 13.375V10.625A1 1 0 0 1 7.625 9.625H8.375A1 1 0 0 1 9.375 10.625V13.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M4.75 7.75V16.25",
          "M15.25 7.75V16.25",
          "M3.75 16.25H16.25",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M4.75 8.5V20.25",
          "M19.25 8.5V20.25",
          "M3.75 20.25H20.25",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 5.375V3.625A1.625 1.625 0 0 1 3.625 2H12.375A1.625 1.625 0 0 1 14 3.625V5.375A0.625 0.625 0 0 1 13.941 5.639A2.625 2.625 0 0 1 9.78 6.457A2.5 2.5 0 0 1 6.22 6.457A2.625 2.625 0 0 1 2.059 5.639A0.625 0.625 0 0 1 2 5.375Z",
            "M3 9.375A0.625 0.625 0 0 1 3.625 8.75H12.375A0.625 0.625 0 0 1 13 9.375V13.375H3ZM7.25 13.375V10.625A0.375 0.375 0 0 1 7.625 10.25H8.375A0.375 0.375 0 0 1 8.75 10.625V13.375Z"
          ],
          "stroke": [
            "M2.625 13.375H13.375"
          ]
        },
        "20": {
          "fill": [
            "M3 6.75V5A2 2 0 0 1 5 3H15A2 2 0 0 1 17 5V6.75A0.75 0.75 0 0 1 16.89 7.15A3.25 3.25 0 0 1 12.04 7.92A3 3 0 0 1 7.96 7.92A3.25 3.25 0 0 1 3.11 7.15A0.75 0.75 0 0 1 3 6.75Z",
            "M4 11A0.75 0.75 0 0 1 4.75 10.25H15.25A0.75 0.75 0 0 1 16 11V16.25H4ZM9 16.25V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V16.25Z"
          ],
          "stroke": [
            "M3.75 16.25H16.25"
          ]
        },
        "24": {
          "fill": [
            "M3 7.25V5.25A2.25 2.25 0 0 1 5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V7.25A0.75 0.75 0 0 1 20.94 7.55A3.75 3.75 0 0 1 14.75 8.6A3.75 3.75 0 0 1 9.25 8.6A3.75 3.75 0 0 1 3.06 7.55A0.75 0.75 0 0 1 3 7.25Z",
            "M4 12.25A0.75 0.75 0 0 1 4.75 11.5H19.25A0.75 0.75 0 0 1 20 12.25V20.25H4ZM10.5 20.25V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V20.25Z"
          ],
          "stroke": [
            "M3.75 20.25H20.25"
          ]
        }
      }
    },
    {
      "id": "F",
      "label": "Market stall, no door",
      "tags": [
        "store",
        "shop",
        "stall",
        "market",
        "kiosk",
        "stand",
        "awning",
        "scalloped"
      ],
      "note": "The awning on two posts over a counter: no walls, no door. Reads as a stall or market stand more than a shop, useful if the set wants \"marketplace\" apart from \"store\". Ink 18x18 · 14x14 · 12x12; posts at building's wall lines (x 4.75/19.25 · 4.75/15.25 · 3.625/12.375) from the end scallop to a ground line the full width; counter line at y 14.75 · 11.75 · 10 (clear 4.2 · 2.28 · 2.17 under the scallops, 4 · 3 · 2.125 over the ground). Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Filled: awning solid, counter solid from its line down into the ground line (top corners r0.75 · 0.75 · 0.625), posts stay strokes above it, ground line a stroke.",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M3.625 6.375V13.375",
          "M12.375 6.375V13.375",
          "M2.625 13.375H13.375",
          "M3.625 10H12.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M4.75 7.75V16.25",
          "M15.25 7.75V16.25",
          "M3.75 16.25H16.25",
          "M4.75 11.75H15.25"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M4.75 8.5V20.25",
          "M19.25 8.5V20.25",
          "M3.75 20.25H20.25",
          "M4.75 14.75H19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 5.375V3.625A1.625 1.625 0 0 1 3.625 2H12.375A1.625 1.625 0 0 1 14 3.625V5.375A0.625 0.625 0 0 1 13.941 5.639A2.625 2.625 0 0 1 9.78 6.457A2.5 2.5 0 0 1 6.22 6.457A2.625 2.625 0 0 1 2.059 5.639A0.625 0.625 0 0 1 2 5.375Z",
            "M3 10A0.625 0.625 0 0 1 3.625 9.375H12.375A0.625 0.625 0 0 1 13 10V13.375H3Z"
          ],
          "stroke": [
            "M3.625 6.375V10",
            "M12.375 6.375V10",
            "M2.625 13.375H13.375"
          ]
        },
        "20": {
          "fill": [
            "M3 6.75V5A2 2 0 0 1 5 3H15A2 2 0 0 1 17 5V6.75A0.75 0.75 0 0 1 16.89 7.15A3.25 3.25 0 0 1 12.04 7.92A3 3 0 0 1 7.96 7.92A3.25 3.25 0 0 1 3.11 7.15A0.75 0.75 0 0 1 3 6.75Z",
            "M4 11.75A0.75 0.75 0 0 1 4.75 11H15.25A0.75 0.75 0 0 1 16 11.75V16.25H4Z"
          ],
          "stroke": [
            "M4.75 7.75V11.75",
            "M15.25 7.75V11.75",
            "M3.75 16.25H16.25"
          ]
        },
        "24": {
          "fill": [
            "M3 7.25V5.25A2.25 2.25 0 0 1 5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V7.25A0.75 0.75 0 0 1 20.94 7.55A3.75 3.75 0 0 1 14.75 8.6A3.75 3.75 0 0 1 9.25 8.6A3.75 3.75 0 0 1 3.06 7.55A0.75 0.75 0 0 1 3 7.25Z",
            "M4 14.75A0.75 0.75 0 0 1 4.75 14H19.25A0.75 0.75 0 0 1 20 14.75V20.25H4Z"
          ],
          "stroke": [
            "M4.75 8.5V14.75",
            "M19.25 8.5V14.75",
            "M3.75 20.25H20.25"
          ]
        }
      }
    },
    {
      "id": "G",
      "label": "Scalloped awning, no door",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "awning",
        "scalloped",
        "minimal"
      ],
      "note": "C without the door: the awning alone carries \"shop\". Tests whether the door is needed - at 16 the plain body under the awning reads as a box or a tray. Ink 18x18 · 14x14 · 12x12, walls flush. Awning: flat top with building's corners (r1.5 · 1.25 · 1), three scallops along its lower edge - chords 5.5 ×3 at 24 (r3, each dips 1.8), 4.25 / 4 / 4.25 at 20 (r2.5 / 2.25, dip 1.18-1.22), 3.625 / 3.5 / 3.625 at 16 (r2 / 1.875, dip 1.15-1.2); the points between scallops sit 3.5 · 3 · 2.75 under the top line (clear 2 · 1.5 · 1.5). Awning ink 6.8 · 5.72 · 5.2 deep (38 · 41 · 43% of the height). Filled: awning solid over a plain solid block from 1.5 under it (top 11.5 · 10.25 · 8.75).",
      "masters": {
        "16": [
          "M2.625 5.375V3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V5.375A2 2 0 0 1 9.75 5.375A1.875 1.875 0 0 1 6.25 5.375A2 2 0 0 1 2.625 5.375Z",
          "M2.625 5.375V12.375A1 1 0 0 0 3.625 13.375H12.375A1 1 0 0 0 13.375 12.375V5.375"
        ],
        "20": [
          "M3.75 6.75V5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.75A2.5 2.5 0 0 1 12 6.75A2.25 2.25 0 0 1 8 6.75A2.5 2.5 0 0 1 3.75 6.75Z",
          "M3.75 6.75V15A1.25 1.25 0 0 0 5 16.25H15A1.25 1.25 0 0 0 16.25 15V6.75"
        ],
        "24": [
          "M3.75 7.25V5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.25A3 3 0 0 1 14.75 7.25A3 3 0 0 1 9.25 7.25A3 3 0 0 1 3.75 7.25Z",
          "M3.75 7.25V18.75A1.5 1.5 0 0 0 5.25 20.25H18.75A1.5 1.5 0 0 0 20.25 18.75V7.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 5.375V3.625A1.625 1.625 0 0 1 3.625 2H12.375A1.625 1.625 0 0 1 14 3.625V5.375A0.625 0.625 0 0 1 13.941 5.639A2.625 2.625 0 0 1 9.78 6.457A2.5 2.5 0 0 1 6.22 6.457A2.625 2.625 0 0 1 2.059 5.639A0.625 0.625 0 0 1 2 5.375Z",
            "M2 9.375A0.625 0.625 0 0 1 2.625 8.75H13.375A0.625 0.625 0 0 1 14 9.375V12.375A1.625 1.625 0 0 1 12.375 14H3.625A1.625 1.625 0 0 1 2 12.375Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M3 6.75V5A2 2 0 0 1 5 3H15A2 2 0 0 1 17 5V6.75A0.75 0.75 0 0 1 16.89 7.15A3.25 3.25 0 0 1 12.04 7.92A3 3 0 0 1 7.96 7.92A3.25 3.25 0 0 1 3.11 7.15A0.75 0.75 0 0 1 3 6.75Z",
            "M3 11A0.75 0.75 0 0 1 3.75 10.25H16.25A0.75 0.75 0 0 1 17 11V15A2 2 0 0 1 15 17H5A2 2 0 0 1 3 15Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M3 7.25V5.25A2.25 2.25 0 0 1 5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V7.25A0.75 0.75 0 0 1 20.94 7.55A3.75 3.75 0 0 1 14.75 8.6A3.75 3.75 0 0 1 9.25 8.6A3.75 3.75 0 0 1 3.06 7.55A0.75 0.75 0 0 1 3 7.25Z",
            "M3 12.25A0.75 0.75 0 0 1 3.75 11.5H20.25A0.75 0.75 0 0 1 21 12.25V18.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "H",
      "label": "Wide shop front",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "merchant",
        "awning",
        "scalloped",
        "wide",
        "door"
      ],
      "note": "A storefront wider than tall, on the landscape keyline (20x16 · 16x12 · 14x10) - a shop front rather than a building. Four scallops at every master: 4.75 / 4.5 / 4.5 / 4.75 at 24 (r2.75 / 2.5, dip 1.36-1.41), 3.75 / 3.5 / 3.5 / 3.75 at 20 (dip 0.72-0.74), 3.25 / 3.125 / 3.125 / 3.25 at 16 (dip 0.63-0.64); the height only allows shallow scallops at 20 and 16 (cusps must stay 3 · 3 · 2.75 under the top line). Corners r1.5 · 1.25 · 1. Door: home's width; at 24 home's height (top 13.5 on the base at 19.25), at 20 1 shorter (top 11.5 on 15.25, clear 1.51 under the scallops); at 16 there is no room (it would stand 2.25 tall), so the door goes - the 16 is awning and body only. Filled: awning solid, body solid from 1.5 under it (top 11.5 · 10.75 · 9.25), door cut at 24 and 20.",
      "masters": {
        "16": [
          "M1.625 6.375V4.625A1 1 0 0 1 2.625 3.625H13.375A1 1 0 0 1 14.375 4.625V6.375A2.375 2.375 0 0 1 11.125 6.375A2.25 2.25 0 0 1 8 6.375A2.25 2.25 0 0 1 4.875 6.375A2.375 2.375 0 0 1 1.625 6.375Z",
          "M1.625 6.375V11.375A1 1 0 0 0 2.625 12.375H13.375A1 1 0 0 0 14.375 11.375V6.375"
        ],
        "20": [
          "M2.75 7.75V6A1.25 1.25 0 0 1 4 4.75H16A1.25 1.25 0 0 1 17.25 6V7.75A2.75 2.75 0 0 1 13.5 7.75A2.5 2.5 0 0 1 10 7.75A2.5 2.5 0 0 1 6.5 7.75A2.75 2.75 0 0 1 2.75 7.75Z",
          "M2.75 7.75V14A1.25 1.25 0 0 0 4 15.25H16A1.25 1.25 0 0 0 17.25 14V7.75",
          "M8.25 15.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V15.25"
        ],
        "24": [
          "M2.75 7.75V6.25A1.5 1.5 0 0 1 4.25 4.75H19.75A1.5 1.5 0 0 1 21.25 6.25V7.75A2.75 2.75 0 0 1 16.5 7.75A2.5 2.5 0 0 1 12 7.75A2.5 2.5 0 0 1 7.5 7.75A2.75 2.75 0 0 1 2.75 7.75Z",
          "M2.75 7.75V17.75A1.5 1.5 0 0 0 4.25 19.25H19.75A1.5 1.5 0 0 0 21.25 17.75V7.75",
          "M9.75 19.25V15A1.5 1.5 0 0 1 11.25 13.5H12.75A1.5 1.5 0 0 1 14.25 15V19.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 6.375V4.625A1.625 1.625 0 0 1 2.625 3H13.375A1.625 1.625 0 0 1 15 4.625V6.375A0.625 0.625 0 0 1 14.803 6.831A3 3 0 0 1 11.129 7.167A2.875 2.875 0 0 1 8 7.169A2.875 2.875 0 0 1 4.871 7.167A3 3 0 0 1 1.197 6.831A0.625 0.625 0 0 1 1 6.375Z",
            "M1 9.875A0.625 0.625 0 0 1 1.625 9.25H14.375A0.625 0.625 0 0 1 15 9.875V11.375A1.625 1.625 0 0 1 13.375 13H2.625A1.625 1.625 0 0 1 1 11.375Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 7.75V6A2 2 0 0 1 4 4H16A2 2 0 0 1 18 6V7.75A0.75 0.75 0 0 1 17.76 8.3A3.5 3.5 0 0 1 13.51 8.7A3.25 3.25 0 0 1 10 8.7A3.25 3.25 0 0 1 6.49 8.7A3.5 3.5 0 0 1 2.24 8.3A0.75 0.75 0 0 1 2 7.75Z",
            "M2 11.5A0.75 0.75 0 0 1 2.75 10.75H17.25A0.75 0.75 0 0 1 18 11.5V14A2 2 0 0 1 16 16H4A2 2 0 0 1 2 14ZM9 16V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V16Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 7.75V6.25A2.25 2.25 0 0 1 4.25 4H19.75A2.25 2.25 0 0 1 22 6.25V7.75A0.75 0.75 0 0 1 21.9 8.13A3.5 3.5 0 0 1 16.54 8.97A3.25 3.25 0 0 1 12 9.01A3.25 3.25 0 0 1 7.46 8.97A3.5 3.5 0 0 1 2.1 8.13A0.75 0.75 0 0 1 2 7.75Z",
            "M2 12.25A0.75 0.75 0 0 1 2.75 11.5H21.25A0.75 0.75 0 0 1 22 12.25V17.75A2.25 2.25 0 0 1 19.75 20H4.25A2.25 2.25 0 0 1 2 17.75ZM10.5 20V15A0.75 0.75 0 0 1 11.25 14.25H12.75A0.75 0.75 0 0 1 13.5 15V20Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "I",
      "label": "Plain sign band, no awning",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "sign",
        "band",
        "door"
      ],
      "note": "The \"simple roof band\" answer: a flat sign band 1 wider than building's walls on each side, no scallops. Cleanest drawing, but at 16 it risks reading as a box with a lid (trash, archive) or building with a cornice. Ink 18x18 · 14x14 · 12x12. Band y 3.75-8.25 · 3.75-7 · 2.625-5.5 (centrelines; clear inside 3 · 1.75 · 1.625), top corners r1.5 · 1.25 · 1, bottom corners r0.75 · 0.75 · 0.625; walls building's (x 4.75/19.25 · 4.75/15.25 · 3.625/12.375) hanging from it; home's door exactly (top 14.5 · 11.5 · 9.375). Filled: band solid, body block from 1.5 under it (top 10.5 · 9.25 · 7.625), door cut at its clear opening.",
      "masters": {
        "16": [
          "M2.625 3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V4.875A0.625 0.625 0 0 1 12.75 5.5H3.25A0.625 0.625 0 0 1 2.625 4.875Z",
          "M3.625 5.5V12.375A1 1 0 0 0 4.625 13.375H11.375A1 1 0 0 0 12.375 12.375V5.5",
          "M6.625 13.375V10.375A1 1 0 0 1 7.625 9.375H8.375A1 1 0 0 1 9.375 10.375V13.375"
        ],
        "20": [
          "M3.75 5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.25A0.75 0.75 0 0 1 15.5 7H4.5A0.75 0.75 0 0 1 3.75 6.25Z",
          "M4.75 7V15A1.25 1.25 0 0 0 6 16.25H14A1.25 1.25 0 0 0 15.25 15V7",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25"
        ],
        "24": [
          "M3.75 5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.5A0.75 0.75 0 0 1 19.5 8.25H4.5A0.75 0.75 0 0 1 3.75 7.5Z",
          "M4.75 8.25V18.75A1.5 1.5 0 0 0 6.25 20.25H17.75A1.5 1.5 0 0 0 19.25 18.75V8.25",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 3.625A1.625 1.625 0 0 1 3.625 2H12.375A1.625 1.625 0 0 1 14 3.625V4.875A1.25 1.25 0 0 1 12.75 6.125H3.25A1.25 1.25 0 0 1 2 4.875Z",
            "M3 8.25A0.625 0.625 0 0 1 3.625 7.625H12.375A0.625 0.625 0 0 1 13 8.25V12.375A1.625 1.625 0 0 1 11.375 14H4.625A1.625 1.625 0 0 1 3 12.375ZM7.25 14V10.375A0.375 0.375 0 0 1 7.625 10H8.375A0.375 0.375 0 0 1 8.75 10.375V14Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M3 5A2 2 0 0 1 5 3H15A2 2 0 0 1 17 5V6.25A1.5 1.5 0 0 1 15.5 7.75H4.5A1.5 1.5 0 0 1 3 6.25Z",
            "M4 10A0.75 0.75 0 0 1 4.75 9.25H15.25A0.75 0.75 0 0 1 16 10V15A2 2 0 0 1 14 17H6A2 2 0 0 1 4 15ZM9 17V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V17Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M3 5.25A2.25 2.25 0 0 1 5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V7.5A1.5 1.5 0 0 1 19.5 9H4.5A1.5 1.5 0 0 1 3 7.5Z",
            "M4 11.25A0.75 0.75 0 0 1 4.75 10.5H19.25A0.75 0.75 0 0 1 20 11.25V18.75A2.25 2.25 0 0 1 17.75 21H6.25A2.25 2.25 0 0 1 4 18.75ZM10.5 21V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V21Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "J",
      "label": "Striped flat band, flush",
      "tags": [
        "store",
        "shop",
        "storefront",
        "retail",
        "awning",
        "striped",
        "band",
        "door"
      ],
      "note": "The \"straight-segmented\" answer: a flat awning band divided into stripes, no scallops, walls flush. At 24 the four cells read as an awning; at 16 the flat cells read as a table header or a clapperboard, which is the argument for scallops. Ink 18x18 · 14x14 · 12x12, corners r1.5 · 1.25 · 1. Band line y 8.25 · 7 · 5.5; stripes at x 8 / 12 / 16 (cells 4.25 / 4 / 4 / 4.25) · 8 / 12 · 6.25 / 9.75; home's door exactly. Filled: the band stays a line drawing at the outline weight (stripes would vanish in a solid; bottom corners r0.75 · 0.75 · 0.625), body solid from 1.5 under it (top 10.5 · 9.25 · 7.625), door cut at its clear opening.",
      "masters": {
        "16": [
          "M2.625 3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V12.375A1 1 0 0 1 12.375 13.375H3.625A1 1 0 0 1 2.625 12.375Z",
          "M2.625 5.5H13.375",
          "M6.25 2.625V5.5",
          "M9.75 2.625V5.5",
          "M6.625 13.375V10.375A1 1 0 0 1 7.625 9.375H8.375A1 1 0 0 1 9.375 10.375V13.375"
        ],
        "20": [
          "M3.75 5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V15A1.25 1.25 0 0 1 15 16.25H5A1.25 1.25 0 0 1 3.75 15Z",
          "M3.75 7H16.25",
          "M8 3.75V7",
          "M12 3.75V7",
          "M8.25 16.25V12.75A1.25 1.25 0 0 1 9.5 11.5H10.5A1.25 1.25 0 0 1 11.75 12.75V16.25"
        ],
        "24": [
          "M3.75 5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V18.75A1.5 1.5 0 0 1 18.75 20.25H5.25A1.5 1.5 0 0 1 3.75 18.75Z",
          "M3.75 8.25H20.25",
          "M8 3.75V8.25",
          "M12 3.75V8.25",
          "M16 3.75V8.25",
          "M9.75 20.25V16A1.5 1.5 0 0 1 11.25 14.5H12.75A1.5 1.5 0 0 1 14.25 16V20.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 8.25A0.625 0.625 0 0 1 2.625 7.625H13.375A0.625 0.625 0 0 1 14 8.25V12.375A1.625 1.625 0 0 1 12.375 14H3.625A1.625 1.625 0 0 1 2 12.375ZM7.25 14V10.375A0.375 0.375 0 0 1 7.625 10H8.375A0.375 0.375 0 0 1 8.75 10.375V14Z"
          ],
          "stroke": [
            "M2.625 3.625A1 1 0 0 1 3.625 2.625H12.375A1 1 0 0 1 13.375 3.625V4.875A0.625 0.625 0 0 1 12.75 5.5H3.25A0.625 0.625 0 0 1 2.625 4.875Z",
            "M6.25 2.625V5.5",
            "M9.75 2.625V5.5"
          ]
        },
        "20": {
          "fill": [
            "M3 10A0.75 0.75 0 0 1 3.75 9.25H16.25A0.75 0.75 0 0 1 17 10V15A2 2 0 0 1 15 17H5A2 2 0 0 1 3 15ZM9 17V12.75A0.5 0.5 0 0 1 9.5 12.25H10.5A0.5 0.5 0 0 1 11 12.75V17Z"
          ],
          "stroke": [
            "M3.75 5A1.25 1.25 0 0 1 5 3.75H15A1.25 1.25 0 0 1 16.25 5V6.25A0.75 0.75 0 0 1 15.5 7H4.5A0.75 0.75 0 0 1 3.75 6.25Z",
            "M8 3.75V7",
            "M12 3.75V7"
          ]
        },
        "24": {
          "fill": [
            "M3 11.25A0.75 0.75 0 0 1 3.75 10.5H20.25A0.75 0.75 0 0 1 21 11.25V18.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75ZM10.5 21V16A0.75 0.75 0 0 1 11.25 15.25H12.75A0.75 0.75 0 0 1 13.5 16V21Z"
          ],
          "stroke": [
            "M3.75 5.25A1.5 1.5 0 0 1 5.25 3.75H18.75A1.5 1.5 0 0 1 20.25 5.25V7.5A0.75 0.75 0 0 1 19.5 8.25H4.5A0.75 0.75 0 0 1 3.75 7.5Z",
            "M8 3.75V8.25",
            "M12 3.75V8.25",
            "M16 3.75V8.25"
          ]
        }
      }
    }
  ]
};
