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
    Skeleton,
    Avatar,
    Rating,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,
    Fade,
    Zoom
} from '@mui/material';
import {
    ShoppingCart,
    Visibility,
    Favorite,
    Warning,
    Cancel,
    LocalOffer,
    Star,
    Add,
    Remove,
    CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';
import { getUserId, isAuthenticated } from '../../../services/User/Auth/auth.utils';
import { fetchCartItems } from '../../../store/slices/cartSlice';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        borderColor: theme.palette.primary.main,
    },
    '& .MuiCardMedia-root': {
        transition: 'transform 0.3s ease',
    },
    '&:hover .MuiCardMedia-root': {
        transform: 'scale(1.05)',
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
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
                        height="200"
                        image={mainImage}
                        alt={name}
                        onError={() => {
                            console.log('Image load error');
                            setImageError(true);
                        }}
                        sx={{ 
                            objectFit: 'cover',
                            ...(imageError && { display: 'none' })
                        }}
                    />
                    
                    {imageError && (
                        <Box sx={{ 
                            height: 200, 
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
                        top: 12, 
                        left: 12,
                        zIndex: 2
                    }}>
                {stock <= 5 && stock > 0 && (
                            <Chip
                                icon={<Warning />}
                                label={`Only ${stock} left`}
                                size="small"
                                sx={{ 
                                    background: 'rgba(255, 193, 7, 0.9)',
                                    color: 'white',
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
                                    background: 'rgba(158, 158, 158, 0.9)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                )}
                    </Stack>
            
                    {/* Quick Actions Overlay */}
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                            opacity: 1
                        }
                    }}>
                        <IconButton size="small" sx={{ 
                            background: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { background: 'rgba(255, 255, 255, 1)' }
                        }}>
                            <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ 
                            background: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { background: 'rgba(255, 255, 255, 1)' }
                        }}>
                            <Favorite fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ 
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3
                        }}>
                            {name}
                        </Typography>
                        
                    {rating > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Rating 
                                    value={rating} 
                                    precision={0.1} 
                                    size="small" 
                                    readOnly
                                    sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    {rating.toFixed(1)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ({reviewCount} reviews)
                                </Typography>
                            </Box>
                    )}
                        
                        <Typography variant="body2" color="text.secondary" sx={{ 
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.4
                        }}>
                        {description}
                        </Typography>
                    
                    {highlights && highlights.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                            {highlights.slice(0, 2).map((highlight, index) => (
                                    <Box key={index} sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        mb: 0.5 
                                    }}>
                                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                    {highlight}
                                        </Typography>
                                    </Box>
                            ))}
                            </Box>
                    )}
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                        {priceTiers && priceTiers.length > 0 ? (
                                    <Box>
                                {priceTiers.slice(0, 1).map((tier, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                                    ₹{tier.price.toLocaleString()}
                                                </Typography>
                                                <Chip 
                                                    label={tier.name}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            </Box>
                                ))}
                                    </Box>
                        ) : (
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                        ₹{price.toLocaleString()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            disabled={stock === 0 || loading}
                        onClick={isInCart ? handleGoToCart : handleAddToCart}
                            startIcon={loading ? (
                                <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    border: '2px solid transparent',
                                    borderTop: '2px solid currentColor',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                        ) : isInCart ? (
                                <CheckCircle />
                            ) : (
                                stock === 0 ? <Cancel /> : <ShoppingCart />
                            )}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                ...(isInCart && {
                                    background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #43A047, #5CB85C)'
                                    }
                                })
                            }}
                        >
                            {loading ? 'Adding...' : isInCart ? 'Go to Cart' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </Box>
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

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default ProductItem; 