import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Chip,
    Skeleton,

    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ArrowBackIos,
    ArrowForwardIos,
    Category,
    FavoriteBorder,
    ShoppingCart,

} from '@mui/icons-material';
import { productCategories } from './ProductCategories';
import TopOfferStrip from '../../TopOfferStrip';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';

// Import actual images from assets
import otc from '../../../assets/otc.jpg';
import wearable from '../../../assets/wearable.jpg';
import nonwearable from '../../../assets/nonwearable.jpg';
import drops from '../../../assets/drops.jpg';
import consult from '../../../assets/consult.jpg';
import instant from '../../../assets/instant.jpg';
import physio from '../../../assets/physio.jpg';
import dentist from '../../../assets/dentist.jpg';

// Category color mapping with soft pastel colors
const categoryColors = {
    'Dental Care': { bg: '#E3F2FD', icon: '#1976D2' },
    'Genetic Testing': { bg: '#E8F5E9', icon: '#388E3C' },
    'Heart Care': { bg: '#FFEBEE', icon: '#D32F2F' },
    'Baby Care': { bg: '#F3E5F5', icon: '#7B1FA2' },
    'Elder Care': { bg: '#FFF3E0', icon: '#F57C00' },
    'Women Care': { bg: '#FCE4EC', icon: '#C2185B' },
    'Digital Health Tracker': { bg: '#E0F7FA', icon: '#0097A7' },
    'Digital Health Ring': { bg: '#E8F5E9', icon: '#388E3C' },
    'Epilepsy Care': { bg: '#E3F2FD', icon: '#1976D2' },
    'UTI Test Kit': { bg: '#F3E5F5', icon: '#7B1FA2' },
    'Wellness Care Kit': { bg: '#FFF3E0', icon: '#F57C00' },
    'Pregnancy Care': { bg: '#FCE4EC', icon: '#C2185B' },
    'Wound Care': { bg: '#E0F7FA', icon: '#0097A7' },
    'Portable ECG': { bg: '#E8F5E9', icon: '#388E3C' },
    'Period Care': { bg: '#F3E5F5', icon: '#7B1FA2' },
    default: { bg: '#E3F2FD', icon: '#1976D2' }
};

// Category Card Component
const CategoryCard = ({ category }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const categoryStyle = categoryColors[category.name] || categoryColors.default;

    const handleClick = () => {
        navigate(`/products/${encodeURIComponent(category.name)}`);
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                width: 200,
                height: 200,
                cursor: 'pointer',
                borderRadius: 2,
                background: categoryStyle.bg,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                }}
            >
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    <category.icon 
                        size={32} 
                        style={{ color: categoryStyle.icon }} 
                    />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: '1rem',
                        lineHeight: 1.2
                    }}
                >
                    {category.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem'
                    }}
                >
                    {category.subCategories.length} items
                </Typography>
            </Box>
        </Card>
    );
};

// Product Card Component
const ProductCard = ({ product }) => {
    const theme = useTheme();
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                },
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                        alt={product.name}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    sx={{
                        objectFit: 'cover',
                        opacity: imageLoading ? 0 : 1,
                        transition: 'opacity 0.3s ease'
                    }}
                />
                {imageLoading && (
                    <Skeleton
                        variant="rectangular"
                        height={200}
                        sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                    />
                )}
                {imageError && (
                    <Box
                        sx={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: theme.palette.grey[100],
                            color: theme.palette.text.secondary
                        }}
                    >
                        <Typography variant="body2">Image not available</Typography>
                    </Box>
                )}
                
                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                    {product.discount > 0 && (
                        <Chip
                            label={`${product.discount}% OFF`}
                            size="small"
                            sx={{
                                background: theme.palette.error.main,
                                color: 'white',
                                fontWeight: 600
                            }}
                        />
                )}
                {product.stock === 'low' && (
                        <Chip
                            label="Low Stock"
                            size="small"
                            sx={{
                                background: theme.palette.warning.main,
                                color: 'white',
                                fontWeight: 600
                            }}
                        />
                )}
                {product.stock === 'out' && (
                        <Chip
                            label="Out of Stock"
                            size="small"
                            sx={{
                                background: theme.palette.grey[500],
                                color: 'white',
                                fontWeight: 600
                            }}
                        />
                    )}
                </Box>

                {/* Action buttons */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <IconButton
                        size="small"
                        sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 1)'
                            }
                        }}
                    >
                        <FavoriteBorder fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <CardContent sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        height: '2.6em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {product.name}
                </Typography>
                
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 2,
                        height: '2.4em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {product.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                fontSize: '1.125rem'
                            }}
                        >
                            ₹{product.currentPrice.toLocaleString()}
                        </Typography>
                        {product.originalPrice && (
                            <Typography
                                variant="body2"
                                sx={{
                                    textDecoration: 'line-through',
                                    color: theme.palette.text.secondary,
                                    fontSize: '0.875rem'
                                }}
                            >
                                ₹{product.originalPrice.toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                    {product.discount > 0 && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.success.main,
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        >
                            Save {product.discount}%
                        </Typography>
                    )}
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    disabled={product.stock === 'out'}
                    startIcon={<ShoppingCart />}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1
                    }}
                >
                    {product.stock === 'out' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </CardContent>
        </Card>
    );
};

// Scrollable Categories Section
const ScrollableCategories = ({ title, subtitle, categories, showArrows = true }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkScrollPosition);
            checkScrollPosition();
            
            return () => {
                scrollElement.removeEventListener('scroll', checkScrollPosition);
            };
        }
    }, []);

    return (
        <Box sx={{ mb: 6 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: theme.palette.text.primary
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 3
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    {showArrows && !isMobile && showLeftArrow && (
                        <IconButton
                            onClick={() => handleScroll('left')}
                            sx={{
                                position: 'absolute',
                                left: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                background: theme.palette.background.paper,
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    background: theme.palette.background.paper
                                }
                            }}
                            aria-label="Scroll left"
                        >
                            <ArrowBackIos fontSize="small" />
                        </IconButton>
                    )}

                    <Box
                        ref={scrollRef}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            pb: 2
                        }}
                    >
                        {categories.map((category, index) => (
                            <Box key={index} sx={{ flexShrink: 0 }}>
                                <CategoryCard category={category} />
                            </Box>
                        ))}
                    </Box>

                    {showArrows && !isMobile && showRightArrow && (
                        <IconButton
                            onClick={() => handleScroll('right')}
                            sx={{
                                position: 'absolute',
                                right: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                background: theme.palette.background.paper,
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    background: theme.palette.background.paper
                                }
                            }}
                            aria-label="Scroll right"
                        >
                            <ArrowForwardIos fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

// Products Grid Section
const ProductsGrid = ({ title, subtitle, products, loading }) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 6 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: theme.palette.text.primary
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 3
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                {loading ? (
                    <Grid container spacing={3}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{ height: '100%', borderRadius: 2 }}>
                                    <Skeleton variant="rectangular" height={200} />
                                    <CardContent sx={{ p: 2 }}>
                                        <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                                        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                                        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                                        <Skeleton variant="rectangular" height={40} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : products.length > 0 ? (
                    <Grid container spacing={3}>
                        {products.map((product, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || index}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            color: theme.palette.text.secondary
                        }}
                    >
                        <Category sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            No products found
                        </Typography>
                        <Typography variant="body1">
                            We couldn't find any products in this category. Try browsing other categories.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await VendorProductService.getAllProducts();
                if (response && response.data) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Sample product data with actual images
    const sampleProducts = [
        {
            id: 1,
            name: "Digital Blood Pressure Monitor",
            description: "Accurate readings with memory function for continuous health monitoring",
            image: wearable,
            currentPrice: 1299,
            originalPrice: 1999,
            discount: 35,
            prescription: false,
            stock: 'in'
        },
        {
            id: 2,
            name: "Smart Fitness Tracker",
            description: "24/7 health monitoring with GPS and heart rate tracking",
            image: nonwearable,
            currentPrice: 2499,
            originalPrice: 3499,
            discount: 29,
            prescription: false,
            stock: 'low'
        },
        {
            id: 3,
            name: "OTC Pain Relief Medicine",
            description: "Effective relief for chronic condition management",
            image: otc,
            currentPrice: 450,
            originalPrice: null,
            discount: 0,
            prescription: false,
            stock: 'in'
        },
        {
            id: 4,
            name: "Portable ECG Monitor",
            description: "Professional grade heart monitoring device",
            image: drops,
            currentPrice: 8999,
            originalPrice: 12999,
            discount: 31,
            prescription: false,
            stock: 'out'
        },
        {
            id: 5,
            name: "Digital Thermometer",
            description: "Fast and accurate temperature readings",
            image: consult,
            currentPrice: 299,
            originalPrice: 499,
            discount: 40,
            prescription: false,
            stock: 'in'
        },
        {
            id: 6,
            name: "Pulse Oximeter",
            description: "Monitor oxygen saturation levels accurately",
            image: instant,
            currentPrice: 899,
            originalPrice: 1299,
            discount: 31,
            prescription: false,
            stock: 'in'
        },
        {
            id: 7,
            name: "Physiotherapy Equipment",
            description: "Professional rehabilitation tools for recovery",
            image: physio,
            currentPrice: 1599,
            originalPrice: 2499,
            discount: 36,
            prescription: false,
            stock: 'in'
        },
        {
            id: 8,
            name: "Dental Care Kit",
            description: "Complete oral hygiene solution for daily care",
            image: dentist,
            currentPrice: 799,
            originalPrice: 1199,
            discount: 33,
            prescription: false,
            stock: 'low'
        }
    ];

    // Popular categories (first 6)
    const popularCategories = productCategories.slice(0, 6);
    
    // Electronic categories (filtered by digital/electronic keywords)
    const electronicCategories = productCategories.filter(cat => 
        cat.name.toLowerCase().includes('digital') || 
        cat.name.toLowerCase().includes('ecg') ||
        cat.name.toLowerCase().includes('monitor')
    );
    
    // Personal care categories (filtered by care keywords)
    const personalCareCategories = productCategories.filter(cat => 
        cat.name.toLowerCase().includes('care') && 
        !cat.name.toLowerCase().includes('digital') &&
        !cat.name.toLowerCase().includes('ecg')
    );

    // Use API products if available, otherwise use sample data
    const displayProducts = products.length > 0 ? products : sampleProducts;

    return (
        <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
            <TopOfferStrip />

            {/* Popular Categories */}
            <ScrollableCategories
                title="Popular Categories"
                subtitle="Explore our most sought-after health categories"
                categories={popularCategories}
            />

            {/* Featured Products */}
            <ProductsGrid
                title="Featured Products"
                subtitle="Handpicked products for your health and wellness"
                products={displayProducts}
                loading={loading}
            />

            {/* Electronic Health Devices */}
            <ScrollableCategories
                title="Electronic Health Devices"
                subtitle="Smart devices for modern healthcare"
                categories={electronicCategories}
            />

            {/* Personal Care Categories */}
            <ScrollableCategories
                title="Personal Care"
                subtitle="Essential products for daily wellness"
                categories={personalCareCategories}
            />
        </Box>
    );
}

export default Products; 