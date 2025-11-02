export class AnimationManager {
    observer: any;
    canAnimate: boolean;
    performanceMode: boolean;
    initialized: boolean;
    activeAnimations: Set<any>;
    animationQueue: any[];
    rafId: any;
    init(): Promise<void>;
    checkAnimationSupport(): boolean;
    detectPerformanceMode(): void;
    setupIntersectionObserver(): void;
    applyImmediateAnimations(): void;
    animateElement(element: any): void;
    detectAnimationType(element: any): string;
    queueAnimationCleanup(element: any, animationType: any): void;
    initStaggerAnimations(): void;
    setupStaggerObserver(grid: any): void;
    animateStaggeredGrid(grid: any): void;
    initCounterAnimations(): void;
    animateCounter(element: any): void;
    initGlassEffects(): void;
    initGlassShimmer(): void;
    createShimmerEffect(card: any): void;
    initParallaxEffects(): void;
    setupParallaxElements(elements: any): void;
    parallaxElements: any[] | {
        element: any;
        speed: number;
    }[] | undefined;
    setupParallaxScrollHandler(): void;
    updateParallaxPositions(): void;
    initGlassButtonEffects(): void;
    applyButtonHoverEffect(button: any): void;
    removeButtonHoverEffect(button: any): void;
    observeElements(elements: any): void;
    observeElement(element: any): void;
    animateElements(elements: any): void;
    pauseAnimations(): void;
    resumeAnimations(): void;
    emitAnimationEvent(type: any, data: any): void;
    destroy(): void;
}
export default AnimationManager;
//# sourceMappingURL=animation-manager.d.ts.map