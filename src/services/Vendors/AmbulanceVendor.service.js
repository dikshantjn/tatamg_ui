import { apiClient } from '../../config/apiClient';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config.js';

// Ambulance Vendor Profile Services
export const getAmbulanceVendorProfile = async (vendorId) => {
    try {
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_PROFILE, { vendorId });
        const fullUrl = getApiUrl(endpoint);
        console.log('Making API call to:', fullUrl);
        console.log('Vendor ID being used:', vendorId);
        
        // Simple headers without authentication
        const headers = {};
        
        console.log('Request headers:', headers);
        
        // First, let's test if the API server is reachable
        try {
            const testResponse = await apiClient.get('http://localhost:5000/api/health', { timeout: 5000 });
            console.log('API server is reachable:', testResponse.data);
        } catch (testError) {
            console.log('API server health check failed:', testError.message);
        }
        
        const response = await apiClient.get(fullUrl, { headers });
        console.log('API response:', response.data);
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching ambulance vendor profile:', error);
        console.error('Full URL that failed:', getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_PROFILE, { vendorId })));
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const updateAmbulanceVendorProfile = async (vendorId, profileData) => {
    try {
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_PROFILE, { vendorId });
        const fullUrl = getApiUrl(endpoint);
        console.log('Making PUT API call to:', fullUrl);
        console.log('Vendor ID being used:', vendorId);
        console.log('Profile data being sent:', profileData);
        
        // Simple headers without authentication
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Prepare the request body according to the new API specification
        const requestBody = {
            agencyName: profileData.agencyName,
            website: profileData.website,
            gstNumber: profileData.gstNumber,
            panNumber: profileData.panNumber,
            ownerName: profileData.ownerName,
            registrationNumber: profileData.registrationNumber,
            contactNumber: profileData.contactNumber,
            email: profileData.email,
            address: profileData.address,
            city: profileData.city,
            state: profileData.state,
            pinCode: profileData.pinCode,
            landmark: profileData.landmark,
            driverLicense: profileData.driverLicense,
            preciseLocation: profileData.preciseLocation,
            numOfAmbulances: profileData.numOfAmbulances,
            driverKYC: profileData.driverKYC,
            driverTrained: profileData.driverTrained,
            gpsTrackingAvailable: profileData.gpsTrackingAvailable,
            is24x7Available: profileData.is24x7Available,
            isOnlinePaymentAvailable: profileData.isOnlinePaymentAvailable,
            isLive: profileData.isLive || true,
            ambulanceTypes: profileData.ambulanceTypes || [],
            ambulanceEquipment: profileData.ambulanceEquipment || [],
            languageProficiency: profileData.languageProficiency || [],
            operationalAreas: profileData.operationalAreas || [],
            trainingCertifications: profileData.trainingCertifications || [],
            officePhotos: profileData.officePhotos || [],
            distanceLimit: profileData.distanceLimit || 0
        };
        
        console.log('Request headers:', headers);
        console.log('Request body:', requestBody);
        const response = await apiClient.put(fullUrl, requestBody, { headers });
        console.log('Update API response:', response.data);
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error updating ambulance vendor profile:', error);
        console.error('Full URL that failed:', getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_PROFILE, { vendorId })));
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const uploadAmbulanceVendorPhotos = async (vendorId, photos, type) => {
    try {
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPLOAD_PHOTOS, { vendorId });
        const formData = new FormData();
        
        photos.forEach((photo, index) => {
            formData.append('photos', photo.file);
            formData.append('names', photo.name);
        });
        formData.append('type', type);
        
        const response = await apiClient.post(getApiUrl(endpoint), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading ambulance vendor photos:', error);
        throw error;
    }
};

export const deleteAmbulanceVendorPhoto = async (vendorId, photoId) => {
    try {
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.DELETE_PHOTO, { vendorId, photoId });
        const response = await apiClient.delete(getApiUrl(endpoint));
        return response.data;
    } catch (error) {
        console.error('Error deleting ambulance vendor photo:', error);
        throw error;
    }
};

export const getPendingRequestsByVendor = async (vendorId) => {
    try {
        // Validate vendorId
        if (!vendorId) {
            throw new Error('Vendor ID is required');
        }
        
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_PENDING_REQUESTS_BY_VENDOR, { vendorId });
        const fullUrl = getApiUrl(endpoint);
        console.log('Making API call to get pending requests:', fullUrl);
        console.log('Vendor ID being used:', vendorId);
        
        const headers = {};
        
        const response = await apiClient.get(fullUrl, { headers });
        console.log('Pending requests API response:', response.data);
        
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching pending requests by vendor:', error);
        if (vendorId) {
            console.error('Full URL that failed:', getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_PENDING_REQUESTS_BY_VENDOR, { vendorId })));
        }
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const acceptAmbulanceBooking = async (requestId) => {
    try {
        // Validate requestId
        if (!requestId) {
            throw new Error('Request ID is required');
        }
        
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.ACCEPT_BOOKING, { requestId });
        const fullUrl = getApiUrl(endpoint);
        console.log('Making PATCH API call to accept booking:', fullUrl);
        console.log('Request ID being used:', requestId);
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const response = await apiClient.patch(fullUrl, {}, { headers });
        console.log('Accept booking API response:', response.data);
        
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error accepting ambulance booking:', error);
        if (requestId) {
            console.error('Full URL that failed:', getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.ACCEPT_BOOKING, { requestId })));
        }
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const updateAmbulanceServiceDetails = async (requestId, serviceData) => {
    try {
        // Validate requestId
        if (!requestId) {
            throw new Error('Request ID is required');
        }
        
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_SERVICE_DETAILS, { requestId });
        const fullUrl = getApiUrl(endpoint);
        console.log('Making PATCH API call to update service details:', fullUrl);
        console.log('Request ID being used:', requestId);
        console.log('Service data being sent:', serviceData);
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Prepare the request body according to the API specification
        const requestBody = {
            pickupLocation: serviceData.pickupLocation,
            dropLocation: serviceData.dropLocation,
            totalDistance: parseFloat(serviceData.totalDistance),
            costPerKm: parseFloat(serviceData.costPerKm),
            baseCharge: parseFloat(serviceData.baseCharge),
            vehicleType: serviceData.vehicleType,
            totalAmount: parseFloat(serviceData.totalAmount),
            isPaymentBypassed: Boolean(serviceData.isPaymentBypassed),
            status: serviceData.status || 'WaitingForPayment'
        };
        
        const response = await apiClient.patch(fullUrl, requestBody, { headers });
        console.log('Update service details API response:', response.data);
        
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error updating ambulance service details:', error);
        if (requestId) {
            console.error('Full URL that failed:', getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_SERVICE_DETAILS, { requestId })));
        }
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const updateAmbulanceStatus = async (requestId, status) => {
    try {
        // Validate requestId
        if (!requestId) {
            throw new Error('Request ID is required');
        }
        
        let endpoint;
        switch (status) {
            case 'on_the_way':
                endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_ON_THE_WAY_STATUS, { requestId });
                break;
            case 'picked_up':
                endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_PICKED_UP_STATUS, { requestId });
                break;
            case 'completed':
                endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_COMPLETED_STATUS, { requestId });
                break;
            default:
                throw new Error('Invalid status provided');
        }
        
        const fullUrl = getApiUrl(endpoint);
        console.log(`Making PUT API call to update status to ${status}:`, fullUrl);
        console.log('Request ID being used:', requestId);
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const response = await apiClient.put(fullUrl, {}, { headers });
        console.log(`Update status to ${status} API response:`, response.data);
        
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error(`Error updating ambulance status to ${status}:`, error);
        if (requestId) {
            // Reconstruct the endpoint for error logging
            let errorEndpoint;
            switch (status) {
                case 'on_the_way':
                    errorEndpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_ON_THE_WAY_STATUS, { requestId });
                    break;
                case 'picked_up':
                    errorEndpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_PICKED_UP_STATUS, { requestId });
                    break;
                case 'completed':
                    errorEndpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.UPDATE_COMPLETED_STATUS, { requestId });
                    break;
                default:
                    errorEndpoint = 'unknown';
            }
            console.error('Full URL that failed:', getApiUrl(errorEndpoint));
        }
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const getCompletedBookingsByVendor = async (vendorId) => {
    try {
        // Validate vendorId
        if (!vendorId) {
            throw new Error('Vendor ID is required');
        }
        
        const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_COMPLETED_BOOKINGS_BY_VENDOR, { vendorId });
        const fullUrl = getApiUrl(endpoint);
        console.log('Making API call to get completed bookings:', fullUrl);
        console.log('Vendor ID being used:', vendorId);
        
        const headers = {};
        
        const response = await apiClient.get(fullUrl, { headers });
        console.log('Completed bookings API response:', response.data);
        
        // Check if response has success/data structure
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching completed bookings by vendor:', error);
        if (vendorId) {
            console.error('Full URL that failed:', getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.AMBULANCE.GET_COMPLETED_BOOKINGS_BY_VENDOR, { vendorId })));
        }
        console.error('Error message:', error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error status text:', error.response?.statusText);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const AmbulanceVendorService = {
    getAmbulanceVendorProfile,
    updateAmbulanceVendorProfile,
    uploadAmbulanceVendorPhotos,
    deleteAmbulanceVendorPhoto,
    getPendingRequestsByVendor,
    getCompletedBookingsByVendor,
    acceptAmbulanceBooking,
    updateAmbulanceServiceDetails,
    updateAmbulanceStatus,
}; 