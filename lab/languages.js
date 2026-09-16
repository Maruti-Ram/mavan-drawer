// Four candidate visual languages. Same three subjects in each.
// These are SPECIMENS, not library masters — drafts to choose a voice from.
export const LANGUAGES = [
  {
    id: 'geometric', name: 'Geometric',
    blurb: 'Compass-and-ruler. Pure circles, 45° only, round terminals, moderate radii. Neutral and legible — the safe centre of the market.',
    refs: 'Lucide · Feather · Fluent regular',
    sw: 2, cap: 'round', join: 'round', radius: 2, keyline: 18,
    icons: {
      trash: ['M4 7h16', 'M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2',
              'M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7', 'M10 11v5', 'M14 11v5'],
      calendar: ['M6 7h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z',
                 'M4 11h16', 'M8 4v3', 'M16 4v3'],
      user: ['M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z',
             'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
    },
  },
  {
    id: 'sharp', name: 'Sharp',
    blurb: 'Butt terminals, mitred joins, zero corner radius. Reads as precise, technical, engineered. Unforgiving — every misalignment shows.',
    refs: 'Material Sharp · Nucleo Sharp',
    sw: 2, cap: 'butt', join: 'miter', radius: 0, keyline: 18,
    icons: {
      trash: ['M3 7h18', 'M10 7V4h4v3', 'M6 7v13h12V7', 'M10 11v5', 'M14 11v5'],
      calendar: ['M4 7h16v13H4Z', 'M4 11h16', 'M8 3v4', 'M16 3v4'],
      user: ['M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z', 'M5 21v-3l2-2h10l2 2v3'],
    },
  },
  {
    id: 'soft', name: 'Soft',
    blurb: 'Same footprint as Geometric, but every corner opens up to a 4-unit radius. Approachable and calm. Containers start to read as capsules rather than boxes.',
    refs: 'Phosphor · Material Rounded',
    sw: 2, cap: 'round', join: 'round', radius: 4, keyline: 18,
    icons: {
      trash: ['M4 7h16', 'M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1',
              'M6 7v10a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7', 'M10 11v5', 'M14 11v5'],
      calendar: ['M8 7h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4Z',
                 'M4 11h16', 'M8 4v3', 'M16 4v3'],
      user: ['M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z',
             'M19 21v-1a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5v1'],
    },
  },
  {
    id: 'dense', name: 'Dense',
    blurb: 'Heavier stroke, larger in canvas, fewer marks. Built to survive at 16px in a data-heavy UI. Loses nuance at 48px.',
    refs: 'Geist · Polaris · Nucleo Micro Bold',
    sw: 2.5, cap: 'round', join: 'round', radius: 2, keyline: 19,
    icons: {
      trash: ['M4 7h16', 'M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2',
              'M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7', 'M10 11v4', 'M14 11v4'],
      calendar: ['M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z',
                 'M4 12h16', 'M8 5v3', 'M16 5v3'],
      user: ['M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z',
             'M5 20v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1'],
    },
  },
];
export const SUBJECTS = ['trash', 'calendar', 'user'];
