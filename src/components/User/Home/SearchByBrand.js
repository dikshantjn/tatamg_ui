import React, { useEffect, useRef, useState } from 'react';
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
    Avatar,
    Chip
} from '@mui/material';
import {
    ArrowForward,
    ArrowBack,
    Verified,
    Star
} from '@mui/icons-material';
import brand1 from '../../../assets/brand_1.png';
import brand2 from '../../../assets/brand_2.png';
import brand3 from '../../../assets/brand_3.png';
import brand4 from '../../../assets/brand_4.png';
import brand5 from '../../../assets/brand_5.png';

function SearchByBrand() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const brands = [
        {
            title: 'Wellness Plus',
            image: brand1,
            link: '/search?brand=wellness-plus',
            rating: 4.8,
            verified: true,
            color: '#3B82F6'
        },
        {
            title: 'MediCare',
            image: brand2,
            link: '/search?brand=medicare',
            rating: 4.9,
            verified: true,
            color: '#10B981'
        },
        {
            title: 'LifeCare',
            image: brand3,
            link: '/search?brand=lifecare',
            rating: 4.7,
            verified: true,
            color: '#8B5CF6'
        },
        {
            title: 'HealthFirst',
            image: brand4,
            link: '/search?brand=healthfirst',
            rating: 4.8,
            verified: true,
            color: '#EC4899'
        },
        {
            title: 'VitaCare',
            image: brand5,
            link: '/search?brand=vitacare',
            rating: 4.6,
            verified: true,
            color: '#F59E0B'
        },
        {
            title: 'MedTech Pro',
            image: brand1,
            link: '/search?brand=medtech-pro',
            rating: 4.9,
            verified: true,
            color: '#06B6D4'
        },
        {
            title: 'CarePlus',
            image: brand2,
            link: '/search?brand=careplus',
            rating: 4.7,
            verified: true,
            color: '#84CC16'
        },
        {
            title: 'PharmaCare',
            image: brand3,
            link: '/search?brand=pharmacare',
            rating: 4.8,
            verified: true,
            color: '#EF4444'
        },
        {
            title: 'MedLife',
            image: brand4,
            link: '/search?brand=medlife',
            rating: 4.9,
            verified: true,
            color: '#8B5CF6'
        },
        {
            title: 'HealthHub',
            image: brand5,
            link: '/search?brand=healthhub',
            rating: 4.6,
            verified: true,
            color: '#10B981'
        }
    ];

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -240 : 240;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        navigate(path);
    };

    return (
        <Box
            sx={{
                py: { xs: 3, md: 4 },
                backgroundColor: 'background.default',
                position: 'relative'
            }}
        >
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        px: { xs: 2, md: 0 }
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            color: 'primary.main',
                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        Featured Brands
                    </Typography>
                    <Button
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        onClick={(e) => handleNavigation('/search', e)}
                        sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.50',
                                borderColor: 'primary.main'
                            }
                        }}
                    >
                        View All Brands
                    </Button>
                </Box>

                {/* Brands Container */}
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
                            <ArrowBack />
                        </IconButton>
                    )}

                    {/* Brands Grid */}
                    <Box
                        ref={scrollRef}
                        sx={{
                            display: 'flex',
                            gap: 3,
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': { display: 'none' },
                            pb: 2
                        }}
                    >
                    {brands.map((brand) => (
                            <Card
                            key={brand.title}
                                sx={{
                                    minWidth: { xs: 200, md: 240 },
                                    maxWidth: { xs: 200, md: 240 },
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    position: 'relative',
                                    overflow: 'visible',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 8px 32px ${brand.color}20`,
                                        borderColor: brand.color
                                    }
                                }}
                            onClick={(e) => handleNavigation(brand.link, e)}
                        >
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    {/* Brand Logo */}
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mx: 'auto',
                                            mb: 2,
                                            position: 'relative',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        <Avatar
                                    src={brand.image} 
                                    alt={brand.title} 
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: 2
                                            }}
                                        />
                                        {brand.verified && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -4,
                                                    right: -4,
                                                    backgroundColor: 'success.main',
                                                    borderRadius: '50%',
                                                    width: 24,
                                                    height: 24,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Verified sx={{ fontSize: 16, color: 'white' }} />
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Brand Name */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            mb: 1
                                        }}
                                    >
                                        {brand.title}
                                    </Typography>

                                    {/* Rating */}
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        spacing={0.5}
                                        sx={{ mb: 2 }}
                                    >
                                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }}
                                        >
                                            {brand.rating}
                                        </Typography>
                                    </Stack>

                                    {/* View Products Button */}
                                    <Chip
                                        label="View Products"
                                        size="small"
                                        sx={{
                                            backgroundColor: `${brand.color}15`,
                                            color: brand.color,
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: `${brand.color}25`
                                            }
                                        }}
                                    />
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
                                        background: `radial-gradient(circle at 80% 20%, ${brand.color} 0%, transparent 50%)`,
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
                            <ArrowForward />
                        </IconButton>
                    )}
                </Box>
            </Container>
        </Box>
    );
}

export default SearchByBrand;
