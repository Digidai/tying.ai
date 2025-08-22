async function loadComponent(id, url) {
    const container = document.getElementById(id);
    if (!container) return;
    try {
        const response = await fetch(url);
        if (response.ok) {
            container.innerHTML = await response.text();
        }
    } catch (err) {
        console.error(`Failed to load ${url}`, err);
    }
}

async function initLayout() {
    await Promise.all([
        loadComponent('site-header', '/components/header.html'),
        loadComponent('site-footer', '/components/footer.html')
    ]);

    // Highlight active navigation link
    const path = window.location.pathname;
    document.querySelectorAll('.main-nav .nav-link').forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .content-card').forEach(el => {
        observer.observe(el);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        lastScrollTop = scrollTop;
    });
}

document.addEventListener('DOMContentLoaded', initLayout);
