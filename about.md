# Tying.ai 内容创建标准手册

> **快速参考**: 创建新内容时的标准操作指南
> 最后更新: 2025-11-13

---

## 📋 目录

### 快速上手
- [创建新 Report - 完整流程](#创建新-report---完整流程)
- [创建新 Wiki 页面 - 完整流程](#创建新-wiki-页面---完整流程)
- [常见问题速查](#常见问题速查)

### 参考资料
- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [设计系统](#设计系统)
- [文件结构](#文件结构)
- [部署流程](#部署流程)

---

## 创建新 Report - 完整流程

### ✅ 标准检查清单

创建新 Report 需要更新 **4 个位置**：

- [ ] **动态路由文件** `src/pages/report/[slug].astro`
  - [ ] 添加 slug 到 `getStaticPaths()`
  - [ ] 添加 metadata 到 `reportData`
  - [ ] 添加内容块 `{slug === 'xxx' && (...)}`
- [ ] **列表页** `src/pages/report.astro`
  - [ ] 添加报告卡片到 Latest Reports 部分
- [ ] **SEO 文件** `public/llms.txt`
  - [ ] 在 Industry Reports 部分添加条目
- [ ] **更新日期** `public/humans.txt`
  - [ ] 更新 Last update 日期

---

### 📝 详细步骤

#### 步骤 1: 更新动态路由 `src/pages/report/[slug].astro`

**1.1 添加 slug**
```typescript
export async function getStaticPaths() {
  const reports = [
    'us-recruitment-market',
    'agentic-ai-vs-ai-agent',
    'ai-recruitment',
    'your-new-report',  // ← 新增这里
  ];
  return reports.map((slug) => ({ params: { slug } }));
}
```

**1.2 添加 metadata**
```typescript
const reportData: Record<string, any> = {
  'your-new-report': {
    title: 'Report Title',                    // 报告标题
    subtitle: 'Report Subtitle',              // 副标题
    date: 'Month Day, Year',                  // 发布日期（如：November 13, 2025）
    category: 'Category Name',                // 分类（如：AI & Technology）
  },
};
```

**1.3 添加内容块（在文件末尾）**
```astro
{slug === 'your-new-report' && (
  <>
    <h2>Executive Summary</h2>
    <p>报告摘要...</p>

    <h2>Section 1: Main Topic</h2>
    <p>内容...</p>

    <h3>Subsection 1.1</h3>
    <p>子章节内容...</p>
    <ul>
      <li><strong>Key Point 1:</strong> 描述</li>
      <li><strong>Key Point 2:</strong> 描述</li>
    </ul>

    <h2>Section 2: Analysis</h2>
    <p>分析内容...</p>

    <h2>Conclusion</h2>
    <p>结论...</p>
  </>
)}
```

---

#### 步骤 2: 更新列表页 `src/pages/report.astro`

**⚠️ 重要**: 这一步经常被遗漏！动态路由和列表页是独立的文件。

在 `<div class="space-y-6">` 内添加新卡片（建议放在最上方作为最新报告）：

```astro
<div class="pb-6 border-b border-notion-border">
  <div class="text-sm text-notion-text-light mb-2">
    Category • Month Year
  </div>
  <h3 class="text-lg font-semibold text-notion-text mb-2">
    Report Title
  </h3>
  <p class="text-notion-text-light mb-2">
    Brief description of the report (1-2 sentences).
  </p>
  <a href="/report/your-new-report/" class="text-notion-text underline">
    Read report →
  </a>
</div>
```

---

#### 步骤 3: 更新 SEO 文件

**3.1 更新 `public/llms.txt`**

在 `# Industry Reports` 部分添加：

```txt
- Report Title: https://tying.ai/report/your-new-report
  Description: Comprehensive analysis of [topic], including [key aspects]
  Topics: Topic1, Topic2, Topic3, Topic4
```

**示例**:
```txt
- AI in Recruitment: Transforming Talent Acquisition: https://tying.ai/report/ai-recruitment
  Description: Comprehensive analysis of AI-powered recruitment technologies, implementation strategies, bias mitigation, ROI analysis, and future trends in hiring automation
  Topics: AI Recruitment, HR Technology, Talent Acquisition, AI Ethics, Recruitment Automation
```

**3.2 更新 `public/humans.txt`**

更新日期为当前日期：
```txt
# SITE
    Last update: 2025-11-13  ← 改为当前日期
```

---

#### 步骤 4: 本地测试

```bash
# 开发预览
npm run dev
# 访问 http://localhost:4321/report/your-new-report

# 构建测试
npm run build
npm run preview
```

---

#### 步骤 5: 提交和部署

```bash
# 查看更改
git status
git diff

# 提交
git add .
git commit -m "feat: 添加 [Report Title] 研究报告

- 深度分析 [主题]
- [关键内容1]
- [关键内容2]
- 更新 SEO 文件

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 推送到 GitHub（自动部署）
git push origin main
```

---

### 📊 Report 内容结构模板

```astro
{slug === 'your-report' && (
  <>
    {/* 1. Executive Summary - 必需 */}
    <h2>Executive Summary</h2>
    <p>
      简明扼要的报告总结，包含：
      - 研究目的和范围
      - 主要发现（3-5个关键点）
      - 结论和建议
    </p>

    {/* 2. 市场/行业概览 */}
    <h2>Market Overview / Industry Landscape</h2>
    <ul>
      <li><strong>Market Size:</strong> 市场规模数据</li>
      <li><strong>Growth Rate:</strong> 增长率</li>
      <li><strong>Key Players:</strong> 主要参与者</li>
      <li><strong>Trends:</strong> 主要趋势</li>
    </ul>

    {/* 3. 详细分析章节（可多个） */}
    <h2>Section: Analysis Deep Dive</h2>

    <h3>Subsection: Specific Topic</h3>
    <p>详细分析内容...</p>

    <h4>Sub-subsection (如需要)</h4>
    <ul>
      <li><strong>Point 1:</strong> 说明</li>
      <li><strong>Point 2:</strong> 说明</li>
    </ul>

    {/* 4. 数据表格（如适用） */}
    <h3>Comparative Data</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Metric 1</th>
          <th>Metric 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item 1</td>
          <td>Value 1</td>
          <td>Value 2</td>
        </tr>
      </tbody>
    </table>

    {/* 5. 未来展望 */}
    <h2>Future Outlook</h2>
    <p>
      对未来3-5年的预测和趋势分析...
    </p>

    {/* 6. 结论和建议 */}
    <h2>Conclusion</h2>
    <p>总结性陈述...</p>

    <h3>Key Recommendations</h3>
    <ol>
      <li>建议 1</li>
      <li>建议 2</li>
      <li>建议 3</li>
    </ol>

    {/* 7. 参考资料（可选） */}
    <h2>References</h2>
    <ul class="text-sm">
      <li>来源 1</li>
      <li>来源 2</li>
    </ul>
  </>
)}
```

---

## 创建新 Wiki 页面 - 完整流程

### ✅ 标准检查清单

创建新 Wiki 页面需要更新 **4 个位置**：

- [ ] **动态路由文件** `src/pages/wiki/[slug].astro`
  - [ ] 添加 slug 到 `getStaticPaths()`
  - [ ] 添加标题到 `titleMap`
  - [ ] 添加内容块 `{slug === 'xxx' && (...)}`
- [ ] **列表页** `src/pages/wiki.astro`
  - [ ] 添加职位卡片
- [ ] **SEO 文件** `public/llms.txt`
  - [ ] 在 Career Wiki Pages 部分添加条目
- [ ] **更新日期** `public/humans.txt`
  - [ ] 更新 Last update 日期

---

### 📝 详细步骤

#### 步骤 1: 更新动态路由 `src/pages/wiki/[slug].astro`

**1.1 添加 slug**
```typescript
export async function getStaticPaths() {
  const positions = [
    'software-engineer',
    'product-manager',
    'data-scientist',
    'your-new-position',  // ← 新增这里
  ];
  return positions.map((slug) => ({ params: { slug } }));
}
```

**1.2 添加标题映射**
```typescript
const titleMap: Record<string, string> = {
  'software-engineer': 'Software Engineer Career Guide',
  'product-manager': 'Product Manager Career Guide',
  'your-new-position': 'Your Position Title Career Guide',  // ← 新增这里
};
```

**1.3 添加内容块（在文件末尾）**
```astro
{slug === 'your-new-position' && (
  <div class="notion-page">
    {/* 内容参考下面的模板 */}
  </div>
)}
```

---

#### 步骤 2: 更新列表页 `src/pages/wiki.astro`

在适当的位置添加新卡片：

```astro
<div class="card group">
  <div class="card-content">
    <h3 class="card-title">Position Title</h3>
    <p class="card-description">
      Brief description of this career path (2-3 sentences).
    </p>
    <a href="/wiki/your-new-position" class="card-link">
      Read guide
      <svg class="w-4 h-4 transition-transform group-hover:translate-x-1"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </a>
  </div>
</div>
```

---

#### 步骤 3: 更新 SEO 文件

**3.1 更新 `public/llms.txt`**

在 `# Career Wiki Pages` 部分添加：

```txt
- Position Title Career Guide: https://tying.ai/wiki/your-new-position
  Description: Complete guide to [position] career paths, essential skills, responsibilities, and industry insights
  Topics: Position Type, Industry, Career Development, Skills
```

**3.2 更新 `public/humans.txt`**
```txt
Last update: 2025-11-13  ← 改为当前日期
```

---

### 📊 Wiki 页面内容结构模板

```astro
{slug === 'your-position' && (
  <>
    {/* 1. Overview - 必需 */}
    <h2>Overview</h2>
    <div class="callout callout-info">
      <strong>职位概要:</strong> 用 2-3 句话简明扼要地描述这个职位的核心定位和价值。
    </div>
    <p>详细的职位介绍，包括：</p>
    <ul>
      <li>职位在组织中的位置</li>
      <li>主要工作目标</li>
      <li>与其他角色的关系</li>
    </ul>

    {/* 2. Core Responsibilities - 必需 */}
    <h2>Core Responsibilities</h2>
    <ul>
      <li><strong>责任领域 1:</strong> 详细说明</li>
      <li><strong>责任领域 2:</strong> 详细说明</li>
      <li><strong>责任领域 3:</strong> 详细说明</li>
      <li><strong>责任领域 4:</strong> 详细说明</li>
      <li><strong>责任领域 5:</strong> 详细说明</li>
    </ul>

    {/* 3. Required Skills - 必需 */}
    <h2>Required Skills</h2>

    <h3>Technical Skills</h3>
    <ul>
      <li><strong>技能类别 1:</strong> 具体技能列表</li>
      <li><strong>技能类别 2:</strong> 具体技能列表</li>
      <li><strong>技能类别 3:</strong> 具体技能列表</li>
    </ul>

    <h3>Soft Skills</h3>
    <ul>
      <li><strong>沟通能力:</strong> 说明</li>
      <li><strong>团队协作:</strong> 说明</li>
      <li><strong>问题解决:</strong> 说明</li>
      <li><strong>领导力:</strong> 说明</li>
    </ul>

    {/* 4. Career Path - 必需 */}
    <h2>Career Path</h2>

    <h3>Entry Level (0-2 years)</h3>
    <p><strong>典型职位:</strong> Junior/Associate Position</p>
    <p><strong>主要职责:</strong> 入门级工作描述</p>
    <p><strong>技能要求:</strong> 基础技能列表</p>

    <h3>Mid Level (2-5 years)</h3>
    <p><strong>典型职位:</strong> Position / Senior Associate</p>
    <p><strong>主要职责:</strong> 中级工作描述</p>
    <p><strong>技能要求:</strong> 进阶技能列表</p>

    <h3>Senior Level (5-8 years)</h3>
    <p><strong>典型职位:</strong> Senior Position / Lead</p>
    <p><strong>主要职责:</strong> 高级工作描述</p>
    <p><strong>技能要求:</strong> 专家级技能列表</p>

    <h3>Leadership (8+ years)</h3>
    <p><strong>典型职位:</strong> Manager / Director / VP</p>
    <p><strong>主要职责:</strong> 领导级工作描述</p>
    <p><strong>技能要求:</strong> 战略级技能列表</p>

    {/* 5. Salary Range - 必需 */}
    <h2>Salary Range</h2>
    <table>
      <thead>
        <tr>
          <th>Level</th>
          <th>United States</th>
          <th>Europe</th>
          <th>Asia-Pacific</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Entry (0-2 years)</td>
          <td>$XX,XXX - $XX,XXX</td>
          <td>€XX,XXX - €XX,XXX</td>
          <td>$XX,XXX - $XX,XXX</td>
        </tr>
        <tr>
          <td>Mid (2-5 years)</td>
          <td>$XX,XXX - $XX,XXX</td>
          <td>€XX,XXX - €XX,XXX</td>
          <td>$XX,XXX - $XX,XXX</td>
        </tr>
        <tr>
          <td>Senior (5-8 years)</td>
          <td>$XX,XXX - $XX,XXX</td>
          <td>€XX,XXX - €XX,XXX</td>
          <td>$XX,XXX - $XX,XXX</td>
        </tr>
        <tr>
          <td>Lead/Manager (8+ years)</td>
          <td>$XX,XXX - $XX,XXX</td>
          <td>€XX,XXX - €XX,XXX</td>
          <td>$XX,XXX - $XX,XXX</td>
        </tr>
      </tbody>
    </table>
    <p class="text-sm text-notion-text-light mt-2">
      *Salary ranges vary by company size, location, and industry. Data based on 2024-2025 market research.
    </p>

    {/* 6. Education & Qualifications */}
    <h2>Education & Qualifications</h2>
    <h3>Educational Background</h3>
    <ul>
      <li><strong>最低学历:</strong> 说明</li>
      <li><strong>推荐学历:</strong> 说明</li>
      <li><strong>相关专业:</strong> 专业列表</li>
    </ul>

    <h3>Certifications & Training</h3>
    <ul>
      <li><strong>行业认证:</strong> 证书列表</li>
      <li><strong>推荐课程:</strong> 课程建议</li>
      <li><strong>在线资源:</strong> 学习资源</li>
    </ul>

    {/* 7. Industry Outlook */}
    <h2>Industry Outlook</h2>
    <p><strong>就业前景:</strong> 行业增长趋势和就业机会分析</p>
    <p><strong>市场需求:</strong> 当前和未来需求分析</p>
    <p><strong>技术趋势:</strong> 影响该职位的技术变革</p>

    {/* 8. Getting Started */}
    <h2>Getting Started</h2>
    <h3>For Students & Recent Graduates</h3>
    <ol>
      <li>步骤 1: 详细说明</li>
      <li>步骤 2: 详细说明</li>
      <li>步骤 3: 详细说明</li>
    </ol>

    <h3>For Career Switchers</h3>
    <ol>
      <li>步骤 1: 详细说明</li>
      <li>步骤 2: 详细说明</li>
      <li>步骤 3: 详细说明</li>
    </ol>

    {/* 9. Resources (可选) */}
    <h2>Additional Resources</h2>
    <ul>
      <li><strong>Industry Associations:</strong> 行业组织</li>
      <li><strong>Online Communities:</strong> 在线社区</li>
      <li><strong>Recommended Reading:</strong> 推荐书籍/文章</li>
    </ul>
  </>
)}
```

---

## 常见问题速查

### ❌ 问题: 添加新 Report 后在列表页看不到

**原因**: 只更新了动态路由，忘记更新列表页

**解决方案**:
1. 检查 `src/pages/report/[slug].astro` - slug、metadata、内容 ✓
2. **检查 `src/pages/report.astro`** - 是否添加了卡片？
3. 清除浏览器缓存重新访问

**记住**: 动态路由（详情页）和列表页是两个独立文件，必须分别更新！

---

### ❌ 问题: 页面构建失败或 404 错误

**原因**: slug 不一致或路径错误

**检查清单**:
- [ ] `getStaticPaths()` 中的 slug 拼写是否正确
- [ ] 列表页链接的 URL 是否匹配 slug
- [ ] 内容块的条件判断 `{slug === 'xxx'}` 是否正确

---

### ❌ 问题: SEO 不生效或 LLM 找不到页面

**原因**: 忘记更新 `public/llms.txt`

**解决方案**:
1. 打开 `public/llms.txt`
2. 在对应部分添加新页面条目
3. 包含: 标题、URL、描述、话题标签
4. 重新构建和部署

---

### ❌ 问题: 样式显示不正确

**原因**: 使用了错误的布局或 CSS 类

**检查**:
- Report/Wiki 详情页应使用 `NotionLayout`
- 列表页应使用 `MainLayout`
- 使用 Notion 风格的 CSS 类: `text-notion-text`, `border-notion-border` 等

---

## 项目概述

### 核心信息

**网站**: https://tying.ai
**类型**: 职业指导和行业分析平台
**设计风格**: Notion 风格极简主义
**部署**: Cloudflare Pages (自动部署)

### 主要板块

1. **Home** (`/`) - 首页
2. **Career Wiki** (`/wiki`) - 职业百科
   - 列表页: `/wiki`
   - 详情页: `/wiki/[slug]`
3. **Industry Reports** (`/report`) - 行业报告
   - 列表页: `/report`
   - 详情页: `/report/[slug]`

### 设计理念

- **极简主义**: 黑白灰配色，无装饰
- **内容优先**: 突出文字和信息
- **一致性**: 统一的布局和排版
- **响应式**: 移动端和桌面端自适应

---

## 技术栈

### 核心框架
```json
{
  "astro": "^5.15.5",
  "framework": "Static Site Generator",
  "styling": "Tailwind CSS + CSS Variables",
  "deployment": "Cloudflare Pages"
}
```

### 关键依赖
- `@astrojs/tailwind` - Tailwind CSS 集成
- `@astrojs/sitemap` - 自动生成 sitemap.xml
- `tailwindcss` - 实用工具类 CSS 框架

### 构建配置
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://tying.ai',
  output: 'static',
  integrations: [tailwind(), sitemap()]
});
```

---

## 设计系统

### 颜色系统

```css
:root {
  /* 文字颜色 */
  --text-primary: #37352F;      /* 主要文字 - 深灰黑 */
  --text-secondary: #787774;    /* 次要文字 - 中灰 */
  --text-tertiary: #9B9A97;     /* 三级文字 - 浅灰 */

  /* 背景颜色 */
  --bg-primary: #FFFFFF;        /* 主背景 - 白色 */
  --bg-secondary: #F7F6F3;      /* 次要背景 - 浅灰 */
  --bg-hover: #F1F0ED;          /* 悬停背景 */

  /* 边框颜色 */
  --border-primary: #E9E9E7;    /* 主边框 - 浅灰 */
}
```

### Tailwind 配置

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        'notion-text': '#37352F',
        'notion-text-light': '#787774',
        'notion-border': '#E9E9E7',
        'notion-bg': '#FFFFFF',
        'notion-bg-secondary': '#F7F6F3',
      },
      maxWidth: {
        'notion-narrow': '700px',   // 文章内容宽度
        'notion-wide': '1200px',    // 列表页面宽度
      },
    },
  },
};
```

### 常用样式组合

**卡片样式**:
```html
<div class="p-6 border border-notion-border hover:border-notion-text">
  <!-- 内容 -->
</div>
```

**分隔线**:
```html
<div class="pb-6 border-b border-notion-border">
  <!-- 内容 -->
</div>
```

**文字样式**:
```html
<p class="text-notion-text">主要文字</p>
<p class="text-notion-text-light">次要文字</p>
<p class="text-sm text-notion-text-light">小号次要文字</p>
```

**链接样式**:
```html
<a href="..." class="text-notion-text underline">链接文字</a>
```

**容器宽度**:
```html
<!-- 列表页面，最大宽度 1200px -->
<div class="max-w-notion-wide mx-auto px-8 py-12">
  <!-- 内容 -->
</div>

<!-- 文章内容，最大宽度 700px -->
<div class="max-w-notion-narrow mx-auto px-8 py-12">
  <!-- 内容 -->
</div>
```

**网格布局**:
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- 移动端单列，桌面端双列 -->
</div>
```

**垂直间距**:
```html
<div class="space-y-6">
  <!-- 子元素之间间距 24px -->
  <div>...</div>
  <div>...</div>
</div>
```

---

## 文件结构

```
tying.ai/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # 基础布局（SEO、meta）
│   │   ├── MainLayout.astro      # 列表页布局（带导航栏）
│   │   └── NotionLayout.astro    # 详情页布局（文章阅读）
│   ├── pages/
│   │   ├── index.astro            # 首页
│   │   ├── wiki.astro             # Wiki 列表页
│   │   ├── wiki/
│   │   │   └── [slug].astro       # Wiki 详情页（动态路由）
│   │   ├── report.astro           # Report 列表页
│   │   └── report/
│   │       └── [slug].astro       # Report 详情页（动态路由）
│   └── styles/
│       ├── design-tokens.css      # 设计系统变量
│       ├── global.css             # 全局样式
│       └── components.css         # 组件样式
├── public/
│   ├── robots.txt                 # 搜索引擎配置
│   ├── humans.txt                 # 人类可读信息
│   ├── llms.txt                   # LLM 索引文件
│   └── _headers                   # Cloudflare 头部配置
├── astro.config.mjs               # Astro 配置
├── tailwind.config.mjs            # Tailwind 配置
├── .node-version                  # Node 版本（20.18.1）
├── CONTENT_UPDATE_CHECKLIST.md   # 内容更新检查清单
└── about.md                       # 本文档
```

---

## 布局组件详解

### BaseLayout
- **用途**: 最基础的 HTML 结构
- **特性**: SEO meta 标签、结构化数据、Open Graph
- **位置**: `src/layouts/BaseLayout.astro`

### MainLayout
- **用途**: 列表页布局
- **特性**: 顶部导航栏、页脚、响应式
- **使用**: `/wiki`, `/report`, `/`
- **位置**: `src/layouts/MainLayout.astro`

### NotionLayout
- **用途**: 详情页/文章布局
- **特性**: 窄栏内容区（700px）、面包屑导航、Notion 风格排版
- **使用**: `/wiki/[slug]`, `/report/[slug]`
- **位置**: `src/layouts/NotionLayout.astro`

---

## 部署流程

### 自动部署

1. **推送到 GitHub**:
```bash
git add .
git commit -m "feat: 添加新内容"
git push origin main
```

2. **Cloudflare 自动构建**:
   - 检测到 main 分支更新
   - 自动运行 `npm run build`
   - 部署到 https://tying.ai
   - 通常需要 2-5 分钟

3. **验证部署**:
   - 访问 https://tying.ai
   - CDN 缓存可能需要 5-15 分钟

### Cloudflare Pages 配置

```
Framework preset: Astro
Build command: npm run build
Build output directory: /dist
Node.js version: 20.18.1
```

### 本地测试命令

```bash
# 开发服务器（带热重载）
npm run dev

# 本地构建测试
npm run build
npm run preview
```

---

## 最佳实践

### 内容编写规范

1. **标题层级**
   - 页面只有一个 `<h1>`（由布局自动生成）
   - 主要章节使用 `<h2>`
   - 子章节使用 `<h3>`
   - 避免跳级（h2 → h4）

2. **列表使用**
   - 步骤或顺序使用 `<ol>`
   - 要点或特性使用 `<ul>`
   - 重要内容使用 `<strong>` 加粗

3. **链接规范**
   - 内部链接使用相对路径（`/wiki/software-engineer`）
   - 外部链接添加适当的 rel 属性
   - 提供清晰的链接文字说明

4. **语义化 HTML**
   - 使用正确的语义标签
   - 确保可访问性
   - 避免过度使用 `<div>`

### Git 提交规范

使用语义化提交信息：

```bash
feat: 添加新功能
fix: 修复问题
docs: 文档更新
refactor: 代码重构
style: 样式调整
chore: 构建/工具更新
```

### 性能优化建议

1. **图片**: 使用 WebP 格式，指定宽高
2. **字体**: 已配置 Google Fonts 预连接
3. **CSS**: 使用 CSS 变量，避免内联样式
4. **JS**: 最小化 JavaScript 使用

---

## 维护和更新

### 定期检查项

- [ ] 检查所有链接是否有效
- [ ] 更新过时的数据和统计信息
- [ ] 验证薪资范围是否符合当前市场
- [ ] 测试响应式设计在不同设备上的表现
- [ ] 检查 Lighthouse 性能分数

### 内容更新周期

- **Career Wiki**: 每季度审查，每半年更新
- **Industry Reports**: 根据行业变化及时更新
- **薪资数据**: 每年更新一次
- **技术栈**: 根据技术发展持续更新

---

## 支持和资源

- **网站**: https://tying.ai
- **GitHub**: https://github.com/Digidai/tying.ai
- **部署**: Cloudflare Pages
- **文档**: 本文件 (about.md)
- **检查清单**: CONTENT_UPDATE_CHECKLIST.md

---

*本文档持续更新 - 最后更新: 2025-11-13*
