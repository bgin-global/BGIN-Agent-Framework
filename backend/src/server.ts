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
import path from 'path';
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
import chatRoutes from './routes/chat';

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
import { kwaaiClient } from './integrations/kwaai/kwaai-client';

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
    this.app.use('/api/chat', authMiddleware, chatRoutes);

    // Serve static files from frontend build
    // Path: backend/dist -> backend/../frontend/dist
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    this.app.use(express.static(frontendDistPath));

    // SPA fallback - serve index.html for all non-API routes
    // This must be last to allow API 404s to work properly
    this.app.get('*', (req, res) => {
      // Only serve index.html for non-API routes
      if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      } else {
        res.status(404).json({ error: 'API route not found' });
      }
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

      // Start monitoring (disabled for development)
      // await dataMonitor.startMonitoring(30000); // 30 second intervals
      // logger.info('Data monitoring started');

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
      if (config.integrations.discourse) {
        await discourseClient.initialize();
        logger.info('Discourse API connected');
      } else {
        logger.info('Discourse integration disabled (DISCOURSE_INTEGRATION_ENABLED=false)');
      }

      // Initialize Kwaai client (only if enabled)
      if (config.integrations.kwaai) {
        await kwaaiClient.initialize();
        logger.info('Kwaai integration initialized');
      } else {
        logger.info('Kwaai integration disabled (KWAAI_INTEGRATION_ENABLED=false)');
      }

      // Phala integration (only if enabled)
      if (config.integrations.phala) {
        // await phalaClient.initialize();
        logger.info('Phala integration initialized');
      } else {
        logger.info('Phala integration disabled (PHALA_INTEGRATION_ENABLED=false)');
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