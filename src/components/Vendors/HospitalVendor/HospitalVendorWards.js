import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Bed,
  Schedule,
  TrendingUp,
  Emergency,
  Visibility,
  LocalHospital,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  Circle,
  Refresh,
  People,
  Payment,
  Add,
  Edit,
  Delete,
  Person,
  TableChart
} from '@mui/icons-material';
import HospitalVendorLayout from './HospitalVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { hospitalVendorService } from '../../../services/Vendors/HospitalVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HospitalVendorWards = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [wardForm, setWardForm] = useState({
    name: '',
    wardType: 'General',
    totalBeds: '',
    availableBeds: '',
    pricePerDay: '',
    genderRestriction: 'None',
    isAC: false,
    hasAttachedBathroom: false,
    isIsolation: false,
    description: '',
    facilities: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [newFacility, setNewFacility] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wardToDelete, setWardToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [wardToView, setWardToView] = useState(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Fetch wards data from API
          const vendorId = authData.vendorData.vendorId;
          if (vendorId) {
            const wardsData = await hospitalVendorService.getHospitalWards(vendorId);
            setWards(wardsData);
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

  const handleAddWard = () => {
    setDialogMode('add');
    setSelectedWard(null);
    setWardForm({
      name: '',
      wardType: 'General',
      totalBeds: '',
      availableBeds: '',
      pricePerDay: '',
      genderRestriction: 'None',
      isAC: false,
      hasAttachedBathroom: false,
      isIsolation: false,
      description: '',
      facilities: []
    });
    setNewFacility('');
    setOpenDialog(true);
  };

  const handleEditWard = (ward) => {
    setDialogMode('edit');
    setSelectedWard(ward);
    
    // Convert facilities object to array for the form
    const facilitiesArray = ward.facilities ? Object.keys(ward.facilities).filter(key => ward.facilities[key]) : [];
    
    setWardForm({
      name: ward.name || '',
      wardType: ward.wardType || 'General',
      totalBeds: ward.totalBeds?.toString() || '',
      availableBeds: ward.availableBeds?.toString() || '',
      pricePerDay: ward.pricePerDay?.toString() || '',
      genderRestriction: ward.genderRestriction || 'None',
      isAC: ward.isAC || false,
      hasAttachedBathroom: ward.hasAttachedBathroom || false,
      isIsolation: ward.isIsolation || false,
      description: ward.description || '',
      facilities: facilitiesArray
    });
    
    setOpenDialog(true);
  };

  const handleDeleteWard = (ward) => {
    setWardToDelete(ward);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWard = async () => {
    if (!wardToDelete) return;
    
    try {
      setDeleteLoading(true);
      
      // Call API to delete ward
      await hospitalVendorService.deleteHospitalWard(wardToDelete.wardId);
      
      // Remove ward from local state
      setWards(wards.filter(ward => ward.wardId !== wardToDelete.wardId));
      
      toast.success('Ward deleted successfully');
      setDeleteDialogOpen(false);
      setWardToDelete(null);
    } catch (error) {
      console.error('Error deleting ward:', error);
      toast.error('Failed to delete ward');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setWardToDelete(null);
  };

  const handleViewWard = (ward) => {
    setWardToView(ward);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setWardToView(null);
  };

    const handleSaveWard = async () => {
    try {
      setFormLoading(true);
      
      if (dialogMode === 'add') {
        // Get vendor ID from auth data
        const authData = vendorAuthService.getVendorAuthData();
        const vendorId = authData?.vendorData?.vendorId;
        
        if (!vendorId) {
          toast.error('Vendor ID not found');
          return;
        }

        // Prepare ward data for API
        const wardData = {
          ...wardForm,
          vendorId: vendorId,
          // Convert facilities array to object format as per API requirement
          facilities: wardForm.facilities.reduce((acc, facility) => {
            acc[facility] = true;
            return acc;
          }, {})
        };

        // Call API to create ward
        const newWard = await hospitalVendorService.createHospitalWard(wardData);
        
        // Add new ward to the list
        setWards([...wards, newWard]);
        toast.success('Ward added successfully');
        setOpenDialog(false);
      } else {
        // Handle edit functionality
        if (!selectedWard?.wardId) {
          toast.error('Ward ID not found');
          return;
        }

        // Get vendor ID from auth data
        const authData = vendorAuthService.getVendorAuthData();
        const vendorId = authData?.vendorData?.vendorId;
        
        if (!vendorId) {
          toast.error('Vendor ID not found');
          return;
        }

        // Prepare ward data for API
        const wardData = {
          ...wardForm,
          vendorId: vendorId,
          // Convert facilities array to object format as per API requirement
          facilities: wardForm.facilities.reduce((acc, facility) => {
            acc[facility] = true;
            return acc;
          }, {})
        };

        // Call API to update ward
        const updatedWard = await hospitalVendorService.updateHospitalWard(selectedWard.wardId, wardData);
        
        // Update ward in the list
        setWards(wards.map(ward => 
          ward.wardId === selectedWard.wardId ? updatedWard : ward
        ));
        toast.success('Ward updated successfully');
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error saving ward:', error);
      toast.error('Failed to save ward');
    } finally {
      setFormLoading(false);
    }
  };

  const getOccupancyPercentage = (occupied, total) => {
    return Math.round((occupied / total) * 100);
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const handleFormChange = (field, value) => {
    setWardForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !wardForm.facilities.includes(newFacility.trim())) {
      setWardForm(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setWardForm(prev => ({
      ...prev,
      facilities: prev.facilities.filter(facility => facility !== facilityToRemove)
    }));
  };

  // Skeleton loading component
  const WardsSkeleton = () => (
    <HospitalVendorLayout title="Wards Management">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="text" width="200px" height={32} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Stats Skeleton */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Wards List Skeleton */}
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Skeleton variant="text" width="150px" height={24} />
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1, mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </HospitalVendorLayout>
  );

  if (loading) {
    return <WardsSkeleton />;
  }

  const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
  const availableBeds = wards.reduce((sum, ward) => sum + ward.availableBeds, 0);
  const occupiedBeds = wards.reduce((sum, ward) => sum + (ward.totalBeds - ward.availableBeds), 0);
  const totalRevenue = wards.reduce((sum, ward) => sum + ((ward.totalBeds - ward.availableBeds) * ward.pricePerDay), 0);

  const stats = [
    { title: 'Total Beds', value: totalBeds, icon: <Bed />, color: 'primary' },
    { title: 'Available Beds', value: availableBeds, icon: <LocalHospital />, color: 'success' },
    { title: 'Occupied Beds', value: occupiedBeds, icon: <People />, color: 'warning' },
    { title: 'Revenue (₹)', value: totalRevenue.toLocaleString(), icon: <Payment />, color: 'secondary' },
  ];

  return (
    <HospitalVendorLayout title="Wards Management">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Wards & Beds Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddWard}
            sx={{ borderRadius: 2 }}
          >
            Add New Ward
          </Button>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5
                  }}>
                    <Box sx={{ 
                      p: { xs: 1, sm: 1.5, md: 1.8 }, 
                      borderRadius: 3, 
                      backgroundColor: `${stat.color}.light`,
                      color: `${stat.color}.contrastText`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: 40, sm: 48, md: 56 },
                      minHeight: { xs: 40, sm: 48, md: 56 }
                    }}>
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' } }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Wards Table */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Ward Details
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ward Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ward Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Total Beds</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Available Beds</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Price per Day (₹)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Facilities</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wards.map((ward) => {
                const occupiedBeds = ward.totalBeds - ward.availableBeds;
                const occupancyPercentage = getOccupancyPercentage(occupiedBeds, ward.totalBeds);
                const occupancyColor = getOccupancyColor(occupancyPercentage);
                
                return (
                  <TableRow key={ward.wardId} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.875rem'
                        }}>
                          <LocalHospital sx={{ fontSize: '1rem' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {ward.name}
                          </Typography>
                          <Chip 
                            label="Active" 
                            size="small" 
                            color="success"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ward.wardType} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {ward.totalBeds}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {ward.availableBeds}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {occupancyPercentage}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={occupancyPercentage} 
                            color={occupancyColor}
                            sx={{ width: 40, height: 4, borderRadius: 1 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ₹{ward.pricePerDay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {ward.facilities && ward.facilities.length > 0 ? (
                          ward.facilities.map((facility, index) => (
                            <Chip
                              key={index}
                              label={facility}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No facilities
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewWard(ward)}
                            sx={{ 
                              color: 'info.main',
                              '&:hover': { backgroundColor: 'info.light' }
                            }}
                          >
                            <Visibility sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Ward">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditWard(ward)}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { backgroundColor: 'primary.light' }
                            }}
                          >
                            <Edit sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Ward">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteWard(ward)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { backgroundColor: 'error.light' }
                            }}
                          >
                            <Delete sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Ward Dialog */}
       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Ward' : 'Edit Ward'}
        </DialogTitle>
                 <DialogContent>
           <Box sx={{ pt: 1 }}>
             <Card>
               <CardContent>
                 <Grid container spacing={3}>
                   {/* Basic Information Section */}
                   <Grid item xs={12}>
                     <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                       <LocalHospital />
                       Basic Information
                     </Typography>
                     <Grid container spacing={2}>
                       <Grid item xs={12} sm={6}>
                         <TextField
                           fullWidth
                           label="Ward Name"
                           value={wardForm.name}
                           onChange={(e) => handleFormChange('name', e.target.value)}
                           required
                           size="small"
                         />
                       </Grid>
                       <Grid item xs={12} sm={6}>
                         <FormControl fullWidth size="small">
                           <InputLabel>Ward Type</InputLabel>
                           <Select
                             label="Ward Type"
                             value={wardForm.wardType}
                             onChange={(e) => handleFormChange('wardType', e.target.value)}
                           >
                             <MenuItem value="General">General</MenuItem>
                             <MenuItem value="Private">Private</MenuItem>
                             <MenuItem value="Semi-Private">Semi-Private</MenuItem>
                             <MenuItem value="Critical Care">Critical Care</MenuItem>
                             <MenuItem value="Emergency">Emergency</MenuItem>
                           </Select>
                         </FormControl>
                       </Grid>
                       <Grid item xs={12} sm={6}>
                         <TextField
                           fullWidth
                           label="Total Beds"
                           type="number"
                           value={wardForm.totalBeds}
                           onChange={(e) => handleFormChange('totalBeds', e.target.value)}
                           required
                           size="small"
                         />
                       </Grid>
                       <Grid item xs={12} sm={6}>
                         <TextField
                           fullWidth
                           label="Available Beds"
                           type="number"
                           value={wardForm.availableBeds}
                           onChange={(e) => handleFormChange('availableBeds', e.target.value)}
                           required
                           size="small"
                         />
                       </Grid>
                       <Grid item xs={12} sm={6}>
                         <TextField
                           fullWidth
                           label="Price per Day (₹)"
                           type="number"
                           value={wardForm.pricePerDay}
                           onChange={(e) => handleFormChange('pricePerDay', e.target.value)}
                           required
                           size="small"
                         />
                       </Grid>
                       <Grid item xs={12} sm={6}>
                         <FormControl fullWidth size="small">
                           <InputLabel>Gender Restriction</InputLabel>
                           <Select
                             label="Gender Restriction"
                             value={wardForm.genderRestriction}
                             onChange={(e) => handleFormChange('genderRestriction', e.target.value)}
                           >
                             <MenuItem value="None">None</MenuItem>
                             <MenuItem value="Male">Male Only</MenuItem>
                             <MenuItem value="Female">Female Only</MenuItem>
                           </Select>
                         </FormControl>
                       </Grid>
                       <Grid item xs={12}>
                         <TextField
                           fullWidth
                           label="Description"
                           multiline
                           rows={3}
                           value={wardForm.description}
                           onChange={(e) => handleFormChange('description', e.target.value)}
                           size="small"
                           placeholder="Describe the ward features and amenities..."
                         />
                       </Grid>
                     </Grid>
                   </Grid>

                   {/* Amenities Section */}
                   <Grid item xs={12}>
                     <Box sx={{ pt: 2, pb: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                       <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                         <Bed />
                         Amenities
                       </Typography>
                       <Grid container spacing={2}>
                         <Grid item xs={12} sm={4}>
                           <FormControlLabel
                             control={
                               <Switch
                                 checked={wardForm.isAC}
                                 onChange={(e) => handleFormChange('isAC', e.target.checked)}
                                 color="primary"
                               />
                             }
                             label="Air Conditioning"
                           />
                         </Grid>
                         <Grid item xs={12} sm={4}>
                           <FormControlLabel
                             control={
                               <Switch
                                 checked={wardForm.hasAttachedBathroom}
                                 onChange={(e) => handleFormChange('hasAttachedBathroom', e.target.checked)}
                                 color="primary"
                               />
                             }
                             label="Attached Bathroom"
                           />
                         </Grid>
                         <Grid item xs={12} sm={4}>
                           <FormControlLabel
                             control={
                               <Switch
                                 checked={wardForm.isIsolation}
                                 onChange={(e) => handleFormChange('isIsolation', e.target.checked)}
                                 color="primary"
                               />
                             }
                             label="Isolation Ward"
                           />
                         </Grid>
                       </Grid>
                     </Box>
                   </Grid>

                   {/* Facilities Section */}
                   <Grid item xs={12}>
                     <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                       <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                         <Assignment />
                         Facilities
                       </Typography>
                       <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                         <TextField
                           fullWidth
                           label="Add Facility"
                           value={newFacility}
                           onChange={(e) => setNewFacility(e.target.value)}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter') {
                               e.preventDefault();
                               handleAddFacility();
                             }
                           }}
                           placeholder="Enter facility name (e.g., TV, WiFi, Recliner)"
                           size="small"
                         />
                         <Button
                           variant="contained"
                           onClick={handleAddFacility}
                           disabled={!newFacility.trim()}
                           sx={{ minWidth: 'auto', px: 3 }}
                         >
                           Add
                         </Button>
                       </Box>
                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
                         {wardForm.facilities.map((facility, index) => (
                           <Chip
                             key={index}
                             label={facility}
                             onDelete={() => handleRemoveFacility(facility)}
                             color="primary"
                             variant="outlined"
                             sx={{ fontSize: '0.75rem' }}
                           />
                         ))}
                         {wardForm.facilities.length === 0 && (
                           <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                             No facilities added yet. Add facilities like TV, WiFi, Recliner, etc.
                           </Typography>
                         )}
                       </Box>
                     </Box>
                   </Grid>
                 </Grid>
               </CardContent>
             </Card>
           </Box>
         </DialogContent>
        <DialogActions>
           <Button onClick={() => setOpenDialog(false)} disabled={formLoading}>
             Cancel
           </Button>
          <Button 
            variant="contained" 
             onClick={handleSaveWard}
             disabled={formLoading || !wardForm.name || !wardForm.totalBeds || !wardForm.availableBeds || !wardForm.pricePerDay}
             startIcon={formLoading ? <CircularProgress size={16} /> : null}
          >
            {dialogMode === 'add' ? 'Add Ward' : 'Update Ward'}
          </Button>
                 </DialogActions>
       </Dialog>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteDialogOpen} onClose={cancelDelete} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>
           Delete Ward
         </DialogTitle>
         <DialogContent>
           <Box sx={{ pt: 1 }}>
             <Typography variant="body1" sx={{ mb: 2 }}>
               Are you sure you want to delete the ward "{wardToDelete?.name}"?
             </Typography>
             <Typography variant="body2" color="text.secondary">
               This action cannot be undone. All ward data will be permanently removed.
             </Typography>
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={cancelDelete} disabled={deleteLoading}>
             Cancel
           </Button>
           <Button 
             variant="contained" 
             color="error"
             onClick={confirmDeleteWard}
             disabled={deleteLoading}
             startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
           >
             {deleteLoading ? 'Deleting...' : 'Delete Ward'}
           </Button>
         </DialogActions>
       </Dialog>

       {/* View Ward Details Dialog */}
       <Dialog open={viewDialogOpen} onClose={closeViewDialog} maxWidth="md" fullWidth>
         <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
           Ward Details
         </DialogTitle>
         <DialogContent>
           {wardToView && (
             <Box sx={{ pt: 1 }}>
               <Card>
                 <CardContent>
                   <Grid container spacing={3}>
                     {/* Basic Information Section */}
                     <Grid item xs={12}>
                       <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                         <LocalHospital />
                         Basic Information
                       </Typography>
                       <Grid container spacing={2}>
                         <Grid item xs={12} sm={6}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Ward Name
                             </Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {wardToView.name}
                             </Typography>
                           </Box>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Ward Type
                             </Typography>
                             <Chip 
                               label={wardToView.wardType} 
                               size="small" 
                               color="primary" 
                               variant="outlined"
                             />
                           </Box>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Total Beds
                             </Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {wardToView.totalBeds}
                             </Typography>
                           </Box>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Available Beds
                             </Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {wardToView.availableBeds}
                             </Typography>
                           </Box>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Price per Day
                             </Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               ₹{wardToView.pricePerDay?.toLocaleString()}
                             </Typography>
                           </Box>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Gender Restriction
                             </Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {wardToView.genderRestriction}
                             </Typography>
                           </Box>
                         </Grid>
                         <Grid item xs={12}>
                           <Box>
                             <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Description
                             </Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {wardToView.description || 'No description available'}
                             </Typography>
                           </Box>
                         </Grid>
                       </Grid>
                     </Grid>

                     {/* Amenities Section */}
                     <Grid item xs={12}>
                       <Box sx={{ pt: 2, pb: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                         <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Bed />
                           Amenities
                         </Typography>
                         <Grid container spacing={2}>
                           <Grid item xs={12} sm={4}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <CheckCircle 
                                 color={wardToView.isAC ? 'success' : 'disabled'} 
                                 sx={{ fontSize: '1.2rem' }}
                               />
                               <Typography variant="body2">
                                 Air Conditioning
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} sm={4}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <CheckCircle 
                                 color={wardToView.hasAttachedBathroom ? 'success' : 'disabled'} 
                                 sx={{ fontSize: '1.2rem' }}
                               />
                               <Typography variant="body2">
                                 Attached Bathroom
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} sm={4}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <CheckCircle 
                                 color={wardToView.isIsolation ? 'success' : 'disabled'} 
                                 sx={{ fontSize: '1.2rem' }}
                               />
                               <Typography variant="body2">
                                 Isolation Ward
                               </Typography>
                             </Box>
                           </Grid>
                         </Grid>
                       </Box>
                     </Grid>

                     {/* Facilities Section */}
                     <Grid item xs={12}>
                       <Box sx={{ pt: 2, pb: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                         <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Assignment />
                           Facilities
                         </Typography>
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                           {wardToView.facilities && Object.keys(wardToView.facilities).length > 0 ? (
                             Object.keys(wardToView.facilities)
                               .filter(facility => wardToView.facilities[facility])
                               .map((facility, index) => (
                                 <Chip
                                   key={index}
                                   label={facility}
                                   color="primary"
                                   variant="outlined"
                                   sx={{ fontSize: '0.75rem' }}
                                 />
                               ))
                           ) : (
                             <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                               No facilities available
                             </Typography>
                           )}
                         </Box>
                       </Box>
                     </Grid>

                     {/* Additional Information */}
                     <Grid item xs={12}>
                       <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                         <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                           <TableChart />
                           Additional Information
                         </Typography>
                         <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                             <Box>
                               <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                 Ward ID
                               </Typography>
                               <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                 {wardToView.wardId}
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <Box>
                               <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                 Created At
                               </Typography>
                               <Typography variant="body2">
                                 {new Date(wardToView.createdAt).toLocaleDateString()}
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <Box>
                               <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                 Last Updated
                               </Typography>
                               <Typography variant="body2">
                                 {new Date(wardToView.updatedAt).toLocaleDateString()}
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <Box>
                               <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                 Occupancy Rate
                               </Typography>
                               <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                 {Math.round(((wardToView.totalBeds - wardToView.availableBeds) / wardToView.totalBeds) * 100)}%
                               </Typography>
                             </Box>
                           </Grid>
                         </Grid>
                       </Box>
                     </Grid>
                   </Grid>
                 </CardContent>
               </Card>
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={closeViewDialog}>
             Close
           </Button>
         </DialogActions>
       </Dialog>
       
       <ToastContainer 
         position="top-right" 
         autoClose={3000} 
         hideProgressBar={false}
         closeOnClick={true}
         pauseOnHover={true}
         draggable={true}
         theme="colored"
       />
    </HospitalVendorLayout>
  );
};

export default HospitalVendorWards; 