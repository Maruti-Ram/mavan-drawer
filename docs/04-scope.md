# Scope — categories and the v1 set

## Calibration

| Library | Icons | Note |
|---|---|---|
| Font Awesome v7 | **65,928** | the ceiling; a decade and a team |
| Nucleo (5 families) | ~64,000 | 7 grids × 2 styles |
| Nucleo UI (1 family) | 22,000 | across 36 categories |
| Lucide | ~1,500 | single master, community |
| Shopify Polaris | 499 | one product's actual need |
| Vercel Geist | ~300 | one product's actual need |

**Polaris and Geist are the honest reference points for a v1.** A real SaaS
product ships fewer than 500 icons. Everything above that is market coverage, and
market coverage is a year-three problem.

---

## The taxonomy

Nucleo UI's 36 categories, filtered for SaaS and collapsed into 9. Their icon
counts are in brackets — note how lopsided a mature library is.

> Nucleo UI for reference: Arrows (2646), UI/Layout (3014), Design/Development
> (2344), Business/Finance (1457), Shopping (810), Communication (784),
> Technology/Devices (754), Files (748), Photography/Video (719), Editing (704),
> Users (643), Maps/Location (514), Time (452), Sound/Music (406)… down to
> Accessibility (98) and Loaders (34).

Two categories — **Arrows** and **UI/Layout** — are 26% of their entire library.
Budget accordingly.

---

## Tier 1 — the v1 set (~120 icons)

Everything a SaaS product needs before it needs anything else.

| # | Category | ~n | Contents |
|---|---|---|---|
| 1 | **Arrows & Direction** | 18 | arrow ×4, chevron ×4, caret ×4, external-link, expand, collapse, refresh, undo, redo |
| 2 | **UI & Layout** | 20 | menu, close, search, filter, sort, grid, list, columns, sidebar, maximise, minimise, more-h, more-v, drag-handle, gear, sliders, plus, minus, check, x |
| 3 | **Files & Folders** | 14 | file, file-text, folder, folder-open, upload, download, copy, archive, trash, attachment, image, video, link, export |
| 4 | **Users & Access** | 12 | user, users, user-circle, login, logout, key, lock, unlock, shield, eye, eye-off, badge |
| 5 | **Communication** | 12 | mail, mail-open, message, chat, bell, bell-off, send, phone, share, at, megaphone, inbox |
| 6 | **Time & Calendar** | 10 | calendar, calendar-days, clock, timer, history, stopwatch, hourglass, alarm, repeat, schedule |
| 7 | **Status & Feedback** | 12 | check-circle, x-circle, alert-triangle, alert-circle, info, help, loading, star, heart, flag, bookmark, sparkle |
| 8 | **Editing & Text** | 14 | pencil, duplicate, cut, bold, italic, underline, code, quote, list-ordered, list-bullet, align ×3, link-break |
| 9 | **Charts & Data** | 10 | bar-chart, line-chart, pie-chart, table, database, trending-up, trending-down, activity, filter-data, report |

**Total: 122 bases.** At 2 masters × 2 styles that is **488 drawings** — a real
but finite project. Add ~60 modifier variants (see `05-modifiers.md`) and the v1
ships around **180 distinct icons**.

---

## Tier 2 — after v1 proves out (~80)

Commerce & Payments · Media & Playback · Maps & Location · Devices & Hardware ·
Development & Version Control · Security (deeper) · Integrations & Logos

## Tier 3 — on demand only

Weather · Healthcare · Education · Transportation · Food · Emoji · AR/VR ·
Animals · Sport · Fashion · Holidays

These are what take a library from 500 to 20,000. None of them belong in a v1,
and most never pay for themselves.

---

## Sequencing

1. **Draw 15 icons across 5 categories first**, not 122 in one. Deliberately pick
   the hardest in each — `calendar`, `user`, `sliders`, `database`, `chart`. They
   will break rules in `01-foundations.md`, and finding that out at icon 15 is
   cheap. At icon 90 it is not.
2. **Freeze the foundations** once those 15 hold.
3. Draw the remaining Tier 1 at the 24 master only.
4. Derive the 16 master across the set.
5. Filled style — **superseded 2026-09-17:** drawn alongside the outline, per icon, not as a later pass.
6. Modifiers last — they depend on settled bases (see the cut-back problem).

## Prioritisation rule

An icon enters the set when someone can **name the screen it appears on**. The
Tier 1 list above is a hypothesis about a generic SaaS product; check it against
two or three real products before drawing, and cut anything that does not show up.
**That check has been run:** see [06-audit.md](06-audit.md).
