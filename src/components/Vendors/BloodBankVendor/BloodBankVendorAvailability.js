import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Skeleton,
  Switch
} from '@mui/material';
import {
  Bloodtype,
  Add,
  Edit,
  Delete,
  Warning,
  CheckCircle,
  Error,
  Refresh
} from '@mui/icons-material';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorAvailability = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bloodStock, setBloodStock] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({
    bloodType: '',
    availableUnits: '',
    isAvailable: true
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

  const loadBloodStock = async (vendorId) => {
    try {
      const apiResponse = await bloodBankVendorService.getBloodInventory(vendorId);
      if (apiResponse && apiResponse.inventory) {
        // Transform API data to match component structure
        const transformedStock = apiResponse.inventory.map(item => ({
          id: item.bloodInventoryId,
          bloodType: item.bloodType,
          availableUnits: item.unitsAvailable,
          isAvailable: item.isAvailable,
          lastUpdated: new Date(item.lastUpdated).toLocaleDateString(),
          createdAt: new Date(item.createdAt).toLocaleDateString()
        }));
        setBloodStock(transformedStock);
      } else {
        console.warn('No inventory data received from API');
        loadSampleBloodStock();
      }
    } catch (error) {
      console.error('Error fetching blood inventory:', error);
      toast.error('Failed to load blood inventory');
      loadSampleBloodStock();
    }
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Get vendor ID from auth data
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          if (vendorId) {
            // Fetch real blood inventory data from API
            await loadBloodStock(vendorId);
          } else {
            console.warn('Vendor ID not found in auth data');
            // Fallback to sample data
            loadSampleBloodStock();
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

  const loadSampleBloodStock = () => {
    // Sample blood stock data as fallback
    const sampleStock = [
      { id: 1, bloodType: 'A+', availableUnits: 250, criticalLevel: 50, pricePerUnit: 1200, lastUpdated: '2024-01-15' },
      { id: 2, bloodType: 'A-', availableUnits: 180, criticalLevel: 30, pricePerUnit: 1300, lastUpdated: '2024-01-15' },
      { id: 3, bloodType: 'B+', availableUnits: 320, criticalLevel: 60, pricePerUnit: 1100, lastUpdated: '2024-01-15' },
      { id: 4, bloodType: 'B-', availableUnits: 150, criticalLevel: 25, pricePerUnit: 1400, lastUpdated: '2024-01-15' },
      { id: 5, bloodType: 'O+', availableUnits: 400, criticalLevel: 80, pricePerUnit: 1000, lastUpdated: '2024-01-15' },
      { id: 6, bloodType: 'O-', availableUnits: 120, criticalLevel: 20, pricePerUnit: 1500, lastUpdated: '2024-01-15' },
      { id: 7, bloodType: 'AB+', availableUnits: 80, criticalLevel: 15, pricePerUnit: 1200, lastUpdated: '2024-01-15' },
      { id: 8, bloodType: 'AB-', availableUnits: 45, criticalLevel: 10, pricePerUnit: 1600, lastUpdated: '2024-01-15' },
    ];
    setBloodStock(sampleStock);
  };

  const handleOpenDialog = (stock = null) => {
    if (stock) {
      setEditingStock(stock);
      setFormData({
        bloodType: stock.bloodType,
        availableUnits: stock.availableUnits.toString(),
        isAvailable: stock.isAvailable
      });
    } else {
      setEditingStock(null);
      setFormData({
        bloodType: '',
        availableUnits: '',
        isAvailable: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStock(null);
    setFormData({
      bloodType: '',
      availableUnits: '',
      isAvailable: true
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveStock = async () => {
    if (!formData.bloodType || !formData.availableUnits) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const vendorId = vendorData?.vendorId || vendorData?.id;
      if (!vendorId) {
        toast.error('Vendor ID not found');
        return;
      }

      // Prepare request body based on whether it's add or edit
      let requestBody;
      if (editingStock) {
        // Edit mode - include bloodInventoryId
        requestBody = {
          bloodInventoryId: editingStock.id,
          bloodType: formData.bloodType,
          unitsAvailable: parseInt(formData.availableUnits),
          isAvailable: formData.isAvailable
        };
      } else {
        // Add mode - no bloodInventoryId
        requestBody = {
          bloodType: formData.bloodType,
          unitsAvailable: parseInt(formData.availableUnits),
          isAvailable: formData.isAvailable
        };
      }

      // Call the upsert API
      const response = await bloodBankVendorService.upsertBloodInventory(vendorId, requestBody);
      
      if (response && response.data) {
        // Transform the API response to match our component structure
        const transformedStock = {
          id: response.data.bloodInventoryId,
          bloodType: response.data.bloodType,
          availableUnits: response.data.unitsAvailable,
          isAvailable: response.data.isAvailable,
          lastUpdated: new Date(response.data.lastUpdated).toLocaleDateString(),
          createdAt: new Date(response.data.createdAt).toLocaleDateString()
        };

        if (editingStock) {
          // Update existing stock
          setBloodStock(prev => prev.map(stock => 
            stock.id === editingStock.id ? transformedStock : stock
          ));
          toast.success('Blood stock updated successfully');
        } else {
          // Add new stock
          setBloodStock(prev => [...prev, transformedStock]);
          toast.success('Blood stock added successfully');
        }

        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error saving blood stock:', error);
      toast.error(error.message || 'Failed to save blood stock');
    }
  };

  const handleDeleteStock = (stock) => {
    setStockToDelete(stock);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!stockToDelete) return;

    try {
      await bloodBankVendorService.deleteBloodInventory(stockToDelete.id);
      
      // Remove from local state
      setBloodStock(prev => prev.filter(stock => stock.id !== stockToDelete.id));
      toast.success('Blood stock deleted successfully');
      
      // Close dialog and reset
      setDeleteDialogOpen(false);
      setStockToDelete(null);
    } catch (error) {
      console.error('Error deleting blood stock:', error);
      toast.error(error.message || 'Failed to delete blood stock');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStockToDelete(null);
  };



  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Skeleton loading component for availability
  const AvailabilitySkeleton = () => (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width="250px" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="350px" height={20} />
          </Box>
          <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Summary Cards Skeleton */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          <Skeleton variant="text" width="150px" height={32} />
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4
        }}>
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} sx={{ height: '100%', minHeight: 160 }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mb: 2, mx: 'auto' }} />
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Table Skeleton */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          <Skeleton variant="text" width="180px" height={32} />
        </Typography>
        <Card sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Skeleton variant="text" width="120px" height={24} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <TableCell key={index}>
                        <Skeleton variant="text" width="100px" height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3, 4].map((rowIndex) => (
                    <TableRow key={rowIndex}>
                      {[1, 2, 3, 4, 5].map((cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton variant="text" width="80px" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </BloodBankVendorLayout>
  );

  if (loading) {
    return <AvailabilitySkeleton />;
  }

  return (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>

        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Blood Stock Availability
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your blood bank inventory and stock levels
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Blood Stock
          </Button>
        </Box>

        {/* Summary Cards */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Stock Overview
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          justifyContent: 'center',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4
        }}>
          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Bloodtype />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {bloodStock.reduce((sum, stock) => sum + stock.availableUnits, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Blood Units
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Error />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                {bloodStock.filter(stock => !stock.isAvailable).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unavailable Stock
              </Typography>
            </CardContent>
          </Card>

                     <Card sx={{ 
             transition: 'transform 0.2s ease-in-out',
             '&:hover': {
               transform: 'translateY(-4px)'
             }
           }}>
             <CardContent sx={{ textAlign: 'center', p: 3 }}>
               <Box sx={{ 
                 p: 2, 
                 borderRadius: 3, 
                 backgroundColor: 'success.light',
                 color: 'success.contrastText',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 mb: 2,
                 mx: 'auto',
                 width: 64,
                 height: 64
               }}>
                 <CheckCircle />
               </Box>
               <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                 {bloodStock.filter(stock => stock.isAvailable).length}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 Available Stock
               </Typography>
             </CardContent>
           </Card>

           <Card sx={{ 
             transition: 'transform 0.2s ease-in-out',
             '&:hover': {
               transform: 'translateY(-4px)'
             }
           }}>
             <CardContent sx={{ textAlign: 'center', p: 3 }}>
               <Box sx={{ 
                 p: 2, 
                 borderRadius: 3, 
                 backgroundColor: 'info.light',
                 color: 'info.contrastText',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 mb: 2,
                 mx: 'auto',
                 width: 64,
                 height: 64
               }}>
                 <Bloodtype />
               </Box>
               <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'info.main' }}>
                 {bloodStock.length}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 Total Blood Types
               </Typography>
             </CardContent>
           </Card>
        </Box>

        {/* Blood Stock Table */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Blood Stock Details
        </Typography>
        <Card sx={{ 
          maxWidth: '1400px', 
          mx: 'auto',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Stock Inventory
              </Typography>
              <IconButton onClick={() => {
                const vendorId = vendorData?.vendorId || vendorData?.id;
                if (vendorId) {
                  loadBloodStock(vendorId);
                } else {
                  toast.error('Vendor ID not found');
                }
              }} sx={{ borderRadius: 2 }}>
                <Refresh />
              </IconButton>
            </Box>
            
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                    '& .MuiTableCell-head': {
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      borderBottom: `2px solid ${theme.palette.divider}`
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Blood Type</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Available Units</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Availability Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Last Updated</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bloodStock.map((stock) => {
                    return (
                      <TableRow key={stock.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: stock.isAvailable ? 'success.main' : 'error.main'
                            }}>
                              <Bloodtype />
                            </Avatar>
                            <Typography variant="body1" fontWeight="bold">
                              {stock.bloodType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" fontWeight="bold">
                            {stock.availableUnits}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={stock.isAvailable ? <CheckCircle /> : <Error />}
                            label={stock.isAvailable ? 'Available' : 'Not Available'}
                            color={stock.isAvailable ? 'success' : 'error'}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {stock.lastUpdated}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(stock)}
                              sx={{ borderRadius: 2 }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteStock(stock)}
                              sx={{ borderRadius: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

                 {/* Add/Edit Dialog */}
         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
           <DialogTitle sx={{ fontWeight: 600 }}>
             {editingStock ? 'Edit Blood Stock' : 'Add Blood Stock'}
           </DialogTitle>
                       <DialogContent>
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Blood Type</InputLabel>
                      <Select
                        value={formData.bloodType}
                        onChange={(e) => handleFormChange('bloodType', e.target.value)}
                        label="Blood Type"
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: '#666' }}>Select Blood Type</span>;
                          }
                          return selected;
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>Select Blood Type</em>
                        </MenuItem>
                        {bloodTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Units Available"
                      type="number"
                      value={formData.availableUnits}
                      onChange={(e) => handleFormChange('availableUnits', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Available
                      </Typography>
                      <Switch
                        checked={formData.isAvailable}
                        onChange={(e) => handleFormChange('isAvailable', e.target.checked)}
                        color="primary"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
           <DialogActions>
             <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
               Cancel
             </Button>
             <Button onClick={handleSaveStock} variant="contained" sx={{ borderRadius: 2 }}>
               {editingStock ? 'Update' : 'Add'}
             </Button>
           </DialogActions>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="sm" fullWidth>
           <DialogTitle sx={{ fontWeight: 600, color: 'error.main' }}>
             Delete Blood Stock
           </DialogTitle>
           <DialogContent>
             <Box sx={{ mt: 1 }}>
               <Typography variant="body1" sx={{ mb: 2 }}>
                 Are you sure you want to delete this blood stock?
               </Typography>
               {stockToDelete && (
                 <Box sx={{ 
                   p: 2, 
                   backgroundColor: 'grey.100', 
                   borderRadius: 2,
                   border: '1px solid',
                   borderColor: 'grey.300'
                 }}>
                   <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                     Blood Type: <span style={{ color: 'primary.main' }}>{stockToDelete.bloodType}</span>
                   </Typography>
                   <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                     Available Units: <span style={{ color: 'primary.main' }}>{stockToDelete.availableUnits}</span>
                   </Typography>
                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
                     Status: <span style={{ color: stockToDelete.isAvailable ? 'success.main' : 'error.main' }}>
                       {stockToDelete.isAvailable ? 'Available' : 'Not Available'}
                     </span>
                   </Typography>
                 </Box>
               )}
               <Typography variant="body2" color="error" sx={{ mt: 2, fontStyle: 'italic' }}>
                 This action cannot be undone.
               </Typography>
             </Box>
           </DialogContent>
           <DialogActions>
             <Button onClick={handleCancelDelete} sx={{ borderRadius: 2 }}>
               Cancel
             </Button>
             <Button 
               onClick={handleConfirmDelete} 
               variant="contained" 
               color="error"
               sx={{ borderRadius: 2 }}
             >
               Delete
             </Button>
           </DialogActions>
         </Dialog>
      </Box>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="colored"
      />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorAvailability; 