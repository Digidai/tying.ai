// Interaction Handler Module
declare const gtag: (...args: any[]) => void;

export class InteractionHandler {
    private initialized: boolean;
    private cachedElements: Map<string, HTMLElement>;
    private activeRipples: Set<HTMLElement>;
    private clickHandlers: Map<string, (link: HTMLElement, event: Event) => void>;
    private scrollHandlers: any[];

    constructor() {
        this.initialized = false;
        this.cachedElements = new Map();
        this.activeRipples = new Set();
        this.clickHandlers = new Map();
        this.scrollHandlers = [];
    }

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

    initRippleEffects(): void {
        // Use event delegation for better performance
        document.addEventListener('click', (event) => {
            const button = (event.target as HTMLElement).closest('.btn, .glass-button') as HTMLElement;
            if (!button) return;

            // Prevent multiple ripples on rapid clicks
            if (button.dataset.rippleProcessing) return;
            button.dataset.rippleProcessing = 'true';

            setTimeout(() => {
                delete button.dataset.rippleProcessing;
            }, 100);

            this.createRipple(button, event as MouseEvent);
        }, { passive: true });
    }

    createRipple(button: HTMLElement, event: MouseEvent): void {
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

    removeRipple(ripple: HTMLElement): void {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
        this.activeRipples.delete(ripple);
    }

    initCardHoverEffects(): void {
        // Use event delegation for card hover effects
        document.addEventListener('mouseenter', (event) => {
            const card = (event.target as HTMLElement).closest('.feature-card, .content-card, .glass-card') as HTMLElement;
            if (!card || card.dataset.hoverEffect) return;

            card.dataset.hoverEffect = 'true';
            this.applyCardHoverEffect(card, true);
        }, true);

        document.addEventListener('mouseleave', (event) => {
            const card = (event.target as HTMLElement).closest('.feature-card, .content-card, .glass-card') as HTMLElement;
            if (!card || !card.dataset.hoverEffect) return;

            this.applyCardHoverEffect(card, false);
            delete card.dataset.hoverEffect;
        }, true);
    }

    applyCardHoverEffect(card: HTMLElement, isHovering: boolean): void {
        if (isHovering) {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 12px 40px rgba(31, 38, 135, 0.3)';
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        }
    }

    initButtonInteractions(): void {
        // Enhanced button interactions
        document.addEventListener('click', (event) => {
            const button = (event.target as HTMLElement).closest('.btn, button[onclick]') as HTMLElement;
            if (!button) return;

            this.handleButtonClick(button, event);
        });
    }

    handleButtonClick(button: HTMLElement, event: Event): void {
        // Add loading state for buttons with data-loading
        if (button.dataset.loading) {
            this.setButtonLoading(button, true);
        }

        // Emit button click event
        this.emitInteractionEvent('buttonClicked', { button, event });

        // Track button clicks in analytics if available
        if (typeof gtag !== 'undefined') {
            const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || 'unknown';
            gtag('event', 'button_click', {
                'button_text': buttonText,
                'button_class': button.className
            });
        }
    }

    setButtonLoading(button: HTMLElement, isLoading: boolean): void {
        if (isLoading) {
            button.dataset.originalText = button.textContent || '';
            button.textContent = 'Loading...';
            (button as HTMLButtonElement).disabled = true;
            button.classList.add('loading');
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            (button as HTMLButtonElement).disabled = false;
            button.classList.remove('loading');
            delete button.dataset.originalText;
        }
    }

    initFormInteractions(): void {
        // Enhanced form interactions
        document.addEventListener('submit', (event) => {
            const form = event.target as HTMLFormElement;
            if (!form.matches('form')) return;

            this.handleFormSubmit(form, event);
        });

        // Real-time validation
        document.addEventListener('input', (event) => {
            const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (!input.matches('input, textarea, select')) return;

            this.handleInputValidation(input);
        });

        // Focus enhancement
        document.addEventListener('focus', (event) => {
            const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (!input.matches('input, textarea, select')) return;

            this.enhanceInputFocus(input, true);
        }, true);

        document.addEventListener('blur', (event) => {
            const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (!input.matches('input, textarea, select')) return;

            this.enhanceInputFocus(input, false);
        }, true);
    }

    handleFormSubmit(form: HTMLFormElement, event: Event): void {
        // Add loading state
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLElement;
        if (submitButton) {
            this.setButtonLoading(submitButton, true);
        }

        // Disable form inputs during submission
        const inputs = form.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            if (input !== submitButton) {
                (input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement).disabled = true;
            }
        });

        // Emit form submit event
        this.emitInteractionEvent('formSubmitted', { form, event });

        // Track form submissions
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_id': form.id || 'unknown',
                'form_class': form.className
            });
        }

        // Auto-enable form after 5 seconds (fallback)
        setTimeout(() => {
            this.enableForm(form);
        }, 5000);
    }

    enableForm(form: HTMLFormElement): void {
        const inputs = form.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            (input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement).disabled = false;
        });

        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLElement;
        if (submitButton) {
            this.setButtonLoading(submitButton, false);
        }
    }

    handleInputValidation(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
        if (!input.required && !(input as HTMLInputElement).pattern) return;

        const isValid = input.checkValidity();
        const errorMessage = input.validationMessage;

        this.showInputValidation(input, isValid, errorMessage);

        // Emit validation event
        this.emitInteractionEvent('inputValidated', { input, isValid, errorMessage });
    }

    showInputValidation(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, isValid: boolean, errorMessage: string): void {
        // Remove existing validation message
        const existingMessage = input.parentNode?.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (!isValid && errorMessage) {
            const messageElement = document.createElement('div');
            messageElement.className = 'validation-message error-state';
            messageElement.textContent = errorMessage;
            messageElement.style.cssText = `
                font-size: 12px;
                margin-top: 4px;
                color: #DC2626;
            `;

            input.parentNode?.appendChild(messageElement);
        }

        // Update input styling
        (input as HTMLElement).style.borderColor = isValid ? '' : '#DC2626';
    }

    enhanceInputFocus(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, isFocused: boolean): void {
        if (isFocused) {
            (input as HTMLElement).style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
            (input as HTMLElement).style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        } else {
            (input as HTMLElement).style.boxShadow = '';
        }
    }

    initKeyboardNavigation(): void {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardNavigation(event);
        });

        // Skip links functionality
        this.initSkipLinks();
    }

    handleKeyboardNavigation(event: KeyboardEvent): void {
        // Handle common keyboard shortcuts
        if (event.altKey) {
            switch (event.key) {
                case 'h':
                    event.preventDefault();
                    this.scrollToTop();
                    break;
                case 'm':
                    event.preventDefault();
                    this.toggleMobileMenu();
                    break;
                case 's':
                    event.preventDefault();
                    this.focusSearchInput();
                    break;
            }
        }

        // Handle escape key
        if (event.key === 'Escape') {
            this.handleEscapeKey(event);
        }
    }

    initSkipLinks(): void {
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = (link as HTMLAnchorElement).getAttribute('href')?.substring(1);
                const target = targetId ? document.getElementById(targetId) : null;
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        });
    }

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleMobileMenu(): void {
        const mobileToggle = document.querySelector('.mobile-menu-toggle') as HTMLElement;
        if (mobileToggle) {
            mobileToggle.click();
        }
    }

    focusSearchInput(): void {
        const searchInput = document.querySelector('.search-input') as HTMLElement;
        if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    handleEscapeKey(event: KeyboardEvent): void {
        // Close modals, menus, or other overlays
        const activeElement = document.activeElement as HTMLElement;
        const modal = activeElement?.closest('.modal') as HTMLElement;
        const menu = activeElement?.closest('.main-nav.active');

        if (modal) {
            this.closeModal(modal);
        } else if (menu) {
            this.toggleMobileMenu();
        }
    }

    closeModal(modal: HTMLElement): void {
        // Generic modal closing logic
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');

        // Focus trap cleanup
        const triggerButton = document.querySelector(`[data-modal-target="${modal.id}"]`) as HTMLElement;
        if (triggerButton) {
            triggerButton.focus();
        }

        this.emitInteractionEvent('modalClosed', { modal });
    }

    setupEventDelegation(): void {
        // Centralized event delegation for better performance
        this.clickHandlers.set('external-link', this.handleExternalLinkClick.bind(this));
        this.clickHandlers.set('download-link', this.handleDownloadLinkClick.bind(this));
        this.clickHandlers.set('social-link', this.handleSocialLinkClick.bind(this));

        // Apply delegation
        document.addEventListener('click', (event) => {
            this.handleDelegatedClick(event);
        }, { passive: true });
    }

    handleDelegatedClick(event: Event): void {
        const link = (event.target as HTMLElement).closest('a') as HTMLElement;
        if (!link) return;

        // Check for specific link types
        for (const [type, handler] of this.clickHandlers) {
            if (link.classList.contains(type) || link.dataset.linkType === type) {
                handler(link, event);
                break;
            }
        }
    }

    handleExternalLinkClick(link: HTMLElement, event: Event): void {
        const anchorLink = link as HTMLAnchorElement;
        // Add target="_blank" for external links
        if (!anchorLink.target) {
            anchorLink.target = '_blank';
            anchorLink.rel = 'noopener noreferrer';
        }

        // Track external link clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'outbound_link', {
                'url': anchorLink.href
            });
        }
    }

    handleDownloadLinkClick(link: HTMLElement, event: Event): void {
        const anchorLink = link as HTMLAnchorElement;
        // Track download clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'filename': anchorLink.href.split('/').pop()
            });
        }
    }

    handleSocialLinkClick(link: HTMLElement, event: Event): void {
        const anchorLink = link as HTMLAnchorElement;
        // Track social link clicks
        const platform = anchorLink.href.match(/(?:facebook|twitter|linkedin|instagram|github)/i)?.[0] || 'unknown';

        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_link', {
                'platform': platform,
                'url': anchorLink.href
            });
        }
    }

    // Public API methods
    isInitialized(): boolean {
        return this.initialized;
    }

    addClickHandler(type: string, handler: (link: HTMLElement, event: Event) => void): void {
        this.clickHandlers.set(type, handler);
    }

    removeClickHandler(type: string): void {
        this.clickHandlers.delete(type);
    }

    emitInteractionEvent(type: string, data: any): void {
        window.dispatchEvent(new CustomEvent(type, { detail: data }));
    }

    destroy(): void {
        // Clean up active ripples
        this.activeRipples.forEach(ripple => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        });
        this.activeRipples.clear();

        // Clear caches
        this.cachedElements.clear();
        this.clickHandlers.clear();

        this.initialized = false;
        console.log('Interaction handler destroyed');
    }
}

export default InteractionHandler;
