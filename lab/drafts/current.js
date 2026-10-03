// layout-sidebar-right — the one direction the sidebar family does not ship. All five shipped
// variants put the band on the left; these are those five reflected, one candidate each.
//
// Nothing is drawn by hand. Each candidate is read out of the shipped left-hand file and
// reflected about the canvas centre — x → W − x, V untouched, and every arc keeps its radii but
// flips its sweep flag, since reflecting a shape reverses the way its arcs turn. The frame is
// symmetric about that centre, so it must land exactly on itself; the generator asserts that and
// it holds at every master. Reflection changes no distance, so every gap, counter, radius and ink
// box the left-hand five were approved on is carried over unchanged, and the ink box is still
// checkbox's square. The divider, the band and the box are the only things that move.
//
// Numbering follows C27's habit of letting the number name the construction and travel with the
// object: layout-sidebar-2 ↔ layout-sidebar-right-2, so a number means the same build on either
// side. Each candidate keeps its left twin's tags, with "panel left" → "panel right" and that
// word added to the four that never carried it, so a search for "right" finds the whole family.
//
// C at 20 and 16 is B, exactly as layout-sidebar-3 is layout-sidebar-2 there: the counter is
// 3.25 and 2.75 and the two links do not fit beside the walls at the 1.5 floor.
//
// Drawn after #114 `sidebar` and #357 `sidebar-right` were dropped as duplicates: the references
// the queue pulled for "sidebar" were Polaris's LayoutSidebarLeft and Lucide's panel-left, which
// is a rounded frame with a divider at x 9 — the icon this family already ships.

export default {
  concept: "layout-sidebar-right",
  set: {
    A: "layout-sidebar-right",
    B: "layout-sidebar-right-2",
    C: "layout-sidebar-right-3",
    D: "layout-sidebar-right-4",
    E: "layout-sidebar-right-5"
  },
  family: ["layout-sidebar", "layout-sidebar-2", "layout-sidebar-3", "layout-sidebar-4", "layout-sidebar-5"],
  question: "The five left-hand sidebar variants reflected to the right, shipping as layout-sidebar-right and -2 … -5. Does each mirror read as well as its twin, and does the set want all five or only some?",
  candidates: [
    {
      id: "A",
      label: "Third, wall to wall",
      note: "The shipped `layout-sidebar` reflected about the canvas centre and nothing else: every x becomes W − x and every arc flips its sweep flag. The frame is symmetric, so it maps onto itself to the last decimal — checked in the build, not assumed — and the only thing that moves is the divider, from x 9.75 · 8.5 · 6.625 to 14.25 · 11.5 · 9.375. The counters swap sides and keep their sizes: sidebar 4.5 · 3.25 · 2.75, page 9 · 6.25 · 5.5. At 16 the divider still sits on the eighth grid (9.375), so its right edge lands on whole pixel 10. Filled: `layout-sidebar-filled` reflected, so the page and the band stay two shapes with the 1.5 cut between them. (recommended)",
      tags: ["sidebar", "page", "panel right", "navigation", "layout"],
      masters: {
        24: [
          "M17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z",
          "M14.25 3.75V20.25"
        ],
        20: [
          "M14.25 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V5.75A2 2 0 0 0 14.25 3.75Z",
          "M11.5 3.75V16.25"
        ],
        16: [
          "M11.875 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625Z",
          "M9.375 2.625V13.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M3 6.25V17.75A3.25 3.25 0 0 0 6.25 21H13A0.5 0.5 0 0 0 13.5 20.5V3.5A0.5 0.5 0 0 0 13 3H6.25A3.25 3.25 0 0 0 3 6.25Z",
            "M15 3.5V20.5A0.5 0.5 0 0 0 15.5 21H17.75A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3H15.5A0.5 0.5 0 0 0 15 3.5Z"
          ]
        },
        20: {
          fill: [
            "M3 5.75V14.25A2.75 2.75 0 0 0 5.75 17H10.25A0.5 0.5 0 0 0 10.75 16.5V3.5A0.5 0.5 0 0 0 10.25 3H5.75A2.75 2.75 0 0 0 3 5.75Z",
            "M12.25 3.5V16.5A0.5 0.5 0 0 0 12.75 17H14.25A2.75 2.75 0 0 0 17 14.25V5.75A2.75 2.75 0 0 0 14.25 3H12.75A0.5 0.5 0 0 0 12.25 3.5Z"
          ]
        },
        16: {
          fill: [
            "M2 4.125V11.875A2.125 2.125 0 0 0 4.125 14H8A0.5 0.5 0 0 0 8.5 13.5V2.5A0.5 0.5 0 0 0 8 2H4.125A2.125 2.125 0 0 0 2 4.125Z",
            "M10 2.5V13.5A0.5 0.5 0 0 0 10.5 14H11.875A2.125 2.125 0 0 0 14 11.875V4.125A2.125 2.125 0 0 0 11.875 2H10.5A0.5 0.5 0 0 0 10 2.5Z"
          ]
        }
      }
    },
    {
      id: "B",
      label: "Third, solid sidebar",
      note: "The mirror of `layout-sidebar-2`. The outline is A’s. Filled: the band is the sidebar and the divider as one solid, now running from the divider’s left edge to the frame’s outer right — x 13.5→21 · 10.75→17 · 8.75→14, still 7.5 · 6.25 · 5.25 wide — and its right corners take the outline’s outer radius 3.25 · 2.75 · 2.125 while the left ones are square against the cut. The page is left as an open line at 1.5 · 1.5 · 1.25 with its ends tucked half a stroke into the solid.",
      tags: ["sidebar", "page", "panel right", "navigation", "layout", "highlight"],
      masters: {
        24: [
          "M17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z",
          "M14.25 3.75V20.25"
        ],
        20: [
          "M14.25 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V5.75A2 2 0 0 0 14.25 3.75Z",
          "M11.5 3.75V16.25"
        ],
        16: [
          "M11.875 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625Z",
          "M9.375 2.625V13.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M13.5 3V21H17.75A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3H13.5Z"
          ],
          stroke: [
            "M14.25 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H14.25"
          ]
        },
        20: {
          fill: [
            "M10.75 3V17H14.25A2.75 2.75 0 0 0 17 14.25V5.75A2.75 2.75 0 0 0 14.25 3H10.75Z"
          ],
          stroke: [
            "M11.5 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H11.5"
          ]
        },
        16: {
          fill: [
            "M8.75 2V14H11.875A2.125 2.125 0 0 0 14 11.875V4.125A2.125 2.125 0 0 0 11.875 2H8.75Z"
          ],
          stroke: [
            "M9.375 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H9.375"
          ]
        }
      }
    },
    {
      id: "C",
      label: "Third, solid sidebar, two links at 24",
      note: "The mirror of `layout-sidebar-3`: B with two short links inside the band at 24 only, knocked out of the solid at 1.5 of white. Their centreline moves from x 6.75 to 17.25, keeping 1.5 to the frame’s right wall and 1.5 to the divider — both on the gap floor — and they run down the band, not across it, for the same reason as on the left: a 4.5-wide sidebar with 1.5 clear each side leaves 1.5 of ink, a dot, not a line. At 20 and 16 the counter is 3.25 and 2.75, the links do not fit, and C is B there, exactly as `layout-sidebar-3` is `layout-sidebar-2` at those masters.",
      tags: ["sidebar", "page", "panel right", "links", "navigation", "layout", "highlight"],
      masters: {
        24: [
          "M17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z",
          "M14.25 3.75V20.25",
          "M17.25 7.75V9.75",
          "M17.25 14.25V16.25"
        ],
        20: [
          "M14.25 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V5.75A2 2 0 0 0 14.25 3.75Z",
          "M11.5 3.75V16.25"
        ],
        16: [
          "M11.875 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625Z",
          "M9.375 2.625V13.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M13.5 3V21H17.75A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3H13.5ZM16.5 7.75V9.75A0.75 0.75 0 0 0 18 9.75V7.75A0.75 0.75 0 0 0 16.5 7.75ZM16.5 14.25V16.25A0.75 0.75 0 0 0 18 16.25V14.25A0.75 0.75 0 0 0 16.5 14.25Z"
          ],
          stroke: [
            "M14.25 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H14.25"
          ]
        },
        20: {
          fill: [
            "M10.75 3V17H14.25A2.75 2.75 0 0 0 17 14.25V5.75A2.75 2.75 0 0 0 14.25 3H10.75Z"
          ],
          stroke: [
            "M11.5 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H11.5"
          ]
        },
        16: {
          fill: [
            "M8.75 2V14H11.875A2.125 2.125 0 0 0 14 11.875V4.125A2.125 2.125 0 0 0 11.875 2H8.75Z"
          ],
          stroke: [
            "M9.375 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H9.375"
          ]
        }
      }
    },
    {
      id: "D",
      label: "Third, solid page",
      note: "The mirror of `layout-sidebar-4`, the reverse of B: the page and the divider are one solid and the sidebar stays an open line. The solid now runs from the frame’s outer left to the divider’s right edge — x 3→15 · 3→12.25 · 2→10 — 12 · 9.25 · 8 wide, with its left corners on the outline’s outer radius. The sidebar line keeps 1.5 · 1.5 · 1.25 and tucks half a stroke into the solid.",
      tags: ["sidebar", "page", "panel right", "layout", "content"],
      masters: {
        24: [
          "M17.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z",
          "M14.25 3.75V20.25"
        ],
        20: [
          "M14.25 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V5.75A2 2 0 0 0 14.25 3.75Z",
          "M11.5 3.75V16.25"
        ],
        16: [
          "M11.875 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625Z",
          "M9.375 2.625V13.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M3 6.25V17.75A3.25 3.25 0 0 0 6.25 21H15V3H6.25A3.25 3.25 0 0 0 3 6.25Z"
          ],
          stroke: [
            "M14.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H14.25"
          ]
        },
        20: {
          fill: [
            "M3 5.75V14.25A2.75 2.75 0 0 0 5.75 17H12.25V3H5.75A2.75 2.75 0 0 0 3 5.75Z"
          ],
          stroke: [
            "M11.5 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H11.5"
          ]
        },
        16: {
          fill: [
            "M2 4.125V11.875A2.125 2.125 0 0 0 4.125 14H10V2H4.125A2.125 2.125 0 0 0 2 4.125Z"
          ],
          stroke: [
            "M9.375 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H9.375"
          ]
        }
      }
    },
    {
      id: "E",
      label: "Detached sidebar box",
      note: "The mirror of `layout-sidebar-5`: the page’s top and bottom walls stop short of a closed sidebar box, now on the right. Box centreline x 15.75→20.25 · 12.75→16.25 · 10.375→13.375, ink 6 · 5 · 4.25 wide, counter 3 · 2 · 1.75; the right corners take the container radius 2.5 · 2 · 1.5 and the left ones the detail radius 1.5 · 1.25 · 1, so the silhouette is still checkbox’s square. The page walls now end at x 12.75 · 9.75 · 7.375, and the break between them and the box holds 1.5 · 1.5 · 1.75 as on the left. Filled: the box solid, the page an open line.",
      tags: ["sidebar", "page", "panel right", "layout", "detached", "section"],
      masters: {
        24: [
          "M12.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H12.75",
          "M15.75 5.25V18.75A1.5 1.5 0 0 0 17.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75H17.25A1.5 1.5 0 0 0 15.75 5.25Z"
        ],
        20: [
          "M9.75 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H9.75",
          "M12.75 5V15A1.25 1.25 0 0 0 14 16.25H14.25A2 2 0 0 0 16.25 14.25V5.75A2 2 0 0 0 14.25 3.75H14A1.25 1.25 0 0 0 12.75 5Z"
        ],
        16: [
          "M7.375 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H7.375",
          "M10.375 3.625V12.375A1 1 0 0 0 11.375 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V4.125A1.5 1.5 0 0 0 11.875 2.625H11.375A1 1 0 0 0 10.375 3.625Z"
        ]
      },
      filled: {
        24: {
          fill: [
            "M15 5.25V18.75A2.25 2.25 0 0 0 17.25 21H17.75A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3H17.25A2.25 2.25 0 0 0 15 5.25Z"
          ],
          stroke: [
            "M12.75 3.75H6.25A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H12.75"
          ]
        },
        20: {
          fill: [
            "M12 5V15A2 2 0 0 0 14 17H14.25A2.75 2.75 0 0 0 17 14.25V5.75A2.75 2.75 0 0 0 14.25 3H14A2 2 0 0 0 12 5Z"
          ],
          stroke: [
            "M9.75 3.75H5.75A2 2 0 0 0 3.75 5.75V14.25A2 2 0 0 0 5.75 16.25H9.75"
          ]
        },
        16: {
          fill: [
            "M9.75 3.625V12.375A1.625 1.625 0 0 0 11.375 14H11.875A2.125 2.125 0 0 0 14 11.875V4.125A2.125 2.125 0 0 0 11.875 2H11.375A1.625 1.625 0 0 0 9.75 3.625Z"
          ],
          stroke: [
            "M7.375 2.625H4.125A1.5 1.5 0 0 0 2.625 4.125V11.875A1.5 1.5 0 0 0 4.125 13.375H7.375"
          ]
        }
      }
    }
  ]
};
