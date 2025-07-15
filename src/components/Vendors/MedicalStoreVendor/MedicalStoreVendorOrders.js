import React, { useState } from 'react';
import { Tabs, Tab, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import MedicalStoreVendorProcessOrders from './MedicalStoreVendorProcessOrders';

const mockOrderRequests = [
  { id: 1, customerName: 'John Doe', date: '2024-06-01', status: 'Pending', prescription: true },
  { id: 2, customerName: 'Jane Smith', date: '2024-06-02', status: 'Accepted', prescription: true },
];

const mockOrders = [
  { id: 'ORD123', customerName: 'Alice Brown', date: '2024-06-03', status: 'Processing' },
  { id: 'ORD124', customerName: 'Bob White', date: '2024-06-04', status: 'Ready to Pickup' },
];

function MedicalStoreVendorOrders() {
  const [tab, setTab] = useState(0);
  const [processOrderOpen, setProcessOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleProcessOrder = (order) => {
    setSelectedOrder(order);
    setProcessOrderOpen(true);
  };

  const handleCloseProcessOrder = () => {
    setProcessOrderOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Orders</Typography>
      <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Order Requests" />
        <Tab label="Orders" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>View Prescription</TableCell>
                  <TableCell>Accept Prescription</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockOrderRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.customerName}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small">View</Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" disabled={req.status === 'Accepted'}>Accept</Button>
                    </TableCell>
                    <TableCell>{req.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 1 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Process Order</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" onClick={() => handleProcessOrder(order)}>
                        Process Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {processOrderOpen && (
        <MedicalStoreVendorProcessOrders open={processOrderOpen} order={selectedOrder} onClose={handleCloseProcessOrder} />
      )}
    </Box>
  );
}

export default MedicalStoreVendorOrders; 