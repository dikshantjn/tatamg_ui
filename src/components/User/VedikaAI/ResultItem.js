import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Chip, IconButton } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import BedIcon from '@mui/icons-material/Bed';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import IntentNavigationService from '../../../services/VedikaAI/IntentNavigationService';

/**
 * Result Item Component
 * Displays individual result items with actions
 * Based on Flutter _ResultItem implementation
 */
const ResultItem = ({ resultItem, onActionPressed, navigate }) => {
  const [showConsultationMode, setShowConsultationMode] = useState(false);
  
  const formattedItem = useMemo(() => {
    return IntentNavigationService.formatResultItem(resultItem);
  }, [resultItem]);
  
  const { title, subtitle, type, rating, badges, actions } = formattedItem;
  
  const supportsOnline = useMemo(() => {
    return IntentNavigationService.supportsOnline(formattedItem);
  }, [formattedItem]);
  
  const supportsOffline = useMemo(() => {
    return IntentNavigationService.supportsOffline(formattedItem);
  }, [formattedItem]);
  
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'bed':
        return <BedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />;
      case 'status':
        return <ReceiptIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />;
      case 'doctor':
        return <PersonIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />;
      case 'lab':
        return <ScienceIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />;
      case 'blood':
        return <BloodtypeIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />;
      default:
        return <LocalHospitalIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />;
    }
  };

  const handleActionClick = async (action) => {
    const isBookingDoctor = (type === 'doctor') && 
      (action.type === 'BOOK_DOCTOR' || action.type === 'BOOK_APPOINTMENT' || 
       action.label?.toLowerCase().includes('book'));
    
    if (isBookingDoctor) {
      setShowConsultationMode(true);
      return;
    }
    
    await onActionPressed(resultItem, action);
  };

  const handleModeSelection = async (mode) => {
    console.log('🎯 Mode selection clicked:', mode);
    console.log('🎯 Available actions:', actions);
    console.log('🎯 Actions details:', actions.map(a => ({ type: a.type, label: a.label, action: a.action })));
    
    const originalAction = actions.find(a => 
      a.type === 'BOOK_DOCTOR' || a.type === 'BOOK_APPOINTMENT'
    );
    
    console.log('🎯 Found original action:', originalAction);
    
    if (originalAction) {
      const actionWithMode = {
        ...originalAction,
        type: 'BOOK_DOCTOR',
        mode: mode
      };
      
      console.log('🎯 Action with mode:', actionWithMode);
      console.log('🎯 Result item:', resultItem);
      
      await onActionPressed(resultItem, actionWithMode);
    } else {
      console.error('🎯 No original action found for doctor booking');
      console.log('🎯 Trying to create action from available actions...');
      
      // Try to create an action from the first available action
      if (actions.length > 0) {
        const firstAction = actions[0];
        const actionWithMode = {
          ...firstAction,
          type: 'BOOK_DOCTOR',
          mode: mode
        };
        
        console.log('🎯 Created action from first action:', actionWithMode);
        await onActionPressed(resultItem, actionWithMode);
      }
    }
  };

  return (
    <Box sx={{
      mb: 1,
      p: 1.5,
      borderRadius: 1.5,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          background: 'rgba(138,43,226,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getIcon()}
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ 
            color: 'white', 
            fontSize: 14, 
            fontWeight: 600,
            mb: 0.5
          }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: 12,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {subtitle}
            </Typography>
            {rating && (
              <>
                <StarIcon sx={{ fontSize: 14, color: '#FFD700' }} />
                <Typography sx={{ color: 'white', fontSize: 12 }}>
                  {rating}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Badges */}
      {badges.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {badges.map((badge, index) => (
            <Chip
              key={index}
              label={badge.toString()}
              size="small"
              sx={{
                height: 24,
                fontSize: 11,
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => handleActionClick(action)}
              sx={{
                fontSize: 12,
                px: 1.5,
                py: 0.5,
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {action.label || 'Action'}
            </Button>
          ))}
        </Box>
      )}

      {/* Consultation Mode Selection */}
      {showConsultationMode && type === 'doctor' && (supportsOnline || supportsOffline) && (
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: 12, 
            fontWeight: 600,
            mb: 1
          }}>
            Choose consultation mode
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {supportsOnline && (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleModeSelection('ONLINE')}
                sx={{
                  background: 'linear-gradient(135deg, #8A2BE2, #4169E1)',
                  fontSize: 12,
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7B1FA2, #303F9F)'
                  }
                }}
              >
                Online
              </Button>
            )}
            {supportsOffline && (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleModeSelection('OFFLINE')}
                sx={{
                  background: 'linear-gradient(135deg, #00695C, #004D40)',
                  fontSize: 12,
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004D40, #00251A)'
                  }
                }}
              >
                Offline
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResultItem;
