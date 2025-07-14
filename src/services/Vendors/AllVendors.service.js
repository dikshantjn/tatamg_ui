import axios from 'axios';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';

// Product Partner Profile Services
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

// Vendor Status Services
export const getVendorStatus = async (vendorId) => {
  try {
    const url = getApiUrl(`/vendors/status/${vendorId}`);
    const response = await axios.get(url);
    
    // Debug log to see the actual API response
    console.log('Vendor Status API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor status:', error);
    throw error;
  }
};

export const toggleVendorStatus = async (vendorId) => {
  try {
    const url = getApiUrl(`/vendors/toggle-status/${vendorId}`);
    const response = await axios.put(url);
    
    // Debug log to see the actual API response
    console.log('Vendor Status Toggle API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error toggling vendor status:', error);
    throw error;
  }
};

// Export all services for easy importing
export const AllVendorsService = {
  // Product Partner Profile
  getProductPartnerProfile,
  updateProductPartnerProfile,
  
  // Vendor Status
  getVendorStatus,
  toggleVendorStatus,
}; 