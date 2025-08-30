import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../config/api.config';
import { apiClient } from '../../config/apiClient';
import { vendorAuthService } from './VendorAuth/vendor-auth.service';

class DoctorConsultationVendorService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Get vendor profile
    async getVendorProfile(vendorId) {
        try {
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_PROFILE, { vendorId }));
            
            const response = await apiClient.get(url, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            return data.clinic; // Return the clinic data from the response
        } catch (error) {
            console.error('Error fetching vendor profile:', error);
            throw error;
        }
    }

    // Update vendor profile
    async updateVendorProfile(vendorId, profileData) {
        try {
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.UPDATE_PROFILE, { vendorId }));
            
            const response = await apiClient.put(url, profileData, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            return data;
        } catch (error) {
            console.error('Error updating vendor profile:', error);
            throw error;
        }
    }

    // Transform API data to match component structure
    transformProfileData(apiData) {
        return {
            doctorName: apiData.doctorName || '',
            gender: apiData.gender || '',
            email: apiData.email || '',
            phoneNumber: apiData.phoneNumber || '',
            profilePicture: apiData.profilePicture || '',
            medicalLicenseFile: apiData.medicalLicenseFile || [],
            licenseNumber: apiData.licenseNumber || '',
            educationalQualifications: apiData.educationalQualifications || [],
            specializations: apiData.specializations || [],
            experienceYears: apiData.experienceYears?.toString() || '',
            languageProficiency: apiData.languageProficiency || [],
            hasTelemedicineExperience: apiData.hasTelemedicineExperience || false,
            consultationFeesRange: apiData.consultationFeesRange || '',
            consultationTimeSlots: this.transformTimeSlots(apiData.consultationTimeSlots),
            consultationDays: apiData.consultationDays || [],
            consultationTypes: apiData.consultationTypes || [],
            insurancePartners: apiData.insurancePartners || [],
            address: apiData.address || '',
            state: apiData.state || '',
            city: apiData.city || '',
            pincode: apiData.pincode || '',
            nearbyLandmark: apiData.nearbyLandmark || '',
            floor: apiData.floor || '',
            hasLiftAccess: apiData.hasLiftAccess || false,
            hasWheelchairAccess: apiData.hasWheelchairAccess || false,
            hasParking: apiData.hasParking || false,
            otherFacilities: apiData.otherFacilities || [],
            clinicPhotos: apiData.clinicPhotos || [],
            location: apiData.location || ''
        };
    }

    // Transform time slots from API format to display format
    transformTimeSlots(timeSlots) {
        if (!Array.isArray(timeSlots)) return [];
        
        return timeSlots.map(slot => {
            if (typeof slot === 'string') return slot;
            if (slot.startTime && slot.endTime) {
                return `${slot.startTime} - ${slot.endTime}`;
            }
            return '';
        }).filter(slot => slot);
    }

    // Transform component data back to API format
    transformToApiFormat(componentData) {
        return {
            doctorName: componentData.doctorName,
            gender: componentData.gender,
            email: componentData.email,
            phoneNumber: componentData.phoneNumber,
            licenseNumber: componentData.licenseNumber,
            educationalQualifications: componentData.educationalQualifications,
            specializations: componentData.specializations,
            experienceYears: parseInt(componentData.experienceYears) || 0,
            languageProficiency: componentData.languageProficiency,
            hasTelemedicineExperience: componentData.hasTelemedicineExperience,
            consultationFeesRange: componentData.consultationFeesRange,
            consultationTimeSlots: this.transformTimeSlotsToApi(componentData.consultationTimeSlots),
            consultationDays: componentData.consultationDays,
            consultationTypes: componentData.consultationTypes,
            insurancePartners: componentData.insurancePartners,
            address: componentData.address,
            state: componentData.state,
            city: componentData.city,
            pincode: componentData.pincode,
            nearbyLandmark: componentData.nearbyLandmark,
            floor: componentData.floor,
            hasLiftAccess: componentData.hasLiftAccess,
            hasWheelchairAccess: componentData.hasWheelchairAccess,
            hasParking: componentData.hasParking,
            otherFacilities: componentData.otherFacilities,
            location: componentData.location
        };
    }

    // Transform time slots back to API format
    transformTimeSlotsToApi(timeSlots) {
        if (!Array.isArray(timeSlots)) return [];
        
        return timeSlots.map(slot => {
            if (typeof slot === 'object' && slot.startTime && slot.endTime) {
                return slot;
            }
            
            // Parse string format like "10:00 - 17:00"
            const timeMatch = slot.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
            if (timeMatch) {
                return {
                    startTime: timeMatch[1],
                    endTime: timeMatch[2],
                    day: "Monday" // Default day, you might want to handle this differently
                };
            }
            
            return slot;
        });
    }
}

export const doctorConsultationVendorService = new DoctorConsultationVendorService(); 