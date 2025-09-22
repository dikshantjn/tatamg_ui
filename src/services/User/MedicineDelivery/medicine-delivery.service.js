import { apiClient } from '../../../config/apiClient';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';

export const uploadPrescriptionService = async (userId, prescriptionUrl, userLocation) => {
  const endpoint = getApiUrl(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.UPLOAD_PRESCRIPTION);
  const payload = { userId, prescriptionUrl, userLocation };
  return apiClient.post(endpoint, payload);
};

export const searchMoreVendorsService = async (prescriptionId, userLocation) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.SEARCH_MORE_VENDORS, { prescriptionId }));
  return apiClient.post(endpoint, { userLocation });
};

export const getCartItemsByOrderId = async (orderId) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_CART_ITEMS_BY_ORDER, { orderId }));
  const response = await apiClient.get(endpoint);
  return response.data.cartItems || [];
};

export const getUserOrdersWithCart = async (userId) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_USER_ORDERS_WITH_CART, { userId }));
  const response = await apiClient.get(endpoint);
  return response.data.orders || [];
};

export const updateMedicineOrder = async (orderId, updateFields) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.UPDATE_ORDER, { orderId }));
  const response = await apiClient.put(endpoint, updateFields);
  return response.data;
};

export const getPendingMedicineOrders = async (userId) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_PENDING_ORDERS, { userId }));
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const placeMedicineOrder = async (orderIds, addressId, paymentId, retryCount = 0) => {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second base delay
  
  try {
    const endpoint = getApiUrl(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.PLACE_MEDICINE_ORDER);
    const payload = {
      orderIds,
      addressId,
      paymentId
    };
    const response = await apiClient.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error(`Medicine order placement attempt ${retryCount + 1} failed:`, error);
    
    // Retry for network errors or server errors (5xx)
    if (retryCount < maxRetries && (
      error.code === 'ECONNABORTED' || // timeout
      error.code === 'ENOTFOUND' || // DNS error
      error.code === 'ECONNREFUSED' || // connection refused
      (error.response && error.response.status >= 500) // server errors
    )) {
      const delay = retryDelay * Math.pow(2, retryCount); // exponential backoff
      console.log(`Retrying medicine order placement in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return placeMedicineOrder(orderIds, addressId, paymentId, retryCount + 1);
    }
    
    // If max retries reached or non-retryable error, throw the error
    throw error;
  }
};

 