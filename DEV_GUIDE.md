# Tying.ai 开发指南

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
# 开发模式 (源文件)
npm run dev

# 构建并启动
npm run build:dev

# 生产模式 (已构建文件)
npm start
```

## 📝 可用脚本

### 开发相关

- `npm run dev` - 启动开发服务器 (端口3000)
- `npm run dev:watch` - 监听模式，自动重新构建
- `npm run build:dev` - 构建并启动开发服务器

### 构建相关

- `npm run build` - 生产构建 (完整优化)
- `npm run build:simple` - 快速构建 (复制文件)
- `npm run start:prod` - 生产构建并启动

### 维护相关

- `npm run clean` - 清理构建文件和缓存
- `npm run status` - 显示项目状态
- `npm run perf` - 性能测试提示

## 🏗 项目结构

```
tying.ai/
├── 📁 css/                 # CSS模块文件
│   ├── layout.css         # 基础布局和变量
│   ├── components.css     # UI组件样式
│   └── utilities.css      # 工具类和动画
├── 📁 js/                  # JavaScript模块
│   ├── main.js           # 应用入口
│   └── modules/          # 功能模块
│       ├── performance-optimizer.js
│       ├── navigation-controller.js
│       ├── animation-manager.js
│       └── interaction-handler.js
├── 📁 components/          # HTML组件
├── 📁 dist/               # 构建输出
├── 📁 wiki/               # Wiki页面
├── 📁 report/             # 报告页面
├── 📁 position/           # 职位指南页面
└── 📄 index.html          # 主页面
```

## 🎨 CSS架构

### 模块化设计

- **layout.css**: 基础变量、重置样式、容器、网格
- **components.css**: 按钮、卡片、导航、表单等UI组件
- **utilities.css**: 工具类、动画、响应式设计

### 使用原则

```html
<!-- 在HTML中按顺序加载 -->
<link rel="stylesheet" href="/layout.css" />
<link rel="stylesheet" href="/components.css" />
<link rel="stylesheet" href="/utilities.css" />
```

## 💻 JavaScript架构

### ES6模块系统

```javascript
// main.js - 应用入口
import { PerformanceOptimizer } from './modules/performance-optimizer.js';
import { NavigationController } from './modules/navigation-controller.js';
// ...

class MainApp {
  async init() {
    // 初始化所有模块
  }
}
```

### 模块职责

- **PerformanceOptimizer**: 性能检测、设备适配、监控
- **NavigationController**: 导航、滚动、移动端菜单
- **AnimationManager**: 动画管理、懒加载、视差效果
- **InteractionHandler**: 交互处理、事件委托、表单验证

## 🔧 开发工具

### 推荐浏览器扩展

- React Developer Tools (未来如果使用React)
- Vue.js devtools (未来如果使用Vue)
- Lighthouse (性能测试)
- Web Vitals (性能监控)

### VS Code扩展推荐

- Live Server - 本地开发服务器
- Prettier - 代码格式化
- ESLint - 代码质量检查
- Auto Rename Tag - HTML标签重命名
- Bracket Pair Colorizer - 括号配对着色

## 📊 性能优化

### 已实现的优化

- ✅ CSS模块化和并行加载
- ✅ JavaScript模块化
- ✅ 事件委托优化
- ✅ requestAnimationFrame滚动优化
- ✅ 图片懒加载
- ✅ 性能模式检测

### 性能测试

```bash
# 使用浏览器Lighthouse测试
npm run perf

# 或者直接在浏览器开发者工具中运行Lighthouse
```

## 🚨 错误处理

### 全局错误处理

项目已实现全局错误处理：

- 捕获JavaScript运行时错误
- 处理Promise拒绝
- 用户友好的错误提示
- 可选的错误上报

### 开发调试

```javascript
// 在浏览器控制台中调试
window.TyingAI.app; // 访问应用实例
```

## 🔄 构建流程

### 开发构建

```bash
npm run build:simple
```

快速复制文件到dist目录，适合开发测试

### 生产构建

```bash
npm run build
```

完整优化流程：

- CSS高级压缩
- JavaScript混淆和压缩
- HTML优化
- Gzip压缩
- 浏览器缓存配置

## 🌐 部署

### 静态网站部署

dist目录包含完整的静态网站，可以部署到：

- Netlify
- Vercel
- GitHub Pages
- 任何静态网站托管服务

### 环境变量

复制 `.env.example` 到 `.env` 并配置相关变量

## 🧪 测试

### 当前状态

- 测试框架：待配置
- 单元测试：待实现
- 集成测试：待实现
- E2E测试：待实现

### 未来计划

- 添加Jest或Vitest进行单元测试
- 添加Playwright进行E2E测试
- 集成CI/CD流水线

## 📈 监控和分析

### 性能监控

- Core Web Vitals自动收集
- 自定义性能指标
- 错误监控和报告

### 用户分析 (未来)

- Google Analytics集成
- 用户行为追踪
- 热图分析

## 🤝 贡献指南

### 开发流程

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

### 代码规范

- 使用ES6+语法
- 遵循模块化设计
- 添加适当的注释
- 保持代码整洁

## 🆘 故障排除

### 常见问题

**Q: 开发服务器无法启动**

```bash
# 检查端口占用
lsof -ti:3000

# 强制结束进程
kill -9 $(lsof -ti:3000)
```

**Q: 构建失败**

```bash
# 清理缓存
npm run clean

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

**Q: 样式不生效**

- 检查CSS文件加载顺序
- 确认模块化CSS文件存在
- 检查浏览器缓存

### 获取帮助

- 查看GitHub Issues
- 检查控制台错误信息
- 参考本开发指南

## 📚 学习资源

### 推荐阅读

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

### 性能优化

- [Web.dev](https://web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

🚀 **Happy Coding!**

如有问题，请查看控制台输出或创建GitHub Issue。
