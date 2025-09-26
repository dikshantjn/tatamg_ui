/**
 * Intent Navigation Service
 * Handles navigation and actions based on AI intent results
 * Based on Flutter intent_navigation.dart implementation
 */

class IntentNavigationService {
  /**
   * Handle intent action based on action type and result item
   * @param {Object} resultItem - The result item from API
   * @param {Object} action - The action to perform
   * @param {Function} navigate - Navigation function (e.g., from react-router-dom)
   * @returns {Promise<Object>} Action outcome
   */
  static async handleIntentAction(resultItem, action, navigate) {
    try {
      const actionType = (action?.type || action?.action?.type || '').toString().toUpperCase();
      const resultType = (resultItem?.type || '').toString().toUpperCase();
      
      console.log('🎯 Handling intent action:', { actionType, resultType, resultItem, action });

      switch (actionType) {
        case 'NAVIGATE_SEARCH_AMBULANCE':
        case 'CALL_EMERGENCY':
          if (resultType === 'EMERGENCY') {
            const phone = action?.phone || action?.action?.phone || '108';
            return {
              closeOverlay: true,
              showEmergencyDialog: true,
              doctorNumber: phone,
              ambulanceNumber: phone,
              bloodBankNumber: phone
            };
          }
          return {
            closeOverlay: true,
            route: '/ambulance',
            action: 'navigate'
          };

        case 'BOOK_BLOOD':
        case 'BOOK_BLOOD_BANK':
        case 'NAVIGATE_SEARCH_BLOOD':
          return {
            closeOverlay: true,
            route: '/blood-bank',
            action: 'navigate'
          };

        case 'BOOK_BED':
        case 'BOOK_HOSPITAL_BED':
          const hospitalVendorId = resultItem?.vendorId || 
                                 resultItem?.hospitalDetails?.vendorId || 
                                 action?.hospitalId || 
                                 action?.action?.hospitalId;
          
          if (hospitalVendorId) {
            return {
              closeOverlay: true,
              route: `/hospital-bed-booking/${hospitalVendorId}`,
              action: 'navigate'
            };
          }
          return {
            closeOverlay: true,
            route: '/hospital',
            action: 'navigate'
          };

        case 'BOOK_DOCTOR':
        case 'BOOK_APPOINTMENT':
        case 'BOOK_DOCTOR_CONSULTATION':
          const doctorVendorId = resultItem?.vendorId || action?.vendorId || action?.action?.vendorId;
          const mode = (action?.mode || action?.action?.mode || '').toString().toUpperCase();
          
          console.log('🎯 Doctor booking - vendorId:', doctorVendorId, 'mode:', mode);
          console.log('🎯 Result item:', resultItem);
          console.log('🎯 Action:', action);
          
          if (doctorVendorId) {
            // Determine route based on mode or default to offline
            let route;
            if (mode === 'ONLINE') {
              route = `/doctor-consultation/online/book/${doctorVendorId}`;
            } else if (mode === 'OFFLINE') {
              route = `/doctor-consultation/offline/book/${doctorVendorId}`;
            } else {
              // Default to offline if no mode specified
              route = `/doctor-consultation/offline/book/${doctorVendorId}`;
            }
            
            console.log('🎯 Generated route:', route);
            
            return {
              closeOverlay: true,
              route: route,
              action: 'navigate',
              arguments: { 
                vendorId: doctorVendorId,
                doctorData: resultItem,
                mode: mode || 'OFFLINE'
              }
            };
          }
          
          console.log('🎯 No vendorId found, navigating to doctor list');
          return {
            closeOverlay: true,
            route: '/doctor-consultation',
            action: 'navigate'
          };

        case 'BOOK_LAB_TEST':
          // Extract vendor ID from the nested action structure
          const vendorId = action?.action?.labId || 
                          action?.labId || 
                          resultItem?.id;
          
          console.log('🎯 Lab test booking - vendorId:', vendorId);
          console.log('🎯 Result item:', resultItem);
          console.log('🎯 Action:', action);
          console.log('🎯 Action.action:', action?.action);
          
          if (vendorId) {
            const route = `/lab-tests/book/${vendorId}`;
            console.log('🎯 Generated lab route:', route);
            
            return {
              closeOverlay: true,
              route: route,
              action: 'navigate',
              arguments: { 
                vendorId: vendorId,
                labData: resultItem
              }
            };
          }
          
          console.log('🎯 No vendorId found, navigating to lab list');
          return {
            closeOverlay: true,
            route: '/lab-tests',
            action: 'navigate'
          };

        case 'ORDER_MEDICINE':
        case 'ORDER_MEDICINE_PRESCRIPTION':
          return {
            closeOverlay: true,
            route: '/new-medicine-order',
            action: 'navigate'
          };

        case 'ADD_TO_CART':
          const productId = action?.productId || 
                           action?.action?.productId || 
                           resultItem?.productId || 
                           resultItem?.product?.productId;
          
          if (productId) {
            try {
              // Add to cart logic would go here
              console.log('🛒 Adding product to cart:', productId);
              return {
                closeOverlay: false,
                showMessage: 'Added to cart successfully',
                action: 'addToCart'
              };
            } catch (error) {
              console.error('🛒 Error adding to cart:', error);
              return {
                closeOverlay: false,
                showMessage: 'Failed to add to cart',
                action: 'error'
              };
            }
          }
          return {
            closeOverlay: false,
            showMessage: 'No product specified to add to cart',
            action: 'error'
          };

        case 'TRACK':
          return {
            closeOverlay: true,
            route: '/track-order',
            action: 'navigate'
          };

        default:
          console.log('🎯 Unknown action type:', actionType);
          return {
            closeOverlay: false,
            showMessage: 'Action not supported yet',
            action: 'unknown'
          };
      }
    } catch (error) {
      console.error('🎯 Error handling intent action:', error);
      return {
        closeOverlay: false,
        showMessage: 'Something went wrong',
        action: 'error'
      };
    }
  }

  /**
   * Check if intent should auto-navigate
   * @param {string} intent - The intent string
   * @returns {boolean} Whether to auto-navigate
   */
  static shouldAutoNavigateForIntent(intent) {
    const upperIntent = intent.toUpperCase();
    switch (upperIntent) {
      case 'BOOK_HOSPITAL_BED':
      case 'BOOK_BED':
      case 'BOOK_LAB_TEST':
        return false; // Present list first
      default:
        return true;
    }
  }

  /**
   * Get icon for result type
   * @param {string} type - Result type
   * @returns {string} Icon name
   */
  static getIconForType(type) {
    switch (type?.toLowerCase()) {
      case 'bed':
        return 'bed';
      case 'status':
        return 'receipt';
      case 'doctor':
        return 'person';
      case 'hospital':
        return 'local_hospital';
      case 'lab':
        return 'science';
      case 'ambulance':
        return 'local_hospital';
      case 'blood':
        return 'bloodtype';
      default:
        return 'local_hospital';
    }
  }

  /**
   * Format result item for display
   * @param {Object} resultItem - Raw result item
   * @returns {Object} Formatted result item
   */
  static formatResultItem(resultItem) {
    if (!resultItem || typeof resultItem !== 'object') {
      return {
        title: 'Unknown',
        subtitle: '',
        type: 'unknown',
        rating: '',
        badges: [],
        actions: []
      };
    }

    // Ensure we have proper actions for doctor booking
    let actions = Array.isArray(resultItem.actions) ? resultItem.actions : [];
    
    // If it's a doctor and no proper booking actions exist, create them
    if (resultItem.type === 'doctor' && !actions.some(a => a.type === 'BOOK_DOCTOR' || a.type === 'BOOK_APPOINTMENT')) {
      actions = [
        {
          type: 'BOOK_DOCTOR',
          label: 'Book Appointment',
          action: 'BOOK_DOCTOR'
        }
      ];
    }
    
    // If it's a lab and no proper booking actions exist, create them
    if (resultItem.type === 'lab' && !actions.some(a => a.type === 'BOOK_LAB_TEST')) {
      actions = [
        {
          type: 'BOOK_LAB_TEST',
          label: 'Book Test',
          action: 'BOOK_LAB_TEST'
        }
      ];
    }

    return {
      title: resultItem.title || resultItem.name || 'Unknown',
      subtitle: resultItem.subtitle || resultItem.location || '',
      type: resultItem.type || 'unknown',
      rating: resultItem.rating || '',
      badges: Array.isArray(resultItem.badges) ? resultItem.badges : [],
      actions: actions,
      vendorId: resultItem.vendorId,
      id: resultItem.id,
      description: resultItem.description,
      profilePicture: resultItem.profile_picture || resultItem.profilePicture,
      specializations: resultItem.specializations,
      experience: resultItem.experience,
      ...resultItem
    };
  }

  /**
   * Check if result supports online consultation
   * @param {Object} resultItem - Result item
   * @returns {boolean} Supports online
   */
  static supportsOnline(resultItem) {
    const badges = resultItem.badges || [];
    return badges.some(badge => 
      badge.toString().toLowerCase().includes('online') || 
      badge.toString().toLowerCase().includes('tele')
    );
  }

  /**
   * Check if result supports offline consultation
   * @param {Object} resultItem - Result item
   * @returns {boolean} Supports offline
   */
  static supportsOffline(resultItem) {
    const badges = resultItem.badges || [];
    return badges.some(badge => 
      badge.toString().toLowerCase().includes('offline') || 
      badge.toString().toLowerCase().includes('in-person')
    );
  }
}

export default IntentNavigationService;
