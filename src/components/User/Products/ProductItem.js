import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Chip,
    Box,
    Stack,
    IconButton,
    CircularProgress,
    Rating,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,

} from '@mui/material';
import {
    ShoppingCart,
    Visibility,
    Favorite,
    Warning,
    Cancel,
    CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';
import { getUserId, isAuthenticated } from '../../../services/User/Auth/auth.utils';
import { fetchCartItems } from '../../../store/slices/cartSlice';

// Styled Components (compact card)
const StyledCard = styled(Card)(({ theme }) => ({
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    boxShadow: theme.shadows[1],
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4]
    }
}));

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
    '& .MuiSnackbarContent-root': {
        borderRadius: 12,
        background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
        color: 'white',
        fontWeight: 600,
    }
}));

// Image Fallback Icon Component
const ImageIcon = () => (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.disabled'
    }}>
        <Visibility sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
            Image not available
        </Typography>
    </Box>
    );

const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const navigate = useNavigate();

    console.log('ProductItem rendered:', { 
        productId: product?.productId,
        isInCart, 
        loading 
    });

    const {
        productId,
        name,
        description,
        price,
        images,
        highlights,
        stock,
        rating,
        reviewCount,
        priceTiers
    } = product;

    useEffect(() => {
        // Check if product is in cart when component mounts
        const checkCartStatus = async () => {
            const userId = getUserId();
            console.log('Checking cart status for:', { userId, productId });
            
            if (!userId || !isAuthenticated()) {
                console.log('User not authenticated, skipping cart check');
                return;
            }

            try {
                const inCart = await VendorProductService.checkInCart(userId, productId);
                console.log('Cart status result:', inCart);
                setIsInCart(inCart);
            } catch (error) {
                console.error('Error checking cart status:', error);
            }
        };

        if (productId) {
            checkCartStatus();
        } else {
            console.log('Skipping cart check - missing productId');
        }
    }, [productId]);

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent any default navigation
        
        const userId = getUserId();
        console.log('Add to Cart clicked:', { userId, productId });

        if (!userId || !isAuthenticated()) {
            console.log('User not authenticated, redirecting to login');
            navigate('/login'); // Changed from '/' to '/login'
            return;
        }

        setLoading(true);
        try {
            console.log('Making API call to add to cart');
            const result = await VendorProductService.addToCart(userId, productId);
            console.log('Add to cart API response:', result);
            
            setIsInCart(true);
            
            // Dispatch Redux action to refresh cart items in header
            dispatch(fetchCartItems());
            
            setSnackbar({
                message: result.message || 'Product added to cart successfully!',
                severity: 'success',
                showGoToCart: true
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            setSnackbar({
                message: error.message || 'Failed to add item to cart. Please try again.',
                severity: 'error',
                showGoToCart: false
            });
        } finally {
            console.log('Add to cart operation completed');
            setLoading(false);
        }
    };

    const handleGoToCart = (e) => {
        console.log('Go to Cart clicked, preventing default and navigating');
        e.preventDefault(); // Prevent any default navigation
        navigate('/checkout-product-medicine');
    };

    const mainImage = images && images.length > 0 ? images[0] : null;

    return (
        <>
            <StyledCard>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="120"
                        image={mainImage}
                        alt={name}
                        loading="lazy"
                        onError={() => {
                            setImageError(true);
                        }}
                        sx={{ 
                            objectFit: 'cover',
                            ...(imageError && { display: 'none' })
                        }}
                    />
                    {imageError && (
                        <Box sx={{ 
                            height: 120, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: 'rgba(0, 0, 0, 0.02)'
                        }}>
                            <ImageIcon />
                        </Box>
                    )}

                    {/* Stock Badges */}
                    <Stack direction="row" spacing={1} sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8,
                        zIndex: 2
                    }}>
                        {stock <= 5 && stock > 0 && (
                            <Chip
                                icon={<Warning />}
                                label={`Only ${stock} left`}
                                size="small"
                                sx={{ 
                                    background: 'rgba(255, 193, 7, 0.18)',
                                    color: '#8a6d00',
                                    fontWeight: 600
                                }}
                            />
                        )}
                        {stock === 0 && (
                            <Chip
                                icon={<Cancel />}
                                label="Out of Stock"
                                size="small"
                                sx={{ 
                                    background: 'rgba(158, 158, 158, 0.2)',
                                    color: 'text.secondary',
                                    fontWeight: 600
                                }}
                            />
                        )}
                    </Stack>
                </Box>
                
                <CardContent sx={{ p: 1.5, display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        <Typography variant="subtitle2" sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: '0.9rem',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {name}
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: 'text.secondary',
                            mb: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {description}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.95rem' }}>
                            ₹{(priceTiers && priceTiers.length > 0 ? priceTiers[0].price : price).toLocaleString()}
                        </Typography>
                    </Box>

                    {stock !== 0 ? (
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            onClick={isInCart ? handleGoToCart : handleAddToCart}
                            startIcon={loading ? (
                                <CircularProgress size={16} color="inherit" thickness={5} />
                            ) : isInCart ? (
                                <CheckCircle />
                            ) : (
                                <ShoppingCart />
                            )}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 0.7
                            }}
                        >
                            {loading ? 'Adding...' : isInCart ? 'Go to Cart' : 'Add to Cart'}
                        </Button>
                    ) : (
                        <Box sx={{ height: 36 }} />
                    )}
                </CardContent>
            </StyledCard>

            {/* Snackbar for notifications */}
            <StyledSnackbar
                open={!!snackbar}
                autoHideDuration={4000}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar(null)} 
                    severity={snackbar?.severity || 'success'}
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {snackbar?.message}
                    </Box>
                    {snackbar?.showGoToCart && (
                        <Button
                            size="small"
                            onClick={handleGoToCart}
                            sx={{ 
                                color: 'inherit',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Go to Cart
                        </Button>
                    )}
                </Alert>
            </StyledSnackbar>

            {/* Removed custom spinner keyframes; using MUI CircularProgress */}
        </>
    );
};

export default React.memo(ProductItem); 