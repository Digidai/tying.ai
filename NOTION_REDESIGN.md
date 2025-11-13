# Notion 风格改造说明

## 改造概述

本项目已成功改造为 Notion 风格的极简设计系统,专注于内容本身,移除了所有装饰性元素。

## 核心改变

### 1. 设计系统

#### 颜色系统
- **纯黑白灰配色**:
  - 纯黑: #000000
  - Notion 文字灰: #37352F
  - 次要文字: #787774
  - 纯白: #FFFFFF
  - 边框灰: #E9E9E7
  - 极浅背景: #F7F6F3

- **移除内容**:
  - 11级色阶系统
  - 所有渐变定义
  - 莫兰迪配色系统
  - 多彩语义色系统

#### 字体系统
- **简化为 4 级字号**:
  - sm: 14px
  - base: 16px
  - lg: 20px
  - xl: 32px

- **行高优化**:
  - tight: 1.4
  - normal: 1.6
  - relaxed: 1.8

#### 间距系统
- **统一为 8px 倍数**:
  - 1: 8px
  - 2: 16px
  - 3: 24px
  - 4: 32px
  - 6: 48px
  - 8: 64px
  - 12: 96px

#### 视觉效果
- **完全移除**:
  - ❌ 所有阴影效果
  - ❌ 渐变背景
  - ❌ 动画和过渡
  - ❌ 玻璃态效果
  - ❌ 发光效果

### 2. 布局系统

#### MainLayout.astro
- 移除 Hero 区域
- 移除统计数据展示
- 移除装饰性圆形背景
- 移除毛玻璃导航栏
- 简化为纯白背景 + 细边框导航

#### NotionLayout.astro (新增)
- 专为 Wiki 详情页设计
- 窄栏布局 (max-width: 900px)
- 面包屑导航
- Sticky 导航栏
- 纯文档式内容展示

### 3. 组件简化

#### Button组件
- **仅保留 2 种变体**:
  - primary: 黑色背景 + 白色文字
  - ghost: 白色背景 + 黑色文字 + 细边框

- **移除**:
  - secondary, outline 变体
  - sm/lg 尺寸变体
  - 阴影效果
  - 悬停动画

#### Card组件
- **极简化**:
  - 纯白背景
  - 1px 细边框 (#E9E9E7)
  - 无阴影
  - 无悬停效果

### 4. 页面重构

#### index.astro (首页)
- 移除渐变背景
- 移除特性图标和圆形背景
- 改为纯文本列表
- 简化热门职位展示

#### wiki.astro (Career Wiki)
- 移除 Hero 区
- 移除统计数据
- 移除波浪 SVG
- 移除渐变卡片
- 改为简单的职位分类列表

## 文件结构

```
src/
├── styles/
│   ├── design-tokens.css    # Notion 风格设计令牌
│   ├── global.css            # Notion 风格全局样式
│   ├── components.css        # 最小化组件样式
│   └── tailwind.css          # Tailwind 入口
├── layouts/
│   ├── BaseLayout.astro      # 基础布局
│   ├── MainLayout.astro      # 主布局(简化版)
│   └── NotionLayout.astro    # Notion 文档布局(新增)
├── components/
│   └── ui/
│       ├── Button.astro      # 简化按钮
│       └── Card.astro        # 简化卡片
└── pages/
    ├── index.astro           # 简化首页
    └── wiki.astro            # 简化 Wiki 主页
```

## Wiki 职位详情页改造

### 模板文件
参考 `public/wiki/software-engineer-template.html`

### 标准结构
```html
<!-- 面包屑导航 -->
<nav>Home / Career Wiki / 职位名称</nav>

<!-- 标题 -->
<h1>职位名称</h1>

<!-- 内容 -->
<h2>Overview</h2>
<p>职位概述...</p>

<h2>Core Responsibilities</h2>
<ul>
  <li>职责 1</li>
  <li>职责 2</li>
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

<h2>Education & Qualifications</h2>
<ul>...</ul>

<h2>Industry Outlook</h2>
<p>...</p>

<h2>Getting Started</h2>
<ul>...</ul>
```

## 使用指南

### 1. 开发环境
```bash
npm install
npm run dev
```

### 2. 构建生产版本
```bash
npm run build
```

### 3. 预览生产版本
```bash
npm run preview
```

### 4. 创建新的 Wiki 页面

#### 使用 Astro (推荐)
```astro
---
import NotionLayout from '@/layouts/NotionLayout.astro';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Career Wiki', href: '/encyclopedia' },
];
---

<NotionLayout
  title="职位名称"
  description="职位描述"
  breadcrumbs={breadcrumbs}
>
  <h2>Overview</h2>
  <p>内容...</p>

  <!-- 更多内容 -->
</NotionLayout>
```

#### 使用 HTML
参考 `public/wiki/software-engineer-template.html`

## Tailwind 配置

### 自定义颜色
```js
colors: {
  notion: {
    black: '#000000',
    text: '#37352F',
    'text-light': '#787774',
    white: '#FFFFFF',
    border: '#E9E9E7',
    'bg-subtle': '#F7F6F3',
  },
}
```

### 自定义间距
```js
spacing: {
  '1': '0.5rem',   // 8px
  '2': '1rem',     // 16px
  '3': '1.5rem',   // 24px
  '4': '2rem',     // 32px
  '6': '3rem',     // 48px
  '8': '4rem',     // 64px
  '12': '6rem',    // 96px
}
```

### 自定义最大宽度
```js
maxWidth: {
  'notion-narrow': '900px',  // 文档页窄栏
  'notion-wide': '1200px',   // 一般页面宽栏
}
```

## CSS 变量

### 设计令牌
```css
/* 颜色 */
--color-black: #000000
--color-text: #37352F
--color-text-light: #787774
--color-white: #FFFFFF
--color-border: #E9E9E7
--color-bg-subtle: #F7F6F3

/* 字体 */
--font-family-sans: 'Inter', -apple-system, ...
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.25rem
--font-size-xl: 2rem

/* 间距 */
--space-1: 0.5rem
--space-2: 1rem
--space-3: 1.5rem
--space-4: 2rem
...

/* 布局 */
--container-narrow: 900px
--container-wide: 1200px
```

## 响应式设计

### 断点
- Mobile: < 768px
- Desktop: >= 768px

### 移动端适配
- 导航栏汉堡菜单
- 单列布局
- 缩小字号 (h1: xl → lg)

## 最佳实践

### 1. 保持简洁
- 不添加新的装饰效果
- 不使用颜色渐变
- 不添加阴影
- 不添加动画

### 2. 内容优先
- 使用清晰的层级结构
- 保持足够的留白
- 使用简洁的语言
- 突出重要信息

### 3. 一致性
- 统一使用 Notion 颜色变量
- 统一使用 8px 倍数间距
- 统一使用 4 级字号系统
- 统一使用细边框 (1px)

### 4. 可读性
- 行高 1.6-1.8
- 文字颜色 #37352F
- 次要文字 #787774
- 最大宽度 900px (长文本)

## 迁移指南

### 将现有页面迁移到 Notion 风格

1. **移除装饰元素**:
   ```diff
   - <div class="bg-gradient-to-br from-blue-50">
   + <div class="bg-white">

   - class="shadow-lg hover:shadow-xl"
   + class="border border-notion-border"
   ```

2. **简化组件**:
   ```diff
   - <Button variant="primary" size="lg">
   + <Button variant="primary">
   ```

3. **使用新的颜色变量**:
   ```diff
   - class="text-blue-600"
   + class="text-notion-text"

   - class="border-gray-200"
   + class="border-notion-border"
   ```

4. **调整布局**:
   ```diff
   - <div class="container mx-auto max-w-6xl">
   + <div class="max-w-notion-wide mx-auto px-8">
   ```

## 待办事项

### Wiki 内容重写
- [ ] 重写 100+ 职位详情页
- [ ] 统一内容结构
- [ ] 添加面包屑导航
- [ ] 优化 SEO

### 其他页面
- [ ] 简化 position.astro
- [ ] 简化 report.astro
- [ ] 简化 search.astro
- [ ] 简化 encyclopedia.astro

### 优化
- [ ] 图片优化
- [ ] 性能优化
- [ ] 无障碍优化
- [ ] SEO 优化

## 技术栈

- **框架**: Astro 5.15.5
- **样式**: Tailwind CSS 3.3.3 + 自定义 CSS
- **字体**: Inter (Google Fonts)
- **构建**: Vite 7.2.2
- **语言**: TypeScript 5.1.6

## 性能指标

### 预期改进
- ✅ CSS 体积减少 60%+
- ✅ 移除所有 JavaScript 动画
- ✅ 简化 DOM 结构
- ✅ 提升可读性和对比度
- ✅ 更快的加载速度

## 联系方式

如有问题或建议,请联系项目维护者。

---

**最后更新**: 2024-11-13
**版本**: 2.0.0 (Notion 风格改造)
