import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 站点配置
  site: 'https://tying.ai',

  // 静态站点生成 - 保持SEO优势
  output: 'static',

  // 集成配置
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false, // 我们将使用自定义CSS
      },
    }),
    sitemap({
      // Sitemap 配置
      filter: page => {
        // 排除不需要索引的页面
        return !page.includes('/simple') && !page.includes('/404');
      },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // 自定义 URL
      customPages: ['https://tying.ai/', 'https://tying.ai/wiki', 'https://tying.ai/report'],
      // i18n (如果需要多语言)
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
        },
      },
    }),
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
          },
        },
      },
    },
    // 开发服务器优化
    server: {
      fs: {
        strict: false,
      },
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['lodash-es', 'date-fns', 'alpinejs'],
      exclude: [],
    },
    // 缓存优化
    cacheDir: 'node_modules/.vite',
  },

  // 压缩优化
  compressHTML: true,

  // 开发工具 - 禁用以加快启动速度
  devToolbar: {
    enabled: false,
  },
});
