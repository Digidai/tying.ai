/**
 * 岗位数据管理系统
 * 统一管理所有岗位信息，支持搜索、筛选、分页等功能
 */

// 岗位数据
const positionsData = [
    {
        id: 'software-engineer',
        title: 'Software Engineer',
        category: 'engineering',
        subcategory: 'development',
        description: 'Comprehensive guide to software development roles, from junior developers to senior architects. Learn about required skills, technologies, and career progression.',
        url: 'software-engineer/',
        featured: true,
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'Docker'],
        salary: {
            min: 80000,
            max: 200000,
            currency: 'USD'
        },
        experience: 'Entry-level to Senior',
        type: 'full-time',
        remote: true,
        tags: ['programming', 'web-development', 'backend', 'frontend']
    },
    {
        id: 'product-manager',
        title: 'Product Manager',
        category: 'business',
        subcategory: 'product',
        description: 'Deep dive into product management roles, including responsibilities, skills, tools, and career paths from associate to senior product management positions.',
        url: 'product-manager/',
        featured: true,
        skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Stakeholder Management'],
        salary: {
            min: 90000,
            max: 180000,
            currency: 'USD'
        },
        experience: 'Mid-level to Senior',
        type: 'full-time',
        remote: true,
        tags: ['product', 'strategy', 'leadership', 'analytics']
    },
    {
        id: 'ai-product-manager',
        title: 'AI Product Manager',
        category: 'business',
        subcategory: 'ai-product',
        description: 'Specialized guide for AI and machine learning product management, covering unique challenges, required knowledge, and emerging opportunities in AI products.',
        url: 'ai-product-manager/',
        featured: true,
        skills: ['Machine Learning', 'Product Strategy', 'Data Science', 'AI Ethics', 'Stakeholder Management'],
        salary: {
            min: 110000,
            max: 220000,
            currency: 'USD'
        },
        experience: 'Senior to Principal',
        type: 'full-time',
        remote: true,
        tags: ['ai', 'machine-learning', 'product', 'innovation']
    },
    {
        id: 'data-scientist',
        title: 'Data Scientist',
        category: 'engineering',
        subcategory: 'data',
        description: 'Comprehensive guide to data science roles, covering statistical analysis, machine learning, data visualization, and business intelligence.',
        url: 'data-scientist/',
        featured: false,
        skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'Tableau'],
        salary: {
            min: 95000,
            max: 190000,
            currency: 'USD'
        },
        experience: 'Mid-level to Senior',
        type: 'full-time',
        remote: true,
        tags: ['data', 'analytics', 'machine-learning', 'statistics']
    },
    {
        id: 'ux-designer',
        title: 'UX Designer',
        category: 'design',
        subcategory: 'user-experience',
        description: 'Complete guide to UX design roles, including user research, interaction design, prototyping, and design thinking methodologies.',
        url: 'ux-designer/',
        featured: false,
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
        salary: {
            min: 75000,
            max: 150000,
            currency: 'USD'
        },
        experience: 'Entry-level to Senior',
        type: 'full-time',
        remote: true,
        tags: ['design', 'user-experience', 'research', 'prototyping']
    },
    {
        id: 'devops-engineer',
        title: 'DevOps Engineer',
        category: 'engineering',
        subcategory: 'infrastructure',
        description: 'Essential guide to DevOps roles, covering CI/CD pipelines, cloud infrastructure, containerization, and infrastructure as code.',
        url: 'devops-engineer/',
        featured: false,
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Monitoring'],
        salary: {
            min: 95000,
            max: 180000,
            currency: 'USD'
        },
        experience: 'Mid-level to Senior',
        type: 'full-time',
        remote: true,
        tags: ['devops', 'cloud', 'infrastructure', 'automation']
    }
];

// 岗位管理类
class PositionManager {
    constructor() {
        this.positions = positionsData;
        this.filteredPositions = [...this.positions];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.searchQuery = '';
        this.filters = {
            category: '',
            type: '',
            remote: null,
            experience: '',
            minSalary: null,
            maxSalary: null
        };
    }

    /**
     * 搜索岗位
     * @param {string} query - 搜索关键词
     */
    search(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.applyFilters();
        return this.filteredPositions;
    }

    /**
     * 设置筛选条件
     * @param {Object} newFilters - 筛选条件
     */
    setFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.applyFilters();
        return this.filteredPositions;
    }

    /**
     * 应用所有筛选条件
     */
    applyFilters() {
        let filtered = [...this.positions];

        // 搜索筛选
        if (this.searchQuery) {
            filtered = filtered.filter(position =>
                position.title.toLowerCase().includes(this.searchQuery) ||
                position.description.toLowerCase().includes(this.searchQuery) ||
                position.skills.some(skill => skill.toLowerCase().includes(this.searchQuery)) ||
                position.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
            );
        }

        // 分类筛选
        if (this.filters.category) {
            filtered = filtered.filter(position =>
                position.category === this.filters.category
            );
        }

        // 工作类型筛选
        if (this.filters.type) {
            filtered = filtered.filter(position =>
                position.type === this.filters.type
            );
        }

        // 远程工作筛选
        if (this.filters.remote !== null) {
            filtered = filtered.filter(position =>
                position.remote === this.filters.remote
            );
        }

        // 经验要求筛选
        if (this.filters.experience) {
            filtered = filtered.filter(position =>
                position.experience.toLowerCase().includes(this.filters.experience.toLowerCase())
            );
        }

        // 薪资范围筛选
        if (this.filters.minSalary !== null) {
            filtered = filtered.filter(position =>
                position.salary.min >= this.filters.minSalary
            );
        }

        if (this.filters.maxSalary !== null) {
            filtered = filtered.filter(position =>
                position.salary.max <= this.filters.maxSalary
            );
        }

        this.filteredPositions = filtered;
        this.currentPage = 1; // 重置到第一页
    }

    /**
     * 获取当前页的岗位
     */
    getCurrentPagePositions() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredPositions.slice(startIndex, endIndex);
    }

    /**
     * 获取总页数
     */
    getTotalPages() {
        return Math.ceil(this.filteredPositions.length / this.itemsPerPage);
    }

    /**
     * 设置当前页
     * @param {number} page - 页码
     */
    setCurrentPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
        }
    }

    /**
     * 获取所有分类
     */
    getCategories() {
        const categories = [...new Set(this.positions.map(p => p.category))];
        return categories.map(cat => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1)
        }));
    }

    /**
     * 获取所有工作类型
     */
    getJobTypes() {
        const types = [...new Set(this.positions.map(p => p.type))];
        return types.map(type => ({
            value: type,
            label: type.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        }));
    }

    /**
     * 获取所有经验要求
     */
    getExperienceLevels() {
        const levels = [...new Set(this.positions.map(p => p.experience))];
        return levels.map(level => ({
            value: level,
            label: level
        }));
    }

    /**
     * 获取薪资范围
     */
    getSalaryRange() {
        const salaries = this.positions.map(p => p.salary.min);
        const min = Math.min(...salaries);
        const max = Math.max(...salaries);

        return {
            min: Math.floor(min / 10000) * 10000,
            max: Math.ceil(max / 10000) * 10000
        };
    }

    /**
     * 获取推荐岗位
     * @param {number} limit - 推荐数量
     */
    getFeaturedPositions(limit = 3) {
        return this.positions
            .filter(p => p.featured)
            .slice(0, limit);
    }

    /**
     * 根据ID获取岗位
     * @param {string} id - 岗位ID
     */
    getPositionById(id) {
        return this.positions.find(p => p.id === id);
    }

    /**
     * 获取相关岗位
     * @param {string} categoryId - 分类ID
     * @param {string} currentId - 当前岗位ID
     * @param {number} limit - 推荐数量
     */
    getRelatedPositions(categoryId, currentId, limit = 3) {
        return this.positions
            .filter(p => p.category === categoryId && p.id !== currentId)
            .slice(0, limit);
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            totalPositions: this.positions.length,
            featuredPositions: this.positions.filter(p => p.featured).length,
            categories: this.getCategories().length,
            averageSalary: Math.round(
                this.positions.reduce((sum, p) => sum + (p.salary.min + p.salary.max) / 2, 0) /
                this.positions.length
            ),
            remotePositions: this.positions.filter(p => p.remote).length
        };
    }

    /**
     * 重置所有筛选条件
     */
    resetFilters() {
        this.searchQuery = '';
        this.filters = {
            category: '',
            type: '',
            remote: null,
            experience: '',
            minSalary: null,
            maxSalary: null
        };
        this.currentPage = 1;
        this.applyFilters();
    }
}

// 导出
window.PositionManager = PositionManager;
window.positionsData = positionsData;