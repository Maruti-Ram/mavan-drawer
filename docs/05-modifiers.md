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

> Written for the old 2-unit stroke. The anchor and clear zone stand; glyph
> coordinates get re-derived for 1.5 when the first modifier (`calendar-plus`)
> is drawn, reusing the arm length chosen for `plus`.

```
            ┌────────────────────────┐
            │                        │   canvas 24, live area 20
            │     base icon          │
            │              ╭─────╮   │   clear zone:  r6 at (16,16)
            │              │  +  │   │   glyph:       8 units, 12→20
            │              ╰─────╯   │   anchor:      bottom-right, always
            └────────────────────────┘
```

| | Value |
|---|---|
| Anchor | **(16, 16)** — bottom-right, never moves |
| Glyph extent | 8 units rendered — centreline 13→19, outer 12→20 |
| Glyph stroke | **same as the base.** Never lighter. |
| Clear zone | circle **r6** at (16,16) |
| Clearance | 1.5 units (one stroke) between glyph outer edge and any base stroke |

**No base stroke's outer edge may enter the clear zone.** The clear zone spans
10→22, so it stays inside the live area and never touches trim.

Standard glyph, `plus`, for reference:

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
that is the established term.

### 16 master
Scale the anchor and zone by 14/20 = 0.7, then round to the half-unit grid:
anchor **(11, 11)**, glyph extent 5.5 units, clear zone **r4**. At 16 the base
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

**Use B as the default and A where B looks wrong.** Auto-clip produces flat cut
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
