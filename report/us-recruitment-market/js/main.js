// 美国招聘市场分析报告 - 主脚本文件

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  // 初始化图表和可视化内容
  initMermaid();

  // 添加滚动动画效果
  initScrollAnimations();

  // 初始化导航栏行为
  initNavigation();

  // 更新报告生成时间
  updateReportTime();
});

// 初始化Mermaid图表
function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
    });
  }
}

// 滚动动画效果
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-element');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  elements.forEach(element => {
    observer.observe(element);
  });
}

// 导航栏行为
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
    });
  }

  // 滚动时导航栏变化
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

  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });

        // 如果在移动视图中，点击后关闭导航菜单
        if (navMenu && !navMenu.classList.contains('hidden')) {
          navMenu.classList.add('hidden');
        }
      }
    });
  });
}

// 更新报告生成时间
function updateReportTime() {
  const timeElement = document.getElementById('report-time');
  if (timeElement) {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    timeElement.textContent = now.toLocaleDateString('zh-CN', options);
  }
}
