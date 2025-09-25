import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { storeAuthData, clearAuthData, getToken, isAuthenticated as checkAuth, getUserId } from '../Auth/auth.utils';
import { fcmService } from '../FCM/fcm.service';
import { getFCMToken, getNotificationPermissionStatus, onPermissionChange } from '../../../firebase/config';

class AuthService {
    setAuthToken(token, userId, userData = null) {
        if (token) {
            return storeAuthData(token, userId, userData);
        } else {
            clearAuthData();
            return false;
        }
    }

    getAuthToken() {
        return getToken() || '';
    }

    async verifyOtpWithBackend(idToken) {
        try {
            console.log('Sending OTP verification request to backend');
            
            const response = await apiClient.post(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP), { idToken });

            console.log('Backend response status:', response.status);

            const data = response.data;
            console.log('Backend response data:', data);

            if (response.status !== 200) {
                throw new Error(data.message || `Backend error: ${response.status}`);
            }

            // Store the JWT token and user data received from backend
            console.log('🔔 Auth Service: Backend response data:', data);
            console.log('🔔 Auth Service: Has token:', !!data.token);
            console.log('🔔 Auth Service: Has userId:', !!data.userId);
            
            if (data.token && data.userId) {
                console.log('🔔 Auth Service: Setting auth token and scheduling FCM token save...');
                this.setAuthToken(data.token, data.userId, data.userData);
                
                // Save FCM token after successful authentication
                // Use setTimeout to ensure auth data is stored first
                setTimeout(() => {
                    console.log('🔔 Auth Service: Executing FCM token save for userId:', data.userId);
                    this.saveFCMTokenAfterLogin(data.userId);
                }, 1000);
            } else {
                console.log('🔔 Auth Service: Skipping FCM token save - missing token or userId');
                console.log('🔔 Auth Service: Token present:', !!data.token);
                console.log('🔔 Auth Service: UserId present:', !!data.userId);
            }

            return {
                status: response.status,
                data,
            };
        } catch (error) {
            console.error('Backend verification error:', error);
            clearAuthData(); // Clear any partial auth data on error
            throw error;
        }
    }

    async registerUser(phoneNumber, token) {
        try {
            console.log('Registering user with phone number:', phoneNumber);
            console.log('Using token for authorization:', token ? token.substring(0, 20) + '...' : 'null');
            
            const headers = {
                'Content-Type': 'application/json',
            };

            // Add authorization header if token is provided
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await apiClient.post(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), { phone_number: phoneNumber }, { headers });

            console.log('Register response status:', response.status);

            const data = response.data;
            console.log('Register response data:', data);

            // Handle both 200 (user exists) and 201 (user created) as success
            if (response.status === 200 || response.status === 201) {
                console.log('Registration successful:', data.message);
                return {
                    status: response.status,
                    data,
                    isNewUser: response.status === 201
                };
            }

            // Handle database constraint errors as "user already exists"
            if (response.status === 500 && data.message === 'Internal Server Error') {
                console.log('Database constraint error - treating as existing user');
                return {
                    status: 200,
                    data: { message: 'User already exists' },
                    isNewUser: false
                };
            }

            throw new Error(data.message || `Registration error: ${response.status}`);
        } catch (error) {
            console.error('Registration error:', error);
            
            // If it's a network error or backend is not available, return null
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                console.log('Backend not available for registration');
                return null;
            }
            
            throw error;
        }
    }

    // Helper method to check if user is authenticated
    isAuthenticated() {
        return checkAuth();
    }

    // Logout helper
    logout() {
        clearAuthData();
    }

    // Save FCM token after successful authentication
    async saveFCMTokenAfterLogin(userId) {
        try {
            console.log('🔔 Attempting to save FCM token after login for userId:', userId);
            
            // Wait a bit for FCM to initialize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if FCM is supported
            if (!('Notification' in window)) {
                console.log('❌ Notifications not supported, skipping FCM token save');
                return;
            }
            
            // Get FCM token
            const fcmToken = await getFCMToken();
            
            if (fcmToken) {
                console.log('✅ FCM token obtained:', fcmToken.substring(0, 20) + '...');
                console.log('💾 Saving FCM token to backend...');
                
                // Try to save the token
                try {
                    const response = await fcmService.saveFCMToken(userId, fcmToken);
                    console.log('✅ FCM token saved successfully:', response);
                } catch (error) {
                    console.log('⚠️ Failed to save FCM token, trying to update instead...');
                    console.log('Error details:', error);
                    // If save fails, try to update
                    try {
                        const response = await fcmService.updateFCMToken(userId, fcmToken);
                        console.log('✅ FCM token updated successfully:', response);
                    } catch (updateError) {
                        console.error('❌ Failed to save/update FCM token:', updateError);
                    }
                }
            } else {
                console.log('❌ No FCM token available to save');
                console.log('🔍 Checking FCM initialization status...');
                
                // Check if we can get token with retry
                for (let i = 0; i < 3; i++) {
                    console.log(`🔄 Retry ${i + 1}/3 to get FCM token...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const retryToken = await getFCMToken();
                    if (retryToken) {
                        console.log('✅ FCM token obtained on retry:', retryToken.substring(0, 20) + '...');
                        try {
                            await fcmService.saveFCMToken(userId, retryToken);
                            console.log('✅ FCM token saved successfully on retry');
                            return;
                        } catch (error) {
                            console.error('❌ Failed to save FCM token on retry:', error);
                        }
                    }
                }
                
                console.log('❌ Could not obtain FCM token after retries');
            }
        } catch (error) {
            console.error('❌ Error in saveFCMTokenAfterLogin:', error);
        }
    }

    async updatePlatform(phoneNumber, platform, token) {
        try {
            console.log('Updating platform for phone:', phoneNumber, 'platform:', platform);
            console.log('Request body:', { phone_number: phoneNumber, platform: platform });
            
            const headers = {
                'Content-Type': 'application/json',
            };

            // Add authorization header if token is provided
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const requestBody = { phone_number: phoneNumber, platform: platform };
            console.log('Sending platform update request to:', getApiUrl(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PLATFORM));
            console.log('Request body:', requestBody);
            
            const response = await apiClient.post(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PLATFORM), requestBody, { headers });

            console.log('Update platform response status:', response.status);

            const data = response.data;
            console.log('Update platform response data:', data);

            // Handle 404 (user not found) gracefully - don't throw error
            if (response.status === 404) {
                console.log('User not found for platform update, but continuing...');
                console.log('This might be because user registration is still in progress');
                return {
                    status: response.status,
                    data,
                    success: false,
                    reason: 'user_not_found'
                };
            }

            if (response.status !== 200) {
                throw new Error(data.message || `Update platform error: ${response.status}`);
            }

            return {
                status: response.status,
                data,
                success: true
            };
        } catch (error) {
            console.error('Update platform error:', error);
            
            // If it's a network error or backend is not available, return null
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                console.log('Backend not available for platform update');
                return null;
            }
            
            throw error;
        }
    }

    // Manual FCM token save for debugging (can be called from console)
    async manualSaveFCMToken() {
        const userId = getUserId();
        if (!userId) {
            console.log('❌ No user ID found, please login first');
            return;
        }
        
        console.log('🔧 Manual FCM token save triggered for userId:', userId);
        await this.saveFCMTokenAfterLogin(userId);
    }

    // Start listening for notification permission changes
    startPermissionListener() {
        console.log('🔔 Auth Service: Starting permission listener...');
        
        const cleanup = onPermissionChange((newPermission) => {
            console.log('🔔 Auth Service: Permission changed to:', newPermission);
            
            if (newPermission === 'granted') {
                console.log('🔔 Auth Service: Permission granted! Attempting to save FCM token...');
                const userId = getUserId();
                if (userId) {
                    // Save FCM token when permission is granted
                    setTimeout(() => {
                        this.saveFCMTokenAfterLogin(userId);
                    }, 1000);
                }
            }
        });

        // Store cleanup function for later use
        this.permissionListenerCleanup = cleanup;
    }

    // Stop listening for permission changes
    stopPermissionListener() {
        if (this.permissionListenerCleanup) {
            console.log('🔔 Auth Service: Stopping permission listener...');
            this.permissionListenerCleanup();
            this.permissionListenerCleanup = null;
        }
    }

    // Check if we should show permission dialog
    shouldShowPermissionDialog() {
        const permission = getNotificationPermissionStatus();
        console.log('🔔 Auth Service: Current permission status:', permission);
        
        // Show dialog if permission is default (not requested yet) or denied
        return permission === 'default' || permission === 'denied';
    }

    // Manual FCM token save with detailed debugging
    async debugSaveFCMToken() {
        const userId = getUserId();
        if (!userId) {
            console.log('❌ Debug: No user ID found, please login first');
            return;
        }
        
        console.log('🔧 Debug: Manual FCM token save for userId:', userId);
        console.log('🔧 Debug: Current notification permission:', Notification.permission);
        
        // Import debug function
        const { debugFCMToken } = await import('../../../firebase/config');
        
        // Try to get FCM token
        const token = await debugFCMToken();
        
        if (token) {
            console.log('🔧 Debug: Attempting to save FCM token to backend...');
            try {
                const response = await fcmService.saveFCMToken(userId, token);
                console.log('✅ Debug: FCM token saved successfully:', response);
                return response;
            } catch (error) {
                console.error('❌ Debug: Failed to save FCM token:', error);
                console.error('❌ Debug: Error response:', error.response?.data);
                return null;
            }
        } else {
            console.log('❌ Debug: No FCM token available to save');
            return null;
        }
    }

    // Add other auth-related methods here
}

export const authService = new AuthService(); 