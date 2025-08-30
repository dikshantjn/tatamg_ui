import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { storeAuthData, clearAuthData, getToken, isAuthenticated as checkAuth } from '../Auth/auth.utils';

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
            if (data.token && data.userId) {
                this.setAuthToken(data.token, data.userId, data.userData);
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

    // Add other auth-related methods here
}

export const authService = new AuthService(); 