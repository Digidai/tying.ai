# Tying.ai - Project Structure

## Overview
This is the AI Career Intelligence Platform with automated SEO management.

## Directory Structure

### /public
- **assets/**: CSS, JS, images, and fonts
- **careers/**: Career-related pages and content
- **reports/**: Market analysis and reports
- **about/**: About pages and company information
- **tools/**: Utility tools and resources
- **robots.txt**: Search engine crawling directives
- **sitemap.xml**: Site structure for search engines
- **llms.txt**: AI model training data

### /src
- **components/**: Reusable UI components
- **styles/**: Source stylesheets
- **scripts/**: Source JavaScript files

### /config
- **project.json**: Project configuration
- **package.json**: Node.js dependencies
- **.gitignore**: Git ignore rules

### /scripts
- **generate-seo.js**: Main SEO generation script
- **seo-audit.js**: SEO health checker
- **update-*.js**: Individual SEO file updaters
- **organize-structure.js**: This file

## SEO Automation

The project includes automated SEO management:

1. **Automatic Sitemap Generation**: Scans all HTML files and generates sitemap.xml
2. **Robots.txt Management**: Creates and updates robots.txt with proper directives
3. **LLMs.txt Generation**: Creates AI model training data
4. **SEO Auditing**: Checks for SEO issues and provides recommendations

## Usage

```bash
# Generate all SEO files
npm run generate-seo

# Update specific SEO files
npm run update-sitemap
npm run update-robots
npm run update-llms

# Audit SEO health
npm run seo-audit

# Build project
npm run build
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## SEO Features

- ✅ Automatic sitemap generation
- ✅ Robots.txt management
- ✅ LLMs.txt for AI training
- ✅ SEO auditing and reporting
- ✅ Structured data generation
- ✅ Performance optimization
- ✅ Mobile optimization

## Last Updated
2025-07-19
