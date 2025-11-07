#!/bin/bash

# Simple build script that mirrors the basic static deployment structure
# without running any minification steps. It is resilient to optional
# directories being absent so local builds never fail when folders like
# "assets" are missing.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"

printf "🚧 Running simple build...\n"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

copy_dir_if_exists() {
  local dir_name="$1"
  if [ -d "$ROOT_DIR/$dir_name" ]; then
    printf "  • Copying %s/\n" "$dir_name"
    cp -R "$ROOT_DIR/$dir_name" "$DIST_DIR/"
  else
    printf "  • Skipping %s/ (not found)\n" "$dir_name"
  fi
}

for dir in report position wiki components scripts assets js public; do
  copy_dir_if_exists "$dir"
done

printf "  • Copying top-level static assets\n"
shopt -s nullglob
pushd "$ROOT_DIR" > /dev/null
for pattern in *.html *.xml *.txt *.json *.ico *.css *.js *.svg *.webmanifest; do
  for file in $pattern; do
    cp "$file" "$DIST_DIR/"
  done
done
popd > /dev/null
shopt -u nullglob

printf "✅ Simple build complete. Output: %s\n" "$DIST_DIR"
