import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  IconButton,
  Stack,
  Divider,
  Paper,
  InputAdornment,
  MenuItem,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import ProductVendorLayout from './ProductVendorLayout';
import { getProductPartnerProfile, updateProductPartnerProfile } from '../../../services/Vendors/product-partner.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { toast } from 'react-toastify';

// ImageWithFallback Component
const ImageWithFallback = ({ src, alt, fallbackText, sx, size = 'medium', ...props }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleImageError = () => {
    setImageError(true);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 50, height: 50 };
      case 'medium':
        return { width: 60, height: 60 };
      case 'large':
        return { width: 110, height: 110 };
      default:
        return { width: 60, height: 60 };
    }
  };

  if (imageError) {
    return (
      <Box
        sx={{
          ...getSizeStyles(),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: size === 'large' ? '50%' : 6,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
          ...sx
        }}
        {...props}
      >
        <ImageIcon sx={{ fontSize: size === 'large' ? 32 : 20, mb: size === 'large' ? 1 : 0, opacity: 0.6 }} />
        {size === 'large' && (
          <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.7 }}>
            {fallbackText || 'No Image'}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={handleImageError}
      sx={{
        ...getSizeStyles(),
        objectFit: 'cover',
        borderRadius: size === 'large' ? '50%' : 6,
        ...sx
      }}
      {...props}
    />
  );
};

const stateOptions = ['Maharashtra', 'Gujarat', 'Delhi', 'Karnataka'];
const cityOptions = {
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Gujarat: ['Ahmedabad', 'Surat'],
  Delhi: ['New Delhi'],
  Karnataka: ['Bangalore'],
};

const initialProfile = {
  profilePicture: '',
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  companyLegalName: '',
  brandName: '',
  gstNumber: '',
  bankAccountNumber: '',
  panCardNumber: '',
  licenseDetails: [],
  state: '',
  city: '',
  pincode: '',
  location: '',
  photos: [],
  documents: [],
};

const ProductPartnerVendorProfileContent = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const authData = vendorAuthService.getVendorAuthData();
        const vendorId = authData?.vendorData?.vendorId;
        if (vendorId) {
          const data = await getProductPartnerProfile(vendorId);
          // Map backend fields to UI state
          setProfile({
            profilePicture: data.profilePicture || '',
            name: data.brandName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            companyLegalName: data.companyLegalName || '',
            brandName: data.brandName || '',
            gstNumber: data.gstNumber || '',
            bankAccountNumber: data.bankAccountNumber || '',
            panCardNumber: data.panCardNumber || '',
            licenseDetails: Array.isArray(data.licenseDetails) ? data.licenseDetails : [],
            state: data.state || '',
            city: data.city || '',
            pincode: data.pincode || '',
            location: data.location || '',
            photos: [], // Placeholder for future photo uploads
            documents: [], // Placeholder for additional documents
          });
        }
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle edit/save/cancel
  const handleEdit = () => {
    setEditedProfile(profile);
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
    setEditedProfile(profile);
    setProfilePicFile(null);
    setLicenseFile(null);
    setPhotoFiles([]);
  };
  // In handleSave, update licenseDetails as an array
  const handleSave = async () => {
    try {
      setSaving(true);
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId;
      
      if (!vendorId) {
        console.error('No vendor ID found');
        toast.error('Authentication error. Please login again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Prepare the data for API update
      const updateData = {
        companyLegalName: editedProfile.companyLegalName,
        brandName: editedProfile.brandName,
        gstNumber: editedProfile.gstNumber,
        panCardNumber: editedProfile.panCardNumber,
        licenseDetails: editedProfile.licenseDetails.map(license => ({
          name: license.name || '',
          expiry: license.expiry || '',
          number: license.number || '',
          filePath: license.file || license.image || ''
        })),
        address: editedProfile.address,
        pincode: editedProfile.pincode,
        city: editedProfile.city,
        state: editedProfile.state,
        email: editedProfile.email,
        bankAccountNumber: editedProfile.bankAccountNumber,
        profilePicture: editedProfile.profilePicture,
        location: editedProfile.location,
        phoneNumber: editedProfile.phoneNumber
      };

      // Call the update API
      const response = await updateProductPartnerProfile(vendorId, updateData);
      
      // Update local state with the response data
      if (response.productPartner) {
        setProfile({
          profilePicture: response.productPartner.profilePicture || '',
          name: response.productPartner.brandName || '',
          email: response.productPartner.email || '',
          phoneNumber: response.productPartner.phoneNumber || '',
          address: response.productPartner.address || '',
          companyLegalName: response.productPartner.companyLegalName || '',
          brandName: response.productPartner.brandName || '',
          gstNumber: response.productPartner.gstNumber || '',
          bankAccountNumber: response.productPartner.bankAccountNumber || '',
          panCardNumber: response.productPartner.panCardNumber || '',
          licenseDetails: Array.isArray(response.productPartner.licenseDetails) ? response.productPartner.licenseDetails : [],
          state: response.productPartner.state || '',
          city: response.productPartner.city || '',
          pincode: response.productPartner.pincode || '',
          location: response.productPartner.location || '',
          photos: profile.photos, // Keep existing photos
          documents: profile.documents, // Keep existing documents
        });
      }

    setEditMode(false);
    setProfilePicFile(null);
    setLicenseFile(null);
      setPhotoFiles([]);
      
      // Show success toast notification
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Show error toast notification
      toast.error('Failed to update profile. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Handlers for fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleLicenseChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      licenseDetails: [
        {
          ...(prev.licenseDetails?.[0] || {}),
          [name]: value,
        },
        ...(prev.licenseDetails?.slice(1) || [])
      ],
    }));
  };
  const handleProfilePicUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
      setEditedProfile((prev) => ({ ...prev, profilePicture: URL.createObjectURL(e.target.files[0]) }));
    }
  };
  const handleLicenseFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
      setEditedProfile((prev) => ({
        ...prev,
        licenseDetails: [
          {
            ...(prev.licenseDetails?.[0] || {}),
          file: URL.createObjectURL(e.target.files[0]),
          image: e.target.files[0].type.startsWith('image') ? URL.createObjectURL(e.target.files[0]) : '',
        },
          ...(prev.licenseDetails?.slice(1) || [])
        ],
      }));
    }
  };
  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFiles(Array.from(e.target.files));
    }
  };
  const handleStateChange = (e) => {
    setEditedProfile((prev) => ({ ...prev, state: e.target.value, city: cityOptions[e.target.value][0] }));
  };
  const handleCityChange = (e) => {
    setEditedProfile((prev) => ({ ...prev, city: e.target.value }));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><Typography>Loading profile...</Typography></Box>;
  }

  return (
    <ProductVendorLayout title="Profile">
      <Box 
        sx={{ 
          width: '100%', 
          maxWidth: 900, 
          mx: 'auto', 
          p: { xs: 1, sm: 3 },
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      >
        {/* Profile Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4, p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <ImageWithFallback
                src={editMode ? editedProfile?.profilePicture : profile?.profilePicture}
                alt={profile?.brandName || ''}
                fallbackText="No Image"
                size="large"
                sx={{ border: `3px solid ${theme.palette.background.paper}`, boxShadow: '0 2px 12px #e0e7ff' }}
              />
              {editMode && (
                <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#fff', boxShadow: 1 }}>
                  <UploadFileIcon color="primary" />
                  <input type="file" accept="image/*" hidden onChange={handleProfilePicUpload} />
                </IconButton>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                {editMode ? (
                  <TextField name="brandName" value={editedProfile?.brandName || ''} onChange={handleChange} variant="standard" sx={{ fontWeight: 700 }} />
                ) : (
                  profile?.brandName || ''
                )}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                {profile?.email || ''}
              </Typography>
            </Box>
            <Box>
              {!editMode ? (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit} sx={{ borderRadius: 2, fontWeight: 600 }}>
                  Edit
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    color="success" 
                    onClick={handleSave} 
                    disabled={saving}
                    startIcon={saving ? (
                      <Box sx={{ width: 16, height: 16, border: '2px solid currentColor', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <SaveIcon />
                    )}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={handleCancel} 
                    disabled={saving}
                    startIcon={<CancelIcon />}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </Card>

        {/* Basic Info */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            Basic Info
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={profile?.email || ''}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={editMode ? editedProfile?.phoneNumber : profile?.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={editMode ? editedProfile?.address : profile?.address}
                onChange={handleChange}
                fullWidth
                margin="dense"
                multiline
                minRows={2}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Business Details */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            Business Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Legal Name"
                name="companyLegalName"
                value={editMode ? editedProfile?.companyLegalName : profile?.companyLegalName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand Name"
                name="brandName"
                value={editMode ? editedProfile?.brandName : profile?.brandName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="GST Number"
                name="gstNumber"
                value={editMode ? editedProfile?.gstNumber : profile?.gstNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PAN Card Number"
                name="panCardNumber"
                value={editMode ? editedProfile?.panCardNumber : profile?.panCardNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bank Account Number"
                name="bankAccountNumber"
                value={editMode ? editedProfile?.bankAccountNumber : profile?.bankAccountNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
                type="number"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* License Details */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              License Details
            </Typography>
            {editMode && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditedProfile(prev => ({
                    ...prev,
                    licenseDetails: [...(prev.licenseDetails || []), { name: '', number: '', expiry: '', file: '', image: '' }]
                  }));
                }}
                sx={{ borderRadius: 2 }}
              >
                Add License
              </Button>
            )}
          </Box>
          
          {(editMode ? editedProfile?.licenseDetails : profile?.licenseDetails)?.map((license, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, backgroundColor: isDarkMode ? 'rgba(139,104,255,0.02)' : '#FAFBFC' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  License {index + 1}
                </Typography>
                {editMode && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => {
                      setEditedProfile(prev => ({
                        ...prev,
                        licenseDetails: prev.licenseDetails.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="License Name"
                    name="name"
                    value={editMode ? editedProfile?.licenseDetails?.[index]?.name : profile?.licenseDetails?.[index]?.name}
                    onChange={(e) => {
                      const { value } = e.target;
                      setEditedProfile(prev => ({
                        ...prev,
                        licenseDetails: prev.licenseDetails.map((license, i) => 
                          i === index ? { ...license, name: value } : license
                        )
                      }));
                    }}
                    fullWidth
                    margin="dense"
                    InputProps={{ readOnly: !editMode }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="License Number"
                    name="number"
                    value={editMode ? editedProfile?.licenseDetails?.[index]?.number : profile?.licenseDetails?.[index]?.number}
                    onChange={(e) => {
                      const { value } = e.target;
                      setEditedProfile(prev => ({
                        ...prev,
                        licenseDetails: prev.licenseDetails.map((license, i) => 
                          i === index ? { ...license, number: value } : license
                        )
                      }));
                    }}
                    fullWidth
                    margin="dense"
                    InputProps={{ readOnly: !editMode }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Expiry Date"
                    name="expiry"
                    value={editMode ? editedProfile?.licenseDetails?.[index]?.expiry : profile?.licenseDetails?.[index]?.expiry}
                    onChange={(e) => {
                      const { value } = e.target;
                      setEditedProfile(prev => ({
                        ...prev,
                        licenseDetails: prev.licenseDetails.map((license, i) => 
                          i === index ? { ...license, expiry: value } : license
                        )
                      }));
                    }}
                    fullWidth
                    margin="dense"
                    InputProps={{ readOnly: !editMode }}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 1.5, minWidth: 120, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? 'rgba(139,104,255,0.04)' : '#F7F8FA' }}>
                      {((editMode ? editedProfile?.licenseDetails?.[index]?.image : profile?.licenseDetails?.[index]?.image)) ? (
                        <ImageWithFallback
                          src={editMode ? editedProfile?.licenseDetails?.[index]?.image : profile?.licenseDetails?.[index]?.image}
                          alt="License"
                          fallbackText="No Image"
                          size="medium"
                        />
                      ) : ((editMode ? editedProfile?.licenseDetails?.[index]?.file : profile?.licenseDetails?.[index]?.file)) ? (
                        <InsertDriveFileIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                      ) : (
                        <Typography variant="caption" color={theme.palette.text.secondary}>No file</Typography>
                      )}
                      <Typography variant="caption" color={theme.palette.text.secondary} mt={1}>
                        {((editMode ? editedProfile?.licenseDetails?.[index]?.file : profile?.licenseDetails?.[index]?.file)) ? 'License File' : 'No file uploaded'}
                      </Typography>
                    </Box>
                    {editMode && (
                      <Button 
                        component="label" 
                        variant="outlined" 
                        startIcon={<UploadFileIcon />} 
                        sx={{ borderRadius: 2 }}

                      >
                        Upload
                        <input 
                          type="file" 
                          accept="image/*,.pdf" 
                          hidden 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setEditedProfile(prev => ({
                                ...prev,
                                licenseDetails: prev.licenseDetails.map((license, i) => 
                                  i === index ? {
                                    ...license,
                                    file: URL.createObjectURL(file),
                                    image: file.type.startsWith('image') ? URL.createObjectURL(file) : license.image,
                                  } : license
                                )
                              }));
                            }
                          }} 
                        />
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
          
          {(!editMode ? profile?.licenseDetails : editedProfile?.licenseDetails)?.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3, color: theme.palette.text.secondary }}>
              <Typography variant="body2">No licenses added yet</Typography>
            </Box>
          )}
        </Paper>

        {/* Location */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            Location
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="State"
                name="state"
                value={editMode ? editedProfile?.state : profile?.state}
                onChange={handleStateChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              >
                {stateOptions.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="City"
                name="city"
                value={editMode ? editedProfile?.city : profile?.city}
                onChange={handleCityChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              >
                {(cityOptions[editMode ? editedProfile?.state : profile?.state] || []).map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Pincode"
                name="pincode"
                value={editMode ? editedProfile?.pincode : profile?.pincode}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Documents & Photos */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Documents & Photos
            </Typography>
            {editMode && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditedProfile(prev => ({
                    ...prev,
                    photos: [...(prev.photos || []), { name: '', url: '' }]
                  }));
                }}
                sx={{ borderRadius: 2 }}
              >
                Add Document
              </Button>
            )}
          </Box>
          
          <Grid container spacing={3}>
            {/* Additional Documents */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                Additional Documents
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(editMode ? editedProfile?.documents : profile?.documents)?.map((doc, index) => (
                  <Box key={index} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2, backgroundColor: isDarkMode ? 'rgba(139,104,255,0.02)' : '#FAFBFC' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Document {index + 1}
                      </Typography>
                      {editMode && (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setEditedProfile(prev => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                    </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 1, minWidth: 80, minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? 'rgba(139,104,255,0.04)' : '#F7F8FA' }}>
                        {doc.image ? (
                          <ImageWithFallback
                            src={doc.image}
                            alt="Document"
                            fallbackText="No Image"
                            size="medium"
                          />
                        ) : doc.file ? (
                          <InsertDriveFileIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                        ) : (
                          <Typography variant="caption" color={theme.palette.text.secondary}>No file</Typography>
                        )}
                      </Box>
                      {editMode && (
                        <Button 
                          component="label" 
                          variant="outlined" 
                          size="small"
                          startIcon={<UploadFileIcon />} 
                          sx={{ borderRadius: 2 }}
                        >
                          Upload
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            hidden 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setEditedProfile(prev => ({
                                  ...prev,
                                  documents: prev.documents.map((document, i) => 
                                    i === index ? {
                                      ...document,
                                      file: URL.createObjectURL(file),
                                      image: file.type.startsWith('image') ? URL.createObjectURL(file) : document.image,
                                    } : document
                                  )
                                }));
                              }
                            }} 
                          />
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
                
                {(!editMode ? profile?.documents : editedProfile?.documents)?.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 2, color: theme.palette.text.secondary }}>
                    <Typography variant="body2">No additional documents</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            
            {/* Photos */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                Photos
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {(editMode ? [...(editedProfile?.photos || []), ...photoFiles.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))] : profile?.photos)?.length === 0 ? (
                  <Typography variant="caption" color={theme.palette.text.secondary}>No photos uploaded</Typography>
                ) : (
                  (editMode ? [...(editedProfile?.photos || []), ...photoFiles.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))] : profile?.photos)?.map((photo, idx) => (
                    <Box key={idx} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 1, minWidth: 80, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', background: isDarkMode ? 'rgba(139,104,255,0.04)' : '#F7F8FA' }}>
                      <ImageWithFallback
                        src={photo.url}
                        alt={photo.name}
                        fallbackText="No Image"
                        size="medium"
                      />
                      <Typography variant="caption" color={theme.palette.text.secondary} sx={{ wordBreak: 'break-all', textAlign: 'center' }}>{photo.name}</Typography>
                    </Box>
                  ))
                )}
                {editMode && (
                  <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />} sx={{ borderRadius: 2, height: 40 }}>
                    Add Photo
                    <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ProductVendorLayout>
  );
};

const ProductPartnerVendorProfile = () => (
  <VendorThemeProvider>
    <ProductPartnerVendorProfileContent />
  </VendorThemeProvider>
);

export default ProductPartnerVendorProfile; 