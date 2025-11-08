#!/bin/bash

# Wiki 页面导航快速修复脚本
# 为所有简单页面添加基本导航和 Footer

set -e

WIKI_DIR="wiki"
BACKUP_DIR="wiki_backup_$(date +%Y%m%d_%H%M%S)"

echo "🔧 Wiki 页面导航修复工具"
echo "================================"
echo ""

# 创建备份
echo "📦 创建备份到 $BACKUP_DIR..."
cp -r "$WIKI_DIR" "$BACKUP_DIR"
echo "✅ 备份完成"
echo ""

# 统计需要修复的文件
TOTAL_FILES=$(ls "$WIKI_DIR"/*.html | wc -l | tr -d ' ')
FIXED_COUNT=0
SKIPPED_COUNT=0

echo "📊 找到 $TOTAL_FILES 个 HTML 文件"
echo ""

# 遍历所有 HTML 文件
for file in "$WIKI_DIR"/*.html; do
    BASENAME=$(basename "$file")

    # 跳过已完整的页面
    if [[ "$BASENAME" == "table-of-contents.html" ]] || \
       [[ "$BASENAME" == "6-9-software-developers-quality-assurance-analysts-and-testers.html" ]]; then
        echo "⏭️  跳过: $BASENAME (已完整)"
        ((SKIPPED_COUNT++))
        continue
    fi

    # 检查是否已有导航
    if grep -q "breadcrumb" "$file" 2>/dev/null; then
        echo "⏭️  跳过: $BASENAME (已有导航)"
        ((SKIPPED_COUNT++))
        continue
    fi

    # 提取页面标题
    TITLE=$(grep -o '<title>[^<]*</title>' "$file" | sed 's/<title>//;s/<\/title>//;s/ - Career Guide.*//;s/^[0-9.-]* //' | head -1)

    if [[ -z "$TITLE" ]]; then
        TITLE=$(basename "$file" .html | sed 's/-/ /g;s/^[0-9.]* //')
    fi

    # 创建临时文件
    TEMP_FILE="${file}.tmp"

    # 添加导航和 Footer
    awk -v title="$TITLE" '
    /<body>/ {
        print $0
        print "    <!-- Added by fix-wiki-navigation.sh -->"
        print "    <nav class=\"wiki-breadcrumb\" style=\"padding: 1rem; background: #f8f9fa; margin-bottom: 2rem;\">"
        print "        <div class=\"container\">"
        print "            <a href=\"/\" style=\"color: #667eea; text-decoration: none;\">Home</a>"
        print "            <span style=\"margin: 0 0.5rem; color: #718096;\">&gt;</span>"
        print "            <a href=\"/wiki/table-of-contents.html\" style=\"color: #667eea; text-decoration: none;\">Wiki</a>"
        print "            <span style=\"margin: 0 0.5rem; color: #718096;\">&gt;</span>"
        print "            <span style=\"color: #2d3748;\">" title "</span>"
        print "        </div>"
        print "    </nav>"
        next
    }
    /<\/body>/ {
        print "    <!-- Added by fix-wiki-navigation.sh -->"
        print "    <footer class=\"wiki-footer\" style=\"margin-top: 4rem; padding: 2rem 0; border-top: 1px solid #e2e8f0; background: #f8f9fa;\">"
        print "        <div class=\"container\" style=\"text-align: center;\">"
        print "            <p style=\"margin-bottom: 1rem; color: #718096;\">"
        print "                <a href=\"/\" style=\"color: #667eea; text-decoration: none; margin: 0 1rem;\">Home</a>"
        print "                <span style=\"color: #cbd5e0;\">|</span>"
        print "                <a href=\"/wiki/table-of-contents.html\" style=\"color: #667eea; text-decoration: none; margin: 0 1rem;\">Back to Wiki</a>"
        print "                <span style=\"color: #cbd5e0;\">|</span>"
        print "                <a href=\"/report/us-recruitment-market/index.html\" style=\"color: #667eea; text-decoration: none; margin: 0 1rem;\">Reports</a>"
        print "            </p>"
        print "            <p style=\"font-size: 0.875rem; color: #a0aec0;\">&copy; 2025 Tying.ai. All rights reserved.</p>"
        print "        </div>"
        print "    </footer>"
        print $0
        next
    }
    { print }
    ' "$file" > "$TEMP_FILE"

    # 替换原文件
    mv "$TEMP_FILE" "$file"

    echo "✅ 修复: $BASENAME"
    ((FIXED_COUNT++))
done

echo ""
echo "================================"
echo "✨ 修复完成！"
echo ""
echo "📊 统计:"
echo "   总文件数: $TOTAL_FILES"
echo "   已修复: $FIXED_COUNT"
echo "   已跳过: $SKIPPED_COUNT"
echo ""
echo "📂 备份位置: $BACKUP_DIR"
echo ""
echo "🔍 验证修复:"
echo "   打开浏览器访问任意 wiki 页面"
echo "   检查是否有面包屑导航和 Footer"
echo ""
echo "💡 如需恢复:"
echo "   rm -rf $WIKI_DIR"
echo "   mv $BACKUP_DIR $WIKI_DIR"
echo ""
