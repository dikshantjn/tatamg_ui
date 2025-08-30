import { apiClient } from '../../config/apiClient';
import { getApiUrl, replaceUrlParams } from '../../config/api.config';

class HospitalVendorService {
    constructor() {
        this.baseURL = 'http://192.168.1.44:5000/api';
    }

    // Get Hospital Profile
    async getHospitalProfile(vendorId) {
        try {
            const url = getApiUrl('/hospitals/profile/:vendorId');
            const finalUrl = replaceUrlParams(url, { vendorId });
            
            const response = await apiClient.get(finalUrl);
            console.log('Hospital Profile API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching hospital profile:', error);
            throw error;
        }
    }

    // Transform profile data to match component structure
    transformProfileData(apiResponse) {
        try {
            const hospital = apiResponse.hospital;
            
            // Helper function to extract names from file objects
            const extractNamesFromFiles = (files) => {
                if (!Array.isArray(files)) return [];
                return files.map(file => {
                    if (typeof file === 'string') return file;
                    if (typeof file === 'object' && file.name) return file.name;
                    return '';
                }).filter(name => name);
            };
            
            return {
                name: hospital.name || '',
                gstNumber: hospital.gstNumber || '',
                panNumber: hospital.panNumber || '',
                address: hospital.address || '',
                landmark: hospital.landmark || '',
                ownerName: hospital.ownerName || '',
                // Extract names from file objects for certifications and licenses
                certifications: extractNamesFromFiles(hospital.certifications),
                licenses: extractNamesFromFiles(hospital.licenses),
                specialityTypes: hospital.specialityTypes || [],
                servicesOffered: hospital.servicesOffered || [],
                bedsAvailable: hospital.bedsAvailable?.toString() || '0',
                doctors: hospital.doctors?.length?.toString() || '0',
                workingTime: hospital.workingTime || '',
                workingDays: hospital.workingDays ? [hospital.workingDays] : [],
                contactNumber: hospital.contactNumber || '',
                email: hospital.email || '',
                website: hospital.website || '',
                hasLiftAccess: hospital.hasLiftAccess || false,
                hasParking: hospital.hasParking || false,
                providesAmbulanceService: hospital.providesAmbulanceService || false,
                about: hospital.about || '',
                hasWheelchairAccess: hospital.hasWheelchairAccess || false,
                providesOnlineConsultancy: hospital.providesOnlineConsultancy || false,
                feesRange: hospital.feesRange || '',
                otherFacilities: hospital.otherFacilities || [],
                insuranceCompanies: hospital.insuranceCompanies || [],
                photos: hospital.photos || [],
                state: hospital.state || '',
                city: hospital.city || '',
                pincode: hospital.pincode || '',
                location: hospital.location || '',
                password: hospital.password || '',
                // Map file arrays to match component structure - keep original objects for file display
                hospitalPhotos: hospital.photos || [],
                certificationFiles: hospital.certifications || [],
                licenseFiles: hospital.licenses || []
            };
        } catch (error) {
            console.error('Error transforming hospital profile data:', error);
            return null;
        }
    }

    // Transform component data back to API format
    transformToApiFormat(profileData) {
        try {
            return {
                vendorId: profileData.vendorId || '',
                generatedId: profileData.generatedId || '',
                name: profileData.name || '',
                gstNumber: profileData.gstNumber || '',
                panNumber: profileData.panNumber || '',
                address: profileData.address || '',
                landmark: profileData.landmark || '',
                ownerName: profileData.ownerName || '',
                certifications: profileData.certificationFiles || [],
                licenses: profileData.licenseFiles || [],
                specialityTypes: profileData.specialityTypes || [],
                servicesOffered: profileData.servicesOffered || [],
                bedsAvailable: parseInt(profileData.bedsAvailable) || 0,
                doctors: [], // API expects an empty array for doctors based on example
                workingTime: profileData.workingTime || '',
                workingDays: Array.isArray(profileData.workingDays) && profileData.workingDays.length > 0
                                ? profileData.workingDays[0] // Convert array back to string for API
                                : '',
                contactNumber: profileData.contactNumber || '',
                email: profileData.email || '',
                website: profileData.website || '',
                hasLiftAccess: profileData.hasLiftAccess || false,
                hasParking: profileData.hasParking || false,
                providesAmbulanceService: profileData.providesAmbulanceService || false,
                about: profileData.about || '',
                hasWheelchairAccess: profileData.hasWheelchairAccess || false,
                providesOnlineConsultancy: profileData.providesOnlineConsultancy || false,
                feesRange: profileData.feesRange || '',
                otherFacilities: profileData.otherFacilities || [],
                insuranceCompanies: profileData.insuranceCompanies || [],
                photos: profileData.hospitalPhotos || [],
                state: profileData.state || '',
                city: profileData.city || '',
                pincode: profileData.pincode || '',
                location: profileData.location || '',
                password: profileData.password || ''
            };
        } catch (error) {
            console.error('Error transforming to API format:', error);
            return null;
        }
    }

    // Update Hospital Profile
    async updateHospitalProfile(vendorId, profileData) {
        try {
            const url = getApiUrl('/hospitals/profile/:vendorId');
            const finalUrl = replaceUrlParams(url, { vendorId });
            
            // Transform component data back to API format
            const apiData = this.transformToApiFormat(profileData);
            
            const response = await apiClient.put(finalUrl, { hospital: apiData });
            console.log('Hospital Profile Update API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error updating hospital profile:', error);
            throw error;
        }
    }

    // Get Hospital Wards
    async getHospitalWards(vendorId) {
        try {
            const url = getApiUrl('/hospitals/wards/vendor/:vendorId');
            const finalUrl = replaceUrlParams(url, { vendorId });
            
            const response = await apiClient.get(finalUrl);
            console.log('Hospital Wards API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching hospital wards:', error);
            throw error;
        }
    }

    // Create Hospital Ward
    async createHospitalWard(wardData) {
        try {
            const url = getApiUrl('/hospitals/wards');
            
            const response = await apiClient.post(url, wardData);
            console.log('Create Hospital Ward API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error creating hospital ward:', error);
            throw error;
        }
    }

    // Delete Hospital Ward
    async deleteHospitalWard(wardId) {
        try {
            const url = getApiUrl('/hospitals/wards/:wardId');
            const finalUrl = replaceUrlParams(url, { wardId });
            
            const response = await apiClient.delete(finalUrl);
            console.log('Delete Hospital Ward API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error deleting hospital ward:', error);
            throw error;
        }
    }

    // Update Hospital Ward
    async updateHospitalWard(wardId, wardData) {
        try {
            const url = getApiUrl('/hospitals/wards/:wardId');
            const finalUrl = replaceUrlParams(url, { wardId });
            
            const response = await apiClient.put(finalUrl, wardData);
            console.log('Update Hospital Ward API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error updating hospital ward:', error);
            throw error;
        }
    }

    // Get Hospital Vendor Appointments
    async getHospitalAppointments(vendorId) {
        try {
            const url = getApiUrl('/hospitals/by-vendor/:vendorId');
            const finalUrl = replaceUrlParams(url, { vendorId });
            
            const response = await apiClient.get(finalUrl);
            console.log('Hospital Appointments API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching hospital appointments:', error);
            throw error;
        }
    }

    // Accept Hospital Appointment
    async acceptHospitalAppointment(bookingId) {
        try {
            const url = getApiUrl('/hospitals/appointment/accept/:bookingId');
            const finalUrl = replaceUrlParams(url, { bookingId });
            
            const response = await apiClient.put(finalUrl);
            console.log('Accept Hospital Appointment API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error accepting hospital appointment:', error);
            throw error;
        }
    }

    // Notify Payment for Hospital Appointment
    async notifyPayment(bookingId) {
        try {
            const url = getApiUrl('/hospitals/appointment/notify-payment/:bookingId');
            const finalUrl = replaceUrlParams(url, { bookingId });
            
            const response = await apiClient.put(finalUrl);
            console.log('Notify Payment API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error notifying payment:', error);
            throw error;
        }
    }

    // Get Completed Hospital Appointments
    async getCompletedAppointments(vendorId) {
        try {
            const url = getApiUrl('/hospitals/appointment/completed/vendor/:vendorId');
            const finalUrl = replaceUrlParams(url, { vendorId });
            
            const response = await apiClient.get(finalUrl);
            console.log('Completed Hospital Appointments API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching completed hospital appointments:', error);
            throw error;
        }
    }
}

export const hospitalVendorService = new HospitalVendorService(); 