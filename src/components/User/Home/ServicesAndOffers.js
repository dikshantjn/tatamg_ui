import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Stack,
    Button,
    Chip
} from '@mui/material';
import {
    LocalHospital,
    LocalShipping,
    LocalPharmacy,
    AccountBalanceWallet,
    HealthAndSafety,
    Discount,
    AccessTime
} from '@mui/icons-material';

function ServicesAndOffers() {
    const trackRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    // const isLgUp = useMediaQuery(theme.breakpoints.up('md'));

    const servicesAndOffers = [
        {
            id: 1,
            type: 'service',
            title: 'Free Doctor Consultation',
            description: 'Get free consultation with top healthcare professionals',
            icon: <LocalHospital sx={{ fontSize: 32, color: '#3B82F6' }} />,
            color: '#3B82F6',
            link: '/doctor-consultation',
            cta: 'Book Now',
            badge: 'Free',
            badgeColor: 'success'
        },
        {
            id: 2,
            type: 'service',
            title: 'Home Sample Collection',
            description: 'Convenient blood sample collection at your doorstep',
            icon: <LocalShipping sx={{ fontSize: 32, color: '#10B981' }} />,
            color: '#10B981',
            link: '/lab-tests',
            cta: 'Schedule',
            badge: 'Free',
            badgeColor: 'success'
        },
        {
            id: 3,
            type: 'offer',
            title: 'Upto 30% Off on Medicines',
            description: 'Save big on prescription and OTC medicines',
            icon: <LocalPharmacy sx={{ fontSize: 32, color: '#8B5CF6' }} />,
            color: '#8B5CF6',
            link: '/search?category=medicines',
            cta: 'Shop Now',
            badge: '30% OFF',
            badgeColor: 'error',
            timeLeft: '2 days left'
        },
        {
            id: 4,
            type: 'offer',
            title: 'Cashback on First Order',
            description: 'Get 10% cashback on your first medicine order',
            icon: <AccountBalanceWallet sx={{ fontSize: 32, color: '#EC4899' }} />,
            color: '#EC4899',
            link: '/medicine-order',
            cta: 'Grab Offer',
            badge: '10% Cashback',
            badgeColor: 'warning',
            timeLeft: 'Limited time'
        },
        {
            id: 5,
            type: 'service',
            title: 'Health Supplements',
            description: 'Newly arrived premium health supplements',
            icon: <HealthAndSafety sx={{ fontSize: 32, color: '#F59E0B' }} />,
            color: '#F59E0B',
            link: '/search?category=nutrition-supplements',
            cta: 'Explore',
            badge: 'New',
            badgeColor: 'info'
        },
        {
            id: 6,
            type: 'offer',
            title: 'Lab Test Package',
            description: 'Complete health checkup at discounted rates',
            icon: <Discount sx={{ fontSize: 32, color: '#06B6D4' }} />,
            color: '#06B6D4',
            link: '/lab-tests',
            cta: 'Book Package',
            badge: '25% OFF',
            badgeColor: 'error',
            timeLeft: '1 week left'
        }
    ];

    const itemsPerView = isXs ? 1 : isMd ? 2 : 3;
    const maxIndex = Math.max(0, servicesAndOffers.length - itemsPerView);

    useEffect(() => {
        if (currentIndex > maxIndex) {
            setCurrentIndex(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsPerView]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
            }
        }, 4000);
        return () => clearInterval(timer);
    }, [isPaused, maxIndex]);


    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        navigate(path);
    };

    

    return (
        <Box
            sx={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                py: { xs: 2.5, md: 3 },
                backgroundColor: 'grey.50',
                position: 'relative'
            }}
        >
            {/* Section Header */}
            <Box sx={{ mb: 1.5, px: { xs: 1.5, sm: 2, md: 3 } }}>
                <Typography
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                >
                    Services & Offers
                </Typography>
            </Box>

            {/* Carousel (no cards) */}
            <Box
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                sx={{ position: 'relative' }}
            >

                {/* Track */}
                <Box sx={{ overflow: 'hidden', px: { xs: 0.5, sm: 1 }, py: 1 }}>
                    <Box
                        ref={trackRef}
                        sx={{
                            display: 'flex',
                            width: `${(100 / itemsPerView) * servicesAndOffers.length}%`,
                            transform: `translateX(-${currentIndex * (100 / servicesAndOffers.length)}%)`,
                            transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {servicesAndOffers.map((item, idx) => (
                            <Box
                                key={item.id}
                                onClick={(e) => handleNavigation(item.link, e)}
                                sx={{
                                    flex: `0 0 ${100 / servicesAndOffers.length}%`,
                                    boxSizing: 'border-box',
                                    px: { xs: 0.5, sm: 1 }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        height: { xs: 120, sm: 130, md: 140 },
                                        px: { xs: 1.5, sm: 2, md: 2 },
                                        py: { xs: 1.5, sm: 2 },
                                        background: `${item.color}10`,
                                        border: `1px solid ${item.color}25`,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        '&:hover': { 
                                            transform: 'translateY(-2px)', 
                                            boxShadow: `0 6px 16px ${item.color}20`,
                                            borderTopColor: 'transparent'
                                        }
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                                        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                                        </Box>
                                        <Chip label={item.badge} color={item.badgeColor} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                                        {item.timeLeft && (
                                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 'auto' }}>
                                                <AccessTime sx={{ fontSize: 12, color: 'warning.main' }} />
                                                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700, fontSize: '0.65rem' }}>
                                                    {item.timeLeft}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                    <Typography sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.2 }}>
                                        {item.title}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ 
                                            borderColor: item.color, 
                                            color: item.color, 
                                            fontWeight: 700, 
                                            textTransform: 'none', 
                                            fontSize: '0.75rem',
                                            py: 0.5,
                                            px: 1.5,
                                            '&:hover': { backgroundColor: `${item.color}20`, borderColor: item.color },
                                            mt: 'auto'
                                        }}
                                    >
                                        {item.cta}
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Dots */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <Box key={i} onClick={() => setCurrentIndex(i)} sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === currentIndex ? 'text.primary' : 'grey.400', cursor: 'pointer' }} />
                    ))}
                </Box>
            </Box>

        </Box>
    );
}

export default ServicesAndOffers; 