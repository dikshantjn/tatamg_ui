// Device detection utility for FCM token management

/**
 * Detect if the current device is mobile
 */
export const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone'];
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Detect if the current device is tablet
 */
export const isTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const tabletKeywords = ['tablet', 'ipad', 'kindle', 'silk'];
  return tabletKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Detect if the current device is desktop
 */
export const isDesktop = () => {
  return !isMobile() && !isTablet();
};

/**
 * Get device type string
 */
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

/**
 * Get device info object
 */
export const getDeviceInfo = () => {
  return {
    type: getDeviceType(),
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };
};

/**
 * Check if device supports FCM properly
 */
export const supportsFCM = () => {
  const deviceInfo = getDeviceInfo();
  
  // Desktop browsers generally support FCM well
  if (deviceInfo.isDesktop) {
    return true;
  }
  
  // Mobile browsers have limited FCM support
  if (deviceInfo.isMobile) {
    const userAgent = deviceInfo.userAgent.toLowerCase();
    
    // Chrome on Android supports FCM
    if (userAgent.includes('chrome') && userAgent.includes('android')) {
      return true;
    }
    
    // Safari on iOS has limited FCM support
    if (userAgent.includes('safari') && userAgent.includes('iphone')) {
      return false; // iOS Safari doesn't support FCM properly
    }
    
    // Other mobile browsers
    return false;
  }
  
  // Tablet browsers
  if (deviceInfo.isTablet) {
    const userAgent = deviceInfo.userAgent.toLowerCase();
    
    // Chrome on Android tablets supports FCM
    if (userAgent.includes('chrome') && userAgent.includes('android')) {
      return true;
    }
    
    // Safari on iPad has limited FCM support
    if (userAgent.includes('safari') && userAgent.includes('ipad')) {
      return false; // iPad Safari doesn't support FCM properly
    }
    
    // Other tablet browsers
    return false;
  }
  
  return false;
};

/**
 * Get FCM token refresh interval based on device type
 */
export const getTokenRefreshInterval = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return 15 * 60 * 1000; // 15 minutes for mobile (tokens expire faster)
    case 'tablet':
      return 20 * 60 * 1000; // 20 minutes for tablet
    case 'desktop':
      return 30 * 60 * 1000; // 30 minutes for desktop
    default:
      return 30 * 60 * 1000; // Default to 30 minutes
  }
};

/**
 * Log device information for debugging
 */
export const logDeviceInfo = () => {
  const deviceInfo = getDeviceInfo();
  console.log('📱 Device Information:');
  console.log('  - Type:', deviceInfo.type);
  console.log('  - Platform:', deviceInfo.platform);
  console.log('  - User Agent:', deviceInfo.userAgent);
  console.log('  - Screen:', `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`);
  console.log('  - Window:', `${deviceInfo.windowWidth}x${deviceInfo.windowHeight}`);
  console.log('  - Language:', deviceInfo.language);
  console.log('  - FCM Support:', supportsFCM());
  console.log('  - Token Refresh Interval:', getTokenRefreshInterval() / 1000 / 60, 'minutes');
};

// Expose functions globally for debugging
if (typeof window !== 'undefined') {
  window.getDeviceInfo = getDeviceInfo;
  window.logDeviceInfo = logDeviceInfo;
  window.supportsFCM = supportsFCM;
  window.getTokenRefreshInterval = getTokenRefreshInterval;
}
