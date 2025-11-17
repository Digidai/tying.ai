import { dataService } from '@/services/dataService';
import { logger } from '@/utils/logger';
import type {
  SearchFilters,
  SearchResult,
  Position,
  PositionType,
  ExperienceLevel,
  RemoteType,
  SalaryRange,
  VisaSupport,
  SearchSortOption,
} from '@/types';

/**
 * 搜索功能类 - 处理前端的职位搜索逻辑
 */
export class PositionSearchManager {
  private form: HTMLFormElement;
  private resultsContainer: HTMLElement;
  private statsContainer: HTMLElement;
  private paginationContainer: HTMLElement;
  private currentPage = 1;
  private pageSize = 20;
  private currentFilters: SearchFilters = {};
  private isLoading = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(formId: string = 'search-form') {
    const formElement = document.getElementById(formId);
    const resultsElement = document.getElementById('results-list');
    const statsElement = document.getElementById('results-count');
    const paginationElement = document.getElementById('pagination');

    if (!(formElement instanceof HTMLFormElement) || !resultsElement || !statsElement || !paginationElement) {
      logger.error('Search form or related containers not found in DOM');
      throw new Error('Search page missing required markup for PositionSearchManager');
    }

    this.form = formElement;
    this.resultsContainer = resultsElement;
    this.statsContainer = statsElement;
    this.paginationContainer = paginationElement;

    this.initializeEventListeners();
  }

  /**
   * 初始化事件监听器
   */
  private initializeEventListeners(): void {
    // 表单提交
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    // 筛选条件变化
    this.form.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        this.handleFilterChange();
      }
    });

    // 排序选择
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.handleSort();
      });
    }
  }

  /**
   * 处理搜索
   */
  private async handleSearch(): Promise<void> {
    if (this.isLoading) return;

    this.currentPage = 1;
    this.collectFilters();
    await this.performSearch();
  }

  /**
   * 处理筛选条件变化
   */
  private handleFilterChange(): void {
    // 防抖处理
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.handleSearch();
    }, 300);
  }

  /**
   * 处理排序
   */
  private async handleSort(): Promise<void> {
    await this.performSearch();
  }

  /**
   * 收集筛选条件
   */
  private collectFilters(): void {
    const formData = new FormData(this.form);

    // 关键词和地点
    this.currentFilters = {
      keywords: formData.get('keywords') as string || undefined,
      location: formData.get('location') as string || undefined,
    };

    // 职位类型
    const types = formData.getAll('type') as string[];
    if (types.length > 0) {
      this.currentFilters.type = types as PositionType[];
    }

    // 经验级别
    const experiences = formData.getAll('experience') as string[];
    if (experiences.length > 0) {
      this.currentFilters.experience = experiences as ExperienceLevel[];
    }

    // 远程类型
    const remotes = formData.getAll('remote') as string[];
    if (remotes.length > 0) {
      this.currentFilters.remote = remotes as RemoteType[];
    }

    // 薪资范围
    const salaryMin = formData.get('salaryMin') as string;
    const salaryMax = formData.get('salaryMax') as string;
    if (salaryMin) this.currentFilters.salaryMin = parseInt(salaryMin);
    if (salaryMax) this.currentFilters.salaryMax = parseInt(salaryMax);

    const companyInput = formData.get('company') as string;
    if (companyInput) {
      this.currentFilters.company = companyInput
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
    }

    const skillsInput = formData.get('skills') as string;
    if (skillsInput) {
      this.currentFilters.skills = skillsInput
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
    }

    const visa = formData.get('visa') as string;
    if (visa) {
      this.currentFilters.visa = visa as VisaSupport;
    } else {
      delete this.currentFilters.visa;
    }

    const sortValue = formData.get('sort') as string;
    this.currentFilters.sort = (sortValue as SearchSortOption) || 'newest';
  }

  /**
   * 执行搜索
   */
  private async performSearch(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoadingState();

    try {
      const result = await dataService.searchPositions(
        this.currentFilters,
        this.currentPage,
        this.pageSize
      );

      this.renderResults(result);
      this.renderStats(result);
      this.renderPagination(result);

    } catch (error) {
      logger.error('Search failed:', error);
      this.showErrorState();
    } finally {
      this.isLoading = false;
      this.hideLoadingState();
    }
  }

  /**
   * 渲染搜索结果
   */
  private renderResults(result: SearchResult): void {
    if (result.positions.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-neutral-900 mb-2">没有找到匹配的职位</h3>
          <p class="text-neutral-600">尝试调整搜索条件或筛选器</p>
        </div>
      `;
      return;
    }

    const template = document.getElementById('position-card-template') as HTMLTemplateElement;
    if (!template) {
      logger.error('Position card template not found');
      return;
    }

    const fragment = document.createDocumentFragment();
    result.positions.forEach(position => {
      fragment.appendChild(this.createPositionCard(position, template));
    });

    this.resultsContainer.innerHTML = '';
    this.resultsContainer.appendChild(fragment);
  }

  /**
   * 创建职位卡片
   */
  private createPositionCard(position: Position, template: HTMLTemplateElement): HTMLElement {
    const templateRoot = template.content.firstElementChild?.cloneNode(true) as HTMLElement | null;
    const cardElement = templateRoot ?? document.createElement('article');

    const titleElement = cardElement.querySelector('h3');
    if (titleElement) titleElement.textContent = position.title;

    const companyElement = cardElement.querySelector('.text-neutral-600.text-sm.mb-2');
    if (companyElement) companyElement.textContent = position.company;

    const locationElement = cardElement.querySelector('.location');
    if (locationElement) locationElement.textContent = position.location;

    const typeElement = cardElement.querySelector('.type');
    if (typeElement) {
      typeElement.textContent = this.getTypeLabel(position.type);
    }

    const salaryElement = cardElement.querySelector('.salary');
    if (salaryElement) {
      salaryElement.textContent = this.formatSalary(position.salary);
    }

    const remoteElement = cardElement.querySelector('.remote');
    if (remoteElement) {
      remoteElement.textContent = this.getRemoteLabel(position.remote);
    }

    const descriptionElement = cardElement.querySelector('.line-clamp-2');
    if (descriptionElement) descriptionElement.textContent = position.description;

    const postedAtElement = cardElement.querySelector('.posted-at');
    if (postedAtElement) {
      postedAtElement.textContent = this.formatDate(position.postedAt);
    }

    const skillsContainer = cardElement.querySelector('.flex.flex-wrap.gap-1');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      position.skills.slice(0, 5).forEach(skill => {
        const pill = document.createElement('span');
        pill.className = 'px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full';
        pill.textContent = skill;
        skillsContainer.appendChild(pill);
      });
    }

    cardElement.style.cursor = 'pointer';
    cardElement.addEventListener('click', () => {
      window.location.href = `/position/${position.id}`;
    });

    return cardElement;
  }

  /**
   * 渲染统计信息
   */
  private renderStats(result: SearchResult): void {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, result.total);

    this.statsContainer.textContent =
      result.total === 0
        ? '没有找到结果'
        : `显示 ${start}-${end} 个职位，共 ${result.total} 个`;
  }

  /**
   * 渲染分页
   */
  private renderPagination(result: SearchResult): void {
    const totalPages = Math.ceil(result.total / this.pageSize);

    if (totalPages <= 1) {
      this.paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = '<div class="flex items-center gap-2">';

    // 上一页
    if (this.currentPage > 1) {
      paginationHTML += `
        <button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(${this.currentPage - 1})">
          上一页
        </button>
      `;
    }

    // 页码
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);

    if (startPage > 1) {
      paginationHTML += `<button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="px-2">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === this.currentPage;
      paginationHTML += `
        <button class="px-3 py-2 border rounded-md ${
          isActive
            ? 'bg-primary-600 text-white border-primary-600'
            : 'border-neutral-300 hover:bg-neutral-50'
        }" onclick="searchManager.goToPage(${i})">
          ${i}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="px-2">...</span>`;
      }
      paginationHTML += `<button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(${totalPages})">${totalPages}</button>`;
    }

    // 下一页
    if (this.currentPage < totalPages) {
      paginationHTML += `
        <button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(${this.currentPage + 1})">
          下一页
        </button>
      `;
    }

    paginationHTML += '</div>';
    this.paginationContainer.innerHTML = paginationHTML;
  }

  /**
   * 跳转到指定页面
   */
  public async goToPage(page: number): Promise<void> {
    this.currentPage = page;
    await this.performSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * 显示加载状态
   */
  private showLoadingState(): void {
    this.resultsContainer.innerHTML = `
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-neutral-600">正在搜索职位...</p>
      </div>
    `;
  }

  /**
   * 隐藏加载状态
   */
  private hideLoadingState(): void {
    // 加载状态会在渲染结果时被替换
  }

  /**
   * 显示错误状态
   */
  private showErrorState(): void {
    this.resultsContainer.innerHTML = `
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-medium text-neutral-900 mb-2">搜索出现错误</h3>
        <p class="text-neutral-600">请稍后重试</p>
      </div>
    `;
  }

  // 辅助方法
  private getTypeLabel(type: string): string {
    const labels = {
      'full-time': '全职',
      'part-time': '兼职',
      'contract': '合同工',
      'internship': '实习',
      'freelance': '自由职业'
    };
    return labels[type as keyof typeof labels] || type;
  }

  private getRemoteLabel(remote?: string): string {
    if (!remote) return '未指定';
    const labels = {
      'on-site': '现场办公',
      'hybrid': '混合办公',
      'remote': '完全远程',
      'flexible': '灵活办公'
    };
    return labels[remote as keyof typeof labels] || remote;
  }

  private formatSalary(salary?: SalaryRange): string {
    if (!salary) return '薪资面议';
    const { min, max, currency, period } = salary;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (min === max) {
      return `${formatter.format(min)}/${period === 'yearly' ? '年' : '月'}`;
    }
    return `${formatter.format(min)} - ${formatter.format(max)}/${period === 'yearly' ? '年' : '月'}`;
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天发布';
    if (diffDays === 1) return '昨天发布';
    if (diffDays <= 7) return `${diffDays}天前发布`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}周前发布`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)}个月前发布`;
    return `${Math.floor(diffDays / 365)}年前发布`;
  }
}

// 全局搜索管理器实例
declare global {
  interface Window {
    searchManager?: PositionSearchManager;
  }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.searchManager = new PositionSearchManager();
  } catch (error) {
    logger.error('Failed to initialize PositionSearchManager', error);
  }
});

export default PositionSearchManager;
