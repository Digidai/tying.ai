#!/usr/bin/env python3
"""
批量修复 Wiki 页面导航
为所有简单的 wiki 页面添加面包屑导航和 Footer
"""

import os
import re
from pathlib import Path

# 配置
WIKI_DIR = "wiki"
SKIP_FILES = [
    "table-of-contents.html",
    "6-9-software-developers-quality-assurance-analysts-and-testers.html",
    "2.3-fine-artists.html"  # 已手动修复
]

# 导航HTML模板
NAV_TEMPLATE = '''    <!-- Navigation Breadcrumb -->
    <nav class="wiki-breadcrumb" style="padding: 1rem 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: white; font-size: 0.95rem;">
                <a href="/" style="color: white; text-decoration: none; opacity: 0.9; transition: opacity 0.2s;">🏠 Home</a>
                <span style="opacity: 0.6;">›</span>
                <a href="/wiki/table-of-contents.html" style="color: white; text-decoration: none; opacity: 0.9; transition: opacity 0.2s;">📚 Wiki</a>
                <span style="opacity: 0.6;">›</span>
                <span style="font-weight: 600;">{title}</span>
            </div>
        </div>
    </nav>

'''

# Footer HTML模板
FOOTER_TEMPLATE = '''
    <!-- Footer -->
    <footer class="wiki-footer" style="margin-top: 4rem; padding: 2.5rem 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <p style="font-size: 1.1rem; font-weight: 500; margin-bottom: 1rem;">
                    <a href="/" style="color: white; text-decoration: none; margin: 0 1.5rem; opacity: 0.9; transition: opacity 0.2s;">🏠 Home</a>
                    <span style="opacity: 0.5;">|</span>
                    <a href="/wiki/table-of-contents.html" style="color: white; text-decoration: none; margin: 0 1.5rem; opacity: 0.9; transition: opacity 0.2s;">📚 Back to Wiki</a>
                    <span style="opacity: 0.5;">|</span>
                    <a href="/report/us-recruitment-market/index.html" style="color: white; text-decoration: none; margin: 0 1.5rem; opacity: 0.9; transition: opacity 0.2s;">📊 Reports</a>
                </p>
                <p style="font-size: 0.875rem; opacity: 0.8; margin: 0;">&copy; 2025 Tying.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>
'''

def extract_title(content):
    """从HTML中提取页面标题"""
    # 尝试从 <h1> 标签提取
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
    if h1_match:
        return h1_match.group(1).strip()

    # 尝试从 <title> 标签提取
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if title_match:
        title = title_match.group(1)
        # 移除 " - Career Guide | Tying.ai" 等后缀
        title = re.sub(r'\s*-\s*Career Guide.*$', '', title)
        title = re.sub(r'^\d+[\.-]\s*', '', title)  # 移除编号
        return title.strip()

    return "Career Guide"

def fix_wiki_page(filepath):
    """修复单个 wiki 页面"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已有导航
        if 'wiki-breadcrumb' in content:
            return False, "Already has navigation"

        # 提取标题
        title = extract_title(content)

        # 添加导航（在 <body> 后）
        nav_html = NAV_TEMPLATE.format(title=title)
        content = re.sub(
            r'(<body>)',
            r'\1\n' + nav_html,
            content,
            count=1
        )

        # 添加 Footer（在 </body> 前）
        content = re.sub(
            r'(</body>)',
            FOOTER_TEMPLATE + r'\1',
            content,
            count=1
        )

        # 写回文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, f"Fixed: {title}"

    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    print("🔧 批量修复 Wiki 页面导航")
    print("=" * 50)
    print()

    wiki_path = Path(WIKI_DIR)
    if not wiki_path.exists():
        print(f"❌ 错误: {WIKI_DIR} 目录不存在")
        return

    # 获取所有 HTML 文件
    html_files = list(wiki_path.glob("*.html"))
    total_files = len(html_files)

    print(f"📊 找到 {total_files} 个 HTML 文件")
    print()

    fixed_count = 0
    skipped_count = 0
    error_count = 0

    for filepath in html_files:
        filename = filepath.name

        # 跳过已完整的页面
        if filename in SKIP_FILES:
            print(f"⏭️  跳过: {filename}")
            skipped_count += 1
            continue

        success, message = fix_wiki_page(filepath)

        if success:
            print(f"✅ {message}")
            fixed_count += 1
        elif "Already" in message:
            print(f"⏭️  跳过: {filename} ({message})")
            skipped_count += 1
        else:
            print(f"❌ {filename}: {message}")
            error_count += 1

    print()
    print("=" * 50)
    print("✨ 修复完成！")
    print()
    print(f"📊 统计:")
    print(f"   总文件数: {total_files}")
    print(f"   已修复: {fixed_count}")
    print(f"   已跳过: {skipped_count}")
    print(f"   错误: {error_count}")
    print()

    if fixed_count > 0:
        print("🎉 成功！现在所有页面都有导航和 Footer 了。")
        print()
        print("📝 下一步:")
        print("   1. 在浏览器中打开任意 wiki 页面验证")
        print("   2. 检查导航和 Footer 是否正常显示")
        print("   3. 测试点击链接是否正常工作")

    return fixed_count

if __name__ == "__main__":
    main()
