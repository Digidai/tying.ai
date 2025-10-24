#!/bin/bash

# Build script for tying.ai
# Minifies HTML, CSS, and JS files for production

set -e  # Exit on error

echo "🚀 Starting build process..."

# Clean dist directory
echo "🧹 Cleaning dist directory..."
rm -rf dist
mkdir -p dist

# Copy directory structure
echo "📁 Copying directory structure..."
cp -r report position wiki components scripts assets dist/ 2>/dev/null || true

# Copy static files (XML, TXT, JSON, etc.)
echo "📄 Copying static files..."
cp ./*.xml ./*.txt ./*.json ./*.ico browserconfig.xml dist/ 2>/dev/null || true

# Minify CSS files
echo "🎨 Minifying CSS files..."
npx cleancss -o dist/styles.css styles.css
npx cleancss -o dist/genedai.css genedai.css 2>/dev/null || true

# Minify JavaScript files
echo "⚡ Minifying JavaScript files..."
npx terser site.js -o dist/site.js --compress --mangle
npx terser sw.js -o dist/sw.js --compress --mangle 2>/dev/null || true
npx terser scripts/layout.js -o dist/scripts/layout.js --compress --mangle 2>/dev/null || true

# Minify HTML files (root level)
echo "📝 Minifying HTML files..."
for file in *.html; do
  if [ -f "$file" ]; then
    npx html-minifier \
      --collapse-whitespace \
      --remove-comments \
      --remove-optional-tags \
      --remove-redundant-attributes \
      --remove-script-type-attributes \
      --remove-tag-whitespace \
      --use-short-doctype \
      --minify-css true \
      --minify-js true \
      -o "dist/$file" "$file"
  fi
done

# Minify HTML files in subdirectories
for dir in dist/report dist/position dist/wiki dist/components; do
  if [ -d "$dir" ]; then
    find "$dir" -name "*.html" -type f | while read file; do
      npx html-minifier \
        --collapse-whitespace \
        --remove-comments \
        --minify-css true \
        --minify-js true \
        -o "$file" "$file" 2>/dev/null || true
    done
  fi
done

# Calculate size savings
echo ""
echo "✅ Build complete!"
echo ""
echo "📊 Build summary:"
du -sh dist | awk '{print "  Total size: " $1}'
echo "  Location: ./dist/"
echo ""
echo "💡 Run 'npm start' to serve the production build"
