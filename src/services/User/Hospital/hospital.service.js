import axios from 'axios';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';
import { getAuthHeader } from '../../../services/User/Auth/auth.utils';

class HospitalService {
    async getAllHospitals() {
        try {
            const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_ALL_HOSPITALS));
            if (response.data) {
                return this.formatHospitalsData(response.data.hospitals);
            }
            return [];
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            throw error;
        }
    }

    async getHospitalWards(vendorId) {
        try {
            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.HOSPITALS.GET_WARDS, { vendorId }));
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching hospital wards:', error);
            throw error;
        }
    }

    async createBedBooking(bookingData) {
        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.CREATE_BED_BOOKING);
            
            console.log('🌐 API URL:', url);
            console.log('📦 Request Body:', JSON.stringify(bookingData, null, 2));
            console.log('🔑 Headers:', {
                'Content-Type': 'application/json'
            });

            const response = await axios.post(url, bookingData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("✅ Create Bed Booking Response Status:", response.status);
            console.log("✅ Create Bed Booking Response Headers:", response.headers);
            console.log("✅ Create Bed Booking Response Data:", JSON.stringify(response.data, null, 2));

            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Bed booking request sent successfully'
                };
            } else {
                console.log("❌ Create Bed Booking Error:", response.status, "-", response.data);
                return {
                    success: false,
                    message: `Failed to create bed booking: ${JSON.stringify(response.data)}`
                };
            }
        } catch (error) {
            console.error("❌ Create Bed Booking Error Details:");
            console.error("Status:", error.response?.status);
            console.error("Response Data:", error.response?.data);
            console.error("Error Message:", error.message);
            console.error("Full Error Object:", error);
            
            return {
                success: false,
                message: `Failed to create bed booking: ${error.response?.data?.message || error.message}`
            };
        }
    }

    async getUserBookings(userId) {
        try {
            const url = getApiUrl(replaceUrlParams(API_CONFIG.ENDPOINTS.HOSPITALS.GET_USER_BOOKINGS, { userId }));
            console.log('🌐 Fetching bookings from URL:', url);
            
            const headers = getAuthHeader();
            console.log('🔑 Using auth headers:', headers);
            
            const response = await axios.get(url, { headers });
            console.log('📦 API Response:', response.data);
            
            if (response.data && response.data.success) {
                console.log('✅ Successfully fetched bookings');
                return {
                    success: true,
                    bookings: response.data.bookings,
                    message: response.data.message
                };
            }
            
            console.log('⚠️ API returned success: false');
            return {
                success: false,
                bookings: [],
                message: 'Failed to fetch bookings'
            };
        } catch (error) {
            console.error('❌ Error in getUserBookings:', error);
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return {
                success: false,
                bookings: [],
                message: error.response?.data?.message || 'Failed to fetch bookings'
            };
        }
    }

    formatHospitalsData(hospitals) {
        return hospitals.map(hospital => {
            const [lat, lng] = hospital.location.split(',').map(coord => parseFloat(coord.trim()));
            return {
                vendorId: hospital.vendorId,
                generatedId: hospital.generatedId,
                name: hospital.name,
                type: hospital.specialityTypes.join(', '),
                rating: 4.5, // You might want to add this to your API
                location: { lat, lng },
                address: `${hospital.address}, ${hospital.landmark}, ${hospital.city}, ${hospital.state} - ${hospital.pincode}`,
                phone: hospital.contactNumber,
                openHours: hospital.workingTime,
                workingDays: hospital.workingDays,
                features: [...hospital.servicesOffered, ...hospital.otherFacilities],
                distance: "Calculating...", // This should be calculated based on user's location
                availability: `${hospital.bedsAvailable} beds available`,
                accreditation: hospital.certifications.length > 0 ? "Certified Hospital" : "General Hospital",
                specialities: hospital.specialityTypes,
                insuranceAccepted: hospital.insuranceCompanies,
                facilities: {
                    hasLiftAccess: hospital.hasLiftAccess,
                    hasParking: hospital.hasParking,
                    hasWheelchairAccess: hospital.hasWheelchairAccess,
                    providesAmbulanceService: hospital.providesAmbulanceService,
                    providesOnlineConsultancy: hospital.providesOnlineConsultancy
                },
                feesRange: hospital.feesRange,
                about: hospital.about
            };
        });
    }
}

export const hospitalService = new HospitalService(); 