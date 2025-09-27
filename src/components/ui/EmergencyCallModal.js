import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Slide,
  IconButton,
  Divider
} from '@mui/material';
import {
  LocalHospital,
  LocalShipping,
  Bloodtype,
  Close,
  Phone,
  Star,
  CheckCircle,
  Emergency
} from '@mui/icons-material';
import { membershipService } from '../../services/User/membership.service';
import { getUserId } from '../../services/User/Auth/auth.utils';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EmergencyCallModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [error, setError] = useState(null);

  // Check user's membership plan
  useEffect(() => {
    const checkMembershipPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = getUserId();
        if (!userId) {
          setHasActivePlan(false);
          setCurrentPlan(null);
          return;
        }

        const response = await membershipService.getCurrentUserPlan(userId);
        
        if (response && response.currentPlan) {
          setHasActivePlan(true);
          setCurrentPlan(response.currentPlan);
        } else {
          setHasActivePlan(false);
          setCurrentPlan(null);
        }
      } catch (err) {
        console.log('Error checking membership plan:', err);
        setHasActivePlan(false);
        setCurrentPlan(null);
        // Don't set error for 404 - it's expected for users without plans
        if (err.response && err.response.status !== 404) {
          setError('Failed to check membership status');
        }
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      checkMembershipPlan();
    }
  }, [open]);

  const handleCallDoctor = () => {
    // Implement doctor call logic
    window.open('tel:+919370320066', '_self');
  };

  const handleCallAmbulance = () => {
    // Implement ambulance call logic
    window.open('tel:+919370320066', '_self');
  };

  const handleCallBloodBank = () => {
    // Implement blood bank call logic
    window.open('tel:+919370320066', '_self');
  };

  const handleExploreMembership = () => {
    onClose();
    navigate('/membership');
  };

  const renderEmergencyOptions = () => (
    <Box sx={{ px: isMobile ? 0.5 : 1 }}>
      <Stack spacing={isMobile ? 1 : 1.5}>
        <Card 
          sx={{ 
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid #f0f0f0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <CardActionArea onClick={handleCallDoctor}>
            <CardContent sx={{ p: isMobile ? 2 : 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={isMobile ? 1.5 : 2}>
                <Box
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(255, 107, 107, 0.3)'
                  }}
                >
                  <LocalHospital sx={{ fontSize: isMobile ? 18 : 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.25, fontSize: '0.95rem' }}>
                    Call Doctor
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    24/7 Emergency Consultation
                  </Typography>
                </Box>
                <Phone sx={{ color: '#ff6b6b', fontSize: isMobile ? 18 : 20 }} />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card 
          sx={{ 
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid #f0f0f0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <CardActionArea onClick={handleCallAmbulance}>
            <CardContent sx={{ p: isMobile ? 2 : 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={isMobile ? 1.5 : 2}>
                <Box
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(255, 167, 38, 0.3)'
                  }}
                >
                  <LocalShipping sx={{ fontSize: isMobile ? 18 : 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.25, fontSize: '0.95rem' }}>
                    Call Ambulance
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Immediate Transport Service
                  </Typography>
                </Box>
                <Phone sx={{ color: '#ffa726', fontSize: isMobile ? 18 : 20 }} />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card 
          sx={{ 
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid #f0f0f0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <CardActionArea onClick={handleCallBloodBank}>
            <CardContent sx={{ p: isMobile ? 2 : 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={isMobile ? 1.5 : 2}>
                <Box
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(233, 30, 99, 0.3)'
                  }}
                >
                  <Bloodtype sx={{ fontSize: isMobile ? 18 : 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.25, fontSize: '0.95rem' }}>
                    Call Blood Bank
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Emergency Blood Supply
                  </Typography>
                </Box>
                <Phone sx={{ color: '#e91e63', fontSize: isMobile ? 18 : 20 }} />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Box>
  );

  const renderMembershipPrompt = () => (
    <Box sx={{ textAlign: 'center', px: 1 }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}
      >
        <Star sx={{ fontSize: 28 }} />
      </Box>
      
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1.1rem' }}>
        Unlock Emergency Services
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.5, fontSize: '0.875rem' }}>
        Get instant access to 24/7 emergency services with Vedika Plus membership.
      </Typography>

      <Alert 
        severity="info" 
        sx={{ mb: 2.5, borderRadius: 2, textAlign: 'left', fontSize: '0.8rem' }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, fontSize: '0.8rem' }}>
          Vedika Plus Benefits:
        </Typography>
        <Box component="ul" sx={{ margin: 0, paddingLeft: 2, fontSize: '0.75rem' }}>
          <li>24/7 Emergency Doctor Consultation</li>
          <li>Priority Ambulance Services</li>
          <li>Exclusive Discounts on Medicines & Tests</li>
        </Box>
      </Alert>

      <Button
        variant="contained"
        size="medium"
        onClick={handleExploreMembership}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1,
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          }
        }}
      >
        Explore Vedika Plus Membership
      </Button>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? '16px 16px 0 0' : 3,
          margin: isMobile ? 0 : 'auto',
          maxHeight: isMobile ? 'auto' : '80vh',
          position: isMobile ? 'fixed' : 'relative',
          bottom: isMobile ? 0 : 'auto',
          height: isMobile ? 'auto' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: isMobile ? 0.5 : 1,
        pt: isMobile ? 1.5 : 2,
        position: 'relative',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: isMobile ? '1.1rem' : '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}>
        <Emergency sx={{ color: '#ff4444', fontSize: 24 }} />
        Emergency Services
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
            p: 1
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ 
        p: isMobile ? 1.5 : 3,
        pb: isMobile ? 2 : 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isMobile ? 'auto' : 300
      }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Checking membership status...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : hasActivePlan ? (
          renderEmergencyOptions()
        ) : (
          renderMembershipPrompt()
        )}
      </DialogContent>

    </Dialog>
  );
};

export default EmergencyCallModal;