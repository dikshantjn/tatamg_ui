import { useState, useEffect, useCallback } from 'react';
import { 
  getFCMToken, 
  requestNotificationPermission, 
  onForegroundMessage,
  messagingSupported
} from '../firebase/config';
import { fcmService } from '../services/User/FCM/fcm.service';
import { getUserId } from '../services/User/Auth/auth.utils';
import { checkFCMSupport, getNotificationSupportMessage } from '../utils/browserSupport';

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [permission, setPermission] = useState('default');
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(null);

  // Initialize FCM
  const initializeFCM = useCallback(async () => {
    try {
      console.log('🚀 Initializing FCM...');
      
      // Check browser support first
      const supportCheck = checkFCMSupport();
      setBrowserSupport(supportCheck);
      
      // Always check notification permission, even for unsupported browsers
      if (!('Notification' in window)) {
        console.log('❌ This browser does not support notifications');
        // Still mark as initialized for in-app notifications
        setIsInitialized(true);
        return false;
      }

      // Check current permission
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      console.log('📋 Current notification permission:', currentPermission);

      // Request permission if not granted (even for unsupported browsers)
      if (currentPermission === 'default') {
        const granted = await requestNotificationPermission();
        if (!granted) {
          console.log('❌ Notification permission denied');
          // Still mark as initialized for in-app notifications
          setIsInitialized(true);
          return false;
        }
        setPermission('granted');
      } else if (currentPermission === 'denied') {
        console.log('❌ Notification permission was previously denied');
        // Still mark as initialized for in-app notifications
        setIsInitialized(true);
        return false;
      }

      // If browser doesn't support FCM, still initialize for in-app notifications
      if (!supportCheck.supported) {
        console.log('❌ Browser does not support FCM:', supportCheck.reason);
        console.log('📱 Will use in-app notifications instead');
        setIsInitialized(true);
        return false;
      }
      
      // Check if FCM is supported by Firebase
      if (!messagingSupported) {
        console.log('❌ Firebase Messaging is not supported in this browser');
        console.log('📱 Will use in-app notifications instead');
        setIsInitialized(true);
        return false;
      }

      // Get FCM token
      const token = await getFCMToken();
      if (!token) {
        console.log('❌ Failed to get FCM token');
        return false;
      }

      setFcmToken(token);
      console.log('✅ FCM token obtained:', token);

      // Note: FCM token saving is now handled by auth service during login
      // This ensures token is saved only after successful authentication
      console.log('✅ FCM token obtained and ready for use');

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('❌ Error initializing FCM:', error);
      return false;
    }
  }, []);

  // Handle foreground messages
  const handleForegroundMessage = useCallback((payload) => {
    console.log('📱 Received foreground message:', payload);
    
    const notification = {
      title: payload.notification?.title || payload.data?.title || 'New Notification',
      body: payload.notification?.body || payload.data?.body || payload.data?.message || '',
      type: payload.data?.type || 'info',
      data: payload.data || {},
      notificationId: payload.data?.notificationId,
      timestamp: new Date().toISOString()
    };

    // Always show custom popup for unsupported browsers
    if (!browserSupport?.supported) {
      setCurrentNotification(notification);
      console.log('📱 Showing in-app notification (unsupported browser)');
      return;
    }

    // Check if we're in foreground (tab is active)
    const isForeground = !document.hidden;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log('📱 Device info:', { isForeground, isMobile, userAgent: navigator.userAgent });
    
    // For mobile devices, always show native notifications if permission is granted
    if (isMobile && Notification.permission === 'granted') {
      console.log('📱 Mobile device - showing native notification');
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.notificationId || 'fcm-notification',
        data: notification.data,
        requireInteraction: true, // Keep notification visible until user interacts
        silent: false // Ensure notification makes sound
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        // Handle notification click action
        if (notification.data.actionUrl) {
          window.location.href = notification.data.actionUrl;
        }
      };
      
      // Also show in-app notification for better UX on mobile
      setCurrentNotification(notification);
      console.log('📱 Mobile: Showing both native and in-app notification');
      return;
    }
    
    if (isForeground) {
      // Show custom popup for foreground (desktop)
      setCurrentNotification(notification);
      console.log('📱 Showing custom popup (foreground desktop)');
    } else {
      // Show browser notification for background (desktop)
      if (Notification.permission === 'granted') {
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: notification.notificationId || 'fcm-notification',
          data: notification.data
        });

        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
          // Handle notification click action
          if (notification.data.actionUrl) {
            window.location.href = notification.data.actionUrl;
          }
        };
        console.log('📱 Showing browser notification (background desktop)');
      }
    }
  }, [browserSupport]);

  // Setup message listener
  useEffect(() => {
    if (isInitialized && fcmToken && messagingSupported) {
      console.log('👂 Setting up FCM message listener...');
      
      const unsubscribe = onForegroundMessage(handleForegroundMessage);
      
      return () => {
        console.log('🔇 Cleaning up FCM message listener');
        unsubscribe();
      };
    }
  }, [isInitialized, fcmToken, handleForegroundMessage]);

  // Clear current notification
  const clearNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  // Handle notification action
  const handleNotificationAction = useCallback((action) => {
    console.log('🎯 Notification action:', action);
    
    if (action === 'view' && currentNotification?.data?.actionUrl) {
      window.location.href = currentNotification.data.actionUrl;
    }
    
    clearNotification();
  }, [currentNotification, clearNotification]);

  // Remove FCM token (for logout)
  const removeFCMToken = useCallback(async () => {
    try {
      const userId = getUserId();
      if (userId && fcmToken) {
        await fcmService.removeFCMToken(userId);
        console.log('✅ FCM token removed from backend');
      }
      setFcmToken(null);
      setIsInitialized(false);
    } catch (error) {
      console.error('❌ Error removing FCM token:', error);
    }
  }, [fcmToken]);

  return {
    fcmToken,
    permission,
    currentNotification,
    isInitialized,
    browserSupport,
    initializeFCM,
    clearNotification,
    handleNotificationAction,
    removeFCMToken
  };
};
