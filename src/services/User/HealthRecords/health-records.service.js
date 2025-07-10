import { API_CONFIG, getApiUrl, API_BASE_URL } from '../../../config/api.config';
import { getAuthHeader } from '../Auth/auth.utils';

export const checkHealthRecordPassword = async (userId) => {
    try {
        console.log('Checking health record password for userId:', userId);
        
        const endpoint = API_CONFIG.ENDPOINTS.HEALTH_RECORDS.CHECK_PASSWORD.replace(':userId', userId);
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to check health record password: ${response.status}`);
        }

        const data = await response.json();
        console.log('Health record password check response:', data);
        return data;
    } catch (error) {
        console.error('Error checking health record password:', error);
        throw error;
    }
};

export const setHealthRecordPassword = async (userId, password) => {
    try {
        console.log('Setting health record password for userId:', userId);
        
        const endpoint = API_CONFIG.ENDPOINTS.HEALTH_RECORDS.SET_PASSWORD.replace(':userId', userId);
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword: password }), // Changed to match API requirements
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to set health record password: ${response.status}`);
        }

        const data = await response.json();
        console.log('Health record password set successfully:', data);
        return data;
    } catch (error) {
        console.error('Error setting health record password:', error);
        throw error;
    }
};

export const verifyHealthRecordPassword = async (userId, password) => {
    try {
        console.log('Verifying health record password for userId:', userId);
        
        const endpoint = API_CONFIG.ENDPOINTS.HEALTH_RECORDS.VERIFY_PASSWORD.replace(':userId', userId);
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }), // Match API requirements
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to verify health record password: ${response.status}`);
        }

        const data = await response.json();
        console.log('Health record password verification response:', data);
        return data;
    } catch (error) {
        console.error('Error verifying health record password:', error);
        throw error;
    }
}; 

export const getHealthRecords = async (userId) => {
    try {
        console.log('Fetching health records for userId:', userId);
        
        const endpoint = API_CONFIG.ENDPOINTS.HEALTH_RECORDS.GET_HEALTH_RECORDS.replace(':userId', userId);
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch health records: ${response.status}`);
        }

        const { data } = await response.json();
        console.log('Health records fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching health records:', error);
        throw error;
    }
}; 

export const addHealthRecord = async (recordData) => {
    try {
        console.log('Adding health record:', recordData);
        
        const endpoint = API_CONFIG.ENDPOINTS.HEALTH_RECORDS.ADD_HEALTH_RECORD;
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recordData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to add health record: ${response.status}`);
        }

        const data = await response.json();
        console.log('Health record added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding health record:', error);
        throw error;
    }
}; 

export const deleteHealthRecord = async (healthRecordId) => {
    try {
        console.log('Deleting health record with ID:', healthRecordId);
        
        const endpoint = API_CONFIG.ENDPOINTS.HEALTH_RECORDS.DELETE_HEALTH_RECORD.replace(':healthRecordId', healthRecordId);
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Making API call to:', url);
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete health record: ${response.status}`);
        }

        const data = await response.json();
        console.log('Health record deleted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error deleting health record:', error);
        throw error;
    }
}; 