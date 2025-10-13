// =====================================
// backend/src/services/socket-manager.ts
// =====================================

import { Server as SocketIOServer } from 'socket.io';
import { AgentCoordinator } from '../agents/coordination/agent-router';
import { logger } from '../utils/logger';

export class SocketManager {
  private io: SocketIOServer;
  private agentCoordinator: AgentCoordinator;

  constructor(io: SocketIOServer, agentCoordinator: AgentCoordinator) {
    this.io = io;
    this.agentCoordinator = agentCoordinator;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Agent coordination events
      socket.on('agent:request', async (data) => {
        try {
          const result = await this.agentCoordinator.processRequest(data);
          socket.emit('agent:response', result);
        } catch (error) {
          logger.error('Agent request error:', error);
          socket.emit('agent:error', { message: 'Agent request failed' });
        }
      });

      // Real-time collaboration
      socket.on('collaboration:join', (sessionId) => {
        socket.join(`session:${sessionId}`);
        logger.info(`Client ${socket.id} joined session ${sessionId}`);
      });

      socket.on('collaboration:leave', (sessionId) => {
        socket.leave(`session:${sessionId}`);
        logger.info(`Client ${socket.id} left session ${sessionId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public broadcastToSession(sessionId: string, event: string, data: any) {
    this.io.to(`session:${sessionId}`).emit(event, data);
  }

  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }
}
