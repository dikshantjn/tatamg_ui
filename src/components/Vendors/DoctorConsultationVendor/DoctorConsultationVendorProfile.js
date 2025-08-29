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
  Divider,
  Skeleton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  Edit,
  LocalHospital,
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
  BrokenImage,
  Security,
  Settings,
  Notifications,
  Save,
  Cancel,
  School,
  Work,
  Star,
  Accessible,
  Elevator,
  DirectionsCar,
  PhotoCamera
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { doctorConsultationVendorService } from '../../../services/Vendors/DoctorConsultationVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorConsultationVendorProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    doctorName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    profilePicture: '',
    medicalLicenseFile: '',
    licenseNumber: '',
    educationalQualifications: [],
    specializations: [],
    experienceYears: '',
    languageProficiency: [],
    hasTelemedicineExperience: false,
    consultationFeesRange: '',
    consultationTimeSlots: [],
    consultationDays: [],
    consultationTypes: [],
    insurancePartners: [],
    address: '',
    state: '',
    city: '',
    pincode: '',
    nearbyLandmark: '',
    floor: '',
    hasLiftAccess: false,
    hasWheelchairAccess: false,
    hasParking: false,
    otherFacilities: [],
    clinicPhotos: [],
    location: ''
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Get vendor ID
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          
          if (vendorId) {
            // Fetch profile data from API
            const apiProfileData = await doctorConsultationVendorService.getVendorProfile(vendorId);
            const transformedData = doctorConsultationVendorService.transformProfileData(apiProfileData);
            setProfileData(transformedData);
          } else {
            // Fallback to mock data if no vendor ID
            const mockProfileData = {
              doctorName: 'Dr. Sarah Johnson',
              gender: 'Female',
              email: 'sarah.johnson@healthcare.com',
              password: '',
              confirmPassword: '',
              phoneNumber: '+91 98765 43210',
              profilePicture: '',
              medicalLicenseFile: '',
              licenseNumber: 'MED123456789',
              educationalQualifications: ['MBBS - AIIMS Delhi', 'MD - Internal Medicine', 'Fellowship - Cardiology'],
              specializations: ['Cardiology', 'Internal Medicine', 'General Physician'],
              experienceYears: '8',
              languageProficiency: ['English', 'Hindi', 'Marathi'],
              hasTelemedicineExperience: true,
              consultationFeesRange: '₹500 - ₹2000',
              consultationTimeSlots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM', '06:00 PM - 08:00 PM'],
              consultationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              consultationTypes: ['Video Call', 'Voice Call', 'Chat', 'In-Person'],
              insurancePartners: ['Bajaj Allianz', 'ICICI Lombard', 'HDFC ERGO', 'Star Health'],
              address: '123 Healthcare Street, Medical District, Mumbai, Maharashtra 400001',
              state: 'Maharashtra',
              city: 'Mumbai',
              pincode: '400001',
              nearbyLandmark: 'Near Metro Station',
              floor: '2nd Floor',
              hasLiftAccess: true,
              hasWheelchairAccess: true,
              hasParking: true,
              otherFacilities: ['Waiting Area', 'WiFi', 'Cafeteria', 'Prayer Room'],
              clinicPhotos: [],
              location: 'https://maps.google.com/?q=19.0760,72.8777'
            };
            setProfileData(mockProfileData);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
        
        // Fallback to mock data on error
        const mockProfileData = {
          doctorName: 'Dr. Sarah Johnson',
          gender: 'Female',
          email: 'sarah.johnson@healthcare.com',
          password: '',
          confirmPassword: '',
          phoneNumber: '+91 98765 43210',
          profilePicture: '',
          medicalLicenseFile: '',
          licenseNumber: 'MED123456789',
          educationalQualifications: ['MBBS - AIIMS Delhi', 'MD - Internal Medicine', 'Fellowship - Cardiology'],
          specializations: ['Cardiology', 'Internal Medicine', 'General Physician'],
          experienceYears: '8',
          languageProficiency: ['English', 'Hindi', 'Marathi'],
          hasTelemedicineExperience: true,
          consultationFeesRange: '₹500 - ₹2000',
          consultationTimeSlots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM', '06:00 PM - 08:00 PM'],
          consultationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          consultationTypes: ['Video Call', 'Voice Call', 'Chat', 'In-Person'],
          insurancePartners: ['Bajaj Allianz', 'ICICI Lombard', 'HDFC ERGO', 'Star Health'],
          address: '123 Healthcare Street, Medical District, Mumbai, Maharashtra 400001',
          state: 'Maharashtra',
          city: 'Mumbai',
          pincode: '400001',
          nearbyLandmark: 'Near Metro Station',
          floor: '2nd Floor',
          hasLiftAccess: true,
          hasWheelchairAccess: true,
          hasParking: true,
          otherFacilities: ['Waiting Area', 'WiFi', 'Cafeteria', 'Prayer Room'],
          clinicPhotos: [],
          location: 'https://maps.google.com/?q=19.0760,72.8777'
        };
        setProfileData(mockProfileData);
      } finally {
      setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleEditProfile = () => {
    navigate('/vendor/doctor-consultation/edit-profile');
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Verified />;
  };

  // Skeleton loading component for profile
  const ProfileSkeleton = () => (
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
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Doctor Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
              View your consultation profile and settings
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
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt="Profile Picture"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <Box sx={{
                    display: profileData.profilePicture ? 'none' : 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Person sx={{ fontSize: 32 }} />
                  </Box>
                  </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    {profileData.doctorName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {profileData.specializations?.join(', ')}
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
                  <Work fontSize="small" color="primary" />
                  <Typography variant="body1">
                    {profileData.experienceYears} Years Experience
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
                        Doctor Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.doctorName}
                      </Typography>
                    </Box>
                </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Gender
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.gender}
                      </Typography>
              </Box>
                </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        License Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.licenseNumber}
                      </Typography>
                    </Box>
                </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Experience
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.experienceYears} Years
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
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.phoneNumber}
                      </Typography>
                    </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

            {/* Educational Qualifications */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School />
                  Educational Qualifications
              </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.educationalQualifications?.map((qualification, index) => (
              <Chip 
                      key={index}
                      label={qualification}
                      size="small"
                color="primary" 
                variant="outlined"
                    />
                  ))}
                </Box>
            </CardContent>
          </Card>

            {/* Specializations */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
        <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospital />
                  Specializations
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.specializations?.map((specialization, index) => (
                    <Chip
                      key={index}
                      label={specialization}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
            </CardContent>
          </Card>

            {/* Language Proficiency */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
        <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Language />
                  Language Proficiency
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.languageProficiency?.map((language, index) => (
                    <Chip
                      key={index}
                      label={language}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Consultation Information */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule />
                  Consultation Information
                </Typography>
            <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Consultation Fees Range
                </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.consultationFeesRange}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Telemedicine Experience
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.hasTelemedicineExperience)}
                        label={profileData.hasTelemedicineExperience ? "Yes" : "No"}
                        color={getStatusColor(profileData.hasTelemedicineExperience)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Consultation Types
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.consultationTypes?.map((type, index) => (
                          <Chip
                            key={index}
                            label={type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Consultation Days
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.consultationDays?.map((day, index) => (
                          <Chip
                            key={index}
                            label={day}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
              </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Consultation Time Slots
                </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.consultationTimeSlots?.map((slot, index) => (
                          <Chip
                            key={index}
                            label={slot}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
              </Grid>
            </Grid>
              </CardContent>
            </Card>

            {/* Insurance Partners */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment />
                  Insurance Partners
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.insurancePartners?.map((partner, index) => (
                    <Chip
                      key={index}
                      label={partner}
                      size="small"
                      color="success"
                  variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn />
                  Address Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Complete Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.address}
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
                        Floor
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.floor}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Lift Access
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.hasLiftAccess)}
                        label={profileData.hasLiftAccess ? "Yes" : "No"}
                        color={getStatusColor(profileData.hasLiftAccess)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Wheelchair Access
                    </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.hasWheelchairAccess)}
                        label={profileData.hasWheelchairAccess ? "Yes" : "No"}
                        color={getStatusColor(profileData.hasWheelchairAccess)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Parking Available
                    </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.hasParking)}
                        label={profileData.hasParking ? "Yes" : "No"}
                        color={getStatusColor(profileData.hasParking)}
                        size="small"
                      />
                    </Box>
              </Grid>
            </Grid>
              </CardContent>
            </Card>

            {/* Other Facilities */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business />
                  Other Facilities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.otherFacilities?.map((facility, index) => (
                    <Chip
                      key={index}
                      label={facility}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Medical License Files */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description />
                  Medical License Files
                </Typography>
                {Array.isArray(profileData.medicalLicenseFile) && profileData.medicalLicenseFile.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {profileData.medicalLicenseFile.map((file, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9'
                      }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 1,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5'
                        }}>
                          {file.url && file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                              src={file.url}
                              alt={file.name || `License ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <Box sx={{
                            display: file.url && file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'none' : 'flex',
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <DescriptionIcon sx={{ fontSize: 24, color: '#999' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '8px', textAlign: 'center' }}>
                              {file.url ? 'File' : 'No Preview'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {file.name || `Medical License ${index + 1}`}
                          </Typography>
                        </Box>
                  <Button
                          size="small"
                    variant="outlined"
                          startIcon={<Description />}
                          onClick={() => window.open(file.url, '_blank')}
                          sx={{ borderRadius: 2 }}
                        >
                          View
                  </Button>
                </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No medical license files uploaded
                  </Typography>
          )}
        </CardContent>
      </Card>

            {/* Clinic Photos */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoCamera />
                  Clinic Photos
                </Typography>
                {Array.isArray(profileData.clinicPhotos) && profileData.clinicPhotos.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {profileData.clinicPhotos.map((photo, index) => (
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
                          alt={photo.name || `Clinic Photo ${index + 1}`}
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
                    No clinic photos uploaded
                  </Typography>
          )}
        </CardContent>
      </Card>

            {/* Location */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Map />
                  Location
                </Typography>
                {profileData.location && profileData.location.includes(',') ? (
                  <Box sx={{ 
                    width: '100%', 
                    height: 300, 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0'
                  }}>
                    <iframe
                      src={`https://maps.google.com/maps?q=${profileData.location}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
    </Box>
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profileData.location || 'Location not specified'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </Box>
      
      <ToastContainer />
    </>
  );
};

export default DoctorConsultationVendorProfile; 