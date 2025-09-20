import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button
} from '@mui/material';
import {
    LocalHospital,
    Spa,
    MonitorHeart,
    PregnantWoman,
    Face,
    Favorite,
    Psychology,
    FitnessCenter,
    LocalDining,
    Air,
    HealthAndSafety,
    Bed,
    Accessibility
} from '@mui/icons-material';

import pregnancyImg from '../../../assets/pregnant.png';
import acneImg from '../../../assets/acne.png';
import coldImg from '../../../assets/cold.png';
import diabetesImg from '../../../assets/diabetes-test.png';
import liverImg from '../../../assets/liver.png';

function SearchByHealthConcern() {
    const scrollRef = useRef(null);
    const navigate = useNavigate();



    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        navigate(path);
    };

    const concerns = [
    {
        title: 'Pregnancy Care',
        description: 'Expert guidance and care throughout your pregnancy journey',
        image: pregnancyImg,
        link: '/search?concern=pregnancy',
        color: '#EC4899',
        icon: <PregnantWoman sx={{ fontSize: 32, color: '#EC4899' }} />
    },
    {
        title: 'Skin Care',
        description: 'Professional treatment for acne and skin conditions',
        image: acneImg,
        link: '/search?concern=skin',
        color: '#8B5CF6',
        icon: <Face sx={{ fontSize: 32, color: '#8B5CF6' }} />
    },
    {
        title: 'Cold & Flu',
        description: 'Relief from cold, cough, and flu symptoms',
        image: coldImg,
        link: '/search?concern=cold',
        color: '#3B82F6',
        icon: <LocalHospital sx={{ fontSize: 32, color: '#3B82F6' }} />
    },
    {
        title: 'Diabetes Care',
        description: 'Comprehensive diabetes management and support',
        image: diabetesImg,
        link: '/search?concern=diabetes',
        color: '#10B981',
        icon: <MonitorHeart sx={{ fontSize: 32, color: '#10B981' }} />
    },
    {
        title: 'Liver Health',
        description: 'Specialized care for liver conditions and wellness',
        image: liverImg,
        link: '/search?concern=liver',
        color: '#F59E0B',
        icon: <Spa sx={{ fontSize: 32, color: '#F59E0B' }} />
    },
    {
        title: 'Heart Health',
        description: 'Prevention and management of cardiovascular diseases',
        image: acneImg,
        link: '/search?concern=heart',
        color: '#EF4444',
        icon: <Favorite sx={{ fontSize: 32, color: '#EF4444' }} />
    },
    {
        title: 'Mental Health',
        description: 'Support for anxiety, depression, and stress management',
        image: acneImg,
        link: '/search?concern=mental-health',
        color: '#F472B6',
        icon: <Psychology sx={{ fontSize: 32, color: '#F472B6' }} />
    },
    {
        title: 'Weight Management',
        description: 'Guidance on healthy weight loss and maintenance',
        image: acneImg,
        link: '/search?concern=weight',
        color: '#F97316',
        icon: <FitnessCenter sx={{ fontSize: 32, color: '#F97316' }} />
    },
    {
        title: 'Digestive Health',
        description: 'Treatment for IBS, bloating, and other digestive issues',
        image: acneImg,
        link: '/search?concern=digestive',
        color: '#3B82F6',
        icon: <LocalDining sx={{ fontSize: 32, color: '#3B82F6' }} />
    },
    {
        title: 'Allergy Relief',
        description: 'Solutions for seasonal and food allergies',
        image: acneImg,
        link: '/search?concern=allergy',
        color: '#9333EA',
        icon: <Air sx={{ fontSize: 32, color: '#9333EA' }} />
    },
    {
        title: 'Chronic Pain',
        description: 'Management strategies for long-term pain conditions',
        image: acneImg,
        link: '/search?concern=pain',
        color: '#F59E0B',
        icon: <HealthAndSafety sx={{ fontSize: 32, color: '#F59E0B' }} />
    },
    {
        title: 'Sleep Disorders',
        description: 'Treatment for insomnia, sleep apnea, and other issues',
        image: acneImg,
        link: '/search?concern=sleep',
        color: '#10B981',
        icon: <Bed sx={{ fontSize: 32, color: '#10B981' }} />
    },
    {
        title: 'Bone & Joint Health',
        description: 'Care for arthritis, osteoporosis, and mobility issues',
        image: acneImg,
        link: '/search?concern=bone-joint',
        color: '#EF4444',
        icon: <Accessibility sx={{ fontSize: 32, color: '#EF4444' }} />
    }
];


    return (
        <Box
            sx={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                py: { xs: 2, sm: 2.5 },
                backgroundColor: 'background.default',
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
                    Search by Health Concern
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


            {/* Boxes Row */}
            <Box sx={{ position: 'relative' }}>
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: { xs: 1, sm: 1.5 },
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        px: { xs: 1.5, sm: 2, md: 3 },
                        pb: 0.5
                    }}
                >
                    {concerns.map((concern) => (
                        <Box
                            key={concern.title}
                            onClick={(e) => handleNavigation(concern.link, e)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.75,
                                minWidth: { xs: 80, md: 96 },
                                height: { xs: 90, md: 100 },
                                px: 1,
                                py: 1,
                                borderRadius: 1.5,
                                border: `1px solid ${concern.color}30`,
                                backgroundColor: `${concern.color}10`,
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': { backgroundColor: `${concern.color}15`, boxShadow: '0 4px 8px rgba(0,0,0,0.06)' }
                            }}
                        >
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {React.cloneElement(concern.icon, { sx: { fontSize: 20 } })}
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.8rem' }, color: 'text.primary', textAlign: 'center', lineHeight: 1.2 }}>
                                {concern.title}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

        </Box>
    );
}

export default SearchByHealthConcern;
