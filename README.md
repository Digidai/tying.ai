# Tying.ai

AI career guidance platform built with **Astro** and **TailwindCSS**.

## Tech Stack

- **Framework**: [Astro 5](https://astro.build) (Static Site Generation)
- **Styling**: TailwindCSS + Custom CSS Design System
- **Language**: TypeScript (Strict Mode)
- **Build**: Vite with Terser + LightningCSS minification
- **Fonts**: Inter, JetBrains Mono (via Fontsource)

## Features

- 🎨 **Notion-inspired Design**: Clean, minimal aesthetic with custom design tokens
- 📱 **Responsive**: Mobile-first approach across all pages
- ⚡ **Performance**: Static generation, optimized bundles (~15KB JS gzipped)
- 🔍 **SEO**: Complete meta tags, structured data, auto-generated sitemap
- ♿ **Accessible**: WCAG 2.1 AA compliance, keyboard navigation, reduced motion support

## Development

```bash
npm install
npm run dev        # Start dev server at localhost:3000
```

## Build

```bash
npm run build      # Generate static site to dist/
npm start          # Preview production build
```

## Project Structure

```
tying.ai/
├── src/
│   ├── components/    # Reusable UI components
│   ├── data/          # Content data (positions, wiki, reports)
│   ├── layouts/       # Page layouts (Base, Main, Notion)
│   ├── pages/         # Route pages
│   │   ├── wiki/      # Career wiki pages
│   │   ├── report/    # Industry reports
│   │   ├── position/  # Job positions
│   │   └── company/   # Company database
│   ├── schemas/       # Zod validation schemas
│   ├── services/      # API services (AI, Data, Jina)
│   ├── styles/        # CSS modules
│   └── utils/         # Utility functions
├── public/            # Static assets
├── scripts/           # Build scripts
└── dist/              # Build output (generated)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Format with Prettier |

## License

MIT
