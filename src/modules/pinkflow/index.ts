/**
 * PinkFlow Module
 * 
 * Automation and workflow orchestration module.
 * This module provides:
 * - Workflow creation and management
 * - Event processing
 * - Integration orchestration
 * - Sync operations between services
 * 
 * @module pinkflow
 */

// Re-export services from existing server implementations
export { pinkSyncHub, type PinkSyncWorkflow, type PinkSyncWorkflowStep } from '../../../server/services/integrations/pinkSyncHub';

/**
 * PinkFlow Configuration
 */
export interface PinkFlowConfig {
  /** Whether automation is enabled */
  automationEnabled: boolean;
  /** Event processing settings */
  eventProcessing: {
    enabled: boolean;
    batchSize: number;
    processingInterval: number; // in milliseconds
  };
  /** Sync settings */
  syncSettings: {
    autoSync: boolean;
    syncInterval: number; // in milliseconds
    retryAttempts: number;
  };
}

/**
 * Workflow Definition
 */
export interface WorkflowDefinition {
  id?: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  owner: {
    userId: string;
    type: 'deaf' | 'hearing';
    preferredLanguage: 'ASL' | 'English' | 'Spanish' | 'Other';
    communicationPreferences: Record<string, any>;
  };
  metadata?: Record<string, any>;
}

/**
 * Workflow Step
 */
export interface WorkflowStep {
  id?: string;
  name: string;
  description: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  service: 'northwest' | 'legalshield' | 'mux' | 'pinksync' | 'yeoman' | 'internal';
  action: string;
  parameters: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  isUserActionRequired?: boolean;
  userActionDescription?: string;
  nextSteps?: string[];
}

/**
 * Workflow Status
 */
export interface WorkflowStatus {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * Integration Event
 */
export interface IntegrationEvent {
  id: string;
  eventType: string;
  source: string;
  data: Record<string, any>;
  timestamp: Date;
  processingStatus: 'pending' | 'processed' | 'failed';
  processingResult?: Record<string, any>;
  error?: string;
}

/**
 * Sync Operation
 */
export interface SyncOperation {
  id: string;
  type: 'business-vr' | 'pinksync-platform' | 'full';
  sourceId: string;
  targetId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  syncedData?: Record<string, any>;
  syncedAt?: Date;
  error?: string;
}

/**
 * Webhook Registration
 */
export interface WebhookRegistration {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

/**
 * Integration
 */
export interface Integration {
  id: string;
  name: string;
  type: 'business-formation' | 'legal-services' | 'video-processing' | 'accessibility' | 'documentation';
  status: 'connected' | 'disconnected' | 'error';
  configuration?: Record<string, any>;
  connectedAt?: Date;
}

/**
 * Default PinkFlow configuration
 */
export const defaultPinkFlowConfig: PinkFlowConfig = {
  automationEnabled: true,
  eventProcessing: {
    enabled: true,
    batchSize: 10,
    processingInterval: 1000 // 1 second
  },
  syncSettings: {
    autoSync: true,
    syncInterval: 300000, // 5 minutes
    retryAttempts: 3
  }
};

/**
 * PinkFlow module version
 */
export const PINKFLOW_VERSION = '1.0.0';

/**
 * Available services for workflow steps
 */
export const WORKFLOW_SERVICES = [
  'northwest',
  'legalshield',
  'mux',
  'pinksync',
  'yeoman',
  'internal'
] as const;

/**
 * Event types
 */
export const EVENT_TYPES = {
  BUSINESS: {
    FORMATION_SUBMITTED: 'business.formation.submitted',
    FORMATION_COMPLETED: 'business.formation.completed',
    FORMATION_FAILED: 'business.formation.failed',
    ANALYTICS_GENERATED: 'business.analytics.generated'
  },
  V4DEAF: {
    PROGRESS_UPDATED: 'v4deaf.progress.updated',
    ACCOMMODATION_REQUESTED: 'v4deaf.accommodation.requested',
    ACCOMMODATION_APPROVED: 'v4deaf.accommodation.approved'
  },
  PINKSYNC: {
    SESSION_SCHEDULED: 'pinksync.session.scheduled',
    SESSION_COMPLETED: 'pinksync.session.completed',
    TRANSFORMATION_COMPLETED: 'pinksync.transformation.completed'
  },
  VIDEO: {
    UPLOADED: 'video.uploaded',
    PROCESSED: 'video.processed',
    CAPTIONED: 'video.captioned'
  },
  LEGAL: {
    CONSULTATION_SCHEDULED: 'legal.consultation.scheduled',
    CONSULTATION_COMPLETED: 'legal.consultation.completed',
    DOCUMENT_GENERATED: 'legal.document.generated'
  }
} as const;

/**
 * Integration types
 */
export const INTEGRATION_TYPES = [
  'business-formation',
  'legal-services',
  'video-processing',
  'accessibility',
  'documentation'
] as const;

/**
 * Sync types
 */
export const SYNC_TYPES = [
  'business-vr',
  'pinksync-platform',
  'full'
] as const;
