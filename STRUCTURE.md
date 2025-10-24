# Tying.ai Project Structure

This document provides a comprehensive overview of the tying.ai project structure, file organization, and architectural decisions.

## Directory Structure

```
tying.ai/
├── index.html              # Main landing page
├── genedai.html            # Personal profile page with minimalist design
├── index-optimized.html    # Experimental optimized variant
├── styles.css              # Main stylesheet (Glassmorphism design system)
├── genedai.css             # Dedicated stylesheet for genedai.html
├── site.js                 # Main JavaScript with global interactions
├── sw.js                   # Service Worker for PWA functionality
├── manifest.json           # PWA manifest
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
├── browserconfig.xml      # Browser configuration
├── favicon.ico            # Site favicon
│
├── components/            # Reusable UI components
│   ├── header.html        # Site header (loaded dynamically)
│   └── footer.html        # Site footer (loaded dynamically)
│
├── scripts/               # JavaScript modules
│   └── layout.js          # Component loading and layout management
│
├── assets/                # Static assets
│   ├── icons/             # Icon files
│   └── images/            # Images and graphics
│
├── position/              # Job position guides
│   ├── index.html         # Position guide landing page
│   ├── software-engineer/
│   ├── product-manager/
│   └── ai-product-manager/
│
├── report/                # Industry reports and analysis
│   ├── index.html         # Reports landing page
│   ├── us-recruitment-market/
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   ├── data_visualization/
│   │   ├── employment_visualization/
│   │   ├── employment-gap-analysis/
│   │   └── tech_analysis/
│   └── agentic-ai-vs-ai-agent/
│
├── wiki/                  # Career wiki pages (180+ job profiles)
│   ├── table-of-contents.html
│   ├── marketing/
│   ├── [occupation-code]-[job-name].html
│   └── ...
│
├── dist/                  # Production build output (generated, not in git)
├── build.sh              # Build script with minification
├── package.json          # NPM dependencies and scripts
├── README.md             # Project documentation
└── STRUCTURE.md          # This file

```

## File Organization

### Root Level Files

- **index.html**: Main landing page with Glassmorphism design
- **genedai.html**: Personal profile page with independent minimalist design
- **index-optimized.html**: Experimental optimization variant (may be removed)
- **styles.css**: Main stylesheet with Glassmorphism design system (~1750 lines)
- **genedai.css**: Dedicated minimalist stylesheet for genedai.html
- **site.js**: Main JavaScript with 5 core modules (320 lines)
- **sw.js**: Service Worker for offline caching and PWA functionality

### Component Architecture

The site uses a component-based architecture with dynamic loading:

- **Header Component** (`components/header.html`):
  - Navigation menu
  - Mobile menu toggle
  - Logo and branding
  - Loaded via `layout.js` on all pages

- **Footer Component** (`components/footer.html`):
  - Site links
  - Social media links
  - Copyright information
  - Loaded via `layout.js` on all pages

### Content Sections

#### Position Guides (`/position/`)
Detailed career guides for specific roles:
- Software Engineer
- Product Manager
- AI Product Manager

Each guide includes:
- Role overview
- Skills and requirements
- Career progression
- Industry insights

#### Industry Reports (`/report/`)
Comprehensive market analysis and research:
- US Recruitment Market Analysis (549 lines, comprehensive)
- Agentic AI vs AI Agent comparison

Reports include:
- Data visualizations
- Employment analysis
- Technology trends
- Market forecasts

#### Career Wiki (`/wiki/`)
Database of 180+ job profiles organized by:
- Standard Occupational Classification (SOC) codes
- Industry categories
- Skill levels
- Table of contents for easy navigation

## Design System

### Glassmorphism Design

The site uses a modern Glassmorphism design system defined in `styles.css`:

**CSS Variables:**
- Glass backgrounds with transparency (rgba)
- Backdrop blur effects (10px-30px)
- Gradient borders and accents
- Shadow depths (3 levels)
- Color palette (purple, pink, blue, green gradients)

**Key Features:**
- Semi-transparent backgrounds
- Backdrop-filter blur
- Subtle borders and shadows
- Smooth transitions and animations
- Mobile-optimized (reduced blur on mobile)

### JavaScript Architecture

**Site.js Modules:**
1. **Global Interactions** - Mobile menu, anchor links, lazy loading
2. **Performance Detection** - Reduced motion, slow connections, low-end devices
3. **Animations** - IntersectionObserver for scroll-triggered effects
4. **Header Scroll** - Hide/show on scroll with requestAnimationFrame
5. **Glassmorphism Enhancements** - Shimmer effects, parallax, counters

**Performance Optimizations:**
- Passive event listeners
- RequestAnimationFrame for scroll handlers
- IntersectionObserver auto-unobserve
- Prefers-reduced-motion support
- Performance mode for slow connections/devices

## Build System

### Development

```bash
npm run dev          # Start development server on port 3000
```

Serves the source files directly from the project root.

### Production Build

```bash
npm run build        # Build with minification
npm run build:simple # Build without minification (copy only)
npm start           # Serve production build
```

**Build Process (`build.sh`):**
1. Clean `dist/` directory
2. Copy directory structure
3. Minify CSS files (cleancss)
4. Minify JavaScript files (terser)
5. Minify HTML files (html-minifier)
6. Generate build summary

**Minification Tools:**
- **HTML**: html-minifier
- **CSS**: clean-css-cli
- **JS**: terser

## Path Conventions

### Absolute Paths
All main pages use absolute paths for consistency:
- CSS: `/styles.css` or `/genedai.css`
- JS: `/site.js`, `/scripts/layout.js`
- Components: `/components/header.html`, `/components/footer.html`

### Why Absolute Paths?
- Consistent imports across all directory levels
- No relative path confusion (../../styles.css)
- Easier to maintain and refactor
- Works seamlessly with component loading

## PWA Implementation

### Service Worker (`sw.js`)
- Caches critical assets
- Offline functionality
- Network-first strategy for dynamic content
- Cache-first strategy for static assets

### Manifest (`manifest.json`)
- App name and description
- Icons (multiple sizes)
- Theme colors
- Display mode: standalone
- Start URL: /

### Browser Configuration (`browserconfig.xml`)
- Windows tile configuration
- Tile colors and icons

## SEO Strategy

### Meta Tags
All pages include:
- Primary meta tags (title, description, keywords)
- Open Graph tags (Facebook)
- Twitter Card tags
- Canonical URLs
- Author and robots directives

### Sitemap (`sitemap.xml`)
- All main pages indexed
- Priority levels assigned
- Change frequency hints
- Last modified dates

### Robots (`robots.txt`)
- Allow all crawlers
- Sitemap location specified
- No disallow rules

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios
- Focus indicators
- Skip to content links

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1200px
- Touch-friendly tap targets (min 44x44px)
- Viewport meta tags
- Flexible images and media

## Version Control

### Git Structure
- Main branch: `main`
- Feature branches: `codex/*`
- Commit convention: Conventional Commits format
- Co-authored by: Claude Code

### .gitignore
Excludes:
- Build outputs (`dist/`, `build/`)
- Dependencies (`node_modules/`)
- Environment files (`.env*`)
- OS files (`.DS_Store`)
- Backup files (`*.backup`, `* 2.*`)
- IDE configs (`.vscode/`, `.idea/`)
- Local configs (`.claude/settings.local.json`)

## Dependencies

### Production
- **serve**: Static file server for development and production

### Development
- **html-minifier**: HTML minification
- **clean-css-cli**: CSS minification
- **terser**: JavaScript minification

### External CDN Resources
Some pages use external resources:
- Tailwind CSS (g.alicdn.com)
- Font Awesome (bootcdn.net)
- Google Fonts (fonts.font.im)
- Mermaid.js (diagrams)
- Chart.js (data visualization)

## Performance Metrics

### Key Metrics
- Lighthouse score target: 90+ (all categories)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1

### Optimization Techniques
- Lazy loading images
- Deferred JavaScript loading
- CSS minification
- HTML minification
- Service Worker caching
- Font loading optimization
- Reduced motion support

## Future Improvements

### Potential Enhancements
- [ ] Add more position guides
- [ ] Expand industry reports
- [ ] Implement search functionality
- [ ] Add filtering to career wiki
- [ ] Create email subscription system
- [ ] Add more data visualizations
- [ ] Implement dark mode toggle
- [ ] Add multi-language support

### Technical Debt
- Consider migrating to a static site generator (e.g., 11ty, Astro)
- Evaluate CSS-in-JS for component styles
- Implement proper image optimization pipeline
- Add automated testing (unit, integration, e2e)
- Set up CI/CD pipeline
- Add performance monitoring

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and update SEO metadata
- Check broken links quarterly
- Update sitemap when adding pages
- Monitor Lighthouse scores
- Review analytics data

### Contact
For questions or contributions, please refer to the repository maintainers.

---

Last updated: 2025-10-24
Generated with [Claude Code](https://claude.com/claude-code)
