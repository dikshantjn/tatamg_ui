import { apiClient } from '../../config/apiClient';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';

export const getMedicalStoreVendorProfile = async (vendorId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.GET_PROFILE, { vendorId })
    );
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMedicalStoreVendorProfile = async (vendorId, profileData) => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.UPDATE_PROFILE);
    const requestBody = {
      vendorId: vendorId,
      ...profileData
    };
    const response = await apiClient.put(url, requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptPrescriptionRequest = async (prescriptionId, vendorId, jsonPrescription) => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.ACCEPT_PRESCRIPTION);
    const requestBody = {
      prescriptionId: prescriptionId,
      vendorId: vendorId,
      jsonPrescription: jsonPrescription
    };
    const response = await apiClient.post(url, requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPendingPrescriptionRequests = async (vendorId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.GET_PENDING_REQUESTS, { vendorId })
    );
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllOrders = async (vendorId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.GET_ALL_ORDERS, { vendorId })
    );
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmOrder = async (orderId, vendorId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.CONFIRM_ORDER, { orderId })
    );
    const requestBody = {
      vendorId: vendorId
    };
    const response = await apiClient.put(url, requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchMedicines = async (searchTerm, vendorId) => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.SEARCH_MEDICINES);
    const params = {
      s: searchTerm,
      vendorId: vendorId
    };
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToUserCart = async (cartData) => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.ADD_TO_USER_CART);
    const response = await apiClient.post(url, cartData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCartItems = async (orderId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.GET_CART_ITEMS, { orderId })
    );
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (cartId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.DELETE_CART_ITEM, { cartId })
    );
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCartItemQuantity = async (cartId, type) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.UPDATE_CART_QUANTITY, { cartId })
    );
    const response = await apiClient.put(url, { type });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.UPDATE_ORDER_STATUS, { orderId })
    );
    const response = await apiClient.put(url, { newStatus });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorProducts = async (vendorId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.GET_VENDOR_PRODUCTS, { vendorId })
    );
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.DELETE_PRODUCT, { productId })
    );
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (vendorId, productData) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.ADD_PRODUCT, { vendorId })
    );
    const response = await apiClient.post(url, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.UPDATE_PRODUCT, { productId })
    );
    const response = await apiClient.put(url, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 