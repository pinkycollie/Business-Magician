/**
 * 360 Business Magician Platform
 * 
 * Main entry point for the reorganized codebase.
 * This module exports all platform components in a clean, organized structure.
 * 
 * Structure:
 * - APP: Client-side React application (in client/)
 * - API: Server-side API endpoints (in src/api/)
 * - Modules:
 *   - V4Deaf: VR4Deaf integration (VR counselor, accessibility)
 *   - Business Magician: Business formation, analytics, lifecycle
 *   - PinkSync: Deaf-first platform transformation
 *   - PinkFlow: Automation and workflow orchestration
 * - Shared: Common types, utilities, and configuration
 * 
 * @module 360-business-magician
 */

// API exports
export { default as apiV1 } from './api/v1';

// Module exports
export * as v4deaf from './modules/v4deaf';
export * as businessMagician from './modules/business-magician';
export * as pinkSync from './modules/pinksync';
export * as pinkFlow from './modules/pinkflow';

// Shared exports
export * from './shared/types';
export * from './shared/utils';
export { defaultConfig, platformMetadata } from './shared/config';

/**
 * Platform version
 */
export const VERSION = '1.0.0';

/**
 * Platform name
 */
export const PLATFORM_NAME = '360 Business Magician';

/**
 * Available modules
 */
export const MODULES = {
  V4DEAF: 'v4deaf',
  BUSINESS_MAGICIAN: 'business-magician',
  PINKSYNC: 'pinksync',
  PINKFLOW: 'pinkflow'
} as const;

/**
 * API version
 */
export const API_VERSION = 'v1';

/**
 * Platform status
 */
export interface PlatformStatus {
  version: string;
  apiVersion: string;
  modules: {
    v4deaf: 'active' | 'inactive';
    businessMagician: 'active' | 'inactive';
    pinkSync: 'active' | 'inactive';
    pinkFlow: 'active' | 'inactive';
  };
  timestamp: string;
}

/**
 * Get current platform status
 */
export function getPlatformStatus(): PlatformStatus {
  return {
    version: VERSION,
    apiVersion: API_VERSION,
    modules: {
      v4deaf: 'active',
      businessMagician: 'active',
      pinkSync: 'active',
      pinkFlow: 'active'
    },
    timestamp: new Date().toISOString()
  };
}
