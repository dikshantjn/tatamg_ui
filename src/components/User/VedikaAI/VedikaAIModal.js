import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SendIcon from '@mui/icons-material/Send';
import VedikaAIService from '../../../services/VedikaAI/VedikaAIService';
import IntentNavigationService from '../../../services/VedikaAI/IntentNavigationService';
import IntentResultsView from './IntentResultsView';
import { useNavigate } from 'react-router-dom';

/**
 * VedikaAIModal
 * A floating bottom modal inspired by modern assistant UIs (e.g., Ask Gemini / Hey Google)
 * - Black glass background card
 * - Rotating gradient border while listening
 * - Mic button with listening animation
 * - Shows suggestions; while speaking, shows live transcript
 */
function VedikaAIModal({ open, onClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [intentData, setIntentData] = useState(null);
    const [textInput, setTextInput] = useState('');
    const recognitionRef = useRef(null);
    const streamRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const suggestionIntervalRef = useRef(null);
    const transcriptRef = useRef('');

    const suggestions = useMemo(() => [
        'Find nearest hospital',
        'Book doctor appointment',
        'Track my order',
        'Show lab test results',
        'Medicine delivery status'
    ], []);

    useEffect(() => {
        if (!open) {
            // Cleanup when closing
            stopListening();
            setTranscript('');
            setError('');
            setIsListening(false);
            setIsProcessing(false);
            setHasResult(false);
            setIntentData(null);
            // Clear suggestion interval
            if (suggestionIntervalRef.current) {
                clearInterval(suggestionIntervalRef.current);
                suggestionIntervalRef.current = null;
            }
        } else {
            // Start suggestion cycling when modal opens
            suggestionIntervalRef.current = setInterval(() => {
                setCurrentSuggestionIndex(prev => (prev + 1) % suggestions.length);
            }, 3000); // Change suggestion every 3 seconds
        }
        
        return () => {
            if (suggestionIntervalRef.current) {
                clearInterval(suggestionIntervalRef.current);
                suggestionIntervalRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, suggestions.length]);

    const ensureMicPermission = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Microphone not supported on this device/browser.');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            return true;
        } catch (e) {
            setError('Microphone access denied. Please allow mic permission in your browser settings.');
            return false;
        }
    };

    const initRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech Recognition is not supported in this browser.');
            return null;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                if (res.isFinal) {
                    finalTranscript += res[0].transcript.trim();
                } else {
                    interimTranscript += res[0].transcript;
                }
            }
            
            console.log('🎤 Speech recognition result:', { finalTranscript, interimTranscript });
            
            // Show real-time transcript (both final and interim)
            if (finalTranscript || interimTranscript) {
                setTranscript(prev => {
                    console.log('🎤 Previous transcript:', prev);
                    const baseText = prev ? prev.split('|')[0] : ''; // Remove any existing interim text
                    const newText = baseText + (baseText ? ' ' : '') + finalTranscript;
                    const result = interimTranscript ? newText + '|' + interimTranscript : newText;
                    console.log('🎤 New transcript:', result);
                    transcriptRef.current = result; // Update ref
                    return result;
                });
                
                // Process only final transcript for API call
                if (finalTranscript) {
                    // Clear silence timeout when we get results
                    if (silenceTimeoutRef.current) {
                        clearTimeout(silenceTimeoutRef.current);
                    }
                    // Set new silence timeout
                    silenceTimeoutRef.current = setTimeout(() => {
                        console.log('🎤 Silence timeout reached, stopping...');
                        stopListening();
                    }, 3000);
                }
            }
        };
        recognition.onerror = (e) => {
            setError(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Speech error: ' + e.error);
            setIsListening(false);
        };
        recognition.onend = () => {
            setIsListening(false);
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
            
            // Process the final transcript when recognition ends
            const currentTranscript = transcriptRef.current;
            if (currentTranscript && currentTranscript.trim()) {
                const finalTranscript = currentTranscript.split('|')[0].trim();
                if (finalTranscript) {
                    console.log('🎤 Processing final transcript on end:', finalTranscript);
                    processTranscript(finalTranscript);
                }
            }
        };
        recognitionRef.current = recognition;
        return recognition;
    };

    const startListening = async () => {
        console.log('🚀 Starting listening function...');
        setError('');
        const permitted = await ensureMicPermission();
        console.log('🎤 Mic permission result:', permitted);
        if (!permitted) return;
        const recognition = initRecognition();
        console.log('🎤 Recognition object:', recognition);
        if (!recognition) return;
        try {
            console.log('🎤 Setting listening state to true...');
            setIsListening(true);
            console.log('🎤 Starting recognition...');
            recognition.start();
            console.log('🎤 Recognition started successfully!');
        } catch (err) {
            console.error('🎤 Error starting recognition:', err);
            setError('Unable to start listening.');
            setIsListening(false);
        }
    };

    const stopListening = () => {
        console.log('🛑 Stopping listening function...');
        if (recognitionRef.current) {
            console.log('🛑 Stopping recognition...');
            try { recognitionRef.current.stop(); } catch (_) {}
        }
        if (streamRef.current) {
            console.log('🛑 Stopping media stream...');
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (silenceTimeoutRef.current) {
            console.log('🛑 Clearing silence timeout...');
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
        console.log('🛑 Setting listening state to false...');
        setIsListening(false);
        console.log('🛑 Stop listening completed!');
    };

    const processTranscript = async (text) => {
        if (!text || text.trim().length === 0) {
            console.log('🎤 Empty transcript, skipping processing');
            return;
        }
        
        console.log('🎤 Processing transcript:', text);
        
        setIsProcessing(true);
        setError('');
        
        try {
            // Get user context
            const userId = VedikaAIService.getCurrentUserId();
            const userLocation = await VedikaAIService.getUserLocation();
            
            const result = await VedikaAIService.resolveIntent(text, {
                userId,
                userLocation
            });
            
            console.log('🎤 Intent resolution result:', result);
            
            setIntentData(result);
            setHasResult(true);
            setIsProcessing(false);
            
        } catch (error) {
            console.error('🎤 Error processing transcript:', error);
            console.error('🎤 Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            setError(VedikaAIService.getFriendlyError(error));
            setIsProcessing(false);
        }
    };

    const handleTextSubmit = async () => {
        if (!textInput.trim()) return;
        
        console.log('📝 Text input submitted:', textInput);
        
        // Reset states
        setTranscript('');
        setHasResult(false);
        setIntentData(null);
        setIsProcessing(false);
        setError('');
        transcriptRef.current = '';
        
        // Process the text input
        await processTranscript(textInput.trim());
        
        // Clear the input
        setTextInput('');
    };

    const handleActionPressed = async (resultItem, action) => {
        console.log('🎯 Action pressed:', { resultItem, action });
        
        try {
            const outcome = await IntentNavigationService.handleIntentAction(
                resultItem, 
                action, 
                navigate
            );
            
            console.log('🎯 Action outcome:', outcome);
            
            if (outcome.closeOverlay) {
                onClose();
            }
            
            if (outcome.route) {
                navigate(outcome.route, { 
                    state: outcome.arguments 
                });
            }
            
            if (outcome.showEmergencyDialog) {
                // Handle emergency dialog - could show a modal or navigate
                console.log('🚨 Emergency dialog needed:', outcome);
            }
            
            if (outcome.showMessage) {
                // Show message to user - could use a toast or alert
                console.log('💬 Message:', outcome.showMessage);
            }
            
        } catch (error) {
            console.error('🎯 Error handling action:', error);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <>
            <style>
                {`
                    .vedika-scrollable-content::-webkit-scrollbar {
                        width: 4px !important;
                    }
                    .vedika-scrollable-content::-webkit-scrollbar-track {
                        background: rgba(128,128,128,0.2) !important;
                        border-radius: 2px !important;
                    }
                    .vedika-scrollable-content::-webkit-scrollbar-thumb {
                        background: rgba(128,128,128,0.6) !important;
                        border-radius: 2px !important;
                    }
                    .vedika-scrollable-content::-webkit-scrollbar-thumb:hover {
                        background: rgba(128,128,128,0.8) !important;
                    }
                `}
            </style>
            <Box
            onClick={(e) => {
                // Close modal when clicking on backdrop
                if (e.target === e.currentTarget) {
                    console.log('📱 Backdrop clicked - closing modal');
                    stopListening();
                    onClose();
                }
            }}
            sx={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: isMobile ? 80 : 64, // More space on mobile
                zIndex: 9999, // Higher z-index to ensure it's above everything
                display: 'flex',
                justifyContent: 'center',
                px: 2,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                pointerEvents: 'auto', // Ensure it can receive pointer events
                // Add backdrop to prevent clicks behind modal
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    zIndex: -1,
                    pointerEvents: 'auto'
                }
            }}
        >
            {/* Rotating gradient ring container */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 560,
                    // Add padding to accommodate the gradient border
                    p: isListening ? '1px' : '0px',
                    transition: 'padding 0.3s ease'
                }}
            >
                {/* Gradient border when listening */}
                {isListening && (
                    <Box
                        sx={{
                            pointerEvents: 'none',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 1.5, // Exact match with Paper borderRadius
                            background: 'linear-gradient(45deg, #8A2BE2, #4169E1, #FF1493, #00CED1)',
                            backgroundSize: '300% 300%',
                            animation: 'vedika-gradient-move 3s ease infinite',
                            '@keyframes vedika-gradient-move': {
                                '0%': { backgroundPosition: '0% 50%' },
                                '50%': { backgroundPosition: '100% 50%' },
                                '100%': { backgroundPosition: '0% 50%' },
                            },
                            // Add a subtle glow effect
                            boxShadow: '0 0 20px rgba(138,43,226,0.5)',
                            zIndex: 0
                        }}
                    />
                )}

                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 1.5, // Reduced from 4 to 1.5 for subtle rounding
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.95)', // Pure black background
                        backdropFilter: 'blur(12px)',
                        color: 'white',
                        border: isListening ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                        pointerEvents: 'auto', // Ensure it can receive pointer events
                        position: 'relative',
                        zIndex: 1, // Ensure it's above the gradient border
                        width: '100%',
                        maxWidth: isMobile ? '95vw' : 560,
                        maxHeight: hasResult ? (isMobile ? '85vh' : '75vh') : (isMobile ? '80vh' : '70vh'), // Increase height when results are shown
                        boxShadow: '0 8px 32px rgba(0,0,0,0.8)', // Stronger shadow for black background
                        // Ensure proper alignment with gradient border
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        // Global scrollbar styling for the entire modal
                        '& *': {
                            '&::-webkit-scrollbar': {
                                width: '4px !important',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(128,128,128,0.2) !important',
                                borderRadius: '2px !important',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(128,128,128,0.6) !important',
                                borderRadius: '2px !important',
                                '&:hover': {
                                    background: 'rgba(128,128,128,0.8) !important',
                                }
                            },
                            // Firefox scrollbar styling
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(128,128,128,0.6) rgba(128,128,128,0.2)',
                        }
                    }}
                >
                    {/* Header */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        p: 1.5,
                        flexShrink: 0, // Prevent header from shrinking
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box component="img" src="/vedika-health-logo.png" alt="Vedika AI" sx={{ width: 24, height: 24, borderRadius: 0.5 }} />
                            <Typography sx={{ fontWeight: 700, color: 'white' }}>Vedika AI</Typography>
                        </Box>
                        <Box
                            onClick={() => {
                                console.log('🔴 Close button clicked!');
                                stopListening();
                                onClose();
                            }}
                            onTouchStart={(e) => {
                                console.log('🔴 Close button touch start!', e);
                                e.preventDefault();
                            }}
                            onTouchEnd={(e) => {
                                console.log('🔴 Close button touch end!', e);
                                e.preventDefault();
                                stopListening();
                                onClose();
                            }}
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.3)',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent',
                                '&:hover': { 
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.5)'
                                },
                                '&:active': {
                                    transform: 'scale(0.95)',
                                    bgcolor: 'rgba(255,255,255,0.15)'
                                }
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box 
                        className="vedika-scrollable-content"
                        sx={{ 
                            px: 2, 
                            pb: 2, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1.5,
                            flex: 1,
                            overflow: 'auto',
                        }}
                    >

                        {/* Results Display - Show at top when available */}
                        {(hasResult || isProcessing) && (
                            <IntentResultsView
                                intentData={intentData}
                                onActionPressed={handleActionPressed}
                                navigate={navigate}
                                isProcessing={isProcessing}
                            />
                        )}

                        {/* Listening State with Real-time Transcript */}
                        {isListening && !isProcessing && !hasResult && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 2,
                                py: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} sx={{ color: '#8A2BE2' }} />
                                <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
                                        Listening...
                                    </Typography>
                                </Box>
                                {transcript && transcript.trim() && (
                                    <Typography sx={{ 
                                        color: 'rgba(255,255,255,0.9)', 
                                        fontSize: 12,
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                        maxWidth: '100%',
                                        wordWrap: 'break-word',
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        "{transcript.replace(/\|.*$/, '').trim()}"
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Spoken Text Display (after listening stops but before processing) */}
                        {transcript && transcript.trim() && !isListening && !isProcessing && !hasResult && !error && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 1,
                                py: 2
                            }}>
                                <Typography sx={{ 
                                    color: 'white', 
                                    fontSize: 13,
                                    textAlign: 'center',
                                    fontWeight: 600
                                }}>
                                    You said:
                                </Typography>
                                <Typography sx={{ 
                                    color: 'rgba(255,255,255,0.9)', 
                                    fontSize: 12,
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    "{transcript.replace(/\|.*$/, '').trim()}"
                                </Typography>
                            </Box>
                        )}

                        {/* Error Display */}
                        {error && !isListening && !isProcessing && !hasResult && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 1,
                                py: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ErrorOutlineIcon sx={{ fontSize: 20, color: '#ff6b6b' }} />
                                    <Typography sx={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>
                                        Error
                                    </Typography>
                                </Box>
                                <Typography sx={{ 
                                    color: 'rgba(255,255,255,0.9)', 
                                    fontSize: 12,
                                    textAlign: 'center',
                                    maxWidth: '100%',
                                    wordWrap: 'break-word'
                                }}>
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        {/* Cycling Suggestions */}
                        {(!transcript || !transcript.trim()) && !isListening && !isProcessing && !hasResult && !error && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 2,
                                py: 2
                            }}>
                                {/* AI Thinking Animation */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    opacity: 0.8
                                }}>
                                    <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #8A2BE2, #4169E1)',
                                        animation: 'ai-thinking 1.5s ease-in-out infinite',
                                        '@keyframes ai-thinking': {
                                            '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
                                            '50%': { transform: 'scale(1.2)', opacity: 1 }
                                        }
                                    }} />
                                    <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #4169E1, #FF1493)',
                                        animation: 'ai-thinking 1.5s ease-in-out infinite 0.3s',
                                        '@keyframes ai-thinking': {
                                            '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
                                            '50%': { transform: 'scale(1.2)', opacity: 1 }
                                        }
                                    }} />
                                    <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #FF1493, #00CED1)',
                                        animation: 'ai-thinking 1.5s ease-in-out infinite 0.6s',
                                        '@keyframes ai-thinking': {
                                            '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
                                            '50%': { transform: 'scale(1.2)', opacity: 1 }
                                        }
                                    }} />
                                </Box>
                                
                                {/* Cycling Suggestion */}
                                <Box sx={{
                                    minHeight: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 3,
                                    py: 2,
                                    borderRadius: 3,
                                    background: 'rgba(138,43,226,0.1)',
                                    border: '1px solid rgba(138,43,226,0.3)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'rgba(138,43,226,0.15)',
                                        transform: 'scale(1.02)',
                                        border: '1px solid rgba(138,43,226,0.5)'
                                    }
                                }}
                                onClick={() => setTranscript(suggestions[currentSuggestionIndex])}
                                >
                                    <Typography sx={{ 
                                        fontSize: 14, 
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        color: 'white',
                                        animation: 'suggestion-fade 0.8s ease-in-out',
                                        '@keyframes suggestion-fade': {
                                            '0%': { opacity: 0, transform: 'translateY(10px)' },
                                            '100%': { opacity: 1, transform: 'translateY(0)' }
                                        }
                                    }}>
                                        "{suggestions[currentSuggestionIndex]}"
                                    </Typography>
                                    
                                    {/* Subtle shimmer effect */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                        animation: 'shimmer 3s ease-in-out infinite',
                                        '@keyframes shimmer': {
                                            '0%': { left: '-100%' },
                                            '50%': { left: '100%' },
                                            '100%': { left: '100%' }
                                        }
                                    }} />
                                </Box>
                                
                                {/* Suggestion indicator dots */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {suggestions.map((_, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: index === currentSuggestionIndex 
                                                    ? 'linear-gradient(45deg, #8A2BE2, #4169E1)' 
                                                    : 'rgba(255,255,255,0.3)',
                                                transition: 'all 0.3s ease',
                                                animation: index === currentSuggestionIndex ? 'dot-pulse 2s ease-in-out infinite' : 'none',
                                                '@keyframes dot-pulse': {
                                                    '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
                                                    '50%': { transform: 'scale(1.3)', opacity: 1 }
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}



                    </Box>

                    {/* Footer */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        p: 1.5,
                        flexShrink: 0, // Prevent footer from shrinking
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        gap: 1
                    }}>
                        {/* Input Row: Upload + Search Box + Send + Mic */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            width: '100%',
                            maxWidth: 400
                        }}>
                            {/* Upload File Button */}
                            <Box
                                onClick={() => {
                                    console.log('📁 Upload file clicked');
                                    // TODO: Implement file upload functionality
                                }}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    touchAction: 'manipulation',
                                    WebkitTapHighlightColor: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    '&:hover': { 
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.4)'
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)',
                                        transition: 'transform 0.1s ease'
                                    }
                                }}
                            >
                                <UploadFileIcon sx={{ fontSize: 20 }} />
                            </Box>

                            {/* Text Input */}
                            <TextField
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleTextSubmit();
                                    }
                                }}
                                placeholder="Type your message..."
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        fontSize: '14px',
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '&:hover fieldset': {
                                            border: '1px solid rgba(255,255,255,0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: '1px solid rgba(138,43,226,0.7)',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                        '&::placeholder': {
                                            color: 'rgba(255,255,255,0.7)',
                                            opacity: 1,
                                        },
                                    },
                                }}
                            />

                            {/* Send Button - Only show when there's text */}
                            {textInput.trim() && (
                                <Box
                                    onClick={handleTextSubmit}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #8A2BE2, #4169E1)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        touchAction: 'manipulation',
                                        WebkitTapHighlightColor: 'transparent',
                                        animation: 'send-button-appear 0.2s ease-in-out',
                                        '@keyframes send-button-appear': {
                                            '0%': { opacity: 0, transform: 'scale(0.8)' },
                                            '100%': { opacity: 1, transform: 'scale(1)' }
                                        },
                                        '&:hover': { 
                                            background: 'linear-gradient(135deg, #7a24d2, #365ecf)',
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(138,43,226,0.3)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)',
                                            transition: 'transform 0.1s ease'
                                        }
                                    }}
                                >
                                    <SendIcon sx={{ fontSize: 20 }} />
                                </Box>
                            )}

                            {/* Mic Button */}
                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Wave animation rings when listening */}
                            {isListening && (
                                <>
                                    <Box sx={{
                                        position: 'absolute',
                                            width: 50,
                                            height: 50,
                                        borderRadius: '50%',
                                        border: '2px solid rgba(138,43,226,0.3)',
                                        animation: 'vedika-wave-1 2s ease-in-out infinite',
                                        '@keyframes vedika-wave-1': {
                                            '0%': { transform: 'scale(0.8)', opacity: 0.8 },
                                            '50%': { transform: 'scale(1.2)', opacity: 0.3 },
                                            '100%': { transform: 'scale(0.8)', opacity: 0.8 }
                                        }
                                    }} />
                                    <Box sx={{
                                        position: 'absolute',
                                            width: 60,
                                            height: 60,
                                        borderRadius: '50%',
                                        border: '2px solid rgba(65,105,225,0.2)',
                                        animation: 'vedika-wave-2 2s ease-in-out infinite 0.5s',
                                        '@keyframes vedika-wave-2': {
                                            '0%': { transform: 'scale(0.7)', opacity: 0.6 },
                                            '50%': { transform: 'scale(1.3)', opacity: 0.2 },
                                            '100%': { transform: 'scale(0.7)', opacity: 0.6 }
                                        }
                                    }} />
                                </>
                            )}
                            
                            <Box
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🎤 Footer mic button clicked');
                                    if (isListening) {
                                        console.log('🎤 Stopping listening...');
                                        stopListening();
                                    } else {
                                        console.log('🎤 Starting fresh session...');
                                        // Reset ALL states to initial state
                                        setTranscript('');
                                        setHasResult(false);
                                        setIntentData(null);
                                        setIsProcessing(false);
                                        setError('');
                                            setTextInput('');
                                        transcriptRef.current = ''; // Reset ref
                                        startListening();
                                    }
                                }}
                                onTouchStart={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🎤 Footer mic button touched');
                                    if (isListening) {
                                        console.log('🎤 Touch end - Stopping listening...');
                                        stopListening();
                                    } else {
                                        console.log('🎤 Touch end - Starting fresh session...');
                                        // Reset ALL states to initial state
                                        setTranscript('');
                                        setHasResult(false);
                                        setIntentData(null);
                                        setIsProcessing(false);
                                        setError('');
                                            setTextInput('');
                                        transcriptRef.current = ''; // Reset ref
                                        startListening();
                                    }
                                }}
                                sx={{
                                        width: 40,
                                        height: 40,
                                    borderRadius: '50%',
                                     background: isListening ? 'linear-gradient(135deg, #8A2BE2, #4169E1)' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                     boxShadow: isListening ? '0 8px 24px rgba(65,105,225,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
                                     border: isListening ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                    position: 'relative',
                                    zIndex: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    touchAction: 'manipulation',
                                    WebkitTapHighlightColor: 'transparent',
                                    '&:hover': { 
                                         background: isListening ? 'linear-gradient(135deg, #7a24d2, #365ecf)' : 'rgba(255,255,255,0.2)',
                                         border: isListening ? 'none' : '1px solid rgba(255,255,255,0.4)'
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)',
                                        transition: 'transform 0.1s ease'
                                    }
                                }}
                            >
                                <MicIcon sx={{ 
                                        fontSize: 20,
                                    animation: isListening ? 'vedika-mic-wave 1.5s ease-in-out infinite' : 'none',
                                    '@keyframes vedika-mic-wave': {
                                        '0%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.1)' },
                                        '100%': { transform: 'scale(1)' }
                                    }
                                }} />
                                </Box>
                            </Box>
                        </Box>
                        
                        {/* Footer hint text */}
                        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                            {isListening ? 'Listening… tap to stop' : 'Type or speak your message'}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
        </>
    );
}

export default VedikaAIModal;


