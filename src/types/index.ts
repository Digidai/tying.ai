/**
 * 职位相关的类型定义
 */

export interface Position {
  id: string;
  title: string;
  company: string;
  location: string;
  type: PositionType;
  category: PositionCategory;
  experience: ExperienceLevel;
  salary?: SalaryRange;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  skills: string[];
  postedAt: Date;
  isActive: boolean;
  remote?: RemoteType;
  visa?: VisaSupport;
  tags: string[];
}

export interface PositionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: SalaryPeriod;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: CompanySize;
  location: string;
  website?: string;
  logo?: string;
  founded?: number;
  culture?: string[];
  benefits?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
}

// 枚举类型
export type PositionType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
export type SalaryPeriod = 'hourly' | 'monthly' | 'yearly';
export type RemoteType = 'on-site' | 'hybrid' | 'remote' | 'flexible';
export type VisaSupport = 'yes' | 'no' | 'potential';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type SkillCategory = 'technical' | 'soft' | 'language' | 'certification';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * 搜索和筛选相关类型
 */

export interface SearchFilters {
  keywords?: string;
  location?: string;
  type?: PositionType[];
  category?: string[];
  experience?: ExperienceLevel[];
  remote?: RemoteType[];
  salaryMin?: number;
  salaryMax?: number;
  company?: string[];
  skills?: string[];
  datePosted?: DateRange;
  visa?: VisaSupport;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface SearchResult {
  positions: Position[];
  total: number;
  page: number;
  pageSize: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  categories: CategoryFacet[];
  companies: CompanyFacet[];
  locations: LocationFacet[];
  skills: SkillFacet[];
}

export interface CategoryFacet {
  id: string;
  name: string;
  count: number;
}

export interface CompanyFacet {
  id: string;
  name: string;
  count: number;
}

export interface LocationFacet {
  id: string;
  name: string;
  count: number;
}

export interface SkillFacet {
  id: string;
  name: string;
  count: number;
}

/**
 * 用户相关类型
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  savedPositions: string[];
  applications: Application[];
  profile?: UserProfile;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  search: SearchPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  newMatches: boolean;
  applicationUpdates: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  shareProfile: boolean;
  allowContact: boolean;
}

export interface SearchPreferences {
  defaultLocation?: string;
  defaultRemoteType?: RemoteType;
  savedSearches: SavedSearch[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
  lastRun?: Date;
}

export interface UserProfile {
  title?: string;
  experience?: ExperienceLevel;
  skills: string[];
  location?: string;
  remotePreference?: RemoteType;
  salaryExpectation?: SalaryRange;
  about?: string;
  resume?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface Application {
  id: string;
  positionId: string;
  companyId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  notes?: string;
  resume?: string;
  coverLetter?: string;
}

export type ApplicationStatus = 'draft' | 'submitted' | 'viewed' | 'responded' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

/**
 * API 响应类型
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

/**
 * 内容管理类型
 */

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  type: ContentPageType;
  category?: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  author?: string;
  seo?: SEOData;
}

export type ContentPageType = 'guide' | 'wiki' | 'blog' | 'report' | 'help' | 'about';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

/**
 * 表单和数据提交类型
 */

export interface NewsletterSubscription {
  email: string;
  interests: string[];
  source?: string;
  timestamp?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptcha?: string;
}

export interface FeedbackForm {
  type: FeedbackType;
  rating: number;
  comment?: string;
  email?: string;
  userAgent?: string;
}

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'general';
