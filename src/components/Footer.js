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
    Link
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn
} from '@mui/icons-material';
import iosIcon from '../assets/appstore.png';
import playstoreIcon from '../assets/playstore.png';
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
            sx={{
                backgroundColor: 'grey.900',
                borderTop: '1px solid',
                borderColor: 'grey.800',
                mt: 'auto',
                color: 'white'
            }}
        >
            {/* Main Footer Content */}
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
                <Grid container spacing={4}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Brand Description */}
                            <Box>
                                <Box sx={{ mb: 2 }}>
                                    <Logo size="regular" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'grey.300',
                                        lineHeight: 1.6,
                                        mb: 3
                                    }}
                                >
                                    Empowering your health journey with trusted solutions, expert care, and innovative technology.
                                </Typography>
                            </Box>

                            {/* App Store Links */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'white',
                                        mb: 2
                                    }}
                                >
                                    Download Our App
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Link
                                        href="/"
                                        sx={{
                                            display: 'inline-block',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={iosIcon}
                                            alt="Download on App Store"
                                            sx={{
                                                height: 40,
                                                width: 'auto',
                                                filter: 'brightness(0) invert(1)'
                                            }}
                                        />
                                    </Link>
                                    <Link
                                        href="/"
                                        sx={{
                                            display: 'inline-block',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={playstoreIcon}
                                            alt="Get it on Google Play"
                                            sx={{
                                                height: 40,
                                                width: 'auto',
                                                filter: 'brightness(0) invert(1)'
                                            }}
                                        />
                                    </Link>
                                </Stack>
                            </Box>

                            {/* Social Media Links */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'white',
                                        mb: 2
                                    }}
                                >
                                    Follow Us
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {socialLinks.map((social, index) => (
                                        <IconButton
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            sx={{
                                                color: 'grey.300',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    backgroundColor: 'rgba(25, 118, 210, 0.1)'
                                                },
                                                transition: 'all 0.2s ease'
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
                    {footerSections.map((section, index) => (
                        <Grid item xs={12} sm={6} md={2} key={index}>
                            <Stack spacing={2}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'white',
                                        mb: 1
                                    }}
                                >
                                    {section.title}
                                </Typography>
                                <Stack spacing={1}>
                                    {section.links.map((link, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            href={link.href}
                                            sx={{
                                                color: 'grey.300',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    textDecoration: 'underline'
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
            </Container>

            {/* Divider */}
            <Divider sx={{ borderColor: 'grey.700' }} />

            {/* Bottom Footer */}
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', sm: 'center' },
                        gap: 2
                    }}
                >
                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'grey.300',
                            textAlign: { xs: 'center', sm: 'left' }
                        }}
                    >
                        © {currentYear} <strong>Vedika.Health</strong>. All rights reserved.
                    </Typography>

                    {/* Bottom Links */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 3 }}
                        sx={{
                            alignItems: { xs: 'center', sm: 'center' }
                        }}
                    >
                        <Link
                            href="/privacy"
                            sx={{
                                color: 'grey.300',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            sx={{
                                color: 'grey.300',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/sitemap"
                            sx={{
                                color: 'grey.300',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            Sitemap
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
