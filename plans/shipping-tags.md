# Tags in the box: every proposed change, to read first

**Status: applied 2026-10-27** on Maruti's word ("lock and approve whatever we have"), with the recommendation on each call in section 7 — calls 1–6 and 8 as recommended, **call 7 (the lint rule) deferred** to the tags pass he will do later. 181 icons changed (the 178 below plus `signal`, `select-crosshair`, `share-2` from call 2), 1,086 files, tags lines only; checked line by line against this list by a fresh reviewer. The list below is kept as the record of what changed. Written 2026-10-27, for `plans/shipping.md` wave 2 report item 4.

Every icon carries a line of search words in its files (`<!-- tags: … -->`). `meta.json` in the box prints the 24 outline file's line, so customers read it. The same line sits in **all six files of an icon** (outline and filled, at 24, 20 and 16; I checked: 0 of 1,310 icons differ between their six). A change is made in all six.

- **178 icons** change, in **1,068 files** (178 × 6). 164 icons and 984 files if you strike all of 3b.
- **328 words** come out and **128 go in** (a swap counts once each way).
- The 24 untagged icons have no tags line at all today, so 144 of those files get a new line, in the place the draft tool writes it (after `keyline`, before `box`).
- No drawing changes. Lint does not read tags. Rebuilding also rewrites `lab/manifest.json` (tracked; the Library search reads tags from it).
- The reference sources stay in each file's own drawing note, which never ships. Not quite everywhere: 269 of 298 struck source words are also named in the same file's note; 29 are not (call 3).
- **Your rulings of today are applied.** `stack-3` is being retired, so no change is listed for it, and its words `cards`, `deck`, `pile` move to `categories-2` (section 6). `text-4` and `dollar-circle-2` are held: no proposal for either (see Held, before the calls).

**What I need from you:** "approve all", or strike the lines you want left as they are. The calls at the end (section 7) have my recommendation each.

How to read a line: ~~struck~~ words come out; **bold** words go in; what is left is the proposed line. Where an icon is in more than one section, later sections show its whole line with everything struck so far.

| Section | Icons | Words out | Words in |
|---|---|---|---|
| 1 · Other sets' names | 132 | 298 | 0 |
| 2 · Other sets' icon ids | 2 | 3 | 0 |
| 3a · Our drawing words (your list, less text-4) | 7 | 8 | 8 |
| 3b · More drawing words (found by the sweep) | 16 | 18 | 0 |
| 4 · Battery | 1 | 1 | 0 |
| 5 · The 24 untagged | 24 | 0 | 117 |
| 6 · Words moving to categories-2 | 1 | 0 | 3 |

Icons in two or more sections are counted in each, so the rows add up to more than the icon total above.

## 1 · Other icon sets' names: 132 icons, 298 words out

Words struck, by name: lucide 58 · nucleo 57 · central 32 · SF Symbols 28 (as "sf symbols" 25, "sf-symbols" 2, "sf" 1) · material 25 ("material" 23, "material blur_on" 1, "material symbols" 1) · untitled 17 · tabler 17 · phosphor 13 · polaris 12 · fluent 9 · font awesome 8 · bootstrap 3 · remix 3 · octicons 3 · carbon 2 · google 2 · heroicons 1 · feather 2 · figma 4 · ios 0.

Every one of your 20 names is in the files. Two more sets turned up that you did not name, and I struck them with the rest: **mdi** (`rotation-360`, Material Design Icons) and **hugeicons** (`rotation-360-3`). `figma` stays on `component` and `feather` on `quill` (call 1; `quill`'s is the plain word for the pen). `stack-3` is not listed: it is being retired (section 6). `gem-shine` and `filters-3` are here for their set names; their whole lines are in 3a.

- `align-object-bottom`: align bottom, bottom edges, align, alignment, arrange, objects, layers, design tools, guide line, two boxes, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~phosphor~~, ~~central~~
- `align-object-center-h`: align horizontal centers, align center, centred on a vertical line, align, alignment, arrange, objects, layers, design tools, guide line, two boxes, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~phosphor~~, ~~central~~
- `align-object-center-v`: align vertical centers, align middle, centred on a horizontal line, align, alignment, arrange, objects, layers, design tools, guide line, two boxes, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~phosphor~~, ~~central~~
- `align-object-left`: align left, left edges, flush left, align, alignment, arrange, objects, layers, design tools, guide line, two boxes, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~phosphor~~, ~~central~~
- `align-object-right`: align right, right edges, flush right, align, alignment, arrange, objects, layers, design tools, guide line, two boxes, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~phosphor~~, ~~central~~
- `align-object-top`: align top, top edges, align, alignment, arrange, objects, layers, design tools, guide line, two boxes, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~phosphor~~, ~~central~~
- `aspect-ratio`: corner marks, frame, ratio, ~~material~~, ~~tabler~~, ~~nucleo~~
- `aspect-ratio-2`: corner marks, square, ~~nucleo~~
- `atm`: slot, banknote, cash out, withdraw, cash machine, ~~nucleo~~
- `award`: ribbon, medal, ring, ~~lucide~~, ~~nucleo~~, ~~central~~
- `badge-check`: membership, verified, badge, scalloped, tick, ~~central~~, ~~lucide~~
- `bank`: temple, columns, pediment, landmark, finance, ~~lucide~~, ~~sf symbols~~
- `card-reader`: card, plug-in, mobile reader, jack, ~~nucleo~~, ~~polaris~~
- `card-reader-contactless`: tap, contactless, waves, nfc, ~~polaris~~
- `circle`: ring, round, shape, ellipse, geometry, ~~lucide~~, ~~sf symbols~~, ~~central~~, ~~nucleo~~, ~~fluent~~, ~~untitled~~, ~~material~~
- `circle-dashed`: dashed, outline, placeholder, draft, ring, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~
- `coins`: pair, numbered, face-on, count, ~~lucide~~, ~~untitled~~, ~~central~~
- `coins-2`: stack, pile, coin, numbered, ~~untitled~~, ~~tabler~~
- `coins-plus`: pair, plus, add, top up, face-on, ~~central~~
- `compass-drafting`: drafting compass, compass, dividers, geometry, drawing, design, construct, arc, handle, ~~nucleo~~
- `confetti`: popper, cone, party, celebrate, ~~polaris~~, plus sparks, burst
- `corner-radius`: rounded corner, radius, border radius, ~~polaris~~, ~~nucleo~~, ~~figma~~
- `corner-radius-2`: rounded corner, radius, top-right, ~~lucide~~, ~~material~~
- `credit-card-contactless`: card, waves, badge, ~~nucleo~~, ~~central~~
- `crop`: crossed brackets, trim, cut, ~~lucide~~, ~~polaris~~, ~~nucleo~~, ~~untitled~~, ~~sf symbols~~, ~~material~~
- `crop-2`: woven, over and under, ~~untitled~~
- `currency-convert`: exchange, convert, swap, money, currency, ~~polaris~~
- `droplet`: drop, droplet, water, liquid, ink, plain, ~~lucide~~, ~~material~~, ~~sf symbols~~, ~~phosphor~~, ~~tabler~~, ~~feather~~, ~~fluent~~
- `droplets`: drops, droplets, water, liquid, two, ~~lucide~~
- `euro`: euro, sign, oval, between, ~~sf-symbols~~, ~~central~~
- `eyedropper`: eyedropper, dropper, pipette, colour picker, color picker, sample, bulb, ~~nucleo~~, ~~phosphor~~, ~~sf symbols~~, ~~fluent~~, ~~bootstrap~~, photoshop
- `eyedropper-2`: eyedropper, pipette, colour picker, color picker, sample, crossbar, ~~polaris~~, ~~tabler~~, ~~material~~
- `face-smile`: dash eyes, concentric, ~~polaris~~, wide sweep
- `fast-forward`: media, forward, two triangles, spaced, ~~lucide~~
- `filters`: filters, photo filters, presets, three circles, interlaced, ~~nucleo~~
- `filters-3`: filters, blur, halftone, effect, dots, ~~material blur_on~~
- `flip-horizontal`: flip, mirror, reflect, horizontal, two triangles, dashed axis, ~~lucide~~, ~~nucleo~~, ~~figma~~
- `flip-horizontal-2`: flip, mirror, reflect, horizontal, dashed, half, copy, ~~material~~, ~~google~~
- `flip-horizontal-3`: flip, mirror, reflect, horizontal, square, dashed axis, symmetry, ~~lucide~~
- `flip-vertical`: flip, mirror, reflect, vertical, two triangles, dashed axis, ~~lucide~~, ~~nucleo~~, ~~figma~~
- `flip-vertical-2`: flip, mirror, reflect, vertical, dashed, half, copy, ~~material~~, ~~google~~
- `flip-vertical-3`: flip, mirror, reflect, vertical, square, dashed axis, symmetry, ~~lucide~~
- `gem`: gem, diamond, jewel, girdle, simple, premium, ~~nucleo~~, ~~tabler~~
- `gem-2`: gem, diamond, jewel, facets, brilliant, premium, ~~lucide~~, ~~nucleo~~, ~~font awesome~~, ~~bootstrap~~
- `gem-shine`: gem, diamond, shine, sparkle, premium, new, ~~material symbols~~, diamond_shine, ~~nucleo~~, gem-sparkle
- `gift`: bow, ribbon, lid, ~~lucide~~, ~~central~~
- `git-branch`: branch, version control, source control, git, nodes, rings, elbow, ~~octicons~~
- `git-merge`: merge, version control, source control, join, git, nodes, rings, elbow, ~~octicons~~
- `git-pull-request`: pull request, pr, merge request, review, version control, git, nodes, rings, elbow, ~~octicons~~
- `hand-coins`: hand, palm, payout, pay, donate, ~~central~~, ~~untitled~~, ~~lucide~~
- `handshake`: clasp, fingers, thumb, deal, agreement, partner, ~~lucide~~
- `handshake-2`: grip, solidarity, arm wrestle, team, ~~nucleo~~
- `hash-circle`: circle, container, number, channel, hashtag, pound, ~~nucleo~~
- `heart-handshake`: heart, care, charity, clasp, ~~central~~
- `hexagon`: hexagon, shape, polygon, six sides, plain, point up, ~~lucide~~, ~~nucleo~~, ~~sf symbols~~
- `hourglass`: funnel, ~~lucide~~
- `image-depth`: picture, photo, depth, depth map, near, far, mountains, foreground, background, parallax, 3d, ~~nucleo~~
- `label`: plate, category, gmail, ~~material~~, ~~nucleo~~
- `label-2`: hang tag, tag, hole, ~~nucleo~~
- `label-important`: important, priority, notched, gmail, ~~material~~
- `loader`: ticks, spinner, radial, ~~nucleo~~, ~~lucide~~
- `login-3`: sign in, enter, door, fixed, ~~tabler~~
- `logout-3`: sign out, exit, door, fixed, ~~tabler~~
- `medal`: medal, first, gold, 1, winner, numeral, ~~lucide~~, ~~central~~
- `octagon`: octagon, shape, polygon, eight sides, stop, plain, ~~lucide~~, ~~sf symbols~~
- `octagon-dashed`: octagon, shape, polygon, dashed, placeholder, marquee, ~~sf symbols~~, ~~lucide~~
- `palette`: palette, paint, colour, color, art, theme, notch, ~~material~~, ~~lucide~~, ~~phosphor~~, ~~tabler~~, ~~font awesome~~
- `palette-2`: swatches, swatch, swatch book, colour, color, styles, cards, fan, ~~heroicons~~, ~~lucide~~, ~~tabler~~, ~~sf symbols~~, ~~nucleo~~
- `pen-tool`: pen tool, pen, nib, holder, fountain pen, bezier, ~~lucide~~, ~~nucleo~~
- `pen-tool-2`: pen tool, pen, nib, holder, up-left, cursor hotspot, ~~lucide~~
- `pencil-ruler`: pencil, ruler, design, drafting, crossed, ~~lucide~~, ~~phosphor~~, ~~sf symbols~~, ~~material~~, ~~font awesome~~, ~~nucleo~~, ~~remix~~
- `pencil-ruler-2`: pencil, ruler, design, drafting, side by side, upright, ~~remix~~
- `percent`: rings, slash, character, ~~lucide~~, ~~phosphor~~, ~~untitled~~
- `percent-2`: typographic, steep, rings, character, ~~sf-symbols~~
- `percent-circle`: circle, container, discount, ~~central~~, ~~untitled~~, ~~tabler~~
- `phone-contactless`: phone, mobile, waves, ~~lucide~~, ~~material~~
- `piggy-bank`: savings, piggy, save, deposit, ~~central~~, ~~untitled~~
- `reset-3`: reset, undo, loop, ~~fluent~~
- `reward`: points, stars, loyalty, star, circle, container, slim, ~~sf symbols~~
- `rewind`: rewind, media, back, two triangles, ~~lucide~~
- `rotation`: rotation, rotate, ring, half dashed, dashed, counter-clockwise, ~~material~~, android
- `rotation-360`: rotation, 360, 360 degrees, spin, turn around, full turn, ~~material~~, ~~mdi~~, ~~tabler~~
- `rotation-360-3`: rotation, 360, 360 degrees, loop, spin, ~~tabler~~, ~~hugeicons~~
- `rotation-cw`: rotation, rotate, ring, half dashed, dashed, clockwise, rotate right, ~~material~~, android
- `ruler`: ruler, measure, straight, diagonal, 45, ticks, ~~lucide~~, ~~phosphor~~, ~~fluent~~, ~~font awesome~~, ~~carbon~~, ~~nucleo~~
- `ruler-2`: ruler, measure, flat, horizontal, ticks, ~~sf symbols~~, ~~material~~, ~~font awesome~~, ~~carbon~~, ~~tabler~~
- `ruler-3`: ruler, measure, l-square, carpenter square, combined, corner, ~~tabler~~, ~~font awesome~~, ~~bootstrap~~
- `ruler-4`: ruler, measure, set square, triangle, drafting, ~~material~~, ~~font awesome~~
- `ruler-5`: ruler, measure, dimension, dimension line, size, length, ~~lucide~~, ~~tabler~~
- `scale`: balance, scales, justice, law, weighing, beam, pans, dish, ~~central~~, ~~nucleo~~
- `scale-2`: kitchen, food, shop, tray, dial, ~~nucleo~~
- `scale-3`: parcel, shipping, platform, dial, package, ~~nucleo~~
- `scale-4`: balance, scales, justice, law, weighing, beam, pans, tipped, unbalanced, compare, ~~untitled~~, ~~nucleo~~
- `select`: select, selection, select area, marquee, dashed, cursor, pointer, ~~material~~, ~~lucide~~, photoshop
- `select-2`: select, selection, select area, marquee, dotted, arrow, pointer, ~~nucleo~~
- `select-element`: select, select element, inspect, pick, pointer, cursor, square, chrome devtools, ~~lucide~~
- `select-object`: select, selection, select object, bounding box, handles, transform, pointer, ~~figma~~, sketch, ~~sf symbols~~
- `shapes`: shapes, shape tool, insert shape, overlap, ~~sf symbols~~, ~~central~~, ~~material~~
- `shapes-2`: shapes, playground, geometry, loose, diamond, ~~central~~
- `shopping-bag`: tapered, smile handle, ~~central~~, ~~untitled~~
- `shopping-bag-2`: tote, tapered, arch handle, ~~nucleo~~, ~~central~~, ~~untitled~~
- `shopping-bag-3`: fold, band, smile handle, ~~lucide~~, ~~untitled~~
- `shopping-bag-4`: pouch, handbag, soft, ~~central~~, ~~nucleo~~
- `shopping-basket`: open, handles, rim, ~~nucleo~~, ~~central~~, ~~lucide~~
- `shopping-basket-2`: slats, lattice, weave, ~~lucide~~, ~~font awesome~~, ~~phosphor~~
- `shopping-basket-plus`: add, plus, add to basket, ~~central~~
- `skip-back`: media, previous, track, bar, spaced, ~~lucide~~
- `skip-forward`: media, next, track, bar, spaced, ~~lucide~~
- `square`: square, rectangle, shape, box, geometry, unchecked, blank, checkbox, ~~lucide~~, ~~sf symbols~~, ~~central~~, ~~nucleo~~, ~~fluent~~, ~~untitled~~, ~~material~~
- `square-dashed`: dashed, outline, placeholder, marquee, selection, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~
- `stack`: stack, perspective, planes, depth, isometric, exploded, ~~fluent~~, ~~sf symbols~~, xcode
- `stack-2`: stack, perspective, planes, depth, z-order, side view, ~~nucleo~~
- `status`: dial, gauge, ~~polaris~~, stem
- `subscription`: recurring payment, card, repeat, loop, composite, ~~nucleo~~
- `subscription-2`: recurring order, package, box, repeat, loop, composite, ~~nucleo~~
- `tag`: price, label, sale, diagonal, ~~lucide~~, ~~central~~, ~~untitled~~, ~~fluent~~
- `tag-2`: price, string, hang, swing, ~~nucleo~~
- `tag-3`: price, printed, lines, receipt, ~~nucleo~~
- `thumbs-down`: wedge, separate cuff, ~~nucleo~~, thumbs down, dislike, downvote, turned
- `thumbs-up`: wedge, separate cuff, ~~nucleo~~
- `ticket`: admission, event, pass, notched, perforated, torn, ~~central~~, ~~untitled~~, ~~lucide~~, ~~material~~, ~~tabler~~
- `ticket-2`: admission, stub, tear-off, notched, perforated, ~~nucleo~~, ~~remix~~
- `ticket-percent`: coupon, voucher, discount, percent, sale, notched, ~~lucide~~
- `triangle`: triangle, shape, delta, geometry, ~~lucide~~, ~~sf symbols~~, ~~nucleo~~, ~~untitled~~, ~~feather~~, ~~material~~, ~~fluent~~
- `triangle-dashed`: dashed, outline, placeholder, triangle, ~~lucide~~
- `truck`: box truck, side, stepped cab, ring wheels, ~~lucide~~, ~~central~~, ~~sf~~
- `truck-fast`: speed lines, motion, fast, delivery, ~~nucleo~~, ~~polaris~~
- `vector`: vector, bezier, bezier curve, anchor, handle, path, ~~nucleo~~, ~~tabler~~
- `vector-2`: vector, edit path, direct selection, pointer, spline pointer, anchor, ~~lucide~~, illustrator
- `warehouse`: shed, roller door, shutter, garage, ~~lucide~~, ~~central~~
- `warehouse-2`: inventory, stock, boxes, stacked, storage, ~~polaris~~, ~~nucleo~~
- `warehouse-3`: inventory, stock, boxes, stacked, storage, ~~polaris~~, shed

## 2 · Other sets' icon ids: 2 icons, 3 words out

Your three, found as stated:

- `gem-shine`: gem, diamond, shine, sparkle, premium, new, ~~material symbols~~, diamond_shine, ~~nucleo~~, ~~gem-sparkle~~  (whole line in 3a)
- `library`: library, shelf, books, ~~square-library~~, ~~saved-items~~

`library`: `saved-items` is also the name of one of our own icons (`saved-items`, `saved-items-2`), so left on `library` it points a customer at the wrong drawing.

The sweep: of the 34 hyphenated and 2 snake_case tags, I compared each with the icon names in the five snapshots in `research/sources` (lucide, feather, nucleo, nucleo-ui, polaris; 5,388 ids). Matches: `gem-sparkle` (Nucleo), `saved-items` (Nucleo), `square-library` (Lucide), all above; and `user-2` (Lucide) and `user-3` (Nucleo), which are **our own names** for the figure on `users-2` and `users-3` and their `-behind`, `-level`, `-wide` (8 icons): they match by coincidence, so I leave them. Two snake_case tags, `diamond_shine` (Material Symbols' id) and `material blur_on`, go in 3a and 1. No other tag looks like another set's id; the rest are plain English (`add-on`, `auto-fix`, `i-beam`, `l-square`, `post-it`, `u-turn`, `to-do`, …).

## 3a · Our own drawing words, your list: 7 icons, 8 words out, 8 in

Each line is as you wrote it, checked against the file (the file's current line matches what you quoted for all of them). `text-4` is not here: it is held (below).

- `filters-3`: filters, blur, halftone, effect, dots, ~~material blur_on~~ → filters, blur, halftone, dots, **dot grid**, **fade**, effect
- `gem-shine`: gem, diamond, shine, sparkle, premium, new, ~~material symbols~~, ~~diamond_shine~~, ~~nucleo~~, ~~gem-sparkle~~ → gem, diamond, shine, sparkle, **rays**, premium, new
- `microphone`: stand, cradle, base, stem, ~~size-specific~~ → stand, cradle, base, stem
- `microphone-off`: stand, cradle, base, stem, ~~size-specific~~, off, slash, disabled, muted → stand, cradle, base, stem, off, slash, disabled, muted
- `pencil-2`: edit, write, ~~round cap~~, soft, eraser → edit, write, **round end**, soft, eraser
- `phone`: call, handset, ~~square keyline~~, ~~smaller~~ → call, handset, **telephone**, **receiver**
- `phone-off`: call, handset, ~~square keyline~~, ~~smaller~~, off, slash, disabled, no calls → call, handset, **telephone**, **receiver**, off, slash, disabled, no calls

`receiver` already sits on `radio-2` and `satellite-dish`, so a search for "receiver" will list them beside the phone. `rays` is true to the drawing (its note: "a gem with three short rays over it"); `fade` is too (`filters-3`'s dots grow from small at the edge to big in the middle).

## 3b · More drawing words, found by the sweep (mine, not on your list): 16 icons, 18 words out

I read all 2,140 distinct tags for words that only mean something inside our workshop: a rule's name, a measurement, a reference to another of our icons. No tag carries "keyline" apart from `phone` and `phone-off`, none "gap" except `rim gap` (plain English), none a C-number, none "master" except `component`. These are the ones that did:

- `calendar-repeat`: recurring, repeat, event, schedule, loop, two heads, ~~proud~~ → recurring, repeat, event, schedule, loop, two heads
- `calendar-repeat-2`: recurring, repeat, event, schedule, loop, one head, ~~proud~~ → recurring, repeat, event, schedule, loop, one head
- `copy`: copy, duplicate, two sheets, corner L, ~~offset 4~~, open → copy, duplicate, two sheets, corner L, open
- `files-4`: stack, side, ~~full size~~ → stack, side
- `images-4`: stack, side, ~~full size~~ → stack, side
- `list-ordered`: list, numbered, ordered, numerals, steps, three lines, oval head, compound curve, straight diagonal, ~~pixel one~~, ~~list-bullet rows~~, ~~family rows~~ → list, numbered, ordered, numerals, steps, three lines, oval head, compound curve, straight diagonal
- `pencil`: edit, write, sharp, pointed, ~~angle exception~~ → edit, write, sharp, pointed
- `refresh-2`: reload, sync, two heads, clockwise, ~~circle size~~ → reload, sync, two heads, clockwise
- `shekel`: shekel, new shekel, israeli shekel, sheqel, ils, nis, currency, money, sign, ~~cap height~~ → shekel, new shekel, israeli shekel, sheqel, ils, nis, currency, money, sign
- `shekel-circle`: shekel, new shekel, israeli shekel, sheqel, ils, nis, currency, money, sign, ~~cap height~~, coin, circle → shekel, new shekel, israeli shekel, sheqel, ils, nis, currency, money, sign, coin, circle
- `subscription`: recurring payment, card, repeat, loop, ~~composite~~, ~~nucleo~~ → recurring payment, card, repeat, loop
- `subscription-2`: recurring order, package, box, repeat, loop, ~~composite~~, ~~nucleo~~ → recurring order, package, box, repeat, loop
- `target`: bullseye, two rings, small dot, ~~knockout~~ → bullseye, two rings, small dot
- `target-2`: crosshair, scope, ticks, ~~knockout~~ → crosshair, scope, ticks
- `timer`: timer, countdown, crown, bar, hand, 45, ~~bar 8~~ → timer, countdown, crown, bar, hand, 45
- `wallet`: tab, pocket, ~~proud~~ → tab, pocket

Why each: `proud` (a part standing proud of the body, C33 talk); `offset 4`, `bar 8`, `circle size`, `cap height`, `full size` (our measurements); `angle exception` (a docs/07 heading); `knockout`, `composite` (our terms for a cut-out shape and a base-plus-badge icon); `pixel one`, `list-bullet rows`, `family rows` (candidate names and a pointer to our other icons).

**Fine as English, left alone:** `plinth` (`trophy`, `trophy-2`), `anchor` (`vector`, `vector-2`, the anchor icons), `master` (`component`), `canvas` (`rotate-ccw-5`), `ink` (`droplet`), `stroke` (`paintbrush-3`, `-4`, `-7`), `fill` (the progress bars), `outline` (the three dashed shapes), `defaults` (`reset`), `old` (`save`), `modern` (`key`), `rim gap` (`troubleshoot-2`), `rim handles` (`trophy-2`), `three units` (`server-3`, a rack unit), `one board`, `two boards` (the signboards on `roadmap`, `roadmap-2`), `no axis` (three charts), `corner L` (`copy`, `copy-3`), `small back` (`users-behind`…), `balanced head` (`move`), `menu rows` (`list-bullet`), `base` (`laptop`, the microphones), `container` (the circles that hold a mark), `baseline` (nine icons), `drawer` (`menu-arrow-left`, `-right`); and the style words C9 asks for (`classic` on 67 icons, `steep`, `flat`, `wide`, `soft`, `tight`, `deep`, `slim`).

## 4 · Battery: 1 icon, 1 word out

- `battery`: horizontal, ~~empty~~, cell, power, charge, energy → horizontal, cell, power, charge, energy

Confirmed: `battery-filled` and `battery-full-filled` have identical paths at 24, 20 and 16 (compared with comments set aside). The outline really is an empty body, so the word is true for one style and false for the other; no other battery carries it. (`search-empty` has `empty` too, which is its own meaning.)

## 5 · The 24 untagged icons: 24 icons, 117 words in

The tool printed 24 approved icons whose 24 outline carries no tags. Your 24 and the printed 24 are the same names, both ways round: none is on one list and not the other. Each of these has no tags line in any of its six files.

- `folder-open`: (none) → **open**, **flap**, **leaning flap**, **directory**
- `folder-open-2`: (none) → **open**, **whole flap**, **back cut short**, **directory**
- `map`: (none) → **zigzag**, **folded**, **three panels**, **location**, **navigation**, **atlas**
- `minus`: (none) → **subtract**, **remove**, **dash**, **collapse**
- `minus-circle`: (none) → **remove**, **subtract**, **ring**, **round**
- `minus-circle-small`: (none) → **remove**, **subtract**, **ring**, **small**
- `minus-large`: (none) → **subtract**, **remove**, **dash**, **large**
- `minus-small`: (none) → **subtract**, **remove**, **dash**, **small**
- `minus-square`: (none) → **remove**, **subtract**, **indeterminate**, **square**, **checkbox**
- `more-horizontal`: (none) → **ellipsis**, **three dots**, **options**, **menu**, **overflow**, **horizontal**
- `more-vertical`: (none) → **kebab**, **three dots**, **options**, **menu**, **overflow**, **vertical**
- `plus`: (none) → **add**, **new**, **create**, **cross**
- `plus-circle`: (none) → **add**, **new**, **create**, **ring**, **round**
- `plus-circle-small`: (none) → **add**, **new**, **create**, **ring**, **small**
- `plus-large`: (none) → **add**, **new**, **create**, **large**
- `plus-small`: (none) → **add**, **new**, **create**, **small**
- `plus-square`: (none) → **add**, **new**, **create**, **square**, **box**
- `receipt-refund`: (none) → **refund**, **return**, **u-turn**, **money back**, **badge**, **slip**
- `x`: (none) → **close**, **cancel**, **dismiss**, **remove**, **cross**, **clear**
- `x-circle`: (none) → **close**, **cancel**, **dismiss**, **error**, **ring**, **round**
- `x-circle-small`: (none) → **close**, **cancel**, **dismiss**, **error**, **ring**, **small**
- `x-large`: (none) → **close**, **cancel**, **dismiss**, **cross**, **large**
- `x-small`: (none) → **close**, **cancel**, **dismiss**, **cross**, **small**
- `x-square`: (none) → **close**, **cancel**, **remove**, **square**, **box**

Checked against the files: `more-horizontal` and `more-vertical` are three dots each (three paths); `minus-square` is the checkbox square with a bar (its note says so), hence `checkbox`; `folder-open` has the leaning flap and `folder-open-2` the whole flap with the back wall cut short (their notes). The only new word that already sits on other icons in a different sense is `cross` (call 4); `return` and `u-turn` are already on `enter`, `undo-2`, `redo-2` in the same sense.

## 6 · Words that move when stack-3 retires: 1 icon, 3 words in

`stack-3` goes before 1.0, so I list nothing for it (its `sf symbols` and `ios` go with it). Its search words `cards`, `deck`, `pile` would otherwise be lost, and `categories-2` is the same drawing (at 24 the two files hold the same card and two lines at the same coordinates):

- `categories-2`: category, collection, stack, group → category, collection, stack, group, **cards**, **deck**, **pile**

Not moved: `stack` (`categories-2` already has it) and `perspective`, which you did not list; say if it should go too. Elsewhere today: `cards` is on `columns-2`, `palette-2`, `rows-2`; `deck` on `laptop-2`; `pile` on `coins-2`.

## Held: Maruti is reworking these

No proposal for either. What the sweep found is shown only so nothing is lost.

- `text-4`: serif, type, typography, font, capital, plus box. The sweep flagged `plus box` (a note on how the icon is drawn).
- `dollar-circle-2`: coin, container, bar through, upright. No entry in this list.

## 7 · Judgement calls

Numbered; each has my recommendation. Nothing below is in the lines above unless it says so.

1. **`figma` on `component`.** The icon is Figma's own component mark (its note says so), so the word names the thing. **Keep.** The rule I used for every brand name: keep it when it is what a customer would call the object (`figma` on `component`, `mac` on nine keyboard keys, `ipad` ×4, `airpods` ×2, `face id` ×2, `chromecast` ×1); strike it when it says where we saw the drawing.
2. **Other products named in tags** (not icon sets, so not in section 1): `android` (`rotation`, `rotation-cw`, `signal`), `photoshop` (`eyedropper`, `select`, `select-crosshair`), `illustrator` (`vector-2`), `sketch` (`select-object`), `xcode` (`stack`), `gmail` (`label`, `label-important`), `chrome devtools` (`select-element`), `macos` (`select-crosshair`), `windows` (`share-2`): 14 words on 13 icons, all "where we saw it". **Strike all 14.** That adds 3 icons to the totals above (`signal`, `select-crosshair`, `share-2`). Left alone: the brand names that name the object (call 1), `xd` (the laughing face, not the Adobe app) and `react` (the verb, on `face-smile-plus`).
3. **The record of where a drawing came from.** 269 of the 298 struck source words are also named in the same file's drawing note. **29 are not**, on 18 icons: `align-object-center-h` (phosphor); `align-object-center-v` (phosphor); `award` (lucide, nucleo, central); `crop` (polaris); `euro` (sf-symbols, central); `flip-horizontal` (figma); `flip-vertical` (figma); `gem` (tabler); `hash-circle` (nucleo); `loader` (nucleo, lucide); `logout-3` (tabler); `medal` (lucide, central); `piggy-bank` (central, untitled); `tag` (lucide, central, untitled, fluent); `thumbs-down` (nucleo); `truck` (lucide); `truck-fast` (nucleo, polaris); `warehouse-2` (polaris, nucleo). For these the tag is the only record in the repo that the source was looked at. **Recommendation: keep this document in `plans/` as the record** (it lists every struck word); do not edit the drawing notes. Also: the Library search reads tags, so typing "lucide" there stops finding anything; after the change the notes (and this list) are where to look.
4. **`cross` on both `plus` and the `x` family.** In common speech a cross is a + or a ×, and a search for "cross" will list both families (plus two icons that already carry it in the sense of crossing: `crown-5`, `shuffle-2`). **Recommendation: keep `cross` on the `x` family, drop it from `plus`** (it would read `add, new, create`). Your call; the line in section 5 has it as you wrote it.
5. **`battery`: outline is empty, filled is full.** One tag line serves both styles. **Drop `empty` as you proposed.** Customers still find a low battery by `battery-low`.
6. **My 3b additions (16 icons; 14 of them appear nowhere else).** Optional and separate: strike all of 3b and the totals fall as shown in the opening. **Recommendation: take them**; a customer reading "offset 4" or "knockout" in `meta.json` learns nothing and sees our workshop.
7. **So it does not creep back.** Nothing stops a new icon from carrying a source name or a measurement in its tags. **Recommendation:** one sentence in C9 (docs/07), the `icon` skill and the header of `tools/draft-svg.mjs` ("tags are words a customer would type: no other set's name, no measurement"), and a lint warning for the source names (and, if you take call 2, the product names). The sentence is a rule, so yours to nod; the lint check I would build once you do.
8. **Thin lines after the change.** 8 of the 178 changed icons end with two tags or fewer: `aspect-ratio-2` (corner marks, square); `crop-2` (woven, over and under); `files-4` (stack, side); `hourglass` (funnel); `images-4` (stack, side); `shopping-bag` (tapered, smile handle); `thumbs-up` (wedge, separate cuff); `wallet` (tab, pocket). **Fine**: what is left are the drawing words they already had, and the Library search matches the name as well as the tags. Say if you want me to add words for these.

