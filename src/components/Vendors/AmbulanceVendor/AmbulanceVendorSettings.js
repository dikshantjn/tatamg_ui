import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  InputAdornment
} from '@mui/material';
import {
  Settings,
  Notifications,
  Security,
  Language,
  Palette,
  VolumeUp,
  LocationOn,
  Schedule,
  Payment,
  PrivacyTip,
  Save,
  Restore,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';

const AmbulanceVendorSettings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: false,
      emergency: true,
      booking: true,
      payment: true
    },
    privacy: {
      locationSharing: true,
      dataAnalytics: true,
      marketingEmails: false
    },
    service: {
      autoAccept: false,
      maxDistance: 50,
      responseTime: 15,
      emergencyPriority: true
    },
    appearance: {
      darkMode: false,
      compactMode: false,
      language: 'English'
    },
    payment: {
      autoWithdraw: false,
      minimumAmount: 1000,
      preferredMethod: 'Bank Transfer'
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading settings
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
    setDialogType('save');
    setDialogOpen(true);
  };

  const handleResetSettings = () => {
    setDialogType('reset');
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (dialogType === 'reset') {
      // Reset to default settings
      setSettings({
        notifications: {
          email: true,
          sms: true,
          push: false,
          emergency: true,
          booking: true,
          payment: true
        },
        privacy: {
          locationSharing: true,
          dataAnalytics: true,
          marketingEmails: false
        },
        service: {
          autoAccept: false,
          maxDistance: 50,
          responseTime: 15,
          emergencyPriority: true
        },
        appearance: {
          darkMode: false,
          compactMode: false,
          language: 'English'
        },
        payment: {
          autoWithdraw: false,
          minimumAmount: 1000,
          preferredMethod: 'Bank Transfer'
        }
      });
    }
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading settings...</Typography>
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom color={theme.palette.text.primary}>
            Settings ⚙️
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>
            Customize your ambulance service preferences and configurations
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Notifications Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Notifications sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Notifications
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive updates via email"
                    />
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="SMS Notifications"
                      secondary="Receive updates via SMS"
                    />
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive push notifications"
                    />
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Emergency Alerts"
                      secondary="Critical emergency notifications"
                    />
                    <Switch
                      checked={settings.notifications.emergency}
                      onChange={(e) => handleSettingChange('notifications', 'emergency', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Booking Updates"
                      secondary="New booking notifications"
                    />
                    <Switch
                      checked={settings.notifications.booking}
                      onChange={(e) => handleSettingChange('notifications', 'booking', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Payment color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Notifications"
                      secondary="Payment and revenue updates"
                    />
                    <Switch
                      checked={settings.notifications.payment}
                      onChange={(e) => handleSettingChange('notifications', 'payment', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Privacy Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PrivacyTip sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Privacy & Security
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location Sharing"
                      secondary="Share location for better service"
                    />
                    <Switch
                      checked={settings.privacy.locationSharing}
                      onChange={(e) => handleSettingChange('privacy', 'locationSharing', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Data Analytics"
                      secondary="Allow data collection for improvements"
                    />
                    <Switch
                      checked={settings.privacy.dataAnalytics}
                      onChange={(e) => handleSettingChange('privacy', 'dataAnalytics', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Error color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Marketing Emails"
                      secondary="Receive promotional content"
                    />
                    <Switch
                      checked={settings.privacy.marketingEmails}
                      onChange={(e) => handleSettingChange('privacy', 'marketingEmails', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Service Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Settings sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Service Configuration
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.service.autoAccept}
                        onChange={(e) => handleSettingChange('service', 'autoAccept', e.target.checked)}
                      />
                    }
                    label="Auto Accept Requests"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Automatically accept emergency requests
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Maximum Service Distance (km)
                  </Typography>
                  <Slider
                    value={settings.service.maxDistance}
                    onChange={(e, value) => handleSettingChange('service', 'maxDistance', value)}
                    min={10}
                    max={100}
                    marks={[
                      { value: 10, label: '10km' },
                      { value: 50, label: '50km' },
                      { value: 100, label: '100km' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Response Time Target (minutes)
                  </Typography>
                  <TextField
                    type="number"
                    value={settings.service.responseTime}
                    onChange={(e) => handleSettingChange('service', 'responseTime', parseInt(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.service.emergencyPriority}
                      onChange={(e) => handleSettingChange('service', 'emergencyPriority', e.target.checked)}
                    />
                  }
                  label="Emergency Priority"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Appearance Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Palette sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Appearance
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appearance.darkMode}
                        onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appearance.compactMode}
                        onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                      />
                    }
                    label="Compact Mode"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.appearance.language}
                      label="Language"
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Hindi">Hindi</MenuItem>
                      <MenuItem value="Marathi">Marathi</MenuItem>
                      <MenuItem value="Gujarati">Gujarati</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Payment sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Payment Settings
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payment.autoWithdraw}
                          onChange={(e) => handleSettingChange('payment', 'autoWithdraw', e.target.checked)}
                        />
                      }
                      label="Auto Withdraw"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Automatically withdraw earnings
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Minimum Withdrawal Amount"
                      type="number"
                      value={settings.payment.minimumAmount}
                      onChange={(e) => handleSettingChange('payment', 'minimumAmount', parseInt(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Preferred Payment Method</InputLabel>
                      <Select
                        value={settings.payment.preferredMethod}
                        label="Preferred Payment Method"
                        onChange={(e) => handleSettingChange('payment', 'preferredMethod', e.target.value)}
                      >
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="Paytm">Paytm</MenuItem>
                        <MenuItem value="PhonePe">PhonePe</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            size="large"
          >
            Save Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={handleResetSettings}
            size="large"
          >
            Reset to Default
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            {dialogType === 'save' ? 'Save Settings' : 'Reset Settings'}
          </DialogTitle>
          <DialogContent>
            <Alert severity={dialogType === 'save' ? 'info' : 'warning'} sx={{ mb: 2 }}>
              {dialogType === 'save' 
                ? 'Are you sure you want to save these settings?' 
                : 'This will reset all settings to their default values. This action cannot be undone.'
              }
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleConfirmAction}
              variant="contained"
              color={dialogType === 'save' ? 'primary' : 'warning'}
            >
              {dialogType === 'save' ? 'Save' : 'Reset'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorSettings; 