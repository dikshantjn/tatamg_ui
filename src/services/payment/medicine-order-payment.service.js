import { API_CONFIG, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getToken, getUserId, getUserData } from '../User/Auth/auth.utils';

class MedicineOrderPaymentService {
    constructor() {
        this.razorpay = null;
        this.initializeRazorpay();
    }

    initializeRazorpay() {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            console.log('Loading Razorpay SDK...');
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                console.log('Razorpay SDK loaded successfully');
                this.razorpay = window.Razorpay;
            };
            script.onerror = (error) => {
                console.error('Failed to load Razorpay SDK:', error);
            };
            document.head.appendChild(script);
        } else if (typeof window !== 'undefined' && window.Razorpay) {
            console.log('Razorpay SDK already available');
            this.razorpay = window.Razorpay;
        }
    }

    async processPayment(orderData, onSuccess, onFailure) {
        try {
            console.log('Starting payment process...');
            console.log('Order data:', orderData);
            
            if (!validateRazorpayKey(PAYMENT_CONFIG.RAZORPAY.KEY_ID)) {
                console.error('Invalid Razorpay key:', PAYMENT_CONFIG.RAZORPAY.KEY_ID);
                throw new Error(PAYMENT_ERRORS.INVALID_RAZORPAY_KEY);
            }
            
            if (!this.razorpay) {
                console.log('Razorpay not initialized, initializing...');
                this.initializeRazorpay();
                await new Promise(resolve => setTimeout(resolve, 2000)); // Increased timeout
                if (!this.razorpay) {
                    console.error('Razorpay SDK failed to load after initialization');
                    throw new Error('Razorpay SDK failed to load. Please refresh the page and try again.');
                }
            }
            
            console.log('Razorpay SDK loaded successfully');
            
            const amount = Math.round(orderData.total * 100);
            console.log('Payment amount (in paise):', amount);
            console.log('Payment amount (in rupees):', orderData.total);
            
            const options = {
                key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
                amount: amount,
                currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
                name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
                description: `Medicine Order for ₹${orderData.total}`,
                handler: async (response) => {
                    try {
                        console.log('Payment successful, calling success callback...');
                        if (onSuccess) {
                            onSuccess({
                                paymentId: response.razorpay_payment_id,
                                orderId: orderData.orderId,
                                amount: orderData.total,
                                status: 'success',
                                message: 'Payment completed successfully.'
                            });
                        }
                    } catch (err) {
                        console.error('Error in payment handler:', err);
                        if (onFailure) onFailure('Payment succeeded but callback failed.');
                    }
                },
                prefill: {
                    name: this.getUserName() || '',
                    email: this.getUserEmail() || '',
                    contact: this.getUserPhone() || ''
                },
                notes: {
                    userId: this.getCurrentUserId(),
                    items: JSON.stringify(orderData.items)
                },
                theme: {
                    color: PAYMENT_CONFIG.RAZORPAY.THEME_COLOR
                },
                modal: {
                    ondismiss: () => {
                        if (onFailure) onFailure(PAYMENT_ERRORS.USER_CANCELLED);
                    }
                },
                timeout: PAYMENT_CONFIG.PAYMENT.TIMEOUT
            };
            
            console.log('Razorpay options:', options);
            console.log('Creating Razorpay instance...');
            
            const razorpayInstance = new this.razorpay(options);
            console.log('Razorpay instance created, opening payment modal...');
            
            razorpayInstance.open();
            console.log('Razorpay modal opened successfully');
        } catch (error) {
            if (onFailure) onFailure(error.message || PAYMENT_ERRORS.PAYMENT_FAILED);
        }
    }

    getCurrentUserId() {
        const userId = getUserId();
        if (userId) return userId;
        const userData = getUserData();
        if (userData) return userData.userId || userData.id || userData.user_id || userData._id;
        return '12345';
    }
    getUserName() {
        const userData = getUserData();
        if (userData) return userData.name || userData.fullName || userData.firstName || '';
        return '';
    }
    getUserEmail() {
        const userData = getUserData();
        if (userData) return userData.email || '';
        return '';
    }
    getUserPhone() {
        const userData = getUserData();
        if (userData) return userData.phone || userData.mobile || userData.phoneNumber || '';
        return '';
    }
}

const medicineOrderPaymentService = new MedicineOrderPaymentService();
export default medicineOrderPaymentService; 