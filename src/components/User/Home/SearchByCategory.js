import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    useTheme,
    useMediaQuery,
    Container,
    Stack,
    Button,
    Chip
} from '@mui/material';
import {
    ArrowForward,
    ArrowBack,
    LocalPharmacy,
    HealthAndSafety,
    Spa,
    Favorite,
    MonitorHeart,
    ChildCare
} from '@mui/icons-material';
import category1 from '../../../assets/category1.jpg';
import category2 from '../../../assets/category2.jpg';
import category3 from '../../../assets/category3.jpg';

function SearchByCategory() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const categories = [
        {
            title: 'Medicines',
            image: category1,
            link: '/search?category=medicines',
            description: 'Prescription & OTC Medicines',
            icon: <LocalPharmacy sx={{ fontSize: 24, color: '#3B82F6' }} />,
            color: '#3B82F6'
        },
        {
            title: 'Healthcare Devices',
            image: category2,
            link: '/search?category=healthcare-devices',
            description: 'BP Monitors, Glucometers & more',
            icon: <HealthAndSafety sx={{ fontSize: 24, color: '#10B981' }} />,
            color: '#10B981'
        },
        {
            title: 'Personal Care',
            image: category3,
            link: '/search?category=personal-care',
            description: 'Skincare, Dental Care & more',
            icon: <Spa sx={{ fontSize: 24, color: '#8B5CF6' }} />,
            color: '#8B5CF6'
        },
        {
            title: 'Nutrition & Supplements',
            image: category1,
            link: '/search?category=nutrition-supplements',
            description: 'Vitamins, Proteins & more',
            icon: <Favorite sx={{ fontSize: 24, color: '#EC4899' }} />,
            color: '#EC4899'
        },
        {
            title: 'Baby Care',
            image: category2,
            link: '/search?category=baby-care',
            description: 'Baby Food, Diapers & more',
            icon: <ChildCare sx={{ fontSize: 24, color: '#F59E0B' }} />,
            color: '#F59E0B'
        },
        {
            title: 'Wellness',
            image: category3,
            link: '/search?category=wellness',
            description: 'Health Supplements & more',
            icon: <MonitorHeart sx={{ fontSize: 24, color: '#06B6D4' }} />,
            color: '#06B6D4'
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
                backgroundColor: 'grey.50',
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
                        Shop by Category
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
                        View All Categories
                    </Button>
                </Box>

                {/* Categories Container */}
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

                    {/* Categories Grid */}
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
                    {categories.map((category) => (
                            <Card
                            key={category.title}
                                sx={{
                                    minWidth: { xs: 280, md: 320 },
                                    maxWidth: { xs: 280, md: 320 },
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 8px 32px ${category.color}20`,
                                        borderColor: category.color
                                    }
                                }}
                            onClick={(e) => handleNavigation(category.link, e)}
                        >
                                {/* Image */}
                                <CardMedia
                                    component="img"
                                    height={160}
                                    image={category.image}
                                    alt={category.title} 
                                    sx={{
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />

                                {/* Content */}
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 1,
                                                backgroundColor: `${category.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {category.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {category.title}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 2,
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {category.description}
                                    </Typography>

                                    {/* Category Badge */}
                                    <Chip
                                        label="Explore"
                                        size="small"
                                        sx={{
                                            backgroundColor: `${category.color}15`,
                                            color: category.color,
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: `${category.color}25`
                                            }
                                        }}
                                    />
                                </CardContent>
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

export default SearchByCategory;
