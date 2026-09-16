# Mavan Drawer

An icon library built to be sold. The geometry is a system, the system is
enforced by a script, and the parts that are usually left to each consumer's
judgement — spacing, optical alignment — ship as data.

```bash
npm run check    # rebuild metrics, then lint every icon
npm run lab      # http://localhost:4174/lab/
```

---

## Decided

| | | Why |
|---|---|---|
| **Source of truth** | hand-authored SVG | Figma exports lose the stroke, add float noise, and can't be code-reviewed |
| **Authoring** | strokes | typable, lintable, 10× smaller, editable |
| **Distribution** | **outlined fills only** | renders identically everywhere; nothing a consumer can break |
| **Styles** | outline + filled | duotone deferred |
| **Weight axis** | none | opinionated defaults; stroke stays private |
| **Canvas** | 24 | market convention |
| **Masters** | 24 + 16 *(proposed)* | 20 sits in a dead zone — see below |
| **Modifiers** | 8, bottom-right, fixed zone | `05-modifiers.md` |
| **v1 scope** | 9 categories, 122 bases | `04-scope.md` |

### The geometry

```
canvas     24
keylines   circle ⌀20 · square 18 · portrait 16×20 · landscape 20×16 · mark ≤18
           the largest of these IS the outer drawing bound
stroke     2 at the 24 master (8.3%), 1.5 at 16 (9.4%)
grid       integers; 2 decimal places max; angles 0° / 45° / 90°
radius     container = one stroke-width; detail = half
min gap    one stroke-width between any two stroke edges
```

Two rules do most of the work:

- **Round caps extend half a stroke past the endpoint.** To span the 18 keyline
  (3→21) the path runs 4→20. Off-by-one here is the commonest defect in icon sets.
- **Min gap = one stroke.** This is what keeps the set legible at 16 and what
  makes a heavier filled style possible without shapes welding shut.

**There is no "live area".** The circle keyline *is* the outer bound. The 2 units
left over are margin shipped inside the asset, not a drawing rule.

### Optical metrics — the differentiator

`npm run build` emits `dist/metrics.json`: per-icon ink box, **geometric
bearings**, and **optical bearings**.

Without them, `padding: 12px; gap: 8px` renders as 13.7–16.2px and 9.7–12.2px
depending on which icon you used. With them, a consumer's `<Icon>` subtracts the
bearing once and every spacing value in their product becomes literally true.

Two corrections, and they are different:

- **Geometric** — the ink bbox is not at the box edge. `plus` has 3 units of
  bearing, `chevron` has 5.
- **Optical** — even with ink flush, a round shape needs tighter spacing than a
  flat one, because a circle touches its box at one tangent point and recedes
  everywhere else. Computed from the outline in `tools/optical.mjs`.

The optical pass is measured, not guessed: it gives `arrow-right` an asymmetric
result (blunt shaft end, pointed head) and `plus` almost none (flat arm tips).

---

## Open

1. **Visual language.** Four candidates in `lab/language.html`, plus a rig that
   isolates each lever. **This blocks everything downstream.**
2. **Master size.** 24 vs 16 as primary — genuinely downstream of (1), because a
   16 canvas cannot hold a detailed drawing.
3. **Keep the 20 master?** 16 and 20 have the *same* detail budget (5 parallel
   marks), so a 20 master is largely the 16 master drawn again. Recommend
   dropping it; it is purely additive later.
4. **Optical `alpha`** — currently 0.75, tuned by eye.
5. **Relax the `<path>`-only rule?** `<rect x y w h rx>` is far more editable
   than its 97-character path equivalent. Nucleo uses basic shapes throughout.
6. **Primitive-drift linter** — flag shapes that are *nearly* a shared primitive
   (a circle at r8.5 where every other is r9). The highest-leverage tool for
   family consistency, not yet built.

---

## Pipeline

```
  SKETCH ──► AUTHOR ──► LINT ──► REVIEW ──► BUILD
  Figma      strokes    grid,     the lab   outline fills
  or paper   by hand    gaps,     at 16px   + metrics.json
                        trim      in a set
```

Review is the step people skip and the one that matters. **An icon is never
approved alone** — only sitting in a grid next to twenty others at 16px.

---

## Layout

```
src/icons/24/*.svg   the masters — stroked, hand-edited, never shipped
tools/lint.mjs       enforces 01-foundations.md; exits 1 on failure
tools/geometry.mjs   path parser + exact arc bounding boxes
tools/optical.mjs    optical side bearings from the outline
tools/build.mjs      emits dist/icons.json + dist/metrics.json
lab/                 index · language · keylines · alignment · optical · stroke-vs-fill
docs/                the system
```

## Docs

| | |
|---|---|
| [`01-foundations.md`](docs/01-foundations.md) | canvas, keylines, grid, stroke, gaps, optics |
| [`02-workflow.md`](docs/02-workflow.md) | where icons get made; the Figma argument |
| [`03-variants.md`](docs/03-variants.md) | weight / style / size axes, naming, scope traps |
| [`04-scope.md`](docs/04-scope.md) | categories and the v1 set |
| [`05-modifiers.md`](docs/05-modifiers.md) | the modifier system and the cut-back problem |

## Reference points

Verified from source during design, not recalled:

- **Shopify Polaris** — 499 components, all 20×20, zero strokes
- **Vercel Geist** — 16×16, zero strokes
- **Microsoft Fluent** — 7 sizes × 2 styles; filled variants share base geometry verbatim
- **Apple SF Symbols** — typographic grid, 3 drawn masters → 9 weights, 2,664 outline/fill pairs
- **Font Awesome** — variable-width viewBoxes (448 vs 512): glyphs, not squares
- **Nucleo** — 7 grids, 2 styles, 64k icons, per-icon `stroke_max` metadata
