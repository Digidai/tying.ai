import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 站点配置
  site: 'https://tying.ai',

  // 静态站点生成 - 保持SEO优势
  output: 'static',

  // 集成配置 - 暂时移除有问题的集成
  integrations: [
    // TODO: 后续添加集成
    // tailwind({
    //   config: {
    //     applyBaseStyles: false, // 我们将使用自定义CSS
    //   }
    // }),
  ],

  // 构建优化配置
  build: {
    format: 'file',
  },

  // Vite配置优化
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 基础库分组
            vendor: ['lodash-es', 'date-fns'],
          }
        },
      },
    },
  },

  // 压缩优化
  compressHTML: true,

  // 预渲染配置
  prerender: {
    entries: ['*']
  },

  // 安全头部配置
  security: {
    headers: [
      {
        name: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        name: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        name: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        name: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ],
  },

  // 开发工具
  devToolbar: {
    enabled: true,
  },
});