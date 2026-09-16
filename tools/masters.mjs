// The three drawn masters. One source of truth for lint, build and the lab.
// All sizes are OUTER ink dimensions — they include the stroke. See
// docs/01-foundations.md §2 and §4.
export const STROKE = 1.5;

// Filled style of a LINE-HEAVY icon (plus, check, arrows: nothing encloses an
// area) shows weight by a heavier stroke, never a background. Locked 2026-09-17.
// Heavier at 24, where 1.5 is lightest (6.3%), so every master lands near
// 10–12.5% of its canvas. Steps of +0.5 keep pulled-in ends on the quarter grid.
// Every other icon fills its shapes and keeps STROKE for any leftover line.
export const FILLED_WEIGHT = { 24: 2.5, 20: 2, 16: 2 };
export const isFilled = (file) => /-filled(\.svg)?$/.test(file);
export const weightOf = (file, master) => (isFilled(file) ? FILLED_WEIGHT[master] : STROKE);

export const MASTERS = {
  24: {
    bound: [2, 22],                       // margin edge — nothing but modifier badges crosses it
    keylines: { square: [18, 18], circle: [20, 20], portrait: [16, 20], landscape: [20, 16], diagonal: [20, 20] },
    mark: 18,                             // ceiling for directional marks
  },
  20: {
    bound: [2, 18],
    keylines: { square: [14, 14], circle: [16, 16], portrait: [12, 16], landscape: [16, 12], diagonal: [16, 16] },
    mark: 14,
  },
  16: {
    bound: [1, 15],
    keylines: { square: [12, 12], circle: [14, 14], portrait: [10, 14], landscape: [14, 10], diagonal: [14, 14] },
    mark: 12,
  },
};

// Size variants (C8): `<name>-large` and `<name>-small` beside the default.
// Each size is 12.5% of the canvas longer than the next one down, at every
// master, so the family reads as three sizes at 24, 20 and 16 alike. A -large
// mark may run to the margin edge; every other mark stays under `mark`.
export const SIZE_STEP = { 24: 3, 20: 2.5, 16: 2 };
export const SIZES = ['small', null, 'large'];
export const sizeOf = (name) => name.match(/-(large|small)(?=-filled$|$)/)?.[1] ?? null;
export const sizeBase = (name) => name.replace(/-(large|small)(?=-filled$|$)/, '');
export const markMax = (name, master) =>
  sizeOf(name) === 'large' ? MASTERS[master].bound[1] - MASTERS[master].bound[0] : MASTERS[master].mark;

// Minimum gap between any two stroke edges: one outline stroke width, at every
// master and in both styles.
export const MIN_GAP = STROKE;
