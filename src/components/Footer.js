import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Stack,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery,
    Link,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Apple,
    Shop,
    ExpandMore
} from '@mui/icons-material';
import Logo from './ui/Logo';

function Footer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'Services',
            links: [
                { text: 'Doctor Consultation', href: '/doctor-consultation' },
                { text: 'Lab Tests', href: '/lab-tests' },
                { text: 'Medicine Delivery', href: '/medicine-order' },
                { text: 'Healthcare Products', href: '/products' }
            ]
        },
        {
            title: 'Support',
            links: [
                { text: 'Help Center', href: '/help' },
                { text: 'Contact Us', href: '/contact' },
                { text: 'FAQs', href: '/faqs' },
                { text: 'Terms of Service', href: '/terms' }
            ]
        },
        {
            title: 'Company',
            links: [
                { text: 'About Us', href: '/about' },
                { text: 'Careers', href: '/careers' },
                { text: 'Blog', href: '/blog' },
                { text: 'Press', href: '/press' }
            ]
        },
        {
            title: 'For Providers',
            links: [
                { text: 'Join as Doctor', href: '/join-doctor' },
                { text: 'List Your Hospital', href: '/list-hospital' },
                { text: 'Partner With Us', href: '/partner' },
                { text: 'Advertise', href: '/advertise' }
            ]
        }
    ];

    const socialLinks = [
        { icon: <Facebook />, href: '/', label: 'Facebook' },
        { icon: <Twitter />, href: '/', label: 'Twitter' },
        { icon: <Instagram />, href: '/', label: 'Instagram' },
        { icon: <LinkedIn />, href: '/', label: 'LinkedIn' }
    ];

    return (
        <Box
            component="footer"
            className="footer"
            sx={{
                backgroundColor: '#0a0a0a',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 'auto',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    zIndex: 1
                }
            }}
        >
            {/* Main Footer Content */}
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 4 }, position: 'relative', zIndex: 2 }}>
                {isMobile ? (
                    <Stack spacing={3}>
                        {/* Mobile: Expandable Sections */}
                        <Box>
                            {footerSections.map((section, index) => (
                                <Accordion key={index} disableGutters sx={{ bgcolor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.08)', mb: 1, borderRadius: 1, '&:before': { display: 'none' } }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                                        sx={{
                                            '& .MuiAccordionSummary-content': { my: 0.5 },
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>{section.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
                                        <Stack spacing={1.25}>
                                            {section.links.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.href}
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        textDecoration: 'none',
                                                        fontSize: '0.95rem',
                                                        '&:hover': { color: 'white' }
                                                    }}
                                                >
                                                    {link.text}
                                                </Link>
                                            ))}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>

                        {/* Mobile: Download Our App */}
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'white',
                                    mb: 2,
                                    fontSize: '1.1rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Download Our App
                            </Typography>
                            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                                <Button
                                    href="/"
                                    startIcon={<Apple />}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        px: 2.25,
                                        py: 1.25,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        minWidth: 150,
                                        justifyContent: 'flex-start',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                        }
                                    }}
                                >
                                    <Box>
                                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.75rem' }}>
                                            Download on the
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                            App Store
                                        </Typography>
                                    </Box>
                                </Button>
                                <Button
                                    href="/"
                                    startIcon={<Shop />}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        px: 2.25,
                                        py: 1.25,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        minWidth: 150,
                                        justifyContent: 'flex-start',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                        }
                                    }}
                                >
                                    <Box>
                                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.75rem' }}>
                                            Get it on
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                            Google Play
                                        </Typography>
                                    </Box>
                                </Button>
                            </Stack>
                        </Box>

                        {/* Mobile: Connect With Us */}
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'white',
                                    mb: 2,
                                    fontSize: '1.1rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Connect With Us
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                                {socialLinks.map((social, index) => (
                                    <IconButton
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            p: 1.5,
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                color: 'white',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                            }
                                        }}
                                    >
                                        {social.icon}
                                    </IconButton>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                ) : (
                    <Grid container spacing={{ xs: 3, md: 3 }} alignItems="flex-start">
                        {/* Brand Section */}
                        <Grid item xs={12} lg={3}>
                            <Stack spacing={2}>
                                {/* Brand Description */}
                                <Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Logo size="regular" />
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            lineHeight: 1.6,
                                            maxWidth: 300,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Your trusted healthcare companion providing seamless access to medical consultations, lab tests, and medicine delivery.
                                    </Typography>
                                </Box>

                                {/* App Store Links */}
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'white',
                                            mb: 1.5,
                                            fontSize: '1.05rem',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        Download Our App
                                    </Typography>
                                    <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
                                        <Button
                                            href="/"
                                            startIcon={<Apple />}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                                color: 'white',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                fontSize: '0.85rem',
                                                minWidth: 150,
                                                justifyContent: 'flex-start',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                                }
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.75rem' }}>
                                                    Download on the
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                    App Store
                                                </Typography>
                                            </Box>
                                        </Button>
                                        <Button
                                            href="/"
                                            startIcon={<Shop />} 
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                                color: 'white',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                fontSize: '0.85rem',
                                                minWidth: 150,
                                                justifyContent: 'flex-start',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                                }
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.75rem' }}>
                                                    Get it on
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                    Google Play
                                                </Typography>
                                            </Box>
                                        </Button>
                                    </Stack>
                                </Box>

                                {/* Social Media Links */}
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'white',
                                            mb: 1.5,
                                            fontSize: '1.05rem',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        Connect With Us
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                                        {socialLinks.map((social, index) => (
                                            <IconButton
                                                key={index}
                                                href={social.href}
                                                aria-label={social.label}
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: 2,
                                                    p: 1.25,
                                                    backdropFilter: 'blur(10px)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        color: 'white',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                                    }
                                                }}
                                            >
                                                {social.icon}
                                            </IconButton>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* Footer Links Sections */}
                        <Grid item xs={12} lg={9}>
                            <Grid container spacing={{ xs: 2.5, md: 3 }}>
                                {footerSections.map((section, index) => (
                                    <Grid item xs={6} md={3} key={index}>
                                        <Stack spacing={1.75}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'white',
                                                    fontSize: '1.02rem',
                                                    letterSpacing: '0.4px',
                                                    pb: 0.25,
                                                }}
                                            >
                                                {section.title}
                                            </Typography>
                                            <Stack spacing={1.25}>
                                                {section.links.map((link, linkIndex) => (
                                                    <Link
                                                        key={linkIndex}
                                                        href={link.href}
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.75)',
                                                            textDecoration: 'none',
                                                            fontSize: '0.9rem',
                                                            fontWeight: 400,
                                                            transition: 'all 0.3s ease',
                                                            position: 'relative',
                                                            display: 'inline-block',
                                                            '&:hover': {
                                                                color: 'white',
                                                                transform: 'translateX(4px)',
                                                                '&::before': {
                                                                    width: '20px'
                                                                }
                                                            },
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                left: '-8px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                width: '0px',
                                                                height: '2px',
                                                                backgroundColor: 'white',
                                                                transition: 'width 0.3s ease'
                                                            }
                                                        }}
                                                    >
                                                        {link.text}
                                                    </Link>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Container>

            {/* Divider */}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />

            {/* Bottom Footer */}
            <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 3
                    }}
                >
                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            textAlign: { xs: 'center', sm: 'left' },
                            fontSize: '0.9rem',
                            fontWeight: 400
                        }}
                    >
                        © {currentYear} <Box component="span" sx={{ fontWeight: 600, color: 'white' }}>Vedika.Health</Box>. All rights reserved.
                    </Typography>

                    {/* Bottom Links */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1.5, sm: 3 }}
                        sx={{
                            alignItems: 'center'
                        }}
                    >
                        {[
                            { text: 'Privacy Policy', href: '/privacy' },
                            { text: 'Terms & Conditions', href: '/terms' },
                            { text: 'Sitemap', href: '/sitemap' }
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 400,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'white'
                                    },
                                    '&:not(:last-child)::after': {
                                        content: '""',
                                        position: 'absolute',
                                        right: { xs: 'auto', sm: '-16px' },
                                        bottom: { xs: '-8px', sm: 'auto' },
                                        top: { xs: 'auto', sm: '50%' },
                                        transform: { xs: 'none', sm: 'translateY(-50%)' },
                                        width: { xs: '20px', sm: '1px' },
                                        height: { xs: '1px', sm: '16px' },
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        display: { xs: 'none', sm: 'block' }
                                    }
                                }}
                            >
                                {link.text}
                            </Link>
                        ))}
                    </Stack>
                </Box>
            </Container>

            {/* Subtle background pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.02,
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                        radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    backgroundPosition: '0 0, 25px 25px',
                    pointerEvents: 'none'
                }}
            />
        </Box>
    );
}

export default Footer;