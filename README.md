# Tying.ai Official Website

This repository contains the source for **tying.ai**, a comprehensive AI career guidance platform built with modern HTML, CSS, and JavaScript.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with CSS Variables, Grid, and Flexbox
- **Components**: Dynamic header/footer loading with layout.js
- **Performance**: Service Worker for offline caching (PWA)
- **SEO**: Complete meta tags, structured data, and sitemap
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Build**: Simple npm scripts with [serve](https://www.npmjs.com/package/serve)

## Features

- 🎨 **Modern Design**: Clean, responsive design with smooth animations
- 📱 **Mobile-First**: Fully responsive across all devices
- ⚡ **Performance**: Optimized loading with Service Worker caching
- 🔍 **SEO Optimized**: Complete meta tags and structured data
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- 🌙 **Dark Mode**: Automatic dark mode support
- 💾 **PWA**: Progressive Web App with offline support
- 📊 **Analytics Ready**: Performance monitoring and analytics integration

## Development Setup

```bash
npm install
npm run dev
```

The development server exposes the site at <http://localhost:3000> using `serve`.

## Build and Preview

```bash
npm run build
npm start
```

The build script copies the site into `dist/` and `npm start` serves the generated folder on port 3000.

## Project Structure

```text
tying.ai/
├── index.html              # Main landing page
├── genedai.html            # Personal profile page
├── styles.css              # Main stylesheet (Glassmorphism design)
├── genedai.css             # Dedicated stylesheet for genedai.html
├── site.js                 # Main JavaScript with interactions
├── sw.js                   # Service Worker
├── manifest.json           # PWA manifest
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
├── components/            # Reusable components
│   ├── header.html
│   └── footer.html
├── scripts/               # JavaScript modules
│   └── layout.js
├── position/              # Job position guides
├── report/                # Industry reports
├── wiki/                  # Career wiki pages
├── assets/                # Static assets (icons, images)
└── dist/                  # Build output (generated)
```

## Key Pages

- **Homepage** (`/`): Main landing page with features and content
- **Career Wiki** (`/wiki/`): Comprehensive career database with 180+ job profiles
- **Industry Reports** (`/report/`): Market analysis and career insights
- **Company Funding** (`/company/`): Latest funding rounds, investments, and startup news database
- **Profile** (`/genedai.html`): Personal profile page with minimalist design

## Optimization Features

- ✅ Glassmorphism design system with CSS variables
- ✅ Service Worker for offline functionality (PWA)
- ✅ Complete SEO optimization with meta tags and structured data
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Performance optimizations (lazy loading, reduced motion support)
- ✅ Fully responsive design (mobile-first approach)
- ✅ Component-based architecture with dynamic header/footer
- ✅ Smooth animations with IntersectionObserver
