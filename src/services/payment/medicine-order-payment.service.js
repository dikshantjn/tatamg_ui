import { API_CONFIG, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getToken, getUserId, getUserData } from '../User/Auth/auth.utils';
import { updateMedicineOrder } from '../User/MedicineDelivery/medicine-delivery.service';

class MedicineOrderPaymentService {
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

    async processPayment(orderData, onSuccess, onFailure) {
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
            const options = {
                key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
                amount: Math.round(orderData.total * 100),
                currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
                name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
                description: `Medicine Order for ₹${orderData.total}`,
                handler: async (response) => {
                    try {
                        // Debugging logs
                        console.debug('updateMedicineOrder orderId:', orderData.orderId);
                        console.debug('updateMedicineOrder payload:', {
                            addressId: orderData.addressId || (orderData.deliveryAddress && orderData.deliveryAddress.addressId) || '',
                            appliedCoupon: orderData.appliedCoupon || '',
                            discountAmount: orderData.discount || 0,
                            subtotal: orderData.subtotal,
                            deliveryCharge: orderData.deliveryCharge,
                            platformFee: orderData.platformFee,
                            paymentMethod: 'Razorpay',
                            transactionId: response.razorpay_payment_id,
                            paymentStatus: 'Paid',
                            estimatedDeliveryDate: orderData.estimatedDeliveryDate || null,
                            trackingId: orderData.trackingId || '',
                            orderStatus: 'PaymentConfirmed',
                            totalAmount: orderData.total
                        });
                        // Update order in DB after payment
                        await updateMedicineOrder(orderData.orderId, {
                            addressId: orderData.addressId || (orderData.deliveryAddress && orderData.deliveryAddress.addressId) || '',
                            appliedCoupon: orderData.appliedCoupon || '',
                            discountAmount: orderData.discount || 0,
                            subtotal: orderData.subtotal,
                            deliveryCharge: orderData.deliveryCharge,
                            platformFee: orderData.platformFee,
                            paymentMethod: 'Razorpay',
                            transactionId: response.razorpay_payment_id,
                            paymentStatus: 'Paid',
                            estimatedDeliveryDate: orderData.estimatedDeliveryDate || null,
                            trackingId: orderData.trackingId || '',
                            orderStatus: 'PaymentConfirmed',
                            totalAmount: orderData.total
                        });
                        if (onSuccess) {
                            onSuccess({
                                paymentId: response.razorpay_payment_id,
                                orderId: orderData.orderId,
                                amount: orderData.total,
                                status: 'success',
                                message: 'Payment completed and order updated.'
                            });
                        }
                    } catch (err) {
                        if (onFailure) onFailure('Payment succeeded but order update failed.');
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
            const razorpayInstance = new this.razorpay(options);
            razorpayInstance.open();
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