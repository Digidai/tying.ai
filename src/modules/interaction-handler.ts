// Interaction Handler Module - TypeScript Version
export class InteractionHandler {
    private initialized: boolean = false;
    private cachedElements: Map<string, HTMLElement> = new Map();
    private activeRipples: Set<HTMLElement> = new Set();
    private clickHandlers: Map<string, Function> = new Map();
    private scrollHandlers: Function[] = [];

    async init(): Promise<void> {
        if (this.initialized) return;

        this.initRippleEffects();
        this.initCardHoverEffects();
        this.initButtonInteractions();
        this.initFormInteractions();
        this.initKeyboardNavigation();
        this.setupEventDelegation();

        this.initialized = true;
        console.log('🎯 Interaction handler initialized');
    }

    private initRippleEffects(): void {
        // Use event delegation for better performance
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const button = target.closest('.btn, .glass-button') as HTMLElement;
            if (!button) return;

            // Prevent multiple ripples on rapid clicks
            if ((button as any).dataset.rippleProcessing) return;
            (button as any).dataset.rippleProcessing = 'true';

            setTimeout(() => {
                delete (button as any).dataset.rippleProcessing;
            }, 100);

            this.createRipple(button, event);
        }, { passive: true });
    }

    private createRipple(button: HTMLElement, event: MouseEvent): void {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
        `;

        ripple.classList.add('ripple');
        button.appendChild(ripple);
        this.activeRipples.add(ripple);

        // Animate ripple
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.6s linear, opacity 0.6s linear';
            ripple.style.transform = 'scale(4)';
            ripple.style.opacity = '0';

            setTimeout(() => {
                this.removeRipple(ripple);
            }, 600);
        });

        // Emit ripple event
        this.emitInteractionEvent('rippleCreated', { button, ripple });
    }

    private removeRipple(ripple: HTMLElement): void {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
        this.activeRipples.delete(ripple);
    }

    private initCardHoverEffects(): void {
        // Use event delegation for card hover effects
        document.addEventListener('mouseenter', (event) => {
            const target = event.target as HTMLElement;
            const card = target.closest('.feature-card, .content-card, .glass-card') as HTMLElement;
            if (!card || (card as any).dataset.hoverEffect) return;

            (card as any).dataset.hoverEffect = 'true';
            this.applyCardHoverEffect(card, true);
        }, true);

        document.addEventListener('mouseleave', (event) => {
            const target = event.target as HTMLElement;
            const card = target.closest('.feature-card, .content-card, .glass-card') as HTMLElement;
            if (!card) return;

            this.applyCardHoverEffect(card, false);
        }, true);
    }

    private applyCardHoverEffect(card: HTMLElement, isHovering: boolean): void {
        if (isHovering) {
            card.style.transform = 'translateY(-5px)';
        } else {
            card.style.transform = '';
        }
    }

    private initButtonInteractions(): void {
        // Initialize button interactions
    }

    private initFormInteractions(): void {
        // Initialize form interactions
    }

    private initKeyboardNavigation(): void {
        // Initialize keyboard navigation
    }

    private setupEventDelegation(): void {
        // Setup event delegation for dynamic content
    }

    private emitInteractionEvent(eventName: string, detail: any): void {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * Check if handler is initialized
     */
    get isInitialized(): boolean {
        return this.initialized;
    }

    destroy(): void {
        this.cachedElements.clear();
        this.activeRipples.clear();
        this.clickHandlers.clear();
        this.scrollHandlers = [];
        this.initialized = false;
    }
}
