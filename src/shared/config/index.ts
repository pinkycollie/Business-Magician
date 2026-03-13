/**
 * Shared Configuration
 * 
 * Central configuration for the 360 Business Magician platform.
 */

/**
 * Platform configuration
 */
export interface PlatformConfig {
  /** Platform name */
  name: string;
  /** Platform version */
  version: string;
  /** Environment */
  environment: 'development' | 'staging' | 'production';
  /** API configuration */
  api: ApiConfig;
  /** Feature flags */
  features: FeatureFlags;
  /** Service endpoints */
  services: ServiceEndpoints;
}

/**
 * API Configuration
 */
export interface ApiConfig {
  /** Base URL */
  baseUrl: string;
  /** API version */
  version: string;
  /** Request timeout (ms) */
  timeout: number;
  /** Rate limit (requests per minute) */
  rateLimit: number;
}

/**
 * Feature flags
 */
export interface FeatureFlags {
  /** AI features enabled */
  aiEnabled: boolean;
  /** Real-time features enabled */
  realtimeEnabled: boolean;
  /** Analytics enabled */
  analyticsEnabled: boolean;
  /** Demo mode */
  demoMode: boolean;
}

/**
 * Service endpoints
 */
export interface ServiceEndpoints {
  /** PinkSync API */
  pinkSync: string;
  /** Northwest Agent API */
  northwest: string;
  /** LegalShield API */
  legalShield: string;
  /** Mux Video API */
  mux: string;
  /** Notion API */
  notion: string;
}

/**
 * Get environment variable with default
 */
export function getEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if environment variable is truthy
 */
export function isEnvEnabled(key: string): boolean {
  const value = process.env[key]?.toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Default platform configuration
 */
export const defaultConfig: PlatformConfig = {
  name: '360 Business Magician',
  version: '1.0.0',
  environment: (getEnvVar('NODE_ENV', 'development') as PlatformConfig['environment']),
  api: {
    baseUrl: getEnvVar('API_BASE_URL', 'http://localhost:5000'),
    version: 'v1',
    timeout: 30000,
    rateLimit: 100
  },
  features: {
    aiEnabled: isEnvEnabled('AI_ENABLED') || !!getEnvVar('OPENAI_API_KEY'),
    realtimeEnabled: isEnvEnabled('REALTIME_ENABLED'),
    analyticsEnabled: isEnvEnabled('ANALYTICS_ENABLED'),
    demoMode: isEnvEnabled('DEMO_MODE') || !getEnvVar('DATABASE_URL')
  },
  services: {
    pinkSync: getEnvVar('PINKSYNC_API_URL', 'https://api.pinksync.ai/v1'),
    northwest: getEnvVar('NORTHWEST_API_URL', 'https://api.northwest.com'),
    legalShield: getEnvVar('LEGALSHIELD_API_URL', 'https://api.legalshield.com'),
    mux: getEnvVar('MUX_API_URL', 'https://api.mux.com'),
    notion: getEnvVar('NOTION_API_URL', 'https://api.notion.com/v1')
  }
};

/**
 * Platform metadata
 */
export const platformMetadata = {
  name: '360 Business Magician',
  fullName: '360 Business Magician Platform',
  description: 'A comprehensive business formation platform for deaf entrepreneurs',
  organization: '360 Magicians',
  modules: [
    {
      id: 'business-magician',
      name: 'Business Magician',
      description: 'Business formation and management services'
    },
    {
      id: 'v4deaf',
      name: 'V4Deaf',
      description: 'VR4Deaf - Vocational Rehabilitation for Deaf integration'
    },
    {
      id: 'pinksync',
      name: 'PinkSync',
      description: 'Deaf-first platform transformation services'
    },
    {
      id: 'pinkflow',
      name: 'PinkFlow',
      description: 'Automation and workflow orchestration'
    }
  ]
};
