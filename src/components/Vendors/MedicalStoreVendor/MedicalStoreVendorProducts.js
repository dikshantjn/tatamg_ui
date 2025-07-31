import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, MenuItem, InputAdornment, IconButton, Avatar, Menu, ListItemIcon, ListItemText, Grid, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getVendorProducts, deleteProduct, addProduct, updateProduct } from '../../../services/Vendors/MedicalStoreVendor.service';
import { Toast, ToastContainer } from '../../ui/Toast';

const productTypes = ['Tablet', 'Syrup', 'Capsule', 'Injection', 'Ointment', 'Drops', 'Other'];
const productCategories = ['Fever', 'Pain', 'Cough', 'Allergy', 'Diabetes', 'Heart', 'General', 'Other'];

function MedicalStoreVendorProducts() {
  // TODO: Replace with actual vendorId from auth context or props
  const vendorId = 'c29e0298-b239-48df-9f11-4e21c8727f93';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', discount: '', manufacturer: '', type: '', packSize: '', composition: '', quantity: '', category: '', image: null, imageUrl: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getVendorProducts(vendorId);
        setProducts(response || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [vendorId]);

  const handleOpenModal = () => {
    setModalOpen(true);
    setIsEditing(false);
    setForm({ name: '', price: '', discount: '', manufacturer: '', type: '', packSize: '', composition: '', quantity: '', category: '', image: null, imageUrl: '' });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setForm({ name: '', price: '', discount: '', manufacturer: '', type: '', packSize: '', composition: '', quantity: '', category: '', image: null, imageUrl: '' });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Handle number inputs properly
    const finalValue = type === 'number' ? (value === '' ? '' : value) : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.type || !form.quantity) {
      addToast('error', 'Error', 'Please fill in all required fields.');
      return;
    }

    setAddingProduct(true);
    try {
      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        discount: parseInt(form.discount) || 0,
        manufacturer: form.manufacturer,
        type: form.type,
        packSizeLabel: form.packSize,
        shortComposition: form.composition,
        productURLs: form.imageUrl ? [form.imageUrl] : [],
        category: form.category,
        quantity: parseInt(form.quantity)
      };

      const response = await addProduct(vendorId, productData);
      
      // Add the new product to local state
      setProducts(prev => [...prev, response.product]);
      
      // Show success toast
      addToast('success', 'Success', `${form.name} added successfully!`);
      
      // Close modal and reset form
      handleCloseModal();
    } catch (error) {
      console.error('Error adding product:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to add product. Please try again.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleEditProduct = async () => {
    if (!form.name || !form.price || !form.type || !form.quantity) {
      addToast('error', 'Error', 'Please fill in all required fields.');
      return;
    }

    setUpdatingProduct(true);
    try {
      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        discount: parseInt(form.discount) || 0,
        manufacturer: form.manufacturer,
        type: form.type,
        packSizeLabel: form.packSize,
        shortComposition: form.composition,
        productURLs: form.imageUrl ? [form.imageUrl] : [],
        category: form.category,
        quantity: parseInt(form.quantity)
      };

      const response = await updateProduct(selectedProduct.productId, productData);
      
      // Update the product in local state
      setProducts(prev => prev.map(prod => 
        prod.productId === selectedProduct.productId ? response.product : prod
      ));
      
      // Show success toast
      addToast('success', 'Success', `${form.name} updated successfully!`);
      
      // Close modal and reset form
      handleCloseModal();
    } catch (error) {
      console.error('Error updating product:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to update product. Please try again.');
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleSaveProduct = async () => {
    if (isEditing) {
      await handleEditProduct();
    } else {
      await handleAddProduct();
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
      packSize: selectedProduct.packSizeLabel,
      composition: selectedProduct.shortComposition,
      quantity: selectedProduct.inventory?.quantity || selectedProduct.quantity,
      category: selectedProduct.inventory?.category || '',
      image: null,
      imageUrl: selectedProduct.productURLs && selectedProduct.productURLs.length > 0 ? selectedProduct.productURLs[0] : ''
    });
    setIsEditing(true);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    setDeletingProduct(true);
    try {
      await deleteProduct(selectedProduct.productId);
      
      // Remove the product from local state
      setProducts(prev => prev.filter(prod => prod.productId !== selectedProduct.productId));
      
      // Show success toast
      addToast('success', 'Success', `${selectedProduct.name} deleted successfully!`);
      
      // Close dialog and reset
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Show error toast
      addToast('error', 'Error', 'Failed to delete product. Please try again.');
    } finally {
      setDeletingProduct(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Add Product
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((prod) => (
                  <TableRow key={prod.productId} hover>
                    <TableCell>
                      {prod.productURLs && prod.productURLs.length > 0 ? (
                        <Avatar src={prod.productURLs[0]} alt={prod.name} />
                      ) : (
                        <Avatar>{prod.name[0]}</Avatar>
                      )}
                    </TableCell>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>{prod.type}</TableCell>
                    <TableCell>{prod.packSizeLabel}</TableCell>
                    <TableCell>{prod.manufacturer}</TableCell>
                    <TableCell>{prod.price}</TableCell>
                    <TableCell>{prod.discount}</TableCell>
                    <TableCell>{prod.inventory?.quantity || prod.quantity}</TableCell>
                    <TableCell>{prod.shortComposition}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, prod)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            <TextField label="Price" name="price" value={form.price} onChange={handleChange} required fullWidth type="number" inputProps={{ min: 0, step: 0.01 }} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
            <TextField label="Discount (%)" name="discount" value={form.discount} onChange={handleChange} fullWidth type="number" inputProps={{ min: 0, max: 100 }} />
            <TextField label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} fullWidth />
            <TextField select label="Type" name="type" value={form.type} onChange={handleChange} required fullWidth>
              {productTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
                         <TextField label="Pack Size Label" name="packSize" value={form.packSize} onChange={handleChange} fullWidth />
             <TextField label="Short Composition" name="composition" value={form.composition} onChange={handleChange} fullWidth />
             <TextField select label="Category" name="category" value={form.category} onChange={handleChange} required fullWidth>
               {productCategories.map((category) => (
                 <MenuItem key={category} value={category}>{category}</MenuItem>
               ))}
             </TextField>
             <TextField label="Quantity" name="quantity" value={form.quantity} onChange={handleChange} required fullWidth type="number" inputProps={{ min: 1 }} />
          </Box>
        </DialogContent>
                 <DialogActions>
           <Button onClick={handleCloseModal} color="secondary" variant="outlined" disabled={addingProduct || updatingProduct}>
             Cancel
           </Button>
           <Button onClick={handleSaveProduct} color="primary" variant="contained" disabled={addingProduct || updatingProduct}>
             {addingProduct ? 'Adding...' : updatingProduct ? 'Updating...' : (isEditing ? 'Update Product' : 'Add Product')}
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
           <Button 
             onClick={() => setDeleteDialogOpen(false)} 
             color="secondary" 
             variant="outlined"
             disabled={deletingProduct}
           >
             Cancel
           </Button>
           <Button 
             onClick={confirmDelete} 
             color="error" 
             variant="contained"
             disabled={deletingProduct}
           >
             {deletingProduct ? 'Deleting...' : 'Delete'}
           </Button>
         </DialogActions>
       </Dialog>

       {/* Toast Container */}
       <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Box>
  );
}

export default MedicalStoreVendorProducts; 