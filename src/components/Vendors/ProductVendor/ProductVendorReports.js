import React from 'react';
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
  Divider
} from '@mui/material';
import { BarChart, Download, Inventory, TrendingUp, Warning, ShoppingCart, Star } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import ProductVendorLayout from './ProductVendorLayout';

const mockStats = [
  { label: 'Total Sales', value: '₹2,45,000', icon: <TrendingUp />, color: '#6C47FF', bg: '#F3F0FF' },
  { label: 'Total Orders', value: '1,230', icon: <ShoppingCart />, color: '#10B981', bg: '#E6FAF5' },
  { label: 'Low Stock Items', value: '8', icon: <Warning />, color: '#F59E0B', bg: '#FFF7E6' },
  { label: 'Out of Stock', value: '3', icon: <Inventory />, color: '#EF4444', bg: '#FEECEC' },
];

const mockTopProducts = [
  { name: 'Paracetamol 500mg', sales: 320, revenue: 18000 },
  { name: 'Vitamin C 1000mg', sales: 210, revenue: 12500 },
  { name: 'Omeprazole 20mg', sales: 180, revenue: 9800 },
];

const mockRevenueData = [
  { month: 'Jan', revenue: 18000 },
  { month: 'Feb', revenue: 22000 },
  { month: 'Mar', revenue: 19500 },
  { month: 'Apr', revenue: 25000 },
  { month: 'May', revenue: 27000 },
  { month: 'Jun', revenue: 32000 },
  { month: 'Jul', revenue: 30000 },
  { month: 'Aug', revenue: 34000 },
  { month: 'Sep', revenue: 31000 },
  { month: 'Oct', revenue: 35500 },
  { month: 'Nov', revenue: 37000 },
  { month: 'Dec', revenue: 40000 },
];

const ProductVendorReportsContent = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ProductVendorLayout title="Reports & Analytics">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 3 } }}>
        <Typography variant="h4" fontWeight={700} mb={2} color={theme.palette.text.primary}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" mb={4} color={theme.palette.text.secondary}>
          Get insights into your sales, inventory, and product performance. Download detailed reports for your records or further analysis.
        </Typography>

        {/* Stats Summary */}
        <Grid container spacing={3} mb={4} justifyContent="center">
          {mockStats.map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                p: 2
              }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  mr: 2
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} color={theme.palette.text.primary}>{stat.value}</Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>{stat.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Revenue Chart */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, background: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color={theme.palette.text.primary}>
              Revenue Overview
            </Typography>
            <Box sx={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" tick={{ fill: theme.palette.text.secondary, fontSize: 13 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 13 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, color: theme.palette.text.primary }}
                    labelStyle={{ color: theme.palette.text.secondary }}
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} strokeWidth={3} fill="url(#colorRev)" dot={{ r: 4, fill: theme.palette.primary.main }} activeDot={{ r: 6, stroke: theme.palette.primary.main, fill: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Top Products Table */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, background: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color={theme.palette.text.primary}>
              Top Selling Products
            </Typography>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" sx={{ textAlign: 'left', py: 1, color: theme.palette.text.secondary, fontWeight: 600 }}>Product</Box>
                  <Box component="th" sx={{ textAlign: 'right', py: 1, color: theme.palette.text.secondary, fontWeight: 600 }}>Units Sold</Box>
                  <Box component="th" sx={{ textAlign: 'right', py: 1, color: theme.palette.text.secondary, fontWeight: 600 }}>Revenue</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {mockTopProducts.map((prod, idx) => (
                  <Box component="tr" key={idx} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box component="td" sx={{ py: 1, color: theme.palette.text.primary, fontWeight: 500 }}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Star sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                        {prod.name}
                      </Stack>
                    </Box>
                    <Box component="td" sx={{ py: 1, textAlign: 'right', color: theme.palette.text.secondary }}>{prod.sales}</Box>
                    <Box component="td" sx={{ py: 1, textAlign: 'right', color: theme.palette.text.secondary }}>₹{prod.revenue.toLocaleString('en-IN')}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Download/Export Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
          <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2, fontWeight: 600 }}>
            Download PDF
          </Button>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2, fontWeight: 600 }}>
            Export CSV
          </Button>
        </Stack>
      </Box>
    </ProductVendorLayout>
  );
};

const ProductVendorReports = () => (
  <VendorThemeProvider>
    <ProductVendorReportsContent />
  </VendorThemeProvider>
);

export default ProductVendorReports; 