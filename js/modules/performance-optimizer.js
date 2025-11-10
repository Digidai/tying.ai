// Performance Optimizer Module
export class PerformanceOptimizer {
  constructor() {
    this.performanceMode = false;
    this.connectionInfo = null;
    this.initialized = false;
    this.performanceMetrics = {
      pageLoadTime: null,
      firstPaint: null,
      firstContentfulPaint: null,
    };
  }

  async init() {
    if (this.initialized) return;

    this.detectPerformanceCapabilities();
    this.setupPerformanceMonitoring();
    this.applyPerformanceOptimizations();

    this.initialized = true;
    console.log('🔧 Performance optimizer initialized');
  }

  detectPerformanceCapabilities() {
    // Check network connection
    this.connectionInfo =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    // Check hardware capabilities
    const isLowEndDevice = this.isLowEndDevice();
    const isSlowConnection = this.isSlowConnection();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine performance mode
    this.performanceMode = isLowEndDevice || isSlowConnection || prefersReducedMotion;

    // Apply performance mode class to document
    if (this.performanceMode) {
      document.documentElement.classList.add('performance-mode');
    }

    console.log('Performance detection results:', {
      performanceMode: this.performanceMode,
      isLowEndDevice,
      isSlowConnection,
      prefersReducedMotion,
      connectionType: this.connectionInfo?.effectiveType,
    });
  }

  isLowEndDevice() {
    // Check CPU cores
    const cpuCores = navigator.hardwareConcurrency || 4;
    if (cpuCores <= 2) return true;

    // Check device memory (if available)
    const deviceMemory = navigator.deviceMemory;
    if (deviceMemory && deviceMemory <= 2) return true;

    // Check for mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    return isMobile;
  }

  isSlowConnection() {
    if (!this.connectionInfo) return false;

    const slowTypes = ['slow-2g', '2g', '3g'];
    return slowTypes.includes(this.connectionInfo.effectiveType);
  }

  setupPerformanceMonitoring() {
    // Monitor page load performance
    if ('performance' in window && 'getEntriesByType' in performance) {
      this.measurePageLoadPerformance();

      // Monitor Core Web Vitals
      this.observeWebVitals();
    }

    // Monitor connection changes
    if (this.connectionInfo) {
      this.connectionInfo.addEventListener('change', () => {
        this.detectPerformanceCapabilities();
      });
    }
  }

  measurePageLoadPerformance() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.performanceMetrics.pageLoadTime =
            navigation.loadEventEnd - navigation.loadEventStart;
          console.log('Page load time:', this.performanceMetrics.pageLoadTime, 'ms');

          // Report to analytics if available
          this.reportPerformanceMetrics();
        }

        // Measure paint timings
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            this.performanceMetrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.performanceMetrics.firstContentfulPaint = entry.startTime;
          }
        });
      }, 0);
    });
  }

  observeWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);

          this.reportWebVital('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
            this.reportWebVital('FID', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(entryList => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          console.log('CLS:', clsValue);
          this.reportWebVital('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Web Vitals monitoring not supported:', error);
      }
    }
  }

  applyPerformanceOptimizations() {
    if (this.performanceMode) {
      this.enablePerformanceMode();
    }

    // Setup intersection observer for lazy loading
    this.setupLazyLoading();

    // Optimize scroll performance
    this.optimizeScrollPerformance();

    // Preload critical resources
    this.preloadCriticalResources();
  }

  enablePerformanceMode() {
    // Disable complex animations
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');

    // Reduce visual effects
    const glassElements = document.querySelectorAll('.glass-card, .feature-card, .content-card');
    glassElements.forEach(element => {
      element.style.backdropFilter = 'none';
      element.style.webkitBackdropFilter = 'none';
    });

    console.log('Performance mode enabled');
  }

  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      },
    );

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  optimizeScrollPerformance() {
    let ticking = false;

    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Custom scroll event will be handled by NavigationController
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);

    // Preload critical CSS (already loaded but ensuring priority)
    this.preloadCSS('/layout.css');
    this.preloadCSS('/components.css');
    this.preloadCSS('/utilities.css');
  }

  preloadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    document.head.appendChild(link);
  }

  reportPerformanceMetrics() {
    if (typeof gtag !== 'undefined' && this.performanceMetrics.pageLoadTime) {
      gtag('event', 'timing_complete', {
        name: 'load',
        value: Math.round(this.performanceMetrics.pageLoadTime),
      });
    }
  }

  reportWebVital(name, value) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vital', {
        name: name,
        value: Math.round(value),
      });
    }
  }

  // Public API
  getPerformanceMode() {
    return this.performanceMode;
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  getConnectionInfo() {
    return this.connectionInfo
      ? {
          effectiveType: this.connectionInfo.effectiveType,
          downlink: this.connectionInfo.downlink,
          rtt: this.connectionInfo.rtt,
        }
      : null;
  }

  destroy() {
    // Cleanup observers and event listeners
    this.initialized = false;
    console.log('Performance optimizer destroyed');
  }
}

export default PerformanceOptimizer;
