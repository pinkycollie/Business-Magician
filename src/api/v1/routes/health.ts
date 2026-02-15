/**
 * Health Check Routes
 * 
 * Provides health status endpoints for monitoring and service discovery
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Basic health check
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: '360 Business Magician Platform',
    version: 'v1',
    timestamp: new Date().toISOString(),
    modules: {
      businessMagician: 'active',
      v4deaf: 'active',
      pinkSync: 'active',
      pinkFlow: 'active'
    }
  });
});

// Detailed health status
router.get('/detailed', (_req: Request, res: Response) => {
  const env = process.env.NODE_ENV || 'development';
  
  res.json({
    status: 'operational',
    service: '360 Business Magician Platform',
    version: 'v1',
    environment: env,
    timestamp: new Date().toISOString(),
    services: {
      api: {
        status: 'healthy',
        uptime: process.uptime()
      },
      businessMagician: {
        status: 'healthy',
        features: ['business-formation', 'analytics', 'lifecycle-management']
      },
      v4deaf: {
        status: 'healthy',
        features: ['vr-counselor-integration', 'accessibility-services', 'asl-resources']
      },
      pinkSync: {
        status: 'healthy',
        features: ['platform-transformation', 'deaf-first-modules', 'accessibility']
      },
      pinkFlow: {
        status: 'healthy',
        features: ['workflow-automation', 'event-processing', 'integration-hub']
      }
    },
    integrations: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      pinkSync: !!process.env.PINKSYNC_API_KEY,
      database: !!process.env.DATABASE_URL
    }
  });
});

export default router;
