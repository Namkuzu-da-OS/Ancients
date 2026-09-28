# AGENTS.md: rules for anyone building the Ancients redesign

**The old site supplies the content. The selected mockups supply the design.**

1. Read `docs/redesign/DESIGN-BIBLE.md` and `docs/redesign/PACKETS.md` first. The four frames in
   `docs/redesign/mockups/full-res/` are the specification. Ignore every other image in `mockups/`.
2. Do exactly one packet per run, the one you were asked for. End with one commit on branch `redesign`
   and an entry in `docs/redesign/NOTES.md` (what you did, what you left out, anything unverified).
3. **Content is frozen.** All words come from `data/*.json`. Never edit those files, never hard-code event text,
   never add, drop, reword or reorder events, facts or artifacts. Mockup wording is filler.
4. Run `node tools/verify-content.mjs` before committing. If it fails, fix your change, not the data.
5. Recreate the frame at high fidelity: composition, painted art, glow, ornament, motion. Never reduce it to a
   generic card layout with a colour theme. If a result looks plainer than the frame, it is not done.
6. Gold means mainstream, blue means theoretical (or a `mysterious` artifact). Nothing else is blue.
7. Art: pass the matching frame as the reference image on every generation call, with the bible's style preamble.
   Illustrate the real event, not the mockup's filler.
8. Static site, no build step, libraries from jsDelivr only. Serve locally with `python -m http.server 8000`.
9. Never push, publish, or touch `main`. Publishing is Daryll's call.
