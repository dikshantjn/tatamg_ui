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

function MainServices() {
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
        py: { xs: 2, sm: 3 },
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Stronger blurry accents */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.35), transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      {/* Services Grid */}
      <Box
        sx={{
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: {
            sm: 'repeat(4, 1fr)',
            md: 'repeat(8, 1fr)'
          },
          gap: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          zIndex: 1,
          overflowX: isMobile ? 'auto' : 'visible',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
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
              height: isMobile ? 90 : { sm: 110 },
              width: isMobile ? 80 : 'auto',
              flexShrink: 0,
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              border: `1px solid ${service.color}50`,
              backgroundColor: `${service.color}25`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              '&:hover': {
                transform: 'translateY(-3px)',
                backgroundColor: `${service.color}35`,
                boxShadow: `0 6px 20px ${service.color}50`
              }
            }}
          >
            {/* Icon */}
            <Box sx={{ mb: 0.5 }}>
              {service.icon}
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
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
