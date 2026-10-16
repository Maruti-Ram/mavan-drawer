// "Soft" — the proposed Mavan character. 24 canvas, stroke 2, round caps and
// joins, container radius 3 (1.5 × stroke), circular arcs only.
// SPECIMENS for choosing a voice, not library masters.
export const MAVAN = {
  calendar: ['M7 5h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z', 'M4 10h16', 'M8 3v3', 'M16 3v3'],
  user: ['M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0Z',
    'M7.5 21h9a2 2 0 0 0 1.9-2.6C17.6 16.4 15.2 15 12 15s-5.6 1.4-6.4 3.4A2 2 0 0 0 7.5 21Z'],
  trash: ['M4.5 6h15', 'M9.5 6a2.5 2.5 0 0 1 5 0',
    'M5.5 10l.8 8.3A3 3 0 0 0 9.3 21h5.4a3 3 0 0 0 3-2.7l.8-8.3', 'M10 13.5v4', 'M14 13.5v4'],
  folder: ['M3 8a3 3 0 0 1 3-3h3.2a2 2 0 0 1 1.6.8L12 7h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z'],
  bell: ['M5.5 10a6.5 6.5 0 0 1 13 0v3.6c0 .6.2 1.2.6 1.7l.6.8A1.2 1.2 0 0 1 18.7 18H5.3a1.2 1.2 0 0 1-1-1.9l.6-.8c.4-.5.6-1.1.6-1.7Z',
    'M10 18a2 2 0 0 0 4 0'],
  home: ['M4 11.4a2 2 0 0 1 .6-1.4l5.6-5.6a2.5 2.5 0 0 1 3.6 0l5.6 5.6a2 2 0 0 1 .6 1.4V17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z'],
  lock: ['M8 11h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z', 'M8 11V7a4 4 0 0 1 8 0v4', 'M12 15v2'],
  file: ['M13 3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9Z', 'M13 3v3a3 3 0 0 0 3 3h3', 'M9 13h3', 'M9 17h6'],
  heart: ['M12 20c-.8 0-8.5-4.2-8.5-10.2C3.5 6.5 5.8 4.5 8.2 4.5c1.7 0 3 .8 3.8 2c.8-1.2 2.1-2 3.8-2c2.4 0 4.7 2 4.7 5.3C20.5 15.8 12.8 20 12 20Z'],
  settings: ['M10.5 3.9a3 3 0 0 1 3 0l4.8 2.8a3 3 0 0 1 1.5 2.6v5.4a3 3 0 0 1-1.5 2.6l-4.8 2.8a3 3 0 0 1-3 0l-4.8-2.8a3 3 0 0 1-1.5-2.6V9.3a3 3 0 0 1 1.5-2.6Z',
    'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z'],
  clock: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0Z', 'M12 7.5V12l3 2'],
  'check-circle': ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0Z', 'M8.5 12.5l2.5 2.5 4.5-5'],
  'chevron-right': ['M9.5 5.5 16 12l-6.5 6.5'],
  'credit-card': ['M6 5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z', 'M3 10h18', 'M7 15h3'],
};

// "Refined" — the second proposal. Lighter stroke (1.5), tighter radius
// (2–2.5 ≈ 1.5 × stroke), slimmer proportions, restrained detail. Stroke
// centrelines sit on .25/.75 so the outer edge lands on whole pixels at 24.
export const REFINED = {
  calendar: ['M6.25 4.75h11.5a2.5 2.5 0 0 1 2.5 2.5v10.5a2.5 2.5 0 0 1-2.5 2.5H6.25a2.5 2.5 0 0 1-2.5-2.5V7.25a2.5 2.5 0 0 1 2.5-2.5Z',
    'M3.75 9.25h16.5', 'M8.25 2.75v3.5', 'M15.75 2.75v3.5'],
  // Shoulders are a half-ellipse; the base bows gently downward (a torso seen
  // front-on) and turns into the sides through r1 corners, not points.
  user: ['M8.25 7a3.75 3.75 0 1 0 7.5 0a3.75 3.75 0 1 0-7.5 0Z',
    'M4.75 18.75a7.25 5 0 0 1 14.5 0v.1a1 1 0 0 1-.62.93C16.5 20.6 14.3 21 12 21s-4.5-.4-6.63-1.22a1 1 0 0 1-.62-.93Z'],
  // Chosen: wide like Central (lid 3.75→20.25, body hangs from it, 4° taper),
  // flat tab handle, short 4-unit ribs.
  trash: ['M3.75 6.25h16.5', 'M9.25 6.25v-1a1.5 1.5 0 0 1 1.5-1.5h2.5a1.5 1.5 0 0 1 1.5 1.5v1',
    'M5.25 6.25l.9 12.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.8l.9-12.2', 'M10 11v4', 'M14 11v4'],
  // Container r2.5, tab bends r1.5; the 45° tab edge is tangent to both bends.
  folder: ['M2.75 16.75v-9.5a2.5 2.5 0 0 1 2.5-2.5h3.5a1.5 1.5 0 0 1 1.06.44l1.87 1.87a1.5 1.5 0 0 0 1.06.44h6.01a2.5 2.5 0 0 1 2.5 2.5v6.75a2.5 2.5 0 0 1-2.5 2.5H5.25a2.5 2.5 0 0 1-2.5-2.5Z',
    'M2.75 10.75h18.5'],
  bell: ['M6.25 9.75a5.75 5.75 0 0 1 11.5 0v3.44c0 .67.2 1.32.58 1.87l1.1 1.6a.75.75 0 0 1-.63 1.09H5.2a.75.75 0 0 1-.63-1.09l1.1-1.6c.38-.55.58-1.2.58-1.87Z',
    'M9.75 17.75a2.25 2.25 0 0 0 4.5 0'],
  home: ['M3.75 10.1a1.5 1.5 0 0 1 .52-1.13l6.75-5.85a1.5 1.5 0 0 1 1.96 0l6.75 5.85a1.5 1.5 0 0 1 .52 1.13v8.15a2 2 0 0 1-2 2h-3.5v-5a1 1 0 0 0-1-1h-3.5a1 1 0 0 0-1 1v5h-3.5a2 2 0 0 1-2-2Z'],
  lock: ['M7.25 10.75h9.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-9.5a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2Z',
    'M8.25 10.75v-3a3.75 3.75 0 0 1 7.5 0v3', 'M12 15v2.25'],
  file: ['M13.25 2.75h-6a2 2 0 0 0-2 2v14.5a2 2 0 0 0 2 2h9.5a2 2 0 0 0 2-2V8.25Z',
    'M13.25 2.75v3.5a2 2 0 0 0 2 2h3.5', 'M8.75 12.75h4', 'M8.75 16.25h6.5'],
  heart: ['M12 20.1c-.3 0-.6-.1-.85-.28C8.3 17.9 3.25 14.15 3.25 9.4c0-2.7 2.05-4.65 4.55-4.65 1.75 0 3.2.95 4.2 2.35 1-1.4 2.45-2.35 4.2-2.35 2.5 0 4.55 1.95 4.55 4.65 0 4.75-5.05 8.5-7.9 10.42-.25.18-.55.28-.85.28Z'],
  settings: ['M10.87 3.65Q12 3 13.13 3.65L18.66 6.85Q19.79 7.5 19.79 8.8V15.2Q19.79 16.5 18.66 17.15L13.13 20.35Q12 21 10.87 20.35L5.34 17.15Q4.21 16.5 4.21 15.2V8.8Q4.21 7.5 5.34 6.85Z',
    'M9.25 12a2.75 2.75 0 1 0 5.5 0a2.75 2.75 0 1 0-5.5 0Z'],
  clock: ['M2.75 12a9.25 9.25 0 1 0 18.5 0a9.25 9.25 0 1 0-18.5 0Z', 'M12 7.25V12l2.75 2.75'],
  'check-circle': ['M2.75 12a9.25 9.25 0 1 0 18.5 0a9.25 9.25 0 1 0-18.5 0Z', 'M8.5 12.25l2.25 2.25 4.75-5'],
  'chevron-right': ['M9.5 5.75 15.75 12 9.5 18.25'],
  'credit-card': ['M5.25 4.75h13.5a2.5 2.5 0 0 1 2.5 2.5v9.5a2.5 2.5 0 0 1-2.5 2.5H5.25a2.5 2.5 0 0 1-2.5-2.5v-9.5a2.5 2.5 0 0 1 2.5-2.5Z',
    'M2.75 9.25h18.5', 'M6.75 15.25h3'],
};

// What each reference set actually does, measured from its files.
// Values normalised to a 24 canvas so they compare directly.
export const MEASURED = [
  { k: 'Canvas · stroke', polaris: '20 · 1.5 (fills)', nucleo: '18 · 1.5', central: '24 · 1 / 1.5 / 2', mavan: '24 · 2 (Soft) · 1.5 (Refined)' },
  { k: 'Stroke as % of canvas', polaris: '7.5%', nucleo: '8.3%', central: '6.3% at 1.5 · 8.3% at 2', mavan: '8.3% · 6.3%' },
  { k: 'Container radius (at 24)', polaris: '≈3.6 · very soft, smoothed', nucleo: '≈2.7', central: '0 / 1 / 2 / 3 (user choice)', mavan: '3 · 2–2.5' },
  { k: 'Radius ÷ stroke', polaris: '≈2.0', nucleo: '≈1.3', central: '1.0 medium · 1.5 large', mavan: '1.5 · ≈1.5' },
  { k: 'Terminals', polaris: 'round', nucleo: 'round', central: 'round (square join optional)', mavan: 'round' },
  { k: 'Corner geometry', polaris: 'continuous (squircle)', nucleo: 'circular arcs', central: 'continuous on big shapes', mavan: 'circular arcs' },
  { k: 'Silhouettes', polaris: 'closed, compact (~65%)', nucleo: 'closed, generous (~85%)', central: 'closed, full keyline', mavan: 'closed, on keylines' },
  { k: 'Tapers / draft angles', polaris: 'some', nucleo: 'yes — trash, bags', central: 'yes — trash, bell, bags', mavan: 'yes (proposed exception)' },
  { k: 'Detail hierarchy', polaris: 'one layer', nucleo: 'two layers (color-2)', central: 'one layer', mavan: 'two layers, tagged' },
];

// Trash explorer — one wide body, different interiors and handles.
const LID = 'M3.75 6.25h16.5';
const BODY = 'M5.25 6.25l.9 12.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.8l.9-12.2';
const DOME = 'M8.75 6.25a3.25 3.25 0 0 1 6.5 0';
const TAB = 'M9.25 6.25v-1a1.5 1.5 0 0 1 1.5-1.5h2.5a1.5 1.5 0 0 1 1.5 1.5v1';
export const TRASH = [
  { name: 'trash ✓', note: 'ribs · tab handle', paths: [LID, TAB, BODY, 'M10 11v4', 'M14 11v4'] },
  { name: 'rim band (C4, withdrawn)', note: 'rim band · tab handle', paths: [LID, TAB, BODY, 'M5.55 10.25h12.9'] },
  { name: 'slot (C4, withdrawn)', note: 'slot · tab handle', paths: [LID, TAB, BODY, 'M10.25 13.25h3.5'] },
  { name: 'two dots (C4, withdrawn)', note: 'two dots · tab handle', paths: [LID, TAB, BODY, 'M10 13h.01', 'M14 13h.01'] },
  // explored, not chosen
  { name: 'Two short ribs', note: 'ribs 4 long, lower-middle', paths: [LID, DOME, BODY, 'M10 11v4', 'M14 11v4'] },
  { name: 'One rib', note: 'single centred rib', paths: [LID, DOME, BODY, 'M12 11v4'] },
  { name: 'Rim band', note: 'horizontal band under the lid', paths: [LID, DOME, BODY, 'M5.55 10.25h12.9'] },
  { name: 'Slot', note: 'short horizontal mark, like a label', paths: [LID, DOME, BODY, 'M10.25 13.25h3.5'] },
  { name: 'Two dots', note: 'rivets instead of ribs', paths: [LID, DOME, BODY, 'M10 13h.01', 'M14 13h.01'] },
  { name: 'Plain', note: 'no interior — silhouette only', paths: [LID, DOME, BODY] },
  { name: 'Plain, tab handle', note: 'flat-topped handle', paths: [LID, TAB, BODY] },
];
