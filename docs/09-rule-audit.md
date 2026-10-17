# Rule audit — 2026-09-20

Every doc, tool and all 684 drawings read and measured in one session: which rules contradict each
other, which are still alive, and — for every rule a drawing breaks — whether the break was right or
the rule was. Written to be picked up cold. Numbers were measured that day from `lab/manifest.json`
and from rasters at each master's own size; nothing here is recalled.

**Headline:** the drawn set is coherent and good. The rulebook is in worse shape than the drawings:
about a third of the prose describes an abandoned system, and the rules that matter most for
containers do not exist yet.

**Acted on since:** C7 amended and carried out — the 16 master now draws at stroke 1.25
(`plans/stroke-16.md`); the working-style section added to CLAUDE.md. The badge question (§2,
§6 item 4) ruled by C33 on 2026-10-18. Everything else below is still open unless it is marked
in place.

---

## 1. Broken rules, judged on merit

| Rule | How it is broken | Verdict |
|---|---|---|
| Punched holes ≥ 3 units (doc 03) | cuts are 1.5–2.5, glyph gap 1 | **Break right, idea holds.** 3 units in a 14 disc is a blob, and no cut fills in: every knock-out keeps fully clear pixels at every master. But at 16 the tick has the fewest (6, against cross 8 · plus 10 · minus 12), and it swaps in place with the cross. Reword: *a cut is never lighter than its swap partners*; bring the `check-circle` cuts (1.5 "for now", C18) up to the medium cut. |
| Three radii only, 2.5 / 1.5 / 0 (doc 01 §5) | a dozen radii in the census | **Mostly not a break.** Rings, lenses, bowls and dots are shapes, not corners. Real corners at 24 use 0.75 · 1.5 · 2.5. Reword as a *corner* vocabulary per master. One real break: `trash` (container) uses 1.5 where the rule says 2.5 — defensible on a narrow tapered bottom, but the rule must say when a container takes the tighter corner. Container radius is still listed open in doc 07. |
| ≤ 3 parallel strokes (doc 01 §6) | `trash` 24 and `file-text-2` have 4 if walls count | **Break fine, rule vague.** Drawings already shed detail by master (ribs 2·2·1, lines 3·2·2). Reword: *at most 3 interior marks between walls*. Keep it — at 24 the gap rule alone allows 5–6. Not in lint. |
| Angles 0/45/90 | 44 names leave it | **Rule sound.** Every *default* obeys it; leaving it is what makes a numbered variant. Two default exceptions: `trash`'s 4° taper and `code`'s 73° slash (C30) — both user picks. **Unenforced:** lint does not check angles, so every figure here was measured by hand. |
| Name the drawing, not the use (doc 03) | `search`, `menu`, `ban`, `more-horizontal` | **Break right** — market names, tags cover the rest. The one inconsistency closed 2026-10-17 (AG-28): `help` → `help-circle`, `info` → `info-circle`; `ban`, `clock`, `globe` keep their names because the ring is the object. |
| Line-heavy filled: ink box identical | `minus-filled` is 1 · 0.5 · 0.5 taller | **Unavoidable** — a lone bar cannot thicken without growing. Rule text overstates: length holds, thickness grows. |
| Every decimal carries a comment | no file does; lint passes on *any* comment | **Break right** — declared `optical:` / `glyph:` comments replaced it. Drop the literal rule; stop lint treating any comment as a pass. |
| One icon per commit | commits cover families | **Break right** — a family is one decision. The working rule is one board per commit. |
| Gap ≥ 1.5 | `file-text-2` at 16: 1.25 under its last line, no fully clear pixel row | **Had a measured cost; dissolved by the 1.25 stroke** (gap becomes 1.625). |
| `trash` tab legs vs walls | two lint warnings at 20, 16 | **Not a break** — covered junction (C22). Lint is wrong; fix owed to `tools/lint.mjs`. |
| Draw the 15 hardest first, then freeze (doc 04) | 77 marks → 29 circles → 5 containers | **The rule was right.** Each of the five containers forced a new rule or carve-out (C22, C23, C24), and C0 was written because of that strain. See §4. |
| Never review an icon alone | partly followed | **Rule right** — every fault in doc 08 was found in real pixels beside the set. |

## 2. Other conflicts found

- **Doc 03** describes a Light/Regular/Bold weight axis, "ship the 24 master only", "20 is a bad size". Dead except its naming section.
- **Badges:** doc 01 says they may cross 22; doc 05 says the clear zone "stays inside the live area"; doc 01 also says there is no live area; lint has no badge exemption. Must be settled before `calendar-plus`. Doc 05's geometry is still written for stroke 2. **Ruled 2026-10-18 (C33), on the `calendar-repeat` board: up to 22, not past it.** A badge sits on the base's bottom-right corner and may stand past the base's box up to the margin edge (22 · 18 · 15), never beyond it; the composite declares its box. Doc 01's "may cross 22" is corrected, doc 05 §2 carries a dated note with the geometry re-derived at 1.5 · 1.5 · 1.25, and its "live area" is struck (there is none, doc 01 §1). Lint needs no badge exemption: its §4 margin check already errors on any ink past 22 · 18 · 15, which is C33's limit. It does not check the badge's corner, its air beyond §5/§5f's general 1.5, or the stub rule.
- **2-dp limit vs the 1.75 medium cut:** half-width 0.875 cannot be written, files carry 0.88. Harmless in pixels; the two rules cannot both be met.
- **Exact placement unenforced:** "centred to 2 dp" and "filled box = outline box" are obeyed by the drawings (only C17 and `minus` differ) but lint allows ±0.5 and never compares the pair. **Half closed, 2026-09-20:** lint now compares every pair's ink box and warns on the filled file when a side differs by more than 0.01; a filled file may declare an agreed difference as `<!-- grows: L R T B -->`, verified against the drawings, and a note they do not measure is an error. Census of all 351 shipped pairs: **33 differ, 0 of them unexplained** — 18 menu stacks and 6 `more` dots (C17, thicken in place), 9 `minus` (a lone bar cannot thicken without growing). The growth is half the weight step at each master (0.5 · 0.25 · 0.375), with one exception: `more-horizontal` / `more-vertical` at 16 grow 0.25, because the C7 conversion took the outline disc from r0.45 to r0.575 to hold its ink box while the filled twin kept r0.45 — same left-behind as the 16 filled corners below, centres unmoved, nothing to redraw. Still open: the notes are not yet written into the 33 files (so they warn), and "centred to 2 dp" is still checked at ±0.5.
- **Chevron shifts differ by direction** for the same drawing flipped (flat: 0.55 down · 0.4 up · 0.55 sideways; steep 0.61 / 0.65). By-eye scatter of ~0.15 px, not design. One magnitude per shape would be more honest.
- **Filled cut weights:** minus 2.5 · plus/x/glyphs 2 · checks 1.5. Visible between swap partners.
- **Metrics bugs (the product's differentiator):** `build.mjs` gives shape-filled files zero optical recession (`plus-circle` 2.71 vs `plus-circle-filled` 2.0, same silhouette); `anatomy()` reports `container: 13` for a bare `x`, `x-large`, `x-small`.
- **Shipped format unbuilt:** "outlined fills only" is settled; `build.mjs` emits the stroked paths. No outliner, package or export yet.
- **16 filled corners sit 0.05 inside the outline's (found on `folder`, 2026-09-20; on record, not a bug).** When the 16 stroke went to 1.25 (C7), corner radii kept their centreline value (1.5) and the shape-filled twins were left untouched. The outline's outer corner is therefore 1.5 + 0.625 = 2.125 while its filled twin still carries the 1.5-era 2.25. Straight edges land on the same pixels; only the corner curves differ, by 0.05 units at the middle of each corner (reviewer-measured on `folder`; `file` is built the same way; 43 of the 117 filled files at 16 are shape-filled and were not all checked). Invisible at true size. **Decision (Maruti, 2026-09-20): leave it.** Never fix it on one icon. If it is ever closed it is set-wide: either redraw the 16 filled corners at 2.125, or take the 16 outline corners to 1.625 so their outer edge returns to 2.25.
- **Landscape and portrait keylines drift in proportion from 24 to 16** (20×16 · 16×12 · 14×10 = 1.25 · 1.33 · 1.4 wide-to-tall; portrait 0.8 · 0.75 · 0.71) because each master drops the same 4 units from both sides. `folder` was taken out of it case by case (own box 20×18 · 16×14 · 14×12, declared `<!-- box: WxH -->`, not a rule). Twelve reference sets measured 1.07–1.23 at ~24 and four sets 1.0–1.17 at ~16, and none widens as it shrinks (2026-09-20). If `mail`, `image` or `card` want the same fix, that is the repeatable pattern that would justify a rule.
- CLAUDE.md "Open" items 1–2 (visual language, master size) are closed in practice; the queue is 572 rows, not 487. `node --test tools/geometry.test.mjs` is not part of `npm run check`.

## 3. Alive, needs fixing, dead

- **Authoritative:** CLAUDE.md Settled table · docs 07, 08 · the icon skill · `masters / lint / queue / geometry.mjs` · Library, board, family sheet, optical-shift sheet.
- **Alive, needs fixing:** doc 01 (§5 radii, §6 corollaries incl. the "2-unit gap" line, §7's "shift up 0.5" superseded by C14/C15) · doc 04 (2-master arithmetic, sequencing) · doc 05 (geometry) · doc 06 (waiting on the D23 rulings).
- **Dead:** README geometry block · doc 02 pipeline numbers and contribution rules · doc 03 body · `templates/grid-24.svg` · `src/_legacy-stroke-2/` · lab pages `language`, `keylines`, `alignment`, `optical`, `stroke-vs-fill`, `slot-test` (decision history, not tools).

**Noise worth removing:** optical shifts carried to 0.01 across 36 files (one value per shape, quarter-snapped at 16, would look identical); the unused `diagonal` keyline; open item "relax the `<path>`-only rule" (files are generated now — close it); C24 is a record of one icon, not a rule.

**Risks to the goal of a consistent set:** variant numbers mean different things per family (`check-2` steep, `arrow-3` flat, `chevron-2` flat) and nothing says which go together; 32 concepts became 114 names / 684 files — at that ratio the queue reaches ~10,000 drawings; `ban` and `ban-2` ship identical outline files.

## 4. The main gap

The rules were derived from 106 marks and circles and then stretched onto containers. Still missing:
container corner radius · detail budget per master · one filled-cut policy · how a mark's share of
its container holds from 24 to 16 (the 13% drift, doc 08 §6.1) · the modifier zone (ruled 2026-10-18, C33). Those five decide
whether icon 300 looks like icon 30. **Recommendation:** after `folder`, pause queue order for a
stress batch of hard containers — `calendar`, `user`, `gear`, `bell`, `lock`, `mail`, `image`, `home`,
`eye`, `chart-bar` — settle the five from it, then resume.

## 5. Method to borrow — "The making of Cursor's icons" (minoradventures.co, 2026-07-30)

Reference, not a rule source. He governs a 600-icon set by **side-by-side tables of instances**
(every dot, gap, badge, slash, folder — 155 tracked elements), not by prose rules. None of the
items below needs any shipped icon redrawn.

1. **A generated Overviews page** in the lab: one row per recurring pattern (dots, cut widths, container corners, rings, slashes, arrowheads, glyph gaps), built from the manifest. This is the primitive-drift linter in a form the eye can judge; the census scripts from this audit are most of it. *Highest value.*
2. **One object, reused exactly** — make it a lint check. Verified today: `file-text` / `file-text-2` reuse `file` path-for-path at all masters; all 29 rings are identical.
3. **A Concepts table** — one answer per "what is the icon for X". A numbered variant should mean a different *job* (`arrow` vs `arrow-2`), not a different mood. Maruti's call.
4. **A direction convention, decided once** (his: bottom-left → top-right, small element top-right, slashes against it). Only the slash is fixed here (C21). Settle before `external-link`, `send`, `pencil`, badges.
5. **Construction habit:** straight segments at 0/45/90, then rounded corners; free curves rare. A starting answer for `bell`, `cloud`, the open `user` shoulders.
6. **Dots by role** (line-ending · "more" · lone). Two exist here; write the table before `list-bullet`.
7. **Tags from `research/synonyms.mjs`** fed into the build — synonym search for free.
8. **A staleness check in `npm run check`** — docs quoting a number owned by `masters.mjs` or the sheet.
9. **Look at the set at true size on a phone.**

His gap rule is ours: 3 units between centrelines. Not taken: junction notches and thinned strokes
(needs variable-width outlines; invisible at 16 by his own account). His 16-master-at-1.25 is what
met C7's reopening test.

## 6. Suggested order

1. Finish `plans/stroke-16.md`.
2. Docs pass: retire doc 03's body; fix README, doc 01 §5–§7, CLAUDE.md's Open list; archive dead lab pages and the template.
3. Lint: filled-vs-outline box, 2-dp centring, reuse check, radius census; fix the two metrics bugs; tests into `npm run check`.
4. Rulings from Maruti: check cut weight · container radius · symmetrise chevron shifts · variant cap and shared style tags · ~~may badges cross 22~~ (ruled 2026-10-18, C33: up to 22, not past it) · D23 revisions (doc 06).
5. The Overviews page, then the stress batch, then the container rules, then the queue.
