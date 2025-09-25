// =====================================
// backend/src/integrations/kwaai/kwaai-client.ts
// =====================================

import axios, { AxiosInstance } from 'axios';
import { logger } from '../../utils/logger';
import { config } from '../../utils/config';

export interface ProcessedDocument {
  id: string;
  content: string;
  metadata: {
    title?: string;
    author?: string;
    source?: string;
    privacyLevel: 'maximum' | 'high' | 'selective' | 'minimal';
    processingTimestamp: string;
    qualityScore: number;
  };
  embeddings?: number[];
  entities?: Entity[];
  summary?: string;
  keywords?: string[];
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  suggestions: string[];
  privacyCompliance: boolean;
}

export interface Contribution {
  id: string;
  type: 'document' | 'insight' | 'analysis' | 'comment';
  content: string;
  author: string;
  sessionId: string;
  privacyLevel: 'maximum' | 'high' | 'selective' | 'minimal';
  metadata: Record<string, any>;
}

export interface PrivacyPreservingResponse {
  content: string;
  privacyLevel: 'maximum' | 'high' | 'selective' | 'minimal';
  anonymized: boolean;
  metadata: Record<string, any>;
}

export class KwaaiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;
  private isConnected: boolean = false;
  private mockMode: boolean = false;

  constructor() {
    this.baseUrl = process.env.KWAAI_ENDPOINT || 'https://api.kwaai.ai';
    this.apiKey = config.kwaaiApiKey || '';
    this.mockMode = process.env.KWAAI_MOCK_MODE === 'true' || !this.apiKey;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Kwaai-Version': '1.0',
      },
      timeout: 30000,
    });

    // Add request/response interceptors
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Kwaai API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Kwaai API request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Kwaai API response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('Kwaai API response error:', error);
        return Promise.reject(error);
      }
    );
  }

  async initialize(): Promise<void> {
    if (this.mockMode) {
      logger.info('Kwaai client initialized in mock mode');
      this.isConnected = true;
      return;
    }

    try {
      // Test connection by fetching service status
      await this.client.get('/health');
      this.isConnected = true;
      logger.info('Kwaai API connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Kwaai API:', error);
      // Fall back to mock mode
      this.mockMode = true;
      this.isConnected = true;
      logger.warn('Falling back to Kwaai mock mode');
    }
  }

  async processDocument(content: string, metadata: Record<string, any> = {}): Promise<ProcessedDocument> {
    if (this.mockMode) {
      return this.mockProcessDocument(content, metadata);
    }

    try {
      const response = await this.client.post('/process/document', {
        content,
        metadata,
        options: {
          extractEntities: true,
          generateSummary: true,
          extractKeywords: true,
          privacyLevel: metadata.privacyLevel || 'selective'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to process document:', error);
      throw error;
    }
  }

  async generatePrivacyPreservingResponse(
    query: string,
    context: Record<string, any> = {}
  ): Promise<PrivacyPreservingResponse> {
    if (this.mockMode) {
      return this.mockPrivacyPreservingResponse(query, context);
    }

    try {
      const response = await this.client.post('/generate/privacy-preserving', {
        query,
        context,
        options: {
          anonymize: true,
          privacyLevel: context.privacyLevel || 'selective',
          preserveIntent: true
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to generate privacy-preserving response:', error);
      throw error;
    }
  }

  async validateContribution(contribution: Contribution): Promise<ValidationResult> {
    if (this.mockMode) {
      return this.mockValidateContribution(contribution);
    }

    try {
      const response = await this.client.post('/validate/contribution', {
        contribution,
        options: {
          checkPrivacy: true,
          checkQuality: true,
          checkCompliance: true
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to validate contribution:', error);
      throw error;
    }
  }

  async anonymizeData(data: any, privacyLevel: string = 'selective'): Promise<any> {
    if (this.mockMode) {
      return this.mockAnonymizeData(data, privacyLevel);
    }

    try {
      const response = await this.client.post('/anonymize/data', {
        data,
        privacyLevel,
        options: {
          preserveStructure: true,
          maintainRelationships: true
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to anonymize data:', error);
      throw error;
    }
  }

  async generateInsights(
    data: any[],
    context: Record<string, any> = {}
  ): Promise<{
    insights: string[];
    confidence: number;
    privacyLevel: string;
  }> {
    if (this.mockMode) {
      return this.mockGenerateInsights(data, context);
    }

    try {
      const response = await this.client.post('/generate/insights', {
        data,
        context,
        options: {
          privacyPreserving: true,
          anonymizeOutput: true,
          confidenceThreshold: 0.7
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to generate insights:', error);
      throw error;
    }
  }

  // Mock implementations for development
  private async mockProcessDocument(content: string, metadata: Record<string, any>): Promise<ProcessedDocument> {
    return {
      id: `mock_${Date.now()}`,
      content,
      metadata: {
        ...metadata,
        privacyLevel: metadata.privacyLevel || 'selective',
        processingTimestamp: new Date().toISOString(),
        qualityScore: 0.8
      },
      embeddings: new Array(1536).fill(0).map(() => Math.random()),
      entities: [
        { text: 'BGIN', type: 'ORGANIZATION', confidence: 0.9, startIndex: 0, endIndex: 4 },
        { text: 'blockchain', type: 'TECHNOLOGY', confidence: 0.8, startIndex: 10, endIndex: 20 }
      ],
      summary: `Mock summary for document with ${content.length} characters`,
      keywords: ['blockchain', 'governance', 'privacy', 'BGIN']
    };
  }

  private async mockPrivacyPreservingResponse(query: string, context: Record<string, any>): Promise<PrivacyPreservingResponse> {
    return {
      content: `Privacy-preserving response to: ${query}`,
      privacyLevel: context.privacyLevel || 'selective',
      anonymized: true,
      metadata: {
        processingTime: Date.now(),
        confidence: 0.85
      }
    };
  }

  private async mockValidateContribution(contribution: Contribution): Promise<ValidationResult> {
    return {
      isValid: true,
      confidence: 0.9,
      issues: [],
      suggestions: ['Consider adding more context', 'Review privacy settings'],
      privacyCompliance: true
    };
  }

  private async mockAnonymizeData(data: any, privacyLevel: string): Promise<any> {
    // Simple mock anonymization
    if (typeof data === 'string') {
      return data.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[ANONYMIZED]');
    }
    return data;
  }

  private async mockGenerateInsights(data: any[], context: Record<string, any>): Promise<{
    insights: string[];
    confidence: number;
    privacyLevel: string;
  }> {
    return {
      insights: [
        'Mock insight 1: Data shows interesting patterns',
        'Mock insight 2: Privacy considerations are important',
        'Mock insight 3: Governance frameworks need refinement'
      ],
      confidence: 0.8,
      privacyLevel: context.privacyLevel || 'selective'
    };
  }

  async healthCheck(): Promise<boolean> {
    if (this.mockMode) {
      return true;
    }

    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      logger.error('Kwaai health check failed:', error);
      return false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  isMockMode(): boolean {
    return this.mockMode;
  }
}

// Singleton instance
export const kwaaiClient = new KwaaiClient();
