import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import labTestPaymentService from '../../../services/payment/lab-test-payment.service';
import labTestService from '../../../services/User/LabTest/lab-test.service';
import PaymentSuccessDialog from './PaymentSuccessDialog';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Skeleton,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ElevatorIcon from '@mui/icons-material/Elevator';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

const BookLabTestAppt = () => {
  const { vendorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialLab = location.state?.lab;

  const [lab, setLab] = useState(initialLab || null);
  const [loadingLabProfile, setLoadingLabProfile] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [reportDelivery, setReportDelivery] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Fetch lab profile by vendorId
  const fetchLabProfile = async () => {
    if (!vendorId) return;
    
    // If we already have complete lab data, don't fetch again
    if (lab && lab.name && lab.testTypes && lab.address) {
      console.log('Lab data already available:', lab);
      return;
    }
    
    try {
      setLoadingLabProfile(true);
      console.log('Fetching lab profile for vendorId:', vendorId);
      
      const profileData = await labTestService.getLabProfile(vendorId);
      console.log('Fetched lab profile:', profileData);
      
      // Map API response to component expected structure
      const mappedLabData = {
        id: profileData.diagnosticCenterId || profileData.id,
        vendorId: profileData.vendorId,
        name: profileData.name || 'Unknown Lab',
        address: profileData.address ? `${profileData.address}, ${profileData.city}, ${profileData.state} - ${profileData.pincode}` : 'Address not available',
        phone: profileData.mainContactNumber || '',
        emergencyPhone: profileData.emergencyContactNumber || '',
        email: profileData.email || '',
        website: profileData.website || '',
        timing: profileData.businessTimings || 'N/A',
        businessDays: profileData.businessDays || [],
        services: profileData.testTypes || [],
        image: profileData.centerPhotosUrl || '',
        sampleCollectionMethod: profileData.sampleCollectionMethod || 'Both',
        homeCollectionLimit: profileData.homeCollectionGeoLimit || 'N/A',
        emergencyHandling: profileData.emergencyHandlingFastTrack || false,
        parkingAvailable: profileData.parkingAvailable || false,
        wheelchairAccess: profileData.wheelchairAccess || false,
        liftAccess: profileData.liftAccess || false,
        ambulanceService: profileData.ambulanceServiceAvailable || false,
        nearbyLandmark: profileData.nearbyLandmark || '',
        languagesSpoken: profileData.languagesSpoken || [],
        generatedId: profileData.generatedId || '',
        ownerName: profileData.ownerName || '',
        gstNumber: profileData.gstNumber || '',
        panNumber: profileData.panNumber || '',
        location: profileData.location || '',
        floor: profileData.floor || '',
        filesAndImages: profileData.filesAndImages || [],
        googleMapsLocationUrl: profileData.googleMapsLocationUrl || '',
        // Keep original fields for backward compatibility
        ...profileData
      };
      
      console.log('Mapped lab data:', mappedLabData);
      
      // Update the lab with mapped profile
      setLab(mappedLabData);
    } catch (error) {
      console.error('Error fetching lab profile:', error);
      // Don't show error to user, just log it
    } finally {
      setLoadingLabProfile(false);
    }
  };

  // Fetch lab profile on component mount
  useEffect(() => {
    fetchLabProfile();
  }, [vendorId]);

  if (!lab && loadingLabProfile) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" fontWeight={700}>Loading Lab Profile...</Typography>
        </Paper>
        <Container maxWidth="md">
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
            </Stack>
          </Paper>
          <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={200} />
        </Container>
      </Box>
    );
  }

  if (!lab) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" fontWeight={700}>Lab Not Found</Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error.main">Sorry, we couldn't find the lab details. Please go back and try again.</Typography>
        </Paper>
      </Box>
    );
  }

  const handleTestToggle = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleTimeSelect = (slot) => setSelectedTime(slot);
  
  const handlePrescriptionChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescription(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      setPrescription(URL.createObjectURL(files[0]));
    }
  };

  const validateForm = () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one test.');
      return false;
    }
    if (!selectedDate) {
      alert('Please select a date.');
      return false;
    }
    if (!selectedTime) {
      alert('Please select a time slot.');
      return false;
    }
    return true;
  };

  const handleBook = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Get vendorId and userId for console logging
    const labVendorId = lab.vendorId; // Use the actual vendorId from lab data
    const userId = getUserId();

    console.log('🔍 Booking Lab Test Appointment:');
    console.log('📋 Vendor ID:', labVendorId);
    console.log('👤 User ID:', userId);
    console.log('👤 Lab Name:', lab.name);


    try {
      const appointmentData = {
        appointmentId: `LAB_${Date.now()}`,
        labId: vendorId, // Use vendorId from URL params
        vendorId: lab.vendorId, // Pass the vendorId from lab data
        labName: lab.name,
        selectedTests: selectedTests,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        homeCollection: homeCollection,
        reportDelivery: reportDelivery,
        prescription: prescription
      };

      await labTestPaymentService.processPayment(
        appointmentData,
        (successData) => {
          setPaymentData(successData);
          setShowSuccessDialog(true);
          setIsSubmitting(false);
        },
        (error) => {
          alert(`Payment failed: ${error}`);
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 2, md: 3 } }}>
      <Container maxWidth="md">
      {/* Header: Profile + quick info */}
      <Paper sx={{ p: { xs: 1.5, md: 2 }, mb: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {lab.image && !imageError ? (
            <Avatar src={lab.image} alt={lab.name} sx={{ width: 56, height: 56 }} onError={() => setImageError(true)} />
          ) : (
            <Avatar sx={{ width: 56, height: 56 }}>
              <PersonIcon />
            </Avatar>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800} noWrap>{lab.name}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 0.5 }}>
              {lab.address && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" noWrap>{lab.address}</Typography>
                </Stack>
              )}
              {lab.phone && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{lab.phone}</Typography>
                </Stack>
              )}
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {(lab.services || []).slice(0, 4).map((s, idx) => (
                <Chip key={idx} size="small" label={s} variant="outlined" />
              ))}
              {(lab.services || []).length > 4 && (
                <Chip size="small" label={`+${(lab.services || []).length - 4} more`} variant="outlined" />
              )}
            </Stack>
            
            {/* Additional Lab Information */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Lab Information</Typography>
              <Grid container spacing={1}>
                {lab.timing && (
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{lab.timing}</Typography>
                    </Stack>
                  </Grid>
                )}
                {lab.sampleCollectionMethod && (
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{lab.sampleCollectionMethod}</Typography>
                    </Stack>
                  </Grid>
                )}
                {lab.homeCollectionLimit && (
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">Home Collection: {lab.homeCollectionLimit}</Typography>
                    </Stack>
                  </Grid>
                )}
                {lab.nearbyLandmark && (
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">Near: {lab.nearbyLandmark}</Typography>
                    </Stack>
                  </Grid>
                )}
              </Grid>
              
              {/* Lab Facilities */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Facilities:</Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {lab.parkingAvailable && <Chip size="small" icon={<LocalParkingIcon />} label="Parking" variant="outlined" />}
                  {lab.wheelchairAccess && <Chip size="small" icon={<AccessibilityIcon />} label="Wheelchair Access" variant="outlined" />}
                  {lab.liftAccess && <Chip size="small" icon={<ElevatorIcon />} label="Lift Access" variant="outlined" />}
                  {lab.emergencyHandling && <Chip size="small" icon={<LocalHospitalIcon />} label="Emergency Handling" variant="outlined" />}
                  {lab.ambulanceService && <Chip size="small" icon={<LocalHospitalIcon />} label="Ambulance Service" variant="outlined" />}
                </Stack>
              </Box>
              
              {/* Languages Spoken */}
              {lab.languagesSpoken && lab.languagesSpoken.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Languages: {lab.languagesSpoken.join(', ')}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: { xs: 1.5, md: 2 }, mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Select Tests</Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {(lab.services || []).map((test, idx) => {
                const selected = selectedTests.includes(test);
                return (
                  <Chip
                    key={idx}
                    label={test}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    onClick={() => handleTestToggle(test)}
                    sx={{ mb: 1 }}
                  />
                );
              })}
              {(!lab.services || lab.services.length === 0) && (
                <Typography variant="body2" color="text.secondary">No services listed for this lab.</Typography>
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: { xs: 1.5, md: 2 }, mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Select Date & Time</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <TextField
                type="date"
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ width: { xs: '100%', sm: 220 } }}
              />
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {timeSlots.map(slot => (
                  <Chip
                    key={slot}
                    label={slot}
                    variant={selectedTime === slot ? 'filled' : 'outlined'}
                    color={selectedTime === slot ? 'primary' : 'default'}
                    onClick={() => handleTimeSelect(slot)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: { xs: 1.5, md: 2 }, mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Collection Method</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControlLabel control={<Switch checked={homeCollection} onChange={e => setHomeCollection(e.target.checked)} />} label="Home Sample Collection" />
              <FormControlLabel control={<Switch checked={reportDelivery} onChange={e => setReportDelivery(e.target.checked)} />} label="Report Delivery at Home" />
            </Stack>
          </Paper>

          <Paper sx={{ p: { xs: 1.5, md: 2 }, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Upload Prescription</Typography>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                p: 2,
                border: '1px dashed',
                borderColor: isDragOver ? 'primary.main' : 'divider',
                borderRadius: 2,
                textAlign: 'center',
                backgroundColor: isDragOver ? 'action.hover' : 'background.default',
              }}
            >
              <input
                id="prescription-upload"
                type="file"
                accept="image/*"
                onChange={handlePrescriptionChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="prescription-upload">
                <Button component="span" startIcon={<CloudUploadIcon />} variant="outlined">
                  Upload Prescription
                </Button>
              </label>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                Drag & drop image here or click to browse. JPG, PNG. Max 5MB.
              </Typography>
            </Box>
            {prescription && (
              <Card sx={{ mt: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ImageIcon color="action" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">Prescription Uploaded</Typography>
                    <Typography variant="caption" color="text.secondary">Image successfully added</Typography>
                  </Box>
                  <Button size="small" onClick={() => setPrescription(null)}>Remove</Button>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Box component="img" src={prescription} alt="Prescription Preview" sx={{ width: '100%', borderRadius: 1 }} />
                </Box>
              </Card>
            )}
            {/* Primary CTA (visible for both mobile and desktop) */}
            <Stack sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBook}
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Processing Payment...' : 'Book Appointment'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Additional Lab Details Section */}
      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Paper sx={{ p: { xs: 1.5, md: 2 }, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Lab Details</Typography>
          
          <Grid container spacing={2}>
            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Contact Information</Typography>
              <Stack spacing={1}>
                {lab.email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{lab.email}</Typography>
                  </Stack>
                )}
                {lab.website && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WebIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" component="a" href={lab.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                      {lab.website}
                    </Typography>
                  </Stack>
                )}
                {lab.emergencyPhone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="body2" color="error.main">Emergency: {lab.emergencyPhone}</Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>
            
            {/* Business Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Business Information</Typography>
              <Stack spacing={1}>
                {lab.generatedId && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">ID: {lab.generatedId}</Typography>
                  </Stack>
                )}
                {lab.ownerName && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">Owner: {lab.ownerName}</Typography>
                  </Stack>
                )}
                {lab.floor && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">Floor: {lab.floor}</Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>
            
            {/* Business Days */}
            {lab.businessDays && lab.businessDays.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Operating Days</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {lab.businessDays.map((day, idx) => (
                    <Chip key={idx} label={day} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Grid>
            )}
            
            {/* Available Tests */}
            {lab.services && lab.services.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Available Tests</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {lab.services.map((test, idx) => (
                    <Chip key={idx} label={test} size="small" color="primary" variant="outlined" />
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
      </Container>

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        paymentData={paymentData}
      />
    </Box>
  );
};

export default BookLabTestAppt; 