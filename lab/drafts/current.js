// sort-3 — the symbol the sort board reserved this name for: a list and its control in one
// mark (G's reading, Maruti 2026-10-03), with ONE change — the bars are LEVEL, because nothing
// has been sorted yet. The directional siblings step them.
//
// Everything here is G's own drawing. The bars keep its left flush, its three rows and its three
// lengths; the caret pair and both filled treatments are taken verbatim, so the clearances G
// measured still hold and this board only asks its one question.
//
// THE QUESTION. B and C put the direction in the bars alone and never touch the mark. D and E say
// it twice — stepped bars AND a single caret. B/C keep one mark across all three states, which is
// what makes a toggling table header sit still; D/E are louder and unmistakable at 16, and are
// what the shipped sort-ascending already does with its arrow.
//
// NOT this board's question: open carets (G) against solid triangles (H). Every candidate here is
// drawn on G's open pair so that choice stays separate; it is the next one to make.

export default {
  concept: "sort-3",
  tags: [
    "sort",
    "order",
    "arrange",
    "table header",
    "list",
    "caret",
    "ascending",
    "descending"
  ],
  set: {
    A: "sort-3",
    B: "sort-ascending-2",
    C: "sort-descending-2",
    D: "sort-ascending-2",
    E: "sort-descending-2"
  },
  question: "When the list is sorted, what shows the direction — the bars alone, or the bars and the mark together?",
  candidates: [
    {
      id: "A",
      label: "sort-3 · level",
      note: "THE SHARED BASE, and the icon this board is named for. G with its three bars levelled to the longest — 8.5 · 7.5 · 6.5 of ink — because nothing has been sorted yet. The caret pair and the bars are G's own drawing, so the clearance G measured is held unchanged: bar ink ends at 11.5 · 10 · 7.5 and the caret pair starts at 13 · 11 · 9, which is 1.5 · 1 · 1.5 of air. [needs measuring: the 20 clearance, which G sized on the filled drawing]. Levelling costs the one thing the stepped stack gave for free — three equal lines read as `menu` until the carets are seen. (recommended as the base; the question is what B–E do with it)",
      box: {
        16: [
          14,
          9.736
        ],
        20: [
          16,
          11.57
        ],
        24: [
          18,
          13.54
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H6.875",
          "M1.625 8H6.875",
          "M1.625 11.5H6.875",
          "M9.625 6.375L11.51 3.994A0.625 0.625 0 0 1 12.49 3.994L14.375 6.375",
          "M9.625 9.625L11.51 12.006A0.625 0.625 0 0 0 12.49 12.006L14.375 9.625"
        ],
        20: [
          "M2.75 5.5H8.75",
          "M2.75 10H8.75",
          "M2.75 14.5H8.75",
          "M11.75 8L13.91 5.25A0.75 0.75 0 0 1 15.09 5.25L17.25 8",
          "M11.75 12L13.91 14.75A0.75 0.75 0 0 0 15.09 14.75L17.25 12"
        ],
        24: [
          "M3.75 7.5H10.75",
          "M3.75 12H10.75",
          "M3.75 16.5H10.75",
          "M13.75 9.75L16.4 6.28A0.75 0.75 0 0 1 17.6 6.28L20.25 9.75",
          "M13.75 14.25L16.4 17.72A0.75 0.75 0 0 0 17.6 17.72L20.25 14.25"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H6.5",
            "M2 8H6.5",
            "M2 11.5H6.5",
            "M10 6L11.148 4.545A1.085 1.085 0 0 1 12.852 4.545L14 6",
            "M10 10L11.148 11.455A1.085 1.085 0 0 0 12.852 11.455L14 10"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H8.5",
            "M3 10H8.5",
            "M3 14.5H8.5",
            "M12 7.75L13.3 5.85A1.45 1.45 0 0 1 15.7 5.85L17 7.75",
            "M12 12.25L13.3 14.15A1.45 1.45 0 0 0 15.7 14.15L17 12.25"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H10.25",
            "M4.25 12H10.25",
            "M4.25 16.5H10.25",
            "M14.25 9.25L15.71 7.16A1.57 1.57 0 0 1 18.29 7.16L19.75 9.25",
            "M14.25 14.75L15.71 16.84A1.57 1.57 0 0 0 18.29 16.84L19.75 14.75"
          ]
        }
      }
    },
    {
      id: "B",
      label: "ascending · bars alone",
      note: "The bars carry the direction and the mark never changes: short at the top growing down, the way a sorted list reads from its first row — the same order the shipped `sort-ascending` uses. The caret pair is G's, untouched. Against E this is the cheaper family: one mark, three states, and a header that toggles only moves the bars.",
      box: {
        16: [
          14,
          9.736
        ],
        20: [
          16,
          11.57
        ],
        24: [
          18,
          13.54
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H3.375",
          "M1.625 8H5.125",
          "M1.625 11.5H6.875",
          "M9.625 6.375L11.51 3.994A0.625 0.625 0 0 1 12.49 3.994L14.375 6.375",
          "M9.625 9.625L11.51 12.006A0.625 0.625 0 0 0 12.49 12.006L14.375 9.625"
        ],
        20: [
          "M2.75 5.5H4.75",
          "M2.75 10H6.75",
          "M2.75 14.5H8.75",
          "M11.75 8L13.91 5.25A0.75 0.75 0 0 1 15.09 5.25L17.25 8",
          "M11.75 12L13.91 14.75A0.75 0.75 0 0 0 15.09 14.75L17.25 12"
        ],
        24: [
          "M3.75 7.5H6.25",
          "M3.75 12H8.5",
          "M3.75 16.5H10.75",
          "M13.75 9.75L16.4 6.28A0.75 0.75 0 0 1 17.6 6.28L20.25 9.75",
          "M13.75 14.25L16.4 17.72A0.75 0.75 0 0 0 17.6 17.72L20.25 14.25"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H3",
            "M2 8H4.75",
            "M2 11.5H6.5",
            "M10 6L11.148 4.545A1.085 1.085 0 0 1 12.852 4.545L14 6",
            "M10 10L11.148 11.455A1.085 1.085 0 0 0 12.852 11.455L14 10"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H4.5",
            "M3 10H6.5",
            "M3 14.5H8.5",
            "M12 7.75L13.3 5.85A1.45 1.45 0 0 1 15.7 5.85L17 7.75",
            "M12 12.25L13.3 14.15A1.45 1.45 0 0 0 15.7 14.15L17 12.25"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H5.75",
            "M4.25 12H8",
            "M4.25 16.5H10.25",
            "M14.25 9.25L15.71 7.16A1.57 1.57 0 0 1 18.29 7.16L19.75 9.25",
            "M14.25 14.75L15.71 16.84A1.57 1.57 0 0 0 18.29 16.84L19.75 14.75"
          ]
        }
      }
    },
    {
      id: "C",
      label: "descending · bars alone",
      note: "The mirror of B, and G's own bar order: long at the top shrinking down. Pair untouched. The risk this board exists to test is here — B and C differ only in the bars, so at 16 the whole distinction rests on a 2 · 2 · 1.75 unit difference in the top and bottom line.",
      box: {
        16: [
          14,
          9.736
        ],
        20: [
          16,
          11.57
        ],
        24: [
          18,
          13.54
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H6.875",
          "M1.625 8H5.125",
          "M1.625 11.5H3.375",
          "M9.625 6.375L11.51 3.994A0.625 0.625 0 0 1 12.49 3.994L14.375 6.375",
          "M9.625 9.625L11.51 12.006A0.625 0.625 0 0 0 12.49 12.006L14.375 9.625"
        ],
        20: [
          "M2.75 5.5H8.75",
          "M2.75 10H6.75",
          "M2.75 14.5H4.75",
          "M11.75 8L13.91 5.25A0.75 0.75 0 0 1 15.09 5.25L17.25 8",
          "M11.75 12L13.91 14.75A0.75 0.75 0 0 0 15.09 14.75L17.25 12"
        ],
        24: [
          "M3.75 7.5H10.75",
          "M3.75 12H8.5",
          "M3.75 16.5H6.25",
          "M13.75 9.75L16.4 6.28A0.75 0.75 0 0 1 17.6 6.28L20.25 9.75",
          "M13.75 14.25L16.4 17.72A0.75 0.75 0 0 0 17.6 17.72L20.25 14.25"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H6.5",
            "M2 8H4.75",
            "M2 11.5H3",
            "M10 6L11.148 4.545A1.085 1.085 0 0 1 12.852 4.545L14 6",
            "M10 10L11.148 11.455A1.085 1.085 0 0 0 12.852 11.455L14 10"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H8.5",
            "M3 10H6.5",
            "M3 14.5H4.5",
            "M12 7.75L13.3 5.85A1.45 1.45 0 0 1 15.7 5.85L17 7.75",
            "M12 12.25L13.3 14.15A1.45 1.45 0 0 0 15.7 14.15L17 12.25"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H10.25",
            "M4.25 12H8",
            "M4.25 16.5H5.75",
            "M14.25 9.25L15.71 7.16A1.57 1.57 0 0 1 18.29 7.16L19.75 9.25",
            "M14.25 14.75L15.71 16.84A1.57 1.57 0 0 0 18.29 16.84L19.75 14.75"
          ]
        }
      }
    },
    {
      id: "D",
      label: "ascending · mark too",
      note: "The bars step as in B AND the pair drops to a single up caret, moved so its ink sits on the canvas centre. The direction is then said twice, which is what the shipped `sort-ascending` does with its arrow. Costs the pair — the mark no longer says \"this column is sortable\", only \"it is sorted this way\".",
      box: {
        16: [
          14,
          9.736
        ],
        20: [
          16,
          11.57
        ],
        24: [
          18,
          13.54
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H3.375",
          "M1.625 8H5.125",
          "M1.625 11.5H6.875",
          "M9.625 6.375L11.51 3.994A0.625 0.625 0 0 1 12.49 3.994L14.375 6.375",
          "M12 3.757V12.243"
        ],
        20: [
          "M2.75 5.5H4.75",
          "M2.75 10H6.75",
          "M2.75 14.5H8.75",
          "M11.75 8L13.91 5.25A0.75 0.75 0 0 1 15.09 5.25L17.25 8",
          "M14.5 4.97V15.03"
        ],
        24: [
          "M3.75 7.5H6.25",
          "M3.75 12H8.5",
          "M3.75 16.5H10.75",
          "M13.75 9.75L16.4 6.28A0.75 0.75 0 0 1 17.6 6.28L20.25 9.75",
          "M17 5.98V18.02"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H3",
            "M2 8H4.75",
            "M2 11.5H6.5",
            "M10 6L11.148 4.545A1.085 1.085 0 0 1 12.852 4.545L14 6",
            "M12 4.132V11.868"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H4.5",
            "M3 10H6.5",
            "M3 14.5H8.5",
            "M12 7.75L13.3 5.85A1.45 1.45 0 0 1 15.7 5.85L17 7.75",
            "M14.5 5.22V14.78"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H5.75",
            "M4.25 12H8",
            "M4.25 16.5H10.25",
            "M14.25 9.25L15.71 7.16A1.57 1.57 0 0 1 18.29 7.16L19.75 9.25",
            "M17 6.48V17.52"
          ]
        }
      }
    },
    {
      id: "E",
      label: "descending · mark too",
      note: "The mirror of D: bars long to short, the same stem, the head pointing down. Read D and E side by side against B and C at 16 — that is the whole question.",
      box: {
        16: [
          14,
          9.736
        ],
        20: [
          16,
          11.57
        ],
        24: [
          18,
          13.54
        ]
      },
      masters: {
        16: [
          "M1.625 4.5H6.875",
          "M1.625 8H5.125",
          "M1.625 11.5H3.375",
          "M9.625 9.625L11.51 12.006A0.625 0.625 0 0 0 12.49 12.006L14.375 9.625",
          "M12 3.757V12.243"
        ],
        20: [
          "M2.75 5.5H8.75",
          "M2.75 10H6.75",
          "M2.75 14.5H4.75",
          "M11.75 12L13.91 14.75A0.75 0.75 0 0 0 15.09 14.75L17.25 12",
          "M14.5 4.97V15.03"
        ],
        24: [
          "M3.75 7.5H10.75",
          "M3.75 12H8.5",
          "M3.75 16.5H6.25",
          "M13.75 14.25L16.4 17.72A0.75 0.75 0 0 0 17.6 17.72L20.25 14.25",
          "M17 5.98V18.02"
        ]
      },
      filled: {
        16: {
          weight: 2,
          stroke: [
            "M2 4.5H6.5",
            "M2 8H4.75",
            "M2 11.5H3",
            "M10 10L11.148 11.455A1.085 1.085 0 0 0 12.852 11.455L14 10",
            "M12 4.132V11.868"
          ]
        },
        20: {
          weight: 2,
          stroke: [
            "M3 5.5H8.5",
            "M3 10H6.5",
            "M3 14.5H4.5",
            "M12 12.25L13.3 14.15A1.45 1.45 0 0 0 15.7 14.15L17 12.25",
            "M14.5 5.22V14.78"
          ]
        },
        24: {
          weight: 2.5,
          stroke: [
            "M4.25 7.5H10.25",
            "M4.25 12H8",
            "M4.25 16.5H5.75",
            "M14.25 14.75L15.71 16.84A1.57 1.57 0 0 0 18.29 16.84L19.75 14.75",
            "M17 6.48V17.52"
          ]
        }
      }
    }
  ]
};
