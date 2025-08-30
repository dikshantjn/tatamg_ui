import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Chip,
    IconButton,
    Paper,
    Stack,
    useTheme,
    useMediaQuery,

} from '@mui/material';
import {
    LocalOffer,
    Star,
    TrendingUp,
    ArrowForward,
    ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const OfferStripContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    padding: theme.spacing(2, 0),
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5, 0),
    }
}));

const OfferCard = styled(Paper)(({ theme, active, bgcolor }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 16,
    overflow: 'hidden',
    background: bgcolor || 'linear-gradient(135deg, #38A3A5, #4FB5B7)',
    transform: active ? 'translateX(0)' : 'translateX(100%)',
    opacity: active ? 1 : 0,
    boxShadow: active ? '0 8px 32px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 0,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -15,
        left: -15,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        zIndex: 0,
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5, 2),
        borderRadius: 12,
    }
}));

const OfferContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 2,
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1),
        textAlign: 'center',
    }
}));

const OfferText = styled(Box)(({ theme }) => ({
    flex: 1,
    color: '#000000',
    [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
    }
}));

const OfferCode = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    background: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(1, 2),
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#000000',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.75, 1.5),
        borderRadius: 16,
    }
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    color: '#000000',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-50%) scale(1.1)',
    },
    '&.left': {
        left: theme.spacing(1),
    },
    '&.right': {
        right: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
        display: 'none',
    }
}));

const IndicatorContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

const Indicator = styled(Box)(({ theme, active }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: active ? '#38A3A5' : 'rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: active ? 'scale(1.2)' : 'scale(1)',
    '&:hover': {
        backgroundColor: active ? '#2C7A7B' : 'rgba(56, 163, 165, 0.5)',
    },
}));

const TopOfferStrip = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentOffer, setCurrentOffer] = useState(0);

    const offers = [
        {
            title: "New User Special",
            description: "Get 20% off on your first order",
            code: "NEWUSER20",
            bgGradient: "linear-gradient(135deg, #FFE4E1, #FFB6C1)",
            icon: <LocalOffer />,
            color: "#FF6B6B"
        },
        {
            title: "Free Health Checkup",
            description: "Book any test above ₹999",
            code: "HEALTH999",
            bgGradient: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
            icon: <Star />,
            color: "#0097A7"
        },
        {
            title: "Flash Sale",
            description: "Up to 40% off on health devices",
            code: "FLASH40",
            bgGradient: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
            icon: <TrendingUp />,
            color: "#388E3C"
        },
        {
            title: "Premium Care",
            description: "Exclusive discounts on premium products",
            code: "PREMIUM25",
            bgGradient: "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
            icon: <LocalOffer />,
            color: "#7B1FA2"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentOffer((prev) => (prev + 1) % offers.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [offers.length]);

    const handlePrevious = () => {
        setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length);
    };

    const handleNext = () => {
        setCurrentOffer((prev) => (prev + 1) % offers.length);
    };

    const handleIndicatorClick = (index) => {
        setCurrentOffer(index);
    };

    return (
        <OfferStripContainer>
            <Container maxWidth="xl">
                <Box sx={{ position: 'relative', height: isMobile ? 120 : 100 }}>
                    {/* Navigation Buttons */}
                    <NavigationButton
                        className="left"
                        onClick={handlePrevious}
                        size="small"
                    >
                        <ArrowBack fontSize="small" />
                    </NavigationButton>
                    
                    <NavigationButton
                        className="right"
                        onClick={handleNext}
                        size="small"
                    >
                        <ArrowForward fontSize="small" />
                    </NavigationButton>

                    {/* Offer Cards */}
                {offers.map((offer, index) => (
                        <OfferCard
                        key={index}
                            active={index === currentOffer}
                            bgcolor={offer.bgGradient}
                            elevation={0}
                        >
                            <OfferContent>
                                <OfferText>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                        <Box sx={{ 
                                            color: offer.color,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {offer.icon}
                                        </Box>
                                        <Typography 
                                            variant={isMobile ? "h6" : "h5"} 
                                            sx={{ 
                                                fontWeight: 700,
                                                color: '#000000',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {offer.title}
                                        </Typography>
                                    </Stack>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#000000',
                                            opacity: 0.8,
                                            fontWeight: 500
                                        }}
                                    >
                                        {offer.description}
                                    </Typography>
                                </OfferText>

                                <OfferCode>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#000000',
                                            opacity: 0.7,
                                            fontWeight: 500
                                        }}
                                    >
                                        Use Code:
                                    </Typography>
                                    <Chip
                                        label={offer.code}
                                        size="small"
                                        sx={{
                                            backgroundColor: offer.color,
                                            color: 'white',
                                            fontWeight: 700,
                                            fontFamily: 'Roboto Mono, monospace',
                                            letterSpacing: '0.5px',
                                            '& .MuiChip-label': {
                                                px: 1,
                                            }
                                        }}
                                    />
                                </OfferCode>
                            </OfferContent>
                        </OfferCard>
                    ))}
                </Box>

                {/* Indicators */}
                <IndicatorContainer>
                {offers.map((_, index) => (
                        <Indicator
                        key={index}
                            active={index === currentOffer}
                            onClick={() => handleIndicatorClick(index)}
                    />
                ))}
                </IndicatorContainer>
            </Container>
        </OfferStripContainer>
    );
};

export default TopOfferStrip; 