import axios from 'axios';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';

export const getProductPartnerProfile = async (vendorId) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.GET_VENDOR_PROFILE, { vendorId }));
    const response = await axios.get(url);
    
    // Debug log to see the actual API response
    console.log('Product Partner Profile API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching product partner profile:', error);
    throw error;
  }
};

export const updateProductPartnerProfile = async (vendorId, profileData) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.UPDATE_VENDOR_PROFILE, { vendorId }));
    const response = await axios.put(url, profileData);
    
    // Debug log to see the actual API response
    console.log('Product Partner Profile Update API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error updating product partner profile:', error);
    throw error;
  }
};

export const getVendorProducts = async (vendorId) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.GET_VENDOR_PRODUCTS, { vendorId }));
    const response = await axios.get(url);
    
    // Debug log to see the actual API response
    console.log('Vendor Products API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.ADD_PRODUCT);
    const response = await axios.post(url, productData);
    
    // Debug log to see the actual API response
    console.log('Add Product API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.DELETE_PRODUCT, { productId }));
    const response = await axios.delete(url);
    
    // Debug log to see the actual API response
    console.log('Delete Product API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.UPDATE_PRODUCT, { productId }));
    const response = await axios.put(url, productData);
    
    // Debug log to see the actual API response
    console.log('Update Product API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const getPendingOrders = async (vendorId) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.GET_PENDING_ORDERS, { vendorId }));
    const response = await axios.get(url);
    
    // Debug log to see the actual API response
    console.log('Pending Orders API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.UPDATE_ORDER_STATUS, { orderId }));
    const response = await axios.put(url, { status });
    
    // Debug log to see the actual API response
    console.log('Update Order Status API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getConfirmedOrders = async (vendorId) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.GET_CONFIRMED_ORDERS, { vendorId }));
    const response = await axios.get(url);
    
    // Debug log to see the actual API response
    console.log('Confirmed Orders API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching confirmed orders:', error);
    throw error;
  }
};

export const getDeliveredOrders = async (vendorId) => {
  try {
    const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCT_PARTNER.GET_DELIVERED_ORDERS, { vendorId }));
    const response = await axios.get(url);
    
    // Debug log to see the actual API response
    console.log('Delivered Orders API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    throw error;
  }
}; 