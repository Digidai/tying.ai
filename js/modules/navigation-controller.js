// Navigation Controller Module
export class NavigationController {
    constructor() {
        this.header = null;
        this.mobileToggle = null;
        this.mainNav = null;
        this.isMenuOpen = false;
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        this.ticking = false;
        this.initialized = false;
        this.cachedElements = new Map();
    }

    async init() {
        if (this.initialized) return;

        this.cacheElements();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initHeaderScroll();
        this.setupEventListeners();

        this.initialized = true;
        console.log('🧭 Navigation controller initialized');
    }

    cacheElements() {
        this.header = document.querySelector('.main-header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mainNav = document.querySelector('.main-nav');

        // Cache elements for performance
        if (this.header) this.cachedElements.set('header', this.header);
        if (this.mobileToggle) this.cachedElements.set('mobileToggle', this.mobileToggle);
        if (this.mainNav) this.cachedElements.set('mainNav', this.mainNav);
    }

    initMobileMenu() {
        if (!this.mobileToggle || !this.mainNav) return;

        // Prevent multiple initialization
        if (this.mobileToggle.dataset.menuEnhanced) return;
        this.mobileToggle.dataset.menuEnhanced = 'true';

        const toggleMenu = (forceState = null) => {
            const shouldOpen = forceState !== null ? forceState : !this.isMenuOpen;

            this.isMenuOpen = shouldOpen;

            // Update ARIA attributes
            this.mobileToggle.setAttribute('aria-expanded', String(shouldOpen));
            this.mobileToggle.classList.toggle('active', shouldOpen);
            this.mainNav.classList.toggle('active', shouldOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = shouldOpen ? 'hidden' : '';

            // Emit custom event
            window.dispatchEvent(new CustomEvent('mobileMenuToggle', {
                detail: { isOpen: shouldOpen }
            }));
        };

        this.mobileToggle.addEventListener('click', () => toggleMenu());

        // Close menu on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMenuOpen) {
                toggleMenu(false);
                this.mobileToggle.focus();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (event) => {
            if (this.isMenuOpen &&
                !this.mainNav.contains(event.target) &&
                !this.mobileToggle.contains(event.target)) {
                toggleMenu(false);
            }
        }, { passive: true });

        // Close menu on nav link click
        this.mainNav.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && this.isMenuOpen) {
                toggleMenu(false);
            }
        });
    }

    initSmoothScrolling() {
        document.addEventListener('click', (event) => {
            const anchor = event.target.closest('a[href^="#"]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href.length <= 1) return;

            // Prevent default if we can handle it
            event.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                this.scrollToElement(target);
            }
        });
    }

    scrollToElement(target) {
        const headerHeight = this.header?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        // Use smooth scrolling if not reduced motion preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
        } else {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Emit scroll event for analytics if needed
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_to', {
                'target': target.id || 'unknown'
            });
        }
    }

    initHeaderScroll() {
        if (!this.header) return;

        // Reset header state
        this.header.classList.remove('is-hidden');
        this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        const optimizedScrollHandler = () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }

    handleScroll() {
        if (!this.header) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isScrollingDown = scrollTop > this.lastScrollTop;
        const isPastThreshold = scrollTop > this.scrollThreshold;

        // Update scrolled class
        this.header.classList.toggle('scrolled', isPastThreshold);

        // Show/hide header based on scroll direction
        if (isScrollingDown && isPastThreshold) {
            this.header.classList.add('is-hidden');
        } else {
            this.header.classList.remove('is-hidden');
        }

        this.lastScrollTop = Math.max(scrollTop, 0);
    }

    setupEventListeners() {
        // Handle resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 500);
        });
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (this.isMenuOpen && window.innerWidth > 768) {
            this.toggleMobileMenu(false);
        }

        // Recalculate header height
        if (this.header) {
            document.documentElement.style.setProperty('--header-height', `${this.header.offsetHeight}px`);
        }
    }

    // Public API methods
    toggleMobileMenu(forceState = null) {
        if (this.mobileToggle) {
            const event = new Event('click');
            this.mobileToggle.dispatchEvent(event);
        }
    }

    isScrolled() {
        return this.header?.classList.contains('scrolled') || false;
    }

    isHeaderHidden() {
        return this.header?.classList.contains('is-hidden') || false;
    }

    scrollToTop() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Accessibility methods
    focusFirstNavElement() {
        const firstNavLink = this.mainNav?.querySelector('a');
        if (firstNavLink) {
            firstNavLink.focus();
        }
    }

    trapFocusInMenu() {
        if (!this.isMenuOpen) return;

        const focusableElements = this.mainNav?.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        ) || [];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        this.mainNav.addEventListener('keydown', handleKeyDown);

        // Store handler for cleanup
        this._focusTrapHandler = handleKeyDown;
    }

    destroy() {
        // Remove event listeners
        if (this._focusTrapHandler) {
            this.mainNav?.removeEventListener('keydown', this._focusTrapHandler);
        }

        // Reset state
        if (this.isMenuOpen) {
            this.toggleMobileMenu(false);
        }

        // Clear caches
        this.cachedElements.clear();

        this.initialized = false;
        console.log('Navigation controller destroyed');
    }
}

export default NavigationController;