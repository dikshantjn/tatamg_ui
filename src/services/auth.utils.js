// Token and User ID storage keys
const TOKEN_KEY = 'user_token';
const USER_ID_KEY = 'user_id';

// Store token and user ID
export const storeAuthData = (token, userId) => {
    try {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_ID_KEY, userId);
        return true;
    } catch (error) {
        console.error('Error storing auth data:', error);
        return false;
    }
};

// Get stored token
export const getToken = () => {
    try {
        return sessionStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Get stored user ID
export const getUserId = () => {
    try {
        return sessionStorage.getItem(USER_ID_KEY);
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

// Clear auth data (for logout)
export const clearAuthData = () => {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_ID_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing auth data:', error);
        return false;
    }
};

// Get auth header for API requests
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}; 