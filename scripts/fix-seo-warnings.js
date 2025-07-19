#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

console.log('🔧 Starting SEO warnings fix...');

// 定义职业分类和描述
const careerCategories = {
  'tech': {
    name: 'Technology',
    description: 'Careers in software development, AI, data science, cybersecurity, and technology management.'
  },
  'business': {
    name: 'Business',
    description: 'Careers in finance, management, human resources, marketing, and business operations.'
  },
  'design': {
    name: 'Design',
    description: 'Careers in graphic design, industrial design, fashion design, and creative arts.'
  },
  'arts': {
    name: 'Arts & Entertainment',
    description: 'Careers in performing arts, media production, music, and entertainment.'
  },
  'engineering': {
    name: 'Engineering',
    description: 'Careers in civil, mechanical, electrical, and other engineering disciplines.'
  },
  'other': {
    name: 'Other Fields',
    description: 'Careers in healthcare, education, social services, and other specialized fields.'
  }
};

// 职业描述模板
const careerDescriptions = {
  'software-engineer': 'Comprehensive guide to software engineering careers, including skills, salary ranges, and career progression paths.',
  'product-manager': 'Detailed guide to product management careers, covering responsibilities, skills, and career advancement opportunities.',
  'ai-product-manager': 'Specialized guide for AI product management careers, including unique challenges and emerging opportunities.',
  'computer-programmers': 'Career guide for computer programmers, including programming languages, development methodologies, and career paths.',
  'web-developers': 'Comprehensive guide to web development careers, covering front-end, back-end, and full-stack development.',
  'data-scientists': 'Career guide for data scientists, including machine learning, statistical analysis, and data engineering.',
  'ai-engineers': 'Specialized guide for AI engineering careers, covering machine learning, deep learning, and AI system development.',
  'financial-analysts': 'Career guide for financial analysts, including investment analysis, risk assessment, and financial planning.',
  'marketing-managers': 'Comprehensive guide to marketing management careers, covering digital marketing, brand management, and market research.',
  'graphic-designers': 'Career guide for graphic designers, including visual design, branding, and creative direction.',
  'interior-designers': 'Comprehensive guide to interior design careers, covering residential, commercial, and sustainable design.',
  'civil-engineers': 'Career guide for civil engineers, including structural design, infrastructure development, and project management.',
  'mechanical-engineers': 'Comprehensive guide to mechanical engineering careers, covering product design, manufacturing, and systems engineering.',
  'electrical-engineers': 'Career guide for electrical engineers, including power systems, electronics, and control systems.',
  'social-workers': 'Comprehensive guide to social work careers, including counseling, community development, and advocacy.',
  'healthcare-workers': 'Career guide for healthcare professionals, including nursing, therapy, and medical support roles.',
  'teachers': 'Comprehensive guide to teaching careers, including education levels, specializations, and career advancement.',
  'accountants': 'Career guide for accounting professionals, including financial reporting, auditing, and tax preparation.',
  'managers': 'Comprehensive guide to management careers, including leadership, strategic planning, and team development.',
  'consultants': 'Career guide for consulting professionals, including business strategy, technology consulting, and advisory services.'
};

// 生成结构化数据
function generateStructuredData(pageType, title, description, url, additionalData = {}) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Tying.ai",
      "url": "https://tying.ai"
    }
  };

  if (pageType === 'career') {
    baseData["@type"] = "JobPosting";
    baseData.occupationalCategory = additionalData.category || "Technology";
    baseData.employmentType = "FULL_TIME";
    baseData.qualifications = additionalData.qualifications || "Bachelor's degree or equivalent experience";
    baseData.experienceRequirements = additionalData.experience || "Entry level to senior positions available";
  }

  if (additionalData.itemListElement) {
    baseData.mainEntity = {
      "@type": "ItemList",
      "itemListElement": additionalData.itemListElement
    };
  }

  return JSON.stringify(baseData, null, 2);
}

// 修复单个HTML文件
function fixHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    let modified = false;

    // 检查是否已有meta description
    const existingMetaDesc = $('meta[name="description"]');
    if (existingMetaDesc.length === 0) {
      // 根据文件路径生成描述
      const fileName = path.basename(filePath, '.html');
      const fileDir = path.dirname(filePath);
      
      let description = '';
      if (fileName === 'index') {
        const category = fileDir.split('/').pop();
        if (careerCategories[category]) {
          description = `Explore ${careerCategories[category].name.toLowerCase()} careers. ${careerCategories[category].description}`;
        } else {
          description = 'Explore comprehensive career guides and job information.';
        }
      } else {
        // 从文件名生成描述
        const careerKey = fileName.replace(/[0-9-]/g, '').replace(/\./g, '-');
        if (careerDescriptions[careerKey]) {
          description = careerDescriptions[careerKey];
        } else {
          description = `Comprehensive career guide for ${fileName.replace(/[0-9-]/g, ' ').trim()}. Learn about job requirements, skills, and career paths.`;
        }
      }

      // 添加meta description
      $('head').append(`<meta name="description" content="${description}">`);
      modified = true;
    }

    // 检查是否已有结构化数据
    const existingStructuredData = $('script[type="application/ld+json"]');
    if (existingStructuredData.length === 0) {
      // 生成结构化数据
      const fileName = path.basename(filePath, '.html');
      const fileDir = path.dirname(filePath);
      const relativePath = path.relative('public', filePath);
      const url = `https://tying.ai/${relativePath}`;
      
      let title = $('title').text() || 'Career Guide';
      let description = $('meta[name="description"]').attr('content') || 'Comprehensive career guide and job information.';
      
      const structuredData = generateStructuredData('page', title, description, url);
      $('head').append(`<script type="application/ld+json">\n${structuredData}\n</script>`);
      modified = true;
    }

    // 移除空的JavaScript链接
    $('a[href="javascript:void(0)"], a[href="javascript:;"], a[href="#"]').each(function() {
      const $link = $(this);
      const text = $link.text().trim();
      if (!text) {
        $link.remove();
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, $.html());
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// 递归处理目录
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let fixedCount = 0;

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixedCount += processDirectory(fullPath);
    } else if (item.endsWith('.html')) {
      if (fixHtmlFile(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

// 主函数
function main() {
  const publicDir = path.join(__dirname, '../public');
  
  if (!fs.existsSync(publicDir)) {
    console.error('❌ Public directory not found');
    process.exit(1);
  }

  console.log('🔍 Scanning HTML files...');
  const fixedCount = processDirectory(publicDir);
  
  console.log(`\n🎉 SEO warnings fix completed!`);
  console.log(`✅ Fixed ${fixedCount} files`);
  console.log(`📊 Estimated warnings reduced by: ${fixedCount * 2} (meta descriptions + structured data)`);
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { fixHtmlFile, processDirectory }; 