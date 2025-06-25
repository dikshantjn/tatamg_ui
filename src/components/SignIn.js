import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { authService } from '../services/auth.service';
import { storeAuthData } from '../services/auth.utils';
import { colors } from '../styles/colors';

const SignIn = ({ isOpen, onClose, onAuthChange }) => {
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
    const navigate = useNavigate();

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
        if (authService.isAuthenticated()) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

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

    // Initialize reCAPTCHA verifier
    const initializeRecaptcha = async () => {
        try {
            // Clean up any existing reCAPTCHA
            cleanupRecaptcha();

            // Create a hidden div for reCAPTCHA
            const recaptchaContainer = document.createElement('div');
            recaptchaContainer.id = 'recaptcha-container';
            recaptchaContainer.style.display = 'none';
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
                }
            });

            // Render the reCAPTCHA
            await verifier.render();
            setRecaptchaVerifier(verifier);
        } catch (error) {
            console.error("Error initializing reCAPTCHA:", error);
            setError("Failed to initialize verification. Please refresh and try again.");
        }
    };

    // Cleanup reCAPTCHA
    const cleanupRecaptcha = () => {
        try {
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                setRecaptchaVerifier(null);
            }
            
            // Remove reCAPTCHA container
            const container = document.getElementById('recaptcha-container');
            if (container) {
                container.remove();
            }
            
            // Remove any existing reCAPTCHA elements
            const recaptchaElements = document.querySelectorAll('.grecaptcha-badge');
            recaptchaElements.forEach(element => element.remove());
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
            // Verify OTP with Firebase
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();
            
            console.log('Firebase verification successful:', result.user);
            console.log('ID Token payload:', JSON.parse(atob(idToken.split('.')[1])));
            
            // Verify with backend and get JWT token
            const backendResponse = await authService.verifyOtpWithBackend(idToken);
            
            console.log('Backend response:', backendResponse);
            
            // Check if backend response has the expected structure
            if (backendResponse && backendResponse.data) {
                const { token, userId, user } = backendResponse.data;
                
                // Store auth data - use userId from backend or fallback to Firebase uid
                const finalUserId = userId || result.user.uid;
                const finalToken = token || idToken; // Use backend token if available, otherwise use Firebase token
                
                const success = storeAuthData(finalToken, finalUserId);
                
                if (success) {
                    console.log('Auth data stored successfully:', { userId: finalUserId, token: finalToken });
                    // Close modal and redirect
                    onClose();
                    onAuthChange();
                    navigate("/", { replace: true });
                } else {
                    setError('Failed to store authentication data. Please try again.');
                }
            } else {
                // If backend doesn't return expected structure or is not available, use Firebase data directly
                console.log('Using Firebase data directly for authentication');
                const success = storeAuthData(idToken, result.user.uid);
                
                if (success) {
                    console.log('Firebase auth data stored successfully:', { userId: result.user.uid, token: idToken });
                    onClose();
                    onAuthChange();
                    navigate("/", { replace: true });
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

    if (!isOpen) return null;

    return (
        <div className="side-panel-overlay" onClick={onClose}>
            <div className="side-panel" onClick={e => e.stopPropagation()}>
                <button className="close-panel" onClick={onClose}>×</button>
                
                {/* Header Section */}
                <div className="panel-header">
                    <div className="geometric-shape shape-1"></div>
                    <div className="geometric-shape shape-2"></div>
                    <h1>Welcome to Vedika.health</h1>
                    <p>Your trusted healthcare partner</p>
                </div>
                
                {/* Body Section */}
                <div className={`panel-body ${activeTab === 'vendor' ? 'vendor-tab' : ''}`}>
                    <div className="sign-in-container in-side-panel">
                    <div className="login-tabs">
                        <button 
                            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
                            onClick={() => handleTabChange('user')}
                        >
                            User Login
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'vendor' ? 'active' : ''}`}
                            onClick={() => handleTabChange('vendor')}
                        >
                            Vendor Login
                        </button>
                    </div>
                    
                        <form onSubmit={handleSubmit}>
                        {activeTab === 'user' ? (
                                <>
                                    {!showOtp && (
                                    <div className="input-group">
                                            <label htmlFor="phone">Phone Number</label>
                                        <div className="input-with-prefix">
                                            <span className="prefix">+91</span>
                                            <input
                                                type="tel"
                                                    id="phone"
                                                    pattern="[0-9]{10}"
                                                    maxLength="10"
                                                    required
                                                placeholder="Enter your mobile number"
                                                value={mobileNumber}
                                                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                                    className="text-input"
                                            />
                                        </div>
                                    </div>
                                    )}

                                    {!showOtp && (
                                    <button 
                                        type="submit" 
                                        className="login-button"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="loading-spinner" />
                                            ) : (
                                                'Get OTP'
                                        )}
                                    </button>
                                    )}

                                    {showOtp && (
                                        <div className="input-group">
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
                                                    className="forgot-password-button"
                                                    onClick={resendOtp}
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {showOtp && (
                                    <button 
                                        type="submit" 
                                        className="login-button"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="loading-spinner" />
                                            ) : (
                                                'Verify OTP'
                                        )}
                                    </button>
                                    )}
                                </>
                            ) : (
                                <>
                                <div className="input-group">
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

                                <div className="input-group">
                                        <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                            id="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                            className="text-input"
                                    />
                                </div>

                                <div className="input-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="text-input"
                                        />
                                        <button
                                            type="button"
                                            className="forgot-password-button"
                                            onClick={handleForgotPassword}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="login-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="loading-spinner" />
                                        ) : (
                                            'Login as Vendor'
                                        )}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
