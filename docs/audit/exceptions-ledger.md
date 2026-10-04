# Exceptions ledger — every way a drawing escapes a rule

Audit card **1.13** (`plans/set-and-rules-audit.md:440-442`). Not an axis: the plan calls the
ledger the **instrument** — the symptom readout for F1–F13 (`plans/set-and-rules-audit.md:356-358`).
It leans hardest on **F2** (one apparent size), **F7** (crisp at 16), **F8** (air that reads even)
and **F9** (contact grammar).

**Pinned tree: `5933041`.** 485 concepts × 3 masters × 2 styles = 2,910 files. At the start of this
work `git status --short src/icons` printed nothing and `git diff --quiet 5933041 -- src/icons`
returned 0, so every number below was measured on the working tree, which is the pin.
`node tools/lint.mjs` at the start and at the end of this work: **2,910 drawings · 2,848 clean ·
62 warned · 0 failed**. The lint line this whole card circles is `tools/lint.mjs:216`
(`const hasComment = /<!--/.test(src);`). Nothing in `src/icons/`, `tools/lint.mjs`,
`tools/geometry.mjs`, `tools/build.mjs`, `research/`, `lab/`, `dist/`, docs 01–09 or `CLAUDE.md` was
touched. This card wrote three files: this document, `tools/audit/notes.mjs` and
`tools/audit/notes.test.mjs`.

**Independently checked.** A fresh reviewer (Fable) who had not seen my scripts re-measured about
190 figures in this document with its own census, its own parser of lint's output and its own gap
scripts: 176 held; 13 were wrong and one verdict rested on a single icon; of about 95 citations
read, 5 pointed at the wrong line or the wrong file. The wrong figures were a concept count I had
not measured, the sort family's per-master split, a box concept counted twice, the accounting of
which marks a C-row sizes, a sample size, a tolerance left unstated, and a count of names on one
line of doc 07; the wrong citations were four line pointers and one attribution of a comment to the
wrong file of a pair. All are corrected in this version, and the one-icon verdict (§2.7) now stands
on a set-wide measurement the review prompted — 44 readings in 43 files that pass only by lint's
0.01 slack. The reviewer also found four escapes the ledger had missed (§2.15). One correction
was rejected: the reviewer placed `draft-svg.mjs`'s note writers at lines 48–55; they are at
**49–56** (`keyline` at 49, `optical` at 56, the free-text note at 57 — checked in the main session
against the file), which is what `tools/audit/notes.mjs` says. Where my re-measurement differs from
the reviewer's — the 1.49 band — both numbers and the reason are in §5.

**The question this card answers:** *of every way a drawing in this set gets past a rule — a
declared note, a free-text comment, or a warning somebody called expected — which are agreed
exceptions, and which are missing rules wearing a note?*

---

## 0. Method, and how to read a row

**The instrument is new: `tools/audit/notes.mjs`.** It lists every HTML comment in every drawing
as JSON — a plain data file other tools can read — recording which key it declares, what value,
whether lint would read it, the free-text lines, and an off-grid census that mirrors
`lint.mjs:291-300` number for number and then splits each value by the command it sits in. "Would
lint read it" is decided with lint's own regexes — the text patterns lint uses to recognise each
note, copied line for line (`lint.mjs:65-147` for the note parsers, `:319` for `optical:`, `:322`
for `keyline:`, `build.mjs:27` for `tags:`). It is audit-only; lint never imports it. Its test
(`notes.test.mjs`, 21 tests) reproduces figures the audit already states — `trash` at 24 carries
five distinct off-quarter values (`enforcement-gap.md:66-67`), every file carries a comment
(`:60-61`) — and then runs every one of the 2,910 shipped files through `lintSource`, lint's own
exported per-file check, and asserts that the two agree field by field: off-grid count and values,
which branch lint printed, mark, box, grows, gap, anchor and optical. Run:
`node tools/audit/notes.mjs --consistency`. The census scripts that read its JSON beside the lint
output live in the session scratchpad and are not part of the repo; every figure they produced is
reproducible from the two inputs.

**Three kinds of finding, never mixed in one line**, marked in the tables as **(1)**, **(2)**, **(3)**:
(1) a drawing disagrees with a stated rule · (2) a rule disagrees with another rule, the docs or the
code · (3) nothing covers it. A dash means the row is not a finding of any kind.

**Four verdicts**, the card's own vocabulary:

| Verdict | Means |
|---|---|
| **agreed** | Maruti agreed it, it is written down where decisions live (a doc 07 C-row, a dated decision, a plan), and lint holds the drawing to what it declares |
| **missing rule** | the same note, or the same shape of note, recurs often enough that a rule should say it — a rule hiding in the exceptions column. Each such row proposes the rule it would be |
| **unverified** | lint takes the note on trust: nothing checks that the declared value is the right one, or the deviation is held only by prose lint cannot read |
| **stale** | the note, or the sentence that authorises it, no longer measures true |

A group can carry two verdicts when its files split. "Files" means drawings (one SVG). "Concept"
means a name without `-filled`. Every count is at the pin; every `path:line` is in this repo.

---

## 1. The census in one table

**What the eye sees first:** every one of the 2,910 drawings carries at least one comment, and the
one rule that comment silences (the grid) silences it on 1,967 of them. Beneath that, eight declared
keys cover 4,422 notes; six of them are verified by lint against the drawing, one (`optical:`) is
read and never checked, one (`tags:`) is not read by lint at all. Below the notes sit the escapes
that leave no mark in the file: a check that does not run, a pair of paths lint skips, a slack.

| Group | Files | Concepts | 24 · 20 · 16 | outline · filled | What lint verifies (`lint.mjs`) | Where agreed | Axis | Kind | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **free-text comment** (the off-grid hatch) | 2,910 carry one; **1,967** are off-grid | 485 / **351** have an off-grid drawing | 646 · 662 · 659 off-grid | — | **nothing** — any comment turns the warning into a note (`:216, :299`) | `docs/01:184-185, 376-377`, `CLAUDE.md:272`, `docs/02:101` (per decimal; register D5/D6, kind P, *"0 drawings"*); `docs/09:28` says drop it | F7, F3 | (2) · (3) | **stale** rule · **missing rule** (the tangent-vertex exception) |
| `keyline: mark` | 816 | 136 | 272 · 272 · 272 | 408 · 408 | longest side ≤ the file's ceiling, warning (`:338`); centre ±0.5, warning (`:361`) | `docs/01:105-114` (register B4, kind P — the 77 marks of day one); C8 for `-large` | F2, F4 | (3) | **agreed** as a category · **missing rule** for the size inside it |
| `box: WxH` | 338 | 57 | 114 · 112 · 112 | 169 · 169 | ink = declared size to 0.01, **error** (`:349-350`) | `docs/01:116-131` (per icon, by eye; register B5, kind 1→ — one icon, `folder`) | F2, F6 | (3) · (2) | **missing rule** — three shared boxes are keylines in all but name |
| `optical: dx dy` | 270 | 45 | 90 · 90 · 90 | 135 · 135 | **nothing** — the centring target moves by the declared amount (`:319-321, :361`) | C14, C15 (register B8 kind 1→, B9 kind P), C18; 7 concepts only in their own file | F2, F7 | (2) | **unverified** · **stale** (info-3, by C18's own words) |
| `glyph: dot` / `numeral` | 90 / 6 | 15 / 1 | 30 · 30 · 30 / 2 · 2 · 2 | 45 · 45 / 3 · 3 | the carve-out is applied and warned at `GLYPH_GAP` (`:395-396, :434-439, :461-466, :490-494, :522-525`) | C19 (register F3, kind P) | F8 | (1) | **agreed**; 6 numeral concepts are missing the note |
| `grows: L R T B` | 54 | 18 | 18 · 18 · 18 | 0 · 54 | the filled box stands proud by exactly this, to 0.01, **error** (`:159-172`) | C17; `docs/01:243-251` (register C-5, kind P — a census of all 351 pairs then shipped) | F13 | — | **agreed** |
| `anchor: NAME` | 30 | 5 | 10 · 10 · 10 | 15 · 15 | ink inside the anchor's box and on one of its x edges, **errors** (`:567-615`) | C28 (register B6, kind 1→) for 3 of the 5; the sheet for all 5 (`research/queue.md:852-853`, 2026-09-26) | F3 | (2) | **agreed**; 2 members in no doc |
| `gap: N` | 10 | 6 | 3 · 2 · 5 | 3 · 7 | only that *something* in the file is under 1.5 (`:509-515`); the number itself is **not held** | `docs/07:79` for 3 concepts; `plans/facing-gap.md:9-12` (Maruti, 2026-09-28) for 2; the board alone for `sort` (register F4, kind 1→) | F8 | (2) · (3) | **agreed** (8 files) · **unverified** (2 files, `sort`) · **missing rule** (the 2 dp tolerance, §2.7) |
| `tags:` | 2,808 | 468 | 936 · 936 · 936 | 1,404 · 1,404 | nothing; `build.mjs:27` reads it | C9 (register G2, kind P) | — | (1) | not an escape; 17 concepts (102 files) lack it |
| **sort family warnings** | 60 | 12 | 12 · 24 · 24 | 30 · 30 | warns 72 times (12 · 30 · 30) and blocks nothing (`:648-652`) | `plans/sort-family.md:25-28` (Maruti, 2026-10-03, in a plan headed WITHDRAWN); no note, no C-row (register I3, I4) | F8, F11 | (1) · (3) | **agreed, undeclared** — no vocabulary can express it |
| **`trash` at 20 and 16** | 2 | 1 | 0 · 1 · 1 | 2 · 0 | warns twice | C22 (`docs/07:62`), `docs/09:31` — "lint is wrong" | F8 | (2) | **agreed**, lint vs rule |
| **8 byte-identical filled files** | 8 | 4 | 4 · 4 · 0 | 0 · 8 | pair box: declared `grows:`, confirmed | C17 | F13 | — | **not an escape** — C17 working |
| **angle grants held by prose** | — | 27 named in `docs/07:78` + 3 family pointers; 193 concepts state a degree figure | — | — | **nothing** (`docs/01:201`, C30) | `docs/07:78`, C11, C12, C22, C25, C30 | (angles) | (3) | **unverified** |
| **radius exceptions held by prose** | — | `message-6`, `message-7` (C26); 11 concepts off-tier (`findings-corners.md` §4.2) | — | — | **nothing** | C26 | F2 | (3) | **unverified** |
| **filled-cut and pair choices held by prose** | — | C18, C20, C21, C22, C23, C24 | — | — | **nothing** (`enforcement-gap.md` §4 F9) | the C-rows | F13 | (3) | **unverified** |
| **silent ±0.5 tolerances** | 164 drawings sit >0.01 off centre and pass; **8** rest on exactly 0.50 (`watch-2` ×6, `volume-off` at 16 ×2) | — | — | — | keyline match ±0.5 (`:352`), centre ±0.5 (`:361`) — numbers no document chose | nowhere; `volume-off`'s 0.5 is agreed in its own prose only, against C28's *"centred as its own icon"* | F2 | (2) · (1) | **missing rule**, code vs C10/C12; one agreed deviation riding on it with no note |
| **the knockout check that does not run** (§2.15) | **414** | **138** | 138 · 138 · 138 | 0 · 414 | §5c runs only `if (areas.length && ds.length === 0)` (`:459`): a shape-filled file that keeps one stroke is never knockout-checked | nowhere; the rule (C22, `docs/01:332-336`) names every filled drawing | F8, F13 | (2) | **missing check** — the code is narrower than the rule |
| **paths that touch or cross are exempt** (§2.15) | 985 have a touching pair; 128 a crossing pair | 257 / 66 | 335 · 326 · 324 touching | — | a pair within 0.1 is read as joined and skipped (`:401`); a crossing pair is skipped for its whole length (`:394`) — 1,544 and 199 of 7,554 stroke pairs | nowhere (`enforcement-gap.md` §5 rows 5–6) | F9 | (3) | **missing rule** — no contact grammar exists |
| **the 0.01 slack** (§2.15) | **43** | **32** | 9 · 17 · 17 | 20 · 23 | 44 readings sit in [1.49, 1.50) and pass only because every gap check tests `< floor − 0.01` (`:403, :438, :465, :493, :499`) | nowhere; §6 says *"a literal 1.5"* | F8 | (2) | **missing rule** — an undeclared tolerance |
| **a `>` inside a note value** (§2.15) | **0** | 0 | — | — | every note regex stops at the first `>`, so lint silently reads no note; no error, no warning | — | — | (3) | a hole in the vocabulary, empty today; `notes.mjs` reports it |

Zero-counts, measured and worth a line each: **0** notes lint cannot parse · **0** keys declared
twice in one file · **0** `keyline:` words other than `mark` · **0** misspelt keys (the only
lowercase `word:` opening a free-text comment is `volume:` ×3, a relative's name) · **0** `optical:`
notes that parse to NaN or declare `0 0` · **0** coordinates over the decimal ceiling · **0** area-form
paths inside an outline file · **0** drawings printing "no keyline match" · **0** undeclared
filled-vs-outline box differences · **0** marks over their own ceiling · **0** curve commands
(C S Q T) anywhere in the set.

---

## 2. The groups, one by one

### 2.1 The free-text comment — one hatch for the whole set

**What it looks like.** Every drawing opens with a construction line: *"Square can · ribs, one rib
at 16: C3 drawn to the numbers…"* (`src/icons/24/trash.svg:3`). They are good notes — 629 of the
3,035 cite a C-row or a § — and at 123 characters median they are the best record of intent the set
has. But `lint.mjs:216` asks only *is there a comment*, so the construction line is also the thing
that makes the grid rule unenforceable.

**Measured.**

| | 24 | 20 | 16 | all |
|---|---|---|---|---|
| drawings with at least one off-grid value | 646 | 662 | 659 | **1,967 of 2,910 (67.6%)**, on 351 of 485 concepts |
| off-grid values | 8,590 | 9,274 | 9,165 | **27,029** |
| of which on a straight command (M L H V and relatives) | 4,169 | 4,283 | 4,292 | **12,744 (47.1%)** |
| on an arc's end point | 4,047 | 4,173 | 4,119 | 12,339 |
| an arc's own parameters (rx ry rotation) | 374 | 818 | 754 | 1,946 |
| drawings whose off-grid values are arc-derived only | 28 | 25 | 26 | 79 |
| drawings whose off-grid values are straight only | 41 | 41 | 44 | 126 |

Lint prints "documented exception" 1,967 times and "undocumented" **0** times
(`grep -c` on the full run). Every file has one or two free-text comments (min 1, max 2); none has
none.

**Does the comment say what it corrects?** The rule as written (`docs/01:184-185`, `:376-377`,
`CLAUDE.md:272`) is per decimal and cannot be checked mechanically — `enforcement-gap.md:77-78`
already said so. Three proxies, all reported as proxies:

| Proxy for "the comment explains the off-grid value" | drawings of 1,967 |
|---|---|
| a free-text comment names at least one of the off-grid values verbatim (`9.54`, not `19.54`) | **98 (5.0%)** |
| a free-text comment uses a construction word (`KEYWORDS` in `notes.mjs`: off-grid, tangent, optical, decimal, intersect, chamfer, taper, rounded to, √, sin/cos/tan, eighth, quarter, centred to) | 621 (31.6%) |
| either | **653 (33.2%)** |
| the narrower word list `enforcement-gap.md:75-76` describes (off-grid, tangent, rounded, optical, construction) | 518 — against its 493; see §5 |
| no explanatory proxy at all, and no declared note other than `tags:` | **684 (34.8%)** |

So about a third of the off-grid drawings explain themselves in some form, about a third carry
nothing but a `tags:` line and a description of the shape, and the rest sit between. `trash` at 24
is the fair example: five distinct off-quarter values, a comment that explains the 4° taper and
names none of them. The worst single file is `gear-3-filled` at 24: **165** off-grid values, 114
distinct, 55 on straight commands.

**What rule is actually in force.** Not the one written. `docs/01 §3` permits two exceptions —
arc-derived decimals and commented optical corrections — and `severity-proposal.md:117` found that
**1,888 of 2,910 drawings put a straight-segment coordinate off the grid**, which is neither: it is a
vertex computed as a tangent or an intersection (`folder`'s chamfer corner, `trash`'s tapered wall,
every tooth of every gear). That is the rule Maruti draws to, and no document states it.

**Where the rule lives.** The register files it as D5 and D6 (`rule-register.md:188-189`), kind P,
derived from *"0 drawings"* — the one principle in the register that no drawing has ever followed.
`docs/02:101` and `SKILL.md:75` state it as well. `stale-statements.md` lists only the docs/02 copy
(its entry 3.4) and nothing for `CLAUDE.md:272` or `docs/01:184-185, 376-377`; those three lines
are not yet on Maruti's list and should be.

**Kinds.** (2) the rule is per decimal, the code is per file (`enforcement-gap.md` §6 row 2). (3) the
tangent-vertex case has no rule at all.

**Verdict: stale, and a missing rule.** `docs/09:28` ruled on 2026-09-20 that the literal rule is
dead and the declared notes replaced it; that verdict is unactioned (`enforcement-gap.md:79-82`). The
proposal is `severity-proposal.md` §5 row 1, in that order: (1) write docs/01 §3's third exception
for a tangent- or intersection-derived vertex; (2) measure the residue; (3) narrow the hatch from
*any comment* to *a declared note*. Not the other way round — 1,888 drawings sit behind it.

**Axis.** F7 first: 659 drawings at 16 carry 9,165 off-grid values, and at 16 a quarter unit is a
quarter pixel. `findings-grid.md` (card 1.6) measures where those edges land; this card only counts
them. F3 second: the armature question is whether the same off-grid vertex recurs across files,
which `findings-primitives.md` answers.

### 2.2 `keyline: mark` — a category that works, and a size nobody set

**What it looks like.** 136 concepts — 28% of the set — say *I am a mark, not a silhouette*. They
stay under a ceiling (18 · 14 · 12) and on the centre, and nothing else is asked of their size
(`docs/01:105-114`: *"Marks have no minimum size — only a ceiling and a centring requirement"*).
Lint confirms the ceiling (`:338`) and the centre to ±0.5 (`:361`), both as warnings; at the pin
**0** marks exceed their own ceiling (the 8 · 30 · 30 files past the default ceiling are all
`-large`, whose ceiling C8 lifts to the margin edge, `masters.mjs:56-57`).

The register files the category as B4 (`rule-register.md:98`), kind P, derived from *"the 77 marks
shipped on day one"*. One cost of the category is already measured elsewhere: at 16 only **42 of
136** mark outlines have all four outer edges on pixel lines, against 276 of 288 silhouette-keyline
icons (`findings-grid.md:249-256`) — a centred mark lands on the pixel grid only when its width is
an even integer, and nothing about a mark's size asks for that.

**Who.** chevron 36 · arrow 21 · rotate-ccw 11 · check 8 · menu 6 · sliders 5 · chevrons-up-down 4 ·
cursor 4 · list 4 · maximize 4 · text 4 · hash 3 · minus 3 · play 3 · plus 3 · x 3 · code 2 · grid 2
(`grid-3`, `grid-4`) · more 2 · refresh 2 · sort 2 (`-ascending`, `-descending`) · bold · chart-bar ·
filter-2 · send. Every concept carries the note on all six files; no partial coverage.

**Measured — the size inside the category.**

| | 24 | 20 | 16 |
|---|---|---|---|
| distinct outline mark sizes (W×H) over 136 concepts | **67** | 70 | 65 |
| longest side, smallest → largest | 10 → 19 | 9 → 16 | 8 → 14 |
| mark files whose box is within 0.5 of a silhouette keyline anyway | **52 files / 26 concepts** | 76 / 38 | 78 / 40 |

At 24 the longest side falls on a whole unit for **124 of 136** concepts, and on **18 or 15 for 69**
(18: 32 concepts, among them `bold`, `chart-bar`, `code`, every `cursor`, three `maximize`, `send`,
all five `sliders`, `text` — the ceiling used as a size; 15: 37, the arrows and `hash`, `grid-3/4`,
`filter-2`, `text-2/4`, `sort-*`, `maximize-2`). The 12 off whole units are `chevrons-up-down` ×4
(13.18 · 13.86 · 14.18 · 14.86), `list-bullet` ×2 (17.5), `list-ordered` (17.99), `rotate-ccw`
×4 (17.79 · 17.88) and `code-2` (17.88).

**Which of those sizes a rule states.** The accounting used here: a mark is *covered* when a C-row
states its length in units — C12 for the 36 chevrons (14 · 11 · 17, flat 16 · 13 · 19), C11 for the
8 checks (16 · 13), C16 for the 16 `arrow-<dir>` and their `-2` `-3` `-4` (15), C17 for the 6
`menu` (lines 15) and the 2 `more` (rows 15), C8 for the 3 `plus` (18 · 15 · 12). That covers
**71 of the 136**. `minus` and `x` are counted as *not* covered: C8 says they have three sizes and
gives the step between them, but no row states the default's length. The other **65 concepts (390
files)** have a size no rule anywhere names — `rotate-ccw` ×11, `sliders` ×5, `arrow-up-right` ×5,
`chevrons-up-down` ×4, `cursor` ×4, `list` ×4, `maximize` ×4, `text` ×4, `hash` ×3, `minus` ×3,
`play` ×3, `x` ×3, `code` ×2, `grid-3/4`, `refresh` ×2, `sort-ascending/-descending`, `bold`,
`chart-bar`, `filter-2`, `send`. Each was picked by eye and is recorded in its file. (Counting
`minus` and `x` as covered by C8's step rule gives 77 / 59 instead; the stricter reading is used
throughout this document.)

**The symptom that matters (F2).** Six families split between the mark ceiling and a silhouette
keyline, measured on the 24 outline headlines: `grid` / `-2` / `-5` / `-6` / `-7` fit the 18 square
while `grid-3` and `grid-4` are 15 × 15 marks; `filter` / `-3` / `-4` fit the square, `filter-2` is a
15 × 10.5 mark; `chart-bar-2…-5` fit the square, `chart-bar` is a 13.5 × 18 mark; `maximize-5` fits
the square, `maximize` / `-3` / `-4` are 18 × 18 marks and `maximize-2` is 15 × 15; `refresh-2` fits
the 20 circle, `refresh` and `refresh-3` are 18 marks; the `sort` family is on an agreed 18 × 15 box
while `sort-ascending` / `-descending` are 15 × 15 marks. A toolbar that shows `grid` beside `grid-3`
shows two sizes. `docs/01:113-114` warns against exactly this — *"if you find yourself reaching for
mark on something that depicts an object, you have the wrong keyline"* — and 13 of the 136 depict
something (`chart-bar`, `sliders` ×5, `maximize` ×4, `grid-3`, `grid-4`, `filter-2`).

**Kinds.** (3) for the size: no rule covers it. (3) for the split families. Nothing here is a
drawing disagreeing with a stated rule.

**Verdict: agreed as a category, a missing rule for what sits inside it.** The proposal, for the
decision agenda: *a mark's longest side is a whole number of units at 24, and is 18 or 15 unless a
C-row gives the family its own ladder (C8, C11, C12, C16, C17).* Measured against the pin: 124 of
136 already keep the first half, 69 the second; the 65 concepts with no C-row size would be the
ones the rule reaches. Second proposal, eye-only: *numbered variants of one object share one keyline
class* — settled on the wall (card 4.1), where `grid` and `grid-3` sit in one row.

### 2.3 `box: WxH` — three keylines wearing a note

**What it looks like.** `docs/01:116-131` introduces the agreed box as *"a decision about one icon,
recorded in the file, not a new keyline"*, first used by `folder` on 2026-09-20 because the 20 × 16
landscape keyline read squashed as the masters shrank. Lint holds the drawing to the declared size
to 0.01 as an **error** (`:349-350`) — the strictest check in the system, and it passes on all 338
files.

The register files it as B5 (`rule-register.md:99`), kind 1→ — derived from one icon — and says
of it *"the mechanism outgrew its derivation by 57×"*. `findings-scaling.md:421-441` measured the
other cost: of the 56 three-master box concepts, seven hold their aspect within 2% and nine drift by
more than 12%, the worst `attachment-2` at 33.1% — the escape hatch drifts worse than the keyline it
escapes (`:421`). At 16, 48 of 56 box outlines have all four edges on pixel lines
(`findings-grid.md:251`).

**Who.** 57 concepts. 56 declare a box at all three masters; `microphone-5` declares `14x20` at 24
only, and its comment says why (*"narrower than the portrait keyline at 24, declared as its own box
for that master; at 20 it is a 6×10 capsule in the keyline cradle"*, `src/icons/24/microphone-5.svg:4`),
and at 20 and 16 it fits the portrait keyline (lint headlines). That partial note is correct.

**Measured — how many boxes there really are.** 20 distinct strings per master, 59 in all; one
string, `10x14`, is shared across masters (`italic` at 20, `attachment` at 16). They cluster:

| Box (24 · 20 · 16) | concepts | who |
|---|---|---|
| **20 × 18 · 16 × 14 · 14 × 12** — the folder box | **18 at 24, 17 at 20** | `briefcase`, `camera` + `-3` `-4` `-5` `-6`, `copy-3`, `desktop` + `-2` `-3` `-6`, `folder` + `-2` `-3`, `heart` + `-2`, `keyboard-2` (24 only), `presentation` |
| **18 × 15 · 16 × 13.5 · 14 × 12** — the sort box | **13** | `sort`, `sort-alpha-*` ×6, `sort-numeric-*` ×6 (`plans/sort-family.md:46`) |
| 20 × 19 · 16 × 15 · 14 × 13 — the alert box | 4 at 24, 5 at 20 and 16 | `alert-triangle` ×4; `keyboard-2` joins it at 20 and 16 |
| everything else | 22 concepts, one box each | `attachment`, `attachment-2`, `clipboard-4`, `gear`, `gear-2`, `gear-3`, `italic`, `key`, `key-5`, `key-6`, `keyboard`, `link-3`, `map-pin-4`, `microphone-5` (24 only), `sort-2`, `sort-3`, `star`, `toggle-on`, `toggle-on-2`, `watch`, `watch-2`, `wrench-2` |

At 16 the folder box and the sort box coincide at 14 × 12, so **30 of 56 concepts declare the same
box at 16**. Three shared boxes account for **35 of the 57 concepts (210 files)** — `keyboard-2`
counted once, although it stands on the folder box at 24 and the alert box at 20 and 16. A note
written for one icon's proportion is now the fifth and sixth keyline of the set — the only
difference from the four in `masters.mjs:33,38,43` is that nothing names them, and that lint holds
them to 0.01 where it holds a real keyline to ±0.5.

Two smaller readings. **Only 2 of 56** concepts keep exactly the same width-to-height ratio at all
three masters (`sort-2`, `wrench-2`); 3 hold it within 0.5% (`star` joins), 5 within 1%, 7 within 2%
— the last being `findings-scaling.md:421-441`'s figure. The box is re-chosen per master, as
`docs/01:128-131` says `folder` was (1.11 · 1.14 · 1.17). And **15 concept-masters** declare a box
within 0.5 of an existing keyline — `gear-3` at all three masters (the circle), `sort-2` at 24 (the
square) and at 20 and 16 (the circle), `wrench-2` ×3 (the square), `toggle-on-2` at 20 and 16
(landscape), `keyboard` and `link-3` at 16 (landscape), `attachment` and `attachment-2` at 16
(portrait). There the note is not opting out of a keyline; it is pinning an irregular silhouette
(gear teeth, a wrench head) to 0.01 where the keyline match would allow 0.5. A different job, worth
its own name.

**Kinds.** (3): no rule says when a shared box becomes a keyline. (2), mildly: `docs/01:127-131`
says "first used by `folder`" and "not a new keyline", and the set has made it one
(`stale-statements.md` entry 2.6 carries the "first used by" line).

**Verdict: missing rule wearing a note.** Proposal for the decision agenda: *promote the folder box
and the sort box to named keylines in `tools/masters.mjs` (20 × 18 · 16 × 14 · 14 × 12 and 18 × 15 ·
16 × 13.5 · 14 × 12), leave `box:` for the 22 genuine one-offs, and give the keyline tolerance a
decided number* — the last because a promoted box would move from a 0.01 error to a ±0.5 warning,
which is `enforcement-gap.md` §5 row 1's open question. Whether a 20 × 18 and an 18 × 18 read as one
size is the eye's (F2), on the wall.

### 2.4 `anchor:` — exact, verified, and two members short of the record

**What it looks like.** A level family keeps one body in place (C28). `volume-low`, `volume-none`,
`volume-x`, `volume-minus` and `volume-plus` each declare `anchor: volume` on all six files; lint
holds their ink inside `volume`'s box and on its left or right edge as **errors** (`:594, :602`) and
prints how many paths each shares (2 of 2, 1 of 1, 1 of 3, 1 of 2, 1 of 3 at 24). All 30 pass. The
note is a declaration of membership, not a licence, and lint never asks for its removal (`:605-607`).

**Where agreed.** C28 (`docs/07:68`, user decisions 2026-09-26) and `docs/01:133-140` name three
members: `-low`, `-none`, `-x`. `volume-minus` and `volume-plus` carry the same note and appear in
neither doc; the sheet has them *added 2026-09-26 · approved 2026-09-26* (`research/queue.md:852-853`)
— the same day as C28, so they were approved under it and the row was never widened to say so.
`CLAUDE.md:286-287` still says *"first `volume-low`, `-none`, `-x`"*; `stale-statements.md` entries
1.6 and 2.5 already carry the line. The register files the rule as B6 (`rule-register.md:100`),
kind 1→: *"derivation is strong (nine sets), application is one family"*.

**Verdict: agreed exception, verified.** The best-behaved note in the set: the only one that cannot
be wrong about its own number. Axis F3 — the body is literally the same path, and lint says so.

### 2.5 `optical: dx dy` — 270 files on trust

**What it looks like.** An open pointing mark moves toward its point (C14); the file declares how
far, and lint moves the centring target by that amount (`:319-321`) before testing it at ±0.5
(`:361`). Nothing checks the value — not against C14's per-shape anchor, not against C15's measured
recommendation, not between masters, not between the two styles. `enforcement-gap.md` §2.2 probed
it with `optical: -5 0` on a line five units off centre (accepted silently) and with a malformed
`optical: - .` (which parses to NaN and switches the centring check off); `plans/set-and-rules-audit.md:217`
and `severity-proposal.md` §5 row 2 record a third probe, `optical: 3 0`, silencing a 3-unit offset.

**Who and what.** 45 concepts, 94 distinct pairs, **every one single-axis** — each moves on one
axis only, so either `dx` or `dy` is 0 — outline and filled always identical (135 of 135
concept-masters), none `0 0`:

| Concepts | 24 | 20 | 16 | Recorded where |
|---|---|---|---|---|
| chevrons ×36 (`-down` `-up` `-left` `-right`, three shapes, three sizes) | 0.34 – 0.79 | 0.29 – 0.67 | 0.27 – 0.58 | C14 anchors (classic 0.5 · steep 0.61/0.65 · flat 0.55/0.4), the rest "scaled by ink height" |
| `info-2` | −0.45 0 | −0.39 0 | −0.39 0 | C18 (`docs/07:58`) |
| `info-3` | 0 −0.35 | 0 −0.27 | 0 −0.25 | C18 — which also says its justification is **stale** |
| `alert-triangle` ×4 | 0 −0.5 | 0 −0.5 | 0 −0.5 | **only the file** (*"after the lift"*, `src/icons/24/alert-triangle.svg`); no C-row, and not scaled by master |
| `play` ×3 | 0.95 · 0.8 · 0.9 | 0.71 · 0.6 · 0.64 | 0.59 · 0.5 · 0.51 | **only the file** (*"optical → 0.95 / 0.71 / 0.59 (C14, C15)"*, `src/icons/24/play.svg`) |

**Measured, two things only this card looked at.** (a) **39 of the 45** shifts at 16 are off the
eighth grid (0.38, 0.42, 0.59 …) and 78 of 90 at 24 and 20 are off the quarter grid. C18 rounded
`info-3`'s 16 shift to the quarter grid *for that icon* — *"at 16 a unit is a pixel, and 0.23 put
three horizontal edges on the softest half-pixel"* (`docs/07:58`) — and nothing says whether that
reasoning reaches the other 39. (b) C14's "scaled by ink height" across masters is **card 1.11's**
question, and the register has already measured it: *81 of 90 files are exactly what scaling by ink
height produces*, the chevrons to 0.007; the nine outside 0.05 are the `alert-triangle` outlines at
20 and 16 — eight files for four concepts, which the register's own sentence counts as *"the four
`alert-triangle` files"* (§5) — and `info-2` at 16, 0.075 wide (`rule-register.md:127-134`; the
plan's corrections table at `plans/set-and-rules-audit.md:78`). So the two concepts whose values no
doc records are also the two that do not follow C14's scaling — which is consistent, since nothing
told them to.

**Where the rule lives.** Register B8 (`rule-register.md:102`), kind 1→ — *"three shapes, one
family"* — and B9 (`:103`), kind P, the method. The picks are made on the optical sheet and approved
by row id (`SKILL.md:130-138`), so a process exists; what does not exist is a record of the value
outside the drawing for 7 of the 45. One sentence in docs/01 §7 is itself stale on this subject:
`docs/01:372-374` still advises *"shifting mass up by 0.5 units … comment it"* as a general optical
correction, which C14/C15 replaced with a per-shape, measured, declared shift
(`stale-statements.md` entry 1.4).

**Kinds.** (2): C15 says *"a value is never carried over from another icon"* and defines a
derivation; lint derives nothing. (1) possibly, for info-3: C18 itself says the lift's reason moved
and *"the shift wants re-deriving on a C15 sheet"*.

**Verdict: unverified escape, all 270 files; stale for info-3's 6.** `severity-proposal.md` §4.5
already proposes the fix — print the shift (it does) and warn when it exceeds C15's own measure for
that shape by a decided margin. This card adds one line to it: *record the `alert-triangle` and
`play` values in doc 07 or on the sheet, because today they exist only in the drawing.*

### 2.6 `grows:` — the model note

**What it looks like.** A filled drawing that stands proud of its outline twin says by how much, on
four sides, and lint holds both drawings to it to 0.01 as an **error** (`:159-172`). 54 files, 18
concepts, filled only (as the rule requires, `:222-224`), and lint prints *agreed growth* on all 54.
At the pin there are **0** undeclared pair differences — no "ink box differs" warning anywhere in
the run — so every filled box in the set either equals its outline's or declares why not.

**Who and what.** The value is arithmetic. For a line it is half the added weight — 0.5 · 0.25 ·
0.375 at 24 · 20 · 16, since the filled line is 2.5 · 2 · 2 against 1.5 · 1.5 · 1.25. For a dot it is
the same at 24 and 20, and at 16 it is 0.375 less the 0.125 by which C17's dated note grew the
**outline** dot's radius when the stroke went to 1.25 — 0.5 · 0.25 · 0.25. Top and bottom only for
stacked lines (`menu` ×6, `minus` ×3, `text-2`, `filter-2`); left and right only for upright bars
(`chart-bar`); three sides for a list whose bullets sit at the left (`list-bullet`, `list-bullet-2`);
all four for dot grids and dot rows (`grid-3`, `grid-4`, `more-horizontal`, `more-vertical`). At 16,
thirteen concepts declare 0.375 and five (the dot icons and `list-bullet-2`) declare 0.25.

**Where agreed.** C17 names `menu` and `more-*` and says *"later lists and grids"*; `docs/01:243-245`
adds `minus`. The seven not named anywhere — `grid-3`, `grid-4`, `list-bullet`, `list-bullet-2`,
`text-2`, `filter-2`, `chart-bar` — fall under C17's clause by its wording. The register files the
pair rule as C-5 (`rule-register.md:150`), kind P, derived from the census of all 351 pairs then
shipped, and the repeated-element rule as C-6 (`:151`), kind 1→. `findings-filled.md:43-52` counted
the same 54 of 54 matching and 0 undeclared. `CLAUDE.md:279-280` still says *"The 33 that differ
today … none yet noted"*; measured, 54 files, all noted (`stale-statements.md` entry 2.2).

**Verdict: agreed exception.** This is the pattern `severity-proposal.md:65-69` holds up as the
model — error plus declarable, verified exception — and the census bears it out. Axis F13.

### 2.7 `gap: N` — six concepts, three stories

**What it looks like.** A file whose air is agreed below the 1.5 floor declares its own number, and
lint uses it as the floor for §5, §5b and §5f in that file (`:239`). Lint errors on a note it cannot
read, on a number at or above 1.5, and on a note nothing in the file needs (`:232-238, :509-515`).
It does **not** check that the drawing holds the declared number — only that *something* is below
1.5 (`enforcement-gap.md` §5 row 15).

**Who, what, and what the drawing measures.** All ten, with lint's own *smallest measured* and the
air each number actually covers, re-measured with two instruments from `tools/geometry.mjs`:
`facingGap` reads the air between two ink edges that face each other, and labels each reading by
what the air is — `line` is air between a filled shape and a stroked line, `separation` a band
between two filled parts, `cut` a line cut out of a shape, `notch` a notch in the outer edge;
`selfGap` reads how close one open path comes to itself.

| File | Declares | Lint measures | What the air is | Agreed where |
|---|---|---|---|---|
| `24/attachment-4-filled` | 1 | 1.04 | the clip's path passing itself (`selfGap`) | `docs/07:79`, 2026-09-20 |
| `20/attachment-4-filled` | 1 | 1.00 | same | `docs/07:79` |
| `16/alert-triangle-2` | 1.25 | 1.28 | the wedge to the sloping sides | `docs/07:79`, 2026-09-20 ("measured 1.28") |
| `16/alert-triangle-4` | 1.25 | 1.28 | same | `docs/07:79` |
| `16/sort-filled` | 1 | 1.00 | the up arrow's head tip to the down arrow's shaft, filled | the **outline** file's comment, which argues about this filled drawing's air: *"declared as an agreed gap of 1"* (`src/icons/16/sort.svg`; a board approval); **no doc** |
| `16/sort` | 1 | **1.38** | the same pair, outline — 0.38 wider than declared | the same comment, in this file; it says nothing about the outline's own 1.38. **No doc** |
| `24/database-2-filled` | 1.48 | 1.48 | the cut between the two discs | `plans/facing-gap.md:9-12, 62` — Maruti, 2026-09-28, *"keep as is"*; *"rounding and invisible at any size"*. The file's comment says only *"Round discs, two, filled: shapes filled"* |
| `24/volume-off-filled` | 0.7 | 0.72 | **the air between the bar's stroked stub and the speaker's solid** (`facingGap` kind `line`) | `plans/facing-gap.md:9-12, 61` — the same ruling, which names *"bar end 0.72 · 0.8 · 0.39 and its 1.25 channel at 16"*. The file's comment: *"shapes filled, lines stay 1.5"* |
| `20/volume-off-filled` | 0.75 | 0.80 | same | same |
| `16/volume-off-filled` | 0.375 | 0.39 | same — and the same file's channel through the speaker measures **1.25** (kind `separation`) | the same plan for both readings (`:9-12, :61, :79`); C22's dated note (`docs/07:62`) records only *"its 1.25 channel … noted in its file"* |

Every declared number is the measured one rounded **down**, as the skill asks (`SKILL.md:83-88`,
*"round it down to what the drawing really holds"*): 1.04 → 1, 1.28 → 1.25, 0.72 → 0.7, 0.8 → 0.75,
0.39 → 0.375, 1.485 → 1.48. The one exception is `16/sort`'s outline.

Three stories. **Agreed in a doc or a plan, and honest** — eight of the ten files. `attachment-4`
and the two `alert-triangle` outlines are in `docs/07:79`, dated. `volume-off-filled` ×3 and
`database-2-filled` were ruled on by Maruti on 2026-09-28 in `plans/facing-gap.md:9-12` — *"stay as
shipped … are agreed exceptions → each gets a `<!-- gap: N -->` note, rounded down to what it
holds"* — and the notes landed in commit `20f3534` (`:18-19`). **Declared and measured, agreed only on
the board** — `sort` at 16. The argument for one pixel of white is in the outline file's comment and
is about the *filled* drawing's air (*"on the filled drawing: 1.75 · 1.5 · 1.0 … declared as an
agreed gap of 1"*); the filled file's own comment says only *"ends pulled in 0.375"*. Both files took
`gap: 1`, the filled one honestly (it measures 1.00) and the outline one not (it measures 1.38) —
the case `severity-proposal.md` §5 row 7 names. **Agreed, but the record and the number point at
different things:**

- `database-2-filled` at 24 declares 1.48 against a floor of 1.5 — a **0.02** shortfall from an
  arc-derived edge landing on the 2 dp grid, which the plan itself calls rounding. At 20 and 16 the
  same cut measures 1.49, inside lint's 0.01 slack (`:499`), so those files carry no note.
  `findings-air.md:454` reads the pixel as clear and says *"the note buys nothing a tolerance would
  not"*. **And it is not one icon.** Measured across the set, as lint evaluates each reading (glyph
  files left out, since their floor is 1): **44 readings in 43 files on 32 concepts sit in
  [1.49, 1.50)** and pass only because every gap check tests `< floor − 0.01`
  (`lint.mjs:403, 438, 465, 493, 499`) — 24 from §5b's own-opening check (`building`, `home`,
  `store`, `watch-2`, `wallet-2`, `megaphone-2`, `paintbrush-6`, `attachment` …), 19 from §5f (10
  separations in filled `mail`, `compass-3`, `users-*`, `puzzle-4`; 7 cuts in filled `database`,
  `database-2`, `check-circle-3`, `checkbox-2`; 2 self), and 1 from §5 — `trash` at 24, the same
  tab-leg pair that warns at 20 and 16, reading exactly 1.49. By master 9 · 17 · 17 files; 20
  outline, 23 filled. `database-2-filled` at 24 is simply the one of these that fell to 1.48 and so
  needed a note. **(3)** no rule says what 2 dp rounding may cost an arc edge; **(2)** §6 says
  *"a literal 1.5"* and the code holds 1.49.
- `volume-off-filled` declares 0.7 · 0.75 · 0.375 and its comment never says what that is. The plan
  does (`plans/facing-gap.md:61`): the bar's stroked stubs stop short of the speaker's solid, 0.72 ·
  0.80 · 0.39 at each junction, two junctions per drawing. The same plan names the second reading,
  the **1.25 channel** through the speaker at 16 (`:79`). C22's dated note records only the channel,
  and says it is *"noted in its file"* — it is not: the file's note is the junction's number, and the
  channel's 1.25 passes only because 0.375 is smaller. One `gap:` carries one number, so a file with
  two agreed gaps can declare only the lesser and the other rides along. **(2)** doc 07 and the file
  describe different exceptions; the plan has both. On the pixels, `findings-air.md:454` reads the
  16 junction at **0.637** — *"a genuine near-weld, and the only note in the set covering something
  the pixels confirm is bad"*. Whether the bar reads as broken there is the eye's (§6).

**Kinds**, as above, per row. **Verdict:** agreed (8 files) · unverified (2 files — `sort`'s outline
number is not held, and lint would not notice if it were wrong on any of the ten) · and one
**missing rule** — the 2 dp tolerance for arc-derived edges, which 43 drawings already rely on
through the 0.01 slack and no document states; `severity-proposal.md` §4.4 row 4 seen from the gap
side. The register's reading matches: F4 (`rule-register.md:266`), kind 1→, *"no vocabulary for an
overlap"* (`:289-290`). `docs/07:79` lists three of the six concepts (`stale-statements.md` entry
2.4); `CLAUDE.md:285` one (entry 2.3).

**Proposal.** Two lines on the existing note. (1) Hold `gap:` to the drawing the way `grows:` and
`box:` are held — the icon skill already says *"round it down to what the drawing really holds"*
(`SKILL.md:86`); one shipped file (`16/sort`) would need its note corrected to 1.38, or removed.
(2) Let a `gap:` note name the air it covers (`gap: 1.25 separation`), so a file with two different
agreed gaps says both, and a reader of the file can tell what Maruti agreed to from what came along
for the ride. `SKILL.md:174-177` lists `box`, `keyline: mark` and `glyph` as the notes an approval
teaches lint; `gap`, `grows`, `anchor` and `optical` are not on that list and should be. And a
third, for the slack: *either §6 states the 0.01 as its tolerance for an arc-derived edge, or lint
drops it and the 43 drawings are re-read* (R-9).

### 2.8 `glyph: dot` / `glyph: numeral` — the carve-out, applied where it was written

**What it looks like.** A character with a detached dot floors its dot-to-body space, its own
opening and the material its knockout leaves at 1 instead of 1.5 (C19). The note is on **15 concepts
/ 90 files** — `info` `-2` `-3`, `help` `-2` `-3` `-4`, `alert-circle` `-2` `-3` `-4`,
`alert-triangle` `-2` `-3` `-4` — all six files each, and lint applies the floor at `:395-396`
(the pair), `:434-439` (the opening), `:461-466` (the knockout) and `:490-494` (facing air). C19
names `info`, `help`, `alert-circle` and *"four `alert-*` icons (circle, triangle, octagon,
square)"*; octagon and square are not shipped at the pin, and the numbered variants are covered as
*"the same body-plus-dot glyph"*.

`glyph: numeral` is on **1 concept / 6 files** — `list-ordered`, approved 2026-09-27
(`research/queue.md:378`) — and is in force at every master: lint reads the 2's mouth at 1.09 · 1.09
· 1.06 and prints *"C19 numeral opening … floor 1"* on all six. No file prints the *"not in use
here"* line.

The register files the carve-out as F3 (`rule-register.md:265`), kind P, and calls its derivation
the strongest of any carve-out (a measured void ratio, a 16 × 16 raster test, a scan of 92 icons and
133 path pairs). `findings-air.md:453` adds the pixel reading: of 33 dot gaps at 16, 10 read clear
and *"the other 23 are unaligned, not too narrow"* — the carve-out is right about the width and the
grid decides the rest.

**What is missing.** The six `sort-numeric-*` concepts (36 files) draw numerals and carry only
`box:`; `enforcement-gap.md:194-200` traced the intent to the board (`lab/drafts/archive/glyph-9-15.js`)
and measured that declaring the note clears 12 of the 72 sort warning lines — every `sort-numeric-*`
outline warning at 20 and 16. **(1)**: a drawing without the note its own rule provides.

**Verdict: agreed exception, verified, on the 16 concepts that carry it; a missing note on six.** The
fix is `severity-proposal.md` §6b, already recommended and independent of every ruling.

### 2.9 `tags:` — not an escape

2,808 files on 468 concepts carry search words; lint never reads them and the build does
(`build.mjs:27`). Not a deviation from any drawing rule and nothing to verify. The one finding is
C9's *"written into every file"* against **17 concepts / 102 files** without one — `plus`, `minus`,
`x`, their sizes and circles, `more-horizontal`, `more-vertical` — already `enforcement-gap.md` §4
row G7. **(1)**. Listed here so the census is complete. (The register files the same rule as **G2**,
`rule-register.md:333`; its own G7 at `:338` is a different rule. Both labels are in circulation —
§5.)

### 2.10 The sort family — sixty warnings nobody can declare

**What it looks like.** `npm run check` ends every run with 62 warned drawings, and 60 of them are
the twelve `sort-alpha-*` and `sort-numeric-*` names: the six `sort-alpha-*` warn at every master in
both styles (36 lines, one each), the six `sort-numeric-*` at 20 and 16 only (36 lines: two on each
filled file, one on each outline), so the files run 12 · 24 · 24 by master and the lines 12 · 30 ·
30. By kind: 30 *"air across one cut-out"*, 18 *"paths overlap"* (edge gaps of −1.04, −0.96, −0.93 —
strokes that share space on purpose), 12 *"between a shape and a line"*, 12 *"faces itself"*.

**Where agreed.** `plans/sort-family.md:25-28`: Maruti, 2026-10-03, in the Library — *"the balance
of how i see the icons and their sizes look good and balanced"*, *"the warnings they raise in `npm
run check` are expected"*. That is C0 working: the eye over the number. But note where the record
sits: the plan is headed **WITHDRAWN 2026-10-03** (`plans/sort-family.md:3`), and the agreement is
its closing note — the only record of the ruling is in a plan that otherwise records its own
reversal, as `stale-statements.md` entry 4.1 already says. Three things did not happen and
`enforcement-gap.md` §2.4 lists them: no note, no C-row, and the plan's own proof (*"no new
warnings"*, `plans/sort-family.md:66`) was not met.

**Why no note exists.** `parseGapNote` takes a positive number below 1.5 (`:106-111, :235-238`);
an overlap is negative. There is no vocabulary for *these two strokes share space by design*
(`severity-proposal.md` §4.4 row 5); `findings-air.md:412-418` puts it from the drawing's side —
*"what is expected is a join"*. Half the problem is smaller than that: 6 of the 12 concepts need
only `glyph: numeral` (§2.8). The register's verdict on the process rule is the same as this card's:
I3 *"holds four times, broken three ways on one family"* and I4 *"broken for the sort family"*
(`rule-register.md:406-407`); `stale-statements.md:345-385` (entry 4.1) carries the edit.

**Kinds.** (1) sixty drawings against §6 — and agreed. (2) the plan's proof against its result.
(3) no note kind for an overlap.

**Verdict: agreed exception, undeclared — the largest body of approved deviation in the set has no
way to be written down.** Axes F8 (the air) and F11 (the letterforms at 16). The consequence is
operational and immediate: warning 63 is invisible (`severity-proposal.md:23-25`). The baseline in
`severity-proposal.md` §2 is the fallback; a C-row and an overlap note are the honest fix.

### 2.11 `trash` at 20 and 16 — lint is measuring a covered junction

Two warnings: *paths 2/3 are 2.49 apart — edge gap 0.99* at 20, *2 apart — edge gap 0.75* at 16 —
the tab legs against the body walls. C22 (`docs/07:62`) calls it a *"known lint false positive"*:
the legs run up from the lid line, the walls run down from it, and the lid's stroke covers the
point where they meet; *"the fix belongs in `tools/lint.mjs`"*. `docs/09:31` says the same, and
`stale-statements.md:323` (entry 3b.7) confirms the two warnings verbatim at the pin. At 24 the same
pair reads exactly 1.49 and passes by the slack (§2.7). One document disagrees:
`findings-air.md:568-570` calls the same two lines *"genuine near-misses"* — a doc-against-doc
question listed in §5, not settled here. **(2)**: lint and the rule disagree, and doc 07 and doc 09
say the rule is right. **Verdict: agreed**, two weeks unactioned; declarable today as `gap: 0.99` /
`gap: 0.75` but better fixed in the measure, since a note would record as "agreed air" something that
is not air at all.

### 2.12 The eight byte-identical filled files — not an escape

`grid-3`, `grid-4`, `more-horizontal` and `more-vertical` at 24 and 20 have filled files whose body
is identical to the outline's; only the root `stroke-width` differs (re-measured: 4 concepts × 2
masters = 8 files; 0 at 16). This is C17 read literally — *"filled dots follow the lines rule but
grow from their own centres: same circles at the filled weight"* (`docs/07:57`) — and each declares
`grows: 0.5 0.5 0.5 0.5` / `0.25 0.25 0.25 0.25`, which lint confirms. At 16 they diverge because
C17's dated note grew the **outline** dot's radius by 0.125 when the stroke went to 1.25
(`more-horizontal` outline r 0.575, filled r 0.45, `src/icons/16/`) while the filled weight stayed 2.
**Verdict: not an escape.** The reconnaissance flagged it as a curiosity
(`plans/set-and-rules-audit.md:286-287`), and `findings-filled.md:570-572` and
`findings-primitives.md:648-650` record the same eight; measured, it is the rule working.

### 2.13 Deviations held only by a C-row or a comment — angles, radii, cuts

These are agreed, written down where decisions live, and **invisible to lint**: there is no note
kind for them and no check that would read one. They escape nothing today because nothing is
enforced, and that is itself the finding (`enforcement-gap.md` §4 rows E1–E5, F9–F10, C5a).

- **Angles.** `docs/07:78` grants **27 icons by name** — `home-2` `-3`, `gear` `-2`, the four
  `alert-triangle`, `map-pin` `-3`, `package-2` `-3`, `lightbulb` `-3` `-4`, `watch` `-3`, `pencil`,
  `compose-3`, `language`, `megaphone` `-2` `-3`, the four `sparkle` — and points at three families
  granted in their own rows (C11 checks, C12 `chevron-3`, C25 `mail`); `trash`'s 4° is C22's and
  `code`'s 73° is C30's. `findings-angles.md` §6 measured the prose: **193 of 485 concepts state a
  degree figure** in their 24 comment (its own §7 says 183 — §5); of the 124 concepts more than 2° off
  axis, **90 declare and 34 are silent**; of 29 bare defaults off axis, five are undeclared
  (`cursor-click`, `sort-alpha-*`, `sort-numeric-*`, `search`, `list-ordered`); and `code`'s
  **filled** slash is a third, undeclared angle on the very icon C30 was written for (§4). Lint
  checks none of it (`docs/01:201`). **Verdict: unverified** — agreed where named, held by prose.
  `findings-angles.md` §7a proposes the note (a run and rise, C30's own form); this card only records
  that the exception exists in the files 193 times and in no machine-readable place.
- **Radii.** C26 lets `message-6` and `message-7` leave the container radius *"on purpose … lint does
  not check container radii, so nothing warns"* (`docs/07:66`). `findings-corners.md` §4.2 lists 11
  concepts with genuine off-tier corners, judges most as decisions, and names one shipped drawing
  that says *"Maruti to confirm"* in its own comment (`rotate-ccw-9` at 16, `findings-corners.md:263`).
  **Verdict: unverified.** The instrument now exists (`radii.mjs`); the vocabulary to declare against
  is the open container-radius ruling (`docs/09` §6).
- **Filled cuts and the pair.** C18's cut weights (medium 2 · 1.75 · 1.75 on `plus-circle` and
  `x-circle`, heavy on `minus-circle`, 1.5 on the checks), C20's taper on `search-filled`, C21's
  `ban-2` whose outline bar and filled cut are different lengths *"against C18"*, C22's true-size
  counter, C23's and C24's 1.5 separations — each is a C-row decision with no note and no check
  (`enforcement-gap.md` §4 row F9). How many filled files take which cut is `[needs measuring]` here;
  `findings-filled.md` (card 1.8) is the census that owns it. **Verdict: unverified.**

### 2.14 The silent tolerances — numbers the code chose

Not a note and not a comment: a drawing can sit up to 0.5 off the canvas centre (`:361`) or 0.5 off
its keyline on either dimension (`:352`) and pass with no mark on it. No document chose either
number; C10/C12 say *2 dp, no tolerance* for bent marks. `enforcement-gap.md` §2.2 measured what
the centring slack hides — **164 drawings more than 0.01 off centre, 80 more than 0.10, 20 more than
0.25, 8 resting on exactly 0.50** — and §5 rows 1–2 judge it; this card cites and does not
re-measure. **(2)** code against C10/C12. **Verdict: missing rule** — the tolerance for an icon that
is not a bent mark has never been decided (`severity-proposal.md` §4.4 rows 1–2). It belongs in
this ledger because it is the one escape that leaves no trace in the file at all.

**One agreed deviation rides on it with no note — `volume-off` at 16.** Re-measured: both styles
have ink [1.5, 13.5] × [2, 14], centre **7.5, 8** — half a unit left of the canvas centre — and lint
prints `centre 7.5,8` and passes it, because 0.5 is not *more than* 0.5 (`:361`). C28 says
`volume-off` is *"centred as its own icon, no anchor"* (`docs/07:68`); at 24 and 20 it is (centre
12,12 · 10,10). The file's own prose explains the 16: *"an odd 7-wide speaker cannot be centred
without putting its left and back edges on half pixels, so it moves 3 instead of 3.5: edges on whole
pixels (x 4 and 11) and the ink centre 0.5 left of 8 … the ink's mass centre sits at x 7.8 … and 3
reads balanced at real size"* (`src/icons/16/volume-off.svg:3`). That is a judgement made by eye, on
pixels, for a stated reason — exactly what a note is for — and it is written in prose that lint
cannot read, while the drawing passes on a tolerance nobody chose. The same tolerance carries
`watch-2` at exactly 0.50 at all three masters in both styles; those two concepts are the eight
drawings `enforcement-gap.md` §2.2 found resting on lint's limit, reproduced here. **(1)** against
C28 as written, agreed on the board. **Verdict for the pair: agreed, undeclared** — no note in the
vocabulary today declares a whole-pixel placement chosen by eye. The nearest, `optical:`, is C14's
and is scoped to open pointing marks, and the centring check would still allow ±0.5 around whatever
it declared (`:361`). Whether to widen it is a ruling, R-10. Three more escapes of the same family —
a check that does not run, pairs lint skips, a slack — were found by the review and sit in §2.15.

### 2.15 Four escapes the review found — a check that does not run, pairs lint skips, a slack, a hole

Each leaves no trace in the file. Each is measured here for the first time as an escape; the lint
lines are the whole story.

- **The knockout check never runs on a shape-filled file that keeps a stroke.** §5c — the check
  that a filled cut-out leaves enough material standing (`materialGap`) — is gated
  `if (areas.length && ds.length === 0)` (`lint.mjs:459`). Measured: of the 1,026 shape-filled
  drawings, **414 files on 138 concepts (138 at every master) keep at least one stroked line**, and
  on those the knockout is measured by nothing but §5f's air readings. The rule they escape is not
  narrow: C22 and `docs/01:332-336` speak of *every* filled drawing. `enforcement-gap.md` §4 row F3b
  counts the same 414 and probes it (adding one stroke to `help-4-filled` removes its knockout
  reading); its §5 list of code-made numbers does not carry the gate, and should (§5). **(2)**: the
  code is narrower than the rule. **Verdict: a missing check.**
- **Paths that touch or cross are exempt from the gap check.** The pair loop skips a pair that
  crosses, for its whole length (`:394`), and reads a pair within 0.1 as joined (`:401`). Measured
  over the 7,554 stroke-path pairs in the set: **1,544 pairs in 985 files (257 concepts) are within
  0.1 and skipped; 199 pairs in 128 files (66 concepts) cross and are skipped** — 335 · 326 · 324
  files by master carry a touching pair. Most of those are the set's joins: a mark meeting its
  container, a lid meeting a wall. No rule says what a join is, where ink may touch ink, or whether
  a crossing licenses every other gap between that pair (`enforcement-gap.md` §5 rows 5–6). **(3)**:
  this is axis F9, *contact grammar*, which `plans/set-and-rules-audit.md:350` already marks *"no
  rule exists at all"*. **Verdict: missing rule.**
- **The 0.01 slack.** Every gap check tests `reading < floor − 0.01` (`:403, :438, :465, :493, :499`),
  so a gap of 1.49 against a floor of 1.5 passes. Measured in §2.7: **44 readings in 43 files on 32
  concepts** sit in [1.49, 1.50) and pass only by it — 9 · 17 · 17 files by master, 20 outline and 23
  filled. §6 says *"a literal 1.5"*. **(2)**: the code holds a number the rule does not state.
  **Verdict: missing rule** — the tolerance should be written or removed (R-9).
- **A `>` inside a note value.** Every note regex in lint ends at the first `>`, so
  `<!-- box: 20x18 > -->` matches nothing: lint reads no note, raises no error, and the drawing is
  held to a keyline as if nothing had been declared. **0 such files at the pin.** `notes.mjs` now
  reports a value like that as *lint silently reads no note* instead of throwing. **(3)**: a hole in
  the vocabulary, empty today.

---

## 3. The judged list — ranked by drawings touched

| # | Group | Drawings | Kind | Verdict | What Maruti would see, and the one thing to decide |
|---|---|---|---|---|---|
| L-1 | **The free-text hatch** (§2.1) | **1,967** off-grid pass silently; all 2,910 carry the hatch | (2) · (3) | stale rule · missing rule | Nothing, today — and that is the point: a drawing could go two units off its grid and the run would print a note. Decide docs/01 §3's third exception (the tangent vertex), then narrow the hatch. Order matters: 1,888 drawings sit behind it |
| L-2 | **Paths that touch or cross are exempt** (§2.15) | **985** files have a pair lint reads as joined; 128 a crossing pair | (3) | missing rule | Every join in the set is unjudged: no rule says where ink may touch ink. This is axis F9; the contact census (card 1.7) is where to decide what a join is |
| L-3 | **`keyline: mark` — the size inside it** (§2.2) | 816 files; **390** (65 concepts) have a size no rule names; 6 families split mark/keyline | (3) | agreed category · missing rule | `grid` beside `grid-3`, `filter` beside `filter-2`, `chart-bar` beside `chart-bar-2`: two sizes in one family. Decide whether a mark's longest side is a whole unit and 18 or 15 by default, and whether numbered variants share a keyline class |
| L-4 | **The knockout check that does not run** (§2.15) | **414** files, 138 concepts | (2) | missing check | A cut-out that leaves too little material standing is caught on `help-4-filled` and missed on `volume-low-filled`, because the latter keeps a wave as a stroke. Decide: lift the gate at `lint.mjs:459` |
| L-5 | **`box:` — three keylines in all but name** (§2.3) | 338 files; **210** (35 concepts) on three shared boxes | (3) · (2) | missing rule | `camera`, `desktop`, `briefcase`, `folder`, `heart` all stand 20 × 18 — a keyline that exists in eighteen concepts and no document. Decide: promote the folder box and the sort box, keep `box:` for the 22 one-offs |
| L-6 | **`optical:` on trust** (§2.5) | 270 files | (2) | unverified · 6 stale | A chevron declared 3 units off would pass. Decide the margin against C15's own measure (card 1.11 supplies the comparison); record `alert-triangle`'s and `play`'s values somewhere other than the drawing |
| L-7 | **The ±0.5 tolerances** (§2.14) | 164 drawings off centre pass; 8 rest on the limit | (2) · (1) | missing rule · one agreed deviation undeclared | A mark 0.5 off centre is a pixel at 16. Decide the centring and keyline tolerance for everything that is not a bent mark — and rule on R-10, which would give `volume-off`'s agreed half-unit at 16 a note instead of the slack |
| L-8 | **The sort family** (§2.10) | 60 drawings, 72 lines | (1) · (3) | agreed, undeclared | Every run ends in 62 warnings, so the next one is invisible. Decide a C-row and an overlap note; declare `glyph: numeral` on the six numeric ones now (12 lines go) |
| L-9 | **The 0.01 slack** (§2.7, §2.15) | **43** drawings, 32 concepts | (2) | missing rule | 43 gaps read 1.49 against a floor the docs call "a literal 1.5", and pass. Decide: state the tolerance for an arc-derived edge in §6, or drop the slack and re-read the 43 |
| L-10 | **`gap:` — one number, two gaps** (§2.7) | 10 files; 8 agreed, 2 unverified | (2) · (3) | agreed · unverified | `volume-off`'s note covers a 0.39 junction and, by accident, a 1.25 channel; doc 07 records only the channel, and the pixels call the junction a near-weld. `sort`'s outline declares 1 against 1.38. Decide: hold the note to the drawing (SKILL.md:86) and let it name its air |
| L-11 | **`glyph: numeral` missing** (§2.8) | 36 files | (1) | missing note | Straight fix, already recommended (`severity-proposal.md` §6b) |
| L-12 | **`anchor:` two members unrecorded** (§2.4) | 12 files | (2) | agreed; doc short | `volume-minus` / `volume-plus` into C28's list — a doc edit for Maruti's list (Q4) |
| L-13 | **`trash` at 20 and 16** (§2.11) | 2 files | (2) | agreed | Fix the measure (covered junction) — or settle which document is right about it |
| — | `grows:` (§2.6) · byte-identical pairs (§2.12) · `tags:` (§2.9) · `>` in a note (§2.15) | 54 · 8 · 2,808 · 0 | — · — · (1) · (3) | agreed · not an escape · not an escape · empty | Nothing to decide. `grows:` is the model the other notes should follow |

Not ranked because no lint check exists to escape from: the angle, radius and cut decisions held by
prose (§2.13) — 193 concepts state an angle in a comment and nothing reads it. They enter the agenda
through cards 1.2, 1.3 and 1.8, not through this ledger.

---

## 4. Rules this ledger proposes — proposals only

Each of these is a pattern repeated enough that a rule should state it. None is adopted by this
card; each goes to the decision agenda (card 5.2) with the count that justifies it.

| # | Proposed rule | Replaces | Drawings it reaches at the pin | From |
|---|---|---|---|---|
| R-1 | **docs/01 §3 gains a third exception:** a vertex computed as a tangent point or an intersection may sit off the grid at the master's decimal ceiling; lint's hatch then narrows from *any comment* to *a declared note* | the per-decimal comment rule (`docs/01:184-185, 376-377`, `CLAUDE.md:272`), already ruled dead at `docs/09:28` | 1,888 straight-segment drawings; 1,967 in all | §2.1; `severity-proposal.md` §5 row 1 |
| R-2 | **A mark's longest side is a whole number of units at 24, and 18 or 15 unless a C-row gives the family its own ladder** | nothing — `docs/01:107-108` says marks have no size rule | 124 of 136 already comply with the first half, 69 with the second; 65 concepts (390 files) have no C-row size | §2.2 |
| R-3 | **Numbered variants of one object share one keyline class** (mark, square, circle, portrait, landscape, or an agreed box) — eye-only, settled on the wall | nothing | 6 families today (`grid`, `filter`, `chart-bar`, `maximize`, `refresh`, `sort`) | §2.2 |
| R-4 | **Two shared boxes become named keylines:** 20 × 18 · 16 × 14 · 14 × 12 and 18 × 15 · 16 × 13.5 · 14 × 12; `box:` stays for genuine one-offs | `docs/01:127` "not a new keyline" | 35 concepts / 210 files move off `box:`; 22 concepts keep it | §2.3 |
| R-5 | **`gap: N` is held to the drawing to 0.01, like `grows:` and `box:`, and may name the air it covers** (`gap: 1.25 separation`) | the note's current logic (`:509-515`) | 10 files; 1 would need correcting (`16/sort` → 1.38 or none); `volume-off-filled` ×3 would declare two gaps | §2.7; `SKILL.md:86` |
| R-6 | **`optical:` is bounded against C15's measure** for that shape, by a decided margin; `alert-triangle`'s and `play`'s values are recorded in doc 07 | the unvalidated read at `:319-321` | 270 files | §2.5; `severity-proposal.md` §4.5 |
| R-7 | **A note kind for deliberate overlap** (two strokes sharing space), plus a C-row for the sort family | nothing — `parseGapNote` cannot express a negative gap | 60 drawings | §2.10; `severity-proposal.md` §4.4 row 5 |
| R-8 | **A declared form for an angle grant** — run and rise, C30's own form — so the 193 comments that state a degree figure can be read | prose only | 193 concepts state one; 34 off-axis concepts state none | §2.13; `findings-angles.md` §7a |
| R-9 | **The 0.01 slack is either stated in §6 as the tolerance for an arc-derived edge, or removed** — and §5c's gate at `lint.mjs:459` is lifted so a shape-filled file with a stroke is knockout-checked too | two numbers that live only in code | 43 drawings rely on the slack; 414 escape the knockout check | §2.7, §2.15 |
| R-10 | **`volume-off` at 16 declares its half-unit placement instead of passing on the slack** — either as `optical: -0.5 0`, which widens C14's `optical:` from *open pointing marks* to a silhouette placed by eye on whole pixels, or as a new note for a whole-pixel placement; either way the centring check would have to hold the declared value rather than ±0.5 around it (`:361`) | prose only (`src/icons/16/volume-off.svg:3`), against C28's *"centred as its own icon"* | 2 files today; `watch-2`'s exact 0.50 at every master (6 files) is the next question of the same kind | §2.14 |

R-1 and R-4 are the two that move the most drawings and cost nothing to draw: both describe what the
set already does. R-9 is the cheapest: two lines of lint, and the drawings it reaches are already
measured. R-10 is the one that widens a rule, and so is Maruti's alone.

---

## 5. For wave 5 to reconcile — two values, two sources, no pick

| Quantity | This card | Another document | Note |
|---|---|---|---|
| Off-grid drawings whose free text "says something about why" | **518** of 1,967 with the word list `off-grid, tangent, rounded, optical, construction` applied to free-text comments only; 621 with this card's wider `KEYWORDS`; 98 by a value named verbatim | **493** of 1,967 (`enforcement-gap.md:75-76`, "by keyword proxy") | The 493 run's exact word list and whether it read all comments or free text only is not recorded; the 518 is this card's reading of its wording |
| Readings in the 0.01 slack band | **44 readings / 43 files / 32 concepts**, counting every check lint runs (§5 pair loop, §5b, §5c, §5f) with lint's own de-duplication of a neck §5b and §5f both read, glyph files excluded | the review's own script: **21 readings / 17 files**, reading §5f alone | Reconciled, not a disagreement: the 21 include four §5f self readings, two of which (`users-3-level` and `users-level` at 16) lint reads in §5b first and drops from §5f at `lint.mjs:489`; 21 − 2 = 19 §5f (10 separations, 7 cuts, 2 self), + 24 from §5b + 1 from §5 = 44. Same population, counted at different points in lint's order; the 17 §5f area readings sit on 17 distinct filled files in both counts |
| Warning lines at the pin | **74** (72 on the sort family + 2 on `trash`); `findings-air.md:315, 568` also reads 74 | "12 of the **72** warning lines in the set" (`enforcement-gap.md:195`, `severity-proposal.md:167-168`, `stale-statements.md:375`) | Consistent if the 72 means the sort family alone; the sentence says "in the set" |
| `trash`'s two warnings | C22 (`docs/07:62`) and `docs/09:31`: a *"known lint false positive"* — a covered junction read as air | `findings-air.md:568-570`: *"genuine near-misses on `trash` at 20 and 16"* | Two documents, opposite readings of the same two lines. Wave 5 decides; §2.11 records both |
| Worst off-grid file | `gear-3-filled` at 24: **165** values (114 distinct, 55 on straight commands) | `plans/set-and-rules-audit.md:198`: 165 · `severity-proposal.md:117`: "`sparkle-3-filled` 158, `gear-3-filled` 128, `wand-2` 123" | **Not a conflict, resolved here:** the proposal's figures are the three-master sums of straight-command values per name (158 = 50+54+54, 128 = 55+35+38, 123 = 40+39+44, all reproduced); the plan's 165 is one file's total. Different quantities, both right, neither labelled |
| `box:` distinct strings | **59** (20 per master; one string, `10x14`, shared between `italic` at 20 and `attachment` at 16) | 57 (`stale-statements.md:149`, at the pin; `plans/set-and-rules-audit.md:205`, pre-pin, adding "none shared between masters") | The 57 at the pin does not reproduce; the plan's pre-pin 57 predates five concepts |
| `microphone-5`'s box | the file: `box: 14x20` at 24 (`src/icons/24/microphone-5.svg:3`); `rule-register.md:119` and `stale-statements.md:149` agree | `findings-scaling.md:396-399, 489`: `box: 14x18` | The scaling document has the string wrong; the régime finding it carries (one master only) holds |
| Concepts stating a degree figure | **193** (`findings-angles.md:372`), used in §2.13 | **183** (`findings-angles.md:642`, row A-14) | One document, two figures for one quantity |
| The `alert-triangle` files outside C14's scaling | **8 outline files** (4 concepts × 2 masters), which is what *81 of 90* implies with `info-2`'s one | `rule-register.md:102`: *"the four `alert-triangle` files at 20 and 16"* | Four concepts, eight files; the register's sentence counts concepts |
| `grows:` values at 16 | measured: **thirteen** concepts declare 0.375 (eleven line stacks, `chart-bar`, `list-bullet`); **five** declare 0.25 — `grid-3`, `grid-4`, `more-horizontal`, `more-vertical` (dots, C17's dated note) and `list-bullet-2` | `findings-filled.md:73`: *"Every value is half the master's weight step (0.5 · 0.25 · 0.375)"* — contradicted by its own table at `:66-70` | The sentence over-generalises; the table and the files agree with this card |
| `minus-filled`'s growth | measured from the notes: 0.5 · 0.25 · 0.375 per side, so **1.0 · 0.5 · 0.75** taller; `stale-statements.md:321` (entry 3b.5) says the same | `docs/09:27`: *"1 · 0.5 · 0.5 taller"* | docs/09 predates C7's 16 change; the 0.5 at 16 is stale |
| `volume-off`'s agreed exception | the file declares 0.7 · 0.75 · 0.375 for the bar-stub-to-solid junction, exactly as `plans/facing-gap.md:9-12, 61` records Maruti's 2026-09-28 ruling; the 1.25 channel is in the same ruling (`:79`), in the drawing, and in no note | C22's dated note (`docs/07:62`): *"keeps its 1.25 channel as an agreed exception (C28, noted in its file)"*; `findings-filled.md:299` calls it *"the agreed C28 exception"* — C28 (`docs/07:68`) states none | Kind (2); recorded in §2.7. The plan is the primary record; doc 07's sentence should name both readings |
| The §5c gate | `lint.mjs:459` keeps 414 shape-filled files out of the knockout check (§2.15) | `enforcement-gap.md` §4 row F3b has the 414; its §5 table of *"numbers that live only in code"* does not list the gate | An omission in `enforcement-gap.md` §5, not a disagreement |
| Rule ids for the same rule | this card cites the register: `tags:` = G2 (`rule-register.md:333`), the pair = C-5 (`:150`), repeated elements = C-6 (`:151`) | `enforcement-gap.md:284` calls `tags:` "G7" (the register's G7 at `:338` is a different rule) and `:276` calls repeated elements "C5a" | Two label systems; a reader following `enforcement-gap.md`'s ids into the register lands on the wrong rows |

---

## 6. What only the eye can settle, and where

- **Does a 20 × 18 box read as the same size as the 18 square and the 20 × 16 landscape?** Eighteen
  concepts stand on it. The wall (card 4.1), one row: `folder`, `camera`, `desktop`, `briefcase`,
  `heart` between `calendar` (square) and `mail` (landscape).
- **Does `grid-3` read smaller than `grid`, `filter-2` than `filter`, `chart-bar` than `chart-bar-2`?**
  Six families, one row each on the wall.
- **Is a mark whose longest side is 18 a mark at all?** Thirty-two concepts use the ceiling as a
  size; `cursor`, `send`, `maximize`, `text` among them. Beside the 18 square keyline on the wall.
- **Does `volume-off-filled`'s bar read as broken at 16?** 0.39 of white at each junction, two
  junctions; the raster reads the junction pixel at 0.637 — neither ink nor air
  (`findings-air.md:454`). Maruti said "keep as is" on 2026-09-28 from the numbers
  (`plans/facing-gap.md:9-12`); real pixels, 1× and 2×, on the exceptions sheet (card 4.3) would be
  the first time it is judged by eye. The first thing that sheet should show.
- **Should the 16 shifts be rounded to the eighth grid**, as C18 did for `info-3` alone? 39 of 45
  are not. The optical sheet at real 16 px, one shape (card 1.11 decides whether to ask).
- **Where may ink touch ink?** 985 drawings have a join lint skips. The contact census (card 1.7) is
  the sheet; the rule, if there is one, is the eye's.

---

## 7. Numbers this card could not measure

- **Per-decimal comment coverage** — whether each of the 27,029 off-grid values is explained. Not
  mechanically decidable; the three proxies in §2.1 are the honest substitute, and the per-decimal
  rule is the one R-1 retires.
- **How many `glyph: dot` pairs are actually under 1.5** — i.e. on how many of the 90 files the
  note is doing work rather than sitting ready. Lint prints the reading only when it warns.
  `[needs measuring]`, trivially, with `polyGap` — lint's distance between two sampled paths — in a
  later pass; `findings-air.md:453` has the pixel side (10 of 33 dot gaps at 16 read clear) but not
  the unit side.
- **How many filled files take which cut weight** (C18's medium / heavy / 1.5). `[needs measuring]`;
  card 1.8's census.
- **Whether any `box:` value disagrees with a C-row or plan that states it.** The sort box matches
  `plans/sort-family.md:46` exactly; the folder box matches `docs/01:128`; the alert box is stated
  nowhere, so there is nothing to disagree with.
- **What the 1,544 touching pairs are** — joins by design, or strokes that happen to meet. The
  count is here; the classification is card 1.7's contact census.

---

*Written for card 1.13 of `plans/set-and-rules-audit.md`. Instrument: `tools/audit/notes.mjs`
(`node tools/audit/notes.mjs --consistency`; `node --test tools/audit/notes.test.mjs`). Companions:
`docs/audit/enforcement-gap.md` (what the gate holds), `docs/audit/severity-proposal.md` (what
should block), `docs/audit/rule-register.md` (where each rule lives), `docs/audit/stale-statements.md`
(the convention lines that no longer measure true). The wave-4 exceptions sheet
(`lab/audit-exceptions.html`) should be built on `notes.mjs`'s JSON, one row per group in §1.*
