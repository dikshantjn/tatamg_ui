import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    useTheme,
    useMediaQuery,
    Container,
    Stack,
    Button,
    Chip,
    Grid
} from '@mui/material';
import {
    ArrowForwardIos,
    ArrowBackIos,
    LocalHospital,
    LocalShipping,
    LocalPharmacy,
    AccountBalanceWallet,
    HealthAndSafety,
    Discount,
    AccessTime
} from '@mui/icons-material';

function ServicesAndOffers() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            handleScroll();
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth / 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        navigate(path);
    };

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

    return (
        <Box
            sx={{
                py: { xs: 4, md: 6 },
                backgroundColor: 'grey.50',
                position: 'relative'
            }}
        >
            <Container maxWidth="xl">
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
                        Services & Offers
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
                        Discover our healthcare services and exclusive offers designed for your wellness
                    </Typography>
                </Box>

                {/* Mobile Grid View */}
                {isMobile && (
                    <Grid container spacing={3} sx={{ px: 2 }}>
                        {servicesAndOffers.map((item) => (
                            <Grid item xs={12} sm={6} key={item.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                        position: 'relative',
                                        overflow: 'visible',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 32px ${item.color}20`,
                                            borderColor: item.color
                                        }
                                    }}
                                    onClick={(e) => handleNavigation(item.link, e)}
                                >
                                    <CardContent sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                        {/* Badge */}
                                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                            <Chip
                                                label={item.badge}
                                                size="small"
                                                color={item.badgeColor}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>

                                        {/* Icon */}
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 2,
                                                backgroundColor: `${item.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2
                                            }}
                                        >
                                            {item.icon}
                                        </Box>

                                        {/* Content */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 3,
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {item.description}
                                        </Typography>

                                        {/* Time Left for Offers */}
                                        {item.timeLeft && (
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                                spacing={0.5}
                                                sx={{ mb: 2 }}
                                            >
                                                <AccessTime sx={{ fontSize: 14, color: 'warning.main' }} />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'warning.main',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {item.timeLeft}
                                                </Typography>
                                            </Stack>
                                        )}

                                        {/* CTA Button */}
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                backgroundColor: item.color,
                                                color: 'white',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    backgroundColor: item.color,
                                                    opacity: 0.9
                                                }
                                            }}
                                        >
                                            {item.cta}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Desktop Horizontal Scroll View */}
                {!isMobile && (
                    <Box sx={{ position: 'relative', px: { xs: 2, md: 0 } }}>
                        {/* Left Scroll Button */}
                        {showLeftButton && (
                            <IconButton
                                onClick={() => scroll('left')}
                                sx={{
                                    position: 'absolute',
                                    left: -8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    backgroundColor: 'white',
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: 'grey.50'
                                    }
                                }}
                            >
                                <ArrowBackIos />
                            </IconButton>
                        )}

                        {/* Cards Container */}
                        <Box
                            ref={scrollRef}
                            sx={{
                                display: 'flex',
                                gap: 3,
                                overflowX: 'auto',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                                pb: 2,
                                scrollSnapType: 'x mandatory'
                            }}
                        >
                            {servicesAndOffers.map((item) => (
                                <Card
                                    key={item.id}
                                    sx={{
                                        minWidth: { xs: 280, md: 320 },
                                        maxWidth: { xs: 280, md: 320 },
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                        position: 'relative',
                                        overflow: 'visible',
                                        scrollSnapAlign: 'start',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 8px 32px ${item.color}20`,
                                            borderColor: item.color
                                        }
                                    }}
                                    onClick={(e) => handleNavigation(item.link, e)}
                                >
                                    <CardContent sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                        {/* Badge */}
                                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                            <Chip
                                                label={item.badge}
                                                size="small"
                                                color={item.badgeColor}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>

                                        {/* Icon */}
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 2,
                                                backgroundColor: `${item.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2
                                            }}
                                        >
                                            {item.icon}
                                        </Box>

                                        {/* Content */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 3,
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {item.description}
                                        </Typography>

                                        {/* Time Left for Offers */}
                                        {item.timeLeft && (
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                                spacing={0.5}
                                                sx={{ mb: 2 }}
                                            >
                                                <AccessTime sx={{ fontSize: 14, color: 'warning.main' }} />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'warning.main',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {item.timeLeft}
                                                </Typography>
                                            </Stack>
                                        )}

                                        {/* CTA Button */}
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                backgroundColor: item.color,
                                                color: 'white',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    backgroundColor: item.color,
                                                    opacity: 0.9
                                                }
                                            }}
                                        >
                                            {item.cta}
                                        </Button>
                                    </CardContent>

                                    {/* Background Decoration */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0.02,
                                            background: `radial-gradient(circle at 80% 20%, ${item.color} 0%, transparent 50%)`,
                                            borderRadius: 3,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </Card>
                            ))}
                        </Box>

                        {/* Right Scroll Button */}
                        {showRightButton && (
                            <IconButton
                                onClick={() => scroll('right')}
                                sx={{
                                    position: 'absolute',
                                    right: -8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    backgroundColor: 'white',
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: 'grey.50'
                                    }
                                }}
                            >
                                <ArrowForwardIos />
                            </IconButton>
                        )}
                    </Box>
                )}

                {/* View All Button */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mt: 5
                    }}
                >
                    <Button
                        variant="outlined"
                        size="large"
                        endIcon={<ArrowForwardIos />}
                        onClick={(e) => handleNavigation('/offers', e)}
                        sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: 'primary.50',
                                borderColor: 'primary.main'
                            }
                        }}
                    >
                        View All Services & Offers
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default ServicesAndOffers; 