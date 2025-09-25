import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getAuthHeader } from '../Auth/auth.utils';

class NotificationService {
    /**
     * Fetch notifications for a user
     * @param {string} userId - The user ID
     * @returns {Promise<Object>} Notifications data
     */
    async getNotifications(userId) {
        try {
            console.log('Fetching notifications for userId:', userId);
            
            const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?userId=${userId}`;
            const url = getApiUrl(endpoint);
            
            console.log('Making API call to:', url);
            
            const response = await apiClient.get(url, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Notifications response status:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `Failed to fetch notifications: ${response.status}`);
            }

            const notificationsData = response.data;
            console.log('Notifications fetched successfully:', notificationsData);
            
            return {
                status: response.status,
                data: notificationsData,
            };
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    /**
     * Mark a notification as read
     * @param {string} notificationId - The notification ID
     * @returns {Promise<Object>} Updated notification data
     */
    async markAsRead(notificationId) {
        try {
            console.log('Marking notification as read:', notificationId);
            
            const endpoint = API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_AS_READ.replace(':notificationId', notificationId);
            const url = getApiUrl(endpoint);
            
            console.log('Making API call to:', url);
            
            const response = await apiClient.put(url, {}, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Mark as read response status:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `Failed to mark notification as read: ${response.status}`);
            }

            const updatedNotification = response.data;
            console.log('Notification marked as read successfully:', updatedNotification);
            
            return {
                status: response.status,
                data: updatedNotification,
            };
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read for a user
     * @param {string} userId - The user ID
     * @returns {Promise<Object>} Success response
     */
    async markAllAsRead(userId) {
        try {
            console.log('Marking all notifications as read for userId:', userId);
            
            const endpoint = API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ;
            const url = getApiUrl(endpoint);
            
            console.log('Making API call to:', url);
            
            const response = await apiClient.put(url, { userId }, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Mark all as read response status:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `Failed to mark all notifications as read: ${response.status}`);
            }

            const result = response.data;
            console.log('All notifications marked as read successfully:', result);
            
            return {
                status: response.status,
                data: result,
            };
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Delete a notification
     * @param {string} notificationId - The notification ID
     * @returns {Promise<Object>} Success response
     */
    async deleteNotification(notificationId) {
        try {
            console.log('Deleting notification:', notificationId);
            
            const endpoint = API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE_NOTIFICATION.replace(':notificationId', notificationId);
            const url = getApiUrl(endpoint);
            
            console.log('Making API call to:', url);
            
            const response = await apiClient.delete(url, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Delete notification response status:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `Failed to delete notification: ${response.status}`);
            }

            const result = response.data;
            console.log('Notification deleted successfully:', result);
            
            return {
                status: response.status,
                data: result,
            };
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Get unread notification count for a user
     * @param {string} userId - The user ID
     * @returns {Promise<number>} Unread count
     */
    async getUnreadCount(userId) {
        try {
            const response = await this.getNotifications(userId);
            if (response.data && response.data.notifications) {
                const unreadCount = response.data.notifications.filter(notification => !notification.isRead).length;
                return unreadCount;
            }
            return 0;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    /**
     * Format notification data for display
     * @param {Object} notification - Raw notification data from API
     * @returns {Object} Formatted notification data
     */
    formatNotification(notification) {
        return {
            id: notification.notificationId,
            userId: notification.userId,
            vendorId: notification.vendorId,
            title: notification.title || '',
            body: notification.body || '',
            type: notification.type || '',
            data: notification.data || {},
            isRead: notification.isRead || false,
            createdAt: notification.createdAt ? new Date(notification.createdAt) : new Date(),
            updatedAt: notification.updatedAt ? new Date(notification.updatedAt) : new Date(),
        };
    }

    /**
     * Get notification icon based on type
     * @param {string} type - Notification type
     * @returns {string} Icon emoji or name
     */
    getNotificationIcon(type) {
        const iconMap = {
            'CLINIC_APPOINTMENT_ORDER_HISTORY': '🏥',
            'appointment_postponed': '⏰',
            'appointment_confirmed': '✅',
            'appointment_cancelled': '❌',
            'order_confirmed': '📦',
            'order_delivered': '🚚',
            'order_cancelled': '❌',
            'payment_success': '💳',
            'payment_failed': '⚠️',
            'lab_test_completed': '🧪',
            'ambulance_assigned': '🚑',
            'blood_bank_confirmed': '🩸',
            'membership_activated': '⭐',
            'general': '🔔'
        };
        
        return iconMap[type] || '🔔';
    }

    /**
     * Get notification color based on type
     * @param {string} type - Notification type
     * @returns {string} Color hex code
     */
    getNotificationColor(type) {
        const colorMap = {
            'CLINIC_APPOINTMENT_ORDER_HISTORY': '#4CAF50',
            'appointment_postponed': '#FF9800',
            'appointment_confirmed': '#4CAF50',
            'appointment_cancelled': '#F44336',
            'order_confirmed': '#2196F3',
            'order_delivered': '#4CAF50',
            'order_cancelled': '#F44336',
            'payment_success': '#4CAF50',
            'payment_failed': '#F44336',
            'lab_test_completed': '#9C27B0',
            'ambulance_assigned': '#FF5722',
            'blood_bank_confirmed': '#E91E63',
            'membership_activated': '#FF9800',
            'general': '#607D8B'
        };
        
        return colorMap[type] || '#607D8B';
    }
}

export const notificationService = new NotificationService();
export default notificationService;
