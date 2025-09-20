import axios from '../../config/api.config.js';
import { API_CONFIG } from '../../config/api.config.js';

export const medicalStoresService = {
  // Get all medical stores
  getAllMedicalStores: async () => {
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.GET_MEDICAL_STORES);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical stores:', error);
      throw error;
    }
  },

  // Send prescription with order details
  sendPrescription: async (prescriptionData) => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.SEND_PRESCRIPTION, prescriptionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending prescription:', error);
      throw error;
    }
  },

  // Upload prescription
  uploadPrescription: async (prescriptionData) => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.UPLOAD_PRESCRIPTION, prescriptionData);
      return response.data;
    } catch (error) {
      console.error('Error uploading prescription:', error);
      throw error;
    }
  },

  // Search more vendors for a prescription
  searchMoreVendors: async (prescriptionId) => {
    try {
      const response = await axios.get(
        API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.SEARCH_MORE_VENDORS.replace(':prescriptionId', prescriptionId)
      );
      return response.data;
    } catch (error) {
      console.error('Error searching more vendors:', error);
      throw error;
    }
  },

  // Track orders
  trackOrders: async (userId) => {
    try {
      const response = await axios.get(
        API_CONFIG.ENDPOINTS.MEDICINE_DELIVERY.TRACK_ORDERS.replace(':userId', userId)
      );
      return response.data;
    } catch (error) {
      console.error('Error tracking orders:', error);
      throw error;
    }
  }
};
