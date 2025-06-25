export const API_CONFIG = {
    BASE_URL: 'http://192.168.1.44:5000/api',
    ENDPOINTS: {
        AUTH: {
            VERIFY_OTP: '/otp/verify-otp',
            SIGNUP: '/auth/signup',
            LOGIN: '/auth/login',
            // Add other auth endpoints as needed
        },
        // Add other endpoint categories as needed
    }
};

// Utility function to construct full API URLs
export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`; 