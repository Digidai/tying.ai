/**
 * Dynamic Module Loader for Code Splitting and Lazy Loading
 * Improves performance by loading JavaScript modules only when needed
 */

class ModuleLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
    this.moduleCache = new Map();
    this.basePath = '/js/modules';
    this.observer = null;
    this.setupIntersectionObserver();
  }

  /**
   * Setup Intersection Observer for automatic lazy loading
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, fallback to manual loading');
      return;
    }

    // Observe elements with data-module attribute
    const moduleObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const moduleName = element.dataset.module;
            if (moduleName && !this.isModuleLoaded(moduleName)) {
              this.loadModule(moduleName, element);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
    );

    // Observe all elements with data-module attribute
    const observerElements = document.querySelectorAll('[data-module]');
    observerElements.forEach(element => {
      moduleObserver.observe(element);
    });
  }

  /**
   * Load a JavaScript module dynamically
   * @param {string} moduleName - Name of the module to load
   * @param {HTMLElement} triggerElement - Element that triggered the load
   * @returns {Promise<any>} Promise that resolves with the loaded module
   */
  async loadModule(moduleName, triggerElement = null) {
    // Return existing promise if already loading
    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    // Return cached module if already loaded
    if (this.moduleCache.has(moduleName)) {
      return this.moduleCache.get(moduleName);
    }

    // Create loading promise
    const loadingPromise = this.performModuleLoad(moduleName, triggerElement);
    this.loadingPromises.set(moduleName, loadingPromise);

    try {
      const module = await loadingPromise;
      this.moduleCache.set(moduleName, module);
      this.loadedModules.add(moduleName);

      // Emit custom event
      window.dispatchEvent(
        new CustomEvent('module:loaded', {
          detail: { moduleName, module, triggerElement },
        }),
      );

      console.log(`📦 Module loaded: ${moduleName}`);
      return module;
    } catch (error) {
      console.error(`❌ Failed to load module: ${moduleName}`, error);

      // Emit error event
      window.dispatchEvent(
        new CustomEvent('module:error', {
          detail: { moduleName, error, triggerElement },
        }),
      );

      throw error;
    } finally {
      // Clean up loading promise
      this.loadingPromises.delete(moduleName);
    }
  }

  /**
   * Perform the actual module loading
   * @param {string} moduleName - Name of the module
   * @param {HTMLElement} triggerElement - Element that triggered the load
   * @returns {Promise<any>} Promise that resolves with the loaded module
   */
  async performModuleLoad(moduleName, triggerElement) {
    const moduleUrl = `${this.basePath}/${moduleName}.js`;

    // Add loading indicator to trigger element
    if (triggerElement) {
      this.addLoadingIndicator(triggerElement);
    }

    try {
      // Create dynamic import
      const module = await import(moduleUrl);

      // Remove loading indicator
      if (triggerElement) {
        this.removeLoadingIndicator(triggerElement);
      }

      // Return the module export
      return module.default || module;
    } catch (error) {
      // Remove loading indicator on error
      if (triggerElement) {
        this.removeLoadingIndicator(triggerElement);
      }
      throw error;
    }
  }

  /**
   * Load multiple modules in parallel
   * @param {string[]} moduleNames - Array of module names to load
   * @returns {Promise<any[]>} Promise that resolves with all loaded modules
   */
  async loadModules(moduleNames) {
    const loadPromises = moduleNames.map(name =>
      this.loadModule(name).catch(error => {
        console.warn(`⚠️ Failed to load module ${name}:`, error);
        return null;
      }),
    );

    const modules = await Promise.all(loadPromises);
    return modules.filter(module => module !== null);
  }

  /**
   * Preload critical modules for better performance
   * @param {string[]} criticalModules - Array of critical module names
   */
  preloadModules(criticalModules) {
    if (criticalModules.length === 0) return;

    console.log('⚡ Preloading critical modules:', criticalModules.join(', '));

    // Preload with low priority
    setTimeout(() => {
      criticalModules.forEach(moduleName => {
        if (!this.isModuleLoaded(moduleName)) {
          this.loadModule(moduleName).catch(error => {
            console.warn(`⚠️ Failed to preload module ${moduleName}:`, error);
          });
        }
      });
    }, 1000);
  }

  /**
   * Load module on demand based on user interaction
   * @param {string} moduleName - Module name
   * @param {string} trigger - Trigger event type (click, scroll, etc.)
   * @param {HTMLElement} element - Element to attach listener to
   */
  loadOnDemand(moduleName, trigger = 'click', element = null) {
    if (!element) {
      console.warn(`⚠️ No element provided for on-demand loading of module: ${moduleName}`);
      return;
    }

    const handler = async event => {
      event.preventDefault();

      // Remove event listener to prevent multiple loads
      element.removeEventListener(trigger, handler);

      try {
        await this.loadModule(moduleName, element);
      } catch (error) {
        console.error(`❌ Failed to load module on demand: ${moduleName}`, error);
      }
    };

    element.addEventListener(trigger, handler);

    // Store handler for cleanup
    element.dataset.onDemandHandler = moduleName;
  }

  /**
   * Check if a module is already loaded
   * @param {string} moduleName - Module name to check
   * @returns {boolean} Whether the module is loaded
   */
  isModuleLoaded(moduleName) {
    return this.loadedModules.has(moduleName);
  }

  /**
   * Get cached module
   * @param {string} moduleName - Module name
   * @returns {any|null} Cached module or null
   */
  getCachedModule(moduleName) {
    return this.moduleCache.get(moduleName) || null;
  }

  /**
   * Unload a module (for testing or memory management)
   * @param {string} moduleName - Module name to unload
   */
  unloadModule(moduleName) {
    this.loadedModules.delete(moduleName);
    this.moduleCache.delete(moduleName);
    this.loadingPromises.delete(moduleName);

    console.log(`📦 Module unloaded: ${moduleName}`);
  }

  /**
   * Clear all cached modules
   */
  clearCache() {
    this.moduleCache.clear();
    console.log('🧹 Module cache cleared');
  }

  /**
   * Get loading statistics
   * @returns {Object} Loading statistics
   */
  getStats() {
    return {
      loadedModules: Array.from(this.loadedModules),
      loadingModules: Array.from(this.loadingPromises.keys()),
      cachedModules: Array.from(this.moduleCache.keys()),
      totalLoaded: this.loadedModules.size,
      totalLoading: this.loadingPromises.size,
      totalCached: this.moduleCache.size,
    };
  }

  /**
   * Add loading indicator to element
   * @param {HTMLElement} element - Element to add indicator to
   */
  addLoadingIndicator(element) {
    if (element.classList.contains('loading')) return;

    element.classList.add('loading');

    // Create loading spinner if needed
    if (!element.querySelector('.loading-spinner')) {
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.innerHTML = `
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            `;
      spinner.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                transform: translate(-50%, -50%);
                z-index: 10;
            `;

      element.style.position = 'relative';
      element.appendChild(spinner);
    }
  }

  /**
   * Remove loading indicator from element
   * @param {HTMLElement} element - Element to remove indicator from
   */
  removeLoadingIndicator(element) {
    element.classList.remove('loading');

    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  /**
   * Setup Service Worker for module caching
   */
  setupServiceWorkerCaching() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send message to service worker to cache modules
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_MODULES',
        modules: Array.from(this.loadedModules),
      });
    }
  }

  /**
   * Initialize with common page modules
   */
  initialize() {
    console.log('🚀 Initializing module loader...');

    // Common modules that might be needed immediately
    const commonModules = [];

    // Preload common modules after page load
    setTimeout(() => {
      this.preloadModules(commonModules);
    }, 2000);

    // Setup service worker caching
    this.setupServiceWorkerCaching();

    console.log('✅ Module loader initialized');
  }
}

// Create and export singleton instance
const moduleLoader = new ModuleLoader();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    moduleLoader.initialize();
  });
} else {
  moduleLoader.initialize();
}

// Export for global access
window.ModuleLoader = moduleLoader;

export default moduleLoader;
