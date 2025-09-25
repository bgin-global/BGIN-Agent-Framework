// =====================================
// backend/src/integrations/llm/llm-client.ts
// =====================================

import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { logger } from '../../utils/logger';
import { config } from '../../utils/config';

export interface GenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  usage?: {
    promptTokens: number;
    totalTokens: number;
  };
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface LLMProvider {
  name: string;
  generateResponse(prompt: string, options: GenerationOptions): Promise<LLMResponse>;
  generateEmbedding(text: string): Promise<EmbeddingResponse>;
  analyzeSentiment(text: string): Promise<SentimentAnalysis>;
  extractEntities(text: string): Promise<Entity[]>;
  isAvailable(): Promise<boolean>;
}

class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  async generateResponse(prompt: string, options: GenerationOptions = {}): Promise<LLMResponse> {
    try {
      const {
        model = 'claude-3-haiku-20240307',
        maxTokens = 4000,
        temperature = 0.3,
        topP = 1,
        stopSequences = []
      } = options;

      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        stop_sequences: stopSequences,
        messages: [{ role: 'user', content: prompt }]
      });

      return {
        content: response.content[0].type === 'text' ? response.content[0].text : '',
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        },
        model: response.model,
        finishReason: response.stop_reason
      };
    } catch (error) {
      logger.error('Anthropic API error:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    // Anthropic doesn't have embedding API, fallback to OpenAI
    throw new Error('Anthropic does not support embeddings, use OpenAI provider');
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    const prompt = `Analyze the sentiment of the following text and respond with a JSON object containing:
    - sentiment: "positive", "negative", or "neutral"
    - confidence: number between 0 and 1
    - scores: object with positive, negative, neutral scores (0-1)
    
    Text: "${text}"`;

    try {
      const response = await this.generateResponse(prompt, { maxTokens: 200 });
      const analysis = JSON.parse(response.content);
      return analysis;
    } catch (error) {
      logger.error('Sentiment analysis failed:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        scores: { positive: 0.33, negative: 0.33, neutral: 0.34 }
      };
    }
  }

  async extractEntities(text: string): Promise<Entity[]> {
    const prompt = `Extract named entities from the following text and respond with a JSON array of objects containing:
    - text: the entity text
    - type: entity type (PERSON, ORGANIZATION, LOCATION, etc.)
    - confidence: number between 0 and 1
    - startIndex: character start position
    - endIndex: character end position
    
    Text: "${text}"`;

    try {
      const response = await this.generateResponse(prompt, { maxTokens: 500 });
      const entities = JSON.parse(response.content);
      return Array.isArray(entities) ? entities : [];
    } catch (error) {
      logger.error('Entity extraction failed:', error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async generateResponse(prompt: string, options: GenerationOptions = {}): Promise<LLMResponse> {
    try {
      const {
        model = 'gpt-3.5-turbo',
        maxTokens = 4000,
        temperature = 0.3,
        topP = 1,
        stopSequences = []
      } = options;

      const response = await this.client.chat.completions.create({
        model,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        stop: stopSequences,
        messages: [{ role: 'user', content: prompt }]
      });

      const choice = response.choices[0];
      return {
        content: choice.message.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined,
        model: response.model,
        finishReason: choice.finish_reason
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });

      return {
        embedding: response.data[0].embedding,
        model: response.model,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens
        }
      };
    } catch (error) {
      logger.error('OpenAI embedding error:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    const prompt = `Analyze the sentiment of the following text and respond with a JSON object containing:
    - sentiment: "positive", "negative", or "neutral"
    - confidence: number between 0 and 1
    - scores: object with positive, negative, neutral scores (0-1)
    
    Text: "${text}"`;

    try {
      const response = await this.generateResponse(prompt, { maxTokens: 200 });
      const analysis = JSON.parse(response.content);
      return analysis;
    } catch (error) {
      logger.error('Sentiment analysis failed:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        scores: { positive: 0.33, negative: 0.33, neutral: 0.34 }
      };
    }
  }

  async extractEntities(text: string): Promise<Entity[]> {
    const prompt = `Extract named entities from the following text and respond with a JSON array of objects containing:
    - text: the entity text
    - type: entity type (PERSON, ORGANIZATION, LOCATION, etc.)
    - confidence: number between 0 and 1
    - startIndex: character start position
    - endIndex: character end position
    
    Text: "${text}"`;

    try {
      const response = await this.generateResponse(prompt, { maxTokens: 500 });
      const entities = JSON.parse(response.content);
      return Array.isArray(entities) ? entities : [];
    } catch (error) {
      logger.error('Entity extraction failed:', error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export class LLMClient {
  private providers: Map<string, LLMProvider> = new Map();
  private primaryProvider: string = 'anthropic';
  private fallbackProvider: string = 'openai';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Anthropic provider
    if (config.anthropicApiKey) {
      this.providers.set('anthropic', new AnthropicProvider());
    }

    // Initialize OpenAI provider
    if (config.openaiApiKey) {
      this.providers.set('openai', new OpenAIProvider());
    }

    logger.info(`Initialized ${this.providers.size} LLM providers`);
  }

  async generateResponse(
    prompt: string, 
    options: GenerationOptions = {}
  ): Promise<LLMResponse> {
    const provider = this.providers.get(this.primaryProvider);
    if (!provider) {
      throw new Error(`Primary provider ${this.primaryProvider} not available`);
    }

    try {
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) {
        throw new Error(`Primary provider ${this.primaryProvider} is not available`);
      }

      return await provider.generateResponse(prompt, options);
    } catch (error) {
      logger.warn(`Primary provider failed, trying fallback: ${error}`);
      
      const fallback = this.providers.get(this.fallbackProvider);
      if (!fallback) {
        throw new Error('No fallback provider available');
      }

      const isAvailable = await fallback.isAvailable();
      if (!isAvailable) {
        throw new Error('Fallback provider is not available');
      }

      return await fallback.generateResponse(prompt, options);
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    // Use OpenAI for embeddings as Anthropic doesn't support them
    const provider = this.providers.get('openai');
    if (!provider) {
      throw new Error('OpenAI provider not available for embeddings');
    }

    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      throw new Error('OpenAI provider is not available for embeddings');
    }

    return await provider.generateEmbedding(text);
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    const provider = this.providers.get(this.primaryProvider);
    if (!provider) {
      throw new Error(`Primary provider ${this.primaryProvider} not available`);
    }

    try {
      return await provider.analyzeSentiment(text);
    } catch (error) {
      logger.warn(`Sentiment analysis failed with primary provider, trying fallback: ${error}`);
      
      const fallback = this.providers.get(this.fallbackProvider);
      if (!fallback) {
        throw new Error('No fallback provider available for sentiment analysis');
      }

      return await fallback.analyzeSentiment(text);
    }
  }

  async extractEntities(text: string): Promise<Entity[]> {
    const provider = this.providers.get(this.primaryProvider);
    if (!provider) {
      throw new Error(`Primary provider ${this.primaryProvider} not available`);
    }

    try {
      return await provider.extractEntities(text);
    } catch (error) {
      logger.warn(`Entity extraction failed with primary provider, trying fallback: ${error}`);
      
      const fallback = this.providers.get(this.fallbackProvider);
      if (!fallback) {
        throw new Error('No fallback provider available for entity extraction');
      }

      return await fallback.extractEntities(text);
    }
  }

  async healthCheck(): Promise<{ [provider: string]: boolean }> {
    const results: { [provider: string]: boolean } = {};
    
    for (const [name, provider] of this.providers) {
      try {
        results[name] = await provider.isAvailable();
      } catch (error) {
        results[name] = false;
      }
    }

    return results;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  setPrimaryProvider(provider: string): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} not available`);
    }
    this.primaryProvider = provider;
    logger.info(`Primary LLM provider set to ${provider}`);
  }

  setFallbackProvider(provider: string): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} not available`);
    }
    this.fallbackProvider = provider;
    logger.info(`Fallback LLM provider set to ${provider}`);
  }
}

// Singleton instance
export const llmClient = new LLMClient();
