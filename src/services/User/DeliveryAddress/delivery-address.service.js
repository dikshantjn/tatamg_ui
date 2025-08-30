import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getUserId, getAuthHeader } from '../Auth/auth.utils';

export const DeliveryAddressService = {
    getAddresses: async () => {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            console.log('Fetching addresses for user:', userId);
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.DELIVERY_ADDRESS.GET_ADDRESSES, { userId });
            console.log('Using endpoint:', getApiUrl(endpoint));
            
            const response = await apiClient.get(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });
            console.log('Get addresses response status:', response.status);
            
            if (response.status !== 200) {
                const errorData = response.data;
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to fetch addresses');
            }

            const data = response.data;
            console.log('Addresses fetched successfully:', data);
            return data.data; // Return the addresses array
        } catch (error) {
            console.error('Error fetching delivery addresses:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    saveAddress: async (addressData) => {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            console.log('Saving delivery address:', { userId, ...addressData });
            console.log('Using endpoint:', getApiUrl(API_CONFIG.ENDPOINTS.DELIVERY_ADDRESS.SAVE_ADDRESS));
            
            const response = await apiClient.post(getApiUrl(API_CONFIG.ENDPOINTS.DELIVERY_ADDRESS.SAVE_ADDRESS), {
                userId,
                ...addressData
            }, {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Save address response status:', response.status);
            
            if (response.status !== 200) {
                const errorData = response.data;
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to save address');
            }

            const data = response.data;
            console.log('Address saved successfully:', data);
            return data;
        } catch (error) {
            console.error('Error saving delivery address:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    deleteAddress: async (addressId) => {
        try {
            console.log('Deleting address:', addressId);
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.DELIVERY_ADDRESS.DELETE_ADDRESS, { addressId });
            console.log('Using endpoint:', getApiUrl(endpoint));
            
            const response = await apiClient.delete(getApiUrl(endpoint), {
                headers: {
                    ...getAuthHeader(),
                }
            });

            console.log('Delete address response status:', response.status);
            
            if (response.status !== 200) {
                const errorData = response.data;
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to delete address');
            }

            const data = response.data;
            console.log('Address deleted successfully:', data);
            return data;
        } catch (error) {
            console.error('Error deleting delivery address:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
}; 