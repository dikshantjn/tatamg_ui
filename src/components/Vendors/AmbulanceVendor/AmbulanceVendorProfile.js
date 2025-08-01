import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  LocationOn,
  Phone,
  Email,
  Language,
  Business,
  Person,
  DirectionsCar,
  GpsFixed,
  Schedule,
  Payment,
  PhotoCamera,
  ExpandMore,
  CheckCircle,
  Warning,
  Info,
  Star,
  MyLocation
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { getAmbulanceVendorProfile, updateAmbulanceVendorProfile } from '../../../services/Vendors/AmbulanceVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// File Names Form Component
const FileNamesForm = ({ files, onUpload, onCancel }) => {
  const theme = useTheme();
  const [fileNames, setFileNames] = useState({});
  const [uploading, setUploading] = useState(false);

  // Styled TextField component for consistent theming
  const StyledTextField = ({ ...props }) => (
    <TextField
      {...props}
      variant="outlined"
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#484F58' : '#E2E8F0',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#8B949E' : '#B1BAC4',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
          backgroundColor: theme.palette.mode === 'dark' ? '#21262D' : '#FFFFFF',
          color: theme.palette.text.primary,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.mode === 'dark' ? '#8B949E' : '#4A5568',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiInputBase-input': {
          color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input.Mui-disabled': {
          color: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
          WebkitTextFillColor: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
        },
        '& .MuiInputBase-input.Mui-disabled.MuiInputBase-inputMultiline': {
          color: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
          WebkitTextFillColor: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
        },
      }}
    />
  );

  useEffect(() => {
    // Initialize file names with original file names
    const initialNames = {};
    files.forEach(file => {
      initialNames[file.name] = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    });
    setFileNames(initialNames);
  }, [files]);

  const handleNameChange = (fileName, newName) => {
    setFileNames(prev => ({
      ...prev,
      [fileName]: newName
    }));
  };

  const handleSubmit = () => {
    setUploading(true);
    
    const filesWithNames = files.map(file => ({
      file: file,
      name: fileNames[file.name] || file.name
    }));
    
    onUpload(filesWithNames);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        {files.map((file, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              File: {file.name}
            </Typography>
            <StyledTextField
              fullWidth
              label="Enter custom name"
              value={fileNames[file.name] || ''}
              onChange={(e) => handleNameChange(file.name, e.target.value)}
              placeholder={`Enter name for ${file.name}`}
              size="small"
            />
          </Box>
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={16} /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Box>
    </Box>
  );
};

const AmbulanceVendorProfile = () => {
  const theme = useTheme();
  
  // Empty profile structure for initialization
  const emptyProfile = {
    id: '',
    vendorId: '',
    agencyName: '',
    gstNumber: '',
    panNumber: '',
    ownerName: '',
    registrationNumber: '',
    address: '',
    landmark: '',
    contactNumber: '',
    email: '',
    website: '',
    numOfAmbulances: '',
    driverKYC: false,
    driverTrained: false,
    ambulanceTypes: [],
    gpsTrackingAvailable: false,
    ambulanceEquipment: [],
    trainingCertifications: [],
    languageProficiency: [],
    operationalAreas: [],
    is24x7Available: false,
    distanceLimit: 0,
    isOnlinePaymentAvailable: false,
    officePhotos: [],
    preciseLocation: '',
    driverLicense: '',
    state: '',
    city: '',
    pinCode: ''
  };

  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState(emptyProfile);
  const [locationLoading, setLocationLoading] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadingOfficePhotos, setUploadingOfficePhotos] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadType, setUploadType] = useState('');
  
  // Use ref to track current editing state
  const editingRef = useRef(editing);

  // Styled TextField component for consistent theming
  const StyledTextField = ({ ...props }) => (
    <TextField
      {...props}
      variant="outlined"
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#484F58' : '#E2E8F0',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#8B949E' : '#B1BAC4',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
          backgroundColor: theme.palette.mode === 'dark' ? '#21262D' : '#FFFFFF',
          color: theme.palette.text.primary,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.mode === 'dark' ? '#8B949E' : '#4A5568',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiInputBase-input': {
          color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input.Mui-disabled': {
          color: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
          WebkitTextFillColor: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
        },
        '& .MuiInputBase-input.Mui-disabled.MuiInputBase-inputMultiline': {
          color: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
          WebkitTextFillColor: theme.palette.mode === 'dark' ? '#484F58' : '#A0AEC0',
        },
      }}
    />
  );

  // Styled FormControl component for Select fields
  const StyledFormControl = ({ children, ...props }) => (
    <FormControl
      {...props}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#484F58' : '#E2E8F0',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#8B949E' : '#B1BAC4',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
          backgroundColor: theme.palette.mode === 'dark' ? '#21262D' : '#FFFFFF',
          color: theme.palette.text.primary,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.mode === 'dark' ? '#8B949E' : '#4A5568',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiSelect-select': {
          color: theme.palette.text.primary,
        },
        '& .MuiSelect-icon': {
          color: theme.palette.mode === 'dark' ? '#8B949E' : '#4A5568',
        },
        '& .MuiChip-root': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }}
    >
      {children}
    </FormControl>
  );

  const ambulanceTypeOptions = [
    'Basic Life Support (BLS)',
    'Advanced Life Support (ALS)',
    'Neonatal Ambulance',
    'Air Ambulance',
    'Mortuary Van',
    'Cardiac Ambulance',
    'ICU Ambulance',
    'Emergency Response Vehicle'
  ];

  const stateOptions = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'West Bengal', 'Uttar Pradesh'
  ];

    // Update ref when editing state changes
  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('fetchProfile called, editing state:', editingRef.current);
      try {
        const authData = vendorAuthService.getVendorAuthData();
        console.log('Auth data:', authData);
        
        if (authData && authData.vendorData) {
          console.log('Vendor data:', authData.vendorData);
          let vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          
          // Use the correct vendor ID for testing
          if (!vendorId) {
            vendorId = 'b5fcf2c7-429b-4db8-9854-2916cdda0a4c';
            console.log('Vendor ID not found in auth data, using correct vendor ID:', vendorId);
          }
          
          console.log('Using vendor ID:', vendorId);
          
          if (vendorId) {
            console.log('Fetching profile for vendor ID:', vendorId);
            const profileData = await getAmbulanceVendorProfile(vendorId);
            console.log('Profile data received:', profileData);
            setProfile(profileData);
            // Don't update editedProfile if currently editing
            console.log('About to check editing state for setEditedProfile:', editingRef.current);
            if (!editingRef.current) {
              console.log('Setting editedProfile with fetched data');
              setEditedProfile(profileData);
            } else {
              console.log('Skipping setEditedProfile because currently editing');
            }
          } else {
            console.warn('Vendor ID not found, using empty profile');
            setProfile(emptyProfile);
            if (!editingRef.current) {
              setEditedProfile(emptyProfile);
            }
          }
        } else {
          console.warn('No vendor auth data found, using empty profile');
          setProfile(emptyProfile);
          if (!editingRef.current) {
            setEditedProfile(emptyProfile);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        // Check if it's a 404 error (profile doesn't exist yet)
        if (error.response && error.response.status === 404) {
          console.log('Profile not found (404), using empty profile');
          setProfile(emptyProfile);
          if (!editingRef.current) {
            setEditedProfile(emptyProfile);
          }
        } else {
          // Only show error toast for non-404 errors
          setTimeout(() => {
            toast.error('Failed to load profile data. Using empty profile.');
          }, 100);
          setProfile(emptyProfile);
          if (!editingRef.current) {
            setEditedProfile(emptyProfile);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Keep empty dependencies to prevent infinite loops

  const handleEdit = () => {
    setEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const authData = vendorAuthService.getVendorAuthData();
      let vendorId = authData?.vendorData?.vendorId || authData?.vendorData?.id;
      
      // Use the correct vendor ID for testing
      if (!vendorId) {
        vendorId = 'b5fcf2c7-429b-4db8-9854-2916cdda0a4c';
        console.log('Vendor ID not found in auth data for update, using correct vendor ID:', vendorId);
      }
      
      if (!vendorId) {
        setTimeout(() => {
          toast.dismiss(); // Dismiss any existing toasts
          toast.error('Vendor ID not found. Please try again.');
        }, 200);
        return;
      }

      // Prepare profile data for update
      const profileDataToUpdate = { ...editedProfile };
      
      // Handle file uploads if there are new files
      if (editedProfile.trainingCertifications) {
        const newCertFiles = editedProfile.trainingCertifications.filter(cert => cert.file);
        if (newCertFiles.length > 0) {
          // Upload new certification files
          const certFormData = new FormData();
          newCertFiles.forEach((cert, index) => {
            certFormData.append('files', cert.file);
            certFormData.append('names', cert.name);
          });
          
          // Here you would call your file upload API
          // For now, we'll simulate the upload and update URLs
          const uploadedCerts = newCertFiles.map(cert => ({
            url: `https://firebasestorage.googleapis.com/v0/b/vedikahealthcare-59980.firebasestorage.app/o/ambulance_agency%2Ftraining_certification%2F${cert.name}_${Date.now()}.jpg?alt=media&token=simulated`,
            name: cert.name
          }));
          
          // Replace temporary files with uploaded URLs
          profileDataToUpdate.trainingCertifications = [
            ...(editedProfile.trainingCertifications.filter(cert => !cert.file)), // Keep existing files
            ...uploadedCerts // Add newly uploaded files
          ];
        }
      }
      
      if (editedProfile.officePhotos) {
        const newPhotoFiles = editedProfile.officePhotos.filter(photo => photo.file);
        if (newPhotoFiles.length > 0) {
          // Upload new office photo files
          const photoFormData = new FormData();
          newPhotoFiles.forEach((photo, index) => {
            photoFormData.append('files', photo.file);
            photoFormData.append('names', photo.name);
          });
          
          // Here you would call your file upload API
          // For now, we'll simulate the upload and update URLs
          const uploadedPhotos = newPhotoFiles.map(photo => ({
            url: `https://firebasestorage.googleapis.com/v0/b/vedikahealthcare-59980.firebasestorage.app/o/ambulance_agency%2F${vendorId}%2FofficePhotos%2F${photo.name}_${Date.now()}.jpg?alt=media&token=simulated`,
            name: photo.name
          }));
          
          // Replace temporary files with uploaded URLs
          profileDataToUpdate.officePhotos = [
            ...(editedProfile.officePhotos.filter(photo => !photo.file)), // Keep existing files
            ...uploadedPhotos // Add newly uploaded files
          ];
        }
      }

      console.log('Updating profile for vendor ID:', vendorId);
      const response = await updateAmbulanceVendorProfile(vendorId, profileDataToUpdate);
      
      setProfile(response);
      setEditedProfile(response);
      setEditing(false);
      
      setTimeout(() => {
        toast.dismiss(); // Dismiss any existing toasts
        toast.success('Profile updated successfully!');
      }, 200);
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Check if it's a 404 error (profile doesn't exist yet)
      if (error.response && error.response.status === 404) {
        setTimeout(() => {
          toast.dismiss(); // Dismiss any existing toasts
          toast.error('Profile not found. Please create a profile first.');
        }, 200);
      } else {
        setTimeout(() => {
          toast.dismiss(); // Dismiss any existing toasts
          toast.error('Failed to update profile. Please try again.');
        }, 200);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log('handleInputChange called:', field, value);
    console.log('Current editing state:', editing);
    setEditedProfile(prev => {
      console.log('Previous editedProfile:', prev);
      const newProfile = {
        ...prev,
        [field]: value
      };
      console.log('New editedProfile:', newProfile);
      return newProfile;
    });
  };

  const handleAmbulanceTypesChange = (event) => {
    const value = event.target.value;
    setEditedProfile(prev => ({
      ...prev,
      ambulanceTypes: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const getStatusColor = (value) => {
    // Handle both boolean and string values
    if (typeof value === 'boolean') {
      return value ? 'success' : 'error';
    }
    return value === '1' || value === true ? 'success' : 'error';
  };

  const getStatusText = (value) => {
    // Handle both boolean and string values
    if (typeof value === 'boolean') {
      return value ? 'Available' : 'Not Available';
    }
    return value === '1' || value === true ? 'Available' : 'Not Available';
  };

  // Location handling functions
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const handleGetCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { latitude, longitude } = await getCurrentLocation();
      const locationString = `${latitude}, ${longitude}`;
      
      setEditedProfile(prev => ({
        ...prev,
        preciseLocation: locationString
      }));
      
      // Use setTimeout to avoid toast conflicts
      setTimeout(() => {
        toast.dismiss(); // Dismiss any existing toasts
        toast.success('Current location updated successfully!');
      }, 200);
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Use setTimeout to avoid toast conflicts
      setTimeout(() => {
        toast.dismiss(); // Dismiss any existing toasts
        if (error.code === 1) {
          toast.error('Location permission denied. Please enable location access.');
        } else if (error.code === 2) {
          toast.error('Location unavailable. Please try again.');
        } else if (error.code === 3) {
          toast.error('Location request timed out. Please try again.');
        } else {
          toast.error('Failed to get current location. Please try again.');
        }
      }, 200);
    } finally {
      setLocationLoading(false);
    }
  };



  // File upload handling
  const handleFileSelect = (event, type) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);
    setUploadType(type);
    setShowNameDialog(true);
  };

  const handleFileUpload = (filesWithNames) => {
    setUploadingCert(true);
    
    // Create local file objects with temporary URLs and custom names
    const uploadedFiles = filesWithNames.map(fileData => ({
      url: URL.createObjectURL(fileData.file), // Temporary URL for preview
      name: fileData.name, // Custom name entered by user
      file: fileData.file // Keep the actual file for later upload
    }));

    if (uploadType === 'trainingCertifications') {
      setEditedProfile(prev => ({
        ...prev,
        trainingCertifications: [...(prev.trainingCertifications || []), ...uploadedFiles]
      }));
    } else if (uploadType === 'officePhotos') {
      setEditedProfile(prev => ({
        ...prev,
        officePhotos: [...(prev.officePhotos || []), ...uploadedFiles]
      }));
    }

    setUploadingCert(false);
    setShowNameDialog(false);
    setSelectedFiles([]);
    setUploadType('');
    
    // Use setTimeout to avoid toast conflicts
    setTimeout(() => {
      toast.dismiss(); // Dismiss any existing toasts
      toast.success(`${filesWithNames.length} file(s) added successfully!`);
    }, 200);
  };

  const handleCancelUpload = () => {
    setShowNameDialog(false);
    setSelectedFiles([]);
    setUploadType('');
  };

  const handleRemoveCertification = (index) => {
    setEditedProfile(prev => ({
      ...prev,
      trainingCertifications: (prev.trainingCertifications || []).filter((_, i) => i !== index)
    }));
    
    // Use setTimeout to avoid toast conflicts
    setTimeout(() => {
      toast.dismiss(); // Dismiss any existing toasts
      toast.success('Certification removed successfully!');
    }, 200);
  };

  const handleRemoveOfficePhoto = (index) => {
    setEditedProfile(prev => ({
      ...prev,
      officePhotos: (prev.officePhotos || []).filter((_, i) => i !== index)
    }));
    
    // Use setTimeout to avoid toast conflicts
    setTimeout(() => {
      toast.dismiss(); // Dismiss any existing toasts
      toast.success('Office photo removed successfully!');
    }, 200);
  };

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3 }, py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Agency Profile
          </Typography>
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ borderRadius: 2 }}
            >
              Edit Profile
            </Button>
          ) : (
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
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{ borderRadius: 2 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>

                 <Grid container spacing={3}>
           {/* Basic Information */}
           <Grid item xs={12}>
             <Card sx={{ 
               mb: 3, 
               borderRadius: 3,
               backgroundColor: theme.palette.background.card,
               border: `1px solid ${theme.palette.divider}`,
               boxShadow: theme.shadows[2]
             }}>
               <CardContent sx={{ p: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Business color="primary" />
                   Basic Information
                 </Typography>
                 
                 <Grid container spacing={3}>
                   <Grid item xs={12} sm={6}>
                                          <StyledTextField
                        fullWidth
                        label="Agency Name"
                        value={editing ? editedProfile.agencyName : profile.agencyName}
                        onChange={(e) => handleInputChange('agencyName', e.target.value)}
                        disabled={!editing}
                      />
                   </Grid>
                                      <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Owner Name"
                        value={editing ? editedProfile.ownerName : profile.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="GST Number"
                        value={editing ? editedProfile.gstNumber : profile.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="PAN Number"
                        value={editing ? editedProfile.panNumber : profile.panNumber}
                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Registration Number"
                        value={editing ? editedProfile.registrationNumber : profile.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Driver License"
                        value={editing ? editedProfile.driverLicense : profile.driverLicense}
                        onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                 </Grid>
               </CardContent>
             </Card>

             {/* Contact Information */}
             <Card sx={{ 
               mb: 3, 
               borderRadius: 3,
               backgroundColor: theme.palette.background.card,
               border: `1px solid ${theme.palette.divider}`,
               boxShadow: theme.shadows[2]
             }}>
               <CardContent sx={{ p: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Phone color="primary" />
                   Contact Information
                 </Typography>
                 
                                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Contact Number"
                        value={editing ? editedProfile.contactNumber : profile.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        value={editing ? editedProfile.email : profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Website"
                        value={editing ? editedProfile.website : profile.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Number of Ambulances"
                        value={editing ? editedProfile.numOfAmbulances : profile.numOfAmbulances}
                        onChange={(e) => handleInputChange('numOfAmbulances', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                  </Grid>
               </CardContent>
             </Card>

             {/* Address Information */}
             <Card sx={{ 
               mb: 3, 
               borderRadius: 3,
               backgroundColor: theme.palette.background.card,
               border: `1px solid ${theme.palette.divider}`,
               boxShadow: theme.shadows[2]
             }}>
               <CardContent sx={{ p: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <LocationOn color="primary" />
                   Address Information
                 </Typography>
                 
                                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Address"
                        value={editing ? editedProfile.address : profile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!editing}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Landmark"
                        value={editing ? editedProfile.landmark : profile.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="City"
                        value={editing ? editedProfile.city : profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledFormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          value={editing ? editedProfile.state : profile.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          disabled={!editing}
                          label="State"
                        >
                          {stateOptions.map((state) => (
                            <MenuItem key={state} value={state}>{state}</MenuItem>
                          ))}
                        </Select>
                      </StyledFormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="PIN Code"
                        value={editing ? editedProfile.pinCode : profile.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        disabled={!editing}
                      />
                    </Grid>
                  </Grid>
               </CardContent>
             </Card>

             {/* Ambulance Services */}
             <Card sx={{ 
               mb: 3, 
               borderRadius: 3,
               backgroundColor: theme.palette.background.card,
               border: `1px solid ${theme.palette.divider}`,
               boxShadow: theme.shadows[2]
             }}>
               <CardContent sx={{ p: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <DirectionsCar color="primary" />
                   Ambulance Services
                 </Typography>
                 
                                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledFormControl fullWidth>
                        <InputLabel>Ambulance Types</InputLabel>
                        <Select
                          multiple
                          value={editing ? (editedProfile.ambulanceTypes || []) : (profile.ambulanceTypes || [])}
                          onChange={handleAmbulanceTypesChange}
                          disabled={!editing}
                          input={<OutlinedInput label="Ambulance Types" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {(selected || []).map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                        >
                          {ambulanceTypeOptions.map((type) => (
                            <MenuItem key={type} value={type}>
                              <Checkbox checked={(editing ? (editedProfile.ambulanceTypes || []) : (profile.ambulanceTypes || [])).indexOf(type) > -1} />
                              <ListItemText primary={type} />
                            </MenuItem>
                          ))}
                        </Select>
                      </StyledFormControl>
                    </Grid>
                  </Grid>
               </CardContent>
             </Card>

             {/* Agency Status */}
             <Card sx={{ 
               mb: 3, 
               borderRadius: 3,
               backgroundColor: theme.palette.background.card,
               border: `1px solid ${theme.palette.divider}`,
               boxShadow: theme.shadows[2]
             }}>
               <CardContent sx={{ p: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <CheckCircle color="primary" />
                   Agency Status
                 </Typography>
                 
                 <Grid container spacing={3}>
                                       <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, gap: 2 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>24x7 Available</Typography>
                        {editing ? (
                          <Switch
                            checked={editedProfile.is24x7Available === true || editedProfile.is24x7Available === '1'}
                            onChange={(e) => handleInputChange('is24x7Available', e.target.checked)}
                            color="primary"
                          />
                        ) : (
                          <Chip 
                            label={getStatusText(profile.is24x7Available)}
                            color={getStatusColor(profile.is24x7Available)}
                            size="small"
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, gap: 2 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>GPS Tracking</Typography>
                        {editing ? (
                          <Switch
                            checked={editedProfile.gpsTrackingAvailable === true || editedProfile.gpsTrackingAvailable === '1'}
                            onChange={(e) => handleInputChange('gpsTrackingAvailable', e.target.checked)}
                            color="primary"
                          />
                        ) : (
                          <Chip 
                            label={getStatusText(profile.gpsTrackingAvailable)}
                            color={getStatusColor(profile.gpsTrackingAvailable)}
                            size="small"
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, gap: 2 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>Online Payment</Typography>
                        {editing ? (
                          <Switch
                            checked={editedProfile.isOnlinePaymentAvailable === true || editedProfile.isOnlinePaymentAvailable === '1'}
                            onChange={(e) => handleInputChange('isOnlinePaymentAvailable', e.target.checked)}
                            color="primary"
                          />
                        ) : (
                          <Chip 
                            label={getStatusText(profile.isOnlinePaymentAvailable)}
                            color={getStatusColor(profile.isOnlinePaymentAvailable)}
                            size="small"
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, gap: 2 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>Driver KYC</Typography>
                        {editing ? (
                          <Switch
                            checked={editedProfile.driverKYC === true || editedProfile.driverKYC === '1'}
                            onChange={(e) => handleInputChange('driverKYC', e.target.checked)}
                            color="primary"
                          />
                        ) : (
                          <Chip 
                            label={getStatusText(profile.driverKYC)}
                            color={getStatusColor(profile.driverKYC)}
                            size="small"
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, gap: 2 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>Driver Trained</Typography>
                        {editing ? (
                          <Switch
                            checked={editedProfile.driverTrained === true || editedProfile.driverTrained === '1'}
                            onChange={(e) => handleInputChange('driverTrained', e.target.checked)}
                            color="primary"
                          />
                        ) : (
                          <Chip 
                            label={getStatusText(profile.driverTrained)}
                            color={getStatusColor(profile.driverTrained)}
                            size="small"
                          />
                        )}
                      </Box>
                    </Grid>
                 </Grid>
               </CardContent>
             </Card>

             {/* Location Map */}
             <Card sx={{ 
               mb: 3, 
               borderRadius: 3,
               backgroundColor: theme.palette.background.card,
               border: `1px solid ${theme.palette.divider}`,
               boxShadow: theme.shadows[2]
             }}>
               <CardContent sx={{ p: 3 }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <LocationOn color="primary" />
                   Location
                 </Typography>
                 
                 <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                     <Box sx={{ mb: 2 }}>
                       <StyledTextField
                         fullWidth
                         label="Precise Location (Lat, Lng)"
                         value={editing ? editedProfile.preciseLocation : profile.preciseLocation}
                         onChange={(e) => handleInputChange('preciseLocation', e.target.value)}
                         disabled={!editing}
                         placeholder="18.488856, 73.8674729"
                       />
                     </Box>
                     
                     {editing && (
                       <Button
                         variant="outlined"
                         fullWidth
                         startIcon={locationLoading ? <CircularProgress size={16} /> : <MyLocation />}
                         onClick={handleGetCurrentLocation}
                         disabled={locationLoading}
                         sx={{ mb: 2, borderRadius: 2 }}
                       >
                         {locationLoading ? 'Getting Location...' : 'Get Current Location'}
                       </Button>
                     )}
                   </Grid>
                   
                   <Grid item xs={12} md={6}>
                     {/* Map Display */}
                     <Box sx={{ 
                       width: '100%', 
                       height: 200, 
                       backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f7fafc',
                       border: `1px solid ${theme.palette.divider}`,
                       borderRadius: 2,
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       position: 'relative',
                       overflow: 'hidden'
                     }}>
                       {profile.preciseLocation ? (
                         <Box sx={{ 
                           width: '100%', 
                           height: '100%', 
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           flexDirection: 'column',
                           gap: 1
                         }}>
                           <LocationOn sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                           <Typography variant="body2" color="text.secondary" textAlign="center">
                             {profile.preciseLocation}
                           </Typography>
                           <Typography variant="caption" color="text.secondary" textAlign="center">
                             Map integration would show here
                           </Typography>
                         </Box>
                       ) : (
                         <Box sx={{ 
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           flexDirection: 'column',
                           gap: 1
                         }}>
                           <LocationOn sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
                           <Typography variant="body2" color="text.secondary">
                             No location set
                           </Typography>
                         </Box>
                       )}
                     </Box>
                   </Grid>
                 </Grid>
               </CardContent>
             </Card>
           </Grid>
         </Grid>

                                   {/* Training Certifications */}
          <Card sx={{ 
            mt: 3, 
            borderRadius: 3,
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoCamera color="primary" />
                  Training Certifications
                </Typography>
                
                {editing && (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={uploadingCert ? <CircularProgress size={16} /> : <PhotoCamera />}
                    disabled={uploadingCert}
                    sx={{ borderRadius: 2 }}
                  >
                    {uploadingCert ? 'Uploading...' : 'Upload Certificates'}
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => handleFileSelect(e, 'trainingCertifications')}
                    />
                  </Button>
                )}
              </Box>

              {editing ? (
                // Edit mode - show current certificates with remove option
                <Grid container spacing={2}>
                  {editedProfile.trainingCertifications && editedProfile.trainingCertifications.map((cert, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            }
                          }}
                          onClick={() => handleRemoveCertification(index)}
                          size="small"
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                        
                        {cert.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img 
                            src={cert.url} 
                            alt={cert.name}
                            style={{ 
                              width: '100%', 
                              height: 150, 
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                        ) : (
                          <Box sx={{ 
                            width: '100%', 
                            height: 150, 
                            backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f7fafc',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 1
                          }}>
                            <PhotoCamera sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
                            <Typography variant="body2" color="text.secondary">
                              {cert.name}
                            </Typography>
                          </Box>
                        )}
                        
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                          {cert.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                  
                  {(!editedProfile.trainingCertifications || editedProfile.trainingCertifications.length === 0) && (
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc'
                      }}>
                        <PhotoCamera sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          No training certificates uploaded
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Upload certificates to showcase your training and qualifications
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                // View mode - show certificates
                <Grid container spacing={2}>
                  {profile.trainingCertifications && profile.trainingCertifications.length > 0 ? (
                    profile.trainingCertifications.map((cert, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          {cert.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img 
                              src={cert.url} 
                              alt={cert.name}
                              style={{ 
                                width: '100%', 
                                height: 150, 
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                            />
                          ) : (
                            <Box sx={{ 
                              width: '100%', 
                              height: 150, 
                              backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f7fafc',
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              gap: 1
                            }}>
                              <PhotoCamera sx={{ fontSize: 40, color: theme.palette.text.disabled }} />
                              <Typography variant="body2" color="text.secondary">
                                {cert.name}
                              </Typography>
                            </Box>
                          )}
                          
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                            {cert.name}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc'
                      }}>
                        <PhotoCamera sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          No training certificates available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Training certificates will be displayed here
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>

                                   {/* Office Photos */}
          <Card sx={{ 
            mt: 3, 
            borderRadius: 3,
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoCamera color="primary" />
                  Office Photos
                </Typography>
                
                {editing && (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={uploadingOfficePhotos ? <CircularProgress size={16} /> : <PhotoCamera />}
                    disabled={uploadingOfficePhotos}
                    sx={{ borderRadius: 2 }}
                  >
                    {uploadingOfficePhotos ? 'Uploading...' : 'Upload Photos'}
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'officePhotos')}
                    />
                  </Button>
                )}
              </Box>

              {editing ? (
                // Edit mode - show current photos with remove option
                <Grid container spacing={2}>
                  {editedProfile.officePhotos && editedProfile.officePhotos.map((photo, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            }
                          }}
                          onClick={() => handleRemoveOfficePhoto(index)}
                          size="small"
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                        
                        <img 
                          src={photo.url} 
                          alt={photo.name}
                          style={{ 
                            width: '100%', 
                            height: 150, 
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                        
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                          {photo.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                  
                  {(!editedProfile.officePhotos || editedProfile.officePhotos.length === 0) && (
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc'
                      }}>
                        <PhotoCamera sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          No office photos uploaded
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Upload photos to showcase your office and facilities
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                // View mode - show photos
                <Grid container spacing={2}>
                  {profile.officePhotos && profile.officePhotos.length > 0 ? (
                    profile.officePhotos.map((photo, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <img 
                            src={photo.url} 
                            alt={photo.name}
                            style={{ 
                              width: '100%', 
                              height: 150, 
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                            {photo.name}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a202c' : '#f7fafc'
                      }}>
                        <PhotoCamera sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          No office photos available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Office photos will be displayed here
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
      </Box>
      
             {/* File Name Dialog */}
       <Dialog 
         open={showNameDialog} 
         onClose={handleCancelUpload}
         maxWidth="sm"
         fullWidth
       >
         <DialogTitle>
           <Typography variant="h6" sx={{ fontWeight: 600 }}>
             Enter File Names
           </Typography>
         </DialogTitle>
         <DialogContent>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
             Please enter custom names for your uploaded files:
           </Typography>
           <FileNamesForm 
             files={selectedFiles}
             onUpload={handleFileUpload}
             onCancel={handleCancelUpload}
           />
         </DialogContent>
       </Dialog>

               <ToastContainer 
          position="top-right" 
          autoClose={5000} 
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="colored"
          limit={1}
          newestOnTop={true}
          rtl={false}
          enableMultiContainer={false}
        />
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorProfile; 