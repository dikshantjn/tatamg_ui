export const API_CONFIG = {
    BASE_URL: 'http://192.168.1.42:5000/api',
    ENDPOINTS: {
        AUTH: {
            VERIFY_OTP: '/otp/verify-otp',
            SIGNUP: '/auth/signup',
            LOGIN: '/auth/login',
            UPDATE_PLATFORM: '/auth/platform-update',
            // Add other auth endpoints as needed
        },
        USER: {
            GET_USER: '/user/:userId',
            UPDATE_USER: '/user/edit/:userId',
            // Add other user endpoints as needed
        },
        MEDICAL_PROFILE: {
            CREATE: '/medical-profile',
            GET: '/medical-profile/:userId',
            UPDATE: '/medical-profile/:userId',
        },
        VENDOR_PRODUCTS: {
            GET_BY_CATEGORY: '/vendor-product/get-product-by-category/:category',
            // Add other product endpoints as needed
        },
        CART: {
            ADD_TO_CART: '/product-cart/add',
            CHECK_IN_CART: '/product-cart/check',
            GET_CART_ITEMS: '/product-cart/get-cart-items/:userId'
        }
        // Add other endpoint categories as needed
    }
};

// Export the base URL for direct use
export const API_BASE_URL = API_CONFIG.BASE_URL;

// Utility function to construct full API URLs
export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

// Utility function to replace URL parameters
export const replaceUrlParams = (url, params) => {
    let finalUrl = url;
    Object.keys(params).forEach(key => {
        finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(params[key]));
    });
    return finalUrl;
}; 