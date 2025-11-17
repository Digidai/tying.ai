/**
 * 性能监控工具
 * 监控Web Vitals和其他性能指标
 */

import { logger } from '@/utils/logger';

export interface PerformanceMetrics {
  /** Largest Contentful Paint */
  lcp?: number;

  /** First Input Delay */
  fid?: number;

  /** Cumulative Layout Shift */
  cls?: number;

  /** First Contentful Paint */
  fcp?: number;

  /** Time to First Byte */
  ttfb?: number;

  /** DOM Interactive */
  domInteractive?: number;

  /** Load Complete */
  loadComplete?: number;

  /** 资源加载时间 */
  resourceTiming?: PerformanceResourceTiming[];

  /** 长任务 */
  longTasks?: PerformanceEntry[];
}

export interface PerformanceOptions {
  /** 是否监控Web Vitals */
  observeWebVitals?: boolean;

  /** 是否监控资源加载 */
  observeResourceTiming?: boolean;

  /** 是否监控长任务 */
  observeLongTasks?: boolean;

  /** 性能数据上报端点 */
  reportingEndpoint?: string;

  /** 上报阈值 */
  reportingThreshold?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
  };
}

export class PerformanceMonitor {
  private config: PerformanceOptions;
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();
  private isSupported = {
    navigation: false,
    resource: false,
    paint: false,
    longtask: false,
    largestContentfulPaint: false,
    firstInput: false,
    layoutShift: false,
  };

  constructor(config: PerformanceOptions = {}) {
    this.config = {
      observeWebVitals: true,
      observeResourceTiming: true,
      observeLongTasks: true,
      reportingThreshold: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
      },
      ...config,
    };

    this.checkSupport();
  }

  /**
   * 初始化性能监控
   */
  async init(): Promise<void> {
    logger.perf('Performance Monitor', 'Initializing');

    if (this.config.observeWebVitals) {
      await this.observeWebVitals();
    }

    if (this.config.observeResourceTiming) {
      await this.observeResourceTiming();
    }

    if (this.config.observeLongTasks) {
      await this.observeLongTasks();
    }

    // 收集基础性能指标
    this.collectBasicMetrics();

    logger.perf('Performance Monitor', 'Initialized');
  }

  /**
   * 检查浏览器支持
   */
  private checkSupport(): void {
    this.isSupported.navigation = 'performance' in window && 'getEntriesByType' in performance;
    this.isSupported.resource = 'PerformanceResourceTiming' in window;
    this.isSupported.paint = 'PerformancePaintTiming' in window;
    this.isSupported.longtask = 'PerformanceObserver' in window && 'longtask' in PerformanceObserver.supportedEntryTypes;
    this.isSupported.largestContentfulPaint = 'PerformanceObserver' in window && 'largest-contentful-paint' in PerformanceObserver.supportedEntryTypes;
    this.isSupported.firstInput = 'PerformanceObserver' in window && 'first-input' in PerformanceObserver.supportedEntryTypes;
    this.isSupported.layoutShift = 'PerformanceObserver' in window && 'layout-shift' in PerformanceObserver.supportedEntryTypes;
  }

  /**
   * 监控Web Vitals
   */
  private async observeWebVitals(): Promise<void> {
    // LCP - Largest Contentful Paint
    if (this.isSupported.largestContentfulPaint) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;

        logger.perf('LCP', `${this.metrics.lcp.toFixed(2)}ms`);
        this.checkThreshold('lcp', this.metrics.lcp);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    }

    // FID - First Input Delay
    if (this.isSupported.firstInput) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventTiming = entry as PerformanceEventTiming;
          const fid = eventTiming.processingStart - eventTiming.startTime;
          this.metrics.fid = fid;

          logger.perf('FID', `${fid.toFixed(2)}ms`);
          this.checkThreshold('fid', fid);
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    }

    // CLS - Cumulative Layout Shift
    if (this.isSupported.layoutShift) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as LayoutShift;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        }
        this.metrics.cls = clsValue;

        logger.perf('CLS', `${clsValue.toFixed(3)}`);
        this.checkThreshold('cls', clsValue);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    }

    // FCP - First Contentful Paint
    if (this.isSupported.paint) {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;

            logger.perf('FCP', `${this.metrics.fcp.toFixed(2)}ms`);
            this.checkThreshold('fcp', this.metrics.fcp);
          }
        }
      });

      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', fcpObserver);
    }
  }

  /**
   * 监控资源加载
   */
  private async observeResourceTiming(): Promise<void> {
    if (this.isSupported.resource) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];
        this.metrics.resourceTiming = entries;

        // 分析资源加载性能
        this.analyzeResourceTiming(entries);
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }

  /**
   * 监控长任务
   */
  private async observeLongTasks(): Promise<void> {
    if (this.isSupported.longtask) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.longTasks = entries;

        entries.forEach(entry => {
          logger.perf('Long Task', `${entry.duration.toFixed(2)}ms`);
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    }
  }

  /**
   * 收集基础性能指标
   */
  private collectBasicMetrics(): void {
    if (this.isSupported.navigation) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];

        this.metrics.domInteractive = nav.domInteractive;
        this.metrics.loadComplete = nav.loadEventEnd;
        this.metrics.ttfb = nav.responseStart - nav.requestStart;

        logger.perf('TTFB', `${this.metrics.ttfb.toFixed(2)}ms`);
        logger.perf('DOM Interactive', `${this.metrics.domInteractive.toFixed(2)}ms`);
        logger.perf('Load Complete', `${this.metrics.loadComplete.toFixed(2)}ms`);
      }
    }
  }

  /**
   * 分析资源加载性能
   */
  private analyzeResourceTiming(entries: PerformanceResourceTiming[]): void {
    const resources = {
      total: entries.length,
      totalSize: 0,
      slowResources: [] as PerformanceResourceTiming[],
      resourcesByType: {} as Record<string, PerformanceResourceTiming[]>,
    };

    entries.forEach(entry => {
      // 按类型分组
      const type = this.getResourceType(entry);
      if (!resources.resourcesByType[type]) {
        resources.resourcesByType[type] = [];
      }
      resources.resourcesByType[type].push(entry);

      // 计算资源大小
      if (entry.transferSize) {
        resources.totalSize += entry.transferSize;
      }

      // 识别慢资源
      const loadTime = entry.responseEnd - entry.requestStart;
      if (loadTime > 1000) {
        resources.slowResources.push(entry);
      }
    });

    logger.perf('Resources', `${resources.total} total, ${(resources.totalSize / 1024).toFixed(2)}KB`);

    if (resources.slowResources.length > 0) {
      logger.warn(`Slow resources detected: ${resources.slowResources.length}`);
      resources.slowResources.forEach(resource => {
        logger.warn(
          `${resource.name}: ${((resource.responseEnd - resource.requestStart) / 1000).toFixed(2)}s`
        );
      });
    }
  }

  /**
   * 获取资源类型
   */
  private getResourceType(entry: PerformanceResourceTiming): string {
    const url = new URL(entry.name);

    if (url.pathname.endsWith('.js')) return 'script';
    if (url.pathname.endsWith('.css')) return 'stylesheet';
    if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) return 'image';
    if (url.pathname.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') return 'fetch';
    if (entry.initiatorType === 'navigation') return 'document';

    return 'other';
  }

  /**
   * 检查阈值
   */
  private checkThreshold(metric: string, value: number): void {
    const threshold = this.config.reportingThreshold?.[metric as keyof typeof this.config.reportingThreshold];

    if (threshold && value > threshold) {
      logger.warn(`${metric.toUpperCase()} threshold exceeded: ${value.toFixed(2)}ms > ${threshold}ms`);

      // 发送性能警告
      this.reportPerformanceWarning(metric, value, threshold);
    }
  }

  /**
   * 上报性能警告
   */
  private reportPerformanceWarning(metric: string, value: number, threshold: number): void {
    if (this.config.reportingEndpoint) {
      const data = {
        type: 'performance_warning',
        metric,
        value,
        threshold,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      };

      // 使用sendBeacon进行非阻塞上报
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(this.config.reportingEndpoint, JSON.stringify(data));
      } else {
        fetch(this.config.reportingEndpoint, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch((error) => logger.error('Failed to report performance metrics', error));
      }
    }
  }

  /**
   * 获取当前性能指标
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取性能报告
   */
  public getPerformanceReport(): {
    metrics: PerformanceMetrics;
    score: number;
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];
    let score = 100;

    // LCP评分
    if (metrics.lcp) {
      if (metrics.lcp > 4000) {
        score -= 20;
        recommendations.push('优化LCP：减少服务器响应时间、优化资源加载');
      } else if (metrics.lcp > 2500) {
        score -= 10;
        recommendations.push('LCP可以进一步优化');
      }
    }

    // FID评分
    if (metrics.fid) {
      if (metrics.fid > 300) {
        score -= 20;
        recommendations.push('优化FID：减少JavaScript执行时间、优化交互响应');
      } else if (metrics.fid > 100) {
        score -= 10;
        recommendations.push('FID可以进一步优化');
      }
    }

    // CLS评分
    if (metrics.cls) {
      if (metrics.cls > 0.25) {
        score -= 20;
        recommendations.push('优化CLS：为图片和广告设置尺寸、避免插入内容');
      } else if (metrics.cls > 0.1) {
        score -= 10;
        recommendations.push('CLS可以进一步优化');
      }
    }

    // FCP评分
    if (metrics.fcp) {
      if (metrics.fcp > 3000) {
        score -= 15;
        recommendations.push('优化FCP：减少服务器渲染时间、优化关键资源');
      } else if (metrics.fcp > 1800) {
        score -= 8;
        recommendations.push('FCP可以进一步优化');
      }
    }

    return {
      metrics,
      score: Math.max(0, score),
      recommendations,
    };
  }

  /**
   * 上报性能数据
   */
  public async reportMetrics(): Promise<void> {
    if (!this.config.reportingEndpoint) {
      return;
    }

    const report = this.getPerformanceReport();

    const data = {
      type: 'performance_report',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      ...report,
    };

    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      logger.perf('Performance Monitor', 'Metrics reported');
    } catch (error) {
      logger.error('Failed to report performance metrics:', error);
    }
  }

  /**
   * 销毁性能监控
   */
  public destroy(): void {
    this.observers.forEach((observer, name) => {
      observer.disconnect();
      logger.perf('Performance Monitor', `${name} observer disconnected`);
    });

    this.observers.clear();
    logger.perf('Performance Monitor', 'Destroyed');
  }
}
