// =====================================
// backend/src/utils/database.ts
// =====================================

import { Pool, PoolClient } from 'pg';
import Redis from 'ioredis';
import { config } from './config';
import { logger } from './logger';

class DatabaseManager {
  private pgPool: Pool;
  private redis: Redis;

  constructor() {
    // PostgreSQL connection
    this.pgPool = new Pool({
      connectionString: config.databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Redis connection
    this.redis = new Redis(config.redisUrl, {
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });
  }

  async initialize(): Promise<void> {
    try {
      // Test PostgreSQL connection
      const client = await this.pgPool.connect();
      await client.query('SELECT NOW()');
      client.release();
      logger.info('PostgreSQL connection established');

      // Test Redis connection
      await this.redis.ping();
      logger.info('Redis connection established');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pgPool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Query error', { text, params, error });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pgPool.connect();
  }

  getRedis(): Redis {
    return this.redis;
  }

  async close(): Promise<void> {
    await this.pgPool.end();
    await this.redis.quit();
    logger.info('Database connections closed');
  }
}

export const database = new DatabaseManager();
