import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

const AddProductForm = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [uspInput, setUspInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [priceTierLabel, setPriceTierLabel] = useState('');
  const [priceTierPrice, setPriceTierPrice] = useState('');
  const [errors, setErrors] = useState({});

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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm(initialState);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#6C47FF', fontWeight: 700, fontSize: 22 }}>Add New Product</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} fullWidth required error={!!errors.name} helperText={errors.name} variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth required error={!!errors.category} helperText={errors.category} variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Subcategory" name="subCategory" value={form.subCategory} onChange={handleChange} fullWidth variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Price" name="price" value={form.price} onChange={handleChange} fullWidth required type="number" error={!!errors.price} helperText={errors.price} variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required multiline minRows={2} error={!!errors.description} helperText={errors.description} variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="How it Works" name="howItWorks" value={form.howItWorks} onChange={handleChange} fullWidth required multiline minRows={2} error={!!errors.howItWorks} helperText={errors.howItWorks} variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6C47FF', fontWeight: 600 }}>USP (Unique Selling Points)</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField size="small" value={uspInput} onChange={e => setUspInput(e.target.value)} placeholder="Add USP" variant="outlined" sx={{
                  '& label.Mui-focused': { color: '#6C47FF' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                  },
                }} />
                <Button variant="outlined" onClick={() => handleAddChip('usp', uspInput)} disabled={!uspInput} sx={{ borderColor: '#6C47FF', color: '#6C47FF', fontWeight: 600, '&:hover': { borderColor: '#4B299A', color: '#4B299A', background: 'rgba(108,71,255,0.06)' } }}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.usp.map((u, idx) => (
                  <Chip key={idx} label={u} onDelete={() => handleDeleteChip('usp', idx)} sx={{ bgcolor: '#F3F0FF', color: '#6C47FF', fontWeight: 600 }} />
                ))}
              </Stack>
              {errors.usp && <Typography color="error" variant="caption">{errors.usp}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6C47FF', fontWeight: 600 }}>Product Images</Typography>
              <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ mb: 1, borderColor: '#6C47FF', color: '#6C47FF', fontWeight: 600, '&:hover': { borderColor: '#4B299A', color: '#4B299A', background: 'rgba(108,71,255,0.06)' } }}>
                Upload Images
                <input type="file" accept="image/*" multiple hidden onChange={e => handleImageUpload(e, 'images')} />
              </Button>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.images.map((img, idx) => (
                  <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                    <img src={img.preview} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                    <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }} onClick={() => handleRemoveImage('images', idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              {errors.images && <Typography color="error" variant="caption">{errors.images}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6C47FF', fontWeight: 600 }}>Additional Images</Typography>
              <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ mb: 1, borderColor: '#6C47FF', color: '#6C47FF', fontWeight: 600, '&:hover': { borderColor: '#4B299A', color: '#4B299A', background: 'rgba(108,71,255,0.06)' } }}>
                Upload Additional Images
                <input type="file" accept="image/*" multiple hidden onChange={e => handleImageUpload(e, 'additionalImages')} />
              </Button>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.additionalImages.map((img, idx) => (
                  <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                    <img src={img.preview} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                    <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }} onClick={() => handleRemoveImage('additionalImages', idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Demo Link" name="demoLink" value={form.demoLink} onChange={handleChange} fullWidth variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Video URL" name="videoUrl" value={form.videoUrl} onChange={handleChange} fullWidth variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6C47FF', fontWeight: 600 }}>Highlights</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField size="small" value={highlightInput} onChange={e => setHighlightInput(e.target.value)} placeholder="Add Highlight" variant="outlined" sx={{
                  '& label.Mui-focused': { color: '#6C47FF' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                  },
                }} />
                <Button variant="outlined" onClick={() => handleAddChip('highlights', highlightInput)} disabled={!highlightInput} sx={{ borderColor: '#6C47FF', color: '#6C47FF', fontWeight: 600, '&:hover': { borderColor: '#4B299A', color: '#4B299A', background: 'rgba(108,71,255,0.06)' } }}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.highlights.map((h, idx) => (
                  <Chip key={idx} label={h} onDelete={() => handleDeleteChip('highlights', idx)} sx={{ bgcolor: '#F3F0FF', color: '#6C47FF', fontWeight: 600 }} />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={form.comingSoon} onChange={e => setForm(prev => ({ ...prev, comingSoon: e.target.checked }))} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#6C47FF' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6C47FF' } }} />}
                label={<span style={{ color: '#6C47FF', fontWeight: 600 }}>Coming Soon</span>}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#6C47FF' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6C47FF' } }} />}
                label={<span style={{ color: '#6C47FF', fontWeight: 600 }}>Active</span>}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} fullWidth type="number" variant="outlined" sx={{
                '& label.Mui-focused': { color: '#6C47FF' },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                },
              }} />
            </Grid>
            {/* Price Tiers */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6C47FF', fontWeight: 600 }}>Price Tiers</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField size="small" value={priceTierLabel} onChange={e => setPriceTierLabel(e.target.value)} placeholder="Label (e.g. Bulk)" variant="outlined" sx={{
                  '& label.Mui-focused': { color: '#6C47FF' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                  },
                }} />
                <TextField size="small" value={priceTierPrice} onChange={e => setPriceTierPrice(e.target.value)} placeholder="Price" type="number" variant="outlined" sx={{
                  '& label.Mui-focused': { color: '#6C47FF' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                  },
                }} />
                <Button variant="outlined" onClick={handleAddPriceTier} disabled={!priceTierLabel || !priceTierPrice} sx={{ borderColor: '#6C47FF', color: '#6C47FF', fontWeight: 600, '&:hover': { borderColor: '#4B299A', color: '#4B299A', background: 'rgba(108,71,255,0.06)' } }}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.priceTiers.map((pt, idx) => (
                  <Chip key={idx} label={`${pt.label}: $${pt.price}`} onDelete={() => handleDeletePriceTier(idx)} sx={{ bgcolor: '#F3F0FF', color: '#6C47FF', fontWeight: 600 }} />
                ))}
              </Stack>
            </Grid>
            {/* Specifications */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6C47FF', fontWeight: 600 }}>Specifications</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField size="small" value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Key" variant="outlined" sx={{
                  '& label.Mui-focused': { color: '#6C47FF' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                  },
                }} />
                <TextField size="small" value={specValue} onChange={e => setSpecValue(e.target.value)} placeholder="Value" variant="outlined" sx={{
                  '& label.Mui-focused': { color: '#6C47FF' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#6C47FF' },
                  },
                }} />
                <Button variant="outlined" onClick={handleAddSpec} disabled={!specKey || !specValue} sx={{ borderColor: '#6C47FF', color: '#6C47FF', fontWeight: 600, '&:hover': { borderColor: '#4B299A', color: '#4B299A', background: 'rgba(108,71,255,0.06)' } }}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.specifications.map((spec, idx) => (
                  <Chip key={idx} label={`${spec.key}: ${spec.value}`} onDelete={() => handleDeleteSpec(idx)} sx={{ bgcolor: '#F3F0FF', color: '#6C47FF', fontWeight: 600 }} />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ background: '#6C47FF', fontWeight: 700, '&:hover': { background: '#4B299A' } }}>Add Product</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductForm; 