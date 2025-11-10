/**
 * Main TypeScript Application Entry Point
 * Tying.ai - AI Career Guidance Platform
 */

import { PerformanceOptimizer } from './modules/performance-optimizer';
import { AnimationManager } from './modules/animation-manager';
import { NavigationController } from './modules/navigation-controller';
import { InteractionHandler } from './modules/interaction-handler';

/**
 * Main Application Class
 * Manages the initialization and lifecycle of all application modules
 */
export class MainApp {
  private performanceOptimizer: PerformanceOptimizer;
  private animationManager: AnimationManager;
  private navigationController: NavigationController;
  private interactionHandler: InteractionHandler;
  private initialized: boolean = false;

  constructor() {
    this.performanceOptimizer = new PerformanceOptimizer();
    this.animationManager = new AnimationManager();
    this.navigationController = new NavigationController();
    this.interactionHandler = new InteractionHandler();
  }

  /**
   * Initialize the application
   */
  async init(): Promise<void> {
    if (this.initialized) {
      console.warn('⚠️ Application already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Tying.ai application...');

      // Initialize modules in dependency order
      await this.performanceOptimizer.init();
      await this.navigationController.init();
      await this.animationManager.init();
      await this.interactionHandler.init();

      // Setup global error handling
      this.setupErrorHandling();

      // Setup global event listeners
      this.setupGlobalEvents();

      this.initialized = true;

      console.log('✅ Tying.ai application initialized successfully');
      this.emitAppEvent('app:initialized');

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      this.handleInitializationError(error as Error);
      throw error;
    }
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      this.handleGlobalError(event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handlePromiseRejection(event.reason);
    });
  }

  /**
   * Setup global event listeners
   */
  private setupGlobalEvents(): void {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.emitAppEvent('app:hidden');
      } else {
        this.emitAppEvent('app:visible');
      }
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.emitAppEvent('app:before-unload');
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.emitAppEvent('app:online');
    });

    window.addEventListener('offline', () => {
      this.emitAppEvent('app:offline');
    });
  }

  /**
   * Handle initialization errors
   */
  private handleInitializationError(error: Error): void {
    // Show user-friendly error message
    this.showErrorMessage('Application initialization failed. Please refresh the page.');

    // Report to error tracking service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }

    this.emitAppEvent('app:error', { error, context: 'initialization' });
  }

  /**
   * Handle global runtime errors
   */
  private handleGlobalError(error: Error): void {
    // Report non-critical errors
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }

    this.emitAppEvent('app:error', { error, context: 'runtime' });
  }

  /**
   * Handle promise rejections
   */
  private handlePromiseRejection(reason: unknown): void {
    console.warn('Unhandled promise rejection:', reason);

    // Report promise rejections
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'promise_rejection', {
        description: String(reason)
      });
    }

    this.emitAppEvent('app:promise-rejection', { reason });
  }

  /**
   * Show error message to user
   */
  private showErrorMessage(message: string): void {
    // Create and show error toast
    const errorToast = document.createElement('div');
    errorToast.className = 'error-toast';
    errorToast.textContent = message;
    errorToast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #DC2626;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      z-index: 10000;
      max-width: 300px;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(errorToast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorToast.parentNode) {
        errorToast.parentNode.removeChild(errorToast);
      }
    }, 5000);
  }

  /**
   * Emit custom application events
   */
  private emitAppEvent(eventName: string, detail?: any): void {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Get current performance mode
   */
  getPerformanceMode(): boolean {
    return this.performanceOptimizer.getPerformanceMode();
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceOptimizer.getPerformanceMetrics();
  }

  /**
   * Get connection information
   */
  getConnectionInfo() {
    return this.performanceOptimizer.getConnectionInfo();
  }

  /**
   * Manually trigger performance analysis
   */
  analyzePerformance(): void {
    this.performanceOptimizer.analyzePerformance();
  }

  /**
   * Cleanup and destroy application
   */
  destroy(): void {
    if (!this.initialized) {
      return;
    }

    console.log('🧹 Destroying application...');

    try {
      // Cleanup modules in reverse order
      this.interactionHandler.destroy();
      this.animationManager.destroy();
      this.navigationController.destroy();
      this.performanceOptimizer.destroy();

      this.initialized = false;

      console.log('✅ Application destroyed successfully');
      this.emitAppEvent('app:destroyed');

    } catch (error) {
      console.error('❌ Error during application destruction:', error);
    }
  }

  /**
   * Get application status
   */
  getStatus(): {
    initialized: boolean;
    performanceMode: boolean;
    modules: {
      performanceOptimizer: boolean;
      animationManager: boolean;
      navigationController: boolean;
      interactionHandler: boolean;
    };
  } {
    return {
      initialized: this.initialized,
      performanceMode: this.getPerformanceMode(),
      modules: {
        performanceOptimizer: this.performanceOptimizer.isInitialized ?? false,
        animationManager: this.animationManager.isInitialized ?? false,
        navigationController: this.navigationController.isInitialized ?? false,
        interactionHandler: this.interactionHandler.isInitialized ?? false
      }
    };
  }
}

// Initialize application when DOM is ready
const app = new MainApp();

// Make app globally available
(window as any).TyingAI = { app };

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for other modules
export default app;