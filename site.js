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
    };

    toggle.addEventListener('click', toggleMenu);

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
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            entry.target.classList.add('animate-in');
            observerInstance.unobserve(entry.target);
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

    if (!state.canAnimate) {
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
    if (scrollTop > state.lastScrollTop && scrollTop > 120) {
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
      window.addEventListener('scroll', handleScroll, { passive: true });
      state.headerScrollHandlerAttached = true;
    }
  };

  const initGlobalInteractions = () => {
    initMobileMenu();
    initAnchorLinks();
    initAnimations();
    initHeaderScroll();
  };

  window.initGlobalInteractions = initGlobalInteractions;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalInteractions);
  } else {
    initGlobalInteractions();
  }
})();
