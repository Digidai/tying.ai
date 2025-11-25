/**
 * 主JavaScript入口文件
 * 基础功能初始化
 */

import { logger } from '@/utils/logger';

logger.log('🚀 Tying.ai v2.0 - Initializing...');

// 简单的DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  logger.log('✅ DOM loaded, initializing basic functionality');

  // 初始化基础功能
  initBasicFunctionality();

  logger.log('✅ App initialized successfully');
});

/**
 * 初始化基础功能
 */
function initBasicFunctionality() {
  // 移动端菜单
  initMobileMenu();

  // 平滑滚动
  initSmoothScroll();

  // 表单处理
  initFormHandling();

  logger.log('✅ Basic functionality initialized');
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileMenuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
  }
}

/**
 * 初始化平滑滚动
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * 初始化表单处理
 */
function initFormHandling() {
  // 简单的表单提交处理
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', _e => {
      // 这里可以添加通用的表单处理逻辑
      logger.log('Form submitted:', form.id || 'unnamed form');
    });
  });
}

// 导出基础功能
export { initBasicFunctionality };
