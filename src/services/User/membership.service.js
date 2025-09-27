import axios from '../../config/api.config.js';
import { API_CONFIG } from '../../config/api.config.js';

export const membershipService = {
  // Get all membership plans
  getMembershipPlans: async () => {
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.MEMBERSHIP.GET_PLANS);
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error;
    }
  },

  // Get a specific membership plan by ID
  getMembershipPlanById: async (planId) => {
    try {
      const response = await axios.get(`${API_CONFIG.ENDPOINTS.MEMBERSHIP.GET_PLANS}/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plan:', error);
      throw error;
    }
  },

  // Get current active plan for user
  getCurrentUserPlan: async (userId) => {
    try {
      const url = API_CONFIG.ENDPOINTS.MEMBERSHIP.GET_CURRENT_USER_PLAN.replace(':userId', userId);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      // If 404, user has no current plan - this is not an error
      if (error.response && error.response.status === 404) {
        console.log('No current plan found for user - this is normal for new users');
        return { currentPlan: null };
      }
      console.error('Error fetching current user plan:', error);
      throw error;
    }
  },
};

export default membershipService;
