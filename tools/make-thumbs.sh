#!/usr/bin/env bash
# Rebuild the small event pictures used by the timeline medals, dial bubbles and search results.
# Run after adding, renaming or moving an event image (file names follow era/NN-slug-of-title).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf images/redesign/events-thumb
for f in images/redesign/events/*/*.webp; do
  o="images/redesign/events-thumb/${f#images/redesign/events/}"
  mkdir -p "$(dirname "$o")"
  magick "$f" -resize 400x -quality 74 -define webp:method=6 "$o"
done
echo "thumbs: $(ls images/redesign/events-thumb/*/*.webp | wc -l)"

# Small era plates for the phone era strip.
mkdir -p images/redesign/strata-thumb
for f in images/redesign/strata/*.webp; do
  case "$f" in *-alt*) continue ;; esac
  magick "$f" -resize 480x -quality 72 -define webp:method=6 "images/redesign/strata-thumb/$(basename "$f")"
done
