#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

class SEOAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  async auditHTMLFiles() {
    console.log(chalk.blue('🔍 Auditing HTML files...'));
    
    const htmlFiles = glob.sync('**/*.html', { ignore: ['node_modules/**', 'dist/**', '.next/**'] });
    
    for (const file of htmlFiles) {
      const content = await fs.readFile(file, 'utf8');
      
      // 检查标题标签
      if (!content.includes('<title>')) {
        this.issues.push(`${file}: Missing title tag`);
      } else {
        this.successes.push(`${file}: Has title tag`);
      }
      
      // 检查meta描述
      if (!content.includes('name="description"')) {
        this.warnings.push(`${file}: Missing meta description`);
      } else {
        this.successes.push(`${file}: Has meta description`);
      }
      
      // 检查结构化数据
      if (!content.includes('application/ld+json')) {
        this.warnings.push(`${file}: Missing structured data`);
      } else {
        this.successes.push(`${file}: Has structured data`);
      }
      
      // 检查图片alt属性
      const imgTags = content.match(/<img[^>]*>/g) || [];
      for (const img of imgTags) {
        if (!img.includes('alt=')) {
          this.warnings.push(`${file}: Image missing alt attribute`);
        }
      }
      
      // 检查链接
      const links = content.match(/<a[^>]*href="([^"]*)"[^>]*>/g) || [];
      for (const link of links) {
        if (link.includes('href="#"') || link.includes('href="javascript:')) {
          this.warnings.push(`${file}: Empty or javascript link found`);
        }
      }
    }
  }

  async auditSitemap() {
    console.log(chalk.blue('🗺️  Auditing sitemap.xml...'));
    
    if (!await fs.pathExists('sitemap.xml')) {
      this.issues.push('sitemap.xml: File not found');
      return;
    }
    
    const sitemap = await fs.readFile('sitemap.xml', 'utf8');
    
    // 检查sitemap格式
    if (!sitemap.includes('<?xml version="1.0"')) {
      this.issues.push('sitemap.xml: Invalid XML format');
    } else {
      this.successes.push('sitemap.xml: Valid XML format');
    }
    
    // 检查URL数量
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    if (urlCount === 0) {
      this.issues.push('sitemap.xml: No URLs found');
    } else {
      this.successes.push(`sitemap.xml: Contains ${urlCount} URLs`);
    }
  }

  async auditRobots() {
    console.log(chalk.blue('🤖 Auditing robots.txt...'));
    
    if (!await fs.pathExists('robots.txt')) {
      this.issues.push('robots.txt: File not found');
      return;
    }
    
    const robots = await fs.readFile('robots.txt', 'utf8');
    
    if (!robots.includes('User-agent:')) {
      this.issues.push('robots.txt: Missing User-agent directive');
    } else {
      this.successes.push('robots.txt: Has User-agent directive');
    }
    
    if (!robots.includes('Sitemap:')) {
      this.warnings.push('robots.txt: Missing sitemap reference');
    } else {
      this.successes.push('robots.txt: Has sitemap reference');
    }
  }

  async auditLLMs() {
    console.log(chalk.blue('🤖 Auditing llms.txt...'));
    
    if (!await fs.pathExists('llms.txt')) {
      this.issues.push('llms.txt: File not found');
      return;
    }
    
    const llms = await fs.readFile('llms.txt', 'utf8');
    
    if (!llms.includes('tying.ai')) {
      this.warnings.push('llms.txt: Missing site name');
    } else {
      this.successes.push('llms.txt: Contains site name');
    }
    
    if (!llms.includes('https://')) {
      this.warnings.push('llms.txt: Missing URLs');
    } else {
      this.successes.push('llms.txt: Contains URLs');
    }
  }

  async auditPerformance() {
    console.log(chalk.blue('⚡ Auditing performance...'));
    
    const htmlFiles = glob.sync('**/*.html', { ignore: ['node_modules/**', 'dist/**', '.next/**'] });
    
    for (const file of htmlFiles) {
      const stats = await fs.stat(file);
      const sizeKB = stats.size / 1024;
      
      if (sizeKB > 500) {
        this.warnings.push(`${file}: Large file size (${sizeKB.toFixed(1)}KB)`);
      } else {
        this.successes.push(`${file}: Good file size (${sizeKB.toFixed(1)}KB)`);
      }
    }
  }

  generateReport() {
    console.log(chalk.yellow('\n📊 SEO Audit Report'));
    console.log(chalk.yellow('==================\n'));
    
    if (this.issues.length > 0) {
      console.log(chalk.red('❌ Critical Issues:'));
      this.issues.forEach(issue => console.log(chalk.red(`  - ${issue}`)));
      console.log('');
    }
    
    if (this.warnings.length > 0) {
      console.log(chalk.yellow('⚠️  Warnings:'));
      this.warnings.forEach(warning => console.log(chalk.yellow(`  - ${warning}`)));
      console.log('');
    }
    
    if (this.successes.length > 0) {
      console.log(chalk.green('✅ Successes:'));
      this.successes.forEach(success => console.log(chalk.green(`  - ${success}`)));
      console.log('');
    }
    
    const totalChecks = this.issues.length + this.warnings.length + this.successes.length;
    const successRate = ((this.successes.length / totalChecks) * 100).toFixed(1);
    
    console.log(chalk.blue(`📈 Overall Score: ${successRate}%`));
    console.log(chalk.blue(`📊 Total Checks: ${totalChecks}`));
    console.log(chalk.blue(`✅ Passed: ${this.successes.length}`));
    console.log(chalk.yellow(`⚠️  Warnings: ${this.warnings.length}`));
    console.log(chalk.red(`❌ Issues: ${this.issues.length}`));
  }

  async run() {
    try {
      console.log(chalk.yellow('🚀 Starting SEO audit...'));
      
      await this.auditHTMLFiles();
      await this.auditSitemap();
      await this.auditRobots();
      await this.auditLLMs();
      await this.auditPerformance();
      
      this.generateReport();
      
      if (this.issues.length > 0) {
        console.log(chalk.red('\n❌ Please fix the critical issues above.'));
        process.exit(1);
      } else {
        console.log(chalk.green('\n🎉 SEO audit completed successfully!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error during SEO audit:'), error);
      process.exit(1);
    }
  }
}

// 运行审计器
const auditor = new SEOAuditor();
auditor.run(); 