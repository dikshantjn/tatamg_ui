# Firebase Cloud Messaging (FCM) Implementation

This document describes the FCM implementation for push notifications in the Vedika Healthcare application.

## Overview

The FCM implementation provides:
- **Foreground notifications**: Custom popup notifications when the app is active
- **Background notifications**: Browser notifications when the app is in background
- **Token management**: Automatic token generation, saving, and cleanup
- **Permission handling**: Request and manage notification permissions

## Files Structure

```
src/
├── firebase/
│   └── config.js                 # Firebase configuration with FCM setup
├── services/User/FCM/
│   ├── fcm.service.js           # API service for FCM token management
│   └── README.md               # This documentation
├── components/ui/
│   └── NotificationPopup.js     # Custom notification popup component
├── hooks/
│   └── useFCM.js              # Custom hook for FCM management
└── App.js                      # Main app with FCM integration

public/
└── firebase-messaging-sw.js    # Service worker for background notifications
```

## Setup Instructions

### 1. Firebase Configuration

Update the VAPID key in `src/firebase/config.js`:

```javascript
const vapidKey = "YOUR_ACTUAL_VAPID_KEY_HERE";
```

### 2. Backend API Endpoints

Ensure your backend has these endpoints:

```javascript
POST /api/fcm/save-token
PUT /api/fcm/update-token  
DELETE /api/fcm/remove-token?userId={userId}
```

### 3. Service Worker

The service worker (`public/firebase-messaging-sw.js`) handles:
- Background message reception
- Notification display
- Click handling
- Action buttons

## Usage

### Automatic Initialization

FCM is automatically initialized when:
1. User is authenticated (`userType === 'user'`)
2. Browser supports notifications
3. Permission is granted

### Manual Control

```javascript
import { useFCM } from './hooks/useFCM';

const {
  fcmToken,
  permission,
  currentNotification,
  isInitialized,
  initializeFCM,
  clearNotification,
  handleNotificationAction,
  removeFCMToken
} = useFCM();
```

## Notification Types

The system supports different notification types with appropriate styling:

- `success` / `completed` - Green theme
- `error` / `failed` - Red theme  
- `warning` / `postponed` - Orange theme
- `info` (default) - Blue theme

## Backend Integration

Your backend should send notifications with this structure:

```javascript
await sendNotification(patient.fcmToken, title, body, data, type, { userId: patient.userId });
```

Where:
- `fcmToken`: User's FCM token
- `title`: Notification title
- `body`: Notification message
- `data`: Additional data object
- `type`: Notification type for styling
- `{ userId: patient.userId }`: User identification

## Features

### Foreground Notifications
- Custom popup with slide animation
- Auto-dismiss after 5 seconds
- Action buttons (View Details, Dismiss)
- Progress bar showing remaining time

### Background Notifications
- Browser native notifications
- Action buttons (View Details, Dismiss)
- Click handling to navigate to relevant pages
- Vibration and sound support

### Token Management
- Automatic token generation on login
- Token saving/updating to backend
- Token cleanup on logout
- Error handling and retry logic

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Limited support (iOS Safari has restrictions)
- **Edge**: Full support

## Security Considerations

1. **VAPID Key**: Keep your VAPID key secure
2. **Token Storage**: FCM tokens are stored securely in backend
3. **Permission**: Always request permission before sending notifications
4. **Cleanup**: Remove tokens on logout to prevent unauthorized notifications

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check browser notification settings
   - Ensure HTTPS is used (required for notifications)

2. **Token Generation Failed**
   - Verify VAPID key is correct
   - Check service worker registration
   - Ensure Firebase project is properly configured

3. **Notifications Not Received**
   - Check FCM token is saved to backend
   - Verify backend is sending to correct token
   - Check browser console for errors

### Debug Mode

Enable debug logging by checking browser console for FCM-related messages:
- `🚀 Initializing FCM...`
- `✅ FCM token obtained`
- `📱 Received foreground message`
- `🎯 Notification clicked`

## Testing

### Test Notification Payload

```javascript
{
  notification: {
    title: "Test Notification",
    body: "This is a test message"
  },
  data: {
    type: "info",
    actionUrl: "/notifications",
    notificationId: "test-123"
  }
}
```

## Future Enhancements

- [ ] Notification history integration
- [ ] Custom notification sounds
- [ ] Rich media notifications
- [ ] Notification scheduling
- [ ] Analytics and tracking
