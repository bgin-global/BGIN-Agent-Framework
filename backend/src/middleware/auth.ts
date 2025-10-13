// =====================================
// backend/src/middleware/auth.ts
// =====================================

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Mock authentication for MVP - in production, validate JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    // Mock user for MVP
    req.user = {
      id: '1',
      email: 'demo@bgin.org',
      name: 'Demo User',
      role: 'participant'
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};