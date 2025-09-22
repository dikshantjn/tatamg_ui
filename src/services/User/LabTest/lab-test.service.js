import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getToken, getUserId } from '../Auth/auth.utils';

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Function to parse location string to coordinates
const parseLocation = (locationString) => {
  if (!locationString) return null;
  const coords = locationString.split(',').map(coord => parseFloat(coord.trim()));
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    return { lat: coords[0], lng: coords[1] };
  }
  return null;
};

// Function to get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        // Default to Pune center if location access is denied
        resolve({
          lat: 18.5204,
          lng: 73.8567
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Function to fetch all diagnostic centers
export const getAllDiagnosticCenters = async () => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await apiClient.get(getApiUrl(API_CONFIG.ENDPOINTS.LAB_TEST.GET_ALL_DIAGNOSTIC_CENTERS), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;
    console.log('API Response:', data);

    if (response.status !== 200) {
      throw new Error(data.message || 'Failed to fetch diagnostic centers');
    }

    // Handle both response structures: direct diagnosticCenters or nested data.diagnosticCenters
    const diagnosticCenters = data.diagnosticCenters || (data.data && data.data.diagnosticCenters);
    console.log('Diagnostic Centers found:', diagnosticCenters ? diagnosticCenters.length : 0);
    
    if (diagnosticCenters) {
      // Transform the API data to match our component structure
      return diagnosticCenters.map(center => {
        const coordinates = parseLocation(center.location);
        console.log('Processing center:', center.name, 'with coordinates:', coordinates);
        
        return {
          id: center.diagnosticCenterId,
          vendorId: center.vendorId, // Add vendorId from API response
          name: center.name,
          address: `${center.address}, ${center.city}, ${center.state} - ${center.pincode}`,
          phone: center.mainContactNumber,
          emergencyPhone: center.emergencyContactNumber,
          email: center.email,
          website: center.website,
          timing: center.businessTimings,
          businessDays: center.businessDays,
          services: center.testTypes || [],
          coordinates: coordinates,
          image: center.centerPhotosUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
          rating: 4.5, // Default rating since not provided in API
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews for demo
          sampleCollectionMethod: center.sampleCollectionMethod,
          emergencyHandling: center.emergencyHandlingFastTrack,
          parkingAvailable: center.parkingAvailable,
          wheelchairAccess: center.wheelchairAccess,
          ambulanceService: center.ambulanceServiceAvailable,
          nearbyLandmark: center.nearbyLandmark,
          languagesSpoken: center.languagesSpoken || [],
          homeCollectionLimit: center.homeCollectionGeoLimit,
          generatedId: center.generatedId,
          ownerName: center.ownerName
        };
      }).filter(center => center.coordinates !== null); // Filter out centers without valid coordinates
    }
    
    // If no diagnostic centers found, return empty array
    console.log('No diagnostic centers found');
    return [];
  } catch (error) {
    console.error('Error fetching diagnostic centers:', error);
    throw error;
  }
};

// Function to get nearby labs within specified radius
export const getNearbyLabs = async (userLocation, radiusKm = 5) => {
  try {
    const allLabs = await getAllDiagnosticCenters();
    
    // Calculate distance for each lab and filter by radius
    const nearbyLabs = allLabs
      .map(lab => ({
        ...lab,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lab.coordinates.lat,
          lab.coordinates.lng
        )
      }))
      .filter(lab => lab.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance); // Sort by distance
    
    return nearbyLabs;
  } catch (error) {
    console.error('Error getting nearby labs:', error);
    throw error;
  }
};

// Function to format distance for display
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

class LabTestService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Create lab test booking
  async createBooking(bookingData) {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiClient.post(getApiUrl(API_CONFIG.ENDPOINTS.LAB_TEST.CREATE_BOOKING), {
        vendorId: bookingData.vendorId,
        userId: userId,
        selectedTests: bookingData.selectedTests,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        homeCollectionRequired: bookingData.homeCollectionRequired,
        reportDeliveryAtHome: bookingData.reportDeliveryAtHome,
        prescriptionUrl: bookingData.prescriptionUrl || null,
        testFees: bookingData.testFees,
        reportDeliveryFees: bookingData.reportDeliveryFees,
        discount: bookingData.discount || 0,
        gst: bookingData.gst || 0,
        totalAmount: bookingData.totalAmount,
        userAddress: bookingData.userAddress || '',
        userLocation: bookingData.userLocation || '',
        centerLocationUrl: bookingData.centerLocationUrl || ''
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data || {};
      const isHttpOk = response.status >= 200 && response.status < 300; // accept 200/201
      const apiSuccess = typeof data.success === 'undefined' ? true : Boolean(data.success);
      if (!isHttpOk || !apiSuccess) {
        throw new Error(data.message || 'Failed to create lab test booking');
      }

      // Normalize payload shape
      const normalizedData = data.data || data.booking || data;

      return {
        success: true,
        data: normalizedData,
        message: data.message || 'Lab test booking created successfully'
      };
    } catch (error) {
      console.error('Error creating lab test booking:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create lab test booking'
      };
    }
  }

  // Get all diagnostic centers
  async getAllDiagnosticCenters() {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await apiClient.get(getApiUrl(API_CONFIG.ENDPOINTS.LAB_TEST.GET_ALL_DIAGNOSTIC_CENTERS), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to fetch diagnostic centers');
      }

      // Handle both response structures: direct diagnosticCenters or nested data.diagnosticCenters
      const diagnosticCenters = data.diagnosticCenters || (data.data && data.data.diagnosticCenters);

      return {
        success: true,
        data: { diagnosticCenters },
        message: data.message
      };
    } catch (error) {
      console.error('Error fetching diagnostic centers:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch diagnostic centers'
      };
    }
  }
}

const labTestService = new LabTestService();
export default labTestService; 