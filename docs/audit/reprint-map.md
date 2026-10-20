# Reprint map — every wave-1 and wave-2 figure, and the command that prints it again

**What this is.** The audit's method says every figure must reprint from a committed tool (`plans/set-and-rules-audit.md`,
"How a card is run", step 6). The cards run from 2026-10-05 on did that; the earlier ones ran their censuses as scratch
scripts that vanish when the Mac restarts, so wave 5's reviewer could not check a number against the tool that produced
it (card 3.1, `docs/audit/judging-standard.md:145`). This repair card recovered those scripts' logic — from the session
scratch folders and, above all, from the transcripts of the agents that wrote each document — and folded it into one
probe per document. This file is the bridge: for each document written before 2026-10-05 (and card 1.9's grammar
document, whose census also ran in scratch), **section → command**; then every figure that **did not come back out the
same** (§4) and every figure that **could not be recovered** (§5).

**The documents themselves were not edited.** A figure that did not reproduce was never "fixed" by changing a number in
either place; it is listed in §4 with the document's value, the probe's value and the likely cause, for wave 5 to weigh.
Most are small: a hand count, a rounding, a list cut short when it was printed, a parameter the prose states differently
from the code that ran. A few change a sentence's meaning; they are marked in the summary below.

**The pin.** Every figure is at commit `5933041` (485 concepts, 2,910 drawings). Build it once, outside the repo:

```
P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
node tools/audit/<stem>-probe.mjs $P [section …]      # no section = every section, in the document's order
```

Each probe prints `## §<n> <title>` and then the figures as the document states them, so its output can be laid beside
the document line against line. Each is audit-only (imported by nothing in lint, build or the lab), reads the pin (and,
for the reference documents, `research/references/` through `--refs`, read-only), and writes nothing except an optional
`--cache <dir>` the user names. Each has a `node:test` file on synthetic fixtures. `<scratch>/card-reprint/…` paths below
are this card's working folder (comparators, extracted transcripts) and vanish with the session; transcript ids
(`agent-<id>`) refer to `~/.claude/projects/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/<session>/subagents/` and
last until Claude Code's retention clears them — the probes are what persists.

## 1. At a glance

| document | card · axes | command (`$P` = the pin) | figures that reprint | did not reproduce (§4 rows) | not reprintable (§5 rows) | full run | tests |
|---|---|---|---|---|---|---|---|
| `findings-primitives.md` | 1.1 · F4, F3 | `primitives-probe.mjs $P` (totals also `congruence.mjs`) | 1,994 of 2,046 | 21 | 0 | 4–6 s | 23 |
| `findings-corners.md` | 1.2 · F2 | `corners-probe.mjs $P` (totals also `radii.mjs`, run in `$P`) | 595 of 606 | 11 | 7 | 1–2 s | 20 |
| `findings-angles.md` | 1.3 · angles | `angles-probe.mjs $P` (summary also `angles.mjs`, run in `$P`) | 1,937 of 1,962 | 16 | 4 | under 1 s | 22 |
| `findings-scaling.md` | 1.4 · F6, F11 | `scaling-probe.mjs $P` (C8/C18 also `families.mjs $P sizes containers`) | 1,301 of 1,315, plus the 485-row appendix byte for byte | 13 | 5 | 1:20–2:50 | 24 |
| `findings-mass.md` | 1.5 · F1, F10 | `mass-probe.mjs $P` | 9,316 of 9,317 | 1 | 6 | 2:10–2:25 (`--cache`) | 25 |
| `findings-grid.md` | 1.6 · F7 | `grid-probe.mjs $P` | 12,039 of 12,041 | 2 | 9 | 2:16–4:27 | 17 |
| `findings-air.md` | 1.7 · F8, F9 | `air-probe.mjs $P` | 640 of 661 | 20 | 3 | 1:46–3:58 | 18 |
| `findings-filled.md` | 1.8 · F13 | `filled-probe.mjs $P` | 351 of 387 | 25 | 0 | about 4 min (`--cache`) | 23 |
| `findings-grammar.md` | 1.9 · F5, F3 | `grammar-probe.mjs $P` | 1,804 of 1,837 | 15 | 6 | about 3 s | 25 |
| `rule-register.md` | 1.14 | `register-probe.mjs $P` (the four registers' shared core) | 144 of 149 | 5 | 1 | 20–74 s | 38 |
| `enforcement-gap.md` | 1.15 | `enforcement-probe.mjs $P` | 77 of 79 | 2 | 1 | 20–72 s | 9 |
| `stale-statements.md` | 1.16 | `stale-probe.mjs $P` | 208 of 219 | 10 | 2 | 20–137 s | 13 |
| `severity-proposal.md` | 3.5 | `severity-probe.mjs $P` | 45 of 46 | 1 | 1 | 20–78 s | 6 |
| `references-fluent.md` | 2.1 | `fluent-probe.mjs $P` (every section twice: as `geometry.mjs` samples curves, and on true geometry) | 630 of 641 as the instrument samples; 539 of 641 on true geometry | 11 | 2 | 4–7 min | 29 |
| `references-sf.md` | 2.2 | `sf-probe.mjs $P` (raster sections from the card's saved records) | 1,280 of 1,337 | 7 | 5 | 15–60 s | 18 |
| `references-nucleo.md` | 2.3 | `nucleo-probe.mjs $P --cache <dir>` | 1,592 of 1,644 | 10 | 2 | about 1 h; 2 s cached | 34 |
| `references-untitled.md` | 2.4 | saved `untitled/figma/analysis/report.txt` + `untitled-probe.mjs $P` | 374 of 375 | 1 | 0 | about 1 s | 19 |
| `references-central.md` | 2.5 | saved `central/figma/analysis/report.txt` + `central-probe.mjs $P` | 505 of 505 | 0 | 0 | about 7 s | 11 |

All commands are `node tools/audit/<…>` from the repo root.

**The misses that change what a sentence says** (the rest are roundings, hand counts, lists cut short; all are in §4):
- *Punched cuts at 20 and 16.* "plus 4 clear pixels" and "the other three leave 8 to 28" (`rule-register.md` F8,
  `stale-statements.md` 3b.2) came from the known `raster.mjs` defect; bypassed, `plus-circle` leaves **0** fully clear
  pixels at 20 and 16 — `check-circle` is not the only cut that fills in.
- *Dropping the 16 master.* "1,940 drawings, all clean" (`enforcement-gap.md`, `severity-proposal.md`) runs **1,903 clean,
  37 warned**; no transcript shows the original run.
- *Scaling classes.* §10's 155 / 29 is **146 / 38** (the document's own appendix agrees with the probe); `keyboard-2`'s
  aspect drift is **4.2%**, not 19.0%; §1's "280 of 287 within 0.005" is a 1-point curve test — **269** are exact on lint's box (270 on exact geometry).
- *Shared parts.* "The check catches exactly the three checkbox pairs" (`findings-primitives.md` §8): read per part, as the
  sentence is worded, it flags **243 outline / 178 filled** concept pairs; read per pair, **209 / 139**. Either way far
  more than three.
- *The filled style.* The 16 corner offset is **97 corners on 41 concepts**, not 37 (a reconcile-list figure); shape-filled
  construction by the document's own definition is **1,011 files / 337 concepts**, not 330 / 110.
- *Selections standing in for censuses.* Card 1.9's 38 badge rows are its own selection — definitional — where its own
  search finds 113 names (19 strike · 21 enclosure · 73 other), and its "nine parts, 30 concepts" is **38** under one rule; card 1.2's "six concepts gain radii at 16" (**16**) and "nine flagged
  concepts" (the three statistics agree on 8 others).
- *Angles.* "20 / 70 held within 0.08°": **152 of 162** segments are; the farthest is 0.25°. "183 concepts declare a
  degree figure": **193**.
- *Air.* `book-2` "leaves no white pixel at all" — its ribbon has a pure-white pixel at all three masters; "48 ambiguous
  crossings" is **40**.
- *Fluent, and a measuring fault under it.* `tools/geometry.mjs` reads a curve by its control points, and Fluent is all
  curves. On the true shapes the filled box shrinks in **1.9–5.3%** of pairs (the document says 3–12%; the instrument
  reads 2.8–6.9%), and R3's "the same value in outline and filled" **holds in 10 of 10** of the document's pairs (4 of 10
  as the instrument reads them). 37 of the document's figures move on true geometry; §6 lists them.
- *Stale statements.* "`templates/` does not exist" — `templates/grid-24.svg` is in the pin.

Counts of "figures" are each builder's own comparator: numbers lifted from the document section by section (a table
cell counts once) and checked against the probe's output on the pin. They are not comparable across documents — the
grid and mass appendices hold one row per drawing — and they exclude figures the document cites from elsewhere,
judgements and eye questions. "Did not reproduce" and "not reprintable" count the rows of §4 and §5.

## 2. Documents from 2026-10-05 on — they already name their tools

| document | card | reprints from | where it says so |
|---|---|---|---|
| `exceptions-ledger.md` | 1.13 | `node tools/audit/notes.mjs --consistency` (+ `notes.test.mjs`) | `exceptions-ledger.md:53`, `:810` |
| `findings-metrics.md` | 1.12 | `node tools/audit/metrics-check.mjs <icons-dir> <metrics.json>`; `node tools/audit/metrics-probe.mjs $P [section]` | `findings-metrics.md:133` and its reprint table |
| `findings-optical.md` | 1.11 | `node tools/audit/optical-probe.mjs $P [section]` | `findings-optical.md:728` "How to reprint" |
| `findings-families.md` | 1.10 | `node tools/audit/families.mjs $P [section]` | `findings-families.md:689` §12 |
| `references-polaris.md` | 1.17 | `node tools/audit/polaris-scope.mjs …` | `references-polaris.md:600` §11 (the Fluent file's page list, §0.4, excepted) |
| `references-field.md` | 2.6 | `node tools/audit/field-sources.mjs` with `extract`, `check` or `normalise` | `references-field.md:9-12`; three thread figures do not reprint (`:90-97`) |
| `judging-standard.md`, `parameter-map.md` and the wave-4 pages | 3.1, 3.3, 4.x | cite the documents above; their own tools are `parameter-reach.mjs`, `primitives-data.mjs`, `exceptions-data.mjs`, `wall-data.mjs`, `register-check.mjs` (written 2026-10-08 by the wave-3 and wave-4 cards, not by this one) | each card's own document |

`findings-grammar.md` (card 1.9) is dated 2026-10-05 but had no committed tool; it is covered below.

## 3. Section → command, document by document

### `findings-primitives.md`

*Card 1.1, F4 / F3 — from its builder's map.*

Probe: `tools/audit/primitives-probe.mjs` · tests: `tools/audit/primitives-probe.test.mjs` (23 tests).
Revised after the fresh review (`<scratch>/card-reprint/review-ap/review.md`): exact totals; half-up decimal rounding (`hu`);
the document's number formats; §8 prints both readings of the persistence rule; tests pin the reviewer's and the
closing check's surviving breaks (`…/card-reprint-close/helpers/primitives-mass-grammar.md`).
Run: `node tools/audit/primitives-probe.mjs $P [section …]` with `$P` = the shared pin
(`<scratch>/card-reprint/pin`, `git archive 5933041`). Reads only `$P/src/icons`; no `research/references`.
Proof files in this folder: `probe-out.txt` (full run on the pin), `compare.mjs` + `compare-out.txt`
(comparator), `mutations.txt` + `mutate.py` + `mut/` (deliberate breaks), `commands-*.txt` / `results-*.txt`
(the two transcripts, extracted).

**Where the logic came from.** Every figure traces to author transcript `agent-a9d40aeeba4a88cdb`
("Shared shapes and the armature"); its scratch scripts are in the 2026-10-04 scratch root
(`load.mjs`, `parts.mjs` + one Edit adding the lens test, then one script per census). The probe folds
`load.mjs` + `parts.mjs` in as `loadSet` / `classifySub` / `allSubpaths`. Two cautions: the scratch
`chev.mjs` / `chev2.mjs` were **overwritten at 21:22** by another session (the card ended 20:22) — the
transcript holds the card's versions; and the sub-agent `agent-a98a966b08c03a9a7` and its `fam/` folder
never reached the document (the author's hand-back: "never reported; I measured §4 myself"), so nothing
here comes from `fam/`. `findprims.mjs`, `c*.mjs` and the rest of the flat root are other cards' (Nucleo,
corners, air…), checked by content.

**Committed CLI that already prints some figures** (verified equal on the pin; run with cwd `$P`):
- §1.1 per bucket: `node <repo>/tools/audit/congruence.mjs --master 24 --subpaths --filter '^(?!.*-filled)' --top 0`
  (and `--filter -filled`, and masters 20, 16) → 1,409 / 650 / 464 … 1,363 / 747 / 547, all six rows.
- §1.1 pooled: `… --master 24 --subpaths --top 0` → 2,828 / 1,254 / 877; 2,762 / 1,226 / 857; 2,715 / 1,234 / 857.
- §1.1 whole set: `… src/icons/*/*.svg --subpaths --top 0` → 8,305 / 3,472 / 2,496.
- §5 totals: add `--near 0.4166666666666667` (20) / `--near 0.3333333333333333` (16) → 361 · 237 · 287 · 207 · 308 · 186;
  default band, outline → wave 0's 361 · 378 · 545.

#### Sections

"Figures" = the numbers `compare.mjs` lifts from the section (a token count, after dropping code spans,
rule/section/card references and dates), minus the ones that are cited or not measurements (listed per
row). A table row is matched against one probe line, so a wrong cell in a right-looking row is caught; the
non-reproductions in (b) also include claims a token match cannot see (counts read as the wrong unit,
"worst" picked from one row).

| § | what the figures are | figures | command | original source (agent a9d40…, tool_use id) | status |
|---|---|---|---|---|---|
| head | concepts, files, paths, subpaths | 8 (+2 cited: lint 2,848 · 62) | `… $P s0` | t0.mjs `toolu_01G2k8Er…`, t1.mjs `toolu_01GM2Paa…` | reprints 8/8 |
| §0 | px@16 per unit, lens (6 subpaths, r 40.75, chord 12.73), circle radii 36/28/42 | 26 (+4 cited example from congruence.mjs header, +3 wave 0) | `… s0` | circles.mjs/t5.mjs `toolu_01MtZyco…`, parts.mjs Edit `toolu_01LF6Hrh…` | reprints 26/26 |
| §1.1 | classes per master×style, pooled, whole set, path level 3,595 / 3,905 / 3,400 / 195 | 54 | `… s1.1` + the CLI above | vocab.mjs `toolu_01Pe1nbN…`, t1b.mjs `toolu_0134NhQo…` | reprints 54/54 |
| §1.2 | 16 largest classes (900, 10.8%, sizes, 13–42 concepts) | 27 | `… s1.2` | vocab.mjs `toolu_01Pe1nbN…` | partly 25/27 — (b)1 |
| §1.3 | 162 shapes across masters, by masters/kind, 36 non-line rows, floor-bound and coincidence cases | 52 (+1 cited C8 step) | `… s1.3` | vocab.mjs, xm.mjs `toolu_0129x3T8…` | partly 51/52 — (b)2 |
| §1.4 | scale pairs 24→20, 24→16 (57/1,453, 74/1,416, 13 and 19 factors) | 35 | `… s1.4` | scalemode.mjs `toolu_015pwidQ…`, scalemode20.mjs `toolu_01GBv7N2…` | reprints 35/35 (also with the ring-direction workaround: identical) |
| §2.1 | ring per master×style, 21 comparisons, stem list, 3 outside concepts, canvas share | 91 (+2 cited: wave 0's 41, keyline ⌀14) | `… s2.1` | ring.mjs `toolu_01Xu5zUs…`, ring2.mjs `toolu_01KAiiRW…`, asm.mjs `toolu_01UnBc1R…`, grep `toolu_017Dpfqc…` | reprints 91/91 |
| §2.2 | rounded square classes, members, derived filled radius | 49 | `… s2.2` | square.mjs `toolu_01UHJCFL…`, `toolu_01PqmmzF…` | partly 44/49 — (b)3, (b)4 |
| §2.3 | dot census, ⌀ 24→20→16 table, glyph dot, cash, off-grid radii, radius vocabulary | 176 | `… s2.3` | dots.mjs `toolu_016YGmh7…`, dotfam.mjs `toolu_01KT2USc…`, ring.mjs, circles.mjs; the ⌀ table was hand-built from dots.mjs output | partly 161/176 — (b)5, (b)6, (b)7 |
| §2.4 | plus/minus spans, C8 step, 18 bar comparisons | 35 | `… s2.4` | verify.mjs `toolu_01V8UrCX…`, asm.mjs, marks.mjs `toolu_01WdEXn7…` | reprints 35/35 |
| §2.5 | x spans, step, x inside plus, slash pairs, ban-3 note, ban 9.249 | 66 (+1 prose 45°) | `… s2.5` | verify.mjs, asm.mjs, marks.mjs `toolu_011ouo9g…`, note `toolu_01JMC2sT…` | partly 65/66 — (b)8 |
| §2.6 | chevron classes, 27-row table, readings, chevrons-up-down | 254 (+3 cited: C10 1.25, CLAUDE.md 45°→45.5°) | `… s2.6` | chev.mjs `toolu_012t4ZvR…`, chev2.mjs `toolu_015ERtyR…`, pairs.mjs `toolu_01Abjj7V…`, vees.mjs `toolu_01DkqvF6…` | partly 252/254 — (b)9, (b)10 |
| §2.7 | arrowhead census (25 rows), 20/24f summaries, near-duplicate pairs, rotate-ccw | 188 | `… s2.7` | arrowhead.mjs `toolu_01Mr8BJo…`, rot.mjs `toolu_01Rr1r9d…` | partly 178/188 — all 188 reprint, but 10 "files" are head counts — (b)11 |
| §2.8 | the two-object name census | 1 (+1 cited docs/09 "22") + the name list | `… s2.8` | name grep in `toolu_01UHJCFL…` | reprints 1/1 (regex also lists volume-off; the doc reads it as a state) |
| §2.9 | bend radius table, 143/196, below-minimum, third case, 143/342, 429, maximize | 133 | `… s2.9` | bendr.mjs `toolu_01CFeyKi…`, weights.mjs `toolu_01EdGGFy…` | partly 131/133 — (b)12 |
| §2.10 | C17 gap ÷ thickness | 95 (+1 quoted "12") | `… s2.10` | glyph.mjs `toolu_01PqmmzF…` | reprints 95/95 |
| §3.1 | 21 of 21 | 3 | `… s3.1` | asm.mjs | reprints 3/3 |
| §3.2 | free vs ring spans and ratios, Δratio, check leg ratios | 68 | `… s3.2` | verify.mjs, checks.mjs `toolu_01J5HjEE…`, asm.mjs | partly 67/68 — (b)14 |
| §3.3 | checkbox vs check-circle pairs, d strings, widths | 32 | `… s3.3` | asm.mjs, `toolu_01JMC2sT…` | reprints 32/32 (one non-numeric claim partly true, (b)15, not counted) |
| §3.4 | identical-outline groups, 22/9/13, 17, 12 files, 8 filled = outline | 13 (+3 quote/master/ s2.1's 2.5) | `… s3.4` | dupes.mjs `toolu_011gfmQT…` | partly 12/13 — (b)16 |
| §4.1 | folder bodies, identity, tabs, off-grid tabs | 43 | `… s4.1` | folder.mjs `toolu_01WBaM9p…` | reprints 43/43 (as centreline boxes; the column's "outer ink" label is (b)17, not counted) |
| §4.2 | page family classes, two pages, back sheet, clipboard pairs | 66 | `… s4.2` | objects.mjs `toolu_015u8BMj…`, clip.mjs `toolu_01GRyTwq…` | reprints 66/66 (20 printed too; the doc's "at every master" holds) |
| §4.3 | head ink diameters, shared heads, near misses | 76 | `… s4.3` | clip.mjs, objects.mjs | partly 75/76 — (b)18 |
| §4.4 | arrow classes, parts, doors, near misses | 61 (+1 card ref) | `… s4.4` | objects.mjs | reprints 61/61 |
| §5 | band-held near misses, fixed band, radius vocabulary 42 of 56 / 36 of 40, drift lists | 173 | `… s5` + CLI | nm2.mjs `toolu_0157MmJx…`, vocab.mjs, circles.mjs | partly 172/173 — (b)19 |
| §6 | judged list (restates §1–§5) | 146 | `… s6` + the sections it cites | — | partly 139/146 — (b)20 and the restated (b)4, 7, 8, 14, 16, 21 |
| §7 | eye questions' figures | 18 | `… s7` | — | partly 17/18 — (b)21 |
| §8 | handover restated; linter check counts | 57 (+2 cited: card 1.2's 217, 45.5°) | `… s8` | check2.mjs `toolu_01P59nPW…`, nm2.mjs; "exactly the three" had no code | partly 55/57 — (b)7, (b)23 |

**Exact totals (the sums of the table above): 2,046 figures · 1,994 reprint · 52 do not.** Two
non-numeric statements in (b) — §3.3's endpoint claim (15) and §4.1's column label (17) — are listed but not
counted. Restated figures in §6–§8 are counted again where they are restated. Cross-checks: `compare.mjs`
(token level, coarse) matches 2,023 of 2,071 tokens, the remainder being cited/prose tokens; the reviewer's
cell comparator (`review-ap/r2/cmp-prims.mjs`) now finds 733 table cells exact, 0 format-only differences,
and 10 "differ" that are its own anchoring (it reads §2.4's and §4.2's tables for §3.3 and §4.4; a direct
diff shows those rows identical).

---

### `findings-corners.md`

*Card 1.2, axis F2 corners and radii — from its builder's map.*

Probe: `tools/audit/corners-probe.mjs` (+ `tools/audit/corners-probe.test.mjs`). Pin `$P` = `<scratch>/card-reprint/pin`.
Every section: `node tools/audit/corners-probe.mjs $P <section>`; no section = all.
Comparator: `<scratch>/card-reprint/corners/compare.mjs <doc> <probe output>` → `compare-out.txt` (595 / 606 measured figures match; 11 do not; 9 not reprintable — after the fresh reviewer's corrections of 2026-10-08).

Original sources: **A** = author transcript `agent-a88cac81f3530bb21` (2026-10-04); **R** = its reviewer `agent-aaeba6425e82dbb49`. Tool-use ids below are in those transcripts (extracted to `commands-<id>.txt` / `results-<id>.txt` here). The scratch dumps `corners.ndjson` / `corners2.ndjson` were `radiiOf()` over `listIcons()` with radius at 4 dp, part box / vertex at 3 dp, tangent error at 2 dp — the probe rounds the same way before counting.

**Already-committed command.** `(cd $P && node "$REPO/tools/audit/radii.mjs")` prints, verified on the pin: 2,910 drawings · 10,965 corners · kinds `{arc 9236, sharp 1729}` · styles `{area 5512, stroke 5453}` · `ambiguous (582)` · 357 fillets > 1° off tangent · **1,094 mark bends · 0 under · 681 on** · 913 other-role corners under bendMin `{area 911, stroke 2}` · 46 reflex + 10 names. It prints histograms only; every share, per-concept table and literal figure needs the probe (as card 3.1's reviewer also noted). The probe reprints all of the above too.

#### Sections

| § | what the figures are | measured | command | original source | status |
|---|---|---|---|---|---|
| header (§0) | corner totals, fillet/sharp, stroke/area, ambiguous 582 (5.3%) | 6 | `… $P s0` (also `radii.mjs`) | A c1.mjs `toolu_015dvfVE9hA4y9qd98LdsByE` | reprints 6/6 |
| 1.1 | tier table 617/581/563, tier counts and shares, on-tier, distinct; 1,761; **reconcile share 61.8 · 61.4 · 58.6%** (tier-1 / outline stroked container fillets, snapped within 0.02) | 30 | `… $P s1.1` | A c2.mjs `toolu_01KJ5RtYMbJ2ZK4c7AssFp6h` | partly 28/30 |
| 1.2 | commonest fourteen radii per master | 44 | `… $P s1.2` | A c1.mjs `toolu_015dvfVE9hA4y9qd98LdsByE` | reprints 44/44 (container role — see (b) note) |
| 1.3 | typed-literal table; 0 Bezier; 32/30/30 elliptical; 8,547 literal corners, 7.8e-16; 117 (Λ) / 165 (chord) arcs; `link`, `attachment-3`; the 31 concepts; 7 zero-length arcs | 36 | `… $P s1.3` | A c16.mjs `toolu_01YU15SrixVFf9iWxv8DtdFr`, chord check `toolu_01S4PKuBzhbbcFhe4JjeSbx7`; R `toolu_019B8fLnQDiEJXgmFegUKK2N` (8,547 / 7.8e-16), `toolu_01Wr7U8TGWTCEVrNNce9udyP` + `toolu_01MJVqv4aAwLyrRVSJeYgkji` (Λ 117, 7 degenerate) | reprints 36/36 |
| 2 | canvas share, stroke multiple, −10% / −28%, counterfactuals 2.083 / 1.667 / 2.5 / 2.083 | 14 | `… $P s2` | A c4.mjs `toolu_01J3X4anMvNGVkPveph24dkR` | reprints 14/14 (+1 cited) |
| 3 | comment census at 24 (52 / 26 / 5 / 2; 50 of 51; detail 1.5 · 1.25 · 1) | 6 | `… $P s3` | A greps `toolu_0149THJdCWGrGk8wVEBoGvHZ`, `toolu_01LsdPDUsp49zki79viy5SNU`, `toolu_01Wijf82DJdxcsWSZygGvaJV` | partly 5/6 |
| 3.1 | tier × role mix × part-size quartiles, 9 rows; 77% | 64 | `… $P s3.1` | A c3.mjs `toolu_01Bd9nHUZngerns5gSzFExYN` | reprints 64/64 |
| 3.2 | 167 concepts; signature table with names; 89 / 78 (53.3 / 46.7%) | 15 | `… $P s3.2` | A c3.mjs (same id), c17.mjs `toolu_019rfmsVCyGxJ6wbrTpaDbhR` | partly 15/16 (`watch`) |
| 3.3 | 1,729 / 981 / 748 / 628 / 62; 124 in 21; per-concept table | 8 | `… $P s3.3` | A c12.mjs `toolu_01Nf72DA9neoKahzYvDuCW77` | reprints 8/8 |
| 4 | off-tier 38 / 36 / 37 and per-concept values; §4.1 body curves and counts; §4.2 values; thumbs-up share; outside-container values | 46 | `… $P s4` | A c2.mjs (as §1.1), c17.mjs | partly 43/46 (+2 not reprintable) |
| 5 | 363 / 286 (78.8%) / 74 / 3; the named rows; `rotate-ccw-9`'s `A1 1`; "six gain" (s5 now computes the population: 16) | 18 | `… $P s5` | A c17.mjs `toolu_019rfmsVCyGxJ6wbrTpaDbhR`, grep `toolu_01WByRqFEWp8XM7QTgjMt6Qm` | partly 17/18 (+2 not reprintable) |
| 6 | 12 of 1,107; 0 nested; 146 pairs / 37 concepts; table; 15 values 0–6; 71% / 46% | 11 | `… $P s6` | A c11.mjs `toolu_01VKZpQSYwPQJjnbV3GkZFkJ` | reprints 11/11 |
| 7 | the four pairings (374/409, 376/409, 1,749/2,145 · 396 · 147, 46); 550; 1,396 easings; 129 | 10 | `… $P s7` | A c6 `toolu_01BM8tdX7QwJA6BrBrbcPnsp`, c15 `toolu_01BtJrq5DDx7596EfgMkaLZR`, litpair `toolu_0192rtjJa4NbiJSbzDUHqaiQ`, c7 `toolu_016PF77nkBHJL7QyWwrrtptK`, c9 `toolu_01NTPg78BjUWqFtRhzBXyfWx`, c16, grep `toolu_01T2CrT54wYCPtn3AcThsJ1V` | reprints 10/10 |
| 7.1 | 129 / 27 / 12 named / 15 named | 4 | `… $P s7.1` | A grep `toolu_01T2CrT54wYCPtn3AcThsJ1V`, c16; R `toolu_017fLKBDfXeCvwYvvbQjBm3J`, `toolu_01SLK8SLv9u28u24HEGzsr65` | reprints 4/4 (+1 cited) |
| 7.2 | typed literals of the nine concepts, outline vs filled, 3 masters; s7.2 also prints what each statistic flags (18 / 20 / 147) and all three together (8) | 12 | `… $P s7.2` | A greps `toolu_014BzfKcfGcp7Gt4CEP6zuQ7`, `toolu_016KYnymTypmmNtvvv9sWLRr`, `toolu_01BfKi4mCo47TpvGrkrtHnfp` | reprints 12/12 (+1 not reprintable: the nine are a hand selection) |
| 7.3 | 15 files / 5 concepts; `radii.mjs` reads them as 0.75 | 2 | `… $P s7.3` | A `toolu_014JEhi8jfbkmYCy3fGDJWp2`, c7 | reprints 2/2 |
| 8.1 | 649 / 9,236 (7.0%), 211/218/220, 435/214, 50, 323; +8%; 0.6185; 32 in 6; 0.124; 0.37–0.50; 913 {911, 2} | 11 | `… $P s8.1` | A c12.mjs; `radii.mjs` `toolu_01PXzSzXmxpD4gFpUwAX57Ys` | reprints 11/11 |
| 8.2 | 1,094 · 0 · 681 | 1 | `… $P s8.2` **and** `radii.mjs` | A `toolu_01PXzSzXmxpD4gFpUwAX57Ys` | reprints 1/1 |
| 8.3 | 357 / 57 / camera-5 180; 158 / 37 / 5.611 on r3.749; 46 / 10; 582; paintbrush list | 6 | `… $P s8.3` | A c12.mjs; `radii.mjs` | partly 5/6 |
| 9.1 | 16 families and each split | 17 | `… $P s9.1` | A c14.mjs `toolu_01PJQeQnCAvKKDuQQVFkF9T8` | reprints 17/17 |
| 9.2 | 31 size variants (7 check, 24 chevron), all r0.75 | 3 | `… $P s9.2` | A c14.mjs | reprints 3/3 |
| 10 | pixel table (eats, depth, run left, r/stroke) and tier-step table; 0.875 / 0.36; 27.8% | 44 | `… $P s10` | A c17.mjs | reprints 44/44 |
| 10a | 170-row roll-up, byte-identical rows; 3 excluded names | 172 | `… $P s10a` | A c18.mjs `toolu_01CWuK96rGLpsE3QXauKFn5Z`, `toolu_013F5S5YPGHhhAYk72A5yZcF` | reprints 172/172 |
| 11 / 11a | restated figures checked where printed; `rotate-ccw-9` 4.25; 157 distinct rx | 21 + 4 | `… $P s11` (+ the sections cited) | A grep `toolu_01WByRqFEWp8XM7QTgjMt6Qm`, c16 | partly 19/21; 4/4 (+2 not reprintable) |
| 12, 13 | eye questions, needs-measuring items | 0 | — | — | nothing to reprint |

---

### `findings-angles.md`

*Card 1.3, 718 lines — from its builder's map.*

Probe: `tools/audit/angles-probe.mjs` (+ `tools/audit/angles-probe.test.mjs`). `$P` = the shared pin
(`git archive 5933041`). Every command below is `node tools/audit/angles-probe.mjs $P <section>`, run from the repo.
Comparator: `<scratch>/card-reprint/angles/compare.mjs $P` lifts the document's figures and checks each against the probe:
**1,937 of 1,962 figures reproduce** (632 of 657 outside §6a's 163-row table, which reproduces cell for cell).
Revised after the fresh reviewer (review-ap/r2/review.md): A-1's 152 and §5.2 / A-6's "three" moved to (b); §5.2 now
finds the filled-only concepts set-wide; §2, §2.3, §1.2, §3.3 and §6.2 now print in the document's rounding, so
those sections match character for character, not just in value.

Already-committed command: `(cd $P && node "<repo>/tools/audit/angles.mjs")` prints 2,910 drawings · 17,091 segments ·
2,613 segments beyond 0.5° in 163 concepts — verified against the pin, and the probe prints the same three figures.
It must be run from the pin's root (its `listIcons()` reads `src/icons` relative to the working directory; the
document's "Reproduce" line, run from the repo root, reads the live tree). Its histogram lumps "== 0" into "<=0.01°"
(14,136 = 14,099 + 37), so §1.1's split needs the probe.

#### Sections

The original logic came from three places: the table-builder sub-agent's `angtab-build.mjs` + `angtab-fullprec.mjs` +
`dump-angles.mjs` (old scratch, flat root; transcript `agent-a99359c0c388ce159`), and the author's own scripts
`q.mjs` + `a2`–`a6.mjs` (still in the old scratch root, written by heredoc — transcript `agent-a88cac81f3530bb21`,
tool_use ids below) and inline greps. The `an*.mjs` files beside them belong to the Fluent card, not this one.

| § | what the figures are | measured figures | command | original source | status |
|---|---|---|---|---|---|
| header | segments read, verification table, coverage gap, dropped short segments | 30 | `head` | dump-angles.mjs; angtab-fullprec.mjs; angtab-build.mjs header, T7g, T8a; a2.mjs (toolu_019qRwDZ8ZkhaL7jXXUQmKyF); python second parser toolu_01GmfjLkuHm115WB1pWXvVPc (not ported — a second implementation) | reprints 30/30 |
| §1 | totals table | 16 | `s1` | angtab-build.mjs T1a | reprints 16/16 |
| §1.1 | deviation histogram | 36 | `s1` | angtab-build.mjs T1b | reprints 36/36 |
| §1.2 | per-master means; legal-band means and the 1.95x | 23 | `s1` | angtab-build.mjs T1d; a5.mjs (toolu_01HWtbSm4uJ772dyioN9io2B) | reprints 23/23 (1.95x is the ratio of the 5 dp means; unrounded it is 1.92x — the probe prints both) |
| §2 | the three populations | 17 | `s2` | a2.mjs (toolu_019qRwDZ8ZkhaL7jXXUQmKyF) | reprints 17/17 |
| §2.1 | population A tests | 12 | `s2` | a2.mjs; angtab-build.mjs T9a, T9g, T9h, T2d | reprints 12/12 |
| §2.2 | population B: 105/91, the 54 concepts, per-concept max dev, 0.177 | 14 | `s2` | a2.mjs | reprints 14/14 |
| §2.3 | by name kind; the 29 | 29 | `s2` | angtab-build.mjs T5a; a4.mjs (toolu_01KUGQ2nAsyrf6U4q5QL9j4H) | reprints 29/29 |
| §3.1 | recurring off-axis angles | 32 | `s3.1` | a3.mjs (toolu_01UVcC2fU5NYebNbSDqfBS9P) | partly 31/32 |
| §3.2 | on-grid shares; 232 ratios; ratio table | 40 | `s3.2` | a2.mjs; a3.mjs | reprints 40/40 |
| §3.3 | 20/70 table, run x rise, 15/75, 8.5 off upright | 83 | `s3.3` | a3.mjs; a6.mjs; greps toolu_011BuXLRyCGPxCRB8zFktScD, toolu_013KiN4C3Xu59Fc5KsauLtZr | partly 74/83 |
| §3.4 | 30 and 60 | 15 | `s3.4` (7:4 row in `s3.2`) | a2.mjs; angtab-build.mjs T6 | partly 14/15 |
| §4 | trash taper, code slash | 34 | `s4` | angtab-build.mjs T8a–T8c; python second parser toolu_01NhTWhMumAhmisFTppMmAqf | reprints 34/34 |
| §5 | outline against filled, 1,407 pairs | 15 | `s5` | angtab-build.mjs T7a, T7b, T7c-cap | reprints 15/15 |
| §5.1 | chevron family | 46 | `s5.1` (`--full` for all 120 rows) | angtab-build.mjs T7g | reprints 46/46 |
| §5.2 | filled-only concepts (found set-wide), search read from source | 11 | `s5.2` | a6.mjs; python toolu_014KWUutqULtuWJg2HaTV1kQ; search toolu_01968hxtVMaZYuQUUxtsszHt | partly 10/11 |
| §6 | 90/34; 193 of 485; the three spellings; per-file counts | 12 | `s6` | a4.mjs; greps toolu_01HyehyHEkkgiWSG1sFoXt1r, toolu_013KiN4C3Xu59Fc5KsauLtZr | partly 11/12 |
| §6.1 | 34 silent concepts | 70 | `s6.1` | a4.mjs | partly 67/70 |
| §6.2 | 29 bare defaults by drift | 88 | `s6.2` | a4.mjs | reprints 88/88 (2 dp, half up from a4's 3 dp, as the document rounded) |
| §6a | 163-concept roll-up | 1,305 (163 rows x 8 cells + the count) | `s6a` | a6.mjs (toolu_01RkeEfSJSkTYV5jp72L2xy8) | reprints 1,305/1,305, rows in the same order |
| §7 | figures new in the judged list | 33 | `s7` (repeats of earlier sections: those sections) | mixed; several had no code (see c) | partly 24/33 |
| §7a, §8 | restate figures from §2–§5 | 0 new | — | — | covered by the sections they cite |
| §9 | 851 and 0.068/0.049 do not reproduce | 1 | `s9` | a3.mjs (on-axis reconciliation), a5.mjs | reprints (379, and no band gives 0.068 / 0.049) |

Grep counts were emulated line by line in JS and checked against BSD `grep` on the pin: 193 · 131 · 53 · 11 · 183,
and 9 distinct "°" figures in `users-4-wide` — all equal.

---

### `findings-scaling.md`

*Card 1.4, F6 across sizes; F11 detail census in §6 — from its builder's map.*

Probe: `tools/audit/scaling-probe.mjs` (new) · tests: `tools/audit/scaling-probe.test.mjs` (new, 24 tests).
Command: `node tools/audit/scaling-probe.mjs $P [section …]` with `$P` = the shared pin (`git archive 5933041` + its
own build). No reference data is read, so there is no `--refs`.

Original author: transcript `agent-aefb405581d210846` (session 07852967…, "Scaling 24 to 16"). Its scripts are in the
flat scratch root `/private/tmp/claude-501/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/07852967-7543-4b42-af82-b9afcfb57d4e/scratchpad/`
(written 19:48–19:59 on 2026-10-04): `core.mjs` (per-drawing pass → `s14_core.json`), `massrun.mjs` (ink area →
`s14_mass.json`), `scalepairs.mjs` (scale fits → `s14_scalepairs.json`), `s14_an1.mjs` … `s14_an7.mjs`, `s14_table.mjs`
(the appendix). The on-disk copies equal the transcript's `Write` calls (core.mjs differs only by an import rewrite,
tool_use `toolu_01A4TNPTnzXs2MMkc4dJ1k5U`). `load.mjs`, `t0–t5.mjs`, `circles.mjs`, `ring*.mjs`, `parts.mjs`, `marks.mjs`,
`scalemode*.mjs` in the same folder are **card 1.1's**, not this card's (checked by content; none is called by this
transcript). The author read the live `src/icons` at 19:48; `git log 5933041..HEAD -- src/icons` is empty and the
appendix reprints byte for byte from the pin, so the pin is what was measured.

Comparator: `<scratch>/card-reprint/scaling/compare.py <doc> <probe output>` lifts every number of each document section and
looks for it in the probe's output for that section (to the document's own decimals); `app-doc.txt` / `run-all.txt`
diff the appendix row for row. Unmatched tokens were then classified by hand, and every section was also read line
against line (that is where the claim-level mismatches in (b) come from — a wrong figure can still "match" a token
that appears elsewhere).

#### Sections

| § | what the figures are | measured figures (number tokens) | command | original source | status |
|---|---|---|---|---|---|
| header | 485 concepts × 3 × 2 = 2,910; lint 2,910 · 2,848 · 62 · 0; the rate and tolerance used | 14 tokens (1 card number, 2 parameters) | `… $P s0` for the census and parameters; the lint line by `cd $P && node tools/lint.mjs` (the gate) | `core.mjs` (toolu_01KPvSAysdE8AvjVJypyEmPJ); lint run toolu_01PC9VNjdHY2UhwQrLdi9gpf | reprints 11/11 measured; the lint line by the lint command |
| §1 | the two headline tables (held / gives) | 74 | `… $P s1` | compiled from the sections below | partly: 74/74 tokens, 2 claims in (b) (L21) |
| §2 | margin and keyline table vs proportion, two curves, 280/287 + the 7, square:circle, 123/78, trajectory shapes, régime medians | 148 | `… $P s2` | transcript toolu_01NSUsrnMsspPzCWz45YGnAv (keyline table), toolu_01LFuztjaEmmW1rVjGfvV2dK (own curve, by keyline); `s14_an6.mjs` T/U | reprints 148/148 |
| §3 | scale-fit table, 57,126 coordinates / 33.5% / 47.1%, ink-box medians, the 16 exact matches, fitted factors, reconnaissance correction | 108 (2 are a label and a spec constant) | `… $P s3` | `scalepairs.mjs`, `s14_an5.mjs` R; toolu_019oKz3joWatDzA1hTYT2n8q, toolu_01G1hsYP4AytWAM7teYbmSoH (factors), toolu_015cC3CvGszobUXAwueAsZos (grid); `s14_an1.mjs` C; `s14_an6.mjs` X | partly: 105/106, plus 2 claims in (b) (L137, L146-147) |
| §4 | 121 true containers, lint's 319 and users-3-level, docs/08's six, drift bands, mean/median, monotonic counts, inset table, policies, plus-circle arithmetic | 114 | `… $P s4` | `s14_an2.mjs` H (319), `s14_an3.mjs` H2, `s14_an4.mjs` K | reprints 114/114 (check-circle's 0.488 needs half-up rounding of 0.4875, done by `half3`) |
| §5 | 136 marks, medians, plus/x shares and sizes, 102 of 120 steps, the eight contrary marks, play 75 % × 72 % | 74 | `… $P s5`; the C8 / C18 half also, on the solved box and in its own terms, by `node tools/audit/families.mjs $P sizes containers` (it does not print "102 of 120") | `s14_an6.mjs` U, `s14_an5.mjs` S, toolu_016V5JLUXduLdVdQZhBtUU6n (falling marks), toolu_018dYvouRmysk7M28Xop7u34 (play file) | reprints 74/74 (play's comment is cited from its file; the probe prints it) |
| §6 | **F11 detail census** (453 / 30 / 2, the 30 shedders per master, set totals 1,409 → 1,375 → 1,352 and 6,874 → 6,752 → 6,713, medians, maxima, filled 1,419 → 1,387 → 1,363 and 33) and darkness (medians, means, ratios, stroke decomposition) | 161 | `… $P s6` | `s14_an1.mjs` E/F, `s14_an5.mjs` O, `massrun.mjs` | reprints 161/161 (filled median row exposed to the raster defect — see below) |
| §7 | radii by role, 150 / 89 of 89, median ratios, three tier triples | 101 | `… $P s7` | `s14_an2.mjs` I, `s14_an4.mjs` M | reprints 101/101 |
| §8 | on-grid segments and 45° legs per style and master, the tax, beyond-0.5° counts, biggest growths | 77 (2 are "0/45/90" labels, 1 cited) | `… $P s8` | `s14_an4.mjs` L, `s14_an3.mjs` J | reprints 74/74 measured; 1.87° is cited from `plans/stroke-16.md` |
| §9 | 481 of 485, the four that differ | 65 | `… $P s9` | `s14_table.mjs` (divergence list) | reprints 65/65 |
| §10 | classes, raw tally, régime stability, 28 keyline changes, family spreads (113, 79, 81, 27, 5, 17) and the worst six, `box:` drift (56, 7, 5.0%, nine) | 200 | `… $P s10` | `s14_an6.mjs` V/W, `s14_an1.mjs` G, `s14_an7.mjs` Y, `s14_an5.mjs` P, toolu_016V5JLUXduLdVdQZhBtUU6n | partly: 197/200 tokens, 6 claims in (b) (L383, L384, L388, L390, L397, L405-414) |
| §11 | the judged list's own figures (S1–S5, D1–D2, E1–E4) | 145 (1 card number) | `… $P s11` | restated from §2–§10 | partly: 144/144 tokens, 5 claims in (b) (L459, L489, L495-496, L507, L523) |
| §12 | the figures the eye questions restate | 34 | `… $P s12` | restated | reprints 34/34 |
| Appendix | 485 rows × 16 columns | 485 rows | `… $P appendix` | `s14_table.mjs` (+ `core.mjs`, `massrun.mjs`) | **reprints 485/485 rows byte-identical** |

Token totals outside the appendix: 1,301 of 1,315 matched by the comparator. The 14 unmatched: 2 card numbers (1.4,
1.16); 2 lint figures (2,848, 62 — reprinted by the lint command); 4 labels or spec constants ("Wave 0", "0/45/90",
the 1.25 stroke); 1 cited figure (1.87°); 1 rounding artefact ("6%" against the probe's −5.9%, which it is); and 4
that do not reproduce (0.878, 155, 29, "19–22"), all in (b).

---

### `findings-mass.md`

*Card 1.5, F1 apparent weight + F10 — from its builder's map.*

Probe: `tools/audit/mass-probe.mjs` · tests: `tools/audit/mass-probe.test.mjs` (25 tests, ~2 s).
`$P` = the shared pin (`git archive 5933041` + its build). `$W` = the 2026-10-04 scratch folder
`/private/tmp/claude-501/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/07852967-7543-4b42-af82-b9afcfb57d4e/scratchpad/w1-mass-grid/`.
Author transcript `agent-a671e99332a47d0c4` ("Darkness and crispness"); tool_use ids below are from it.

Proof: `node tools/audit/mass-probe.mjs $P > probe-final.md`, then `node compare.mjs docs/audit/findings-mass.md probe-final.md`
(both in this folder). Every table cell and every prose figure was lifted from the document by line and checked against
the probe line that prints it, at the document's own precision. **9,316 of 9,317 reprint** (after the reviewer's corrections, 2026-10-08: L55's md5 and L364's lens width moved from (c) to reprinting; nothing else in the output changed). Appendix A (485 rows) and
appendix B (97 rows) reprint byte-identical. A run on a `--cache` directory gives byte-identical output to a fresh run.

#### Sections

| § | what the figures are | measured figures | command | original source | status |
|---|---|---:|---|---|---|
| head + method (L3–11) | drawing count; rate 64 vs 32 (mean · max); 270 changed; the Chromium sample's make-up; `help` 24 at 16 | 9 | `node tools/audit/mass-probe.mjs $P intro` | `$W/bf_compare.mjs`, `bf_shard.mjs`, `mk_cmp2.mjs`; `an10` (toolu_01M1FhrkWMZDHrYMphu7rRS2) | reprints 9/9 |
| §0 short version | 16-row range and spread, pooled, squint vs ink, marks/objects, variance split, correlations, Dense 17/15, Lucide 0.83–1.16 / 0.92 / 0.92, crowded list, 12–24%, drift, filled bands, bug scope | 39 | `… $P s0` | `$W/gen_mass_tables.mjs`, `facts_mass.mjs`, `an28.mjs`, `bug_scope.mjs` | reprints 39/39 |
| §1 definitions | bypass = classify on 1,884 stroke-only files; bbox vs inkBox 0.022 (30-drawing sample); `minus` packing 98%; Lucide 188 of 189, Bézier count; the reproduced wave-0 list; `help` 51.39 / 64.51 | 22 | `… $P s1` | `$W/conv.mjs` (toolu_019rC2V7LTCUsKBw29NewEbF), `an1.mjs`, `lucide.mjs`, Bézier count toolu_01WHjjTP6cnRvTnfMBPBed7f, `wave0_check.mjs` | partly 21/22 |
| §1.1 the bug | `raster.mjs` md5 `cf73aa36…` (L55); the six closed-form cases (classify vs bypass); the scope table; trigger 394/270/124/0; 99·78·93; 579 px in 96 of 342, 0.500; 7–10 px²; 9 of 122; squint 69/0.062, 3×3 5/0.049, half-tone 296; the wave-0 stated-vs-measured table; 75.37 → 75.17, 110 → 108 | 53 | `… $P s1.1` | `$W/bug_repro.mjs`, `bf_compare.mjs`, `bug_scope.mjs`, `apply_bf.mjs`, `wave0_check.mjs`, `mk_cmp3.mjs`, `mk_cmp4.mjs`; md5 = `git show 6293f80:tools/audit/raster.mjs \| md5` (the working copy is identical) | reprints 53/53 |
| §1.1 "Stable to the sampling rate" | rate-64 median 75.15, band counts, pooled min/med/max at 64 and 32, mean/max \|Δ\| | 5 | `… $P s1.1r64` (the slow pass) | `$W/bf_shard.mjs`; toolu_01DaeH84fdhnsZM7HV2JbLzi | reprints 5/5 |
| §2.1 census | 6-row table + pooled line + the read-across restatements | 66 | `… $P s2.1` | `$W/gen_mass_tables.mjs` (T.census, T.pooled) | reprints 66/66 |
| §2.2 bands | bands table, 16 band profile, band counts, within ±25/33/50% (row and 288 objects) | 94 | `… $P s2.2` | `gen_mass_tables.mjs` (T.bands, T.bandprofile); `an28.mjs` (toolu_01Mm7YzUAK4otSt36ACiG2Hy) | reprints 94/94 |
| §2.3 marks and objects | 24-row kinds table; `chevron-down` and `minus` boxes; 2.0× / 2.2× | 196 | `… $P s2.3` | `gen_mass_tables.mjs` (T.kinds); `kinds.mjs` | reprints 196/196 |
| §2.4 three weights | three-ways table, σ sweep table, 45%, "more level at every σ" | 84 | `… $P s2.4` | `gen_mass_tables.mjs` (T.threeweights, T.sigmaTable); `squint_sigma_bf.mjs`; `apply_bf.mjs` (squint/3×3) | reprints 84/84 |
| §3.1 footprint, line, packing | variance split, correlation, paths, overlap tables; 6% / 77% | 147 | `… $P s3.1` | `gen_mass_tables.mjs` (T.varsplit, T.corr, T.bypaths, T.weld) | reprints 147/147 |
| §3.2 the Dense drawings | 15-row table (verdict column excluded: judgement; its numbers checked); 73.3; 0.83–1.16; 1.26–1.39 / 0.83–1.03; Lucide globe 0.91; +13/+15/+16%; briefcase 14% under | 152 | `… $P s3.2` | `gen_mass_tables.mjs` (T.dense, evid) + `assemble_mass.mjs` (verdict text); toolu_01QkJuEsAr7jPn4dukvyiWLN (Lucide globe) | reprints 152/152 |
| §3.3 the Hairline drawings | 25-row table; 53/25/all marks; ×0.74–1.13; Lucide ratios | 132 | `… $P s3.3` | `gen_mass_tables.mjs` (T.hair) | reprints 132/132 |
| §3.4 crowded line | 8-row table; Lucide globe 0.91; wands 0.95–0.98 and squint 0.65–0.70; wand vs Lucide 0.92 / 2.90; `paintbrush-5`'s lens 0.75 + 1.25 = 2.00 at 16; the other 18 at 0.85–0.88 | 65 | `… $P s3.4` | `gen_mass_tables.mjs` (T.crowded); toolu_01V4fj9WMAgF9zXDy1o3GCN4 (wand vs Lucide); lens width new (`lensWidth`, from the two arcs; the reviewer's sagitta sum agrees) | reprints 65/65 |
| §3.5 the Lucide baseline | heaviest 12 / lightest 8 names; spread table; matched-concept table; 0.92/0.90; 0.92 (0.80–1.04); 69/25/3 and the three names | 53 | `… $P s3.5 --refs research/references` | `lucide.mjs`, `gen_mass_tables.mjs` (T.lucide*), `gen_mass_appx.mjs`, `facts_mass.mjs` | reprints 53/53 |
| §3.6 the filled row | 22-row families table (verdict by the card's 20% rule); ratio table; 108 (22%); discs 133–144 (52–56%); 153.9; Hairline 56 = 54 + 2; 1.7–3.1×; 6.2×; 1.19–1.66 / 0.71–3.09 | 209 | `… $P s3.6` | `gen_mass_tables.mjs` (T.filledHeavy, T.ratio); `movers.mjs` | reprints 209/209 |
| §4 across masters | drift table; stability table; 1.236/447/481; stroke and keyline arithmetic; two-band movers; drift lists; 0.90 | 70 | `… $P s4` | `gen_mass_tables.mjs` (T.drift, T.stable, T.driftHigh/Low); `movers.mjs` | reprints 70/70 |
| §5 judged list | M-1…M-8 figures | 21 | `… $P s5` | as §2–§4, `dup2.mjs` | reprints 21/21 |
| §6 F10 seed pairs | top-10 outline pairs, top-6 filled, 22 / 7 identical, 117,370 | 28 | `… $P s6` | `$W/pairs_bf.mjs`, `pairs_ident.mjs`; `gen_mass_tables.mjs` (T.pairs*) | reprints 28/28 |
| §7 in passing | 14 sets / 43 groups / 98 files and their three kinds; 0.71× / 0.98×; seven zero-length arcs | 12 | `… $P s7` | `$W/dup2.mjs`, `zeroarc.mjs` | reprints 12/12 |
| App. A census | 485 rows × 15 columns + the two row medians | 7,276 | `… $P appA` | `$W/gen_mass_appx.mjs` | reprints 7,276/7,276 (byte-identical rows) |
| App. B Lucide matches | 97 rows × 6 columns | 582 | `… $P appB --refs research/references` | `$W/gen_mass_appx.mjs` | reprints 582/582 (byte-identical rows) |
| App. C reproducing | bypass = inkArea on all 1,884 stroke-only files; bypass meets every closed form | 2 | `… $P appC` | `$W/bf_compare.mjs`, `bug_real.mjs` | reprints 2/2 |
| **all** | | **9,317** | `node tools/audit/mass-probe.mjs $P` | | **9,316 / 9,317** |

Figures the document repeats from card 1.6 (F7) are left to `tools/audit/grid-probe.mjs` (its header names them; I did
not run it): L89 "match `blurScore` to 5e-5" → grid-probe `s1.1`; L104 crispness 312 · 0.189 · 0.285 · 0.750 → `s0` / `s3.2`;
L105 the 0.70–0.75 band (plus ×3, minus ×3, `chart-bar`, `menu-3` at 0.750; `plug-3` 0.704; arrows 0.698–0.699; `play-2/-3`
0.765/0.758) → `s3.3`; L109 the `diagonalShare` defect (21 of 32, 11, four outlines and two filled change side) → `s1.1`/`s3.1`.
The half-tone figure (L88, "296 files") is printed by both: mass-probe `s1.1` (as part of the bug's scope) and grid-probe `s1.1`.

---

### `findings-grid.md`

*Card 1.6, F7 crisp at 16 — from its builder's map.*

Probe: `tools/audit/grid-probe.mjs` · tests: `tools/audit/grid-probe.test.mjs` (13 tests).
`$P` = the shared pin (`git archive 5933041`; no build needed). Comparator: `compare.mjs` in this folder
(`node compare.mjs docs/audit/findings-grid.md probe-out.txt`), last run on `probe-out.txt` here:
**12,039 of 12,041 measured figures reprint**; 16 tables matched by header, every row in the document's
order. Counts below are figures compared (table cells holding a digit, key columns excluded, plus an
inventory of prose figures each checked to sit on its document line).

Original logic: author transcript `agent-a671e99332a47d0c4` (A) and reviewer `agent-a8255be082d0c509a` (R),
both in `~/.claude/projects/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/07852967-…/subagents/`;
scratch `…/07852967-…/scratchpad/w1-mass-grid/` (W) and `…/w1-review/` (V). The committed document is
byte-identical to W's `grid.tpl.md` + `grid_frag.json` reassembled (`assemble_grid.mjs`), so every table
came from `gen_grid_tables.mjs` over `grid_all.json` (per-drawing record: `grid_shard.mjs`; half-tone
replaced by the bypass in `apply_bf.mjs`), `mass_all.json` (ink box: `mass_shard.mjs`) and `kinds.json`.

#### Sections

| § | what the figures are | measured figures | command | original source | status |
|---|---|---:|---|---|---|
| header + §0 | drawing count; J/A/D/N; outside-the-instrument share; unfiltered rank; census; bands; the 0.70–0.75 band; midline share; masters by solid pixel; 2×; filled vs outline; outer edges | 63 | `node tools/audit/grid-probe.mjs $P s0` | W `grid.tpl.md` lines 17–28 typed from the G1–G9 fragments of `gen_grid_tables.mjs`, `an3/an16/an30.mjs` | partly 62/63 |
| §1 (+ method ¶) | the 0.625 midline peak; analytic profile vs rasteriser on 48 lines, largest difference 0.0000 | 5 | `… s1` | W `validate_profile.mjs` | reprints 5/5 |
| §1.1 | rectangle repro (135, 0.625, 1.000, 144.0); landing score from `edgeLanding` alone (0.00005); independent re-implementation (25 of 2,886, 0.0001–0.065, home-2/home-3/info-2 ≤ 0.0033, 312/0.189/0.285/0.750 and bands); half-tone 296 / 0.286 / all shape-filled; `diagonalShare` model (485/485; 32 = 21 + 11; four flips; stats unchanged); arc flicker (+0.001 gains, +0.003 loses) | 27 | `… s1.1` | W `bug_repro.mjs`, `grid_indep.mjs`, `bf.mjs` + `bf_shard.mjs` + `apply_bf.mjs`, `diag_quirk2.mjs`, `grid_indep2.mjs`; V `pg_lib.mjs`, `pg_indep.mjs`, `pg_indep2.mjs`, `arcflake.mjs` | reprints 27/27 |
| §2 | the 16-row profile table (exact geometry + instrument score); 45° probe table; shipped diagonals | 58 | `… s2` | W `gen_grid_tables.mjs` (additions block: `T.profile`, `T.probe45`, `T.shippedDiag`) | reprints 58/58 (Chromium column: see (c)) |
| §3.1 | J/D/A/N table; 312 of 485; the unfiltered top 14 (0.76–0.93), first scorable 15th | 29 | `… s3.1` | W `gen_grid_tables.mjs` G2 `T.units`; `an30.mjs` | reprints 29/29 |
| §3.2 | census table; bands table; the 0.5 tie (`list-bullet-3` 0.49999999999999978; strict `<` B 101, C 30); viewer bullets, and the band each drawing they name is in (archive … lock A; alert-circle, book-open, bug B; the arrows C; plus, minus D); filled bands | 141 | `… s3.2` | W G1 `T.census`, G3 `T.bands`; V `g2b.mjs`; review-gc §5 (band membership) | reprints 141/141 |
| §3.3 | every outline ≥ 0.65 with its twin; the 0.750 eight; `plug-3`'s runs (5 of 6 on x.125/x.875); arrows 0.698–0.699; twins 0.000–0.001; soft-run causes table and its points / concept lists | 311 | `… s3.3` | W G4 `T.top`, `T.softcauses`; `an25.mjs`, `an31.mjs`; V `plug3.mjs` | reprints 311/311 |
| §3.4 | centreline table; 76.0%; 79.4% / 74.2% | 28 | `… s3.4` | W G5 `T.centrelines`; `an14.mjs` | partly 27/28 |
| §3.5 | outer-edge table; 96% / 86% / 31%; `chevron-down` 10.5 wide; the six half-pixel outlines | 37 | `… s3.5` | W G8 `T.outer`, `T.halfpixel`; `kinds.mjs`; box from `mass_shard.mjs` (`regionOf().bbox`) | reprints 37/37 |
| §3.6 | weight-2 table; 13.5% in 19 concepts (names), 14.5% in 18; 24's 2.5 runs all 0.500; filled ≥ 0.65 table; the four scorable | 161 | `… s3.6` | W G9 `T.fill2`, `T.fill2n16`; G4 `T.topFilled`; `an22.mjs`, `an23.mjs` | reprints 161/161 |
| §4.1 | straight-only 0.500 for 314 / 312; whole-drawing 0.433–0.569, 0.387–0.542; 16 runs 0.250–0.750 | 6 | `… s4.1` | W G1; `an4.mjs` | reprints 6/6 |
| §4.2 | solid-pixel table; bullets (15.6/16.9/20.2, 150/173/189 of 363, 0.961/0.958/0.936, midline 10.6/11.4/11.0 in 128/126/124, 4.5 points = 20.15 vs 15.64, 0.026, 4.7 and 1.6 points, 97% → 0%) | 63 | `… s4.2` | W G6 `T.solid`; `an15.mjs`, `an20.mjs` | reprints 63/63 |
| §4.3 | the 1× / 2× table; 79.5 / 74.2 / 19.9 / 25.2; every 16 run exactly 0.500 at 2× | 33 | `… s4.3` | W G7 `T.retina`; `an21.mjs` | reprints 33/33 |
| §5 | 173 of 485 (36%) = 153 + 16 + 4; diagonal darkest 0.81–0.99, shipped 0.92–0.99; half-tone median 0.79, p10 0.42, top tenth 1.00 | 10 | `… s5` | A `toolu_01EsSv5AXf3nKqtbtR8HYWLf` (inline `node -e`, half-tone quantiles) | reprints 10/10 |
| §6 | G-1…G-9 figures (all restate §3–§4) | 34 | `… s6` | as their sections | reprints 34/34 |
| §7 | seven zero-length-arc files; 25 scores move by up to 0.065; four drawings change side | 5 | `… s7` (the flips print in `s1.1`) | W `zeroarc.mjs`; V `degen.mjs`, `pg_indep.mjs` | reprints 5/5 |
| App. A1 | every outline at 16 (485 rows × 11 figure columns); the "72 of 1,693" rounding note | 4,457 | `… appA1` | W `gen_grid_tables.mjs` `T.appx16outline`; V `appG2.mjs` (72 of 1,693) | reprints 4,457/4,457 |
| App. A2 | every filled drawing at 16 (half-tone by the bypass) | 3,921 | `… appA2` | W `T.appx16filled`; `apply_bf.mjs` | reprints 3,921/3,921 |
| App. B | 24 and 20, every concept (6 figure columns) | 2,652 | `… appB` | W `T.appx2420` | reprints 2,652/2,652 |
| App. C | method only (no measured figure but the historical "115" test count) | 0 | — | — | — |

Figures that are card 1.5's (F1) and print from the sibling probe, not here:
`§1.1:49` "270 of 1,026 shape-filled files change ink by more than 0.05 px² (up to 10 px²), and no outline or
line-heavy filled file changes at all" → `node tools/audit/mass-probe.mjs $P s1.1` (that probe's bug-scope
lines; not run by this card) · `§7:384` "14 sets" → `node tools/audit/mass-probe.mjs $P s7` (run here once,
read-only: it prints `14 · 43 · 98`).

---

### `findings-air.md`

*Card 1.7, F8 air · F9 contact — from its builder's map.*

Probe: `tools/audit/air-probe.mjs` · tests: `tools/audit/air-probe.test.mjs` (18 tests, ~0.6 s).
Command form: `node tools/audit/air-probe.mjs $P <section>` with `$P` the shared pin (`git archive 5933041`).
Proof: a full run on the pin checked by `<scratch>/card-reprint/air/compare.mjs` — **640 of 661 figures match**;
the 21 that do not are listed in (b) (after the reviewer's corrections: two more found not to hold, one moved from (c) and reprinted). Comparator output: `…/air/compare-final.txt`; probe output: `…/air/probe-final.txt`.

Sources below: `S` = `/private/tmp/claude-501/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/07852967-7543-4b42-af82-b9afcfb57d4e/scratchpad/`;
transcripts in `~/.claude/projects/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/07852967-7543-4b42-af82-b9afcfb57d4e/subagents/`:
**A** = `agent-a5318085c00a70122` (author), **G** = `agent-a1dcc9e618774920c` (gap census), **K** = `agent-ab679e2236e0ca0e2` (contact census).
Every original script was also re-run, unchanged except for pointing at the pin, in `…/air/orig/`; each reproduces its own figures there.

#### Sections

| § | what the figures are | measured figures | command | original source | status |
|---|---|---|---|---|---|
| header (l. 3-4) | 2,910 drawings, 485 concepts, lint baseline | 3 | `… $P head` | G `gap-census.mjs report` (lint capture) | reprints 3/3 |
| Scope (l. 18-21) | 2x / 3x renders | 2 | `… $P scope` | `S/retina.mjs` (A toolu_01Wq2qFtzjvUenr6CWG7Fxje) | reprints 2/2 |
| §0 | classify defect on a filled rectangle | 10 | `… $P s0` | `S/classify-bug.mjs` (A toolu_015S5mHkdTYjYmStxhDQ4Qc5) | reprints 10/10 |
| §1 | 27 identical floors; 1.0 · 1.2 · 1.5 px | 4 | `… $P s1` | `S/airprobe.mjs` (A Write toolu_01PvBS6BdDZ9JjdVCpFpp35c, patched toolu_01JH2nMW5qEwYk181rsKgbsV, toolu_01HvU4qZDxmAt1FC2W31bMJ5) | reprints 4/4 |
| §2 | M1-M4: ladder, clear-phase shares, 3,888 rows, identical tables | 20 | `… $P s2` | `S/airprobe.mjs` + A toolu_01NUt7QCLbPiSNLo5M3q4QVb | partly 19/20 |
| §3a | nine situations x five columns; curvature | 49 | `… $P s3a` | `S/airprobe.mjs` + A toolu_012QURpKYEc6dYsDV24UNUqm | partly 47/49 |
| §3b | first clear pixel by channel angle | 19 | `… $P s3b` | `S/diagprobe.mjs` (A toolu_01FgAANYPk4nJZQtjwCSW1dV, patch toolu_015jDtURGzjqLiWdD3VcSKe4) | reprints 19/19 |
| §3c | alignment fractions; three constructions | 15 | `… $P s3c` | `S/aligncheck.mjs` part 1 (A toolu_01NH9dhD6pgis2LVvwY1hY4t) | reprints 15/15 |
| §3d | phase of every axial span | 23 | `… $P s3d` | `S/realphase.mjs` (A Write toolu_01WH6tGaxpg1VRT8UDkaKTEe, patches toolu_01PrcibUdiRFvhpFB7CE8tJK, toolu_01HvU4qZDxmAt1FC2W31bMJ5) | partly 21/23 |
| §4a | census, width distribution, narrowest twelve | 62 | `… $P s4a` | `S/realphase.mjs`; twelve: A toolu_012QURpKYEc6dYsDV24UNUqm | reprints 62/62 |
| §4b | airMin agreement and its disagreements, floor delivery, by kind, by angle | 60 | `… $P s4b` | `S/airread.mjs` (A Write toolu_01Ao9b4oJzHouHq9TTy6AKBs); `S/cost.mjs`; angle table A toolu_01P84r2fST9s7Cs7TeTzo5bu | partly 58/60 |
| §4c | 42 / 35 / 8 concepts / 83; book-2, desktop-6, bug pixel reads | 12 | `… $P s4c` | A toolu_01NUt7QCLbPiSNLo5M3q4QVb; `S/dump.mjs` (A toolu_01YFGg6Dws37Z2vCn8URZ966, toolu_01LKSz36T5nC2CrAtQRsmh9n, toolu_01PajjkdfFaf1D5WwVc4LFQq) | partly 10/12 |
| §4d | effective floor 1.485 and the window list | 5 | `… $P s4d` | A toolu_01X8S76cSdjnAVcaZZjj4P7V (inline) | partly 4/5 |
| §4e | gap census proof, two-port agreement, row counts | 90 | `… $P s4e` | `S/gap-census.mjs measure/report` (G Write toolu_01FyYexrFAzvivE4gyR9GkL1) | reprints 90/90 |
| §4f | candidate-floor table; readings at each floor | 41 | `… $P s4f` | `S/gap-census.mjs` table C2, C3 | reprints 41/41 |
| §4g | floor shaping table, shares by kind | 16 | `… $P s4g` | `S/gap-census.mjs` tables F, G | reprints 16/16 |
| §4h | NaN pairs and 7 paths, 21 unjudged, 414, read5b, 188 = 74+66+48 | 9 | `… $P s4h` | `S/gap-census.mjs` tables D, H; `S/gap-census-nancheck.mjs` | reprints 9/9 |
| §4i | 18 negative readings | 5 | `… $P s4i` | `S/gap-census.mjs` table H | reprints 5/5 |
| §5 | 0.88 / 1.5 phase counts; 33 glyph dot-gaps | 6 | `… $P s5` | arithmetic in `S/realphase.mjs` `verdict`; `S/aligncheck.mjs` part 2 | partly 4/6 |
| §6a | glyph / gap notes and what their air reads | 8 | `… $P s6a` | A toolu_01Pa7sGoYAZqsANapTocpiot; `S/aligncheck.mjs` part 3 | partly 7/8 |
| §6b | derived floors (1.0, 2.0, 1.414, 1.5) | 4 | `… $P s6b` | `S/diagprobe.mjs`, `S/aligncheck.mjs` | reprints 4/4 |
| §6c | cost table | 7 | `… $P s6c` | `S/cost.mjs` (A toolu_01PHHX2Fb2L9aPzF4j2MjkWN) | reprints 7/7 |
| Part two intro (l. 508-546) | census totals, class table, rejected cuts | 54 | `… $P p2` | `S/contact-census.mjs` (K, written toolu_01C2PDZTspVjetcygMpDk3CF, final at 20:17) `ANALYSE=1`; K toolu_01B1ErXZw5WnBd57NKutDVrA | partly 53/54 |
| §7 | lint buckets, 98.8%, pair-loop drops, 62/74, leak check | 19 | `… $P s7` | K `ANALYSE=8`; `S/blindspots.mjs` (A toolu_01QT2kYf82S8zQFJVFFatfMn); K toolu_01ApwGRLeM8MgXvQx2HPvriw; A toolu_01UM9z1JJKvsRaoK8cm83JSk, toolu_01CR45hrWpLzNEc8Q7qzGx1e | reprints 19/19 |
| §8 | T table, bands, arrow-down case, area depth 341/317, briefcase | 48 | `… $P s8` | K `ANALYSE=2,2c`; K toolu_01LLBGPLfpmgLmcqxNBZa76M, toolu_011GuJxiVnga7uXK1WWaRv5W, toolu_01BeEQ2JVUVViELzvBcypt8v | partly 46/48 |
| §9 | 138 render probes, plug-6, convergence | 26 | `… $P s9` | K `RASTER=all` (`renderProbe`) | partly 25/26 |
| §10 | bands 3+4, scaling law, band-4 families, x stroke | 11 | `… $P s10` | K `ANALYSE=2c` | partly 8/11 |
| §11 | trash, plug-3, grazes, shared runs, tangencies, welds, other | 13 | `… $P s11` | K `ANALYSE=7,8`; K toolu_01QwZgSsgsRi3gpLtvYX9kZZ (runTight) | reprints 13/13 |
| §12 | grammar across masters, outline vs filled, 19 / 0 | 10 | `… $P s12` | K `ANALYSE=3,4`; K toolu_011GuJxiVnga7uXK1WWaRv5W | reprints 10/10 |
| Judged list | #10, #21, #22, #23 (the rest cite sections above) | 8 | `… $P judged` | `S/gap-census.mjs` table D6; K `ANALYSE=2c`, `RASTER=all` | partly 7/8 |
| Eye table | the grey ladder; the cap gap matched on darkest pixel (0.625, "about 0.6") | 2 | `… $P eye` | `S/airprobe.mjs` | reprints 2/2 |

Named lists (census outputs: the 8 concepts, near-weld concepts, unjudged facing:self files, the 7 NaN paths, gap-note
concepts, the 15 byte-identical files, band families, grazes, tangencies, welds, graze-only and line-heavy
disagreements) are checked name by name; every name the document gives is in the probe's list.

---

### `findings-filled.md`

*Card 1.8, F13 the filled style — from its builder's map.*

Probe: `tools/audit/filled-probe.mjs` · test: `tools/audit/filled-probe.test.mjs` (23 tests, ~3 s).
`$P` = the shared pin (`git archive 5933041` + its own build). Every command below is
`node tools/audit/filled-probe.mjs $P <section>` (add `--cache <dir>` to reuse the slow censuses; each cache file is
stamped with a sha256 of the pin's `src/icons` names and contents, and a cache from another pin is refused, exit 2).

Source of the logic: transcript `agent-ae71d10e7c6ebe552` (session 07852967). The committed document equals
the author's final heredoc + its one python patch (`toolu_01YPAqoBA4WVzKG5QaTfNtki`) byte for byte — no reviewer
edits. The card's scripts were `measure.mjs` (Write `toolu_013ziaMd…`, Edit `toolu_01Y2NYRd…`, python patch
`toolu_01Aw1t4W…`), `cuts.mjs` (Write `toolu_01XmAhqY…`, Edits `toolu_01KoZiML…`, `toolu_01XcnfHX…`), `silh.mjs`
(Write `toolu_013Cbcxs…`, sed fix `toolu_0141fgYb…`), `pieces.mjs` (heredoc `toolu_012Kuoi1…`), analyses
`an1`–`an6` (`toolu_013RMcVM…`, `toolu_01M4yYno…`, `toolu_019LGVPk…`, `toolu_01UZfFay…`, `toolu_012TbPHB…`,
`toolu_01W7GMXb…`) and inline `node -e` commands (ids below). The scratch-root names the brief guessed
(`census-filled.mjs`, `u1…u15`, `inkbox_ro.mjs`, `warns2.mjs`) are not this card's — the transcript never
touches them. All five censuses were rewritten into the probe from the transcript's text, not from the scratch
files (which other agents' scripts of the same names may have overwritten).

Comparator: `<scratch>/card-reprint/filled/compare.mjs` lifts 387 figures off the document (each check first verifies its
snippet is on the cited document line) and checks them against the probe's output → **351 / 387 match**
(after the fresh reviewer's round: §2.2's steep radii now checked exactly, §4.3's "files" column added).
Output in `compare-out.txt`. Deliberate breaks: `mutate.py` → `mutate-out.txt`.

#### Sections

| § | what the figures are | measured figures | command | original source | status |
|---|---|---|---|---|---|
| header, §0 | population 485 / 2,910 / 1,455; `volume-off`'s ten flattening slivers at 24 | 2 | `… $P s0` | cuts.mjs smoke run `toolu_01DzNeQP…` (before the 16-cell filter) | reprints 2/2 |
| §1 | box table (pairs/concepts), the 13 `grows:` rows, half-step claim, grep 57, the 0.0005–0.01 band (301/142/114, by master), band table 1,100/301/54/0, largest, 21% | 48 | `… $P s1` | measure.mjs → an1.mjs `toolu_013RMcVM…`; inline `toolu_01UrvWiD…`; greps `toolu_01F4Uffy…`, `toolu_01Jhj427…` | partly 45/48 |
| §2 | 8,891 matched edges; deviation table; by class; by master | 7 | `… $P s2` | an1.mjs; inline `toolu_01UrvWiD…` | partly 5/7 |
| §2.1 | displacement counts 8/11/507; the ten-row px table | 14 | `… $P s2.1` | inline `toolu_018XwHRZ…` | reprints 14/14 |
| §2.2 | 411 / 230 / 181 / 93; threshold table; chevron table by master; by variant; C12 radii; bend radius vs C10 floor (362/199/160/3/0, rotate-ccw-10) | 25 | `… $P s2.2` | an5.mjs `toolu_012TbPHB…` | partly 23/25 |
| §2.3 | 202 edges / 44 concepts, by class, the concept list | 3 | `… $P s2.3` | inline `toolu_01UrvWiD…` | reprints 3/3 |
| §3 | 5,262 / 4,531 / 731 / 2,969 corners; 2,778 (94%), per master; 191 / 63; outer 2,579 / inner 390 | 9 | `… $P s3` | an3.mjs `toolu_019LGVPk…`, an4.mjs `toolu_01UZfFay…` | reprints 9/9 |
| §3.1 | the 1.5-era offset at 16: three rows (corners, concepts, names), totals | 10 | `… $P s3.1` | inline `toolu_01HpMcc8…` | partly 7/10 |
| §3.2 | the rest of the 191, eight rows | 9 | `… $P s3.2` | an4.mjs; inline `toolu_01HpMcc8…` | partly 8/9 |
| §3.3 | 1,387 / 125; the radius vocabulary table; heaviest users; 549 | 10 | `… $P s3.3` | an4.mjs | partly 9/10 |
| §4.1 | 1,029 facingGap readings; four 1/8 distributions; the sub-1.5 readings and notes | 10 | `… $P s4.1` | an2.mjs `toolu_01M4yYno…` | reprints 10/10 |
| §4.2 | 757 / 474 / 161 / per master / 658 / 99; "nine concepts"; the eleven-row table | 17 | `… $P s4.2` | cuts.mjs + an2.mjs | partly 16/17 |
| §4.3 | distinct widths; the 24 table (counts + examples; its "files" column); 20 and 16 lists; 198/231; "between or beyond"; ratio tables; "no cut thinner than 1.2×"; reference values | 43 | `… $P s4.3` | cuts.mjs + an2.mjs; reference values from smoke run `toolu_01Hj8K7J…` | partly 36/43 |
| §4.4 | 204 (14%); eight extremes; 24/users 1.49 | 10 | `… $P s4.4` | an2.mjs | reprints 10/10 |
| §5 | outer region identical by class; 344 / 118; the worst-at-24 table | 18 | `… $P s5` | silh.mjs → an6.mjs `toolu_01W7GMXb…` | reprints 18/18 |
| §5.1 | the ink box is identical on the concepts it names | 1 | `… $P s5.1` | pairs (the name list itself is a judgement) | reprints 1/1 |
| §5.2 | 144/51 · 228/80 · 1,083; both name lists; table / grid-2 / globe; `table`'s construction | 13 | `… $P s5.2` | pieces.mjs `toolu_012Kuoi1…`; table files `toolu_016z9Xj8…` | partly 10/13 |
| §5.3 | the two constructions (330/110, 15/5); "5 of 115" | 5 | `… $P s5.3` | an6.mjs; inline `toolu_01L8RBm4…` | partly 3/5 |
| §5.4 | the nine-concept ring table; search ring 2.5·2·2; C22's 6.25 vs 5.25; handle 1.980 → 3.5, 1.32×–2.33×; list-bullet-3 | 42 | `… $P s5.4` | inline `toolu_019D2YBm…`; files `toolu_01FAJaZJ…`, `toolu_013teXQU…`; `toolu_01KNkmkT…` | partly 39/42 |
| §5.5 | ink ratio table (9 rows × n/min/median/max); eight lighter; globe table; globe-2 −29%, counters, pieces | 16 | `… $P s5.5` | an6.mjs; inline `toolu_01L8RBm4…` | partly 15/16 |
| §5.6 | ban / ban-2: identical outlines; constructions; inks; enclosed white; IoU; 61% | 8 | `… $P s5.6` | `toolu_01NqrZ3k…`, `toolu_01L8RBm4…`, smoke cuts | reprints 8/8 |
| §5.7 | path-count deltas; 459; extremes; +2/−15; eight identical files | 16 | `… $P s5.7` | an6.mjs | reprints 16/16 |
| §6 | restated: 1,100/1,455/54/0; chevron table; 0.236 / 0.157 px; 8 over half a pixel; 301; six rings; −29%; 51 / 1→6 / 144 | 17 | `… $P s6` | restated + `toolu_018XwHRZ…` | partly 15/17 |
| §7 | the judged list's measured figures (1.1–3.4, the "on record" line) | 27 | `… $P s7` | restated | partly 22/27 |
| §8 | 2.81° / 0.236px; 2.33×; 29%; 61%; ten values; 1 → 6 | 7 | `… $P s8` | restated | reprints 7/7 |

---

### `findings-grammar.md`

*Card 1.9, axes F5 and F3 — from its builder's map.*

Probe: `tools/audit/grammar-probe.mjs` (+ `tools/audit/grammar-probe.test.mjs`). `$P` = the shared pin
(`<scratch>/card-reprint/pin`). Every command below is `node tools/audit/grammar-probe.mjs $P <section>` unless named.

**How it was proved.**
1. Card 1.9's scratch scripts (`13ae519b…/scratchpad/1.9/lib.mjs`, `composites.mjs`, `objects.mjs`, `probe*.mjs`,
   `verify.mjs`, `recheck.mjs`, `mic.mjs`, `last.mjs`), copied to `grammar/orig/` and re-pointed at `$P`, reproduce their
   saved outputs byte for byte (`partA.md`, `partB.md`, `objects-*.md`).
2. `grammar/faithful.mjs` holds the probe's core to the originals' JSON: **234 of 234 composite rows, the cross-family
   classes and near misses at 24 · 20 · 16 (1409/650/98/7 · 1375/627/99/18 · 1352/624/88/28), 105 of 105 families × 3
   masters, 381 of 381 pair rows — 0 differences.**
3. `grammar/compare.mjs` lifts every number from the document, section by section, strips names, rule numbers,
   citations and master labels, and checks each against the probe's output (table rows matched by first cell, and with
   `--cells` column by column). Outputs: `cmp-final-cells.txt` (strict) and `cmp-final-lenient.txt`. Each miss was then
   read by hand: cited, a label, a method parameter, or a real difference (b).
4. After the fresh reviewer (review-mg, corrections 4–9): the hand-read tokens are in `grammar/classify.json` (param 56 —
   the composite kinds' cardinality and everything built on the card's own selection of 38 badge rows (definitional); cited 17; label 15;
   judgement 2; miss 17 — tokens the comparator matched only by coincidence), and the comparator now leaves the first
   four out and counts the fifth as a miss: `node compare.mjs <doc> final.txt --strict --cells --classify classify.json`.

Number tokens are counted per line, so a figure restated in §3/§5/§6 counts again there.

#### Section map

| § | what the figures are | measured tokens | command | original source | status |
|---|---|---|---|---|---|
| header l. 8-12 | lint baseline 2,910 · 2,848 · 62 · 0 | 4 | `node tools/lint.mjs` (repo = pin) | — | reprints 4/4 |
| header l. 14-26 | the review's outcome counts (62 claims, 44 held, 16 wrong, 2 unsupported) and what was corrected | 16 | — | reviewer transcript `agent-a2b5d885da1224ed8` | not reprintable (c) |
| l. 28-40 headline | 78 = 25 · 18 · 4 · 31, 0 badges, 1.500 in 7 of 18, 1.505 · 1.505 · 1.578 in 6, the breaking parts | 5 | `head` | `composites.mjs` (toolu_01GPrAAPPKhdGXvj9wTLFdr1, run toolu_01CAPMFYbqFHoqw1HG7dfMaV), `recheck.mjs` A (toolu_01SAxU9qPETcDFEc47AC9cWE) | reprints 5/5 measured (the 1.500 / 1.505 · 1.505 · 1.578 air); 78 · 25 · 18 · 4 · 31 are COMPOSITES' cardinality, printed and labelled as a parameter (c); 0 badges a reading (c); 121 cited |
| §0 | px@16 scale, bound, geometry core 26 (list), kinds table 25/150 · 18/108 · 4/24 · 31/186 · 0/0, the eight two-mark concepts, the instrument caveat (∞ / identical / 0), 694 · 0 | 24 | `s0` | `composites.mjs` Part A; `recheck.mjs` D, D2 | reprints 24/24 measured; the kinds table (25/150 … 31/186, 0/0) is the parameter's cardinality, labelled (c); the "694 without an exact twin" wording does not hold (b10) |
| §1.1 | the 25-concept beside table (ink, share, centre, to bound, air + px, filled air, menu shortening 15→9.5 · 13.5→8.5 · 12→7.5, 37%), the plus line lengths 6.5 · 4.5 · 3.75, wand star and dot, cursor rays and cursor ink, the three readings (air list at 24, 3.24–4.16, 3.4–4.5, 8 of 16 · 6 of 12 · 5 of 10, 47 composites / to bound 0) | 365 | `s1.1` | `composites.mjs` Part B; `probe.mjs` (cursor, corrected to the file's stroke) | partly 364/365 (b4); leg lengths 2.871 · 3.847 · 4.554 cited (card 1.1 §2.7); "47 composites" is the parameter's size |
| §1.2 | the 18-concept through table (door/tray/card/box ink, returns, corners, arrow lengths and how much shorter, shares, air + px, filled air, openings 15 · 11 · 9.5 / notch 4.5 · 4.5 · 4.25 / corners 4.51 · 4.51 · 4.41 and 8.75 · 7.69 · 7.24, pencil ink 5.74 · 4.68 · 4.08, shafts 13.48 / 13.83 / 15.95 …), the air at 3 dp (7 / 6 / 5), 3 shrunken bases, the four straight lengths 15 · 14.75 · 12 · 10, 9.25 = 0.77 | 283 | `s1.2` | `composites.mjs` Part B; `recheck.mjs` A, B; pencil grep toolu_01UJUtEJFoWLtwgYz1DkRzeC | partly 281/283 (b5); the channel round compose (card 1.8) and the body note 6.36 · 4.95 · 4.24 cited (the probe checks the note says it); "18 concepts" the parameter's size |
| §1.3 | the strike table (bar ink square, centreline length, to bound, air, filled weight and air, ban-2's cut, volume-off's offset 5 · 4 · 3, channel, gap note 0.7 · 0.75 · 0.375), the `\` direction ×4, volume-off's x 1.5→13.5 (centre 7.5) | 79 | `s1.3` | `composites.mjs` Part B; `objects.mjs` E; `verify.mjs` (√2 lengths); `recheck.mjs` C | partly 70/79 (b6, b7, b8) |
| §1.4 | the 31-concept enclosure table (mark w×h, air), the "!" bar 8 · 4.75 · 3.375 against 8 · 6 · 4.5, checkbox's check 6.5 against 6.58 / residual 0.106 | 245 | `s1.4` | `composites.mjs` Part B | reprints 245/245; card 1.4's 121 / 66 / medians 4.00 · 3.25 · 3.00 / 14% and card 1.1's 0.70 → 0.54 cited |
| §1.5 | 485 concepts, nearest by construction 11.25–13.5 / 72–84%, the volume marks, bell-2's clapper (⌀3 · 2.5 · 2, 1.5 · 1.5 · 1.75, body = bell's at 20, 16, rim 0.5), the sheet: 349 not approved, badge ≥ 38 (names), strike 19, enclosure 21, ×4 ×4, user-search row 434 | 27 | `s1.5` | `probe.mjs` (bell-2); sheet greps toolu_01E2ZDLTTYCmY6x4RssJ785J, toolu_01R3t28jUy89SsTWBqLVuavt | partly 26/27 (b1); **the badge row "at least 38" is definitional — the card's own selection** (`CARD_BADGE_ROWS`, doc l. 273), printed as such beside the **113 names the card's own grep finds: 19 strike · 21 enclosure · 73 other** (all 38 are among the 73; 35 of the 73 are left out); corner badge 0 and the "about twenty" / "near 60" lists not reprintable (c) |
| §1.6 | beside marks 8 · 6 · 5, ring marks 9–10.5 · 7–8 · 5.5–6.5, 1.500 clearance, 3 bases (strategy C), 16 arrow composites, 34 bases / 23 one / 7 two / eye 3, file 7, folder 4, user 6, row 434 | 39 | `s1.6` | the reviewer's `review-1.9/census.mjs` → `census.out` (bases; read by the author at toolu_01ED4c57tUBrEBYNkVTJbRX4), `composites.mjs` | partly 36/39 (b7, b8); **34 bases / 23 / 7 / eye 3, file 7, folder 4, user 6 rest on the card's selection — definitional**; every docs/05 value cited |
| §1.7 | Fluent, SF Symbols, Untitled UI | 0 | `s1.7` (prints that it is cited) | — | cited, not this probe's (30 tokens) |
| §1.8 | the mark-size table (plus, x, check, arrows and heads, chevrons, C21 bar, "!", stars), six plus sizes 18 · 15 · 12 · 10.5 · 9 · 8, heads 10 · 9 · 8 and 8 · 7 · 6 in 5, 17 = 5 + 12 | 146 | `s1.8` | `composites.mjs`; `recheck.mjs` B; `probe2/3.mjs` (stars) | partly 145/146 (b5); the 12 rotate/refresh and their legs cited (card 1.1 §2.7) |
| §2.1 | 485 → 125 stems = 105 + 20, 9 mark families, 96 / 378, the five body categories with every family and count (19/65 · 12/48 · 2/8 · 42/137 · 21/120), 12 pairs, 2 + 2 | 109 | `s2.1`; headline also `node tools/audit/families.mjs $P census` | `objects.mjs` A (toolu_014GFrNMf63Qbz96HHQHLLNr), `verify.mjs` (toolu_01VJHFk2XMt5gDnBQMkfoLUf) | **partly 104/109 (b14)**: the headline and the all / split / partly rows reprint; the card's own code (verify.mjs order) gives all-but-one 24/72 and different 30/113, the document's 12/48 and 42/137 only after a hand move of 12 two-member families — the probe prints both splits |
| §2.2 | the 14 near-miss rows (masters, residual, px, tags), cart/cart-3 at 24 and 16, the knob 4.5 against 5, cradle 0.25 · 0.125 · 0 and capsule 1.342 · 0.671 · 0, paintbrush-2/-5 handle 0.174 / 0.195 / 6.69, database 0.5 · — · 0.25, text at 16 | 71 | `s2.2` | `objects.mjs` A; `mic.mjs` (toolu_01C7fPJpbNFfbFuPELsZi2No); `last.mjs` (toolu_01QFRuMaZ8Zg1yhoGNyJVdW7) | reprints 71/71 tokens; the database row's "0.5 · — · 0.25" does not (b15); verdicts are judgement; "every near miss" does not hold (b12) |
| §2.3 | the nine parts × three masters (door, star, check, knob, hook, cradle, shackle, arrowhead, landscape container 8 · 9 · 11, briefcase 0.556 · 0.556 · 0.417), the residual ranking, the bodies identical at some masters | 63 | `s2.3` | `probe2.mjs` (door, toolu_01MuMgA2usb3rHqpsWW2gM8x), `probe3.mjs` (star, toolu_019RNxzyDaJmKyh64p4tMkKn), `recheck.mjs` F, G, `last.mjs`, `mic.mjs`, `objects.mjs` A | partly 62/63 (b2, b3, b11) |
| §2.4 | speaker 7 of 7 / 5 · 4 · 3, pencil string 5 + 2, arrowhead 16, square 24 in 10 (12 layout-*), landscape 8 in 5, 18.5×14.5 r 2.5, files' fold ×0.833 / 5×5 vs 6×6, figure 0 of 7, cursor, image frame, menu 15 → 9.5, chevrons, "!" (8, ⌀2.5, gap 1, cut 1.25 · 1.125), dots 13 in 6 and 30 in 16, two doors; 127 pairs; 98 · 99 · 88 classes, 39 non-trivial; near misses 7 · 18 · 28; 0.086 · 0.139 · 0.28 | 93 | `s2.4` | `objects.mjs` B (pairs), `composites.mjs` Part A, `probe.mjs` | reprints 93/93; "exact" for code-2 holds at 24 only (b9); card 1.1's 26 cited |
| §2.5 | the stack table (shows past 3 · 5.5 · 4 …, air 1.5 · 1.5 · 1.75 / 2.5 · 2.5 · 2.76 / 1.52), 9 of 12, copy's tag offset 4, the 16 line 1.25 | 52 | `s2.5` | `objects.mjs` C | reprints 52/52 |
| §2.6 | the door table, login = logout-3, mirror = logout, -3 = login flipped whole, two doors, n = 1, 2 right | 70 | `s2.6` | `objects.mjs` D; `probe2.mjs` (canonical doors) | reprints 70/70 |
| §3 | each item's counts recomputed (38, 47, 9 parts, 43, 17, 9, 42 files, rows 455/456/434, 8 smaller bases, ring 40 / square 24 / landscape 8, 34 / 30 / 23; "simply good") | 79 | `s3` | as above | partly 72/79 (b2, b3, b7, b8, b11); items 1 and 12 (38; 34 / 30 / 23) and "47", "43" are built on parameters — not counted |
| §4 | the figures the eye questions quote (9.25, 0.77, the stars, 2 against 1.5) | 15 | `s4` | as above | reprints 15/15 |
| §5 | P1–P8's restated figures and the sheet rows 455, 456, 284, 434 | 39 | `s5` | as above | partly 37/39 (b2, b3); P1's 38 is the card's selection (definitional), P2's 25 and P3's 18 the parameter's size — not counted |
| §6 | this card's column (78, the body pairs, files/files-5 and help/help-2 at every master, 6.5 vs 6.58 / 0.08, −1.5 · −1.5 · −1.25, 9.249 vs 9.25, 24, the gap note) | 25 | `s6` | as above | partly 24/25 (b11); 78 (25 · 18 · 4 · 31) the parameter's size; G7's 5 and card 1.1's values cited |
| §7 | the handed-on figures (0.01, 1.28, 1.25, 0.5, 38/19/21, 30, 20×16) | 8 | `s7` | as above | reprints 8/8; "38 / … / 30" rest on the card's selection (definitional) — not counted; card numbers are labels |

**Totals (after the reviewer's corrections): 1,804 of 1,837 measured number tokens reprint** (comparator, strict and
cell by cell, with `classify.json`; 14 tokens the cell check missed because the probe prints them in a neighbouring
column of the same row were read by hand and counted as reprinting — `wand`'s star, the door's 2.5 · 2.75, volume-off's
gap note, the §2.2 0.177 / 0.25 / 0.5 · 0.25). **33 tokens do not: 10 distinct figures (b1–b8, b11, b14) and 5 claims
(b9, b10, b12, b13, b15).** Not counted: the composite kinds' cardinality (78 · 25 · 18 · 4 · 31, the drawings, 47,
43) and everything built on the card's own selection of 38 badge rows — definitional, (c).

---

### `rule-register.md` · `enforcement-gap.md` · `stale-statements.md` · `severity-proposal.md`

*The four registers (cards 1.14, 1.15, 1.16, 3.5) — from its builder's map.*

Probes (new, owned by this builder; audit only, imported by nothing, write nothing):

- `tools/audit/register-probe.mjs` — `docs/audit/rule-register.md` (card 1.14), and the **shared core** of all four
  (the pin's own `tools/lint.mjs` run in memory, the note census, the radius / angle / stack / cut / identity /
  optical / pair measures). The other three import their measurements from it, so one figure is computed one way.
- `tools/audit/enforcement-probe.mjs` — `docs/audit/enforcement-gap.md` (card 1.15); also holds the synthetic
  lint probes (`optical:`, `gap:`, area form, deny-list, rootless file) and `zeroArcFiles`.
- `tools/audit/stale-probe.mjs` — `docs/audit/stale-statements.md` (card 1.16); also the sheet parser, a read-only
  `inkbox-guard`, the plans sweep's disc-stamping rasteriser, the facingGap census, the Fluent pair count.
- `tools/audit/severity-probe.mjs` — `docs/audit/severity-proposal.md` (card 3.5).
- Tests: `register-probe.test.mjs` (38), `enforcement-probe.test.mjs` (9), `stale-probe.test.mjs` (13),
  `severity-probe.test.mjs` (6) — 66 tests, synthetic fixtures only (one builds a throwaway git repo in the OS temp dir).

Command form: `node tools/audit/<stem>-probe.mjs $P [section …] [--repo DIR] [--refs DIR]` with
`$P` = `<scratch>/card-reprint/pin`. `--repo` (default this repo) is read for git history only (rev-list,
ls-tree, cat-file, log); `--refs` (default `research/references`) only by `stale-probe` §2b.1 / §2b.5.

Comparator: `<scratch>/card-reprint/registers/compare.mjs` lifts **493 measured figures** (each by doc line range and the
figure as the document writes it, the lift itself checked against the document) and checks each against the
probe's saved output: **474 / 493 reproduce** (after the fresh reviewer's corrections, `review-reg/review.md`). The 19
that do not are listed in (b); twelve distinct claims, several stated in two documents. Everything the comparator does not lift is cited, a judgement, or in (c).

Severity's author: `severity-proposal.md` was written by the same author agent as the other three
(`agent-a6885ce7a2084e851`, one Write + two Edits; the main session only committed it, `5098607`).

Transcript ids below are in `~/.claude/projects/-Users-maruti-avantsa-Claude-Workspace-Mavan-Drawer/07852967-…/subagents/`:
**A** = author `a6885ce7a2084e851`; **D** = "Re-verify docs/09 verdicts at 485" `ab0292e14b647cdfd` (its scripts
`a1…d21.mjs`, `zeroarc.mjs`, `warns*.mjs` were extracted from its transcript; the scratch copies share generic names);
**Q** = "Lint enforcement inventory" `ad3930893cbc72938` (`inventory/census.mjs`, `probe*.mjs`);
**S1** = stale claims in CLAUDE.md/docs `a9b32561cc35105c9` (`verify-docs/v*.mjs`);
**S2** = stale claims in plans/skill/references `acc82668c1cb9f332` (`raster.mjs`, `census-filled.mjs`,
`guard-readonly.mjs`, `numeral-what-if.mjs`, `probe.mjs`, `html-strings.mjs`).

#### Sections → commands

#### rule-register.md (149 figures lifted; 144 reproduce)

| § | figures | n | command | original source | status |
|---|---|---|---|---|---|
| header L6-17 | note census per key, dot/numeral split, 212/273, co-occurrence, the three opt-outs disjoint | 19 | `register-probe $P census` (per-key counts also `node tools/audit/notes.mjs --root $P/src/icons`) | D `d20.mjs`, `d20b.mjs` | reprints 19/19 |
| two facts | first commit, nothing before 09-16, the composition table (4 rows), stress batch 10/10 | 8 | `register-probe $P frame` | A `toolu_01Re6r8bVipDjPSXRTsVoGvE`, `toolu_01KS5gvg5mA83zsQe3zJmoCs`, `toolu_01Vyi5mnVHg9ucBE5HyocEiW` | 8/8 |
| §A | 485 at every master, 1,455 pairs, 0 missing | 2 | `register-probe $P A` | D `a1.mjs` | 2/2 |
| §B + conflicts | 287 held, diagonal unused, mark/box/anchor/optical counts, C14 scaling (81/90, 80, 0.007, the nine misses), twins 135/135, microphone-5, centring bands 164/80/20/8 | 22 | `register-probe $P B` | D `b17.mjs`, `c14.mjs`, `c14b.mjs`; A `toolu_01N3z4UQUk4pYZ8pTgTHuPDX`; Q `toolu_017wPzsdBUn9jvsGDFQZY2gG` (centring) | 22/22 |
| §C + conflicts | files at the outline weight, 143/342/0, the pair-box census (18/54, 0.011, 54/0/0, the seven) | 10 | `register-probe $P C` | D `a2.mjs`, `b10.mjs`; A `toolu_012kK1cMNS6HiW1H5Ewz4bCc` | 10/10 (C-1's 827: see (b2)) |
| §D | 1,967 (67.6%) / 27,029, 0 undocumented, 2,910 commented, 2,808 tags, 2,226 since docs/09 | 6 | `register-probe $P D` (also `notes.mjs --root`) | A `toolu_01PPn7C4mSsTQZqtsmA55una`; D `b8.mjs`, `d21.mjs` | 6/6 |
| §E + conflicts | radius vocabulary (1,536, 996, 1,332, 1.0/1.25/2.0, the off-quarter values and their count), strict and loose container tests, trash, angles (2,556, 121, 381, 157, 38 extra, 29 defaults, 17 ungranted), filled angles | 37 | `register-probe $P E`; 1,536 / 2,556 / 381 / 121 also print from `node tools/audit/radii.mjs $(ls $P/src/icons/24/*.svg \| grep -v -- -filled)` and `node tools/audit/angles.mjs $(ls $P/src/icons/24/*.svg \| grep -v -- -filled)` (the 485 outline paths as arguments; with none they read the live tree) | D `b5b.mjs`–`b5g.mjs`, `b6.mjs`–`b6d.mjs` | 34/37 |
| §F + F1 + conflicts | warnings vs §6, file-text-2 1.625, 19%, glyph/gap notes, stacks (43/40/3/39/32/34/nine), pure line run (whole subpaths that are one straight segment: 3, menu and list-bullet among them), cut widths, clear pixels, the 16 filled corners (45 in 12) | 32 | `register-probe $P F` | D `warns.mjs`, `b12.mjs`, `b7.mjs`, `b9.mjs`, `b9b.mjs`, `b9c.mjs` (as patched in its transcript), `c16c.mjs` | 30/32 |
| §G + G7 | 102 untagged files / 17 concepts, nine groups / 22 concepts, canonical agrees, 0 byte-identical, two filled aliases, five 16-only pairs | 7 | `register-probe $P G` | D `b18.mjs`, `b18b.mjs`; A `toolu_01LTEdhoXVeGLWF7Fhu6A5Dh` | 7/7 |
| §H | modifiers: "zero composites ship", untested rows | 0 | — | judgement / cited (docs/05) | nothing measured |
| §I + "what this card adds" | 72 sort files without a note, 12 of 72 lines (numeral what-if), edge gaps, 371, 485/2,910, 834 rows | 6 | `register-probe $P I` | S2 `numeral-what-if.mjs`; A `toolu_019jmLxNRpUKbgDoaNsp1vsx` | 6/6 |

Cited, not reprinted: dates of C1–C30 (docs/07), the 33-of-351 census (docs/01:253), the Fluent ladder and 6.25/7.81%
(card 2.1), 92 icons / 133 pairs (docs/08), "~20 grants over ~50 concepts" (a hand count of docs/07's prose),
help-4-filled's 0.92 (docs/08:340). Judgements: H3 "zero composites", "Ten of its twelve verdicts hold",
"a factor of four", "five times larger".

#### enforcement-gap.md (79 lifted; 77 reproduce)

| § | figures | n | command | original source | status |
|---|---|---|---|---|---|
| §1 | lint summary and exit, 28 error sites, 60 of 62 | 2 | `enforcement-probe $P s1` | Q (Q1, Q13) | 2/2 |
| §2.1 | every file commented, 0 undocumented, 1,967 / 27,029 by master, trash's five values, 7,457 / 4,422 / 3,035 / median 123, keyword proxy 493 / 1,474 | 15 | `enforcement-probe $P s2.1` (counts also `notes.mjs --root`; its own proxy is a different word list) | D `b8.mjs`, `b8b.mjs`; A `toolu_01PPn7C4mSsTQZqtsmA55una` | 15/15 |
| §2.2 | `optical: -5 0`, `- .` → NaN, `opticl:`, `keyline: marks` probes; 2,880; 164/80/20/8 and the eight names; 45/270/94 | 10 | `enforcement-probe $P s2.2` | Q `probe*.mjs` (T3b, T3c, P12, P9b), `toolu_017wPzsdBUn9jvsGDFQZY2gG` | 10/10 |
| §2.3 | empty tree, tree without 16, one minus.svg | 5 | `enforcement-probe $P s2.3` (in-memory lint over job subsets) | Q (Q4, Q10); the "without 16" run appears in no transcript | 4/5 |
| §2.5 | 515,024 bytes, the symlinked run (0 bytes, exit 0; spawned read-only through `/tmp` → `/private/tmp`), area-form probe, 0 outline area paths, commands, deny-list, rootless file (and the note error it discards) | 7 | `enforcement-probe $P s2.5` | Q `census.mjs`, probes P1–P6, P10b, the symlink probe | 7/7 (2-of-6, 162,529: (c)) |
| §2.4 | sort breakdown, the sort-alpha warnings at 24 printed verbatim from the run, 0 of 72 notes, 12 → 0 / 24 → 24, edge gaps, trash 0.99 / 0.75 | 9 | `enforcement-probe $P s2.4` | Q warns table; S2 `numeral-what-if.mjs` | 9/9 |
| §3 | 28 error sites and their lines | 2 | `enforcement-probe $P s3` (counted from the pin's `tools/lint.mjs`) | Q (Q1) | 2/2 |
| §4 | 138 / 414, 342 = 204 + 138, help-4-filled probe, 102 / 17, the composition table | 8 | `enforcement-probe $P s4` | Q `census.mjs`, probe P3; A composition | 8/8 |
| §5 | 1,726 (59%), 816/338/30, 0 no match, centring, 1,026, 5 anchored concepts, `gap: 0.5` probe, sort 1 vs 1.38 | 8 | `enforcement-probe $P s5` | Q (§3 item 5, T4d, Q8) | 8/8 |
| §6 | §5x citation lines, 74 of 74 cite §6, 1,028 / 375 / 2.71 vs 2.00, paintbrush-4 null, 9 zero-arc files, 45 entries | 13 | `enforcement-probe $P s6` | A `toolu_01HwLZWeecNgNit4Vh8LQfTW`, `toolu_019QgdLQqLuJYU12C84CSuKq`, `toolu_01FnvXuBN4ivyxbc2jiFSabj`; D `b19.mjs`, `b19b.mjs`, `zeroarc.mjs` | 12/13 |
| §7 | what no check will settle | 0 | — | judgement | nothing measured |

Cited, not reprinted: every `path:line` into lint, docs and plans; docs/09's verdicts. Judgements: the "which is right"
column, "Two smaller ones".

#### stale-statements.md (219 lifted; 208 reproduce)

| § | figures | n | command | original source | status |
|---|---|---|---|---|---|
| header | the pin | 1 | `stale-probe $P head` | — | 1/1 |
| §1 | help's ink fall 14.1%, lint 62/0/0, optical vs map-pin, five anchored concepts and the docs that name none, identity | 9 | `stale-probe $P s1` | S2 `raster.mjs` (help 75 → 64.46, so 14.1%); D `d20.mjs`, `b18.mjs` | 9/9 (1.9: (c)) |
| §2 | the sheet (834 / 485 / 348 / 1), grows / gap / anchor / box censuses, 1,455 / 54 / 18, 414 of 1,026, lint.mjs:459, the guard, 45 entries, paintbrush-4 | 31 | `stale-probe $P s2` | S1 `v1_counts.mjs`, `v2_notes.mjs`; D `b10.mjs`, `d20.mjs`, `b19b.mjs`, `zeroarc.mjs`; S2 `guard-readonly.mjs` | 28/31 |
| §2b.1 | README: one commit, 970, 15 categories, stroke shares, arc radii 540/398/557, plus-large span, recession 342, bearings, SF / Nucleo / Fluent counts | 14 | `stale-probe $P s2b1 --refs research/references` | S2 `toolu_01Pbjn67zPHJ5Ekjp3zZgMhi`, `toolu_01Jz8H8RXf7Hf9q6bQk7zKgg`, `toolu_01X4TjThA4UDSM91Ze3ZpCu7`, `toolu_01M1K7aenLU1GgVpH1vEDmrA`, `toolu_013uoDKCRK5we7JvXxk6zZ4z` | 14/14 |
| §2b.2 | the eight `'outline'` lab lines, 59/59 · 64/64 · 69/69 and 50 at 1.5, 1,026, 1.67 strokes | 5 | `stale-probe $P s2b2` | S2 `html-strings.mjs` (the line rule is reconstructed: it finds exactly the doc's eight lines), `census-filled.mjs` | 5/5 (cap caveat: (b2)) |
| §2b.3 | lint, 18 = 15 + 3 tests, 13 at e027857, +5 at 1828450, 95, ARRIVE / BULGE, filled whites under 1.49, the redrawn readings, 342/1,026, 138/414, ten hashes, 8 commits | 19 | `stale-probe $P s2b3` | S2 `census-filled.mjs`, `probe.mjs` | 19/19 |
| §2b.4 | old → new ink at 16 (75 → 64.5, 206 → 152, 38 → 38), lint, "in transition" 0, 95, 032b1c4, the guard and 23.5% | 11 | `stale-probe $P s2b4` | S2 `raster.mjs`, `guard-readonly.mjs` | 11/11 |
| §2b.4a | the plan's figures at the pin | 7 | `stale-probe $P s2b4a` | A `toolu_01KkNfF1WEfhsUBxGg2GSbW7`; Q; A metrics | 7/7 |
| §2b.5 | 107 / 53 / 54, 12, 13 of 17 and the four outside, batch/, queue.mjs commands, nucleo 221/182, 884, 834/496/485, +0.75, volume-levels captures, fluent/folder.json | 16 | `stale-probe $P s2b5 --refs research/references` | S2 `toolu_01Q94ERyEJypwiYK7qAcvVyp` and the sort-family table | 16/16 |
| §3 | templates/, the legacy folder, six lab pages | 4 | `stale-probe $P s3` | A; S1 (which found `templates/grid-24.svg` present) | 2/4 |
| §3b | docs/09 re-measured: angles, cuts and pixels, radii (and the off-quarter count), stacks and the pure line run, minus growth, file-text-2, trash, pairs, chevrons, cut weights, 16 corners, keylines, identity, decimals, filled angles | 61 | `stale-probe $P s3b` | D (`b5*`, `b6*`, `b7`, `b9*`, `b10`, `b12`, `c13`, `c14*`, `c16c`, `b17`, `b18`) | 57/61 |
| §4 | the sort family's measurements, 107/53, 13 sort concepts, 60/62, 72 → 60, lint's §5x lines, the prose citations, the two file comments | 23 | `stale-probe $P s4` | S2 sort-family table; Q; A greps | 22/23 |
| §5 | 0.0.1 / private / no tags, 143/342/0, 198 (40.8%) / 287 / 0, 1,455, legacy, check script, hooks, no parallel check | 9 | `stale-probe $P s5` | Q (Q11, Q12); D | 9/9 |
| §6 | the rulings table's counts | 9 | `stale-probe $P s6` | derived from the above | 8/9 |

Cited, not reprinted: Fluent's two columns and separations (card 2.1), docs/09 and docs/08 quotes, plan statements.
Judgements: severities, "about twenty rows", "every one reproduces", "best-maintained document".

#### severity-proposal.md (46 lifted; 45 reproduce)

| § | figures | n | command | original source | status |
|---|---|---|---|---|---|
| §1 | 60 of 62 | 1 | `severity-probe $P s1` | Q | 1/1 |
| §2 | 2,848 clean | 2 | `severity-probe $P s2` | Q | 2/2 |
| §3 | the grading model | 0 | — | judgement | nothing measured |
| §4.1 | "keep them": the error list | 0 | — | cited (enforcement-gap §3) | nothing measured |
| §4.2 | 1,455 / 0, each of the four rules fires on 0 drawings | 2 | `severity-probe $P s4.2` | Q (D1–D7) | 2/2 |
| §4.3 | 414, 1,026, 198 of 485 | 3 | `severity-probe $P s4.3` | Q | 3/3 |
| §4.4 | 349, 27,029 = 14,285 + 12,744, 1,888 (64.9%), 79, the worst three files, edge gaps, 22 | 7 | `severity-probe $P s4.4` (14,285 / 12,744 / 79 also print from `notes.mjs --root`) | A `toolu_01VDu2AtytJbSN2WcWdPcLBK` | 7/7 |
| §4.5 | 2,910, 0, 1,888, 45/270/94, `optical: 3 0` probe | 5 | `severity-probe $P s4.5` | Q | 5/5 |
| §4.6 | eye-only rules | 0 | — | judgement | nothing measured |
| §5 | the hatch, optical, empty / without 16 / one file, the symlinked run, 515,024, area form, `gap:` probe, sort 1 vs 1.38 | 13 | `severity-probe $P s5` | Q | 12/13 |
| §6 | 95 tests, the grep-0 coverage terms, 115 audit tests (the test files listed by `git ls-tree 6293f80:tools/audit`, the commit that added them), the guard, hooks, scripts | 8 | `severity-probe $P s6` | Q (Q11, Q12) | 8/8 |
| §6b | 12 of 72, 72 → 60, filled 24 stay | 3 | `severity-probe $P s6b` | S2 `numeral-what-if.mjs` | 3/3 |
| §7 | the recommendation's 12 of 72 and 1,888 | 2 | `severity-probe $P s7` | as §6b, §4.4 | 2/2 |

---

### `references-fluent.md`

*Card 2.1, Fluent hold/give — from its builder's map.*

Probe: `tools/audit/fluent-probe.mjs` · tests: `tools/audit/fluent-probe.test.mjs` (19, synthetic, 0.3 s).
Run: `node tools/audit/fluent-probe.mjs $P [section …] [--refs research/references]` (`$P` = the shared pin).
Fluent is read from the records card 2.1 ingested on 2026-10-04 (`research/references/fluent/figma/*.json`,
gitignored); no Figma call. Our side is read from `$P/src/icons`.

**Result: 630 of 641 measured figures reprint** as the instrument samples them (539 of 641 on true geometry — see
"Instrument defects" below) (comparator `compare.mjs` here, output `compare.out`; a
figure reprints when the probe's value, rounded half-up to the document's own decimals, equals the document's).
Revised 2026-10-08 after the fresh review (`../review-ff/review.md`): §8 L458 added to (b); tests extended. Revised
2026-10-09 after the closing check: the geometry.mjs cubic-sampling defect — every section now reads both ways.

Where the logic came from: the card kept its scripts beside the data, `research/references/fluent/figma/card-2.1/`
(`measure.mjs`, `gaps.mjs`, `an1`–`an9.mjs`, `fluent-sample.json`, `chunks.txt`) — byte-identical to the copies in
the 2026-10-04 scratch folder. The author's later corrections (`2 of 904`, `1 of 384`, `55–94%`, `2.46`, `2.50`,
the named-deaths table) came from inline commands in transcript `agent-a4eabd65d66f243ae`. Note: the file
headers are off by one — `an3.mjs` says "Analysis 4", … `an8.mjs` says "Analysis 9"; `gaps.mjs` is "Analysis 3".

#### Sections

| § | what the figures are | measured figures | command | original source | status |
|---|---|---|---|---|---|
| The short answer | our edge / keyline / tilt counts | 5 | `… $P answer` | an5 6a, 6c; an8 9a (tool_use `01DSZzdusY1jyC79CtSr374E`, `01TRUP8qCNFxJLXzW5JEx4mt`) | reprints 5/5 |
| Sample | catalogue counts, sample, themes, our side | 24 | `… $P sample` | `01Q4epQmqYdUueatmJ46KYg5` (sample builder), `01FWcm9VRkjWT1MFNAQ1nhSf` (names), `013c4L4XKJoNynPMHXXSyeeD` (themes, 0 short) | reprints 24/24; the copy page's half (2,608 / 2,606) reprints from the saved catalogue (§7 notes); the "two groups" sentence: (c) |
| Sample, last sentence | "< two points between the two groups" | 1 claim | `… $P sample-groups` | **none** — no code in scripts or transcript | not reprintable; probe's reconstruction offered, see (c) |
| Instruments · three approximations | 53 / 75 / 128 orphans; Eye, Window Wrench, Hand | 7 | `… $P approx` | an5 6e, an8 9b, `01Fsejx529gALAVpAnBaBh31` | reprints 7/7 (one sentence is wrong in kind, see (b) note 1) |
| §1 stroke table | Regular ladder, canvas shares, +0.5, 0.25–0.28, ours | 39 | `… $P s1` | an1 §0 (`01KXWDmjmzMxTXs14rA6cQKK`), an6 7a (`01A3iAAwyY3h2uPsqrCZtFH1`) | reprints 39/39 |
| §2 hold/give table | 12 rows, 12 → 48 | 138 | `… $P s2` | an3 (`017n7sbMNVaYnAv3gJR6FHK4`), an6 7c, an5 6a–6c, an4 5b/5c/5f (`01UysRmpatszb5M2foz3Hz3X`), an2 §1/§3 (`01EAXGHZoP3Sb2X1rYUUYys4`), an1 §2/§4, an8 9a | partly 134/138 |
| §3 detail-death order | margin, rescales, losses, 75 deaths, named table, ours 69 | 113 | `… $P s3` | an2 §3/§4, an5 6d/6e, an8 9b/9c, `01Fsejx529gALAVpAnBaBh31`, `01PK3S9LW9muCe3CenAoeqcX` | reprints 113/113 |
| §4 where the curve bends | ladders, margin steps, `Circle` 12 vs containers 14 | 49 | `… $P s4` | an3, an6 7c, an1, an4 5b, an7 8c (render bounds) | reprints 49/49 (one figure rests on `measure.ink`, see below) |
| §5 us against them | 18-row table + prose | 125 | `… $P s5` | an1, an2 §1, an3, an4 5a/5f, an5, an7 8a/8b, an8 9a, an9 | partly 123/125 |
| §6 take / refuse | T2–T6, R1–R3 | 63 | `… $P s6` | an6 7a–7c, an7 8b, an5 6a/6b, an4 5f | partly 60/63 |
| §7 corrections | K1–K6, Kind 1 | 71 | `… $P s7` | an1 §0, an3, an4 5a, an6 7c, an2 §4 | partly 70/71 |
| §8 eye questions | 0.50 vs 1.25, 1.87°, 12 vs 14 | 7 | `… $P s8` | an7 8a, an5 6c, an1 §4 | partly 6/7 |
| §9 how to reproduce | no figure (a run time) | 0 | — | — | — |

**Known defect, `figma.mjs measure.ink`.** Every Fluent box the probe prints is the path's (`geometry.bbox` on each
record's `d`), as the card did. One figure rests on `measure.ink`: §4 line 225, "confirmed independently from the
extractor's own render bounds" (an7 8c). The probe prints it, labelled, beside its exposure: 0 of 63 of those
drawings disagree with the path box by more than 0.02, and none carries a rotated node (a flip cannot be seen in
the record's flags).

**Corrections table.** The document states the *corrected* claim (§1, §7 K1): Regular 1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5;
it quotes the old one only as docs/07:47. The probe computes the ladder from the records and prints it.

**Reconcile list.** (1) This document's 96.3% filled/outline box equality is: per master, our outline and filled
path boxes whose **width and height** agree within 0.02 (position ignored, `geometry.bbox`, 3 dp) — 467 of 485 at
each master; 18 names × 3 masters = 54 pairs differ (probe §6 R2 prints the names). Card 1.8's 1,100 of 1,455 is a
different definition; not reconciled here. The probe prints this definition beside the figure and in its header. (2) The own-side figures are this document's own run, reprinted with its
own definitions (measure.mjs path boxes, the an2 part matcher), not card 1.4's.

On true geometry the per-section counts are: answer 5/5 · sample 24/24 · approx 5/7 · §1 38/39 · §2 84/138 · §3 109/113 ·
§4 49/49 · §5 109/125 · §6 49/63 · §7 61/71 · §8 6/7 (`compare-true.out`).

---

### `references-sf.md` · `references-nucleo.md`

*`references-sf.md` (card 2.2) and `references-nucleo.md` (card 2.3) — from its builder's map.*

Probes: `tools/audit/sf-probe.mjs`, `tools/audit/nucleo-probe.mjs` (tests beside them). `$P` = the shared pin
(`<scratch>/card-reprint/pin`, `git archive 5933041` + its build). Both probes print `## §…` headings in the
document's order; every printed figure is computed. Comparator: `refs-sn/compare.mjs <doc> <probe output> <ranges.json>`
lifts every number from the document's line ranges and looks for it in the matching probe section (ranges in
`refs-sn/sf/ranges.json`, `refs-sn/nucleo/ranges.json`; saved outputs `refs-sn/sf/probe-out.txt`,
`refs-sn/nucleo/probe-out.txt`). "Tokens" below are those lifted numbers (rule ids, § numbers, paths, card numbers
and backticked names excluded); each missing token was then triaged by hand into: raster (not reprintable),
cited, judgement, non-figure (a percentile label, an attribute), or did-not-reproduce. Every table that reprints
was also read line against line by eye.

Transcript ids are in `agent-a0b4f5321ca183e9c` (the author of both documents); scripts are the card folders
`research/references/sfsymbols/card-2.2/` and `research/references/nucleo/card-2.3/` (gitignored; the final
post-review versions — the reviewer's changes went in through `review_me/patch_sf2.py`, `apply_ink_update.py`,
`patch_nuc1.py`, `patch_nuc2.py`, whose figures come from the re-runs these scripts record).

---

#### SF Symbols — `docs/audit/references-sf.md` (card 2.2)

Command for every row: `node tools/audit/sf-probe.mjs $P <section>` (add `--no-font` to skip the python/fontTools
outline reads). Full run 15–30 s (the reviewer saw 60 s on a loaded machine). The `r3.*` sections reprint the
card's own aggregation over its saved per-pair raster records (`research/references/sfsymbols/card-2.2/sf2/*.jsonl`,
`sf2/corner.json`, `sf/deep.json`, read through `--refs`) — **"from the card's raster records; the raster itself
not re-run"**: the Skia/scipy raster stage that wrote those records is not re-run by a committed tool.

| § | what the figures are | tokens | section | original source | status |
|---|---|---|---|---|---|
| The short answer (25–72) | counts, shares, the order matrix, our 485, the raster headlines | 82 | `short` + the sections it restates | as the sections below | reprints 82/82 (the raster headlines from `r3.*`) |
| Sample + Units (76–90) | name confidences, 3,986 / 3,749 / 3,720 pairs, font axis and em, the stroke 170 / 39.75 / 356, 2,910 | 36 | `sample` | `names.json`; `sfsymbols.mjs strokeOf` (= `weights.json`); `fontMeta()` | 33/36 — the 6 · 7 · 5 deep-sample composition is a hand pick (judgement) |
| Instruments checks (103–112) | (a) ridge vs profile; (b) template ring 5.713 (5.688 · 5.713), disc 39.36 (39.40), radii 25.39 − 19.68, Black 6.348 / 41.89, Ultralight 3.079 / 36.54 / wght 28.93; (b) font side | 34 | `checks`, `sample`, `r3.deep` | `sf_templates.py` (2), (3) | partly — template side and the ridge reads (154.2 · 43.9 · 183.8, the slash bars, in `r3.deep`) reprint; the perpendicular profile (154.4 · 43.4 · 183.4) and the font side of (b) at the small scale have no saved records: (c) |
| Declared limits (114–124) | 14 pairs, 4 of 39 contours, 3-unit tolerance, 58 strings | 6 | `sample` | `sf_reuse.py` | reprints 6/6 |
| §1 (128–161) | file sizes, entry counts, release tags, 1,400 / 1,107 / 399, 15, 129, templates' layers | 60 | `s1` | tool_use `toolu_01Xikqb84yAAAi4PoUv4HvZm`, `toolu_01HoNEMfJKUhRsR5FWiQFLny`; `sf_grammar.py` (pairing) | reprints 60/60 |
| §2.1 (167–184) | histogram, 1,097 / 1,196, 1,391, 1,723, 3,957, 556 / 512 / 167 / 125 | 40 | `s2.1` | `sf_grammar.py` | reprints 40/40 (1,723: see the definition note in (b)) |
| §2.2 (186–209) | the 58 tokens by role, uses, 57 names | 71 | `s2.2` | `sf_grammar.py` | reprints 71/71 |
| §2.3 (211–246) | 60 patterns, top ten, 85.7 / 93.6%, stacking, tokens per suffix | 44 | `s2.3` | `sf_grammar.py` | reprints 44/44 |
| §2.4 (248–265) | the precedence matrix, 17 of 56 | 18 | `s2.4` | `sf_grammar.py`; `toolu_01HoNEMfJKUhRsR5FWiQFLny` | reprints 18/18 |
| §2.5 (267–281) | tokens and bases by release, 1,427 of 3,984, 1,394 | 39 | `s2.5` | `toolu_017q7LS1XHyuxLJW1oJDJqhE`, `toolu_01WcGzeqShe6JZ1JirDAktD9` | reprints 39/39 |
| §3.1 (287–309) | per class: n, base in place / scaled / redrawn, ink box grows, layout width unchanged | 61 | `s3.1` (n, box, layout from the font) + `r3.1` (the three raster columns, 74 of 744) | `sf_census.py`, `sf_reg_an.py` over `sf2/regcensus.jsonl` | reprints 61/61 (raster columns from the records) |
| §3.2 (311–345) | container boxes, 1,486 of 1,526, nine cells, exact bounds, left edges, advances | 79 | `s3.2` | `sf_containers.py`, `sf_containers2.py`, `toolu_01WcGzeqShe6JZ1JirDAktD9`, `toolu_017cUnLeZyM8ftGrFqGZ54es` | reprints 77/79 — 10 / 8 / 7 and 37 files (our ring) cite card 1.1 |
| §3.3 (347–373) | the six enclosure pairs, 74 of 744, 160 of 480, our 10.27 | 49 | `r3.deep`, `r3.1`, `r3.4`, `s3.3-6` (our side) | `sf_final_tables.py` over `sf/deep.json` | reprints 45/49 — 10.27 does not reproduce (b); 1.5 is the stroke rule; "7 – 17%" and "1 – 9%" are differences of printed ratios. Plus → .square's wall (161) and ÷ wall (1.04) print where the document has "—" |
| §3.4 (375–406) | silhouettes, the cut | 50 | `r3.4`, `r3.deep` | `sf_cens2_an.py` over `sf2/fill.jsonl`; the inline cut read over `sf2/cut.jsonl` | reprints 46/50 — 1.5 / 2 / 2.5 cite docs/09 §2; "medians 1.02 – 1.06" by family: the card's grouping was not found; the probe's reading (first word of the name, groups of 5 or more) gives figure 80, arrow 41, medians 1.02 – 1.04 |
| §3.5 (408–420) | slashes | 34 | `r3.5`, `s3.3-6` | `sf_cens2_an.py` over `sf2/slash.jsonl` | reprints 34/34 |
| §3.6 (422–462) | badges | 88 | `r3.6`, `s3.3-6`, `r3.5` | `sf_cens2_an.py` over `sf2/badge.jsonl`; `sf2/corner.json` | reprints 85/88 — 40% squares and 25% chance are parameters; "about 0.8 radius beyond it" is 1 − the printed 0.15 / 0.26. The corner distances (0.15 / 0.26 across, 0.71 / 0.68 down) reprint with the probe's reading of "in badge radii" ((1 − u) · w / r) — the card's formula was not found |
| §3.7 (464–480) | 23 of 26 at 5.69 – 5.71, gearshape 5.46 (5.1 – 7.5), waveform / wifi, 15 / 9 / 1 / 1 layers | 13 | `s3.7` | `sf_templates.py` (1) | reprints 12/12 (the 13th token is the attribute "opacity 0") |
| §3.8 (482–495) | the three-weight table and the ratios across it | 53 | `r3.deep`, `sample` | `sf_final_tables.py` over `sf/deep.json` | reprints 51/53 — the Black disc 1,089 prints 1,090 (probe right); the slash air 2.1 strokes prints 2.06 (the column's 2 dp); the slash bar ×4.2 is printed both ways, ×4.3 on median bars and ×4.2 on mean bars (definitional) — all three in (b) |
| §3.9 (497–541) | the 20 deep pairs at Regular | 169 | `r3.deep` | `sf_final_tables.py` over `sf/deep.json` | reprints 169/169 |
| §4 (545–619) | 286 / 40 (19 + 21) / 124 / 35, the 35, 9 two-prefix names, 67% (326 of 485), 35 × 6 = 210, the §3.1 lines it restates | 33 | `s4.2` (+ `r3.1`) | `toolu_017Z1PWAcbv3GsXEwsNWhV3Y` | reprints 31/33 — 2.5 · 2 · 1.75 cite `check-circle.svg`'s comment, 10 / 8 / 7 cites card 1.1 |
| §5 (623–684) | K1–K6 | 52 | `s5` + restated sections | K5: `toolu_019v9sPjDJyTNSPTjUvBWhZ2` | reprints 42/52 — the rest are cites (2,664 ×3 `CLAUDE.md`, 0.55 docs/08, the stroke rule 1.5 / 1.2 / 1.25 ×4, "card 1.8") |
| §6 (688–707) | eye questions | 32 | restated sections | — | reprints 29/32 — 1.2 is the stroke rule; 0.52 – 0.54 cite `findings-primitives.md §3.2` |
| §7 (711–737) | how to reproduce, the re-derivations | 37 | restated sections | — | reprints 37/37 |
| §8 (741–760) | 3,316 · 75.6% (2,507) · 809; 1,494; 114 of 1,101; the wall 153.0 · 170.0 · 186.5 / 9.5 · 8.3 · 7.2% / 1,615 · 2,040 · 2,605 | 18 | `s8` | `sf_grammar.py`, `toolu_01TqfzNso9b6tM7fG7BwDx8z`, `toolu_01HoNEMfJKUhRsR5FWiQFLny`, `sf_templates.py` (4) | reprints 18/18 |
| §9 (764–892) | T2 99.3 / 67% / 35, T3, T4, R1 – R8 restatements | 139 | `s9` + restated sections | as above | reprints 138/139 — "137" is p95 136.6 at the document's precision (counted) ; 1 cite |

**SF summary:** 1,280 of 1,337 lifted tokens are found in the probe's output; by hand, every figure reprints except
two that do not reproduce (10.27 and 1,089, (b)) and the check-(a) profile and check-(b) font-side values in (c);
three more rows in (b) are definitional (1,723, ×4.2, 5.713) and one is a format (2.1 shown at 2 dp); the rest are cites, parameters
and judgement. Cell by cell, the record tables (§3.1, §3.4, §3.6, §3.9) hold 155 figure cells and all match.

#### Nucleo — `docs/audit/references-nucleo.md` (card 2.3)

Command for every row: `node tools/audit/nucleo-probe.mjs $P <section> --cache <dir>` (the Nucleo side reads
Nucleo's library through `nucleo.mjs`, `$HOME/Library/Application Support/Nucleo/icons`). "Reprint" counts the
lifted tokens the probe prints with the document's value; figures it prints in another section count where printed.

| § | what the figures are | tokens | section | original source | status |
|---|---|---|---|---|---|
| The short answer (25–67) | strokes, ratios, radii, floors, detail, verdicts, ink bands | 150 | `short` | as the sections below | partly 146/150 — 2 do not reproduce (6.3; the 5 of "3 – 5%"), 2 cite card 1.2 (59 – 62%) |
| Sample + the control-group table (71–91) | 64,933 · 64,019 by family · 914 · 44,396 · 15,719 · 99.2% · 3,184 / 1,251 / 1,593 · 1,455 · stroke_max 1,429 / 2.2% / 377 · 512 · 540 · the grid steps | 35 | `sample` | `nuc_census.mjs`; `toolu_0181bZhEbgMLJA4MCgmKTdkF`, `toolu_01YQueQNnKuBAMoMXgr8JWLc`; `nucleo.mjs census` | reprints 35/35 |
| Instruments + declared limits (93–118) | 58.5% / 97.5% caps and mitres, keyline n 3 / 13, 54.0 · 54.7 · 30.0 · 19.7%, 99.2%, 917 | 25 | `sample` | `nuc_tabA.py`; `toolu_01T7zXPGwNckj2aU5LLP3dP8` | reprints 23/25 (the other 2 are the 0.25-stroke band, a parameter) |
| §1 (122–161) | the stroke / keyline / margin table, live area, edge touching, stroke ÷ keyline spread, whole-pixel edges, `square-warning` | 221 | `s1` | `nuc_final_tables.py`, `ours_tables.py`; `toolu_011qjwhqpGzmpmaNTGyCHx4v`, `toolu_01S3k1WLYBWiLXyQcofSM4ik` | partly 218/221 — ours' whole-pixel 70% · 70% and "70 – 76%" print 69 (b) |
| §2 (165–210) | the corner table, `square-warning` radii, three readings | 154 | `s2` | `nuc_tabD.py`, `nuc_final_tables2.py` T3; `toolu_01PwZpT6VoZNdzktMoTcQmMt` | reprints 147/154 — 6 cite card 1.2 (61.8 · 61.4 · 58.6% table cells, 59 – 62%, 93.8%; the probe prints its own 61.1 · 61.1 · 58.3%, which the document's note states), 1 is card 1.2's 0.025 snap |
| §3 (214–267) | the air table, same-concept air, dot-to-stem table, Pixel 3,147 of 3,321 | 258 | `s3` | `nuc_final_tables2.py` T4; `toolu_01Lm4fjAqbpUoeCC9ZkjPZbr`, `toolu_01MWGQyC44yUcyMaceG7pU6o`; `nuc_dotgap.mjs`, `ours_dotgap.mjs` | partly 256/258 — 1.82 prints 1.81 (b); 0.55 cites docs/08. Pixel's 3,147 reprints; its producing command is in neither transcript, and the probe's reading (the floor rounds to 0.82 or 0.83 at 2 dp) is the only natural one that gives it (the reviewer: raw [0.82, 0.83] gives 3,109) — plausible as the card's, not proven |
| §4.1 (273–291) | ratios to the grid | 64 | `s4.1` | the same pairstat commands; Nucleo's stroke column = ratio of §1's modal strokes | partly 63/64 — 1.82 prints 1.81 (b) |
| §4.2 (293–324) | the ink-band chain table, what stays / goes, run lengths | 157 | `s4.2` | `nuc_ink.mjs` (solid parts included), `chain_tab.py`, `toolu_01MyUE4HCmWwG3srS8xtrg6q` | reprints 153/157 — 3 are the 0.25 band (parameter), 1 cites card 1.4 (16 of 970) |
| §4.3 (326–348) | the verdict table, stroke shares, +15 points | 57 | `s4.3` | `nuc_verdicts.mjs`; Core 24 → UI 18 recomputed with `nucleo.mjs coreVsUi()` (the card read `core-vs-ui-all.json`, `toolu_015NpT9bRZawwVhHKtGvHm93`) | partly 54/57 — "6.3% of Core 32" ×3 prints 6.2 (b) |
| §4.4 (350–383) | part-by-part table, kinds, ink vs part view | 81 | `s4.4` | `nuc_pairs.mjs`, `nuc_pairs_an.py`, `toolu_015tyfHoWJGpqou4VHz1XA4v`, `toolu_01T7zXPGwNckj2aU5LLP3dP8` | reprints 81/81 |
| §4.5 (385–407) | caps / joins, solid parts, mean parts | 34 | `s4.5` | `nuc_tabA.py`; `toolu_016gJPqkaoFTLshee2DCJU3G`; T5 | reprints 31/34 — 14 / 7 / 7 overlay sheets are a look (judgement) |
| §4.6 (409–424) | detail table, 2.7× / 4.9× | 74 | `s4.6` | `nuc_final_tables2.py` T5 | reprints 74/74 |
| §5 (428–441) | the two held / scaled / let-go lists | 45 | `s5` | as §4.1 – 4.6 | partly 42/45 — ×1.82 prints 1.81 (b); 89 of 89 cites card 1.4 |
| §6 (445–494) | K1 – K5, Kind 1 (plug-3 1.25, wallet-2 1.49, trash 0.99 / 0.75, 11 glyph concepts, 4%) | 84 | `s6` | as above; K2 `nucleo.mjs census`; Kind 1 = the §3 floor ÷ stroke < 0.995 (`toolu_017Pcx7o6oqLc67ywzEFChwN` read cross-part gaps only; the probe uses §3's definition, which gives the document's list) | reprints 80/84 — 0.55, 59, 62 cited; "card 1.7" not a figure |
| §7 (498–512) | the figures the eye questions quote | 28 | `s7` | as above | reprints 28/28 (the four named concepts are a pick; the probe prints their part counts) |
| §8 (516–554) | regex stroke-width shares; quarter-turn radii (svgpathtools, ported); the ink re-implementation | 67 | `s8` | `toolu_01LgFctzrxQVsE9Nw2UEodC4`; `nuc_radius_indep.py` (ported to JS); `ink_indep.py` | partly 54/67 — 42% prints 41%, 2,371 prints 2,370 (b); the ink re-implementation is (c); the rest are parameters and command text |
| §9 (558–656) | the take / refuse restatements | 110 | all | as above | reprints 109/110 — 62 cites card 1.2 |

**Nucleo summary:** 1,592 of 1,644 lifted tokens reprint (the same count on the first and the latest output); 13 places do not reproduce (six figures, (b)); 5 are
not reachable by a committed tool (c); the rest are cited, parameters, judgement or not figures. Cell-by-cell, the ten tables hold
470 figure cells; 7 differ — 4 are the double roundings in (b), 3 are the card 1.2 cells.

---

---

### `references-central.md` · `references-untitled.md`

*`references-central.md` (card 2.5) and `references-untitled.md` (card 2.4) — from its builder's map.*

Pin `$P` = `<scratch>/card-reprint/pin` (5933041). Measured 2026-10-08.

#### How the figures reprint, in one paragraph

Both documents name a committed command, and **both commands reprint their documents' measured figures as
stated**: run on 2026-10-08, each one's stdout equals its saved `analysis/report.txt` (the file the documents were
checked against) byte for byte except the `run <timestamp>` and `done in` lines; the PNGs and `pairs.json` they
rewrite came out byte-identical. A comparator (`compare-central.mjs`, `compare-untitled.mjs` here) lifts every
measured figure from each document by regex, finds its line, and recomputes it from the saved stdout of the
committed commands and the probes: **Central 505 of 505 match; Untitled 374 of 375.** Two probes were built for
what the committed commands do not print, or print only from the live tree:
`tools/audit/central-probe.mjs` and `tools/audit/untitled-probe.mjs` (+ `.test.mjs` each).

**Do the committed commands write? Yes — and running them broke a rule.** CA and UP write under
`research/references/<central|untitled>/figma/analysis/` (gitignored). The lead's brief allowed running them if they
wrote only there, but the shared wave rules (`wave34-common.md`, "Never") forbid writing to `research/` at all. I ran
both once (2026-10-08 21:47–21:48). They rewrote all six files: `report.txt` and `sample64-stroke2-vs-1.png`
(Central); `report.txt`, `pairs.json`, `breaks-1.png` and `breaks-2.png` (Untitled). I restored the two `report.txt`
files from the backup taken just before (`orig-analysis/`, copied with their dates). All six files' contents now
equal the backups (hashes `349a92a53dd9`, `8f60660f3203`, `6cd10331c356`, `9c332e71a969`, `0002959105f7`,
`054ce581ed0c`; confirmed by the reviewer too). The two reports keep their 2026-10-04 dates; the two PNGs and
`pairs.json` now carry 2026-10-08 21:48 mtimes with unchanged contents. **Wave 5 must not re-run CA or UP:** read the
saved `analysis/report.txt` instead. It equals today's run apart from the `run` timestamp and `done in` lines, and
every comparison here was made against it. Run times measured (not to be repeated): UP 42.4 s, CA 50.7 s.

**The live-tree caveat.** The committed commands' "our set" halves (`untitled-ours.mjs` `run` and
`radiusRelation`) read the **repo's live `src/icons`**, not the pin. Today they agree (`git diff 5933041 HEAD --
src/icons` empty, working tree clean), so every "ours" figure matched both ways — but once the drawing session
commits an icon, `untitled-pairs.mjs --ours` and `central-axes.mjs --ours` stop reprinting the pinned figures.
The probes re-run the same logic on `$P` (sections marked **pin** below); use them for the "ours" figures.

**Arithmetic.** Both documents say their command prints "the measurements … not the sums and shares worked out
from them". 38 Central and 34 Untitled figures are tagged as such sums, shares, differences, cumulative counts
and length normalisations (a few more shares are worked out from two printed counts); the comparator recomputes
each from the printed lines (marked *arith* below). Two Central ones are float ties
(0.41/2 = 0.205 → doc 0.21, 1.73/2 = 0.865 → doc 0.87): they match with half-up rounding; `toFixed` gives
0.20/0.86.

Commands, with `R=--refs research/references` implicit (the default):
- **CA** `node tools/audit/refs/central-axes.mjs --png --ours` — writes under research/; wave 5 reads its saved `analysis/report.txt`
- **UP** `node tools/audit/refs/untitled-pairs.mjs --ours --png` — same
- **SC / SU** `node tools/audit/refs/figma.mjs summary central|untitled` (stdout only)
- **IC** `python3 tools/audit/refs/independent-check.py` (stdout only)
- **T** `node --test tools/audit/refs/pairgeom.test.mjs` (18 tests)
- **CP** `node tools/audit/central-probe.mjs $P <section>` · **UPR** `node tools/audit/untitled-probe.mjs $P <section>`

#### `docs/audit/references-central.md`

| § | what the figures are | measured (count) | command | original source | status |
|---|---|---|---|---|---|
| short answer | the five answers' rates, counts, percentiles; our chevron 2.81° / 10 of 120 | 63 | CA (61); UPR `s8` (2, pin) | committed CA; transcript `aae043a33c132814b` | reprints 63/63 |
| §1 sample | sets, drawings, verified/rotated/disputed and causes, weights, cornerRadius-as-property (3,980 / 17,334; 95.4 vs 90.0%), the two examples; 37 frames, `burger`'s error, 28 bridge calls; 24×24; lengths normalised (*arith* 9) | 41 | CA (26); CP `s1` (5); SC (1: 24×24 ×57,780); *arith* 9 | CA; frames/bridge calls: catalogue + raw dumps (doc cites `figma-extract.md:17`, CA header) | reprints 41/41 |
| §2 axes | redrawn/identical per axis, radius classes (1,038 and 1,282 *arith*), distinct geometries | 21 | CA | CA §1 | 21/21 |
| §3 stroke axis | 3a table + by pair (53.3%, 64.1–67.5% *arith*), 3a by drawing, 3b side table, 3c points, 3d 64-sample (53 *arith*), 3e exemplar boxes | 77 | CA | CA §2, §8 | 77/77 |
| §4 angles | pieces, kept-angle table, percentiles, by box held, the 6,198 not kept (29.1% *arith*) | 29 | CA | CA §3 | 29/29 |
| §5 corners | Central's corner table and failures; **ours**: the 24/20/16 table, +0.125 at 16 in 13 concepts, the 24/20 off corners | 79 checks: 30 Central-side, 31 ours (18 of them checked twice: live and pin) | CA (30 + 18 live); **CP `s5` (pin, 31)** | CA §4, §9 (`radiusRelation`) | 79/79 |
| §6 radius axis | outline/filled box-change tables, side holders, the 1,464 / 1,885 changing sides, chevron-bottom 10.00→8.76 | 31 | CA | CA §5, examples | 31/31 |
| §7 outline vs filled | pairs, per-side and by-drawing tables, break rates (*arith*), 1,831, 886; **the 26-sample 334 of 390**, the 81 always-breaking icons (59 slanted / 22 not; hands, medals, 3D boxes), the cross family, cross-large 15 of 15 by up to 0.46; line-only split; cut table | 76 | CA (61); **CP `s7` (14)**; UP (1: 22.6/3.1/74.4) | CA §6–§7; list: transcript `aae043a33c132814b` `toolu_01SjzG4gxEZkP9wiySvKyR5N` (c21.mjs) + `toolu_01QfSia2CSiz7cE5DbRF3VK3` (c22.mjs); 334/390: the card brief (first message of that transcript) | 76/76 |
| §8 transfer | 1,401 / 1,455 / 54 (ours), 34% | 4 | UPR `s8` (pin, 3); CA (1) | UP `--ours` | 4/4 |
| §9 findings | Kind 1 #1–#4 (13 twins, 50 corners, clipboard/copy/archive/thumbs-up radii, under 0.08); 0.625, 0.05, 2.125 *arith* | 19 | **CP `s9` (pin, 16)**; *arith* 3 | CA §9 | 19/19 |
| §10 eye | percentiles, ours 48 of 120 / 2.813°, 77.9–85.4%, 1.2× *arith*, 0.41 | 9 | CA (5); UPR `s8` (3); *arith* 1 | CA, UP | 9/9 |
| §11 data notes | `burger`, verified/disputed shares, 4,439 / 7,704 / 438 (*arith*), tolerance stability (61.2–68.7%, 36.2–28.6%, 94.4–95.0%), off-axis weights, 22% *arith*, independent check (1,253 / 1,844 / 68.0%; 1,135 / 1,651 *arith* from CA's r0/round row; 886), 18 tests, `images-4` | 36 | CA (28); IC (5); T (1); CP `s1`, `s11` (2) | CA §0–§4; IC; `pairgeom.test.mjs` | 36/36 |
| take / refuse | rates restated (63.3, 91.8–61.2, 34.1, 61.2, 65.5/55.5, 94.7, a third *arith*, 1,091/1,464, 72.5% *arith*, 77.9–85.4, 23.0); ours 1,401/1,455/54, 2.81°, 1.92° | 20 | CA (15); UPR `s8`/`s9` (5, pin) | CA, UP | 20/20 |
| **all** | | **505** | | | **505/505** |

Cited, not reprinted here (not measured by this card): 159 brand logos (`tools/audit/refs/figma-extract.md:17`);
C23's 2.5·2·1.5 / 3.25·2.75·2.25 and C7's 34 files (`docs/07-character.md:47,63`); `docs/09` §2's quote
(`docs/09-rule-audit.md:45`); 114 / 95 / 19 and `032b1c4` (`plans/stroke-16.md:213`); bend 0.75 vs 1.97
(`docs/07-character.md:52`); 0.91 (the card brief's figure; §7 reprints it as 2 × 0.457 = 0.91, *arith*).

#### `docs/audit/references-untitled.md`

| § | what the figures are | measured (count) | command | original source | status |
|---|---|---|---|---|---|
| short answer | 1,087/1,170, 83, 3 units, 43 badges, the 26 (names, none a badge, 26 of 26, 14.5%), 606 / 237 / 886, 264 / 36, 234/258, 935/935, 1,401 / 54 / 18 / 0, 48 / 120 / 2.81° | 46 | UP (23 + 1 live); CA (3); **UPR `answer` (18; ours from pin)**; *arith* 1 | UP; the 26's names: raw dump `untitled-extract-0-26-…` `picked` | 46/46 |
| §1 sample | page id, 1,187 / 2,359, 24×24, weight 2, round caps/joins, centred; pairs and set-asides; heart-hand's NaN; 8 bridge calls; render-box agreement (2,359 / 0.0037); independent check (1,087 / 1,170, 606); lengths normalised (*arith* 12); 32 px/unit | 41 | UP (15); **UPR `s1` (10)**; SU (1); IC (3); *arith* 12 | UP §0–§1; census: records + raw dumps | 41/41 |
| §2 box record | cumulative table (*arith* from UP's histogram), worst 3.0 / 2.5, sides 4,541/4,680, sizes 49/23/11, the 139 sides by side, 79 / 56.8%, 60 *arith* | 30 | UP | UP §2 | 30/30 |
| §3 three kinds | class table, silhouette bands (838, 34/36, 540/870, 38, 199, 58/62, 2, 2, 141 *arith*, 34, 61, 38), class A bands 574/575, 264 (300 *arith*) | 36 | UP | UP §3, §5, §6 | 36/36 |
| §4 slanted ends | 4a (Untitled 606, ours 237/485, Central 886), 6,482 / 2,251, ours 110/143; 4b table (Untitled A/B/C/all; **ours 636/299/935**), square-on 618/649, contours 2,489/2,573, four to six *arith*; 573/4,680 and 935/5,820; 4c 24 sides, the 21 names, **badge split (all but cloud-lightning and pen-tool-01/02)**; 4d 95.8 vs 100%, 315 of 573 | 60 | UP (32 + 2 live); **UPR `s4` (22, pin + BADGE split)**; CA (3); *arith* 1 | UP §4, §7; badge split = `BADGE` (untitled-pairs.mjs:236) applied to UP's 24-side list | 60/60 |
| §5 breaks | 83, 42, group sizes 43/7/10/23, the per-group descriptions (badge up to 1, 2 for cloud and credit-card, 2.5; diamonds 0.94–0.95; vertices 0.62–0.63; cube-02 0.62; bars 1; horizontal bars 0.5; coins 0.5; pies 0.03–0.19), the 23 'rest' names and worst sides, 14 / 9 | 19 | UP (per-pair lines) | UP §2 | 19/19 |
| §6 kept and cut | kept/cut bands per class, 22 wider / 18 narrower (*arith* on UP's kept histogram), 394 (83.3%), 79 *arith* | 14 | UP | UP §5 | 14/14 |
| §7 corners | smooth flags, corner table (83.2% and 69.4% *arith*), 3.2→4.2 (270/281), 4.8→5.8 (537/781), 4.16 in 234 / 62 / 35, 1.6 *arith* | 43 | UP; *arith* 2 | UP §6 | 43/43 |
| §8 our set | 1,401/1,455, 467/485 at each master, the 54 / 18 concepts at all three masters (0.5 · 0.25 · 0.25 or 0.375), 54 grows notes, 0 undeclared, the 18 names; 143 / 429; 636/636, 593/665, 349/415; chevrons 40 × 3 = 120, 48 / 28 / 10, 2.813°; the family table; 32 of 48 | 52 | **UPR `s8` (pin, 50)**; UP (2 live) | UP §7 (`untitled-ours.mjs` `run`) | 52/52 (table cells: count and largest change; the flat 16 range 1.39–1.92) |
| §9 findings | 12 flat chevrons, 1.39 / 1.85 / 1.92°, 32 of 36 | 7 | **UPR `s9` (pin, 6)**; UP (1 live) | UP §7 | 7/7 |
| §10 eye | 1.4–1.9°, 4.16 vs 5.8 | 3 | UPR `s9`; UP; *arith* | UP | 3/3 |
| §11 data notes | 1,170; figma.mjs summary 1,171 pairs / 1,084 holds; harness way 1,084 again; **the 0.007 example**; 18 tests | 6 | SU (2); **UPR `s11` (2)**; UP (1); T (1) | harness re-run: transcript `aae043a33c132814b` `toolu_01JkHsKrnxFi96bsaZRLTG8i`; 0.007: the 3-dp print in `toolu_01CMuMK2ogW9GM3kHDoFg2aq`'s output | **partly 5/6** |
| take / refuse | 48, 92.9%, 43 / 83, 55%, 25.6% *arith*, 83.3%, 4.8 / 4.16, 3.2 / 4.2, 79.9%, stroke 2, 60% smoothing, 24×24, 26 of 26 | 18 | UP (14); **UPR `s1`/`s8` (4)** | UP; smoothing: records (`cornerSmoothingProp` 0.6 on 5,289 of 5,289 paths) | 18/18 |
| **all** | | **375** | | | **374/375** |

Cited, not reprinted here: C12's "under 1° at 20 and 16" and "up to ~3° flatter at 24", the dates 2026-09-17/-20
(`docs/07-character.md:52, 47`); `CLAUDE.md:200`; the 2.5 · 2 · 2 rule; "the 26 were the commonest concepts"
(`plans/set-and-rules-audit.md:163`, the card brief); Fluent's T2 (`references-fluent.md`).

## 4. Every figure that did not reproduce

One row per figure (or per claim, where one cause moves several cells). **None was fixed by changing a number; no document was edited.** Each is a correction for wave 5 to weigh. 164 rows.

| document | § | line | document's value | probe's value | likely cause |
|---|---|---|---|---|---|
| findings-primitives | §1.2 | 99–100 | "container ring (90 members, 40 concepts, 24 filled) and the arrowhead (45 members, 34 concepts, 16 outline)" | the ×90 class is an r 0.75 dot (40 concepts, all masters); the 24 filled ring's class has 37 members, 37 concepts; the ×45 class is a 10.75 × 0 line at 16 | classes named after their representative's file (`bell-2-filled`, `arrow-left-2`), not their shape |
| findings-primitives | §1.3 | 119–122 | floor-bound bars "hold their absolute size at every master"; 6 × 1.5 "in archive … at all three masters" | the shape spans three masters but no concept draws it at two (archive @24, book-3/file-text… @20, message-4 @16); archive's cut steps 6 → 5 → 4 × 1.5; all are filled cut-outs | a census of shapes read as a census of concepts |
| findings-primitives | §2.2 | 206 | `layout-footer` ×4, `layout-header` ×4, `layout-sidebar` ×4, `layout-sidebar-right` ×4 | ×3 each (the class also holds mail-3, package, save, table, table-2) | miscount |
| findings-primitives | §2.2, §6 | 206–207, 988 | "26 concepts on one path, zero residual" | 24 on one path (residual 0); package and save share box and radius but are another path (a chamfered corner) | the card keyed the class on box + radius, not congruence |
| findings-primitives | §2.3 | 232–244 | ⌀ table, 11 cells: 2.5→20 "2"; 3→20 "2.5, and 2.7 for six"; 3→16 "2 / 2.4 / 2.5"; 4.5→20 "4"; 4.5→16 "3.5"; 6→20 "5"; 7→20 "5 / 3 / 6.5"; 8→20 "6"; 8→16 "4 / 4.5 / 5"; 9→20 "7"; 10→16 "6" | 2 / 2.5; 2.5 / 2.7 / 3; 2.4 / 2 / 1.5 / 2.5; 4 / 4.5; 3.5 / 2; 5 / 4.5; 5 / 6 / 3 / 6.5; 6 / 5.5; 4 / 4.5 / 5 / 6; 7 / 6.5; 6 / 6.5 | table hand-summarised from per-master lists; the probe follows each dot to the same subpath at 20 and 16 |
| findings-primitives | §2.3 | 246–251 | glyph dot "⌀2 at 20 and at 16 … exactly the plain detail dot (building, printer-2, list-bullet)"; "13 concepts" | true at 20; at 16 the detail dots split ⌀1.5 / 1.75 / 2 (only printer-2, camera-6 stay ⌀2). 13 is the ⌀2.5 group: 11 declare `glyph: dot`; sparkle-4 and wand stay ⌀2.5 at 20 | generalised from 20 |
| findings-primitives | §2.3, §6, §8 | 264, 265, 270, 921–922, 1068 | "0.6 (40 files)", "0.575 (40 files)", "80 files" | r 0.6: 38 circles in 10 files; r 0.575: 20 circles in 6 files; in all 80 circles in 24 files | circles counted as files |
| findings-primitives | §2.5, §6 | 327, 955 | ban-3 half-length 5.9965 at 24 | 5.9963 (20: 4.1295, 16: 3.3022 reproduce) | halved the 3-dp-rounded length 11.993 (0.0002) |
| findings-primitives | §2.6 | 381 | variants 1 and 3 "held within ±0.25°" | 0.222° @24, 0.206° @20, **1.302° @16** (variant 1: +1.302, +0.818, +0.668) | 24/20 generalised to 16 |
| findings-primitives | §2.6 | 396–399 | chevrons-up-down "adds 8 more chevron drawings … outside the 9-class family" | 0 outside: all 8 share a chevron shape exactly at every master and style (plain and -2 = chevron-up/down-small; -3, -4 = chevron-up/down-2-small) | compared only against the default chevron-up |
| findings-primitives | §2.7 | 408–434, 436–437 | "files" column 24 · 10 · 8 · 6 · 6 · 4 · 4 · 2, "(22 files)", "(21 files)" | these are head counts; distinct files 21 · 7 · 2 · 5 · 5 · 1 · 1 · 1 in the 8 rows that differ | column label: the census counted subpaths |
| findings-primitives | §2.9 | 502 | "36 drawings — 12 concepts × 3 masters" | 36 bends in 33 drawings, 11 concepts (rotate-ccw-11 has two); the doc lists 11 names "(+1)" | bends counted as drawings |
| findings-primitives | §3.2, §6 | 589–590, 947 | filled check "worst +9.9% on check-2"; "by up to 10%" | among the doc's own eight rows +11.1% (check-4 2.391 → 2.657; check-2-small +10.9%, check-3 +10.2%); over every check with a filled bend +16.7% (check-4-small 2.427 → 2.833) | worst case read from one row |
| findings-primitives | §3.3 | 612 | "checkbox's endpoints are on the eighth grid; check-circle's are not" | checkbox's end x (5.375, 10.625) yes, end y (8.31, 6.319) no; check-circle's neither | partly true |
| findings-primitives | §3.4, §6 | 637, 899 | "17 concepts sharing 7 outline drawings" | 18 (2 + 2 + 2 + 4 × 3) | arithmetic (22 − 4) |
| findings-primitives | §4.1 | 658–662 | "body outer ink box 18.5 × 16.5, box[2.75, 3.75, 21.25, 20.25]" (and 20, 16) | those are the centreline boxes; outer ink 20 × 18 · 16 × 14 · 14 × 12 | column label (the card printed the centreline bbox) |
| findings-primitives | §4.3 | 741–742 | "users-2-level's ⌀8 at 24 and ⌀4.5 at 16 appear nowhere else" | ⌀8 at 24 is also user's and users-2's; users-2-level alone uses ⌀5.5 at 20 and ⌀4.5 at 16 | 20 column meant |
| findings-primitives | §5 | 858, 860–867 | 0.300–0.333 row "users-* ×5"; 16 filled list | 4 users pairs; the table omits paintbrush-3 vs -5 (0.2848; the 40 total holds); the filled list names 20 of 24 (omits paintbrush-3/-7 0.088, paintbrush-2/-5 0.230, pencil-3/-4 0.250, paintbrush-3/-5 0.302) | hand transcription |
| findings-primitives | §6 | 986 | "container ring — 41 outline and 40 filled concepts" | 40 outline (as §2.1 says) | wave 0's 41 left in |
| findings-primitives | §6, §7 | 926–927, 1018 | "⌀2.5 at 20 and ⌀2.375 at 16 are both legal" | ⌀2.375 at 16 needs r 0.5625, off the 0.125 grid (legal neighbours ⌀2.25, ⌀2.5); ⌀2.5 at 20 is legal | arithmetic |
| findings-primitives | §8 | 1051–1052 | shared-part persistence: "Two files that share a subpath exactly at one master must share it at all three … Today it catches exactly the three checkbox/check-circle pairs at 16" | two readings, both printed by s8. **(i) Per part** — the sentence's own reading ("share *it*", a part): a pair is caught when the number of parts it shares differs between masters: **243 outline / 178 filled** concept pairs (a count proxy; the closing check's part-by-part census gives 241 / 177). **(ii) Per pair** — shares something at one master and nothing at another: **209 / 139**, a stricter subset. Either way far more than 3; the 3 checkbox pairs are among both. Context: 1,570 / 1,070 pairs share a part exactly somewhere; 49 / 41 lose one part at a single master | never measured set-wide (no code in the transcript) |
| findings-corners | 1.1 | 44 | radii snapped "within 0.025" | the table reproduces only at **0.02**; at 0.025 the 24 row reads tier 3 **88**, on a tier **580 (94.0%)**, **11** distinct | recovered parameter differs: c2.mjs used 0.02; `heart`'s composite 0.7724 is 0.0224 from 0.75. §3.2 and §10a used 0.025, so `heart` is tier 3 there and off-tier in §1.1 / §4.2 |
| findings-corners | 1.1 | 53 | "the same at all three masters to within 3 points" | tier 1 spans **3.14** points (61.8 → 58.6) | rounding in the prose |
| findings-corners | 1.2 | 55, 63 | heading "all corners, all roles"; "second-commonest is tier 1 + half" | figures match only for the **container** role (c1.mjs filter); every role at 24 reads 0.75x535 · 2.5x529 · 1.5x448 · 3.25x395, so the second-commonest is 2.5 | label: the heading names the wrong population (values themselves 44/44) |
| findings-corners | 3 | 127 | 26 files say "detail radius" | **24 files**, 26 occurrences | occurrences (`grep -o … uniq -c`) reported as files |
| findings-corners | 3.2 | 159 | `watch` among the 89 tier-1-only cards | `watch` has **no container-role corner** at any master (absent from s3.2 and s10a); the members are `watch-2`, `watch-3` | family name used for its members |
| findings-corners | 4 | 216 | body curves "six at 20, six at 16" | **7 and 7** | hand count: `plug-6`'s single corner (r5.75 / r4.625), listed in §4.1's own table, left out |
| findings-corners | 4 | 219 | `message` 9.25 / 7.25 / 6.375 | `message` has 0.75 1.5 2.5 · 0.75 1.25 2 · 0.625 1 1.5 | the values are `message-3`'s and `message-5`'s (family shorthand or slip) |
| findings-corners | 5 | 277 | "Six concepts gain radii at 16" | **16** concepts have more distinct radii at 16 than at 24 (computed: the seven named, plus `alert-triangle` x4, `thumbs-up` x2, `wrench` x3); the sentence names 7 | count slip, and a hand-picked subset of a population of 16 |
| findings-corners | 8.3 | 444 | reflex: **10** concepts | **9 concepts**, 10 drawing names | `radii.mjs` lists names; `camera-5` and `camera-5-filled` are one concept |
| findings-corners | 11 | 734 | "26 files at 24" (C-7) | 24 files, 26 occurrences | as §3 |
| findings-corners | 11 | 747 | "Six concepts gain radii at 16" (C-15) | 16 (computed) | as §5 |
| findings-angles | §3.3, A-1, §7a.4 | 238, 624, 678 | 20/70 "held to within 0.08 degrees" | partly: 152 of the seven concepts' 162 segments sit within 0.08; the farthest is 0.25 (`cursor-click` at 20: 70.25 / 19.75; also 19.87 / 70.13 at 20) | no code computed it; the document's own table shows 70.25 |
| findings-angles | A-1 | 624 | "152 segments" in the seven 20/70 concepts | the seven carry **162** segments off by more than 2; **146** of them in §3.1's 20 and 70 bins; **152** within 0.08 of 20/70 | the bin sum 73 + 79 = 152 includes 6 `gear-3` segments, not one of the seven; 152 also equals the within-0.08 count — either way it is not "the seven's segments" |
| findings-angles | §5.2, A-6 | 348–350, 629 | three concepts (`search`, `-2`, `-3`) off axis in the filled file only | **four**: `help-4` too (16 filled, dev 2.29 — the document's own §6a row says "filled") | the section named the three it read rather than taking a census |
| findings-angles | §3.3 | 248 | `send` at 24: 70.01 / **19.97** / 20.03 / 19.99 | 70.01 / **69.97** / 20.03 / 19.99 / 70.00 / 20.00 | transcription slip: a3.mjs printed "1.83x5.02 = 69.97deg" |
| findings-angles | §3.3 | 259–260 | `watch`, `watch-3` measured 81.3–81.6, 8.4–8.7 from vertical | 81.1–81.6, 8.4–8.9 (`watch-3` at 24 is 81.05) | the range is `watch`'s alone |
| findings-angles | §3.4 | 279 | `star`, `gear-3`, `wand-2` land on 29.9–30.2 | `star` 29.90–30.02 and `wand-2` 30.03–30.19 hold; `gear-3` spans 29.54–30.26 | hand summary |
| findings-angles | §3.1 | 184 | the 60° row names `gear-3` | the 9 are `arrow-down-4` `arrow-up-4` `language` + six `sort-numeric-*`; `gear-3` sits at 59.7 and 60.1 | a3.mjs printed 8 names "+1"; the hidden ninth (`sort-numeric-descending`) was filled in by hand as `gear-3` |
| findings-angles | §6 | 374 | `users-4-wide` declares "eight" angles | nine distinct "°" figures (59.49 62.3 62.66 62.7 69.98 70 90 98 110) | hand count |
| findings-angles | §6.1 | 385 | `lightbulb-4` listed as silent | `lightbulb-4`'s 24 file states a degree figure (the document's own §6a says "yes") | grouping slip when the table was composed |
| findings-angles | §6.1 | 391 | `search-2` `search-3` max offset 0.728 | `search-3` is 0.742 | a grouped row quotes one sibling's value |
| findings-angles | A-3, §8 | 626, 700 | "0.03 px over a 6-unit leg" | 0.061 over the outline leg (5.962 x sin 0.583°), 0.047 over the filled leg | no code; 0.03 is half the computed displacement |
| findings-angles | A-5 | 628 | "0.14 px of drift" | 0.053 (5.407-unit wall x sin 0.561°) | no code |
| findings-angles | A-14 | 642 | "183 concepts declare degree figures" | 183 by the author's first two-spelling grep; 193 with all three spellings | stale: §6 was corrected to 193 (transcript toolu_01Ro8xpid9yRLPXsR9136ae4), A-14 was not |
| findings-angles | A-16 | 644 | `italic`'s 4.50 drift "the third-largest in the set" | fourth concept set-wide (`cursor-3` 5.46, `send` 5.46, `code` 5, `italic` 4.5); third among bare defaults and by distinct value | wording |
| findings-angles | A-17 | 650 | "2,464 segments (84%)" | 82.35% of the 2,992 off axis (94.30% of the 2,613 beyond 0.5) | no code |
| findings-angles | A-20 | 653 | "eight distinct run:rise ratios" | 12 (adds 3:8 4:1 7:2 8:3) | counted from a3.mjs's top-14 ratio list, not the full tally |
| findings-scaling | §1 | 21 | "280 of 287 keyline-held concepts sit on their own keyline **to within 0.005**" | 280 of 287 are on their keyline's *curve within 1 percentage point* (the measure that produced 280); exact within 0.005 at all three masters: **269 on lint's box** (the document's declared definition), **270 on exact geometry** (metrics-check.mjs's solved box) — the one drawing between them is `message-5` at 16, exactly 14.000 wide but read 13.99 by `geometry.bbox`'s arc sampling (the defect `s0` lists). `s1` and `s11` print both | the headline restates §2's 1 pp test as a 0.005 test |
| findings-scaling | §1 | 21 | "95.5% of all keyline-held drawings are exact **at every master**" | on lint's box 274/287 (95.5%) at 24, **273/288 (94.8%) at 20**, 275/288 (95.5%) at 16, pooled 95.2%; on the solved box 276/288 (95.8%) at 16, pooled 95.4% | the 24 figure (`s14_an5.mjs` Q) generalised to every master |
| findings-scaling | §3 | 137 | "57,126 coordinates in the 24 **outline** masters" | 57,126 is every number in every `d` of all **970** files at 24 (outline and filled) — the original's loop; outline files alone: 23,923, 31.9% / 48.1% | figure reproduces under the original code; the label is wrong |
| findings-scaling | §3 | 146-147 | "The rest are the plus / minus / x size families at factors **0.878** to 1.000" | the 16 are ban, ban-2, chart-pie-3 (0.784) + 12 plus/x files (0.879 to 1.000) + **`ban-filled` at 0.7999**, which is neither; lowest plus/x factor 0.8788 rounds to 0.879 | hand summary; 0.8788 truncated; ban-filled overlooked (minus files are scale-trivial and not in the 16) |
| findings-scaling | §10 | 383 | class 1 "Keyline-locked, whole" **155** | **146** (K A D without M) | no script produced 155/29; the appendix's own `holds` column gives 146 KAD + 38 KADM. Hand split |
| findings-scaling | §10 | 384 | class 2 "mark held too" **29** | **38** (K A D M) | as above |
| findings-scaling | §10 | 388 | class 6 examples "`building`, **`gear-3`, `sliders-2`**, `trash`" | gear-3 and sliders-2 hold aspect only — they are class 7 by the document's own key; class 6's 26 are listed by `s10` | hand-picked examples |
| findings-scaling | §10 / §11 | 390, 523 | `keyboard-2` "aspect drifts 19–22%" / "aspect drifting 19.0 / 19.0 / 22.5%" | keyboard 19.0%, **keyboard-2 4.2%** (20×18 / 16×15 / 14×13), watch 22.5% | keyboard-2 is not in the >12% `box:` list; 19.0 looks copied from `link-3` (the next row of that table) |
| findings-scaling | §10 | 405-414 | "The worst:" — filter 20.0, text 20.0, grid 15.0, map-pin 12.4, x 10.2, **play 7.3**pp | the spread list ranks `chevrons-up-down` **9.5pp**, `minus` **8.3pp** and `plus` **8.3pp** above `play`; every spread shown is right | a hand selection presented as the worst six (reviewer's correction 3) |
| findings-scaling | §10 / §11 | 397, 489 | microphone-5 "`box: 14x18` at 24" | the file declares **`box: 14x20`** (ink 14×20) | slip; already recorded by `exceptions-ledger.md:757` |
| findings-scaling | §11 | 495-496 | "Only 7 of 287 keyline-held concepts **use the slack at all**" | 7 are off their curve by > 1 pp; **18** keyline-held concepts are not exact (within 0.005) at some master on lint's box, **17** on the solved box (`message-5`) | the 1 pp count restated as a slack count |
| findings-scaling | §11 | 459 | "costs **two thirds of a pixel at 16** and a whole pixel at 20 **for a square-keyline icon**" | square against proportion: −1.00 px at 20, **0.00 px at 16**; the 0.67 px is the *circle's* (−0.67 at 20, +0.67 at 16) | no computation in the transcript; the probe prints both keylines so the sentence can be fixed |
| findings-scaling | §11 | 507 | "+15.0% median for the **other 128** marks" | all 136 marks +15.0% (the median the card computed); the 128 rising marks' median **+15.3%** | the 136-median reused for the 128 |
| findings-mass | §1 | 47 | "32 Bézier commands flattened to 32 chords each" | 33 Bézier command letters in the 188 measured Lucide files: 32 cubic (`C`/`c`) + 1 quadratic (`q`) | The original count (toolu_01WHjjTP6cnRvTnfMBPBed7f: `6 C`, `26 c`, `1 q`) was summed over the cubic letters only. The flattening itself handled all 33, so no ink or line figure moves; it is a wording slip. |
| findings-grid | §0 | 26 | "the filled twin of each of the eight outlines at 0.750, **and of the arrows**, is perfectly crisp (score 0.000 …)" | eight: 0.000; the 12 arrows: 0.000–0.001 (`arrow-up/-down/-left/-right` and their `-2` forms score 0.001; the `-3` forms 0.000) | wording rounds the arrows to 0.000; the document's own §3.3:216 and the §3.3 table state 0.000–0.001 |
| findings-grid | §3.4 | 241 | 24 on x.25 / x.75: **79.4%** | 79.5% (79.457%) | the document added the two rounded columns (39.6 + 39.8); the same quantity reads 79.5% at §0:25, §4.3:344 and G-6:369 (perfect at 2× is exactly the x.25 / x.75 share). The 20's 74.2% (74.242) is unaffected |
| findings-air | §2 | 85 | share of clear phases "is **g - 1**" | the doc's own values (1/8 at 1.0 … 8/8 at 1.875) reprint; the law they follow is g - 0.875 | formula off by one eighth (g = 1.0 gives 0, not the measured 1/8) |
| findings-air | §3a | 113 | "Identical at 24 and 20" (read as: the table above, at 16, is the same at 24 and 20) | 24 and 20 equal each other, but against the 16 table 7 of 9 rows: caps 0.096 / 0.256 and mouth 0.166 / 0.356 (at 1.5 / 1.0) against 0.089 / 0.23 and 0.145 / 0.311 at 16; floors identical | the curved situations depend on the stroke (1.5 at 24 and 20, 1.25 at 16) |
| findings-air | §3a | 119 | cap-to-cap "about **0.45x**" as dark | 0.46 at g = 1.0; 0.36 at g = 1.5 | an "about" figure with no recorded calculation; nearest measured ratio 0.46 |
| findings-air | §3d | 183 | 24 row: 0.625 column "8 (0.7%)", other 78 | 0.625: — (none); other 86 | the 24 master has no span at phase 0.625; the doc filed one of two 8-span buckets (phase 0.62, or phase 1.0) under 0.625 |
| findings-air | §4b | 234-235 | "Every disagreement is a case where the arithmetic says a whole pixel fits but that pixel is inked by something else" | 123 disagreements: 120 that way, 3 the other way (`database-2-filled`, `login-3-filled`, `login-filled` at 24 — the arithmetic says no whole pixel, the render finds one clear; each pixel inked by only 0.002-0.006) | the three sit within a hundredth of a whole pixel, where the 3-dp arithmetic and the rate-16 render part ways |
| findings-air | §4b | 259 | "nine times the delivery" | 64.0% / 5.3% = 12.16 times | arithmetic slip on the doc's own by-kind table |
| findings-air | §4c | 292 | book-2 "Phase 0.125/0.5" | phase 0 at 24 and 20, 0.5 at 16 (both its spans) | not recoverable; no span of book-2 has phase 0.125 |
| findings-air | §4c | 290-291 (and judged #13, l. 776-777) | book-2's ribbon "leaves **no white pixel at all**" (airMin = 1 at 24, 20, 16 — that part reprints) | the ribbon's own channel holds a pure-background pixel at every master (column 14 rows 4-7 at 24; 10 at 20; 8 at 16) | the airMin = 1 span is selfGap's reading at the top of the ribbon, which lies inside the cover's top stroke row; the ribbon's run below it is clear |
| findings-air | §4d | 305 | "**Six** drawings sit inside that window" | 11 drawings — the doc's own list names the same 11 | miscount of its own list |
| findings-air | §5 | 445 | "Every one of the 10 is at phase 0" | clear ones at phase 0 (×5), 0.96 (×2), 0.93, 0.74, and one diagonal | "phase 0" was read loosely; a wall at .96 with a 1.04 gap also reaches a whole pixel |
| findings-air | §5 | 445 | failures "at phase 0.19-0.87" | 0.14-0.87, plus 5 diagonal spans with no phase | `help-3` at 24 (phase 0.14) missed; diagonals not mentioned |
| findings-air | §6a | 454 | `attachment-4-filled` reads 0.297-0.313 | 0.141-0.313 | its facing-self span at 20 (airMin 0.141) left out of the range |
| findings-air | Part two | 520 | "The **48** crossings whose shorter leg falls between `reach` and `canvas/8` are flagged ambiguous" | 21 crossings have the shorter leg in that band; the census's `ambiguous` flag is set on 40 — every crossing whose shorter leg is under canvas/8, including 19 whose shorter leg is under reach (the knob bars of `sliders-2`, `sliders-4` outline and filled, and `gauge-filled` at 16). The probe prints all three counts | two things: (1) the 48 came from an intermediate run (K result of toolu_01B1ErXZw5WnBd57NKutDVrA: "total crosses 272 ambiguous 48") before the final stub fix (`watch-2`, `language`) turned crossings into T's; (2) `contact-census.mjs` sets the flag for any leg under canvas/8 (its code) while its comment and the document describe the band from reach (lines 748-750) |
| findings-air | §8 | 599 | "371 of its 377 junctions have an arc" (+ 2 package-3) | 375 of 377 (+ 2 package-3 = 377) | from intermediate runs where band 2 held 373 (K results of toolu_01Se7bb6p5ssmduLLpKLvXeD … toolu_01MLr478wtWj9mkdK4pBCJUN: "373 junctions, 371 involve … an arc"); the doc kept 371 beside the final 377 |
| findings-air | §8 | 610-611 | "Nothing stops short **or runs past** by more than half a stroke" | stops short: 0 of 65 beyond h (reprints); runs past: 4 of 32 beyond h (`at-sign-2-filled` 20 1.75 and 16 1.375, `at-sign-filled` 16 1.375 — tangential — and `language-filled` 16, 1.641 at 88°) | the claim was checked for T-short only |
| findings-air | §9 | 648 | at-sign approach angle "0.42-0.57°" | 0.47-0.57° | 0.42° belonged to `at-sign-2` at 24 in an intermediate run (K result of toolu_019p3C4vHcjeTkTU4WFCueXy), which the final run reads as a cross |
| findings-air | §10 | 666 | "Band 4 lives in **10** concept families" | band 4: 5 families; bands 3 and 4 together: 10 | the list that follows mixes band-3 concepts (`clipboard-2`, `plug-6`, `lock-3`, `store`, `thumbs-up-2`) into band 4 |
| findings-air | §10 | 666 | `lock-5` / `lock-6` (10) | 12 | not recoverable which run; K's earlier band-4 listing (result of toolu_01MLr478wtWj9mkdK4pBCJUN) is cut short in the transcript and shows 10 lock, 9 gauge, 29 of the 36 sort-alpha rows |
| findings-air | §10 | 667 | `gauge` (8) | 11 | as above |
| findings-air | Judged #21 | 811 | sort-alpha filled cuts "read 0.70–0.99" | cuts read 0.281-0.426 at 24, 0.715-0.809 at 20, 0.641-0.836 at 16; the sort-alpha spans reading 0.70 or darker (20, all masters) read 0.703-1 and include the outline pairs | the range quoted is the sort-alpha near-weld list (outline pairs included), not the cuts |
| findings-filled | §1 | 73 | "every value is half the master's weight step (0.5 · 0.25 · 0.375)" | 49 of 54 notes; the 16 notes on `grid-3` `grid-4` `more-horizontal` `more-vertical` `list-bullet-2` grow 0.25, not 0.375 | the document's own table (L68, L70) shows 0.25 at 16; the sentence generalised from 24 and 20 |
| findings-filled | §1 | 84 | every `chevron-*` = "four shapes × four directions × three sizes" | 36 = 3 shapes × 4 × 3, plus `chevrons-up-down` 1–4 | description slip: no single chevron has a `-4` |
| findings-filled | §1, §7 | 96, 637 | largest in the band 0.005 (`attachment-3/-4`) | 0.01 (0.0099) on `chevron-*-3` at 20 and `chevron-*-3-large` at 24 and 20, 12 pairs; the solved box agrees (0.009916) | an1.mjs printed only the first 40 band rows (alphabetical, `tiny.slice(0, 40)`); the maximum was read off that page |
| findings-filled | §2 | 109, 110 | concepts > 0.5°: 72; > 1°: 32 | 74; 33 (readings and pairs on the same rows reproduce) | no transcript command prints concepts above 0.1°; hand-derived |
| findings-filled | §2.2 | 172 | classic 1.97 at 24 "(65 … readings)" | 16 (20:1.35 ×18 and 16:1.35 ×16 reproduce) | 65 is 24:1.25's count on the same printed tally line — transcription slip |
| findings-filled | §2.2 | 173 | steep radii "reproduce exactly": 1.33 · 1.05 · 1.03–1.04 | the `-3` variant reads 1.3 / 1.33 / 1.34 at 24, 1.05 at 20, 1.03 / 1.04 / 1.05 at 16 (below the 2× cap) | the document named one value of a spread at 24 and dropped 1.05 at 16; not exact |
| findings-filled | §3.1, §7 | 230, 246, 656 | 97 corners on **37** concepts | 97 corners on **41** concepts (23 + 12 + 12, six shared) | 37 is an3.mjs's "LOOSER than derived by > 0.06: 88 \| concepts 37" — a different definition; the probe prints that line as a labelled diagnostic (88 / 37 reproduces) |
| findings-filled | §3.1 | 235 | the +0.125 row is "(outer)" | 62 outer + 7 inner (`archive` ×4, `thumbs-up` ×3) | the inline command grouped by signed delta, not by side |
| findings-filled | §3.2 | 260 | free-curve residue: 7 corners | 10 corners on 7 concepts | concept count written in the corner column; the 191 total only adds up with 10 |
| findings-filled | §3.3 | 271 | r0.75 at 16: — | 3 | an4.mjs printed the top 20 master:radius pairs only |
| findings-filled | §4.2, §7 | 311, 626 | "nine concepts" have an enclosed region under 1.5 | 18 (12 `sort-*` + `bold` `language` `megaphone-2` `save` `watch` `watch-2`) | hand count with an unstated grouping; no grouping of the table gives 9 |
| findings-filled | §4.3, §7 | 335, 640 | sixteen distinct widths at 16 | 15 (the document's own list at L354–355 has 15 values) | miscount |
| findings-filled | §4.3 | 339 (343, 346 …) | the 24 table's column is headed "files" (1.5: 98, 2: 67 …) | the counts are readings (enclosed regions): 1.5 = 98 readings on 65 files, 2 = 67 on 33, 2.5 = 33 on 30; the probe now prints both columns | an2.mjs's `n=` counted regions; the header mislabels it |
| findings-filled | §4.3 | 343 | `file` among 24's 1.5 enclosed cuts | `file-filled` has no enclosed region at any master | its 1.5 is facingGap's flap separation (L374), a different instrument |
| findings-filled | §4.3 | 358 | 38 at 20 and 29 at 16 "between or beyond" 1.5 / 2 / 2.5 | 78 and 95 (33 at 24 reproduces) | no producing command; against each master's own modes (1.5 · 1.75 · 2) it would be 53 and 45 — neither gives 38 / 29 |
| findings-filled | §4.3 | 368 | "at 16 no cut is thinner than 1.2× the line" | 20 readings thinner (the `sort-*`, `language`, `watch`, `watch-2`, `megaphone-2`, `save`, `bold` counters) | the claim ignored §4.2's sub-1.5 family |
| findings-filled | §5.2, §7 | 441, 638 | `globe` 1 → 9 pieces | `globe` 1 → 6 at all masters; `globe-2` is 1 → 9 | concept slip |
| findings-filled | §5.2 | 448 | `table`'s outline: one rectangle "with two rules through it" | 3 rules (two horizontal, one vertical) | file-reading slip |
| findings-filled | §5.2 | 450 | "the twelve interior corners are r0.5" | 20 (r3.25 ×4 reproduces; §3.3's `table` ×60 = 20 a master) | miscount |
| findings-filled | §5.3 | 457, 461 | 330 files / 110 concepts; "5 of 115 shape-filled concepts" | by the stated definition 1,011 / 337, of 342 shape-filled concepts | taken from inline `toolu_01L8RBm4…`'s "filled files with ≥ 2 area paths: 345 \| concepts 115" minus 15 / 5; the probe prints that line too, so 330 / 110 / 115 reprint only under that definition |
| findings-filled | §5.4 | 471 | `search` 9.00 → **8.00** at 20, **8.00** → 6.50 at 16 | 8.01 (the census reads 8.007; the probe also prints all 3-dp values) | hand-rounding slip (the same table rounds 4.085 to 4.09) |
| findings-filled | §5.4, §7 | 497, 636 | the punch is "one unit tighter … at all three masters" | 1 · 0.5 · 0.75 (20: 4.5 vs 4; 16: 4.0 vs 3.25) | measured at 24 only |
| findings-filled | §5.5, §7 | 530, 651 | `globe-2`'s outline "has four counters" | 9 enclosed regions | silh.mjs stored only the first four areas (`encA.slice(0, 4)`) and those four were counted |
| findings-filled | §6 | 597 | the flat chevron moves 0.157 px at 16 | 0.159 (the larger leg; the two legs read 0.154 and 0.159 at 3 dp) | no producing command. 0.157 is the mean of the two **3-dp** legs (0.1565, rounded half-up); the mean of the unrounded legs is 0.156 (fresh reviewer). Either way it is an average of two legs, where §2.1 and the 0.236 at 24 report the single largest reading — a definition switch, so the probe keeps the largest and does not print the mean |
| findings-filled | §6 | 599 | `search-3` "at 0.50" is over half a pixel | 0.495 (§2.1's own row 135); the count of 8 reproduces | listing slip |
| findings-grammar | §1.5 | 267 | 349 not approved = 348 `[ ]` + `thumbs-down` `[~]` | 349 = 349 `[ ]` + 0 `[~]` | the card read the live working-tree sheet (the drawing session had `thumbs-down` in review); the pin's `research/queue.md` has it `[ ]`. 349 holds |
| findings-grammar | §2.3 | 435; §3 · 529; §5 · 657 | nine parts, **30** concepts | **38** (door 6 · star 3 · check 6 · knob 3 · hook 2 · cradle 3 · shackle 2 · arrowhead 2 · container 11) | a hand sum (reviewer: 6+3+6+3+2+3+2+2+3). The door row counts every carrier; the container row counts only its three late frames. One rule (a concept counts when its part is one drawing with another carrier's at one master and not at another) gives the container 11 |
| findings-grammar | §2.3 | 436-438; §3 · 530-531; §5 · 657 | largest residual the shackle's 0.625 u (0.42 px), then 0.556, 0.5; the rest 0.106–0.333 | against each part's main drawing, largest first: microphone-5's cradle at 24 **1.008** (0.67 px), the shackle 0.625, refresh-3's head **0.593** at 16, the frames 0.556, building's door 0.5, refresh-3's head **0.395** at 20 (inside the card's own 0.417 band), the knob 0.333 … | the document does not count microphone-5 as carrying the cradle at 24 or refresh-3's head as the same part at 20/16 ("—", "its own") — a reading of which carriers count, not coded |
| findings-grammar | §1.1 | 129 | `sort-alpha-descending-3` air at 24: **3.51** | **3.50** (3.5046) | the filled twin's 3.5079 (or a half-up rounding) in the outline cell |
| findings-grammar | §1.2 | 171, 172; §1.8 · 349 | external-link / -2 shaft at 20: **9.24** | **9.235** at 3 dp, 9.23 at 2 dp (9.2348) | double rounding — 3 dp first, then half-up |
| findings-grammar | §1.3 | 205 | ban's bar centreline at 16: **12.74** | **12.748** (12.75) | `verify.mjs` multiplied a 2-dp bbox (9.01) by √2 |
| findings-grammar | §1.3 | 207, 211; §1.6 · 306; §3 · 546 | volume-off's filled channel **1.5 · 1.5** · 1.25 | **1.513 · 1.513** · 1.25 (narrowest white between the two solids) | the document states the construction (the bar's own width); the file's 2-dp coordinates leave it 0.013 wider at 24 and 20 |
| findings-grammar | §1.3 | 205, 211; §1.6 · 306; §3 · 546 | ban-2's filled cut **2** · 1.75 · 1.75 | **2.01** (2.008) · 1.75 · 1.75 (between the slot's straight edges) | C21/C18's medium cut is 2 by rule (cited); the drawn slot is 0.008 wider at 24. Its tip reaches 8.5 · 6.43 · 5.43 from the centre (C21 says 8.5 · 6.5 · 5.5) |
| findings-grammar | §2.4 | 456 | the arrowhead in 16 composites: "yes — exact" | exact at 24 in 16 of 16; at 20 and 16 in 15 — `code-2`'s pair is arrow-left/right's head at 24 only | read at 24 (Part A's derived list shows `code-2` at 24 only) |
| findings-grammar | §0 | 102-104 | "0 of the 694 non-trivial parts **without an exact twin** gained a near match" | 694 is every non-trivial part asked (184 exact twin, 49 mirror twin, **461** neither); 0 missed holds | `recheck.mjs` D2 incremented its counter before the exact test |
| findings-grammar | §2.3 | 443-444; §3 · 530; §6 · 678 | **7** body pairs identical at some masters only | **22** (adds cart/cart-3, sliders/-3, sliders-3/-5, microphone-2/-5, five sort pairs, six users pairs) | a hand selection from the family census; cart and sliders are §2.3's own rows, yet microphone/-2 (also a §2.3 row) is kept |
| findings-grammar | §2.2 | 394-395, 412 | "every body-to-body near miss in the 96 families" — 14 rows; `list-bullet` at 16 only | classify also reports paintbrush-4~2 and -2~7 @24, -4~7 and -4~3 @20, pencil-3~pencil @20/16, users-4 ×2 @20 (printed under the table), and `list-bullet` @24 0.5 (printed in the table's own row, which reads `24 / 16` against the document's `16`) | a hand selection |
| findings-grammar | §2.1 | 379-383 | all but one **12 / 48**; different in every member **42 / 137** | by the card's own code (verify.mjs's order, the source l. 375 names): **24 / 72** and **30 / 113**; the document's split only after moving 12 two-member families by hand | the author moved the 12 pairs after verify.mjs ran (its own log shows 0 pairs in that row). The probe prints both splits; the order is the card's |
| findings-grammar | §2.2 | 407 | `database`'s cylinder redrawn "0.5 · — · 0.25" shorter | **0.5 · 0.5 · 0.25** (reviewer agrees) — at 20 the 0.5 residual is outside the 0.417 band, which is why the table has no 20 row, but the cylinder is still 0.5 shorter | the "—" read the missing near-miss row as "no difference" |
| findings-grammar | §1.1 | 146; 134 | air at 24 "1.6 … 3, 3.99 …"; rays "2.5 · 2 · 1.5" | adds 3.01 (`wand-3`); the diagonal ray at 20 is 1.99 | minor omissions |
| rule-register §E1 / stale §3b.3 |  | rule-register.md:228, stale-statements.md:319 | "three drawings mix radii inside one container" | 5 drawings: `book`, `book-2`, `book-3` [1.5, 1.5, 2, 1.5], `lock-6`, `wallet-3` | the same sentence lists all five; "three" counts the three radius patterns, not drawings |
| rule-register §E1 / stale §3b.3 |  | rule-register.md:221, stale-statements.md:319 | "four off-quarter values" | three: 0.772 (heart), 0.805 (shield, shield-2), 1.727 (wrench, wrench-2) — D's own output lists three | a miscount in the prose |
| rule-register §E4 |  | rule-register.md:235 | "The 38 extra at 16" | 37 off-angle at 16 and not at 24 (157 − 121 = 36 net); 38 is off-angle at 20 **or** 16 and not at 24 | D's label (`ab0292.handback.md:90`) |
| stale §6 |  | stale-statements.md:469 | "3 that mix radii inside one drawing" | 5 drawings in 3 radius patterns | the third instance of the five-drawing claim |
| enforcement §6 row 15 / stale §2.20 |  | enforcement-gap.md:370, stale-statements.md:163 | "45 entries (15 concepts × 3 masters)" / "15 concepts, 45 published entries" | 45 entries, 15 names, **12 concepts** (filled twins counted apart) | names counted as concepts |
| rule-register §F8 / stale §3b.2 |  | rule-register.md:270, stale-statements.md:318 | at 24 and 20 "the other three leave 8 to 28" fully clear pixels | with raster.mjs's `classify` defect bypassed: `plus-circle` leaves **0** at 20 (x 12, minus 12; 24: x 16, plus 28, minus 20); 8 only as raster.mjs ships | instrument defect (`raster.mjs:257`): D used `rasterise` unpatched on area paths; the horizontal edges of the plus cut were dropped from the straddle test |
| rule-register §F8 / stale §3b.2 |  | same lines | at 16 "check 4, x 8, plus 4, minus 8" | check 4, x 8, **plus 0**, minus 8 (bypassed); plus 4 as shipped | same defect. With it fixed, plus-circle leaves no fully clear pixel at 20 or 16 (check-circle: 0 at 24 and 20, 4 at 16) — so check-circle is not the only swap partner that fills in, and the F8 / 3b.2 argument needs restating |
| enforcement §2.3 / severity §5 |  | enforcement-gap.md:129, severity-proposal.md:145 | "Delete `src/icons/16` and lint reports 1,940 drawings, all clean, exit 0" | 1,940 drawings · 1,903 clean · **37 warned** · 0 failed, exit 0 | never run: no transcript holds it (inferred). The sort-alpha warnings at 24 and 20 and sort-numeric / trash at 20 remain. 1,940 and exit 0 reproduce |
| stale §2.1 |  | stale-statements.md:144 | "485 done, 348 todo, 1 in review (`thumbs-down`)" | at the pin: 485 done, **349 todo, 0 in review** | measured on the working tree (S1: "At HEAD … 349 are [ ]"); the pin's sheet has thumbs-down not started |
| stale §2.6 |  | stale-statements.md:149 | "57 concepts / 338 files, in 57 distinct size strings" | 59 distinct strings over the files; 26 distinct 24·20·16 triples over the 57 concepts | S1 measured 59 strings; "57 distinct" repeats the concept count |
| stale §3.4, §3.8 |  | stale-statements.md:301, :305 | "`templates/` does not exist" | `templates/grid-24.svg` exists at the pin (`git ls-tree 5933041 -- templates`) | not measured; S1 reported "File exists" |
| stale §4.3 |  | stale-statements.md:399 | §5x labels at "`lint.mjs:96, 133-137, 230, 242, 448, 470, 478`" | lines naming §5…§5f: 96, 133, 134, 137, 230, 242, 478; the 5b–5f headers sit at 407, 442, 469, 504, 517 | hand-picked lines; 448 and 470 are a few lines inside the 5c and 5f blocks (headers 442, 469) and name no §5x |
| references-fluent | §2 | 120 | `Arrow Circle Down/Up` 50.3–50.7% at 16–48 | instrument-exposed (geometry.mjs cubic sampling): sampled 49.7–50.7% (48 reads 49.68%); true 49.4–50.0% | an4 5c printed 49.68% at 48; the range was read off the row leaving 48 out |
| references-fluent | §2 | 121 | circle keyline "from 9 circle-container concepts" | 10 of an4's list read 10·14·16·20·24·28·40 at all seven sizes (Add, Dismiss, Subtract, Question, Chevron, Arrow ×4, Record) | hand count; no code counted 9 (§4 itself names 11) |
| references-fluent | §2 | 122 | separation in own line at 28: 0.98× | instrument-exposed (geometry.mjs cubic sampling): sampled 1.00× (1.50 / 1.5); true 1.00× (row 1.00 · 1.00 · 1.00 · 0.68 · 1.00 · 0.76 · 0.99) | left over from the first draft's 1.47 (the Filled twin's median); the value was corrected to 1.50 (`01CsnHuS8yJUfwV5qc5SMLUp`), its ratio was not |
| references-fluent | §2 | 128 | filled box "shrinks in 3–12%" | instrument-exposed (geometry.mjs cubic sampling): sampled 2.8–6.9%; true 1.9–5.3% | 12 is the shrink **count** at 24 (counts 3 · 7 · 7 · 12 · 6 · 10 · 5), read as a percent |
| references-fluent | §5 | 236 | min-margin canvas share: ours 1.3–2.0× theirs | 1.50–2.00× (12.5/8.33, 15.0/10.0, 12.5/6.25) | arithmetic slip; no script printed this ratio |
| references-fluent | §5 | 250 | "our tightest corner is 2–2.5× theirs" | 2.0–3.0× (at 20: 1.50 against 0.50) | the 20 column was missed; §8 item 3's "two and a half times" is at 16 only and reprints |
| references-fluent | §6 | 317 | T5: 16 named margin-zero badge compounds at 16/20/24 | 20 concepts; all 16 present, plus Slide Add, Vehicle Truck Checkmark, Video Person Clock, Window Wrench | an5 6a printed only the first 14 names at 16 ("…"); the 16 are exactly the printed union |
| references-fluent | §6 | 348 | R3: "the bottom decile runs 0.09–0.31" | instrument-exposed (geometry.mjs cubic sampling): pooled separation (n = 1,124) bottom decile sampled 0.07–0.39, true 0.07–1.00 | 0.09–0.31 is the range of an6 7b's first 24 printed readings (it includes Cloud Sync at 24, 0.31); over the document's ten named pairs it is 0.09–0.24 |
| references-fluent | §6 | 349 | R3: "the same value appears in both the outline and the filled twin" | instrument-exposed (geometry.mjs cubic sampling): on the document's ten (concept, size) pairs, sampled 4 of 10 agree within 0.02 (Document Error and Document Sync at 24 read 0.22 against 0.40; Archive Clock, Comment Add, Folder Add at 28 differ by 0.04–0.06; Earth Leaf at 32 0.24 against 0.31); **true geometry 10 of 10 (1.00 in nine, 1.50 at Earth Leaf 32)** | an6 7b printed only the first 24 readings; and the readings themselves are control points (the closing check: 13 of 13 badge concepts at about 1.00) |
| references-fluent | §7 | 409 | K3: "in absolute units … 1.5×" | instrument-exposed (geometry.mjs cubic sampling): sampled 1.58× at 16 (1.50 / 0.95); true 1.50× (1.50 / 1.00), while the 1.26× beside it becomes 1.20× | rounded from the nominal 1 unit, not the measured 0.95 at 16 |
| references-fluent | §8 | 458 | "reading 12 points smaller" | 12.5 points (87.5% against 75.0% at 16) — 13 at the document's precision | rounded down here; the document rounds the same 12.5 up in §5 L240 ("8–13"). Found by the fresh reviewer |
| references-sf | §3.3 | 366 | our `check-circle` carries a **10.27**-wide check | **10.28** (mark path's ink box at 24: 16.39 − 7.61 + 1.5) | the document quotes the drawing's own comment ("check 10.27 · 7.81 · 6.58 wide"); the drawing measures 10.28 |
| references-sf | §2.1 | 177 | 1,723 (93.6%) bases have a derivative with a fill token; 118 none | 1,723 (93.6%), 118 — **reprints**, but only with "a fill token anywhere in the derivative's name"; the card's own role parser over `<base>.<suffix>` suffixes (`sf_grammar.py`) gives 1,712 (93.0%), 129 | the producing code was not found in the transcript; the probe prints both definitions. A definitional note, not a mismatch |
| references-sf | §3.8 | 490 | the Black badge disc **1,089** | **1,090** — all seven Black glyph badges in `sf/deep.json` hold 1,090 (the dot 678); the closing check's own fontTools read of the outline gives every disc as exactly 1,090.00 × 1,090.00 units (946 at wght 1, 1,016 at 400) | probe right, document wrong: 1,089 is 0.532 em × 2,048 = 1,089.5 rounded down by hand, not the record or the outline |
| references-sf | §3.8 | 492 | the slash bar ×**4.2** across the weights | **definitional, not a miss**: the probe prints both — ×4.3 on median bars (182.4 ÷ 42.4 = 4.30) and ×4.2 on mean bars (182.68 ÷ 43.0 = 4.25); range midpoints give 4.24 | the document's table prints ranges, so its 4.2 is the mean / midpoint reading; the font outline sits on the rounding edge (median 4.246, mean 4.273) |
| references-sf | §3.8 | 488 (format) | slash air at wght 1: "82.0 · **2.1**" strokes | 82.0 · **2.06** — the probe prints the column's 2 dp (0.71 and 0.43 below it) | the document dropped a digit on this one cell; same figure. Listed, not changed |
| references-sf | check (b) | 107 and §7 · 734 | "a clear ring of 5.713 per 100 em" | 5.713 is the ring **down** (= halo radius 25.39 − disc radius 19.68); the median outline-to-outline offset of the same template is **5.703** | two definitions under one number; §3.7's "5.69 – 5.71 (median offset)" range holds for both. Reprints; flagged for wave 5 |
| references-nucleo | short answer | 33; §4.3 · 340, 342 (×2) | Core 32's stroke is **6.3%** of the canvas | **6.2%** | 2 ÷ 32 = 6.25 exactly; the document rounds the tie up, the probe (python's format) to even |
| references-nucleo | §3 | 248; §4.1 · 282; §5 · 433 | Core 24 → 48 air floor ×**1.82** | ×**1.81** (median 1.8147) | double rounding: the card's script printed 3 dp (1.815), the document rounded that up |
| references-nucleo | §1 | 134, 135, 160 | ours: outer edge on whole pixels **70%** at 24 and 20; "70 – 76% of ours" | **69%** (337 of 485 = 69.48%) | double rounding: the script printed 69.5 (1 dp), the document wrote 70 |
| references-nucleo | §1 | 130, 131 (format) | "12.5%", "10.0%" | now printed "12.5%", "10.0%" (were "12.50%", "10.00%") | fixed: Nucleo rows drop one trailing zero as the document does; our rows keep 2 dp (7.50%) as the document does |
| references-nucleo | §8 | 537 and SF §3.1 · 303 (format) | "100%" | now printed "100%" (was "100.0%") | fixed |
| references-nucleo | §2 | 177 (editorial) | Sharp 24: five cells "—" | the probe prints 9.0 · 53.8% · 7 · 4.50 · 37.5% | the document blanked a 26-corner row by hand; the counts it does print (26, 99.4%, 96%) match. Listed, not changed |
| references-nucleo | short answer | 33 (order) | "rises 8.3 → 12.5% in UI" | now printed "rises 8.3 → 12.5% in UI (18 → 12)" (was "12.5 → 8.3%", which read as a fall); the trend word is derived from the values | fixed |
| references-nucleo | short answer | 49 | the bigger grid carries fewer parts in 3 – **5**% | 3 – **4**% (2.8 · 4.5 · 3.8 · 3.6 at 1 dp; Core 32 → 48 is 4.46%) | double rounding of the table's 4.5% |
| references-nucleo | §8 | 542 | Core 48 modal quarter-turn radius on **42%** of 2,518 corners | **41%** (0.4146) | double rounding: the script printed 0.415 |
| references-nucleo | §8 | 543 | UI 18: 53% of **2,371** corners | 53% of **2,370** | the JS port differs from svgpathtools on four drawings, 12 values in all (reviewer's dumps): UI 18 id 11211 (set 37) path 5, a cubic whose end control point equals its end point — svgpathtools reads the turn as 90° and counts a 2.5 corner, the port's fallback tangent (end − first control) reads ≈74° and drops it; UI 18 ids 7905 and 22404 and UI 12 id 11964 have a radius of exactly 1.375 (r × 4 = 5.5), a float tie the two round differently. No modal share moves; the UI 18 count does. Core 24 / 32 / 48 agree exactly |
| references-untitled | Untitled §11 | `references-untitled.md:259-260` | "a pair whose left and right edges each move **0.007** in opposite directions" | `laptop-01`: left −0.0078, right +0.0073 on the path box (−0.0076 / +0.0065 on the render bounds). Four other pairs also hold the side test and break the width test: `wallet-01` (−0.0054/+0.0051), `columns-03`, `rows-03` (∓0.0093/±0.0092), `car-01` (bottom +0.0096, path box only) | hand-written from a 3-dp print (`−0.008`, `+0.007`) in the author's run; the example exists, its "each 0.007" is a rounding of 0.0078 down. `UPR s11` |

### Notes the builders attached to these lists

**findings-primitives.md** — Did not reproduce

Withdrawn after review (the reviewer's disputes, upheld): §3.2 doc:564 "0.643" — 10.28 / 16 = 0.6425 rounds
half-up to 0.643; the earlier 0.642 was `toFixed`'s binary-float artefact, now fixed in the probe (`hu`), so the
document is right. §7 doc:1020 "0.52 … at 16 against 0.70 at 24" — loose wording, both values exist (x 0.524 at
16, plus 0.700 at 24); s7 prints both marks.

Minor, not counted: §2.7 quotes the rotate-ccw comparison as "not the same structure"; the instrument's
reason is "no correspondence within the pairing bound" (residual ∞ either way). §2.5 "right to 0.004 at 24
and 20" — the 20 difference is 0.0045. §1.4 "96%" is 96.2% rounded. Corrections table: the document already
states both corrected claims (band artefact 361 / 287 / 308; ban-3 vs x-small a coincidence); the probe
prints the measured values (s5, s2.5) and they agree.

**findings-corners.md** — Did not reproduce

Reproduces on one reading only (counted as matched): §11:737 "75 distinct typed `rx` values across all outline files" (C-10) — reproduces read as the 24 master (75, also the 16's), which the clause before ("at 24") supports; across all three masters it is 157 (s11).

Corrections table: §2 already states the corrected "three different laws" and s2 prints them; §1.3 already states 117–165 (the `moon` correction) and s1.3 prints both. §5's opening words "The tiers scale." (L247) read against the "scale cleanly" correction but carry no figure. Wave-5 reconcile: s1.1 prints **61.8 · 61.4 · 58.6%** with its definition (tier-1 count over outline stroked container fillets, snapped within 0.02, role from `radiiOf`).

**findings-angles.md** — Did not reproduce

Omissions, not wrong figures: §3.1 (line 196) skips the 68.9° row (24 segments, the `sort-alpha` family), which ranks
inside the table's span; §3.2's ratio table (line 227) is a3.mjs's `slice(0, 14)`, cut inside a tie — 7:2, 4:3, 4:1,
3:8 and 8:3 also carry 8 segments. A-17 (line 650) writes ratios rise:run ("26.57 (1:2)") where §3.2 writes
run:rise ("2:1 → 26.57"), except "33.69 (3:2)", which matches §3.2 — a notation inconsistency, not a measurement.
None of the plan's Corrections rows or Known instrument defects touches this document.

**findings-scaling.md** — Did not reproduce — 13 claims

Settled-correction check: none of this document's figures is in the plan's Corrections table. The near-miss
correction ("361 → 378 → 545") and the radius-law correction are other cards' and do not touch a figure here.

**findings-mass.md** — Did not reproduce

Reproduces, with a wording nuance worth knowing (not counted as failures):
- L39 / L476 "a `minus` … is the densest icon in the set (98%)": the single densest is `24/minus-large` (98.2%), then
  `16/minus-large`, `20/minus-large`; `minus` itself is 98% at every master. True of the minus family, as worded.
- L20 names `globe-2` alone as the heaviest 16 outline; `language-3` is the same drawing and ties (the census table, L123,
  names `language-3`). The probe prints both.
- L366 lists the "other 18" drawings at 0.85–0.88 by family; the count is right, and the summary does not name
  `sort-numeric-ascending-2` (the probe lists all 18).
- §6 pair order inside a pair (`info` / `alert-circle` against the probe's `alert-circle` / `info`) follows the original
  run's shard order; cosines and pairs are the same.

**findings-grid.md** — Did not reproduce

No figure in this document is touched by a correction in the plan's Corrections table.

**findings-air.md** — Did not reproduce

For wave 5's reconcile item (`trash`'s two warnings; C22 / `docs/09:31` say false positive, this document says genuine
near-misses), the probe prints only measurements (`s7`): tab (path 2) to can (path 3) edge gap 1.493 at 24, 0.994 at 20,
0.745 at 16, every one a diagonal span with airMin 1 (no pixel lighter than ink in the air); lint warns at 20 and 16
("paths 2/3 are 2.49 apart … edge gap 0.99", "2 apart … 0.75"). `s11` prints the lid tip to can start: 1.5 apart with
reach 1.5 at 24, 1.0 apart at 20 and 16 (cap overlap 0.5 / 0.25). No verdict is printed.

**findings-grammar.md** — Did not reproduce

**b2 and b11 are definitional.** The document's 30 and 7 and the probe's 38 and 22 count under different definitions;
wave 5 should carry both readings, each with its definition, not call the document's a mistake.

**rule-register.md · enforcement-gap.md · stale-statements.md · severity-proposal.md** — Did not reproduce

**Moved out of (b) on review:** "the largest pure line run is still 3 (`menu`, `list-bullet`)" (rule-register.md:268, stale:320) reproduces under the document's own definition (whole subpaths that are one straight segment — the same paragraph puts chart-bar-3's L among the open strokes): 3, menu and list-bullet among them (31 concepts at 3 by `pureLineStack`, which keeps D's cluster rules; the reviewer's independent script finds 25). Counting any open subpath, chart-bar-3 reaches 4; both lines are printed.

**(b2) Reprints, but under another definition or label** (counted as reproduced; worth one word in the document):

- rule-register.md:146 C-1 "**827** outline files per master at the stated weight" — 827 = files whose root stroke is the
  outline weight (485 outline + 342 shape-filled); there are 485 outline files per master. S1 flagged the plan's same "827 outline files".
- stale-statements.md:212 "59/59 at 24, 64/64 at 20, 69/69 at 16 … narrowest cut under 3" — true by construction:
  `facingGap` drops readings at or above its 1.75 cap (enforcement-gap §5 row 16). With the cap at 3: 93/109 · 111/114 · 111/113.
- stale-statements.md:228 "`compass-3` 1.5" — the 16 reading (S2 read 16 only); 1.49 at 24 and 20.
- enforcement §6 row 10 / stale §4.3 — every line the documents list reproduces, but the lists are incomplete: also
  `docs/01:335`, `docs/07:59, 62`, `plans/facing-gap.md:3, 5, 24, 40, 132`, `plans/stroke-16.md:130` (the Corrections
  table names docs/01 and 07).
- For wave 5 (reconcile, never pick): the 16 filled corners — these documents' 45 pairs in 12 concepts (D's vertex
  matching, `c16c.mjs`) against the plan's "now 13 concepts / 50 corners"; the off-centre count — these documents' 164
  (lint's 2 dp headline after the declared shift, larger axis, > 0.01, 2,880 non-anchored) is a third definition beside
  card 1.12's 177 and card 1.11's 166; "keeps one ink box" — stale §2b.5 / §4.1's 53 of 107 at 24 (lint's 2 dp headline
  sizes, stem = name minus a trailing number) is the plan's "53 within lint's ±0.01" reading; SF Symbols' 2,664
  (stale-statements.md:197, `names.json` (name, name.fill) pairs) against the app's 2,906 / 2,508.

**references-fluent.md** — Did not reproduce

Notes that are not numeric misses:
1. Instruments, lines 80–83: the zero-area leftovers (`Eye` 0.00, `Window Wrench` 0.03, `Hand` 0.09 ×2) are
   described as among the 53 excluded. The card's filter (a death is plausible under 6 strokes) **keeps them inside
   the 75**; the 53 are the parts 6 strokes or thicker. §3 line 154 ("the 23 at 20 and above are dominated by the
   zero-area leftovers") agrees with the code and contradicts lines 80–83. The numbers 53 / 75 / 128 reprint.
2. §5 line 251, "largest common contour corner", was read by eye off an7's top-7 list. The probe states a rule that
   reproduces both sides (the largest step holding ≥ 5% of corners, `HAND_READ_MIN_SHARE`) and labels the row
   HAND-READ; it also prints the top-7 lists the reading came from.
3. §6 line 300, T3's "1 : 0.6–0.78": the low end is 0.56 (at 32); it matches at the document's 1 dp.
4. §3 line 184, "Fluent will push to 0.75 strokes", is the p25 of the 75 plausible deaths (an5 6e) and also the
   named table's minimum; the probe prints the p25.
5. The short answer's "0 of 2,910 at the canvas edge / past the keyline": an5 and an8 measured outline drawings
   only; the probe counts both styles (still 0).

**references-central.md · references-untitled.md** — Did not reproduce

Nothing else moved. Every figure the late python patches (21:36–21:44) introduced or changed was checked against
the tool output: Central's 6,198 / 38.8 / 60.1 / 1.33 / 5.25, the length normalisation, the 3e exemplars, 2,470 /
3,728, the 1,464 / 1,885 changing sides, 334 / 390, 12.8 / 5.8 / 5.5 / 2.2 / 2.3, 1,831, cross-large 15 of 15 and
0.46, the tolerance-stability ranges, the off-axis weights, the independent check, 18 tests; Untitled's 606 (IC),
the 139 sides by side, 58 / 2 / 2 / 141, 264 (300), 573 / 4,680 and 935 / 5,820, the pen-tool split, the §5
group descriptions, the 18 concepts at all three masters, 1.39 / 1.85 / 1.92, 43 of 83. All reprint.

**Reading notes for wave 5 (the figure reproduces; the sentence around it may mislead):**
- Central §11:313 "two `images-4` in one group" — true, and one of **six** names that repeat inside a group
  (`prompt`, `arrow-split-down`, `console-simple`, `studio-display`, `arrows-all-sides-2`, `images-4`; CP `s11`).
- Central §7:246 "the other 22 have none (the list includes hands, medals and 3D boxes)" — the medals and two of
  the five hands are among the 22; the four 3D boxes and three hands are among the 59 slanted-ended (CP `s7`).
- Untitled §1:47 / §11:256 heart-hand: the NaN sits in its **solid** drawing (1 of 4 paths), and the ingest
  dropped that whole solid record — which is why heart-hand is outline-only — not one path of the outline (UPR `s1`).
- Central §7:232 "334 of 390 (85.6%)" is measured on Figma's render bounds (x, y, width, height). On the verified
  path boxes the card itself trusts, the same sample gives 303 of 357 (CP `s7`).
- Untitled §11:258 "Re-run the harness's way … 1,084 comes back exactly": it does, on 1,172 pairs (help-octagon's
  two outlines both counted); `figma.mjs summary` says 1,171 pairs. On the 1,170 clean pairs the harness's
  x/y/width/height test gives 1,083 (render bounds) or 1,082 (path box) (UPR `s11`).

## 5. Every figure that could not be recovered

Each row says why it cannot be reprinted today and what would be needed. 53 rows.

| document | § | line | figure | why | what would be needed |
|---|---|---|---|---|---|
| findings-corners | 2 | 117 | IBM / Salesforce / Material at radius = stroke | [not reprintable: cited from the brief's wave-0 measurement] | the reference card's own figure |
| findings-corners | 4 | 221 | "11 concepts" with genuine intermediate radii | [not reprintable: hand grouping; the rows reprint, no rule gives 11] | a stated rule for "genuine intermediate" |
| findings-corners | 4 | 229 | `wand-2` in the container-role table | [not reprintable: `wand-2` has no container-role corner; its 1 / 1 / 0.75 are detail-role (s5 prints them)] | the author's intent for the row |
| findings-corners | 5 | 258–259 | 42 body-curve / 32 real-decision split of the 74 | [not reprintable: hand classification (the table names 34)] | a rule separating body curves from corners |
| findings-corners | 7.1 | 368 | 69 corners in 23 concepts | [not reprintable: cited from card 1.8] | `findings-filled.md`'s probe |
| findings-corners | 7.2 | 373 | "every concept the statistics flagged … all nine" | `[not reprintable: hand selection]` — nearest flags 18, modal 20, literal containment 147 concepts; all three together flag 8 different ones (`calendar-2` `file` `file-text` `file-text-2` `folder` `folder-2` `folder-3` `thumbs-up-2`, s7.2). The nine rows' literal values do reprint | the rule that picked the nine |
| findings-corners | 11 / 11a | 723, 777 | "7 concepts at r1 / 1 / 0.75" | [not reprintable: hand-curated group] | a stated membership rule |
| findings-angles | A-3, §8 | 626, 700 | 0.03 px | [not reprintable: no code in either transcript; the natural computation gives 0.061] | the author's intended definition (half the end shift? the shift at the bend?) |
| findings-angles | A-5 | 628 | 0.14 px | [not reprintable: no code; natural computation 0.053] | same |
| findings-angles | A-17 | 650 | 84% | [not reprintable: no code; no denominator found that gives 84%] | the intended denominator |
| findings-angles | §3.3, A-1, §7a | 238, 624, 678 | 0.08 degrees | [not reprintable: no code; now partly reprintable — 152 of 162 segments sit within it, the spread is 0.25] | the author's intended population |
| findings-scaling | §10 | 383-384 | 155 / 29 (class 1 / class 2) | [not reprintable: no script or inline command in the transcript produces them; the computed split is 146 / 38] | nothing — the probe prints the computed split; listed in (b) for wave 5 |
| findings-scaling | §11 | 459 | "two thirds of a pixel at 16" | [not reprintable: stated without a computation] | nothing — the probe prints both keylines against proportion |
| findings-scaling | header | 4 | lint 2,910 · 2,848 · 62 · 0 | [not reprintable: measured by lint, not by this card's code] | reprinted by `cd $P && node tools/lint.mjs` |
| findings-scaling | §8 | 350 | 1.87° on `check-circle-small` | [not reprintable: cited from `plans/stroke-16.md`] | — (cited) |
| findings-scaling | §5 | 245-247 | play's "16x18 · 12x13 · 10x11", "60.8° · 58.7° · 59.7°" | [not reprintable: quoted from the file's own comment] | — (cited; `s5` prints the comment from the pin) |
| findings-mass | method | 11 | Chromium cross-check on 122 drawings: median −0.7%, p5–p95 −4.2…+2.2%, worst −8.8% on `16/x`; mean pixel 0.008, worst 0.31 | [not reprintable: a browser render (`drawImage` + `getImageData` in the session's browser pane); the sample's make-up (122 = 41·40·41) does reprint] | a headless Chromium (Playwright/Puppeteer) driven by the probe, rendering the same sample |
| findings-mass | §1.1 | 84 | arbitration on the 24 most-moved shape-filled files: −0.7…+0.8% bypass, 2.1–7.1% classify, mean pixel 0.003–0.007 / 0.015–0.024; worst pixel 0.498 → 0.308 | [not reprintable: the same browser render (`mk_cmp4.mjs` + the browser); the "7–10 px²" and "9 of 122" around it do reprint] | as above |
| findings-mass | method | 11 | "a stricter run puts `globe-2` at 102.14" | [not reprintable: from the reviewer's own numpy rasteriser (`w1-review/indep.py`, uncommitted); the bypass gives 102.15 at rate 32 and 102.11 / 102.12 at 64 / 128 (`conv.mjs`)] | commit the reviewer's rasteriser, or restate the figure on the bypass at a named rate |
| findings-mass | §1.1 | 82 | reviewer's rasteriser agrees to a mean 0.0006, max 0.023 px² (`24/link-2-filled`); reproduces 270 and 0 of 1,884 | [not reprintable: the same uncommitted second implementation] | the same |
| findings-mass | head | 7 | "re-measured 28 numeric claims" | [not reprintable: a process fact about the review] | — |
| findings-mass | App. C | 1158 | "(115)" tests | [not reprintable: the suite's size on 2026-10-04] | — |
| findings-grid | §2 | 68–87 | the "Chromium (Skia), measured" column (16 cells; the probe prints `[browser]`) | [not reprintable: measured in the Browser pane: SVG drawn into a canvas with `drawImage`, read back with `getImageData` (A, `mcp__Claude_Browser__javascript_tool` calls)] | a headless Chromium/Skia renderer (e.g. Playwright) — not in the repo, and the brief rules out new dependencies here |
| findings-grid | §2 | 90 | vertical line `x = 8` → 62.4% · 62.4%; `x = 8.375` → 25.1% · 100%; horizontal 50% + 75% | [not reprintable: same Chromium reading] | same |
| findings-grid | §6 | 359 | "Chromium: 0.50 + 0.75 on the horizontal bar" | [not reprintable: same] | same |
| findings-grid | §7 | 383 | "Chromium's horizontal lines peak at 75%" | [not reprintable: same (the 62.5% beside it reprints, `s1`)] | same |
| findings-grid | §3.2 | 152–157 | the visual descriptions ("a hard, dark pixel", "a grey column", "a pale 2 px shaft", "visibly lighter") and "from rendered rows at 8×". The band each named drawing sits in is computed and holds (`s3.2`, "named in bullet …") | [not reprintable: an eye reading of rendered rows] | Maruti's eye on the wall (card 4.1) |
| findings-grid | header | 3 | lint baseline 2,910 · 2,848 · 62 · 0 | [not reprintable: cited — the gate] | `node tools/lint.mjs` (checked: unchanged) |
| findings-grid | header | 7 | "28 numeric claims (14 from this one)" | [not reprintable: a count of the review's own claim list (V `claims.md`), not of the set] | — (process record) |
| findings-grid | App. C | 1876 | "(115)" tests pass | [not reprintable: the suite's count on 2026-10-04; it has grown since (560 today)] | — (historical) |
| findings-grid | various | — | docs/01:174-178, docs/01:273-280, docs/07 C7, docs/08:84 ("109 runs in 26 concepts when there were 95 icons"), docs/08:376-380, docs/08:409, `tools/masters.mjs:10` | [not reprintable: cited from other files] | — |
| findings-air | Eye table / §6a | 455, 828 | "about 61 icons already cut 1.5 at 16; 9 were redrawn" | [not reprintable: cited from C22 / C23 dated notes (docs 07), not measured by this card] | — (cited) |
| findings-air | §1 | 75-76 | where 1.5 "probably came from" | [not reprintable: a reading, the doc says so] | — (judgement) |
| findings-air | §4c | 292 | book-2 "Phase 0.125" | [not reprintable: listed in (b); no span reprints it] | — |
| findings-grammar | header | 14-26 | 62 claims · 44 held · 16 wrong · 2 unsupported, and the list of what was corrected | [not reprintable: a record of the review, not a measure of the set] | the reviewer's transcript (`agent-a2b5d885da1224ed8`) is the source; nothing to recompute |
| findings-grammar | §1.5 | 255, 28-30; §3 · 524 | "no concept puts a glyph on the corner of an object" (corner badges 0) | [not reprintable: a reading of every assembly; no coded definition of a corner badge (card 1.1 §2.8 also reads it)] | a geometric definition — a modifier wholly outside the base's silhouette except one overlapped corner, at most ~40% of the base — then a census. The probe prints the supporting facts (nothing crosses the bound; the nearest are 72–84% of their base and enter its box) |
| findings-grammar | §1.5 | 277-286 | "about twenty" objects used as a badge, "a dozen" side by side, "could be near 60" | [not reprintable: a hand reading of names] | a rule for "a second object used as a badge" |
| findings-grammar | §1.5 | 268-273 and everything built on it (§1.6's 34 bases / 23 / 7 / eye 3, file 7, folder 4, user 6; §3 items 1 and 12; P1; §7's 38 and 30) | the badge row "at least 38" | [not reprintable: **definitional — the card's own selection.** The card's own grep (its regex, toolu_01E2ZDLTTYCmY6x4RssJ785J) finds **113 names on the pin: 19 strike · 21 enclosure · 73 other**; the card's selection is 38 of the 73 (the document: "checked by hand… a floor"). The probe holds the 38 as `CARD_BADGE_ROWS` (doc l. 273), prints it as the card's selection, and prints the 113 and the 35 names left out beside it (alarm-clock, align-object-*, arrow-down-left/-right, arrow-up-left, caret-*, chevrons-*, clipboard-list, corner-*, folder-open, layout-list, mail-open, qr-code, spell-check, text-align-*, thumbs-down, trending-*, window-expand-bottom-right, window-key, zoom-in, zoom-out)] | a rule for "is this name a corner badge", or Maruti's ruling on each |
| findings-grammar | §0, §1.1-1.4, headline, §3, §5, §6 |  | 78 · 25 · 18 · 4 · 31 composites, 150 · 108 · 24 · 186 drawings, 47, 43 | [not reprintable: **the size of a parameter**: `COMPOSITES` is the card's classification (geometry proposed 26 — computed — and names added the rest by hand); the probe prints the counts labelled as its cardinality] | — |
| findings-grammar | §2.2 | 415 | two accidents, one undecided, eleven intended | [not reprintable: judgement from the tags (the probe prints the tags)] | — |
| enforcement §2.5, severity §5 |  | enforcement-gap.md:149-150, severity-proposal.md:147 | "of six piped runs two were cut short — one delivered 162,529 of 515,024 bytes" | [not reprintable: timing-dependent pipe truncation; not deterministic] | repeated piped runs; only the 515,024 total reprints (it does) |
| stale §1.9 |  | stale-statements.md:133 | "499 components, each 20×20" on `rdI0…` | [not reprintable: read from Figma; and corrected since (the plan's Corrections table: `rdI0…` is Fluent's file)] | the Figma connector; see `references-polaris.md` |
| stale §2b.4a |  | stale-statements.md:264 | "three runs this session all give …" | [not reprintable: a statement about the author's session] | — (the values themselves reprint) |
| rule-register §D6 |  | rule-register.md:189 | "none annotates a decimal" | [not reprintable: per-decimal coverage is `[needs measuring]` by the documents' own account (enforcement-gap.md:77)] | a rule for what "annotates" means |
| references-fluent | Sample | 45–46 | "every hold/give figure below moves by less than two points between the two groups" | [not reprintable: no code in the scripts or the transcript; it was never measured] | a definition of "every hold/give figure". The probe's reconstruction (`sample-groups`: the share rows of §2 per group, cells with n ≥ 10) finds gaps up to **55.0 points** (knockout exactly the Regular stroke, at 48), 26.2 (past the circle keyline, 20), 21.4 (margin under 1 unit, 16), 16.4 / 16.3 / 16.0 on three more rows; only the ink-box median holds (0.2 points). For wave 5 |
| references-fluent | §2, §5, §6, §7 | 130–133, 259–263, 297–299, 313–316, 395 | guideline quotations | [not reprintable: text from the Figma Guidelines page (`11947:5`)] | Figma; cited, not measured |
| references-sf | Instruments (a) | 104–106 | the perpendicular-profile reads 154.4 · 43.4 · 183.4 (the ridge reads 154.2 · 43.9 · 183.8 reprint from `sf/deep.json`) | [not reprintable: the profile was never saved as a record] | the raster stage: python3 + skia-python / scipy (user-site installs on this machine — `python3 -I` hides them) running the card's `sf_meas.py`, or a JS port of it |
| references-sf | Instruments (b) font side | 109–112 | 5.713 / 39.38, 5.62 – 5.74, 6.245, 6.25 – 6.33, 4.49, 3.013, 36.55 | [not reprintable: measured at the **small** scale by `sf_templates.py` (3); no record kept (`deep.json` is medium)] | as above |
| references-sf | the raster stage behind every `r3.*` section |  | the per-pair records themselves | [not reprintable: the records reprint their arithmetic; re-measuring them needs the raster] | as above; a committed probe that spawns python3 with skia-python / scipy is possible here — the brief does not forbid it, I took it as out of scope |
| references-sf | Sample | 83; §8 · 749; §8 · 753 | the 26 deep pairs (identified by eye), the 40 commonest numbered contexts, the two `fill`-spellings rendered side by side | [not reprintable: eye / judgement] | not a census; nothing to reprint |
| references-sf | §5 K5 | 661 | "the 2,664 reproduces from no filter I tried" | [not reprintable: a negative search] | the release that held 2,664 (reconcile item — the probe prints the document's own 2,906 / 2,508 / 398 with their definitions) |
| references-nucleo | §8 | 544–548 | the ink bands re-implemented on 24 pairs: median 0.9 / 0.5 points, at most 2.8 / 1.4, `follow-obj-right` 21.6 | [not reprintable: reachable, but not by a committed tool: the card's own `research/references/nucleo/card-2.3/ink_indep.py` (gitignored) prints 0.9 / 0.5 / 1.4 / 21.6 points with python3 + svgpathtools + scipy in < 1 s (reviewer ran it read-only; it reads the card's own `nuc/ink_*.jsonl` for the JS side)] | committing it would need a probe that spawns python3 with svgpathtools and scipy (user-site installs on this machine), or a JS port of `svg2paths2` and of python's seeded `random.shuffle`; the §4.2 figures it checks reprint |
| references-nucleo | §4.5 | 387–407 | the 28 overlay sheets and the named redraws (`connections`, `folder-user`, `remote-control-2` …) | [not reprintable: read by eye on contact sheets] | a look, not a census |

### Also not reprinted, by design (the builders' words)

**findings-primitives.md** — Not recoverable

None of the measured figures. Every one traced to a script or inline command in the author transcript
and is recomputed. Not this probe's to reprint, by design: the lint gate (`node tools/lint.mjs`), the
illustrative 20.25 / 20.27 → 0.01 example (congruence.mjs's own header), wave 0's figures quoted for
contrast (37 / 28 / 41 radii, 41 + 37 ring concepts — from the reconnaissance, not this card), citations
of docs/09 (22), card 1.2 (217), CLAUDE.md (45° → 45.5°), file-note quotes, and the eye questions
themselves (judgement).

**findings-angles.md** — Not recoverable

The probe prints its own computed value for each, so wave 5 can rule. Quotations of file comments ("declares
63.43°", "8.5 deg", the play / sparkle figures) and of C10 / C12 / C22 / C30 are cited, not measured; the probe still
prints the file comments it quotes. "60 lint warnings" (A-8) is cited from the plan and reprints with `node tools/lint.mjs`.

**findings-mass.md** — Not recoverable (not reprintable by this probe)

Cited, not measured here: L3 lint baseline (the plan); L11 "~5% under" and 48.4 (docs/08 §3.1); L49 60.9 (docs/07 C7);
L199's 12 × 12 mark cap, L214's 45% and L442's stroke/keyline arithmetic are rule constants — the probe prints them from
`tools/masters.mjs` anyway. Judgements: §3.2's verdict column (its numbers are checked), §2.2's "What the eye sees",
§5's recommendations, §6's "saw nothing alarming", §3.5's "checked every pair by eye".

**findings-air.md** — Not recoverable

Recovered and reprinted in full, nothing lost: every scratch script the document names (`airprobe`, `diagprobe`,
`realphase`(`2`), `airread`, `cost`, `aligncheck`, `blindspots`, `retina`, `dump`, `classify-bug`) plus `gap-census`
(+ `-nancheck`) and `contact-census`; the inline `node -e` analyses were recovered from transcripts A and K.
`gap-census-lint-instrumented.mjs` (a byte-copy of `lint.mjs` returning its private `measured[]`) is not copied
anywhere: `lintWithMeasured()` reads the pin's `tools/lint.mjs` at run time (the repo's until 2026-10-20, when lint had moved on), makes the same three edits in memory (two import
specifiers absolute, the return line extended) and imports it from a `data:` URL — the smallest honest route; nothing
is written. `cuts.mjs`, `gaps.mjs`, `warns*.mjs`, `lintblocks.mjs` back no figure in this document (superseded by the
two censuses).

Instrument defects: raster.mjs `classify` (A1) — Part one samples `reg.covered` only; §0 calls the defective path on
purpose; §9's render probe keeps the original `rasterise` and the probe proves it unexposed (4 probes sit in a file
with an area path, each moves its endpoint 0). Note: the document's claim (l. 51-52) that "every figure in this
document samples `reg.covered` directly" is not literally true of §9, which used `rasterise`; no §9 figure is affected.
geometry.mjs `bbox()` — used only inside lint's own glyph rule, as lint uses it.

**findings-filled.md** — Not recoverable

None of the measured figures. What the probe deliberately does not reprint, and why:
- **Cited, not measured by this card:** §3 L211–212 (Central's offset at four radius values — reconnaissance,
  `plans/set-and-rules-audit.md:210-218`); §6 L579 (Central 334 of 390, `cross-large` 15, 0.91 — reconnaissance);
  §6 L592 (Fluent +0.5 — reconnaissance); §4.1 L299 (the 60 `sort-*` warnings — `plans/sort-family.md`);
  docs/09:45's "43 of the 117" and "0.05 units"; every `lint.mjs` / `geometry.mjs` / `CLAUDE.md` line reference;
  rule values (1.5 · 1.5 · 1.25, FILLED_WEIGHT, C10/C12 floors) — the probe reads these from `masters.mjs`.
- **Judgements:** §5.1's concept list (a reading of §5's table), the Tag column of §7, §6's three verdicts, §8's eye
  questions.
- The plan's correction "Four concepts draw the filled corner tighter → None does": this document does not state
  that claim. Its nearest content, §3.2's −0.25 / −0.12 rows (`archive`, `help-4`, `thumbs-up`, `copy`, `copy-2`),
  is per-corner readings, reprinted in s3.2, and makes no set-wide claim.

For wave 5's reconcile list, this document's definitions (also in the probe header): box equality "1,100 of
1,455" = all four sides' differences round to 0 at 3 dp on `geometry.bbox()` (the solved box gives 1,106 · 295 · 54,
printed on a labelled line in s1); the 16 corner offset = 97 corners on **41** concepts (the document's 37 does not
reprint, see (b)).

**references-central.md · references-untitled.md** — Not recoverable

None. Every measured figure in both documents reprints from a committed command, a probe section, or arithmetic
on their printed lines. The eye-read *tagging* in Untitled §5 ("after looking at the contact sheets") is a
judgement; its outcome is the committed `BADGE` pattern, which reprints the counts. The sheets themselves
(`breaks-1/2.png`, `sample64-stroke2-vs-1.png`) are rewritten byte-identically by UP / CA `--png`.

## 6. Instrument caveats the probes measured

### findings-scaling.md — Instrument defects — exposure, measured

- **raster.mjs `classify` (horizontal area edges).** Only §6's "filled, median" row is measured on area paths. The
  probe prints it both ways: committed **0.2969 / 0.2579 / 0.2944** (= the document) and with the horizontal-edge bypass
  **0.2969 / 0.2578 / 0.2936**. 270 of the 1,026 drawings with an area path change; the largest change in ink ÷ canvas²
  is 0.0254. Every outline figure (the appendix's ink area and density, §1, §6 outline, §11 E2) is unexposed.
- **congruence.mjs ring direction.** 8 of 386 "structural" pairs differ only in a ring's direction or start vertex.
  With the bypass (`refitAcrossDirection`): the headline "16 of 970" and 17 / 17 are unchanged; "within a twentieth"
  24→16 52 → **54** (5.4% → 5.6%); "structurally incomparable" 110 / 152 / 124 → **109 / 150 / 121**; median residual
  0.621 → 0.618 (24→16), 0.338 → 0.337 (20→16). The document's figures are the committed instrument's.
- **geometry.mjs `bbox()` arc sampling.** The document states lint's box on purpose. On metrics-check.mjs's solved box,
  7 of 2,910 drawings would read a different 2 dp w or h (rotate-ccw and rotate-ccw-2-filled at 24; rotate-ccw-2-filled
  and rotate-ccw-filled at 20; megaphone, message-5, rotate-ccw-filled at 16) — listed by `s0`. The probe does not
  re-run the tables on the solved box.
- `pixelgrid.mjs` and `figma.mjs` are not used by this card.

### references-fluent.md — Instrument defects — geometry.mjs cubic sampling

Found by the closing check (2026-10-09, `../../card-reprint-close/helpers/air-filled-fluent.md`). `tools/geometry.mjs`
`samplePath` reads a C/S/Q curve by its **control points**, not the curve: `bbox` of `M0 0 C0 10 10 10 10 0` is 10 tall,
the curve 7.5. `bbox`, `facingGap` and `materialGap` (through `ringOf`) all read it. Our drawings carry no curve
(0 curve commands in the pin's `src/icons`); Fluent is all cubics. `angles.mjs` and `radii.mjs` read curves with their own
pieces and are not exposed (the radius histogram filters on no box-dependent role). Not edited.

What the probe now does: every section runs twice — as the instrument samples it (the document's reading) and on true
geometry (each record's curves flattened by `flattenCurves` to points on the curve, at most 0.1 apart, before any
instrument sees them; the command count still reads the original path) — and a line the two readings print differently is
printed twice, labelled `as the instrument samples it │` and `true geometry │`. 54 of the probe's output lines differ.
Comparator: `node compare.mjs probe-full.txt sampled` → **630 / 641** (the document's reading); `… true` → **539 / 641**.

Every document figure the defect moves (`exposed.mjs` → `exposed.json`; 37 of the comparator's 127 entries). "Reprints"
is against the document at its own precision; "holds on true geometry" is the same test on the true reading:

| § | doc line | figure | document | as the instrument samples it | true geometry | reprints | holds on true geometry |
|---|---|---|---|---|---|---|---|
| §approx | 80 | plausible · excluded · orphans | 75 53 128 | 75 53 128 | 75 50 125 | yes | no |
| §1 | 99 | filled box proud per side | 0.25 0.28 | 0.25 0.28 | 0.25 0.25 | yes | no |
| §2 | 117 | thinnest ink, median per size | 1.00 1.00 1.00 1.50 1.50 2.00 2.50 | 1.00 1.00 1.00 1.50 1.50 2.00 2.50 | 0.98 0.98 0.98 1.46 1.46 1.97 2.46 | yes | no |
| §2 | 117 | thinnest ink in its own line | 1.00 1.00 1.00 1.00 1.00 1.00 1.00 | 1.00 1.00 1.00 1.00 1.00 1.00 1.00 | 0.98 0.98 0.98 0.97 0.97 0.99 0.98 | yes | no |
| §2 | 117 | exactly on the stroke · thinner | 42 64 6 25 | 42 64 6 25 | 0 0 3 77 | yes | no |
| §2 | 118 | knockout exactly on it | 55 94 | 55 94 | 53 94 | yes | no |
| §2 | 120 | Arrow Circle Down/Up at 16–48 | 50.3 50.7 | 49.7 50.7 | 49.4 50.0 | no | no |
| §2 | 120 | Question Circle · Chevron Circle ranges | 53.8 60.0 41.0 54.4 | 53.8 60.0 41.0 54.4 | 53.8 60.0 40.0 53.8 | yes | no |
| §2 | 122 | separation (Regular), median per size | 1.00 0.95 1.00 1.00 1.50 1.50 2.46 | 1.00 0.95 1.00 1.00 1.50 1.50 2.46 | 1.00 1.00 1.00 1.02 1.50 1.52 2.48 | yes | no |
| §2 | 122 | separation in their own line | 1.00 0.95 1.00 0.67 0.98 0.75 0.98 | 1.00 0.95 1.00 0.67 1.00 0.75 0.98 | 1.00 1.00 1.00 0.68 1.00 0.76 0.99 | no | no |
| §2 | 124 | under 1 unit | 39.3 29.9 6.8 6.1 3.1 2.6 0 | 39.3 29.9 6.8 6.1 3.1 2.6 0 | 18.8 18.1 3.6 3.8 1.2 0.6 0 | yes | no |
| §2 | 125 | past the circle keyline · on it | 20.1 37.6 37.3 42.9 | 20.1 37.6 37.3 42.9 | 7.8 20.7 49.5 66.7 | yes | no |
| §2 | 128 | filled box identical per size | 75.5 81.8 83.8 80.0 83.9 82.1 83.2 | 75.5 81.8 83.8 80.0 83.9 82.1 83.2 | 79.2 84.0 89.3 88.2 92.6 91.0 88.3 | yes | no |
| §2 | 128 | filled box grows | 11 22 | 11.0 21.7 | 3.4 18.9 | yes | no |
| §2 | 128 | filled box shrinks | 3 12 | 2.8 6.9 | 1.9 5.3 | no | no |
| §3 | 142 | margin inside 1 unit at 28 · 16 · 12 · touching at 16 | 3.1 29.9 39.3 19 | 3.1 29.9 39.3 19 | 1.2 18.1 18.8 19 | yes | no |
| §3 | 155 | orphans under one stroke · survivors · fold | 21.1 6.9 3 | 21.1 6.9 3.07 | 21.6 6.9 3.15 | yes | no |
| §4 | 209 | ink floor and knockout ladders | 1 1 1 1.5 1.5 2 2.5 1 1 1 1.5 1.5 2 2.5 | 1.00 1.00 1.00 1.50 1.50 2.00 2.50 1.00 1.00 1.00 1.50 1.50 2.00 2.50 | 0.98 0.98 0.98 1.46 1.46 1.97 2.46 1.00 1.00 1.00 1.50 1.50 2.00 2.50 | yes | yes |
| §4 | 214 | separation flat at 1 from 12 through 24 | 1 1 1 1 | 1.00 0.95 1.00 1.00 | 1.00 1.00 1.00 1.02 | yes | yes |
| §5 | 238 | past the circle keyline | 34.4 35.6 20.1 0.0 0.0 0.0 | 34.4 35.6 20.1 0.0 0.0 0.0 | 20.3 20.7 7.8 0.0 0.0 0.0 | yes | no |
| §5 | 239 | reaching neither keyline | 5.2 3.2 4.4 21.9 19.4 12.0 | 5.2 3.2 4.4 21.9 19.4 12.0 | 5.7 3.2 4.4 21.9 19.4 12.0 | yes | no |
| §5 | 241 | spread inside one concept · tail | 7.50 8.74 7.50 12.50 1.4 | 7.50 8.74 7.50 12.50 1.43 | 7.50 8.35 7.50 12.50 1.50 | yes | no |
| §5 | 246 | thinnest ink in its own line | 1.00 1.00 1.00 3.00 1.96 1.38 | 1.00 1.00 1.00 3.00 1.96 1.38 | 0.97 0.98 0.98 3.00 1.96 1.38 | yes | no |
| §5 | 248 | separation, absolute | 1.00 1.00 0.95 1.50 1.50 1.50 | 1.00 1.00 0.95 1.50 1.50 1.50 | 1.02 1.00 1.00 1.50 1.50 1.50 | yes | no |
| §5 | 249 | separation in its own line · ratio at 16 | 0.67 1.00 0.95 1.00 1.00 1.20 1.26 | 0.67 1.00 0.95 1.00 1.00 1.20 1.26 | 0.68 1.00 1.00 1.00 1.00 1.20 1.20 | yes | no |
| §6 | 293 | T2: exactly · ours 24 · 20 · 16 | 55 94 1.00 1.00 1.20 | 55 94 1.00 1.00 1.20 | 53 94 1.00 1.00 1.20 | yes | no |
| §6 | 331 | R1: past the circle keyline | 20 38 | 20 38 | 8 21 | yes | no |
| §6 | 339 | R2: growth per side · identical boxes | 0.25 0.28 75 84 | 0.25 0.28 75 84 | 0.25 0.25 79 93 | yes | no |
| §6 | 348 | R3: pooled median · p25 | 1.00 0.73 | 1.00 0.73 | 1.00 1.00 | yes | no |
| §6 | 348 | R3: bottom decile | 0.09 0.31 | 0.07 0.39 | 0.07 1.00 | no | no |
| §6 | 350 | R3: named badge readings | 0.23 0.09 0.10 0.09 0.16 | 0.23 0.09 0.10 0.09 0.16 | 1.00 1.00 1.00 1.00 1.00 | yes | no |
| §6 | 349 | R3: the same value in outline and filled (pairs agreeing / pairs) | 10 10 | 4 10 | 10 10 | no | yes |
| §7 | 391 | K2: separation (Regular) | 1.00 0.95 1.00 1.00 1.50 1.50 2.46 | 1.00 0.95 1.00 1.00 1.50 1.50 2.46 | 1.00 1.00 1.00 1.02 1.50 1.52 2.48 | yes | no |
| §7 | 391 | K2: Filled twins within | 0.05 | 0.04 | 0.10 | yes | no |
| §7 | 405 | K3 table | 0.95 1.00 0.95 0.96 1.50 0.64 1.50 1.25 1.20 | 0.95 1.00 0.95 0.96 1.50 0.64 1.50 1.25 1.20 | 1.00 1.00 1.00 1.00 1.50 0.67 1.50 1.25 1.20 | yes | no |
| §7 | 409 | K3: 1.26× relative · 1.5× absolute (at 16) | 1.26 1.5 | 1.26 1.58 | 1.20 1.50 | no | no |
| §7 | 411 | K3: about 60% of the size the plan assumed | 60 | 63 | 60 | yes | yes |

Reading it: the document's own hold/give story moves on true geometry in three places worth Maruti's eye. The
**thinnest ink** is not "exactly the stroke": at no size does any drawing land on it, 3–77% go thinner, and the medians
sit at 0.97–0.99× the stroke (0.98 · 0.98 · 0.98 · 1.46 · 1.46 · 1.97 · 2.46). The
**margin** is spent far less than §2/§3 say (under 1 unit in 18.8% at 12 and 18.1% at 16, not 39.3% and 29.9%), and
**past the circle keyline** falls to 7.8–20.7% (from 20.1–37.6%). R3 reverses: on true geometry the named badge-to-base
air is 1.00 in nine pairs and 1.50 in the tenth (Earth Leaf at 32; the closing check finds it has no separate badge), outline and filled
alike, 10 of 10 — the 0.09–0.31 readings are control points, not drawing. The
`materialGap` and separation ladders move by 0.02–0.05. Figures that stay put: everything on our side, the stroke
ladder, the canvas-edge counts, T5's 20 concepts, part deaths (75 plausible either way; on true geometry 125 orphans and 50 excluded, against 128 and 53),
path structure and command counts, angles and radii.

### references-sf.md · references-nucleo.md — Instrument defects — geometry.mjs cubic sampling

`tools/geometry.mjs` `samplePath` reads C / S / Q segments by their control points, not the curve (the box of
`M0 0 C0 10 10 10 10 0` comes out 10 tall; the curve is 7.5). **No figure either probe prints is exposed**, because
neither probe calls `samplePath`, `bbox`, `selfGap`, `materialGap` or `facingGap`, directly or through an instrument:
- Both probes import from `geometry.mjs` only `parsePath`, the tokenizer (`nucleo-probe.mjs` for its svgpathtools port
  in §8; through `refs/nucleo.mjs normalisePath`, which turns tokens into absolute segments). No sampling happens there.
- Curves are evaluated as curves everywhere a figure depends on them: `refs/nucleo.mjs` `sampleSegs` (cubic, quadratic and
  arc formulas) for the census air, the ink bands, the parts, the dot gaps and `compareRecords`; `refs/nucleo.mjs` `bboxOf`
  (exact, derivative roots) for every ink box, margin and SF exact bound; `radii.mjs` `cornersOf` through `angles.mjs`
  `pointOn` (curve evaluation) for every corner radius and role (`radii.mjs` imports `geometry.bbox` only inside
  `radiiOf`, which the probes do not call); the SF probe's own `flatContours` (cubics cut at equal t, as `sf_font.py`) and
  `samplePath` (svgpathtools' segment-and-t sampling) for §3.2 and §3.7; fontTools for the glyph outlines.
- Proved by a test, `nucleo-probe.test.mjs` "curves are read as curves": `bboxOf` and `sampleSegs` give 7.5 on the trap
  path, `summarise` gives the stroked box 9.0 (7.5 + 1.5), and `cornersOf` reads a cubic quarter-turn of radius 3 as 3.

### references-central.md · references-untitled.md — Wave-5 caveat: which figures depend on `measure.ink` or on `cornerRadius` held as a node property

**`figma.mjs` `measure.ink` (render bounds; wrong on rotated/flipped nodes, 1,032 Central drawings flagged):**
- *Directly* (a render-bounds number, so exposed): Central §1:66-67 (chevron-triangle-down-medium 6.0 → 7.13),
  §1:70 (chevron-double-left −19…−6 — the defect itself), §1:68-69 (95.4% vs 90.0% agreement), §7:232 (334 of
  390), §11:326-327 IC's 1,253 of 1,844 (render bounds only; IC skips only nodes *flagged* rotated, so the 151
  flipped-but-unflagged drawings — CA's disputed cause "render box off by more than 5" — can enter it).
  Untitled §11's harness figures (1,084 / 1,171; UPR `s11`) and IC's 1,087 — but Untitled's render bounds agree
  with the path on 2,359 of 2,359 drawings (its one rotated-flagged drawing included), so nothing there moves.
- *As an admission filter only* (box from the path with node rounding put back; a drawing enters only when it
  agrees with the render bounds to 0.01 and is not flagged rotated): every Central hold/give figure — §1's
  verified / rotated / disputed counts and causes, §3a/3b/3e, §4's split by box held, §6, §7's pair tables, the
  81 always-breaking icons, cross-large 15 of 15, and the short answer's rates that restate them. A wrong render
  box can only exclude a drawing (as 'disputed'), never move a box.
**`cornerRadius` only as a node property (23.0% of Central's radius 1–3 outlines):** Central §1:67-69 (3,980 /
17,334; 95.4 vs 90.0%) measure it directly; §2's "only the rounding property changes 256" / filled "2" and the
distinct-geometry counts (node cornerRadius included in the comparison); §6 (box changes along the radius axis
exist for those drawings only because `roundSharp` puts the rounding back); §5's corner relation and §3/§4's
straight pieces (both read `effectiveCmds`, which rebuilds it; per-vertex 'mixed' radii — 1,548 drawings — are
disputed and left out, and their sharp vertices are not trusted). Untitled: 1,408 paths carry 'mixed' and 68 a
number, but its boxes are read from the path and agree with Figma on all 2,359 drawings, so no figure depends on it.
None of "ours" (§5/§9 Central, §4/§8/§9 Untitled) touches either.

### references-central.md · references-untitled.md — Instrument defects — geometry.mjs cubic sampling

`tools/geometry.mjs` `samplePath` reads C/S/Q pieces by their control points, not the curve: the box of
`M0 0 C0 10 10 10 10 0` comes out 10 high where the curve is 7.5 high. **No figure in either document is exposed —
neither a probe figure nor a committed-command figure the map counts as reprinting.** Checked 2026-10-09 by
following every import:
- **Reference side (Central and Untitled records, which do carry cubics).** `central-axes.mjs`, `untitled-pairs.mjs`
  and both probes import only `refs/pairgeom.mjs`, and through it `refs/figma.mjs`. `figma.mjs` is self-contained
  and never imports `geometry.mjs` (`figma.mjs:328-329`). Its `bboxOfPath` solves for the cubic's and quad's
  turning points exactly; pairgeom's `flatten` evaluates the curve at parameter points. On the example above both
  give 7.5: `bboxOfPath` → y1 7.5, `flatten` → max y 7.5000. Every box, raster, side holder, corner run and band
  sample on the reference side goes through these two. Figma's render bounds (`measure.ink`) are Figma's own.
- **Our side (the "ours" figures, from the pin or the live tree).** `untitled-ours.mjs`, `angles.mjs` and
  `radii.mjs` `cornersOf` take only `parsePath` from `geometry.mjs`. They evaluate pieces themselves (`inkBoxOf`
  uses exact arc extremes; `samplesOf`/`pointOn` sample the curve). `radii.mjs`'s one `geometry.bbox` call sits in
  `radiiOf`, which none of these tools calls. And the pin's 2,910 drawings hold **zero** C/S/Q/T commands (18,133
  arcs, counted on `$P/src/icons`), so no cubic exists there to mis-sample.
- `selfGap`, `materialGap` and `facingGap` are not reached by any of the four tools.
So no row is marked instrument-exposed, and no true-geometry reading is printed beside any figure.

**Format slips (closing check C5):** none of the listed slips are mine. Neither probe prints a "—" cell, "12.50%"
or "100.0%". Untitled `s4` prints "100%" as the document does; the Sharp 24 cells belong to another card's probe.

## 7. What is left, and what to know before relying on a probe

- **SF Symbols' raster figures** (`references-sf.md` §3.1, §3.3–§3.6, §3.8, §3.9) reprint from the card's saved per-pair
  raster records (`research/references/sfsymbols/card-2.2/`), labelled "from the card's raster records; the raster itself
  not re-run". What does not reprint: re-running that raster (Skia rasters of Apple's font, scipy's distance transform, an
  FFT boundary correlation — `sf_font.py`, `sf_pair.py`, `sf_meas.py`), and check (a)'s profile reads and check (b)'s font
  side, which were never saved. Reaching them needs a JavaScript port, or a probe allowed to start python3 with numpy ·
  scipy · skia-python (installed on this machine as user-site packages). Nucleo §8's ink re-check is in the same position:
  the card's `ink_indep.py` (gitignored, under `research/references/nucleo/card-2.3/`) prints it in under a second with
  python3 + svgpathtools + scipy, but no committed tool does.
- **Browser renders.** The Chromium cross-checks in `findings-mass.md` (:11, :84) and `findings-grid.md` (§2's column,
  §2:90, G-1, §7:383) need a browser; the probes print the geometry they were checking.
- **A defect found by the closing check: `tools/geometry.mjs` `samplePath` reads curves by their control points.** A
  `C`, `S` or `Q` segment is sampled along its control polygon, not the curve (the box of `M0 0 C0 10 10 10 10 0` comes out
  10 high; the curve is 7.5). Our own drawings use no cubics (0 of 2,910), so lint, the build and every pin-side figure are
  untouched. Reference drawings are full of curves — Fluent is all cubics — so any reference figure measured through
  `geometry.mjs` (`bbox`, the gap functions, and the instruments that call them) is exposed. Every such row in §4 is marked
  *instrument-exposed (geometry.mjs cubic sampling)*, with the true-geometry value where a probe now measures it, and §6
  lists the exposed figures per document. `geometry.mjs` was not edited (out of this card's scope); the plan records the
  defect.
- **A card's own selections are named parameters, printed as such** — card 1.9's 38 badge rows (definitional: the card's
  selection, beside the 113 names its own search finds) and its composite kinds (`grammar-probe`); card 1.2's "nine
  flagged concepts" (`corners-probe`, marked not reprintable, with what each statistic does flag). Where a selection stood
  in for a census, the probe prints the census beside it.
- **Definitional differences are listed, not resolved.** Several §4 rows are one quantity under two definitions (grammar
  b2 and b11, the filled 16 corner offset, the 96.3% box equality, SF's 5.713 ring and its ×4.2 slash bar, primitives'
  per-part and per-pair readings of the shared-part rule). Wave 5 carries both readings, per
  the plan's reconcile list; nothing here picks.
- **Run times.** Most probes run in seconds; `mass`, `grid`, `filled`, `fluent`, `scaling` and `air` take one to five
  minutes (`mass` and `filled` offer `--cache <dir>`, stamped to the pin). `nucleo-probe` takes about an hour without a
  cache and about 2 s with one.
- **Two committed reference commands write.** `node tools/audit/refs/central-axes.mjs --png --ours` and
  `node tools/audit/refs/untitled-pairs.mjs --ours --png` rewrite `report.txt`, the PNG sheets and `pairs.json` under
  `research/references/{central,untitled}/figma/analysis/`. On 2026-10-08 this card's builder ran them (the lead's brief
  allowed it, against the wave rules' "never write `research/`"); the contents were restored and verified equal to a
  backup, only modification times moved. Read the saved `report.txt`; do not re-run them. `central-probe` and
  `untitled-probe` reprint the pin-side figures read-only.
- **The Fluent copy page's catalogue is now durable:** it was copied on 2026-10-08 to
  `research/references/fluent/copy-page/catalogue-centralcopy.json` (gitignored, sha256 `562e1ca0170a44f1…`) before the
  2026-10-04 session's scratch folder cleared; the original there is gone. Its two figures (2,608 sets / 2,606 names,
  `references-fluent.md`'s Sample section, lines 50 and 416–417) reprint from it (2,608 rows, 2,606 distinct names on
  2026-10-09): `node -e 'const j=require("./research/references/fluent/copy-page/catalogue-centralcopy.json"),n=j.columns.indexOf("name");console.log(j.rows.length,new Set(j.rows.map(r=>r[n])).size)'`.
  The row left §5 on 2026-10-09.
- **The transcripts that the probes were recovered from** live in `~/.claude/projects/…/07852967-…/subagents/` (waves 0–2)
  and `…/13ae519b-…/subagents/` (card 1.9) until Claude Code's retention clears them. The probes do not need them.

## 8. How this was built and checked

Thirteen builders (Opus), one per document or pair of documents, each recovered its card's logic from the author's
transcript first and the scratch folder second, wrote `tools/audit/<stem>-probe.mjs` and its test, and proved it with a
comparator of its own against the document. A fresh reviewer (Opus; the first four Fable reviewers stopped at a usage
limit and were relaunched) then checked each probe with its own scripts: at least 40 figures per document against the
output, at least ten re-derived independently, a grep for hard-coded figures, and deliberate breaks to see whether the
tests notice. **Every reviewer found tests that let a figure-moving break through**, and several found figures counted
as reprinting that were really a copied list or a hand selection; each correction went back to its builder, who fixed it
and re-ran the breaks. The reviewers' disputes are folded into §4 and §5. After the corrections each builder re-ran its reviewer's breaks against the strengthened tests. A **closing check** (run by the main session, 2026-10-09) then tried fresh breaks on all 18 probes, spot-checked more than 150 figures, confirmed 28 did-not-reproduce rows, and found what is folded in here: more surviving breaks (each now closed by a test), the `geometry.mjs` curve defect above, and five wording corrections. The SF and Nucleo tests were then judged twice on mutation sets their builder had not seen — the first set (45 breaks) caught SF 15 of 24 and Nucleo 13 of 21, and seven survivors moved a printed figure; the second (76 breaks) caught SF 32 of 38 and Nucleo 23 of 38, and six moved a figure. Every figure-moving survivor of both sets was then closed by a test, and the builder swept the same kinds of constant (lists, years, rounding precision, fractions, spans) member by member. No third unseen set was run, so the SF and Nucleo tests are the least proven of the eighteen.

One `air-probe.test.mjs` case was once seen failing in the full suite and passing alone. Neither its builder nor its reviewer could make it fail again (eight full-suite runs, the file run 12 times in parallel, the suite in one process in both orders); nothing in it is order- or timing-dependent — no timeouts, a fresh temporary directory per run, no shared state. It was most likely caught while its builder was editing the fixtures.

**Gate at the end of the card:** `node tools/lint.mjs` is byte-identical to its output at the start of the card (`2910 drawings · 2848 clean · 62 warned · 0 failed`); `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → **789 pass, 0 fail, twice in a row** (374 of them are the 18 probes' own); `shasum lab/manifest.json` starts `161c9314cdf8`; no tracked file was changed by this card — its only writes are the 36 new files under `tools/audit/` and this map.
