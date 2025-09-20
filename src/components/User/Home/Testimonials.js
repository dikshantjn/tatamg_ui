import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Container,
    Chip
} from '@mui/material';
import {
    FormatQuote,
    Verified
} from '@mui/icons-material';
// Removed unused legacy testimonial assets
import drVishal from '../../../assets/doctorsPic/DrVishalBhandari.jpeg';
import drPiyush from '../../../assets/doctorsPic/Piyush-Lodha.jpg';
import drSachin from '../../../assets/doctorsPic/Dr.sachin-lakade.png';
import drSweta from '../../../assets/doctorsPic/Dr.-Sweta-Lunkad.webp';
import drRajeev from '../../../assets/doctorsPic/DrRajeevDoshi.jpeg';
import drAmrut from '../../../assets/doctorsPic/Dr.AmrutOswal.jpg';

function Testimonials() {

  const mobileTestimonials = [
    {
      name: 'Dr. Vishal Bhandari',
      designation: 'Anesthesiologist',
      credentials: 'MBBS, MD (Internal Medicine)',
      text: 'A seasoned anesthesiologist renowned in Pune region for anesthesia expertise. Known for his calm presence in stressful OR and ICU settings, supporting safe surgical outcomes and patient comfort.',
      image: drVishal,
      rating: 5,
      specialty: 'Anesthesiology'
    },
    {
      name: 'Dr. Piyush Lodha',
      designation: 'Endocrinologist',
      credentials: 'MBBS, MD – Medicine, DM – Endocrinology',
      text: 'A distinguished endocrinologist treating hormonal disorders across ages—from diabetes and thyroid to growth and adrenal diseases. Has strong academic credentials with award-winning conference papers and integrates advanced tools for diabetes management.',
      image: drPiyush,
      rating: 5,
      specialty: 'Endocrinology'
    },
    {
      name: 'Dr. Sachin Lakade',
      designation: 'Cardiologist',
      credentials: 'MBBS, MD – General Medicine, DNB – Cardiology',
      text: 'A well-established cardiologist delivering comprehensive cardiac care, from preventive screening to advanced procedures like angioplasty and pacemaker management. Known for his patient-centric approach and precision in diagnosis.',
      image: drSachin,
      rating: 5,
      specialty: 'Cardiology'
    },
    {
      name: 'Dr. Sweta Lunkad',
      designation: 'Haematologist',
      credentials: 'MBBS, DNB – General Medicine, DM – Clinical Haematology',
      text: 'A leading haematologist performing advanced bone marrow transplants including autologous, allogeneic, MUD and haploidentical types. Recognized for expertise in complex blood disorders and compassionate patient care.',
      image: drSweta,
      rating: 5,
      specialty: 'Haematology'
    },
    {
      name: 'Dr. Rajeev Doshi',
      designation: 'General Surgeon, Laparoscopic Surgeon, Proctologist',
      credentials: 'MBBS, MS – General Surgery, DNB – General Surgery',
      text: 'An accomplished surgeon specializing in laparoscopic, gastrointestinal, and proctology procedures. Known for precise minimally invasive techniques and a track record of effective treatment for complex surgical cases.',
      image: drRajeev,
      rating: 5,
      specialty: 'General Surgery'
    },
    {
      name: 'Dr. Amrut Oswal',
      designation: 'Orthopaedic Surgeon',
      credentials: 'MBBS, Diploma in Orthopaedics, MS – Orthopaedics',
      text: 'A veteran orthopedic surgeon specializing in joint replacement, spinal surgeries, and complex fracture management. Recognized for surgical mastery and dedication to restoring mobility.',
      image: drAmrut,
      rating: 5,
      specialty: 'Orthopaedics'
    },
  ];

  const tabletTestimonials = mobileTestimonials; // same data for now

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(true);

  useEffect(() => {
    const onResize = () => {
      setIsMobileView(window.innerWidth < 900);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  // Choose dataset (mobile/tablet) first so we can use its length in callbacks
  const data = isMobileView ? mobileTestimonials : tabletTestimonials;

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1));
  }, [data.length]);

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

  const currentTestimonial = data[currentIndex % data.length];

  return (
        <Box
            sx={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                py: { xs: 3, md: 4 },
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
                        mb: 3,
                        px: { xs: 1.5, md: 0 }
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1.5,
                            fontSize: { xs: '1.5rem', md: '2rem' }
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
                            fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                    >
                        Expert insights from leading healthcare professionals who trust and recommend our platform
                    </Typography>
                </Box>

                {/* Testimonial Panel */}
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: 800,
                        mx: 'auto',
                        px: { xs: 2, md: 3 },
                        py: { xs: 2, md: 3 },
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                    onMouseEnter={() => setIsAutoScrollPaused(true)}
                    onMouseLeave={() => setIsAutoScrollPaused(false)}
                >
                    {/* Doctor Profile Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                        {/* Avatar */}
                        <Box sx={{ position: 'relative' }}>
                            <Avatar 
                                src={currentTestimonial.image} 
                                alt={currentTestimonial.name} 
                                sx={{ 
                                    width: { xs: 80, sm: 100 }, 
                                    height: { xs: 80, sm: 100 }, 
                                    border: '3px solid', 
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }} 
                            />
                            <Box sx={{ 
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
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }}>
                                <Verified sx={{ fontSize: 12 }} />
                            </Box>
                        </Box>

                        {/* Doctor Details */}
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
                            <Typography sx={{ 
                                fontWeight: 800, 
                                color: 'text.primary', 
                                mb: 0.5, 
                                fontSize: { xs: '1.1rem', sm: '1.3rem' }
                            }}>
                                {currentTestimonial.name}
                            </Typography>
                            <Typography sx={{ 
                                color: 'primary.main', 
                                fontWeight: 700, 
                                mb: 0.5, 
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}>
                                {currentTestimonial.designation}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                color: 'text.secondary', 
                                display: 'block', 
                                mb: 1, 
                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                lineHeight: 1.4
                            }}>
                                {currentTestimonial.credentials}
                            </Typography>
                            <Chip 
                                label={currentTestimonial.specialty} 
                                size="small" 
                                sx={{ 
                                    backgroundColor: 'primary.50', 
                                    color: 'primary.main', 
                                    fontWeight: 700, 
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' }, 
                                    height: 24,
                                    border: '1px solid',
                                    borderColor: 'primary.200'
                                }} 
                            />
                        </Box>
                    </Box>

                    {/* Quote Section */}
                    <Box sx={{ position: 'relative' }}>
                        {/* Quote Icon */}
                        <Box sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            left: 16, 
                            width: 28, 
                            height: 28, 
                            borderRadius: '50%', 
                            backgroundColor: 'primary.main', 
                            color: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}>
                            <FormatQuote sx={{ fontSize: 16 }} />
                        </Box>

                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.7,
                                color: 'text.primary',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                pt: 1,
                                px: 1,
                                fontWeight: 500
                            }}
                        >
                            "{currentTestimonial.text}"
                        </Typography>
                    </Box>

                </Box>

                {/* Dots Indicator */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mt: 3
                    }}
                >
                    {data.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => handleDotClick(index)}
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: currentIndex === index ? 'primary.main' : 'grey.300',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: currentIndex === index ? 'primary.dark' : 'grey.400',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
  );
}

export default Testimonials;


