// aperture — a one-picture concept: every set draws the camera iris and differs only in blade count and straight or curved
// blades. At 16 the straight irises (five, six, curved six) all read as the same mesh and the curved swirls (three, four) as
// the same swirl, so the board keeps one of each: A six straight blades, B four curved blades.
// Cut in review: five straight (Tabler, Open Iconic) and the curved six-blade pinwheel (Gridicons) read as A at 16; the
// three-blade swirl (Gravity UI) reads as B. Not drawn: eight blades (Ionicons) cannot hold at 20 and 16 (a line sits 0.13 /
// 0.17 from the next-but-one line's start; opening it to clear that leaves 0.65 of white in a blade cell at 20); four straight
// blades round a square (Hugeicons camera-lens), which filled reads as a hooked cross.
export default {
  concept: "aperture",
  question: "Aperture is a one-picture concept (the iris): straight blades or a curved swirl?",
  candidates: [
    {
      id: "A",
      label: "Iris, six straight blades",
      tags: [
        "iris",
        "shutter",
        "lens",
        "camera",
        "six blades"
      ],
      note: "Rhythm: six blades at 60 degrees, every line continuing one side of a hexagon opening out to the rim, so the six white blade cells are identical and turn evenly round the centre. Opening circumradius 4.5 · 3.5 · 3.25 (0.45 · 0.44 · 0.46 of the outer radius; Lucide 0.46); white opening 6.29 · 4.56 · 4.37 across, white in each blade cell 3.52 · 2.44 · 2.12 across (widest circle, measured), each line 4.5 · 3.5 · 3.25 along the opening and 6.14 · 4.84 · 4.10 out to the rim. What set the opening: a line's air to the start of the next-but-one line is the side x sin 60 less one stroke, so the side must be at least 3.46 at 24 and 20 and 3.18 at 16; at 0.375 of the radius lint read 1.1 and 1.02 there. Rim = the circle keyline, 20 · 16 · 14 of ink. Lucide and Feather aperture, Phosphor Aperture, Nucleo aperture, Material camera, Myna UI and Boxicons shutter all draw six. Filled: the same lines and rim at the outline weight, the opening filled solid (a closed-down iris; Ionicons fills its centre the same way): ink 164 -> 199 · 126 -> 144 · 94 -> 110 (+21 · +14 · +18%), picture unchanged. Tried and dropped: the lines as white cuts in a black disc (Material camera) read as a white star at 16 and came out lighter than the outline (126 -> 120 at 20, 94 -> 86 at 16). Off-grid decimals are the 60 degree vertices and the lines' rim ends. (recommended) The aperture everyone already knows; six even blades read as an iris down to 16.",
      masters: {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M11.25 8L7.577 14.361",
          "M9.625 10.815L2.28 10.815",
          "M6.375 10.815L2.702 4.454",
          "M4.75 8L8.423 1.639",
          "M6.375 5.185L13.72 5.185",
          "M9.625 5.185L13.298 11.546"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M13.5 10L9.33 17.22",
          "M11.75 13.03L3.41 13.03",
          "M8.25 13.03L4.08 5.81",
          "M6.5 10L10.67 2.78",
          "M8.25 6.97L16.59 6.97",
          "M11.75 6.97L15.92 14.19"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M16.5 12L11.18 21.21",
          "M14.25 15.9L3.61 15.9",
          "M9.75 15.9L4.43 6.68",
          "M7.5 12L12.82 2.79",
          "M9.75 8.1L20.39 8.1",
          "M14.25 8.1L19.57 17.32"
        ]
      },
      filled: {
        "16": {
          fill: [
            "M11.25 8L9.625 10.815L6.375 10.815L4.75 8L6.375 5.185L9.625 5.185Z"
          ],
          stroke: [
            "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
            "M11.25 8L7.577 14.361",
            "M9.625 10.815L2.28 10.815",
            "M6.375 10.815L2.702 4.454",
            "M4.75 8L8.423 1.639",
            "M6.375 5.185L13.72 5.185",
            "M9.625 5.185L13.298 11.546"
          ]
        },
        "20": {
          fill: [
            "M13.5 10L11.75 13.03L8.25 13.03L6.5 10L8.25 6.97L11.75 6.97Z"
          ],
          stroke: [
            "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
            "M13.5 10L9.33 17.22",
            "M11.75 13.03L3.41 13.03",
            "M8.25 13.03L4.08 5.81",
            "M6.5 10L10.67 2.78",
            "M8.25 6.97L16.59 6.97",
            "M11.75 6.97L15.92 14.19"
          ]
        },
        "24": {
          fill: [
            "M16.5 12L14.25 15.9L9.75 15.9L7.5 12L9.75 8.1L14.25 8.1Z"
          ],
          stroke: [
            "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
            "M16.5 12L11.18 21.21",
            "M14.25 15.9L3.61 15.9",
            "M9.75 15.9L4.43 6.68",
            "M7.5 12L12.82 2.79",
            "M9.75 8.1L20.39 8.1",
            "M14.25 8.1L19.57 17.32"
          ]
        }
      }
    },
    {
      id: "B",
      label: "Swirl, four curved blades",
      tags: [
        "iris",
        "swirl",
        "lens",
        "curved",
        "four blades"
      ],
      note: "Rhythm: four curved blades every 90 degrees, each an arc 0.7 of the rim's radius (6.47 · 5.07 · 4.46) from a round opening to the rim 100 degrees further round, crossing the opening ring at 24 degrees at every master. Opening ring r 3.75 · 3 · 2.5 on the centreline, white opening 6 · 4.5 · 3.74; white in each blade cell 3.33 · 2.23 · 2.15. Hugeicons aperture draws four swirl blades round a round opening (there tangent to it; crossed here because a tangent arc leaves a sliver of white closing to nothing beside the ring, which lint reads as two edges under 1.5 apart); Gravity UI draws three. Rim = circle keyline. Filled: the disc solid, the round opening the outline's white, four curved 1.5 white slots that stop at the opening ring and the rim so both keep 1.5 · 1.5 · 1.25; ink 170 -> 228 · 127 -> 143 · 93 -> 107 (+34 · +13 · +15%). Off-grid decimals are the arc ends and the slots' corners. Reads as a lens shutter turning, not a mesh: the one construction clearly different from A at 16.",
      masters: {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M5.5 8A2.5 2.5 0 1 0 10.5 8A2.5 2.5 0 1 0 5.5 8Z",
          "M8 5.5A4.462 4.462 0 0 1 14.278 9.107",
          "M10.5 8A4.462 4.462 0 0 1 6.893 14.278",
          "M8 10.5A4.462 4.462 0 0 1 1.722 6.893",
          "M5.5 8A4.462 4.462 0 0 1 9.107 1.722"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M7 10A3 3 0 1 0 13 10A3 3 0 1 0 7 10Z",
          "M10 7A5.07 5.07 0 0 1 17.14 11.26",
          "M13 10A5.07 5.07 0 0 1 8.74 17.14",
          "M10 13A5.07 5.07 0 0 1 2.86 8.74",
          "M7 10A5.07 5.07 0 0 1 11.26 2.86"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M8.25 12A3.75 3.75 0 1 0 15.75 12A3.75 3.75 0 1 0 8.25 12Z",
          "M12 8.25A6.48 6.48 0 0 1 21.11 13.61",
          "M15.75 12A6.48 6.48 0 0 1 10.39 21.11",
          "M12 15.75A6.48 6.48 0 0 1 2.89 10.39",
          "M8.25 12A6.48 6.48 0 0 1 13.61 2.89"
        ]
      },
      filled: {
        "16": {
          fill: [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM6.125 8A1.875 1.875 0 1 0 9.875 8A1.875 1.875 0 1 0 6.125 8ZM7.478 4.919A5.212 5.212 0 0 1 13.227 5.605A5.75 5.75 0 0 1 13.551 9.499A3.712 3.712 0 0 0 10.297 5.882A3.125 3.125 0 0 0 7.478 4.919ZM11.081 7.478A5.212 5.212 0 0 1 10.395 13.227A5.75 5.75 0 0 1 6.501 13.551A3.712 3.712 0 0 0 10.118 10.297A3.125 3.125 0 0 0 11.081 7.478ZM8.522 11.081A5.212 5.212 0 0 1 2.773 10.395A5.75 5.75 0 0 1 2.449 6.501A3.712 3.712 0 0 0 5.703 10.118A3.125 3.125 0 0 0 8.522 11.081ZM4.919 8.522A5.212 5.212 0 0 1 5.605 2.773A5.75 5.75 0 0 1 9.499 2.449A3.712 3.712 0 0 0 5.882 5.703A3.125 3.125 0 0 0 4.919 8.522Z"
          ]
        },
        "20": {
          fill: [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM7.75 10A2.25 2.25 0 1 0 12.25 10A2.25 2.25 0 1 0 7.75 10ZM9.84 6.25A5.82 5.82 0 0 1 15.87 7.21A6.5 6.5 0 0 1 16.38 11.22A4.32 4.32 0 0 0 12.65 7.34A3.75 3.75 0 0 0 9.84 6.25ZM13.75 9.84A5.82 5.82 0 0 1 12.79 15.87A6.5 6.5 0 0 1 8.78 16.38A4.32 4.32 0 0 0 12.66 12.65A3.75 3.75 0 0 0 13.75 9.84ZM10.16 13.75A5.82 5.82 0 0 1 4.13 12.79A6.5 6.5 0 0 1 3.62 8.78A4.32 4.32 0 0 0 7.35 12.66A3.75 3.75 0 0 0 10.16 13.75ZM6.25 10.16A5.82 5.82 0 0 1 7.21 4.13A6.5 6.5 0 0 1 11.22 3.62A4.32 4.32 0 0 0 7.34 7.35A3.75 3.75 0 0 0 6.25 10.16Z"
          ]
        },
        "24": {
          fill: [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM9 12A3 3 0 1 0 15 12A3 3 0 1 0 9 12ZM11.84 7.5A7.23 7.23 0 0 1 20.09 9.39A8.5 8.5 0 0 1 20.35 13.57A5.73 5.73 0 0 0 14.74 8.43A4.5 4.5 0 0 0 11.84 7.5ZM16.5 11.84A7.23 7.23 0 0 1 14.61 20.09A8.5 8.5 0 0 1 10.43 20.35A5.73 5.73 0 0 0 15.57 14.74A4.5 4.5 0 0 0 16.5 11.84ZM12.16 16.5A7.23 7.23 0 0 1 3.91 14.61A8.5 8.5 0 0 1 3.65 10.43A5.73 5.73 0 0 0 9.26 15.57A4.5 4.5 0 0 0 12.16 16.5ZM7.5 12.16A7.23 7.23 0 0 1 9.39 3.91A8.5 8.5 0 0 1 13.57 3.65A5.73 5.73 0 0 0 8.43 9.26A4.5 4.5 0 0 0 7.5 12.16Z"
          ]
        }
      }
    }
  ]
};
