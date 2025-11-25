import { dataService } from '@/services/dataService';
import { logger } from '@/utils/logger';
import type { SearchFilters, SearchResult, Position, SalaryRange } from '@/types';

/**
 * 简化版搜索管理器：仅按职位标题关键词搜索
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

    if (
      !(formElement instanceof HTMLFormElement) ||
      !resultsElement ||
      !statsElement ||
      !paginationElement
    ) {
      logger.error('Search form or related containers not found in DOM');
      throw new Error('Search page missing required markup for PositionSearchManager');
    }

    this.form = formElement;
    this.resultsContainer = resultsElement;
    this.statsContainer = statsElement;
    this.paginationContainer = paginationElement;

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSearch();
    });

    this.form.addEventListener('input', e => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        this.handleFilterChange();
      }
    });

    this.form.addEventListener('reset', () => {
      window.setTimeout(() => {
        this.currentFilters = {};
        this.currentPage = 1;
        void this.performSearch();
      }, 0);
    });
  }

  private async handleSearch(): Promise<void> {
    if (this.isLoading) return;

    this.currentPage = 1;
    this.collectFilters();
    await this.performSearch();
  }

  private handleFilterChange(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.handleSearch();
    }, 300);
  }

  /**
   * 只收集标题关键词
   */
  private collectFilters(): void {
    const formData = new FormData(this.form);
    const keywords = (formData.get('keywords') as string | null)?.trim();
    this.currentFilters = keywords ? { keywords } : {};
  }

  private async performSearch(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoadingState();

    try {
      const result = await dataService.searchPositions(
        this.currentFilters,
        this.currentPage,
        this.pageSize,
      );

      this.renderResults(result);
      this.renderStats(result);
      this.renderPagination(result);
    } catch (error) {
      logger.error('Search failed:', error);
      this.showErrorState();
    } finally {
      this.isLoading = false;
    }
  }

  private renderResults(result: SearchResult): void {
    if (result.positions.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-neutral-900 mb-2">没有找到匹配的职位</h3>
          <p class="text-neutral-600">尝试调整搜索关键词</p>
        </div>
      `;
      return;
    }

    const template = document.getElementById('position-card-template') as HTMLTemplateElement | null;
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

  private renderStats(result: SearchResult): void {
    if (result.total === 0) {
      this.statsContainer.textContent = '没有找到结果';
      return;
    }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, result.total);
    this.statsContainer.textContent = `显示 ${start}-${end} 个职位，共 ${result.total} 个`;
  }

  private renderPagination(result: SearchResult): void {
    const totalPages = Math.ceil(result.total / this.pageSize);

    if (totalPages <= 1) {
      this.paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = '<div class="flex items-center gap-2">';

    if (this.currentPage > 1) {
      paginationHTML += `
        <button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(${this.currentPage - 1})">
          上一页
        </button>
      `;
    }

    // 限制显示的页码数量，最多显示 7 个页码
    const maxVisiblePages = 7;
    const endPage = Math.min(totalPages, this.currentPage + Math.floor(maxVisiblePages / 2));
    const startPage = Math.max(1, endPage - maxVisiblePages + 1);

    // 显示第一页和省略号
    if (startPage > 1) {
      paginationHTML += `
        <button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(1)">1</button>
      `;
      if (startPage > 2) {
        paginationHTML += `<span class="px-2 text-neutral-400">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === this.currentPage;
      paginationHTML += `
        <button class="px-3 py-2 border rounded-md ${isActive
          ? 'bg-primary-600 text-white border-primary-600'
          : 'border-neutral-300 hover:bg-neutral-50'
        }" onclick="searchManager.goToPage(${i})">
          ${i}
        </button>
      `;
    }

    // 显示省略号和最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="px-2 text-neutral-400">...</span>`;
      }
      paginationHTML += `
        <button class="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" onclick="searchManager.goToPage(${totalPages})">${totalPages}</button>
      `;
    }

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

  public async goToPage(page: number): Promise<void> {
    this.currentPage = page;
    await this.performSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private showLoadingState(): void {
    this.resultsContainer.innerHTML = `
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-neutral-600">正在搜索职位...</p>
      </div>
    `;
  }

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

  private getTypeLabel(type: string): string {
    const labels = {
      'full-time': '全职',
      'part-time': '兼职',
      contract: '合同工',
      internship: '实习',
      freelance: '自由职业',
    };
    return labels[type as keyof typeof labels] || type;
  }

  private getRemoteLabel(remote?: string): string {
    if (!remote) return '未指定';
    const labels = {
      'on-site': '现场办公',
      hybrid: '混合办公',
      remote: '完全远程',
      flexible: '灵活办公',
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
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '即将发布';
    if (diffDays === 0) return '今天发布';
    if (diffDays === 1) return '昨天发布';
    if (diffDays <= 7) return `${diffDays}天前发布`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}周前发布`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)}个月前发布`;
    return `${Math.floor(diffDays / 365)}年前发布`;
  }
}

declare global {
  interface Window {
    searchManager?: PositionSearchManager;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    window.searchManager = new PositionSearchManager();
  } catch (error) {
    logger.error('Failed to initialize PositionSearchManager', error);
  }
});

export default PositionSearchManager;
