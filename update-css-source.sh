#!/bin/bash

# Script to update CSS references in source files (excluding dist)
set -e

echo "🔄 Updating CSS references in source files..."

# Function to update CSS references in a file
update_css_references() {
    local file="$1"
    local temp_file=$(mktemp)

    # Check if file contains styles.css reference
    if grep -q "styles\.css" "$file"; then
        # Replace single styles.css with modular CSS files
        sed -E '
            s|<link[^>]*href="[^"]*styles\.css[^"]*"[^>]*>|<link rel="stylesheet" href="/layout.css">\
    <link rel="stylesheet" href="/components.css">\
    <link rel="stylesheet" href="/utilities.css">|g
        ' "$file" > "$temp_file"

        # Only replace if changes were made
        if ! cmp -s "$file" "$temp_file"; then
            mv "$temp_file" "$file"
            echo "✅ Updated: $file"
            return 0
        else
            rm "$temp_file"
            return 1
        fi
    else
        rm "$temp_file"
        return 1
    fi
}

# Counter for updated files
UPDATED_COUNT=0

# Update source HTML files (excluding dist and .git)
echo "🔧 Processing source HTML files..."
find . -name "*.html" -not -path "./dist/*" -not -path "./.git/*" -not -path "./node_modules/*" | while read -r file; do
    if update_css_references "$file"; then
        UPDATED_COUNT=$((UPDATED_COUNT + 1))
    fi
done

echo ""
echo "🎉 CSS modularization update complete!"
echo "📦 Benefits achieved:"
echo "  ✓ Parallel CSS loading enabled"
echo "  ✓ Better browser caching strategy"
echo "  ✓ Improved maintainability"
echo "  ✓ Performance optimization for all pages"