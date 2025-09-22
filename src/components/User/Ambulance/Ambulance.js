import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Chip, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Divider, Drawer, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ambulanceService } from '../../../services/User/Ambulance/ambulance.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import OngoingAmbulanceBookingModal from './OngoingAmbulanceBookingModal';

const defaultCenter = { lat: 19.076, lng: 72.8777 }; // Mumbai default

function parseLocation(locationString) {
  if (!locationString) return null;
  const parts = locationString.split(',');
  if (parts.length !== 2) return null;
  const lat = Number(parts[0].trim());
  const lng = Number(parts[1].trim());
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

function calculateDistanceKm(user, vendor) {
  if (!user || !vendor) return null;
  const R = 6371;
  const dLat = (vendor.lat - user.lat) * Math.PI / 180;
  const dLng = (vendor.lng - user.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(user.lat * Math.PI/180) * Math.cos(vendor.lat * Math.PI/180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function Ambulance() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const [ambulances, setAmbulances] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [expandedId, setExpandedId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // filters removed per requirements
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ongoingBooking, setOngoingBooking] = useState(null);
  const [ongoingModalOpen, setOngoingModalOpen] = useState(false);

  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        setLoading(true);
        const data = await ambulanceService.getAllAmbulances();
        setAmbulances(data || []);
      } catch (err) {
        setNotification({ message: 'Failed to load ambulances', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAmbulances();
  }, []);

  useEffect(() => {
    if (!isMdUp) {
      setSheetOpen(true);
    }
  }, [isMdUp]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          setMapCenter(coords);
        },
        () => {
          // Keep default center
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // filters removed per requirements

  const enhancedAmbulances = useMemo(() => {
    return (ambulances || []).map(a => {
      const coords = parseLocation(a.preciseLocation);
      const distanceKm = (coords && userLocation) ? calculateDistanceKm(userLocation, coords) : null;
      return { ...a, coords, distanceKm };
    }).filter(a => a.coords);
  }, [ambulances, userLocation]);

  const filteredAmbulances = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enhancedAmbulances.filter(a => !q || a.agencyName?.toLowerCase().includes(q) || a.address?.toLowerCase().includes(q));
  }, [enhancedAmbulances, searchQuery]);

  const handleSelect = (amb) => {
    setExpandedId(expandedId === amb.vendorId ? null : amb.vendorId);
    if (amb.coords) setMapCenter(amb.coords);
  };

  const handleRequest = async (amb) => {
    try {
      const userId = getUserId();
      if (!userId) {
        setNotification({ message: 'Please login to request an ambulance', type: 'error' });
        return;
      }
      const res = await ambulanceService.requestAmbulance(userId, amb.vendorId);
      if (res?.success) {
        setNotification({ message: 'Ambulance request sent successfully', type: 'success' });
      } else {
        setNotification({ message: res?.message || 'Failed to request ambulance', type: 'error' });
      }
    } catch (e) {
      setNotification({ message: 'Failed to request ambulance', type: 'error' });
    }
  };

  const handleCallNearest = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        setNotification({ message: 'Please login to request an ambulance', type: 'error' });
        return;
      }
      if (!userLocation) {
        setNotification({ message: 'Enable location to find nearby ambulance', type: 'error' });
        return;
      }
      const withDistance = enhancedAmbulances.filter(a => a.distanceKm != null);
      if (withDistance.length === 0) {
        setNotification({ message: 'No ambulances found nearby', type: 'error' });
        return;
      }
      const nearest = withDistance.reduce((min, a) => (min.distanceKm <= a.distanceKm ? min : a));
      const res = await ambulanceService.requestAmbulance(userId, nearest.vendorId);
      if (res?.success) {
        setNotification({ message: 'Request sent to nearest ambulance', type: 'success' });
      } else {
        setNotification({ message: res?.message || 'Failed to request ambulance', type: 'error' });
      }
    } catch (e) {
      setNotification({ message: 'Failed to request ambulance', type: 'error' });
    }
  };

  const refreshOngoingBooking = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      const bookings = await ambulanceService.getActiveBookings(userId);
      if (bookings && bookings.length > 0) {
        const booking = { ...bookings[0], agency: bookings[0].agencyProfile };
        setOngoingBooking(booking);
        setOngoingModalOpen(true);
      } else {
        setOngoingBooking(null);
        setOngoingModalOpen(false);
      }
    } catch {}
  };

  useEffect(() => { refreshOngoingBooking(); }, []);

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

  const AmbulanceList = () => (
    <List sx={{ p: 0 }}>
      {filteredAmbulances.map((amb) => {
        const isExpanded = expandedId === amb.vendorId;
        return (
          <Paper key={amb.vendorId} sx={{ mb: 1.5, p: 1.25, border: '1px solid', borderColor: isExpanded ? 'primary.light' : 'divider' }}>
            <ListItem disableGutters onClick={() => handleSelect(amb)} sx={{ cursor: 'pointer' }}>
              <ListItemAvatar>
                <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: amb.is24x7Available ? 'success.main' : 'warning.main' }}>
                  <LocalHospitalIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography fontWeight={700}>{amb.agencyName}</Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                    <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" noWrap>{amb.address}</Typography>
                  </Box>
                }
              />
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            {isExpanded && (
              <Box sx={{ mt: 1.25 }}>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip size="small" icon={<AccessTimeIcon />} label={amb.is24x7Available ? '24x7 Available' : 'Limited Hours'} color={amb.is24x7Available ? 'success' : 'warning'} variant="outlined" />
                  {(amb.ambulanceTypes || []).slice(0, 6).map((t, idx) => (
                    <Chip key={idx} size="small" label={t} variant="outlined" />
                  ))}
                </Box>
                {/* Request button removed as per requirements */}
              </Box>
            )}
          </Paper>
        );
      })}
      {filteredAmbulances.length === 0 && (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No ambulances found</Typography>
        </Paper>
      )}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left: List for desktop */}
      <Box sx={{ width: { xs: '100%', md: '35%' }, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider' }}>
        <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search ambulances, address..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Button variant="outlined" onClick={handleCallNearest} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
              Call Nearby Ambulance
            </Button>
          </Box>
        </Paper>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <AmbulanceList />
        </Box>
      </Box>

      {/* Right: Map */}
      <Box sx={{ width: { xs: '100%', md: '65%' }, position: 'relative' }}>
        {renderMap()}
        {!isMdUp && !sheetOpen && (
          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
            <Button variant="contained" onClick={() => setSheetOpen(true)}>View Ambulances</Button>
          </Box>
        )}
      </Box>

      {/* Bottom Sheet for mobile list */}
      <Drawer anchor="bottom" open={sheetOpen} onClose={() => setSheetOpen(false)} PaperProps={{ sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16, display: 'flex', flexDirection: 'column' } }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search ambulances, address..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
            <Button onClick={() => setSheetOpen(false)}>Close</Button>
          </Box>
        </Box>
        <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
          <AmbulanceList />
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button fullWidth variant="outlined" onClick={handleCallNearest} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
            Call Nearby Ambulance
          </Button>
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar open={!!notification} autoHideDuration={3000} onClose={() => setNotification(null)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <Alert onClose={() => setNotification(null)} severity={notification?.type === 'error' ? 'error' : 'success'} sx={{ width: '100%' }}>
          {notification?.message}
        </Alert>
      </Snackbar>

      {/* Ongoing booking modal */}
      {ongoingBooking && (
        <OngoingAmbulanceBookingModal
          open={ongoingModalOpen}
          booking={ongoingBooking}
          steps={['Pending','Accepted','Payment','On The Way','Picked Up','Completed']}
          currentStepIndex={0}
          onClose={() => setOngoingModalOpen(false)}
          onRefreshBooking={refreshOngoingBooking}
        />
      )}
    </Box>
  );
}

export default Ambulance;
