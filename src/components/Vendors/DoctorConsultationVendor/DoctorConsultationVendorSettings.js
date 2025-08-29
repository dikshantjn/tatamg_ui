import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  Slider,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  Palette,
  Settings,
  Save,
  Cancel,
  Refresh,
  Download,
  Upload,
  Delete,
  Warning,
  Info,
  CheckCircle,
  Error,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Phone,
  Message,
  VideoCall,
  Schedule,
  Business,
  Person,
  LocationOn,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';

const DoctorConsultationVendorSettings = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointmentReminders: true,
      paymentNotifications: true,
      systemUpdates: false
    },
    privacy: {
      profileVisibility: 'public',
      contactSharing: true,
      dataAnalytics: true,
      locationSharing: false,
      activityStatus: true
    },
    consultation: {
      autoAccept: false,
      consultationDuration: 30,
      maxPatientsPerDay: 20,
      consultationFee: 1500,
      cancellationPolicy: '24h',
      refundPolicy: 'partial'
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h'
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      failedLoginAttempts: 5
    }
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleReset = () => {
    // Reset to default settings
    console.log('Resetting settings to defaults');
  };

  const handleExport = () => {
    console.log('Exporting settings');
  };

  const handleImport = () => {
    console.log('Importing settings');
  };

  const tabLabels = ['Notifications', 'Privacy', 'Consultation', 'Appearance', 'Security'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          Settings & Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your consultation service settings and preferences
        </Typography>
      </Box>

      {/* Success Alert */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Action Buttons */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleReset}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
            >
              Export Settings
            </Button>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={handleImport}
            >
              Import Settings
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Card>
        <CardContent>
          <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
            {tabLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>

          {/* Notifications Settings */}
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Notification Channels
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
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
                      <Phone />
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
                      <Message />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive updates via push notifications"
                    />
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Notification Types
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText
                      primary="Appointment Reminders"
                      secondary="Get reminded about upcoming appointments"
                    />
                    <Switch
                      checked={settings.notifications.appointmentReminders}
                      onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Notifications"
                      secondary="Get notified about payments and transactions"
                    />
                    <Switch
                      checked={settings.notifications.paymentNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'paymentNotifications', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Info />
                    </ListItemIcon>
                    <ListItemText
                      primary="System Updates"
                      secondary="Receive system and maintenance updates"
                    />
                    <Switch
                      checked={settings.notifications.systemUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'systemUpdates', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}

          {/* Privacy Settings */}
          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Profile Privacy
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile Visibility"
                      secondary="Control who can see your profile"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                        <MenuItem value="contacts">Contacts Only</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact Sharing"
                      secondary="Allow sharing of contact information"
                    />
                    <Switch
                      checked={settings.privacy.contactSharing}
                      onChange={(e) => handleSettingChange('privacy', 'contactSharing', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location Sharing"
                      secondary="Share your location with patients"
                    />
                    <Switch
                      checked={settings.privacy.locationSharing}
                      onChange={(e) => handleSettingChange('privacy', 'locationSharing', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Data & Analytics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText
                      primary="Data Analytics"
                      secondary="Allow data collection for analytics"
                    />
                    <Switch
                      checked={settings.privacy.dataAnalytics}
                      onChange={(e) => handleSettingChange('privacy', 'dataAnalytics', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Activity Status"
                      secondary="Show when you're online"
                    />
                    <Switch
                      checked={settings.privacy.activityStatus}
                      onChange={(e) => handleSettingChange('privacy', 'activityStatus', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}

          {/* Consultation Settings */}
          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Consultation Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <VideoCall />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto Accept Appointments"
                      secondary="Automatically accept new appointments"
                    />
                    <Switch
                      checked={settings.consultation.autoAccept}
                      onChange={(e) => handleSettingChange('consultation', 'autoAccept', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText
                      primary="Default Consultation Duration"
                      secondary={`${settings.consultation.consultationDuration} minutes`}
                    />
                    <Slider
                      value={settings.consultation.consultationDuration}
                      onChange={(e, value) => handleSettingChange('consultation', 'consultationDuration', value)}
                      min={15}
                      max={120}
                      step={15}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 150 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Max Patients Per Day"
                      secondary={`${settings.consultation.maxPatientsPerDay} patients`}
                    />
                    <TextField
                      type="number"
                      value={settings.consultation.maxPatientsPerDay}
                      onChange={(e) => handleSettingChange('consultation', 'maxPatientsPerDay', parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Policies & Fees
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary="Default Consultation Fee"
                      secondary={`₹${settings.consultation.consultationFee}`}
                    />
                    <TextField
                      type="number"
                      value={settings.consultation.consultationFee}
                      onChange={(e) => handleSettingChange('consultation', 'consultationFee', parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cancellation Policy"
                      secondary="Time required for cancellation"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.consultation.cancellationPolicy}
                        onChange={(e) => handleSettingChange('consultation', 'cancellationPolicy', e.target.value)}
                      >
                        <MenuItem value="1h">1 Hour</MenuItem>
                        <MenuItem value="24h">24 Hours</MenuItem>
                        <MenuItem value="48h">48 Hours</MenuItem>
                        <MenuItem value="72h">72 Hours</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary="Refund Policy"
                      secondary="Refund policy for cancellations"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.consultation.refundPolicy}
                        onChange={(e) => handleSettingChange('consultation', 'refundPolicy', e.target.value)}
                      >
                        <MenuItem value="full">Full Refund</MenuItem>
                        <MenuItem value="partial">Partial Refund</MenuItem>
                        <MenuItem value="none">No Refund</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}

          {/* Appearance Settings */}
          {selectedTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Display Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Palette />
                    </ListItemIcon>
                    <ListItemText
                      primary="Theme"
                      secondary="Choose your preferred theme"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="auto">Auto</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText
                      primary="Language"
                      secondary="Select your preferred language"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.appearance.language}
                        onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="hi">Hindi</MenuItem>
                        <MenuItem value="mr">Marathi</MenuItem>
                        <MenuItem value="gu">Gujarati</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText
                      primary="Time Format"
                      secondary="Choose time display format"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.appearance.timeFormat}
                        onChange={(e) => handleSettingChange('appearance', 'timeFormat', e.target.value)}
                      >
                        <MenuItem value="12h">12 Hour</MenuItem>
                        <MenuItem value="24h">24 Hour</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Regional Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Timezone"
                      secondary="Set your local timezone"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.appearance.timezone}
                        onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                      >
                        <MenuItem value="Asia/Kolkata">India (IST)</MenuItem>
                        <MenuItem value="Asia/Dubai">Dubai (GST)</MenuItem>
                        <MenuItem value="Asia/Singapore">Singapore (SGT)</MenuItem>
                        <MenuItem value="UTC">UTC</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date Format"
                      secondary="Choose date display format"
                    />
                    <FormControl size="small">
                      <Select
                        value={settings.appearance.dateFormat}
                        onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
                      >
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}

          {/* Security Settings */}
          {selectedTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Security Features
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Enable 2FA for enhanced security"
                    />
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="Login Notifications"
                      secondary="Get notified of new logins"
                    />
                    <Switch
                      checked={settings.security.loginNotifications}
                      onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText
                      primary="Session Timeout"
                      secondary={`${settings.security.sessionTimeout} minutes`}
                    />
                    <Slider
                      value={settings.security.sessionTimeout}
                      onChange={(e, value) => handleSettingChange('security', 'sessionTimeout', value)}
                      min={15}
                      max={120}
                      step={15}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 150 }}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Password Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText
                      primary="Password Expiry"
                      secondary={`${settings.security.passwordExpiry} days`}
                    />
                    <Slider
                      value={settings.security.passwordExpiry}
                      onChange={(e, value) => handleSettingChange('security', 'passwordExpiry', value)}
                      min={30}
                      max={365}
                      step={30}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 150 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning />
                    </ListItemIcon>
                    <ListItemText
                      primary="Failed Login Attempts"
                      secondary={`${settings.security.failedLoginAttempts} attempts`}
                    />
                    <TextField
                      type="number"
                      value={settings.security.failedLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'failedLoginAttempts', parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </ListItem>
                </List>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setDialogOpen(true)}
                    fullWidth
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorConsultationVendorSettings; 