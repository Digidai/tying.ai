// 页面滚动效果
document.addEventListener('DOMContentLoaded', () => {
  // 添加滚动监听来给部分添加淡入效果
  const sections = document.querySelectorAll('section');

  const fadeInOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const fadeInOnScroll = new IntersectionObserver((entries, fadeInOnScroll) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('opacity-100');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
        fadeInOnScroll.unobserve(entry.target);
      }
    });
  }, fadeInOptions);

  sections.forEach(section => {
    section.classList.add(
      'transition-all',
      'duration-700',
      'ease-out',
      'opacity-0',
      'translate-y-10',
    );
    fadeInOnScroll.observe(section);
  });

  // 为图示添加轻微动画效果
  const agentIllustration = document.getElementById('agent-illustration');
  const agenticIllustration = document.getElementById('agentic-illustration');

  if (agentIllustration && agenticIllustration) {
    // 鼠标悬停效果
    agentIllustration.addEventListener('mouseenter', () => {
      const svg = agentIllustration.querySelector('svg');
      const bg = agentIllustration.querySelector('.bg-blue-100');

      if (svg && bg) {
        svg.classList.add('scale-110');
        bg.classList.add('bg-blue-200');
      }
    });

    agentIllustration.addEventListener('mouseleave', () => {
      const svg = agentIllustration.querySelector('svg');
      const bg = agentIllustration.querySelector('.bg-blue-100');

      if (svg && bg) {
        svg.classList.remove('scale-110');
        bg.classList.remove('bg-blue-200');
      }
    });

    // 为Agentic插图添加连接线动画
    agenticIllustration.addEventListener('mouseenter', () => {
      const svgs = agenticIllustration.querySelectorAll('svg');
      const bgs = agenticIllustration.querySelectorAll('div.rounded-full');
      const line = agenticIllustration.querySelector('.bg-gray-300');

      svgs.forEach(svg => svg.classList.add('scale-110'));
      bgs.forEach(bg => {
        if (bg.classList.contains('bg-purple-100')) bg.classList.add('bg-purple-200');
        if (bg.classList.contains('bg-green-100')) bg.classList.add('bg-green-200');
        if (bg.classList.contains('bg-indigo-100')) bg.classList.add('bg-indigo-200');
        if (bg.classList.contains('bg-red-100')) bg.classList.add('bg-red-200');
      });

      if (line) {
        line.classList.add('bg-gray-400');
      }
    });

    agenticIllustration.addEventListener('mouseleave', () => {
      const svgs = agenticIllustration.querySelectorAll('svg');
      const bgs = agenticIllustration.querySelectorAll('div.rounded-full');
      const line = agenticIllustration.querySelector('.bg-gray-300');

      svgs.forEach(svg => svg.classList.remove('scale-110'));
      bgs.forEach(bg => {
        if (bg.classList.contains('bg-purple-200')) bg.classList.remove('bg-purple-200');
        if (bg.classList.contains('bg-green-200')) bg.classList.remove('bg-green-200');
        if (bg.classList.contains('bg-indigo-200')) bg.classList.remove('bg-indigo-200');
        if (bg.classList.contains('bg-red-200')) bg.classList.remove('bg-red-200');
      });

      if (line) {
        line.classList.remove('bg-gray-400');
      }
    });
  }
});
