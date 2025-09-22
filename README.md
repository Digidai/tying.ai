# Tying.ai Official Website

This repository contains the source for **tying.ai**, a comprehensive AI career guidance platform powered by modern HTML/CSS/JavaScript.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with CSS Variables and Grid/Flexbox
- **Performance**: Service Worker for offline caching
- **SEO**: Complete meta tags, structured data, and sitemap
- **Accessibility**: WCAG 2.1 AA compliant
- **Build**: Simple npm scripts for development and production

## Features

- 🎨 **Modern Design**: Clean, responsive design with smooth animations
- 📱 **Mobile-First**: Fully responsive across all devices
- ⚡ **Performance**: Optimized loading with Service Worker caching
- 🔍 **SEO Optimized**: Complete meta tags and structured data
- ♿ **Accessible**: WCAG 2.1 AA compliant with screen reader support
- 🌙 **Dark Mode**: Automatic dark mode support
- 📊 **Analytics Ready**: Performance monitoring and analytics integration

## Development Setup

```bash
npm install
npm run dev
```

Open <http://localhost:3000> in your browser.

## Build and Preview

```bash
npm run build
npm start
```

The build script copies the site into `dist/` and `npm start` serves it on port 3000.

## Project Structure

```text
tying.ai/
├── index.html              # Main landing page
├── genedai.html            # Personal profile page
├── styles.css              # Main stylesheet
├── site.js                 # Main JavaScript
├── sw.js                   # Service Worker
├── manifest.json           # PWA manifest
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
├── components/            # Reusable components
│   ├── header.html
│   └── footer.html
├── scripts/               # JavaScript modules
│   └── layout.js
├── position/              # Job descriptions
├── report/                # Industry reports
├── wiki/                  # Career wiki pages
├── dist/                  # Build output (generated)
└── src/app/               # Next.js components (legacy)
```

## Key Pages

- **Homepage** (`/`): Main landing page with features and content
- **Career Wiki** (`/wiki/`): Comprehensive career database
- **Industry Reports** (`/report/`): Market analysis and trends
- **Position Guide** (`/position/`): Job descriptions and requirements
- **Profile** (`/genedai.html`): Personal profile page

## Optimization Features

- ✅ Modern CSS with variables and animations
- ✅ Service Worker for offline functionality
- ✅ Complete SEO optimization
- ✅ Accessibility compliance
- ✅ Performance monitoring
- ✅ Responsive design
- ✅ Dark mode support
- ✅ PWA capabilities

