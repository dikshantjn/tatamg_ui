import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { getUserId, getToken, getAuthHeader } from '../../services/User/Auth/auth.utils';

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

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
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
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = response.data;
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
        const response = await apiClient.get(url, {
            headers: {
                ...getAuthHeader(),
            }
        });
        if (response.status !== 200) throw new Error('Failed to fetch completed blood bank bookings');
        return response.data;
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
                API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_DELIVERED_ORDERS_NEW,
                { userId: targetUserId }
            );

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            return {
                success: data.success || true,
                data: data.data || [],
                count: data.count || 0,
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
            status: order.status,
            total: order.totalAmount,
            subtotal: order.totalAmount, // Using totalAmount as subtotal since no separate subtotal field
            deliveryCharge: 0, // Not provided in new API response
            platformFee: order.platformFee || 0,
            discountAmount: 0, // Not provided in new API response
            prescriptionId: order.prescriptionId,
            paymentMethod: 'Online Payment', // Default since not provided in response
            paymentStatus: 'Paid', // Default since not provided in response
            transactionId: order.paymentId || 'N/A',
            items: [], // No items array in new API response, will be empty for now
            user: {
                name: order.user?.name || 'Unknown',
                email: order.user?.phone_number || 'N/A', // Using phone as email is not provided
                userId: order.user?.userId
            },
            vendor: {
                name: order.vendor?.name || 'Unknown Vendor',
                vendorId: order.vendor?.vendorId
            },
            deliveryAddress: {
                houseStreet: order.deliveryAddress?.houseStreet || '',
                addressLine1: order.deliveryAddress?.addressLine1 || '',
                addressLine2: order.deliveryAddress?.addressLine2 || '',
                city: order.deliveryAddress?.city || '',
                state: order.deliveryAddress?.state || '',
                zipCode: order.deliveryAddress?.zipCode || '',
                country: order.deliveryAddress?.country || '',
                addressType: order.deliveryAddress?.addressType || 'Home'
            },
            prescription: {
                prescriptionId: order.prescription?.prescriptionId,
                status: order.prescription?.status
            },
            estimatedDelivery: this.calculateEstimatedDelivery(order.createdAt),
            actualDelivery: order.status === 'delivered' ? order.updatedAt : null
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

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
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

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
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
            notes: appointment.notes || '',
            attachments: appointment.attachments || [],
            healthRecordIds: appointment.healthRecordIds || [],
            rescheduledAt: appointment.rescheduledAt,
            rescheduledBy: appointment.rescheduledBy,
            cancelReason: appointment.cancelReason,
            cancelBy: appointment.cancelBy,
            doctorAttendanceStatus: appointment.doctorAttendanceStatus,
            userAttendanceStatus: appointment.userAttendanceStatus,
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
                id: appointment.doctorId,
                vendorId: appointment.doctor?.vendorId
            }
        };
    }

    /**
     * Get completed bed bookings for a user
     * @param {string} userId - User ID (optional, will use current user if not provided)
     * @returns {Promise<Object>} - Response with bookings data
     */
    async getCompletedBedBookings(userId = null) {
        try {
            const targetUserId = userId || getUserId();
            
            if (!targetUserId) {
                throw new Error('User ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.HOSPITALS.GET_COMPLETED_BOOKINGS,
                { userId: targetUserId }
            );

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            return {
                success: true,
                data: data.bookings || [],
                message: data.message || 'Completed bed bookings fetched successfully'
            };

        } catch (error) {
            console.error('Error fetching completed bed bookings:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch completed bed bookings'
            };
        }
    }

    /**
     * Format bed booking data for display
     * @param {Object} booking - Raw booking data from API
     * @returns {Object} - Formatted booking data
     */
    formatBedBookingData(booking) {
        return {
            id: booking.bedBookingId,
            bookingNumber: booking.bedBookingId,
            date: booking.bookingDate,
            timeSlot: booking.timeSlot,
            status: booking.status,
            bedType: booking.bedType,
            paidAmount: booking.paidAmount,
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            hospital: {
                name: booking.hospital?.name || '',
                address: booking.hospital?.address || '',
                city: booking.hospital?.city || '',
                state: booking.hospital?.state || '',
                contactNumber: booking.hospital?.contactNumber || '',
                email: booking.hospital?.email || ''
            },
            user: {
                name: booking.user?.name || '',
                email: booking.user?.emailId || '',
                phone: booking.user?.phone_number || '',
                photo: booking.user?.photo || ''
            }
        };
    }

    /**
     * Get invoice for a specific order
     * @param {string} orderId - Order ID
     * @returns {Promise<Object>} - Response with invoice data
     */
    async getInvoice(orderId) {
        try {
            if (!orderId) {
                throw new Error('Order ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_INVOICE,
                { orderId: orderId }
            );

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'application/pdf'
                },
                responseType: 'blob'
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create a blob URL for the PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);

            return {
                success: true,
                data: {
                    pdfUrl: pdfUrl,
                    blob: blob,
                    orderId: orderId
                },
                message: 'Invoice fetched successfully'
            };

        } catch (error) {
            console.error('Error fetching invoice:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to fetch invoice'
            };
        }
    }

    /**
     * Get clinic appointment invoice PDF
     * @param {string} appointmentId
     * @returns {Promise<{success:boolean,data:{pdfUrl:string,blob:Blob}|null,message:string}>}
     */
    async getClinicInvoice(appointmentId) {
        try {
            if (!appointmentId) {
                throw new Error('Appointment ID is required');
            }

            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.CLINIC_INVOICE.GET_INVOICE,
                { appointmentId }
            );

            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'application/pdf',
                },
                responseType: 'blob',
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);

            return {
                success: true,
                data: { pdfUrl, blob, appointmentId },
                message: 'Clinic invoice fetched successfully',
            };
        } catch (error) {
            console.error('Error fetching clinic invoice:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to fetch clinic invoice',
            };
        }
    }

    /**
     * Get medicine order invoice PDF
     */
    async getMedicineInvoice(orderId) {
        try {
            if (!orderId) throw new Error('Order ID is required');
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_INVOICE,
                { orderId }
            );
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: { ...getAuthHeader(), 'Accept': 'application/pdf' },
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            return { success: true, data: { pdfUrl, blob, orderId } };
        } catch (error) {
            console.error('Error fetching medicine invoice:', error);
            return { success: false, data: null, message: error.message };
        }
    }

    /** Get product order invoice PDF */
    async getProductOrderInvoice(orderId) {
        try {
            if (!orderId) throw new Error('Order ID is required');
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.PRODUCT_ORDER.GET_ORDER_INVOICE,
                { orderId }
            );
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: { ...getAuthHeader(), 'Accept': 'application/pdf' },
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            return { success: true, data: { pdfUrl, blob, orderId } };
        } catch (error) {
            console.error('Error fetching product order invoice:', error);
            return { success: false, data: null, message: error.message };
        }
    }

    /** Get hospital bed booking invoice PDF */
    async getBedBookingInvoice(bookingId) {
        try {
            if (!bookingId) throw new Error('Booking ID is required');
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.HOSPITAL_INVOICE.GET_INVOICE,
                { bookingId }
            );
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: { ...getAuthHeader(), 'Accept': 'application/pdf' },
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            return { success: true, data: { pdfUrl, blob, bookingId } };
        } catch (error) {
            console.error('Error fetching bed booking invoice:', error);
            return { success: false, data: null, message: error.message };
        }
    }

    /** Get lab test invoice PDF */
    async getLabTestInvoice(bookingId) {
        try {
            if (!bookingId) throw new Error('Booking ID is required');
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.LAB_TEST_INVOICE.GET_INVOICE,
                { bookingId }
            );
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: { ...getAuthHeader(), 'Accept': 'application/pdf' },
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            return { success: true, data: { pdfUrl, blob, bookingId } };
        } catch (error) {
            console.error('Error fetching lab test invoice:', error);
            return { success: false, data: null, message: error.message };
        }
    }

    /** Get ambulance booking invoice PDF */
    async getAmbulanceInvoice(requestId) {
        try {
            if (!requestId) throw new Error('Request ID is required');
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.AMBULANCE_INVOICE.GET_INVOICE,
                { requestId }
            );
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: { ...getAuthHeader(), 'Accept': 'application/pdf' },
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            return { success: true, data: { pdfUrl, blob, requestId } };
        } catch (error) {
            console.error('Error fetching ambulance invoice:', error);
            return { success: false, data: null, message: error.message };
        }
    }

    /** Get blood bank booking invoice PDF */
    async getBloodBankInvoice(bookingId) {
        try {
            if (!bookingId) throw new Error('Booking ID is required');
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.BLOOD_BANK_INVOICE.GET_INVOICE,
                { bookingId }
            );
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: { ...getAuthHeader(), 'Accept': 'application/pdf' },
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            return { success: true, data: { pdfUrl, blob, bookingId } };
        } catch (error) {
            console.error('Error fetching blood bank invoice:', error);
            return { success: false, data: null, message: error.message };
        }
    }
}

// Create and export a singleton instance
const orderHistoryService = new OrderHistoryService();
export default orderHistoryService; 