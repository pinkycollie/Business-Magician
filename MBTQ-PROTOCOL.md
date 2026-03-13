# MBTQ.dev Protocol Integration

The **mbtq.dev protocol** is a comprehensive suite of services designed specifically for the deaf community, providing accessible authentication, real-time communication, and AI-powered analytics. This document outlines the integration of the three core protocol components with the Business Magician platform.

## Overview

The mbtq.dev protocol consists of three main components:

1. **DeafAuth**: Accessible authentication system
2. **PinkSync**: Real-time communication and interpreter scheduling
3. **FibonRose**: AI-powered business analytics and matching algorithms

## 1. DeafAuth - Accessible Authentication

### Purpose
DeafAuth provides an authentication system designed with accessibility as the primary focus, ensuring deaf users have seamless, secure access to the platform.

### Features
- Visual feedback for all authentication steps
- ASL video instructions for account setup
- Alternative to audio-based 2FA (visual/haptic verification)
- Accessibility-first password recovery
- Support for common assistive technologies

### Integration

```typescript
// DeafAuth Configuration
import { DeafAuthClient } from '@mbtq/deafauth';

const deafAuth = new DeafAuthClient({
  clientId: process.env.DEAFAUTH_CLIENT_ID,
  clientSecret: process.env.DEAFAUTH_CLIENT_SECRET,
  redirectUri: 'https://your-app.vr4deaf.org/auth/callback',
  scopes: ['profile', 'business', 'vr_services']
});

// Initialize authentication
export async function authenticateUser(credentials) {
  try {
    const result = await deafAuth.authenticate({
      username: credentials.username,
      password: credentials.password,
      accessibilityMode: 'visual' // 'visual', 'haptic', or 'standard'
    });
    
    return {
      token: result.accessToken,
      user: result.user,
      preferences: result.accessibilityPreferences
    };
  } catch (error) {
    // Handle authentication errors with visual feedback
    throw new AccessibleAuthError(error);
  }
}
```

### API Endpoints

- **POST** `/auth/login` - Visual-first login
- **POST** `/auth/register` - Registration with ASL guidance
- **POST** `/auth/verify` - Visual/haptic 2FA verification
- **GET** `/auth/accessibility-preferences` - User accessibility settings
- **PUT** `/auth/accessibility-preferences` - Update preferences

### Environment Variables

```env
DEAFAUTH_CLIENT_ID=your-client-id
DEAFAUTH_CLIENT_SECRET=your-client-secret
DEAFAUTH_API_URL=https://auth.mbtq.dev
```

## 2. PinkSync - Real-Time Communication

### Purpose
PinkSync enables real-time communication support, including interpreter scheduling, ASL video calls, and live captioning services.

### Features
- Real-time interpreter scheduling
- ASL video call integration
- Live captioning and transcription
- Translation session management
- Accessibility preferences sync across devices
- Emergency communication protocols

### Integration

```typescript
// PinkSync Configuration
import { PinkSyncClient } from '@mbtq/pinksync';

const pinkSync = new PinkSyncClient({
  apiKey: process.env.PINKSYNC_API_KEY,
  environment: process.env.NODE_ENV
});

// Schedule an interpreter
export async function scheduleInterpreter(request) {
  return await pinkSync.scheduling.create({
    userId: request.userId,
    businessPhase: request.businessPhase, // 'idea', 'build', 'grow', 'manage'
    preferredLanguage: request.language, // 'ASL', 'SEE', 'PSE'
    duration: request.duration,
    topics: request.topics,
    specialties: request.specialties,
    scheduledTime: request.scheduledTime
  });
}

// Start a video session
export async function startVideoSession(sessionId) {
  return await pinkSync.video.start({
    sessionId,
    features: {
      liveCaption: true,
      recording: true,
      transcription: true
    }
  });
}
```

### API Endpoints

- **GET** `/api/pinksync/translators` - List available interpreters
- **POST** `/api/pinksync/sessions/schedule` - Schedule interpreter session
- **GET** `/api/pinksync/sessions/:id` - Get session details
- **PUT** `/api/pinksync/sessions/:id` - Update session
- **DELETE** `/api/pinksync/sessions/:id` - Cancel session
- **POST** `/api/pinksync/video/start` - Start video session
- **GET** `/api/pinksync/preferences` - Get communication preferences
- **PUT** `/api/pinksync/preferences` - Update communication preferences

### Environment Variables

```env
PINKSYNC_API_KEY=your-pinksync-api-key
PINKSYNC_API_URL=https://sync.mbtq.dev
```

## 3. FibonRose - AI-Powered Analytics

### Purpose
FibonRose provides AI-powered business analytics, matching algorithms, and decision support tailored for deaf entrepreneurs.

### Features
- Business opportunity matching
- VR service recommendations
- Market analysis for deaf-owned businesses
- Financial forecasting and planning
- Success probability algorithms
- Deaf-specific market insights
- Accessibility ROI calculations

### Integration

```typescript
// FibonRose Configuration
import { FibonRoseClient } from '@mbtq/fibonrose';

const fibonRose = new FibonRoseClient({
  apiKey: process.env.FIBONROSE_API_KEY,
  model: 'business-v2'
});

// Analyze business opportunity
export async function analyzeBusinessIdea(businessPlan) {
  return await fibonRose.analyze({
    industry: businessPlan.industry,
    location: businessPlan.location,
    targetMarket: businessPlan.targetMarket,
    accessibility: {
      deafOwned: true,
      accessibilityFeatures: businessPlan.accessibilityFeatures
    },
    financials: businessPlan.financials,
    vrSupport: businessPlan.vrSupport
  });
}

// Get recommendations
export async function getBusinessRecommendations(userId, context) {
  return await fibonRose.recommendations.get({
    userId,
    businessPhase: context.phase,
    currentChallenges: context.challenges,
    goals: context.goals,
    vrEligibility: context.vrEligibility
  });
}
```

### API Endpoints

- **POST** `/api/fibonrose/analyze` - Analyze business idea
- **POST** `/api/fibonrose/recommendations` - Get personalized recommendations
- **POST** `/api/fibonrose/match` - Match with opportunities/services
- **GET** `/api/fibonrose/insights/:businessId` - Get business insights
- **POST** `/api/fibonrose/forecast` - Financial forecasting
- **GET** `/api/fibonrose/market-analysis` - Market analysis for deaf entrepreneurs

### Environment Variables

```env
FIBONROSE_API_KEY=your-fibonrose-api-key
FIBONROSE_API_URL=https://analytics.mbtq.dev
```

## Complete Integration Example

### Server-side Integration (Express.js)

```typescript
// server/services/mbtqIntegration.ts
import { DeafAuthClient } from '@mbtq/deafauth';
import { PinkSyncClient } from '@mbtq/pinksync';
import { FibonRoseClient } from '@mbtq/fibonrose';

export class MBTQIntegration {
  private deafAuth: DeafAuthClient;
  private pinkSync: PinkSyncClient;
  private fibonRose: FibonRoseClient;

  constructor() {
    this.deafAuth = new DeafAuthClient({
      clientId: process.env.DEAFAUTH_CLIENT_ID!,
      clientSecret: process.env.DEAFAUTH_CLIENT_SECRET!
    });

    this.pinkSync = new PinkSyncClient({
      apiKey: process.env.PINKSYNC_API_KEY!
    });

    this.fibonRose = new FibonRoseClient({
      apiKey: process.env.FIBONROSE_API_KEY!
    });
  }

  // Unified user session with all protocol components
  async createUserSession(credentials: any) {
    // Authenticate with DeafAuth
    const authResult = await this.deafAuth.authenticate(credentials);
    
    // Load PinkSync preferences
    const commPreferences = await this.pinkSync.preferences.get(authResult.user.id);
    
    // Get FibonRose recommendations
    const recommendations = await this.fibonRose.recommendations.get({
      userId: authResult.user.id,
      businessPhase: authResult.user.businessPhase
    });

    return {
      auth: authResult,
      communication: commPreferences,
      analytics: recommendations
    };
  }

  // Integrated business support workflow
  async supportBusinessJourney(userId: string, phase: string) {
    // Schedule interpreter via PinkSync
    const interpreterSession = await this.pinkSync.scheduling.findAvailable({
      userId,
      businessPhase: phase,
      specialties: ['Business Planning', 'Financial Planning']
    });

    // Get AI recommendations via FibonRose
    const insights = await this.fibonRose.analyze({
      userId,
      phase,
      includeMarketData: true
    });

    return {
      interpreterSupport: interpreterSession,
      aiInsights: insights
    };
  }
}

export const mbtqIntegration = new MBTQIntegration();
```

### Client-side Integration (React)

```typescript
// client/src/hooks/useMBTQProtocol.ts
import { useState, useEffect } from 'react';

export function useMBTQProtocol() {
  const [authState, setAuthState] = useState(null);
  const [commPreferences, setCommPreferences] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Initialize protocol components
    const initializeProtocol = async () => {
      try {
        const response = await fetch('/api/mbtq/session');
        const data = await response.json();
        
        setAuthState(data.auth);
        setCommPreferences(data.communication);
        setAnalytics(data.analytics);
      } catch (error) {
        console.error('Failed to initialize MBTQ protocol:', error);
      }
    };

    initializeProtocol();
  }, []);

  return {
    auth: authState,
    communication: commPreferences,
    analytics,
    isReady: authState && commPreferences && analytics
  };
}
```

## Cloud Infrastructure Integration

### Vercel (Frontend)
- Hosts the React frontend application
- Provides serverless functions for API routes
- CDN for fast global access
- Automatic deployments from GitHub

### AWS (Video Processing)
- S3 for storing ASL video content
- MediaConvert for video transcoding
- CloudFront for video delivery
- Lambda for video processing triggers

### Google Cloud/Firebase
- Firestore for real-time data synchronization
- Cloud Storage for document management
- Cloud Functions for background processing
- Firebase Authentication as fallback

## Security Considerations

1. **Authentication**: All API calls require valid DeafAuth tokens
2. **Encryption**: TLS 1.3 for all communications
3. **Privacy**: HIPAA-compliant data handling for VR services
4. **Accessibility**: WCAG 2.1 AAA compliance
5. **Rate Limiting**: Implemented across all protocol endpoints

## Monitoring and Analytics

Track protocol usage and performance:

```typescript
// Monitor protocol health
const protocolHealth = await mbtqIntegration.getHealthStatus();

// Track usage metrics
const metrics = {
  authRequests: protocolHealth.deafAuth.requests,
  activeInterpreterSessions: protocolHealth.pinkSync.activeSessions,
  analyticsQueries: protocolHealth.fibonRose.queries
};
```

## Support and Resources

- **Protocol Documentation**: [mbtq.dev/docs](https://mbtq.dev/docs)
- **API Reference**: [mbtq.dev/api](https://mbtq.dev/api)
- **Support**: support@mbtq.dev
- **Status Page**: [status.mbtq.dev](https://status.mbtq.dev)

## Version Information

- **DeafAuth**: v2.1.0
- **PinkSync**: v1.8.0
- **FibonRose**: v1.5.0
- **Protocol Version**: 2.0

## Changelog

### Version 2.0 (Current)
- Unified authentication across all services
- Real-time communication improvements
- Enhanced AI analytics for deaf entrepreneurs
- Full integration with VR4Deaf platform

### Version 1.0
- Initial protocol release
- Basic authentication and communication
- Foundation analytics services
