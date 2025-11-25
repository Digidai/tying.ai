/**
 * Zod schema for FundingCompany data validation
 * Used for validating company funding/investment data
 * Note: This is different from Company in types/index.ts which is for job-related company info
 */

import { z } from 'zod';

/**
 * Company funding round types
 * Matches formats like: "$10M · Seed", "$12.5M · Series A", "$100M · Venture"
 */
export const FundingRoundSchema = z
  .string()
  .regex(
    /^\$[\d.]+[KMB]?\s*·\s*(Pre-Seed|Seed|Series [A-E]|Venture|Bridge|Growth|IPO)$/,
    'Invalid funding round format. Expected format: "$XM · Round Type"',
  );

/**
 * URL validation with proper format
 */
export const UrlSchema = z.string().url('Must be a valid URL');

/**
 * Date validation - accepts both formats for flexibility
 */
export const DateSchema = z
  .string()
  .regex(
    /^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/,
    'Invalid date format. Expected format: "Nov 13, 2025"',
  );

/**
 * FundingCompany schema - validates all funding company data fields
 */
export const FundingCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  round: FundingRoundSchema,
  date: DateSchema,
  leadInvestor: z
    .string()
    .min(1, 'Lead investor is required')
    .max(100, 'Lead investor name too long'),
  website: UrlSchema,
  jobs: UrlSchema,
  news: UrlSchema,
});

/**
 * Array of funding companies schema
 */
export const FundingCompaniesArraySchema = z
  .array(FundingCompanySchema)
  .min(1, 'At least one company is required');

/**
 * Type inference from schema
 */
export type FundingCompany = z.infer<typeof FundingCompanySchema>;

/**
 * Validate a single funding company
 */
export function validateFundingCompany(data: unknown): FundingCompany {
  return FundingCompanySchema.parse(data);
}

/**
 * Validate an array of funding companies
 */
export function validateFundingCompanies(data: unknown): FundingCompany[] {
  return FundingCompaniesArraySchema.parse(data);
}

/**
 * Safe validation that returns result with errors
 */
export function safeValidateFundingCompany(data: unknown) {
  return FundingCompanySchema.safeParse(data);
}

/**
 * Safe validation for array
 */
export function safeValidateFundingCompanies(data: unknown) {
  return FundingCompaniesArraySchema.safeParse(data);
}
