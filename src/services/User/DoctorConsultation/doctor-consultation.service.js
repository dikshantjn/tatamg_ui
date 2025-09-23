import { API_CONFIG } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getToken } from '../Auth/auth.utils';

export const doctorConsultationService = {
    getOnlineDoctors: async () => {
        try {
            const response = await apiClient.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_ONLINE_DOCTORS}`);

            if (response.status !== 200) {
                throw new Error('Failed to fetch online doctors');
            }

            const data = response.data;
            return data.clinics;
        } catch (error) {
            console.error('Error fetching online doctors:', error);
            throw error;
        }
    },

    getOfflineDoctors: async () => {
        try {
            const response = await apiClient.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_OFFLINE_DOCTORS}`);

            if (response.status !== 200) {
                throw new Error('Failed to fetch offline doctors');
            }

            const data = response.data;
            return data.clinics;
        } catch (error) {
            console.error('Error fetching offline doctors:', error);
            throw error;
        }
    },

    createAppointment: async (appointmentData) => {
        try {
            // Log the request data for debugging
            console.log('Creating appointment with data:', appointmentData);

            const token = getToken();
            const response = await apiClient.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.CREATE_APPOINTMENT}`, appointmentData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseData = response.data;
            console.log('Server response:', responseData);
            console.log('Response status:', response.status);

            // Check if the response indicates success
            if (response.status >= 200 && response.status < 300) {
                // Success - return the response data
                return responseData;
            } else {
                // Error status code
                throw new Error(responseData.message || `Server error: ${response.status}`);
            }
        } catch (error) {
            console.error('Detailed error in createAppointment:', {
                message: error.message,
                stack: error.stack,
                appointmentData
            });
            throw error;
        }
    },

    getTimeslots: async (vendorId, date) => {
        try {
            const response = await apiClient.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_TIMESLOTS.replace(':vendorId', vendorId).replace(':date', date)}`);

            if (response.status !== 200) {
                throw new Error('Failed to fetch timeslots');
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching timeslots:', error);
            throw error;
        }
    },

    // Timeslots management methods
    getAllTimeslots: async (vendorId) => {
        try {
            const response = await apiClient.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC_TIMESLOTS.GET_TIMESLOTS.replace(':vendorId', vendorId)}`);

            if (response.status !== 200) {
                throw new Error('Failed to fetch timeslots');
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching all timeslots:', error);
            throw error;
        }
    },

    createTimeslot: async (timeslotData) => {
        try {
            const token = getToken();
            const response = await apiClient.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC_TIMESLOTS.CREATE_TIMESLOT}`, timeslotData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to create timeslot');
            }

            return response.data;
        } catch (error) {
            console.error('Error creating timeslot:', error);
            throw error;
        }
    },

    updateTimeslot: async (timeSlotId, timeslotData) => {
        try {
            const token = getToken();
            const response = await apiClient.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC_TIMESLOTS.UPDATE_TIMESLOT.replace(':timeSlotId', timeSlotId)}`, timeslotData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 200) {
                throw new Error('Failed to update timeslot');
            }

            return response.data;
        } catch (error) {
            console.error('Error updating timeslot:', error);
            throw error;
        }
    },

    deleteTimeslot: async (timeSlotId) => {
        try {
            const token = getToken();
            const response = await apiClient.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC_TIMESLOTS.DELETE_TIMESLOT.replace(':timeSlotId', timeSlotId)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200) {
                throw new Error('Failed to delete timeslot');
            }

            return response.data;
        } catch (error) {
            console.error('Error deleting timeslot:', error);
            throw error;
        }
    }
}; 