// =====================================
// backend/src/agents/archive/retrieval-system.ts
// =====================================

import { qdrantClient } from '../../integrations/vector-db/qdrant-client';
import { llmClient } from '../../integrations/llm/llm-client';
import { logger } from '../../utils/logger';
import { database } from '../../utils/database';

export interface SearchFilters {
  sessionId?: string;
  privacyLevel?: 'maximum' | 'high' | 'selective' | 'minimal';
  documentType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  qualityThreshold?: number;
  tags?: string[];
}

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata: {
    documentId: string;
    title?: string;
    sessionId: string;
    privacyLevel: string;
    chunkIndex: number;
    startIndex: number;
    endIndex: number;
    wordCount: number;
  };
  document?: {
    id: string;
    title: string;
    summary: string;
    keywords: string[];
    qualityScore: number;
  };
}

export interface RankedResult extends SearchResult {
  relevanceScore: number;
  qualityScore: number;
  recencyScore: number;
  finalScore: number;
}

export interface FilteredResult extends RankedResult {
  privacyCompliant: boolean;
  accessLevel: 'full' | 'summary' | 'metadata';
}

export interface UserContext {
  participantHash: string;
  sessionId: string;
  privacyLevel: 'maximum' | 'high' | 'selective' | 'minimal';
  trustScore: number;
  accessRights: string[];
}

export class RetrievalSystem {
  private readonly COLLECTION_NAME = 'bgin_documents';
  private readonly DEFAULT_LIMIT = 10;
  private readonly MAX_LIMIT = 50;

  async searchSimilar(
    query: string,
    filters: SearchFilters = {},
    limit: number = this.DEFAULT_LIMIT
  ): Promise<SearchResult[]> {
    try {
      logger.info(`Searching for: "${query}" with filters:`, filters);

      // Generate query embedding
      const embeddingResponse = await llmClient.generateEmbedding(query);
      const queryVector = embeddingResponse.embedding;

      // Build Qdrant filter
      const qdrantFilter = this.buildQdrantFilter(filters);

      // Search in vector database
      const vectorResults = await qdrantClient.searchSimilar(
        this.COLLECTION_NAME,
        queryVector,
        {
          limit: Math.min(limit, this.MAX_LIMIT),
          with_payload: true,
          filter: qdrantFilter,
          score_threshold: 0.7
        }
      );

      // Convert to SearchResult format
      const results: SearchResult[] = await Promise.all(
        vectorResults.map(async (hit) => {
          const metadata = hit.payload?.metadata || {};
          
          // Get document info if not in payload
          let document;
          if (hit.payload?.documentId) {
            document = await this.getDocumentInfo(hit.payload.documentId);
          }

          return {
            id: hit.id as string,
            content: hit.payload?.content || '',
            score: hit.score,
            metadata: {
              documentId: hit.payload?.documentId || '',
              title: metadata.title,
              sessionId: metadata.sessionId || '',
              privacyLevel: metadata.privacyLevel || 'selective',
              chunkIndex: metadata.chunkIndex || 0,
              startIndex: metadata.startIndex || 0,
              endIndex: metadata.endIndex || 0,
              wordCount: metadata.wordCount || 0
            },
            document
          };
        })
      );

      logger.info(`Found ${results.length} search results`);
      return results;

    } catch (error) {
      logger.error('Search failed:', error);
      throw error;
    }
  }

  async rankResults(results: SearchResult[]): Promise<RankedResult[]> {
    try {
      const rankedResults: RankedResult[] = [];

      for (const result of results) {
        // Calculate relevance score (based on vector similarity)
        const relevanceScore = result.score;

        // Calculate quality score
        const qualityScore = result.document?.qualityScore || 0.5;

        // Calculate recency score
        const recencyScore = await this.calculateRecencyScore(result.metadata.documentId);

        // Calculate final weighted score
        const finalScore = (
          relevanceScore * 0.5 +
          qualityScore * 0.3 +
          recencyScore * 0.2
        );

        rankedResults.push({
          ...result,
          relevanceScore,
          qualityScore,
          recencyScore,
          finalScore
        });
      }

      // Sort by final score
      rankedResults.sort((a, b) => b.finalScore - a.finalScore);

      return rankedResults;

    } catch (error) {
      logger.error('Ranking failed:', error);
      throw error;
    }
  }

  async applyPrivacyFilters(
    results: RankedResult[],
    userContext: UserContext
  ): Promise<FilteredResult[]> {
    try {
      const filteredResults: FilteredResult[] = [];

      for (const result of results) {
        // Check privacy compliance
        const privacyCompliant = this.checkPrivacyCompliance(
          result.metadata.privacyLevel,
          userContext.privacyLevel
        );

        if (!privacyCompliant) {
          continue; // Skip this result
        }

        // Determine access level
        const accessLevel = this.determineAccessLevel(
          result.metadata.privacyLevel,
          userContext.privacyLevel,
          userContext.trustScore
        );

        // Apply content filtering based on access level
        const filteredContent = this.filterContentByAccessLevel(
          result.content,
          accessLevel
        );

        filteredResults.push({
          ...result,
          content: filteredContent,
          privacyCompliant: true,
          accessLevel
        });
      }

      return filteredResults;

    } catch (error) {
      logger.error('Privacy filtering failed:', error);
      throw error;
    }
  }

  async searchByKeywords(
    keywords: string[],
    filters: SearchFilters = {},
    limit: number = this.DEFAULT_LIMIT
  ): Promise<SearchResult[]> {
    try {
      // Build keyword search query
      const keywordQuery = keywords.join(' ');
      
      // Use semantic search with keyword context
      const query = `Find documents about: ${keywordQuery}`;
      
      return await this.searchSimilar(query, filters, limit);

    } catch (error) {
      logger.error('Keyword search failed:', error);
      throw error;
    }
  }

  async searchBySemanticSimilarity(
    referenceText: string,
    filters: SearchFilters = {},
    limit: number = this.DEFAULT_LIMIT
  ): Promise<SearchResult[]> {
    try {
      return await this.searchSimilar(referenceText, filters, limit);

    } catch (error) {
      logger.error('Semantic similarity search failed:', error);
      throw error;
    }
  }

  async getRelatedDocuments(
    documentId: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      // Get document content
      const document = await this.getDocumentInfo(documentId);
      if (!document) {
        return [];
      }

      // Search for similar documents
      const results = await this.searchSimilar(
        document.title + ' ' + document.summary,
        { sessionId: document.sessionId },
        limit + 1 // +1 to exclude the original document
      );

      // Filter out the original document
      return results.filter(result => result.metadata.documentId !== documentId);

    } catch (error) {
      logger.error('Related documents search failed:', error);
      throw error;
    }
  }

  async crossSessionSearch(
    query: string,
    sourceSessionId: string,
    targetSessionIds: string[],
    limit: number = 10
  ): Promise<SearchResult[]> {
    try {
      const allResults: SearchResult[] = [];

      for (const sessionId of targetSessionIds) {
        if (sessionId === sourceSessionId) continue;

        const results = await this.searchSimilar(query, { sessionId }, limit);
        allResults.push(...results);
      }

      // Rank and limit results
      const rankedResults = await this.rankResults(allResults);
      return rankedResults.slice(0, limit);

    } catch (error) {
      logger.error('Cross-session search failed:', error);
      throw error;
    }
  }

  private buildQdrantFilter(filters: SearchFilters): Record<string, any> | undefined {
    const conditions: any[] = [];

    if (filters.sessionId) {
      conditions.push({
        key: 'metadata.sessionId',
        match: { value: filters.sessionId }
      });
    }

    if (filters.privacyLevel) {
      conditions.push({
        key: 'metadata.privacyLevel',
        match: { value: filters.privacyLevel }
      });
    }

    if (filters.documentType) {
      conditions.push({
        key: 'metadata.documentType',
        match: { value: filters.documentType }
      });
    }

    if (filters.qualityThreshold) {
      conditions.push({
        key: 'qualityScore',
        range: { gte: filters.qualityThreshold }
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      conditions.push({
        key: 'metadata.tags',
        match: { any: filters.tags }
      });
    }

    if (conditions.length === 0) {
      return undefined;
    }

    return {
      must: conditions
    };
  }

  private async calculateRecencyScore(documentId: string): Promise<number> {
    try {
      const result = await database.query(`
        SELECT created_at FROM archive_documents WHERE id = $1
      `, [documentId]);

      if (result.rows.length === 0) {
        return 0.5; // Default score for unknown documents
      }

      const createdAt = new Date(result.rows[0].created_at);
      const now = new Date();
      const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      // Score decreases over time, but not too aggressively
      return Math.max(0.1, 1 - (daysDiff / 365)); // 1 year = 0.1 score

    } catch (error) {
      logger.error('Failed to calculate recency score:', error);
      return 0.5;
    }
  }

  private checkPrivacyCompliance(
    documentPrivacyLevel: string,
    userPrivacyLevel: string
  ): boolean {
    const privacyLevels = ['minimal', 'selective', 'high', 'maximum'];
    const documentLevel = privacyLevels.indexOf(documentPrivacyLevel);
    const userLevel = privacyLevels.indexOf(userPrivacyLevel);

    // User can access documents at their privacy level or lower
    return userLevel >= documentLevel;
  }

  private determineAccessLevel(
    documentPrivacyLevel: string,
    userPrivacyLevel: string,
    trustScore: number
  ): 'full' | 'summary' | 'metadata' {
    const privacyLevels = ['minimal', 'selective', 'high', 'maximum'];
    const documentLevel = privacyLevels.indexOf(documentPrivacyLevel);
    const userLevel = privacyLevels.indexOf(userPrivacyLevel);

    if (userLevel > documentLevel && trustScore > 0.8) {
      return 'full';
    } else if (userLevel >= documentLevel) {
      return 'summary';
    } else {
      return 'metadata';
    }
  }

  private filterContentByAccessLevel(
    content: string,
    accessLevel: 'full' | 'summary' | 'metadata'
  ): string {
    switch (accessLevel) {
      case 'full':
        return content;
      case 'summary':
        // Return first 200 characters as summary
        return content.length > 200 ? content.substring(0, 200) + '...' : content;
      case 'metadata':
        return '[Content restricted due to privacy settings]';
      default:
        return content;
    }
  }

  private async getDocumentInfo(documentId: string): Promise<any> {
    try {
      const result = await database.query(`
        SELECT id, title, summary, keywords, quality_score, session_id
        FROM archive_documents WHERE id = $1
      `, [documentId]);

      return result.rows[0] || null;

    } catch (error) {
      logger.error(`Failed to get document info for ${documentId}:`, error);
      return null;
    }
  }

  async getCollectionStats(): Promise<any> {
    try {
      return await qdrantClient.getCollectionStats(this.COLLECTION_NAME);
    } catch (error) {
      logger.error('Failed to get collection stats:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      return await qdrantClient.healthCheck();
    } catch (error) {
      logger.error('Retrieval system health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const retrievalSystem = new RetrievalSystem();
