import { logger } from '@/utils/logger';
import { aiService } from './aiService';
import type { Position } from '@/types';

const JINA_API_KEY = import.meta.env.PUBLIC_JINA_API_KEY;

export class JinaService {
    private static instance: JinaService;
    private apiKey: string;

    private constructor() {
        this.apiKey = JINA_API_KEY || '';
        if (!this.apiKey) {
            logger.warn('Jina API key not found. Web search features will be disabled.');
        }
    }

    static getInstance(): JinaService {
        if (!JinaService.instance) {
            JinaService.instance = new JinaService();
        }
        return JinaService.instance;
    }

    /**
     * Search the web for positions using Jina AI
     */
    async searchWeb(query: string): Promise<Position[]> {
        if (!this.apiKey) return [];

        try {
            // Construct Jina Search URL
            // We append "jobs" or "positions" to ensure we get relevant results
            const searchUrl = `https://s.jina.ai/${encodeURIComponent(query + ' jobs positions hiring')}`;

            const response = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Retain-Images': 'none'
                }
            });

            if (!response.ok) {
                throw new Error(`Jina API error: ${response.statusText}`);
            }

            const markdown = await response.text();

            // Use Gemini to parse the markdown into structured data
            // We'll use a specialized method in AIService for this, or just call the generic one if I exposed it.
            // Since I didn't expose a generic "parse markdown" method, I'll add a helper here or modify AIService.
            // For now, I'll assume I can add a method to AIService or just do it here if I had access to the key.
            // But AIService has the key. I should add a method to AIService: `parseJobListingsFromText`.

            return await this.parsePositionsFromMarkdown(markdown);

        } catch (error) {
            logger.error('Jina Search error:', error);
            return [];
        }
    }

    private async parsePositionsFromMarkdown(markdown: string): Promise<Position[]> {
        return await aiService.extractPositionsFromText(markdown);
    }
}

export const jinaService = JinaService.getInstance();
