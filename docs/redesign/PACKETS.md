# Build Packets

One packet per run. Each ends with `node tools/verify-content.mjs` passing, one commit on branch `redesign`,
and a short entry in `docs/redesign/NOTES.md`. Nothing is pushed or published by a packet.

| # | Packet | Status |
|---|---|---|
| 00 | Content freeze: `data/*.json`, extractor, verifier | ✅ done 2026-09-27 |
| 01 | Foundation: shared shell, tokens, type, header/nav, ornament kit, page skeletons | ⬜ |
| 02 | Art: 8 era strata plates | ⬜ |
| 03 | The Descent: strata, parallax, depth gauge, threads, markers, era headers, Did You Know | ⬜ |
| 04 | Event panel (Descent) + prev/next + keyboard | ⬜ |
| 05 | Art: 63 event images, one era at a time | ⬜ |
| 06 | The Dial: layers, rotation, orbit, side panel, scrubber, Enter-this-era transition | ⬜ |
| 07 | The Artifact Vault | ⬜ |
| 08 | Search across events and artifacts | ⬜ |
| 09 | Mobile pass (frame 4) | ⬜ |
| 10 | Polish: reduced motion, focus, performance, side-by-side review against all frames | ⬜ |

## 01 Foundation
Scope: `css/redesign/tokens.css`, `base.css`, `ornament.css`; `js/redesign/data.js` (fetch + helpers incl.
years-ago); new `index.html` (Dial skeleton), `timeline.html` (Descent skeleton), `artifacts.html` (Vault skeleton),
all sharing the header. Old CSS/JS stay in the repo but are no longer referenced.
Accept: all three pages load with no console errors via a local server; header matches frames 1–3 (wordmark, nav,
search field); tokens match the bible; verifier passes.

## 02 Art: strata plates
Scope: 8 plates in `images/redesign/strata/`, one per era, generated with `frame2-descent.png` as reference.
Accept: a contact sheet `docs/redesign/review/strata.jpg`; each plate depicts its era's real content; top/bottom
edges are rock so plates stack; WebP within budget.

## 03 The Descent
Scope: `timeline.html` full build per the bible, using the plates. No event panel yet (markers log to console).
Accept: all 63 events render as markers in reversed era order; gauge values correct (spot-check: Younger Dryas
Impact ≈ 12,900 years ago, Göbekli Tepe ≈ 11,600); blue branch at the theoretical event; `#<era id>` deep links
scroll to the era; screenshot side-by-side with frame 2 in `docs/redesign/review/`.

## 04 Event panel
Accept: every marker opens a panel; the 31 with details show all their sections, the 32 without show only their
own fields; prev/next and Escape work; focus is trapped and restored.

## 05 Art: event images
Scope: 63 images in `images/redesign/events/<era>/`, one per event, named by slug of its title.
Accept: contact sheet per era; each image matches its real event.

## 06 The Dial
Accept: ring rotates 45° per era with wheel, drag, keys, rail and scrubber; orbit shows ≤ 6 events incl. the
theoretical one; Enter this era lands on the right stratum with a View Transition; side-by-side with frame 1.

## 07 The Artifact Vault
Accept: 5 artifacts in niches, filters work, gallery shows every image each artifact has; side-by-side with frame 3.

## 08 Search
Accept: searching a title, year, place or artifact finds it and jumps to it.

## 09 Mobile
Accept: 390px-wide screenshots of Dial and Descent next to frame 4; no horizontal scroll.

## 10 Polish
Accept: reduced motion honoured, visible focus everywhere, Lighthouse performance ≥ 80 on the Descent, final
side-by-side of all four frames reviewed with Daryll before anything is published.
