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

## 03+04 The Descent (2026-09-27, Claude) — first pass, cut short by session end
- Built `timeline.html` (shared head/header kept identical; added `descent.css`, GSAP 3.13 + ScrollTrigger + Lenis 1.3.11 from jsDelivr, `descent.js`), `css/redesign/descent.css`, `js/redesign/descent.js`.
- All content comes from `data/timeline.json` + `data/did-you-know.json` via `loadAncientsData()`. Eras in reverse data order, events newest to oldest inside each era. Console on load: "[Descent] 8 eras, 63 events rendered", no JS errors. `node tools/verify-content.mjs` passes.
- Strata: each era is a section with a sticky full-viewport plate. It has three layers: the far plate drifting and zooming, a haze glow, and a near layer, which is the same plate masked to its rock bands so the scene recedes behind the rock. There are rock seams with an ember crack between eras and a carved plaque with the era title from the data.
- Molten gold SVG thread through every gold marker. It is drawn as you scroll, with a pour-down entrance and droplets flowing along it. A blue branch runs from the event above the Younger Dryas impact to it, then rejoins gold at the next event. Markers ignite as the thread reaches them.
- Depth gauge (fixed left): a "Years ago" track from `yearsAgo()`, a "0 / Today" surface node, the current node lit and the theoretical node blue. Did You Know appears for the 6 eras with facts and has a random refresh.
- Event panel (packet 04): a right-side dialog (bottom sheet at ≤760px). It shows the image, era, date, title, the Mainstream/Theoretical tag, shortDesc and description. For the 31 events with `details` it adds Overview (only if `details.description` differs), Details, Cultural context, Key figures, Locations and Related artifacts; the other 32 show only their own fields. Prev/next goes through all 63 events in page order. Escape and the close button restore focus. Tab is trapped.
- Event images: `images/redesign/events/<era>/<NN>-<slug>.webp` is probed lazily and used if it exists. Otherwise the fallback is a crop of that era's plate, so there is never a broken image. Missing files will show as 404s in the network log until all 63 exist.
- Deep links: `#<eraId>` scrolls to the era; `#<eraId>-<NN>` (NN = 1-based data index) scrolls to that event and opens its panel.
- UNVERIFIED / LEFT: no visual iteration against frame 2 was done. The desktop review screenshot (`review/descent-desktop.png`, taken with `#prehistoric-10`) came out ~6 KB and is likely blank or mid-intro, so it needs a retake. `review/descent-mobile.png` was captured but not reviewed. Still unchecked: the near-layer mask percentages (`PLATE_ROCK` in descent.js are eyeballed), label and panel collisions at 761–1100px, the Lenis/ScrollTrigger feel, and performance (Lighthouse). The View Transition from the Dial is not wired on this side. The data text "Placeholder: ..." in the theoretical event's details is shown as-is (content frozen).

## Fix pass (Sonnet)

**Bug 1, The Descent — "strata never show, near-black" — not a real CSS bug.** Extensively
re-tested (all 8 eras, a full scroll survey, `#era` deep links, narrow viewport) by driving
headless Chrome directly over CDP (`Page.captureScreenshot` after a real navigation + wait,
not the one-shot CLI flag). Every era renders correctly: dark rock framing top/bottom, the
era's painted world glowing through the gap, gold thread and medallions on top — closely
matching frame 2, including the blue branch to the theoretical Younger Dryas impact event
and medallions now showing plate crops (not black circles, confirming the already-present
`artFor()` absolute-URL fix works). The "near-black" screenshot everyone kept re-taking
(`review/descent-desktop.png` at ~6 KB, called out in the last handoff) is a genuine but
separate Chromium bug: `chrome --headless=new --screenshot --virtual-time-budget=N` does not
reliably capture the page after a JS-driven `window.scrollTo`/hash jump on a page using
`position: sticky` — it silently returns a blank frame at the flat background colour,
deterministically, regardless of budget size. Confirmed with a from-scratch, 20-line
reproduction (plain HTML/CSS/JS, three `position: sticky` sections, one `window.scrollTo`
on `DOMContentLoaded`, no GSAP/Lenis/app code at all) that hits the exact same failure. No
changes were needed to `descent.css`/`descent.js` for this; `js/redesign/descent.js` keeps
the one-line `artFor()` fix that was already staged. Final screenshots
(`review/descent-desktop.png`, `review/descent-narrow.png`) were captured via CDP instead,
at `#prehistoric` so the frame-2 comparison is apples-to-apples (same era, same events).
Left open: this CDP-vs-CLI gap means any future screenshot-based review of a hash-scrolled
page on this site needs the CDP route (or a real, non-headless browser) — the CLI flag alone
will falsely read as broken.

**Bug 2, The Vault — real bug found and fixed: `mix-blend-mode: lighten` blending against
the wrong backdrop.** `.niche__display--float` (hand axe, Venus figurine) and
`.niche__display--painted` (future painted niche renders) blend their photo with
`mix-blend-mode: lighten`, which only reads correctly against a black backdrop — the
comment above it even says "photographed on black, the black drops away." But neither rule
gave the image its own backdrop, so it was blending against whatever happened to be painted
behind it in the shared stacking context: the recess's warm torch-lit rock texture and glow
gradients. Against that busy, non-black backdrop, "lighten" picks the brighter of source and
backdrop per pixel, so the object's own shadows and midtones got overwritten by the ambient
light, leaving a pale, desaturated, tinted ghost — exactly the "very dim" hand axe and Venus
reported. Fixed by giving `.niche__display--float`/`--painted` `isolation: isolate` plus a
soft radial near-black pool (`::before`) sized to the object, so the blend computes against
near-black the way it was designed to, while the soft edge keeps the "floating in a light
beam" look from frame 3 (no hard box edge). Both niches now render clean, correctly-toned
photos matching their source images.

Separately (not the wash-out bug, but the same screenshot mis-timing pattern as Bug 1): the
niches' entrance ("torches catch one after another," `.vault-stage.is-lit`) staggers by
`var(--i) * 170ms` with an 1100ms fade from a `brightness(0.2)` floor — worst case (the 5th
niche) took ~2 seconds to fully settle, and a screenshot taken mid-transition genuinely shows
later niches as black or dim, which is what "only the handbag niche lights properly" in the
last handoff was looking at (confirmed by re-capturing at 900ms — swords black, axe/Venus
dim or blurry, exactly as reported — then again with more wait — fully lit, matching frame
3). It wasn't stuck; it just took too long and started too dark. Tightened so a real visitor
doesn't get an almost-2-second window that reads as broken: stagger cut to 90ms, fade
duration cut from 1100ms/1100ms to 650ms, and the pre-lit floor raised from
`brightness(0.2)` to `brightness(0.4)` so an unlit niche mid-entrance reads as "dim candlelight,"
not a black block. Worst case now settles in ~1.1s. `prefers-reduced-motion` already skips
the transition entirely (instant final state), untouched.

Also fixed per the task brief: `display()` in `vault.js` probed
`images/redesign/vault/<artifactKey>.webp` for all 5 artifacts on every load, and since none
of those renders exist yet (only `background.webp` does), that was 5 guaranteed 404s in the
console on every visit. Added a `PAINTED_NICHES` manifest (currently empty) that gates the
probe — a key only gets probed once its file actually exists and is listed there. Vault page
now loads with zero console errors/warnings and zero failed network requests (checked via
CDP `Network` domain, not just eyeballing devtools).

**Files touched:** `css/redesign/vault.css`, `js/redesign/vault.js` (Bug 2 + kept the
pre-staged one-line fix in `js/redesign/descent.js`). `docs/redesign/review/*.png` overwritten
with CDP-captured screenshots (desktop 1672×941, narrow 868×1379) for both pages.

**Still off vs. the frames:** the Descent's narrow/mobile layout has the "Did you know?"
panel and gauge labels overlapping a bit untidily (pre-existing, out of this pass's two named
bugs). The Vault's bronze-age-swords and hand-axe/Venus niches are correct now but still read
slightly less punchy than frame 3's saturated gold-lit version — a genuine art/grade pass
(not a bug) once `images/redesign/vault/*.webp` painted niche renders exist would close that
gap further. Event art for events 2–63 and most of `earlyNeolithic`/`earlyUrban` still 404s
to its plate-crop fallback on the Descent (expected, tracked in the handoff, not touched here
— out of scope for Bug 1).
