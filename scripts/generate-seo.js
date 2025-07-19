#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// 配置
const CONFIG = {
  baseUrl: 'https://tying.ai',
  outputDir: '.',
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

class SEOGenerator {
  constructor() {
    this.pages = [];
    this.categories = new Map();
  }

  async scanPages() {
    console.log(chalk.blue('🔍 Scanning pages...'));
    
    // 扫描HTML文件
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
      
      this.pages.push({
        url,
        lastmod,
        changefreq,
        priority
      });
    }
    
    console.log(chalk.green(`✅ Found ${this.pages.length} pages`));
  }

  async generateSitemap() {
    console.log(chalk.blue('🗺️  Generating sitemap.xml...'));
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const page of this.pages) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${page.url}</loc>\n`;
      sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    }
    
    sitemap += '</urlset>';
    
    await fs.writeFile('sitemap.xml', sitemap);
    console.log(chalk.green('✅ Sitemap generated successfully'));
  }

  async generateRobots() {
    console.log(chalk.blue('🤖 Generating robots.txt...'));
    
    const robots = `User-agent: *
Allow: /

# Block access to private directories
Disallow: /node_modules/
Disallow: /.next/
Disallow: /dist/
Disallow: /.git/
Disallow: /scripts/

# Sitemap
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
    
    await fs.writeFile('robots.txt', robots);
    console.log(chalk.green('✅ Robots.txt generated successfully'));
  }

  async generateLLMs() {
    console.log(chalk.blue('🤖 Generating llms.txt...'));
    
    const llmsContent = `# Tying.ai - AI Career Intelligence Platform

> Smart AI platform providing comprehensive career intelligence, market analysis, and professional development resources for the AI and technology industry.

## About Tying.ai

Tying.ai is a specialized AI-powered platform that delivers in-depth career intelligence and market insights for professionals in artificial intelligence, software engineering, and emerging technology roles. We provide data-driven analysis, career guidance, and industry trends to help individuals and organizations navigate the rapidly evolving AI job market.

## Core Content Areas

### AI Career Intelligence
- **AI Software Engineer Career Guide** (/careers/tech/software-engineer/): Comprehensive encyclopedia covering responsibilities, skills, tools, education pathways, salary trends ($206K average), and future outlook for AI software engineers
- **AI Product Manager Guide** (/careers/tech/ai-product-manager/): Career guidance for AI product management roles
- **Product Manager Positions** (/careers/tech/product-manager/): Career guidance for product management roles in AI companies

### Market Research & Analysis
- **US Recruitment Market Report 2024-2025** (/reports/market/us-recruitment-market/): Comprehensive analysis of American job market trends, unemployment rates (4.1%), wage growth (4.0%), industry divergence, technology impact, and demographic employment patterns
- **Agentic AI vs AI Agent Analysis** (/reports/market/agentic-ai-vs-ai-agent/): Technical comparison and market analysis of AI agent technologies

### Career Categories
- **Engineering Careers** (/careers/engineering/): Aerospace, civil, electrical, mechanical, and other engineering roles
- **Arts & Design Careers** (/careers/arts/): Creative professionals, designers, and entertainment industry roles
- **Business Careers** (/careers/business/): Finance, marketing, HR, and business operations roles
- **Technology Careers** (/careers/tech/): Software development, AI, data science, and IT roles
- **Other Professional Roles** (/careers/other/): Healthcare, social services, and specialized professional roles

## Key Data Points & Insights

### Salary Intelligence
- AI Software Engineers: $206,000 average salary (2025)
- Entry level (0-1 year): ~$143,000
- Senior level (10+ years): $269,000+
- 17% projected growth rate for software developers (2023-2033)

### Market Trends
- 92% of US developers use AI coding tools
- $24.9B projected AI in DevOps market by 2033
- 78 million jobs expected to be impacted by AI by 2030
- 4.1% average unemployment rate forecast for 2024-2025

### Industry Analysis
- Healthcare sector: 6.8% growth in 2024, 7.2% projected for 2025
- Government sector: 4.3% growth in 2024
- Manufacturing: -0.5% decline in 2024, -0.8% projected for 2025
- Technology sector facing structural adjustments with AI/data science demand remaining strong

## Technology Focus Areas

### AI/ML Technologies
- Machine Learning frameworks: TensorFlow, PyTorch, Keras
- Programming languages: Python, R, Java, C++
- Cloud platforms: AWS, Azure, Google Cloud
- Data technologies: Apache Spark, Hadoop, MongoDB
- DevOps/MLOps: Docker, Kubernetes, MLflow

### Emerging Roles
- Generative AI Engineer
- Prompt Engineer
- AI Ethics Officer
- MLOps Specialist
- Computer Vision Engineer

## Educational Resources

### Certification Programs
- Microsoft Azure AI Engineer Associate
- IBM Applied AI Professional Certificate
- Stanford AI Graduate Certificate
- MIT Machine Learning Certificate
- Artificial Intelligence Board of America (AIE™)

### Skill Development
- Technical skills: Programming, data modeling, machine learning algorithms
- Soft skills: Communication, collaboration, critical thinking
- Domain expertise: Industry-specific AI applications
- Continuous learning: Staying current with AI trends and tools

## Contact & Access

- **Website**: ${CONFIG.baseUrl}
- **Platform Status**: Active with comprehensive career intelligence content
- **Content Areas**: Career intelligence, market analysis, educational resources
- **Target Audience**: AI professionals, job seekers, hiring managers, industry analysts

## Content Quality & Sources

All content is research-backed with citations from:
- US Bureau of Labor Statistics
- Industry salary surveys and reports
- Federal Reserve economic data
- Technology industry analysis
- Academic and professional sources

## Usage Guidelines

This platform is designed for:
- Career planning and development in AI fields
- Market research and competitive intelligence
- Educational content for AI skill development
- Industry trend analysis and forecasting
- Recruitment and talent acquisition insights

## Technical Implementation

- Responsive web design with mobile optimization
- SEO-optimized content with structured data markup
- Interactive data visualizations and charts
- Progressive web app features
- Content management system for regular updates

## Site Structure

### Main Pages
- Homepage: ${CONFIG.baseUrl}/
- About: ${CONFIG.baseUrl}/about/
- Careers Overview: ${CONFIG.baseUrl}/careers/

### Career Categories
- Engineering: ${CONFIG.baseUrl}/careers/engineering/
- Arts & Design: ${CONFIG.baseUrl}/careers/arts/
- Business: ${CONFIG.baseUrl}/careers/business/
- Technology: ${CONFIG.baseUrl}/careers/tech/
- Other: ${CONFIG.baseUrl}/careers/other/

### Reports & Analysis
- Market Reports: ${CONFIG.baseUrl}/reports/market/
- Employment Analysis: ${CONFIG.baseUrl}/reports/market/us-recruitment-market/

---

*Generated by Tying.ai | Last updated: ${new Date().toISOString().split('T')[0]}*`;
    
    await fs.writeFile('llms.txt', llmsContent);
    console.log(chalk.green('✅ LLMs.txt generated successfully'));
  }

  async generateStructuredData() {
    console.log(chalk.blue('📊 Generating structured data...'));
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tying.ai",
      "url": CONFIG.baseUrl,
      "description": "AI Career Intelligence Platform providing comprehensive career guidance and market analysis",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${CONFIG.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Tying.ai",
        "url": CONFIG.baseUrl
      }
    };
    
    await fs.writeFile('structured-data.json', JSON.stringify(structuredData, null, 2));
    console.log(chalk.green('✅ Structured data generated successfully'));
  }

  async run() {
    try {
      console.log(chalk.yellow('🚀 Starting SEO generation...'));
      
      await this.scanPages();
      await this.generateSitemap();
      await this.generateRobots();
      await this.generateLLMs();
      await this.generateStructuredData();
      
      console.log(chalk.green('🎉 SEO generation completed successfully!'));
    } catch (error) {
      console.error(chalk.red('❌ Error during SEO generation:'), error);
      process.exit(1);
    }
  }
}

// 运行生成器
const generator = new SEOGenerator();
generator.run(); 