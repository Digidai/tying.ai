# tying.ai Official Website

This repository contains the source for **tying.ai**, a lightweight static website built with plain HTML, CSS, and a small amount of JavaScript.

## Tech Stack

- Static HTML5 and CSS3
- Vanilla JavaScript for interactions
- [serve](https://www.npmjs.com/package/serve) for local development and previews

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
```

## Optimization Summary

- ✅ CSS extracted into dedicated files
- ✅ Added performance scripts
- ✅ Improved responsive design
- ✅ Cleaned redundant config files
- ✅ Unified static-site tooling
- ✅ Added email subscription functionality
- ✅ Optimized SEO meta tags
