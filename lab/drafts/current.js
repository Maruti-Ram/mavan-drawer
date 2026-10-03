// face-neutral — face-smile with the smile taken out. Ring and mouth are settled: the ring is
// face-smile’s, lifted from the shipped files; the mouth is one straight round-capped line at
// depth 3.75 · 3 · 2.625 and ink 9 · 7 · 6, the middle of Polaris, Lucide and Nucleo.
//
// THE QUESTION IS THE EYES. At 20 and 16 they sit higher against the ring than at 24 — 0.24 · 0.33
// · 0.39 R above the middle — so the interior reads top-heavy at small sizes. The cause is that
// the 1.5 gap floor is absolute: face-smile’s mouth curves up towards the eyes and its filled
// eye-to-mouth gap is already 1.55 at 20 and 1.53 at 16, so its eyes are pinned at their floor.
// A flat mouth has no such pressure, so the neutral CAN be drawn in proportion.
//
// Two drifts, measured apart, because they are separate corrections:
//   position  eye centre ÷ R   0.24 · 0.33 · 0.39   — lowering alone fixes it (D1)
//   size      eye ink    ÷ R   0.32 · 0.38 · 0.39   — shortening fixes it, and costs the dash (D)
// Lowering does nearly all the work: balance goes 1.01 → 1.55 at 16 on its own, 1.67 with the
// shortening too. The shortening is not free — see D’s note.
//
// The references do NOT run looser gaps than we do. Scaled to our ring they hold 0.228–0.400 R
// against our floor’s 0.235 R at 16. What they do is sit the eyes low, which a flat mouth allows.

export default {
  concept: "face-neutral",
  tags: ["dash eyes", "flat mouth", "neutral", "meh", "indifferent", "expression"],
  family: ["face-smile"],
  question: "The eyes at 20 and 16. A keeps face-smile’s exactly and stays top-heavy; D1 lowers them to 24’s height and changes nothing else; D also shortens them, which squares up the dash. face-smile cannot follow either — its own gaps are at the floor.",
  candidates: [
    {
      id: "A",
      label: "face-smile’s eyes, untouched",
      note: "The eyes are the shipped face-smile’s to the decimal, so the two faces are the same face at every master. The cost is the drift: against the ring radius the mouth’s clearance holds (0.26 · 0.23 · 0.25 R) but the eyes climb (0.24 · 0.33 · 0.39 R above the middle), so air above the eyes against air below the mouth runs 1.63 · 1.36 · 1.01 and at 16 the eyes press to the top.",
      masters: {
        24: [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.75 9V10.5",
          "M14.25 9V10.5",
          "M8.25 15.75H15.75"
        ],
        20: [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8.25 7V8.25",
          "M11.75 7V8.25",
          "M7.25 13H12.75"
        ],
        16: [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.375 4.875V6.125",
          "M9.625 4.875V6.125",
          "M5.625 10.625H10.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM8.75 9L8.75 10.5A1 1 0 0 0 10.75 10.5L10.75 9A1 1 0 0 0 8.75 9ZM13.25 9L13.25 10.5A1 1 0 0 0 15.25 10.5L15.25 9A1 1 0 0 0 13.25 9ZM8.25 14.75L15.75 14.75A1 1 0 0 1 15.75 16.75L8.25 16.75A1 1 0 0 1 8.25 14.75Z"
          ]
        },
        20: {
          fill: [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM7.37 7L7.37 8.25A0.88 0.88 0 0 0 9.13 8.25L9.13 7A0.88 0.88 0 0 0 7.37 7ZM10.87 7L10.87 8.25A0.88 0.88 0 0 0 12.63 8.25L12.63 7A0.88 0.88 0 0 0 10.87 7ZM7.25 12.12L12.75 12.12A0.88 0.88 0 0 1 12.75 13.88L7.25 13.88A0.88 0.88 0 0 1 7.25 12.12Z"
          ]
        },
        16: {
          fill: [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM5.5 4.875L5.5 6.125A0.875 0.875 0 0 0 7.25 6.125L7.25 4.875A0.875 0.875 0 0 0 5.5 4.875ZM8.75 4.875L8.75 6.125A0.875 0.875 0 0 0 10.5 6.125L10.5 4.875A0.875 0.875 0 0 0 8.75 4.875ZM5.625 9.75L10.375 9.75A0.875 0.875 0 0 1 10.375 11.5L5.625 11.5A0.875 0.875 0 0 1 5.625 9.75Z"
          ]
        }
      }
    },
    {
      id: "D1",
      label: "Eyes lowered",
      note: "The eyes put back on 24’s height and NOTHING else changed — same length, same x, same mouth. Eye centre 0.24 · 0.26 · 0.24 R above the middle, against A’s 0.24 · 0.33 · 0.39. The 20 master lands on 0.26 rather than 0.24 because the eye is 1.25 of centreline and both ends have to sit on the quarter grid, which allows 0.224 or 0.259 and nothing between; 0.259 is the nearer. Balance 1.63 · 1.61 · 1.55 against 24’s 1.63. This is also where all three references put a neutral’s eyes — Polaris 0.24 R, Lucide 0.25 R — and they can because a flat mouth leaves the room. Every gap stays above 1.5, so no declared exception is needed. (recommended)",
      masters: {
        24: [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.75 9V10.5",
          "M14.25 9V10.5",
          "M8.25 15.75H15.75"
        ],
        20: [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8.25 7.5V8.75",
          "M11.75 7.5V8.75",
          "M7.25 13H12.75"
        ],
        16: [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.375 5.875V7.125",
          "M9.625 5.875V7.125",
          "M5.625 10.625H10.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM8.75 9L8.75 10.5A1 1 0 0 0 10.75 10.5L10.75 9A1 1 0 0 0 8.75 9ZM13.25 9L13.25 10.5A1 1 0 0 0 15.25 10.5L15.25 9A1 1 0 0 0 13.25 9ZM8.25 14.75L15.75 14.75A1 1 0 0 1 15.75 16.75L8.25 16.75A1 1 0 0 1 8.25 14.75Z"
          ]
        },
        20: {
          fill: [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM7.37 7.5L7.37 8.75A0.88 0.88 0 0 0 9.13 8.75L9.13 7.5A0.88 0.88 0 0 0 7.37 7.5ZM10.87 7.5L10.87 8.75A0.88 0.88 0 0 0 12.63 8.75L12.63 7.5A0.88 0.88 0 0 0 10.87 7.5ZM7.25 12.12L12.75 12.12A0.88 0.88 0 0 1 12.75 13.88L7.25 13.88A0.88 0.88 0 0 1 7.25 12.12Z"
          ]
        },
        16: {
          fill: [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM5.5 5.875L5.5 7.125A0.875 0.875 0 0 0 7.25 7.125L7.25 5.875A0.875 0.875 0 0 0 5.5 5.875ZM8.75 5.875L8.75 7.125A0.875 0.875 0 0 0 10.5 7.125L10.5 5.875A0.875 0.875 0 0 0 8.75 5.875ZM5.625 9.75L10.375 9.75A0.875 0.875 0 0 1 10.375 11.5L5.625 11.5A0.875 0.875 0 0 1 5.625 9.75Z"
          ]
        }
      }
    },
    {
      id: "D",
      label: "Eyes lowered and shortened",
      note: "D1 with the eye also shortened, to 24’s proportion of the face (ink 0.32 · 0.34 · 0.31 R rather than 0.32 · 0.38 · 0.39). It buys a little more balance — 1.73 · 1.67 at 20 and 16, against D1’s 1.67 · 1.55 — but it costs the dash its shape: ink against stroke falls from 2.0 at 24 and 2.0 at 16 shipped to 1.67 and 1.60, so the dash goes squat just where it is hardest to tell from a dot. The eye cannot hold both its share of the face and its own proportion, because the stroke itself is proportionally thicker at 16 (C7); the shipped drawing keeps the dash, and D1 keeps that choice.",
      masters: {
        24: [
          "M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z",
          "M9.75 9V10.5",
          "M14.25 9V10.5",
          "M8.25 15.75H15.75"
        ],
        20: [
          "M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z",
          "M8.25 7.75V8.75",
          "M11.75 7.75V8.75",
          "M7.25 13H12.75"
        ],
        16: [
          "M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z",
          "M6.375 6.125V6.875",
          "M9.625 6.125V6.875",
          "M5.625 10.625H10.375"
        ]
      },
      filled: {
        24: {
          fill: [
            "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM8.75 9L8.75 10.5A1 1 0 0 0 10.75 10.5L10.75 9A1 1 0 0 0 8.75 9ZM13.25 9L13.25 10.5A1 1 0 0 0 15.25 10.5L15.25 9A1 1 0 0 0 13.25 9ZM8.25 14.75L15.75 14.75A1 1 0 0 1 15.75 16.75L8.25 16.75A1 1 0 0 1 8.25 14.75Z"
          ]
        },
        20: {
          fill: [
            "M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10ZM7.37 7.75L7.37 8.75A0.88 0.88 0 0 0 9.13 8.75L9.13 7.75A0.88 0.88 0 0 0 7.37 7.75ZM10.87 7.75L10.87 8.75A0.88 0.88 0 0 0 12.63 8.75L12.63 7.75A0.88 0.88 0 0 0 10.87 7.75ZM7.25 12.12L12.75 12.12A0.88 0.88 0 0 1 12.75 13.88L7.25 13.88A0.88 0.88 0 0 1 7.25 12.12Z"
          ]
        },
        16: {
          fill: [
            "M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM5.5 6.125L5.5 6.875A0.875 0.875 0 0 0 7.25 6.875L7.25 6.125A0.875 0.875 0 0 0 5.5 6.125ZM8.75 6.125L8.75 6.875A0.875 0.875 0 0 0 10.5 6.875L10.5 6.125A0.875 0.875 0 0 0 8.75 6.125ZM5.625 9.75L10.375 9.75A0.875 0.875 0 0 1 10.375 11.5L5.625 11.5A0.875 0.875 0 0 1 5.625 9.75Z"
          ]
        }
      }
    }
  ]
};
