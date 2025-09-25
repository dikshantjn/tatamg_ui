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

const HeroBanner = ({ isAuthenticated = false, onAuthChange = () => {} }) => {
    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners = [
        {
            id: 1,
            title: "Medicine Discount Alert!",
            subtitle: "Save 20% on All Medicines",
            description: "Get premium quality medicines at discounted prices. Use code MED20 for instant savings on your healthcare essentials.",
            cta: "Shop Medicines",
            link: "/search?category=medicines",
            backgroundColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            accentColor: "#0D89C7",
            icon: <LocalPharmacy sx={{ fontSize: 28, color: '#0D89C7' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "20% OFF",
            type: "discount"
        },
        {
            id: 2,
            title: "Lab Test Special Offer",
            subtitle: "Buy 1 Get 1 Free",
            description: "Comprehensive health checkups at half the price. Book any lab test and get another one absolutely free.",
            cta: "Book Tests",
            link: "/lab-tests",
            backgroundColor: "linear-gradient(135deg, #E0F2FE 0%, #B3E5FC 100%)",
            accentColor: "#0E76B5",
            icon: <MonitorHeart sx={{ fontSize: 28, color: '#0E76B5' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "B1G1",
            type: "offer"
        },
        {
            id: 3,
            title: "Blood Donation Drive",
            subtitle: "Donate Blood, Save Lives",
            description: "Join our life-saving mission. Your single donation can save up to 3 lives. Book your donation slot today.",
            cta: "Donate Now",
            link: "/blood-bank",
            backgroundColor: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
            accentColor: "#FCD100",
            icon: <Favorite sx={{ fontSize: 28, color: '#FCD100' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "SAVE LIVES",
            type: "offer"
        },
        {
            id: 4,
            title: "Flash Sale Alert",
            subtitle: "15% Off Everything",
            description: "Limited time offer! Get 15% discount on all healthcare products and services. Don't miss out on these savings.",
            cta: "Shop Now",
            link: "/search",
            backgroundColor: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
            accentColor: "#874292",
            icon: <LocalPharmacy sx={{ fontSize: 28, color: '#874292' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "15% OFF",
            type: "discount"
        },
        {
            id: 5,
            title: "Health Checkup Special",
            subtitle: "10% Off Preventive Care",
            description: "Invest in your health today. Get comprehensive health checkups at discounted rates and stay ahead of health issues.",
            cta: "Book Checkup",
            link: "/health-screening",
            backgroundColor: "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
            accentColor: "#4CAF50",
            icon: <HealthAndSafety sx={{ fontSize: 28, color: '#4CAF50' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "10% OFF",
            type: "discount"
        },
        {
            id: 6,
            title: "Free Delivery Service",
            subtitle: "No Delivery Charges",
            description: "Enjoy free doorstep delivery on all orders. Fast, safe, and contactless delivery to your home.",
            cta: "Order Now",
            link: "/new-medicine-order",
            backgroundColor: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
            accentColor: "#FF9800",
            icon: <LocalShipping sx={{ fontSize: 28, color: '#FF9800' }} />,
            image: require("../../../assets/offers/offer.png"),
            discount: "FREE",
            type: "offer"
        },
        {
            id: 7,
            title: "World Kidney Day",
            subtitle: "Early Detection Saves Lives",
            description: "March 13th - Get your kidney function tested today. Early detection of kidney disease can prevent serious complications.",
            cta: "Get Tested",
            link: "/health-screening?test=kidney",
            backgroundColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            accentColor: "#3B5998",
            icon: <HealthAndSafety sx={{ fontSize: 28, color: '#3B5998' }} />,
            image: require("../../../assets/healthDays/worldKidneyDay.png"),
            discount: "HEALTH DAY",
            type: "health_days"
        },
        {
            id: 8,
            title: "Glaucoma Awareness Day",
            subtitle: "Protect Your Vision",
            description: "March 12th - Regular eye checkups can prevent vision loss. Book your comprehensive eye examination today.",
            cta: "Book Eye Test",
            link: "/lab-tests?test=eye",
            backgroundColor: "linear-gradient(135deg, #E0F2FE 0%, #B3E5FC 100%)",
            accentColor: "#2E86C1",
            icon: <HealthAndSafety sx={{ fontSize: 28, color: '#2E86C1' }} />,
            image: require("../../../assets/healthDays/glaucoma.png"),
            discount: "EYE CARE",
            type: "health_days"
        },
        {
            id: 9,
            title: "Measles Immunization Day",
            subtitle: "Protect Your Children",
            description: "March 16th - Ensure your children receive complete measles vaccination. Two doses provide 97% protection.",
            cta: "Vaccinate Now",
            link: "/vaccines",
            backgroundColor: "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
            accentColor: "#E74C3C",
            icon: <HealthAndSafety sx={{ fontSize: 28, color: '#E74C3C' }} />,
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
                py: { xs: 1.5, sm: 2 },
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
                                px: { xs: 2, sm: 3, md: 4 },
                                py: { xs: 3, sm: 4 },
                                gap: { xs: 2, sm: 3 },
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: { xs: '140px', sm: '160px', md: '180px' }
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
                            
                            {/* Text Content */}
                            <Box sx={{ 
                                flex: 1, 
                                position: 'relative', 
                                zIndex: 1,
                                pr: { xs: 1, sm: 2 }
                            }}>
                                <Box sx={{ mb: 0.5 }}>{banner.icon}</Box>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.6rem' },
                                        lineHeight: 1.2,
                                        mb: 0.5,
                                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                                    }}
                                >
                                    {banner.subtitle}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                                        mb: 1.5,
                                        lineHeight: 1.4,
                                        fontWeight: 400,
                                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
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
                                        fontWeight: 600,
                                        px: { xs: 1.5, sm: 2 },
                                        py: 0.5,
                                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '8px',
                                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                        '&:hover': { 
                                            backgroundColor: banner.accentColor, 
                                            color: 'white',
                                            borderColor: banner.accentColor,
                                            transform: 'translateY(-1px)',
                                            boxShadow: `0 4px 12px ${banner.accentColor}40`
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    {banner.cta}
                                </Button>
                            </Box>

                            {/* Image - Responsive positioning */}
                            <Box
                                component="img"
                                src={banner.image}
                                alt={banner.title}
                                sx={{
                                    width: { xs: 80, sm: 120, md: 160 },
                                    height: { xs: 80, sm: 120, md: 160 },
                                    borderRadius: 2,
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                    position: 'relative',
                                    zIndex: 1,
                                    objectFit: 'cover',
                                    // Mobile: top right positioning
                                    position: { xs: 'absolute', sm: 'relative' },
                                    top: { xs: 8, sm: 'auto' },
                                    right: { xs: 8, sm: 'auto' },
                                    // Ensure image is visible on mobile
                                    display: 'block'
                                }}
                            />

                            {/* Dots Indicator - Inside Banner */}
                            <Box 
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: 0.5,
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
                                            width: 6,
                                            height: 6,
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

export default HeroBanner;