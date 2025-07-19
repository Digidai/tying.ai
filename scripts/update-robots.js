#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');

const CONFIG = {
  baseUrl: 'https://tying.ai'
};

async function updateRobots() {
  try {
    console.log(chalk.blue('🤖 Updating robots.txt...'));
    
    const robots = `User-agent: *
Allow: /

# Block access to private directories
Disallow: /node_modules/
Disallow: /.next/
Disallow: /dist/
Disallow: /.git/
Disallow: /scripts/

# Block access to development files
Disallow: /.DS_Store
Disallow: /package.json
Disallow: /package-lock.json

# Sitemap
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Additional rules for specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /`;
    
    await fs.writeFile('robots.txt', robots);
    console.log(chalk.green('✅ Robots.txt updated successfully'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error updating robots.txt:'), error);
    process.exit(1);
  }
}

updateRobots(); 