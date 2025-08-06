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
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HospitalVendorLayout from './HospitalVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { hospitalVendorService } from '../../../services/Vendors/HospitalVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HospitalVendorProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    landmark: '',
    ownerName: '',
    certifications: [],
    licenses: [],
    specialityTypes: [],
    servicesOffered: [],
    bedsAvailable: '',
    doctors: '',
    workingTime: '',
    workingDays: [],
    contactNumber: '',
    email: '',
    website: '',
    hasLiftAccess: false,
    hasParking: false,
    providesAmbulanceService: false,
    about: '',
    hasWheelchairAccess: false,
    providesOnlineConsultancy: false,
    feesRange: '',
    otherFacilities: [],
    insuranceCompanies: [],
    photos: [],
    state: '',
    city: '',
    pincode: '',
    location: '',
    password: '',
    // Add file management fields
    hospitalPhotos: [],
    certificationFiles: [],
    licenseFiles: []
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
            console.log('Fetching hospital profile for vendor ID:', vendorId);
            
            // Fetch profile data from API
            try {
              const apiResponse = await hospitalVendorService.getHospitalProfile(vendorId);
              const transformedData = hospitalVendorService.transformProfileData(apiResponse);
              
              if (transformedData) {
                setProfileData(transformedData);
                console.log('Hospital profile data loaded:', transformedData);
              } else {
                console.warn('Failed to transform hospital profile data');
                toast.error('Failed to load profile data');
              }
            } catch (profileError) {
              console.error('Error fetching hospital profile:', profileError);
              toast.error('Failed to load hospital profile');
              
              // Fallback to mock data if API fails
              const mockProfileData = {
                name: 'City General Hospital',
                gstNumber: '27AABCC1234Z1Z5',
                panNumber: 'AABCC1234Z',
                address: '123 Medical Center Road, Andheri West',
                landmark: 'Near Metro Station',
                ownerName: 'Dr. Rajesh Kumar',
                certifications: ['NABH Accredited', 'ISO 9001:2015', 'JCI Certified'],
                licenses: ['Hospital License', 'Blood Bank License', 'Pharmacy License'],
                specialityTypes: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine', 'Pediatrics'],
                servicesOffered: ['Emergency Care', 'Surgery', 'Diagnostics', 'Rehabilitation', 'Telemedicine'],
                bedsAvailable: '250',
                doctors: '45',
                workingTime: '24x7',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                contactNumber: '+91 98765 43210',
                email: 'contact@cityhospital.com',
                website: 'www.cityhospital.com',
                hasLiftAccess: true,
                hasParking: true,
                providesAmbulanceService: true,
                about: 'A leading multi-specialty hospital providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.',
                hasWheelchairAccess: true,
                providesOnlineConsultancy: true,
                feesRange: '₹500 - ₹50,000',
                otherFacilities: ['Cafeteria', 'ATM', 'WiFi', 'Waiting Area', 'Prayer Room'],
                insuranceCompanies: ['Bajaj Allianz', 'ICICI Lombard', 'HDFC ERGO', 'Star Health'],
                photos: [],
                state: 'Maharashtra',
                city: 'Mumbai',
                pincode: '400001',
                location: 'https://maps.google.com/?q=19.0760,72.8777',
                password: '',
                // Initialize file arrays
                hospitalPhotos: [],
                certificationFiles: [],
                licenseFiles: []
              };
              setProfileData(mockProfileData);
            }
          } else {
            console.warn('Vendor ID not found in stored data:', authData.vendorData);
            toast.error('Vendor ID not found');
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleEditProfile = () => {
    navigate('/vendor/hospital/edit-profile');
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Verified />;
  };

  // Skeleton loading component for profile
  const ProfileSkeleton = () => (
    <HospitalVendorLayout title="Profile">
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
    </HospitalVendorLayout>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <HospitalVendorLayout title="Profile">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Hospital Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View your hospital information and settings
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
                    {profileData.name}
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
                    {profileData.contactNumber}
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
                    {profileData.bedsAvailable} Beds Available
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
                        Hospital Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.name}
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
                        {profileData.address}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Nearby Landmark
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.landmark}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Contact Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.contactNumber}
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
                        Working Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.workingTime}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Working Days
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.workingDays?.join(', ')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Beds Available
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.bedsAvailable}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Number of Doctors
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.doctors}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Fees Range
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.feesRange}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Google Maps Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profileData.location}
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
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Ambulance Service
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.providesAmbulanceService)}
                        label={profileData.providesAmbulanceService ? "Yes" : "No"}
                        color={getStatusColor(profileData.providesAmbulanceService)}
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
                        Online Consultancy
                      </Typography>
                      <Chip
                        icon={getStatusIcon(profileData.providesOnlineConsultancy)}
                        label={profileData.providesOnlineConsultancy ? "Yes" : "No"}
                        color={getStatusColor(profileData.providesOnlineConsultancy)}
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
                  <LocalHospital />
                  Services Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Speciality Types
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.specialityTypes?.map((speciality, index) => (
                          <Chip
                            key={index}
                            label={speciality}
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
                        Services Offered
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.servicesOffered?.map((service, index) => (
                          <Chip
                            key={index}
                            label={service}
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
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Insurance Companies
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.insuranceCompanies?.map((company, index) => (
                          <Chip
                            key={index}
                            label={company}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Certifications & Licenses */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment />
                  Certifications & Licenses
                </Typography>
                <Grid container spacing={3}>
                  {/* Hospital Photos */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Hospital Photos
                      </Typography>
                      {Array.isArray(profileData.hospitalPhotos) && profileData.hospitalPhotos.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {profileData.hospitalPhotos.map((photo, index) => (
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
                                alt={photo.name || `Hospital Photo ${index + 1}`}
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
                          No hospital photos uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Certification Files */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Certification Files
                      </Typography>
                      {Array.isArray(profileData.certificationFiles) && profileData.certificationFiles.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {profileData.certificationFiles.map((file, index) => (
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
                                alt={file.name || `Certification File ${index + 1}`}
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
                                {file.name || `Certification ${index + 1}`}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No certification files uploaded
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
                </Grid>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description />
                  About Hospital
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {profileData.about}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <ToastContainer />
    </HospitalVendorLayout>
  );
};

export default HospitalVendorProfile; 