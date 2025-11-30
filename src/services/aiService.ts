import { logger } from '@/utils/logger';
import type { SearchFilters, Position } from '@/types';

const OPENROUTER_API_KEY = import.meta.env.PUBLIC_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.SITE || 'https://tying.ai';
const SITE_NAME = 'Tying.ai';

// Model specified by user
const GEMINI_MODEL = 'google/gemini-3-pro-preview';

export class AIService {
    private static instance: AIService;
    private apiKey: string;

    private constructor() {
        this.apiKey = OPENROUTER_API_KEY || '';
        if (!this.apiKey) {
            logger.warn('OpenRouter API key not found. AI features will be disabled.');
        }
    }

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * Analyze natural language query and convert to structured filters
     */
    async parseSearchQuery(query: string): Promise<Partial<SearchFilters>> {
        if (!this.apiKey) return { keywords: query };

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': SITE_URL,
                    'X-Title': SITE_NAME,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: GEMINI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a search query parser for a job board. Convert the user's natural language query into a JSON object matching the SearchFilters interface.
              
              Interface:
              interface SearchFilters {
                keywords?: string; // General keywords
                location?: string;
                type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'; // Array in actual interface but return single or array
                experience?: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
                remote?: 'on-site' | 'hybrid' | 'remote' | 'flexible';
                salaryMin?: number;
                salaryMax?: number;
                company?: string; // Array in interface
                skills?: string; // Array in interface
                visa?: 'yes' | 'no' | 'potential';
              }

              Return ONLY the JSON object. Do not include markdown formatting.`
                        },
                        {
                            role: 'user',
                            content: query
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (!content) return { keywords: query };

            try {
                // Clean up markdown if present
                const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
                const filters = JSON.parse(jsonStr);

                // Normalize arrays to single values if needed or vice versa, depending on what the UI expects.
                // The UI expects arrays for some fields.
                if (filters.type && !Array.isArray(filters.type)) filters.type = [filters.type];
                if (filters.experience && !Array.isArray(filters.experience)) filters.experience = [filters.experience];
                if (filters.remote && !Array.isArray(filters.remote)) filters.remote = [filters.remote];
                if (filters.company && !Array.isArray(filters.company)) filters.company = [filters.company];
                if (filters.skills && !Array.isArray(filters.skills)) filters.skills = [filters.skills];

                return filters;
            } catch (e) {
                logger.error('Failed to parse AI response:', e);
                return { keywords: query };
            }
        } catch (error) {
            logger.error('AI Service error:', error);
            return { keywords: query };
        }
    }

    /**
     * Summarize search results
     */
    async summarizeResults(query: string, positions: Position[]): Promise<string> {
        if (!this.apiKey || positions.length === 0) return '';

        try {
            const positionsSummary = positions.slice(0, 5).map(p =>
                `- ${p.title} at ${p.company} (${p.location}): ${p.salary ? `${p.salary.min}-${p.salary.max}` : 'Salary N/A'}`
            ).join('\n');

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': SITE_URL,
                    'X-Title': SITE_NAME,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: GEMINI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a career assistant. Briefly summarize the search results for the user, highlighting the most relevant opportunities based on their query. Keep it encouraging and under 50 words.'
                        },
                        {
                            role: 'user',
                            content: `Query: "${query}"\n\nTop Results:\n${positionsSummary}`
                        }
                    ]
                })
            });

            if (!response.ok) return '';

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            logger.error('AI Summary error:', error);
            return '';
        }
    }
    /**
     * Extract structured position data from unstructured text (e.g. Jina search results)
     */
    async extractPositionsFromText(text: string): Promise<Position[]> {
        if (!this.apiKey || !text) return [];

        try {
            // Truncate text to avoid token limits if necessary (Gemini 2.0 has large context, but good to be safe/fast)
            const truncatedText = text.slice(0, 30000);

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': SITE_URL,
                    'X-Title': SITE_NAME,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: GEMINI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a data extraction specialist. Extract job positions from the provided text.
              Return a JSON array of Position objects.
              
              Interface Position {
                title: string;
                company: string;
                location: string;
                description: string; // Short summary
                skills: string[];
                salary?: { min: number, max: number, currency: string, period: 'yearly' | 'monthly' };
                url?: string; // If found in text
              }
              
              If specific fields are missing, infer reasonable defaults or leave empty/null.
              Return ONLY the JSON array.`
                        },
                        {
                            role: 'user',
                            content: truncatedText
                        }
                    ]
                })
            });

            if (!response.ok) return [];

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (!content) return [];

            const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
            const rawPositions = JSON.parse(jsonStr);

            // Map to full Position interface with defaults
            return rawPositions.map((p: Partial<Position> & { url?: string }, index: number) => ({
                id: `web_${Date.now()}_${index}`,
                title: p.title || 'Unknown Position',
                company: p.company || 'Unknown Company',
                location: p.location || 'Remote',
                type: 'full-time',
                category: { id: 'other', name: 'Other', description: '', icon: '🌐' },
                experience: 'mid',
                salary: p.salary,
                description: p.description || '',
                requirements: [],
                responsibilities: [],
                skills: p.skills || [],
                postedAt: new Date(),
                isActive: true,
                remote: 'flexible',
                tags: ['web-search'],
                ...p
            }));

        } catch (error) {
            logger.error('AI Extraction error:', error);
            return [];
        }
    }
}

export const aiService = AIService.getInstance();
