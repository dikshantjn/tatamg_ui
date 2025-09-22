import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hospitalService } from '../../../services/User/Hospital/hospital.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const BookHospitalBed = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ type: '', message: '' });
    const [bookingInProgress, setBookingInProgress] = useState(false);

    // Time slots
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    useEffect(() => {
        fetchHospitalAndWards();
    }, [vendorId]);

    const fetchHospitalAndWards = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch hospital data
            const hospitals = await hospitalService.getAllHospitals();
            const hospitalData = hospitals.find(h => h.vendorId === vendorId);
            
            if (!hospitalData) {
                throw new Error('Hospital not found');
            }
            
            setHospital(hospitalData);

            // Fetch wards data
            const wardsData = await hospitalService.getHospitalWards(vendorId);
            setWards(wardsData);
        } catch (err) {
            setError('Failed to fetch hospital details. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalAmount = () => {
        if (!selectedWard) return 0;
        return selectedWard.pricePerDay;
    };

    const handleBookingConfirmation = async () => {
        try {
            setBookingInProgress(true);
            
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated. Please login to continue.');
            }
            
            const bookingData = {
                vendorId: hospital.vendorId,  // Using hospitalId as vendorId
                userId: userId,
                hospitalId: hospital.vendorId,
                wardId: selectedWard.wardId,
                bedType: selectedWard.name,
                price: parseFloat(selectedWard.pricePerDay),
                paidAmount: 0.0,
                paymentStatus: 'pending',
                bookingDate: new Date(selectedDate).toISOString().split('T')[0],
                timeSlot: selectedTime,
                selectedDoctorId: vendorId,
                status: 'pending'
            };

            // Detailed logging of each field
            console.log('🔍 Detailed Booking Data:');
            console.log('vendorId:', bookingData.vendorId);
            console.log('userId:', bookingData.userId);
            console.log('hospitalId:', bookingData.hospitalId);
            console.log('wardId:', bookingData.wardId);
            console.log('bedType:', bookingData.bedType);
            console.log('price:', bookingData.price, typeof bookingData.price);
            console.log('paidAmount:', bookingData.paidAmount, typeof bookingData.paidAmount);
            console.log('paymentStatus:', bookingData.paymentStatus);
            console.log('bookingDate:', bookingData.bookingDate);
            console.log('timeSlot:', bookingData.timeSlot);
            console.log('selectedDoctorId:', bookingData.selectedDoctorId);
            console.log('status:', bookingData.status);

            console.log("📤 Complete booking data object:", JSON.stringify(bookingData, null, 2));
            
            const response = await hospitalService.createBedBooking(bookingData);
            console.log("📥 Booking response:", response);
            
            if (response.success) {
                setDialogContent({
                    type: 'success',
                    message: response.message,
                    bookingId: response.data.booking.bedBookingId
                });
                setShowDialog(true);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error("❌ Booking error:", err);
            setDialogContent({
                type: 'error',
                message: err.message || 'Failed to create booking. Please try again.'
            });
            setShowDialog(true);
        } finally {
            setBookingInProgress(false);
        }
    };

    const renderDialog = () => {
        if (!showDialog) return null;
        const isSuccess = dialogContent.type === 'success';
        return (
          <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Paper sx={{ p: 3, maxWidth: 420, width: '100%', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {isSuccess ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <InfoOutlinedIcon color="error" sx={{ mr: 1 }} />
                )}
                <Typography variant="h6" fontWeight={700}>{isSuccess ? 'Booking Request Sent!' : 'Booking Failed'}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {isSuccess ? 'Your bed booking request has been submitted. We will notify you when the hospital confirms your booking.' : dialogContent.message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
                <Button variant="contained" onClick={() => setShowDialog(false)}>Close</Button>
              </Box>
            </Paper>
          </Box>
        );
    };

    if (loading) {
        return (
          <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Loading hospital details...</Typography>
            </Paper>
          </Box>
        );
    }

    if (error) {
        return (
          <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Oops! Something went wrong</Typography>
              <Typography sx={{ mb: 2 }}>{error}</Typography>
              <Button variant="contained" onClick={fetchHospitalAndWards}>Try Again</Button>
            </Paper>
          </Box>
        );
    }

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>Book Hospital Bed</Typography>
        </Box>
        {/* Unified container */}
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          {/* Top: Hospital summary */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalHospitalIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>{hospital.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip icon={<StarIcon />} label="4.5/5 Rating" size="small" />
            <Chip icon={<FavoriteIcon />} label="98% Success Rate" size="small" />
          </Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlaceIcon color="action" />
                <Typography variant="body2" color="text.secondary">{hospital.address}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="action" />
                <Typography variant="body2" color="text.secondary">{hospital.phone}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="action" />
                <Typography variant="body2" color="text.secondary">{hospital.openHours}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon color="action" />
                <Typography variant="body2" color="text.secondary">{hospital.workingDays}</Typography>
              </Box>
            </Grid>
          </Grid>
          {!!hospital.features?.length && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {hospital.features.map((feature, i) => (
                <Chip key={i} label={feature} size="small" />
              ))}
            </Box>
          )}
          <Divider sx={{ my: 2 }} />

          {/* Middle: Ward list and Booking details within same container */}
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Select Ward</Typography>
              <Grid container spacing={2}>
                {wards.map((ward) => (
                  <Grid key={ward.wardId} item xs={12} sm={6}>
                    <Box onClick={() => setSelectedWard(ward)} sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: selectedWard?.wardId === ward.wardId ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      transition: 'all .2s',
                      '&:hover': { boxShadow: 2 }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography fontWeight={700}>{ward.name}</Typography>
                        <Chip label={ward.wardType} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">₹{ward.pricePerDay}/day • {ward.availableBeds} available</Typography>
                      <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {ward.facilities && Object.keys(ward.facilities)
                                        .filter(facility => ward.facilities[facility])
                                        .map((facility, index) => (
                            <Chip key={index} label={facility} size="small" />
                          ))}
                        {ward.isAC && <Chip label="AC" size="small" />}
                        {ward.hasAttachedBathroom && <Chip label="Attached Bathroom" size="small" />}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Booking Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 2, height: '100%' }}>
                <TextField
                        type="date"
                  label="Select Date"
                  InputLabelProps={{ shrink: true }}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Time Slot</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {timeSlots.map(time => (
                      <Chip
                                key={time}
                        label={time}
                        color={selectedTime === time ? 'primary' : 'default'}
                                onClick={() => setSelectedTime(time)}
                        variant={selectedTime === time ? 'filled' : 'outlined'}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
                {selectedWard && (
                  <Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Booking Summary</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Ward Type</Typography>
                      <Typography variant="body2">{selectedWard.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Price per Day</Typography>
                      <Typography variant="body2">₹{selectedWard.pricePerDay}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Date</Typography>
                      <Typography variant="body2">{selectedDate || 'Not selected'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Time</Typography>
                      <Typography variant="body2">{selectedTime || 'Not selected'}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">Total Amount</Typography>
                      <Typography variant="subtitle2">₹{calculateTotalAmount()}</Typography>
                    </Box>
                  </Box>
                )}
                <Button
                  variant="contained"
                  size="large"
                    disabled={!selectedWard || !selectedDate || !selectedTime || bookingInProgress}
                    onClick={handleBookingConfirmation}
                  sx={{ mt: 'auto' }}
                >
                  {bookingInProgress ? 'Creating Booking...' : selectedWard ? 'Confirm Booking' : 'Select a Ward to Continue'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

            {/* Dialog */}
            {renderDialog()}
      </Box>
    );
};

export default BookHospitalBed; 