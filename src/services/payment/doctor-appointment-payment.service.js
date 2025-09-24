import { API_CONFIG, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getToken, getUserId, getUserData } from '../User/Auth/auth.utils';
import { doctorConsultationService } from '../User/DoctorConsultation/doctor-consultation.service';

class DoctorAppointmentPaymentService {
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

            const totalAmount = appointmentData.consultationFee;

            const options = {
                key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
                amount: Math.round(totalAmount * 100),
                currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
                name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
                description: `Doctor Appointment - Dr. ${appointmentData.doctorName}`,
                handler: async (response) => {
                    try {
                        // Create appointment data
                        const appointmentPayload = {
                            doctorId: appointmentData.doctorId,
                            userId: this.getCurrentUserId(),
                            vendorId: appointmentData.vendorId,
                            date: appointmentData.selectedDate,
                            time: appointmentData.selectedTimeSlot + ":00",
                            status: "pending",
                            paidAmount: parseInt(totalAmount), // Changed from amount to paidAmount
                            paymentStatus: "Paid",
                            userResponseStatus: "pending",
                            isOnline: appointmentData.isOnline,
                            healthRecordIds: appointmentData.healthRecordIds || [],
                            patientName: this.getUserName() || "",
                            patientContact: this.getUserPhone() || "",
                            patientEmail: this.getUserEmail() || "",
                            reason: appointmentData.reason || "General consultation",
                            notes: "Appointment booked via online payment"
                        };

                        // Log the exact payload being sent
                        console.log('Final appointment payload:', JSON.stringify(appointmentPayload, null, 2));

                        // Create appointment in backend
                        const bookingResult = await doctorConsultationService.createAppointment(appointmentPayload);

                        if (bookingResult.success) {
                            if (onSuccess) {
                                onSuccess({
                                    paymentId: response.razorpay_payment_id,
                                    appointmentId: bookingResult.appointment.clinicAppointmentId,
                                    amount: totalAmount,
                                    status: 'success',
                                    message: 'Payment completed and appointment booked successfully.',
                                    appointmentData: bookingResult.appointment
                                });
                            }
                        } else {
                            throw new Error(bookingResult.message || 'Failed to create appointment');
                        }
                    } catch (err) {
                        console.error('Error creating doctor appointment:', err);
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
                    doctorId: appointmentData.doctorId,
                    doctorName: appointmentData.doctorName,
                    appointmentDate: appointmentData.selectedDate,
                    appointmentTime: appointmentData.selectedTimeSlot,
                    isOnline: appointmentData.isOnline
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

const doctorAppointmentPaymentService = new DoctorAppointmentPaymentService();
export default doctorAppointmentPaymentService; 