import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Tabs, 
  Tab, 
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Modal,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllOrders, confirmOrder, searchMedicines, addToUserCart, getCartItems, deleteCartItem, updateCartItemQuantity, updateOrderStatus } from '../../../services/Vendors/MedicalStoreVendor.service';
import { Toast, ToastContainer } from '../../ui/Toast';

function MedicalStoreVendorProcessOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsLoading, setCartItemsLoading] = useState(false);
  const [deletingCartItem, setDeletingCartItem] = useState(null);
  const [updatingQuantity, setUpdatingQuantity] = useState(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionMedicines, setSelectedPrescriptionMedicines] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // TODO: Replace with actual vendorId from auth context or props
  const vendorId = 'c29e0298-b239-48df-9f11-4e21c8727f93';

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await getAllOrders(vendorId);
        const foundOrder = response.orders?.find(o => o.orderId === orderId);
        setOrder(foundOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, vendorId]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!order?.orderId) return;
      
      setCartItemsLoading(true);
      try {
        const response = await getCartItems(order.orderId);
        setCartItems(response.cartItems || []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      } finally {
        setCartItemsLoading(false);
      }
    };
    fetchCartItems();
  }, [order?.orderId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(order.orderId, newStatus);
      // Update the order status locally
      setOrder(prev => ({ ...prev, orderStatus: newStatus }));
      // Show success toast
      addToast('success', 'Success', `Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to update order status. Please try again.');
    } finally {
      handleMenuClose();
    }
  };

  const handleBack = () => {
    navigate('/vendor/pharmacy/orders');
  };

  const handleAddMedicine = (medicine) => {
    setSelectedMedicines(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...medicine, quantity: 1 }];
      }
    });
    
    // Clear search without showing toast
    setSearch('');
    setSearchResults([]);
  };

  const handleIncreaseQuantity = (medicineId) => {
    setSelectedMedicines(prev => 
      prev.map(item => 
        item.id === medicineId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (medicineId) => {
    setSelectedMedicines(prev => 
      prev.map(item => 
        item.id === medicineId 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleDeleteMedicine = (medicineId) => {
    setSelectedMedicines(prev => prev.filter(item => item.id !== medicineId));
  };

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSearch = async (searchTerm) => {
    console.log('Searching for:', searchTerm);
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await searchMedicines(searchTerm, vendorId);
      console.log('Search response:', response);
      setSearchResults(response.medicines || []);
    } catch (error) {
      console.error('Error searching medicines:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('Search input changed to:', value);
    setSearch(value);
    
    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set new timeout for debounced search
    window.searchTimeout = setTimeout(() => {
      console.log('Executing search for:', value);
      if (value.trim()) {
        handleSearch(value);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms delay
  };

  const handleConfirmOrder = async () => {
    if (!order) return;
    
    setConfirmingOrder(true);
    try {
      await confirmOrder(order.orderId, vendorId);
      // Update the order status locally
      setOrder(prev => ({ ...prev, orderStatus: 'Confirmed' }));
      // Show success toast
      addToast('success', 'Success', 'Order confirmed successfully!');
    } catch (error) {
      console.error('Error confirming order:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to confirm order. Please try again.');
    } finally {
      setConfirmingOrder(false);
    }
  };

  const handleAddToUserCart = async () => {
    if (!order || selectedMedicines.length === 0) {
      addToast('error', 'Error', 'Please add medicines before adding to cart.');
      return;
    }

    setAddingToCart(true);
    try {
      // Add each selected medicine to the user cart
      const cartPromises = selectedMedicines.map(medicine => 
        addToUserCart({
          productId: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: medicine.quantity,
          orderId: order.orderId
        })
      );

      await Promise.all(cartPromises);
      
      // Update order status to "AddedItemsInCart"
      try {
        await updateOrderStatus(order.orderId, 'AddedItemsInCart');
        // Update the order status locally
        setOrder(prev => ({ ...prev, orderStatus: 'AddedItemsInCart' }));
      } catch (statusError) {
        console.error('Error updating order status:', statusError);
        // Don't show error toast for status update failure as cart items were added successfully
      }
      
      // Show success toast
      addToast('success', 'Success', `${selectedMedicines.length} medicine(s) added to user cart successfully!`);
      
      // Clear selected medicines after successful addition
      setSelectedMedicines([]);
    } catch (error) {
      console.error('Error adding items to user cart:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to add items to user cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleDeleteCartItem = async (cartId, itemName) => {
    setDeletingCartItem(cartId);
    try {
      await deleteCartItem(cartId);
      
      // Remove the item from local state
      setCartItems(prev => prev.filter(item => item.cartId !== cartId));
      
      // Show success toast
      addToast('success', 'Success', `${itemName} removed from cart successfully!`);
    } catch (error) {
      console.error('Error deleting cart item:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to remove item from cart. Please try again.');
    } finally {
      setDeletingCartItem(null);
    }
  };

  const handleUpdateQuantity = async (cartId, type, itemName) => {
    setUpdatingQuantity(cartId);
    try {
      const response = await updateCartItemQuantity(cartId, type);
      
      // Update the item quantity in local state
      setCartItems(prev => prev.map(item => 
        item.cartId === cartId 
          ? { ...item, quantity: response.cartItem.quantity }
          : item
      ));
      
      // Show success toast
      const action = type === 'increment' ? 'increased' : 'decreased';
      addToast('success', 'Success', `${itemName} quantity ${action} successfully!`);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to update quantity. Please try again.');
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const handleOpenPrescriptionModal = () => {
    setPrescriptionModalOpen(true);
    // Initialize selected medicines from JSON prescription
    if (order?.jsonPrescription?.medicines) {
      setSelectedPrescriptionMedicines(
        order.jsonPrescription.medicines.map(medicine => ({
          ...medicine,
          checked: false
        }))
      );
    }
  };

  const handleClosePrescriptionModal = () => {
    setPrescriptionModalOpen(false);
    setSelectedPrescriptionMedicines([]);
  };

  const handlePrescriptionMedicineToggle = (medicineIndex) => {
    setSelectedPrescriptionMedicines(prev => 
      prev.map((medicine, index) => 
        index === medicineIndex 
          ? { ...medicine, checked: !medicine.checked }
          : medicine
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading order details...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  // Transform search results to match the expected format
  const medicines = searchResults.map(medicine => ({
    id: medicine.productId,
    name: medicine.name,
    manufacturer: medicine.manufacturer,
    price: medicine.price,
    packSize: medicine.packSizeLabel,
    composition: medicine.shortComposition,
    discount: medicine.discount
  }));

  console.log('Current tab:', tab);
  console.log('Search results count:', searchResults.length);
  console.log('Medicines array:', medicines);

  return (
    <>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1200px', 
        marginX: 'auto', 
        width: '100%',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Process Order
        </Typography>
      </Box>

      {/* Order Details Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Order ID: {order.orderId}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                Customer: {order.User?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Status: {order.orderStatus}
              </Typography>
            </Box>
                         <Box>
               <Button 
                 variant="outlined" 
                 size="small" 
                 sx={{ mr: 1 }}
                 onClick={handleOpenPrescriptionModal}
               >
                 View Prescription
               </Button>
               
               {/* Status Display */}
                                <Box 
                   sx={{ 
                     display: 'inline-block',
                     px: 2, py: 1, borderRadius: 3,
                     fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase',
                     letterSpacing: '0.3px', minWidth: '80px', textAlign: 'center', mr: 1,
                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                     ...(order.orderStatus === 'Pending' && {
                       backgroundColor: '#FFF3E0',
                       color: '#E65100',
                       border: '2px solid #FFCC02',
                       borderRadius: '20px'
                     }),
                     ...(order.orderStatus === 'PrescriptionVerified' && {
                       backgroundColor: '#E3F2FD',
                       color: '#1565C0',
                       border: '2px solid #2196F3',
                       borderRadius: '20px'
                     }),
                     ...(order.orderStatus === 'Confirmed' && {
                       backgroundColor: '#E8F5E8',
                       color: '#2E7D32',
                       border: '2px solid #C8E6C9',
                       borderRadius: '20px'
                     }),
                     ...(order.orderStatus === 'AddedItemsInCart' && {
                       backgroundColor: '#F3E5F5',
                       color: '#7B1FA2',
                       border: '2px solid #CE93D8',
                       borderRadius: '20px'
                     }),
                     ...(order.orderStatus === 'ReadyToPickup' && {
                       backgroundColor: '#E0F2F1',
                       color: '#00695C',
                       border: '2px solid #80CBC4',
                       borderRadius: '20px'
                     }),
                     ...(order.orderStatus === 'OutForDelivery' && {
                       backgroundColor: '#FFF8E1',
                       color: '#F57F17',
                       border: '2px solid #FFD54F',
                       borderRadius: '20px'
                     }),
                     ...(order.orderStatus === 'Delivered' && {
                       backgroundColor: '#E8F5E8',
                       color: '#2E7D32',
                       border: '2px solid #C8E6C9',
                       borderRadius: '20px'
                     })
                   }}
                 >
                 {order.orderStatus}
               </Box>
               
               {/* Confirm Order Button - Only show when status is PrescriptionVerified */}
               {order.orderStatus === 'PrescriptionVerified' && (
                 <Button 
                   variant="contained" 
                   size="small" 
                   sx={{ mr: 1 }}
                   onClick={handleConfirmOrder}
                   disabled={confirmingOrder}
                 >
                   {confirmingOrder ? 'Confirming...' : 'Confirm Order'}
                 </Button>
               )}
               <IconButton onClick={handleMenuOpen} size="small">
                 <MoreVertIcon />
               </IconButton>
               <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                 <MenuItem onClick={() => handleStatusUpdate('ReadyForPickup')}>
                   Ready to Pickup
                 </MenuItem>
                 <MenuItem onClick={() => handleStatusUpdate('OutForDelivery')}>
                   Out for Delivery
                 </MenuItem>
                 <MenuItem onClick={() => handleStatusUpdate('Delivered')}>
                   Delivered
                 </MenuItem>
               </Menu>
             </Box>
          </Box>
        </CardContent>
      </Card>

             {/* Search Box - Centered with Icon */}
       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
         <TextField
           label="Search Medicines"
           variant="outlined"
           size="small"
           value={search}
           onChange={handleSearchChange}
           sx={{ maxWidth: 400, width: '100%' }}
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <SearchIcon color="action" />
               </InputAdornment>
             ),
             endAdornment: searchLoading && (
               <InputAdornment position="end">
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                   <Box sx={{ width: 16, height: 16, border: '2px solid #ccc', borderTop: '2px solid #2196f3', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                 </Box>
               </InputAdornment>
             ),
           }}
         />
       </Box>

                               {/* Search Results Dropdown */}
         {searchResults.length > 0 && !searchLoading && (
           <Box sx={{ 
             display: 'flex', 
             justifyContent: 'center', 
             mb: 2,
             position: 'relative'
           }}>
             <Card sx={{ 
               maxWidth: 400, 
               width: '100%', 
               maxHeight: 300, 
               overflow: 'auto',
               boxShadow: (theme) => theme.shadows[4],
               border: (theme) => `1px solid ${theme.palette.divider}`
             }}>
               <Box sx={{ p: 1 }}>
                 <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600 }}>
                   Search Results ({searchResults.length})
                 </Typography>
                 {searchResults.map((medicine) => {
                   const transformedMedicine = {
                     id: medicine.productId,
                     name: medicine.name,
                     manufacturer: medicine.manufacturer,
                     price: medicine.price,
                     packSize: medicine.packSizeLabel,
                     composition: medicine.shortComposition,
                     discount: medicine.discount
                   };
                   
                   return (
                     <Card 
                       key={medicine.productId} 
                       sx={{ 
                         mb: 1,
                         border: (theme) => `1px solid ${theme.palette.divider}`,
                         borderRadius: 1,
                         transition: 'all 0.2s ease',
                         cursor: 'pointer',
                         '&:hover': {
                           boxShadow: (theme) => theme.shadows[2],
                           borderColor: 'primary.main',
                           bgcolor: (theme) => theme.palette.action.hover
                         }
                       }}
                       onClick={() => handleAddMedicine(transformedMedicine)}
                     >
                       <CardContent sx={{ p: 2 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Box sx={{ flex: 1 }}>
                             <Typography 
                               variant="body1" 
                               sx={{ 
                                 fontWeight: 600, 
                                 color: 'text.primary',
                                 fontSize: '1rem'
                               }}
                             >
                               {medicine.name}
                             </Typography>
                             <Typography 
                               variant="body2" 
                               sx={{ 
                                 color: 'text.secondary',
                                 mt: 0.5
                               }}
                             >
                               ₹{medicine.price} per unit • {medicine.manufacturer}
                             </Typography>
                           </Box>
                           
                           <Button 
                             variant="contained" 
                             size="small"
                             sx={{ 
                               fontWeight: 600,
                               textTransform: 'none',
                               px: 2
                             }}
                           >
                             Add
                           </Button>
                         </Box>
                       </CardContent>
                     </Card>
                   );
                 })}
               </Box>
             </Card>
           </Box>
         )}

             {/* Tabs for Selected and Available Medicines */}
       <Box sx={{ mt: 3 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
           <Tabs
             value={tab}
             onChange={(_, v) => setTab(v)}
             sx={{ '& .MuiTab-root': { mx: 2 } }}
           >
             <Tab label="Newly Added" />
             <Tab label="Past Added" />
           </Tabs>
           
           <Button 
             variant="contained" 
             color="primary" 
             size="medium"
             onClick={handleAddToUserCart}
             disabled={addingToCart || selectedMedicines.length === 0}
             sx={{ 
               minWidth: 150,
               fontWeight: 600
             }}
           >
             {addingToCart ? 'Adding to Cart...' : 'Add to User Cart'}
           </Button>
         </Box>
         
                                       {tab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Newly Added Medicines
              </Typography>
              
              {selectedMedicines.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center', bgcolor: (theme) => theme.palette.action.hover }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                    No medicines added
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    Search and add medicines from the Available Medicines tab
                  </Typography>
                </Card>
              ) : (
               <Box sx={{ display: 'grid', gap: 1 }}>
                 {selectedMedicines.map((medicine) => (
                   <Card 
                     key={medicine.id} 
                     sx={{ 
                       border: (theme) => `1px solid ${theme.palette.divider}`,
                       borderRadius: 1,
                       transition: 'all 0.3s ease',
                       '&:hover': {
                         boxShadow: (theme) => theme.shadows[2],
                         borderColor: 'primary.main'
                       }
                     }}
                   >
                     <CardContent sx={{ p: 2 }}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Box sx={{ flex: 1 }}>
                           <Typography 
                             variant="body1" 
                             sx={{ 
                               fontWeight: 600, 
                               color: 'text.primary',
                               fontSize: '1rem'
                             }}
                           >
                             {medicine.name}
                           </Typography>
                           <Typography 
                             variant="body2" 
                             sx={{ 
                               color: 'text.secondary',
                               mt: 0.5
                             }}
                           >
                             ₹{medicine.price} per unit
                           </Typography>
                         </Box>
                         
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <IconButton 
                             size="small"
                             onClick={() => handleDecreaseQuantity(medicine.id)}
                             sx={{ 
                               bgcolor: (theme) => theme.palette.action.hover,
                               '&:hover': { 
                                 bgcolor: (theme) => theme.palette.action.selected 
                               }
                             }}
                           >
                             <RemoveIcon fontSize="small" />
                           </IconButton>
                           
                           <Typography 
                             variant="body1" 
                             sx={{ 
                               minWidth: 30, 
                               textAlign: 'center',
                               fontWeight: 600,
                               color: 'text.primary'
                             }}
                           >
                             {medicine.quantity}
                           </Typography>
                           
                           <IconButton 
                             size="small"
                             onClick={() => handleIncreaseQuantity(medicine.id)}
                             sx={{ 
                               bgcolor: (theme) => theme.palette.action.hover,
                               '&:hover': { 
                                 bgcolor: (theme) => theme.palette.action.selected 
                               }
                             }}
                           >
                             <AddIcon fontSize="small" />
                           </IconButton>
                           
                           <IconButton 
                             size="small"
                             onClick={() => handleDeleteMedicine(medicine.id)}
                             sx={{ 
                               color: 'error.main',
                               '&:hover': { 
                                 bgcolor: (theme) => theme.palette.error.light,
                                 color: 'error.dark'
                               }
                             }}
                           >
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                         </Box>
                       </Box>
                     </CardContent>
                   </Card>
                 ))}
               </Box>
             )}
           </Box>
         )}
         
                   {tab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Past Added Medicines
              </Typography>
             
              {cartItemsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <Typography>Loading cart items...</Typography>
                </Box>
              ) : cartItems.length === 0 ? (
                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      No cart items found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                      Items added to user cart will appear here
                    </Typography>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {cartItems.map((item) => (
                    <Card 
                      key={item.cartId} 
                      sx={{ 
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: (theme) => theme.shadows[2],
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600, 
                                color: 'text.primary',
                                fontSize: '1rem'
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary',
                                mt: 0.5
                              }}
                            >
                              ₹{item.price} per unit • Quantity: {item.quantity}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                mt: 0.5,
                                display: 'block'
                              }}
                            >
                              Added on: {new Date(item.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                              <IconButton 
                                size="small"
                                onClick={() => handleUpdateQuantity(item.cartId, 'decrement', item.name)}
                                disabled={updatingQuantity === item.cartId}
                                sx={{ 
                                  bgcolor: (theme) => theme.palette.action.hover,
                                  '&:hover': { 
                                    bgcolor: (theme) => theme.palette.action.selected 
                                  },
                                  '&:disabled': {
                                    opacity: 0.6
                                  }
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  minWidth: 30, 
                                  textAlign: 'center',
                                  fontWeight: 600,
                                  color: 'text.primary'
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              
                              <IconButton 
                                size="small"
                                onClick={() => handleUpdateQuantity(item.cartId, 'increment', item.name)}
                                disabled={updatingQuantity === item.cartId}
                                sx={{ 
                                  bgcolor: (theme) => theme.palette.action.hover,
                                  '&:hover': { 
                                    bgcolor: (theme) => theme.palette.action.selected 
                                  },
                                  '&:disabled': {
                                    opacity: 0.6
                                  }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'inline-block',
                              px: 2, py: 1, borderRadius: 2,
                              backgroundColor: '#E8F5E8',
                              color: '#2E7D32',
                              fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase',
                              letterSpacing: '0.3px', border: '1px solid #C8E6C9'
                            }}>
                              In Cart
                            </Box>
                            
                            <IconButton 
                              size="small"
                              onClick={() => handleDeleteCartItem(item.cartId, item.name)}
                              disabled={deletingCartItem === item.cartId}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { 
                                  bgcolor: (theme) => theme.palette.error.light,
                                  color: 'error.dark'
                                },
                                '&:disabled': {
                                  opacity: 0.6
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
           </Box>
         )}
       </Box>


     </Box>
     
     {/* Toast Container */}
     <ToastContainer toasts={toasts} removeToast={removeToast} />

     {/* Prescription Modal */}
     <Modal
       open={prescriptionModalOpen}
       onClose={handleClosePrescriptionModal}
       aria-labelledby="prescription-modal-title"
       sx={{
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         p: 2
       }}
     >
       <Box sx={{
         width: '90%',
         maxWidth: 1200,
         maxHeight: '90vh',
         bgcolor: 'background.paper',
         borderRadius: 2,
         boxShadow: 24,
         overflow: 'hidden',
         display: 'flex',
         flexDirection: 'column'
       }}>
         {/* Modal Header */}
         <Box sx={{
           p: 3,
           borderBottom: 1,
           borderColor: 'divider',
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center'
         }}>
           <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
             Prescription Details
           </Typography>
           <Button onClick={handleClosePrescriptionModal} color="inherit">
             ✕
           </Button>
         </Box>

         {/* Modal Content */}
         <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
           {/* Left Side - Prescription Image */}
           <Box sx={{ 
             flex: 1, 
             p: 3, 
             borderRight: 1, 
             borderColor: 'divider',
             overflow: 'auto'
           }}>
             <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
               Prescription Image
             </Typography>
             {order?.jsonPrescription?.prescriptionUrl ? (
               <img 
                 src={order.jsonPrescription.prescriptionUrl} 
                 alt="Prescription"
                 style={{ 
                   width: '100%', 
                   height: 'auto',
                   maxHeight: '60vh',
                   objectFit: 'contain'
                 }}
               />
             ) : (
               <Typography color="text.secondary">
                 No prescription image available
               </Typography>
             )}
           </Box>

           {/* Right Side - JSON Prescription Medicines */}
           <Box sx={{ 
             flex: 1, 
             p: 3, 
             overflow: 'auto'
           }}>
             <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
               Prescribed Medicines
             </Typography>
             
             {selectedPrescriptionMedicines.length > 0 ? (
               <Box>
                 <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                   Select medicines from the prescription:
                 </Typography>
                 
                 {selectedPrescriptionMedicines.map((medicine, index) => (
                   <Card key={index} sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
                     <CardContent sx={{ p: 2 }}>
                       <FormControlLabel
                         control={
                           <Checkbox
                             checked={medicine.checked}
                             onChange={() => handlePrescriptionMedicineToggle(index)}
                             color="primary"
                           />
                         }
                         label={
                           <Box>
                             <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                               {medicine.name}
                             </Typography>
                             <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Dosage: {medicine.dosage}
                             </Typography>
                             <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Duration: {medicine.duration}
                             </Typography>
                             <Typography variant="body2" color="text.secondary">
                               Frequency: {medicine.frequency}
                             </Typography>
                           </Box>
                         }
                         sx={{ width: '100%', m: 0 }}
                       />
                     </CardContent>
                   </Card>
                 ))}
                 
                 <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                   <Button 
                     variant="outlined" 
                     onClick={handleClosePrescriptionModal}
                     sx={{ flex: 1 }}
                   >
                     Close
                   </Button>
                   <Button 
                     variant="contained" 
                     onClick={() => {
                       const selectedMedicines = selectedPrescriptionMedicines.filter(m => m.checked);
                       if (selectedMedicines.length > 0) {
                         // Add selected medicines to the newly added medicines
                         setSelectedMedicines(prev => [
                           ...prev,
                           ...selectedMedicines.map(medicine => ({
                             id: `prescription-${medicine.name}`,
                             name: medicine.name,
                             price: 0, // You might want to set a default price
                             quantity: 1
                           }))
                         ]);
                         addToast('success', 'Success', `${selectedMedicines.length} medicine(s) added from prescription!`);
                         handleClosePrescriptionModal();
                       } else {
                         addToast('error', 'Error', 'Please select at least one medicine from the prescription.');
                       }
                     }}
                     sx={{ flex: 1 }}
                   >
                     Add Selected Medicines
                   </Button>
                 </Box>
               </Box>
             ) : (
               <Typography color="text.secondary">
                 No medicines found in prescription
               </Typography>
             )}
           </Box>
         </Box>
       </Box>
     </Modal>
   </>
 );
}

export default MedicalStoreVendorProcessOrderPage; 