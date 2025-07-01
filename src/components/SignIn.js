import React, { useState, useEffect } from "react";
import "./SignIn.css";
import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { authService } from '../services/User/Auth/auth.service';
import { storeAuthData } from '../services/User/Auth/auth.utils';
import { colors } from '../styles/colors';

const SignIn = ({ isOpen, onClose, onAuthChange }) => {
    console.log('🎭 SignIn component called with props:', { isOpen, onClose: !!onClose, onAuthChange: !!onAuthChange });
    const [activeTab, setActiveTab] = useState('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [timer, setTimer] = useState(0);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const vendorRoles = {
        "Hospital": 1,
        "Clinic": 2,
        "Medical Store": 3,
        "Ambulance Agency": 4,
        "Blood Bank": 5,
        "Pathology/Diagnostic Center": 6,
        "Delivery Partner": 7,
        "Product Partner": 8,
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Initialize reCAPTCHA when component mounts
    useEffect(() => {
        if (isOpen && !recaptchaVerifier) {
            initializeRecaptcha();
        }
        
        return () => {
            if (recaptchaVerifier) {
                cleanupRecaptcha();
            }
        };
    }, [isOpen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupRecaptcha();
        };
    }, []);

    // Handle body scroll
    useEffect(() => {
        console.log('🎭 Body scroll effect - isOpen:', isOpen);
        if (isOpen) {
            document.body.classList.add('panel-open');
            console.log('✅ Added panel-open class to body');
        } else {
            document.body.classList.remove('panel-open');
            console.log('✅ Removed panel-open class from body');
        }

        return () => {
            document.body.classList.remove('panel-open');
            console.log('✅ Cleanup: Removed panel-open class from body');
        };
    }, [isOpen]);

    // Initialize reCAPTCHA verifier
    const initializeRecaptcha = async () => {
        try {
            // Clean up any existing reCAPTCHA
            cleanupRecaptcha();

            // Create a hidden div for reCAPTCHA
            const recaptchaContainer = document.createElement('div');
            recaptchaContainer.id = 'recaptcha-container';
            recaptchaContainer.style.display = 'none';
            recaptchaContainer.style.position = 'absolute';
            recaptchaContainer.style.left = '-9999px';
            recaptchaContainer.style.top = '-9999px';
            document.body.appendChild(recaptchaContainer);

            // Create new reCAPTCHA verifier
            const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log("reCAPTCHA verified successfully");
                },
                'expired-callback': () => {
                    setError("reCAPTCHA expired. Please try again.");
                    setLoading(false);
                    cleanupRecaptcha();
                },
                'error-callback': () => {
                    setError("reCAPTCHA error. Please refresh and try again.");
                    setLoading(false);
                    cleanupRecaptcha();
                }
            });

            // Render the reCAPTCHA
            await verifier.render();
            setRecaptchaVerifier(verifier);
        } catch (error) {
            console.error("Error initializing reCAPTCHA:", error);
            setError("Failed to initialize verification. Please refresh and try again.");
            cleanupRecaptcha();
        }
    };

    // Cleanup reCAPTCHA
    const cleanupRecaptcha = () => {
        try {
            if (recaptchaVerifier) {
                try {
                    recaptchaVerifier.clear();
                } catch (clearError) {
                    console.log('reCAPTCHA clear error (expected):', clearError);
                }
                setRecaptchaVerifier(null);
            }
            
            // Remove reCAPTCHA container
            const container = document.getElementById('recaptcha-container');
            if (container) {
                container.remove();
            }
            
            // Remove any existing reCAPTCHA elements more safely
            const recaptchaElements = document.querySelectorAll('.grecaptcha-badge, .rc-imageselect-target, .rc-imageselect-tile, .rc-imageselect-challenge');
            recaptchaElements.forEach(element => {
                try {
                    if (element && element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                } catch (removeError) {
                    console.log('Error removing reCAPTCHA element:', removeError);
                }
            });
            
            // Clear any reCAPTCHA iframes
            const recaptchaIframes = document.querySelectorAll('iframe[src*="recaptcha"]');
            recaptchaIframes.forEach(iframe => {
                try {
                    if (iframe && iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                    }
                } catch (iframeError) {
                    console.log('Error removing reCAPTCHA iframe:', iframeError);
                }
            });
            
            // Clear any reCAPTCHA scripts
            const recaptchaScripts = document.querySelectorAll('script[src*="recaptcha"]');
            recaptchaScripts.forEach(script => {
                try {
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                } catch (scriptError) {
                    console.log('Error removing reCAPTCHA script:', scriptError);
                }
            });
            
        } catch (error) {
            console.error("Error cleaning up reCAPTCHA:", error);
        }
    };

    // Send OTP
    const sendOtp = async () => {
        if (!mobileNumber || mobileNumber.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        if (!recaptchaVerifier) {
            setError('Verification system not ready. Please refresh and try again.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const phoneNumber = `+91${mobileNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            setConfirmationResult(confirmation);
            setShowOtp(true);
            setTimer(30);
            setSuccessMessage(`OTP sent successfully to ${phoneNumber}!`);
        } catch (error) {
            console.error("Error sending OTP:", error);
            let errorMessage = 'Failed to send OTP. Please try again.';
            
            if (error.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number. Please check and try again.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.';
            } else if (error.code === 'auth/quota-exceeded') {
                errorMessage = 'SMS quota exceeded. Please try again later.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message && error.message.includes('recaptcha')) {
                errorMessage = 'Verification failed. Please refresh and try again.';
                // Reinitialize reCAPTCHA on error
                setTimeout(() => {
                    cleanupRecaptcha();
                    initializeRecaptcha();
                }, 1000);
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const verifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        if (!confirmationResult) {
            setError('OTP session expired. Please request a new OTP.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Step 1: Verify OTP with Firebase
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();
            
            console.log('Firebase verification successful:', result.user);
            console.log('ID Token payload:', JSON.parse(atob(idToken.split('.')[1])));
            
            // Check if user is new or existing in Firebase
            const isNewUser = result.additionalUserInfo?.isNewUser || false;
            console.log('Is new user in Firebase:', isNewUser);
            
            // Step 2: Verify with backend and get JWT token
            const backendResponse = await authService.verifyOtpWithBackend(idToken);
            console.log('Backend verification response:', backendResponse);
            
            // Step 3: Check if backend response has the expected structure
            if (backendResponse && backendResponse.data) {
                const { token, userId, user } = backendResponse.data;
                
                // Store auth data - use userId from backend or fallback to Firebase uid
                const finalUserId = userId || result.user.uid;
                const finalToken = token || idToken; // Use backend token if available, otherwise use Firebase token
                
                // Step 4: Only register user if they're new in Firebase
                let registerResponse = null;
                if (isNewUser) {
                    // Extract 10-digit phone number (remove +91 prefix)
                    const phoneNumber = result.user.phoneNumber.replace('+91', '');
                    console.log('Registering new user with token:', finalToken.substring(0, 20) + '...');
                    
                    try {
                        registerResponse = await authService.registerUser(phoneNumber, finalToken);
                        console.log('Register response:', registerResponse);
                        
                        // Handle registration response
                        if (registerResponse) {
                            if (registerResponse.isNewUser) {
                                console.log('✅ New user registered successfully');
                                setSuccessMessage('Account created successfully! Welcome to Vedika.health');
                            } else {
                                console.log('✅ Existing user logged in successfully');
                                setSuccessMessage('Welcome back! Login successful');
                            }
                        }
                    } catch (registerError) {
                        console.warn('Registration failed, but continuing with authentication:', registerError);
                        setSuccessMessage('Login successful! Welcome back');
                    }
                } else {
                    console.log('✅ Existing user - skipping registration');
                    setSuccessMessage('Welcome back! Login successful');
                }
                
                // Update platform information (optional - won't break auth flow if it fails)
                console.log('Updating platform information...');
                try {
                    // Use phone number with +91 prefix to match database format
                    const phoneNumber = result.user.phoneNumber; // Keep the +91 prefix
                    const platformResponse = await authService.updatePlatform(phoneNumber, 'web', finalToken);
                    if (platformResponse && platformResponse.success) {
                        console.log('✅ Platform updated successfully');
                    } else if (platformResponse && platformResponse.reason === 'user_not_found') {
                        console.log('⚠️ User not found for platform update, but continuing...');
                        console.log('Platform update will be retried on next login');
                    } else {
                        console.log('⚠️ Platform update failed, but continuing...');
                    }
                } catch (platformError) {
                    console.warn('Platform update failed, but continuing with authentication:', platformError);
                    console.log('Platform update will be retried on next login');
                }
                
                const success = storeAuthData(finalToken, finalUserId);
                
                if (success) {
                    console.log('Auth data stored successfully:', { userId: finalUserId, token: finalToken });
                    // Update auth state first
                    console.log('Calling onAuthChange with true');
                    onAuthChange(true); // Pass true to indicate user is authenticated
                    
                    // Show success message briefly before closing
                    setTimeout(() => {
                        onClose();
                    }, 1500);
                } else {
                    setError('Failed to store authentication data. Please try again.');
                }
            } else {
                // If backend doesn't return expected structure or is not available, use Firebase data directly
                console.log('Using Firebase data directly for authentication');
                
                // Only register user if they're new in Firebase
                let registerResponse = null;
                if (isNewUser) {
                    // Still try to register user with Firebase token
                    // Extract 10-digit phone number (remove +91 prefix)
                    const phoneNumber = result.user.phoneNumber.replace('+91', '');
                    console.log('Registering new user with Firebase token:', idToken.substring(0, 20) + '...');
                    
                    try {
                        registerResponse = await authService.registerUser(phoneNumber, idToken);
                        console.log('Register response (Firebase fallback):', registerResponse);
                        
                        // Handle registration response
                        if (registerResponse) {
                            if (registerResponse.isNewUser) {
                                console.log('✅ New user registered successfully (Firebase fallback)');
                                setSuccessMessage('Account created successfully! Welcome to Vedika.health');
                            } else {
                                console.log('✅ Existing user logged in successfully (Firebase fallback)');
                                setSuccessMessage('Welcome back! Login successful');
                            }
                        }
                    } catch (registerError) {
                        console.warn('Registration failed (Firebase fallback), but continuing with authentication:', registerError);
                        setSuccessMessage('Login successful! Welcome back');
                    }
                } else {
                    console.log('✅ Existing user - skipping registration (Firebase fallback)');
                    setSuccessMessage('Welcome back! Login successful');
                }
                
                // Update platform information (optional - won't break auth flow if it fails)
                console.log('Updating platform information (Firebase fallback)...');
                try {
                    // Use phone number with +91 prefix to match database format
                    const phoneNumber = result.user.phoneNumber; // Keep the +91 prefix
                    const platformResponse = await authService.updatePlatform(phoneNumber, 'web', idToken);
                    if (platformResponse && platformResponse.success) {
                        console.log('✅ Platform updated successfully (Firebase fallback)');
                    } else if (platformResponse && platformResponse.reason === 'user_not_found') {
                        console.log('⚠️ User not found for platform update (Firebase fallback), but continuing...');
                        console.log('Platform update will be retried on next login');
                    } else {
                        console.log('⚠️ Platform update failed (Firebase fallback), but continuing...');
                    }
                } catch (platformError) {
                    console.warn('Platform update failed (Firebase fallback), but continuing with authentication:', platformError);
                    console.log('Platform update will be retried on next login');
                }
                
                const success = storeAuthData(idToken, result.user.uid);
                
                if (success) {
                    console.log('Firebase auth data stored successfully:', { userId: result.user.uid, token: idToken });
                    // Update auth state first
                    console.log('Calling onAuthChange with true (Firebase fallback)');
                    onAuthChange(true); // Pass true to indicate user is authenticated
                    
                    // Show success message briefly before closing
                    setTimeout(() => {
                        onClose();
                    }, 1500);
                } else {
                    setError('Failed to store authentication data. Please try again.');
                }
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            let errorMessage = 'Failed to verify OTP. Please try again.';
            
            if (error.code === 'auth/invalid-verification-code') {
                errorMessage = 'Invalid OTP. Please check and try again.';
            } else if (error.code === 'auth/code-expired') {
                errorMessage = 'OTP has expired. Please request a new one.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const resendOtp = async () => {
        if (timer > 0) return;
        
        setLoading(true);
        setError('');
        
        try {
            await sendOtp();
        } catch (error) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (activeTab === 'user') {
            if (showOtp) {
                await verifyOtp();
            } else {
                await sendOtp();
            }
        } else {
            // Vendor login logic
            if (!selectedRole || !email || !password) {
                setError('Please fill in all fields');
                return;
            }
            
            setLoading(true);
            setError('');
            
            try {
                // Implement vendor login logic here
                await new Promise(resolve => setTimeout(resolve, 1500));
                setError('Vendor login functionality not implemented yet.');
            } catch (err) {
                setError(err.message || 'An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setSuccessMessage('');
        setEmail('');
        setPassword('');
        setSelectedRole('');
        setMobileNumber('');
        setShowOtp(false);
        setOtp('');
        setConfirmationResult(null);
        setTimer(0);
    };

    const handleForgotPassword = () => {
        // Implement forgot password logic
        console.log('Forgot password clicked');
    };

    // Handle Panel Close
    const handlePanelClose = () => {
        console.log('🎭 handlePanelClose called');
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
        onClose();
        
        // Clean up reCAPTCHA when panel is closed
            cleanupRecaptcha();
        }, 300); // Match the animation duration
    };

    console.log('🎭 SignIn component render check - isOpen:', isOpen);
    if (!isOpen) {
        console.log('❌ SignIn component not rendering - isOpen is false');
        return null;
    }
    console.log('✅ SignIn component rendering - isOpen is true - ABOUT TO RENDER JSX');
    
    // Debug: Check if element exists in DOM after render
    setTimeout(() => {
        const overlay = document.querySelector('.side-panel-overlay');
        const panel = document.querySelector('.side-panel');
        console.log('🔍 DOM Debug:', {
            overlay: !!overlay,
            panel: !!panel,
            overlayStyles: overlay ? {
                position: window.getComputedStyle(overlay).position,
                display: window.getComputedStyle(overlay).display,
                zIndex: window.getComputedStyle(overlay).zIndex,
                visibility: window.getComputedStyle(overlay).visibility,
                opacity: window.getComputedStyle(overlay).opacity,
                width: window.getComputedStyle(overlay).width,
                height: window.getComputedStyle(overlay).height
            } : null,
            panelStyles: panel ? {
                position: window.getComputedStyle(panel).position,
                display: window.getComputedStyle(panel).display,
                zIndex: window.getComputedStyle(panel).zIndex,
                visibility: window.getComputedStyle(panel).visibility,
                opacity: window.getComputedStyle(panel).opacity,
                width: window.getComputedStyle(panel).width,
                height: window.getComputedStyle(panel).height
            } : null
        });
        
        // Check if the element is actually visible
        if (overlay) {
            const rect = overlay.getBoundingClientRect();
            console.log('🔍 Overlay bounding rect:', rect);
            console.log('🔍 Overlay is visible:', rect.width > 0 && rect.height > 0);
        }
        
        if (panel) {
            const rect = panel.getBoundingClientRect();
            console.log('🔍 Panel bounding rect:', rect);
            console.log('🔍 Panel is visible:', rect.width > 0 && rect.height > 0);
        }
    }, 100);

    console.log('🎭 About to return JSX for SignIn component');
    return (
        <div 
            className="side-panel-overlay" 
            onClick={handlePanelClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 9999
            }}
        >
            <div 
                className="side-panel" 
                onClick={e => e.stopPropagation()}
                style={{
                    width: '400px',
                    height: '100vh',
                    backgroundColor: 'white',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 10000,
                    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)'
                }}
            >
                <button 
                    className="close-panel" 
                    onClick={handlePanelClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: '#f1f5f9',
                        color: '#64748b',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    ×
                </button>
                
                {/* Test Header */}
                <div style={{ 
                    padding: '60px 20px 20px', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Welcome to Vedika.health</h1>
                    <p style={{ margin: 0, opacity: 0.9 }}>Your trusted healthcare partner</p>
                </div>
                
                {/* Test Body */}
                <div style={{ 
                    flex: 1, 
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#333', marginBottom: '20px' }}>Sign In Panel Test</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>If you can see this, the side panel is working!</p>
                        
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button 
                            onClick={() => handleTabChange('user')}
                                style={{
                                    padding: '10px 20px',
                                    background: activeTab === 'user' ? '#38A3A5' : '#f1f5f9',
                                    color: activeTab === 'user' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                        >
                            User Login
                        </button>
                        <button 
                            onClick={() => handleTabChange('vendor')}
                                style={{
                                    padding: '10px 20px',
                                    background: activeTab === 'vendor' ? '#38A3A5' : '#f1f5f9',
                                    color: activeTab === 'vendor' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                        >
                            Vendor Login
                        </button>
                    </div>
                    
                        <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Current Tab: {activeTab}</p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                This is a test to verify the side panel is working correctly.
                            </p>
                                </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
