/**
 * 主JavaScript入口文件
 * 负责初始化所有应用模块和功能
 */

import type { AppConfig } from '@/types/config';
import { PerformanceMonitor } from './utils/performance-monitor';
import { ThemeManager } from './utils/theme-manager';
import { NavigationController } from './utils/navigation-controller';
import { ScrollController } from './utils/scroll-controller';
import { FormController } from './utils/form-controller';
import { Analytics } from './utils/analytics';
import { LazyLoading } from './utils/lazy-loading';
import { ModalController } from './utils/modal-controller';
import { SearchController } from './utils/search-controller';
import { ErrorBoundary } from './utils/error-boundary';

// 应用配置
const config: AppConfig = {
  environment: import.meta.env.PROD ? 'production' : 'development',
  debug: import.meta.env.DEV,
  version: '2.0.0',
  apiEndpoint: import.meta.env.PUBLIC_API_ENDPOINT || '/api',
  googleAnalyticsId: import.meta.env.PUBLIC_GA_ID || '',
  enableAnalytics: import.meta.env.PROD,
  enablePerformanceMonitoring: true,
  enableErrorReporting: import.meta.env.PROD,
  enableThemeToggle: true,
  enableSearchSuggestions: true,
  enableLazyLoading: true,
  enableAnimations: true,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

/**
 * 应用主类
 */
class App {
  private config: AppConfig;
  private modules: Map<string, any> = new Map();
  private initialized = false;

  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * 初始化应用
   */
  async init(): Promise<void> {
    if (this.initialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      console.log(`🚀 Tying.ai v${this.config.version} - Initializing...`);

      // 初始化错误边界
      await this.initErrorBoundary();

      // 初始化核心模块
      await this.initCoreModules();

      // 初始化UI组件
      await this.initUIComponents();

      // 初始化交互功能
      await this.initInteractions();

      // 初始化性能监控
      await this.initPerformanceMonitoring();

      // 初始化分析
      await this.initAnalytics();

      // 注册Service Worker
      await this.registerServiceWorker();

      this.initialized = true;

      console.log('✅ App initialized successfully');

      // 触发初始化完成事件
      this.dispatchAppEvent('app:initialized', { config: this.config });

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * 初始化错误边界
   */
  private async initErrorBoundary(): Promise<void> {
    const errorBoundary = new ErrorBoundary({
      onError: (error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
        this.reportError(error, errorInfo);
      },
      onFallback: (error) => {
        this.showErrorFallback(error);
      },
    });

    this.modules.set('errorBoundary', errorBoundary);
    errorBoundary.init();
  }

  /**
   * 初始化核心模块
   */
  private async initCoreModules(): Promise<void> {
    // 性能监控
    if (this.config.enablePerformanceMonitoring) {
      const performanceMonitor = new PerformanceMonitor();
      this.modules.set('performanceMonitor', performanceMonitor);
      await performanceMonitor.init();
    }

    // 主题管理
    if (this.config.enableThemeToggle) {
      const themeManager = new ThemeManager();
      this.modules.set('themeManager', themeManager);
      await themeManager.init();
    }

    // 导航控制器
    const navigationController = new NavigationController();
    this.modules.set('navigationController', navigationController);
    await navigationController.init();

    // 滚动控制器
    const scrollController = new ScrollController({
      smoothScroll: !this.config.reducedMotion,
      scrollOffset: 80,
    });
    this.modules.set('scrollController', scrollController);
    await scrollController.init();

    // 表单控制器
    const formController = new FormController();
    this.modules.set('formController', formController);
    await formController.init();
  }

  /**
   * 初始化UI组件
   */
  private async initUIComponents(): Promise<void> {
    // 模态框控制器
    const modalController = new ModalController();
    this.modules.set('modalController', modalController);
    await modalController.init();

    // 搜索控制器
    if (this.config.enableSearchSuggestions) {
      const searchController = new SearchController({
        apiEndpoint: `${this.config.apiEndpoint}/search`,
        debounceMs: 300,
      });
      this.modules.set('searchController', searchController);
      await searchController.init();
    }

    // 懒加载
    if (this.config.enableLazyLoading) {
      const lazyLoading = new LazyLoading({
        rootMargin: '50px',
        threshold: 0.1,
      });
      this.modules.set('lazyLoading', lazyLoading);
      await lazyLoading.init();
    }
  }

  /**
   * 初始化交互功能
   */
  private async initInteractions(): Promise<void> {
    // 初始化工具提示
    this.initTooltips();

    // 初始化下拉菜单
    this.initDropdowns();

    // 初始化移动端菜单
    this.initMobileMenu();

    // 初始化搜索功能
    this.initSearch();

    // 初始化表单验证
    this.initFormValidation();

    // 初始化动画
    if (this.config.enableAnimations && !this.config.reducedMotion) {
      this.initAnimations();
    }
  }

  /**
   * 初始化性能监控
   */
  private async initPerformanceMonitoring(): Promise<void> {
    const performanceMonitor = this.modules.get('performanceMonitor');
    if (performanceMonitor) {
      // 监控关键性能指标
      performanceMonitor.observeWebVitals();

      // 监控资源加载
      performanceMonitor.observeResourceTiming();

      // 监控长任务
      performanceMonitor.observeLongTasks();
    }
  }

  /**
   * 初始化分析
   */
  private async initAnalytics(): Promise<void> {
    if (this.config.enableAnalytics && this.config.googleAnalyticsId) {
      const analytics = new Analytics({
        measurementId: this.config.googleAnalyticsId,
        debug: this.config.debug,
        respectDoNotTrack: true,
      });

      this.modules.set('analytics', analytics);
      await analytics.init();

      // 页面访问统计
      analytics.trackPageView();
    }
  }

  /**
   * 注册Service Worker
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered:', registration);
      } catch (error) {
        console.warn('⚠️ Service Worker registration failed:', error);
      }
    }
  }

  /**
   * 初始化工具提示
   */
  private initTooltips(): void {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseenter', this.showTooltip.bind(this));
      tooltip.addEventListener('mouseleave', this.hideTooltip.bind(this));
      tooltip.addEventListener('focus', this.showTooltip.bind(this));
      tooltip.addEventListener('blur', this.hideTooltip.bind(this));
    });
  }

  /**
   * 初始化下拉菜单
   */
  private initDropdowns(): void {
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', this.toggleDropdown.bind(this));
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        this.closeAllDropdowns();
      }
    });
  }

  /**
   * 初始化移动端菜单
   */
  private initMobileMenu(): void {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded',
          mobileMenu.classList.contains('hidden') ? 'false' : 'true'
        );
      });
    }
  }

  /**
   * 初始化搜索功能
   */
  private initSearch(): void {
    const searchController = this.modules.get('searchController');
    if (searchController) {
      // 搜索框事件监听
      const searchInputs = document.querySelectorAll('[data-search-input]');
      searchInputs.forEach(input => {
        input.addEventListener('input', searchController.handleSearch.bind(searchController));
        input.addEventListener('focus', searchController.showSuggestions.bind(searchController));
        input.addEventListener('blur', searchController.hideSuggestions.bind(searchController));
      });
    }
  }

  /**
   * 初始化表单验证
   */
  private initFormValidation(): void {
    const formController = this.modules.get('formController');
    if (formController) {
      const forms = document.querySelectorAll('form[data-validate]');
      forms.forEach(form => {
        formController.initForm(form);
      });
    }
  }

  /**
   * 初始化动画
   */
  private initAnimations(): void {
    // 交叉观察器用于滚动动画
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // 观察带有动画属性的元素
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * 显示工具提示
   */
  private showTooltip(event: Event): void {
    const target = event.target as Element;
    const tooltipText = target.getAttribute('data-tooltip');

    if (tooltipText) {
      // 创建工具提示元素
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-content';
      tooltip.textContent = tooltipText;

      // 创建箭头
      const arrow = document.createElement('div');
      arrow.className = 'tooltip-arrow';

      // 添加到DOM
      tooltip.appendChild(arrow);
      target.appendChild(tooltip);

      // 显示动画
      requestAnimationFrame(() => {
        tooltip.classList.add('visible');
      });
    }
  }

  /**
   * 隐藏工具提示
   */
  private hideTooltip(event: Event): void {
    const target = event.target as Element;
    const tooltip = target.querySelector('.tooltip-content');

    if (tooltip) {
      tooltip.classList.remove('visible');
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 200);
    }
  }

  /**
   * 切换下拉菜单
   */
  private toggleDropdown(event: Event): void {
    const target = event.target as Element;
    const dropdownId = target.getAttribute('data-dropdown');
    const dropdown = document.getElementById(dropdownId);

    if (dropdown) {
      const isOpen = !dropdown.classList.contains('hidden');

      // 关闭所有其他下拉菜单
      this.closeAllDropdowns();

      // 切换当前下拉菜单
      if (!isOpen) {
        dropdown.classList.remove('hidden');
        dropdown.setAttribute('aria-expanded', 'true');
      } else {
        dropdown.classList.add('hidden');
        dropdown.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * 关闭所有下拉菜单
   */
  private closeAllDropdowns(): void {
    const dropdowns = document.querySelectorAll('[data-dropdown-content]');
    dropdowns.forEach(dropdown => {
      dropdown.classList.add('hidden');
      dropdown.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * 报告错误
   */
  private reportError(error: Error, errorInfo?: any): void {
    if (this.config.enableErrorReporting) {
      // 这里可以集成错误报告服务，如Sentry
      console.error('Error reported:', error, errorInfo);

      // 发送到错误报告服务
      // this.sendErrorToService(error, errorInfo);
    }
  }

  /**
   * 显示错误回退
   */
  private showErrorFallback(error: Error): void {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-fallback';
    errorElement.innerHTML = `
      <div class="error-fallback-content">
        <h3>Something went wrong</h3>
        <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          Refresh Page
        </button>
      </div>
    `;

    document.body.appendChild(errorElement);
  }

  /**
   * 处理初始化错误
   */
  private handleInitializationError(error: Error): void {
    console.error('App initialization failed:', error);

    // 显示错误信息
    const errorElement = document.createElement('div');
    errorElement.className = 'init-error';
    errorElement.innerHTML = `
      <div class="init-error-content">
        <h2>Application Error</h2>
        <p>Failed to initialize the application. Please try again later.</p>
        <details>
          <summary>Error Details</summary>
          <pre>${error.message}</pre>
        </details>
      </div>
    `;

    document.body.appendChild(errorElement);
  }

  /**
   * 分发应用事件
   */
  private dispatchAppEvent(type: string, detail?: any): void {
    const event = new CustomEvent(type, { detail });
    document.dispatchEvent(event);
  }

  /**
   * 获取模块
   */
  public getModule<T = any>(name: string): T | undefined {
    return this.modules.get(name);
  }

  /**
   * 获取配置
   */
  public getConfig(): AppConfig {
    return this.config;
  }

  /**
   * 销毁应用
   */
  public destroy(): void {
    // 销毁所有模块
    this.modules.forEach((module, name) => {
      if (typeof module.destroy === 'function') {
        module.destroy();
      }
    });

    this.modules.clear();
    this.initialized = false;

    console.log('App destroyed');
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App(config);

  // 全局暴露应用实例（用于调试）
  (window as any).app = app;

  try {
    await app.init();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  const app = (window as any).app;
  if (app && typeof app.destroy === 'function') {
    app.destroy();
  }
});

// 导出应用类型和配置
export type { AppConfig };
export { App };