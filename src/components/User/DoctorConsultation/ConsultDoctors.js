import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import findDoctorImg from '../../../assets/female doctor.jpg';
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 3, md: 4 } }}>
      {/* Main Consultation Options */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'text.primary',
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            Choose Your Consultation
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Connect with healthcare professionals through our seamless consultation platform
          </Typography>
        </Box>
        
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 3, sm: 3 },
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                border: '2px solid',
                borderColor: '#8B5CF6',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: '#7C3AED',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => navigate('/doctor-consultation/offline')}
            >
              <Box sx={{ 
                width: { xs: 80, sm: 96 }, 
                height: { xs: 80, sm: 96 },
                borderRadius: 3,
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img 
                  src={findDoctorImg} 
                  alt="Find Doctor Near You" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    color: '#8B5CF6'
                  }}
                >
                  Find Doctor Near You
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 2,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Book appointments with top doctors in your area
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  mb: 2, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Chip 
                    icon={<LocationOnIcon sx={{ fontSize: '1rem' }} />} 
                    label="Nearby" 
                    size="medium" 
                    sx={{ 
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: '#8B5CF6',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                  <Chip 
                    icon={<StarIcon sx={{ fontSize: '1rem' }} />} 
                    label="Top Rated" 
                    size="medium" 
                    sx={{ 
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: '#8B5CF6',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                  <Chip 
                    icon={<AccessTimeIcon sx={{ fontSize: '1rem' }} />} 
                    label="Same Day" 
                    size="medium" 
                    sx={{ 
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: '#8B5CF6',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
              </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    borderColor: '#8B5CF6',
                    color: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      borderColor: '#7C3AED',
                      color: '#7C3AED',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Find Now
                </Button>
            </Box>
          </Box>
        </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 3, sm: 3 },
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                border: '2px solid',
                borderColor: '#10B981',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: '#059669',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => navigate('/doctor-consultation/online')}
            >
              <Box sx={{ 
                width: { xs: 80, sm: 96 }, 
                height: { xs: 80, sm: 96 },
                borderRadius: 3,
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img 
                  src={consultImg} 
                  alt="Online Doctor Consultation" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    color: '#10B981'
                  }}
                >
                  Online Doctor Consultation
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 2,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Instant video or chat with certified doctors
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  mb: 2, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Chip 
                    icon={<VideocamIcon sx={{ fontSize: '1rem' }} />} 
                    label="HD Video" 
                    size="medium" 
                    sx={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                  <Chip 
                    icon={<FlashOnIcon sx={{ fontSize: '1rem' }} />} 
                    label="Instant" 
                    size="medium" 
                    sx={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                  <Chip 
                    icon={<ShieldIcon sx={{ fontSize: '1rem' }} />} 
                    label="Secure" 
                    size="medium" 
                    sx={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    borderColor: '#10B981',
                    color: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      borderColor: '#059669',
                      color: '#059669',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Consult Now
                </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      </Box>


      {/* Special Offers Section */}
      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'text.primary',
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            Special Offers
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Exclusive deals and discounts for your healthcare needs
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', px: { xs: 1, md: 2 } }}>
          {/* Navigation Buttons */}
          <IconButton 
            onClick={() => scrollOffers(-1)} 
            sx={{ 
              position: 'absolute', 
              left: { xs: -8, md: -12 }, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              },
              display: { xs: 'none', sm: 'flex' }
            }} 
            aria-label="Scroll left"
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <IconButton 
            onClick={() => scrollOffers(1)} 
            sx={{ 
              position: 'absolute', 
              right: { xs: -8, md: -12 }, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              },
              display: { xs: 'none', sm: 'flex' }
            }} 
            aria-label="Scroll right"
          >
            <ChevronRightIcon />
          </IconButton>
          
          {/* Offers Container */}
          <Box 
            ref={offersListRef} 
            sx={{ 
              display: 'flex', 
              gap: { xs: 2, md: 3 }, 
              overflowX: 'auto', 
              px: { xs: 2, md: 4 },
              pb: 2,
              width: '100%',
              '::-webkit-scrollbar': { 
                height: 6,
                backgroundColor: 'transparent'
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.light',
                borderRadius: 3
              },
              scrollbarWidth: 'thin',
              scrollbarColor: 'primary.light transparent'
            }}
          >
            {offers.map((offer, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                  maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                  flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)', md: '0 0 calc(33.333% - 16px)' },
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  background: offer.color,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {/* Badge */}
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Chip 
                    label={offer.badge} 
                    sx={{ 
                      background: offer.badgeColor, 
                      color: offer.badgeTextColor, 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                      borderRadius: 3
                    }} 
                  />
                </Box>
                
                {/* Content */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {offer.icon}
                    </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      color: 'text.primary'
                    }}
                  >
                    {offer.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 3,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      lineHeight: 1.6
                    }}
                  >
                    {offer.desc}
                  </Typography>
                  
                  {/* Action Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center'
                  }}>
                    <Chip 
                      label={offer.code} 
                      variant="outlined"
                      sx={{ 
                        fontWeight: 600,
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }} 
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ 
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        minWidth: 120
                      }}
                    >
                      Use Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ConsultDoctors;
