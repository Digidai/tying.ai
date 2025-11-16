#!/bin/bash

# Script to replace console.log statements with logger utility
# This ensures console logs are only shown in development mode

FILES=(
  "src/layouts/BaseLayout.astro"
  "src/scripts/search.ts"
  "src/scripts/main.ts"
  "src/services/dataService.ts"
  "src/scripts/utils/performance-monitor.ts"
)

# Backup directory
BACKUP_DIR="./backup_console_logs_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🔄 Replacing console statements with logger utility..."
echo "📁 Backup directory: $BACKUP_DIR"

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"

    # Create backup
    cp "$file" "$BACKUP_DIR/$(basename $file)"

    # Check if logger import already exists
    if ! grep -q "from.*@/utils/logger" "$file" && ! grep -q "from.*'@/utils/logger'" "$file"; then
      # Add import at the top (after any existing imports)
      if [[ "$file" == *.astro ]]; then
        # For .astro files, add in frontmatter
        sed -i.bak '1 a\
import logger from "@/utils/logger";
' "$file"
      else
        # For .ts files
        sed -i.bak '1 a\
import logger from "@/utils/logger";
' "$file"
      fi
    fi

    # Replace console statements
    sed -i.bak 's/console\.log(/logger.log(/g' "$file"
    sed -i.bak 's/console\.warn(/logger.warn(/g' "$file"
    sed -i.bak 's/console\.error(/logger.error(/g' "$file"
    sed -i.bak 's/console\.info(/logger.info(/g' "$file"
    sed -i.bak 's/console\.debug(/logger.debug(/g' "$file"

    # Remove .bak files created by sed
    rm -f "$file.bak"

    echo "✅ $file updated"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo ""
echo "✨ Done! All console statements have been replaced with logger utility."
echo "📦 Original files backed up to: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Review the changes"
echo "2. Test that logging works correctly"
echo "3. Commit the changes"
