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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  BarChart,
  Download,
  Inventory,
  TrendingUp,
  Warning,
  ShoppingCart,
  Star,
  FilterList,
  Search,
  ExpandMore,
  Receipt,
  Payment,
  LocalShipping,
  Cancel,
  LocationOn,
  Assessment,
  FileDownload,
  CalendarToday,
  AttachMoney,
  Timeline,
  CheckCircle
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import MedicalStoreVendorLayout from './MedicalStoreVendorLayout';

// Mock data for reports
const mockOrderData = [
  { id: 1, orderId: 'ORD-2024-001', customer: 'John Doe', amount: 1250, status: 'Delivered', mode: 'Online', date: '2024-01-15' },
  { id: 2, orderId: 'ORD-2024-002', customer: 'Jane Smith', amount: 890, status: 'Dispatched', mode: 'Prescription', date: '2024-01-15' },
  { id: 3, orderId: 'ORD-2024-003', customer: 'Mike Johnson', amount: 2100, status: 'Cancelled', mode: 'Online', date: '2024-01-14' },
  { id: 4, orderId: 'ORD-2024-004', customer: 'Sarah Wilson', amount: 750, status: 'Delivered', mode: 'Prescription', date: '2024-01-14' },
  { id: 5, orderId: 'ORD-2024-005', customer: 'David Brown', amount: 1800, status: 'Accepted', mode: 'Online', date: '2024-01-13' },
];

const mockFinanceData = [
  { month: 'Jan', revenue: 45000, orders: 45, avgOrder: 1000 },
  { month: 'Feb', revenue: 52000, orders: 52, avgOrder: 1000 },
  { month: 'Mar', revenue: 48000, orders: 48, avgOrder: 1000 },
  { month: 'Apr', revenue: 61000, orders: 61, avgOrder: 1000 },
  { month: 'May', revenue: 58000, orders: 58, avgOrder: 1000 },
  { month: 'Jun', revenue: 72000, orders: 72, avgOrder: 1000 },
];

const mockReturnData = [
  { id: 1, orderId: 'ORD-2024-001', reason: 'Wrong Medicine', status: 'Approved', amount: 1250, resolutionTime: '2 days' },
  { id: 2, orderId: 'ORD-2024-002', reason: 'Damaged Package', status: 'Approved', amount: 890, resolutionTime: '1 day' },
  { id: 3, orderId: 'ORD-2024-003', reason: 'Not Required', status: 'Rejected', amount: 2100, resolutionTime: '3 days' },
];

const mockInventoryData = [
  { name: 'Paracetamol 500mg', stock: 150, sold: 45, status: 'In Stock' },
  { name: 'Vitamin C 1000mg', stock: 0, sold: 32, status: 'Out of Stock' },
  { name: 'Omeprazole 20mg', stock: 75, sold: 28, status: 'Low Stock' },
  { name: 'Cough Syrup', stock: 200, sold: 15, status: 'Overstocked' },
];

const mockGeoData = [
  { area: 'Mumbai Central', orders: 45, revenue: 67500, avgOrder: 1500 },
  { area: 'Andheri West', orders: 32, revenue: 48000, avgOrder: 1500 },
  { area: 'Bandra East', orders: 28, revenue: 42000, avgOrder: 1500 },
  { area: 'Juhu', orders: 22, revenue: 33000, avgOrder: 1500 },
];

const MedicalStoreVendorReportsContent = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dateRange, setDateRange] = useState('this_week');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'success';
      case 'Dispatched': return 'primary';
      case 'Accepted': return 'info';
      case 'Cancelled': return 'error';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'In Stock': return 'success';
      case 'Out of Stock': return 'error';
      case 'Low Stock': return 'warning';
      case 'Overstocked': return 'info';
      default: return 'default';
    }
  };

  const getModeColor = (mode) => {
    return mode === 'Online' ? 'primary' : 'secondary';
  };

  const tabLabels = ['Order Reports', 'Finance Reports', 'Return Reports', 'Inventory Reports', 'Geo Reports'];

  return (
    <MedicalStoreVendorLayout title="Reports & Analytics">
      <Box sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} mb={1} color={theme.palette.text.primary}>
            Reports & Analytics
          </Typography>
          <Typography variant="body1" mb={3} color={theme.palette.text.secondary}>
            Comprehensive reports for record-keeping, transactions, and audit-friendly summaries
          </Typography>

          {/* Filters and Export */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={handleDateRangeChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarToday fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="this_week">This Week</MenuItem>
                  <MenuItem value="this_month">This Month</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  startIcon={<FileDownload />}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Export PDF
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<FileDownload />}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Export CSV
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<FileDownload />}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Export Excel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 'auto',
                px: 2
              }
            }}
          >
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Order Reports */}
          {activeTab === 0 && (
            <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
              {/* Summary Cards */}
              <Grid container spacing={2} sx={{ width: '100%', m: 0, mb: 3 }}>
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h4" fontWeight={700} color="primary.main">156</Typography>
                      <Typography variant="body2" color="text.secondary">Total Orders Received</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                      <Typography variant="h4" fontWeight={700} color="success.main">142</Typography>
                      <Typography variant="body2" color="text.secondary">Orders Accepted</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Cancel sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
                      <Typography variant="h4" fontWeight={700} color="error.main">8</Typography>
                      <Typography variant="body2" color="text.secondary">Orders Cancelled</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <LocalShipping sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                      <Typography variant="h4" fontWeight={700} color="info.main">138</Typography>
                      <Typography variant="body2" color="text.secondary">Orders Delivered</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* Orders Table */}
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Recent Orders
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<FileDownload />} 
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Download
                    </Button>
                  </Box>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Mode</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockOrderData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.orderId}</TableCell>
                            <TableCell>{row.customer}</TableCell>
                            <TableCell>₹{row.amount}</TableCell>
                            <TableCell>
                              <Chip 
                                label={row.status} 
                                color={getStatusColor(row.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={row.mode} 
                                color={getModeColor(row.mode)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{row.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                      count={Math.ceil(mockOrderData.length / rowsPerPage)} 
                      page={page} 
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Finance Reports */}
          {activeTab === 1 && (
            <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
              {/* Revenue Chart */}
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%', mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Revenue Overview
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<FileDownload />} 
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Download
                    </Button>
                  </Box>
                  <Box sx={{ height: { xs: 300, md: 420 }, minWidth: { md: 320 }, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockFinanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.25}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.02}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="month" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }}
                          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} strokeWidth={3} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
              {/* Finance Summary */}
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    Financial Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={500}>Total Revenue</Typography>
                      <Typography variant="h6" fontWeight={600} color="primary.main">₹3,36,000</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={500}>GST Collected</Typography>
                      <Typography variant="h6" fontWeight={600} color="success.main">₹60,480</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={500}>Delivery Charges</Typography>
                      <Typography variant="h6" fontWeight={600} color="info.main">₹15,600</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={500}>Refunds</Typography>
                      <Typography variant="h6" fontWeight={600} color="warning.main">₹8,900</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Return Reports */}
          {activeTab === 2 && (
            <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Return & Refund Analysis
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<FileDownload />} 
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Download
                    </Button>
                  </Box>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Resolution Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockReturnData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.orderId}</TableCell>
                            <TableCell>{row.reason}</TableCell>
                            <TableCell>
                              <Chip 
                                label={row.status} 
                                color={getStatusColor(row.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>₹{row.amount}</TableCell>
                            <TableCell>{row.resolutionTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Inventory Reports */}
          {activeTab === 3 && (
            <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Inventory Status
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<FileDownload />} 
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Download
                    </Button>
                  </Box>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Current Stock</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Sold This Month</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockInventoryData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.stock}</TableCell>
                            <TableCell>{row.sold}</TableCell>
                            <TableCell>
                              <Chip 
                                label={row.status} 
                                color={getStatusColor(row.status)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Geo Reports */}
          {activeTab === 4 && (
            <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
              {/* Orders by Location Chart */}
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%', mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Orders by Location
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<FileDownload />} 
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Download
                    </Button>
                  </Box>
                  <Box sx={{ height: { xs: 300, md: 420 }, minWidth: { md: 320 }, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={mockGeoData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="area" tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }}
                          formatter={(value, name) => [value, name === 'orders' ? 'Orders' : 'Revenue']}
                        />
                        <Bar dataKey="orders" fill="url(#colorOrders)" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
              {/* Top Areas Summary */}
              <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    Top Areas
                  </Typography>
                  <Stack spacing={2}>
                    {mockGeoData.map((area, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{area.area}</Typography>
                          <Typography variant="caption" color="text.secondary">{area.orders} orders</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} color="primary.main">
                          ₹{(area.revenue / 1000).toFixed(0)}K
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </MedicalStoreVendorLayout>
  );
};

const MedicalStoreVendorReports = () => (
  <VendorThemeProvider>
    <MedicalStoreVendorReportsContent />
  </VendorThemeProvider>
);

export default MedicalStoreVendorReports; 