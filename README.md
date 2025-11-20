# Tying.ai Official Website

This repository contains the source for **tying.ai**, a comprehensive AI career guidance platform.

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint + Prettier
- **Deployment**: Static Site Generation (SSG)

## Features

- 🎨 **Modern Design**: Clean, responsive design with Notion-style aesthetics
- 📱 **Mobile-First**: Fully responsive across all devices
- ⚡ **Performance**: Optimized static build with Astro
- 🔍 **SEO Optimized**: Sitemap, meta tags, and structured data
- 🌙 **Maintainable**: Component-based architecture
- 📊 **Type Safe**: Strict TypeScript configuration

## Development Setup

```bash
npm install
npm run dev
```

The development server exposes the site at <http://localhost:3000>.

## Build and Preview

```bash
npm run build
npm run start
```

The build script generates static files in `dist/` and `npm run start` previews the production build.

## Project Structure

```text
tying.ai/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Astro pages (routes)
│   ├── scripts/            # Client-side scripts
│   ├── styles/             # Global styles
│   └── utils/              # Helper functions
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration
└── package.json            # Project dependencies and scripts
```

## Key Pages

- **Homepage** (`/`): Main landing page
- **Career Wiki** (`/wiki/`): Career database
- **Industry Reports** (`/report/`): Market analysis
- **Company Funding** (`/company/`): Startup funding database
