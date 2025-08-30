import { apiClient } from '../../../config/apiClient';
import { API_CONFIG } from '../../../config/api.config';

export const ambulanceService = {
  getAllAmbulances: async () => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AMBULANCE.GET_ALL}`;
    const response = await apiClient.get(url);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch ambulances');
  },
  requestAmbulance: async (userId, vendorId) => {
    console.log('[AmbulanceService] requestAmbulance called with:', { userId, vendorId });
    try {
      const payload = { userId, vendorId };
      console.log('[AmbulanceService] Sending payload:', payload);
      const response = await apiClient.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AMBULANCE.REQUEST}`, payload);
      console.log('[AmbulanceService] Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[AmbulanceService] Error:', error);
      if (error.response) {
        console.error('[AmbulanceService] Error response data:', error.response.data);
      }
      return { success: false, message: error.message };
    }
  },
  getActiveBookings: async (userId) => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AMBULANCE.GET_ACTIVE_BOOKINGS.replace(':userId', userId)}`;
    const response = await apiClient.get(url);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch active ambulance bookings');
  },
  updatePaymentCompleted: async (requestId) => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_PAYMENT_COMPLETED.replace(':requestId', requestId)}`;
    const response = await apiClient.put(url);
    if (response.data && response.data.success) {
      return response.data;
    }
    throw new Error('Failed to update payment completed status');
  }
}; 