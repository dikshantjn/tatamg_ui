import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';

const mockReturnOrders = [
  {
    id: 'RET001',
    orderId: 'ORD123',
    customerName: 'John Doe',
    returnDate: '2024-06-01',
    returnReason: 'Wrong medicine received',
    productDetails: 'Paracetamol 500mg - 10 tablets',
    status: 'Pending',
    amount: 150,
    contactNumber: '+91 9876543210',
    email: 'john.doe@email.com'
  },
  {
    id: 'RET002',
    orderId: 'ORD124',
    customerName: 'Jane Smith',
    returnDate: '2024-06-02',
    returnReason: 'Expired medicine',
    productDetails: 'Cough Syrup - 100ml',
    status: 'Approved',
    amount: 200,
    contactNumber: '+91 9876543211',
    email: 'jane.smith@email.com'
  },
  {
    id: 'RET003',
    orderId: 'ORD125',
    customerName: 'Mike Johnson',
    returnDate: '2024-06-03',
    returnReason: 'Damaged packaging',
    productDetails: 'Vitamin C Tablets - 30 tablets',
    status: 'Rejected',
    amount: 300,
    contactNumber: '+91 9876543212',
    email: 'mike.johnson@email.com'
  }
];

const statusColors = {
  'Pending': 'warning',
  'Approved': 'success',
  'Rejected': 'error'
};

function MedicalStoreVendorReturns() {
  const [returns, setReturns] = useState(mockReturnOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (returnOrder) => {
    setSelectedReturn(returnOrder);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedReturn(null);
  };

  const handleStatusChange = (returnId, newStatus) => {
    setReturns(prev => prev.map(ret => 
      ret.id === returnId ? { ...ret, status: newStatus } : ret
    ));
  };

  const filteredReturns = returns.filter(ret =>
    ret.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Return Orders</Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Returns"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ maxWidth: 400, width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Returns Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(139,104,255,0.08)' }}>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Return Reason</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Product Details</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Amount (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReturns.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell>{ret.orderId}</TableCell>
                <TableCell>{ret.customerName}</TableCell>
                <TableCell>{ret.returnDate}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ret.returnReason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ret.productDetails}
                  </Typography>
                </TableCell>
                <TableCell>{ret.amount}</TableCell>
                <TableCell>
                  <Chip 
                    label={ret.status} 
                    color={statusColors[ret.status]} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(ret)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {ret.status === 'Pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => handleStatusChange(ret.id, 'Approved')}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleStatusChange(ret.id, 'Rejected')}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Return Details Modal */}
      <Dialog open={detailModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Return Order Details</DialogTitle>
        <DialogContent>
          {selectedReturn && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Order Information</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Return ID:</strong> {selectedReturn.id}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Order ID:</strong> {selectedReturn.orderId}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Return Date:</strong> {selectedReturn.returnDate}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Amount:</strong> ₹{selectedReturn.amount}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Status:</strong> 
                  <Chip 
                    label={selectedReturn.status} 
                    color={statusColors[selectedReturn.status]} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Customer Information</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Name:</strong> {selectedReturn.customerName}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Contact:</strong> {selectedReturn.contactNumber}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Email:</strong> {selectedReturn.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Product Details</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Product:</strong> {selectedReturn.productDetails}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Return Reason:</strong> {selectedReturn.returnReason}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" variant="outlined">Close</Button>
          {selectedReturn?.status === 'Pending' && (
            <>
              <Button 
                onClick={() => {
                  handleStatusChange(selectedReturn.id, 'Approved');
                  handleCloseModal();
                }} 
                color="success" 
                variant="contained"
              >
                Approve Return
              </Button>
              <Button 
                onClick={() => {
                  handleStatusChange(selectedReturn.id, 'Rejected');
                  handleCloseModal();
                }} 
                color="error" 
                variant="contained"
              >
                Reject Return
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MedicalStoreVendorReturns; 