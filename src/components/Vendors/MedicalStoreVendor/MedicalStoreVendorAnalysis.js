import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Alert,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Inventory,
  LocationOn,
  Timer,
  Star,
  Psychology,
  Analytics,
  CompareArrows,
  Schedule,
  Assessment,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Speed,
  People,
  LocalShipping,
  BarChart,
  PieChart,
  Timeline,
  CalendarToday,
  FilterList,
  Download,
  Refresh
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import MedicalStoreVendorLayout from './MedicalStoreVendorLayout';

// Mock data for analysis
const mockOrderTrendsData = [
  { time: '00:00', orders: 2, hour: '12 AM' },
  { time: '03:00', orders: 1, hour: '3 AM' },
  { time: '06:00', orders: 3, hour: '6 AM' },
  { time: '09:00', orders: 8, hour: '9 AM' },
  { time: '12:00', orders: 15, hour: '12 PM' },
  { time: '15:00', orders: 12, hour: '3 PM' },
  { time: '18:00', orders: 18, hour: '6 PM' },
  { time: '21:00', orders: 10, hour: '9 PM' },
];

const mockWeeklyGrowthData = [
  { week: 'Week 1', current: 45, previous: 38, growth: '+18%' },
  { week: 'Week 2', current: 52, previous: 42, growth: '+24%' },
  { week: 'Week 3', current: 48, previous: 45, growth: '+7%' },
  { week: 'Week 4', current: 61, previous: 52, growth: '+17%' },
];

const mockTopMedicinesData = [
  { name: 'Paracetamol 500mg', orders: 156, revenue: 23400, growth: '+12%' },
  { name: 'Vitamin C 1000mg', orders: 134, revenue: 20100, growth: '+8%' },
  { name: 'Omeprazole 20mg', orders: 98, revenue: 14700, growth: '+15%' },
  { name: 'Cough Syrup', orders: 87, revenue: 13050, growth: '+5%' },
  { name: 'First Aid Kit', orders: 76, revenue: 11400, growth: '+22%' },
  { name: 'Antibiotics', orders: 65, revenue: 9750, growth: '+3%' },
  { name: 'Pain Relief Gel', orders: 54, revenue: 8100, growth: '+18%' },
  { name: 'Multivitamin', orders: 43, revenue: 6450, growth: '+11%' },
  { name: 'Antiseptic', orders: 32, revenue: 4800, growth: '+7%' },
  { name: 'Bandages', orders: 21, revenue: 3150, growth: '+14%' },
];

const mockRejectedMedicinesData = [
  { name: 'Insulin', count: 12, percentage: 35, color: '#FF6B6B' },
  { name: 'Chemotherapy Drugs', count: 8, percentage: 25, color: '#4ECDC4' },
  { name: 'Psychiatric Medicines', count: 6, percentage: 20, color: '#45B7D1' },
  { name: 'Controlled Substances', count: 4, percentage: 15, color: '#96CEB4' },
  { name: 'Experimental Drugs', count: 2, percentage: 5, color: '#FFEAA7' },
];

const mockLocationData = [
  { area: 'Mumbai Central', orders: 156, revenue: 234000, growth: '+15%', demand: 'High' },
  { area: 'Andheri West', orders: 134, revenue: 201000, growth: '+12%', demand: 'High' },
  { area: 'Bandra East', orders: 98, revenue: 147000, growth: '+8%', demand: 'Medium' },
  { area: 'Juhu', orders: 87, revenue: 130500, growth: '+5%', demand: 'Medium' },
  { area: 'Worli', orders: 76, revenue: 114000, growth: '+18%', demand: 'High' },
  { area: 'Colaba', orders: 65, revenue: 97500, growth: '+3%', demand: 'Low' },
];

const mockOperationalData = [
  { metric: 'Avg. Order Fulfillment Time', value: '2.5 hours', target: '2 hours', status: 'warning' },
  { metric: 'Avg. Response Time', value: '8 minutes', target: '5 minutes', status: 'warning' },
  { metric: 'Orders Accepted', value: '92%', target: '95%', status: 'success' },
  { metric: 'Orders Rejected', value: '8%', target: '5%', status: 'error' },
];

const mockAISuggestions = [
  {
    type: 'inventory',
    title: 'Inventory Alert',
    message: 'Paracetamol 500mg is frequently ordered but running low on stock. Consider increasing inventory levels.',
    icon: <Inventory />,
    priority: 'high',
    action: 'Restock Now',
    severity: 'critical'
  },
  {
    type: 'timing',
    title: 'Peak Hours Optimization',
    message: 'Orders peak at 6-9 PM. Consider keeping extra staff ready during these hours for better service.',
    icon: <Schedule />,
    priority: 'medium',
    action: 'Schedule Staff',
    severity: 'moderate'
  },
  {
    type: 'returns',
    title: 'Quality Control Alert',
    message: 'Higher return rate for Vitamin C tablets. Check quality and supplier standards immediately.',
    icon: <Cancel />,
    priority: 'high',
    action: 'Check Quality',
    severity: 'critical'
  },
  {
    type: 'location',
    title: 'Expansion Opportunity',
    message: 'High demand in Andheri West area. Consider expanding delivery coverage to capture more orders.',
    icon: <LocationOn />,
    priority: 'medium',
    action: 'Expand Coverage',
    severity: 'opportunity'
  },
  {
    type: 'pricing',
    title: 'Pricing Optimization',
    message: 'Antibiotics pricing is below market average. Consider price adjustment for better margins.',
    icon: <TrendingUp />,
    priority: 'low',
    action: 'Review Pricing',
    severity: 'opportunity'
  },
  {
    type: 'customer',
    title: 'Customer Retention',
    message: 'Customer retention rate has improved by 15%. Continue current engagement strategies.',
    icon: <People />,
    priority: 'low',
    action: 'Maintain Strategy',
    severity: 'positive'
  }
];

const mockCustomerQualityData = [
  { metric: 'Average Rating', value: '4.2/5', trend: '+0.3', status: 'success' },
  { metric: 'Reorder Rate', value: '68%', trend: '+5%', status: 'success' },
  { metric: 'Fulfillment Accuracy', value: '94%', trend: '+2%', status: 'success' },
  { metric: 'Customer Satisfaction', value: '87%', trend: '+3%', status: 'success' },
];

const MedicalStoreVendorAnalysisContent = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [timeFilter, setTimeFilter] = useState('week');
  const [compareMode, setCompareMode] = useState(false);

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return { bg: '#FFE6E6', border: '#FF4444', text: '#D32F2F' };
      case 'moderate': return { bg: '#FFF3E0', border: '#FF9800', text: '#F57C00' };
      case 'opportunity': return { bg: '#E8F5E8', border: '#4CAF50', text: '#2E7D32' };
      case 'positive': return { bg: '#E3F2FD', border: '#2196F3', text: '#1976D2' };
      default: return { bg: '#F5F5F5', border: '#9E9E9E', text: '#616161' };
    }
  };

  // Enhanced color schemes for charts
  const chartColors = {
    primary: ['#1976D2', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB'],
    secondary: ['#F50057', '#FF5983', '#FF7BA3', '#FF9CC3', '#FFBDE3'],
    success: ['#388E3C', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C8'],
    warning: ['#F57C00', '#FFB74D', '#FFCC02', '#FFD54F', '#FFE082'],
    info: ['#1976D2', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB'],
  };

  return (
    <MedicalStoreVendorLayout title="Analysis & Insights">
      <Box sx={{ 
        width: '100%', 
        maxWidth: '100%', 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        {/* Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1} color={theme.palette.text.primary}>
            📊 Analysis & Insights
          </Typography>
          <Typography variant="body1" mb={3} color={theme.palette.text.secondary}>
            Advanced analytics and AI-powered insights to optimize your medical store performance
          </Typography>

          {/* Filters */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={timeFilter}
                  label="Time Period"
                  onChange={handleTimeFilterChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarToday fontSize="small" />
                    </InputAdornment>
                  }
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="day">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant={compareMode ? "contained" : "outlined"}
                startIcon={<CompareArrows />}
                onClick={() => setCompareMode(!compareMode)}
                sx={{ borderRadius: 2, fontWeight: 600, height: 40 }}
                fullWidth
              >
                Compare Periods
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                sx={{ borderRadius: 2, fontWeight: 600, height: 40 }}
                fullWidth
              >
                Export Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                sx={{ borderRadius: 2, fontWeight: 600, height: 40 }}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 1. Order Trends */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color={theme.palette.text.primary} sx={{ pl: 1 }}>
            📈 Order Trends
          </Typography>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 'none', 
            border: `1px solid ${theme.palette.divider}`,
            width: '100%',
            mb: 3
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Hourly Order Pattern
                </Typography>
                <Chip label="Last 24 Hours" color="primary" size="small" />
              </Box>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockOrderTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.9}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.3} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <RechartsTooltip
                      contentStyle={{ 
                        background: theme.palette.background.paper, 
                        border: `1px solid ${theme.palette.divider}`, 
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value, 'Orders']}
                    />
                    <Bar dataKey="orders" fill="url(#colorOrders)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 'none', 
            border: `1px solid ${theme.palette.divider}`,
            width: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Weekly Growth Trends
              </Typography>
              <Grid container spacing={2}>
                {mockWeeklyGrowthData.map((week, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2.5, 
                        backgroundColor: isDarkMode ? 'grey.800' : 'grey.50', 
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>{week.week}</Typography>
                        <Chip 
                          label={week.growth} 
                          color={week.growth.includes('+') ? 'success' : 'error'} 
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                          {week.current}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          vs {week.previous}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* 2. Top Medicines Analytics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color={theme.palette.text.primary} sx={{ pl: 1 }}>
            💊 Top Medicines Analytics
          </Typography>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 'none', 
            border: `1px solid ${theme.palette.divider}`,
            width: '100%',
            mb: 3
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Top 10 Most Ordered Medicines
                </Typography>
                <Chip label="This Month" color="secondary" size="small" />
              </Box>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockTopMedicinesData.slice(0, 10)} layout="horizontal" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.9}/>
                        <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.3} />
                    <XAxis 
                      type="number" 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 11, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                      width={130} 
                    />
                    <RechartsTooltip
                      contentStyle={{ 
                        background: theme.palette.background.paper, 
                        border: `1px solid ${theme.palette.divider}`, 
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value, name) => [value, name === 'orders' ? 'Orders' : 'Revenue']}
                    />
                    <Bar dataKey="orders" fill="url(#colorRevenue)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 'none', 
            border: `1px solid ${theme.palette.divider}`,
            width: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Frequently Rejected Medicines
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={mockRejectedMedicinesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="count"
                        >
                          {mockRejectedMedicinesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ 
                            background: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 12,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value) => [`${value} rejections`]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    {mockRejectedMedicinesData.map((item, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'grey.800' : 'grey.50',
                        border: `1px solid ${theme.palette.divider}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              backgroundColor: item.color,
                              mr: 2 
                            }} 
                          />
                          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                          {item.count}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* 3. Location Insights */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color={theme.palette.text.primary} sx={{ pl: 1 }}>
            📍 Location Insights
          </Typography>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 'none', 
            border: `1px solid ${theme.palette.divider}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Area-wise Demand Analysis
                </Typography>
                <Chip label="High Demand Zones" color="success" size="small" />
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ backgroundColor: isDarkMode ? 'grey.800' : 'grey.50' }}>
                      <Box component="th" sx={{ textAlign: 'left', py: 2, px: 2, color: theme.palette.text.secondary, fontWeight: 600, borderRadius: '8px 0 0 8px' }}>Area</Box>
                      <Box component="th" sx={{ textAlign: 'right', py: 2, px: 2, color: theme.palette.text.secondary, fontWeight: 600 }}>Orders</Box>
                      <Box component="th" sx={{ textAlign: 'right', py: 2, px: 2, color: theme.palette.text.secondary, fontWeight: 600 }}>Revenue</Box>
                      <Box component="th" sx={{ textAlign: 'center', py: 2, px: 2, color: theme.palette.text.secondary, fontWeight: 600 }}>Growth</Box>
                      <Box component="th" sx={{ textAlign: 'center', py: 2, px: 2, color: theme.palette.text.secondary, fontWeight: 600, borderRadius: '0 8px 8px 0' }}>Demand</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {mockLocationData.map((area, index) => (
                      <Box component="tr" key={index} sx={{ 
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:hover': { backgroundColor: isDarkMode ? 'grey.900' : 'grey.25' }
                      }}>
                        <Box component="td" sx={{ py: 2, px: 2, color: theme.palette.text.primary, fontWeight: 500 }}>
                          {area.area}
                        </Box>
                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', color: theme.palette.text.secondary, fontWeight: 500 }}>
                          {area.orders}
                        </Box>
                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', color: theme.palette.text.secondary, fontWeight: 500 }}>
                          ₹{(area.revenue / 1000).toFixed(0)}K
                        </Box>
                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'center' }}>
                          <Chip 
                            label={area.growth} 
                            color={area.growth.includes('+') ? 'success' : 'error'} 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'center' }}>
                          <Chip 
                            label={area.demand} 
                            color={getStatusColor(area.demand.toLowerCase())} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 4. Operational Metrics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color={theme.palette.text.primary} sx={{ pl: 1 }}>
            ⏱️ Operational Metrics
          </Typography>
          <Grid container spacing={3}>
            {mockOperationalData.map((metric, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 'none', 
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        backgroundColor: `${getStatusColor(metric.status)}.light`,
                        color: `${getStatusColor(metric.status)}.main`,
                        mr: 2
                      }}>
                        <Timer />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          Target: {metric.target}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" fontWeight={700} color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                      {metric.metric}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.status === 'success' ? 90 : metric.status === 'warning' ? 70 : 50}
                      color={getStatusColor(metric.status)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>



        {/* 5. Customer Interaction Quality */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color={theme.palette.text.primary} sx={{ pl: 1 }}>
            ⭐ Customer Interaction Quality
          </Typography>
          <Grid container spacing={3}>
            {mockCustomerQualityData.map((metric, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 'none', 
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        backgroundColor: 'success.light',
                        color: 'success.main',
                        mr: 2
                      }}>
                        <Star />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="success.main" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {metric.trend}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" fontWeight={700} color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {metric.metric}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </MedicalStoreVendorLayout>
  );
};

const MedicalStoreVendorAnalysis = () => (
  <VendorThemeProvider>
    <MedicalStoreVendorAnalysisContent />
  </VendorThemeProvider>
);

export default MedicalStoreVendorAnalysis; 