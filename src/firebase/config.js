import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA4RBpkDfIFjPPoiQyP6LkHB_cILz-tekU",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "vedikahealthcare-59980.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "vedikahealthcare-59980",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "vedikahealthcare-59980.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1021794706756",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1021794706756:web:743a02ce8dda477751e311",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-8KJ946S3EF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging only if supported
let messaging = null;
let messagingSupported = false;

// Check if messaging is supported
const checkMessagingSupport = async () => {
  try {
    messagingSupported = await isSupported();
    if (messagingSupported) {
      messaging = getMessaging(app);
      console.log('✅ Firebase Messaging is supported');
    } else {
      console.log('❌ Firebase Messaging is not supported in this browser');
    }
  } catch (error) {
    console.log('❌ Error checking messaging support:', error);
    messagingSupported = false;
  }
};

// Initialize messaging support check
checkMessagingSupport();

export { messaging, messagingSupported };

// VAPID key for web push notifications
const vapidKey = process.env.VAPIDKEY;

// Validate VAPID key
if (!vapidKey) {
  console.warn('⚠️ VAPIDKEY not found in environment variables. FCM notifications may not work properly.');
}

// Function to get FCM token
export const getFCMToken = async () => {
  try {
    console.log('🔑 Firebase Config: Getting FCM token...');
    console.log('🔑 Firebase Config: messagingSupported:', messagingSupported);
    console.log('🔑 Firebase Config: messaging:', !!messaging);
    
    // Check if messaging is supported
    if (!messagingSupported || !messaging) {
      console.log('❌ Firebase Config: FCM not supported, cannot get token');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.log('❌ Firebase Config: Service Worker not supported');
      return null;
    }

    console.log('🔑 Firebase Config: Registering service worker...');
    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Firebase Config: Service worker registered:', registration);
    
    // Check notification permission first
    console.log('🔑 Firebase Config: Current notification permission:', Notification.permission);
    
    if (Notification.permission === 'denied') {
      console.log('❌ Firebase Config: Notification permission denied, cannot get FCM token');
      console.log('💡 Firebase Config: User needs to manually enable notifications in browser settings');
      return null;
    }
    
    if (Notification.permission === 'default') {
      console.log('⚠️ Firebase Config: Notification permission not requested yet');
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        console.log('❌ Firebase Config: Notification permission not granted:', permission);
        return null;
      }
    }
    
    console.log('✅ Firebase Config: Notification permission is granted');
    
    console.log('🔑 Firebase Config: Getting token with VAPID key...');
    console.log('🔑 Firebase Config: VAPID key:', vapidKey ? vapidKey.substring(0, 20) + '...' : 'null');
    
    if (!vapidKey) {
      console.log('❌ Firebase Config: VAPID key is missing! Please set VAPIDKEY in .env file');
      console.log('💡 Firebase Config: Create a .env file with: VAPIDKEY=your_vapid_key_here');
      console.log('⚠️ Firebase Config: Attempting to get token without VAPID key (may not work)');
      
      // Try without VAPID key as fallback
      try {
        console.log('🔑 Firebase Config: Attempting getToken without VAPID key...');
        const token = await getToken(messaging, { 
          serviceWorkerRegistration: registration
        });
        console.log('✅ Firebase Config: FCM Token obtained without VAPID key:', token ? token.substring(0, 20) + '...' : 'null');
        return token;
      } catch (fallbackError) {
        console.error('❌ Firebase Config: Fallback attempt failed:', fallbackError);
        return null;
      }
    }
    
    console.log('🔑 Firebase Config: Calling getToken with parameters:');
    console.log('  - messaging:', !!messaging);
    console.log('  - vapidKey:', vapidKey ? vapidKey.substring(0, 20) + '...' : 'null');
    console.log('  - serviceWorkerRegistration:', !!registration);
    
    const token = await getToken(messaging, { 
      vapidKey,
      serviceWorkerRegistration: registration
    });
    
    console.log('✅ Firebase Config: FCM Token obtained:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('✅ Firebase Config: Full token length:', token ? token.length : 0);
    return token;
  } catch (error) {
    console.error('❌ Firebase Config: Error getting FCM token:', error);
    console.error('❌ Firebase Config: Error details:', error.message);
    
    // Provide specific guidance based on error type
    if (error.code === 'messaging/permission-blocked') {
      console.log('💡 Firebase Config: Notification permission was blocked. User needs to:');
      console.log('   1. Click the lock icon in the address bar');
      console.log('   2. Allow notifications for this site');
      console.log('   3. Refresh the page');
    } else if (error.code === 'messaging/invalid-vapid-key') {
      console.log('💡 Firebase Config: Invalid VAPID key. Please check your .env file');
    }
    
    return null;
  }
};

// Function to request notification permission
export const requestNotificationPermission = async () => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('❌ Notifications not supported in this browser');
      return false;
    }

    console.log('🔔 Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('🔔 Notification permission result:', permission);
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted!');
      return true;
    } else if (permission === 'denied') {
      console.log('❌ Notification permission denied');
      return false;
    } else {
      console.log('⚠️ Notification permission default (not requested yet)');
      return false;
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
};

// Function to check current notification permission status
export const getNotificationPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Function to listen for permission changes
export const onPermissionChange = (callback) => {
  if (!('Notification' in window)) {
    return () => {};
  }

  const handlePermissionChange = () => {
    const newPermission = Notification.permission;
    console.log('🔔 Notification permission changed to:', newPermission);
    callback(newPermission);
  };

  // Listen for permission changes (this is a custom implementation since browsers don't have a direct API)
  const checkPermission = () => {
    const currentPermission = Notification.permission;
    if (currentPermission !== getNotificationPermissionStatus()) {
      handlePermissionChange();
    }
  };

  // Check permission every 2 seconds
  const interval = setInterval(checkPermission, 2000);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
};

// Function to listen for foreground messages
export const onForegroundMessage = (callback) => {
  if (!messagingSupported || !messaging) {
    console.log('❌ FCM not supported, cannot listen for messages');
    return () => {}; // Return empty unsubscribe function
  }
  return onMessage(messaging, callback);
};

// Manual FCM token generation for debugging
export const debugFCMToken = async () => {
  console.log('🔧 Debug FCM Token Generation');
  console.log('🔧 Environment check:');
  console.log('  - Notification API:', 'Notification' in window);
  console.log('  - Service Worker:', 'serviceWorker' in navigator);
  console.log('  - Notification permission:', Notification.permission);
  console.log('  - messagingSupported:', messagingSupported);
  console.log('  - messaging instance:', !!messaging);
  console.log('  - vapidKey:', vapidKey ? vapidKey.substring(0, 20) + '...' : 'null');
  
  try {
    const token = await getFCMToken();
    if (token) {
      console.log('✅ Debug: FCM token generated successfully');
      console.log('✅ Debug: Token preview:', token.substring(0, 50) + '...');
      return token;
    } else {
      console.log('❌ Debug: FCM token generation failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Debug: FCM token generation error:', error);
    return null;
  }
};

// Function to refresh FCM token (call this periodically)
export const refreshFCMToken = async () => {
  try {
    console.log('🔄 Refreshing FCM token...');
    
    if (!messagingSupported || !messaging) {
      console.log('❌ FCM not supported, cannot refresh token');
      return null;
    }
    
    if (Notification.permission !== 'granted') {
      console.log('❌ Notification permission not granted, cannot refresh token');
      return null;
    }
    
    // Get new token
    const newToken = await getFCMToken();
    
    if (newToken) {
      console.log('✅ FCM token refreshed successfully');
      return newToken;
    } else {
      console.log('❌ Failed to refresh FCM token');
      return null;
    }
  } catch (error) {
    console.error('❌ Error refreshing FCM token:', error);
    return null;
  }
};

// Function to check if FCM token is valid
export const isFCMTokenValid = async (token) => {
  if (!token) return false;
  
  try {
    // Try to use the token to check if it's valid
    // This is a simple check - in production you might want to validate with your backend
    return token.length > 100 && token.includes(':');
  } catch (error) {
    console.error('❌ Error validating FCM token:', error);
    return false;
  }
};

// Expose debug function globally for console testing
if (typeof window !== 'undefined') {
  window.debugFCMToken = debugFCMToken;
  window.refreshFCMToken = refreshFCMToken;
  window.isFCMTokenValid = isFCMTokenValid;
  console.log('🔧 Debug functions available:');
  console.log('  - window.debugFCMToken() - Debug FCM token generation');
  console.log('  - window.refreshFCMToken() - Refresh FCM token');
  console.log('  - window.isFCMTokenValid(token) - Check if token is valid');
} 