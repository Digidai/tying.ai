#!/bin/bash
set -e
for f in wiki/*.html; do
  # ensure canonical has .html
  if ! grep -qE 'rel="canonical" href="https://tying.ai/wiki/[^"?]*\.html"' "$f"; then
    sed -i '/rel="canonical"/s|">|.html">|' "$f"
  fi
  # ensure og:url has .html
  if ! grep -qE 'property="og:url" content="https://tying.ai/wiki/[^"?]*\.html"' "$f"; then
    sed -i '/property="og:url"/s|">|.html">|' "$f"
  fi
  # add author meta if missing
  if ! grep -q 'meta name="author"' "$f"; then
    sed -i '/meta name="robots"/a\  <meta name="author" content="Tying.ai">' "$f"
  fi
  # add default og:image if missing
  if ! grep -q 'og:image' "$f"; then
    sed -i '/og:url/a\  <meta property="og:image" content="https://tying.ai/og-image.jpg">' "$f"
  fi
  # add twitter tags if missing
  if ! grep -q 'twitter:card' "$f"; then
    title=$(grep -m1 'property="og:title"' "$f" | sed 's/.*content="\([^"]*\)".*/\1/')
    desc=$(grep -m1 'property="og:description"' "$f" | sed 's/.*content="\([^"]*\)".*/\1/')
    sed -i "/og:image/a\  <meta name=\"twitter:card\" content=\"summary_large_image\">\n  <meta name=\"twitter:title\" content=\"$title\">\n  <meta name=\"twitter:description\" content=\"$desc\">\n  <meta name=\"twitter:image\" content=\"https://tying.ai/og-image.jpg\">" "$f"
  fi
done
