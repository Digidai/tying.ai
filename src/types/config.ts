/**
 * 应用配置类型定义
 */

export interface AppConfig {
  /** 环境：development 或 production */
  environment: 'development' | 'production';

  /** 是否为调试模式 */
  debug: boolean;

  /** 应用版本 */
  version: string;

  /** API端点 */
  apiEndpoint: string;

  /** Google Analytics ID */
  googleAnalyticsId: string;

  /** 是否启用分析 */
  enableAnalytics: boolean;

  /** 是否启用性能监控 */
  enablePerformanceMonitoring: boolean;

  /** 是否启用错误报告 */
  enableErrorReporting: boolean;

  /** 是否启用主题切换 */
  enableThemeToggle: boolean;

  /** 是否启用搜索建议 */
  enableSearchSuggestions: boolean;

  /** 是否启用懒加载 */
  enableLazyLoading: boolean;

  /** 是否启用动画 */
  enableAnimations: boolean;

  /** 是否减少动画 */
  reducedMotion: boolean;
}

export interface ThemeConfig {
  /** 默认主题 */
  defaultTheme: 'light' | 'dark' | 'auto';

  /** 支持的主题 */
  availableThemes: Array<'light' | 'dark' | 'auto'>;

  /** 主题切换动画时长 */
  transitionDuration: number;
}

export interface NavigationConfig {
  /** 导航栏固定位置 */
  fixed: boolean;

  /** 滚动时隐藏导航栏 */
  hideOnScroll: boolean;

  /** 滚动阈值 */
  scrollThreshold: number;

  /** 移动端断点 */
  mobileBreakpoint: number;
}

export interface SearchConfig {
  /** API端点 */
  apiEndpoint: string;

  /** 防抖延迟（毫秒） */
  debounceMs: number;

  /** 最小搜索字符数 */
  minSearchLength: number;

  /** 最大建议数量 */
  maxSuggestions: number;

  /** 搜索历史数量 */
  maxHistoryItems: number;
}

export interface LazyLoadingConfig {
  /** 根边距 */
  rootMargin: string;

  /** 阈值 */
  threshold: number;

  /** 是否启用动画 */
  enableAnimation: boolean;
}

export interface AnalyticsConfig {
  /** 测量ID */
  measurementId: string;

  /** 是否为调试模式 */
  debug: boolean;

  /** 是否尊重Do Not Track */
  respectDoNotTrack: boolean;

  /** 自定义维度 */
  customDimensions?: Record<string, string>;
}

export interface PerformanceConfig {
  /** 是否监控Web Vitals */
  observeWebVitals: boolean;

  /** 是否监控资源加载 */
  observeResourceTiming: boolean;

  /** 是否监控长任务 */
  observeLongTasks: boolean;

  /** 是否监控用户交互 */
  observeUserTiming: boolean;

  /** 性能数据上报端点 */
  reportingEndpoint?: string;
}

export interface ErrorReportingConfig {
  /** 是否启用错误报告 */
  enabled: boolean;

  /** 错误报告端点 */
  endpoint?: string;

  /** 错误报告采样率 */
  sampleRate: number;

  /** 是否包含用户信息 */
  includeUser: boolean;

  /** 过滤错误函数 */
  errorFilter?: (error: Error) => boolean;
}