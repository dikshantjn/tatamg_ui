import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';
import { getUserId, getToken } from '../Auth/auth.utils';

class TrackOrderService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Get all orders for the current user
    async getUserOrders() {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_ORDER.GET_USER_ORDERS_TRACKING, { userId });
            const url = getApiUrl(endpoint);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    }

    // Get order details by order ID
    async getOrderById(orderId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_ORDER.GET_ORDER, { orderId });
            const url = getApiUrl(endpoint);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    }

    // Generate timeline steps based on order status
    generateTimelineSteps(status) {
        const allSteps = [
            {
                id: 1,
                status: 'pending',
                title: 'Order Placed',
                description: 'Your order has been successfully placed',
                icon: '📋',
                color: '#6B7280'
            },
            {
                id: 2,
                status: 'confirmed',
                title: 'Order Confirmed',
                description: 'Order has been confirmed and is being processed',
                icon: '✅',
                color: '#6B7280'
            },
            {
                id: 3,
                status: 'processing',
                title: 'Processing',
                description: 'Your order is being prepared for shipment',
                icon: '⚙️',
                color: '#F59E0B'
            },
            {
                id: 4,
                status: 'shipped',
                title: 'Shipped',
                description: 'Order has been shipped from warehouse',
                icon: '📦',
                color: '#3B82F6'
            },
            {
                id: 5,
                status: 'out_for_delivery',
                title: 'Out for Delivery',
                description: 'Package is out for final delivery',
                icon: '🚚',
                color: '#3B82F6'
            },
            {
                id: 6,
                status: 'delivered',
                title: 'Delivered',
                description: 'Package has been delivered successfully',
                icon: '🎉',
                color: '#10B981'
            }
        ];

        const statusMap = {
            "pending": 0,
            "confirmed": 1,
            "processing": 2,
            "shipped": 3,
            "out_for_delivery": 4,
            "delivered": 5,
            "cancelled": -1
        };

        const currentStepIndex = statusMap[status] || 0;
        const isCancelled = status === 'cancelled';

        return allSteps.map((step, index) => ({
            ...step,
            completed: isCancelled ? false : index <= currentStepIndex,
            active: index === currentStepIndex && !isCancelled,
            cancelled: isCancelled && index === 0
        }));
    }

    // Format order data for display
    formatOrderData(order) {
        const timelineSteps = this.generateTimelineSteps(order.status);
        const currentStep = timelineSteps.find(step => step.active) || timelineSteps[0];
        
        return {
            orderId: order.orderId,
            status: order.status,
            totalAmount: order.totalAmount,
            placedAt: new Date(order.placedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            items: order.items || [],
            timelineSteps,
            currentStep,
            isCancelled: order.status === 'cancelled'
        };
    }

    // Get status color for UI
    getStatusColor(status) {
        const statusColors = {
            'pending': '#6B7280',
            'confirmed': '#6B7280',
            'processing': '#F59E0B',
            'shipped': '#3B82F6',
            'out_for_delivery': '#3B82F6',
            'delivered': '#10B981',
            'cancelled': '#EF4444'
        };
        return statusColors[status] || '#6B7280';
    }

    // Get status display text
    getStatusDisplayText(status) {
        const statusTexts = {
            'pending': 'Order Pending',
            'confirmed': 'Order Confirmed',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusTexts[status] || 'Unknown Status';
    }

    // Fetch active ambulance bookings for the current user
    async getActiveAmbulanceBookings() {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_ACTIVE_BOOKINGS, { userId });
            const url = getApiUrl(endpoint);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching active ambulance bookings:', error);
            throw error;
        }
    }

    // Ambulance status map and timeline steps
    ambulanceStatusMap = {
        "pending": 0,
        "accepted": 1,
        "WaitingForPayment": 2,
        "paymentCompleted": 2,
        "PaymentWaived": 2,
        "OnTheWay": 3,
        "PickedUp": 4,
        "Completed": 5,
    };

    ambulanceTimelineSteps = [
        { id: 0, title: "Pending" },
        { id: 1, title: "Accepted" },
        { id: 2, title: "Payment" },
        { id: 3, title: "On The Way" },
        { id: 4, title: "Picked Up" },
        { id: 5, title: "Completed" },
    ];

    // Format ambulance booking for timeline display
    formatAmbulanceBooking(booking) {
        const currentStep = this.ambulanceStatusMap[booking.status] ?? 0;
        const steps = this.ambulanceTimelineSteps.map((step, idx) => ({
            ...step,
            completed: idx < currentStep,
            active: idx === currentStep,
        }));
        return {
            ...booking,
            timelineSteps: steps,
            placedAt: booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "",
        };
    }

    // Fetch active blood bank bookings for the current user
    async getActiveBloodBankBookings() {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const endpoint = API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_BLOOD_BANK_BOOKINGS_BY_USER.replace(':userId', encodeURIComponent(userId));
            const url = getApiUrl(endpoint);
            const token = getToken && getToken();
            if (!token) throw new Error('User not authenticated');
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch blood bank bookings');
            const data = await response.json();
            if (!data.success || !Array.isArray(data.data) || !data.data.length) return [];
            return data.data;
        } catch (error) {
            console.error('Error fetching active blood bank bookings:', error);
            throw error;
        }
    }

    // Fetch ongoing medicine orders for the current user
    async getOngoingMedicineOrders() {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.TRACK_ORDERS, { userId });
            const url = getApiUrl(endpoint);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.orders || [];
        } catch (error) {
            console.error('Error fetching ongoing medicine orders:', error);
            throw error;
        }
    }
}

export const trackOrderService = new TrackOrderService(); 