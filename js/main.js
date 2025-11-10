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
    this.moduleLoader = window.ModuleLoader || null;
    this.lazyModules = {
      analytics: false,
      chatbot: false,
      charts: false,
      forms: false,
    };
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

      // Setup lazy loading integration
      this.setupLazyLoading();

      this.initialized = true;
      console.log('🚀 Tying.ai application initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      this.handleInitializationError(error);
    }
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', event => {
      console.error('Global error:', event.error);
      this.handleGlobalError(event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', event => {
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
        description: error.message,
        fatal: true,
      });
    }
  }

  handleGlobalError(error) {
    // Report non-critical errors
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handlePromiseRejection(reason) {
    console.warn('Unhandled promise rejection:', reason);

    // Report promise rejections
    if (typeof gtag !== 'undefined') {
      gtag('event', 'promise_rejection', {
        description: reason.toString(),
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

  // Setup lazy loading integration
  setupLazyLoading() {
    if (!this.moduleLoader) {
      console.warn('⚠️ Module loader not available');
      return;
    }

    // Setup analytics on user interaction
    this.setupAnalyticsLoading();

    // Setup chatbot on demand
    this.setupChatbotLoading();

    // Listen for module load events
    this.setupModuleEventListeners();

    // Setup intersection observer for content-based loading
    this.setupContentBasedLoading();

    console.log('✅ Lazy loading integration configured');
  }

  // Setup analytics loading based on user engagement
  setupAnalyticsLoading() {
    // Load analytics after user has been on page for 10 seconds
    const analyticsTimer = setTimeout(() => {
      this.loadLazyModule('analytics');
    }, 10000);

    // Or load analytics after user scrolls 25% of page
    let analyticsLoaded = false;
    const scrollHandler = () => {
      if (analyticsLoaded) return;

      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.25) {
        analyticsLoaded = true;
        this.loadLazyModule('analytics');
        clearTimeout(analyticsTimer);
        window.removeEventListener('scroll', scrollHandler);
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Or load analytics on first meaningful interaction
    const interactionHandler = () => {
      if (analyticsLoaded) return;
      analyticsLoaded = true;
      this.loadLazyModule('analytics');
      clearTimeout(analyticsTimer);
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('click', interactionHandler);
    };

    document.addEventListener('click', interactionHandler, { once: true, passive: true });
  }

  // Setup chatbot loading on demand
  setupChatbotLoading() {
    // Add chatbot button to page (hidden initially)
    this.addChatbotTrigger();

    // Load chatbot when user clicks help or chat elements
    const chatTriggers = [
      '[href*="contact"]',
      '[href*="help"]',
      '[href*="support"]',
      '.help-link',
      '.chat-link',
      '[data-action="chat"]',
    ];

    chatTriggers.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.addEventListener(
          'click',
          event => {
            event.preventDefault();
            this.loadLazyModule('chatbot').then(() => {
              // Open chatbot after loading
              if (window.chatbotModule) {
                window.chatbotModule.openChat();
              }
              // Navigate to original link if needed
              if (element.href && !element.href.includes('#')) {
                window.open(element.href, '_blank');
              }
            });
          },
          { once: true },
        );
      });
    });
  }

  // Add chatbot trigger button
  addChatbotTrigger() {
    // Check if chatbot button already exists
    if (document.getElementById('chatbot-trigger')) return;

    const trigger = document.createElement('button');
    trigger.id = 'chatbot-trigger';
    trigger.className = 'chatbot-trigger';
    trigger.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>AI Assistant</span>
        `;
    trigger.setAttribute('aria-label', 'Load AI Assistant');
    trigger.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 999;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        `;

    trigger.addEventListener('click', () => {
      this.loadLazyModule('chatbot').then(() => {
        trigger.remove();
        if (window.chatbotModule) {
          window.chatbotModule.openChat();
        }
      });
    });

    trigger.addEventListener('mouseenter', () => {
      trigger.style.transform = 'translateY(-2px)';
      trigger.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
    });

    trigger.addEventListener('mouseleave', () => {
      trigger.style.transform = 'translateY(0)';
      trigger.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
    });

    document.body.appendChild(trigger);
  }

  // Setup module event listeners
  setupModuleEventListeners() {
    if (!this.moduleLoader) return;

    // Listen for successful module loads
    window.addEventListener('module:loaded', event => {
      const { moduleName } = event.detail;
      console.log(`✅ Module loaded: ${moduleName}`);

      // Initialize loaded module if it has init method
      this.initializeLoadedModule(moduleName);
    });

    // Listen for module load errors
    window.addEventListener('module:error', event => {
      const { moduleName, error } = event.detail;
      console.error(`❌ Module load failed: ${moduleName}`, error);

      // Show user-friendly error message
      this.showModuleLoadError(moduleName);
    });
  }

  // Initialize loaded module
  async initializeLoadedModule(moduleName) {
    try {
      switch (moduleName) {
        case 'analytics':
          if (window.analyticsModule) {
            await window.analyticsModule.initialize();
            this.lazyModules.analytics = true;
            console.log('📊 Analytics module initialized');
          }
          break;

        case 'chatbot':
          if (window.chatbotModule) {
            await window.chatbotModule.initialize();
            this.lazyModules.chatbot = true;
            console.log('💬 Chatbot module initialized');
          }
          break;

        case 'charts':
          if (window.chartsModule) {
            await window.chartsModule.initialize();
            this.lazyModules.charts = true;
            console.log('📊 Charts module initialized');
          }
          break;

        case 'forms':
          if (window.formsModule) {
            await window.formsModule.initialize();
            this.lazyModules.forms = true;
            console.log('📝 Forms module initialized');
          }
          break;
      }
    } catch (error) {
      console.error(`❌ Failed to initialize module ${moduleName}:`, error);
    }
  }

  // Setup content-based lazy loading
  setupContentBasedLoading() {
    if (!this.moduleLoader) return;

    // Load charts module when charts section is visible
    const chartsSection = document.querySelector(
      '[data-module="charts"], .charts-section, .data-visualization',
    );
    if (chartsSection) {
      chartsSection.setAttribute('data-module', 'charts');
    }

    // Load forms module when forms are visible
    const forms = document.querySelectorAll(
      'form[data-lazy="true"], .form-section[data-lazy="true"]',
    );
    forms.forEach(form => {
      form.setAttribute('data-module', 'forms');
    });

    // Add data-module attributes for other modules as needed
    this.addLazyModuleAttributes();
  }

  // Add lazy module attributes to relevant elements
  addLazyModuleAttributes() {
    // Add analytics tracking to important buttons
    const importantButtons = document.querySelectorAll(
      '.btn-primary, .cta-button, [data-track="true"]',
    );
    importantButtons.forEach(button => {
      if (!button.dataset.module) {
        button.dataset.module = 'analytics';
      }
    });

    // Add chat module to help links
    const helpLinks = document.querySelectorAll('a[href*="help"], a[href*="contact"]');
    helpLinks.forEach(link => {
      if (!link.dataset.module) {
        link.dataset.module = 'chatbot';
      }
    });
  }

  // Load lazy module
  async loadLazyModule(moduleName) {
    if (this.lazyModules[moduleName]) {
      console.log(`⚡ Module ${moduleName} already loaded`);
      return;
    }

    if (!this.moduleLoader) {
      console.warn(`⚠️ Module loader not available for ${moduleName}`);
      return;
    }

    try {
      console.log(`🔄 Loading module: ${moduleName}`);
      await this.moduleLoader.loadModule(moduleName);
    } catch (error) {
      console.error(`❌ Failed to load module ${moduleName}:`, error);
      this.showModuleLoadError(moduleName);
    }
  }

  // Show module load error message
  showModuleLoadError(moduleName) {
    const errorMessages = {
      analytics: 'Analytics features are currently unavailable.',
      chatbot: 'AI Assistant is currently unavailable.',
      charts: 'Data visualization is currently unavailable.',
      forms: 'Form enhancements are currently unavailable.',
    };

    const message =
      errorMessages[moduleName] || `${moduleName} features are currently unavailable.`;
    this.showErrorMessage(message);
  }

  // Get loading statistics
  getLoadingStats() {
    return {
      lazyModules: { ...this.lazyModules },
      moduleLoaderStats: this.moduleLoader ? this.moduleLoader.getStats() : null,
      totalLoaded: Object.values(this.lazyModules).filter(Boolean).length,
      totalAvailable: Object.keys(this.lazyModules).length,
    };
  }

  // Preload critical modules
  async preloadCriticalModules() {
    if (!this.moduleLoader) return;

    // Preload analytics after page load
    setTimeout(() => {
      this.loadLazyModule('analytics');
    }, 3000);
  }

  // Cleanup method for SPA scenarios
  destroy() {
    this.animationManager.destroy();
    this.navigationController.destroy();
    this.interactionHandler.destroy();
    this.performanceOptimizer.destroy();

    // Cleanup lazy modules
    Object.keys(this.lazyModules).forEach(moduleName => {
      if (this.lazyModules[moduleName] && window[`${moduleName}Module`]) {
        try {
          window[`${moduleName}Module`].destroy();
        } catch (error) {
          console.warn(`Failed to destroy module ${moduleName}:`, error);
        }
      }
    });

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
