import { apiClient } from '../../../config/apiClient';
import { API_CONFIG, getApiUrl } from '../../../config/api.config';

class VendorAuthService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Vendor Login
    async vendorLogin(email, password, role, deviceId) {
        try {
            const response = await apiClient.post(
                getApiUrl(API_CONFIG.ENDPOINTS.VENDOR_AUTH.LOGIN),
                {
                    email,
                    password,
                    role,
                    deviceId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Vendor login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Vendor login error:', error);
            throw error;
        }
    }

    // Store vendor auth data
    storeVendorAuthData(token, vendorData) {
        try {
            localStorage.setItem('vendorToken', token);
            localStorage.setItem('vendorData', JSON.stringify(vendorData));
            localStorage.setItem('userType', 'vendor');
            return true;
        } catch (error) {
            console.error('Error storing vendor auth data:', error);
            return false;
        }
    }

    // Get vendor auth data
    getVendorAuthData() {
        try {
            const token = localStorage.getItem('vendorToken');
            const vendorData = localStorage.getItem('vendorData');
            const userType = localStorage.getItem('userType');

            if (token && vendorData && userType === 'vendor') {
                return {
                    token,
                    vendorData: JSON.parse(vendorData),
                    userType
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting vendor auth data:', error);
            return null;
        }
    }

    // Clear vendor auth data
    clearVendorAuthData() {
        try {
            localStorage.removeItem('vendorToken');
            localStorage.removeItem('vendorData');
            localStorage.removeItem('userType');
            return true;
        } catch (error) {
            console.error('Error clearing vendor auth data:', error);
            return false;
        }
    }

    // Check if vendor is authenticated
    isVendorAuthenticated() {
        const authData = this.getVendorAuthData();
        return authData !== null;
    }

    // Vendor Logout
    async vendorLogout(vendorId) {
        try {
            const response = await apiClient.post(
                getApiUrl(API_CONFIG.ENDPOINTS.VENDOR_AUTH.LOGOUT),
                {
                    vendorId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Vendor logout response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Vendor logout error:', error);
            throw error;
        }
    }

    // Get vendor role mapping
    getVendorRoleMapping() {
        return {
            1: 'hospital',
            2: 'doctor-consultation', 
            3: 'pharmacy',
            4: 'ambulance',
            5: 'blood-bank',
            6: 'lab-test',
            7: 'delivery-partner',
            8: 'product-partner'
        };
    }

    // Get vendor dashboard route based on role
    getVendorDashboardRoute(vendorRole) {
        const roleMapping = this.getVendorRoleMapping();
        const roleName = roleMapping[vendorRole];
        
        if (roleName) {
            return `/vendor/${roleName}/dashboard`;
        }
        return '/vendor/dashboard'; // fallback
    }
}

export const vendorAuthService = new VendorAuthService(); 