# SF Symbols — how a closed vocabulary is declared, and what a modifier does to its base

Wave 2, card 2.2 of `plans/set-and-rules-audit.md`. Measured 2026-10-04 against the pinned tree
`5933041` (485 concepts) and the SF Symbols app 27.0 on this Mac (font `SFSymbolsFallback.otf`,
10,446 glyphs; metadata in the app and in `CoreGlyphs.bundle`). Nothing in the set, the rules, lint,
the sheet or the board was touched.

**The one question this card answers.** Our axis F4 (a closed vocabulary) has no declared base
relation at all. Apple runs the largest declared vocabulary among our references (9,524 names). How
does it declare one, what does each modifier do to the drawing it is applied to, and what would the
same declaration cost us?

**Licence.** Apple's artwork. All derived data sits under `research/references/sfsymbols/card-2.2/`
(gitignored). This document holds measurements and symbol names only — no outline, no coordinates.

**What the eye sees, in one breath.** In Apple's set every circled symbol sits in the *same* ring.
Every badge is the *same* disc, about half an em across, hung on a corner of its base with the
*same* clear halo cut round it. Every slash runs at 45°, in one of two weights. Under a badge or a
slash the base is kept and trimmed; under a ring it is redrawn smaller at about the same line
weight. None of that is written in the drawings — it is written in a few small data files beside
them, and it holds because each part was drawn once. We already do the ring. We have no badge yet.

---

## The short answer

1. **Apple declares the vocabulary as data, beside the drawings, not in them.** Twelve small files
   ship with the font. Three are the vocabulary itself: who is a variant of whom (1,841 bases →
   3,986 derivatives), which outline has a filled twin (2,906 pairs), and what each retired name is
   called now (1,101 aliases). The drawings carry none of it.
2. **The variant map is the simplest thing it could be.** Flat (no derivative is itself a base), one
   parent each (0 of 3,986 sit under two), and mostly redundant with the name (99.3% are spelled
   `<base>.<suffix>`). 60% of the bases (1,097 of 1,841) have exactly one derivative, and it is
   their `.fill` — the file is, for most of its length, a pairing list.
3. **The 58 "modifier tokens" are not 58 modifiers.** By what they do: one style (`fill`), three
   operators that change the base (enclose it, badge it, strike it), one rotation compound spelled
   with seven words, and two word-lists — 13 container shapes and 25 badge glyphs. Sixty role
   patterns exist in 3,957 names; five cover 85.7% of them and ten cover 93.6%.
4. **The grammar is closed; only the lexicon grows.** 24 of the 58 tokens already existed in the 2019
   release, including `fill`, `slash`, `badge` and 11 of 13 container shapes — all three operators
   (enclose, badge, strike). Since then the bases went from 478 to 1,841, while the only structure
   added is `trianglebadge` (2020). What arrived after 2019 is mostly words: 19 more badge glyphs (25 in
   all), `hexagon` (2024) and `capsule` (2025), six minor words, and a renamed rotation family.
5. **The geometry is closed too — and that is what makes the declaration checkable.** Every plain
   `X.circle` and `X.circle.fill` symbol (1,016 of 1,016) is the same 2,040 × 2,040 circle (fontTools'
   own bounds), and the same at each of the nine weight × scale cells measured to within a unit; all
   324 squares are 1,841 × 1,841. 242 of 246 badges that carry a glyph have the same disc. 176 of
   176 slashes run `\` at exactly 45.0°. The air cut around a badge is one value (135 units; 250 of
   259 are within 130–140) — and Apple's own badge templates show why: the cut is a **layer**, a
   hidden shape that follows the badge's outline, grown by a constant.
6. **A modifier does one of three different things to the base, and the declaration cannot tell
   them apart.** A *badge* or a *slash* keeps the base where it was and cuts it back (base in place
   97% and 90%; a fifth of its ink removed at the median). An *enclosure* does not keep the base at
   all — the mark is redrawn shorter at about the container's wall weight (base in place 2%,
   scaled copy 10%, redrawn 88% of 744). A *fill* keeps the silhouette exactly when the base is a
   primitive (96% of 1,028 container fills) and only half the time otherwise (48% of 1,854).
7. **Suffix order is a nesting order, not a row of slots.** Outermost modifier last; `fill` closes
   the name (beside a badge either spelling draws the same thing). Three pairs are fixed
   (enclosure→fill 825:3, slash→fill 88:0, slash→enclosure 48:2). Two are not: *fill vs badge*
   (186:41 — one meaning spelled two ways; Apple moved `fill` in 17 of its 56 oldest renames) and
   *enclosure vs badge* (29:21 — two different meanings).
8. **Our equivalent is much smaller.** Of our 485 concepts, 326 have a parent the filename already
   states (286 numbered variants, 40 sized variants, C9), 124 are roots, and **35** are
   modifier-style names a person must confirm. One flat file, not 210 notes.
9. **A declaration cannot promise "built from the parent's drawing."** Apple's own declared
   derivative `person.circle` is a different, solid figure. The declaration has to name the kind of
   relation, and each kind gets its own check — starting with the one that can be tested exactly,
   the container ring, which is already true of us (40 concepts, one ring per master).
10. **What fails the transfer test:** everything in the data that depends on Apple's weight axis
    (air, slash weight and badge size all change with weight), its three scale glyphs, its
    advance-width layout (a badge hangs outside the box the symbol is laid out in), and its
    governance files. Recorded in §9.

---

## Sample, and why this one

| | |
|---|---|
| Source | the app's own font and metadata — `SFSymbolsFallback.otf` (CFF2, variable, weight axis 1–1000, masters at wght 1 · 400 · 1000), `Metadata/`, `CoreGlyphs.bundle/Contents/Resources/`, and the 26 loose `badge.*.svg` templates |
| Names | `names.json` (wave 0): 9,524 names resolved to glyphs by rendering and shape-matching — **sure 4,519 · tied 451 · likely 4,414 · doubtful 140**. Doubtful is treated as unresolved. |
| Pairs | the 3,986 base→derivative pairs of `base_symbols_map.json`; **3,749** have both names resolved (94.1%); **3,720** of those are spelled `<base>.<suffix>` — the population below |
| Deep sample | **26 hand-picked pairs × the three drawn masters** (wght 1 · 400 · 1000): 6 enclosures, 7 fills, 5 slashes, 8 badges, across the largest families (`checkmark`, `person`, `lock`, `plus`, `bell`, `photo`, `video`, `externaldrive`, `circle`, `xmark`, `person.crop.circle`). All 26 identified on contact sheets by eye (base outlined over derivative) — none was a mis-resolved name. |
| Population | regular weight (wght 400), medium scale. Where a number says *n*, that is the count of pairs it was measured on. |
| Our side | the whole pinned set — **485 concepts × 3 masters × 2 styles = 2,910 drawings**. Our numbers come from `docs/audit/findings-primitives.md` (card 1.1) where it measured them, otherwise from this card's own run, and say so. |

**Units.** One unit = 1/2048 em. At Regular and Medium the stroke — the ring thickness of the
`circle` glyph, the extractor's convention — is **170 units = 8.3% of the em**. Every number is
given in units and, where it compares, as a multiple of that stroke and a share of the em. At the
lightest master the stroke is 39.75, at the heaviest 356.

## Instruments

| Measure | How |
|---|---|
| names, tokens, roles, order, depth | `base_symbols_map.json`, `basemap.json` and a role table I built and checked against the data (§2.2) |
| outlines | fontTools on the variable font, glyph outlines at a named weight and scale, rasterised with Skia at 0.5 or 1 unit per pixel |
| *is the base in the derivative?* | **boundary correlation**: the base's edge pixels are slid (and, if that fails, scaled 0.35–1.30) over the derivative's edge; "in place" means ≥80% of the base's ink is still ink within 8 units of no movement |
| *air* | the shortest distance from the added element's edge to the ink that remains of the base (Euclidean distance transform) |
| *thickness of a line* | twice the median distance-to-edge along the ridge of the shape |
| *silhouette* | outline with its holes filled; compared by intersection over union |

**Two checks that the method reads true.** (a) The slash bar read by the ridge method agrees with a
perpendicular profile across it (`bell.slash`: ridge · profile 154.2 · 154.4 units at Regular,
43.9 · 43.4 at the lightest, 183.8 · 183.4 at the heaviest; the five slashes of §3.9 span 154 – 156,
42 – 44 and 182 – 184). (b) Apple ships the badge as a template whose first layer is a hidden
"clear-behind" shape. At the Regular master, small scale, the `badge.plus` template gives a clear
ring of **5.713 per 100 em** (5.688 across, 5.713 down) and a disc of **39.36** (39.40 across); the
same two numbers read from the *font* by my method, on `person.badge.plus`, are **5.713 and 39.38**
(over five pairs the font's ring ranges 5.62 – 5.74). At Black: template 6.348 · font 6.245 (disc
41.89 · 41.89; four of the five pairs read 6.25 – 6.33, `lock.badge.clock` reads 4.49). At the named
Ultralight (wght 28.93): template 3.079 · font 3.013 (disc 36.54 · 36.55).

**Declared limits.**

- The font holds flattened outlines. "Is the base reused verbatim?" cannot be asked of control
  points — I tried: for 14 base→derivative pairs, 4 of 39 base contours matched a derivative
  contour exactly. Every statement about reuse below is therefore tolerance-based (3 units).
- The app's *use* of `base_symbols_map.json` is not stated anywhere in the data. It is read here
  only as a declaration of the relation. [needs measuring — closed-source]
- Population numbers are at one weight and one scale. Across weights I measured only the 26 deep
  pairs.
- Roles in §2.2 are my reading of 58 strings, not Apple's. Where a token could be read two ways it is
  said.

---

## 1. What Apple declares as data

| File | Size | Holds | Declares |
|---|---|---|---|
| `Metadata/base_symbols_map.json` | 181 KB | 1,841 bases → 3,986 derivatives | which symbol is a variant of which — one parent each |
| `CoreGlyphs/nofill_to_fill.strings` | 170 KB | 2,906 pairs | the outline → filled twin |
| `CoreGlyphs/name_aliases.strings` | 74 KB | 1,101 entries | old name → current name; none of the 1,101 old names is in the current map; 671 entries point at a name that is (618 distinct) |
| `Metadata/legacy_aliases.strings` | 3 KB | 56 entries | the oldest renames (17 move `fill` before a badge) |
| `CoreGlyphs/name_availability.plist` | 312 KB | 9,524 symbols, 25 release tags | the release each symbol first shipped in (whole-year tags: 2019 1,661 · 2020 1,070 · 2021 840 · 2022 932 · 2023 1,000 · 2024 1,597 · 2025 616 · 2026 340) |
| `Metadata/layerset_availability.plist` | 842 KB | 6,630 symbols | which rendering modes it supports, since when |
| `Metadata/symbol_categories.plist` + `categories.plist` | 837 KB | 7,936 symbols · 32 categories · 1.83 per symbol | categories |
| `Metadata/symbol_search.plist` | 361 KB | 3,330 symbols · 2.12 terms | search words — our tags |
| `CoreGlyphs/symbol_restrictions.strings` | 37 KB | 663 symbols | may only refer to an Apple product |
| `CoreGlyphs/semantic_to_descriptive_name.strings` | <1 KB | **15** entries | a use-name → the drawing-name (`add`→`plus`, `organize`→`folder`, `search`→`magnifyingglass`) |
| `CoreGlyphs/symbol_order.plist` | 259 KB | 8,526 symbols | display order |
| `CoreGlyphs/legacy_flippable.plist` | 2 KB | 75 symbols | which mirror in right-to-left text |

Three things to read off this table.

- **The relation and the style pairing are separate files.** Of the 2,906 declared pairs, 1,400 are
  `X` with its own `X.fill` derivative; **1,107 are two derivatives of the same base**
  (`plus.circle` ↔ `plus.circle.fill`) — a pairing a base→derivative map cannot express; 399 involve
  a name that is not in the map at all. So Apple needed two relations: *variant-of* (a tree) and
  *style twin of* (a matching).
- **The use-name table is 15 entries.** Apple keeps names descriptive (what is drawn) and keeps the
  list of use-names tiny. That is `docs/09 §5` item 3 (a Concepts table) at the scale where it
  stays readable.
- **Renames are data.** 1,101 old names still resolve, 129 of them pure reorders of the same words.
  Apple has changed its naming convention and keeps the old names as a table that maps them to the
  current ones.

One more declaration is **not** in a data file but in the 26 loose templates: the cut-back. Each
badge template has two to six layers; in 15 of the 26 they are a hidden shape flagged `clear-behind`,
the badge, and the glyph knocked out of it. §3.7 returns to this.

---

## 2. The base map as a model of a grammar

### 2.1 The shape of the relation

Established by wave 0 and re-read here, not re-derived: **1,841 bases · 3,986 derivatives · strictly
single-parent · none itself a base (depth one) · mean 2.17 per base, max 33 (`checkmark`).**

| derivatives per base | 1 | 2 | 3 | 4–9 | 10+ |
|---|---|---|---|---|---|
| bases | 1,196 (65.0%) | 181 (9.8%) | 223 (12.1%) | 202 (11.0%) | 39 (2.1%) |

- **1,097 of the 1,196 single-derivative bases** have `<base>.fill` as their only derivative. 1,391
  bases have a `<base>.fill`; 1,723 (93.6%) have some derivative with a `fill` token; 118 have none.
- **3,957 of 3,986** derivatives (99.3%) are named `<base>.<suffix>`. The 29 that are not are the
  cases where a modifier lands *inside* the name (`arrow.down.to.line.circle` under base
  `arrow.down.to.line.compact`). The map exists for those 29 and for the pairing it does not
  contain.
- The map is **demand-driven, not generative.** 556 of 1,841 bases (30.2%) take any container,
  512 (27.8%) take `circle`, 167 (9.1%) take a badge, 125 (6.8%) take a slash. Nobody fills the cross
  product.

### 2.2 What the 58 tokens do

The suffix strings of the 3,957 base-prefixed derivatives hold **58 distinct tokens** (`arrow` plays
two roles). By role:

| Role | Tokens | Uses | What it does to the base |
|---|---|---|---|
| **style** — `fill` | 1 | 2,492 | the solid twin |
| **enclosure shape** | 13: `circle` 1,115 · `square` 353 · `rectangle` 81 · `shield` 33 · `bubble` 32 · `app` 24 · `icloud` 24 · `diamond` 16 · `viewfinder` 16 · `triangle` 8 · `seal` 6 · `capsule` 2 · `hexagon` 2 | 1,712 | puts a container round the base — which is redrawn inside (§3.3) |
| enclosure qualifier | 5: `crop` 22 · `stack` 16 · `on` 14 · `portrait` 10 · `video` 9 | 71 | orientation or layering of the container |
| **badge** | 2: `badge` 543 · `trianglebadge` 54 | 597 | adds a corner marker; the base is cut back (§3.6, §3.7) |
| badge glyph | 25: `exclamationmark` 126 · `plus` 81 · `checkmark` 78 · `minus` 50 · `xmark` 41 · `clock` 41 · `ellipsis` 29 · `questionmark` 21 · `play` 17 · `person` 12 · `location` 12 · `gearshape` 11 · `automatic` 8 · `arrow` 7 · `sparkles` 6 · `wifi` 6 · `key` 4 · `record` 3 · `down` 3 · `pause`, `paintbrush`, `up`, `timemachine`, `forward`, `camera` 2 each | 568 | the content inside the badge |
| **negation** — `slash` | 1 | 238 | a bar struck across the base (§3.5) |
| rotation compound | 7: `arrow` `trianglehead` `counterclockwise` `rotate` `90` `clockwise` `2` | 270 uses in 57 names | one operator spelled with several words: `arrow.trianglehead.[counter]clockwise[.2].rotate.90` |
| style words (rare) | 4: `inverse` 34 · `dotted` 16 · `filled` 6 · `half` 3 | 59 | half/inverse/dotted variants of circles and similar |
| other | 1: `ring` | 43 | a currency sign in a ring |

So the 58 reduce to **three operators that change a base's drawing (enclose, badge, slash), one
style (fill), one compound, and two word-lists** — the 13 container shapes and the 25 badge glyphs —
plus a handful of rare style words. That is the answer to *"what are the tokens doing: enclosure,
badge, state, negation, direction?"* — enclosure and badge are operators, negation is an operator,
`fill` is the one state, and **direction is not a modifier at all**: `up`, `down`, `forward` appear
only inside badge glyphs (7 uses), and `left`/`right`/`up`/`down` otherwise live in base names
(`arrow.up`), where they make a different base.

### 2.3 The grammar, written out

```
symbol    := base { "." modifier }
modifier  := style | enclosure | negation | badge | rotation
style     := "fill"                              2,492   (rare: inverse · dotted · half · filled)
enclosure := shape [ qualifier ]                 13 shapes, 5 qualifiers
negation  := "slash"                             238
badge     := ("badge" | "trianglebadge") [ glyph ]       25 glyph words
rotation  := arrow.trianglehead.[counter]clockwise[.2].rotate.90       one compound, 57 names
order     := outermost modifier last; "fill" closes the name (beside a badge, either side)
```

**Coverage.** Sixty role patterns exist in the 3,957 names. The top ten:

| Pattern | Names | Example |
|---|---|---|
| `fill` | 1,391 | `heart.fill` |
| `enclosure` | 771 | `plus.circle` |
| `enclosure.fill` | 755 | `plus.circle.fill` |
| `badge.glyph` | 322 | `person.badge.plus` |
| `badge.glyph.fill` | 153 | `alarm.badge.minus.fill` |
| `slash` | 124 | `bell.slash` |
| `slash.fill` | 62 | `alarm.slash.fill` |
| rotation compound (five words) | 45 | `bitcoinsign.arrow.trianglehead.counterclockwise.rotate.90` |
| other (`ring`) | 43 | `australiandollarsign.ring` |
| `fill.badge.glyph` | 37 | `bag.fill.badge.plus` |

Five patterns cover **3,392 of 3,957 (85.7%)**; ten cover **3,703 (93.6%)**.

**Stacking.** Counting operator *kinds* (enclose, badge, slash, rotate) per name: **none** in 1,473
(37.2% — style only), **one** in 2,382 (60.2%), **two** in 102 (2.6%), three in none. Tokens per
suffix: 1 in 2,376 (60.0%), 2 in 1,214 (30.7%), 3 in 282 (7.1%), 4–6 in 85 (mostly the rotation
compound). Apple does not forbid stacking — 102 names stack — but 97.4% of the vocabulary is one
operator and a style, which is what `docs/05 §1` ("never stacked modifiers: one modifier, ever")
asks of us as a rule.

### 2.4 Is the suffix order fixed?

Not as a row of slots. It is a **nesting order** — read left to right, each modifier applies to
everything before it — and `fill` closes the name, except beside a badge, where either spelling
draws the same thing. First occurrence of each role, per name:

| Pair | A before B | B before A | Reading |
|---|---|---|---|
| enclosure → fill | 825 | 3 | fixed (`plus.circle.fill`) |
| slash → fill | 88 | 0 | fixed |
| slash → enclosure | 48 | 2 | fixed (`bolt.slash.circle`) |
| enclosure → qualifier | 40 | 10 | mostly fixed (`rectangle.stack`) |
| badge → fill | **186** | **41** | one meaning, two spellings: `alarm.badge.minus.fill` (186) and `bag.fill.badge.plus` (41). 17 of Apple's 56 legacy renames moved `fill` in front of the badge (the 41 form) while 186 names keep it last: the spelling is not settled, and both draw the same thing (§8) |
| enclosure vs badge | 29 (enclosure first) | 21 (badge first) | two meanings: `arrow.down.circle.badge.xmark` (badge on the circle) vs `bell.badge.circle` (circle round a bell that already has a badge) |

So the answer to *"is suffix order fixed?"*: **mostly, and where it is not, order carries meaning
(enclosure against badge) or is a spelling habit (fill against badge).** That matters for us only if
we ever allow two operators on one base. We do not today (§4.1).

### 2.5 Closed grammar, growing lexicon

When each token first appears in a symbol name (`name_availability.plist`):

| Release | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 |
|---|---|---|---|---|---|---|---|---|
| tokens first seen | 24 | 12 | 4 | 1 | 4 | 10 | 2 | 1 |
| bases first shipped | 478 | 216 | 133 | 396 | 239 | 233 | 69 | 75 |

All three operators (`slash`, `badge`, and the enclosure family), `fill` and 11 of the 13 container
shapes are in the 2019 release; `trianglebadge` is 2020, `hexagon` 2024, `capsule` 2025. The later
tokens are badge glyph words (6 in 2019, 9 in 2020, then one to three a year), six minor words
(`stack`, `portrait`, `half`, `filled`, `dotted`, `ring`) and the rotation compound (six words, all
2024 — a rename, not a new idea). **1,427 of 3,984 derivatives (36%) arrived in a later release than
their base** (1,394 by whole year): variants are added after the fact, and the grammar absorbs them.

---

## 3. What each modifier does to the base

### 3.1 The population answer: is the base kept, scaled, or redrawn?

3,720 base→derivative pairs, regular weight, medium scale. *In place* = ≥80% of the base's ink is
still ink in the derivative with no more than 8 units of movement. *Scaled copy* = the base fits
inside, uniformly smaller, at ≥75% boundary match.

| Modifier | n | Base in place | Scaled copy | Redrawn | Ink box grows | Layout width unchanged |
|---|---|---|---|---|---|---|
| badge | 271 | **97.4%** | 0 | 2.6% | 98.9% | 93.0% |
| badge + fill | 138 | 33.3% | 0 | 66.7% | 99.3% | 72.5% |
| slash | 99 | **89.9%** | 0 | 10.1% | 82.8% | 94.9% |
| slash + fill | 58 | 50.0% | 0 | 50.0% | 87.9% | 75.9% |
| fill | 1,378 | 46.0% | 0 | 54.0% | 5.9% | 82.8% |
| enclosure | 744 | **2.0%** | 9.9% | **88.0%** | 75.3% | 2.3% |
| enclosure + fill | 731 | 2.5% | 0.4% | 97.1% | 75.2% | 2.3% |
| rotation compound | 52 | 1.9% | 0 | 98.1% | 94.2% | 1.9% |
| fill + badge | 41 | 43.9% | 0 | 56.1% | 100% | 63.4% |
| other combinations | 208 | — | — | — | — | — |

Read plainly: **a badge or a slash edits the base in place; a container or a rotation replaces it;
a fill sometimes does either.** And the last column is why Apple can let a badge hang off a symbol:
in 93% of badge derivatives the *layout width* is the base's own, while the ink box grows in 99%.
The symbol is laid out by its advance, not by its ink.

### 3.2 The container is one drawing

Pure-container derivatives (`enclosure`, `enclosure.fill`) at regular, medium: the outer box of the
largest contour, counted over every use.

| Container | Uses | Distinct outer boxes | Commonest box | Share on it |
|---|---|---|---|---|
| `circle` | 1,016 | **1** | 2,040 × 2,040 | **100%** |
| `square` | 324 | **1** | 1,841 × 1,841 | **100%** |
| `rectangle` | 45 | 3 | 2,358 × 1,841 | 91% |
| `bubble` | 30 | 2 | 2,204 × 2,069 | 50% |
| `app` | 24 | 2 | 1,844 × 1,843 | 96% |
| `icloud` | 22 | 1 | 2,514 × 1,738 | 100% |
| `shield` | 20 | 2 (two shields) | 1,662 × 2,020 | 50% |
| `diamond` | 16 | 1 | 2,268 × 2,268 | 100% |
| `viewfinder` | 13 | 9 (corner brackets, not a fixed shape) | — | 38% |
| `triangle` · `seal` · `capsule` · `hexagon` | 8 · 4 · 2 · 2 | 1 · 2 · 1 · 1 | — | — |

**1,486 of 1,526 container derivatives (97.4%) sit on their token's commonest outer box.** The
circle holds at **every one of the nine cells measured** (three weight masters × three scale
glyphs): 1,016 symbols, one circle, at most a unit of rounding between them. Re-derived with
fontTools' own `BoundsPen` alone (the glyph's exact bounds, no rasterising, no flattening): all
1,016 circles are exactly 2,040 × 2,040 and all 324 squares exactly 1,841 × 1,841; 1,011 of the
circles share one left edge (x = 179) in a 2,398-wide layout box; five hockey figures sit further
right in wider boxes (four at +76 in a 2,550 box, one at +60 in a 2,518 box). The layout width is
the same story — circle 2,398 in 1,011 of 1,016, square 2,351 in all 324, bubble, app, icloud,
triangle, capsule, hexagon each one value: **the container fixes the symbol's box and its side
bearings at once.**

Our side, measured by card 1.1 and re-checked here with the repo's own path parser: **40 outline
concepts and 40 filled concepts carry the container ring, one circle at each master (outer ink edge
10 / 8 / 7), not one deviating** (`findings-primitives.md §2.1`; for the filled style that is 37
files with the exact ring plus `ban-filled`, `compass-2-filled` and `chart-pie-3-filled`, which are
built differently and meet it at the outer edge only). We already have what Apple has, for the one
container we draw.

### 3.3 Enclosure: the mark is redrawn, not scaled

Six pairs, regular master (full table in the data folder; the three weights follow in §3.8).

| Pair | Container wall | Mark long side ÷ standalone | Mark thickness ÷ standalone | Mark thickness ÷ ring wall | Air from mark to wall |
|---|---|---|---|---|---|
| checkmark → .circle | 170 = **1.00 stroke** | 0.53 | 0.83 | 0.91 | 1.52 strokes |
| plus → .circle | 170 = 1.00 | 0.56 | 0.93 | 0.99 | 2.27 |
| plus → .square | — | 0.56 | 0.93 | — | 1.74 |
| xmark → .circle | 170 = 1.00 | 0.53 | 0.88 | 0.93 | 1.68 |
| lock → .circle | 170 = 1.00 | 0.53 | solid | solid | 1.56 |
| person → .circle | 170 = 1.00 | 0.59 | solid | solid | 0.88 |

The eye sees a plus in a ring. The numbers say the plus inside is a little over half the length of
the free plus (0.53–0.56) while its bar is within 7–17% of the free plus's thickness (0.83–0.93) and
within 1–9% of the ring wall: **shortened, not shrunk.** `docs/05 §3` offers three ways to cut a
base round a corner badge and does not cover this case; its strategy C (scale the base down) is
"rejected outright" for breaking weight consistency. Apple mostly avoids that too — by redrawing the
mark at about the ring's weight (0.91 – 0.99 of the ring wall at Regular; it drifts at the extremes,
§3.8), as our own C18 does (our `check-circle` carries a 10.27-wide check against the free check's
16, at the same 1.5 stroke) — though 74 of its 744 enclosures (9.9%) are scaled copies.

Two further facts. **The content is solid in a third of the ring cases:** in 160 of 480 measurable
`X.circle` ↔ `X.circle.fill` pairs the thing inside the ring is a solid shape thicker than 1.3 ring
walls (`lock`, `person`, `star`), not a line; the other 320 are lines at about the ring's weight. And
**the declared derivative is not always a geometric one**: `person.circle` holds a solid head and
shoulders where `person` is an outline — a different drawing under a name that says "built from".

### 3.4 Fill: the outer edge, and the cut

**The silhouette.** Outline and filled twin, silhouette overlap (intersection over union, outline
with holes filled), over every declared pair with both names resolved:

| Pairs | n | Overlap ≥ 0.99 | Overlap ≥ 0.95 |
|---|---|---|---|
| container outline → container fill | 1,028 | **96.4%** | — |
| every other pair | 1,854 | 48.2% | 55.9% |
| all | 2,882 | 65.4% | — |

Deep pairs at Regular: `lock → lock.fill` 1.000, `checkmark.circle`, `plus.circle`, `xmark.circle` →
`.fill` 1.000 each (one hole, the mark); `bell` 0.93, `video` 0.93, `person` 0.89. The filled
twin is smaller than the outline's silhouette by more than 3% in 15.2% of the 2,882 and larger in
15.6%; the ink box is identical to within 2 units in 80%. So: **the outer edge of the outline is the
outer edge of the fill exactly where the shape is a primitive (a circle, a square, a lock body), and
about half the time elsewhere.** `person.fill` is wholly inside the outline's outer edge; the
filled `bell` redraws the clapper.

**The cut.** In `X.circle.fill` the mark is a hole in a disc. Over the 507 `X.circle` ↔
`X.circle.fill` pairs that exist, 320 have a line-like mark (thickness ≤ 1.3 ring walls):

| | p5 | p25 | p50 | p75 | p95 |
|---|---|---|---|---|---|
| knockout width ÷ the same mark's width in the outline | 1.000 | 1.028 | **1.035** | 1.039 | 1.058 |

The cut is the mark's own weight plus 3.5%, and it holds across `figure` (80 pairs), `arrow` (41),
`chevron`, `calendar`, `phone` and the rest (medians 1.02–1.06). The three marks of `docs/09 §2`'s
"filled cut weights" are an example: `checkmark`, `plus`, `xmark` cut at 159.8 · 174.0 · 165.5 units
against outline marks of 154.8 · 168.0 · 158.4 units at Regular (ratios 1.03 · 1.04 · 1.04). **Apple's
cut is derived from the mark, one rule for every mark; ours is set per mark class** (check 1.5 ·
plus/x/glyphs 2 · minus 2.5, `docs/09 §2`).

### 3.5 Slash

176 slashes found in the 199 slash derivatives with both names resolved (`slash`, `slash.fill`,
`slash.circle`…).

- **Direction: `\` in 176 of 176, at 45.0°** (every one within 0.5°). It agrees with C21.
- **Weight: two values.** 154–156 units (0.91 stroke) in 157 of 176 (89%); 90–102 in 19 — and those
  19 are exactly the 19 `slash.circle`-type names, the slash inside a container. One drawing,
  reused, and one thinner for the container case.
- **Length:** 0.95 of the base's box diagonal at the median (p10–p90 0.73–1.05): corner to corner,
  overshooting slightly.
- **Air round it:** 116.7 units median (p25–p75 116.0–119.5; 0.69 stroke; 5.7% em).
- **Base ink removed:** 22.4% median (p10–p90 14.1–57.5%).

### 3.6 Badge — where it sits, how big, what it takes

432 `badge` derivatives with both names resolved; 391 had a round badge found; **259 were also
registered against their base** (the base verifiably in place), the population below.

**Size.** A badge with a glyph is **1,016 units across — 0.496 em, 5.98 strokes** — in 242 of 246.
A plain dot badge (`bell.badge`) is 694 units (0.339 em) in 10 of 13. By diameter alone, two sizes —
1,016 (244 of 259) and 694–700 (11) — cover 255 of 259 (98.5%), whatever the base and whatever the
glyph (`plus`, `checkmark`, `xmark`, `clock`, `exclamationmark` all median 1,016). Against the base
the disc is 0.39 – 0.51 of the base's long side (p10 – p90), median 0.46: the disc is fixed, the
base is not.

**Place.**

| Centre of the badge in the base's box | RB (bottom-right) | LB | RT | LT |
|---|---|---|---|---|
| share of 259 | **54.1%** (140) | 24.3% (63) | 16.2% (42) | 5.4% (14) |

Measured from the nearest corner of the base's ink box, in badge radii: **across 0.15–0.26 inside
the box edge (RB median 0.15; LB 0.26), down about 0.7 inside** (RB 0.71; LB 0.68). The centre is
inside the base's box in 93.8%. So the disc sits with its centre a quarter-radius in from the side
edge, and hangs about 0.8 radius beyond it. **The ink box grows in 97.7%** (median +18.5% wide,
+8.2% tall).

It is **not** the emptiest corner. Scoring the base's ink in the four corner zones (40% squares),
the chosen corner ranks first (emptiest) in 18.1% of 259 (chance: 25%), second in 23.6%, third in
42.1%, last in 16.2%. The corner is a convention and a meaning, not a computation. (`docs/05 §3`'s
"design bases with the modifier zone in mind" is therefore not what Apple does: it cuts what is
there.)

**Air.** Shortest distance from the badge's edge to the base ink that remains: **median 135.1
units, p5 – p95 130.1 – 136.6 (0.79 stroke, 6.6% em)**; rounded to 5, 224 of 259 (86%) are 135 and
250 (96.5%) are 130 – 140. One value.

**Cost.** Base ink removed (cut plus covered): median 17.9%, p10 – p90 12.9 – 33.7%. Inside the
badge the glyph is 0.43 – 0.70 (median 0.63) of the disc and 0.73 stroke thick at the median.

`docs/05 §1` (item 2) says modifiers destroy "roughly a quarter of the base"; §3 of that doc backs it
only with Fluent's subpath counts (8 → 4), not with ink. Measured on ink, Apple's median is **18%
for a badge and 22% for a slash**, with a long tail (p90 34% and 57%). "A fifth, sometimes half" is
the honest sentence.

### 3.7 The cut is a layer — Apple's own templates say so

The 26 loose `badge.*.svg` files are the badge as Apple draws it. Each has a first layer flagged
`-sfsymbols-clear-behind` (opacity 0): a shape that follows the badge's outline, larger by a fixed ring.
Measured on the 26 templates at the Regular, small-scale master (em = 100):

- **23 of 26 have the same clear offset: the badge's own outline grown by 5.69 – 5.71 per 100 em**
  (median distance between the two outlines): every disc badge, the plain dot,
  `trianglebadge.exclamationmark` — and the badges that are *not* discs (`eye`, `microphone`,
  `sparkles`, `sparkles.alt`, `location`), whose halo is the same offset of their own outline.
- Three differ: `badge.gearshape` (median 5.46, an uneven offset of 5.1 – 7.5) and `badge.waveform`,
  `badge.wifi` (the layer order differs, so the pair compared is not badge and halo).

Fifteen of the 26 have three layers — *erase* (hidden shape), *badge* (disc), *glyph* (hidden,
knocked out of the disc); nine have two, one four and one six. **This is `docs/05 §3`'s strategy B —
subtract a clear zone at build time — and Apple's evidence for it is that the measured halo is one
value, not a hand-cut one.** The font keeps only the result.

### 3.8 Across the three weights — and why this part fails the test

26 deep pairs × wght 1 · 400 · 1000. What does the air do as the stroke goes from 39.75 to 170 to 356?

| Master (stroke) | Badge air, min (units · strokes · em) | Slash air (units · strokes) | Slash bar | Badge disc | Mark thickness ÷ ring wall (check · plus · x) |
|---|---|---|---|---|---|
| wght 1 (39.75) | 70.8 · 1.78 · 0.035 | 82.0 · 2.1 | 42.4 – 43.9 | 946 (0.462 em) | 1.10 · 1.11 · 1.21 |
| wght 400 (170) | 134.6 · 0.79 · 0.066 | 120.2 · 0.71 | 154.2 – 155.6 | 1,016 (0.496 em) | 0.91 · 0.99 · 0.93 |
| wght 1000 (356) | 162.1 · 0.46 · 0.079 | 152.0 · 0.43 | 182.4 – 183.8 | 1,089 (0.532 em) | 0.71 · 0.78 · 0.77 |

The stroke grows ×9; the air ×2.3; the slash bar ×4.2; the badge disc ×1.15. The air is neither a
multiple of the stroke nor a constant. **This is Apple's weight axis talking, and we have none.**
At one master the numbers are tight (§3.5 – 3.6); across masters they are Apple's separate drawing
decisions, interpolated in between. Not transferable (§9, R1).

### 3.9 The other 20 pairs at Regular, one line each

Regular weight, medium scale; a stroke is 170 units. The six enclosures are in §3.3. *Base kept* is
the share of the base's boundary found again in the derivative (tolerance 3 units).

**Fills** (7)

| Pair | Silhouette overlap | Fill area ÷ outline area | Outer-edge deviation, p95 | Holes in the fill |
|---|---|---|---|---|
| bell → bell.fill | 0.929 | 0.963 | 1.39 stroke | 0 |
| lock → lock.fill | 1.000 | 1.000 | 0.01 stroke | 1 |
| person → person.fill | 0.888 | 0.888 | 0.37 stroke | 0 |
| video → video.fill | 0.930 | 0.933 | 1.19 stroke | 0 |
| checkmark.circle → checkmark.circle.fill | 1.000 | 1.000 | 0.01 stroke | 1 |
| plus.circle → plus.circle.fill | 1.000 | 1.000 | 0.01 stroke | 1 |
| xmark.circle → xmark.circle.fill | 1.000 | 1.000 | 0.01 stroke | 1 |

**Slashes** (5)

| Pair | Base kept | Direction · angle | Bar thickness | Bar length ÷ base diagonal | Air to the base (min) | Base ink removed |
|---|---|---|---|---|---|---|
| bell → bell.slash | 0.80 | `\` · 45.0° | 154 units = 0.91 stroke | 0.96 | 119 units = 0.70 stroke | 17% |
| lock → lock.slash | 0.77 | `\` · 45.0° | 154 units = 0.91 stroke | 1.08 | 116 units = 0.68 stroke | 24% |
| video → video.slash | 0.89 | `\` · 45.0° | 154 units = 0.91 stroke | 0.99 | 120 units = 0.71 stroke | 12% |
| person → person.slash | 0.64 | `\` · 45.0° | 156 units = 0.92 stroke | 1.08 | 128 units = 0.75 stroke | 38% |
| photo → photo.slash | 0.82 | `\` · 45.0° | 154 units = 0.91 stroke | 1.00 | 133 units = 0.78 stroke | 29% |

**Badges** (8)

| Pair | Base kept | Disc ⌀ | Centre in the base's box (across, down) | Ink box grows (wide · tall) | Air to the base (min) | Base ink removed |
|---|---|---|---|---|---|---|
| bell → bell.badge | 0.86 | 4.08 strokes = 0.339 em | (0.76, 0.16) | +0% · +0% | 129 units = 0.76 stroke | 15% |
| person → person.badge.plus | 0.80 | 5.98 strokes = 0.496 em | (0.99, 0.91) | +28% · +18% | 134 units = 0.79 stroke | 21% |
| lock → lock.badge.clock | 0.76 | 5.98 strokes = 0.496 em | (0.94, 0.84) | +31% · +10% | 135 units = 0.79 stroke | 24% |
| photo → photo.badge.plus | 0.85 | 5.98 strokes = 0.496 em | (0.97, 0.83) | +18% · +10% | 136 units = 0.80 stroke | 19% |
| externaldrive → externaldrive.badge.plus | 0.82 | 5.98 strokes = 0.496 em | (0.06, 0.80) | +15% · +10% | 134 units = 0.79 stroke | 22% |
| circle → circle.badge.plus | 0.76 | 5.98 strokes = 0.496 em | (0.94, 0.76) | +18% · +0% | 135 units = 0.79 stroke | 22% |
| person.crop.circle → person.crop.circle.badge.plus | 0.83 | 5.98 strokes = 0.496 em | (0.06, 0.76) | +18% · +0% | 136 units = 0.80 stroke | 17% |
| video → video.badge.plus | 0.84 | 5.98 strokes = 0.496 em | (0.03, 0.86) | +17% · +17% | 135 units = 0.79 stroke | 16% |

The lack of scatter inside each table is the finding. Eight badges: one disc size for seven of them
(5.98 strokes), air 129 – 136 units, centres 0.94 – 0.99 across the base's box on the right and
0.03 – 0.06 on the left (the odd one out, `bell.badge`, is the plain dot, at 0.76). Five slashes:
one angle, one bar thickness (154 – 156 units), air 116 – 133. Seven fills: four primitives at
1.000, three organic shapes at 0.89 – 0.93.

---

## 4. Our equivalent: what a declaration looks like, and what it costs

### 4.1 What we already declare, and where

| Relation | How it is stated today | Machine-readable? |
|---|---|---|
| numbered shape variant (`check-2`) | filename, C9; style word in `<!-- tags -->` | name yes, tags yes |
| sized variant (`check-small`) | filename, C8; lint checks the family step | yes |
| style twin (`-filled`) | filename; lint compares the pair; C13 requires the full grid | yes |
| level / arrangement family (`volume-*`, `users-*`) | filename + `<!-- anchor: NAME -->` (C28), C27 in prose | anchor yes; C27 no |
| **built on another icon** (`check-circle` ← `check`, `calendar-plus` ← `calendar` later) | a sentence in the file's comment: *"classic `check` in the ring, 2.5 · 2 · 1.75 clear"*, *"plus as wide as check-circle's check (C18)"* | **no** |
| shared parts (the ring, the arrowhead) | nowhere (card 1.1 found them by measurement) | **no** |

Only the last two rows have no declaration, and they are the two things Apple's base map (the
relation) and its template layers (the cut) cover.

### 4.2 What our names already say

Parent by filename alone, applying C9 and C8 to the 485 outline names:

| | Concepts | Parent from the name |
|---|---|---|
| numbered shape variants (`-2` …) | 286 | the unnumbered name — certain |
| sized variants (`-small`, `-large`), with and without a number | 40 (19 + 21) | the same name without the size word — certain |
| roots (no shorter concept is a prefix) | 124 | none |
| modifier-style names (a shorter concept is a prefix) | **35** | needs a person |

The 35: `check-circle`, `plus-circle`, `minus-circle`, `x-circle`;
`volume-low/-minus/-none/-off/-plus/-x`; `users-behind/-level/-wide` and the nine `users-N-…`;
`sort-ascending`, `-descending`, `sort-alpha-…`, `sort-numeric-…` (six); `menu-arrow-left/-right`;
`file-text`; and four that are spelling coincidences or need a call — `arrow-up-right`, `book-open`,
`cursor-click`, `layout-sidebar-right`. **Nine names have two candidate prefixes** (`users-2-behind`
→ `users` or `users-2`); C27 settles them (the figure number travels), and a declaration must write
that down.

**So the whole job is 35 judgments and 9 disambiguations.** Apple declares 3,986.

### 4.3 Three forms, and what each costs

| Form | What it is | Files touched | Lint | Risk |
|---|---|---|---|---|
| **A. Names only** | a function in `tools/` that derives the parent from C9/C8 | 0 | none new | covers 67% (326 of 485); the other 35 stay prose |
| **B. One map file** (Apple's form) | one flat file in the repo, beside the sheet and not among the drawings: the 35 hand entries, the rest generated from the names; read by lint | **1** | exists · single parent · no cycle · parent is not itself a derivative · names agree with C9 | `queue.mjs rename` must carry it (it already re-points the relatives' comments) |
| **C. A note in each file** (our `anchor:` pattern) | `<!-- from: check -->` | **35 × 6 = 210** (three masters × two styles) | same checks, plus six copies must agree | drift between the six copies; the note is stripped from what ships anyway |

**Recommendation (engineering, not a visual choice): B.** It is the form Apple chose, it costs one
file, and the single place cannot disagree with itself. It needs a ruling from Maruti only in that
it **adds a declared relation to the rulebook** (the Settled table, `docs/01`, `docs/07`, the icon
skill and lint all change in the same commit).

### 4.4 What a declaration cannot promise

Three lines from §3.1 decide its design. *Enclosure:* the base is redrawn in 88%. *Fill:* in place
in 46%. *Badge and slash:* in place in 97% and 90%. A declaration that said "derived from" would be
true of a badge, false of a ring, and sometimes true of a fill. So the map must carry the **kind**,
and each kind gets its own check:

| Kind | What the check is | Can it be exact? |
|---|---|---|
| container | the container is the master ring (outer ink edge 10 / 8 / 7) | **yes — and already true (40 concepts)** |
| badge / slash | the air to the remaining base is one value per master; the disc is one size | yes, once there is one badge |
| enclosed mark | thickness ≈ the ring wall; extent free | by tolerance |
| fill | silhouette overlap with the outline; knockout = the mark's outline weight | by tolerance |

The first row is where to start: it needs nothing but the ring we already draw, and it is the test
that makes the other three believable. Everything past it waits for card 1.9's modifier census and
for the first real `calendar-plus`.

### 4.5 Where the declaration would also pay: metrics

In Apple's data the container fixes the symbol's layout width and side bearings at once (§3.2).
`dist/metrics.json` is our differentiator, and its bearings for every `-circle` concept are
identical by construction. A declared container could carry its bearings once instead of leaving
40 concepts to agree by luck. Not measured further here. [needs measuring — and `docs/09 §2` lists
the metrics bugs that come first]

---

## 5. Findings, in the plan's three kinds

Nothing here is an edit. These are inputs to cards 1.9, 1.13, 1.14, 1.16 and the decision agenda.
Findings that rest on card 2.3's sample (the "Nucleo 0.82" in `docs/08-refinement.md:114`) are in
`references-nucleo.md` and are not repeated.

### Kind 2 — our rule disagrees with another rule or with the doc that backs it

**K1. `docs/05 §3` (how to cut a base for a corner badge) and C18 (how a container takes a mark)
never meet.** `docs/05 §3` lists three ways to cut a base round a badge: A (redraw the base round
the badge), B (subtract a clear zone), C (shrink the base, "rejected outright"), and its modifier
set (§4) has no enclosure. The four `-circle` marks (`check-circle` and its relatives) are drawn by
C18 instead: the mark redrawn shorter at the same weight inside a fixed ring. Apple does the same for
most of its 744 enclosures (redrawn 88%, in place 2%) and scales the base for about one in ten
(9.9%). Neither doc contradicts the other; each is silent where the other speaks, so which one
governs a drawing that has both a container and a badge is unwritten. An omission, not a
contradiction. **Systemic** (docs/05 is the modifier rule). For the rule register.

**K2. `docs/05 §2` fixes the anchor at bottom-right "always"; `docs/09 §5` item 4 offers top-right
(borrowed from the Cursor article).** Apple's 259 measured badges: bottom-right 54.1%, bottom-left
24.3%, top-right 16.2%, top-left 5.4%. Three sources, three answers, and the reference's is "per
base". **Systemic.** This is a convention to decide once, and Maruti's (§6).

**K3. `docs/05 §1`: modifiers destroy "roughly a quarter of the base".** The doc backs it with
Fluent's subpath counts (8 → 4), not with ink. Measured on ink in Apple: median 18% (badge, n = 259)
and 22% (slash, n = 176), p90 34% and 57%. Right order of magnitude, wrong shape of distribution.
**One-off.**

**K4. `docs/05 §2`'s clearance "1.5 units (one stroke) between glyph outer edge and any base
stroke".** It is one stroke at 24 and 20 (stroke 1.5) and 1.2 strokes at 16 (stroke 1.25); the
same doc says its geometry was written for the old 2-unit stroke (`docs/09 §2`). Apple's
regular-master air round a badge is 0.79 stroke and round a slash 0.69. This is not a disagreement with
Apple (their value is theirs, §9 R2) — it is `docs/09 §2`'s own "doc 05's geometry is still written
for stroke 2", now with a second place that quotes the old figure. **One-off.** For card 1.16.

**K5. `CLAUDE.md:308` (and `README.md:133`) quote "2,664 outline/fill pairs" for SF Symbols.** The
app's `nofill_to_fill.strings` on this Mac (SF Symbols 27.0) declares **2,906**, or 2,508 once the
398 locale and direction variants (`.ar`, `.hi`, `.rtl` and 17 more suffixes) are set aside. The
2,664 reproduces from no filter I tried. Card 1.16 lists the same sentence as holding
(`stale-statements.md:197`, "SF Symbols 2,664 pairs ✓"), so one of the two needs reconciling against
a named release. [needs checking] **One-off.** (`docs/08-refinement.md:114`, "Polaris runs 0.55,
Nucleo 0.82", is a card 2.3 finding and is measured once, in `references-nucleo.md` K1.)

### Kind 3 — fine by every rule, and nothing covers it

**K6. We have no rule for how a filled cut relates to the mark it cuts.** Apple's is one: knockout =
the mark's outline weight × 1.035 (p5–p95 1.00–1.06, n = 320), the same for check, plus and x. Ours
is set per mark class, and `docs/09 §2` already says the difference between swap partners is
visible. **No rule says what a cut is derived from.** Systemic within the filled style. For card
1.8; the ruling is pending ruling 1 ("check cut weight").

**Booked for card 1.9 (an input, not a finding).** A declared derivative can be a different drawing
from its base, and nothing in our rules would say so: when `calendar-plus` arrives, "is that
calendar the calendar?" has no check, and Apple shows what happens without one — `person.circle` is
`person` redrawn solid. §4.4's relation kinds are one way to give the question a check.

### Kind 1 — a drawing disagrees with a stated rule

**None found by this card.** The set has no badge or slash derivative to measure yet; the nearest
(`ban`, `volume-off`, the four `-circle` marks) are measured by cards 1.1 and 1.7. Our container
ring (40 of 40, at every master) agrees with what a closed vocabulary needs — it is Apple's best
number and it is also ours.

---

## 6. What only Maruti's eye can settle

Each with the surface to settle it on. None is a measurement question.

1. **Which corner does a badge go in?** Apple has no single answer (54 / 24 / 16 / 5). Ours says
   bottom-right always; `docs/09 §5` offers top-right. Settle on **the wall** (card 4.1) with a plus,
   a dot and a check badge on `calendar`, `user`, `bell` and `folder`, all four corners, at 16.
2. **May a badge hang off the box?** Apple's does (ink box grows in 97.7%; layout unchanged in 93%).
   Ours has a fixed canvas, so a hanging badge means shrinking the base or crossing the keyline —
   pending ruling 5 ("badges crossing 22"). Settle with `user-plus` drawn both ways.
3. **How much air round a badge or a slash, at 16?** Apple holds 0.79 and 0.69 of its stroke. We
   hold 1.2 at 16 as a general floor. Whether a badge halo should be thinner than our general gap is
   a look, and belongs with the gap question (card 1.7).
4. **Is a cut as heavy as the mark enough at 16?** The tick has the fewest clear pixels (6 against
   plus 10); `docs/09` says bring it up. Apple cuts every mark at its own weight and widens by 3.5%.
   Settle in the Library's **At 16** strip, filled, light and dark.
5. **Does the enclosed mark read right at "shortened, not shrunk"?** It is our practice already; the
   question is whether the mark's share of the ring (we are at 0.64 – 0.70 of the free mark at 24
   and 0.52 – 0.54 at 16, `findings-primitives.md §3.2`; Apple at 0.53 – 0.56 at its one size)
   should be one number or a per-mark choice.

---

## 7. How to reproduce this

Scripts and outputs are kept beside the data at `research/references/sfsymbols/card-2.2/`
(gitignored). `README.md` there lists the order. In short:

```
python3 sf_grammar.py            # roles, signatures, precedence, token table, fill pairing
python3 sf_containers.py         # §3.2: outer boxes of every pure-container derivative
python3 sf_containers2.py        # the same at 3 weights x 3 scales
python3 sf_census.py             # §3.1: base in place / scaled / redrawn over 3,749 pairs (~20 min on 8 processes)
python3 sf_census2.py badge|slash|fill     # §3.4 – 3.6 populations
python3 sf_cut.py                # §3.4: knockout width over the 507 circle pairs
python3 sf_corner.py             # §3.6: rank of the chosen corner
python3 sf_deep.py               # §3.3 – 3.6, 3.8: the 26 pairs at three weights -> sf/deep.json
python3 sf_templates.py          # §1 (check b), §3.7, R4: template halo offsets, font-side check, circle wall at three scales
python3 sf_final_tables.py       # prints the deep tables
python3 sf_sheet.py out.png a,a.b …   # base | derivative | overlay contact sheet (identity check)
```

**Independently re-derived** (a second method, not the same script run twice): the circle and square
identity, and the circle's wall at three scales, with fontTools' exact glyph bounds (§3.2, R4); and
the template ring, read straight from the 26 `badge.*.svg` files as the distance between the clear
layer's outline and the badge's (23 of 26 at 5.69 – 5.71 per 100 em; `badge.plus`: first-layer
circle radius 25.39 minus badge radius 19.68 = 5.713 per 100 em). **Not independently checked** —
for the fresh reviewer (card 5.1) to re-derive without my scripts: the 97.4% / 90% *base in place*
rates, which depend on my 80%-of-ink and 8-unit thresholds, and the 18.1% emptiest-corner rate,
which depends on my corner zones (40% squares of the base's box).

---

## 8. Seen and not carried — everything else the data showed

For completeness and so that nothing is lost. Each is a finding that was run through the four tests
and stopped at the first one it failed; §9 gives the reasons.

- The style pairing is not complete in SF: of the 3,316 names in the base map that carry no fill
  token, 75.6% (2,507) have a declared fill twin and 809 do not.
- Apple names every variant by a word (`person.crop.circle`); its numbers count things (`person.2`,
  `chevron.up.2` is two chevrons) or measure them (`rotate.90`, `wave.3`). In the 40 commonest
  contexts of its 1,494 numbered names I found no number meaning "another drawing of this symbol".
  C9 numbers shape variants and tags the word. Settled; not argued. Apple's cost for its way is
  1,101 aliases in seven years.
- `fill` beside a badge is spelled two ways (`person.fill.badge.plus`, `book.badge.plus.fill`). In the
  two I rendered side by side both fill the base and carry the same solid badge disc: where `fill`
  sits does not change the drawing.
- 114 of the 1,101 aliases carry a locale or direction suffix (`.ar` `.hi` `.he` `.ja` `.ko` `.th`
  `.zh` `.rtl`): localised drawings of one symbol. None in the base map.
- The font's scale glyphs (small, medium, large) are not scalings of each other: the plain circle's
  wall is 153.0 · 170.0 · 186.5 units at small · medium · large (Regular), 9.5 · 8.3 · 7.2% of its own
  width of 1,615 · 2,040 · 2,605.

---

## 9. Take / refuse / why

Every item run through the four tests of `plans/set-and-rules-audit.md` § *The transfer test*:
**(1)** it answers a question we already have; **(2)** their constraint matches ours on that
question; **(3)** it is a method, not a value; **(4)** we can check it, or book it eye-only. Our
constraints: no control over render size · no weight axis · three hand-drawn masters at 24/20/16 ·
two styles drawn as a pair · outlined fills shipped from a private stroked source · we publish
optical metrics. Apple's: one font, nine weights *derived* from three masters, three scale glyphs,
symbols laid out by advance width in running text, a vocabulary of 9,524 names.

**The one method this card takes from SF Symbols, and the zero numbers.** *Declare the parent as
flat, single-parent data separate from the style pairing; derive it from the name wherever the
naming rule allows; and give each kind of relation its own geometric check, starting with the one
that can be tested exactly — the container — by counting the distinct outer boxes of the part
across all its uses.* Everything below either supports that or is recorded as not carried.

### Take — the method, never the number

**T1. A flat, single-parent base map, separate from the style pairing.** (1) F4 "no declared base
relation at all". (2) Names are the customer-facing identifier in both systems and must not break;
scale differs (3,986 vs 485) and makes ours cheaper, not different. (3) a method: the *shape* of the
file (flat; one parent; relation and pairing apart). (4) checkable by lint today — existence, single
parent, no cycle, parent not a derivative. **Take.**

**T2. Derive the relation from the name wherever the naming rule allows; hand-write only the
exceptions.** Apple: 99.3% by name; ours: 67% by C9 and C8, 35 judgments for the rest. (1) F4 and
the "variant cap" ruling. (2) matches — C9's order is a grammar. (3) a method. (4) checkable: a short
function, which this card ran over the 485 names. **Take.**

**T3. Prove closure by counting the distinct outer boxes of a part over all its uses.** Circle:
1,016 uses, 1 box. (1) F4 "is the circle in `plus-circle` the circle in `x-circle`?"; `CLAUDE.md`
Open item 5, the primitive-drift linter. (2) a within-master question; weight axis irrelevant. (3) a
method (the count), not the 2,040. (4) checkable and already checked by card 1.1 (40 concepts, 1
ring). **Take**, as a lint check that keeps it true as the queue grows past 485.

**T4. Cut-back is a layer: a clear zone grown from the added element by one constant per master.**
23 of 26 templates, 5.69 – 5.71 per 100 em (median offset between the clear layer's outline and the
badge's); badge air 135 units (p5 – p95 130 – 137, n = 259). (1) F5 "how it is cut out, whether the
base is cut back"; `docs/05 §3`. (2) the relation at one master matches. (3) a method — and it is
`docs/05`'s own strategy B, now with a reference that uses it. (4) checkable once there is one
badge. **Take: confirms B as the default. The value is ours to choose.**

**T5. Measure a modifier's footprint three ways: base in place, ink removed, ink box growth.** The
table in §3.1. (1) F5 and pending ruling 5. (2) matches for badge and slash; fails for the box
growth (R3). (3) a method. (4) checkable on ours as soon as `calendar-plus` exists. **Take** the
method; wait for the first modifier.

**T6. Measure a filled cut as a ratio to the outline mark it cuts, per mark.** 1.000 – 1.058, median
1.035, n = 320. (1) pending ruling 1, "check cut weight"; F13. (2) a relation between two styles at
one master — matches. (3) a method; Apple's 1.035 is not ours to adopt (our eye may want the tick
cut heavier for the 16 clear-pixel count). (4) checkable on ours today (`check-circle` vs
`check-circle-filled`). **Take the method; the ruling stays Maruti's.**

**T7. Silhouette overlap as the test behind "filled outer edge = outline outer edge."** 96.4% of
container fills at ≥ 0.99; 48.2% of the rest. (1) F13; C12's "filled ink box == outline's" is
checked on boxes only. (2) matches. (3) a method. (4) checkable. **Take**, as an addition to the pair
check; the finding that primitives hold and organic shapes do not tells us where the eye will
notice a miss.

**T8. Keep the use-name table tiny and the drawing-names canonical.** 15 entries. (1) `docs/09 §5`
item 3, a Concepts table. (2) matches. (3) a method. (4) checkable. **Take as a pointer** for the
card that builds the Concepts table.

### Refuse — recorded as *seen and rejected, because X*

**R1. Anything that depends on Apple's weight axis.** The air round a badge (1.78 → 0.79 → 0.46
strokes), the slash bar (1.07 – 1.10 → 0.91 – 0.92 → 0.51 – 0.52 strokes), the badge disc (0.462 →
0.496 → 0.532 em), the enclosed mark's thickness against the ring wall (1.10 – 1.21 → 0.91 – 0.99 →
0.71 – 0.78 across check, plus and x). **Fails test (2):** Apple spans weight at one size and
derives the rest by exact interpolation from three drawn masters; we span size at a near-constant
stroke. A number that moves with weight tells us nothing about a number that moves with size. *Seen
and rejected, because the axis is the opposite of ours.*

**R2. Their air as a number: 0.79 stroke round a badge, 0.69 round a slash.** **Fails test (3).**
It is a value, and the plan forbids taking one. It earns a place as evidence for card 1.7 — at one
master Apple holds one air per element kind, less than one stroke — but the answer for our 16 is a
look (§6 item 3). *Seen and rejected as a number.*

**R3. The badge hanging off the symbol.** Ink box grows in 97.7%; layout width unchanged in 93.0%.
**Fails test (2):** the symbol is laid out by advance width in running text, so ink can hang off the
layout box at no cost. Ours is a fixed canvas with a keyline, published bearings and a keyline
margin; a hanging badge would have to be paid for by shrinking the base or crossing the keyline.
*Seen and rejected, because their layout box is not their ink box and ours is.*

**R4. The three scale glyphs (small, medium, large).** **Fails test (2):** they are separately
stored glyphs, not scalings of one another (the circle's wall is 153.0 · 170.0 · 186.5 units at
small · medium · large, 9.5 · 8.3 · 7.2% of its own width of 1,615 · 2,040 · 2,605; scaled copies
would keep one share). We draw sizes as masters (24 / 20 / 16) and size words (C8). *Seen and
rejected, because a scale glyph is neither of our two size mechanisms.*

**R5. The corner statistics.** 54 / 24 / 16 / 5. **Fails test (3).** It is a distribution of
decisions, not a method; and test (1): the question "which corner" is Maruti's convention to set
(K2), not a thing a reference decides. *Seen and rejected as a rule; kept as evidence that Apple
has no single corner either.*

**R6. The two spellings of `fill` beside a badge, and the stacking census.** `X.fill.badge.G` vs
`X.badge.G.fill` (41 : 186) draw the same thing in the two names I rendered; 102 names stack two
operators. **Fails test (1):** `docs/05 §1` already forbids stacked modifiers ("one modifier,
ever") and we have one `-filled` suffix, so no question of ours is answered. *Seen and rejected for
now.* Parked with a trigger: when a second operator is allowed on one base, run the precedence matrix
of §2.4 before C9's order is extended.

**R7. Style pairing that is not a full grid.** 24.4% of the base map's non-fill names (809 of 3,316)
have no declared fill twin. **Fails test (2):** C13 makes every shipped icon a pair, so an unpaired
icon is a gap we do not permit. *Seen and rejected, because our constraint is stricter.*

**R8. Governance data: availability by release, categories, search terms, restrictions, display
order, flippable.** **Fails test (1):** nothing of ours is shipped (0.0.1, private) and no question
on the agenda asks for it. *Seen and rejected for now.* One piece is parked rather than rejected:
the 1,101 aliases are the mechanism by which Apple survived changing its naming convention. C9's
"numbers never change once shipped" has no answer for the day a rename is unavoidable. Revisit at
first release.

**R9. Descriptive names instead of numbered variants.** **Fails test (1):** C9 is settled; the plan
says not to reopen without being asked. *Seen and rejected, because the question is closed.*

**R10. The "58 tokens" as a target list.** The list is Apple's lexicon; ours is the 35 modifier
names and whichever badge glyphs the queue needs. **Fails test (3).** *Seen and rejected as a
value.*

### Why, in one paragraph

Apple declares a closed vocabulary three ways at once: as **data** (a flat tree, a pairing, an alias
table), as **names** (a grammar whose order is nesting and whose rare exceptions are recorded as
renames), and as **geometry** (one container, one disc, one slash bar, one cut, each drawn once and
used everywhere). The data is cheap to copy in form; the names are already ours by C9; the geometry
is what makes either checkable, and on the container we already match them exactly. What does not
carry is anything Apple measured *across weights*, because we have no weight axis, and anything
about how a badge is laid out, because our canvas is a box and theirs is a line of text.
