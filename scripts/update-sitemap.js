#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const CONFIG = {
  baseUrl: 'https://tying.ai',
  priority: {
    home: 1.0,
    category: 0.9,
    article: 0.8,
    report: 0.7
  },
  changefreq: {
    home: 'weekly',
    category: 'monthly',
    article: 'yearly',
    report: 'monthly'
  }
};

async function updateSitemap() {
  try {
    console.log(chalk.blue('🗺️  Updating sitemap.xml...'));
    
    const pages = [];
    const htmlFiles = glob.sync('**/*.html', { ignore: ['node_modules/**', 'dist/**', '.next/**'] });
    
    for (const file of htmlFiles) {
      const relativePath = file;
      const url = `${CONFIG.baseUrl}/${relativePath}`;
      const stats = await fs.stat(file);
      const lastmod = stats.mtime.toISOString().split('T')[0];
      
      // 确定页面类型和优先级
      let priority = CONFIG.priority.article;
      let changefreq = CONFIG.changefreq.article;
      
      if (relativePath === 'index.html') {
        priority = CONFIG.priority.home;
        changefreq = CONFIG.changefreq.home;
      } else if (relativePath.includes('index.html') && relativePath.includes('/')) {
        priority = CONFIG.priority.category;
        changefreq = CONFIG.changefreq.category;
      } else if (relativePath.includes('report/')) {
        priority = CONFIG.priority.report;
        changefreq = CONFIG.changefreq.report;
      }
      
      pages.push({
        url,
        lastmod,
        changefreq,
        priority
      });
    }
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const page of pages) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${page.url}</loc>\n`;
      sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    }
    
    sitemap += '</urlset>';
    
    await fs.writeFile('sitemap.xml', sitemap);
    console.log(chalk.green(`✅ Sitemap updated successfully with ${pages.length} URLs`));
    
  } catch (error) {
    console.error(chalk.red('❌ Error updating sitemap:'), error);
    process.exit(1);
  }
}

updateSitemap(); 