// compass-3 repair: in the filled 16 the white band round the needle's south island is 1.25 of air, under the 1.5 floor for a band between two filled parts (Maruti, 2026-09-28). Fix: the knocked-out needle grows 0.25 all round at 16 only (F), so the band is 1.5 and the island keeps its 1.78; F2 splits the quarter between needle and island. Every other master and style is byte-identical to S.
export default {
  "concept": "compass-3",
  "set": {
    "S": "compass-3",
    "F": "compass-3",
    "F2": "compass-3"
  },
  "question": "Filled 16: the white band round the needle is 1.25, under the 1.5 floor for a band between filled parts. Approve F (the knocked-out needle 0.25 larger all round, island unchanged at 1.78), judged against S at 16? F2 splits it: needle 0.125 larger, island 0.125 smaller (1.61).",
  "candidates": [
    {
      "id": "S",
      "label": "North solid, south outlined",
      "tags": [
        "compass",
        "navigation",
        "explore",
        "direction",
        "diagonal",
        "diamond",
        "split",
        "two-tone"
      ],
      "note": "What the eye sees: round 1's B filled turned white-on-dark — the north half a solid white triangle, the south half only a white outline with a dark triangle of disc left inside it, so the needle reads as one filled half and one open half, the classic two-tone needle. The white line round the south island is the outline's needle stroke, 1.5 · 1.5 · 1.25 wide, and the island is the outline's own south counter (sharp corners, as every stroked counter is): at 24 and 20 it stops at the split line's edge and holds a circle of 2.82 · 1.63; at 16, with no split line, it runs to the waist and holds 1.78. At 20 and 16 that island is under two pixels across, and the white band round it at 16 is 1.25, under the 1.5 floor for a strip between parts — the busiest answer at small sizes. Filled: the disc solid (ink ⌀20 · 16 · 14, as clock and target), the needle knocked out at the outline's ink size, so the filled ink box is the outline's at every master. Disc left round the tips 3 · 3 · 2.75. Outline: B from round 1, byte for byte — the 45° diamond needle (tip 50°, edges at 20° and 70°, cursor's angle exception) with a line across its waist at 24 and 20; at 16 the line would leave each half 1.41, under the 1.5 floor, so the 16 has no line. Needle ink 14 · 10 · 8.5 long, tips 1.5 inside the ring; ring is clock's (ink ⌀20 · 16 · 14).",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M10.709 6.092L9.576 9.203A0.625 0.625 0 0 1 9.203 9.576L6.092 10.709A0.625 0.625 0 0 1 5.291 9.908L6.424 6.797A0.625 0.625 0 0 1 6.797 6.424L9.908 5.291A0.625 0.625 0 0 1 10.709 6.092Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M13.18 7.78L11.86 11.41A0.75 0.75 0 0 1 11.41 11.86L7.78 13.18A0.75 0.75 0 0 1 6.82 12.22L8.14 8.59A0.75 0.75 0 0 1 8.59 8.14L12.22 6.82A0.75 0.75 0 0 1 13.18 7.78Z",
          "M11.68 11.68L8.32 8.32"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M16.59 8.37L14.52 14.07A0.75 0.75 0 0 1 14.07 14.52L8.37 16.59A0.75 0.75 0 0 1 7.41 15.63L9.48 9.93A0.75 0.75 0 0 1 9.93 9.48L15.63 7.41A0.75 0.75 0 0 1 16.59 8.37Z",
          "M14.34 14.34L9.66 9.66"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM11.296 6.306L10.164 9.417A1.25 1.25 0 0 1 9.417 10.164L6.306 11.296A1.25 1.25 0 0 1 4.704 9.694L5.836 6.583A1.25 1.25 0 0 1 6.583 5.836L9.694 4.704A1.25 1.25 0 0 1 11.296 6.306ZM5.879 10.121L8.989 8.989L7.011 7.011L5.879 10.121Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM13.88 8.04L12.56 11.67A1.5 1.5 0 0 1 11.67 12.56L8.04 13.88A1.5 1.5 0 0 1 6.12 11.96L7.44 8.33A1.5 1.5 0 0 1 8.33 7.44L11.96 6.12A1.5 1.5 0 0 1 13.88 8.04ZM7.53 12.47L10.38 11.44L8.56 9.62L7.53 12.47Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM17.3 8.62L15.22 14.33A1.5 1.5 0 0 1 14.33 15.22L8.62 17.3A1.5 1.5 0 0 1 6.7 15.38L8.78 9.67A1.5 1.5 0 0 1 9.67 8.78L15.38 6.7A1.5 1.5 0 0 1 17.3 8.62ZM8.11 15.89L13.04 14.1L9.9 10.96L8.11 15.89Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "F",
      "label": "North solid, south outlined",
      "tags": [
        "compass",
        "navigation",
        "explore",
        "direction",
        "diagonal",
        "diamond",
        "split",
        "two-tone"
      ],
      "note": "What the eye sees: round 1's B filled turned white-on-dark — the north half a solid white triangle, the south half only a white outline with a dark triangle of disc left inside it, so the needle reads as one filled half and one open half, the classic two-tone needle. The white line round the south island is 1.5 wide at every master: the outline's needle stroke at 24 and 20; at 16, where the stroke is 1.25, the knocked-out needle stands 0.25 proud of the outline's ink all round (knock-out corners r1.5 on the outline's own corner centres, was r1.25; its decimals 11.531, 6.392, 10.399, 9.502, 4.469, 9.608, 5.601, 6.498 are those centres moved 1.5 out square to the 20° and 70° edges), so the band holds the 1.5 floor for a strip between parts (2026-09-28; was 1.25), and the island is the outline's own south counter (sharp corners, as every stroked counter is): at 24 and 20 it stops at the split line's edge and holds a circle of 2.82 · 1.63; at 16, with no split line, it runs to the waist and holds 1.78. At 20 and 16 that island is under two pixels across — the busiest answer at small sizes; at 16 it keeps its 1.78, and the needle grows round it rather than the island shrinking (an island cut 0.25 smaller would hold 1.43). Filled: the disc solid (ink ⌀20 · 16 · 14, as clock and target), the needle knocked out at the outline's ink size at 24 and 20 and 0.25 larger all round at 16 (9 long, was 8.5); the disc is the ink, so the filled ink box is the outline's at every master. Disc left round the tips 3 · 3 · 2.5 (2.75 before the 16 band was widened). Outline: B from round 1, byte for byte — the 45° diamond needle (tip 50°, edges at 20° and 70°, cursor's angle exception) with a line across its waist at 24 and 20; at 16 the line would leave each half 1.41, under the 1.5 floor, so the 16 has no line. Needle ink 14 · 10 · 8.5 long, tips 1.5 inside the ring; ring is clock's (ink ⌀20 · 16 · 14). (recommended: only the filled 16 changes; the island keeps its 1.78 and the needle grows a quarter all round, which also brings the 16 needle to 0.64 of the disc, between 20's 0.63 and 24's 0.7)",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M10.709 6.092L9.576 9.203A0.625 0.625 0 0 1 9.203 9.576L6.092 10.709A0.625 0.625 0 0 1 5.291 9.908L6.424 6.797A0.625 0.625 0 0 1 6.797 6.424L9.908 5.291A0.625 0.625 0 0 1 10.709 6.092Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M13.18 7.78L11.86 11.41A0.75 0.75 0 0 1 11.41 11.86L7.78 13.18A0.75 0.75 0 0 1 6.82 12.22L8.14 8.59A0.75 0.75 0 0 1 8.59 8.14L12.22 6.82A0.75 0.75 0 0 1 13.18 7.78Z",
          "M11.68 11.68L8.32 8.32"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M16.59 8.37L14.52 14.07A0.75 0.75 0 0 1 14.07 14.52L8.37 16.59A0.75 0.75 0 0 1 7.41 15.63L9.48 9.93A0.75 0.75 0 0 1 9.93 9.48L15.63 7.41A0.75 0.75 0 0 1 16.59 8.37Z",
          "M14.34 14.34L9.66 9.66"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM11.531 6.392L10.399 9.502A1.5 1.5 0 0 1 9.502 10.399L6.392 11.531A1.5 1.5 0 0 1 4.469 9.608L5.601 6.498A1.5 1.5 0 0 1 6.498 5.601L9.608 4.469A1.5 1.5 0 0 1 11.531 6.392ZM5.879 10.121L8.989 8.989L7.011 7.011L5.879 10.121Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM13.88 8.04L12.56 11.67A1.5 1.5 0 0 1 11.67 12.56L8.04 13.88A1.5 1.5 0 0 1 6.12 11.96L7.44 8.33A1.5 1.5 0 0 1 8.33 7.44L11.96 6.12A1.5 1.5 0 0 1 13.88 8.04ZM7.53 12.47L10.38 11.44L8.56 9.62L7.53 12.47Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM17.3 8.62L15.22 14.33A1.5 1.5 0 0 1 14.33 15.22L8.62 17.3A1.5 1.5 0 0 1 6.7 15.38L8.78 9.67A1.5 1.5 0 0 1 9.67 8.78L15.38 6.7A1.5 1.5 0 0 1 17.3 8.62ZM8.11 15.89L13.04 14.1L9.9 10.96L8.11 15.89Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "F2",
      "label": "North solid, south outlined",
      "tags": [
        "compass",
        "navigation",
        "explore",
        "direction",
        "diagonal",
        "diamond",
        "split",
        "two-tone"
      ],
      "note": "What the eye sees: round 1's B filled turned white-on-dark — the north half a solid white triangle, the south half only a white outline with a dark triangle of disc left inside it, so the needle reads as one filled half and one open half, the classic two-tone needle. The white line round the south island is 1.5 wide at every master: the outline's needle stroke at 24 and 20; at 16, where the stroke is 1.25, the band is split: the knocked-out needle stands 0.125 proud of the outline's ink all round (knock-out corners r1.375 on the outline's own corner centres; decimals 11.413, 6.349, 10.281, 9.459, 4.587, 9.651, 5.719, 6.541 are those centres moved 1.375 out square to the edges) and the island's two outer sides move 0.125 in (corners 6.088,9.912 · 8.892,8.892 · 7.108,7.108, the counter's corners moved 0.125 in along its sides' normals), so the band holds the 1.5 floor for a strip between parts (2026-09-28; was 1.25). The island is otherwise the outline's own south counter (sharp corners, as every stroked counter is): at 24 and 20 it stops at the split line's edge and holds a circle of 2.82 · 1.63; at 16, with no split line, it runs to the waist and holds 1.61 (1.78 before the band was widened). At 20 and 16 that island is under two pixels across — the busiest answer at small sizes. Filled: the disc solid (ink ⌀20 · 16 · 14, as clock and target), the needle knocked out at the outline's ink size at 24 and 20 and 0.125 larger all round at 16 (8.75 long, was 8.5); the disc is the ink, so the filled ink box is the outline's at every master. Disc left round the tips 3 · 3 · 2.625 (2.75 before the 16 band was widened). Outline: B from round 1, byte for byte — the 45° diamond needle (tip 50°, edges at 20° and 70°, cursor's angle exception) with a line across its waist at 24 and 20; at 16 the line would leave each half 1.41, under the 1.5 floor, so the 16 has no line. Needle ink 14 · 10 · 8.5 long, tips 1.5 inside the ring; ring is clock's (ink ⌀20 · 16 · 14). (alternative: splits the quarter between needle and island; the needle stays nearer the outline's, the island drops to 1.61)",
      "masters": {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M10.709 6.092L9.576 9.203A0.625 0.625 0 0 1 9.203 9.576L6.092 10.709A0.625 0.625 0 0 1 5.291 9.908L6.424 6.797A0.625 0.625 0 0 1 6.797 6.424L9.908 5.291A0.625 0.625 0 0 1 10.709 6.092Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M13.18 7.78L11.86 11.41A0.75 0.75 0 0 1 11.41 11.86L7.78 13.18A0.75 0.75 0 0 1 6.82 12.22L8.14 8.59A0.75 0.75 0 0 1 8.59 8.14L12.22 6.82A0.75 0.75 0 0 1 13.18 7.78Z",
          "M11.68 11.68L8.32 8.32"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M16.59 8.37L14.52 14.07A0.75 0.75 0 0 1 14.07 14.52L8.37 16.59A0.75 0.75 0 0 1 7.41 15.63L9.48 9.93A0.75 0.75 0 0 1 9.93 9.48L15.63 7.41A0.75 0.75 0 0 1 16.59 8.37Z",
          "M14.34 14.34L9.66 9.66"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM11.413 6.349L10.281 9.459A1.375 1.375 0 0 1 9.459 10.281L6.349 11.413A1.375 1.375 0 0 1 4.587 9.651L5.719 6.541A1.375 1.375 0 0 1 6.541 5.719L9.651 4.587A1.375 1.375 0 0 1 11.413 6.349ZM6.088 9.912L8.892 8.892L7.108 7.108L6.088 9.912Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM13.88 8.04L12.56 11.67A1.5 1.5 0 0 1 11.67 12.56L8.04 13.88A1.5 1.5 0 0 1 6.12 11.96L7.44 8.33A1.5 1.5 0 0 1 8.33 7.44L11.96 6.12A1.5 1.5 0 0 1 13.88 8.04ZM7.53 12.47L10.38 11.44L8.56 9.62L7.53 12.47Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM17.3 8.62L15.22 14.33A1.5 1.5 0 0 1 14.33 15.22L8.62 17.3A1.5 1.5 0 0 1 6.7 15.38L8.78 9.67A1.5 1.5 0 0 1 9.67 8.78L15.38 6.7A1.5 1.5 0 0 1 17.3 8.62ZM8.11 15.89L13.04 14.1L9.9 10.96L8.11 15.89Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
