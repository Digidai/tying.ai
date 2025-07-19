// Tying.ai Components - v4.0 (True Component System)

// Navigation Component
function createNavigation(activePage = '') {
    return `
    <nav class="navbar">
        <div class="container navbar-container">
            <a href="/" class="navbar-brand">Tying.ai</a>
            <ul class="navbar-nav">
                <li><a href="/" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
                <li><a href="/careers/" class="nav-link ${activePage === 'careers' ? 'active' : ''}">Careers</a></li>
                <li><a href="/reports/" class="nav-link ${activePage === 'reports' ? 'active' : ''}">Reports</a></li>
                <li><a href="/about/" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a></li>
                <li><a href="/tools/" class="nav-link ${activePage === 'tools' ? 'active' : ''}">Tools</a></li>
            </ul>
        </div>
    </nav>`;
}

// Footer Component
function createFooter() {
    return `
    <footer style="background: var(--neutral-grey-900); color: white; padding: var(--spacing-xxl) 0;">
        <div class="container">
            <div class="grid grid-4">
                <div>
                    <h4 style="color: white; margin-bottom: var(--spacing-md);">Tying.ai</h4>
                    <p style="color: rgba(255,255,255,0.7);">Your AI career copilot for navigating the future of work.</p>
                </div>
                <div>
                    <h5 style="color: white; margin-bottom: var(--spacing-md);">Careers</h5>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/careers/tech/" style="color: rgba(255,255,255,0.7);">Technology</a></li>
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/careers/engineering/" style="color: rgba(255,255,255,0.7);">Engineering</a></li>
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/careers/business/" style="color: rgba(255,255,255,0.7);">Business</a></li>
                    </ul>
                </div>
                <div>
                    <h5 style="color: white; margin-bottom: var(--spacing-md);">Reports</h5>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/reports/market/" style="color: rgba(255,255,255,0.7);">Market Analysis</a></li>
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/reports/trends/" style="color: rgba(255,255,255,0.7);">Trend Reports</a></li>
                    </ul>
                </div>
                <div>
                    <h5 style="color: white; margin-bottom: var(--spacing-md);">Company</h5>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/about/" style="color: rgba(255,255,255,0.7);">About Us</a></li>
                        <li style="margin-bottom: var(--spacing-sm);"><a href="/tools/" style="color: rgba(255,255,255,0.7);">Tools</a></li>
                    </ul>
                </div>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); text-align: center;">
                <p style="color: rgba(255,255,255,0.5);">© 2025 Tying.ai - AI Career Intelligence Platform</p>
            </div>
        </div>
    </footer>`;
}

// Auto-detect current page and render components
function autoRenderComponents() {
    console.log('🔧 Auto-rendering components...');
    
    const path = window.location.pathname;
    let activePage = 'home';
    
    if (path.includes('/careers/')) activePage = 'careers';
    else if (path.includes('/reports/')) activePage = 'reports';
    else if (path.includes('/about/')) activePage = 'about';
    else if (path.includes('/tools/')) activePage = 'tools';
    
    console.log('📍 Current path:', path);
    console.log('🎯 Active page:', activePage);
    
    // Render navigation
    const navElement = document.getElementById('tying-nav');
    if (navElement) {
        console.log('✅ Found nav element, rendering navigation...');
        navElement.outerHTML = createNavigation(activePage);
    } else {
        console.log('❌ Nav element not found');
    }
    
    // Render footer
    const footerElement = document.getElementById('tying-footer');
    if (footerElement) {
        console.log('✅ Found footer element, rendering footer...');
        footerElement.outerHTML = createFooter();
    } else {
        console.log('❌ Footer element not found');
    }
    
    console.log('🎉 Component rendering completed');
}

// Export components for global use
window.TyingComponents = {
    createNavigation,
    createFooter,
    autoRenderComponents
};

// Auto-render when DOM is ready
console.log('🚀 Component system loaded');
if (document.readyState === 'loading') {
    console.log('⏳ DOM loading, waiting...');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM ready, rendering components...');
        autoRenderComponents();
    });
} else {
    console.log('📄 DOM already ready, rendering components...');
    autoRenderComponents();
} 