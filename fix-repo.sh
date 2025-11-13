#!/bin/bash

# 备份当前的源文件
echo "备份源文件..."
cd /Users/dai/Documents/CursorProjects
cp -r tying.ai tying.ai.backup

# 重新克隆仓库
echo "重新克隆仓库..."
rm -rf tying.ai/.git
cd tying.ai
git init
git remote add origin https://github.com/Digidai/tying.ai.git
git fetch origin main
git reset --hard origin/main

# 添加所有源文件
echo "添加源文件..."
git add -A

# 显示状态
echo "文件状态:"
git status

echo ""
echo "完成！现在可以提交和推送了。"
echo "运行: git commit -m 'feat: add all source files' && git push origin main"
