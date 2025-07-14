export const API_CONFIG = {
    BASE_URL: 'http://192.168.1.43:5000/api',
    SOCKET_URL: 'http://192.168.1.43:5000',
    ENDPOINTS: {
        AUTH: {
            VERIFY_OTP: '/otp/verify-otp',
            SIGNUP: '/auth/signup',
            LOGIN: '/auth/login',
            UPDATE_PLATFORM: '/auth/platform-update',
            // Add other auth endpoints as needed
        },
        VENDOR_AUTH: {
            LOGIN: '/vendors/login',
            LOGOUT: '/vendors/logout',
        },
        HOSPITALS: {
            GET_ALL_HOSPITALS: '/hospitals/getAllHospitals',
            GET_WARDS: '/hospitals/wards/vendor/:vendorId',
            CREATE_BED_BOOKING: '/hospitals/bed-booking',
            GET_USER_BOOKINGS: '/hospitals/by-user/:userId',
            UPDATE_BED_BOOKING_PAYMENT_STATUS: '/hospitals/appointment/payment-status/:bookingId',
            GET_COMPLETED_BOOKINGS: '/hospitals/appointment/completed/user/:userId',
            // Add other hospital endpoints as needed
        },
        DOCTOR_CONSULTATION: {
            GET_OFFLINE_DOCTORS: '/clinic/active/offline',
            GET_ONLINE_DOCTORS: '/clinic/active/online',
            CREATE_APPOINTMENT: '/clinic-appointments',
            GET_USER_APPOINTMENTS: '/clinic-appointments/user/:userId',
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
            UPDATE_PAYMENT_COMPLETED: '/ambulanceBooking/update-payment-completed/:requestId',
            GET_COMPLETED_BOOKINGS: '/ambulanceBooking/completed-requests/:userId'
        },
        BLOOD_BANK: {
            GET_ACTIVE_BLOOD_BANKS: '/blood-bank/blood-bank-agencies',
            CREATE_BLOOD_BANK_REQUEST: '/blood-bank/requests',
            GET_BLOOD_BANK_BOOKINGS_BY_USER: '/blood-bank-bookings/user/:userId',
            UPDATE_BLOOD_BANK_PAYMENT: '/blood-bank-bookings/:bookingId/update-payment',
            GET_COMPLETED_BLOOD_BANK_BOOKINGS_BY_USER: '/blood-bank-bookings/user/:userId/completed'
        },
        MEDICINE_DELIVERY: {
            UPLOAD_PRESCRIPTION: '/prescription/upload-prescription',
            SEARCH_MORE_VENDORS: '/prescription/:prescriptionId/search-more-vendors',
            TRACK_ORDERS: '/orders/track-orders/:userId',
            GET_CART_ITEMS_BY_ORDER: '/cart/:orderId',
            GET_USER_ORDERS_WITH_CART: '/user/orders/cart/:userId',
            UPDATE_ORDER: '/orders/update-order/:orderId',
            GET_DELIVERED_ORDERS: '/orders/:userId'
        },
        LAB_TEST: {
            GET_ALL_DIAGNOSTIC_CENTERS: '/lab-test/all-diagnostic-centers',
            CREATE_BOOKING: '/labtest-booking/create',
            GET_COMPLETED_BOOKINGS: '/labtest-booking/bookings/user/completed/:userId'
        },
        HEALTH_RECORDS: {
            CHECK_PASSWORD: '/health-record/user/:userId/health-record-password/check',
            SET_PASSWORD: '/health-record/user/:userId/health-record-password',
            VERIFY_PASSWORD: '/health-record/user/:userId/verify-health-record-password',
            GET_HEALTH_RECORDS: '/health-record/get-health-record/:userId',
            ADD_HEALTH_RECORD: '/health-record/add-health-record',
            DELETE_HEALTH_RECORD: '/health-record/delete-health-record/:healthRecordId'
        },
        PRODUCT_PARTNER: {
            GET_VENDOR_PROFILE: '/productPartner/vendor/:vendorId',
            UPDATE_VENDOR_PROFILE: '/productPartner/vendor/:vendorId',
            GET_VENDOR_PRODUCTS: '/vendor-product/products/vendor/:vendorId',
            ADD_PRODUCT: '/vendor-product/add',
            DELETE_PRODUCT: '/vendor-product/products/:productId',
            UPDATE_PRODUCT: '/vendor-product/products/:productId',
            GET_PENDING_ORDERS: '/product-order/pending-orders/:vendorId',
            GET_CONFIRMED_ORDERS: '/product-order/confirmed-orders/:vendorId',
            GET_DELIVERED_ORDERS: '/product-order/delivered-orders/:vendorId',
            UPDATE_ORDER_STATUS: '/product-order/order/:orderId/status',
        },
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