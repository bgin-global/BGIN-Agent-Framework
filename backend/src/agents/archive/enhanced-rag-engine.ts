// =====================================
// backend/src/agents/archive/enhanced-rag-engine.ts
// =====================================

import { retrievalSystem, SearchFilters, UserContext, SearchResult, FilteredResult } from './retrieval-system';
import { documentProcessor, DocumentMetadata, ProcessedDocument } from './document-processor';
import { llmClient } from '../../integrations/llm/llm-client';
import { discourseClient } from '../../integrations/discourse-api/discourse-client';
import { kwaaiClient } from '../../integrations/kwaai/kwaai-client';
import { logger } from '../../utils/logger';
import { database } from '../../utils/database';

export interface RAGQuery {
  query: string;
  sessionId: string;
  userContext: UserContext;
  filters?: SearchFilters;
  includeCrossSession?: boolean;
  maxResults?: number;
  synthesisMode?: 'summary' | 'detailed' | 'analytical';
}

export interface RAGResponse {
  response: string;
  sources: {
    documentId: string;
    title: string;
    content: string;
    score: number;
    accessLevel: 'full' | 'summary' | 'metadata';
  }[];
  metadata: {
    totalSources: number;
    crossSessionSources: number;
    processingTime: number;
    confidence: number;
    privacyLevel: string;
  };
  insights?: string[];
  recommendations?: string[];
}

export interface SynthesisContext {
  query: string;
  sources: FilteredResult[];
  sessionContext: {
    sessionId: string;
    sessionName: string;
    participantCount: number;
  };
  userContext: UserContext;
  synthesisMode: 'summary' | 'detailed' | 'analytical';
}

export class EnhancedRAGEngine {
  private readonly MAX_SOURCES = 10;
  private readonly MIN_CONFIDENCE = 0.6;

  async processQuery(ragQuery: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();
    
    try {
      logger.info(`Processing RAG query: "${ragQuery.query}" in session ${ragQuery.sessionId}`);

      // Step 1: Search for relevant documents
      const searchResults = await this.searchRelevantDocuments(ragQuery);
      
      // Step 2: Rank and filter results
      const rankedResults = await retrievalSystem.rankResults(searchResults);
      const filteredResults = await retrievalSystem.applyPrivacyFilters(rankedResults, ragQuery.userContext);
      
      // Step 3: Cross-session search if enabled
      let crossSessionResults: FilteredResult[] = [];
      if (ragQuery.includeCrossSession) {
        crossSessionResults = await this.performCrossSessionSearch(ragQuery);
      }

      // Step 4: Combine and limit results
      const allResults = [...filteredResults, ...crossSessionResults]
        .slice(0, ragQuery.maxResults || this.MAX_SOURCES);

      // Step 5: Generate synthesis context
      const synthesisContext: SynthesisContext = {
        query: ragQuery.query,
        sources: allResults,
        sessionContext: await this.getSessionContext(ragQuery.sessionId),
        userContext: ragQuery.userContext,
        synthesisMode: ragQuery.synthesisMode || 'summary'
      };

      // Step 6: Generate response using LLM
      const response = await this.generateSynthesis(synthesisContext);

      // Step 7: Generate insights and recommendations
      const insights = await this.generateInsights(synthesisContext);
      const recommendations = await this.generateRecommendations(synthesisContext);

      const processingTime = Date.now() - startTime;

      return {
        response: response.content,
        sources: allResults.map(result => ({
          documentId: result.metadata.documentId,
          title: result.document?.title || 'Untitled',
          content: result.content,
          score: result.finalScore,
          accessLevel: result.accessLevel
        })),
        metadata: {
          totalSources: allResults.length,
          crossSessionSources: crossSessionResults.length,
          processingTime,
          confidence: response.confidence || 0.8,
          privacyLevel: ragQuery.userContext.privacyLevel
        },
        insights,
        recommendations
      };

    } catch (error) {
      logger.error('RAG query processing failed:', error);
      throw error;
    }
  }

  async processDocument(
    content: string,
    metadata: DocumentMetadata
  ): Promise<ProcessedDocument> {
    try {
      logger.info(`Processing document: ${metadata.title || 'Untitled'}`);
      
      // Convert string content to buffer for processing
      const buffer = Buffer.from(content, 'utf-8');
      
      return await documentProcessor.processDocument(buffer, metadata);

    } catch (error) {
      logger.error('Document processing failed:', error);
      throw error;
    }
  }

  async syncWithDiscourse(sessionId: string): Promise<void> {
    try {
      logger.info(`Syncing Discourse data for session ${sessionId}`);
      
      // Fetch topics from Discourse
      const topics = await discourseClient.fetchTopics();
      
      for (const topic of topics) {
        // Fetch posts for each topic
        const posts = await discourseClient.fetchPosts(topic.id);
        
        // Process each post as a document
        for (const post of posts) {
          const metadata: DocumentMetadata = {
            title: topic.title,
            author: post.username,
            source: 'discourse',
            sessionId,
            privacyLevel: 'selective',
            documentType: 'forum_post',
            mimeType: 'text/html',
            originalUrl: `${discourseClient['baseUrl']}/t/${topic.slug}/${topic.id}`,
            tags: topic.tags || [],
            language: 'en'
          };

          // Clean HTML content
          const cleanContent = this.cleanHtmlContent(post.cooked);
          
          if (cleanContent.length > 50) { // Only process substantial posts
            await this.processDocument(cleanContent, metadata);
          }
        }
      }

      logger.info(`Discourse sync completed for session ${sessionId}`);

    } catch (error) {
      logger.error('Discourse sync failed:', error);
      throw error;
    }
  }

  async generateKnowledgeCorrelations(sessionId: string): Promise<void> {
    try {
      logger.info(`Generating knowledge correlations for session ${sessionId}`);

      // Get all documents in the session
      const documents = await database.query(`
        SELECT id, title, content, summary, keywords
        FROM archive_documents 
        WHERE session_id = $1 AND processing_status = 'completed'
      `, [sessionId]);

      // Generate correlations between documents
      for (let i = 0; i < documents.rows.length; i++) {
        for (let j = i + 1; j < documents.rows.length; j++) {
          const doc1 = documents.rows[i];
          const doc2 = documents.rows[j];

          const correlation = await this.calculateDocumentCorrelation(doc1, doc2);
          
          if (correlation.strength > 0.7) {
            await database.query(`
              INSERT INTO archive_knowledge_correlations (
                source_document_id, target_document_id, correlation_strength,
                correlation_type, cross_session, confidence_score
              ) VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (source_document_id, target_document_id) 
              DO UPDATE SET 
                correlation_strength = EXCLUDED.correlation_strength,
                confidence_score = EXCLUDED.confidence_score
            `, [
              doc1.id,
              doc2.id,
              correlation.strength,
              correlation.type,
              false,
              correlation.confidence
            ]);
          }
        }
      }

      logger.info(`Knowledge correlations generated for session ${sessionId}`);

    } catch (error) {
      logger.error('Knowledge correlation generation failed:', error);
      throw error;
    }
  }

  private async searchRelevantDocuments(ragQuery: RAGQuery): Promise<SearchResult[]> {
    const filters: SearchFilters = {
      sessionId: ragQuery.sessionId,
      privacyLevel: ragQuery.userContext.privacyLevel,
      ...ragQuery.filters
    };

    return await retrievalSystem.searchSimilar(
      ragQuery.query,
      filters,
      ragQuery.maxResults || this.MAX_SOURCES
    );
  }

  private async performCrossSessionSearch(ragQuery: RAGQuery): Promise<FilteredResult[]> {
    try {
      // Get all other sessions
      const sessions = await database.query(`
        SELECT id FROM sessions WHERE id != $1
      `, [ragQuery.sessionId]);

      const otherSessionIds = sessions.rows.map(row => row.id);
      
      if (otherSessionIds.length === 0) {
        return [];
      }

      const crossSessionResults = await retrievalSystem.crossSessionSearch(
        ragQuery.query,
        ragQuery.sessionId,
        otherSessionIds,
        5 // Limit cross-session results
      );

      return await retrievalSystem.applyPrivacyFilters(crossSessionResults, ragQuery.userContext);

    } catch (error) {
      logger.error('Cross-session search failed:', error);
      return [];
    }
  }

  private async generateSynthesis(context: SynthesisContext): Promise<{ content: string; confidence?: number }> {
    try {
      const sourcesText = context.sources
        .slice(0, 5) // Limit to top 5 sources for context
        .map((source, index) => 
          `[Source ${index + 1}] ${source.content}\n` +
          `(Title: ${source.document?.title || 'Untitled'}, ` +
          `Score: ${source.finalScore.toFixed(2)}, ` +
          `Privacy: ${source.metadata.privacyLevel})`
        )
        .join('\n\n');

      const prompt = this.buildSynthesisPrompt(context, sourcesText);
      
      const response = await llmClient.generateResponse(prompt, {
        maxTokens: context.synthesisMode === 'detailed' ? 2000 : 1000,
        temperature: 0.3
      });

      return {
        content: response.content,
        confidence: 0.8 // Could be calculated based on source quality
      };

    } catch (error) {
      logger.error('Synthesis generation failed:', error);
      return {
        content: 'Unable to generate synthesis at this time.',
        confidence: 0.1
      };
    }
  }

  private buildSynthesisPrompt(context: SynthesisContext, sourcesText: string): string {
    const basePrompt = `You are an Archive Agent in the BGIN Multi-Agent Research System. Your role is to synthesize research findings and provide evidence-based responses while respecting privacy levels.

Session: ${context.sessionContext.sessionName} (${context.sessionContext.participantCount} participants)
Query: ${context.query}
Privacy Level: ${context.userContext.privacyLevel}
Synthesis Mode: ${context.synthesisMode}

Sources:
${sourcesText}

Please provide a comprehensive response that:`;

    switch (context.synthesisMode) {
      case 'summary':
        return basePrompt + `
1. Summarizes the key findings from the sources
2. Maintains appropriate privacy levels
3. Provides clear citations without revealing sensitive information
4. Offers actionable insights for blockchain governance research
5. Keeps the response concise and focused`;

      case 'detailed':
        return basePrompt + `
1. Provides a detailed analysis of the sources
2. Explains the relationships between different findings
3. Discusses implications for blockchain governance
4. Identifies potential areas for further research
5. Maintains privacy while being comprehensive`;

      case 'analytical':
        return basePrompt + `
1. Performs critical analysis of the sources
2. Identifies patterns, trends, and contradictions
3. Evaluates the quality and reliability of information
4. Provides strategic recommendations
5. Suggests policy implications and next steps`;

      default:
        return basePrompt + `
1. Synthesizes the relevant information from the sources
2. Maintains appropriate privacy levels
3. Provides clear citations without revealing sensitive information
4. Offers actionable insights for blockchain governance research
5. Suggests potential cross-session correlations if applicable`;
    }
  }

  private async generateInsights(context: SynthesisContext): Promise<string[]> {
    try {
      const prompt = `Based on the following research context, generate 3-5 key insights for blockchain governance:

Query: ${context.query}
Sources: ${context.sources.length} documents
Session: ${context.sessionContext.sessionName}

Focus on:
- Emerging patterns or trends
- Policy implications
- Technical considerations
- Governance challenges or opportunities

Provide concise, actionable insights.`;

      const response = await llmClient.generateResponse(prompt, {
        maxTokens: 500,
        temperature: 0.4
      });

      return response.content
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(insight => insight.length > 0)
        .slice(0, 5);

    } catch (error) {
      logger.error('Insights generation failed:', error);
      return [];
    }
  }

  private async generateRecommendations(context: SynthesisContext): Promise<string[]> {
    try {
      const prompt = `Based on the research findings, provide 3-5 recommendations for the BGIN community:

Query: ${context.query}
Session: ${context.sessionContext.sessionName}
Sources: ${context.sources.length} documents

Focus on:
- Immediate actions or next steps
- Areas requiring further research
- Policy or technical recommendations
- Community engagement opportunities

Provide specific, actionable recommendations.`;

      const response = await llmClient.generateResponse(prompt, {
        maxTokens: 400,
        temperature: 0.3
      });

      return response.content
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(rec => rec.length > 0)
        .slice(0, 5);

    } catch (error) {
      logger.error('Recommendations generation failed:', error);
      return [];
    }
  }

  private async getSessionContext(sessionId: string): Promise<{
    sessionId: string;
    sessionName: string;
    participantCount: number;
  }> {
    try {
      const result = await database.query(`
        SELECT name, participants_count FROM sessions WHERE id = $1
      `, [sessionId]);

      if (result.rows.length === 0) {
        return {
          sessionId,
          sessionName: 'Unknown Session',
          participantCount: 0
        };
      }

      return {
        sessionId,
        sessionName: result.rows[0].name,
        participantCount: result.rows[0].participants_count
      };

    } catch (error) {
      logger.error('Failed to get session context:', error);
      return {
        sessionId,
        sessionName: 'Unknown Session',
        participantCount: 0
      };
    }
  }

  private async calculateDocumentCorrelation(doc1: any, doc2: any): Promise<{
    strength: number;
    type: string;
    confidence: number;
  }> {
    try {
      // Simple keyword-based correlation for now
      const keywords1 = doc1.keywords || [];
      const keywords2 = doc2.keywords || [];
      
      const commonKeywords = keywords1.filter((k: string) => keywords2.includes(k));
      const strength = commonKeywords.length / Math.max(keywords1.length, keywords2.length, 1);
      
      return {
        strength,
        type: 'keyword_similarity',
        confidence: 0.7
      };

    } catch (error) {
      logger.error('Document correlation calculation failed:', error);
      return {
        strength: 0,
        type: 'unknown',
        confidence: 0
      };
    }
  }

  private cleanHtmlContent(html: string): string {
    // Simple HTML cleaning - in production, use a proper HTML parser
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp;
      .replace(/&amp;/g, '&') // Replace &amp;
      .replace(/&lt;/g, '<') // Replace &lt;
      .replace(/&gt;/g, '>') // Replace &gt;
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const checks = await Promise.all([
        retrievalSystem.healthCheck(),
        llmClient.healthCheck(),
        discourseClient.healthCheck(),
        kwaaiClient.healthCheck()
      ]);

      return checks.every(check => check === true);

    } catch (error) {
      logger.error('RAG engine health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const enhancedRAGEngine = new EnhancedRAGEngine();
