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

## 06 The Dial (2026-09-27, Claude): NOT BUILT, stopped at wrap-up
- **What works:** nothing new. The run was stopped during research, before any code was written. `index.html`, `css/redesign/dial.css` and `js/redesign/dial.js` are unchanged or missing. `index.html` is still the Codex packet-01 skeleton. No server was left running, and nothing was committed.
- **Research done (reuse it):** read AGENTS, the bible, PACKETS, frames 1 and 4, `data.js`, the shared CSS and all the data. Key facts:
  - Prehistoric has 12 events. Taking 6 evenly gives indices 0, 2, 4, 7, 9, 11. Index 9 is the theoretical one (title "NORTH AMERICA [THEORETICAL]", shortDesc "Impact Event (Theoretical)"), so it is already included.
  - Earlier notes named the theoretical event "Younger Dryas Impact". Its data title is actually "NORTH AMERICA [THEORETICAL]", so the medallion label has to come from the data.
  - Its `details.details` begins with "Placeholder:". That is frozen data, and it will show in the panel.
  - The strata plates are 1672×941. The scene band sits at about y 8–68%, with rock above and below. The Dial window needs a background-size of about 230% and a per-era x focus, roughly: prehistoric .50, earlyNeolithic .36, earlyUrban .52, bronzeAge .40, classical .46, postClassical .52, earlyModern .34, modern .62.
  - In frame 1 the ring is tilted: its vertical scale is about 0.8 of its horizontal. The centre is at about (49.7vw, 52.6vh) and the outer radius about 52.6vh. The ring extends up behind the header, so the Dial page needs a transparent header override in `dial.css`.
- **Plan for the next run:**
  - Layers: a code-drawn sky canvas; a rotating ring made of 3 stacked SVGs (a static bezel, a rotor turned with CSS `rotate` of -45°×era, and a static rim), with a `scaleY(.8)` parent; an elliptical HTML window that crossfades the plates; an orbit SVG with HTML medallions on an ellipse through angles 196°→-2°; front ruins and an ember canvas.
  - Swap in `images/redesign/dial/ring.webp` for the SVG rotor when an `Image()` load of it succeeds.
  - Enter this era: GSAP expands the window to full screen, then `@view-transition { navigation: auto }` handles the cross-document step.
- **Art note from the coordinator:** a painted `images/redesign/dial/ring.webp` (transparent) is arriving. `sky.webp` may be missing or mislabeled. Check both before building.
- **Art wishlist (ChatGPT):**
  1. `dial/ring.webp`: the zodiac precession ring alone, flat and seen from straight on (not tilted, because the code applies the tilt), on transparency, 2048px square. It needs a carved stone band, gold engraved zodiac figures and age names, and an empty centre hole about 45% of the diameter.
  2. `dial/sky.webp`: the night sky and Milky Way over ruined megalithic walls with torches, at 1672×941 or 2x. Keep the centre dark and plain, because the ring covers it.
  3. `dial/embers.webp`: an overlay of torches and candle rubble for the bottom corners, on transparency.
  4. The 63 event images in `events/<era>/NN-<slug>.webp` (packet 05). The medallions depend on them. Until they exist, the fallback is a crop of the era plate.
- **Unverified:** everything about the Dial. There are no Dial screenshots (`dial-desktop.png` and `dial-mobile.png` are not in `docs/redesign/review/`).

## 07 The Artifact Vault (2026-09-27, Claude; NOT committed, cut short by session end)
- Built: `artifacts.html` (Codex head/header kept; added `vault.css` link + `vault.js`), `css/redesign/vault.css`, `js/redesign/vault.js`.
- Carved facade in code: SVG-noise lit rock textures, lintel frieze, glyph pillars with sconce flames, 3-over-2 arched niches (data order), candles, plinths, framed plaques with diamond terminals, floor disc, braziers, star sky, ember canvas, flicker. Mysterious = blue niche/plaque/panel; everything else gold.
- Filter strip (All / Mysterious / Tools & Weapons / Art & Symbols → category `mysterious`/`tools`/`art`): non-matching niches go dark (hidden on phones).
- Detail panel: gallery (arrows, thumbs, dots, keyboard ←/→, swipe; every image the artifact has), title, category tags, era split on " • " into place/dates, Overview/Context/Significance/Mysteries (null skipped). "Explore artifact" opens a wide folio view; Escape/close restore. ≤1050px the panel is a bottom sheet.
- Painted art hooks: `images/redesign/vault/background.webp` (probed; replaces the coded rock, walls, stairs, floor, braziers) and `images/redesign/vault/<artifactKey>.webp` per niche (probed; replaces the photo presentation). Missing images hide rather than show broken icons. Absent per-niche renders cause 404 lines in the console (Image() probe).
- `node tools/verify-content.mjs` passes. Screenshots: `docs/redesign/review/vault-desktop.png`, `vault-mobile.png` (first pass only).
- KNOWN GAPS (first screenshot, not fixed): in the headless shot only the first niche finished its "torch lights" entrance; the cartouche and swords displays render black and axe/Venus very dim. Check whether that is headless virtual time cutting the staggered filter transition short or a real bug (`.vault-stage.is-lit .niche__display` transition, and the `.niche__slab`/`.niche__vitrine` sizing: `height:100%` + aspect-ratio inside a flex item). Fix before calling it done.
- Not done/unverified: no side-by-side comparison with frame 3; mobile shot not reviewed; the painted background (just arrived) hides the coded walls but was not art-directed against the niches; header background is made more transparent on this page only (vault.css override, shared CSS untouched); folio mode, bottom sheet, focus restore and reduced motion not tested in a browser.
- Art wishlist (ChatGPT, bible style preamble): (1) vault background: the cave around the vault only (carved side walls with animal reliefs, stairs with candles, floor with inlaid gold disc, braziers, night sky through the cave mouth) and a plain dark carved-rock centre, since the niches are drawn in code on top; 16:9, ~2400px, WebP ≤350 KB. (2) Five niche renders on pure black (so they blend with `lighten`), no text: `mysterious-handbags.webp` (stone relief slab with the handbag figure, cool blue light), `egyptian-cartouches.webp` (Hatshepsut cartouche stele), `bronze-age-swords.webp` (three bronze swords upright), `paleolithic-hand-axe.webp` (Acheulean flint hand axe), `venus-figurines.webp` (Venus of Willendorf); each checked against the real artifact photo.
