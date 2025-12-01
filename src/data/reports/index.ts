/**
 * Report metadata and content registry
 */

export interface ReportMetadata {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
}

export const reports: ReportMetadata[] = [
  {
    slug: 'us-recruitment-market',
    title: 'US Recruitment Market Analysis',
    subtitle:
      'A Comprehensive Study of Labor Market Dynamics, Talent Acquisition Trends, and Future Workforce Implications',
    date: 'November 13, 2025',
    category: 'Recruitment & Labor Economics',
  },
  {
    slug: 'agentic-ai-vs-ai-agent',
    title: 'Agentic AI vs AI Agent: Understanding the Difference',
    subtitle:
      'A Comprehensive Analysis of Architectural Paradigms, Implementation Strategies, and Future Trajectories in Autonomous AI Systems',
    date: 'November 13, 2025',
    category: 'AI Research & Engineering',
  },
  {
    slug: 'ai-recruitment',
    title: 'AI in Recruitment: Transforming Talent Acquisition',
    subtitle:
      'A Comprehensive Analysis of AI-Powered Recruitment Technologies, Implementation Strategies, Ethical Considerations, and Future Impact on Hiring',
    date: 'January 10, 2025',
    category: 'AI & HR Technology',
  },
  {
    slug: 'us-product-manager-market',
    title: 'US Product Manager Market Analysis 2025',
    subtitle:
      'A Comprehensive Study of Market Dynamics, Compensation Trends, Skill Evolution, and the Future of Product Management in the AI Era',
    date: 'December 1, 2025',
    category: 'Career & Product Management',
  },
];

/**
 * Get report metadata by slug
 */
export function getReportBySlug(slug: string): ReportMetadata | undefined {
  return reports.find(r => r.slug === slug);
}

/**
 * Get all report slugs for static path generation
 */
export function getReportSlugs(): string[] {
  return reports.map(r => r.slug);
}
