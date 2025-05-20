// US Recruitment Market Analysis Report - Main script file

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts and visual content
    initMermaid();
    
    // Add scroll animation effects
    initScrollAnimations();
    
    // Initialize navigation behavior
    initNavigation();
    
    // Update report generation time
    updateReportTime();
});

// Initialize Mermaid diagrams
function initMermaid() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    }
}

// Scroll animation effect
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-element');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Navigation behavior
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });
    }
    
    // Change navbar on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('bg-white', 'shadow-md');
                header.classList.remove('bg-transparent');
            } else {
                header.classList.remove('bg-white', 'shadow-md');
                header.classList.add('bg-transparent');
            }
        }
    });

    // Smooth scroll to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close navigation menu on mobile after click
                if (navMenu && !navMenu.classList.contains('hidden')) {
                    navMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Update report generation time
function updateReportTime() {
    const timeElement = document.getElementById('report-time');
    if (timeElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        timeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}