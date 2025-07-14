import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import { addProduct, updateProduct } from '../../../services/Vendors/product-partner.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { toast } from 'react-toastify';

// ImageWithFallback Component for preview images
const ImageWithFallback = ({ src, alt, sx, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <Box
        sx={{
          width: 60,
          height: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
          ...sx
        }}
        {...props}
      >
        <ImageIcon sx={{ fontSize: 20, opacity: 0.6 }} />
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
        width: 60,
        height: 60,
        objectFit: 'cover',
        borderRadius: 1,
        border: '1px solid #eee',
        ...sx
      }}
      {...props}
    />
  );
};

const initialState = {
  name: '',
  category: '',
  subCategory: '',
  description: '',
  howItWorks: '',
  usp: [],
  price: '',
  images: [],
  additionalImages: [],
  demoLink: '',
  videoUrl: '',
  highlights: [],
  comingSoon: false,
  priceTiers: [],
  rating: 0,
  reviewCount: 0,
  specifications: [],
  isActive: true,
  stock: 0,
};

const AddProductFormContent = ({ open, onClose, onSubmit, editMode = false, productToEdit = null }) => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const [form, setForm] = useState(initialState);
  const [uspInput, setUspInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [priceTierLabel, setPriceTierLabel] = useState('');
  const [priceTierPrice, setPriceTierPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product data when editing
  useEffect(() => {
    if (editMode && productToEdit) {
      setForm({
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        subCategory: productToEdit.subCategory || '',
        description: productToEdit.description || '',
        howItWorks: productToEdit.howItWorks || '',
        usp: Array.isArray(productToEdit.usp) ? productToEdit.usp : (productToEdit.usp ? productToEdit.usp.split(',').map(s => s.trim()) : []),
        price: productToEdit.price?.toString() || '',
        images: productToEdit.images ? productToEdit.images.map(img => ({ preview: img })) : [],
        additionalImages: productToEdit.additionalImages ? productToEdit.additionalImages.map(img => ({ preview: img })) : [],
        demoLink: productToEdit.demoLink || '',
        videoUrl: productToEdit.videoUrl || '',
        highlights: productToEdit.highlights || [],
        comingSoon: productToEdit.comingSoon || false,
        priceTiers: productToEdit.priceTiers ? productToEdit.priceTiers.map(pt => ({ label: pt.name || 'Tier', price: pt.price?.toString() || '' })) : [],
        rating: productToEdit.rating || 0,
        reviewCount: productToEdit.reviewCount || 0,
        specifications: productToEdit.specifications ? Object.entries(productToEdit.specifications).map(([key, value]) => ({ key, value })) : [],
        isActive: productToEdit.isActive !== undefined ? productToEdit.isActive : true,
        stock: productToEdit.stock || 0,
      });
    } else {
      setForm(initialState);
    }
  }, [editMode, productToEdit, open]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image uploads
  const handleImageUpload = (e, field) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ...files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))],
    }));
  };

  // Remove image
  const handleRemoveImage = (field, idx) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  // Handle chips (usp, highlights)
  const handleAddChip = (field, value) => {
    if (value && !form[field].includes(value)) {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], value] }));
      if (field === 'usp') setUspInput('');
      if (field === 'highlights') setHighlightInput('');
    }
  };
  const handleDeleteChip = (field, idx) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  // Specifications (key-value pairs)
  const handleAddSpec = () => {
    if (specKey && specValue) {
      setForm((prev) => ({ ...prev, specifications: [...prev.specifications, { key: specKey, value: specValue }] }));
      setSpecKey('');
      setSpecValue('');
    }
  };
  const handleDeleteSpec = (idx) => {
    setForm((prev) => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }));
  };

  // Price Tiers
  const handleAddPriceTier = () => {
    if (priceTierLabel && priceTierPrice) {
      setForm((prev) => ({ ...prev, priceTiers: [...prev.priceTiers, { label: priceTierLabel, price: priceTierPrice }] }));
      setPriceTierLabel('');
      setPriceTierPrice('');
    }
  };
  const handleDeletePriceTier = (idx) => {
    setForm((prev) => ({ ...prev, priceTiers: prev.priceTiers.filter((_, i) => i !== idx) }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Product name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.howItWorks) newErrors.howItWorks = 'How it works is required';
    if (!form.usp.length) newErrors.usp = 'At least one USP is required';
    if (!form.price) newErrors.price = 'Price is required';
    if (!form.images.length) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const authData = vendorAuthService.getVendorAuthData();
        const vendorId = authData?.vendorData?.vendorId;
        
        if (!vendorId) {
          toast.error('Authentication error. Please login again.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        // Prepare the data for API
        const productData = {
          name: form.name,
          category: form.category,
          subCategory: form.subCategory,
          description: form.description,
          howItWorks: form.howItWorks,
          usp: form.usp, // Keep as array for edit
          price: parseFloat(form.price),
          images: form.images.map(img => img.preview || img), // Use preview URLs or original URLs
          additionalImages: form.additionalImages.map(img => img.preview || img),
          isActive: form.isActive,
          stock: parseInt(form.stock),
          demoLink: form.demoLink,
          videoUrl: form.videoUrl,
          highlights: form.highlights,
          comingSoon: form.comingSoon,
          priceTiers: form.priceTiers.map(pt => ({
            name: pt.label,
            price: parseFloat(pt.price),
            description: `${pt.label} tier`
          })),
          rating: form.rating,
          reviewCount: form.reviewCount,
          specifications: form.specifications.reduce((acc, spec) => {
            acc[spec.key] = spec.value;
            return acc;
          }, {})
        };

        let response;
        if (editMode && productToEdit) {
          // Update existing product
          response = await updateProduct(productToEdit.productId, productData);
          toast.success('Product updated successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Add new product
          productData.vendorId = vendorId;
          response = await addProduct(productData);
          toast.success('Product added successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Reset form and close dialog
        setForm(initialState);
        onClose();
        
        // Call the onSubmit callback if provided
        if (onSubmit) {
          onSubmit(response);
        }

      } catch (error) {
        console.error('Error saving product:', error);
        
        // Show error toast
        const action = editMode ? 'updating' : 'adding';
        toast.error(error.response?.data?.message || `Failed to ${action} product. Please try again.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&.Mui-focused fieldset': { 
        borderColor: '#6C47FF',
        borderWidth: '2px'
      },
      '&:hover fieldset': {
        borderColor: '#8B68FF'
      }
    },
    '& label.Mui-focused': { 
      color: '#6C47FF',
      fontWeight: 600
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500
    }
  };

  const commonButtonStyles = {
    borderRadius: 2,
    fontWeight: 600,
    textTransform: 'none',
    px: 3,
    py: 1,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(108,71,255,0.3)'
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
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
        {editMode ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            height: 'calc(90vh - 140px)',
            overflow: 'auto',
            p: { xs: 2, sm: 4 }
          }}
        >
          {/* Basic Information Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Product Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  error={!!errors.name} 
                  helperText={errors.name} 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Category" 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  error={!!errors.category} 
                  helperText={errors.category} 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Subcategory" 
                  name="subCategory" 
                  value={form.subCategory} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Price (₹)" 
                  name="price" 
                  value={form.price} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  type="number" 
                  error={!!errors.price} 
                  helperText={errors.price} 
                  variant="outlined" 
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Description" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  multiline 
                  minRows={3} 
                  error={!!errors.description} 
                  helperText={errors.description} 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="How it Works" 
                  name="howItWorks" 
                  value={form.howItWorks} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  multiline 
                  minRows={3} 
                  error={!!errors.howItWorks} 
                  helperText={errors.howItWorks} 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Product Features Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
              Product Features
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}>
                  USP (Unique Selling Points)
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <TextField 
                    size="small" 
                    value={uspInput} 
                    onChange={e => setUspInput(e.target.value)} 
                    placeholder="Add a unique selling point" 
                    variant="outlined" 
                    sx={{ ...commonTextFieldStyles, flex: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddChip('usp', uspInput)} 
                    disabled={!uspInput} 
                    sx={{ 
                      ...commonButtonStyles,
                      borderColor: '#6C47FF', 
                      color: '#6C47FF',
                      '&:hover': { 
                        borderColor: '#4B299A', 
                        color: '#4B299A', 
                        background: 'rgba(108,71,255,0.06)' 
                      } 
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.usp.map((u, idx) => (
                    <Chip 
                      key={idx} 
                      label={u} 
                      onDelete={() => handleDeleteChip('usp', idx)} 
                      sx={{ 
                        bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                        color: '#6C47FF', 
                        fontWeight: 600,
                        '& .MuiChip-deleteIcon': {
                          color: '#6C47FF'
                        }
                      }} 
                    />
                  ))}
                </Stack>
                {errors.usp && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.usp}</Typography>}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}>
                  Highlights
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <TextField 
                    size="small" 
                    value={highlightInput} 
                    onChange={e => setHighlightInput(e.target.value)} 
                    placeholder="Add a highlight feature" 
                    variant="outlined" 
                    sx={{ ...commonTextFieldStyles, flex: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddChip('highlights', highlightInput)} 
                    disabled={!highlightInput} 
                    sx={{ 
                      ...commonButtonStyles,
                      borderColor: '#6C47FF', 
                      color: '#6C47FF',
                      '&:hover': { 
                        borderColor: '#4B299A', 
                        color: '#4B299A', 
                        background: 'rgba(108,71,255,0.06)' 
                      } 
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.highlights.map((h, idx) => (
                    <Chip 
                      key={idx} 
                      label={h} 
                      onDelete={() => handleDeleteChip('highlights', idx)} 
                      sx={{ 
                        bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                        color: '#6C47FF', 
                        fontWeight: 600,
                        '& .MuiChip-deleteIcon': {
                          color: '#6C47FF'
                        }
                      }} 
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Images Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
              Product Images
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}>
                  Main Product Images
                </Typography>
                <Button 
                  component="label" 
                  variant="outlined" 
                  startIcon={<UploadFileIcon />} 
                  sx={{ 
                    mb: 2, 
                    ...commonButtonStyles,
                    borderColor: '#6C47FF', 
                    color: '#6C47FF',
                    '&:hover': { 
                      borderColor: '#4B299A', 
                      color: '#4B299A', 
                      background: 'rgba(108,71,255,0.06)' 
                    } 
                  }}
                >
                  Upload Images
                  <input type="file" accept="image/*" multiple hidden onChange={e => handleImageUpload(e, 'images')} />
                </Button>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {form.images.map((img, idx) => (
                    <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                      <ImageWithFallback src={img.preview} alt="preview" />
                      <IconButton 
                        size="small" 
                        sx={{ 
                          position: 'absolute', 
                          top: -8, 
                          right: -8, 
                          bgcolor: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#fff' }
                        }} 
                        onClick={() => handleRemoveImage('images', idx)}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
                {errors.images && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.images}</Typography>}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}>
                  Additional Images
                </Typography>
                <Button 
                  component="label" 
                  variant="outlined" 
                  startIcon={<UploadFileIcon />} 
                  sx={{ 
                    mb: 2, 
                    ...commonButtonStyles,
                    borderColor: '#6C47FF', 
                    color: '#6C47FF',
                    '&:hover': { 
                      borderColor: '#4B299A', 
                      color: '#4B299A', 
                      background: 'rgba(108,71,255,0.06)' 
                    } 
                  }}
                >
                  Upload Additional Images
                  <input type="file" accept="image/*" multiple hidden onChange={e => handleImageUpload(e, 'additionalImages')} />
                </Button>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {form.additionalImages.map((img, idx) => (
                    <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                      <ImageWithFallback src={img.preview} alt="preview" />
                      <IconButton 
                        size="small" 
                        sx={{ 
                          position: 'absolute', 
                          top: -8, 
                          right: -8, 
                          bgcolor: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#fff' }
                        }} 
                        onClick={() => handleRemoveImage('additionalImages', idx)}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Details Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
              Additional Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Demo Link" 
                  name="demoLink" 
                  value={form.demoLink} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Video URL" 
                  name="videoUrl" 
                  value={form.videoUrl} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Stock Quantity" 
                  name="stock" 
                  value={form.stock} 
                  onChange={handleChange} 
                  fullWidth 
                  type="number" 
                  variant="outlined" 
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2} sx={{ height: '100%', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={form.comingSoon} 
                        onChange={e => setForm(prev => ({ ...prev, comingSoon: e.target.checked }))} 
                        sx={{ 
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#6C47FF' }, 
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6C47FF' } 
                        }} 
                      />
                    }
                    label={<Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Coming Soon</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={form.isActive} 
                        onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} 
                        sx={{ 
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#6C47FF' }, 
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6C47FF' } 
                        }} 
                      />
                    }
                    label={<Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Active</Typography>}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Price Tiers Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
              Price Tiers
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TextField 
                size="small" 
                value={priceTierLabel} 
                onChange={e => setPriceTierLabel(e.target.value)} 
                placeholder="Label (e.g. Bulk)" 
                variant="outlined" 
                sx={{ ...commonTextFieldStyles, flex: 1 }}
              />
              <TextField 
                size="small" 
                value={priceTierPrice} 
                onChange={e => setPriceTierPrice(e.target.value)} 
                placeholder="Price" 
                type="number" 
                variant="outlined" 
                sx={{ ...commonTextFieldStyles, flex: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddPriceTier} 
                disabled={!priceTierLabel || !priceTierPrice} 
                sx={{ 
                  ...commonButtonStyles,
                  borderColor: '#6C47FF', 
                  color: '#6C47FF',
                  '&:hover': { 
                    borderColor: '#4B299A', 
                    color: '#4B299A', 
                    background: 'rgba(108,71,255,0.06)' 
                  } 
                }}
              >
                Add
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {form.priceTiers.map((pt, idx) => (
                <Chip 
                  key={idx} 
                  label={`${pt.label}: ₹${pt.price}`} 
                  onDelete={() => handleDeletePriceTier(idx)} 
                  sx={{ 
                    bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                    color: '#6C47FF', 
                    fontWeight: 600,
                    '& .MuiChip-deleteIcon': {
                      color: '#6C47FF'
                    }
                  }} 
                />
              ))}
            </Stack>
          </Paper>

          {/* Specifications Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 20, bgcolor: '#6C47FF', borderRadius: 2 }} />
              Specifications
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TextField 
                size="small" 
                value={specKey} 
                onChange={e => setSpecKey(e.target.value)} 
                placeholder="Key" 
                variant="outlined" 
                sx={{ ...commonTextFieldStyles, flex: 1 }}
              />
              <TextField 
                size="small" 
                value={specValue} 
                onChange={e => setSpecValue(e.target.value)} 
                placeholder="Value" 
                variant="outlined" 
                sx={{ ...commonTextFieldStyles, flex: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddSpec} 
                disabled={!specKey || !specValue} 
                sx={{ 
                  ...commonButtonStyles,
                  borderColor: '#6C47FF', 
                  color: '#6C47FF',
                  '&:hover': { 
                    borderColor: '#4B299A', 
                    color: '#4B299A', 
                    background: 'rgba(108,71,255,0.06)' 
                  } 
                }}
              >
                Add
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {form.specifications.map((spec, idx) => (
                <Chip 
                  key={idx} 
                  label={`${spec.key}: ${spec.value}`} 
                  onDelete={() => handleDeleteSpec(idx)} 
                  sx={{ 
                    bgcolor: isDarkMode ? 'rgba(108,71,255,0.2)' : '#F3F0FF', 
                    color: '#6C47FF', 
                    fontWeight: 600,
                    '& .MuiChip-deleteIcon': {
                      color: '#6C47FF'
                    }
                  }} 
                />
              ))}
            </Stack>
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            ...commonButtonStyles,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ 
            ...commonButtonStyles,
            background: 'linear-gradient(135deg, #6C47FF 0%, #8B68FF 100%)',
            color: 'white',
            '&:hover': { 
              background: 'linear-gradient(135deg, #4B299A 0%, #6C47FF 100%)',
              boxShadow: '0 4px 12px rgba(108,71,255,0.4)'
            },
            '&:disabled': {
              background: 'rgba(108,71,255,0.5)',
              color: 'rgba(255,255,255,0.7)'
            }
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Saving Product...</span>
            </Box>
          ) : (
            editMode ? 'Update Product' : 'Add Product'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddProductForm = ({ open, onClose, onSubmit, editMode = false, productToEdit = null }) => {
  return (
    <VendorThemeProvider>
      <AddProductFormContent 
        open={open} 
        onClose={onClose} 
        onSubmit={onSubmit} 
        editMode={editMode}
        productToEdit={productToEdit}
      />
    </VendorThemeProvider>
  );
};

export default AddProductForm; 