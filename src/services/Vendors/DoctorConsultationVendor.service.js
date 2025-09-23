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

    // Get online pending appointments
    async getOnlinePendingAppointments(vendorId) {
        try {
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_ONLINE_PENDING_APPOINTMENTS, { vendorId }));
            
            const response = await apiClient.get(url, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            return data.appointments || []; // Return the appointments array from the response
        } catch (error) {
            console.error('Error fetching online pending appointments:', error);
            throw error;
        }
    }

    // Get offline pending appointments
    async getOfflinePendingAppointments(vendorId) {
        try {
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_OFFLINE_PENDING_APPOINTMENTS, { vendorId }));
            
            const response = await apiClient.get(url, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            return data.appointments || []; // Return the appointments array from the response
        } catch (error) {
            console.error('Error fetching offline pending appointments:', error);
            throw error;
        }
    }

    // Transform appointment data from API to component format
    transformAppointmentData(apiAppointment, index) {
        return {
            id: apiAppointment.clinicAppointmentId,
            srNo: index + 1,
            patientName: apiAppointment.user?.name || 'Unknown Patient',
            mobileNo: apiAppointment.user?.phone_number || 'N/A',
            appointmentType: apiAppointment.isOnline ? 'Virtual' : 'In Clinic',
            dateTime: `${apiAppointment.date} ${apiAppointment.time}`,
            paidAmount: apiAppointment.paidAmount || 0,
            status: apiAppointment.status || 'pending',
            patientEmail: apiAppointment.user?.emailId || 'N/A',
            symptoms: apiAppointment.notes || 'No symptoms provided',
            notes: apiAppointment.notes || 'No additional notes',
            clinicAppointmentId: apiAppointment.clinicAppointmentId,
            doctorId: apiAppointment.doctorId,
            userId: apiAppointment.userId,
            paymentStatus: apiAppointment.paymentStatus,
            vendorId: apiAppointment.vendorId,
            meetingUrl: apiAppointment.meetingUrl,
            doctorAttendanceStatus: apiAppointment.doctorAttendanceStatus,
            userAttendanceStatus: apiAppointment.userAttendanceStatus,
            createdAt: apiAppointment.createdAt,
            updatedAt: apiAppointment.updatedAt,
            doctor: apiAppointment.doctor,
            user: apiAppointment.user
        };
    }

    // Update appointment status (used for all status changes including completion)
    async updateAppointmentStatus(appointmentId, status) {
        try {
            console.log('Service: Updating appointment status:', { appointmentId, status });
            
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.UPDATE_APPOINTMENT_STATUS, { appointmentId }));
            console.log('Service: API URL:', url);
            console.log('Service: Request body:', { status });
            
            const response = await apiClient.put(url, { status }, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Service: API Response:', response.data);

            // Handle both 200 and 201 status codes
            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if the response indicates success
            if (response.data.success === false) {
                throw new Error(response.data.message || 'Failed to update appointment status');
            }

            return response.data;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    }

    // Complete appointment (wrapper for updateAppointmentStatus with 'completed' status)
    async completeAppointment(appointmentId) {
        return this.updateAppointmentStatus(appointmentId, 'completed');
    }

    // Get completed appointments
    async getCompletedAppointments(vendorId) {
        try {
            console.log('Service: Fetching completed appointments for vendor:', vendorId);
            
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.DOCTOR_CONSULTATION.GET_COMPLETED_APPOINTMENTS, { vendorId }));
            console.log('Service: API URL:', url);
            
            const response = await apiClient.get(url, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Service: API Response:', response.data);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch completed appointments');
            }

            // Transform the API data to match component expectations
            const transformedAppointments = response.data.appointments.map((apiAppointment, index) => 
                this.transformCompletedAppointmentData(apiAppointment, index)
            );

            return transformedAppointments;
        } catch (error) {
            console.error('Error fetching completed appointments:', error);
            throw error;
        }
    }

    // Transform completed appointment data for history component
    transformCompletedAppointmentData(apiAppointment, index) {
        return {
            id: apiAppointment.clinicAppointmentId,
            srNo: index + 1,
            patientName: apiAppointment.user?.name || 'N/A',
            patientEmail: apiAppointment.user?.emailId || 'N/A',
            patientPhone: apiAppointment.user?.phone_number || 'N/A',
            doctorName: apiAppointment.doctor?.doctorName || 'N/A',
            doctorSpecialty: apiAppointment.doctor?.specializations?.join(', ') || 'N/A',
            date: apiAppointment.date,
            time: apiAppointment.time,
            duration: 30, // Default duration since not provided in API
            type: apiAppointment.isOnline ? 'video' : 'offline',
            status: apiAppointment.status,
            symptoms: 'N/A', // Not provided in API
            diagnosis: 'N/A', // Not provided in API
            prescription: 'N/A', // Not provided in API
            rating: null, // Not provided in API
            consultationFee: apiAppointment.paidAmount || 0,
            paymentStatus: apiAppointment.paymentStatus || 'unknown',
            notes: apiAppointment.notes || 'No notes available',
            meetingUrl: apiAppointment.meetingUrl,
            createdAt: apiAppointment.createdAt,
            updatedAt: apiAppointment.updatedAt,
            // Additional fields from API
            clinicAppointmentId: apiAppointment.clinicAppointmentId,
            doctorId: apiAppointment.doctorId,
            userId: apiAppointment.userId,
            vendorId: apiAppointment.vendorId,
            isOnline: apiAppointment.isOnline,
            attachments: apiAppointment.attachments || [],
            healthRecordIds: apiAppointment.healthRecordIds || [],
            doctor: apiAppointment.doctor,
            user: apiAppointment.user
        };
    }

    // Download invoice
    async downloadInvoice(appointmentId) {
        try {
            console.log('Service: Downloading invoice for appointment:', appointmentId);
            
            const authData = vendorAuthService.getVendorAuthData();
            if (!authData?.token) {
                throw new Error('No authentication token found');
            }

            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.CLINIC_INVOICE.GET_INVOICE, { appointmentId }));
            console.log('Service: Invoice API URL:', url);
            
            const response = await apiClient.get(url, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                },
                responseType: 'blob' // Important for PDF downloads
            });

            console.log('Service: Invoice download response:', response);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create blob URL for download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url_blob = window.URL.createObjectURL(blob);
            
            // Create temporary link element for download
            const link = document.createElement('a');
            link.href = url_blob;
            link.download = `invoice-${appointmentId}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url_blob);

            return { success: true, message: 'Invoice downloaded successfully' };
        } catch (error) {
            console.error('Error downloading invoice:', error);
            throw error;
        }
    }

    // Get available appointment statuses
    getAvailableStatuses() {
        return [
            'pending',
            'confirmed',
            'completed',
            'cancelled',
            'postponed',
            'rescheduled',
            'no_call'
            // Excluded 'no_show' as requested
        ];
    }
}

export const doctorConsultationVendorService = new DoctorConsultationVendorService(); 