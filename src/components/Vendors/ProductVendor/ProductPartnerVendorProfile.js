import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ProductVendorLayout from './ProductVendorLayout';

const initialProfile = {
  vendorId: 'VEND12345',
  companyLegalName: 'xyz pvt ltd',
  brandName: 'Guidelign',
  gstNumber: '27AAAPL1234C1ZV',
  panCardNumber: 'AAAPL1234C',
  licenseDetails: {
    licenseNo: 'LIC123456',
    validTill: '2027-12-31',
    file: '', // URL or file name
    image: '', // URL if image
  },
  address: '123, Main Street, Business Park',
  pincode: '400001',
  city: 'Mumbai',
  state: 'Maharashtra',
  email: 'krishnazarekar81@gmail.com',
  bankAccountNumber: '123456789012',
  profilePicture: '',
  location: 'Mumbai, India',
  phoneNumber: '+91-9876543210',
};

const ProductPartnerVendorProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  const handleEdit = () => {
    setEditedProfile(profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedProfile(profile);
    setProfilePicFile(null);
    setLicenseFile(null);
  };

  const handleSave = () => {
    // In real app, upload files and update profile
    if (profilePicFile) {
      setEditedProfile((prev) => ({ ...prev, profilePicture: URL.createObjectURL(profilePicFile) }));
    }
    if (licenseFile) {
      setEditedProfile((prev) => ({
        ...prev,
        licenseDetails: {
          ...prev.licenseDetails,
          file: URL.createObjectURL(licenseFile),
          image: licenseFile.type.startsWith('image') ? URL.createObjectURL(licenseFile) : '',
        },
      }));
    }
    setProfile(editedProfile);
    setEditMode(false);
    setProfilePicFile(null);
    setLicenseFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleLicenseChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      licenseDetails: { ...prev.licenseDetails, [name]: value },
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
        licenseDetails: {
          ...prev.licenseDetails,
          file: URL.createObjectURL(e.target.files[0]),
          image: e.target.files[0].type.startsWith('image') ? URL.createObjectURL(e.target.files[0]) : '',
        },
      }));
    }
  };

  return (
    <ProductVendorLayout title="Profile">
      <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: { xs: 1, sm: 3 } }}>
        {/* Profile Header */}
        <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #F0F1F3', mb: 4, p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={editMode ? editedProfile.profilePicture : profile.profilePicture}
                alt={profile.companyLegalName}
                sx={{ width: 110, height: 110, fontSize: 44, bgcolor: '#F0F1F3', color: '#6C47FF', fontWeight: 700, border: '3px solid #fff', boxShadow: '0 2px 12px #e0e7ff' }}
              >
                {profile.companyLegalName[0]}
              </Avatar>
              {editMode && (
                <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#fff', boxShadow: 1 }}>
                  <UploadFileIcon color="primary" />
                  <input type="file" accept="image/*" hidden onChange={handleProfilePicUpload} />
                </IconButton>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
                {editMode ? (
                  <TextField name="companyLegalName" value={editedProfile.companyLegalName} onChange={handleChange} variant="standard" sx={{ fontWeight: 700 }} />
                ) : (
                  profile.companyLegalName
                )}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#6C47FF', fontWeight: 600 }}>
                {editMode ? (
                  <TextField name="brandName" value={editedProfile.brandName} onChange={handleChange} variant="standard" />
                ) : (
                  profile.brandName
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                <b>Email:</b> {profile.email}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <b>Phone:</b> {editMode ? (
                  <TextField name="phoneNumber" value={editedProfile.phoneNumber} onChange={handleChange} variant="standard" />
                ) : (
                  profile.phoneNumber
                )}
              </Typography>
            </Box>
            <Box>
              {!editMode ? (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit} sx={{ borderRadius: 2, fontWeight: 600 }}>
                  Edit
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <IconButton color="success" onClick={handleSave}><SaveIcon /></IconButton>
                  <IconButton color="error" onClick={handleCancel}><CancelIcon /></IconButton>
                </Stack>
              )}
            </Box>
          </Stack>
        </Card>
        {/* Details Section */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #F0F1F3', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 2 }}>
            Business Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vendor ID"
                name="vendorId"
                value={editMode ? editedProfile.vendorId : profile.vendorId}
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
                value={editMode ? editedProfile.gstNumber : profile.gstNumber}
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
                value={editMode ? editedProfile.panCardNumber : profile.panCardNumber}
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
                value={editMode ? editedProfile.brandName : profile.brandName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Address"
                name="address"
                value={editMode ? editedProfile.address : profile.address}
                onChange={handleChange}
                fullWidth
                margin="dense"
                multiline
                minRows={2}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Pincode"
                name="pincode"
                value={editMode ? editedProfile.pincode : profile.pincode}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                name="city"
                value={editMode ? editedProfile.city : profile.city}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="State"
                name="state"
                value={editMode ? editedProfile.state : profile.state}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={editMode ? editedProfile.location : profile.location}
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
                value={editMode ? editedProfile.bankAccountNumber : profile.bankAccountNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={profile.email}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Paper>
        {/* License/Certificate Section */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #F0F1F3', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 2 }}>
            License / Certificate
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="License Number"
                name="licenseNo"
                value={editMode ? editedProfile.licenseDetails.licenseNo : profile.licenseDetails.licenseNo}
                onChange={handleLicenseChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valid Till"
                name="validTill"
                value={editMode ? editedProfile.licenseDetails.validTill : profile.licenseDetails.validTill}
                onChange={handleLicenseChange}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {((editMode ? editedProfile.licenseDetails.image : profile.licenseDetails.image)) && (
                  <img
                    src={editMode ? editedProfile.licenseDetails.image : profile.licenseDetails.image}
                    alt="License"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                  />
                )}
                {((editMode ? editedProfile.licenseDetails.file : profile.licenseDetails.file)) && !((editMode ? editedProfile.licenseDetails.image : profile.licenseDetails.image)) && (
                  <a href={editMode ? editedProfile.licenseDetails.file : profile.licenseDetails.file} target="_blank" rel="noopener noreferrer">
                    <Button variant="outlined" startIcon={<UploadFileIcon />}>View Certificate</Button>
                  </a>
                )}
                {editMode && (
                  <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ borderRadius: 2 }}>
                    Upload
                    <input type="file" accept="image/*,.pdf" hidden onChange={handleLicenseFileUpload} />
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

export default ProductPartnerVendorProfile; 