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

function highlightActiveNav() {
    const normalizePath = (p) => {
        let result = p.replace(/index\.html$/, '');
        if (!result.endsWith('/')) result += '/';
        return result;
    };

    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll('.main-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        const url = new URL(href, window.location.origin);
        const linkPath = normalizePath(url.pathname);

        const isRoot = linkPath === '/';
        if (isRoot ? currentPath === '/' : currentPath.startsWith(linkPath)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

async function initLayout() {
    await Promise.all([
        loadComponent('site-header', '/components/header.html'),
        loadComponent('site-footer', '/components/footer.html')
    ]);

    highlightActiveNav();

    if (typeof window.initGlobalInteractions === 'function') {
        window.initGlobalInteractions();
    }

    document.dispatchEvent(new CustomEvent('layout:ready'));
}

document.addEventListener('DOMContentLoaded', initLayout);
