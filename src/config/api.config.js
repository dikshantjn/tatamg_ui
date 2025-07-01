export const API_CONFIG = {
    BASE_URL: 'http://192.168.1.45:5000/api',
    SOCKET_URL: 'http://192.168.1.45:5000',
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
            GET_CART_ITEMS: '/product-cart/get-cart-items/:userId',
            DELETE_CART_ITEM: '/product-cart/delete-cart-item/:cartId',
            UPDATE_CART_QUANTITY: '/product-cart/update-cart-item-qantity/:cartId',
            CLEAR_CART: '/product-cart/clear-cart/:userId'
        },
        DELIVERY_ADDRESS: {
            SAVE_ADDRESS: '/deliveryAddress/delivery-address',
            GET_ADDRESSES: '/deliveryAddress/getDeliveryAddress/:userId',
            DELETE_ADDRESS: '/deliveryAddress/deleteDeliveryAddress/:addressId'
        },
        PRODUCT_ORDER: {
            CREATE_ORDER: '/product-order/order',
            GET_ORDER: '/product-order/order/:orderId',
            GET_USER_ORDERS: '/product-order/orders/:userId',
            GET_USER_ORDERS_TRACKING: '/product-order/orders/user/:userId',
            GET_DELIVERED_ORDERS: '/product-order/orders/user/:userId/delivered'
        },
        PAYMENTS: {
            GET_PAYMENT_HISTORY: '/payments/history',
            GET_PAYMENT_DETAILS: '/payments/:paymentId',
            CREATE_RAZORPAY_ORDER: '/payments/create-razorpay-order'
        },
        AMBULANCE: {
            GET_ALL: '/ambulance/ambulances',
            REQUEST: '/ambulanceBooking/request',
            GET_ACTIVE_BOOKINGS: '/ambulanceBooking/active-requests/user/:userId',
            UPDATE_PAYMENT_COMPLETED: '/ambulanceBooking/update-payment-completed/:requestId'
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