// sort-3 — settled 2026-10-03. A list and its control in one mark, in the state where nothing
// has been sorted: the lines sit at three different widths in an order no sorted list can
// produce, and the set's own chevron pair says the column can be sorted.
//
// Two decisions, both Maruti's, both made on boards of their own:
//   the LINES   medium, long, short. sort-ascending and sort-descending are wedges; this is a
//               bulge, so it cannot be misread as either. Of the six orders three distinct
//               lengths allow, two are those wedges and this is one of the remaining four.
//   the CHEVRON 45 degrees — what chevron-up and chevron-down actually ship at. The first
//               drawing used 52.6, which is chevron-up-3, the steep variant; nothing chose it.
//
// Dropped on the way: a reading where the mark changed with the direction (it measured as
// sort-ascending redrawn — same elements, same bar order, only different numbers) and a
// double-headed arrow (its two heads cannot hold §6's 1.5 at this width without the icon
// growing taller than the family).

export default {
  concept: "sort-3",
  tags: [
    "sort",
    "order",
    "arrange",
    "unsorted",
    "table header",
    "list",
    "chevron",
    "caret"
  ],
  box: {
    16: [
      14,
      9
    ],
    20: [
      16,
      11.02
    ],
    24: [
      18,
      11.52
    ]
  },
  question: "Settled 2026-10-03: the lines medium, long, short — out of order, because nothing has been sorted — beside the set’s own chevron at 45 degrees.",
  candidates: [
    {
      id: "B",
      label: "classic 45° — the set’s own chevron",
      note: "A list and its control in one mark, in the state where nothing has been sorted yet. THE LINES carry G's three lengths — 4.75 / 7 / 2.5 of centreline at 24, 4 / 6 / 2 at 20, 3.5 / 5.25 / 1.75 at 16 — in the order medium, long, short. That is one of the four orders a sorted list cannot produce: sort-ascending and sort-descending are both wedges, growing or shrinking all the way down, and this is a bulge. THE CHEVRONS are the set's own, at the angle chevron-up and chevron-down actually ship (44.95 · 45 · 45.5, the 16 leaning half a degree the way every 16 master in this set leans) — not chevron-up-3's 52, which is what the first drawing of this icon inherited without anything choosing it. Channel between the two carets 4.14 · 4.64 · 3.45, which is the tightest that keeps the pair taller than the bar stack in the FILLED style, where the bars thicken in place (C17) and would otherwise set the ink box. Each caret's apex is the circle of radius half a stroke inscribed in the vertex, the construction G's own carets measure to within 0.003. The filled twin keeps the leg angle, pulls both ends in by half the added weight and re-solves the apex radius so the tip lands on the outline's own ink extreme — which is what holds the ink box identical in both styles, 18x11.52 · 16x11.02 · 14x9. BOX: 18x11.52 · 16x11.02 · 14x9 is wider than §2's mark keyline at 20 and 16, exactly as shipped `sort` is — it declares 16x13.5 · 14x12 for the same reason: two elements side by side need the width the family already agreed. (recommended)",
      masters: {
        16: [
          "M1.625 4.5H5.125",
          "M1.625 8H6.875",
          "M1.625 11.5H3.375",
          "M9.625 6.275L11.554 4.312A0.625 0.625 0 0 1 12.446 4.312L14.375 6.275",
          "M9.625 9.725L11.554 11.688A0.625 0.625 0 0 0 12.446 11.688L14.375 9.725"
        ],
        20: [
          "M2.75 5.5H6.75",
          "M2.75 10H8.75",
          "M2.75 14.5H4.75",
          "M11.75 7.68L13.97 5.46A0.75 0.75 0 0 1 15.03 5.46L17.25 7.68",
          "M11.75 12.32L13.97 14.54A0.75 0.75 0 0 0 15.03 14.54L17.25 12.32"
        ],
        24: [
          "M3.75 7.5H8.5",
          "M3.75 12H10.75",
          "M3.75 16.5H6.25",
          "M13.75 9.93L16.47 7.21A0.75 0.75 0 0 1 17.53 7.21L20.25 9.93",
          "M13.75 14.07L16.47 16.79A0.75 0.75 0 0 0 17.53 16.79L20.25 14.07"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H4.75",
            "M2 8H6.5",
            "M2 11.5H3",
            "M10 5.9L10.937 4.946A1.49 1.49 0 0 1 13.063 4.946L14 5.9",
            "M10 10.1L10.937 11.054A1.49 1.49 0 0 0 13.063 11.054L14 10.1"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H6.5",
            "M3 10H8.5",
            "M3 14.5H4.5",
            "M12 7.43L13.55 5.88A1.35 1.35 0 0 1 15.45 5.88L17 7.43",
            "M12 12.57L13.55 14.12A1.35 1.35 0 0 0 15.45 14.12L17 12.57"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H8",
            "M4.25 12H10.25",
            "M4.25 16.5H5.75",
            "M14.25 9.43L15.64 8.05A1.93 1.93 0 0 1 18.36 8.05L19.75 9.43",
            "M14.25 14.57L15.64 15.95A1.93 1.93 0 0 0 18.36 15.95L19.75 14.57"
          ]
        }
      }
    }
  ]
};
