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
    loadComponent('site-header', '/components/header.html?v=8'),
    loadComponent('site-footer', '/components/footer.html?v=8'),
  ]);

  if (typeof window.initGlobalInteractions === 'function') {
    window.initGlobalInteractions();
  }

  document.dispatchEvent(new CustomEvent('layout:ready'));
}

document.addEventListener('DOMContentLoaded', initLayout);
