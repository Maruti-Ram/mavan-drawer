# Mavan Drawer

An icon library built to be sold. The geometry is a system, the system is
enforced by a script, and the parts that are usually left to each consumer's
judgement — spacing, optical alignment — ship as data.

```bash
npm run check    # rebuild metrics, then lint every icon
npm run lab      # http://localhost:4174/lab/  (the Library and the drawing board)
npm run release  # build the box: the download folder, its zip, the two npm tarballs
```

`CLAUDE.md` holds the rules and the settled decisions; this page is the map.

---

## Decided

From `CLAUDE.md` → *Settled*, where each is recorded in full.

| | | Why / where |
|---|---|---|
| **Source of truth** | hand-authored SVG in `src/icons/24`, `20`, `16` | Figma exports lose the stroke, add float noise, and can't be code-reviewed |
| **Authoring** | strokes | typable, lintable, 10× smaller, editable |
| **Distribution** | **outlined fills only** — the stroked source stays private | renders identically everywhere; nothing a consumer can break |
| **Styles** | outline + filled, drawn together per icon | duotone deferred |
| **Weight axis** | none | opinionated defaults; stroke stays private |
| **Canvas** | 24 | market convention |
| **Masters** | **24 · 20 · 16**, each drawn by hand | user direction 2026-09-16; supersedes "drop 20" |
| **Stroke** | 1.5 at 24 and 20, 1.25 at 16 | C7, amended 2026-09-20 |
| **Size rule** | the master at or below the size, scaled up: 16 at 16–19, 20 at 20–23, 24 at 24 and above | picked 2026-10-26 on `lab/size-rule.html` |
| **Modifiers** | a badge on the base's bottom-right corner (top-right on a face, and a closed badge on a shield), never past the margin edge; the base is cut back by hand | C33; supersedes `05-modifiers.md`'s (16,16) anchor and r6 clear zone |
| **The set** | 1,309 approved rows: 448 icons and 861 variants, in 17 categories | `research/queue.md`; `node tools/queue.mjs status` |

### The geometry

```
masters    24 · 20 · 16
keylines   24: circle ⌀20 · square 18 · portrait 16×20 · landscape 20×16 · mark ≤18
           20: circle ⌀16 · square 14 · mark ≤14 · 16: circle ⌀14 · square 12 · mark ≤12
           the largest of these IS the outer drawing bound
stroke     1.5 · 1.5 · 1.25
filled     line-heavy icons 2.5 · 2 · 2; shape icons fill and keep the outline weight
grid       quarter units at 24 and 20, eighth units at 16; angles 0° / 45° / 90°
min gap    a literal 1.5 between any two stroke edges, at every master — agreed exceptions: a glyph's
           dot (1, C19), an arrowhead's legs to their shaft (1, C37), a clock's hands to their ring
           (1, C38), and the files that carry a `gap:` note (CLAUDE.md, Conventions)
```

Full rules: `docs/01-foundations.md`. Two do most of the work:

- **Round caps extend half a stroke past the endpoint.** At 24 (half = 0.75),
  to span the 18 keyline (3→21) the path runs `M3.75 12h16.5`; at 20, on its 14 keyline (3→17),
  `M3.75 10h12.5`. At 16 half is 0.625.
  Off-by-one here is the commonest defect in icon sets.
- **Min gap is a literal 1.5, not "one stroke".** The two are equal at 24 and 20 only;
  at 16 the stroke is 1.25 and the floor stays 1.5. This is what keeps the set legible
  at 16 and lets the filled style exist without shapes welding shut.

**There is no "live area".** The circle keyline *is* the outer bound. The 2 units
left over are margin shipped inside the asset, not a drawing rule.

### Optical metrics — the differentiator

`npm run build` emits `dist/metrics.json`: per-icon ink box, **geometric
bearings** (where the ink stops) and **optical bearings** (where it reads as stopping).
The box ships `ink`, `bearing` and `optical`; `<Icon optical />` in
`@mavan/icons-react` applies them as negative margins.

Without them the same CSS lands unevenly. Measured 2026-10-27 from
`dist/metrics.json` — optical left and right bearings at the 24 master, the 1,309
outline drawings (448 icons and their 861 variants): `padding: 12px` renders **14.01–24.05 px** of visual padding
depending on the icon (median 15.18), and `gap: 8px` renders 10.01–20.05 (median
11.18). The extremes are `activity` (the ink reads 2.01 in from the box edge) and
`volume-none` (12.05 in, a level-family member that sits off-centre on purpose, C28). With them, a consumer
subtracts the bearing once and every spacing value in their product is true to the ink.

Two corrections, and they are different:

- **Geometric** — the ink bbox is not at the box edge. At 24, `plus` has 4.5 units of
  bearing on every side and `circle` has 2.
- **Optical** — even with ink flush, a round shape needs tighter spacing than a
  flat one, because a circle touches its box at one tangent point and recedes
  everywhere else. At 24, `circle` reads 2.71 and `plus` 4.52.

The pass is measured, not guessed: it gives `arrow-right` an asymmetric result (left
4.54, right 5.33, both 4.5 geometric: blunt shaft end, pointed head) and `plus` almost
none (flat arm tips). It is computed from the outline in `tools/optical.mjs`.

---

## The box

`npm run release` (`tools/release.mjs`, `plans/shipping.md` card 2.1) builds it from
the sheet's approved rows:

1. `npm run check`, then `tools/outline.mjs` turns every stroked file into an outlined
   fill (one evenodd path, no stroke) — 2 styles × 3 masters × the approved rows, 7,854
   files today.
2. `packages/icons/` — `@mavan/icons`: `svg/24|20|16/<name>.svg` and `<name>-filled.svg`,
   `icons.json`, `metrics.json`, `meta.json`, README, LICENSE, CHANGELOG. `tools/gen-react.mjs`
   writes `packages/icons-react/` (`@mavan/icons-react`) from that box alone.
3. `npm pack` for both, then `dist/release/mavan-drawer-<version>/` and its zip. The version
   comes from the root `package.json` (0.0.1 today). The run never publishes or tags.

It refuses a dirty tree, a failing check, an unfilled README or LICENSE template and, from
1.0.0, a sheet that differs from `packages/names.lock` or a licence still carrying
`[Maruti]`. **1.0.0 is not cut**: it waits on the licence (`packages/templates/LICENSE.md`
is a draft with 24 open decisions) — `plans/shipping.md` card 3.3.

---

## Pipeline

```
  DRAW ──► LINT ──► REVIEW ──► APPROVE ──► RELEASE
  strokes  npm run  the lab,   queue.mjs   outlined fills
  by hand  check    at 16px    approve      + metrics + packages
                    in a set
```

Review is the step people skip and the one that matters. **An icon is never
approved alone** — only sitting in a grid next to twenty others at 16px.

---

## Layout

```
src/icons/24|20|16/   the masters — <name>.svg + <name>-filled.svg, stroked, hand-edited, never shipped
research/queue.md     the sheet: every icon, its status, category and approval date
tools/                lint · geometry · optical · build · queue · outline · release · gen-react · package-meta
lab/                  the Library (library.html) and the drawing board (icon.html)
packages/             templates (README, LICENSE draft) and the generated box
plans/                one file per build; CLAUDE.md → Picking up says which are open
docs/                 the system
```

## Docs

`CLAUDE.md` is the current record of settled decisions; where a numbered doc disagrees
with its *Settled* table (docs 03 and 05 predate several decisions), the table wins.

| | |
|---|---|
| [`01-foundations.md`](docs/01-foundations.md) | canvas, keylines, grid, stroke, gaps, optics, the consumer's size rule |
| [`02-workflow.md`](docs/02-workflow.md) | where icons get made; the Figma argument |
| [`03-variants.md`](docs/03-variants.md) | weight / style / size axes, naming, scope traps |
| [`04-scope.md`](docs/04-scope.md) | the original categories and v1 set; the sheet is the live list |
| [`05-modifiers.md`](docs/05-modifiers.md) | the modifier system and the cut-back problem |
| [`06-audit.md`](docs/06-audit.md) | the first-500 audit |
| [`07-character.md`](docs/07-character.md) | the visual language, decisions C0 onward |
| [`08-refinement.md`](docs/08-refinement.md) | why the marks read less refined than the references; the open agenda |
| [`09-rule-audit.md`](docs/09-rule-audit.md) | the open agenda for the rules themselves |

## Reference points

Verified from source during design, not recalled (`CLAUDE.md` → *Facts verified from source*):

- **Shopify Polaris** (archive) — 535 SVGs (463 outline bases + 72 filled), all 20×20, zero strokes
- **Vercel Geist** — 16×16, zero strokes
- **Microsoft Fluent** — 7 sizes × 2 styles; filled variants share base geometry verbatim
- **Apple SF Symbols** — typographic grid, 3 drawn masters → 9 weights, 2,664 outline/fill pairs
- **Font Awesome** — variable-width viewBoxes (448 vs 512): glyphs, not squares
- **Nucleo** — 7 grids, 2 styles, 64k icons, per-icon `stroke_max` metadata
