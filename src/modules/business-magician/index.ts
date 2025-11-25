/**
 * Business Magician Module
 * 
 * Comprehensive module for business development and management services.
 * This module provides:
 * - Business formation services
 * - Business analytics
 * - Lifecycle phase management
 * - Business tools and resources
 * 
 * Part of the 360 Magicians ecosystem from Business Magician.
 * 
 * @module business-magician
 */

// Re-export services from existing server implementations
export { pinkSyncService } from '../../../server/services/pinkSyncService';

/**
 * Business Magician Configuration
 */
export interface BusinessMagicianConfig {
  /** Whether AI-powered features are enabled */
  aiEnabled: boolean;
  /** Default business formation provider */
  defaultFormationProvider: 'northwest' | 'other';
  /** Whether analytics are enabled */
  analyticsEnabled: boolean;
  /** Business lifecycle phases */
  lifecyclePhases: LifecyclePhase[];
}

/**
 * Business Lifecycle Phase
 */
export interface LifecyclePhase {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  tasks?: Task[];
  tools?: Tool[];
}

/**
 * Business Task
 */
export interface Task {
  id: number;
  phaseId: number;
  name: string;
  description: string;
  order: number;
  hasASLVideo: boolean;
  aslVideoUrl?: string;
  subtasks?: Subtask[];
}

/**
 * Task Subtask
 */
export interface Subtask {
  id: number;
  taskId: number;
  name: string;
  order: number;
}

/**
 * Business Tool
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'ideation' | 'analytics' | 'finance' | 'planning' | 'formation' | 'marketing';
  phaseId?: number;
  toolType: 'AI' | 'API' | 'Manual';
  actionText: string;
  actionUrl: string;
}

/**
 * Business Formation Request
 */
export interface BusinessFormationRequest {
  businessName: string;
  entityType: 'LLC' | 'Corporation' | 'Partnership' | 'Sole Proprietorship';
  state: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  registeredAgent?: boolean;
  expeditedProcessing?: boolean;
}

/**
 * Business Formation Status
 */
export interface BusinessFormationStatus {
  id: string;
  businessName: string;
  entityType: string;
  state: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  submittedDate: Date;
  estimatedCompletionDate?: Date;
  completedDate?: Date;
  documents?: FormationDocument[];
}

/**
 * Formation Document
 */
export interface FormationDocument {
  id: number;
  name: string;
  documentUrl: string;
  documentType: 'articles' | 'operating-agreement' | 'ein' | 'certificate';
  dateIssued?: Date;
}

/**
 * Business Analytics Request
 */
export interface AnalyticsRequest {
  businessType: string;
  industry: string;
  targetMarket: string;
  competitorUrls?: string[];
}

/**
 * Business Analytics Result
 */
export interface AnalyticsResult {
  id: string;
  businessType: string;
  industry: string;
  targetMarket: string;
  insights: {
    marketPotential: 'Low' | 'Medium' | 'High';
    competitionLevel: 'Low' | 'Medium' | 'High';
    growthOpportunity: 'Weak' | 'Moderate' | 'Strong';
    recommendedActions: string[];
  };
  timestamp: Date;
}

/**
 * Default Business Magician configuration
 */
export const defaultBusinessMagicianConfig: BusinessMagicianConfig = {
  aiEnabled: true,
  defaultFormationProvider: 'northwest',
  analyticsEnabled: true,
  lifecyclePhases: [
    {
      id: 'idea',
      name: 'Idea Phase',
      slug: 'idea',
      description: 'Generate and validate your business idea',
      order: 1
    },
    {
      id: 'build',
      name: 'Build Phase',
      slug: 'build',
      description: 'Form and structure your business',
      order: 2
    },
    {
      id: 'grow',
      name: 'Grow Phase',
      slug: 'grow',
      description: 'Scale and expand your business',
      order: 3
    },
    {
      id: 'manage',
      name: 'Manage Phase',
      slug: 'manage',
      description: 'Optimize and maintain your business',
      order: 4
    }
  ]
};

/**
 * Business Magician module version
 */
export const BUSINESS_MAGICIAN_VERSION = '1.0.0';

/**
 * Entity types available for formation
 */
export const ENTITY_TYPES = [
  'LLC',
  'Corporation',
  'Partnership',
  'Sole Proprietorship'
] as const;

/**
 * US States for business formation
 */
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const;

/**
 * Tool categories
 */
export const TOOL_CATEGORIES = [
  'ideation',
  'analytics',
  'finance',
  'planning',
  'formation',
  'marketing'
] as const;
