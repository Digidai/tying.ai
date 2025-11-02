/**
 * Performance Optimizer Module
 * Handles performance detection, monitoring, and optimization
 */

export interface PerformanceMetrics {
  pageLoadTime: number | null;
  firstPaint: number | null;
  firstContentfulPaint: number | null;
}

export interface ConnectionInfo {
  effectiveType: string;
  downlink?: number;
  rtt?: number;
}

export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
}

/**
 * Performance Optimizer Class
 * Automatically detects performance capabilities and applies optimizations
 */
export class PerformanceOptimizer {
  private performanceMode: boolean = false;
  private connectionInfo: ConnectionInfo | null = null;
  private initialized: boolean = false;
  private performanceMetrics: PerformanceMetrics = {
    pageLoadTime: null,
    firstPaint: null,
    firstContentfulPaint: null
  };
  private performanceObservers: PerformanceObserver[] = [];

  constructor() {
    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
  }

  /**
   * Initialize the performance optimizer
   */
  async init(): Promise<void> {
    if (this.initialized) {
      console.warn('⚠️ Performance optimizer already initialized');
      return;
    }

    try {
      console.log('🔧 Initializing performance optimizer...');

      this.detectPerformanceCapabilities();
      this.setupPerformanceMonitoring();
      this.applyPerformanceOptimizations();
      this.setupEventListeners();

      this.initialized = true;
      console.log('✅ Performance optimizer initialized');
      console.log('📊 Performance mode:', this.performanceMode ? 'enabled' : 'disabled');

    } catch (error) {
      console.error('❌ Failed to initialize performance optimizer:', error);
      throw error;
    }
  }

  /**
   * Detect device and network performance capabilities
   */
  private detectPerformanceCapabilities(): void {
    // Check network connection
    this.connectionInfo = this.getConnectionInfo();

    // Check hardware capabilities
    const isLowEndDevice = this.isLowEndDevice();
    const isSlowConnection = this.isSlowConnection();
    const prefersReducedMotion = this.prefersReducedMotion();

    // Determine performance mode
    this.performanceMode = isLowEndDevice || isSlowConnection || prefersReducedMotion;

    // Apply performance mode class to document
    if (this.performanceMode) {
      document.documentElement.classList.add('performance-mode');
      console.log('🔋 Performance mode enabled for better performance on low-end devices');
    }

    console.log('Performance detection results:', {
      performanceMode: this.performanceMode,
      isLowEndDevice,
      isSlowConnection,
      prefersReducedMotion,
      connectionType: this.connectionInfo?.effectiveType
    });
  }

  /**
   * Check if device is low-end
   */
  private isLowEndDevice(): boolean {
    // Check CPU cores
    const cpuCores = navigator.hardwareConcurrency || 4;
    if (cpuCores <= 2) {
      console.log('💻 Low CPU cores detected:', cpuCores);
      return true;
    }

    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory <= 2) {
      console.log('💾 Low device memory detected:', deviceMemory, 'GB');
      return true;
    }

    // Check for mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      console.log('📱 Mobile device detected');
      return true;
    }

    return false;
  }

  /**
   * Check if connection is slow
   */
  private isSlowConnection(): boolean {
    if (!this.connectionInfo) return false;

    const slowTypes = ['slow-2g', '2g', '3g'];
    const isSlow = slowTypes.includes(this.connectionInfo.effectiveType);

    if (isSlow) {
      console.log('🐌 Slow connection detected:', this.connectionInfo.effectiveType);
    }

    return isSlow;
  }

  /**
   * Check if user prefers reduced motion
   */
  private prefersReducedMotion(): boolean {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      console.log('🎭 Reduced motion preference detected');
    }

    return prefersReduced;
  }

  /**
   * Get connection information
   */
  private getConnectionInfo(): ConnectionInfo | null {
    const connection = (navigator as any).connection ||
                     (navigator as any).mozConnection ||
                     (navigator as any).webkitConnection;

    if (!connection) {
      console.log('🌐 Connection API not available');
      return null;
    }

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    this.measurePageLoadPerformance();
    this.observeWebVitals();
  }

  /**
   * Measure page load performance
   */
  private measurePageLoadPerformance(): void {
    if (!('performance' in window) || !('getEntriesByType' in performance)) {
      console.warn('⚠️ Performance API not available');
      return;
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
          console.log('⏱️ Page load time:', this.performanceMetrics.pageLoadTime, 'ms');

          this.reportPerformanceMetrics();
        }

        // Measure paint timings
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry: PerformanceEntry) => {
          if (entry.name === 'first-paint') {
            this.performanceMetrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.performanceMetrics.firstContentfulPaint = entry.startTime;
          }
        });

        console.log('🎨 Paint timings:', {
          firstPaint: this.performanceMetrics.firstPaint,
          firstContentfulPaint: this.performanceMetrics.firstContentfulPaint
        });

      }, 0);
    });
  }

  /**
   * Observe Core Web Vitals
   */
  private observeWebVitals(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('⚠️ PerformanceObserver not available');
      return;
    }

    try {
      // Largest Contentful Paint (LCP)
      this.observeLCP();

      // First Input Delay (FID)
      this.observeFID();

      // Cumulative Layout Shift (CLS)
      this.observeCLS();

    } catch (error) {
      console.warn('⚠️ Web Vitals monitoring not supported:', error);
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;

      console.log('🖼️ LCP:', lcp.toFixed(2), 'ms');
      this.reportWebVital('LCP', lcp);
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.performanceObservers.push(lcpObserver);
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const fid = (entry as any).processingStart - entry.startTime;
        console.log('⚡ FID:', fid.toFixed(2), 'ms');
        this.reportWebVital('FID', fid);
      });
    });

    fidObserver.observe({ entryTypes: ['first-input'] });
    this.performanceObservers.push(fidObserver);
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    let clsValue = 0;

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }

      console.log('📐 CLS:', clsValue.toFixed(4));
      this.reportWebVital('CLS', clsValue);
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.performanceObservers.push(clsObserver);
  }

  /**
   * Apply performance optimizations based on detected capabilities
   */
  private applyPerformanceOptimizations(): void {
    if (this.performanceMode) {
      this.enablePerformanceMode();
    }

    this.setupLazyLoading();
    this.optimizeScrollPerformance();
    this.preloadCriticalResources();
  }

  /**
   * Enable performance mode for low-end devices
   */
  private enablePerformanceMode(): void {
    // Disable complex animations
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');

    // Reduce visual effects
    const glassElements = document.querySelectorAll('.glass-card, .feature-card, .content-card');
    glassElements.forEach((element: Element) => {
      (element as HTMLElement).style.backdropFilter = 'none';
      (element as HTMLElement).style.webkitBackdropFilter = 'none';
    });

    console.log('🔋 Performance optimizations applied');
  }

  /**
   * Setup lazy loading for images
   */
  private setupLazyLoading(): void {
    if (!('IntersectionObserver' in window)) {
      console.warn('⚠️ IntersectionObserver not available, lazy loading disabled');
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });

    console.log('🖼️ Lazy loading setup complete');
  }

  /**
   * Optimize scroll performance
   */
  private optimizeScrollPerformance(): void {
    let ticking = false;

    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    console.log('📜 Scroll performance optimized');
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);

    // Preload critical CSS files
    this.preloadCSS('/layout.css');
    this.preloadCSS('/components.css');
    this.preloadCSS('/utilities.css');

    console.log('⚡ Critical resources preloaded');
  }

  /**
   * Preload CSS file
   */
  private preloadCSS(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    document.head.appendChild(link);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Connection changes
    if (this.connectionInfo) {
      this.connectionInfo.addEventListener('change', this.handleConnectionChange);
    }

    // Page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Performance entries (for dynamic monitoring)
    if ('PerformanceObserver' in window) {
      this.setupDynamicPerformanceMonitoring();
    }
  }

  /**
   * Handle connection changes
   */
  private handleConnectionChange(): void {
    console.log('🌐 Connection changed, re-evaluating performance settings');
    this.detectPerformanceCapabilities();
    this.applyPerformanceOptimizations();
  }

  /**
   * Handle visibility changes
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      console.log('👁️ Page hidden, pausing non-critical operations');
    } else {
      console.log('👁️ Page visible, resuming operations');
    }
  }

  /**
   * Setup dynamic performance monitoring
   */
  private setupDynamicPerformanceMonitoring(): void {
    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('⚠️ Long task detected:', entry.duration.toFixed(2), 'ms');
          }
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.performanceObservers.push(longTaskObserver);
    } catch (error) {
      console.warn('⚠️ Long task monitoring not supported:', error);
    }
  }

  /**
   * Report performance metrics to analytics
   */
  private reportPerformanceMetrics(): void {
    if (typeof gtag !== 'undefined' && this.performanceMetrics.pageLoadTime) {
      gtag('event', 'timing_complete', {
        name: 'load',
        value: Math.round(this.performanceMetrics.pageLoadTime)
      });
    }

    // Emit custom event for internal monitoring
    window.dispatchEvent(new CustomEvent('performance:metrics', {
      detail: this.performanceMetrics
    }));
  }

  /**
   * Report Web Vitals to analytics
   */
  private reportWebVital(name: string, value: number): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vital', {
        name: name,
        value: Math.round(value)
      });
    }

    // Emit custom event
    window.dispatchEvent(new CustomEvent('performance:web-vital', {
      detail: { name, value }
    }));
  }

  /**
   * Public API methods
   */

  /**
   * Get current performance mode
   */
  getPerformanceMode(): boolean {
    return this.performanceMode;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get connection information
   */
  getConnectionInfo(): ConnectionInfo | null {
    return this.connectionInfo ? { ...this.connectionInfo } : null;
  }

  /**
   * Analyze current performance
   */
  analyzePerformance(): void {
    console.log('📊 Performance Analysis:');
    console.log('  Performance Mode:', this.performanceMode);
    console.log('  Connection Info:', this.connectionInfo);
    console.log('  Metrics:', this.performanceMetrics);

    // Trigger performance analysis event
    window.dispatchEvent(new CustomEvent('performance:analyze', {
      detail: {
        performanceMode: this.performanceMode,
        connectionInfo: this.connectionInfo,
        metrics: this.performanceMetrics
      }
    }));
  }

  /**
   * Check if optimizer is initialized
   */
  get isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    if (!this.initialized) {
      return;
    }

    console.log('🧹 Destroying performance optimizer...');

    // Disconnect performance observers
    this.performanceObservers.forEach(observer => {
      observer.disconnect();
    });
    this.performanceObservers = [];

    // Remove event listeners
    if (this.connectionInfo) {
      this.connectionInfo.removeEventListener('change', this.handleConnectionChange);
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    // Remove performance mode class
    document.documentElement.classList.remove('performance-mode');

    // Reset performance metrics
    this.performanceMetrics = {
      pageLoadTime: null,
      firstPaint: null,
      firstContentfulPaint: null
    };

    this.initialized = false;
    console.log('✅ Performance optimizer destroyed');
  }
}