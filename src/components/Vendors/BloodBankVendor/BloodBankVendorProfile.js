import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  useTheme,
  LinearProgress,
  Divider,
  Skeleton
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  Edit,
  LocalHospital,
  Bloodtype,
  Business,
  Verified,
  CheckCircle,
  Language,
  Payment,
  Description,
  Map,
  Schedule,
  Assignment,
  Image,
  Description as DescriptionIcon,
  BrokenImage
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleEditProfile = () => {
    navigate('/vendor/blood-bank/edit-profile');
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Verified />;
  };

  // Skeleton loading component for profile
  const ProfileSkeleton = () => (
      <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width="200px" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="300px" height={20} />
          </Box>
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
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

        {/* Information Cards Skeleton */}
        <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="150px" height={24} sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((fieldIndex) => (
                      <Grid item xs={12} sm={6} key={fieldIndex}>
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="80%" height={16} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Box>
      </BloodBankVendorLayout>
    );

  if (loading) {
    return <ProfileSkeleton />;
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
              Blood Bank Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View your blood bank information and settings
            </Typography>
          </Box>
                <Button
            variant="contained"
                  startIcon={<Edit />}
            onClick={handleEditProfile}
                  sx={{ borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  Basic Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Agency Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.agencyName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Owner Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.ownerName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        GST Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.gstNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        PAN Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.panNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Complete Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.completeAddress}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Nearby Landmark
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.nearbyLandmark}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.phoneNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        City
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.city}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        State
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.state}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Pincode
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.pincode}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Website
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.website}
                      </Typography>
                    </Box>
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule />
                  Operational Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Language Proficiency
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.languageProficiency}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Delivery Operational Areas
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.deliveryOperationalAreas}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Distance Limitations
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.distanceLimitations}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Google Maps Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.googleMapsLocation}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        24x7 Operational
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.is24x7Operational)}
                        label={profileData.is24x7Operational ? "Yes" : "No"}
                        color={getStatusColor(profileData.is24x7Operational)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        All Days Working
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.isAllDaysWorking)}
                        label={profileData.isAllDaysWorking ? "Yes" : "No"}
                        color={getStatusColor(profileData.isAllDaysWorking)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Accepts Online Payment
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.acceptsOnlinePayment)}
                        label={profileData.acceptsOnlinePayment ? "Yes" : "No"}
                        color={getStatusColor(profileData.acceptsOnlinePayment)}
                        size="small"
                      />
                    </Box>
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bloodtype />
                  Services Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Blood Services Provided
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.bloodServicesProvided}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Platelet Services Provided
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.plateletServicesProvided}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Other Services Provided
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.otherServicesProvided}
                      </Typography>
                    </Box>
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment />
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
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No agency photos uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* License Files */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        License Files
                      </Typography>
                      {Array.isArray(profileData.licenseFiles) && profileData.licenseFiles.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {profileData.licenseFiles.map((file, index) => (
                            <Box key={index} sx={{ 
                              width: 120, 
                              height: 120, 
                              border: '1px solid #e0e0e0', 
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                              cursor: 'pointer'
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
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No license files uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Registration Certificate Files */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Registration Certificate Files
                      </Typography>
                      {Array.isArray(profileData.registrationCertificateFiles) && profileData.registrationCertificateFiles.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {profileData.registrationCertificateFiles.map((file, index) => (
                            <Box key={index} sx={{ 
                              width: 120, 
                              height: 120, 
                              border: '1px solid #e0e0e0', 
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                              cursor: 'pointer'
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
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No registration certificate files uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <ToastContainer />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorProfile; 