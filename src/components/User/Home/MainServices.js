import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocalShipping,
  LocalPharmacy,
  Hotel,
  Science,
  Bloodtype,
  PersonAdd,
  Storefront,
  Article
} from '@mui/icons-material';

function MainServices({ compact = false }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigation = (path, e) => {
    if (e) e.preventDefault();
    navigate(path);
  };

  const services = [
    {
      title: 'Ambulance',
      icon: <LocalShipping sx={{ fontSize: { xs: 34, sm: 40 }, color: '#EF4444' }} />,
      color: '#EF4444',
      link: '/ambulance'
    },
    {
      title: 'Medicine',
      icon: <LocalPharmacy sx={{ fontSize: { xs: 34, sm: 40 }, color: '#10B981' }} />,
      color: '#10B981',
      link: '/new-medicine-order'
    },
    {
      title: 'Hospital',
      icon: <Hotel sx={{ fontSize: { xs: 34, sm: 40 }, color: '#8B5CF6' }} />,
      color: '#8B5CF6',
      link: '/hospital-bed-booking'
    },
    {
      title: 'Doctor',
      icon: <PersonAdd sx={{ fontSize: { xs: 34, sm: 40 }, color: '#3B82F6' }} />,
      color: '#3B82F6',
      link: '/doctor-consultation'
    },
    {
      title: 'Lab Test',
      icon: <Science sx={{ fontSize: { xs: 34, sm: 40 }, color: '#F59E0B' }} />,
      color: '#F59E0B',
      link: '/lab-tests'
    },
    {
      title: 'Blood',
      icon: <Bloodtype sx={{ fontSize: { xs: 34, sm: 40 }, color: '#EC4899' }} />,
      color: '#EC4899',
      link: '/blood-bank'
    },
    {
      title: 'Products',
      icon: <Storefront sx={{ fontSize: { xs: 34, sm: 40 }, color: '#06B6D4' }} />,
      color: '#06B6D4',
      link: '/products'
    },
    {
      title: 'Blogs',
      icon: <Article sx={{ fontSize: { xs: 34, sm: 40 }, color: '#8B5A2B' }} />,
      color: '#8B5A2B',
      link: '/health-blogs'
    }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        py: compact ? 1 : { xs: 2, sm: 3 },
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      {/* Services Grid */}
      <Box
        sx={{
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: {
            sm: 'repeat(8, minmax(100px, 1fr))',
            md: 'repeat(8, minmax(120px, 1fr))'
          },
          columnGap: isMobile ? 1 : (compact ? 1.5 : 2),
          rowGap: isMobile ? 0 : (compact ? 1 : 2),
          px: compact ? 0 : { xs: 2, sm: 3, md: 0 },
          position: 'relative',
          zIndex: 1,
          overflowX: isMobile ? 'auto' : 'visible',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: isMobile ? 'x mandatory' : 'none'
        }}
      >
        {services.map((service, index) => (
          <Box
            key={service.title}
            onClick={(e) => handleNavigation(service.link, e)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: compact ? 78 : (isMobile ? 88 : 96),
              width: isMobile ? 'calc(25% - 8px)' : '100%',
              flex: isMobile ? '0 0 calc(25% - 8px)' : '0 0 auto',
              flexShrink: 0,
              p: compact ? 1 : { xs: 1.5, sm: 2 },
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              scrollSnapAlign: isMobile ? 'start' : 'none',
              '&:hover': {
                transform: 'translateY(-3px)',
                backgroundColor: 'rgba(0,0,0,0.02)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }
            }}
          >
            {/* Icon */}
            <Box sx={{ mb: 0.5 }}>
              {React.cloneElement(service.icon, { sx: { ...service.icon.props.sx, fontSize: compact ? 28 : service.icon.props.sx.fontSize } })}
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: compact ? '0.75rem' : { xs: '0.8rem', sm: '0.9rem' },
                lineHeight: 1.2
              }}
            >
              {service.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MainServices;
