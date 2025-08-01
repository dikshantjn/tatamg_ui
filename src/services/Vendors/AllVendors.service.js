import axios from 'axios';
import { getApiUrl } from '../../config/api.config';

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
  // Vendor Status
  getVendorStatus,
  toggleVendorStatus,
}; 