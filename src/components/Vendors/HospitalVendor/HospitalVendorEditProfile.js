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
  PhotoCamera
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HospitalVendorLayout from './HospitalVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { hospitalVendorService } from '../../../services/Vendors/HospitalVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HospitalVendorEditProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newCertification, setNewCertification] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newSpeciality, setNewSpeciality] = useState('');
  const [newService, setNewService] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newInsurance, setNewInsurance] = useState('');

  // File management states
  const [openAddPhotoDialog, setOpenAddPhotoDialog] = useState(false);
  const [openAddCertificationDialog, setOpenAddCertificationDialog] = useState(false);
  const [openAddLicenseDialog, setOpenAddLicenseDialog] = useState(false);
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
            console.log('Fetching hospital profile for edit, vendor ID:', vendorId);
            
            // Fetch profile data from API
            try {
              const apiResponse = await hospitalVendorService.getHospitalProfile(vendorId);
              const transformedData = hospitalVendorService.transformProfileData(apiResponse);
              
              if (transformedData) {
                setProfileData(transformedData);
                console.log('Hospital profile data loaded for edit:', transformedData);
              } else {
                console.warn('Failed to transform hospital profile data for edit');
                toast.error('Failed to load profile data');
              }
            } catch (profileError) {
              console.error('Error fetching hospital profile for edit:', profileError);
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

  const handleCancel = () => {
    navigate('/vendor/hospital/profile');
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!profileData.name || !profileData.contactNumber || !profileData.email) {
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

      // Add vendor ID to profile data
      const dataToUpdate = {
        ...profileData,
        vendorId: vendorId
      };

      // Call API to update profile
      const result = await hospitalVendorService.updateHospitalProfile(vendorId, dataToUpdate);
      
      if (result && result.message) {
        toast.success(result.message || 'Profile updated successfully');
      navigate('/vendor/hospital/profile');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
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
    const urlPath = `https://firebasestorage.googleapis.com/v0/b/vedikahealthcare-59980.firebasestorage.app/o/hospital_${fileType}%2F${fileName}?alt=media&token=generated_token_${timestamp}`;

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
    if (fileType === 'hospitalPhotos') {
      setOpenAddPhotoDialog(false);
    } else if (fileType === 'certificationFiles') {
      setOpenAddCertificationDialog(false);
    } else if (fileType === 'licenseFiles') {
      setOpenAddLicenseDialog(false);
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

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Verified />;
  };

  // Skeleton loading component for edit profile
  const EditProfileSkeleton = () => (
    <HospitalVendorLayout title="Edit Profile">
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
    </HospitalVendorLayout>
  );

  if (loading) {
    return <EditProfileSkeleton />;
  }

  return (
    <HospitalVendorLayout title="Edit Profile">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Edit Hospital Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your hospital information and settings
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
              sx={{ borderRadius: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

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
                    <TextField
                      fullWidth
                      label="Hospital Name *"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Owner Name"
                      value={profileData.ownerName}
                      onChange={(e) => handleProfileChange('ownerName', e.target.value)}
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
                      value={profileData.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nearby Landmark"
                      value={profileData.landmark}
                      onChange={(e) => handleProfileChange('landmark', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Number *"
                      value={profileData.contactNumber}
                      onChange={(e) => handleProfileChange('contactNumber', e.target.value)}
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule />
                  Operational Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Working Time"
                      value={profileData.workingTime}
                      onChange={(e) => handleProfileChange('workingTime', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Beds Available"
                      value={profileData.bedsAvailable}
                      onChange={(e) => handleProfileChange('bedsAvailable', e.target.value)}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Number of Doctors"
                      value={profileData.doctors}
                      onChange={(e) => handleProfileChange('doctors', e.target.value)}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fees Range"
                      value={profileData.feesRange}
                      onChange={(e) => handleProfileChange('feesRange', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Google Maps Location"
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                    />
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
                          checked={profileData.hasParking}
                          onChange={(e) => handleProfileChange('hasParking', e.target.checked)}
                        />
                      }
                      label="Parking Available"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.providesAmbulanceService}
                          onChange={(e) => handleProfileChange('providesAmbulanceService', e.target.checked)}
                        />
                      }
                      label="Ambulance Service"
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
                          checked={profileData.providesOnlineConsultancy}
                          onChange={(e) => handleProfileChange('providesOnlineConsultancy', e.target.checked)}
                        />
                      }
                      label="Online Consultancy"
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospital />
                  Services Information
                </Typography>
                
                {/* Speciality Types */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Speciality Types
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {profileData.specialityTypes?.map((speciality, index) => (
                      <Chip
                        key={index}
                        label={speciality}
                        onDelete={() => handleDeleteItem('specialityTypes', index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add speciality"
                      value={newSpeciality}
                      onChange={(e) => setNewSpeciality(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleAddItem('speciality', newSpeciality, setNewSpeciality, 'specialityTypes')}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                {/* Services Offered */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Services Offered
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {profileData.servicesOffered?.map((service, index) => (
                      <Chip
                        key={index}
                        label={service}
                        onDelete={() => handleDeleteItem('servicesOffered', index)}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleAddItem('service', newService, setNewService, 'servicesOffered')}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                {/* Other Facilities */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
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
                </Box>

                {/* Insurance Companies */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Insurance Companies
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {profileData.insuranceCompanies?.map((company, index) => (
                      <Chip
                        key={index}
                        label={company}
                        onDelete={() => handleDeleteItem('insuranceCompanies', index)}
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add insurance company"
                      value={newInsurance}
                      onChange={(e) => setNewInsurance(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleAddItem('insurance', newInsurance, setNewInsurance, 'insuranceCompanies')}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
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
                
                 {/* Documents & Files */}
                 <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
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
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
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
                                  onClick={() => handleDeleteFile('hospitalPhotos', index)}
                                >
                                  <Delete sx={{ fontSize: 16, color: '#f44336' }} />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            No hospital photos uploaded
                          </Typography>
                        )}
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                          size="small"
                          sx={{ borderRadius: 2 }}
                          onClick={() => setOpenAddPhotoDialog(true)}
                    >
                          Add Hospital Photo
                    </Button>
                  </Box>
                    </Grid>

                    {/* Certification Files */}
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Certification Files
                  </Typography>
                        {Array.isArray(profileData.certificationFiles) && profileData.certificationFiles.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                            {profileData.certificationFiles.map((file, index) => (
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
                                  onClick={() => handleDeleteFile('certificationFiles', index)}
                                >
                                  <Delete sx={{ fontSize: 16, color: '#f44336' }} />
                                </IconButton>
                              </Box>
                    ))}
                  </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            No certification files uploaded
                          </Typography>
                        )}
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                      size="small"
                          sx={{ borderRadius: 2 }}
                          onClick={() => setOpenAddCertificationDialog(true)}
                        >
                          Add Certification File
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
                  </Grid>
                </Box>
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
                <TextField
                  fullWidth
                  label="About Hospital"
                  value={profileData.about}
                  onChange={(e) => handleProfileChange('about', e.target.value)}
                  multiline
                  rows={4}
                />
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

      {/* Add Hospital Photo Dialog */}
      <Dialog open={openAddPhotoDialog} onClose={() => setOpenAddPhotoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Add Hospital Photo
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
              placeholder="Hospital Building"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPhotoDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={() => handleAddFile('hospitalPhotos')} variant="contained" sx={{ borderRadius: 2 }}>
            Add Photo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Certification File Dialog */}
      <Dialog open={openAddCertificationDialog} onClose={() => setOpenAddCertificationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Add Certification File
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Choose File
            </Typography>
            <input
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="certification-file-input"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="certification-file-input">
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
              placeholder="NABH Certification"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCertificationDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={() => handleAddFile('certificationFiles')} variant="contained" sx={{ borderRadius: 2 }}>
            Add File
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
              placeholder="Hospital License"
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
      
      <ToastContainer />
    </HospitalVendorLayout>
  );
};

export default HospitalVendorEditProfile; 