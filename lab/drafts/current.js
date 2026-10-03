// sort-ascending-2 / sort-descending-2 — the directional members of sort-3's language.
// Every drawing here is READ OUT OF THE SHIPPED sort-3 FILES, not rebuilt: the bars keep its left
// flush, its three rows and its three lengths, and the chevrons are its own paths. Only two
// things change — which row gets which length, and whether the pair stays or drops to one.
//
// A and B put the direction in the lines and keep the pair, so all three icons share one mark.
// C and D let the chevron say it too. The warning on C and D is the one that matters: a single
// chevron is shorter than the bar stack, so the BARS set the ink box, and bars are C17 repeated
// elements that thicken in place — the filled twin then stands proud of the outline's box, which
// is what the grows note on those two candidates declares and what A and B never have to.

export default {
  concept: "sort-ascending-2",
  tags: [
    "sort",
    "order",
    "arrange",
    "ascending",
    "descending",
    "table header",
    "list",
    "chevron"
  ],
  set: {
    A: "sort-ascending-2",
    B: "sort-descending-2",
    C: "sort-ascending-2",
    D: "sort-descending-2"
  },
  question: "In sort-3’s language, does the direction live in the lines alone — the chevron pair staying put as the mark that says \"this column is sortable\" — or does the pair drop to the single chevron that points the way?",
  candidates: [
    {
      id: "A",
      label: "ascending · pair stays",
      note: "Shipped sort-3 with one change: the lines sorted, short at the top growing down — the order shipped sort-ascending uses, and the way a sorted list reads from its first row. The chevron pair is sort-3's own, untouched, so the three icons share one mark and a toggling table header moves only the lines. That is what makes this a family rather than three drawings. (recommended)",
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
      masters: {
        16: [
          "M1.625 4.5H3.375",
          "M1.625 8H5.125",
          "M1.625 11.5H6.875",
          "M9.625 6.275L11.554 4.312A0.625 0.625 0 0 1 12.446 4.312L14.375 6.275",
          "M9.625 9.725L11.554 11.688A0.625 0.625 0 0 0 12.446 11.688L14.375 9.725"
        ],
        20: [
          "M2.75 5.5H4.75",
          "M2.75 10H6.75",
          "M2.75 14.5H8.75",
          "M11.75 7.68L13.97 5.46A0.75 0.75 0 0 1 15.03 5.46L17.25 7.68",
          "M11.75 12.32L13.97 14.54A0.75 0.75 0 0 0 15.03 14.54L17.25 12.32"
        ],
        24: [
          "M3.75 7.5H6.25",
          "M3.75 12H8.5",
          "M3.75 16.5H10.75",
          "M13.75 9.93L16.47 7.21A0.75 0.75 0 0 1 17.53 7.21L20.25 9.93",
          "M13.75 14.07L16.47 16.79A0.75 0.75 0 0 0 17.53 16.79L20.25 14.07"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H3",
            "M2 8H4.75",
            "M2 11.5H6.5",
            "M10 5.9L10.937 4.946A1.49 1.49 0 0 1 13.063 4.946L14 5.9",
            "M10 10.1L10.937 11.054A1.49 1.49 0 0 0 13.063 11.054L14 10.1"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H4.5",
            "M3 10H6.5",
            "M3 14.5H8.5",
            "M12 7.43L13.55 5.88A1.35 1.35 0 0 1 15.45 5.88L17 7.43",
            "M12 12.57L13.55 14.12A1.35 1.35 0 0 0 15.45 14.12L17 12.57"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H5.75",
            "M4.25 12H8",
            "M4.25 16.5H10.25",
            "M14.25 9.43L15.64 8.05A1.93 1.93 0 0 1 18.36 8.05L19.75 9.43",
            "M14.25 14.57L15.64 15.95A1.93 1.93 0 0 0 18.36 15.95L19.75 14.57"
          ]
        }
      }
    },
    {
      id: "B",
      label: "descending · pair stays",
      note: "A mirrored: long at the top shrinking down, same pair. Read against A at 16 — with the mark constant, the whole distinction is the top and bottom line, 2 · 2 · 1.75 units of difference.",
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
      masters: {
        16: [
          "M1.625 4.5H6.875",
          "M1.625 8H5.125",
          "M1.625 11.5H3.375",
          "M9.625 6.275L11.554 4.312A0.625 0.625 0 0 1 12.446 4.312L14.375 6.275",
          "M9.625 9.725L11.554 11.688A0.625 0.625 0 0 0 12.446 11.688L14.375 9.725"
        ],
        20: [
          "M2.75 5.5H8.75",
          "M2.75 10H6.75",
          "M2.75 14.5H4.75",
          "M11.75 7.68L13.97 5.46A0.75 0.75 0 0 1 15.03 5.46L17.25 7.68",
          "M11.75 12.32L13.97 14.54A0.75 0.75 0 0 0 15.03 14.54L17.25 12.32"
        ],
        24: [
          "M3.75 7.5H10.75",
          "M3.75 12H8.5",
          "M3.75 16.5H6.25",
          "M13.75 9.93L16.47 7.21A0.75 0.75 0 0 1 17.53 7.21L20.25 9.93",
          "M13.75 14.07L16.47 16.79A0.75 0.75 0 0 0 17.53 16.79L20.25 14.07"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H6.5",
            "M2 8H4.75",
            "M2 11.5H3",
            "M10 5.9L10.937 4.946A1.49 1.49 0 0 1 13.063 4.946L14 5.9",
            "M10 10.1L10.937 11.054A1.49 1.49 0 0 0 13.063 11.054L14 10.1"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H8.5",
            "M3 10H6.5",
            "M3 14.5H4.5",
            "M12 7.43L13.55 5.88A1.35 1.35 0 0 1 15.45 5.88L17 7.43",
            "M12 12.57L13.55 14.12A1.35 1.35 0 0 0 15.45 14.12L17 12.57"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H10.25",
            "M4.25 12H8",
            "M4.25 16.5H5.75",
            "M14.25 9.43L15.64 8.05A1.93 1.93 0 0 1 18.36 8.05L19.75 9.43",
            "M14.25 14.57L15.64 15.95A1.93 1.93 0 0 0 18.36 15.95L19.75 14.57"
          ]
        }
      }
    },
    {
      id: "C",
      label: "ascending · single chevron",
      note: "The pair drops to the up chevron alone, centred on the canvas. Says the direction twice, so A-against-B's problem goes away — at the cost of the mark no longer saying the column is sortable, and of the icon being a chevron and some lines, which is close to what sort-ascending already ships.",
      box: {
        16: [
          14,
          8.25
        ],
        20: [
          16,
          10.5
        ],
        24: [
          18,
          10.5
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H3.375",
          "M1.625 8H5.125",
          "M1.625 11.5H6.875",
          "M9.625 9.025L11.554 7.062A0.625 0.625 0 0 1 12.446 7.062L14.375 9.025"
        ],
        20: [
          "M2.75 5.5H4.75",
          "M2.75 10H6.75",
          "M2.75 14.5H8.75",
          "M11.75 11.18L13.97 8.96A0.75 0.75 0 0 1 15.03 8.96L17.25 11.18"
        ],
        24: [
          "M3.75 7.5H6.25",
          "M3.75 12H8.5",
          "M3.75 16.5H10.75",
          "M13.75 13.43L16.47 10.71A0.75 0.75 0 0 1 17.53 10.71L20.25 13.43"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H3",
            "M2 8H4.75",
            "M2 11.5H6.5",
            "M10 8.65L10.937 7.696A1.49 1.49 0 0 1 13.063 7.696L14 8.65"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H4.5",
            "M3 10H6.5",
            "M3 14.5H8.5",
            "M12 10.93L13.55 9.38A1.35 1.35 0 0 1 15.45 9.38L17 10.93"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H5.75",
            "M4.25 12H8",
            "M4.25 16.5H10.25",
            "M14.25 12.93L15.64 11.55A1.93 1.93 0 0 1 18.36 11.55L19.75 12.93"
          ]
        }
      },
      grows: {
        16: [
          0,
          0,
          0.38,
          0.38
        ],
        20: [
          0,
          0,
          0.25,
          0.25
        ],
        24: [
          0,
          0,
          0.5,
          0.5
        ]
      }
    },
    {
      id: "D",
      label: "descending · single chevron",
      note: "C mirrored.",
      box: {
        16: [
          14,
          8.25
        ],
        20: [
          16,
          10.5
        ],
        24: [
          18,
          10.5
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H6.875",
          "M1.625 8H5.125",
          "M1.625 11.5H3.375",
          "M9.625 6.975L11.554 8.938A0.625 0.625 0 0 0 12.446 8.938L14.375 6.975"
        ],
        20: [
          "M2.75 5.5H8.75",
          "M2.75 10H6.75",
          "M2.75 14.5H4.75",
          "M11.75 8.82L13.97 11.04A0.75 0.75 0 0 0 15.03 11.04L17.25 8.82"
        ],
        24: [
          "M3.75 7.5H10.75",
          "M3.75 12H8.5",
          "M3.75 16.5H6.25",
          "M13.75 10.57L16.47 13.29A0.75 0.75 0 0 0 17.53 13.29L20.25 10.57"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H6.5",
            "M2 8H4.75",
            "M2 11.5H3",
            "M10 7.35L10.937 8.304A1.49 1.49 0 0 0 13.063 8.304L14 7.35"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H8.5",
            "M3 10H6.5",
            "M3 14.5H4.5",
            "M12 9.07L13.55 10.62A1.35 1.35 0 0 0 15.45 10.62L17 9.07"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H10.25",
            "M4.25 12H8",
            "M4.25 16.5H5.75",
            "M14.25 11.07L15.64 12.45A1.93 1.93 0 0 0 18.36 12.45L19.75 11.07"
          ]
        }
      },
      grows: {
        16: [
          0,
          0,
          0.38,
          0.38
        ],
        20: [
          0,
          0,
          0.25,
          0.25
        ],
        24: [
          0,
          0,
          0.5,
          0.5
        ]
      }
    }
  ]
};
