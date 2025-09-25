// Browser support detection utilities

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
  
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  
  // Samsung Internet
  if (userAgent.includes('SamsungBrowser')) {
    browserName = 'Samsung Internet';
    const match = userAgent.match(/SamsungBrowser\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  // UC Browser
  else if (userAgent.includes('UCBrowser')) {
    browserName = 'UC Browser';
    const match = userAgent.match(/UCBrowser\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  // Chrome (including mobile Chrome)
  else if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  // Firefox (including mobile Firefox)
  else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  // Safari (including mobile Safari)
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  // Edge
  else if (userAgent.includes('Edge')) {
    browserName = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  
  return {
    browserName,
    browserVersion,
    isMobile,
    isTablet,
    userAgent
  };
};

export const checkFCMSupport = () => {
  const browserInfo = getBrowserInfo();
  
  // FCM is generally supported on:
  // - Chrome (desktop and mobile) - Full support
  // - Firefox (desktop and mobile) - Full support  
  // - Edge (desktop) - Full support
  // - Safari (desktop only) - Limited support
  // - Mobile Safari (iOS) - Not supported
  // - Samsung Internet - Supported
  // - UC Browser - Limited support
  
  const supportedBrowsers = {
    Chrome: { minVersion: 50, mobileSupported: true },
    Firefox: { minVersion: 44, mobileSupported: true },
    Edge: { minVersion: 79, mobileSupported: false },
    Safari: { minVersion: 11, mobileSupported: false }, // Desktop Safari only
    'Samsung Internet': { minVersion: 10, mobileSupported: true },
    'UC Browser': { minVersion: 12, mobileSupported: true }
  };
  
  const browserSupport = supportedBrowsers[browserInfo.browserName];
  
  if (!browserSupport) {
    return {
      supported: false,
      reason: `FCM is not supported in ${browserInfo.browserName}`,
      browserInfo
    };
  }
  
  const version = parseInt(browserInfo.browserVersion);
  if (version < browserSupport.minVersion) {
    return {
      supported: false,
      reason: `${browserInfo.browserName} version ${browserInfo.browserVersion} is too old. Minimum required: ${browserSupport.minVersion}`,
      browserInfo
    };
  }
  
  // Special case for iOS Safari - never supported
  if (browserInfo.isMobile && browserInfo.userAgent.includes('iPhone') && browserInfo.browserName === 'Safari') {
    return {
      supported: false,
      reason: 'FCM is not supported on iOS Safari due to Apple restrictions',
      browserInfo
    };
  }
  
  // Special case for iPad Safari - never supported
  if (browserInfo.isTablet && browserInfo.userAgent.includes('iPad') && browserInfo.browserName === 'Safari') {
    return {
      supported: false,
      reason: 'FCM is not supported on iPad Safari due to Apple restrictions',
      browserInfo
    };
  }
  
  if (browserInfo.isMobile && !browserSupport.mobileSupported) {
    return {
      supported: false,
      reason: `FCM is not supported on mobile ${browserInfo.browserName}`,
      browserInfo
    };
  }
  
  return {
    supported: true,
    reason: 'FCM is supported',
    browserInfo
  };
};

export const getNotificationSupportMessage = () => {
  const fcmSupport = checkFCMSupport();
  const browserInfo = fcmSupport.browserInfo;
  
  if (fcmSupport.supported) {
    return {
      type: 'success',
      title: 'Push Notifications Supported',
      message: `Your browser (${browserInfo.browserName} ${browserInfo.browserVersion}) supports push notifications.`,
      show: false
    };
  } else {
    return {
      type: 'warning',
      title: 'Push Notifications Not Supported',
      message: `${fcmSupport.reason}. You can still receive notifications through the app's notification center.`,
      show: true,
      browserInfo
    };
  }
};
