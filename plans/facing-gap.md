# Plan: lint reads the air inside one path, and a filled drawing's air

Status: **landed** — §5f committed (e027857), every question ruled (2146fcf), every redraw shipped. Written and closed 2026-09-28.

- [x] Q1 — keep §5f as a permanent warning and commit it (Maruti, 2026-09-28)
- [x] Q4 group A — redraws shipped by the main session 2026-09-28: `paintbrush` C (collar 1.5, ba32df6),
      `external-link` / `-2` F, F2 (even 1.51 notch, 4b7afc5), `puzzle-4` A (knob on its piece, feet
      0.75 · 0.75 · 0.625, 09fdf64)
- [x] `volume-off` and `database-2` **stay as shipped** (Maruti, 2026-09-28: "keep as is"). Their readings
      (volume-off-filled bar end 0.72 · 0.8 · 0.39 and its 1.25 channel at 16; database-2-filled 1.485 at 24)
      are agreed exceptions → each gets a `<!-- gap: N -->` note, rounded down to what it holds, through a
      re-approval by the main session (it owns `src/icons/`)
- [x] Q2 / Q3 — at 16, a line cut out of a filled shape and a band between two filled parts hold **1.5** of
      white, not the line's 1.25 (Maruti, 2026-09-28: the settled 1.5 floor; C18: a white line reads thinner
      than a drawn one; about 61 icons already cut 1.5). Recorded as dated notes in doc 07 C22 / C23 / C24.
      The eight 1.25 icons (book-3, building-2, home-3, keyboard, keyboard-2, lightbulb-3, compass-3,
      puzzle-4 seam) get their filled 16 redrawn — boards with the main session
- [x] Card 5 (redraws, gap notes) — done by the main icon session: gap notes on volume-off-filled and
      database-2-filled (20f3534); the eight filled-16 cuts and bands widened to 1.5 (93126ef … 390f3ce);
      paintbrush round 3 (Maruti's ask for more character): D is the new default, B → paintbrush-6,
      J → paintbrush-7, the round head from ba32df6 kept as paintbrush-8 (db46c18). Lint after: 2,640
      drawings, 2 warned (trash's old pair), 0 failed

**Start here (fresh session):** §5f is in `tools/geometry.mjs` (`facingGap`) and `tools/lint.mjs`, with
13 tests in `tools/geometry.test.mjs`. It only warns. The open items are the unticked boxes above.

## What changes, in plain words

Lint has always measured the air **between two separate lines**. It never measured the air
**inside one line's own shape**, or **anywhere in a filled icon**. So three kinds of tight spot could
ship without a warning:

- a closed shape whose two sides face each other across too little air, like the collar on
  `paintbrush`, which has **1.22** of air inside at 16 (the floor is 1.5);
- a filled icon whose white cut, or the white band round a knocked-out part, is too narrow, like
  `compass-3`'s needle band, which is **1.25** at 16;
- a filled shape sitting too close to a line in the same icon, like `volume-off`'s crossing bar, which
  ends **0.39** from the speaker at 16.

The new check finds all three. For now it **only warns**, the same as the other gap checks (§5, §5b).
Nothing turns red and no icon has been changed.

**How it tells a gap from a corner.** Along a straight run, air is only a gap when the walls
on either side of it face each other squarely, like the two sides of a slot. The inside corner of a bend is
different. The walls meet at an angle, the air there always shrinks to nothing, and nobody reads that as
a gap. The check only measures air where both walls are within 3° of square to the line across the
gap, so it passes every bend, every corner and every round end in the set. The same rule reads a round
hole at its full width, and a pill-shaped counter at its real height.

## What it found: 23 warnings on 21 drawings (all 2,586 drawings run, 2026-09-28)

Old lint against new lint on the same files: these warnings are the **only** difference. There are no
new errors, and every other line of the output is identical.

**A. Real defects: one number is off, and the fix leaves the design as it is**

| Icon | Master | Air | What the eye would see |
|---|---|---|---|
| `paintbrush` (outline) | 24 · 20 · 16 | 1.33 · 1.33 · 1.22 | the inside of the collar is thinner than any other counter in the set; the file's own comment records it ("air 1.33 · 1.33 · 1.22") |
| `external-link`, `external-link-2` (filled) | 24 · 20 | 1.28 | the white round the arrow's tip is thinner on one side. The notch arc's radius was rounded (2.2486 → 2.26), which moves its centre 0.23 off the arrow's cap. At 16 it is fine (1.58) |
| `volume-off` (filled) | 24 · 20 · 16 | 0.72 · 0.8 · 0.39 | the crossing bar's end nearly touches the tip of the speaker |
| `database-2` (filled) | 24 | 1.485 | the band between the top disc and the first ring is 0.015 short. This is rounding and invisible at any size |
| `puzzle-4` (filled) | 24 · 20 · 16 | 1.46 · 1.02 · 0.84 | a knob fillet overshoots the left piece's edge (to x 8.01 against 7.5 at 16), and the path doubles back along `H7`, leaving a hair-thin sliver of ink that points into the seam. Found by the reviewer. At 16 lint prints only this reading; the seam's 1.25 (group B) sits under it |

**Why group A has the lower numbers (history dig, 2026-09-28):**
- **paintbrush**: known but never decided. The round 2 draft note (80ea947) records the collar's 1.22 at 16 as "below the 1.5 floor". A wider collar was drawn only at 24. Maruti picked C for its smaller head, not for its collar. The slimmer collar lets the round head stand out, which matters most at 16.
- **external-link, external-link-2**: an accident. The intent was 1.51 of air each side ("a 4.51-wide slot"); rounding the radius to 2.26 moved the arc 0.23 off the arrow's end. At 16 it is centred.
- **volume-off**: the construction is deliberate. C28, 2026-09-26: "A 1.5 cut around the bar … leaves almost no speaker at 20 and 16". The distance from the bar's end to the speaker (0.72 · 0.8 · 0.39) was never measured or looked at by eye. Maruti has since pointed at the rough bar exit at the lower right.
- **puzzle-4**: an accident in the generator (the knob-foot fillet is never clipped to the piece's edge). The draft's "smallest is 1.5" was measured per piece, not between the two pieces.
- **database-2**: a fitting tolerance, known but never decided ("slot measures 1.48–1.51"). A concentric ellipse would pinch it to 1.3.

**B. At 16, cuts made at the line weight (1.25) instead of the gap floor (1.5)**

| Icon | Master | Air | Kind |
|---|---|---|---|
| `book-3`, `building-2`, `home-3`, `keyboard`, `keyboard-2`, `lightbulb-3` (filled) | 16 | 1.25 | a line punched out of the shape (for example book-3's title label). At 24 and 20 the same cuts are 1.5 |
| `compass-3` (filled) | 16 | 1.25 | the white band round the needle |
| `puzzle-4` (filled) | 16 | 1.25 | the seam between the two joined pieces |
| `volume-off` (filled) | 16 | 1.25 | the channel the bar cuts through the speaker (1.51 at 24) |

For scale, the filled 16 master as a whole: **43** punched cuts measure exactly 1.5 and **6** measure
1.25; **77** separations measure 1.5 and **3** measure 1.25. So the 1.25s are exceptions, not a
convention.

**Census of filled cuts at 16 (2026-09-28, all 304 shape-filled files).** I earlier said these cuts
at 16 are 1.25 because the set agreed it. That was **wrong**. About 61 icons approved after the 16 line
went to 1.25 cut a punched line at **1.5** on purpose: calendar and folder carry "16 only, deliberate
(2026-09-20)", because the cut shares a whole-pixel edge with the line; database uses "a 1.5 slot on the
1.25 line". Only the 9 newest (book-3, building-2, home-3, keyboard, keyboard-2, lightbulb-3, compass-3,
puzzle-4, volume-off) cut at 1.25. Files from before the change: only file, file-text and file-text-2
carry punched lines, at 1.5, so they match the majority and none needs a redraw. C23 and C24 still say
"the outline's own width / 1.5"; at 16 that 1.5 is the gap floor, not the line, so they need a dated note.
Maruti is choosing the direction: 1.5 (redraw the 9) or 1.25 (redraw about 61).

## Questions for Maruti (one batch)

1. **Turn the check on as a warning and commit it?** *Recommendation: yes.* It stays a warning
   permanently, like §5 and §5b. An agreed exception gets a `<!-- gap: N -->` note, which the check
   already reads.
2. **At 16, is a line punched out of a filled shape held to 1.5 of air, or to the line weight 1.25?**
   C22 says punched detail is cut "at its true size". When C22 was written, that size was 1.5; since the
   16 stroke went to 1.25 it has been read as 1.25. §6 says 1.5 of air, always. *Recommendation: 1.5.*
   C18 already found that a knocked-out line reads thinner than a drawn one. The other 43 cuts at 16
   are 1.5. The six at 1.25 get their filled 16 redrawn with the cut widened by 0.25. If you would
   rather keep 1.25, C22 gets a dated note, lint gets a floor per kind, and the six stop warning.
3. **At 16, is the band that separates two filled parts (compass-3's needle, puzzle-4's seam,
   volume-off's channel) held to 1.5?** C23 already calls a separation a gap and cuts it at 1.5.
   *Recommendation: yes. Redraw those three filled 16s.*
4. **Redraw the five in group A?** *Recommendation: yes.* The redraws are paintbrush's collar, the
   external-link notch arc, volume-off's bar end, database-2's band and puzzle-4's fillet. Each fix is a
   number, not a new design.

## Cards

| # | Card | Files owned | Done when | Model | Status |
|---|---|---|---|---|---|
| 1 | `facingGap`: edges of strokes and areas. A ray goes straight out of every wall and every sharp corner, and the first wall it meets facing back within 3° ends the span. The air must be clear all the way across, and two points under 0.5 apart along one outline are not read | `tools/geometry.mjs` | tests pass; reads the known cases (paintbrush 1.22, compass-3 1.25, help-4's old mouth 0.31, same as `selfGap`) | strongest | [x] |
| 2 | lint §5f: warnings only. It reads closed paths (with or without Z) and multi-subpath `d`s; open single strokes stay 5b's, and a neck 5b already warned on is not warned twice. Air touching a shape is labelled cut / notch / separation / line. It uses the same floors and `gap:` note as 5b | `tools/lint.mjs` | old vs new lint on all 2,586: only the 23 warnings differ | strongest | [x] |
| 3 | Tests: known cases; the three must-nots (a bend, a ring read short, a rounded end read as a neck); blocked spans; pairs left to §5; the four kinds; lint wiring; and the review's four finds (a sharp corner, a doubled warning, a path closed without Z, an overlap or hairline loop read as a gap) | `tools/geometry.test.mjs` | `node --test` 90/90 | strongest | [x] |
| 4 | Docs: docs/08 §6.5 (which holes are now closed), CLAUDE.md Tools / gap-note / plans notes, lint's gap-note comment; doc 07 C22 / C23 / C24 dated notes once Q2 / Q3 are answered | docs | a fresh doc sweep finds no stale statement | Sonnet sweep | [x] |
| 5 | Redraws per Q2–Q4 and the agreed gap notes: icon commits, one per icon, through the icon skill | `src/icons/` (main session) | lint clean on them; real pixels at 16 | strongest | [x] |

## Known blind sides (recorded, not fixed)

- **A wedge of air whose walls open wider than about 6°** is read as a corner and is not judged. A
  triangular counter (C23) is still measured by its largest inscribed circle — **since 2026-10-20 by
  lint §5i (`insideAir`), no longer the drawer's job** (docs/08 dated note).
- **Two sharp corners of shapes pointing straight at each other** are not read: each ray arrives at
  the other shape's point, not at a wall. Nothing like this ships.
- **Air under 0.02 wide** is ignored (hairlines left by offsets). `volume-off`'s lower bar sits in its
  channel with 0.007 either side at every master; that is invisible and is not reported.
- **§5c (the material a cut leaves) still skips filled files that also have lines.** Run over all 354 of
  them, it finds one reading (`cash-filled` 24, 3.92), and it does not yet count the lines as ink. Left
  as it is.
- **The check adds about 5 s to `npm run check`**: 12.5 s for 2,490 drawings this morning, 18.2 s for
  2,586 after the change. It exits 0.

## How it was proven

- `node --test tools/geometry.test.mjs`: 90 pass, 0 fail.
- The HEAD lint and the new lint were run on the same 2,586 drawings: 2 warned before and 23 after,
  0 failed either way, and every other line of the output is identical. `npm run check` exits 0.
- `samplePath` gained an options argument. It is an object, so `ds.map(samplePath)` still cannot pass an
  index in. The reviewer compared samplePath, bbox, selfGap and materialGap output on all 2,586 before
  and after: 0 differ.
- The drafts that had needed hand-rolled neck checks (puzzle round 2, paintbrush, compass) read the same
  or tighter: puzzle necks 1.58 and up (their script said 1.5 and up), compass D's band 1.25.
- A fresh reviewer re-measured every reading by other methods (plain edge-to-edge distance, a
  medial-axis sampler, and hand calculation) and got the same values: 1.4848, 1.283, 1.328 · 1.329 · 1.225,
  0.722 · 0.796 · 0.395, 1.25. It ran 24 adversarial fixtures of its own, and they read as expected after
  the fixes. It spot-checked 60 closed outlines and 68 filled drawings at 16. It found one miss, the
  puzzle-4 spur (a sharp corner), and three small issues: a doubled warning, a path closed without Z,
  and a comment that did not match the code. All four are fixed, with tests.
