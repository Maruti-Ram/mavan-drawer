# Reference: the field — what practitioners praise, what they punish, and how the respected systems state their construction

Card 2.6 of `plans/set-and-rules-audit.md`. Written 2026-10-05 against our pinned tree `5933041` (485 concepts,
2,910 drawings) from two field reports researched on 2026-10-04 and recovered from their session's transcripts
(§0). **No web research was re-run.** This file holds what the field says, each finding tagged to the report
section that says it, passed through the plan's transfer test, and set beside what the wave-1 cards already
measured on our own set. It takes no number from anyone.

How to reproduce: `node tools/audit/field-sources.mjs extract <dir-outside-the-repo>` re-extracts both reports and
verifies their hashes; `node tools/audit/field-sources.mjs check docs/audit/references-field.md <that dir>` verifies
every report anchor this document cites, every quotation in it, and the transcription behind the calibration table,
and prints every count taken from the reports; `node tools/audit/field-sources.mjs normalise` prints §4's table.
Details in §12.

---

## The short answer

**What a customer will say about our set, if the field is any guide, is one of three words: consistent, crisp, or
generic. Not one of them will say optical.** The survey of 14 Hacker News threads and about fifteen designer essays
found that the word practitioners reach for when they admire a set is *consistent* — 13 of the 402 HN comments
about icons, against 4 that say *inconsistent* — and that the word *optical* appears in none of the 402: it is a
designer's and a vendor's word, never a customer's [praise C1.1; C1]. (These three counts are the report's; the
filter that produced them is not in the saved evidence, so they do not reprint — §0.) The failure modes, counted
over 53 independent statements the report verified against raw text, rank **generic, overused, dated (12)** ·
**blurry, off-pixel, naively scaled (11)** · **inconsistent, drifting (10)**, the three within two of each other, then
coverage gaps, mixing sets, and licensing at 7 each [praise C2]. That ranking reprints from the survey's own coding
table (§12).

Three of those map straight onto axes this audit already measures — F3/F4/F5 for drift, F7 and F6 for blur — and the
wave-1 cards say where we stand (§2). The first, *generic*, is not an axis at all: it is the look of a 1.5-on-24 line
set, which is what we are, and only the eye on the wall (card 4.1) can say whether character (C1–C8) carries us out
of it (§7).

**What the field credits consistency to is not the grid.** It is ownership: closed authorship (Phosphor, Feather and
Iconoir refuse outside icons), a tracked list of repeating elements (Cursor's set tracks over 155 [praise C4.1; D]), a
named reviewer (Streamline's art director, IBM's 30-day review) [praise A.2; B:Streamline; B:IBM Carbon]. The one
large open-contribution set, Lucide, spends its tracker arguing rules against guidelines [praise A.2]. We have the
ownership already — one eye, one engineer — and card 1.1 built the instrument that Cursor keeps as a list (§8, FD-1).

**Hand-drawn small masters are rarer than the talk**, and the one documented counter-case is instructive rather than
decisive. Path-level redraws were confirmed for Heroicons (24/20/16), Octicons (16/24), Fluent (12–48) and Cursor
(16/24); Material Symbols and SF Symbols do it through axes; everyone else ships one master and a stroke parameter,
or a linear downscale — Carbon's source tree holds 2,766 names at 32 and only 68 drawn at 16 [praise A.3;
construction §1.9]. Atlassian tried hand-drawn 12s, found the set "too restrictive", shipped 12 as a CSS downscale of
its 16 with the stroke reduced in proportion, and reports that shrinking size and stroke together worked
[praise A.4; B:Atlassian; construction §2.5]. §3 says why that answers their constraint and not ours, and what of it
transfers: a test, not a conclusion.

**The 17 published systems calibrate us rather than correct us.** Our keyline table is what Material and Fluent ship at
24 and 20, and what Fluent ships at 16 — Material has no 16 [construction §1.4]; the circle-to-square ratio converges on about 1.11 and ours is 1.111
[construction §1.3]; our live area sits inside the field's 80–92% band [construction §3.1]. Where the field splits —
stroke at 16 (1.0 for four systems, 1.5 for three, 1.25 for nobody), redraw against scale, pixel snapping, how strict
a margin is, whether the filled twin must keep the box, a minimum gap of one stroke or two thirds of one, whether a
radius equals the stroke — it cannot settle anything for us, and §4 records each split so that wave 5 does not
mistake a camp for a consensus [construction §1.2; §5].

---

## 0. Method and sources

**The two reports.** Both were written by agents of session `07852967-7543-4b42-af82-b9afcfb57d4e` on 2026-10-04
and handed back as the `message` of each agent's final `SubagentHandback` call. The plan believed them lost; the main
session extracted both from the transcripts by script on 2026-10-05, and `tools/audit/field-sources.mjs extract`
re-extracts them and verifies the hashes recorded here (verified this session: byte-identical to the main session's
copies).

| report | agent | size | sha256 | sections |
|---|---|---|---|---|
| *Field survey of praised icon sets* — cited here as `[praise …]` | `ac6f17b540b15b43e` | 28,805 chars | `ffc497c2ea7544ef261d067f7e8895a6346d2ce25cd06a4adcc895506eb02823` | A bottom line · B set by set · C1 vocabulary of praise · C2 failure modes, ranked · C3 hand-tuned against scaled · C4 people · D notes for the audit |
| *Published construction systems* — cited here as `[construction …]` | `a365eba20e75eadb3` | 46,330 chars | `2e307a292cbb130c8f99ec59e9c8e3982e74c40d26920889a86245cb74f329a8` | §1 headline findings (nine) · §2 seventeen per-system tables · §3 cross-system tables · §4 multi-size · §5 contradictions · §6 what could not be got |

**Their evidence** survives, read-only, in that session's scratch directory (`/private/tmp/claude-501/…/07852967-…/scratchpad/`):
`notes.txt` (the construction agent's exact wording and every measurement), `web/` (112 files: 54 saved page texts,
52 HTML, 4 JSON, 2 Markdown), `raw/`, `rast/` and `sf/` (its downloaded sources and measuring scripts), and
`icon-reception/` (the survey's working notes, 20 raw HN thread JSONs and 20 flattened threads — 19 `thread_*.txt`
and `hn_streamline.txt` — 155 entries under `src/` (154 files and a `persize/` folder), and `tally3.py`, the coding
table behind C2). It is a temp directory and may
not outlive the machine; every quotation in this document was therefore chosen to be verifiable against the reports
themselves, and `check` passes without the evidence folder.

**Basis codes, as the reports use them.** Praise report: `[V]` vendor self-description · `[V*]` a competitor's or
seller's list (discounted) · `[P]` independent practitioner · `[I]` the agent's own inference or measurement, method
given; `HN#id` is `https://news.ycombinator.com/item?id=id`. Construction report: `S` official design-system doc ·
`B` vendor blog · `M` marketing page · `F` read from shipped asset files · `X` the agent's own render-and-measure
(±0.06 px) · `K` already in our repo, cited not re-derived · `n/s` not stated.

**What reprints and what does not.** The C2 ranking reprints from `tally3.py` (57 coded rows: 53 independent, 4
vendor; `check --evidence` recounts it and it matches the report exactly). The HN word counts in C1 (837 comments,
402 about icons, 13 *consistent*, 4 *inconsistent*, 0 *optical*) do not: the evidence holds 20 flattened threads, not
the 14 the report names; the only filter script there, `icon-reception/filt.py`, is a per-set keyword screen that
does not produce these counts; and no subset of the 20 threads — of 14 or of any size — sums to both 837 comments
and 402 that mention icons (139 subsets of 14 reach 837; none of them reaches 402; counted this session, one
`[author|id]` line per comment, "about icons" as a mention of *icon*, and checked independently by the card's
reviewer — not reprinted by `field-sources.mjs`, because the threads exist only in the 2026-10-04 session's scratch). So those three figures are quoted as **the
report's count, not reprintable** wherever they appear. The construction report's measurements (`X`, `F`) are its own; where a later
reference card measured the same quantity from the source file, both are listed in §9 and neither is picked.

**What this card does not do.** It measures none of our drawings (every figure about us is cited from a wave-1 card
by `path:line`), takes no value from any system, and does not reopen anything in the Settled table. Three kinds are
kept apart throughout (plan card 3.2): a drawing against a stated rule · a rule against a rule or the docs · fine by
every rule and still wrong.

---

## 1. The vocabulary of praise, mapped to the axes

The nine groups are the report's [praise C1], in its order of weight. For each: what Maruti would see on a sheet,
which axis it is, how we measure it or which surface judges it, and where the wave-1 cards put us today.

| # | the words practitioners use | what the eye sees | axis | measured by · or eye-only, on | where we stand (wave 1) |
|---|---|---|---|---|---|
| 1 | **consistent, cohesive, unified, "one hand"** — the dominant word (HN#15090343, HN#29866895; Moonb; Cursor) [praise C1.1] | the circle in one icon is the circle in the next; a plus is always the same plus | **F4** closed vocabulary · **F3** armature · **F5** grammar | `congruence.mjs` (card 1.1); the modifier census (card 1.9); the wall and the primitive sheets for the eye (4.1, 4.2) | 8,305 subpaths fall into 3,472 congruence classes, 2,496 used once (`findings-primitives.md:89`); 52% of paths redraw something the set already contains (`:92`); the container ring is one drawing, 21 of 21 identical at all three masters (`:554`). Nine shared parts drift at one master across 30 concepts, none visibly — the largest 0.625 u (`findings-grammar.md:435-436`) |
| 2 | **clean, neutral, unflavored, blends in** (HN#15091544, HN#46665979; Moonb on Lucide) [praise C1.2] | nothing in the set announces a brand; the same virtue the field punishes as *generic* (§2, mode 1) | none — character (C1–C8) | **eye-only**: the wall (4.1) beside the references in `lab/character.html` | no instrument; booked to §7 |
| 3 | **crisp, sharp, legible small** (Moonb on Remix; Heroicons Micro; launch comments) [praise C1.3] | edges that land on pixels at 16; nothing smears | **F7** pixel grid at 16 · **F10** silhouette | `pixelgrid.mjs` (card 1.6); the wall at 1× for the eye | 370 of 485 outlines at 16 have all four outer ink edges on pixel lines (`findings-grid.md:27`); 76.0% of straight length sits on the x.375 / x.625 construction (`:241`); but a 1.25 stroke cannot be crisp on both of its edges (`:17`), and 189 of 363 drawings at 16 contain a run with no fully inked pixel (`:324`) |
| 4 | **balanced: spacing, "good weight", optical volume, weight matched to type** (HN#22625876 praises Tabler's sensible spacing and padding and a line of the right weight; Moonb on Phosphor) [praise C1.4] | twenty icons in a row read as one darkness; the air inside each is even; the line sits right beside the text | **F1** apparent weight · **F2** apparent size · **F8** air | `mass.mjs` (card 1.5); the optical census (card 1.11); `facingGap` (card 1.7). *Weight matched to type*: no rule, no instrument — FD-6 | the 16 outline row's ink runs 12.2 to 102.2 px², 8.4× (`findings-mass.md:20`); at a squint the darkest patch varies 1.6× from the 10th to the 90th percentile (`:21`); the spread is two populations, marks at a median 11.1% of the canvas against objects at 21.7% (`:22`). 45 of 485 concepts carry an optical shift (`findings-optical.md:48`); 154 drawings sit off centre with no shift, 44 with a stated reason (`:59-60`). Of the spans sitting at the 1.5 floor, 67.9 / 65.1 / 41.5% deliver a clear pixel at 24 / 20 / 16 (`findings-air.md:733`). The 16 stroke was picked beside text — the lighter line was chosen so that it sits better beside 16 px text (`plans/stroke-16.md:13-15`), on a blind-pick sheet whose first section puts the icon beside text at 13 / 14 / 16 px (`lab/refs/stroke16.html` §1); what 24 and 20 were drawn beside is written nowhere |
| 5 | **complete** (HN#46665979; Moonb on Tabler) [praise C1.5] | the icon you need is there; a gap "kinda breaking the set" is failure mode 4 | scope, not an axis | the scope ranking (`tools/audit.mjs`, card 1.17) | re-ranked on the live Polaris names the 13 open slots go to 0 (`references-polaris.md` §3.3, PL-4); doc 06's D23 rulings still wait |
| 6 | **extendable** — published guidelines let others draw a matching icon (HN#33225949 on Feather; HN#24578576, a non-designer who could draw an icon that fits Mono's language because its rules were written down) [praise C1.6] | a customer can add the one icon we lack and it belongs | the rulebook itself | the rule register (card 1.14) and the enforcement gap (card 1.15) | docs/09's five missing rules: *all ten shipped, none of the five was written* (`rule-register.md:59`); the gap floor is stated four times and derived once (`:296`); every geometric rule is a warning (`enforcement-gap.md:32`). Nothing is published to customers yet — FD-2 |
| 7 | **craft: "hand-crafted", "drawn for its intended size", "meticulous"** [praise C1.7] | a 16 that was drawn at 16, not shrunk | **F6** behaviour across sizes · **F11** restraint | the cross-master diff (card 1.4) | 453 of 485 outline concepts keep their subpath count across the masters; 30 shed, 2 gain (`findings-scaling.md:22`); 280 of 287 keyline-held concepts sit on their keyline to 0.005 (`:21`); 0 of 485 hold their share of the canvas within 2% — the margin 2 · 2 · 1 sees to that (`:31`) |
| 8 | **flexibility that keeps quality** — weights and axes, but only if each stop is still a good drawing (Phosphor's co-author: a parametric slider costs each icon quality) [praise C1.8; B:Phosphor] | — | settled: **no weight axis** (`CLAUDE.md:188`) | — | the field's own best witness agrees with the settlement; §10 |
| 9 | **restrained character** — "personality without looking bespoke" (Moonb on Iconoir); "subtle but not too subtle" (HN#30357738) [praise C1.9] | refined, not comical — C2 as written (`docs/07-character.md:41`) | character | **eye-only**: the wall (4.1) | booked to §7 |

The note the report attaches to the list is the one to keep: *optical* is in none of the 402 HN comments [praise C1]
(the report's count, not reprintable). Our vocabulary (`optical:`, C14, C15, bearings) is the maker's; the customer's
judgement arrives as *consistent*, *crisp* and *balanced*, and those are F3–F5, F7 and F1/F2/F8.

---

## 2. The failure modes, ranked, and whether we are exposed

The ranking is the report's [praise C2]: 53 independent statements verified against raw text (HN 38; designers,
agencies, in-house teams and maintainer trackers 15), each coded by what it complains of. The report warns that the
top three are within two of each other and should not be over-read for order. Our exposure is cited from the wave-1
cards; nothing here was measured by this card.

| rank | failure mode | n (HN · designers) | axis | are we exposed? | our evidence |
|---|---|---|---|---|---|
| 1 | **generic, overused, dated, "looks like Google", "slop"** — "too generic" (HN#15090691), "slop alarm bells" (HN#46667103), Hugeicons "artificial and generic" (HN#40326711) [praise C2.1] | 12 (8 · 4) | **none** — this is the look of the whole 24-grid line-icon genre, and no rule can see it | **yes, by genre.** We are a 1.5-on-24 round-capped line set, which is the style the comments name. What the field says gets a set out of it is character held consistently, not a different grid | no instrument. The counter-measures we already have are C1–C8 (`docs/07-character.md:40-48`); whether they read is §7's first question, on the wall |
| 2 | **blur, not sharp, off-pixel, naive scaling** — HN#31122886 doubts any set's claim to be pixel-perfect; Vivaldi on SVG; "naively scale it up" (HN#24040518) [praise C2.2] | 11 (9 · 2) | **F7**, **F6** | **yes at 16, by construction; no to naive scaling.** C7 accepted that 1.25 is not a whole number of pixels (`docs/07-character.md:47`) | no straight line at 16 can sit crisp on both edges (`findings-grid.md:17`); of 312 scorable outlines, 172 (55%) have every straight line on one hard pixel with at most a quarter-grey shadow, 9 (3%) are in the worst band (`:21`); 189 of 363 drawings contain a run with no fully inked pixel at 16 (`:324`). Not a scale: 16 of 970 drawings at 24→20 are the other resized, 1.6% (`findings-scaling.md:120, :128`) |
| 3 | **inconsistency and drift** — the leader among designer sources: Vivaldi names drifting corner radii, strokes and angles; Moonb says mixed grids and strokes make a product look like the work of three separate people; HN#22374282 "something's off here"; Atlassian's 1,000 strays [praise C2.3] | 10 (4 · 6) | **F3 / F4 / F5** | **a little, invisibly.** The stroke is one number per master and the container ring is one drawing; the drift is in shared parts and corner radii, under half a pixel | nine shared parts across 30 concepts disagree at one master, largest 0.625 u = 0.42 px (`findings-grammar.md:435-436`); 4 within-family near-miss pairs under 0.05 u, 259 at a 2%-of-canvas band (`findings-primitives.md:1055-1057`); container corners sit on the three tiers 2.5 / 2 / 1.5 in 61.8 / 61.4 / 58.6% of cases and on one of the three in 93.4–93.8% (`findings-corners.md:49-51`, `:762`), with 12 distinct snapped container values at 24 and 75 typed `rx` values set-wide (`:737`); 82.49% of straight segments sit exactly on 0 / 45 / 90 and 84% of the rest are deliberate (`findings-angles.md:650`) |
| 4= | **coverage gaps** — "too small a collection" (HN#29872253); a missing icon "kinda breaking the set" (HN#24575698) [praise C2.4] | 7 | scope | **open** — doc 06's D23 rulings | the live Polaris re-rank: 0 open slots (`references-polaris.md` §3.3); the eight D23 revisions wait on Maruti (PL-1…PL-3) |
| 4= | **mixing sets, or cannot match the style when extending** — "stick to the same pack" (HN#46667166); HN#24578576 [praise C2.4] | 7 | **F5** + the published rulebook | **yes, for a customer**: our rules are internal and unpublished, and the shipped format is outlined fills (`CLAUDE.md:186`), so a customer who needs one more icon has nothing to draw to | FD-2 |
| 4= | **licensing, commercial friction, governance** (HN#24566247, HN#42195637; Geist internal-only) [praise C2.4] | 7 | outside the audit | ships to customers → Maruti's, not a drawing question | none; recorded so that wave 5 knows the field ranks it with coverage |
| 7 | **optical imbalance** — a contributor's RSS circle "visually denser" (HN#33226724); Lucide's cog "really out off balance"; "inherently just a blurry guideline" (Lucide #650) [praise C2.7] | 5 | **F1**, **F2** | **partly, and we already know where.** By mass: at a squint 1.6× across the row; two populations (marks against objects). By placement: 110 off-centre drawings nobody has judged | `findings-mass.md:21-22`; `findings-optical.md:59-60` (154 off centre with no shift; 44 with a stated reason, 110 unjudged); the optical census found C14 applied exactly where it was written (`:48`) |
| 8= | **no published spec, so no extending** — "don't provide design guidelines for extending" (HN#24566247) [praise C2.8] | 4 | the rulebook | **yes** — see 4= above | FD-2 |
| 8= | **sameness at a glance** — monochrome line icons that cannot be told apart at a glance (HN#24568191) [praise C2.8] | 4 | **F10** | **unknown — eye-only.** Card 1.5 declined to call it: *nothing in the repo measures it, no number in that document answers it, and it calls no verdict* (`findings-mass.md:484`) | the wall (4.1), sorted by silhouette — §7 |
| 10= | **noise when small** — detail that turns to noise once the icon is small (HN#27924549) [praise C2.10] | 2 | **F11** detail budget | **mostly held; the rule is unwritten.** We shed detail downward and never gain it | outline subpaths 1,409 → 1,375 → 1,352 across 24 → 20 → 16 (`findings-scaling.md:270`); 30 concepts shed, 2 gain (`:22`); the drop rule derived from Fluent and us, still unwritten (`references-fluent.md:182`, `:195`) — FD-3 |
| 10= | **metaphor errors** — scissors (HN#33226363) [praise C2.10] | 1 | scope / semantics | not an axis; doc 04's business | none |
| — | **outline/filled twin quality** — named by sellers only: 19 of the 26 sets Streamline reviews carry a twin con — identical in both styles (Heroicons, Eva, Ionicons), fill illegible (Remix, MingCute), line icons containing filled parts (Material, Radix, Font Awesome). Zero independent statements name it [praise C2; B:Streamline] | `[V*]` | **F13** | **the identical-twin con is the one our locked rule exists to avoid** (`CLAUDE.md:187`); the illegible-fill con is eye-only | 1,100 of 1,455 pairs hold the outer box exactly, 54 declared, 0 undeclared (`findings-filled.md:583`); 8 filled files are byte-identical in path data to their outline twin and differ only in root weight — `grid-3`, `grid-4`, `more-horizontal`, `more-vertical` at 24 and 20 (`:570-571`); at 16 no cut is thinner than 1.2× the line (`:368`); 204 of 1,455 pairs have tighter air in the filled drawing than anywhere in the outline (`:380`). Untitled UI's solid *is* the line drawing in a quarter of its set (`references-untitled.md:17` and §3) |

**Reading for Maruti.** Of the eleven ranked modes, four are axes with instruments already run (blur, drift, optical
imbalance, noise — five with the seller-named twin), three are the rulebook and scope (coverage, mixing, no spec), one
is governance, one is semantics, and two — *generic* and *sameness* — are the eye's alone. The two the eye owns are
ranked first and eighth. Nothing in wave 1 can tell Maruti whether the
set has the first fault; that is what the wall is for.

---

## 3. Atlassian — the counter-case — and hand-tuned against mechanically scaled

### 3.1 What Atlassian states and ships

[construction §2.5; praise A.4; B:Atlassian]. Sources the reports give: https://atlassian.design/foundations/iconography
(the spec), https://www.atlassian.com/blog/design/behind-the-screens-building-atlassians-new-icon-system (the account),
https://community.developer.atlassian.com/t/rfc-81-upcoming-changes-to-iconography/87753 (the developers' reply).

| | what they say or ship | basis |
|---|---|---|
| canvas and sizes | system icons drawn in a 16 × 16 box; sizes 16 (default) and 12 | S |
| stroke | 1.5 px on 16; the legacy set was 2 px on a 24 canvas. The reports give no reason for the change; the saved page says the thinner line was drawn for harmony with their updated typography (`web/atlassian_blog.txt:127`, evidence) | S, B |
| the 12 | a CSS downscale of the 16; the stroke becomes 1.125, measured | S, B, X |
| why not draw the 12 | they trialled a small hand-drawn 12 px set that kept the 1.5 stroke and found it "too restrictive" once more teams needed every icon in tight spaces beside small text; drawing every icon at several sizes was the cost they declined | B |
| why the downscale was accepted | shrinking size and stroke together worked, they report — and the thinner line matched the smaller text better than the drawn 12s had | B |
| what the legacy scaling had cost | teams scaling icons by hand left the stroke, the padding and the size varying from place to place; an audit found over 1,000 custom icons | B |
| the developers' reply | one developer predicted that removing the size prop would bring chaos rather than consistency (post 3) and that a proportional scale changes nothing (post 7); Atlassian's answer (post 6) was that forbidding scaling is what makes the iconography consistent | P, V |
| pixel policy | stroke edges aligned to the pixel grid; caps squared off so the path lands on a pixel edge; interior corners kept sharp | S, B |
| margin | n/s; of 60 sampled core icons 27 reach the full 16 box edge | F |
| keylines, radius, filled, modifiers | a template with keyline shapes exists, dimensions not published; rounded outer corners, no value; filled and modifiers n/s | S |

### 3.2 What constraint it answers — and whether it is ours

Atlassian's question was *do we draw a second size, or scale the first?* — asked under five conditions: one company's
product UI, a renderer they control (the icon component sets the size, and the change removed the caller's ability to
scale), one stroke, exactly two sizes a factor 0.75 apart, and a text size at the smaller end that the icon had to
sit beside. Under those, a proportional downscale holds the stroke's share of the canvas (9.4% at both sizes,
[construction §3.3]), lands at one known factor, and is applied once, by them.

Against the transfer test's second question — *does their constraint match ours?* — on each of our six:

| ours (Settled) | theirs | match? |
|---|---|---|
| we do not control render size (`CLAUDE.md:192`) | they removed the caller's control of size; the only scale that exists is the one they ship | **no** — the premise that makes their downscale safe is the one we lack |
| three hand-drawn masters (`CLAUDE.md:191`) | one drawn master; a second size they chose not to draw, on cost | **no** — they answered the question we have already settled the other way |
| no weight axis (`CLAUDE.md:188`) | one stroke | yes |
| outline and filled drawn as a pair (`CLAUDE.md:187`) | n/s | unknown |
| outlined fills shipped from a private stroked source (`CLAUDE.md:186`) | n/s | unknown |
| published optical metrics (`dist/metrics.json`) | none | **not decided by this row** — bearings are computed from whatever file ships, and a scaled file's bearings scale with it |

So the conclusion — ship the next size down as a scale — fails the test on the first two rows and is refused (§10). **The method
survives:** take a good drawing, scale it and its stroke by the same factor, put it beside the text it will sit with,
and let the eye say whether the drawn size earns its keep. That is a test we can run on a lab surface (§8, FD-5), and it
is exactly the shape of the plan's open question.

### 3.3 Hand-tuned per size against mechanically scaled — the field's two camps

The report's own synthesis [praise C3], in our words:

**For tuning** — Heroicons Micro: icons come out much sharper when drawn for the exact size they will be used at;
redrawn from scratch with less detail, triggered by 20 px icons that felt too big beside 14 px text
[praise B:Heroicons]. Cursor: one 16 drawing scaled to 32 means "that 1.25px stroke becomes 2.5px", heavier than
anything drawn at that size; the small icons are simplified so the room stays empty; the explicit analogy is a
typeface's Text and Display cuts [praise B:Cursor icons; C3]. Glyphs on SF Symbols: at smaller sizes the same stroke
reads too dense and dark, so the stroke must thin [praise B:SF Symbols]. Atlassian's own legacy: hand scaling broke
stroke, padding and size. Fluent 2's product icons: use at specific sizes, simplify below 48
[praise B:Microsoft Fluent System Icons]. HN#27924549: vectors scale, the eye does not. Phosphor's co-author:
parametric sliders cost quality.

**Against, or in tension** — Atlassian's finding that a scaled 16 with its stroke reduced worked, and its developers'
view that proportional scaling changes nothing. HN#27925063: the pixel grid is a leftover of 72- and 96-dpi screens.
Spectrum 2 gave up pixel-perfect snapping. Cursor's 1.25 "stays crisp anyway" with no snapping — though Cursor still
redraws per size. Nucleo and Lucide ship one master with an adjustable stroke and claim balance across stroke values.

**The observable tells of a real redraw** [praise C3] (the agent's own criteria, tagged `[I]`): the path data differs per size
rather than scaling uniformly (Fluent's `search` builds its handle differently at 16, 20 and 24); the stroke-to-size
ratio changes; detail is dropped at the small size; cut and gap sizes are held in grid units rather than scaled;
Cursor adds optical breaks at junctions and stroke thinning where lines converge.

### 3.4 The plan's open question: is 20 a master or a scale?

This card does not answer it. What it adds is the field's test and the four tells, each of which a wave-1 card has
already measured on our 20:

| tell | our 20, measured | where |
|---|---|---|
| the stroke-to-size ratio changes | stroke ÷ canvas 0.0625 / 0.0750 / 0.0781 at 24 / 20 / 16 — a proportional 24 × 0.833 would put 1.25 at 20, and the 20 draws 1.5 (`tools/masters.mjs:10`) | `findings-scaling.md:285` |
| the path data is not a uniform scale | 16 of 970 drawings at 24→20 are the other resized (1.6%) — card 2.1 counts 1 of 970 by its own definition (§9); 33.5% of the 24 coordinates land on the 20 grid at 0.8333 | `findings-scaling.md:128`, `:138`; `references-fluent.md:326` |
| detail is dropped, never gained | 453 of 485 keep their subpath count; 30 shed, 2 gain | `findings-scaling.md:22` |
| cuts and gaps held in grid units | the gap floor is a literal 1.5 at every master (`tools/masters.mjs:64`); at 16 no cut is thinner than 1.2× the line | `findings-filled.md:368` |

Cards 1.4 and 2.1 each state a verdict (`findings-scaling.md:120`; `references-fluent.md:325`, T6). The Settled table's
row reads three drawn masters (`CLAUDE.md:191`). Wave 5 folds the two measured verdicts into that row and says what
*drawn* means for the 20 — by the four tells above, not by this card. The one thing the field adds that no card has run
is Atlassian's eye test, FD-5: the scaled 24 beside the drawn 20, beside text.

---

## 4. The construction-systems calibration — methods through the transfer test

### 4.1 The numbers, normalised both ways

The plan's rule: a reference length means nothing across systems until it is also a share of its canvas and a
multiple of its own stroke. The rows below are transcribed from the construction report (the section each cites) —
except Fluent's air floor and cut, which card 2.1 measured from the Figma file and which replace the report's
repo-sourced sentence (§6 kind 2, item 5; §9) — and our own rows, from `tools/masters.mjs:10-64`, `CLAUDE.md:93` and
the report's own `K` row for the proposed container radius [construction §3.4]. `check` verifies that every
transcribed snippet is in its source and that every value is one of the numbers written in that snippet;
`normalise` prints the table.

Each column means one thing. *Circle keyline* and *square keyline* are the keylines' ink where the system states or
the report measured them. *Corner radius* is the general outer corner. *Air floor* is the stated minimum gap between
strokes, or for Fluent the measured separation. *Cut width* is the width of a line knocked out of a filled shape.
*Outer bound* is the system's own outer drawing limit: a stated *live* area where one is published, else the circle
*keyline*, else (Lucide) the *stated* distance from the edge; the margin is the canvas minus that bound, halved, and
is given in strokes. `n/s` not stated.

| system | size | stroke ÷ canvas | circle keyline (share · strokes) | square keyline | corner radius | air floor | cut width | outer bound (kind; share · margin in strokes) | basis |
|---|---|---|---|---|---|---|---|---|---|
| Material (Symbols, w400) | 24 | 8.3% | 20 (83.3% · 10.00×) | 18 (75.0% · 9.00×) | 2 (8.3% · 1.00×) | n/s | n/s | 20 live (83.3% · margin 2 = 1.00×) | S + F |
| Material (Symbols, w400) | 20 | 7.5% | 16 (80.0% · 10.67×) | 14 (70.0% · 9.33×) | 1.5 (7.5% · 1.00×) | n/s | n/s | 16 live (80.0% · margin 2 = 1.33×) | S + F |
| Fluent (Regular) | 24 | 6.3% | 20 (83.3% · 13.33×) | 18 (75.0% · 12.00×) | 3.25 (13.5% · 2.17×) | 1 (4.2% · 0.67×) | 1.5 (6.3% · 1.00×) | 20 keyline (83.3% · margin 2 = 1.33×) | X, F; gap and cut measured by card 2.1 |
| Fluent (Regular) | 20 | 5.0% | 16 (80.0% · 16.00×) | 14 (70.0% · 14.00×) | 3 (15.0% · 3.00×) | 1 (5.0% · 1.00×) | 1 (5.0% · 1.00×) | 16 keyline (80.0% · margin 2 = 2.00×) | X, F; gap and cut measured by card 2.1 |
| Fluent (Regular) | 16 | 6.3% | 14 (87.5% · 14.00×) | 12 (75.0% · 12.00×) | 2.5 (15.6% · 2.50×) | 0.95 (5.9% · 0.95×) | 1 (6.3% · 1.00×) | 14 keyline (87.5% · margin 1 = 1.00×) | X, F; gap and cut measured by card 2.1 |
| IBM Carbon | 16 | 6.3% | n/s | n/s | 1 (6.3% · 1.00×) | n/s | n/s | 14 live (87.5% · margin 1 = 1.00×) | S |
| IBM Carbon | 32 | 6.3% | n/s | n/s | 2 (6.3% · 1.00×) | n/s | n/s | 28 live (87.5% · margin 2 = 1.00×) | S |
| Atlassian (core) | 16 | 9.4% | n/s | n/s | n/s | n/s | n/s | n/s | S |
| Atlassian (12 = CSS downscale) | 12 | 9.4% | n/s | n/s | n/s | n/s | n/s | n/s | X |
| Polaris | 20 | 7.5% | 14 (70.0% · 9.33×) | 13 (65.0% · 8.67×) | 1–3 (5.0%–15.0% · 0.67×–2.00×) | 1 (5.0% · 0.67×) | n/s | 16 live (80.0% · margin 2 = 1.33×) | S |
| Spectrum 2 (web, primary) | 20 | 7.5% | n/s | n/s | 1.5 (7.5% · 1.00×) | n/s | n/s | 18 live (90.0% · margin 1 = 0.67×) | S |
| SLDS utility | 16 | 6.3% | 16 (100.0% · 16.00×) | 16 (100.0% · 16.00×) | 1 (6.3% · 1.00×) | 1 (6.3% · 1.00×) | n/s | 16 keyline (100.0% · margin 0 = 0.00×) | S |
| SLDS utility | 24 | 8.3% | 24 (100.0% · 12.00×) | 24 (100.0% · 12.00×) | 2 (8.3% · 1.00×) | 2 (8.3% · 1.00×) | n/s | 24 keyline (100.0% · margin 0 = 0.00×) | S |
| Phosphor regular (256 units = 16) | 16 | 6.3% | 208 (81.3% · 13.00×) | 192 (75.0% · 12.00×) | 16 (6.3% · 1.00×) | n/s | n/s | 208 keyline (81.3% · margin 24 = 1.50×) | F |
| Lucide / Feather | 24 | 8.3% | 22 (91.7% · 11.00×) | 20 (83.3% · 10.00×) | 2 (8.3% · 1.00×) | 2 (8.3% · 1.00×) | n/s | 22 stated (91.7% · margin 1 = 0.50×) | S; F |
| Heroicons outline | 24 | 6.3% | 19.5 (81.3% · 13.00×) | n/s | n/s | n/s | n/s | 19.5 keyline (81.3% · margin 2.25 = 1.50×) | S; F |
| Heroicons micro (solid) | 16 | n/s | 14 (87.5% · n/s) | n/s | n/s | n/s | n/s | 14 keyline (87.5% · margin 1 = n/s) | F |
| Radix | 15 | 6.7% | 13.24 (88.3% · 13.24×) | 13 (86.7% · 13.00×) | n/s | n/s | n/s | 13.24 keyline (88.3% · margin 0.88 = 0.88×) | F |
| Untitled UI (Line) | 24 | 8.3% | 22 (91.7% · 11.00×) | 20 (83.3% · 10.00×) | 3 (12.5% · 1.50×) | n/s | n/s | 22 keyline (91.7% · margin 1 = 0.50×) | M; F |
| Nucleo UI | 18 | 8.3% | n/s | n/s | n/s | n/s | n/s | 16 live (88.9% · margin 1 = 0.67×) | M |
| Nucleo Micro Bold | 20 | 10.0% | n/s | n/s | n/s | n/s | n/s | 16 live (80.0% · margin 2 = 1.00×) | M |
| Octicons | 16 | 9.4% | 16 (100.0% · 10.67×) | n/s | 1 (6.3% · 0.67×) | 1 (6.3% · 0.67×) | n/s | 16 keyline (100.0% · margin 0 = 0.00×) | S; F |
| Octicons | 24 | 6.3% | 22 (91.7% · 14.67×) | n/s | 1 (4.2% · 0.67×) | 1 (4.2% · 0.67×) | n/s | 22 keyline (91.7% · margin 1 = 0.67×) | S; F |
| Mavan | 24 | 6.3% | 20 (83.3% · 13.33×) | 18 (75.0% · 12.00×) | 2.5 (10.4% · 1.67×) | 1.5 (6.3% · 1.00×) | n/s | 20 keyline (83.3% · margin 2 = 1.33×) | K |
| Mavan | 20 | 7.5% | 16 (80.0% · 10.67×) | 14 (70.0% · 9.33×) | n/s | 1.5 (7.5% · 1.00×) | n/s | 16 keyline (80.0% · margin 2 = 1.33×) | K |
| Mavan | 16 | 7.8% | 14 (87.5% · 11.20×) | 12 (75.0% · 9.60×) | n/s | 1.5 (9.4% · 1.20×) | 1.5 (9.4% · 1.20×) | 14 keyline (87.5% · margin 1 = 0.80×) | K |

Notes on the rows. Material's 20 is an optical-size instance of one variable font, not a drawing. Fluent publishes no
live area; its bound is the circle ink the report measured, and its air floor is card 2.1's measured separation
(1.00 · 1.00 · 0.95 at 24 · 20 · 16), its cut card 2.1's measured knocked-out line (1.5 · 1.0 · 1.0) — one stroke at
every size (`references-fluent.md:118`, `:122`). Atlassian publishes neither a live area nor keyline dimensions; of 60
sampled icons 27 reach the box edge (§3.1), so its bound is left `n/s`. Polaris's radius is the stated range, one to
three, by object roundness. Octicons' floor is its 1 px gap between overlapping objects; its 1.5 px gap around modifier
elements is a second, larger figure [construction §2.17 Gaps]. SLDS's 16 and 24 keylines fill their grids; its
separate 52-unit utility artboard holds a 48 live area (92.3%) [construction §2.8; §3.1]. Phosphor's 256-unit file is
its 16 grid × 16. Untitled's keyline inks are derived from its stated centreline circle and square plus its stroke.
Nucleo's rows are marketing numbers (`M`). Our container radius is the proposed 2.5 at 24 only; our cut is the 1.5 that
a white line punched out of a filled shape holds at 16, with no single policy yet at 24 and 20
(`findings-filled.md:334`).

**What the table says in plain words, for Maruti:**

- **On apparent size we are the mainstream.** Our keyline table is Material's and Fluent's at 24 and 20, and Fluent's at
  16, where Material has no master [construction §1.4]; our circle:square 1.111 is the figure the field converges on —
  Material, SF Symbols (1.099–1.111 over nine weights), Fluent at 24, the Lucide family — against Polaris 1.077,
  Radix 1.018, SLDS utility 1.000 [construction §1.3; §3.2]. Our outer bound 83.3 / 80 / 87.5% sits inside the 80–92%
  every margin-keeping system uses; Octicons 16 and Atlassian run full-bleed [construction §3.1].
- **On stroke we sit between the camps at 16 and with the majority at 24.** At 24, 6.25% is Fluent's, Heroicons',
  Phosphor's and IBM's figure too; at 16 our 7.8% lies between the 1.0 camp (6.25%: IBM, SLDS, Fluent as shipped,
  Phosphor) and the 1.5 camp (9.4%: Octicons, Atlassian, Spectrum). "Nobody publishes 1.25 at 16" among the 17
  [construction §1.2] — the one set that does is Cursor's, a product set rather than a published system, and it is the
  evidence C7 already cites (`docs/07-character.md:47`; [praise D]). The two reports do not disagree; they survey
  different populations (§9).
- **On the radius the field is split, and the side that ties it to the stroke ties it to one stroke.** Of the seven
  systems whose radius the report can place, three tie it to the stroke — IBM and SLDS state it, Material Symbols
  measure it at every optical size — and four set it independently: Lucide, Octicons, Polaris and Fluent
  [construction §1.5; §3.4; §5]. Where it is tied, the outer corner is one stroke. Our bend (C10) is half the weight
  on the centreline, so its *outer* radius is one stroke — the tied camp's relation by another route (0.75 + 0.75 =
  1.5 at 24). Our proposed container corner is a different thing: 2.5 on the centreline, outer 3.25 · 2.75 · 2.25
  (`docs/07-character.md:63`), which is 1.67 strokes at 24 — and Fluent's rounded-square outer radius as shipped is
  3.25 at 24, 3.0 at 20, 2.5 at 16 [construction §2.3 Radii]. So the open container-radius ruling has two precedents
  to be settled against, both methods: *radius = one stroke* (the tied camp) and *a named container step* (Fluent's,
  which card 2.1 took as T3).
- **On air we are the most generous in the field, by our own line, at 16 only.** The field's floors run 0.67 strokes
  (Polaris, Octicons, Fluent's measured separation at 24) to 1.0 stroke (Lucide, SLDS, Fluent's at 20 and — at
  0.95 — 16). Ours is 1.0 at 24 and 20 and **1.2 at 16** — card 2.1's *1.26× theirs at 16, not 2×*
  (`references-fluent.md:249`) is the same reading, and it replaces the plan's worked example (§9).
- **On margin we and Fluent draw the same units and we hold less of it in strokes below 24.** Both keep 2 · 2 · 1
  units outside the circle keyline at 24 · 20 · 16; in strokes that is ours 1.33 / 1.33 / 0.8 against Fluent's
  1.33 / 2.0 / 1.0, because Fluent's line is thinner at 20 and 16 — equal at 24, 0.67 of a stroke less at 20, 0.2
  less at 16. Card 2.1's finding that our *drawings* keep one more unit of margin than Fluent's at every shared
  master is about the median drawing, not the keyline (`references-fluent.md` §5); both are true.

### 4.2 Each method through the transfer test — take / refuse / why

The four questions (`plans/set-and-rules-audit.md:412-419`): (1) does it answer a question we already have; (2) does
their constraint match ours on it; (3) is it a method, not a value; (4) can we check it, or book it eye-only with a
surface. Values never cross; only the way a number was derived or verified.

| method, and who practises it | (1) our question | (2) constraint | (3) | (4) | verdict |
|---|---|---|---|---|---|
| **Keylines as canvas minus a fixed margin, circle two units larger than the square** — Material, Fluent, the Lucide family [construction §1.4; §3.2] | F2 | matches | method | lint checks them today | **already ours** — corroboration, nothing to take |
| **Outer corner radius = one stroke** — IBM, SLDS stated; Material measured at every optical size; four other systems set the radius independently [construction §1.5; §3.4; §5] | the open container-radius ruling (docs/09 §6; `docs/09-rule-audit.md:61-63`) | partly: their one law spans sizes that are scaled or interpolated; ours would span drawn masters | method (a law, not a number) | `radii.mjs` role-tags corners (card 1.2) | **take as a candidate law** for the ruling, beside Fluent's named steps (card 2.1, T3); card 1.2 already found our three tiers obey three different laws (`findings-corners.md:736`) — the ruling should pick one |
| **Four stroke-against-size regimes** — proportional (IBM, Atlassian 16→12), stepped (Fluent, SLDS), slower than linear (Material, SF), constant (Octicons, Spectrum) [construction §1.8; §4] | the parameter map (3.3): what kind of thing our stroke table is | matches as a description | method (a classification) | arithmetic on `tools/masters.mjs:10` | **take as vocabulary**: ours is stepped by master with the share rising as the master shrinks (6.25 → 7.5 → 7.8%); the stroke itself is fixed input and not reopened |
| **A redraw keeps topology; what dies first is repeated interior marks** — Fluent 27 of 27, Octicons 42 of 47, Heroicons 33 of 39 keep the subpath count; trash ribs 5→3, calendar cells 14→7, branch circles 8→4 [construction §1.6; §4.5] | F11, docs/09 §4's missing detail budget | matches | method | card 1.4 counted ours (30 shed, 2 gain; `findings-scaling.md:22`) | **take** — and the field adds one fact: the report found no UI-icon system that publishes a rule for which detail dies. Card 2.1 derived one (`references-fluent.md:182`, `:195`); writing it would be a first → FD-3 |
| **The filled twin keeps the outer ink box** — Material 100% (27 of 27), Phosphor 97%, Heroicons 90%, SF 81%, Fluent 76–84%, Polaris 60% [construction §1.7] | F13 | matches at the strict end | the figures are values; the method is ours already (zero tolerance + `grows:`) | card 1.8: 1,100 of 1,455 exact, 54 declared (`findings-filled.md:583`) | **corroboration, values refused** — the percentages go to §9 where later cards measured the same pairs |
| **Minimum gap as a multiple of the stroke** — stated floors of 1× (Lucide, SLDS) and 0.67× (Polaris, Octicons) [construction §4.6; §5]; Fluent's measured separation 0.67× · 1.0× · 0.95× at 24 · 20 · 16 (`references-fluent.md:122`) | F8 | no: each has one weight per size; our 16 line is lighter than our floor by design | value | — | **refuse** — settled 2026-09-28 (`CLAUDE.md:230`): the floor is a literal 1.5. Kept only as the normalised position (§4.1) |
| **Pixel policy keyed to the stroke width** — 1 px on .5, 1.5 on .25/.75, 2 on whole numbers (Fluent `K`); outer edge on the pixel, not the inner (Octicons; Font Awesome's advice to let the inner edge blur and keep the outer edge sharp) [construction §2.3 Grid; §2.17 Caps / pixel; praise B:Font Awesome] | F7 | matches in kind | method | card 1.6 measured where our edges land | **already ours** — C7's construction puts 16 centrelines on x.375 / x.625 so outer edges stay on the pixel; 76.0% of straight length does (`findings-grid.md:241`). Corroboration. The field is split on whether to snap at all [construction §5] |
| **One badge zone, stated** — Fluent bottom right, filled; Spectrum badges bottom right, dots top right; Lucide mixed in practice [construction §2.3 Modifiers; §2.7 Modifiers; §2.10 Variants / modifiers] | F5, the modifier zone | matches | method | card 1.9's census | **already proposed** — P1 (`findings-grammar.md`); the field adds that the majority zone, where one is stated, is bottom right. No new proposal |
| **Compare visual weight against the circle and the square, with a blur test** — Lucide; Fluent (`K`) [construction §2.10 Keylines; §2.3 Optical] | F1 / F2 | matches | method, eye-only | the wall (4.1) at 1×, blurred | **take as the eye's procedure on the wall** — card 1.5's darkest-patch reading is the instrument half of it (`findings-mass.md:21`) |
| **Angles on a grid for even anti-aliasing** — IBM: 45°, else multiples of 15° [construction §2.4 Angles] | our 0 / 45 / 90 grid | matches in kind | method | card 1.3 | **corroboration** — 82.49% exactly on axis, 84% of the rest deliberate (`findings-angles.md:650`). No change |
| **Detail budget as a count** — Polaris: a filled icon is one to three contiguous shapes [construction §2.6 Detail budget; §4.6] | F11 | partly (filled only) | a value | — | **refuse as a number**; note the report's own verdict that no system publishes a count of strokes or shapes per size |
| **Do not resize the asset** — Polaris, Spectrum, IBM; Fluent (card 2.1, T6) [construction §3.5; §5] | F6 | **no** — we do not control render size | method | — | **refuse**; what we do instead is publish metrics (F12) and draw three masters. Recorded in §10 |
| **A weight axis** — Material, Phosphor, SF; or separate drawings per weight — Streamline [construction §4.4] | none open; Settled: no axis (`CLAUDE.md:188`) | no | — | — | **refuse** (§10); Phosphor's own co-author says a slider costs quality, and Streamline draws each weight separately for the same reason [praise B:Phosphor; construction §2.14] |
| **Margin as a budget, spent on weight** — Material and IBM may enter the padding; Polaris forbids it [construction §5 Margin / live area] | F2 | — | method | — | **already taken** by card 2.1 as T4 (`references-fluent.md:306`) with its question for Maruti; not a second take |
| **Square caps and sharp interior corners for pixel alignment** — Material, IBM, Atlassian; round for the other nine [construction §5] | none open; C1 settled round (`docs/07-character.md:40`) | no | value | — | **refuse** |
| **Three optical-size masters interpolated** (SF), **one variable font** (Material) [construction §4.3] | none | no | — | — | **refuse**; card 2.2 covers SF |
| **Review and ownership as the mechanism of consistency** — closed authorship (Phosphor, Feather, Iconoir); a tracked list of 155+ repeating elements (Cursor); art-director sign-off (Streamline); 30-day review (IBM) [praise A.2; C4.1; D] | F4 / F3 — relationships between drawings | matches: one hand already | method | card 1.1's congruence classes are the list | **take** → FD-1 |
| **Constraints that cannot be broken against guidelines judged case by case** — Feather's split; Lucide's #650 ("inherently just a blurry guideline"); Polaris, whose keylines are a starting point rather than a constraint [praise B:Feather; C2.7; B:Shopify Polaris] | the severity model (card 3.5) | matches | method | `severity-proposal.md` §3 | **take** → FD-4 |
| **The text-pairing test** — Heroicons Micro (20 px beside 14 px text), Atlassian (12 beside small text), Carbon (16 and 20 beside Plex 14 and 16), Cursor (1.25 beside 16 px) [praise B:Heroicons; B:Atlassian; B:IBM Carbon; D] | F1 — "weight matched to type" (§1, group 4) | matches | method | a lab surface with text (the In-context panel) | **take** → FD-6 |

### 4.3 What the field does not settle

The construction report's §5 lists 13 topics on which respected systems take opposite positions [construction §5].
The ones that touch an open ruling of ours: stroke at 16 (1.0 against 1.5); stroke as size changes (proportional ·
stepped · slower than linear · constant); redraw against scale; whether the asset may be resized; square against
round ends; sharp against rounded interior corners; pixel snapping required (IBM, Material, Atlassian, Octicons,
Polaris, Fluent) against dropped (Spectrum 2); strict against permissive margin; the filled twin's box must match
(Material) or need not (Polaris); minimum gap 2 px (Lucide) against 1 px (Polaris, Octicons, Fluent); radius equal to
the stroke (IBM, SLDS, Material) against independent of it (Lucide, Octicons, Polaris, Fluent). On each, a camp is
not a consensus, and the eye decides for us.

---

## 5. People worth reading — one method each

The report's list [praise C4], most substantial first; each with the one method worth taking, or none.

| who | what it is | the method, if any |
|---|---|---|
| 1. Marek Minor, *The making of Cursor's icons* (2026) — https://www.minoradventures.co/blog/the-making-of-cursors-icons [praise C4.1] | two sizes, "each on its own grid", 16 at 1.25 and 24 at 1.5; over 155 tracked repeating elements; the stroke found by eye beside the product's type; no pixel snapping; optical breaks at junctions | **the tracked-element register** (FD-1) and **the stroke chosen beside text** (FD-6). Already quoted by C7 (`docs/07-character.md:47`) and docs/09 §5. His account of how 1.25 was found — the number records a decision the eye had already made — is the plain-language form of C15 [praise D] |
| 2. Atlassian, *Behind the screens*, with the RFC-81 developer thread — URLs in §3.1 [praise C4.2] | the only public record of what removing scaling costs a developer base, and of a hand-drawn small size tried and dropped | **the downscale-beside-text test** (FD-5). The conclusion is refused (§3.2) |
| 3. The optical-volume lineage: Nucleo's guidelines → Cole Bemis's Feather constraints against guidelines (https://github.com/feathericons/feather/issues/171#issuecomment-455356985) → Octicons (https://primer.style/octicons/design-guidelines) and Lucide's design principles; the live argument in Lucide #650 [praise C4.3] | the field's own record that a pure rulebook fails at the optical edge | **the two-tier rulebook** (FD-4); Nucleo's text itself could not be read (Cloudflare) [praise B:Nucleo] |
| 4. IBM Design Language, UI icons, design and contribute pages — https://www.ibm.com/design/language/iconography/ui-icons/design [praise C4.4; construction §2.4] | padding = stroke = radius = 1/16 of the canvas at every size, scaled linearly; whole-pixel coordinates; inconsistent weights "look like a mistake" | calibration only (§4.1). The one-law-scaled form is the counter-model to our three drawn masters; nothing taken |
| 5. Adam Wathan and Steve Schoger, *Heroicons Micro* — https://tailwindcss.com/blog/heroicons-micro [praise C4.5] | a per-size redraw with less detail, triggered by the text it sat beside | the text-pairing trigger (FD-6); the detail rule's practice (FD-3) |
| 6. Marc Edwards (Bjango) on SF Symbols — https://mjtsai.com/blog/2019/06/10/sf-symbols/ [praise C4.6] | blur is built into the technique, he argues, because the symbols are "built to a 100pt font grid" that matches no pixel size | none to take — a warning about typographic grids, which card 2.2 covers and we do not use |
| 7. Streamline — grids and key shapes (https://blog.streamlinehq.com/grids-and-keyshapes), evaluating icons (https://blog.streamlinehq.com/evaluating-icons/) [praise C4.7] `[V]` | key shapes; "prioritize legibility over consistency"; daily review with art-director sign-off | corroborates C0 (rules serve the drawing) and our approval loop; nothing new |
| 8. Dave Gandy (Font Awesome) — https://davidwalsh.name/6-tips-designing-crisp-readable-icons; Jory Raphael's grid series [praise C4.8] | let the inner edge of a shape blur and keep the outer edge on the pixel | the outer-edge pixel policy — already C7's construction (§4.2) |
| 9. Atle Mo (Vivaldi) — https://vivaldi.com/?p=35331; Francesco Cutolo (Wolt); Marina Rizo (Mono) [praise C4.9] | the best short taxonomy of inconsistency: corner radius, strokes, angles | the taxonomy is our axes F2, F1 and card 1.3; nothing to add |
| 10. Jon Hicks, *The Icon Handbook* (2011) — https://hicks.design/journal/the-icon-handbook [praise C4.10] | the report read only its description | none |
| 11. Glyphs on SF Symbols' weight × size space — https://glyphsapp.com/learn/creating-an-sf-symbol [praise C4.11] | smaller sizes need thinner strokes | corroborates C7's direction; a value-free statement of why 1.25 at 16 |
| 12. Helena Zhang and Tobias Fried on Phosphor — https://changelog.com/podcast/618 [praise C4.12] | a parametric weight slider costs each icon some of its quality, in the co-author's own account | supports the no-axis settlement; nothing to take |

---

## 6. Judged list — three kinds, kept apart

**Kind 1 — a drawing disagrees with a rule as stated.** None. This card measured no drawing.

**Kind 2 — a rule or a document disagrees with another, or with its source.** The field reports touch five, four of
them already on record; this card adds the third independent measurement to the first and corrects a claim inside the
construction report itself.

| # | finding | evidence | status |
|---|---|---|---|
| 1 | `docs/07-character.md:47` (C7's evidence) and `docs/08-refinement.md:375` say Fluent draws 1.5 at the small sizes and agrees with us. The construction report measured 183 shipped Fluent files and found Regular 1.0 / 1.0 / 1.0 / 1.5 / 1.5 / 2.0 / 2.5 at 12 … 48 [construction §1.1; §2.3 Stroke (regular), measured] — the same ladder card 2.1 read from the Figma file (`references-fluent.md:381`) and the Corrections table records. Three independent measurements, one answer | `stale-statements.md:35-40`; `references-fluent.md` K1 | already recorded; **not reinstated here**. The report's own suggestion to settle it by re-reading the Figma frame is moot — card 2.1 did |
| 2 | The plan's worked example (`plans/set-and-rules-audit.md:250-253`) puts Fluent's separation at 0.67 of its own stroke and ours at close to twice as generous; it inherits the 1.5-at-16 slip. The construction report's stroke table is the reason the arithmetic changed | `references-fluent.md:399` K3: **1.26× at 16, not 2×**; the normalised rows in §4.1 agree (Fluent 0.95× at 16, ours 1.20×) | already recorded (card 2.1); the field confirms |
| 3 | `CLAUDE.md:310` says Nucleo carries per-icon `stroke_max` metadata; the construction report cites that repo claim as `K` [construction §2.16] | `references-nucleo.md:458` K2 and `:86`: one constant per set and grid, on 1,429 icons (2.2%) | already recorded; the report leaned on the stale claim and did not measure it |
| 4 | `CLAUDE.md:305` says Fluent's filled twin shares the base geometry verbatim. The construction report measured identical ink boxes in 76% (16), 80% (20), 84% (24), 80% (32) of 25 pairs, the filled slightly larger, and a +0.5 stroke on line-only icons at every size [construction §2.3 Filled; §1.1] | `stale-statements.md:197`: holds for 1,109 of 1,293 pairs (85.8%); `references-fluent.md:340`: 75–84% | partly stale, already listed; the field report is a second measurement by a different method (§9) |
| 5 | **New.** The construction report states Fluent's cut-outs as 1 px at every size but 48 on the repo's authority (`K`) [construction §2.3 Modifiers]. Card 2.1 measured the punched-line width from the file at 1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50 — one stroke at every size, so 1 px only at 12–20 | `references-fluent.md:118`, and its K2 on `docs/08-refinement.md:113` | the report's `K` row is the stale sentence restated; §4.1 uses card 2.1's measured values and the report's sentence stands only in §9 |

**Kind 3 — fine by every rule and still wrong.** No finding; two candidates the field puts first and eighth, which no
rule of ours can see: *generic* and *sameness at a glance* [praise C2.1; C2.8]. Both are booked eye-only (§7). They
are recorded here so that wave 3's findings register carries a kind-3 line for them even though no instrument
produced one.

---

## 7. What only Maruti's eye can settle, and where

1. **Does the set read as generic, or as a character held consistently?** The field's first failure mode, and the
   flip side of its second praise word (neutral, blends in). On the wall (4.1) at real 16 px beside the reference rows
   in `lab/character.html`, Outline and Filled. No instrument; card 1.5 declined a verdict (`findings-mass.md:484`).
2. **Does the set read as one hand?** The field's first praise word. On the wall sorted by family, and on the primitive
   sheets (4.2) with every instance of a shared part overlaid — the drift card 1.9 found is under half a pixel
   (`findings-grammar.md:436`), and whether that is invisible is the eye's call.
3. **Sameness at a glance** — twenty at 16, squinted, still distinct? The wall sorted by silhouette; F10 is eye-only by
   the plan's own table (`plans/set-and-rules-audit.md:444`).
4. **Is the 20 a drawing worth its cost, by Atlassian's test?** The 24 scaled by 0.833 with its stroke (1.25) beside the
   drawn 20 (1.5), each beside the text it is meant to sit with — a surface wave 4 does not yet plan (FD-5).
5. **Weight beside type.** Which text size each master was drawn for; the 16 is on record — its lighter line chosen to
   sit better beside 16px text (`plans/stroke-16.md:15`), on a sheet offering 13 / 14 / 16 px with 14 selected by
   default (`lab/refs/stroke16.html:26`) — and 24 and 20 are not. The In-context panel of `lab/icon.html` shows an icon in a menu row and inline; the ruling is FD-6.
6. **Crispness at 1×.** Card 1.6 has the bands (`findings-grid.md:21`); whether band B — some lines hard, some with no
   solid pixel, in one icon — reads as a fault is seen only on a 1× screen: the wall at 1× (4.1).

---

## 8. Proposals for Maruti to rule on

**These are proposals, not decisions. Each carries a recommendation and its evidence; nothing in the set, the rules,
lint, the sheet or the docs changes until Maruti rules.** They go to the wave-5 decision agenda (card 5.2). Every one
is a method; none carries a number from any system.

**FD-1 — Make the tracked-element register the standing instrument of "one hand".** *What Maruti would see:* a
sheet per shared part (the ring, the plus, the chevron, the dot, the badge, the slash) with every instance overlaid,
and a line in the approval step that checks a new icon's parts against it. *The field:* consistency is credited to
ownership and tracking, not to the grid — Cursor tracks over 155 recurring elements [praise C4.1; D], Phosphor,
Feather and Iconoir refuse outside icons, Streamline sells "the same team" [praise A.2; B:Streamline]; drift is
the designers' leading complaint [praise C2.3]. *Ours:* card 1.1's congruence classes are that register, computed
(`findings-primitives.md:89`); wave 4.2's primitive sheets are the surface. *Recommendation:* yes — adopt 4.2 as the
standing sheet and add the check to the icon skill's approval step. Changes no drawing. *Evidence:* §1 group 1, §4.2.

**FD-2 — Publish the construction rules to customers; keep the stroked source private.** *What Maruti would see:*
one page shipped with the set — canvas, keylines per master, stroke per master, the gap floor, the badge zone once
ruled, which detail dies first — and the metrics beside it. *The field:* sets with published guidelines are praised
as extendable and sets without are punished twice — "no published spec" (4) and "cannot match style when
extending" (7) [praise C1.6; C2.4; C2.8]; of the 17 systems, the respected in-house ones (Material, IBM, Polaris,
Octicons) publish, and so does community-run Lucide [construction §2]. *Ours:* Settled ships outlined fills only and keeps the source private
(`CLAUDE.md:186`); the rules exist internally and five are missing (`rule-register.md:59`). *Recommendation:* yes,
once wave 3's judging standard exists — the page is the customer-facing half of it. Scope decision, Maruti's.
*Evidence:* §1 group 6, §2 modes 4=, 8=.

**FD-3 — Write the detail rule, in card 2.1's words.** *What Maruti would see:* a sentence in docs/01 and 07 that
says which part of a drawing goes when a master shrinks. *The field:* redraw-per-size systems keep topology and shed
repeated interior marks first (trash ribs 5→3, calendar cells 14→7), and the report found no UI-icon system that
publishes a rule for which detail dies [construction §1.6; §4.5]. *Ours:* card 2.1 derived two sentences from Fluent and from our own 30 shed
concepts — a part is dropped when rescaling would take its thinnest dimension below about one stroke at the new
master; a run that cannot hold its spacing drops a member rather than compressing (`references-fluent.md:182`, `:195`);
docs/09 §4 lists the detail budget as missing (`docs/09-rule-audit.md:61-63`). *Recommendation:* adopt the two
sentences as the rule; it describes what the set already does (`findings-scaling.md:22`). *Evidence:* §2 mode 10=, §4.2.

**FD-4 — Name the two tiers of the rulebook when the severity model is ruled: constraints and guidelines.** *What
Maruti would see:* the docs say, in those words, which rules are constraints a drawing cannot break and which are
guidelines the eye may override — with the grading itself left exactly as card 3.5 proposes it (it promotes the
filled box, the pair and the size step to errors, `severity-proposal.md:88-92`, and keeps the gap floor, the bend
minimum, the keylines and centring as warnings until Maruti's seven decisions are taken, `:194-196`). *The field:*
Feather's author separates constraints that cannot be broken from guidelines judged case by case; Lucide's tracker
spends issue #650 arguing that optical volume is "inherently just a blurry guideline"; Polaris presents its keylines
as a starting point rather than a hard constraint [praise B:Feather; C2.7; B:Shopify Polaris; D]. *Ours:* card 3.5's
grading model (`severity-proposal.md:54`) makes the same cut without naming it. *Recommendation:* yes — the names on
3.5's grades, not a regrading. *Evidence:* §4.2, §5 item 3.

**FD-5 — Run Atlassian's test on the 20, on a lab surface, before the parameter map prices a master.** *What Maruti
would see:* a row of concepts at 20: the drawn 20 (stroke 1.5) beside the 24 scaled by 0.833 (stroke 1.25), each in a
line of the text it would sit with, at 1× and 2×. *The field:* Atlassian replaced a drawn small size with a
proportional scale and found the scaled stroke matched the smaller text better; its developers held that proportional
scaling changes nothing; the redraw camp (Octicons, Fluent, Heroicons, Cursor) holds the opposite [praise A.4; C3;
construction §2.5; §5]. *Ours:* the stroke table alone says our 20 is not a proportional scale (§3.4), and cards 1.4
and 2.1 state a verdict from the geometry; what no card has done is put the two beside text for the eye. The
three-master row is Settled (`CLAUDE.md:191`) and this does not reopen it — it tells us what *drawn* buys at 20, which
is what the plan's question asks (`plans/set-and-rules-audit.md:454-455`). *Recommendation:* run it as part of wave 4,
one sheet, no ruling implied. *Evidence:* §3.

**FD-6 — State the text pairing of each master.** *What Maruti would see:* three lines — 24 beside N px text, 20
beside N, 16 beside 16 px — in docs/07 and on FD-2's page. *The field:* "weight matched to type" is a praise word
[praise C1.4]; Carbon states its pairing (16 and 20 beside Plex 14 and 16), Heroicons Micro and Atlassian both
redrew or rescaled because of the text beside the icon, and Cursor chose 1.25 beside 16 px type [praise B:IBM Carbon;
B:Heroicons; B:Atlassian; D]. *Ours:* the 16's lighter line was chosen to sit better beside 16px text (`plans/stroke-16.md:15`; the
sheet's first section, `lab/refs/stroke16.html` §1, offers 13 / 14 / 16 px with 14 selected by default, `:26`) — the phrase about 16px text in C7's evidence
column at `docs/07-character.md:47` describes Cursor's pick, not ours; the 24 and 20 pairings are written nowhere this card
could find — `[needs deciding]`, not measuring. *Recommendation:* Maruti states
the two missing pairings; they become the row FD-5's surface is built on. Changes no drawing. *Evidence:* §1 group 4, §7 item 5.

---

## 9. For wave 5 to reconcile — never pick

Where a report states a quantity that a later document measured from the source file, both stand here with their
definition and source. Nothing the Corrections table settled is reinstated.

| quantity | the field reports | the later card, from the source | note |
|---|---|---|---|
| Fluent's Regular stroke at 12 … 48 | 1.0 · 1.0 · 1.0 · 1.5 · 1.5 · 2.0 · 2.5, measured on 183 shipped SVGs, filled +0.5 everywhere [construction §1.1] | `references-fluent.md:209`, `:381`: the same ladder, read from the Figma file; `stale-statements.md:35-40` | **agree**; the stale rows are `fluent-guidelines.md:8`, `docs/07:47`, `docs/08:375`. Measured from the source file by card 2.1; from the shipped assets by the report |
| Fluent's cut-out / separation | "Cut-outs are 1px (1.5 at 48)" on the repo's authority [construction §2.3 Modifiers] | punched-line width 1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50; separation 1.00 · 0.95 · 1.00 · 1.00 · 1.50 · 1.50 · 2.46, at 12 · 16 · 20 · 24 · 28 · 32 · 48 (`references-fluent.md:118`, `:122`) | the report restates the stale `docs/08:113` sentence (§6 kind 2, item 5); card 2.1 measured, and §4.1 uses the measured values |
| Is the 20 a pure rescale of the 24? | — (the field's test, §3.4) | card 1.4: **16 of 970** drawings at 24→20 are the other resized, residual ≤ 0.005 after the best uniform fit, trivial circle and line matches stripped (`findings-scaling.md:128`); card 2.1: **1 of 970** of ours is a pure rescale, by its own hold/give instrument (`references-fluent.md:326`) | one question, two definitions of *rescale*; both say the 20 is drawn |
| Container-corner tier shares | — | card 1.2: **61.8 · 61.4 · 58.6%** of container corners on the modal tier at 24 · 20 · 16, radii snapped to the nearest sixteenth (`findings-corners.md:49-51`); card 2.3: **61.1 · 61.1 · 58.3%** on a two-decimal count of the same corners (`references-nucleo.md:184`) | already on the plan's list; cited here because §2 mode 3 uses card 1.2's figures |
| Fluent's filled twin box | identical in 76 / 80 / 84 / 80% of 25 pairs at 16 / 20 / 24 / 32, filled +0.05 to +0.10 px larger, from rasterised unpkg SVGs [construction §1.7; §2.3 Filled] | 75–84% of pairs from the Figma records (`references-fluent.md:340`); `stale-statements.md:197`: 1,109 of 1,293 (85.8%) | three populations, one band |
| Fluent's keylines and circle:square | 24: 20 / 18; 20: 16 / 14; 16: 14 / 12, from files; 1.111 / 1.143 / 1.167 [construction §2.3 Keylines as shipped; §3.2] | the same table (`references-fluent.md:257`) | agree |
| SF Symbols' filled twin box | identical for 17 of 21 symbols (regular and black), 20 of 21 (ultralight), rendered through AppKit [construction §2.2 Filled] | identical to within 2 units in 80% of 2,882 fill pairs, from the font's contours (`references-sf.md:387-389`) | different populations and tolerances |
| SF Symbols' pair count | the reports state none [praise B:SF Symbols; construction §2.2] | `CLAUDE.md:308` 2,664; `references-sf.md:659` 2,906 (2,508 without locale and direction variants) — already on the plan's list | nothing to add |
| Nucleo's `stroke_max` and UI stroke | cited as `K` [construction §2.16]; UI 18 grid, 16 live, 1.5 px (`M`) | `references-nucleo.md:86`, `:458`: a constant per set and grid, 2.2% of icons; 1.5 px at 12 and 18 on 99–100% of 4,764 (`:29`) | the stroke agrees; `stroke_max` corrected |
| Polaris's size and filled twins | 20 × 20, 16 × 16 safe area; 72 outline/filled pairs from the npm package, 43 identical (60%), filled −0.17 px [construction §2.6] | the live Figma page: 490 names, 499 drawings, 9 filled twins; the archive: 463 + 72 (`references-polaris.md:109-111`) | the report's 72 pairs are the archive-era package; card 1.17's reconcile table owns the size |
| Untitled UI | 24 × 24, 2 px, 60% corner smoothing; circle r 10, square 3–21 radius 3 (`M`, `F`) [construction §2.13] | 2,359 drawings, stroke 2, box equality 92.9% (`references-untitled.md:17`) | agree on canvas and stroke; the report has no fill figure |
| Central | 24 grid, 20 live, 3 weights, 5 corner styles (`V`) [praise B:Central Icons] | filled × stroke 2 / 1.5 / 1 × radius 0–3 × join, 30 variants (`references-central.md:16-17`) | *5 corner styles* against four radius values and two joins — wording, not a conflict |
| 1.25 at 16 | "Nobody publishes 1.25 at 16" among 17 systems [construction §1.2] | Cursor's set: 16 at 1.25, 24 at 1.5 [praise B:Cursor icons; D]; `docs/07-character.md:47` | **both hold** — a published design system against one product set's account. Word it as *no design system of the 17; one product set* |
| Heroicons' redraw | 40 of 40 sampled solid icons are not uniform scalings of each other `[I]` [praise B:Heroicons] | same subpath count 16 against 24 in 33 of 39, 6 lose one [construction §2.11] | two tests, one answer |
| Carbon's hand-drawn sizes | 2,766 at 32; 68 / 9 / 8 at 16 / 20 / 24 `[I]` [praise B:IBM Carbon] | the same counts; the 68 match the scaled 32 in stroke and density, 52 of 68 in ink box [construction §1.9; §2.4] | agree |
| The HN word counts | 837 comments, 402 about icons; 13 *consistent* against 4; 0 *optical* [praise C1.1; C1] | not reprintable: 20 thread files in the evidence (20 JSON, 20 flattened); `icon-reception/filt.py` screens per set and does not produce the counts; 139 subsets of 14 threads reach 837, none reaches 402, and no subset of any size reaches both (§0) | quote as the report's count |

---

## 10. Seen and rejected, because X

The way `docs/08-refinement.md` §8 records it: each with the test it fails.

| seen | rejected, because |
|---|---|
| Atlassian's conclusion — ship the next size down as a proportional scale, stroke included [praise A.4; construction §2.5] | fails (2) twice (§3.2, rows 1–2): they control the renderer and ship the only scale that exists, where we do not control render size; and they draw one master where we draw three by hand, a question already settled the other way. The *test* is kept (FD-5) |
| A weight axis, or a stroke parameter on one master — Material, Phosphor, SF, Nucleo, Lucide [construction §4.4; praise B:Lucide] | fails (2): Settled, no axis (`CLAUDE.md:188`); and the field's own witnesses say each stop must still be a drawing [praise C1.8; construction §2.14] |
| A gap of one stroke (Lucide, SLDS) or two thirds (Polaris, Octicons) as stated, or Fluent's measured 0.67× · 1.0× · 0.95× [construction §4.6; §5; `references-fluent.md:122`] | fails (3): values; and (2): one weight per size there, a 1.25 line under a 1.5 floor here, settled 2026-09-28 (`CLAUDE.md:230`) |
| Whole-pixel coordinates and square caps as the price of crispness — IBM, Material, Atlassian [construction §2.4; §2.5; §5] | fails (2): C1 is round (`docs/07-character.md:40`) and C7 accepted the half-tone cost of 1.25 (`docs/07-character.md:47`); the field is split on snapping anyway (Spectrum 2, Cursor) |
| Full-bleed circles at 16 — Octicons, Atlassian [construction §3.1] | fails (3), a value; and (2): our margin is spacing shipped inside the asset, by decision (`CLAUDE.md:219`) |
| Radius = one stroke, as a number [construction §1.5] | fails (3); the *law* goes to the container ruling (§4.2) |
| Polaris's one-to-three-shapes budget for filled icons [construction §2.6] | fails (3): a count, filled-only |
| "Do not resize" — Polaris, Spectrum, IBM [construction §3.5] | fails (2): we cannot forbid what we do not control; metrics are our answer |
| Material's grade axis and 11.5% baseline shift; SF's cap-height grid [construction §2.1; §2.2] | fails (1): answers nothing open; card 2.2 covers SF |
| The seller-named twin cons as evidence about our twins [praise C2] | fails (4) as evidence: zero independent statements; kept only as the list of what an eye should look for on the wall in Filled |
| The HN majority on pixel grids being obsolete (HN#27925063) [praise C3] | fails (1) and (4): an opinion with no measurement behind it; card 1.6 measured where our edges land |
| Streamline's "prioritize legibility over consistency" as a rule [praise B:Streamline] | not a method, a priority — and C0 already says it (rules serve the drawing); recorded as corroboration, not taken |
| Closed authorship as a rule [praise A.2] | not applicable: one author already. The *tracking* half is taken (FD-1) |

---

## 11. Handover — what this card found but does not own

| finding | belongs to |
|---|---|
| FD-1 … FD-6 as decisions | **5.2** the decision agenda; FD-3 joins docs/09 §4's detail budget, FD-4 joins card 3.5's severity model |
| the container-radius law — one stroke (general) or a named container step (Fluent, card 2.1 T3) — as the two precedents for the open ruling | **5.2**, with `findings-corners.md:736` |
| the 20 question — the four tells (§3.4) and the two measured verdicts | **3.3** the parameter map, and **5.2**; FD-5's surface to **4.x** |
| *generic* and *sameness at a glance* as kind-3 candidates with no instrument | **3.2** the findings register (one kind-3 line each) and **4.4** the eye-only list |
| the blur test and the text-pairing row as the eye's procedure on the wall | **4.1** the wall, **4.4** |
| the construction report's `K`-sourced Fluent cut-out row (§6 kind 2, item 5) | **5.1** the fresh reviewer, reading `references-fluent.md:118` first |
| the two populations of *1.25 at 16* (17 systems against Cursor) | **1.16** stale statements, if `docs/07:47`'s wording is ever edited: cite Cursor as a product set, not as the field |
| contact grammar — Cursor's optical breaks at junctions and stroke thinning where lines converge [praise C3] | **1.7** (`findings-air.md:508`, `:558`: 3,000 of 3,036 junctions are examined by nothing) |
| the published-rules page (FD-2) | **3.1** the judging standard — its customer-facing half |

---

## 12. How to reprint

Every figure above either reprints from `tools/audit/field-sources.mjs` or is cited to a wave-1 card by `path:line`.

| section | command | prints |
|---|---|---|
| §0 the two reports and their hashes | `node tools/audit/field-sources.mjs extract <out-dir>` (`<out-dir>` outside the repo; `--projects <dir>` if the transcripts live elsewhere) | both reports re-extracted from the final `SubagentHandback` call of each agent, with their sha256 and a check against the recorded values |
| every `[praise …]` / `[construction …]` anchor; every quotation; §4.1's transcription | `node tools/audit/field-sources.mjs check docs/audit/references-field.md <out-dir>` | each anchor resolved in the reports; each quoted string found verbatim in a report, and where, with its word count and whether it is third-party (the report wraps it in quotes, or it is found only in the evidence) — a third-party quotation of 7 words or more is a failure; the totals (quotations, distinct, third-party, longest); every transcribed snippet found in its source (a report section, or a `path:line` in the repo) and every value among the numbers written in its snippet |
| §2 the C2 ranking, as the report states it | `check` (above) | the ranked list with n and the HN · designers split |
| §2 the C2 ranking, recounted from the survey's own coding table | `node tools/audit/field-sources.mjs check docs/audit/references-field.md <out-dir> --evidence <the 2026-10-04 session's scratchpad>` | 57 rows: 53 independent, 4 vendor; per code — GEN 12 · BLUR 11 · INC 10 · COV 7 · LIC 7 · MIX 7 · OPT 5 · EXT 4 · SAME 4 · DETAIL 2 · SEM 1 |
| §4.1 the normalised table | `node tools/audit/field-sources.mjs normalise` | the table, from the rows embedded in the tool with their sources (report sections; `references-fluent.md:118`, `:122` for Fluent's cut and separation; `tools/masters.mjs`, `CLAUDE.md:93` and the report's §3.4 for ours) |
| the counts taken from the construction report — 17 systems; stroke at 16 stated 1.0 by 4 and 1.5 by 3; 14 multi-size policy rows, 5 one drawing per concept plus Material's one topology; 14 live-area rows; 13 contradiction topics; 6 systems in the filled-twin table | `check` (above) | the same numbers, read off the report's structure |
| the tool's own tests | `node --test tools/audit/field-sources.test.mjs` | tests on synthetic fixtures: a wrong handback call, a hash mismatch, an invented quote, a quotation wrapped across two lines, a third-party quotation of 7 words, a bad anchor, a snippet absent from its source, a value that is not among its snippet's numbers (a right snippet beside a wrong number), a canvas other than 24, and an in-repo out-dir each fail |

The HN word counts (§0) do not reprint. The evidence folder is read-only and temporary; `check` without `--evidence`
passes on the reports alone.

---

## Gate

Captured before any file was written and again after: `node tools/lint.mjs` → **2910 drawings · 2848 clean · 62
warned · 0 failed**, byte-identical end line. `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → 292
before this card, **308 pass, 0 fail** after (16 of them this card's). `git status` shows no change under `src/icons/`, `tools/lint.mjs`,
`tools/geometry.mjs`, `research/`, `lab/`, docs 01–09, `CLAUDE.md`, `plans/`. Files written by this card:
`docs/audit/references-field.md`, `tools/audit/field-sources.mjs`, `tools/audit/field-sources.test.mjs` — nothing
else.
