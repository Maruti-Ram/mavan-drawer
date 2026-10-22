// film — why it matters: the strip and the clapperboard already ship under video (video-2, video-4), so film should take a
// picture the set does not have yet; four distinct pictures are drawn, and only A (the strip, landscape) overlaps video-2.
// Survey (read only): strip portrait (Lucide, Heroicons, Tabler, Remix, MingCute) = video-2; strip landscape (Phosphor, Fluent,
// Nucleo, SF); reel (Phosphor, Solar, MDI, Hugeicons, Streamline); 35 mm canister (Material camera_roll, Boxicons, Hugeicons,
// IconOven); cine camera with two reels (MDI video-vintage, Jam, Boxicons, LineIcons, IconOven, the movie-camera emoji);
// slate (Material movie, Phosphor, Lucide) = video-4.
// Not drawn: the closed slate (video-4 closed) and video-2 itself (an alias); a projector, because Lucide, MDI, Hugeicons and
// Solar all draw a modern beamer with light rays, a presentation picture rather than film.
export default {
  concept: "film",
  concepts: ["film", "camera"],
  question: "Which picture says film? Four pictures; only A overlaps a shipped icon (video-2's strip).",
  candidates: [
    {
      id: "A",
      label: "Strip, landscape (overlaps video-2)",
      tags: [
        "strip",
        "frames",
        "movie",
        "cinema",
        "landscape"
      ],
      note: "OVERLAPS video-2: the same film strip turned on its side, the one candidate on this board that repeats a shipped picture. Rhythm: four sprocket holes along the top and four along the bottom on one pitch, 4.5 · 3.5 · 3.125, the middle rung running the full height as the line between two frames. Holes 3 x 2.5 · 2 x 1.5 · 1.875 x 1.5 of air (the end holes 0.25 · 0.25 · 0.125 longer, which their rounded corners give back). Bands of 2.5 · 1.5 · 1.5 air above a picture 5 · 3 · 2 tall: band to picture 1 : 2 at 24 and 20, 1 : 1.33 at 16, where 1.5 of band is the floor. Phosphor FilmStrip, Fluent Filmstrip, Nucleo film, SF film draw it landscape. Ink 20x16 · 16x12 · 14x10, the landscape keyline, box-centred; radius 2.5 · 2 · 1.5 as video-2. Filled: the strip solid, the eight holes punched white, rungs left 1.5 · 1.5 · 1.25 wide. Crispness: the 16 rungs sit on x.875 / x.125 to keep one pitch, a quarter pixel of blur.",
      masters: {
        "16": [
          "M3.125 3.625H12.875A1.5 1.5 0 0 1 14.375 5.125V10.875A1.5 1.5 0 0 1 12.875 12.375H3.125A1.5 1.5 0 0 1 1.625 10.875V5.125A1.5 1.5 0 0 1 3.125 3.625Z",
          "M1.625 6.375H14.375",
          "M1.625 9.625H14.375",
          "M8 3.625V12.375",
          "M4.875 3.625V6.375",
          "M4.875 9.625V12.375",
          "M11.125 3.625V6.375",
          "M11.125 9.625V12.375"
        ],
        "20": [
          "M4.75 4.75H15.25A2 2 0 0 1 17.25 6.75V13.25A2 2 0 0 1 15.25 15.25H4.75A2 2 0 0 1 2.75 13.25V6.75A2 2 0 0 1 4.75 4.75Z",
          "M2.75 7.75H17.25",
          "M2.75 12.25H17.25",
          "M10 4.75V15.25",
          "M6.5 4.75V7.75",
          "M6.5 12.25V15.25",
          "M13.5 4.75V7.75",
          "M13.5 12.25V15.25"
        ],
        "24": [
          "M5.25 4.75H18.75A2.5 2.5 0 0 1 21.25 7.25V16.75A2.5 2.5 0 0 1 18.75 19.25H5.25A2.5 2.5 0 0 1 2.75 16.75V7.25A2.5 2.5 0 0 1 5.25 4.75Z",
          "M2.75 8.75H21.25",
          "M2.75 15.25H21.25",
          "M12 4.75V19.25",
          "M7.5 4.75V8.75",
          "M7.5 15.25V19.25",
          "M16.5 4.75V8.75",
          "M16.5 15.25V19.25"
        ]
      },
      filled: {
        "16": {
          fill: [
            "M3.125 3H12.875A2.125 2.125 0 0 1 15 5.125V10.875A2.125 2.125 0 0 1 12.875 13H3.125A2.125 2.125 0 0 1 1 10.875V5.125A2.125 2.125 0 0 1 3.125 3ZM3.125 4.25H4.25V5.75H2.25V5.125A0.875 0.875 0 0 1 3.125 4.25ZM5.5 4.25H7.375V5.75H5.5ZM8.625 4.25H10.5V5.75H8.625ZM11.75 4.25H12.875A0.875 0.875 0 0 1 13.75 5.125V5.75H11.75ZM2.25 10.25H4.25V11.75H3.125A0.875 0.875 0 0 1 2.25 10.875ZM5.5 10.25H7.375V11.75H5.5ZM8.625 10.25H10.5V11.75H8.625ZM11.75 10.25H13.75V10.875A0.875 0.875 0 0 1 12.875 11.75H11.75Z"
          ]
        },
        "20": {
          fill: [
            "M4.75 4H15.25A2.75 2.75 0 0 1 18 6.75V13.25A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25V6.75A2.75 2.75 0 0 1 4.75 4ZM4.75 5.5H5.75V7H3.5V6.75A1.25 1.25 0 0 1 4.75 5.5ZM7.25 5.5H9.25V7H7.25ZM10.75 5.5H12.75V7H10.75ZM14.25 5.5H15.25A1.25 1.25 0 0 1 16.5 6.75V7H14.25ZM3.5 13H5.75V14.5H4.75A1.25 1.25 0 0 1 3.5 13.25ZM7.25 13H9.25V14.5H7.25ZM10.75 13H12.75V14.5H10.75ZM14.25 13H16.5V13.25A1.25 1.25 0 0 1 15.25 14.5H14.25Z"
          ]
        },
        "24": {
          fill: [
            "M5.25 4H18.75A3.25 3.25 0 0 1 22 7.25V16.75A3.25 3.25 0 0 1 18.75 20H5.25A3.25 3.25 0 0 1 2 16.75V7.25A3.25 3.25 0 0 1 5.25 4ZM5.25 5.5H6.75V8H3.5V7.25A1.75 1.75 0 0 1 5.25 5.5ZM8.25 5.5H11.25V8H8.25ZM12.75 5.5H15.75V8H12.75ZM17.25 5.5H18.75A1.75 1.75 0 0 1 20.5 7.25V8H17.25ZM3.5 16H6.75V18.5H5.25A1.75 1.75 0 0 1 3.5 16.75ZM8.25 16H11.25V18.5H8.25ZM12.75 16H15.75V18.5H12.75ZM17.25 16H20.5V16.75A1.75 1.75 0 0 1 18.75 18.5H17.25Z"
          ]
        }
      }
    },
    {
      id: "B",
      label: "Reel",
      tags: [
        "reel",
        "movie",
        "cinema",
        "projector",
        "film"
      ],
      note: "Rhythm: four holes on one ring, on the axes, 4.5 · 3.5 · 3 from the centre (0.45 · 0.44 · 0.43 of the radius), 3 · 3 · 2.5 across (image's sun dot at 24 and 20). Air hole to hole 3.36 · 1.95 · 1.74, hole to rim 2.5 · 1.5 · 1.5. Every hole's edges sit on whole pixels at every master (centres 7.5 / 16.5 · 6.5 / 13.5 · 5 / 11), so at 16 each hole is a clean 2 x 2 block: solid ink in the outline and fully white in the filled reel (measured: the four hole pixels 0% ink). The 16 hole went from 2 to 2.5 across for that, which costs 0.25 of hole-to-rim air. The film leaves along the bottom tangent and stops under the rim's right edge, so the ink box stays the circle keyline 20 · 16 · 14 and the reel is box-centred. Phosphor FilmReel and Solar reel draw exactly this; MDI film-reel, Hugeicons film-roll-02 and Streamline movies-reel are the same reel. Filled: the disc solid, the four holes punched white at the same sizes, the tail a line at the outline weight. (recommended) Round with four holes, it cannot be read as the strip, the clapper or a camera at 16, and no shipped icon draws it.",
      masters: {
        "16": [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M8 14.375H14.375",
          "M7.375 5A0.625 0.625 0 1 0 8.625 5A0.625 0.625 0 1 0 7.375 5Z",
          "M10.375 8A0.625 0.625 0 1 0 11.625 8A0.625 0.625 0 1 0 10.375 8Z",
          "M7.375 11A0.625 0.625 0 1 0 8.625 11A0.625 0.625 0 1 0 7.375 11Z",
          "M4.375 8A0.625 0.625 0 1 0 5.625 8A0.625 0.625 0 1 0 4.375 8Z"
        ],
        "20": [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M10 17.25H17.25",
          "M9.25 6.5A0.75 0.75 0 1 0 10.75 6.5A0.75 0.75 0 1 0 9.25 6.5Z",
          "M12.75 10A0.75 0.75 0 1 0 14.25 10A0.75 0.75 0 1 0 12.75 10Z",
          "M9.25 13.5A0.75 0.75 0 1 0 10.75 13.5A0.75 0.75 0 1 0 9.25 13.5Z",
          "M5.75 10A0.75 0.75 0 1 0 7.25 10A0.75 0.75 0 1 0 5.75 10Z"
        ],
        "24": [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M12 21.25H21.25",
          "M11.25 7.5A0.75 0.75 0 1 0 12.75 7.5A0.75 0.75 0 1 0 11.25 7.5Z",
          "M15.75 12A0.75 0.75 0 1 0 17.25 12A0.75 0.75 0 1 0 15.75 12Z",
          "M11.25 16.5A0.75 0.75 0 1 0 12.75 16.5A0.75 0.75 0 1 0 11.25 16.5Z",
          "M6.75 12A0.75 0.75 0 1 0 8.25 12A0.75 0.75 0 1 0 6.75 12Z"
        ]
      },
      filled: {
        "16": {
          fill: [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM6.75 5A1.25 1.25 0 1 0 9.25 5A1.25 1.25 0 1 0 6.75 5ZM9.75 8A1.25 1.25 0 1 0 12.25 8A1.25 1.25 0 1 0 9.75 8ZM6.75 11A1.25 1.25 0 1 0 9.25 11A1.25 1.25 0 1 0 6.75 11ZM3.75 8A1.25 1.25 0 1 0 6.25 8A1.25 1.25 0 1 0 3.75 8Z"
          ],
          stroke: [
            "M8 14.375H14.375"
          ]
        },
        "20": {
          fill: [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM8.5 6.5A1.5 1.5 0 1 0 11.5 6.5A1.5 1.5 0 1 0 8.5 6.5ZM12 10A1.5 1.5 0 1 0 15 10A1.5 1.5 0 1 0 12 10ZM8.5 13.5A1.5 1.5 0 1 0 11.5 13.5A1.5 1.5 0 1 0 8.5 13.5ZM5 10A1.5 1.5 0 1 0 8 10A1.5 1.5 0 1 0 5 10Z"
          ],
          stroke: [
            "M10 17.25H17.25"
          ]
        },
        "24": {
          fill: [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM10.5 7.5A1.5 1.5 0 1 0 13.5 7.5A1.5 1.5 0 1 0 10.5 7.5ZM15 12A1.5 1.5 0 1 0 18 12A1.5 1.5 0 1 0 15 12ZM10.5 16.5A1.5 1.5 0 1 0 13.5 16.5A1.5 1.5 0 1 0 10.5 16.5ZM6 12A1.5 1.5 0 1 0 9 12A1.5 1.5 0 1 0 6 12Z"
          ],
          stroke: [
            "M12 21.25H21.25"
          ]
        }
      }
    },
    {
      id: "C",
      label: "35 mm canister",
      tags: [
        "canister",
        "roll",
        "35mm",
        "analog",
        "photo"
      ],
      note: "Balance: the canister and its knob pull the ink left, so the drawing is moved right by a whole unit at every master (optical 1 0); the ink mass now sits 0.41 · 0.27 · 0.12 left of the canvas centre in the outline and 0.65 · 0.46 · 0.32 in the filled twin (box-centred it was 1.34 · 1.15 · 0.94 and 1.88 · 1.63 · 1.41). A whole unit keeps every edge on whole pixels at 16; the half-offset shift C15 uses for pointing marks (0.5) would blur them. The ink runs to the right margin (22 · 18 · 15). Rhythm: canister 8 · 6 · 5 wide (0.44 · 0.43 · 0.42 of the box), knob a solid tab 3 · 3 · 2.5 wide standing 1.75 · 1.5 · 1.25 above the lid (a tenth of the height), on the canister's centre. The leader leaves the wall 1.75 · 1.5 · 1.5 below the lid and runs 10 · 8 · 7; its tongue is half that length and ends 50-53% of the way down the canister, the full leader 75-76%. Corners: canister r2 · 1.25 · 1, leader r1.5 · 1.25 · 1 at the top and 1.5 · 1.25 · 0.75 under the tongue, step 1 · 0.75 · 0.75 outside and 0.75 · 0.75 · 0.625 inside. Material camera_roll, Boxicons film-roll, Hugeicons film-roll-01, IconOven film-roll draw it. Ink 18x18 · 14x14 · 12x12, the square keyline. Filled: canister and knob solid, the leader solid, a 1.5 white cut between them along the wall.",
      optical: {
        "16": [
          1,
          0
        ],
        "20": [
          1,
          0
        ],
        "24": [
          1,
          0
        ]
      },
      masters: {
        "16": [
          "M4.625 3.875H4.875V2.625H6.125V3.875H6.375A1 1 0 0 1 7.375 4.875V12.375A1 1 0 0 1 6.375 13.375H4.625A1 1 0 0 1 3.625 12.375V4.875A1 1 0 0 1 4.625 3.875Z",
          "M7.375 5.375H13.375A1 1 0 0 1 14.375 6.375V7.875A0.75 0.75 0 0 1 13.625 8.625H11.5A0.625 0.625 0 0 0 10.875 9.25V10.375A0.75 0.75 0 0 1 10.125 11.125H7.375"
        ],
        "20": [
          "M6 5.25H6.25V3.75H7.75V5.25H8A1.25 1.25 0 0 1 9.25 6.5V15A1.25 1.25 0 0 1 8 16.25H6A1.25 1.25 0 0 1 4.75 15V6.5A1.25 1.25 0 0 1 6 5.25Z",
          "M9.25 6.75H16A1.25 1.25 0 0 1 17.25 8V9.5A1.25 1.25 0 0 1 16 10.75H14A0.75 0.75 0 0 0 13.25 11.5V12.75A0.75 0.75 0 0 1 12.5 13.5H9.25"
        ],
        "24": [
          "M6.75 5.5H7.25V3.75H8.75V5.5H9.25A2 2 0 0 1 11.25 7.5V18.25A2 2 0 0 1 9.25 20.25H6.75A2 2 0 0 1 4.75 18.25V7.5A2 2 0 0 1 6.75 5.5Z",
          "M11.25 7.25H19.75A1.5 1.5 0 0 1 21.25 8.75V11.75A1.5 1.5 0 0 1 19.75 13.25H17A0.75 0.75 0 0 0 16.25 14V15.75A1 1 0 0 1 15.25 16.75H11.25"
        ]
      },
      filled: {
        "16": {
          fill: [
            "M4.625 3.25H6.375A1.625 1.625 0 0 1 8 4.875V12.375A1.625 1.625 0 0 1 6.375 14H4.625A1.625 1.625 0 0 1 3 12.375V4.875A1.625 1.625 0 0 1 4.625 3.25Z",
            "M4.25 3.875V2.625A0.625 0.625 0 0 1 4.875 2H6.125A0.625 0.625 0 0 1 6.75 2.625V3.875Z",
            "M9.5 4.75H13.375A1.625 1.625 0 0 1 15 6.375V7.875A1.375 1.375 0 0 1 13.625 9.25H11.5V10.375A1.375 1.375 0 0 1 10.125 11.75H9.5Z"
          ]
        },
        "20": {
          fill: [
            "M6 4.5H8A2 2 0 0 1 10 6.5V15A2 2 0 0 1 8 17H6A2 2 0 0 1 4 15V6.5A2 2 0 0 1 6 4.5Z",
            "M5.5 5.25V3.75A0.75 0.75 0 0 1 6.25 3H7.75A0.75 0.75 0 0 1 8.5 3.75V5.25Z",
            "M11.5 6H16A2 2 0 0 1 18 8V9.5A2 2 0 0 1 16 11.5H14V12.75A1.5 1.5 0 0 1 12.5 14.25H11.5Z"
          ]
        },
        "24": {
          fill: [
            "M6.75 4.75H9.25A2.75 2.75 0 0 1 12 7.5V18.25A2.75 2.75 0 0 1 9.25 21H6.75A2.75 2.75 0 0 1 4 18.25V7.5A2.75 2.75 0 0 1 6.75 4.75Z",
            "M6.5 5.5V3.75A0.75 0.75 0 0 1 7.25 3H8.75A0.75 0.75 0 0 1 9.5 3.75V5.5Z",
            "M13.5 6.5H19.75A2.25 2.25 0 0 1 22 8.75V11.75A2.25 2.25 0 0 1 19.75 14H17V15.75A1.75 1.75 0 0 1 15.25 17.5H13.5Z"
          ]
        }
      }
    },
    {
      id: "D",
      label: "Cine camera",
      tags: [
        "cine camera",
        "movie camera",
        "reels",
        "cinema",
        "film"
      ],
      note: "Rhythm: two equal reels side by side over the body, 6 · 5 · 4.5 across (0.30 · 0.31 · 0.32 of the width; white inside 3 · 2 · 2), 2 · 2 · 1.5 apart and 2 · 1.5 · 1.5 above the body, set right of the body's middle so the ink mass sits 0.33 · 0.42 · 0.17 left of and 0.53 · 0.48 · 0.47 below the centre (camera sits 0.72 · 0.63 · 0.39 below). Body 16.75x10 · 14x7.5 · 12.75x6 of ink, corners r2.5 · 2 · 1.5 (video's); lens wedge built as video's: legs leave the body 3 · 3 · 2.75 apart on centre (1.5 of air inside the root) and open at 31.6 · 32 · 31 degrees to a back edge 7 · 5.5 · 4.25 long, corners r1 · 1 · 0.75. Ink 20x18 · 16x14 · 14x12, camera's agreed box, box-centred. MDI video-vintage, Jam video-camera-vintage, Boxicons camera-movie, LineIcons camera-movie, IconOven cinema-camera and the movie-camera emoji draw it. Not video: the two reels are the cue; body and wedge are video's, so the two read as a family. Filled: body and wedge one solid (as video-filled), the reels solid discs. Off-grid decimals are the wedge corners' tangent points.",
      box: {
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
      masters: {
        "16": [
          "M3.125 8.625H11.625A1.5 1.5 0 0 1 13.125 10.125V11.875A1.5 1.5 0 0 1 11.625 13.375H3.125A1.5 1.5 0 0 1 1.625 11.875V10.125A1.5 1.5 0 0 1 3.125 8.625Z",
          "M13.125 9.625L13.239 9.557A0.75 0.75 0 0 1 14.375 10.2L14.375 11.8A0.75 0.75 0 0 1 13.239 12.443L13.125 12.375",
          "M2.625 4.25A1.625 1.625 0 1 0 5.875 4.25A1.625 1.625 0 1 0 2.625 4.25Z",
          "M8.625 4.25A1.625 1.625 0 1 0 11.875 4.25A1.625 1.625 0 1 0 8.625 4.25Z"
        ],
        "20": [
          "M4.75 10.25H13.25A2 2 0 0 1 15.25 12.25V14.25A2 2 0 0 1 13.25 16.25H4.75A2 2 0 0 1 2.75 14.25V12.25A2 2 0 0 1 4.75 10.25Z",
          "M15.25 11.75L15.72 11.46A1 1 0 0 1 17.25 12.3L17.25 14.2A1 1 0 0 1 15.72 15.04L15.25 14.75",
          "M3.5 5.5A1.75 1.75 0 1 0 7 5.5A1.75 1.75 0 1 0 3.5 5.5Z",
          "M10 5.5A1.75 1.75 0 1 0 13.5 5.5A1.75 1.75 0 1 0 10 5.5Z"
        ],
        "24": [
          "M5.25 11.75H15.5A2.5 2.5 0 0 1 18 14.25V17.75A2.5 2.5 0 0 1 15.5 20.25H5.25A2.5 2.5 0 0 1 2.75 17.75V14.25A2.5 2.5 0 0 1 5.25 11.75Z",
          "M18 14.5L19.73 13.44A1 1 0 0 1 21.25 14.29L21.25 17.71A1 1 0 0 1 19.73 18.56L18 17.5",
          "M4.25 6A2.25 2.25 0 1 0 8.75 6A2.25 2.25 0 1 0 4.25 6Z",
          "M12.25 6A2.25 2.25 0 1 0 16.75 6A2.25 2.25 0 1 0 12.25 6Z"
        ]
      },
      filled: {
        "16": {
          fill: [
            "M3.125 8H11.625A2.125 2.125 0 0 1 13.75 10.125V11.875A2.125 2.125 0 0 1 11.625 14H3.125A2.125 2.125 0 0 1 1 11.875V10.125A2.125 2.125 0 0 1 3.125 8Z",
            "M12.125 9.496L12.918 9.021A1.375 1.375 0 0 1 15 10.2L15 11.8A1.375 1.375 0 0 1 12.918 12.979L12.125 12.504Z",
            "M2 4.25A2.25 2.25 0 1 0 6.5 4.25A2.25 2.25 0 1 0 2 4.25Z",
            "M8 4.25A2.25 2.25 0 1 0 12.5 4.25A2.25 2.25 0 1 0 8 4.25Z"
          ]
        },
        "20": {
          fill: [
            "M4.75 9.5H13.25A2.75 2.75 0 0 1 16 12.25V14.25A2.75 2.75 0 0 1 13.25 17H4.75A2.75 2.75 0 0 1 2 14.25V12.25A2.75 2.75 0 0 1 4.75 9.5Z",
            "M14.25 11.49L15.32 10.82A1.75 1.75 0 0 1 18 12.3L18 14.2A1.75 1.75 0 0 1 15.32 15.68L14.25 15.01Z",
            "M2.75 5.5A2.5 2.5 0 1 0 7.75 5.5A2.5 2.5 0 1 0 2.75 5.5Z",
            "M9.25 5.5A2.5 2.5 0 1 0 14.25 5.5A2.5 2.5 0 1 0 9.25 5.5Z"
          ]
        },
        "24": {
          fill: [
            "M5.25 11H15.5A3.25 3.25 0 0 1 18.75 14.25V17.75A3.25 3.25 0 0 1 15.5 21H5.25A3.25 3.25 0 0 1 2 17.75V14.25A3.25 3.25 0 0 1 5.25 11Z",
            "M17 14.23L19.33 12.8A1.75 1.75 0 0 1 22 14.29L22 17.71A1.75 1.75 0 0 1 19.33 19.2L17 17.77Z",
            "M3.5 6A3 3 0 1 0 9.5 6A3 3 0 1 0 3.5 6Z",
            "M11.5 6A3 3 0 1 0 17.5 6A3 3 0 1 0 11.5 6Z"
          ]
        }
      }
    }
  ]
};
