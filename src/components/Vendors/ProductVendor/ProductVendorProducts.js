import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  Container,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Rating,
  Badge,
  CircularProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Inventory,
  LocalShipping,
  Warning,
  Star as StarIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import ProductVendorLayout from './ProductVendorLayout';
import AddProductForm from './AddProductForm';
import { getVendorProducts, deleteProduct } from '../../../services/Vendors/product-partner.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { toast } from 'react-toastify';

// ImageWithFallback Component
const ImageWithFallback = ({ src, alt, fallbackText, sx, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: '12px 12px 0 0',
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
          ...sx
        }}
        {...props}
      >
        <ImageIcon sx={{ fontSize: 32, mb: 1, opacity: 0.6 }} />
        <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.7 }}>
          {fallbackText || 'Image not available'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={handleImageError}
      sx={{
        width: '100%',
        height: 120,
        objectFit: 'cover',
        borderRadius: '12px 12px 0 0',
        background: '#f4f4f4',
        border: '1px solid #eee',
        ...sx
      }}
      {...props}
    />
  );
};

const mockProducts = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 5.99,
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    ],
    rating: 4.5,
    reviewCount: 120,
    comingSoon: false,
    stock: 150
  },
  {
    id: 2,
    name: 'Vitamin C 1000mg',
    category: 'Vitamins',
    price: 12.99,
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
    ],
    rating: 4.8,
    reviewCount: 98,
    comingSoon: false,
    stock: 75
  },
  {
    id: 3,
    name: 'Omeprazole 20mg',
    category: 'Digestive Health',
    price: 18.50,
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
    ],
    rating: 4.2,
    reviewCount: 45,
    comingSoon: true,
    stock: 0
  },
  {
    id: 4,
    name: 'Cetirizine 10mg',
    category: 'Allergy',
    price: 8.75,
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
    ],
    rating: 4.0,
    reviewCount: 60,
    comingSoon: false,
    stock: 0
  },
];

const getStatusColor = (stock, comingSoon) => {
  if (comingSoon) return 'info';
  if (stock === 0) return 'error';
  if (stock < 20) return 'warning';
  return 'success';
};

const getStatusText = (stock, comingSoon) => {
  if (comingSoon) return 'Coming Soon';
  if (stock === 0) return 'Out of Stock';
  if (stock < 20) return 'Low Stock';
  return 'In Stock';
};

const ProductVendorProductsContent = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const authData = vendorAuthService.getVendorAuthData();
        const vendorId = authData?.vendorData?.vendorId;
        if (vendorId) {
          const response = await getVendorProducts(vendorId);
          setProducts(response.products || []);
        }
      } catch (error) {
        console.error('Error fetching vendor products:', error);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.subCategory?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = async (newProduct) => {
    try {
      // Refresh the products list from the API
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId;
      if (vendorId) {
        const response = await getVendorProducts(vendorId);
        setProducts(response.products || []);
      }
      
      // Reset edit mode
      setEditMode(false);
      setProductToEdit(null);
    } catch (error) {
      console.error('Error refreshing products after saving product:', error);
      // Fallback: add the new product to the local state
      setProducts((prev) => [
        { ...newProduct, id: Date.now(), images: newProduct.images.map(f => f.preview), additionalImages: newProduct.additionalImages.map(f => f.preview) },
        ...prev
      ]);
    }
  };

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProductId);
      toast.success('Product deleted successfully!');
      setProducts(products.filter(p => p.productId !== selectedProductId));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
      setIsDeleting(false);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewProductModal(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setEditMode(true);
    setAddOpen(true);
  };

  return (
    <ProductVendorLayout title="Products" notificationCount={2}>
      <AddProductForm 
        open={addOpen} 
        onClose={() => {
          setAddOpen(false);
          setEditMode(false);
          setProductToEdit(null);
        }} 
        onSubmit={handleAddProduct}
        editMode={editMode}
        productToEdit={productToEdit}
      />
      <Container maxWidth={false} sx={{ maxWidth: 1400, width: '100%', mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Product Management
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              sx={{
                borderColor: '#6C47FF',
                color: '#6C47FF',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#5B3CC4',
                  color: '#5B3CC4',
                  background: 'rgba(108,71,255,0.06)'
                }
              }}
              onClick={() => setAddOpen(true)}
            >
              Add Product
            </Button>
          </Box>

          {/* Stats Summary - moved above search/filter */}
          <Box sx={{ mb: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: '#F3F0FF',
                      color: '#6C47FF',
                    }}>
                      <Inventory />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        {products.length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Total Products
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: '#FFF7E6',
                      color: '#F59E0B',
                    }}>
                      <Warning />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        12
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Low Stock Items
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: '#FEECEC',
                      color: '#EF4444',
                    }}>
                      <LocalShipping />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        {products.filter(p => p.stock === 0).length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Out of Stock
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Modern Search and Filter */}
          <Paper sx={{ p: { xs: 2, sm: 2 }, borderRadius: 3, boxShadow: '0 2px 12px #e0e7ff', border: `1px solid ${theme.palette.divider}`, background: isDarkMode ? theme.palette.background.default : '#f8fafc', mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <TextField
                  fullWidth
                  placeholder="Search by name or category..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                                      InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 3,
                        background: theme.palette.background.paper,
                        boxShadow: '0 1px 6px 0 rgba(108,71,255,0.04)',
                        fontWeight: 500,
                        height: 44
                      }
                    }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      height: 44
                    },
                    '& input': {
                      fontSize: 16,
                      fontWeight: 500
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    defaultValue="all"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="pain-relief">Pain Relief</MenuItem>
                    <MenuItem value="vitamins">Vitamins</MenuItem>
                    <MenuItem value="digestive">Digestive Health</MenuItem>
                    <MenuItem value="allergy">Allergy</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    defaultValue="all"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">In Stock</MenuItem>
                    <MenuItem value="low-stock">Low Stock</MenuItem>
                    <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Products Grid with Shimmer */}
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {loading
            ? (
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320, width: '100%' }}>
                    <CircularProgress size={48} sx={{ color: '#6C47FF' }} />
                  </Box>
                </Grid>
              )
            : filteredProducts.map((product) => {
                // Badge color logic
                let badgeBg = '#6C47FF', badgeText = '#fff', badgeLabel = getStatusText(product.stock, product.comingSoon);
                if (badgeLabel === 'Out of Stock') { badgeBg = '#EF4444'; badgeText = '#fff'; }
                else if (badgeLabel === 'Low Stock') { badgeBg = '#F59E0B'; badgeText = '#fff'; }
                else if (badgeLabel === 'Coming Soon') { badgeBg = '#3B82F6'; badgeText = '#fff'; }
                else if (badgeLabel === 'In Stock') { badgeBg = '#6C47FF'; badgeText = '#fff'; }
                return (
                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3} key={product.productId}>
                    <Card
                      sx={{
                        height: 400, // Fixed height for consistency
                        borderRadius: 3,
                        boxShadow: 'none',
                        border: `1.5px solid ${theme.palette.divider}`,
                        background: theme.palette.background.paper,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border-color 0.2s, transform 0.2s',
                        '&:hover': {
                          borderColor: '#4B299A',
                          transform: 'scale(1.025)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', mb: 2, flexShrink: 0 }}>
                        <ImageWithFallback
                          src={product.images?.[0]}
                          alt={product.name}
                          fallbackText="No Image Available"
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 99,
                            fontSize: 12,
                            fontWeight: 700,
                            background: badgeBg,
                            color: badgeText,
                            letterSpacing: 0.2,
                            minWidth: 80,
                            textAlign: 'center',
                            boxShadow: 'none',
                            zIndex: 2
                          }}
                        >
                          {badgeLabel}
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 0.5, 
                            color: theme.palette.text.primary, 
                            fontSize: 16, 
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em' // 2 lines * 1.2 line height
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.primary.main, 
                            fontWeight: 600, 
                            mb: 0.5, 
                            fontSize: 14,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.category}
                          {product.subCategory && ` • ${product.subCategory}`}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, flexShrink: 0 }}>
                          <Rating
                            value={product.rating || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            icon={<StarIcon fontSize="inherit" htmlColor="#6C47FF" />}
                            emptyIcon={<StarIcon fontSize="inherit" htmlColor="#E0E0E0" />}
                          />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: theme.palette.text.secondary, 
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}
                          >
                            {product.rating || 0} ({product.reviewCount || 0} reviews)
                          </Typography>
                        </Stack>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: theme.palette.primary.main, 
                            mb: 1, 
                            fontSize: 16,
                            flexShrink: 0
                          }}
                        >
                          ₹{product.price?.toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.text.secondary, 
                            mb: 1, 
                            fontSize: 13,
                            flexShrink: 0
                          }}
                        >
                          Stock: {product.stock || 0}
                        </Typography>
                        {product.isActive !== undefined && (
                          <Chip 
                            label={product.isActive ? 'Active' : 'Inactive'} 
                            size="small" 
                            color={product.isActive ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem', 
                              mb: 1,
                              flexShrink: 0,
                              alignSelf: 'flex-start'
                            }}
                          />
                        )}
                        <Box sx={{ flexGrow: 1 }} />
                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1, flexShrink: 0 }}>
                          <IconButton
                            size="small"
                            sx={{
                              color: theme.palette.primary.main,
                              backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.2)' : '#F3F0FF',
                              borderRadius: 2,
                              '&:hover': { backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.3)' : '#E8E4FF' }
                            }}
                            onClick={() => handleViewProduct(product)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: theme.palette.primary.main,
                              backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.2)' : '#F3F0FF',
                              borderRadius: 2,
                              '&:hover': { backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.3)' : '#E8E4FF' }
                            }}
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#EF4444',
                              backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEECEC',
                              borderRadius: 2,
                              '&:hover': { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#FEE2E2' }
                            }}
                            onClick={() => {
                              setSelectedProductId(product.productId);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>
      </Container>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: 400
          }
        }}
      >
        <DialogTitle 
          id="delete-dialog-title"
          sx={{ 
            color: '#EF4444',
            fontWeight: 700,
            fontSize: 20,
            pb: 1
          }}
        >
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="delete-dialog-description"
            sx={{ 
              fontSize: 16,
              color: theme.palette.text.secondary,
              mb: 2
            }}
          >
            Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your inventory.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            disabled={isDeleting}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteProduct} 
            color="error" 
            variant="contained" 
            disabled={isDeleting}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: '#EF4444',
              '&:hover': {
                background: '#DC2626'
              },
              '&:disabled': {
                background: 'rgba(239, 68, 68, 0.5)'
              }
            }}
          >
            {isDeleting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Deleting...</span>
              </Box>
            ) : (
              'Delete Product'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Details Modal */}
      <Dialog
        open={viewProductModal}
        onClose={() => setViewProductModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            maxHeight: '90vh',
            overflow: 'hidden'
          }
        }}
      >
        {selectedProduct && (
          <>
            <DialogTitle 
              sx={{ 
                background: 'linear-gradient(135deg, #6C47FF 0%, #8B68FF 100%)',
                color: 'white',
                fontWeight: 700, 
                fontSize: { xs: 20, sm: 22 },
                py: 3,
                px: 4
              }}
            >
              Product Details
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ height: 'calc(90vh - 140px)', overflow: 'auto', p: { xs: 2, sm: 4 } }}>
                {/* Product Images */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
                    Product Images
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      selectedProduct.images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <ImageWithFallback
                            src={image}
                            alt={`${selectedProduct.name} - Image ${index + 1}`}
                            fallbackText="Image not available"
                            sx={{ width: '100%', height: 200, borderRadius: 2 }}
                          />
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
                          <ImageIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                          <Typography variant="body1">No images available</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>

                {/* Basic Information */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
                    Basic Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Product Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {selectedProduct.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Category</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {selectedProduct.category}
                        {selectedProduct.subCategory && ` • ${selectedProduct.subCategory}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Price</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        ₹{selectedProduct.price?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Stock</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {selectedProduct.stock || 0} units
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Description</Typography>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {selectedProduct.description || 'No description available'}
                      </Typography>
                    </Grid>
                    {selectedProduct.howItWorks && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>How It Works</Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                          {selectedProduct.howItWorks}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>

                {/* Product Features */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
                    Product Features
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {selectedProduct.usp && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>USP (Unique Selling Points)</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {typeof selectedProduct.usp === 'string' ? (
                            selectedProduct.usp.split(',').map((usp, index) => (
                              <Chip 
                                key={index} 
                                label={usp.trim()} 
                                sx={{ 
                                  bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                                  color: '#6C47FF', 
                                  fontWeight: 600 
                                }} 
                              />
                            ))
                          ) : (
                            selectedProduct.usp?.map((usp, index) => (
                              <Chip 
                                key={index} 
                                label={usp} 
                                sx={{ 
                                  bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                                  color: '#6C47FF', 
                                  fontWeight: 600 
                                }} 
                              />
                            ))
                          )}
                        </Stack>
                      </Grid>
                    )}
                    
                    {selectedProduct.highlights && selectedProduct.highlights.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Highlights</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {selectedProduct.highlights.map((highlight, index) => (
                            <Chip 
                              key={index} 
                              label={highlight} 
                              sx={{ 
                                bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                                color: '#6C47FF', 
                                fontWeight: 600 
                              }} 
                            />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Paper>

                {/* Ratings and Reviews */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
                    Ratings & Reviews
                  </Typography>
                  
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Rating
                          value={selectedProduct.rating || 0}
                          precision={0.1}
                          readOnly
                          size="large"
                          icon={<StarIcon fontSize="inherit" htmlColor="#6C47FF" />}
                          emptyIcon={<StarIcon fontSize="inherit" htmlColor="#E0E0E0" />}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                            {selectedProduct.rating || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {selectedProduct.reviewCount || 0} reviews
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={selectedProduct.isActive ? 'Active' : 'Inactive'} 
                          color={selectedProduct.isActive ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                        {selectedProduct.comingSoon && (
                          <Chip 
                            label="Coming Soon" 
                            color="info"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Additional Details */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
                    Additional Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {selectedProduct.demoLink && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Demo Link</Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.primary.main, wordBreak: 'break-all' }}>
                          {selectedProduct.demoLink}
                        </Typography>
                      </Grid>
                    )}
                    {selectedProduct.videoUrl && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Video URL</Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.primary.main, wordBreak: 'break-all' }}>
                          {selectedProduct.videoUrl}
                        </Typography>
                      </Grid>
                    )}
                    {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Specifications</Typography>
                        <Grid container spacing={2}>
                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <Grid item xs={12} sm={6} key={key}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {value}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                    {selectedProduct.priceTiers && selectedProduct.priceTiers.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>Price Tiers</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {selectedProduct.priceTiers.map((tier, index) => (
                            <Chip 
                              key={index} 
                              label={`${tier.minQuantity}-${tier.maxQuantity}: ₹${tier.price}`} 
                              sx={{ 
                                bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                                color: '#6C47FF', 
                                fontWeight: 600 
                              }} 
                            />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, gap: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button 
                onClick={() => setViewProductModal(false)} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ProductVendorLayout>
  );
};

const ProductVendorProducts = () => {
  return (
    <VendorThemeProvider>
      <ProductVendorProductsContent />
    </VendorThemeProvider>
  );
};

export default ProductVendorProducts; 