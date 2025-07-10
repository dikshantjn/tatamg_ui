import React, { useState, useEffect, useCallback } from 'react';
import './HealthRecordAccess.css';
import { toast } from 'react-toastify';
import { checkHealthRecordPassword, setHealthRecordPassword, verifyHealthRecordPassword } from '../../../services/User/HealthRecords/health-records.service';

const HealthRecordAccess = ({ onAccessGranted }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordSet, setIsPasswordSet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get the user ID from your auth context/store
    const userId = 'GOrt7AWP82dMYs8tVejjLyvdPyy2'; // Replace with actual user ID from your auth system

    const checkPasswordStatus = useCallback(async () => {
        try {
            const response = await checkHealthRecordPassword(userId);
            setIsPasswordSet(response.healthRecordPasswordSet);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to check password status:', error);
            toast.error('Failed to check password status');
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        checkPasswordStatus();
    }, [checkPasswordStatus]);

    const handleSetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            setIsLoading(true);
            await setHealthRecordPassword(userId, password);
            toast.success('Password set successfully');
            
            // Check password status again to confirm it's set
            const response = await checkHealthRecordPassword(userId);
            setIsPasswordSet(response.healthRecordPasswordSet);
            
            // Clear the form
            setPassword('');
            setConfirmPassword('');
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to set password:', error);
            toast.error('Failed to set password. Please try again.');
            setIsLoading(false);
        }
    };

    const handleVerifyPassword = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await verifyHealthRecordPassword(userId, password);
            
            if (response.success) {
                toast.success(response.message || 'Successfully logged in to Health Records');
                onAccessGranted();
            } else {
                toast.error('Incorrect password. Please try again.');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to verify password:', error);
            toast.error('Failed to verify password. Please try again.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="health-record-access">
                <div className="access-container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="health-record-access">
            <div className="access-container">
                <div className="access-content">
                    <div className="access-header">
                        <div className="header-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1>{isPasswordSet ? 'Access Health Records' : 'Set Password for Health Records'}</h1>
                        <div className="security-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Secure Access
                        </div>
                    </div>
                    
                    <div className="access-description">
                        <p className="access-message">
                            {isPasswordSet 
                                ? 'Please enter your password to access your health records.' 
                                : 'Set a password to protect your health records. This password will be required for future access.'}
                        </p>
                        <div className="security-info">
                            <div className="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>End-to-end encrypted</span>
                            </div>
                            <div className="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span>HIPAA compliant</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={isPasswordSet ? handleVerifyPassword : handleSetPassword} className="access-form">
                        <div className="password-input-container">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isPasswordSet ? "Enter your password" : "Create password"}
                                    className="password-input"
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {!isPasswordSet && (
                            <div className="password-input-container">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="password-input"
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="access-button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                {isPasswordSet ? 'Access Records' : 'Set Password'}
                            </button>

                            {isPasswordSet && (
                                <button type="button" className="forgot-password-button">
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HealthRecordAccess; 