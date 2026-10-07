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

## 06 The Dial (Sonnet build)

Built for real this time: `index.html` main rebuilt on the Codex head/header skeleton, `css/redesign/dial.css`,
`js/redesign/dial.js`. GSAP 3.13.0 added from jsDelivr for the ring tween only (no ScrollTrigger/Lenis needed —
this is a single-viewport page, not a scroller). All words come from `data/timeline.json`, `data/did-you-know.json`,
`data/artifacts.json` via `loadAncientsData()`; `node tools/verify-content.mjs` passes.

**What works, verified by driving headless Chrome over CDP (own temp profile, port 9333, `Page.captureScreenshot`
after a real navigate + wait — the one-shot CLI flag was not used, per the known blank-frame issue logged in the
Descent fix pass):**
- Real painted art: `images/redesign/dial/sky.webp` full-bleed behind a transparent header (page-scoped override,
  shared header markup untouched), `images/redesign/dial/ring.webp` as the rotating zodiac ring (`scaleY(0.8)`
  tilt), a circular window cross-fading each era's `images/redesign/strata/<id>.webp` plate (eyeballed per-era
  `background-position-x` so the window shows real subject matter, not empty rock — numbers reused from the prior
  agent's research in the last handoff).
- Ring really rotates: 45°/era via GSAP (`elastic.out`) on wheel, drag-on-ring, arrow keys, era-rail clicks and
  scrubber arrows, all funnelled through one `goToEra()`. `prefers-reduced-motion` short-circuits every tween to an
  instant `style.transform`/`style.opacity` set (checked: identical final frame, no motion).
- Orbit: up to 6 medallions picked evenly across the era's real event order (`Math.round((n-1)*i/(k-1))`), always
  keeping the one theoretical event (only `prehistoric` has one — index 9, confirmed it lands in the picked set
  from the formula alone, no special-casing needed). A gold SVG polyline threads every picked point; the segments
  either side of the theoretical point are duplicated in blue on top, matching "gold everywhere, blue only at the
  theoretical join." Medallion art probes `images/redesign/events/<periodId>/<NN>-<slug>.webp` (same slug/NN rule
  as `descent.js`) and falls back to a cropped, per-item-offset plate crop — never a broken image. Clicking a
  medallion (or the default, the last/rightmost orbit item) focuses the right-hand event panel.
- Event panel: image, date, title, Mainstream/Theoretical tag, description, `details.details` when present,
  "Enter this era" → `timeline.html#<periodId>`, using `document.startViewTransition` when available (confirmed:
  navigating from the Dial lands cleanly on the Descent at that era, console clean) and a plain navigation
  fallback otherwise. The panel is a flex column with its own scrolling region so the CTA button never gets
  pushed off the bottom on short/cramped viewports — it stays pinned, description scrolls above it.
- Did You Know (bottom-left): hidden via `[hidden]` when the era's `didYouKnow` key is null (verified for
  `earlyNeolithic`/`earlyUrban`, the two with none), otherwise a random fact with a refresh control (same
  interaction as the Descent's, not a dead "Learn More" link — the frame's wording is filler per the bible).
  Artifacts teaser (bottom-right): three real artifact photos from `data/artifacts.json` (data order, not
  cherry-picked) over "ARTIFACTS — EXPLORE REMARKABLE OBJECTS FROM OUR PAST →", linking to `artifacts.html`.
- Scrubber: era name + date range, prev/next arrows, "TURN THE DIAL TO CHOOSE AN ERA" — all wired to the same
  `goToEra()` as every other control, so they can never go out of sync with the ring or rail.
- Mobile (≤760px, checked at 390×844 against frame 4's left phone): the stage becomes a normal scrolling column —
  ring fills the width, left rail and the bottom-left/right panels hide, a horizontal swipe strip of era cards
  (plate-crop thumbnails + name/range, with its own prev/next arrows) replaces the rail, and the event panel sits
  below the ring. No horizontal scroll (`document.documentElement.scrollWidth === clientWidth`, checked via CDP).
- No console errors or exceptions at any tested size (1672×941, 1440×900, 1200×800, 1070×1741 — the owner's real
  window — and 390×844). The only network 404s are the deliberate `Image()` probes for event art that hasn't been
  painted yet (e.g. `prehistoric/08-global-climate.webp`), same accepted pattern as `descent.js`/`vault.js`.

**Fixed during the build, not just left as "unverified":** the event/rail/fact panels first used independent
`top`/`bottom`/`max-height` guesses and visibly overlapped at 1200×800 (confirmed via `getBoundingClientRect`, not
just eyeballing). Replaced with two shared bands on `.dial-stage` (`--top-band`, `--bottom-band`, both
`clamp()`s off viewport height) that every floating panel reads from, so the rail/event panel can never collide
with the fact/teaser panels regardless of viewport height. Separately, giving the event panel a `bottom` anchor
to stop that overlap first caused the opposite bug on the very tall 1070×1741 window — the panel stretched to
fill the whole band, leaving a huge empty gold-framed box with the button stranded at the bottom. Fixed by
capping with `max-height` instead of stretching with `bottom`, so the panel is always sized to its own content
and only ever capped, never force-stretched.

**Honest gaps vs. frame 1:**
- The frame's event medallions are plain painted illustrations; ours are real event photography (packet 05 art)
  or a plate-crop fallback where that art doesn't exist yet (`prehistoric` events 8 and 10, `earlyNeolithic` event
  6, and most of the other eras — expected per AGENTS.md rule 7, coding agents don't generate images).
- The frame's six-event example ("Out of Africa," "Göbekli Tepe," etc.) is mockup filler; the real
  `prehistoric` data's evenly-spaced picks land on "Cultural Revolution" and "Global Climate" (which appears
  three times at different years in the real data — content frozen, not a bug) instead. This is correct per the
  bible ("layout from the frame, words from the data"), but it does mean the composition doesn't literally
  reproduce the frame's six captions.
- The orbit's ellipse radius/tilt (`R=460`, `TILT=0.64` in `dial.js`) and the per-era plate `background-position-x`
  table in `PLATE_FOCUS` were tuned by eye against screenshots, not measured pixel-for-pixel against the frame —
  close, not exact.
- Not done: packet 08 (search) — the header search field is still inert on every page, out of this packet's scope.
  Dial → Descent View Transition visuals (the window "expanding to fill the screen") were not inspected frame-by-
  frame; only the end state (landing on the right stratum, console clean) was confirmed.
- `vault.css` showed as modified in `git status` from a concurrent agent's session while this packet ran; left
  untouched and unstaged, per the brief.

## Fix pass 2 (Sonnet)

Second fix pass, two named bugs (`artifacts.html`/`vault.css` and `timeline.html`/`descent.css`/`descent.js`).
Verified throughout by driving headless Chrome directly over CDP (own temp profile, `Page.captureScreenshot`
after a real navigate + explicit wait, never the one-shot `--screenshot` CLI flag) at all five required widths:
1070×1741 (the owner's real window), 1280×800, 1440×900, 1672×941 (the frame's own resolution) and 390×844.

**Bug A, the Vault — real bug found and fixed: the side panel is open by default (the first artifact
auto-selects on load, `select(entries[0][0], false)` in `vault.js`), which above the 1050px bottom-sheet
breakpoint always reserves its grid column (`grid-template-columns: minmax(0, 1fr) clamp(330px, 25.6vw,
430px)`). `.vault-hall` then stretched the facade (`.vault-facade`) to fill 100% of that row's height via the
default flex `align-items: stretch`, with no cap tying that height back to the facade's own (panel-narrowed)
width. On a normal-ish window this coincidentally looks fine, because the available height happens to be in
the same ballpark as what the width-capped facade "wants" — but on the owner's actual 1070×1741 window the
facade stretched to 671px tall at only 121px wide per niche column, and `getBoundingClientRect()` on the niche
photos measured exactly the slivers from the bug report (16×196, 94×377, down to a 5×12 vitrine crop once the
object-fit math compounded). Confirmed the same root cause at 1070×800 too (narrower alone is enough; a tall
window just makes it worse) and that 1280×800/1440×900/1672×941 "accidentally" avoided it only because their
height happens to roughly match what the capped width implies.

Fixed by deriving the facade's height from its own width instead of the row's full height: added
`align-items: center` to `.vault-hall` and `height: auto; max-height: 100%; aspect-ratio: 1020 / 653` to
`.vault-facade` (that ratio is exactly the facade's own measured box at the frame's native 1672×941 — so the
facade now always renders at the same proportions it already looked right at, regardless of window height),
scoped to `@media (min-width: 1051px)` only — the ≤1050px bottom-sheet layout and the ≤760px stacked-mobile
layout were never part of this bug and are untouched, confirmed unaffected by direct screenshot. Re-measured
after the fix: 1070×1741 niches are now 121×132 (was 121×671); 1280×800 184×194; 1440×900 220×228; 1672×941
unchanged at 271×276 (same numbers before and after, as expected — the fix is a no-op at the width/height ratio
it was tuned from). Every niche now reads as a sensible arch at every tested width, every artifact photo is
clearly visible (axe, Venus figurine, cartouche, handbag triptych, swords vitrine all legible), and the extra
vertical room on the 1070×1741 window is simply more cave wall/floor above and below the facade — in keeping
with the scene, not a stretch artifact.

Also re-confirmed the niche "torches catch one after another" entrance (tuned in the last pass to ~1.1s worst
case) completes cleanly within a normal wait at every width, and ran the gallery for all 5 artifacts through
every image (via `naturalWidth`/`complete` checks, not just eyeballing) — no missing or black thumbnails at any
width; the "flat black/brown" read on the bronze-age-swords niche in the original report was the same squeeze
(a 5×12px crop of a close-up photo reads as a blob at that size) and is fixed by the above, not a separate
image bug — the source photo (`Latenium-epees-bronze.webp`) is itself a macro shot of two sword hilts, not the
frame's illustrated three-swords-in-a-row; that's a content/art-direction gap, not a layout bug, and content is
frozen.

**Bug B, the Descent — two issues, one real and fixed, one investigated and not reproduced.**

*Dark opening on tall windows — real cause found, fixed.* `.stratum__far img`/`.stratum__near img` use
`object-fit: cover` with a fixed `object-position: 50% 42%`. On a box far taller (relative to its width) than
the 1672×941 plates, `cover` always picks the height-driven scale (the larger of the two), which lands exactly
on the box height with **zero vertical crop** — so plain CSS alone already shows the plate's full vertical
range (sky to lit world) with only heavy, centred horizontal cropping, and `object-position`'s vertical value
has no slack left to act on. The actual culprit is `buildParallax()` in `descent.js`: it tweens each stratum's
far/near layers by a fixed `yPercent`/`scale` (±3.5% / 1.06–1.13) as you scroll through that era. That
percentage is of the layer's own (already very tall, cover-stretched) box, so on a normal-ish window it's a
small, subtle pan — but on the owner's 1070×1741 window the same percentage is a much larger pixel swing,
easily carrying the lit lower band mostly out of frame at the start of a long stratum before any scrolling
"catches up." Confirmed via CDP screenshot at scroll 0: the Modern-era opening did show mostly dark sky with
the city only becoming prominent part-way down, consistent with the report, though less total blackout than
described — likely the pipeline since added more finished plates/events than existed when the bug was filed.

Fixed by adding real vertical crop on tall/narrow desktop windows before any scroll-driven parallax runs:
`@media (min-width: 761px) and (max-aspect-ratio: 3/4)` applies `transform: scale(1.32); transform-origin: 50%
64%;` directly to `.stratum__far img`/`.stratum__near img` (the images, not the GSAP-tweened wrapper divs, so
there's no fight with the scroll animation). This zooms in just enough to create real vertical slack, biased
low via `transform-origin`, so the lit band is already on screen at rest. Scoped narrowly: `min-width: 761px`
keeps mobile (which has its own tuned `object-position: 46% 44%` at ≤760px) untouched, and `max-aspect-ratio:
3/4` means normal/wide windows (1280×800, 1440×900, 1672×941 — none of which are anywhere near that ratio) are
completely unaffected, confirmed by screenshot (1672×941 is pixel-for-pixel the same composition before and
after). Verified the fix at 1070×1741 across several eras (Modern at scroll 0, Prehistoric via `#prehistoric`,
Classical via `#classical`) — every opening view now shows its lit world clearly, and the Prehistoric view is
a close match to frame 2 (mammoths, the walking band, the blue theoretical branch, the snow peak).

*Label/gauge collisions and dark medallions — investigated, not reproduced in this build; one defensive fix
added anyway.* Swept both 1070×1741 and 390×844 with a scripted full-page scroll (24 steps bottom to top) doing
real `getBoundingClientRect()` overlap checks between every visible marker label, the gauge window, the Did You
Know panel and the era plaque at each step: zero overlaps found at either width. The depth-gauge numbers do sit
low-contrast against some bright plate passages (e.g. the icy Prehistoric sky), which could read as "garbled"
at a glance without being an actual DOM overlap — flagging as a legibility note, not fixing blind. Separately,
scrolled the whole page slowly (40 steps, matching how a real visitor scrolls, not a jump) and confirmed every
one of the 33 event images that currently exist on disk (prehistoric, earlyNeolithic, earlyUrban — the
pipeline has added many since the last pass) successfully attaches via the lazy `IntersectionObserver` probe,
with no dark/stuck medallions; same result jumping straight to an era via `#hash` with no manual scroll at all.
Could not force a repro of "existing images rendering dark." Still hardened the one plausible real-browser gap
the report's own wording pointed at — "the lazy probe never firing for markers already in view" — by also
calling `item.medalArt?._attach?.()` the moment a marker's `is-lit` state flips on in the main scroll-driven
`frame()` loop in `descent.js` (previously only the `IntersectionObserver` callback and the `#event-key` deep-
link handler called `_attach()`). `_attach()` is idempotent (it no-ops once an `<img>` is already present), so
this costs nothing once an image has loaded and guarantees every lit marker's real art gets requested
independent of whether IO caught its transition into the 1200px root margin. The `.marker:not(.is-lit)
.marker__medal { filter: saturate(0.35) brightness(0.5) }` dimming of not-yet-reached markers is deliberate,
pre-existing design (frame 2's "thread hasn't reached it yet" read) and was not touched.

**Files touched:** `css/redesign/vault.css` (Bug A), `css/redesign/descent.css` + `js/redesign/descent.js`
(Bug B). `docs/redesign/review/vault-1070.png`, `vault-1440.png`, `descent-1070-top.png`,
`descent-1070-prehistoric.png`, `descent-390.png` added. `node tools/verify-content.mjs` passes.

**Still open:** the Descent's "dark opening" fix reduces the pixel-level parallax swing but was tuned by eye
(`scale(1.32)`/`transform-origin: 50% 64%`) against a handful of eras, not measured per-plate — a few eras may
want slightly different numbers once more plates/events exist. The gauge-text-vs-bright-plate legibility note
above is unaddressed. The bronze-age-swords vitrine crop reading as an abstract close-up rather than "three
swords" is a content/art gap (the real photo vs. the frame's illustration), not something this pass touched.

## Vault fix pass 3 (Sonnet)

**What was wrong:** at 1070x1741 the side panel reserved a column and the facade's height followed the row, so the 3+2 wall
shrank to a ~570x365 strip with 16-33px objects; the painted background's own arches sat right behind it as a second set.

**What changed** (`css/redesign/vault.css`, `js/redesign/vault.js`, `artifacts.html` untouched):
- The five new renders (`images/redesign/vault/<artifact-id>.webp`) are the niche objects. `NICHE_RENDERS` in vault.js maps
  artifact id to file (ids equal file names); a render that fails to load falls back to the old photo presentation. The black
  ground is removed with `mix-blend-mode: screen` on the `<img>`. Nothing between the recess and the img may create a
  stacking context (that is why entrance dimming, hover lift and filtered-out dimming are applied to the img, not to
  `.niche__display`). The recess backdrop was darkened and the halo/cone lights softened so the object keeps its contrast.
  The real photos are untouched in the detail gallery.
- Three layouts. (1) Landscape wider than 1300px: wall left, panel right, as in frame 3. (2) At or below 1300px wide, or
  portrait: no panel column; the panel is a bottom sheet (opens on click, never auto-opens, close button / scrim / Esc close;
  `sheetQuery` in vault.js matches the CSS breakpoint). (3) "Tall" layout (portrait, or window shorter than 600px, above
  760px wide): full-width wall, niche arches are aspect 0.78 so the wall uses the height. Phones (<=760px) keep the stacked
  layout. In the fit layouts the facade width comes from the window height (`clamp(880px, (100svh - 262px) * 1.56, 1060px)`).
- One vault, not two: the painted background is dimmed above the floor line (`.vault-scene__painted::after`, much darker in the
  tall layout where the wall fills the width) and the facade carries a feathered backdrop-blur halo (`.vault-facade::before`),
  so the painted niches are never legible behind the coded wall. Floor, braziers and cave edges stay clear.
- Frame-3 touches: plaque overlaps the arch foot, arches are true arches (percentage radii), darker carved stone, reliefs in the
  lower row's end bays (`bay()` in vault.js), thinner pillars in the tall layout.
- Stage `overflow: clip` (the halo was stretching the page 32px past the viewport at 1280x800).
- Phone sheet capped to sit under the tall phone header (the search field was poking through it).
- Stash `vault-pass3-partial` was read, not used, not dropped (its aspect-ratio idea is superseded by the layout split above).

**Measured** (getBoundingClientRect of the niche `<img>`, a square; the object itself is 0.92-0.95 of that height, 0.40-0.65 of
its width; screenshots taken after the 4.5s entrance):

| window | img box | object height | facade |
|---|---|---|---|
| 1070x1741 | 282-313 | ~259-291 | 1036x931, x 17-1053 (97% of width) |
| 1280x800 | 164-167 | ~151-159 | 880x563 |
| 1440x900 | 195-198 | ~180-188 | 995x637 |
| 1672x941 | 208-215 | ~191-204 | 1059x678 |
| 390x844 | 234 | ~215-222 | 358x1775 stacked |

Tested at 1070x1741: click opens the sheet with the right artifact (Bronze Age Swords / Paleolithic Hand Axe), close button and Esc
close it, ArrowRight moves the gallery, "Mysterious" leaves only the handbags lit. Same checks pass at 1672x941 (panel column).
Console: zero errors at every size. `node tools/verify-content.mjs` passes. Screenshots: `docs/redesign/review/vault-pass3-<w>.png`.

**Honest gap against frame 3:** the objects now match the frame, but the surround is plainer. The frame's wall is carved
megalithic stone with statues, hieroglyph pillars and a lit staircase; ours is code-drawn brown stone with glyph pillars, and the
painted stairs/braziers are mostly dimmed away behind the wall. At 1280x800 the height budget (header 126px) limits objects to
~155px. On the tall layout there is an empty dark band above the wall.

**Unverified:** Safari/Firefox (`backdrop-filter` with a composite mask, `overflow: clip`, `mix-blend-mode` on the img);
real touch on the sheet; `prefers-reduced-motion` run; widths between 761 and 1000px were not screenshotted.

## Vault pass 4 (Sonnet): painted wall

**What changed** (`artifacts.html`, `css/redesign/vault.css` rewritten, `js/redesign/vault.js`):
- The painted wall IS the background. `wall-wide.webp` (1672x941) for landscape, `wall-tall.webp` (1024x1536) for portrait and phones'
  backdrop. The old code-drawn wall (facade, pillars, glyph sprite, stairs, floor, braziers, flames, blur halo, `background.webp`
  dimming) is gone from HTML, CSS and JS.
- One geometry. `layout()` in vault.js scales the wall like `object-fit: cover`, then publishes `--wx/--wy/--ww/--wh` (box in px) and
  `--u` (screen px per image px) on `<html>`. The wall `<img>`, the niche layer (`.vault-wallbox`) and the embers all use that box;
  each niche is positioned in % of the wall image (`WALLS.*.slots`, taken from the coordinator's numbers and checked by overlay on
  both PNGs: they fit), so the objects cannot drift from the art. Plaques are sized in `--u`. Resize and breakpoint changes re-run it.
- Anchoring: with the side panel (landscape > 1300px) the wall is pushed left just enough to clear the panel; with the sheet it is
  centred (wide wall zoomed up to 25% over cover if needed, so 1280x800 still centres it); vertically it sits between the header and
  the bottom, never under the filter strip. Wall choice is by window shape (aspect < 1.1 = tall, else wide), not width alone: tall at
  1280x800 would crop away the bottom row.
- Frame 3 order: Hand Axe / Venus / Swords, then Cartouche / Handbags. Each niche is a focusable button over its painted niche; hover
  and focus brighten the light and draw a gold hairline (blue for handbags), selection keeps the hairline. Filters dim non-matching
  niches (veil + darkened object). Handbags niche: the amber interior is tinted blue (`mix-blend-mode: color`) plus blue glow.
- Cut-outs, not blend modes: screen-blending the black renders onto the bright amber niche washed them out to ghosts. `cutout()`
  keys each render once at load (flood-fill of black connected to the image border becomes soft transparent, colour un-matted; black
  enclosed by the object stays opaque) and uses the result as the niche image. Falls back to a screen blend if canvas keying fails.
  Source files are untouched.
- Objects are 81-84% of niche height, centred horizontally, base on the plinth.
- Phones (<=760px): the stacked layout stays; the tall wall is a dimmed backdrop and the niches are lit arch cards.
- Kept: filters, panel above 1300px / bottom sheet below, gallery, arrows, Esc, header, nav. The sheet and panel logic is untouched.

**Measured** (niche rect vs object, getBoundingClientRect; object bbox from the render's non-black pixels). Horizontal offset of every
object from its niche centre is 0px at every size. Vertical: the object stands on the plinth, so its centre sits below the niche
centre (dyCenter) while its foot is on the plinth line (footGap = foot minus niche bottom, -3..+2px).

| window | mode | niche size (top / bottom row) | object height | dx | dyCenter | footGap |
|---|---|---|---|---|---|---|
| 1070x1741 | tall | 171-183x270 / 215-218x280 | 218-229 px | 0 | 24-25 | -2..+2 |
| 1280x800 | wide (zoom 1.13) | 152-172x184 / 189-192x159 | 129-154 px | 0 | 13-17 | -1..+1 |
| 1440x900 | wide | 152-171x184 / 189-192x158 | 128-154 px | 0 | 13-17 | -1..+1 |
| 1672x941 | wide | 159-179x192 / 197-201x166 | 134-161 px | 0 | 14-18 | -1..+1 |
| 390x844 | stacked cards | 346x300 | 241-249 px | 0 | 25-27 | -3..+1 |

Console: zero errors at all five sizes. `node tools/verify-content.mjs` passes. Click opens the sheet with the right artifact, close
button and Esc close it, ArrowRight moves the gallery, "Mysterious" leaves only the handbags lit (1070x1741, 1280x800; panel column
at 1672x941). Screenshots: `docs/redesign/review/vault-pass4-<w>.png`, side by side with frame 3:
`vault-pass4-vs-frame3-1672.png`, `vault-pass4-vs-frame3-1070.png`.

**Honest comparison with frame 3:** the wall, staircase, braziers, hieroglyph pillars, lit niches and star floor now match the frame
in richness (they are the same painting language). Remaining differences: the frame's objects are ~10-15% larger and more strongly
lit, its handbags niche shows three slabs with a stronger blue wash, and its plaques glow more. At 1280x800 the objects are ~150px
because the header takes 126px of height.

**Unverified:** Safari/Firefox (`mix-blend-mode: color`, `overflow: clip`, canvas keying); real touch; reduced motion; widths 761-1000px
and ultra-wide (>2000px) were not screenshotted; `images/redesign/vault/background.webp` is now unused (left in place).

## QA sweep (Sonnet): every popup, panel and overlay at five window sizes

Method: own headless Chrome over CDP (never the owner's browser), 2550x1220, 1672x941, 1280x800, 1070x1741, 390x844 (390 with
mobile emulation, so a page that is wider than the screen shows up), plus 1366x768, 1024x768, 820x1180 for the Descent and Vault and a
few narrow landscape sizes for the Dial. For each open panel: getBoundingClientRect on the panel and its scroll body, scrollWidth vs
clientWidth, text-line rectangles against buttons, image aspect vs natural, and `elementFromPoint` on every control (a real click must
land on the control; the JS-click tests of earlier passes could not see a covered button).

**Defects found and fixed** (CSS unless noted; every fix is commented in the file):
- **Vault, "Explore artifact" on the bottom sheet (1070x1741, 1280x800, 390x844 and everything narrower than 1300px or portrait):**
  the folio sat UNDER the scrim. `.vault-stage.is-folio .vault-panel { z-index: 30 }` out-ranked the sheet's z-index 60, scrim is 55.
  Result: the open record was dimmed and blurred, and every click on it (Return to the vault, gallery arrows, close) hit the scrim,
  which closed the whole sheet. Fixed with `z-index: 60` in the sheet media block.
- **Vault, folio on the bottom sheet (1280x800, 390x844):** the folio's `max-height: 94svh` pushed its top edge and close button
  under the header. Now `100svh - header - 8px`.
- **Vault, folio two-column (1672x941, 2550x1220):** a long title ("Mysterious Handbag Symbols") ran into the close button. Title gets
  `padding-right: 44px` in the folio.
- **Vault, side panel (>1300px landscape):** Escape did not close it (only the folio and the sheet). `vault.js` now closes it too.
- **Descent, phone (390, 360, 430):** the theoretical event's label ran to x=413 on a 390px screen, and the blurred label pads
  poked 15px past the edge. `body` is `overflow-x: hidden`, but a real phone widens its layout viewport to fit (innerWidth 439 on 390),
  so the page scrolled sideways and the event sheet was laid out 49px too wide with its close button off screen. Label width is now
  capped by where its own marker sits, and `.descent` clips x-overflow (`overflow-x: clip`, keeps the sticky strata).
- **Dial, 1280x800 / 1440x900 / 1672x941:** the era scrubber covered the titles of the bottom medallions (up to 30px). The ring
  diameter is now `--ring-d`, capped by `94vh - 245px` (ring 592 -> 517 at 1280x800, 696 -> 639 at 1672x941). Gap to the scrubber
  is now 6-19px at those sizes.
- **Dial, 1070x1741:** a long era name made the scrubber 518px wide, on top of both the Did You Know card and the Artifacts card.
  It is now capped to the gap between them (`--side-w`, `--side-x`) and its label wraps to two lines.
- **Dial, Did You Know card (1280x800 and 1070x1741):** the whole card scrolled with a hidden scrollbar, so a long fact pushed
  "Another fact" out of sight (up to 30px). Now only the fact scrolls (thin gold scrollbar); the title and the button stay.
- **Dial, 1070x1741:** a long event made the event panel grow over the ring's top-right bezel (up to 23px). Capped at the ring's top
  edge + 12% of its diameter on tall narrow windows; the panel's own scroll takes the rest.
- **Dial, landscape 761-1180px (1024x768):** the ring ran under the event panel and hid medallions in 5 of 8 eras. The ring is now
  centred in the gap between rail and panel and capped by it (`--rail-r`, `--panel-l`).

**Checked and clean (no change needed):** Descent event panel for ALL 63 events at 2550, 1672, 1280, 1070, 390 and also 1366x768,
1024x768, 820x1180 (Previous stepping through every event, `scrollWidth - clientWidth <= 1`, fully on screen, title not clipped, 16:9
art 1:1 with its natural ratio, no control covered); the theoretical event; events with and without `details`; deep links `#<era>`
and `#<era>-NN`, a bad `#bronzeAge-99`, hashchange, Escape, close button, real mouse click on a marker, ArrowRight in the nav;
Descent Did You Know in all 6 eras at the five sizes, with every fact (longest included) and the refresh button; Dial event panel
for the default and every medallion (6) in all 8 eras at the five sizes, CTA, teaser, rail, strip, scrubber, ring/window/orbit exact
circles (width == height) at every size; Vault: all 5 artifacts x every gallery image x open / Explore artifact / Return / Escape /
close at the five sizes plus 1366x768, 1024x768, 820x1180, all four filters. Console errors: none at any size.
`node tools/verify-content.mjs` passes. Before/after screenshots: `docs/redesign/review/qa-<page>-<state>-before|after-<w>.png`
(the big Dial ones are palette-quantized to keep the repo small).

**Not fixed, on purpose or not testable:**
- Dial, 761-1000px landscape and 820px portrait: the 230px side panels leave the event panel 188px of text and the ring still sits
  close to it; the proper answer is the stacked phone layout up to ~1000px, a redesign. Ring/medallion overlaps are fixed down to
  ~900px; at 900x700 two eras still touch the scrubber by 7-10px (the scrubber wraps to two lines there).
- Dial, phone: the right-hand medallion's art touches the screen edge (box 6px past it; the art itself is inside). Left alone to keep
  the ring at 92vw as in frame 4.
- Did You Know card on a short window can show a long fact cut at the bottom until you scroll it (by design of the fix above).
- Depth gauge node names are clipped at the gauge edge ("END OF WESTERN...") by the existing design; the gauge is decorative.
- The header search field has no results popup (no JS at all), so there was nothing to test; the Design Bible's "results jump to the
  Descent" is not built.
- The Descent panel measured 4-12px off the right edge (and 21px below on the phone) only in its first 2.5s after a deep-link load: that
  is the 320ms slide-in running late while the page loads, not a layout defect.
- Not tested: real touch (swipe on the gallery, pinch), `prefers-reduced-motion`, Safari/Firefox, widths above 2550, Dial era
  changes by wheel, drag, rail or scrubber-arrow clicks (eras were reached through the URL hash; medallions were clicked).
