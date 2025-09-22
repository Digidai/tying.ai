(function () {
  const state = {
    animatedSelector:
      '.feature-card, .content-card, .category-card, .search-result-item, .fact-card, .skill-category, .timeline-item, .career-link-card, [data-observe]',
    observer: null,
    canAnimate:
      'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    header: null,
    lastScrollTop: 0,
    headerScrollHandlerAttached: false,
    scrollThreshold: 100,
    performanceMode: false,
  };

  // Performance detection
  const detectPerformance = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    
    state.performanceMode = isSlowConnection || isLowEndDevice || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (state.performanceMode) {
      document.documentElement.classList.add('performance-mode');
    }
  };

  const markElement = (element, key) => {
    if (!element.dataset[key]) {
      element.dataset[key] = 'true';
      return true;
    }
    return false;
  };

  const initMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav || !markElement(toggle, 'menuEnhanced')) {
      return;
    }

    const toggleMenu = () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target) && nav.classList.contains('active')) {
        toggleMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('active')) {
        toggleMenu();
      }
    });

    nav.querySelectorAll('a').forEach((link) => {
      if (!markElement(link, 'menuEnhanced')) {
        return;
      }
      link.addEventListener('click', () => {
        if (toggle.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  };

  const initAnchorLinks = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href || href.length <= 1 || !markElement(anchor, 'smoothScroll')) {
        return;
      }

      anchor.addEventListener('click', (event) => {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  const ensureObserver = () => {
    if (!state.canAnimate || state.observer) {
      return;
    }

    state.observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animationType = element.dataset.animation || 'fadeInUp';
            element.classList.add('animate-in', animationType);
            observerInstance.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
  };

  const initAnimations = () => {
    const targets = document.querySelectorAll(state.animatedSelector);
    if (!targets.length) {
      return;
    }

    if (!state.canAnimate || state.performanceMode) {
      targets.forEach((element) => {
        if (markElement(element, 'animationApplied')) {
          element.classList.add('animate-in');
        }
      });
      return;
    }

    ensureObserver();
    targets.forEach((element) => {
      if (state.observer && markElement(element, 'animationObserved')) {
        state.observer.observe(element);
      }
    });
  };

  const handleScroll = () => {
    if (!state.header) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingDown = scrollTop > state.lastScrollTop;
    const isPastThreshold = scrollTop > state.scrollThreshold;

    // Add scrolled class for styling
    if (isPastThreshold) {
      state.header.classList.add('scrolled');
    } else {
      state.header.classList.remove('scrolled');
    }

    // Hide/show header based on scroll direction
    if (isScrollingDown && isPastThreshold) {
      state.header.classList.add('is-hidden');
    } else {
      state.header.classList.remove('is-hidden');
    }

    state.lastScrollTop = Math.max(scrollTop, 0);
  };

  const initHeaderScroll = () => {
    const header = document.querySelector('.main-header');
    if (!header) {
      return;
    }

    state.header = header;
    state.header.classList.remove('is-hidden');

    if (!state.headerScrollHandlerAttached) {
      let ticking = false;
      const optimizedScrollHandler = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
      state.headerScrollHandlerAttached = true;
    }
  };

  const initButtonEffects = () => {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach((button) => {
      if (markElement(button, 'rippleEffect')) {
        button.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          ripple.classList.add('ripple');
          
          this.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      }
    });
  };

  const initCardHoverEffects = () => {
    document.querySelectorAll('.feature-card, .content-card').forEach((card) => {
      if (markElement(card, 'hoverEffect')) {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
        });
      }
    });
  };

  const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  const initGlobalInteractions = () => {
    detectPerformance();
    initMobileMenu();
    initAnchorLinks();
    initAnimations();
    initHeaderScroll();
    initButtonEffects();
    initCardHoverEffects();
    initLazyLoading();
  };

  // Add CSS for ripple effect
  const addRippleStyles = () => {
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        .btn {
          position: relative;
          overflow: hidden;
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .performance-mode * {
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  window.initGlobalInteractions = initGlobalInteractions;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addRippleStyles();
      initGlobalInteractions();
    });
  } else {
    addRippleStyles();
    initGlobalInteractions();
  }
})();
