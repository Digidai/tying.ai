/**
 * 岗位筛选组件
 * 提供多维度筛选功能：分类、工作类型、经验要求、薪资范围等
 */

class PositionFilter {
  constructor(containerId, positionManager) {
    this.container = document.getElementById(containerId);
    this.positionManager = positionManager;
    this.currentFilters = {};
    this.isExpanded = false;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
            <div class="position-filter">
                <!-- 筛选头部 -->
                <div class="filter-header">
                    <h3 class="filter-title">筛选条件</h3>
                    <div class="filter-controls">
                        <button class="filter-toggle" aria-label="切换筛选面板">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                            </svg>
                        </button>
                        <button class="filter-reset" aria-label="重置所有筛选条件">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                            重置
                        </button>
                    </div>
                </div>

                <!-- 筛选面板 -->
                <div class="filter-panel">
                    <!-- 分类筛选 -->
                    <div class="filter-group">
                        <h4 class="filter-group-title">岗位分类</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="radio" name="category" value="" checked>
                                <span class="filter-label">全部分类</span>
                            </label>
                        </div>
                    </div>

                    <!-- 工作类型筛选 -->
                    <div class="filter-group">
                        <h4 class="filter-group-title">工作类型</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="radio" name="type" value="" checked>
                                <span class="filter-label">全部类型</span>
                            </label>
                        </div>
                    </div>

                    <!-- 经验要求筛选 -->
                    <div class="filter-group">
                        <h4 class="filter-group-title">经验要求</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="radio" name="experience" value="" checked>
                                <span class="filter-label">全部经验</span>
                            </label>
                        </div>
                    </div>

                    <!-- 工作模式筛选 -->
                    <div class="filter-group">
                        <h4 class="filter-group-title">工作模式</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="checkbox" name="remote" value="true">
                                <span class="filter-label">远程工作</span>
                            </label>
                        </div>
                    </div>

                    <!-- 薪资范围筛选 -->
                    <div class="filter-group">
                        <h4 class="filter-group-title">薪资范围 (USD)</h4>
                        <div class="salary-range">
                            <div class="range-inputs">
                                <div class="range-input">
                                    <label for="min-salary">最低</label>
                                    <input type="number" id="min-salary" placeholder="0" min="0" step="10000">
                                </div>
                                <div class="range-input">
                                    <label for="max-salary">最高</label>
                                    <input type="number" id="max-salary" placeholder="300000" min="0" step="10000">
                                </div>
                            </div>
                            <div class="range-slider">
                                <div class="slider-track">
                                    <div class="slider-range"></div>
                                </div>
                                <input type="range" class="slider slider-min" min="0" max="300000" step="10000" value="0">
                                <input type="range" class="slider slider-max" min="0" max="300000" step="10000" value="300000">
                            </div>
                        </div>
                    </div>

                    <!-- 活跃筛选标签 -->
                    <div class="active-filters" style="display: none;">
                        <div class="active-filters-label">当前筛选:</div>
                        <div class="active-filters-list"></div>
                    </div>
                </div>
            </div>
        `;

    this.populateFilterOptions();
    this.initSalarySlider();
  }

  populateFilterOptions() {
    // 填充分类选项
    const categories = this.positionManager.getCategories();
    const categoryContainer = this.container.querySelector(
      '.filter-group:first-child .filter-options',
    );
    const categoryOptions = categories
      .map(
        cat => `
            <label class="filter-option">
                <input type="radio" name="category" value="${cat.value}">
                <span class="filter-label">${cat.label}</span>
            </label>
        `,
      )
      .join('');
    categoryContainer.innerHTML += categoryOptions;

    // 填充工作类型选项
    const jobTypes = this.positionManager.getJobTypes();
    const typeContainer = this.container
      .querySelectorAll('.filter-group')[1]
      .querySelector('.filter-options');
    const typeOptions = jobTypes
      .map(
        type => `
            <label class="filter-option">
                <input type="radio" name="type" value="${type.value}">
                <span class="filter-label">${type.label}</span>
            </label>
        `,
      )
      .join('');
    typeContainer.innerHTML += typeOptions;

    // 填充经验要求选项
    const experienceLevels = this.positionManager.getExperienceLevels();
    const experienceContainer = this.container
      .querySelectorAll('.filter-group')[2]
      .querySelector('.filter-options');
    const experienceOptions = experienceLevels
      .map(
        level => `
            <label class="filter-option">
                <input type="radio" name="experience" value="${level.value}">
                <span class="filter-label">${level.label}</span>
            </label>
        `,
      )
      .join('');
    experienceContainer.innerHTML += experienceOptions;
  }

  initSalarySlider() {
    const minSlider = this.container.querySelector('.slider-min');
    const maxSlider = this.container.querySelector('.slider-max');
    const minInput = this.container.querySelector('#min-salary');
    const maxInput = this.container.querySelector('#max-salary');
    const sliderRange = this.container.querySelector('.slider-range');

    const updateSlider = () => {
      const minVal = parseInt(minSlider.value);
      const maxVal = parseInt(maxSlider.value);

      if (minVal > maxVal - 10000) {
        minSlider.value = maxVal - 10000;
        minInput.value = minSlider.value;
      }

      if (maxVal < minVal + 10000) {
        maxSlider.value = minVal + 10000;
        maxInput.value = maxSlider.value;
      }

      const minPercent = (minSlider.value / 300000) * 100;
      const maxPercent = (maxSlider.value / 300000) * 100;

      sliderRange.style.left = `${minPercent}%`;
      sliderRange.style.width = `${maxPercent - minPercent}%`;
    };

    minSlider.addEventListener('input', () => {
      minInput.value = minSlider.value;
      updateSlider();
    });

    maxSlider.addEventListener('input', () => {
      maxInput.value = maxSlider.value;
      updateSlider();
    });

    minInput.addEventListener('input', () => {
      minSlider.value = minInput.value || 0;
      updateSlider();
    });

    maxInput.addEventListener('input', () => {
      maxSlider.value = maxInput.value || 300000;
      updateSlider();
    });
  }

  bindEvents() {
    // 切换筛选面板
    const toggleBtn = this.container.querySelector('.filter-toggle');
    const filterPanel = this.container.querySelector('.filter-panel');

    toggleBtn.addEventListener('click', () => {
      this.isExpanded = !this.isExpanded;
      filterPanel.style.display = this.isExpanded ? 'block' : 'none';
      toggleBtn.classList.toggle('expanded', this.isExpanded);
    });

    // 重置筛选
    const resetBtn = this.container.querySelector('.filter-reset');
    resetBtn.addEventListener('click', () => {
      this.resetFilters();
    });

    // 筛选选项变化事件
    this.container.addEventListener('change', e => {
      if (e.target.type === 'radio' || e.target.type === 'checkbox') {
        this.handleFilterChange();
      }
    });

    // 薪资输入变化事件
    const minSalaryInput = this.container.querySelector('#min-salary');
    const maxSalaryInput = this.container.querySelector('#max-salary');

    [minSalaryInput, maxSalaryInput].forEach(input => {
      input.addEventListener('change', () => {
        this.handleFilterChange();
      });
    });

    // 初始状态下展开筛选面板
    if (window.innerWidth > 768) {
      this.isExpanded = true;
      filterPanel.style.display = 'block';
      toggleBtn.classList.add('expanded');
    }

    // 响应式处理
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.isExpanded = true;
        filterPanel.style.display = 'block';
        toggleBtn.classList.add('expanded');
      } else if (!this.isExpanded) {
        filterPanel.style.display = 'none';
        toggleBtn.classList.remove('expanded');
      }
    });
  }

  handleFilterChange() {
    this.collectFilters();
    this.applyFilters();
    this.updateActiveFilters();
  }

  collectFilters() {
    // 分类筛选
    const categoryInput = this.container.querySelector('input[name="category"]:checked');
    const category = categoryInput ? categoryInput.value : '';

    // 工作类型筛选
    const typeInput = this.container.querySelector('input[name="type"]:checked');
    const type = typeInput ? typeInput.value : '';

    // 经验要求筛选
    const experienceInput = this.container.querySelector('input[name="experience"]:checked');
    const experience = experienceInput ? experienceInput.value : '';

    // 远程工作筛选
    const remoteInput = this.container.querySelector('input[name="remote"]');
    const remote = remoteInput.checked;

    // 薪资范围筛选
    const minSalaryInput = this.container.querySelector('#min-salary');
    const maxSalaryInput = this.container.querySelector('#max-salary');
    const minSalary = minSalaryInput.value ? parseInt(minSalaryInput.value) : null;
    const maxSalary = maxSalaryInput.value ? parseInt(maxSalaryInput.value) : null;

    this.currentFilters = {
      category,
      type,
      experience,
      remote: remote || null,
      minSalary,
      maxSalary,
    };
  }

  applyFilters() {
    const results = this.positionManager.setFilters(this.currentFilters);

    // 触发筛选事件
    this.dispatchFilterEvent('filter', {
      filters: { ...this.currentFilters },
      results,
      totalResults: results.length,
    });
  }

  updateActiveFilters() {
    const activeFiltersContainer = this.container.querySelector('.active-filters');
    const activeFiltersList = this.container.querySelector('.active-filters-list');

    const activeFilters = [];

    // 添加分类筛选
    if (this.currentFilters.category) {
      const categoryLabel = this.container.querySelector(
        `input[name="category"][value="${this.currentFilters.category}"] + .filter-label`,
      ).textContent;
      activeFilters.push({
        type: 'category',
        label: categoryLabel,
        value: this.currentFilters.category,
      });
    }

    // 添加工作类型筛选
    if (this.currentFilters.type) {
      const typeLabel = this.container.querySelector(
        `input[name="type"][value="${this.currentFilters.type}"] + .filter-label`,
      ).textContent;
      activeFilters.push({
        type: 'type',
        label: typeLabel,
        value: this.currentFilters.type,
      });
    }

    // 添加经验要求筛选
    if (this.currentFilters.experience) {
      const experienceLabel = this.container.querySelector(
        `input[name="experience"][value="${this.currentFilters.experience}"] + .filter-label`,
      ).textContent;
      activeFilters.push({
        type: 'experience',
        label: experienceLabel,
        value: this.currentFilters.experience,
      });
    }

    // 添加远程工作筛选
    if (this.currentFilters.remote) {
      activeFilters.push({
        type: 'remote',
        label: '远程工作',
        value: 'true',
      });
    }

    // 添加薪资范围筛选
    if (this.currentFilters.minSalary !== null || this.currentFilters.maxSalary !== null) {
      const minSalary = this.currentFilters.minSalary || 0;
      const maxSalary = this.currentFilters.maxSalary || '300000+';
      activeFilters.push({
        type: 'salary',
        label: `$${this.formatSalary(minSalary)} - $${this.formatSalary(maxSalary)}`,
        value: { min: this.currentFilters.minSalary, max: this.currentFilters.maxSalary },
      });
    }

    if (activeFilters.length > 0) {
      activeFiltersContainer.style.display = 'block';
      activeFiltersList.innerHTML = activeFilters
        .map(
          filter => `
                <div class="active-filter-tag" data-type="${filter.type}">
                    <span class="filter-tag-label">${filter.label}</span>
                    <button class="filter-tag-remove" aria-label="移除筛选条件">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `,
        )
        .join('');

      // 绑定移除筛选事件
      activeFiltersList.querySelectorAll('.filter-tag-remove').forEach(btn => {
        btn.addEventListener('click', e => {
          const tag = e.target.closest('.active-filter-tag');
          this.removeFilter(tag.dataset.type);
        });
      });
    } else {
      activeFiltersContainer.style.display = 'none';
    }
  }

  removeFilter(filterType) {
    switch (filterType) {
      case 'category':
        this.container.querySelector('input[name="category"][value=""]').checked = true;
        break;
      case 'type':
        this.container.querySelector('input[name="type"][value=""]').checked = true;
        break;
      case 'experience':
        this.container.querySelector('input[name="experience"][value=""]').checked = true;
        break;
      case 'remote':
        this.container.querySelector('input[name="remote"]').checked = false;
        break;
      case 'salary':
        this.container.querySelector('#min-salary').value = '';
        this.container.querySelector('#max-salary').value = '';
        this.container.querySelector('.slider-min').value = 0;
        this.container.querySelector('.slider-max').value = 300000;
        this.initSalarySlider();
        break;
    }
    this.handleFilterChange();
  }

  resetFilters() {
    // 重置所有筛选条件
    this.container.querySelectorAll('input[type="radio"]').forEach(input => {
      if (input.value === '') {
        input.checked = true;
      }
    });

    this.container.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = false;
    });

    this.container.querySelector('#min-salary').value = '';
    this.container.querySelector('#max-salary').value = '';
    this.container.querySelector('.slider-min').value = 0;
    this.container.querySelector('.slider-max').value = 300000;
    this.initSalarySlider();

    this.handleFilterChange();
  }

  formatSalary(amount) {
    if (typeof amount === 'string' && amount.includes('+')) {
      return amount;
    }
    return (amount / 1000).toFixed(0) + 'k';
  }

  dispatchFilterEvent(type, data = {}) {
    const event = new CustomEvent('positionFilter', {
      detail: { type, ...data },
    });
    this.container.dispatchEvent(event);
  }

  // 公共方法
  getFilters() {
    return { ...this.currentFilters };
  }

  setFilters(filters) {
    // 设置筛选条件
    if (filters.category !== undefined) {
      const categoryInput = this.container.querySelector(
        `input[name="category"][value="${filters.category}"]`,
      );
      if (categoryInput) categoryInput.checked = true;
    }

    if (filters.type !== undefined) {
      const typeInput = this.container.querySelector(`input[name="type"][value="${filters.type}"]`);
      if (typeInput) typeInput.checked = true;
    }

    if (filters.experience !== undefined) {
      const experienceInput = this.container.querySelector(
        `input[name="experience"][value="${filters.experience}"]`,
      );
      if (experienceInput) experienceInput.checked = true;
    }

    if (filters.remote !== undefined) {
      this.container.querySelector('input[name="remote"]').checked = filters.remote;
    }

    if (filters.minSalary !== undefined) {
      this.container.querySelector('#min-salary').value = filters.minSalary || '';
      this.container.querySelector('.slider-min').value = filters.minSalary || 0;
    }

    if (filters.maxSalary !== undefined) {
      this.container.querySelector('#max-salary').value = filters.maxSalary || '';
      this.container.querySelector('.slider-max').value = filters.maxSalary || 300000;
    }

    this.initSalarySlider();
    this.handleFilterChange();
  }
}

// 导出
window.PositionFilter = PositionFilter;
