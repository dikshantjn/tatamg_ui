import { API_CONFIG, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getToken, getUserId, getUserData } from '../User/Auth/auth.utils';

class HospitalBedPaymentService {
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

    async processPayment(bookingData, onSuccess, onFailure) {
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

            const totalAmount = bookingData.price - bookingData.paidAmount;

            const options = {
                key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
                amount: Math.round(totalAmount * 100),
                currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
                name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
                description: `Hospital Bed Booking - ${bookingData.hospital?.name || 'Hospital'}`,
                handler: async (response) => {
                    try {
                        console.log('Payment successful, updating backend...', {
                            bookingId: bookingData.bedBookingId,
                            amount: totalAmount
                        });

                        const updatePaymentUrl = `${API_CONFIG.BASE_URL}${replaceUrlParams(
                            API_CONFIG.ENDPOINTS.HOSPITALS.UPDATE_BED_BOOKING_PAYMENT_STATUS,
                            { bookingId: bookingData.bedBookingId }
                        )}`;

                        console.log('Updating payment status at:', updatePaymentUrl);

                        const updatePaymentResponse = await apiClient.put(updatePaymentUrl, {
                            paidAmount: totalAmount
                        }, {
                            headers: {
                                'Authorization': `Bearer ${getToken()}`
                            }
                        });

                        const result = updatePaymentResponse.data;
                        console.log('Payment status update response:', result);

                        if (updatePaymentResponse.status === 200) {
                            if (onSuccess) {
                                onSuccess({
                                    paymentId: response.razorpay_payment_id,
                                    bookingId: bookingData.bedBookingId,
                                    amount: totalAmount,
                                    status: 'success',
                                    message: 'Payment completed successfully.',
                                    bookingData: result.booking || result.data
                                });
                            }
                        } else {
                            const errorData = updatePaymentResponse.data;
                            console.error('Error response from server:', {
                                status: updatePaymentResponse.status,
                                statusText: updatePaymentResponse.statusText,
                                errorData
                            });
                            throw new Error(`Failed to update payment status: ${updatePaymentResponse.statusText}`);
                        }
                    } catch (err) {
                        console.error('Error updating payment status:', {
                            error: err,
                            message: err.message,
                            stack: err.stack
                        });
                        if (onFailure) onFailure(err.message || 'Payment succeeded but status update failed');
                    }
                },
                prefill: {
                    name: this.getUserName() || '',
                    email: this.getUserEmail() || '',
                    contact: this.getUserPhone() || ''
                },
                notes: {
                    userId: this.getCurrentUserId(),
                    bookingId: bookingData.bedBookingId,
                    hospitalName: bookingData.hospital?.name,
                    bedType: bookingData.bedType,
                    bookingDate: bookingData.bookingDate,
                    timeSlot: bookingData.timeSlot
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

const hospitalBedPaymentService = new HospitalBedPaymentService();
export default hospitalBedPaymentService; 