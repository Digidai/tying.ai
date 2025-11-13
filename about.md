# Tying.ai 网站开发规范文档

> 最后更新: 2025-11-13

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [设计系统](#设计系统)
- [布局组件](#布局组件)
- [页面结构](#页面结构)
- [添加新内容指南](#添加新内容指南)
- [样式规范](#样式规范)
- [部署流程](#部署流程)

---

## 项目概述

Tying.ai 是一个职业指导和行业报告平台,采用 Notion 风格的极简设计。网站包含三个主要部分:

- **Home** (`/`): 首页
- **Career Wiki** (`/wiki`): 职业百科
- **Industry Reports** (`/report`): 行业报告

### 设计理念

- **极简主义**: Notion 风格的黑白灰配色
- **内容优先**: 无装饰,突出文字和信息
- **一致性**: 所有页面使用统一的布局和排版
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
- `@astrojs/tailwind`: Tailwind CSS 集成
- `@astrojs/sitemap`: 自动生成 sitemap.xml
- `tailwindcss`: 实用工具类 CSS 框架

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

### 颜色系统 (Design Tokens)

位置: `src/styles/design-tokens.css`

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

  /* 间距 */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 1rem;      /* 16px */
  --space-4: 1.5rem;    /* 24px */
  --space-6: 2.5rem;    /* 40px */
  --space-8: 4rem;      /* 64px */

  /* 字体 */
  --font-family-base: 'Inter', -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* 字号 */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.25rem;    /* 20px */
  --font-size-xl: 1.5rem;     /* 24px */

  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;

  /* 圆角 */
  --radius-sm: 3px;
  --radius-base: 6px;
  --radius-lg: 12px;
}
```

### Tailwind 配置

位置: `tailwind.config.mjs`

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
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
        'notion-narrow': '700px',  // 文章内容宽度
        'notion-wide': '1200px',   // 列表页面宽度
      },
    },
  },
};
```

---

## 布局组件

### 1. BaseLayout

**用途**: 最基础的布局,包含 HTML 结构、meta 标签、SEO 配置

**位置**: `src/layouts/BaseLayout.astro`

**Props**:
```typescript
interface Props {
  title: string;           // 页面标题
  description?: string;    // 页面描述
  image?: string;          // OG 图片
  type?: string;           // OG 类型 (website/article)
  locale?: string;         // 语言 (默认 en)
  url?: string;            // Canonical URL
  noIndex?: boolean;       // 是否禁止索引
  class?: string;          // 额外 class
}
```

**特性**:
- 自动生成 SEO meta 标签
- 结构化数据 (JSON-LD)
- Open Graph 和 Twitter Card
- Google Fonts 预加载
- Sitemap 集成

---

### 2. MainLayout

**用途**: 主要页面布局,包含导航栏和页脚,用于列表页面

**位置**: `src/layouts/MainLayout.astro`

**Props**:
```typescript
interface Props {
  title: string;
  description?: string;
  image?: string;
}
```

**特性**:
- 顶部导航栏 (Home, Career Wiki, Industry Reports)
- 响应式移动端菜单
- 简洁页脚
- 基于 BaseLayout 扩展

**使用示例**:
```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
---

<MainLayout title="Page Title" description="Page description">
  <div class="max-w-notion-wide mx-auto px-8 py-12">
    <!-- 页面内容 -->
  </div>
</MainLayout>
```

---

### 3. NotionLayout

**用途**: Notion 风格的文章阅读布局,用于详情页面 (wiki 和 report)

**位置**: `src/layouts/NotionLayout.astro`

**Props**:
```typescript
interface Props {
  title: string;
  description?: string;
  image?: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}
```

**特性**:
- 窄栏内容区 (max-w-notion-narrow, 700px)
- 面包屑导航
- Notion 风格排版
- 粘性顶部导航栏

**使用示例**:
```astro
---
import NotionLayout from '@/layouts/NotionLayout.astro';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Career Wiki', href: '/wiki' },
];
---

<NotionLayout
  title="Software Engineer"
  description="Career guide"
  breadcrumbs={breadcrumbs}
>
  <h2>Section Title</h2>
  <p>Content goes here...</p>
</NotionLayout>
```

---

## 页面结构

### 1. 首页 (`/`)

**文件**: `src/pages/index.astro`

**结构**:
```astro
<MainLayout title="..." description="...">
  <div class="max-w-notion-wide mx-auto px-8 py-24">
    <!-- 主标题 -->
    <div class="mb-16 text-center">
      <h1 class="text-5xl font-bold">...</h1>
      <p class="text-xl">...</p>
    </div>

    <!-- 功能介绍 -->
    <div class="mb-20">
      <h2>What We Offer</h2>
      <div class="space-y-6">...</div>
    </div>

    <!-- 热门内容 -->
    <div>
      <h2>Popular Career Paths</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">...</div>
    </div>
  </div>
</MainLayout>
```

---

### 2. Career Wiki 列表页 (`/wiki`)

**文件**: `src/pages/wiki.astro`

**特点**:
- 使用 MainLayout
- 分类展示职位
- 网格布局

---

### 3. Career Wiki 详情页 (`/wiki/[slug]`)

**文件**: `src/pages/wiki/[slug].astro`

**动态路由实现**:
```astro
---
import NotionLayout from '@/layouts/NotionLayout.astro';

export async function getStaticPaths() {
  const positions = [
    'software-engineer',
    'data-scientist',
    'product-manager',
    // ... 更多职位
  ];

  return positions.map((slug) => ({
    params: { slug },
  }));
}

const { slug } = Astro.params;

// 标题映射
const titleMap: Record<string, string> = {
  'software-engineer': 'Software Engineer',
  'data-scientist': 'Data Scientist',
  // ...
};

const title = titleMap[slug];
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Career Wiki', href: '/wiki' },
];
---

<NotionLayout
  title={`${title} | Career Wiki`}
  description="..."
  breadcrumbs={breadcrumbs}
>
  <!-- 内容结构 -->
  <h2>Overview</h2>
  <p>...</p>

  <h2>Core Responsibilities</h2>
  <ul>
    <li>...</li>
  </ul>

  <h2>Required Skills</h2>
  <h3>Technical Skills</h3>
  <ul>...</ul>

  <h3>Soft Skills</h3>
  <ul>...</ul>

  <h2>Career Path</h2>
  <h3>Entry Level (0-2 years)</h3>
  <p>...</p>

  <h2>Salary Range</h2>
  <table>...</table>
</NotionLayout>
```

---

### 4. Industry Reports 列表页 (`/report`)

**文件**: `src/pages/report.astro`

**结构**:
```astro
<MainLayout title="Industry Reports" description="...">
  <div class="max-w-notion-wide mx-auto px-8 py-12">
    <!-- 页面标题 -->
    <div class="mb-12">
      <h1>Industry Reports</h1>
      <p>...</p>
    </div>

    <!-- Latest Reports -->
    <div class="mb-16">
      <h2>Latest Reports</h2>
      <div class="space-y-6">
        <div class="pb-6 border-b border-notion-border">
          <div class="text-sm text-notion-text-light mb-2">
            Category • Year
          </div>
          <h3>Report Title</h3>
          <p>Description</p>
          <a href="/report/slug/">Read report →</a>
        </div>
      </div>
    </div>
  </div>
</MainLayout>
```

---

### 5. Industry Reports 详情页 (`/report/[slug]`)

**文件**: `src/pages/report/[slug].astro`

**动态路由实现**:
```astro
---
import NotionLayout from '@/layouts/NotionLayout.astro';

export async function getStaticPaths() {
  const reports = [
    'us-recruitment-market',
    'agentic-ai-vs-ai-agent',
  ];

  return reports.map((slug) => ({
    params: { slug },
  }));
}

const { slug } = Astro.params;

// Report metadata
const reportData: Record<string, any> = {
  'us-recruitment-market': {
    title: 'US Recruitment Market Analysis',
    subtitle: '2024-2025 Market Trends',
    date: 'June 1, 2024',
    category: 'Recruitment',
  },
  'agentic-ai-vs-ai-agent': {
    title: 'Agentic AI vs AI Agent',
    subtitle: 'Understanding the Difference',
    date: 'November 2, 2024',
    category: 'AI & Technology',
  },
};

const report = reportData[slug];
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Industry Reports', href: '/report' },
];
---

<NotionLayout
  title={`${report.title} | Tying.ai`}
  description={report.subtitle}
  breadcrumbs={breadcrumbs}
>
  <!-- Report Header -->
  <div class="mb-8 pb-6 border-b border-notion-border">
    <div class="text-sm text-notion-text-light mb-2">
      {report.category} • {report.date}
    </div>
    <p class="text-lg text-notion-text-light mt-2">
      {report.subtitle}
    </p>
  </div>

  <!-- Report Content -->
  {slug === 'us-recruitment-market' && (
    <>
      <h2>Executive Summary</h2>
      <p>...</p>

      <h2>Market Overview</h2>
      <ul>
        <li><strong>Key Metric:</strong> Value</li>
      </ul>

      <h2>Section Title</h2>
      <h3>Subsection</h3>
      <p>...</p>
    </>
  )}

  {slug === 'agentic-ai-vs-ai-agent' && (
    <>
      <h2>Introduction</h2>
      <p>...</p>
      <!-- ... -->
    </>
  )}
</NotionLayout>
```

---

## 添加新内容指南

### 添加新的 Career Wiki 页面

1. **在 `getStaticPaths()` 中添加新 slug**:
```typescript
const positions = [
  'software-engineer',
  'your-new-position', // 添加这里
];
```

2. **在 `titleMap` 中添加标题**:
```typescript
const titleMap: Record<string, string> = {
  'your-new-position': 'Your Position Title',
};
```

3. **添加内容模板** (使用现有结构):
```astro
<h2>Overview</h2>
<p>职位概述...</p>

<h2>Core Responsibilities</h2>
<ul>
  <li>核心职责 1</li>
  <li>核心职责 2</li>
</ul>

<h2>Required Skills</h2>
<h3>Technical Skills</h3>
<ul>
  <li>技术技能 1</li>
</ul>

<h3>Soft Skills</h3>
<ul>
  <li>软技能 1</li>
</ul>

<h2>Career Path</h2>
<h3>Entry Level (0-2 years)</h3>
<p>入门级描述...</p>

<h3>Mid Level (2-5 years)</h3>
<p>中级描述...</p>

<h3>Senior Level (5-8 years)</h3>
<p>高级描述...</p>

<h3>Leadership (8+ years)</h3>
<p>领导级描述...</p>

<h2>Salary Range</h2>
<table>
  <thead>
    <tr>
      <th>Level</th>
      <th>United States</th>
      <th>Europe</th>
      <th>Asia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Entry (0-2 years)</td>
      <td>$XX,XXX - $XX,XXX</td>
      <td>€XX,XXX - €XX,XXX</td>
      <td>$XX,XXX - $XX,XXX</td>
    </tr>
    <!-- 更多级别 -->
  </tbody>
</table>

<h2>Education & Qualifications</h2>
<ul>
  <li>学历要求</li>
  <li>证书要求</li>
</ul>

<h2>Industry Outlook</h2>
<p>行业展望...</p>

<h2>Getting Started</h2>
<ul>
  <li>如何入门步骤 1</li>
  <li>如何入门步骤 2</li>
</ul>
```

4. **在 `/wiki` 列表页添加链接** (可选):
```astro
<a href="/wiki/your-new-position" class="...">
  <h3>Your Position Title</h3>
  <p>Brief description</p>
</a>
```

---

### 添加新的 Industry Report

1. **在 `getStaticPaths()` 中添加新 slug**:
```typescript
const reports = [
  'us-recruitment-market',
  'agentic-ai-vs-ai-agent',
  'your-new-report', // 添加这里
];
```

2. **在 `reportData` 中添加元数据**:
```typescript
const reportData: Record<string, any> = {
  'your-new-report': {
    title: 'Report Title',
    subtitle: 'Report Subtitle',
    date: 'Month Day, Year',
    category: 'Category Name',
  },
};
```

3. **添加报告内容**:
```astro
{slug === 'your-new-report' && (
  <>
    <!-- Report Header 自动生成 -->

    <h2>Executive Summary</h2>
    <p>报告摘要...</p>

    <h2>Main Section 1</h2>
    <p>内容...</p>

    <h3>Subsection 1.1</h3>
    <p>子章节内容...</p>

    <h2>Main Section 2</h2>
    <ul>
      <li><strong>要点 1:</strong> 描述</li>
      <li><strong>要点 2:</strong> 描述</li>
    </ul>

    <h2>Conclusion</h2>
    <p>结论...</p>
  </>
)}
```

4. **在 `/report` 列表页添加卡片**:
```astro
<div class="pb-6 border-b border-notion-border">
  <div class="text-sm text-notion-text-light mb-2">
    Category • Year
  </div>
  <h3 class="text-lg font-semibold text-notion-text mb-2">
    Report Title
  </h3>
  <p class="text-notion-text-light mb-2">
    Brief description of the report.
  </p>
  <a href="/report/your-new-report/" class="text-notion-text underline">
    Read report →
  </a>
</div>
```

---

## 样式规范

### Notion 风格排版 (prose-notion)

NotionLayout 自动应用 `.prose-notion` 类,包含以下样式:

```css
.prose-notion {
  color: var(--text-primary);
  line-height: var(--line-height-relaxed);
}

.prose-notion h2 {
  margin-top: var(--space-6);      /* 40px */
  margin-bottom: var(--space-3);    /* 16px */
  font-size: var(--font-size-lg);   /* 20px */
  font-weight: var(--font-weight-bold);
}

.prose-notion h3 {
  margin-top: var(--space-4);      /* 24px */
  margin-bottom: var(--space-2);    /* 8px */
  font-size: var(--font-size-base); /* 16px */
  font-weight: var(--font-weight-semibold);
}

.prose-notion p {
  margin-bottom: var(--space-3);    /* 16px */
}

.prose-notion ul,
.prose-notion ol {
  margin-bottom: var(--space-3);
  padding-left: var(--space-3);
}

.prose-notion li {
  margin-bottom: var(--space-1);    /* 4px */
  list-style-position: outside;
}

.prose-notion table {
  width: 100%;
  border: 1px solid var(--border-primary);
  margin: var(--space-3) 0;
}

.prose-notion th,
.prose-notion td {
  padding: var(--space-1) var(--space-2);
  border-bottom: 1px solid var(--border-primary);
  text-align: left;
}

.prose-notion th {
  background-color: var(--bg-secondary);
  font-weight: var(--font-weight-semibold);
}
```

### 常用 Tailwind 类组合

**卡片样式**:
```html
<div class="p-6 border border-notion-border hover:border-notion-text">
  <!-- 内容 -->
</div>
```

**列表分隔线**:
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
<a href="..." class="text-notion-text hover:no-underline">悬停去掉下划线</a>
```

**间距容器**:
```html
<div class="max-w-notion-wide mx-auto px-8 py-12">
  <!-- 列表页面内容,最大宽度 1200px -->
</div>

<div class="max-w-notion-narrow mx-auto px-8 py-12">
  <!-- 文章内容,最大宽度 700px -->
</div>
```

**网格布局**:
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- 移动端单列,桌面端双列 -->
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

## 部署流程

### 自动部署

项目使用 Cloudflare Pages 自动部署:

1. **推送到 GitHub**:
```bash
git add -A
git commit -m "feat: 添加新内容"
git push origin main
```

2. **Cloudflare 自动构建**:
   - 检测到 main 分支更新
   - 自动运行 `npm run build`
   - 部署到 https://tying.ai
   - 通常需要 2-5 分钟

3. **验证部署**:
   - 访问 https://tying.ai 查看更新
   - CDN 缓存可能需要 5-15 分钟完全更新

### 构建配置

**Cloudflare Pages 设置**:
```
Framework preset: Astro
Build command: npm run build
Build output directory: /dist
Node.js version: 20.18.1 (通过 .node-version 指定)
```

### 本地测试

```bash
# 开发服务器 (带热重载)
npm run dev

# 本地构建测试
npm run build
npm run preview
```

---

## 文件结构

```
tying.ai/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # 基础布局
│   │   ├── MainLayout.astro      # 主页面布局
│   │   └── NotionLayout.astro    # Notion 风格布局
│   ├── pages/
│   │   ├── index.astro            # 首页
│   │   ├── wiki.astro             # Wiki 列表页
│   │   ├── wiki/
│   │   │   └── [slug].astro       # Wiki 详情页 (动态路由)
│   │   ├── report.astro           # Report 列表页
│   │   └── report/
│   │       └── [slug].astro       # Report 详情页 (动态路由)
│   └── styles/
│       ├── design-tokens.css      # 设计系统变量
│       ├── global.css             # 全局样式
│       └── components.css         # 组件样式
├── public/
│   ├── robots.txt                 # SEO 配置
│   └── (其他静态资源)
├── archive/                       # 归档文件
├── astro.config.mjs               # Astro 配置
├── tailwind.config.mjs            # Tailwind 配置
├── .node-version                  # Node 版本锁定
├── about.md                       # 本文档
└── package.json
```

---

## 常见问题

### Q: 如何修改导航栏链接?

A: 编辑以下文件的导航部分:
- `src/layouts/MainLayout.astro` (列表页导航)
- `src/layouts/NotionLayout.astro` (详情页导航)

### Q: 如何修改颜色?

A: 编辑 `src/styles/design-tokens.css` 中的 CSS 变量,或修改 `tailwind.config.mjs` 中的 Tailwind 配置。

### Q: 如何添加新的布局?

A: 在 `src/layouts/` 创建新文件,继承自 `BaseLayout.astro`,参考 `MainLayout.astro` 的实现方式。

### Q: 页面没有更新?

A: 检查:
1. 是否已推送到 GitHub
2. Cloudflare Pages 构建是否成功
3. 清除浏览器缓存或使用无痕模式
4. CDN 缓存通常需要 5-15 分钟更新

### Q: 如何测试响应式设计?

A:
1. 本地开发: 使用浏览器开发者工具的设备模拟器
2. Tailwind 断点: `md:` (768px), `lg:` (1024px)
3. 确保使用 `grid-cols-1 md:grid-cols-2` 等响应式类

---

## 最佳实践

### 内容编写

1. **标题层级**:
   - 页面只有一个 `<h1>`
   - 主要章节使用 `<h2>`
   - 子章节使用 `<h3>`
   - 避免跳级 (h2 → h4)

2. **列表使用**:
   - 步骤或顺序使用 `<ol>`
   - 要点或特性使用 `<ul>`
   - 重要内容使用 `<strong>` 加粗

3. **链接规范**:
   - 内部链接使用相对路径
   - 外部链接添加适当的 rel 属性
   - 所有链接提供清晰的文字说明

4. **语义化 HTML**:
   - 使用正确的语义标签
   - 避免过度使用 `<div>`
   - 确保可访问性 (ARIA labels)

### 性能优化

1. **图片**: 使用 WebP 格式,指定宽高
2. **字体**: 已配置 Google Fonts 预连接
3. **CSS**: 使用 CSS 变量,避免内联样式
4. **JS**: 最小化 JavaScript 使用

### 代码规范

1. **缩进**: 2 空格
2. **命名**: kebab-case 用于文件名和 slug
3. **注释**: 为复杂逻辑添加注释
4. **提交信息**: 使用语义化提交 (feat:, fix:, refactor:)

---

## 支持和联系

- **网站**: https://tying.ai
- **GitHub**: https://github.com/Digidai/tying.ai
- **部署**: Cloudflare Pages

---

*本文档随项目更新而持续维护*
