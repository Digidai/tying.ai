import fs from 'fs';
import path from 'path';

const positions = [
  'software-engineer',
  'data-scientist',
  'devops-engineer',
  'product-manager',
  'ux-designer',
  'technical-writer',
  'marketing-manager',
  'financial-analyst',
  'business-consultant',
  'graphic-designer',
  'content-writer',
  'video-editor',
  'registered-nurse',
  'medical-doctor',
  'pharmacist',
  'teacher',
  'professor',
  'training-specialist',
  'lawyer',
  'paralegal',
  'compliance-officer',
  'sales-manager',
  'account-executive',
  'customer-success-manager',
  'operations-manager',
  'supply-chain-analyst',
  'project-manager',
];

const outputDir = 'public/icons/wiki';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to generate a consistent SVG with initials or a simple shape
function generateSvg(slug) {
  const words = slug.split('-');
  const initials = words.map(w => w[0].toUpperCase()).join('');
  const color1 = '#37352f'; // Notion text color
  const color2 = '#e3e2e0'; // Notion gray background

  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${color2}" />
  <text x="50%" y="55%" font-family="Inter, sans-serif" font-weight="600" font-size="24" fill="${color1}" text-anchor="middle" dominant-baseline="middle">
    ${initials}
  </text>
</svg>`;
}

positions.forEach(slug => {
  const svgContent = generateSvg(slug);
  const filePath = path.join(outputDir, `${slug}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated ${slug}.svg`);
});

console.log('All icons generated successfully!');
