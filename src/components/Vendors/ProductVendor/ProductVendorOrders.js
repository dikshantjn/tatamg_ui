import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CheckCircle, AccessTime, DoneAll, Phone, Close } from '@mui/icons-material';
import ProductVendorLayout from './ProductVendorLayout';

const mockOrders = [
  {
    id: 1,
    customer: 'Kapil Kalyani',
    phone: '+919370320067',
    status: 'delivered',
    amount: 6197.21,
    date: '2025-06-28T10:08:00',
    items: 1,
    details: {
      email: 'kapilkalyani@gmail.com',
      location: 'Market Yard',
      city: 'Pune',
      products: [
        { name: 'Product 12', category: 'Dental Care', qty: 1, price: 2083.35 }
      ],
      total: 4852.32
    }
  },
  {
    id: 2,
    customer: 'Kapil Kalyani',
    phone: '+919370320067',
    status: 'delivered',
    amount: 4852.32,
    date: '2025-06-28T10:22:00',
    items: 1,
    details: {
      email: 'kapilkalyani@gmail.com',
      location: 'Market Yard',
      city: 'Pune',
      products: [
        { name: 'Product 12', category: 'Dental Care', qty: 1, price: 2083.35 }
      ],
      total: 4852.32
    }
  },
  {
    id: 3,
    customer: 'Kapil Kalyani',
    phone: '+919370320067',
    status: 'delivered',
    amount: 2083.35,
    date: '2025-06-30T06:43:00',
    items: 1,
    details: {
      email: 'kapilkalyani@gmail.com',
      location: 'Market Yard',
      city: 'Pune',
      products: [
        { name: 'Product 12', category: 'Dental Care', qty: 1, price: 2083.35 }
      ],
      total: 2083.35
    }
  }
];

const statusTabs = [
  { label: 'Pending', value: 'pending', icon: <AccessTime /> },
  { label: 'Processing', value: 'processing', icon: <DoneAll /> },
  { label: 'Completed', value: 'delivered', icon: <CheckCircle /> }
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) + ' • ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const ProductVendorOrders = () => {
  const [tab, setTab] = useState('delivered');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = mockOrders.filter(o => o.status === tab);

  return (
    <ProductVendorLayout title="Orders" notificationCount={0}>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 1, sm: 2 }, width: '100%' }}>
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: '#eee',
            '& .MuiTab-root': {
              color: '#6C47FF',
              fontWeight: 600,
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: '#6C47FF',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6C47FF',
            },
          }}
          textColor="primary"
          indicatorColor="primary"
        >
          {statusTabs.map(t => (
            <Tab
              key={t.value}
              value={t.value}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  {t.icon}
                  <span style={{ fontWeight: 600 }}>{t.label}</span>
                </Stack>
              }
            />
          ))}
        </Tabs>

        {/* Order Boxes in Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
          maxWidth: 900,
          mx: 'auto',
          justifyContent: 'center',
        }}>
          {filteredOrders.map(order => (
            <Box key={order.id} sx={{
              borderRadius: 2,
              border: '1.5px solid #6C47FF',
              background: '#fff',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#F3F0FF', color: '#6C47FF', width: 44, height: 44 }}>
                  <CheckCircle />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700} fontSize={18}>{order.customer}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Phone sx={{ fontSize: 18, color: '#888' }} />
                    <Typography fontSize={15} color="#666">{order.phone}</Typography>
                  </Stack>
                  <Typography fontSize={14} color="#888" mt={0.5}>Items <b>{order.items}</b></Typography>
                  <Typography fontSize={13} color="#888">{formatDate(order.date)}</Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Box sx={{ bgcolor: '#F3F0FF', color: '#6C47FF', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 15 }}>
                    DELIVERED
                  </Box>
                  <Typography fontWeight={700} fontSize={17} color="#6C47FF">₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                </Stack>
              </Stack>
              <Button
                variant="text"
                sx={{ mt: 1, color: '#6C47FF', fontWeight: 600, textTransform: 'none', alignSelf: 'flex-end' }}
                onClick={() => setSelectedOrder(order)}
              >
                View Details
              </Button>
            </Box>
          ))}
        </Box>

        {/* Order Details Modal */}
        <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0 }}>
            Order Details
            <IconButton onClick={() => setSelectedOrder(null)} sx={{ position: 'absolute', right: 12, top: 12 }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 2 }}>
            {selectedOrder && (
              <>
                <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#F7F8FA' }}>
                  <Typography fontWeight={700} fontSize={17} mb={1}>Customer Details</Typography>
                  <Typography fontSize={15}><b>Name</b> {selectedOrder.customer}</Typography>
                  <Typography fontSize={15}><b>Phone</b> {selectedOrder.phone}</Typography>
                  <Typography fontSize={15}><b>Email</b> {selectedOrder.details.email}</Typography>
                  <Typography fontSize={15}><b>Location</b> {selectedOrder.details.location}</Typography>
                  <Typography fontSize={15}><b>City</b> {selectedOrder.details.city}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={700} fontSize={17} mb={1}>Order Items</Typography>
                {selectedOrder.details.products.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: '#F3F0FF', color: '#6C47FF', mr: 2 }}>
                      {/* No image icon */}
                      <Close />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{item.name}</Typography>
                      <Typography fontSize={14} color="#888">{item.category}</Typography>
                      <Typography fontSize={14} color="#888">Qty: {item.qty}</Typography>
                    </Box>
                    <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                      <Typography fontWeight={700} color="#6C47FF">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                    </Box>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={700} fontSize={17} mb={1}>Order Summary</Typography>
                <Typography fontSize={16} fontWeight={600} color="#6C47FF">Total Amount</Typography>
                <Typography fontSize={22} fontWeight={700} color="#6C47FF" mb={2}>₹{selectedOrder.details.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                <Divider sx={{ my: 2 }} />
                <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, fontSize: 16, borderRadius: 2 }}>
                  Download Invoice
                </Button>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedOrder(null)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProductVendorLayout>
  );
};

export default ProductVendorOrders; 