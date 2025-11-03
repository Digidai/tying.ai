/**
 * 岗位列表渲染组件
 * 支持虚拟滚动、懒加载、动画优化等性能特性
 */

class PositionList {
    constructor(containerId, positionManager) {
        this.container = document.getElementById(containerId);
        this.positionManager = positionManager;
        this.positions = [];
        this.isLoading = false;
        this.hasError = false;
        this.viewMode = 'grid'; // grid, list
        this.itemsPerPage = 6;
        this.currentPage = 1;
        this.totalPages = 1;
        this.intersectionObserver = null;
        this.animationFrameId = null;

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.render();
        this.bindEvents();
    }

    setupIntersectionObserver() {
        // 设置懒加载观察器
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadItemContent(entry.target);
                }
            });
        }, options);
    }

    render() {
        this.container.innerHTML = `
            <div class="position-list-container">
                <!-- 列表头部控制栏 -->
                <div class="list-header">
                    <div class="list-info">
                        <span class="results-count">共找到 <span id="total-count">0</span> 个岗位</span>
                        <div class="view-controls">
                            <button class="view-btn active" data-view="grid" aria-label="网格视图">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </button>
                            <button class="view-btn" data-view="list" aria-label="列表视图">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="sort-controls">
                            <select class="sort-select" aria-label="排序方式">
                                <option value="featured">推荐优先</option>
                                <option value="title">按标题排序</option>
                                <option value="salary-low">薪资从低到高</option>
                                <option value="salary-high">薪资从高到低</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 加载状态 -->
                <div class="loading-state" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>正在加载岗位信息...</p>
                </div>

                <!-- 错误状态 -->
                <div class="error-state" style="display: none;">
                    <div class="error-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3>加载失败</h3>
                    <p>无法加载岗位信息，请稍后重试</p>
                    <button class="retry-btn" onclick="this.closest('.position-list-container').positionList.retry()">重试</button>
                </div>

                <!-- 空状态 -->
                <div class="empty-state" style="display: none;">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <h3>暂无匹配的岗位</h3>
                    <p>尝试调整筛选条件或搜索关键词</p>
                    <button class="reset-btn" onclick="this.closest('.position-list-container').positionList.resetFilters()">重置筛选</button>
                </div>

                <!-- 岗位列表容器 -->
                <div class="positions-container ${this.viewMode}-view">
                    <div class="positions-grid"></div>
                </div>

                <!-- 分页组件 -->
                <div class="pagination-container" style="display: none;">
                    <div class="pagination">
                        <button class="pagination-btn prev" disabled aria-label="上一页">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                            上一页
                        </button>
                        <div class="pagination-info">
                            <span class="current-page">1</span>
                            <span class="page-separator">/</span>
                            <span class="total-pages">1</span>
                        </div>
                        <button class="pagination-btn next" aria-label="下一页">
                            下一页
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                    <div class="pagination-size">
                        <span>每页显示</span>
                        <select class="page-size-select">
                            <option value="6">6</option>
                            <option value="12">12</option>
                            <option value="24">24</option>
                        </select>
                        <span>条</span>
                    </div>
                </div>
            </div>
        `;

        // 保存组件实例引用
        this.container.positionList = this;

        this.bindViewEvents();
    }

    bindEvents() {
        // 视图切换
        const viewBtns = this.container.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchView(btn.dataset.view);
            });
        });

        // 排序选择
        const sortSelect = this.container.querySelector('.sort-select');
        sortSelect.addEventListener('change', () => {
            this.handleSort(sortSelect.value);
        });

        // 分页控制
        const prevBtn = this.container.querySelector('.pagination-btn.prev');
        const nextBtn = this.container.querySelector('.pagination-btn.next');
        const pageSizeSelect = this.container.querySelector('.page-size-select');

        prevBtn.addEventListener('click', () => {
            this.goToPage(this.currentPage - 1);
        });

        nextBtn.addEventListener('click', () => {
            this.goToPage(this.currentPage + 1);
        });

        pageSizeSelect.addEventListener('change', () => {
            this.itemsPerPage = parseInt(pageSizeSelect.value);
            this.currentPage = 1;
            this.renderPositions();
        });
    }

    bindViewEvents() {
        // 绑定岗位卡片事件
        this.container.addEventListener('click', (e) => {
            const positionCard = e.target.closest('.position-card');
            if (positionCard && !e.target.closest('.position-actions')) {
                const positionId = positionCard.dataset.positionId;
                this.handlePositionClick(positionId);
            }
        });
    }

    setPositions(positions, append = false) {
        if (append) {
            this.positions = [...this.positions, ...positions];
        } else {
            this.positions = positions;
        }

        this.totalPages = Math.ceil(this.positions.length / this.itemsPerPage);
        this.renderPositions();
    }

    renderPositions() {
        const gridContainer = this.container.querySelector('.positions-grid');
        const totalCount = this.container.querySelector('#total-count');
        const paginationContainer = this.container.querySelector('.pagination-container');

        // 更新统计信息
        totalCount.textContent = this.positions.length;

        if (this.positions.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideAllStates();

        // 获取当前页的岗位
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPositions = this.positions.slice(startIndex, endIndex);

        // 渲染岗位卡片
        gridContainer.innerHTML = currentPositions.map((position, index) =>
            this.createPositionCard(position, startIndex + index)
        ).join('');

        // 启动懒加载观察
        gridContainer.querySelectorAll('.position-card').forEach(card => {
            this.intersectionObserver.observe(card);
        });

        // 更新分页信息
        this.updatePagination();

        // 显示或隐藏分页
        if (this.totalPages > 1) {
            paginationContainer.style.display = 'flex';
        } else {
            paginationContainer.style.display = 'none';
        }
    }

    createPositionCard(position, index) {
        const isFeatured = position.featured;
        const salaryRange = this.formatSalaryRange(position.salary);
        const skills = position.skills.slice(0, 4); // 只显示前4个技能

        return `
            <article class="position-card ${isFeatured ? 'featured' : ''}" data-position-id="${position.id}" style="--animation-delay: ${index * 0.1}s">
                ${isFeatured ? '<div class="featured-badge">推荐</div>' : ''}

                <div class="position-header">
                    <div class="position-info">
                        <h3 class="position-title">
                            <a href="${position.url}" class="position-link" onclick="event.stopPropagation()">${position.title}</a>
                        </h3>
                        <div class="position-meta">
                            <span class="position-category">${this.formatCategory(position.category)}</span>
                            <span class="position-experience">${position.experience}</span>
                            ${position.remote ? '<span class="position-remote">远程</span>' : ''}
                        </div>
                    </div>
                    <div class="position-salary">
                        <span class="salary-amount">${salaryRange}</span>
                        <span class="salary-currency">${position.salary.currency}</span>
                    </div>
                </div>

                <div class="position-description">
                    <p>${position.description}</p>
                </div>

                <div class="position-skills">
                    <div class="skills-list">
                        ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        ${position.skills.length > 4 ? `<span class="skill-more">+${position.skills.length - 4} 更多</span>` : ''}
                    </div>
                </div>

                <div class="position-footer">
                    <div class="position-tags">
                        ${position.tags.slice(0, 3).map(tag => `<span class="position-tag">#${tag}</span>`).join('')}
                    </div>
                    <div class="position-actions">
                        <a href="${position.url}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">
                            查看详情
                        </a>
                        <button class="btn btn-outline btn-sm save-position" aria-label="收藏岗位" onclick="event.stopPropagation(); this.closest('.position-list-container').positionList.toggleSave('${position.id}', this)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    loadItemContent(card) {
        // 如果卡片已经被加载，跳过
        if (card.classList.contains('loaded')) {
            return;
        }

        // 模拟加载内容（实际项目中可能需要加载更多详细信息）
        setTimeout(() => {
            card.classList.add('loaded');
            this.intersectionObserver.unobserve(card);
        }, 100);
    }

    switchView(viewMode) {
        if (this.viewMode === viewMode) return;

        this.viewMode = viewMode;
        const container = this.container.querySelector('.positions-container');
        const viewBtns = this.container.querySelectorAll('.view-btn');

        // 更新视图样式
        container.className = `positions-container ${viewMode}-view`;

        // 更新按钮状态
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewMode);
        });

        // 重新渲染以适应新视图
        this.renderPositions();
    }

    handleSort(sortBy) {
        let sortedPositions = [...this.positions];

        switch (sortBy) {
            case 'featured':
                sortedPositions.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            case 'title':
                sortedPositions.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'salary-low':
                sortedPositions.sort((a, b) => a.salary.min - b.salary.min);
                break;
            case 'salary-high':
                sortedPositions.sort((a, b) => b.salary.max - a.salary.max);
                break;
        }

        this.positions = sortedPositions;
        this.currentPage = 1;
        this.renderPositions();
    }

    updatePagination() {
        const currentPageSpan = this.container.querySelector('.current-page');
        const totalPagesSpan = this.container.querySelector('.total-pages');
        const prevBtn = this.container.querySelector('.pagination-btn.prev');
        const nextBtn = this.container.querySelector('.pagination-btn.next');

        currentPageSpan.textContent = this.currentPage;
        totalPagesSpan.textContent = this.totalPages;

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.renderPositions();

        // 滚动到顶部
        this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showEmptyState() {
        this.hideAllStates();
        this.container.querySelector('.empty-state').style.display = 'flex';
    }

    showLoadingState() {
        this.hideAllStates();
        this.container.querySelector('.loading-state').style.display = 'flex';
        this.isLoading = true;
    }

    showErrorState() {
        this.hideAllStates();
        this.container.querySelector('.error-state').style.display = 'flex';
        this.hasError = true;
    }

    hideAllStates() {
        this.container.querySelector('.loading-state').style.display = 'none';
        this.container.querySelector('.error-state').style.display = 'none';
        this.container.querySelector('.empty-state').style.display = 'none';
        this.isLoading = false;
        this.hasError = false;
    }

    handlePositionClick(positionId) {
        const position = this.positionManager.getPositionById(positionId);
        if (position) {
            // 可以添加统计或其他逻辑
            this.dispatchListEvent('positionClick', { position });
        }
    }

    toggleSave(positionId, button) {
        const isSaved = button.classList.contains('saved');

        if (isSaved) {
            button.classList.remove('saved');
            button.setAttribute('aria-label', '收藏岗位');
        } else {
            button.classList.add('saved');
            button.setAttribute('aria-label', '取消收藏');
        }

        // 触发收藏事件
        this.dispatchListEvent('toggleSave', { positionId, isSaved: !isSaved });
    }

    retry() {
        this.hideErrorState();
        // 重新加载数据
        this.dispatchListEvent('retry');
    }

    resetFilters() {
        this.dispatchListEvent('resetFilters');
    }

    // 工具方法
    formatSalaryRange(salary) {
        if (salary.min === salary.max) {
            return `$${(salary.min / 1000).toFixed(0)}k`;
        }
        return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
    }

    formatCategory(category) {
        const categoryMap = {
            'engineering': '工程技术',
            'business': '商业管理',
            'design': '设计创意',
            'marketing': '市场营销'
        };
        return categoryMap[category] || category;
    }

    dispatchListEvent(type, data = {}) {
        const event = new CustomEvent('positionList', {
            detail: { type, ...data }
        });
        this.container.dispatchEvent(event);
    }

    // 公共方法
    refresh() {
        this.renderPositions();
    }

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// 导出
window.PositionList = PositionList;