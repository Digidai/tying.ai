const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 递归查找所有HTML文件
function findHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            findHtmlFiles(fullPath, files);
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// 修复单个HTML文件的路径
function fixHtmlFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        let modified = false;
        
        // 修复CSS路径
        $('link[rel="stylesheet"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.startsWith('/') && !href.startsWith('http')) {
                // 计算相对路径到根目录的绝对路径
                const relativePath = path.relative(path.dirname(filePath), 'public');
                const newHref = href.replace(/^(\.\.\/)*/, '/');
                $(el).attr('href', newHref);
                console.log(`  Fixed CSS: ${href} -> ${newHref}`);
                modified = true;
            }
        });
        
        // 修复JS路径
        $('script[src]').each((i, el) => {
            const src = $(el).attr('src');
            if (src && !src.startsWith('/') && !src.startsWith('http')) {
                const newSrc = src.replace(/^(\.\.\/)*/, '/');
                $(el).attr('src', newSrc);
                console.log(`  Fixed JS: ${src} -> ${newSrc}`);
                modified = true;
            }
        });
        
        // 修复favicon路径
        $('link[rel="icon"], link[rel="shortcut icon"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.startsWith('/') && !href.startsWith('http')) {
                const newHref = href.replace(/^(\.\.\/)*/, '/');
                $(el).attr('href', newHref);
                console.log(`  Fixed favicon: ${href} -> ${newHref}`);
                modified = true;
            }
        });
        
        // 修复图片路径（logo等）
        $('img[src]').each((i, el) => {
            const src = $(el).attr('src');
            if (src && !src.startsWith('/') && !src.startsWith('http') && !src.startsWith('data:')) {
                const newSrc = src.replace(/^(\.\.\/)*/, '/');
                $(el).attr('src', newSrc);
                console.log(`  Fixed image: ${src} -> ${newSrc}`);
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, $.html());
            console.log(`  ✅ Updated: ${filePath}`);
        } else {
            console.log(`  ⏭️  No changes needed: ${filePath}`);
        }
        
    } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
    }
}

// 主函数
function main() {
    console.log('🔧 Starting path fix for all HTML files...\n');
    
    const publicDir = path.join(__dirname, '..', 'public');
    const htmlFiles = findHtmlFiles(publicDir);
    
    console.log(`📁 Found ${htmlFiles.length} HTML files to process\n`);
    
    let processed = 0;
    let updated = 0;
    
    for (const file of htmlFiles) {
        const originalContent = fs.readFileSync(file, 'utf8');
        fixHtmlFile(file);
        
        const newContent = fs.readFileSync(file, 'utf8');
        if (originalContent !== newContent) {
            updated++;
        }
        processed++;
    }
    
    console.log(`\n🎉 Path fix completed!`);
    console.log(`📊 Processed: ${processed} files`);
    console.log(`✅ Updated: ${updated} files`);
}

if (require.main === module) {
    main();
}

module.exports = { findHtmlFiles, fixHtmlFile }; 