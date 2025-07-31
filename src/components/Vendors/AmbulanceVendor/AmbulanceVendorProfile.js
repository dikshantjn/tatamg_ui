import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  LocalShipping,
  Edit,
  Save,
  Cancel,
  Business,
  Person,
  Phone,
  Email,
  Language,
  LocationOn,
  PhotoCamera,
  Description,
  Security,
  Assessment,
  Schedule,
  Payment,
  GpsFixed,
  Badge,
  Map,
  CreditCard,
  CheckCircle,
  Settings,
  Add,
  Close
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';

const AmbulanceVendorProfile = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ambulanceTypeInput, setAmbulanceTypeInput] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [formData, setFormData] = useState({
    agencyName: 'Urge care',
    gstNumber: 'AAFCI5006A1Z7',
    panNumber: 'AAFCI5006A',
    ownerName: 'Praveen',
    registrationNumber: '22345',
    address: 'wanowrie',
    landmark: 'dmart',
    contactNumber: '9370320066',
    email: 'xyz3@gmail.com',
    website: 'https://www.urgecare.com',
    numOfAmbulances: '300',
    driverKYC: true,
    driverTrained: true,
    ambulanceTypes: ['Basic Life Support (BLS)', 'Advanced Life Support (ALS)', 'Neonatal Ambulance', 'Air Ambulance', 'Mortuary Van'],
    gpsTrackingAvailable: true,
    ambulanceEquipment: [],
    trainingCertifications: ['Emergency Medical Technician', 'First Aid Certified'],
    languageProficiency: ['English', 'Hindi', 'Marathi'],
    operationalAreas: ['Pune', 'Mumbai', 'Nashik'],
    is24x7Available: true,
    distanceLimit: '0',
    isOnlinePaymentAvailable: true,
    officePhotos: [],
    preciseLocation: '18.488856, 73.8674729',
    driverLicense: '12345',
    state: 'Maharashtra',
    city: 'Pune',
    pinCode: '411044'
  });

  const ambulanceTypeOptions = [
    'Basic Life Support (BLS)',
    'Advanced Life Support (ALS)',
    'Neonatal Ambulance',
    'Air Ambulance',
    'Patient Transport Vehicle',
    'Mortuary Van',
    'Mobile Intensive Care Unit'
  ];

  const equipmentOptions = [
    'Defibrillator',
    'Ventilator',
    'Oxygen Cylinder',
    'ECG Machine',
    'Stretcher',
    'First Aid Kit',
    'Suction Unit',
    'IV Fluids',
    'Cardiac Monitor'
  ];

  const states = [
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan',
    'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Bihar', 'Odisha'
  ];

  const languages = [
    'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada',
    'Gujarati', 'Bengali', 'Malayalam', 'Punjabi'
  ];

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleAddAmbulanceType = () => {
    if (ambulanceTypeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ambulanceTypes: [...prev.ambulanceTypes, ambulanceTypeInput.trim()]
      }));
      setAmbulanceTypeInput('');
    }
  };

  const handleAddEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ambulanceEquipment: [...prev.ambulanceEquipment, equipmentInput.trim()]
      }));
      setEquipmentInput('');
    }
  };

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        languageProficiency: [...prev.languageProficiency, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const renderLocationMap = () => {
    const [lat, lng] = formData.preciseLocation.split(',').map(coord => parseFloat(coord.trim()));
    
    return (
      <Box sx={{ 
        height: 200, 
        bgcolor: theme.palette.grey[100], 
        borderRadius: 1, 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}
        >
          <LocationOn color="error" sx={{ fontSize: 40 }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </Box>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={theme.palette.divider} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </Box>
    );
  };

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Ambulance Service Profile 🚑
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your ambulance service information and operational details
          </Typography>
        </Box>

      <Grid container spacing={3}>
                 {/* Main Content */}
         <Grid item xs={12}>
          {/* Basic Information */}
          <Card sx={{ 
            mb: 3, 
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Business color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Basic Information
                  </Typography>
                </Box>
                {!editMode ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{ borderRadius: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Agency Name"
                     value={formData.agencyName}
                     onChange={(e) => handleInputChange('agencyName', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Owner Name"
                     value={formData.ownerName}
                     onChange={(e) => handleInputChange('ownerName', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="GST Number"
                     value={formData.gstNumber}
                     onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="PAN Number"
                     value={formData.panNumber}
                     onChange={(e) => handleInputChange('panNumber', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Registration Number"
                     value={formData.registrationNumber}
                     onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Driver License"
                     value={formData.driverLicense}
                     onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ 
            mb: 3, 
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Phone color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Contact Information
                </Typography>
              </Box>

                             <Grid container spacing={3}>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Contact Number"
                     value={formData.contactNumber}
                     onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Email"
                     value={formData.email}
                     onChange={(e) => handleInputChange('email', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12}>
                   <TextField
                     fullWidth
                     label="Website"
                     value={formData.website}
                     onChange={(e) => handleInputChange('website', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
               </Grid>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card sx={{ 
            mb: 3, 
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LocationOn color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Location Information
                </Typography>
              </Box>

                             <Grid container spacing={3}>
                 <Grid item xs={12}>
                   <TextField
                     fullWidth
                     label="Address"
                     value={formData.address}
                     onChange={(e) => handleInputChange('address', e.target.value)}
                     disabled={!editMode}
                     multiline
                     rows={2}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Landmark"
                     value={formData.landmark}
                     onChange={(e) => handleInputChange('landmark', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <FormControl fullWidth disabled={!editMode}>
                     <InputLabel sx={{ color: theme.palette.text.secondary }}>State</InputLabel>
                     <Select
                       value={formData.state}
                       label="State"
                       onChange={(e) => handleInputChange('state', e.target.value)}
                       sx={{ 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& .MuiOutlinedInput-notchedOutline': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                           borderColor: theme.palette.primary.main
                         },
                         '& .MuiSelect-select': {
                           color: theme.palette.text.primary
                         }
                       }}
                     >
                       {states.map((state) => (
                         <MenuItem key={state} value={state}>{state}</MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="City"
                     value={formData.city}
                     onChange={(e) => handleInputChange('city', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Pin Code"
                     value={formData.pinCode}
                     onChange={(e) => handleInputChange('pinCode', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12}>
                   <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary }}>
                     Precise Location
                   </Typography>
                   {renderLocationMap()}
                   <TextField
                     fullWidth
                     label="Coordinates (Latitude, Longitude)"
                     value={formData.preciseLocation}
                     onChange={(e) => handleInputChange('preciseLocation', e.target.value)}
                     disabled={!editMode}
                     sx={{ 
                       mt: 2, 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                     placeholder="18.488856, 73.8674729"
                   />
                 </Grid>
               </Grid>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card sx={{ 
            mb: 3, 
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LocalShipping color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Service Information
                </Typography>
              </Box>

                             <Grid container spacing={3}>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Number of Ambulances"
                     value={formData.numOfAmbulances}
                     onChange={(e) => handleInputChange('numOfAmbulances', e.target.value)}
                     disabled={!editMode}
                     type="number"
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Distance Limit (km)"
                     value={formData.distanceLimit}
                     onChange={(e) => handleInputChange('distanceLimit', e.target.value)}
                     disabled={!editMode}
                     type="number"
                     sx={{ 
                       '& .MuiOutlinedInput-root': { 
                         borderRadius: 2,
                         backgroundColor: theme.palette.background.paper,
                         '& fieldset': {
                           borderColor: theme.palette.divider
                         },
                         '&:hover fieldset': {
                           borderColor: theme.palette.primary.main
                         }
                       },
                       '& .MuiInputLabel-root': {
                         color: theme.palette.text.secondary
                       },
                       '& .MuiInputBase-input': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                                   <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                      Ambulance Types
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        placeholder="Enter ambulance type"
                        value={ambulanceTypeInput}
                        onChange={(e) => setAmbulanceTypeInput(e.target.value)}
                        disabled={!editMode}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            '& fieldset': {
                              borderColor: theme.palette.divider
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary
                          },
                          '& .MuiInputBase-input': {
                            color: theme.palette.text.primary
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddAmbulanceType}
                        disabled={!editMode || !ambulanceTypeInput.trim()}
                        startIcon={<Add />}
                        sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.ambulanceTypes.map((type, index) => (
                        <Chip
                          key={index}
                          label={type}
                          onDelete={editMode ? () => handleRemoveItem('ambulanceTypes', index) : undefined}
                          deleteIcon={<Close />}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                      Ambulance Equipment
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        placeholder="Enter equipment name"
                        value={equipmentInput}
                        onChange={(e) => setEquipmentInput(e.target.value)}
                        disabled={!editMode}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            '& fieldset': {
                              borderColor: theme.palette.divider
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary
                          },
                          '& .MuiInputBase-input': {
                            color: theme.palette.text.primary
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddEquipment}
                        disabled={!editMode || !equipmentInput.trim()}
                        startIcon={<Add />}
                        sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.ambulanceEquipment.map((equipment, index) => (
                        <Chip
                          key={index}
                          label={equipment}
                          onDelete={editMode ? () => handleRemoveItem('ambulanceEquipment', index) : undefined}
                          deleteIcon={<Close />}
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                      Language Proficiency
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        placeholder="Enter language"
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        disabled={!editMode}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            '& fieldset': {
                              borderColor: theme.palette.divider
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary
                          },
                          '& .MuiInputBase-input': {
                            color: theme.palette.text.primary
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddLanguage}
                        disabled={!editMode || !languageInput.trim()}
                        startIcon={<Add />}
                        sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.languageProficiency.map((language, index) => (
                        <Chip
                          key={index}
                          label={language}
                          onDelete={editMode ? () => handleRemoveItem('languageProficiency', index) : undefined}
                          deleteIcon={<Close />}
                          color="info"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
               </Grid>
            </CardContent>
          </Card>

          {/* Operational Settings */}
          <Card sx={{ 
            backgroundColor: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2]
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Settings color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Operational Settings
                </Typography>
              </Box>

                             <Grid container spacing={3}>
                 <Grid item xs={12} sm={6}>
                   <FormControlLabel
                     control={
                       <Switch
                         checked={formData.driverKYC}
                         onChange={handleSwitchChange('driverKYC')}
                         disabled={!editMode}
                       />
                     }
                     label="Driver KYC Completed"
                     sx={{ 
                       '& .MuiFormControlLabel-label': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <FormControlLabel
                     control={
                       <Switch
                         checked={formData.driverTrained}
                         onChange={handleSwitchChange('driverTrained')}
                         disabled={!editMode}
                       />
                     }
                     label="Driver Trained"
                     sx={{ 
                       '& .MuiFormControlLabel-label': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <FormControlLabel
                     control={
                       <Switch
                         checked={formData.gpsTrackingAvailable}
                         onChange={handleSwitchChange('gpsTrackingAvailable')}
                         disabled={!editMode}
                       />
                     }
                     label="GPS Tracking Available"
                     sx={{ 
                       '& .MuiFormControlLabel-label': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <FormControlLabel
                     control={
                       <Switch
                         checked={formData.is24x7Available}
                         onChange={handleSwitchChange('is24x7Available')}
                         disabled={!editMode}
                       />
                     }
                     label="24x7 Service Available"
                     sx={{ 
                       '& .MuiFormControlLabel-label': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <FormControlLabel
                     control={
                       <Switch
                         checked={formData.isOnlinePaymentAvailable}
                         onChange={handleSwitchChange('isOnlinePaymentAvailable')}
                         disabled={!editMode}
                       />
                     }
                     label="Online Payment Available"
                     sx={{ 
                       '& .MuiFormControlLabel-label': {
                         color: theme.palette.text.primary
                       }
                     }}
                   />
                 </Grid>
               </Grid>
            </CardContent>
          </Card>
        </Grid>

        
      </Grid>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6">Profile Updated Successfully!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Your ambulance service profile has been updated with the latest information.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => setDialogOpen(false)}
            sx={{ borderRadius: 2, px: 4 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorProfile;