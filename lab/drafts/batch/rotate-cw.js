// rotate-cw — rigid moves of a shipped drawing; every length, radius, angle and gap kept.
export default {
  concept: 'rotate-cw',
  keyline: 'mark',
  family: ["rotate-ccw","refresh","redo"],
  set: {"CW":"rotate-cw"},
  question: "rotate-ccw mirrored left–right: the same ring, run and head, the gap on the right, the head at 1:30 pointing down-right. Nothing to choose; approve CW.",
  candidates: [
    {
      "id": "CW",
      "label": "rotate-cw",
      "tags": [
        "rotate right",
        "clockwise",
        "one head",
        "big ring"
      ],
      "note": "rotate-ccw mirrored about the vertical axis (its ring sits 0.06 off centre; mirrored it sits 0.06 the other way)",
      "masters": {
        "16": [
          "M12.314 9.646A4.773 4.773 0 1 1 11.125 4.875L12.942 6.692",
          "M13.125 2.875L13.125 6.25A0.625 0.625 0 0 1 12.5 6.875L9.125 6.875"
        ],
        "20": [
          "M15.49 11.28A5.83 5.83 0 1 1 13.88 6.13L15.78 8.03",
          "M16 4L16 7.5A0.75 0.75 0 0 1 15.25 8.25L11.75 8.25"
        ],
        "24": [
          "M20.13 12A8.13 8.13 0 1 1 17.75 6.25L20.03 8.53",
          "M20.25 3.75L20.25 8A0.75 0.75 0 0 1 19.5 8.75L15.25 8.75"
        ]
      },
      "filled": {
        "16": {
          "weight": 2,
          "stroke": [
            "M11.49 10.564A4.398 4.398 0 1 1 10.86 5.14L12.457 6.737",
            "M12.75 3.25L12.75 6.03A1 1 0 0 1 11.75 7.03L8.97 7.03"
          ]
        },
        "20": {
          "weight": 2,
          "stroke": [
            "M15.09 11.88A5.58 5.58 0 1 1 13.7 6.3L15.46 8.06",
            "M15.75 4.25L15.75 7.35A1 1 0 0 1 14.75 8.35L11.65 8.35"
          ]
        },
        "24": {
          "weight": 2.5,
          "stroke": [
            "M19.58 12.9A7.63 7.63 0 1 1 17.4 6.6L19.38 8.59",
            "M19.75 4.25L19.75 7.71A1.25 1.25 0 0 1 18.5 8.96L15.04 8.96"
          ]
        }
      }
    },
  ],
};
