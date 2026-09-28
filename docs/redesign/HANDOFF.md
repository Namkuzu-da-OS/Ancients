# Handoff: Ancients redesign (paused 2026-09-27)

**Read first:** `AGENTS.md`, `docs/redesign/DESIGN-BIBLE.md`, `PACKETS.md`, `NOTES.md` (each builder's entry).
Spec = the four frames in `docs/redesign/mockups/full-res/`. Branch `redesign`; `main` and the live site are untouched.

## State
- ✅ 00 Content lock (`tools/verify-content.mjs`, run before every commit)
- ✅ 01 Foundation (Codex)
- ✅ 02 Strata art: 8 plates in `images/redesign/strata/` (`prehistoric-alt.webp` is a spare)
- 🟡 03/04 Descent, 06 Dial, 07 Vault: built in parallel by three agents in one session, committed as a
  work-in-progress checkpoint. See their NOTES.md entries for what works and what's left. Not yet reviewed
  side by side with the frames, so do that before anything else.
- 🟡 Art: in `images/redesign/source/` (gitignored, raw PNGs) → WebP in `images/redesign/`.
  - Done: event 1 (prehistoric/01), `vault/background`, possibly one or two vault niches.
  - Done: `dial/sky` (the painted sky/ruins background). The ring itself is still code-drawn.
  - Still to generate: `dial/ring` (1:1, transparent surround), remaining vault niches, events 2–63.
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
