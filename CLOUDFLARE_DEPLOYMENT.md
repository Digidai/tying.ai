# Cloudflare Workers 部署指南

## 🚀 概述

本项目已配置为在 [Cloudflare Workers](https://cloudflare.com/) 平台上运行，利用其全球边缘网络提供高性能、低延迟的服务。

## 📋 前置要求

1. **Cloudflare 账户**: 在 [Cloudflare](https://cloudflare.com/) 注册账户
2. **Wrangler CLI**: 安装 Cloudflare Workers 命令行工具
3. **域名配置**: 确保域名已添加到 Cloudflare

## 🛠️ 安装和设置

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare
```bash
wrangler login
```

### 3. 配置项目
```bash
# 安装依赖
npm install

# 设置项目结构
npm run setup

# 生成 SEO 文件
npm run generate-seo
```

## 📁 项目结构

```
tying.ai/
├── public/                 # 静态文件 (部署到 Workers)
│   ├── assets/            # CSS、JS、图片
│   ├── careers/           # 职业页面
│   ├── reports/           # 报告页面
│   ├── robots.txt         # SEO 文件
│   ├── sitemap.xml        # SEO 文件
│   └── llms.txt           # SEO 文件
├── src/
│   └── worker.js          # Workers 服务文件
├── wrangler.toml          # Workers 配置
└── package.json           # 项目配置
```

## 🔧 配置文件

### wrangler.toml
主要的 Workers 配置文件，包含：
- 项目名称和入口点
- 环境配置 (生产/测试)
- 路由规则
- 安全头设置
- 缓存策略

### src/worker.js
Workers 服务文件，处理：
- 静态资源服务
- SEO 文件内容类型
- 缓存控制
- 错误处理

## 🚀 部署命令

### 开发模式
```bash
# 本地开发
npm run dev

# 本地预览
npm run preview
```

### 部署到生产环境
```bash
# 完整部署流程
npm run deploy:cloudflare

# 直接部署
npm run deploy

# 部署到测试环境
npm run deploy:staging
```

### 监控和日志
```bash
# 查看实时日志
npm run tail
```

## 📊 SEO 优化

### 自动生成的文件
- **sitemap.xml**: 自动扫描所有页面生成
- **robots.txt**: 搜索引擎爬虫指令
- **llms.txt**: AI 模型训练数据
- **structured-data.json**: JSON-LD 结构化数据

### 内容类型处理
Workers 自动为不同文件类型设置正确的 Content-Type：
- `.xml` → `application/xml`
- `.txt` → `text/plain`
- `.html` → `text/html`
- 静态资源 → 相应 MIME 类型

### 缓存策略
- HTML 文件: 1 小时缓存
- 静态资源: 1 年缓存
- SEO 文件: 24 小时缓存

## 🔒 安全配置

### 安全头设置
```toml
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
X-XSS-Protection = "1; mode=block"
Content-Security-Policy = "default-src 'self'; ..."
```

### 内容安全策略
- 限制资源加载来源
- 防止 XSS 攻击
- 禁用内联脚本执行

## 📈 性能优化

### 边缘缓存
- 利用 Cloudflare 全球 CDN
- 自动压缩和优化
- 智能路由

### 静态资源优化
- 长期缓存策略
- 自动压缩
- 图片优化

## 🐛 故障排除

### 常见问题

1. **部署失败**
   ```bash
   # 检查配置
   wrangler whoami
   wrangler config
   ```

2. **SEO 文件不更新**
   ```bash
   # 重新生成 SEO 文件
   npm run generate-seo
   npm run deploy
   ```

3. **缓存问题**
   ```bash
   # 清除缓存
   wrangler kv:namespace list
   ```

### 调试模式
```bash
# 启用调试
DEBUG=true npm run dev
```

## 📊 监控和分析

### 性能监控
- Cloudflare Analytics
- Real User Monitoring (RUM)
- 错误追踪

### SEO 监控
```bash
# 运行 SEO 审计
npm run seo-audit
```

## 🔄 持续集成

### GitHub Actions 示例
```yaml
name: Deploy to Cloudflare Workers
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run generate-seo
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## 📚 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Sites 文档](https://developers.cloudflare.com/workers/platform/sites/)

## 🎯 最佳实践

1. **定期更新 SEO 文件**
2. **监控性能指标**
3. **使用环境变量管理配置**
4. **实施错误监控**
5. **定期安全审计**

---

*最后更新: 2025-01-27*
*Cloudflare Workers 版本: v3.0.0* 