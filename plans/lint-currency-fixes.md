# Lint fixes found in the Commerce & currency rounds — 2026-10-21

## What changes for Maruti
Nothing he sees in a drawing. The checker stops warning about exceptions he already ruled on, starts measuring two spots it was blind to, stops one false alarm, and the optical-placement sheet stops bending the 16 master. Any real problem the new measurements find on a shipped icon is brought to him — nothing shipped is redrawn silently.

## Cards

- [x] **1. Knockout material floor follows the 2026-10-21 ruling.** The knockout check ("a knockout may not be cut wider than the counter it sits in", `tools/lint.mjs`) still asks 1.5 of disc between two parts of one cut-out; Maruti's ruling (CLAUDE.md Settled → Stroke row, `plans/lint-air-gaps.md`) floors material between cut-outs at the master's line weight, 1.5 · 1.5 · 1.25. Make that check use the same floor as `holeGap`. Expected: `ruble-circle`'s 1.25 at 16 stops warning; `peso-circle` (1.41 · 1.44 · 1.20) still warns at 24 and 20 and at 16 (1.20 < 1.25) — list it.
- [x] **2. Bar crossing a bowl.** Measure the air between a straight bar and a curved stroke it crosses (₱ `peso`, `peso-circle`; ₺ `lira`, `lira-circle`; ₹ `rupee`): the white wedge on each side of the crossing, at the bar's own weight, against 1.5 or the file's `gap` note. Today agents measured by hand (peso outline 1.25 at 20, 1.375 at 16).
- [x] **3. A bar meeting a fork (¥).** The white between `yen`'s top bar and its arms closes in the filled 16 (0.42 · 0.38 · 0.06); no test sees a bar that meets a joint rather than crossing an arm. Measure it.
- [x] **4. Curve read as crossing arms (false alarm).** `armTipGap` reads a stem that curves *after* a bar crosses it straight (the £ "swept stem", `lab` draft pound B) as an acute arm, and reports tip air that isn't there. Measure the arm direction at the crossing, not after the curve.
- [x] **5. Optical sheet keeps 3 decimals and per-icon notes.** `tools/optical-sheet.mjs` `move()` rounds to 2 dp (bends the 16 master's eighth-grid coordinates) and the `--draft` board drops `gap`/`box`/`glyph` notes. Round to 3 dp, snap shifts to each master's grid, carry the notes.
- [x] **6. A filled shape that paints nothing.** A `fill` path lying wholly on another filled shape (coins round 1: a $ drawn on top of a disc instead of cut out) passed lint. Error when removing a fill path changes nothing; an island inside a hole is fine.

Files owned: `tools/lint.mjs`, `tools/geometry.mjs`, `tools/geometry.test.mjs`, `tools/optical-sheet.mjs`. Model: a strong builder (Opus) for 1–6; a fresh reviewer (Opus) for 7.

- [x] **7. Review.** A fresh agent checks each card against this plan; `node --test tools/geometry.test.mjs` passes; `npm run check` before/after on every shipped file, every changed result listed (expected: fewer warnings from 1, any new findings from 2, 3, 6 listed by icon).

## How it's proven
Tests for each card (a passing and a failing minimal case). The before/after lint diff across all shipped icons. Work on a branch in a worktree; merged to main only after Maruti has seen the summary.

## Status
- [x] Built (worktree)  - [x] Reviewed  - [x] Maruti has seen the summary  - [x] Merged (d8bcdb2, 2026-10-21)
