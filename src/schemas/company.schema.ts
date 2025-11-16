/**
 * Zod schema for Company data validation
 * Ensures data integrity and type safety at runtime
 */

import { z } from 'zod';

/**
 * Company funding round types
 * Matches formats like: "$10M · Seed", "$12.5M · Series A", "$100M · Venture"
 */
export const FundingRoundSchema = z.string().regex(
  /^\$[\d.]+[KMB]?\s*·\s*(Pre-Seed|Seed|Series [A-E]|Venture|Bridge|Growth|IPO)$/,
  'Invalid funding round format. Expected format: "$XM · Round Type"'
);

/**
 * URL validation with proper format
 */
export const UrlSchema = z.string().url('Must be a valid URL');

/**
 * Date validation - accepts both formats for flexibility
 */
export const DateSchema = z.string().regex(
  /^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/,
  'Invalid date format. Expected format: "Nov 13, 2025"'
);

/**
 * Company schema - validates all company data fields
 */
export const CompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  round: FundingRoundSchema,
  date: DateSchema,
  leadInvestor: z.string().min(1, 'Lead investor is required').max(100, 'Lead investor name too long'),
  website: UrlSchema,
  jobs: UrlSchema,
  news: UrlSchema,
});

/**
 * Array of companies schema
 */
export const CompaniesArraySchema = z.array(CompanySchema).min(1, 'At least one company is required');

/**
 * Type inference from schema
 */
export type Company = z.infer<typeof CompanySchema>;

/**
 * Validate a single company
 */
export function validateCompany(data: unknown): Company {
  return CompanySchema.parse(data);
}

/**
 * Validate an array of companies
 */
export function validateCompanies(data: unknown): Company[] {
  return CompaniesArraySchema.parse(data);
}

/**
 * Safe validation that returns result with errors
 */
export function safeValidateCompany(data: unknown) {
  return CompanySchema.safeParse(data);
}

/**
 * Safe validation for array
 */
export function safeValidateCompanies(data: unknown) {
  return CompaniesArraySchema.safeParse(data);
}
