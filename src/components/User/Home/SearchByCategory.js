import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Stack,
    Button,
    Chip
} from '@mui/material';
import {
    LocalPharmacy,
    HealthAndSafety,
    Spa,
    Favorite,
    MonitorHeart,
    ChildCare,
} from '@mui/icons-material';
import category1 from '../../../assets/category1.jpg';
import category2 from '../../../assets/category2.jpg';
import category3 from '../../../assets/category3.jpg';

function SearchByCategory() {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

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
                py: { xs: 2, md: 2.5 },
                backgroundColor: 'grey.50',
                position: 'relative'
            }}
        >
            {/* Section Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                    px: { xs: 1.5, sm: 2, md: 3 }
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                >
                    Shop by Category
                </Typography>
                <Button
                    variant="text"
                    onClick={(e) => handleNavigation('/search', e)}
                    sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        px: 1
                    }}
                >
                    View All
                </Button>
            </Box>


            {/* Horizontal Strip of Category Tiles (not cards) */}
            <Box sx={{ position: 'relative' }}>
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: { xs: 1.5, md: 2 },
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        px: { xs: 1.5, sm: 2, md: 3 },
                        pb: 0.5
                    }}
                >
                    {categories.map((category) => (
                        <Box
                            key={category.title}
                            onClick={(e) => handleNavigation(category.link, e)}
                            sx={{
                                minWidth: { xs: 220, md: 260 },
                                maxWidth: { xs: 220, md: 260 },
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 16px ${category.color}20`, borderColor: category.color }
                            }}
                        >
                            <Box
                                component="img"
                                src={category.image}
                                alt={category.title}
                                sx={{ width: '100%', height: 120, objectFit: 'cover' }}
                            />
                            <Box sx={{ p: 1.5 }}>
                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                    <Box sx={{ width: 32, height: 32, borderRadius: 1, backgroundColor: `${category.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {React.cloneElement(category.icon, { sx: { fontSize: 18 } })}
                                    </Box>
                                    <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.9rem' }}>
                                        {category.title}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1, lineHeight: 1.4 }}>
                                    {category.description}
                                </Typography>
                                <Chip label="Explore" size="small" sx={{ backgroundColor: `${category.color}15`, color: category.color, fontWeight: 600, fontSize: '0.7rem', height: 24 }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

        </Box>
    );
}

export default SearchByCategory;
