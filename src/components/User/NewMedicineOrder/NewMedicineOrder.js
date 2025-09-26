import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Paper,
  Backdrop,
  Stack
} from '@mui/material';
import {
  Phone,
  Upload,
  LocalPharmacy,
  Close,
  Add,
  TrackChanges,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { medicalStoresService } from '../../../services/User/medicalStoresService';
import { getUserId } from '../../../services/User/Auth/auth.utils';

const NewMedicineOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [medicalStores, setMedicalStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [generalProducts, setGeneralProducts] = useState('');
  const [quantityPreference, setQuantityPreference] = useState('');
  const [skipNotes, setSkipNotes] = useState('');
  const [showAddMore, setShowAddMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Check if user is authenticated
    const userId = getUserId();
    if (!userId) {
      setError('User not authenticated. Please login to access this feature.');
      setLoading(false);
      return;
    }
    
    fetchMedicalStores();
  }, []);

  const fetchMedicalStores = async () => {
    try {
      setLoading(true);
      const response = await medicalStoresService.getAllMedicalStores();
      if (response.success) {
        setMedicalStores(response.data);
      } else {
        setError('Failed to fetch medical stores');
      }
    } catch (err) {
      setError('Error loading medical stores');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCallStore = (store) => {
    window.open(`tel:${store.contactNumber}`, '_self');
  };

  const handleUploadPrescription = (store) => {
    setSelectedStore(store);
    setUploadDialogOpen(true);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setPrescriptionFiles(prev => [...prev, ...files]);
      setShowAddMore(true);
    }
  };

  const handleAddMoreFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.multiple = true;
    input.onchange = handleFileChange;
    input.click();
  };

  const handleUpload = async () => {
    // Check if user has either uploaded files or entered general products
    if (prescriptionFiles.length === 0 && !generalProducts.trim()) {
      setSnackbar({
        open: true,
        message: 'Please either upload prescription files or enter general products to order',
        severity: 'error'
      });
      return;
    }

    // If prescription files are uploaded, quantity preference is required
    if (prescriptionFiles.length > 0 && !quantityPreference.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter quantity preference for prescription items',
        severity: 'error'
      });
      return;
    }

    try {
      setUploading(true);
      const userId = getUserId();
      
      if (!userId) {
        setSnackbar({
          open: true,
          message: 'User not authenticated. Please login again.',
          severity: 'error'
        });
        return;
      }

      const formData = new FormData();
      formData.append('vendorId', selectedStore.vendorId);
      formData.append('userId', userId);
      
      // Combine general products and quantity preference
      const combinedOrderDetails = [];
      if (generalProducts.trim()) {
        combinedOrderDetails.push(`General Products: ${generalProducts.trim()}`);
      }
      if (quantityPreference.trim()) {
        combinedOrderDetails.push(`Prescription Details: ${quantityPreference.trim()}`);
      }
      
      formData.append('quantityPreference', combinedOrderDetails.join('\n\n'));
      formData.append('skipNotes', skipNotes || '');
      
      // Append all files (only if there are files)
      prescriptionFiles.forEach((file, index) => {
        formData.append('files', file);
      });
      
      // If no files are uploaded, add an empty file field to ensure FormData is valid
      if (prescriptionFiles.length === 0) {
        // Create an empty file-like object to ensure the FormData structure is consistent
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        formData.append('files', emptyFile);
      }
      
      const response = await medicalStoresService.sendPrescription(formData);
      
      setSnackbar({
        open: true,
        message: 'Order submitted successfully!',
        severity: 'success'
      });
      
      setUploadDialogOpen(false);
      setPrescriptionFiles([]);
      setGeneralProducts('');
      setQuantityPreference('');
      setSkipNotes('');
      setSelectedStore(null);
    } catch (err) {
      console.error('Error submitting order:', err);
      setSnackbar({
        open: true,
        message: 'Failed to submit order. Please try again.',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseDialog = () => {
    setUploadDialogOpen(false);
    setPrescriptionFiles([]);
    setGeneralProducts('');
    setQuantityPreference('');
    setSkipNotes('');
    setShowAddMore(false);
    setSelectedStore(null);
  };


  if (loading) {
    return (
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchMedicalStores}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center', px: { xs: 1, sm: 0 } }}>
          <Typography 
            variant={isMobile ? 'h4' : 'h3'} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            Medicine Order
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              lineHeight: 1.4,
              mb: 3
            }}
          >
            Find nearby medical stores and upload your prescription
          </Typography>
          
          {/* Navigation Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            maxWidth: 400,
            mx: 'auto'
          }}>
            <Button
              variant="contained"
              startIcon={<TrackChanges />}
              onClick={() => navigate('/track-order')}
              sx={{
                py: { xs: 1.5, sm: 1 },
                px: { xs: 3, sm: 2 },
                fontSize: { xs: '1rem', sm: '0.875rem' },
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                },
                transition: 'all 0.3s ease'
              }}
            >
              Track Order
            </Button>
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={() => navigate('/orders')}
              sx={{
                py: { xs: 1.5, sm: 1 },
                px: { xs: 3, sm: 2 },
                fontSize: { xs: '1rem', sm: '0.875rem' },
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.50',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2]
                },
                transition: 'all 0.3s ease'
              }}
            >
              My Orders
            </Button>
          </Box>
        </Box>

        {/* Medical Stores List */}
        <Box sx={{ maxWidth: 600, mx: 'auto', px: { xs: 2, sm: 0 } }}>
          {medicalStores.map((store) => (
            <Card
              key={store.vendorId}
              sx={{
                mb: 2,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Mobile Layout */}
                {isMobile ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                        <LocalPharmacy />
                      </Avatar>
                      <Typography 
                        variant="h6" 
                        component="h2"
                        sx={{ 
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          wordBreak: 'break-word'
                        }}
                      >
                        {store.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Phone />}
                        onClick={() => handleCallStore(store)}
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        Call Store
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Upload />}
                        onClick={() => handleUploadPrescription(store)}
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        Upload Prescription
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  /* Desktop Layout */
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <LocalPharmacy />
                      </Avatar>
                      <Typography variant="h6" component="h2">
                        {store.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Phone />}
                        onClick={() => handleCallStore(store)}
                        size="small"
                      >
                        Call
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Upload />}
                        onClick={() => handleUploadPrescription(store)}
                        size="small"
                      >
                        Upload
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Upload Prescription Dialog */}
        <Dialog
          open={uploadDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                  pr: 1
                }}
              >
                Upload Prescription
                {selectedStore && (
                  <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' }, mt: { xs: 0.5, sm: 0 } }}>
                    {isMobile ? `\n${selectedStore.name}` : ` - ${selectedStore.name}`}
                  </Box>
                )}
              </Typography>
              <IconButton onClick={handleCloseDialog} sx={{ flexShrink: 0 }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
           <DialogContent>
             <Box sx={{ pt: { xs: 1, sm: 2 } }}>
               <Stack spacing={{ xs: 2, sm: 3 }}>
                 {/* File Upload */}
                 <TextField
                   fullWidth
                   type="file"
                   inputProps={{ accept: 'image/*,.pdf', multiple: true }}
                   onChange={handleFileChange}
                   helperText="Upload prescription images or PDF files"
                   sx={{ mb: 2 }}
                 />
                 
                 {prescriptionFiles.length > 0 && (
                   <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                     <Typography variant="subtitle2" gutterBottom>
                       Selected Files:
                     </Typography>
                     {prescriptionFiles.map((file, index) => (
                       <Typography key={index} variant="body2" color="text.secondary">
                         • {file.name}
                       </Typography>
                     ))}
                     {showAddMore && (
                       <Button
                         variant="outlined"
                         startIcon={<Add />}
                         onClick={handleAddMoreFiles}
                         sx={{ mt: 1 }}
                         size="small"
                       >
                         Add More Files
                       </Button>
                     )}
                   </Paper>
                 )}

                 {/* Order General Product - Always visible */}
                 <TextField
                   fullWidth
                   label="Order General Product"
                   multiline
                   rows={3}
                   value={generalProducts}
                   onChange={(e) => setGeneralProducts(e.target.value)}
                   placeholder="Enter general products you want to order (e.g., toothpaste, soap, vitamins, etc.)"
                   helperText="Add any general products you need along with prescription items"
                 />

                 {/* Show additional fields only when prescription files are selected */}
                 {prescriptionFiles.length > 0 && (
                   <>
                     {/* Quantity Preference - Text Area */}
                     <TextField
                       fullWidth
                       label="Quantity Preference"
                       multiline
                       rows={3}
                       value={quantityPreference}
                       onChange={(e) => setQuantityPreference(e.target.value)}
                       placeholder="Enter quantity details (e.g., 1 box of Paracetamol, 2 strips of Amoxicillin)"
                       helperText="Describe the quantity you need"
                     />

                     {/* Skip Notes - Text Field */}
                     <TextField
                       fullWidth
                       label="Skip Notes"
                       multiline
                       rows={2}
                       value={skipNotes}
                       onChange={(e) => setSkipNotes(e.target.value)}
                       placeholder="Enter any notes about skipping certain items or special instructions"
                       helperText="Add any special instructions or notes"
                     />
                   </>
                 )}
               </Stack>
             </Box>
           </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Button 
              onClick={handleCloseDialog} 
              disabled={uploading}
              fullWidth={isMobile}
              variant={isMobile ? 'outlined' : 'text'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={(prescriptionFiles.length === 0 && !generalProducts.trim()) || (prescriptionFiles.length > 0 && !quantityPreference.trim()) || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
              fullWidth={isMobile}
              sx={{ 
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '1rem', sm: '0.875rem' }
              }}
            >
              {uploading ? 'Sending...' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default NewMedicineOrder;
