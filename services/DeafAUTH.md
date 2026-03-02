# DeafAuth and PinkSync Integration Guide

## Overview

This document describes the integration between DeafAuth (authentication service) and PinkSync (accessibility preferences service) and how they work together to provide a seamless user experience.

## Integration Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    User Actions                           │
└───────────────┬──────────────────────────┬───────────────┘
                │                          │
        ┌───────▼────────┐        ┌───────▼────────┐
        │   DeafAuth     │        │   PinkSync     │
        │                │        │                │
        │ • Registration │        │ • Preferences  │
        │ • Login        │        │ • Accessibility│
        │ • Profile Mgmt │        │ • Sync         │
        └───────┬────────┘        └───────┬────────┘
                │                          │
                └──────────┬───────────────┘
                           │
                    ┌──────▼──────┐
                    │  Event Bus  │
                    │             │
                    │ • USER_*    │
                    │ • PREFS_*   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │  Database   │
                    └─────────────┘
```

## Integration Scenarios

### 1. User Registration

**Flow**: DeafAuth → Event Bus → PinkSync

When a user registers in DeafAuth:

```typescript
// 1. DeafAuth creates user
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}

// 2. DeafAuth publishes event
Event: USER_REGISTERED
{
  "userId": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "profileId": "profile-uuid"
}

// 3. PinkSync receives event and creates default preferences
Preferences Created:
{
  "userId": "uuid",
  "accessibility": {
    "fontSize": 16,
    "highContrast": false,
    "screenReader": false,
    "captionsEnabled": false,
    "signLanguagePreference": "none"
  },
  "notifications": {
    "email": true,
    "push": true,
    "sms": false
  }
}
```

### 2. Accessibility Settings Update

**Flow**: PinkSync → Event Bus → DeafAuth

When a user updates accessibility settings:

```typescript
// 1. User updates settings in PinkSync
PUT /api/accessibility/:userId
{
  "fontSize": 20,
  "highContrast": true,
  "captionsEnabled": true
}

// 2. PinkSync publishes event
Event: ACCESSIBILITY_SETTINGS_CHANGED
{
  "userId": "uuid",
  "settingsId": "settings-uuid",
  "settings": {
    "fontSize": 20,
    "highContrast": true,
    "captionsEnabled": true
  }
}

// 3. DeafAuth receives event and syncs to profile
Profile Updated:
{
  "preferences": {
    "accessibility": {
      "fontSize": 20,
      "highContrast": true,
      "captionsEnabled": true
    }
  }
}
```

### 3. Profile Update Synchronization

**Flow**: DeafAuth → Event Bus → PinkSync

When a user updates their profile:

```typescript
// 1. User updates profile in DeafAuth
PUT /api/profile/:userId
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Accessibility advocate"
}

// 2. DeafAuth publishes event
Event: USER_PROFILE_UPDATED
{
  "userId": "uuid",
  "profileId": "profile-uuid",
  "fields": ["firstName", "lastName", "bio"],
  "updates": { ... }
}

// 3. PinkSync receives event and triggers sync
// This ensures consistency across services
```

## Event Handlers

### DeafAuth Event Handlers

**UserPreferencesSyncHandler**
- **Subscribes to**: `PREFERENCES_UPDATED`, `ACCESSIBILITY_SETTINGS_CHANGED`
- **Action**: Updates user profile with latest preferences
- **Purpose**: Keep DeafAuth profile in sync with PinkSync preferences

```typescript
class UserPreferencesSyncHandler {
  async handle(event) {
    await profileService.syncPreferences(
      event.userId,
      event.data
    );
  }
}
```

### PinkSync Event Handlers

**UserRegistrationHandler**
- **Subscribes to**: `USER_REGISTERED`
- **Action**: Creates default preferences for new users
- **Purpose**: Initialize accessibility settings

```typescript
class UserRegistrationHandler {
  async handle(event) {
    await preferencesService.createDefaultPreferences(
      event.userId
    );
  }
}
```

**ProfileUpdateHandler**
- **Subscribes to**: `USER_PROFILE_UPDATED`
- **Action**: Triggers sync to ensure data consistency
- **Purpose**: Maintain synchronization across services

```typescript
class ProfileUpdateHandler {
  async handle(event) {
    await preferencesService.triggerSync(event.userId);
  }
}
```

## API Integration

### Cross-Service Communication

Services don't communicate directly via HTTP. Instead, they use the event bus:

**Benefits**:
- **Loose Coupling**: Services are independent
- **Scalability**: Easy to add more services
- **Reliability**: Events can be queued and retried
- **Flexibility**: Services can subscribe to relevant events only

### Client Integration

Clients interact with both services independently:

```javascript
// Authentication flow
const { userId, sessionId } = await fetch('http://deafauth/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// Get user preferences
const preferences = await fetch(`http://pinksync/api/preferences/${userId}`, {
  headers: { Authorization: `Bearer ${sessionId}` }
});

// Update accessibility settings
await fetch(`http://pinksync/api/accessibility/${userId}`, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${sessionId}` },
  body: JSON.stringify({ fontSize: 20, highContrast: true })
});
```

## Data Consistency

### Eventual Consistency

The system uses **eventual consistency**:
- Changes propagate via events
- Brief delay between services (milliseconds)
- Guaranteed eventual consistency

### Conflict Resolution

In case of conflicts:
1. **Last Write Wins**: Most recent update prevails
2. **Timestamps**: All updates include timestamps
3. **Event Ordering**: Events processed in order

## Real-Time Updates

### Supabase Real-Time

For instant updates in the UI:

```javascript
// Subscribe to preference changes
const subscription = supabase
  .from('preferences')
  .on('UPDATE', payload => {
    updateUI(payload.new);
  })
  .subscribe();
```

### Event-Based Updates

Services can also subscribe to events for real-time processing:

```typescript
eventBus.subscribe(EventType.PREFERENCES_UPDATED, async (event) => {
  // Handle real-time update
  await updateCache(event.data);
});
```

## Error Handling

### Event Failures

If an event handler fails:
- Error is logged
- Other handlers continue processing
- Event is stored in event log for debugging

### Service Failures

If a service is down:
- Events can be queued (with external message broker)
- Retries with exponential backoff
- Circuit breaker pattern (can be implemented)

## Testing Integration

### Integration Tests

Test the full flow:

```typescript
describe('User Registration Integration', () => {
  it('should create preferences when user registers', async () => {
    // Register user in DeafAuth
    const user = await deafauth.register({ ... });
    
    // Wait for event processing
    await waitFor(() => {
      const prefs = await pinksync.getPreferences(user.id);
      expect(prefs).toBeDefined();
    });
  });
});
```

### Event Testing

Test event handlers independently:

```typescript
describe('UserPreferencesSyncHandler', () => {
  it('should sync preferences to profile', async () => {
    const handler = new UserPreferencesSyncHandler(profileService);
    await handler.handle(mockEvent);
    expect(profileService.syncPreferences).toHaveBeenCalled();
  });
});
```

## Best Practices

1. **Idempotency**: Event handlers should be idempotent
2. **Validation**: Validate event data before processing
3. **Logging**: Log all event publications and handling
4. **Monitoring**: Monitor event processing times
5. **Documentation**: Document all event types and handlers
