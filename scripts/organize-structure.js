#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

class StructureOrganizer {
  constructor() {
    this.structure = {
      public: {
        assets: ['css', 'js', 'images', 'fonts'],
        pages: ['careers', 'reports', 'about', 'tools'],
        seo: ['robots.txt', 'sitemap.xml', 'llms.txt', 'favicon.ico']
      },
      src: {
        components: [],
        styles: [],
        scripts: []
      },
      config: ['package.json', 'package-lock.json', '.gitignore', 'README.md']
    };
  }

  async createDirectories() {
    console.log(chalk.blue('📁 Creating directory structure...'));
    
    const directories = [
      'public',
      'public/assets',
      'public/assets/css',
      'public/assets/js',
      'public/assets/images',
      'public/assets/fonts',
      'src',
      'src/components',
      'src/styles',
      'src/scripts',
      'config',
      'docs'
    ];
    
    for (const dir of directories) {
      await fs.ensureDir(dir);
      console.log(chalk.green(`✅ Created: ${dir}`));
    }
  }

  async moveAssets() {
    console.log(chalk.blue('📦 Moving assets...'));
    
    // 移动CSS文件
    const cssFiles = glob.sync('assets/css/*.css');
    for (const file of cssFiles) {
      const dest = `public/assets/css/${path.basename(file)}`;
      await fs.move(file, dest, { overwrite: true });
      console.log(chalk.green(`✅ Moved: ${file} → ${dest}`));
    }
    
    // 移动JS文件
    const jsFiles = glob.sync('assets/js/*.js');
    for (const file of jsFiles) {
      const dest = `public/assets/js/${path.basename(file)}`;
      await fs.move(file, dest, { overwrite: true });
      console.log(chalk.green(`✅ Moved: ${file} → ${dest}`));
    }
    
    // 移动图片文件
    const imageFiles = glob.sync('*.svg');
    for (const file of imageFiles) {
      const dest = `public/assets/images/${file}`;
      await fs.move(file, dest, { overwrite: true });
      console.log(chalk.green(`✅ Moved: ${file} → ${dest}`));
    }
  }

  async organizePages() {
    console.log(chalk.blue('📄 Organizing pages...'));
    
    // 移动主要页面到public
    const mainPages = ['index.html', 'index-new.html', 'index-optimized.html'];
    for (const page of mainPages) {
      if (await fs.pathExists(page)) {
        const dest = `public/${page}`;
        await fs.move(page, dest, { overwrite: true });
        console.log(chalk.green(`✅ Moved: ${page} → ${dest}`));
      }
    }
    
    // 移动careers目录
    if (await fs.pathExists('careers')) {
      await fs.move('careers', 'public/careers', { overwrite: true });
      console.log(chalk.green('✅ Moved: careers → public/careers'));
    }
    
    // 移动reports目录
    if (await fs.pathExists('reports')) {
      await fs.move('reports', 'public/reports', { overwrite: true });
      console.log(chalk.green('✅ Moved: reports → public/reports'));
    }
    
    // 移动about目录
    if (await fs.pathExists('about')) {
      await fs.move('about', 'public/about', { overwrite: true });
      console.log(chalk.green('✅ Moved: about → public/about'));
    }
    
    // 移动tools目录
    if (await fs.pathExists('tools')) {
      await fs.move('tools', 'public/tools', { overwrite: true });
      console.log(chalk.green('✅ Moved: tools → public/tools'));
    }
  }

  async organizeSEO() {
    console.log(chalk.blue('🔍 Organizing SEO files...'));
    
    const seoFiles = ['robots.txt', 'sitemap.xml', 'llms.txt', 'favicon.ico'];
    for (const file of seoFiles) {
      if (await fs.pathExists(file)) {
        const dest = `public/${file}`;
        await fs.move(file, dest, { overwrite: true });
        console.log(chalk.green(`✅ Moved: ${file} → ${dest}`));
      }
    }
  }

  async createConfig() {
    console.log(chalk.blue('⚙️  Creating configuration...'));
    
    // 创建项目配置文件
    const projectConfig = {
      name: "tying.ai",
      version: "2.0.0",
      description: "AI Career Intelligence Platform",
      structure: {
        public: "Static files and pages",
        src: "Source code and components",
        config: "Configuration files",
        docs: "Documentation",
        scripts: "Build and automation scripts"
      },
      seo: {
        autoUpdate: true,
        sitemap: "public/sitemap.xml",
        robots: "public/robots.txt",
        llms: "public/llms.txt"
      }
    };
    
    await fs.writeFile('config/project.json', JSON.stringify(projectConfig, null, 2));
    console.log(chalk.green('✅ Created: config/project.json'));
  }

  async createDocumentation() {
    console.log(chalk.blue('📚 Creating documentation...'));
    
    const readme = `# Tying.ai - Project Structure

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

\`\`\`bash
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
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## SEO Features

- ✅ Automatic sitemap generation
- ✅ Robots.txt management
- ✅ LLMs.txt for AI training
- ✅ SEO auditing and reporting
- ✅ Structured data generation
- ✅ Performance optimization
- ✅ Mobile optimization

## Last Updated
${new Date().toISOString().split('T')[0]}
`;
    
    await fs.writeFile('docs/README.md', readme);
    console.log(chalk.green('✅ Created: docs/README.md'));
  }

  async run() {
    try {
      console.log(chalk.yellow('🚀 Starting project structure organization...'));
      
      await this.createDirectories();
      await this.moveAssets();
      await this.organizePages();
      await this.organizeSEO();
      await this.createConfig();
      await this.createDocumentation();
      
      console.log(chalk.green('🎉 Project structure organization completed!'));
      console.log(chalk.blue('\n📋 Next steps:'));
      console.log(chalk.blue('1. Run: npm run generate-seo'));
      console.log(chalk.blue('2. Run: npm run seo-audit'));
      console.log(chalk.blue('3. Test the build: npm run build'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during organization:'), error);
      process.exit(1);
    }
  }
}

// 运行组织器
const organizer = new StructureOrganizer();
organizer.run(); 