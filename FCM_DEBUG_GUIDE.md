# 🔧 FCM Token Debugging Guide

## 🚀 Enhanced Debugging Features Added

I've added comprehensive debugging to help identify why FCM tokens aren't being saved during login.

## 📋 Debug Steps

### 1. **Check Browser Console During Login**

When you login, you should see these logs in sequence:

```
🔔 Attempting to save FCM token after login for userId: [USER_ID]
🔑 Firebase Config: Getting FCM token...
🔑 Firebase Config: messagingSupported: true/false
🔑 Firebase Config: messaging: true/false
🔑 Firebase Config: Registering service worker...
✅ Firebase Config: Service worker registered: [registration object]
🔑 Firebase Config: Getting token with VAPID key...
🔑 Firebase Config: VAPID key: [key preview]...
✅ Firebase Config: FCM Token obtained: [token preview]...
💾 FCM Service: Saving FCM token for userId: [USER_ID]
💾 FCM Service: Token preview: [token preview]...
💾 FCM Service: API URL: [full URL]
💾 FCM Service: Request payload: {userId: "...", fcmToken: "..."}
💾 FCM Service: Auth headers: [headers object]
✅ FCM Service: Token saved successfully: [response data]
```

### 2. **Manual Testing (Browser Console)**

After login, open browser console and run:

```javascript
// Test manual FCM token save
window.authService.manualSaveFCMToken()
```

This will trigger the FCM token saving process manually and show detailed logs.

### 3. **Check Environment Variables**

Make sure your `.env` file has:

```env
VAPIDKEY=your_vapid_key_here
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. **Common Issues & Solutions**

#### **Issue: "FCM not supported"**
- **Cause**: Browser doesn't support FCM
- **Solution**: Use Chrome/Edge for testing

#### **Issue: "Service Worker not supported"**
- **Cause**: Browser doesn't support service workers
- **Solution**: Use HTTPS or localhost

#### **Issue: "VAPIDKEY not found"**
- **Cause**: Missing environment variable
- **Solution**: Add VAPIDKEY to .env file

#### **Issue: "No FCM token available"**
- **Cause**: Permission denied or FCM not initialized
- **Solution**: Check notification permission

#### **Issue: "Failed to save FCM token"**
- **Cause**: Backend API error
- **Solution**: Check network tab for API response

### 5. **API Endpoint Testing**

Test your backend API directly:

```bash
# Test save token endpoint
curl -X POST http://localhost:5000/api/fcm/save-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId": "test_user", "fcmToken": "test_token"}'
```

### 6. **Network Tab Debugging**

1. Open DevTools → Network tab
2. Login to your app
3. Look for requests to `/fcm/save-token`
4. Check:
   - Request payload
   - Response status
   - Response data
   - Headers

### 7. **Service Worker Debugging**

1. Open DevTools → Application tab
2. Go to Service Workers
3. Check if `firebase-messaging-sw.js` is registered
4. Look for any errors

### 8. **Firebase Console Debugging**

1. Go to Firebase Console
2. Check Cloud Messaging section
3. Verify your app is registered
4. Check for any errors

## 🔍 What to Look For

### **Successful Flow:**
```
✅ All logs appear in sequence
✅ No error messages
✅ API returns 200 status
✅ Token is saved to backend
```

### **Failed Flow:**
```
❌ Missing logs indicate where it fails
❌ Error messages show specific issues
❌ API returns error status
❌ Network requests fail
```

## 🛠️ Quick Fixes

### **If FCM token is null:**
```javascript
// Check notification permission
console.log('Permission:', Notification.permission);

// Request permission manually
Notification.requestPermission().then(permission => {
  console.log('New permission:', permission);
});
```

### **If API call fails:**
```javascript
// Check auth token
console.log('Auth token:', localStorage.getItem('authToken'));

// Check user ID
console.log('User ID:', localStorage.getItem('userId'));
```

## 📞 Next Steps

1. **Login to your app**
2. **Check browser console for logs**
3. **Run manual test**: `window.authService.manualSaveFCMToken()`
4. **Share the console output** so I can identify the exact issue

The enhanced debugging will show exactly where the FCM token saving process is failing!
