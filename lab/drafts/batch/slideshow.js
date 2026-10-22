// slideshow: must read as "pictures shown one after another" at 16 and stay clearly apart from presentation (board on a tripod), video-3 (TV with play) and images (a stack).
export default {
  "concept": "slideshow",
  "concepts": ["slideshow", "carousel", "presentation"],
  "question": "Which picture says slideshow?",
  "candidates": [
    {
      "id": "A",
      "label": "Frame and dots",
      "tags": [
        "slideshow",
        "pager",
        "dots",
        "carousel",
        "frame"
      ],
      "box": {
        "16": [
          14,
          14
        ],
        "20": [
          16,
          16
        ],
        "24": [
          20,
          20
        ]
      },
      "note": "(recommended) Rhythm: dot = gap between dots = air frame→dots = 2 at every master; dot pitch 4 · 4 · 4, the row centred. A frame with pager dots (Polaris Slideshow, Tabler slideshow, Nucleo slideshow). Frame on the landscape keyline 20×16 · 16×12 · 14×10, radius 2.5 · 2 · 1.5. Dots are 2×2 rounded squares on whole pixels (ink 7..9, 11..13, 15..17 at 24) — measured in Chrome they render 100% solid, where the earlier circles rendered as 50% grey blocks. Box 20×20 · 16×16 · 14×14. Filled: frame solid (outer radius 3.25 · 2.75 · 2.125), dots unchanged. Why: the dots are the one detail no relative has, so it reads as slideshow and not video, presentation or image, and it is the quietest at 16. Cost: dots are 2 at 24 too (not the set’s 3) so all three masters share one crisp size and pitch.",
      "masters": {
        "16": [
          "M3.125 1.625H12.875A1.5 1.5 0 0 1 14.375 3.125V8.875A1.5 1.5 0 0 1 12.875 10.375H3.125A1.5 1.5 0 0 1 1.625 8.875V3.125A1.5 1.5 0 0 1 3.125 1.625Z",
          "M3.625 13.625H4.375V14.375H3.625Z",
          "M7.625 13.625H8.375V14.375H7.625Z",
          "M11.625 13.625H12.375V14.375H11.625Z"
        ],
        "20": [
          "M4.75 2.75H15.25A2 2 0 0 1 17.25 4.75V11.25A2 2 0 0 1 15.25 13.25H4.75A2 2 0 0 1 2.75 11.25V4.75A2 2 0 0 1 4.75 2.75Z",
          "M5.75 16.75H6.25V17.25H5.75Z",
          "M9.75 16.75H10.25V17.25H9.75Z",
          "M13.75 16.75H14.25V17.25H13.75Z"
        ],
        "24": [
          "M5.25 2.75H18.75A2.5 2.5 0 0 1 21.25 5.25V14.75A2.5 2.5 0 0 1 18.75 17.25H5.25A2.5 2.5 0 0 1 2.75 14.75V5.25A2.5 2.5 0 0 1 5.25 2.75Z",
          "M7.75 20.75H8.25V21.25H7.75Z",
          "M11.75 20.75H12.25V21.25H11.75Z",
          "M15.75 20.75H16.25V21.25H15.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 1H12.875A2.125 2.125 0 0 1 15 3.125V8.875A2.125 2.125 0 0 1 12.875 11H3.125A2.125 2.125 0 0 1 1 8.875V3.125A2.125 2.125 0 0 1 3.125 1Z"
          ],
          "stroke": [
            "M3.625 13.625H4.375V14.375H3.625Z",
            "M7.625 13.625H8.375V14.375H7.625Z",
            "M11.625 13.625H12.375V14.375H11.625Z"
          ]
        },
        "20": {
          "fill": [
            "M4.75 2H15.25A2.75 2.75 0 0 1 18 4.75V11.25A2.75 2.75 0 0 1 15.25 14H4.75A2.75 2.75 0 0 1 2 11.25V4.75A2.75 2.75 0 0 1 4.75 2Z"
          ],
          "stroke": [
            "M5.75 16.75H6.25V17.25H5.75Z",
            "M9.75 16.75H10.25V17.25H9.75Z",
            "M13.75 16.75H14.25V17.25H13.75Z"
          ]
        },
        "24": {
          "fill": [
            "M5.25 2H18.75A3.25 3.25 0 0 1 22 5.25V14.75A3.25 3.25 0 0 1 18.75 18H5.25A3.25 3.25 0 0 1 2 14.75V5.25A3.25 3.25 0 0 1 5.25 2Z"
          ],
          "stroke": [
            "M7.75 20.75H8.25V21.25H7.75Z",
            "M11.75 20.75H12.25V21.25H11.75Z",
            "M15.75 20.75H16.25V21.25H15.75Z"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Carousel",
      "tags": [
        "slideshow",
        "carousel",
        "gallery",
        "edges"
      ],
      "note": "Rhythm: the two edge lines mirror each other, air line→frame 2 · 2 · 1.75, each as long as the frame's straight sides (9.5 · 6.5 · 5.75). The slide in view with the last and next slides as edges (Lucide gallery-horizontal; Material view_carousel and Tabler carousel-horizontal draw the edges as slivers of frames). Frame outer 13×16 · 9×12 · 8×10 (0.81 · 0.75 · 0.8), radius 2.5 · 2 · 1.5; lines at the box edges. Box: landscape keyline 20×16 · 16×12 · 14×10. Filled: frame solid, lines at the outline weight. Note: drawn first as images-4's bracket peeks — at 16 they read as parentheses, so the straight edges won.",
      "masters": {
        "16": [
          "M6.125 3.625H9.875A1.5 1.5 0 0 1 11.375 5.125V10.875A1.5 1.5 0 0 1 9.875 12.375H6.125A1.5 1.5 0 0 1 4.625 10.875V5.125A1.5 1.5 0 0 1 6.125 3.625Z",
          "M1.625 5.125V10.875",
          "M14.375 5.125V10.875"
        ],
        "20": [
          "M8.25 4.75H11.75A2 2 0 0 1 13.75 6.75V13.25A2 2 0 0 1 11.75 15.25H8.25A2 2 0 0 1 6.25 13.25V6.75A2 2 0 0 1 8.25 4.75Z",
          "M2.75 6.75V13.25",
          "M17.25 6.75V13.25"
        ],
        "24": [
          "M8.75 4.75H15.25A2.5 2.5 0 0 1 17.75 7.25V16.75A2.5 2.5 0 0 1 15.25 19.25H8.75A2.5 2.5 0 0 1 6.25 16.75V7.25A2.5 2.5 0 0 1 8.75 4.75Z",
          "M2.75 7.25V16.75",
          "M21.25 7.25V16.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.125 3H9.875A2.125 2.125 0 0 1 12 5.125V10.875A2.125 2.125 0 0 1 9.875 13H6.125A2.125 2.125 0 0 1 4 10.875V5.125A2.125 2.125 0 0 1 6.125 3Z"
          ],
          "stroke": [
            "M1.625 5.125V10.875",
            "M14.375 5.125V10.875"
          ]
        },
        "20": {
          "fill": [
            "M8.25 4H11.75A2.75 2.75 0 0 1 14.5 6.75V13.25A2.75 2.75 0 0 1 11.75 16H8.25A2.75 2.75 0 0 1 5.5 13.25V6.75A2.75 2.75 0 0 1 8.25 4Z"
          ],
          "stroke": [
            "M2.75 6.75V13.25",
            "M17.25 6.75V13.25"
          ]
        },
        "24": {
          "fill": [
            "M8.75 4H15.25A3.25 3.25 0 0 1 18.5 7.25V16.75A3.25 3.25 0 0 1 15.25 20H8.75A3.25 3.25 0 0 1 5.5 16.75V7.25A3.25 3.25 0 0 1 8.75 4Z"
          ],
          "stroke": [
            "M2.75 7.25V16.75",
            "M21.25 7.25V16.75"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Stack and play",
      "tags": [
        "slideshow",
        "stack",
        "play",
        "photos"
      ],
      "note": "Rhythm: images-2's stack — back offset 3 · 3 · 3, air 1.5 · 1.5 · 1.75; play centred by ink then moved 0.41 · 0.31 · 0.28 toward its point (play's own optical shift per unit of height, C14). Apple Photos' slideshow (SF Symbols play.rectangle.on.rectangle). Front frame outer 17×17 · 13×13 · 11×11, box on the circle keyline 20×20 · 16×16 · 14×14 — one size up from images-2, because the play must hold 1.5 of inside air (lint §5i) and needs a frame 11 across at 16. Play: video-3's construction (equilateral, corner arcs half the weight), ink 7.05×7.68 · 5.4×5.77 · 4.82×5.18, inside white Ø 2.7 · 1.6 · 1.55, air to the frame ≥ 3.06 · 1.99 · 1.56. Filled: front solid with the play cut out at the outline triangle's outer edge, back L at the outline weight. Cost: at 16 in real pixels the play's white is 1.5 px and reads as a smudge.",
      "masters": {
        "16": [
          "M3.125 4.625H9.875A1.5 1.5 0 0 1 11.375 6.125V12.875A1.5 1.5 0 0 1 9.875 14.375H3.125A1.5 1.5 0 0 1 1.625 12.875V6.125A1.5 1.5 0 0 1 3.125 4.625Z",
          "M5.93 7.616L8.255 8.959A0.625 0.625 0 0 1 8.255 10.041L5.93 11.384A0.625 0.625 0 0 1 4.992 10.842L4.992 8.158A0.625 0.625 0 0 1 5.93 7.616Z",
          "M6.125 1.625H12.875A1.5 1.5 0 0 1 14.375 3.125V9.875"
        ],
        "20": [
          "M4.75 5.75H12.25A2 2 0 0 1 14.25 7.75V15.25A2 2 0 0 1 12.25 17.25H4.75A2 2 0 0 1 2.75 15.25V7.75A2 2 0 0 1 4.75 5.75Z",
          "M7.99 9.46L10.39 10.85A0.75 0.75 0 0 1 10.39 12.15L7.99 13.54A0.75 0.75 0 0 1 6.86 12.89L6.86 10.11A0.75 0.75 0 0 1 7.99 9.46Z",
          "M7.75 2.75H15.25A2 2 0 0 1 17.25 4.75V12.25"
        ],
        "24": [
          "M5.25 5.75H15.75A2.5 2.5 0 0 1 18.25 8.25V18.75A2.5 2.5 0 0 1 15.75 21.25H5.25A2.5 2.5 0 0 1 2.75 18.75V8.25A2.5 2.5 0 0 1 5.25 5.75Z",
          "M9.26 10.51L13.31 12.85A0.75 0.75 0 0 1 13.31 14.15L9.26 16.49A0.75 0.75 0 0 1 8.14 15.84L8.14 11.16A0.75 0.75 0 0 1 9.26 10.51Z",
          "M8.25 2.75H18.75A2.5 2.5 0 0 1 21.25 5.25V15.75"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 4H9.875A2.125 2.125 0 0 1 12 6.125V12.875A2.125 2.125 0 0 1 9.875 15H3.125A2.125 2.125 0 0 1 1 12.875V6.125A2.125 2.125 0 0 1 3.125 4ZM6.242 7.075L8.567 8.417A1.25 1.25 0 0 1 8.567 10.583L6.242 11.925A1.25 1.25 0 0 1 4.367 10.842L4.367 8.158A1.25 1.25 0 0 1 6.242 7.075Z"
          ],
          "stroke": [
            "M6.125 1.625H12.875A1.5 1.5 0 0 1 14.375 3.125V9.875"
          ]
        },
        "20": {
          "fill": [
            "M4.75 5H12.25A2.75 2.75 0 0 1 15 7.75V15.25A2.75 2.75 0 0 1 12.25 18H4.75A2.75 2.75 0 0 1 2 15.25V7.75A2.75 2.75 0 0 1 4.75 5ZM8.36 8.82L10.76 10.2A1.5 1.5 0 0 1 10.76 12.8L8.36 14.18A1.5 1.5 0 0 1 6.11 12.89L6.11 10.11A1.5 1.5 0 0 1 8.36 8.82Z"
          ],
          "stroke": [
            "M7.75 2.75H15.25A2 2 0 0 1 17.25 4.75V12.25"
          ]
        },
        "24": {
          "fill": [
            "M5.25 5H15.75A3.25 3.25 0 0 1 19 8.25V18.75A3.25 3.25 0 0 1 15.75 22H5.25A3.25 3.25 0 0 1 2 18.75V8.25A3.25 3.25 0 0 1 5.25 5ZM9.64 9.86L13.69 12.2A1.5 1.5 0 0 1 13.69 14.8L9.64 17.14A1.5 1.5 0 0 1 7.39 15.84L7.39 11.16A1.5 1.5 0 0 1 9.64 9.86Z"
          ],
          "stroke": [
            "M8.25 2.75H18.75A2.5 2.5 0 0 1 21.25 5.25V15.75"
          ]
        }
      }
    },
    {
      "id": "D",
      "label": "Projector and play",
      "tags": [
        "slideshow",
        "projector",
        "screen",
        "play",
        "present"
      ],
      "box": {
        "16": [
          14,
          12
        ],
        "20": [
          16,
          14
        ],
        "24": [
          20,
          18
        ]
      },
      "note": "Rhythm: play 0.41 · 0.42 · 0.43 of the board’s height at every master, centred in the board’s white and moved 0.4 · 0.32 · 0.28 toward its point (C14). PowerPoint’s Slide Show (a projector screen with play). Presentation’s board hanging from its bar, without the tripod, run down to the box: bar 20 · 16 · 14 wide, board 18×17.25 · 14×13.25 · 12×11.375 (outer), radius 2.5 · 2 · 1.5; box 20×18 · 16×14 · 14×12 (desktop’s). Play as E’s: ink 6.75×7.33 · 5.55×5.94 · 4.82×5.18, inside white Ø 2.5 · 1.7 · 1.55, air to the board ≥ 3.73 · 2.4 · 2.06. Filled: board solid with the play cut out, bar at the outline weight. The bar on top (not video-3’s base below) is what keeps it from reading as a TV.",
      "masters": {
        "16": [
          "M1.625 2.625H14.375",
          "M2.625 2.625V11.875A1.5 1.5 0 0 0 4.125 13.375H11.875A1.5 1.5 0 0 0 13.375 11.875V2.625",
          "M7.43 6.116L9.755 7.459A0.625 0.625 0 0 1 9.755 8.541L7.43 9.884A0.625 0.625 0 0 1 6.492 9.342L6.492 6.658A0.625 0.625 0 0 1 7.43 6.116Z"
        ],
        "20": [
          "M2.75 3.75H17.25",
          "M3.75 3.75V14.25A2 2 0 0 0 5.75 16.25H14.25A2 2 0 0 0 16.25 14.25V3.75",
          "M9.42 7.88L11.97 9.35A0.75 0.75 0 0 1 11.97 10.65L9.42 12.12A0.75 0.75 0 0 1 8.3 11.47L8.3 8.53A0.75 0.75 0 0 1 9.42 7.88Z"
        ],
        "24": [
          "M2.75 3.75H21.25",
          "M3.75 3.75V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V3.75",
          "M10.9 9.19L14.65 11.35A0.75 0.75 0 0 1 14.65 12.65L10.9 14.81A0.75 0.75 0 0 1 9.77 14.17L9.77 9.83A0.75 0.75 0 0 1 10.9 9.19Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M2 2.625H14V11.875A2.125 2.125 0 0 1 11.875 14H4.125A2.125 2.125 0 0 1 2 11.875ZM7.742 5.575L10.067 6.917A1.25 1.25 0 0 1 10.067 9.083L7.742 10.425A1.25 1.25 0 0 1 5.867 9.342L5.867 6.658A1.25 1.25 0 0 1 7.742 5.575Z"
          ],
          "stroke": [
            "M1.625 2.625H14.375"
          ]
        },
        "20": {
          "fill": [
            "M3 3.75H17V14.25A2.75 2.75 0 0 1 14.25 17H5.75A2.75 2.75 0 0 1 3 14.25ZM9.8 7.23L12.35 8.7A1.5 1.5 0 0 1 12.35 11.3L9.8 12.77A1.5 1.5 0 0 1 7.55 11.47L7.55 8.53A1.5 1.5 0 0 1 9.8 7.23Z"
          ],
          "stroke": [
            "M2.75 3.75H17.25"
          ]
        },
        "24": {
          "fill": [
            "M3 3.75H21V17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75ZM11.27 8.54L15.02 10.7A1.5 1.5 0 0 1 15.02 13.3L11.27 15.46A1.5 1.5 0 0 1 9.02 14.17L9.02 9.83A1.5 1.5 0 0 1 11.27 8.54Z"
          ],
          "stroke": [
            "M2.75 3.75H21.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Frame and play",
      "tags": [
        "slideshow",
        "frame",
        "play",
        "square"
      ],
      "note": "Google’s own slideshow button (Material slideshow; Google Slides and Google Photos use it). Rhythm: play 0.41 · 0.42 · 0.43 of the frame at every master, moved 0.4 · 0.32 · 0.28 toward its point (C14). Frame on the square keyline 18 · 14 · 12, radius 2.5 · 2 · 1.5; play ink 6.75×7.33 · 5.55×5.94 · 4.82×5.18, inside white Ø 2.5 · 1.7 · 1.55. Filled: frame solid with the play cut out. Flagged: no fifth distinct slideshow picture holds at 16 (a thumbnail strip, stacked slides and Material view_carousel all fail the 1.5 air or read as copy/images); this one reads as video/play-square beside video-3, and would take the shape a later play-square needs.",
      "masters": {
        "16": [
          "M4.125 2.625H11.875A1.5 1.5 0 0 1 13.375 4.125V11.875A1.5 1.5 0 0 1 11.875 13.375H4.125A1.5 1.5 0 0 1 2.625 11.875V4.125A1.5 1.5 0 0 1 4.125 2.625Z",
          "M7.43 6.116L9.755 7.459A0.625 0.625 0 0 1 9.755 8.541L7.43 9.884A0.625 0.625 0 0 1 6.492 9.342L6.492 6.658A0.625 0.625 0 0 1 7.43 6.116Z"
        ],
        "20": [
          "M5.75 3.75H14.25A2 2 0 0 1 16.25 5.75V14.25A2 2 0 0 1 14.25 16.25H5.75A2 2 0 0 1 3.75 14.25V5.75A2 2 0 0 1 5.75 3.75Z",
          "M9.42 7.88L11.97 9.35A0.75 0.75 0 0 1 11.97 10.65L9.42 12.12A0.75 0.75 0 0 1 8.3 11.47L8.3 8.53A0.75 0.75 0 0 1 9.42 7.88Z"
        ],
        "24": [
          "M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z",
          "M10.9 9.19L14.65 11.35A0.75 0.75 0 0 1 14.65 12.65L10.9 14.81A0.75 0.75 0 0 1 9.77 14.17L9.77 9.83A0.75 0.75 0 0 1 10.9 9.19Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M4.125 2H11.875A2.125 2.125 0 0 1 14 4.125V11.875A2.125 2.125 0 0 1 11.875 14H4.125A2.125 2.125 0 0 1 2 11.875V4.125A2.125 2.125 0 0 1 4.125 2ZM7.742 5.575L10.067 6.917A1.25 1.25 0 0 1 10.067 9.083L7.742 10.425A1.25 1.25 0 0 1 5.867 9.342L5.867 6.658A1.25 1.25 0 0 1 7.742 5.575Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M5.75 3H14.25A2.75 2.75 0 0 1 17 5.75V14.25A2.75 2.75 0 0 1 14.25 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75A2.75 2.75 0 0 1 5.75 3ZM9.8 7.23L12.35 8.7A1.5 1.5 0 0 1 12.35 11.3L9.8 12.77A1.5 1.5 0 0 1 7.55 11.47L7.55 8.53A1.5 1.5 0 0 1 9.8 7.23Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M6.25 3H17.75A3.25 3.25 0 0 1 21 6.25V17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3ZM11.27 8.54L15.02 10.7A1.5 1.5 0 0 1 15.02 13.3L11.27 15.46A1.5 1.5 0 0 1 9.02 14.17L9.02 9.83A1.5 1.5 0 0 1 11.27 8.54Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
