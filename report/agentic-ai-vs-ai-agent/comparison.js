// 比较表格数据和生成功能
document.addEventListener('DOMContentLoaded', () => {
  const comparisonContainer = document.getElementById('comparison-container');

  if (!comparisonContainer) return;

  // 比较数据
  const comparisonData = [
    {
      feature: '系统架构',
      aiAgent: '单体系统',
      agenticAi: '多智能体协作系统',
    },
    {
      feature: '任务特性',
      aiAgent: '单一、可重复任务',
      agenticAi: '复杂任务，动态拆解与规划',
    },
    {
      feature: '典型应用',
      aiAgent: '邮箱分类、客服问答、内容推荐',
      agenticAi: 'AI科研助手、ICU诊疗辅助、机器人团队作业',
    },
    {
      feature: '主要挑战',
      aiAgent: '推理能力弱、易产生幻觉、被动、长链规划能力差',
      agenticAi: '系统不稳定、错误级联扩散、可解释性、扩展性、安全问题',
    },
    {
      feature: '发展方向',
      aiAgent: '提升主动智能、持续学习与安全可信',
      agenticAi: '解决多Agent扩展性、可解释性、安全性和行业定制问题',
    },
    {
      feature: '形象比喻',
      aiAgent: '帮你干活的小工具',
      agenticAi: '组成AI团队搞事情',
    },
  ];

  // 创建比较表格
  const createComparisonTable = () => {
    const table = document.createElement('table');
    table.className = 'comparison-table';

    // 表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const featureHeader = document.createElement('th');
    featureHeader.textContent = '特征';
    headerRow.appendChild(featureHeader);

    const aiAgentHeader = document.createElement('th');
    aiAgentHeader.textContent = 'AI Agent';
    aiAgentHeader.className = 'text-blue-700';
    headerRow.appendChild(aiAgentHeader);

    const agenticAiHeader = document.createElement('th');
    agenticAiHeader.textContent = 'Agentic AI';
    agenticAiHeader.className = 'text-purple-700';
    headerRow.appendChild(agenticAiHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 表身
    const tbody = document.createElement('tbody');

    comparisonData.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

      const featureCell = document.createElement('td');
      featureCell.textContent = row.feature;
      featureCell.className = 'font-medium';
      tr.appendChild(featureCell);

      const aiAgentCell = document.createElement('td');
      aiAgentCell.textContent = row.aiAgent;
      tr.appendChild(aiAgentCell);

      const agenticAiCell = document.createElement('td');
      agenticAiCell.textContent = row.agenticAi;
      tr.appendChild(agenticAiCell);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
  };

  // 渲染表格
  const comparisonTable = createComparisonTable();
  comparisonContainer.appendChild(comparisonTable);

  // 添加响应式表格容器样式
  comparisonContainer.classList.add('overflow-x-auto');
});
