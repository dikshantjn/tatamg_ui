import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Checkbox,
  FormControlLabel,
  Switch,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBack,
  LocalPhone,
  AccessTime,
  LocationOn,
  Person,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Emergency,
  DirectionsCar,
  Close,
  MoreVert,
  DirectionsCarFilled,
  PersonAdd,
  CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';

const AmbulanceVendorProcessOrder = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { requestId } = useParams();
  const location = useLocation();
  const requestData = location.state?.requestData;

     const [services, setServices] = useState([]);
   const [showAddServiceDrawer, setShowAddServiceDrawer] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [editingServiceId, setEditingServiceId] = useState(null);
   const [serviceStatus, setServiceStatus] = useState('pending');
   const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
   const [newService, setNewService] = useState({
     pickupLocation: '',
     dropLocation: '',
     vehicleType: '',
     totalDistance: '',
     costPerKm: '',
     baseCharge: '',
     waivePayment: false,
     notifyUser: false
   });

  useEffect(() => {
    if (!requestData) {
      navigate('/vendor/ambulance/requests');
      return;
    }
    // Load existing services for this request (mock data)
    setServices([
      {
        id: 1,
        vehicleType: 'Basic Ambulance',
        pickupLocation: 'Mumbai Central Station',
        dropLocation: 'Bombay Hospital',
        totalDistance: 15,
        costPerKm: 50,
        baseCharge: 200,
        totalCost: 950,
        status: 'active'
      }
    ]);
  }, [requestData, navigate]);

     const handleEditService = (service) => {
     setNewService({
       pickupLocation: service.pickupLocation,
       dropLocation: service.dropLocation,
       vehicleType: service.vehicleType,
       totalDistance: service.totalDistance,
       costPerKm: service.costPerKm,
       baseCharge: service.baseCharge,
       waivePayment: service.waivePayment,
       notifyUser: service.notifyUser
     });
     setIsEditing(true);
     setEditingServiceId(service.id);
     setShowAddServiceDrawer(true);
   };

   const handleAddService = () => {
     if (!newService.pickupLocation || !newService.dropLocation || !newService.vehicleType || 
         !newService.totalDistance || !newService.costPerKm || !newService.baseCharge) {
       toast.error('Please fill all required service details');
       return;
     }

     const totalCost = (parseFloat(newService.totalDistance) * parseFloat(newService.costPerKm)) + parseFloat(newService.baseCharge);
     
     if (isEditing) {
       // Update existing service
       setServices(prev => prev.map(service => 
         service.id === editingServiceId 
           ? { ...service, ...newService, totalCost: totalCost }
           : service
       ));
       toast.success('Service updated successfully!');
     } else {
       // Add new service (only if no service exists)
       if (services.length > 0) {
         toast.error('Only one service can be added per order');
         return;
       }
       const service = {
         id: Date.now(),
         ...newService,
         totalCost: totalCost,
         status: 'active'
       };
       setServices(prev => [...prev, service]);
       toast.success('Service added successfully!');
     }

     setNewService({
       pickupLocation: '',
       dropLocation: '',
       vehicleType: '',
       totalDistance: '',
       costPerKm: '',
       baseCharge: '',
       waivePayment: false,
       notifyUser: false
     });
     setIsEditing(false);
     setEditingServiceId(null);
     setShowAddServiceDrawer(false);
   };

  const handleRemoveService = (serviceId) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    toast.success('Service removed successfully!');
  };

     const getServiceTypeIcon = (vehicleType) => {
     if (!vehicleType) return <DirectionsCar />;
     
     switch (vehicleType.toLowerCase()) {
       case 'basic ambulance':
         return <DirectionsCar />;
       case 'advanced life support':
         return <Emergency />;
       case 'icu ambulance':
         return <Emergency />;
       case 'neonatal ambulance':
         return <Emergency />;
       case 'cardiac ambulance':
         return <Emergency />;
       default:
         return <DirectionsCar />;
     }
   };

   const handleStatusMenuOpen = (event) => {
     setStatusMenuAnchor(event.currentTarget);
   };

   const handleStatusMenuClose = () => {
     setStatusMenuAnchor(null);
   };

   const handleStatusChange = (newStatus) => {
     setServiceStatus(newStatus);
     handleStatusMenuClose();
     toast.success(`Service status updated to: ${newStatus}`);
   };

   const getStatusColor = (status) => {
     switch (status) {
       case 'on_the_way':
         return 'info';
       case 'picked_up':
         return 'warning';
       case 'completed':
         return 'success';
       default:
         return 'default';
     }
   };

   const getStatusIcon = (status) => {
     switch (status) {
       case 'on_the_way':
         return <DirectionsCarFilled />;
       case 'picked_up':
         return <PersonAdd />;
       case 'completed':
         return <CheckCircleOutline />;
       default:
         return <Warning />;
     }
   };

  if (!requestData) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading order details...</Typography>
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/vendor/ambulance/requests')}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Back to Requests
          </Button>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 700, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Process Order #{requestId}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage booking details and service requirements
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          maxWidth: '1600px',
          mx: 'auto',
          gap: 3
        }}>
                     {/* Booking Details Card */}
           <Card sx={{ 
             width: '30%',
             height: 'fit-content',
             borderRadius: 3, 
             boxShadow: theme.shadows[4] 
           }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                <Person />
                Customer Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      fontSize: '1.5rem',
                      fontWeight: 700
                    }}
                  >
                    {requestData.customerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {requestData.customerName}
                    </Typography>
                    <Chip 
                      label={requestData.status} 
                      size="small" 
                      color={requestData.status === 'Accepted' ? 'success' : 'warning'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ space: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalPhone sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Contact Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {requestData.mobileNo}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ mr: 2, color: theme.palette.info.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Request Time
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {requestData.time}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

                     {/* Service Details Card */}
           <Card sx={{ 
             width: '60%',
             borderRadius: 3, 
             boxShadow: theme.shadows[4] 
           }}>
            <CardContent sx={{ p: 3 }}>
                                                                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                        <DirectionsCar />
                        Service Details
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {serviceStatus !== 'pending' && (
                        <Chip
                          label={serviceStatus.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(serviceStatus)}
                          icon={getStatusIcon(serviceStatus)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={services.length > 0 ? <Edit /> : <Add />}
                        onClick={() => setShowAddServiceDrawer(true)}
                        sx={{ textTransform: 'none' }}
                      >
                        {services.length > 0 ? 'Edit Service' : 'Add Service'}
                      </Button>
                    </Box>
                  </Box>

                                 {services.length > 0 ? (
                   <Box>
                     {services.map((service) => (
                       <Box key={service.id} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, mb: 2 }}>
                         {/* Service Header */}
                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                             <Avatar sx={{ 
                               bgcolor: theme.palette.primary.main,
                               width: 48,
                               height: 48
                             }}>
                               {getServiceTypeIcon(service.vehicleType)}
                             </Avatar>
                             <Box>
                               <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                 {service.vehicleType}
                               </Typography>
                               <Chip 
                                 label={service.waivePayment ? "Payment Waived" : "Payment Required"}
                                 size="small"
                                 color={service.waivePayment ? "warning" : "success"}
                                 sx={{ fontWeight: 600 }}
                               />
                             </Box>
                           </Box>
                         </Box>

                                                   {/* Service Details Box */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                              Service Details
                            </Typography>
                            <Box sx={{ 
                              p: 3, 
                              bgcolor: theme.palette.background.paper, 
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`
                            }}>
                              {/* Service Receipt Section */}
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                                  Service Receipt
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                      Pickup Location
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {service.pickupLocation}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                      Drop Location
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {service.dropLocation}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                      Total Distance
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {service.totalDistance} km
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                      Rate per km
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      ₹{service.costPerKm}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                      Base Charge
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      ₹{service.baseCharge}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>

                              <Divider sx={{ my: 2 }} />

                              {/* Cost Breakdown Section */}
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                                  Cost Breakdown
                                </Typography>
                                <Box sx={{ 
                                  p: 2, 
                                  bgcolor: theme.palette.background.default, 
                                  borderRadius: 2,
                                  border: `1px solid ${theme.palette.divider}`
                                }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Distance ({service.totalDistance} km × ₹{service.costPerKm})
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      ₹{(service.totalDistance * service.costPerKm).toFixed(2)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Base Charge
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      ₹{service.baseCharge}
                                    </Typography>
                                  </Box>
                                  <Divider sx={{ my: 1 }} />
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                      Total Amount
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                      ₹{service.totalCost}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                         {/* Status Update Section */}
                         <Box sx={{ 
                           p: 2, 
                           bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50', 
                           borderRadius: 2,
                           border: `1px solid ${theme.palette.divider}`
                         }}>
                           <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                             Update Service Status
                           </Typography>
                           <FormControl fullWidth size="small">
                             <InputLabel>Select Status</InputLabel>
                             <Select
                               value={serviceStatus}
                               onChange={(e) => handleStatusChange(e.target.value)}
                               label="Select Status"
                               sx={{ textTransform: 'none' }}
                             >
                               <MenuItem value="pending">
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <Warning color="default" />
                                   <Typography>Pending</Typography>
                                 </Box>
                               </MenuItem>
                               <MenuItem value="on_the_way">
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <DirectionsCarFilled color="info" />
                                   <Typography>On the Way</Typography>
                                 </Box>
                               </MenuItem>
                               <MenuItem value="picked_up">
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <PersonAdd color="warning" />
                                   <Typography>Picked Up</Typography>
                                 </Box>
                               </MenuItem>
                               <MenuItem value="completed">
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <CheckCircleOutline color="success" />
                                   <Typography>Completed</Typography>
                                 </Box>
                               </MenuItem>
                             </Select>
                           </FormControl>
                         </Box>
                       </Box>
                     ))}
                   </Box>
                 ) : (
                   <Alert severity="info" sx={{ mb: 2 }}>
                     No services added yet. Click "Add Service" to add service details.
                   </Alert>
                 )}
               </CardContent>
             </Card>
           </Box>

        

        {/* Add Service Side Panel */}
        <Drawer
          anchor="right"
          open={showAddServiceDrawer}
          onClose={() => setShowAddServiceDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: { xs: '100%', sm: 500 },
              p: 3,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
               <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                 {isEditing ? 'Edit Service Details' : 'Add Service Details'}
               </Typography>
               <IconButton onClick={() => {
                 setShowAddServiceDrawer(false);
                 setIsEditing(false);
                 setEditingServiceId(null);
                 setNewService({
                   pickupLocation: '',
                   dropLocation: '',
                   vehicleType: '',
                   totalDistance: '',
                   costPerKm: '',
                   baseCharge: '',
                   waivePayment: false,
                   notifyUser: false
                 });
               }}>
                 <Close />
               </IconButton>
             </Box>

            {/* Form Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {/* Location Details */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                Location Details
              </Typography>
              
              <TextField
                fullWidth
                label="Pickup Location"
                value={newService.pickupLocation}
                onChange={(e) => setNewService(prev => ({ ...prev, pickupLocation: e.target.value }))}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Drop Location"
                value={newService.dropLocation}
                onChange={(e) => setNewService(prev => ({ ...prev, dropLocation: e.target.value }))}
                sx={{ mb: 3 }}
              />

              {/* Vehicle Type */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                Vehicle Details
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={newService.vehicleType}
                  onChange={(e) => setNewService(prev => ({ ...prev, vehicleType: e.target.value }))}
                  label="Vehicle Type"
                >
                  <MenuItem value="Basic Ambulance">Basic Ambulance</MenuItem>
                  <MenuItem value="Advanced Life Support">Advanced Life Support</MenuItem>
                  <MenuItem value="ICU Ambulance">ICU Ambulance</MenuItem>
                  <MenuItem value="Neonatal Ambulance">Neonatal Ambulance</MenuItem>
                  <MenuItem value="Cardiac Ambulance">Cardiac Ambulance</MenuItem>
                </Select>
              </FormControl>

              {/* Fare Details */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                Fare Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Distance (km)"
                    type="number"
                    value={newService.totalDistance}
                    onChange={(e) => setNewService(prev => ({ ...prev, totalDistance: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cost per km (₹)"
                    type="number"
                    value={newService.costPerKm}
                    onChange={(e) => setNewService(prev => ({ ...prev, costPerKm: e.target.value }))}
                  />
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                label="Base Charge (₹)"
                type="number"
                value={newService.baseCharge}
                onChange={(e) => setNewService(prev => ({ ...prev, baseCharge: e.target.value }))}
                sx={{ mb: 3 }}
              />

              {/* Options */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                Options
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.waivePayment}
                    onChange={(e) => setNewService(prev => ({ ...prev, waivePayment: e.target.checked }))}
                  />
                }
                label="Waive Payment (Optional)"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.notifyUser}
                    onChange={(e) => setNewService(prev => ({ ...prev, notifyUser: e.target.checked }))}
                  />
                }
                label="Notify User"
                sx={{ mb: 3 }}
              />

              {/* Total Calculation */}
              {newService.totalDistance && newService.costPerKm && newService.baseCharge && (
                <Box sx={{ p: 2, bgcolor: theme.palette.background.default, borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Fare Calculation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distance: {newService.totalDistance} km × ₹{newService.costPerKm} = ₹{(parseFloat(newService.totalDistance) * parseFloat(newService.costPerKm)).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base Charge: ₹{newService.baseCharge}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Total: ₹{((parseFloat(newService.totalDistance) * parseFloat(newService.costPerKm)) + parseFloat(newService.baseCharge)).toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowAddServiceDrawer(false)}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
                             <Button
                 variant="contained"
                 fullWidth
                 onClick={handleAddService}
                 sx={{ textTransform: 'none' }}
               >
                 {isEditing ? 'Update Service' : 'Add Service'}
               </Button>
            </Box>
          </Box>
                 </Drawer>

         {/* Status Menu */}
         <Menu
           anchorEl={statusMenuAnchor}
           open={Boolean(statusMenuAnchor)}
           onClose={handleStatusMenuClose}
           PaperProps={{
             sx: {
               mt: 1,
               minWidth: 200,
               boxShadow: theme.shadows[8],
               borderRadius: 2
             }
           }}
         >
           <MenuItem onClick={() => handleStatusChange('on_the_way')}>
             <ListItemIcon>
               <DirectionsCarFilled color="info" />
             </ListItemIcon>
             <ListItemText 
               primary="On the Way" 
               primaryTypographyProps={{ fontWeight: 600 }}
             />
           </MenuItem>
           <MenuItem onClick={() => handleStatusChange('picked_up')}>
             <ListItemIcon>
               <PersonAdd color="warning" />
             </ListItemIcon>
             <ListItemText 
               primary="Picked Up" 
               primaryTypographyProps={{ fontWeight: 600 }}
             />
           </MenuItem>
           <MenuItem onClick={() => handleStatusChange('completed')}>
             <ListItemIcon>
               <CheckCircleOutline color="success" />
             </ListItemIcon>
             <ListItemText 
               primary="Completed" 
               primaryTypographyProps={{ fontWeight: 600 }}
             />
           </MenuItem>
         </Menu>
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
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorProcessOrder; 