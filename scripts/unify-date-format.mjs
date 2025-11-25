#!/usr/bin/env node

/**
 * Script to unify date format in companies.ts
 * Converts "DD-MMM-YY" to "MMM DD, YYYY" format for clarity
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const companiesPath = join(__dirname, '../src/data/companies.ts');

// Month mapping for conversion
const monthMap = {
  Jan: 'Jan',
  Feb: 'Feb',
  Mar: 'Mar',
  Apr: 'Apr',
  May: 'May',
  Jun: 'Jun',
  Jul: 'Jul',
  Aug: 'Aug',
  Sep: 'Sep',
  Oct: 'Oct',
  Nov: 'Nov',
  Dec: 'Dec',
};

/**
 * Convert date from "DD-MMM-YY" to "MMM DD, YYYY"
 * @param {string} dateStr - Date in format "13-Nov-25"
 * @returns {string} Date in format "Nov 13, 2025"
 */
function convertDate(dateStr) {
  // Match pattern: DD-MMM-YY
  const match = dateStr.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
  if (!match) {
    console.warn(`⚠️  Could not parse date: ${dateStr}`);
    return dateStr;
  }

  const [, day, month, year] = match;

  // Convert 2-digit year to 4-digit (assuming 20XX)
  const fullYear = `20${year}`;

  // Remove leading zero from day if present
  const numDay = parseInt(day, 10);

  return `${monthMap[month]} ${numDay}, ${fullYear}`;
}

console.log('🔄 Starting date format conversion...\n');

// Read the file
let content = readFileSync(companiesPath, 'utf-8');
const originalContent = content;

// Find all date strings in format "DD-MMM-YY"
const datePattern = /"date":\s*"(\d{1,2}-[A-Za-z]{3}-\d{2})"/g;
let matches = [...content.matchAll(datePattern)];

console.log(`Found ${matches.length} dates to convert\n`);

// Track conversions
const conversions = new Map();
let converted = 0;

// Replace all dates
matches.forEach(match => {
  const oldDate = match[1];
  const newDate = convertDate(oldDate);

  if (newDate !== oldDate) {
    content = content.replace(`"date": "${oldDate}"`, `"date": "${newDate}"`);
    conversions.set(oldDate, newDate);
    converted++;
  }
});

// Show sample conversions
console.log('Sample conversions:');
let sampleCount = 0;
for (const [oldDate, newDate] of conversions) {
  if (sampleCount < 5) {
    console.log(`  ${oldDate} → ${newDate}`);
    sampleCount++;
  }
}
if (conversions.size > 5) {
  console.log(`  ... and ${conversions.size - 5} more`);
}

console.log(`\n✅ Converted ${converted} dates`);

// Write back to file
if (content !== originalContent) {
  writeFileSync(companiesPath, content, 'utf-8');
  console.log(`\n📝 Updated ${companiesPath}`);
  console.log('\nFormat change: "DD-MMM-YY" → "MMM DD, YYYY"');
  console.log('Example: "13-Nov-25" → "Nov 13, 2025"');
} else {
  console.log('\n⚠️  No changes needed');
}

console.log('\n✨ Done!');
