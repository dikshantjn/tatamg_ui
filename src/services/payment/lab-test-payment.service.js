import { API_CONFIG, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getToken, getUserId, getUserData } from '../User/Auth/auth.utils';
import labTestService from '../User/LabTest/lab-test.service';

class LabTestPaymentService {
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

    async processPayment(appointmentData, onSuccess, onFailure) {
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

            // Calculate total amount (you can add pricing logic here)
            const basePrice = 500; // Base price for lab test
            const homeCollectionFee = appointmentData.homeCollection ? 200 : 0;
            const reportDeliveryFee = appointmentData.reportDelivery ? 100 : 0;
            const totalAmount = basePrice + homeCollectionFee + reportDeliveryFee;

            const options = {
                key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
                amount: Math.round(totalAmount * 100),
                currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
                name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
                description: `Lab Test Appointment - ${appointmentData.labName}`,
                handler: async (response) => {
                    try {
                        // Debugging logs
                        console.debug('Lab Test Appointment Payment Success:', {
                            appointmentId: appointmentData.appointmentId,
                            labId: appointmentData.labId,
                            labName: appointmentData.labName,
                            selectedTests: appointmentData.selectedTests,
                            appointmentDate: appointmentData.selectedDate,
                            appointmentTime: appointmentData.selectedTime,
                            homeCollection: appointmentData.homeCollection,
                            reportDelivery: appointmentData.reportDelivery,
                            totalAmount: totalAmount,
                            paymentId: response.razorpay_payment_id
                        });

                        // Create booking in backend after successful payment
                        const bookingData = {
                            vendorId: appointmentData.vendorId, // Use the actual vendorId from lab data
                            userId: this.getCurrentUserId(), // Get the current user ID
                            selectedTests: appointmentData.selectedTests,
                            bookingDate: appointmentData.selectedDate,
                            bookingTime: appointmentData.selectedTime,
                            homeCollectionRequired: appointmentData.homeCollection,
                            reportDeliveryAtHome: appointmentData.reportDelivery,
                            prescriptionUrl: appointmentData.prescription,
                            testFees: basePrice,
                            reportDeliveryFees: reportDeliveryFee,
                            discount: 0,
                            gst: 0,
                            totalAmount: totalAmount,
                            userAddress: '',
                            userLocation: '',
                            centerLocationUrl: ''
                        };

                        // Debug logging for booking data
                        console.log('🔍 Creating Lab Test Booking:');
                        console.log('📋 Vendor ID:', bookingData.vendorId);
                        console.log('👤 User ID:', bookingData.userId);
                        console.log('🏥 Lab Name:', appointmentData.labName);

                        const bookingResult = await labTestService.createBooking(bookingData);

                        if (bookingResult.success) {
                            if (onSuccess) {
                                onSuccess({
                                    paymentId: response.razorpay_payment_id,
                                    appointmentId: appointmentData.appointmentId,
                                    bookingId: bookingResult.data.bookingDetails.bookingId,
                                    amount: totalAmount,
                                    status: 'success',
                                    message: 'Payment completed and appointment booked successfully.',
                                    bookingData: bookingResult.data
                                });
                            }
                        } else {
                            throw new Error(bookingResult.message || 'Failed to create booking');
                        }
                    } catch (err) {
                        console.error('Error creating lab test booking:', err);
                        if (onFailure) onFailure('Payment succeeded but appointment booking failed: ' + err.message);
                    }
                },
                prefill: {
                    name: this.getUserName() || '',
                    email: this.getUserEmail() || '',
                    contact: this.getUserPhone() || ''
                },
                notes: {
                    userId: this.getCurrentUserId(),
                    labId: appointmentData.labId,
                    labName: appointmentData.labName,
                    selectedTests: JSON.stringify(appointmentData.selectedTests),
                    appointmentDate: appointmentData.selectedDate,
                    appointmentTime: appointmentData.selectedTime,
                    homeCollection: appointmentData.homeCollection,
                    reportDelivery: appointmentData.reportDelivery
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

const labTestPaymentService = new LabTestPaymentService();
export default labTestPaymentService; 