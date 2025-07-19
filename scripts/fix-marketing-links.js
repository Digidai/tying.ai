#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

console.log('🔧 Fixing marketing page links...');

const filePath = path.join(__dirname, '../public/careers/business/marketing/index.html');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  let modified = false;

  // 移除所有空的JavaScript链接
  $('a[href="javascript:void(0)"], a[href="javascript:;"], a[href="#"]').each(function() {
    const $link = $(this);
    const text = $link.text().trim();
    
    // 如果链接没有文本内容，直接移除
    if (!text) {
      $link.remove();
      modified = true;
    } else {
      // 如果有文本内容，替换为适当的链接
      const linkText = text.toLowerCase();
      let newHref = '#';
      
      // 根据链接文本设置适当的href
      if (linkText.includes('privacy')) {
        newHref = '/privacy';
      } else if (linkText.includes('terms')) {
        newHref = '/terms';
      } else if (linkText.includes('contact')) {
        newHref = '/contact';
      } else if (linkText.includes('about')) {
        newHref = '/about';
      } else if (linkText.includes('github')) {
        newHref = 'https://github.com/tying-ai';
      } else if (linkText.includes('linkedin')) {
        newHref = 'https://linkedin.com/company/tying-ai';
      } else if (linkText.includes('twitter')) {
        newHref = 'https://twitter.com/tying_ai';
      } else if (linkText.includes('facebook')) {
        newHref = 'https://facebook.com/tying.ai';
      } else if (linkText.includes('instagram')) {
        newHref = 'https://instagram.com/tying.ai';
      } else {
        // 对于其他链接，使用锚点链接
        newHref = `#${linkText.replace(/\s+/g, '-')}`;
      }
      
      $link.attr('href', newHref);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, $.html());
    console.log('✅ Fixed marketing page links');
  } else {
    console.log('ℹ️  No links to fix in marketing page');
  }

} catch (error) {
  console.error('❌ Error fixing marketing page:', error.message);
} 