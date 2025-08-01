import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Settings
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';

const AmbulanceVendorSettings = () => {
  const theme = useTheme();

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Card sx={{ 
          maxWidth: 600, 
          width: '100%',
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: theme.shadows[8]
        }}>
          <CardContent sx={{ p: 4 }}>
            <Settings sx={{ 
              fontSize: 80, 
              color: theme.palette.primary.main, 
              mb: 3 
            }} />
            
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Settings
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This is the settings page for ambulance vendors.
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Settings functionality will be implemented here in future updates.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorSettings; 