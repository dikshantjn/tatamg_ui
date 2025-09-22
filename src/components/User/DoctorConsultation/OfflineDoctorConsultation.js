import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';
import { Box, Paper, Typography, Avatar, Chip, Button, List, ListItem, ListItemAvatar, ListItemText, Divider, Drawer, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Default profile icon as fallback
const DEFAULT_PROFILE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Default location for static map
const defaultLocation = "20.5937, 78.9629"; // Center of India

function OfflineDoctorConsultation() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Center of India
  const [search, setSearch] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const doctorsData = await doctorConsultationService.getOfflineDoctors();
      const formattedDoctors = doctorsData.map(doc => {
        const [lat, lng] = doc.location.split(',').map(coord => parseFloat(coord.trim()));
        return {
          id: doc.id,
          vendorId: doc.vendorId || doc.id, // Fallback to id if vendorId is not available
          name: doc.doctorName,
          specialty: doc.specializations.join(', '),
          rating: 4.5,
          avatar: doc.profilePicture,
          lat,
          lng,
          address: `${doc.address}, ${doc.city}, ${doc.state} - ${doc.pincode}`,
          experience: doc.experienceYears,
          consultationFee: doc.consultationFeesRange,
          languages: doc.languageProficiency.join(', '),
          education: doc.educationalQualifications.join(', ')
        };
      });
      setDoctors(formattedDoctors);
      
      // Update map center to first doctor's location if available
      if (formattedDoctors.length > 0) {
        setMapCenter({ lat: formattedDoctors[0].lat, lng: formattedDoctors[0].lng });
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  // Open bottom sheet by default on mobile
  useEffect(() => {
    if (!isMdUp) {
      setSheetOpen(true);
    }
  }, [isMdUp]);

  const renderMap = () => {
    const centerCoords = `${mapCenter.lat},${mapCenter.lng}`;
    return (
      <iframe
        src={`https://maps.google.com/maps?q=${centerCoords}&z=11&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_PROFILE;
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>Loading doctors...</Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>{error}</Paper>
      </Box>
    );
  }

  const DoctorList = () => (
    <List sx={{ p: 0 }}>
      {doctors
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
        .map((doc) => (
          <Paper key={doc.id} sx={{ p: 1.5, mb: 1.5, border: '1px solid', borderColor: 'divider' }}>
            <ListItem alignItems="flex-start" disableGutters>
              <ListItemAvatar>
                <Avatar src={doc.avatar} alt={doc.name} onError={handleImageError} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight={700}>{doc.name}</Typography>}
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">{doc.specialty}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip icon={<WorkIcon />} label={`${doc.experience} yrs`} size="small" />
                      <Chip icon={<StarIcon />} label={`${doc.rating || 4.5}`} size="small" />
                      <Chip icon={<SchoolIcon />} label={doc.education} size="small" />
                      <Chip label={`₹${doc.consultationFee}`} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{doc.address}</Typography>
                    </Box>
                  </Box>
                }
              />
              <Button variant="contained" size="small" onClick={() => navigate(`/doctor-consultation/offline/book/${doc.vendorId}`, { state: { doctorData: doc } })}>
                Book
              </Button>
            </ListItem>
          </Paper>
        ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left: List for desktop */}
      <Box sx={{ width: { xs: '100%', md: '40%' }, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider' }}>
        <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search doctors, specialties..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Box>
        </Paper>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <DoctorList />
        </Box>
      </Box>

      {/* Right: Map */}
      <Box sx={{ width: { xs: '100%', md: '60%' }, position: 'relative' }}>
        {renderMap()}
        {/* Mobile action button (visible only when sheet is closed) */}
        {!isMdUp && !sheetOpen && (
          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
            <Button variant="contained" onClick={() => setSheetOpen(true)}>View Doctors</Button>
          </Box>
        )}
      </Box>

      {/* Bottom Sheet for mobile list */}
      <Drawer anchor="bottom" open={sheetOpen} onClose={() => setSheetOpen(false)} PaperProps={{ sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Search doctors, specialties..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
            <Button onClick={() => setSheetOpen(false)}>Close</Button>
          </Box>
        </Box>
        <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
          <DoctorList />
        </Box>
      </Drawer>
    </Box>
  );
}

export default OfflineDoctorConsultation; 