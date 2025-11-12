// Animation Manager Module
export class AnimationManager {
    private observer: IntersectionObserver | null;
    private canAnimate: boolean;
    private performanceMode: boolean;
    private initialized: boolean;
    private activeAnimations: Set<Element>;
    private animationQueue: any[];
    private rafId: number | null;
    private parallaxElements?: Array<{ element: HTMLElement; speed: number }>;

    constructor() {
        this.observer = null;
        this.canAnimate = this.checkAnimationSupport();
        this.performanceMode = false;
        this.initialized = false;
        this.activeAnimations = new Set();
        this.animationQueue = [];
        this.rafId = null;
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

    checkAnimationSupport(): boolean {
        return (
            'IntersectionObserver' in window &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }

    detectPerformanceMode(): void {
        this.performanceMode = document.documentElement.classList.contains('performance-mode');
    }

    setupIntersectionObserver(): void {
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

    applyImmediateAnimations(): void {
        const targets = document.querySelectorAll(
            '.feature-card, .content-card, .section-title, .hero-title, .hero-subtitle'
        );
        targets.forEach(element => {
            element.classList.add('animate-in');
        });
    }

    animateElement(element: Element): void {
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

    detectAnimationType(element: Element): string {
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

    queueAnimationCleanup(element: Element, animationType: string): void {
        // Clean up animation classes after animation completes
        setTimeout(() => {
            element.classList.remove(animationType);
            this.activeAnimations.delete(element);
        }, 600); // Match CSS animation duration
    }

    initStaggerAnimations(): void {
        const grids = document.querySelectorAll('.features-grid, .content-grid');
        if (!grids.length) return;

        grids.forEach(grid => {
            this.setupStaggerObserver(grid);
        });
    }

    setupStaggerObserver(grid: Element): void {
        if (!this.canAnimate || this.performanceMode) return;

        const staggerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStaggeredGrid(entry.target);
                        staggerObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        staggerObserver.observe(grid);
    }

    animateStaggeredGrid(grid: Element): void {
        const cards = grid.querySelectorAll('.feature-card, .content-card');
        if (!cards.length) return;

        cards.forEach((card, index) => {
            const htmlCard = card as HTMLElement;
            if (htmlCard.dataset.staggered) return;

            htmlCard.dataset.staggered = 'true';
            htmlCard.style.opacity = '0';
            htmlCard.style.transform = 'translateY(30px)';

            setTimeout(() => {
                htmlCard.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                htmlCard.style.opacity = '1';
                htmlCard.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initCounterAnimations(): void {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length || !this.canAnimate) return;

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const htmlEntry = entry.target as HTMLElement;
                    if (entry.isIntersecting && !htmlEntry.dataset.counted) {
                        htmlEntry.dataset.counted = 'true';
                        this.animateCounter(htmlEntry);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element: HTMLElement): void {
        const target = parseInt(element.dataset.counter || '0');
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                this.emitAnimationEvent('counterAnimated', { element, target });
            }
        };

        requestAnimationFrame(updateCounter);
    }

    initGlassEffects(): void {
        this.initGlassShimmer();
        this.initParallaxEffects();
        this.initGlassButtonEffects();
    }

    initGlassShimmer(): void {
        const glassCards = document.querySelectorAll('.glass-card, .feature-card, .content-card');

        glassCards.forEach(card => {
            const htmlCard = card as HTMLElement;
            if (htmlCard.dataset.shimmerInit) return;

            card.addEventListener('mouseenter', () => {
                if (this.performanceMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }
                this.createShimmerEffect(htmlCard);
            });

            htmlCard.dataset.shimmerInit = 'true';
        });
    }

    createShimmerEffect(card: HTMLElement): void {
        const shimmer = document.createElement('div');
        shimmer.className = 'card-shimmer';
        shimmer.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            transform: rotate(45deg);
            pointer-events: none;
            z-index: 10;
        `;

        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(shimmer);

        // Animate shimmer
        const animation = shimmer.animate([
            { left: '-50%' },
            { left: '150%' }
        ], {
            duration: 800,
            easing: 'ease-out'
        });

        animation.onfinish = () => shimmer.remove();
    }

    initParallaxEffects(): void {
        if (this.performanceMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        this.setupParallaxElements(parallaxElements);
        this.setupParallaxScrollHandler();
    }

    setupParallaxElements(elements: NodeListOf<Element>): void {
        this.parallaxElements = Array.from(elements).map(el => ({
            element: el as HTMLElement,
            speed: parseFloat((el as HTMLElement).dataset.parallax || '0.5')
        }));
    }

    setupParallaxScrollHandler(): void {
        let ticking = false;

        const handleParallaxScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallaxPositions();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    }

    updateParallaxPositions(): void {
        if (!this.parallaxElements) return;

        const scrolled = window.pageYOffset;

        this.parallaxElements.forEach(({ element, speed }) => {
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    initGlassButtonEffects(): void {
        const glassButtons = document.querySelectorAll('.glass-button, .btn-primary');

        glassButtons.forEach(button => {
            const htmlButton = button as HTMLElement;
            if (htmlButton.dataset.glassEffect) return;

            button.addEventListener('mouseenter', () => {
                if (this.performanceMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }
                this.applyButtonHoverEffect(htmlButton);
            });

            button.addEventListener('mouseleave', () => {
                this.removeButtonHoverEffect(htmlButton);
            });

            htmlButton.dataset.glassEffect = 'true';
        });
    }

    applyButtonHoverEffect(button: HTMLElement): void {
        button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        button.style.transform = 'translateY(-2px) scale(1.02)';
    }

    removeButtonHoverEffect(button: HTMLElement): void {
        button.style.transform = 'translateY(0) scale(1)';
    }

    // Public API methods
    isInitialized(): boolean {
        return this.initialized;
    }

    observeElements(elements: Element[]): void {
        if (!this.observer) return;

        elements.forEach(element => {
            const htmlElement = element as HTMLElement;
            if (!htmlElement.dataset.animationObserved) {
                htmlElement.dataset.animationObserved = 'true';
                this.observer?.observe(element);
            }
        });
    }

    observeElement(element: Element): void {
        this.observeElements([element]);
    }

    animateElements(elements: Element[]): void {
        elements.forEach(element => this.animateElement(element));
    }

    pauseAnimations(): void {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    resumeAnimations(): void {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }

    emitAnimationEvent(type: string, data: any): void {
        window.dispatchEvent(new CustomEvent(type, { detail: data }));
    }

    destroy(): void {
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Cancel animation frame
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        // Clear active animations
        this.activeAnimations.clear();
        this.animationQueue = [];
        this.parallaxElements = [];

        this.initialized = false;
        console.log('Animation manager destroyed');
    }
}

export default AnimationManager;
