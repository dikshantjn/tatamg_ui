import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Chip, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider, Drawer, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import NearMeIcon from '@mui/icons-material/NearMe';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getNearbyLabs, getCurrentLocation, formatDistance } from '../../../services/User/LabTest/lab-test.service';

function LabTests() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [activeLabId, setActiveLabId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const location = await getCurrentLocation();
        setMapCenter(location);
        const nearbyLabs = await getNearbyLabs(location, 5);
        setLabs(nearbyLabs || []);
        setError(null);
      } catch (err) {
        setError('Failed to load lab data. Please try again.');
        // keep default center
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isMdUp) {
      setSheetOpen(true);
    }
  }, [isMdUp]);

  // No dynamic map required; we will render a static Google map via iframe

  const filteredLabs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return labs;
    return labs.filter(lab => {
      const inName = lab.name?.toLowerCase().includes(q);
      const inAddress = lab.address?.toLowerCase().includes(q);
      const inServices = Array.isArray(lab.services) && lab.services.some(s => (s || '').toLowerCase().includes(q));
      return inName || inAddress || inServices;
    });
  }, [labs, searchQuery]);

  const handleLabClick = (lab) => {
    setActiveLabId(lab.id);
    const coords = lab.coordinates || lab.location; // fallback if API uses different key
    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      setMapCenter({ lat: coords.lat, lng: coords.lng });
    }
  };

  const handleBook = (lab, e) => {
    if (e) e.stopPropagation();
    navigate(`/lab-tests/book/${lab.id}`, { state: { lab } });
  };

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

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, background: '#F0FAFA' }}>
          <Typography variant="h6" fontWeight={800}>Find Lab Tests Near You</Typography>
          <Typography variant="body2" color="text.secondary">Discover trusted diagnostic centers in Pune</Typography>
        </Paper>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Paper sx={{ p: 2, flex: { xs: '1 1 auto', md: '0 0 35%' } }}>
            <Skeleton variant="rounded" height={32} sx={{ mb: 2 }} />
              {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={88} sx={{ mb: 1.5 }} />
            ))}
          </Paper>
          <Paper sx={{ flex: 1, p: 0, overflow: 'hidden', height: { xs: 320, md: 520 } }}>
            <Skeleton variant="rounded" height="100%" />
          </Paper>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ mb: 1 }}>{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
        </Paper>
      </Box>
    );
  }

  const LabsList = () => (
    <List sx={{ p: 0 }}>
      {filteredLabs.map((lab) => {
        const isExpanded = expandedId === lab.id;
        const coords = lab.coordinates || lab.location;
        const avatarSrc = lab.image || '';
  return (
          <Paper key={lab.id} sx={{ mb: 1.5, p: 1.25, border: '1px solid', borderColor: activeLabId === lab.id ? 'primary.light' : 'divider' }}>
            <ListItem disableGutters onClick={() => { setExpandedId(isExpanded ? null : lab.id); handleLabClick(lab); }} sx={{ cursor: 'pointer' }}>
              <ListItemAvatar>
                {avatarSrc ? (
                  <Avatar variant="rounded" src={avatarSrc} alt={lab.name} sx={{ width: 56, height: 56 }} />
                ) : (
                  <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
                    <LocalHospitalIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={700}>{lab.name}</Typography>
                    {typeof lab.rating !== 'undefined' && (
                      <Chip size="small" icon={<StarIcon sx={{ fontSize: 16 }} />} label={lab.rating} />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                    {lab.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{lab.address}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            {/* Expanded content */}
            {isExpanded && (
              <Box sx={{ mt: 1.25 }}>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {lab.timing && <Chip size="small" icon={<AccessTimeIcon />} label={lab.timing} />}
                  {lab.distance && <Chip size="small" icon={<NearMeIcon />} label={`${formatDistance(lab.distance)} away`} variant="outlined" />}
                  {coords && typeof coords.lat === 'number' && typeof coords.lng === 'number' && (
                    <Chip size="small" label={`${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`} variant="outlined" />
                  )}
                </Box>
                {lab.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{lab.address}</Typography>
                  </Box>
                )}
                {Array.isArray(lab.services) && lab.services.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
                    {lab.services.map((s, idx) => (
                      <Chip key={idx} label={s} size="small" variant="outlined" />
                    ))}
                    
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  {lab.phone && (
                    <Button size="small" startIcon={<PhoneIcon />} component="a" href={`tel:${lab.phone}`}>Call</Button>
                  )}
                  <Button size="small" variant="outlined" onClick={(e) => handleBook(lab, e)}>Book</Button>
                </Box>
              </Box>
            )}
          </Paper>
        );
      })}
      {filteredLabs.length === 0 && (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No labs found</Typography>
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
            <TextField fullWidth size="small" placeholder="Search labs, services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Box>
        </Paper>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <LabsList />
        </Box>
      </Box>

      {/* Right: Map */}
      <Box sx={{ width: { xs: '100%', md: '65%' }, position: 'relative', height: { xs: '100vh', md: '100vh' } }}>
        {renderMap()}
        {!isMdUp && !sheetOpen && (
          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
            <Button variant="contained" onClick={() => setSheetOpen(true)}>View Labs</Button>
          </Box>
        )}
      </Box>

      {/* Bottom Sheet for mobile list */}
      <Drawer anchor="bottom" open={sheetOpen} onClose={() => setSheetOpen(false)} PaperProps={{ sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search labs, services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
            <Button onClick={() => setSheetOpen(false)}>Close</Button>
          </Box>
        </Box>
        <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
          <LabsList />
        </Box>
      </Drawer>
    </Box>
  );
}

export default LabTests; 