import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar
} from '@mui/material';
import brand1 from '../../../assets/brand_1.png';
import brand2 from '../../../assets/brand_2.png';
import brand3 from '../../../assets/brand_3.png';
import brand4 from '../../../assets/brand_4.png';
import brand5 from '../../../assets/brand_5.png';

function SearchByBrand() {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const brands = [
        {
            title: 'Wellness Plus',
            image: brand1,
            link: '/search?brand=wellness-plus',
            color: '#3B82F6'
        },
        {
            title: 'MediCare',
            image: brand2,
            link: '/search?brand=medicare',
            color: '#10B981'
        },
        {
            title: 'LifeCare',
            image: brand3,
            link: '/search?brand=lifecare',
            color: '#8B5CF6'
        },
        {
            title: 'HealthFirst',
            image: brand4,
            link: '/search?brand=healthfirst',
            color: '#EC4899'
        },
        {
            title: 'VitaCare',
            image: brand5,
            link: '/search?brand=vitacare',
            color: '#F59E0B'
        },
        {
            title: 'MedTech Pro',
            image: brand1,
            link: '/search?brand=medtech-pro',
            color: '#06B6D4'
        },
        {
            title: 'CarePlus',
            image: brand2,
            link: '/search?brand=careplus',
            color: '#84CC16'
        },
        {
            title: 'PharmaCare',
            image: brand3,
            link: '/search?brand=pharmacare',
            color: '#EF4444'
        },
        {
            title: 'MedLife',
            image: brand4,
            link: '/search?brand=medlife',
            color: '#8B5CF6'
        },
        {
            title: 'HealthHub',
            image: brand5,
            link: '/search?brand=healthhub',
            color: '#10B981'
        }
    ];



    // Auto-scroll functionality
    useEffect(() => {
        const autoScroll = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                    // Reset to beginning when reaching the end
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }
            }
        }, 3000); // Auto-scroll every 3 seconds

        return () => clearInterval(autoScroll);
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
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                py: { xs: 2, md: 2.5 },
                backgroundColor: 'background.default',
                position: 'relative'
            }}
        >
            {/* Section Header */}
            <Box
                sx={{
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
                    Featured Brands
                </Typography>
            </Box>


            {/* Logo Strip */}
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
                        py: 1
                    }}
                >
                    {brands.map((brand) => (
                        <Box
                            key={brand.title}
                            onClick={(e) => handleNavigation(brand.link, e)}
                            sx={{
                                minWidth: { xs: 100, md: 120 },
                                maxWidth: { xs: 100, md: 120 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.75,
                                px: 1.5,
                                py: 1.5,
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                '&:hover': { 
                                    transform: 'translateY(-1px)', 
                                    boxShadow: `0 4px 12px ${brand.color}20`, 
                                    borderColor: brand.color
                                }
                            }}
                        >
                            <Avatar 
                                src={brand.image} 
                                alt={brand.title} 
                                sx={{ 
                                    width: { xs: 32, md: 36 }, 
                                    height: { xs: 32, md: 36 },
                                    mb: 0.5
                                }} 
                            />
                            <Typography 
                                sx={{ 
                                    fontWeight: 600, 
                                    fontSize: { xs: '0.7rem', md: '0.8rem' }, 
                                    color: 'text.primary',
                                    textAlign: 'center',
                                    lineHeight: 1.2
                                }}
                            >
                                {brand.title}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

        </Box>
    );
}

export default SearchByBrand;
