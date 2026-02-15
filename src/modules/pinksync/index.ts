/**
 * PinkSync Module
 * 
 * Comprehensive module for PinkSync Intelligence Platform integration.
 * This module provides:
 * - Platform transformation services
 * - Deaf-first module management
 * - Accessibility analysis
 * - Communication preferences
 * 
 * @module pinksync
 */

// Re-export services from existing server implementations
export { pinkSyncService, type PinkSyncTransformOptions, type PinkSyncResult } from '../../../server/services/pinkSyncService';
export { pinkSyncHub } from '../../../server/services/integrations/pinkSyncHub';

/**
 * PinkSync Configuration
 */
export interface PinkSyncConfig {
  /** PinkSync API URL */
  apiUrl: string;
  /** Whether demo mode is enabled */
  demoMode: boolean;
  /** Available modules */
  availableModules: PinkSyncModule[];
  /** Default accessibility settings */
  defaultAccessibility: AccessibilitySettings;
}

/**
 * PinkSync Module
 */
export interface PinkSyncModule {
  id: string;
  name: string;
  description: string;
  type: 'communication' | 'ui' | 'accessibility' | 'content';
  requiredTechLevel: 'beginner' | 'intermediate' | 'advanced';
  platformTypes: ('business' | 'job' | 'content' | 'tech')[];
}

/**
 * Accessibility Settings
 */
export interface AccessibilitySettings {
  aslVideoEnabled: boolean;
  captionsEnabled: boolean;
  visualNotifications: boolean;
  highContrastMode: boolean;
  simplifiedLayout: boolean;
  communicationMethod: 'asl' | 'text' | 'both';
}

/**
 * Platform Analysis Result
 */
export interface PlatformAnalysis {
  url: string;
  platformType: string;
  accessibilityScore: number;
  detectedFeatures: string[];
  recommendations: {
    high: string[];
    medium: string[];
    low: string[];
  };
  recommendedModules: string[];
  timestamp: Date;
}

/**
 * Platform Transformation
 */
export interface PlatformTransformation {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  platformType: string;
  userTechLevel: string;
  communicationPreference: string;
  accessibilityLevel: string;
  modules: {
    name: string;
    status: 'pending' | 'active';
    type: string;
  }[];
  accessibilityFeatures: string[];
  platformUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * User Communication Preferences
 */
export interface CommunicationPreferences {
  userId: string;
  communicationMethod: 'asl' | 'text' | 'both';
  captionsEnabled: boolean;
  visualNotifications: boolean;
  highContrastMode: boolean;
  simplifiedLayout: boolean;
  preferredInterpreterType: 'certified' | 'any';
  videoCallPreference: 'vp' | 'zoom' | 'teams' | 'any';
  lastUpdated: Date;
}

/**
 * Default PinkSync configuration
 */
export const defaultPinkSyncConfig: PinkSyncConfig = {
  apiUrl: process.env.PINKSYNC_API_URL || 'https://api.pinksync.ai/v1',
  demoMode: !process.env.PINKSYNC_API_KEY,
  availableModules: [
    {
      id: 'asl_video_chat',
      name: 'ASL Video Chat',
      description: 'Integrated ASL video chat with real-time communication',
      type: 'communication',
      requiredTechLevel: 'beginner',
      platformTypes: ['business', 'job', 'content', 'tech']
    },
    {
      id: 'visual_navigation',
      name: 'Visual Navigation System',
      description: 'Icon-based navigation with ASL video tooltips',
      type: 'ui',
      requiredTechLevel: 'beginner',
      platformTypes: ['business', 'job', 'content', 'tech']
    },
    {
      id: 'real_time_captioning',
      name: 'Real-time Captioning',
      description: 'Automatic captions for all audio content',
      type: 'accessibility',
      requiredTechLevel: 'intermediate',
      platformTypes: ['content', 'tech']
    },
    {
      id: 'deaf_culture_resources',
      name: 'Deaf Culture Resources',
      description: 'Built-in resources and links to deaf community resources',
      type: 'content',
      requiredTechLevel: 'beginner',
      platformTypes: ['business', 'job', 'content']
    },
    {
      id: 'adaptive_interfaces',
      name: 'Adaptive Interfaces',
      description: 'UI that adapts based on user communication preferences',
      type: 'ui',
      requiredTechLevel: 'advanced',
      platformTypes: ['business', 'job', 'content', 'tech']
    }
  ],
  defaultAccessibility: {
    aslVideoEnabled: true,
    captionsEnabled: true,
    visualNotifications: true,
    highContrastMode: false,
    simplifiedLayout: false,
    communicationMethod: 'both'
  }
};

/**
 * PinkSync module version
 */
export const PINKSYNC_VERSION = '1.0.0';

/**
 * Platform types
 */
export const PLATFORM_TYPES = [
  'business',
  'job',
  'content',
  'tech'
] as const;

/**
 * Module types
 */
export const MODULE_TYPES = [
  'communication',
  'ui',
  'accessibility',
  'content'
] as const;

/**
 * Tech levels
 */
export const TECH_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

/**
 * Communication methods
 */
export const COMMUNICATION_METHODS = [
  'asl',
  'text',
  'both'
] as const;
