import { API_CONFIG } from '../../../config/api.config';
import { getToken } from '../Auth/auth.utils';

export const doctorConsultationService = {
    getOnlineDoctors: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_ONLINE_DOCTORS}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch online doctors');
            }

            const data = await response.json();
            return data.clinics;
        } catch (error) {
            console.error('Error fetching online doctors:', error);
            throw error;
        }
    },

    getOfflineDoctors: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_OFFLINE_DOCTORS}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch offline doctors');
            }

            const data = await response.json();
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
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.CREATE_APPOINTMENT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || `Server error: ${response.status}`);
            }

            return responseData;
        } catch (error) {
            console.error('Detailed error in createAppointment:', {
                message: error.message,
                stack: error.stack,
                appointmentData
            });
            throw error;
        }
    }
}; 