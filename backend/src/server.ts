// =====================================
// backend/src/server.ts
// =====================================

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { database } from './utils/database';

// Route imports
import authRoutes from './routes/auth';
import archiveRoutes from './routes/agents/archive';
import codexRoutes from './routes/agents/codex';
import discourseRoutes from './routes/agents/discourse';
import synthesisRoutes from './routes/synthesis';
import trustRoutes from './routes/trust';
import healthRoutes from './routes/health';
import toipRoutes from './routes/toip';
import privacyPoolsRoutes from './routes/privacy-pools';

// Middleware imports
import { errorHandler } from './middleware/errorHandler';
import { privacyMiddleware } from './middleware/privacy';
import { authMiddleware } from './middleware/auth';

// Agent system imports
import { AgentCoordinator } from './agents/coordination/agent-router';
import { SocketManager } from './services/socket-manager';

// Integration imports
import { qdrantClient } from './integrations/vector-db/qdrant-client';
import { llmClient } from './integrations/llm/llm-client';
import { discourseClient } from './integrations/discourse-api/discourse-client';

// Monitoring imports
import { dataMonitor } from './monitoring/data-monitor';

class BGINServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private agentCoordinator: AgentCoordinator;
  private socketManager: SocketManager;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    
    this.agentCoordinator = new AgentCoordinator();
    this.socketManager = new SocketManager(this.io, this.agentCoordinator);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: config.corsOrigin,
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    });
    this.app.use(limiter);

    // Request processing
    this.app.use(compression());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Privacy middleware
    this.app.use(privacyMiddleware);
  }

  private setupRoutes() {
    // Health check (no auth required)
    this.app.use('/health', healthRoutes);

    // API routes
    this.app.use('/api/auth', authRoutes);
    
    // ToIP routes (public for agent registration)
    this.app.use('/api/toip', toipRoutes);
    
    // Privacy Pools routes (public for ASP functionality)
    this.app.use('/api/privacy-pools', privacyPoolsRoutes);
    
    // Protected routes
    this.app.use('/api/agents/archive', authMiddleware, archiveRoutes);
    this.app.use('/api/agents/codex', authMiddleware, codexRoutes);
    this.app.use('/api/agents/discourse', authMiddleware, discourseRoutes);
    this.app.use('/api/synthesis', authMiddleware, synthesisRoutes);
    this.app.use('/api/trust', authMiddleware, trustRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private setupErrorHandling() {
    this.app.use(errorHandler);
  }

  public async start() {
    try {
      // Initialize database
      await database.initialize();
      logger.info('Database connected successfully');

      // Initialize integrations
      await this.initializeIntegrations();

      // Initialize agent coordinator
      await this.agentCoordinator.initialize();
      logger.info('Agent coordinator initialized');

      // Start monitoring
      await dataMonitor.startMonitoring(30000); // 30 second intervals
      logger.info('Data monitoring started');

      // Start server
      const port = config.port || 4000;
      this.server.listen(port, () => {
        logger.info(`🚀 BGIN MVP server running on port ${port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`Multi-agent mode: ${config.multiAgentMode ? 'enabled' : 'disabled'}`);
        logger.info(`Enhanced RAG system: enabled`);
        logger.info(`Real-time monitoring: enabled`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async initializeIntegrations() {
    try {
      // Initialize Qdrant vector database
      await qdrantClient.initialize();
      logger.info('Qdrant vector database connected');

      // Initialize LLM client
      const llmHealth = await llmClient.healthCheck();
      logger.info(`LLM services: ${Object.entries(llmHealth).map(([k, v]) => `${k}: ${v ? 'OK' : 'FAIL'}`).join(', ')}`);

      // Initialize Discourse client (only if enabled)
      if (config.discourseAgentEnabled) {
        try {
          await discourseClient.initialize();
          logger.info('Discourse API connected');
        } catch (error) {
          logger.warn('Discourse API connection failed, continuing without Discourse integration');
        }
      } else {
        logger.info('Discourse agent is disabled (DISCOURSE_AGENT_ENABLED=false)');
      }

    } catch (error) {
      logger.error('Integration initialization failed:', error);
      // Don't fail server startup for integration issues
    }
  }

  public async shutdown() {
    logger.info('Shutting down server...');
    
    // Stop monitoring
    await dataMonitor.stopMonitoring();
    logger.info('Data monitoring stopped');
    
    if (this.server) {
      this.server.close();
    }
    
    await database.close();
    await this.agentCoordinator.shutdown();
    
    logger.info('Server shutdown complete');
  }
}

// Start server
const server = new BGINServer();
server.start();

// Graceful shutdown
process.on('SIGTERM', () => server.shutdown());
process.on('SIGINT', () => server.shutdown());

export default server;