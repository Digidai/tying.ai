document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
});

function loadNavbar() {
    const navbarHTML = `
        <header class="container">
            <nav style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md) 0;">
                <a href="/" style="font-weight: 700; font-size: 1.5rem; text-decoration: none; color: var(--text-primary);">Tying.ai</a>
                <div>
                    <a href="/careers" style="margin-left: var(--spacing-lg);">Careers</a>
                    <a href="/reports" style="margin-left: var(--spacing-lg);">Reports</a>
                    <a href="/tools" style="margin-left: var(--spacing-lg);">Tools</a>
                    <a href="/about" style="margin-left: var(--spacing-lg);">About</a>
                </div>
            </nav>
        </header>
    `;
    const navbarElement = document.createElement('div');
    navbarElement.innerHTML = navbarHTML;
    document.body.prepend(navbarElement);
}

function loadFooter() {
    const footerHTML = `
        <footer class="container" style="text-align: center; padding: var(--spacing-xl) 0; border-top: 1px solid var(--border-color); margin-top: var(--spacing-xxl);">
            <p>&copy; 2025 Tying.ai. All Rights Reserved.</p>
        </footer>
    `;
    const footerElement = document.createElement('div');
    footerElement.innerHTML = footerHTML;
    document.body.append(footerElement);
}
