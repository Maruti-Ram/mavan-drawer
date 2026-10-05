# Findings — families and completeness

Audit card **1.10** (`plans/set-and-rules-audit.md:496`). Axes **F3** (one object, one drawing — the numbered
families), **F5** (a grammar for combination — the figure and level families) and **F6** (behaviour across
sizes — the C8 step, and the styles × sizes grid). One question runs under all of them: *when the set says two
icons belong together — by a number, a size word, a figure, a level — does the drawing keep the promise?*

**Pinned tree: `5933041`.** `git diff --quiet 5933041 HEAD -- src/icons` was true and `git status --short src/icons`
empty before the first measurement and after the last; every figure was measured in a `git archive` copy of the pin in
scratch. Nothing in `src/icons/`, `tools/` (outside `tools/audit/`), `lab/`, `research/`, docs 01–09, `CLAUDE.md` or the
plan was touched. Four files are new: this document, `tools/audit/families.mjs`, `tools/audit/families.test.mjs` and
`tools/audit/families-mutations.mjs`. The gate is at the end (§12).

**The headline, in plain words.** The sizes are the best-kept thing in the set; the names are where the slips are.
The 19 mark families hold C8's step — 3 · 2.5 · 2 — to the thousandth, outline and filled, at all three masters
(114 of 114 cells, 204 steps, none off by more than 0.000); the six container families keep their ring (36 of 36
comparisons), which is what C18 asks of them instead of a step; and lint reads the same sizes (390 files, no difference,
no warning). Numbering is clean as well: 107 numbered runs, every one `1…k` with no hole
except `trash` (2 · 3 · 4) and `check-circle` (2), which the docs record as waiting for a ruling. What the eye will not
see, but a customer's search and the day of launch will: **`checkbox`'s numbers are not the check's numbers** — the same
tick is `check-circle-3` in a ring and `checkbox-2` in a box, six days after the commit that said "numbers follow the
check"; **23 concepts whose search words stand against C9's style word** — they cannot tell a variant from its sibling, or
say the wrong thing (a descending sort tagged "ascending") — and four more that lack their group's words; and **C27 still
lists `users-heads`**, dropped 53 seconds after the commit that wrote C27. The sentence the sort plan left behind — *"no
family in this set keeps one ink box"* — is true of the five families it measured and **false of the set**: 51 of the 107
runs keep one box exactly at all three masters, 53 within lint's own ±0.01 (the 53 card 1.16 counted at 24). The one place
the sizes deserve a look is C18, not C8: a container's `-small` steps its mark by only **0.5** at 20 and 16 for `x-circle`,
against the 1.0 of the `info-small` that C18 retired as "a single pixel".

---

## 0. Method, and how to read a number

**Instruments.** `tools/audit/families.mjs` (new; audit-only — nothing in lint or build imports it) takes ink boxes from
`metrics-check.mjs` (card 1.12: `readSvg`, `inkBoxOf`, `segBox`, `polylines`), shapes from `congruence.mjs` `canonical`, and
`SIZE_STEP` / `MASTERS` from **the pin's own `tools/masters.mjs`** (`loadSpec`; it equals the working tree's today, which
`census` prints), all read-only. For *what lint says* it imports **the pin's own**
`tools/lint.mjs` (`lintSource`, `checkFamilies`), so a lint reading is the lint that shipped at the pin. The plan's known
defects are avoided: boxes are the solved box, not `geometry.mjs bbox()` (which can sit 0.0056 inside an arc edge — the
long sides measured here end on path vertices, so lint's sampled box and the solved one agree to 0.000, §2.3); ring and
tick comparisons use `canonical().shape` / `.key`, not `congruentUpToTranslation`; `raster.mjs` is not used. The
exploration scripts live in the session scratchpad and are in no repository; every figure below was then reprinted by the
committed tool (§12). The tests build synthetic sets and, where they need the pin, `git archive` it into a temporary
directory.

**What the tests would notice.** `tools/audit/families-mutations.mjs` (new; audit-only) breaks the tool on purpose, one change
at a time, in a temporary copy, and runs the suite against each break — a step's sign, the small step, the large step, the
spec, the long side, the folding rule, whole-icon identity, the figures page's naming, the antonym check, the keyline tolerance
(0.45 · 0.51 · 0.6), the two box definitions, the outside-in test, the container comparison, the lint reading, the turn distance
… It prints **55 breaks, 54 of which fail the suite**. The one that survives — the gap loop stopping a number early — is
equivalent: the last number of a run is always present, so no test could tell. That is what the breaks show, not a promise that
every conceivable break is caught. The fresh reviewer's own 22 breaks found three the first version let through — two on the
small step (`devSmall` forced to 0, `stepSmall` set to the wanted step: the C8 test bent only `plus-large`, so a tool that stopped
measuring the small would still have printed 0.000) and a keyline tolerance of 0.6 that passed by a float boundary — and all three
are now caught.

**What the words mean here.**

| term | meaning |
|---|---|
| concept | one name, drawn as six files (3 masters × outline, filled): 485 concepts, 2,910 files |
| stem | the name with its size and its number taken off: `check-circle-3-small` → `check-circle`; 159 stems |
| run | one stem and the numbers it ships **at the default size**: `chevron-down`, `-2`, `-3`. A run needs two or more. A size is not a shape, so `-small` / `-large` stay out of a run |
| ink box | strokes grown by half their width, filled areas as drawn, arc extremes solved exactly; printed to 3 dp |
| size | the **long side** of the ink box — what lint reads at `tools/lint.mjs:316-317` |
| step | the default's size minus its `-small`'s, and its `-large`'s minus the default's. C8 asks for `SIZE_STEP` = 3 · 2.5 · 2 at 24 · 20 · 16 (`tools/masters.mjs:52`), 12.5% of the canvas |
| twin | the Library's word (`lab/library.html:317-335`): two names whose **outline** files are the same drawing at all three masters |
| own word | a tag a numbered shape has and its default does not — what C9 calls its *style word* (`docs/07-character.md:49`) |
| same tags | two members of one run whose tag sets are equal, in any word order |
| dashed cell | what `lab/figures.html` draws when a name neither ships nor sits on a board (`lab/figures.html:66, 179-183`) |

**The partition, and where this card departs from the grammar card's.** Card 1.9 §2.1 counted 125 stems — 105 families
and 20 singletons — 9 mark families and **96 object families of 378 concepts** (`findings-grammar.md:367-383`), and does
not write the rule; its script is in no repository. It is **reconstructed from the card's own tables**: strip the size,
then the number; then fold the four directions of `arrow` and `chevron` (not `arrow-up-right`), the circles of `plus`,
`minus` and `x` into their marks (not `check-circle`), `sort-ascending|descending` into `sort` and
`sort-alpha|numeric-…` into `sort-alpha|numeric`, `users-[n]-[word]` into `users`, `volume-*` into `volume`, `face-*` into
`face` and `menu-arrow-left|right` into `menu-arrow`. That gives 159 stems before folding and **125 after — 105 families,
20 singletons, 9 mark families of 87 concepts, 96 object families of 378 concepts — and reproduces all 105 families the
card names, each with its member count** (`census`; the test holds the tool to the card's table). Three departures, each
for a reason:

1. **Runs are not folded.** A run is one stem's own numbers: `chevron-up`, `chevron-down`, `chevron-left` and
   `chevron-right` are four runs of three, not one family of 36, because §1 asks what number *n* means inside one object.
   Whether it means the same across the directions is measured on its own (§1.4). 107 runs.
2. **`plus-circle`, `minus-circle` and `x-circle` stand alone in §2 and §6.** The grammar card folds them into their marks
   but leaves `check-circle` alone. C18 treats a container's sizes as their own family (the ring is the icon's footprint),
   and a mark folded with its ring shows four boxes for the wrong reason. That is 128 stems, 108 families of two or more.
3. **§6's unit is the run at the default size** — the unit the sentence being re-measured used ("across its own
   variants", `plans/sort-family.md:9`). Sizes (C8, C18), arrangement words (C27), levels (C28) and layout regions (C29)
   are measured as the kinds they are, and §6 also gives the answer over both folded partitions, so wave 5 can set it beside
   card 1.9's and card 1.16's.

**Three kinds, never mixed in a line.** (1) a drawing disagrees with a stated rule · (2) a rule disagrees with another rule
or the docs · (3) a drawing is fine by every rule and still questionable, and no rule covers it.

**What I could not measure** (`[needs measuring]`): what a style word *means* across runs (*flat*, *wide*); whether a
container's small reads as a smaller size at 16 (the eye's, §8); the commit hashes and messages cited (`d19ec13`, `fb444bc`,
`0e63335`, `279ff1c`) are read from `git log` / `git show`, which the pin has no history for and the tool therefore cannot reprint.
Card 1.16's 53 of 107 (§6, §10) is reproduced — it is definition B of §6.

---

## 1. Numbered families

### 1.1 The runs — 107 of them, one with eleven numbers

A customer who types `chevron-down-2` is promised a different drawing from `chevron-down`. 107 stems keep that promise
286 times: the 286 numbered shapes are **59.0% of the 485 concepts**, and the 107 runs hold 393 concepts. The other 92 are 40
unnumbered names that belong to no run, 40 sized names and 12 figure-arrangement names (§4).

| members in the run | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 11 |
|---|---|---|---|---|---|---|---|---|
| runs | 17 | 40 | 31 | 9 | 5 | 3 | 1 | 1 |

88 runs have four members or fewer; 19 have five or more. Every run, by length (`runs`):

- **2:** at-sign · book-open · bug · code · external-link · file-text · globe · heart · keyboard · presentation · printer · shield · store · table · thumbs-up · toggle-on · trash
- **3:** ban · bell · calendar · chart-pie · check-circle · chevron-down · chevron-left · chevron-right · chevron-up · compass · copy · credit-card · cursor · database · folder · gear · hash · home · image · info · language · link · list-bullet · mail · megaphone · package · play · refresh · search · sort · sort-alpha-ascending · sort-alpha-descending · sort-numeric-ascending · sort-numeric-descending · target · upload · wallet · wand · watch · wrench
- **4:** alert-circle · alert-triangle · arrow-down · arrow-left · arrow-right · arrow-up · attachment · book · building · check · checkbox · chevrons-up-down · clipboard · compose · filter · flag · help · images · layout-footer · layout-header · layout-sidebar · layout-sidebar-right · lightbulb · login · logout · menu · pencil · sparkle · text · user · users
- **5:** arrow-up-right · cart · chart-bar · files · map-pin · maximize · microphone · puzzle · sliders
- **6:** camera · desktop · key · lock · pin
- **7:** grid · message · plug
- **8:** paintbrush
- **11:** rotate-ccw

**Every run is `1…k` with no hole except two.** No run lacks its unnumbered default; no size variant lacks its default; and all
485 names obey C9's order of parts — a size word last, a number just before it, the one word allowed after a number being
C27's arrangement word (`census`).

| run | numbers present | missing | recorded as deliberate | the reason on record |
|---|---|---|---|---|
| `trash` | 1, 5 | **2, 3, 4** | `docs/07-character.md:44` (C4: "not reassigned"), `:49` (C9 dated note: "still carry their gaps"), `:62` (C22: "left unused"); `CLAUDE.md:193` ("not yet ruled on"); rule-register G3 (`docs/audit/rule-register.md:334`) | C4's interiors were drawn and dropped; the dated note says the numbers "may be wanted back" |
| `check-circle` | 1, 3, 4 | **2** | `docs/07-character.md:49` (C9 dated note), `CLAUDE.md:193`, rule-register G3 | the dated note does not say. C9's composite clause adds *"numbers with no shipped shape stay unused"* (`docs/07-character.md:49`), which reads as the reason — no ring shape uses `check-2`, the long sweep — and C18 ends *"long-sweep checks were drawn and not taken"* (`:58`). The number was the small ring until commit `d19ec13` (2026-09-17) renamed it `check-circle-small` |

Both gaps are recorded; neither is ruled on; neither has a row on the sheet at the pin (`git show 5933041:research/queue.md`).
Decision on both: **FM-3**. (The sheet's `trash` row still carries the note *"trash family C4: trash, trash-2, trash-3, trash-4"* —
the withdrawn family; §11 hands it on.)

### 1.2 Does a number mark a different drawing? — reproduces the register, adds nothing

C9 says *"a number marks a different drawing, never a size or style"* (`docs/07-character.md:49`). Card 1.14 measured it
(`docs/audit/rule-register.md:338, 340-372`) and put the one ruling it needs on wave 5's list. This card re-ran it with the
Library's own definition and **agrees to the name** (`identity`):

| what | pairs | where it stands |
|---|---|---|
| the same whole icon (outline **and** filled) at all three masters | 2 — `globe` = `language-2`, `globe-2` = `language-3` | recorded: *"under a second name"*, `docs/07-character.md:78` |
| the same whole icon at 16 only | 5 — `camera`/`camera-5`, `files`/`files-5`, `help`/`help-2`, `microphone-2`/`microphone-5`, `text`/`text-4` | rule-register G7 (`rule-register.md:356-359`); none stands at exactly two masters |
| the same outline at all three masters, filled differs | 15 pairs — `ban`/`ban-2`, `building-3`/`-4`, `compass`/`-3`, and the three-member groups of the four `layout-*` families | C21 (`docs/07-character.md:61`), C29 (`:69`); `building-3`/`-4` and `compass`/`-3` only in their own file comments |
| the Library's twin groups | 9 groups, 22 names | the register's "nine groups, 22 concepts" |

C29's own test for retiring a number — *"one drawing at two masters out of three"* (`docs/07-character.md:49`, `:69`) — is
met a fortiori by the 2 aliases (identical at all three masters, in both styles) and not by the 5 (one master each); no pair
stands at exactly two. The two aliases are a decision of their own (**FM-6**), because the register's ruling is about
*filled-only* differences and these are identical in the filled twin too.

### 1.3 Tags — every numbered shape has them; 23 concepts stand against C9's style word

C9: a shape variant's style word is written into every file as `<!-- tags: … -->`, built into `dist/icons.json` and
searched by the Library (`docs/07-character.md:49`). The Library lets a query word match anywhere in the name, category,
base or tags (`lab/library.html:419-425`); lint never reads a tag (`docs/audit/exceptions-ledger.md:531-537`).

**Coverage is complete where C9 asks for it** (`tags`): 468 of 485 concepts carry a note — the 17 without are the unnumbered
`plus`, `minus`, `x`, their sizes and circles, and `more-horizontal` / `-vertical`, as the ledger and the register already say
(`rule-register.md:333`). **All 286 numbered shapes carry tags; in no concept do the six files disagree; none is empty; the 40
sized members carry exactly their default's tags** (a size is not a style word).

**Quality is where it slips.** C9's sentence is that a numbered shape's *style word* is written into its files; a shape that
shares its tag set with a sibling, has no word its default lacks, or carries the wrong word has not got one of its own. **23
concepts stand against it** (kind 1; 138 files, comment-only edits):

| fault | measured | who |
|---|---|---|
| two numbered shapes of one run have the **same tag set** — a search cannot tell them apart | 14 pairs in 10 runs, 22 concepts | `chart-pie` = `-2` = `-3` · `checkbox` = `checkbox-4` ("classic, task, done, selected") · `external-link` = `-2` · `home-2` = `home-3` · `sort` = `sort-2` · `sort-alpha-ascending-2` = `-3` · `sort-alpha-descending-2` = `-3` · `sort-numeric-ascending-2` = `-3` · `sort-numeric-descending-2` = `-3` · `sparkle-2` = `-3` = `-4` |
| a numbered shape has **no word its default lacks** | 6 shapes — 5 already in a pair above, and `key-5`, the one more (22 + 1 = 23) | `chart-pie-2`, `chart-pie-3`, `checkbox-4`, `external-link-2`, `key-5`, `sort-2` |
| a **direction word contradicts the name** | 2, both inside the pairs above | `sort-alpha-descending-2` and `-3` say *"ascending"* and never *"descending"*; their own file comments describe a descending sort |

**Four more concepts lack words that no rule asks for** (kind 3; 24 files). `users-4`, `users-4-behind`, `-wide` and `-level`
carry none of *team · group · people · members*, which the 12 other `users*` carry; 8 of those 12 also name their figure
(`users-2*` and `users-3*`), and `users-4*` never name `user-4`. The expectation comes from the siblings, not from a rule;
judged in §7 item 6. It is kept apart from the 23 above on purpose: those stand against a sentence in C9, these against nothing.

The same names differ in the drawing — no two of `sparkle-2/-3/-4` is a twin or a whole-icon duplicate of another
(`identity`) — so the tag, not the name, is what is wrong. What a style word *means* is not measured here: the commonest
words the shapes add are *wide* (14 runs), *flat* (10), *lines*, *round* and *steep* (7 each), and `docs/09-rule-audit.md:57`'s
*"variant numbers mean different things per family"* stands. **FM-2** (the fixes) and **FM-7** (docs/09's pending "variant
cap and shared style tags").

### 1.4 Do numbers travel across sibling stems?

Where an object has direction, region or composite siblings, a number should mean one thing in all of them — C12 says the
up, left and right chevrons are one drawing turned, C16 gives every direction the same four arrow heads, C29 gives the four
layout regions the same four constructions, C9 numbers a composite *"after the shape they use"*. Per number, the words each
stem adds to its own default (`travel`):

| sibling set | what states it | numbers that mean one thing in every stem |
|---|---|---|
| `chevron-{up,down,left,right}` | C12 | 2 of 2 — `-2` flat, `-3` steep |
| `arrow-{up,down,left,right}` + `arrow-up-right` | C16 | 4 of 4 — `-2` wide, `-3` flat, `-4` closed (`arrow-up-right-5` compact, alone) |
| `layout-{footer,header,sidebar,sidebar-right}` | C29 | 3 of 3 — `-2` highlight, `-3` content, `-4` detached section |
| `login`, `logout` | none | 3 of 3 |
| `alert-circle`, `alert-triangle` | none | 3 of 3 — `-2` taper, `-3` flat foot, `-4` both |
| `sort-numeric-{ascending,descending}` | none | 2 of 2 |
| `sort-alpha-{ascending,descending}` | none | **0 of 2** — the descending pair says "ascending" (§1.3) |
| **`check`, `check-circle`, `checkbox`** | **C9** | **0 of 3** — `-2`: `check` long sweep, `checkbox` steep · `-3`: `check` and `check-circle` steep, `checkbox` lean · `-4`: `check` and `check-circle` lean, `checkbox` nothing (it repeats "classic") |

Six of eight sets keep the promise. The ring does; the box does not. Reading the **tick itself** rather than the tag
(`travel`, translation-invariant shape): at 24 and at 20, `checkbox` carries `check-circle`'s tick, **`checkbox-2` carries
`check-circle-3`'s, `checkbox-3` `check-circle-4`'s, and `checkbox-4` `check-circle-small`'s** — the same four ticks the ring
numbers `1`, `3`, `4` and `small`. At 16 only `checkbox-4` is exact (the others are 0.106 · 0.172 · 0.258 off,
`findings-grammar.md:427`, card 1.1 §3.3).

The record shows the numbering was not a mistake about which tick is which. On 2026-09-17 commit `d19ec13` renamed the ring's
variants and said so in its message — *"small is a size, numbers follow the check"* — and C18 states that a container's `-small` / `-large` keep the
container and change only the inner mark (`docs/07-character.md:58`). On 2026-09-23 commit `fb444bc` added `checkbox` …
`checkbox-4`. Its message says *"-2 long sweep (check-2), -3 steep (check-3), -4 the quieter small tick"*, which is not what the
files carry: the sheet's row 51 reads `checkbox-2` *"Steep tick (check-3)"*, `checkbox-3` *"Lean tick (check-4)"*, `checkbox-4`
*"Quieter tick"*, and each file's own comment says its tick is *"as check-circle-3 does in the ring"* (`-2`) and *"as
check-circle-4 does in the ring"* (`-3`), `-4` taking `check-circle-small`'s (`travel` prints the rows and the comments). So the
drawing session knew the shape numbers and numbered by approval order anyway, and the commit message misdescribes `-2` and `-3`.
`checkbox-4` is also a **small in all but name**: same box, a mark `check-circle-small`'s size, and lint passes it as
`checkbox-small` (§2.3). Kind (1): the three numbers stand against C9's composite clause — *"a composite may ship other shapes,
numbered after the shape they use"* (`docs/07-character.md:49`).

**The kind (2) finding is coverage, not conflict.** C9's *"Numbers are assigned in approval order"* is the general rule and the
composite clause is its stated special case: one rule. But the clause is written in one place only. `docs/07-character.md:49`
carries both sentences; the Settled table's C9 row (`CLAUDE.md:193`) carries neither; and the icon skill
(`.claude/skills/icon/SKILL.md`) never mentions C9 (`travel` reads all three files at the pin). A drawing session working from the
summary and the skill finds no composite rule to follow, against `CLAUDE.md:28-30` — a rule is updated in every place that states
it. Judged in §7 items 4 (the drawings) and 8 (the coverage). **FM-1.**

**Where the promise is kept to the thousandth.** C29 says header is footer mirrored top to bottom, sidebar is footer turned a
quarter, sidebar-right is the sidebar reflected, *"with no adjustment at any master"* (`docs/07-character.md:69`). Every drawing of
every region was compared sample by sample with the footer turned (`travel`): **72 of 72 comparisons (four constructions ×
outline and filled × three masters × three regions) are the same drawing — largest distance 0.000**; the wrong symmetry reads
4.5 and a drift of 0.25 reads 0.25. The chevron directions are one drawing turned too (card 1.1 §2.6,
`findings-primitives.md:335-402, 997-998`).

The other direction, for completeness: numbers do not carry from `chevron-down` into `chevrons-up-down` (`-2` is flat in the first
and *classic, open* in the second; `chevrons-up-down` is 1 *classic snug* · 2 *classic open* · 3 *flat open* · 4 *flat*). No rule
says they should; they are two objects.

---

## 2. Size families

### 2.1 The step, defined once

Every `-small` / `-large` name, 40 of them, belongs to one of **25 size families** (65 concepts, 390 files): 19 marks and 6
containers. For a mark the step is taken on the **long side of the outer ink box** — for a chevron-down the width, for a
chevron-left the height, for a plus either — in outline and in filled, at each master. C8: *"each size is 12.5% of the canvas
longer than the next one down … 3 at 24, 2.5 at 20, 2 at 16"* (`docs/07-character.md:48`).

**All 19 mark families hold it exactly — 114 of 114 family × master × style cells, 204 steps (a small and a large each count);
the largest deviation from 3 · 2.5 · 2 is 0.000 (3 dp).** The six containers are not in this count: C18 gives them the ring, not a
step (§2.2). The filled twin steps the same as the outline. The tests carry a probe for each side of the step — a `plus-large` bent by
a quarter unit reads 0.250, a `plus-small` cut half a unit short at 20 reads a step of 3 against 2.5 — so a tool that stopped
measuring either would fail. Five size ladders cover all nineteen (`sizes`):

| long side, small · default · large | at 24 | at 20 | at 16 | families |
|---|---|---|---|---|
| check (default + small only) | 13 · 16 | 11.5 · 14 | 10 · 12 | `check`, `check-2`, `check-3`, `check-4` |
| classic and steep chevron | 11 · 14 · 17 | 9.5 · 12 · 14.5 | 8.5 · 10.5 · 12.5 | the four directions of `chevron` and of `chevron-3` (8) |
| flat chevron | 13 · 16 · 19 | 11 · 13.5 · 16 | 10 · 12 · 14 | the four directions of `chevron-2` (4) |
| plus, minus | 12 · 15 · 18 | 11 · 13.5 · 16 | 10 · 12 · 14 | `plus`, `minus` (2) |
| x | 10 · 13 · 16 | 9.5 · 12 · 14.5 | 8.5 · 10.5 · 12.5 | `x` (1) |

C8's own worked example — `plus` 18 / 15 / 12 at 24, 16 / 13.5 / 11 at 20, 14 / 12 / 10 at 16 — reproduces exactly. No default is
over the mark ceiling (18 · 14 · 12). C8 lets a `-large` run to the margin edge: it does at **20** (16, in 6 of the 15 `-large`
families) and **16** (14, the same 6) and never at **24**, where the largest is 19 of 20 — the flat chevron.

### 2.2 Containers keep the ring and shrink the mark

C18: a container's `-small` keeps the container and changes only the inner mark; its step is *chosen per icon, not `SIZE_STEP`*
(`docs/07-character.md:58`). **Held, 36 of 36**: in all six container families the ring is the same path at every master, in
outline and filled (`containers`). What the mark does (outline mark, long side, default → small; the filled cut-out steps within
0.03 of it everywhere — largest, `check-circle` at 24: 1.658 against 1.680):

| family | 24 | 20 | 16 | step at 16 as a share of the canvas |
|---|---|---|---|---|
| `check-circle` | 10.28 → 8.60 · **1.68** | 7.80 → 6.58 · **1.22** | 6.58 → 5.70 · **0.88** | 5.5% |
| `check-circle-3` | 9.76 → 8.24 · **1.52** | 7.44 → 6.26 · **1.18** | 6.22 → 5.50 · **0.72** | 4.5% |
| `check-circle-4` | 9.62 → 8.10 · **1.52** | 7.32 → 6.18 · **1.14** | 6.22 → 5.44 · **0.78** | 4.9% |
| `plus-circle`, `minus-circle` | 10.5 → 9.0 · **1.50** | 8.0 → 7.0 · **1.00** | 6.5 → 5.5 · **1.00** | 6.3% |
| `x-circle` | 9.0 → 8.0 · **1.00** | 6.5 → 6.0 · **0.50** | 5.5 → 5.0 · **0.50** | **3.1%** |

A mark family steps by 12.5% of the canvas at every master; a container's small steps the mark by **2.5%–7.0%**, and at 16 by
**0.5–1.0 of a unit — half a pixel to one**. C18's own numbers for `plus-circle` (10.5 · 8 · 6.5 and 9 · 7 · 5.5 wide) reproduce
exactly; `check-circle`'s (10.27 · 7.81 · 6.58, small 8.61 · 6.58 · 5.71) to 0.01. The air round the mark is card 1.9's
(`findings-grammar.md:243-245`).

**What is worth Maruti's eye.** C18 retired `info-small` because *"at 16 that is a single pixel"* (`docs/07-character.md:58`: 7.5
tall against 6.5) and ends *"the other circle families keep their smalls until reviewed one by one"*. That review has its data
here: at 16 `plus-circle-small` and `minus-circle-small` step by the same 1.0 that retired `info-small`, and `x-circle-small` by
half of it. No rule says how much smaller a small must be (kind 3, judged in §7 item 3). Eye question E-1; **FM-5**.

### 2.3 Where lint and this measure agree, and where lint's reach ends

`checkFamilies` (`tools/lint.mjs:537-558`) reads every file named `-small` / `-large`, takes `size = max(w, h)` of its own 2 dp
ink box (`:316-317`), and warns when a mark is not default ± `SIZE_STEP` (`:553-555`) or when a container's size differs from the
default's (`:545-547`) or its inner mark (`:332-335`, outline file only) is not smaller / larger (`:548-550`). Run through the
pin's own `lintSource` and `checkFamilies` on all 390 member files (`lintcmp`):

- **The numbers agree.** lint's size equals the exact long side — largest difference **0.000** — and it raises no warning. The
  long sides end on path vertices, which is why its sampled box and the solved one coincide here.
- **Three differences of reach, none of them a disagreement at the pin.** (a) lint is keyed on the suffix: `checkbox-4`, offered
  to it as `checkbox-small`, passes (same container, smaller mark: `size` 18 · 14 · 12, `inner` 8.6 · 6.58 · 5.7, no warning), so
  a size that is *named* a number is never held to C8 or C18. (b) lint reads a container's mark **only in the outline file** —
  `inner` is read on 36 of 36 outline container files and on **0 of 36** filled ones, so the filled cut-out's step, which this
  card measured (above), is checked by nothing. (c) lint tests the container's *size* to 0.01; this card compares the
  container's own path (outline) and box (filled) — the same answer at the pin.

---

## 3. Completeness — the styles × sizes grid

### 3.1 The grid is full

C13: *"sizes × styles is a full grid … no gaps"* (`docs/07-character.md:53`). At the file level it is exact (`grid`): **2,910 of
2,910 files, six per concept; no filled file without its outline twin; no size variant without its default.** The family level,
for the 12 stems that carry sizes (the other 147 stems ship none):

| stem | numbers → sizes shipped (S small · D default · L large) |
|---|---|
| `check` | 1: SD · 2: SD · 3: SD · 4: SD |
| `check-circle` | 1: SD · 3: SD · 4: SD (**no 2**, §1.1) |
| `chevron-up`, `-down`, `-left`, `-right` | 1: SDL · 2: SDL · 3: SDL |
| `plus`, `minus`, `x` | 1: SDL |
| `plus-circle`, `minus-circle`, `x-circle` | 1: SD |

**No numbered shape has a size its siblings lack, and none lacks one they have.** Which stems ship sizes is by use case (C8:
a large tick has no job, so `check` ships default + small); the families that ship none — `arrow-*`, `help`, `alert-circle`,
`ban`, and by C18's explicit decision `info` — are decisions, not holes. Nothing in the docs says `alert-circle` or `help` was
ever reviewed for a small (C18: *"until reviewed one by one"*).

### 3.2 The sheet — what is queued, what is not

`research/queue.md` at the pin (`sheet`): **834 rows — 485 `[x]` and 349 `[ ]`, no `[~]`**; the approved rows are exactly the
485 concepts (none missing from the set, none in the set without a row, no duplicate name, no open row already shipped).

- **No queued row is a size or a number.** Not one of the 349 ends `-small`, `-large` or `-N`. The two gaps of §1.1 have no row.
- **133 queued rows say `variant of` a base; 110 name a base that ships (on 55 bases), 23 a base that is itself queued;** 216
  have no base. Written on each base's default shape (C9: *"composites … use the default shape"*, `docs/07-character.md:49`)
  they are **110 icons, 660 files**; if every shipped shape of every base took each of them, 355 icons, 2,130 files — a
  figure no rule asks for. The bases with the most queued relatives, shapes shipped in brackets: `user` (4) 12 · `file` (1) 9 ·
  `phone` (1) 6 · `text` (4) 6 · `folder` (3) 5 · `image` (3) 4 · `message` (7) 4 · `calendar` (3), `chart-bar` (5),
  `clipboard` (4), `credit-card` (3), `eye` (1), `shield` (2) 3 each · the other 42 bases 2 or 1 (`sheet`). 47 of the 55 bases ship
  more than one shape, so *every shipped shape* is a real multiple for them; the 8 that ship one — `file` 9, `phone` 6, `eye` 3, and
  `face-smile`, `minus`, `plus`, `star`, `x` 1 each — cannot multiply.
- **Two numbering rules speak about queued names that are not numbered.** C29: *"a later region takes the same four numbers
  for the same four constructions"* (`docs/07-character.md:69`) — the sheet has one `layout-` row (`layout-list`, row 222). C27:
  *"later composites carry the figure number with the object too: `user-2-plus`"* (`:67`) — 12 queued `user-*` rows, none numbered.
- **Seven queued relatives end in one of five words I picked — *dotted, dashed, horizontal, vertical, stacked* — where C9 writes a
  number and a tag** (*"a shape variant is -2, -3 …, never a word"*, `docs/07-character.md:49`): on shipped bases
  `chart-bar-horizontal`, `chart-bar-stacked`, `check-circle-dashed`, `rotate-ccw-dotted`; on queued bases `collapse-horizontal`,
  `expand-horizontal`, `play-circle-dotted`. That is a reading of a named list, not a census, and the list is mine: the same words end
  `flip-horizontal` and `flip-vertical` (no base), and a second list (*open, closed, wide, narrow, tall, short*) reaches seven more —
  `viewport-narrow`, `-short`, `-tall`, `-wide` (no base), `eye-closed`, `folder-open` and `mail-open`, which C25 already treats as an
  icon of its own (*"a later envelope (`mail-open`, `inbox`) takes its flap from this drawing"*, `docs/07-character.md:65`). Whether
  each is a shape of its base (a number, a tag) or an icon of its own (a word) is a naming decision nothing in C9 or docs/05 draws a
  line for; it expires at launch with the rest. Judged in §7 item 12; **FM-7**.

### 3.3 "Missing by rule" against "not yet drawn"

| | what | count |
|---|---|---|
| **missing by rule** | a file of a concept's six (C13) | **0** |
| | a size variant with no default (C8, lint `:544`) | **0** |
| | a numbered shape that C9 leaves a hole for, unrecorded | **0** — two holes, both recorded, neither ruled (FM-3) |
| | a numbered sibling lacking a size its siblings have (C13) | **0** |
| **not yet drawn** (queued) | a size, a number | **0** |
| | a composite of a shipped base | 110 rows on 55 bases (+ 23 on queued bases) |
| | numbers a rule speaks for and the sheet does not carry | `layout-list` (C29: four) · 12 `user-*` rows (C27: figure number) |

---

## 4. Figure families (C27)

C27: *"the number names the figure and travels with the object"* — `user-2` ↔ `users-2` — and *"other arrangements take a word
after the figure"* (`docs/07-character.md:67`). **20 members** (`figures`): four figures `user`, `user-2`, `user-3`, `user-4` and
the 16 `users*` built on them (4 figures × default, `-behind`, `-wide`, `-level`). Each number travels in four senses, and the
answer differs:

- **By name — yes, 20 of 20.** Every figure has its group and every arrangement on every figure.
- **By box — the arrangement word fixes it; the figure number never does.** Every `users` member, whatever its figure, stands on
  the **square** (18×18 · 14×14 · 12×12) in the default and `-behind` arrangements and on the **landscape** (20×16 · 16×12 ·
  14×10) in `-wide` and `-level`: 16 of 16, outline and filled. The one figure that breaks the pattern is a figure itself —
  `user`, `user-2`, `user-3` stand on the portrait (16×20 · 12×16 · 10×14, `docs/07-character.md:80-83`) and **`user-4` on the
  square**. A figure swap therefore never moves the box in a group; an arrangement swap always does; and `user-4` is the one figure
  whose own box differs from its siblings (one icon, not a rule).
- **By tag — three figures of four.** `users-2*` and `users-3*` name `user-2` / `user-3` in their tags (8 of 8); `users-4*` never
  name `user-4` and lack the group's four search words (§1.3).
- **By geometry — no.** Card 1.1 §4.3 and item 11 (`findings-primitives.md:714-745, 959-967`): `users-2` is drawn with `user`'s
  head, not `user-2`'s; `user-2`, `-3`, `-4` share one head; the head sizes group by arrangement, never by figure. Card 1.9 §2.4
  (`findings-grammar.md:460`): 0 of 7 pairs share a part. Whether C27 promised the geometry or only the naming is Maruti's (card 1.1
  item 11) — nothing here changes it.

**What `lab/figures.html` dashes.** Read at the pin, the page's defaults are object `user`, group `users`, words `behind, wide,
level` (`lab/figures.html:111-113`); its rows are `user` and every `user-<n>` that ships (4), its columns the figure, the group and
one per word (5): **20 cells, 20 shipped, 0 dashed** — a name that ships is drawn from its file whatever a board holds (`:123,
:179-183`), so no board can change a shipped cell. The page's subtitle (`:190`) would read *20 shipped · 0 on a board · 0 missing*.
Ask it for C27's fourth word (`?words=behind,wide,level,heads`) and it dashes **4** — `users-heads`, `users-2-heads`,
`users-3-heads`, `users-4-heads` — and that is not a gap in the set: **`users-heads` was retired at Maruti's request on 2026-09-23**
(`279ff1c` "Drop users-heads": files deleted, sheet row removed), 53 seconds after `0e63335` wrote C27, and C27 still lists it among
the arrangement words (`docs/07-character.md:67`: *"`users-heads` (whole small head raised behind, square box)"*). At the pin that
sentence is the only mention of it in any file. The only dashed cell is a stale word in a rule — kind (2), judged in §7 item 11.
**FM-4.**

---

## 5. Level families (C28)

### 5.1 `volume` against its rule

C28 (`docs/07-character.md:68`): one body identical and in place in every member; waves drop outside-in and the rest keep their
coordinates; levels take words; members declare `anchor:`; `volume-off` is a state, centred on its own. Measured at all three
masters in both styles (`levels`):

| member | role | anchor | speaker same path, same place (paths same / total) | ink box 24 · 20 · 16 | inside `volume`'s box · shares its edge | centre @24 · 20 · 16 |
|---|---|---|---|---|---|---|
| `volume` | the full member, 2 waves | — | 3 / 3 | 20×16 · 16×12 · 14×10 | — | 12,12 · 10,10 · 8,8 |
| `volume-low` | a level, 1 wave | `volume` | 2 / 2 | 15×16 · 12×12 · 10.5×10 | yes · left | 9.5,12 · 8,10 · 6.25,8 |
| `volume-none` | a level, speaker only | `volume` | 1 / 1 | 10×16 · 8×12 · 7×10 | yes · left | 7,12 · 6,10 · 4.5,8 |
| `volume-x` | a × in the waves' place | `volume` | 1 / 3 | 20×16 · 16×12 · 14×10 | yes · both (its own box) | 12,12 · 10,10 · 8,8 |
| `volume-plus` | a + in the waves' place | `volume` | 1 / 3 | same | yes · both | same |
| `volume-minus` | a − in the waves' place | `volume` | 1 / 2 | same | yes · both | same |
| `volume-off` | a state, the C21 bar across | — (none, as C28 says) | 0 — the speaker is **translated 5 · 4 · 3 right** in the outline; the filled speaker is knocked out by the bar | 18×18 · 14×14 · 12×12 | no · no | 12,12 · 10,10 · **7.5,8** |

**C28 holds on every count it states.** In all 30 anchored cells (5 members × 3 masters × 2 styles) the speaker is the same path in
the same place and the ink stays inside the full member's box on its left edge; `volume-low` keeps `volume`'s speaker and its
**inner** wave exactly and drops the outer one at every master (kept wave at x 14.8–16.25 · 12.3–13.25 · 10.21–10.87, dropped
18.36–21.25 · 15.38–17.25 · 12.89–14.37); each wave costs the same width, **5 · 4 · 3.5** (20 → 15 → 10, 16 → 12 → 8, 14 → 10.5 → 7);
the family has no number in it; exactly five concepts declare `anchor: volume`, and the full member and `volume-off` declare none;
and `volume-off` is centred as its own icon at 24 and 20 and **0.5 left of centre at 16** (ink centre 7.5 against 8 — card 1.9
§1.3, `findings-grammar.md:214-218`). The speaker's 7-of-7 identity is card 1.9's (`findings-grammar.md:454`). C28's *member
list* names five of the seven; `volume-plus` and `-minus` are controls, not levels, and C28 has no word for them — stale-statements
1.6 (`docs/audit/stale-statements.md:94-101, 464`), cited, not repeated.

### 5.2 Every other name that says an amount

A by-name scan (tokens *low · medium · mid · high · none · full · empty · half · quarter · min · max · zero · off · on · closed ·
partial*, and the stems *battery · signal · wifi · brightness · contrast · volume · loader · progress · gauge · timer · zoom ·
speaker · thermometer · bars*), read by hand afterwards (`levels`):

- **Shipped (10):** the seven `volume*`; `toggle-on`, `toggle-on-2` (a state: *on*); `gauge` (one dial). **No other shipped
  concept is a level family; none carries an anchor note outside `volume`; no numbered shape means an amount** (a level, by C28, is a
  word). The scan's other hits are not amounts (`users-level` is a level *eye line*, C27).
- **Queued (33):** 19 strike or state rows — `-off` ×17, `toggle-off`, `eye-closed` — which are `volume-off`'s kind (C21 bar, C28:
  *centred as its own icon, no anchor*); **8 that name an amount — `battery`, `battery-full`, `battery-low`, `battery-charging`,
  `signal`, `wifi`, `loader`, `progress-bar`** — which C28 would cover in spirit but not in words (it speaks of *waves*, and the
  first of these puts its levels *inside* a body); and 6 that are not (`zoom-in`, `zoom-out`, `contrast`, `timer`, `speaker`,
  `search-empty`). The battery names already follow C28's naming (`-low`, `-full` are words, not numbers). Nothing is wrong,
  because nothing is drawn: C28 is silent on a level that is a fill or a bar inside a body, and eight queued names would meet that
  silence. This card proposes **no sentence** for it — a rule written from zero drawings is the C24 pattern (a general form written,
  then *"withdrawn the same day"*, `docs/07-character.md:64`); the first battery board will say what such a level needs. It is a
  watch item (§7 item 10); `volume-plus` / `-minus`, which are controls and not levels, are already card 1.16's (`stale-statements.md:94-101, 464`).

---

## 6. "No family in this set keeps one ink box"

`plans/sort-family.md:9` — a plan headed WITHDRAWN that records *"No family in this set keeps one ink box. Measured at 24: `menu`
runs 10.5 · 10.5 · 7.5 · 9.0 tall across its own variants, `chevron-up` 7.43 · 6.35 · 9.03, `list-bullet` …, `arrow-up` …"* — and
which the audit plan carries as a recorded fact (`plans/set-and-rules-audit.md:333-336`; `docs/audit/enforcement-gap.md:189-190`).
Card 1.16 already re-measured the headline at 24 and found **53 of 107 name-families keep exactly one box**, calling it misleading
(`docs/audit/stale-statements.md:279, 352-357`). That 53 is reproduced here, and the 52 this card first counted was a difference of
**definition**, not of drawing — so every figure in this section says which of two it is:

- **A — the same box exactly.** Every member's 2 dp ink box equals every other's. No tolerance.
- **B — within lint's ±0.01.** Every member's 2 dp box is within 0.01 of every other's, which is how lint holds a drawing to a
  declared box (`tools/lint.mjs:349`).

They part on three cells of the 107 runs: `cursor` at 24 and at 20 (the exact widths of `cursor`, `cursor-2`, `cursor-3` are
18.0038 · 17.9954 · 18.0086, which round to 18.00 · 18.00 · 18.01; the members differ by 0.0132 units in all — at a 16 px render
0.0088 px from the 24 master and 0.0106 px from the 20) and `home` at 20 (one height 13.9923 against 14.0000; 0.0077 units, 0.0062 px).
The B count does not move for any tolerance between 0.01 and 0.05, so nothing hangs on the exact value. Card 1.16 counted at 24 alone,
where B is **53** (A 52): its number is B's.
This section re-measures at all three masters, by kind of family, and says which rule asks for a box (`boxes`) — outline, on the
numbered run at the default size:

**True of every family it named; false of the set.** `menu`, `chevron-up`, `list-bullet`, `arrow-up` and `sort` each show more
than one box at every master, under A and under B, and the numbers the plan quotes reproduce (menu's four heights 10.5 · 7.5 · 9 · 10.5;
arrow-up's widths 14 · 11.5 · 10 · 10). But **of the 107 runs, 51 keep one ink box at all three masters under A and 53 under B** (A: 4
at some masters, 52 at none; B: 2 · 52). At one master alone: A 52 · 52 · 55 and B 53 · 54 · 55, at 24 · 20 · 16. The published 2 dp boxes
in `dist/metrics.json` give A 52 · 52 · 55 and 51 at all three, B 53 · 54 · 55 and 53. Over card 1.9's folded partition: A 50 of 105
(51 at 24 alone), B 52 (52 at 24 alone); over this card's, with the three circles unfolded: A 53 of 108 (54), B 55 (55).

| kind of family | families | keep one box at all three masters — A · B | what asks for it |
|---|---|---|---|
| numbered runs of **marks** (`keyline: mark`) | 20 | A **1** (`hash`), 19 vary · B **2** (`cursor` joins) | nothing: a mark has a ceiling, no keyline (`docs/01-foundations.md:105-115`) |
| numbered runs of **silhouette or agreed-box** objects | 82 | A **50** — 43 on one named keyline (square 19 · circle 14 · portrait 7 · landscape 3), 7 on an agreed `box:` (`alert-triangle` 20×19, `folder`, `heart` 20×18, the four `sort-alpha/numeric-*` 18×15); 32 vary · B **51** (`home` joins, on the square) | the keyline rule asks each **icon** to match a keyline (`tools/lint.mjs:352`); it does not ask the variants of one object to choose the same |
| mixed runs (a mark and a silhouette) | 5 (`chart-bar`, `filter`, `grid`, `maximize`, `refresh`) | A 0 · B 0 | — |
| **size families, marks** (C8) | 19 | **0** under both | C8 asks for the opposite: a step |
| **size families, containers** (C18) | 6 | **6** under both — the ring | C18; lint warns (`tools/lint.mjs:545-547`) |
| **the level family** (C28) | 1 (`volume`) | **0** under both — 4 boxes per master across 7 members | C28: inside the full member's box, sharing an edge (lint error, `tools/lint.mjs:567-615`) |
| **figure × arrangement** (C27) | 4 groups of 4 | **4 of 4** under both | none states a box; the word fixes it (§4) |
| **layout regions** (C29) | 4 | **4 of 4** under both — the 18×18 square | none; C29 shares the constructions (§1.4) |

Of the 56 runs that do not keep one box under A, **21 hold one dimension at every master** (width in 14 — `arrow-left`, `arrow-right`,
`camera`, `check`, `code`, `desktop`, `home`, `keyboard`, `link`, `menu`, `presentation`, `sliders`, `sort`, `toggle-on`; height in 7 —
`arrow-up`, `arrow-down`, `building`, `chart-bar`, `files`, `microphone`, `watch`) and 35 hold neither. Under B, of the 54, 20 hold one
dimension (width in 13 — `home` is no longer among the runs that vary — height in 7) and 34 hold neither. That is the plan's second
sentence — *"what a family shares is the dimension its mark's own structure fixes"* — and it is true of 21 families (A; 20 under B),
not all. The plan's own **sort family** (every `sort*` name, 17) stands on **4 boxes**: 13 on the sort box 18×15 · 16×13.5 · 14×12
(`sort`, the six `sort-alpha-*` and the six `sort-numeric-*`, the ledger's 13, `docs/audit/exceptions-ledger.md:281`), `sort-2` 18×18,
`sort-3` 18×11.52, `sort-ascending` and `-descending` 15×15.

**So:** it is true for marks, for mark size families and for the level family *by rule*; it is false for 50 silhouette or agreed-box
runs under A (51 under B), for the container size families, for the figure arrangements and for the layout regions; and **exactly one
rule asks a family for one box — C18, for a container's sizes.** The plan's measured numbers are right; the universal is not (kind 2 —
a document against the drawings, judged in §7 item 1). Which of A and B is "one box" is a definition for wave 5 to settle (§10), not
a drawing to fix: the largest difference between the two is 0.0132 units, under 0.011 px at a 16 px render.

---

## 7. Judged list — what stuck out, ranked by the drawings each touches

Kinds as in §0. Counts are concepts (× 6 = files).

1. **"No family keeps one ink box" is false of 51 of 107 runs under A, 53 under B (§6). (2) · a statement, 393 concepts in 107 runs.**
   True of the five families the plan measured and of 56 runs under A (52 that keep one box at no master, 4 at some) or 54 under B
   (52 and 2), false of the 51 (A) or 53 (B) — 43 (A) or 44 (B) of them because every
   variant fits one keyline. Card 1.16 found it at 24 (53 of 107, which is B); §6 gives three masters, both definitions, the kinds and
   the one rule that asks. Hands to 1.16.
2. **23 concepts stand against C9's style word. (1) · 23 concepts, 138 files.** 14 same-tag pairs in 10 runs (22 concepts) and `key-5`,
   which has no word of its own (the 23rd); the 6 shapes with no word of their own and the 2 descending sorts tagged "ascending" are
   inside those. Tags are comments; the Library and `dist/icons.json` carry them; lint cannot see them. §1.3. **FM-2.**
3. **A container's `-small` steps its mark by 2.5%–7.0% of the canvas, and at 16 by 0.5–1.0 of a unit. (3) · 6 families, 6
   smalls.** Nothing breaks: C18 says "chosen per icon" and defers the other smalls to a one-by-one review. The weakest —
   `x-circle-small` 1.0 · 0.5 · 0.5, `check-circle-3` / `-4` 0.72 / 0.78 at 16 — are weaker than the `info-small` retired for being "a
   single pixel" (1.0). Whether they read as one size at 16 is the eye's. §2.2. **E-1, FM-5.**
4. **`checkbox-2`, `-3`, `-4` carry `check-circle`'s ticks `-3`, `-4` and `-small`. (1) · 3 concepts, 18 files.** C9's composite
   clause numbers a composite after the shape it uses (*`check-circle-3` uses `check-3`*); C18 makes a smaller mark a size, not a
   number. The commit that added them misdescribes them, and each file's own comment names the ring's number. §1.4. **FM-1.**
5. **`language-2` and `language-3` are `globe` and `globe-2` under a second name. (2) · 4 concepts, 24 files.** Recorded
   (`docs/07-character.md:78`); C9 says a number marks a different drawing and C29 retired four `-3`s for being one drawing at two
   masters. These are identical at three, in both styles. §1.2. **FM-6.**
6. **The four `users-4*` carry none of the group's words and never name `user-4`. (3) · 4 concepts, 24 files.** The 12 other `users*`
   carry *team · group · people · members*, and 8 of them name their figure; no rule asks for either. §1.3. **FM-2.**
7. **`user-4` stands on the square where `user`, `user-2` and `user-3` stand on the portrait. (3) · 1 concept.** Fine by every
   keyline; the arrangement words fix the box across all four figures, the figure number does not. §4. **E-2.**
8. **C9's composite clause is written in one place only. (2) · the rule.** *"Numbers are assigned in approval order"* is C9's general
   rule and *"numbered after the shape they use"* its stated special case — one rule, not two. `docs/07-character.md:49` is the only
   file that holds the clause: the Settled table's C9 row (`CLAUDE.md:193`) has neither sentence and the icon skill never mentions C9,
   against `CLAUDE.md:28-30` (a rule is changed everywhere at once) — a drawing session working from the summary and the skill has no
   composite rule to follow. §1.4. **FM-1.**
9. **Two numbering gaps wait for a ruling — `trash` 2 · 3 · 4 and `check-circle` 2. (open, not a disagreement) · 2 runs, 4
   numbers; 1 concept would be renamed.** Recorded in at least three places each (§1.1); for `check-circle` C9's composite clause also
   gives the reason; the clock stops at launch (C9). §1.1. **FM-3.**
10. **C28 is silent on a level that is a fill or a bar, and eight queued names would meet it. (3) · 0 shipped, 8 queued.** `battery`
    ×4, `signal`, `wifi`, `loader`, `progress-bar`; 19 `-off` / `toggle-off` / `eye-closed` rows are states, `volume-off`'s kind. Nothing
    is drawn, so nothing is wrong; a watch item with no proposal — the first battery board will say what such a level needs. §5.2.
11. **C27 lists an arrangement, `users-heads`, retired 53 seconds after it was written. (2) · 0 drawings.** Commit `279ff1c`; the
    only dashed cell `lab/figures.html` can show. §4. **FM-4.**
12. **C9 does not say where a style word becomes a name. (3) · 0 shipped, 7 queued.** `check-circle-dashed`, `rotate-ccw-dotted`,
    `chart-bar-horizontal`, `chart-bar-stacked` and three more — a reading of five words I picked; under another list the same
    question reaches nine more names (§3.2). §3.2. **FM-7.**

### Where the set is simply good

- **C8 is the best-kept rule in the set** — the 19 mark families hold the step in 114 of 114 cells (204 steps), 0.000, outline and
  filled; C8's own `plus` example reproduces; no default over the ceiling (§2.1). The six containers keep their ring instead (§2.2).
- **Containers keep the ring** — 36 of 36; and lint's reading and the exact one are the same number on 390 files (§2.2–2.3).
- **The grid is full** — 2,910 of 2,910; no size without a default; no orphan; 485 of 485 names obey C9's order of parts (§3.1).
- **Six of eight sibling sets keep their numbers** — chevron, arrow, layout, login/logout, alert, sort-numeric (§1.4) — and **the
  four layout regions are the footer turned exactly**, 72 of 72, to 0.000 (§1.4).
- **The figure arrangements are a clean vocabulary** — the word fixes the box in 16 of 16, and `lab/figures.html` dashes nothing (§4).
- **`volume` follows C28 on every measure** — speaker identical and in place in 30 of 30 anchored cells, waves outside-in, one wave
  costs 5 · 4 · 3.5 (§5.1).
- **Every numbered shape is tagged, in all six files, and the sized names inherit their default's tags** (§1.3).

---

## 8. What only Maruti's eye can settle, and where

| | question | surface |
|---|---|---|
| E-1 | At 16, does `x-circle-small` (5 against 5.5) read as a smaller `x-circle`, outline and filled? And `check-circle-3-small` / `-4-small` (0.72 / 0.78), `plus-circle-small` / `minus-circle-small` (1.0)? If not, `info-small`'s reasoning retires them | the six default / small pairs at real 16 px in the Library's **At 16** strip (`lab/library.html:237-240`), outline then filled (F); `[surface needed]` for a size-family row — wave 4's wall sorted by family (card 4.1) |
| E-2 | Does `user-4` (18×18) read as the same family as `user`, `user-2`, `user-3` (16×20) — and as the figure inside `users-4*` (18×18 and 20×16)? | `lab/figures.html` — rows are figures; look at the `user-4` row at real pixels, 1× and 2× |
| E-3 | Are the 14 same-tag pairs — above all `sparkle-2` / `-3` / `-4`, `chart-pie` / `-2` / `-3`, `home-2` / `-3` — drawings a customer can tell apart? If they are, they need words; if they are not, they need fewer numbers | the Library's detail panel shows each name's tags beside its three masters; `[surface needed]` for the 14 pairs side by side — card 4.1's wall, sorted by family |

---

## 9. Proposals for Maruti to rule on

**Proposals, not decisions. Each carries a recommendation; nothing in the set, the rules or lint changes until Maruti rules.**
FM-1 and FM-3 are free today and not after launch (C9 locks names and numbers at release); they join the plan's three decisions
that expire at launch (`plans/set-and-rules-audit.md:139-144`).

**FM-1 — Make `checkbox` follow the check, and put C9's composite clause where drawing sessions read.** *Evidence:* §1.4 —
`checkbox-2` / `-3` / `-4` are `check-circle`'s `-3` / `-4` / `-small` ticks (exact at 24 and 20); the files' own comments say so and
the commit message (`fb444bc`, 2026-09-23) says otherwise; `d19ec13` (2026-09-17) had just renamed the ring's variants so that
*numbers follow the check*; C9's composite clause is written in `docs/07-character.md:49` alone (§7 item 8); lint would pass
`checkbox-4` as `checkbox-small` (§2.3). *Options:* (a) `checkbox-2` → `checkbox-3`, `checkbox-3` → `checkbox-4`, `checkbox-4` →
`checkbox-small`, `checkbox-2` left unused beside `check-circle-2` — 3 concepts, 18 files, one `queue.mjs rename`, recorded in doc 07
as C9 asks (`travel`); (b) drop the composite clause, so a composite numbers in approval order like anything else — `checkbox-2` /
`-3` / `-4` are then lawful where they stand, nothing is renamed, and the ring's `check-circle-3` / `-4` and their two smalls (4
concepts, 24 files), which `d19ec13` numbered after the check on purpose, lose the reason it gave. *Recommendation:* **(a)**. Then write the
composite clause into `CLAUDE.md:193` and into the icon skill beside C9's number rule (the skill has no C9 text today), and let
`checkbox-small` take lint's C18 check, which `checkbox-4` has never had. A fourth tick in a box — the long sweep, `check-2` — is a
drawing decision this card does not make.

**FM-2 — Give every numbered shape a search word of its own, and correct two.** *Evidence:* §1.3 — 23 concepts, 138 files, comments
only (kind 1); and four `users-4*` without the group's words (kind 3; 24 files). *Recommendation:* yes, before launch, because the
tags ship in `dist/icons.json`. The words are the drawing session's to write from each file's own prose comment (this card does not
invent them): the 6 shapes with none (5 of them inside the pairs); a distinguishing word for each of the 14 same-tag pairs that
Maruti's eye (E-3) says are different drawings; `descending` for `sort-alpha-descending-2` and `-3`; and, if Maruti wants the
siblings' words, the group words and `user-4` for the four `users-4*`. A numbered-run check (a gap, a same-tag pair, an antonym)
belongs with card 1.9's P7 shared-part check (`findings-grammar.md:656-662`) in the primitive-drift linter's backlog — as a warning,
never an error (§11).

**FM-3 — Rule on the two open numbering gaps before launch.** *Evidence:* §1.1. *Options:* `trash` — close it (`trash-5` → `trash-2`,
one concept, 6 files, recorded in doc 07 as C9 provides, as the layout families did on 2026-10-03) or keep it (C22: the numbers are
held in case an interior is revisited; customers see `trash`, `trash-5` for good). `check-circle` — keep it (C9's composite
clause already says *numbers with no shipped shape stay unused* and C18 that the long sweep was drawn in the ring and not taken, so
the dated note need only say the gap is that clause's and not pending), or draw the long sweep in the ring. *Recommendation:* close
`trash` — C4's four interiors were drawn and were *"four ways to say the same thing"* (`docs/07-character.md:44`), nothing on the
sheet wants them back, and a numbering hole a customer can see is dearer than a rename; keep `check-circle-2` empty and let the dated
note point at the clause — adding `checkbox-2` to the same note if FM-1(a) is taken, so the one reserved "2" has one explanation.

**FM-4 — C27: strike `users-heads`, and record what the arrangement word fixes.** *Evidence:* §4 — `279ff1c`; the word fixes the
box in 16 of 16 (square for none and `-behind`, landscape for `-wide` and `-level`), in both styles. *Recommendation:* strike
`users-heads` from `docs/07-character.md:67`, and add one sentence: *"the arrangement word names the box — square 18 · 14 · 12 for
the default and `-behind`, landscape 20×16 · 16×12 · 14×10 for `-wide` and `-level` — for every figure, so swapping the figure never
moves the box and swapping the arrangement always does."* Nothing about `user-4`'s own box (one icon is not a rule).

**FM-5 — Review the container smalls, as C18 promised.** *Evidence:* §2.2 — a container's small steps the mark 0.5–1.0 at 16
against the 1.0 that retired `info-small`. *Recommendation:* look first (E-1); if `x-circle-small` reads as the same size at 16 it
should go as `info-small` did — before launch it is free, and since a family ships every master it goes whole.

**Not proposed: a sentence for C28 about fills and bars.** C28 is silent on a level that is a fill or a bar inside a body, and eight
queued names would meet that silence (§5.2); but a rule written from zero drawings is the pattern C24's history warns against — a
general form written and *"withdrawn the same day"* (`docs/07-character.md:64`). The first battery board decides what such a level
needs, and the rule can be written from it. `volume-plus` / `-minus` — controls, not levels — are card 1.16's question already
(`stale-statements.md:94-101, 464`).

**FM-6 — `language-2` and `language-3`: keep the two names, or retire them.** *Evidence:* §1.2 — the same whole icon as `globe` /
`globe-2` at all three masters in both styles (4 concepts, 24 files); recorded at `docs/07-character.md:78`; C29 retired four `-3`s
on a weaker version of the same test. *Recommendation:* keep — a customer searching "translate" finds a globe, which is why the tags
differ (`translate, globe, world, international`) — and say in C9 that a number may also mark a *different name* for one drawing, so
the next alias is a decision, not a surprise. Retire if Maruti would rather ship each drawing once.

**FM-7 — Variant cap, shared style words, and where a style word becomes a name (docs/09's pending ruling,
`docs/09-rule-audit.md:93`).** *Evidence only:* the 107 runs have 2–11 members, 88 have four or fewer and 19 have five or more
(`rotate-ccw` 11, `paintbrush` 8); numbers travel in 6 of 8 sibling sets and mean nothing across unrelated objects; the commonest
style word, *wide*, appears in 14 runs; seven queued relatives end in one of five words I picked, and nine more names pose the same
question under other lists (§3.2). *Recommendation:* no cap number yet — the measure cannot say "a different job, not a different
mood" (`docs/09-rule-audit.md:76`) and that is the whole question — but take FM-2 first, so a new number must say what it is; settle
those names before the first is drawn (a number and a tag if it is a shape of its base, a word if it is an icon of its own); revisit
the cap when the queue's 110 relatives land (§3.2).

---

## 10. For wave 5 to reconcile — never pick

| quantity | this card | elsewhere |
|---|---|---|
| how many families | **159** stems after size and number · **107** numbered runs · **128** stems / 108 families of two or more with `plus-circle`, `minus-circle`, `x-circle` unfolded | card 1.9 §2.1 (`findings-grammar.md:367-383`): **125** stems · 105 families · 96 object families of 378 concepts — folded by direction, circle, sort word, arrangement word, level word. Both reprint; the folding rule is reconstructed in `families.mjs` and reproduces all 105 named families |
| families that keep one ink **box** — **definition A**: the same 2 dp box exactly | **51 of 107** runs at all three masters (outline); at one master alone **52 · 52 · 55** at 24 · 20 · 16; 50 of 105 over the grammar partition (51 at 24 alone); 53 of 108 over this card's (54). Published `dist/metrics.json` boxes: 51; 52 · 52 · 55 | not counted by card 1.16 under this definition; A at 24 is 52 |
| … **definition B**: every member's 2 dp box within 0.01 of every other's (lint's tolerance for a declared box, `tools/lint.mjs:349`) | **53 of 107** at all three masters; at one master alone **53 · 54 · 55**; 52 of 105 over the grammar partition (52 at 24 alone); 55 of 108 over this card's (55). Published boxes: 53; 53 · 54 · 55 | card 1.16 (`stale-statements.md:279, 352-357`): **53 of 107** name-families at 24, "excluding `-small`/`-large`" — **reproduced as B at 24** (B at all three masters is also 53). Which definition 1.16 used is read off the count, not off its script, which is in no repository. The two differ on `cursor` (24, 20) and `home` (20) alone, by at most 0.0132 units (under 0.011 px at a 16 px render); wave 5 picks the definition |
| families that keep one **drawing** | — | card 1.9 §2.1 row 1 (`findings-grammar.md:379`): **19 families** whose *body* is one drawing in every member at every master. A drawing and a box are different quantities |
| identical drawings under two names | 2 whole-icon pairs at 3 masters · 5 at 16 only · 15 outline-only pairs · **9 Library twin groups, 22 names** | rule-register G7 (`rule-register.md:338-372`): 9 groups, 22 concepts, 2 complete aliases, 5 more at 16; card 1.9 §2.3 / §6 (`findings-grammar.md:418-444, 678`): **7 body pairs** identical at one master. Agrees with the register; the grammar's 7 count bodies, not files |
| concepts without tags | 17 of 485 (468 with) | ledger §2.9 (`exceptions-ledger.md:531-537`) and register G2 (`rule-register.md:333`): the same |
| rows not approved on the sheet | **349 `[ ]`, 0 `[~]`**, from `git show 5933041:research/queue.md` | card 1.9 §1.5 (`findings-grammar.md:267`): *"349 rows not approved: 348 `[ ]` and `thumbs-down` `[~]`"* — read from the live sheet, a later state. Same total |
| queued composites | **110** rows `variant of` a shipped base (55 bases) · 23 on queued bases · 216 with no base | card 1.9 §1.5: **at least 38** corner-badge · 19 strike · 21 enclosure, by a name's last word and checked by hand. Different definition: the sheet's own `variant of` against a kind of name |
| the sort box | 13 of the 17 `sort*` names stand on 18×15 · 16×13.5 · 14×12; the other four on three boxes | ledger §2.3 (`exceptions-ledger.md:281`): 13 concepts declare it; `stale-statements.md:281`: holds for 13 of 17. Agrees |
| members of the volume family | 7 members · 5 anchored · 1 state · 3 marks beside the body · 2 levels | C28 (`docs/07-character.md:68`): 5 named; stale-statements 1.6 (`:94-101`): 7 members, 5 anchored. Agrees with 1.6 |
| the ring's mark | outline mark long side 10.28 · 7.80 · 6.58 → 8.60 · 6.58 · 5.70; step 1.68 · 1.22 · 0.88 | card 1.9 §1.4 (`findings-grammar.md:243`): **air** to the container 2.5 · 2.01 · 1.96 / 3.53 · 2.75 · 2.49 — a different quantity of the same drawings |
| `volume-off` at 16 | ink centre 7.5, 8 | card 1.9 §1.3 (`findings-grammar.md:214-218`): 0.5 left of centre. Agrees |
| the checkbox's tick at 16 | exact only for `checkbox-4`; the others not exactly any ring tick | card 1.1 §3.3 / `findings-grammar.md:427`: 0.106 · 0.172 · 0.258 off. Consistent; this card does not re-measure the residuals |

---

## 11. Handover — what this card measured but does not own

| finding | belongs to |
|---|---|
| FM-1 to FM-7 as decisions | **5.2** decision agenda; FM-1 and FM-3 join the plan's list of decisions that expire at launch (`plans/set-and-rules-audit.md:139-144`) |
| the stale statements: C27's `users-heads` (`docs/07-character.md:67`); the sheet's `trash` row note (*"trash family C4 …"*, row 27 at the pin); C9's composite clause written in `docs/07-character.md:49` alone — `CLAUDE.md:193` carries neither of C9's two numbering sentences and the icon skill has no C9 text. `plans/sort-family.md:9` is already 1.16's (`stale-statements.md:279`) — §6 adds the three-master count, both definitions, the kinds and the rule | **1.16** stale statements |
| findings-register entries by kind — (1) the 23 tag faults and the checkbox numbering; (2) the one-box statement, `language-2` / `-3`, `users-heads` and C9's composite clause written in one place; (3) the four `users-4*` without the group's words, the container-small step, `user-4`'s box, C28's silence on fills and bars, and the style-word names | **3.2** findings register |
| a numbered-run check — gaps, same-tag pairs, an antonym in the tags, a size named as a number — as a warning, never an error | the primitive-drift linter's backlog (`CLAUDE.md` open item 5), with card 1.9's P7; and **3.5** if the severity proposal wants a row for tags (lint reads none, `exceptions-ledger.md:531-537`) |
| the size families, the 14 same-tag pairs and the six container pairs as rows for the wall | **4.1** (sorted by family) |
| queued names that would extend a shipped numbering — `arrow-up-left`, `-down-left`, `-down-right` against `arrow-up-right`'s five shapes; `chevrons-up` / `-down` / `-left` / `-right` against `chevrons-up-down`'s four; the eight `arrow-*-circle` / `chevron-*-circle` rows against their four and three shapes — and whether each ships one shape or all | **1.17** Polaris scope rulings; the sheet's owner |
| `layout-list` as four rows if C29 applies; the 12 `user-*` rows and the figure number | the sheet's owner, on Maruti's go (a change of scope) |

---

## 12. How to reprint, and the gate

Build the pin once, in scratch, then run any section:

    P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
    node tools/audit/families.mjs $P [section …]        # default: all sections, about a second

| document section | command |
|---|---|
| §0 the partition, names, roles | `node tools/audit/families.mjs $P census` |
| §1.1 the runs and their gaps | `… runs` |
| §1.2 identical drawings under two names | `… identity` |
| §1.3 tags | `… tags` |
| §1.4 numbers across sibling stems, checkbox's tick, the layout turns | `… travel` |
| §2.1 the step | `… sizes` |
| §2.2 containers | `… containers` |
| §2.3 lint's reading | `… lintcmp` |
| §3.1 the grid | `… grid` |
| §3.2–3.3 the sheet | `… sheet` |
| §4 figure families, `lab/figures.html` | `… figures` |
| §5 level families, amount words | `… levels` |
| §6 one ink box | `… boxes` |

The tool reads `src/icons`, `research/queue.md`, `lab/figures.html`, `tools/lint.mjs`, `tools/masters.mjs` (for `SIZE_STEP` and
`MASTERS`; if a pin directory has none it falls back to the working tree's and the `census` line says so), the three files that
state C9 (`docs/07-character.md`, `CLAUDE.md`, `.claude/skills/icon/SKILL.md`) and (for one cross-check in `boxes`)
`dist/metrics.json`, all from the pin directory; the build is the plan's gate step, not a need of the tool. Nothing it prints is
estimated. The commit hashes cited (`d19ec13`, `fb444bc`, `279ff1c`, with `0e63335` for the C27 timing) and the line numbers are read
from `git log` / `git show` and the files; the pin has no history.

`node --test tools/audit/families.test.mjs` runs 27 tests: 22 on synthetic sets (a plus whose large is bent by a quarter unit and a
plus whose small is cut half a unit short, a stricter spec read from a stub pin, a ring and its small, a volume family with a moved
speaker and two C28 negatives, a layout set with a drifted header, same-tag collisions, runs whose members are 0.0132 apart, a sheet of
eleven rows with a one-shape base, a stub lint …) and 5 on the archived pin, where the grammar card's partition must come out as card 1.9
states it, every headline figure of §1–§6 must match this document, and the CLI must print a section and refuse an unknown one.
`node tools/audit/families-mutations.mjs` breaks the tool on purpose, one change at a time, in a temporary copy (`--list` names the
breaks, a word filters them); a break that no test catches fails the script. This is what §0 reports: 55 breaks, 54 caught, one
equivalent.

**Gate** (run after the last edit): `node tools/lint.mjs` in the repository ends `2910 drawings · 2848 clean · 62 warned · 0 failed`
(exit 0), byte-identical to the capture taken before the first measurement; `git diff --quiet 5933041 HEAD -- src/icons` is true,
`git status --short src/icons` is empty and `shasum lab/manifest.json` is unchanged (`161c9314…`). `node --test tools/audit/*.test.mjs
tools/audit/refs/*.test.mjs`: **292 pass, 0 fail** at the last run — 182 at the start, 27 of them this card's, the other 83 from
other cards' files (`optical-probe` 15, `polaris-scope` 68) that appeared in `tools/audit/` during the run; that total moves as those
cards add tests. `node tools/audit/families-mutations.mjs` ends `55 deliberate breaks … 54 fail the suite; 1 survive … [equivalent …]`
(exit 0).
