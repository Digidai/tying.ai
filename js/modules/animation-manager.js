// Animation Manager Module
export class AnimationManager {
  constructor() {
    this.observer = null;
    this.canAnimate = this.checkAnimationSupport();
    this.performanceMode = false;
    this.initialized = false;
    this.activeAnimations = new Set();
    this.animationQueue = [];
    this.rafId = null;
  }

  async init() {
    if (this.initialized) return;

    this.detectPerformanceMode();
    this.setupIntersectionObserver();
    this.initStaggerAnimations();
    this.initCounterAnimations();
    this.initGlassEffects();

    this.initialized = true;
    console.log('✨ Animation manager initialized');
  }

  checkAnimationSupport() {
    return (
      'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  detectPerformanceMode() {
    this.performanceMode = document.documentElement.classList.contains('performance-mode');
  }

  setupIntersectionObserver() {
    if (!this.canAnimate || this.performanceMode) {
      this.applyImmediateAnimations();
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );
  }

  applyImmediateAnimations() {
    const targets = document.querySelectorAll(
      '.feature-card, .content-card, .section-title, .hero-title, .hero-subtitle',
    );
    targets.forEach(element => {
      element.classList.add('animate-in');
    });
  }

  animateElement(element) {
    if (this.activeAnimations.has(element)) return;

    const animationType = element.dataset.animation || this.detectAnimationType(element);

    // Add animation classes
    element.classList.add('animate-in', animationType);
    this.activeAnimations.add(element);

    // Queue animation end cleanup
    this.queueAnimationCleanup(element, animationType);

    // Emit animation event
    this.emitAnimationEvent('elementAnimated', { element, animationType });
  }

  detectAnimationType(element) {
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

  queueAnimationCleanup(element, animationType) {
    // Clean up animation classes after animation completes
    setTimeout(() => {
      element.classList.remove(animationType);
      this.activeAnimations.delete(element);
    }, 600); // Match CSS animation duration
  }

  initStaggerAnimations() {
    const grids = document.querySelectorAll('.features-grid, .content-grid');
    if (!grids.length) return;

    grids.forEach(grid => {
      this.setupStaggerObserver(grid);
    });
  }

  setupStaggerObserver(grid) {
    if (!this.canAnimate || this.performanceMode) return;

    const staggerObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStaggeredGrid(entry.target);
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    staggerObserver.observe(grid);
  }

  animateStaggeredGrid(grid) {
    const cards = grid.querySelectorAll('.feature-card, .content-card');
    if (!cards.length) return;

    cards.forEach((card, index) => {
      if (card.dataset.staggered) return;

      card.dataset.staggered = 'true';
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';

      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length || !this.canAnimate) return;

    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            this.animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = currentTime => {
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

  initGlassEffects() {
    this.initGlassShimmer();
    this.initParallaxEffects();
    this.initGlassButtonEffects();
  }

  initGlassShimmer() {
    const glassCards = document.querySelectorAll('.glass-card, .feature-card, .content-card');

    glassCards.forEach(card => {
      if (card.dataset.shimmerInit) return;

      card.addEventListener('mouseenter', event => {
        if (this.performanceMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        this.createShimmerEffect(card);
      });

      card.dataset.shimmerInit = 'true';
    });
  }

  createShimmerEffect(card) {
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
    shimmer.animate([{ left: '-50%' }, { left: '150%' }], {
      duration: 800,
      easing: 'ease-out',
    }).onfinish = () => shimmer.remove();
  }

  initParallaxEffects() {
    if (this.performanceMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    this.setupParallaxElements(parallaxElements);
    this.setupParallaxScrollHandler();
  }

  setupParallaxElements(elements) {
    this.parallaxElements = Array.from(elements).map(el => ({
      element: el,
      speed: parseFloat(el.dataset.parallax) || 0.5,
    }));
  }

  setupParallaxScrollHandler() {
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

  updateParallaxPositions() {
    if (!this.parallaxElements) return;

    const scrolled = window.pageYOffset;

    this.parallaxElements.forEach(({ element, speed }) => {
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  initGlassButtonEffects() {
    const glassButtons = document.querySelectorAll('.glass-button, .btn-primary');

    glassButtons.forEach(button => {
      if (button.dataset.glassEffect) return;

      button.addEventListener('mouseenter', () => {
        if (this.performanceMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        this.applyButtonHoverEffect(button);
      });

      button.addEventListener('mouseleave', () => {
        this.removeButtonHoverEffect(button);
      });

      button.dataset.glassEffect = 'true';
    });
  }

  applyButtonHoverEffect(button) {
    button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    button.style.transform = 'translateY(-2px) scale(1.02)';
  }

  removeButtonHoverEffect(button) {
    button.style.transform = 'translateY(0) scale(1)';
  }

  // Public API methods
  observeElements(elements) {
    if (!this.observer) return;

    elements.forEach(element => {
      if (!element.dataset.animationObserved) {
        element.dataset.animationObserved = 'true';
        this.observer.observe(element);
      }
    });
  }

  observeElement(element) {
    return this.observeElements([element]);
  }

  animateElements(elements) {
    elements.forEach(element => this.animateElement(element));
  }

  pauseAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
  }

  resumeAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'running');
  }

  emitAnimationEvent(type, data) {
    window.dispatchEvent(new CustomEvent(type, { detail: data }));
  }

  destroy() {
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
