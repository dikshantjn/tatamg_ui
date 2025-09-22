import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import findDoctorImg from '../../../assets/Find Doctors Near You.png';
import consultImg from '../../../assets/consult.jpg';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
/* removed contact actions */
import PercentIcon from '@mui/icons-material/Percent';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShieldIcon from '@mui/icons-material/Shield';

const offers = [
  {
    icon: <PercentIcon fontSize="medium" />,
    title: '20% Off First Consultation',
    desc: 'Get 20% off on your first online doctor consultation.',
    code: 'FIRST20',
    badge: '20% OFF',
    color: 'linear-gradient(135deg, #E0F7FA 0%, #E3F2FD 100%)',
    badgeColor: 'linear-gradient(90deg, #FFF7D1 0%, #FFE8A3 100%)',
    badgeTextColor: '#334155',
  },
  {
    icon: <CardGiftcardIcon fontSize="medium" />,
    title: 'Free Follow-up',
    desc: 'Book now and get a free follow-up within 7 days.',
    code: 'FREEREVIEW',
    badge: 'FREE',
    color: 'linear-gradient(135deg, #E3F2FD 0%, #F3E8FF 100%)',
    badgeColor: 'linear-gradient(90deg, #FFF7D1 0%, #FFE8A3 100%)',
    badgeTextColor: '#334155',
  },
  {
    icon: <PercentIcon fontSize="medium" />,
    title: 'Lab Test Discount',
    desc: 'Flat 15% off on lab tests with any doctor booking.',
    code: 'LAB15',
    badge: '15% OFF',
    color: 'linear-gradient(135deg, #E0F2F1 0%, #E8F5E9 100%)',
    badgeColor: 'linear-gradient(90deg, #FFF7D1 0%, #FFE8A3 100%)',
    badgeTextColor: '#334155',
  },
];

function ConsultDoctors() {
  const offersListRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const navigate = useNavigate();

  const scrollOffers = (direction) => {
    const node = offersListRef.current;
    if (!node) return;
    const cardWidth = node.firstChild ? node.firstChild.offsetWidth + 18 : 300;
    const maxScroll = (offers.length - 1) * cardWidth;
    let newScroll = node.scrollLeft + direction * cardWidth;
    if (newScroll < 0) newScroll = 0;
    if (newScroll > maxScroll) newScroll = maxScroll;
    node.scrollTo({ left: newScroll, behavior: 'smooth' });
    setScrollIndex(Math.round(newScroll / cardWidth));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(180deg, #ffffff 0%, #F6FBFC 100%)',
              '&:hover': { boxShadow: 3 }
            }}
            onClick={() => navigate('/doctor-consultation/offline')}
          >
            <Box sx={{ position: 'relative' }}>
              <img src={findDoctorImg} alt="Find Doctor Near You" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
              <Chip label="2,847 Doctors" size="small" sx={{ position: 'absolute', bottom: -8, left: 0 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700}>Find Doctor Near You</Typography>
              <Typography variant="body2" color="text.secondary">Book appointments with top doctors in your area</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip icon={<LocationOnIcon />} label="Nearby" size="small" />
                <Chip icon={<StarIcon />} label="Top Rated" size="small" />
                <Chip icon={<AccessTimeIcon />} label="Same Day" size="small" />
              </Box>
              <Button
                sx={{ mt: 1, borderColor: 'grey.400', color: 'text.primary', '&:hover': { backgroundColor: 'action.hover', borderColor: 'grey.500' } }}
                size="small"
                variant="outlined"
              >
                Find Now
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(180deg, #ffffff 0%, #F6FBFC 100%)',
              '&:hover': { boxShadow: 3 }
            }}
            onClick={() => navigate('/doctor-consultation/online')}
          >
            <Box sx={{ position: 'relative' }}>
              <img src={consultImg} alt="Online Doctor Consultation" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
              <Chip label="1,234 Online" size="small" sx={{ position: 'absolute', bottom: -8, left: 0 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700}>Online Doctor Consultation</Typography>
              <Typography variant="body2" color="text.secondary">Instant video or chat with certified doctors</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip icon={<VideocamIcon />} label="HD Video" size="small" />
                <Chip icon={<FlashOnIcon />} label="Instant" size="small" />
                <Chip icon={<ShieldIcon />} label="Secure" size="small" />
              </Box>
              <Button
                sx={{ mt: 1, borderColor: 'grey.400', color: 'text.primary', '&:hover': { backgroundColor: 'action.hover', borderColor: 'grey.500' } }}
                size="small"
                variant="outlined"
              >
                Consult Now
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>


      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Special Offers</Typography>
        <Box sx={{ position: 'relative' }}>
          <IconButton onClick={() => scrollOffers(-1)} sx={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper', boxShadow: 2 }} aria-label="Scroll left">
            <ChevronLeftIcon />
          </IconButton>
          <Box ref={offersListRef} sx={{ display: 'flex', gap: 2, overflowX: 'auto', px: 6, '::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
            {offers.map((offer, idx) => (
              <Paper key={idx} sx={{ p: 2, minWidth: 280, background: offer.color, color: '#0f172a', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Chip label={offer.badge} sx={{ background: offer.badgeColor, color: offer.badgeTextColor, mb: 1, fontWeight: 700 }} />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ fontSize: 0 }}>{offer.icon}</Box>
                  <Box>
                    <Typography fontWeight={700}>{offer.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{offer.desc}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip size="small" label={offer.code} variant="outlined" />
                      <Button size="small" variant="contained" color="primary" sx={{ color: 'common.white' }}>Use Now</Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
          <IconButton onClick={() => scrollOffers(1)} sx={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper', boxShadow: 2 }} aria-label="Scroll right">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ConsultDoctors;
