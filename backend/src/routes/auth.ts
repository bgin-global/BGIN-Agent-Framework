// =====================================
// backend/src/routes/auth.ts
// =====================================

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock authentication for MVP
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - in production, validate against database
  if (email && password) {
    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      success: true,
      token,
      user: {
        id: '1',
        email,
        name: 'Demo User',
        role: 'participant'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }
}));

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  
  // Mock registration - in production, create user in database
  if (email && password && name) {
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: '1',
        email,
        name,
        role: 'participant'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Email, password, and name are required'
    });
  }
}));

router.post('/logout', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

router.get('/me', asyncHandler(async (req, res) => {
  // Mock user info - in production, validate JWT token
  res.json({
    success: true,
    user: {
      id: '1',
      email: 'demo@bgin.org',
      name: 'Demo User',
      role: 'participant'
    }
  });
}));

export default router;