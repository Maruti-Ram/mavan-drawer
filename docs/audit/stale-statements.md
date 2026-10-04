# Stale statements — card 1.16

Every statement in `CLAUDE.md`, `docs/01`–`docs/09`, the plans, the icon skill and
`research/references/` that no longer matches the set, with **the correct measured value and the
exact edit**.

**Nothing in this list has been edited. Maruti rules on it.**

**Pinned to `5933041` (2026-10-04): 485 concepts · 2,910 drawings · lint 2,848 clean · 62 warned ·
0 failed.** Every "correct value" below was measured this session with the command shown, or
carries a `path:line`.

**Scope.** This card covers statements in `CLAUDE.md`, `docs/01`–`docs/09`, the plans, the icon
skill and `research/references/`. The other wave-1 and wave-2 cards each carry their own
"what this corrects in our documents" section for the measurements they own; card 5.2 merges all of
them into one agenda. Where a correction here came from another card's measurement, it says so.

**Severity.** **MISLEADING** — a reader who believed it would draw or decide wrongly.
**STALE** — a count or pointer that has moved; harmless to a drawing, corrosive to trust.
**DEAD** — describes a system that no longer exists.

`CLAUDE.md:48-52` states the rule this list exists to serve: *"A rule lives in one place and is
changed everywhere at once … A stale doc is a bug."* On the evidence below it is the most broken
rule in the system — which is also why `docs/09:81`'s proposal for a staleness check in
`npm run check` is worth taking.

---

## 1. MISLEADING — a reader would draw or decide wrongly

### 1.1 The Fluent stroke citation is a column slip, and it propagated into two rule documents

| | |
|---|---|
| **Where** | `research/references/fluent-guidelines.md:5-8`; quoted at `docs/07:47` (C7) and `docs/08:375` |
| **Says** | our reference file records **one** stroke row — `1.5 · 1.5 · 1.5 · 1.5 · 1.5 · 2.5 · 2.5` for sizes 12 · 16 · 20 · 24 · 28 · 32 · 48. `docs/07:47` turns that into *"**Fluent uses 1.5 at 12, 16, 20, 24 and 28 — exactly as we do** … which puts the largest deployed set on our side of the fork."* `docs/08:375` repeats it as *"Central's lighter weight — §6.2. **Fluent agrees with us.**"* |
| **Correct** | Fluent's source table (file `rdI0uXVzp89fOZpYcQV6mo`, page Guidelines, frame "Creation - Strokes 1", id `13749:41556`) has **two** columns: Regular **1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5** and Filled **1.5 · 1.5 · 1.5 · 2 · 2 · 2.5 · 3**. Our single row is Filled for 12/16/20, Regular for 24/28, then Filled-32 and Regular-48. The shipped assets match Fluent's table exactly |
| **Why it matters** | It points the **wrong way**. Fluent's *Regular* 16 is **1**, not 1.5 — lighter than our 1.25, where the citation claims parity. C7's conclusion survives: it was amended to 1.25 at 16 on Maruti's blind pick over eight true redraws, and the canvas-share ratio it turned on holds (14.1% measured against the 12–15% stated). But the sentence that made Fluent a witness for the defence is false, and C7 set *"do not reopen on a lighter reference 16 alone — measure whether that reference draws a 16 master at all"* as its own reopening test. Fluent draws a 16 master, at 1 |
| **Provenance** | I read `research/references/fluent-guidelines.md:1-8` directly and confirm it records the single row verbatim — no Regular/Filled distinction, no frame id. **The two-column correction is independently confirmed by card 2.1** (`docs/audit/references-fluent.md:87-101`), which calibrated the Regular ladder **1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5** from Fluent's own shipped geometry rather than from the document, and measured the Filled delta as **+0.5 at every one of the seven sizes** from the ink boxes of `Add`, `Dismiss` and `Checkmark`. At 16 Fluent draws **1.0 (6.25% of canvas)** where we draw 1.25 (7.81%) |
| **Edit** | Rewrite `research/references/fluent-guidelines.md:5-8` as the two-column table with the frame id. In `docs/07:47`, replace the sentence with: *"Fluent draws a 16 master at Regular 1 and Filled 1.5; we draw 1.25 and 2. It is a separate decision, not agreement — the ratio, not the absolute, is what we matched."* In `docs/08:375`, delete *"Fluent agrees with us"*; §6.2's conclusion stands on the blind pick and the eight redraws |
| | **MISLEADING · systemic** (one false figure, two rule documents) |

### 1.1b The Fluent separation figure is a band low above 24, and runs two quantities together

| | |
|---|---|
| **Where** | `docs/08:112-114`, repeated at `docs/08:422` and in `docs/08 §6.3`'s question |
| **Says** | *"Fluent's cut-out/separation is **1px** (1 at sizes 12–32, 1.5 only at 48)."* |
| **Correct** | measured by card 2.1 (`docs/audit/references-fluent.md:380-392`): separation (Regular) **1.00 · 0.95 · 1.00 · 1.00 · 1.50 · 1.50 · 2.46**; punched-line width **1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50**. Right for 12–24, **one band low at 28, 32 and 48**. The sentence also merges two quantities Fluent's own guidelines keep apart — how far a cut sits from the glyph edge, and how wide the cut itself is |
| **Why it matters** | `docs/08 §6.3` uses it as the whole cross-check for reopening `MIN_GAP` (*"Fluent's separation is 1px at sizes 12–32, ours is 1.5 everywhere"*), and it is the figure the audit plan's own stroke-relative worked example inherits. Stroke-relative at 16 we are **1.26×** as generous as Fluent, not ~2× |
| **Edit** | Replace with the measured two rows, labelled separately. Card 1.7 takes the corrected numbers, not these |
| | **MISLEADING · one-off, load-bearing on the gap question** |

### 1.2 docs/01 claims a guarantee the gate does not give

| | |
|---|---|
| **Where** | `docs/01-foundations.md:3` and `:405` |
| **Says** | *"The geometric constitution of the library. **Every icon obeys this or it does not ship.**"* and *"The linter (`node tools/lint.mjs`) **checks all of this** mechanically."* |
| **Correct** | `lint.mjs:648,652` fails a drawing on **errors only**. Every geometric rule in docs/01 — §2 keylines, §3 grid, §5 radii, §6 gaps, §7 optical — is a warning or is unchecked. Measured: 62 warnings, 0 failures, exit 0. `:405` is true of §8 and false of §2, §3, §5, §6, §7 |
| **Edit** | `:3` → *"Every icon is drawn to this. What the linter blocks and what it only reports is listed in §8; the rest is held by the eye and by review."* `:405` → *"The linter checks the file form above mechanically, and reports on the geometry; `docs/audit/severity-proposal.md` says which rules block."* |
| | **MISLEADING · systemic** |

### 1.3 docs/01 §6's "2-unit gap", three lines under a rule that says 1.5

| | |
|---|---|
| **Where** | `docs/01:352-354` |
| **Says** | *"When a detail cannot fit at a **2-unit** gap, remove the detail."* |
| **Correct** | `MIN_GAP = 1.5` (`masters.mjs:64`), stated at `docs/01:327` fourteen lines above |
| **Edit** | 2-unit → 1.5. Flagged at `docs/08:319-320` on 2026-09-18 and still unactioned |
| | **MISLEADING · one-off** |

### 1.4 docs/01 §7's "shift mass up 0.5" was superseded by C14/C15 and is still written as advice

| | |
|---|---|
| **Where** | `docs/01:372-374` |
| **Says** | *"Visual centre is above geometric centre. For icons with a clear top and bottom (a pin, a flag, a droplet), shifting mass up by 0.5 units often reads as better centred. Use sparingly and comment it."* |
| **Correct** | C14/C15 replaced this with a measured per-shape anchor, judged on `/lab/optical-shift.html`, declared as `<!-- optical: dx dy -->`. C15 is explicit: *"a value is never carried over from another icon"* — which is exactly what "0.5 for a pin, a flag, a droplet" invites. `map-pin` ships no `optical:` note at all (measured: 45 concepts carry one; the pin family is not among them) |
| **Edit** | Replace the bullet with a pointer to C14/C15 and the sheet. `docs/09:52` already lists §7 as superseded |
| | **MISLEADING · one-off** |

### 1.5 `docs/01:191-192` permits two angles the set does not use, and omits ~20 it does

| | |
|---|---|
| **Where** | `docs/01:191-192` |
| **Says** | *"Angles default to 0°, 45°, 90°. 30° and 60° are allowed when the subject demands it (a hexagon, a chart line) and must be justified in the source file."* |
| **Correct** | `docs/07:77-78` grants, each scoped by name: trash 4° · watch 8.5° · sparkle 11.5–26.6° · package-2 26.57° · mail 28.8–32.6° · map-pin 31.1–40.3° · lightbulb 22.9–36.9° · home-2/-3 36.9° · alert-triangle ~61° · gear 60° · package-3 30° · language 60° · megaphone 26.6/71.6° · pencil 15/75° · code 73.14–73.18° · check-3/-4 and chevron-3 ~51–52°. Roughly 20 grants over roughly 50 concepts. **Neither 30 nor 60 is the common case** |
| **Edit** | Restate §3 as *"the set's angles are 0/45/90 plus the enumerated grants in `docs/07`; a new angle is a per-icon decision on its own evidence (C30), never a widening of this list"*, and make docs/07:78 the single list. `docs/01:201` already says honestly that lint does not check angles |
| | **MISLEADING · systemic** |

### 1.6 C28's member list omits two shipped, anchored members

| | |
|---|---|
| **Where** | `docs/07:68` (C28), `docs/01:132-136`, `CLAUDE.md:201`, `CLAUDE.md:286-287`, `SKILL.md:89-93` |
| **Says** | the level family's members are *"`volume` (2 waves), `volume-low` (1), `volume-none` (speaker only), `volume-x`, `volume-off`"*, and the anchor note is carried by *"each level and `volume-x`"* |
| **Correct** | measured — **five concepts carry `<!-- anchor: volume -->`**: `volume-low`, `volume-none`, `volume-x`, **`volume-minus`** and **`volume-plus`** (30 files). `volume-minus` and `volume-plus` were approved 2026-09-26, the same day as C28 (`research/queue.md:852-853`), and **appear in no rule document at all** — `grep -c 'volume-minus\|volume-plus'` returns 0 for docs/07, docs/01, CLAUDE.md and SKILL.md |
| **Why it matters** | This is more than a stale list. A level is an amount going down; a state is `volume-off`. `volume-minus` and `volume-plus` are **controls**, and C28 has no category for them — yet they use its mechanism and lint holds them to its rule. Either the row widens to name a third kind, or the two should not be anchored |
| **Edit** | Add the two to C28 with the category they belong to — a decision, not a correction. Then update `docs/01:134`, `CLAUDE.md:201`, `CLAUDE.md:286-287` and `SKILL.md:89` from the same source |
| | **MISLEADING · systemic (a rule that does not describe its own members)** |

### 1.7 C9 says a number marks a different drawing; in 22 concepts it marks a different cut

| | |
|---|---|
| **Where** | `docs/07:49` (C9) |
| **Says** | *"A number marks a different drawing, never a size or style."* |
| **Correct** | measured twice (whitespace-normalised path text, and `canonical()` from `tools/audit/congruence.mjs`): **nine groups, 22 concepts, ship an outline drawing identical to another concept's at all three masters** — `ban`/`ban-2` · `layout-footer`/`-2`/`-3` · `layout-header`/`-2`/`-3` · `layout-sidebar`/`-2`/`-3` · `layout-sidebar-right`/`-2`/`-3` · `globe`/`language-2` · `globe-2`/`language-3` · `building-3`/`building-4` · `compass`/`compass-3`. (No two files are *byte*-identical: the comments differ.) **Only `globe`/`language-2` and `globe-2`/`language-3` are also identical in the filled twin** — those two are complete aliases; the other seven groups differ only in the cut. All nine are deliberate; six are explained in docs/07 (C21, C29, `docs/07:78`), and two — `building-3`/`-4` and `compass`/`compass-3` — only in the file's own comment |
| **Why it matters** | There is a real working rule here, used by four separate decisions: **a number may mark a difference visible only in the filled style.** C29's own test when it retired the old layout `-3` was *is the filled drawing different?*, not *is the outline different?* — defensible, and not what C9 says. And the same question returns one master down: **five further pairs are identical outlines at 16 only** — `camera`/`camera-5`, `files`/`files-5`, `help`/`help-2`, `microphone-2`/`microphone-5`, `text`/`text-4` — which is precisely the *"one drawing at two masters out of three"* objection C29 acted on, at one master instead of two |
| **Edit** | Widen C9 in one sentence, scoped to what was measured, and decide whether `building-4` and `compass-3` want a docs/07 line. **A ruling, not a correction** — logged here because the doc as written is false of 22 concepts |
| | **MISLEADING · systemic** |

### 1.8 docs/03's justification for the min-gap rule depends on an axis that was retired

| | |
|---|---|
| **Where** | `docs/03:34-37` |
| **Says** | *"This only holds because §6 of the foundations mandates a **2-unit** minimum gap. At Bold the stroke grows 0.25 units on each edge … **The min-gap rule is what makes the weight axis free. That is why it is non-negotiable.**"* |
| **Correct** | `CLAUDE.md:186` — *"Weight axis: **none.** Opinionated defaults; customers do not adjust stroke."* And the floor is 1.5, not 2 |
| **Why it matters** | The gap floor is the number Maruti is most suspicious of, and this is the strongest-sounding argument in the repo for not touching it. It is dead. The live argument is `docs/01:325-347` (surviving a 16px render), which is a different claim and must not inherit this one's force. Card 1.7 re-derives the floor; it must not cite docs/03 |
| **Edit** | Strike the paragraph with the rest of docs/03's weight axis (§3 below) |
| | **MISLEADING · systemic** |

### 1.9 The Polaris Figma pointer that doc 06's D23 rulings wait on is dead

| | |
|---|---|
| **Where** | `CLAUDE.md:162-168` |
| **Says** | *"the user's Figma Polaris frame (file `XewrhAKrNGVZtikkpI5am9`, node `15643:27748`) is newer (~490 icons) and should be re-audited"* |
| **Correct** | that node is not in the file; its pages are ❖ Icons, Microsoft FLuent, Untitled UI, Cover. The live source is file **`rdI0uXVzp89fOZpYcQV6mo`**, page **"Polarris icons"** — **499 components, each 20×20**, flat vectors; a copy sits in `XewrhAKrNGVZtikkpI5am9`, page "Polarris icons" (added by Maruti 2026-10-04) |
| **Why it matters** | `docs/06`'s D23 revisions — add `home`, `checkbox`, `save`, `chevrons-up-down`; cut `caret-left`/`-right`; merge `close`=`x`, `copy`=`duplicate`; 13 open slots — have been waiting on a Polaris re-audit against a pointer that resolves to nothing |
| **Edit** | Replace the file/node pointer with the file id and page name above, in `CLAUDE.md:162-168`. Leave doc 04 and doc 06 untouched until Maruti rules on D23 (`SKILL.md:197`) |
| | **MISLEADING · one-off, blocking** |

---

## 2. STALE — counts and pointers that have moved

| # | Where | Says | Correct, measured | Edit |
|---|---|---|---|---|
| 2.1 | `CLAUDE.md:125` | the sheet is *"(487 icons; …)"* | **834 rows** in `research/queue.md` (same in the working tree and at HEAD): **485 done, 348 todo, 1 in review** (`thumbs-down`, on the board, no files). The 485 done rows match the 485 outline files exactly — no orphan either way. The 487 is doc 06's *evidence-backed concept count* (`docs/06:40-44`), not a row count | 487 icons → 834 rows · 485 shipped |
| 2.2 | `CLAUDE.md:279-280` | `grows:` — *"The **33** that differ today are C17 repeated elements and `minus` — all agreed, **none yet noted** (2026-09-20 census)"* | **18 concepts / 54 files** carry the note; lint prints 54 "agreed growth" notes and **0** "ink box differs" warnings and **0** missing twins. Every differing pair is now declared and verified. The 18: `chart-bar`, `filter-2`, `grid-3`, `grid-4`, `list-bullet`, `list-bullet-2`, `menu`, `menu-2`, `menu-3`, `menu-4`, `menu-arrow-left`, `menu-arrow-right`, `minus`, `minus-small`, `minus-large`, `more-horizontal`, `more-vertical`, `text-2` | Replace with the measured count, and say the census is **closed** — this also closes `docs/09:40`'s *"still open: the notes are not yet written into the 33 files"* |
| 2.3 | `CLAUDE.md:285` | `gap:` — *"Today: `attachment-4-filled` at 24 and 20 (`gap: 1`)"* | **10 files / 6 concepts**: `attachment-4-filled` 24 and 20 = 1 · `alert-triangle-2` 16 outline = 1.25 · `alert-triangle-4` 16 outline = 1.25 · `sort` **and** `sort-filled` 16 = 1 · `database-2-filled` 24 = 1.48 · `volume-off-filled` 24 = **0.7**, 20 = **0.75**, 16 = **0.375**. The lowest is a quarter of the floor | List all ten, or stop listing and point at a generated census |
| 2.4 | `docs/07:79` ("Gap exceptions") | lists `attachment-4-filled` at 24 and 20, and `alert-triangle-2`/`-4` at 16 | the same ten files as 2.3 — **`sort`, `database-2-filled` and `volume-off-filled` are missing**, and `volume-off-filled`'s three values are the largest deviations in the set | Add the three, with the measurement and the date each was agreed |
| 2.5 | `CLAUDE.md:286-287` | `anchor:` — *"(C28; **first** `volume-low`, `-none`, `-x` → `volume`…)"* | **5 concepts / 30 files**, incl. `volume-minus` and `volume-plus` — see 1.6 | as 1.6 |
| 2.6 | `docs/01:127-130` | `box:` — *"**First used by** `folder` (20 × 18 · 16 × 14 · 14 × 12, 2026-09-20)"* | **57 concepts / 338 files**, in 57 distinct size strings. `folder` is the first of 57, not the only one. One asymmetry: `microphone-5` and `microphone-5-filled` declare `box: 14x20` at **24 only** (0 pair/master disagreements elsewhere) | Keep `folder` as the first case and add the current count; the underlying keyline-drift question (`docs/09:46`) is a ruling, not an edit |
| 2.7 | `docs/01:102-103` | *"The 20 and 16 rows are **proposals** until the first icons have been approved at those sizes"* | 485 concepts are approved at all three masters | Drop the proviso. Also `docs/07:46` (C6) carries the same sentence |
| 2.8 | `docs/01:253-254` | *"Measured across all **351** shipped pairs on the day the check landed: **33** differ"* | 1,455 pairs at the pin; 54 files / 18 concepts differ, all declared | Date the sentence (*"on 2026-09-20, across the 351 pairs then shipped"*) rather than changing the number — it is a record of a census, not a current count |
| 2.9 | `docs/01:317-318` | radii at 20 and 16 are *"set per icon while drawing and **recorded here once they settle**"* | nothing is recorded. The per-icon values live in C22–C29 and in file comments; hundreds of containers have shipped | Either record them or say where they live. Card 1.2 measures the census; container radius is one of the six rulings |
| 2.10 | `docs/08:44` | *"State: **95 of 561** approved · **570** drawings · 0 warnings · 0 failures. Next in the queue: #22 `alert-circle`"* | 485 of 834 · 2,910 drawings · 62 warned · 0 failed | Date it as a 2026-09-18 snapshot, or drop the line — `docs/08:444-451` ("Immediate next step: #22 `alert-circle`") is the same snapshot and `alert-circle` shipped long ago |
| 2.11 | `docs/08:287` and `:319` | cite *"`docs/01-foundations.md:243`"* and *"`:245`"* for the §6 corollaries | they now sit at `docs/01:350` and `:352` | Cite the section, not the line — `docs/01 §6` |
| 2.12 | `docs/08:312` and `:349` | *"Across all **576** drawings"* and *"First run over **2,586** drawings: 23 warnings on 21"* | 2,910 at the pin | Date both as records of the run that landed each check |
| 2.13 | `docs/08:354` | §5c *"on filled files that also carry strokes (one reading in **354**, `cash-filled` 3.92)"* | **414 of the 1,026 shape-filled drawings** carry strokes as well, so §5c (`lint.mjs:459` requires `ds.length === 0`) skips all 414 | Update the count and keep it in the "still uncovered" list |
| 2.14 | `docs/09:3`, `:47`, `:57` | *"all **684** drawings"* · *"the queue is **572** rows, not 487"* · *"32 concepts became **114** names / **684** files"* | 485 concepts / 2,910 files / 834 rows. docs/09 is dated and should keep its numbers — but `:57`'s warning (*"at that ratio the queue reaches ~10,000 drawings"*) now wants restating against the pin | Add a dated "re-measured at the pin" line rather than rewriting the 2026-09-20 record |
| 2.15 | `docs/09:47` | *"CLAUDE.md 'Open' items 1–2 (visual language, master size) are closed in practice"* | `CLAUDE.md:222-230` still lists them as open items 1 and 2, with item 1 marked *"**Blocks everything downstream.** Do not start drawing the set before this"* — against 485 drawn concepts | Close items 1 and 2; `docs/09:55` also says to close item 4 (relax the `<path>`-only rule) |
| 2.16 | `docs/04:52-54` | *"**Total: 122 bases.** At **2 masters × 2 styles** that is **488 drawings** … the v1 ships around **180** distinct icons"* | 3 masters, 485 concepts, 2,910 drawings | Date the paragraph as the v1 estimate it was, and note the actual |
| 2.17 | `CLAUDE.md:90-95` | *"(2026-09-28: none open; `plans/facing-gap.md` is closed …; `plans/stroke-16.md` is closed …)"* | `plans/sort-family.md` (created 2026-10-03) and `plans/set-and-rules-audit.md` (2026-10-04) both exist and are unlisted. sort-family has no unticked boxes, but it holds three things recorded nowhere else: the 60 "expected" warnings, two undecided design questions, and the finding *"no family in this set keeps one ink box"* | List both, and give sort-family's three findings a home (see 4.1) |
| 2.18 | `docs/07:49` (C9) | *"Nothing has shipped yet: 0.0.1, private, no tags"* | `package.json` is still 0.0.1 and private, and no git tags exist — **still true**. Kept here only because it is load-bearing for C9 and C27 and should be re-checked before any release | no edit; verify before launch |
| 2.19 | `CLAUDE.md:189` and `docs/07:47` (C7) | *"**219 of 228** drawings at 16 keep their ink box exactly (`tools/inkbox-guard.mjs`)"* | **still exactly true as a record of the conversion, and it no longer covers the set.** Run against the current manifest, `inkbox-guard` reports *228 drawings at 16 · 219 identical · 9 line stacks thinned · 0 drifted* — it holds a snapshot of the 228 drawings that existed on 2026-09-20 and calls the other **742 drawings at 16 "new since"**. It is also outside `npm run check` | Date the sentence as the conversion record it is, so it is not read as a standing guarantee over 970 drawings |
| 2.20 | `docs/09:43` (metrics) | *"`anatomy()` reports `container: 13` for a bare `x`, `x-large`, `x-small`"* | **15 concepts, 45 published entries**, report a container that *is* the mark (ratio ≥ 0.99 both axes): `x` and its sizes and filled twins, `globe`, `globe-2`, `language-2`, `language-3`, `grid-2`, `table`, `table-2`, `target-2`, `volume-x-filled`. The absolute numbers moved with C7 (`x` at 16 now reads 10.5) | Three icons → 15 concepts |
| 2.21 | not stated anywhere | — | **`paintbrush-4` at 24 and 20 publish `geometric: null, optical: null`** in `dist/metrics.json`: `opticalBearings` returns null on a zero-length arc (`A7 7 0 0 1 3.75 19.5`, start = end). The same arc sits in `paintbrush-4-filled` and `chart-pie-3-filled` — **9 files, 2 concepts**. At 16 the arc is 0.001 long and the measure works | New finding, product-facing; card 1.12. Not a doc edit — a bug to log |

---

## 2b. The plans, the skill, the lab prose and the README

Measured by the plans/skill/references sweep, which checked every number, path and command in
these files. **The icon skill (`.claude/skills/icon/SKILL.md`) came out clean** — every number,
flag, path and command in it still matches `masters.mjs`, `lint.mjs`, `queue.mjs` and the lab
pages, `filled: 'outline'` is correctly absent, and the next C-number is correctly C31. It is the
best-maintained document in the repo and the model for what a sweep should leave behind.

### 2b.1 `README.md` has one commit and has never been updated

`git log` shows a single commit on `README.md` — `b226ad9`, 2026-09-17. `docs/09:53` lists only its
*"geometry block"* as dead; measured, **about twenty of its rows are stale**, and it is the first
file anyone opens.

| Line | Says | Correct | |
|---|---|---|---|
| :24 | *"Masters 24 + 16 (proposed) … 20 sits in a dead zone"* | three drawn masters, 970 files each | STALE |
| :26 | *"9 categories, 122 bases"* | 15 categories, 485 concepts, 834 rows | STALE |
| :34 | *"stroke 2 at the 24 master (8.3%), 1.5 at 16 (9.4%)"* | 1.5 · 1.5 · 1.25 = 6.25% · 7.5% · 7.8% | STALE |
| :35 | *"grid integers; 2 decimal places max"* | quarter grid / 2 dp at 24 and 20, eighth / 3 dp at 16 | STALE |
| :36 | *"radius container = one stroke-width; detail = half"* | measured arc radii at 24: **2.5 ×540, 1.5 ×398, 0.75 ×557** | STALE |
| :37, :44-46 | *"min gap one stroke-width"* | a literal 1.5; the 16 stroke is 1.25 | STALE |
| :42-43 | *"to span the 18 keyline (3→21) the path runs 4→20"* | `M3.75 12h16.5` — 3.75→20.25 (and 1.625→14.375 at 16) | STALE, and it is the one arithmetic docs/01:295 calls the commonest error in icon sets |
| :52-53 | optical bearings *"of every icon"* | 342 of 485 filled files per master publish `recession: 0` | STALE |
| :61-62 | *"`plus` has 3 units of bearing, `chevron` has 5"* | `plus` 4.5 (3 only for `plus-large`); `chevron-down` 5 left/right, 8.79/7.78 top/bottom | STALE |
| :74-80 | the three "Open" items — visual language *"blocks everything downstream"*, 24-vs-16, *"recommend dropping the 20 master"* | all three settled (C6, C7); 485 concepts drawn at 20 | STALE |
| :107 | *"`src/icons/24/*.svg` the masters"* | three directories | STALE |
| :111, :112, :116-124 | what `build.mjs` emits · the lab page list · the docs table (01–05) | also writes `lab/manifest.json`; eight lab pages omitted; docs run 01–09 | STALE / incomplete |
| :3-5 and `package.json:6` | *"the system is enforced by a script"* | the same overstatement as `docs/01:3` (§1.2) | STALE |
| :130-135 | the reference facts | mostly hold — SF Symbols 2,664 pairs ✓, Nucleo 64,933 icons and 7 grids ✓ (`stroke_max` is set on **1,429 icons, 2.2%**, not per-icon throughout); Fluent *"filled shares base geometry verbatim"* holds for 1,109 of 1,293 pairs (85.8%) and fails on 184 pairs across 43 concepts where filled is +0.5 thicker | partly STALE |

**Recommendation: rewrite `README.md` from `CLAUDE.md` rather than patch it.** Nothing downstream
reads it, and twenty corrections is a rewrite.

### 2b.2 The lab still offers a retired draft format in visible UI

`filled: 'outline'` was retired and `tools/draft-svg.mjs:92` throws on it (`CLAUDE.md:119`). It is
still named in the lab's own code paths and, in two places, in text a reviewer sees:
`lab/icon.html:377, 386, 703` · `lab/figures.html:149, 159` · `lab/glyph-sheet.html:199, 203` ·
`lab/optical-shift.html:60`, including a visible label **"same drawing as outline"**. A draft
written to the label the page offers throws at check time. **MISLEADING · systemic.**

| Where | Says | Correct | |
|---|---|---|---|
| `lab/icon.html:703` (Filled panel header) | *"solid · holes ≥ 3 · lines heavier"* | echoes `docs/03:61`'s retired 3-unit rule. Measured over all 1,026 shape-filled files: **every file with a measured cut-out has its narrowest cut under 3** — 59/59 at 24, 64/64 at 20, 69/69 at 16, and 50 of the 69 at 16 sit at exactly 1.5. "Lines heavier" is true only of line-heavy icons | STALE |
| `lab/keylines.html:31` | *"Canvas 24. Live area 20 (2-unit trim)."* | `docs/01:42` — there is no live area | STALE |
| `lab/keylines.html:61` | a fifth keyline, *"Diamond 22 × 22"* | `masters.mjs` has `diagonal: [20,20]`, and `docs/09:55` says remove it | STALE |
| `lab/language.html:93-94` | *"A useful rule: radius = one stroke-width for containers"* | containers are 2.5 at 24, about 1.67 strokes | STALE |
| `lab/language.html:39-41` | four candidate voices at stroke 2 / 2.5, one of them a mitred radius-0 "Sharp" | C1 (no sharp) and C7 | STALE — a prototype page `docs/09:53` already lists as dead |
| `lab/character.html:46-48, 68-69` | rows *"Refined … proposed"*, *"Soft … first draft"*, the 1.5-vs-2 trash explorer | Refined shipped; Soft was rejected (C2); stroke 2 is retired | STALE labels |
| `lab/optical.html:60-61` | *"`user` is still undecided"* | settled 2026-09-20 (`docs/07:80-83`) | STALE comment |

### 2b.3 `plans/facing-gap.md` — a closed plan reading as current

| Line | Says | Correct | |
|---|---|---|---|
| :21-22 | *"Lint after: 2,640 drawings, 2 warned (trash's old pair), 0 failed"* | 2,910 · 2,848 clean · **62** warned · 0 failed | STALE as a baseline |
| :24-25 | *"with **13 tests** in `tools/geometry.test.mjs`"* | **18** §5f tests (15 `facingGap` + 3 `lint §5f`); it was 13 at `e027857`, and `1828450` added 5 | STALE |
| :119, :140 | *"`node --test` 90/90"*, *"90 pass, 0 fail"* | **95 pass, 0 fail** | STALE |
| :47, :117 | *"within 3° of square"* | `ARRIVE = 3` still holds, but since `1828450` two bulging rounds may be nominated up to `BULGE = 10°` and then measured exactly on the line joining their centres (`geometry.mjs:495-509, 525-526`) | STALE in part |
| :81-83 | *"43 punched cuts … exactly 1.5 and 6 measure 1.25; 77 separations … 3 measure 1.25"* | pre-redraw counts. Today the only filled whites under 1.49 are `sort-alpha-*` (1.24 / 0.9 / 0.85), `sort-numeric-*` (1.0 at 20 and 16), `volume-off-filled` and `database-2-filled`. The redrawn ones read `book-3` cut 1.5, `compass-3` 1.5, `puzzle-4` 1.5 / 1.49 / 1.5, `external-link` 1.51 / 1.51 / 1.58, `paintbrush` and `paintbrush-8` collar 1.5 | STALE (right when written) |
| :85-86, :132 | *"all 304 shape-filled files"*, *"all 354 of them"* | **342 per master (1,026 in all)**; **138 per master (414)** also carry lines | STALE |
| :3-19, :66 | ten commit hashes | all ten resolve with matching subjects; `93126ef^..390f3ce` is exactly 8 commits | STILL TRUE |
| :132-134 | §5c *"still skips filled files that also have lines"* | `lint.mjs:459` | STILL TRUE |

### 2b.4 `plans/stroke-16.md` — and the px-of-ink problem, in one file

| Line | Says | Correct | |
|---|---|---|---|
| :21-22 vs :45 | `help` *"71.2 px … to 60.7"* against *"help 71.2 → 60.9"* | **two figures for one quantity in one file.** An independent rasteriser gives 75.0 → 64.5 | **INCONSISTENT; cannot be verified** |
| :26-28 vs :46 | `trash` retina solid pixels *"214 → 144"* against *"214 → 165"* | same again; independently 206 → 152. *"chevron-down 71 → 38"* did not reproduce at all (38 → 38) | **INCONSISTENT; cannot be verified** |
| :125, :132 | *"684 drawings · 681 clean · 3 warned"*, *"682 clean · 2 warned"* | 2,910 · 2,848 · 62 · 0; the `file-text-2` warning is gone, `trash`'s two remain | STALE baseline |
| :211 | C7 and CLAUDE.md *"both marked in transition"* | no "in transition" remains anywhere | STALE |
| :212 | *"17 tests pass"* | 95 | STALE |
| :213 | *"Uncommitted until Maruti has seen the sheet"* | committed as `032b1c4`, 2026-09-20 | STALE |
| :5-9 | *"re-run the proof at any time: inkbox-guard …"* | it reproduces exactly — 228 · 219 identical · 9 thinned · 0 drifted — and covers **228 of 970** drawings at 16 (23.5%) | STILL TRUE, with the coverage caveat (§2.19) |
| :122, :129-133, :138-140, :151-154, :163-166 | the ink-box guard table, the knockout readings, the leg-angle changes, the menu air at 16, `help-3`'s tail and the `alert-circle` wedge | every one reproduces | STILL TRUE |

**The pattern, not the lines.** Three independent re-measurements of the same quantity give three
answers — 71.2 / 60.7 / 60.9 in the file, 75.0 / 64.5 outside it. **No browser, version or
rasterisation method is recorded anywhere in the repo**, and `docs/08 §3.1`'s "ring wall" column
(2.25 / 1.00 / 1.46 / 1.50) has no definition in the repo and could not be reproduced at all. Every
px-of-ink figure in the docs should carry its method, or be replaced by a geometric measure
(`tools/audit/mass.mjs`, `raster.mjs`) that is reproducible. **This affects the evidence behind C7
and docs/08 §3.1 — not their conclusions, which rest on Maruti's eye, but on what can be re-checked
later.**

### 2b.4a The audit's own plan states two different pins, and its proof criterion uses the wrong one

`plans/set-and-rules-audit.md:9` and `:13` pin the tree correctly: **485 concepts · 2,910 drawings ·
2,848 clean · 62 warned · 0 failed.** But the reconnaissance section and the proof section were
written against the earlier tree and were not updated with the pin:

| Line | Says | At the pin |
|---|---|---|
| :95 | *"Today: **2,886** drawings · **2,824** clean · 62 warned · 0 failed"* | 2,910 · 2,848 · 62 · 0 |
| **:431-433** | *"`node tools/lint.mjs` at the end is **byte-identical to the baseline** … **2,886 drawings · 2,824 clean** · 62 warned · 0 failed. **If it is not, this build changed something it should not have.**"* | **the stated criterion would fail on the first two numbers even with the build having changed nothing** — verified: three runs this session all give 2,910 · 2,848 · 62 · 0, exit 0, and `git status` shows no change under `src/icons/`, `tools/` or `research/queue.md` |
| :115, :121, :344 | *"192 of 480 concepts"*, *"45 of 480 concepts"* | 198 of **485** (40.8%); 45 of 485 |
| :117 | *"1,184 of 2,886 files skip the keyline match; 1,702 are held to it"* | 1,184 of **2,910**; **1,726** held |
| :136, :164, :189, :326, :353 | *"the set is now 481"*, *"481 concepts × 3 × 2 = 2,886 files"* | 485 concepts, 2,910 files |
| :150 | *"**1,014** of 2,886 entries"* carry `recession: 0` | **1,028** of 2,910 |
| :317 | *"congruence classes across 2,886 files"* | 2,910 |

**This is the one entry on the list that should be edited immediately rather than ruled on**, because
it is the criterion the build proves itself against (card 5.1's reviewer reads it). The correct
baseline is already at `:13`; `:95` and `:432` should quote it.

### 2b.5 `plans/sort-family.md`, `research/queue.md`, docs/06, and the reference snapshots

| Where | Says | Correct | |
|---|---|---|---|
| `plans/sort-family.md:9` | *"No family in this set keeps one ink box"* | 53 of 107 families keep exactly one — see §4.1 | MISLEADING as a headline |
| `plans/sort-family.md:19-23` | *"the **eight** character icons"* | 12 shipped (`sort-alpha` ×6, `sort-numeric` ×6); eight existed when the line was written | STALE |
| `plans/sort-family.md:46` | *"The family box 18×15 · 16×13.5 · 14×12"* | holds for 13 of 17 `sort*` concepts; `sort-2` is 18×18, `sort-3` 18×11.52, `sort-ascending`/`-descending` 15×15 | STALE as a rule |
| `plans/sort-family.md:54-59, 66-69` | the cards' `Owns` paths, and *"lints clean"* / *"no new warnings"* / *"all nine"* | `lab/drafts/batch/` holds only `index.json`; the glyph drafts moved to `archive/` and the `sort-*` drafts were deleted by `approve --icon`; 60 drawings warn; there are 17 `sort*` concepts | STALE (in the plan's un-struck text) |
| `research/queue.md:8` | *"(status · next · start · approve)"* | `queue.mjs` also has `show`, `drop`, `rename`, `batch`, `clear` | STALE, incomplete |
| `docs/06:16` | Nucleo Essential *"221 + **181** names"* | `nucleo.json`: set 10 = 221 ✓, set 11 = **182** | STALE, off by one |
| `docs/06:113` | *"221 names × 2 grids × outline/filled"* = 1,024 | the formula gives **884**; the census's 1,024 is right, the arithmetic behind it is not | STALE |
| `CLAUDE.md:125` | *"487 icons"* | 834 rows, **496 distinct numbers**, 485 shipped (§2.1) | STALE |
| `docs/08:262` | *"**Hold C7: 1.5 at every master.**"* | superseded by the amendment, which the heading at `:260` announces and the paragraph does not | MISLEADING in isolation |
| `docs/08:423-424` | filled thickens by *"+0.5; our `FILLED_WEIGHT` adds +1.0 at 24 (**20 and 16 already match at +0.5**)"* | at 16, `FILLED_WEIGHT` 2 − `STROKES` 1.25 = **+0.75**. Only 20 matches at +0.5 | STALE since C7 |
| `research/references/volume-levels/web/notes.md:75-84` | *"Central Icons — could not capture … All five questions … [needs measuring]"* | three Central PNG captures exist in `volume-levels/central/`, written 2026-09-26 11:02, after the notes at 09:41. No measurement file exists for them | STALE |
| `research/references/central.json`, `central/help.json`, `fluent/folder.json` | their own notes and figures | all three reproduce. **`fluent/folder.json` (read 2026-09-20) records Fluent strokes 16:1, 20:1, 24:1.5, 32:2, 48:2.5 — the *true* table — and sits in the same directory as the wrong `fluent-guidelines.md` row.** Its ink boxes 14×12 · 16×14 · 20×18 are exactly our `folder` agreed box | STILL TRUE, and it means the repo already held the contradiction |

---

## 3. DEAD — describes a system that no longer exists

| # | Where | Says | Status |
|---|---|---|---|
| 3.1 | `docs/03:3-6`, `:12`, `:19-44` | *"Only **Outline / Regular / 24** exists today"*; the weight axis **Light 1.5 · Regular 2 · Bold 2.5**; *"Weight is a live attribute, so the lab's Weight view is showing real Light and Bold"* | **DEAD.** `CLAUDE.md:186` — no weight axis. 485 concepts at three masters in two styles |
| 3.2 | `docs/03:90-157` | *"Status: not built. `src/icons/24/` is the only master that exists"*; *"**20 and 32 are bad sizes**"*; *"**Standing decision: ship the 24 master only**"*; the 16 stroke is *"1 or 2"* and *"an open question"* | **DEAD.** Three drawn masters since 2026-09-16 (C6); the 16 stroke is 1.25 (C7) |
| 3.3 | `docs/03:46-76` | *"**Status: Outline only.** Solid and Duotone are unbuilt"*; *"punched holes obey a **3-unit** minimum"* | **DEAD** on the status; the 3-unit minimum is live-but-broken — `docs/09:22` judged the break right and said to reword it as *"a cut is never lighter than its swap partners"*, and to bring `check-circle`'s 1.5 cuts up to the medium cut. Unactioned |
| 3.4 | `docs/02:37-65`, `:91`, `:97-103` | the five-step pipeline with *"**2-unit stroke**"* at step 2; *"Import `templates/grid-24.svg`"*; contribution rules incl. *"Every decimal in a path carries a comment"* and *"New icon ships with a screenshot of the lab's 16px grid"* | **DEAD.** `templates/` does not exist. The real loop is `.claude/skills/icon`. `docs/09:53` already lists doc 02's pipeline numbers and contribution rules as dead |
| 3.5 | `docs/05:35-83` | the modifier geometry, *"canvas 24, **live area** 20"*, anchor (16,16), glyph 12→20, clear zone r6, *"the clear zone … **stays inside the live area** and never touches trim"*, the 16 anchor (11,11) | **DEAD as geometry** — `docs/05:37` says so itself (*"Written for the old 2-unit stroke"*) — and it **contradicts** `docs/01:42` (*"there is no separate live area"*) and `docs/01:68-70` (badges may run to 23). Zero badge composites ship, so nothing is at stake yet |
| 3.6 | `docs/05:69-77` | *"`slash` is the exception … `M4 4l16 16` … needs its own **2-unit** clearance channel"* | **SUPERSEDED** by C21 (`docs/07:61`, 2026-09-19), which fixed the direction as `\` from five candidates on one ring and specifies the three filled answers. docs/05's version survives alongside it |
| 3.7 | `docs/08:368-369` | ranked build list items 5 (*"the blur test (Fluent's) — **open**, cheap, additive"*) and 6 (*"**Primitive-drift linter** — open … this session used bowl radii 2.25 / 2.5 / 2.75 / 3 / 3.5 with nothing checking they related to anything"*) | **STILL OPEN**, and item 6 is now `CLAUDE.md:231-233`'s open item 5 and the audit's card 1.1. Not stale — kept here so the two lists are not read as different work |
| 3.8 | `docs/09:53` "Dead" list | names `README` geometry block, doc 02 pipeline, doc 03 body, `templates/grid-24.svg`, `src/_legacy-stroke-2/`, lab pages `language`, `keylines`, `alignment`, `optical`, `stroke-vs-fill`, `slot-test` | verified at the pin: **`templates/` does not exist**; `src/_legacy-stroke-2/` **does**; all six lab pages **do** (`lab/language.html`, `keylines.html`, `alignment.html`, `optical.html`, `stroke-vs-fill.html`, `slot-test.html`), and four of them still state retired rules in visible prose (§2b.2). It is not only `README`'s geometry block that is dead — the whole file is (§2b.1). The archival docs/09 recommended was never done |

---

## 3b. docs/09's own verdicts, re-measured at 485 — two are refuted

`docs/09-rule-audit.md` is dated 2026-09-20 and should keep its numbers as a record. These are the
places where re-measuring at the pin changes the **verdict**, not just the count, and where the
2026-09-20 text would mislead a reader today.

| # | docs/09 | Says | Measured at the pin | Verdict |
|---|---|---|---|---|
| 3b.1 | `:25` (angles) | *"Rule sound — every **default** obeys it; leaving it is what makes a numbered variant. **Two default exceptions:** `trash`'s 4° taper and `code`'s 73° slash."* *"44 names leave it."* | `tools/audit/angles.mjs` over the 485 outline files at 24 (2,556 straight segments, tolerance 0.5°): **121 concepts** carry a segment outside 0/45/90 (381 segments); **157 at 16**. **29 of the 121 are defaults** — `alert-triangle`, `code`, `compass`, `cursor`, `cursor-click`, `gear`, `heart`, `italic`, `language`, `lightbulb`, `list-ordered`, `mail`, `map-pin`, `megaphone`, `pencil`, `play`, `send`, `shield`, `sparkle`, `star`, `thumbs-up`, `trash`, `wand`, `watch`, `wrench` and the four `sort-*`. About **17 have no grant anywhere** in docs/07:78. `trash` taper confirmed 4.02 / 3.98 / 4.00°; `code` slash 73.14 / 72.26 / 73.18° exactly as docs/01:196 states | **REFUTED.** The premise *"every default obeys it"* is false of 29 defaults. `italic` is the sharpest case: C30 names it as the next decision owed and it shipped (commit `2942846`) with no C-row and no note |
| 3b.2 | `:22` (punched holes) | *"no cut fills in: **every knock-out keeps fully clear pixels at every master**"*, with the tick lowest at 6 against cross 8 · plus 10 · minus 12 | Cut widths measured: `check-circle` **1.50 / 1.50 / 1.50**, `x-circle` 2.01 / 1.76 / 1.76, `plus-circle` 2.00 / 1.75 / 1.75, `minus-circle` 2.50 / 2.00 / 2.00. Fully clear pixels at 16 (coverage exactly 0): check **4**, x 8, plus 4, minus 8. **At 24 and 20 `check-circle` leaves 0 exactly-clear pixels** (4 at coverage ≤ 0.05) where the other three leave 8 to 28. The 6 / 8 / 10 / 12 counts do not reproduce at any threshold tried | **PARTLY REFUTED, and it strengthens docs/09's own recommendation.** The tick's cut does fill in at 24 and 20. docs/09 asked to *"bring the `check-circle` cuts (1.5 'for now', C18) up to the medium cut"* on consistency grounds; it is now a legibility argument too |
| 3b.3 | `:23` (radii) | *"one real break: `trash` (container) uses 1.5 where the rule says 2.5"* | `trash` confirmed at 1.5 / 1.25 / 1.0 (and `trash-5` the same), but the pattern is now wide: strict container test at 24 gives **60 concepts at 2.5, 5 at 1.5, 5 mixed within one drawing**; the looser test gives **103 at 2.5 against 30 at 1.5**. Three drawings mix radii inside one container (`book`/`-2`/`-3` at [1.5, 1.5, 2, 1.5]; `lock-6` at [2.5, 5.5, 5.5, 2.5]; `wallet-3` at [2.5, 2.5, 2.5, 2]) | **Verdict holds; the scope is five times larger.** Also four off-quarter radii no rule allows: **0.772 (`heart`), 0.805 (`shield`, `shield-2`), 1.727 (`wrench`, `wrench-2`)** |
| 3b.4 | `:24` (parallel strokes) | *"`trash` 24 and `file-text-2` have 4 if walls count. Break fine, rule vague. Reword: at most 3 interior marks between walls"* | **43 concepts have a stack of 4 or more at 24** (40 at four, 3 at five: `chart-bar-5`, `file-text-2`, `files-5`); 39 at 20, 32 at 16. In **34 of the 43** two of the stack are opposite walls, so interior marks are 2 or 3 — **nothing exceeds the reworded rule.** The largest pure line run is still **3** (`menu`, `list-bullet`), as `docs/08:317` says. But **nine stacks are neither walls-plus-marks**: four open strokes in `attachment-2`, `attachment-4`, `chart-bar-3`, `plug-3`, `store`, `store-2`, and four closed edges in `grid`, `grid-5`, `grid-7` | **Verdict holds and the reword is still owed** — and the reword does not classify those nine |
| 3b.5 | `:27` | *"`minus-filled` is **1 · 0.5 · 0.5** taller"* | measured: total height growth **1.0 / 0.5 / 0.75**. The declared `grows:` is `0 0 0.5 0.5` at 24, 0.25 at 20, **0.375** at 16 | **STALE at 16** — the 16 figure moved with C7 |
| 3b.6 | `:30` | gap ≥ 1.5 — `file-text-2` at 16 was 1.25, *"dissolved by the 1.25 stroke (gap becomes 1.625)"* | measured: `file-text-2` at 16's smallest edge gap between strokes is **1.625** exactly; the filled twin's air is 1.5. Clean in lint | **CONFIRMED to the digit** |
| 3b.7 | `:31` | `trash` tab legs — *"two lint warnings at 20, 16. Not a break — covered junction (C22). Lint is wrong; fix owed to `tools/lint.mjs`"* | still exactly two, verbatim: `paths 2/3 are 2.49 apart — §6 needs 3 (edge gap 0.99 < 1.5)` at 20, `paths 2/3 are 2 apart — §6 needs 2.75 (edge gap 0.75 < 1.5)` at 16. 24 clean; `trash-5` and both filled twins clean | **Verdict holds; the fix is still owed** two weeks on |
| 3b.8 | `:40` | *"Still open: the notes are not yet written into the 33 files (so they warn)"* | **CLOSED.** 18 concepts / 54 pairs differ, every one declared, none stale, all agreeing with the drawings to 0.011. Lint prints 54 "agreed growth" notes, **0** "ink box differs" warnings and **0** missing twins. Seven of the 18 are new since docs/09: `chart-bar`, `filter-2`, `grid-3`, `grid-4`, `list-bullet`, `list-bullet-2`, `text-2` | **DONE** — the one docs/09 item besides C7 that was carried out |
| 3b.9 | `:41` | *"Chevron shifts differ by direction for the same drawing flipped … by-eye scatter of ~0.15 px, not design"* | holds: classic is identical in every direction; flat sits low in `up` (0.40 against 0.55 down); steep sits low in `down` (0.61 against 0.65). 36 chevron concepts use 33 distinct magnitudes | **Verdict holds** — one of docs/09's six pending rulings |
| 3b.10 | `:42` | filled cut weights *"minus 2.5 · plus/x/glyphs 2 · checks 1.5"* | measured at 24: `minus-circle` 2.5 · `plus-circle` 2.0 · `x-circle` 2.0 · `check-circle` 1.5 · `info` bar 2.0, dot ⌀2.5 · `help` band 2.0, tail 2.0, dot ⌀2.5 · `alert-circle` bar 2.0, dot ⌀2.5 | **CONFIRMED exactly** |
| 3b.11 | `:45` | the 16 filled corners sit 0.05 inside the outline's; *"43 of the 117 filled files at 16 are shape-filled and **were not all checked**"* | now checked: vertex-matching 645 corner pairs at 16, **45 pairs in 12 concepts** still carry the +0.125 of contour radius (≈0.052 at the middle of the corner) — `calendar`, `calendar-2`, `calendar-3`, `credit-card`, `credit-card-2`, `credit-card-3`, `file`, `file-text`, `file-text-2`, `folder`, `folder-2`, `folder-3`. **565 of 645 match exactly**; `printer` and `briefcase` show no drift; 24 and 20 none | **Maruti's "leave it" holds, and the scope is now known** — 12 concepts, not an unbounded 43 files |
| 3b.12 | `:46` | the landscape and portrait keylines drift in proportion from 24 to 16 | confirmed from `masters.mjs`: landscape 1.25 → 1.333 → 1.40, portrait 0.80 → 0.75 → 0.714. **86 concepts are held to a landscape or portrait keyline at 24** (30 landscape + 56 portrait). Lint's own readings across the set: circle 78 · square 123 · portrait 56 · landscape 30 · declared mark 136 · agreed box 57 · anchored 5 | **Verdict holds; the ruling it asked for is still owed, now against 86 concepts** |
| 3b.13 | `:57` | *"`ban` and `ban-2` ship identical outline files"* | still true, and it is nine groups / 22 concepts (see 1.7) | **Verdict holds; the scope is 11× larger** |
| 3b.14 | `:39` | the 2-dp limit vs the 1.75 medium cut: half-width 0.875 cannot be written, files carry 0.88 | measured: **0 files** carry 3+ decimals at 24 or 20; 824 do at 16, where 3 dp is legal. `A0.88 0.88` appears in **31 filled files at 20 and 18 at 16**, none at 24 (where the cut is 2.0, so its half is 1). **At 16 the C7 grid change made this writable exactly and nobody went back** — `plus-circle-filled` at 16 still uses 7.13 and 8.88 where 7.125 and 8.875 are legal | **Verdict holds at 20; at 16 it is now fixable in 18 files with no rule change** |

**Also new, not in docs/09:** the filled contour's angle differs slightly from its outline's on two
icons measured — `trash`'s taper reads 4.23 / 4.29 / 4.00° filled against 4.02 / 3.98 / 4.00°
outline, and `code`'s slash 75.53 / 73.74 / 75.96° filled against 73.14 / 72.26 / 73.18° outline.
Both are agreed drawings; nothing states whether a filled twin may change an angle, and C10/C12
only hold the ink box.

---

## 4. Statements that are true but recorded in the wrong place

These are not wrong. They are the only record of something the rulebook should hold, which by
`CLAUDE.md:48-52` makes them a bug of the same kind.

### 4.1 The sort family's 60 approved warnings exist only in a withdrawn plan

`plans/sort-family.md:3` is headed **WITHDRAWN**, and `:25-30` carries three things recorded
nowhere else:

- Maruti's approval of the drawings as they ship — *"the balance of how i see the icons and their
  sizes look good and balanced"* — and *"the warnings they raise in `npm run check` are expected"*.
- The finding at `:9-14` — **"No family in this set keeps one ink box"** — whose measurements are
  all correct (`menu` runs 10.5 · 10.5 · 7.5 · 9.0 tall at 24; `chevron-up` 7.43 · 6.35 · 9.03;
  `list-bullet` 11.0 · 14.0 · 12.5 · 14.5 — the 14.5 is `list-ordered`; `arrow-up` 10 · 14 · 11.5 ·
  10 wide; `sort-2` 18×18 against `sort`'s 18×15; `sort-3` 18×11.52) but **whose headline is false
  as stated.** Re-measured at the pin: of the 107 name-families with two or more members at 24
  (excluding `-small`/`-large`), **53 keep exactly one ink box** — `lock` ×6 all at 16×20, `cart`
  ×5, `check-circle`, `help`, the four `layout-*` — and 54 vary. The 13 `sort*` character concepts
  are themselves all 18×15 · 16×13.5 · 14×12. So the true finding is the narrower one the same
  paragraph reaches: *"what a family shares is the dimension its mark's own structure fixes (arrows
  all hold 15 tall and vary in width; menu holds 15 wide and varies in height), not a box"* — which
  holds for the mark families and not for the set. **MISLEADING as a headline; the reasoning and
  every number under it stand.**
- Two undecided design questions (`:45`, `:70-74`): the A/B-vs-C/D board, and the chevron pair
  against solid triangles.

Measured against the plan: the 60 warnings are **12 concepts** — `sort-alpha-*` at all three
masters, `sort-numeric-*` at 20 and 16 only (`sort-numeric-*` at 24 is clean) — plus `trash` at 20
and 16 makes 62. The plan's own proof criterion was *"`npm run check` with **no new warnings**"*
(`:66`), and it shipped 60.

**And a sixth of the "expected" warnings are simply a missing note.**
`lab/drafts/archive/glyph-9-15.js` says the board *"declares `glyph: 'numeral'` for that reason"* —
but the shipped `sort-numeric-*` files carry only `<!-- box: … -->`. Probed in memory with
`<!-- glyph: numeral -->` injected, **the 12 outline warnings at 20 and 16 clear: 72 warning lines
fall to 60.** The 24 filled-numeric lines stay, because §5f's area kinds do not read that note.
So the draft intended the declaration, the approval dropped it, and C19's own numeral carve-out —
written for `list-ordered` on 2026-09-26 — has never been applied to the six numeral icons that
need it. **This one is a straight fix, not a ruling.**

**Edit.** Declare `glyph: numeral` on the six `sort-numeric-*` concepts (12 warning lines go); a
C-row in `docs/07` for what the family settled, per `SKILL.md:179-181`; the two open questions into
a live plan or the decision agenda; and either a note kind that can express an overlap or the
warning baseline (`severity-proposal.md` §2), because `parseGapNote` cannot take the measured
−1.04.

### 4.2 C17's own numbers are superseded inside its own row

`docs/07:57` states *"gap **3** (two strokes) at 24 · 20"* and then, 300 words later, that at 16 the
air is **3.25** (`menu`, `menu-2`, `menu-arrow-*`), **4.75** (`menu-3`) and **6.25** (`menu-4`) —
*"not this row's fixed 3 / 4.5 / 6, which hold at 24 and 20 only"*. A reader who stops at the
headline draws the 16 master wrong. `CLAUDE.md:184` states it correctly.

**Edit.** Lead the row with the per-master table.

### 4.3 Lint's internal check numbers read like docs/01 sections, and are cited as if they were

`§5`, `§5b`, `§5c`, `§5d`, `§5e`, `§5f` are **lint's own check IDs**, in its source comments only
(`lint.mjs:96, 133-137, 230, 242, 448, 470, 478`). Verified: **no user-visible message cites them**
— every one of the 62 warnings in the pinned run cites **§6**, which does exist (`docs/01:325`).

But they leak into the prose, where docs/01 has **§1–§8 only** and its §5 is *Corners and radii*:
`CLAUDE.md:92, 158, 189, 254, 282` · `docs/08:328, 344, 346, 353` · `SKILL.md:72` ·
`plans/facing-gap.md:98, 118`.

**Edit.** Rename lint's internal IDs (`L5f`) or give docs/01 the sections. Either way, one choice,
applied everywhere at once.

### 4.4 Two identical-outline pairs are justified only in a file comment

`building-3`/`building-4` (*"F's outline, filled another way"*) and `compass`/`compass-3`
(*"round 1's B filled turned white-on-dark"*). Their four relatives in the same situation —
`ban`/`ban-2`, the four layout families, `globe`/`language` — are in docs/07. See 1.7.

---

## 5. Checked and still true

Recorded so the next sweep does not re-measure them.

| Statement | Where | Verified at the pin |
|---|---|---|
| `package.json` is 0.0.1, private, no git tags | `docs/07:49` | true — load-bearing for C9/C27 |
| Stroke 1.5 · 1.5 · 1.25; filled 2.5 · 2 · 2 | `CLAUDE.md:189`, `masters.mjs:10,20` | true — 143 concepts line-heavy, 342 light, the same 143 at all three masters, 0 mixed |
| `MIN_GAP` is a literal 1.5, deliberately not derived from the stroke | `masters.mjs:59-64` | true |
| Only `<svg>` and `<path>`; zero `<rect>`/`<circle>`/`<g>` | `CLAUDE.md`, `docs/01:401-403` | true — error-enforced |
| `keyline: mark` on 136 concepts; the three opt-outs are disjoint | `docs/01:105-115` | true — 136 + 57 `box:` + 5 `anchor:` = **198 of 485 concepts (40.8%)** exempt from the keyline match; 287 held to one; 0 overlaps |
| Every icon ships as a pair | `CLAUDE.md:184` | true — 1,455 pairs, 0 missing twins, 0 ink-box warnings |
| `src/_legacy-stroke-2/` holds the pre-decision icons | `CLAUDE.md:237` | the directory exists |
| `geometry.test.mjs` is not part of `npm run check` | `docs/09:47` | true — `package.json` `check` = `build && lint`. No git hooks, no `.husky`, no `.github` |
| The two unenforced §6 corollaries | `docs/08:285-320`, `CLAUDE.md:157` | the enclosed-shape one is in code (`selfGap`, `facingGap`); **"no more than 3 parallel strokes" is still not** |

---

## 6. How to rule on this list

The list splits three ways, and only the third needs Maruti.

**Straight corrections — no decision, just an edit.** 2.1 · 2.2 · 2.3 · 2.4 · 2.5 · 2.6 · 2.7 ·
2.8 · 2.10 · 2.11 · 2.12 · 2.13 · 2.17 · 2.19 · 2.20 · 1.3 · 1.4 · 1.9 · 3b.5 · 4.2 · 4.3, the
whole of §2b (the plans' stale baselines and test counts, the lab prose, `research/queue.md:8`,
`docs/06:16` and `:113`, `docs/08:262` and `:423-424`, the volume-levels note), and retiring the
dead text in §3 (docs/02's pipeline and contribution rules, docs/03's weight axis and size
sections, docs/05's superseded slash). Each is a measured number or a pointer. **Recommended: one
commit per document**, so the diff reads as a sweep rather than a rewrite, and `docs/09:53`'s
archival of the dead lab pages and `templates/` goes in the same pass.

**Three of those are not documentation at all, and should go first.** (a) Declare `glyph: numeral`
on the six `sort-numeric-*` concepts — 12 of the 72 warning lines clear, and the note is one C19
already authorises (§4.1). (b) Remove `filled: 'outline'` from the lab's visible labels and code
paths, since `draft-svg.mjs:92` throws on it (§2b.2). (c) Rewrite `README.md` from `CLAUDE.md`
rather than patch twenty rows (§2b.1).

**Corrections that need one sentence of judgement, not a ruling.** 1.1 (which sentence replaces the
false Fluent citation — the decision it supported is untouched) · 1.2 (how docs/01 should describe
its own gate, which follows from `severity-proposal.md`) · 1.5 (whether docs/07:78 becomes the
single angle list) · 2.9 and 2.14–2.16 (whether a dated record is restated or left as a record).

**Rulings — these are not stale statements, they are decisions the docs are waiting on.** Listed
here because the document as written is false of shipped drawings until each is taken:

| | The ruling | Icons it moves |
|---|---|---|
| 1.6 | What `volume-minus` and `volume-plus` are, since they are neither levels nor states | 2 concepts, and the shape of C28 |
| 1.7 | May a number mark a difference visible only in the filled style | 22 concepts, plus 5 more that converge at 16 only |
| 1.8 / F1 | The gap floor, now that docs/03's justification for it is dead and the scan behind it covered 19% of the set | the whole set |
| 1.5 / 3b.1 | The ~17 default drawings that leave 0/45/90 with no grant | ~17 concepts |
| 3b.2 | `check-circle`'s 1.5 cut, which leaves no fully clear pixel at 24 or 20 | the `check-circle` family and every swap partner beside it |
| 3b.3 | The container radius vocabulary — 30 concepts at 1.5 against 103 at 2.5, and 3 that mix radii inside one drawing | ~133 concepts |
| 3b.12 | The landscape/portrait keyline drift, and whether `box:` is now a keyline system | 86 concepts held to those keylines, 57 already opted out |
| 4.1 | A C-row for the sort family, and how an undeclarable deviation is recorded | 12 concepts, 60 warnings (48 after the `glyph: numeral` fix) |
| 2b.4 | Whether every px-of-ink figure in the docs is restated with its method, or replaced by a reproducible geometric measure | the evidence behind C7 and docs/08 §3.1 — not their conclusions |
| G6 | **`help` vs `help-circle`** — `alert-circle`, `check-circle` and `x-circle` all name their ring; `help` … `help-4` do not. Verified at the pin: no `help-circle` exists | 4 concepts, 24 files. `docs/09:26` called it *"one inconsistency to fix before release"* and C9 makes a rename free **only until launch** — this one has a deadline |

Those eight, plus docs/09 §6's six, are what card 5.2 ranks into one agenda. **Nothing in §1–§5
above should be edited piecemeal while an icon is on the board** — by I5 a rule changes everywhere
at once, which means a sweep, not a patch.

---

*Written for card 1.16 of `plans/set-and-rules-audit.md`. Companions:
`docs/audit/rule-register.md`, `docs/audit/enforcement-gap.md`,
`docs/audit/severity-proposal.md`.*
