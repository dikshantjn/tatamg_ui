import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, MenuItem, InputAdornment, IconButton, Avatar, Menu, ListItemIcon, ListItemText, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const mockProducts = [
  { id: 1, name: 'Paracetamol 500mg', price: 50, discount: 10, manufacturer: 'ABC Pharma', type: 'Tablet', packSize: '10 tablets', composition: 'Paracetamol', quantity: 100, image: '' },
  { id: 2, name: 'Cough Syrup', price: 120, discount: 5, manufacturer: 'XYZ Labs', type: 'Syrup', packSize: '100ml', composition: 'Dextromethorphan', quantity: 50, image: '' },
];

const productTypes = ['Tablet', 'Syrup', 'Capsule', 'Injection', 'Ointment', 'Drops', 'Other'];

function MedicalStoreVendorProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', discount: '', manufacturer: '', type: '', packSize: '', composition: '', quantity: '', image: null, imageUrl: ''
  });

  const handleOpenModal = () => {
    setModalOpen(true);
    setIsEditing(false);
    setForm({ name: '', price: '', discount: '', manufacturer: '', type: '', packSize: '', composition: '', quantity: '', image: null, imageUrl: '' });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setForm({ name: '', price: '', discount: '', manufacturer: '', type: '', packSize: '', composition: '', quantity: '', image: null, imageUrl: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      { ...form, id: prev.length + 1, image: form.imageUrl }
    ]);
    handleCloseModal();
  };

  const handleEditProduct = () => {
    setProducts(prev => prev.map(prod => 
      prod.id === selectedProduct.id ? { ...form, id: prod.id, image: form.imageUrl } : prod
    ));
    handleCloseModal();
  };

  const handleSaveProduct = () => {
    if (isEditing) {
      handleEditProduct();
    } else {
      handleAddProduct();
    }
  };

  const handleMenuClick = (event, product) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleView = () => {
    setViewModalOpen(true);
    handleMenuClose();
  };

  const handleEdit = () => {
    setForm({
      name: selectedProduct.name,
      price: selectedProduct.price,
      discount: selectedProduct.discount,
      manufacturer: selectedProduct.manufacturer,
      type: selectedProduct.type,
      packSize: selectedProduct.packSize,
      composition: selectedProduct.composition,
      quantity: selectedProduct.quantity,
      image: null,
      imageUrl: selectedProduct.image
    });
    setIsEditing(true);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    setProducts(prev => prev.filter(prod => prod.id !== selectedProduct.id));
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Add Product
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(139,104,255,0.08)' }}>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Pack Size</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Manufacturer</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Price (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Discount (%)</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Short Composition</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2, borderBottom: '2px solid #e0e0e0' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod.id} hover>
                <TableCell>
                  {prod.image ? <Avatar src={prod.image} alt={prod.name} /> : <Avatar>{prod.name[0]}</Avatar>}
                </TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.type}</TableCell>
                <TableCell>{prod.packSize}</TableCell>
                <TableCell>{prod.manufacturer}</TableCell>
                <TableCell>{prod.price}</TableCell>
                <TableCell>{prod.discount}</TableCell>
                <TableCell>{prod.quantity}</TableCell>
                <TableCell>{prod.composition}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, prod)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Product Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={form.imageUrl} sx={{ width: 56, height: 56 }} />
              <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                Upload Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>
            </Box>
            <TextField label="Medicine Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="Price" name="price" value={form.price} onChange={handleChange} required fullWidth type="number" InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
            <TextField label="Discount (%)" name="discount" value={form.discount} onChange={handleChange} fullWidth type="number" />
            <TextField label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} fullWidth />
            <TextField select label="Type" name="type" value={form.type} onChange={handleChange} required fullWidth>
              {productTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField label="Pack Size Label" name="packSize" value={form.packSize} onChange={handleChange} fullWidth />
            <TextField label="Short Composition" name="composition" value={form.composition} onChange={handleChange} fullWidth />
            <TextField label="Quantity" name="quantity" value={form.quantity} onChange={handleChange} required fullWidth type="number" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleSaveProduct} color="primary" variant="contained">
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Product Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar src={selectedProduct.image} sx={{ width: 80, height: 80 }} />
                <Box>
                  <Typography variant="h6">{selectedProduct.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedProduct.type}</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                  <Typography variant="body1">₹{selectedProduct.price}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Discount</Typography>
                  <Typography variant="body1">{selectedProduct.discount}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Manufacturer</Typography>
                  <Typography variant="body1">{selectedProduct.manufacturer}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Pack Size</Typography>
                  <Typography variant="body1">{selectedProduct.packSize}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                  <Typography variant="body1">{selectedProduct.quantity}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Composition</Typography>
                  <Typography variant="body1">{selectedProduct.composition}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)} color="secondary" variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MedicalStoreVendorProducts; 