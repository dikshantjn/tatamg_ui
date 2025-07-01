import { API_CONFIG } from '../../config/api.config';
import { PAYMENT_CONFIG, PAYMENT_ERRORS, validateRazorpayKey } from '../../config/payment.config';
import { getUserId, getUserData } from '../User/Auth/auth.utils';
import { ambulanceService } from '../User/Ambulance/ambulance.service';

class AmbulanceBookingPaymentServiceClass {
  constructor() {
    this.razorpay = null;
    this.initializeRazorpay();
  }

  // Load Razorpay SDK
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

  // Open Razorpay checkout for ambulance booking
  async processPayment({ amount, bookingId, user, description }, onSuccess, onFailure) {
    try {
      if (!validateRazorpayKey(PAYMENT_CONFIG.RAZORPAY.KEY_ID)) {
        throw new Error(PAYMENT_ERRORS.INVALID_RAZORPAY_KEY);
      }
      if (!this.razorpay) {
        this.initializeRazorpay();
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!this.razorpay) throw new Error('Razorpay SDK failed to load');
      }
      const options = {
        key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
        amount: Math.round(amount * 100),
        currency: PAYMENT_CONFIG.RAZORPAY.CURRENCY,
        name: PAYMENT_CONFIG.RAZORPAY.COMPANY_NAME,
        description: description || `Ambulance Booking #${bookingId}`,
        handler: async (response) => {
          try {
            // Update backend payment status after successful payment
            await ambulanceService.updatePaymentCompleted(bookingId);
            if (onSuccess) onSuccess(response);
          } catch (err) {
            if (onFailure) onFailure('Payment succeeded but failed to update backend: ' + (err.message || err));
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          userId: user?.userId || getUserId(),
          bookingId: bookingId
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
}

export const AmbulanceBookingPaymentService = new AmbulanceBookingPaymentServiceClass();
export default AmbulanceBookingPaymentService; 