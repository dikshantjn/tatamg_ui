import React, { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Grid, TextField, FormControlLabel, Switch, Chip, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputAdornment, IconButton, Accordion, AccordionSummary, AccordionDetails, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhotoIcon from '@mui/icons-material/Photo';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MapIcon from '@mui/icons-material/Map';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { getMedicalStoreVendorProfile } from '../../../services/Vendors/MedicalStoreVendor.service';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const mockProfile = {
  storeId: '550e8400-e29b-41d4-a716-446655440000',
  vendorId: 'vendor123',
  generatedId: 'MS001',
  name: 'HealthCare Pharmacy',
  address: '123 Main Street, Downtown',
  landmark: 'Near Central Park',
  state: 'Maharashtra',
  city: 'Mumbai',
  pincode: '400001',
  contactNumber: '+91 9876543210',
  emailId: 'healthcare@pharmacy.com',
  ownerName: 'Dr. Rajesh Kumar',
  licenseNumber: 'DL123456789',
  gstNumber: '27ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  storeTiming: '9:00 AM - 9:00 PM',
  storeDays: 'Monday to Sunday',
  floor: 'Ground Floor',
  medicineType: 'Allopathic',
  isRareMedicationsAvailable: true,
  isOnlinePayment: true,
  isLiftAccess: true,
  isWheelchairAccess: true,
  isParkingAvailable: true,
  location: 'Downtown Mumbai',
  availableMedicines: ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Omeprazole', 'Cetirizine'],
  registrationCertificates: ['Drug License', 'GST Certificate', 'Shop Act License'],
  complianceCertificates: ['ISO 9001', 'FDA Approved', 'WHO GMP'],
  photos: ['store_front.jpg', 'interior.jpg', 'pharmacy_counter.jpg']
};

const medicineTypes = ['Allopathic', 'Ayurvedic', 'Homeopathic', 'Unani', 'Mixed'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'];

// Helper to check if a URL is an image
const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('firebasestorage');

// Helper to parse lat/lng from string
const parseLatLng = (locationStr) => {
  if (!locationStr) return null;
  const [lat, lng] = locationStr.split(',').map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
};

function MedicalStoreVendorProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  // TODO: Replace with actual vendorId from auth context or props
  const vendorId = 'c29e0298-b239-48df-9f11-4e21c8727f93';

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getMedicalStoreVendorProfile(vendorId);
        // Parse JSON fields if needed
        const parsedProfile = {
          ...data,
          availableMedicines: Array.isArray(data.availableMedicines)
            ? data.availableMedicines
            : (data.availableMedicines ? JSON.parse(data.availableMedicines) : []),
          registrationCertificates: Array.isArray(data.registrationCertificates)
            ? data.registrationCertificates
            : (data.registrationCertificates ? JSON.parse(data.registrationCertificates) : []),
          complianceCertificates: Array.isArray(data.complianceCertificates)
            ? data.complianceCertificates
            : (data.complianceCertificates ? JSON.parse(data.complianceCertificates) : []),
          photos: Array.isArray(data.photos)
            ? data.photos
            : (data.photos ? JSON.parse(data.photos) : []),
        };
        setProfile(parsedProfile);
        setEditForm(parsedProfile);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [vendorId]);

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderField = (label, value, icon = null) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon && <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {value || 'Not specified'}
        </Typography>
      </Box>
    </Box>
  );

  const renderEditField = (label, name, value, type = 'text', required = false, select = false, options = []) => (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      fullWidth
      required={required}
      select={select}
      type={type}
      size="small"
      sx={{ mb: 2 }}
    >
      {select && options.map(option => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </TextField>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!profile) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Failed to load profile.</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Store Profile</Typography>
        {!isEditing ? (
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      {!isEditing ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Info Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <StoreIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Basic Information</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  {renderField('Store Name', profile.name, <StoreIcon />)}
                  {renderField('Owner Name', profile.ownerName, <BusinessIcon />)}
                  {renderField('Store ID', profile.generatedId)}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {renderField('Contact Number', profile.contactNumber, <PhoneIcon />)}
                  {renderField('Email', profile.emailId, <EmailIcon />)}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {renderField('Address', profile.address, <LocationOnIcon />)}
                  {renderField('Landmark', profile.landmark)}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {renderField('City', profile.city)}
                  {renderField('State', profile.state)}
                  {renderField('Pincode', profile.pincode)}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Registration Certificates Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <VerifiedIcon sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6">Registration Certificates</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {profile.registrationCertificates.map((cert, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    {isImageUrl(cert) ? (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <img
                          src={cert}
                          alt={`Certificate ${index + 1}`}
                          style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }}
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div style="color: #888;">No image found</div>'; }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <InsertDriveFileIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {cert.split('/').pop()}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Compliance and License Certificates Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <VerifiedIcon sx={{ mr: 2, color: 'info.main' }} />
                <Typography variant="h6">Compliance & License Certificates</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderField('License Number', profile.licenseNumber)}
                  {renderField('GST Number', profile.gstNumber)}
                  {renderField('PAN Number', profile.panNumber)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    {profile.complianceCertificates.map((cert, index) => (
                      <Grid item xs={12} sm={12} md={12} key={index}>
                        {isImageUrl(cert) ? (
                          <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                            <img
                              src={cert}
                              alt={`Compliance Certificate ${index + 1}`}
                              style={{ maxWidth: '100%', maxHeight: 80, borderRadius: 8 }}
                              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div style="color: #888;">No image found</div>'; }}
                            />
                          </Box>
                        ) : (
                          <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', minHeight: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {cert.split('/').pop()}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Medicine Details Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <LocalHospitalIcon sx={{ mr: 2, color: 'warning.main' }} />
                <Typography variant="h6">Medicine Details</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderField('Medicine Type', profile.medicineType)}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Available Medicines</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profile.availableMedicines.map((medicine, index) => (
                        <Chip key={index} label={medicine} size="small" />
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={<Switch checked={profile.isRareMedicationsAvailable} disabled />}
                      label="Rare Medications Available"
                    />
                    <FormControlLabel
                      control={<Switch checked={profile.isOnlinePayment} disabled />}
                      label="Online Payment"
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Store Details Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 2, color: 'secondary.main' }} />
                <Typography variant="h6">Store Details</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderField('Store Timing', profile.storeTiming, <AccessTimeIcon />)}
                  {renderField('Store Days', profile.storeDays)}
                  {renderField('Floor', profile.floor)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={<Switch checked={profile.isLiftAccess} disabled />}
                      label="Lift Access"
                    />
                    <FormControlLabel
                      control={<Switch checked={profile.isWheelchairAccess} disabled />}
                      label="Wheelchair Access"
                    />
                    <FormControlLabel
                      control={<Switch checked={profile.isParkingAvailable} disabled />}
                      label="Parking Available"
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Store Location Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <MapIcon sx={{ mr: 2, color: 'error.main' }} />
                <Typography variant="h6">Store Location</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderField('Location', profile.location, <LocationOnIcon />)}
                  {renderField('Address', profile.address)}
                  {renderField('Landmark', profile.landmark)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 0, textAlign: 'center', bgcolor: 'grey.100', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, overflow: 'hidden' }}>
                    {(() => {
                      const coords = parseLatLng(profile.location);
                      if (coords) {
                        // Fix default marker icon for leaflet
                        delete L.Icon.Default.prototype._getIconUrl;
                        L.Icon.Default.mergeOptions({
                          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
                          iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
                          shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
                        });
                        return (
                          <MapContainer center={[coords.lat, coords.lng]} zoom={16} style={{ height: 200, width: '100%' }} scrollWheelZoom={false}>
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[coords.lat, coords.lng]}>
                              <Popup>
                                {profile.name || 'Medical Store Location'}
                              </Popup>
                            </Marker>
                          </MapContainer>
                        );
                      } else {
                        return (
                          <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No valid location found</Typography>
                          </Box>
                        );
                      }
                    })()}
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Store Photos Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <PhotoIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Store Photos</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {profile.photos.map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    {isImageUrl(photo) ? (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <img
                          src={photo}
                          alt={`Store Photo ${index + 1}`}
                          style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }}
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div style="color: #888;">No image found</div>'; }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100', minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <InsertDriveFileIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {photo.split('/').pop()}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Edit Form Sections */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderEditField('Store Name', 'name', editForm.name, 'text', true)}
                  {renderEditField('Owner Name', 'ownerName', editForm.ownerName, 'text', true)}
                  {renderEditField('Contact Number', 'contactNumber', editForm.contactNumber, 'tel', true)}
                  {renderEditField('Email', 'emailId', editForm.emailId, 'email')}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderEditField('Address', 'address', editForm.address, 'text', true)}
                  {renderEditField('Landmark', 'landmark', editForm.landmark)}
                  {renderEditField('City', 'city', editForm.city, 'text', true)}
                  {renderEditField('State', 'state', editForm.state, 'text', true, true, states)}
                  {renderEditField('Pincode', 'pincode', editForm.pincode, 'text', true)}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Registration & Compliance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderEditField('License Number', 'licenseNumber', editForm.licenseNumber, 'text', true)}
                  {renderEditField('GST Number', 'gstNumber', editForm.gstNumber, 'text', true)}
                  {renderEditField('PAN Number', 'panNumber', editForm.panNumber)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Features</Typography>
                  <FormControlLabel
                    control={<Switch checked={editForm.isRareMedicationsAvailable} onChange={handleChange} name="isRareMedicationsAvailable" />}
                    label="Rare Medications Available"
                  />
                  <FormControlLabel
                    control={<Switch checked={editForm.isOnlinePayment} onChange={handleChange} name="isOnlinePayment" />}
                    label="Online Payment"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Store Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {renderEditField('Store Timing', 'storeTiming', editForm.storeTiming, 'text', true)}
                  {renderEditField('Store Days', 'storeDays', editForm.storeDays, 'text', true)}
                  {renderEditField('Medicine Type', 'medicineType', editForm.medicineType, 'text', true, true, medicineTypes)}
                  {renderEditField('Floor', 'floor', editForm.floor)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Accessibility</Typography>
                  <FormControlLabel
                    control={<Switch checked={editForm.isLiftAccess} onChange={handleChange} name="isLiftAccess" />}
                    label="Lift Access"
                  />
                  <FormControlLabel
                    control={<Switch checked={editForm.isWheelchairAccess} onChange={handleChange} name="isWheelchairAccess" />}
                    label="Wheelchair Access"
                  />
                  <FormControlLabel
                    control={<Switch checked={editForm.isParkingAvailable} onChange={handleChange} name="isParkingAvailable" />}
                    label="Parking Available"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
}

export default MedicalStoreVendorProfile; 