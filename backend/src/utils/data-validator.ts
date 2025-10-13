// =====================================
// backend/src/utils/data-validator.ts
// =====================================

import { logger } from './logger';
import { llmClient } from '../integrations/llm/llm-client';

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-1 quality score
  issues: ValidationIssue[];
  suggestions: string[];
  metadata: {
    validationTime: number;
    validator: string;
    version: string;
  };
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
}

export interface QualityScore {
  overall: number;
  content: number;
  structure: number;
  privacy: number;
  relevance: number;
  completeness: number;
}

export interface DocumentValidationOptions {
  checkContent: boolean;
  checkStructure: boolean;
  checkPrivacy: boolean;
  checkRelevance: boolean;
  checkCompleteness: boolean;
  strictMode: boolean;
}

export class DataValidator {
  private readonly VALIDATOR_VERSION = '1.0.0';
  private readonly MIN_CONTENT_LENGTH = 50;
  private readonly MAX_CONTENT_LENGTH = 100000;
  private readonly REQUIRED_FIELDS = ['title', 'content', 'sessionId', 'privacyLevel'];

  async validateDocument(
    document: any,
    options: DocumentValidationOptions = {
      checkContent: true,
      checkStructure: true,
      checkPrivacy: true,
      checkRelevance: true,
      checkCompleteness: true,
      strictMode: false
    }
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];

    try {
      logger.info(`Validating document: ${document.title || 'Untitled'}`);

      // Check required fields
      if (options.checkStructure) {
        issues.push(...this.validateRequiredFields(document));
      }

      // Check content quality
      if (options.checkContent) {
        issues.push(...this.validateContent(document));
      }

      // Check privacy compliance
      if (options.checkPrivacy) {
        issues.push(...this.validatePrivacy(document));
      }

      // Check relevance
      if (options.checkRelevance) {
        issues.push(...await this.validateRelevance(document));
      }

      // Check completeness
      if (options.checkCompleteness) {
        issues.push(...this.validateCompleteness(document));
      }

      // Generate suggestions
      suggestions.push(...this.generateSuggestions(issues, document));

      // Calculate quality score
      const qualityScore = this.calculateQualityScore(issues, document);

      // Determine if document is valid
      const isValid = this.determineValidity(issues, options.strictMode);

      const validationTime = Date.now() - startTime;

      return {
        isValid,
        score: qualityScore.overall,
        issues,
        suggestions,
        metadata: {
          validationTime,
          validator: 'BGIN Data Validator',
          version: this.VALIDATOR_VERSION
        }
      };

    } catch (error) {
      logger.error('Document validation failed:', error);
      return {
        isValid: false,
        score: 0,
        issues: [{
          type: 'error',
          field: 'system',
          message: 'Validation process failed',
          severity: 'critical'
        }],
        suggestions: ['Contact system administrator'],
        metadata: {
          validationTime: Date.now() - startTime,
          validator: 'BGIN Data Validator',
          version: this.VALIDATOR_VERSION
        }
      };
    }
  }

  async checkDataQuality(data: any): Promise<QualityScore> {
    try {
      const content = data.content || '';
      const title = data.title || '';
      const metadata = data.metadata || {};

      // Content quality
      const contentScore = this.assessContentQuality(content);

      // Structure quality
      const structureScore = this.assessStructureQuality(data);

      // Privacy compliance
      const privacyScore = this.assessPrivacyCompliance(metadata);

      // Relevance (basic check)
      const relevanceScore = this.assessRelevance(content, metadata);

      // Completeness
      const completenessScore = this.assessCompleteness(data);

      // Overall score (weighted average)
      const overall = (
        contentScore * 0.3 +
        structureScore * 0.2 +
        privacyScore * 0.2 +
        relevanceScore * 0.15 +
        completenessScore * 0.15
      );

      return {
        overall,
        content: contentScore,
        structure: structureScore,
        privacy: privacyScore,
        relevance: relevanceScore,
        completeness: completenessScore
      };

    } catch (error) {
      logger.error('Data quality assessment failed:', error);
      return {
        overall: 0,
        content: 0,
        structure: 0,
        privacy: 0,
        relevance: 0,
        completeness: 0
      };
    }
  }

  async sanitizeContent(content: string): Promise<string> {
    try {
      // Remove potentially harmful content
      let sanitized = content;

      // Remove HTML tags (basic sanitization)
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/<[^>]*>/g, '');

      // Remove excessive whitespace
      sanitized = sanitized.replace(/\s+/g, ' ').trim();

      // Remove control characters
      sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

      // Limit length
      if (sanitized.length > this.MAX_CONTENT_LENGTH) {
        sanitized = sanitized.substring(0, this.MAX_CONTENT_LENGTH) + '...';
      }

      return sanitized;

    } catch (error) {
      logger.error('Content sanitization failed:', error);
      return content;
    }
  }

  async verifyIntegrity(data: any, hash: string): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const dataString = JSON.stringify(data, Object.keys(data).sort());
      const calculatedHash = crypto.createHash('sha256').update(dataString).digest('hex');
      
      return calculatedHash === hash;

    } catch (error) {
      logger.error('Integrity verification failed:', error);
      return false;
    }
  }

  private validateRequiredFields(document: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const field of this.REQUIRED_FIELDS) {
      if (!document[field] || (typeof document[field] === 'string' && document[field].trim() === '')) {
        issues.push({
          type: 'error',
          field,
          message: `Required field '${field}' is missing or empty`,
          severity: 'high',
          suggestion: `Provide a valid value for '${field}'`
        });
      }
    }

    return issues;
  }

  private validateContent(document: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const content = document.content || '';

    // Check content length
    if (content.length < this.MIN_CONTENT_LENGTH) {
      issues.push({
        type: 'warning',
        field: 'content',
        message: `Content is too short (${content.length} characters, minimum ${this.MIN_CONTENT_LENGTH})`,
        severity: 'medium',
        suggestion: 'Add more substantial content to improve quality'
      });
    }

    if (content.length > this.MAX_CONTENT_LENGTH) {
      issues.push({
        type: 'warning',
        field: 'content',
        message: `Content is too long (${content.length} characters, maximum ${this.MAX_CONTENT_LENGTH})`,
        severity: 'medium',
        suggestion: 'Consider breaking into smaller documents'
      });
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousPatterns(content)) {
      issues.push({
        type: 'warning',
        field: 'content',
        message: 'Content contains potentially suspicious patterns',
        severity: 'medium',
        suggestion: 'Review content for inappropriate or harmful material'
      });
    }

    // Check for excessive repetition
    if (this.hasExcessiveRepetition(content)) {
      issues.push({
        type: 'info',
        field: 'content',
        message: 'Content contains excessive repetition',
        severity: 'low',
        suggestion: 'Consider reducing repetitive content'
      });
    }

    return issues;
  }

  private validatePrivacy(document: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const privacyLevel = document.privacyLevel || document.metadata?.privacyLevel;

    if (!privacyLevel) {
      issues.push({
        type: 'error',
        field: 'privacyLevel',
        message: 'Privacy level is not specified',
        severity: 'high',
        suggestion: 'Specify a privacy level (maximum, high, selective, minimal)'
      });
    } else if (!['maximum', 'high', 'selective', 'minimal'].includes(privacyLevel)) {
      issues.push({
        type: 'error',
        field: 'privacyLevel',
        message: `Invalid privacy level: ${privacyLevel}`,
        severity: 'high',
        suggestion: 'Use one of: maximum, high, selective, minimal'
      });
    }

    // Check for potential PII in content
    if (this.containsPotentialPII(document.content || '')) {
      issues.push({
        type: 'warning',
        field: 'content',
        message: 'Content may contain personally identifiable information',
        severity: 'high',
        suggestion: 'Review and anonymize any personal information'
      });
    }

    return issues;
  }

  private async validateRelevance(document: any): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    try {
      // Use LLM to assess relevance to blockchain governance
      const prompt = `Assess the relevance of this document to blockchain governance research:

Title: ${document.title || 'Untitled'}
Content: ${(document.content || '').substring(0, 1000)}...

Rate relevance from 0-1 and provide a brief explanation.`;

      const response = await llmClient.generateResponse(prompt, {
        maxTokens: 200,
        temperature: 0.2
      });

      // Parse relevance score from response
      const relevanceMatch = response.content.match(/(?:relevance|score)[:\s]*([0-9.]+)/i);
      const relevanceScore = relevanceMatch ? parseFloat(relevanceMatch[1]) : 0.5;

      if (relevanceScore < 0.3) {
        issues.push({
          type: 'warning',
          field: 'content',
          message: 'Document appears to have low relevance to blockchain governance',
          severity: 'medium',
          suggestion: 'Consider if this document belongs in the blockchain governance context'
        });
      }

    } catch (error) {
      logger.error('Relevance validation failed:', error);
      // Don't add issues if LLM validation fails
    }

    return issues;
  }

  private validateCompleteness(document: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check for missing optional but important fields
    if (!document.metadata?.author && !document.author) {
      issues.push({
        type: 'info',
        field: 'author',
        message: 'Author information is missing',
        severity: 'low',
        suggestion: 'Consider adding author information for better attribution'
      });
    }

    if (!document.metadata?.source && !document.source) {
      issues.push({
        type: 'info',
        field: 'source',
        message: 'Source information is missing',
        severity: 'low',
        suggestion: 'Add source information for better traceability'
      });
    }

    if (!document.keywords || document.keywords.length === 0) {
      issues.push({
        type: 'info',
        field: 'keywords',
        message: 'Keywords are missing',
        severity: 'low',
        suggestion: 'Add relevant keywords to improve discoverability'
      });
    }

    return issues;
  }

  private generateSuggestions(issues: ValidationIssue[], document: any): string[] {
    const suggestions: string[] = [];

    // Generate suggestions based on issues
    for (const issue of issues) {
      if (issue.suggestion) {
        suggestions.push(issue.suggestion);
      }
    }

    // Add general suggestions based on document state
    if (document.content && document.content.length < 200) {
      suggestions.push('Consider expanding the content with more detailed information');
    }

    if (!document.summary) {
      suggestions.push('Add a summary to improve document discoverability');
    }

    if (!document.tags || document.tags.length === 0) {
      suggestions.push('Add relevant tags to categorize the document');
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  private calculateQualityScore(issues: ValidationIssue[], document: any): QualityScore {
    const content = document.content || '';
    const metadata = document.metadata || {};

    return {
      overall: this.assessOverallQuality(issues, content, metadata),
      content: this.assessContentQuality(content),
      structure: this.assessStructureQuality(document),
      privacy: this.assessPrivacyCompliance(metadata),
      relevance: this.assessRelevance(content, metadata),
      completeness: this.assessCompleteness(document)
    };
  }

  private assessOverallQuality(issues: ValidationIssue[], content: string, metadata: any): number {
    let score = 1.0;

    // Deduct points for issues
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score -= 0.3;
          break;
        case 'high':
          score -= 0.2;
          break;
        case 'medium':
          score -= 0.1;
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    }

    // Bonus for good content length
    if (content.length > 500 && content.length < 5000) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private assessContentQuality(content: string): number {
    if (!content) return 0;

    let score = 0.5; // Base score

    // Length bonus
    if (content.length > 100) score += 0.1;
    if (content.length > 500) score += 0.1;
    if (content.length > 1000) score += 0.1;

    // Penalty for excessive repetition
    if (this.hasExcessiveRepetition(content)) score -= 0.2;

    // Penalty for suspicious patterns
    if (this.containsSuspiciousPatterns(content)) score -= 0.3;

    return Math.max(0, Math.min(1, score));
  }

  private assessStructureQuality(document: any): number {
    let score = 0;

    // Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (document[field]) score += 0.2;
    }

    // Bonus for optional fields
    if (document.summary) score += 0.1;
    if (document.keywords && document.keywords.length > 0) score += 0.1;
    if (document.tags && document.tags.length > 0) score += 0.1;

    return Math.min(1, score);
  }

  private assessPrivacyCompliance(metadata: any): number {
    const privacyLevel = metadata.privacyLevel;
    
    if (!privacyLevel) return 0;
    if (!['maximum', 'high', 'selective', 'minimal'].includes(privacyLevel)) return 0.3;
    
    return 1.0;
  }

  private assessRelevance(content: string, metadata: any): number {
    // Simple keyword-based relevance check
    const governanceKeywords = [
      'governance', 'policy', 'regulation', 'compliance', 'blockchain',
      'cryptocurrency', 'decentralized', 'consensus', 'stakeholder',
      'transparency', 'accountability', 'democracy', 'participation'
    ];

    const contentLower = content.toLowerCase();
    const keywordMatches = governanceKeywords.filter(keyword => 
      contentLower.includes(keyword)
    ).length;

    return Math.min(1, keywordMatches / 5); // Normalize to 0-1
  }

  private assessCompleteness(document: any): number {
    let score = 0;
    const fields = ['title', 'content', 'author', 'source', 'summary', 'keywords', 'tags'];
    
    for (const field of fields) {
      if (document[field] || document.metadata?.[field]) {
        score += 1 / fields.length;
      }
    }

    return score;
  }

  private determineValidity(issues: ValidationIssue[], strictMode: boolean): boolean {
    if (strictMode) {
      return issues.filter(issue => issue.type === 'error').length === 0;
    }

    return issues.filter(issue => 
      issue.type === 'error' && issue.severity === 'critical'
    ).length === 0;
  }

  private containsSuspiciousPatterns(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\.cookie/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  private hasExcessiveRepetition(content: string): boolean {
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts: { [key: string]: number } = {};
    
    for (const word of words) {
      if (word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }

    const maxCount = Math.max(...Object.values(wordCounts));
    const totalWords = words.length;
    
    return maxCount > totalWords * 0.1; // More than 10% repetition
  }

  private containsPotentialPII(content: string): boolean {
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{3}\.\d{2}\.\d{4}\b/, // SSN with dots
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
      /\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b/ // Credit card
    ];

    return piiPatterns.some(pattern => pattern.test(content));
  }
}

// Singleton instance
export const dataValidator = new DataValidator();
