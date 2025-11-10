/**
 * 岗位列表应用主脚本
 * 集成所有组件，处理组件间通信和状态管理
 */

class PositionApp {
  constructor() {
    this.positionManager = null;
    this.search = null;
    this.filter = null;
    this.positionList = null;
    this.initialized = false;

    this.init();
  }

  async init() {
    try {
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // 初始化组件
      this.initializeComponents();

      // 绑定组件间事件
      this.bindComponentEvents();

      // 加载初始数据
      await this.loadInitialData();

      this.initialized = true;
      console.log('岗位列表应用初始化完成');
    } catch (error) {
      console.error('岗位列表应用初始化失败:', error);
      this.showError('应用初始化失败，请刷新页面重试');
    }
  }

  initializeComponents() {
    // 初始化岗位管理器
    this.positionManager = new PositionManager();

    // 初始化搜索组件
    const searchContainer = document.getElementById('position-search');
    if (searchContainer) {
      this.search = new PositionSearch('position-search', this.positionManager);
    }

    // 初始化筛选组件
    const filterContainer = document.getElementById('position-filter');
    if (filterContainer) {
      this.filter = new PositionFilter('position-filter', this.positionManager);
    }

    // 初始化列表组件
    const listContainer = document.getElementById('position-list');
    if (listContainer) {
      this.positionList = new PositionList('position-list', this.positionManager);
    }

    // 初始化统计信息
    this.updateStats();
  }

  bindComponentEvents() {
    // 搜索组件事件
    if (this.search) {
      this.search.container.addEventListener('positionSearch', e => {
        this.handleSearchEvent(e.detail);
      });
    }

    // 筛选组件事件
    if (this.filter) {
      this.filter.container.addEventListener('positionFilter', e => {
        this.handleFilterEvent(e.detail);
      });
    }

    // 列表组件事件
    if (this.positionList) {
      this.positionList.container.addEventListener('positionList', e => {
        this.handleListEvent(e.detail);
      });
    }

    // 页面可见性变化事件
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.initialized) {
        this.refreshData();
      }
    });

    // 浏览器前进后退事件
    window.addEventListener('popstate', e => {
      if (e.state && e.state.positionAppState) {
        this.restoreState(e.state.positionAppState);
      }
    });

    // 页面滚动事件 - 用于无限滚动（如果需要）
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 100);
    });
  }

  async loadInitialData() {
    try {
      // 显示加载状态
      this.showLoading();

      // 获取推荐岗位作为初始数据
      const featuredPositions = this.positionManager.getFeaturedPositions(6);

      // 设置列表数据
      if (this.positionList) {
        this.positionList.setPositions(featuredPositions);
      }

      // 隐藏加载状态
      this.hideLoading();

      // 更新URL状态
      this.updateURLState();
    } catch (error) {
      console.error('加载初始数据失败:', error);
      this.showError('加载数据失败，请稍后重试');
    }
  }

  handleSearchEvent(eventData) {
    const { type, query, results, totalResults } = eventData;

    switch (type) {
      case 'search':
        console.log(`搜索: "${query}", 找到 ${totalResults} 个结果`);

        // 更新列表数据
        if (this.positionList) {
          this.positionList.setPositions(results);
        }

        // 更新筛选组件状态
        if (this.filter) {
          // 清除其他筛选条件，保持搜索结果
          const currentFilters = this.filter.getFilters();
          this.filter.setFilters({
            ...currentFilters,
            // 保持筛选条件，但重置分页相关
          });
        }

        // 更新统计信息
        this.updateStats();

        // 更新URL状态
        this.updateURLState({ search: query });
        break;

      case 'reset':
        console.log('重置搜索');

        // 重新加载推荐岗位
        this.loadInitialData();

        // 重置筛选条件
        if (this.filter) {
          this.filter.resetFilters();
        }

        // 更新URL状态
        this.updateURLState();
        break;
    }
  }

  handleFilterEvent(eventData) {
    const { type, filters, results, totalResults } = eventData;

    switch (type) {
      case 'filter':
        console.log('应用筛选条件:', filters, `找到 ${totalResults} 个结果`);

        // 更新列表数据
        if (this.positionList) {
          this.positionList.setPositions(results);
        }

        // 更新统计信息
        this.updateStats();

        // 更新URL状态
        this.updateURLState({ filters });
        break;
    }
  }

  handleListEvent(eventData) {
    const { type, position, positionId, isSaved } = eventData;

    switch (type) {
      case 'positionClick':
        console.log('点击岗位:', position?.title);

        // 记录用户行为统计
        this.trackUserAction('position_click', {
          positionId: position?.id,
          positionTitle: position?.title,
          category: position?.category,
        });

        // 更新URL状态（可选）
        this.updateURLState(
          {
            selectedPosition: position?.id,
          },
          false,
        );
        break;

      case 'toggleSave':
        console.log(`${isSaved ? '收藏' : '取消收藏'}岗位:`, positionId);

        // 处理收藏逻辑
        this.handleSavePosition(positionId, isSaved);

        // 记录用户行为
        this.trackUserAction('toggle_save', {
          positionId,
          isSaved,
        });
        break;

      case 'retry':
        console.log('重试加载');
        this.refreshData();
        break;

      case 'resetFilters':
        console.log('重置筛选条件');

        // 重置搜索
        if (this.search) {
          this.search.clearSearch();
        }

        // 重置筛选
        if (this.filter) {
          this.filter.resetFilters();
        }

        // 重新加载数据
        this.loadInitialData();
        break;
    }
  }

  handleScroll() {
    // 无限滚动逻辑（如果需要）
    if (!this.positionList) return;

    const scrollPosition = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.offsetHeight;

    // 当滚动到接近底部时加载更多
    if (scrollPosition >= documentHeight - 1000) {
      // 这里可以实现加载更多数据的逻辑
      // this.loadMoreData();
    }
  }

  async refreshData() {
    try {
      // 显示加载状态
      this.showLoading();

      // 重新应用当前的搜索和筛选条件
      const currentSearch = this.search?.searchInput?.value || '';
      const currentFilters = this.filter?.getFilters() || {};

      let results = this.positionManager.positions;

      // 应用搜索
      if (currentSearch) {
        results = this.positionManager.search(currentSearch);
      }

      // 应用筛选
      if (Object.keys(currentFilters).some(key => currentFilters[key])) {
        this.positionManager.setFilters(currentFilters);
        results = this.positionManager.filteredPositions;
      }

      // 更新列表
      if (this.positionList) {
        this.positionList.setPositions(results);
      }

      // 更新统计信息
      this.updateStats();

      // 隐藏加载状态
      this.hideLoading();
    } catch (error) {
      console.error('刷新数据失败:', error);
      this.showError('刷新数据失败');
    }
  }

  handleSavePosition(positionId, isSaved) {
    // 获取保存的岗位列表
    let savedPositions = this.getSavedPositions();

    if (isSaved) {
      // 添加到保存列表
      if (!savedPositions.includes(positionId)) {
        savedPositions.push(positionId);
      }
    } else {
      // 从保存列表移除
      savedPositions = savedPositions.filter(id => id !== positionId);
    }

    // 保存到本地存储
    localStorage.setItem('savedPositions', JSON.stringify(savedPositions));

    // 显示提示
    this.showSaveNotification(isSaved);
  }

  getSavedPositions() {
    try {
      const saved = localStorage.getItem('savedPositions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  showSaveNotification(isSaved) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = `
            <div class="notification-content">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>${isSaved ? '已收藏' : '已取消收藏'}</span>
            </div>
        `;

    // 添加样式
    notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--success);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
      notification.style.transform = 'translateY(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  updateStats() {
    const stats = this.positionManager.getStats();

    // 更新页面上的统计信息（如果有相关元素）
    const statsElements = document.querySelectorAll('[data-position-stats]');
    statsElements.forEach(element => {
      const statType = element.dataset.positionStats;
      if (stats[statType] !== undefined) {
        element.textContent = stats[statType];
      }
    });
  }

  updateURLState(params = {}, replaceState = true) {
    const url = new URL(window.location);

    // 更新搜索参数
    if (params.search) {
      url.searchParams.set('search', params.search);
    } else {
      url.searchParams.delete('search');
    }

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          url.searchParams.set(key, value);
        } else {
          url.searchParams.delete(key);
        }
      });
    }

    if (params.selectedPosition) {
      url.searchParams.set('position', params.selectedPosition);
    }

    // 更新浏览器历史
    const state = { positionAppState: { params, timestamp: Date.now() } };

    if (replaceState) {
      window.history.replaceState(state, '', url);
    } else {
      window.history.pushState(state, '', url);
    }
  }

  restoreState(state) {
    const { params } = state;

    if (params.search) {
      // 恢复搜索
      setTimeout(() => {
        if (this.search) {
          this.search.searchInput.value = params.search;
          this.search.performSearch(params.search);
        }
      }, 100);
    }

    if (params.filters) {
      // 恢复筛选条件
      setTimeout(() => {
        if (this.filter) {
          this.filter.setFilters(params.filters);
        }
      }, 200);
    }
  }

  trackUserAction(action, data = {}) {
    // 用户行为统计
    console.log('用户行为:', action, data);

    // 这里可以发送到分析服务
    // 例如: gtag('event', action, data);
  }

  showLoading() {
    if (this.positionList) {
      this.positionList.showLoadingState();
    }
  }

  hideLoading() {
    if (this.positionList) {
      this.positionList.hideLoadingState();
    }
  }

  showError(message) {
    if (this.positionList) {
      this.positionList.showErrorState();
    }

    // 显示错误提示
    const errorNotification = document.createElement('div');
    errorNotification.className = 'error-notification';
    errorNotification.textContent = message;
    errorNotification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--error);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 300px;
        `;

    document.body.appendChild(errorNotification);

    setTimeout(() => {
      if (document.body.contains(errorNotification)) {
        document.body.removeChild(errorNotification);
      }
    }, 5000);
  }

  // 公共方法
  publicMethods() {
    return {
      refreshData: () => this.refreshData(),
      search: query => this.search?.performSearch(query),
      filter: filters => this.filter?.setFilters(filters),
      getPositionById: id => this.positionManager?.getPositionById(id),
      getSavedPositions: () => this.getSavedPositions(),
    };
  }

  // 清理资源
  destroy() {
    if (this.positionList) {
      this.positionList.destroy();
    }

    // 移除事件监听器
    // ... 其他清理逻辑
  }
}

// 自动初始化应用
let positionApp;

// 确保在合适的时机初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    positionApp = new PositionApp();
  });
} else {
  positionApp = new PositionApp();
}

// 导出到全局作用域（用于调试和外部访问）
window.positionApp = positionApp;

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PositionApp };
}
