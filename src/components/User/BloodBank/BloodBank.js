import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveBloodBanks, createBloodBankRequest, getOngoingBloodBankBooking } from '../../../services/User/BloodBank/blood-bank.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import OngoingBloodBankBookingModal from './OngoingBloodBankBookingModal';
import userService from '../../../services/User/Profile/user.service';
import {
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  Button,
  Divider,
  Drawer,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Removed search controls; keep minimal icons
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Default location for static map
const defaultLocation = { lat: 18.5204, lng: 73.8567 }; // Pune coordinates

function BloodBank() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Location defaults to Pune when unavailable
  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
  const [units, setUnits] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [donorPanelOpen, setDonorPanelOpen] = useState(false);
  const [donorForm, setDonorForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    bloodType: '',
    date: '',
  });
  const [donorSubmitted, setDonorSubmitted] = useState(false);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [requestDrawerOpen, setRequestDrawerOpen] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formError, setFormError] = useState('');
  const [ongoingBooking, setOngoingBooking] = useState(null);
  const [ongoingModalOpen, setOngoingModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get map center coordinates
  const getMapCenter = () => {
    const loc = userLocation || defaultLocation;
    return `${loc.lat},${loc.lng}`;
  };

  // Geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(defaultLocation);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUserLocation(defaultLocation);
      }
    );
  }, []);

  // Fetch blood banks on mount
  useEffect(() => {
    getActiveBloodBanks()
      .then(data => {
        if (Array.isArray(data)) setBloodBanks(data);
        else if (Array.isArray(data.data)) setBloodBanks(data.data);
      })
      .catch(() => setBloodBanks([]));
  }, []);

  // Fetch ongoing blood bank booking on mount and for refresh
  const fetchOngoingBooking = async () => {
    const userId = getUserId && getUserId();
    if (!userId) return;
    try {
      const booking = await getOngoingBloodBankBooking(userId);
      if (booking) {
        setOngoingBooking(booking);
        setOngoingModalOpen(true);
      } else {
        setOngoingBooking(null);
        setOngoingModalOpen(false);
      }
    } catch (err) {
      setOngoingBooking(null);
      setOngoingModalOpen(false);
    }
  };

  useEffect(() => {
    fetchOngoingBooking();
  }, []);

  const renderMap = () => {
    const centerCoords = getMapCenter();
    return (
      <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
        <iframe
          src={`https://maps.google.com/maps?q=${centerCoords}&z=13&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    );
  };

  // Handle prescription upload
  const handlePrescriptionChange = (e) => {
    setPrescription(e.target.files[0]);
  };

  // Toggle blood type selection (multi-select)
  const handleBloodTypeToggle = (type) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Handle blood request submit
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    setFormError('');
    try {
      const userId = getUserId && getUserId();
      if (!userId) throw new Error('User not logged in');
      if (!userLocation) throw new Error('Location not available');
      if (!units || isNaN(units) || Number(units) < 1) throw new Error('Please enter valid units');
      if (!selectedBloodTypes.length) throw new Error('Select at least one blood type');
      if (!prescription) throw new Error('Upload prescription');
      // Fetch user details for customer name
      let customerName = 'Anonymous';
      try {
        const userDetailsResp = await userService.getUserDetails(userId);
        if (userDetailsResp && userDetailsResp.data && userDetailsResp.data.name) {
          customerName = userDetailsResp.data.name;
        }
      } catch (err) {
        // fallback to Anonymous
      }
      // TODO: Upload prescription and get URL. For now, use dummy URL.
      let prescriptionUrls = ['https://dummy.url/prescription.jpg'];
      // If you want to actually upload, integrate upload logic here.
      const res = await createBloodBankRequest({
        userId,
        customerName,
        bloodType: selectedBloodTypes.join(','),
        units: Number(units),
        prescriptionUrls,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 50
      });
      setSnackbar({ open: true, severity: res.success ? 'success' : 'error', message: res.message || (res.success ? 'Request submitted!' : 'Failed to submit request') });
      if (res.success) {
        setRequestSubmitted(true);
        setTimeout(() => {
          setRequestSubmitted(false);
          setSelectedBloodTypes([]);
          setUnits('');
          setPrescription(null);
          setRequestDrawerOpen(false);
        }, 2000);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit request');
      setSnackbar({ open: true, severity: 'error', message: err.message || 'Failed to submit request' });
    }
    setRequestLoading(false);
  };

  // Handle donor form change
  const handleDonorChange = (e) => {
    setDonorForm({ ...donorForm, [e.target.name]: e.target.value });
  };

  // Handle donor submit
  const handleDonorSubmit = (e) => {
    e.preventDefault();
    setDonorSubmitted(true);
    setTimeout(() => {
      setDonorSubmitted(false);
      setDonorPanelOpen(false);
      setDonorForm({
        fullName: '', phone: '', city: '', state: '', country: '', bloodType: '', date: '',
      });
    }, 2000);
  };

  // No location dialog; silently default to Pune when blocked

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%', bgcolor: 'background.default' }}>
      {/* Ongoing Bookings */}
      <OngoingBloodBankBookingModal
        open={ongoingModalOpen}
        booking={ongoingBooking}
        onClose={() => setOngoingModalOpen(false)}
        onRefresh={fetchOngoingBooking}
      />

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Map (full-screen on mobile) */}
      <Box sx={{ position: 'absolute', inset: 0 }}>{renderMap()}</Box>

      {/* Top-left actions */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddLocationAltIcon />}
          size="small"
          onClick={() => setRequestDrawerOpen(true)}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Request Blood
        </Button>
        <Button
          variant="contained"
          startIcon={<BloodtypeIcon />}
          size="small"
          onClick={() => setDonorPanelOpen(true)}
          sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}
        >
          Are you a donor?
        </Button>
      </Box>

      {/* Floating Actions removed; actions moved to top-left */}

      {/* Request Blood Drawer (right) */}
      <Drawer anchor={isMdUp ? 'right' : 'bottom'} open={requestDrawerOpen} onClose={() => setRequestDrawerOpen(false)} PaperProps={{ sx: { width: isMdUp ? 400 : '100%', p: 2 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6">Request Blood</Typography>
          <IconButton onClick={() => setRequestDrawerOpen(false)}><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" onSubmit={handleRequestSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Units Required"
            type="number"
            inputProps={{ min: 1 }}
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Blood Type(s)</Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
              {BLOOD_TYPES.map(type => (
                <Chip
                  key={type}
                  label={type}
                  color={selectedBloodTypes.includes(type) ? 'primary' : 'default'}
                  onClick={() => handleBloodTypeToggle(type)}
                />
              ))}
            </Stack>
          </Box>
          {selectedBloodTypes.length > 0 && (
            <>
              <Button variant="outlined" component="label">
                Upload Prescription
                <input type="file" accept="image/*,application/pdf" hidden onChange={handlePrescriptionChange} />
              </Button>
              <Button type="submit" variant="contained" disabled={requestSubmitted || requestLoading}>
                {requestLoading ? 'Submitting...' : (requestSubmitted ? 'Submitted!' : 'Submit Request')}
              </Button>
            </>
          )}
          {formError && <Alert severity="error">{formError}</Alert>}
        </Box>
      </Drawer>

      {/* Donor Registration Bottom Sheet (mobile) / Drawer (desktop) */}
      <Drawer
        anchor={isMdUp ? 'right' : 'bottom'}
        open={donorPanelOpen}
        onClose={() => setDonorPanelOpen(false)}
        PaperProps={{ sx: { width: isMdUp ? 420 : '100%', p: 2 } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6">Register as Donor</Typography>
          <IconButton onClick={() => setDonorPanelOpen(false)}><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" onSubmit={handleDonorSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Full Name" name="fullName" value={donorForm.fullName} onChange={handleDonorChange} required />
          <TextField label="Phone Number" name="phone" value={donorForm.phone} onChange={handleDonorChange} required />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="City" name="city" value={donorForm.city} onChange={handleDonorChange} required />
            <TextField fullWidth label="State" name="state" value={donorForm.state} onChange={handleDonorChange} required />
          </Stack>
          <TextField label="Country" name="country" value={donorForm.country} onChange={handleDonorChange} required />
          <FormControl fullWidth>
            <InputLabel id="blood-type-label">Blood Type</InputLabel>
            <Select labelId="blood-type-label" label="Blood Type" name="bloodType" value={donorForm.bloodType} onChange={handleDonorChange} required>
              {BLOOD_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Date" type="date" name="date" value={donorForm.date} onChange={handleDonorChange} required InputLabelProps={{ shrink: true }} />
          <Button type="submit" variant="contained" disabled={donorSubmitted}>
            {donorSubmitted ? 'Registering...' : 'Register as Donor'}
          </Button>
        </Box>
      </Drawer>

      {/* Location defaults to Pune if not granted */}
    </Box>
  );
}

export default BloodBank;
