// workflow — an automation or pipeline of steps (GitHub Actions, n8n, Zapier, CI). The decision matters
// because the picture has to say "things run in order, in one direction" without turning into one of its
// siblings drawn at the same time: squares-connected (boxes joined by an elbow), decision-process (a diamond),
// network (a topology), git-branch/merge (forking lines). So every reading here is either a start node on a
export default {
 "concept": "workflow",
 "tags": [
  "workflow",
  "automation",
  "pipeline",
  "flow",
  "process"
 ],
 "question": "workflow and automation shipped. Which steps-in-a-chain ships as workflow-2: D (refined staircase) or D2 (same chain, balanced on centre)?",
 "candidates": [
  {
   "id": "D",
   "label": "Steps in a chain",
   "tags": [
    "workflow",
    "steps",
    "pipeline",
    "stages",
    "sequence",
    "chain"
   ],
   "note": "Round 2 — what changed (before → after): the elbows take hierarchy's link bend, r 2.5 · 2 · 1.75 → 1.5 · 1.25 · 1, so each link reads as a step with straight runs instead of a curve; the straight run on each side of the bend 1.5 · 1 · 1.25 → 2.5 · 1.75 · 1.66, now equal on both legs and 0.36 · 0.32 · 0.33 of the step at 24 · 20 · 16; at 16 the links were on whole-unit centrelines (both edges on half pixels, soft) → moved 0.375 toward the diagonal (runs at y 3.375 / 8.375, drops at x 7.625 / 12.625), so each link's inner edge lands on a whole pixel while the rings keep whole-pixel edges; cost: a link meets its ring 0.375 off the ring's centre (hidden in the ring's ink, the off-grid 4.323 / 6.677 / 9.323 / 11.677 are where those lines cross the ring centreline) and its air to the ring it passes 2.375 → 2.0 at 16. Unchanged: ink 20×20 · 16×16 · 14×14 on the circle keyline; three rings ⌀ 6 · 5 · 4 (white 3 · 2 · 1.5, as A and C) at one step, 7 · 5.5 · 5 on each axis; ring to ring 3.9 · 2.78 · 3.07 along the diagonal; link to the ring it passes 3.25 · 2.25 · 2.0. The two links are one path of two subpaths (as share's are). Balance: both links run above the diagonal, so the mass sits 0.62 · 0.48 · 0.39 up and right of centre (filled 0.50 · 0.43 · 0.35); the box already fills the circle keyline, so it cannot be moved down-left to compensate — D2 fixes this by construction. Filled: three solid discs on the rings' outer edge, links at 1.5 · 1.5 · 1.25; ink 18.5 · 18.8 · 19.5% of the canvas, in line with share-filled (14.3 · 15.4 · 20.0), corner-down-right-filled (16.2 · 15.0 · 19.6) and merge-filled (16.8 · 15.7 · 20.4); hierarchy-filled is heavier (32.0 · 26.6 · 30.4) because its nodes are tiles. Who: the nodes-joined-in-order picture of Untitled dataflow, Material steppers and GitLab's pipeline graph; no set ships exactly this drawing as one icon. No arrow: the direction comes from the stepping.",
   "masters": {
    "16": [
     "M1.625 3A1.375 1.375 0 1 0 4.375 3A1.375 1.375 0 1 0 1.625 3Z",
     "M6.625 8A1.375 1.375 0 1 0 9.375 8A1.375 1.375 0 1 0 6.625 8Z",
     "M11.625 13A1.375 1.375 0 1 0 14.375 13A1.375 1.375 0 1 0 11.625 13Z",
     "M4.323 3.375H6.625A1 1 0 0 1 7.625 4.375V6.677M9.323 8.375H11.625A1 1 0 0 1 12.625 9.375V11.677"
    ],
    "20": [
     "M2.75 4.5A1.75 1.75 0 1 0 6.25 4.5A1.75 1.75 0 1 0 2.75 4.5Z",
     "M8.25 10A1.75 1.75 0 1 0 11.75 10A1.75 1.75 0 1 0 8.25 10Z",
     "M13.75 15.5A1.75 1.75 0 1 0 17.25 15.5A1.75 1.75 0 1 0 13.75 15.5Z",
     "M6.25 4.5H8.75A1.25 1.25 0 0 1 10 5.75V8.25M11.75 10H14.25A1.25 1.25 0 0 1 15.5 11.25V13.75"
    ],
    "24": [
     "M2.75 5A2.25 2.25 0 1 0 7.25 5A2.25 2.25 0 1 0 2.75 5Z",
     "M9.75 12A2.25 2.25 0 1 0 14.25 12A2.25 2.25 0 1 0 9.75 12Z",
     "M16.75 19A2.25 2.25 0 1 0 21.25 19A2.25 2.25 0 1 0 16.75 19Z",
     "M7.25 5H10.5A1.5 1.5 0 0 1 12 6.5V9.75M14.25 12H17.5A1.5 1.5 0 0 1 19 13.5V16.75"
    ]
   },
   "filled": {
    "16": {
     "fill": [
      "M1 3A2 2 0 1 0 5 3A2 2 0 1 0 1 3Z",
      "M6 8A2 2 0 1 0 10 8A2 2 0 1 0 6 8Z",
      "M11 13A2 2 0 1 0 15 13A2 2 0 1 0 11 13Z"
     ],
     "stroke": [
      "M4.323 3.375H6.625A1 1 0 0 1 7.625 4.375V6.677M9.323 8.375H11.625A1 1 0 0 1 12.625 9.375V11.677"
     ]
    },
    "20": {
     "fill": [
      "M2 4.5A2.5 2.5 0 1 0 7 4.5A2.5 2.5 0 1 0 2 4.5Z",
      "M7.5 10A2.5 2.5 0 1 0 12.5 10A2.5 2.5 0 1 0 7.5 10Z",
      "M13 15.5A2.5 2.5 0 1 0 18 15.5A2.5 2.5 0 1 0 13 15.5Z"
     ],
     "stroke": [
      "M6.25 4.5H8.75A1.25 1.25 0 0 1 10 5.75V8.25M11.75 10H14.25A1.25 1.25 0 0 1 15.5 11.25V13.75"
     ]
    },
    "24": {
     "fill": [
      "M2 5A3 3 0 1 0 8 5A3 3 0 1 0 2 5Z",
      "M9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12Z",
      "M16 19A3 3 0 1 0 22 19A3 3 0 1 0 16 19Z"
     ],
     "stroke": [
      "M7.25 5H10.5A1.5 1.5 0 0 1 12 6.5V9.75M14.25 12H17.5A1.5 1.5 0 0 1 19 13.5V16.75"
     ]
    }
   }
  },
  {
   "id": "D2",
   "label": "Steps in a chain, through the middle",
   "tags": [
    "workflow",
    "steps",
    "pipeline",
    "stages",
    "sequence",
    "chain"
   ],
   "note": "Same idea as D, second construction: the second link leaves the middle ring downward and turns right into the last, so the run passes through the middle step and the drawing is point-symmetric. Rhythm, as D round 2: ink 20×20 · 16×16 · 14×14 on the circle keyline; rings ⌀ 6 · 5 · 4 (white 3 · 2 · 1.5) at one step, 7 · 5.5 · 5; links bend r 1.5 · 1.25 · 1 (hierarchy's), straight runs 2.5 · 1.75 · 1.66 on each leg; link to the ring it passes 3.25 · 2.25 · 2.0; ring to ring 3.9 · 2.78 · 3.07. At 16 both links sit 0.375 toward the diagonal (first at y 3.375 / x 7.625, second at x 8.375 / y 12.625), so their inner edges land on whole pixels and the pair stays point-symmetric; the off-grid 4.323 / 6.677 / 9.323 / 11.677 are where those lines cross a ring's centreline. Balance: mass on centre (under 0.01 off) in both styles at every master, against D's 0.62 · 0.48 · 0.39 up-right — the reason to show it. Filled: solid discs, links at the outline weight, ink 18.5 · 18.8 · 19.5% (same as D). Who: as D (Untitled dataflow, Material steppers, GitLab's pipeline graph). It reads more as one continuous run through three stages, a touch less as a staircase.",
   "masters": {
    "16": [
     "M1.625 3A1.375 1.375 0 1 0 4.375 3A1.375 1.375 0 1 0 1.625 3Z",
     "M6.625 8A1.375 1.375 0 1 0 9.375 8A1.375 1.375 0 1 0 6.625 8Z",
     "M11.625 13A1.375 1.375 0 1 0 14.375 13A1.375 1.375 0 1 0 11.625 13Z",
     "M4.323 3.375H6.625A1 1 0 0 1 7.625 4.375V6.677M8.375 9.323V11.625A1 1 0 0 0 9.375 12.625H11.677"
    ],
    "20": [
     "M2.75 4.5A1.75 1.75 0 1 0 6.25 4.5A1.75 1.75 0 1 0 2.75 4.5Z",
     "M8.25 10A1.75 1.75 0 1 0 11.75 10A1.75 1.75 0 1 0 8.25 10Z",
     "M13.75 15.5A1.75 1.75 0 1 0 17.25 15.5A1.75 1.75 0 1 0 13.75 15.5Z",
     "M6.25 4.5H8.75A1.25 1.25 0 0 1 10 5.75V8.25M10 11.75V14.25A1.25 1.25 0 0 0 11.25 15.5H13.75"
    ],
    "24": [
     "M2.75 5A2.25 2.25 0 1 0 7.25 5A2.25 2.25 0 1 0 2.75 5Z",
     "M9.75 12A2.25 2.25 0 1 0 14.25 12A2.25 2.25 0 1 0 9.75 12Z",
     "M16.75 19A2.25 2.25 0 1 0 21.25 19A2.25 2.25 0 1 0 16.75 19Z",
     "M7.25 5H10.5A1.5 1.5 0 0 1 12 6.5V9.75M12 14.25V17.5A1.5 1.5 0 0 0 13.5 19H16.75"
    ]
   },
   "filled": {
    "16": {
     "fill": [
      "M1 3A2 2 0 1 0 5 3A2 2 0 1 0 1 3Z",
      "M6 8A2 2 0 1 0 10 8A2 2 0 1 0 6 8Z",
      "M11 13A2 2 0 1 0 15 13A2 2 0 1 0 11 13Z"
     ],
     "stroke": [
      "M4.323 3.375H6.625A1 1 0 0 1 7.625 4.375V6.677M8.375 9.323V11.625A1 1 0 0 0 9.375 12.625H11.677"
     ]
    },
    "20": {
     "fill": [
      "M2 4.5A2.5 2.5 0 1 0 7 4.5A2.5 2.5 0 1 0 2 4.5Z",
      "M7.5 10A2.5 2.5 0 1 0 12.5 10A2.5 2.5 0 1 0 7.5 10Z",
      "M13 15.5A2.5 2.5 0 1 0 18 15.5A2.5 2.5 0 1 0 13 15.5Z"
     ],
     "stroke": [
      "M6.25 4.5H8.75A1.25 1.25 0 0 1 10 5.75V8.25M10 11.75V14.25A1.25 1.25 0 0 0 11.25 15.5H13.75"
     ]
    },
    "24": {
     "fill": [
      "M2 5A3 3 0 1 0 8 5A3 3 0 1 0 2 5Z",
      "M9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12Z",
      "M16 19A3 3 0 1 0 22 19A3 3 0 1 0 16 19Z"
     ],
     "stroke": [
      "M7.25 5H10.5A1.5 1.5 0 0 1 12 6.5V9.75M12 14.25V17.5A1.5 1.5 0 0 0 13.5 19H16.75"
     ]
    }
   }
  }
 ],
};
