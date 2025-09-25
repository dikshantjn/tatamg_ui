import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getAuthHeader } from '../Auth/auth.utils';

class FCMService {
  // Save FCM token to backend
  async saveFCMToken(userId, fcmToken) {
    try {
      console.log('💾 FCM Service: Saving FCM token for userId:', userId);
      console.log('💾 FCM Service: Token preview:', fcmToken.substring(0, 20) + '...');
      
      const endpoint = API_CONFIG.ENDPOINTS.FCM.SAVE_TOKEN;
      const url = getApiUrl(endpoint);
      
      console.log('💾 FCM Service: API URL:', url);
      console.log('💾 FCM Service: Request payload:', { userId, fcmToken: fcmToken.substring(0, 20) + '...' });
      
      const authHeaders = getAuthHeader();
      console.log('💾 FCM Service: Auth headers:', authHeaders);
      
      const response = await apiClient.post(url, {
        userId,
        fcmToken
      }, {
        headers: {
          ...authHeaders,
        }
      });
      
      console.log('✅ FCM Service: Token saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ FCM Service: Error saving FCM token:', error);
      console.error('❌ FCM Service: Error response:', error.response?.data);
      console.error('❌ FCM Service: Error status:', error.response?.status);
      throw error;
    }
  }

  // Update FCM token
  async updateFCMToken(userId, fcmToken) {
    try {
      console.log('🔄 FCM Service: Updating FCM token for userId:', userId);
      console.log('🔄 FCM Service: Token preview:', fcmToken.substring(0, 20) + '...');
      
      const endpoint = API_CONFIG.ENDPOINTS.FCM.UPDATE_TOKEN;
      const url = getApiUrl(endpoint);
      
      console.log('🔄 FCM Service: API URL:', url);
      
      const response = await apiClient.post(url, {
        userId,
        fcmToken
      }, {
        headers: {
          ...getAuthHeader(),
        }
      });
      
      console.log('✅ FCM Service: Token updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ FCM Service: Error updating FCM token:', error);
      console.error('❌ FCM Service: Error response:', error.response?.data);
      console.error('❌ FCM Service: Error status:', error.response?.status);
      throw error;
    }
  }

  // Remove FCM token (for logout)
  async removeFCMToken(userId) {
    try {
      console.log('Removing FCM token for userId:', userId);
      
      const endpoint = API_CONFIG.ENDPOINTS.FCM.REMOVE_TOKEN;
      const url = getApiUrl(endpoint);
      
      const response = await apiClient.delete(url, {
        headers: {
          ...getAuthHeader(),
        }
      });
      
      console.log('FCM token removed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  }

  // Update FCM token for vendor
  async updateVendorFCMToken(vendorId, fcmToken) {
    try {
      console.log('Updating FCM token for vendorId:', vendorId);
      
      const endpoint = API_CONFIG.ENDPOINTS.FCM.VENDOR_UPDATE;
      const url = getApiUrl(endpoint);
      
      const response = await apiClient.post(url, {
        vendorId,
        fcmToken
      }, {
        headers: {
          ...getAuthHeader(),
        }
      });
      
      console.log('Vendor FCM token updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating vendor FCM token:', error);
      throw error;
    }
  }

  // Remove FCM token for vendor (for logout)
  async removeVendorFCMToken(vendorId) {
    try {
      console.log('Removing FCM token for vendorId:', vendorId);
      
      const endpoint = API_CONFIG.ENDPOINTS.FCM.VENDOR_DELETE;
      const url = getApiUrl(endpoint);
      
      const response = await apiClient.delete(url, {
        headers: {
          ...getAuthHeader(),
        }
      });
      
      console.log('Vendor FCM token removed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing vendor FCM token:', error);
      throw error;
    }
  }
}

export const fcmService = new FCMService();
export default fcmService;
