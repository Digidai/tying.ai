// Animation Manager Module - TypeScript Version
export class AnimationManager {
    private observer: IntersectionObserver | null = null;
    private canAnimate: boolean;
    private performanceMode: boolean = false;
    private initialized: boolean = false;
    private activeAnimations: Set<Element> = new Set();
    private animationQueue: any[] = [];
    private rafId: number | null = null;

    constructor() {
        this.canAnimate = this.checkAnimationSupport();
    }

    async init(): Promise<void> {
        if (this.initialized) return;

        this.detectPerformanceMode();
        this.setupIntersectionObserver();
        this.initStaggerAnimations();
        this.initCounterAnimations();
        this.initGlassEffects();

        this.initialized = true;
        console.log('✨ Animation manager initialized');
    }

    private checkAnimationSupport(): boolean {
        return (
            'IntersectionObserver' in window &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }

    private detectPerformanceMode(): void {
        this.performanceMode = document.documentElement.classList.contains('performance-mode');
    }

    private setupIntersectionObserver(): void {
        if (!this.canAnimate || this.performanceMode) {
            this.applyImmediateAnimations();
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer?.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    }

    private applyImmediateAnimations(): void {
        const targets = document.querySelectorAll(
            '.feature-card, .content-card, .section-title, .hero-title, .hero-subtitle'
        );
        targets.forEach(element => {
            element.classList.add('animate-in');
        });
    }

    private animateElement(element: Element): void {
        if (this.activeAnimations.has(element)) return;

        const htmlElement = element as HTMLElement;
        const animationType = htmlElement.dataset.animation || this.detectAnimationType(element);

        // Add animation classes
        element.classList.add('animate-in', animationType);
        this.activeAnimations.add(element);

        // Queue animation end cleanup
        this.queueAnimationCleanup(element, animationType);

        // Emit animation event
        this.emitAnimationEvent('elementAnimated', { element, animationType });
    }

    private detectAnimationType(element: Element): string {
        if (element.classList.contains('feature-card') || element.classList.contains('content-card')) {
            return 'fadeInUp';
        }
        if (element.classList.contains('section-title')) {
            return 'fadeInUp';
        }
        if (element.classList.contains('hero-title')) {
            return 'fadeInUp';
        }
        if (element.classList.contains('hero-subtitle')) {
            return 'fadeInUp';
        }
        return 'fadeInUp'; // Default animation
    }

    private queueAnimationCleanup(element: Element, animationType: string): void {
        // Cleanup after animation completes
        setTimeout(() => {
            this.activeAnimations.delete(element);
        }, 1000);
    }

    private emitAnimationEvent(eventName: string, detail: any): void {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    private initStaggerAnimations(): void {
        // Initialize staggered animations for grouped elements
    }

    private initCounterAnimations(): void {
        // Initialize counter animations
    }

    private initGlassEffects(): void {
        // Initialize glass morphism effects
    }

    /**
     * Check if manager is initialized
     */
    get isInitialized(): boolean {
        return this.initialized;
    }

    destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.activeAnimations.clear();
        this.initialized = false;
    }
}
