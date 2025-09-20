import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip
} from '@mui/material';
import {
    ChildCare,
    Spa,
    AccountBalance,
    FitnessCenter,
    Home as HomeIcon,
    FlightTakeoff,
    Healing,
    ManageSearch,
    LocalDining,
    Pets,
    VolunteerActivism,
    Vaccines as VaccinesIcon,
    PregnantWoman,
    HealthAndSafety
} from '@mui/icons-material';

function ComingSoonSection() {
    const scrollRef = useRef(null);



    const handleNavigation = (path, comingSoon) => {
        if (comingSoon) {
            return; // Do nothing for coming soon items
        }
        // Navigation will be handled by Link component
    };

    const comingSoonFeatures = [
        { path: '#', text: 'CHILD CARE', comingSoon: true, icon: <ChildCare />, color: '#EC4899' },
        { path: '#', text: 'AYURVEDA', comingSoon: true, icon: <Spa />, color: '#8B5CF6' },
        { path: '#', text: 'MEDICAL LOANS', comingSoon: true, icon: <AccountBalance />, color: '#10B981' },
        { path: '#', text: 'PHYSIOTHERAPY', comingSoon: true, icon: <FitnessCenter />, color: '#F59E0B' },
        { path: '#', text: 'CARE AT HOME', comingSoon: true, icon: <HomeIcon />, color: '#3B82F6' },
        { path: '#', text: 'MEDICAL TOURISM', comingSoon: true, icon: <FlightTakeoff />, color: '#8B5A2B' },
        { path: '#', text: 'REHABILITATION', comingSoon: true, icon: <Healing />, color: '#EF4444' },
        { path: '#', text: 'EARLY DETECTION', comingSoon: true, icon: <ManageSearch />, color: '#9333EA' },
        { path: '#', text: 'NUTRITION', comingSoon: true, icon: <LocalDining />, color: '#F97316' },
        { path: '#', text: 'PET CARE', comingSoon: true, icon: <Pets />, color: '#F472B6' },
        { path: '#', text: 'ORGAN DONATION', comingSoon: true, icon: <VolunteerActivism />, color: '#06B6D4' },
        { path: '#', text: 'VACCINES', comingSoon: true, icon: <VaccinesIcon />, color: '#10B981' },
        { path: '#', text: 'MATERNAL CARE', comingSoon: true, icon: <PregnantWoman />, color: '#EC4899' },
        { path: '#', text: 'MEDICAL INSURANCE', comingSoon: true, icon: <HealthAndSafety />, color: '#3B82F6' },
    ];

    return (
        <Box
            sx={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                py: { xs: 2, sm: 2.5 },
                backgroundColor: 'white',
                position: 'relative'
            }}
        >
            {/* Section Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
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
                    Launching Soon
                </Typography>
                <Chip
                    label="Coming Soon"
                    size="small"
                    sx={{
                        backgroundColor: '#FF6B35',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20,
                        '& .MuiChip-label': {
                            px: 1
                        }
                    }}
                />
            </Box>


            {/* Features Row */}
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
                    {comingSoonFeatures.map((feature) => (
                        <Box
                            key={feature.text}
                            component={feature.comingSoon ? 'div' : Link}
                            to={feature.comingSoon ? undefined : feature.path}
                            onClick={() => handleNavigation(feature.path, feature.comingSoon)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 1.5,
                                minWidth: { xs: 180, sm: 200, md: 220 },
                                height: { xs: 60, sm: 70, md: 80 },
                                px: 2,
                                py: 1.5,
                                borderRadius: 3,
                                border: `2px solid ${feature.color}40`,
                                backgroundColor: `${feature.color}12`,
                                cursor: feature.comingSoon ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: 4,
                                    height: '100%',
                                    background: `linear-gradient(180deg, ${feature.color} 0%, ${feature.color}CC 100%)`,
                                    borderRadius: '3px 0 0 3px'
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 0,
                                    height: 0,
                                    borderLeft: `20px solid ${feature.color}20`,
                                    borderTop: '20px solid transparent',
                                    borderBottom: '20px solid transparent'
                                },
                                '&:hover': { 
                                    backgroundColor: feature.comingSoon ? `${feature.color}12` : `${feature.color}18`, 
                                    borderColor: feature.comingSoon ? `${feature.color}40` : `${feature.color}60`,
                                    transform: feature.comingSoon ? 'none' : 'translateX(2px)',
                                    boxShadow: feature.comingSoon ? 'none' : `0 6px 16px ${feature.color}30`
                                }
                            }}
                        >

                            {/* Icon Container */}
                            <Box sx={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: 2, 
                                backgroundColor: 'white', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: `0 2px 6px ${feature.color}25`,
                                border: `1px solid ${feature.color}40`,
                                position: 'relative',
                                zIndex: 1,
                                flexShrink: 0
                            }}>
                                {React.cloneElement(feature.icon, { 
                                    sx: { fontSize: 16, color: feature.color } 
                                })}
                            </Box>

                            {/* Feature Name */}
                            <Typography sx={{ 
                                fontWeight: 700, 
                                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }, 
                                color: 'text.primary', 
                                textAlign: 'left',
                                opacity: feature.comingSoon ? 0.8 : 1,
                                position: 'relative',
                                zIndex: 1,
                                lineHeight: 1.2,
                                flex: 1
                            }}>
                                {feature.text}
                            </Typography>

                        </Box>
                    ))}
                </Box>
            </Box>

        </Box>
    );
}

export default ComingSoonSection;
