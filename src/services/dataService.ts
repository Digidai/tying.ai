import type { Position, SearchFilters, SearchResult, SalaryRange } from '@/types';
import { logger } from '@/utils/logger';

type RawPosition = Partial<Position> & {
  id?: string;
  title: string;
  company: string;
  location: string;
  category: Position['category'];
  salary?: SalaryRange;
};

/**
 * 数据服务类 - 管理职位数据的搜索、筛选和管理
 */
export class DataService {
  private static instance: DataService;
  private positions: Position[] = [];
  private initialized = false;

  private constructor() {}

  /**
   * 获取数据服务单例实例
   */
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  /**
   * 初始化数据服务
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 从本地存储或API加载数据
      this.positions = await this.loadPositions();
      this.initialized = true;
      logger.log('Data service initialized with', this.positions.length, 'positions');
    } catch (error) {
      logger.error('Failed to initialize data service:', error);
      throw error;
    }
  }

  /**
   * 加载职位数据
   */
  private async loadPositions(): Promise<Position[]> {
    try {
      // 首先尝试从本地数据文件加载
      const response = await fetch('/data/positions.json');
      if (response.ok) {
        const data = (await response.json()) as RawPosition[];
        return data.map(this.transformPositionData);
      }
    } catch (error) {
      console.warn('Failed to load positions from local data:', error);
    }

    // 如果本地数据不可用，使用示例数据
    return this.getSamplePositions();
  }

  /**
   * 转换职位数据格式
   */
  private transformPositionData(data: RawPosition): Position {
    return {
      id: data.id || this.generateId(),
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type || 'full-time',
      category: data.category,
      experience: data.experience || 'mid',
      salary: data.salary,
      description: data.description || '',
      requirements: data.requirements || [],
      responsibilities: data.responsibilities || [],
      benefits: data.benefits,
      skills: data.skills || [],
      postedAt: new Date(data.postedAt || Date.now()),
      isActive: data.isActive !== false,
      remote: data.remote,
      visa: data.visa,
      tags: data.tags || [],
    };
  }

  /**
   * 搜索职位
   */
  async searchPositions(filters: SearchFilters, page = 1, pageSize = 20): Promise<SearchResult> {
    await this.initialize();

    let filteredPositions = [...this.positions];

    // 应用筛选条件
    filteredPositions = this.applyFilters(filteredPositions, filters);

    // 排序
    const sortOption = filters.sort || 'newest';
    filteredPositions.sort((a, b) => {
      if (sortOption === 'salary-desc') {
        const aMax = a.salary?.max ?? a.salary?.min ?? 0;
        const bMax = b.salary?.max ?? b.salary?.min ?? 0;
        return bMax - aMax;
      }
      if (sortOption === 'salary-asc') {
        const aMin = a.salary?.min ?? a.salary?.max ?? 0;
        const bMin = b.salary?.min ?? b.salary?.max ?? 0;
        return aMin - bMin;
      }
      return b.postedAt.getTime() - a.postedAt.getTime();
    });

    // 分页
    const total = filteredPositions.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const positions = filteredPositions.slice(startIndex, endIndex);

    // 生成搜索分面
    const facets = this.generateFacets(filteredPositions);

    return {
      positions,
      total,
      page,
      pageSize,
      facets,
    };
  }

  /**
   * 应用筛选条件
   */
  private applyFilters(positions: Position[], filters: SearchFilters): Position[] {
    return positions.filter(position => {
      // 关键词搜索
      if (filters.keywords) {
        const keywords = filters.keywords.toLowerCase();
        const searchText = `${position.title} ${position.description} ${position.company} ${position.skills.join(' ')}`.toLowerCase();
        if (!searchText.includes(keywords)) {
          return false;
        }
      }

      // 地点筛选
      if (filters.location && !position.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // 职位类型筛选
      if (filters.type && filters.type.length > 0 && !filters.type.includes(position.type)) {
        return false;
      }

      // 经验级别筛选
      if (filters.experience && filters.experience.length > 0 && !filters.experience.includes(position.experience)) {
        return false;
      }

      // 远程类型筛选
      if (filters.remote && filters.remote.length > 0 && (!position.remote || !filters.remote.includes(position.remote))) {
        return false;
      }

      // 薪资范围筛选
      if (filters.salaryMin && position.salary) {
        const salaryMax = position.salary.max ?? position.salary.min ?? 0;
        if (salaryMax < filters.salaryMin) {
          return false;
        }
      }
      if (filters.salaryMax && position.salary) {
        const salaryMin = position.salary.min ?? position.salary.max ?? 0;
        if (salaryMin > filters.salaryMax) {
          return false;
        }
      }

      // 公司筛选
      if (filters.company && filters.company.length > 0 && !filters.company.includes(position.company)) {
        return false;
      }

      // 技能筛选
      if (filters.skills && filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.some(skill =>
          position.skills.some(positionSkill =>
            positionSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasRequiredSkills) {
          return false;
        }
      }

      // 签证支持筛选
      if (filters.visa && position.visa !== filters.visa) {
        return false;
      }

      return true;
    });
  }

  /**
   * 生成搜索分面
   */
  private generateFacets(positions: Position[]) {
    const categories = new Map<string, number>();
    const companies = new Map<string, number>();
    const locations = new Map<string, number>();
    const skills = new Map<string, number>();

    positions.forEach(position => {
      // 统计分类
      const categoryName = position.category.name;
      categories.set(categoryName, (categories.get(categoryName) || 0) + 1);

      // 统计公司
      companies.set(position.company, (companies.get(position.company) || 0) + 1);

      // 统计地点
      locations.set(position.location, (locations.get(position.location) || 0) + 1);

      // 统计技能
      position.skills.forEach(skill => {
        skills.set(skill, (skills.get(skill) || 0) + 1);
      });
    });

    return {
      categories: Array.from(categories.entries())
        .map(([name, count]) => ({ id: name, name, count }))
        .sort((a, b) => b.count - a.count),
      companies: Array.from(companies.entries())
        .map(([name, count]) => ({ id: name, name, count }))
        .sort((a, b) => b.count - a.count),
      locations: Array.from(locations.entries())
        .map(([name, count]) => ({ id: name, name, count }))
        .sort((a, b) => b.count - a.count),
      skills: Array.from(skills.entries())
        .map(([name, count]) => ({ id: name, name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20), // 限制技能数量
    };
  }

  /**
   * 根据ID获取职位详情
   */
  async getPositionById(id: string): Promise<Position | null> {
    await this.initialize();
    return this.positions.find(position => position.id === id) || null;
  }

  /**
   * 获取热门职位
   */
  async getFeaturedPositions(limit = 6): Promise<Position[]> {
    await this.initialize();
    // 按发布时间排序，取最新的几个
    return this.positions
      .filter(position => position.isActive)
      .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
      .slice(0, limit);
  }

  /**
   * 获取推荐职位
   */
  async getRecommendedPositions(userPreferences?: Partial<SearchFilters>, limit = 10): Promise<Position[]> {
    await this.initialize();
    // 简单的推荐算法 - 基于技能匹配和新鲜度
    return this.positions
      .filter(position => position.isActive)
      .sort((a, b) => {
        // 优先考虑最近发布的职位
        const dateDiff = b.postedAt.getTime() - a.postedAt.getTime();
        if (Math.abs(dateDiff) > 7 * 24 * 60 * 60 * 1000) { // 7天内
          return dateDiff;
        }
        // 随机排序以提供多样性
        return Math.random() - 0.5;
      })
      .slice(0, limit);
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 示例数据
   */
  private getSamplePositions(): Position[] {
    return [
      {
        id: 'pos_1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'full-time',
        category: {
          id: 'eng',
          name: 'Engineering',
          description: 'Software development and engineering roles',
          icon: '💻'
        },
        experience: 'senior',
        salary: {
          min: 120000,
          max: 180000,
          currency: 'USD',
          period: 'yearly'
        },
        description: 'We are looking for an experienced frontend developer to join our team.',
        requirements: ['5+ years of experience', 'React expertise', 'TypeScript knowledge'],
        responsibilities: ['Develop new features', 'Code reviews', 'Mentor junior developers'],
        benefits: ['Health insurance', '401k', 'Remote work options'],
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        postedAt: new Date('2024-01-15'),
        isActive: true,
        remote: 'hybrid',
        visa: 'yes',
        tags: ['frontend', 'react', 'typescript', 'senior']
      },
      {
        id: 'pos_2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'full-time',
        category: {
          id: 'pm',
          name: 'Product Management',
          description: 'Product strategy and management roles',
          icon: '📊'
        },
        experience: 'mid',
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD',
          period: 'yearly'
        },
        description: 'Join our product team to help shape the future of our platform.',
        requirements: ['3+ years product management experience', 'Analytical skills', 'Communication skills'],
        responsibilities: ['Product strategy', 'Roadmap planning', 'Stakeholder management'],
        benefits: ['Equity', 'Flexible hours', 'Professional development'],
        skills: ['Product Strategy', 'Analytics', 'Communication', 'Leadership'],
        postedAt: new Date('2024-01-10'),
        isActive: true,
        remote: 'remote',
        visa: 'potential',
        tags: ['product', 'strategy', 'analytics', 'remote']
      },
      {
        id: 'pos_3',
        title: 'UX Designer',
        company: 'DesignHub',
        location: 'Austin, TX',
        type: 'full-time',
        category: {
          id: 'design',
          name: 'Design',
          description: 'UI/UX and design roles',
          icon: '🎨'
        },
        experience: 'mid',
        salary: {
          min: 85000,
          max: 120000,
          currency: 'USD',
          period: 'yearly'
        },
        description: 'Creative UX designer needed for innovative product design.',
        requirements: ['Portfolio required', '3+ years experience', 'Figma proficiency'],
        responsibilities: ['User research', 'Wireframing', 'Prototyping', 'Design systems'],
        benefits: ['Creative environment', 'Design tools', 'Conference budget'],
        skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
        postedAt: new Date('2024-01-08'),
        isActive: true,
        remote: 'flexible',
        visa: 'yes',
        tags: ['ux', 'design', 'figma', 'research']
      }
    ];
  }
}

// 导出单例实例
export const dataService = DataService.getInstance();
