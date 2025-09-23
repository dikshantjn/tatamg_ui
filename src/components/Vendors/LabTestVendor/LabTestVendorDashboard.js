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
  Chip
} from '@mui/material';
import {
  Science,
  Assignment,
  TrendingUp,
  Schedule,
  Visibility
} from '@mui/icons-material';
import LabTestVendorMainLayout from './LabTestVendorMainLayout';

const LabTestVendorDashboardContent = () => {
  // Sample dashboard data
  const dashboardStats = [
    { title: 'Total Tests', value: '45', icon: <Science />, color: 'primary' },
    { title: 'Today Appointments', value: '12', icon: <Schedule />, color: 'secondary' },
    { title: 'Revenue (₹)', value: '28,450', icon: <TrendingUp />, color: 'success' },
    { title: 'Pending Reports', value: '8', icon: <Assignment />, color: 'warning' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1200 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your diagnostic center today.
      </Typography>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      backgroundColor: `${stat.color}.light`,
                      color: `${stat.color}.contrastText`,
                      mr: 2
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Appointments
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Schedule color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Appointment #${1000 + item}`}
                        secondary={`Blood Test • 10:30 AM`}
                      />
                      <Chip label="Scheduled" size="small" color="success" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Tests
                </Typography>
                <List>
                  {['Blood Test', 'Urine Test', 'X-Ray'].map((test, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Science color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={test}
                        secondary={`₹${500 + index * 200} • 2 hours`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Visibility fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {10 + index * 5}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </Box>
  );
};

const LabTestVendorDashboard = () => {
  return (
    <LabTestVendorMainLayout title="Dashboard">
      <LabTestVendorDashboardContent />
    </LabTestVendorMainLayout>
  );
};

export default LabTestVendorDashboard; 