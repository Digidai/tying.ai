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
<<<<<<< HEAD
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
=======
.
├── components/            # Shared UI snippets
├── index.html             # Main landing page
├── index-optimized.html   # Minified variant of the landing page
├── genedai.html           # Additional landing page experiment
├── styles.css             # Primary stylesheet
├── minimal*.css           # Alternate style variants
├── report/                # Documentation and analysis
├── position/              # Job descriptions
├── wiki/                  # Wiki pages
├── scripts/               # Automation helpers
└── dist/                  # Build output (generated)
>>>>>>> 76c32fc1005119781f769f8ee00c36216d8a041c
```

## Key Pages

<<<<<<< HEAD
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

=======
- ✅ CSS extracted into dedicated files
- ✅ Added performance scripts
- ✅ Improved responsive design
- ✅ Cleaned redundant config files
- ✅ Unified static-site tooling
- ✅ Added email subscription functionality
- ✅ Optimized SEO meta tags
>>>>>>> 76c32fc1005119781f769f8ee00c36216d8a041c
