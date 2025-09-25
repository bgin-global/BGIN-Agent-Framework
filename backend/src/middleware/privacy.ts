// =====================================
// backend/src/middleware/privacy.ts
// =====================================

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const privacyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add privacy headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Add privacy context to request
    req.privacyContext = {
      level: 'selective',
      anonymization: true,
      dataRetention: 30
    };

    logger.debug('Privacy middleware applied', {
      url: req.url,
      method: req.method,
      privacyLevel: req.privacyContext.level
    });

    next();
  } catch (error) {
    logger.error('Privacy middleware error:', error);
    next();
  }
};

// Extend Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      privacyContext?: {
        level: string;
        anonymization: boolean;
        dataRetention: number;
      };
    }
  }
}