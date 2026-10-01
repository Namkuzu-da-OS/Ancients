# Handoff: Ancients redesign (paused 2026-09-27)

**Read first:** `AGENTS.md`, `docs/redesign/DESIGN-BIBLE.md`, `PACKETS.md`, `NOTES.md` (each builder's entry).
Spec = the four frames in `docs/redesign/mockups/full-res/`. Branch `redesign`; `main` and the live site are untouched.

## State
- ✅ 00 Content lock (`tools/verify-content.mjs`, run before every commit)
- ✅ 01 Foundation (Codex)
- ✅ 02 Strata art: 8 plates in `images/redesign/strata/` (`prehistoric-alt.webp` is a spare)
- ⬜ 06 Dial: NOT built (builder ran out of time while reading specs; index.html is still the skeleton). Its NOTES.md entry has the plan + art wishlist. `dial/sky.webp` now exists.
- 🟡 07 Vault: page built in code (niches, filters, gallery panel, bottom sheet) but 3 of 5 niches render dark in the screenshot (cartouche + swords black, hand axe + Venus dim), so the blank-cartouche bug is NOT fixed yet. Debug that first. Painted background is used but wasn't painted for code-drawn niches on top; may need a re-paint with a plain centre (see NOTES).
- 🟡 03/04 Descent + event panel: fully coded (pinned strata, parallax, scroll-drawn gold thread + blue branch, gauge, markers, Did You Know, panel with focus trap, deep links `#era` / `#era-NN`), loads with 0 JS errors and all 63 events, but NEVER visually checked. The desktop screenshot is probably blank (6 KB). First job: screenshot it and compare with frame 2.
- 🟡 Art: in `images/redesign/source/` (gitignored, raw PNGs) → WebP in `images/redesign/`.
  - Done: event 1 (prehistoric/01), `vault/background`.
  - Done: `dial/sky` (the painted sky/ruins background). The ring itself is still code-drawn.
  - Still to generate: `dial/ring` (1:1, transparent surround), all 5 vault niche renders, events 2–63.
- ⬜ 08 Search, 09 Mobile pass, 10 Polish + final review with Daryll.

## How the art was made (keep doing it this way)
All images come from Daryll's ChatGPT window, never a coding agent. The chat is "Redesign Art Directions
Mockup" (it has the frames, so it keeps the look). One image per message. Prompts for all 63 events come from the
data; the list is rebuilt from `data/timeline.json`. File naming: `events/<periodId>/<NN>-<slug>.png`.
The no-click save pipeline (local receiver + postMessage) is described in Claude's memory
`feedback-images-from-chatgpt-window`.

## Rules that must survive
- Content is frozen. Any event that exists must still exist, word for word (Daryll, 2026-09-27).
- 14 popups literally say "Placeholder"; they stay unless Daryll says otherwise.
- Nothing gets pushed or published without Daryll's yes.

## Update 2026-09-30 (paused by Daryll)
- Dial: built (d0afde5), checked in his browser: ring rotates, eras switch. Polish: ring sits low/small on tall windows; arrow keys need page focus.
- Descent: fixed (7e24ad0), checked in his browser: opens on the painted city; Prehistoric matches frame 2.
- Vault: STILL WRONG at his 1070x1741 window: after fix pass 2 the niche wall shrank to a small strip, and the painted background's own niches compete. Fix pass 3 was stopped mid-edit; its partial vault.css is in `git stash` ("vault-pass3-partial"). Brief for the next pass: artifacts big at every size; portrait/<=1300px -> full-width niche wall + panel as bottom sheet/slide-over; background must read as one vault.
- Art: 32 of 63 event images in. ChatGPT stopped accepting messages after event 42 (likely rate limit). Missing: prehistoric 08-11 (incl. theoretical), earlyNeolithic 06,10, earlyUrban 05,07, bronzeAge 04,05, classical 01 onward, then the 5 vault objects. Queue + prompts: session scratchpad `queue2.js` / `event-briefs.json` (rebuild from data/timeline.json if gone).
- Builder rules: test at 1070x1741 (his window), CDP screenshots, never kill Chrome by name.
