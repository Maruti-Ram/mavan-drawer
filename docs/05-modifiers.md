# Modifiers

> A modifier is a small mark added to a base icon that ties an **action** to that
> object. `calendar` + `plus` = `calendar-plus`. The modifier is the `plus`.

Modifiers are where icon libraries quietly explode. 200 bases × 8 modifiers is
1,600 possible icons, almost all of which nobody needs. The system below exists
to make the geometry consistent and to make saying *no* the default.

---

## 1. Does this icon need a modifier at all?

All five must be true. If any fails, do not draw it.

1. **The action is specific to the object.** "Add an event to a calendar", not
   "add". If a bare `plus` next to the thing communicates it, use a bare `plus`.
2. **The base stays recognisable after cut-back.** Modifiers destroy roughly a
   quarter of the base (see §3). If the base is unreadable without that quarter,
   the combination fails.
3. **No distinct metaphor already exists.** Delete is `trash`, not `file-x`.
   Reach for the established sign before you compose one.
4. **The UI cannot carry it.** Placement, labels and adjacency usually can.
5. **You will ship at least three modifier variants of that base.** One or two is
   a bespoke icon, not a system — draw it as its own thing and skip the rules.

### Never
- **Stacked modifiers.** `calendar-plus-check` does not exist. One modifier, ever.
- **State that colour conveys.** Error, success and warning are rendering
  concerns, not separate drawings.
- **`<object>-search`.** Search is an affordance, not a property of the object.

---

## 2. The geometry — 24 master

> **Dated note, 2026-10-18: superseded by C33 (`07-character.md`) and the
> `calendar-repeat` drawings.** The geometry below this note was written for the
> old 2-unit stroke and is kept as history, struck or annotated where it no longer
> holds. Where it disagrees with this note, this note is right. Re-derived from
> `calendar-repeat` and `calendar-repeat-2`, measured on the shipped files:
>
> | | 24 · 20 · 16 |
> |---|---|
> | Anchor | the base's **bottom-right corner**. The base keeps its own drawing and its own canvas position |
> | How far out | the badge may stand past the base's box **up to the margin edge — 22 · 18 · 15 — and never beyond it**. A proud badge's ink corner sits **on** the margin edge: (22, 22) · (18, 18) · (15, 15) |
> | Composite box | on a square-keyline base the margin edge is 1 past the box at every master, so the ink is **19 × 19 · 15 × 15 · 13 × 13** (base 18 · 14 · 12), declared `<!-- box: 19x19 -->` (`15x15`, `13x13`); its centre sits 0.5 toward the badge |
> | Badge size, a loop | **9.75–10 · 8.25–9 · 8–8.125** of ink: two heads 9.75 × 9.75 · 9 × 8.25 · 8.125 × 8.125, the one-head ring 10 × 10 · 8.5 × 8.5 · 8 × 8. Other glyphs (`plus`, `check`) are sized when the first one is drawn |
> | Glyph stroke | the base's, 1.5 · 1.5 · 1.25, and it **stays** at that weight in the filled twin (the composite is shape-filled) |
> | Cut-back | **by hand** (§3's strategy A), measured from the glyph's own ink, not from a circle: **1.5 of air** between the badge's ink and every base edge, at every master and in the filled twin (measured 1.5–1.6) |
> | Stubs | a wall left shorter than 1.5 past its corner is removed; the corner may stay without it |
> | Clear zone | **none**: no circle zone, and no "live area" (doc 01 §1) |

> ~~Written for the old 2-unit stroke. The anchor and clear zone stand; glyph
> coordinates get re-derived for 1.5 when the first modifier (`calendar-plus`)
> is drawn, reusing the arm length chosen for `plus`.~~ The first modifier drawn
> was `calendar-repeat` (2026-10-18), and the anchor and clear zone did not stand.

```
            ┌────────────────────────┐
            │                        │   canvas 24, live area 20
            │     base icon          │
            │              ╭─────╮   │   clear zone:  r6 at (16,16)
            │              │  +  │   │   glyph:       8 units, 12→20
            │              ╰─────╯   │   anchor:      bottom-right, always
            └────────────────────────┘
```

*The sketch above is the stroke-2 geometry, superseded by C33: there is no live
area and no circle zone, and a proud badge reaches the margin edge (22).*

| | Value |
|---|---|
| Anchor | ~~**(16, 16)** — bottom-right, never moves~~ → the base's bottom-right corner; a proud badge's ink corner on the margin edge (C33) |
| Glyph extent | ~~8 units rendered — centreline 13→19, outer 12→20~~ → a loop is 9.75–10, outer 12–12.25 → 22 (C33) |
| Glyph stroke | **same as the base.** Never lighter. *(Stands. C33 adds: it stays at the outline weight in the filled twin.)* |
| Clear zone | ~~circle **r6** at (16,16)~~ → none; the cut is measured from the glyph's own ink (C33) |
| Clearance | 1.5 units ~~(one stroke)~~ between glyph outer edge and any base stroke: a literal 1.5 at every master and in the filled twin (C33; the 16 stroke is 1.25) |

~~**No base stroke's outer edge may enter the clear zone.** The clear zone spans
10→22, so it stays inside the live area and never touches trim.~~ *Superseded
(C33): no base edge comes within 1.5 of the badge's own ink, and the badge may
reach the margin edge (22 · 18 · 15) but never crosses it.*

~~Standard glyph, `plus`, for reference:~~ *Stroke-2 coordinates on the superseded
(16,16) anchor, kept as history; `plus` as a badge is re-derived when the first
plus composite is drawn.*

```svg
<path d="M16 13v6"/>
<path d="M13 16h6"/>
```

### `slash` is the exception
Disabled / off / hidden states use a full-canvas 45° stroke, not a corner badge:

```svg
<path d="M4 4l16 16"/>
```
It crosses the whole icon, needs its own 2-unit clearance channel through the
base, and is named `-off` rather than `-slash` — `bell-off`, `eye-off` — because
that is the established term. *(2026-10-18: the slash is not a badge and C33 does
not cover it; its direction is C21's. The 2-unit channel is stroke-2 arithmetic
and is not re-derived here.)*

### 16 master
~~Scale the anchor and zone by 14/20 = 0.7, then round to the half-unit grid:
anchor **(11, 11)**, glyph extent 5.5 units, clear zone **r4**.~~ *Superseded
(C33): at 16 a proud badge's ink corner sits on (15, 15), a loop is 8–8.125 of
ink, and the cut keeps 1.5 of air.* At 16 the base
usually loses so much to cut-back that most modifier variants should simply not
exist — ship the ones that appear in navigation and toolbars, nothing more.

---

## 3. Cutting back the base — the part nobody warns you about

A modifier does not sit *on top* of the base. The base is cut away to make room.

Verified on Microsoft Fluent's `calendar` vs `calendar-add` at 24:

| | subpaths |
|---|---|
| `calendar` | 8 |
| `calendar-add` | **4** |
| shared verbatim | 1 |

The container was **redrawn** to curve away from the badge, and **all five date
dots were dropped**. The modified icon is a simplified base plus a glyph — it
carries half the information of the original.

Three ways to handle it:

| Strategy | Quality | Cost |
|---|---|---|
| **A · Cut-back** — redraw the base path to curve around the zone | best | per-icon hand work |
| **B · Auto-clip** — subtract the clear zone at build time | ~80% | one build step |
| **C · Scale-down** — shrink the base and corner it | uniform but wrong | modified icons read lighter than unmodified ones |

~~**Use B as the default and A where B looks wrong.**~~ *Superseded 2026-10-18
(C33): **A, by hand, for every composite**, measured from the glyph's own ink
with 1.5 of air, and no wall left shorter than 1.5 past its corner.* Auto-clip produces flat cut
ends where round caps belong; on simple bases nobody notices, on dense ones it
reads as damage. C is rejected outright — it breaks weight consistency across the
set, which is the one thing a family cannot survive.

### The free optimisation
**Design bases with the modifier zone in mind.** If you know `calendar` will need
`-plus`, `-check` and `-x`, keep its bottom-right quadrant sparse from the start.
Fluent lost five dots because their calendar was not drawn with that in mind.
Costs nothing at design time, saves the cut-back entirely.

---

## 4. The modifier set

Ship these eight. Nothing else without a demonstrated use case.

| Modifier | Means | Naming |
|---|---|---|
| `plus` | add, create, new | `calendar-plus` |
| `minus` | remove, subtract | `user-minus` |
| `check` | done, approved, confirmed | `file-check` |
| `x` | cancel, reject, failed | `calendar-x` |
| `arrow` | move, send, export, import | `folder-arrow` |
| `clock` | scheduled, pending, history | `file-clock` |
| `star` | favourite, featured, pinned | `folder-star` |
| `slash` | disabled, off, hidden | `bell-off` ← different naming |

Deferred until the base set is stable: `lock`, `warning`, `edit`, `gear`, `eye`,
`sync`.

**Naming:** `<object>-<modifier>`, object always first, so every variant of a base
sorts together. `calendar-plus`, never `add-calendar`.

---

## 5. Governance

200 bases × 8 modifiers = 1,600 possible. A healthy v1 ships **60–80**.

A modifier variant enters the library when someone can name the screen it appears
on. Not before. This is the rule that keeps the set from doubling every quarter,
and it is the only one here that requires discipline rather than arithmetic.
