/**
 * Analytics Module - Loaded on demand for tracking
 * Only loads when user interacts with analytics features
 */

class AnalyticsModule {
  constructor() {
    this.isInitialized = false;
    this.trackingEvents = [];
    this.performanceMetrics = {};

    console.log('📊 Analytics module loaded');
  }

  /**
   * Initialize analytics tracking
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize basic tracking
      this.setupPageTracking();
      this.setupPerformanceTracking();
      this.setupUserInteractionTracking();

      this.isInitialized = true;
      console.log('✅ Analytics initialized');

      // Emit initialization event
      window.dispatchEvent(
        new CustomEvent('analytics:ready', {
          detail: { module: 'analytics' },
        }),
      );
    } catch (error) {
      console.error('❌ Failed to initialize analytics:', error);
    }
  }

  /**
   * Track page views
   */
  trackPageView(page) {
    if (!this.isInitialized) {
      console.warn('⚠️ Analytics not initialized');
      return;
    }

    const trackingData = {
      page,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };

    console.log('📈 Page tracked:', trackingData);
    this.trackingEvents.push(trackingData);

    // Send to analytics service (mock)
    this.sendTrackingData(trackingData);
  }

  /**
   * Track user interactions
   */
  trackInteraction(action, element, context = {}) {
    if (!this.isInitialized) return;

    const interactionData = {
      action,
      element: element.tagName || 'unknown',
      elementId: element.id || null,
      elementClass: element.className || null,
      context,
      timestamp: Date.now(),
    };

    console.log('👆 Interaction tracked:', interactionData);
    this.trackingEvents.push(interactionData);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName, value) {
    if (!this.isInitialized) return;

    this.performanceMetrics[metricName] = {
      value,
      timestamp: Date.now(),
    };

    console.log(`⚡ Performance tracked: ${metricName} = ${value}`);
  }

  /**
   * Setup page tracking
   */
  setupPageTracking() {
    // Track initial page load
    this.trackPageView(window.location.pathname);

    // Track single page app navigation
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });
  }

  /**
   * Setup performance tracking
   */
  setupPerformanceTracking() {
    if ('performance' in window) {
      // Track Core Web Vitals
      this.trackWebVitals();

      // Track custom metrics
      this.trackCustomMetrics();
    }
  }

  /**
   * Track Web Vitals
   */
  trackWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance('LCP', Math.round(lastEntry.startTime));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.trackPerformance('FID', Math.round(entry.processingStart - entry.startTime));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.trackPerformance('CLS', Math.round(clsValue * 1000) / 1000);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Track custom metrics
   */
  trackCustomMetrics() {
    // Track page load time
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      this.trackPerformance('pageLoadTime', Math.round(loadTime));
    });

    // Track DOM content loaded time
    document.addEventListener('DOMContentLoaded', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const domLoadTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
      this.trackPerformance('domLoadTime', Math.round(domLoadTime));
    });
  }

  /**
   * Setup user interaction tracking
   */
  setupUserInteractionTracking() {
    // Track button clicks
    document.addEventListener(
      'click',
      event => {
        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
          this.trackInteraction('click', event.target, {
            text: event.target.textContent.trim(),
            href: event.target.href || null,
          });
        }
      },
      { passive: true },
    );

    // Track form submissions
    document.addEventListener('submit', event => {
      this.trackInteraction('formSubmit', event.target, {
        formId: event.target.id || null,
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener(
      'scroll',
      () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
        );
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (maxScroll % 25 === 0) {
            // Track at 25%, 50%, 75%, 100%
            this.trackPerformance(`scrollDepth${maxScroll}`, maxScroll);
          }
        }
      },
      { passive: true },
    );
  }

  /**
   * Send tracking data to analytics service
   */
  sendTrackingData(data) {
    // Mock implementation - in real app, this would send to analytics service
    console.log('📤 Sending tracking data:', data);

    // Store in localStorage for demo purposes
    const storedData = localStorage.getItem('analytics_data') || '[]';
    const analyticsData = JSON.parse(storedData);
    analyticsData.push(data);

    // Keep only last 50 events to avoid storage bloat
    if (analyticsData.length > 50) {
      analyticsData.splice(0, analyticsData.length - 50);
    }

    localStorage.setItem('analytics_data', JSON.stringify(analyticsData));
  }

  /**
   * Get analytics report
   */
  getReport() {
    return {
      totalEvents: this.trackingEvents.length,
      performanceMetrics: this.performanceMetrics,
      recentEvents: this.trackingEvents.slice(-10),
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Export analytics data
   */
  exportData() {
    const exportData = {
      trackingEvents: this.trackingEvents,
      performanceMetrics: this.performanceMetrics,
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent,
      page: window.location.pathname,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    console.log('📊 Analytics data exported');
  }

  /**
   * Clear all analytics data
   */
  clearData() {
    this.trackingEvents = [];
    this.performanceMetrics = {};
    localStorage.removeItem('analytics_data');
    console.log('🗑️ Analytics data cleared');
  }

  /**
   * Destroy analytics module
   */
  destroy() {
    this.clearData();
    this.isInitialized = false;

    // Emit destroy event
    window.dispatchEvent(
      new CustomEvent('analytics:destroyed', {
        detail: { module: 'analytics' },
      }),
    );

    console.log('💀 Analytics module destroyed');
  }
}

// Create and export singleton instance
const analyticsModule = new AnalyticsModule();

export default analyticsModule;
