// Main JavaScript Module - Entry point for the application
import { PerformanceOptimizer } from './modules/performance-optimizer.js';
import { AnimationManager } from './modules/animation-manager.js';
import { NavigationController } from './modules/navigation-controller.js';
import { InteractionHandler } from './modules/interaction-handler.js';

class MainApp {
    constructor() {
        this.performanceOptimizer = new PerformanceOptimizer();
        this.animationManager = new AnimationManager();
        this.navigationController = new NavigationController();
        this.interactionHandler = new InteractionHandler();
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Initialize performance optimizer first
            await this.performanceOptimizer.init();

            // Initialize other modules
            await this.navigationController.init();
            await this.animationManager.init();
            await this.interactionHandler.init();

            // Setup global error handling
            this.setupErrorHandling();

            this.initialized = true;
            console.log('🚀 Tying.ai application initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handlePromiseRejection(event.reason);
        });
    }

    handleInitializationError(error) {
        // Show user-friendly error message
        this.showErrorMessage('Application initialization failed. Please refresh the page.');

        // Report to error tracking service if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': error.message,
                'fatal': true
            });
        }
    }

    handleGlobalError(error) {
        // Report non-critical errors
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': error.message,
                'fatal': false
            });
        }
    }

    handlePromiseRejection(reason) {
        console.warn('Unhandled promise rejection:', reason);

        // Report promise rejections
        if (typeof gtag !== 'undefined') {
            gtag('event', 'promise_rejection', {
                'description': reason.toString()
            });
        }
    }

    showErrorMessage(message) {
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
        `;

        document.body.appendChild(errorToast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorToast.parentNode) {
                errorToast.parentNode.removeChild(errorToast);
            }
        }, 5000);
    }

    // Public API for other modules to access
    getPerformanceMode() {
        return this.performanceOptimizer.getPerformanceMode();
    }

    // Cleanup method for SPA scenarios
    destroy() {
        this.animationManager.destroy();
        this.navigationController.destroy();
        this.interactionHandler.destroy();
        this.performanceOptimizer.destroy();
        this.initialized = false;
    }
}

// Initialize application when DOM is ready
const app = new MainApp();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for global access
window.TyingAI = { app };

export default app;