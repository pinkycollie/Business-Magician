# Simple Auth + PinkSync Overlay Architecture

## 1. Architectural Overview

This architecture separates concerns into two distinct layers:

1. **Simple Auth (Core Layer)**: Lightweight, standards-based authentication
1. **PinkSync (Overlay Layer)**: Rich visual accessibility and integration orchestration

```
┌─────────────────────────────────────────────────────────┐
│                  PinkSync Overlay Layer                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Visual Feedback  │  ASL Support  │  Sync Logic │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Accessibility │ Notifications │ State Management │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                   Simple Auth Layer                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Login  │  Logout  │  Token Management  │  MFA  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Password  │  Session  │  API Keys  │  Roles   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 2. Simple Auth Layer

### 2.1 Core Responsibilities

Simple Auth handles only the essential authentication primitives:

- User credential validation
- JWT token generation and validation
- Session management
- Basic role assignment
- Password hashing and verification
- API key generation and validation

### 2.2 Simple Auth Database Schema

```sql
-- Core authentication tables
CREATE TABLE auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  token_hash VARCHAR(255) NOT NULL,
  device_fingerprint VARCHAR(255),
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  role VARCHAR(50) NOT NULL,
  granted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES auth_users(id)
);

CREATE TABLE auth_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  key_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  scopes JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_mfa (
  user_id UUID PRIMARY KEY REFERENCES auth_users(id),
  method VARCHAR(50) NOT NULL,
  secret VARCHAR(255) NOT NULL,
  backup_codes JSONB,
  enabled BOOLEAN NOT NULL DEFAULT false,
  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.3 Simple Auth API Endpoints

|Endpoint          |Method|Purpose        |Request                        |Response                       |
|------------------|------|---------------|-------------------------------|-------------------------------|
|`/auth/register`  |POST  |Create account |`{email, password}`            |`{user_id, email}`             |
|`/auth/login`     |POST  |Authenticate   |`{email, password}`            |`{access_token, refresh_token}`|
|`/auth/logout`    |POST  |End session    |`Authorization: Bearer <token>`|`{success: true}`              |
|`/auth/refresh`   |POST  |Refresh token  |`{refresh_token}`              |`{access_token}`               |
|`/auth/verify`    |GET   |Validate token |`Authorization: Bearer <token>`|`{user_id, roles}`             |
|`/auth/mfa/enroll`|POST  |Enable MFA     |`{method, secret}`             |`{enrolled: true}`             |
|`/auth/mfa/verify`|POST  |Verify MFA code|`{code}`                       |`{verified: true}`             |

### 2.4 Simple Auth Implementation Example

```javascript
// Simple Auth - Core authentication service
class SimpleAuth {
  
  // Register new user
  async register(email, password) {
    // Validate input
    if (!this.isValidEmail(email)) {
      throw new Error('INVALID_EMAIL');
    }
    
    if (!this.isStrongPassword(password)) {
      throw new Error('WEAK_PASSWORD');
    }
    
    // Check if user exists
    const existingUser = await this.db.query(
      'SELECT id FROM auth_users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('USER_EXISTS');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const result = await this.db.query(
      'INSERT INTO auth_users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );
    
    return result.rows[0];
  }
  
  // Login user
  async login(email, password) {
    // Get user
    const result = await this.db.query(
      'SELECT id, email, password_hash, status FROM auth_users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('INVALID_CREDENTIALS');
    }
    
    const user = result.rows[0];
    
    // Check status
    if (user.status !== 'active') {
      throw new Error('ACCOUNT_INACTIVE');
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }
    
    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    
    // Create session
    await this.createSession(user.id, refreshToken);
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.id,
      email: user.email
    };
  }
  
  // Verify token
  async verify(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user roles
      const roles = await this.db.query(
        'SELECT role FROM auth_roles WHERE user_id = $1',
        [decoded.user_id]
      );
      
      return {
        user_id: decoded.user_id,
        roles: roles.rows.map(r => r.role)
      };
    } catch (err) {
      throw new Error('INVALID_TOKEN');
    }
  }
  
  // Generate JWT access token
  generateAccessToken(userId) {
    return jwt.sign(
      { user_id: userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }
  
  // Generate refresh token
  generateRefreshToken(userId) {
    return jwt.sign(
      { user_id: userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }
}
```

## 3. PinkSync Overlay Layer

### 3.1 Overlay Responsibilities

PinkSync intercepts and enhances every auth interaction:

- Visual feedback overlays
- ASL video integration
- Accessibility preference application
- State synchronization across services
- Notification routing
- Security event visualization
- Journey tracking
- Context management

### 3.2 PinkSync Database Schema

```sql
-- PinkSync overlay tables
CREATE TABLE pinksync_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth_users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  preferred_name VARCHAR(100),
  profile_image VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE pinksync_accessibility (
  user_id UUID PRIMARY KEY REFERENCES auth_users(id),
  preferred_communication VARCHAR(50) NOT NULL DEFAULT 'asl',
  visual_alerts BOOLEAN NOT NULL DEFAULT true,
  high_contrast BOOLEAN NOT NULL DEFAULT false,
  notification_preferences JSONB NOT NULL DEFAULT '{}',
  custom_settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE pinksync_visual_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  event_type VARCHAR(100) NOT NULL,
  visual_overlay VARCHAR(50) NOT NULL,
  context JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE pinksync_user_journey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  journey_stage VARCHAR(100) NOT NULL,
  pathway_type VARCHAR(50),
  milestone_data JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE pinksync_sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  event_type VARCHAR(100) NOT NULL,
  source_service VARCHAR(50) NOT NULL,
  target_services JSONB NOT NULL,
  payload JSONB NOT NULL,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE pinksync_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id),
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  asl_video_url VARCHAR(255),
  visual_style VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 3.3 PinkSync Visual Overlay System

```javascript
// PinkSync - Visual overlay orchestrator
class PinkSyncOverlay {
  
  // Initialize overlay for auth event
  async initOverlay(authEvent, userId) {
    // Get user accessibility preferences
    const preferences = await this.getAccessibilityPreferences(userId);
    
    // Determine visual overlay based on event and preferences
    const overlay = this.determineOverlay(authEvent, preferences);
    
    // Record visual state
    await this.recordVisualState(userId, authEvent, overlay);
    
    return overlay;
  }
  
  // Get accessibility preferences
  async getAccessibilityPreferences(userId) {
    const result = await this.db.query(
      `SELECT preferred_communication, visual_alerts, high_contrast, 
              notification_preferences, custom_settings 
       FROM pinksync_accessibility 
       WHERE user_id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Return defaults for new users
      return {
        preferred_communication: 'asl',
        visual_alerts: true,
        high_contrast: false,
        notification_preferences: {},
        custom_settings: {}
      };
    }
    
    return result.rows[0];
  }
  
  // Determine appropriate visual overlay
  determineOverlay(authEvent, preferences) {
    const overlays = {
      'LOGIN_SUCCESS': {
        animation: 'shield-check-green',
        duration: 2000,
        message: 'Login successful',
        asl_video: preferences.preferred_communication === 'asl' ? 
                   '/asl/login-success.mp4' : null,
        haptic: 'success',
        color_scheme: preferences.high_contrast ? 'high-contrast' : 'standard'
      },
      'LOGIN_FAILURE': {
        animation: 'lock-shake-red',
        duration: 3000,
        message: 'Login failed. Please check credentials.',
        asl_video: preferences.preferred_communication === 'asl' ? 
                   '/asl/login-failed.mp4' : null,
        haptic: 'error',
        color_scheme: preferences.high_contrast ? 'high-contrast' : 'standard'
      },
      'MFA_REQUIRED': {
        animation: 'key-pulse-blue',
        duration: 0, // Persistent until dismissed
        message: 'Additional verification required',
        asl_video: preferences.preferred_communication === 'asl' ? 
                   '/asl/mfa-prompt.mp4' : null,
        haptic: 'attention',
        color_scheme: preferences.high_contrast ? 'high-contrast' : 'standard'
      },
      'SESSION_EXPIRING': {
        animation: 'clock-warning-yellow',
        duration: 0,
        message: 'Your session will expire in 5 minutes',
        asl_video: preferences.preferred_communication === 'asl' ? 
                   '/asl/session-expiring.mp4' : null,
        haptic: 'warning',
        color_scheme: preferences.high_contrast ? 'high-contrast' : 'standard'
      },
      'SECURITY_ALERT': {
        animation: 'shield-alert-red',
        duration: 0,
        message: 'Unusual activity detected',
        asl_video: preferences.preferred_communication === 'asl' ? 
                   '/asl/security-alert.mp4' : null,
        haptic: 'alert',
        color_scheme: preferences.high_contrast ? 'high-contrast' : 'standard',
        priority: 'critical'
      }
    };
    
    return overlays[authEvent] || overlays['LOGIN_SUCCESS'];
  }
  
  // Record visual state for analytics
  async recordVisualState(userId, eventType, overlay) {
    await this.db.query(
      `INSERT INTO pinksync_visual_states 
       (user_id, event_type, visual_overlay, context) 
       VALUES ($1, $2, $3, $4)`,
      [userId, eventType, overlay.animation, overlay]
    );
  }
  
  // Sync auth event across ecosystem
  async syncAuthEvent(userId, authEvent, authData) {
    // Determine which services need this sync
    const targetServices = this.getTargetServices(authEvent);
    
    // Create sync event
    await this.db.query(
      `INSERT INTO pinksync_sync_events 
       (user_id, event_type, source_service, target_services, payload) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, authEvent, 'auth', JSON.stringify(targetServices), JSON.stringify(authData)]
    );
    
    // Trigger webhooks for each service
    for (const service of targetServices) {
      await this.triggerWebhook(service, authEvent, authData);
    }
  }
  
  // Get target services for sync
  getTargetServices(authEvent) {
    const syncMap = {
      'LOGIN_SUCCESS': ['fibonrose', '360magicians', 'deafauth'],
      'LOGIN_FAILURE': ['fibonrose'],
      'LOGOUT': ['fibonrose', '360magicians', 'deafauth'],
      'PASSWORD_CHANGED': ['fibonrose', 'notification-service'],
      'MFA_ENABLED': ['fibonrose', 'notification-service'],
      'SECURITY_ALERT': ['fibonrose', 'notification-service', 'admin-dashboard']
    };
    
    return syncMap[authEvent] || [];
  }
  
  // Create visual notification
  async createNotification(userId, notificationType, title, message, priority = 'normal') {
    const preferences = await this.getAccessibilityPreferences(userId);
    
    const visualStyle = this.getVisualStyle(notificationType, preferences);
    const aslVideoUrl = preferences.preferred_communication === 'asl' ? 
                        this.getASLVideo(notificationType) : null;
    
    await this.db.query(
      `INSERT INTO pinksync_notifications 
       (user_id, notification_type, title, message, asl_video_url, visual_style, priority) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, notificationType, title, message, aslVideoUrl, visualStyle, priority]
    );
    
    // If user has visual alerts enabled, trigger real-time notification
    if (preferences.visual_alerts) {
      await this.triggerVisualAlert(userId, {
        title,
        message,
        aslVideoUrl,
        visualStyle,
        priority
      });
    }
  }
}
```

## 4. Integration Flow

### 4.1 Login Flow with PinkSync Overlay

```javascript
// Integrated login endpoint
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Step 1: Simple Auth handles core authentication
    const authResult = await simpleAuth.login(email, password);
    
    // Step 2: PinkSync creates visual overlay
    const overlay = await pinkSync.initOverlay('LOGIN_SUCCESS', authResult.user_id);
    
    // Step 3: PinkSync syncs login event across ecosystem
    await pinkSync.syncAuthEvent(authResult.user_id, 'LOGIN_SUCCESS', {
      timestamp: new Date().toISOString(),
      device: req.headers['user-agent'],
      ip: req.ip
    });
    
    // Step 4: PinkSync creates welcome notification
    await pinkSync.createNotification(
      authResult.user_id,
      'LOGIN_SUCCESS',
      'Welcome back!',
      'You have successfully logged in.',
      'normal'
    );
    
    // Step 5: Return combined response
    res.json({
      status: 'success',
      data: {
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
        user_id: authResult.user_id,
        email: authResult.email
      },
      overlay: overlay,
      message: 'Login successful'
    });
    
  } catch (error) {
    // Handle authentication failure
    const overlay = await pinkSync.initOverlay('LOGIN_FAILURE', null);
    
    res.status(401).json({
      status: 'error',
      message: error.message,
      code: error.message,
      overlay: overlay
    });
  }
});
```

### 4.2 Registration Flow with PinkSync Overlay

```javascript
// Integrated registration endpoint
router.post('/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, accessibilityPreferences } = req.body;
  
  try {
    // Step 1: Simple Auth creates core account
    const authResult = await simpleAuth.register(email, password);
    
    // Step 2: PinkSync creates profile
    await pinkSync.createProfile(authResult.id, {
      first_name: firstName,
      last_name: lastName
    });
    
    // Step 3: PinkSync sets accessibility preferences
    if (accessibilityPreferences) {
      await pinkSync.setAccessibilityPreferences(authResult.id, accessibilityPreferences);
    }
    
    // Step 4: PinkSync creates visual overlay for registration success
    const overlay = await pinkSync.initOverlay('REGISTRATION_SUCCESS', authResult.id);
    
    // Step 5: PinkSync syncs registration across ecosystem
    await pinkSync.syncAuthEvent(authResult.id, 'USER_REGISTERED', {
      timestamp: new Date().toISOString(),
      email: authResult.email
    });
    
    // Step 6: PinkSync creates welcome notification with ASL video
    await pinkSync.createNotification(
      authResult.id,
      'WELCOME',
      'Welcome to Deaf First!',
      'Your account has been created successfully. Let\'s get started!',
      'high'
    );
    
    // Step 7: Return response with overlay
    res.json({
      status: 'success',
      data: {
        user_id: authResult.id,
        email: authResult.email
      },
      overlay: overlay,
      message: 'Account created successfully'
    });
    
  } catch (error) {
    const overlay = await pinkSync.initOverlay('REGISTRATION_FAILURE', null);
    
    res.status(400).json({
      status: 'error',
      message: error.message,
      code: error.message,
      overlay: overlay
    });
  }
});
```

### 4.3 MFA Flow with Visual Guidance

```javascript
// MFA verification with PinkSync visual guidance
router.post('/auth/mfa/verify', async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id; // From JWT middleware
  
  try {
    // Step 1: Simple Auth verifies MFA code
    const mfaValid = await simpleAuth.verifyMFA(userId, code);
    
    if (!mfaValid) {
      throw new Error('INVALID_MFA_CODE');
    }
    
    // Step 2: PinkSync creates success overlay
    const overlay = await pinkSync.initOverlay('MFA_SUCCESS', userId);
    
    // Step 3: Generate final auth tokens
    const accessToken = simpleAuth.generateAccessToken(userId);
    const refreshToken = simpleAuth.generateRefreshToken(userId);
    
    // Step 4: PinkSync syncs MFA success
    await pinkSync.syncAuthEvent(userId, 'MFA_VERIFIED', {
      timestamp: new Date().toISOString()
    });
    
    res.json({
      status: 'success',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken
      },
      overlay: overlay,
      message: 'Verification successful'
    });
    
  } catch (error) {
    const overlay = await pinkSync.initOverlay('MFA_FAILURE', userId);
    
    res.status(401).json({
      status: 'error',
      message: 'Invalid verification code',
      code: 'INVALID_MFA_CODE',
      overlay: overlay
    });
  }
});
```

## 5. Visual Overlay Response Format

### 5.1 Standard Overlay Response

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  },
  "overlay": {
    "animation": "shield-check-green",
    "duration": 2000,
    "message": "Login successful",
    "asl_video": "/asl/login-success.mp4",
    "haptic": "success",
    "color_scheme": "standard",
    "visual_elements": {
      "icon": "✓",
      "color": "#10B981",
      "position": "center",
      "fade_out": true
    }
  },
  "message": "Login successful"
}
```

### 5.2 Error Overlay Response

```json
{
  "status": "error",
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "overlay": {
    "animation": "lock-shake-red",
    "duration": 3000,
    "message": "Login failed. Please check credentials.",
    "asl_video": "/asl/login-failed.mp4",
    "haptic": "error",
    "color_scheme": "standard",
    "visual_elements": {
      "icon": "✗",
      "color": "#EF4444",
      "position": "center",
      "shake": true
    },
    "suggested_actions": [
      {
        "label": "Reset Password",
        "action": "navigate",
        "target": "/auth/password/reset"
      },
      {
        "label": "Try Again",
        "action": "retry",
        "target": null
      }
    ]
  }
}
```

## 6. Frontend Integration

### 6.1 React Component Example

```jsx
// LoginWithOverlay component
import React, { useState } from 'react';
import { VisualOverlay } from './components/VisualOverlay';
import { ASLVideo } from './components/ASLVideo';

function LoginWithOverlay() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [overlay, setOverlay] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      // Display PinkSync overlay
      setOverlay(result.overlay);

      if (result.status === 'success') {
        // Store tokens
        localStorage.setItem('access_token', result.data.access_token);
        localStorage.setItem('refresh_token', result.data.refresh_token);

        // Wait for overlay animation
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, result.overlay.duration);
      }
    } catch (error) {
      setOverlay({
        animation: 'error-pulse-red',
        message: 'Connection error. Please try again.',
        haptic: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {overlay && (
        <>
          <VisualOverlay 
            animation={overlay.animation}
            duration={overlay.duration}
            message={overlay.message}
            visualElements={overlay.visual_elements}
          />
          
          {overlay.asl_video && (
            <ASLVideo 
              src={overlay.asl_video}
              autoPlay={true}
            />
          )}
        </>
      )}
    </div>
  );
}
```

## 7. Implementation Checklist

### 7.1 Simple Auth Layer ✅

- [ ] User registration endpoint
- [ ] Login endpoint with JWT generation
- [ ] Logout endpoint with session cleanup
- [ ] Token refresh endpoint
- [ ] Token verification middleware
- [ ] Password hashing (bcrypt/Argon2)
- [ ] MFA enrollment endpoint
- [ ] MFA verification endpoint
- [ ] API key generation endpoint
- [ ] Role assignment system
- [ ] Basic rate limiting (60 req/min)

### 7.2 PinkSync Overlay Layer ✅

- [ ] Accessibility preferences system
- [ ] Visual overlay determination logic
- [ ] Overlay response formatting
- [ ] ASL video integration
- [ ] Notification system with visual priority
- [ ] Sync event dispatcher
- [ ] Journey tracking initialization
- [ ] Visual state recording
- [ ] Webhook integration for ecosystem sync
- [ ] Real-time visual alert system

### 7.3 Frontend Components ✅

- [ ] VisualOverlay component
- [ ] ASLVideo component
- [ ] AccessibilitySettings component
- [ ] NotificationCenter component
- [ ] SecurityAlert component
- [ ] SessionTimer component

### 7.4 Testing ✅

- [ ] Unit tests for Simple Auth
- [ ] Unit tests for PinkSync overlay logic
- [ ] Integration tests for combined flow
- [ ] Accessibility testing with deaf users
- [ ] Visual feedback user testing
- [ ] Performance testing under load

## 8. Deployment Strategy

### 8.1 Phase 1: Simple Auth Foundation

Deploy basic authentication with minimal overlays:

- Core auth endpoints operational
- Basic visual feedback (success/error)
- Essential session management

### 8.2 Phase 2: PinkSync Overlay Enhancement

Add sophisticated visual layers:

- Full overlay system activation
- ASL video integration
- Advanced accessibility features
- Ecosystem sync capabilities

### 8.3 Phase 3: Optimization

Refine based on user feedback:

- Animation performance optimization
- ASL video quality improvements
- Overlay timing adjustments
- Accessibility preference expansion

## 9. Benefits of This Architecture

### 9.1 Separation of Concerns

- **Simple Auth**: Focus on security and reliability
- **PinkSync**: Focus on experience and accessibility
- Clear boundaries enable independent development and testing

### 9.2 Scalability

- Auth layer scales independently of overlay processing
- Visual overlays can be cached and optimized separately
- Ecosystem sync happens asynchronously

### 9.3 Maintainability

- Auth updates don’t break visual experience
- Overlay enhancements don’t impact security
- Clear API contracts between layers

### 9.4 Accessibility

- Visual feedback is not an afterthought—it’s architectural
- ASL integration is native to every auth interaction
- Deaf First principles embedded at system level

## 10. Key Principles

1. **Simple Auth is stateless**: Only handles authentication primitives
1. **PinkSync is contextual**: Enriches with user preferences and visual state
1. **Overlays are non-blocking**: Auth completes before overlay processing
1. **Visual feedback is mandatory**: Every auth event has a corresponding overlay
1. **ASL is primary**: Visual communication comes before text when preference is set