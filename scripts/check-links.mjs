import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

const checkUrl = (url) => {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('http')) {
            resolve({ url, status: 'SKIPPED' });
            return;
        }
        const client = url.startsWith('https') ? https : http;
        const req = client.request(url, { method: 'HEAD', timeout: 5000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            resolve({ url, status: res.statusCode });
        });
        req.on('error', (e) => resolve({ url, status: 'ERROR: ' + e.message }));
        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 'TIMEOUT' });
        });
        req.end();
    });
};

const checkAll = async () => {
    console.log('Reading companies.ts...');
    const content = fs.readFileSync(path.join(process.cwd(), 'src/data/companies.ts'), 'utf-8');

    // Regex to extract objects. This is a simple approximation.
    // We look for name: '...' and website: '...'
    const companyRegex = /name:\s*'([^']+)'.*?website:\s*'([^']+)'/gs;

    let match;
    const companies = [];
    while ((match = companyRegex.exec(content)) !== null) {
        companies.push({ name: match[1], website: match[2] });
    }

    console.log(`Found ${companies.length} companies. Checking links...`);

    const results = [];
    // Process in chunks of 10 to avoid overwhelming network
    const chunkSize = 10;
    for (let i = 0; i < companies.length; i += chunkSize) {
        const chunk = companies.slice(i, i + chunkSize);
        const promises = chunk.map(async (company) => {
            const res = await checkUrl(company.website);
            if (res.status !== 200 && res.status !== 301 && res.status !== 302 && res.status !== 403) { // 403 often means bot protection, not broken
                console.log(`[${res.status}] ${company.name}: ${company.website}`);
                results.push({ name: company.name, url: company.website, status: res.status });
            }
        });
        await Promise.all(promises);
    }

    console.log(`Found ${results.length} potentially broken links.`);
    if (results.length > 0) {
        console.log(JSON.stringify(results, null, 2));
    }
};

checkAll();
