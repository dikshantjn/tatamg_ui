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
    Button
} from '@mui/material';
import {
    ArrowForward,
    ArrowBack,
    LocalHospital,
    Spa,
    MonitorHeart,
    PregnantWoman,
    Face
} from '@mui/icons-material';
import pregnancyImg from '../../../assets/pregnant.png';
import acneImg from '../../../assets/acne.png';
import coldImg from '../../../assets/cold.png';
import diabetesImg from '../../../assets/diabetes-test.png';
import liverImg from '../../../assets/liver.png';

function SearchByHealthConcern() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

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
    ];

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
                        Search by Health Concern
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
                        View All
                    </Button>
                </Box>

                {/* Concerns Container */}
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

                    {/* Concerns Grid */}
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
                    {concerns.map((concern, index) => (
                            <Card
                            key={concern.title}
                                sx={{
                                    minWidth: { xs: 280, md: 320 },
                                    maxWidth: { xs: 280, md: 320 },
                                    borderRadius: 3,
                                    border: `1px solid ${concern.color}20`,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'visible',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 8px 32px ${concern.color}20`,
                                        borderColor: concern.color
                                    }
                                }}
                                onClick={(e) => handleNavigation(concern.link, e)}
                            >
                                <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 2,
                                            backgroundColor: `${concern.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2
                                        }}
                                    >
                                        {concern.icon}
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
                                        {concern.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 2,
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {concern.description}
                                    </Typography>

                                    {/* CTA */}
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{
                                            color: concern.color,
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <span>Explore Solutions</span>
                                        <ArrowForward sx={{ fontSize: 16 }} />
                                    </Stack>
                                </CardContent>

                                {/* Background Decoration */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0.03,
                                        background: `radial-gradient(circle at 80% 20%, ${concern.color} 0%, transparent 50%)`,
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

export default SearchByHealthConcern;
