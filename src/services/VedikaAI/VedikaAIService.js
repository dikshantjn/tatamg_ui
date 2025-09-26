import axios from '../../config/api.config.js';
import { API_CONFIG } from '../../config/api.config.js';
import { getUserId } from '../User/Auth/auth.utils.js';

/**
 * VedikaAI Service - Handles voice command processing and intent resolution
 * Based on Flutter VoiceCommandService implementation
 */
class VedikaAIService {
  /**
   * Resolve voice command intent using the backend API
   * @param {string} query - The voice command text
   * @param {Object} options - Additional options
   * @param {string} options.userId - User ID for context
   * @param {string} options.userLocation - User location in "lat,lng" format
   * @returns {Promise<Object>} Intent resolution result
   */
  static async resolveIntent(query, options = {}) {
    try {
      console.log('🎤 Resolving intent for query:', query);
      
      // Get userId from auth utils - ensure it's a string
      const userId = getUserId() || options.userId || "default_user_id";
      
      console.log('🎤 Retrieved userId from auth utils:', getUserId());
      console.log('🎤 Options userId:', options.userId);
      console.log('🎤 Final userId:', userId);
      
      // Get user location or use default Pune location - ensure it's a string
      const userLocation = options.userLocation || "19.076,72.8777";
      
      // Validate that we have valid string values
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId: must be a non-empty string');
      }
      
      if (!userLocation || typeof userLocation !== 'string') {
        throw new Error('Invalid userLocation: must be a non-empty string');
      }
      
      // Format payload exactly as expected by API
      const payload = {
        query: query.trim(),
        userId: userId,
        userLocation: userLocation
      };

      console.log('🎤 Sending payload to API:', payload);

      const endpoint = API_CONFIG.ENDPOINTS.VEDIKA_AI.RESOLVE_INTENT;
      const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
      
      console.log('🎤 Full API URL:', fullUrl);

      const response = await axios.post(endpoint, payload, {
        timeout: 60000, // 60 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('🎤 API Response Status:', response.status);
      console.log('🎤 API Response Data:', response.data);

      if (response.data && typeof response.data === 'object') {
        // Normalize the response data
        const normalizedData = this.normalizeResponse(response.data);
        console.log('🎤 Normalized response:', normalizedData);
        return normalizedData;
      }

      // Return default response if API response is invalid
      return {
        intent: 'UNKNOWN',
        entities: {},
        results: [],
        summary: 'Unable to process your request',
        suggestions: []
      };

    } catch (error) {
      console.error('🎤 Error resolving intent:', error);
      console.error('🎤 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      // For development/testing, use mock response when API fails
      console.log('🎤 API failed, using mock response for testing');
      const mockResponse = this.createMockResponse(query);
      return {
        ...mockResponse,
        isMockResponse: true,
        originalError: error.message
      };
    }
  }

  /**
   * Normalize API response to ensure consistent structure
   * @param {Object} data - Raw API response
   * @returns {Object} Normalized response
   */
  static normalizeResponse(data) {
    console.log('🎤 Normalizing API response:', data);
    
    const normalized = {
      intent: data.intent || 'UNKNOWN',
      entities: data.entities || {},
      results: [],
      summary: data.summary || '',
      suggestions: data.suggestions || [],
      meta: data.meta || {}
    };

    // Normalize results array to match the expected structure
    if (Array.isArray(data.results)) {
      normalized.results = data.results.map(result => {
        if (typeof result === 'object' && result !== null) {
          return {
            // Map API fields to expected component fields
            name: result.title || result.name || '',
            subtitle: result.subtitle || result.location || '',
            type: result.type || 'unknown',
            vendorId: result.vendorId || '',
            experience: result.experience || '',
            specializations: result.specializations || [],
            profile_picture: result.profile_picture || '',
            badges: result.badges || [],
            actions: result.actions || [],
            // Keep all original fields
            ...result
          };
        }
        return result;
      });
    }

    console.log('🎤 Normalized response:', normalized);
    return normalized;
  }

  /**
   * Get user-friendly error message
   * @param {Error} error - The error object
   * @returns {string} Friendly error message
   */
  static getFriendlyError(error) {
    const message = error.message?.toLowerCase() || '';
    const status = error.response?.status;
    
    // Handle specific HTTP status codes
    if (status === 404) {
      return 'API endpoint not found. Please check if the server is running.';
    }
    if (status === 500) {
      return 'Server error occurred. Please try again later.';
    }
    if (status === 401) {
      return 'Authentication required. Please log in and try again.';
    }
    if (status === 403) {
      return 'Access denied. You do not have permission to use this feature.';
    }
    
    // Handle network and connection errors
    if (message.includes('network') || message.includes('timeout')) {
      return 'Network issue. Please check your internet connection.';
    }
    if (message.includes('no match')) {
      return "Didn't catch that. Please try speaking again.";
    }
    if (message.includes('no speech') || message.includes('timeout')) {
      return "I didn't hear anything. Try again.";
    }
    if (message.includes('audio')) {
      return 'Audio issue detected. Please try again.';
    }
    if (message.includes('client')) {
      return 'Something went wrong. Please try again.';
    }
    if (message.includes('insufficient') || message.includes('permission')) {
      return 'Microphone permission needed. Enable it in Settings.';
    }
    if (/\bcode\s*:\s*\d+/.test(message)) {
      return 'Sorry, something went wrong.';
    }
    
    // Default error message
    return 'Sorry, I couldn\'t process your request. Please try again.';
  }

  /**
   * Get user location for context (if available)
   * @returns {Promise<string|null>} Location in "lat,lng" format or null
   */
  static async getUserLocation() {
    try {
      if (!navigator.geolocation) {
        console.log('🎤 Geolocation not available, using default Pune location');
        return "19.076,72.8777";
      }

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = `${latitude},${longitude}`;
            console.log('🎤 Retrieved user location:', location);
            resolve(location);
          },
          (error) => {
            console.warn('🎤 Could not get user location, using default Pune location:', error);
            resolve("19.076,72.8777"); // Default to Pune
          },
          { timeout: 5000, enableHighAccuracy: false }
        );
      });
    } catch (error) {
      console.warn('🎤 Error getting user location, using default Pune location:', error);
      return "19.076,72.8777"; // Default to Pune
    }
  }

  /**
   * Get current user ID from localStorage or auth context
   * @returns {string|null} User ID or null
   */
  static getCurrentUserId() {
    try {
      // Use auth utils to get user ID
      const userId = getUserId();
      console.log('🎤 Retrieved user ID:', userId);
      return userId;
    } catch (error) {
      console.warn('🎤 Could not get user ID:', error);
      return null;
    }
  }

  /**
   * Create a mock response for testing when API is not available
   * @param {string} query - The voice command text
   * @returns {Object} Mock response
   */
  static createMockResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    // Simple intent detection based on keywords
    let intent = 'UNKNOWN';
    let results = [];
    let summary = '';
    
    if (lowerQuery.includes('hospital') || lowerQuery.includes('bed')) {
      intent = 'BOOK_HOSPITAL_BED';
      summary = 'I found hospitals near you for bed booking.';
      results = [
        {
          name: 'City General Hospital',
          location: 'Downtown, Mumbai',
          type: 'hospital',
          rating: '4.5',
          badges: ['Emergency', 'ICU Available'],
          actions: [{ type: 'BOOK_HOSPITAL_BED', label: 'Book Bed' }]
        }
      ];
    } else if (lowerQuery.includes('doctor') || lowerQuery.includes('appointment')) {
      intent = 'BOOK_DOCTOR';
      summary = 'I found doctors available for consultation.';
      results = [
        {
          name: 'Dr. Rajesh Kumar',
          location: 'Cardiology, Delhi',
          type: 'doctor',
          rating: '4.8',
          badges: ['Online', 'Offline'],
          actions: [{ type: 'BOOK_DOCTOR', label: 'Book Appointment' }]
        }
      ];
    } else if (lowerQuery.includes('ambulance') || lowerQuery.includes('emergency')) {
      intent = 'NAVIGATE_SEARCH_AMBULANCE';
      summary = 'I can help you find emergency ambulance services.';
      results = [
        {
          name: 'Emergency Ambulance Service',
          location: 'Available 24/7',
          type: 'ambulance',
          rating: '4.9',
          badges: ['24/7', 'Emergency'],
          actions: [{ type: 'CALL_EMERGENCY', label: 'Call Now' }]
        }
      ];
    } else if (lowerQuery.includes('medicine') || lowerQuery.includes('order')) {
      intent = 'ORDER_MEDICINE';
      summary = 'I can help you order medicines online.';
      results = [
        {
          name: 'MediQuick Pharmacy',
          location: 'Online Delivery',
          type: 'pharmacy',
          rating: '4.7',
          badges: ['Fast Delivery', 'Prescription'],
          actions: [{ type: 'ORDER_MEDICINE', label: 'Order Now' }]
        }
      ];
    } else if (lowerQuery.includes('lab') || lowerQuery.includes('test') || lowerQuery.includes('diagnostic')) {
      intent = 'BOOK_LAB_TEST';
      summary = 'I found diagnostic centers near you for lab tests.';
      results = [
        {
          id: 'lab-001',
          name: 'City Diagnostic Center',
          location: 'Pune, Maharashtra',
          type: 'lab',
          rating: '4.6',
          badges: ['Home Collection', 'Same Day Report'],
          actions: [{ type: 'BOOK_LAB_TEST', label: 'Book Test' }]
        }
      ];
    } else {
      summary = 'I understand you said: "' + query + '". How can I help you with healthcare services?';
    }
    
    return {
      intent,
      entities: {},
      results,
      summary,
      suggestions: [
        'Find nearest hospital',
        'Book doctor appointment',
        'Order medicine',
        'Call ambulance'
      ]
    };
  }
}

export default VedikaAIService;
