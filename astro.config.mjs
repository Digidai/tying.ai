import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import image from '@astrojs/image';
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
      }
    }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
      domains: ['tying.ai'],
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      exclude: ['/api/'],
    }),
  ],

  // 构建优化配置
  build: {
    format: 'file',
    assets: 'assets',
  },

  // Vite配置优化
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 基础库分组
            vendor: ['@astrojs/image', 'sharp'],
            // 样式相关
            styles: ['tailwindcss'],
            // 工具库
            utils: ['date-fns', 'lodash-es'],
          }
        },
        // 代码分割优化
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        entryFileNames: 'assets/entries/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    // 开发服务器配置
    server: {
      host: true,
      port: 3000,
    },
    // 预览服务器配置
    preview: {
      host: true,
      port: 4321,
    },
  },

  // 图片优化配置
  image: {
    domains: ['tying.ai', 'localhost'],
    format: ['webp', 'avif', 'jpg'],
    quality: 85,
    fallbackFormat: 'jpg',
  },

  // 压缩优化
  compressHTML: true,

  // 预渲染配置
  prerender: {
    entries: ['*'],
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

  // 环境变量
  experimental: {
    env: {
      schema: {
        SITE_URL: {
          context: 'server',
          access: 'secret',
        },
        GOOGLE_ANALYTICS_ID: {
          context: 'client',
          access: 'secret',
        },
        API_ENDPOINT: {
          context: 'client',
          access: 'public',
        },
      },
    },
  },
});