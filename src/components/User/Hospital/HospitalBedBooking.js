import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalService } from '../../../services/User/Hospital/hospital.service';
import OngoingBedBookingModal from './OngoingBedBookingModal';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Chip,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Drawer
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PhoneIcon from '@mui/icons-material/Phone';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Default location for static map
const defaultLocation = "18.5204, 73.8567"; // Pune coordinates

function HospitalBedBooking() {
  console.log('🏥 HospitalBedBooking Component Mounted');
  
  // Debug auth state
  const userId = getUserId();
  console.log('👤 Current UserId:', userId);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Pune coordinates
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
    if (userId) {
      console.log('🔄 Fetching bookings for userId:', userId);
      fetchOngoingBookings();
    } else {
      console.log('❌ No userId available for fetching bookings');
    }
  }, [userId]);

  // Monitor selectedBooking changes
  useEffect(() => {
    console.log('🔄 Selected Booking Updated:', selectedBooking);
    console.log('📱 Modal Visibility:', showBookingModal);
  }, [selectedBooking, showBookingModal]);

  const fetchOngoingBookings = async () => {
    try {
      if (!userId) {
        console.log('❌ Cannot fetch bookings: No userId available');
        return;
      }

      console.log('🔍 Fetching bookings for user:', userId);
      const response = await hospitalService.getUserBookings(userId);
      console.log('📦 Bookings Response:', response);

      if (response.success && response.bookings.length > 0) {
        console.log('✅ Found bookings:', response.bookings);
        setOngoingBookings(response.bookings);
        // Normalize status and find first non-completed booking
        const nonCompleted = response.bookings.find(b => {
          const s = (b.status || '').toString().toLowerCase();
          return s !== 'completed' && s !== 'complete' && s !== 'completedpayment';
        });
        const toShow = nonCompleted || response.bookings[0];
        if (toShow) {
          console.log('🔄 Setting selected booking and showing modal');
          setSelectedBooking(toShow);
          setShowBookingModal(true);
        }
      } else {
        console.log('ℹ️ No ongoing bookings found');
      }
    } catch (err) {
      console.error('❌ Error fetching ongoing bookings:', err);
    }
  };

  const handleRefreshBooking = async () => {
    await fetchOngoingBookings();
  };

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hospitalService.getAllHospitals();
      setHospitals(data);
      if (data.length > 0) {
        setMapCenter(data[0].location); // Center map on first hospital
      }
    } catch (err) {
      setError('Failed to fetch hospitals. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filters = ["All", "Emergency", "ICU", "OPD", "Operation Theater"];

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setMapCenter(hospital.location);
  };

  const handleBookNow = (hospital, e) => {
    e.stopPropagation();
    navigate(`/hospital-bed-booking/${hospital.vendorId}`);
  };

  const handleCallHospital = (hospital, e) => {
    e.stopPropagation();
    // Check if hospital has a phone number
    if (hospital.phoneNumber) {
      // Create a phone call link
      window.open(`tel:${hospital.phoneNumber}`, '_self');
    } else {
      // Show a message if no phone number is available
      console.warn('Hospital phone number not available');
      // You could add a toast notification here if you have one
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialities.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'All' || 
      hospital.features.some(feature => feature === activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  const renderMap = () => {
    const centerCoords = `${mapCenter.lat},${mapCenter.lng}`;
    return (
      <iframe
        src={`https://maps.google.com/maps?q=${centerCoords}&z=13&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  };

  // Open bottom sheet by default on mobile
  useEffect(() => {
    if (!isMdUp) {
      setSheetOpen(true);
    }
  }, [isMdUp]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>Loading hospitals...</Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ mb: 1 }}>{error}</Typography>
          <Button variant="contained" onClick={fetchHospitals}>Try Again</Button>
        </Paper>
      </Box>
    );
  }

  const HospitalList = ({ dense }) => (
    <List sx={{ p: 0 }}>
      {filteredHospitals.map((hospital) => {
        const isExpanded = expandedId === hospital.id;
  return (
          <Paper key={hospital.id} sx={{ mb: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider' }}>
            <ListItem disableGutters onClick={() => setExpandedId(isExpanded ? null : hospital.id)} sx={{ cursor: 'pointer' }}>
              <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
              <ListItemText
                primary={<Typography fontWeight={700}>{hospital.name}</Typography>}
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">{hospital.type}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{hospital.address}</Typography>
                    </Box>
                  </Box>
                }
              />
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {hospital.features?.slice(0, 6).map((feature, idx) => (
                  <Chip key={idx} label={feature} size="small" />
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip icon={<StarIcon />} label={hospital.rating} size="small" />
                <Chip icon={<AccessTimeIcon />} label={hospital.openHours} size="small" />
                <Chip icon={<ArrowForwardIosIcon />} label={hospital.availability} size="small" />
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<PhoneIcon />}
                    onClick={(e) => handleCallHospital(hospital, e)}
                    sx={{ 
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.light',
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Call
                  </Button>
                  <Button variant="contained" size="small" onClick={(e) => handleBookNow(hospital, e)}>
                    Book Now
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left: List for desktop */}
      <Box sx={{ width: { xs: '100%', md: '35%' }, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider' }}>
        <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search hospitals, specialities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Box>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.map(filter => (
              <Chip key={filter} label={filter} color={activeFilter === filter ? 'primary' : 'default'} onClick={() => setActiveFilter(filter)} size="small" />
            ))}
          </Box>
        </Paper>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <HospitalList />
        </Box>
      </Box>

      {/* Right: Map */}
      <Box sx={{ width: { xs: '100%', md: '65%' }, position: 'relative' }}>
        {renderMap()}
        {/* Mobile action button (visible only when sheet is closed) */}
        {!isMdUp && !sheetOpen && (
          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
            <Button variant="contained" onClick={() => setSheetOpen(true)}>View Hospitals</Button>
          </Box>
        )}
      </Box>

      {/* Bottom Sheet for mobile list */}
      <Drawer anchor="bottom" open={sheetOpen} onClose={() => setSheetOpen(false)} PaperProps={{ sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search hospitals, specialities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
            <Button onClick={() => setSheetOpen(false)}>Close</Button>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.map(filter => (
              <Chip key={filter} label={filter} color={activeFilter === filter ? 'primary' : 'default'} onClick={() => setActiveFilter(filter)} size="small" />
            ))}
          </Box>
        </Box>
        <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
          <HospitalList />
        </Box>
      </Drawer>

      {/* Ongoing Booking Modal - show above list on initial load if exists */}
      {selectedBooking && (
        <OngoingBedBookingModal
          open={showBookingModal}
          booking={selectedBooking}
          onClose={() => setShowBookingModal(false)}
          onRefreshBooking={handleRefreshBooking}
        />
      )}
    </Box>
  );
}

export default HospitalBedBooking;
