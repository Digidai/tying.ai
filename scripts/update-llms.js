#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');

const CONFIG = {
  baseUrl: 'https://tying.ai'
};

async function updateLLMs() {
  try {
    console.log(chalk.blue('🤖 Updating llms.txt...'));
    
    const llmsContent = `# Tying.ai - AI Career Intelligence Platform

> Smart AI platform providing comprehensive career intelligence, market analysis, and professional development resources for the AI and technology industry.

## About Tying.ai

Tying.ai is a specialized AI-powered platform that delivers in-depth career intelligence and market insights for professionals in artificial intelligence, software engineering, and emerging technology roles. We provide data-driven analysis, career guidance, and industry trends to help individuals and organizations navigate the rapidly evolving AI job market.

## Core Content Areas

### AI Career Intelligence
- **AI Software Engineer Career Guide** (${CONFIG.baseUrl}/careers/tech/software-engineer/): Comprehensive encyclopedia covering responsibilities, skills, tools, education pathways, salary trends ($206K average), and future outlook for AI software engineers
- **AI Product Manager Guide** (${CONFIG.baseUrl}/careers/tech/ai-product-manager/): Career guidance for AI product management roles
- **Product Manager Positions** (${CONFIG.baseUrl}/careers/tech/product-manager/): Career guidance for product management roles in AI companies

### Market Research & Analysis
- **US Recruitment Market Report 2024-2025** (${CONFIG.baseUrl}/reports/market/us-recruitment-market/): Comprehensive analysis of American job market trends, unemployment rates (4.1%), wage growth (4.0%), industry divergence, technology impact, and demographic employment patterns
- **Agentic AI vs AI Agent Analysis** (${CONFIG.baseUrl}/reports/market/agentic-ai-vs-ai-agent/): Technical comparison and market analysis of AI agent technologies

### Career Categories
- **Engineering Careers** (${CONFIG.baseUrl}/careers/engineering/): Aerospace, civil, electrical, mechanical, and other engineering roles
- **Arts & Design Careers** (${CONFIG.baseUrl}/careers/arts/): Creative professionals, designers, and entertainment industry roles
- **Business Careers** (${CONFIG.baseUrl}/careers/business/): Finance, marketing, HR, and business operations roles
- **Technology Careers** (${CONFIG.baseUrl}/careers/tech/): Software development, AI, data science, and IT roles
- **Other Professional Roles** (${CONFIG.baseUrl}/careers/other/): Healthcare, social services, and specialized professional roles

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

## SEO & Technical Information

### Search Engine Optimization
- Comprehensive sitemap.xml with all pages
- Robots.txt with proper crawling directives
- Structured data markup for better search visibility
- Mobile-optimized responsive design
- Fast loading times and performance optimization

### Content Management
- Automated SEO generation system
- Regular content updates and maintenance
- Quality assurance and SEO auditing
- Performance monitoring and optimization

---

*Generated by Tying.ai | Last updated: ${new Date().toISOString().split('T')[0]}*`;
    
    await fs.writeFile('llms.txt', llmsContent);
    console.log(chalk.green('✅ LLMs.txt updated successfully'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error updating llms.txt:'), error);
    process.exit(1);
  }
}

updateLLMs(); 