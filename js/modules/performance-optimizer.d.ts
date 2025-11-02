export class PerformanceOptimizer {
    performanceMode: boolean;
    connectionInfo: any;
    initialized: boolean;
    performanceMetrics: {
        pageLoadTime: null;
        firstPaint: null;
        firstContentfulPaint: null;
    };
    init(): Promise<void>;
    detectPerformanceCapabilities(): void;
    isLowEndDevice(): boolean;
    isSlowConnection(): boolean;
    setupPerformanceMonitoring(): void;
    measurePageLoadPerformance(): void;
    observeWebVitals(): void;
    applyPerformanceOptimizations(): void;
    enablePerformanceMode(): void;
    setupLazyLoading(): void;
    optimizeScrollPerformance(): void;
    preloadCriticalResources(): void;
    preloadCSS(href: any): void;
    reportPerformanceMetrics(): void;
    reportWebVital(name: any, value: any): void;
    getPerformanceMode(): boolean;
    getPerformanceMetrics(): {
        pageLoadTime: null;
        firstPaint: null;
        firstContentfulPaint: null;
    };
    getConnectionInfo(): {
        effectiveType: any;
        downlink: any;
        rtt: any;
    } | null;
    destroy(): void;
}
export default PerformanceOptimizer;
//# sourceMappingURL=performance-optimizer.d.ts.map