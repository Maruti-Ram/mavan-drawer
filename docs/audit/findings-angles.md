# Findings — angles (card 1.3)

Measured 2026-10-04 against the pinned tree **`5933041`** — 485 concepts, 2,910 drawings.
Instrument: `tools/audit/angles.mjs` (wave 0). **17,091 straight segments** read, dump filter
`minLength 0.1`. Every number below was produced this session.

**Reproduce:** `node tools/audit/angles.mjs` for the summary; the tables came from a dump of
`anglesOf()` over `listIcons()`, cross-checked by an independent re-derivation in Python (a
42-table workbook was built and discarded; its headline figures are reproduced here in full).

**Conventions.** `dev` is the distance in degrees from the nearest of 0 / 45 / 90, measured on the
undirected line. **Rank by `dev`, never by `fromHorizontal`** — the latter is not invariant under a
90-degree rotation. `offset` = length × sin(dev): what the deviation actually displaces, in the
master's own units, which at the master's own render size is pixels.

**Verification status.** A fresh reviewer was asked to re-check four angle claims independently and
**did not reach them** before it was stopped (it spent its run on the corners card, where it found
and I fixed one real error). So the angle claims below were instead re-verified **by a second,
independently written path parser in this session** — not by re-running `tools/audit/angles.mjs`.
Three backbone claims reproduce to the digit:

| Claim | Instrument | Independent parser |
|---|---|---|
| Classic `chevron-down` leg, outline vs filled | 44.950 / 44.934 · 45.000 / 45.000 · 45.496 / 44.913 | **identical** |
| `trash` wall taper from vertical, outline | 3.964 - 4.023 | `trash` 4.018 / 3.978 / 3.997 · `trash-5` 4.023 / 3.964 / 3.999 — **identical range** |
| Segments at exactly 30 or 60 degrees | 0; closest 0.0014 / 0.0007 | **0; closest 0.00138 / 0.00068** |

The fourth claim — `code`'s outline and filled slash — rests on the instrument plus the literal
run x rise read off the source, which section 4 quotes. **Claims resting on a single instrument run
and not independently re-derived:** the 1,407-pair outline-vs-filled comparison in section 5 and its
threshold counts. Treat those as one-source until card 5.1 re-runs them.

**Coverage gap.** 81 of 2,910 drawings have no straight segment at all (curves only) — 16 outline
and 11 filled at each master. 11 of the 485 concepts therefore have no reading on this axis. The
`minLength 0.1` filter drops 69 short segments, one of which has `dev > 0.5`
(`16/help-4-filled`, dev 18.4).

---

## 1. Totals

| Split | segments | exactly on 0/45/90 | % |
|---|---|---|---|
| All | 17,091 | 14,099 | **82.49%** |
| 24 | 5,748 | 4,755 | 82.72% |
| 20 | 5,669 | 4,743 | 83.67% |
| 16 | 5,674 | 4,601 | **81.09%** |
| stroked paths | 10,183 | — | — |
| filled area paths | 6,908 | — | — |
| outline files | 7,625 | — | — |
| filled files | 9,466 | — | — |

### 1.1 Deviation histogram

| dev (degrees) | segments | % | cumulative % |
|---|---|---|---|
| **== 0** | 14,099 | 82.49% | 82.49% |
| (0, 0.001] | 0 | 0.00% | 82.49% |
| (0.001, 0.01] | 37 | 0.22% | 82.71% |
| (0.01, 0.1] | 188 | 1.10% | 83.81% |
| (0.1, 0.5] | 154 | 0.90% | 84.71% |
| (0.5, 1] | 108 | 0.63% | 85.34% |
| (1, 2] | 41 | 0.24% | 85.58% |
| (2, 5] | 170 | 0.99% | 86.58% |
| (5, 10] | 562 | 3.29% | 89.87% |
| (10, 15] | 842 | 4.93% | 94.79% |
| (15, 22.5] | 890 | 5.21% | 100.00% |
| > 22.5 | **0** | 0.00% | 100.00% |

The empty top bucket is arithmetic, not discipline: 22.5 degrees is the midpoint between 0 and 45,
so no line can be further than that from the nearest of 0/45/90. It means nothing.

### 1.2 Per master

| master | mean dev, all | mean offset, all | segments with dev > 0 | mean dev of those | mean offset of those |
|---|---|---|---|---|---|
| 24 | 1.8674 | **0.1718** | 993 | 10.81 | 0.9945 |
| 20 | 1.8971 | 0.1307 | 926 | 11.61 | 0.8003 |
| 16 | 1.9094 | 0.1167 | 1,073 | 10.10 | 0.6169 |

**24 carries the most ink drift in absolute units**, because its units are the largest. 16 has the
most segments off axis (1,073) and the lowest share exactly on axis (81.09%).

Inside the *legal band* (dev <= 0.5) the mean dev runs 0.00309 / 0.00278 / **0.00392** and the mean
offset 0.00020 / 0.00015 / **0.00039** — so **16's ink drift inside the legal band is 1.95x that
of 24**. The wave-0 statement "mean 0.068 vs 0.049 degrees, twice the ink drift" reproduces as a
*ratio* but **the absolute figures 0.068 / 0.049 do not reproduce at any band measured here**; the
measured values are above.

---

## 2. Three populations, and they are three different kinds of thing

The brief's single near-miss / off-axis split hides a third group. Separating them is the whole
finding on this axis.

| Population | segments | concepts | masters | max offset | mean offset | What it is |
|---|---|---|---|---|---|---|
| **A. Near-miss** `0 < dev <= 0.5` | **379** | 85 | 24:140 · 20:85 · 16:154 | 0.064 | 0.0094 | An intended 45 whose endpoint came off an arc |
| **B. The 16 give** `0.5 < dev <= 2` | **149** | 54 | 24:16 · 20:28 · **16:105** | 0.177 | 0.058 | C7's documented cost — the leg angle giving to hold the ink box |
| **C. Genuinely off axis** `dev > 2` | **2,464** | 124 | 24:837 · 20:813 · 16:814 | **5.46** | 0.965 | Design choices |

A + B + C = 2,992 segments with any deviation; B + C = 2,613, which is the "beyond 0.5" figure.

### 2.1 Population A — a precision question, and it is already answered by the rules

| Test | Result |
|---|---|
| Nearest legal angle | **all 379 are nearest 45. None is near 0 or 90.** |
| Run and rise both on this master's grid | **0 of 379 (0%)** |
| Endpoints on this master's grid | both 0 · one 8 · **neither 371** |
| Run minus rise exactly 0.010 | 252 of 379 |
| Run minus rise 0.001-0.002 | 93 of 379 |
| Decimals needed to write the coordinates | 2 at 24 and 20 (225 segments); at 16, 125 of 154 need 3 |
| Max offset | 0.064 units (`20/heart.svg`) |

**This is not a precision problem and it is not a design problem — it is `docs/01-foundations.md:185-188`
working as written.** A 0-degree or 90-degree line has one component exactly zero, so it can never
be a near-miss; only a 45 needs `|dx| == |dy|`, and the moment one end is an arc tangent point
rounded to 2 dp (24 and 20) or 3 dp (16) the equality breaks by 0.01 or 0.001. That is §3's
permitted exception 1, *"Arc-derived decimals — the endpoint of a circular arc rarely lands on the
quarter grid. Round to 2 decimal places, never more."*

The whole band displaces at most **0.064 px** at the master's own size. **Nothing to fix. The
category should simply be named in the rule so it stops reading as 379 broken segments.**

### 2.2 Population B — C7's cost, and the measurement confirms C10's own figure

**105 of 149 are at 16, and 91 of those are 16 outline.** The concepts are almost all marks:

`arrow-down` `arrow-left` `arrow-right` `arrow-up` · `check` `check-2` `check-2-small` `check-4`
`check-4-small` `check-circle` `check-circle-4` `check-circle-4-small` `check-circle-small`
`check-small` `checkbox-4` · `chevron-down-small` `chevron-left-small` `chevron-right-small`
`chevron-up-small` `chevrons-up-down` `chevrons-up-down-2` · `export` `heart` `help-3`
`login` `login-2/-3/-4` `logout` `logout-2/-3/-4` `menu-arrow-left` `menu-arrow-right`
`puzzle-5` `sort` `sort-2` `sort-3` `sort-ascending` `sort-descending`
`sort-numeric-ascending` `sort-numeric-descending` `sort-alpha-ascending` (+ its 5 siblings)
`upload` `upload-2` `upload-3` · `wrench` `wrench-2` `wrench-3`

C10 states the mechanism and the size: *"At 16 the ink box still holds exactly and the leg angle
gives instead ... the classic chevron's 45 degrees becomes 45.5; largest change 1.87 degrees on
`check-circle-small`."* Measured independently here: `check-circle-small` tops out at **1.87** and
`check` at 0.62, `check-circle` at 1.49, `arrow-*` at 0.71, `chevron-*-small` at 0.65,
`menu-arrow-*` at 1.38. **C10's figure reproduces exactly.**

Max offset in the whole band is 0.177 units. The 16-only sub-band is all under 0.06.

**Licensed, documented, and small.** The two members that are *not* C7's doing are
`wrench` / `wrench-2` / `wrench-3` (a 1.1-3.6 degree taper at all three masters) and the
`sort-alpha` family — see 3.4 and the judged list.

### 2.3 Population C — the design population

2,464 segments in 124 concepts. By name kind:

| Kind | concepts with a straight segment | with any dev > 0.5 | % | segments off axis |
|---|---|---|---|---|
| bare default | 144 | **46** | 31.94% | 623 |
| `-small` / `-large` only | 19 | 6 | 31.58% | 11 |
| numbered | 290 | 90 | 31.03% | 1,739 |
| numbered + size | 21 | **21** | **100%** | 240 |
| **numbered in total** | 311 | 111 | **35.69%** | 1,979 |
| **not numbered** | 163 | 52 | **31.90%** | 634 |
| all | 474 | 163 | 34.39% | 2,613 |

**`docs/09-rule-audit.md:24` says "Every *default* obeys it; leaving it is what makes a numbered
variant." Both halves are wrong.** 46 bare defaults leave 0/45/90 by more than 0.5 degrees, and 29
by more than 2. And a numbered variant is barely more likely to be off axis than a bare default —
35.69% against 31.90%, a four-point difference. The one real signal is that **all 21 numbered+size
concepts are off axis**, which is the flat and steep chevron grid (C12) and the `check-3`/`-4`
family (C11), both licensed by name.

---

## 3. The angle vocabulary actually in use

### 3.1 Recurring off-axis angles (dev > 2), by `fromHorizontal`

| angle | segments | concepts |
|---|---|---|
| 30 | 130 | 9 — `arrow-left-4` `arrow-right-4` `gear-3` `package-3` `star` `play-2` `wand-2` `wand-3` +1 |
| 70 | 79 | 8 — `compass` `compass-2` `compass-3` `cursor` `cursor-3` `cursor-click` `send` `gear-3` |
| 20 | 73 | 7 — `compass` `compass-2` `compass-3` `cursor` `cursor-3` `cursor-click` `send` |
| 60 | 70 | 9 — `arrow-down-4` `arrow-up-4` `language` `sort-numeric-*` x6 `gear-3` |
| 26.6 | 54 | 4 — `megaphone-2` `megaphone-3` `package-2` `sparkle-3` |
| 34.6 | 40 | 10 — `arrow-down-3` `arrow-up-3` `chevron-down-2` + size variants |
| 69.3 | 36 | 6 — the `sort-alpha` family |
| 81.5 | 36 | 2 — `watch` `watch-3` |
| 53.1 | 34 | 12 — `check-4-small` `lightbulb` `sort-alpha-*` and others |
| 55.4 | 32 | 8 — `arrow-left-3` `arrow-right-3` `chevron-left-2` + size variants |
| 52.2 | 28 | 13 — `chevron-*-3` family, `check-3`, `check-4`, `check-circle-3`, `search-3` |
| 70.3 | 28 | 7 — `gear-2`, the `sort-alpha` family |
| 42 | 26 | 4 — `gear-3` `star` `wand-2` `wand-3` |
| 36.9 | 24 | 2 — `home-2` `home-3` |
| 29.9 | 24 | 4 — `gear-3` `gear` `package-3` `star` |
| 66 | 22 | 3 — `star` `wand-2` `wand-3` |

### 3.2 Decision or accident — the run-over-rise test

C30 fixes the **form** of the justification: *"the file declares its run and rise, not a degree
figure (a fixed degree would force the endpoints off the grid)"*. So the test for whether a lean is
a decision or a by-product is whether its run and rise are a small whole-number ratio.

| Population | run and rise both on this master's grid |
|---|---|
| dev == 0 (14,099) | 10,424 (73.9%) |
| 0 < dev <= 0.5 (379) | **0 (0%)** |
| 0.5 < dev <= 2 (149) | 6 (4%) |
| dev > 2 (2,464) | 251 (10.2%) |

Of the 2,464 genuinely off-axis segments, **232 have a run:rise that is a small whole-number ratio
(p:q with p, q <= 8)**. Those are the grid-constructed leans, and they are the honest ones:

| run : rise | from horizontal | segments | concepts |
|---|---|---|---|
| 2:1 | 26.57 | 42 | `megaphone-2` `megaphone-3` `package-2` `sparkle-3` |
| 3:4 | 53.13 | 24 | `lightbulb`, the `sort-alpha` family |
| 3:2 | 33.69 | 20 | `chevron-*-2` and its size variants, `chevrons-up-down-3/-4` |
| 8:5 | 32.01 | 12 | `chevron-down-2-small` `chevron-up-2-small` `chevrons-up-down-3/-4` (filled) |
| 2:3 | 56.31 | 12 | `chevron-left-2` / `-right-2` and size variants |
| 1:2 | 63.43 | 11 | `thumbs-up` `thumbs-up-2` `sparkle-3` |
| 1:3 / 3:1 | 71.57 / 18.43 | 9 + 9 | `megaphone` `sparkle-3` `wand` |
| 1:4 | 75.96 | 9 | `code` `sparkle-2` `sparkle-3` |
| 7:4 | 29.74 | 8 | `gear` `play-3` |
| 1:6 | 80.54 | 8 | `hash-2` `hash-3` |
| 2:5 / 5:2 | 68.2 / 21.8 | 8 + 8 | `sparkle-3` `sparkle-4` |
| 2:7 | 74.05 | 8 | `sparkle-2` `sparkle-4` |

`thumbs-up` is the model case: it declares **63.43 degrees (2 up for 1 across)** in its own comment
— the degree figure *and* the ratio it came from. `package-2` declares **26.57**, which is
`atan(1/2)` to 2 dp. Those two files are doing exactly what C30 asks.

The other **2,232 off-axis segments are not on a whole-number ratio**, which means the drawer aimed
at a degree figure and let the endpoint fall on a 2- or 3-dp decimal. See 3.3.

### 3.3 The 20 / 70 convention — real, consistent, built the way C30 says not to

Seven concepts draw at 20 and 70 degrees, at all three masters, held to within 0.08 degrees:

| Concept | 24 | 20 | 16 | declares a degree? |
|---|---|---|---|---|
| `compass` | 70.01 / 19.99 / 70.04 / 19.96 | 70.07 / 19.93 / 70.02 / 19.98 | 70.01 / 19.99 | yes — "20 deg ... 70 deg" |
| `compass-2` | 70.01 / 19.99 | 69.96 / 20.04 | 70.00 / 20.00 | yes |
| `compass-3` | 69.98 / 20.02 / 19.96 / 70.04 | 70.02 / 19.98 / 19.87 | 70.00 / 20.00 | yes |
| `cursor` | 70.03 / 19.97 / 69.99 / 20.01 | 70.01 / 19.99 | 70.00 / 20.00 | yes — "50 deg 70 deg" |
| `cursor-3` | 70.00 / 70.06 / 19.94 / 20.00 | 70.02 / 69.96 / 20.04 | 70.00 / 20.00 | yes |
| `cursor-click` | 69.98 / 20.02 / 70.04 / 19.96 | 70.02 / 19.98 / 70.25 / 19.75 | 70.00 / 20.02 | **no** |
| `send` | 70.01 / 19.97 / 20.03 / 19.99 | 70.00 / 20.00 | 70.00 / 20.00 | yes — "20° 40° 50° 65° 70°" |

Their run x rise values are decimals, not ratios — `cursor` at 24 is `12 x 4.36`, `compass` at 24
is `4.48 x 1.63`, `send` at 16 is `9.498 x 3.457`. So the convention is **held as a degree target
and paid for in off-grid endpoints**, which is precisely the construction C30 rejects for `code`.
It is also where the two largest ink drifts in the set live: **`send` at 5.46 and `cursor-3` at
5.46 units** — more than five pixels at 24.

Two smaller conventions behave the same way:
- **15 / 75 degrees** — `pencil` (declares "15° 60° 75°"), `compose-3` ("15° 45° 60° 75°"),
  `cursor-2` ("60 deg 75 deg"). Measured 14.8-15.0 and 75.0-75.2.
- **8.5 degrees off upright** — `watch`, `watch-3`, both declaring "8.5 deg"; measured 81.3-81.6
  from the horizontal, i.e. 8.4-8.7 from the vertical, 36 segments each.

### 3.4 30 and 60 degrees are not constructible on our grid

`docs/01-foundations.md:191` — *"Angles default to 0, 45, 90. 30 and 60 are allowed when the
subject demands it (a hexagon, a chart line) and must be justified in the source file."*

| | Result |
|---|---|
| Segments **exactly** at 30.000 | **0 of 17,091** |
| Segments **exactly** at 60.000 | **0 of 17,091** |
| Closest any segment gets to 30 | 0.0014 degrees off |
| Closest any segment gets to 60 | 0.0007 degrees off |
| Segments within 0.5 of 30 or 60 | 316, in 21 concepts (224 near 30, 92 near 60); by master 106 / 106 / 104 |
| Of those 21 concepts, bare defaults | **7** — `gear` `language` `mail` `play` `star` `sort-numeric-ascending` `sort-numeric-descending` |

30 degrees is `atan(1/sqrt3)`; `sqrt3` is irrational, so a quarter grid at 24 or an eighth grid at
16 cannot produce it. **Every "30 degrees" in the set is an approximation**, and the set reaches it
two different ways: `gear` and `play-3` use the grid ratio 7:4 (= 29.74), while `star`, `gear-3`
and `wand-2` use off-grid decimals to land on 29.9-30.2. §3's own permitted-angle list therefore
names two angles the grid in the same section forbids.

---

## 4. The licensed exceptions, verified

| | C22 / C30 states | Measured |
|---|---|---|
| **`trash` wall taper** | 4 degrees | Outline, 12 segments across 3 masters and 2 names: **3.964 - 4.023**, all 12 round to 4. Confirmed. Re-measured from source by a second, independent parser: `trash` 4.018 / 3.978 / 3.997 and `trash-5` 4.023 / 3.964 / 3.999. |
| `trash` filled taper | (not stated separately) | **3.9975 - 4.5612**; 10 of 12 segments round to 4. `trash-5-filled` at 20 is **4.5612** (run x rise 0.43 x 5.39) — 0.56 past the declared value, and the only one of the six filled files that does not round to 4. |
| **`code` slash, outline** | 73.14 / 72.26 / 73.18, run x rise 5x16.5 / 4x12.5 / 3.25x10.75 | **73.1416 / 72.2553 / 73.1786**, run x rise 5x16.5 / 4x12.5 / 3.25x10.75. **3 of 3 exact.** |
| **`code` slash, filled** | — | **75.5297 / 73.7398 / 75.9638**, run x rise 4x15.5 / 3.5x12 / 2.5x10. **0 of 3 match C30.** The filled twin is 2.39 / 1.48 / **2.79** degrees steeper than the outline, on a different run and rise, and C30 declares only the outline's. |

So docs/09:24's "two default exceptions" are both real and the outline figures are exact to 4 dp.
But **`code`'s filled slash is a third, undeclared angle on the very icon C30 was written for.**

---

## 5. Outline against filled

Each outline segment paired with the filled segment of closest orientation and comparable length
(within 25%). 1,407 (concept, master) pairs across 469 concepts; of 7,625 outline segments, 6,979
found a partner and 646 did not.

The literal pairing mis-matches when no like-oriented filled segment of comparable length exists,
producing spurious differences of exactly 90 and 45 degrees (159 and 60 cases). With partners more
than 10 degrees away set aside:

| worst difference exceeds | pairs (concepts), literal | pairs (concepts), partners within 10 deg |
|---|---|---|
| 0.1 degrees | 300 (174) | **158 (108)** |
| 0.5 degrees | 227 (134) | **85 (66)** |
| 1 degree | 184 (96) | **40 (26)** |
| 2 degrees | 159 (80) | **14 (9)** |

**Read the right column.** 108 concepts draw the same line at two different angles in their two
styles by more than 0.1 degrees; nine do so by more than 2.

### 5.1 The chevron family — C12's own admission, measured

120 rows (40 chevron concepts x 3 masters). Rows whose worst outline-to-filled leg difference
exceeds 0.1 / 0.5 / 1 / 2 degrees: **68 / 48 / 28 / 10**.

| Concept | master | outline leg | filled leg | difference |
|---|---|---|---|---|
| `chevron-down-2-small` `chevron-up-2-small` `chevrons-up-down-3` `chevrons-up-down-4` | 24 | 34.818 | **32.005** (= 8:5) | **2.813** |
| `chevron-left-2-small` `chevron-right-2-small` | 24 | 55.182 | 57.995 | 2.813 |
| `chevron-down-2` `chevron-up-2` `chevron-left-2` `chevron-right-2` | 24 | 34.630 / 55.370 | 32.526 / 57.474 | 2.104 |
| `chevron-down-2` and siblings | 16 | 34.795 / 55.205 | 32.839, 32.905 | 1.957 / 1.890 |
| `chevron-down-2-small` and siblings | 16 | 36.409 / 53.591 | 34.560 / 55.440 | 1.850 |
| `chevron-down` (classic) | 24 | 44.950 | 44.934 | 0.016 |
| `chevron-down` (classic) | 20 | 45.000 | 45.000 | **0.000** |
| `chevron-down` (classic) | 16 | **45.496** | **44.913** | **0.583** |

**C12 declares the flat chevron's break and understates it slightly:** *"Flat reaches the cap
(2.5 · 2 · 2) and its filled legs sit up to ~3 degrees flatter at 24, under 1 degree at 20 and
16."* Measured: 2.81 at 24 (so "~3" is right) but **1.96 at 16**, not "under 1". The flat
chevron's own files declare the figure to 0.1 — `chevron-down-2-small` states "0.6° 0.7° 2.8°" —
which matches 2.813 exactly. So the drawings and their comments are more accurate than C12's
summary.

**The classic chevron at 16 is the finding C12 does not cover:** outline 45.496, filled 44.913,
0.583 degrees apart, where at 20 they are identical. That is C7's 16 conversion applied to the
outline and not carried into the filled twin — the same left-behind pattern the corners audit found
in 12 filled files at 16 (`docs/audit/findings-corners.md` 7.1).

### 5.2 Filled-only off-axis

`search`, `search-2`, `search-3` are off axis **in the filled file only** — the outline lens handle
is legal and the filled one is not (dev 10.19 / 14.44 / 7.17, offset 0.73-0.74). Three concepts
where the two styles disagree about whether the drawing obeys the rule at all.

Read from source at 24, `search` is the clearest case. The outline handle is one line,
`M15.7 15.7 L20.25 20.25` — dx and dy both 4.55, **exactly 45 degrees**. The filled handle is a
tapered solid whose two long edges run `14.55,15.95 -> 17.86,20.31` (**52.80 degrees**) and
`15.95,14.55 -> 20.31,17.86` (**37.20 degrees**) — symmetric about 45, 7.80 degrees either side,
so the solid is a wedge where the outline is a parallel-sided stroke. Nothing is wrong with the
drawing; what is wrong is that the only rule covering it says 0/45/90 and the filled file has
neither a legal angle nor a declaration.

---

## 6. Declared against silent

Does the 24 outline file's own comment state a degree figure anywhere? Over the 124 genuinely
off-axis concepts (dev > 2):

| | n |
|---|---|
| States a degree figure | **90** |
| States none | **34** |

Set-wide, **193 of 485 concepts state at least one degree figure in their 24 comment.** The set is
far more disciplined than the rule describes: `chart-pie` declares six angles, `gauge` six,
`face-smile` six, `link` eight, `users-4-wide` eight. `chevron-*-2` declare both the leg angle
*and* the filled-versus-outline difference to 0.1 degrees.

**Formatting note:** the files use three spellings for the unit, and a census has to read all
three or it undercounts — `63.43°` in 131 concepts, `4 degrees` in 53, `73.2 deg` in 11.

### 6.1 Off axis by more than 2 degrees and silent — 34 concepts

| Concept(s) | max dev | max offset | kind |
|---|---|---|---|
| `shield-2` | 22.35 | 0.55 | variant (`shield` declares 68 and 71; `shield-2` declares nothing) |
| `lightbulb-3` `lightbulb-4` | 22.12 | 1.604 | variant |
| `sort-alpha-ascending` `sort-alpha-descending` **(defaults)** + 4 numbered siblings | 21.09 | 1.80 | 2 defaults, 4 variants |
| **`cursor-click` (default)** | 20.14 | 3.37 | the only 20/70 member with no declaration |
| `megaphone-2` | 18.43 | 3.069 | variant |
| `alert-triangle-3` | 17.42 | 4.066 | variant |
| `sort-numeric-ascending` `sort-numeric-descending` **(defaults)** + 4 siblings | 15.04 | 0.898 | 2 defaults, 4 variants |
| `search-2` `search-3` | 14.44 / 7.17 | 0.728 | variant, filled only |
| `chevrons-up-down-3` `chevrons-up-down-4` | 12.99 | 1.146 | variant |
| **`search` (default)** | 10.19 | 0.742 | filled only |
| `map-pin-3` | 8.78 | 0.707 | variant |
| `check-circle-4-small` `check-4-small` `check-circle-4` `check-circle-3-small` `check-circle-3` `check-3-small` | 6.90-8.24 | 0.72-1.65 | variant (C11 licenses the angle; the file does not state it) |
| `alert-circle-4` | 6.70 | 0.50 | variant |
| **`list-ordered` (default)** | 5.26 | 0.278 | the numeral 2's diagonal |
| `trash-5` | 4.56 | 0.69 | variant — `trash` declares 4 degrees, `trash-5` does not |
| `wrench-3` | 3.57 | 0.188 | variant |
| `help-4` | 2.29 | 0.007 | variant |

### 6.2 The 29 bare defaults more than 2 degrees off axis, by ink drift

docs/09:24 names two. There are 29.

| Concept | max dev | max offset (px at its master) | declares? |
|---|---|---|---|
| `send` | 20.08 | **5.46** | yes |
| `code` | 17.74 | **5.00** | yes (C30) |
| `italic` | 15.64 | **4.50** | yes |
| `cursor` | 20.01 | 4.37 | yes |
| `alert-triangle` | 17.42 | 4.07 | yes |
| `cursor-click` | 20.14 | 3.37 | **no** |
| `play` | 15.64 | 3.36 | yes |
| `megaphone` | 18.47 | 2.56 | yes |
| `mail` | 16.24 | 2.52 | yes |
| `thumbs-up` | 18.50 | 2.36 | yes (63.43, with its ratio) |
| `language` | 15.06 | 2.12 | yes |
| `compass` | 20.01 | 2.07 | yes |
| `star` | 21.05 | 2.02 | yes (72) |
| `sort-alpha-ascending` / `-descending` | 21.09 | 1.80 | **no** |
| `map-pin` | 13.86 | 1.49 | yes |
| `lightbulb` | 19.23 | 1.23 | yes |
| `sparkle` | 13.40 | 0.97 | yes (26.79) |
| `trash` | 4.29 | 0.90 | yes (4, C22) |
| `sort-numeric-ascending` / `-descending` | 15.04 | 0.90 | **no** |
| `pencil` | 15.04 | 0.81 | yes |
| `search` | 10.19 | 0.74 | **no** |
| `shield` | 22.35 | 0.55 | yes (68, 71) |
| `wand` | 18.43 | 0.50 | yes |
| `watch` | 8.67 | 0.41 | yes (8.5) |
| `gear` | 15.59 | 0.36 | yes |
| `list-ordered` | 5.26 | 0.28 | **no** |
| `wrench` | 3.57 | 0.19 | yes (45 only — the taper itself is undeclared) |

---

## 6a. The full roll-up — every concept with a segment more than 0.5 degrees off axis

163 concepts, ranked by max dev. "style" says whether the deviation appears in the outline file, the
filled file or both. "kind" is from the name: bare default, `-small`/`-large` only (size), numbered,
or numbered + size. "declares?" is whether the **24 outline file's own comment** states any degree
figure, in any of the three spellings. "max offset" is ink drift in that master's units, which at
the master's own render size is pixels.

Rank by `dev` to see how far from the rule a drawing sits; rank by `max offset` to see what the
deviation actually displaces. They order the set very differently — `shield` tops the dev column at
22.35 degrees and drifts 0.55 units, while `send` at 20.08 degrees drifts **5.46**.

| concept | max dev | max offset | n | masters | style | kind | declares? | distinct fromHorizontal |
|---|---|---|---|---|---|---|---|---|
| `shield` | 22.35 | 0.55 | 12 | 24 20 16 | both | bare | yes | 21.6 21.9 22 22.3 |
| `shield-2` | 22.35 | 0.55 | 12 | 24 20 16 | both | num | **no** | 21.6 21.9 22 22.3 |
| `sparkle-3` | 22.25 | 0.62 | 144 | 24 20 16 | both | num | yes | 12.5 12.6 13.1 13.6 13.7 14 18.3 18.4 20.5 20.6 21.8 22.2 26.6 26.9 63.1 63.4 67.8 68.2 69.4 69.5 71.6 71.7 76 76.3 76.4 76.9 77.4 77.5 |
| `sparkle-4` | 22.25 | 0.78 | 96 | 24 20 16 | both | num | yes | 11.5 11.8 13.7 13.8 15.9 16.1 20.5 20.6 21.8 22.2 67.8 68.2 69.4 69.5 73.9 74.1 76.2 76.3 78.2 78.5 |
| `lightbulb-3` | 22.12 | 1.604 | 12 | 24 20 16 | both | num | **no** | 56.6 56.7 57.6 67.1 |
| `lightbulb-4` | 22.12 | 1.604 | 12 | 24 20 16 | both | num | yes | 56.6 56.7 57.6 67.1 |
| `mail-2` | 21.66 | 3.642 | 18 | 24 20 16 | both | num | yes | 20.4 20.7 20.8 23.3 23.4 |
| `gear-2` | 21.41 | 0.64 | 72 | 24 20 16 | both | num | yes | 6.3 10.3 11.6 48.6 49.5 49.7 53.6 66.3 66.4 70.2 70.3 70.8 |
| `gear-3` | 21.15 | 1.945 | 102 | 24 20 16 | both | num | yes | 6.1 6.2 10 17.9 18.1 29.5 29.9 30 30.2 30.3 30.8 41.9 42 42.3 50 53.7 53.9 54.1 59.2 59.7 60.1 66.1 70 77.7 78.1 |
| `sort-alpha-ascending` | 21.09 | 1.8 | 34 | 24 20 16 | both | bare | **no** | 45.5 46.6 52.7 53.1 53.2 55.9 68.9 69 69.3 70.2 70.3 |
| `sort-alpha-ascending-2` | 21.09 | 1.8 | 30 | 24 20 16 | both | num | **no** | 46.6 52.7 53.1 53.2 55.9 68.9 69 69.3 70.2 70.3 |
| `sort-alpha-ascending-3` | 21.09 | 1.8 | 30 | 24 20 16 | both | num | **no** | 46.6 52.7 53.1 53.2 55.9 68.9 69 69.3 70.2 70.3 |
| `sort-alpha-descending` | 21.09 | 1.8 | 34 | 24 20 16 | both | bare | **no** | 45.5 46.6 52.7 53.1 53.2 55.9 68.9 69 69.3 70.2 70.3 |
| `sort-alpha-descending-2` | 21.09 | 1.8 | 30 | 24 20 16 | both | num | **no** | 46.6 52.7 53.1 53.2 55.9 68.9 69 69.3 70.2 70.3 |
| `sort-alpha-descending-3` | 21.09 | 1.8 | 30 | 24 20 16 | both | num | **no** | 46.6 52.7 53.1 53.2 55.9 68.9 69 69.3 70.2 70.3 |
| `wand-2` | 21.08 | 0.792 | 60 | 24 20 16 | both | num | yes | 5.8 5.9 6 6.1 30 30.2 41.8 41.9 42 66 66.1 77.9 78 78.1 78.2 |
| `wand-3` | 21.08 | 0.792 | 60 | 24 20 16 | both | num | yes | 5.8 5.9 6 6.1 30 30.2 41.8 41.9 42 66 66.1 77.9 78 78.1 78.2 |
| `star` | 21.05 | 2.022 | 60 | 24 20 16 | both | bare | yes | 6 6.1 29.9 30 42 65.9 66 66.1 78 78.1 |
| `cursor-click` | 20.14 | 3.37 | 24 | 24 20 16 | both | bare | **no** | 19.8 20 20.1 69.9 70 70.2 |
| `send` | 20.08 | 5.46 | 24 | 24 20 16 | both | bare | yes | 20 20.1 69.9 70 |
| `compass-2` | 20.04 | 1.51 | 24 | 24 20 16 | both | num | yes | 20 70 |
| `cursor-3` | 20.04 | 5.46 | 24 | 24 20 16 | both | num | yes | 19.9 20 70 70.1 |
| `compass-3` | 20.02 | 2.08 | 30 | 24 20 16 | both | num | yes | 19.9 20 70 70.1 |
| `compass` | 20.01 | 2.07 | 24 | 24 20 16 | both | bare | yes | 19.9 20 70 70.1 |
| `cursor` | 20.01 | 4.37 | 12 | 24 20 16 | both | bare | yes | 20 70 |
| `lightbulb` | 19.23 | 1.232 | 12 | 24 20 16 | both | bare | yes | 53.1 64.2 |
| `thumbs-up-2` | 18.75 | 1.683 | 6 | 24 20 16 | both | num | yes | 63.4 63.5 63.7 |
| `package-2` | 18.55 | 2.836 | 42 | 24 20 16 | both | num | yes | 26.5 26.6 |
| `thumbs-up` | 18.5 | 2.355 | 6 | 24 20 16 | both | bare | yes | 63.4 63.5 |
| `megaphone` | 18.47 | 2.56 | 12 | 24 20 16 | both | bare | yes | 18.4 18.5 71.5 71.6 |
| `megaphone-2` | 18.43 | 3.069 | 12 | 24 20 16 | both | num | **no** | 26.6 |
| `megaphone-3` | 18.43 | 2.362 | 12 | 24 20 16 | both | num | yes | 26.6 |
| `wand` | 18.43 | 0.5 | 48 | 24 20 16 | both | bare | yes | 12.5 12.6 16.7 18.3 18.4 71.6 71.7 73.3 77.4 77.5 |
| `code` | 17.74 | 5 | 6 | 24 20 16 | both | bare | yes | 72.3 73.1 73.2 73.7 75.5 76 |
| `alert-triangle` | 17.42 | 4.066 | 12 | 24 20 16 | both | bare | yes | 61.1 61.6 62.4 |
| `alert-triangle-2` | 17.42 | 4.066 | 24 | 24 20 16 | both | num | yes | 61.1 61.6 62.4 82.2 83.3 84.7 85.5 85.6 |
| `alert-triangle-3` | 17.42 | 4.066 | 12 | 24 20 16 | both | num | **no** | 61.1 61.6 62.4 |
| `alert-triangle-4` | 17.42 | 4.066 | 24 | 24 20 16 | both | num | yes | 61.1 61.6 62.4 81.6 83.3 84.1 84.7 85.5 85.9 |
| `mail` | 16.24 | 2.524 | 18 | 24 20 16 | both | bare | yes | 28.8 28.9 29.6 |
| `sparkle-2` | 16.11 | 0.6 | 96 | 24 20 16 | both | num | yes | 11.7 11.8 11.9 12.5 12.6 14 14.3 15.9 16.1 73.9 74.1 75.7 76 77.4 77.5 78.1 78.2 78.3 |
| `italic` | 15.64 | 4.5 | 6 | 24 20 16 | both | bare | yes | 74.4 74.7 74.8 75.7 |
| `play` | 15.64 | 3.359 | 12 | 24 20 16 | both | bare | yes | 29.4 29.8 30.4 |
| `gear` | 15.59 | 0.361 | 48 | 24 20 16 | both | bare | yes | 29.4 29.7 29.9 30 30.1 30.2 30.7 |
| `arrow-down-4` | 15.34 | 1.81 | 18 | 24 20 16 | both | num | yes | 60 60.3 |
| `arrow-left-4` | 15.34 | 1.81 | 18 | 24 20 16 | both | num | yes | 29.7 30 |
| `arrow-right-4` | 15.34 | 1.81 | 18 | 24 20 16 | both | num | yes | 29.7 30 |
| `arrow-up-4` | 15.34 | 1.81 | 18 | 24 20 16 | both | num | yes | 60 60.3 |
| `play-3` | 15.26 | 3.182 | 12 | 24 20 16 | both | num | yes | 29.7 30.6 |
| `package-3` | 15.09 | 2.765 | 54 | 24 20 16 | both | num | yes | 29.9 30 30.1 |
| `language` | 15.06 | 2.121 | 12 | 24 20 16 | both | bare | yes | 60 60.1 |
| `compose-3` | 15.04 | 0.81 | 18 | 24 20 16 | both | num | yes | 14.8 14.9 15 75 75.1 75.2 |
| `pencil` | 15.04 | 0.81 | 12 | 24 20 16 | both | bare | yes | 14.8 14.9 15 75 75.1 75.2 |
| `sort-numeric-ascending` | 15.04 | 0.898 | 10 | 24 20 16 | both | bare | **no** | 45.5 60 |
| `sort-numeric-ascending-2` | 15.04 | 0.898 | 6 | 24 20 16 | both | num | **no** | 60 |
| `sort-numeric-ascending-3` | 15.04 | 0.898 | 6 | 24 20 16 | both | num | **no** | 60 |
| `sort-numeric-descending` | 15.04 | 0.898 | 10 | 24 20 16 | both | bare | **no** | 45.5 60 |
| `sort-numeric-descending-2` | 15.04 | 0.898 | 6 | 24 20 16 | both | num | **no** | 60 |
| `sort-numeric-descending-3` | 15.04 | 0.898 | 6 | 24 20 16 | both | num | **no** | 60 |
| `cursor-2` | 15.02 | 3.49 | 12 | 24 20 16 | both | num | yes | 15 75 |
| `play-2` | 15.02 | 2.652 | 12 | 24 20 16 | both | num | yes | 30 30.4 31.2 |
| `search-2` | 14.44 | 0.728 | 6 | 24 20 16 | filled | num | **no** | 30.6 32.6 33.4 56.6 57.4 59.4 |
| `map-pin` | 13.86 | 1.486 | 12 | 24 20 16 | both | bare | yes | 51.8 55.7 55.8 58.9 |
| `sparkle` | 13.4 | 0.97 | 48 | 24 20 16 | both | bare | yes | 11.7 11.8 13.3 13.4 76.6 76.7 78.2 78.3 |
| `chevron-down-2-small` | 12.99 | 1.146 | 12 | 24 20 16 | both | num+size | yes | 32 33.7 34.4 34.6 34.8 36.4 |
| `chevron-left-2-small` | 12.99 | 1.146 | 12 | 24 20 16 | both | num+size | yes | 53.6 55.2 55.4 55.6 56.3 58 |
| `chevron-right-2-small` | 12.99 | 1.146 | 12 | 24 20 16 | both | num+size | yes | 53.6 55.2 55.4 55.6 56.3 58 |
| `chevron-up-2-small` | 12.99 | 1.146 | 12 | 24 20 16 | both | num+size | yes | 32 33.7 34.4 34.6 34.8 36.4 |
| `chevrons-up-down-3` | 12.99 | 1.146 | 24 | 24 20 16 | both | num | **no** | 32 33.7 34.4 34.6 34.8 36.4 |
| `chevrons-up-down-4` | 12.99 | 1.146 | 24 | 24 20 16 | both | num | **no** | 32 33.7 34.4 34.6 34.8 36.4 |
| `mail-3` | 12.87 | 2.058 | 18 | 24 20 16 | both | num | yes | 32.1 32.4 32.5 32.6 32.7 |
| `chevron-down-2` | 12.47 | 1.492 | 12 | 24 20 16 | both | num | yes | 32.5 32.8 32.9 33 33.7 34.6 34.8 |
| `chevron-left-2` | 12.47 | 1.492 | 12 | 24 20 16 | both | num | yes | 55.2 55.4 56.3 57 57.1 57.2 57.5 |
| `chevron-right-2` | 12.47 | 1.492 | 12 | 24 20 16 | both | num | yes | 55.2 55.4 56.3 57 57.1 57.2 57.5 |
| `chevron-up-2` | 12.47 | 1.492 | 12 | 24 20 16 | both | num | yes | 32.5 32.8 32.9 33 33.7 34.6 34.8 |
| `chevron-down-2-large` | 12.18 | 1.853 | 12 | 24 20 16 | both | num+size | yes | 32.8 33.7 34.2 34.3 34.4 34.6 35.1 |
| `chevron-left-2-large` | 12.18 | 1.853 | 12 | 24 20 16 | both | num+size | yes | 54.9 55.4 55.6 55.7 55.8 56.3 57.2 |
| `chevron-right-2-large` | 12.18 | 1.853 | 12 | 24 20 16 | both | num+size | yes | 54.9 55.4 55.6 55.7 55.8 56.3 57.2 |
| `chevron-up-2-large` | 12.18 | 1.853 | 12 | 24 20 16 | both | num+size | yes | 32.8 33.7 34.2 34.3 34.4 34.6 35.1 |
| `arrow-up-right-3` | 10.48 | 1.01 | 12 | 24 20 16 | both | num | yes | 8.9 10.4 10.5 79.5 79.6 81.1 |
| `arrow-down-3` | 10.45 | 1.004 | 12 | 24 20 16 | both | num | yes | 34.6 36.1 |
| `arrow-left-3` | 10.45 | 1.004 | 12 | 24 20 16 | both | num | yes | 53.9 55.4 |
| `arrow-right-3` | 10.45 | 1.004 | 12 | 24 20 16 | both | num | yes | 53.9 55.4 |
| `arrow-up-3` | 10.45 | 1.004 | 12 | 24 20 16 | both | num | yes | 34.6 36.1 |
| `hash-2` | 10.2 | 2.25 | 12 | 24 20 16 | both | num | yes | 79.8 80.1 80.5 80.8 |
| `hash-3` | 10.2 | 2.25 | 12 | 24 20 16 | both | num | yes | 79.8 80.1 80.5 80.8 |
| `search` | 10.19 | 0.742 | 6 | 24 20 16 | filled | bare | **no** | 34.8 36.8 37.2 52.8 53.2 55.2 |
| `watch-3` | 8.95 | 0.322 | 36 | 24 20 16 | both | num | yes | 81.1 81.3 81.4 81.5 |
| `map-pin-3` | 8.78 | 0.707 | 12 | 24 20 16 | both | num | **no** | 49.6 49.7 53.1 53.8 |
| `watch` | 8.67 | 0.411 | 36 | 24 20 16 | both | bare | yes | 81.3 81.4 81.5 81.6 |
| `check-circle-4-small` | 8.24 | 0.849 | 10 | 24 20 16 | both | num+size | **no** | 46.5 52.1 52.2 52.6 52.7 52.8 53.2 |
| `check-4` | 8.14 | 2.008 | 7 | 24 20 16 | both | num | yes | 45.5 52.1 52.2 52.8 53.1 |
| `check-4-small` | 8.14 | 1.648 | 7 | 24 20 16 | both | num+size | **no** | 45.6 51.8 52 52.6 53.1 |
| `home-2` | 8.14 | 1.195 | 12 | 24 20 16 | both | num | yes | 36.9 |
| `home-3` | 8.14 | 1.195 | 12 | 24 20 16 | both | num | yes | 36.9 |
| `check-circle-4` | 8.09 | 1.075 | 10 | 24 20 16 | both | num | **no** | 46.5 52.1 52.2 52.4 52.7 52.8 53.1 |
| `checkbox-3` | 8.09 | 1.075 | 9 | 24 20 16 | both | num | yes | 52.7 52.8 53.1 |
| `check-circle-3-small` | 7.33 | 0.721 | 18 | 24 20 16 | both | num+size | **no** | 49.4 49.6 50.1 50.2 50.6 50.8 51.6 51.7 51.8 51.9 52.2 52.3 |
| `check-circle-3` | 7.31 | 0.905 | 18 | 24 20 16 | both | num | **no** | 49.4 49.6 50.2 50.5 50.9 51.6 51.7 51.8 51.9 52.2 52.3 |
| `chevron-down-3-large` | 7.24 | 1.471 | 12 | 24 20 16 | both | num+size | yes | 51.8 51.9 52.2 |
| `chevron-left-3-large` | 7.24 | 1.471 | 12 | 24 20 16 | both | num+size | yes | 37.8 38.1 38.2 |
| `chevron-right-3-large` | 7.24 | 1.471 | 12 | 24 20 16 | both | num+size | yes | 37.8 38.1 38.2 |
| `chevron-up-3-large` | 7.24 | 1.471 | 12 | 24 20 16 | both | num+size | yes | 51.8 51.9 52.2 |
| `chevron-down-3` | 7.22 | 1.117 | 12 | 24 20 16 | both | num | yes | 51.9 52 52.1 52.2 |
| `chevron-left-3` | 7.22 | 1.117 | 12 | 24 20 16 | both | num | yes | 37.8 37.9 38 38.1 |
| `chevron-right-3` | 7.22 | 1.117 | 12 | 24 20 16 | both | num | yes | 37.8 37.9 38 38.1 |
| `chevron-up-3` | 7.22 | 1.117 | 12 | 24 20 16 | both | num | yes | 51.9 52 52.1 52.2 |
| `check-3` | 7.19 | 1.662 | 12 | 24 20 16 | both | num | yes | 49.6 50.2 50.5 50.8 51.6 51.7 51.8 51.9 52.1 52.2 |
| `chevron-down-3-small` | 7.19 | 0.778 | 12 | 24 20 16 | both | num+size | yes | 51.4 51.5 51.7 52.2 |
| `chevron-left-3-small` | 7.19 | 0.778 | 12 | 24 20 16 | both | num+size | yes | 37.8 38.3 38.5 38.6 |
| `chevron-right-3-small` | 7.19 | 0.778 | 12 | 24 20 16 | both | num+size | yes | 37.8 38.3 38.5 38.6 |
| `chevron-up-3-small` | 7.19 | 0.778 | 12 | 24 20 16 | both | num+size | yes | 51.4 51.5 51.7 52.2 |
| `search-3` | 7.17 | 0.742 | 6 | 24 20 16 | filled | num | **no** | 37.8 39.6 39.7 50.3 50.4 52.2 |
| `check-3-small` | 6.9 | 1.308 | 12 | 24 20 16 | both | num+size | **no** | 49.9 50 50.5 50.9 51.4 51.5 51.7 51.8 51.9 |
| `checkbox-2` | 6.88 | 0.905 | 18 | 24 20 16 | both | num | yes | 49.4 49.6 50.2 51.6 51.7 51.8 51.9 |
| `alert-circle-2` | 6.7 | 0.5 | 12 | 24 20 16 | both | num | yes | 83.3 85.1 85.5 85.6 86.8 |
| `alert-circle-4` | 6.7 | 0.5 | 12 | 24 20 16 | both | num | **no** | 83.3 84.7 85.5 85.9 86.6 86.8 |
| `list-ordered` | 5.26 | 0.278 | 6 | 24 20 16 | both | bare | **no** | 39.7 42.9 |
| `plug-6` | 4.83 | 0.106 | 12 | 24 20 16 | both | num | yes | 40.2 40.4 40.7 49.3 49.6 49.8 |
| `trash-5` | 4.56 | 0.69 | 12 | 24 20 16 | both | num | **no** | 85.4 85.7 86 |
| `trash` | 4.29 | 0.9 | 12 | 24 20 16 | both | bare | yes | 85.7 85.8 86 |
| `wrench` | 3.57 | 0.188 | 12 | 24 20 16 | both | bare | yes | 1.1 2.3 3.5 3.6 86.4 86.5 87.7 88.9 |
| `wrench-2` | 3.57 | 0.188 | 12 | 24 20 16 | both | num | yes | 1.1 2.3 3.5 3.6 86.4 86.5 87.7 88.9 |
| `wrench-3` | 3.57 | 0.188 | 12 | 24 20 16 | both | num | **no** | 1.1 2.3 3.5 3.6 86.4 86.5 87.7 88.9 |
| `help-4` | 2.29 | 0.007 | 1 | 16 | filled | num | **no** | 47.3 |
| `check-circle-small` | 1.87 | 0.05 | 2 | 16 | outline | size | **no** | 45.8 46.9 |
| `checkbox-4` | 1.87 | 0.05 | 2 | 16 | outline | num | **no** | 45.8 46.9 |
| `help-3` | 1.87 | 0.037 | 1 | 16 | outline | num | yes | 43.1 |
| `check-circle` | 1.49 | 0.056 | 2 | 16 | outline | bare | **no** | 45.7 46.5 |
| `menu-arrow-left` | 1.38 | 0.052 | 2 | 16 | outline | bare | **no** | 43.6 |
| `menu-arrow-right` | 1.38 | 0.052 | 2 | 16 | outline | bare | **no** | 43.6 |
| `check-2-small` | 1.14 | 0.048 | 1 | 16 | outline | num+size | **no** | 46.1 |
| `puzzle-5` | 0.97 | 0.007 | 8 | 20 | both | num | yes | 44 46 |
| `check-small` | 0.89 | 0.049 | 1 | 16 | outline | size | **no** | 45.9 |
| `check-2` | 0.88 | 0.048 | 1 | 16 | outline | num | yes | 45.9 |
| `arrow-down` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 45.7 |
| `arrow-left` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 44.3 |
| `arrow-right` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 44.3 |
| `arrow-up` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 45.7 |
| `export` | 0.71 | 0.052 | 4 | 16 | both | bare | **no** | 45.7 |
| `login` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 44.3 |
| `login-2` | 0.71 | 0.052 | 2 | 16 | outline | num | **no** | 44.3 |
| `login-3` | 0.71 | 0.052 | 2 | 16 | outline | num | **no** | 44.3 |
| `login-4` | 0.71 | 0.052 | 2 | 16 | outline | num | **no** | 44.3 |
| `logout` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 44.3 |
| `logout-2` | 0.71 | 0.052 | 2 | 16 | outline | num | **no** | 44.3 |
| `logout-3` | 0.71 | 0.052 | 2 | 16 | outline | num | **no** | 44.3 |
| `logout-4` | 0.71 | 0.052 | 2 | 16 | outline | num | **no** | 44.3 |
| `sort` | 0.71 | 0.052 | 4 | 16 | outline | bare | **no** | 45.7 |
| `sort-2` | 0.71 | 0.052 | 4 | 16 | outline | num | **no** | 45.7 |
| `sort-ascending` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 45.7 |
| `sort-descending` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 45.7 |
| `upload` | 0.71 | 0.052 | 2 | 16 | outline | bare | yes | 45.7 |
| `upload-2` | 0.71 | 0.052 | 2 | 16 | outline | num | yes | 45.7 |
| `upload-3` | 0.71 | 0.052 | 2 | 16 | outline | num | yes | 45.7 |
| `chevron-down-small` | 0.65 | 0.052 | 2 | 16 | outline | size | yes | 45.7 |
| `chevron-left-small` | 0.65 | 0.052 | 2 | 16 | outline | size | yes | 44.3 |
| `chevron-right-small` | 0.65 | 0.052 | 2 | 16 | outline | size | yes | 44.3 |
| `chevron-up-small` | 0.65 | 0.052 | 2 | 16 | outline | size | yes | 45.7 |
| `chevrons-up-down` | 0.65 | 0.052 | 4 | 16 | outline | bare | yes | 45.7 |
| `chevrons-up-down-2` | 0.65 | 0.052 | 4 | 16 | outline | num | **no** | 45.7 |
| `check` | 0.62 | 0.05 | 1 | 16 | outline | bare | yes | 45.6 |
| `heart` | 0.55 | 0.099 | 6 | 24 20 | both | bare | yes | 44.5 45.6 |
| `sort-3` | 0.52 | 0.024 | 8 | 16 | both | num | yes | 45.5 |

## 7. Judged list

Three kinds, kept apart. **S** = systemic, **O** = one-off.

### (1) A drawing disagrees with a stated rule

| # | Finding | Tag | Verdict |
|---|---|---|---|
| A-1 | **A 20 / 70 degree convention runs through 7 concepts at all three masters** (`compass` x3, `cursor`, `cursor-3`, `cursor-click`, `send`), held to 0.08 degrees, built as a degree target with off-grid decimal endpoints. 152 segments. Not on §3's list of permitted angles. | **S** | **Decision, undeclared as a rule.** Six of the seven files declare 20 and 70 individually; nothing collects it. It is also the construction C30 explicitly rejects — and it carries the set's two largest ink drifts (`send` and `cursor-3` at 5.46 units). Either §3 admits 20/70 as a fourth pair, or these seven get a run-and-rise redraw. |
| A-2 | **`code`'s filled slash is at 75.53 / 73.74 / 75.96 against the outline's 73.14 / 72.26 / 73.18**, on a different run and rise (4x15.5 vs 5x16.5 at 24). Up to **2.79 degrees** apart at 16. | **O** | **Break, and on the one icon C30 was written for.** C30 declares the outline's run and rise and is silent on the filled twin, which draws a visibly different slash. The `-filled` file should declare its own, or match. |
| A-3 | **The classic `chevron-down` at 16: outline 45.496, filled 44.913 — 0.583 degrees apart**, where at 20 they are identical to 3 dp. C10/C12 say the filled bend grows to keep the leg angle. | **S** (the whole chevron family at 16) | **Break, from C7's conversion.** The outline's 16 leg was re-derived to hold the ink box; the filled twin kept the old angle. Same mechanism as the 12 left-behind filled corners at 16. Invisible (0.03 px over a 6-unit leg) but it is an unintended inconsistency, not a decision. |
| A-4 | **C12 says the flat chevron's filled legs sit "under 1 degree" flatter at 20 and 16; measured 1.96 at 16.** At 24 "~3" is right (2.813). | **O** (one sentence in C12) | **The rule's summary is wrong; the drawings and their own file comments are right** — `chevron-down-2-small` declares "2.8°" and measures 2.813. Fix the doc, not the drawing. |
| A-5 | **`trash-5-filled` at 20 tapers at 4.561 degrees** against C22's declared 4. Outline tapers measure 3.964-4.023 across all 12 and are exact. | **O** | **Small break, filled only.** 0.56 degrees over a wall; 0.14 px of drift. `trash-5` carries no degree declaration of its own. |
| A-6 | **`search`, `search-2`, `search-3` are off axis in the filled file only** (dev 10.19 / 14.44 / 7.17). The outline obeys; the filled does not. | **S** (3 concepts) | The two styles disagree about whether the drawing is legal. Belongs in the exceptions ledger either way. |
| A-7 | **`wrench` / `wrench-2` / `wrench-3` carry an undeclared 1.1-3.6 degree taper** at all three masters, the same kind of thing as `trash`'s licensed 4 degrees. The files declare only "45 deg". | **S** (3 concepts) | **Decision wearing no note.** Tiny in pixels (0.19 units) and almost certainly deliberate, but it is a third wall taper in the set with no C-row and no file declaration. |
| A-8 | **The `sort-alpha` family (6 concepts) and the `sort-numeric` family (6 concepts) are off axis by 21.09 and 15.04 degrees and declare nothing.** Four of the twelve are bare defaults. | **S** (12 concepts, 60 lint warnings) | These are the 60 warnings `plans/sort-family.md` calls "expected" with **no C-row in docs/07**. The letterforms need an angle decision the way `code` got one, or `plans/sort-family.md`'s note needs promoting to a rule. |
| A-9 | **`list-ordered` (a bare default) leans at 39.7-42.9 degrees and declares nothing**, though C19's dated note discusses the numeral's diagonal ("25-30 degrees, 40 at 24"). | **O** | The discussion is in docs/07 and not in the file; the file is where C30 says the justification lives. |
| A-10 | **`cursor-click` is the only member of the 20/70 family with no declaration**, and it carries 3.37 units of drift. | **O** | Add the note; it is a one-line fix and the sibling files show the form. |

### (2) A rule disagrees with another rule or the docs

| # | Finding | Tag |
|---|---|---|
| A-11 | **§3 permits 30 and 60 degrees; §3's own grid cannot produce either.** Zero segments in 2,910 drawings sit at exactly 30.000 or 60.000; the closest is 0.0014 off. 316 segments in 21 concepts sit within 0.5 of one of them, reached two different ways — the grid ratio 7:4 (29.74) in `gear` and `play-3`, off-grid decimals in `star`, `gear-3`, `wand-2`. The permitted-angle list and the grid rule are in the same section and contradict each other. | **S** |
| A-12 | **`docs/09-rule-audit.md:24`: "Every *default* obeys it; leaving it is what makes a numbered variant."** Measured: **46 bare defaults** leave 0/45/90 by more than 0.5 degrees and **29** by more than 2. And numbered variants are off axis 35.69% of the time against bare defaults' 31.90% — a four-point difference, not a distinction. | **S** |
| A-13 | **§3 has no category for the near-miss**, so 379 segments read as rule breaks when they are §3's own permitted exception 1 working correctly. All 379 are nearest 45, none has both endpoints on the grid, 252 of them miss by exactly 0.010, and the whole band displaces at most 0.064 px. The rule should name the case and set a tolerance. | **S** |
| A-14 | **C30 says a drawn character declares run and rise, not a degree figure — and then 183 concepts declare degree figures,** including `code` itself (which declares both). The set's working convention is "declare the degrees, and the run and rise where they are clean"; C30's stated form is the stricter half of that. | **S** |
| A-15 | **Lint does not check angles at all.** docs/01:201 and C30 both say so in terms (*"Lint does not check angles"*, *"this is held by the note and the eye"*). Every figure in this document was unenforced, and the three licensed exceptions are held by prose. | **S** |
| A-16 | **`italic` shipped with a 74.4-75.7 degree lean and 4.50 units of ink drift — the third-largest in the set — and C30 pre-authorised it as "its own decision on its own evidence" but no C-row records that decision.** The file declares "12.8° 14.4° 15° 20.6°". | **O** |

### (3) Fine by every rule and still worth the eye

| # | Finding | Tag |
|---|---|---|
| A-17 | **82.49% of straight segments sit exactly on 0/45/90, and of the 17.51% that do not, 2,464 segments (84%) are deliberate.** The set is far more disciplined on this axis than the docs claim. What it lacks is not discipline but a **vocabulary** — the actual list is 0/45/90, then 20/70, 15/75, 26.57 (1:2), 33.69 (3:2), 36.87 (3:4), 53.13 (4:3), 63.43 (2:1), 71.57 (3:1), 80.54 (6:1), plus the per-subject angles (`star` 72, `shield` 68, `watch` 8.5 off upright, `trash` 4, `code` 73). | **S** |
| A-18 | **Only 232 of 2,464 off-axis segments (9.4%) are on a small whole-number run:rise.** The other 2,232 aim at a degree and pay in off-grid endpoints. Whether that is acceptable is a decision about the grid, not about any one drawing. | **S** |
| A-19 | **`play`, `play-2`, `play-3` declare three different angle sets** (58.7-60.8 / 60.0-62.4 / 59.5-61.2) and `megaphone`, `-2`, `-3` two (18.4-71.6 / 26.6). Same object, different lean per variant — the angle twin of the corners audit's `play` tier finding. | **S** |
| A-20 | **`sparkle`, `-2`, `-3`, `-4` declare four different point half-angles** (26.79 / 28.5 / 27.29 / 23.06) and between them use eight distinct run:rise ratios. Four variants, four geometries, no stated relationship. | **S** |
| A-21 | **24 carries more ink drift than 16** (mean offset 0.172 vs 0.117 over all segments), because its units are larger — but **inside the legal band 16's drift is 1.95x 24's**. Both are true and they point opposite ways; whichever the eye cares about should be the one the register quotes. | **S** |

---

## 7a. What this card recommends

`docs/01-foundations.md` section 3 states the angle rule in four lines and `docs/09:24` judged it
"Rule sound ... every *default* obeys it". Measured, the rule describes about a third of what the
set does, and its own permitted-angle list contains two angles its grid cannot make.

**Recommendation, in one sentence each.**

1. **Name the near-miss and give it a tolerance.** 379 segments are an intended 45 whose endpoint
   came off an arc; all 379 are nearest 45, none has both endpoints on the grid, and the band
   displaces at most 0.064 px. Section 3's exception 1 already licenses it; saying so turns 379
   apparent breaks into zero.
2. **Record population B as C7's cost, where C10 already records the mechanism.** 149 segments,
   105 of them at 16, max drift 0.177 units; C10's stated "largest change 1.87 degrees on
   `check-circle-small`" reproduces exactly. One sentence in section 3 pointing at C10 closes it.
3. **Replace "30 and 60 are allowed" with something constructible.** Neither is reachable on a
   quarter or eighth grid — zero segments in 2,910 drawings hit either exactly — so the clause
   licenses an approximation and then the grid rule in the same section forbids it. The honest form
   is C30's: **a run and a rise on the grid, and whatever degree falls out.** 7:4 (29.74) and 3:4
   (53.13) are what the set actually uses.
4. **Decide 20 / 70.** Seven concepts, three masters, held to 0.08 degrees, and the two biggest ink
   drifts in the set. It is either a fourth permitted pair or a redraw; it should not stay an
   unrecorded convention that six files declare one at a time.
5. **Give the `sort-alpha` and `sort-numeric` letterforms a C-row**, the way `code` got C30. Twelve
   concepts, 60 "expected" lint warnings, nothing in docs/07. `italic` needs the same and C30
   already said it would be its own decision.
6. **Correct docs/09:24.** 46 bare defaults leave 0/45/90 by more than 0.5 degrees and 29 by more
   than 2; numbered variants are off axis 35.69% of the time against bare defaults' 31.90%. The
   sentence "leaving it is what makes a numbered variant" is not what the set does.
7. **Close `code`'s filled slash and the classic chevron's 16 leg** — the two places where the
   outline was re-derived and the filled twin kept the old angle. Both are small (2.79 degrees and
   0.58 degrees); both are unintended.
8. **Do not build an angle check into lint from this document alone.** The honest check is "every
   straight segment is on 0/45/90, or its file declares its run and rise" — and that needs
   recommendation 3 settled first, plus a note syntax the build can read. Card 3.5 owns severity.

## 8. What only Maruti's eye can settle, and where

| Question | Surface |
|---|---|
| **Does 20 / 70 become a permitted pair?** Seven concepts already use it and it is the set's biggest source of ink drift. | `compass` / `cursor` / `send` in one row at 24 · 20 · 16 and at real 16 px, against a 22.5-degree (grid-constructible) alternative. |
| **Do the `sort-alpha` and `sort-numeric` letterforms get their own C-row,** the way `code` did? Twelve concepts, 60 warnings, nothing recorded. | The twelve at 16 in the wall (card 4.1), beside `code` and `italic`. |
| **Is the classic chevron's 0.583-degree outline-to-filled difference at 16 worth closing?** It is 0.03 px. The same decision pattern as the 12 left-behind corners. | The chevron family, outline against filled, at real 16 px. |
| **Does `code`'s filled slash match its outline?** 2.79 degrees apart at 16 on the one icon with a written angle rule. | `code` and `code-2`, both styles, at 16. |
| **Should 30 and 60 stay on §3's list** given neither is constructible, and the set reaches them two different ways? | `gear` (7:4) beside `star` (off-grid decimal) at 24. |

---

## 9. Numbers this card could not measure

- **[needs measuring]** — the reference sets' angle discipline. The transfer test (point 2) needs
  their constraint to match ours before any of it enters the register; wave 2 owns it.
- **[needs measuring]** — whether any of the 34 silent off-axis concepts has a justification in a
  doc rather than in its file. The declared/silent split here reads the **24 outline file's own
  comment** only, because C30 says that is where a justification lives.
- **Not reproduced:** the wave-0 figure "the 16 master misses worst: mean 0.068 vs 24's 0.049
  degrees". The *ratio* holds (16's legal-band ink drift is 1.95x 24's) but the absolute degree
  figures do not appear at any band measured here; see 1.2 for the measured values.
- **Not reproduced:** the wave-0 figure "851 segments miss by 0.001-0.5 degrees". The near-miss
  band is **379**, and the arithmetic is forced: 17,091 total minus 14,099 exactly on axis minus
  2,613 beyond 0.5 leaves 379.
