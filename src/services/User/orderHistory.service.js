import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';
import { getUserId, getToken } from '../../services/User/Auth/auth.utils';

class OrderHistoryService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    /**
     * Get delivered product orders for a user
     * @param {string} userId - User ID (optional, will use current user if not provided)
     * @returns {Promise<Object>} - Response with orders data
     */
    async getDeliveredProductOrders(userId = null) {
        try {
            const targetUserId = userId || getUserId();
            
            if (!targetUserId) {
                throw new Error('User ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.PRODUCT_ORDER.GET_DELIVERED_ORDERS,
                { userId: targetUserId }
            );

            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.orders || [],
                message: 'Delivered orders fetched successfully'
            };

        } catch (error) {
            console.error('Error fetching delivered orders:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch delivered orders'
            };
        }
    }

    /**
     * Format order data for display
     * @param {Object} order - Raw order data from API
     * @returns {Object} - Formatted order data
     */
    formatOrderData(order) {
        return {
            id: order.orderId,
            orderNumber: order.orderId,
            date: order.placedAt,
            status: order.status,
            total: order.totalAmount,
            items: order.items.map(item => ({
                id: item.orderItemId,
                name: item.product.name,
                price: item.priceAtPurchase,
                quantity: item.quantity,
                image: item.product.images?.[0] || null,
                category: item.product.category,
                subCategory: item.product.subCategory,
                vendor: item.product.productPartner?.brandName || 'Unknown Vendor'
            })),
            user: order.user,
            deliveryAddress: `${order.user.location}, ${order.user.city}`,
            estimatedDelivery: this.calculateEstimatedDelivery(order.placedAt),
            actualDelivery: order.status === 'delivered' ? order.placedAt : null
        };
    }

    /**
     * Calculate estimated delivery date (7 days from order date)
     * @param {string} orderDate - Order placement date
     * @returns {string} - Estimated delivery date
     */
    calculateEstimatedDelivery(orderDate) {
        const orderDateTime = new Date(orderDate);
        const estimatedDate = new Date(orderDateTime.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        return estimatedDate.toISOString();
    }

    /**
     * Get order statistics
     * @param {Array} orders - Array of orders
     * @returns {Object} - Statistics object
     */
    getOrderStatistics(orders) {
        return {
            totalOrders: orders.length,
            totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
            categories: this.getCategoryBreakdown(orders)
        };
    }

    /**
     * Get category breakdown of orders
     * @param {Array} orders - Array of orders
     * @returns {Object} - Category breakdown
     */
    getCategoryBreakdown(orders) {
        const categories = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.category || 'Other';
                categories[category] = (categories[category] || 0) + 1;
            });
        });
        return categories;
    }

    /**
     * Get completed ambulance bookings for a user
     * @param {string} userId - User ID (optional, will use current user if not provided)
     * @returns {Promise<Object>} - Response with bookings data
     */
    async getCompletedAmbulanceBookings(userId = null) {
        try {
            const targetUserId = userId || getUserId();
            if (!targetUserId) {
                throw new Error('User ID is required');
            }
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.AMBULANCE.GET_COMPLETED_BOOKINGS,
                { userId: targetUserId }
            );
            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                success: true,
                data: data.data || [],
                message: 'Completed ambulance bookings fetched successfully'
            };
        } catch (error) {
            console.error('Error fetching completed ambulance bookings:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch completed ambulance bookings'
            };
        }
    }

    /**
     * Format ambulance booking data for display
     * @param {Object} booking - Raw booking data from API
     * @returns {Object} - Formatted booking data
     */
    formatAmbulanceBookingData(booking) {
        return {
            id: booking.requestId,
            bookingNumber: booking.requestId,
            date: booking.timestamp || booking.createdAt,
            status: booking.status,
            total: booking.totalAmount,
            pickupLocation: booking.pickupLocation,
            dropLocation: booking.dropLocation,
            vehicleType: booking.vehicleType,
            agency: booking.agencyProfile?.agencyName || 'Unknown Agency',
            agencyContact: booking.agencyProfile?.contactNumber || '',
            agencyProfile: booking.agencyProfile,
            user: booking.user,
            isPaymentBypassed: booking.isPaymentBypassed,
            baseCharge: booking.baseCharge,
            totalDistance: booking.totalDistance,
            costPerKm: booking.costPerKm,
            actualDelivery: booking.status === 'Completed' ? (booking.updatedAt || booking.timestamp) : null
        };
    }

    async getCompletedBloodBankBookings() {
        const userId = getUserId && getUserId();
        if (!userId) throw new Error('User not authenticated');
        const endpoint = API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_COMPLETED_BLOOD_BANK_BOOKINGS_BY_USER.replace(':userId', encodeURIComponent(userId));
        const url = getApiUrl(endpoint);
        const token = getToken && getToken();
        if (!token) throw new Error('User not authenticated');
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch completed blood bank bookings');
        return await response.json();
    }

    /**
     * Get delivered medicine orders for a user
     * @param {string} userId - User ID (optional, will use current user if not provided)
     * @returns {Promise<Object>} - Response with orders data
     */
    async getDeliveredMedicineOrders(userId = null) {
        try {
            const targetUserId = userId || getUserId();
            
            if (!targetUserId) {
                throw new Error('User ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_DELIVERED_ORDERS,
                { userId: targetUserId }
            );

            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.orders || [],
                message: data.message || 'Delivered orders fetched successfully'
            };

        } catch (error) {
            console.error('Error fetching delivered medicine orders:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch delivered medicine orders'
            };
        }
    }

    /**
     * Format medicine order data for display
     * @param {Object} order - Raw order data from API
     * @returns {Object} - Formatted order data
     */
    formatMedicineOrderData(order) {
        return {
            id: order.orderId,
            orderNumber: order.orderId,
            date: order.createdAt,
            status: order.orderStatus,
            total: order.totalAmount,
            subtotal: order.subtotal,
            deliveryCharge: order.deliveryCharge,
            platformFee: order.platformFee,
            discountAmount: order.discountAmount,
            prescriptionId: order.prescriptionId,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            transactionId: order.transactionId,
            items: order.Carts.map(item => ({
                id: item.cartId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                manufacturer: item.MedicineProduct?.manufacturer || 'Unknown',
                type: item.MedicineProduct?.type || 'N/A',
                packSize: item.MedicineProduct?.packSizeLabel || 'N/A',
                composition: item.MedicineProduct?.shortComposition || 'N/A',
                discount: item.MedicineProduct?.discount || 0,
                image: item.MedicineProduct?.productURLs?.[0] || null
            })),
            user: {
                name: order.User?.name || 'Unknown',
                email: order.User?.emailId || 'N/A',
                userId: order.User?.userId
            },
            estimatedDelivery: order.estimatedDeliveryDate || this.calculateEstimatedDelivery(order.createdAt),
            actualDelivery: order.orderStatus === 'Delivered' ? order.updatedAt : null
        };
    }

    /**
     * Get completed lab test bookings for a user
     * @param {string} userId - User ID (optional, will use current user if not provided)
     * @returns {Promise<Object>} - Response with bookings data
     */
    async getCompletedLabTestBookings(userId = null) {
        try {
            const targetUserId = userId || getUserId();
            
            if (!targetUserId) {
                throw new Error('User ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.LAB_TEST.GET_COMPLETED_BOOKINGS,
                { userId: targetUserId }
            );

            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data || [],
                message: data.message || 'Completed lab test bookings fetched successfully'
            };

        } catch (error) {
            console.error('Error fetching completed lab test bookings:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch completed lab test bookings'
            };
        }
    }

    /**
     * Format lab test booking data for display
     * @param {Object} booking - Raw booking data from API
     * @returns {Object} - Formatted booking data
     */
    formatLabTestBookingData(booking) {
        return {
            id: booking.bookingDetails.bookingId,
            bookingNumber: booking.bookingDetails.bookingId,
            date: booking.bookingDetails.createdAt,
            status: booking.bookingDetails.bookingStatus,
            total: booking.bookingDetails.totalAmount,
            testFees: booking.bookingDetails.testFees,
            reportDeliveryFees: booking.bookingDetails.reportDeliveryFees,
            discount: booking.bookingDetails.discount,
            gst: booking.bookingDetails.gst,
            selectedTests: booking.bookingDetails.selectedTests,
            bookingDate: booking.bookingDetails.bookingDate,
            bookingTime: booking.bookingDetails.bookingTime,
            homeCollectionRequired: booking.bookingDetails.homeCollectionRequired,
            reportDeliveryAtHome: booking.bookingDetails.reportDeliveryAtHome,
            prescriptionUrl: booking.bookingDetails.prescriptionUrl,
            paymentStatus: booking.bookingDetails.paymentStatus,
            reportUrls: booking.bookingDetails.reportUrls,
            diagnosticCenter: {
                id: booking.diagnosticCenterDetails.diagnosticCenterId,
                name: booking.diagnosticCenterDetails.name,
                address: `${booking.diagnosticCenterDetails.address}, ${booking.diagnosticCenterDetails.city}, ${booking.diagnosticCenterDetails.state} - ${booking.diagnosticCenterDetails.pincode}`,
                phone: booking.diagnosticCenterDetails.mainContactNumber,
                email: booking.diagnosticCenterDetails.email,
                website: booking.diagnosticCenterDetails.website,
                locationUrl: booking.diagnosticCenterDetails.googleMapsLocationUrl
            },
            user: {
                name: booking.userDetails.name,
                email: booking.userDetails.emailId,
                phone: booking.userDetails.phone_number,
                userId: booking.userDetails.userId,
                photo: booking.userDetails.photo
            },
            actualDelivery: booking.bookingDetails.bookingStatus === 'Completed' ? booking.bookingDetails.updatedAt : null
        };
    }

    /**
     * Get clinic appointments for a user
     * @param {string} userId - User ID (optional, will use current user if not provided)
     * @returns {Promise<Object>} - Response with appointments data
     */
    async getClinicAppointments(userId = null) {
        try {
            const targetUserId = userId || getUserId();
            
            if (!targetUserId) {
                throw new Error('User ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_USER_APPOINTMENTS,
                { userId: targetUserId }
            );

            const response = await fetch(getApiUrl(endpoint), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.appointments || [],
                message: 'Appointments fetched successfully'
            };

        } catch (error) {
            console.error('Error fetching clinic appointments:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch clinic appointments'
            };
        }
    }

    /**
     * Format clinic appointment data for display
     * @param {Object} appointment - Raw appointment data from API
     * @returns {Object} - Formatted appointment data
     */
    formatClinicAppointmentData(appointment) {
        return {
            id: appointment.clinicAppointmentId,
            appointmentNumber: appointment.clinicAppointmentId,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            isOnline: appointment.isOnline,
            paidAmount: appointment.paidAmount,
            paymentStatus: appointment.paymentStatus,
            userResponseStatus: appointment.userResponseStatus,
            meetingUrl: appointment.meetingUrl,
            reminderTime: appointment.reminderTime,
            reminderSent: appointment.reminderSent,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            user: {
                name: appointment.user?.name || '',
                email: appointment.user?.emailId || '',
                phone: appointment.user?.phone_number || ''
            },
            doctor: {
                name: appointment.doctor?.doctorName || '',
                specializations: appointment.doctor?.specializations || [],
                id: appointment.doctorId
            }
        };
    }
}

// Create and export a singleton instance
const orderHistoryService = new OrderHistoryService();
export default orderHistoryService; 