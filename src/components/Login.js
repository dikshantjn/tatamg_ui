import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/config';
import { authService } from '../services/User/Auth/auth.service';
import { storeAuthData } from '../services/User/Auth/auth.utils';
import './Login.css';

const Login = ({ isOpen, onClose, onAuthChange }) => {
    const [activeTab, setActiveTab] = useState('user');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // User login states
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

    // Vendor login states
    const [selectedRole, setSelectedRole] = useState('');
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

    const recaptchaInitialized = useRef(false); // Track if recaptcha is initialized

    // Initialize reCAPTCHA only once per modal open
    useEffect(() => {
        if (isOpen && activeTab === 'user' && !recaptchaInitialized.current) {
            const timer = setTimeout(() => {
                initializeRecaptcha();
                recaptchaInitialized.current = true;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, activeTab]);

    // Cleanup only on modal close or unmount
    useEffect(() => {
        if (!isOpen && recaptchaInitialized.current) {
            cleanupRecaptcha();
            recaptchaInitialized.current = false;
        }
        return () => {
            if (recaptchaInitialized.current) {
                cleanupRecaptcha();
                recaptchaInitialized.current = false;
            }
        };
    }, [isOpen]);

    // Timer for OTP resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const initializeRecaptcha = async () => {
        try {
            // Only initialize if not already initialized
            if (window.recaptchaVerifierInstance) return;
            const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log("reCAPTCHA verified successfully");
                },
                'expired-callback': () => {
                    setError("reCAPTCHA expired. Please try again.");
                    setLoading(false);
                },
                'error-callback': () => {
                    setError("reCAPTCHA error. Please refresh and try again.");
                    setLoading(false);
                }
            });
            await verifier.render();
            setRecaptchaVerifier(verifier);
            window.recaptchaVerifierInstance = verifier;
        } catch (error) {
            console.error("Error initializing reCAPTCHA:", error);
            setError("Failed to initialize verification. Please refresh and try again.");
        }
    };

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
            if (window.recaptchaVerifierInstance) {
                try {
                    window.recaptchaVerifierInstance.clear();
                } catch (clearError) {
                    console.log('reCAPTCHA clear error (expected):', clearError);
                }
                window.recaptchaVerifierInstance = null;
            }
        } catch (error) {
            console.error("Error cleaning up reCAPTCHA:", error);
        }
    };

    const sendOtp = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
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
            const formattedPhone = `+91${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
            setConfirmationResult(confirmation);
            setShowOtp(true);
            setTimer(30);
            setSuccessMessage(`OTP sent successfully to ${formattedPhone}!`);
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

    const handleVendorLogin = async () => {
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
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setSuccessMessage('');
        if (tab === 'user') {
            setShowOtp(false);
            setOtp('');
            setTimer(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (activeTab === 'user') {
            if (showOtp) {
                await verifyOtp();
            } else {
                await sendOtp();
            }
        } else {
            await handleVendorLogin();
        }
    };

    const resetForm = () => {
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setSelectedRole('');
        setOtp('');
        setShowOtp(false);
        setTimer(0);
        setError('');
        setSuccessMessage('');
        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        cleanupRecaptcha();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="login-overlay" onClick={handleClose}>
            <div className="login-panel" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button className="login-close-btn" onClick={handleClose}>
                    ×
                </button>

                {/* Header */}
                <div className="login-header">
                    <h2>Welcome to Vedika.health</h2>
                    <p>Your trusted healthcare partner</p>
                </div>

                {/* Tabs */}
                <div className="login-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
                        onClick={() => handleTabChange('user')}
                    >
                        User Login
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'vendor' ? 'active' : ''}`}
                        onClick={() => handleTabChange('vendor')}
                    >
                        Vendor Login
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {activeTab === 'user' ? (
                        <>
                            {!showOtp ? (
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <div className="phone-input">
                                        <span className="country-code">+91</span>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Enter your phone number"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="login-submit-btn get-otp-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending OTP...' : 'Get OTP'}
                                    </button>
                                </div>
                            ) : (
                                <div className="form-group">
                                    {successMessage && (
                                        <div className="success-message">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM6.8 11.2L3.2 7.6L4.4 6.4L6.8 8.8L11.6 4L12.8 5.2L6.8 11.2Z" fill="#10B981"/>
                                            </svg>
                                            {successMessage}
                                        </div>
                                    )}
                                    <label htmlFor="otp">Enter OTP</label>
                                    <div className="otp-input-container">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="otp-input"
                                                value={otp[index] || ''}
                                                onChange={(e) => {
                                                    const newOtp = otp.split('');
                                                    newOtp[index] = e.target.value.replace(/\D/g, '');
                                                    setOtp(newOtp.join(''));
                                                    
                                                    // Auto-focus next input
                                                    if (e.target.value && index < 5) {
                                                        e.target.nextElementSibling?.focus();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    // Handle backspace
                                                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                        e.target.previousElementSibling?.focus();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                                    setOtp(pastedData);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {timer > 0 && (
                                        <p className="otp-timer">Resend OTP in {timer}s</p>
                                    )}
                                    {timer === 0 && (
                                        <button
                                            type="button"
                                            className="resend-btn"
                                            onClick={resendOtp}
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                    <button 
                                        type="submit" 
                                        className="login-submit-btn verify-otp-btn"
                                        disabled={loading || otp.length !== 6}
                                    >
                                        {loading ? 'Verifying OTP...' : 'Verify OTP'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="role">Select Role</label>
                                <select
                                    id="role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    required
                                    className="select-input"
                                >
                                    <option value="">Select your role</option>
                                    {Object.entries(vendorRoles).map(([role, id]) => (
                                        <option key={id} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="login-submit-btn vendor-login-btn"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </>
                    )}

                    {error && (
                        <div className="error-message">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8.8 12H7.2V10.4H8.8V12ZM8.8 8.8H7.2V4H8.8V8.8Z" fill="#DC2626"/>
                            </svg>
                            {error}
                        </div>
                    )}
                </form>

                {/* Hidden reCAPTCHA container */}
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
};

export default Login; 