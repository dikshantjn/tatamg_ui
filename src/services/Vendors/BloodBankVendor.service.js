import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';
import { vendorAuthService } from './VendorAuth/vendor-auth.service';

class BloodBankVendorService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    /**
     * Get blood bank vendor profile by vendor ID
     * @param {string} vendorId - The vendor ID
     * @returns {Promise<Object>} - Profile data
     */
    async getBloodBankProfile(vendorId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_PROFILE, { vendorId });
            const url = getApiUrl(endpoint);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blood bank profile:', error);
            throw error;
        }
    }

    /**
     * Update blood bank vendor profile
     * @param {string} vendorId - The vendor ID
     * @param {Object} profileData - The profile data to update
     * @returns {Promise<Object>} - Updated profile data
     */
    async updateBloodBankProfile(vendorId, profileData) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.UPDATE_PROFILE, { vendorId });
            const url = getApiUrl(endpoint);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating blood bank profile:', error);
            throw error;
        }
    }

    /**
     * Transform API response to component format
     * @param {Object} apiResponse - The API response
     * @returns {Object} - Transformed data for component use
     */
    transformProfileData(apiResponse) {
        if (!apiResponse || !apiResponse.agency) {
            return null;
        }

        const agency = apiResponse.agency;
        
        return {
            agencyName: agency.agencyName || '',
            gstNumber: agency.gstNumber || '',
            panNumber: agency.panNumber || '',
            ownerName: agency.ownerName || '',
            completeAddress: agency.completeAddress || '',
            nearbyLandmark: agency.nearbyLandmark || '',
            phoneNumber: agency.phoneNumber || '',
            state: agency.state || '',
            city: agency.city || '',
            pincode: agency.pincode || '',
            email: agency.email || '',
            website: agency.website || '',
            languageProficiency: agency.languageProficiency || '',
            deliveryOperationalAreas: Array.isArray(agency.deliveryOperationalAreas) 
                ? agency.deliveryOperationalAreas.join(', ') 
                : agency.deliveryOperationalAreas || '',
            distanceLimitations: agency.distanceLimitations ? `${agency.distanceLimitations} km` : '',
            is24x7Operational: agency.is24x7Operational || false,
            isAllDaysWorking: agency.isAllDaysWorking || false,
            bloodServicesProvided: Array.isArray(agency.bloodServicesProvided) 
                ? agency.bloodServicesProvided.join(', ') 
                : agency.bloodServicesProvided || '',
            plateletServicesProvided: Array.isArray(agency.plateletServicesProvided) 
                ? agency.plateletServicesProvided.join(', ') 
                : agency.plateletServicesProvided || '',
            otherServicesProvided: Array.isArray(agency.otherServicesProvided) 
                ? agency.otherServicesProvided.join(', ') 
                : agency.otherServicesProvided || '',
            acceptsOnlinePayment: agency.acceptsOnlinePayment || false,
            agencyPhotos: agency.agencyPhotos || [],
            licenseFiles: agency.licenseFiles || [],
            registrationCertificateFiles: agency.registrationCertificateFiles || [],
            googleMapsLocation: agency.googleMapsLocation || '',
            vendorId: agency.vendorId || '',
            generatedId: agency.generatedId || '',
            createdAt: agency.createdAt || '',
            updatedAt: agency.updatedAt || ''
        };
    }

    /**
     * Get blood inventory by vendor ID
     * @param {string} vendorId - The vendor ID
     * @returns {Promise<Object>} - Inventory data
     */
    async getBloodInventory(vendorId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_INVENTORY, { vendorId });
            const url = getApiUrl(endpoint);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blood inventory:', error);
            throw error;
        }
    }

    /**
     * Upsert blood inventory (create or update)
     * @param {string} vendorId - The vendor ID
     * @param {Object} inventoryData - The inventory data to upsert
     * @returns {Promise<Object>} - Upserted inventory data
     */
    async upsertBloodInventory(vendorId, inventoryData) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.UPSERT_INVENTORY, { vendorId });
            const url = getApiUrl(endpoint);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inventoryData),
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error upserting blood inventory:', error);
            throw error;
        }
    }

    /**
     * Delete blood inventory by inventory ID
     * @param {string} inventoryId - The inventory ID to delete
     * @returns {Promise<Object>} - Delete response
     */
    async deleteBloodInventory(inventoryId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.DELETE_INVENTORY, { inventoryId });
            const url = getApiUrl(endpoint);
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting blood inventory:', error);
            throw error;
        }
    }

    /**
     * Get vendor booking requests
     * @param {string} vendorId - The vendor ID
     * @returns {Promise<Object>} - Booking requests data
     */
    async getVendorRequests(vendorId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_VENDOR_REQUESTS, { vendorId });
            const url = getApiUrl(endpoint);
            
            // Get auth token
            const authData = vendorAuthService.getVendorAuthData();
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authData && authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching vendor requests:', error);
            throw error;
        }
    }

    /**
     * Update blood bank request status
     * @param {string} requestId - The request ID
     * @param {string} status - The new status (accepted, rejected, etc.)
     * @returns {Promise<Object>} - Update response
     */
    async updateRequestStatus(requestId, status) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.UPDATE_REQUEST_STATUS, { requestId });
            const url = getApiUrl(endpoint);
            
            // Get auth token
            const authData = vendorAuthService.getVendorAuthData();
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authData && authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            }
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        }
    }

    /**
     * Get vendor bookings
     * @param {string} vendorId - The vendor ID
     * @returns {Promise<Object>} - Bookings data
     */
    async getVendorBookings(vendorId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.GET_VENDOR_BOOKINGS, { vendorId });
            const url = getApiUrl(endpoint);
            
            // Get auth token
            const authData = vendorAuthService.getVendorAuthData();
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authData && authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching vendor bookings:', error);
            throw error;
        }
    }

    /**
     * Add service details to booking
     * @param {string} bookingId - The booking ID
     * @param {Object} serviceData - The service details data
     * @returns {Promise<Object>} - Service details response
     */
    async addServiceDetails(bookingId, serviceData) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.ADD_SERVICE_DETAILS, { bookingId });
            const url = getApiUrl(endpoint);
            
            // Get auth token
            const authData = vendorAuthService.getVendorAuthData();
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authData && authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(serviceData),
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding service details:', error);
            throw error;
        }
    }

    /**
     * Update booking status to waiting for pickup
     * @param {string} bookingId - The booking ID
     * @returns {Promise<Object>} - Update response
     */
    async updateStatusToWaitingForPickup(bookingId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.UPDATE_STATUS_WAITING_FOR_PICKUP, { bookingId });
            const url = getApiUrl(endpoint);
            
            // Get auth token
            const authData = vendorAuthService.getVendorAuthData();
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authData && authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers,
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating status to waiting for pickup:', error);
            throw error;
        }
    }

    /**
     * Complete booking
     * @param {string} bookingId - The booking ID
     * @returns {Promise<Object>} - Complete response
     */
    async completeBooking(bookingId) {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOOD_BANK.COMPLETE_BOOKING, { bookingId });
            const url = getApiUrl(endpoint);
            
            // Get auth token
            const authData = vendorAuthService.getVendorAuthData();
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authData && authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`;
            }
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers,
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (parseError) {
                    // If we can't parse the error response, use the status code
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error completing booking:', error);
            throw error;
        }
    }

    /**
     * Transform component data to API format
     * @param {Object} componentData - The component data
     * @returns {Object} - Transformed data for API
     */
    transformToApiFormat(componentData) {
        return {
            agencyName: componentData.agencyName,
            gstNumber: componentData.gstNumber,
            panNumber: componentData.panNumber,
            ownerName: componentData.ownerName,
            completeAddress: componentData.completeAddress,
            nearbyLandmark: componentData.nearbyLandmark,
            phoneNumber: componentData.phoneNumber,
            state: componentData.state,
            city: componentData.city,
            pincode: componentData.pincode,
            email: componentData.email,
            website: componentData.website,
            languageProficiency: componentData.languageProficiency,
            deliveryOperationalAreas: componentData.deliveryOperationalAreas.split(',').map(area => area.trim()),
            distanceLimitations: parseInt(componentData.distanceLimitations.replace(' km', '')) || 0,
            is24x7Operational: componentData.is24x7Operational,
            isAllDaysWorking: componentData.isAllDaysWorking,
            bloodServicesProvided: componentData.bloodServicesProvided.split(',').map(service => service.trim()),
            plateletServicesProvided: componentData.plateletServicesProvided.split(',').map(service => service.trim()),
            otherServicesProvided: componentData.otherServicesProvided.split(',').map(service => service.trim()),
            acceptsOnlinePayment: componentData.acceptsOnlinePayment,
            googleMapsLocation: componentData.googleMapsLocation,
            agencyPhotos: Array.isArray(componentData.agencyPhotos) ? componentData.agencyPhotos : [],
            licenseFiles: Array.isArray(componentData.licenseFiles) ? componentData.licenseFiles : [],
            registrationCertificateFiles: Array.isArray(componentData.registrationCertificateFiles) ? componentData.registrationCertificateFiles : []
        };
    }
}

// Create and export a singleton instance
export const bloodBankVendorService = new BloodBankVendorService(); 