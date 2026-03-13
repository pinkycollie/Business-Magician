/**
 * 360 Business Magician API v1
 * 
 * Main entry point for the API v1 routes
 * This module consolidates all API endpoints for:
 * - Business Magician (business formation, analytics, tools)
 * - V4Deaf (VR counselor integration, accessibility)
 * - PinkSync (deaf-first platform transformation)
 * - PinkFlow (automation workflows)
 */

import { Router } from 'express';

// Import route modules
import healthRoutes from './routes/health';
import businessRoutes from './routes/business';
import v4deafRoutes from './routes/v4deaf';
import pinkSyncRoutes from './routes/pinksync';
import automationRoutes from './routes/automation';

const router = Router();

// Health check endpoint
router.use('/health', healthRoutes);

// Business Magician routes
router.use('/business', businessRoutes);

// V4Deaf routes (VR counselor integration)
router.use('/v4deaf', v4deafRoutes);

// PinkSync routes (deaf-first platform transformation)
router.use('/pinksync', pinkSyncRoutes);

// Automation/workflow routes (PinkFlow)
router.use('/automation', automationRoutes);

export default router;
