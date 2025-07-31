import React, { useState, useEffect } from 'react';
import './MedicineDelivery.css';

// Import icons/images
import whatsappIcon from '../../../assets/icons/whatsapp.png';
import phoneIcon from '../../../assets/icons/mobile-circle.png';
import { uploadPrescriptionService, searchMoreVendorsService } from '../../../services/User/MedicineDelivery/medicine-delivery.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import Lottie from 'lottie-react';
import scanPrescriptionAnim from '../../../assets/animations/scanPrescription.json';
import verifiedAnim from '../../../assets/animations/verified.json';
import { useSocket } from '../../../hooks/useSocket';
import { useNavigate } from 'react-router-dom';

function MedicineDelivery() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(null); // null = not checked, true = allowed, false = denied
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10 sec for demo
  const [searchMore, setSearchMore] = useState(false);
  const [prescriptionVerified, setPrescriptionVerified] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);

  const userId = getUserId();
  const { subscribe, unsubscribe } = useSocket(userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationAllowed(false);
      return;
    }
    
    // Check if permission is already granted
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        console.log('Permission status:', permissionStatus.state);
        if (permissionStatus.state === 'granted') {
          setLocationAllowed(true);
        } else if (permissionStatus.state === 'denied') {
          setLocationAllowed(false);
        } else {
          // Permission not determined yet, will be requested when needed
          setLocationAllowed(null);
        }
      }).catch((error) => {
        console.error('Error checking permission:', error);
        // Fallback: assume permission not determined
        setLocationAllowed(null);
      });
    } else {
      // Fallback for browsers that don't support permissions API
      // Try a quick position check to see if permission is already granted
      navigator.geolocation.getCurrentPosition(
        () => setLocationAllowed(true),
        () => setLocationAllowed(null), // Not determined, will request when needed
        { timeout: 1000, maximumAge: 0 }
      );
    }
  }, []);

  // Additional effect to handle permission changes
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        const handlePermissionChange = () => {
          console.log('Permission changed to:', permissionStatus.state);
          if (permissionStatus.state === 'granted') {
            setLocationAllowed(true);
          } else if (permissionStatus.state === 'denied') {
            setLocationAllowed(false);
          }
        };
        
        permissionStatus.addEventListener('change', handlePermissionChange);
        return () => {
          permissionStatus.removeEventListener('change', handlePermissionChange);
        };
      });
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showVerifyDialog && countdown > 0 && !searchMore && !prescriptionVerified) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0 && showVerifyDialog && !searchMore && !prescriptionVerified) {
      setSearchMore(true);
    }
    return () => clearInterval(timer);
  }, [showVerifyDialog, countdown, searchMore, prescriptionVerified]);

  // Listen for prescription verified event
  useEffect(() => {
    const handleOrderStatusUpdated = (data) => {
      if (data && data.status === 'PrescriptionVerified') {
        setPrescriptionVerified(true);
        setCountdown(0);
      }
    };
    subscribe('orderStatusUpdated', handleOrderStatusUpdated);
    return () => {
      unsubscribe('orderStatusUpdated', handleOrderStatusUpdated);
    };
  }, [subscribe, unsubscribe]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploading(true);
      setUploadResult(null);
      try {
        if (!userId) {
          setUploadResult({ success: false, message: 'User not found. Please login again.' });
          setUploading(false);
          return;
        }
        if (!navigator.geolocation) {
          setUploadResult({ success: false, message: 'Geolocation is not supported by your browser.' });
          setUploading(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            // TODO: Replace with actual file upload logic to get prescriptionUrl
            const prescriptionUrl = 'https://example.com/path/to/prescription.jpg';
            const response = await uploadPrescriptionService(userId, prescriptionUrl, userLocation);
            setUploadResult({ success: true, message: response.data.message });
            setShowVerifyDialog(true);
            setCountdown(10); // 10 sec for demo
            setSearchMore(false);
            setPrescriptionVerified(false);
            setPrescriptionId(response.data.prescription?.prescriptionId || null);
          } catch (error) {
            setUploadResult({ success: false, message: error.response?.data?.error || 'Upload failed' });
          } finally {
            setUploading(false);
          }
        }, (error) => {
          setUploadResult({ success: false, message: 'Failed to get your location. Please allow location access.' });
          setUploading(false);
        });
      } catch (error) {
        setUploadResult({ success: false, message: error.message || 'Upload failed' });
        setUploading(false);
      }
    }
  };

  const handleWhatsAppOrder = () => {
    // Implement WhatsApp integration
    window.open('https://wa.me/9370320066', '_blank');
  };

  const handleCallOrder = () => {
    // Implement call functionality
    window.location.href = 'tel:YOUR_PHONE_NUMBER';
  };

  const handleSearchMore = () => {
    if (!prescriptionId) return;
    if (!navigator.geolocation) {
      setUploadResult({ success: false, message: 'Geolocation is not supported by your browser.' });
      return;
    }
    setUploading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        await searchMoreVendorsService(prescriptionId, userLocation);
        setSearchMore(false);
        setCountdown(10);
        setShowVerifyDialog(true);
        setPrescriptionVerified(false);
      } catch (error) {
        setUploadResult({ success: false, message: error.response?.data?.error || 'Search more vendors failed' });
      } finally {
        setUploading(false);
      }
    }, (error) => {
      setUploadResult({ success: false, message: 'Failed to get your location. Please allow location access.' });
      setUploading(false);
    });
  };

  const handleTrackOrder = () => {
    setShowVerifyDialog(false);
    navigate('/track-order');
  };

  const handleCloseDialog = () => {
    setShowVerifyDialog(false);
    setPrescriptionVerified(false);
    setCountdown(10);
    setSearchMore(false);
    setSelectedFile(null);
    setUploadResult(null);
    setPrescriptionId(null);
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationAllowed(false);
      return;
    }
    
    console.log('Requesting location permission...');
    
    // Force the browser to show the permission prompt
    // by calling getCurrentPosition with a simple success callback
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location permission granted:', position.coords);
        setLocationAllowed(true);
      },
      (error) => {
        console.error('Location permission denied:', error);
        if (error.code === 1) {
          // Permission denied
          console.log('User denied location permission');
          setLocationAllowed(false);
        } else if (error.code === 2) {
          // Position unavailable
          console.log('Position unavailable');
          setLocationAllowed(false);
        } else if (error.code === 3) {
          // Timeout
          console.log('Location request timed out');
          setLocationAllowed(false);
        } else {
          console.log('Unknown location error:', error);
          setLocationAllowed(false);
        }
      },
      {
        enableHighAccuracy: false, // Start with low accuracy to ensure prompt shows
        timeout: 30000, // 30 seconds timeout
        maximumAge: 0 // Don't use cached position
      }
    );
  };

  const resetLocationPermission = () => {
    console.log('Attempting to reset location permission...');
    // Try to force a new permission request by clearing any cached state
    setLocationAllowed(null);
    
    // Wait a moment then try to request permission again
    setTimeout(() => {
      requestLocationPermission();
    }, 100);
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="medicine-delivery-container">
      {showVerifyDialog && (
        <div className="verify-dialog-overlay">
          <div className="verify-dialog">
            {prescriptionVerified ? (
              <>
                <button className="verify-dialog-close" onClick={handleCloseDialog} title="Close">&times;</button>
                <Lottie animationData={verifiedAnim} loop={false} className="verify-lottie" />
                <h2 className="verified-title">Prescription Verified!</h2>
                <p className="verified-desc">Your prescription has been successfully verified by a medical shop.<br/>You will be contacted soon for further steps.</p>
                <button className="track-order-btn" onClick={handleTrackOrder}>Track Order</button>
              </>
            ) : !searchMore ? (
              <>
                <Lottie animationData={scanPrescriptionAnim} loop={true} className="verify-lottie" />
                <h2>Verifying your prescription...</h2>
                <p>We are verifying your prescription with the nearest medical shop.<br/>This may take up to 10 seconds.</p>
                <div className="countdown-timer">{formatTime(countdown)}</div>
              </>
            ) : (
              <>
                <Lottie animationData={scanPrescriptionAnim} loop={true} className="verify-lottie" />
                <h2>Still not verified?</h2>
                <p>We couldn't verify your prescription within 10 seconds.<br/>Would you like to search more medical shops?</p>
                <button className="search-more-btn" onClick={handleSearchMore}>Search More Medical Shops</button>
              </>
            )}
          </div>
        </div>
      )}
      {locationAllowed === false ? (
        <div className="location-error-msg">
          <h2>Location Access Required</h2>
          <p>
            To upload your prescription and find the nearest medical shops, we need access to your location.<br/>
            <b>Location permission has been denied. Please follow these steps to enable it:</b>
          </p>
          <div style={{ textAlign: 'left', margin: '20px 0', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '10px' }}>How to Enable Location Access:</h4>
            <ol style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Click the lock/info icon in your browser's address bar</li>
              <li>Find "Location" or "Site settings"</li>
              <li>Change from "Block" to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
            <div style={{ marginTop: '15px', fontSize: '0.9em', opacity: 0.8 }}>
              <strong>Browser-specific instructions:</strong>
              <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                <li><strong>Chrome:</strong> Click the lock icon → Site settings → Location → Allow</li>
                <li><strong>Firefox:</strong> Click the shield icon → Site permissions → Location access → Allow</li>
                <li><strong>Safari:</strong> Safari → Preferences → Websites → Location → Allow</li>
                <li><strong>Edge:</strong> Click the lock icon → Site permissions → Location → Allow</li>
              </ul>
            </div>
            <p style={{ marginTop: '15px', fontSize: '0.9em', opacity: 0.8 }}>
              <strong>Alternative:</strong> You can also try the buttons below to request permission again.
            </p>
          </div>
          <button 
            className="request-location-btn" 
            onClick={requestLocationPermission}
            style={{ marginTop: '10px' }}
          >
            Try Requesting Permission Again
          </button>
          <button 
            className="request-location-btn" 
            onClick={resetLocationPermission}
            style={{ 
              marginTop: '10px', 
              marginLeft: '10px',
              background: 'linear-gradient(45deg, #ff9800, #f57c00)'
            }}
          >
            Reset & Try Again
          </button>
        </div>
      ) : locationAllowed === null ? (
        <div className="location-permission-request">
          <h2>Location Permission Required</h2>
          <p>
            To upload your prescription and find the nearest medical shops, we need access to your location.<br/>
            Please click the button below to allow location access.
          </p>
          <button className="request-location-btn" onClick={requestLocationPermission}>
            Allow Location Access
          </button>
          <button 
            className="request-location-btn" 
            onClick={() => {
              console.log('Alternative permission request...');
              // Try a different approach to trigger permission
              navigator.geolocation.getCurrentPosition(
                () => setLocationAllowed(true),
                () => setLocationAllowed(false),
                { timeout: 5000, maximumAge: 0 }
              );
            }}
            style={{ 
              marginTop: '10px', 
              background: 'linear-gradient(45deg, #ff9800, #f57c00)',
              fontSize: '0.9em',
              padding: '10px 20px'
            }}
          >
            Try Alternative Method
          </button>
          <p style={{ marginTop: '15px', fontSize: '0.9em', opacity: 0.8 }}>
            💡 <strong>Tip:</strong> If the permission prompt doesn't appear, try the alternative method or refresh the page.
          </p>
        </div>
      ) : (
        <div className="upload-section">
          <h2>Upload Prescription</h2>
          <p>Upload your prescription and we'll deliver your medicines</p>
          
          <input
            type="file"
            id="fileInput"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <button className="upload-btn" onClick={() => document.getElementById('fileInput').click()} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </button>
          
          {selectedFile && (
            <div className="selected-file">
              <p>Selected file: {selectedFile.name}</p>
            </div>
          )}
          {uploadResult && (
            <div className={uploadResult.success ? 'upload-success' : 'upload-error'}>
              {uploadResult.message}
            </div>
          )}
        </div>
      )}

      <div className="divider">
        <span>OR YOU CAN ORDER VIA</span>
      </div>

      <div className="order-options compact">
        <button className="order-option whatsapp" onClick={handleWhatsAppOrder}>
          <img src={whatsappIcon} alt="WhatsApp" />
          <span>Order with WhatsApp</span>
        </button>
        <button className="order-option call" onClick={handleCallOrder}>
          <img src={phoneIcon} alt="Call" />
          <span>Call us to Order</span>
        </button>
      </div>

      <div className="coupon-section">
        <div className="coupon-card app-offer">
          <div className="coupon-header">APP ONLY OFFER</div>
          <div className="coupon-discount">Get 25% OFF</div>
          <div className="coupon-desc">on medicine orders</div>
          <button className="install-app-btn">
            Install App
            {/* Placeholder icons for Play Store and Apple */}
            <span className="store-icons">
              <span className="playstore-icon">▶️</span>
              <span className="apple-icon"></span>
            </span>
          </button>
        </div>
        <div className="coupon-card website-offer">
          <div className="coupon-header">WEBSITE OFFER</div>
          <div className="coupon-discount">Get 24% OFF</div>
          <div className="coupon-desc">on medicine orders</div>
          <div className="coupon-code-row">
            <span className="coupon-code-label">CODE:</span>
            <span className="coupon-code-value">P24SAVE</span>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText('P24SAVE')}>📋</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDelivery;
