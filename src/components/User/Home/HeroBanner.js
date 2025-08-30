import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    useTheme,
    useMediaQuery,
    Stack,
    Fade
} from '@mui/material';
import {
    ArrowBackIos,
    ArrowForwardIos,
    KeyboardArrowDown,
    LocalHospital,
    LocalPharmacy,
    HealthAndSafety,
    Favorite,
    MonitorHeart,
    Spa,
    ChildCare
} from '@mui/icons-material';

const HeroBanner = ({ isAuthenticated, onAuthChange }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            title: "20% Off on Diabetes Essentials",
            subtitle: "Care that counts — fast, affordable, and expert-backed",
            cta: "Shop Now",
            link: "/search?category=diabetes",
            theme: "diabetes",
            backgroundColor: "linear-gradient(135deg, #E0F2FE 0%, #B3E5FC 100%)",
            accentColor: "#0288D1",
            icon: <HealthAndSafety sx={{ fontSize: 48, color: '#0288D1' }} />,
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
            layout: "left-image"
        },
        {
            id: 2,
            title: "Free Doctor Consultation",
            subtitle: "Connect with top healthcare professionals from the comfort of your home",
            cta: "Book Now",
            link: "/doctor-consultation",
            theme: "consultation",
            backgroundColor: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
            accentColor: "#7B1FA2",
            icon: <LocalHospital sx={{ fontSize: 48, color: '#7B1FA2' }} />,
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop",
            layout: "right-image"
        },
        {
            id: 3,
            title: "Home Sample Collection",
            subtitle: "Get your blood tests done at home with professional sample collection",
            cta: "Schedule Test",
            link: "/lab-tests",
            theme: "lab-test",
            backgroundColor: "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
            accentColor: "#388E3C",
            icon: <MonitorHeart sx={{ fontSize: 48, color: '#388E3C' }} />,
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop",
            layout: "left-image"
        },
        {
            id: 4,
            title: "Mental Wellness Program",
            subtitle: "Expert counseling and therapy sessions for your mental well-being",
            cta: "Start Session",
            link: "/mental-health",
            theme: "mental-health",
            backgroundColor: "linear-gradient(135deg, #FFF3E0 0%, #FFCC02 100%)",
            accentColor: "#F57C00",
            icon: <Spa sx={{ fontSize: 48, color: '#F57C00' }} />,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
            layout: "right-image"
        },
        {
            id: 5,
            title: "Family Health Packages",
            subtitle: "Comprehensive healthcare plans for your entire family's wellness",
            cta: "Get Coverage",
            link: "/family-packages",
            theme: "family",
            backgroundColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            accentColor: "#1976D2",
            icon: <ChildCare sx={{ fontSize: 48, color: '#1976D2' }} />,
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
            layout: "centered"
        },
        {
            id: 6,
            title: "Premium Medicine Delivery",
            subtitle: "Get prescribed medicines delivered to your doorstep within 2 hours",
            cta: "Order Now",
            link: "/medicine-order",
            theme: "delivery",
            backgroundColor: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)",
            accentColor: "#C2185B",
            icon: <LocalPharmacy sx={{ fontSize: 48, color: '#C2185B' }} />,
            image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop",
            layout: "left-image"
        },
        {
            id: 7,
            title: "Preventive Health Screening",
            subtitle: "Early detection saves lives. Book your comprehensive health checkup today",
            cta: "Book Screening",
            link: "/health-screening",
            theme: "screening",
            backgroundColor: "linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)",
            accentColor: "#00695C",
            icon: <Favorite sx={{ fontSize: 48, color: '#00695C' }} />,
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
            layout: "right-image"
        },
        {
            id: 8,
            title: "Emergency Care 24/7",
            subtitle: "Round-the-clock emergency medical services when you need them most",
            cta: "Call Now",
            link: "/emergency",
            theme: "emergency",
            backgroundColor: "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
            accentColor: "#D32F2F",
            icon: <LocalHospital sx={{ fontSize: 48, color: '#D32F2F' }} />,
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
            layout: "centered"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused, slides.length]);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        if (isAuthenticated) {
            navigate(path);
        } else {
            onAuthChange('showSignin');
        }
    };

    const currentSlideData = slides[currentSlide];

    return (
        <Box
            sx={{
                position: 'relative',
                height: { xs: '100vh', md: '80vh' },
                minHeight: { xs: 600, md: 500 },
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: currentSlideData.backgroundColor,
                    transition: 'background 0.5s ease'
                }}
            />

            {/* Background Shapes */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        right: '10%',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: currentSlideData.accentColor,
                        filter: 'blur(40px)'
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '5%',
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: currentSlideData.accentColor,
                        filter: 'blur(30px)'
                    }}
                />
            </Box>

            {/* Content */}
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
                <Fade in={true} timeout={500}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            flexDirection: {
                                xs: 'column',
                                md: currentSlideData.layout === 'centered' ? 'column' : 'row'
                            },
                            gap: { xs: 4, md: 6 }
                        }}
                    >
                        {/* Text Content */}
                        <Box
                            sx={{
                                flex: { xs: 'none', md: 1 },
                                textAlign: {
                                    xs: 'center',
                                    md: currentSlideData.layout === 'centered' ? 'center' : 
                                        currentSlideData.layout === 'left-image' ? 'left' : 'right'
                                },
                                order: {
                                    xs: 2,
                                    md: currentSlideData.layout === 'left-image' ? 2 : 1
                                }
                            }}
                        >
                            <Stack spacing={3} sx={{ maxWidth: 600 }}>
                                {/* Icon */}
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {currentSlideData.icon}
                                </Box>

                                {/* Title */}
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                                        lineHeight: 1.2,
                                        mb: 2
                                    }}
                                >
                                    {currentSlideData.title}
                                </Typography>

                                {/* Subtitle */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 400,
                                        lineHeight: 1.5,
                                        mb: 3
                                    }}
                                >
                                    {currentSlideData.subtitle}
                                </Typography>

                                {/* CTA Button */}
                                <Box>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={(e) => handleNavigation(currentSlideData.link, e)}
                                        sx={{
                                            backgroundColor: currentSlideData.accentColor,
                                            color: 'white',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.125rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: currentSlideData.accentColor,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 8px 25px ${currentSlideData.accentColor}40`
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {currentSlideData.cta}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>

                        {/* Image */}
                        <Box
                            sx={{
                                flex: { xs: 'none', md: 1 },
                                display: 'flex',
                                justifyContent: 'center',
                                order: {
                                    xs: 1,
                                    md: currentSlideData.layout === 'left-image' ? 1 : 2
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={currentSlideData.image}
                                alt={currentSlideData.title}
                                sx={{
                                    width: { xs: '100%', md: '80%' },
                                    maxWidth: 500,
                                    height: 'auto',
                                    borderRadius: 3,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    </Box>
                </Fade>
            </Container>

            {/* Navigation Arrows */}
            <Box
                onClick={handlePrevSlide}
                sx={{
                    position: 'absolute',
                    left: { xs: 16, md: 32 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.8)',
                    zIndex: 10,
                    cursor: 'pointer',
                    '&:hover': {
                        color: 'white',
                        transform: 'translateY(-50%) scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                <ArrowBackIos sx={{ fontSize: 32 }} />
            </Box>

            <Box
                onClick={handleNextSlide}
                sx={{
                    position: 'absolute',
                    right: { xs: 16, md: 32 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.8)',
                    zIndex: 10,
                    cursor: 'pointer',
                    '&:hover': {
                        color: 'white',
                        transform: 'translateY(-50%) scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                <ArrowForwardIos sx={{ fontSize: 32 }} />
            </Box>

            {/* Pagination Dots */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: { xs: 20, md: 40 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    zIndex: 10
                }}
            >
                {slides.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: index === currentSlide ? currentSlideData.accentColor : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: index === currentSlide ? currentSlideData.accentColor : 'rgba(255,255,255,0.8)',
                                transform: 'scale(1.2)'
                            }
                        }}
                    />
                ))}
            </Box>

            {/* Scroll Down Indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: { xs: 80, md: 100 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    animation: 'bounce 2s infinite'
                }}
            >
                <KeyboardArrowDown
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 32,
                        cursor: 'pointer'
                    }}
                />
            </Box>

            {/* CSS Animation */}
            <style>
                {`
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {
                            transform: translateX(-50%) translateY(0);
                        }
                        40% {
                            transform: translateX(-50%) translateY(-10px);
                        }
                        60% {
                            transform: translateX(-50%) translateY(-5px);
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default HeroBanner; 