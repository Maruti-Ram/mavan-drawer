# Audit — the first 500

> Which ~500 concepts to draw first, ranked by how many shipped sets include
> them. The full ranked list is generated: **[research/ranked.md](../research/ranked.md)**
> (spreadsheet: `research/audit.csv`). This page is the findings.

```bash
npm run audit     # rebuilds research/ranked.md, audit.csv, audit.json from the snapshots
```

## Method

| Source | What was counted | Size |
|---|---|---|
| **Polaris** (`polaris-react-archive`) | outline base names; `…Filled` folded into its base | 463 bases (535 files) |
| **Nucleo Essential** (sets 10 + 11, one vote) | distinct names at the largest grid | 221 + 181 names |
| **Lucide** (`main`) | icon names; deprecated aliases used only as lookups | 1,847 icons |
| Feather · Nucleo UI family | **tie-breakers only**, never a vote | 287 · 4,633 names |

Snapshots live in `research/sources/`, so the ranking reruns offline and the
numbers above can be reproduced.

1. **Normalise:** kebab-case, drop digits (`house-5`), `slash`→`off`,
   drop `-small`, move a leading container to the end (`circle-check` → `check-circle`).
2. **Map synonyms** with `research/synonyms.mjs`: 663 canonical concepts, each
   with every name the three sets use for it. Where the same name means different
   things in different sets, the alias is per source (Polaris `delete` is a trash
   can, Lucide `delete` is a backspace key).
3. **Score** 0–3 by how many sets draw the concept. A base also scores for any
   set that draws only its variants. Polaris has `shield-check` and `shield-person`
   but no bare `shield`, and the shield geometry has to exist either way.
4. **Evidence rule:** a concept enters the 500 if two sets agree, or if one
   curated set chose it alone (Polaris, Nucleo Essential, or Feather). **A
   Lucide-only concept is not evidence**, because Lucide draws 1,800 things.
5. **Order:** score → Polaris (a real product needed it) → base before variant →
   Nucleo → Feather → Nucleo UI family. Tier 3 always sorts last (doc 04: on demand only).

## Findings

### 1. The evidence supports 487 concepts, and 500 is the right size

After removing logos and Shopify-only concepts, **487** Tier 1–2 concepts are
backed by evidence: 126 score 3/3, 226 score 2/3, and 135 come from a single
curated set. That leaves **13 open slots** (see §6). The D23 estimate holds.

Arrows + UI/Layout take **23%** (114 of 487), close to the 26% share in
Nucleo's UI family. The warning in D23 holds as well.

### 2. D23 is 120 concepts, not 122, and 114 of them are in

D23 lists the same drawing twice in two places:

- `close` and `x` are one drawing.
- `copy` (Files) and `duplicate` (Editing) are one drawing. Polaris calls it
  `Duplicate`, and its keywords are "copy, duplicate".

**Six D23 concepts miss the evidence rule:**

| D23 | audit concept | who draws it | verdict |
|---|---|---|---|
| `caret-left`, `caret-right` | — | **nobody** | **Cut.** Polaris has only vertical carets; chevrons cover horizontal. |
| `history` | `history` | Lucide only | Keep by judgement. Polaris and Nucleo use a plain clock for history. |
| `badge` | `badge` | Lucide only | Weak. `badge-check` (verified) is the one products use. |
| `filter-data` | `list-filter` | Lucide only | Weak. Everyone else uses `filter`. |
| `report` | `file-chart` | Lucide only | Weak. |

**These D23 concepts are in the 500 on a single vote only:** `caret-up` and
`caret-down` (Polaris), `stopwatch` (Nucleo; Lucide's `timer` *is* a stopwatch
drawing, so D23's `timer` and `stopwatch` may be one icon), and
`trending-up` / `trending-down` (Feather only).

**Also ambiguous:** D23 has both `expand`/`collapse` (Arrows) and
`maximise`/`minimise` (UI). Lucide draws them as different icons (four arrows
vs four corners); Polaris draws only the maximise/minimise pair. Pick one pair
unless both have a named screen.

### 3. D23 is missing concepts that all three sets draw

These Tier 1 concepts score 3/3 but are not in D23:

> **home** · **checkbox** · **cursor** · **save** · **ban** · **pin** ·
> **chevrons-up-down** (the select-input icon) · clipboard · clipboard-check ·
> files · images · book · book-open · face-smile · thumbs-up · microphone ·
> compose · language · hash · target · lightbulb · wand · gauge · presentation ·
> text · toggle-on · layout-footer · sidebar-right · sort-descending ·
> rotate-ccw · plus-circle · minus-circle · file-plus · file-minus ·
> shield-check · arrow-{up,down,left,right}-circle

`home`, `checkbox`, `save` and `chevrons-up-down` appear on nearly every SaaS
screen. Their absence from D23 is the clearest thing this audit found.

Also worth adding, since Polaris backs them at 2/3: `import` (D23 has only
`export`), `backspace`, `calculator`, `form`, `note`, `moon`/`sun` (the
theme toggle), `toggle-off`, `chevron-first`/`chevron-last` (pagination),
`user-plus`/`user-minus`, `folder-plus`, `image-plus`, `thumbs-down`.

### 4. Tier 2 is 161 of the 487

| category | n | strongest |
|---|--:|---|
| Commerce & Payments | 37 | cart, credit-card, package, cash, store, wallet, briefcase, building |
| Design Tools | 38 | paintbrush, crop, eyedropper, palette, layers, align-object ×6 |
| Devices & Hardware | 28 | desktop, printer, keyboard, plug, mobile, wifi, battery |
| Media & Playback | 25 | camera, volume, play, pause/play/stop-circle |
| Development & Infra | 23 | bug, puzzle, wrench, cloud, network, rocket |
| Maps & Location | 10 | globe, map-pin, compass, map |

**Design Tools is not in doc 04's Tier 2 list**, but 38 of its concepts
pass the evidence rule. Add it to the list.

### 5. Nucleo "UI Essential" is 221 concepts, not ~1,000

The 1,024 rows in set 10 are 221 names × 2 grids × outline/filled. The list is
also partly showcase pieces (`ufo`, `deer`, `yoga`, `pizza-slice`), so a Nucleo
vote alone is weak evidence. Those pieces are filed as Tier 3 and held back.

**29 Tier 3 concepts have two or more votes** (flower, forklift, gamepad and
leaf have all three). They are cheap wins if a customer asks, and the scope
rule still says on demand only.

### 6. The 13 open slots

The evidence runs out at 487. These are the best-supported candidates,
**chosen by judgement, not by the data**:

`history` · `badge` · `list-filter` · `file-chart` *(the four weak D23 concepts
above; keep them if their screens exist)* · `webhook` · `signature` ·
`list-todo` · `chart-area` · `folders` · `trophy` · `route` · `focus` · `router`

The full candidate pool, by category, is at the bottom of `research/ranked.md`.

### 7. Modifiers: 145 of the 487 are variants

The biggest families are `user` (12), `file` (10), `phone` (6), `folder` (5),
`image`, `message` and `window` (4 each). Doc 05's rule is to draw modifiers
last, after their bases are settled. The ranking already sorts bases ahead of
variants within each score band.

### 8. Polaris is heavily commerce: 118 of its concepts are excluded

This covers orders, products, metaobjects, domains, currency copies and theme
editor parts. The "499" in CLAUDE.md does not match the archive, which has
**463 outline bases + 72 filled twins = 535 files**. Its currency variants
(`cash-`, `payout-`, `receipt-`, `transaction-fee-` × dollar, euro, pound,
rupee, yen) fold into one concept each. Currency localisation is a later
decision.

## Naming corrections for doc 04

The audit uses the house convention (object first). D23 breaks it in a few places:

| D23 | convention |
|---|---|
| `bar-chart`, `line-chart`, `pie-chart` | `chart-bar`, `chart-line`, `chart-pie` |
| `link-break` | `link-off` (matches the `-off` rule in doc 05) |
| `at` · `alarm` · `loading` | `at-sign` · `alarm-clock` · `loader` |
| `more-h` · `more-v` | `more-horizontal` · `more-vertical` |
| `schedule` | `calendar-clock` |

## Caveats

- **The synonym table is a judgement call.** Every mapping is in one file and
  can be reviewed, but a wrong merge moves a concept by a whole vote. The
  highest-risk merges are `page`→`file`, `pen`→`pencil`, `chart-donut`→`chart-pie`
  and `adjust`→`sliders`.
- **A variant is detected by name prefix**, so `text-align-left` counts as a
  variant of `text`. That affects the variant counts in §7, not the ranking.
- **Polaris is one product.** Its 1-vote concepts (`viewport-*`, `sandbox`,
  `channels`, `live`) passed the evidence rule but are Shopify-flavoured.
  Before drawing, check them against doc 04's rule that someone can name the
  screen the icon appears on.
