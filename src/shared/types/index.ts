/**
 * Shared Types
 * 
 * Common type definitions used across the 360 Business Magician platform.
 * These types are shared between client (App) and server (API) components.
 */

/**
 * User type
 */
export interface User {
  id: number;
  username: string;
  email: string;
  isDeaf?: boolean;
  preferASL?: boolean;
  createdAt?: Date;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  perPage: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Business entity types
 */
export type EntityType = 'LLC' | 'Corporation' | 'Partnership' | 'Sole Proprietorship';

/**
 * Business lifecycle phases
 */
export type LifecyclePhaseSlug = 'idea' | 'build' | 'grow' | 'manage';

/**
 * Communication methods
 */
export type CommunicationMethod = 'asl' | 'text' | 'both';

/**
 * User tech level
 */
export type TechLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Accessibility level
 */
export type AccessibilityLevel = 'standard' | 'enhanced' | 'comprehensive';

/**
 * Platform types
 */
export type PlatformType = 'business' | 'job' | 'content' | 'tech';

/**
 * Service status
 */
export type ServiceStatus = 'operational' | 'degraded' | 'offline';

/**
 * Workflow status
 */
export type WorkflowStatus = 'pending' | 'active' | 'completed' | 'failed';

/**
 * Workflow step status
 */
export type WorkflowStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

/**
 * Sync status
 */
export type SyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * Event processing status
 */
export type EventProcessingStatus = 'pending' | 'processed' | 'failed';

/**
 * Accommodation types
 */
export type AccommodationType = 'interpreter' | 'captioning' | 'video-relay' | 'assistive-tech';

/**
 * Formation status
 */
export type FormationStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Document types
 */
export type DocumentType = 'articles' | 'operating-agreement' | 'ein' | 'certificate';

/**
 * US States
 */
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const;

export type USState = typeof US_STATES[number];
