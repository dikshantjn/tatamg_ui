import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Person,
  BusinessCenter,
  Phone,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Close,
  ArrowBack
} from "@mui/icons-material";
import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { authService } from '../services/User/Auth/auth.service';
import { storeAuthData } from '../services/User/Auth/auth.utils';
import { vendorAuthService } from '../services/Vendors/VendorAuth/vendor-auth.service';
import { useNavigate } from 'react-router-dom';

// TabPanel component for Material UI tabs
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`signin-tabpanel-${index}`}
      aria-labelledby={`signin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SignIn = ({ isOpen, onClose, onAuthChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
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
  const [showPassword, setShowPassword] = useState(false);

  const vendorRoles = [
    { value: 1, label: "Hospital" },
    { value: 2, label: "Clinic" },
    { value: 3, label: "Medical Store" },
    { value: 4, label: "Ambulance Agency" },
    { value: 5, label: "Blood Bank" },
    { value: 6, label: "Pathology/Diagnostic Center" },
    { value: 7, label: "Delivery Partner" },
    { value: 8, label: "Product Partner" },
  ];

  // Timer effect
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
    if (isOpen) {
      document.body.classList.add('panel-open');
    } else {
      document.body.classList.remove('panel-open');
    }

    return () => {
      document.body.classList.remove('panel-open');
    };
  }, [isOpen]);

  // Initialize reCAPTCHA verifier
  const initializeRecaptcha = async () => {
    try {
      cleanupRecaptcha();

      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      recaptchaContainer.style.display = 'none';
      recaptchaContainer.style.position = 'absolute';
      recaptchaContainer.style.left = '-9999px';
      recaptchaContainer.style.top = '-9999px';
      document.body.appendChild(recaptchaContainer);

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
      
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.remove();
      }
      
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
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      console.log('Firebase verification successful:', result.user);
      console.log('ID Token payload:', JSON.parse(atob(idToken.split('.')[1])));
      
      const isNewUser = result.additionalUserInfo?.isNewUser || false;
      console.log('Is new user in Firebase:', isNewUser);
      
      const backendResponse = await authService.verifyOtpWithBackend(idToken);
      console.log('Backend verification response:', backendResponse);
      
      if (backendResponse && backendResponse.data) {
        const { token, userId, user } = backendResponse.data;
        
        const finalUserId = userId || result.user.uid;
        const finalToken = token || idToken;
        
        let registerResponse = null;
        if (isNewUser) {
          const phoneNumber = result.user.phoneNumber.replace('+91', '');
          console.log('Registering new user with token:', finalToken.substring(0, 20) + '...');
          
          try {
            registerResponse = await authService.registerUser(phoneNumber, finalToken);
            console.log('Register response:', registerResponse);
            
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
        
        console.log('Updating platform information...');
        try {
          const phoneNumber = result.user.phoneNumber;
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
          console.log('Calling onAuthChange with true');
          onAuthChange(true);
          
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setError('Failed to store authentication data. Please try again.');
        }
      } else {
        console.log('Using Firebase data directly for authentication');
        
        let registerResponse = null;
        if (isNewUser) {
          const phoneNumber = result.user.phoneNumber.replace('+91', '');
          console.log('Registering new user with Firebase token:', idToken.substring(0, 20) + '...');
          
          try {
            registerResponse = await authService.registerUser(phoneNumber, idToken);
            console.log('Register response (Firebase fallback):', registerResponse);
            
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
        
        console.log('Updating platform information (Firebase fallback)...');
        try {
          const phoneNumber = result.user.phoneNumber;
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
          console.log('Calling onAuthChange with true (Firebase fallback)');
          onAuthChange(true);
          
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
    
    if (activeTab === 0) {
      if (showOtp) {
        await verifyOtp();
      } else {
        await sendOtp();
      }
    } else {
      if (!selectedRole || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        // Get the selected role object
        const selectedRoleObj = vendorRoles.find(role => role.value === selectedRole);
        if (!selectedRoleObj) {
          setError('Invalid role selected');
          return;
        }

        // Generate a simple device ID (in production, you might want to use a more sophisticated approach)
        const deviceId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Call vendor login API
        const response = await vendorAuthService.vendorLogin(
          email,
          password,
          selectedRoleObj.value, // Pass role number instead of role name
          deviceId
        );

        if (response && response.token) {
          // Store vendor auth data
          const success = vendorAuthService.storeVendorAuthData(response.token, response.vendor);
          
          if (success) {
            setSuccessMessage('Vendor login successful! Redirecting to dashboard...');
            
            // Notify parent component about authentication change
            onAuthChange(true);
            
            // Get dashboard route based on vendor role
            const dashboardRoute = vendorAuthService.getVendorDashboardRoute(response.vendor.vendorRole);
            console.log('🔄 Vendor login - Role:', response.vendor.vendorRole, 'Route:', dashboardRoute);
            
            // Close the signin panel
            setTimeout(() => {
              onClose();
              // Navigate to vendor dashboard
              console.log('Navigating to vendor dashboard:', dashboardRoute);
              navigate(dashboardRoute);
            }, 1500);
          } else {
            setError('Failed to store authentication data. Please try again.');
          }
        } else {
          setError('Invalid response from server. Please try again.');
        }
      } catch (err) {
        console.error('Vendor login error:', err);
        let errorMessage = 'An error occurred. Please try again.';
        
        if (err.response) {
          // Handle specific API errors
          if (err.response.status === 401) {
            errorMessage = 'Invalid email or password. Please check your credentials.';
          } else if (err.response.status === 400) {
            errorMessage = err.response.data.message || 'Invalid request. Please check your input.';
          } else if (err.response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = err.response.data.message || 'Login failed. Please try again.';
          }
        } else if (err.request) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const handleClose = () => {
    cleanupRecaptcha();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 400,
          height: isMobile ? '100%' : '100vh',
          borderRadius: isMobile ? '16px 16px 0 0' : 0,
          boxShadow: theme.shadows[8],
          position: 'relative',
          overflow: 'hidden'
        }
      }}
      sx={{
        '& .MuiDrawer-paper': {
          border: 'none'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
        
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome to Vedika.health
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Your trusted healthcare partner
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="sign in tabs"
          centered
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              minWidth: 120,
              flex: 1
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab
            icon={<Person sx={{ fontSize: 20 }} />}
            label="User"
            id="signin-tab-0"
            aria-controls="signin-tabpanel-0"
          />
          <Tab
            icon={<BusinessCenter sx={{ fontSize: 20 }} />}
            label="Vendor"
            id="signin-tab-1"
            aria-controls="signin-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* User Tab */}
        <TabPanel value={activeTab} index={0}>
          <Stack spacing={3}>
            {!showOtp ? (
              // Mobile Number Input
              <>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                  Sign in with your mobile number
                </Typography>
                
                <TextField
                  fullWidth
                  label="Mobile Number"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={sendOtp}
                  disabled={loading || !mobileNumber || mobileNumber.length !== 10}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </>
            ) : (
              // OTP Input
              <>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                  Enter OTP
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
                  We've sent a 6-digit code to +91 {mobileNumber}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextField
                      key={index}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 1) {
                          const newOtp = otp.split('');
                          newOtp[index] = value;
                          const result = newOtp.join('');
                          setOtp(result);
                          
                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          const newOtp = otp.split('');
                          newOtp[index - 1] = '';
                          setOtp(newOtp.join(''));
                          const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
                          if (prevInput) {
                            prevInput.focus();
                          }
                        }
                      }}
                      inputProps={{
                        'data-index': index,
                        maxLength: 1,
                        style: { textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }
                      }}
                      sx={{
                        width: '50px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: '56px',
                          '& input': {
                            textAlign: 'center',
                            padding: '16px 8px'
                          }
                        }
                      }}
                    />
                  ))}
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowOtp(false)}
                    startIcon={<ArrowBack />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Back
                  </Button>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={verifyOtp}
                    disabled={loading || !otp || otp.length !== 6}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                </Stack>

                {timer > 0 ? (
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    Resend OTP in {timer}s
                  </Typography>
                ) : (
                  <Button
                    variant="text"
                    onClick={resendOtp}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                  >
                    Resend OTP
                  </Button>
                )}
              </>
            )}
          </Stack>
        </TabPanel>

        {/* Vendor Tab */}
        <TabPanel value={activeTab} index={1}>
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
              Vendor Login
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                label="Role"
                onChange={(e) => setSelectedRole(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessCenter color="action" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
                renderValue={(value) => {
                  if (value === '') {
                    return <span style={{ color: '#666' }}>Select Role</span>;
                  }
                  return vendorRoles.find(role => role.value === value)?.label;
                }}
              >
                {vendorRoles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !selectedRole || !email || !password}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              onClick={() => {
                // Handle vendor registration
                console.log('Register as Vendor clicked');
              }}
              sx={{ 
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                  color: 'primary.dark'
                }
              }}
            >
              Register as Vendor
            </Button>
          </Stack>
        </TabPanel>
      </Box>
    </Drawer>
  );
};

export default SignIn;
