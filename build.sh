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
cp -r report position wiki components scripts assets js dist/ 2>/dev/null || true

# Copy static files (XML, TXT, JSON, etc.)
echo "📄 Copying static files..."
cp ./*.xml ./*.txt ./*.json ./*.ico browserconfig.xml dist/ 2>/dev/null || true

# Minify CSS files with advanced optimizations
echo "🎨 Minifying CSS files..."
npx cleancss -o dist/layout.css layout.css --level 2 --format keepBreaks
npx cleancss -o dist/components.css components.css --level 2 --format keepBreaks
npx cleancss -o dist/utilities.css utilities.css --level 2 --format keepBreaks
npx cleancss -o dist/genedai.css genedai.css --level 2 --format keepBreaks 2>/dev/null || true

# Minify JavaScript files with advanced optimizations
echo "⚡ Minifying JavaScript files..."

# Minify module loader first (critical for lazy loading)
npx terser js/module-loader.js -o dist/js/module-loader.js --compress --mangle --toplevel --ecma 2020 --module

# Minify main application
npx terser js/main.js -o dist/js/main.js --compress --mangle --toplevel --ecma 2020 --module

# Minify core modules (always loaded)
for module in performance-optimizer animation-manager navigation-controller interaction-handler; do
  if [ -f "js/modules/$module.js" ]; then
    npx terser "js/modules/$module.js" -o "dist/js/modules/$module.js" --compress --mangle --toplevel --ecma 2020 --module
    echo "  ✓ Minified $module.js"
  fi
done

# Minify lazy modules (optimized for code splitting)
for module in analytics chatbot charts forms; do
  if [ -f "js/modules/$module.js" ]; then
    npx terser "js/modules/$module.js" -o "dist/js/modules/$module.js" \
      --compress --mangle --toplevel --ecma 2020 --module \
      --define module.exports=false
    echo "  ✓ Minified lazy module $module.js"
  fi
done

# Minify legacy JavaScript files
npx terser site.js -o dist/site.js --compress --mangle --toplevel --ecma 2018 2>/dev/null || true
npx terser sw.js -o dist/sw.js --compress --mangle --toplevel --ecma 2018 2>/dev/null || true
npx terser scripts/layout.js -o dist/scripts/layout.js --compress --mangle --toplevel --ecma 2018 2>/dev/null || true

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

# Create compressed versions for better performance
echo "📦 Creating compressed versions..."
if command -v gzip >/dev/null 2>&1; then
  find dist -name "*.js" -o -name "*.css" -o -name "*.html" | while read file; do
    gzip -c "$file" > "$file.gz"
  done
fi

# Create .htaccess for performance optimization
cat > dist/.htaccess << 'EOF'
# Performance optimizations
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive on
    # Core modules - cache longer (critical for performance)
    ExpiresByType application/javascript "access plus 1 year"
    <Files "js/module-loader.js">
        ExpiresActive on
        ExpiresByType application/javascript "access plus 1 year"
    </Files>
    <Files "js/main.js">
        ExpiresActive on
        ExpiresByType application/javascript "access plus 1 year"
    </Files>
    <FilesMatch "^js/modules/(performance-optimizer|animation-manager|navigation-controller|interaction-handler)\.js$">
        ExpiresActive on
        ExpiresByType application/javascript "access plus 1 year"
    </FilesMatch>

    # Lazy modules - cache shorter (may be updated frequently)
    <FilesMatch "^js/modules/(analytics|chatbot|charts|forms)\.js$">
        ExpiresActive on
        ExpiresByType application/javascript "access plus 1 week"
    </FilesMatch>

    # CSS files
    ExpiresByType text/css "access plus 1 year"

    # Images
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"

    # HTML files
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# HTTP/2 Server Push for critical modules
<IfModule mod_headers.c>
    <Files "index.html">
        Header add Link "</js/module-loader.js>; rel=preload; as=script"
        Header add Link "</js/main.js>; rel=preload; as=script"
        Header add Link "</layout.css>; rel=preload; as=style"
        Header add Link "</components.css>; rel=preload; as=style"
        Header add Link "</utilities.css>; rel=preload; as=style"
    </Files>
</IfModule>
EOF

# Calculate size savings
echo ""
echo "✅ Build complete!"
echo ""
echo "📊 Build summary:"
du -sh dist | awk '{print "  Total size: " $1}'
if [ -f "dist/layout.css.gz" ]; then
  echo "  Gzipped Layout CSS: $(du -h dist/layout.css.gz | cut -f1)"
fi
if [ -f "dist/components.css.gz" ]; then
  echo "  Gzipped Components CSS: $(du -h dist/components.css.gz | cut -f1)"
fi
if [ -f "dist/utilities.css.gz" ]; then
  echo "  Gzipped Utilities CSS: $(du -h dist/utilities.css.gz | cut -f1)"
fi
if [ -f "dist/site.js.gz" ]; then
  echo "  Gzipped JS: $(du -h dist/site.js.gz | cut -f1)"
fi
if [ -f "dist/js/module-loader.js.gz" ]; then
  echo "  Gzipped Module Loader: $(du -h dist/js/module-loader.js.gz | cut -f1)"
fi
if [ -f "dist/js/main.js.gz" ]; then
  echo "  Gzipped Main App: $(du -h dist/js/main.js.gz | cut -f1)"
fi

# Count lazy modules
lazy_modules_count=$(find dist/js/modules -name "*.js" 2>/dev/null | wc -l)
if [ "$lazy_modules_count" -gt 0 ]; then
  echo "  Lazy modules available: $lazy_modules_count"
fi

echo "  Location: ./dist/"
echo ""
echo "🚀 Performance optimizations applied:"
echo "  ✓ Advanced minification"
echo "  ✓ Gzip compression"
echo "  ✓ Browser caching headers"
echo "  ✓ Reduced bundle sizes"
echo "  ✓ Code splitting and lazy loading"
echo "  ✓ HTTP/2 server push for critical resources"
echo "  ✓ Differential caching for core vs lazy modules"
echo ""
echo "💡 Run 'npm start' to serve the production build"
