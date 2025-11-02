#!/bin/bash

# Script to update CSS references from styles.css to modular CSS files
# This will improve performance by enabling parallel loading and better caching

set -e

echo "🔄 Updating CSS references to modular structure..."

# Count files before update
TOTAL_FILES=$(find . -name "*.html" -not -path "./.git/*" | wc -l)
STYLES_FILES=$(grep -l "styles\.css" ./**/*.html ./*.html 2>/dev/null | wc -l || echo 0)

echo "📊 Found $STYLES_FILES files using styles.css out of $TOTAL_FILES total HTML files"

# Function to update CSS references in a file
update_css_references() {
    local file="$1"
    local temp_file=$(mktemp)

    # Check if file contains styles.css reference
    if grep -q "styles\.css" "$file"; then
        # Replace single styles.css with modular CSS files
        sed -E '
            s|<link[^>]*styles\.css[^>]*>|<link rel="stylesheet" href="/layout.css">\
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

# Update all HTML files
echo "🔧 Processing HTML files..."
find . -name "*.html" -not -path "./.git/*" -not -path "./node_modules/*" | while read -r file; do
    if update_css_references "$file"; then
        UPDATED_COUNT=$((UPDATED_COUNT + 1))
    fi
done

echo ""
echo "📈 Update Summary:"
echo "  Total HTML files: $TOTAL_FILES"
echo "  Files using styles.css: $STYLES_FILES"
echo "  Files updated: $UPDATED_COUNT"

if [ $UPDATED_COUNT -gt 0 ]; then
    echo ""
    echo "🎉 CSS modularization complete!"
    echo "📦 Benefits:"
    echo "  ✓ Parallel CSS loading"
    echo "  ✓ Better browser caching"
    echo "  ✓ Improved maintainability"
    echo "  ✓ Performance optimization"
    echo ""
    echo "💡 Run 'git status' to see changes and commit when ready"
else
    echo ""
    echo "ℹ️  No files needed updating"
fi