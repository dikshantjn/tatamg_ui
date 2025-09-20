import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button
} from '@mui/material';
import {
    LocalPharmacy,
    LocalShipping,
    HealthAndSafety,
    Favorite,
    MonitorHeart
} from '@mui/icons-material';

const HeroBanner = ({ isAuthenticated, onAuthChange }) => {
    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners = [
        {
            id: 1,
            title: "20% off on Medicines!",
            subtitle: "Use code MED20 for 20% off.",
            description: "Save big on your medicine orders",
            cta: "Shop Now",
            link: "/search?category=medicines",
            backgroundColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            accentColor: "#0D89C7",
            icon: <LocalPharmacy sx={{ fontSize: 32, color: '#0D89C7' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "20% OFF",
            type: "discount"
        },
        {
            id: 2,
            title: "Buy 1 Get 1 Free on Lab Tests!",
            subtitle: "Get one test free on purchase.",
            description: "Comprehensive health checkup",
            cta: "Book Now",
            link: "/lab-tests",
            backgroundColor: "linear-gradient(135deg, #E0F2FE 0%, #B3E5FC 100%)",
            accentColor: "#0E76B5",
            icon: <MonitorHeart sx={{ fontSize: 32, color: '#0E76B5' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "B1G1",
            type: "offer"
        },
        {
            id: 3,
            title: "Blood Bank Donation!",
            subtitle: "Donate blood, save lives.",
            description: "Make a difference today",
            cta: "Donate Now",
            link: "/blood-bank",
            backgroundColor: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
            accentColor: "#FCD100",
            icon: <Favorite sx={{ fontSize: 32, color: '#FCD100' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "SAVE LIVES",
            type: "offer"
        },
        {
            id: 4,
            title: "Flat 15% off on Orders!",
            subtitle: "Get 15% off on all orders.",
            description: "Limited time offer",
            cta: "Order Now",
            link: "/search",
            backgroundColor: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
            accentColor: "#F1E398",
            icon: <LocalPharmacy sx={{ fontSize: 32, color: '#F1E398' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "15% OFF",
            type: "discount"
        },
        {
            id: 5,
            title: "10% off on Health Checkups!",
            subtitle: "Book a checkup and save 10%.",
            description: "Preventive healthcare",
            cta: "Book Now",
            link: "/health-screening",
            backgroundColor: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
            accentColor: "#874292",
            icon: <HealthAndSafety sx={{ fontSize: 32, color: '#874292' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "10% OFF",
            type: "discount"
        },
        {
            id: 6,
            title: "Free Delivery on Orders!",
            subtitle: "Free delivery for all orders.",
            description: "No delivery charges",
            cta: "Order Now",
            link: "/new-medicine-order",
            backgroundColor: "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
            accentColor: "#6A5D7B",
            icon: <LocalShipping sx={{ fontSize: 32, color: '#6A5D7B' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "FREE",
            type: "offer"
        },
        {
            id: 7,
            title: "World Kidney Day - 13 March",
            subtitle: "Get your kidney tested today for early detection and preventive measures.",
            description: "Raise awareness about kidney health",
            cta: "Learn More",
            link: "/health-screening?test=kidney",
            backgroundColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            accentColor: "#3B5998",
            icon: <HealthAndSafety sx={{ fontSize: 32, color: '#3B5998' }} />,
            image: require("../../../assets/healthDays/worldKidneyDay.png"),
            discount: "HEALTH DAY",
            type: "health_days"
        },
        {
            id: 8,
            title: "Glaucoma Day - 12 March",
            subtitle: "Protect your eyes! Get tested today for early detection and preventive care.",
            description: "Early detection can save vision",
            cta: "Book Test",
            link: "/lab-tests?test=eye",
            backgroundColor: "linear-gradient(135deg, #E0F2FE 0%, #B3E5FC 100%)",
            accentColor: "#2E86C1",
            icon: <HealthAndSafety sx={{ fontSize: 32, color: '#2E86C1' }} />,
            image: require("../../../assets/healthDays/glaucoma.png"),
            discount: "EYE CARE",
            type: "health_days"
        },
        {
            id: 9,
            title: "Measles Immunization Day - 16 March",
            subtitle: "Vaccinate your children to prevent measles! Ensure they receive two doses.",
            description: "Protect your children",
            cta: "Vaccinate Now",
            link: "/vaccines",
            backgroundColor: "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
            accentColor: "#E74C3C",
            icon: <HealthAndSafety sx={{ fontSize: 32, color: '#E74C3C' }} />,
            image: require("../../../assets/healthDays/glaucoma.png"),
            discount: "VACCINE",
            type: "health_days"
        }
    ];

    // Auto-rotate hero
    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }
        }, 4000);
        return () => clearInterval(timer);
    }, [isPaused, banners.length]);


    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        if (isAuthenticated) {
            navigate(path);
        } else {
            if (onAuthChange && typeof onAuthChange === 'function') {
                onAuthChange('showSignin');
            }
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
                py: { xs: 2, sm: 3 },
                position: 'relative'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >

            {/* Slides Track */}
            <Box
                sx={{
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: `${banners.length * 100}%`,
                        transform: `translateX(-${currentIndex * (100 / banners.length)}%)`,
                        transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {banners.map((banner) => (
                        <Box
                            key={banner.id}
                            sx={{
                                width: `${100 / banners.length}%`,
                                minWidth: `${100 / banners.length}%`,
                                background: banner.backgroundColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                px: { xs: 2, sm: 3, md: 6 },
                                py: { xs: 4, sm: 5 },
                                gap: 3,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={(e) => handleNavigation(banner.link, e)}
                        >
                            {/* Geometric Background Shapes */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 0,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(45deg, ${banner.accentColor}20, ${banner.accentColor}10)`,
                                        top: '-50px',
                                        right: '-50px',
                                        zIndex: 0
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: '150px',
                                        height: '150px',
                                        background: `linear-gradient(135deg, ${banner.accentColor}15, transparent)`,
                                        borderRadius: '20px',
                                        bottom: '-30px',
                                        left: '-30px',
                                        transform: 'rotate(45deg)',
                                        zIndex: 0
                                    }
                                }}
                            />
                            
                            {/* Additional geometric shapes based on banner type */}
                            {banner.type === 'discount' && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '100px',
                                        height: '100px',
                                        background: `linear-gradient(60deg, ${banner.accentColor}25, transparent)`,
                                        borderRadius: '50%',
                                        top: '20%',
                                        right: '10%',
                                        zIndex: 0
                                    }}
                                />
                            )}
                            
                            {banner.type === 'offer' && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '80px',
                                        height: '80px',
                                        background: `linear-gradient(30deg, ${banner.accentColor}20, transparent)`,
                                        borderRadius: '10px',
                                        top: '60%',
                                        left: '5%',
                                        transform: 'rotate(30deg)',
                                        zIndex: 0
                                    }}
                                />
                            )}
                            
                            {banner.type === 'health_days' && (
                                <>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: '120px',
                                            height: '120px',
                                            background: `linear-gradient(120deg, ${banner.accentColor}15, transparent)`,
                                            borderRadius: '30px',
                                            top: '10%',
                                            left: '15%',
                                            transform: 'rotate(-20deg)',
                                            zIndex: 0
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: '60px',
                                            height: '60px',
                                            background: `linear-gradient(45deg, ${banner.accentColor}30, transparent)`,
                                            borderRadius: '50%',
                                            bottom: '20%',
                                            right: '20%',
                                            zIndex: 0
                                        }}
                                    />
                                </>
                            )}
                            {/* Text */}
                            <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ mb: 1 }}>{banner.icon}</Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: 'text.primary',
                                        fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
                                        lineHeight: 1.2,
                                        mb: 1
                                    }}
                                >
                                    {banner.subtitle}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        mb: 2
                                    }}
                                >
                                    {banner.description}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigation(banner.link, e);
                                    }}
                                    sx={{
                                        borderColor: banner.accentColor,
                                        color: banner.accentColor,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 2.5,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        '&:hover': { 
                                            backgroundColor: banner.accentColor, 
                                            color: 'white',
                                            borderColor: banner.accentColor
                                        }
                                    }}
                                >
                                    {banner.cta}
                                </Button>
                            </Box>

                            {/* Image */}
                            <Box
                                component="img"
                                src={banner.image}
                                alt={banner.title}
                                sx={{
                                    width: { xs: 120, sm: 160, md: 220 },
                                    height: 'auto',
                                    borderRadius: 2,
                                    boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                                    display: { xs: 'none', sm: 'block' },
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            />

                            {/* Dots Indicator - Inside Banner */}
                            <Box 
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 16,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: 1,
                                    zIndex: 2
                                }}
                            >
                                {banners.map((b, i) => (
                                    <Box
                                        key={b.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(i);
                                        }}
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: i === currentIndex ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                transform: 'scale(1.2)'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

        </Box>
    );
};

// Default props to prevent errors
HeroBanner.defaultProps = {
    isAuthenticated: false,
    onAuthChange: () => {}
};

export default HeroBanner;