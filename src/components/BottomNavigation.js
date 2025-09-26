import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import MicIcon from '@mui/icons-material/Mic';
import { keyframes } from '@mui/system';
import VedikaAIModal from './User/VedikaAI/VedikaAIModal';

function BottomNavigation() {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [showVoiceRecognition, setShowVoiceRecognition] = useState(false);
    const containerRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const barHeight = 54; // px
    const circleDiameter = 50; // px
    const iconSize = 24; // px
    const margin =6; // notch side margin
    const notchRadius = (circleDiameter / 2) + margin;
    const notchDepth = 10; // visual indentation depth

    // Footer visibility observer (hide when footer is on screen)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setIsVisible(!entry.isIntersecting);
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const findFooter = () => {
            const footer = document.querySelector('.footer');
            if (footer) {
                observer.observe(footer);
                return footer;
            }
            return null;
        };

        let footer = findFooter();
        if (!footer) {
            const timeoutId = setTimeout(findFooter, 100);
            return () => {
                clearTimeout(timeoutId);
                if (footer) observer.unobserve(footer);
            };
        }
        return () => {
            if (footer) observer.unobserve(footer);
        };
    }, []);

    // Animations
    const blink = useMemo(() => keyframes`
        0% { background-color: rgba(255, 0, 0, 0.4); }
        50% { background-color: rgba(255, 0, 0, 1); }
        100% { background-color: rgba(255, 0, 0, 0.4); }
    `, []);

    const handleSpeakClick = () => {
        setShowVoiceRecognition(true);
    };

    const handleEmergencyClick = () => {
        // Implement emergency modal logic if needed
    };

    if (!isMobile) return null;

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: (theme) => theme.zIndex.appBar + 1,
                pointerEvents: 'none', // allow clicks only on children
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 300ms ease',
            }}
        >
            {/* Vedika AI Modal */}
            <VedikaAIModal open={showVoiceRecognition} onClose={() => setShowVoiceRecognition(false)} />

            {/* Layout container to reserve space for circular button */}
            <Box
                sx={{
                    height: `${barHeight + circleDiameter / 2}px`,
                    position: 'relative',
                }}
            >
                {/* The bottom bar */}
                <Paper
                    elevation={6}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: `${barHeight}px`,
                        bgcolor: (theme) => theme.palette.primary.main,
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        overflow: 'visible',
                        pointerEvents: 'auto',
                    }}
                >
                    {/* Fake notch by overlaying a background-colored circle to carve the bar */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: `-${notchRadius - notchDepth}px`,
                            width: `${notchRadius * 2}px`,
                            height: `${notchRadius * 2}px`,
                            borderRadius: '50%',
                            bgcolor: (theme) => theme.palette.background.paper,
                        }}
                    />

                    {/* Content row inside the bar */}
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            px: 2,
                        }}
                    >
                      {/* Home */}
<Box
  component={Link}
  to="/"
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    textDecoration: 'none',     // remove underline from Typography
    color: 'inherit',           // let Typography use parent color
  }}
>
  <IconButton
    sx={{ color: 'common.white', p: 0.5 }}
  >
    <HomeIcon sx={{ fontSize: 28 }} />
  </IconButton>
  <Typography sx={{ color: 'common.white', fontWeight: 700, fontSize: 14 }}>
    Home
  </Typography>
</Box>


                        {/* Spacer equal to notch width */}
                        <Box sx={{ width: `${(circleDiameter + margin * 2)}px` }} />

                        {/* Emergency */}
                        <Box
                            role="button"
                            onClick={handleEmergencyClick}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                userSelect: 'none',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    animation: `${blink} 1s ease-in-out infinite`,
                                    display: 'grid',
                                    placeItems: 'center',
                                }}
                            >
                                <PhoneIcon sx={{ color: 'common.white', fontSize: 16 }} />
                            </Box>
                            <Typography sx={{ color: 'common.white', fontWeight: 700, fontSize: 14 }}>
                                Emergency
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Floating Speak button */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: `${barHeight - circleDiameter / 2 - (notchDepth)}px`,
                        width: `${circleDiameter + 4}px`,
                        height: `${circleDiameter + 4}px`,
                        borderRadius: '50%',
                        // Static gradient ring
                        background: 'conic-gradient(from 0deg, #8A2BE2, #4169E1, #AC4A79, #8A2BE2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        pointerEvents: 'auto',
                        display: 'grid',
                        placeItems: 'center',
                    }}
                    onClick={handleSpeakClick}
                >
                    <Box
                        sx={{
                            width: `${circleDiameter}px`,
                            height: `${circleDiameter}px`,
                            borderRadius: '50%',
                            bgcolor: 'common.white',
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        <MicIcon sx={{ fontSize: iconSize + 4, color: '#8A2BE2' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default BottomNavigation;