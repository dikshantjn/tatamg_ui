import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  useTheme,
  Divider,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
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
  Add,
  Delete,
  PhotoCamera,
  School,
  Work,
  Star,
  Accessible,
  Elevator,
  DirectionsCar
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { doctorConsultationVendorService } from '../../../services/Vendors/DoctorConsultationVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorConsultationVendorEditProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newQualification, setNewQualification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newConsultationType, setNewConsultationType] = useState('');
  const [newInsurancePartner, setNewInsurancePartner] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [showLocationField, setShowLocationField] = useState(true);

  // File management states
  const [openAddPhotoDialog, setOpenAddPhotoDialog] = useState(false);
  const [fileType, setFileType] = useState('clinicPhotos'); // 'clinicPhotos' or 'medicalLicenseFile'
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
          
          // Get vendor ID
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          
          if (vendorId) {
            // Fetch profile data from API
            const apiProfileData = await doctorConsultationVendorService.getVendorProfile(vendorId);
            console.log('API Profile Data:', apiProfileData);
            const transformedData = doctorConsultationVendorService.transformProfileData(apiProfileData);
            console.log('Transformed Data:', transformedData);
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

  const handleCancel = () => {
    navigate('/vendor/doctor-consultation/profile');
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!profileData.doctorName || !profileData.phoneNumber || !profileData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      setSaving(true);

      // Get vendor ID from auth data
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId || authData?.vendorData?.id;

      if (!vendorId) {
        toast.error('Vendor ID not found');
        return;
      }

      // Transform data to API format
      const dataToUpdate = doctorConsultationVendorService.transformToApiFormat(profileData);

      console.log('Sending update data:', dataToUpdate);

      // Call API to update profile
      const result = await doctorConsultationVendorService.updateVendorProfile(vendorId, dataToUpdate);
      
      console.log('Update response:', result);
      toast.success('Profile updated successfully');
      navigate('/vendor/doctor-consultation/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
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
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleAddItem = (type, value, setValue, field) => {
    if (!value.trim()) {
      toast.error('Please enter a value');
      return;
    }
    setProfileData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setValue('');
  };

  const handleDeleteItem = (field, index) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
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
    const urlPath = `https://firebasestorage.googleapis.com/v0/b/vedikahealthcare-59980.firebasestorage.app/o/doctor_${fileType}%2F${fileName}?alt=media&token=generated_token_${timestamp}`;

    const newFile = {
      url: urlPath,
      name: newFileData.name
    };

    setProfileData(prev => ({
      ...prev,
      [fileType]: [...(Array.isArray(prev[fileType]) ? prev[fileType] : []), newFile]
    }));

    setNewFileData({ url: '', name: '', file: null });
    setOpenAddPhotoDialog(false);
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

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    toast.info('Getting your current location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates = `${latitude}, ${longitude}`;
        handleProfileChange('location', coordinates);
        toast.success('Location detected successfully!');
      },
      (error) => {
        console.error('Error getting location:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please allow location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Verified />;
  };

  // Skeleton loading component for edit profile
  const EditProfileSkeleton = () => (
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>

        {/* Form Skeleton */}
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
    return <EditProfileSkeleton />;
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
              Edit Doctor Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your consultation profile and settings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>

        {/* Profile Information */}
        <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {/* Profile Picture */}
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
                  Profile Picture
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ 
                    width: 120, 
                    height: 120, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
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
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <Person sx={{ fontSize: 48, color: '#999' }} />
                      <Typography variant="caption" color="text.secondary">
                        No Photo
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Profile Picture
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {profileData.profilePicture ? 'Profile picture uploaded' : 'No profile picture uploaded'}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Change Photo
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

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
                    <TextField
                      fullWidth
                      label="Doctor Name *"
                      value={profileData.doctorName}
                      onChange={(e) => handleProfileChange('doctorName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={profileData.gender}
                        onChange={(e) => handleProfileChange('gender', e.target.value)}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email *"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number *"
                      value={profileData.phoneNumber}
                      onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="License Number"
                      value={profileData.licenseNumber}
                      onChange={(e) => handleProfileChange('licenseNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience Years"
                      value={profileData.experienceYears}
                      onChange={(e) => handleProfileChange('experienceYears', e.target.value)}
                      type="number"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Medical License Files */}
            {console.log('Rendering Medical License Files section, data:', profileData.medicalLicenseFile)}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description />
                  Medical License Files ({profileData.medicalLicenseFile?.length || 0} files)
                </Typography>
                {Array.isArray(profileData.medicalLicenseFile) && profileData.medicalLicenseFile.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Description />}
                            onClick={() => window.open(file.url, '_blank')}
                            sx={{ borderRadius: 2 }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteFile('medicalLicenseFile', index)}
                            sx={{ borderRadius: 2 }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No medical license files uploaded
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                  onClick={() => {
                    setFileType('medicalLicenseFile');
                    setNewFileData({ url: '', name: '', file: null });
                    setOpenAddPhotoDialog(true);
                  }}
                >
                  Add Medical License File
                </Button>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profileData.educationalQualifications?.map((qualification, index) => (
                    <Chip
                      key={index}
                      label={qualification}
                      onDelete={() => handleDeleteItem('educationalQualifications', index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add qualification"
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('qualification', newQualification, setNewQualification, 'educationalQualifications')}
                  >
                    Add
                  </Button>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profileData.specializations?.map((specialization, index) => (
                    <Chip
                      key={index}
                      label={specialization}
                      onDelete={() => handleDeleteItem('specializations', index)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add specialization"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('specialization', newSpecialization, setNewSpecialization, 'specializations')}
                  >
                    Add
                  </Button>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profileData.languageProficiency?.map((language, index) => (
                    <Chip
                      key={index}
                      label={language}
                      onDelete={() => handleDeleteItem('languageProficiency', index)}
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add language"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('language', newLanguage, setNewLanguage, 'languageProficiency')}
                  >
                    Add
                  </Button>
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
                    <TextField
                      fullWidth
                      label="Consultation Fees Range"
                      value={profileData.consultationFeesRange}
                      onChange={(e) => handleProfileChange('consultationFeesRange', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.hasTelemedicineExperience}
                          onChange={(e) => handleProfileChange('hasTelemedicineExperience', e.target.checked)}
                        />
                      }
                      label="Telemedicine Experience"
                    />
                  </Grid>
                  
                  {/* Consultation Types */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Consultation Types
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {profileData.consultationTypes?.map((type, index) => (
                          <Chip
                            key={index}
                            label={type}
                            onDelete={() => handleDeleteItem('consultationTypes', index)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Add consultation type"
                          value={newConsultationType}
                          onChange={(e) => setNewConsultationType(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => handleAddItem('consultationType', newConsultationType, setNewConsultationType, 'consultationTypes')}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Consultation Time Slots */}
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Consultation Time Slots
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {profileData.consultationTimeSlots?.map((slot, index) => (
                          <Chip
                            key={index}
                            label={slot}
                            onDelete={() => handleDeleteItem('consultationTimeSlots', index)}
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Add time slot (e.g., 09:00 AM - 11:00 AM)"
                          value={newTimeSlot}
                          onChange={(e) => setNewTimeSlot(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => handleAddItem('timeSlot', newTimeSlot, setNewTimeSlot, 'consultationTimeSlots')}
                        >
                          Add
                        </Button>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profileData.insurancePartners?.map((partner, index) => (
                    <Chip
                      key={index}
                      label={partner}
                      onDelete={() => handleDeleteItem('insurancePartners', index)}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add insurance partner"
                    value={newInsurancePartner}
                    onChange={(e) => setNewInsurancePartner(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('insurancePartner', newInsurancePartner, setNewInsurancePartner, 'insurancePartners')}
                  >
                    Add
                  </Button>
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
                    <TextField
                      fullWidth
                      label="Complete Address"
                      value={profileData.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      multiline
                      rows={2}
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
                      label="Nearby Landmark"
                      value={profileData.nearbyLandmark}
                      onChange={(e) => handleProfileChange('nearbyLandmark', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Floor"
                      value={profileData.floor}
                      onChange={(e) => handleProfileChange('floor', e.target.value)}
                    />
                  </Grid>
                                                                           <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showLocationField}
                            onChange={(e) => {
                              console.log('Toggle changed:', e.target.checked);
                              setShowLocationField(e.target.checked);
                            }}
                          />
                        }
                        label="Add Location Information"
                      />
                      
                      {showLocationField && (
                        <>
                          {console.log('Rendering location field, showLocationField:', showLocationField)}
                          <TextField
                            fullWidth
                            label="Google Maps Location (Coordinates: lat, lng)"
                            value={profileData.location}
                            onChange={(e) => handleProfileChange('location', e.target.value)}
                            placeholder="18.5204, 73.8567"
                            helperText="Enter coordinates in format: latitude, longitude"
                            sx={{ mt: 2 }}
                            InputProps={{
                              endAdornment: (
                                <Button
                                  variant="outlined"
                                  startIcon={<LocationOn />}
                                  onClick={handleGetCurrentLocation}
                                  sx={{ 
                                    borderRadius: 2,
                                    minWidth: 'auto',
                                    px: 2,
                                    mr: -1,
                                    whiteSpace: 'nowrap'
                                  }}
                                  title="Get Current Location"
                                >
                                  Get Location
                                </Button>
                              )
                            }}
                          />
                          {profileData.location && profileData.location.includes(',') && (
                            <Box sx={{ mt: 2, 
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
                          )}
                        </>
                      )}
                    </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.hasLiftAccess}
                          onChange={(e) => handleProfileChange('hasLiftAccess', e.target.checked)}
                        />
                      }
                      label="Lift Access"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.hasWheelchairAccess}
                          onChange={(e) => handleProfileChange('hasWheelchairAccess', e.target.checked)}
                        />
                      }
                      label="Wheelchair Access"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.hasParking}
                          onChange={(e) => handleProfileChange('hasParking', e.target.checked)}
                        />
                      }
                      label="Parking Available"
                    />
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profileData.otherFacilities?.map((facility, index) => (
                    <Chip
                      key={index}
                      label={facility}
                      onDelete={() => handleDeleteItem('otherFacilities', index)}
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add facility"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('facility', newFacility, setNewFacility, 'otherFacilities')}
                  >
                    Add
                  </Button>
                </Box>
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
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
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
                          onClick={() => handleDeleteFile('clinicPhotos', index)}
                        >
                          <Delete sx={{ fontSize: 16, color: '#f44336' }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No clinic photos uploaded
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                  onClick={() => {
                    setFileType('clinicPhotos');
                    setNewFileData({ url: '', name: '', file: null });
                    setOpenAddPhotoDialog(true);
                  }}
                >
                  Add Clinic Photo
                </Button>
              </CardContent>
            </Card>

            {/* Password Change Section */}
            <Card sx={{ mt: 3, 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  Change Password
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      sx={{ borderRadius: 2 }}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Add File Dialog */}
      <Dialog open={openAddPhotoDialog} onClose={() => setOpenAddPhotoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {fileType === 'medicalLicenseFile' ? 'Add Medical License File' : 'Add Clinic Photo'}
        </DialogTitle>
                  <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {fileType === 'medicalLicenseFile' ? 'Choose File' : 'Choose Photo'}
              </Typography>
                          <input
                accept={fileType === 'medicalLicenseFile' ? "image/*,.pdf,.doc,.docx" : "image/*"}
                style={{ display: 'none' }}
                id="photo-file-input"
                type="file"
                onChange={handleFileSelect}
              />
            <label htmlFor="photo-file-input">
                              <Button
                  variant="outlined"
                  component="span"
                  startIcon={fileType === 'medicalLicenseFile' ? <Description /> : <PhotoCamera />}
                  sx={{ borderRadius: 2, mb: 2 }}
                >
                  {fileType === 'medicalLicenseFile' ? 'Choose File' : 'Choose Photo'}
                </Button>
            </label>
            {newFileData.file && (
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                Selected: {newFileData.file.name}
              </Typography>
            )}
            
                          <TextField
                fullWidth
                label={fileType === 'medicalLicenseFile' ? 'File Name' : 'Photo Name'}
                value={newFileData.name}
                onChange={(e) => handleFileDataChange('name', e.target.value)}
                placeholder={fileType === 'medicalLicenseFile' ? 'Medical License' : 'Clinic Interior'}
              />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPhotoDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={() => handleAddFile(fileType)} variant="contained" sx={{ borderRadius: 2 }}>
            {fileType === 'medicalLicenseFile' ? 'Add File' : 'Add Photo'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <ToastContainer />
    </>
  );
};

export default DoctorConsultationVendorEditProfile; 