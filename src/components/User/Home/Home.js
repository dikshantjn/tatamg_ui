import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import MainServices from './MainServices';
import HeroBanner from './HeroBanner';
import SearchByHealthConcern from './SearchByHealthConcern';
import SearchByCategory from './SearchByCategory';
import SearchByBrand from './SearchByBrand';
import ServicesAndOffers from './ServicesAndOffers';
import Testimonials from './Testimonials';
import ComingSoonSection from './ComingSoonSection';

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#F8FAFC',
                overflow: 'hidden'
            }}
        >
            {/* Main Services Section - Full Width */}
            <MainServices />
            
            {/* Hero Banner Section - Full Width */}
            <HeroBanner />
            
            {/* Coming Soon Section - Full Width */}
            <ComingSoonSection />
            
            {/* Search by Health Concern Section - Full Width */}
            <SearchByHealthConcern />
            
            {/* Search by Category Section - Full Width */}
            <SearchByCategory />
            
            {/* Search by Brand Section - Full Width */}
            <SearchByBrand />
            
            {/* Services and Offers Section - Full Width */}
            <ServicesAndOffers />
            
            {/* Testimonials Section - Full Width */}
            <Testimonials />
        </Box>
    );
}

export default Home;
