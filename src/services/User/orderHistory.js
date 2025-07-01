import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';
import { getUserId } from '../User/Auth/auth.utils';

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
}

// Create and export a singleton instance
const orderHistoryService = new OrderHistoryService();
export default orderHistoryService; 