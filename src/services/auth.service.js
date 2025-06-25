import { API_CONFIG, getApiUrl } from '../config/api.config';

class AuthService {
    setAuthToken(token) {
        if (token) {
            localStorage.setItem('jwt_token', token);
        } else {
            localStorage.removeItem('jwt_token');
        }
    }

    getAuthToken() {
        return localStorage.getItem('jwt_token') || '';
    }

    async verifyOtpWithBackend(idToken) {
        try {
            console.log('Sending OTP verification request to backend with token:', idToken.substring(0, 20) + '...');
            
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            console.log('Backend response status:', response.status);
            console.log('Backend response headers:', response.headers);

            const data = await response.json();
            console.log('Backend response data:', data);

            if (!response.ok) {
                throw new Error(data.message || `Backend error: ${response.status}`);
            }

            // Store the JWT token received from backend
            if (data.token) {
                this.setAuthToken(data.token);
            }

            return {
                status: response.status,
                data,
            };
        } catch (error) {
            console.error('Backend verification error:', error);
            
            // If it's a network error or backend is not available, return null
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                console.log('Backend not available, will use Firebase data directly');
                return null;
            }
            
            throw error;
        }
    }

    // Helper method to check if user is authenticated
    isAuthenticated() {
        const token = this.getAuthToken();
        return !!token;
    }

    // Logout helper
    logout() {
        this.setAuthToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    }

    // Add other auth-related methods here
}

export const authService = new AuthService(); 