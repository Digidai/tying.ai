/**
 * Zod schema for Report data validation
 */

import { z } from 'zod';

/**
 * Report metadata schema
 */
export const ReportSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subtitle: z.string().min(1, 'Subtitle is required').max(500, 'Subtitle too long'),
  date: z
    .string()
    .regex(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/, 'Invalid date format. Expected: "Month DD, YYYY"'),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
});

/**
 * Type inference from schema
 */
export type Report = z.infer<typeof ReportSchema>;

/**
 * Validate a single report
 */
export function validateReport(data: unknown): Report {
  return ReportSchema.parse(data);
}

/**
 * Safe validation that returns result with errors
 */
export function safeValidateReport(data: unknown) {
  return ReportSchema.safeParse(data);
}
