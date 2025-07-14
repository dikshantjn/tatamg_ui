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
  CircularProgress
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
  Star as StarIcon
} from '@mui/icons-material';
import ProductVendorLayout from './ProductVendorLayout';
import AddProductForm from './AddProductForm';

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

const ProductVendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [
      { ...newProduct, id: Date.now(), images: newProduct.images.map(f => f.preview), additionalImages: newProduct.additionalImages.map(f => f.preview) },
      ...prev
    ]);
  };

  return (
    <ProductVendorLayout title="Products" notificationCount={2}>
      <AddProductForm open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddProduct} />
      <Container maxWidth={false} sx={{ maxWidth: 1200, width: '100%' }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#222' }}>
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
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #F0F1F3' }}>
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
                        156
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
                        12
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
                        3
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Out of Stock
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Modern Search and Filter */}
          <Paper sx={{ p: { xs: 2, sm: 2 }, borderRadius: 3, boxShadow: '0 2px 12px #e0e7ff', border: '1px solid #F0F1F3', background: '#f8fafc', mb: 2 }}>
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
                        <Search sx={{ color: '#6C47FF' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      background: '#fff',
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
        <Grid container spacing={3}>
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
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 0,
                        boxShadow: 'none',
                        border: '1.5px solid #6C47FF',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border-color 0.2s, transform 0.2s',
                        '&:hover': {
                          borderColor: '#4B299A',
                          transform: 'scale(1.025)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', mb: 2 }}>
                        <Box
                          component="img"
                          src={product.images[0]}
                          alt={product.name}
                          sx={{
                            width: '100%',
                            height: 140,
                            objectFit: 'cover',
                            borderRadius: 0,
                            background: '#f4f4f4',
                            border: '1px solid #eee',
                          }}
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
                      <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#222', fontSize: 18, lineHeight: 1.2 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6C47FF', fontWeight: 600, mb: 0.5, fontSize: 15 }}>
                          {product.category}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Rating
                            value={product.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                            icon={<StarIcon fontSize="inherit" htmlColor="#6C47FF" />}
                            emptyIcon={<StarIcon fontSize="inherit" htmlColor="#E0E0E0" />}
                          />
                          <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>
                            {product.rating} ({product.reviewCount} reviews)
                          </Typography>
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#6C47FF', mb: 1, fontSize: 18 }}>
                          ${product.price}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', mb: 1, fontSize: 14 }}>
                          Stock: {product.stock}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#6C47FF',
                              backgroundColor: '#F3F0FF',
                              borderRadius: 2,
                              '&:hover': { backgroundColor: '#E8E4FF' }
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#6C47FF',
                              backgroundColor: '#F3F0FF',
                              borderRadius: 2,
                              '&:hover': { backgroundColor: '#E8E4FF' }
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#EF4444',
                              backgroundColor: '#FEECEC',
                              borderRadius: 2,
                              '&:hover': { backgroundColor: '#FEE2E2' }
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
    </ProductVendorLayout>
  );
};

export default ProductVendorProducts; 