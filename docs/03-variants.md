# Variants

> **Status of this document (updated 2026-10-27).** Written as a plan before the set was drawn. Since then:
> **three masters are drawn by hand, 24 · 20 · 16, each in outline and filled** (CLAUDE.md Settled:
> Masters, Styles), and there is **no weight axis** (Settled: Weight axis). Duotone is deferred. Where a
> section below says unbuilt, CLAUDE.md's Settled table wins.

Three orthogonal axes. Keep them orthogonal — the moment a weight change implies
a style change, the system has collapsed into a pile of special cases.

```
        WEIGHT  ──  Light 1.5 · Regular 2 · Bold 2.5
         STYLE  ──  Outline · Solid · Duotone
          SIZE  ──  16 · 20 · 24        (optical masters, not scales)
```

---

## Axis 1 — Weight

| Name    | Stroke | Crisp at | Use                                     |
|---------|--------|----------|-----------------------------------------|
| Light   | 1.5    | 2×+      | dense data UI, large display sizes      |
| Regular | 2      | all      | **default** — everything, unless told otherwise |
| Bold    | 2.5    | 2×+      | emphasis, active nav states, small sizes |

Weight is a **single attribute change**, not a redraw:

```html
<svg ... stroke-width="2">     <!-- Regular -->
<svg ... stroke-width="2.5">   <!-- Bold    -->
```

This only holds because §6 of the foundations mandates a 2-unit minimum gap. At
Bold the stroke grows 0.25 units on each edge, eating 0.5 of that gap and leaving
1.5 — still legible. At a 1-unit gap, Bold would weld shut. **The min-gap rule is
what makes the weight axis free.** That is why it is non-negotiable.

> **Status (2026-10-27): not used.** There is no weight axis (CLAUDE.md Settled: Weight axis) and no Weight
> view in the lab. *Written earlier:* Weight is a live attribute, so the lab's Weight view is showing real
> Light and Bold, not mockups.

Ship Regular first. Commit to Light and Bold once the set is ~80 icons and you know the
shapes have settled — re-testing three weights against a moving target is
wasted work.

---

## Axis 2 — Style

> **Status (2026-10-27): outline and filled are drawn** for every icon (Settled: Styles); Duotone is deferred.
> *Written earlier:* Solid and Duotone are unbuilt. Neither is a build
> step you can turn on — both are redraws, described below so you can budget them.

### Outline (the master)
The drawn artefact. *(2026-10-27: no longer the only style — every icon is also drawn filled, as a separate
drawing; CLAUDE.md Settled: Styles.)*

### Solid
**Not** a filled version of the outline path — that produces mush. Solid is a
separate silhouette, drawn to the same keylines, where:
- the outer contour matches the outline icon's *outer* edge
- interior detail becomes **negative space punched out** via `fill-rule="evenodd"`
- punched holes obey a **3-unit** minimum (not 2) — negative space inside a solid
  mass fills in faster than a gap between two strokes

**Two kinds of icon, one rule each (locked 2026-09-17):**

| Kind | Examples | Filled drawing |
|---|---|---|
| Line-heavy — nothing encloses an area | `plus`, `check`, `arrow-*`, `chevron-*`, `menu` | same strokes at the **filled line weight: 2.5 at 24, 2 at 20 and 16** (`01-foundations.md` §4). **No background.** The ink box stays identical, so each end pulls in by half the added weight — which keeps ends on the quarter grid only for +0.5 steps. |
| Everything else | `plus-circle`, `trash`, `calendar` | enclosed shapes become solid with holes punched out; any stroke left over **stays 1.5**. |

A mark on a container (`plus-circle`) is a hole in the filled container, not a
heavier line. Precedent: Fluent `add` goes 1.5 → 2 at 24 and 1 → 1.5 at 20.

Solid is a redraw. **As of 2026-09-17 it is drawn in the same sitting as the outline**
(one board, approved as a pair), not as a later pass. It is still not a
build step. Automated outline→solid conversion always looks automated.

### Duotone
The solid silhouette at 100% opacity plus an accent layer at 20%. Two paths, one
`currentColor`, opacity does the work — so it inherits colour correctly and needs
no palette.

```svg
<path opacity="0.2" d="<mass>"/>
<path d="<detail>"/>
```

---

## Axis 3 — Size — the part that costs real money

> **Status (2026-10-27): built** — three drawn masters, 24 · 20 · 16 (Settled: Masters), picked by the
> size rule (Settled: Size rule, shipped). *Written earlier:* `src/icons/24/` is the only master that exists. The lab's
> Sizes view scales it; nothing in this repo is redrawn per size. Everything below
> describes what you would build *if* you decide to, and what it would cost.

### What scaling actually costs

A scaled master stays crisp only when `render_px × DPR` is a multiple of 24 —
that is the condition for integer coordinates to land on device pixels.

| Render | 1× | 2× | 3× | Verdict |
|--------|----|----|----|---------|
| 16px   | soft  | soft  | crisp | needs its own master |
| 20px   | soft  | soft  | soft  | **avoid this size** |
| 24px   | crisp | crisp | crisp | the master |
| 32px   | soft  | soft  | crisp | **avoid this size** |
| 48px   | crisp | crisp | crisp | free — it is the master ×2 |

Two conclusions fall straight out of this table:

1. **48 is free.** It is an exact ×2 of the master, so it needs no drawing work
   and no separate file. Use it.
2. **20 and 32 are bad sizes.** They are soft at every DPR anyone actually has,
   and fixing either costs a whole extra master. The cheapest fix is to not use
   them — pick 16, 24 or 48 in the product instead.

That leaves exactly one size that is worth drawing by hand: **16**.

### What a 16px master would be

Not a shrunken 24. You redraw the idea with fewer marks — the calendar would drop
its header rule, the trash can its inner lines, the user icon's shoulders would
flatten. Same concept, fewer strokes, weight that lands on pixels.

| Master | Canvas | Live area | Stroke | Detail budget |
|--------|--------|-----------|--------|---------------|
| 24     | 24×24  | 20×20     | 2      | full    |
| 16     | 16×16  | 14×14     | 1 or 2 | minimal |

The stroke is an open question, and it is the same tradeoff as §4 of the
foundations rather than a free choice:

- **1** — crisp at every DPR, but 6.25% of the canvas against the master's 8.3%,
  so the 16px set reads noticeably lighter than the 24px set. This is what Carbon
  does.
- **1.5** — weight-matched to the master (9.4%), but fractional, so it is soft at
  1× for the same reason 1.5 was rejected at 24.

There is no third option: 2 units on a 16 canvas is 12.5% and reads as a brick.
Decide this the way you decide the master weight — in the lab, at size, against
neighbours.

### Be honest about the cost

A 16px master is **2× the drawing work, forever**. Every new icon becomes two
icons, two lint runs, two reviews. For a 200-icon library that is 400 drawings.

**Standing decision: ship the 24 master only.** Render it at 24 and 48, which are
exactly crisp, and at 16, which is slightly soft. You will live. Revisit once the
set is stable and you know which icons genuinely appear at 16px — nav, toolbars,
table rows, inline affordances. That is usually 30–40 icons, not the whole set,
and nobody ever needed `blockchain-settings` at 16px.

This is the single biggest scope trap in icon libraries. The full multi-master
matrix is what "the full deal" looks like, and it is also what kills sets at
icon 45.

---

## Naming

```
<object>-<modifier>       arrow-right, chevron-down, user-circle
<object>-<action>         file-plus, user-minus
```

Rules:
- lowercase, hyphenated, no abbreviations (`settings`, never `cfg`)
- **object first**, always — so `arrow-right` and `arrow-left` sort together.
  `right-arrow` scatters your set across the alphabet.
- describe the **drawing**, not the use. `magnifying-glass` outlives `search`;
  `three-dots-horizontal` outlives `more-menu`. Ship semantic aliases in the
  export layer, keep the filename literal.
- numbers only for a real count (`layers-3`) or a numbered shape variant (`trash-2`, `check-2` — C5, C9);
  the style word goes in the file's tags, not the name (`icon-2` as a filler name, never)
- full order: `<object>[-<modifier>][-<n>][-<size>][-filled]` (docs/07-character.md, C9)

File layout:

```
src/icons/24/arrow-right.svg           outline, regular  ← the master
src/icons/24/arrow-right-filled.svg    filled
src/icons/16/arrow-right.svg           16 optical master (later)
```

Weight is not a file. It is an attribute.
