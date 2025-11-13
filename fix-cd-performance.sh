#!/bin/bash

# Tying.ai CD 性能优化脚本
# 自动修复 cd 进入目录慢的问题

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZSHRC="$HOME/.zshrc"

echo "🚀 Tying.ai CD 性能优化工具"
echo "================================"
echo ""

# 1. 备份 .zshrc
if [ -f "$ZSHRC" ]; then
    BACKUP_FILE="$ZSHRC.backup.$(date +%Y%m%d_%H%M%S)"
    echo "📦 正在备份 .zshrc 到 $BACKUP_FILE"
    cp "$ZSHRC" "$BACKUP_FILE"
    echo "✅ 备份完成"
else
    echo "⚠️  未找到 ~/.zshrc，将创建新文件"
    touch "$ZSHRC"
fi

echo ""

# 2. 检查是否已经有优化配置
if grep -q "TYING_AI_PERFORMANCE_OPTIMIZATION" "$ZSHRC" 2>/dev/null; then
    echo "ℹ️  检测到已有优化配置，跳过..."
else
    echo "⚙️  正在添加 Zsh 性能优化配置..."

    cat >> "$ZSHRC" << 'EOF'

# === TYING_AI_PERFORMANCE_OPTIMIZATION ===
# 自动添加于: $(date)

# 禁用 Git dirty 文件检查（大幅提升速度）
DISABLE_UNTRACKED_FILES_DIRTY="true"

# 设置 Git 状态缓存时间（秒）
ZSH_GIT_PROMPT_CACHE_TIMEOUT=30

# 针对特定项目目录优化
if [[ $PWD == */tying.ai* ]] || [[ $PWD == */CursorProjects/* ]]; then
    # 减少 Git 状态检查频率
    export GIT_PROMPT_EXECUTABLE="haskell"
fi

# === END TYING_AI_PERFORMANCE_OPTIMIZATION ===
EOF

    echo "✅ Zsh 配置优化完成"
fi

echo ""

# 3. 应用 Git 配置
echo "⚙️  正在优化 Git 配置..."
cd "$PROJECT_DIR"

# 基础性能优化
git config --local core.untrackedCache true 2>/dev/null || true
git config --local core.preloadindex true 2>/dev/null || true
git config --local core.fscache true 2>/dev/null || true

# 关键优化：禁用耗时的 ahead/behind 计算（从 28s → 0.03s）
git config --local status.aheadbehind false 2>/dev/null || true

# 不显示未追踪文件（大幅提升速度）
git config --local status.showUntrackedFiles no 2>/dev/null || true

echo "✅ Git 配置优化完成"
echo ""

# 4. 运行 Git GC
echo "🧹 正在清理 Git 仓库..."
git gc --auto --quiet 2>/dev/null || true
echo "✅ Git 清理完成"
echo ""

# 5. 测试性能
echo "🔍 正在测试性能..."
echo ""

echo "📊 Git 状态检查速度："
time git status > /dev/null 2>&1
echo ""

# 6. 显示结果
echo "================================"
echo "✨ 优化完成！"
echo ""
echo "📝 下一步操作："
echo "1. 运行以下命令使配置生效："
echo "   source ~/.zshrc"
echo ""
echo "2. 重新打开终端或运行："
echo "   exec zsh"
echo ""
echo "3. 测试 cd 速度："
echo "   cd .. && cd $(basename $PROJECT_DIR)"
echo ""
echo "📖 详细优化说明请查看："
echo "   .zsh-performance-tips.md"
echo ""
echo "💡 提示：如果使用 Oh My Zsh 或 Powerlevel10k，"
echo "   请参考 .zsh-performance-tips.md 中的进阶优化。"
echo ""
