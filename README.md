# tying.ai Official Website

This repository contains the source for **tying.ai**, a small landing page powered by plain HTML/CSS/JavaScript and a minimal Next.js setup.

## Tech Stack

- Static HTML5 and CSS3
- Vanilla JavaScript for effects
- [Next.js](https://nextjs.org/) (used in `src/app`)
- Node `serve` for local development

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
.
├── index.html            # Main landing page
├── index-optimized.html  # Minified variant
├── genedai.html          # Additional page
├── styles.css            # Global styles
├── src/app/              # Next.js pages and layout
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── position/             # Job descriptions
├── report/               # Documentation
├── wiki/                 # Wiki pages
└── dist/                 # Build output (generated)
```

## Optimization Summary

- ✅ CSS extracted into a separate file
- ✅ Added performance scripts
- ✅ Improved responsive design
- ✅ Cleaned redundant config files
- ✅ Unified tech stack
- ✅ Added email subscription functionality
- ✅ Optimized SEO meta tags

