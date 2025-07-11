import React from 'react';
import {
    Box,
    Typography,
    Grid,
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
    LocalHospital,
    LocalPharmacy,
    HealthAndSafety,
    Favorite,
    MonitorHeart,
    ChildCare,
    Spa
} from '@mui/icons-material';

function Services() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const services = [
        {
            title: 'Doctor Consultation',
            description: 'Connect with experienced healthcare professionals for expert medical advice',
            icon: <LocalHospital sx={{ fontSize: 40, color: '#3B82F6' }} />,
            color: '#3B82F6',
            link: '/doctor-consultation'
        },
        {
            title: 'Lab Tests',
            description: 'Book diagnostic tests and get reports delivered to your doorstep',
            icon: <HealthAndSafety sx={{ fontSize: 40, color: '#10B981' }} />,
            color: '#10B981',
            link: '/lab-tests'
        },
        {
            title: 'Medicine Delivery',
            description: 'Get prescribed medicines delivered to your home within hours',
            icon: <LocalPharmacy sx={{ fontSize: 40, color: '#8B5CF6' }} />,
            color: '#8B5CF6',
            link: '/medicine-order'
        },
        {
            title: 'Ambulance Service',
            description: '24/7 emergency ambulance service for critical care',
            icon: <Favorite sx={{ fontSize: 40, color: '#EC4899' }} />,
            color: '#EC4899',
            link: '/ambulance'
        },
        {
            title: 'Health Monitoring',
            description: 'Track your vital signs and health metrics regularly',
            icon: <MonitorHeart sx={{ fontSize: 40, color: '#F59E0B' }} />,
            color: '#F59E0B',
            link: '/health-records'
        },
        {
            title: 'Specialized Care',
            description: 'Expert care for maternal, child, and specialized health needs',
            icon: <ChildCare sx={{ fontSize: 40, color: '#06B6D4' }} />,
            color: '#06B6D4',
            link: '/maternal-care'
        }
    ];

    return (
        <Box
            sx={{
                py: { xs: 4, md: 6 },
                backgroundColor: 'background.default',
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
                        Our Healthcare Services
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
                        Comprehensive healthcare solutions designed to meet all your medical needs with convenience and care
                    </Typography>
                </Box>

                {/* Services Grid */}
                <Grid container spacing={3}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={4} key={service.title}>
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
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 8px 32px ${service.color}20`,
                                        borderColor: service.color
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2,
                                            backgroundColor: `${service.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3
                                        }}
                                    >
                                        {service.icon}
                                    </Box>

                                    {/* Content */}
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 2,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 3,
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {service.description}
                                    </Typography>

                                    {/* CTA */}
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        spacing={1}
                                        sx={{
                                            color: service.color,
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <span>Learn More</span>
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
                                        opacity: 0.02,
                                        background: `radial-gradient(circle at 80% 20%, ${service.color} 0%, transparent 50%)`,
                                        borderRadius: 3,
                                        pointerEvents: 'none'
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* View All Services Button */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mt: 5
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            }
                        }}
                    >
                        View All Services
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default Services; 