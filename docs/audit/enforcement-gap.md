# Stated vs enforced — card 1.15

**Pinned to `5933041` (2026-10-04): 485 concepts · 2,910 drawings.** Lint at the pin, run for this
card: **2,910 drawings · 2,848 clean · 62 warned · 0 failed, exit 0.** Every number below was
measured this session or carries a `path:line`. Nothing in lint, the docs or the drawings was
changed by this card.

Three kinds of finding are kept apart throughout, and never mixed in one line:

- **(1) a drawing disagrees with a stated rule** — belongs in the findings register, not here;
  this card only says whether a check could have caught it.
- **(2) a rule disagrees with another rule, or with the code** — §4 and §5 below.
- **(3) a drawing is fine by every rule and still looks wrong** — named where it bears on a
  missing check, and left to Maruti's eye.

The severity recommendation this card owes (Maruti's Q2) is its own document:
**`docs/audit/severity-proposal.md`**. Nothing here proposes a change to lint.

---

## 1. The headline

**The gate is one line, and it does not hold any geometry.**

`tools/lint.mjs:648` counts a drawing as failed only if it has at least one *error*;
`tools/lint.mjs:652` is `process.exit(bad ? 1 : 0)`. Warnings are printed and discarded.

Everything that is an error is **textual or structural**: note syntax, root attributes, banned
elements and attributes, decimal count, the margin bound, a declared-box mismatch, a `grows:`
note the drawings contradict, a stale `gap:` note, and the anchor violations. Full list in §3.

**Every geometric rule in the system is a warning:** the gap floor (§6 and all its carve-outs),
the C10 bend minimum, keyline conformance, centring, the C8 size families, the filled-vs-outline
ink box, and a missing twin. A drawing can break all of them at once and `npm run check` exits 0.

The approval loop inherits the hole exactly. `tools/queue.mjs:270-273` runs `npm run check` and
aborts only `if (check.status !== 0)` — so a candidate that adds sixty warnings is written to
`src/icons/`, ticked on the sheet and committed. That is not hypothetical: **60 of the 62
warnings in the set arrived that way** (§2.4).

Two documents state the opposite. `docs/01-foundations.md:3` — *"Every icon obeys this or it does
not ship."* `docs/01-foundations.md:405` — *"The linter checks all of this mechanically."* The
second is true of §8 (the file form) and false of §2, §3, §5, §6 and §7.

**Which is right?** The docs, as intent; the code, as description. The honest repair is not to
weaken the doc — it is to decide which rules block (`severity-proposal.md`) and to stop docs/01
claiming a guarantee the gate does not give. Both edits are listed in
`docs/audit/stale-statements.md`.

---

## 2. The structural holes

### 2.1 The off-grid check is dead across the whole set

`tools/lint.mjs:216` — `const hasComment = /<!--/.test(src);`
`tools/lint.mjs:297-300` — off-grid values become a **note** ("documented exception") when
`hasComment`, and a warning only when it is false.

Measured at the pin: **every one of the 2,910 files contains at least one HTML comment.** 2,808
carry a `tags:` note; all 2,910 carry a free-text construction line. The warning branch at
`lint.mjs:299` therefore fires **0 times in the whole run** (verified: `grep -c undocumented` on
the full output = 0).

What that silences: **1,967 of 2,910 drawings (67.6%) hold at least one off-grid coordinate,
27,029 occurrences in all** — 646 drawings / 8,590 values at 24, 662 / 9,274 at 20, 659 / 9,165
at 16. `trash` at 24 is a fair example: five distinct off-quarter values printed as "documented
exception", where the file's one free-text comment explains the 4° taper and says nothing about
any of them.

The rule as written is **per decimal**, not per file: `docs/01:184-185` (*"Requires a comment in
the source file saying what it corrects"*), `docs/01:376-377` (*"An uncommented decimal is a
bug"*), `CLAUDE.md:272` (*"Every decimal in a path carries a comment saying what it corrects"*).
Measured: the set holds **7,457 comments — 4,422 declared notes and 3,035 free-text lines**, median
123 characters. By keyword proxy (does the free text mention off-grid, tangent, rounded, optical or
construction at all), **493 of the 1,967 off-grid drawings say something about why and 1,474 say
nothing**. Per-decimal coverage is `[needs measuring]` and cannot be checked mechanically — which
is itself the argument for dropping the per-decimal form of the rule.
`docs/09:28` already judged this in September — *"Break right — declared `optical:` / `glyph:`
comments replaced it. Drop the literal rule; stop lint treating any comment as a pass."* **That
verdict still holds and is still unactioned**, and the set has grown from 684 drawings to 2,910
since it was written.

This is the one hole where the fix is cheap and the decision is already made in substance: the
rule Maruti actually works to is *arcs round to the master's decimal ceiling, and a deliberate
optical offset is a declared note* — which lint already checks, as an error, for every note kind.

### 2.2 `optical: dx dy` moves the centring target by any amount, unchecked — and a malformed note switches the check off

`tools/lint.mjs:319-321` reads the note, subtracts it from the measured centre, and pushes a
note. Nothing validates the value — not against C14's per-shape anchor, not against C15's
measured recommendation, not against a ceiling, not against the same shape at another master, not
between the outline and its filled twin. `tools/lint.mjs:361` then tests the shifted centre at
**±0.5**.

So a declared shift is a self-certifying exemption from the only placement check there is, and it
is wide enough to swallow any plausible error: ±0.5 of tolerance plus an arbitrary `dx`. Probed:
`optical: -5 0` on a line 5 units off centre is accepted silently. Worse, **`optical: - .` parses
to `NaN` and disables the check**, because `Math.abs(NaN - mid) > 0.5` is false — the run prints
`centre NaN,NaN` as an info line and no warning. `optical:` is also the one note kind whose value
is never validated at all; `glyph`, `box`, `gap`, `grows` and `anchor` all error on a note lint
cannot read. A **misspelt note key** (`opticl:`) is likewise a silent no-op, as is any
`keyline:` word other than `mark`.

What the tolerance actually hides, measured from the run's own headline readings (centre after the
declared shift, 2,880 non-anchored drawings): **164 drawings sit more than 0.01 off the canvas
centre, 80 more than 0.10, 20 more than 0.25, and 8 sit at exactly 0.50** — `watch-2` at all three
masters in both styles, and `volume-off` at 16 in both. C10/C12 say *centred to 2 dp, no
tolerance*; 164 drawings are outside that and 8 are resting on lint's limit.

At the pin: **45 concepts / 270 files declare a shift, in 94 distinct dx/dy pairs.** C14 says the
other masters *scale from the 24 anchor by ink height*. 94 distinct values for 45 concepts is not
obviously that rule; whether it is, is card 1.11's measurement, not this card's.

**Which is right?** The rule. C14 and C15 define a derivation (end-triangle offset × 0.5, then
the eye, then scale by ink height) and C15 is explicit that *"a value is never carried over from
another icon"* — a derivation is checkable, and nothing checks it.

### 2.3 Lint cannot see a missing master, a missing style or an extra file

`tools/lint.mjs:623-626` builds the job list per master and uses
`existsSync(dir) ? readdirSync(dir)… : []`. A master directory that is missing contributes **zero
jobs, silently**. From a tree with no `src/icons` at all, lint prints `0 drawings · 0 clean · 0
warned · 0 failed` and exits 0.

Worse than the empty-directory case: **no check in the file reads two masters of one icon.**
`checkPairs` (`lint.mjs:178-196`), `checkFamilies` (`:537-558`) and `checkAnchors` (`:567-615`)
all look up `${master}/${file}` — same master, every time. Delete `src/icons/16` and lint reports
1,940 drawings, all clean, exit 0. Add a hand-written file at one master only and nothing notices
except the pair check, which would catch a missing *style* at that master (`:185`, as a warning)
but never a missing *master*.

Probed: a tree holding a single `src/icons/24/minus.svg` and nothing else reports
`1 drawings · 0 clean · 1 warned · 0 failed`, exit 0 — the one warning being the missing filled
twin. A master folder that is not in `MASTERS` (say `src/icons/32`), a subfolder, and any non-`.svg`
file are all ignored in silence.

That is also why the whole of axis F6 — what is held and what gives from 24 to 16, Maruti's stated
top axis — has no instrument in the shipping toolchain at all.

### 2.5 Three ways the run can report a false green

Found by probe, not by reading. None is hypothetical.

- **A symlinked path prints nothing and exits 0.** `lint.mjs:620` gates the whole run on
  `process.argv[1] === fileURLToPath(import.meta.url)`. Invoked through a symlink the two paths
  differ, `run()` never fires, and the process exits 0 having checked nothing.
- **Piped stdout can be truncated.** `lint.mjs:651-652` calls `process.exit()` immediately after
  the run's `console.log` output. Of six piped runs, **two were cut short — one delivered 162,529
  of 515,024 bytes.** The exit code is unaffected, but **`queue.mjs:270-272` reads lint's stdout
  through a pipe to build the report it prints at approval**, so an approval's own report can lose
  the lines that matter.
- **An area-form path inside an outline file is invisible to every check.** `lint.mjs:278` strips
  the `AREA` form (`<path fill="currentColor" fill-rule="evenodd" stroke="none" d="…">`) from the
  body before any check reads it, and `areas` is only collected for `-filled` files
  (`lint.mjs:207`). Probed: an outline file carrying
  `M-50 -50H99.123456V99Z` in that form passes clean — off-canvas, over-precision geometry that no
  check sees. The shipped set is clean (0 outline files carry an area-form path; the 2,910 bodies
  hold only `<path d>`, with commands `M L H V A Z h v l` and no Béziers), so this is a latent
  hole, not a current defect.

Two smaller ones from the same probes: the element and attribute deny-lists are **closed lists**
(`lint.mjs:41-42`), so `fill=` on a plain path, `<title>`, `<mask>`, `<text>` and
`vector-effect` all pass; and when the `<svg>` root is missing, `lint.mjs:266` returns that error
alone and **discards every note error already found**.

### 2.4 The largest body of approved deviation in the set was never taught to lint

60 of the 62 warnings are the 12 `sort-alpha-*` / `sort-numeric-*` concepts (`sort-alpha-*` at all
three masters, `sort-numeric-*` at 20 and 16 only; `sort-numeric-*` at 24 is clean). Verbatim
examples from this session's run:

```
warn  1.24 of air across one cut-out at 17.67,7.54 — §6 needs 1.5
warn  paths 4/5 are 0.46 apart — §6 needs 3 (edge gap -1.04 < 1.5)
```

Maruti approved these drawings on the eye, in the Library, and that approval is recorded —
`plans/sort-family.md:25-30`: *"the balance of how i see the icons and their sizes look good and
balanced"* … *"the warnings they raise in `npm run check` are expected"*. By C0 that is the rule
being carried outside its range, which is the system working.

But three things did not happen, and all three are required by the project's own process:

- **No note.** `.claude/skills/icon/SKILL.md:174-177` says an agreed deviation is taught to lint
  *in the same piece of work*, as a note lint verifies. None of the 72 sort files carries one.
- **No C-row.** `SKILL.md:179-181` says an approval that settles a rule gets the next C-number in
  `docs/07-character.md`. docs/07 runs C1–C30 and has nothing about the sort family, although
  `plans/sort-family.md:9-14` records a genuine set-wide finding (*"No family in this set keeps
  one ink box"*) that exists nowhere else.
- **The plan's own proof was not met.** `plans/sort-family.md:66` — *"`npm run check` with no new
  warnings"* — and it shipped 60.

**A sixth of them is simply a missing note.** `lab/drafts/archive/glyph-9-15.js` records that the
board *"declares `glyph: 'numeral'` for that reason"*, but the shipped `sort-numeric-*` files carry
only `<!-- box: … -->`. Probed in memory with `<!-- glyph: numeral -->` injected, **12 of the 72
warning lines clear** — every `sort-numeric-*` outline warning at 20 and 16. The 24 filled-numeric
lines stay, because §5f's area kinds do not read that note. So C19's numeral carve-out, written for
`list-ordered` on 2026-09-26, was never applied to the six numeral icons that need it: the draft
intended the declaration and the approval dropped it. **That part is a straight fix, not a ruling.**

The rest of the vocabulary **cannot express this deviation even if someone tried.**
`parseGapNote` (`lint.mjs:106-111`) accepts only a positive number, and `lint.mjs:235-238` errors
unless it is below 1.5. The sort warnings include edge gaps of **−1.04, −0.96 and −0.93** — paths
that overlap by design. There is no way to declare "these two strokes share space on purpose".

The operational cost is immediate: `npm run check` now has a permanent floor of 62 warnings, so
**the next real warning is invisible** unless somebody diffs the output against a remembered
baseline. The audit plan pins that baseline for its own run; the icon loop does not.

By contrast `trash` — the other two warnings, agreed as the C22 covered junction
(`docs/07:62`, `docs/09:31`, *"Lint is wrong; fix owed to `tools/lint.mjs`"*) — **could** be
declared today: measured edge gaps 0.99 at 20 and 0.75 at 16, both expressible as `gap:`. It has
not been, in the two weeks since docs/09 said so.

---

## 3. What the gate actually holds — the full error list

Reading `tools/lint.mjs` end to end: **28 error sites** — lines 171, 223, 226, 233, 236, 245, 257,
260, 266, 269, 270, 273, 279, 280, 281, 284, 294, 314, 325, 326, 328, 350, 512, 575, 580, 585, 594,
602. These and only these reach the exit code.

| Error | `lint.mjs` | Enforces |
|---|---|---|
| `grows:` in an outline file | 222-224 | docs/01:246 |
| `grows:` not four numbers | 225-227 | docs/01:246 |
| `gap:` not a distance | 232-234 | CLAUDE.md:282 |
| `gap:` not below 1.5 | 235-238 | docs/01:327 (the note may only lower the floor) |
| `gap:` no longer needed (stale) | 509-512 | the note self-expires |
| `glyph:` kind unknown | 244-246 | C19 |
| `anchor:` unparseable / names itself | 256-262 | C28 |
| `box:` not a size | 325 | docs/01:121 |
| `box:` with `keyline: mark` | 326 | docs/01:127 |
| `anchor:` with `box:` or `keyline: mark` | 327-330 | docs/01:139-140 |
| no `<svg>` root | 266 | docs/01:384 |
| root attribute missing / wrong / disallowed | 268-274 | docs/01:392-398, C7, `FILLED_WEIGHT` |
| banned element / attribute / stroke on a path | 279-281 | docs/01:398-403 |
| no `<path>` found | 284 | docs/01:399 |
| coordinate over the master's decimal ceiling | 294 | docs/01:187 |
| ink crosses the margin bound | 313-314 | docs/01:46, `MASTERS[*].bound` |
| declared box ≠ the drawing | 349-350 | docs/01:124 ("as an error, not a warning") |
| declared growth ≠ the drawings | 171 | docs/01:249-251 |
| anchored member: anchor missing / inkless / itself anchored | 575-588 | C28 |
| anchored member: ink outside the anchor's box, or on neither x edge | 594, 602 | C28 |

**The shape of it:** every error is either *a note that lies* or *a file that is not the file form
docs/01 §8 describes*. Both are worth erroring on. But together they mean the gate protects the
**declarations** and not the **drawing** — a note can never hide a mistake, while the mistake
itself only ever warns.

---

## 4. Stated and not enforced

One row per rule a document states that no check in `npm run check` tests. "Instrument" says
whether the measurement now exists after wave 0 (`tools/audit/`), which is what makes each row
cheap or expensive to close.

| # | The rule, in plain words | Stated at | Enforced? | Instrument |
|---|---|---|---|---|
| E1 | A container's corner is 2.5, a bend or detail 1.5, a hard corner 0 — and **no value in between** | `docs/01:310-321` | no | `tools/audit/radii.mjs` (new) |
| E2 | The radii at 20 and 16 are *"set per icon while drawing and recorded here once they settle"* | `docs/01:317-318` | no — and never recorded | `radii.mjs` |
| E3 | A bent mark's corner is an arc of radius half the weight | `docs/07:50` (C10), `masters.mjs:28` | **partly** — `lint.mjs:372-377` reads only the declared `A` radius of a *stroke* path | `radii.mjs` measures a drawn corner |
| E4 | Angles default to 0/45/90; 30 and 60 where the subject demands, justified in the file | `docs/01:191-192` | no — `docs/01:201` says so plainly | `tools/audit/angles.mjs` (new) |
| E5 | The ~20 named per-icon angle grants (trash 4°, code 73°, home-2/-3 36.9°, gear 60°, alert-triangle 61°, map-pin, package-2/-3, lightbulb, watch, pencil, language, megaphone, sparkle…) | `docs/07:78`, C30 | no | `angles.mjs` |
| F5 | No enclosed shape smaller than 1.5 across | `docs/01:350` | **partly** — `selfGap` §5b and `facingGap` §5f, with named blind spots (`docs/08:340-343, 352-354`) | exists |
| F6 | No more than 3 parallel strokes in one run | `docs/01:351` | no — `docs/08:316` admits it | none |
| F7 | When a detail cannot fit, remove the detail | `docs/01:352-354` | not checkable | eye |
| F8 | A hole punched in a solid obeys a **3-unit** minimum, not the gap floor | `docs/03:60-62` | no | `facingGap` could |
| F9 | The filled cut weights: C18's medium cut 2 · 1.75 · 1.75; `file-text` punches at 1.5 | `docs/07:58`, `docs/07:64` | no | `radii.mjs` / `facingGap` |
| F10 | A counter is measured by the largest circle that fits inside it | `docs/07:63` (C23) | no — *"Lint cannot see this either way"* | none |
| B7 | A bent mark's outline ink is centred to **2 dp**, no tolerance | `docs/07:50` (C10/C12) | no — `lint.mjs:361` allows ±0.5 | exists |
| B8 | An open pointing mark's shift is the per-shape anchor, scaled to other masters by ink height | `docs/07:54` (C14) | no — the declared value is taken as given (§2.2) | arithmetic |
| B9 | A shift is **derived** (end triangle × 0.5), never copied from another icon | `docs/07:55` (C15) | no | `optical-sheet.mjs` computes it; nothing compares |
| C5a | A repeated element thickens **in place** when filled (so its gap is its own thickness) | `docs/07:57` (C17) | no — only the resulting box difference is compared | `congruence.mjs` |
| D6 | Every decimal in a path carries a comment saying what it corrects | `CLAUDE.md:272`, `docs/01:184-185, 376-377` | **no** — any comment passes (§2.1) | trivial |
| A7 | One path per discrete stroke run, **container first, details after** | `docs/01:399-400` | no — and `lint.mjs:332-335` silently *assumes* it to split container from mark | trivial |
| A8 | Shipped format is outlined fills only; the stroked source stays private | `CLAUDE.md:183`, `docs/09:44` | **no outliner, no package, no export exists**; `dist/icons.json` ships stroked paths | — |
| A9 | Every icon ships as outline + filled | `CLAUDE.md:184` | warning only (`lint.mjs:185`) | exists |
| A10 | Sizes × styles is a full grid, no gaps | `docs/07:53` (C13) | **partly** — C8 checks sizes that exist, nothing checks that all of them do | trivial |
| G1 | `<object>[-<modifier>][-<n>][-<size>][-filled]`, object first | `docs/07:49` (C9), `docs/03:167-176` | no | trivial |
| G3 | Numbers never change once the set has shipped | `docs/07:49` (C9) | no (`queue.mjs rename` is the tool that moves them) | trivial |
| G7 | The style word is written into **every** file as `<!-- tags: … -->` | `docs/07:49` (C9) | no — **102 files carry no `tags:` note**: the 17 concepts `plus`, `minus`, `x` and their sizes and circles, plus `more-horizontal` / `more-vertical`. Search for "add" finds no `plus` | trivial |
| G6 | Name the drawing, not the use | `docs/03:171-173` | no — `docs/09:26` judged the break right; the `help` / `help-circle` inconsistency it names is still open | eye |
| F3a | What a filled knockout leaves between **two different holes** (a glyph's terminal to its dot) | `docs/08:340-341` | no — named as uncovered, 0.92 measured in `help-4-filled` at 16 | `facingGap` could |
| F3b | §5c's material check does not run on a shape-filled file that **also carries strokes** | `lint.mjs:459` (`areas.length && ds.length === 0`) | no — **138 concepts, 414 drawings** at the pin (342 light-filled concepts = 204 area-only + 138 mixed). Probed: adding one stroke path to `help-4-filled` at 16 removes its "knockout leaves 1.13" reading entirely | exists |
| F3c | The bend, path-pair and self-gap checks read `ds` only, so a shape-filled drawing's **areas** are measured by nothing except the decimal ceiling, the margin bound and §5c/§5f | `lint.mjs:372, 389, 429` | no | `radii.mjs`, `congruence.mjs` |
| H1–H7 | The whole of `docs/05-modifiers.md`: the five tests, the (16,16) anchor, the 8-unit glyph, the r6 clear zone, the cut-back strategy, the eight modifiers, the `-off` slash and its 2-unit channel | `docs/05` throughout | **no check, and no drawing** — the set ships **zero** badge composites at the pin | — |
| F4 | One apparent weight; one apparent size; the armature; a closed vocabulary of parts | not stated as a rule anywhere | no | `congruence.mjs`, `mass.mjs` (new) |
| I9 | Draw the 15 hardest first, **then freeze the foundations** | `docs/04:75-79` | not a check | — |

Two rows deserve their own sentence.

**H — docs/05 is an entire rule document with no exercise and no enforcement.** At the pin the only
names that look like composites are `menu-arrow-left` / `-right` (a C17 menu style) and the four
`volume-*` members (a C28 level family). Not one icon has ever been drawn to docs/05's geometry —
which is just as well, because `docs/05:37` says it is *"written for the old 2-unit stroke"*. The
good news in that: **the badge rulings cost nothing to take now and get more expensive with every
container that ships** (`docs/01:68-70` vs `docs/05:59-61`, §5 row 4 below).

**I9 — the foundations were never frozen, and the set quadrupled anyway.** `docs/09:61-66`
diagnosed this on 2026-09-20 and named the repair: *pause queue order for a stress batch of hard
containers — `calendar`, `user`, `gear`, `bell`, `lock`, `mail`, `image`, `home`, `eye`,
`chart-bar` — settle the five missing rules from it, then resume.* **All ten shipped. None of the
five rules was written.** Measured composition of the set on the days the rules were made:

| | concepts | `keyline: mark` | agreed `box:` | held to a silhouette keyline |
|---|---|---|---|---|
| 2026-09-17 (C8–C18, eleven rows decided) | 93 | **77 (83%)** | 0 | 16 |
| 2026-09-19 (docs/09 measured here) | 114 | 77 (68%) | 0 | 37 |
| 2026-09-20 (C7 amended, stroke-16) | 190 | 84 (44%) | 12 | 94 |
| **2026-10-04 (the pin)** | **485** | **136 (28%)** | **57** | **292** |

The rulebook was written when five sixths of the set was a directional mark. Today nearly three
quarters of it is an object silhouette, and the five rules that govern object silhouettes —
container radius, detail budget per master, the mark's share of its container from 24 to 16, the
modifier zone, one filled-cut policy — **still do not exist.** That is the largest enforcement gap
in the system, and it is not a lint problem.

---

## 5. Enforced, but never decided — numbers that live only in code

Each of these is a real check doing real work against a constant that no document chose. They are
not wrong; they are **undeclared**. A number in lint that no rule states is the same defect as a
rule no check enforces, read from the other side.

| # | The check | The number | Where it came from | Verdict |
|---|---|---|---|---|
| 1 | Keyline conformance | **±0.5 on each dimension** (`lint.mjs:352`) | nowhere. docs/01:150-152 says *"nothing should exceed its keyline"* and *"the dominant mass of most icons should reach it"* — neither is a tolerance | **The code is making the rule.** At 16 ±0.5 is 4% of the 12-unit square. A drawing may stand 0.5 proud of its keyline and still "fit" it. The check runs on **1,726 of 2,910 drawings (59%)** — 816 declare `keyline: mark`, 338 a `box:`, 30 an `anchor:` — and at the pin **0 drawings report "no keyline match"**, so it is currently inert either way |
| 2 | Centring | **±0.5 from the canvas midpoint** (`lint.mjs:361`) | nowhere, for most icons. C10/C12 say *2 dp, no tolerance* — but only for bent marks | **The rule is right where it exists; elsewhere the code invented the only number there is.** ±0.5 is 50× the stated tolerance, and it is hiding real offsets: **164 drawings sit over 0.01 off centre, 80 over 0.10, 20 over 0.25, 8 at exactly 0.50** (§2.2). `docs/08:212-213` records the cost in a real case: `help-2`'s best 16 passed clean with its mark 1.1 off centre, because lint centres the whole ink box and a container's box is its ring |
| 3 | Pair ink box | **0.01** (`lint.mjs:169`) | C10/C12's "to 2 dp" | **Agree** — 0.01 *is* 2 dp |
| 4 | Declared box | **0.01** (`lint.mjs:349`) | `docs/01:124` says "to 0.01, as an error" | **Agree** |
| 5 | Touching paths are skipped | **`min <= 0.1`** (`lint.mjs:401`) | nowhere; `docs/08:355` records it as the reason C18's flag-to-bar exception was invisible | **A hole with a number on it.** Two strokes 0.09 apart are read as joined |
| 6 | Crossing paths are exempt entirely | `crosses()` → `continue` (`lint.mjs:394`) | nowhere. Correct for `x` and `plus`; undecided in general | **Undeclared.** Nothing says a crossing licenses every other gap between that pair |
| 7 | `selfGap`'s turn gate | **170°** (`geometry.mjs`, reasoned at `docs/08:300-310`) | derived and written up honestly — 35° of margin over the widest legal bend | **Agree, and well documented** — but it lives in docs/08, not in a rule |
| 8 | `facingGap`'s square-on window | **3°**; a wedge opening wider than ~6° is unjudged (`docs/08:352`) | `plans/facing-gap.md` | **Agree as a method; the residue is undeclared.** C23's triangular counters stay the drawer's, by name |
| 9 | Bend check reads the **declared** `A` radius | `lint.mjs:374-376` | implementation convenience | **Different from the rule.** C10 is about the corner the eye sees. A corner drawn as a chamfer, a bezier, or an area path is not read at all |
| 10 | Bend check skips `areas` | `for (const d of ds)` (`lint.mjs:372`) | implementation | **A blind half.** 1,026 of 2,910 drawings are shape-filled; their corners are in `areas` and are never radius-checked |
| 11 | Container-vs-mark split | **the first path is the container** (`lint.mjs:332-335`) | `docs/01:399-400`'s drawing-order convention, which nothing enforces | **The code depends on an unenforced rule.** List the mark first and C8's container check compares the wrong boxes, silently |
| 12 | `inner` is never computed for a filled file | `!areas.length` (`lint.mjs:332`) | implementation | C8/C18's inner-mark check runs on outline files only — stated nowhere |
| 13 | Path identity is **text**, not shape | `normPath` (`lint.mjs:151`) — *"'identical' means the same drawing, not the same shape reached another way"* | deliberate, and said so | **Honest, and it blocks the thing we want.** It is consumed only by `checkAnchors`'s informational count today (5 concepts), but docs/09 §5 item 2 wants *"one object, reused exactly"* as a check, and a text comparison cannot give it: a reversed `V`/`H`, relative vs absolute, or a ring started at another vertex reads as a different drawing |
| 14 | `gap: N` may only ever **lower** the floor | `lint.mjs:235-238` | the note's own logic | **Agree** — and it is why the sort family cannot be declared (§2.4) |
| 15 | `gap: N` need not match what the drawing holds | `lint.mjs:509-515` checks only that *something* is under 1.5 | the note's own logic | **A gap in the best mechanism we have.** Probed: `gap: 0.5` over a measured 1.0 is accepted. Shipped: **`sort` at 16 declares `gap: 1` against a measured 1.38.** `grows:` is held to the drawing to 0.01 and `box:` to 0.01; `gap:` is not held at all. The skill says *"round it down to what the drawing really holds"* (`SKILL.md:86`) — that is a rule, and nothing checks it |
| 16 | `facingGap` discards any reading at or above **1.75** | `geometry.mjs:534, 861` (`cap`) | implementation — it is a warning detector, not a census | **Right for lint, wrong to reuse.** No air-gap census can be built on it without raising the cap |
| 17 | `materialGap` reads only holes and islands **inside** a hole | `geometry.mjs:396, 408-409, 448` | implementation | Excludes the outermost shape, two *different* holes, boundary neighbours under 0.5 apart, and tapers sharper than 20°. All four are named as uncovered at `docs/08:340-343` |
| 18 | Gap warnings print a **centreline** distance as what §6 needs | `lint.mjs:404` — *"§6 needs 3"* | message construction | **Wrong as written.** §6 needs 1.5 of *edge* gap; the parenthesis gives it correctly, the headline does not |

---

## 6. Where lint and the docs disagree — and which is right

| # | The disagreement | Which is right | What follows |
|---|---|---|---|
| 1 | docs/01:3 *"obeys this or it does not ship"* and :405 *"checks all of this mechanically"* vs a gate that holds no geometry | **Both, differently.** The doc states the intent correctly and describes the tool falsely | Decide severity (`severity-proposal.md`); edit docs/01 to say which rules block |
| 2 | §3's grid rule is **per decimal**; lint's hatch is **per file** | **The rule, as amended by docs/09:28** — the literal per-decimal comment is dead, the declared note replaced it | Say that in docs/01 §3 and §7, and make the hatch the note, not any comment |
| 3 | C10/C12 *"centred to 2 dp, no tolerance"* vs `lint.mjs:361` ±0.5 | **The rule** | A 2 dp check on bent marks; a decided tolerance for everything else |
| 4 | `docs/01:68-70` badges may run to 23 of 24 · `docs/05:59-61` the clear zone *"stays inside the live area and never touches trim"* · `docs/01:42` *there is no live area* · no badge exemption in lint | **docs/01 on the live area** (the keyline *is* the bound, and naming it twice invents a layer). The badge question itself is **undecided** — docs/09:38 has been waiting on it since September | Cheap now: **zero composites ship.** It gets dearer with every container |
| 5 | `docs/01:187` 2 dp at 24 and 20 vs C18's **1.75** medium cut, whose half is 0.875 and is written `0.88` | **The 2 dp rule, with the cut restated.** docs/09:39 — *"the two rules cannot both be met"*; harmless in pixels | Either allow the cut a third decimal or move the cut to a value whose half is writable. `docs/08:409` notes Fluent's grid *follows* the stroke, and our 2.0 filled cuts want whole numbers, not quarters |
| 6 | C22 says the `trash` tab legs *"never share space"*, so the drawing stands and *"the fix is owed to `tools/lint.mjs`"* (`docs/07:62`, `docs/09:31`) | **The drawing.** Lint is measuring a covered junction as air | Either fix the measure or declare `gap: 0.99` / `gap: 0.75`. Two warnings, two weeks old |
| 7 | `plans/sort-family.md` declares 60 warnings "expected"; no note, no C-row; the plan's own proof said "no new warnings" | **The drawings** (Maruti's eye, C0) — **and the process was not followed** | A C-row, and a note kind that can express an overlap (§2.4) |
| 8 | `docs/03:34-37` — the min-gap rule is non-negotiable *because* it is what makes the weight axis free | **Neither.** The weight axis was retired (`CLAUDE.md:186`), so docs/03's stated reason for MIN_GAP no longer exists. docs/01:325-347's reason (surviving 16px) is the live one | Card 1.7 re-derives the floor from the surviving reason. The dead justification must not be cited for it |
| 9 | `docs/08:287` and `:319` cite `docs/01-foundations.md:243` and `:245`; those corollaries now sit at `docs/01:350` and `:352` | **docs/01** | Line-pointer repairs, in `stale-statements.md` |
| 10 | CLAUDE.md, docs/08, the skill and `plans/facing-gap.md` all cite **"lint §5c" / "§5f"**; docs/01 has **§1–§8 only**, and its §5 is *Corners and radii* | **Neither is wrong — the two numbering systems collide.** Lint's internal check IDs (§5, §5b, §5c, §5d, §5e, §5f) exist only in its source comments; no user-visible message cites them. Every warning printed in the 2,910-drawing run cites **§6**, which does exist | Rename lint's internal IDs (e.g. `L5f`) or add the sections to docs/01. Cited at `CLAUDE.md:92, 158, 189, 254, 282`, `docs/08:328, 344, 353`, `SKILL.md:72`, `plans/facing-gap.md:98, 118` |
| 11 | `docs/01:102-103` — the 20 and 16 keyline rows are *"proposals until the first icons have been approved at those sizes"* | **The set.** 485 concepts are approved at all three masters | Drop the proviso |
| 12 | `docs/01:317-318` — radii at 20 and 16 *"recorded here once they settle"* | **The doc owes the set.** They settled hundreds of drawings ago and were never recorded | Card 1.2 measures them; container radius is one of the six rulings |
| 13 | `dist/metrics.json` publishes `recession: 0` on **1,028 of 2,910 entries** and `container: null` on **375 filled entries whose outline twin has a number** (`build.mjs:49-50, 54`) | **The rule.** C10/C12 hold the pair's ink box identical to 0.01, so `plus-circle` publishing optical.left **2.71** and `plus-circle-filled` **2.00** for the same silhouette is the metric contradicting the geometry | On record at `docs/09:43` since September. This is the product's differentiator (`CLAUDE.md:249-253`) and nothing checks it — card 1.12 |
| 14 | Two published entries carry **`geometric: null, optical: null`** — `paintbrush-4` at 24 and 20 | **A bug, not a disagreement.** `opticalBearings` returns null on a zero-length arc (`A7 7 0 0 1 3.75 19.5` starts and ends at the same point); the same arc sits in `paintbrush-4-filled` and `chart-pie-3-filled`, 9 files in all. At 16 the arc is 0.001 long and it works | Nothing in the toolchain notices a null bearing. Card 1.12 |
| 15 | **45 entries (15 concepts × 3 masters) publish a "container" that *is* the mark** — ratio ≥ 0.99 on both axes: `x` and its sizes and filled twins, `globe`, `globe-2`, `language-2`, `language-3`, `grid-2`, `table`, `table-2`, `target-2`, `volume-x-filled` | **The metric.** `anatomy()` takes the path whose box equals the whole drawing as the container, so a bare mark reports itself | `docs/09:43` named this as the bare-`x` case; measured, it is 15 concepts, not 3 |

---

## 7. What no check will ever settle

Named here so the severity proposal does not pretend otherwise. Each needs a surface, not a rule.

- **One apparent weight** across the set at 16 — does every icon read with the same darkness in a
  row of twenty. Measurable as ink area (`mass.mjs`), judgeable only on the wall (card 4.1).
- **One apparent size** — a circle and a square on one box reading as two sizes.
- **Silhouette legibility** at real 16px, squinted.
- **Whether a break improved the icon.** C0 is the top rule and it is a judgement. The sort family
  and `trash` are both live examples: lint says one thing, the eye said another, and the eye wins.
- **Whether a number is a principle or one icon's arithmetic.** C24 is the recorded case of this
  going wrong — a corollary promoted from one drawing and withdrawn the same day. The rule
  register's `kind` column is the inventory of how often it has happened since.

---

*Written for card 1.15 of `plans/set-and-rules-audit.md`. Companion documents:
`docs/audit/rule-register.md` (what the rules are and where they came from),
`docs/audit/severity-proposal.md` (what should block), `docs/audit/stale-statements.md`
(what the docs now say wrongly).*
