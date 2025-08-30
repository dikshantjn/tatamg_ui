import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  useTheme,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Bloodtype,
  Schedule,
  Payment,
  People,
  Refresh,
  Download,
  Emergency,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorAnalytics = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          // Load sample analytics data
          loadAnalyticsData();
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

  const loadAnalyticsData = () => {
    // Sample analytics data
    const sampleData = {
      overview: {
        totalOrders: 156,
        totalRevenue: 234000,
        totalUnits: 1245,
        averageRating: 4.8,
        growthRate: 12.5
      },
      bloodTypeStats: [
        { type: 'A+', orders: 45, units: 320, revenue: 384000, growth: 8.2 },
        { type: 'A-', orders: 32, units: 180, revenue: 234000, growth: 12.1 },
        { type: 'B+', orders: 38, units: 285, revenue: 342000, growth: 15.3 },
        { type: 'B-', orders: 25, units: 150, revenue: 195000, growth: 6.8 },
        { type: 'O+', orders: 52, units: 415, revenue: 415000, growth: 18.7 },
        { type: 'O-', orders: 18, units: 108, revenue: 162000, growth: 22.4 },
        { type: 'AB+', orders: 12, units: 72, revenue: 86400, growth: 4.2 },
        { type: 'AB-', orders: 8, units: 48, revenue: 76800, growth: 9.1 }
      ],
      monthlyData: [
        { month: 'Jan', orders: 45, revenue: 54000, units: 360 },
        { month: 'Feb', orders: 52, revenue: 62400, units: 416 },
        { month: 'Mar', orders: 48, revenue: 57600, units: 384 },
        { month: 'Apr', orders: 61, revenue: 73200, units: 488 },
        { month: 'May', orders: 55, revenue: 66000, units: 440 },
        { month: 'Jun', orders: 58, revenue: 69600, units: 464 }
      ],
      topHospitals: [
        { name: 'City General Hospital', orders: 25, revenue: 30000, rating: 4.9 },
        { name: 'Metro Medical Center', orders: 22, revenue: 26400, rating: 4.7 },
        { name: 'Regional Hospital', orders: 18, revenue: 21600, rating: 4.6 },
        { name: 'Community Medical Center', orders: 15, revenue: 18000, rating: 4.5 },
        { name: 'Emergency Care Unit', orders: 12, revenue: 14400, rating: 4.4 }
      ],
      priorityStats: [
        { priority: 'Emergency', orders: 45, percentage: 28.8 },
        { priority: 'Urgent', orders: 38, percentage: 24.4 },
        { priority: 'Normal', orders: 73, percentage: 46.8 }
      ]
    };
    setAnalyticsData(sampleData);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency': return 'error';
      case 'Urgent': return 'warning';
      case 'Normal': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <BloodBankVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LinearProgress />
        </Box>
      </BloodBankVendorLayout>
    );
  }

  return (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Analytics & Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View detailed analytics and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ borderRadius: 2 }}
            >
              Export Report
            </Button>
            <IconButton onClick={loadAnalyticsData} sx={{ borderRadius: 2 }}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Overview Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          justifyContent: 'center',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4
        }}>
          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Bloodtype />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {analyticsData.overview?.totalOrders || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Orders
              </Typography>
              <Chip
                icon={getGrowthIcon(analyticsData.overview?.growthRate || 0)}
                label={`${analyticsData.overview?.growthRate || 0}%`}
                color={getGrowthColor(analyticsData.overview?.growthRate || 0)}
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'success.light',
                color: 'success.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Payment />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                ₹{(analyticsData.overview?.totalRevenue || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Revenue
              </Typography>
              <Chip
                icon={getGrowthIcon(15.2)}
                label="15.2%"
                color="success"
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'warning.light',
                color: 'warning.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Schedule />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {analyticsData.overview?.totalUnits || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Blood Units
              </Typography>
              <Chip
                icon={getGrowthIcon(8.7)}
                label="8.7%"
                color="success"
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'info.light',
                color: 'info.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <People />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {analyticsData.overview?.averageRating || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Avg Rating
              </Typography>
              <Chip
                icon={getGrowthIcon(2.1)}
                label="2.1%"
                color="success"
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Blood Type Analytics */}
        <Grid container spacing={3} sx={{ mb: 4, maxWidth: '1400px', mx: 'auto' }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Blood Type Performance
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                        '& .MuiTableCell-head': {
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          borderBottom: `2px solid ${theme.palette.divider}`
                        }
                      }}>
                        <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Blood Type</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Orders</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Units</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Revenue (₹)</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Growth</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.bloodTypeStats?.map((stat) => (
                        <TableRow key={stat.type} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: theme.palette.primary.main 
                              }}>
                                <Bloodtype />
                              </Avatar>
                              <Typography variant="body1" fontWeight="bold">
                                {stat.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              {stat.orders}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1">
                              {stat.units}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              ₹{stat.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getGrowthIcon(stat.growth)}
                              label={`${stat.growth}%`}
                              color={getGrowthColor(stat.growth)}
                              size="small"
                              sx={{ borderRadius: 2 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Priority Distribution
                </Typography>
                {analyticsData.priorityStats?.map((stat) => (
                  <Box key={stat.priority} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={stat.priority}
                        color={getPriorityColor(stat.priority)}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {stat.orders}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: `${stat.percentage}%`,
                          height: 8,
                          bgcolor: `${getPriorityColor(stat.priority)}.main`,
                          borderRadius: 1,
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {stat.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Hospitals and Monthly Trends */}
        <Grid container spacing={3} sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Top Hospitals
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                        '& .MuiTableCell-head': {
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          borderBottom: `2px solid ${theme.palette.divider}`
                        }
                      }}>
                        <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Hospital</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Orders</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Revenue (₹)</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.topHospitals?.map((hospital) => (
                        <TableRow key={hospital.name} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {hospital.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              {hospital.orders}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              ₹{hospital.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CheckCircle color="success" fontSize="small" />
                              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                                {hospital.rating}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Monthly Trends
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                        '& .MuiTableCell-head': {
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          borderBottom: `2px solid ${theme.palette.divider}`
                        }
                      }}>
                        <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Month</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Orders</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Revenue (₹)</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Units</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.monthlyData?.map((data) => (
                        <TableRow key={data.month} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {data.month}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              {data.orders}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              ₹{data.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="bold">
                              {data.units}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <ToastContainer />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorAnalytics; 