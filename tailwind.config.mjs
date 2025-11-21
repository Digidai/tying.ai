import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],

  theme: {
    extend: {
      colors: {
        // Notion 风格黑白灰系统 (Legacy support)
        notion: {
          black: '#000000',
          text: '#37352F',
          'text-light': '#787774',
          white: '#FFFFFF',
          border: '#E9E9E7',
          'bg-subtle': '#F7F6F3',
        },
        // Glassmorphism Colors
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          border: 'rgba(255, 255, 255, 0.2)',
          surface: 'rgba(255, 255, 255, 0.7)',
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
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.25rem',    // 20px
        xl: '2rem',       // 32px
      },
      maxWidth: {
        'notion-narrow': '900px',
        'notion-wide': '1200px',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 1s',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        shine: {
          '100%': {
            left: '125%',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
