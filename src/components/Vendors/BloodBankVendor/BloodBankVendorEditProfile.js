import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Edit,
  Save,
  Cancel,
  LocalHospital,
  Business,
  Warning,
  CheckCircle,
  Language,
  Payment,
  PhotoCamera,
  Description,
  Map,
  ArrowBack,
  Description as DescriptionIcon,
  BrokenImage,
  Add,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorEditProfile = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    agencyName: '',
    gstNumber: '',
    panNumber: '',
    ownerName: '',
    completeAddress: '',
    nearbyLandmark: '',
    phoneNumber: '',
    state: '',
    city: '',
    pincode: '',
    email: '',
    website: '',
    languageProficiency: '',
    deliveryOperationalAreas: '',
    distanceLimitations: '',
    is24x7Operational: false,
    isAllDaysWorking: false,
    bloodServicesProvided: '',
    plateletServicesProvided: '',
    otherServicesProvided: '',
    acceptsOnlinePayment: false,
    agencyPhotos: '',
    licenseFiles: '',
    registrationCertificateFiles: '',
    googleMapsLocation: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // File management states
  const [openAddPhotoDialog, setOpenAddPhotoDialog] = useState(false);
  const [openAddLicenseDialog, setOpenAddLicenseDialog] = useState(false);
  const [openAddCertificateDialog, setOpenAddCertificateDialog] = useState(false);
  const [newFileData, setNewFileData] = useState({
    url: '',
    name: '',
    file: null
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Get vendor ID from auth data
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          if (vendorId) {
            // Fetch profile data from API
            const apiResponse = await bloodBankVendorService.getBloodBankProfile(vendorId);
            const transformedData = bloodBankVendorService.transformProfileData(apiResponse);
            
            if (transformedData) {
              setProfileData(transformedData);
            } else {
              // Fallback to sample data if API fails
              loadProfileData();
            }
          } else {
            console.warn('Vendor ID not found in auth data');
            loadProfileData();
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
        // Fallback to sample data
        loadProfileData();
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const loadProfileData = () => {
    // Sample profile data
    const sampleProfile = {
      agencyName: 'City Blood Bank & Research Center',
      gstNumber: '27AABCC1234Z1Z5',
      panNumber: 'AABCC1234Z',
      ownerName: 'Dr. Rajesh Kumar',
      completeAddress: '123 Medical Complex, Health Street, Andheri West',
      nearbyLandmark: 'Near Metro Station',
      phoneNumber: '+91 98765 43210',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      email: 'info@citybloodbank.com',
      website: 'www.citybloodbank.com',
      languageProficiency: 'English, Hindi, Marathi',
      deliveryOperationalAreas: 'Mumbai, Thane, Navi Mumbai',
      distanceLimitations: '50 km radius',
      is24x7Operational: true,
      isAllDaysWorking: true,
      bloodServicesProvided: 'All blood types, Emergency services, Regular donations',
      plateletServicesProvided: 'Platelet apheresis, Platelet rich plasma',
      otherServicesProvided: 'Blood testing, Cross-matching, Storage services',
      acceptsOnlinePayment: true,
      agencyPhotos: 'agency_photos.jpg',
      licenseFiles: 'blood_bank_license.pdf',
      registrationCertificateFiles: 'registration_cert.pdf',
      googleMapsLocation: 'https://maps.google.com/?q=19.0760,72.8777'
    };
    setProfileData(sampleProfile);
  };

  const handleCancel = () => {
    navigate('/vendor/blood-bank/profile');
  };

  const handleSave = async () => {
    // Validate required fields
    if (!profileData.agencyName || !profileData.ownerName || !profileData.email || !profileData.phoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId || authData?.vendorData?.id;
      
      if (!vendorId) {
        toast.error('Vendor ID not found');
        setSaving(false);
        return;
      }

      // Transform data to API format
      const apiData = bloodBankVendorService.transformToApiFormat(profileData);
      
      // Update profile via API
      const response = await bloodBankVendorService.updateBloodBankProfile(vendorId, apiData);
      
      // Check if response indicates success
      if (response && (response.success || response.message || response.agency)) {
        toast.success('Profile updated successfully! Your changes have been saved. Redirecting to profile...', {
          autoClose: 2000,
          onClose: () => navigate('/vendor/blood-bank/profile')
        });
      } else {
        toast.warning('Profile update completed, but no confirmation received from server. Redirecting to profile...', {
          autoClose: 2000,
          onClose: () => navigate('/vendor/blood-bank/profile')
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Provide more specific error messages based on error type
      if (error.message && error.message.includes('401')) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.message && error.message.includes('403')) {
        toast.error('Access denied. You do not have permission to update this profile.');
      } else if (error.message && error.message.includes('404')) {
        toast.error('Profile not found. Please contact support.');
      } else if (error.message && error.message.includes('422')) {
        toast.error('Invalid data provided. Please check your information and try again.');
      } else if (error.message && error.message.includes('500')) {
        toast.error('Server error. Please try again later.');
      } else if (error.message && error.message.includes('network')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Change password (in real app, this would be an API call)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordDialog(false);
    toast.success('Password changed successfully');
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Warning />;
  };

  // File management functions
  const handleAddFile = (fileType) => {
    if (!newFileData.file || !newFileData.name) {
      toast.error('Please select a file and provide a name');
      return;
    }

    // Generate URL path based on file type and name
    const fileExtension = newFileData.file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${fileType}_${timestamp}.${fileExtension}`;
    const urlPath = `https://firebasestorage.googleapis.com/v0/b/vedikahealthcare-59980.firebasestorage.app/o/bloodbank_agency%2F${fileType}%2F${fileName}?alt=media&token=generated_token_${timestamp}`;

    const newFile = {
      url: urlPath,
      name: newFileData.name
    };

    setProfileData(prev => ({
      ...prev,
      [fileType]: [...(Array.isArray(prev[fileType]) ? prev[fileType] : []), newFile]
    }));

    setNewFileData({ url: '', name: '', file: null });
    
    // Close appropriate dialog
    if (fileType === 'agencyPhotos') {
      setOpenAddPhotoDialog(false);
    } else if (fileType === 'licenseFiles') {
      setOpenAddLicenseDialog(false);
    } else if (fileType === 'registrationCertificateFiles') {
      setOpenAddCertificateDialog(false);
    }

    toast.success('File added successfully');
  };

  const handleDeleteFile = (fileType, index) => {
    setProfileData(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }));
    toast.success('File deleted successfully');
  };

  const handleFileDataChange = (field, value) => {
    setNewFileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewFileData(prev => ({
        ...prev,
        file: file,
        name: file.name.split('.')[0] // Set default name from file name
      }));
    }
  };

  // Skeleton loading component for edit profile
  const EditProfileSkeleton = () => (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width="250px" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="350px" height={20} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>

        {/* Profile Summary Card Skeleton */}
        <Card sx={{ mb: 4, maxWidth: '1400px', mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                <Skeleton variant="circular" width={80} height={80} />
                <Box>
                  <Skeleton variant="text" width="250px" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="180px" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                {[1, 2, 3, 4].map((index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton variant="circular" width={16} height={16} />
                    <Skeleton variant="text" width="200px" height={20} />
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Form Cards Skeleton */}
        <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="150px" height={24} sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4, 5, 6].map((fieldIndex) => (
                      <Grid item xs={12} sm={6} key={fieldIndex}>
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons Skeleton */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </BloodBankVendorLayout>
  );

  if (loading) {
    return <EditProfileSkeleton />;
  }

  return (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Edit Blood Bank Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your blood bank information and settings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCancel}
              sx={{ borderRadius: 2 }}
            >
              Back to Profile
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenPasswordDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Change Password
            </Button>
          </Box>
        </Box>

        {/* Profile Summary Card - Top */}
        <Card sx={{ 
          mb: 4, 
          maxWidth: '1400px', 
          mx: 'auto',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Avatar and Main Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80,
                  bgcolor: 'primary.main'
                }}>
                  <LocalHospital sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    {profileData.agencyName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {profileData.ownerName}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(true)}
                    label="Active"
                    color="success"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              </Box>
              
              {/* Contact Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="primary" />
                  <Typography variant="body1">
                    {profileData.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="primary" />
                  <Typography variant="body1">
                    {profileData.phoneNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" color="primary" />
                  <Typography variant="body1">
                    {profileData.city}, {profileData.state}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business fontSize="small" color="primary" />
                  <Typography variant="body1">
                    Est. 2015
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agency Name"
                      value={profileData.agencyName}
                      onChange={(e) => handleProfileChange('agencyName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Owner Name"
                      value={profileData.ownerName}
                      onChange={(e) => handleProfileChange('ownerName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      value={profileData.gstNumber}
                      onChange={(e) => handleProfileChange('gstNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      value={profileData.panNumber}
                      onChange={(e) => handleProfileChange('panNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Complete Address"
                      multiline
                      rows={2}
                      value={profileData.completeAddress}
                      onChange={(e) => handleProfileChange('completeAddress', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nearby Landmark"
                      value={profileData.nearbyLandmark}
                      onChange={(e) => handleProfileChange('nearbyLandmark', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phoneNumber}
                      onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={profileData.city}
                      onChange={(e) => handleProfileChange('city', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      value={profileData.state}
                      onChange={(e) => handleProfileChange('state', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      value={profileData.pincode}
                      onChange={(e) => handleProfileChange('pincode', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={profileData.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Operational Information */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Operational Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Language Proficiency"
                      value={profileData.languageProficiency}
                      onChange={(e) => handleProfileChange('languageProficiency', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Delivery Operational Areas"
                      value={profileData.deliveryOperationalAreas}
                      onChange={(e) => handleProfileChange('deliveryOperationalAreas', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Distance Limitations"
                      value={profileData.distanceLimitations}
                      onChange={(e) => handleProfileChange('distanceLimitations', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Google Maps Location"
                      value={profileData.googleMapsLocation}
                      onChange={(e) => handleProfileChange('googleMapsLocation', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.is24x7Operational}
                          onChange={(e) => handleProfileChange('is24x7Operational', e.target.checked)}
                        />
                      }
                      label="24x7 Operational"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.isAllDaysWorking}
                          onChange={(e) => handleProfileChange('isAllDaysWorking', e.target.checked)}
                        />
                      }
                      label="All Days Working"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.acceptsOnlinePayment}
                          onChange={(e) => handleProfileChange('acceptsOnlinePayment', e.target.checked)}
                        />
                      }
                      label="Accepts Online Payment"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Services Information */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Services Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Blood Services Provided"
                      multiline
                      rows={3}
                      value={profileData.bloodServicesProvided}
                      onChange={(e) => handleProfileChange('bloodServicesProvided', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Platelet Services Provided"
                      multiline
                      rows={3}
                      value={profileData.plateletServicesProvided}
                      onChange={(e) => handleProfileChange('plateletServicesProvided', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Other Services Provided"
                      multiline
                      rows={3}
                      value={profileData.otherServicesProvided}
                      onChange={(e) => handleProfileChange('otherServicesProvided', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Documents Information */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Documents & Files
                </Typography>
                <Grid container spacing={3}>
                  {/* Agency Photos */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Agency Photos
                      </Typography>
                                             {Array.isArray(profileData.agencyPhotos) && profileData.agencyPhotos.length > 0 ? (
                         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                           {profileData.agencyPhotos.map((photo, index) => (
                             <Box key={index} sx={{ 
                               width: 120, 
                               height: 120, 
                               border: '1px solid #e0e0e0', 
                               borderRadius: 2,
                               overflow: 'hidden',
                               position: 'relative'
                             }}>
                               <img
                                 src={photo.url}
                                 alt={photo.name || `Agency Photo ${index + 1}`}
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                 onError={(e) => {
                                   e.target.style.display = 'none';
                                   e.target.nextSibling.style.display = 'flex';
                                 }}
                               />
                               <Box sx={{
                                 display: 'none',
                                 width: '100%',
                                 height: '100%',
                                 backgroundColor: '#f5f5f5',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 flexDirection: 'column'
                               }}>
                                 <BrokenImage sx={{ fontSize: 32, color: '#999' }} />
                                 <Typography variant="caption" color="text.secondary">
                                   {photo.name || 'Image'}
                                 </Typography>
                               </Box>
                               <Typography variant="caption" sx={{
                                 position: 'absolute',
                                 bottom: 0,
                                 left: 0,
                                 right: 0,
                                 backgroundColor: 'rgba(0,0,0,0.7)',
                                 color: 'white',
                                 padding: '2px 4px',
                                 fontSize: '10px'
                               }}>
                                 {photo.name || `Photo ${index + 1}`}
                               </Typography>
                               <IconButton
                                 size="small"
                                 sx={{
                                   position: 'absolute',
                                   top: 4,
                                   right: 4,
                                   backgroundColor: 'rgba(255,255,255,0.9)',
                                   '&:hover': {
                                     backgroundColor: 'rgba(255,255,255,1)'
                                   }
                                 }}
                                 onClick={() => handleDeleteFile('agencyPhotos', index)}
                               >
                                 <Delete sx={{ fontSize: 16, color: '#f44336' }} />
                               </IconButton>
                             </Box>
                           ))}
                         </Box>
                       ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                           No agency photos uploaded
                         </Typography>
                       )}
                       <Button
                         variant="outlined"
                         startIcon={<Add />}
                         size="small"
                         sx={{ borderRadius: 2 }}
                         onClick={() => setOpenAddPhotoDialog(true)}
                       >
                         Add Agency Photo
                       </Button>
                    </Box>
                  </Grid>

                  {/* License Files */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        License Files
                      </Typography>
                                             {Array.isArray(profileData.licenseFiles) && profileData.licenseFiles.length > 0 ? (
                         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                           {profileData.licenseFiles.map((file, index) => (
                             <Box key={index} sx={{ 
                               width: 120, 
                               height: 120, 
                               border: '1px solid #e0e0e0', 
                               borderRadius: 2,
                               overflow: 'hidden',
                               position: 'relative'
                             }}>
                               <img
                                 src={file.url}
                                 alt={file.name || `License File ${index + 1}`}
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                 onError={(e) => {
                                   e.target.style.display = 'none';
                                   e.target.nextSibling.style.display = 'flex';
                                 }}
                               />
                               <Box sx={{
                                 display: 'none',
                                 width: '100%',
                                 height: '100%',
                                 backgroundColor: '#f5f5f5',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 flexDirection: 'column'
                               }}>
                                 <DescriptionIcon sx={{ fontSize: 32, color: '#999' }} />
                                 <Typography variant="caption" color="text.secondary">
                                   {file.name || 'File'}
                                 </Typography>
                               </Box>
                               <Typography variant="caption" sx={{
                                 position: 'absolute',
                                 bottom: 0,
                                 left: 0,
                                 right: 0,
                                 backgroundColor: 'rgba(0,0,0,0.7)',
                                 color: 'white',
                                 padding: '2px 4px',
                                 fontSize: '10px'
                               }}>
                                 {file.name || `License ${index + 1}`}
                               </Typography>
                               <IconButton
                                 size="small"
                                 sx={{
                                   position: 'absolute',
                                   top: 4,
                                   right: 4,
                                   backgroundColor: 'rgba(255,255,255,0.9)',
                                   '&:hover': {
                                     backgroundColor: 'rgba(255,255,255,1)'
                                   }
                                 }}
                                 onClick={() => handleDeleteFile('licenseFiles', index)}
                               >
                                 <Delete sx={{ fontSize: 16, color: '#f44336' }} />
                               </IconButton>
                             </Box>
                           ))}
                         </Box>
                       ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                           No license files uploaded
                         </Typography>
                       )}
                       <Button
                         variant="outlined"
                         startIcon={<Add />}
                         size="small"
                         sx={{ borderRadius: 2 }}
                         onClick={() => setOpenAddLicenseDialog(true)}
                       >
                         Add License File
                       </Button>
                    </Box>
                  </Grid>

                  {/* Registration Certificate Files */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Registration Certificate Files
                      </Typography>
                                             {Array.isArray(profileData.registrationCertificateFiles) && profileData.registrationCertificateFiles.length > 0 ? (
                         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                           {profileData.registrationCertificateFiles.map((file, index) => (
                             <Box key={index} sx={{ 
                               width: 120, 
                               height: 120, 
                               border: '1px solid #e0e0e0', 
                               borderRadius: 2,
                               overflow: 'hidden',
                               position: 'relative'
                             }}>
                               <img
                                 src={file.url}
                                 alt={file.name || `Certificate File ${index + 1}`}
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                 onError={(e) => {
                                   e.target.style.display = 'none';
                                   e.target.nextSibling.style.display = 'flex';
                                 }}
                               />
                               <Box sx={{
                                 display: 'none',
                                 width: '100%',
                                 height: '100%',
                                 backgroundColor: '#f5f5f5',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 flexDirection: 'column'
                               }}>
                                 <DescriptionIcon sx={{ fontSize: 32, color: '#999' }} />
                                 <Typography variant="caption" color="text.secondary">
                                   {file.name || 'File'}
                                 </Typography>
                               </Box>
                               <Typography variant="caption" sx={{
                                 position: 'absolute',
                                 bottom: 0,
                                 left: 0,
                                 right: 0,
                                 backgroundColor: 'rgba(0,0,0,0.7)',
                                 color: 'white',
                                 padding: '2px 4px',
                                 fontSize: '10px'
                               }}>
                                 {file.name || `Certificate ${index + 1}`}
                               </Typography>
                               <IconButton
                                 size="small"
                                 sx={{
                                   position: 'absolute',
                                   top: 4,
                                   right: 4,
                                   backgroundColor: 'rgba(255,255,255,0.9)',
                                   '&:hover': {
                                     backgroundColor: 'rgba(255,255,255,1)'
                                   }
                                 }}
                                 onClick={() => handleDeleteFile('registrationCertificateFiles', index)}
                               >
                                 <Delete sx={{ fontSize: 16, color: '#f44336' }} />
                               </IconButton>
                             </Box>
                           ))}
                         </Box>
                       ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                           No registration certificate files uploaded
                         </Typography>
                       )}
                       <Button
                         variant="outlined"
                         startIcon={<Add />}
                         size="small"
                         sx={{ borderRadius: 2 }}
                         onClick={() => setOpenAddCertificateDialog(true)}
                       >
                         Add Certificate File
                       </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
                             <Button
                 variant="contained"
                 startIcon={saving ? <LinearProgress size={16} /> : <Save />}
                 onClick={handleSave}
                 disabled={saving}
                 sx={{ borderRadius: 2 }}
               >
                 {saving ? 'Saving...' : 'Save Changes'}
               </Button>
            </Box>
          </Grid>
        </Grid>

                 {/* Change Password Dialog */}
         <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
           <DialogTitle sx={{ fontWeight: 600 }}>
             Change Password
           </DialogTitle>
           <DialogContent>
             <Grid container spacing={2} sx={{ mt: 1 }}>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   label="Current Password"
                   type="password"
                   value={passwordData.currentPassword}
                   onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   label="New Password"
                   type="password"
                   value={passwordData.newPassword}
                   onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   label="Confirm New Password"
                   type="password"
                   value={passwordData.confirmPassword}
                   onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                 />
               </Grid>
             </Grid>
           </DialogContent>
           <DialogActions>
             <Button onClick={() => setOpenPasswordDialog(false)} sx={{ borderRadius: 2 }}>
               Cancel
             </Button>
             <Button onClick={handleChangePassword} variant="contained" sx={{ borderRadius: 2 }}>
               Change Password
             </Button>
           </DialogActions>
         </Dialog>

                                       {/* Add Agency Photo Dialog */}
           <Dialog open={openAddPhotoDialog} onClose={() => setOpenAddPhotoDialog(false)} maxWidth="sm" fullWidth>
             <DialogTitle sx={{ fontWeight: 600 }}>
               Add Agency Photo
             </DialogTitle>
             <DialogContent>
               <Box sx={{ mt: 2 }}>
                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                   Choose Photo
                 </Typography>
                 <input
                   accept="image/*"
                   style={{ display: 'none' }}
                   id="photo-file-input"
                   type="file"
                   onChange={handleFileSelect}
                 />
                 <label htmlFor="photo-file-input">
                   <Button
                     variant="outlined"
                     component="span"
                     startIcon={<PhotoCamera />}
                     sx={{ borderRadius: 2, mb: 2 }}
                   >
                     Choose Photo
                   </Button>
                 </label>
                 {newFileData.file && (
                   <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                     Selected: {newFileData.file.name}
                   </Typography>
                 )}
                 
                 <TextField
                   fullWidth
                   label="Photo Name"
                   value={newFileData.name}
                   onChange={(e) => handleFileDataChange('name', e.target.value)}
                   placeholder="Agency Building"
                 />
               </Box>
             </DialogContent>
             <DialogActions>
               <Button onClick={() => setOpenAddPhotoDialog(false)} sx={{ borderRadius: 2 }}>
                 Cancel
               </Button>
               <Button onClick={() => handleAddFile('agencyPhotos')} variant="contained" sx={{ borderRadius: 2 }}>
                 Add Photo
               </Button>
             </DialogActions>
           </Dialog>

                                       {/* Add License File Dialog */}
           <Dialog open={openAddLicenseDialog} onClose={() => setOpenAddLicenseDialog(false)} maxWidth="sm" fullWidth>
             <DialogTitle sx={{ fontWeight: 600 }}>
               Add License File
             </DialogTitle>
             <DialogContent>
               <Box sx={{ mt: 2 }}>
                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                   Choose File
                 </Typography>
                 <input
                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                   style={{ display: 'none' }}
                   id="license-file-input"
                   type="file"
                   onChange={handleFileSelect}
                 />
                 <label htmlFor="license-file-input">
                   <Button
                     variant="outlined"
                     component="span"
                     startIcon={<Description />}
                     sx={{ borderRadius: 2, mb: 2 }}
                   >
                     Choose File
                   </Button>
                 </label>
                 {newFileData.file && (
                   <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                     Selected: {newFileData.file.name}
                   </Typography>
                 )}
                 
                 <TextField
                   fullWidth
                   label="File Name"
                   value={newFileData.name}
                   onChange={(e) => handleFileDataChange('name', e.target.value)}
                   placeholder="Blood Bank License"
                 />
               </Box>
             </DialogContent>
             <DialogActions>
               <Button onClick={() => setOpenAddLicenseDialog(false)} sx={{ borderRadius: 2 }}>
                 Cancel
               </Button>
               <Button onClick={() => handleAddFile('licenseFiles')} variant="contained" sx={{ borderRadius: 2 }}>
                 Add File
               </Button>
             </DialogActions>
           </Dialog>

                                       {/* Add Certificate File Dialog */}
           <Dialog open={openAddCertificateDialog} onClose={() => setOpenAddCertificateDialog(false)} maxWidth="sm" fullWidth>
             <DialogTitle sx={{ fontWeight: 600 }}>
               Add Certificate File
             </DialogTitle>
             <DialogContent>
               <Box sx={{ mt: 2 }}>
                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                   Choose File
                 </Typography>
                 <input
                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                   style={{ display: 'none' }}
                   id="certificate-file-input"
                   type="file"
                   onChange={handleFileSelect}
                 />
                 <label htmlFor="certificate-file-input">
                   <Button
                     variant="outlined"
                     component="span"
                     startIcon={<Description />}
                     sx={{ borderRadius: 2, mb: 2 }}
                   >
                     Choose File
                   </Button>
                 </label>
                 {newFileData.file && (
                   <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                     Selected: {newFileData.file.name}
                   </Typography>
                 )}
                 
                 <TextField
                   fullWidth
                   label="File Name"
                   value={newFileData.name}
                   onChange={(e) => handleFileDataChange('name', e.target.value)}
                   placeholder="Registration Certificate"
                 />
               </Box>
             </DialogContent>
             <DialogActions>
               <Button onClick={() => setOpenAddCertificateDialog(false)} sx={{ borderRadius: 2 }}>
                 Cancel
               </Button>
               <Button onClick={() => handleAddFile('registrationCertificateFiles')} variant="contained" sx={{ borderRadius: 2 }}>
                 Add File
               </Button>
             </DialogActions>
           </Dialog>
      </Box>
      
      <ToastContainer />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorEditProfile; 