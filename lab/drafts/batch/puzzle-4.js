// puzzle-4 repair: in the filled 16 the seam between the two pieces is 1.25 of air, under the 1.5 floor for a band between two filled parts (Maruti, 2026-09-28). Fix (F): the right piece's edge and socket step back 0.25 so the seam is 1.5 all the way round the side tab; the tab's fillet grows 1.5 -> 1.75 to keep the air even and its neck widens 1.58 -> 1.79. Every other master and style is byte-identical to S.
export default {
  "concept": "puzzle-4",
  "set": {
    "S": "puzzle-4",
    "F": "puzzle-4"
  },
  "question": "Filled 16: the seam between the two pieces is 1.25, under the 1.5 floor for a band between filled parts. Approve F (the right piece steps back 0.25, the side tab's fillet grows to keep the air even), judged against S at 16?",
  "candidates": [
    {
      "id": "S",
      "label": "Knob on the piece, half-weight feet",
      "tags": [
        "extension",
        "plugin",
        "integration",
        "add-on",
        "jigsaw",
        "connect",
        "join",
        "two pieces",
        "knob"
      ],
      "note": "The top knob moves left onto the left piece (knob centre x 6.5 · 5.75 · 4.125, was 8.5 · 7.5 · 5.625; head size, height and stand-proud unchanged), outline and filled together, so nothing overhangs the seam: the head's right edge is at 9.25 · 8.25 · 6.375 against the piece edge 11 · 9.5 · 7.5. Its feet are rounded at half the stroke weight in the filled (0.75 · 0.75 · 0.625, the set's bend radius; outline centreline 1.5 · 1.5 · 1.25, was 1 · 1 · 0.875). The right foot lands on the top edge 0.65 · 0.04 · 0.03 before the seam's 0.5 corner; the left foot lands on the outer corner arc - the piece is 9 · 7.5 · 6.5 wide and the knob's foot needs about all of it, so the left shoulder is the corner itself. Why not a smaller knob instead: trimming the head closes the outline knob's hollow neck below 1.5 (0.74 at 24 for 0.25 less), so the knob moves, it does not shrink. Outline knob neck clear inside stays over 1.75 at every master; the knob head is 3.63 · 3.01 · 2.59 clear of the right piece; narrowest filled air is the seam: 1.5 · 1.49 · 1.25 (1.49 is the shipped seam's 2-dp rounding). Ink 20x20 · 16x16 · 14x14 both styles. (recommended: looked at in real pixels at 16 and 20, both feet now render as clean curves, with no notch and no hook, and the knob still has a small shoulder on the left where the corner rounds into it; B's wider foot removes that shoulder and the left piece starts to read as a bottle. Cost against S: the knob sits in the middle of the piece, not beside the seam, and at 16 the left piece is more dome than shoulders)",
      "masters": {
        "16": [
          "M1.625 6.375A1.5 1.5 0 0 1 2.194 5.199A1.25 1.25 0 0 0 2.595 3.798A1.625 1.625 0 0 1 4.125 1.625A1.625 1.625 0 0 1 5.736 3.462A1.25 1.25 0 0 0 6.975 4.875H12.875A1.5 1.5 0 0 1 14.375 6.375V12.875A1.5 1.5 0 0 1 12.875 14.375H3.125A1.5 1.5 0 0 1 1.625 12.875Z",
          "M8.125 4.875V7.334A0.875 0.875 0 0 0 9.35 8.136A1.625 1.625 0 0 1 11.625 9.625A1.625 1.625 0 0 1 9.35 11.114A0.875 0.875 0 0 0 8.125 11.916V14.375"
        ],
        "20": [
          "M2.75 8.5A2 2 0 0 1 3.59 6.87A1.5 1.5 0 0 0 4.11 5.12A1.75 1.75 0 0 1 5.75 2.75A1.75 1.75 0 0 1 7.48 4.77A1.5 1.5 0 0 0 8.96 6.5H15.25A2 2 0 0 1 17.25 8.5V15.25A2 2 0 0 1 15.25 17.25H4.75A2 2 0 0 1 2.75 15.25Z",
          "M10.25 6.5V9.31A1 1 0 0 0 11.61 10.24A1.75 1.75 0 0 1 14 11.88A1.75 1.75 0 0 1 11.61 13.51A1 1 0 0 0 10.25 14.44V17.25"
        ],
        "24": [
          "M2.75 9.75A2.5 2.5 0 0 1 4.05 7.56A1.5 1.5 0 0 0 4.69 5.6A2 2 0 0 1 6.5 2.75A2 2 0 0 1 8.42 5.32A1.5 1.5 0 0 0 9.85 7.25H18.75A2.5 2.5 0 0 1 21.25 9.75V18.75A2.5 2.5 0 0 1 18.75 21.25H5.25A2.5 2.5 0 0 1 2.75 18.75Z",
          "M11.75 7.25V11.65A1 1 0 0 0 13.25 12.52A2 2 0 0 1 16.25 14.25A2 2 0 0 1 13.25 15.98A1 1 0 0 0 11.75 16.85V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 6.375A2.125 2.125 0 0 1 1.806 4.709A0.625 0.625 0 0 0 2.007 4.008A2.25 2.25 0 0 1 4.125 1A2.25 2.25 0 0 1 6.356 3.543A0.625 0.625 0 0 0 6.975 4.25H7A0.5 0.5 0 0 1 7.5 4.75V7.334A1.5 1.5 0 0 0 9.6 8.708A1 1 0 0 1 11 9.625A1 1 0 0 1 9.6 10.542A1.5 1.5 0 0 0 7.5 11.916V14.5A0.5 0.5 0 0 1 7 15H3.125A2.125 2.125 0 0 1 1 12.875Z",
            "M8.75 4.75A0.5 0.5 0 0 1 9.25 4.25H12.875A2.125 2.125 0 0 1 15 6.375V12.875A2.125 2.125 0 0 1 12.875 15H9.25A0.5 0.5 0 0 1 8.75 14.5V11.916A0.25 0.25 0 0 1 9.1 11.687A2.25 2.25 0 0 0 12.25 9.625A2.25 2.25 0 0 0 9.1 7.563A0.25 0.25 0 0 1 8.75 7.334Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 8.5A2.75 2.75 0 0 1 3.15 6.26A0.75 0.75 0 0 0 3.41 5.39A2.5 2.5 0 0 1 5.75 2A2.5 2.5 0 0 1 8.22 4.88A0.75 0.75 0 0 0 8.96 5.75H9A0.5 0.5 0 0 1 9.5 6.25V9.31A1.75 1.75 0 0 0 11.89 10.94A1 1 0 0 1 13.25 11.88A1 1 0 0 1 11.89 12.81A1.75 1.75 0 0 0 9.5 14.44V17.5A0.5 0.5 0 0 1 9 18H4.75A2.75 2.75 0 0 1 2 15.25Z",
            "M11 6.25A0.5 0.5 0 0 1 11.5 5.75H15.25A2.75 2.75 0 0 1 18 8.5V15.25A2.75 2.75 0 0 1 15.25 18H11.5A0.5 0.5 0 0 1 11 17.5V14.44A0.25 0.25 0 0 1 11.34 14.2A2.5 2.5 0 0 0 14.75 11.88A2.5 2.5 0 0 0 11.34 9.55A0.25 0.25 0 0 1 11 9.31Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 9.75A3.25 3.25 0 0 1 3.69 6.9A0.75 0.75 0 0 0 4.01 5.92A2.75 2.75 0 0 1 6.5 2A2.75 2.75 0 0 1 9.14 5.54A0.75 0.75 0 0 0 9.85 6.5H10.5A0.5 0.5 0 0 1 11 7V11.65A1.75 1.75 0 0 0 13.63 13.17A1.25 1.25 0 0 1 15.5 14.25A1.25 1.25 0 0 1 13.63 15.33A1.75 1.75 0 0 0 11 16.85V21.5A0.5 0.5 0 0 1 10.5 22H5.25A3.25 3.25 0 0 1 2 18.75Z",
            "M12.5 7A0.5 0.5 0 0 1 13 6.5H18.75A3.25 3.25 0 0 1 22 9.75V18.75A3.25 3.25 0 0 1 18.75 22H13A0.5 0.5 0 0 1 12.5 21.5V16.85A0.25 0.25 0 0 1 12.88 16.63A2.75 2.75 0 0 0 17 14.25A2.75 2.75 0 0 0 12.88 11.87A0.25 0.25 0 0 1 12.5 11.65Z"
          ],
          "stroke": []
        }
      }
    },
    {
      "id": "F",
      "label": "Knob on the piece, half-weight feet",
      "tags": [
        "extension",
        "plugin",
        "integration",
        "add-on",
        "jigsaw",
        "connect",
        "join",
        "two pieces",
        "knob"
      ],
      "note": "The top knob moves left onto the left piece (knob centre x 6.5 · 5.75 · 4.125, was 8.5 · 7.5 · 5.625; head size, height and stand-proud unchanged), outline and filled together, so nothing overhangs the seam: the head's right edge is at 9.25 · 8.25 · 6.375 against the piece edge 11 · 9.5 · 7.5. Its feet are rounded at half the stroke weight in the filled (0.75 · 0.75 · 0.625, the set's bend radius; outline centreline 1.5 · 1.5 · 1.25, was 1 · 1 · 0.875). The right foot lands on the top edge 0.65 · 0.04 · 0.03 before the seam's 0.5 corner; the left foot lands on the outer corner arc - the piece is 9 · 7.5 · 6.5 wide and the knob's foot needs about all of it, so the left shoulder is the corner itself. Why not a smaller knob instead: trimming the head closes the outline knob's hollow neck below 1.5 (0.74 at 24 for 0.25 less), so the knob moves, it does not shrink. Outline knob neck clear inside stays over 1.75 at every master; the knob head is 3.63 · 3.01 · 2.83 clear of the right piece; narrowest filled air is the seam: 1.5 · 1.49 · 1.5 (1.49 is the shipped seam's 2-dp rounding). The filled 16 seam was 1.25 and is widened to the 1.5 floor for a band between filled parts (2026-09-28) on the right piece's side, because the left piece's top-right corner starts where the knob's right foot lands: the right piece's edge moves from 8.75 to 9 and its socket radius from 2.25 to 2.5 round the same head (r1, centre 10,9.625); the left piece's side-tab fillet goes from r1.5 to r1.75, concentric with the right piece's r0.25 mouth corner (centre 9.25,6.979), so the air round it stays an even 1.5 and the tab's neck widens to 1.79 (was 1.58). New decimals: 6.979 / 12.271 are where that fillet meets the seam edges, 9.727,8.663 / 10.587 where it meets the head, 9.318,7.22 / 12.03 where the mouth corner meets the socket. Ink 20x20 · 16x16 · 14x14 both styles. (recommended: looked at in real pixels at 16 and 20, both feet now render as clean curves, with no notch and no hook, and the knob still has a small shoulder on the left where the corner rounds into it; B's wider foot removes that shoulder and the left piece starts to read as a bottle. Cost against S: the knob sits in the middle of the piece, not beside the seam, and at 16 the left piece is more dome than shoulders) (recommended: only the filled 16 changes)",
      "masters": {
        "16": [
          "M1.625 6.375A1.5 1.5 0 0 1 2.194 5.199A1.25 1.25 0 0 0 2.595 3.798A1.625 1.625 0 0 1 4.125 1.625A1.625 1.625 0 0 1 5.736 3.462A1.25 1.25 0 0 0 6.975 4.875H12.875A1.5 1.5 0 0 1 14.375 6.375V12.875A1.5 1.5 0 0 1 12.875 14.375H3.125A1.5 1.5 0 0 1 1.625 12.875Z",
          "M8.125 4.875V7.334A0.875 0.875 0 0 0 9.35 8.136A1.625 1.625 0 0 1 11.625 9.625A1.625 1.625 0 0 1 9.35 11.114A0.875 0.875 0 0 0 8.125 11.916V14.375"
        ],
        "20": [
          "M2.75 8.5A2 2 0 0 1 3.59 6.87A1.5 1.5 0 0 0 4.11 5.12A1.75 1.75 0 0 1 5.75 2.75A1.75 1.75 0 0 1 7.48 4.77A1.5 1.5 0 0 0 8.96 6.5H15.25A2 2 0 0 1 17.25 8.5V15.25A2 2 0 0 1 15.25 17.25H4.75A2 2 0 0 1 2.75 15.25Z",
          "M10.25 6.5V9.31A1 1 0 0 0 11.61 10.24A1.75 1.75 0 0 1 14 11.88A1.75 1.75 0 0 1 11.61 13.51A1 1 0 0 0 10.25 14.44V17.25"
        ],
        "24": [
          "M2.75 9.75A2.5 2.5 0 0 1 4.05 7.56A1.5 1.5 0 0 0 4.69 5.6A2 2 0 0 1 6.5 2.75A2 2 0 0 1 8.42 5.32A1.5 1.5 0 0 0 9.85 7.25H18.75A2.5 2.5 0 0 1 21.25 9.75V18.75A2.5 2.5 0 0 1 18.75 21.25H5.25A2.5 2.5 0 0 1 2.75 18.75Z",
          "M11.75 7.25V11.65A1 1 0 0 0 13.25 12.52A2 2 0 0 1 16.25 14.25A2 2 0 0 1 13.25 15.98A1 1 0 0 0 11.75 16.85V21.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M1 6.375A2.125 2.125 0 0 1 1.806 4.709A0.625 0.625 0 0 0 2.007 4.008A2.25 2.25 0 0 1 4.125 1A2.25 2.25 0 0 1 6.356 3.543A0.625 0.625 0 0 0 6.975 4.25H7A0.5 0.5 0 0 1 7.5 4.75V6.979A1.75 1.75 0 0 0 9.727 8.663A1 1 0 0 1 11 9.625A1 1 0 0 1 9.727 10.587A1.75 1.75 0 0 0 7.5 12.271V14.5A0.5 0.5 0 0 1 7 15H3.125A2.125 2.125 0 0 1 1 12.875Z",
            "M9 4.75A0.5 0.5 0 0 1 9.5 4.25H12.875A2.125 2.125 0 0 1 15 6.375V12.875A2.125 2.125 0 0 1 12.875 15H9.5A0.5 0.5 0 0 1 9 14.5V12.271A0.25 0.25 0 0 1 9.318 12.03A2.5 2.5 0 0 0 12.5 9.625A2.5 2.5 0 0 0 9.318 7.22A0.25 0.25 0 0 1 9 6.979Z"
          ],
          "stroke": []
        },
        "20": {
          "fill": [
            "M2 8.5A2.75 2.75 0 0 1 3.15 6.26A0.75 0.75 0 0 0 3.41 5.39A2.5 2.5 0 0 1 5.75 2A2.5 2.5 0 0 1 8.22 4.88A0.75 0.75 0 0 0 8.96 5.75H9A0.5 0.5 0 0 1 9.5 6.25V9.31A1.75 1.75 0 0 0 11.89 10.94A1 1 0 0 1 13.25 11.88A1 1 0 0 1 11.89 12.81A1.75 1.75 0 0 0 9.5 14.44V17.5A0.5 0.5 0 0 1 9 18H4.75A2.75 2.75 0 0 1 2 15.25Z",
            "M11 6.25A0.5 0.5 0 0 1 11.5 5.75H15.25A2.75 2.75 0 0 1 18 8.5V15.25A2.75 2.75 0 0 1 15.25 18H11.5A0.5 0.5 0 0 1 11 17.5V14.44A0.25 0.25 0 0 1 11.34 14.2A2.5 2.5 0 0 0 14.75 11.88A2.5 2.5 0 0 0 11.34 9.55A0.25 0.25 0 0 1 11 9.31Z"
          ],
          "stroke": []
        },
        "24": {
          "fill": [
            "M2 9.75A3.25 3.25 0 0 1 3.69 6.9A0.75 0.75 0 0 0 4.01 5.92A2.75 2.75 0 0 1 6.5 2A2.75 2.75 0 0 1 9.14 5.54A0.75 0.75 0 0 0 9.85 6.5H10.5A0.5 0.5 0 0 1 11 7V11.65A1.75 1.75 0 0 0 13.63 13.17A1.25 1.25 0 0 1 15.5 14.25A1.25 1.25 0 0 1 13.63 15.33A1.75 1.75 0 0 0 11 16.85V21.5A0.5 0.5 0 0 1 10.5 22H5.25A3.25 3.25 0 0 1 2 18.75Z",
            "M12.5 7A0.5 0.5 0 0 1 13 6.5H18.75A3.25 3.25 0 0 1 22 9.75V18.75A3.25 3.25 0 0 1 18.75 22H13A0.5 0.5 0 0 1 12.5 21.5V16.85A0.25 0.25 0 0 1 12.88 16.63A2.75 2.75 0 0 0 17 14.25A2.75 2.75 0 0 0 12.88 11.87A0.25 0.25 0 0 1 12.5 11.65Z"
          ],
          "stroke": []
        }
      }
    }
  ]
};
