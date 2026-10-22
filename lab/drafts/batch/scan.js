// scan: four bare corners is already our `maximize`, so scan has to add the thing that makes it scan (a beam, a page, a device) — and the frame chosen here is the base `scan-face`, `barcode` and `qr-code` will build on.
export default {
  "concept": "scan",
  "question": "Which picture says scan: the viewfinder with a scan line (A), with a page (B) or with a focus ring (E), or the device itself, a flatbed (C) or a handheld gun (D)?",
  "candidates": [
    {
      "id": "A",
      "label": "Scan line in frame",
      "tags": [
        "scan line",
        "viewfinder",
        "brackets",
        "beam"
      ],
      "note": "Rhythm: maximize's four soft corners verbatim (spread 18×18 · 14×14 · 12×12, radius 2.5 · 2 · 1.5, arms 6 · 4.75 · 4 of ink, 6 · 4.5 · 4 of air between tips along a side) with one level line through the centre, 12 · 9.5 · 8 of ink (67 · 68 · 67% of the spread, so the line is the same share of the frame at every master), on y 12 · 10 · 8. Air from each line end to the nearest corner tip 3.3 · 2.25 · 2.05; the line passes through the open middle of each side, so it never runs beside an arm. Ink 18×18 · 14×14 · 12×12, box-centred. Filled: line-heavy, weight 2.5 · 2 · 2, the corners are maximize-filled verbatim and the line pulls in 0.5 · 0.25 · 0.375 so the ink box is identical; air to the tips 2.7 · 1.95 · 1.61. How it differs from maximize: the line is the only change, and it is what turns 'make this bigger' into 'read what is in here'. Who: Lucide scan-line, Tabler scan, Nucleo scan (Nucleo runs the line past the corners). (recommended) — it is the scan picture most sets share, it keeps maximize's frame so scan-face, barcode and qr-code can swap the line for their own content, and the line survives at 16 with 2 of air to the corners.",
      "masters": {
        "16": [
          "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
          "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
          "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
          "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625",
          "M4.625 8L11.375 8"
        ],
        "20": [
          "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
          "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
          "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
          "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13",
          "M6 10L14 10"
        ],
        "24": [
          "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
          "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
          "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
          "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75",
          "M6.75 12L17.25 12"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M5 3L4.125 3A1.125 1.125 0 0 0 3 4.125L3 5",
            "M11 3L11.875 3A1.125 1.125 0 0 1 13 4.125L13 5",
            "M5 13L4.125 13A1.125 1.125 0 0 1 3 11.875L3 11",
            "M11 13L11.875 13A1.125 1.125 0 0 0 13 11.875L13 11",
            "M5 8L11 8"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M6.75 4L5.75 4A1.75 1.75 0 0 0 4 5.75L4 6.75",
            "M13.25 4L14.25 4A1.75 1.75 0 0 1 16 5.75L16 6.75",
            "M6.75 16L5.75 16A1.75 1.75 0 0 1 4 14.25L4 13.25",
            "M13.25 16L14.25 16A1.75 1.75 0 0 0 16 14.25L16 13.25",
            "M6.25 10L13.75 10"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M7.75 4.25L6.25 4.25A2 2 0 0 0 4.25 6.25L4.25 7.75",
            "M16.25 4.25L17.75 4.25A2 2 0 0 1 19.75 6.25L19.75 7.75",
            "M7.75 19.75L6.25 19.75A2 2 0 0 1 4.25 17.75L4.25 16.25",
            "M16.25 19.75L17.75 19.75A2 2 0 0 0 19.75 17.75L19.75 16.25",
            "M7.25 12L16.75 12"
          ]
        }
      }
    },
    {
      "id": "B",
      "label": "Page in frame",
      "tags": [
        "document",
        "page",
        "viewfinder",
        "brackets"
      ],
      "note": "Rhythm: maximize's corners verbatim, with a portrait page centred inside: ink 9×12 · 6.5×8 · 5×6.5, its top and bottom 1.68 · 1.77 · 1.81 clear of the corners (the floor is 1.5; the page's own rounded corners give the extra), its sides 3 · 2.25 · 2.25 clear of the side arms. The page is file's shape scaled down: corner radius 1.25 · 1 · 0.75 on the centreline, top-right cut at 45° by 3 · 2 · 1.5. No fold line and no text lines: inside the page there is 6×9 · 3.5×5 · 2.5×4 of white, which cannot hold a flap or a line with 1.5 of air at 20 and 16, so they are left out at every master for one rhythm. Ink 18×18 · 14×14 · 12×12, box-centred. Filled: the page solid to the outline's outer edge (the cut's two corners rounded by the stroke's own 0.75 · 0.75 · 0.625), the corners stay lines at 1.5 · 1.5 · 1.25 — a shape icon, as maximize-5-filled. Who: SF Symbols doc.viewfinder, Material document_scanner, Nucleo document-scan. Says 'scan a document' rather than 'scan'; at 16 the page is 5 wide and reads as a small tile with a clipped corner.",
      "masters": {
        "16": [
          "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
          "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
          "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
          "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625",
          "M6.875 5.375L8.375 5.375L9.875 6.875L9.875 9.875A0.75 0.75 0 0 1 9.125 10.625L6.875 10.625A0.75 0.75 0 0 1 6.125 9.875L6.125 6.125A0.75 0.75 0 0 1 6.875 5.375Z"
        ],
        "20": [
          "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
          "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
          "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
          "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13",
          "M8.5 6.75L10.5 6.75L12.5 8.75L12.5 12.25A1 1 0 0 1 11.5 13.25L8.5 13.25A1 1 0 0 1 7.5 12.25L7.5 7.75A1 1 0 0 1 8.5 6.75Z"
        ],
        "24": [
          "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
          "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
          "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
          "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75",
          "M9.5 6.75L12.75 6.75L15.75 9.75L15.75 16A1.25 1.25 0 0 1 14.5 17.25L9.5 17.25A1.25 1.25 0 0 1 8.25 16L8.25 8A1.25 1.25 0 0 1 9.5 6.75Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M6.875 4.75L8.375 4.75A0.625 0.625 0 0 1 8.817 4.933L10.317 6.433A0.625 0.625 0 0 1 10.5 6.875L10.5 9.875A1.375 1.375 0 0 1 9.125 11.25L6.875 11.25A1.375 1.375 0 0 1 5.5 9.875L5.5 6.125A1.375 1.375 0 0 1 6.875 4.75Z"
          ],
          "stroke": [
            "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
            "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
            "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
            "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625"
          ]
        },
        "20": {
          "fill": [
            "M8.5 6L10.5 6A0.75 0.75 0 0 1 11.03 6.22L13.03 8.22A0.75 0.75 0 0 1 13.25 8.75L13.25 12.25A1.75 1.75 0 0 1 11.5 14L8.5 14A1.75 1.75 0 0 1 6.75 12.25L6.75 7.75A1.75 1.75 0 0 1 8.5 6Z"
          ],
          "stroke": [
            "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
            "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
            "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
            "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13"
          ]
        },
        "24": {
          "fill": [
            "M9.5 6L12.75 6A0.75 0.75 0 0 1 13.28 6.22L16.28 9.22A0.75 0.75 0 0 1 16.5 9.75L16.5 16A2 2 0 0 1 14.5 18L9.5 18A2 2 0 0 1 7.5 16L7.5 8A2 2 0 0 1 9.5 6Z"
          ],
          "stroke": [
            "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
            "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
            "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
            "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75"
          ]
        }
      }
    },
    {
      "id": "C",
      "label": "Flatbed scanner",
      "tags": [
        "flatbed",
        "scanner",
        "lid",
        "device"
      ],
      "note": "Rhythm: one air across the body's inside — wall to status dot, dot to light slot, slot to wall 2 · 1.75 · 1.5 at 24 · 20 · 16; the dot and slot sit on the body's middle line, 3 · 1.75 · 1.5 clear of top and bottom inside. Body ink 20×11 · 16×8.5 · 14×7.5, corner radius 2.5 · 2 · 1.5 (the container radius, as printer). The lid rises from the end of the top-right corner at slope 1:2 (26.6°) at every master to a tip 2 · 1.5 · 2.25 in from the left wall, standing 5.51 · 4.02 · 3.25 clear of the body at the tip; the narrow wedge where it leaves the body is the hinge, the same construction as radio's strap. Dot ⌀2 (printer-2's status dot), slot 9 · 5.75 · 5 of ink. Ink 20×18 · 16×14 · 14×12, camera's and radio's agreed box. Filled: body solid, dot and slot cut out white (slot white 1.5 tall at every master, so at 16 it is wider than the 1.25 line), material between the two cut-outs 2 · 1.75 · 1.5; lid stays a line at 1.5 · 1.5 · 1.25. Who: Material scanner, SF Symbols scanner. The device, not the act: reads as 'scanner' in a device list and sits beside printer-2, but it is a heavier picture than the frame family for a scan button.",
      "masters": {
        "16": [
          "M3.125 7.125L12.875 7.125A1.5 1.5 0 0 1 14.375 8.625L14.375 11.875A1.5 1.5 0 0 1 12.875 13.375L3.125 13.375A1.5 1.5 0 0 1 1.625 11.875L1.625 8.625A1.5 1.5 0 0 1 3.125 7.125Z",
          "M12.875 7.125L3.875 2.625",
          "M4.375 10.25A0.375 0.375 0 1 0 5.125 10.25A0.375 0.375 0 1 0 4.375 10.25Z",
          "M7.875 10.25L11.625 10.25"
        ],
        "20": [
          "M4.75 9.25L15.25 9.25A2 2 0 0 1 17.25 11.25L17.25 14.25A2 2 0 0 1 15.25 16.25L4.75 16.25A2 2 0 0 1 2.75 14.25L2.75 11.25A2 2 0 0 1 4.75 9.25Z",
          "M15.25 9.25L4.25 3.75",
          "M6 12.75A0.25 0.25 0 1 0 6.5 12.75A0.25 0.25 0 1 0 6 12.75Z",
          "M9.75 12.75L14 12.75"
        ],
        "24": [
          "M5.25 10.75L18.75 10.75A2.5 2.5 0 0 1 21.25 13.25L21.25 17.75A2.5 2.5 0 0 1 18.75 20.25L5.25 20.25A2.5 2.5 0 0 1 2.75 17.75L2.75 13.25A2.5 2.5 0 0 1 5.25 10.75Z",
          "M18.75 10.75L4.75 3.75",
          "M6.25 15.5A0.25 0.25 0 1 0 6.75 15.5A0.25 0.25 0 1 0 6.25 15.5Z",
          "M10.25 15.5L17.75 15.5"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M3.125 6.5L12.875 6.5A2.125 2.125 0 0 1 15 8.625L15 11.875A2.125 2.125 0 0 1 12.875 14L3.125 14A2.125 2.125 0 0 1 1 11.875L1 8.625A2.125 2.125 0 0 1 3.125 6.5ZM3.75 10.25A1 1 0 1 0 5.75 10.25A1 1 0 1 0 3.75 10.25ZM8 9.5H11.5A0.75 0.75 0 0 1 11.5 11H8A0.75 0.75 0 0 1 8 9.5Z"
          ],
          "stroke": [
            "M12.875 7.125L3.875 2.625"
          ]
        },
        "20": {
          "fill": [
            "M4.75 8.5L15.25 8.5A2.75 2.75 0 0 1 18 11.25L18 14.25A2.75 2.75 0 0 1 15.25 17L4.75 17A2.75 2.75 0 0 1 2 14.25L2 11.25A2.75 2.75 0 0 1 4.75 8.5ZM5.25 12.75A1 1 0 1 0 7.25 12.75A1 1 0 1 0 5.25 12.75ZM9.75 12H14A0.75 0.75 0 0 1 14 13.5H9.75A0.75 0.75 0 0 1 9.75 12Z"
          ],
          "stroke": [
            "M15.25 9.25L4.25 3.75"
          ]
        },
        "24": {
          "fill": [
            "M5.25 10L18.75 10A3.25 3.25 0 0 1 22 13.25L22 17.75A3.25 3.25 0 0 1 18.75 21L5.25 21A3.25 3.25 0 0 1 2 17.75L2 13.25A3.25 3.25 0 0 1 5.25 10ZM5.5 15.5A1 1 0 1 0 7.5 15.5A1 1 0 1 0 5.5 15.5ZM10.25 14.75H17.75A0.75 0.75 0 0 1 17.75 16.25H10.25A0.75 0.75 0 0 1 10.25 14.75Z"
          ],
          "stroke": [
            "M18.75 10.75L4.75 3.75"
          ]
        }
      },
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
      }
    },
    {
      "id": "D",
      "label": "Handheld scanner gun",
      "tags": [
        "handheld",
        "barcode reader",
        "gun",
        "beam",
        "retail"
      ],
      "note": "Rhythm: 1.5 of air everywhere the beam meets the drawing — between the two rays where they leave the window and from each ray to the window, at every master. Head ink 11.5×8 · 8.5×7 · 7×5.75, corners 1.5–2 · 1–1.5 · 0.75–1.25; the grip hangs from its rear half and slants back 8.5° · 8.1° · 6.8°, parallel sides 4 · 3.25 · 2.875 apart on the centreline (white inside 2.5 · 1.75 · 1.625), the joints to the head rounded concave at 1 · 0.75 · 0.625 (half the weight at 16, C10's floor). The rays fan out of the window at 26.6° · 26.6° · 21.3°, 3.5 · 2.5 · 2.25 long, their outer ends level with the head's top and bottom edges. Ink 18×18 · 14×14 · 12×12, box-centred, so the heavy head sits top right and the open space bottom left. Off-grid values are the slant's tangent points (2 dp at 24 and 20, 3 at 16; lint lists them as a documented exception). Filled: the gun solid to the outline's outer edge, the rays stay lines at 1.5 · 1.5 · 1.25. Who: Material barcode_reader, Font Awesome scanner-gun. Say 'checkout scanner', not 'scan'; without the rays it is a hair dryer, so the rays carry the meaning and at 16 they are only 2.25 long.",
      "masters": {
        "16": [
          "M8.625 2.625L12.125 2.625A1.25 1.25 0 0 1 13.375 3.875L13.375 6.375A0.75 0.75 0 0 1 12.625 7.125L12.579 7.125A0.625 0.625 0 0 0 11.959 7.824L12.491 12.256A1 1 0 0 1 11.498 13.375L10.637 13.375A1 1 0 0 1 9.644 12.494L9.066 7.676A0.625 0.625 0 0 0 8.446 7.125L8.375 7.125A0.75 0.75 0 0 1 7.625 6.375L7.625 3.625A1 1 0 0 1 8.625 2.625Z",
          "M4.875 3.5L2.625 2.625",
          "M4.875 6.25L2.625 7.125"
        ],
        "20": [
          "M10.5 3.75L14.75 3.75A1.5 1.5 0 0 1 16.25 5.25L16.25 8.25A1 1 0 0 1 15.25 9.25L15.12 9.25A0.75 0.75 0 0 0 14.37 10.11L15.05 14.82A1.25 1.25 0 0 1 13.81 16.25L13.08 16.25A1.25 1.25 0 0 1 11.85 15.18L11.09 9.89A0.75 0.75 0 0 0 10.35 9.25L10.25 9.25A1 1 0 0 1 9.25 8.25L9.25 5A1.25 1.25 0 0 1 10.5 3.75Z",
          "M6.25 5L3.75 3.75",
          "M6.25 8L3.75 9.25"
        ],
        "24": [
          "M11.75 3.75L18.25 3.75A2 2 0 0 1 20.25 5.75L20.25 8.75A1.5 1.5 0 0 1 18.75 10.25L17.91 10.25A1 1 0 0 0 16.92 11.4L17.99 18.53A1.5 1.5 0 0 1 16.51 20.25L15.54 20.25A1.5 1.5 0 0 1 14.06 18.97L12.88 11.1A1 1 0 0 0 11.89 10.25L11.75 10.25A1.5 1.5 0 0 1 10.25 8.75L10.25 5.25A1.5 1.5 0 0 1 11.75 3.75Z",
          "M7.25 5.5L3.75 3.75",
          "M7.25 8.5L3.75 10.25"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M8.625 2L12.125 2A1.875 1.875 0 0 1 14 3.875L14 6.375A1.375 1.375 0 0 1 12.625 7.75L12.579 7.75L13.111 12.181A1.625 1.625 0 0 1 11.498 14L10.637 14A1.625 1.625 0 0 1 9.024 12.569L8.446 7.75L8.375 7.75A1.375 1.375 0 0 1 7 6.375L7 3.625A1.625 1.625 0 0 1 8.625 2Z"
          ],
          "stroke": [
            "M4.875 3.5L2.625 2.625",
            "M4.875 6.25L2.625 7.125"
          ]
        },
        "20": {
          "fill": [
            "M10.5 3L14.75 3A2.25 2.25 0 0 1 17 5.25L17 8.25A1.75 1.75 0 0 1 15.25 10L15.12 10L15.79 14.72A2 2 0 0 1 13.81 17L13.08 17A2 2 0 0 1 11.1 15.28L10.35 10L10.25 10A1.75 1.75 0 0 1 8.5 8.25L8.5 5A2 2 0 0 1 10.5 3Z"
          ],
          "stroke": [
            "M6.25 5L3.75 3.75",
            "M6.25 8L3.75 9.25"
          ]
        },
        "24": {
          "fill": [
            "M11.75 3L18.25 3A2.75 2.75 0 0 1 21 5.75L21 8.75A2.25 2.25 0 0 1 18.75 11L17.91 11A0.25 0.25 0 0 0 17.66 11.29L18.73 18.42A2.25 2.25 0 0 1 16.51 21L15.54 21A2.25 2.25 0 0 1 13.32 19.08L12.14 11.21A0.25 0.25 0 0 0 11.89 11L11.75 11A2.25 2.25 0 0 1 9.5 8.75L9.5 5.25A2.25 2.25 0 0 1 11.75 3Z"
          ],
          "stroke": [
            "M7.25 5.5L3.75 3.75",
            "M7.25 8.5L3.75 10.25"
          ]
        }
      }
    },
    {
      "id": "E",
      "label": "Focus ring in frame",
      "tags": [
        "focus",
        "viewfinder",
        "target",
        "brackets",
        "ring"
      ],
      "note": "Rhythm: maximize's corners verbatim, with a ring on the box centre ⌀8 · 6 · 5 of ink (44 · 43 · 42% of the spread, one share at every master), hole 5 · 3 · 2.5; air from the ring to each corner's nearest tip 4.31 · 3.18 · 2.86, the same on all four sides. Ink 18×18 · 14×14 · 12×12. Filled: the ring becomes a solid disc ⌀8 · 6 · 5 (outer edge = the outline's), the corners stay lines at 1.5 · 1.5 · 1.25 — a shape icon, as maximize-5-filled. Who: Heroicons viewfinder-circle, Material center_focus_weak (center_focus_strong is the filled disc). Clash: it is maximize-5 with the square pane swapped for a ring (pane 7 · 5 · 5 against ring 8 · 6 · 5), so at 16 the two differ only by the pane's corners; it also reads as 'focus' or 'capture' as much as 'scan'.",
      "masters": {
        "16": [
          "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
          "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
          "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
          "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625",
          "M6.125 8A1.875 1.875 0 1 0 9.875 8A1.875 1.875 0 1 0 6.125 8Z"
        ],
        "20": [
          "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
          "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
          "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
          "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13",
          "M7.75 10A2.25 2.25 0 1 0 12.25 10A2.25 2.25 0 1 0 7.75 10Z"
        ],
        "24": [
          "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
          "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
          "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
          "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75",
          "M8.75 12A3.25 3.25 0 1 0 15.25 12A3.25 3.25 0 1 0 8.75 12Z"
        ]
      },
      "filled": {
        "16": {
          "fill": [
            "M5.5 8A2.5 2.5 0 1 0 10.5 8A2.5 2.5 0 1 0 5.5 8Z"
          ],
          "stroke": [
            "M5.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 5.375",
            "M10.625 2.625L11.875 2.625A1.5 1.5 0 0 1 13.375 4.125L13.375 5.375",
            "M5.375 13.375L4.125 13.375A1.5 1.5 0 0 1 2.625 11.875L2.625 10.625",
            "M10.625 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 10.625"
          ]
        },
        "20": {
          "fill": [
            "M7 10A3 3 0 1 0 13 10A3 3 0 1 0 7 10Z"
          ],
          "stroke": [
            "M7 3.75L5.75 3.75A2 2 0 0 0 3.75 5.75L3.75 7",
            "M13 3.75L14.25 3.75A2 2 0 0 1 16.25 5.75L16.25 7",
            "M7 16.25L5.75 16.25A2 2 0 0 1 3.75 14.25L3.75 13",
            "M13 16.25L14.25 16.25A2 2 0 0 0 16.25 14.25L16.25 13"
          ]
        },
        "24": {
          "fill": [
            "M8 12A4 4 0 1 0 16 12A4 4 0 1 0 8 12Z"
          ],
          "stroke": [
            "M8.25 3.75L6.25 3.75A2.5 2.5 0 0 0 3.75 6.25L3.75 8.25",
            "M15.75 3.75L17.75 3.75A2.5 2.5 0 0 1 20.25 6.25L20.25 8.25",
            "M8.25 20.25L6.25 20.25A2.5 2.5 0 0 1 3.75 17.75L3.75 15.75",
            "M15.75 20.25L17.75 20.25A2.5 2.5 0 0 0 20.25 17.75L20.25 15.75"
          ]
        }
      }
    }
  ]
};
