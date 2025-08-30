import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  History,
  CheckCircle,
  DirectionsCar,
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';
import { getCompletedBookingsByVendor } from '../../../services/Vendors/AmbulanceVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AmbulanceVendorHistory = () => {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        setLoading(true);
        
        // Get vendor ID from authentication service
        const authData = vendorAuthService.getVendorAuthData();
        if (!authData || !authData.vendorData) {
          toast.error('Vendor authentication required. Please login again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
        
        const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
        if (!vendorId) {
          console.error('Vendor ID not found in auth data:', authData);
          toast.error('Vendor ID not found. Please login again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
        
        console.log('Using vendor ID from auth service:', vendorId);
        const completedBookings = await getCompletedBookingsByVendor(vendorId);
        
        // Transform the API response to match our component's expected format
        const transformedHistory = completedBookings.map(booking => ({
          id: booking.requestId,
          patient: booking.user?.name || 'Unknown Patient',
          phone: booking.user?.phone_number || 'N/A',
          type: booking.vehicleType || 'Emergency',
          status: booking.status,
          date: new Date(booking.timestamp).toLocaleDateString(),
          time: new Date(booking.timestamp).toLocaleTimeString(),
          duration: 'N/A', // Not available in API response
          location: booking.pickupLocation,
          destination: booking.dropLocation,
          ambulance: booking.agencyProfile?.agencyName || 'N/A',
          driver: 'N/A', // Not available in API response
          revenue: booking.totalAmount,
          rating: 5, // Default rating since not available in API
          originalBooking: booking // Keep the original booking data
        }));
        
        setHistory(transformedHistory);
      } catch (error) {
        console.error('Error fetching completed bookings:', error);
        toast.error('Failed to fetch completed bookings. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedBookings();
  }, []);

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading history...</Typography>
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ 
            fontWeight: 700, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Service History 📋
          </Typography>
          <Typography variant="h6" color={theme.palette.text.secondary} sx={{ fontWeight: 400 }}>
            View completed ambulance service records
          </Typography>
        </Box>

        {/* History Table */}
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {history.length > 0 ? (
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Patient
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Date & Time
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Duration
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Ambulance
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Revenue
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Rating
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((record) => (
                    <TableRow 
                      key={record.id}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.05)' 
                            : 'rgba(0,0,0,0.02)',
                          transition: 'background-color 0.3s ease'
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.02)' 
                            : 'rgba(0,0,0,0.01)'
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {record.patient}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {record.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.duration}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DirectionsCar fontSize="small" />
                          <Typography variant="body2">
                            {record.ambulance}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{record.revenue.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2">⭐</Typography>
                          <Typography variant="body2">{record.rating}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          size="small" 
                          color="success"
                          icon={<CheckCircle fontSize="small" />}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 28,
                            '& .MuiChip-icon': {
                              fontSize: '1rem'
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              py: 8,
              px: 3
            }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <History sx={{ 
                  fontSize: 60, 
                  color: theme.palette.text.secondary 
                }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                mb: 1,
                textAlign: 'center'
              }}>
                No Service History Found
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                textAlign: 'center',
                maxWidth: 400
              }}>
                There are currently no completed ambulance services in your history. 
                Completed services will appear here once you finish processing ambulance requests.
              </Typography>
            </Box>
          )}
        </Box>
        
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="colored"
          limit={3}
          newestOnTop={true}
        />
      </Box>
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorHistory; 