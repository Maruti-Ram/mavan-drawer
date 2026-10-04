# Findings — the filled style (F13)

Wave 1, card 1.8 of `plans/set-and-rules-audit.md`. **Every place the filled drawing and its
outline twin disagree beyond the ink box.**

**Pinned tree `5933041`** — 485 concepts × 3 masters × 2 styles = 2,910 files, 1,455 pairs.
Nothing in `src/icons/`, lint, the docs or the sheet was touched. Every number below was measured
this session with the wave-0 instruments in `tools/audit/`; nothing is recalled. An unmeasured
number is written `[needs measuring]`.

**The rule being tested** (CLAUDE.md Settled · Styles, Filled; `docs/03-variants.md:52-61`;
C10, C12, C17, C18, C22, C23): the two styles are drawn together and approved as a pair; the
filled outer edge equals the outline outer edge. Line-heavy icons thicken to `FILLED_WEIGHT`
(2.5 · 2 · 2) with the ink box held. C17 repeated elements thicken in place and may grow.
Every other icon fills its shapes and keeps the outline weight for leftover lines.

**What already checks it:** `lint.mjs:159-173` compares the two **ink boxes** and nothing else.
`lint.mjs:372-377` strips area paths before the bend loop, so no corner on a filled area path is
seen at all. Everything in this document is outside both.

---

## 0. Method and resolution

| Question | Instrument | Resolution |
|---|---|---|
| Ink box per side | `geometry.bbox`, grown by half the stroke — lint's own recipe (`lint.mjs:303-312`), unrounded | exact |
| Segment angles | `audit/angles.mjs` `segmentsOf`, then every filled straight edge matched to the outline centreline it offsets (parallel within 8°, midpoint within half a stroke + 0.4, projecting inside it) | exact; ranked by `dev`, never `fromHorizontal` |
| Corner radii | `audit/radii.mjs` `radiiOf` — reads **area** paths, which lint cannot | exact for circular arcs; least-squares fit otherwise, with the tool's own `fitError` |
| Cut and knockout weight | two instruments: `geometry.facingGap(ds, stroke, areas, {cap: 4})` for the exact narrowest span per kind (what lint §5f reads), and a flood-fill census of every **enclosed** white region measured by its largest inscribed circle — C23's own measure — taken on a 1/16 lattice then refined to the continuous maximum by coordinate descent on the exact clearance field | facingGap exact; inscribed-circle width to ~0.01 after refinement |
| Silhouette | the **outer region** `O` = ink ∪ every white region the ink encloses, on a 1/16 lattice per master, both styles; symmetric difference and piece count | area to ~0.01 sq units; piece count on a 1/12 lattice, components under 9 cells dropped |

Known limits, stated rather than hidden. The corner matcher pairs a filled contour corner with
the nearest outline corner of the same turn direction; where a filled corner derives from a
*different* outline corner plus a separation it mis-pairs, and the two such cases are named and
excluded in §3.2. The enclosed-white census drops components under 16 lattice cells and any whose
measured width exceeds its own footprint, which removes flattening slivers (`volume-off` produced
ten at 24); it therefore says nothing about white that runs to the canvas edge — that is
facingGap's half.

---

## 1. The ink box — the one thing already checked, and the band under it

| | pairs | concepts |
|---|---|---|
| Pairs measured | 1,455 | 485 |
| Any side differs by > 0.01 | **54** | **18** |
| …carrying a `grows:` note | 54 | 18 |
| …note matches the drawings to 0.01 | **54** | **18** |
| Undeclared differences | **0** | **0** |
| Notes that do not match the drawings | **0** | — |

The box rule is kept, and every exception is declared and true. `CLAUDE.md:279-280` still says of
`grows:` "none yet noted"; the population is 54 files on 18 concepts, 13 distinct note strings:

| Master | Note (L R T B) | n | Concepts |
|---|---|---|---|
| 24 | `0 0 0.5 0.5` | 11 | `filter-2` `menu` `menu-2` `menu-3` `menu-4` `menu-arrow-left` `menu-arrow-right` `minus` `minus-large` `minus-small` `text-2` |
| 24 | `0.5 0 0.5 0.5` | 2 | `list-bullet` `list-bullet-2` |
| 24 | `0.5 0.5 0 0` | 1 | `chart-bar` |
| 24 | `0.5 0.5 0.5 0.5` | 4 | `grid-3` `grid-4` `more-horizontal` `more-vertical` |
| 20 | `0 0 0.25 0.25` | 11 | the same 11 |
| 20 | `0.25 0 0.25 0.25` | 2 | `list-bullet` `list-bullet-2` |
| 20 | `0.25 0.25 0 0` | 1 | `chart-bar` |
| 20 | `0.25 0.25 0.25 0.25` | 4 | `grid-3` `grid-4` `more-horizontal` `more-vertical` |
| 16 | `0 0 0.375 0.375` | 11 | the same 11 |
| 16 | `0.25 0 0.25 0.25` | 1 | `list-bullet-2` |
| 16 | `0.375 0 0.375 0.375` | 1 | `list-bullet` |
| 16 | `0.25 0.25 0.25 0.25` | 4 | `grid-3` `grid-4` `more-horizontal` `more-vertical` |
| 16 | `0.375 0.375 0 0` | 1 | `chart-bar` |

Every value is half the master's weight step (0.5 · 0.25 · 0.375) — C17's "thicken in place",
plus `minus` (a lone bar), `chart-bar`, `filter-2`, `text-2`, `list-bullet*`.

A grep for `grows:` finds **57** files, not 54: the three `list-bullet-3` **outline** files carry
the phrase "no grows:" inside a long prose comment. Lint's `parseGrowsNote` (`lint.mjs:86`) anchors
on `<!--\s*grows:`, so it does not match, and neither does this census — but a comment that opened
with that phrase would be an error on an outline file (`lint.mjs:222-224`). Checked, not a bug.

**The band lint cannot see.** C10 and C12 say the filled ink box equals the outline's "to 2 dp,
no tolerance". Lint's test is `> 0.01` (`lint.mjs:169`), so anything under it passes silently.
**301 pairs on 142 concepts** sit in the 0.0005–0.01 band; 114 are at or above 0.004. The
population is almost exactly the bent marks: every `chevron-*` (four shapes × four directions ×
three sizes), `check-3-small`, `check-4`, `cursor*`, `play*`, `rotate-ccw*`, `attachment-3/-4`,
`bell`/`-2`, `globe`, `language-2`, `link-2`, `megaphone-2/-3`, `message-5`, `package-2`.
By master: 127 at 24, 110 at 20, 64 at 16.

| Band | pairs | reading |
|---|---|---|
| exactly 0 on all four sides | 1,100 | the rule as written |
| 0.0005–0.01 (invisible to lint) | 301 | rounding residue from bent-mark trigonometry |
| > 0.01, declared | 54 | agreed growth |
| > 0.01, undeclared | 0 | — |

Largest in the invisible band: 0.005 (`attachment-3`, `attachment-4` at 24 and 20) — 0.005px at
a 24px render. **Not a defect; a mis-stated rule.** "No tolerance" is false: there is a 0.01
tolerance and 21% of the set uses it.

---

## 2. Angles — the same line, drawn twice

8,891 filled straight edges matched to the outline centreline they offset.

| Deviation | readings | pairs | concepts |
|---|---|---|---|
| > 0.1° | **518** | 199 | **128** |
| > 0.5° | 223 | 103 | 72 |
| > 1° | 107 | 51 | 32 |
| > 2° | 34 | 16 | 13 |

By class (readings > 0.1°): line-heavy 261 · shape-only 225 · shape+line 32.
By master: 24 → 172 · 20 → 160 · 16 → 186.

### 2.1 What the deviation costs in pixels

A deviation only matters as displacement: `length × sin(deviation)` — how far the filled edge's
far end sits off the parallel through its own start, in that master's units, which is pixels at
that master's own render size.

| Displacement | readings |
|---|---|
| > 0.5 px | **8** |
| > 0.25 px | 11 |
| the other 507 | under 0.25 px |

| px | master | concept | deviation | over |
|---|---|---|---|---|
| **0.742** | 24 | `search` | 7.795° | 5.474 |
| **0.742** | 24 | `search-3` | 5.399° | 7.891 |
| **0.742** | 20 | `search-3` | 7.167° | 5.951 |
| **0.667** | 24 | `code` | 2.388° | 16.008 |
| **0.501** | 16 | `code` | 2.785° | 10.308 |
| 0.495 | 16 | `search-3` | 5.332° | 5.326 |
| 0.324 | 20 | `code` | 1.484° | 12.5 |
| 0.236 | 24 | `chevron-{down,up,left,right}-2` | 2.104° | 6.416 |
| 0.231 | 24 | `chevron-*-2-large` | 1.611° | 8.211 |
| 0.227 | 24 | `chevron-*-2-small`, `chevrons-up-down-3/-4` | 2.813° | 4.623 |

### 2.2 The bent-mark leg angle — C10 / C12, measured

411 line-heavy pairs have the same segment structure in both styles and a leg long enough to read
(≥ 1.5 units, scaled by master). The leg angle is held to 0.01° in **230**; it moves in **181
pairs on 93 concepts**.

| threshold | pairs | concepts |
|---|---|---|
| > 0.01° | 181 | 93 |
| > 0.1° | 125 | 81 |
| > 0.5° | 82 | 56 |
| > 1° | 35 | 19 |
| > 2° | 12 | 11 |

**Chevrons** (40 concepts, 120 pairs) — C12 says the filled bend grows "until the angle is exact":

| master | held to 0.01° | worst | mean worst | filled weight step |
|---|---|---|---|---|
| 24 | **8 / 40** | 2.813° | 0.818° | +1.0 |
| 20 | **14 / 40** | 0.667° | 0.227° | +0.5 |
| 16 | **0 / 40** | 1.957° | 0.833° | +0.75 |

By shape variant, maximum deviation:

| variant | 24 | 20 | 16 |
|---|---|---|---|
| classic (unnumbered) | 0.068° | 0.054° | **0.651°** |
| `-2` flat | **2.813°** | 0.667° | **1.957°** |
| `-3` steep | **2.813°** | 0.667° | **1.850°** |
| `-4` | 2.813° | 0.667° | 1.850° |

C12's recorded filled bend radii reproduce exactly: classic 1.97 · 1.35 · 1.35 (65/18/16
readings), steep 1.33 · 1.05 · 1.03–1.04, flat at the cap 2.5 · 2 · 2.

**The deviation tracks the weight step, not the shape.** At 20, where the filled style adds 0.5,
the chevron holds its angle in 14 of 40 and never misses by more than 0.67°. At 24, where it adds
1.0, it holds in 8 and misses by up to 2.81°. The mechanism is C12's own: a bend that must grow to
keep a centred corner can only grow to the 2× cap, and how far it must grow is set by how much
weight was added.

**Filled bend radius against C10's floor** (362 readings, line-heavy bends):

| | n |
|---|---|
| exactly at the filled minimum (`FILLED_WEIGHT`/2 = 1.25 · 1 · 1) | 199 |
| between the minimum and 2× it | 160 |
| above the 2× cap | **3** — `rotate-ccw-10` at r4.5 · 3.75 · 2.875 |
| below the minimum | **0** |

### 2.3 A filled edge with no outline counterpart

**202 filled straight edges ≥ 1 unit long, on 44 concepts**, are parallel to no outline
centreline — the filled drawing draws a line the outline does not. By class: shape-only 121 ·
shape+line 75 · line-heavy 6.

`attachment-2` `attachment-4` `bold` `bug` `bug-2` `building-4` `clipboard-2` `compass-3`
`compose` `compose-2` `compose-3` `compose-4` `export` `external-link` `external-link-2`
`files-2` `files-4` `images-4` `language` `lightbulb-3` `lightbulb-4` `rotate-ccw-11` `search`
`search-2` `sort-alpha-ascending`/`-2`/`-3` and `-descending`/`-2`/`-3` `store` `store-2`
`trash-5` `user-3` `user-4` `users-3`(+`-behind`,`-level`,`-wide`)
`users-4`(+`-behind`,`-level`,`-wide`) `wallet-3`.

Most are the straight edge that closes an open outline shoulder (`users-*`, `user-3/4`) or a
filled nib's chamfer (`compose*`) — §5's business. `search` is not; see §5.4.

---

## 3. Corner radii — the derived relation, and where it fails

A filled contour is the outline centreline offset by half the **outline** stroke: outward at an
outer corner (`radius + half`), inward at a notch (`radius − half`). Central follows this exactly,
confirmed at four radius values in reconnaissance (`plans/set-and-rules-audit.md:210-218`).

5,262 filleted corners read in filled files — **4,531 of them on area paths lint cannot see** —
731 on strokes. 2,969 area corners matched an outline corner.

| | n | share |
|---|---|---|
| Land on a derived value to 0.01 | **2,778** | **94%** |
| 24 | 957 / 996 | 96% |
| 20 | 942 / 972 | 97% |
| 16 | **879 / 1,001** | **88%** |
| Land on neither | **191 corners, 63 concepts** | 6% |

Outer offset in 2,579 cases, inner in 390.

### 3.1 The 1.5-era offset left behind at 16 — the biggest group

docs/09:45 records this on `folder` and notes that 43 of the 117 shape-filled files at 16 "were
not all checked". Checked now. **At 16, 97 corners on 37 concepts still offset by 0.75 — the
half-stroke of the retired 1.5 line — instead of 0.625.**

| delta | corners | concepts | what it is | names |
|---|---|---|---|---|
| **+0.125** (outer) | 69 | 23 | the container corner: 2.25 drawn where 1.5 + 0.625 = 2.125 is derived | `archive` `calendar` `calendar-2` `calendar-3` `credit-card` `credit-card-2` `credit-card-3` `file` `file-text` `file-text-2` `files` `files-2` `files-3` `files-4` `files-5` `folder` `folder-2` `folder-3` `image-2` `mail` `mail-2` `mail-3` `thumbs-up` |
| **−0.125** (inner) | 13 | 12 | the same thing on a notch: 0.75 drawn where 1.5 − 0.625 = 0.875 is derived | `file` `file-text` `file-text-2` `files-4` `folder` `image` `image-2` `image-3` `images` `images-2` `images-3` `images-4` |
| **+0.25** (outer, through a 1.5 cut) | 15 | 12 | the knocked-out mark's elbow: a 1.5-wide cut derives 0.625 + 0.75 = 1.375; 1.5 is drawn | `check-circle` `-3` `-3-small` `-4` `-4-small` `-small` `checkbox` `-2` `-3` `-4` `compass-3` `presentation-2` |

The `+0.25` group is the same left-behind through a different lens: the cut is 1.5 wide (the
2026-09-28 ruling), so its own corners derive from half of 1.5 on top of the outline's 0.625 bend
— 1.375. They are drawn at 1.5. docs/09:45's own figure (0.05 units of curve deviation at the
middle of each corner) is the visible consequence of a 0.125 radius difference and is consistent
with it.

**Maruti ruled "leave it" on 2026-09-20 when the number was unknown** (docs/09:45). The number is
now known: 37 concepts, 97 corners, 16 master only. The ruling stands as recorded; this is simply
the population it covers. Not relitigated.

### 3.2 The rest of the 191

| delta | master | corners | concepts | verdict |
|---|---|---|---|---|
| **−0.75 / −0.75 / −0.625** | 24 / 20 / 16 | 54 | `arrow-down-4` `arrow-left-4` `arrow-right-4` `arrow-up-4` `arrow-up-right-4` `sparkle-2` `sparkle-3` | **not a break.** These filled files draw the shape **twice** — once as an area and once as a stroke at the outline weight. The area is the inner fill; the stroke carries the outer contour, so the area's radius equals the outline centreline's with no offset. A second construction, not a defect (§5.3) |
| −0.25 (inner) | 24 | 10 | `archive` `help-4` `thumbs-up` | one-off; needs eyes |
| −0.12 (inner) | 20 | 3 | `help-4` | one-off |
| −0.25 (inner) | 16 | 2 | `copy` `copy-2` | one-off |
| +0.5 / +0.25 / +0.5 | 24 / 20 / 16 | 6 | `info-2` `info-3` | one-off; the flag's own corner, not derived from the stem |
| +1.5 | 24, 20, 16 | 5 | `copy-2` `copy-3` | **matcher artifact.** The r4.75 corner is the back sheet's inner wrap, derived from the front sheet's outer 3.25 plus the 1.5 separation, not from its own centreline. Excluded |
| −0.074 | 24, 20 | 4 | `shield` `shield-2` | free curve; under 0.1 |
| −0.025 · −0.013 · ±0.011–0.022 | mixed | 7 | `heart` `star` `map-pin` `map-pin-3` `play-2` `play-3` `wand-2` | free-curve fitting residue; under 0.03 |

### 3.3 The corner vocabulary only the filled style has

**1,387 filled contour corners on 125 concepts have no outline counterpart at all** — roundings
belonging to the filled shape alone. The vocabulary, by frequency:

| radius | n (24 · 20 · 16) |
|---|---|
| **0.5** | 188 · 187 · 174 |
| 0.625 | — · — · 114 |
| 0.75 | 94 · 89 · — |
| 0.25 | 24 · 24 · 28 |
| 2.25 / 2.75 / 2.125 | 32 · 30 · 30 |
| 3.25 / 1.5 / 1.625 | 29 · 31 · 19 |

Heaviest users: `table` ×60 · `grid-2` ×36 · `table-2` ×36 · `package` ×30 · `wand-2` ×27 ·
`grid-6` ×24 · `layout-header` ×24 · `sparkle-3` ×21.

**0.5 is the dominant value and no rule names it.** C23 names r0.25 for `file`'s flap tips and
"the 0.5 nick where `file`'s notch meets its top edge" — as a record of one icon. It is in fact
the set's standard filled-only corner, used 549 times.

---

## 4. Knockouts and cuts

### 4.1 What lint sees — `facingGap` on the filled drawings

1,029 exact readings, the narrowest span of each kind per file:

| kind | n | distribution (1/8 buckets) |
|---|---|---|
| **cut** (across one cut-out) | 346 | 0.875×12 · 1×12 · 1.25×6 · **1.5×150** · 1.75×54 · 2×60 · 2.375×1 · 2.5×18 · 2.625×1 · 2.75×1 · 3×23 · 3.25×1 · 3.5×1 · 4×6 |
| **separation** (between two filled edges) | 367 | 1.25×1 · **1.5×312** · 1.625×6 · 1.75×2 · 1.875×2 · 2×11 · 2.25×2 · 2.375×1 · 2.5×14 · 2.625×3 · 3×9 · 3.25×1 · 3.5×1 · 3.625×1 · 3.875×1 |
| **notch** (in the outer edge) | 72 | 1.5×28 · 1.625×5 · 1.75×13 · 2×15 · 2.5×2 · 3×8 · 3.5×1 |
| **line** (shape to line) | 244 | 0.375×1 · 0.75×2 · 1×12 · 1.5×74 · 1.625×26 · 1.75×25 · 1.875×5 · 2×21 · 2.25×2 · 2.5×25 · 2.75×15 · 3×4 · 3.25×6 · 3.375×3 · 3.5×12 · 3.625×2 · 3.75×4 · 3.875×4 · 4×1 |

Everything under 1.5 is declared or already known: `volume-off` at 0.39 · 0.72 · 0.80 (`gap:`
0.375 / 0.7 / 0.75, the agreed C28 exception), the 12 `sort-alpha-*` / `sort-numeric-*` concepts
(the 60 warnings `plans/sort-family.md` calls expected), and `database-2` at 1.48 (`gap: 1.48`).
**No undeclared sub-1.5 reading that lint can see.**

### 4.2 What lint cannot see — enclosed counters under 1.5

Measured by C23's own measure, the largest circle that fits inside. **757 enclosed white regions
in 474 filled files across 161 concepts** (275 at 24 · 247 at 20 · 235 at 16); 658 are 3 units or
narrower, 99 wider.

facingGap deliberately does not read a wedge whose walls open by more than about 2 × ARRIVE, nor
two sharp corners facing each other (`geometry.mjs:505-512`) — so a triangular counter stays "the
drawer's to measure". **Nine concepts have one under 1.5 and nothing in the build measures it:**

| width | master | concept | footprint | `gap:` note |
|---|---|---|---|---|
| **0.384** | 20 | `watch` (×2) | 2.75 × 1.688 | none |
| **0.527** | 16 | `sort-alpha-ascending` `-2` `-3` `-descending` `-2` `-3` | 0.875 × 1.188 | none |
| 0.603 | 20 | the same six | 0.875 × 1.188 | none |
| 0.797 | 24 | the same six | 1.25 × 1.688 | none |
| **0.834** | 16 | `watch` (×2) | 2.25 × 1.875 | none |
| 0.852 / 0.976 / 0.986 | 20 / 24 / 16 | `language` | ≈2.7 × 2.3 | none |
| 1.0 | 20, 16 | `sort-numeric-*` ×6 | 1 × 1 | none |
| 1.188 | 16 | `megaphone-2`, `watch-2` (×2) | 1.5 × 1.75 | none |
| 1.313 / 1.375 | 16 / 20 | `save` | 2 × 1.75 | none |
| 1.375 | 20 | `megaphone-2` | 2 × 2 | none |
| 1.438 | 16 | `bold` | 2.625 × 2.75 | none |

The `sort-*` ones are the known family (their counters are the bowls of A and of the 1/2 glyphs).
**`watch` at 20 is 0.384 — a quarter of the floor, in a drawing nobody has flagged**; `watch`,
`watch-2`, `language`, `megaphone-2`, `save` and `bold` carry no note and raise no warning.

### 4.3 The cut-weight census — the population behind docs/09:42

docs/09:42 names three values — *minus 2.5 · plus/x/glyphs 2 · checks 1.5* — and docs/09 §4 calls
one filled-cut policy one of the five missing rules. The set actually cuts at **ten distinct
widths at 24, seventeen at 20 and sixteen at 16.**

**At 24** (130 files with a cut):

| width | files | examples |
|---|---|---|
| 0.75 | 6 | `sort-alpha-*` |
| 1 | 1 | `language` |
| **1.5** | **98** | `archive` `book-3` `briefcase` `building-2` `calendar-2` `camera`…`camera-6` `cash` `chart-bar-5` `check-circle` `trash` `file` … |
| 1.625 | 2 | `lock-3` `wallet-2` |
| 1.875 | 2 | `building-3` `hash` |
| **2** | **67** | `alert-circle` `alert-triangle` `ban-2` `ban-3` `building` `clock` `face-*` `plus-circle` `x-circle` `info` … |
| 2.125 | 1 | `store-2` |
| 2.25 | 1 | `bold` |
| **2.5** | **33** | `alert-circle-2` `book` `clipboard` `help-2` `minus-circle` … |
| 3 | 20 | `calendar-3` `credit-card-3` `image*` `images*` `key-*` `lock-2` `map-pin-3` `target` `wallet*` |

**At 20**: 0.375 · 0.625 · 0.875 · 1 · 1.375 · **1.5 (81)** · 1.625 · **1.75 (39)** · 1.875 ·
**2 (44)** · 2.125 · 2.25 · 2.375 · 2.5 (14) · 2.75 · 2.875 · 3.
**At 16**: 0.5 · 0.875 · 1 · 1.25 · 1.375 · **1.5 (84)** · **1.75 (52)** · 1.875 · **2 (29)** ·
2.125 · 2.25 · 2.375 · 2.5 · 2.75 · 3.

The three named values are the three modes — 1.5, 2 and 2.5 at 24 account for 198 of 231 readings
— but 33 readings at 24, 38 at 20 and 29 at 16 sit between or beyond them.

**As a multiple of the line the cut replaces:**

| master | ratios |
|---|---|
| 24 | 1.0 ×93 · 1.33 ×62 · 1.67 ×26 · 2.0 ×19 · other ×31 |
| 20 | 1.0 ×81 · 1.33 ×43 · 1.17 ×37 · 1.67 ×14 · other ×42 |
| 16 | **1.2 ×83 · 1.4 ×47 · 1.6 ×27 · 2.2 ×5 · 2.4 ×3** · other ×45 |

At 16 **no cut is thinner than 1.2× the line** — the 2026-09-28 ruling working as intended. At 24
and 20 the modal cut is exactly 1.0× the line, so the same decision reads differently per master:
*a cut is one line wide* at 24 and 20, *a cut is 1.2 lines wide* at 16. Both are the same
literal 1.5.

The C22/C18/C23 reference values reproduce exactly: `trash`'s handle counter 1.5 at all three
masters, its ribs 2 · 1.75 · 1.75; `file`'s flap separation 1.5 at all three; `plus-circle` and
`x-circle` 2 · 1.75 · 1.75; `minus-circle` 2.5 · 2 · 2; `check-circle` 1.5 at all three; the whole
`info` family 2 · 1.75 · 1.75.

### 4.4 Filling closes air the outline had

**204 of 1,455 pairs (14%)** have a narrowest air reading in the filled drawing tighter than
anything in their outline twin. Extremes: `24/cash` 4 → 1.5 · `20/sun` 4 → 1.5 ·
`20/users-3-behind` 4 → 1.5 · `20/users-4` 4 → 1.5 · `24/users-behind` 4 → 1.5 ·
`24/users` **3.96 → 1.49** · `16/chart-pie-2` 3.74 → 1.5 · `16/globe-2` 3.74 → 1.52.

`24/users` at 1.49 is 0.01 under the floor and lint's test is `g < GAP − 0.01`, so it does not
warn. Systemic: in this set the gap question is a **filled-style** question, and the outline
almost never binds it.

---

## 5. Is the silhouette the same shape at all?

The outer region `O` = ink ∪ everything the ink encloses. The box check compares two numbers per
side; this compares the whole outline.

| class | pairs | `O` identical (< 0.02 sq units of difference) |
|---|---|---|
| shape-only | 612 | **268 (44%)** |
| shape+line | 414 | **324 (78%)** |
| line-heavy | 429 | **3 (1%)** — by construction; the filled is a heavier line |

**344 shape-filled pairs on 118 concepts differ by ≥ 0.5 square units.** Worst, at 24:

| sq units | concept | outline-only | filled-only | IoU | biggest patch |
|---|---|---|---|---|---|
| 160.7 | `chart-pie` | 15.3 | 145.4 | 0.459 | 18.25 × 18.25 |
| 150.9 | `lightbulb-4` | 0.05 | 150.9 | 0.333 | 13 × 15.5 |
| 141.3 | `lightbulb-3` | 0.05 | 141.3 | 0.375 | 13 × 15.5 |
| **139.9** | `globe-2` / `language-3` | **139.9** | 0 | 0.555 | 20 × 20 |
| 114.8 | `compose-3` | 8.6 | 106.2 | 0.564 | 15.06 × 15.06 |
| 110.0 | `globe` / `language-2` | **110.0** | 0 | 0.650 | 20 × 20 |
| 108.9 | `trash-5` | 0 | 108.9 | 0.507 | 13.1 × 10.5 |
| 101.3 | `external-link` | 0 | 101.3 | 0.505 | 12.06 × 12.06 |
| 86.7 | `user-3` | 0 | 86.7 | 0.576 | 14.1 × 7 |
| **77.4** | `table` | **77.4** | 0 | 0.754 | 18 × 18 |
| **52.3** | `grid-2` / `table-2` | **52.3** | 0 | 0.834 | 18 × 18 |

Two different things are in that list and they must not be confused.

### 5.1 The filled closes the outline's open shape (`filledOnly`)

`users-*`, `user-3`, `user-4`, `lightbulb-3/-4`, `compose*`, `external-link*`, `export`,
`trash-5`. The outline draws an open bowl or shoulder; the filled is a solid, so its outer edge
runs straight across where the outline had two cap ends. The ink box is identical; the outer
contour is not the same curve. **Inherent to the style, not a defect** — but the rule says "the
filled outer edge = the outline outer edge", and here there is no outline outer edge to equal.

### 5.2 The knockout breaks the silhouette into pieces (`outlineOnly`)

| | pairs | concepts |
|---|---|---|
| filled in **more** pieces than the outline | **144** | **51** |
| filled in **fewer** pieces | **228** | **80** |
| same number | 1,083 | — |

More pieces (51): `book-4` `book-open` `briefcase` `bug` `bug-2` `calendar` `chart-bar-4`
`chart-pie-3` `compose`…`compose-4` `desktop-3` `file` `files`…`files-5` `folder-2` `globe`
`globe-2` `grid-2` `grid-6` `images`…`images-4` `language-2` `language-3` `layout-footer`
`layout-header` `layout-sidebar` `layout-sidebar-right` `mail` `mail-2` `mail-3` `package`
`paintbrush` `pencil`…`pencil-4` `puzzle-4` `store` `store-2` `table` `table-2` `thumbs-up`
`thumbs-up-2` `volume-off`. Examples: `table` 1 → 6 · `grid-2` 1 → 4 · `globe` 1 → 9.

Fewer pieces (80): every `alert-circle*` `alert-triangle*` `check-circle*` `checkbox*` `help*`
`info*` `lock*` `building*` `camera*` `gear` `gear-2` `clock` `face-*` `keyboard*` … — filling
welds the container and its mark into one shape.

`table`'s construction, read from the files: the outline is one 18 × 18 rounded rectangle
(r2.5 centreline → 3.25 outer) with two rules through it; `table-filled` is **six separate rounded
tiles** running 3 → 21 on both axes with 1.5 bands between them. The four extreme corners hold
r3.25; the twelve interior corners are r0.5, which the outline never draws. The outer edge is the
same square with four slots cut into it from the sides.

### 5.3 Two constructions for a shape-filled icon, both in the set

| construction | files | concepts |
|---|---|---|
| the area carries the outer contour (offset outward by half a stroke) | 330 | 110 |
| the area is the **inner fill** and the shape is **also** stroked at the outline weight | **15** | **5** — `arrow-down-4` `arrow-left-4` `arrow-right-4` `arrow-up-4` `arrow-up-right-4` |

No rule names the second. It is the cleaner construction — the outer edge is literally the same
path — and it is used in 5 of 115 shape-filled concepts.

### 5.4 A ring kept as a ring, thickened to the filled weight

The Settled rule: in a shape-filled icon "its **strokes stay at the outline weight** — 1.5 at 24
and 20, 1.25 at 16". **Nine concepts thicken a ring to `FILLED_WEIGHT`**, measured as the counter
diameter shrinking by exactly 2 × (`FILLED_WEIGHT` − stroke):

| concept | 24 | 20 | 16 | class |
|---|---|---|---|---|
| `search` | d 12.50 → 10.50 | 9.00 → 8.00 | 8.00 → 6.50 | shape-only |
| `search-2` | 14.00 → 12.00 | 10.00 → 9.00 | 9.00 → 7.50 | shape-only |
| `search-3` | 10.50 → 8.50 | 7.50 → 6.50 | 6.50 → 5.00 | shape-only |
| `database` | 6.98 → 4.96 | — | — | shape-only |
| `database-3` | — | — | 5.61 → 4.09 | shape-only |
| `map-pin-4` | — | 7.10 → 6.00 | — | shape-only |
| `at-sign` | 6.00 → 4.01 | — | — | line-heavy ✓ |
| `at-sign-2` | 7.00 → 5.00 | 5.00 → 4.01 | — | line-heavy ✓ |
| `ban` | 11.35 → 9.41 | 8.51 → 7.54 | 7.54 → 6.12 | line-heavy ✓ |

The three line-heavy ones are correct — a line-heavy file thickens everything. **The six
shape-filled ones are not**: `search-filled`'s lens ring measures 2.5 · 2.0 · 2.0 thick where the
rule says 1.5 · 1.5 · 1.25.

**The approved version of the same question.** `list-bullet-3` does it the other way and says so
in its own file: *"the one candidate whose outline and filled twin differ in kind, an empty ring
against a solid disc"*. Measured: outline bullet is a ring, centreline r1.75, outer 2.5, counter
area 3.172 ×2; the filled bullet is a **solid disc r2.5**. Ink box identical on all four sides at
all three masters, outer region identical (IoU 1.000), `encFil` empty — the counter is gone, not
narrowed. So the set already holds three answers to "what does a ring do when it fills":
fill it solid (`list-bullet-3`, approved and documented), thicken it to `FILLED_WEIGHT` and keep a
smaller counter (`search` ×3, `database` ×2, `map-pin-4` — undocumented), or thicken it as a
line-heavy icon (`ban`, `at-sign` ×2 — correct by the rule). **No rule chooses between them.**

C22 states the opposite of what the file does: *"the same way `search-filled` punches the lens
counter at the outline's inner radius"*. The outline's inner radius at 24 is 7.0 − 0.75 = **6.25**;
`src/icons/24/search-filled.svg` punches at **5.25**. The cut is one unit tighter than C22's own
description, at all three masters, and the number it actually follows is `outer − FILLED_WEIGHT`.

**And `search`'s handle is not a parallel bar.** From the path data at 24: the outline handle is a
uniform 1.5 stroke on a 45° centreline; the filled handle is **1.980 wide at the lens end** (the
A1 arc's chord between 14.55,15.95 and 15.95,14.55) **widening to 3.5 at the tip** (an r1.75 round
end). That is 1.32× to **2.33×** the outline's line width, and it is why `search`'s filled edges
measure 7.795° off the 45° they offset — the largest angle divergence in the set (§2.1). The ink
box is identical to 0.001 on all four sides, so nothing in the build notices.

### 5.5 How much darker is the filled drawing?

Ink area as a multiple of the outline's:

| master | class | n | min | median | max |
|---|---|---|---|---|---|
| 24 | shape-only | 204 | **0.954** | 2.115 | 3.630 |
| 24 | shape+line | 138 | 1.000 | 1.650 | 3.002 |
| 24 | line-heavy | 143 | 1.228 | 1.556 | 1.789 |
| 20 | shape-only | 204 | **0.747** | 1.704 | 2.965 |
| 20 | shape+line | 138 | 1.000 | 1.406 | 2.384 |
| 20 | line-heavy | 143 | 1.009 | 1.283 | 1.406 |
| 16 | shape-only | 204 | **0.710** | 1.747 | 3.096 |
| 16 | shape+line | 138 | 1.000 | 1.420 | 2.399 |
| 16 | line-heavy | 143 | 1.188 | 1.486 | 1.665 |

**Eight filled drawings carry LESS ink than their outline twin:**

| concept | 24 | 20 | 16 |
|---|---|---|---|
| `globe` / `language-2` | 1.271 | **1.010** | **0.982** |
| `globe-2` / `language-3` | **0.954** | **0.747** | **0.710** |

`globe-2-filled` at 16 has **29% less ink than `globe-2`**. Its outline has four counters; its
filled twin has **none** — every meridian and the equator are cut edge to edge, so the disc
becomes nine separate pieces with no enclosed white left. A filled icon lighter than its outline
inverts the one thing the style is for.

### 5.6 `ban` and `ban-2`

Confirmed from the files: **`src/icons/24/ban.svg` and `src/icons/24/ban-2.svg` are the same two
paths with the same values** — identical drawings under two names (docs/09 §3 lists this under
risks). Their filled twins are not merely different, they are different *classes*:

| | `ban-filled` | `ban-2-filled` |
|---|---|---|
| construction | line-heavy: ring + bar both at 2.5 · 2 · 2 | shape-filled: solid disc, slash punched at 2.0 · 1.75 · 1.75 |
| outline ink (24) | 111.98 | 111.98 |
| filled ink (24) | **175.13** (1.564×) | **281.26** (2.512×) |
| enclosed white (24) | 69.57 ×2 | 33.01 |
| outer region vs its outline | identical (IoU 1.000) | identical (IoU 1.000) |

`ban-filled` is the only filled circle in the set that is not solid — its own file comment says so
and names the cost. Two concepts, one outline drawing, filled twins 61% apart in ink.

### 5.7 Path counts

| filled minus outline | pairs |
|---|---|
| 0 | 996 |
| −1 | 229 |
| −2 | 140 |
| −3 | 38 |
| +1 | 30 |
| −5 or fewer | 19 |
| +2 | 3 |

**459 of 1,455 pairs have a different number of paths.** Extremes: `24/gear-3` 19 → 1 area +
3 strokes · `24/building` 11 → 1 area · `24/building-4` 13 → 2 areas + 1 stroke ·
`24/building-3` 13 → 1 area + 4 strokes · `24/keyboard` 7 → 1 area. The filled file never gains
more than 2 and loses up to 15 — the Fluent pattern inverted: there a *modifier* cuts the base
back; here the *style* collapses it.

**8 filled files are byte-identical in path data to their outline twin**, only the root weight
differing: `grid-3`, `grid-4`, `more-horizontal`, `more-vertical` at 24 and 20. At 16 they diverge
(C17 thickening in place).

---

## 6. The judgement — where does outer-edge equality cost the drawing?

The reference evidence said diagonal-ended marks are where every set struggles: Central holds an
identical outer ink box in 334 of 390 pairs but abandons it on `cross-large` in all 15, by up to
0.91, because the filled X is cut horizontally. **Tested directly, and that is where ours breaks
too — but not in the box. In the angle.**

Our box holds: 1,100 of 1,455 pairs exactly, 54 declared, 0 undeclared. What gives instead is the
**leg angle of a bent mark**, and it gives in proportion to how much weight the filled style adds:

| master | weight step | chevrons holding the angle | worst |
|---|---|---|---|
| 20 | **+0.5** | 14 / 40 | 0.667° |
| 16 | +0.75 | **0 / 40** | 1.957° |
| 24 | **+1.0** | 8 / 40 | **2.813°** |

Fluent's filled is **+0.5 at every size** (confirmed from their own source table in
reconnaissance); ours is **+1.0 at 24, +0.5 at 20, +0.75 at 16**. docs/08 §6.2 lists that gap as
open. This is the measurement that bears on it: **+0.5 is the step at which a bent mark can keep
both its box and its angle**, and 20 is the proof inside our own set.

The cost in pixels is small — 0.236px at 24 for the flat chevron, 0.157px at 16, and the whole set
has **8 readings over half a pixel** (three `search` / `search-3` edges at 0.74, `code` at 0.67
and 0.50, `search-3` at 0.50). So:

**Zero tolerance is the right rule, and we are keeping it.** It is not what is hurting the
drawings. Three other things are, and none of them is the box:

1. **The rule is mis-stated, not broken.** "Equal to 2 dp, no tolerance" is in fact a 0.01
   tolerance that 301 pairs use. Say 0.01 and mean it.
2. **The rule is too narrow.** It constrains two numbers per side and nothing else, so a filled
   drawing can keep the box exactly while thickening a ring by a whole unit (`search` and five
   others), tapering a 45° bar from 1.98 to 3.5 (`search`), or coming out lighter than its outline
   (`globe-2` at 16, −29%). All three pass today.
3. **One situation genuinely wants a named relaxation, and it is not a mark.** A knockout that runs
   edge to edge separates the silhouette, so "the filled outer edge = the outline outer edge" is
   already false for 51 concepts by construction — `table` goes from one piece to six. That is
   C23's separation rule working. The outer-edge rule should say so rather than being quietly
   contradicted 144 times.

---

## 7. The judged list

**(1) A drawing disagrees with a stated rule.**

| # | Finding | Measured | Tag |
|---|---|---|---|
| 1.1 | Six shape-filled concepts thicken a ring to `FILLED_WEIGHT` where the rule says strokes keep the outline weight | `search` `search-2` `search-3` `database` `database-3` `map-pin-4`; `search`'s lens wall 2.5 · 2.0 · 2.0 against 1.5 · 1.5 · 1.25 | **systemic** — a whole construction with no rule |
| 1.2 | `search`'s filled handle is a taper, not a bar | 1.980 at the lens end → 3.5 at the tip against a uniform 1.5 outline; edges 7.795° / 5.399° / 7.167° / 5.332° off the 45° they offset — the largest angle divergence in the set | **one-off** (the `search` family, 3 concepts) |
| 1.3 | Nine concepts hold an enclosed counter under 1.5 in the filled drawing, undeclared and unwarned | `watch` 0.384 at 20 · `watch` 0.834 at 16 · `watch-2` 1.188 · `language` 0.852–0.986 · `megaphone-2` 1.188 / 1.375 · `save` 1.313 / 1.375 · `bold` 1.438 · the six `sort-alpha-*` 0.527–0.797 | **systemic** — facingGap cannot read a wedge counter by design (`geometry.mjs:505-512`), so C23's measure is nobody's job |
| 1.4 | `rotate-ccw-10`'s filled bend exceeds C12's 2× cap | r4.5 · 3.75 · 2.875 against a cap of 2.5 · 2 · 2 | **one-off** |
| 1.5 | Two filled drawings are lighter than their outline | `globe-2` / `language-3` 0.954 · 0.747 · **0.710**; `globe` / `language-2` 1.010 at 20, 0.982 at 16 | **one-off in count, systemic in cause** — no rule says a filled drawing must be heavier |

**(2) A rule disagrees with another rule or with the docs.**

| # | Finding | Measured | Tag |
|---|---|---|---|
| 2.1 | C12: the flat chevron's filled legs sit "up to ~3° flatter at 24, **under 1° at 20 and 16**". At 16 it is **1.957°** (`chevron-*-2`) and 1.850° (`-2-small`, `-3`, `chevrons-up-down-3/-4`) | the doc is wrong at 16 by ~2×; written before the C7 conversion | **systemic** (40 chevron concepts) |
| 2.2 | C12: "the filled bend grows until the angle is exact." Exact in 8 of 40 chevrons at 24, 14 at 20 and **0 at 16** | §2.2 | **systemic** |
| 2.3 | C22: "`search-filled` punches the lens counter at the outline's inner radius." The outline's inner radius at 24 is 6.25; the file punches 5.25 | one unit out, all three masters | **one-off statement, systemic consequence** |
| 2.4 | C10/C12: filled box = outline box "to 2 dp, no tolerance." Lint's test is > 0.01 and **301 pairs on 142 concepts** live in that band | largest 0.005 | **systemic** |
| 2.5 | The outer-edge rule and C23's separation rule contradict each other for any cut that runs edge to edge | filled in more pieces in 144 pairs / 51 concepts, fewer in 228 / 80; `table` 1→6, `grid-2` 1→4, `globe` 1→9 | **systemic** |
| 2.6 | `CLAUDE.md:279-280` `grows:` "none yet noted" — actual 54 files, 18 concepts, 13 distinct strings, all matching their drawings | §1 | **systemic doc staleness** (hand to card 1.16) |
| 2.7 | docs/09:42's three cut weights are three modes of a ten-value vocabulary at 24 (17 at 20, 16 at 16) | §4.3 | **systemic — this is the population the ruling needs** |
| 2.8 | The same literal 1.5 cut means "one line wide" at 24 and 20 and "1.2 lines wide" at 16 | modal ratio 1.0 at 24/20, 1.2 at 16 | **systemic** |
| 2.9 | No rule names the filled style's own corner vocabulary. 1,387 filled corners on 125 concepts have no outline counterpart; r0.5 is used **549** times and C23 records it as a feature of one icon | §3.3 | **systemic** |
| 2.11 | Three answers coexist for "what does a ring do when it fills" — solid disc (`list-bullet-3`, documented), thickened to `FILLED_WEIGHT` with a smaller counter (`search` ×3, `database` ×2, `map-pin-4`, undocumented), or line-heavy (`ban`, `at-sign` ×2, correct). Nothing chooses | §5.4 | **systemic** |
| 2.10 | No rule names the "fill the shape **and** keep its stroke" construction | `arrow-*-4`, 5 concepts / 15 files | **one-off today, a choice tomorrow** |

**(3) Fine by every rule, still wrong.**

| # | Finding | Measured | Tag |
|---|---|---|---|
| 3.1 | `ban` and `ban-2` are byte-identical outline drawings whose filled twins differ by **61% of ink** (175.13 vs 281.26 at 24) and by construction class | both IoU 1.000 against their outline | **one-off, and it ships** |
| 3.2 | `globe-2-filled` at 16 has 29% less ink than its outline and **zero** enclosed white where the outline has four counters | §5.5 | **one-off** |
| 3.3 | Filling closes air in 204 pairs (14%); `24/users` lands at 1.49, exactly 0.01 inside lint's threshold | §4.4 | **systemic** |
| 3.4 | `check-circle`'s 1.5 cut is still the lightest cut in the set and still swaps in place with `x-circle`'s 2.0 — docs/09:19's reword is unactioned at 485 icons | 1.5 against 1.75–2 on the swap partner, all three masters | **systemic** |

**On record, not reopened.** The 16 filled corners left at the 1.5-era offset (§3.1) — Maruti
ruled "leave it", 2026-09-20, docs/09:45. The population is now measured: **97 corners on 37
concepts**, not the one icon it was found on. `ban` filled rim-to-rim, a third filled style,
re-centring the 16 filled cut-outs and fixing the 16 corners on one icon are all rejected
(docs/08 §8, docs/09:45) and are not revisited here.

---

## 8. What only Maruti's eye can settle, and on what surface

1. **Is the filled weight step right at 24?** +1.0 is what bends the flat chevron's leg 2.81°
   (0.236px). The alternative is +0.5 everywhere, which is Fluent's and is the step at which our
   own 20 master holds its angles. A **four-icon look**: `chevron-down-2`, `chevron-down-3`,
   `check`, `arrow-down` at 24 and 48, outline beside filled at both weight steps. Surface: the
   Compare tab's Style dropdown; a one-row sheet would settle it.
2. **`search` — is the heavy lens and the swelling handle the drawing you want?** The ring is a
   whole unit thicker than the rule and the handle reaches 2.33× the line. It may well be the
   better drawing (a 1.5 ring on a filled magnifier reads as an outline icon); it is simply not
   what any rule says. Surface: `search`, `search-2`, `search-3` in the Library's At 16 strip
   beside `plus-circle-filled` and `ban-filled`.
3. **Should a filled drawing ever be lighter than its outline?** `globe-2` at 16 is 29% lighter.
   Surface: the wall (card 4.1) sorted by ink mass, filled row with the outline row above it.
4. **`ban` / `ban-2`.** One outline drawing, two names, two filled constructions 61% apart in ink.
   Either the outlines must differ or one name goes. Surface: the family sheet at 16.
5. **One cut-weight policy, with the ten-value vocabulary in front of you.** §4.3 is the population
   docs/09 §4 has been waiting for. The question is whether the rule reads *a cut is 1.5 / 2 / 2.5
   by role* or *a cut is one line wide, floored at 1.5* — the second is what the set actually does
   at 24 and 20 and cannot do at 16.
6. **Does the outer-edge rule bind a knockout that separates the shape?** `table` goes from one
   piece to six. If it does not, the rule needs a named exception; if it does, `table-filled` is
   wrong. Surface: the exceptions sheet (card 4.3).
