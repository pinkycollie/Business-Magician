/**
 * V4Deaf Module
 * 
 * Comprehensive module for VR4Deaf (Vocational Rehabilitation for Deaf) services.
 * This module provides:
 * - VR counselor integration services
 * - Accessibility service management
 * - ASL resource management
 * - User accommodation tracking
 * 
 * @module v4deaf
 */

// Re-export services from existing server implementations
export { initializeRealtimeTranslation } from '../../../server/services/realtimeTranslation';

/**
 * V4Deaf Service Configuration
 */
export interface V4DeafConfig {
  /** Whether ASL video support is enabled */
  aslVideoEnabled: boolean;
  /** Default communication preference */
  defaultCommunicationMethod: 'asl' | 'text' | 'both';
  /** Whether real-time captioning is available */
  realtimeCaptioningEnabled: boolean;
  /** VR agency integration settings */
  vrAgencyIntegration: {
    enabled: boolean;
    apiEndpoint?: string;
    syncInterval?: number; // in milliseconds
  };
}

/**
 * VR Counselor interface
 */
export interface VRCounselor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  organization: string;
  specializations?: string[];
}

/**
 * User-Counselor relationship
 */
export interface UserCounselorRelationship {
  id: number;
  userId: number;
  counselorId: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive' | 'pending';
  services: string[];
}

/**
 * Accommodation request
 */
export interface AccommodationRequest {
  id: string;
  userId: number;
  accommodationType: 'interpreter' | 'captioning' | 'video-relay' | 'assistive-tech';
  details: string;
  scheduledFor?: Date;
  status: 'pending' | 'approved' | 'denied' | 'completed';
  createdAt: Date;
}

/**
 * ASL Dictionary term
 */
export interface ASLDictionaryTerm {
  id: number;
  term: string;
  definition: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  relatedTerms?: string[];
}

/**
 * User VR Progress
 */
export interface VRProgress {
  userId: number;
  currentPhase: 'idea' | 'build' | 'grow' | 'manage';
  completedTasks: number;
  totalTasks: number;
  milestones: {
    name: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  lastUpdated: Date;
}

/**
 * Default V4Deaf configuration
 */
export const defaultV4DeafConfig: V4DeafConfig = {
  aslVideoEnabled: true,
  defaultCommunicationMethod: 'both',
  realtimeCaptioningEnabled: true,
  vrAgencyIntegration: {
    enabled: false,
    syncInterval: 3600000 // 1 hour
  }
};

/**
 * V4Deaf module version
 */
export const V4DEAF_VERSION = '1.0.0';

/**
 * Accommodation types available
 */
export const ACCOMMODATION_TYPES = [
  'interpreter',
  'captioning',
  'video-relay',
  'assistive-tech'
] as const;

/**
 * ASL dictionary categories
 */
export const ASL_CATEGORIES = [
  'business-fundamentals',
  'finance',
  'legal',
  'marketing',
  'operations',
  'technology',
  'management'
] as const;
