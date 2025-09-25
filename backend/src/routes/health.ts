// =====================================
// backend/src/routes/health.ts
// =====================================

import { Router } from 'express';
import { database } from '../utils/database';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'checking',
        redis: 'checking',
        vectorDb: 'checking',
        agents: 'checking'
      }
    };

    // Check PostgreSQL
    try {
      await database.query('SELECT 1');
      healthCheck.services.database = 'healthy';
    } catch (error) {
      healthCheck.services.database = 'unhealthy';
      healthCheck.status = 'degraded';
    }

    // Check Redis
    try {
      await database.getRedis().ping();
      healthCheck.services.redis = 'healthy';
    } catch (error) {
      healthCheck.services.redis = 'unhealthy';
      healthCheck.status = 'degraded';
    }

    // TODO: Check Vector DB and Agents

    res.status(healthCheck.status === 'healthy' ? 200 : 503).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

export default router;
