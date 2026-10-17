// arrow-down-left — rigid moves of a shipped drawing; every length, radius, angle and gap kept.
export default {
  concept: 'arrow-down-left',
  keyline: 'mark',
  family: ["arrow-up-right","arrow-up","arrow-right"],
  set: {"DL":"arrow-down-left","DR":"arrow-down-right","UL":"arrow-up-left"},
  question: "The three other diagonals of arrow-up-right: DL turned 180°, DR flipped top–bottom, UL mirrored left–right. Nothing to choose; approve DL, DR and UL.",
  candidates: [
    {
      "id": "DL",
      "label": "arrow-down-left",
      "tags": [
        "classic",
        "diagonal",
        "south west"
      ],
      "note": "arrow-up-right turned 180° about the canvas centre",
      "masters": {
        "16": [
          "M8.375 12.375L4.25 12.375A0.625 0.625 0 0 1 3.625 11.75L3.625 7.625",
          "M3.808 12.192L12.375 3.625"
        ],
        "20": [
          "M10.25 15L5.75 15A0.75 0.75 0 0 1 5 14.25L5 9.75",
          "M5.22 14.78L15 5"
        ],
        "24": [
          "M12.25 17.75L7 17.75A0.75 0.75 0 0 1 6.25 17L6.25 11.75",
          "M6.47 17.53L17.75 6.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M8 12L5 12A1 1 0 0 1 4 11L4 8",
            "M4.293 11.707L12 4"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M10 14.75L6.25 14.75A1 1 0 0 1 5.25 13.75L5.25 10",
            "M5.54 14.46L14.75 5.25"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M11.75 17.25L8 17.25A1.25 1.25 0 0 1 6.75 16L6.75 12.25",
            "M7.12 16.88L17.25 6.75"
          ]
        }
      }
    },
    {
      "id": "DR",
      "label": "arrow-down-right",
      "tags": [
        "classic",
        "diagonal",
        "south east"
      ],
      "note": "arrow-up-right flipped top–bottom",
      "masters": {
        "16": [
          "M7.625 12.375L11.75 12.375A0.625 0.625 0 0 0 12.375 11.75L12.375 7.625",
          "M12.192 12.192L3.625 3.625"
        ],
        "20": [
          "M9.75 15L14.25 15A0.75 0.75 0 0 0 15 14.25L15 9.75",
          "M14.78 14.78L5 5"
        ],
        "24": [
          "M11.75 17.75L17 17.75A0.75 0.75 0 0 0 17.75 17L17.75 11.75",
          "M17.53 17.53L6.25 6.25"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M8 12L11 12A1 1 0 0 0 12 11L12 8",
            "M11.707 11.707L4 4"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M10 14.75L13.75 14.75A1 1 0 0 0 14.75 13.75L14.75 10",
            "M14.46 14.46L5.25 5.25"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M12.25 17.25L16 17.25A1.25 1.25 0 0 0 17.25 16L17.25 12.25",
            "M16.88 16.88L6.75 6.75"
          ]
        }
      }
    },
    {
      "id": "UL",
      "label": "arrow-up-left",
      "tags": [
        "classic",
        "diagonal",
        "north west"
      ],
      "note": "arrow-up-right mirrored left–right",
      "masters": {
        "16": [
          "M8.375 3.625L4.25 3.625A0.625 0.625 0 0 0 3.625 4.25L3.625 8.375",
          "M3.808 3.808L12.375 12.375"
        ],
        "20": [
          "M10.25 5L5.75 5A0.75 0.75 0 0 0 5 5.75L5 10.25",
          "M5.22 5.22L15 15"
        ],
        "24": [
          "M12.25 6.25L7 6.25A0.75 0.75 0 0 0 6.25 7L6.25 12.25",
          "M6.47 6.47L17.75 17.75"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M8 4L5 4A1 1 0 0 0 4 5L4 8",
            "M4.293 4.293L12 12"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M10 5.25L6.25 5.25A1 1 0 0 0 5.25 6.25L5.25 10",
            "M5.54 5.54L14.75 14.75"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M11.75 6.75L8 6.75A1.25 1.25 0 0 0 6.75 8L6.75 11.75",
            "M7.12 7.12L17.25 17.25"
          ]
        }
      }
    },
  ],
};
