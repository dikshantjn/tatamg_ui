import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    IconButton,
    useTheme,
    useMediaQuery,
    Container,
    Chip,
    Rating
} from '@mui/material';
import {
    ArrowBackIos,
    ArrowForwardIos,
    FormatQuote,
    Verified
} from '@mui/icons-material';
import female1 from '../../../assets/Testimonial female face 1.jpg';
import male1 from '../../../assets/Testimonial male face 1.jpg';
import female2 from '../../../assets/Testimonial female face 2.jpg';
import male2 from '../../../assets/Testimonial male face 3.jpg';

function Testimonials() {
    const theme = useTheme();

  const testimonialsData = [
    {
      name: 'Dr. Sarah Johnson',
            designation: 'Senior Healthcare Advisor',
            credentials: 'MBBS, MD',
      text: 'With over 15 years of experience in healthcare consulting, I\'ve seen how this platform revolutionizes access to quality medical care. The integration of technology with healthcare delivery is truly remarkable.',
      image: female1,
            rating: 5,
            specialty: 'Healthcare Consulting'
    },
    {
      name: 'Dr. Michael Chen',
            designation: 'Medical Technology Advisor',
            credentials: 'MD, MPH',
      text: 'The platform\'s commitment to patient safety and data security is exemplary. Their innovative approach to telemedicine and healthcare delivery sets new standards in the industry.',
      image: male1,
            rating: 5,
            specialty: 'Medical Technology'
    },
    {
      name: 'Dr. Priya Sharma',
            designation: 'Wellness & Preventive Care Advisor',
            credentials: 'MBBS, DNB',
      text: 'What sets this platform apart is its holistic approach to healthcare. From preventive care to specialized treatments, the comprehensive coverage ensures patients receive the best possible care.',
      image: female2,
            rating: 5,
            specialty: 'Preventive Care'
    },
    {
      name: 'Dr. James Wilson',
            designation: 'Healthcare Policy Advisor',
            credentials: 'MD, PhD',
      text: 'The platform\'s ability to connect patients with specialized care while maintaining affordability is impressive. Their focus on quality and accessibility makes healthcare more democratic.',
      image: male2,
            rating: 5,
            specialty: 'Healthcare Policy'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1));
  }, [testimonialsData.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Auto-scroll functionality
  useEffect(() => {
    let intervalId;

    if (!isAutoScrollPaused) {
      intervalId = setInterval(() => {
        handleNextClick();
      }, 5000); // Change testimonial every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoScrollPaused, handleNextClick]);

    const currentTestimonial = testimonialsData[currentIndex];

  return (
        <Box
            sx={{
                py: { xs: 4, md: 6 },
                backgroundColor: 'background.default',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(56, 163, 165, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)',
                    zIndex: 0
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 5,
                        px: { xs: 2, md: 0 }
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 2,
                            fontSize: { xs: '1.75rem', md: '2.5rem' }
                        }}
                    >
                        Our Healthcare Advisors
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 600,
                            mx: 'auto',
                            fontSize: { xs: '1rem', md: '1.125rem' }
                        }}
                    >
                        Expert insights from leading healthcare professionals who trust and recommend our platform
                    </Typography>
                </Box>

                {/* Testimonial Card */}
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: 800,
                        mx: 'auto',
                        px: { xs: 2, md: 0 }
                    }}
      onMouseEnter={() => setIsAutoScrollPaused(true)}
      onMouseLeave={() => setIsAutoScrollPaused(false)}
                >
                    <Card
                        sx={{
                            borderRadius: 4,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                            border: '1px solid',
                            borderColor: 'grey.200',
                            position: 'relative',
                            overflow: 'visible',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            {/* Quote Icon */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -20,
                                    left: 40,
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}
                            >
                                <FormatQuote sx={{ fontSize: 20 }} />
                            </Box>

                            {/* Testimonial Content */}
                            <Box sx={{ mt: 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                        lineHeight: 1.7,
                                        color: 'text.primary',
                                        fontStyle: 'italic',
                                        mb: 4,
                                        textAlign: 'center'
                                    }}
                                >
                                    "{currentTestimonial.text}"
                                </Typography>

                                {/* Doctor Info */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2
                                    }}
                                >
                                    {/* Avatar */}
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            src={currentTestimonial.image}
                                            alt={currentTestimonial.name}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                border: '3px solid',
                                                borderColor: 'primary.main'
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -2,
                                                right: -2,
                                                backgroundColor: 'success.main',
                                                borderRadius: '50%',
                                                width: 24,
                                                height: 24,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white'
                                            }}
                                        >
                                            <Verified sx={{ fontSize: 14 }} />
                                        </Box>
                                    </Box>

                                    {/* Doctor Details */}
                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                mb: 0.5
                                            }}
                                        >
                                            {currentTestimonial.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 600,
                                                mb: 0.5
                                            }}
                                        >
                                            {currentTestimonial.designation}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                                display: 'block',
                                                mb: 1
                                            }}
                                        >
                                            {currentTestimonial.credentials}
                                        </Typography>
                                        
                                        {/* Specialty Chip */}
                                        <Chip
                                            label={currentTestimonial.specialty}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'primary.50',
                                                color: 'primary.main',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>

                                    {/* Rating */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Rating
                                            value={currentTestimonial.rating}
                                            readOnly
                                            size="small"
                                            sx={{ color: 'warning.main' }}
                                        />
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                                        >
                                            {currentTestimonial.rating}.0
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Navigation Arrows */}
                    <IconButton
                        onClick={handlePrevClick}
                        sx={{
                            position: 'absolute',
                            left: { xs: -10, md: -20 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'white',
                            boxShadow: 2,
                            '&:hover': {
                                backgroundColor: 'grey.50'
                            }
                        }}
                    >
                        <ArrowBackIos />
                    </IconButton>

                    <IconButton
                        onClick={handleNextClick}
                        sx={{
                            position: 'absolute',
                            right: { xs: -10, md: -20 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'white',
                            boxShadow: 2,
                            '&:hover': {
                                backgroundColor: 'grey.50'
                            }
                        }}
                    >
                        <ArrowForwardIos />
                    </IconButton>
                </Box>

                {/* Dots Indicator */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mt: 4
                    }}
                >
        {testimonialsData.map((_, index) => (
                        <Box
            key={index}
            onClick={() => handleDotClick(index)}
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: currentIndex === index ? 'primary.main' : 'grey.300',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: currentIndex === index ? 'primary.dark' : 'grey.400'
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Progress Bar */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 200,
                        height: 3,
                        backgroundColor: 'grey.200',
                        borderRadius: 2,
                        mx: 'auto',
                        mt: 3,
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            width: `${((currentIndex + 1) / testimonialsData.length) * 100}%`,
                            height: '100%',
                            backgroundColor: 'primary.main',
                            transition: 'width 0.3s ease'
                        }}
                    />
                </Box>
            </Container>
        </Box>
  );
}

export default Testimonials;


