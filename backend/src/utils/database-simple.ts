// =====================================
// backend/src/utils/database-simple.ts
// =====================================
// Simplified database manager for development without Docker

import { logger } from './logger';

class SimpleDatabaseManager {
  private isConnected: boolean = false;

  async initialize(): Promise<void> {
    try {
      // For development without Docker, we'll use a simple in-memory store
      logger.info('Using simplified database manager (no Docker)');
      this.isConnected = true;
      logger.info('Simple database manager initialized');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    // Mock database responses for development
    logger.debug('Mock query executed', { text, params });
    
    // Return mock data based on query
    if (text.includes('SELECT NOW()')) {
      return { rows: [{ now: new Date().toISOString() }] };
    }
    
    if (text.includes('SELECT 1')) {
      return { rows: [{ '?column?': 1 }] };
    }
    
    if (text.includes('sessions')) {
      return {
        rows: [
          { id: 'keynote', name: 'Opening Keynote', status: 'live' },
          { id: 'technical', name: 'Technical Standards', status: 'active' },
          { id: 'regulatory', name: 'Regulatory Landscape', status: 'active' }
        ]
      };
    }
    
    if (text.includes('agents')) {
      return {
        rows: [
          { id: '1', agent_type: 'archive', session_id: 'keynote', name: 'Keynote Archive Agent' },
          { id: '2', agent_type: 'codex', session_id: 'keynote', name: 'Keynote Codex Agent' },
          { id: '3', agent_type: 'discourse', session_id: 'keynote', name: 'Keynote Discourse Agent' }
        ]
      };
    }
    
    return { rows: [], rowCount: 0 };
  }

  async getClient(): Promise<any> {
    return {
      query: this.query.bind(this),
      release: () => {}
    };
  }

  getRedis(): any {
    return {
      ping: async () => 'PONG',
      get: async (key: string) => null,
      set: async (key: string, value: string) => 'OK',
      del: async (key: string) => 1,
      quit: async () => 'OK'
    };
  }

  async close(): Promise<void> {
    this.isConnected = false;
    logger.info('Simple database manager closed');
  }
}

export const database = new SimpleDatabaseManager();
