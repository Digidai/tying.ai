/**
 * 岗位搜索组件
 * 提供实时搜索、智能建议、搜索历史等功能
 */

class PositionSearch {
    constructor(containerId, positionManager) {
        this.container = document.getElementById(containerId);
        this.positionManager = positionManager;
        this.searchInput = null;
        this.suggestionsContainer = null;
        this.searchHistory = this.loadSearchHistory();
        this.debounceTimer = null;
        this.isSearchFocused = false;

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="position-search">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            class="search-input"
                            placeholder="搜索岗位、技能或关键词..."
                            autocomplete="off"
                            aria-label="搜索岗位"
                        >
                        <button class="search-clear" aria-label="清除搜索" style="display: none;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- 搜索建议下拉框 -->
                    <div class="search-suggestions" style="display: none;">
                        <div class="suggestions-header">
                            <span class="suggestions-title">搜索建议</span>
                        </div>
                        <div class="suggestions-list"></div>
                        <div class="suggestions-footer">
                            <div class="search-history">
                                <div class="history-header">
                                    <span>搜索历史</span>
                                    <button class="clear-history" aria-label="清除搜索历史">清除</button>
                                </div>
                                <div class="history-list"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 搜索结果统计 -->
                <div class="search-stats" style="display: none;">
                    <span class="stats-text"></span>
                    <button class="reset-search" aria-label="重置搜索">重置</button>
                </div>
            </div>
        `;

        this.searchInput = this.container.querySelector('.search-input');
        this.suggestionsContainer = this.container.querySelector('.search-suggestions');
        this.clearButton = this.container.querySelector('.search-clear');
        this.statsContainer = this.container.querySelector('.search-stats');
    }

    bindEvents() {
        // 搜索输入事件
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        // 搜索框聚焦事件
        this.searchInput.addEventListener('focus', () => {
            this.isSearchFocused = true;
            this.showSuggestions();
        });

        // 搜索框失焦事件
        this.searchInput.addEventListener('blur', () => {
            this.isSearchFocused = false;
            // 延迟隐藏建议框，以便点击建议项
            setTimeout(() => {
                if (!this.isSearchFocused) {
                    this.hideSuggestions();
                }
            }, 200);
        });

        // 清除按钮事件
        this.clearButton.addEventListener('click', () => {
            this.clearSearch();
        });

        // 键盘导航
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // 点击外部关闭建议框
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.hideSuggestions();
            }
        });

        // 清除搜索历史
        const clearHistoryBtn = this.container.querySelector('.clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearSearchHistory();
            });
        }

        // 重置搜索
        const resetSearchBtn = this.container.querySelector('.reset-search');
        if (resetSearchBtn) {
            resetSearchBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    handleSearchInput(query) {
        // 显示/隐藏清除按钮
        this.clearButton.style.display = query.trim() ? 'flex' : 'none';

        // 防抖搜索
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (query.trim()) {
                this.performSearch(query.trim());
            } else {
                this.clearSearch();
            }
        }, 300);

        // 实时更新建议
        this.updateSuggestions(query);
    }

    performSearch(query) {
        // 保存搜索历史
        this.addToSearchHistory(query);

        // 执行搜索
        const results = this.positionManager.search(query);

        // 更新搜索统计
        this.updateSearchStats(query, results.length);

        // 触发搜索事件
        this.dispatchSearchEvent('search', {
            query,
            results,
            totalResults: results.length
        });

        // 隐藏建议框
        this.hideSuggestions();
    }

    clearSearch() {
        this.searchInput.value = '';
        this.clearButton.style.display = 'none';
        this.hideSuggestions();
        this.hideSearchStats();

        // 重置岗位管理器的搜索
        this.positionManager.search('');

        // 触发搜索重置事件
        this.dispatchSearchEvent('reset');
    }

    updateSuggestions(query) {
        if (!query.trim() || !this.isSearchFocused) {
            this.showDefaultSuggestions();
            return;
        }

        const suggestions = this.generateSuggestions(query);
        this.renderSuggestions(suggestions);
    }

    generateSuggestions(query) {
        const queryLower = query.toLowerCase();
        const suggestions = [];
        const maxSuggestions = 5;

        // 从岗位标题中找建议
        this.positionManager.positions.forEach(position => {
            if (position.title.toLowerCase().includes(queryLower)) {
                suggestions.push({
                    type: 'position',
                    text: position.title,
                    description: position.category,
                    data: position
                });
            }
        });

        // 从技能中找建议
        const allSkills = new Set();
        this.positionManager.positions.forEach(position => {
            position.skills.forEach(skill => {
                if (skill.toLowerCase().includes(queryLower)) {
                    allSkills.add(skill);
                }
            });
        });

        allSkills.forEach(skill => {
            if (suggestions.length < maxSuggestions) {
                suggestions.push({
                    type: 'skill',
                    text: skill,
                    description: '技能',
                    data: { skill }
                });
            }
        });

        // 从标签中找建议
        const allTags = new Set();
        this.positionManager.positions.forEach(position => {
            position.tags.forEach(tag => {
                if (tag.toLowerCase().includes(queryLower)) {
                    allTags.add(tag);
                }
            });
        });

        allTags.forEach(tag => {
            if (suggestions.length < maxSuggestions) {
                suggestions.push({
                    type: 'tag',
                    text: tag,
                    description: '标签',
                    data: { tag }
                });
            }
        });

        return suggestions.slice(0, maxSuggestions);
    }

    showDefaultSuggestions() {
        const featuredPositions = this.positionManager.getFeaturedPositions(3);
        const suggestions = featuredPositions.map(position => ({
            type: 'position',
            text: position.title,
            description: `热门岗位 - ${position.category}`,
            data: position
        }));

        this.renderSuggestions(suggestions);
    }

    renderSuggestions(suggestions) {
        const suggestionsList = this.container.querySelector('.suggestions-list');

        if (suggestions.length === 0) {
            suggestionsList.innerHTML = `
                <div class="no-suggestions">
                    <span>没有找到相关建议</span>
                </div>
            `;
            return;
        }

        suggestionsList.innerHTML = suggestions.map((suggestion, index) => `
            <div class="suggestion-item" data-index="${index}" data-type="${suggestion.type}">
                <div class="suggestion-icon">
                    ${this.getSuggestionIcon(suggestion.type)}
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-text">${this.highlightMatch(suggestion.text, this.searchInput.value)}</div>
                    <div class="suggestion-description">${suggestion.description}</div>
                </div>
            </div>
        `).join('');

        // 绑定建议项点击事件
        suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectSuggestion(item);
            });
        });

        // 显示搜索历史
        this.renderSearchHistory();
    }

    renderSearchHistory() {
        const historyList = this.container.querySelector('.history-list');
        const recentHistory = this.searchHistory.slice(0, 3);

        if (recentHistory.length === 0) {
            historyList.innerHTML = '<div class="no-history">暂无搜索历史</div>';
            return;
        }

        historyList.innerHTML = recentHistory.map((query, index) => `
            <div class="history-item" data-index="${index}">
                <svg class="history-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="history-text">${query}</span>
            </div>
        `).join('');

        // 绑定历史项点击事件
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.querySelector('.history-text').textContent;
                this.searchInput.value = query;
                this.performSearch(query);
            });
        });
    }

    getSuggestionIcon(type) {
        const icons = {
            position: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="m22 21-3-3 3-3"></path><path d="m19 18 3-3"></path></svg>',
            skill: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
            tag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>'
        };
        return icons[type] || icons.position;
    }

    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    selectSuggestion(item) {
        const type = item.dataset.type;
        const text = item.querySelector('.suggestion-text').textContent;

        this.searchInput.value = text;
        this.performSearch(text);
    }

    handleKeyNavigation(e) {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item, .history-item');
        if (items.length === 0) return;

        let currentIndex = -1;
        const currentItem = this.suggestionsContainer.querySelector('.suggestion-item.selected, .history-item.selected');
        if (currentItem) {
            currentIndex = parseInt(currentItem.dataset.index);
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                this.highlightSuggestion(items, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, -1);
                this.highlightSuggestion(items, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    items[currentIndex].click();
                } else {
                    this.performSearch(this.searchInput.value);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                this.searchInput.blur();
                break;
        }
    }

    highlightSuggestion(items, index) {
        items.forEach(item => item.classList.remove('selected'));
        if (index >= 0 && items[index]) {
            items[index].classList.add('selected');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    showSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'block';
            this.updateSuggestions(this.searchInput.value);
        }
    }

    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
    }

    updateSearchStats(query, resultCount) {
        const statsText = this.statsContainer.querySelector('.stats-text');
        statsText.textContent = `找到 ${resultCount} 个与 "${query}" 相关的岗位`;
        this.statsContainer.style.display = 'flex';
    }

    hideSearchStats() {
        this.statsContainer.style.display = 'none';
    }

    // 搜索历史管理
    loadSearchHistory() {
        try {
            const history = localStorage.getItem('positionSearchHistory');
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }

    saveSearchHistory() {
        try {
            localStorage.setItem('positionSearchHistory', JSON.stringify(this.searchHistory));
        } catch (e) {
            console.warn('无法保存搜索历史');
        }
    }

    addToSearchHistory(query) {
        // 移除重复项
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        // 添加到开头
        this.searchHistory.unshift(query);
        // 限制历史记录数量
        this.searchHistory = this.searchHistory.slice(0, 10);
        // 保存
        this.saveSearchHistory();
    }

    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.renderSearchHistory();
    }

    dispatchSearchEvent(type, data = {}) {
        const event = new CustomEvent('positionSearch', {
            detail: { type, ...data }
        });
        this.container.dispatchEvent(event);
    }
}

// 导出
window.PositionSearch = PositionSearch;