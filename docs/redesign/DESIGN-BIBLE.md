# Ancients Redesign: Design Bible

**The four frames in `docs/redesign/mockups/full-res/` are the specification.** This document turns them into
rules. Where this text and a frame disagree, the frame wins, except on content (see below).

| Frame | Page | File |
|---|---|---|
| 1 | The Dial (landing) | `frame1-dial.png` |
| 2 | The Descent (timeline) | `frame2-descent.png` |
| 3 | The Artifact Vault | `frame3-artifacts.png` |
| 4 | Mobile: Dial + Descent | `frame4-mobile.png` |

The `concept-*.jpg` images and `frame*-*.jpg` screen grabs in `mockups/` are history. Do not pull ideas from them.

## Content is frozen

Daryll, 2026-09-27: *"Any event that already exists needs to still exist. We're not going to change any data
that's being presented."* All words come from `data/timeline.json`, `data/did-you-know.json` and
`data/artifacts.json`, which `tools/verify-content.mjs` proves identical to the original site. The mockups'
own wording (event blurbs, tags like "Key themes", "The world's first temple?") is filler: **layout from the
frame, words from the data.** Never add, remove, reword or reorder events, facts or artifacts.

Behaviour that is also content:
- 8 eras, 63 events, in the original order. Exactly one event is theoretical (Younger Dryas Impact).
- 31 events have popup details (`details`). The other 32 still open a popup, showing only their own four fields
  (year, shortDesc, title, description). No invented detail.
- Did You Know shows for the 6 eras whose `didYouKnow` key is set; Neolithic and Early Urban show none.
- Generic "coming in a future update" scaffolding from the old modal (map, sources, image gallery notices) is
  UI chrome, not content, and is dropped.

## The idea

You are standing in deep time. The **Dial** is the sky the ancients watched; turning it chooses an era. Entering
an era drops you into the **Descent**: the present at the surface, the past in the rock below, every era a
painted stratum lit by fire. Gold is the accepted story. Blue is the theory.

## Colour

| Token | Hex | Use |
|---|---|---|
| `--void` | `#070605` | page background, deepest rock shadow |
| `--rock` | `#1b140e` | panels, carved surfaces |
| `--rock-edge` | `#3a2a1b` | panel borders at rest, rock highlights |
| `--gold` | `#e6a656` | mainstream threads, markers, rules, active nav |
| `--gold-hot` | `#ffd58a` | glow cores, title highlights, focused state |
| `--parchment` | `#efe3cc` | body text on dark |
| `--ash` | `#b9a88e` | secondary text, labels |
| `--blue` | `#4696e2` | theoretical thread, marker, tag, panel frame |
| `--blue-hot` | `#9fd8ff` | blue glow core, theoretical title text |

Gold and blue are **meaning, not decoration**: blue appears only on theoretical events and on artifacts whose
category is `mysterious`. Everything else is gold on dark.

## Type

- **Display:** Cinzel (700 for the wordmark and panel titles, 400 for nav and labels). Roman inscriptional caps,
  wide tracking (0.08–0.14em) as in the frames. The wordmark "ANCIENT HISTORY" is gold with a warm inner glow
  and a small ornamental rule under it.
- **Body:** Cormorant Garamond 500, 18–19px on desktop, line-height 1.55, max 62ch. Never below 16px.
- Dates are set in Cinzel, gold (blue for theoretical), larger than the title beneath them.
- Contrast floor: body text is `--parchment` on panels of `--rock` at ≥ 92% opacity. No text sits directly on busy art.

## Ornament

Thin gold hairline frames (1px `--gold` at 70%) with small corner flourishes and diamond terminals, exactly as
the frames' panels. Circular medallions with a double gold ring for events on the Dial. Filter/tab bars are a
single framed strip with gold dividers. Buttons are framed pills with Cinzel caps. Theoretical items swap every
gold ornament for blue.

## Page 1: The Dial (frame 1, frame 4 left)

- Full-viewport scene. Background: night sky with Milky Way over ruined megalithic walls and torches.
- Centre: the precession wheel, carved stone ring with gold zodiac constellations and age names
  ("Pisces Age", "Aquarius Age"…), a gold star at 12 o'clock. **The ring is its own image layer and really rotates.**
- Inside the ring: a circular window showing the selected era's painted scene (the same plate as that era's Descent stratum).
- An orbit arc of up to 6 event medallions for the selected era, joined by a glowing thread (gold, blue segment
  where the theoretical event sits). Headline events = up to 6 taken evenly across that era's events, always
  including the theoretical one.
- Left: era rail (8 eras, gold dots on a vertical line, current era bright).
- Right: framed panel for the focused event: image, date, title, mainstream/theoretical tag, the event's
  description (and `details.details` when present), primary button **"Enter this era"**.
- Bottom-left Did You Know panel (hidden for eras without facts). Bottom-right Artifacts teaser linking to the vault.
- Bottom strip: timeline scrubber ("Turn the dial to choose an era") with arrows.
- Turning: wheel/trackpad scroll, drag on the ring, arrow keys, the rail, or the scrubber. Each era step rotates
  the ring 45° with inertia; stars drift slowly; torches flicker.
- "Enter this era" → `timeline.html#<era id>` with a View Transition: the window scene expands to fill the screen
  and becomes the stratum.

## Page 2: The Descent (frame 2, frame 4 right)

- One long vertical scroll. **Present at the top, oldest at the bottom.** Era order is the data order reversed
  (Modern first, Prehistoric last); events inside an era run newest to oldest going down.
- Each era is a full-bleed painted stratum (a cross-section: rock above and below, the era's world lit inside),
  separated by rough rock seams. Parallax: 3 depth layers per stratum (far scene, midground, rock frame).
- **Depth gauge** (left, fixed): "Years ago" with a vertical gold line and nodes. Values are computed from each
  event's year string relative to 2026 (e.g. c. 10,900 BCE → 12,900 years ago). The node for the event in view is
  lit; theoretical nodes are blue.
- **Threads:** a molten-gold thread runs down through every stratum connecting the event markers. At the
  theoretical event a blue thread branches off to it and rejoins the gold at the next event below. Threads draw
  themselves as you scroll (SVG stroke, scroll-scrubbed).
- **Event markers:** round gold medallions with an icon, date and title beside them; theoretical = blue.
- Clicking a marker opens the **event panel** at right (frame 2): image, date, title, tag, description, then the
  `details` sections (Details, Cultural context, Key figures, Locations, Related artifacts) as they exist.
  Previous/next moves through events. Escape closes.
- Era header on entering each stratum: Cinzel era title from the data (e.g. "Prehistoric Period (300,000 - 10,000 BCE)").
- Did You Know panel inside eras that have facts, with the refresh control (random fact, as before).

## Page 3: The Artifact Vault (frame 3)

- A torch-lit vault carved in the same rock. Artifacts sit in lit niches (gold light; blue light for `mysterious`).
- Filter strip: All · Mysterious · Tools & Weapons · Art & Symbols (existing categories).
- Detail panel at right: gallery with arrows and dots (all images the artifact has), title, category tag, era,
  then Overview, Context, Significance, Mysteries from the data. Keyboard arrows move the gallery.

## Shared

- Header on every page: wordmark centred, nav Home / Timeline / Artifacts with a gold underline on the current
  page, search field top-right (searches all 63 events and 5 artifacts; results jump to the Descent or the vault).
- Motion: one orchestrated entrance per page, scroll-scrubbed motion in the Descent, ambient only where the frame
  implies fire and sky (torch flicker, embers, star drift). `prefers-reduced-motion`: no ambient motion, no
  parallax, instant transitions.
- Mobile (frame 4): Dial ring fills the width, era picker is a horizontal swipe strip with era thumbnails; the
  Descent keeps a compact gauge on the left edge and both threads on one edge; panels become bottom sheets.

## Art

All art is painted in Daryll's ChatGPT window (the chat that made the frames, so it keeps the look), never by a coding agent. Style
preamble: *"Cinematic matte painting, deep night and firelight, carved megalithic stone, molten gold light,
electric blue only for the cosmic and theoretical, hyper-detailed, museum-grade, no text, no UI."*

| Asset | Count | Notes |
|---|---|---|
| Era strata plates | 8 | wide, tileable top/bottom rock edge; also used, circle-cropped, in the Dial window |
| Dial layers | 3 | sky + ruins background; the zodiac ring on transparency; torch/ember overlay |
| Event images | 63 | one per event, from its real title/description; used in markers, panels, Dial medallions |
| Vault background | 1 | empty niches |
| Artifact niche renders | 5 | each real artifact as a lit museum object; the real photos stay in the gallery |

Check every generated image against the real event it illustrates, not the mockup's filler. Images live in
`images/redesign/` as WebP (≤ 350 KB each, 2x for plates).

## Tech

Static site on GitHub Pages, no build step. GSAP + ScrollTrigger and Lenis from jsDelivr; a small WebGL/canvas
layer only for stars, embers and heat shimmer. View Transitions API for Dial → Descent (graceful fallback). Data
loads from `data/*.json` (serve locally with `python -m http.server`; `file://` will not work).
