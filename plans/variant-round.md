# Variant round — the 121 undrawn variant rows

Status: **in progress** since 2026-10-25 — Maruti: "Open 5 different session … V1 to V5 1 session each … every icon having its own drawing agents … drawings happen on Opus". All 121 rows marked in review and their references written by the main session first. (Before: on hold, 2026-10-24.)

**How it runs (2026-10-25):** one session per category, V1 to V5, all in this checkout. Each one drafts only its own rows' `lab/drafts/batch/<name>.js`, one Opus drawing agent per row, and settles a shared badge picture once before handing it out. Approvals are serialised by the lock `.git/mavan-approve.lock`. `tools/masters.mjs` `STATE_TWINS` is V1's alone. This plan file belongs to the main session.

## What changes for Maruti

Every row left on the sheet is a variant of a shipped icon (a badge, an `-off` state, a ring or square
container, a family member). Maruti, 2026-10-24: "lets put them on the board. for now make each of these
as their own category. once they are drawn and confirmed, they go into the respective categories on the
sheet." So, while the round runs, each row sits in a **temporary category by kind** (V1–V5 below: V1 Off states, V2 Plus minus check x, V3 Other badges, V4 Circle and square containers, V5 Other variants); when a
row is approved, `queue.mjs category "<its section>" <name>` puts it back where the table says it came from.

## How the boards are drawn

- One board per row, `lab/drafts/batch/<name>.js`. Where the rules decide the drawing (C33 badges, C21 bars,
  C18 containers) the board carries one candidate; where there is a real visual choice, up to three, one
  recommended.
- **`-off` is a state twin (C34):** it is drawn for every numbered shape of its base, named `<base>-off`,
  `<base>-off-2` … after the shape's number (as `unlock` … `unlock-6` on `lock` … `lock-6`), all on that row's
  board. The 15 `-off` rows are 46 drawings. Each approved pair is added to `STATE_TWINS` in `tools/masters.mjs`.
- `play-circle-dotted` is drawn on `play-circle`, which is itself in this round — same drawer.
- Drawers on Opus, one group each; a fresh reviewer per group; fixes; then the board goes to Maruti.

## Groups

| Group | Rows |
|---|---|
| off-a | eye-off, shield-off, keyboard-off, map-pin-off, bell-off, ~~crosshair-off~~ (dropped), phone-off, wifi-off |
| off-b | microphone-off, bolt-off, bookmark-off, link-off |
| off-c | clipboard-off, video-off, camera-off |
| pm-a | every plus and minus: file-plus, file-minus, folder-plus, folder-minus, note-plus, image-plus, database-plus, code-plus, user-plus, user-minus, cart-plus, cart-minus, bell-plus, face-smile-plus |
| pm-b | every check and x: file-check, clipboard-check, calendar-check, user-check, user-x, shield-check, eye-check, credit-card-x, package-check |
| badge-a1 | clocks and arrows: file-clock, calendar-clock, file-down, file-up, folder-down, folder-up, desktop-download, file-heart, file-signature, file-attachment |
| badge-a2 | sparkles and images: image-sparkle, star-sparkle, image-binary, image-depth, book-bookmark |
| badge-b | user-lock, user-shield, user-search, user-exit, user-segment, user-focus, ~~user-laptop~~ (dropped), shield-pending, credit-card-lock, credit-card-percent, award-certificate |
| badge-c | phone-incoming, phone-outgoing, phone-call, phone-forwarded, phone-missed, message-alert, ~~message-pen~~ (dropped), ~~message-smile~~ (dropped), message-user, mail-follow-up |
| badge-d | window-chart, window-key, window-pointer, ~~window-expand-bottom-right~~ (dropped), globe-pointer, compass-drafting |
| ring-a | arrow-up-circle, arrow-down-circle, arrow-left-circle, arrow-right-circle, chevron-up-circle, chevron-down-circle, chevron-left-circle, chevron-right-circle, play-circle, pause-circle, ~~play-circle-dotted~~ (dropped) |
| ring-b | hash-circle, user-circle, ~~check-circle-dashed~~ (dropped), plus-square, minus-square, x-square, info-square, help-square, activity-square |
| var-a | text-align-left, text-align-center, text-align-right, text-align-justify, text-color, text-title, chart-bar-horizontal, chart-bar-stacked, chart-bar-trend |
| var-b | camera-flip, battery-charging, calendar-days, check-double, eye-closed, folder-open, mail-open, scan-face, ~~rotate-ccw-dotted~~ (dropped), search-empty, grid-circle-plus, refresh-ccw |

## Status

- [x] Rows moved to V1–V5 (2026-10-24); started, then set back to not started on Maruti's correction the same day
- [ ] Drawn (14 groups; one owner per badge picture, so a badge is drawn once and reused)
- [ ] Reviewed and fixed
- [ ] On the board for Maruti
- [ ] Approved rows moved back to their sections (the table below), and this plan closed

## Where each row goes back to

### V1 Off states — 15 (14 after crosshair-off was dropped)

| # | Row | Section on the sheet | Base | Base's shipped shapes |
|---|---|---|---|---|
| 352 | `eye-off` | Users & Access | `eye` | `eye` |
| 362 | `shield-off` | Users & Access | `shield` | `shield` `shield-2` |
| 405 | `keyboard-off` | Devices & Hardware | `keyboard` | `keyboard` `keyboard-2` |
| 406 | `map-pin-off` | Maps & Location | `map-pin` | `map-pin` `map-pin-2` `map-pin-3` `map-pin-4` `map-pin-5` |
| 408 | `bell-off` | Communication | `bell` | `bell` `bell-2` `bell-3` |
| 409 | `microphone-off` | Communication | `microphone` | `microphone` `microphone-2` `microphone-3` `microphone-4` `microphone-5` |
| 414 | `bolt-off` | Status & Feedback | `bolt` | `bolt` `bolt-2` `bolt-3` |
| 420 | `bookmark-off` | Status & Feedback | `bookmark` | `bookmark` `bookmark-2` `bookmark-3` |
| 430 | `link-off` | Editing & Text | `link` | `link` `link-2` `link-3` `link-4` |
| 452 | `clipboard-off` | Files & Folders | `clipboard` | `clipboard` `clipboard-2` `clipboard-3` `clipboard-4` |
| 453 | ~~`crosshair-off`~~ | dropped 2026-10-25 (Maruti: "crosshair-off: reject. do not need icon") | `crosshair` | — |
| 476 | `phone-off` | Communication | `phone` | `phone` |
| 480 | `video-off` | Files & Folders | `video` | `video` `video-2` `video-3` `video-4` |
| 481 | `camera-off` | Media & Playback | `camera` | `camera` `camera-2` `camera-3` `camera-4` `camera-5` `camera-6` |
| 484 | `wifi-off` | Devices & Hardware | `wifi` | `wifi` `wifi-2` |

### V2 Plus minus check x — 23

| # | Row | Section on the sheet | Base | Base's shipped shapes |
|---|---|---|---|---|
| 353 | `file-minus` | Files & Folders | `file` | `file` |
| 354 | `file-plus` | Files & Folders | `file` | `file` |
| 355 | `clipboard-check` | Files & Folders | `clipboard` | `clipboard` `clipboard-2` `clipboard-3` `clipboard-4` |
| 356 | `shield-check` | Users & Access | `shield` | `shield` `shield-2` |
| 360 | `folder-minus` | Files & Folders | `folder` | `folder` `folder-2` `folder-3` |
| 361 | `folder-plus` | Files & Folders | `folder` | `folder` `folder-2` `folder-3` |
| 366 | `user-minus` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 367 | `user-plus` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 372 | `calendar-check` | Time & Calendar | `calendar` | `calendar` `calendar-2` `calendar-3` |
| 379 | `database-plus` | Charts & Data | `database` | `database` `database-2` `database-3` |
| 382 | `image-plus` | Files & Folders | `image` | `image` `image-2` `image-3` |
| 388 | `cart-minus` | Commerce & Payments | `cart` | `cart` `cart-2` `cart-3` `cart-4` `cart-5` |
| 389 | `cart-plus` | Commerce & Payments | `cart` | `cart` `cart-2` `cart-3` `cart-4` `cart-5` |
| 401 | `note-plus` | Files & Folders | `note` | `note` `note-2` `note-3` `note-4` |
| 404 | `credit-card-x` | Commerce & Payments | `credit-card` | `credit-card` `credit-card-2` `credit-card-3` |
| 407 | `package-check` | Commerce & Payments | `package` | `package` `package-2` `package-3` |
| 418 | `bell-plus` | Communication | `bell` | `bell` `bell-2` `bell-3` |
| 426 | `face-smile-plus` | Communication | `face-smile` | `face-smile` |
| 427 | `file-check` | Files & Folders | `file` | `file` |
| 441 | `code-plus` | Editing & Text | `code` | `code` `code-2` |
| 442 | `eye-check` | Users & Access | `eye` | `eye` |
| 478 | `user-check` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 479 | `user-x` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |

### V3 Other badges — 42 (38 after message-smile, message-pen, user-laptop and window-expand-bottom-right were dropped)

| # | Row | Section on the sheet | Base | Base's shipped shapes |
|---|---|---|---|---|
| 359 | `image-sparkle` | Files & Folders | `image` | `image` `image-2` `image-3` |
| 370 | `phone-incoming` | Communication | `phone` | `phone` |
| 371 | `phone-outgoing` | Communication | `phone` | `phone` |
| 373 | `calendar-clock` | Time & Calendar | `calendar` | `calendar` `calendar-2` `calendar-3` |
| 380 | `file-clock` | Files & Folders | `file` | `file` |
| 381 | `file-heart` | Files & Folders | `file` | `file` |
| 386 | `user-lock` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 387 | `user-shield` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 395 | `file-down` | Files & Folders | `file` | `file` |
| 396 | `file-signature` | Files & Folders | `file` | `file` |
| 397 | `file-up` | Files & Folders | `file` | `file` |
| 398 | `folder-down` | Files & Folders | `folder` | `folder` `folder-2` `folder-3` |
| 399 | `folder-up` | Files & Folders | `folder` | `folder` `folder-2` `folder-3` |
| 400 | `message-alert` | Communication | `message` | `message` `message-2` `message-3` `message-4` `message-5` `message-6` `message-7` |
| 411 | `phone-call` | Communication | `phone` | `phone` |
| 419 | `book-bookmark` | Files & Folders | `book` | `book` `book-2` `book-3` `book-4` |
| 434 | `user-search` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 438 | `compass-drafting` | Design Tools | `compass` | `compass` `compass-2` `compass-3` |
| 439 | `desktop-download` | Devices & Hardware | `desktop` | `desktop` `desktop-2` `desktop-3` `desktop-4` `desktop-5` `desktop-6` |
| 440 | `credit-card-lock` | Commerce & Payments | `credit-card` | `credit-card` `credit-card-2` `credit-card-3` |
| 443 | `file-attachment` | Files & Folders | `file` | `file` |
| 444 | `mail-follow-up` | Communication | `mail` | `mail` `mail-2` `mail-3` |
| 445 | `shield-pending` | Users & Access | `shield` | `shield` `shield-2` |
| 446 | `user-exit` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 447 | `user-segment` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 448 | `credit-card-percent` | Commerce & Payments | `credit-card` | `credit-card` `credit-card-2` `credit-card-3` |
| 451 | `award-certificate` | Status & Feedback | `award` | `award` |
| 457 | ~~`message-pen`~~ | dropped 2026-10-25 (Maruti: "ignore. do not need an icon as of this moment"; re-add with `queue.mjs add message-pen` if wanted later) | `message` | — |
| 458 | ~~`message-smile`~~ | dropped 2026-10-25 (Maruti: "remove. do not need this icon as of right now"; re-add with `queue.mjs add message-smile` if wanted later) | `message` | — |
| 459 | `message-user` | Communication | `message` | `message` `message-2` `message-3` `message-4` `message-5` `message-6` `message-7` |
| 462 | `star-sparkle` | Status & Feedback | `star` | `star` |
| 463 | `user-focus` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 464 | ~~`user-laptop`~~ | dropped 2026-10-25 (Maruti: "ignore. do not need an icon right now"; re-add with `queue.mjs add user-laptop` if wanted later) | `user` | — |
| 465 | `window-chart` | Charts & Data | `window` | `window` `window-2` |
| 467 | `globe-pointer` | Maps & Location | `globe` | `globe` `globe-2` |
| 469 | `image-binary` | Design Tools | `image` | `image` `image-2` `image-3` |
| 470 | `image-depth` | Design Tools | `image` | `image` `image-2` `image-3` |
| 472 | ~~`window-expand-bottom-right`~~ | dropped 2026-10-25 (Maruti: "ignore. Do not need as of right now"; re-add with `queue.mjs add window-expand-bottom-right` if wanted later) | `window` | — |
| 473 | `window-key` | Design Tools | `window` | `window` `window-2` |
| 474 | `window-pointer` | Design Tools | `window` | `window` `window-2` |
| 485 | `phone-forwarded` | Communication | `phone` | `phone` |
| 486 | `phone-missed` | Communication | `phone` | `phone` |

### V4 Circle and square containers — 20 (18 after check-circle-dashed and play-circle-dotted were dropped)

| # | Row | Section on the sheet | Base | Base's shipped shapes |
|---|---|---|---|---|
| 348 | `arrow-down-circle` | Arrows & Direction | `arrow-down` | `arrow-down` `arrow-down-2` `arrow-down-3` `arrow-down-4` |
| 349 | `arrow-left-circle` | Arrows & Direction | `arrow-left` | `arrow-left` `arrow-left-2` `arrow-left-3` `arrow-left-4` |
| 350 | `arrow-right-circle` | Arrows & Direction | `arrow-right` | `arrow-right` `arrow-right-2` `arrow-right-3` `arrow-right-4` |
| 351 | `arrow-up-circle` | Arrows & Direction | `arrow-up` | `arrow-up` `arrow-up-2` `arrow-up-3` `arrow-up-4` |
| 368 | `pause-circle` | Media & Playback | `pause` | `pause` `pause-2` |
| 369 | `play-circle` | Media & Playback | `play` | `play` `play-2` `play-3` |
| 374 | `chevron-down-circle` | Arrows & Direction | `chevron-down` | `chevron-down` `chevron-down-2` `chevron-down-3` |
| 375 | `chevron-left-circle` | Arrows & Direction | `chevron-left` | `chevron-left` `chevron-left-2` `chevron-left-3` |
| 376 | `chevron-right-circle` | Arrows & Direction | `chevron-right` | `chevron-right` `chevron-right-2` `chevron-right-3` |
| 377 | `chevron-up-circle` | Arrows & Direction | `chevron-up` | `chevron-up` `chevron-up-2` `chevron-up-3` |
| 385 | `user-circle` | Users & Access | `user` | `user` `user-2` `user-3` `user-4` |
| 410 | `minus-square` | UI & Layout | `minus` | `minus` |
| 412 | `plus-square` | UI & Layout | `plus` | `plus` |
| 413 | `x-square` | UI & Layout | `x` | `x` |
| 417 | `activity-square` | Charts & Data | `activity` | `activity` `activity-2` |
| 423 | ~~`check-circle-dashed`~~ | dropped 2026-10-25 (Maruti: "check-circle-dash - remove. Dont need an icon") | `check-circle` | — |
| 454 | `hash-circle` | Communication | `hash` | `hash` `hash-2` `hash-3` |
| 455 | `help-square` | Status & Feedback | `help-circle` | `help-circle` `help-circle-2` `help-circle-3` `help-circle-4` |
| 456 | `info-square` | Status & Feedback | `info-circle` | `info-circle` `info-circle-2` `info-circle-3` |
| 471 | ~~`play-circle-dotted`~~ | dropped 2026-10-25 (Maruti: "play-circle-dotted: Do not need icon. reject") | `play-circle` | — |

### V5 Other variants — 21 (20 after rotate-ccw-dotted was dropped)

| # | Row | Section on the sheet | Base | Base's shipped shapes |
|---|---|---|---|---|
| 363 | `text-align-center` | Editing & Text | `text` | `text` `text-2` `text-3` `text-4` |
| 364 | `text-align-left` | Editing & Text | `text` | `text` `text-2` `text-3` `text-4` |
| 365 | `text-align-right` | Editing & Text | `text` | `text` `text-2` `text-3` `text-4` |
| 383 | `text-color` | Editing & Text | `text` | `text` `text-2` `text-3` `text-4` |
| 384 | `text-title` | Editing & Text | `text` | `text` `text-2` `text-3` `text-4` |
| 390 | `chart-bar-horizontal` | Charts & Data | `chart-bar` | `chart-bar` `chart-bar-2` `chart-bar-3` `chart-bar-4` `chart-bar-5` |
| 391 | `chart-bar-stacked` | Charts & Data | `chart-bar` | `chart-bar` `chart-bar-2` `chart-bar-3` `chart-bar-4` `chart-bar-5` |
| 403 | `camera-flip` | Media & Playback | `camera` | `camera` `camera-2` `camera-3` `camera-4` `camera-5` `camera-6` |
| 415 | `battery-charging` | Devices & Hardware | `battery` | `battery` `battery-2` |
| 421 | `calendar-days` | Time & Calendar | `calendar` | `calendar` `calendar-2` `calendar-3` |
| 422 | `chart-bar-trend` | Charts & Data | `chart-bar` | `chart-bar` `chart-bar-2` `chart-bar-3` `chart-bar-4` `chart-bar-5` |
| 424 | `check-double` | UI & Layout | `check` | `check` `check-2` `check-3` `check-4` |
| 425 | `eye-closed` | Users & Access | `eye` | `eye` |
| 428 | `folder-open` | Files & Folders | `folder` | `folder` `folder-2` `folder-3` |
| 431 | `mail-open` | Communication | `mail` | `mail` `mail-2` `mail-3` |
| 432 | `scan-face` | Users & Access | `scan` | `scan` |
| 460 | ~~`rotate-ccw-dotted`~~ | dropped 2026-10-25 (Maruti: "rotate-ccw-dotted: reject. do not need icon") | `rotate-ccw` | — |
| 461 | `search-empty` | UI & Layout | `search` | `search` `search-2` `search-3` |
| 468 | `grid-circle-plus` | Design Tools | `grid` | `grid` `grid-2` `grid-3` `grid-4` `grid-5` `grid-6` `grid-7` |
| 477 | `text-align-justify` | Editing & Text | `text` | `text` `text-2` `text-3` `text-4` |
| 487 | `refresh-ccw` | Arrows & Direction | `refresh` | `refresh` `refresh-2` `refresh-3` |

## Follow-ups handed over by the sessions (2026-10-25, before they were deleted)

From V5:
1. `src/icons/{24,20,16}/text-align-justify.svg` comments still say "lint §2 warns" and "0.25 past the 12 keyline"; it now carries an agreed box. Trim to "the filled stack is 12.5 tall at 16, declared by the box and grows".
2. `src/icons/16/menu-filled.svg` comment says "ends pulled in 0.25"; the drawing pulls them in 0.375.
3. `plans/lint-head-air.md`: add `refresh-ccw-filled` (head air 0.83 · 0.9 · 0.65, refresh's own), and record `chart-bar-trend-2`'s 4.25 filled legs at 16 (the least that keeps C37's 1).
4. `grid-plus` stands on the sheet as its own icon; `queue.mjs` cannot mark it "variant of `grid`" — hand edit or a small tool feature.
5. Quick Look draws small round dots (radius under half the stroke) hollow: `select-2`, `calendar-3`, `calendar-days`. Check the shipping pipeline outlines them as solid discs.
6. `check-double`'s filled 16 second tick keeps only its bend plus 0.27 of leg (the most the overlap allows); no rule names it.

From the main session:
7. Lint does not measure a stroke's end against its own leg across a sharp turn (`activity-square-2`), so that exception lives only in docs/07.
8. C9's wording for a second picture of a composite on the same base (`clipboard-check-2`, `code-plus-2`) is ambiguous.
9. The census of shipped paths that run back on themselves (`atm`, `hourglass-3`, `coins`, `medal` filled and others; `coins-filled` leaves a sliver of ink in the white "1") — script in the camera-5 fix's scratchpad, list in the session record; worth one tidy-up pass.

From V1 (wrapped; 14 rows shipped, crosshair-off dropped):
10. C34's text names only cloud-off and bug-off as `STATE_TWINS` members; point it at the list instead.
11. Lint does not check the `-off` bar (45°, full 18 · 14 · 12 keyline, 1.5 at every cut, channel width); a check would catch drift.
12. Weak at 16, possibly worth Maruti's second look: `video-off-3` (a struck `desktop-2` once the bar takes the play triangle), `camera-off-6` (loses flash dot and lens), `clipboard-off-3` (reads as a struck square), `bolt-off`/`-2` (two ticks), `phone-off` (outline close to `%`).
