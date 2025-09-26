// Token and User ID storage keys
const TOKEN_KEY = 'user_token';
const USER_ID_KEY = 'user_id';
const AUTH_TIMESTAMP_KEY = 'auth_timestamp';
const USER_DATA_KEY = 'user_data';

// Store token and user ID
export const storeAuthData = (token, userId, userData = null) => {
    try {
        if (!token || !userId) {
            console.warn('❌ Invalid auth data provided:', { token: !!token, userId: !!userId });
            clearAuthData();
            return false;
        }

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_ID_KEY, userId);
        localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
        
        if (userData) {
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        }
        
        // Verify the data was stored correctly
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUserId = localStorage.getItem(USER_ID_KEY);
        
        if (!storedToken || !storedUserId) {
            console.error('❌ Failed to verify stored auth data in localStorage');
            return false;
        }
        
        console.log('✅ Auth data stored successfully');
        return true;
    } catch (error) {
        console.error('❌ Error storing auth data in localStorage:', error);
        return false;
    }
};

// Get stored token
export const getToken = () => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
        
        if (!token || !timestamp) {
            console.log('❌ No token or timestamp found in localStorage');
            return null;
        }

        // Check if token is expired (24 hours)
        const tokenAge = Date.now() - parseInt(timestamp);
        if (tokenAge > 24 * 60 * 60 * 1000) {
            console.log('❌ Token expired in localStorage');
            clearAuthData();
            return null;
        }

        return token;
    } catch (error) {
        console.error('❌ Error getting token from localStorage:', error);
        return null;
    }
};

// Get stored user ID
export const getUserId = () => {
    try {
        const userId = localStorage.getItem(USER_ID_KEY);
        console.log('🔍 Auth Utils - getUserId called, USER_ID_KEY:', USER_ID_KEY);
        console.log('🔍 Auth Utils - Raw userId from localStorage:', userId);
        console.log('🔍 Auth Utils - All localStorage keys:', Object.keys(localStorage));
        if (!userId) {
            console.log('No user ID found in localStorage');
            return null;
        }
        console.log('🔍 Auth Utils - Returning userId:', userId);
        return userId;
    } catch (error) {
        console.error('Error getting user ID from localStorage:', error);
        return null;
    }
};

// Get user data
export const getUserData = () => {
    try {
        const userDataStr = localStorage.getItem(USER_DATA_KEY);
        if (!userDataStr) {
            return null;
        }
        return JSON.parse(userDataStr);
    } catch (error) {
        console.error('Error getting user data from localStorage:', error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    try {
        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
            console.log('❌ Missing token or userId in localStorage');
            return false;
        }

        // Check if token is a valid JWT format (xxx.yyy.zzz)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.log('❌ Invalid token format in localStorage');
            clearAuthData();
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Error checking authentication in localStorage:', error);
        return false;
    }
};

// Clear auth data (for logout)
export const clearAuthData = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        console.log('Auth data cleared successfully from localStorage');
        return true;
    } catch (error) {
        console.error('Error clearing auth data from localStorage:', error);
        return false;
    }
};

// Get auth header for API requests
export const getAuthHeader = () => {
    const token = getToken();
    if (!token) {
        return {};
    }
    return { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}; 