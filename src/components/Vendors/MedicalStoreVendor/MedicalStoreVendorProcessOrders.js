import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Card, CardContent, Menu, MenuItem, TextField, Divider, List, ListItem, ListItemText, IconButton, Tabs, Tab, InputAdornment } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

const mockOrderDetails = {
  orderId: 'ORD123',
  customerName: 'Alice Brown',
  date: '2024-06-03',
  status: 'Processing',
  prescription: true,
  newCartItems: [
    { id: 1, name: 'Paracetamol 500mg', qty: 2 },
    { id: 2, name: 'Cough Syrup', qty: 1 },
  ],
  pastCartItems: [
    { id: 3, name: 'Vitamin C Tablets', qty: 1 },
  ],
};

function MedicalStoreVendorProcessOrders({ open, order, onClose }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const details = order || mockOrderDetails;
  const newCartItems = details.newCartItems || [];
  const pastCartItems = details.pastCartItems || [];

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Process Order</DialogTitle>
      <DialogContent>
        {/* Order Details Card */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2">Order ID: {details.orderId}</Typography>
                <Typography variant="body2">Customer: {details.customerName}</Typography>
                <Typography variant="body2">Date: {details.date}</Typography>
                <Typography variant="body2">Status: {details.status}</Typography>
              </Box>
              <Box>
                <Button variant="outlined" size="small" sx={{ mr: 1 }}>View Prescription</Button>
                <Button variant="contained" size="small" sx={{ mr: 1 }}>Confirm Order</Button>
                <IconButton onClick={handleMenuOpen} size="small">
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleMenuClose}>Ready to Pickup</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Out for Delivery</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Delivered</MenuItem>
                </Menu>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* Search Box - Centered with Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <TextField
            label="Search Medicines"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ maxWidth: 400, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* Search Suggestions - Centered */}
        {search && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ mb: 2, border: '1px solid #eee', borderRadius: 1, maxHeight: 160, overflowY: 'auto', maxWidth: 400, width: '100%' }}>
              {['Paracetamol 500mg', 'Cough Syrup', 'Vitamin C Tablets', 'Ibuprofen', 'Amoxicillin']
                .filter(med => med.toLowerCase().includes(search.toLowerCase()))
                .map((med, idx) => (
                  <ListItem button key={idx} onClick={() => setSearch(med)}>
                    <ListItemText primary={med} />
                  </ListItem>
                ))}
              {/* Show 'No results' if nothing matches */}
              {['Paracetamol 500mg', 'Cough Syrup', 'Vitamin C Tablets', 'Ibuprofen', 'Amoxicillin']
                .filter(med => med.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                  <ListItem><ListItemText primary="No suggestions found" /></ListItem>
              )}
            </List>
          </Box>
        )}
        {/* Tabs for New and Past Cart Items */}
        <Box sx={{ mt: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            sx={{ gap: 4, justifyContent: 'center', '& .MuiTab-root': { mx: 2 } }}
          >
            <Tab label="New Cart Items" />
            <Tab label="Past Cart Items" />
          </Tabs>
          {tab === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>New Cart Items</Typography>
              <List dense>
                {newCartItems.map(item => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} secondary={`Qty: ${item.qty}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {tab === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Past Cart Items</Typography>
              <List dense>
                {pastCartItems.map(item => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} secondary={`Qty: ${item.qty}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" fullWidth onClick={onClose}>
          Add to User Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MedicalStoreVendorProcessOrders; 