// =====================================
// backend/src/monitoring/data-monitor.ts
// =====================================

import { logger } from '../utils/logger';
import { database } from '../utils/database';
import { qdrantClient } from '../integrations/vector-db/qdrant-client';
import { llmClient } from '../integrations/llm/llm-client';
import { discourseClient } from '../integrations/discourse-api/discourse-client';
import { kwaaiClient } from '../integrations/kwaai/kwaai-client';

export interface SystemMetrics {
  timestamp: string;
  dataIngestion: {
    totalDocuments: number;
    documentsToday: number;
    documentsThisHour: number;
    averageProcessingTime: number;
    errorRate: number;
  };
  processingPipeline: {
    queueSize: number;
    processingRate: number;
    successRate: number;
    averageLatency: number;
  };
  vectorDatabase: {
    totalPoints: number;
    collections: number;
    indexSize: string;
    queryLatency: number;
    health: boolean;
  };
  llmServices: {
    anthropic: boolean;
    openai: boolean;
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
  };
  integrations: {
    discourse: boolean;
    kwaai: boolean;
    lastSync: string;
    syncErrors: number;
  };
  agents: {
    archive: {
      status: string;
      documentsProcessed: number;
      queriesProcessed: number;
      averageResponseTime: number;
    };
    codex: {
      status: string;
      policiesAnalyzed: number;
      assessmentsCompleted: number;
      averageResponseTime: number;
    };
    discourse: {
      status: string;
      threadsProcessed: number;
      messagesAnalyzed: number;
      averageResponseTime: number;
    };
  };
  privacy: {
    anonymizedDocuments: number;
    privacyViolations: number;
    complianceScore: number;
  };
  performance: {
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: SystemMetrics) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  enabled: boolean;
}

export class DataMonitor {
  private metrics: SystemMetrics | null = null;
  private alertRules: AlertRule[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeAlertRules();
  }

  async startMonitoring(intervalMs: number = 30000): Promise<void> {
    if (this.isMonitoring) {
      logger.warn('Data monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    logger.info(`Starting data monitoring with ${intervalMs}ms interval`);

    // Initial metrics collection
    await this.collectMetrics();

    // Set up periodic collection
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.collectMetrics();
        await this.checkAlerts();
      } catch (error) {
        logger.error('Error during monitoring cycle:', error);
      }
    }, intervalMs);
  }

  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    logger.info('Data monitoring stopped');
  }

  async collectMetrics(): Promise<SystemMetrics> {
    try {
      const timestamp = new Date().toISOString();

      // Collect data ingestion metrics
      const dataIngestion = await this.collectDataIngestionMetrics();

      // Collect processing pipeline metrics
      const processingPipeline = await this.collectProcessingPipelineMetrics();

      // Collect vector database metrics
      const vectorDatabase = await this.collectVectorDatabaseMetrics();

      // Collect LLM services metrics
      const llmServices = await this.collectLLMServicesMetrics();

      // Collect integrations metrics
      const integrations = await this.collectIntegrationsMetrics();

      // Collect agent metrics
      const agents = await this.collectAgentMetrics();

      // Collect privacy metrics
      const privacy = await this.collectPrivacyMetrics();

      // Collect performance metrics
      const performance = await this.collectPerformanceMetrics();

      this.metrics = {
        timestamp,
        dataIngestion,
        processingPipeline,
        vectorDatabase,
        llmServices,
        integrations,
        agents,
        privacy,
        performance
      };

      logger.debug('Metrics collected successfully');
      return this.metrics;

    } catch (error) {
      logger.error('Failed to collect metrics:', error);
      throw error;
    }
  }

  getMetrics(): SystemMetrics | null {
    return this.metrics;
  }

  async generateReport(): Promise<{
    summary: string;
    metrics: SystemMetrics;
    alerts: Array<{
      rule: string;
      severity: string;
      message: string;
      timestamp: string;
    }>;
    recommendations: string[];
  }> {
    if (!this.metrics) {
      throw new Error('No metrics available. Start monitoring first.');
    }

    const alerts = await this.checkAlerts();
    const recommendations = this.generateRecommendations(this.metrics);

    const summary = this.generateSummary(this.metrics, alerts);

    return {
      summary,
      metrics: this.metrics,
      alerts,
      recommendations
    };
  }

  private async collectDataIngestionMetrics(): Promise<SystemMetrics['dataIngestion']> {
    try {
      // Get total documents
      const totalResult = await database.query(`
        SELECT COUNT(*) as total FROM archive_documents
      `);
      const totalDocuments = parseInt(totalResult.rows[0].total);

      // Get documents today
      const todayResult = await database.query(`
        SELECT COUNT(*) as today FROM archive_documents 
        WHERE created_at >= CURRENT_DATE
      `);
      const documentsToday = parseInt(todayResult.rows[0].today);

      // Get documents this hour
      const thisHourResult = await database.query(`
        SELECT COUNT(*) as this_hour FROM archive_documents 
        WHERE created_at >= NOW() - INTERVAL '1 hour'
      `);
      const documentsThisHour = parseInt(thisHourResult.rows[0].this_hour);

      // Get average processing time
      const processingTimeResult = await database.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_time 
        FROM archive_documents 
        WHERE processing_status = 'completed'
      `);
      const averageProcessingTime = parseFloat(processingTimeResult.rows[0].avg_time) || 0;

      // Get error rate
      const errorResult = await database.query(`
        SELECT 
          COUNT(*) FILTER (WHERE processing_status = 'failed') as errors,
          COUNT(*) as total
        FROM archive_documents
      `);
      const errorRate = errorResult.rows[0].total > 0 
        ? errorResult.rows[0].errors / errorResult.rows[0].total 
        : 0;

      return {
        totalDocuments,
        documentsToday,
        documentsThisHour,
        averageProcessingTime,
        errorRate
      };

    } catch (error) {
      logger.error('Failed to collect data ingestion metrics:', error);
      return {
        totalDocuments: 0,
        documentsToday: 0,
        documentsThisHour: 0,
        averageProcessingTime: 0,
        errorRate: 0
      };
    }
  }

  private async collectProcessingPipelineMetrics(): Promise<SystemMetrics['processingPipeline']> {
    try {
      // Get queue size (pending documents)
      const queueResult = await database.query(`
        SELECT COUNT(*) as queue_size FROM archive_documents 
        WHERE processing_status = 'pending'
      `);
      const queueSize = parseInt(queueResult.rows[0].queue_size);

      // Get processing rate (documents per hour)
      const processingRateResult = await database.query(`
        SELECT COUNT(*) as processed FROM archive_documents 
        WHERE processing_status = 'completed' 
        AND updated_at >= NOW() - INTERVAL '1 hour'
      `);
      const processingRate = parseInt(processingRateResult.rows[0].processed);

      // Get success rate
      const successRateResult = await database.query(`
        SELECT 
          COUNT(*) FILTER (WHERE processing_status = 'completed') as success,
          COUNT(*) as total
        FROM archive_documents 
        WHERE created_at >= NOW() - INTERVAL '1 hour'
      `);
      const successRate = successRateResult.rows[0].total > 0 
        ? successRateResult.rows[0].success / successRateResult.rows[0].total 
        : 0;

      // Get average latency
      const latencyResult = await database.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_latency 
        FROM archive_documents 
        WHERE processing_status = 'completed' 
        AND created_at >= NOW() - INTERVAL '1 hour'
      `);
      const averageLatency = parseFloat(latencyResult.rows[0].avg_latency) || 0;

      return {
        queueSize,
        processingRate,
        successRate,
        averageLatency
      };

    } catch (error) {
      logger.error('Failed to collect processing pipeline metrics:', error);
      return {
        queueSize: 0,
        processingRate: 0,
        successRate: 0,
        averageLatency: 0
      };
    }
  }

  private async collectVectorDatabaseMetrics(): Promise<SystemMetrics['vectorDatabase']> {
    try {
      const stats = await qdrantClient.getCollectionStats('bgin_documents');
      const health = await qdrantClient.healthCheck();

      // Simulate query latency (in production, measure actual queries)
      const queryLatency = Math.random() * 100; // Mock latency

      return {
        totalPoints: stats.points_count || 0,
        collections: 1,
        indexSize: `${(stats.points_count || 0) * 0.002}MB`,
        queryLatency,
        health
      };

    } catch (error) {
      logger.error('Failed to collect vector database metrics:', error);
      return {
        totalPoints: 0,
        collections: 0,
        indexSize: '0MB',
        queryLatency: 0,
        health: false
      };
    }
  }

  private async collectLLMServicesMetrics(): Promise<SystemMetrics['llmServices']> {
    try {
      const healthCheck = await llmClient.healthCheck();
      const providers = llmClient.getAvailableProviders();

      // Mock metrics (in production, track actual usage)
      const totalRequests = Math.floor(Math.random() * 1000);
      const averageResponseTime = Math.random() * 2000;
      const errorRate = Math.random() * 0.1;

      return {
        anthropic: healthCheck.anthropic || false,
        openai: healthCheck.openai || false,
        totalRequests,
        averageResponseTime,
        errorRate
      };

    } catch (error) {
      logger.error('Failed to collect LLM services metrics:', error);
      return {
        anthropic: false,
        openai: false,
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0
      };
    }
  }

  private async collectIntegrationsMetrics(): Promise<SystemMetrics['integrations']> {
    try {
      const discourseHealth = await discourseClient.healthCheck();
      const kwaaiHealth = await kwaaiClient.healthCheck();

      // Get last sync time (using metadata->>'source' to check for discourse documents)
      const lastSyncResult = await database.query(`
        SELECT MAX(created_at) as last_sync
        FROM archive_documents
        WHERE metadata->>'source' = 'discourse'
      `);
      const lastSync = lastSyncResult.rows[0].last_sync || 'Never';

      // Get sync errors (using metadata->>'source' to check for discourse documents)
      const syncErrorsResult = await database.query(`
        SELECT COUNT(*) as errors
        FROM archive_documents
        WHERE metadata->>'source' = 'discourse'
        AND processing_status = 'failed'
      `);
      const syncErrors = parseInt(syncErrorsResult.rows[0].errors);

      return {
        discourse: discourseHealth,
        kwaai: kwaaiHealth,
        lastSync: lastSync.toString(),
        syncErrors
      };

    } catch (error) {
      logger.error('Failed to collect integrations metrics:', error);
      return {
        discourse: false,
        kwaai: false,
        lastSync: 'Never',
        syncErrors: 0
      };
    }
  }

  private async collectAgentMetrics(): Promise<SystemMetrics['agents']> {
    try {
      // Archive agent metrics
      const archiveResult = await database.query(`
        SELECT 
          COUNT(*) as documents_processed,
          AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_response_time
        FROM archive_documents 
        WHERE created_at >= NOW() - INTERVAL '1 hour'
      `);

      // Mock query metrics
      const queriesProcessed = Math.floor(Math.random() * 100);

      return {
        archive: {
          status: 'active',
          documentsProcessed: parseInt(archiveResult.rows[0].documents_processed),
          queriesProcessed,
          averageResponseTime: parseFloat(archiveResult.rows[0].avg_response_time) || 0
        },
        codex: {
          status: 'active',
          policiesAnalyzed: Math.floor(Math.random() * 50),
          assessmentsCompleted: Math.floor(Math.random() * 30),
          averageResponseTime: Math.random() * 1500
        },
        discourse: {
          status: 'active',
          threadsProcessed: Math.floor(Math.random() * 20),
          messagesAnalyzed: Math.floor(Math.random() * 200),
          averageResponseTime: Math.random() * 1000
        }
      };

    } catch (error) {
      logger.error('Failed to collect agent metrics:', error);
      return {
        archive: { status: 'error', documentsProcessed: 0, queriesProcessed: 0, averageResponseTime: 0 },
        codex: { status: 'error', policiesAnalyzed: 0, assessmentsCompleted: 0, averageResponseTime: 0 },
        discourse: { status: 'error', threadsProcessed: 0, messagesAnalyzed: 0, averageResponseTime: 0 }
      };
    }
  }

  private async collectPrivacyMetrics(): Promise<SystemMetrics['privacy']> {
    try {
      // Get anonymized documents count
      const anonymizedResult = await database.query(`
        SELECT COUNT(*) as anonymized 
        FROM archive_documents 
        WHERE privacy_level IN ('maximum', 'high')
      `);
      const anonymizedDocuments = parseInt(anonymizedResult.rows[0].anonymized);

      // Get privacy violations (mock for now)
      const privacyViolations = 0; // In production, track actual violations

      // Calculate compliance score
      const totalDocs = await database.query(`SELECT COUNT(*) as total FROM archive_documents`);
      const complianceScore = totalDocs.rows[0].total > 0 
        ? anonymizedDocuments / totalDocs.rows[0].total 
        : 1;

      return {
        anonymizedDocuments,
        privacyViolations,
        complianceScore
      };

    } catch (error) {
      logger.error('Failed to collect privacy metrics:', error);
      return {
        anonymizedDocuments: 0,
        privacyViolations: 0,
        complianceScore: 0
      };
    }
  }

  private async collectPerformanceMetrics(): Promise<SystemMetrics['performance']> {
    try {
      const memUsage = process.memoryUsage();
      const memoryUsage = memUsage.heapUsed / memUsage.heapTotal;

      // Mock other metrics (in production, use system monitoring)
      const cpuUsage = Math.random() * 100;
      const diskUsage = Math.random() * 100;
      const networkLatency = Math.random() * 50;

      return {
        memoryUsage,
        cpuUsage,
        diskUsage,
        networkLatency
      };

    } catch (error) {
      logger.error('Failed to collect performance metrics:', error);
      return {
        memoryUsage: 0,
        cpuUsage: 0,
        diskUsage: 0,
        networkLatency: 0
      };
    }
  }

  private initializeAlertRules(): void {
    this.alertRules = [
      {
        id: 'high_error_rate',
        name: 'High Error Rate',
        condition: (metrics) => metrics.dataIngestion.errorRate > 0.1,
        severity: 'high',
        message: 'Document processing error rate is above 10%',
        enabled: true
      },
      {
        id: 'low_processing_rate',
        name: 'Low Processing Rate',
        condition: (metrics) => metrics.processingPipeline.processingRate < 5,
        severity: 'medium',
        message: 'Document processing rate is below 5 documents per hour',
        enabled: true
      },
      {
        id: 'vector_db_unhealthy',
        name: 'Vector Database Unhealthy',
        condition: (metrics) => !metrics.vectorDatabase.health,
        severity: 'critical',
        message: 'Vector database is not responding',
        enabled: true
      },
      {
        id: 'llm_services_down',
        name: 'LLM Services Down',
        condition: (metrics) => !metrics.llmServices.anthropic && !metrics.llmServices.openai,
        severity: 'critical',
        message: 'All LLM services are unavailable',
        enabled: true
      },
      {
        id: 'high_memory_usage',
        name: 'High Memory Usage',
        condition: (metrics) => metrics.performance.memoryUsage > 0.9,
        severity: 'high',
        message: 'Memory usage is above 90%',
        enabled: true
      }
    ];
  }

  private async checkAlerts(): Promise<Array<{
    rule: string;
    severity: string;
    message: string;
    timestamp: string;
  }>> {
    if (!this.metrics) {
      return [];
    }

    const alerts: Array<{
      rule: string;
      severity: string;
      message: string;
      timestamp: string;
    }> = [];

    for (const rule of this.alertRules) {
      if (rule.enabled && rule.condition(this.metrics)) {
        alerts.push({
          rule: rule.name,
          severity: rule.severity,
          message: rule.message,
          timestamp: new Date().toISOString()
        });

        logger.warn(`Alert triggered: ${rule.name} - ${rule.message}`);
      }
    }

    return alerts;
  }

  private generateSummary(metrics: SystemMetrics, alerts: any[]): string {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = alerts.filter(a => a.severity === 'high').length;
    
    let summary = `System Status: ${criticalAlerts > 0 ? 'CRITICAL' : highAlerts > 0 ? 'WARNING' : 'HEALTHY'}\n`;
    summary += `Total Documents: ${metrics.dataIngestion.totalDocuments}\n`;
    summary += `Processing Rate: ${metrics.processingPipeline.processingRate} docs/hour\n`;
    summary += `Vector DB Health: ${metrics.vectorDatabase.health ? 'OK' : 'FAILED'}\n`;
    summary += `Active Alerts: ${alerts.length} (${criticalAlerts} critical, ${highAlerts} high)`;

    return summary;
  }

  private generateRecommendations(metrics: SystemMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.dataIngestion.errorRate > 0.05) {
      recommendations.push('Consider investigating document processing errors');
    }

    if (metrics.processingPipeline.queueSize > 100) {
      recommendations.push('Processing queue is large - consider scaling up processing capacity');
    }

    if (metrics.performance.memoryUsage > 0.8) {
      recommendations.push('Memory usage is high - consider optimizing or scaling');
    }

    if (metrics.vectorDatabase.queryLatency > 1000) {
      recommendations.push('Vector database queries are slow - consider optimizing indexes');
    }

    if (metrics.privacy.complianceScore < 0.8) {
      recommendations.push('Privacy compliance score is low - review anonymization processes');
    }

    return recommendations;
  }
}

// Singleton instance
export const dataMonitor = new DataMonitor();
