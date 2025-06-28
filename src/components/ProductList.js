import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VendorProductService } from '../services/vendor-product.service';
import ProductItem from './ProductItem';
import './ProductList.css';
import { colors } from '../styles/colors';

// Category color mapping
const categoryColors = {
    'Healthcare Products': colors.primary,
    'Medical Devices': colors.primary,
    'Personal Care': colors.primary,
    'Baby Care': colors.primary,
    'Nutrition': colors.primary,
    'Fitness': colors.primary,
    'Wellness': colors.primary,
    default: colors.primary
};

// Image Fallback Icon Component
const ImageIcon = () => (
    <svg className="image-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>
);

// Skeleton Loading Component
const ProductCardSkeleton = () => (
    <div className="skeleton">
        <div className="skeleton-image">
            <ImageIcon />
            <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-rating">
                <div className="skeleton-star"></div>
                <div className="skeleton-star"></div>
                <div className="skeleton-star"></div>
                <div className="skeleton-star"></div>
                <div className="skeleton-star"></div>
            </div>
            <div className="skeleton-price"></div>
            <div className="skeleton-button"></div>
        </div>
    </div>
);

const ProductList = () => {
    const { category } = useParams();
    const navigate = useNavigate();
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
        <div className={`error-message ${error.type}`}>
            {error.type === '404' ? (
                <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24, marginRight: 8 }}>
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <div className="error-content">
                        <h3>No Products Found</h3>
                        <p>{error.message}</p>
                    </div>
                </>
            ) : (
                <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, marginRight: 8 }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error.message}
                </>
            )}
        </div>
    );

    return (
        <div className="product-list-container" style={{ '--primary-color': colors.primary }}>
            <div className="product-list-header" style={{'--category-color': categoryColor}}>
                <div className="header-content">
                    <button className="back-button" onClick={handleBack} title="Go back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h1 className="category-title" title={decodedCategory}>{decodedCategory}</h1>
                </div>
                
                {/* Interactive geometric shapes */}
                <div className="header-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>

                {/* Background decorative shapes */}
                <div className="background-shapes">
                    <div className="bg-shape bg-shape-1"></div>
                    <div className="bg-shape bg-shape-2"></div>
                    <div className="bg-shape bg-shape-3"></div>
                </div>
            </div>

            {error && <ErrorMessage error={error} />}

            <div className="products-grid">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                ) : products.length > 0 ? (
                    products.map(product => (
                        <ProductItem 
                            key={product.productId} 
                            product={product}
                        />
                    ))
                ) : (
                    <div className="no-products-message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, marginBottom: 16, opacity: 0.5 }}>
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <p>No products found in {decodedCategory}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList; 