// Navigation Controller Module - TypeScript Version
export class NavigationController {
    private header: HTMLElement | null = null;
    private mobileToggle: HTMLElement | null = null;
    private mainNav: HTMLElement | null = null;
    private isMenuOpen: boolean = false;
    private lastScrollTop: number = 0;
    private scrollThreshold: number = 100;
    private ticking: boolean = false;
    private initialized: boolean = false;
    private cachedElements: Map<string, HTMLElement> = new Map();

    async init(): Promise<void> {
        if (this.initialized) return;

        this.cacheElements();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initHeaderScroll();
        this.setupEventListeners();

        this.initialized = true;
        console.log('🧭 Navigation controller initialized');
    }

    private cacheElements(): void {
        this.header = document.querySelector('.main-header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mainNav = document.querySelector('.main-nav');

        // Cache elements for performance
        if (this.header) this.cachedElements.set('header', this.header);
        if (this.mobileToggle) this.cachedElements.set('mobileToggle', this.mobileToggle);
        if (this.mainNav) this.cachedElements.set('mainNav', this.mainNav);
    }

    private initMobileMenu(): void {
        if (!this.mobileToggle || !this.mainNav) return;

        // Prevent multiple initialization
        if ((this.mobileToggle as any).dataset.menuEnhanced) return;
        (this.mobileToggle as any).dataset.menuEnhanced = 'true';

        const toggleMenu = (forceState: boolean | null = null) => {
            const shouldOpen = forceState !== null ? forceState : !this.isMenuOpen;

            this.isMenuOpen = shouldOpen;

            // Update ARIA attributes
            this.mobileToggle?.setAttribute('aria-expanded', String(shouldOpen));
            this.mobileToggle?.classList.toggle('active', shouldOpen);
            this.mainNav?.classList.toggle('active', shouldOpen);

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
                this.mobileToggle?.focus();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (event) => {
            if (this.isMenuOpen &&
                this.mainNav &&
                this.mobileToggle &&
                !this.mainNav.contains(event.target as Node) &&
                !this.mobileToggle.contains(event.target as Node)) {
                toggleMenu(false);
            }
        }, { passive: true });

        // Close menu on nav link click
        this.mainNav.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a');
            if (link && this.isMenuOpen) {
                toggleMenu(false);
            }
        });
    }

    private initSmoothScrolling(): void {
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href.length <= 1) return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    private initHeaderScroll(): void {
        // Initialize header scroll behavior
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleHeaderScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    private handleHeaderScroll(): void {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > this.scrollThreshold) {
            this.header?.classList.add('scrolled');
        } else {
            this.header?.classList.remove('scrolled');
        }

        this.lastScrollTop = scrollTop;
    }

    private setupEventListeners(): void {
        // Setup additional event listeners
    }

    /**
     * Check if controller is initialized
     */
    get isInitialized(): boolean {
        return this.initialized;
    }

    destroy(): void {
        this.cachedElements.clear();
        this.initialized = false;
    }
}
