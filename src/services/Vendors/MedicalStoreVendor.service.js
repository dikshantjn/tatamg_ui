import axios from 'axios';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';

export const getMedicalStoreVendorProfile = async (vendorId) => {
  try {
    const url = getApiUrl(
      replaceUrlParams(API_CONFIG.ENDPOINTS.MEDICAL_STORE_VENDOR.GET_PROFILE, { vendorId })
    );
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 