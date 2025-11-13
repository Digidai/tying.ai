#!/bin/bash

# Wiki 链接完整性检查脚本
# 检查 table-of-contents.html 中的所有链接是否都有对应的文件

set -e

WIKI_DIR="wiki"
TOC_FILE="$WIKI_DIR/table-of-contents.html"
TEMP_DIR=$(mktemp -d)

echo "🔍 Wiki 链接完整性检查"
echo "================================"
echo ""

# 检查文件是否存在
if [[ ! -f "$TOC_FILE" ]]; then
    echo "❌ 错误: 找不到 $TOC_FILE"
    exit 1
fi

# 提取所有职位页面链接（排除外部链接和上级目录链接）
grep -o 'href="[^"]*\.html"' "$TOC_FILE" | \
    grep -v 'href="http' | \
    grep -v 'href="\.\.' | \
    grep -v 'href="/' | \
    sed 's/href="//;s/"$//' | \
    sort -u > "$TEMP_DIR/links.txt"

# 列出实际存在的文件
ls "$WIKI_DIR"/*.html 2>/dev/null | \
    xargs -n1 basename | \
    sort > "$TEMP_DIR/files.txt"

# 统计
TOTAL_LINKS=$(wc -l < "$TEMP_DIR/links.txt" | tr -d ' ')
TOTAL_FILES=$(wc -l < "$TEMP_DIR/files.txt" | tr -d ' ')

echo "📊 统计信息:"
echo "   链接总数: $TOTAL_LINKS"
echo "   文件总数: $TOTAL_FILES"
echo ""

# 检查断链
echo "🔎 检查断链..."
echo ""

BROKEN_COUNT=0
while read link; do
    if [[ ! -f "$WIKI_DIR/$link" ]]; then
        echo "❌ 缺失文件: $link"
        ((BROKEN_COUNT++))
    fi
done < "$TEMP_DIR/links.txt"

if [[ $BROKEN_COUNT -eq 0 ]]; then
    echo "✅ 所有链接都有对应的文件！"
else
    echo ""
    echo "⚠️  发现 $BROKEN_COUNT 个断链"
fi

echo ""

# 检查孤立文件（有文件但没有链接）
echo "🔎 检查孤立文件（有文件但未被链接）..."
echo ""

ORPHAN_COUNT=0
while read file; do
    if ! grep -q "$file" "$TEMP_DIR/links.txt"; then
        # 排除 table-of-contents.html 本身
        if [[ "$file" != "table-of-contents.html" ]]; then
            echo "⚠️  孤立文件: $file （未被链接）"
            ((ORPHAN_COUNT++))
        fi
    fi
done < "$TEMP_DIR/files.txt"

if [[ $ORPHAN_COUNT -eq 0 ]]; then
    echo "✅ 所有文件都被正确链接！"
else
    echo ""
    echo "⚠️  发现 $ORPHAN_COUNT 个孤立文件"
fi

# 清理临时文件
rm -rf "$TEMP_DIR"

echo ""
echo "================================"
echo "检查完成！"
echo ""

# 返回状态码
if [[ $BROKEN_COUNT -gt 0 ]] || [[ $ORPHAN_COUNT -gt 0 ]]; then
    exit 1
else
    exit 0
fi
