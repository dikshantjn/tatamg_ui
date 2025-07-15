import React, { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Grid, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PolicyIcon from '@mui/icons-material/Policy';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import PushPinIcon from '@mui/icons-material/PushPin';

const mockSettings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    returnRequests: true,
    systemAlerts: false,
    marketingEmails: false
  },
  legal: {
    privacyPolicyAccepted: true,
    termsOfUseAccepted: true,
    lastAcceptedDate: '2024-01-15'
  }
};

const privacyPolicyText = `
Privacy Policy for Medical Store Vendor

1. Information We Collect
We collect information you provide directly to us, such as when you create an account, place orders, or contact us for support.

2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

3. Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. Your Rights
You have the right to access, correct, or delete your personal information. You may also opt out of certain communications.

6. Contact Us
If you have questions about this Privacy Policy, please contact us at privacy@healthcare.com
`;

const termsOfUseText = `
Terms of Use for Medical Store Vendor

1. Acceptance of Terms
By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily download one copy of the materials on the platform for personal, non-commercial transitory viewing only.

3. Disclaimer
The materials on the platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. Limitations
In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform.

5. Revisions and Errata
The materials appearing on the platform could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the platform are accurate, complete or current.

6. Links
We have not reviewed all of the sites linked to the platform and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.

7. Modifications
We may revise these terms of use for the platform at any time without notice. By using this platform you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
`;

function MedicalStoreVendorSettings() {
  const [settings, setSettings] = useState(mockSettings);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleNotificationChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handleLegalAccept = (type) => {
    setSettings(prev => ({
      ...prev,
      legal: {
        ...prev.legal,
        [`${type}Accepted`]: true,
        lastAcceptedDate: new Date().toISOString().split('T')[0]
      }
    }));
  };

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Notification Preferences */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Notification Preferences</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Notification Channels</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                        Email Notifications
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.smsNotifications}
                        onChange={() => handleNotificationChange('smsNotifications')}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SmsIcon sx={{ mr: 1, fontSize: 20 }} />
                        SMS Notifications
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PushPinIcon sx={{ mr: 1, fontSize: 20 }} />
                        Push Notifications
                      </Box>
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Notification Types</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.orderUpdates}
                        onChange={() => handleNotificationChange('orderUpdates')}
                      />
                    }
                    label="Order Updates"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.returnRequests}
                        onChange={() => handleNotificationChange('returnRequests')}
                      />
                    }
                    label="Return Requests"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.systemAlerts}
                        onChange={() => handleNotificationChange('systemAlerts')}
                      />
                    }
                    label="System Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.marketingEmails}
                        onChange={() => handleNotificationChange('marketingEmails')}
                      />
                    }
                    label="Marketing Emails"
                  />
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Legal & Compliance */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <SecurityIcon sx={{ mr: 2, color: 'warning.main' }} />
              <Typography variant="h6">Legal & Compliance</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center">
                        <PolicyIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Privacy Policy</Typography>
                      </Box>
                      {settings.legal.privacyPolicyAccepted && (
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Accepted" 
                          color="success" 
                          size="small" 
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Last accepted: {settings.legal.lastAcceptedDate}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => setPrivacyModalOpen(true)}
                      >
                        View Policy
                      </Button>
                      {!settings.legal.privacyPolicyAccepted && (
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleLegalAccept('privacyPolicy')}
                        >
                          Accept
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center">
                        <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Terms of Use</Typography>
                      </Box>
                      {settings.legal.termsOfUseAccepted && (
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Accepted" 
                          color="success" 
                          size="small" 
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Last accepted: {settings.legal.lastAcceptedDate}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => setTermsModalOpen(true)}
                      >
                        View Terms
                      </Button>
                      {!settings.legal.termsOfUseAccepted && (
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleLegalAccept('termsOfUse')}
                        >
                          Accept
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {privacyPolicyText}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyModalOpen(false)} color="secondary" variant="outlined">
            Close
          </Button>
          {!settings.legal.privacyPolicyAccepted && (
            <Button 
              onClick={() => {
                handleLegalAccept('privacyPolicy');
                setPrivacyModalOpen(false);
              }} 
              color="primary" 
              variant="contained"
            >
              Accept Policy
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Terms of Use Modal */}
      <Dialog open={termsModalOpen} onClose={() => setTermsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Terms of Use</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {termsOfUseText}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsModalOpen(false)} color="secondary" variant="outlined">
            Close
          </Button>
          {!settings.legal.termsOfUseAccepted && (
            <Button 
              onClick={() => {
                handleLegalAccept('termsOfUse');
                setTermsModalOpen(false);
              }} 
              color="primary" 
              variant="contained"
            >
              Accept Terms
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MedicalStoreVendorSettings; 