/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],

  theme: {
    extend: {
      colors: {
        // Notion 风格黑白灰系统
        notion: {
          black: '#000000',
          text: '#37352F',
          'text-light': '#787774',
          white: '#FFFFFF',
          border: '#E9E9E7',
          'bg-subtle': '#F7F6F3',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
      },
      fontSize: {
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.25rem', // 20px
        xl: '2rem', // 32px
      },
      lineHeight: {
        tight: '1.4',
        normal: '1.6',
        relaxed: '1.8',
      },
      spacing: {
        1: '0.5rem', // 8px
        2: '1rem', // 16px
        3: '1.5rem', // 24px
        4: '2rem', // 32px
        6: '3rem', // 48px
        8: '4rem', // 64px
        12: '6rem', // 96px
      },
      borderRadius: {
        sm: '0.125rem', // 2px
        base: '0.25rem', // 4px
      },
      maxWidth: {
        'notion-narrow': '900px',
        'notion-wide': '1200px',
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
};

export default config;
