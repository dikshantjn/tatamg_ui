import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle, AccessTime, DoneAll, Phone, Close, Check, Sync, LocalShipping, DeliveryDining, Inbox } from '@mui/icons-material';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import ProductVendorLayout from './ProductVendorLayout';
import { getPendingOrders, getConfirmedOrders, getDeliveredOrders, updateOrderStatus } from '../../../services/Vendors/product-partner.service';
import { toast } from 'react-toastify';

const mockOrders = [
  {
    id: 1,
    customer: 'Kapil Kalyani',
    phone: '+919370320067',
    status: 'delivered',
    amount: 6197.21,
    date: '2025-06-28T10:08:00',
    items: 1,
    details: {
      email: 'kapilkalyani@gmail.com',
      location: 'Market Yard',
      city: 'Pune',
      products: [
        { name: 'Product 12', category: 'Dental Care', qty: 1, price: 2083.35 }
      ],
      total: 4852.32
    }
  },
  {
    id: 2,
    customer: 'Kapil Kalyani',
    phone: '+919370320067',
    status: 'delivered',
    amount: 4852.32,
    date: '2025-06-28T10:22:00',
    items: 1,
    details: {
      email: 'kapilkalyani@gmail.com',
      location: 'Market Yard',
      city: 'Pune',
      products: [
        { name: 'Product 12', category: 'Dental Care', qty: 1, price: 2083.35 }
      ],
      total: 4852.32
    }
  },
  {
    id: 3,
    customer: 'Kapil Kalyani',
    phone: '+919370320067',
    status: 'delivered',
    amount: 2083.35,
    date: '2025-06-30T06:43:00',
    items: 1,
    details: {
      email: 'kapilkalyani@gmail.com',
      location: 'Market Yard',
      city: 'Pune',
      products: [
        { name: 'Product 12', category: 'Dental Care', qty: 1, price: 2083.35 }
      ],
      total: 2083.35
    }
  }
];

const statusTabs = [
  { label: 'Pending', value: 'pending', icon: <AccessTime /> },
  { label: 'Processing', value: 'processing', icon: <DoneAll /> },
  { label: 'Completed', value: 'delivered', icon: <CheckCircle /> }
];

// Status progression configuration
const statusConfig = {
  'confirmed': {
    'nextStatus': 'processing',
    'buttonText': 'Start Processing',
    'icon': <Sync />,
    'color': '#2196F3'
  },
  'processing': {
    'nextStatus': 'shipped',
    'buttonText': 'Mark as Shipped',
    'icon': <LocalShipping />,
    'color': '#FF9800'
  },
  'shipped': {
    'nextStatus': 'out_for_delivery',
    'buttonText': 'Out for Delivery',
    'icon': <DeliveryDining />,
    'color': '#9C27B0'
  },
  'out_for_delivery': {
    'nextStatus': 'delivered',
    'buttonText': 'Mark as Delivered',
    'icon': <CheckCircle />,
    'color': '#4CAF50'
  }
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) + ' • ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const ProductVendorOrdersContent = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const [tab, setTab] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock vendor ID - in real app, this would come from auth context
  const vendorId = '90b25903-6c37-4a9d-a582-629bb5ccc660';

  useEffect(() => {
    if (tab === 'pending') {
      fetchPendingOrders();
    } else if (tab === 'processing') {
      fetchConfirmedOrders();
    } else if (tab === 'delivered') {
      fetchDeliveredOrders();
    }
  }, [tab]);

  const fetchPendingOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPendingOrders(vendorId);
      setPendingOrders(response.pendingOrders || []);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to fetch pending orders. Please try again.');
      toast.error('Failed to fetch pending orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfirmedOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getConfirmedOrders(vendorId);
      setConfirmedOrders(response.confirmedOrders || []);
    } catch (err) {
      console.error('Error fetching confirmed orders:', err);
      setError('Failed to fetch confirmed orders. Please try again.');
      toast.error('Failed to fetch confirmed orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeliveredOrders(vendorId);
      setDeliveredOrders(response.deliveredOrders || []);
    } catch (err) {
      console.error('Error fetching delivered orders:', err);
      setError('Failed to fetch delivered orders. Please try again.');
      toast.error('Failed to fetch delivered orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      // Call the API to update order status to 'confirmed'
      const response = await updateOrderStatus(orderId, 'confirmed');
      
      // Show success toast with the message from API
      toast.success(response.message || 'Order accepted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Refresh pending orders to reflect the change
      await fetchPendingOrders();
    } catch (err) {
      console.error('Error accepting order:', err);
      toast.error('Failed to accept order. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleStatusUpdate = async (orderId, currentStatus) => {
    try {
      const nextStatus = statusConfig[currentStatus]?.nextStatus;
      if (!nextStatus) {
        toast.error('Invalid status progression');
        return;
      }

      const response = await updateOrderStatus(orderId, nextStatus);
      
      // Show success toast with the message from API
      toast.success(response.message || `Order status updated to ${nextStatus}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Refresh the appropriate orders list
      if (tab === 'pending') {
        await fetchPendingOrders();
      } else if (tab === 'processing') {
        await fetchConfirmedOrders();
      } else if (tab === 'delivered') {
        await fetchDeliveredOrders();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getFilteredOrders = () => {
    if (tab === 'pending') {
      return pendingOrders;
    } else if (tab === 'processing') {
      return confirmedOrders;
    } else if (tab === 'delivered') {
      return deliveredOrders;
    }
    // For other tabs, return mock data
    return mockOrders.filter(o => o.status === tab);
  };

  return (
    <ProductVendorLayout title="Orders" notificationCount={0}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 3 }, width: '100%' }}>
        {/* Tabs */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                color: theme.palette.text.secondary,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: 16,
                py: 2,
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            }}
                        textColor="primary"
            indicatorColor="primary"
          >
            {statusTabs.map(t => (
              <Tab
                key={t.value}
                value={t.value}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {t.icon}
                    <span style={{ fontWeight: 600 }}>{t.label}</span>
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Order Boxes in Grid */}
        {getFilteredOrders().length > 0 ? (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            justifyContent: 'center',
          }}>
            {getFilteredOrders().map(order => {
            // Handle both API data structure and mock data
            const isApiOrder = order.orderId; // API orders have orderId
            const customerName = isApiOrder ? order.user?.name : order.customer;
            const phone = isApiOrder ? order.user?.phone_number : order.phone;
            const amount = isApiOrder ? order.totalAmount : order.amount;
            const date = isApiOrder ? order.placedAt : order.date;
            const itemsCount = isApiOrder ? order.items?.length : order.items;
            const status = isApiOrder ? order.status : 'delivered';
            
            return (
              <Card key={isApiOrder ? order.orderId : order.id} sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                minHeight: 200,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderColor: theme.palette.primary.main,
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                  {/* Left: Main Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize={16} color={theme.palette.text.primary} mb={0.5}>
                      {customerName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Phone sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 0.5 }} />
                      <Typography fontSize={13} color={theme.palette.text.secondary}>{phone}</Typography>
                    </Box>
                    <Typography fontSize={12} color={theme.palette.text.secondary} mb={0.5}>
                      Items <b>{itemsCount}</b> • {formatDate(date)}
                    </Typography>
                  </Box>
                  {/* Right: Status and Amount */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, minWidth: 80 }}>
                    <Box sx={{
                      bgcolor: (() => {
                        switch (status) {
                          case 'pending':
                            return isDarkMode ? 'rgba(255, 152, 0, 0.12)' : '#FFF3E0';
                          case 'confirmed':
                            return isDarkMode ? 'rgba(33, 150, 243, 0.12)' : '#E3F2FD';
                          case 'processing':
                            return isDarkMode ? 'rgba(255, 152, 0, 0.12)' : '#FFF3E0';
                          case 'shipped':
                            return isDarkMode ? 'rgba(156, 39, 176, 0.12)' : '#F3E5F5';
                          case 'out_for_delivery':
                            return isDarkMode ? 'rgba(156, 39, 176, 0.12)' : '#F3E5F5';
                          case 'delivered':
                            return isDarkMode ? 'rgba(76, 175, 80, 0.12)' : '#E8F5E8';
                          default:
                            return isDarkMode ? 'rgba(139, 104, 255, 0.12)' : '#F3F0FF';
                        }
                      })(),
                      color: (() => {
                        switch (status) {
                          case 'pending':
                            return '#FF9800';
                          case 'confirmed':
                            return '#2196F3';
                          case 'processing':
                            return '#FF9800';
                          case 'shipped':
                            return '#9C27B0';
                          case 'out_for_delivery':
                            return '#9C27B0';
                          case 'delivered':
                            return '#4CAF50';
                          default:
                            return theme.palette.primary.main;
                        }
                      })(),
                      px: 1.5,
                      py: 0.25,
                      borderRadius: 1.5,
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      {status.replace('_', ' ').toUpperCase()}
                    </Box>
                    <Typography fontWeight={700} fontSize={16} color={theme.palette.primary.main}>
                      ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.5,
                      fontSize: 12,
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.1)' : '#F3F0FF',
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </Button>
                  {status === 'pending' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Check sx={{ fontSize: 16 }} />}
                      sx={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 1.5,
                        px: 2,
                        py: 0.5,
                        fontSize: 12,
                        '&:hover': {
                          backgroundColor: '#45a049',
                        }
                      }}
                      onClick={() => handleAcceptOrder(isApiOrder ? order.orderId : order.id)}
                    >
                      Accept
                    </Button>
                  )}
                  {statusConfig[status] && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={React.cloneElement(statusConfig[status].icon, { sx: { fontSize: 16 } })}
                      sx={{
                        backgroundColor: statusConfig[status].color,
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 1.5,
                        px: 2,
                        py: 0.5,
                        fontSize: 12,
                        '&:hover': {
                          backgroundColor: statusConfig[status].color,
                          opacity: 0.9,
                        }
                      }}
                      onClick={() => handleStatusUpdate(isApiOrder ? order.orderId : order.id, status)}
                    >
                      {statusConfig[status].buttonText}
                    </Button>
                  )}
                                  </Box>
                </Card>
              );
            })}
          </Box>
        ) : (
          // No orders found message
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 2,
            textAlign: 'center'
          }}>
            <Inbox sx={{
              fontSize: 64,
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.6
            }} />
            <Typography variant="h6" sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              mb: 1
            }}>
              No Orders Found
            </Typography>
            <Typography variant="body2" sx={{
              color: theme.palette.text.secondary,
              opacity: 0.8,
              maxWidth: 300
            }}>
              {tab === 'pending' && 'No pending orders at the moment.'}
              {tab === 'processing' && 'No orders are currently being processed.'}
              {tab === 'delivered' && 'No completed orders found.'}
            </Typography>
          </Box>
        )}

        {/* Order Details Modal */}
        <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="md" 
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 700, 
            fontSize: 24, 
            pb: 2, 
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            mb: 2
          }}>
            Order Details
            <IconButton 
              onClick={() => setSelectedOrder(null)} 
              sx={{ 
                position: 'absolute', 
                right: 16, 
                top: 16, 
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 2, borderColor: theme.palette.divider }}>
            {selectedOrder && (
              <>
                {(() => {
                  const isApiOrder = selectedOrder.orderId;
                  const customerName = isApiOrder ? selectedOrder.user?.name : selectedOrder.customer;
                  const phone = isApiOrder ? selectedOrder.user?.phone_number : selectedOrder.phone;
                  const email = isApiOrder ? selectedOrder.user?.emailId : selectedOrder.details?.email;
                  const location = isApiOrder ? selectedOrder.user?.location : selectedOrder.details?.location;
                  const city = isApiOrder ? selectedOrder.user?.city : selectedOrder.details?.city;
                  const amount = isApiOrder ? selectedOrder.totalAmount : selectedOrder.details?.total;
                  const products = isApiOrder ? selectedOrder.items : selectedOrder.details?.products;
                  
                  return (
                    <>
                      <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: isDarkMode ? 'rgba(139, 104, 255, 0.1)' : '#F7F8FA' }}>
                        <Typography fontWeight={700} fontSize={17} mb={1} color={theme.palette.text.primary}>Customer Details</Typography>
                        <Typography fontSize={15} color={theme.palette.text.primary}><b>Name</b> {customerName}</Typography>
                        <Typography fontSize={15} color={theme.palette.text.primary}><b>Phone</b> {phone}</Typography>
                        <Typography fontSize={15} color={theme.palette.text.primary}><b>Email</b> {email}</Typography>
                        <Typography fontSize={15} color={theme.palette.text.primary}><b>Location</b> {location}</Typography>
                        <Typography fontSize={15} color={theme.palette.text.primary}><b>City</b> {city}</Typography>
                      </Box>
                      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
                      <Typography fontWeight={700} fontSize={17} mb={1} color={theme.palette.text.primary}>Order Items</Typography>
                      {products?.map((item, idx) => {
                        const productName = isApiOrder ? item.VendorProduct?.name : item.name;
                        const productCategory = isApiOrder ? item.VendorProduct?.category : item.category;
                        const quantity = isApiOrder ? item.quantity : item.qty;
                        const price = isApiOrder ? item.priceAtPurchase : item.price;
                        
                        return (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: isDarkMode ? 'rgba(139, 104, 255, 0.2)' : '#F3F0FF', color: theme.palette.primary.main, mr: 2 }}>
                              {/* No image icon */}
                              <Close />
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} color={theme.palette.text.primary}>{productName}</Typography>
                              <Typography fontSize={14} color={theme.palette.text.secondary}>{productCategory}</Typography>
                              <Typography fontSize={14} color={theme.palette.text.secondary}>Qty: {quantity}</Typography>
                            </Box>
                            <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                              <Typography fontWeight={700} color={theme.palette.primary.main}>₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                            </Box>
                          </Box>
                        );
                      })}
                      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
                      <Typography fontWeight={700} fontSize={17} mb={1} color={theme.palette.text.primary}>Order Summary</Typography>
                      <Typography fontSize={16} fontWeight={600} color={theme.palette.primary.main}>Total Amount</Typography>
                      <Typography fontSize={22} fontWeight={700} color={theme.palette.primary.main} mb={2}>₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
                      <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, fontSize: 16, borderRadius: 2 }}>
                        Download Invoice
                      </Button>
                    </>
                  );
                })()}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: theme.palette.background.paper }}>
            <Button onClick={() => setSelectedOrder(null)} sx={{ color: theme.palette.text.secondary }}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProductVendorLayout>
  );
};

const ProductVendorOrders = () => {
  return (
    <VendorThemeProvider>
      <ProductVendorOrdersContent />
    </VendorThemeProvider>
  );
};

export default ProductVendorOrders; 