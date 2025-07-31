import axios from 'axios';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';

export const uploadPrescriptionService = async (userId, prescriptionUrl, userLocation) => {
  const endpoint = getApiUrl(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.UPLOAD_PRESCRIPTION);
  const payload = { userId, prescriptionUrl, userLocation };
  return axios.post(endpoint, payload);
};

export const searchMoreVendorsService = async (prescriptionId, userLocation) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.SEARCH_MORE_VENDORS, { prescriptionId }));
  return axios.post(endpoint, { userLocation });
};

export const getCartItemsByOrderId = async (orderId) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_CART_ITEMS_BY_ORDER, { orderId }));
  const response = await axios.get(endpoint);
  return response.data.cartItems || [];
};

export const getUserOrdersWithCart = async (userId) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_USER_ORDERS_WITH_CART, { userId }));
  const response = await axios.get(endpoint);
  return response.data.orders || [];
};

export const updateMedicineOrder = async (orderId, updateFields) => {
  const endpoint = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.UPDATE_ORDER, { orderId }));
  const response = await axios.put(endpoint, updateFields);
  return response.data;
};

 