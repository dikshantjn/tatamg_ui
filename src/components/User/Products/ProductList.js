import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Skeleton,
    IconButton,
    Paper,
    Chip,
    Stack,
    useTheme,
    useMediaQuery,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    ArrowBack,
    Search,
    Visibility,
    Error,
    Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';
import ProductItem from './ProductItem';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(3),
    maxWidth: 1440,
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    }
}));

const HeaderCard = styled(Paper)(({ theme, categorycolor }) => ({
    background: categorycolor || 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    color: 'white',
    padding: theme.spacing(4),
    borderRadius: 20,
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 0,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        zIndex: 0,
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
        flexDirection: 'column',
        gap: theme.spacing(2),
        textAlign: 'center',
    }
}));

// Enhanced Product Skeleton with consistent sizing
const ProductSkeleton = () => (
    <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        }
    }}>
        {/* Image skeleton - fixed aspect ratio */}
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
            <Skeleton 
                variant="rectangular" 
                sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 0
                }} 
            />
        </Box>
        
        <CardContent sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: 2
        }}>
            {/* Product name skeleton */}
            <Skeleton 
                variant="text" 
                width="90%" 
                height={24} 
                sx={{ mb: 1 }} 
            />
            
            {/* Description skeleton - 2 lines */}
            <Skeleton 
                variant="text" 
                width="100%" 
                height={16} 
                sx={{ mb: 0.5 }} 
            />
            <Skeleton 
                variant="text" 
                width="70%" 
                height={16} 
                sx={{ mb: 2 }} 
            />
            
            {/* Price skeleton */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={40} height={16} />
            </Box>
            
            {/* Button skeleton */}
            <Skeleton 
                variant="rectangular" 
                height={40} 
                sx={{ 
                    borderRadius: 2,
                    mt: 'auto'
                }} 
            />
        </CardContent>
    </Card>
);

// Category color mapping
const categoryColors = {
    'Healthcare Products': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    'Medical Devices': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    'Personal Care': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    'Baby Care': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    'Nutrition': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    'Fitness': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    'Wellness': 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
    default: 'linear-gradient(135deg, #38A3A5, #2C7A7B)'
};

const ProductList = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    const decodedCategory = decodeURIComponent(category);
    const categoryColor = categoryColors[decodedCategory] || categoryColors.default;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedProducts = await VendorProductService.getProductsByCategory(category);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Check if it's a 404 error
                if (error.response?.status === 404) {
                    setError({
                        type: '404',
                        message: `No products available in ${decodedCategory} category yet. Please check back later.`
                    });
                } else {
                    setError({
                        type: 'error',
                        message: 'Failed to load products. Please try again later.'
                    });
                }
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category, decodedCategory]);

    const handleBack = () => {
        navigate(-1);
    };

    // Custom error message component
    const ErrorMessage = ({ error }) => (
        <Alert 
            severity={error.type === '404' ? 'info' : 'error'}
            icon={error.type === '404' ? <Info /> : <Error />}
            sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                    width: '100%'
                }
            }}
        >
            <AlertTitle sx={{ fontWeight: 600 }}>
                {error.type === '404' ? 'No Products Found' : 'Error Loading Products'}
            </AlertTitle>
                    {error.message}
        </Alert>
    );

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            py: 3
        }}>
            <StyledContainer maxWidth="xl">
                {/* Header */}
                <HeaderCard categorycolor={categoryColor} elevation={0}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.3)'
                                }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700,
                                mb: 0.5
                            }}>
                                {decodedCategory}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Explore our curated collection
                            </Typography>
                        </Box>
                    </Box>
                
                {/* Interactive geometric shapes */}
                    <Stack direction="row" spacing={2} sx={{ 
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(4px)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'rotate(15deg) scale(1.1)'
                            }
                        }} />
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(4px)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }} />
                        <Box sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(4px)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'rotate(-15deg) scale(1.1)'
                            }
                        }} />
                    </Stack>
                </HeaderCard>

            {error && <ErrorMessage error={error} />}

                {/* Products Grid */}
                <Grid container spacing={3}>
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <ProductSkeleton />
                            </Grid>
                    ))
                ) : products.length > 0 ? (
                        products.map((product, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
                                <ProductItem product={product} />
                            </Grid>
                    ))
                ) : (
                        <Grid item xs={12}>
                            <Box sx={{ 
                                textAlign: 'center', 
                                py: 8,
                                color: 'text.secondary'
                            }}>
                                <Search sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    No products found
                                </Typography>
                                <Typography variant="body1">
                                    We couldn't find any products in {decodedCategory}. Try browsing other categories.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ mt: 3 }}
                                >
                                    Go Back
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </StyledContainer>
        </Box>
    );
};

export default ProductList; 