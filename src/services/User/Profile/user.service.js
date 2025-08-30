import { API_CONFIG, getApiUrl, API_BASE_URL } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getAuthHeader } from '../Auth/auth.utils';

class UserService {
    /**
     * Fetch user details by userId
     * @param {string} userId - The user ID
     * @returns {Promise<Object>} User details
     */
    async getUserDetails(userId) {
        try {
            console.log('Fetching user details for userId:', userId);
            
            const endpoint = API_CONFIG.ENDPOINTS.USER.GET_USER.replace(':userId', userId);
            const url = getApiUrl(endpoint);
            
            console.log('Making API call to:', url);
            
            const response = await apiClient.get(url, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('User details response status:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `Failed to fetch user details: ${response.status}`);
            }

            const userData = response.data;
            console.log('User details fetched successfully:', userData);
            
            return {
                status: response.status,
                data: userData,
            };
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    }

    /**
     * Update user details
     * @param {string} userId - The user ID
     * @param {Object} userData - The user data to update
     * @returns {Promise<Object>} Updated user details
     */
    async updateUserDetails(userId, userData) {
        try {
            console.log('Updating user details for userId:', userId);
            console.log('Update data:', userData);
            
            const endpoint = API_CONFIG.ENDPOINTS.USER.UPDATE_USER.replace(':userId', userId);
            const url = getApiUrl(endpoint);
            
            console.log('Making API call to:', url);
            
            const response = await apiClient.put(url, userData, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Update user response status:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `Failed to update user details: ${response.status}`);
            }

            const updatedUserData = response.data;
            console.log('User details updated successfully:', updatedUserData);
            
            return {
                status: response.status,
                data: updatedUserData,
            };
        } catch (error) {
            console.error('Error updating user details:', error);
            throw error;
        }
    }

    /**
     * Format user data for display
     * @param {Object} userData - Raw user data from API
     * @returns {Object} Formatted user data
     */
    formatUserData(userData) {
        return {
            name: userData.name || '',
            photo: userData.photo || null,
            phone_number: userData.phone_number || '',
            ABHA_ID: userData.ABHA_ID || '',
            emailId: userData.emailId || '',
            password: userData.password || '********',
            healthRecordPassword: userData.healthRecordPassword || '********',
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
            gender: userData.gender || '',
            bloodGroup: userData.bloodGroup || '',
            height: userData.height?.toString() || '',
            weight: userData.weight?.toString() || '',
            emergencyContactNumber: userData.emergencyContactNumber || '',
            location: userData.location || '',
            locationCoordinates: userData.locationCoordinates || '',
            city: userData.city || '',
            status: userData.status || false,
            fcmToken: userData.fcmToken || '',
            platform: userData.platform || ''
        };
    }

    // Medical Profile Methods
    async createMedicalProfile(medicalData) {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/medical-profile`, medicalData);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('Error creating medical profile:', error);
            throw error;
        }
    }

    async getMedicalProfile(userId) {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/medical-profile/${userId}`);

            if (response.status !== 200) {
                if (response.status === 404) {
                    return null; // Medical profile doesn't exist yet
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching medical profile:', error);
            throw error;
        }
    }

    async updateMedicalProfile(userId, medicalData) {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/medical-profile/${userId}`, medicalData);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('Error updating medical profile:', error);
            throw error;
        }
    }
}

export const userService = new UserService();
export default userService; 