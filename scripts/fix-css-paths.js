#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing CSS paths in HTML files...');

// 查找所有HTML文件
const htmlFiles = glob.sync('public/**/*.html');

let fixedCount = 0;

htmlFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 修复CSS路径
    let newContent = content.replace(
      /href="\.\.\/\.\.\/assets\/css\/design-system\.css"/g,
      'href="/assets/css/design-system.css"'
    );
    
    // 修复JS路径
    newContent = newContent.replace(
      /src="\.\.\/\.\.\/assets\/js\/components\.js"/g,
      'src="/assets/js/components.js"'
    );
    
    // 修复favicon路径
    newContent = newContent.replace(
      /href="\.\.\/\.\.\/favicon\.ico"/g,
      'href="/favicon.ico"'
    );
    
    // 修复logo路径
    newContent = newContent.replace(
      /src="\.\.\/\.\.\/klein_blue_square\.svg"/g,
      'src="/klein_blue_square.svg"'
    );
    
    // 检查是否有变化
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      modified = true;
      fixedCount++;
      console.log(`✅ Fixed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files`);
console.log('✅ All CSS paths have been updated to use absolute paths'); 