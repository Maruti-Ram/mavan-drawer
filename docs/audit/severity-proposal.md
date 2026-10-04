# Severity proposal — Maruti's Q2

**For every rule: should it hard-stop a drawing, stay a warning, or be a note — and why.**
Proposal only. **No lint behaviour is changed by this card**, and nothing here is actioned until
Maruti rules on it.

**Pinned to `5933041`: 485 concepts · 2,910 drawings.** Lint at the pin: 2,910 · 2,848 clean ·
**62 warned** · 0 failed, exit 0. The measurements behind every row are in
`docs/audit/enforcement-gap.md`.

---

## 1. The problem in one paragraph

Today the gate protects the **declarations** and not the **drawing**. Every error in
`tools/lint.mjs` is either a note that lies or a file that is not the shape `docs/01` §8 describes;
every geometric rule — the gap floor, the bend minimum, keylines, centring, the size families, the
filled-vs-outline box — is a warning and blocks nothing (`lint.mjs:648,652`). `queue.mjs approve`
inherits the same test (`:270-273`), so an approval that adds sixty warnings writes the files,
ticks the sheet and prints the commit list. That has happened: 60 of the 62 standing warnings
arrived that way.

The result is not that bad drawings ship — the eye catches those. The result is that
**`npm run check` can no longer tell you anything new.** It has a permanent floor of 62 warnings,
so warning 63 is invisible.

---

## 2. The one change worth making before any rule is re-graded

**A committed warning baseline.** `npm run check` exits 1 when the *set* of warnings differs from a
checked-in baseline — a new warning fails, a fixed warning fails until the baseline is updated, and
updating the baseline is a visible line in a commit diff.

Why this first:

- It makes every geometric rule blocking **without re-grading a single rule.** No decision about
  the gap floor, the radius or centring is needed to adopt it.
- It is exactly how the audit plan proves itself (`plans/set-and-rules-audit.md:431-433` pins the
  baseline and says *"if it is not, this build changed something it should not have"*). The icon
  loop deserves the same instrument the audit gave itself.
- It turns an approved deviation into a **recorded** one even where the note vocabulary cannot
  express it — which is the sort family's exact problem (`enforcement-gap.md` §2.4).
- It costs nothing to the 2,848 clean drawings.

The one thing it does not do is explain *why* a warning is agreed. That stays the note's job
(§3 below), and the baseline is the fallback for deviations no note can describe.

**Recommendation: adopt it, and keep every geometric rule a warning until the rulings in §5 are
taken.** Then promote them one at a time, each with its drawings already clean.

---

## 3. The grading model

Three tiers, and the mechanism that makes a hard stop humane. The project already invented the
mechanism; this just names it.

| Tier | Means | When a rule belongs here |
|---|---|---|
| **Error** | blocks the commit | A break is *always* a defect, **and** the measurement is trusted with no known blind spot, **and** an agreed exception can be declared in the file and verified against the drawing |
| **Warning** | prints, does not block (but breaks the baseline, §2) | The measure has named blind spots, or the rule is a judgement the eye makes |
| **Note** | prints a reading on every run | A number worth seeing: the ink box, the keyline match, the knockout reading, the gap in force |

**The pattern that earns an error is "error + declarable exception".** `grows:` is the model:
docs/01:249-251 — *"the note silences the warning only while the drawings measure what it says: a
note that disagrees with them, one lint cannot read, or one sitting in an outline file is an error.
It can never hide a mistake."* A rule graded to error without that escape stops being a rule and
becomes a cage; C0 says the drawing wins, so the rule must have a legal way to lose.

**A rule may not be graded to error while its own measure has a known hole.** Three measures have
holes recorded in the repo by name (`docs/08:340-343`, `:352-354`, `lint.mjs:394,401,459`). Those
stay warnings until the hole closes, however obviously right the rule is.

---

## 4. Per-rule severity

### 4.1 Already errors — keep them

Everything in `enforcement-gap.md` §3. They are all of the form *the file is not the artefact* or
*a declaration lies*, both of which are always defects and both of which are measured exactly.
**No change proposed.** One wording fix: `lint.mjs:404` prints *"§6 needs 3"* where §6 needs 1.5 of
edge gap — the headline states a centreline distance, the parenthesis is right.

### 4.2 Promote to error — the measure is exact and the rule is settled

| Rule | Today | Proposed | Why | Escape |
|---|---|---|---|---|
| **The filled ink box equals the outline's** (C10/C12) | warn | **error** | The measure is a bounding box, exact to 0.01. The rule is locked and the census that derived it found **0 unexplained** differences in 351 pairs. The escape already exists and is already an error when it lies | `grows:` |
| **Every icon ships as a pair** (`lint.mjs:185`) | warn | **error** | There is no such thing as a half-shipped icon. `CLAUDE.md:184`: approved as a pair. 1,455 pairs, 0 missing — it would fire never, which is the point | none needed |
| **A size family's step** (C8) and **a container's size variant keeps its container** (C18) | warn | **error** | Arithmetic against `SIZE_STEP`; no blind spot. Set is clean | a `box:`-style declared step, if a family ever needs one |
| **A `-small`/`-large` with no default** | warn | **error** | A broken family, not a judgement | none |

Each of these fires on **zero drawings at the pin**, so all four can be promoted the day Maruti
says yes, with no redraw.

### 4.3 Keep as warning — the measure has a hole, or the eye decides

| Rule | Why it stays a warning |
|---|---|
| **The gap floor §6 / §5 / §5b / §5c / §5f** | Three named holes remain: a wedge opening wider than ~6°, two sharp corners facing each other, air under 0.02, and §5c never runs on the **414** shape-filled drawings that also carry strokes (`lint.mjs:459`). And the floor itself is the one number in the register whose derivation does not support it (`rule-register.md` F1). **Warning until card 1.7's derivation and Maruti's ruling** |
| **The C10 bend minimum** | Reads the *declared* `A` radius of a *stroke* path, so a chamfer, a bezier corner and every corner in the **1,026** shape-filled drawings are unseen. Error-grading a half-blind check punishes the half it can see |
| **Keyline conformance** | The ±0.5 tolerance is a number no document chose (`enforcement-gap.md` §5 row 1), and 198 of 485 concepts opt out by note. Decide the tolerance before grading it |
| **Centring** | Same: ±0.5 is invented in code, and C10's *2 dp, no tolerance* applies to bent marks only. See 4.4 |
| **Mark exceeds the mark ceiling** | Fair as a warning; `-large` already has a rule-level exemption |

### 4.4 Rules that need a decision before they can have a severity

These are not grading questions. The number does not exist yet, so no severity is honest.

| # | What is missing | Why it blocks grading |
|---|---|---|
| 1 | **The centring tolerance for an icon that is not a bent mark.** C10 says 2 dp for bent marks; nothing says anything for the other 349 concepts, and `lint.mjs:361` uses ±0.5 | A check at ±0.5 cannot see a 2 dp rule; a check at 0.01 would fail most of the set. One of these is the rule and nobody has said which |
| 2 | **The keyline tolerance.** `docs/01:150-152` gives a direction (*"nothing should exceed its keyline … the dominant mass should reach it"*), not a number | ±0.5 at 16 is 4% of the square keyline |
| 3 | **The container radius vocabulary** (`docs/01:308-321`, open at `docs/07:76` since 2026-09-16) | `radii.mjs` can now measure it; there is nothing to measure it *against* |
| 4 | **The grid rule's third exception.** Measured this session: of 27,029 off-grid coordinates, **14,285 are arc parameters or arc endpoints and 12,744 sit on a plain `M`/`L`/`H`/`V`**. **1,888 of 2,910 drawings (64.9%) put a straight-segment coordinate off the master's grid**; only 79 drawings are arc-derived only. The worst are the tangent constructions — `sparkle-3-filled` 158 values, `gear-3-filled` 128, `wand-2` 123 | docs/01 §3 permits two exceptions: arc-derived decimals, and optical corrections with a comment. Neither covers *a vertex computed as a tangent or an intersection*, which is what two thirds of the set does. **Until §3 names that exception, the rule is unenforceable at any severity** — the residue after it is `[needs measuring]` |
| 5 | **A note kind for two paths that share space on purpose** | `parseGapNote` takes a positive number below 1.5 (`lint.mjs:106-111, 235-238`); the sort family's edge gaps are **−1.04, −0.96, −0.93**. There is no vocabulary for "these overlap by design", so its 60 warnings cannot be declared, only baselined |
| 6 | **Whether a number may mark a filled-only difference** (`rule-register.md` G7, 22 concepts) | C9 says a number marks a different drawing; in 22 concepts it marks a different cut |
| 7 | **May a badge cross 22** (`docs/01:68-70` vs `docs/05:59-61`, `docs/09:38`) | Zero composites ship. Free now |

### 4.5 Demote to note, or drop

| Rule | Today | Proposed | Why |
|---|---|---|---|
| **"Every decimal in a path carries a comment"** (`CLAUDE.md:272`, `docs/01:184-185, 376-377`, `docs/02:101`) | warning that **never fires** | **drop the literal rule; keep the declared note** | No file has ever done it. All 2,910 carry a construction description instead, and that description is what silences the grid check. `docs/09:28` ruled this in September: *"Break right — declared `optical:` / `glyph:` comments replaced it. Drop the literal rule; stop lint treating any comment as a pass."* |
| **The off-grid hatch** (`lint.mjs:216` — `hasComment = /<!--/.test(src)`) | silences the check on **100% of the set** | **narrow the hatch to a declared note**, and hold the warning back until exception 3 above is written | Every one of the 2,910 files has a comment, so the warning branch at `:299` fires **zero** times in the whole run. Narrowing it without §3's third exception would surface 1,888 drawings at once |
| **`optical: dx dy`** | an unvalidated, unlimited exemption from the centring check (`lint.mjs:319-321`) | **note + a bound**: print the declared shift (it already does), and warn when it exceeds what C15's measure recommends for that shape by more than a decided margin | Measured: 45 concepts, 270 files, **94 distinct dx/dy pairs**. C14 says the other masters scale from the 24 anchor by ink height and C15 says a value is never copied — both are derivations, and a derivation is checkable. Today `optical: 3 0` silences a 3-unit offset |

### 4.6 Rules that should never have a severity

Named so that the model does not pretend to cover them. These are eye-only and belong on a surface
(cards 4.1–4.4), not in lint: one apparent weight across the set at 16 · one apparent size · a
silhouette still distinct at 16 among twenty · whether a break improved the icon (C0) · whether a
number is a principle or one icon's arithmetic.

---

## 5. The structural holes, with a proposal each

| Hole | `path:line` | Measured | Proposal |
|---|---|---|---|
| **The off-grid check is dead across the whole set** | `lint.mjs:216, 297-300` | 2,910 of 2,910 files contain a comment; the warning branch fires **0** times; 1,967 drawings / **27,029** off-grid coordinates pass as "documented exception" | Three steps, in order: (1) write docs/01 §3's third exception for a tangent- or intersection-derived vertex; (2) measure the residue; (3) then narrow the hatch from *any comment* to *a declared note* and grade the residue. Do **not** narrow the hatch first |
| **`optical:` is an unvalidated escape from the only placement check there is** | `lint.mjs:319-321, 361` | 45 concepts · 270 files · 94 distinct pairs; a probe with `optical: 3 0` silenced a 3-unit offset | Bound it against C15's own measure (4.5 above). Card 1.11 supplies the comparison |
| **A vacuous pass on an empty or missing directory** | `lint.mjs:623-626, 651-652` | from a tree with no `src/icons`, lint prints `0 drawings` and exits 0. Worse: **no check reads two masters of one icon** — `checkPairs`, `checkFamilies` and `checkAnchors` all look up `${master}/${file}`. Delete `src/icons/16` and lint reports 1,940 drawings, all clean, exit 0; a tree holding one `24/minus.svg` reports `1 drawings · 1 warned`, exit 0 | Two cheap errors: *a master directory is missing or empty*, and *a concept does not exist at all three masters*. Both fire on zero drawings today. This also opens axis F6 — what is held and what gives from 24 to 16 — which has no instrument in the shipping toolchain at all |
| **A symlinked invocation checks nothing and exits 0** | `lint.mjs:620` — `run()` fires only when `process.argv[1] === fileURLToPath(import.meta.url)` | probed: through a symlink the run prints nothing and exits 0 | Fall back to running when the module is the entry point by any path, or print and fail when `jobs` is empty. Folds into the empty-directory error above |
| **Lint's stdout can be truncated when piped — and `approve` reads it through a pipe** | `lint.mjs:651-652` calls `process.exit()` straight after the run's output; `queue.mjs:270-272` captures that stdout to build the approval report | 2 of 6 piped runs were cut short; one delivered 162,529 of 515,024 bytes. The exit code is unaffected | Flush before exiting (or let the process end naturally). Small bug, directly in the approval path |
| **An area-form path inside an *outline* file is invisible to every check** | `lint.mjs:207, 278` — the `AREA` form is stripped from the body, and `areas` is collected only for `-filled` files | probed: an outline file carrying `M-50 -50H99.123456V99Z` in that form passes clean. The shipped set is clean (0 such paths) | Error on an area-form path in an outline file. Fires on zero drawings today |
| **`gap: N` is not held to the drawing, unlike `box:` and `grows:`** | `lint.mjs:509-515` checks only that *something* is under 1.5 | probed: `gap: 0.5` over a measured 1.0 passes. Shipped: `sort` at 16 declares **1** against a measured **1.38** | Hold it the way `grows:` is held — the skill already states the rule (`SKILL.md:86`, *"round it down to what the drawing really holds"*). One shipped file would need its note corrected |

---

## 6. What should also be in `npm run check` and is not

| | Today | Proposal |
|---|---|---|
| `tools/geometry.test.mjs` (95 tests, all passing) | not reachable from any `package.json` script — there is **no `test` script** at all | add to `check`. A geometry bug silently changes every reading in the run. Note the direct-coverage gaps (grep count 0 in the test file): `checkFamilies`, the banned element and attribute checks, the decimal-count error, the undocumented off-grid warning, the missing-`<path>` and missing-`<svg>` errors, and `optical:` |
| `tools/audit/*.test.mjs` (115 tests, all passing) | audit-only by design | leave out of `check`; they guard audit tools, not the set |
| `tools/inkbox-guard.mjs` | outside `check`, and it spawns its own build | leave as a conversion tool, but say so where C7 relies on it: run against the current manifest it reports **228 drawings at 16 · 219 identical · 9 line stacks thinned · 0 drifted** — i.e. it covers 228 of the 970 drawings at 16 and calls the other **742 "new since"**. C7's *"219 of 228"* is a record of the conversion, not a standing guarantee over the set |
| git hooks / CI | **none exist** (`.git/hooks` holds only samples; no `.husky`, no `.github`) | one pre-commit hook running `check`, once the baseline in §2 exists. Without the baseline a hook adds nothing, because `check` already exits 0 |
| **A staleness check** | not built | `docs/09:81` already proposed it: fail `check` when a doc quotes a number owned by `masters.mjs` or the sheet and gets it wrong. `docs/audit/stale-statements.md` is the manual version of this, and the list is long enough to justify the tool |

---

## 6b. One straight fix the audit found on the way

Not a severity question, and cheap enough to name here. **12 of the 72 warning lines in the set
clear by adding a note the draft already intended.** `lab/drafts/archive/glyph-9-15.js` records
that the board *"declares `glyph: 'numeral'` for that reason"*; the shipped `sort-numeric-*` files
carry only `<!-- box: … -->`. Probed in memory with `<!-- glyph: numeral -->` injected, every
`sort-numeric-*` outline warning at 20 and 16 goes — 72 lines to 60. The 24 filled-numeric lines
stay, because §5f's area kinds do not read that note, which is a separate (and real) gap.

C19's numeral carve-out was written for `list-ordered` on 2026-09-26 and has never been applied to
the six numeral icons that need it. Declaring it is `queue.mjs` work on six concepts, verified by
lint, and it is exactly what `SKILL.md:174-177` asks for.

---

## 7. The recommendation, in order

1. **Adopt the warning baseline (§2).** One change, no rule decisions, and it makes every
   geometric rule blocking today. *Recommended.*
2. **Promote the four rules in §4.2.** All fire on zero drawings; all have an escape. *Recommended.*
3. **Add the two cross-master errors in §5.** Zero drawings; closes the vacuous pass and opens F6.
   *Recommended.*
4. **Put `geometry.test.mjs` in `check`.** *Recommended.*
4b. **Declare `glyph: numeral` on the six `sort-numeric-*` concepts** (§6b) — 12 of 72 warning lines
   go, and the note is one C19 already authorises. *Recommended, and independent of everything else
   here.*
5. **Drop the per-decimal comment rule and narrow the off-grid hatch — but only after docs/01 §3
   gains its third exception.** The order matters: 1,888 drawings sit behind it.
6. **Bound `optical:`** once card 1.11 reports.
7. **Leave the gap floor, the bend minimum, the keylines and centring as warnings** until the seven
   decisions in §4.4 are taken. Each is a question for Maruti, not a grading choice, and each is
   listed in the decision agenda (card 5.2) with the number of icons it moves.

---

*Written for card 1.15 / 3.5 of `plans/set-and-rules-audit.md`. Companions:
`docs/audit/enforcement-gap.md`, `docs/audit/rule-register.md`,
`docs/audit/stale-statements.md`.*
