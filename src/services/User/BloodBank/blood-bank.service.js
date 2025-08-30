import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getToken } from '../Auth/auth.utils';

export async function getActiveBloodBanks() {
  const endpoint = API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_ACTIVE_BLOOD_BANKS;
  const url = getApiUrl(endpoint);
  const response = await apiClient.get(url);
  if (response.status !== 200) throw new Error('Failed to fetch blood banks');
  return response.data;
}

export async function createBloodBankRequest({ userId, customerName, bloodType, units, prescriptionUrls, latitude, longitude, radius = 50 }) {
  const endpoint = API_CONFIG.ENDPOINTS.BLOOD_BANK.CREATE_BLOOD_BANK_REQUEST;
  const url = getApiUrl(endpoint);
  const token = getToken && getToken();
  if (!token) throw new Error('User not authenticated');
  const response = await apiClient.post(url, { userId, customerName, bloodType, units, prescriptionUrls, latitude, longitude, radius }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status !== 200) throw new Error('Failed to create blood bank request');
  return response.data;
}

export async function getOngoingBloodBankBooking(userId) {
  const endpoint = API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_BLOOD_BANK_BOOKINGS_BY_USER;
  const url = getApiUrl(endpoint.replace(':userId', encodeURIComponent(userId)));
  const token = getToken && getToken();
  if (!token) throw new Error('User not authenticated');
  const response = await apiClient.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status !== 200) throw new Error('Failed to fetch blood bank bookings');
  const data = response.data;
  if (!data.success || !Array.isArray(data.data) || !data.data.length) return null;
  // Debug: log the booking object
  console.log('[getOngoingBloodBankBooking] booking:', data.data[0]);
  // Return the latest ongoing booking (first in sorted array)
  return data.data[0];
}

export async function updateBloodBankPaymentCompleted(bookingId) {
  const endpoint = API_CONFIG.ENDPOINTS.BLOOD_BANK.UPDATE_BLOOD_BANK_PAYMENT;
  const url = getApiUrl(endpoint.replace(':bookingId', encodeURIComponent(bookingId)));
  const token = getToken && getToken();
  if (!token) throw new Error('User not authenticated');
          const response = await apiClient.put(url, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (response.data && response.data.success) {
    return response.data;
  }
  throw new Error('Failed to update payment status');
} 