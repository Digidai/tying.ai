// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to current section in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('font-bold');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('font-bold');
            }
        });
    });
    
    // Prevent zooming on the webpage
    window.addEventListener("wheel", (e)=> {
        const isPinching = e.ctrlKey
        if(isPinching) e.preventDefault()
    }, { passive: false });
    
    // Toggle mobile navigation if needed
    const toggleButton = document.getElementById('toggle-mobile-nav');
    const navContent = document.querySelector('nav ul');
    
    if (toggleButton && navContent) {
        toggleButton.addEventListener('click', () => {
            navContent.classList.toggle('hidden');
        });
    }
});

// Enhance table responsiveness
const tables = document.querySelectorAll('table');
tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('overflow-x-auto');
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
});

// Add copy functionality to code blocks
document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button absolute top-2 right-2 bg-gray-800 text-white rounded px-2 py-1 text-xs';
    button.textContent = 'Copy';
    
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent);
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
    
    const container = document.createElement('div');
    container.className = 'relative';
    block.parentNode.insertBefore(container, block);
    container.appendChild(block);
    container.appendChild(button);
});
