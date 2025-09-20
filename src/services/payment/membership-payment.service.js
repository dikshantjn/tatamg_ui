import { API_CONFIG, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getToken, getUserId, getUserData } from '../User/Auth/auth.utils';

class MembershipPaymentService {
    constructor() {
        this.razorpay = null;
        this.initializeRazorpay();
    }

    initializeRazorpay() {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                this.razorpay = window.Razorpay;
            };
            script.onerror = (error) => {
                console.error('Failed to load Razorpay SDK:', error);
            };
            document.head.appendChild(script);
        } else if (typeof window !== 'undefined' && window.Razorpay) {
            this.razorpay = window.Razorpay;
        }
    }

    async createOrder(membershipPlanId) {
        try {
            const userId = this.getCurrentUserId();
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.MEMBERSHIP.CREATE_ORDER, {
                userId,
                membershipPlanId
            });
            return response.data;
        } catch (error) {
            console.error('Error creating membership order:', error);
            throw new Error(error.response?.data?.error || 'Failed to create order');
        }
    }

    async verifyPayment(paymentData) {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.MEMBERSHIP.VERIFY_PAYMENT, paymentData);
            return response.data;
        } catch (error) {
            console.error('Error verifying membership payment:', error);
            throw new Error(error.response?.data?.error || 'Payment verification failed');
        }
    }

    async processPayment(planData, onSuccess, onFailure) {
        try {
            if (!validateRazorpayKey(PAYMENT_CONFIG.RAZORPAY.KEY_ID)) {
                throw new Error(PAYMENT_ERRORS.INVALID_RAZORPAY_KEY);
            }

            if (!this.razorpay) {
                this.initializeRazorpay();
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (!this.razorpay) {
                    throw new Error('Razorpay SDK failed to load');
                }
            }

            // Create order on backend
            const orderData = await this.createOrder(planData.membershipPlanId);
            console.log('Order created:', orderData);

            const options = {
                key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
                amount: Math.round(orderData.amount * 100), // Convert to paise
                currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
                name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
                description: `Membership Plan - ${planData.name}`,
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        console.log('Membership Payment Success:', {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            planId: planData.membershipPlanId,
                            planName: planData.name,
                            amount: orderData.amount
                        });

                        // Verify payment on backend
                        const verificationData = {
                            userId: this.getCurrentUserId(),
                            membershipPlanId: planData.membershipPlanId,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            paymentMethod: 'razorpay'
                        };

                        const verificationResult = await this.verifyPayment(verificationData);

                        if (verificationResult.membership) {
                            if (onSuccess) {
                                onSuccess({
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    membership: verificationResult.membership,
                                    plan: orderData.plan,
                                    amount: orderData.amount,
                                    status: 'success',
                                    message: 'Membership activated successfully!',
                                    membershipDetails: verificationResult.membership
                                });
                            }
                        } else {
                            throw new Error('Membership activation failed');
                        }
                    } catch (err) {
                        console.error('Error verifying membership payment:', err);
                        if (onFailure) onFailure('Payment succeeded but membership activation failed: ' + err.message);
                    }
                },
                prefill: {
                    name: this.getUserName() || '',
                    email: this.getUserEmail() || '',
                    contact: this.getUserPhone() || ''
                },
                notes: {
                    userId: this.getCurrentUserId(),
                    membershipPlanId: planData.membershipPlanId,
                    planName: planData.name,
                    planType: planData.type,
                    amount: orderData.amount
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

            const razorpayInstance = new this.razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error('Membership payment error:', error);
            if (onFailure) onFailure(error.message || PAYMENT_ERRORS.PAYMENT_FAILED);
        }
    }

    getCurrentUserId() {
        const userId = getUserId();
        if (userId) return userId;
        const userData = getUserData();
        if (userData) return userData.userId || userData.id || userData.user_id || userData._id;
        return null;
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

const membershipPaymentService = new MembershipPaymentService();
export default membershipPaymentService;
