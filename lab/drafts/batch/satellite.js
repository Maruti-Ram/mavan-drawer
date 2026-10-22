// satellite: the word names a spacecraft, a ground dish, a body in orbit and a map layer, so the picture chosen decides which one the set means — and which of `satellite-dish` / `orbit` are left to take the others later.
export default {
  "concept": "satellite",
  "question": "Which picture says satellite: the craft (A on 0/90 axes, B on the diagonal), the dish on the ground (C), a body in orbit (D), or the satellite map view (E)?",
  "candidates": [
    {
      "id": "A",
      "label": "Craft sending signal",
      "tags": [
        "craft",
        "spacecraft",
        "solar panel",
        "signal",
        "broadcast",
        "space"
      ],
      "note": "Rhythm: the signal keeps cast's (and cast-mobile's) air of 1.5 — antenna tip to first arc 1.5, arc to arc 1.5, pitch 3 · 3 · 2.75; three arcs at 24 (radii 3/6/9), two at 20 and 16 (3/6 · 2.75/5.5); a third does not fit at 20 or 16. Craft on 0/90 axes so every edge lands on the pixel grid at 16: square body 6.5 · 5.5 · 4.75 wide (4.5 tall at 16, to keep the arc clear), wings 6×4.5 · 4.5×3.5 · 4×3 on its side walls, centred on its height; body and wings are one path. Antenna 3 · 3 · 2.75 down from the body; the signal beams down-right, away from the craft and the way Material and Tabler point it. A signal pointing up made it read as a wifi router. Air from craft to arcs: 1.5 · 1.51 · 1.53 (first), 2.5 · 2.5 · 2.25 (others). Ink 20×20 · 16×16 · 14×14 (circle keyline), box-centred, but the ink mass sits 1.50,−2.12 · 0.79,−1.98 · 0.75,−1.83 from centre: top-heavy, because the arcs are light. Filled: body solid; wings solid, cut 1.5 back from the body (4.5 · 3 · 2.5 long); antenna and arcs at 1.5 · 1.5 · 1.25. Who: Material satellite_alt, Tabler satellite and Nucleo satellite (craft and arcs, drawn on the diagonal there). It reads as a craft at real 16 where B blurs.",
      "masters": {
        "16": [
          "M5.625 1.625L10.375 1.625L10.375 6.125L5.625 6.125ZM5.625 2.375L1.625 2.375L1.625 5.375L5.625 5.375M10.375 2.375L14.375 2.375L14.375 5.375L10.375 5.375",
          "M8 6.125L8 8.875",
          "M10.75 8.875A2.75 2.75 0 0 1 8 11.625",
          "M13.5 8.875A5.5 5.5 0 0 1 8 14.375"
        ],
        "20": [
          "M7.25 2.75L12.75 2.75L12.75 8.25L7.25 8.25ZM7.25 3.75L2.75 3.75L2.75 7.25L7.25 7.25M12.75 3.75L17.25 3.75L17.25 7.25L12.75 7.25",
          "M10 8.25L10 11.25",
          "M13 11.25A3 3 0 0 1 10 14.25",
          "M16 11.25A6 6 0 0 1 10 17.25"
        ],
        "24": [
          "M8.75 2.75L15.25 2.75L15.25 9.25L8.75 9.25ZM8.75 3.75L2.75 3.75L2.75 8.25L8.75 8.25M15.25 3.75L21.25 3.75L21.25 8.25L15.25 8.25",
          "M12 9.25L12 12.25",
          "M15 12.25A3 3 0 0 1 12 15.25",
          "M18 12.25A6 6 0 0 1 12 18.25",
          "M21 12.25A9 9 0 0 1 12 21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.625 1L10.375 1A0.625 0.625 0 0 1 11 1.625L11 6.125A0.625 0.625 0 0 1 10.375 6.75L5.625 6.75A0.625 0.625 0 0 1 5 6.125L5 1.625A0.625 0.625 0 0 1 5.625 1ZM3.5 1.75L1.625 1.75A0.625 0.625 0 0 0 1 2.375L1 5.375A0.625 0.625 0 0 0 1.625 6L3.5 6ZM12.5 1.75L14.375 1.75A0.625 0.625 0 0 1 15 2.375L15 5.375A0.625 0.625 0 0 1 14.375 6L12.5 6Z"
          ],
          "stroke": [
            "M8 6.125L8 8.875",
            "M10.75 8.875A2.75 2.75 0 0 1 8 11.625",
            "M13.5 8.875A5.5 5.5 0 0 1 8 14.375"
          ]
        },
        "20": {
          "fill": [
            "M7.25 2L12.75 2A0.75 0.75 0 0 1 13.5 2.75L13.5 8.25A0.75 0.75 0 0 1 12.75 9L7.25 9A0.75 0.75 0 0 1 6.5 8.25L6.5 2.75A0.75 0.75 0 0 1 7.25 2ZM5 3L2.75 3A0.75 0.75 0 0 0 2 3.75L2 7.25A0.75 0.75 0 0 0 2.75 8L5 8ZM15 3L17.25 3A0.75 0.75 0 0 1 18 3.75L18 7.25A0.75 0.75 0 0 1 17.25 8L15 8Z"
          ],
          "stroke": [
            "M10 8.25L10 11.25",
            "M13 11.25A3 3 0 0 1 10 14.25",
            "M16 11.25A6 6 0 0 1 10 17.25"
          ]
        },
        "24": {
          "fill": [
            "M8.75 2L15.25 2A0.75 0.75 0 0 1 16 2.75L16 9.25A0.75 0.75 0 0 1 15.25 10L8.75 10A0.75 0.75 0 0 1 8 9.25L8 2.75A0.75 0.75 0 0 1 8.75 2ZM6.5 3L2.75 3A0.75 0.75 0 0 0 2 3.75L2 8.25A0.75 0.75 0 0 0 2.75 9L6.5 9ZM17.5 3L21.25 3A0.75 0.75 0 0 1 22 3.75L22 8.25A0.75 0.75 0 0 1 21.25 9L17.5 9Z"
          ],
          "stroke": [
            "M12 9.25L12 12.25",
            "M15 12.25A3 3 0 0 1 12 15.25",
            "M18 12.25A6 6 0 0 1 12 18.25",
            "M21 12.25A9 9 0 0 1 12 21.25"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Craft on the diagonal",
      "tags": [
        "craft",
        "spacecraft",
        "solar panel",
        "signal",
        "broadcast",
        "space"
      ],
      "note": "Rhythm: the signal keeps cast's (and cast-mobile's) air of 1.5 — antenna tip to first arc 1.5 and arc to arc 1.5, pitch 3 · 3 · 2.75 at 24 · 20 · 16 (radii 3/6 · 3/6 · 2.75/5.5, concentric on the antenna tip, a quarter each facing down-right); arcs clear the craft by 4.16 · 3.11 · 3.38. Craft on the 45° diagonal: body 4.24×6.36 · 3.54×4.95 · 2.83×3.89, panels on its long walls 5.66×4.95 · 3.54×3.54 · 2.83×2.83, the body standing 0.71 · 0.71 · 0.53 proud of each panel side, antenna 3.54 · 2.47 · 2.65; body and panels are one path, so the T-joins share the body's ink. Ink 19.5×19.5 · 16×16 · 14×14 (circle keyline), box-centred; ink mass 0.27 · −0.10 · −0.22 off centre along the diagonal. Panels undivided: a cut across leaves 1.33 · 0.27 · 0.16 of air. Filled: body and panels solid, each panel cut 1.5 back from the body (solid 4.16 · 2.04 · 1.33 long), antenna and arcs at 1.5 · 1.5 · 1.25. Off-grid values are the filled corners' 0.75 · 0.75 · 0.625 rounding at 45°. Who: Material satellite_alt, Tabler satellite, Nucleo satellite, Lucide satellite (one arc). The construction most sets draw, but at real 16 the 45° panels (2.83 square, 1.58 inside air) blur into one blot; kept so the diagonal can be compared with A.",
      "masters": {
        "16": [
          "M3.25 5.25L5.25 3.25L8 6L6 8ZM5.625 3.625L7.625 1.625L9.625 3.625L7.625 5.625M5.625 7.625L3.625 9.625L1.625 7.625L3.625 5.625",
          "M7 7L8.875 8.875",
          "M8.875 11.625A2.75 2.75 0 0 0 11.625 8.875",
          "M8.875 14.375A5.5 5.5 0 0 0 14.375 8.875"
        ],
        "20": [
          "M4.75 7.25L7.25 4.75L10.75 8.25L8.25 10.75ZM7.75 5.25L10.25 2.75L12.75 5.25L10.25 7.75M7.75 10.25L5.25 12.75L2.75 10.25L5.25 7.75",
          "M9.5 9.5L11.25 11.25",
          "M11.25 14.25A3 3 0 0 0 14.25 11.25",
          "M11.25 17.25A6 6 0 0 0 17.25 11.25"
        ],
        "24": [
          "M6.5 9.5L9.5 6.5L14 11L11 14ZM10 7L14 3L17.5 6.5L13.5 10.5M10.5 13.5L6.5 17.5L3 14L7 10",
          "M12.5 12.5L15 15",
          "M15 18A3 3 0 0 0 18 15",
          "M15 21A6 6 0 0 0 21 15"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2.808 4.808L4.808 2.808A0.625 0.625 0 0 1 5.692 2.808L8.442 5.558A0.625 0.625 0 0 1 8.442 6.442L6.442 8.442A0.625 0.625 0 0 1 5.558 8.442L2.808 5.692A0.625 0.625 0 0 1 2.808 4.808ZM6.686 1.68L7.183 1.183A0.625 0.625 0 0 1 8.067 1.183L10.067 3.183A0.625 0.625 0 0 1 10.067 4.067L9.57 4.564ZM4.564 9.57L4.067 10.067A0.625 0.625 0 0 1 3.183 10.067L1.183 8.067A0.625 0.625 0 0 1 1.183 7.183L1.68 6.686Z"
          ],
          "stroke": [
            "M7 7L8.875 8.875",
            "M8.875 11.625A2.75 2.75 0 0 0 11.625 8.875",
            "M8.875 14.375A5.5 5.5 0 0 0 14.375 8.875"
          ]
        },
        "20": {
          "fill": [
            "M4.22 6.72L6.72 4.22A0.75 0.75 0 0 1 7.78 4.22L11.28 7.72A0.75 0.75 0 0 1 11.28 8.78L8.78 11.28A0.75 0.75 0 0 1 7.72 11.28L4.22 7.78A0.75 0.75 0 0 1 4.22 6.72ZM8.81 3.13L9.72 2.22A0.75 0.75 0 0 1 10.78 2.22L13.28 4.72A0.75 0.75 0 0 1 13.28 5.78L12.37 6.69ZM6.69 12.37L5.78 13.28A0.75 0.75 0 0 1 4.72 13.28L2.22 10.78A0.75 0.75 0 0 1 2.22 9.72L3.13 8.81Z"
          ],
          "stroke": [
            "M9.5 9.5L11.25 11.25",
            "M11.25 14.25A3 3 0 0 0 14.25 11.25",
            "M11.25 17.25A6 6 0 0 0 17.25 11.25"
          ]
        },
        "24": {
          "fill": [
            "M5.97 8.97L8.97 5.97A0.75 0.75 0 0 1 10.03 5.97L14.53 10.47A0.75 0.75 0 0 1 14.53 11.53L11.53 14.53A0.75 0.75 0 0 1 10.47 14.53L5.97 10.03A0.75 0.75 0 0 1 5.97 8.97ZM11.06 4.88L13.47 2.47A0.75 0.75 0 0 1 14.53 2.47L18.03 5.97A0.75 0.75 0 0 1 18.03 7.03L15.62 9.44ZM9.44 15.62L7.03 18.03A0.75 0.75 0 0 1 5.97 18.03L2.47 14.53A0.75 0.75 0 0 1 2.47 13.47L4.88 11.06Z"
          ],
          "stroke": [
            "M12.5 12.5L15 15",
            "M15 18A3 3 0 0 0 18 15",
            "M15 21A6 6 0 0 0 21 15"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Satellite dish",
      "tags": [
        "dish",
        "antenna",
        "receiver",
        "broadcast",
        "tv",
        "ground station"
      ],
      "note": "Rhythm: cast's (and cast-mobile's) air of 1.5 — feed tip to first arc 1.5 and arc to arc 1.5, pitch 3 · 3 · 2.75, at 24 · 20 · 16 (radii 3/6 · 3/6 · 2.75/5.5, concentric on the feed tip, a quarter each facing up-right along the feed); arcs clear the dish by 4.86 · 3.80 · 3.52. Dish a half-disc, radius 9.19 · 6.01 · 5.13, chord on the 45° line; feed from the chord's middle, 4.24 · 3.18 · 2.83 long. Ink 19.69² · 15.76² · 13.88² (circle keyline; the bowl's radius is √2 × a grid step, so its edge is not whole), centre within 0.12 of the canvas centre. Ink mass −0.19, 0.16 (outline); the filled bowl pulls it 1.5 · 1.06 · 1.06 toward the lower left, as cast's filled screen does — not shifted, since the filled box must equal the outline's. Filled: bowl solid, feed and arcs at 1.5 · 1.5 · 1.25. Who: Lucide satellite-dish, Font Awesome satellite-dish, Nucleo satellite-dish. Says the dish on the roof (TV, receiving) more than the craft — the natural `satellite-dish` if the craft wins. (recommended) — at real 16 it is the clearest and best-balanced of the five: one solid shape plus two arcs, mass within 0.26 of centre in outline, where A's craft sits about 2 above centre.",
      "masters": {
        "16": [
          "M3.25 5.5A5.127 5.127 0 0 0 3.25 12.75A5.127 5.127 0 0 0 10.5 12.75Z",
          "M6.875 9.125L8.875 7.125",
          "M11.625 7.125A2.75 2.75 0 0 0 8.875 4.375",
          "M14.375 7.125A5.5 5.5 0 0 0 8.875 1.625"
        ],
        "20": [
          "M4.75 6.75A6.01 6.01 0 0 0 4.75 15.25A6.01 6.01 0 0 0 13.25 15.25Z",
          "M9 11L11.25 8.75",
          "M14.25 8.75A3 3 0 0 0 11.25 5.75",
          "M17.25 8.75A6 6 0 0 0 11.25 2.75"
        ],
        "24": [
          "M5.5 5.5A9.19 9.19 0 0 0 5.5 18.5A9.19 9.19 0 0 0 18.5 18.5Z",
          "M12 12L15 9",
          "M18 9A3 3 0 0 0 15 6",
          "M21 9A6 6 0 0 0 15 3"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.692 5.058L10.942 12.308A0.625 0.625 0 0 1 10.942 13.192A5.752 5.752 0 0 1 2.808 13.192A5.752 5.752 0 0 1 2.808 5.058A0.625 0.625 0 0 1 3.692 5.058Z"
          ],
          "stroke": [
            "M6.875 9.125L8.875 7.125",
            "M11.625 7.125A2.75 2.75 0 0 0 8.875 4.375",
            "M14.375 7.125A5.5 5.5 0 0 0 8.875 1.625"
          ]
        },
        "20": {
          "fill": [
            "M5.28 6.22L13.78 14.72A0.75 0.75 0 0 1 13.78 15.78A6.76 6.76 0 0 1 4.22 15.78A6.76 6.76 0 0 1 4.22 6.22A0.75 0.75 0 0 1 5.28 6.22Z"
          ],
          "stroke": [
            "M9 11L11.25 8.75",
            "M14.25 8.75A3 3 0 0 0 11.25 5.75",
            "M17.25 8.75A6 6 0 0 0 11.25 2.75"
          ]
        },
        "24": {
          "fill": [
            "M6.03 4.97L19.03 17.97A0.75 0.75 0 0 1 19.03 19.03A9.94 9.94 0 0 1 4.97 19.03A9.94 9.94 0 0 1 4.97 4.97A0.75 0.75 0 0 1 6.03 4.97Z"
          ],
          "stroke": [
            "M12 12L15 9",
            "M18 9A3 3 0 0 0 15 6",
            "M21 9A6 6 0 0 0 15 3"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Body in orbit",
      "tags": [
        "orbit",
        "planet",
        "moon",
        "space"
      ],
      "note": "Rhythm: the ring stops 1.5 short of the satellite on both sides at every master (opened 56° · 72° · 76°); planet to satellite 2.75 · 1.5 · 1.5, planet to ring 4.25 · 3 · 2.88. Ring r 9.25 · 7.25 · 6.375 (the set's circle, as globe), planet r 3.5 · 2.75 · 2.25, satellite a small ring r 1.5 · 1.5 · 1.375 (hole 1.5 at every master) sitting on the orbit at 45° up-right. Ink 20×20 · 16×16 · 14×14 (circle keyline); ink mass 0.12, −0.15 toward the satellite. Filled: planet ⌀8.5 · 7 · 5.75 and satellite ⌀4.5 · 4.5 · 4 solid, white between them 2.75 · 1.5 · 1.5, ring at the outline weight. Who: Lucide orbit, Material Symbols orbit. Says 'in orbit' more than the object, and at a glance it is close to a target or a radio button — the natural `orbit` if the craft wins.",
      "masters": {
        "16": [
          "M14.324 7.196A6.375 6.375 0 1 1 8.804 1.676",
          "M5.75 8A2.25 2.25 0 1 0 10.25 8A2.25 2.25 0 1 0 5.75 8Z",
          "M11.133 3.492A1.375 1.375 0 1 0 13.883 3.492A1.375 1.375 0 1 0 11.133 3.492Z"
        ],
        "20": [
          "M17.16 8.89A7.25 7.25 0 1 1 11.11 2.84",
          "M7.25 10A2.75 2.75 0 1 0 12.75 10A2.75 2.75 0 1 0 7.25 10Z",
          "M13.63 4.87A1.5 1.5 0 1 0 16.63 4.87A1.5 1.5 0 1 0 13.63 4.87Z"
        ],
        "24": [
          "M20.85 9.32A9.25 9.25 0 1 1 14.68 3.15",
          "M8.5 12A3.5 3.5 0 1 0 15.5 12A3.5 3.5 0 1 0 8.5 12Z",
          "M17.04 5.46A1.5 1.5 0 1 0 20.04 5.46A1.5 1.5 0 1 0 17.04 5.46Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.125 8A2.875 2.875 0 1 0 10.875 8A2.875 2.875 0 1 0 5.125 8ZM10.508 3.492A2 2 0 1 0 14.508 3.492A2 2 0 1 0 10.508 3.492Z"
          ],
          "stroke": [
            "M14.324 7.196A6.375 6.375 0 1 1 8.804 1.676"
          ]
        },
        "20": {
          "fill": [
            "M6.5 10A3.5 3.5 0 1 0 13.5 10A3.5 3.5 0 1 0 6.5 10ZM12.88 4.87A2.25 2.25 0 1 0 17.38 4.87A2.25 2.25 0 1 0 12.88 4.87Z"
          ],
          "stroke": [
            "M17.16 8.89A7.25 7.25 0 1 1 11.11 2.84"
          ]
        },
        "24": {
          "fill": [
            "M7.75 12A4.25 4.25 0 1 0 16.25 12A4.25 4.25 0 1 0 7.75 12ZM16.29 5.46A2.25 2.25 0 1 0 20.79 5.46A2.25 2.25 0 1 0 16.29 5.46Z"
          ],
          "stroke": [
            "M20.85 9.32A9.25 9.25 0 1 1 14.68 3.15"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Satellite map view",
      "tags": [
        "satellite view",
        "map layer",
        "aerial",
        "imagery",
        "image"
      ],
      "note": "Rhythm: the shipped `image` frame and mountain verbatim (18 · 14 · 12, radius 2.5 · 2 · 1.5), its sun replaced by arcs centred on the frame's corner point, ends landing on the wall centrelines as cast's do: radii 4.5/7.5 · 4/7 · 3.375, arc to arc 1.5; white between the frame corner and the first arc 1.96 · 1.67 · 1.5; second arc to the mountain 4.61 · 1.75. One arc at 16: a second would come 1.29 from the mountain. Ink 18×18 · 14×14 · 12×12 (square keyline), as image. Filled: image-filled with the arcs cut through to the edge as 1.5 white bands (as image's mountain cut), material between the bands 1.5 at 24 and 20; ink mass 0.38 · 0.40 · 0.13 right of centre. Who: Material Icons satellite (Google Maps' satellite layer). Says satellite imagery, not the object; only useful if the set's satellite means the map layer.",
      "masters": {
        "16": [
          "M4.125 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 11.875A1.5 1.5 0 0 1 11.875 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M4.125 13.375L8.793 8.707A1 1 0 0 1 10.207 8.707L13.375 11.875",
          "M6 2.625A3.375 3.375 0 0 1 2.625 6"
        ],
        "20": [
          "M5.75 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 14.25A2 2 0 0 1 14.25 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 5.75A2 2 0 0 1 5.75 3.75Z",
          "M5.75 16.25L11.12 10.88A1.25 1.25 0 0 1 12.88 10.88L16.25 14.25",
          "M7.75 3.75A4 4 0 0 1 3.75 7.75",
          "M10.75 3.75A7 7 0 0 1 3.75 10.75"
        ],
        "24": [
          "M6.25 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 17.75A2.5 2.5 0 0 1 17.75 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M6.5 20.25L13.69 13.06A1.5 1.5 0 0 1 15.81 13.06L20.25 17.5",
          "M8.25 3.75A4.5 4.5 0 0 1 3.75 8.25",
          "M11.25 3.75A7.5 7.5 0 0 1 3.75 11.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 5.175L2 4.125A2.125 2.125 0 0 1 4.125 2L5.175 2A2.625 2.625 0 0 1 2 5.175ZM2 6.702A4.125 4.125 0 0 0 6.702 2L11.875 2A2.125 2.125 0 0 1 14 4.125L14 10.232A0.5 0.5 0 0 1 13.146 10.586L10.737 8.177A1.75 1.75 0 0 0 8.263 8.177L3.203 13.236A0.5 0.5 0 0 1 2.458 13.192A2.125 2.125 0 0 1 2 11.875L2 6.702Z",
            "M13.192 13.542A2.125 2.125 0 0 1 11.875 14L5.768 14A0.5 0.5 0 0 1 5.414 13.146L9.323 9.237A0.25 0.25 0 0 1 9.677 9.237L13.236 12.797A0.5 0.5 0 0 1 13.192 13.542Z"
          ]
        },
        "20": {
          "fill": [
            "M3 6.91L3 5.75A2.75 2.75 0 0 1 5.75 3L6.91 3A3.25 3.25 0 0 1 3 6.91ZM3 9.95L3 8.44A4.75 4.75 0 0 0 8.44 3L9.95 3A6.25 6.25 0 0 1 3 9.95ZM3 11.46A7.75 7.75 0 0 0 11.46 3L14.25 3A2.75 2.75 0 0 1 17 5.75L17 12.73A0.5 0.5 0 0 1 16.15 13.09L13.41 10.35A2 2 0 0 0 10.59 10.35L4.63 16.31A0.5 0.5 0 0 1 3.95 16.33A2.75 2.75 0 0 1 3 14.25L3 11.46Z",
            "M16.33 16.05A2.75 2.75 0 0 1 14.25 17L7.27 17A0.5 0.5 0 0 1 6.91 16.15L11.65 11.41A0.5 0.5 0 0 1 12.35 11.41L16.31 15.37A0.5 0.5 0 0 1 16.33 16.05Z"
          ]
        },
        "24": {
          "fill": [
            "M3 7.42L3 6.25A3.25 3.25 0 0 1 6.25 3L7.42 3A3.75 3.75 0 0 1 3 7.42ZM3 10.46L3 8.95A5.25 5.25 0 0 0 8.95 3L10.46 3A6.75 6.75 0 0 1 3 10.46ZM3 11.97A8.25 8.25 0 0 0 11.97 3L17.75 3A3.25 3.25 0 0 1 21 6.25L21 15.98A0.5 0.5 0 0 1 20.15 16.34L16.34 12.53A2.25 2.25 0 0 0 13.16 12.53L5.21 20.48A0.5 0.5 0 0 1 4.61 20.55A3.25 3.25 0 0 1 3 17.75L3 11.97Z",
            "M20.55 19.39A3.25 3.25 0 0 1 17.75 21L8.02 21A0.5 0.5 0 0 1 7.66 20.15L14.22 13.59A0.75 0.75 0 0 1 15.28 13.59L20.48 18.79A0.5 0.5 0 0 1 20.55 19.39Z"
          ]
        }
      }
    }
  ]
};
