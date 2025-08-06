import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  Settings,
  Notifications,
  Security,
  Language,
  Palette,
  Save,
  Cancel,
  ExpandMore,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Phone,
  Business,
  LocalHospital,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';
import HospitalVendorLayout from './HospitalVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HospitalVendorSettings = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingAlerts: true,
      emergencyAlerts: true,
      weeklyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
      loginAlerts: true
    },
    display: {
      language: 'English',
      theme: 'auto',
      compactMode: false,
      showNotifications: true
    },
    business: {
      autoAcceptBookings: false,
      bookingConfirmationRequired: true,
      emergencyPriority: true,
      maintenanceMode: false
    }
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    toast.success('Settings saved successfully');
  };

  const handleResetSettings = () => {
    // Reset to default settings
    toast.info('Settings reset to defaults');
  };

  // Skeleton loading component
  const SettingsSkeleton = () => (
    <HospitalVendorLayout title="Settings">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="text" width="200px" height={32} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Settings Skeleton */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="100%" height={600} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="100%" height={300} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </HospitalVendorLayout>
  );

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <HospitalVendorLayout title="Settings">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Settings sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Settings page is under development. Please check back later for configuration options.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Settings />}
              sx={{ borderRadius: 2 }}
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </Box>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="colored"
      />
    </HospitalVendorLayout>
  );
};

export default HospitalVendorSettings; 