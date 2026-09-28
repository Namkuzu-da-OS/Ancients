# Build Notes

## 00 Content freeze (2026-09-27, Claude)
- Extracted the original site into data/timeline.json, data/did-you-know.json, data/artifacts.json with tools/extract-content.mjs.
- tools/verify-content.mjs re-extracts from main on every run and fails on any difference (tamper-tested).
- Findings: 8 eras, 63 events, 31 with popup details, 1 theoretical (Younger Dryas Impact); Did You Know shows for 6 eras (Neolithic, Early Urban have none); 5 artifacts, all images present.

## 01 Foundation (2026-09-27, Codex)
- Added the shared redesign tokens, typography, header/nav/search shell, gold/blue ornament variants, and responsive page-stage primitives in `css/redesign/`.
- Replaced the three entry pages with Dial, Descent, and Artifact Vault skeletons; each uses the same frame-matched header and clearly scoped placeholder regions for later packets.
- Added `js/redesign/data.js`: one cached loader for all frozen JSON sources, explicit console counts, and a 2026-based `yearsAgo()` helper with a four-case self-test covering BCE, CE, `~`, `c.`, and commas.
- Verified all three pages through `python -m http.server 8000` in Chrome, including a 1680×945 header comparison; each reached the ready state with no console warnings or errors.
- Left out by packet boundary: generated art, data rendering, Dial interaction, Descent strata/markers, event and artifact details, search behavior, motion, and final mobile treatment. Their skeleton regions are intentional; no later-packet behavior was verified.
