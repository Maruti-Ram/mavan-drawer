// plus — queue #1. Sets the length of every straight mark in the library
// (minus, x, the modifier glyph), so the choice here propagates.
// Arm length as a share of the canvas, per master. Round caps are included:
// the path stops half a stroke short of the stated extent.
//
// Filled follows the locked line-heavy rule (tools/masters.mjs FILLED_WEIGHT):
// 2.5 at 24, 2 at 20 and 16, no background. The ink box matches the outline's,
// so each end pulls in by half the added weight.
export default {
  concept: 'plus',
  question: 'How long are the arms? Pick one per master — smaller masters usually fill more. Toggle Filled (F) in context.',
  candidates: [
    {
      id: 'A', label: 'Long', note: '75% at 24 · 70% at 20 · 75% at 16 — fills each mark keyline (Central large)',
      masters: {
        24: ['M12 3.75v16.5', 'M3.75 12h16.5'],
        20: ['M10 3.75v12.5', 'M3.75 10h12.5'],
        16: ['M8 2.75v10.5', 'M2.75 8h10.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M12 4.25v15.5', 'M4.25 12h15.5'] },  // ends pulled in .5: same ink box at 2.5
        20: { weight: 2, stroke: ['M10 4v12', 'M4 10h12'] },              // ends pulled in .25: same ink box at 2
        16: { weight: 2, stroke: ['M8 3v10', 'M3 8h10'] },
      },
    },
    {
      id: 'B', label: 'Medium', note: '62.5% at 24 · 67.5% at 20 · 75% at 16 — fills more as it shrinks (recommended)',
      masters: {
        24: ['M12 5.25v13.5', 'M5.25 12h13.5'],
        20: ['M10 4v12', 'M4 10h12'],
        16: ['M8 2.75v10.5', 'M2.75 8h10.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M12 5.75v12.5', 'M5.75 12h12.5'] },
        20: { weight: 2, stroke: ['M10 4.25v11.5', 'M4.25 10h11.5'] },
        16: { weight: 2, stroke: ['M8 3v10', 'M3 8h10'] },
      },
    },
    {
      id: 'C', label: 'Compact', note: '50% at 24 · 55% at 20 · 62.5% at 16 (Polaris-like)',
      masters: {
        24: ['M12 6.75v10.5', 'M6.75 12h10.5'],
        20: ['M10 5.25v9.5', 'M5.25 10h9.5'],
        16: ['M8 3.75v8.5', 'M3.75 8h8.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M12 7.25v9.5', 'M7.25 12h9.5'] },
        20: { weight: 2, stroke: ['M10 5.5v9', 'M5.5 10h9'] },
        16: { weight: 2, stroke: ['M8 4v8', 'M4 8h8'] },
      },
    },
  ],
};
