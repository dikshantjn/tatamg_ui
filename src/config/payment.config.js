// Payment Configuration
// In production, these should be stored in environment variables

export const PAYMENT_CONFIG = {
    // Razorpay Configuration
    RAZORPAY: {
        KEY_ID: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_R7wuZ7PnhxSIOE',
        KEY_SECRET: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'your_razorpay_secret_key_here', // Add your secret key here
        CURRENCY: 'INR',
        COMPANY_NAME: 'Vedika Healthcare',
        THEME_COLOR: '#38A3A5'
    },

    // Payment Settings
    PAYMENT: {
        CURRENCY: 'INR',
        MIN_AMOUNT: 1, // Minimum amount in INR
        MAX_AMOUNT: 100000, // Maximum amount in INR
        TIMEOUT: 300000, // 5 minutes in milliseconds
        RETRY_ATTEMPTS: 3
    },

    // Order Settings
    ORDER: {
        PREFIX: 'ORD',
        SUFFIX_LENGTH: 6,
        EXPIRY_TIME: 3600 // 1 hour in seconds
    },

    // Webhook Settings (for backend)
    WEBHOOK: {
        EVENTS: [
            'payment.captured',
            'payment.failed',
            'order.paid',
            'order.payment_failed'
        ]
    }
};

// Validate Razorpay key format
export const validateRazorpayKey = (key) => {
    if (!key) return false;
    // Razorpay test keys start with 'rzp_test_' and live keys start with 'rzp_live_'
    return key.startsWith('rzp_test_') || key.startsWith('rzp_live_');
};

// Payment status constants
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED'
};

// Order status constants
export const ORDER_STATUS = {
    CREATED: 'CREATED',
    CONFIRMED: 'CONFIRMED',
    PAID: 'PAID',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED'
};

// Payment methods
export const PAYMENT_METHODS = {
    CARD: 'card',
    UPI: 'upi',
    NETBANKING: 'netbanking',
    WALLET: 'wallet',
    EMI: 'emi'
};

// Error messages
export const PAYMENT_ERRORS = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    INVALID_AMOUNT: 'Invalid amount. Please check the order total.',
    PAYMENT_FAILED: 'Payment failed. Please try again or use a different payment method.',
    ORDER_CREATION_FAILED: 'Failed to create order. Please try again.',
    VERIFICATION_FAILED: 'Payment verification failed. Please contact support.',
    USER_CANCELLED: 'Payment was cancelled by user.',
    TIMEOUT: 'Payment timeout. Please try again.',
    INSUFFICIENT_FUNDS: 'Insufficient funds. Please use a different payment method.',
    CARD_DECLINED: 'Card was declined. Please use a different card.',
    UPI_ERROR: 'UPI payment failed. Please try again or use a different payment method.',
    INVALID_RAZORPAY_KEY: 'Invalid Razorpay configuration. Please contact support.'
};

// Success messages
export const PAYMENT_SUCCESS = {
    PAYMENT_COMPLETED: 'Payment completed successfully!',
    ORDER_CONFIRMED: 'Order confirmed and payment received.',
    RECEIPT_SENT: 'Payment receipt has been sent to your email.'
}; 