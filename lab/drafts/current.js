// minus — queue #2. Ships in the three C8 sizes, like plus: minus-large,
// minus, minus-small. The default draws each size at its plus arm length, so
// plus and minus swap without the width jumping (steppers, zoom, expand).
// The open question: a lone bar can read shorter than a plus arm. M+ tests
// "optically longer" on the default size: 16 · 14 · 12 (plus is 15 · 13.5 · 12).
// Sizes follow the C8 step rule (3 · 2.5 · 2); if M+ wins, large and small move with it.
//
// Filled follows the line-heavy rule: 2.5 at 24, 2 at 20 and 16, ends pulled
// in by half the added weight so the ink box matches the outline.
export default {
  concept: 'minus',
  keyline: 'mark',        // written into every approved file: marks sit under the mark ceiling, not a keyline
  question: 'Same length as the plus arm, or optically longer? Compare M against M+ in context next to plus.',
  candidates: [
    {
      id: 'L', label: 'Large', note: 'minus-large · matches plus-large: 18 · 16 · 14 (C8 step rule)',
      masters: {
        24: ['M3.75 12h16.5'],
        20: ['M2.75 10h14.5'],
        16: ['M1.75 8h12.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M4.25 12h15.5'] },
        20: { weight: 2, stroke: ['M3 10h14'] },
        16: { weight: 2, stroke: ['M2 8h12'] },
      },
    },
    {
      id: 'M', label: 'Medium', note: 'minus · matches plus: 15 · 13.5 · 12 (recommended)',
      masters: {
        24: ['M5.25 12h13.5'],
        20: ['M4 10h12'],
        16: ['M2.75 8h10.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M5.75 12h12.5'] },
        20: { weight: 2, stroke: ['M4.25 10h11.5'] },
        16: { weight: 2, stroke: ['M3 8h10'] },
      },
    },
    {
      id: 'M+', label: 'Medium, optically longer', note: 'minus alternative: 16 · 14 · 12 — one unit past plus at 24, half at 20',
      masters: {
        24: ['M4.75 12h14.5'],
        20: ['M3.75 10h12.5'],
        16: ['M2.75 8h10.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M5.25 12h13.5'] },
        20: { weight: 2, stroke: ['M4 10h12'] },
        16: { weight: 2, stroke: ['M3 8h10'] },
      },
    },
    {
      id: 'S', label: 'Small', note: 'minus-small · matches plus-small: 12 · 11 · 10',
      masters: {
        24: ['M6.75 12h10.5'],
        20: ['M5.25 10h9.5'],
        16: ['M3.75 8h8.5'],
      },
      filled: {
        24: { weight: 2.5, stroke: ['M7.25 12h9.5'] },
        20: { weight: 2, stroke: ['M5.5 10h9'] },
        16: { weight: 2, stroke: ['M4 8h8'] },
      },
    },
  ],
};
