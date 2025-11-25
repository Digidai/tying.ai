# 内容更新检查清单

当添加新的 Wiki 页面或 Report 时，请按照此清单确保所有相关文件都已更新。

## 添加新 Wiki 页面

### 必须更新 ✓

- [ ] `src/pages/wiki/[slug].astro`
  - [ ] 在 `getStaticPaths()` 的 `positions` 数组中添加新 slug
  - [ ] 在 `titleMap` 中添加标题映射
  - [ ] 添加内容块 `{slug === 'your-slug' && (...)}`

- [ ] `src/pages/wiki.astro`
  - [ ] 添加新的卡片组件显示在列表页

### 建议更新（SEO）📈

- [ ] `public/llms.txt`
  - [ ] 在 `# Career Wiki Pages` 部分添加新页面条目
  - [ ] 包含：标题、URL、描述、相关话题

- [ ] `public/humans.txt`
  - [ ] 更新 `Last update:` 日期

### 自动处理 ✅

- Sitemap (`sitemap-index.xml`) - 构建时自动生成
- 结构化数据（JSON-LD）- 模板自动生成
- Meta 标签 - 模板自动生成

---

## 添加新 Report

### 必须更新 ✓

- [ ] `src/pages/report/[slug].astro`
  - [ ] 在 `getStaticPaths()` 的 `reports` 数组中添加新 slug
  - [ ] 在 `titleMap` 中添加标题映射
  - [ ] 在 `reportData` 中添加元数据（日期、阅读时间、类别等）
  - [ ] 添加内容块 `{slug === 'your-slug' && (...)}`

- [ ] `src/pages/report.astro`
  - [ ] 添加新的报告卡片显示在列表页

### 建议更新（SEO）📈

- [ ] `public/llms.txt`
  - [ ] 在 `# Industry Reports` 部分添加新报告条目
  - [ ] 包含：标题、URL、描述、相关话题

- [ ] `public/humans.txt`
  - [ ] 更新 `Last update:` 日期

### 自动处理 ✅

- Sitemap - 构建时自动生成
- 结构化数据 - 模板自动生成
- Meta 标签 - 模板自动生成
- Breadcrumbs - 自动根据 URL 生成

---

## 详细步骤示例

### 示例：添加 "UX Designer" Wiki 页面

#### 1. 更新 `src/pages/wiki/[slug].astro`

```typescript
// 步骤 1: 添加 slug
export async function getStaticPaths() {
  const positions = [
    'software-engineer',
    'product-manager',
    'data-scientist',
    'ux-designer',  // ← 新增
  ];
  return positions.map((slug) => ({ params: { slug } }));
}

// 步骤 2: 添加标题映射
const titleMap: Record<string, string> = {
  'software-engineer': 'Software Engineer Career Guide',
  'product-manager': 'Product Manager Career Guide',
  'data-scientist': 'Data Scientist Career Guide',
  'ux-designer': 'UX Designer Career Guide',  // ← 新增
};

// 步骤 3: 添加内容块（在文件末尾）
{slug === 'ux-designer' && (
  <div class="notion-page">
    <h1>UX Designer Career Guide</h1>

    <div class="notion-callout">
      <strong>Overview:</strong> Comprehensive guide to UX design career...
    </div>

    <h2>What is a UX Designer?</h2>
    <p>Content here...</p>

    <h2>Key Responsibilities</h2>
    <ul class="notion-list">
      <li>User research and testing</li>
      <li>Wireframing and prototyping</li>
    </ul>

    <h2>Required Skills</h2>
    <p>Content here...</p>

    <h2>Career Path</h2>
    <p>Content here...</p>
  </div>
)}
```

#### 2. 更新 `src/pages/wiki.astro`

```astro
<!-- 在 grid 容器中添加新卡片 -->
<div class="card group">
  <div class="card-content">
    <h3 class="card-title">UX Designer</h3>
    <p class="card-description">
      Complete guide to UX design career paths, essential skills, portfolio
      building, and industry insights.
    </p>
    <a href="/wiki/ux-designer" class="card-link">
      Read guide
      <svg
        class="w-4 h-4 transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"></path>
      </svg>
    </a>
  </div>
</div>
```

#### 3. 更新 `public/llms.txt`

```txt
# Career Wiki Pages
> Comprehensive career guides for different positions

- Software Engineer Career Guide: https://tying.ai/wiki/software-engineer
  Description: Complete guide to software engineering career paths...

- Product Manager Career Guide: https://tying.ai/wiki/product-manager
  Description: In-depth guide to product management roles...

- Data Scientist Career Guide: https://tying.ai/wiki/data-scientist
  Description: Comprehensive resource for data science careers...

- UX Designer Career Guide: https://tying.ai/wiki/ux-designer
  Description: Complete guide to UX design career paths, essential skills, and portfolio building
  Topics: UX Design, User Experience, Design Career, Product Design
```

#### 4. 更新 `public/humans.txt`

```txt
# SITE
    Last update: 2025-11-14  ← 更新为当前日期
    Standards: HTML5, CSS3, ES2022
    Components: Responsive, Accessible, SEO-optimized
    Design: Notion-inspired minimalism
```

#### 5. 测试和部署

```bash
# 本地测试
npm run dev
# 访问 http://localhost:4321/wiki/ux-designer

# 构建测试
npm run build
npm run preview

# 提交和部署
git add .
git commit -m "feat: 添加 UX Designer 职业指南"
git push origin main
```

---

## 快速参考

### 当前 Wiki Slugs

- `software-engineer`
- `product-manager`
- `data-scientist`

### 当前 Report Slugs

- `us-recruitment-market`
- `agentic-ai-vs-ai-agent`

### 重要文件路径

```
src/pages/wiki/[slug].astro       ← Wiki 动态路由
src/pages/wiki.astro              ← Wiki 列表页
src/pages/report/[slug].astro     ← Report 动态路由
src/pages/report.astro            ← Report 列表页
public/llms.txt                   ← LLM SEO
public/humans.txt                 ← 人类可读信息
```

### 有用的命令

```bash
# 检查构建是否成功
npm run build

# 本地预览构建结果
npm run preview

# 检查 git 状态
git status

# 查看修改的文件
git diff
```

---

## 常见错误

### ❌ 忘记添加 slug 到数组

**错误：** 添加了内容块但没有在 `getStaticPaths()` 添加 slug **结果：**
页面返回 404

### ❌ 标题映射不匹配

**错误：** slug 和 titleMap 的 key 不一致 **结果：** 页面标题显示为 "Default
Title"

### ❌ 列表页忘记添加卡片

**错误：** 只更新了详情页，没有更新列表页 **结果：** 用户无法从列表页发现新内容

### ❌ llms.txt 忘记更新

**错误：** 添加新内容后没有更新 llms.txt **结果：** LLM 无法发现和索引新内容

---

## 自动化建议（未来）

可以考虑创建脚本自动化部分更新流程：

```bash
# 示例脚本（未实现）
npm run add-wiki -- --slug=ux-designer --title="UX Designer Career Guide"
npm run add-report -- --slug=ai-market-2025 --title="AI Market Report 2025"
```

目前这些更新都需要手动完成，但遵循此检查清单可以确保不会遗漏重要步骤。

---

**最后更新：** 2025-11-13 **维护者：** Tying.ai Team
