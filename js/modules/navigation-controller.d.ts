export class NavigationController {
    header: Element | null;
    mobileToggle: Element | null;
    mainNav: Element | null;
    isMenuOpen: boolean;
    lastScrollTop: number;
    scrollThreshold: number;
    ticking: boolean;
    initialized: boolean;
    cachedElements: Map<any, any>;
    init(): Promise<void>;
    cacheElements(): void;
    initMobileMenu(): void;
    initSmoothScrolling(): void;
    scrollToElement(target: any): void;
    initHeaderScroll(): void;
    handleScroll(): void;
    setupEventListeners(): void;
    handleResize(): void;
    toggleMobileMenu(forceState?: null): void;
    isScrolled(): boolean;
    isHeaderHidden(): boolean;
    scrollToTop(): void;
    focusFirstNavElement(): void;
    trapFocusInMenu(): void;
    _focusTrapHandler: ((event: any) => void) | undefined;
    destroy(): void;
}
export default NavigationController;
//# sourceMappingURL=navigation-controller.d.ts.map